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
    """
    svg: str
    width_m: float
    height_m: float


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

    return DxfConversion(svg=svg, width_m=width_m, height_m=height_m)


__all__ = ["DxfConversion", "DxfImportError", "dxf_to_svg"]
