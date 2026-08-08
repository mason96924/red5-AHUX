#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Red5 Telemetry Collector v1.1
Standalone background script that polls BACnet CSV objects via dibt.Read()
and writes parsed telemetry to /root/data/configs/telemetry.json

Architecture:
  - One CSV BACnet object per AHU, containing the AHU's own points
    followed by each of its VAVs' points concatenated in order.
  - Equipment instances are "wired" to their type definitions via map_config.json.
  - Point definitions come from equipment_types.json.

Configuration: /root/data/configs/collector_config.json
Telemetry:     /root/data/configs/telemetry.json

Usage:
    python3 collector.py                  # Run with defaults
    python3 collector.py --interval 10    # Override poll interval
    python3 collector.py --mock           # Force mock mode (no dibt needed)
    python3 collector.py --once           # Single cycle then exit
"""

import json
import math
import os
import random
import re
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
COLLECTOR_LOG_PATH = os.path.join(CONFIG_DIR, 'collector_log.json')
WRITE_QUEUE_PATH    = os.path.join(CONFIG_DIR, 'write_queue.json')
WRITE_RESULTS_PATH  = os.path.join(CONFIG_DIR, 'write_results.json')
WRITE_RESULTS_MAX   = 200  # ring buffer of recent write attempts

# BACnet ObjectID format: 2-4 letter type prefix followed by an integer
# instance.  Valid prefixes per ASHRAE 135 + Delta Controls extensions:
#   AV / AI / AO  -- analog value / input / output
#   BV / BI / BO  -- binary value / input / output
#   MSV / MSI / MSO -- multistate value / input / output
#   CSV           -- character-string value (used for AHU command bundles)
#   TL / SCH / FILE / DEV / PROG / LSP / TLP / EE / NC / GRP / CAL -- misc.
# Names like AHU01_SAT_SP or OAT_SENSOR_01 are Object NAMES not IDs
# and will silently fail at dibt.Write() -- the firmware accepts the call
# but the target reference does not resolve.  Detect at queue-drain time
# and emit a loud log so the operator does not troubleshoot for hours.
# NOTE: implemented as a plain prefix lookup (NOT re.compile) because
# the embedded enteliWEB Python tokenizer chokes on long regex string
# literals and on multi-line re.compile() constructs (reports
# unterminated string literal).  Pure-Python check is robust + fast.
_BACNET_OBJECTID_PREFIXES = (
    'AV', 'AI', 'AO', 'BV', 'BI', 'BO',
    'MSV', 'MSI', 'MSO', 'CSV',
    'TL', 'SCH', 'FILE', 'DEV', 'PROG',
    'LSP', 'TLP', 'EE', 'NC', 'GRP', 'CAL',
)


def _is_bacnet_objectid(s):
    """True iff ``s`` looks like a valid BACnet ObjectID (e.g. 'CSV1')."""
    if not s or not isinstance(s, str):
        return False
    # Find the boundary where letters end and digits begin.
    n = len(s)
    i = 0
    while i < n and s[i].isalpha():
        i += 1
    if i == 0 or i == n:
        return False
    # Tail must be all digits.
    if not s[i:].isdigit():
        return False
    # Head must be one of the known BACnet object-type prefixes.
    return s[:i] in _BACNET_OBJECTID_PREFIXES


DEFAULT_INTERVAL = 5
HISTORY_MAX = 60  # Ring buffer size (60 readings x 5s = 5 min)
VERSION = '1.2'

# ---- dibt is preloaded as a global by the controller runtime, no import needed ----
# (On dev hosts without dibt, mock mode bypasses all dibt.Read/Write calls.)


# ===== Write Queue =====
# /api/write-point in telemetry_service.py runs in the Flask process,
# which does NOT have dibt available (the auto-loaded plug-in cannot
# import the controller runtime-injected dibt global).  Instead the
# Flask side appends each write request to write_queue.json; collector
# (which IS an enteliWEB object with dibt available) drains the queue
# on every poll cycle.  Audit log lands in write_results.json.
# Added 2026-05-08 alongside the PLUGINS_ROOT split.

def _atomic_write_json(path, data):
    """Write JSON to ``path`` atomically (write to .tmp + os.replace)."""
    tmp = path + '.tmp'
    with open(tmp, 'w') as f:
        json.dump(data, f, indent=2)
    os.replace(tmp, path)


def _load_json_list(path):
    """Load a JSON file expected to be a list. Return [] on any error."""
    if not os.path.isfile(path):
        return []
    try:
        with open(path, 'r') as f:
            data = json.load(f)
        return data if isinstance(data, list) else []
    except (IOError, OSError, json.JSONDecodeError):
        return []


def process_write_queue(mock_mode=False):
    """Drain pending write requests from write_queue.json.

    For each entry, execute dibt.Write(csv_object.Present_Value, csv_value)
    and append a result record (success, error, timestamp) to
    write_results.json (capped at WRITE_RESULTS_MAX entries).  In
    mock_mode (or when dibt is unavailable on a dev host), record a
    'mock' result without actually calling dibt.

    Idempotent against concurrent writers: read+rename guarantees the
    queue file is replaced atomically; entries we've already processed
    are removed before we release the file.

    Safe to call every cycle -- does nothing if the queue is empty.
    """
    queue = _load_json_list(WRITE_QUEUE_PATH)
    if not queue:
        return 0

    results = _load_json_list(WRITE_RESULTS_PATH)
    processed = 0
    for entry in queue:
        # UI path: {csv_object, csv_value}. Bridge path (legacy): {object_id, value}.
        csv_obj  = entry.get('csv_object') or entry.get('object_id') or ''
        ref      = csv_obj + '.Present_Value'
        csv_val  = entry.get('csv_value', entry.get('value', ''))
        if csv_val is None:
            csv_val = ''
        elif not isinstance(csv_val, str):
            csv_val = str(csv_val)
        equip    = entry.get('equip_name', '')
        # Defensive BACnet target validation.  Object NAMES (e.g.
        # AHU01_SAT_SP, OAT_SENSOR_01) will silently fail at
        # dibt.Write -- the firmware accepts the call but the reference
        # does not resolve and the write is dropped.  Emit a loud log
        # entry so the operator stops chasing ghost writes; record the
        # diagnosis on the result so /api/write-results surfaces it too.
        target_kind = 'ID' if _is_bacnet_objectid(csv_obj) else 'NAME'
        if target_kind == 'NAME':
            log(('[write-queue] \u26A0 NAME-based target {!r} detected '
                 '(equip={}). BACnet writes require an ObjectID like CSV1, '
                 'AV23, etc. -- this write will silently fail. Edit '
                 'collector_config.json on the controller to use the '
                 'ObjectID.').format(csv_obj, equip))
        result_record = {
            'id':         entry.get('id'),
            'ts':         entry.get('ts'),
            'completed':  time.time(),
            'csv_object': csv_obj,
            'csv_value':  csv_val,
            'equip_name': equip,
            'writes':     entry.get('writes'),
            'source':     entry.get('source'),
            'target_kind': target_kind,
        }
        if mock_mode or 'dibt' not in globals():
            log('[write-queue MOCK] would write {} = {}'.format(ref, csv_val))
            result_record['success'] = True
            result_record['mock']    = True
        else:
            try:
                outcome = dibt.Write(ref, Value=csv_val)
                try:
                    _is_err = isinstance(outcome, dibt.Error)
                except AttributeError:
                    _is_err = False  # newer firmware: dibt has no .Error class
                if _is_err:
                    log('[write-queue] dibt.Write error for {}: {}'.format(ref, outcome))
                    result_record['success'] = False
                    result_record['error']   = str(outcome)
                else:
                    log('[write-queue] wrote {} from {} ({})'.format(ref, equip, csv_val[:60]))
                    result_record['success'] = True
            except Exception as exc:
                log('[write-queue] exception writing {}: {}'.format(ref, exc))
                result_record['success'] = False
                result_record['error']   = type(exc).__name__ + ': ' + str(exc)

        results.append(result_record)
        processed += 1

    # Trim audit log to ring-buffer size.
    if len(results) > WRITE_RESULTS_MAX:
        results = results[-WRITE_RESULTS_MAX:]

    try:
        _atomic_write_json(WRITE_RESULTS_PATH, results)
        # Atomically empty the queue so any in-flight Flask append
        # to .tmp before our rename is preserved next cycle.
        _atomic_write_json(WRITE_QUEUE_PATH, [])
    except OSError as oe:
        log('[write-queue] ERROR persisting results/queue: {}'.format(oe))
    return processed


# ===== JSON Loading =====

def load_json(path, fallback_path=None):
    for p in [path, fallback_path]:
        if p and os.path.isfile(p):
            try:
                with open(p, 'r') as f:
                    return json.load(f)
            except (json.JSONDecodeError, IOError) as e:
                log(f'Error reading {p}: {e}')
    return {}


def load_collector_config():
    config = load_json(COLLECTOR_CONFIG_PATH)
    config.setdefault('version', VERSION)
    config.setdefault('interval', DEFAULT_INTERVAL)
    config.setdefault('ahu_groups', {})
    config.setdefault('dashboard_point_map', {
        'ahu': {'oa_t': 'OAT', 'oa_rh': 'OAH', 'sa_t': 'SAT', 'sa_rh': 'SAH',
                'ma_t': 'MAT', 'ma_rh': 'MAH'},
        'vav': {'zone_t': 't', 'zone_rh': 'rh'}
    })
    return config


def load_equipment_types():
    return load_json(EQUIPMENT_TYPES_PATH, EQUIPMENT_TYPES_ALT)


def load_map_config():
    return load_json(MAP_CONFIG_PATH, MAP_CONFIG_ALT)


# ===== Logging =====

_log_buffer = []

def log(msg):
    timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
    line = f'[COLLECTOR {timestamp}] {msg}'
    print(line, flush=True)
    _log_buffer.append({'time': timestamp, 'msg': msg})
    if len(_log_buffer) > 200:
        _log_buffer.pop(0)


def flush_log():
    try:
        os.makedirs(CONFIG_DIR, exist_ok=True)
        with open(COLLECTOR_LOG_PATH, 'w') as f:
            json.dump(_log_buffer[-100:], f, indent=1)
    except Exception:
        pass


# ===== Map Config Wiring =====

def build_equipment_lookup(map_config):
    """
    Walk map_config.json markers -> build lookup:
      { "AHU-01-E": {"type": "ahu", "type_id": "1"}, ... }
    """
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
    """Retrieve point definitions for a given type."""
    type_key = 'ahu_types' if equip_type == 'ahu' else 'vav_types'
    type_data = equipment_types.get(type_key, {}).get(str(type_id), {})
    return type_data.get('points', [])


# ===== BACnet I/O =====

def read_bacnet_csv(csv_object_name):
    ref = f'{csv_object_name}.Present_Value'
    try:
        value = dibt.Read(ref)
        try:
            _is_err = isinstance(value, dibt.Error)
        except AttributeError:
            _is_err = False  # newer firmware: dibt has no .Error class
        if _is_err:
            log(f'dibt.Read error for {ref}: {value}')
            return None
        return str(value)
    except Exception as e:
        log(f'Exception reading {ref}: {e}')
        return None


# ===== CSV Parsing =====

def parse_csv_segment(csv_values, point_defs, start_index):
    """
    Parse a segment of CSV values starting at start_index using point_defs.
    Returns (parsed_dict, next_index).
    """
    points = {}
    for i, pt in enumerate(point_defs):
        idx = start_index + i
        label = pt.get('label', f'p{i}')
        if idx < len(csv_values):
            val_str = csv_values[idx].strip()
            if val_str.endswith('*'):
                val_str = val_str[:-1].strip()
            if val_str == '' or val_str.lower() == 'null':
                points[label] = None
            else:
                try:
                    points[label] = float(val_str)
                except ValueError:
                    points[label] = val_str
        else:
            points[label] = None
    return points, start_index + len(point_defs)


def build_write_csv(ahu_point_defs, vav_entries, write_target, write_dict):
    """
    Build a full CSV write string for an AHU group.
    write_target: equipment name being written to.
    write_dict: {label: value} for the RW points.
    
    CSV structure: [AHU points],[VAV1 points],[VAV2 points],...*
    Only the target equipment's RW positions get values; everything else is empty.
    """
    all_segments = []

    # AHU segment
    for pt in ahu_point_defs:
        label = pt.get('label', '')
        access = pt.get('access', 'RO')
        if write_target == 'ahu' and label in write_dict and access == 'RW':
            all_segments.append(str(write_dict[label]))
        else:
            all_segments.append('')

    # VAV segments
    for vav_name, vav_point_defs in vav_entries:
        for pt in vav_point_defs:
            label = pt.get('label', '')
            access = pt.get('access', 'RO')
            if write_target == vav_name and label in write_dict and access == 'RW':
                all_segments.append(str(write_dict[label]))
            else:
                all_segments.append('')

    return ','.join(all_segments) + '*'


# ===== Mock Data =====

def generate_mock_value(pt, equip_name):
    """Generate a realistic mock value for a single point."""
    label = pt.get('label', '')
    unit = pt.get('unit', '')
    pt_min = pt.get('min')
    pt_max = pt.get('max')
    name_lower = pt.get('name', '').lower()

    ul = label.upper()
    ll = label.lower()

    if ul in ('OAT',):
        return round(random.uniform(5, 35) + random.gauss(0, 1), 1)
    elif ul in ('OAH',):
        return round(random.uniform(40, 85) + random.gauss(0, 3), 1)
    elif ul in ('SAT',):
        return round(random.uniform(12, 18) + random.gauss(0, 0.3), 1)
    elif ul in ('SAH',):
        return round(random.uniform(50, 65) + random.gauss(0, 2), 1)
    elif ul in ('OAD', 'HV', 'PCV', 'HCV', 'WHRV', 'HSP', 'SPRSP'):
        return round(random.uniform(0, 100), 1)
    elif ul in ('HM', 'SAFM', 'AHUM', 'AHUSS', 'HCM', 'INV1_SST', 'INV2_SST'):
        return random.choice([0, 1])
    elif ul in ('INV1_STATUS', 'INV2_STATUS', 'FDPS'):
        return random.choice([0, 1])
    elif ul in ('INV1_ALM', 'INV2_ALM'):
        return 0
    elif ul in ('INV1_F', 'INV2_F', 'INV1_H', 'INV2_H'):
        return round(random.uniform(20, 55), 1)
    elif ul in ('INV1_A', 'INV2_A'):
        return round(random.uniform(5, 25), 1)
    elif ul in ('AFPC',):
        return round(random.uniform(800, 2000), 0)
    elif ul in ('SAF', 'FMS', 'SPR'):
        return round(random.uniform(100, 3000), 0)
    elif ul == 'SATSP':
        return round(random.uniform(15, 25), 1)
    elif ll in ('t',) or ('temp' in name_lower and unit in ('', 'C', '\u00b0C')):
        return round(random.uniform(20, 26) + random.gauss(0, 0.5), 1)
    elif ll in ('rh',) or 'humid' in name_lower:
        return round(random.uniform(35, 60) + random.gauss(0, 2), 1)
    elif ll in ('cfm',):
        return round(random.uniform(200, 1200), 0)
    elif ll in ('damper',):
        return round(random.uniform(10, 90), 0)
    elif ll in ('rdp',):
        return round(random.uniform(-5, 15), 1)
    elif ll in ('co2',):
        return round(random.uniform(350, 900), 0)
    elif ll in ('cav', 'heppa'):
        return round(random.uniform(0, 100), 0)
    elif ll in ('sp', 't_sp'):
        return round(random.uniform(20, 24), 1)
    elif ll in ('dpsp',):
        return round(random.uniform(18, 28), 1)
    elif ll in ('h_sp',):
        return round(random.uniform(30, 60), 0)
    elif ll in ('c_sp',):
        return round(random.uniform(400, 800), 0)
    elif ll in ('loc',):
        return hash(equip_name) % 1000
    elif pt_min is not None and pt_max is not None:
        return round(random.uniform(float(pt_min), float(pt_max)), 1)
    else:
        return round(random.uniform(0, 100), 1)


def generate_mock_csv_for_group(ahu_name, ahu_point_defs, vav_entries):
    """Generate a full mock CSV string for an AHU group (AHU + all VAVs)."""
    random.seed(hash(ahu_name) % 10000 + int(time.time()) // 5)
    values = []
    for pt in ahu_point_defs:
        values.append(str(generate_mock_value(pt, ahu_name)))
    for vav_name, vav_point_defs in vav_entries:
        for pt in vav_point_defs:
            values.append(str(generate_mock_value(pt, vav_name)))
    return ','.join(values)


# ===== Band Classification =====

# Operator SA-RH clamp loaded from band_overrides.json on each cycle.  The
# clamp narrows every band sa_rh into the operator-defined window and flips
# hum mode to drive SA toward that window (Phase 1: targets + Description
# string only; mechanical actuation is Phase 2 and needs the AHU humidity
# SP BACnet point name).  Pure ASCII, no apostrophes in this comment block
# (embedded tokenizer rule).
BAND_OVERRIDES_PATH = os.path.join(CONFIG_DIR, 'band_overrides.json')

_sa_rh_clamp_cache = {'mtime': 0, 'value': None}


def _load_sa_rh_clamp():
    """Return (lo, hi) tuple if a clamp is enabled in band_overrides.json,
    else None.  Cached by file mtime so the disk hit is amortized across
    every collector cycle (typical poll interval is 5-60 seconds).
    """
    try:
        if not os.path.exists(BAND_OVERRIDES_PATH):
            _sa_rh_clamp_cache['value'] = None
            _sa_rh_clamp_cache['mtime'] = 0
            return None
        mt = os.path.getmtime(BAND_OVERRIDES_PATH)
        if mt == _sa_rh_clamp_cache['mtime']:
            return _sa_rh_clamp_cache['value']
        with open(BAND_OVERRIDES_PATH, 'r') as f:
            data = json.load(f)
        c = data.get('sa_rh_clamp') or {}
        if not c.get('enabled'):
            _sa_rh_clamp_cache['value'] = None
        else:
            lo = c.get('lo'); hi = c.get('hi')
            if lo is None or hi is None:
                _sa_rh_clamp_cache['value'] = None
            else:
                _sa_rh_clamp_cache['value'] = (int(lo), int(hi))
        _sa_rh_clamp_cache['mtime'] = mt
        return _sa_rh_clamp_cache['value']
    except Exception:
        return None


def _apply_sa_rh_clamp(band, lo, hi):
    """Return a NEW band dict with sa_rh clamped to [lo, hi] and hum mode
    flipped to drive SA toward the window.  Pure function: input band is
    not mutated.  Returns a shallow copy unchanged if lo or hi is None.
    Mirror of band_csv_generator.apply_sa_rh_clamp so collector stays
    importless on the embedded controller.
    """
    if lo is None or hi is None:
        return dict(band)
    if lo > hi:
        lo, hi = hi, lo
    orig_rh = band.get('sa_rh', 0)
    clamped_rh = max(lo, min(hi, orig_rh))
    out = dict(band)
    out['sa_rh'] = clamped_rh
    if clamped_rh < orig_rh:
        out['hum'] = 'DEHUMIDIFY'
        out['_clamp'] = 'down'
    elif clamped_rh > orig_rh:
        out['hum'] = 'HUMIDIFY'
        out['_clamp'] = 'up'
    return out


BANDS = [
    {'id': 'B1',  'oa_t': (-50, 5),  'oa_rh': (0, 30),   'sa_t': 21.0, 'sa_rh': 40, 'reheat_t': None,  'oa_damper': 15,  'cc': 'OFF',        'hc': 'AGGRESSIVE', 'hum': 'HUMIDIFY'},
    {'id': 'B2',  'oa_t': (5, 15),   'oa_rh': (30, 60),   'sa_t': 19.5, 'sa_rh': 35, 'reheat_t': None,  'oa_damper': 15,  'cc': 'OFF',        'hc': 'MODERATE',   'hum': 'COND_HUM'},
    {'id': 'B3',  'oa_t': (15, 20),  'oa_rh': (0, 30),    'sa_t': 19.0, 'sa_rh': 45, 'reheat_t': None,  'oa_damper': 30,  'cc': 'OFF',        'hc': 'OFF',        'hum': 'HUMIDIFY'},
    {'id': 'B4',  'oa_t': (18, 22),  'oa_rh': (30, 50),   'sa_t': 20.0, 'sa_rh': 40, 'reheat_t': None,  'oa_damper': 100, 'cc': 'OFF',        'hc': 'OFF',        'hum': 'OFF'},
    {'id': 'B5',  'oa_t': (22, 25),  'oa_rh': (40, 60),   'sa_t': 23.5, 'sa_rh': 50, 'reheat_t': None,  'oa_damper': 100, 'cc': 'OFF',        'hc': 'OFF',        'hum': 'OFF'},
    {'id': 'B6',  'oa_t': (25, 27),  'oa_rh': (50, 70),   'sa_t': 25.0, 'sa_rh': 55, 'reheat_t': None,  'oa_damper': 50,  'cc': 'LIGHT',      'hc': 'OFF',        'hum': 'ACCEPT'},
    {'id': 'B10', 'oa_t': (30, 50),  'oa_rh': (85, 100),  'sa_t': 11.0, 'sa_rh': 95, 'reheat_t': 22.0,  'oa_damper': 15,  'cc': 'MAXIMUM',    'hc': 'REHEAT',     'hum': 'SUBCOOL_REHEAT'},
    {'id': 'B7',  'oa_t': (27, 32),  'oa_rh': (60, 80),   'sa_t': 12.0, 'sa_rh': 95, 'reheat_t': 23.0,  'oa_damper': 15,  'cc': 'AGGRESSIVE', 'hc': 'REHEAT',     'hum': 'SUBCOOL_REHEAT'},
    {'id': 'B8',  'oa_t': (32, 38),  'oa_rh': (70, 100),  'sa_t': 13.0, 'sa_rh': 95, 'reheat_t': 22.0,  'oa_damper': 15,  'cc': 'MAXIMUM',    'hc': 'REHEAT',     'hum': 'SUBCOOL_REHEAT'},
    {'id': 'B9',  'oa_t': (35, 50),  'oa_rh': (0, 30),    'sa_t': 15.0, 'sa_rh': 40, 'reheat_t': None,  'oa_damper': 15,  'cc': 'AGGRESSIVE', 'hc': 'OFF',        'hum': 'OFF'},
]


def classify_band(oa_t, oa_rh):
    """Classify current OA conditions into B1-B10.
    Exact boundary match first, then nearest band center as fallback.
    Applies the operator sa_rh clamp (if any) before returning so every
    downstream caller (write_band_guide_to_description, telemetry payload,
    classify_band logs) sees a single consistent view of the band.
    """
    matched = None
    for band in BANDS:
        t_lo, t_hi = band['oa_t']
        rh_lo, rh_hi = band['oa_rh']
        if t_lo <= oa_t <= t_hi and rh_lo <= oa_rh <= rh_hi:
            matched = band
            break

    if matched is None:
        best = BANDS[4]
        best_dist = float('inf')
        for band in BANDS:
            t_mid = (band['oa_t'][0] + band['oa_t'][1]) / 2.0
            rh_mid = (band['oa_rh'][0] + band['oa_rh'][1]) / 2.0
            dist = ((oa_t - t_mid) ** 2 + (oa_rh - rh_mid) ** 2) ** 0.5
            if dist < best_dist:
                best_dist = dist
                best = band
        matched = best

    clamp = _load_sa_rh_clamp()
    if clamp is None:
        return matched
    return _apply_sa_rh_clamp(matched, clamp[0], clamp[1])


def write_band_setpoints(csv_object, band, ahu_point_defs, vav_entries, humidity_sp=None):
    """Write the active band setpoints back to the AHU CSV object.
    Only writes to RW positions - read-only positions are left empty.

    Phase 2: when humidity_sp is provided, the clamped band sa_rh is
    written to that BACnet object as a separate Present_Value write.
    This is what mechanically drives the humidifier coil toward the
    operator-defined window (the CSV bundle write above does NOT
    include humidity).  Skipped silently when humidity_sp is None.
    """
    write_dict = {
        'SATSP': band['sa_t'],
        'OAD': band['oa_damper'],
    }
    reheat_t = band.get('reheat_t')
    if reheat_t is not None:
        write_dict['HSP'] = reheat_t

    csv_str = build_write_csv(ahu_point_defs,
                              [(vn, vpd) for vn, _, vpd in vav_entries],
                              'ahu', write_dict)

    ref = csv_object + '.Present_Value'
    try:
        result = dibt.Write(ref, Value=csv_str)
        try:
            _is_err = isinstance(result, dibt.Error)
        except AttributeError:
            _is_err = False  # newer firmware: dibt has no .Error class
        if _is_err:
            log('dibt.Write error for {}: {}'.format(ref, result))
        else:
            log('Band {} setpoints written to {}'.format(band['id'], csv_object))
    except Exception as e:
        log('Exception writing {}: {}'.format(ref, e))

    # Phase 2 humidity setpoint write -- separate Present_Value write to
    # the per-AHU SA-RH point (AVn or operator-named AHUn_RH).  Idempotent
    # by ObjectID; the controller humidity loop reads this as the target.
    write_humidity_setpoint(humidity_sp, band)


def write_humidity_setpoint(humidity_sp, band):
    """Write the band clamped sa_rh value to the AHU humidity SP BACnet
    point.  No-op when humidity_sp is None (collector_config without an
    override and AHU name has no digits to derive AV<n>).
    """
    if not humidity_sp:
        return
    sa_rh = band.get('sa_rh')
    if sa_rh is None:
        return
    ref = humidity_sp + '.Present_Value'
    try:
        result = dibt.Write(ref, Value=float(sa_rh))
        try:
            _is_err = isinstance(result, dibt.Error)
        except AttributeError:
            _is_err = False
        if _is_err:
            log('dibt.Write ERROR for {}: {} (value was: {})'.format(ref, result, sa_rh))
        else:
            log('Humidity SP {} = {}% RH (band {})'.format(humidity_sp, sa_rh, band.get('id', '?')))
    except Exception as e:
        log('Exception writing {}: {} (value was: {})'.format(ref, e, sa_rh))


# Cache of active-band-id per AHU (avoid re-writing when band is unchanged)
_bg_written = {}

def write_band_guide_to_description(csv_object, band=None):
    """Write the CURRENTLY ACTIVE band to CSV_AHUnn.Description so a BACnet
    observer can see which band is active for that AHU. Single-band payload
    (not the full 10-band lookup -- that lives in band_guide.csv).

    Idempotent: skips write if the same band was already pushed for that
    object during the current collector run.
    """
    if band is None:
        return
    try:
        import band_csv_generator
        desc = band_csv_generator.format_band_description(band)
    except Exception as e:
        log('format_band_description failed: {}'.format(e))
        return

    # Short-circuit if the active band for this AHU is unchanged
    if _bg_written.get(csv_object) == desc:
        return

    ref = csv_object + '.Description'

    try:
        result = dibt.Write(ref, Value=desc)
        try:
            _is_err = isinstance(result, dibt.Error)
        except AttributeError:
            _is_err = False  # newer firmware: dibt has no .Error class
        if _is_err:
            log('dibt.Write ERROR for {}: {} (value was: {})'.format(ref, result, desc))
        else:
            _bg_written[csv_object] = desc
            log('Band {} guide written to {} ({}c)'.format(band['id'], ref, len(desc)))
    except Exception as e:
        log('Exception writing {}: {} (value was: {})'.format(ref, e, desc))


# ===== Equipment Discovery =====

def _resolve_humidity_sp(ahu_name, override=None):
    """Resolve the BACnet point name for an AHU SA humidity setpoint.

    Resolution order:
      1. explicit override from collector_config.json
         (e.g. "humidity_sp": "AHU01_RH" -> use that literal name)
      2. parse the first run of digits from the AHU name and return
         "AV<n>" with leading zeros stripped
         (e.g. AHU01 -> AV1, AHU-02-E -> AV2, AHU-12 -> AV12)
      3. return None (skip the write entirely)

    Pure function: safe to call from tests without dibt available.
    """
    if override and isinstance(override, str) and override.strip():
        return override.strip()
    digits = ''
    for ch in ahu_name:
        if ch.isdigit():
            digits += ch
        elif digits:
            break
    if not digits:
        return None
    try:
        return 'AV' + str(int(digits))
    except ValueError:
        return None


def discover_ahu_groups(collector_config, equipment_lookup, equipment_types):
    """
    Build list of AHU groups to poll. Each group:
      { ahu_name, csv_object, ahu_type_id, ahu_point_defs,
        vavs: [(vav_name, vav_type_id, vav_point_defs), ...] }
    """
    groups = []
    ahu_groups = collector_config.get('ahu_groups', {})

    for ahu_name, group_cfg in ahu_groups.items():
        csv_object = group_cfg.get('csv_object', '')
        vav_names = group_cfg.get('vavs', [])

        if not csv_object:
            log(f'Skipping {ahu_name}: no csv_object')
            continue

        # Wire AHU to its type via map_config lookup
        ahu_info = equipment_lookup.get(ahu_name, {})
        ahu_type_id = ahu_info.get('type_id', '1')
        ahu_point_defs = get_point_defs(equipment_types, 'ahu', ahu_type_id)

        if not ahu_point_defs:
            log(f'Warning: No point defs for AHU type {ahu_type_id} ({ahu_name})')

        # Wire each VAV
        vav_entries = []
        for vav_name in vav_names:
            vav_info = equipment_lookup.get(vav_name, {})
            vav_type_id = vav_info.get('type_id', '1')
            vav_point_defs = get_point_defs(equipment_types, 'vav', vav_type_id)
            vav_entries.append((vav_name, vav_type_id, vav_point_defs))

        total_points = len(ahu_point_defs) + sum(len(vd) for _, _, vd in vav_entries)

        # Phase 2: SA humidity setpoint BACnet point.  Operator may override
        # per-AHU in collector_config.json:
        #   "ahu_groups": {
        #     "AHU-01-E": { "csv_object": "CSV1", "humidity_sp": "AHU01_RH" }
        #   }
        # Default resolution returns "AV<n>" parsed from the AHU number, so
        # AHU-01-E -> AV1, AHU-02-S -> AV2.  Returns None when the name has
        # no digits (clamp write is then skipped for that AHU).
        humidity_sp = _resolve_humidity_sp(ahu_name, group_cfg.get('humidity_sp'))

        groups.append({
            'ahu_name': ahu_name,
            'csv_object': csv_object,
            'ahu_type_id': ahu_type_id,
            'ahu_point_defs': ahu_point_defs,
            'vav_entries': vav_entries,
            'total_points': total_points,
            'humidity_sp': humidity_sp,
        })

    return groups


# ===== History Ring Buffer =====

_history = {}  # {"AHU-01-E.OAT": [val1, val2, ...], ...}

def load_existing_history():
    """Load history from existing telemetry.json on startup."""
    global _history
    if os.path.isfile(TELEMETRY_PATH):
        try:
            with open(TELEMETRY_PATH, 'r') as f:
                data = json.load(f)
            hist = data.get('history', {}).get('data', {})
            if hist:
                _history = {k: list(v) for k, v in hist.items()}
                log(f'Loaded history: {len(_history)} point series')
        except:
            pass


def update_history(telemetry):
    """Append current readings to the ring buffer."""
    global _history
    for ahu_name, ahu_data in telemetry.get('equipment', {}).items():
        # AHU points
        for label, value in ahu_data.get('points', {}).items():
            key = f'{ahu_name}.{label}'
            if key not in _history:
                _history[key] = []
            if value is not None:
                _history[key].append(round(value, 2) if isinstance(value, float) else value)
                if len(_history[key]) > HISTORY_MAX:
                    _history[key] = _history[key][-HISTORY_MAX:]

        # VAV points
        for vav_name, vav_data in ahu_data.get('vavs', {}).items():
            for label, value in vav_data.get('points', {}).items():
                key = f'{vav_name}.{label}'
                if key not in _history:
                    _history[key] = []
                if value is not None:
                    _history[key].append(round(value, 2) if isinstance(value, float) else value)
                    if len(_history[key]) > HISTORY_MAX:
                        _history[key] = _history[key][-HISTORY_MAX:]


def get_history_payload():
    """Return compact history for embedding in telemetry.json."""
    return {
        'max_entries': HISTORY_MAX,
        'point_count': len(_history),
        'data': _history
    }


# ===== Collection Cycle =====

def collect_all(ahu_groups, mock_mode=False):
    telemetry = {
        'timestamp': time.time(),
        'timestamp_iso': time.strftime('%Y-%m-%dT%H:%M:%S'),
        'collector_version': VERSION,
        'mock_mode': mock_mode,
        'ahu_count': len(ahu_groups),
        'equipment': {}
    }

    ok_count = 0
    err_count = 0

    for group in ahu_groups:
        ahu_name = group['ahu_name']
        csv_obj = group['csv_object']
        ahu_point_defs = group['ahu_point_defs']
        vav_entries = group['vav_entries']

        entry = {
            'type': 'ahu',
            'type_id': group['ahu_type_id'],
            'csv_object': csv_obj,
            'last_read': time.time(),
            'status': 'ok',
            'raw_csv': '',
            'points': {},
            'total_csv_length': group['total_points'],
            'vavs': {}
        }

        try:
            if mock_mode:
                vav_for_mock = [(vn, vpd) for vn, _, vpd in vav_entries]
                raw_csv = generate_mock_csv_for_group(ahu_name, ahu_point_defs, vav_for_mock)
            else:
                raw_csv = read_bacnet_csv(csv_obj)

            if raw_csv is not None:
                entry['raw_csv'] = raw_csv
                csv_values = raw_csv.split(',')

                # Parse AHU segment
                ahu_points, offset = parse_csv_segment(csv_values, ahu_point_defs, 0)
                entry['points'] = ahu_points

                # Parse each VAV segment
                for vav_name, vav_type_id, vav_point_defs in vav_entries:
                    vav_points, offset = parse_csv_segment(csv_values, vav_point_defs, offset)
                    entry['vavs'][vav_name] = {
                        'type_id': vav_type_id,
                        'points': vav_points
                    }

                entry['status'] = 'ok'
                ok_count += 1

                # --- Band classification from live OA ---
                oa_t_val = entry['points'].get('OAT')
                oa_rh_val = entry['points'].get('OAH')

                # Fallback: if live OAT/OAH are not in the parsed payload (shell data or
                # differently-labelled points), synthesize them via the simulator so that
                # a band can still be classified and pushed to CSV_AHUnn.Description.
                _oa_source = 'live'
                if oa_t_val is None or oa_rh_val is None:
                    _oa_source = 'simulated'
                    random.seed(hash(ahu_name) % 10000 + int(time.time()) // 60)
                    if oa_t_val is None:
                        oa_t_val = round(random.uniform(-5, 38), 1)
                    if oa_rh_val is None:
                        oa_rh_val = round(random.uniform(20, 95), 0)
                    log(f'[{ahu_name}] OAT/OAH missing from payload -- using simulated {oa_t_val}C / {oa_rh_val}% for band classification')

                try:
                    band = classify_band(float(oa_t_val), float(oa_rh_val))
                    entry['active_band'] = {
                        'id': band['id'],
                        'sa_t_sp': band['sa_t'],
                        'sa_rh_sp': band['sa_rh'],
                        'reheat_t': band.get('reheat_t'),
                        'oa_damper_sp': band['oa_damper'],
                        'cc_mode': band['cc'],
                        'hc_mode': band['hc'],
                        'hum_mode': band['hum'],
                        'oa_source': _oa_source,
                    }
                    # Only push setpoints when OA is real (do not override live control with simulated OA)
                    if _oa_source == 'live':
                        write_band_setpoints(csv_obj, band, ahu_point_defs, vav_entries, humidity_sp=group.get('humidity_sp'))
                    # Always push the active band description so operators see it
                    write_band_guide_to_description(csv_obj, band)
                except Exception as _be:
                    log(f'[{ahu_name}] band classification/write failed: {_be}')
            else:
                entry['status'] = 'error'
                entry['error'] = 'No data from BACnet read'
                err_count += 1

        except Exception as e:
            entry['status'] = 'error'
            entry['error'] = str(e)
            err_count += 1

        telemetry['equipment'][ahu_name] = entry

    telemetry['read_ok'] = ok_count
    telemetry['read_errors'] = err_count
    telemetry['equipment_count'] = len(telemetry['equipment'])
    return telemetry


def write_telemetry(telemetry):
    """Write telemetry.json atomically (tmp + rename) so overlapping Flask
    /api/data reads never land on a half-written file.
    """
    try:
        os.makedirs(os.path.dirname(TELEMETRY_PATH), exist_ok=True)
    except Exception:
        pass
    try:
        payload = json.dumps(telemetry)
    except Exception as e:
        log(f'write_telemetry serialize failed: {e}')
        return
    tmp = TELEMETRY_PATH + '.tmp'
    try:
        with open(tmp, 'w') as f:
            f.write(payload)
        os.replace(tmp, TELEMETRY_PATH)
    except Exception as e:
        log(f'write_telemetry write failed: {e}')
        try:
            if os.path.isfile(tmp):
                os.remove(tmp)
        except Exception:
            pass


def main():
    parser = argparse.ArgumentParser(description='Red5 Telemetry Collector v1.1')
    parser.add_argument('--interval', type=int, help='Poll interval in seconds (min 1)')
    parser.add_argument('--mock', action='store_true', help='Force mock mode (overrides config)')
    parser.add_argument('--once', action='store_true', help='Run once then exit')
    parser.add_argument('--config', type=str, help='Path to collector_config.json')
    # PG (Program-object) on the controller cannot pass CLI args -- parse_known_args
    # tolerates being invoked with no argv so the script still starts.
    args, _unknown = parser.parse_known_args()

    if args.config:
        global COLLECTOR_CONFIG_PATH
        COLLECTOR_CONFIG_PATH = args.config

    # Mock-mode resolution: CLI flag wins; otherwise read "mock_mode" from collector_config.json
    mock_mode = args.mock
    _cfg_path = COLLECTOR_CONFIG_PATH
    _cfg = load_json(_cfg_path)
    _cfg_mock = _cfg.get('mock_mode', None)
    if not mock_mode and _cfg_mock is True:
        mock_mode = True

    log(f'Red5 Telemetry Collector v{VERSION} starting...')
    log(f'Config path: {_cfg_path} (mock_mode key in config = {_cfg_mock})')
    log(f'Mock mode: {mock_mode}')
    log(f'Telemetry output: {TELEMETRY_PATH}')

    # Load existing history from previous run
    load_existing_history()

    cycle = 0
    while True:
        try:
            config = load_collector_config()
            interval = max(args.interval or config.get('interval', DEFAULT_INTERVAL), 1)
            equipment_types = load_equipment_types()
            map_config = load_map_config()

            # Wire equipment to types via map_config
            equipment_lookup = build_equipment_lookup(map_config)

            # Discover AHU groups
            ahu_groups = discover_ahu_groups(config, equipment_lookup, equipment_types)

            if cycle == 0:
                log(f'Discovered {len(ahu_groups)} AHU groups')
                for g in ahu_groups:
                    vav_str = ', '.join(vn for vn, _, _ in g['vav_entries'])
                    log(f'  {g["ahu_name"]} -> {g["csv_object"]} (type {g["ahu_type_id"]}, '
                        f'{len(g["ahu_point_defs"])} AHU pts + '
                        f'{len(g["vav_entries"])} VAVs = {g["total_points"]} total)')
                    if vav_str:
                        log(f'    VAVs: {vav_str}')
                log(f'Poll interval: {interval}s')

            # Collect
            telemetry = collect_all(ahu_groups, mock_mode)

            # Update history ring buffer
            update_history(telemetry)
            telemetry['history'] = get_history_payload()

            write_telemetry(telemetry)

            # Drain pending write requests from /api/write-point.  Done
            # AFTER telemetry write so a fresh poll never overwrites a
            # just-applied setpoint (next cycle picks up the new value).
            try:
                _written = process_write_queue(mock_mode=mock_mode)
                if _written:
                    log('[write-queue] processed {} pending writes'.format(_written))
            except Exception as _qe:
                log('[write-queue] processor crashed: {}'.format(_qe))

            if cycle % 12 == 0:
                log(f'Cycle {cycle}: {telemetry["read_ok"]} OK, '
                    f'{telemetry["read_errors"]} errors')
                flush_log()

            cycle += 1

            if args.once:
                log('Single cycle complete. Exiting.')
                flush_log()
                break

        except KeyboardInterrupt:
            log('Interrupted. Exiting.')
            flush_log()
            break
        except Exception as e:
            log(f'Error: {e}')
            traceback.print_exc()
            flush_log()

        time.sleep(interval)


# Honour RED5_DISABLE_BG_THREADS=1 so test harnesses can import this
# module without firing up the live poll loop.  The controller never
# sets this env var so production behaviour is unchanged.
if os.environ.get('RED5_DISABLE_BG_THREADS') != '1':
    main()
