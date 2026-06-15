"""Regression tests for the AHU_TYPE_1 / AHU_TYPE_01 zero-padding fallback.

History: A user reported "No preview" for AHU_TYPE_01.jpg in Windows
Chrome.  Root cause was a schema/asset spelling mismatch (V1.8 saved
`_1`, V1.9 saved `_01`).  The fix has three layers:

  1. /api/assets/<path>  retries the alternate spelling on miss.
  2. /api/thumb?path=    retries the alternate spelling on miss.
  3. image-picker.js     retries once client-side before "No preview".

These tests verify layers 1, 2 and the underlying _zero_pad_variants()
helper.  The frontend layer is covered by the JS in image-picker.js
itself (single retry, gated by ``data-alttried``).

Transport: httpx.AsyncClient + ASGITransport (same pattern as the
sibling test_thumb_and_weather_current.py -- starlette.TestClient is
incompatible with the installed httpx==0.28).
"""
from __future__ import annotations

import io
import os
import sys

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import server                                  # noqa: E402
from server import app, _zero_pad_variants    # noqa: E402


@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as c:
        yield c


# ---------------------------------------------------------------------------
# Pure helper -- no transport, no fixtures
# ---------------------------------------------------------------------------
class TestZeroPadVariants:
    def test_unpadded_single_digit_pads_to_two(self):
        assert _zero_pad_variants("AHU_TYPE_1.jpg") == ["AHU_TYPE_01.jpg"]

    def test_padded_two_digit_unpads_to_one(self):
        assert _zero_pad_variants("AHU_TYPE_01.jpg") == ["AHU_TYPE_1.jpg"]

    def test_two_digit_ten_or_above_returns_nothing(self):
        # _TYPE_10 has no single-digit variant -- that would lose information.
        assert _zero_pad_variants("AHU_TYPE_10.jpg") == []

    def test_no_suffix_returns_nothing(self):
        assert _zero_pad_variants("floor_plan.jpg") == []

    def test_only_final_segment_considered(self):
        # _1 in the *directory* must NOT be rewritten.
        assert _zero_pad_variants("dir_1/file_2.jpg") == ["dir_1/file_02.jpg"]

    def test_extension_preserved(self):
        assert _zero_pad_variants("foo_3.svg") == ["foo_03.svg"]
        assert _zero_pad_variants("foo_3.PNG") == ["foo_03.PNG"]

    def test_path_components_preserved(self):
        assert _zero_pad_variants(
            "graphics/equipments/AHUs/AHU_TYPE_1.jpg"
        ) == ["graphics/equipments/AHUs/AHU_TYPE_01.jpg"]


# ---------------------------------------------------------------------------
# /api/assets/<path>  zero-pad fallback
# ---------------------------------------------------------------------------
@pytest.fixture
def public_padtest_png(tmp_path_factory):
    """Drop a real PNG at public/graphics/_padtest/ASSET_TYPE_01.png,
    yield the public root + the rel path, clean up after."""
    public_root = os.path.normpath(os.path.join(server.ROOT, "..", "frontend", "public"))
    test_dir = os.path.join(public_root, "graphics", "_padtest")
    os.makedirs(test_dir, exist_ok=True)
    # 1x1 PNG -- shortest valid sequence.
    png_bytes = (
        b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR"
        b"\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89"
        b"\x00\x00\x00\rIDATx\x9cc\xfc\xff\xff?\x00\x05\xfe\x02\xfe\xa07\x81\xb7"
        b"\x00\x00\x00\x00IEND\xaeB`\x82"
    )
    padded = os.path.join(test_dir, "ASSET_TYPE_01.png")
    with open(padded, "wb") as f:
        f.write(png_bytes)
    yield "graphics/_padtest/ASSET_TYPE_01.png"
    # cleanup
    if os.path.exists(padded):
        os.remove(padded)
    try:
        os.rmdir(test_dir)
    except OSError:
        pass


@pytest.mark.asyncio
async def test_assets_padded_request_resolves_directly(client, public_padtest_png):
    r = await client.get(f"/api/assets/{public_padtest_png}")
    assert r.status_code == 200


@pytest.mark.asyncio
async def test_assets_unpadded_falls_back_to_padded(client, public_padtest_png):
    # Disk has _01.png; request asks for _1.png.
    # Without the fallback this returns 404.
    rel_unpadded = public_padtest_png.replace("_01.png", "_1.png")
    r = await client.get(f"/api/assets/{rel_unpadded}")
    assert r.status_code == 200, r.text


@pytest.mark.asyncio
async def test_assets_truly_missing_still_404(client):
    # Sanity: the fallback must not turn arbitrary 404s into 200.
    r = await client.get("/api/assets/graphics/_padtest/DOES_NOT_EXIST.png")
    assert r.status_code == 404


# ---------------------------------------------------------------------------
# /api/thumb  zero-pad fallback
# ---------------------------------------------------------------------------
@pytest.fixture
def public_thumbpadtest_jpg():
    pytest.importorskip("PIL")
    from PIL import Image
    public_root = os.path.normpath(os.path.join(server.ROOT, "..", "frontend", "public"))
    test_dir = os.path.join(public_root, "graphics", "_thumbpadtest")
    os.makedirs(test_dir, exist_ok=True)
    buf = io.BytesIO()
    Image.new("RGB", (4, 4), (200, 100, 50)).save(buf, "JPEG")
    padded = os.path.join(test_dir, "AHU_TYPE_01.jpg")
    with open(padded, "wb") as f:
        f.write(buf.getvalue())
    yield "graphics/_thumbpadtest/AHU_TYPE_01.jpg"
    if os.path.exists(padded):
        os.remove(padded)
    try:
        os.rmdir(test_dir)
    except OSError:
        pass


@pytest.mark.asyncio
async def test_thumb_padded_resolves_directly(client, public_thumbpadtest_jpg):
    r = await client.get("/api/thumb",
                         params={"path": public_thumbpadtest_jpg, "max": 64})
    assert r.status_code == 200
    assert r.headers["content-type"] == "image/png"


@pytest.mark.asyncio
async def test_thumb_unpadded_falls_back_to_padded(client, public_thumbpadtest_jpg):
    rel_unpadded = public_thumbpadtest_jpg.replace("_01.jpg", "_1.jpg")
    r = await client.get("/api/thumb", params={"path": rel_unpadded, "max": 64})
    # Without the fallback this would be 404; with it, a normalised PNG.
    assert r.status_code == 200, r.text
    assert r.headers["content-type"] == "image/png"
