"""routes/maintenance.py -- maintenance endpoints.

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
@router.post("/api/write-point")
async def write_point(payload: dict,
                      request: Request,
                      tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    """V1.9 BACnet RW write via dibt.Write().  In SaaS there is no real
    BACnet target -- we accept the write and reflect it back as 'applied'
    so the dashboard's APPLY TO CONTROLLER / clamp / override flows complete
    without throwing.  Each write is logged to `virtual_write_log`."""
    equip = (payload or {}).get("equipment_name") or ""
    writes = (payload or {}).get("writes") or {}
    if not equip or not isinstance(writes, dict) or not writes:
        return {"success": False, "error": "equipment_name and writes required"}
    # Snapshot the previous override values for the audit row so the UI
    # can render a clean before/after diff.
    prev_overrides = {
        k: _MANUAL_OVERRIDES.get(f"{equip}:{k}") for k in writes.keys()
    }
    # Update the in-memory simulator overrides so the very next /api/data
    # poll reflects the operator's pill toggle.  Anonymous demo state --
    # process-lifetime only.
    for k, v in writes.items():
        try:
            _MANUAL_OVERRIDES[f"{equip}:{k}"] = float(v)
        except (TypeError, ValueError):
            _MANUAL_OVERRIDES[f"{equip}:{k}"] = 1.0 if v else 0.0
    log_doc = {
        "tenant_id": (tenant or {}).get("tenant_id") or None,
        "equipment_name": equip,
        "writes": writes,
        "applied_at": datetime.now(timezone.utc),
        "mode": "virtual-controller",
    }
    try:
        from motor.motor_asyncio import AsyncIOMotorClient as _MC
        _mc = _MC(os.environ["MONGO_URL"])
        await _mc[os.environ["DB_NAME"]]["virtual_write_log"].insert_one(log_doc)
    except Exception:  # noqa: BLE001
        pass  # best-effort; never fail the operator's write
    # Audit the write so admins can see who flipped which pill / SA-RH
    # clamp / band override and when.  Best-effort; never fails the call.
    try:
        from auth import _resolve_session_token  # noqa: WPS433
        token = request.cookies.get("session_token")
        user = await _resolve_session_token(token) if token else None
    except Exception:  # noqa: BLE001
        user = None
    await record_audit(
        request, user, tenant,
        action="write-point",
        resource=equip,
        before=prev_overrides,
        after=writes,
    )
    return {
        "success": True,
        "equipment_name": equip,
        "writes": writes,
        "mode": "virtual-controller",
        "note": "Write accepted and logged.  Virtual controller -- no real BACnet target.",
    }


@router.post("/api/zip-files")
async def zip_files(payload: dict,
                    tenant: Optional[dict] = Depends(current_tenant_optional)) -> FastResponse:
    """Stream a ZIP of the named files from `tenant_assets`."""
    if not tenant:
        raise HTTPException(403, "Sign in to download your virtual controller assets.")
    names: list[str] = (payload or {}).get("names") or []
    base_path: str = (payload or {}).get("path") or ""
    if not isinstance(names, list) or not names:
        raise HTTPException(400, "names[] required")
    import io, zipfile
    buf = io.BytesIO()
    added = 0
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        for name in names:
            if ".." in name or name.startswith("/"):
                continue
            rel = (base_path.strip("/") + "/" + name).strip("/") if base_path else name
            doc = await read_tenant_asset(tenant, rel)
            if doc and doc.get("data_bytes"):
                zf.writestr(name, doc["data_bytes"])
                added += 1
    buf.seek(0)
    return FastResponse(content=buf.getvalue(),
                        media_type="application/zip",
                        headers={"Content-Disposition": f'attachment; filename="bundle-{added}.zip"'})


@router.post("/api/zip-dir")
async def zip_dir(payload: dict,
                  tenant: Optional[dict] = Depends(current_tenant_optional)) -> FastResponse:
    """Stream a ZIP of every file under the named virtual directory."""
    if not tenant:
        raise HTTPException(403, "Sign in to download your virtual controller assets.")
    dirname: str = (payload or {}).get("dirname") or ""
    base_path: str = (payload or {}).get("path") or ""
    prefix = ((base_path.strip("/") + "/") if base_path else "") + dirname.strip("/")
    prefix = prefix.strip("/") + "/"
    import io, zipfile, re
    from tenants import ten_asset_col as _assets_col  # noqa: WPS433
    buf = io.BytesIO()
    added = 0
    cursor = _assets_col.find(
        {"tenant_id": tenant["tenant_id"],
         "filename": {"$regex": "^" + re.escape(prefix)}},
        {"_id": 0, "filename": 1, "data_bytes": 1},
    )
    docs = await cursor.to_list(length=10000)
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        for doc in docs:
            short = doc["filename"][len(prefix):]
            zf.writestr(short or doc["filename"], doc.get("data_bytes") or b"")
            added += 1
    buf.seek(0)
    arcname = (dirname.strip("/") or "assets").replace("/", "_")
    return FastResponse(content=buf.getvalue(),
                        media_type="application/zip",
                        headers={"Content-Disposition": f'attachment; filename="{arcname}.zip"'})
