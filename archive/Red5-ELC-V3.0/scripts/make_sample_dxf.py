"""Generate realistic sample DXFs for testing the /floor page.

Two files are produced:

* ``warehouse-20x12.dxf`` -- small demo (20 m × 12 m).
* ``office-40x25.dxf``   -- 40 m × 25 m office floor, drawn in an
                            architectural style: double-line walls
                            (200 mm thick), door swings, furniture,
                            and window frames.

Units are millimetres (INSUNITS=4).  Run::

    python scripts/make_sample_dxf.py

and the two files drop under ``demo/samples/``.
"""
from __future__ import annotations

import math
from pathlib import Path

import ezdxf


# ---------------------------------------------------------------------------
# Wall drawing helpers -- double-line walls give the "architectural plan"
# look without needing hatches (the SVG backend renders them as parallel
# strokes that read as thick walls).
# ---------------------------------------------------------------------------
WALL_T = 200   # mm — nominal partition thickness
EXT_T  = 300   # mm — nominal exterior thickness


def _wall_h(msp, x0, x1, y, *, door_at=None, door_w=900, thick=WALL_T):
    """Horizontal double-line wall from (x0, y) to (x1, y), optional
    door opening centred at ``door_at`` metres from ``x0``."""
    x_lo, x_hi = min(x0, x1), max(x0, x1)
    # face 1 (bottom edge of wall) at y - t/2
    # face 2 (top edge of wall) at y + t/2
    y_a, y_b = y - thick / 2, y + thick / 2
    if door_at is None:
        msp.add_line((x_lo, y_a), (x_hi, y_a))
        msp.add_line((x_lo, y_b), (x_hi, y_b))
    else:
        d = x_lo + door_at * 1000
        msp.add_line((x_lo, y_a), (d - door_w / 2, y_a))
        msp.add_line((x_lo, y_b), (d - door_w / 2, y_b))
        msp.add_line((d + door_w / 2, y_a), (x_hi, y_a))
        msp.add_line((d + door_w / 2, y_b), (x_hi, y_b))
        # jambs (cap the openings)
        msp.add_line((d - door_w / 2, y_a), (d - door_w / 2, y_b))
        msp.add_line((d + door_w / 2, y_a), (d + door_w / 2, y_b))
        # door swing arc (quarter circle from the jamb closest to the
        # room the door leaf lives in — assume it swings "upward").
        msp.add_arc(
            center=(d - door_w / 2, y_b),
            radius=door_w, start_angle=0, end_angle=90,
        )
        # the leaf itself
        msp.add_line(
            (d - door_w / 2, y_b),
            (d - door_w / 2 + door_w, y_b),
        )


def _wall_v(msp, x, y0, y1, *, door_at=None, door_w=900, thick=WALL_T):
    """Vertical double-line wall, mirror of ``_wall_h``."""
    y_lo, y_hi = min(y0, y1), max(y0, y1)
    x_a, x_b = x - thick / 2, x + thick / 2
    if door_at is None:
        msp.add_line((x_a, y_lo), (x_a, y_hi))
        msp.add_line((x_b, y_lo), (x_b, y_hi))
    else:
        d = y_lo + door_at * 1000
        msp.add_line((x_a, y_lo), (x_a, d - door_w / 2))
        msp.add_line((x_b, y_lo), (x_b, d - door_w / 2))
        msp.add_line((x_a, d + door_w / 2), (x_a, y_hi))
        msp.add_line((x_b, d + door_w / 2), (x_b, y_hi))
        msp.add_line((x_a, d - door_w / 2), (x_b, d - door_w / 2))
        msp.add_line((x_a, d + door_w / 2), (x_b, d + door_w / 2))
        msp.add_arc(
            center=(x_b, d - door_w / 2),
            radius=door_w, start_angle=90, end_angle=180,
        )
        msp.add_line(
            (x_b, d - door_w / 2),
            (x_b, d - door_w / 2 + door_w),
        )


def _label(msp, text: str, x: int, y: int, height: int = 350):
    msp.add_text(text, dxfattribs={"height": height, "insert": (x, y)})


def _rect(msp, x0, y0, x1, y1):
    """Outlined rectangle — used for furniture symbols and columns."""
    msp.add_lwpolyline(
        [(x0, y0), (x1, y0), (x1, y1), (x0, y1)], close=True,
    )


def _desk(msp, cx, cy, w=1500, d=800):
    """Standard 1.5 × 0.8 m desk symbol, centred at (cx, cy)."""
    _rect(msp, cx - w / 2, cy - d / 2, cx + w / 2, cy + d / 2)
    # chair — small circle behind the desk (south side).
    msp.add_circle(center=(cx, cy - d / 2 - 300), radius=200)


def _conf_table(msp, cx, cy, w=3000, d=1200, chairs=8):
    """Conference table + chairs (evenly spaced along the long sides)."""
    _rect(msp, cx - w / 2, cy - d / 2, cx + w / 2, cy + d / 2)
    per_side = chairs // 2
    for i in range(per_side):
        x = cx - w / 2 + (i + 0.5) * (w / per_side)
        msp.add_circle(center=(x, cy + d / 2 + 300), radius=200)
        msp.add_circle(center=(x, cy - d / 2 - 300), radius=200)


def _kitchen_counter(msp, x0, y0, x1, y1):
    """L-shaped kitchen counter along the north + east walls of the room."""
    _rect(msp, x0, y1 - 700, x1, y1)                    # north run
    _rect(msp, x1 - 700, y0, x1, y1 - 700)              # east run
    # Sink cutouts (small squares in the counter)
    _rect(msp, x0 + 800, y1 - 550, x0 + 1400, y1 - 150)
    # Range/hob
    _rect(msp, x0 + 2200, y1 - 550, x0 + 2800, y1 - 150)


def _cluster_desks(msp, x0, y0, x1, y1, cols=4, rows=3):
    """Grid of desks inside the open workspace, avoiding the outer walls."""
    margin = 1200
    xs = [x0 + margin + i * (x1 - x0 - 2 * margin) / (cols - 1)
          for i in range(cols)]
    ys = [y0 + margin + j * (y1 - y0 - 2 * margin) / (rows - 1)
          for j in range(rows)]
    for x in xs:
        for y in ys:
            _desk(msp, x, y)


def _column(msp, cx: int, cy: int, size: int = 500):
    """Filled-look column: outlined rectangle with an X inside."""
    h = size // 2
    _rect(msp, cx - h, cy - h, cx + h, cy + h)
    msp.add_line((cx - h, cy - h), (cx + h, cy + h))
    msp.add_line((cx - h, cy + h), (cx + h, cy - h))


def _window(msp, x0, y, w, *, horizontal=True):
    """Window symbol — thick outer sill + thin glass line."""
    if horizontal:
        msp.add_line((x0, y - 80), (x0 + w, y - 80))
        msp.add_line((x0, y + 80), (x0 + w, y + 80))
        msp.add_line((x0, y),      (x0 + w, y))         # glass
    else:
        msp.add_line((y - 80, x0), (y - 80, x0 + w))
        msp.add_line((y + 80, x0), (y + 80, x0 + w))
        msp.add_line((y, x0),      (y, x0 + w))


# ---------------------------------------------------------------------------
# 1) Small warehouse (regression sample) -- schematic single-line walls.
# ---------------------------------------------------------------------------
def build_warehouse() -> ezdxf.document.Drawing:
    W, H = 20_000, 12_000
    doc = ezdxf.new(setup=True)
    doc.header["$INSUNITS"] = 4
    msp = doc.modelspace()

    _wall_h(msp, 0, W, 0, door_at=10, door_w=2000, thick=EXT_T)
    _wall_v(msp, W, 0, H, thick=EXT_T)
    _wall_h(msp, 0, W, H, thick=EXT_T)
    _wall_v(msp, 0, 0, H, thick=EXT_T)
    _wall_v(msp, 10_000, 0, H, door_at=5)

    for cx in (6_500, 15_000):
        _column(msp, cx, 6_000)

    _label(msp, "WAREHOUSE  20 x 12 m", 500, H - 800, height=500)
    return doc


# ---------------------------------------------------------------------------
# 2) Office floor -- architectural style.
# ---------------------------------------------------------------------------
def build_office() -> ezdxf.document.Drawing:
    W, H = 40_000, 25_000
    doc = ezdxf.new(setup=True)
    doc.header["$INSUNITS"] = 4
    msp = doc.modelspace()

    # ---- exterior envelope (300 mm thick) ------------------------------
    _wall_h(msp, 0, W, 0, door_at=20, door_w=1800, thick=EXT_T)
    _wall_v(msp, W, 0, H, thick=EXT_T)
    _wall_h(msp, 0, W, H, thick=EXT_T)
    _wall_v(msp, 0, 0, H, thick=EXT_T)

    # ---- north-strip private offices + kitchen (Y = 17000..25000) ----
    # 5 rooms: 7m + 7m + 7m + 7m + 12m = 40m.
    OFF_Y = 17_000
    _wall_h(msp, 0,      7_000,  OFF_Y, door_at=3.5)
    _wall_h(msp, 7_000,  14_000, OFF_Y, door_at=3.5)
    _wall_h(msp, 14_000, 21_000, OFF_Y, door_at=3.5)
    _wall_h(msp, 21_000, 28_000, OFF_Y, door_at=3.5)
    _wall_h(msp, 28_000, W,      OFF_Y, door_at=6)
    # inter-room partitions run from OFF_Y up to the north wall.
    for x in (7_000, 14_000, 21_000, 28_000):
        _wall_v(msp, x, OFF_Y, H)

    # Furniture inside each office (2 desks per room).
    for x_lo, x_hi in ((0, 7000), (7000, 14000), (14000, 21000), (21000, 28000)):
        cx = (x_lo + x_hi) / 2
        _desk(msp, cx - 1500, 22_500)
        _desk(msp, cx + 1500, 22_500)

    # Kitchen counter + island in the 28000..40000 room.
    _kitchen_counter(msp, 28_500, 17_400, 39_600, 24_600)
    _rect(msp, 32_500, 20_000, 36_500, 21_500)   # island

    # Room labels.
    _label(msp, "OFFICE 1", 1_800, 20_500)
    _label(msp, "OFFICE 2", 8_800, 20_500)
    _label(msp, "OFFICE 3", 15_800, 20_500)
    _label(msp, "OFFICE 4", 22_800, 20_500)
    _label(msp, "KITCHEN & CAFE", 30_500, 20_500)

    # ---- corridor south wall (Y=15000) ------------------------------
    _wall_h(msp, 0, 27_000, 15_000, door_at=10)
    _wall_h(msp, 27_000, W, 15_000, door_at=6)
    _label(msp, "CORRIDOR", 1_000, 15_800)

    # ---- meeting rooms east block (X = 27000..40000) ----------------
    _wall_v(msp, 27_000, 0, 15_000, door_at=4)   # opens into Meeting Rm B
    _wall_h(msp, 27_000, W, 8_000, door_at=6.5)  # splits A above / B below
    _conf_table(msp, 33_500, 11_500)
    _conf_table(msp, 33_500, 4_000, w=2400, d=1000, chairs=6)
    _label(msp, "MEETING ROOM A", 30_000, 13_500)
    _label(msp, "MEETING ROOM B", 30_000, 6_500)

    # ---- open workspace (X = 0..27000, Y = 0..15000) ----------------
    _cluster_desks(msp, 500, 500, 26_500, 14_500, cols=6, rows=3)
    _label(msp, "OPEN WORKSPACE", 10_000, 7_500, height=450)

    # ---- structural columns on a 6 m grid --------------------------
    for x in (6_000, 12_000, 18_000, 24_000):
        for y in (5_000, 10_500):
            _column(msp, x, y)

    # ---- windows -----------------------------------------------------
    # North: one window per office + 2 in the kitchen.
    for i, cx in enumerate([3_500, 10_500, 17_500, 24_500, 32_000, 37_500]):
        _window(msp, cx - 1_200, H, 2_400)
    # South (open workspace): four wide windows.
    for x in (2_500, 8_500, 14_500, 20_500):
        _window(msp, x, 0, 3_000)
    # East (meeting rooms): two per room.
    for y_lo in (2_000, 5_000):     # Meeting Rm B
        _window(msp, y_lo, W, 2_000, horizontal=False)
    for y_lo in (9_500, 12_500):    # Meeting Rm A
        _window(msp, y_lo, W, 2_000, horizontal=False)

    # ---- title block -------------------------------------------------
    _label(msp, "OFFICE FLOOR PLAN  40 x 25 m", 400, H + 400, height=600)
    _label(msp, "SCALE: schematic, not to print", 400, H + 1_200, height=280)

    return doc


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------
_TARGETS = {
    "warehouse-20x12.dxf": build_warehouse,
    "office-40x25.dxf":    build_office,
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
