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

from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Body, HTTPException, Path

from elc.config import store
from elc.scheduling import evaluator
from elc.scheduling.astro import BadLocation, Location

_ERR_MAP: dict[type, int] = {
    store.BadInput: 400,
    store.NotFound: 404,
    store.Conflict: 409,
    evaluator.RuleError: 400,
    BadLocation: 400,
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
        if body["rules"] is not None:
            try:
                evaluator.validate(body["rules"])
            except evaluator.RuleError as e:
                _raise_http(e)
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
            if body["rules"] is not None:
                try:
                    evaluator.validate(body["rules"])
                except evaluator.RuleError as e:
                    _raise_http(e)
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

    # ------------------------------------------------------------------
    # Controller-scoped settings (Phase 4): lat / lon / timezone /
    # weather_enabled / engine_mode.
    # ------------------------------------------------------------------
    @r.get("/settings")
    def get_settings() -> dict[str, Any]:
        return {"settings": store.get_settings()}

    @r.patch("/settings")
    def update_settings(body: dict[str, Any] = Body(...)) -> dict[str, Any]:
        try:
            return {"settings": store.update_settings(body)}
        except Exception as e:  # noqa: BLE001
            _raise_http(e)

    # ------------------------------------------------------------------
    # Schedule preview: "next 5 firings at my location, today onwards".
    # Body is optional; if provided it overrides the stored settings so
    # the UI can preview before saving location changes.
    # ------------------------------------------------------------------
    @r.post("/schedules/{sid}/preview")
    def preview_schedule(
        sid: str,
        body: dict[str, Any] = Body(default_factory=dict),  # noqa: B008
    ) -> dict[str, Any]:
        try:
            sched = store.get_schedule(sid)
        except Exception as e:  # noqa: BLE001
            _raise_http(e)
        rules = sched.get("rules")
        if rules is None:
            return {"schedule_id": sid, "firings": [],
                    "notice": "schedule has no rules configured"}
        settings = store.get_settings()
        # Body overrides for what-if preview.
        lat = float(body.get("latitude", settings["latitude"]))
        lon = float(body.get("longitude", settings["longitude"]))
        tz = body.get("timezone", settings["timezone"])
        weather_enabled = _truthy(body.get("weather_enabled", settings["weather_enabled"]))
        count = int(body.get("count", 5))
        try:
            loc = Location(latitude=lat, longitude=lon, timezone=tz)
            # Pull the controller's calendar so preview reflects the
            # same holidays / events the running engine would honour.
            cal_rows = store.list_calendar_days()
            holiday_dates = frozenset(
                r["date"] for r in cal_rows if r["kind"] == "holiday"
            )
            event_dates = frozenset(
                r["date"] for r in cal_rows if r["kind"] == "event"
            )
            ctx = evaluator.EvalContext(
                location=loc,
                weather_enabled=weather_enabled,
                holiday_dates=holiday_dates,
                event_dates=event_dates,
            )
            evaluator.validate(rules)
            now = datetime.now(timezone.utc)
            firings = evaluator.next_fire_times(rules, now, ctx, count=count)
        except Exception as e:  # noqa: BLE001
            _raise_http(e)
        return {
            "schedule_id": sid,
            "location": {"latitude": lat, "longitude": lon, "timezone": tz},
            "weather_enabled": weather_enabled,
            "firings": [
                {
                    "at": f.at.isoformat(),
                    "at_local": f.at.astimezone(loc.tzinfo).isoformat(),
                    "action": f.action,
                    "reason": f.reason,
                }
                for f in firings
            ],
        }

    # ------------------------------------------------------------------
    # Calendar days: holidays + event days.
    # ------------------------------------------------------------------
    @r.get("/calendar")
    def list_calendar(kind: str | None = None) -> dict[str, Any]:
        try:
            return {"days": store.list_calendar_days(kind)}
        except Exception as e:  # noqa: BLE001
            _raise_http(e)

    @r.post("/calendar", status_code=201)
    def add_calendar(body: dict[str, Any] = Body(...)) -> dict[str, Any]:
        try:
            return store.add_calendar_day(
                body.get("date"), body.get("label"), body.get("kind", "holiday"),
            )
        except Exception as e:  # noqa: BLE001
            _raise_http(e)

    @r.delete("/calendar/{entry_id}", status_code=204)
    def delete_calendar(entry_id: str) -> None:
        try:
            store.remove_calendar_day(entry_id)
        except Exception as e:  # noqa: BLE001
            _raise_http(e)

    @r.post("/calendar/suggest-holidays")
    def suggest_holidays(body: dict[str, Any] = Body(...)) -> dict[str, Any]:
        """Return (but do not persist) suggested holidays for the given
        country + year.  The UI shows a checklist; the operator picks
        which to add via subsequent POST /calendar calls (or POST
        /calendar/bulk).
        """
        try:
            import holidays as _holidays_lib
        except ImportError:  # pragma: no cover
            raise HTTPException(500, "holidays library not installed") from None
        country = (body.get("country") or "").upper().strip()
        year = int(body.get("year", 0))
        if len(country) != 2 or not country.isalpha():
            raise HTTPException(400, "country must be a 2-letter ISO code")
        if not (1970 <= year <= 2100):
            raise HTTPException(400, "year must be 1970..2100")
        try:
            cal = _holidays_lib.country_holidays(country, years=[year])
        except (KeyError, NotImplementedError):
            raise HTTPException(400, f"unknown country code {country!r}") from None
        entries = sorted(
            [{"date": d.isoformat(), "label": name} for d, name in cal.items()],
            key=lambda e: e["date"],
        )
        return {"country": country, "year": year, "holidays": entries}

    @r.post("/calendar/bulk", status_code=201)
    def bulk_add_calendar(body: dict[str, Any] = Body(...)) -> dict[str, Any]:
        entries = body.get("entries") or []
        if not isinstance(entries, list):
            raise HTTPException(400, "entries must be an array")
        try:
            inserted = store.bulk_add_calendar_days(entries)
        except Exception as e:  # noqa: BLE001
            _raise_http(e)
        return {"inserted": inserted, "skipped": len(entries) - len(inserted)}

    return r


def _truthy(v: Any) -> bool:
    return str(v).lower() in ("1", "true", "yes", "on")
