"""
g36_service.py -- Red5 V1.9 plug-in
====================================
ASHRAE Guideline 36 single-zone VAV controller as a Flask plug-in for
the on-prem controller.  Mirrors the V2.0 FastAPI module of the same
name (in /app/backend/) but uses file-based state instead of MongoDB
and runs under the V1.9 plug-in loader (`/root/data/pgpy/`).

What this ships:
  * 8-mode operating state machine (occupied / warm_up / cool_down /
    setback / setup / freeze_protection / unoccupied / pre_cooling)
  * Cooling / heating / pressure request voting (ASHRAE 36 §5.16)
  * Trim-&-Respond reset for SAT and duct-static-pressure (§5.1.15)
  * Per-AHU 24-hour day-in-life history seed on first persisted tick so
    the dashboard timeline ribbon shows a meaningful pattern instantly.

Endpoints exposed:
  GET  /api/g36/modes
  GET  /api/g36/state/<ahu_id>
  GET  /api/g36/setpoints/<ahu_id>
  POST /api/g36/setpoints/<ahu_id>
  POST /api/g36/tick/<ahu_id>
  GET  /api/g36/history/<ahu_id>?minutes=N

Decoration of /api/data:
  We monkey-patch telemetry_service.api_data so each AHU entry gets a
  `g36` block populated from one auto-tick.  T&R is throttled to the
  ASHRAE-36 Td cadence (default 120s) so the SAT/DSP reset values walk
  on the canonical 2-minute spacing even though /api/data is polled
  every 5-8 seconds.

State persistence:
  /root/data/configs/g36_state.json   -- single JSON file, atomic write.
  Schema: { <ahu_id>: { mode, mode_reason, cooling_requests, ...,
                        setpoints: {...}, history: [{ts, mode}, ...] } }

No admin gating: V1.9 is on-prem; the dashboard is on a trusted LAN.
"""
from __future__ import annotations

import json
import math
import os
import threading
import time
from datetime import datetime, timedelta, timezone

from flask import jsonify, request


_service_dependencies = ['DATA_ROOT']

# Module globals (populated by register()).
DATA_ROOT = None        # type: str | None
_STATE_PATH = None      # type: str | None
_LOCK = threading.RLock()

# ASHRAE Td default.
TR_THROTTLE_SECONDS = 120

# 8 modes.
ALL_MODES = (
    'occupied', 'warm_up', 'cool_down', 'setback', 'setup',
    'freeze_protection', 'unoccupied', 'pre_cooling',
)

# ---------------------------------------------------------------------------
# Setpoint defaults (mirrors V2.0 G36Setpoints model)
# ---------------------------------------------------------------------------
SETPOINT_DEFAULTS = {
    'occ_heating_sp_c':   21.0,
    'occ_cooling_sp_c':   24.0,
    'unocc_heating_sp_c': 16.0,
    'unocc_cooling_sp_c': 27.0,
    'sat_min_c':          12.0,
    'sat_max_c':          18.0,
    'sat_current_c':      13.0,
    'dsp_min_pa':         125.0,
    'dsp_max_pa':         500.0,
    'dsp_current_pa':     250.0,
    'occupancy_now':      True,
    'pre_cool_minutes_remaining': 0,
    'warmup_threshold_c':   2.0,
    'cooldown_threshold_c': 2.0,
    'freeze_oat_c':         4.0,
}


# ---------------------------------------------------------------------------
# State file helpers
# ---------------------------------------------------------------------------
def _now_utc():
    return datetime.now(timezone.utc)


def _iso(dt):
    """Datetime -> ISO string.  Accepts strings and passes through."""
    if isinstance(dt, str):
        return dt
    if not isinstance(dt, datetime):
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat()


def _parse_ts(ts):
    """ISO string (or datetime) -> aware UTC datetime, or None."""
    if isinstance(ts, datetime):
        return ts if ts.tzinfo else ts.replace(tzinfo=timezone.utc)
    if isinstance(ts, str):
        try:
            d = datetime.fromisoformat(ts.replace('Z', '+00:00'))
            if d.tzinfo is None:
                d = d.replace(tzinfo=timezone.utc)
            return d
        except ValueError:
            return None
    return None


def _load_all():
    """Read the whole state file.  Returns {} on first run / read error."""
    if not _STATE_PATH or not os.path.exists(_STATE_PATH):
        return {}
    try:
        with open(_STATE_PATH, 'r') as f:
            return json.load(f) or {}
    except (OSError, ValueError):
        return {}


def _save_all(data):
    """Atomic write so concurrent /api/data polls never read a half file."""
    if not _STATE_PATH:
        return
    tmp = _STATE_PATH + '.tmp'
    try:
        with open(tmp, 'w') as f:
            json.dump(data, f)
        os.replace(tmp, _STATE_PATH)
    except OSError:
        try:
            os.unlink(tmp)
        except OSError:
            pass


def _get(ahu_id):
    """Per-AHU state row, seeded with defaults if absent.  Does NOT save."""
    data = _load_all()
    row = data.get(ahu_id)
    if row:
        # Backfill any missing setpoint defaults (forward-compat).
        sp = dict(SETPOINT_DEFAULTS)
        sp.update(row.get('setpoints') or {})
        row['setpoints'] = sp
        return row
    return {
        'ahu_id': ahu_id,
        'mode': 'unoccupied',
        'mode_reason': 'Initial seed; no telemetry tick received yet.',
        'cooling_requests':  0,
        'heating_requests':  0,
        'pressure_requests': 0,
        'sat_reset_c':  SETPOINT_DEFAULTS['sat_current_c'],
        'dsp_reset_pa': SETPOINT_DEFAULTS['dsp_current_pa'],
        'last_tick_at': None,
        'setpoints':    dict(SETPOINT_DEFAULTS),
        'history':      [],
    }


# ---------------------------------------------------------------------------
# Pure-math primitives (mirrors V2.0)
# ---------------------------------------------------------------------------
def trim_and_respond(sp_current, requests_count, *, sp_min, sp_max,
                     sp_trim, sp_response_step, sp_response_max,
                     importance=2, direction='decrease_on_request'):
    """One Trim-&-Respond step (ASHRAE 36 §5.1.15)."""
    if requests_count < importance:
        new = sp_current + sp_trim if direction == 'decrease_on_request' \
            else sp_current - sp_trim
    else:
        step = min(abs(requests_count) * sp_response_step, sp_response_max)
        new = sp_current - step if direction == 'decrease_on_request' \
            else sp_current + step
    return max(sp_min, min(sp_max, new))


def _vote_cooling(zones):
    total = 0
    for z in zones:
        c = z.get('cooling_loop_pct', 0.0)
        if c >= 95.0:
            total += 3
        elif c >= 70.0:
            total += 2
        elif c >= 20.0:
            total += 1
    return total


def _vote_heating(zones):
    total = 0
    for z in zones:
        h = z.get('heating_loop_pct', 0.0)
        if h >= 95.0:
            total += 3
        elif h >= 70.0:
            total += 2
        elif h >= 20.0:
            total += 1
    return total


def _vote_pressure(zones):
    total = 0
    for z in zones:
        if z.get('damper_pct', 0.0) < 95.0:
            continue
        af_sp = z.get('airflow_setpoint_cfm', 0.0)
        if af_sp <= 0:
            continue
        gap = (af_sp - z.get('airflow_actual_cfm', 0.0)) / af_sp
        if gap >= 0.10:
            total += 1
    return total


def _compute_mode(oat_c, zones, sp):
    """8-mode state machine.  Returns (mode, reason)."""
    if zones:
        avg_zat = sum(z.get('zat_c', 22.0) for z in zones) / len(zones)
    else:
        avg_zat = (sp['occ_heating_sp_c'] + sp['occ_cooling_sp_c']) / 2.0

    if oat_c <= sp['freeze_oat_c']:
        return 'freeze_protection', \
            'OAT %.1fC <= freeze threshold %.1fC' % (oat_c, sp['freeze_oat_c'])

    if sp.get('pre_cool_minutes_remaining', 0) > 0 and not sp.get('occupancy_now', True):
        return 'pre_cooling', \
            'Pre-cooling lead-time, %d min remaining' % sp['pre_cool_minutes_remaining']

    if sp.get('occupancy_now', True):
        if avg_zat < sp['occ_heating_sp_c'] - sp['warmup_threshold_c']:
            return 'warm_up', \
                'Avg ZAT %.1fC is >%.1fC below heating SP %.1fC at start of occ window' % \
                (avg_zat, sp['warmup_threshold_c'], sp['occ_heating_sp_c'])
        if avg_zat > sp['occ_cooling_sp_c'] + sp['cooldown_threshold_c']:
            return 'cool_down', \
                'Avg ZAT %.1fC is >%.1fC above cooling SP %.1fC at start of occ window' % \
                (avg_zat, sp['cooldown_threshold_c'], sp['occ_cooling_sp_c'])
        return 'occupied', \
            'Avg ZAT %.1fC inside occupied band [%.1f, %.1f]C' % \
            (avg_zat, sp['occ_heating_sp_c'], sp['occ_cooling_sp_c'])

    if avg_zat < sp['unocc_heating_sp_c']:
        return 'setback', \
            'Avg ZAT %.1fC below unoccupied heating SP %.1fC' % \
            (avg_zat, sp['unocc_heating_sp_c'])
    if avg_zat > sp['unocc_cooling_sp_c']:
        return 'setup', \
            'Avg ZAT %.1fC above unoccupied cooling SP %.1fC' % \
            (avg_zat, sp['unocc_cooling_sp_c'])
    return 'unoccupied', \
        'Avg ZAT %.1fC inside unoccupied band [%.1f, %.1f]C' % \
        (avg_zat, sp['unocc_heating_sp_c'], sp['unocc_cooling_sp_c'])


def _seed_24h_pattern(mode_now, now_dt):
    """Realistic day-in-the-life seed when an AHU has no history yet."""
    pattern = [
        (24.0, 'unoccupied'),
        (18.0, 'warm_up'),
        (17.5, 'occupied'),
        (12.0, 'cool_down'),
        (10.5, 'occupied'),
        (6.0,  'setup'),
        (4.5,  'unoccupied'),
        (0.0,  mode_now),
    ]
    return [
        {'ts': _iso(now_dt - timedelta(hours=h)), 'mode': m}
        for h, m in pattern
    ]


# ---------------------------------------------------------------------------
# Main tick (the only function that writes state)
# ---------------------------------------------------------------------------
def _do_tick(ahu_id, oat_c, sat_c, sa_static_pa, zones,
             throttle_seconds=TR_THROTTLE_SECONDS):
    """Run one G36 evaluation and persist.  Returns the new state row.

    Safe to call concurrently from /api/data and from POST /api/g36/tick;
    serialized by _LOCK so the JSON file write is atomic.
    """
    with _LOCK:
        all_state = _load_all()
        row = all_state.get(ahu_id) or _get(ahu_id)
        sp = dict(SETPOINT_DEFAULTS)
        sp.update(row.get('setpoints') or {})

        mode, reason = _compute_mode(oat_c, zones, sp)
        cooling = _vote_cooling(zones)
        heating = _vote_heating(zones)
        pressure = _vote_pressure(zones)

        sat_prev = float(row.get('sat_reset_c', sp['sat_current_c']))
        dsp_prev = float(row.get('dsp_reset_pa', sp['dsp_current_pa']))

        # T&R throttling.
        last = _parse_ts(row.get('last_tick_at'))
        now_dt = _now_utc()
        elapsed = (now_dt - last).total_seconds() if last else None
        do_tr = (elapsed is None) or (elapsed >= throttle_seconds)

        sat_new = sat_prev
        dsp_new = dsp_prev
        if do_tr:
            if mode in ('occupied', 'cool_down', 'pre_cooling', 'setup'):
                sat_new = trim_and_respond(
                    sat_prev, cooling,
                    sp_min=sp['sat_min_c'], sp_max=sp['sat_max_c'],
                    sp_trim=0.1, sp_response_step=0.1, sp_response_max=0.6,
                    importance=2, direction='decrease_on_request',
                )
            if mode not in ('unoccupied', 'freeze_protection'):
                dsp_new = trim_and_respond(
                    dsp_prev, pressure,
                    sp_min=sp['dsp_min_pa'], sp_max=sp['dsp_max_pa'],
                    sp_trim=10.0, sp_response_step=15.0, sp_response_max=60.0,
                    importance=2, direction='increase_on_request',
                )

        # History: seed on first ever tick, else append on mode change.
        history = list(row.get('history') or [])
        if not history:
            history = _seed_24h_pattern(mode, now_dt)
        else:
            last_mode = history[-1].get('mode') if history else None
            if mode != last_mode:
                history.append({'ts': _iso(now_dt), 'mode': mode})
                if len(history) > 50:
                    history = history[-50:]

        new_row = {
            'ahu_id':            ahu_id,
            'mode':              mode,
            'mode_reason':       reason,
            'cooling_requests':  cooling,
            'heating_requests':  heating,
            'pressure_requests': pressure,
            'sat_reset_c':       round(sat_new, 2),
            'dsp_reset_pa':      round(dsp_new, 1),
            'last_tick_at':      _iso(now_dt),
            'setpoints':         sp,
            'history':           history,
        }
        all_state[ahu_id] = new_row
        _save_all(all_state)
        return new_row


# ---------------------------------------------------------------------------
# /api/data decoration helper (called by the monkey-patched telemetry view)
# ---------------------------------------------------------------------------
def _derive_zones_from_ahu_entry(ahu_entry):
    """Build the synthetic zone list the G36 tick needs from one AHU
    entry as produced by V1.9 /api/data (id, points, all_points, vavs)."""
    zones = []
    sp = SETPOINT_DEFAULTS
    for v in (ahu_entry.get('vavs') or []):
        zat = float(v.get('t', 22.0))
        vp = v.get('all_points') or {}
        zsp = float(vp.get('ZSP', 23.0))
        # Derive PI-loop output from zone-temp deviation.
        cooling_pct = max(0.0, min(100.0, (zat - zsp) * 35.0))
        heating_pct = max(0.0, min(100.0, (zsp - zat) * 35.0))
        dpr = float(vp.get('DPR', 50.0))
        zones.append({
            'zone_id':              str(v.get('id', '?')),
            'zat_c':                zat,
            'cooling_loop_pct':     cooling_pct,
            'heating_loop_pct':     heating_pct,
            'damper_pct':           dpr,
            'airflow_setpoint_cfm': 1000.0,
            'airflow_actual_cfm':   max(0.0, min(1200.0, dpr * 12.0)),
        })
    return zones, sp


def _ahu_oat_sat_sastatic(ahu_entry):
    """Pull OAT/SAT/SA-static-pressure from the V1.9 AHU entry shape.

    Prefer numeric `points` array (always populated) over `all_points`
    (BACnet raw, often partial)."""
    oat = None
    sat = None
    for p in (ahu_entry.get('points') or []):
        if p.get('label') == 'OA':
            oat = p.get('t')
        elif p.get('label') == 'SA':
            sat = p.get('t')
    if oat is None or sat is None:
        ap = ahu_entry.get('all_points') or {}
        if oat is None:
            oat = ap.get('OAT', 20.0)
        if sat is None:
            sat = ap.get('SAT', 14.0)
    ap = ahu_entry.get('all_points') or {}
    sastatic = ap.get('SADSP', 250.0)
    try:
        return float(oat), float(sat), float(sastatic)
    except (TypeError, ValueError):
        return 20.0, 14.0, 250.0


def decorate_ahu(ahu_entry):
    """Mutates ahu_entry to add a `g36` block.  Best-effort; on any
    exception, leaves the entry untouched so /api/data never breaks."""
    try:
        ahu_id = ahu_entry.get('id') or ''
        if not ahu_id:
            return ahu_entry
        oat, sat, sa_dsp = _ahu_oat_sat_sastatic(ahu_entry)
        zones, _sp = _derive_zones_from_ahu_entry(ahu_entry)
        row = _do_tick(ahu_id, oat, sat, sa_dsp, zones)
        ahu_entry['g36'] = {
            'mode':              row.get('mode'),
            'mode_reason':       row.get('mode_reason'),
            'cooling_requests':  row.get('cooling_requests', 0),
            'heating_requests':  row.get('heating_requests', 0),
            'pressure_requests': row.get('pressure_requests', 0),
            'sat_reset_c':       row.get('sat_reset_c'),
            'dsp_reset_pa':      row.get('dsp_reset_pa'),
            'last_tick_at':      row.get('last_tick_at'),
        }
    except Exception:
        # Never let G36 break /api/data; controllers are alive only
        # while /api/data keeps responding.
        pass
    return ahu_entry


# ---------------------------------------------------------------------------
# Flask routes
# ---------------------------------------------------------------------------
def _route_modes():
    return jsonify({'modes': list(ALL_MODES)})


def _route_state(ahu_id):
    row = _get(ahu_id)
    return jsonify(row)


def _route_setpoints_get(ahu_id):
    return jsonify(_get(ahu_id).get('setpoints') or dict(SETPOINT_DEFAULTS))


def _route_setpoints_post(ahu_id):
    body = request.get_json(silent=True) or {}
    with _LOCK:
        data = _load_all()
        row = data.get(ahu_id) or _get(ahu_id)
        sp = dict(SETPOINT_DEFAULTS)
        sp.update(row.get('setpoints') or {})
        # Validate + merge -- ignore unknown keys to avoid trusting the
        # client to define new schema entries.
        for k, v in body.items():
            if k in SETPOINT_DEFAULTS:
                sp[k] = v
        row['setpoints'] = sp
        data[ahu_id] = row
        _save_all(data)
    return jsonify({'ok': True, 'ahu_id': ahu_id, 'setpoints': sp})


def _route_tick(ahu_id):
    body = request.get_json(silent=True) or {}
    oat = float(body.get('oat_c', 20.0))
    sat = float(body.get('sat_c', 14.0))
    sa_dsp = float(body.get('sa_static_pa', 250.0))
    zones = body.get('zones') or []
    row = _do_tick(ahu_id, oat, sat, sa_dsp, zones, throttle_seconds=0)
    return jsonify(row)


def _route_history(ahu_id):
    try:
        minutes = int(request.args.get('minutes', '60'))
    except ValueError:
        minutes = 60
    minutes = max(5, min(1440, minutes))
    row = _load_all().get(ahu_id) or _get(ahu_id)
    raw = list(row.get('history') or [])
    now = _now_utc()
    cutoff = now - timedelta(minutes=minutes)

    parsed = []
    for h in raw:
        ts = _parse_ts(h.get('ts'))
        if not ts:
            continue
        parsed.append({'ts': ts, 'mode': h.get('mode')})
    parsed.sort(key=lambda r: r['ts'])

    inside = [r for r in parsed if r['ts'] >= cutoff]
    leading = [r for r in parsed if r['ts'] < cutoff]
    if leading:
        leading = [leading[-1]]
    merged = leading + inside

    return jsonify({
        'ahu_id':       ahu_id,
        'now':          _iso(now),
        'window_min':   minutes,
        'current_mode': row.get('mode'),
        'transitions': [{'ts': _iso(r['ts']), 'mode': r['mode']} for r in merged],
    })


# ---------------------------------------------------------------------------
# Telemetry monkey-patch -- decorate every /api/data response
# ---------------------------------------------------------------------------
def _wrap_telemetry_for_g36(app):
    """Wrap telemetry_service.api_data so each AHU entry in /api/data
    gets a `g36` block.  Idempotent: only wraps once per process."""
    try:
        import telemetry_service as ts
    except ImportError:
        return  # telemetry plug-in not loaded; nothing to wrap.

    if getattr(ts, '_g36_wrapped', False):
        return

    original = ts.api_data

    def wrapped():
        rv = original()
        # rv is a Response or tuple; extract JSON body without re-serializing twice.
        try:
            # Flask Response has get_json()
            data = rv.get_json(silent=True) if hasattr(rv, 'get_json') else None
            if not isinstance(data, list):
                return rv
            for ahu in data:
                if isinstance(ahu, dict):
                    decorate_ahu(ahu)
            return jsonify(data)
        except Exception:
            return rv

    # Reroute the Flask view function.  Flask resolves /api/data through
    # the endpoint name 'api_data' (set in telemetry_service.register).
    view_funcs = app.view_functions
    if 'api_data' in view_funcs:
        view_funcs['api_data'] = wrapped
        ts._g36_wrapped = True


# ---------------------------------------------------------------------------
# Registration
# ---------------------------------------------------------------------------
def register(app, ctx):
    """Attach G36 routes + wrap telemetry's /api/data."""
    global DATA_ROOT, _STATE_PATH
    DATA_ROOT = ctx['DATA_ROOT']
    # Persist into /root/data/configs/ alongside the other long-lived
    # configuration files (collector_config.json, equipment_types.json,
    # band_guide.csv).  Migration: if a pre-existing g36_state.json sits
    # at the legacy root path, move it into configs/ on first boot so we
    # don't lose seeded history.
    configs_dir = os.path.join(DATA_ROOT, 'configs')
    try:
        os.makedirs(configs_dir, exist_ok=True)
    except OSError:
        pass
    legacy_path = os.path.join(DATA_ROOT, 'g36_state.json')
    _STATE_PATH = os.path.join(configs_dir, 'g36_state.json')
    if os.path.exists(legacy_path) and not os.path.exists(_STATE_PATH):
        try:
            os.replace(legacy_path, _STATE_PATH)
        except OSError:
            pass

    app.add_url_rule('/api/g36/modes',                 'g36_modes',
                     _route_modes,           methods=['GET'])
    app.add_url_rule('/api/g36/state/<ahu_id>',        'g36_state',
                     _route_state,           methods=['GET'])
    app.add_url_rule('/api/g36/setpoints/<ahu_id>',    'g36_setpoints_get',
                     _route_setpoints_get,   methods=['GET'])
    app.add_url_rule('/api/g36/setpoints/<ahu_id>',    'g36_setpoints_post',
                     _route_setpoints_post,  methods=['POST'])
    app.add_url_rule('/api/g36/tick/<ahu_id>',         'g36_tick',
                     _route_tick,            methods=['POST'])
    app.add_url_rule('/api/g36/history/<ahu_id>',      'g36_history',
                     _route_history,         methods=['GET'])

    # Wrap /api/data after all plug-ins have registered.  Use a one-shot
    # before_request that swaps the view function and removes itself on
    # first hit; this guarantees telemetry_service has already added its
    # route by the time we patch it.
    def _one_shot_wrap():
        _wrap_telemetry_for_g36(app)
        # remove this hook so we don't re-check on every request
        try:
            app.before_request_funcs.get(None, []).remove(_one_shot_wrap)
        except (ValueError, AttributeError):
            pass
        return None

    app.before_request(_one_shot_wrap)
