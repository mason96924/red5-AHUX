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
