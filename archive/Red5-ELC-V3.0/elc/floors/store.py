"""
elc.floors.store
================
CRUD for the ``floors`` table.  Piggy-backs on the config store's
SQLite connection helper (:func:`elc.config.store.get_conn`) so
floors live in the same DB as groups, schedules, and settings.

Data model (see :mod:`elc.config.store._SCHEMA`)::

    floors(
        id             TEXT PRIMARY KEY,
        name           TEXT NOT NULL UNIQUE,
        svg            TEXT NOT NULL,       -- background image (SVG)
        width_m        REAL NOT NULL,       -- physical size in metres
        height_m       REAL NOT NULL,
        fixtures_json  TEXT NOT NULL,       -- JSON list of Fixture dicts
        created_at     TEXT NOT NULL,       -- ISO8601 UTC
        updated_at     TEXT NOT NULL
    )

A **fixture** is a dict of::

    {
      "id":            "L-001",                  # UI-local id (author's choice)
      "device_id":     "SRM/1/10/0",             # links to replica state
      "x_m":           4.2,                       # metres from left edge
      "y_m":           3.1,                       # metres from top edge
      "type":          "onoff" | "dimmer_0_10v",
      "max_lux":       500,                       # scalar, additive at overlap
      "beam_radius_m": 5.0,                       # visual falloff radius
      "cct_k":         4000                       # optional colour temp
    }

Validation is intentionally light -- rendering is defensive; anything
we can't render just doesn't paint.
"""
from __future__ import annotations

import json
from typing import Any

from elc.config.store import BadInput, Conflict, NotFound, _new_id, _now, get_conn

_FIXTURE_TYPES = {"onoff", "dimmer_0_10v"}
_MAX_SVG_BYTES = 5 * 1024 * 1024  # 5 MB — flip to filesystem past this


def _row_to_floor(row: Any) -> dict[str, Any]:
    return {
        "id": row["id"],
        "name": row["name"],
        "svg": row["svg"],
        "width_m": row["width_m"],
        "height_m": row["height_m"],
        "fixtures": json.loads(row["fixtures_json"]),
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
    }


def _validate_fixture(f: dict[str, Any]) -> dict[str, Any]:
    """Coerce and validate a single fixture dict.  Returns the
    normalised form (fills defaults, drops unknown keys) or raises
    :class:`BadInput`."""
    if not isinstance(f, dict):
        raise BadInput("fixture must be an object")
    try:
        fid = str(f["id"]).strip()
        device_id = str(f["device_id"]).strip()
        x_m = float(f["x_m"])
        y_m = float(f["y_m"])
    except (KeyError, TypeError, ValueError) as e:
        raise BadInput(f"fixture missing required field: {e}") from e
    if not fid or not device_id:
        raise BadInput("fixture id and device_id must be non-empty")
    ftype = str(f.get("type", "onoff"))
    if ftype not in _FIXTURE_TYPES:
        raise BadInput(f"fixture type must be one of {_FIXTURE_TYPES}, got {ftype!r}")
    max_lux = float(f.get("max_lux", 500))
    beam_radius_m = float(f.get("beam_radius_m", 4.0))
    cct_k = int(f.get("cct_k", 4000))
    if max_lux < 0 or beam_radius_m <= 0:
        raise BadInput("max_lux must be >= 0 and beam_radius_m > 0")
    return {
        "id": fid,
        "device_id": device_id,
        "x_m": x_m,
        "y_m": y_m,
        "type": ftype,
        "max_lux": max_lux,
        "beam_radius_m": beam_radius_m,
        "cct_k": cct_k,
    }


def _validate_fixtures(fixtures: Any) -> list[dict[str, Any]]:
    if fixtures is None:
        return []
    if not isinstance(fixtures, list):
        raise BadInput("fixtures must be a list")
    out = [_validate_fixture(f) for f in fixtures]
    ids = {f["id"] for f in out}
    if len(ids) != len(out):
        raise BadInput("duplicate fixture id in list")
    return out


def list_floors(db_path: str | None = None) -> list[dict[str, Any]]:
    """Return every floor (with fixtures, without the SVG blob -- that
    is served from a dedicated ``/floors/{id}/background.svg`` route
    to keep the listing response small)."""
    with get_conn(db_path) as conn:
        rows = conn.execute(
            "SELECT id, name, '' AS svg, width_m, height_m, fixtures_json, "
            "created_at, updated_at FROM floors ORDER BY name"
        ).fetchall()
    return [_row_to_floor(r) for r in rows]


def get_floor(
    floor_id: str, *, include_svg: bool = True, db_path: str | None = None,
) -> dict[str, Any]:
    with get_conn(db_path) as conn:
        cols = "id, name, svg, width_m, height_m, fixtures_json, created_at, updated_at"
        if not include_svg:
            cols = ("id, name, '' AS svg, width_m, height_m, fixtures_json, "
                    "created_at, updated_at")
        row = conn.execute(
            f"SELECT {cols} FROM floors WHERE id = ?", (floor_id,),
        ).fetchone()
    if row is None:
        raise NotFound(f"floor {floor_id!r} not found")
    return _row_to_floor(row)


def create_floor(
    name: str,
    *,
    svg: str = "",
    width_m: float = 20.0,
    height_m: float = 15.0,
    fixtures: list[dict[str, Any]] | None = None,
    db_path: str | None = None,
) -> dict[str, Any]:
    name = str(name).strip()
    if not name:
        raise BadInput("name required")
    if width_m <= 0 or height_m <= 0:
        raise BadInput("width_m and height_m must be positive")
    if len(svg.encode("utf-8")) > _MAX_SVG_BYTES:
        raise BadInput(f"svg exceeds {_MAX_SVG_BYTES // 1024} KB cap")
    fixtures_norm = _validate_fixtures(fixtures)
    fid = _new_id()
    now = _now()
    try:
        with get_conn(db_path) as conn:
            conn.execute(
                "INSERT INTO floors "
                "(id, name, svg, width_m, height_m, fixtures_json, created_at, updated_at) "
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (fid, name, svg, width_m, height_m,
                 json.dumps(fixtures_norm), now, now),
            )
    except Exception as e:  # noqa: BLE001
        if "UNIQUE" in str(e).upper():
            raise Conflict(f"floor named {name!r} already exists") from e
        raise
    return get_floor(fid, db_path=db_path)


def update_floor(
    floor_id: str,
    *,
    name: str | None = None,
    svg: str | None = None,
    width_m: float | None = None,
    height_m: float | None = None,
    fixtures: list[dict[str, Any]] | None = None,
    db_path: str | None = None,
) -> dict[str, Any]:
    """Partial-update — only fields provided are touched.  Passing
    ``fixtures=[]`` clears the list; passing ``fixtures=None`` leaves
    it untouched."""
    sets: list[str] = []
    args: list[Any] = []
    if name is not None:
        n = str(name).strip()
        if not n:
            raise BadInput("name cannot be empty")
        sets.append("name = ?")
        args.append(n)
    if svg is not None:
        if len(svg.encode("utf-8")) > _MAX_SVG_BYTES:
            raise BadInput(f"svg exceeds {_MAX_SVG_BYTES // 1024} KB cap")
        sets.append("svg = ?")
        args.append(svg)
    if width_m is not None:
        if width_m <= 0:
            raise BadInput("width_m must be positive")
        sets.append("width_m = ?")
        args.append(float(width_m))
    if height_m is not None:
        if height_m <= 0:
            raise BadInput("height_m must be positive")
        sets.append("height_m = ?")
        args.append(float(height_m))
    if fixtures is not None:
        sets.append("fixtures_json = ?")
        args.append(json.dumps(_validate_fixtures(fixtures)))
    if not sets:
        return get_floor(floor_id, db_path=db_path)
    sets.append("updated_at = ?")
    args.append(_now())
    args.append(floor_id)
    try:
        with get_conn(db_path) as conn:
            cur = conn.execute(
                f"UPDATE floors SET {', '.join(sets)} WHERE id = ?", tuple(args),
            )
            if cur.rowcount == 0:
                raise NotFound(f"floor {floor_id!r} not found")
    except Exception as e:  # noqa: BLE001
        if "UNIQUE" in str(e).upper():
            raise Conflict("another floor already uses that name") from e
        raise
    return get_floor(floor_id, db_path=db_path)


def delete_floor(floor_id: str, db_path: str | None = None) -> None:
    with get_conn(db_path) as conn:
        cur = conn.execute("DELETE FROM floors WHERE id = ?", (floor_id,))
        if cur.rowcount == 0:
            raise NotFound(f"floor {floor_id!r} not found")


__all__ = [
    "create_floor", "delete_floor", "get_floor", "list_floors", "update_floor",
]
