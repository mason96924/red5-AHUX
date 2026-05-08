import math
import os
import sys
import socket
import random
import base64
import json
import time
import zipfile
import io
import hashlib
import hmac as hmac_mod
import urllib.request
import urllib.parse
from flask import Flask, jsonify, request, send_from_directory, Response
from flask_cors import CORS

# Ensure /root/scripts is on the import path (py files auto-route there)
if '/root/scripts' not in sys.path:
    sys.path.insert(0, '/root/scripts')


# --- Zero-dependency bundle encryption (PBKDF2 + SHA-256 CTR + HMAC) ---
# Supports dual-key: bundles are decryptable by EITHER the user password OR the master key.
MASTER_KEY_CONST = 'b%9P$MdeQP]['

def _derive_key(password, salt):
    return hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 10000)

def _xor_stream(data, key):
    # Generate keystream in 32-byte SHA-256 blocks
    chunks = []
    counter = 0
    needed = len(data)
    while needed > 0:
        chunks.append(hashlib.sha256(key + counter.to_bytes(4, 'big')).digest())
        needed -= 32
        counter += 1
    keystream = b''.join(chunks)[:len(data)]
    # XOR as large integers (runs in C, not Python loop)
    d = int.from_bytes(data, 'big')
    k = int.from_bytes(keystream, 'big')
    return (d ^ k).to_bytes(len(data), 'big')

def encrypt_bundle(zip_bytes, password):
    """Dual-key encryption: data encrypted with random DEK, DEK wrapped by both user password and master key."""
    dek = os.urandom(32)
    # Encrypt data with DEK
    data_salt = os.urandom(16)
    data_key = hashlib.pbkdf2_hmac('sha256', dek, data_salt, 10000)
    encrypted = _xor_stream(zip_bytes, data_key)
    data_mac = hmac_mod.new(data_key, encrypted, 'sha256').digest()
    # Wrap DEK with user password
    salt1 = os.urandom(16)
    wrap_key1 = _derive_key(password, salt1)
    wrapped_dek1 = bytes(a ^ b for a, b in zip(dek, wrap_key1))
    mac1 = hmac_mod.new(wrap_key1, wrapped_dek1, 'sha256').digest()
    # Wrap DEK with master key
    salt2 = os.urandom(16)
    wrap_key2 = _derive_key(MASTER_KEY_CONST, salt2)
    wrapped_dek2 = bytes(a ^ b for a, b in zip(dek, wrap_key2))
    mac2 = hmac_mod.new(wrap_key2, wrapped_dek2, 'sha256').digest()
    # Format: RED5ENC2 | salt1(16) | mac1(32) | wrapped_dek1(32) | salt2(16) | mac2(32) | wrapped_dek2(32) | data_salt(16) | data_mac(32) | encrypted_data
    return b'RED5ENC2' + salt1 + mac1 + wrapped_dek1 + salt2 + mac2 + wrapped_dek2 + data_salt + data_mac + encrypted

def decrypt_bundle(data, password):
    """Decrypt RED5ENC1 (legacy single-key) or RED5ENC2 (dual-key) bundles."""
    if len(data) < 56:
        return None, 'File too small'
    header = data[:8]
    
    if header == b'RED5ENC2':
        # Dual-key format
        if len(data) < 216:
            return None, 'Corrupted RED5ENC2 bundle'
        salt1 = data[8:24]
        mac1 = data[24:56]
        wrapped_dek1 = data[56:88]
        salt2 = data[88:104]
        mac2 = data[104:136]
        wrapped_dek2 = data[136:168]
        data_salt = data[168:184]
        data_mac = data[184:216]
        encrypted = data[216:]
        
        # Try user password first
        dek = None
        wrap_key1 = _derive_key(password, salt1)
        if hmac_mod.compare_digest(hmac_mod.new(wrap_key1, wrapped_dek1, 'sha256').digest(), mac1):
            dek = bytes(a ^ b for a, b in zip(wrapped_dek1, wrap_key1))
        
        # Try master key if user password failed
        if dek is None:
            wrap_key2 = _derive_key(MASTER_KEY_CONST, salt2)
            if hmac_mod.compare_digest(hmac_mod.new(wrap_key2, wrapped_dek2, 'sha256').digest(), mac2):
                dek = bytes(a ^ b for a, b in zip(wrapped_dek2, wrap_key2))
        
        if dek is None:
            return None, 'Wrong password'
        
        # Decrypt data with DEK
        data_key = hashlib.pbkdf2_hmac('sha256', dek, data_salt, 10000)
        if not hmac_mod.compare_digest(hmac_mod.new(data_key, encrypted, 'sha256').digest(), data_mac):
            return None, 'Data integrity check failed'
        return _xor_stream(encrypted, data_key), None
    
    elif header == b'RED5ENC1':
        # Legacy single-key format
        salt = data[8:24]
        stored_mac = data[24:56]
        encrypted = data[56:]
        key = _derive_key(password, salt)
        mac = hmac_mod.new(key, encrypted, 'sha256').digest()
        if hmac_mod.compare_digest(mac, stored_mac):
            return _xor_stream(encrypted, key), None
        # Try master key fallback for legacy bundles
        key2 = _derive_key(MASTER_KEY_CONST, salt)
        mac2 = hmac_mod.new(key2, encrypted, 'sha256').digest()
        if hmac_mod.compare_digest(mac2, stored_mac):
            return _xor_stream(encrypted, key2), None
        return None, 'Wrong password'
    
    else:
        return None, 'Not an encrypted RED5 bundle'

# --- CONFIGURATION ---
PORT = 5001
HOST = '0.0.0.0'

app = Flask('ahu_diagnostic_api', root_path=os.getcwd())
CORS(app, resources={r"/*": {"origins": "*"}})

@app.after_request
def add_headers(response):
    response.headers['X-Frame-Options'] = 'ALLOWALL'
    response.headers['Content-Security-Policy'] = "frame-ancestors *"
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response


# --- TELEMETRY INTEGRATION ---
CONFIG_DIR = '/root/data/configs'
TELEMETRY_PATH = os.path.join('/root/data/configs', 'telemetry.json')
COLLECTOR_CONFIG_PATH = os.path.join(CONFIG_DIR, 'collector_config.json')

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



# --- PSYCHROMETRIC MATH ENGINE (ASHRAE RP-1485) ---
def get_psat(t):
    """Saturation vapor pressure (kPa) at dry-bulb temperature t (deg C).
    Primary: ASHRAE correlation.  Fallback: Antoine equation (basic arithmetic only).
    """
    try:
        t = float(t)
    except (TypeError, ValueError):
        t = 20.0
    tk = t + 273.15
    if tk <= 173.15:
        return 0.0001
    # --- Primary: ASHRAE correlation ---
    try:
        if tk < 273.15:
            c = [-5674.5359, 6.3925247, -9.677843e-3, 6.2215701e-7, 2.0747825e-9, -9.484024e-13, 4.1635019]
            ln_p = c[0]/tk + c[1] + c[2]*tk + c[3]*(tk**2) + c[4]*(tk**3) + c[5]*(tk**4) + c[6]*math.log(tk)
        else:
            c = [-5800.2206, 1.3914993, -4.8640239e-2, 4.1764768e-5, -1.4452093e-8, 6.5459673]
            ln_p = c[0]/tk + c[1] + c[2]*tk + c[3]*(tk**2) + c[4]*(tk**3) + c[5]*math.log(tk)
        result = math.exp(ln_p) / 1000.0
        if 0.0001 < result < 200.0:
            return result
    except Exception:
        pass
    # --- Fallback: Antoine equation (uses only pow, no log/exp) ---
    # Valid for 1-100 deg C, returns kPa
    try:
        lp = 8.07131 - 1730.63 / (233.426 + t)
        p_mmhg = 10.0 ** lp
        return p_mmhg * 0.133322
    except Exception:
        pass
    # --- Last resort: Buck equation (simple, avoids log/exp entirely) ---
    try:
        return 0.61121 * (2.71828 ** ((18.678 - t / 234.5) * t / (257.14 + t)))
    except Exception:
        return 0.001


def get_w(t, rh):
    """Humidity ratio (kg/kg) from dry-bulb temperature (deg C) and RH (%)."""
    try:
        t = float(t)
        rh = float(rh)
    except (TypeError, ValueError):
        return 0.008
    psat = get_psat(t)
    pw = (rh / 100.0) * psat
    patm = 101.325
    denom = patm - pw
    if denom <= 0.1:
        return 0.031
    w = (0.621945 * pw) / denom
    return max(0.0001, min(0.031, w))


def get_h(t, w):
    """Enthalpy (kJ/kg) from dry-bulb temperature (deg C) and humidity ratio (kg/kg)."""
    try:
        t = float(t)
        w = float(w)
    except (TypeError, ValueError):
        return 50.0
    return 1.006 * t + w * (2501 + 1.86 * t)

def generate_seed_data():
    """Generate 14 randomized AHU records for mock demo mode."""
    seeds = {}
    directions = ["E", "S", "W", "N"]
    colors = ['#6366f1', '#8b5cf6', '#f59e0b', '#ec4899', '#14b8a6', '#f97316']
    for i in range(1, 15):
        ahu_id = "AHU-{:02d}-{}".format(i, directions[(i - 1) % 4])
        seeds[ahu_id] = {
            "id": ahu_id,
            "base_t": 18.0 + random.uniform(0, 10),
            "procColor": colors[(i - 1) % len(colors)]
        }
    return seeds

ahu_records = generate_seed_data()

# --- Data mode state (persisted in memory; switchable from dashboard) ---
_data_mode = 'simulator'   # 'simulator' or 'mock'


# --- API ENDPOINTS ---

@app.route('/api/data-mode', methods=['GET', 'POST'])
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


@app.route('/api/data')
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


# -----------------------------------------------------------------------------
# Weather location persistence — stored on the controller so the selected city
# survives browser cache clears, different operator devices, etc.
# -----------------------------------------------------------------------------
WEATHER_LOC_PATH = os.path.join('/root/data/configs', 'weather_location.json')

def _coerce_loc(d):
    """Validate & normalize a single {lat, lon, name} dict. Returns None on bad input."""
    if not isinstance(d, dict):
        return None
    try:
        lat = float(d.get('lat'))
        lon = float(d.get('lon'))
    except (TypeError, ValueError):
        return None
    name = str(d.get('name') or '').strip()
    return {'lat': lat, 'lon': lon, 'name': name}

def _read_weather_state():
    """Load the on-controller weather state, migrating any legacy single-loc file."""
    if not os.path.isfile(WEATHER_LOC_PATH):
        return {'active': None, 'saved': []}
    try:
        with open(WEATHER_LOC_PATH, 'r') as f:
            data = json.load(f)
    except Exception:
        return {'active': None, 'saved': []}
    # Legacy format: bare {lat, lon, name}
    if isinstance(data, dict) and 'lat' in data and 'lon' in data and 'active' not in data and 'saved' not in data:
        active = _coerce_loc(data)
        return {'active': active, 'saved': [active] if active else []}
    if not isinstance(data, dict):
        return {'active': None, 'saved': []}
    active = _coerce_loc(data.get('active')) if data.get('active') is not None else None
    raw_saved = data.get('saved') or []
    saved = []
    seen = set()
    if isinstance(raw_saved, list):
        for item in raw_saved:
            loc = _coerce_loc(item)
            if not loc:
                continue
            key = (round(loc['lat'], 4), round(loc['lon'], 4))
            if key in seen:
                continue
            seen.add(key)
            saved.append(loc)
    return {'active': active, 'saved': saved}

def _write_weather_state(state):
    try:
        os.makedirs(os.path.dirname(WEATHER_LOC_PATH), exist_ok=True)
    except Exception:
        pass
    tmp = WEATHER_LOC_PATH + '.tmp'
    payload = json.dumps(state)
    # Write + fsync the file *and* its parent directory so the entry is
    # committed to flash, not just OS page cache. Embedded controllers using
    # buffered/overlay filesystems otherwise lose the data on a hard reset.
    fd = os.open(tmp, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o644)
    try:
        os.write(fd, payload.encode('utf-8'))
        try:
            os.fsync(fd)
        except OSError:
            pass
    finally:
        os.close(fd)
    os.replace(tmp, WEATHER_LOC_PATH)
    try:
        dir_fd = os.open(os.path.dirname(WEATHER_LOC_PATH), os.O_DIRECTORY)
        try:
            os.fsync(dir_fd)
        finally:
            os.close(dir_fd)
    except OSError:
        pass

@app.route('/api/weather-location', methods=['GET'])
def get_weather_location():
    return jsonify(_read_weather_state())

@app.route('/api/weather-location', methods=['POST'])
def set_weather_location():
    """Accepts either:
      • Legacy: {lat, lon, name}                       → updates active, adds to saved
      • Full:   {active: {...}|null, saved: [...]}     → replaces full state
    Returns the resulting persisted state.
    """
    try:
        body = request.get_json(silent=True) or {}
        # Detect format
        is_full = ('active' in body) or ('saved' in body)
        if is_full:
            active = _coerce_loc(body.get('active')) if body.get('active') is not None else None
            saved = []
            seen = set()
            for item in (body.get('saved') or []):
                loc = _coerce_loc(item)
                if not loc:
                    continue
                key = (round(loc['lat'], 4), round(loc['lon'], 4))
                if key in seen:
                    continue
                seen.add(key)
                saved.append(loc)
            state = {'active': active, 'saved': saved}
        else:
            loc = _coerce_loc(body)
            if not loc:
                return jsonify({'success': False, 'error': 'lat/lon must be numeric'}), 400
            existing = _read_weather_state()
            saved = list(existing.get('saved') or [])
            key = (round(loc['lat'], 4), round(loc['lon'], 4))
            saved = [s for s in saved if (round(s['lat'], 4), round(s['lon'], 4)) != key]
            saved.insert(0, loc)
            state = {'active': loc, 'saved': saved[:20]}
        _write_weather_state(state)
        return jsonify({'success': True, 'state': state})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/download-bundle/<path:filename>')
def download_bundle_file(filename):
    """Utility endpoint: lets operators download the latest server-side copy of
    key source files directly from the browser (useful when the code IDE is
    firewalled). Whitelisted to avoid exposing arbitrary paths.
    """
    ALLOWED = {
        'app.py': '/root/data/app.py',
        'dashboard.html': '/root/data/dashboard.html',
        'js/dynamics-animation.js': '/root/data/js/dynamics-animation.js',
        'js/psy-3d-engine.js': '/root/data/js/psy-3d-engine.js',
        'js/preview-components.js': '/root/data/js/preview-components.js',
        'js/schema-config.js': '/root/data/js/schema-config.js',
        'collector.py': '/root/data/collector.py',
        'band_csv_generator.py': '/root/data/band_csv_generator.py',
        'equipment_mapper.html': '/root/data/equipment_mapper.html',
        'psy_3d.html': '/root/data/psy_3d.html',
        'configs/collector_config.json': '/root/data/configs/collector_config.json',
        'configs/equipment_types.json': '/root/data/configs/equipment_types.json',
    }
    path = ALLOWED.get(filename)
    if not path or not os.path.isfile(path):
        return jsonify({'error': 'not found', 'allowed': sorted(ALLOWED.keys())}), 404
    try:
        with open(path, 'rb') as f:
            data = f.read()
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    basename = os.path.basename(filename)
    resp = Response(data, mimetype='application/octet-stream')
    resp.headers['Content-Disposition'] = 'attachment; filename="{}"'.format(basename)
    resp.headers['Cache-Control'] = 'no-store'
    return resp


@app.route('/assets/<path:filename>')
def serve_asset(filename):
    resp = send_from_directory('/root/data', filename)
    lower = filename.lower()
    # JS/HTML must never be heuristically cached — they carry app logic that
    # changes between deploys. Static graphics (PNG/JPG/SVG) can be cached
    # aggressively since they're re-uploaded via equipment_mapper.
    if lower.endswith('.js') or lower.endswith('.html') or lower.endswith('.css'):
        resp.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
        resp.headers['Pragma'] = 'no-cache'
        resp.headers['Expires'] = '0'
    else:
        # Aggressive browser caching for static base graphics / floor plans —
        # these rarely change (re-uploaded via equipment_mapper), and URLs
        # re-fetch fresh on page reload anyway.
        resp.headers['Cache-Control'] = 'public, max-age=3600, stale-while-revalidate=86400'
    return resp



@app.route('/js/<path:filename>')
def serve_js(filename):
    resp = send_from_directory('/root/data/js', filename)
    # Force the browser to revalidate every load. HTML/JS source files were
    # being aggressively heuristic-cached by browsers, so two PCs would run
    # two different "old" builds, masking real fixes. No-store guarantees that
    # the operator sees the freshly deployed code on the next reload.
    resp.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    resp.headers['Pragma'] = 'no-cache'
    resp.headers['Expires'] = '0'
    return resp


@app.route('/api/assets')
def get_assets():
    debug_info = []
    def find_image(filename_keywords):
        base = '/root/data'
        for dirpath, dirnames, filenames in os.walk(base):
            for f in filenames:
                if any(k in f.lower() for k in filename_keywords):
                    rel = os.path.relpath(os.path.join(dirpath, f), base)
                    debug_info.append(f"FOUND: '{f}' at {dirpath}")
                    return rel
        return None

    def find_all_ahu_images():
        """Find all ahu_type_N images and return a dict: {type_id: path}"""
        base = '/root/data'
        result = {}
        for dirpath, dirnames, filenames in os.walk(base):
            for f in filenames:
                fl = f.lower()
                # Match patterns: ahu_type_1.jpg, ahu_type_02.png, ahu_graphic_3.jpg etc.
                for ext in ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp']:
                    if fl.endswith(ext):
                        import re
                        m = re.search(r'ahu[_\-]?type[_\-]?(\d+)', fl)
                        if m:
                            tid = str(int(m.group(1)))  # strip leading zeros: "01" -> "1"
                            rel = os.path.relpath(os.path.join(dirpath, f), base)
                            result[tid] = f"/assets/{rel}"
                            debug_info.append(f"AHU TYPE {tid}: '{f}' at {dirpath}")
                # Also match generic ahu_graphic as fallback
                if 'ahu_graphic' in fl and not any(c.isdigit() for c in fl.split('ahu_graphic')[-1].split('.')[0]):
                    rel = os.path.relpath(os.path.join(dirpath, f), base)
                    if 'generic' not in result:
                        result['generic'] = f"/assets/{rel}"
        return result

    vav_file = find_image(['vav_graphic'])
    floor_file = find_image(['floor_plan', 'floorplan'])
    ahu_images = find_all_ahu_images()

    # Backward compat: also provide single ahu field (generic or type_1)
    ahu_file = None
    if ahu_images.get('generic'):
        ahu_file = ahu_images['generic']
    elif ahu_images.get('1'):
        ahu_file = ahu_images['1']

    if not vav_file: debug_info.append("WARNING: vav_graphic not found.")
    if not floor_file: debug_info.append("WARNING: floor_plan not found.")
    if not ahu_images: debug_info.append("WARNING: no ahu_type_N images found. Name files: ahu_type_1.jpg, ahu_type_2.jpg, etc.")

    return jsonify({
        "vav": f"/assets/{vav_file}" if vav_file else None,
        "floor": f"/assets/{floor_file}" if floor_file else None,
        "ahu": ahu_file,
        "ahu_types": ahu_images,
        "debug": "\n".join(debug_info)
    })


@app.route('/api/equipment-types')
def get_equipment_types():
    filepath = os.path.join(CONFIG_DIR, 'equipment_types.json')
    if not os.path.exists(filepath):
        filepath = os.path.join('/root/data', 'equipment_types.json')
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            return jsonify(json.load(f))
    return jsonify({})

@app.route('/api/map-config')
def get_map_config():
    filepath = os.path.join(CONFIG_DIR, 'map_config.json')
    if not os.path.exists(filepath):
        filepath = os.path.join('/root/data', 'map_config.json')
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            return jsonify(json.load(f))
    return jsonify({})

@app.route('/api/save-equipment-schema', methods=['POST'])
def save_equipment_schema():
    try:
        data = request.json
        equipment_schema = data.get('equipment_schema', {})
        os.makedirs(CONFIG_DIR, exist_ok=True)
        filepath = os.path.join(CONFIG_DIR, 'equipment_types.json')
        with open(filepath, 'w') as f:
            json.dump(equipment_schema, f, indent=2)
        return jsonify({"success": True, "message": "Equipment schema saved", "file": filepath})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/save-map-config', methods=['POST'])
def save_map_config():
    try:
        data = request.json
        map_config = data.get('map_config', {})
        os.makedirs(CONFIG_DIR, exist_ok=True)
        filepath = os.path.join(CONFIG_DIR, 'map_config.json')
        with open(filepath, 'w') as f:
            json.dump(map_config, f, indent=2)
        return jsonify({"success": True, "message": "Map config saved", "file": filepath})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/save-config', methods=['POST'])
def save_config():
    try:
        data = request.json
        map_config = data.get('map_config', data)
        os.makedirs(CONFIG_DIR, exist_ok=True)
        filepath = os.path.join(CONFIG_DIR, 'map_config.json')
        with open(filepath, 'w') as f:
            json.dump(map_config, f, indent=2)
        
        image_manifest = data.get('image_manifest')
        if image_manifest:
            manifest_path = os.path.join(CONFIG_DIR, 'image_files_manifest.json')
            with open(manifest_path, 'w') as f:
                json.dump(image_manifest, f, indent=2)
        
        return jsonify({"success": True, "message": "Config saved", "file": filepath})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/save-image', methods=['POST'])
def save_image():
    try:
        data = request.json
        filename = data.get('filename', 'image.png')
        if '..' in filename:
            return jsonify({"success": False, "error": "Invalid filename"}), 400
        image_data = data.get('image_data', '')
        if image_data:
            if ',' in image_data:
                image_data = image_data.split(',', 1)[1]
            img_bytes = base64.b64decode(image_data)
            filepath = os.path.normpath(os.path.join('/root/data', filename))
            if not filepath.startswith('/root/data'):
                return jsonify({"success": False, "error": "Invalid path"}), 400
            # Ensure parent directory exists
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            with open(filepath, 'wb') as f:
                f.write(img_bytes)
            return jsonify({"success": True, "message": f"Image saved: {filename}", "file": filepath, "relative_path": filename})
        return jsonify({"success": False, "error": "No image data"}), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/save-floor-plan', methods=['POST'])
def save_floor_plan():
    try:
        data = request.json
        filename = data.get('filename', 'floor_plan.png')
        if '..' in filename:
            return jsonify({"success": False, "error": "Invalid filename"}), 400
        image_data = data.get('image_data', '')
        if image_data:
            if ',' in image_data:
                image_data = image_data.split(',', 1)[1]
            img_bytes = base64.b64decode(image_data)
            # If filename has no directory prefix, default to graphics/floor_plans/
            if '/' not in filename:
                filename = f'graphics/floor_plans/{filename}'
            filepath = os.path.normpath(os.path.join('/root/data', filename))
            if not filepath.startswith('/root/data'):
                return jsonify({"success": False, "error": "Invalid path"}), 400
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            with open(filepath, 'wb') as f:
                f.write(img_bytes)
            return jsonify({"success": True, "message": f"Floor plan saved: {filename}", "file": filepath, "relative_path": filename})
        return jsonify({"success": False, "error": "No image data"}), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


def _no_cache(resp):
    resp.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    resp.headers['Pragma'] = 'no-cache'
    resp.headers['Expires'] = '0'
    return resp


def _serve_html_with_build_stamp(path):
    """Read an HTML file and inject the file's mtime as window.__BUILD_MTIME__.
    The dashboard JS uses this to detect when a stale-cached HTML is being
    served (browser served the cached old HTML while the controller has a
    newer build), and shows a banner asking the operator to hard-refresh.
    """
    try:
        mtime = int(os.path.getmtime(path))
    except OSError:
        mtime = 0
    try:
        with open(path, 'rb') as f:
            body = f.read()
    except OSError as e:
        return jsonify({'error': str(e)}), 500
    inject = ('<script>window.__BUILD_MTIME__=' + str(mtime) + ';</script>').encode('utf-8')
    if b'</head>' in body:
        body = body.replace(b'</head>', inject + b'</head>', 1)
    else:
        body = inject + body
    resp = Response(body, mimetype='text/html')
    return _no_cache(resp)


@app.route('/')
def serve_landing():
    return _no_cache(send_from_directory('/root/data', 'landing.html'))

@app.route('/dashboard')
def serve_dashboard():
    return _serve_html_with_build_stamp('/root/data/dashboard.html')

@app.route('/mapper')
def serve_mapper():
    return _serve_html_with_build_stamp('/root/data/equipment_mapper.html')

@app.route('/api/version')
def api_version():
    """Expose mtime of key client files so operators can verify the deployed
    build (helps diagnose stale-cache vs stale-deploy issues across PCs)."""
    out = {}
    for label, path in (
        ('dashboard.html', '/root/data/dashboard.html'),
        ('equipment_mapper.html', '/root/data/equipment_mapper.html'),
        ('app.py', '/root/data/app.py'),
        ('js/dynamics-animation.js', '/root/data/js/dynamics-animation.js'),
        ('js/preview-components.js', '/root/data/js/preview-components.js'),
        ('js/schema-config.js', '/root/data/js/schema-config.js'),
        ('js/psy-3d-engine.js', '/root/data/js/psy-3d-engine.js'),
    ):
        try:
            out[label] = int(os.path.getmtime(path))
        except OSError:
            out[label] = None
    return _no_cache(jsonify(out))

@app.route('/health')
def health_check():
    return jsonify({"status": "healthy"})

@app.route('/api/files')
def list_files():
    root_name = request.args.get('root', 'data')
    base_dir = _resolve_root(root_name)
    rel_path = request.args.get('path', '')
    if '..' in rel_path:
        return jsonify({'success': False, 'error': 'Invalid path'}), 400
    data_dir = os.path.normpath(os.path.join(base_dir, rel_path))
    if not data_dir.startswith(base_dir):
        return jsonify({'success': False, 'error': 'Invalid path'}), 400
    if not os.path.isdir(data_dir):
        return jsonify({'success': False, 'error': f'Directory not found: {rel_path}'}), 404
    files = []
    try:
        for f in sorted(os.listdir(data_dir)):
            if f.endswith('.tmp'):
                continue
            filepath = os.path.join(data_dir, f)
            try:
                stat = os.stat(filepath)
            except (FileNotFoundError, OSError):
                continue
            if os.path.isdir(filepath):
                files.append({
                    'name': f,
                    'size': 0,
                    'modified': stat.st_mtime,
                    'type': 'directory'
                })
            elif os.path.isfile(filepath):
                ext = os.path.splitext(f)[1].lower()
                ftype = 'image' if ext in ('.png', '.jpg', '.jpeg', '.svg', '.gif', '.bmp', '.webp') else \
                        'config' if ext in ('.json',) else \
                        'page' if ext in ('.html', '.htm') else \
                        'style' if ext in ('.css',) else \
                        'script' if ext in ('.py', '.js') else 'other'
                files.append({
                    'name': f,
                    'size': stat.st_size,
                    'modified': stat.st_mtime,
                    'type': ftype
                })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    return jsonify({'success': True, 'path': data_dir, 'rel_path': rel_path, 'files': files, 'count': len(files)})

@app.route('/api/delete-file', methods=['POST'])
def delete_file():
    try:
        data = request.json
        filename = data.get('filename', '')
        root_name = data.get('root', 'data')
        base_dir = _resolve_root(root_name)
        if not filename or '..' in filename:
            return jsonify({'success': False, 'error': 'Invalid filename'}), 400
        filepath = os.path.normpath(os.path.join(base_dir, filename))
        if not filepath.startswith(base_dir):
            return jsonify({'success': False, 'error': 'Invalid path'}), 400
        if not os.path.isfile(filepath):
            return jsonify({'success': False, 'error': f'File not found: {filename}'}), 404
        os.remove(filepath)
        return jsonify({'success': True, 'message': f'Deleted: {filename}'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/upload-file', methods=['POST'])
def upload_file():
    try:
        data = request.json
        filename = data.get('filename', '')
        root_name = data.get('root', 'data')
        base_dir = _resolve_root(root_name)
        if not filename or '..' in filename:
            return jsonify({'success': False, 'error': 'Invalid filename'}), 400
        filepath = os.path.normpath(os.path.join(base_dir, filename))
        if not filepath.startswith(base_dir):
            return jsonify({'success': False, 'error': 'Invalid path'}), 400
        file_data = data.get('file_data', '')
        if not file_data:
            return jsonify({'success': False, 'error': 'No file data'}), 400
        # Ensure parent directory exists
        parent = os.path.dirname(filepath)
        if not os.path.isdir(parent):
            return jsonify({'success': False, 'error': f'Directory does not exist: {os.path.dirname(filename)}'}), 400
        if ',' in file_data:
            raw = file_data.split(',', 1)[1]
        else:
            raw = file_data
        file_bytes = base64.b64decode(raw)
        with open(filepath, 'wb') as f:
            f.write(file_bytes)
        return jsonify({'success': True, 'message': f'Uploaded: {filename}', 'file': filepath, 'size': len(file_bytes)})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/create-directory', methods=['POST'])
def create_directory():
    try:
        data = request.json
        dirname = data.get('dirname', '')
        root_name = data.get('root', 'data')
        base_dir = _resolve_root(root_name)
        if not dirname or '..' in dirname:
            return jsonify({'success': False, 'error': 'Invalid directory name'}), 400
        dirpath = os.path.normpath(os.path.join(base_dir, dirname))
        if not dirpath.startswith(base_dir):
            return jsonify({'success': False, 'error': 'Invalid path'}), 400
        if os.path.exists(dirpath):
            return jsonify({'success': False, 'error': f'Already exists: {dirname}'}), 409
        os.makedirs(dirpath)
        return jsonify({'success': True, 'message': f'Created: {dirname}', 'path': dirpath})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/move-file', methods=['POST'])
def move_file():
    try:
        import shutil
        data = request.json
        src = data.get('src', '')
        dest_dir = data.get('dest_dir', '')
        root_name = data.get('root', 'data')
        dest_root_name = data.get('dest_root', root_name)  # cross-root support
        base_dir = _resolve_root(root_name)
        dest_base = _resolve_root(dest_root_name)
        if not src or '..' in src or '..' in dest_dir:
            return jsonify({'success': False, 'error': 'Invalid path'}), 400
        src_path = os.path.normpath(os.path.join(base_dir, src))
        if not src_path.startswith(base_dir):
            return jsonify({'success': False, 'error': 'Invalid source path'}), 400
        if not os.path.exists(src_path):
            return jsonify({'success': False, 'error': f'Source not found: {src}'}), 404
        if dest_dir:
            target_dir = os.path.normpath(os.path.join(dest_base, dest_dir))
        else:
            target_dir = dest_base
        if not (target_dir.startswith(DATA_ROOT) or target_dir.startswith(SCRIPTS_ROOT)):
            return jsonify({'success': False, 'error': 'Invalid destination path'}), 400
        os.makedirs(target_dir, exist_ok=True)
        final_path = os.path.join(target_dir, os.path.basename(src_path))
        if os.path.normpath(src_path) == os.path.normpath(final_path):
            return jsonify({'success': False, 'error': 'Source and destination are the same'}), 400
        shutil.move(src_path, final_path)
        return jsonify({'success': True, 'message': f'Moved: {os.path.basename(src)} -> {dest_root_name}:{dest_dir or "/"}'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Standard directory scaffold
DIRECTORY_SCAFFOLD = [
    'graphics/equipments/AHUs',
    'graphics/equipments/VAVs',
    'graphics/equipments/VFDs',
    'graphics/equipments/DIFF_PRs',
    'graphics/equipments/CHILLERs',
    'graphics/equipments/CTs',
    'graphics/floor_plans',
    'configs',
    'js',
]

@app.route('/api/init-directories', methods=['POST'])
def init_directories():
    created = []
    existing = []
    for d in DIRECTORY_SCAFFOLD:
        dirpath = os.path.join('/root/data', d)
        if os.path.isdir(dirpath):
            existing.append(d)
        else:
            os.makedirs(dirpath, exist_ok=True)
            created.append(d)
    return jsonify({'success': True, 'created': created, 'existing': existing})

@app.route('/api/directory-scaffold')
def get_directory_scaffold():
    scaffold = []
    for d in DIRECTORY_SCAFFOLD:
        dirpath = os.path.join('/root/data', d)
        scaffold.append({'path': d, 'exists': os.path.isdir(dirpath)})
    return jsonify({'success': True, 'scaffold': scaffold})

@app.route('/api/delete-directory', methods=['POST'])
def delete_directory():
    try:
        data = request.json
        dirname = data.get('dirname', '')
        root_name = data.get('root', 'data')
        base_dir = _resolve_root(root_name)
        if not dirname or '..' in dirname or dirname.strip() == '':
            return jsonify({'success': False, 'error': 'Invalid directory name'}), 400
        dirpath = os.path.normpath(os.path.join(base_dir, dirname))
        if not dirpath.startswith(base_dir) or dirpath == base_dir:
            return jsonify({'success': False, 'error': 'Cannot delete root directory'}), 400
        if not os.path.isdir(dirpath):
            return jsonify({'success': False, 'error': f'Directory not found: {dirname}'}), 404
        import shutil
        shutil.rmtree(dirpath)
        return jsonify({'success': True, 'message': f'Deleted directory: {dirname}'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/weather-history')
def weather_history():
    import time as _time
    _t0 = _time.time()
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    year = request.args.get('year', '2025')
    force = request.args.get('force', '').lower() in ('1', 'true', 'yes')
    if not lat or not lon:
        return jsonify({'success': False, 'error': 'lat and lon required'}), 400

    # Normalize lat/lon for the cache key. open-meteo's grid resolution is
    # ~0.1° (~11 km), so 2 decimal places (~1.1 km) is more than enough — and
    # using a fixed precision means the cache key is stable regardless of
    # how many decimals the caller sends (37.5665 vs 37.57 must hit the
    # same cache entry, otherwise every selection re-downloads from the net).
    try:
        lat_key = f"{round(float(lat), 2):.2f}"
        lon_key = f"{round(float(lon), 2):.2f}"
    except (TypeError, ValueError):
        return jsonify({'success': False, 'error': 'lat/lon must be numeric'}), 400

    cache_file = os.path.join('/root/data', 'configs', f'weather_{lat_key}_{lon_key}_{year}.json')

    # One-shot orphan sweep: at most once per Flask process, scan the configs
    # dir and delete any weather_*.json file that is incomplete (missing
    # `success`/`hourly`) or duplicates a canonical entry that already exists.
    # This automatically reclaims flash space after a code-format upgrade.
    global _wx_orphans_swept
    try:
        _wx_orphans_swept
    except NameError:
        _wx_orphans_swept = False
    if not _wx_orphans_swept:
        try:
            cfg_dir = os.path.dirname(cache_file)
            def _is_canonical_name(fn):
                """weather_<lat>_<lon>_<year>.json with 2-decimal lat/lon
                and 4-digit year. No regex — some controller deployment
                pipelines mangle backslashes/$ in raw strings."""
                if not fn.startswith('weather_') or not fn.endswith('.json'):
                    return False
                core = fn[len('weather_'):-len('.json')]
                parts = core.rsplit('_', 1)
                if len(parts) != 2:
                    return False
                coord, yr = parts
                if not (len(yr) == 4 and yr.isdigit()):
                    return False
                # coord = "<lat>_<lon>"; lon may be negative.
                bits = coord.split('_')
                if len(bits) != 2:
                    return False
                for p in bits:
                    if '.' not in p:
                        return False
                    intp, fracp = p.split('.', 1)
                    if len(fracp) != 2 or not fracp.isdigit():
                        return False
                    sign = ''
                    if intp.startswith('-'):
                        sign = '-'; intp = intp[1:]
                    if not intp.isdigit():
                        return False
                return True
            non_canonical = []
            for fn in os.listdir(cfg_dir):
                if not fn.startswith('weather_') or not fn.endswith('.json'):
                    continue
                if fn == 'weather_location.json':
                    continue
                if not _is_canonical_name(fn):
                    non_canonical.append(fn)
            for fn in non_canonical:
                fp = os.path.join(cfg_dir, fn)
                try:
                    with open(fp, 'r') as fh: d = json.load(fh)
                except Exception:
                    try: os.remove(fp)
                    except OSError: pass
                    continue
                # Keep only if it's a complete payload AND there's no canonical
                # already covering the same coordinates+year.
                if (isinstance(d, dict)
                        and d.get('success') is True
                        and isinstance(d.get('hourly'), list) and len(d['hourly']) > 0):
                    pass  # leave it; legacy migration will pick it up later
                else:
                    try: os.remove(fp)
                    except OSError: pass
        except OSError:
            pass
        _wx_orphans_swept = True

    def _is_complete_payload(d):
        """A cache hit is only valid if it has both daily AND hourly data and
        the success flag — older or partial files (e.g. daily-only from a
        previous code version) must be treated as misses, otherwise the
        frontend never receives hourly data."""
        return (isinstance(d, dict)
                and d.get('success') is True
                and isinstance(d.get('daily'), list) and len(d['daily']) > 0
                and isinstance(d.get('hourly'), list) and len(d['hourly']) > 0)

    def _find_legacy_cache():
        """Look for any pre-existing cache file for the same year whose lat/lon
        are within ±0.05° of the requested point (well within open-meteo's
        ~11 km grid). Renames it to the canonical key so it's reused
        permanently. This avoids re-downloading after a code change in how
        lat/lon are rounded (37.5665 → '37.56' vs '37.57' historically)."""
        try:
            req_lat = float(lat_key); req_lon = float(lon_key)
            cfg_dir = os.path.dirname(cache_file)
            for fn in os.listdir(cfg_dir):
                if not fn.startswith('weather_') or not fn.endswith(f'_{year}.json'):
                    continue
                if fn == os.path.basename(cache_file):
                    continue
                core = fn[len('weather_'):-len(f'_{year}.json')]
                # core is "<lat>_<lon>" (lon may be negative). Lat is always first
                # and never starts with '-' here for these grids; for safety try
                # both single split orientations.
                parts = core.split('_')
                if len(parts) < 2:
                    continue
                # Reconstruct: if there are 2 parts, lat=parts[0], lon=parts[1]
                # If 3 parts (negative number using '-'), join accordingly.
                try:
                    if len(parts) == 2:
                        f_lat, f_lon = float(parts[0]), float(parts[1])
                    elif len(parts) == 3 and parts[1] == '':
                        f_lat = float(parts[0]); f_lon = float('-' + parts[2])
                    elif len(parts) == 3 and parts[0] == '':
                        f_lat = float('-' + parts[1]); f_lon = float(parts[2])
                    else:
                        continue
                except ValueError:
                    continue
                if abs(f_lat - req_lat) <= 0.05 and abs(f_lon - req_lon) <= 0.05:
                    candidate = os.path.join(cfg_dir, fn)
                    try:
                        with open(candidate, 'r') as fh:
                            cached = json.load(fh)
                    except Exception:
                        continue
                    if _is_complete_payload(cached):
                        # Promote to canonical name so future lookups hit immediately.
                        try: os.replace(candidate, cache_file)
                        except OSError: pass
                        return cached
                    else:
                        # Stale / incomplete legacy entry — clean it up so it
                        # doesn't shadow a future good cache.
                        try: os.remove(candidate)
                        except OSError: pass
        except OSError:
            pass
        return None

    # Decide if the cache is fresh enough to return without a network round-trip.
    # Past years are immutable → cache forever. Current year grows daily → only
    # treat the cache as fresh if it was written within the last 24 h.
    import datetime, time
    is_current_year = (str(year) == str(datetime.date.today().year))
    cache_fresh = False
    if os.path.isfile(cache_file) and not force:
        if not is_current_year:
            cache_fresh = True
        else:
            age = time.time() - os.path.getmtime(cache_file)
            cache_fresh = age < 24 * 3600

    if cache_fresh:
        try:
            with open(cache_file, 'r') as f:
                cached = json.load(f)
            if _is_complete_payload(cached):
                cached['_from_cache'] = True
                cached['_elapsed_ms'] = int((_time.time() - _t0) * 1000)
                print(f"[WX] {lat_key},{lon_key} yr={year} -> cache ({cached['_elapsed_ms']}ms)")
                return jsonify(cached)
            # If the canonical file exists but is partial/legacy, fall through
            # to legacy migration / re-fetch.
        except Exception:
            pass

    if not force:
        legacy = _find_legacy_cache()
        if legacy:
            legacy['_from_cache'] = True
            legacy['_migrated'] = True
            legacy['_elapsed_ms'] = int((_time.time() - _t0) * 1000)
            print(f"[WX] {lat_key},{lon_key} yr={year} -> legacy-cache ({legacy['_elapsed_ms']}ms)")
            return jsonify(legacy)

    # Fetch from Open-Meteo
    try:
        end_date = f'{year}-12-31'
        # Cap end_date to today for current/future years
        today_str = datetime.date.today().isoformat()
        if end_date > today_str:
            end_date = today_str
        params = urllib.parse.urlencode({
            'latitude': lat_key,
            'longitude': lon_key,
            'start_date': f'{year}-01-01',
            'end_date': end_date,
            'hourly': 'temperature_2m,relative_humidity_2m',
            'daily': 'weather_code',
            'timezone': 'auto'
        })
        url = f'https://archive-api.open-meteo.com/v1/archive?{params}'
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode())
        
        hourly = data.get('hourly', {})
        times = hourly.get('time', [])
        temps = hourly.get('temperature_2m', [])
        rhs = hourly.get('relative_humidity_2m', [])
        
        # Extract daily weather codes
        daily_raw = data.get('daily', {})
        wc_dates = daily_raw.get('time', [])
        wc_codes = daily_raw.get('weather_code', [])
        weather_codes = {}
        for i in range(len(wc_dates)):
            weather_codes[wc_dates[i]] = wc_codes[i] if i < len(wc_codes) else None
        
        # Aggregate to daily: min, max, avg for temp and rh
        daily = []
        day_data = {}
        for i in range(len(times)):
            day = times[i][:10]
            if day not in day_data:
                day_data[day] = {'temps': [], 'rhs': []}
            if temps[i] is not None:
                day_data[day]['temps'].append(temps[i])
            if rhs[i] is not None:
                day_data[day]['rhs'].append(rhs[i])
        
        for day in sorted(day_data.keys()):
            d = day_data[day]
            if d['temps'] and d['rhs']:
                avg_t = sum(d['temps']) / len(d['temps'])
                avg_rh = sum(d['rhs']) / len(d['rhs'])
                # Compute enthalpy for each hourly reading to get min/max/avg
                h_values = []
                for ti, ri in zip(d['temps'], d['rhs']):
                    ps = 0.6108 * math.exp(17.27 * ti / (ti + 237.3))
                    pwi = (ri / 100) * ps
                    wi = 0.621945 * pwi / (101.325 - pwi) if (101.325 - pwi) > 0 else 0
                    h_values.append(1.006 * ti + wi * (2501 + 1.86 * ti))
                h_avg = sum(h_values) / len(h_values)
                daily.append({
                    'date': day,
                    'temp_min': round(min(d['temps']), 1),
                    'temp_max': round(max(d['temps']), 1),
                    'temp_avg': round(avg_t, 1),
                    'rh_min': round(min(d['rhs'])),
                    'rh_max': round(max(d['rhs'])),
                    'rh_avg': round(avg_rh),
                    'h_min': round(min(h_values), 1),
                    'h_max': round(max(h_values), 1),
                    'h_avg': round(h_avg, 1),
                    'wc': weather_codes.get(day)
                })
        
        # Build compact hourly array for day/week views
        hourly_arr = []
        for i in range(len(times)):
            if temps[i] is not None and rhs[i] is not None:
                t = temps[i]
                rh = rhs[i]
                psat = 0.6108 * math.exp(17.27 * t / (t + 237.3))
                pw = (rh / 100) * psat
                w = 0.621945 * pw / (101.325 - pw) if (101.325 - pw) > 0 else 0
                h = 1.006 * t + w * (2501 + 1.86 * t)
                hourly_arr.append({
                    'time': times[i],
                    'temp': round(t, 1),
                    'rh': round(rh),
                    'h': round(h, 1)
                })
        
        result = {
            'success': True,
            'source': 'open-meteo',
            'lat': float(lat_key),
            'lon': float(lon_key),
            'year': year,
            'timezone': data.get('timezone', ''),
            'daily': daily,
            'hourly': hourly_arr,
            'hourly_count': len(times),
            '_from_cache': False,
            '_elapsed_ms': int((_time.time() - _t0) * 1000)
        }
        print(f"[WX] {lat_key},{lon_key} yr={year} -> NET ({result['_elapsed_ms']}ms)")

        # Always cache. Past years are immutable; current-year cache is honored
        # for 24 h before being re-fetched (see freshness check above), so we
        # don't need a year filter here. fsync to flash so it survives a
        # controller power cycle.
        try:
            tmp = cache_file + '.tmp'
            payload = json.dumps(result)
            fd = os.open(tmp, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o644)
            try:
                os.write(fd, payload.encode('utf-8'))
                try: os.fsync(fd)
                except OSError: pass
            finally:
                os.close(fd)
            os.replace(tmp, cache_file)
        except Exception:
            pass

        return jsonify(result)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# --- TOMORROW FORECAST (from past year's same-day data) ---
import datetime
import threading

def _compute_enthalpy(t, rh):
    """Compute enthalpy from temp (C) and RH (%)."""
    psat = 0.6108 * math.exp(17.27 * t / (t + 237.3))
    pw = (rh / 100) * psat
    w = 0.621945 * pw / (101.325 - pw) if (101.325 - pw) > 0 else 0
    return round(1.006 * t + w * (2501 + 1.86 * t), 1)


def get_tomorrow_forecast(lat, lon):
    """Look up past year's weather data for tomorrow's date. Returns dict with min/max T/RH/H."""
    tomorrow = datetime.date.today() + datetime.timedelta(days=1)
    past_year = tomorrow.year - 1
    target_date = f'{past_year}-{tomorrow.month:02d}-{tomorrow.day:02d}'

    # Normalize to the same canonical lat/lon format used by /api/weather-history
    # so we share the same cache file (no duplicate writes, no extra net hits).
    try:
        lat_key = f"{round(float(lat), 2):.2f}"
        lon_key = f"{round(float(lon), 2):.2f}"
    except (TypeError, ValueError):
        return {'success': False, 'error': 'lat/lon must be numeric'}
    cache_file = os.path.join('/root/data', 'configs', f'weather_{lat_key}_{lon_key}_{past_year}.json')

    data = None
    if os.path.isfile(cache_file):
        try:
            with open(cache_file, 'r') as f:
                data = json.load(f)
        except Exception:
            pass

    if not data:
        # Fetch from Open-Meteo
        try:
            params = urllib.parse.urlencode({
                'latitude': lat_key, 'longitude': lon_key,
                'start_date': f'{past_year}-01-01', 'end_date': f'{past_year}-12-31',
                'hourly': 'temperature_2m,relative_humidity_2m',
                'daily': 'weather_code',
                'timezone': 'auto'
            })
            url = f'https://archive-api.open-meteo.com/v1/archive?{params}'
            req = urllib.request.Request(url, headers={'User-Agent': 'RED5-Controller/1.2'})
            with urllib.request.urlopen(req, timeout=30) as resp:
                raw = json.loads(resp.read().decode())

            times = raw.get('hourly', {}).get('time', [])
            temps = raw.get('hourly', {}).get('temperature_2m', [])
            rhs = raw.get('hourly', {}).get('relative_humidity_2m', [])

            day_data = {}
            for i in range(len(times)):
                day = times[i][:10]
                if day not in day_data:
                    day_data[day] = {'temps': [], 'rhs': []}
                if temps[i] is not None:
                    day_data[day]['temps'].append(temps[i])
                if rhs[i] is not None:
                    day_data[day]['rhs'].append(rhs[i])

            daily = []
            for day in sorted(day_data.keys()):
                d = day_data[day]
                if d['temps'] and d['rhs']:
                    h_values = []
                    for ti, ri in zip(d['temps'], d['rhs']):
                        h_values.append(_compute_enthalpy(ti, ri))
                    daily.append({
                        'date': day,
                        'temp_min': round(min(d['temps']), 1),
                        'temp_max': round(max(d['temps']), 1),
                        'rh_min': round(min(d['rhs'])),
                        'rh_max': round(max(d['rhs'])),
                        'h_min': round(min(h_values), 1),
                        'h_max': round(max(h_values), 1),
                    })
            data = {'daily': daily}

            # Only write a separate cache here if the weather-history endpoint
            # hasn't already populated a *complete* canonical cache. Writing a
            # daily-only payload over the top of the rich daily+hourly payload
            # would silently corrupt it, and the orphan sweep would later
            # delete this incomplete file.
            try:
                if not os.path.isfile(cache_file):
                    tmp = cache_file + '.tmp'
                    payload = json.dumps(data)
                    fd = os.open(tmp, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o644)
                    try:
                        os.write(fd, payload.encode('utf-8'))
                        try: os.fsync(fd)
                        except OSError: pass
                    finally:
                        os.close(fd)
                    os.replace(tmp, cache_file)
            except Exception:
                pass
        except Exception as e:
            return {'success': False, 'error': str(e)}

    # Find the target date
    if data and 'daily' in data:
        for d in data['daily']:
            if d['date'] == target_date:
                return {
                    'success': True,
                    'forecast_date': f'{tomorrow.isoformat()}',
                    'source_date': target_date,
                    'source_year': past_year,
                    't_min': d['temp_min'], 't_max': d['temp_max'],
                    'rh_min': d['rh_min'], 'rh_max': d['rh_max'],
                    'h_min': d.get('h_min', _compute_enthalpy(d['temp_min'], d['rh_min'])),
                    'h_max': d.get('h_max', _compute_enthalpy(d['temp_max'], d['rh_max'])),
                }

    return {'success': False, 'error': f'No data found for {target_date}'}


def write_forecast_to_bacnet(forecast, csv_id='CSV1'):
    """
    Write tomorrow's forecast to a BACnet CSV object on the controller.
    CSV value format: "t_min,t_max,rh_min,rh_max,h_min,h_max"

    PLACEHOLDER: Replace dibt.Write() with actual BACnet call.
    csv_id will be provided (e.g., 'CSV1' or 'CSV[N]' where N = id).
    """
    if not forecast or not forecast.get('success'):
        return False

    csv_value = f"{forecast['t_min']},{forecast['t_max']},{forecast['rh_min']},{forecast['rh_max']},{forecast['h_min']},{forecast['h_max']}"

    # --- PLACEHOLDER: BACnet write ---
    # from dibt import Write
    # Write(csv_id, 'Present_Value', csv_value)
    print(f'[FORECAST] Would write to {csv_id}: {csv_value}')
    print(f'[FORECAST] For date: {forecast["forecast_date"]} (source: {forecast["source_date"]})')

    # Log to file for verification
    try:
        log_path = os.path.join('/root/data', 'configs', 'forecast_log.json')
        log_entry = {
            'written_at': datetime.datetime.now().isoformat(),
            'csv_id': csv_id,
            'csv_value': csv_value,
            **forecast
        }
        logs = []
        if os.path.isfile(log_path):
            with open(log_path, 'r') as f:
                logs = json.load(f)
        logs.append(log_entry)
        # Keep last 30 entries
        logs = logs[-30:]
        with open(log_path, 'w') as f:
            json.dump(logs, f, indent=2)
    except:
        pass

    return True


# Forecast config stored in /root/data/configs/forecast_config.json
FORECAST_CONFIG_PATH = os.path.join('/root/data', 'configs', 'forecast_config.json')

def _load_forecast_config():
    try:
        if os.path.isfile(FORECAST_CONFIG_PATH):
            with open(FORECAST_CONFIG_PATH, 'r') as f:
                return json.load(f)
    except:
        pass
    return {}


def _daily_forecast_job():
    """Background job: compute tomorrow's forecast and write to BACnet. Runs daily at 23:00."""
    while True:
        try:
            now = datetime.datetime.now()
            # Schedule for 23:00 today, or tomorrow if already past 23:00
            target = now.replace(hour=23, minute=0, second=0, microsecond=0)
            if now >= target:
                target += datetime.timedelta(days=1)
            wait_secs = (target - now).total_seconds()
            print(f'[FORECAST] Next run at {target.isoformat()}, waiting {wait_secs:.0f}s')
            threading.Event().wait(wait_secs)

            config = _load_forecast_config()
            lat = config.get('lat')
            lon = config.get('lon')
            csv_id = config.get('csv_id', 'CSV1')

            if lat and lon:
                forecast = get_tomorrow_forecast(lat, lon)
                if forecast.get('success'):
                    write_forecast_to_bacnet(forecast, csv_id)
                    print(f'[FORECAST] Written: {forecast["forecast_date"]}')
                else:
                    print(f'[FORECAST] Failed: {forecast.get("error")}')
            else:
                print('[FORECAST] No lat/lon configured. Set via /api/forecast-config.')
        except Exception as e:
            print(f'[FORECAST] Error: {e}')
            threading.Event().wait(60)

# Start background forecast thread
_forecast_thread = threading.Thread(target=_daily_forecast_job, daemon=True)
_forecast_thread.start()


@app.route('/api/tomorrow-forecast')
def tomorrow_forecast():
    """Get tomorrow's forecast based on past year's same-day data."""
    config = _load_forecast_config()
    lat = request.args.get('lat') or config.get('lat')
    lon = request.args.get('lon') or config.get('lon')
    if not lat or not lon:
        return jsonify({'success': False, 'error': 'lat/lon required. Set via /api/forecast-config or pass as query params.'}), 400
    result = get_tomorrow_forecast(lat, lon)
    return jsonify(result)


@app.route('/api/forecast-config', methods=['GET', 'POST'])
def forecast_config():
    """Get or set forecast configuration (lat, lon, csv_id)."""
    if request.method == 'POST':
        data = request.json or {}
        config = _load_forecast_config()
        if 'lat' in data: config['lat'] = data['lat']
        if 'lon' in data: config['lon'] = data['lon']
        if 'csv_id' in data: config['csv_id'] = data['csv_id']
        try:
            os.makedirs(os.path.dirname(FORECAST_CONFIG_PATH), exist_ok=True)
            with open(FORECAST_CONFIG_PATH, 'w') as f:
                json.dump(config, f, indent=2)
            return jsonify({'success': True, 'config': config})
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500
    else:
        return jsonify({'success': True, 'config': _load_forecast_config()})


@app.route('/api/forecast-write-now', methods=['POST'])
def forecast_write_now():
    """Manually trigger forecast computation and BACnet write."""
    config = _load_forecast_config()
    lat = config.get('lat')
    lon = config.get('lon')
    csv_id = config.get('csv_id', 'CSV1')
    if not lat or not lon:
        return jsonify({'success': False, 'error': 'lat/lon not configured.'}), 400
    forecast = get_tomorrow_forecast(lat, lon)
    if not forecast.get('success'):
        return jsonify(forecast), 400
    written = write_forecast_to_bacnet(forecast, csv_id)
    return jsonify({**forecast, 'written': written, 'csv_id': csv_id,
                    'csv_value': f"{forecast['t_min']},{forecast['t_max']},{forecast['rh_min']},{forecast['rh_max']},{forecast['h_min']},{forecast['h_max']}"})

ALLOWED_EXTENSIONS = {'.html', '.css', '.js', '.json', '.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp', '.bmp', '.ico', '.txt', '.md', '.csv', '.py'}
DATA_ROOT = '/root/data'
SCRIPTS_ROOT = '/root/scripts'
MASTER_KEY = MASTER_KEY_CONST

ALLOWED_ROOTS = {'data': DATA_ROOT, 'scripts': SCRIPTS_ROOT}

def _resolve_root(root_name):
    """Resolve a root name ('data' or 'scripts') to its absolute path."""
    return ALLOWED_ROOTS.get(root_name, DATA_ROOT)

@app.route('/api/upload-bundle', methods=['POST'])
def upload_bundle():
    """Accept an encrypted .red5 or plain .zip, validate contents, extract to /root/data/."""
    try:
        file_bytes = None
        password = None

        if request.files and 'bundle' in request.files:
            file_bytes = request.files['bundle'].read()
            password = request.form.get('password', '')
        elif request.content_type and 'json' in request.content_type:
            data = request.json
            b64 = data.get('file_data', '')
            password = data.get('password', '')
            if ',' in b64:
                b64 = b64.split(',', 1)[1]
            file_bytes = base64.b64decode(b64)

        if not file_bytes:
            return jsonify({'success': False, 'error': 'No file provided.'}), 400

        if not password:
            return jsonify({'success': False, 'error': 'Password is required.'}), 400

        # Determine if file is encrypted (.red5) or plain zip
        zip_bytes = None
        is_encrypted = False

        if file_bytes[:8] in (b'RED5ENC1', b'RED5ENC2'):
            is_encrypted = True
            zip_bytes, err = decrypt_bundle(file_bytes, password)
            if zip_bytes is None:
                return jsonify({'success': False, 'error': 'Decryption failed: wrong password.'}), 400
        else:
            zip_bytes = file_bytes

        if not zipfile.is_zipfile(io.BytesIO(zip_bytes)):
            return jsonify({'success': False, 'error': 'File is not a valid zip archive (after decryption).'}), 400

        extracted = []
        skipped = []
        errors = []

        with zipfile.ZipFile(io.BytesIO(zip_bytes), 'r') as zf:
            for entry in zf.namelist():
                if entry.endswith('/') or '__MACOSX' in entry or entry.startswith('.'):
                    continue
                if '..' in entry:
                    skipped.append({'file': entry, 'reason': 'Path traversal blocked'})
                    continue

                clean_name = entry.lstrip('/')
                
                # Determine target root: scripts/ prefix -> /root/scripts/, else -> /root/data/
                if clean_name.startswith('scripts/'):
                    target_root = SCRIPTS_ROOT
                    clean_name = clean_name[len('scripts/'):]
                else:
                    target_root = DATA_ROOT
                    parts = clean_name.split('/')
                    if len(parts) > 1 and parts[0] not in ('js', 'configs', 'graphics', 'assets'):
                        ext = os.path.splitext(parts[0])[1]
                        if not ext:
                            clean_name = '/'.join(parts[1:])

                _, ext = os.path.splitext(clean_name)

                # Auto-route: .py files always go to /root/scripts/
                if ext.lower() == '.py':
                    target_root = SCRIPTS_ROOT
                    clean_name = os.path.basename(clean_name)

                # Auto-route: .json files go to /root/data/configs/
                if ext.lower() == '.json' and not clean_name.startswith('configs/'):
                    clean_name = 'configs/' + os.path.basename(clean_name)

                if ext.lower() not in ALLOWED_EXTENSIONS:
                    skipped.append({'file': clean_name, 'reason': f'Extension "{ext}" not allowed'})
                    continue

                dest_path = os.path.normpath(os.path.join(target_root, clean_name))
                if not (dest_path.startswith(DATA_ROOT) or dest_path.startswith(SCRIPTS_ROOT)):
                    skipped.append({'file': clean_name, 'reason': 'Resolved outside target directory'})
                    continue

                parent = os.path.dirname(dest_path)
                os.makedirs(parent, exist_ok=True)

                try:
                    content = zf.read(entry)
                    with open(dest_path, 'wb') as f:
                        f.write(content)
                    dest_label = 'scripts/' + clean_name if target_root == SCRIPTS_ROOT else clean_name
                    dest_root_label = 'scripts' if target_root == SCRIPTS_ROOT else 'data'
                    extracted.append({'file': dest_label, 'size': len(content), 'root': dest_root_label})
                except Exception as ex:
                    errors.append({'file': clean_name, 'error': str(ex)})

        return jsonify({
            'success': True,
            'message': f'Bundle extracted: {len(extracted)} files deployed.',
            'extracted': extracted,
            'skipped': skipped,
            'errors': errors,
            'total_extracted': len(extracted),
            'total_skipped': len(skipped),
            'total_errors': len(errors),
            'encrypted': is_encrypted
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/download-bundle', methods=['POST'])
def download_bundle():
    """Generate a zip of files in /root/data/ and /root/scripts/, encrypt with password,
    return as .red5 file.

    Request JSON:
      password: required (encrypts the bundle)
      mode: 'full' (default) — everything in /root/data + /root/scripts
            'replicate'      — code, html, js, configs, graphics. EXCLUDES per-
                              controller runtime state (telemetry snapshots,
                              weather caches, current weather location,
                              CSV.Description band-state files) so a destination
                              controller keeps its own runtime state but adopts
                              the source's setup.
    """
    try:
        data = request.json or {}
        password = data.get('password', '')
        mode = (data.get('mode') or 'full').lower()
        if mode not in ('full', 'replicate'):
            mode = 'full'
        if not password:
            return jsonify({'success': False, 'error': 'Password is required.'}), 400

        # Files / patterns to exclude in replication mode. These are per-
        # controller runtime artifacts that shouldn't follow the bundle.
        # weather_location.json IS kept on purpose so the destination
        # controller inherits the source's saved-locations list — the
        # operator can edit it from the destination dashboard afterwards.
        REPLICATE_EXCLUDE_BASENAMES = {
            'telemetry.json',
            'telemetry.json.tmp',
            'collector_log.json',
            'write_history.json',
            'sim_overrides.json',
            'band_guide.csv',           # Current band state (regenerated by collector)
        }
        def _replicate_should_skip(arc_name):
            """arc_name is the path inside the zip (e.g. 'configs/telemetry.json')."""
            base = os.path.basename(arc_name)
            if base in REPLICATE_EXCLUDE_BASENAMES:
                return True
            # Cached open-meteo history files: weather_<lat>_<lon>_<year>.json.
            # Drop them — they'll re-cache on first selection at the destination.
            # Do NOT match weather_location.json (preferred-locations list).
            if base.startswith('weather_') and base.endswith('.json') and base != 'weather_location.json':
                return True
            return False

        manifest = {'mode': mode, 'included': 0, 'excluded': []}
        buf = io.BytesIO()
        with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as zf:
            # Include /root/data/ files
            for dirpath, dirnames, filenames in os.walk(DATA_ROOT):
                rel_dir = os.path.relpath(dirpath, DATA_ROOT)
                if rel_dir != '.' and rel_dir.startswith('.'):
                    continue
                for fname in filenames:
                    if fname.startswith('.') or fname.endswith('.tmp'):
                        continue
                    full_path = os.path.join(dirpath, fname)
                    arc_name = os.path.relpath(full_path, DATA_ROOT)
                    if mode == 'replicate' and _replicate_should_skip(arc_name):
                        manifest['excluded'].append(arc_name)
                        continue
                    try:
                        zf.write(full_path, arc_name)
                        manifest['included'] += 1
                    except (FileNotFoundError, OSError):
                        pass
            # Include /root/scripts/ files under 'scripts/' prefix
            if os.path.isdir(SCRIPTS_ROOT):
                for dirpath, dirnames, filenames in os.walk(SCRIPTS_ROOT):
                    rel_dir = os.path.relpath(dirpath, SCRIPTS_ROOT)
                    if rel_dir != '.' and rel_dir.startswith('.'):
                        continue
                    for fname in filenames:
                        if fname.startswith('.') or fname.endswith('.tmp'):
                            continue
                        full_path = os.path.join(dirpath, fname)
                        arc_name = 'scripts/' + os.path.relpath(full_path, SCRIPTS_ROOT)
                        if mode == 'replicate' and _replicate_should_skip(arc_name):
                            manifest['excluded'].append(arc_name)
                            continue
                        try:
                            zf.write(full_path, arc_name)
                            manifest['included'] += 1
                        except (FileNotFoundError, OSError):
                            pass
            # Embed a small manifest so the receiving controller knows what mode
            # this bundle was built in. Visible to the operator after upload.
            try:
                zf.writestr('REPLICATE_MANIFEST.json', json.dumps(manifest, indent=2))
            except Exception:
                pass
        buf.seek(0)
        encrypted = encrypt_bundle(buf.getvalue(), password)

        fname = 'red5_replicate.red5' if mode == 'replicate' else 'red5_bundle.red5'
        return Response(
            encrypted,
            mimetype='application/octet-stream',
            headers={'Content-Disposition': f'attachment; filename={fname}'}
        )
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/update')
def serve_update_page():
    return _no_cache(send_from_directory('/root/data', 'update.html'))


@app.route('/band_guide.md')
def serve_band_guide_md():
    """Serve the human-readable Band Control Strategy guide.

    Linked from update.html so anyone deploying the controller can fetch
    the doc alongside the bundle.  Served as text/markdown — browsers
    display the raw content; markdown viewers render it nicely.
    """
    resp = _no_cache(send_from_directory('/root/data', 'band_guide.md'))
    resp.headers['Content-Type'] = 'text/markdown; charset=utf-8'
    return resp


@app.route('/control_strategy_insight.md')
def serve_control_strategy_insight_md():
    """Serve the engineer-facing essay explaining why short-window optimal
    fixed-SA can appear lower than B1-B10 in the T×Time chart and why it
    doesn't generalize to operations."""
    resp = _no_cache(send_from_directory('/root/data', 'control_strategy_insight.md'))
    resp.headers['Content-Type'] = 'text/markdown; charset=utf-8'
    return resp


@app.route('/control_strategy_insight.ko.md')
def serve_control_strategy_insight_ko_md():
    """Korean (6th-grade level) version of the control-strategy insight.
    Useful for sharing with clinical staff and non-engineering stakeholders
    who want to understand why the fixed-SA Total occasionally dips below
    B1-B10 on short windows."""
    resp = _no_cache(send_from_directory('/root/data', 'control_strategy_insight.ko.md'))
    resp.headers['Content-Type'] = 'text/markdown; charset=utf-8'
    return resp


# --- TELEMETRY API ENDPOINTS ---

@app.route('/api/telemetry-status')
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


@app.route('/api/telemetry-raw')
def telemetry_raw():
    """Return raw telemetry.json contents for debugging."""
    telemetry = _load_telemetry()
    if telemetry:
        return jsonify(telemetry)
    return jsonify({'success': False, 'error': 'No telemetry data available.'})


@app.route('/api/collector-config', methods=['GET', 'POST'])
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


@app.route('/api/collector-log')
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


@app.route('/api/write-point', methods=['POST'])
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
        equipment_types = load_json(
            os.path.join(CONFIG_DIR, 'equipment_types.json'),
            os.path.join('/root/data', 'equipment_types.json')
        )
        if not equipment_types:
            return jsonify({'success': False, 'error': 'equipment_types.json not found'}), 404

        # Load map_config for type wiring
        map_config = load_json(
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


@app.route('/api/equipment-points/<equipment_name>')
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
    map_config = load_json(os.path.join(CONFIG_DIR, 'map_config.json'), os.path.join('/root/data', 'map_config.json'))
    equip_type = 'vav' if is_vav else 'ahu'
    type_id = equip.get('type_id', '1')
    for floor in map_config.get('floors', []):
        for marker in floor.get('markers', []):
            if marker.get('name') == equipment_name:
                equip_type = marker.get('type', equip_type)
                type_id = str(marker.get('equipment_type_id', type_id))
                break

    eq_types = load_json(os.path.join(CONFIG_DIR, 'equipment_types.json'), os.path.join('/root/data', 'equipment_types.json'))
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


def load_json(path, fallback_path=None):
    """Load a JSON file, trying fallback path if primary doesn't exist."""
    for p in [path, fallback_path]:
        if p and os.path.isfile(p):
            try:
                with open(p, 'r') as f:
                    return json.load(f)
            except:
                pass
    return {}


@app.route('/api/write-history')
def write_history():
    """Return recent write command history."""
    return jsonify({'success': True, 'history': list(reversed(_write_history))})


@app.route('/api/trend-history')
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


# --- Band CSV Generator Background Task ---
try:
    import band_csv_generator
    CONFIG_PATH = os.path.join('/root/data', 'collector_config.json')
    if os.path.exists(CONFIG_PATH):
        band_csv_generator.generate_all(CONFIG_PATH, '/root/data')
        band_csv_generator.start_background(CONFIG_PATH, '/root/data', interval=300)
        print("* Band CSV guide generator started (background, 5-min interval)")
    else:
        print("* Band CSV: collector_config.json not found, skipping")
except ImportError:
    print("* Band CSV: band_csv_generator.py not found, skipping")
except Exception as e:
    print(f"* Band CSV: Error — {e}")


@app.route('/api/band-csv/regenerate', methods=['POST'])
def regenerate_band_csv():
    """Manually trigger CSV regeneration."""
    try:
        import band_csv_generator
        cfg = os.path.join('/root/data', 'collector_config.json')
        files = band_csv_generator.generate_all(cfg, '/root/data')
        return jsonify({'status': 'ok', 'files': [os.path.basename(f) for f in files]})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@app.route('/api/band-csv/guide')
def get_band_guide():
    """Download the universal band_guide.csv."""
    filepath = os.path.join('/root/data', 'band_guide.csv')
    if not os.path.exists(filepath):
        return jsonify({'error': 'band_guide.csv not found — trigger /api/band-csv/regenerate first'}), 404
    return send_from_directory('/root/data', 'band_guide.csv', mimetype='text/csv')


@app.route('/api/band-csv/<ahu_id>')
def get_band_csv(ahu_id):
    """Download a per-AHU VAV projection CSV."""
    filename = ahu_id + '_vav_proj.csv'
    filepath = os.path.join('/root/data', filename)
    if not os.path.exists(filepath):
        return jsonify({'error': filename + ' not found'}), 404
    return send_from_directory('/root/data', filename, mimetype='text/csv')


try:
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    local_ip = s.getsockname()[0]
    s.close()
    print(f"\n* Controller Online at: http://{local_ip}:{PORT}")
    print(f"* Update page at: http://{local_ip}:{PORT}/update")
except:
    print(f"\n* Controller Online at: http://127.0.0.1:{PORT}")

app.run(host=HOST, port=PORT, threaded=True, debug=False)
