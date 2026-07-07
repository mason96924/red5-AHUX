"""
elc.floors.lighting
===================
Per-device lighting-element assignments -- the "assign type" leg of
the workflow.

Model:
    A SRM device becomes a *lighting element* the moment the operator
    designates it (via the ``PUT`` / ``bulk-assign`` endpoints).  The
    row stores everything a renderer needs to draw the beam:

        device_id  →  { type, max_lux, beam_radius_m, cct_k, updated_at }

    Absent row = "unassigned" (grey tile in the UI).  Placement on a
    floor is a separate concept (:mod:`elc.floors.store`) that only
    records ``{device_id, x_m, y_m}``; the beam geometry is looked up
    here at render time.

Design notes:
    * Kept independent of any specific floor because the *type* of a
      lighting element is a physical property of the fixture wired to
      that SCU relay -- it doesn't change if you move it to a
      different floor plan.
    * `bulk_assign` is a single-transaction batch so an interrupted
      request can't leave half the selection assigned.
    * No cross-table foreign keys against the replica: the replica is
      an in-memory view of hardware state (it comes and goes).  A
      lighting element is a *plan*, kept in SQLite.
"""
from __future__ import annotations

from typing import Any

from elc.config.store import BadInput, NotFound, _now, get_conn

_TYPES = {"onoff", "dimmer_0_10v"}
# ``line`` (single linear source), ``regular_polygon`` (circle /
# rectangle / N-sided) are the Phase 6.1e re-org.  The legacy
# ``stick`` / ``strip`` / ``ring`` values are kept as valid inputs so
# older placements still round-trip -- the frontend now presents them
# under the consolidated dropdown ("Line" for stick+strip, "Regular
# polygon / Circle" for ring).
_SHAPES = {"point", "line", "polyline", "regular_polygon",
           "stick", "strip", "ring"}
_POLYGON_KINDS = {"circle", "rectangle", "polygon"}


def _row_to_element(row: Any) -> dict[str, Any]:
    return {
        "device_id": row["device_id"],
        "type": row["type"],
        "max_lux": row["max_lux"],
        "beam_radius_m": row["beam_radius_m"],
        "cct_k": row["cct_k"],
        "shape": row["shape"] if "shape" in row.keys() else "point",
        "updated_at": row["updated_at"],
    }


def _validate_type(t: str) -> str:
    if t not in _TYPES:
        raise BadInput(f"type must be one of {sorted(_TYPES)}, got {t!r}")
    return t


def _validate_shape(s: str) -> str:
    if s not in _SHAPES:
        raise BadInput(f"shape must be one of {sorted(_SHAPES)}, got {s!r}")
    return s


def list_elements(db_path: str | None = None) -> list[dict[str, Any]]:
    """Return every assigned lighting element, ordered by device_id."""
    with get_conn(db_path) as conn:
        rows = conn.execute(
            "SELECT device_id, type, max_lux, beam_radius_m, cct_k, shape, "
            "updated_at FROM lighting_elements ORDER BY device_id"
        ).fetchall()
    return [_row_to_element(r) for r in rows]


def get_element(
    device_id: str, db_path: str | None = None,
) -> dict[str, Any]:
    with get_conn(db_path) as conn:
        row = conn.execute(
            "SELECT device_id, type, max_lux, beam_radius_m, cct_k, shape, "
            "updated_at FROM lighting_elements WHERE device_id = ?",
            (device_id,),
        ).fetchone()
    if row is None:
        raise NotFound(f"lighting element {device_id!r} not assigned")
    return _row_to_element(row)


def upsert_element(
    device_id: str,
    *,
    type: str,
    max_lux: float = 500.0,
    beam_radius_m: float = 4.0,
    cct_k: int = 4000,
    shape: str = "point",
    db_path: str | None = None,
) -> dict[str, Any]:
    """Assign or update the lighting-element config for a single device."""
    device_id = str(device_id).strip()
    if not device_id:
        raise BadInput("device_id is required")
    _validate_type(type)
    _validate_shape(shape)
    max_lux = float(max_lux)
    beam_radius_m = float(beam_radius_m)
    cct_k = int(cct_k)
    if max_lux < 0 or beam_radius_m <= 0:
        raise BadInput("max_lux must be >= 0 and beam_radius_m > 0")
    if cct_k < 1000 or cct_k > 10000:
        raise BadInput("cct_k must be in [1000, 10000] K")
    now = _now()
    with get_conn(db_path) as conn:
        conn.execute(
            """INSERT INTO lighting_elements
               (device_id, type, max_lux, beam_radius_m, cct_k, shape, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?)
               ON CONFLICT (device_id) DO UPDATE SET
                 type = excluded.type,
                 max_lux = excluded.max_lux,
                 beam_radius_m = excluded.beam_radius_m,
                 cct_k = excluded.cct_k,
                 shape = excluded.shape,
                 updated_at = excluded.updated_at""",
            (device_id, type, max_lux, beam_radius_m, cct_k, shape, now),
        )
    return get_element(device_id, db_path=db_path)


def bulk_assign(
    device_ids: list[str],
    *,
    type: str,
    db_path: str | None = None,
) -> list[dict[str, Any]]:
    """Assign the same type (with default lux/beam/cct) to many devices
    in one transaction.  Existing rows are updated -- max_lux et al
    are NOT overwritten so a previously-tuned fixture keeps its
    values when re-typed."""
    if not isinstance(device_ids, list) or not device_ids:
        raise BadInput("device_ids must be a non-empty list")
    _validate_type(type)
    now = _now()
    seen: set[str] = set()
    cleaned: list[str] = []
    for did in device_ids:
        did = str(did).strip()
        if not did or did in seen:
            continue
        seen.add(did)
        cleaned.append(did)
    with get_conn(db_path) as conn:
        for did in cleaned:
            conn.execute(
                """INSERT INTO lighting_elements
                   (device_id, type, max_lux, beam_radius_m, cct_k, shape, updated_at)
                   VALUES (?, ?, 500, 4.0, 4000, 'point', ?)
                   ON CONFLICT (device_id) DO UPDATE SET
                     type = excluded.type,
                     updated_at = excluded.updated_at""",
                (did, type, now),
            )
    return [get_element(did, db_path=db_path) for did in cleaned]


def delete_element(device_id: str, db_path: str | None = None) -> None:
    """Un-assign -- SRM goes back to grey/unassigned in the UI.  Also
    removes the device from any floor it's placed on (a lighting
    element that isn't typed can't render, so leaving it placed makes
    no sense)."""
    with get_conn(db_path) as conn:
        cur = conn.execute(
            "DELETE FROM lighting_elements WHERE device_id = ?",
            (device_id,),
        )
        if cur.rowcount == 0:
            raise NotFound(f"lighting element {device_id!r} not assigned")
        # Cascade: strip this device from every floor's fixtures_json.
        # Kept in the same transaction so the operator can never see
        # a "phantom" fixture referencing a deleted lighting element.
        import json
        rows = conn.execute("SELECT id, fixtures_json FROM floors").fetchall()
        for row in rows:
            fixtures = json.loads(row["fixtures_json"])
            new = [f for f in fixtures if f.get("device_id") != device_id]
            if len(new) != len(fixtures):
                conn.execute(
                    "UPDATE floors SET fixtures_json = ?, updated_at = ? WHERE id = ?",
                    (json.dumps(new), _now(), row["id"]),
                )


__all__ = [
    "bulk_assign", "delete_element", "get_element",
    "list_elements", "upsert_element",
]
