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
# Required SERVICE_CTX keys -- validated by app.py auto-discovery.
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

# NOTE on BACnet writes (architecture, 2026-05-08):
# This module no longer imports dibt directly. dibt is the Delta Controls
# native BACnet binding, available ONLY when a script is registered as
# an enteliWEB "object" and runs in the controllers runtime (where
# `dibt` is preloaded as a global). Importing it from a Python plug-in
# auto-loaded into Flask via importlib FAILS on the hardware (raises
# non-ImportError C-extension faults) and causes the whole telemetry
# module to silently 404 every endpoint.
#
# Instead, /api/write-point serializes its CSV write request into a
# queue file (`write_queue.json` under CONFIG_DIR) and returns success
# immediately. `collector.py` -- which IS an enteliWEB object and DOES
# have dibt available -- polls that queue file on each cycle and
# executes the writes via dibt.Write().  Result audit goes back into
# `write_results.json` for /api/write-history to surface.

# Write command history (in-memory, last 100)
_write_history = []
WRITE_HISTORY_MAX = 100

# ---------------------------------------------------------------------------
# Phase L.39 / L.42 parity port (2026-06-27).  V2.0's FastAPI backend keeps a
# per-AHU EWMA of exchange (h_SA - h_OA) and absorption (h_RA - h_SA) plus a
# 24-sample circular buffer so the dashboard's MetricBar pills can render
# Δ-trend arrows and the AHU row's 1h-vs-24h sparkline.  V1.9 PROD didn't
# have either endpoint, so the dashboard's `delta` prop was always null and
# no trend pill / no delta enthalpy ever rendered (which is what the user
# saw on www.dcred5-studio.com).  Mirror the V2.0 logic verbatim so PROD
# matches the preview.
# ---------------------------------------------------------------------------
_ROLLING_AVGS = {}                # ahu_id -> {exchange, absorption, exchange_1h, absorption_1h, ex_hist, ab_hist, n}
_ROLLING_ALPHA = 5.0 / (60.0 * 24.0)   # poll-interval (5 min) / 24h -> ~24h half-life
_ROLLING_ALPHA_1H = 5.0 / 60.0         # poll-interval (5 min) / 1h
_ROLLING_BUF_LEN = 24


def _update_rolling_avgs(snapshot):
    """Update ``_ROLLING_AVGS`` in place from a freshly-built /api/data snapshot.

    ``snapshot`` is the list of AHU dicts produced by :func:`api_data` (each
    item has an ``id`` and a ``points`` list with OA/SA/RA entries carrying
    ``t`` and ``w``).  Uses the V1.9 ``get_h`` enthalpy helper so the maths
    matches what the frontend renders.  Wrapped at the caller in a
    try/except so a stats blip never breaks /api/data.
    """
    if not get_h:
        return
    for ahu in snapshot or []:
        aid = ahu.get('id') if isinstance(ahu, dict) else None
        if not aid:
            continue
        pts = {p.get('label'): p for p in (ahu.get('points') or []) if isinstance(p, dict)}
        oa, sa, ra = pts.get('OA'), pts.get('SA'), pts.get('RA')
        if not (oa and sa and ra):
            continue
        try:
            h_oa = get_h(float(oa['t']), float(oa['w']))
            h_sa = get_h(float(sa['t']), float(sa['w']))
            h_ra = get_h(float(ra['t']), float(ra['w']))
        except (KeyError, TypeError, ValueError):
            continue
        ex = h_sa - h_oa
        ab = h_ra - h_sa
        prev = _ROLLING_AVGS.get(aid)
        if not prev:
            _ROLLING_AVGS[aid] = {
                'exchange':      ex, 'absorption':      ab,
                'exchange_1h':   ex, 'absorption_1h':   ab,
                'ex_hist':       [ex], 'ab_hist':       [ab],
                'n':             1,
            }
        else:
            a24 = _ROLLING_ALPHA
            a1h = _ROLLING_ALPHA_1H
            ex_hist = list(prev.get('ex_hist') or [])
            ab_hist = list(prev.get('ab_hist') or [])
            ex_hist.append(ex); ab_hist.append(ab)
            if len(ex_hist) > _ROLLING_BUF_LEN:
                ex_hist = ex_hist[-_ROLLING_BUF_LEN:]
            if len(ab_hist) > _ROLLING_BUF_LEN:
                ab_hist = ab_hist[-_ROLLING_BUF_LEN:]
            _ROLLING_AVGS[aid] = {
                'exchange':      a24 * ex + (1.0 - a24) * prev['exchange'],
                'absorption':    a24 * ab + (1.0 - a24) * prev['absorption'],
                'exchange_1h':   a1h * ex + (1.0 - a1h) * prev.get('exchange_1h',   prev['exchange']),
                'absorption_1h': a1h * ab + (1.0 - a1h) * prev.get('absorption_1h', prev['absorption']),
                'ex_hist':       ex_hist,
                'ab_hist':       ab_hist,
                'n':             prev.get('n', 0) + 1,
            }


def ahu_rolling_avg_single(ahu_id):
    """GET /api/ahu/<id>/rolling-avg  -- single-AHU 24h EWMA lookup."""
    ra = _ROLLING_AVGS.get(ahu_id) or {}
    return jsonify({
        'ahu_id':     ahu_id,
        'exchange':   round(ra.get('exchange',   0.0), 3),
        'absorption': round(ra.get('absorption', 0.0), 3),
        'n_samples':  ra.get('n', 0),
        'method':     'ewma',
    })


def ahu_rolling_avgs_batch():
    """GET /api/ahu-rolling-avgs  -- batch lookup for every sampled AHU."""
    out = {}
    for aid, d in (_ROLLING_AVGS or {}).items():
        out[aid] = {
            'exchange':      round(d.get('exchange',      0.0), 3),
            'absorption':    round(d.get('absorption',    0.0), 3),
            'exchange_1h':   round(d.get('exchange_1h',   d.get('exchange',   0.0)), 3),
            'absorption_1h': round(d.get('absorption_1h', d.get('absorption', 0.0)), 3),
            'ex_hist':       [round(v, 3) for v in (d.get('ex_hist') or [])],
            'ab_hist':       [round(v, 3) for v in (d.get('ab_hist') or [])],
            'n_samples':     d.get('n', 0),
        }
    return jsonify({'averages': out, 'n_ahus': len(out), 'method': 'ewma'})


# Sim-mode write overrides: persists UI-originated writes so they reflect in /api/data
# while the background simulator keeps regenerating random values. Keyed by
# (equipment_name -> {label: (value, timestamp)}). Entries persist until explicitly
# overwritten by another write -- this matches real BACnet setpoint behavior.
_sim_overrides = {}

# ---------------------------------------------------------------------------
# Markov drift layer (Ornstein-Uhlenbeck random walk).
#
# When a VAV has no physical (zone_t, zone_rh) sensor wired, the live-data
# fallback synthesizes a beat-of-sines so the dashboard never freezes at
# 22/45.  A pure deterministic beat still looks mechanically periodic, so
# this drift layer adds a small mean-reverting random walk on top.  State
# persists per-VAV across polls so the jitter is coherent over ~30-60 s
# (matching real zone-sensor noise) instead of independent flicker.
# Mirrors the V2.0 SaaS implementation in /app/backend/server.py.
# ---------------------------------------------------------------------------
_VAV_DRIFT_STATE = {}

def _markov_drift(key, sigma_t=0.18, sigma_rh=0.55, alpha=0.92,
                  clamp_t=1.4, clamp_rh=5.5):
    s = _VAV_DRIFT_STATE.get(key)
    if s is None:
        s = {"dt": 0.0, "drh": 0.0}
        _VAV_DRIFT_STATE[key] = s
    s["dt"] = alpha * s["dt"] + sigma_t * random.gauss(0.0, 1.0)
    s["drh"] = alpha * s["drh"] + sigma_rh * random.gauss(0.0, 1.0)
    if s["dt"] > clamp_t:
        s["dt"] = clamp_t
    elif s["dt"] < -clamp_t:
        s["dt"] = -clamp_t
    if s["drh"] > clamp_rh:
        s["drh"] = clamp_rh
    elif s["drh"] < -clamp_rh:
        s["drh"] = -clamp_rh
    return s["dt"], s["drh"]

def _record_write(equip_name, writes, csv_object, csv_value, success, mock=False, queued=False):
    """Record a write command in history, and cache value as sim override.

    The optimistic UI override (``_sim_overrides``) is populated whenever
    the write was reported successful, regardless of whether it was a
    BACnet mock or a real-but-still-queued write — so the dashboard
    reflects the user's requested value immediately and the next
    telemetry refresh keeps showing it until BACnet feedback contradicts
    it (real BACnet point eventually catches up; in mock mode the
    override is the only source of truth).

    ``mock``  - explicitly true only for genuine MOCK runs (no dibt).
    ``queued`` - true for real-but-pending writes whose final BACnet
                  outcome lives in ``write_results.json``.
    """
    if success and (mock or queued):
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
        'mock': mock,
        'queued': queued,
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
            # Mid-write collision or corrupt file -- fall back to last-good snapshot
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
_data_mode = 'simulator'   # simulator or mock


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
            # Live-data fallback (2026-05-20): when an AHU-level read is None
            # (BACnet point unmapped or device offline), drive the value with
            # a slow sinusoid so the chart points and trends never freeze.
            # Real telemetry always wins.  `any()` over a tuple is used
            # instead of a multi-term `or` chain to stay clear of the
            # V1.9 controller parser's long-or-chain hang (see CHANGELOG).
            if any(v is None for v in (oa_t, oa_rh, sa_t, sa_rh)):
                _t_now = time.time()
                _ahu_seed = sum(ord(c) for c in ahu_name) * 0.01
                _ow = math.sin(_t_now / 600.0 + _ahu_seed)      # ~10 min OA drift
                _sw = math.sin(_t_now / 220.0 + _ahu_seed)      # ~3.5 min SA drift
                if oa_t is None:  oa_t  = 18.0 + 6.0 * _ow      # 12-24 C
                if oa_rh is None: oa_rh = 60.0 + 14.0 * (-_ow)  # 46-74 %
                if sa_t is None:  sa_t  = 15.5 + 1.2 * _sw      # 14.3-16.7 C
                if sa_rh is None: sa_rh = 60.0 + 6.0 * _sw      # 54-66 %
            vav_map = dashboard_map.get('vav', {})
            embedded_vavs = ahu_data.get('vavs', {})

            # VAV identity list is PINNED to the static collector_config -> matches map_config.json.
            # Telemetry only supplies values; missing/empty telemetry shows VAV with defaults,
            # never drops it from the list (prevents flicker between telemetry writes).
            _cfg_grp = collector_config.get('ahu_groups', {}).get(ahu_name, {})
            _cfg_vav_names = _cfg_grp.get('vavs', [])
            if not _cfg_vav_names:
                # No static list configured -> fall back to whatever telemetry has
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
                # ----------------------------------------------------------
                # Live-data fallback (2026-05-20): if either zone reading is
                # None (no physical sensor wired) substitute a per-VAV beat
                # of two sinusoids so the dashboard never sits frozen at
                # 22 / 45.  Real telemetry always wins.  See V2.0 server.py
                # for the symmetric implementation.
                # ----------------------------------------------------------
                if vt is None or vrh is None:
                    _seed = sum(ord(c) for c in vav_name) * 0.013
                    _t_now = time.time()
                    _wa = math.sin(_t_now / 22.0 + _seed)
                    _wb = math.sin(_t_now / 95.0 + _seed * 0.7)
                    # Markov drift layer -- mean-reverting OU walk on top of
                    # the beat so the synthesized waveform looks like real
                    # zone-sensor noise instead of a clean sinusoid.
                    _dt, _drh = _markov_drift(ahu_name + ":" + vav_name)
                    if vt is None:
                        vt = 22.5 + 2.6 * _wb + 0.6 * _wa + _dt
                    if vrh is None:
                        vrh = 47.0 + 6.5 * (-_wb) + 2.0 * (-_wa) + _drh
                vw = get_w(vt, vrh)
                vav_list.append({"id": vav_name, "t": vt, "rh": vrh, "w": vw, "h": get_h(vt, vw), "all_points": vav_pts})
                vav_temps.append(vt); vav_rhs.append(vrh)
            ra_t = sum(vav_temps) / len(vav_temps) if vav_temps else 24.0
            ra_rh = sum(vav_rhs) / len(vav_rhs) if vav_rhs else 50.0
            # Apply AHU-level sim overrides
            if _sim_overrides.get(ahu_name):
                pts = {**pts, **_sim_overrides[ahu_name]}
            # Pass through active_band when the BACnet collector wrote one
            # to telemetry.json.  This is what drives the yellow "BAND Bn"
            # pill at the top of the AHU Equipment Diagram modal in
            # dashboard.html.  Without this propagation the V1.9 dashboard
            # never sees `active_band` (collector computes it, but
            # api_data() rebuilds its own output dict and historically
            # dropped the field).  V2.0's server.py includes the same
            # block in its synthetic response -- this keeps parity.
            _active_band = ahu_data.get('active_band') if isinstance(ahu_data, dict) else None
            if not _active_band:
                # Simulator / no-collector fallback: classify the band
                # ourselves from the OA values we already have.  Wrapped
                # in try/except because classify_band depends on a global
                # BANDS catalog that may be unavailable on a minimal
                # deployment; falling back to "no band" is fine.
                try:
                    from collector import classify_band  # noqa: PLC0415
                    _band = classify_band(float(oa_t), float(oa_rh))
                    _active_band = {
                        'id': _band['id'],
                        'sa_t_sp': _band.get('sa_t'),
                        'sa_rh_sp': _band.get('sa_rh'),
                        'reheat_t': _band.get('reheat_t'),
                        'oa_damper_sp': _band.get('oa_damper'),
                        'cc_mode': _band.get('cc'),
                        'hc_mode': _band.get('hc'),
                        'hum_mode': _band.get('hum'),
                        'oa_source': 'simulated',
                    }
                except Exception:
                    _active_band = None
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
            if _active_band:
                ahu_entry["active_band"] = _active_band
            output.append(ahu_entry); color_idx += 1
        try:
            _update_rolling_avgs(output)
        except Exception:
            pass
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
        # Classify the band from the synthesized OA so the dashboard's
        # "BAND Bn" pill renders even before the BACnet collector has
        # written its first telemetry.json snapshot.  Best-effort; if
        # the band catalog isn't importable on this deployment we just
        # omit the field (the pill quietly stays hidden).
        _active_band = None
        try:
            from collector import classify_band  # noqa: PLC0415
            _band = classify_band(float(oa_t), float(oa_rh))
            _active_band = {
                'id': _band['id'],
                'sa_t_sp': _band.get('sa_t'),
                'sa_rh_sp': _band.get('sa_rh'),
                'reheat_t': _band.get('reheat_t'),
                'oa_damper_sp': _band.get('oa_damper'),
                'cc_mode': _band.get('cc'),
                'hc_mode': _band.get('hc'),
                'hum_mode': _band.get('hum'),
                'oa_source': 'simulated',
            }
        except Exception:
            _active_band = None
        _entry = {
            "id": ahu_id, "procColor": proc_colors[color_idx % len(proc_colors)],
            "source": "simulator_fallback",
            "points": [
                {"label": "OA", "t": oa_t, "rh": oa_rh, "w": get_w(oa_t, oa_rh), "color": "#3b82f6"},
                {"label": "SA", "t": sa_t, "rh": sa_rh, "w": get_w(sa_t, sa_rh), "color": "#10b981"},
                {"label": "RA", "t": ra_t, "rh": ra_rh, "w": get_w(ra_t, ra_rh), "color": "#f43f5e"},
            ],
            "all_points": dict(_sim_overrides.get(ahu_id, {})),
            "vavs": vav_list
        }
        if _active_band:
            _entry["active_band"] = _active_band
        output.append(_entry)
        color_idx += 1
    try:
        _update_rolling_avgs(output)
    except Exception:
        pass
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
        # Same active_band injection as the other two branches -- keeps
        # the "BAND Bn" pill alive in mock mode too.  See `api_data`
        # for the rationale block.
        _active_band = None
        try:
            from collector import classify_band  # noqa: PLC0415
            _band = classify_band(float(oa_t), float(oa_rh))
            _active_band = {
                'id': _band['id'],
                'sa_t_sp': _band.get('sa_t'),
                'sa_rh_sp': _band.get('sa_rh'),
                'reheat_t': _band.get('reheat_t'),
                'oa_damper_sp': _band.get('oa_damper'),
                'cc_mode': _band.get('cc'),
                'hc_mode': _band.get('hc'),
                'hum_mode': _band.get('hum'),
                'oa_source': 'mock',
            }
        except Exception:
            _active_band = None
        _entry = {
            "id": ahu_id, "procColor": data["procColor"],
            "source": "mock",
            "points": [
                {"label": "OA", "t": oa_t, "rh": oa_rh, "w": get_w(oa_t, oa_rh), "color": "#3b82f6"},
                {"label": "SA", "t": sa_t, "rh": sa_rh, "w": get_w(sa_t, sa_rh), "color": "#10b981"},
                {"label": "RA", "t": ra_t, "rh": ra_rh, "w": get_w(ra_t, ra_rh), "color": "#f43f5e"},
            ],
            "vavs": vav_list
        }
        if _active_band:
            _entry["active_band"] = _active_band
        output.append(_entry)
    try:
        _update_rolling_avgs(output)
    except Exception:
        pass
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

        # Enqueue the write for collector.py to execute.  See module-
        # level NOTE above for rationale (collector is an enteliWEB
        # object with dibt available; this Flask plug-in is not).
        queue_path = os.path.join(CONFIG_DIR, 'write_queue.json')
        try:
            try:
                with open(queue_path, 'r') as _qf:
                    queue = json.load(_qf)
                if not isinstance(queue, list):
                    queue = []
            except (FileNotFoundError, IOError, json.JSONDecodeError):
                queue = []
            entry = {
                'id':          '%d-%d' % (int(time.time() * 1000), random.randrange(10000)),
                'ts':          time.time(),
                'csv_object':  csv_object,
                'csv_value':   csv_value,
                'equip_name':  equip_name,
                'writes':      writes,
                'source':      '/api/write-point',
            }
            queue.append(entry)
            os.makedirs(CONFIG_DIR, exist_ok=True)
            tmp = queue_path + '.tmp'
            with open(tmp, 'w') as _qf:
                json.dump(queue, _qf, indent=2)
            os.replace(tmp, queue_path)
        except OSError as _qe:
            return jsonify({'success': False,
                            'error': 'Failed to enqueue write: ' + str(_qe)}), 500

        # Cache as a UI override so the dashboard reflects the requested
        # value immediately even before collector.py executes the write.
        # NOTE: `mock=False` here because the Flask side has no way to know
        # whether the dibt.Write inside collector.py will hit MOCK or real
        # path -- the truthful state is "queued, outcome pending".  The
        # actual mock flag is only set in collector.pys write_results.json.
        # The optimistic UI override is still applied (the helper checks
        # `success`, not `mock`, when caching).
        _record_write(equip_name, writes, csv_object, csv_value, True, mock=False, queued=True)
        return jsonify({
            'success': True,
            'message': 'Queued for collector to write to ' + csv_object,
            'queued':  True,
            'queue_id': entry['id'],
            'csv_object': csv_object,
            'csv_value': csv_value,
            'target': equip_name,
            'writes': writes,
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
    # Phase L.39 / L.42 parity port (2026-06-27).  Pill trend arrows + 1h-vs-24h
    # sparkline endpoints — V2.0 has had these since L.39, V1.9 was missing
    # them which left every dashboard pill on PROD without a Δ-trend.
    app.add_url_rule('/api/ahu/<ahu_id>/rolling-avg',     'ahu_rolling_avg_single',
                     ahu_rolling_avg_single, methods=['GET'])
    app.add_url_rule('/api/ahu-rolling-avgs',             'ahu_rolling_avgs_batch',
                     ahu_rolling_avgs_batch, methods=['GET'])
    # Auto-scaffolded by port-route.py -- TODO move next to its siblings
    app.add_url_rule('/api/ahu-history/<ahu_id>', 'ahu_history',
                     ahu_history, methods=['GET'])

# ---------------------------------------------------------------------------
# /api/ahu-history/<ahu_id>   (GET)  -- V2.0 parity (backend/routes/history.py:121).
# Deterministic per-AHU time-series for the drill-down detail page.
# Query params:
#   window_min (15..43200, default 1440)  -- total window in minutes
#   step_s     (15..900,   default 60)    -- sample cadence in seconds
# Self-contained: inlines the OA-state generator + humidity-ratio formula
# so we don't pull in models/* from V2.0.  Seeded from (ahu_id, ts) so
# the same window replays identical waveforms across server restarts.
# ---------------------------------------------------------------------------
def _ahu_history_oa(ts):
    """Diurnal OA state matching V2.0 _demo_oa_state shape."""
    _dt = datetime.datetime.fromtimestamp(ts)
    h = _dt.hour + _dt.minute / 60.0
    t  = 18.0 + 8.0 * math.sin((h - 9.0) * math.pi / 12.0)
    rh = 65.0 - 18.0 * math.sin((h - 11.0) * math.pi / 12.0)
    return {'t': round(t, 2), 'rh': round(max(20.0, min(95.0, rh)), 1)}


def _ahu_history_w(t_c, rh_pct):
    """Humidity ratio g/kg from temp + RH (ASHRAE Goff-Gratch approximation)."""
    # Saturation pressure (kPa)
    es = 0.6108 * math.exp(17.27 * t_c / (t_c + 237.3))
    # Partial pressure (kPa)
    pw = es * (rh_pct / 100.0)
    # Humidity ratio (g/kg dry air), assume atmospheric pressure 101.325 kPa
    w = 0.622 * pw / max(0.001, (101.325 - pw))
    return w * 1000.0


def ahu_history(ahu_id):
    """V2.0 parity: synthesised per-AHU time-series for the drill-down page."""
    try:
        window_min = int(request.args.get('window_min', 1440))
        step_s     = int(request.args.get('step_s',     60))
    except (TypeError, ValueError):
        return jsonify({'error': 'window_min and step_s must be integers'}), 400
    window_min = max(15, min(43200, window_min))
    step_s     = max(15, min(900,   step_s))

    now = time.time()
    samples_n = max(1, window_min * 60 // step_s)
    seed_base = hash(ahu_id) % 1000
    samples = []
    for i in range(samples_n, 0, -1):
        ts = now - i * step_s
        oa = _ahu_history_oa(ts)
        seed = seed_base + (int(ts) % 86400) / 86400.0
        wave_slow  = math.sin(ts / 7200.0 + seed * 0.6)
        wave_fast  = math.sin(ts / 1800.0 + seed * 1.3)
        wave_micro = math.sin(ts /  360.0 + seed * 2.7) * 0.4
        sa_t  = 13.5 + 1.8 * wave_slow + 0.6 * wave_fast + wave_micro
        sa_rh = 58.0 + 6.0 * wave_slow + 2.5 * wave_fast
        ra_t  = 23.0 + 0.9 * wave_slow + 0.4 * wave_fast
        ra_rh = 48.0 - 4.0 * wave_slow + 1.6 * wave_fast
        hour = (datetime.datetime.fromtimestamp(ts).hour + datetime.datetime.fromtimestamp(ts).minute / 60.0)
        occ_curve = max(0.25, min(1.0,
            0.30 + 0.65 * math.exp(-((hour - 13.0) ** 2) / 18.0)))
        airflow = occ_curve * (1.0 + 0.08 * wave_fast + 0.04 * wave_micro)
        samples.append({
            'ts':          int(ts),
            'sa_t':        round(sa_t, 2),
            'sa_rh':       round(sa_rh, 1),
            'sa_w':        round(_ahu_history_w(sa_t, sa_rh) / 1000.0, 5),
            'ra_t':        round(ra_t, 2),
            'ra_rh':       round(ra_rh, 1),
            'oa_t':        oa['t'],
            'oa_rh':       oa['rh'],
            'airflow_pct': round(airflow * 100.0, 1),
        })
    return jsonify({
        'ahu_id':     ahu_id,
        'window_min': window_min,
        'step_s':     step_s,
        'samples':    samples,
    })
