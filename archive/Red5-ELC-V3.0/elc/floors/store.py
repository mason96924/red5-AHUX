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

_MAX_SVG_BYTES = 5 * 1024 * 1024  # 5 MB — flip to filesystem past this


def _row_to_floor(row: Any) -> dict[str, Any]:
    return {
        "id": row["id"],
        "name": row["name"],
        "strand_label": row["strand_label"] if "strand_label" in row.keys() else None,
        "svg": row["svg"],
        "width_m": row["width_m"],
        "height_m": row["height_m"],
        "fixtures": json.loads(row["fixtures_json"]),
        "rooms": json.loads(row["rooms_json"] or "[]"),
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
    }


def _validate_fixture(f: dict[str, Any]) -> dict[str, Any]:
    """Coerce and validate a single fixture (placement) dict.

    Post-Phase-6.1b the fixture record is *placement-only* --
    ``{id, device_id, x_m, y_m}``.  Lighting type + config live in
    the shared ``lighting_elements`` table and are looked up at
    render time.  Legacy records that carry ``type`` / ``max_lux``
    etc. are still accepted for read-side backward compatibility;
    the extra fields are dropped on the way in.

    Phase 6.1d — placements can carry shape-specific geometry that
    the operator drew when placing the fixture:

    * ``angle_deg`` — orientation for ``stick`` / ``strip`` shapes
      (degrees, 0 = +X, 90 = +Y).
    * ``length_m``  — total length for ``stick`` / ``strip``.
    * ``radius_m``  — radius of a ``ring`` fixture (LED loop).
    * ``vertices``  — ordered [[x_m, y_m], ...] for ``polyline``
      shapes (LED strip forming a custom outline).

    Only geometry fields that pass validation are stored; missing
    fields default to ``None`` and the renderer falls back to
    point-source math.  This lets the same fixture record round-
    trip through the API even if the lighting element's ``shape``
    changes.
    """
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
    out: dict[str, Any] = {
        "id": fid, "device_id": device_id, "x_m": x_m, "y_m": y_m,
    }
    # Optional shape-specific geometry ---------------------------------
    if "angle_deg" in f and f["angle_deg"] is not None:
        try:
            out["angle_deg"] = float(f["angle_deg"])
        except (TypeError, ValueError) as e:
            raise BadInput("fixture.angle_deg must be a number") from e
    if "length_m" in f and f["length_m"] is not None:
        try:
            length_m = float(f["length_m"])
        except (TypeError, ValueError) as e:
            raise BadInput("fixture.length_m must be a number") from e
        if length_m <= 0:
            raise BadInput("fixture.length_m must be > 0")
        out["length_m"] = length_m
    if "radius_m" in f and f["radius_m"] is not None:
        try:
            radius_m = float(f["radius_m"])
        except (TypeError, ValueError) as e:
            raise BadInput("fixture.radius_m must be a number") from e
        if radius_m <= 0:
            raise BadInput("fixture.radius_m must be > 0")
        out["radius_m"] = radius_m
    if "vertices" in f and f["vertices"] is not None:
        verts_raw = f["vertices"]
        if not isinstance(verts_raw, list) or len(verts_raw) < 2:
            raise BadInput("fixture.vertices must be a list of >= 2 [x, y] pairs")
        verts: list[list[float]] = []
        for v in verts_raw:
            if not isinstance(v, (list, tuple)) or len(v) != 2:
                raise BadInput("each fixture vertex must be [x_m, y_m]")
            try:
                verts.append([float(v[0]), float(v[1])])
            except (TypeError, ValueError) as e:
                raise BadInput("fixture vertex coords must be numbers") from e
        out["vertices"] = verts
    # Phase 6.1e — regular polygon geometry ---------------------------
    # polygon_kind selects between the "circle" (existing ring
    # semantics), "rectangle" (axis-aligned box of width_m x
    # height_m), and "polygon" (regular N-sided polygon inscribed in
    # a circle of radius_m, rotated by angle_deg).  Only stored if
    # non-null; the frontend uses shape='regular_polygon' + this
    # field to dispatch rendering.
    if "polygon_kind" in f and f["polygon_kind"] is not None:
        pk = str(f["polygon_kind"]).strip().lower()
        if pk not in {"circle", "rectangle", "polygon"}:
            raise BadInput(
                "fixture.polygon_kind must be one of "
                "['circle', 'rectangle', 'polygon']"
            )
        out["polygon_kind"] = pk
    if "width_m" in f and f["width_m"] is not None:
        try:
            width_m = float(f["width_m"])
        except (TypeError, ValueError) as e:
            raise BadInput("fixture.width_m must be a number") from e
        if width_m <= 0:
            raise BadInput("fixture.width_m must be > 0")
        out["width_m"] = width_m
    if "height_m" in f and f["height_m"] is not None:
        try:
            height_m = float(f["height_m"])
        except (TypeError, ValueError) as e:
            raise BadInput("fixture.height_m must be a number") from e
        if height_m <= 0:
            raise BadInput("fixture.height_m must be > 0")
        out["height_m"] = height_m
    if "sides" in f and f["sides"] is not None:
        try:
            sides = int(f["sides"])
        except (TypeError, ValueError) as e:
            raise BadInput("fixture.sides must be an integer") from e
        if sides < 3 or sides > 24:
            raise BadInput("fixture.sides must be in [3, 24]")
        out["sides"] = sides
    return out


def _validate_fixtures(fixtures: Any) -> list[dict[str, Any]]:
    if fixtures is None:
        return []
    if not isinstance(fixtures, list):
        raise BadInput("fixtures must be a list")
    out = [_validate_fixture(f) for f in fixtures]
    ids = {f["id"] for f in out}
    if len(ids) != len(out):
        raise BadInput("duplicate fixture id in list")
    device_ids = [f["device_id"] for f in out]
    if len(set(device_ids)) != len(device_ids):
        raise BadInput("same device placed twice on this floor")
    return out


def _check_device_uniqueness(
    fixtures: list[dict[str, Any]],
    *,
    exclude_floor_id: str | None = None,
    db_path: str | None = None,
) -> None:
    """1:1 placement guard -- a device can only sit on one floor.

    Called on create + update.  Raises :class:`Conflict` if any of
    ``fixtures``' device_ids is already on a different floor.
    """
    if not fixtures:
        return
    devs = {f["device_id"] for f in fixtures}
    with get_conn(db_path) as conn:
        rows = conn.execute(
            "SELECT id, name, fixtures_json FROM floors "
            + ("WHERE id != ?" if exclude_floor_id else ""),
            (exclude_floor_id,) if exclude_floor_id else (),
        ).fetchall()
    for row in rows:
        other = json.loads(row["fixtures_json"])
        clash = {f.get("device_id") for f in other} & devs
        if clash:
            example = next(iter(clash))
            raise Conflict(
                f"device {example!r} is already placed on floor {row['name']!r}",
            )


_ROOM_TYPES = {
    "office", "corridor", "meeting", "warehouse", "kitchen",
    "bathroom", "storage", "workspace", "other",
}
# Compliance thresholds -- minimum lux at floor level (EN 12464-1 rounded
# to operator-friendly numbers).  Used by :func:`_infer_room_type` /
# ``_default_min_lux`` on both backend and frontend; keep in sync with
# demo/floor.html.
_ROOM_MIN_LUX_DEFAULTS: dict[str, int] = {
    "office":     300,
    "corridor":   100,
    "meeting":    300,
    "warehouse":  200,
    "kitchen":    300,
    "bathroom":   200,
    "storage":    100,
    "workspace":  300,
    "other":      200,
}


def _infer_room_type(name: str) -> str:
    """Guess a room type from its DXF XDATA name -- used only when the
    operator hasn't set one explicitly.  Substring match on lower-cased
    name; falls through to ``other`` for anything unrecognised."""
    n = (name or "").lower()
    if "office" in n:                          return "office"
    if "corridor" in n or "hall" in n:         return "corridor"
    if "meeting" in n or "conference" in n:    return "meeting"
    if "warehouse" in n or "storage" in n or "stock" in n: return "warehouse"
    if "kitchen" in n or "cafe" in n or "pantry" in n:     return "kitchen"
    if "bath" in n or "toilet" in n or "wc" in n or "restroom" in n:
        return "bathroom"
    if "workspace" in n or "open" in n or "desk" in n:     return "workspace"
    return "other"


def _validate_rooms(rooms: Any) -> list[dict[str, Any]]:
    """Room polygons used for canvas light clipping (Phase 6.1c) and
    compliance heatmap colouring (Phase 6.1d).

    Shape::

        [{"id": "OFF-1",
          "name": "Office 1",
          "type": "office",           # optional -- inferred from name
          "min_lux": 300,             # optional -- inferred from type
          "vertices": [[x_m, y_m], ...]},
         ...]

    ``id`` / ``name`` / ``type`` / ``min_lux`` are optional; when
    absent, ``type`` is inferred from ``name`` (see
    :func:`_infer_room_type`) and ``min_lux`` from the type default
    table (see ``_ROOM_MIN_LUX_DEFAULTS``).  ``vertices`` must be a
    list of at least 3 [x, y] pairs (metres).
    """
    if rooms is None:
        return []
    if not isinstance(rooms, list):
        raise BadInput("rooms must be a list")
    out: list[dict[str, Any]] = []
    for r in rooms:
        if not isinstance(r, dict):
            raise BadInput("room must be an object")
        verts_raw = r.get("vertices")
        if not isinstance(verts_raw, list) or len(verts_raw) < 3:
            raise BadInput("room.vertices must be a list of >= 3 [x, y] pairs")
        verts: list[list[float]] = []
        for v in verts_raw:
            if not isinstance(v, (list, tuple)) or len(v) != 2:
                raise BadInput("each vertex must be [x_m, y_m]")
            try:
                verts.append([float(v[0]), float(v[1])])
            except (TypeError, ValueError) as e:
                raise BadInput("vertex coords must be numbers") from e
        name = str(r.get("name", ""))
        rtype = str(r.get("type") or "").strip().lower() or _infer_room_type(name)
        if rtype not in _ROOM_TYPES:
            raise BadInput(
                f"room.type must be one of {sorted(_ROOM_TYPES)}, got {rtype!r}"
            )
        min_lux_raw = r.get("min_lux")
        if min_lux_raw is None:
            min_lux = _ROOM_MIN_LUX_DEFAULTS[rtype]
        else:
            try:
                min_lux = int(min_lux_raw)
            except (TypeError, ValueError) as e:
                raise BadInput("room.min_lux must be an integer") from e
            if min_lux < 0:
                raise BadInput("room.min_lux must be >= 0")
        out.append({
            "id": str(r.get("id", "")),
            "name": name,
            "type": rtype,
            "min_lux": min_lux,
            "vertices": verts,
        })
    return out


def list_floors(db_path: str | None = None) -> list[dict[str, Any]]:
    """Return every floor (with fixtures, without the SVG blob -- that
    is served from a dedicated ``/floors/{id}/background.svg`` route
    to keep the listing response small)."""
    with get_conn(db_path) as conn:
        rows = conn.execute(
            "SELECT id, name, strand_label, '' AS svg, width_m, height_m, "
            "fixtures_json, rooms_json, created_at, updated_at "
            "FROM floors ORDER BY name"
        ).fetchall()
    return [_row_to_floor(r) for r in rows]


def get_floor(
    floor_id: str, *, include_svg: bool = True, db_path: str | None = None,
) -> dict[str, Any]:
    with get_conn(db_path) as conn:
        cols = ("id, name, strand_label, svg, width_m, height_m, "
                "fixtures_json, rooms_json, created_at, updated_at")
        if not include_svg:
            cols = ("id, name, strand_label, '' AS svg, width_m, height_m, "
                    "fixtures_json, rooms_json, created_at, updated_at")
        row = conn.execute(
            f"SELECT {cols} FROM floors WHERE id = ?", (floor_id,),
        ).fetchone()
    if row is None:
        raise NotFound(f"floor {floor_id!r} not found")
    return _row_to_floor(row)


def get_or_create_floor_by_strand(
    strand_label: str,
    *,
    default_name: str | None = None,
    db_path: str | None = None,
) -> dict[str, Any]:
    """Fetch the floor whose ``strand_label`` matches (case-insensitive
    after upper-casing), or create it if absent.  Used by the
    ``/api/elc/project`` save handler so every strand label the
    operator types in Settings materialises as a real floor row that
    the Building page can render.

    ``default_name`` seeds the operator-editable display name only on
    initial create; if the row already exists, its ``name`` is left
    untouched (Settings drives identity, but the operator owns the
    display label).
    """
    label = str(strand_label or "").strip().upper()
    if not label:
        raise BadInput("strand_label required")
    with get_conn(db_path) as conn:
        row = conn.execute(
            "SELECT id, name, strand_label, svg, width_m, height_m, "
            "fixtures_json, rooms_json, created_at, updated_at "
            "FROM floors WHERE strand_label = ?", (label,),
        ).fetchone()
        if row is not None:
            return _row_to_floor(row)
        # Create -- pick a display name that doesn't clash with the
        # UNIQUE(name) index.  ``strand_label`` is the identity; the
        # name is just a label the operator can change later.
        base = default_name or label
        name = base
        suffix = 2
        while conn.execute(
            "SELECT 1 FROM floors WHERE name = ?", (name,)
        ).fetchone() is not None:
            name = f"{base} ({suffix})"
            suffix += 1
        fid = _new_id()
        now = _now()
        conn.execute(
            "INSERT INTO floors "
            "(id, name, strand_label, svg, width_m, height_m, "
            "fixtures_json, rooms_json, created_at, updated_at) "
            "VALUES (?, ?, ?, '', 20.0, 15.0, '[]', '[]', ?, ?)",
            (fid, name, label, now, now),
        )
    return get_floor(fid, include_svg=False, db_path=db_path)


def create_floor(
    name: str,
    *,
    svg: str = "",
    width_m: float = 20.0,
    height_m: float = 15.0,
    fixtures: list[dict[str, Any]] | None = None,
    rooms: list[dict[str, Any]] | None = None,
    strand_label: str | None = None,
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
    rooms_norm = _validate_rooms(rooms)
    _check_device_uniqueness(fixtures_norm, db_path=db_path)
    label = str(strand_label or "").strip().upper() or None
    fid = _new_id()
    now = _now()
    try:
        with get_conn(db_path) as conn:
            conn.execute(
                "INSERT INTO floors "
                "(id, name, strand_label, svg, width_m, height_m, fixtures_json, "
                "rooms_json, created_at, updated_at) "
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (fid, name, label, svg, width_m, height_m,
                 json.dumps(fixtures_norm), json.dumps(rooms_norm),
                 now, now),
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
    rooms: list[dict[str, Any]] | None = None,
    strand_label: str | None = None,
    db_path: str | None = None,
) -> dict[str, Any]:
    """Partial-update — only fields provided are touched.  Passing
    ``fixtures=[]`` clears the list; passing ``fixtures=None`` leaves
    it untouched.  Same semantics for ``rooms``."""
    sets: list[str] = []
    args: list[Any] = []
    if name is not None:
        n = str(name).strip()
        if not n:
            raise BadInput("name cannot be empty")
        sets.append("name = ?")
        args.append(n)
    if strand_label is not None:
        label = str(strand_label).strip().upper()
        if not label:
            raise BadInput("strand_label cannot be empty")
        sets.append("strand_label = ?")
        args.append(label)
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
        norm = _validate_fixtures(fixtures)
        _check_device_uniqueness(norm, exclude_floor_id=floor_id, db_path=db_path)
        sets.append("fixtures_json = ?")
        args.append(json.dumps(norm))
    if rooms is not None:
        rooms_norm = _validate_rooms(rooms)
        sets.append("rooms_json = ?")
        args.append(json.dumps(rooms_norm))
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
    "create_floor", "delete_floor", "get_floor",
    "get_or_create_floor_by_strand", "list_floors", "update_floor",
]
