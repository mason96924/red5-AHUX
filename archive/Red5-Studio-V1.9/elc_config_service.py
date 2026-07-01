"""
elc_config_service.py
=====================
Phase 1 CRUD endpoints for the V3.0 ELC operator UI config.
Follows the same plug-in pattern as ``band_service.py`` /
``upload_service.py``:  ``elc_config_service.register(app, ctx)`` is
auto-discovered by app.py.

Endpoints (all under /api/elc/):
    Groups
        GET    /groups
        GET    /groups/<gid>
        POST   /groups                          {name, color}
        PATCH  /groups/<gid>                    {name?, color?}
        DELETE /groups/<gid>
    Group members
        POST   /groups/<gid>/members            {device_id}
        DELETE /groups/<gid>/members/<did>      (did URL-encoded)
    Schedules
        GET    /schedules
        GET    /schedules/<sid>
        POST   /schedules                       {name, color, rules, enabled?}
        PATCH  /schedules/<sid>                 {name?, color?, rules?, enabled?}
        DELETE /schedules/<sid>
    Group <-> Schedule
        POST   /groups/<gid>/schedules          {schedule_id, priority?}
        DELETE /groups/<gid>/schedules/<sid>
    Introspection (validates the join)
        GET    /devices/<did>/schedules         (did URL-encoded)

Errors:
    * 400 -- payload validation
    * 404 -- unknown group / schedule / member
    * 409 -- name / membership collision
    * 500 -- anything else (unhandled)

Persistence:  /root/data/elc_config.db (SQLite).  See elc_config_store.
"""
_service_dependencies: list[str] = []  # store owns its own DB path

import logging
from typing import Any

from flask import jsonify, request

import elc_config_store as store

log = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Error → HTTP mapper.
# ---------------------------------------------------------------------------
_ERR_MAP = {
    store.BadInput: 400,
    store.NotFound: 404,
    store.Conflict: 409,
}


def _handle(fn):  # type: ignore[no-untyped-def]
    """Wrap a route handler so ConfigStore exceptions become clean JSON."""

    def wrapper(*args: Any, **kwargs: Any):
        try:
            return fn(*args, **kwargs)
        except tuple(_ERR_MAP.keys()) as e:
            return jsonify({"error": str(e)}), _ERR_MAP[type(e)]
        except Exception as e:  # noqa: BLE001
            log.exception("elc_config unexpected failure")
            return jsonify({"error": f"internal: {type(e).__name__}: {e}"}), 500

    wrapper.__name__ = fn.__name__
    return wrapper


def _json_body() -> dict[str, Any]:
    body = request.get_json(silent=True)
    if body is None:
        raise store.BadInput("body must be JSON")
    if not isinstance(body, dict):
        raise store.BadInput("body must be a JSON object")
    return body


# ---------------------------------------------------------------------------
# Groups.
# ---------------------------------------------------------------------------
@_handle
def h_list_groups():  # type: ignore[no-untyped-def]
    return jsonify({"groups": store.list_groups()})


@_handle
def h_get_group(gid):  # type: ignore[no-untyped-def]
    return jsonify(store.get_group(gid))


@_handle
def h_create_group():  # type: ignore[no-untyped-def]
    b = _json_body()
    row = store.create_group(name=b.get("name"), color=b.get("color"))
    return jsonify(row), 201


@_handle
def h_update_group(gid):  # type: ignore[no-untyped-def]
    b = _json_body()
    row = store.update_group(gid, name=b.get("name"), color=b.get("color"))
    return jsonify(row)


@_handle
def h_delete_group(gid):  # type: ignore[no-untyped-def]
    store.delete_group(gid)
    return jsonify({"ok": True})


# ---------------------------------------------------------------------------
# Group members.
# ---------------------------------------------------------------------------
@_handle
def h_add_member(gid):  # type: ignore[no-untyped-def]
    b = _json_body()
    store.add_group_member(gid, b.get("device_id"))
    return jsonify({"ok": True}), 201


@_handle
def h_remove_member(gid, did):  # type: ignore[no-untyped-def]
    store.remove_group_member(gid, did)
    return jsonify({"ok": True})


# ---------------------------------------------------------------------------
# Schedules.
# ---------------------------------------------------------------------------
@_handle
def h_list_schedules():  # type: ignore[no-untyped-def]
    return jsonify({"schedules": store.list_schedules()})


@_handle
def h_get_schedule(sid):  # type: ignore[no-untyped-def]
    return jsonify(store.get_schedule(sid))


@_handle
def h_create_schedule():  # type: ignore[no-untyped-def]
    b = _json_body()
    if "rules" not in b:
        raise store.BadInput("rules field is required (may be null)")
    row = store.create_schedule(
        name=b.get("name"),
        color=b.get("color"),
        rules=b["rules"],
        enabled=bool(b.get("enabled", True)),
    )
    return jsonify(row), 201


@_handle
def h_update_schedule(sid):  # type: ignore[no-untyped-def]
    b = _json_body()
    kwargs: dict[str, Any] = {}
    if "name" in b:
        kwargs["name"] = b["name"]
    if "color" in b:
        kwargs["color"] = b["color"]
    if "rules" in b:
        kwargs["rules"] = b["rules"]
    if "enabled" in b:
        kwargs["enabled"] = bool(b["enabled"])
    return jsonify(store.update_schedule(sid, **kwargs))


@_handle
def h_delete_schedule(sid):  # type: ignore[no-untyped-def]
    store.delete_schedule(sid)
    return jsonify({"ok": True})


# ---------------------------------------------------------------------------
# Group <-> Schedule assignments.
# ---------------------------------------------------------------------------
@_handle
def h_assign(gid):  # type: ignore[no-untyped-def]
    b = _json_body()
    sid = b.get("schedule_id")
    if not sid:
        raise store.BadInput("schedule_id is required")
    store.assign_schedule(gid, sid, priority=int(b.get("priority", 0) or 0))
    return jsonify({"ok": True}), 201


@_handle
def h_unassign(gid, sid):  # type: ignore[no-untyped-def]
    store.unassign_schedule(gid, sid)
    return jsonify({"ok": True})


@_handle
def h_schedules_for_device(did):  # type: ignore[no-untyped-def]
    return jsonify({"device_id": did, "schedules": store.schedules_for_device(did)})


# ---------------------------------------------------------------------------
# Registration.
# ---------------------------------------------------------------------------
def register(app, ctx):  # type: ignore[no-untyped-def]
    """Wire the CRUD routes onto ``app``.

    ``ctx`` may optionally carry ``elc_db_path``; otherwise the store's
    DEFAULT_DB_PATH (`/root/data/elc_config.db`) is used.  Tests pass a
    temp path to keep runs isolated.
    """
    db_path = (ctx or {}).get("elc_db_path", store.DEFAULT_DB_PATH)
    store.DEFAULT_DB_PATH = db_path  # type: ignore[assignment]
    store.init(db_path)

    r = app.add_url_rule

    # Groups
    r("/api/elc/groups", "elc_list_groups", h_list_groups, methods=["GET"])
    r("/api/elc/groups", "elc_create_group", h_create_group, methods=["POST"])
    r("/api/elc/groups/<gid>", "elc_get_group", h_get_group, methods=["GET"])
    r("/api/elc/groups/<gid>", "elc_update_group", h_update_group, methods=["PATCH"])
    r("/api/elc/groups/<gid>", "elc_delete_group", h_delete_group, methods=["DELETE"])

    # Members
    r("/api/elc/groups/<gid>/members", "elc_add_member", h_add_member, methods=["POST"])
    r(
        "/api/elc/groups/<gid>/members/<path:did>",
        "elc_remove_member",
        h_remove_member,
        methods=["DELETE"],
    )

    # Schedules
    r("/api/elc/schedules", "elc_list_schedules", h_list_schedules, methods=["GET"])
    r("/api/elc/schedules", "elc_create_schedule", h_create_schedule, methods=["POST"])
    r("/api/elc/schedules/<sid>", "elc_get_schedule", h_get_schedule, methods=["GET"])
    r("/api/elc/schedules/<sid>", "elc_update_schedule", h_update_schedule, methods=["PATCH"])
    r("/api/elc/schedules/<sid>", "elc_delete_schedule", h_delete_schedule, methods=["DELETE"])

    # Assignments
    r(
        "/api/elc/groups/<gid>/schedules",
        "elc_assign_schedule",
        h_assign,
        methods=["POST"],
    )
    r(
        "/api/elc/groups/<gid>/schedules/<sid>",
        "elc_unassign_schedule",
        h_unassign,
        methods=["DELETE"],
    )

    # Introspection (validates the join)
    r(
        "/api/elc/devices/<path:did>/schedules",
        "elc_schedules_for_device",
        h_schedules_for_device,
        methods=["GET"],
    )
