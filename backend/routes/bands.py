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
    read_ahu_rh_bands, write_ahu_rh_bands,
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


# ---------------------------------------------------------------------------
# Per-AHU RH-band overrides (Phase L.37 — 2026-06-26).
#
# GET  -> { ahu_rh_bands: { "AHU-01-E": {lo,hi,preset_id,updated_at}, ... } }
# POST -> body { bands: [{ahu_id, lo, hi, preset_id}, ...] } | single
#         {ahu_id, lo, hi, preset_id}; returns merged map.
# Anonymous callers get a Demo-mode response (applied=false) so the
# sidebar UI can still chip-acknowledge the click without persisting.
# ---------------------------------------------------------------------------
@router.get("/api/band-overrides/ahu-rh-bands")
async def get_ahu_rh_bands(tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    if not tenant:
        return {"status": "ok", "ahu_rh_bands": {}, "applied": False}
    bands = await read_ahu_rh_bands(tenant)
    return {"status": "ok", "ahu_rh_bands": bands, "tenant_id": tenant["tenant_id"]}


@router.post("/api/band-overrides/ahu-rh-bands")
async def set_ahu_rh_bands(payload: dict,
                            request: Request,
                            tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    # Normalise: accept single band or {bands: [...]} batch.
    if "bands" in payload and isinstance(payload["bands"], list):
        bands_in = payload["bands"]
    elif "ahu_id" in payload:
        bands_in = [payload]
    else:
        bands_in = []
    if not tenant:
        return {
            "status": "ok",
            "ahu_rh_bands": {b.get("ahu_id"): {"lo": b.get("lo"),
                                                "hi": b.get("hi"),
                                                "preset_id": b.get("preset_id", "custom")}
                              for b in bands_in if b.get("ahu_id")},
            "applied": False,
            "warning": "Demo mode -- sign in to persist per-AHU RH bands to the controller.",
        }
    prev_bands = await read_ahu_rh_bands(tenant)
    new_bands  = await write_ahu_rh_bands(tenant, bands_in)
    # Audit each applied band so the operator can trace any change back
    # to the user + IP.  Single audit row per batch keeps log volume
    # sane when the operator "Apply All"s a dozen AHUs at once.
    try:
        from auth import _resolve_session_token  # noqa: WPS433
        token = request.cookies.get("session_token")
        user = await _resolve_session_token(token) if token else None
    except Exception:  # noqa: BLE001
        user = None
    await record_audit(
        request, user, tenant,
        action="ahu-rh-bands",
        resource=f"tenant:{tenant['tenant_id']}",
        before={"ahu_rh_bands": prev_bands},
        after={"ahu_rh_bands": new_bands},
    )
    return {
        "status": "ok",
        "ahu_rh_bands": new_bands,
        "applied": True,
        "applied_count": len([b for b in bands_in if b.get("ahu_id")]),
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
