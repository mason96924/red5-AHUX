"""
elc_config_store.py
===================
SQLite-backed persistence for the V3.0 ELC operator UI config:
    * groups           -- named collections of relays
    * group_members    -- device-id membership rows for each group
    * schedules        -- named rule sets to be evaluated later (Phase 4)
    * group_schedules  -- many-to-many assignment of schedules to groups
                          with a priority tie-breaker

Design notes:
  * Pure sqlite3 stdlib.  No ORM, no external deps.  Each Flask handler
    borrows a per-request connection via `get_conn()` -- SQLite handles
    concurrency at the file level with WAL mode.
  * `_ensure_schema()` runs at import; creating tables is idempotent.
  * IDs are UUID4 hex strings (32 chars).  Chosen over autoincrement so
    a fleet-wide sync (via bundle upload of the .db file) doesn't collide
    two controllers' independently-issued IDs.
  * Uniqueness violations raise :class:`Conflict`; not-found raises
    :class:`NotFound`.  Both are re-mapped to HTTP 409 / 404 by the
    service layer.
  * Time columns store ISO8601 UTC strings.  Cheap to read from the JS
    side without importing a date parser.

Not yet in scope (kept for Phase 2+):
    aligners, placements, active-schedule execution.
"""
from __future__ import annotations

import contextlib
import json
import os
import sqlite3
import uuid
from datetime import datetime, timezone
from typing import Any, Iterable, Iterator

DEFAULT_DB_PATH = "/root/data/elc_config.db"


# ---------------------------------------------------------------------------
# Exceptions -- kept generic; the Flask layer maps to HTTP status codes.
# ---------------------------------------------------------------------------
class ConfigStoreError(Exception):
    """Base for anything this module raises deliberately."""


class NotFound(ConfigStoreError):
    """The requested row does not exist."""


class Conflict(ConfigStoreError):
    """Uniqueness constraint (typically a name collision) rejected the write."""


class BadInput(ConfigStoreError):
    """Payload failed validation before touching the DB."""


# ---------------------------------------------------------------------------
# DB bootstrapping.
# ---------------------------------------------------------------------------
_SCHEMA = [
    """
    CREATE TABLE IF NOT EXISTS groups (
        id          TEXT PRIMARY KEY,
        name        TEXT NOT NULL UNIQUE,
        color       TEXT NOT NULL,
        created_at  TEXT NOT NULL,
        updated_at  TEXT NOT NULL
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS group_members (
        group_id    TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
        device_id   TEXT NOT NULL,
        PRIMARY KEY (group_id, device_id)
    )
    """,
    "CREATE INDEX IF NOT EXISTS idx_group_members_device ON group_members(device_id)",
    """
    CREATE TABLE IF NOT EXISTS schedules (
        id          TEXT PRIMARY KEY,
        name        TEXT NOT NULL UNIQUE,
        color       TEXT NOT NULL,
        rules_json  TEXT NOT NULL,
        enabled     INTEGER NOT NULL DEFAULT 1,
        created_at  TEXT NOT NULL,
        updated_at  TEXT NOT NULL
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS group_schedules (
        group_id    TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
        schedule_id TEXT NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
        priority    INTEGER NOT NULL DEFAULT 0,
        updated_at  TEXT NOT NULL,
        PRIMARY KEY (group_id, schedule_id)
    )
    """,
]


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _new_id() -> str:
    return uuid.uuid4().hex


@contextlib.contextmanager
def get_conn(db_path: str | None = None) -> Iterator[sqlite3.Connection]:
    db_path = db_path or DEFAULT_DB_PATH
    """Yield a per-call sqlite3 connection with sane defaults.

    * foreign_keys = ON so ON DELETE CASCADE fires.
    * journal_mode = WAL for concurrent readers while a writer holds
      the write lock (the Flask app is single-worker but the writer is
      still contended with the ``/api/repair/*`` bundle-upload path).
    * row_factory = sqlite3.Row so callers get dict-like rows.
    """
    conn = sqlite3.connect(db_path, timeout=5.0, isolation_level=None)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA journal_mode = WAL")
    try:
        yield conn
    finally:
        conn.close()


def _ensure_schema(db_path: str | None = None) -> None:
    db_path = db_path or DEFAULT_DB_PATH
    """Create tables/indexes if missing.  Safe to call on every request."""
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    with get_conn(db_path) as conn:
        for stmt in _SCHEMA:
            conn.execute(stmt)


def init(db_path: str | None = None) -> None:
    db_path = db_path or DEFAULT_DB_PATH
    """Public entry point used by register() in the service layer."""
    _ensure_schema(db_path)


# ---------------------------------------------------------------------------
# Groups.
# ---------------------------------------------------------------------------
def list_groups(db_path: str | None = None) -> list[dict[str, Any]]:
    db_path = db_path or DEFAULT_DB_PATH
    with get_conn(db_path) as conn:
        rows = conn.execute("SELECT * FROM groups ORDER BY name").fetchall()
    return [dict(r) for r in rows]


def _group_or_404(conn: sqlite3.Connection, group_id: str) -> sqlite3.Row:
    row = conn.execute("SELECT * FROM groups WHERE id = ?", (group_id,)).fetchone()
    if row is None:
        raise NotFound(f"group {group_id!r} not found")
    return row


def get_group(group_id: str, db_path: str | None = None) -> dict[str, Any]:
    db_path = db_path or DEFAULT_DB_PATH
    """Return the group plus its members and assigned schedules."""
    with get_conn(db_path) as conn:
        row = _group_or_404(conn, group_id)
        members = [
            r["device_id"]
            for r in conn.execute(
                "SELECT device_id FROM group_members WHERE group_id = ? ORDER BY device_id",
                (group_id,),
            )
        ]
        schedules = [
            dict(r)
            for r in conn.execute(
                """SELECT s.id, s.name, s.color, gs.priority, gs.updated_at
                     FROM group_schedules gs
                     JOIN schedules s ON s.id = gs.schedule_id
                    WHERE gs.group_id = ?
                    ORDER BY gs.priority DESC, gs.updated_at DESC""",
                (group_id,),
            )
        ]
    out = dict(row)
    out["members"] = members
    out["schedules"] = schedules
    return out


def create_group(name: str, color: str, db_path: str | None = None) -> dict[str, Any]:
    db_path = db_path or DEFAULT_DB_PATH
    _validate_name(name)
    _validate_color(color)
    row_id = _new_id()
    now = _now()
    try:
        with get_conn(db_path) as conn:
            conn.execute(
                "INSERT INTO groups (id, name, color, created_at, updated_at) VALUES (?,?,?,?,?)",
                (row_id, name, color, now, now),
            )
    except sqlite3.IntegrityError as e:
        raise Conflict(f"group name {name!r} already exists") from e
    return get_group(row_id, db_path)


def update_group(
    group_id: str,
    *,
    name: str | None = None,
    color: str | None = None,
    db_path: str | None = None,
) -> dict[str, Any]:
    db_path = db_path or DEFAULT_DB_PATH
    if name is None and color is None:
        raise BadInput("update requires at least one of name / color")
    if name is not None:
        _validate_name(name)
    if color is not None:
        _validate_color(color)
    now = _now()
    try:
        with get_conn(db_path) as conn:
            _group_or_404(conn, group_id)
            sets: list[str] = ["updated_at = ?"]
            args: list[Any] = [now]
            if name is not None:
                sets.append("name = ?")
                args.append(name)
            if color is not None:
                sets.append("color = ?")
                args.append(color)
            args.append(group_id)
            conn.execute(f"UPDATE groups SET {', '.join(sets)} WHERE id = ?", args)
    except sqlite3.IntegrityError as e:
        raise Conflict(f"group name {name!r} already exists") from e
    return get_group(group_id, db_path)


def delete_group(group_id: str, db_path: str | None = None) -> None:
    db_path = db_path or DEFAULT_DB_PATH
    with get_conn(db_path) as conn:
        _group_or_404(conn, group_id)
        conn.execute("DELETE FROM groups WHERE id = ?", (group_id,))


# ---------------------------------------------------------------------------
# Group members.
# ---------------------------------------------------------------------------
def add_group_member(group_id: str, device_id: str, db_path: str | None = None) -> None:
    db_path = db_path or DEFAULT_DB_PATH
    _validate_device_id(device_id)
    with get_conn(db_path) as conn:
        _group_or_404(conn, group_id)
        try:
            conn.execute(
                "INSERT INTO group_members (group_id, device_id) VALUES (?,?)",
                (group_id, device_id),
            )
        except sqlite3.IntegrityError as e:
            raise Conflict(f"device {device_id!r} already in group") from e


def remove_group_member(group_id: str, device_id: str, db_path: str | None = None) -> None:
    db_path = db_path or DEFAULT_DB_PATH
    with get_conn(db_path) as conn:
        _group_or_404(conn, group_id)
        cur = conn.execute(
            "DELETE FROM group_members WHERE group_id = ? AND device_id = ?",
            (group_id, device_id),
        )
        if cur.rowcount == 0:
            raise NotFound(f"device {device_id!r} not in group {group_id!r}")


# ---------------------------------------------------------------------------
# Schedules.
# ---------------------------------------------------------------------------
def list_schedules(db_path: str | None = None) -> list[dict[str, Any]]:
    db_path = db_path or DEFAULT_DB_PATH
    with get_conn(db_path) as conn:
        rows = conn.execute("SELECT * FROM schedules ORDER BY name").fetchall()
    return [_schedule_row(r) for r in rows]


def _schedule_row(row: sqlite3.Row) -> dict[str, Any]:
    d = dict(row)
    d["enabled"] = bool(d.get("enabled"))
    d["rules"] = json.loads(d.pop("rules_json") or "null")
    return d


def _schedule_or_404(conn: sqlite3.Connection, schedule_id: str) -> sqlite3.Row:
    row = conn.execute("SELECT * FROM schedules WHERE id = ?", (schedule_id,)).fetchone()
    if row is None:
        raise NotFound(f"schedule {schedule_id!r} not found")
    return row


def get_schedule(schedule_id: str, db_path: str | None = None) -> dict[str, Any]:
    db_path = db_path or DEFAULT_DB_PATH
    with get_conn(db_path) as conn:
        return _schedule_row(_schedule_or_404(conn, schedule_id))


def create_schedule(
    name: str,
    color: str,
    rules: Any,
    enabled: bool = True,
    db_path: str | None = None,
) -> dict[str, Any]:
    db_path = db_path or DEFAULT_DB_PATH
    _validate_name(name)
    _validate_color(color)
    row_id = _new_id()
    now = _now()
    try:
        with get_conn(db_path) as conn:
            conn.execute(
                """INSERT INTO schedules
                    (id, name, color, rules_json, enabled, created_at, updated_at)
                    VALUES (?,?,?,?,?,?,?)""",
                (row_id, name, color, json.dumps(rules), 1 if enabled else 0, now, now),
            )
    except sqlite3.IntegrityError as e:
        raise Conflict(f"schedule name {name!r} already exists") from e
    return get_schedule(row_id, db_path)


# Sentinel: distinguishes "caller didn't pass rules" from
# "caller explicitly passed None as the new rules value".
_MISSING: Any = object()


def update_schedule(
    schedule_id: str,
    *,
    name: str | None = None,
    color: str | None = None,
    rules: Any = _MISSING,
    enabled: bool | None = None,
    db_path: str | None = None,
) -> dict[str, Any]:
    db_path = db_path or DEFAULT_DB_PATH
    if name is None and color is None and rules is _MISSING and enabled is None:
        raise BadInput("update requires at least one field")
    if name is not None:
        _validate_name(name)
    if color is not None:
        _validate_color(color)
    now = _now()
    try:
        with get_conn(db_path) as conn:
            _schedule_or_404(conn, schedule_id)
            sets: list[str] = ["updated_at = ?"]
            args: list[Any] = [now]
            if name is not None:
                sets.append("name = ?")
                args.append(name)
            if color is not None:
                sets.append("color = ?")
                args.append(color)
            if rules is not _MISSING:
                sets.append("rules_json = ?")
                args.append(json.dumps(rules))
            if enabled is not None:
                sets.append("enabled = ?")
                args.append(1 if enabled else 0)
            args.append(schedule_id)
            conn.execute(f"UPDATE schedules SET {', '.join(sets)} WHERE id = ?", args)
    except sqlite3.IntegrityError as e:
        raise Conflict(f"schedule name {name!r} already exists") from e
    return get_schedule(schedule_id, db_path)


def delete_schedule(schedule_id: str, db_path: str | None = None) -> None:
    db_path = db_path or DEFAULT_DB_PATH
    with get_conn(db_path) as conn:
        _schedule_or_404(conn, schedule_id)
        conn.execute("DELETE FROM schedules WHERE id = ?", (schedule_id,))


# ---------------------------------------------------------------------------
# Group <-> Schedule assignments.
# ---------------------------------------------------------------------------
def assign_schedule(
    group_id: str,
    schedule_id: str,
    priority: int = 0,
    db_path: str | None = None,
) -> None:
    db_path = db_path or DEFAULT_DB_PATH
    now = _now()
    with get_conn(db_path) as conn:
        _group_or_404(conn, group_id)
        _schedule_or_404(conn, schedule_id)
        conn.execute(
            """INSERT INTO group_schedules (group_id, schedule_id, priority, updated_at)
                    VALUES (?,?,?,?)
                    ON CONFLICT(group_id, schedule_id) DO UPDATE SET
                        priority = excluded.priority,
                        updated_at = excluded.updated_at""",
            (group_id, schedule_id, priority, now),
        )


def unassign_schedule(group_id: str, schedule_id: str, db_path: str | None = None) -> None:
    db_path = db_path or DEFAULT_DB_PATH
    with get_conn(db_path) as conn:
        _group_or_404(conn, group_id)
        cur = conn.execute(
            "DELETE FROM group_schedules WHERE group_id = ? AND schedule_id = ?",
            (group_id, schedule_id),
        )
        if cur.rowcount == 0:
            raise NotFound(f"schedule {schedule_id!r} not assigned to group {group_id!r}")


def schedules_for_device(device_id: str, db_path: str | None = None) -> list[dict[str, Any]]:
    db_path = db_path or DEFAULT_DB_PATH
    """Every schedule currently assigned to any group that contains
    ``device_id``, ordered by priority descending (winner first).

    Used by the Phase 4 scheduler to answer "what should this relay be
    doing right now?".  Ships in Phase 1 because it's the join query
    that validates the whole schema shape.
    """
    with get_conn(db_path) as conn:
        rows = conn.execute(
            """SELECT s.*, gs.priority, gs.updated_at AS assigned_at, gm.group_id
                 FROM group_members gm
                 JOIN group_schedules gs ON gs.group_id = gm.group_id
                 JOIN schedules s ON s.id = gs.schedule_id
                WHERE gm.device_id = ? AND s.enabled = 1
                ORDER BY gs.priority DESC, gs.updated_at DESC""",
            (device_id,),
        ).fetchall()
    return [_schedule_row(r) for r in rows]


# ---------------------------------------------------------------------------
# Validation helpers -- called at the boundary; DB constraints are the
# final line of defence.
# ---------------------------------------------------------------------------
def _validate_name(name: Any) -> None:
    if not isinstance(name, str) or not name.strip():
        raise BadInput("name must be a non-empty string")
    if len(name) > 64:
        raise BadInput("name too long (max 64 chars)")


def _validate_color(color: Any) -> None:
    if (
        not isinstance(color, str)
        or len(color) != 7
        or not color.startswith("#")
    ):
        raise BadInput("color must be #RRGGBB")
    try:
        int(color[1:], 16)
    except ValueError as e:
        raise BadInput("color must be #RRGGBB (hex)") from e


def _validate_device_id(device_id: Any) -> None:
    """Accept the canonical `<Type>/<scu>/<addr>/<sub>` string form."""
    if not isinstance(device_id, str) or device_id.count("/") != 3:
        raise BadInput("device_id must be '<Type>/<scu>/<addr>/<sub>'")
