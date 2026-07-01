"""
elc.config.routes
=================
FastAPI router exposing Phase 1 CRUD for the V3.0 operator UI config.
Mounted into the ELC app via ``build_config_router(db_path)``.

Endpoints (all relative to the mount prefix, typically ``/api/elc``):
    Groups
        GET    /groups
        GET    /groups/{gid}
        POST   /groups                                {name, color}
        PATCH  /groups/{gid}                          {name?, color?}
        DELETE /groups/{gid}
    Group members
        POST   /groups/{gid}/members                  {device_id}
        DELETE /groups/{gid}/members/{did:path}
    Schedules
        GET    /schedules
        GET    /schedules/{sid}
        POST   /schedules                             {name, color, rules, enabled?}
        PATCH  /schedules/{sid}                       {name?, color?, rules?, enabled?}
        DELETE /schedules/{sid}
    Group ↔ Schedule
        POST   /groups/{gid}/schedules                {schedule_id, priority?}
        DELETE /groups/{gid}/schedules/{sid}
    Introspection (validates the join)
        GET    /devices/{did:path}/schedules

Errors:
    * 400 -- payload validation (BadInput)
    * 404 -- unknown group / schedule / member (NotFound)
    * 409 -- name / membership collision (Conflict)
"""
from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Body, HTTPException, Path

from elc.config import store

_ERR_MAP: dict[type, int] = {
    store.BadInput: 400,
    store.NotFound: 404,
    store.Conflict: 409,
}


def _raise_http(exc: Exception) -> None:
    """Map a ConfigStoreError → HTTPException with the right status."""
    status = _ERR_MAP.get(type(exc))
    if status is None:
        raise exc  # unexpected -- let FastAPI turn it into 500
    raise HTTPException(status_code=status, detail=str(exc))


def build_config_router(db_path: str | None = None) -> APIRouter:
    """Build the CRUD router bound to a specific SQLite path.

    Pass an explicit ``db_path`` in tests and preview sandboxes; leave
    as ``None`` on the target device to use ``store.DEFAULT_DB_PATH``.
    Sets the module-level ``store.DEFAULT_DB_PATH`` so downstream calls
    from within request handlers pick up the same location.
    """
    if db_path is not None:
        store.DEFAULT_DB_PATH = db_path  # type: ignore[assignment]
    store.init(db_path or store.DEFAULT_DB_PATH)

    r = APIRouter()

    # ------------------------------------------------------------------
    # Groups.
    # ------------------------------------------------------------------
    @r.get("/groups")
    def list_groups() -> dict[str, Any]:
        return {"groups": store.list_groups()}

    @r.get("/groups/{gid}")
    def get_group(gid: str) -> dict[str, Any]:
        try:
            return store.get_group(gid)
        except Exception as e:  # noqa: BLE001
            _raise_http(e)

    @r.post("/groups", status_code=201)
    def create_group(body: dict[str, Any] = Body(...)) -> dict[str, Any]:
        try:
            return store.create_group(name=body.get("name"), color=body.get("color"))
        except Exception as e:  # noqa: BLE001
            _raise_http(e)

    @r.patch("/groups/{gid}")
    def update_group(gid: str, body: dict[str, Any] = Body(...)) -> dict[str, Any]:
        try:
            return store.update_group(gid, name=body.get("name"), color=body.get("color"))
        except Exception as e:  # noqa: BLE001
            _raise_http(e)

    @r.delete("/groups/{gid}")
    def delete_group(gid: str) -> dict[str, Any]:
        try:
            store.delete_group(gid)
            return {"ok": True}
        except Exception as e:  # noqa: BLE001
            _raise_http(e)

    # ------------------------------------------------------------------
    # Group members.  `did` is a path-form device_id like SRM/1/100/1,
    # so it needs :path so FastAPI doesn't stop at the first '/'.
    # ------------------------------------------------------------------
    @r.post("/groups/{gid}/members", status_code=201)
    def add_member(gid: str, body: dict[str, Any] = Body(...)) -> dict[str, Any]:
        try:
            store.add_group_member(gid, body.get("device_id"))
            return {"ok": True}
        except Exception as e:  # noqa: BLE001
            _raise_http(e)

    @r.delete("/groups/{gid}/members/{did:path}")
    def remove_member(gid: str, did: str = Path(...)) -> dict[str, Any]:
        try:
            store.remove_group_member(gid, did)
            return {"ok": True}
        except Exception as e:  # noqa: BLE001
            _raise_http(e)

    # ------------------------------------------------------------------
    # Schedules.
    # ------------------------------------------------------------------
    @r.get("/schedules")
    def list_schedules() -> dict[str, Any]:
        return {"schedules": store.list_schedules()}

    @r.get("/schedules/{sid}")
    def get_schedule(sid: str) -> dict[str, Any]:
        try:
            return store.get_schedule(sid)
        except Exception as e:  # noqa: BLE001
            _raise_http(e)

    @r.post("/schedules", status_code=201)
    def create_schedule(body: dict[str, Any] = Body(...)) -> dict[str, Any]:
        if "rules" not in body:
            raise HTTPException(status_code=400, detail="rules field is required (may be null)")
        try:
            return store.create_schedule(
                name=body.get("name"),
                color=body.get("color"),
                rules=body["rules"],
                enabled=bool(body.get("enabled", True)),
            )
        except Exception as e:  # noqa: BLE001
            _raise_http(e)

    @r.patch("/schedules/{sid}")
    def update_schedule(sid: str, body: dict[str, Any] = Body(...)) -> dict[str, Any]:
        kwargs: dict[str, Any] = {}
        for k in ("name", "color"):
            if k in body:
                kwargs[k] = body[k]
        if "rules" in body:
            kwargs["rules"] = body["rules"]
        if "enabled" in body:
            kwargs["enabled"] = bool(body["enabled"])
        try:
            return store.update_schedule(sid, **kwargs)
        except Exception as e:  # noqa: BLE001
            _raise_http(e)

    @r.delete("/schedules/{sid}")
    def delete_schedule(sid: str) -> dict[str, Any]:
        try:
            store.delete_schedule(sid)
            return {"ok": True}
        except Exception as e:  # noqa: BLE001
            _raise_http(e)

    # ------------------------------------------------------------------
    # Group ↔ Schedule assignments.
    # ------------------------------------------------------------------
    @r.post("/groups/{gid}/schedules", status_code=201)
    def assign(gid: str, body: dict[str, Any] = Body(...)) -> dict[str, Any]:
        sid = body.get("schedule_id")
        if not sid:
            raise HTTPException(status_code=400, detail="schedule_id is required")
        try:
            store.assign_schedule(gid, sid, priority=int(body.get("priority", 0) or 0))
            return {"ok": True}
        except Exception as e:  # noqa: BLE001
            _raise_http(e)

    @r.delete("/groups/{gid}/schedules/{sid}")
    def unassign(gid: str, sid: str) -> dict[str, Any]:
        try:
            store.unassign_schedule(gid, sid)
            return {"ok": True}
        except Exception as e:  # noqa: BLE001
            _raise_http(e)

    @r.get("/devices/{did:path}/schedules")
    def schedules_for_device(did: str) -> dict[str, Any]:
        return {"device_id": did, "schedules": store.schedules_for_device(did)}

    return r
