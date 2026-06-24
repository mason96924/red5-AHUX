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

import server as _server  # noqa: E402  -- lazy module reference

def _pull_from_server():
    g = globals()
    for name in ('ACTIVE_LOCATION', 'ALLOWED_FS_ROOTS', 'DATA_ROOT', 'DEMO_DATA_DIR', 'DIRECTORY_SCAFFOLD', 'ROOT', 'SAVED_LOCATIONS', 'SCRIPTS_ROOT', '_404_no_cache', '_AHU_COLORS', '_ANON_OVERRIDE', '_CACHE', '_DEMO_AHUS', '_DEMO_START_TS', '_LAST_WEATHER_SOURCE', '_LAST_WEATHER_TS', '_MANUAL_OVERRIDES', '_VAV_DRIFT_STATE', '_WEATHER_NOW_CACHE', '_WEATHER_NOW_TTL_S', '_ahus_from_config', '_anon_effective_config', '_build_snapshot', '_bundled_mock_mode_default', '_demo_oa_state', '_enthalpy', '_fs_available', '_fs_root', '_humidity_ratio', '_load_csv', '_load_json', '_mark_weather_source', '_markov_drift', '_nasa_power_history', '_resolve_band', '_safe_join', '_scalar_drift', '_set_last_weather_source', '_simulate_ahu', '_v2_weatherapi_key', '_zero_pad_variants', 'httpx'):
        if hasattr(_server, name):
            g[name] = getattr(_server, name)

_pull_from_server()


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
