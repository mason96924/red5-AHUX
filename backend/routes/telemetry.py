"""routes/telemetry.py -- telemetry endpoints.

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
@router.get("/api/telemetry-status")
async def telemetry_status(tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    """V1.9-compatible health probe used by the dashboard header chip.

    The chip shows LIVE / SIM / STALE / OFF based on these flags:
      * `live=True` -> the demo simulator is producing data (always true here).
      * `mock_mode` -> reflects the operator's data-source toggle so the
        chip flips between LIVE (mock_mode=false) and SIM (mock_mode=true).
      * `stale=False`, `age_seconds=0` -> demo data is generated on each call.
      * `equipment_count` -> AHU count the dashboard expects to render.
    """
    # Resolve the effective config (tenant-saved -> bundled w/ anon override).
    if tenant:
        cfg = await read_collector_config(tenant) or _load_json("collector_config.json")
    else:
        cfg = _anon_effective_config()
    is_mock = bool(cfg.get("mock_mode", True))
    if not is_mock:
        ahu_count = len((cfg.get("ahu_groups") or {}))
        if ahu_count == 0:
            ahu_count = len(_DEMO_AHUS)
    else:
        ahu_count = len(_DEMO_AHUS)
    now = datetime.now(timezone.utc)
    return {
        "success": True,
        "live": True,
        "polling": True,
        "mock_mode": is_mock,
        "stale": False,
        "stale_s": 0,
        "age_seconds": 0,
        "equipment_count": ahu_count,
        "read_ok": ahu_count,
        "read_errors": 0,
        "timestamp_iso": now.isoformat(),
        "collector_version": "v2.0-demo",
        "mode": "demo",
    }


@router.get("/api/services")
async def services() -> dict:
    return {
        "services": [
            {"name": "telemetry_service",       "ok": True,  "loaded_at": _DEMO_START_TS},
            {"name": "band_service",            "ok": True,  "loaded_at": _DEMO_START_TS},
            {"name": "weather_service",         "ok": True,  "loaded_at": _DEMO_START_TS},
            {"name": "band_overrides_service",  "ok": True,  "loaded_at": _DEMO_START_TS},
            {"name": "bacnet_diag_service",     "ok": False, "loaded_at": None,
             "error": "BACnet stack unavailable in demo mode"},
        ]
    }
