"""
telemetry_service.py
====================
Telemetry data fetch + write subsystem extracted from app.py on 2026-05-06.

Same plug-in pattern as upload/weather/band services:
    telemetry_service.register(app, ctx)

Endpoints registered:
  GET/POST /api/data-mode
  GET      /api/data
  GET      /api/telemetry-status
  GET      /api/telemetry-raw
  GET/POST /api/collector-config
  GET      /api/collector-log
  POST     /api/write-point
  GET      /api/equipment-points/<equipment_name>
  GET      /api/write-history
  GET      /api/trend-history
"""
# Required SERVICE_CTX keys — validated by app.py auto-discovery.
_service_dependencies = ['DATA_ROOT', 'get_psat', 'get_w', 'get_h', 'ahu_records']
import os
import sys
import time
import math
import json
import random
import datetime

from flask import jsonify, request


# Filled in by register().
DATA_ROOT = None
CONFIG_DIR = None
TELEMETRY_PATH = None
COLLECTOR_CONFIG_PATH = None

# Psychrometric helpers + mock seeds get injected via ctx (they live in
# app.py because they are also used outside the telemetry subsystem).
get_psat = None
get_w = None
get_h = None
ahu_records = None


# ---------------- BLOCK A: helpers (telemetry + write history) ----------------
# --- TELEMETRY INTEGRATION ---
# CONFIG_DIR / TELEMETRY_PATH / COLLECTOR_CONFIG_PATH are populated by
# register() once DATA_ROOT is known (importing this module before app.py
# has finalized DATA_ROOT must be safe).
CONFIG_DIR = None
TELEMETRY_PATH = None
COLLECTOR_CONFIG_PATH = None

# Try to import dibt for write commands
DIBT_AVAILABLE = False
try:
    import dibt
    DIBT_AVAILABLE = True
except ImportError:
    pass

# Write command history (in-memory, last 100)
_write_history = []
WRITE_HISTORY_MAX = 100

# Sim-mode write overrides: persists UI-originated writes so they reflect in /api/data
# while the background simulator keeps regenerating random values. Keyed by
# (equipment_name -> {label: (value, timestamp)}). Entries persist until explicitly
# overwritten by another write — this matches real BACnet setpoint behavior.
_sim_overrides = {}

def _record_write(equip_name, writes, csv_object, csv_value, success, mock=False):
    """Record a write command in history, and cache value as sim override.
    Overrides persist until the next write for that (equip, label)."""
    if mock and success:
        per_equip = _sim_overrides.setdefault(equip_name, {})
        for k, v in (writes or {}).items():
            per_equip[k] = v
    _write_history.append({
        'timestamp': time.time(),
        'timestamp_iso': time.strftime('%Y-%m-%dT%H:%M:%S'),
        'equipment': equip_name,
        'writes': writes,
        'csv_object': csv_object,
        'csv_value_len': len(csv_value),
        'success': success,
        'mock': mock
    })
    if len(_write_history) > WRITE_HISTORY_MAX:
        _write_history.pop(0)


_last_good_telemetry = None

def _load_telemetry():
    """Load telemetry.json written by collector.py. Returns None if unavailable.
    On read/parse failure (e.g. collector mid-write), returns the last-good
    cached snapshot so the dashboard doesn't flicker between full and empty
    VAV lists.
    """
    global _last_good_telemetry
    if os.path.isfile(TELEMETRY_PATH):
        try:
            with open(TELEMETRY_PATH, 'r') as f:
                data = json.load(f)
            # Check freshness: if older than 60s, mark as stale
            ts = data.get('timestamp', 0)
            age = time.time() - ts
            data['age_seconds'] = round(age, 1)
            data['stale'] = age > 60
            _last_good_telemetry = data
            return data
        except (json.JSONDecodeError, IOError):
            # Mid-write collision or corrupt file — fall back to last-good snapshot
            if _last_good_telemetry is not None:
                return _last_good_telemetry
    return None


def _load_collector_config():
    """Load collector_config.json."""
    if os.path.isfile(COLLECTOR_CONFIG_PATH):
        try:
            with open(COLLECTOR_CONFIG_PATH, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            pass
    return {}


def _get_equipment_point_defs(equipment_types, equip_type, type_id):
    """Get point definitions for an equipment type."""
    type_key = 'ahu_types' if equip_type == 'ahu' else 'vav_types'
    type_data = equipment_types.get(type_key, {}).get(str(type_id), {})
    return type_data.get('points', [])


def _build_write_csv(point_defs, write_dict):
    """Build CSV write string: empty for non-written positions, value for RW positions being written, '*' at end."""
    parts = []
    for pt in point_defs:
        label = pt.get('label', '')
        access = pt.get('access', 'RO')
        if label in write_dict and access == 'RW':
            parts.append(str(write_dict[label]))
        else:
            parts.append('')
    return ','.join(parts) + '*'




# ---------------- BLOCK B: data-mode + /api/data ----------------
# --- Data mode state (persisted in memory; switchable from dashboard) ---
_data_mode = 'simulator'   # 'simulator' or 'mock'


# --- API ENDPOINTS ---

def data_mode_api():
    """Get or set the data source mode: 'simulator' or 'mock'."""
    global _data_mode
    if request.method == 'POST':
        mode = (request.json or {}).get('mode', '').lower()
        if mode in ('simulator', 'mock'):
            _data_mode = mode
            return jsonify({'success': True, 'mode': _data_mode})
        return jsonify({'success': False, 'error': "mode must be 'simulator' or 'mock'"}), 400
    return jsonify({'success': True, 'mode': _data_mode})


def api_data():
    """
    Returns telemetry in dashboard format.
    Mode is controlled by _data_mode ('simulator' | 'mock'), switchable from dashboard.
      simulator: reads telemetry.json, falls back to collector_config mock if file absent.
      mock:      generates 14 random demo AHUs with psychrometric math.
    """
    global _data_mode
    mode = request.args.get('mode', _data_mode).lower()

    if mode == 'mock':
        return _mock_14_ahus()

    # --- Simulator / Collector mode ---
    telemetry = _load_telemetry()
    collector_config = _load_collector_config()
    dashboard_map = collector_config.get('dashboard_point_map', {
        'ahu': {'oa_t': 'OAT', 'oa_rh': 'OAH', 'sa_t': 'SAT', 'sa_rh': 'SAH'},
        'vav': {'zone_t': 't', 'zone_rh': 'rh'}
    })

    if telemetry and telemetry.get('equipment'):
        output = []
        equip_data = telemetry['equipment']
        proc_colors = ['#6366f1', '#8b5cf6', '#f59e0b', '#ec4899', '#14b8a6', '#f97316']
        color_idx = 0
        for ahu_name, ahu_data in equip_data.items():
            if ahu_data.get('type') != 'ahu':
                continue
            pts = ahu_data.get('points', {})
            ahu_map = dashboard_map.get('ahu', {})
            oa_t = pts.get(ahu_map.get('oa_t', 'OAT'))
            oa_rh = pts.get(ahu_map.get('oa_rh', 'OAH'))
            sa_t = pts.get(ahu_map.get('sa_t', 'SAT'))
            sa_rh = pts.get(ahu_map.get('sa_rh', 'SAH'))
            if oa_t is None: oa_t = 12.0
            if oa_rh is None: oa_rh = 70.0
            if sa_t is None: sa_t = 16.0
            if sa_rh is None: sa_rh = 55.0
            vav_map = dashboard_map.get('vav', {})
            embedded_vavs = ahu_data.get('vavs', {})

            # VAV identity list is PINNED to the static collector_config → matches map_config.json.
            # Telemetry only supplies values; missing/empty telemetry shows VAV with defaults,
            # never drops it from the list (prevents flicker between telemetry writes).
            _cfg_grp = collector_config.get('ahu_groups', {}).get(ahu_name, {})
            _cfg_vav_names = _cfg_grp.get('vavs', [])
            if not _cfg_vav_names:
                # No static list configured → fall back to whatever telemetry has
                _cfg_vav_names = list(embedded_vavs.keys())

            vav_list, vav_temps, vav_rhs = [], [], []
            for vav_name in _cfg_vav_names:
                vav_data = embedded_vavs.get(vav_name, {})
                vav_pts = vav_data.get('points', {}) if isinstance(vav_data, dict) else {}
                # Apply sim-mode overrides for writes issued from UI
                if _sim_overrides.get(vav_name):
                    vav_pts = {**vav_pts, **_sim_overrides[vav_name]}
                vt = vav_pts.get(vav_map.get('zone_t', 't'))
                vrh = vav_pts.get(vav_map.get('zone_rh', 'rh'))
                if vt is None: vt = 22.0
                if vrh is None: vrh = 45.0
                vw = get_w(vt, vrh)
                vav_list.append({"id": vav_name, "t": vt, "rh": vrh, "w": vw, "h": get_h(vt, vw), "all_points": vav_pts})
                vav_temps.append(vt); vav_rhs.append(vrh)
            ra_t = sum(vav_temps) / len(vav_temps) if vav_temps else 24.0
            ra_rh = sum(vav_rhs) / len(vav_rhs) if vav_rhs else 50.0
            # Apply AHU-level sim overrides
            if _sim_overrides.get(ahu_name):
                pts = {**pts, **_sim_overrides[ahu_name]}
            ahu_entry = {
                "id": ahu_name, "procColor": proc_colors[color_idx % len(proc_colors)],
                "source": "live" if not telemetry.get('mock_mode') else "simulator",
                "points": [
                    {"label": "OA", "t": oa_t, "rh": oa_rh, "w": get_w(oa_t, oa_rh), "color": "#3b82f6"},
                    {"label": "SA", "t": sa_t, "rh": sa_rh, "w": get_w(sa_t, sa_rh), "color": "#10b981"},
                    {"label": "RA", "t": ra_t, "rh": ra_rh, "w": get_w(ra_t, ra_rh), "color": "#f43f5e"},
                ],
                "all_points": pts, "vavs": vav_list
            }
            output.append(ahu_entry); color_idx += 1
        return jsonify(output)

    # --- Simulator fallback (telemetry.json not yet written) ---
    return _sim_fallback_from_config(collector_config)


def _sim_fallback_from_config(collector_config):
    """Simulator fallback: generates data for AHUs defined in collector_config.json."""
    proc_colors = ['#6366f1', '#8b5cf6', '#f59e0b', '#ec4899', '#14b8a6', '#f97316']
    ahu_groups = collector_config.get('ahu_groups', {})
    output = []
    color_idx = 0
    for ahu_id, grp in ahu_groups.items():
        oa_t = 22.0 + 5.0 * math.sin(time.time() / 600.0) + random.gauss(0, 0.3)
        oa_w = 0.003 + 0.0004 * oa_t + random.gauss(0, 0.0005)
        oa_w = max(0.002, min(0.025, oa_w))
        ps_oa = get_psat(oa_t)
        oa_rh = ((101.325 * oa_w / (0.621945 + oa_w)) / ps_oa * 100.0) if ps_oa > 0 else 70.0
        oa_rh = max(15.0, min(98.0, oa_rh))
        sa_t = max(11.0, min(18.0, 15.0 + random.gauss(0, 0.3)))
        sa_rh = max(85.0, min(98.0, 92.0 + random.gauss(0, 1.5)))
        vav_list, vav_temps, vav_rhs = [], [], []
        for vav_name in grp.get('vavs', []):
            vt = max(20.0, min(28.0, 23.0 + random.gauss(0, 0.8)))
            v_w = max(0.005, min(0.014, 0.009 + random.gauss(0, 0.001)))
            ps_v = get_psat(vt)
            vrh = ((101.325 * v_w / (0.621945 + v_w)) / ps_v * 100.0) if ps_v > 0 else 48.0
            vrh = max(25.0, min(70.0, vrh))
            vw = get_w(vt, vrh)
            vav_list.append({"id": vav_name, "t": vt, "rh": vrh, "w": vw, "h": get_h(vt, vw)})
            vav_temps.append(vt); vav_rhs.append(vrh)
        ra_t = sum(vav_temps) / len(vav_temps) if vav_temps else 24.0
        ra_rh = sum(vav_rhs) / len(vav_rhs) if vav_rhs else 50.0
        output.append({
            "id": ahu_id, "procColor": proc_colors[color_idx % len(proc_colors)],
            "source": "simulator_fallback",
            "points": [
                {"label": "OA", "t": oa_t, "rh": oa_rh, "w": get_w(oa_t, oa_rh), "color": "#3b82f6"},
                {"label": "SA", "t": sa_t, "rh": sa_rh, "w": get_w(sa_t, sa_rh), "color": "#10b981"},
                {"label": "RA", "t": ra_t, "rh": ra_rh, "w": get_w(ra_t, ra_rh), "color": "#f43f5e"},
            ],
            "all_points": dict(_sim_overrides.get(ahu_id, {})),
            "vavs": vav_list
        })
        color_idx += 1
    return jsonify(output)


def _mock_14_ahus():
    """Generate 14 demo AHUs with psychrometrically consistent random data."""
    output = []
    for ahu_id, data in ahu_records.items():
        base = data.get("base_t", 22.0) + random.uniform(-0.05, 0.05)
        data["base_t"] = base
        oa_t = 22.0 + 5.0 * math.sin(time.time() / 600.0) + random.gauss(0, 0.3)
        oa_w = 0.003 + 0.0004 * oa_t + random.gauss(0, 0.0005)
        oa_w = max(0.002, min(0.025, oa_w))
        ps_oa = get_psat(oa_t)
        oa_rh = ((101.325 * oa_w / (0.621945 + oa_w)) / ps_oa * 100.0) if ps_oa > 0 else 70.0
        oa_rh = max(15.0, min(98.0, oa_rh))
        sa_t = max(11.0, min(18.0, base - 6.0 + random.gauss(0, 0.3)))
        sa_rh = max(85.0, min(98.0, 92.0 + random.gauss(0, 1.5)))
        vav_list, vav_temps, vav_rhs = [], [], []
        parts = ahu_id.split('-')
        vav_prefix = f"{parts[1]}{parts[2]}" if len(parts) > 2 else parts[1]
        for v in range(1, 10):
            vt = max(20.0, min(28.0, 23.0 + random.gauss(0, 0.8)))
            v_w = max(0.005, min(0.014, 0.009 + random.gauss(0, 0.001)))
            ps_v = get_psat(vt)
            vrh = ((101.325 * v_w / (0.621945 + v_w)) / ps_v * 100.0) if ps_v > 0 else 48.0
            vrh = max(25.0, min(70.0, vrh))
            vw = get_w(vt, vrh)
            vav_list.append({"id": f"VAV-{vav_prefix}-{v:02d}", "t": vt, "rh": vrh, "w": vw, "h": get_h(vt, vw)})
            vav_temps.append(vt); vav_rhs.append(vrh)
        ra_t = sum(vav_temps) / len(vav_temps) if vav_temps else base
        ra_rh = sum(vav_rhs) / len(vav_rhs) if vav_rhs else 50.0
        output.append({
            "id": ahu_id, "procColor": data["procColor"],
            "source": "mock",
            "points": [
                {"label": "OA", "t": oa_t, "rh": oa_rh, "w": get_w(oa_t, oa_rh), "color": "#3b82f6"},
                {"label": "SA", "t": sa_t, "rh": sa_rh, "w": get_w(sa_t, sa_rh), "color": "#10b981"},
                {"label": "RA", "t": ra_t, "rh": ra_rh, "w": get_w(ra_t, ra_rh), "color": "#f43f5e"},
            ],
            "vavs": vav_list
        })
    return jsonify(output)


# ---------------- BLOCK C: diagnostics + write routes ----------------
def telemetry_status():
    """Check if live telemetry collector is running and data is fresh."""
    telemetry = _load_telemetry()
    if telemetry:
        return jsonify({
            'success': True,
            'live': True,
            'mock_mode': telemetry.get('mock_mode', True),
            'timestamp': telemetry.get('timestamp'),
            'timestamp_iso': telemetry.get('timestamp_iso'),
            'age_seconds': telemetry.get('age_seconds'),
            'stale': telemetry.get('stale', True),
            'equipment_count': telemetry.get('equipment_count', 0),
            'read_ok': telemetry.get('read_ok', 0),
            'read_errors': telemetry.get('read_errors', 0),
            'collector_version': telemetry.get('collector_version', 'unknown')
        })
    return jsonify({
        'success': True,
        'live': False,
        'mock_mode': True,
        'message': 'No telemetry.json found. Collector may not be running.'
    })


def telemetry_raw():
    """Return raw telemetry.json contents for debugging."""
    telemetry = _load_telemetry()
    if telemetry:
        return jsonify(telemetry)
    return jsonify({'success': False, 'error': 'No telemetry data available.'})


def collector_config_api():
    """Get or update collector configuration."""
    if request.method == 'POST':
        try:
            new_config = request.json
            if not new_config:
                return jsonify({'success': False, 'error': 'No JSON body'}), 400
            os.makedirs(CONFIG_DIR, exist_ok=True)
            with open(COLLECTOR_CONFIG_PATH, 'w') as f:
                json.dump(new_config, f, indent=2)
            return jsonify({'success': True, 'message': 'Collector config saved.', 'config': new_config})
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500
    else:
        config = _load_collector_config()
        return jsonify({'success': True, 'config': config})


def collector_log():
    """Return recent collector log entries."""
    log_path = os.path.join(CONFIG_DIR, 'collector_log.json')
    if os.path.isfile(log_path):
        try:
            with open(log_path, 'r') as f:
                return jsonify({'success': True, 'entries': json.load(f)})
        except:
            pass
    return jsonify({'success': True, 'entries': []})


def write_point():
    """
    Write a value to an RW BACnet point via dibt.Write().

    Body JSON:
    {
        "equipment_name": "AHU-01-E",   (or "VAV-01E-01")
        "writes": {"OAD": 75, "HSP": 50}
    }

    The CSV object belongs to the parent AHU group.
    Builds a full-group CSV write string (AHU+VAV positions) with '*' suffix.
    """
    try:
        data = request.json
        equip_name = data.get('equipment_name', '')
        writes = data.get('writes', {})

        if not equip_name or not writes:
            return jsonify({'success': False, 'error': 'equipment_name and writes required'}), 400

        config = _load_collector_config()
        ahu_groups = config.get('ahu_groups', {})

        # Load equipment types
        equipment_types = _load_json(
            os.path.join(CONFIG_DIR, 'equipment_types.json'),
            os.path.join('/root/data', 'equipment_types.json')
        )
        if not equipment_types:
            return jsonify({'success': False, 'error': 'equipment_types.json not found'}), 404

        # Load map_config for type wiring
        map_config = _load_json(
            os.path.join(CONFIG_DIR, 'map_config.json'),
            os.path.join('/root/data', 'map_config.json')
        )
        equip_lookup = {}
        for floor in map_config.get('floors', []):
            for marker in floor.get('markers', []):
                n = marker.get('name', '')
                if n:
                    equip_lookup[n] = {
                        'type': marker.get('type', ''),
                        'type_id': str(marker.get('equipment_type_id', '1'))
                    }

        # Find which AHU group this equipment belongs to
        target_ahu = None
        target_is_vav = False
        for ahu_name, group_cfg in ahu_groups.items():
            if equip_name == ahu_name:
                target_ahu = ahu_name
                break
            if equip_name in group_cfg.get('vavs', []):
                target_ahu = ahu_name
                target_is_vav = True
                break

        if not target_ahu:
            return jsonify({'success': False, 'error': f'"{equip_name}" not found in any AHU group'}), 404

        group_cfg = ahu_groups[target_ahu]
        csv_object = group_cfg.get('csv_object', '')
        if not csv_object:
            return jsonify({'success': False, 'error': f'No csv_object for group {target_ahu}'}), 400

        # Get point definitions for the target equipment
        target_info = equip_lookup.get(equip_name, {})
        target_type = target_info.get('type', 'vav' if target_is_vav else 'ahu')
        target_type_id = target_info.get('type_id', '1')
        target_point_defs = _get_equipment_point_defs(equipment_types, target_type, target_type_id)

        # Validate RW access
        rw_labels = {pt['label'] for pt in target_point_defs if pt.get('access') == 'RW'}
        invalid = [k for k in writes if k not in rw_labels]
        if invalid:
            return jsonify({'success': False, 'error': f'Points not writable (not RW): {invalid}'}), 400

        # Build the full group CSV (AHU + all VAVs)
        ahu_info = equip_lookup.get(target_ahu, {})
        ahu_type_id = ahu_info.get('type_id', '1')
        ahu_point_defs = _get_equipment_point_defs(equipment_types, 'ahu', ahu_type_id)

        parts = []
        # AHU segment
        for pt in ahu_point_defs:
            label = pt.get('label', '')
            access = pt.get('access', 'RO')
            if not target_is_vav and label in writes and access == 'RW':
                parts.append(str(writes[label]))
            else:
                parts.append('')

        # VAV segments
        for vav_name in group_cfg.get('vavs', []):
            vav_info = equip_lookup.get(vav_name, {})
            vav_type_id = vav_info.get('type_id', '1')
            vav_point_defs = _get_equipment_point_defs(equipment_types, 'vav', vav_type_id)
            for pt in vav_point_defs:
                label = pt.get('label', '')
                access = pt.get('access', 'RO')
                if target_is_vav and equip_name == vav_name and label in writes and access == 'RW':
                    parts.append(str(writes[label]))
                else:
                    parts.append('')

        csv_value = ','.join(parts) + '*'

        # Execute write
        if DIBT_AVAILABLE:
            ref = f'{csv_object}.Present_Value'
            result = dibt.Write(ref, Value=csv_value)
            if isinstance(result, dibt.Error):
                _record_write(equip_name, writes, csv_object, csv_value, False)
                return jsonify({'success': False, 'error': f'BACnet write failed: {result}'}), 500
            # Also cache as a UI override so the value reflects immediately even if the
            # simulator is running in the background and overwrites telemetry.json.
            _record_write(equip_name, writes, csv_object, csv_value, True, mock=True)
            return jsonify({
                'success': True,
                'message': f'Written to {csv_object}',
                'csv_object': csv_object,
                'csv_value': csv_value,
                'target': equip_name,
                'writes': writes
            })
        else:
            print(f'[WRITE-POINT MOCK] {csv_object}.Present_Value = {csv_value}')
            _record_write(equip_name, writes, csv_object, csv_value, True, mock=True)
            return jsonify({
                'success': True,
                'message': f'[MOCK] Would write to {csv_object}',
                'mock': True,
                'csv_object': csv_object,
                'csv_value': csv_value,
                'target': equip_name,
                'writes': writes
            })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


def equipment_points(equipment_name):
    """Get current point values for a specific equipment from telemetry.
    Supports both AHU names and VAV names (VAVs are embedded under AHU entries)."""
    telemetry = _load_telemetry()
    if not telemetry or not telemetry.get('equipment'):
        return jsonify({'success': False, 'error': 'No telemetry data available'}), 404

    # Try as AHU first
    equip = telemetry['equipment'].get(equipment_name)
    is_vav = False
    parent_ahu = None

    if not equip:
        # Search for VAV inside AHU entries
        for ahu_name, ahu_data in telemetry['equipment'].items():
            vavs = ahu_data.get('vavs', {})
            if equipment_name in vavs:
                equip = vavs[equipment_name]
                is_vav = True
                parent_ahu = ahu_name
                break

    if not equip:
        return jsonify({'success': False, 'error': f'"{equipment_name}" not in telemetry'}), 404

    # Wire to equipment type via map_config
    map_config = _load_json(os.path.join(CONFIG_DIR, 'map_config.json'), os.path.join('/root/data', 'map_config.json'))
    equip_type = 'vav' if is_vav else 'ahu'
    type_id = equip.get('type_id', '1')
    for floor in map_config.get('floors', []):
        for marker in floor.get('markers', []):
            if marker.get('name') == equipment_name:
                equip_type = marker.get('type', equip_type)
                type_id = str(marker.get('equipment_type_id', type_id))
                break

    eq_types = _load_json(os.path.join(CONFIG_DIR, 'equipment_types.json'), os.path.join('/root/data', 'equipment_types.json'))
    point_defs = _get_equipment_point_defs(eq_types, equip_type, type_id)

    annotated = []
    pts = equip.get('points', {})
    for pt_def in point_defs:
        label = pt_def.get('label', '')
        annotated.append({
            'label': label,
            'name': pt_def.get('name', label),
            'access': pt_def.get('access', 'RO'),
            'unit': pt_def.get('unit', ''),
            'min': pt_def.get('min'),
            'max': pt_def.get('max'),
            'value': pts.get(label)
        })

    result = {
        'success': True,
        'equipment_name': equipment_name,
        'type': equip_type,
        'type_id': type_id,
        'status': equip.get('status', 'ok'),
        'last_read': equip.get('last_read') if not is_vav else None,
        'points': annotated
    }
    if is_vav:
        result['parent_ahu'] = parent_ahu
    else:
        result['csv_object'] = equip.get('csv_object', '')
        result['vav_count'] = len(equip.get('vavs', {}))

    return jsonify(result)


def _load_json(path, fallback_path=None):
    """Load a JSON file, trying fallback path if primary doesn't exist.
    (Was a nested helper inside equipment_points() in app.py.)"""
    for p in [path, fallback_path]:
        if p and os.path.isfile(p):
            try:
                with open(p, 'r') as f:
                    return json.load(f)
            except:
                pass
    return {}


def write_history():
    """Return recent write command history."""
    return jsonify({'success': True, 'history': list(reversed(_write_history))})


def trend_history():
    """Return point trend history from telemetry.json ring buffer."""
    telemetry = _load_telemetry()
    if not telemetry:
        return jsonify({'success': False, 'error': 'No telemetry data'})
    history = telemetry.get('history', {})
    return jsonify({
        'success': True,
        'max_entries': history.get('max_entries', 60),
        'point_count': history.get('point_count', 0),
        'data': history.get('data', {})
    })


def register(app, ctx):
    """Attach telemetry routes to ``app`` and stash shared constants.

    ``ctx`` keys (all required):
        DATA_ROOT      — absolute path to /root/data on the controller
        get_psat       — psychrometric helper (callable)
        get_w          — psychrometric helper (callable)
        get_h          — psychrometric helper (callable)
        ahu_records    — mutable dict of seed AHU data
    """
    global DATA_ROOT, CONFIG_DIR, TELEMETRY_PATH, COLLECTOR_CONFIG_PATH
    global get_psat, get_w, get_h, ahu_records
    DATA_ROOT             = ctx['DATA_ROOT']
    CONFIG_DIR            = os.path.join(DATA_ROOT, 'configs')
    TELEMETRY_PATH        = os.path.join(CONFIG_DIR, 'telemetry.json')
    COLLECTOR_CONFIG_PATH = os.path.join(CONFIG_DIR, 'collector_config.json')
    get_psat              = ctx['get_psat']
    get_w                 = ctx['get_w']
    get_h                 = ctx['get_h']
    ahu_records           = ctx['ahu_records']

    app.add_url_rule('/api/data-mode',                    'data_mode_api',
                     data_mode_api, methods=['GET', 'POST'])
    app.add_url_rule('/api/data',                         'api_data',
                     api_data, methods=['GET'])
    app.add_url_rule('/api/telemetry-status',             'telemetry_status',
                     telemetry_status, methods=['GET'])
    app.add_url_rule('/api/telemetry-raw',                'telemetry_raw',
                     telemetry_raw, methods=['GET'])
    app.add_url_rule('/api/collector-config',             'collector_config_api',
                     collector_config_api, methods=['GET', 'POST'])
    app.add_url_rule('/api/collector-log',                'collector_log',
                     collector_log, methods=['GET'])
    app.add_url_rule('/api/write-point',                  'write_point',
                     write_point, methods=['POST'])
    app.add_url_rule('/api/equipment-points/<equipment_name>',
                     'equipment_points', equipment_points, methods=['GET'])
    app.add_url_rule('/api/write-history',                'write_history',
                     write_history, methods=['GET'])
    app.add_url_rule('/api/trend-history',                'trend_history',
                     trend_history, methods=['GET'])
