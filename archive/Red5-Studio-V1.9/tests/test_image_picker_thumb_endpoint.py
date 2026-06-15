"""Regression: image-picker preview + SVG support (2026-06-12).

Bug
---
Operator screenshot (Windows Chrome) showed AHU_TYPE_01.jpg as "No
preview" while the same file rendered correctly in macOS Chrome.  The
root cause is CMYK-colour-space JPEGs: macOS Chrome decodes via
ImageIO (CMYK supported), Windows Chrome/Edge decode via Skia (CMYK
dropped ~M85, 2020).  The picker today loads ``/assets/<path>``
directly, so the browser's decoder is the sole gate -- any
browser-rejected encoding shows as "No preview".

Operator also requested SVG support in the picker.

Fix
---
1. New endpoint ``/api/thumb?path=<rel>&max=<px>`` in V1.9/V2.0 app.py:
   - Routes raster formats (jpg/jpeg/png/gif/bmp/webp/tif/tiff)
     through Pillow, normalising CMYK / YCbCr / LA / P / RGBA modes
     to plain sRGB.  Returns a PNG so Skia can always render it.
   - Caches generated thumbs under /root/data/.thumbs/ keyed on
     (src_abs, mtime, max_px).
   - 302s to /assets/<rel> for SVG (vector; never rasterise) and
     when Pillow is unavailable (graceful fallback to legacy
     behaviour).
2. ``js/image-picker.js`` now requests /api/thumb for raster files
   and /assets/ for SVG.

Guards
------
A. ``api_thumb`` endpoint registered on the V1.9 + V2.0 flask app.
B. The thumb route exists in source AND handles SVG via 302 redirect.
C. js/image-picker.js routes raster -> /api/thumb and SVG -> /assets/.
D. The picker still accepts .svg as an "image" type from the backend
   listing (already true since 2026-05, but locked here so it can't
   regress).
E. Three-way parity for js/image-picker.js (V1.9 / V2.0 / public).
F. Two-way parity for app.py (V1.9 / V2.0).
G. End-to-end smoke: feed Pillow a CMYK JPEG, exercise the exact
   normalisation pipeline the endpoint uses, and confirm the output
   is a valid sRGB PNG.
"""
from __future__ import annotations

import hashlib
import io
import re
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parents[1]
V19 = REPO
V20 = REPO.parents[0] / "Red5-Studio-V2.0"
PUB = REPO.parents[1] / "frontend" / "public"

APP_PY      = V19 / "app.py"
APP_PY_V20  = V20 / "app.py"
PICKER_JS   = V19 / "js" / "image-picker.js"
PICKER_PARITY = [
    V19 / "js" / "image-picker.js",
    V20 / "js" / "image-picker.js",
    PUB / "js" / "image-picker.js",
]


# ---------------------------------------------------------------------------
# Source-level wiring guards
# ---------------------------------------------------------------------------

def test_app_py_registers_api_thumb_route() -> None:
    src = APP_PY.read_text(encoding="utf-8")
    assert "@app.route('/api/thumb')" in src, (
        "/api/thumb route declaration missing from app.py -- the picker "
        "cannot get normalised previews."
    )
    assert "def api_thumb" in src, "api_thumb handler missing"


def test_api_thumb_normalises_cmyk_and_routes_svg() -> None:
    """The route source must mention the CMYK normalisation and the
    SVG redirect explicitly so a careless refactor can't drop either."""
    src = APP_PY.read_text(encoding="utf-8")
    assert "'CMYK'" in src and "convert('RGB')" in src, (
        "CMYK->RGB conversion path missing from api_thumb -- Windows "
        "Chrome will keep showing 'No preview' for CMYK JPEGs."
    )
    assert "redirect('/assets/' + rel" in src, (
        "SVG/non-raster passthrough redirect missing from api_thumb."
    )
    # The raster extension set must include the common formats.
    for ext in (".jpg", ".jpeg", ".png", ".webp", ".tif"):
        assert ext in src.split("_THUMB_RASTER_EXTS", 1)[1].split("}", 1)[0], (
            f"raster ext {ext} missing from _THUMB_RASTER_EXTS"
        )


def test_picker_uses_thumb_for_raster_and_assets_for_svg() -> None:
    src = PICKER_JS.read_text(encoding="utf-8")
    assert "/api/thumb?path=" in src, "image-picker.js never reaches the /api/thumb route"
    assert "/.svg$/i.test" in src or "isSvg" in src, (
        "image-picker.js doesn't branch on .svg -- vectors would be "
        "needlessly rasterised through Pillow."
    )
    # SVG must go through /assets/, not /api/thumb.
    assert re.search(r"isSvg\s*\?\s*`[^`]*\/assets\/", src), (
        "SVG branch in image-picker.js does not resolve to /assets/"
    )


def test_backend_image_type_includes_svg() -> None:
    """SVG must already be recognised as an image type by app.py's
    directory listing, otherwise the picker filter (``f.type === 'image'``)
    would exclude it and the user would never see an SVG card."""
    src = APP_PY.read_text(encoding="utf-8")
    # The image-type tuple in app.py.
    m = re.search(r"ftype\s*=\s*'image'\s*if\s*ext\s*in\s*\(([^)]+)\)", src)
    assert m, "Could not locate image-extension tuple in app.py"
    tuple_body = m.group(1)
    for ext in ("'.png'", "'.jpg'", "'.jpeg'", "'.svg'", "'.webp'"):
        assert ext in tuple_body, (
            f"{ext} missing from image-type tuple in app.py -- the picker "
            "would not list these files as images."
        )


# ---------------------------------------------------------------------------
# Parity (file-level byte-identical)
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("p", PICKER_PARITY, ids=lambda p: str(p.parts[-3]))
def test_picker_js_parity(p: Path) -> None:
    assert p.exists(), f"missing parity copy: {p}"


def test_picker_js_three_way_md5_identical() -> None:
    md5s = {p: hashlib.md5(p.read_bytes()).hexdigest() for p in PICKER_PARITY}
    distinct = set(md5s.values())
    assert len(distinct) == 1, f"image-picker.js parity drift: {md5s}"


def test_app_py_v19_v20_md5_identical() -> None:
    h19 = hashlib.md5(APP_PY.read_bytes()).hexdigest()
    h20 = hashlib.md5(APP_PY_V20.read_bytes()).hexdigest()
    assert h19 == h20, f"app.py parity drift: V1.9={h19}, V2.0={h20}"


# ---------------------------------------------------------------------------
# End-to-end: exercise the Pillow pipeline the route uses
# ---------------------------------------------------------------------------

def test_cmyk_jpeg_normalises_to_srgb_png(tmp_path) -> None:
    """Reproduces the original AHU_TYPE_01 bug: a CMYK JPEG that
    Windows Chrome refuses must come out the other side as a vanilla
    sRGB PNG that any browser can decode."""
    from PIL import Image, ImageOps  # type: ignore[import-not-found]

    src = tmp_path / "ahu_type_01.jpg"
    Image.new("CMYK", (400, 300), (40, 20, 10, 0)).save(src, "JPEG")
    # Confirm the test setup -- this MUST be CMYK.
    assert Image.open(src).mode == "CMYK"

    # Reproduce the route's normalisation block verbatim.
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)
        if im.mode in ("CMYK", "YCbCr"):
            im = im.convert("RGB")
        elif im.mode in ("LA", "P"):
            im = im.convert("RGBA")
        if im.mode == "RGBA":
            bg = Image.new("RGB", im.size, (15, 23, 42))
            bg.paste(im, mask=im.split()[-1])
            im = bg
        elif im.mode != "RGB":
            im = im.convert("RGB")
        im.thumbnail((256, 256), Image.LANCZOS)
        buf = io.BytesIO()
        im.save(buf, format="PNG", optimize=True)
        out = buf.getvalue()

    # The output must be a valid PNG that re-opens as plain RGB.
    assert out[:8] == b"\x89PNG\r\n\x1a\n", "output is not a PNG"
    with Image.open(io.BytesIO(out)) as verify:
        assert verify.mode == "RGB", f"output mode {verify.mode!r}, expected RGB"
        assert max(verify.size) <= 256


def test_transparent_png_flattened_to_slate_bg(tmp_path) -> None:
    """RGBA inputs must flatten onto the slate-900 background so the
    transparent regions don't render black on the picker's dark cards."""
    from PIL import Image, ImageOps  # type: ignore[import-not-found]
    src = tmp_path / "icon.png"
    # 50% transparent red on transparent background.
    im0 = Image.new("RGBA", (32, 32), (255, 0, 0, 128))
    im0.save(src, "PNG")

    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)
        if im.mode in ("LA", "P"):
            im = im.convert("RGBA")
        if im.mode == "RGBA":
            bg = Image.new("RGB", im.size, (15, 23, 42))
            bg.paste(im, mask=im.split()[-1])
            im = bg

    # Top-left pixel must be a blend, NOT pure black -- proves we
    # actually painted onto a slate background instead of letting
    # PNG-to-JPEG converter default to black.
    assert im.mode == "RGB"
    r, g, b = im.getpixel((0, 0))
    assert (r, g, b) != (0, 0, 0), (
        "RGBA flatten produced black pixel -- background fill failed."
    )
    # Slate-ish blue must be visible (the un-blended sides give it away).
    assert b > g, "Result lacks blue dominance from slate background."
