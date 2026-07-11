"""
elc.floors.routes
=================
FastAPI router for Phase 6.1 floor plans.

Mounted under the same ``/api/elc`` namespace as the rest of the
operator API::

    GET    /floors                     -- list (no svg)
    GET    /floors/{fid}               -- one (includes svg)
    GET    /floors/{fid}/background.svg -- inline SVG only
    POST   /floors                     -- create {name, width_m?, height_m?, svg?}
    PATCH  /floors/{fid}               -- partial update
    DELETE /floors/{fid}
    POST   /floors/import-dxf          -- multipart DXF upload; creates a
                                          floor and returns it

Errors map identically to the config router:
    * 400 -- payload / DXF validation
    * 404 -- unknown floor
    * 409 -- name collision
"""
from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Body, File, Form, HTTPException, UploadFile
from fastapi.responses import Response

from elc.codec.device_id import DeviceId
from elc.config import store as config_store
from elc.floors import lighting, store
from elc.floors.dxf import DxfImportError, dxf_to_svg

_ERR_MAP: dict[type, int] = {
    config_store.BadInput: 400,
    config_store.NotFound: 404,
    config_store.Conflict: 409,
    DxfImportError: 400,
}


def _raise_http(exc: Exception) -> None:
    status = _ERR_MAP.get(type(exc))
    if status is None:
        raise exc
    raise HTTPException(status_code=status, detail=str(exc))


def _canonicalise_fixtures(floor: dict[str, Any]) -> None:
    """Rewrite each fixture's ``device_id`` to the canonical string.

    Ensures alias / SCU-renumber migrations don't strand old placements
    with legacy strings.  Silently skips fixtures whose device_id
    can't be parsed (they'll show up on the plan but won't match any
    SRM tile until the operator re-places them).
    """
    fixtures = floor.get("fixtures") or []
    for fx in fixtures:
        did = fx.get("device_id")
        if not isinstance(did, str):
            continue
        try:
            dev = DeviceId.from_string(did)
        except Exception:
            continue
        fx["device_id"] = str(dev)


def build_floors_router(*, db_path: str | None = None) -> APIRouter:
    """Construct the ``/floors`` sub-router.  Called by ``build_stack``
    with the same ``db_path`` used by the config router so all
    operator-UI tables live in one SQLite file."""
    router = APIRouter(prefix="/floors", tags=["elc-floors"])

    # ---- list --------------------------------------------------------
    @router.get("")
    async def list_floors() -> dict[str, Any]:
        return {"floors": store.list_floors(db_path=db_path)}

    # ---- one (with svg) ---------------------------------------------
    @router.get("/{fid}")
    async def get_floor(fid: str) -> dict[str, Any]:
        try:
            f = store.get_floor(fid, db_path=db_path)
        except Exception as e:
            _raise_http(e)
        # Canonicalise fixture device_ids on read.  Placements stored
        # before enum-alias / SCU-number changes may carry legacy
        # strings (e.g. ``SRM_ERM/1/2/0`` when the codec now emits
        # ``SRM_6E/0/2/0``); we re-parse and re-format via DeviceId so
        # the string always matches what ``/api/elc/devices`` returns.
        # A mismatch here is exactly why the SRM-grid highlight
        # doesn't fire after a canvas selection.
        _canonicalise_fixtures(f)
        return f

    # ---- inline SVG background --------------------------------------
    @router.get("/{fid}/background.svg")
    async def get_floor_svg(fid: str) -> Response:
        try:
            f = store.get_floor(fid, db_path=db_path)
        except Exception as e:
            _raise_http(e)
        return Response(
            content=f["svg"],
            media_type="image/svg+xml",
            headers={"Cache-Control": "no-store"},
        )

    # ---- create ------------------------------------------------------
    @router.post("", status_code=201)
    async def create_floor(payload: dict[str, Any] = Body(...)) -> dict[str, Any]:
        try:
            return store.create_floor(
                name=payload.get("name", ""),
                svg=payload.get("svg", ""),
                width_m=float(payload.get("width_m", 20.0)),
                height_m=float(payload.get("height_m", 15.0)),
                fixtures=payload.get("fixtures"),
                rooms=payload.get("rooms"),
                db_path=db_path,
            )
        except Exception as e:
            _raise_http(e)

    # ---- update ------------------------------------------------------
    @router.patch("/{fid}")
    async def update_floor(
        fid: str, payload: dict[str, Any] = Body(...),
    ) -> dict[str, Any]:
        try:
            return store.update_floor(
                fid,
                name=payload.get("name"),
                svg=payload.get("svg"),
                width_m=payload.get("width_m"),
                height_m=payload.get("height_m"),
                fixtures=payload.get("fixtures"),
                rooms=payload.get("rooms"),
                windows=payload.get("windows"),
                ceiling_height_m=payload.get("ceiling_height_m"),
                strand_label=payload.get("strand_label"),
                db_path=db_path,
            )
        except Exception as e:
            _raise_http(e)

    # ---- delete ------------------------------------------------------
    @router.delete("/{fid}", status_code=204)
    async def delete_floor(fid: str) -> Response:
        try:
            store.delete_floor(fid, db_path=db_path)
        except Exception as e:
            _raise_http(e)
        return Response(status_code=204)

    # ---- DXF upload --------------------------------------------------
    @router.post("/import-dxf", status_code=201)
    async def import_dxf(
        name: str = Form(...),
        dxf: UploadFile = File(...),
    ) -> dict[str, Any]:
        """Multipart upload — one DXF, converted to SVG, saved as a
        new floor.  The SVG is stored inline (see PRD § Phase 6.1).
        The physical extents from the DXF header become the floor's
        ``width_m`` / ``height_m``, so subsequent fixture placement
        coordinates line up with the actual drawing."""
        blob = await dxf.read()
        try:
            conv = dxf_to_svg(blob)
        except DxfImportError as e:
            raise HTTPException(status_code=400, detail=str(e)) from e
        try:
            return store.create_floor(
                name=name,
                svg=conv.svg,
                width_m=conv.width_m,
                height_m=conv.height_m,
                rooms=conv.rooms,
                db_path=db_path,
            )
        except Exception as e:
            _raise_http(e)

    return router


def build_lighting_router(*, db_path: str | None = None) -> APIRouter:
    """Phase 6.1b — per-device lighting-element assignments.

    Kept as its own APIRouter so the mount can be reused / omitted
    independently of the floor CRUD if a future stack ever wants only
    one of the two.  Both routers share the same ``config_db_path``
    when wired through :func:`elc.api.app.build_stack`.
    """
    router = APIRouter(prefix="/lighting-elements", tags=["elc-lighting"])

    @router.get("")
    async def list_all() -> dict[str, Any]:
        return {"elements": lighting.list_elements(db_path=db_path)}

    @router.get("/{device_id:path}")
    async def get_one(device_id: str) -> dict[str, Any]:
        try:
            return lighting.get_element(device_id, db_path=db_path)
        except Exception as e:
            _raise_http(e)

    @router.put("/{device_id:path}")
    async def upsert(
        device_id: str, payload: dict[str, Any] = Body(...),
    ) -> dict[str, Any]:
        try:
            return lighting.upsert_element(
                device_id,
                type=payload.get("type", ""),
                max_lux=float(payload.get("max_lux", 500)),
                beam_radius_m=float(payload.get("beam_radius_m", 4.0)),
                cct_k=int(payload.get("cct_k", 4000)),
                shape=str(payload.get("shape", "point")),
                tube_type=str(payload.get("tube_type", "none")),
                db_path=db_path,
            )
        except Exception as e:
            _raise_http(e)

    @router.delete("/{device_id:path}", status_code=204)
    async def delete_one(device_id: str) -> Response:
        try:
            lighting.delete_element(device_id, db_path=db_path)
        except Exception as e:
            _raise_http(e)
        return Response(status_code=204)

    # POST body: { "device_ids": ["SRM/1/10/0", ...], "type": "onoff" }
    # Mounted at the class root (no /bulk-assign path collision with
    # the /{device_id:path} rule) via a distinct path.
    @router.post("/bulk-assign", status_code=200)
    async def bulk_assign(payload: dict[str, Any] = Body(...)) -> dict[str, Any]:
        try:
            elements = lighting.bulk_assign(
                payload.get("device_ids") or [],
                type=payload.get("type", ""),
                db_path=db_path,
            )
        except Exception as e:
            _raise_http(e)
        return {"elements": elements}

    return router
