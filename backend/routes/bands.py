"""routes/bands.py -- bands endpoints.

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


@router.get("/api/band-overrides/sa-rh-clamp")
async def get_sa_rh_clamp(tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    if tenant:
        clamp = await read_sa_rh_clamp(tenant)
        return {"status": "ok", "sa_rh_clamp": clamp, "tenant_id": tenant["tenant_id"]}
    return {"status": "ok", "sa_rh_clamp": None}


@router.post("/api/band-overrides/sa-rh-clamp")
async def set_sa_rh_clamp(payload: dict,
                          request: Request,
                          tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    if not tenant:
        return {
            "status": "ok",
            "sa_rh_clamp": payload.get("sa_rh_clamp"),
            "applied": False,
            "warning": "Demo mode -- sign in to persist clamp settings.",
        }
    # Snapshot the previous value for the audit before we overwrite it.
    prev_clamp = await read_sa_rh_clamp(tenant)
    new_clamp  = payload.get("sa_rh_clamp")
    await write_sa_rh_clamp(tenant, new_clamp)
    # Resolve the acting user from the cookie for the audit row (lazy
    # import to avoid an import-cycle bootstrapping audit_log first).
    try:
        from auth import _resolve_session_token  # noqa: WPS433
        token = request.cookies.get("session_token")
        user = await _resolve_session_token(token) if token else None
    except Exception:  # noqa: BLE001
        user = None
    await record_audit(
        request, user, tenant,
        action="sa-rh-clamp",
        resource=f"tenant:{tenant['tenant_id']}",
        before={"sa_rh_clamp": prev_clamp},
        after={"sa_rh_clamp": new_clamp},
    )
    return {
        "status": "ok",
        "sa_rh_clamp": new_clamp,
        "applied": True,
        "tenant_id": tenant["tenant_id"],
    }


@router.get("/api/band-overrides/preview")
async def preview_clamp(lo: float = Query(...), hi: float = Query(...)) -> dict:
    """Dry-run: show what each band looks like under a candidate clamp.
    Used by the dashboard "Apply to Controller" confirm modal.

    Returns the V1.9 Flask `band_overrides_service` contract that the
    dashboard JS reads (a `preview` array with before/after/changed
    fields per band).  An earlier V2.0 implementation returned a
    different `affected` shape, which made the dashboard crash with
    `Cannot read properties of undefined (reading 'filter')` because
    `preview` was `undefined` and `preview.filter(...)` blew up before
    the confirm modal could render.  Parity restored 2026-06-17.
    """
    if lo > hi:
        lo, hi = hi, lo
    rows = _load_csv("band_guide.csv")
    preview = []
    for r in rows:
        try:
            orig_rh = float(r.get("SA_RH_Delivery") or 0)
        except (TypeError, ValueError):
            orig_rh = 0.0
        clamped_rh = max(lo, min(hi, orig_rh))
        orig_hum = r.get("HUM_Mode", "")
        if clamped_rh < orig_rh:
            new_hum = "DEHUMIDIFY"
            direction = "down"
        elif clamped_rh > orig_rh:
            new_hum = "HUMIDIFY"
            direction = "up"
        else:
            new_hum = orig_hum
            direction = None
        preview.append({
            "id":     r.get("Band", ""),
            "name":   r.get("Band_Name", ""),
            "before": {"sa_rh": orig_rh,    "hum": orig_hum},
            "after":  {"sa_rh": clamped_rh, "hum": new_hum},
            "changed":  direction is not None,
            "direction": direction,
        })
    return {"status": "ok", "preview": preview}


@router.get("/api/band-guide")
async def get_band_guide() -> dict:
    """Return the 10-band SA strategy matrix (`band_guide.csv`) as a JSON
    array.  Powers the per-AHU detail page's band table; the frontend
    highlights the row matching the AHU's current OA conditions."""
    rows = _load_csv("band_guide.csv")
    # Coerce numeric columns so the UI doesn't have to parseFloat() every cell.
    out = []
    NUMERIC = {"OA_T_Lo", "OA_T_Hi", "OA_RH_Lo", "OA_RH_Hi",
               "SA_T_CC_SP", "SA_T_Delivery", "SA_W_SP_gkg",
               "SA_RH_Delivery", "OA_Damper_SP", "Energy_Rank"}
    for r in rows:
        clean = {}
        for k, v in r.items():
            if k in NUMERIC:
                try:
                    clean[k] = float(v)
                except (TypeError, ValueError):
                    clean[k] = v
            else:
                clean[k] = v
        out.append(clean)
    return {"bands": out, "count": len(out)}
