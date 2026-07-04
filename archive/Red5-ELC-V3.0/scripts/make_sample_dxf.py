"""Generate a small, realistic sample DXF for testing the /floor page.

Produces a 20m × 12m warehouse floor with:
  * exterior walls,
  * an interior partition dividing the space in two,
  * a door opening on the south wall,
  * two windows on the north wall,
  * a couple of columns.

Units are millimetres (INSUNITS=4), which is the AutoCAD default for
architectural drawings.  Run with::

    python scripts/make_sample_dxf.py

and the file drops at ``demo/samples/warehouse-20x12.dxf``.
"""
from __future__ import annotations

from pathlib import Path

import ezdxf

# All coordinates in millimetres — matches AutoCAD arch convention.
W, H = 20_000, 12_000  # outer envelope: 20 m × 12 m


def build() -> ezdxf.document.Drawing:
    doc = ezdxf.new(setup=True)
    doc.header["$INSUNITS"] = 4  # millimetres

    msp = doc.modelspace()

    # ---- exterior walls (single-line schematic) ---------------------
    # South wall with a 2m door opening centred at x=10m.
    msp.add_lwpolyline(
        [(0, 0), (9_000, 0)], close=False,
    )
    msp.add_lwpolyline(
        [(11_000, 0), (W, 0)], close=False,
    )
    # East, north, west walls unbroken.
    msp.add_lwpolyline(
        [(W, 0), (W, H), (0, H), (0, 0)], close=False,
    )

    # ---- north-wall windows (drawn as double-lines to show detail) --
    for x0 in (4_000, 12_000):
        # sill + head lines 200 mm apart, running 1.5 m wide.
        msp.add_line((x0, H - 100), (x0 + 1_500, H - 100))
        msp.add_line((x0, H - 300), (x0 + 1_500, H - 300))

    # ---- interior partition wall (vertical, at x=10m) --------------
    # Broken by a 900 mm door in the middle.
    msp.add_line((10_000, 0), (10_000, 5_000))
    msp.add_line((10_000, 5_900), (10_000, H))

    # ---- two columns (500x500) ------------------------------------
    for cx in (6_500, 15_000):
        cy = 6_000
        msp.add_lwpolyline(
            [(cx - 250, cy - 250), (cx + 250, cy - 250),
             (cx + 250, cy + 250), (cx - 250, cy + 250)],
            close=True,
        )

    # ---- a helpful label so the SVG doesn't look empty in tiny  ----
    # previews.  Text is optional; ezdxf renders it as a stroked
    # outline via the drawing backend.
    msp.add_text(
        "WAREHOUSE  20 × 12 m",
        dxfattribs={"height": 500, "insert": (500, H - 800)},
    )

    return doc


def main() -> None:
    out = Path(__file__).resolve().parent.parent / "demo" / "samples"
    out.mkdir(parents=True, exist_ok=True)
    dst = out / "warehouse-20x12.dxf"
    build().saveas(dst)
    print(f"wrote {dst}")


if __name__ == "__main__":
    main()
