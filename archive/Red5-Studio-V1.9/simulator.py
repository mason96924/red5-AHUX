#!/usr/bin/env python3
"""
Red5 BACnet CSV Simulator v1.0
Creates and populates BACnet CSV objects with simulated sensor data.

On the real controller (dibt available):
  - Creates CSV BACnet objects per AHU group using dibt.Create()
  - Continuously writes simulated sensor values using dibt.Write()

Without dibt (development/testing):
  - Writes simulated data directly to telemetry.json
  - Equivalent to running collector.py --mock

The CSV object per AHU contains: [AHU points],[VAV1 points],[VAV2 points],...
Point order matches equipment_types.json definitions.

Configuration: /root/data/configs/collector_config.json
References:    /root/data/configs/equipment_types.json, map_config.json

Usage:
    python3 simulator.py                     # Create objects + run simulation
    python3 simulator.py --create-only       # Just create CSV objects, don't write
    python3 simulator.py --interval 5        # Write interval (default 5s)
    python3 simulator.py --once              # Single write cycle then exit
    python3 simulator.py --drift             # Enable realistic value drift
"""

import json
import math
import os
import random
import sys
import time
import argparse
import traceback

# ---- Paths ----
DATA_ROOT = '/root/data'
CONFIG_DIR = os.path.join(DATA_ROOT, 'configs')
TELEMETRY_PATH = os.path.join(CONFIG_DIR, 'telemetry.json')
COLLECTOR_CONFIG_PATH = os.path.join(CONFIG_DIR, 'collector_config.json')
EQUIPMENT_TYPES_PATH = os.path.join(CONFIG_DIR, 'equipment_types.json')
EQUIPMENT_TYPES_ALT = os.path.join(DATA_ROOT, 'equipment_types.json')
MAP_CONFIG_PATH = os.path.join(CONFIG_DIR, 'map_config.json')
MAP_CONFIG_ALT = os.path.join(DATA_ROOT, 'map_config.json')

DEFAULT_INTERVAL = 5
VERSION = '1.0'

# ---- dibt ----
# simulator.py is the mock-mode telemetry generator -- it never actually
# calls dibt.  The previous defensive `import dibt` was harmless on dev
# hosts but on the controller it raised non-ImportError C-extension
# faults that prevented this script from running.  Removed entirely
# 2026-05-08; mock-mode telemetry does not need BACnet.
DIBT_AVAILABLE = False


def load_json(path, fallback_path=None):
    for p in [path, fallback_path]:
        if p and os.path.isfile(p):
            try:
                with open(p, 'r') as f:
                    return json.load(f)
            except:
                pass
    return {}


def log(msg):
    print(f'[SIMULATOR {time.strftime("%H:%M:%S")}] {msg}', flush=True)


# ===== Equipment Discovery (shared logic with collector) =====

def build_equipment_lookup(map_config):
    lookup = {}
    for floor in map_config.get('floors', []):
        for marker in floor.get('markers', []):
            name = marker.get('name', '')
            if name:
                lookup[name] = {
                    'type': marker.get('type', ''),
                    'type_id': str(marker.get('equipment_type_id', '1'))
                }
    return lookup


def get_point_defs(equipment_types, equip_type, type_id):
    type_key = 'ahu_types' if equip_type == 'ahu' else 'vav_types'
    return equipment_types.get(type_key, {}).get(str(type_id), {}).get('points', [])


def discover_groups(config, equipment_lookup, equipment_types):
    """Discover AHU groups with their full point structure."""
    groups = []
    for ahu_name, group_cfg in config.get('ahu_groups', {}).items():
        csv_object = group_cfg.get('csv_object', '')
        vav_names = group_cfg.get('vavs', [])
        if not csv_object:
            continue

        ahu_info = equipment_lookup.get(ahu_name, {})
        ahu_type_id = ahu_info.get('type_id', '1')
        ahu_point_defs = get_point_defs(equipment_types, 'ahu', ahu_type_id)

        vav_entries = []
        for vav_name in vav_names:
            vav_info = equipment_lookup.get(vav_name, {})
            vav_type_id = vav_info.get('type_id', '1')
            vav_point_defs = get_point_defs(equipment_types, 'vav', vav_type_id)
            vav_entries.append((vav_name, vav_type_id, vav_point_defs))

        total = len(ahu_point_defs) + sum(len(vd) for _, _, vd in vav_entries)
        groups.append({
            'ahu_name': ahu_name,
            'csv_object': csv_object,
            'ahu_type_id': ahu_type_id,
            'ahu_point_defs': ahu_point_defs,
            'vav_entries': vav_entries,
            'total_points': total
        })
    return groups


# ===== Psychrometric Helpers =====

def psat_kpa(t):
    """Saturation vapor pressure (kPa) at dry-bulb temperature t (deg C).
    Uses ASHRAE correlation (same as app.py and psy-3d-engine.js).
    """
    tk = t + 273.15
    if tk < 173.15:
        return 0.0001
    try:
        if tk < 273.15:
            c = [-5674.5359, 6.3925247, -9.677843e-3, 6.2215701e-7,
                 2.0747825e-9, -9.484024e-13, 4.1635019]
            ln_p = (c[0]/tk + c[1] + c[2]*tk + c[3]*tk**2
                    + c[4]*tk**3 + c[5]*tk**4 + c[6]*math.log(tk))
        else:
            c = [-5800.2206, 1.3914993, -4.8640239e-2, 4.1764768e-5,
                 -1.4452093e-8, 6.5459673]
            ln_p = (c[0]/tk + c[1] + c[2]*tk + c[3]*tk**2
                    + c[4]*tk**3 + c[5]*math.log(tk))
        return math.exp(ln_p) / 1000.0
    except Exception:
        return 0.001


def calc_w(t, rh):
    """Humidity ratio (kg/kg dry air) from dry-bulb temp (C) and RH (%)."""
    ps = psat_kpa(t)
    pw = max(0.0, rh / 100.0) * ps
    patm = 101.325
    denom = patm - pw
    if denom <= 0.1:
        return 0.030
    return 0.621945 * pw / denom


def calc_rh(t, w):
    """Relative humidity (%) from dry-bulb temp (C) and humidity ratio (kg/kg)."""
    ps = psat_kpa(t)
    if ps <= 0 or w <= 0:
        return 0.0
    patm = 101.325
    pw = patm * w / (0.621945 + w)
    rh = (pw / ps) * 100.0
    return max(0.0, min(100.0, rh))


def calc_enthalpy(t, w):
    """Enthalpy (kJ/kg dry air) from dry-bulb temp (C) and humidity ratio (kg/kg)."""
    return 1.006 * t + w * (2501.0 + 1.86 * t)


# ===== Correlated Psychrometric State =====
# Ensures OAT/OAH and SAT/SAH are physically consistent each cycle.

_psy_ahu_cache = {}   # {ahu_name: {oa_t, oa_rh, sa_t, sa_rh, ts}}
_psy_vav_cache = {}   # {vav_name: {t, rh, ts}}


def _get_ahu_psy_state(ahu_name):
    """Return a thermodynamically consistent OA/SA state for an AHU.

    Values are cached for 2 seconds so all points within the same
    simulation cycle see the same coherent state.
    """
    now = time.time()
    cached = _psy_ahu_cache.get(ahu_name)
    if cached and (now - cached['ts']) < 2.0:
        return cached

    # --- Outside Air (OA) ---
    # Temperature: slow sinusoidal cycle (simulates diurnal variation)
    oa_t = 22.0 + 5.0 * math.sin(now / 600.0)
    oa_t += random.gauss(0, 0.3)

    # Humidity ratio correlates with temperature:
    #   Warm air carries more moisture.  Rough model gives ~6 g/kg at
    #   15 C up to ~14 g/kg at 30 C -- typical moderate/subtropical climate.
    oa_w = 0.003 + 0.0004 * oa_t
    oa_w += random.gauss(0, 0.0005)
    oa_w = max(0.002, min(0.025, oa_w))

    # Derive RH from T and W (guarantees thermodynamic consistency)
    oa_rh = calc_rh(oa_t, oa_w)
    oa_rh = max(15.0, min(98.0, oa_rh))

    # --- Supply Air (SA) ---
    # Cooling coil discharge: typically 12-16 C, near saturation
    sa_t = 15.0 + random.gauss(0, 0.3)
    sa_t = max(11.0, min(18.0, sa_t))

    # Post-cooling-coil air is near saturation (90-95% RH)
    sa_rh = 92.0 + random.gauss(0, 1.5)
    sa_rh = max(85.0, min(98.0, sa_rh))

    # Safety: SA humidity ratio must not exceed saturation at SA temp
    sa_w_sat = calc_w(sa_t, 100.0)
    sa_w = calc_w(sa_t, sa_rh)
    if sa_w > sa_w_sat * 0.98:
        sa_rh = calc_rh(sa_t, sa_w_sat * 0.95)

    state = {
        'oa_t': round(oa_t, 1),
        'oa_rh': round(oa_rh, 1),
        'sa_t': round(sa_t, 1),
        'sa_rh': round(sa_rh, 1),
        'ts': now
    }
    _psy_ahu_cache[ahu_name] = state
    return state


def _get_vav_psy_state(vav_name):
    """Return a thermodynamically consistent zone state for a VAV box.

    Zone temperature and humidity ratio are generated together, then
    RH is derived so the three values are always self-consistent.
    """
    now = time.time()
    cached = _psy_vav_cache.get(vav_name)
    if cached and (now - cached['ts']) < 2.0:
        return cached

    # Typical indoor zone: 22-26 C
    zone_t = 23.0 + random.gauss(0, 0.8)
    zone_t = max(20.0, min(28.0, zone_t))

    # Indoor humidity ratio: typically 7-11 g/kg
    zone_w = 0.009 + random.gauss(0, 0.001)
    zone_w = max(0.005, min(0.014, zone_w))

    # Derive RH from T and W (consistent)
    zone_rh = calc_rh(zone_t, zone_w)
    zone_rh = max(25.0, min(70.0, zone_rh))

    state = {
        't': round(zone_t, 1),
        'rh': round(zone_rh, 1),
        'ts': now
    }
    _psy_vav_cache[vav_name] = state
    return state


# ===== Simulation Engine =====

class SimState:
    """Holds drifting state for realistic simulation."""

    def __init__(self):
        self.state = {}  # {equip_name: {label: current_value}}

    def get(self, equip_name, label, initial_value, drift_range=0.3):
        key = f'{equip_name}.{label}'
        if key not in self.state:
            self.state[key] = initial_value
        # Apply drift
        current = self.state[key]
        drift = random.gauss(0, drift_range)
        self.state[key] = current + drift
        return self.state[key]


def sim_value(pt, equip_name, sim_state=None, drift=False):
    """Generate a simulated value for a point, optionally with drift.

    For psychrometric air-stream points (OAT/OAH, SAT/SAH, zone t/rh),
    values are generated from a correlated thermodynamic state so that
    temperature, humidity ratio, and relative humidity are always
    physically self-consistent.
    """
    label = pt.get('label', '')
    name_lower = pt.get('name', '').lower()
    ul = label.upper()
    ll = label.lower()

    # --- Psychrometrically correlated AHU air-stream points ---
    # These return directly (no additional noise) because the correlated
    # state already includes realistic variation.
    if ul == 'OAT':
        return _get_ahu_psy_state(equip_name)['oa_t']
    elif ul == 'OAH':
        return _get_ahu_psy_state(equip_name)['oa_rh']
    elif ul == 'SAT':
        return _get_ahu_psy_state(equip_name)['sa_t']
    elif ul == 'SAH':
        return _get_ahu_psy_state(equip_name)['sa_rh']

    # --- Psychrometrically correlated VAV zone points ---
    if ll == 't' or ('temp' in name_lower):
        return _get_vav_psy_state(equip_name)['t']
    elif ll == 'rh' or 'humid' in name_lower:
        return _get_vav_psy_state(equip_name)['rh']

    # --- Non-psychrometric points (valves, modes, inverters, etc.) ---
    # Sticky boolean state per (equip, label) so mode/status points do not flip
    # every sim cycle. Stored on the sim_value function itself.
    _boolean_memo = getattr(sim_value, '_boolean_memo', None)
    if _boolean_memo is None:
        _boolean_memo = {}
        sim_value._boolean_memo = _boolean_memo
    if ul in ('HM', 'SAFM', 'AHUM', 'AHUSS', 'HCM', 'INV1_SST', 'INV2_SST',
              'INV1_STATUS', 'INV2_STATUS', 'FDPS'):
        mkey = f'{equip_name}|{ul}'
        if mkey not in _boolean_memo:
            # Initialize deterministically (stable across restarts per equip+label)
            _boolean_memo[mkey] = 1 if (hash(mkey) & 1) else 0
        return _boolean_memo[mkey]
    if ul in ('OAD',):
        base = 45.0
    elif ul in ('HV', 'PCV', 'HCV', 'WHRV', 'HSP', 'SPRSP'):
        # Sticky base so these RO valve positions drift gently instead of jumping 20-80 each cycle
        _analog_memo = getattr(sim_value, '_analog_memo', None)
        if _analog_memo is None:
            _analog_memo = {}
            sim_value._analog_memo = _analog_memo
        mkey = f'{equip_name}|{ul}'
        if mkey not in _analog_memo:
            _analog_memo[mkey] = random.uniform(30, 70)
        base = _analog_memo[mkey]
    elif ul in ('INV1_ALM', 'INV2_ALM'):
        return 0
    elif ul in ('INV1_F', 'INV2_F', 'INV1_H', 'INV2_H'):
        base = 40.0
    elif ul in ('INV1_A', 'INV2_A'):
        base = 15.0
    elif ul == 'AFPC':
        base = 1400.0
    elif ul in ('SAF', 'FMS', 'SPR'):
        base = 1200.0
    elif ul == 'SATSP':
        base = 18.0
    elif ll == 'cfm':
        base = 600.0
    elif ll == 'damper':
        base = 55.0
    elif ll == 'rdp':
        base = 5.0
    elif ll == 'co2':
        base = 550.0
    elif ll in ('cav', 'heppa'):
        base = 50.0
    elif ll in ('sp', 't_sp'):
        base = 22.0
    elif ll == 'dpsp':
        base = 22.0
    elif ll == 'h_sp':
        base = 45.0
    elif ll == 'c_sp':
        base = 600.0
    elif ll == 'loc':
        return hash(equip_name) % 1000
    else:
        pt_min = pt.get('min')
        pt_max = pt.get('max')
        if pt_min is not None and pt_max is not None:
            base = (float(pt_min) + float(pt_max)) / 2
        else:
            base = 50.0

    if drift and sim_state:
        return round(sim_state.get(equip_name, label, base, 0.2), 1)
    else:
        return round(base + random.gauss(0, 0.5), 1)


def generate_csv_string(group, sim_state=None, drift=False):
    """Generate the full CSV string for an AHU group."""
    values = []
    for pt in group['ahu_point_defs']:
        values.append(str(sim_value(pt, group['ahu_name'], sim_state, drift)))
    for vav_name, _, vav_point_defs in group['vav_entries']:
        for pt in vav_point_defs:
            values.append(str(sim_value(pt, vav_name, sim_state, drift)))
    return ','.join(values)


# ===== BACnet Object Creation =====

def create_csv_objects(groups):
    """Create BACnet CSV objects for all AHU groups."""
    created = []
    errors = []

    for group in groups:
        csv_name = group['csv_object']
        display_name = f'{group["ahu_name"]} Telemetry'

        if DIBT_AVAILABLE:
            try:
                result = dibt.Create(csv_name, display_name)
                if isinstance(result, dibt.Error):
                    log(f'  Error creating {csv_name}: {result}')
                    errors.append(csv_name)
                else:
                    log(f'  Created {csv_name} ({display_name}) - {group["total_points"]} values')
                    created.append(csv_name)
            except Exception as e:
                log(f'  Exception creating {csv_name}: {e}')
                errors.append(csv_name)
        else:
            log(f'  [MOCK] Would create {csv_name} ({display_name}) - {group["total_points"]} values')
            created.append(csv_name)

    return created, errors


def write_csv_object(csv_name, csv_string):
    """Write a CSV string to a BACnet object."""
    if DIBT_AVAILABLE:
        ref = f'{csv_name}.Present_Value'
        try:
            result = dibt.Write(ref, Value=csv_string)
            if isinstance(result, dibt.Error):
                log(f'Write error {csv_name}: {result}')
                return False
            return True
        except Exception as e:
            log(f'Write exception {csv_name}: {e}')
            return False
    return True  # Mock always succeeds


# ===== Direct Telemetry Write (no-dibt fallback) =====

HISTORY_MAX = 60
_sim_history = {}

def _update_history(telemetry):
    """Update ring buffer history with current telemetry values."""
    for ahu_name, ahu_data in telemetry.get('equipment', {}).items():
        for label, value in ahu_data.get('points', {}).items():
            key = f'{ahu_name}.{label}'
            if key not in _sim_history:
                _sim_history[key] = []
            if value is not None:
                _sim_history[key].append(round(value, 2) if isinstance(value, float) else value)
                if len(_sim_history[key]) > HISTORY_MAX:
                    _sim_history[key] = _sim_history[key][-HISTORY_MAX:]
        for vav_name, vav_data in ahu_data.get('vavs', {}).items():
            for label, value in vav_data.get('points', {}).items():
                key = f'{vav_name}.{label}'
                if key not in _sim_history:
                    _sim_history[key] = []
                if value is not None:
                    _sim_history[key].append(round(value, 2) if isinstance(value, float) else value)
                    if len(_sim_history[key]) > HISTORY_MAX:
                        _sim_history[key] = _sim_history[key][-HISTORY_MAX:]


def write_telemetry_direct(groups, sim_state, drift):
    """
    When dibt is not available, write simulated data directly to telemetry.json.
    This allows testing the full pipeline without BACnet.
    """
    telemetry = {
        'timestamp': time.time(),
        'timestamp_iso': time.strftime('%Y-%m-%dT%H:%M:%S'),
        'collector_version': f'simulator-{VERSION}',
        'mock_mode': True,
        'ahu_count': len(groups),
        'equipment': {},
        'read_ok': len(groups),
        'read_errors': 0
    }

    for group in groups:
        csv_string = generate_csv_string(group, sim_state, drift)
        csv_values = csv_string.split(',')

        ahu_points = {}
        offset = 0
        for i, pt in enumerate(group['ahu_point_defs']):
            val_str = csv_values[offset + i].strip() if (offset + i) < len(csv_values) else ''
            try:
                ahu_points[pt['label']] = float(val_str) if val_str else None
            except ValueError:
                ahu_points[pt['label']] = val_str if val_str else None
        offset += len(group['ahu_point_defs'])

        vavs = {}
        for vav_name, vav_type_id, vav_point_defs in group['vav_entries']:
            vav_points = {}
            for i, pt in enumerate(vav_point_defs):
                val_str = csv_values[offset + i].strip() if (offset + i) < len(csv_values) else ''
                try:
                    vav_points[pt['label']] = float(val_str) if val_str else None
                except ValueError:
                    vav_points[pt['label']] = val_str if val_str else None
            offset += len(vav_point_defs)
            vavs[vav_name] = {'type_id': vav_type_id, 'points': vav_points}

        telemetry['equipment'][group['ahu_name']] = {
            'type': 'ahu',
            'type_id': group['ahu_type_id'],
            'csv_object': group['csv_object'],
            'last_read': time.time(),
            'status': 'ok',
            'raw_csv': csv_string,
            'points': ahu_points,
            'total_csv_length': group['total_points'],
            'vavs': vavs
        }

    # Update and include history ring buffer
    _update_history(telemetry)
    telemetry['history'] = {
        'max_entries': HISTORY_MAX,
        'point_count': len(_sim_history),
        'data': _sim_history
    }

    os.makedirs(os.path.dirname(TELEMETRY_PATH), exist_ok=True)
    tmp = TELEMETRY_PATH + '.tmp'
    with open(tmp, 'w') as f:
        json.dump(telemetry, f)
    os.replace(tmp, TELEMETRY_PATH)


# ===== Main =====

def main():
    parser = argparse.ArgumentParser(description='Red5 BACnet CSV Simulator')
    parser.add_argument('--create-only', action='store_true', help='Only create CSV objects')
    parser.add_argument('--interval', type=int, default=DEFAULT_INTERVAL, help='Write interval (seconds)')
    parser.add_argument('--once', action='store_true', help='Single write then exit')
    parser.add_argument('--drift', action='store_true', help='Enable realistic value drift')
    args = parser.parse_args()

    log(f'Red5 BACnet CSV Simulator v{VERSION}')
    log(f'dibt available: {DIBT_AVAILABLE}')

    # Load configs
    config = load_json(COLLECTOR_CONFIG_PATH)
    config.setdefault('ahu_groups', {})
    equipment_types = load_json(EQUIPMENT_TYPES_PATH, EQUIPMENT_TYPES_ALT)
    map_config = load_json(MAP_CONFIG_PATH, MAP_CONFIG_ALT)
    equipment_lookup = build_equipment_lookup(map_config)

    # Discover groups
    groups = discover_groups(config, equipment_lookup, equipment_types)
    if not groups:
        log('No AHU groups found in collector_config.json. Nothing to simulate.')
        return

    log(f'Found {len(groups)} AHU groups:')
    for g in groups:
        vav_str = ', '.join(vn for vn, _, _ in g['vav_entries'])
        log(f'  {g["ahu_name"]} -> {g["csv_object"]} '
            f'({len(g["ahu_point_defs"])} AHU + '
            f'{sum(len(vd) for _, _, vd in g["vav_entries"])} VAV pts = {g["total_points"]})')
        if vav_str:
            log(f'    VAVs: {vav_str}')

    # Step 1: Create BACnet CSV objects
    log('--- Creating CSV objects ---')
    created, errors = create_csv_objects(groups)
    log(f'Created: {len(created)}, Errors: {len(errors)}')

    if args.create_only:
        log('--create-only flag set. Exiting.')
        return

    # Step 2: Simulation loop
    log(f'--- Starting simulation (interval={args.interval}s, drift={args.drift}) ---')
    sim_state = SimState() if args.drift else None
    interval = max(args.interval, 1)
    cycle = 0

    while True:
        try:
            if DIBT_AVAILABLE:
                # Write to actual BACnet objects
                for group in groups:
                    csv_string = generate_csv_string(group, sim_state, args.drift)
                    ok = write_csv_object(group['csv_object'], csv_string)
                    if cycle == 0:
                        status = 'OK' if ok else 'FAIL'
                        log(f'  {group["csv_object"]}: {len(csv_string)} chars [{status}]')
            else:
                # No dibt: write directly to telemetry.json
                write_telemetry_direct(groups, sim_state, args.drift)
                if cycle == 0:
                    log('  Writing directly to telemetry.json (no dibt)')

            if cycle % 12 == 0 and cycle > 0:
                log(f'Simulation cycle {cycle}')

            cycle += 1

            if args.once:
                log('Single cycle done. Exiting.')
                break

        except KeyboardInterrupt:
            log('Interrupted.')
            break
        except Exception as e:
            log(f'Error: {e}')
            traceback.print_exc()

        time.sleep(interval)

main()
