"""Regression: live-weather wiring for the sun-path widget (2026-06-12).

Background
----------
Operator design discussion (options "A" + "C"):
* C. /api/weather-current endpoint added to weather_service.py; returns
     current cloud, wind, GHI, precipitation, weather_code.  Backed by
     a 5-min in-process cache keyed on (lat, lon).
* A. SunRayOverlay (js/sun-path.js) dims+desaturates the solar ray
     based on cloud cover (and GHI when available).  SunCompass
     renders a diagnostic ribbon showing the same numbers.

Guards
------
1. weather_service exposes ``weather_current`` callable AND registers
   the ``/api/weather-current`` route in ``register()``.
2. The current-weather payload contract returns the seven fields the
   frontend relies on; missing any of them silently would break the
   ribbon JSX without any runtime error.
3. The frontend cache + dedupe helper ``window.red5FetchCurrentWeather``
   is present in js/sun-path.js with the matching cache-key shape.
4. SunRayOverlay accepts ``cloudCover`` and ``ghiWm2`` props (looked
   for by name in source).
5. SunCompass forwards ``cloudCover``+``ghiWm2`` in its onChange
   payload so call sites only need to plumb them once.
6. All three parity copies (V1.9, V2.0, frontend/public) of
   dashboard.html, equipment_mapper.html, sun_preview.html, and
   js/sun-path.js are byte-identical.
"""
from __future__ import annotations

import hashlib
import importlib
import re
import sys
from pathlib import Path

import pytest

REPO  = Path(__file__).resolve().parents[1]
V19   = REPO
V20   = REPO.parents[0] / "Red5-Studio-V2.0"
PUB   = REPO.parents[1] / "frontend" / "public"

PARITY_FILES = [
    ("dashboard.html",       [V19, V20, PUB]),
    ("equipment_mapper.html", [V19, V20, PUB]),
    ("sun_preview.html",      [V19, V20, PUB]),
    ("js/sun-path.js",        [V19, V20, PUB]),
]

# Just the V1.9 + V2.0 trees -- weather_service.py is backend only and
# not shipped in frontend/public.
PY_PARITY = [
    ("weather_service.py", [V19, V20]),
]


# ---------------------------------------------------------------------------
# Backend contract
# ---------------------------------------------------------------------------

@pytest.fixture(scope="module")
def ws_module():
    """Import weather_service with flask.run stubbed so module-import
    doesn't try to bind a port."""
    import flask
    orig_run = flask.Flask.run
    flask.Flask.run = lambda *a, **kw: None  # noqa: ARG005
    try:
        sys.path.insert(0, str(V19))
        if "weather_service" in sys.modules:
            del sys.modules["weather_service"]
        ws = importlib.import_module("weather_service")
        yield ws
    finally:
        flask.Flask.run = orig_run
        sys.path.remove(str(V19))


def test_weather_current_route_helper_present(ws_module) -> None:
    assert hasattr(ws_module, "weather_current"), (
        "weather_current() handler missing -- /api/weather-current cannot be wired."
    )
    assert hasattr(ws_module, "_current_weather"), (
        "_current_weather() helper missing -- handler has nothing to call."
    )


def test_weather_current_route_registered() -> None:
    """The register() function must add the URL rule."""
    src = (V19 / "weather_service.py").read_text(encoding="utf-8")
    assert "'/api/weather-current'" in src, (
        "/api/weather-current URL rule missing from register()"
    )
    assert "'weather_current'" in src, "weather_current endpoint name missing"


def test_weather_current_payload_contract(ws_module, monkeypatch) -> None:
    """Stub out the upstream Open-Meteo call and check the JSON shape."""
    import json as _json
    import urllib.request

    fake_payload = {
        "current": {
            "time": "2026-06-12T14:00",
            "temperature_2m": 21.4,
            "relative_humidity_2m": 67,
            "cloud_cover": 78,
            "wind_speed_10m": 12.3,
            "wind_direction_10m": 245,
            "precipitation": 0.0,
            "shortwave_radiation": 240,
            "weather_code": 3,
        },
        "current_units": {
            "temperature_2m": "°C",
            "wind_speed_10m": "km/h",
            "precipitation": "mm",
            "shortwave_radiation": "W/m²",
        },
        "timezone": "America/New_York",
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
    # Clear the cache so this test is hermetic.
    ws_module._WEATHER_NOW_CACHE.clear()

    out = ws_module._current_weather(40.71, -74.01)
    assert out["success"] is True
    for k in ("temperature_c", "relative_humidity", "cloud_cover",
              "wind_speed_kmh", "wind_direction_deg", "precipitation_mm",
              "ghi_wm2", "weather_code", "time", "tz", "units",
              "source", "fetched", "ttl_s"):
        assert k in out, f"missing field {k!r} in /api/weather-current payload"
    assert out["cloud_cover"] == 78
    assert out["wind_speed_kmh"] == 12.3
    assert out["ghi_wm2"] == 240
    assert out["weather_code"] == 3
    assert out["units"]["temperature_c"] == "°C"


def test_weather_current_cache_dedups(ws_module, monkeypatch) -> None:
    """Two back-to-back calls within TTL must NOT hit the network twice."""
    import json as _json
    import urllib.request

    payload = {
        "current": {"cloud_cover": 50, "temperature_2m": 20,
                    "relative_humidity_2m": 55, "wind_speed_10m": 5,
                    "wind_direction_10m": 90, "precipitation": 0,
                    "shortwave_radiation": 500, "weather_code": 1,
                    "time": "2026-06-12T15:00"},
        "current_units": {}, "timezone": "UTC",
    }
    call_count = {"n": 0}

    class _Resp:
        def read(self): return _json.dumps(payload).encode("utf-8")
        def __enter__(self): return self
        def __exit__(self, *a): return False

    def _spy(*a, **kw):  # noqa: ARG001
        call_count["n"] += 1
        return _Resp()

    monkeypatch.setattr(urllib.request, "urlopen", _spy)
    ws_module._WEATHER_NOW_CACHE.clear()

    ws_module._current_weather(41.5, -73.5)
    ws_module._current_weather(41.5, -73.5)
    ws_module._current_weather(41.5, -73.5)
    assert call_count["n"] == 1, (
        f"cache failed -- urlopen called {call_count['n']} times "
        "for 3 identical (lat,lon) requests within TTL"
    )


def test_weather_current_invalid_latlon(ws_module) -> None:
    out = ws_module._current_weather("not-a-number", "also-bad")
    assert out["success"] is False
    assert "numeric" in out["error"]


# ---------------------------------------------------------------------------
# Frontend (js/sun-path.js) source-level guards
# ---------------------------------------------------------------------------

def _sun_path_src() -> str:
    return (V19 / "js" / "sun-path.js").read_text(encoding="utf-8")


def test_sunray_overlay_accepts_cloud_and_ghi() -> None:
    """SunRayOverlay must read both props by name -- otherwise the
    cloud/GHI plumbing from SunCompass.onChange is silently ignored."""
    src = _sun_path_src()
    assert "props.cloudCover" in src, "SunRayOverlay missing cloudCover prop"
    assert "props.ghiWm2"     in src, "SunRayOverlay missing ghiWm2 prop"
    # The intensity dampening must touch BOTH cloud and ghi paths.
    assert "weatherFactor" in src, "weather attenuation variable missing"


def test_red5_fetch_current_weather_present() -> None:
    src = _sun_path_src()
    assert "window.red5FetchCurrentWeather" in src, (
        "single-flight weather fetcher missing -- multiple sun-path "
        "consumers will each hit /api/weather-current independently"
    )
    assert "/api/weather-current" in src
    assert "window.red5CurrentWeatherCache" in src, "frontend cache missing"


def test_sun_compass_forwards_weather_in_onchange() -> None:
    src = _sun_path_src()
    # The onChange payload must include the three new fields.
    onchange = re.search(r"props\.onChange\(\{([^}]+)\}\)", src, re.DOTALL)
    assert onchange, "SunCompass onChange call missing"
    block = onchange.group(1)
    for k in ("cloudCover", "ghiWm2", "weatherNow"):
        assert k in block, (
            f"SunCompass onChange does not forward {k!r} -- "
            "downstream SunRayOverlay can't read it."
        )


def test_wmo_helpers_present() -> None:
    src = _sun_path_src()
    assert "window.red5WmoIcon" in src
    assert "window.red5WmoLabel" in src
    assert "window.red5DegToCompass" in src


# ---------------------------------------------------------------------------
# Call-site guards: every SunRayOverlay must forward the new props
# ---------------------------------------------------------------------------

CALL_SITE_FILES = [
    V19 / "dashboard.html",
    V19 / "equipment_mapper.html",
    V19 / "sun_preview.html",
]


@pytest.mark.parametrize("path", CALL_SITE_FILES, ids=lambda p: p.name)
def test_callsites_pass_cloud_and_ghi(path: Path) -> None:
    src = path.read_text(encoding="utf-8")
    # Every SunRayOverlay JSX element must include cloudCover= and ghiWm2=.
    overlays = re.findall(r"<window\.SunRayOverlay\b[^/>]*\/>", src)
    assert overlays, f"{path.name}: no SunRayOverlay JSX found -- did the widget move?"
    for jsx in overlays:
        assert "cloudCover=" in jsx, (
            f"{path.name}: SunRayOverlay call missing cloudCover= -- "
            f"the cloud-modulation will be ignored.  Offending JSX:\n  {jsx}"
        )
        assert "ghiWm2=" in jsx, (
            f"{path.name}: SunRayOverlay call missing ghiWm2= -- "
            f"the GHI-modulation will be ignored.  Offending JSX:\n  {jsx}"
        )


# ---------------------------------------------------------------------------
# Parity (byte-identical across all three trees / two for backend)
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("rel,trees", PARITY_FILES, ids=lambda x: x if isinstance(x, str) else x[0])
def test_frontend_parity(rel, trees) -> None:
    md5s = [hashlib.md5((t / rel).read_bytes()).hexdigest() for t in trees]
    assert len(set(md5s)) == 1, (
        f"parity drift for {rel}: {dict(zip([str(t) for t in trees], md5s))}"
    )


@pytest.mark.parametrize("rel,trees", PY_PARITY, ids=lambda x: x if isinstance(x, str) else x[0])
def test_backend_parity(rel, trees) -> None:
    md5s = [hashlib.md5((t / rel).read_bytes()).hexdigest() for t in trees]
    assert len(set(md5s)) == 1, (
        f"parity drift for {rel}: {dict(zip([str(t) for t in trees], md5s))}"
    )
