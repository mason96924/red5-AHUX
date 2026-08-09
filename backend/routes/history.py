"""routes/history.py -- history endpoints.

Phase L.29 (2026-06-24): auto-extracted from server.py using AST.
Handler bodies are byte-identical to the originals; only changes are
`@app.` -> `@router.` and the `_pull_from_server()` shim below that
imports every helper and module-level constant from `server` into this
router's namespace so handler bodies can use them unchanged.
"""
from __future__ import annotations

from typing import Any, Optional, Dict
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import JSONResponse, PlainTextResponse
from datetime import datetime, timezone
import os, json, math, time, random, csv, base64
import urllib.parse, urllib.request

from tenants import (
    current_tenant_optional,
    read_equipment_types, write_equipment_types,
    read_sa_rh_clamp, write_sa_rh_clamp,
    read_weather_location, write_weather_location,
    save_tenant_asset, read_tenant_asset, list_tenant_assets,
    delete_tenant_asset, delete_tenant_directory, create_tenant_directory,
    move_tenant_asset,
    read_collector_config, write_collector_config,
    read_map_config, write_map_config,
    WeatherLocationUpdate,
)
from audit_log import record_audit
from g36_service import auto_tick_from_ahu_dict

router = APIRouter()

# Phase L.33 (2026-06-24): direct imports replacing the original
# `_pull_from_server()` shim.  Each name now lives in its canonical
# module; `server` still exports the few helpers (mark/set weather
# source, nasa-power adapter, weatherapi key reader, etc.) that
# genuinely live there.
from models.fs import (
    ALLOWED_FS_ROOTS,
    DATA_ROOT,
    DIRECTORY_SCAFFOLD,
    SCRIPTS_ROOT,
    _404_no_cache,
    _fs_available,
    _fs_root,
    _safe_join,
    _zero_pad_variants,
)
from models.loaders import (
    DEMO_DATA_DIR,
    ROOT,
    _CACHE,
    _load_csv,
    _load_json,
)
from models.weather import (
    ACTIVE_LOCATION,
    SAVED_LOCATIONS,
)
from models.state import (
    _ANON_OVERRIDE,
    _DEMO_START_TS,
    _LAST_WEATHER_SOURCE,
    _LAST_WEATHER_TS,
    _WEATHER_NOW_CACHE,
    _WEATHER_NOW_TTL_S,
)
from simulator import (
    _AHU_COLORS,
    _AHU_HAS_MAH,
    _AHU_PHASE,
    _DEMO_AHUS,
    _MANUAL_OVERRIDES,
    _VAV_DRIFT_STATE,
    _ahus_from_config,
    _build_snapshot,
    _demo_oa_state,
    _enthalpy,
    _humidity_ratio,
    _markov_drift,
    _resolve_band,
    _scalar_drift,
    _simulate_ahu,
)
from models.mixing import derive_mixed_air, rh_from_w as _rh_from_w
from server import (
    _anon_effective_config,
    _bundled_mock_mode_default,
    _mark_weather_source,
    _v2_weatherapi_key,
)
@router.get("/api/write-history")
async def write_history() -> dict:
    return {"history": [], "mode": "demo"}


@router.get("/api/collector-log")
async def collector_log() -> dict:
    base = int(time.time())
    oa = _demo_oa_state(time.time())
    band_name = _resolve_band(oa["t"], oa["rh"])["Band_Name"]
    return {
        "log": [
            {"ts": base - 60, "level": "INFO", "msg": "Demo simulator started."},
            {"ts": base - 30, "level": "INFO", "msg": "Loaded weather year (Seattle 2020)."},
            {"ts": base - 10, "level": "INFO", "msg": "Active band: " + band_name},
        ]
    }


@router.get("/api/trend-history")
async def trend_history(point: str = Query("OA"), window_min: int = Query(60)) -> dict:
    now = time.time()
    samples = []
    for i in range(window_min, 0, -1):
        ts = now - i * 60
        oa = _demo_oa_state(ts)
        samples.append({"ts": int(ts), "t": oa["t"], "rh": oa["rh"]})
    return {"point": point, "samples": samples}


@router.get("/api/ahu-history/{ahu_id}")
async def ahu_history(ahu_id: str,
                      window_min: int = Query(1440, ge=15, le=43200),
                      step_s: int    = Query(60, ge=15, le=900)) -> dict:
    """Synthesise per-AHU time-series for the drill-down detail page.

    Returns supply-air temp / RH / airflow samples on the requested cadence
    (default 1-minute step over 24 h = 1440 samples).  Because the demo
    backend has no historical persistence layer yet, we deterministically
    replay the same drift / band logic that `_simulate_ahu` uses live --
    seeded from `(ahu_id, ts)` so two calls with the same window return
    identical curves.  When telemetry persistence ships (Phase 4) this
    endpoint can swap to a real Mongo query without touching the frontend.

    Returns:
        {
          ahu_id: str,
          window_min, step_s: int,
          samples: [{ts, sa_t, sa_rh, sa_w, ra_t, ra_rh, oa_t, oa_rh, airflow_pct}],
        }
    """
    now = time.time()
    samples_n = max(1, window_min * 60 // step_s)
    seed_base = hash(ahu_id) % 1000
    samples: list[dict] = []
    for i in range(samples_n, 0, -1):
        ts = now - i * step_s
        oa = _demo_oa_state(ts)
        # Deterministic drift seeded by (ahu, ts) so the same window
        # always replays identical waveforms even across server restarts.
        seed = seed_base + (int(ts) % 86400) / 86400.0
        wave_slow = math.sin(ts / 7200.0 + seed * 0.6)            # 2-hour beat
        wave_fast = math.sin(ts / 1800.0 + seed * 1.3)            # 30-min beat
        wave_micro = math.sin(ts / 360.0 + seed * 2.7) * 0.4      # 6-min ripple
        sa_t = 13.5 + 1.8 * wave_slow + 0.6 * wave_fast + wave_micro
        sa_rh = 58.0 + 6.0 * wave_slow + 2.5 * wave_fast
        ra_t  = 23.0 + 0.9 * wave_slow + 0.4 * wave_fast
        ra_rh = 48.0 + 4.0 * (-wave_slow) + 1.6 * wave_fast
        # Airflow: tracks daytime occupancy curve + microvariation
        hour = (datetime.fromtimestamp(ts).hour + datetime.fromtimestamp(ts).minute / 60.0)
        occ_curve = max(0.25, min(1.0,
            0.30 + 0.65 * math.exp(-((hour - 13.0) ** 2) / 18.0)))   # bell-shape peak ~1pm
        airflow = occ_curve * (1.0 + 0.08 * wave_fast + 0.04 * wave_micro)
        samples.append({
            "ts": int(ts),
            "sa_t":  round(sa_t,  2),
            "sa_rh": round(sa_rh, 1),
            "sa_w":  round(_humidity_ratio(sa_t, sa_rh), 5),
            "ra_t":  round(ra_t,  2),
            "ra_rh": round(ra_rh, 1),
            "oa_t":  round(float(oa["t"]),  2),
            "oa_rh": round(float(oa["rh"]), 1),
            "airflow_pct": round(airflow * 100.0, 1),
        })
    return {
        "ahu_id":     ahu_id,
        "window_min": window_min,
        "step_s":     step_s,
        "now":        int(now),
        "samples":    samples,
    }


# ---------------------------------------------------------------------------
# SA timeseries for the 3D modal's measured-SA overlay.
#
# Companion to /api/ahu-history but parametrised by an explicit time
# WINDOW (from_ts .. to_ts, unix-epoch seconds) so the 3D Psychrometric
# Modal can request exactly the OA date range the user has loaded from
# Open-Meteo.  Returns the same per-sample shape as ahu-history so the
# frontend can use one schema for both endpoints.
#
# Today the body re-uses the same deterministic synthesis as
# ahu-history; when telemetry persistence ships, swap the body for a
# Mongo query against the historian collection (same response shape, no
# frontend change needed).
#
# Why a separate endpoint instead of extending ahu-history?
#   1. Clear contract for the diagnostic UI (SA path overlay) vs the
#      live drill-down chart.
#   2. ahu-history's "window_min" param is anchored at *now*; the 3D
#      modal needs an arbitrary historical window keyed by absolute ts.
#   3. Lets us cap the step at a coarser cadence (60..900 s) for the
#      3D layer without affecting the existing 1-min drill-down.
# ---------------------------------------------------------------------------
def _oa_damper_sp(oa_t: float) -> float:
    """OA damper setpoint vs outside dry-bulb, in percent.

    Temperature-only approximation of band_guide.csv OA_Damper_SP for demo
    history synthesis (real sites read OAD from the controller):

      T < 15          → 15 %  (B1/B2 min OA)
      15 ≤ T < 18     → 30 %  (B3 mild-dry)
      18 ≤ T < 26     → 100 % (B4/B5 economizer / pass-through)
      26 ≤ T < 28     → 50 %  (B6 warm mix)
      T ≥ 28          → 15 %  (B7+ hot / min OA)

    Twin of ``_sa_ts_damper_sp`` in archive/Red5-AHU-V1.9/telemetry_service.py.
    """
    if 18.0 <= oa_t < 26.0:
        return 100.0
    if 15.0 <= oa_t < 18.0:
        return 30.0
    if 26.0 <= oa_t < 28.0:
        return 50.0
    return 15.0


@router.get("/api/ahu/{ahu_id}/sa-timeseries")
async def ahu_sa_timeseries(
    ahu_id: str,
    from_ts: int = Query(..., description="Window start, unix epoch seconds"),
    to_ts:   int = Query(..., description="Window end (exclusive), unix epoch seconds"),
    step_s:  int = Query(900, ge=60, le=21600,
                         description="Sample cadence in seconds (default 15-min). "
                                     "Callers plotting a long window should "
                                     "coarsen this: the 3D engine's default "
                                     "window is a full year, which at the 900s "
                                     "default is 35k samples / 7MB."),
) -> dict:
    """SA / OA telemetry for an AHU over an explicit time window.

    Returns ``{ahu_id, from_ts, to_ts, step_s, samples: [...]}`` where each
    sample carries the same fields as ``/api/ahu-history`` plus a derived
    ``oa_w`` so the 3D engine doesn't have to recompute the humidity
    ratio client-side.

    Each sample also carries the mixed-air channels ``mat`` / ``oad``
    (``mah`` where that sensor is wired) and, when MA can be located,
    ``ma_t`` / ``ma_rh`` / ``ma_w`` / ``ma_basis``.  MA is derived
    server-side by ``models.mixing`` so the 3D free-vs-paid split cannot
    drift from the 2D chart's MA dot, and ``ma_basis`` travels with the
    point so a damper-only estimate can be labelled as modelled rather
    than read as measurement.  The ``ma_*`` keys are absent, not null,
    when neither MAT nor damper feedback exists.

    400 if ``from_ts >= to_ts`` or the window exceeds 366 days.
    """
    if from_ts >= to_ts:
        raise HTTPException(status_code=400, detail="from_ts must be < to_ts")
    if (to_ts - from_ts) > 366 * 86400:
        raise HTTPException(status_code=400, detail="window > 366 days")

    seed_base = hash(ahu_id) % 1000
    samples: list[dict] = []
    ts = from_ts
    while ts < to_ts:
        oa = _demo_oa_state(ts)
        seed = seed_base + (int(ts) % 86400) / 86400.0
        wave_slow  = math.sin(ts / 7200.0 + seed * 0.6)
        wave_fast  = math.sin(ts / 1800.0 + seed * 1.3)
        wave_micro = math.sin(ts / 360.0  + seed * 2.7) * 0.4
        sa_t  = 13.5 + 1.8 * wave_slow + 0.6 * wave_fast + wave_micro
        sa_rh = 58.0 + 6.0 * wave_slow + 2.5 * wave_fast
        ra_t  = 23.0 + 0.9 * wave_slow + 0.4 * wave_fast
        ra_rh = 48.0 + 4.0 * (-wave_slow) + 1.6 * wave_fast
        oa_t, oa_rh = float(oa["t"]), float(oa["rh"])
        oa_w, ra_w = _humidity_ratio(oa_t, oa_rh), _humidity_ratio(ra_t, ra_rh)

        # ---- Mixed air over the window -------------------------------------
        # Derived by models.mixing, the same function the live snapshot uses,
        # so a historical MA path and the chart's MA dot can never disagree
        # about where MA is or which sensor put it there.
        #
        # The damper comes from _oa_damper_sp rather than _resolve_band, even
        # though the band table carries an OA_Damper_SP column: the table
        # matches on temperature AND humidity, the demo OA generator only ever
        # produces 16..28 C at 37..73 % RH, and the one band that overlaps that
        # box is PASS-THROUGH -- which is also the no-match fallback.  Every
        # hour of the demo year therefore resolves to 100 % OA, which would
        # pin MA on top of OA and flatten the mixing leg to nothing for the
        # entire series.  A schedule keyed on dry-bulb alone reproduces the
        # same column's intent and actually varies.
        #
        # Beats are keyed on `ts`, not the wall clock the live simulator uses,
        # so re-requesting a window reproduces it; and they are slower than the
        # live 60 s / 190 s beats, which a 15-minute cadence would alias into
        # noise rather than a schedule.
        phase = _AHU_PHASE(ahu_id)
        oad = max(0.0, min(100.0, _oa_damper_sp(oa_t)
                                  + 2.0 * math.sin(ts / 3600.0 + phase)))
        _f = oad / 100.0
        mat = (_f * oa_t + (1.0 - _f) * ra_t
               + 0.35 * math.sin(ts / 1900.0 + phase))
        mah = (_rh_from_w(mat, _f * oa_w + (1.0 - _f) * ra_w)
               if _AHU_HAS_MAH(ahu_id) else None)
        ma_pt, _ma_diag = derive_mixed_air(
            {"t": oa_t, "rh": oa_rh, "w": oa_w},
            {"t": ra_t, "rh": ra_rh, "w": ra_w},
            mat=mat, mah=mah, oad=oad,
        )

        sample = {
            "ts":    int(ts),
            "sa_t":  round(sa_t,  2),
            "sa_rh": round(sa_rh, 1),
            "sa_w":  round(_humidity_ratio(sa_t,  sa_rh), 5),
            "ra_t":  round(ra_t,  2),
            "ra_rh": round(ra_rh, 1),
            "oa_t":  round(oa_t,  2),
            "oa_rh": round(oa_rh, 1),
            "oa_w":  round(oa_w, 5),
            "mat":   round(mat, 2),
            "oad":   round(oad, 1),
        }
        if mah is not None:
            sample["mah"] = round(mah, 1)
        # Omitted entirely when MA cannot be located, so a consumer that finds
        # no ma_* keys degrades the same way the 2D chart does rather than
        # having to recognise a placeholder.
        if ma_pt:
            sample.update({
                "ma_t":     ma_pt["t"],
                "ma_rh":    ma_pt["rh"],
                "ma_w":     ma_pt["w"],
                "ma_basis": ma_pt["basis"],
            })
        samples.append(sample)
        ts += step_s
    return {
        "ahu_id":  ahu_id,
        "from_ts": int(from_ts),
        "to_ts":   int(to_ts),
        "step_s":  step_s,
        "samples": samples,
    }


# ---------------------------------------------------------------------------
# 24h rolling average of exchange / absorption for the pill trend arrows
# (Phase L.39 — 2026-06-27).
#
# Frontend (sidebar.js MetricBar `delta` prop) renders a tiny ▲ green / ▼
# rose marker at the bottom of each pill once it knows whether the current
# value is above or below the 24h mean.  This batch endpoint returns the
# mean for every AHU in one round-trip so the dashboard doesn't fire N
# parallel /api/ahu/<id>/rolling-avg requests.
#
# Implementation: an exponentially-weighted moving average (EWMA) is
# updated server-side on every /api/data call (see routes/health.py
# `_update_rolling_avgs`).  Alpha = 5 min / 24 h ⇒ half-life ≈ 24 h,
# so the EWMA closely tracks a true 24h moving average while only
# requiring two floats per AHU.  Bootstrap: first poll seeds the
# EWMA at current value, so the trend arrow starts at "steady" and
# diverges as real history accumulates.
# ---------------------------------------------------------------------------
from models.state import _ROLLING_AVGS  # noqa: E402


def _r3(v):
    """Round, but keep None as null — the mixing/coil averages are absent
    until an AHU actually reports MA, and the dashboard treats a
    non-finite baseline as 'no trend arrow yet' rather than as zero."""
    return None if v is None else round(v, 3)


@router.get("/api/ahu/{ahu_id}/rolling-avg")
async def ahu_rolling_avg_single(ahu_id: str) -> dict:
    ra = _ROLLING_AVGS.get(ahu_id) or {}
    return {
        "ahu_id":     ahu_id,
        "exchange":   round(ra.get("exchange",   0.0), 3),
        "absorption": round(ra.get("absorption", 0.0), 3),
        "mixing":     _r3(ra.get("mixing")),
        "coil":       _r3(ra.get("coil")),
        "n_samples":  ra.get("n", 0),
        "method":     "ewma",
    }


@router.get("/api/ahu-rolling-avgs")
async def ahu_rolling_avgs_batch() -> dict:
    """Batch 24h rolling-average lookup for every AHU the backend has
    sampled so far.  Returns a map keyed by ahu_id; an AHU absent from
    the map simply hasn't been polled yet via /api/data.

    Phase L.42 — also returns the 1h EWMA + short sample-buffer per
    metric so the dashboard can render the 1h-vs-24h sparkline next
    to the SYNCED/APPLY chip."""
    out = {}
    for aid, d in (_ROLLING_AVGS or {}).items():
        out[aid] = {
            "exchange":      round(d.get("exchange",      0.0), 3),
            "absorption":    round(d.get("absorption",    0.0), 3),
            "exchange_1h":   round(d.get("exchange_1h",   d.get("exchange",   0.0)), 3),
            "absorption_1h": round(d.get("absorption_1h", d.get("absorption", 0.0)), 3),
            "mixing":        _r3(d.get("mixing")),
            "coil":          _r3(d.get("coil")),
            "mixing_1h":     _r3(d.get("mixing_1h", d.get("mixing"))),
            "coil_1h":       _r3(d.get("coil_1h",   d.get("coil"))),
            "ex_hist":       [round(v, 3) for v in (d.get("ex_hist") or [])],
            "ab_hist":       [round(v, 3) for v in (d.get("ab_hist") or [])],
            "n_samples":     d.get("n", 0),
        }
    return {"averages": out, "n_ahus": len(out), "method": "ewma"}


# ---------------------------------------------------------------------------
# SA Drift score — per-AHU controller-error pill for the dashboard sidebar.
#
# Drift = RMS(|sa_t_measured - sa_t_modeled|) across the window, where
# sa_t_modeled is the 10-band controller logic (computeSA_band JS, ported
# below) applied to the AHU's own OA sensor reading at the same ts.  That
# matches the apples-to-apples ribbon used in the 3D modal, so the pill
# number is the SAME diagnostic surfaced two ways: scalar on the sidebar
# and visual in the 3D scene.
#
# Returns a current-window RMS plus a baseline-window RMS (previous
# window of the same length) so the frontend can render a trend arrow:
#   trend = "up"   if rms > base by > 5%        (worsening — red ▲)
#         = "down" if rms < base by > 5%        (improving — green ▼)
#         = "flat" otherwise
# ---------------------------------------------------------------------------
def _modeled_sa_t(oa_t: float, oa_rh: float) -> float:
    """Python port of the JS 10-band computeSA_band -- returns the
    controller's target SA temperature in degC for a given OA (T, RH).
    Kept compact (no W computation needed for the drift scalar)."""
    t, rh = oa_t, oa_rh
    if t < 5 and rh < 30:
        return min(22.0, max(20.0, 20.0 + (5.0 - t) * 0.15))
    if 5 <= t < 15 and 30 <= rh <= 60:
        return min(21.0, max(18.0, 18.0 + (15.0 - t) * 0.3))
    if 15 <= t < 20 and rh < 30:
        return min(21.0, max(18.5, t + 1.0))
    if 18 <= t < 22 and 30 <= rh <= 50:
        return t
    if 22 <= t <= 25 and 40 <= rh <= 60:
        return t
    if 25 < t <= 27 and 50 <= rh <= 70:
        return min(26.0, max(23.5, t - 1.0))
    if 27 < t <= 32 and 60 < rh <= 80:
        return 12.0
    if 32 < t <= 38 and rh > 70:
        return 13.0
    if t > 35 and rh < 30:
        return 15.0
    if t > 30 and rh > 85:
        return 11.0
    # Fallback enthalpy-banded
    h = 1.006 * t + 0.0 * rh  # approx — band falls back on dry-bulb only here
    if h < 22:
        return 19.0
    if h < 27:
        return t
    if h < 31:
        return max(23.5, t - 1.0)
    return 13.0


def _drift_rms_for_window(ahu_id: str, from_ts: int, to_ts: int, step_s: int = 300) -> tuple[float, int]:
    """Compute RMS(|sa_measured - sa_modeled|) over [from_ts, to_ts)
    using the SAME deterministic synthesis as ahu_sa_timeseries so the
    sidebar pill and the 3D modal ribbon agree exactly.
    Returns (rms_degC, n_samples)."""
    seed_base = hash(ahu_id) % 1000
    sq_sum = 0.0
    n = 0
    ts = from_ts
    while ts < to_ts:
        oa = _demo_oa_state(ts)
        seed = seed_base + (int(ts) % 86400) / 86400.0
        wave_slow  = math.sin(ts / 7200.0 + seed * 0.6)
        wave_fast  = math.sin(ts / 1800.0 + seed * 1.3)
        wave_micro = math.sin(ts /  360.0 + seed * 2.7) * 0.4
        sa_measured = 13.5 + 1.8 * wave_slow + 0.6 * wave_fast + wave_micro
        sa_target   = _modeled_sa_t(float(oa["t"]), float(oa["rh"]))
        d = sa_measured - sa_target
        sq_sum += d * d
        n += 1
        ts += step_s
    if n == 0:
        return 0.0, 0
    return math.sqrt(sq_sum / n), n


@router.get("/api/ahu-drift-scores")
async def ahu_drift_scores(
    window_min: int = Query(60, ge=15, le=1440,
                            description="Rolling window length in minutes (default 60 = last hour)"),
) -> dict:
    """Batch SA-drift RMS for every AHU in `_ROLLING_AVGS`.

    Schema: ``{scores: {ahu_id: {rms_c, base_rms_c, trend, n_samples}}, window_min}``
    """
    import time as _time
    now = int(_time.time())
    cur_from  = now - window_min * 60
    base_from = cur_from - window_min * 60
    step_s = max(60, window_min * 60 // 50)   # ~50 samples per window for RMS

    out: dict[str, dict] = {}
    # Prefer AHUs already seen by rolling-avg sampling; if that store is
    # still empty (fresh restart / first poll), fall back to configured
    # AHU groups so the sidebar SA-drift pill is never blank.
    aids = list((_ROLLING_AVGS or {}).keys())
    if not aids:
        try:
            cfg = _load_json("collector_config.json") or {}
            aids = list((cfg.get("ahu_groups") or {}).keys())
        except Exception:
            aids = []
    for aid in aids:
        cur_rms,  cur_n  = _drift_rms_for_window(aid, cur_from,  now,      step_s)
        base_rms, _      = _drift_rms_for_window(aid, base_from, cur_from, step_s)
        if base_rms > 0:
            ratio = cur_rms / base_rms
            trend = "up" if ratio > 1.05 else ("down" if ratio < 0.95 else "flat")
        else:
            trend = "flat"
        out[aid] = {
            "rms_c":      round(cur_rms,  3),
            "base_rms_c": round(base_rms, 3),
            "trend":      trend,
            "n_samples":  cur_n,
        }
    return {"scores": out, "n_ahus": len(out), "window_min": window_min, "method": "rms"}
