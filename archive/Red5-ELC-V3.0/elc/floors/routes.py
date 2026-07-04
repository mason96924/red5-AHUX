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

from elc.config import store as config_store
from elc.floors import store
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
            return store.get_floor(fid, db_path=db_path)
        except Exception as e:
            _raise_http(e)

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
                db_path=db_path,
            )
        except Exception as e:
            _raise_http(e)

    return router
