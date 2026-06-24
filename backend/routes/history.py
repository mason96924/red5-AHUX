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
