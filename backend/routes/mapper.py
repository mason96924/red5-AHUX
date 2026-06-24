"""routes/mapper.py -- mapper endpoints.

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
@router.get("/api/map-config")
async def map_config(tenant: Optional[dict] = Depends(current_tenant_optional)) -> Any:
    """Return the tenant's saved map_config (floors + markers).  Anonymous
    callers get the bundled demo map_config so the dashboard's floor-plan
    overlay still renders during the demo walkthrough.

    Response is the V1.9 map_config.json shape (NOT wrapped):
        { floors: [{id, name, markers: [{type, name, id, x, y, ...}]}],
          version, ... }
    The dashboard's `getFloorForAhu()` reads `data.floors[*].markers[*]`
    directly so we cannot wrap the payload in another envelope."""
    if tenant:
        saved = await read_map_config(tenant)
        if saved:
            return saved
    # Bundled demo fallback (optional file).  If absent, return an empty
    # shape with `mode:'demo'` so the legacy 'No map_config.json' banner
    # still fires for anonymous users without a saved layout.
    demo_path = os.path.join(DEMO_DATA_DIR, "map_config.json")
    if os.path.exists(demo_path):
        with open(demo_path, "r") as f:
            return json.load(f)
    return {"floors": [], "mode": "demo", "warning": "No map_config saved yet."}


@router.post("/api/save-config")
async def save_config(payload: dict,
                      tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    """Equipment-mapper SAVE TO VIRTUAL CONTROLLER button posts here.

    Payload shape (V1.9):
        { deployment_path: '/root', map_config: {...}, image_manifest: {...} }
    """
    map_cfg  = payload.get("map_config") or {}
    img_man  = payload.get("image_manifest") or {}
    if not tenant:
        return {
            "success": False,
            "error": "Demo mode (anonymous) -- sign in to save the floor-plan map_config.",
            "persisted": False,
        }
    res = await write_map_config(tenant, map_cfg, img_man)
    return {
        "success": True,
        "persisted": True,
        "tenant_id": res["tenant_id"],
        "floors": res["floors"],
        "file": f"virtual-controller://{res['tenant_id']}/map_config.json",
    }


@router.post("/api/save-equipment-schema")
async def save_equipment_schema(payload: dict,
                                tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    # The V1.9 equipment_mapper.html sends the schema wrapped:
    #     { deployment_path: "/root", equipment_schema: { ahu_types, vav_types } }
    # while the Phase 2b backend originally expected the schema at the top
    # level.  Unwrap if present, fall back to direct payload for clients
    # (tests, integration scripts) that POST the schema flat.
    schema = payload.get("equipment_schema") if isinstance(payload.get("equipment_schema"), dict) else payload
    if not tenant:
        # Anonymous demo: return the V1.9-shaped failure so the mapper drops
        # into its built-in browser-download fallback gracefully.
        return {
            "status": "ok",
            "success": False,
            "saved_keys": list(schema.keys()),
            "persisted": False,
            "warning": "Demo mode (anonymous) -- sign in to save to your virtual controller.",
        }
    res = await write_equipment_types(tenant, schema)
    return {
        "status": "ok",
        "success": True,
        # The V1.9 mapper alerts the operator with `data.file`; we surface
        # a virtual-controller path so the dialog reads sensibly without
        # claiming a filesystem write that never happened.
        "file": "virtual-controller://%s/equipment_types" % res["tenant_id"],
        "saved_keys": list(schema.keys()),
        "persisted": True,
        "tenant_id": res["tenant_id"],
        "updated_at": res["updated_at"],
    }
