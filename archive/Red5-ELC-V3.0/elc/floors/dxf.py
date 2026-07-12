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

    ``slab`` (2026-02-13) is the building footprint auto-traced from
    the DXF.  Detection order:

    1. Any closed polyline on a layer whose name matches one of
       ``SLAB``, ``OUTLINE``, ``PERIMETER``, ``EXTERIOR``,
       ``ENVELOPE``, ``BOUNDARY`` (case-insensitive substring).
    2. Fallback — the largest-area closed LWPOLYLINE anywhere in
       modelspace (typical building outline heuristic).

    Returned as ``None`` when neither is available so the floor
    keeps its default axis-aligned rectangle.  Non-None value is a
    ``{"type": "polyline", "vertices": [[x_m, y_m], ...]}`` dict —
    format identical to what the /floors PATCH endpoint accepts.

    ``windows`` are LINE / 2-vertex LWPOLYLINE entities on any layer
    whose name contains "WIN" (case-insensitive) — the AutoCAD
    convention for glazing.  2026-02-12aj: auto-extraction on
    DXF import.  Each is::

        {"id": "<uuid>", "x_m": …, "y_m": …,
         "length_m": …, "angle_deg": …,
         "blind_level": 0.0,
         "sill_height_m": 1.0, "head_height_m": 2.2,
         "name": "N_W1" | "E_W1" | …}

    Windows are sorted top-to-bottom, then left-to-right, and named
    accordingly.  Names honour the same cardinal convention used by
    the frontend badge (angle-first, position-second, 5° tolerance).

    Coordinates are in metres, relative to the drawing's bounding-box
    origin (top-left after Y flip) so they line up 1:1 with the SVG
    the frontend renders and with the ``x_m`` / ``y_m`` fixture axes.
    """
    svg: str
    width_m: float
    height_m: float
    rooms: list[dict] = None  # type: ignore[assignment]
    windows: list[dict] = None  # type: ignore[assignment]
    slab: dict | None = None

    def __post_init__(self):
        if self.rooms is None:
            object.__setattr__(self, "rooms", [])
        if self.windows is None:
            object.__setattr__(self, "windows", [])


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

    # ---- Extract windows (2026-02-12aj auto-import) ------------------
    # Any LINE / LWPOLYLINE on a layer named like "WINDOWS", "WIN",
    # "A-GLAZ", etc. is imported as a window.  Named top→bottom,
    # left→right with the same 4-way cardinal rule used by the
    # frontend Windows-panel badge.
    windows = _extract_windows(
        msp, unit_m=unit_m,
        origin_x=float(bbox.extmin.x),
        origin_y=float(bbox.extmin.y),
        drawing_width_m=width_m,
        drawing_height_m=height_m,
    )

    # ---- Extract slab footprint polygon (2026-02-13) ----------------
    # See ``DxfConversion.slab`` docstring for detection order.
    slab = _extract_slab(
        msp, unit_m=unit_m,
        origin_x=float(bbox.extmin.x),
        origin_y=float(bbox.extmin.y),
        drawing_height_m=height_m,
    )

    return DxfConversion(svg=svg, width_m=width_m, height_m=height_m,
                         rooms=rooms, windows=windows, slab=slab)


def _extract_windows(msp, *, unit_m: float, origin_x: float, origin_y: float,
                     drawing_width_m: float, drawing_height_m: float) -> list[dict]:
    """Auto-extract windows from a DXF's modelspace (2026-02-12aj).

    Convention: any LINE or 2-vertex LWPOLYLINE on a layer whose name
    contains "WIN" (case-insensitive, catches WINDOW, WINDOWS, WIN,
    A-GLAZ-WIN, and similar AIA / bespoke naming schemes).

    Returned dicts match the window schema (see :class:`DxfConversion`).
    Sorted top-to-bottom, then left-to-right, and named accordingly
    using the same 4-way cardinal convention the frontend badge uses.
    """
    import uuid
    raw: list[dict] = []

    def _add(x0: float, y0: float, x1: float, y1: float) -> None:
        # Convert both endpoints to metres in the top-left origin
        # frame (Y flipped, same convention as _extract_rooms).
        px0 = (float(x0) - origin_x) * unit_m
        py0 = drawing_height_m - (float(y0) - origin_y) * unit_m
        px1 = (float(x1) - origin_x) * unit_m
        py1 = drawing_height_m - (float(y1) - origin_y) * unit_m
        length = ((px1 - px0) ** 2 + (py1 - py0) ** 2) ** 0.5
        if length < 0.2:
            return  # skip degenerate / sub-20 cm segments
        cx = (px0 + px1) / 2.0
        cy = (py0 + py1) / 2.0
        import math as _m
        angle = _m.degrees(_m.atan2(py1 - py0, px1 - px0)) % 360.0
        raw.append({
            "id": str(uuid.uuid4()),
            "x_m": cx, "y_m": cy,
            "length_m": length, "angle_deg": angle,
            "blind_level": 0.0,
            "sill_height_m": 1.0, "head_height_m": 2.2,
        })

    def _layer_is_window(layer_name: str) -> bool:
        # Match any layer whose name contains a window-ish keyword.
        # Covers WINDOWS, WIN, A-GLAZ-WIN, GLZ, GLASS, etc.
        # (Operators sometimes use bespoke names — extend here.)
        up = (layer_name or "").upper()
        return "WIN" in up or "GLAZ" in up or "GLASS" in up or "GLZ" in up

    def _block_is_window(block_name: str) -> bool:
        up = (block_name or "").upper()
        return "WIN" in up or "GLAZ" in up

    for line in msp.query("LINE"):
        if not _layer_is_window(line.dxf.layer):
            continue
        _add(line.dxf.start.x, line.dxf.start.y,
             line.dxf.end.x,   line.dxf.end.y)

    for pl in msp.query("LWPOLYLINE"):
        if not _layer_is_window(pl.dxf.layer):
            continue
        pts = list(pl.get_points("xy"))
        if len(pts) < 2:
            continue
        # Multi-segment polylines: treat every consecutive pair as a
        # separate window bar.  Single-bar architects will only draw
        # two vertices; multi-bar façades give one entry per pane.
        for i in range(len(pts) - 1):
            _add(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1])

    # INSERT (block reference) — common for architects who symbolise
    # every window with a block called "WIN30", "WINDOW_1000",
    # "GLAZING_A", …  We treat the insert as a horizontal window bar
    # centred on the insertion point, with length inferred from the
    # X-scale (default 1.2 m) and orientation from the INSERT rotation.
    for ins in msp.query("INSERT"):
        blk = str(getattr(ins.dxf, "name", "") or "")
        lyr = str(getattr(ins.dxf, "layer", "") or "")
        if not (_layer_is_window(lyr) or _block_is_window(blk)):
            continue
        ipt = ins.dxf.insert
        x0 = float(ipt.x); y0 = float(ipt.y)
        # Try to size the bar from the DXF unit-space scale factor.
        # 1.0 is the default when no explicit scale is set → we fall
        # back to a 1.2 m default length.
        xscale = float(getattr(ins.dxf, "xscale", 1.0) or 1.0)
        # If the block has a bounding box, use its X-extent as the
        # nominal length.  Otherwise a 1200 mm sane default.
        default_len_units = 1200.0 / unit_m if unit_m > 0 else 1200.0
        length_units = abs(xscale) * default_len_units
        rot_deg = float(getattr(ins.dxf, "rotation", 0.0) or 0.0)
        import math as _m
        rr = _m.radians(rot_deg)
        dx_units = _m.cos(rr) * length_units / 2.0
        dy_units = _m.sin(rr) * length_units / 2.0
        _add(x0 - dx_units, y0 - dy_units, x0 + dx_units, y0 + dy_units)

    # Sort top-to-bottom, then left-to-right (operator ask).
    # DXF-to-metres flipped Y so smaller y_m = up on screen = north
    # end of the drawing.  Sort key: (y_m rounded to 5 cm bucket,
    # then x_m) so windows in the "same visual row" group by y and
    # then order left→right.
    raw.sort(key=lambda w: (round(w["y_m"] / 0.05), w["x_m"]))

    # Auto-name using the 4-way cardinal rule (angle-first, position-
    # second, 5° tolerance) so the names align with the frontend's
    # badge assignment.  Replicated here to keep the DXF layer free
    # of frontend-specific imports.
    cx = drawing_width_m / 2.0
    cy = drawing_height_m / 2.0
    TOL = 5.0

    def _cardinal(w: dict) -> str:
        dx = w["x_m"] - cx
        dy = w["y_m"] - cy
        ang = ((w["angle_deg"] % 180) + 180) % 180
        dH = min(ang, 180 - ang)
        dV = abs(ang - 90)
        if dH <= TOL:
            return "S" if dy >= 0 else "N"
        if dV <= TOL:
            return "E" if dx >= 0 else "W"
        if abs(dx) > abs(dy):
            return "E" if dx >= 0 else "W"
        return "S" if dy >= 0 else "N"

    # 1-based counter per cardinal, assigned in sorted order.
    counters: dict[str, int] = {"N": 0, "E": 0, "S": 0, "W": 0}
    for w in raw:
        c = _cardinal(w)
        counters[c] += 1
        w["name"] = f"{c}_W{counters[c]}"
    return raw


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


# -----------------------------------------------------------------------------
# 2026-02-13 · Slab footprint auto-extraction
# -----------------------------------------------------------------------------
_SLAB_LAYER_KEYWORDS = (
    "SLAB", "OUTLINE", "PERIMETER", "EXTERIOR", "ENVELOPE", "BOUNDARY",
)


def _polygon_area_m2(verts: list[list[float]]) -> float:
    """Signed shoelace area (absolute) of a metric polygon."""
    n = len(verts)
    if n < 3:
        return 0.0
    a = 0.0
    for i in range(n):
        x1, y1 = verts[i]
        x2, y2 = verts[(i + 1) % n]
        a += x1 * y2 - x2 * y1
    return abs(a) * 0.5


def _pl_to_metres(pl, *, unit_m: float, origin_x: float, origin_y: float,
                  drawing_height_m: float) -> list[list[float]]:
    """LWPOLYLINE → list of [x_m, y_m] in the top-left origin frame."""
    verts: list[list[float]] = []
    for (x, y) in pl.get_points("xy"):
        vx = (float(x) - origin_x) * unit_m
        vy = drawing_height_m - (float(y) - origin_y) * unit_m
        verts.append([vx, vy])
    return verts


def _extract_slab(msp, *, unit_m: float, origin_x: float, origin_y: float,
                  drawing_height_m: float) -> dict | None:
    """Auto-detect the building slab footprint.

    Returns a ``{"type": "polyline", "vertices": [[x_m, y_m], ...]}``
    dict, or ``None`` if no plausible outline can be found.  Detection
    order matches the ``DxfConversion.slab`` docstring — layered
    naming first, then largest-polygon fallback.
    """
    # ---- Priority 1: layer-name match -------------------------------
    for pl in msp.query("LWPOLYLINE"):
        if not getattr(pl, "closed", False):
            continue
        lyr = str(getattr(pl.dxf, "layer", "") or "").upper()
        if any(kw in lyr for kw in _SLAB_LAYER_KEYWORDS):
            verts = _pl_to_metres(
                pl, unit_m=unit_m, origin_x=origin_x, origin_y=origin_y,
                drawing_height_m=drawing_height_m,
            )
            if len(verts) >= 3:
                return {"type": "polyline", "vertices": verts,
                        "rotation_deg": 0.0}

    # ---- Priority 2: largest closed polyline anywhere ---------------
    # We *skip* the ROOMS layer here — those are individual rooms not
    # the building perimeter.  Anything else is fair game.
    best: tuple[float, list[list[float]]] | None = None
    for pl in msp.query("LWPOLYLINE"):
        if not getattr(pl, "closed", False):
            continue
        lyr = str(getattr(pl.dxf, "layer", "") or "")
        if lyr == "ROOMS":
            continue
        verts = _pl_to_metres(
            pl, unit_m=unit_m, origin_x=origin_x, origin_y=origin_y,
            drawing_height_m=drawing_height_m,
        )
        if len(verts) < 3:
            continue
        area = _polygon_area_m2(verts)
        if best is None or area > best[0]:
            best = (area, verts)
    if best is not None:
        return {"type": "polyline", "vertices": best[1],
                "rotation_deg": 0.0}
    return None


# -----------------------------------------------------------------------------
# 2026-02-13 · Image → slab footprint tracer  (PNG / JPG uploads)
# -----------------------------------------------------------------------------
def image_to_slab(
    img_bytes: bytes,
    *,
    physical_width_m: float | None = None,
    physical_height_m: float | None = None,
    epsilon_ratio: float = 0.005,
    invert: bool | None = None,
) -> dict:
    """Trace the outer contour of a floor-plan raster image.

    * ``img_bytes`` — PNG / JPG bytes.
    * ``physical_width_m`` / ``physical_height_m`` — real-world size
      of the drawing.  If both provided the polygon is scaled to
      metres.  If only ``physical_width_m`` is given the aspect ratio
      of the image is used to derive height.  If neither, coordinates
      are returned in pixels (rare but supported for callers that
      know how to scale later).
    * ``epsilon_ratio`` — Douglas–Peucker simplification factor (as
      a fraction of the contour perimeter).  ``0.005`` collapses
      ~99 % of noise while preserving corners.
    * ``invert`` — force dark-on-light (``False``) or light-on-dark
      (``True``).  ``None`` = auto-detect based on the border average.

    Returns a slab dict compatible with the ``/floors`` schema::

        {"type": "polyline", "vertices": [[x_m, y_m], ...],
         "rotation_deg": 0.0}

    Raises ``DxfImportError`` (reused for a single upload error class)
    on unparseable images or if no plausible contour can be found.
    """
    import numpy as np
    try:
        import cv2  # opencv-python-headless
    except ImportError as e:
        raise DxfImportError(
            "OpenCV not installed on the server (pip install "
            "opencv-python-headless) — cannot trace floor from image.",
        ) from e
    if not img_bytes:
        raise DxfImportError("empty image upload")
    arr = np.frombuffer(img_bytes, dtype=np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise DxfImportError("could not decode image (not a PNG / JPG?)")
    h_px, w_px = img.shape[:2]
    # Threshold — Otsu picks the split point automatically.
    # Auto-detect polarity: borders should be background.
    border = np.concatenate([img[0, :], img[-1, :], img[:, 0], img[:, -1]])
    border_mean = float(border.mean())
    _thresh, binm = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    if invert is True or (invert is None and border_mean < 128):
        # Dark border → outline is the light region.
        pass
    else:
        binm = 255 - binm
    # Morphological close to bridge single-pixel gaps in drawn walls.
    k = max(3, min(9, int(min(h_px, w_px) * 0.005)))
    if k % 2 == 0:
        k += 1
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (k, k))
    binm = cv2.morphologyEx(binm, cv2.MORPH_CLOSE, kernel)
    contours, _ = cv2.findContours(
        binm, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE,
    )
    if not contours:
        raise DxfImportError("no outline found in image")
    # Pick the largest contour by area (the building envelope).
    contour = max(contours, key=cv2.contourArea)
    if cv2.contourArea(contour) < (w_px * h_px * 0.02):
        raise DxfImportError(
            "largest outline is < 2 % of the image — is this actually "
            "a floor plan?  Try a cleaner black-on-white drawing.")
    peri = cv2.arcLength(contour, closed=True)
    approx = cv2.approxPolyDP(contour, epsilon_ratio * peri, closed=True)
    pts_px = [[float(pt[0][0]), float(pt[0][1])] for pt in approx]
    if len(pts_px) < 3:
        raise DxfImportError("simplified contour has < 3 vertices")
    # Scale to metres if the caller supplied a physical dimension.
    if physical_width_m and physical_height_m:
        sx = physical_width_m / w_px
        sy = physical_height_m / h_px
    elif physical_width_m:
        sx = physical_width_m / w_px
        sy = sx
    else:
        sx = sy = 1.0
    verts = [[x * sx, y * sy] for (x, y) in pts_px]
    return {"type": "polyline", "vertices": verts, "rotation_deg": 0.0}



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


__all__ = ["DxfConversion", "DxfImportError", "dxf_to_svg", "image_to_slab"]
