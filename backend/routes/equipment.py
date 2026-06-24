"""routes/equipment.py -- equipment endpoints.

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


@router.get("/api/equipment-types")
async def equipment_types(tenant: Optional[dict] = Depends(current_tenant_optional)) -> Any:
    """Signed-in users get THEIR copy (Phase 2 Piece B); anonymous gets demo."""
    if tenant:
        tenant_eq = await read_equipment_types(tenant)
        if tenant_eq:
            return tenant_eq
    return _load_json("equipment_types.json")


@router.get("/api/collector-config")
async def collector_config(tenant: Optional[dict] = Depends(current_tenant_optional)) -> Any:
    """Signed-in users get THEIR saved collector config; anonymous gets the
    bundled demo template with the in-memory anonymous mode override applied
    so the modal's Simulator/Mock pill matches what /api/data is using."""
    if tenant:
        saved = await read_collector_config(tenant)
        if saved:
            return saved
    return _anon_effective_config()


@router.post("/api/collector-config")
async def save_collector_config(payload: dict,
                                tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    """Dashboard COLLECTOR modal posts the whole cfg JSON here.  We persist
    per-tenant when signed in.  Anonymous callers get success:true with a
    `persisted:false` flag so the modal does not show a misleading error --
    the live dashboard still works in demo mode regardless."""
    if not tenant:
        return {
            "success": True,
            "persisted": False,
            "warning": "Demo mode (anonymous) -- sign in to persist collector configuration.",
        }
    res = await write_collector_config(tenant, payload)
    return {
        "success": True,
        "persisted": True,
        "tenant_id": res["tenant_id"],
    }
