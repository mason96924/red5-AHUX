"""
elc.floors.dxf
==============
Pure DXF → SVG converter used by the ``POST /api/elc/floors/import-dxf``
route.  Isolated in its own module so:

  * routes stay thin,
  * the converter is unit-testable without spinning FastAPI up,
  * a future block-name auto-extraction pass (Phase 6.2) can hook in
    without disturbing the SVG rendering path.

Uses ``ezdxf``'s ``drawing`` add-on with the SVG backend.  Every
DXF-to-SVG conversion issue in the wild traces back to fonts / linetypes;
we render with the modelspace only and let ezdxf fall back to defaults.
"""
from __future__ import annotations

import io
from dataclasses import dataclass
from re import compile as _re_compile

import ezdxf
from ezdxf.addons.drawing import Frontend, RenderContext
from ezdxf.addons.drawing.config import Configuration
from ezdxf.addons.drawing.layout import Page
from ezdxf.addons.drawing.svg import SVGBackend
from ezdxf.bbox import extents


class DxfImportError(ValueError):
    """The DXF bytes couldn't be parsed or contained no drawable geometry."""


@dataclass(frozen=True)
class DxfConversion:
    """Result of a successful DXF-to-SVG conversion.

    ``width_m`` / ``height_m`` are the drawing extents in DXF units,
    which are conventionally millimetres for architectural drawings —
    we convert to metres so the fixture placement math (also in
    metres) lines up.  If the DXF's `$INSUNITS` header says feet, we
    convert accordingly; anything else is passed through as-is with a
    best-effort guess.

    ``rooms`` are closed polygons on the ``ROOMS`` layer, extracted
    for canvas-side light clipping (Phase 6.1c).  Each is a dict of::

        {"id": "OFF-1", "name": "Office 1",
         "vertices": [[x_m, y_m], [x_m, y_m], ...]}

    Coordinates are in metres, relative to the drawing's bounding-box
    origin (top-left after Y flip) so they line up 1:1 with the SVG
    the frontend renders and with the ``x_m`` / ``y_m`` fixture axes.
    """
    svg: str
    width_m: float
    height_m: float
    rooms: list[dict] = None  # type: ignore[assignment]

    def __post_init__(self):
        if self.rooms is None:
            object.__setattr__(self, "rooms", [])


# DXF $INSUNITS → metres conversion factor.  Values from the DXF spec.
_INSUNITS_TO_M = {
    1: 0.0254,      # inches
    2: 0.3048,      # feet
    4: 0.001,       # millimetres
    5: 0.01,        # centimetres
    6: 1.0,         # metres
}
_DEFAULT_UNIT_M = 0.001   # unspecified → assume mm (typical for AutoCAD)


def dxf_to_svg(dxf_bytes: bytes) -> DxfConversion:
    """Convert a DXF byte-string to an SVG string + physical extents.

    Raises :class:`DxfImportError` on unparseable / empty DXFs.
    """
    if not dxf_bytes:
        raise DxfImportError("empty upload")
    try:
        doc = ezdxf.read(io.StringIO(dxf_bytes.decode("utf-8", errors="ignore")))
    except Exception as e:  # noqa: BLE001
        raise DxfImportError(f"could not parse DXF: {e}") from e

    msp = doc.modelspace()
    # Bail early if the drawing is empty -- otherwise ezdxf renders an
    # empty SVG which looks like a "success" from the frontend but is
    # useless to the operator.
    try:
        bbox = extents(msp, fast=True)
    except Exception as e:  # noqa: BLE001
        raise DxfImportError(f"could not compute drawing extents: {e}") from e
    if not bbox.has_data:
        raise DxfImportError("DXF contains no drawable geometry")

    # Convert DXF units → metres for the floor's physical size.
    insunits = doc.header.get("$INSUNITS", 0)
    unit_m = _INSUNITS_TO_M.get(int(insunits), _DEFAULT_UNIT_M)
    dxf_width  = float(bbox.size.x)
    dxf_height = float(bbox.size.y)
    width_m  = max(dxf_width  * unit_m, 0.1)
    height_m = max(dxf_height * unit_m, 0.1)

    # Render to SVG.  The SVG backend needs a Configuration + Page pair
    # so it knows how big to make the viewport; we render the model
    # bounding box at 1 mm per SVG unit (ezdxf's default) so the SVG's
    # own coordinate system stays true to the drawing.
    #
    # We turn the ROOMS layer *off* before rendering — those closed
    # polylines are for programmatic light-clipping (see
    # :func:`_extract_rooms`) not for visual walls; leaving them
    # visible would draw a redundant coloured outline on top of the
    # real double-line partitions.
    if "ROOMS" in doc.layers:
        doc.layers.get("ROOMS").off()
    backend = SVGBackend()
    ctx = RenderContext(doc)
    frontend = Frontend(ctx, backend, config=Configuration())
    frontend.draw_layout(msp)
    # `page_width_mm` / `page_height_mm` = the viewport size in mm.
    # We map dxf drawing extents → mm 1:1 when the drawing is already
    # in mm; scale from other units.
    page = Page(
        width=dxf_width  * unit_m * 1000.0,   # → mm
        height=dxf_height * unit_m * 1000.0,
    )
    svg = backend.get_string(page)
    svg = _theme_svg_for_dark_canvas(svg)

    # ---- Extract room polygons (Phase 6.1c) --------------------------
    # Convention: any closed LWPOLYLINE on layer "ROOMS" is treated as
    # a room boundary for canvas-side light clipping.  Coordinates are
    # translated so the bounding-box min becomes (0, 0) and flipped on
    # Y so they match the SVG viewport (which the drawing add-on flips
    # the same way).  Missing layer → empty list, i.e. the frontend
    # falls back to floor-bounding-box clipping.
    rooms = _extract_rooms(
        msp, unit_m=unit_m,
        origin_x=float(bbox.extmin.x),
        origin_y=float(bbox.extmin.y),
        drawing_height_m=height_m,
    )

    return DxfConversion(svg=svg, width_m=width_m, height_m=height_m, rooms=rooms)


def _extract_rooms(msp, *, unit_m: float, origin_x: float, origin_y: float,
                   drawing_height_m: float) -> list[dict]:
    """Pull every closed LWPOLYLINE on layer "ROOMS" out of ``msp`` and
    return them as a list of ``{id, name, vertices}`` dicts in metres,
    top-left origin.

    * ``id`` / ``name`` come from XDATA if present, else a synthetic
      "R-1", "R-2", ... string.
    * Any polyline with < 3 distinct vertices is skipped (degenerate).
    """
    out: list[dict] = []
    for i, pl in enumerate(msp.query("LWPOLYLINE")):
        if not getattr(pl, "closed", False):
            continue
        if pl.dxf.layer != "ROOMS":
            continue
        pts = list(pl.get_points("xy"))
        if len(pts) < 3:
            continue
        verts: list[list[float]] = []
        for (x, y) in pts:
            x_m = (float(x) - origin_x) * unit_m
            # DXF Y grows upward; SVG viewport Y grows downward and the
            # drawing add-on flips accordingly.  We mirror to match.
            y_m = drawing_height_m - (float(y) - origin_y) * unit_m
            verts.append([x_m, y_m])
        # A LWPOLYLINE with closed=True doesn't repeat the first vertex
        # by default -- that's fine, our polygon consumer closes it
        # implicitly (path back to verts[0]).
        # Prefer any XDATA "ROOM_NAME" if present, else fall back.
        name = ""
        try:
            for tag in pl.get_xdata("ROOM"):
                if tag[0] == 1000:      # string data code
                    name = str(tag[1])
                    break
        except Exception:  # noqa: BLE001
            pass
        out.append({
            "id": f"R-{i + 1}",
            "name": name or f"Room {i + 1}",
            "vertices": verts,
        })
    return out


# ezdxf 1.4's SVGBackend hard-codes a dark background rect and a
# ``stroke-width: 6`` (relative to a ~1e6-unit viewBox) which, when
# drawn on our operator canvas at typical zoom levels, is sub-pixel
# thin and thus effectively invisible.  We post-process the SVG:
#   1) drop the opaque background rect so our canvas colour shows
#      through and the fixture beams read against it correctly;
#   2) fatten strokes ~250× so walls, furniture, and door swings
#      render as ~1-2 px lines at typical operator zoom.
_SVG_BG_RECT_RE = _re_compile(
    r"<rect fill=\"[^\"]*\" x=\"0\" y=\"0\" "
    r"width=\"\d+\" height=\"\d+\" fill-opacity=\"[^\"]*\"\s*/>"
)
_SVG_STROKE_W_RE = _re_compile(r"stroke-width:\s*\d+(?:\.\d+)?")


def _theme_svg_for_dark_canvas(svg: str) -> str:
    svg = _SVG_BG_RECT_RE.sub("", svg, count=1)
    svg = _SVG_STROKE_W_RE.sub("stroke-width: 1500", svg)
    return svg


__all__ = ["DxfConversion", "DxfImportError", "dxf_to_svg"]
