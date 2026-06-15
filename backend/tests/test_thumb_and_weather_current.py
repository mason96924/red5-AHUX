"""Regression: V2.0 FastAPI endpoints for thumb + weather-current (2026-06-15).

Background
----------
The V1.9 Flask app.py got /api/thumb (CMYK->sRGB normaliser) and
/api/weather-current (live weather for the sun-path widget) on
2026-06-12.  The V2.0 deploy on the Linux server (and Emergent
preview) runs FastAPI ``backend/server.py``, NOT Flask, so those two
routes were invisible there until 2026-06-15.

This test locks the FastAPI mirrors in place: every fix we ship to
V1.9 that introduces a new backend route MUST also exist in V2.0
FastAPI, otherwise the Linux box silently 404s for that capability
and the user experiences the original bug (e.g. "No preview" for
CMYK JPEGs on Windows Chrome).

Coverage
--------
1. /api/thumb is registered on the FastAPI app.
2. /api/thumb actually normalises a CMYK JPEG to a valid sRGB PNG.
3. /api/thumb gracefully 302-redirects SVG to /api/assets/ (vector
   passthrough -- never rasterise).
4. /api/weather-current is registered and returns the contract the
   frontend ribbon relies on.
5. /api/weather-current's in-process cache dedupes back-to-back calls.

Test transport
--------------
Uses httpx.AsyncClient + ASGITransport (in-process; no port).  This
matches the modern FastAPI testing idiom and sidesteps the
``Client.__init__() got an unexpected keyword argument 'app'`` failure
of starlette.TestClient on the installed httpx==0.28.
"""
from __future__ import annotations

import io
import os
import sys

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from PIL import Image

# Make /app/backend importable when this test runs from /app/backend/tests.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import server                          # noqa: E402
from server import app                 # noqa: E402


@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as c:
        yield c


# ---------------------------------------------------------------------------
# /api/thumb
# ---------------------------------------------------------------------------

def test_thumb_route_registered() -> None:
    routes = [r.path for r in app.routes if hasattr(r, "path")]
    assert "/api/thumb" in routes, (
        "FastAPI is missing /api/thumb -- the Linux-server picker cannot "
        "decode CMYK JPEGs and Windows users see 'No preview'."
    )


@pytest.mark.asyncio
async def test_thumb_normalises_cmyk_jpeg(client) -> None:
    """End-to-end: CMYK JPEG in -> sRGB PNG out."""
    public_root = os.path.normpath(os.path.join(server.ROOT, "..", "frontend", "public"))
    test_dir = os.path.join(public_root, "graphics", "_pytest_thumb")
    os.makedirs(test_dir, exist_ok=True)
    test_jpg = os.path.join(test_dir, "cmyk.jpg")
    Image.new("CMYK", (400, 300), (40, 20, 10, 0)).save(test_jpg, "JPEG")
    assert Image.open(test_jpg).mode == "CMYK"

    try:
        r = await client.get("/api/thumb",
                             params={"path": "graphics/_pytest_thumb/cmyk.jpg", "max": 256})
        assert r.status_code == 200, r.text
        assert r.headers.get("content-type") == "image/png"
        out = Image.open(io.BytesIO(r.content))
        assert out.mode == "RGB", (
            f"thumb output mode {out.mode!r}, expected RGB -- "
            "CMYK normalisation did not happen."
        )
        assert max(out.size) <= 256
    finally:
        os.remove(test_jpg)
        os.rmdir(test_dir)


@pytest.mark.asyncio
async def test_thumb_svg_redirects_to_assets(client) -> None:
    """SVG must pass through to /api/assets/ unchanged (vector)."""
    r = await client.get("/api/thumb", params={"path": "any/path.svg"},
                         follow_redirects=False)
    assert r.status_code == 302
    assert r.headers["location"] == "/api/assets/any/path.svg"


@pytest.mark.asyncio
async def test_thumb_missing_source_404(client) -> None:
    r = await client.get("/api/thumb", params={"path": "does/not/exist.jpg"})
    assert r.status_code == 404


@pytest.mark.asyncio
async def test_thumb_path_traversal_blocked(client) -> None:
    """Use a raster extension so we hit the path-traversal guard in
    /api/thumb itself, not the SVG-passthrough redirect branch (which
    delegates traversal protection to /api/assets/)."""
    r = await client.get("/api/thumb", params={"path": "../../etc/passwd.jpg"})
    assert r.status_code in (403, 404), r.text


@pytest.mark.asyncio
async def test_thumb_max_clamped(client) -> None:
    r = await client.get("/api/thumb", params={"path": "x.jpg", "max": 9999})
    assert r.status_code == 422  # FastAPI Query validation


# ---------------------------------------------------------------------------
# /api/weather-current
# ---------------------------------------------------------------------------

def test_weather_current_route_registered() -> None:
    routes = [r.path for r in app.routes if hasattr(r, "path")]
    assert "/api/weather-current" in routes, (
        "FastAPI is missing /api/weather-current -- the sun-path "
        "diagnostic ribbon will silently never render on Linux server."
    )


@pytest.mark.asyncio
async def test_weather_current_payload_contract(client, monkeypatch) -> None:
    """Stub the upstream Open-Meteo call so the test is hermetic."""
    import json as _json
    import urllib.request

    fake_payload = {
        "current": {
            "time": "2026-06-15T13:00",
            "temperature_2m": 24.6,
            "relative_humidity_2m": 72,
            "cloud_cover": 65,
            "wind_speed_10m": 8.5,
            "wind_direction_10m": 110,
            "precipitation": 0.0,
            "shortwave_radiation": 410,
            "weather_code": 2,
        },
        "current_units": {
            "temperature_2m": "°C",
            "wind_speed_10m": "km/h",
            "precipitation": "mm",
            "shortwave_radiation": "W/m²",
        },
        "timezone": "Asia/Hong_Kong",
    }

    class _Resp:
        def __init__(self, body: bytes):
            self._body = body
        def read(self) -> bytes:
            return self._body
        def __enter__(self): return self
        def __exit__(self, *a): return False

    def _fake_urlopen(req, *a, **kw):  # noqa: ARG001
        return _Resp(_json.dumps(fake_payload).encode("utf-8"))

    monkeypatch.setattr(urllib.request, "urlopen", _fake_urlopen)
    server._WEATHER_NOW_CACHE.clear()

    r = await client.get("/api/weather-current", params={"lat": 22.3, "lon": 114.2})
    assert r.status_code == 200
    d = r.json()
    assert d["success"] is True
    for k in ("temperature_c", "relative_humidity", "cloud_cover",
              "wind_speed_kmh", "wind_direction_deg", "precipitation_mm",
              "ghi_wm2", "weather_code", "time", "tz", "units",
              "source", "fetched", "ttl_s"):
        assert k in d, f"missing field {k!r} in /api/weather-current payload"
    assert d["cloud_cover"] == 65
    assert d["ghi_wm2"] == 410


@pytest.mark.asyncio
async def test_weather_current_cache_dedups(client, monkeypatch) -> None:
    import json as _json
    import urllib.request

    call_count = {"n": 0}
    fake = {"current": {"cloud_cover": 30, "temperature_2m": 22, "relative_humidity_2m": 60,
                        "wind_speed_10m": 6, "wind_direction_10m": 180,
                        "precipitation": 0, "shortwave_radiation": 600,
                        "weather_code": 1, "time": "2026-06-15T14:00"},
            "current_units": {}, "timezone": "UTC"}

    class _R:
        def read(self): return _json.dumps(fake).encode("utf-8")
        def __enter__(self): return self
        def __exit__(self, *a): return False

    def _spy(*a, **kw):  # noqa: ARG001
        call_count["n"] += 1
        return _R()

    monkeypatch.setattr(urllib.request, "urlopen", _spy)
    server._WEATHER_NOW_CACHE.clear()

    await client.get("/api/weather-current", params={"lat": 40.71, "lon": -74.01})
    await client.get("/api/weather-current", params={"lat": 40.71, "lon": -74.01})
    await client.get("/api/weather-current", params={"lat": 40.71, "lon": -74.01})
    assert call_count["n"] == 1, (
        f"cache failed -- urlopen called {call_count['n']} times for 3 identical (lat,lon)"
    )

