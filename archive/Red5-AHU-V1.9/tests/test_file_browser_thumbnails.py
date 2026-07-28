"""Regression: Controller Assets file browser must show real image thumbs.

Bug (2026-06-15)
----------------
Operator screenshot (Windows, www.geniusmason.com) showed the
"Controller Assets" file browser modal listing AHU_TYPE_01.jpg with
just a generic cyan icon -- no preview.  On Mac the same row showed
a tiny image of the file content.  Root cause: the TYPE column in
``js/file-browser.js`` was rendering a static unicode glyph for every
image-type file regardless of OS.  Mac's "rendering" was actually
the OS coincidentally aliasing the glyph onto something image-like;
Windows just showed the glyph as a glyph.  Either way, neither was
a real thumbnail.

Fix
---
The TYPE cell for ``file.type === 'image'`` now renders a 32x32 ``<img>``
pointing at ``/api/thumb?path=…&max=64`` (raster) or ``/api/assets/…``
(SVG).  Both endpoints already exist in V1.9 Flask + V2.0 FastAPI
(Phases L.13 + L.14).  ``onError`` falls back to the legacy glyph so
the row never goes blank.

Guards
------
1. The thumb URL string with ``max=64`` is present in all three
   parity copies of file-browser.js (V1.9, V2.0, frontend/public).
2. The SVG branch points at /api/assets/ (not /api/thumb -- vector
   should never be rasterised).
3. data-testid="file-row-thumb" survives so e2e tests can find it.
4. The non-image type glyph fallback is still wired (fileTypeIcon).
5. Three-way byte parity for js/file-browser.js.
"""
from __future__ import annotations

import hashlib
import re
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parents[1]
V19 = REPO
V20 = REPO.parents[0] / "Red5-AHU-V2.0"
PUB = REPO.parents[1] / "frontend" / "public"

PARITY_COPIES = [
    V19 / "js" / "file-browser.js",
    V20 / "js" / "file-browser.js",
    PUB / "js" / "file-browser.js",
]


@pytest.mark.parametrize("path", PARITY_COPIES, ids=lambda p: p.parts[-3])
def test_thumb_wired_into_type_cell(path: Path) -> None:
    assert path.exists(), f"missing parity copy: {path}"
    src = path.read_text(encoding="utf-8")
    assert "/api/thumb?path=" in src and "max=64" in src, (
        f"{path}: file-browser.js no longer fetches /api/thumb -- "
        "image rows will revert to generic glyph icons."
    )


@pytest.mark.parametrize("path", PARITY_COPIES, ids=lambda p: p.parts[-3])
def test_svg_uses_assets_not_thumb(path: Path) -> None:
    src = path.read_text(encoding="utf-8")
    # The SVG branch must route to /api/assets/ -- rasterising vector
    # through /api/thumb would defeat the whole point of SVG.
    assert re.search(r"isSvg\s*\n?\s*\?\s*\(apiUrl\s*\+\s*['\"]\/api\/assets\/", src), (
        f"{path}: SVG branch in file-browser.js does not resolve to /api/assets/"
    )


@pytest.mark.parametrize("path", PARITY_COPIES, ids=lambda p: p.parts[-3])
def test_testid_and_glyph_fallback_present(path: Path) -> None:
    src = path.read_text(encoding="utf-8")
    assert "data-testid" in src and "file-row-thumb" in src, (
        f"{path}: file-row-thumb testid lost -- e2e tests cannot locate "
        "the new thumbnail cell."
    )
    # onError must restore the glyph so a Pillow-undecodable file
    # doesn't leave an empty cell.
    assert "fileTypeIcon" in src and "onError" in src, (
        f"{path}: glyph fallback path missing -- a decode failure "
        "would leave a blank row."
    )


def test_three_way_parity() -> None:
    md5s = {p: hashlib.md5(p.read_bytes()).hexdigest() for p in PARITY_COPIES}
    assert len(set(md5s.values())) == 1, f"file-browser.js parity drift: {md5s}"
