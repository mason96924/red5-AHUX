"""Generate realistic sample DXFs for testing the /floor page.

Two files are produced:

* ``warehouse-20x12.dxf`` -- the original small demo (20 m × 12 m).
* ``office-40x25.dxf``   -- a fuller 40 m × 25 m office floor with
                            partitioned rooms, a corridor, meeting
                            rooms, a kitchen, and structural columns.
                            Sized so the default 4 m beam-radius
                            fixture reads as "a normal ceiling light"
                            rather than a wash-out.

Units are millimetres (INSUNITS=4) — the AutoCAD arch convention.  Run::

    python scripts/make_sample_dxf.py

and the two files drop under ``demo/samples/``.
"""
from __future__ import annotations

from pathlib import Path

import ezdxf


# ---------------------------------------------------------------------------
# Helpers -- keep the room-drawing calls terse and readable.
# ---------------------------------------------------------------------------
def _wall(msp, x0, y0, x1, y1, thickness: int = 0):
    """Straight interior/exterior wall as a single line.  Thickness is
    ignored here (schematic drawing) but kept in the API so we could
    later switch to double-line walls without changing callers."""
    msp.add_line((x0, y0), (x1, y1))


def _wall_with_door(msp, x0, y0, x1, y1, door_at: float, door_w: int = 900):
    """Draw a wall along the (x0,y0)→(x1,y1) segment with a rectangular
    opening centred at ``door_at`` metres from the (x0,y0) end.  The
    opening is ``door_w`` mm wide.  Supports axis-aligned walls only."""
    if x0 == x1:  # vertical
        y_lo, y_hi = sorted([y0, y1])
        d = y_lo + door_at * 1000
        msp.add_line((x0, y_lo), (x0, d - door_w / 2))
        msp.add_line((x0, d + door_w / 2), (x0, y_hi))
    else:  # horizontal
        x_lo, x_hi = sorted([x0, x1])
        d = x_lo + door_at * 1000
        msp.add_line((x_lo, y0), (d - door_w / 2, y0))
        msp.add_line((d + door_w / 2, y0), (x_hi, y0))


def _label(msp, text: str, x: int, y: int, height: int = 350):
    msp.add_text(text, dxfattribs={"height": height, "insert": (x, y)})


def _column(msp, cx: int, cy: int, size: int = 400):
    """Filled-looking column marker (square outline)."""
    h = size // 2
    msp.add_lwpolyline(
        [(cx - h, cy - h), (cx + h, cy - h), (cx + h, cy + h), (cx - h, cy + h)],
        close=True,
    )


def _windows(msp, x0: int, y: int, count: int, w: int = 2000, gap: int = 500):
    """Draw ``count`` window openings (double parallel lines) starting
    at ``x0`` along the horizontal line at height ``y``.  Each window
    is ``w`` mm wide with ``gap`` mm between."""
    for i in range(count):
        x = x0 + i * (w + gap)
        msp.add_line((x, y - 60), (x + w, y - 60))
        msp.add_line((x, y + 60), (x + w, y + 60))


# ---------------------------------------------------------------------------
# 1) Small warehouse (original) -- kept for regression tests.
# ---------------------------------------------------------------------------
def build_warehouse() -> ezdxf.document.Drawing:
    W, H = 20_000, 12_000
    doc = ezdxf.new(setup=True)
    doc.header["$INSUNITS"] = 4
    msp = doc.modelspace()

    # exterior with a 2m south door
    _wall_with_door(msp, 0, 0, W, 0, door_at=10, door_w=2000)
    _wall(msp, W, 0, W, H)
    _wall(msp, W, H, 0, H)
    _wall(msp, 0, H, 0, 0)

    # partition + door
    _wall_with_door(msp, 10_000, 0, 10_000, H, door_at=5)

    # windows
    for x0 in (4_000, 12_000):
        msp.add_line((x0, H - 100), (x0 + 1_500, H - 100))
        msp.add_line((x0, H - 300), (x0 + 1_500, H - 300))

    for cx in (6_500, 15_000):
        _column(msp, cx, 6_000)

    _label(msp, "WAREHOUSE  20 x 12 m", 500, H - 800, height=500)
    return doc


# ---------------------------------------------------------------------------
# 2) Office floor -- realistic partitioned layout.
# ---------------------------------------------------------------------------
#
# Coordinate system: (0,0) at south-west, X → east, Y → north.  All
# dimensions in mm.  Building envelope: 40 m × 25 m.
#
# Room layout (approx, all rooms edge-to-edge, corridor down the middle):
#
#  Y=25000  ┌──────────┬──────────┬──────────┬──────────┬──────────┐
#           │  Office  │  Office  │  Office  │  Office  │ Kitchen  │
#           │    1     │    2     │    3     │    4     │  & Cafe  │
#  Y=17000  ├────d─────┴────d─────┴────d─────┴────d─────┴──────d───┤
#           │                                                        │
#           │                   Corridor  (Y=15000..17000)           │
#           │                                                        │
#  Y=15000  ├───────────────────────d──────────────────────d────────┤
#           │                                    │                   │
#           │                                    │   Meeting Rm A    │
#           │        Open Workspace              │                   │
#           │        (cubicles / desks)          │                   │
#           │                                    ├───d───────────────┤
#           │                                    │                   │
#           │                                    │   Meeting Rm B    │
#           │                                    │                   │
#  Y=0      └──────────────────d─────────────────┴───────────────────┘
#          X=0                                  X=27000            X=40000
#
def build_office() -> ezdxf.document.Drawing:
    W, H = 40_000, 25_000
    doc = ezdxf.new(setup=True)
    doc.header["$INSUNITS"] = 4
    msp = doc.modelspace()

    # ---- exterior envelope ------------------------------------------------
    # Main south door at x=20m (double-door 1.8m wide).
    _wall_with_door(msp, 0, 0, W, 0, door_at=20, door_w=1800)
    _wall(msp, W, 0, W, H)         # east
    _wall(msp, W, H, 0, H)         # north
    _wall(msp, 0, H, 0, 0)         # west

    # ---- private offices (5 across the north side) ------------------------
    # North strip is 8 m deep (y = 17000..25000).  Split into 5 rooms:
    #   Office 1: x=0..7000     (7 m wide)
    #   Office 2: x=7000..14000
    #   Office 3: x=14000..21000
    #   Office 4: x=21000..28000
    #   Kitchen:  x=28000..40000 (12 m wide -- big kitchen/cafe)
    # South wall of the strip has a door into every room.
    OFFICE_Y = 17_000
    _wall_with_door(msp, 0, OFFICE_Y, 7_000, OFFICE_Y, door_at=3.5)
    _wall_with_door(msp, 7_000, OFFICE_Y, 14_000, OFFICE_Y, door_at=3.5)
    _wall_with_door(msp, 14_000, OFFICE_Y, 21_000, OFFICE_Y, door_at=3.5)
    _wall_with_door(msp, 21_000, OFFICE_Y, 28_000, OFFICE_Y, door_at=3.5)
    _wall_with_door(msp, 28_000, OFFICE_Y, 40_000, OFFICE_Y, door_at=6)
    # inter-room partitions
    for x in (7_000, 14_000, 21_000, 28_000):
        _wall(msp, x, OFFICE_Y, x, H)
    # room labels
    _label(msp, "OFFICE 1", 1_800, 21_000)
    _label(msp, "OFFICE 2", 8_800, 21_000)
    _label(msp, "OFFICE 3", 15_800, 21_000)
    _label(msp, "OFFICE 4", 22_800, 21_000)
    _label(msp, "KITCHEN & CAFE", 30_800, 21_000)

    # ---- corridor south wall (Y=15000) ------------------------------------
    # Two doors: one into the open workspace, one into the meeting-room area.
    _wall_with_door(msp, 0, 15_000, 27_000, 15_000, door_at=10)
    _wall_with_door(msp, 27_000, 15_000, 40_000, 15_000, door_at=6)
    _label(msp, "CORRIDOR", 1_000, 15_800)

    # ---- meeting-room block (east side, x=27000..40000) -------------------
    # Wall separating open workspace from meeting rooms.
    _wall(msp, 27_000, 0, 27_000, 15_000)
    # Split into Meeting Rm A (upper) and B (lower).
    _wall_with_door(msp, 27_000, 8_000, 40_000, 8_000, door_at=6.5)
    # Door from the corridor door into Meeting Rm A -- already handled above.
    # Door from the corridor to Meeting Rm B via a wall break:
    _wall_with_door(msp, 27_000, 4_000, 27_000, 8_000, door_at=2)   # vertical door into B
    _label(msp, "MEETING ROOM A", 30_000, 11_000)
    _label(msp, "MEETING ROOM B", 30_000, 4_000)

    # ---- open workspace label --------------------------------------------
    _label(msp, "OPEN WORKSPACE", 10_000, 7_000)

    # ---- structural columns (6 m grid) ------------------------------------
    for x in (6_000, 12_000, 18_000, 24_000):
        for y in (5_000, 11_000):
            _column(msp, x, y)

    # ---- windows on the north/south/east elevations ----------------------
    # North: 8 windows across the exterior (skipping the label areas).
    for i in range(6):
        x = 1_500 + i * 6_000
        msp.add_line((x, H - 60), (x + 3_000, H - 60))
        msp.add_line((x, H + 60), (x + 3_000, H + 60))
    # South (open workspace): 4 windows.
    for i in range(4):
        x = 3_000 + i * 5_000
        msp.add_line((x, -60), (x + 2_500, -60))
        msp.add_line((x, 60), (x + 2_500, 60))
    # East: 2 windows (one per meeting room).
    for y in (3_500, 10_500):
        msp.add_line((W - 60, y), (W - 60, y + 2_500))
        msp.add_line((W + 60, y), (W + 60, y + 2_500))

    # ---- title block ------------------------------------------------------
    _label(msp, "OFFICE FLOOR PLAN  40 x 25 m", 400, H + 400, height=600)

    return doc


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------
_TARGETS = {
    "warehouse-20x12.dxf": build_warehouse,
    "office-40x25.dxf": build_office,
}


def main() -> None:
    out = Path(__file__).resolve().parent.parent / "demo" / "samples"
    out.mkdir(parents=True, exist_ok=True)
    for name, builder in _TARGETS.items():
        dst = out / name
        builder().saveas(dst)
        print(f"wrote {dst}")


if __name__ == "__main__":
    main()
