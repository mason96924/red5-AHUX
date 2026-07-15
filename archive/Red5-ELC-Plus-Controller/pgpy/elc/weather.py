"""Weather + ambient-light computation for the Building page.

Composes three data sources with graceful fallback:
    1. OpenWeatherMap  -- when ``OPENWEATHER_KEY`` env var is set
    2. Open-Meteo      -- free, no API key, canonical default
    3. NOAA (US-only)  -- last resort when the primary two fail

Also computes the *ambient outdoor illuminance* and derived RGB colour
for any timestamp at a given lat/lon based on sun altitude + cloud
cover.  This drives the Building page's "outside area" paint.

Design notes
------------
* Provider layer is pluggable via ``get_weather(lat, lon)`` factory.
* HTTP calls are cached in-process for 5 minutes to stay well under
  the OWM 60-req/min free-tier budget.
* Failure of ANY provider is non-fatal -- the endpoint always returns
  *something* (with ``provider="stale"`` or ``provider="offline"``
  in the payload) so the frontend never has to blank the canvas.
* Only stdlib + ``httpx`` (already in the demo's deps) are required.
"""
from __future__ import annotations

import math
import os
import time
from dataclasses import dataclass, asdict
from datetime import datetime, timezone, timedelta
from typing import Optional

import httpx

# --------------------------------------------------------------------
# Data model
# --------------------------------------------------------------------


@dataclass
class WeatherSample:
    """Snapshot of atmospheric conditions.

    ``cloud_cover`` is 0..1 (fraction).  ``precip_mm_h`` is millimetres
    per hour.  ``visibility_km`` may be ``None`` if the provider
    doesn't report it.  ``provider`` names the source so the operator
    can debug ("openweathermap" / "open-meteo" / "noaa" / "stale" /
    "offline").
    """
    cloud_cover: float
    precip_mm_h: float
    visibility_km: Optional[float]
    temperature_c: Optional[float]
    provider: str
    fetched_at: str    # ISO-8601 UTC


# --------------------------------------------------------------------
# Simple in-process TTL cache
# --------------------------------------------------------------------


_CACHE: dict[tuple[float, float], tuple[float, WeatherSample]] = {}
_CACHE_TTL_S = 300     # 5 minutes


def _cache_get(lat: float, lon: float) -> Optional[WeatherSample]:
    key = (round(lat, 3), round(lon, 3))    # cache-key at ~100 m precision
    entry = _CACHE.get(key)
    if entry is None:
        return None
    fetched_ts, sample = entry
    if time.time() - fetched_ts < _CACHE_TTL_S:
        return sample
    return None


def _cache_put(lat: float, lon: float, sample: WeatherSample) -> None:
    _CACHE[(round(lat, 3), round(lon, 3))] = (time.time(), sample)


# --------------------------------------------------------------------
# Providers
# --------------------------------------------------------------------


async def _from_openweathermap(lat: float, lon: float) -> WeatherSample:
    key = os.environ.get("OPENWEATHER_KEY", "").strip()
    if not key:
        raise RuntimeError("OPENWEATHER_KEY env var not set")
    async with httpx.AsyncClient(timeout=6.0) as c:
        r = await c.get(
            "https://api.openweathermap.org/data/2.5/weather",
            params={"lat": lat, "lon": lon, "appid": key, "units": "metric"},
        )
        r.raise_for_status()
        j = r.json()
    return WeatherSample(
        cloud_cover=(j.get("clouds", {}).get("all", 0) or 0) / 100.0,
        precip_mm_h=(j.get("rain", {}) or {}).get("1h", 0.0)
                    + (j.get("snow", {}) or {}).get("1h", 0.0),
        visibility_km=(j.get("visibility") or 0) / 1000.0 or None,
        temperature_c=j.get("main", {}).get("temp"),
        provider="openweathermap",
        fetched_at=datetime.now(timezone.utc).isoformat(),
    )


async def _from_open_meteo(lat: float, lon: float) -> WeatherSample:
    async with httpx.AsyncClient(timeout=6.0) as c:
        r = await c.get(
            "https://api.open-meteo.com/v1/forecast",
            params={
                "latitude": lat, "longitude": lon,
                "current": "temperature_2m,cloud_cover,precipitation,visibility",
                "timezone": "UTC",
            },
        )
        r.raise_for_status()
        j = r.json()
    cur = j.get("current", {}) or {}
    return WeatherSample(
        cloud_cover=(cur.get("cloud_cover") or 0) / 100.0,
        precip_mm_h=cur.get("precipitation") or 0.0,
        visibility_km=((cur.get("visibility") or 0) / 1000.0) or None,
        temperature_c=cur.get("temperature_2m"),
        provider="open-meteo",
        fetched_at=datetime.now(timezone.utc).isoformat(),
    )


async def _from_noaa(lat: float, lon: float) -> WeatherSample:
    """US-only fallback.  NOAA's /points endpoint requires a two-hop
    lookup (points -> forecast).  We only try this when the previous
    two providers failed."""
    async with httpx.AsyncClient(timeout=6.0, headers={
        "User-Agent": "red5-elc/1.0 (weather bridge)",
    }) as c:
        pt = await c.get(f"https://api.weather.gov/points/{lat:.4f},{lon:.4f}")
        pt.raise_for_status()
        url = pt.json()["properties"]["forecastHourly"]
        fc = await c.get(url)
        fc.raise_for_status()
        period = fc.json()["properties"]["periods"][0]
    # NOAA doesn't quantify cloud cover directly on the hourly feed;
    # infer from short forecast text.
    text = (period.get("shortForecast") or "").lower()
    if "clear" in text or "sunny" in text:
        cloud = 0.05
    elif "partly" in text:
        cloud = 0.35
    elif "mostly" in text and "cloudy" in text:
        cloud = 0.75
    elif "overcast" in text or "cloudy" in text:
        cloud = 0.95
    else:
        cloud = 0.5
    precip = 0.0
    if "rain" in text or "shower" in text:
        precip = 2.0
    elif "storm" in text or "thunder" in text:
        precip = 8.0
    elif "snow" in text:
        precip = 3.0
    return WeatherSample(
        cloud_cover=cloud, precip_mm_h=precip, visibility_km=None,
        temperature_c=None,
        provider="noaa",
        fetched_at=datetime.now(timezone.utc).isoformat(),
    )


async def get_weather(lat: float, lon: float) -> WeatherSample:
    """Return the freshest weather sample available for ``(lat, lon)``,
    trying OWM (if key set) → Open-Meteo → NOAA in that order.  A
    cached value <5 min old always wins.  On total failure returns a
    conservative "clear-daylight" placeholder rather than raising so
    the UI never has to blank the canvas."""
    cached = _cache_get(lat, lon)
    if cached is not None:
        return cached
    last_err: Optional[Exception] = None
    for provider in (_from_openweathermap, _from_open_meteo, _from_noaa):
        try:
            sample = await provider(lat, lon)
            _cache_put(lat, lon, sample)
            return sample
        except Exception as e:      # noqa: BLE001
            last_err = e
            continue
    # All providers failed -- serve a safe default.  Marked as
    # ``offline`` so the frontend can show a subtle "no weather" hint.
    return WeatherSample(
        cloud_cover=0.5,     # neutral overcast
        precip_mm_h=0.0,
        visibility_km=None,
        temperature_c=None,
        provider=f"offline ({last_err})" if last_err else "offline",
        fetched_at=datetime.now(timezone.utc).isoformat(),
    )


# --------------------------------------------------------------------
# Solar geometry (self-contained, no scipy)
# --------------------------------------------------------------------


def solar_altitude_deg(lat_deg: float, lon_deg: float,
                       ts: datetime) -> tuple[float, float]:
    """Return ``(altitude_deg, azimuth_deg)`` of the sun at the given
    ISO timestamp (assumed timezone-aware).  Uses the standard NOAA
    algorithm at ~0.1° precision -- good enough for lighting sim.

    Azimuth is measured clockwise from due north (0° = N, 90° = E,
    180° = S, 270° = W).
    """
    if ts.tzinfo is None:
        ts = ts.replace(tzinfo=timezone.utc)
    ts_utc = ts.astimezone(timezone.utc)
    # Julian day
    y, m, d = ts_utc.year, ts_utc.month, ts_utc.day
    if m <= 2:
        y -= 1; m += 12
    A = y // 100
    B = 2 - A + (A // 4)
    frac_day = ((ts_utc.hour + ts_utc.minute / 60.0
                 + ts_utc.second / 3600.0) / 24.0)
    jd = (int(365.25 * (y + 4716)) + int(30.6001 * (m + 1))
          + d + B - 1524.5 + frac_day)
    n = jd - 2451545.0
    # Mean longitude / anomaly
    L = (280.460 + 0.9856474 * n) % 360.0
    g = math.radians((357.528 + 0.9856003 * n) % 360.0)
    # Ecliptic longitude
    lam = math.radians(L + 1.915 * math.sin(g) + 0.020 * math.sin(2 * g))
    # Obliquity of the ecliptic
    eps = math.radians(23.439 - 0.0000004 * n)
    # RA + declination
    ra = math.atan2(math.cos(eps) * math.sin(lam), math.cos(lam))
    dec = math.asin(math.sin(eps) * math.sin(lam))
    # GMST + local hour angle
    gmst = (18.697374558 + 24.06570982441908 * n) % 24.0
    lst = (gmst + lon_deg / 15.0) % 24.0
    ha = math.radians(lst * 15.0) - ra
    lat = math.radians(lat_deg)
    alt = math.asin(
        math.sin(lat) * math.sin(dec)
        + math.cos(lat) * math.cos(dec) * math.cos(ha)
    )
    az = math.atan2(
        -math.cos(dec) * math.sin(ha),
        math.sin(dec) * math.cos(lat) - math.cos(dec) * math.sin(lat) * math.cos(ha)
    )
    return math.degrees(alt), (math.degrees(az) + 360.0) % 360.0


# --------------------------------------------------------------------
# Ambient illuminance + colour spectrum
# --------------------------------------------------------------------


def _clamp(x: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, x))


def horizontal_illuminance_lux(sun_altitude_deg: float,
                               cloud_cover: float,
                               precip_mm_h: float) -> float:
    """Simple daylight model returning horizontal-plane illuminance in
    lux.  Matches the operator's spectrum request:
        * Night (sun below -6°)          → ~0..1 lux (starlight/moon)
        * Twilight (-6..0°)              → 1..1000 lux
        * Overcast day (alt>10°, cc=1)  → ~10 000 lux
        * Clear day at zenith (alt=90°)  → ~110 000 lux
    ``precip_mm_h`` shaves an extra 30 % off during heavy rain.
    """
    alt = sun_altitude_deg
    if alt < -12:
        return 0.05
    if alt < 0:
        # Twilight -- rapid climb from ~1 to ~600 lux across the last
        # 6° before geometric sunrise/sunset.
        return _clamp(math.pow(10, (alt + 12) / 3.0), 0.05, 600.0)
    # Sun above horizon: clear-sky base illuminance.
    clear = 128_000.0 * math.pow(math.sin(math.radians(alt)), 1.15)
    # Cloud attenuation follows CIE overcast-sky ratio (~0.15 at fully
    # overcast noon).
    cc = _clamp(cloud_cover, 0.0, 1.0)
    cloud_factor = 1.0 - 0.85 * cc
    # Precip dims further (heavy rain -> ~0.7x, cap 30%).
    rain_factor = _clamp(1.0 - 0.03 * precip_mm_h, 0.7, 1.0)
    return max(clear * cloud_factor * rain_factor, 0.5)


def ambient_rgb(illum_lux: float, sun_altitude_deg: float,
                cloud_cover: float,
                precip_mm_h: float = 0.0) -> tuple[int, int, int]:
    """Map an outdoor illuminance + solar geometry to an RGB colour
    for the "outside area" paint.  2026-02-12ah rewrite implements
    the operator's TOD colour-temperature curve:
        * Deep night (alt < -6°)          → cool blue moonlight
        * Civil twilight (-6..0°)         → dusky mauve, dim
        * Sunrise/sunset (0..+3°)         → deep warm red-orange
        * Golden hour peak (~+3°)         → richest warm amber-orange
        * Rising (3..30°)                 → amber → warm gold
        * Mid-day (30..90°)               → warm white → near daylight
    Cloud cover lerps the RGB toward a neutral overcast grey and
    slightly cools it.  Symmetric across the horizon (below-horizon
    branch mirrors the above-horizon twilight).
    """
    # Below deep twilight -- moonlight regime.
    if sun_altitude_deg < -6:
        v = _clamp(math.log10(max(illum_lux, 0.5) + 1.0) / math.log10(100_001.0),
                   0.0, 1.0)
        r = int(_clamp(6 + 20 * v, 0, 40))
        g = int(_clamp(9 + 25 * v, 0, 50))
        b = int(_clamp(18 + 40 * v, 0, 90))
        return r, g, b

    # Anchor palette (clear sky, cc=0) at key altitudes.
    # Interpolated linearly on |alt| so the below-horizon side
    # (civil twilight) mirrors the just-after-sunrise curve.
    #   alt   ( R,   G,   B )
    anchors = [
        (-6.0, ( 40,  30,  70)),  # deep civil twilight   (dusky mauve)
        (-3.0, (110,  60,  75)),  # nautical→civil edge   (pre-dawn pink)
        ( 0.0, (200,  95,  55)),  # horizon crossing      (warm red-orange)
        ( 3.0, (255, 140,  60)),  # GOLDEN HOUR PEAK      (deepest warm)
        (10.0, (255, 180,  80)),  # warm amber            (#ffb050)
        (30.0, (255, 220, 150)),  # golden-white
        (60.0, (255, 245, 210)),  # warm white
        (90.0, (255, 252, 235)),  # near daylight
    ]
    a = _clamp(sun_altitude_deg, -6.0, 90.0)
    # Find bracketing anchors.
    lo = anchors[0]
    hi = anchors[-1]
    for i in range(1, len(anchors)):
        if anchors[i][0] >= a:
            lo = anchors[i - 1]
            hi = anchors[i]
            break
    span = hi[0] - lo[0]
    t = 0.0 if span <= 0 else (a - lo[0]) / span
    r_sun = lo[1][0] + t * (hi[1][0] - lo[1][0])
    g_sun = lo[1][1] + t * (hi[1][1] - lo[1][1])
    b_sun = lo[1][2] + t * (hi[1][2] - lo[1][2])

    # Cloud attenuation: lerp toward cool overcast grey by cc.
    # Also darkens the overall value by up to 40% at full overcast.
    cc = _clamp(cloud_cover, 0.0, 1.0)
    grey = (200, 200, 210)
    r_sun = r_sun + (grey[0] - r_sun) * (0.55 * cc)
    g_sun = g_sun + (grey[1] - g_sun) * (0.55 * cc)
    b_sun = b_sun + (grey[2] - b_sun) * (0.55 * cc)
    cloud_dim = 1.0 - 0.40 * cc
    r_sun *= cloud_dim
    g_sun *= cloud_dim
    b_sun *= cloud_dim

    # Rain further dims and cools the outdoor colour.
    rain_factor = _clamp(1.0 - 0.03 * precip_mm_h, 0.7, 1.0)
    r_sun *= rain_factor
    g_sun *= rain_factor
    b_sun *= rain_factor
    if precip_mm_h > 0.2:
        grey_rain = (170, 180, 195)
        p = _clamp(precip_mm_h / 8.0, 0.0, 0.45)
        r_sun = r_sun + (grey_rain[0] - r_sun) * p
        g_sun = g_sun + (grey_rain[1] - g_sun) * p
        b_sun = b_sun + (grey_rain[2] - b_sun) * p

    return (
        int(_clamp(r_sun, 0, 255)),
        int(_clamp(g_sun, 0, 255)),
        int(_clamp(b_sun, 0, 255)),
    )


def rgb_to_hex(rgb: tuple[int, int, int]) -> str:
    return "#{:02x}{:02x}{:02x}".format(*rgb)


# --------------------------------------------------------------------
# Public composite: everything the /api/elc/ambient endpoint needs
# --------------------------------------------------------------------


async def compute_ambient(lat: float, lon: float,
                          at: Optional[datetime] = None) -> dict:
    """Return the full snapshot the frontend needs to paint the
    outside area at the given timestamp (defaults to "now"):

        {
          "at": "2026-02-11T18:32:00+00:00",
          "sun":     {"altitude_deg": 34.2, "azimuth_deg": 217.8},
          "weather": {"cloud_cover": 0.28, "precip_mm_h": 0.0,
                      "visibility_km": 12, "temperature_c": 23,
                      "provider": "open-meteo",
                      "fetched_at": "..."},
          "ambient": {"illuminance_lux": 41200.0,
                      "color_rgb": [214, 200, 168],
                      "color_hex": "#d6c8a8",
                      "label": "clear-sunny"}
        }
    """
    ts = at if at is not None else datetime.now(timezone.utc)
    alt, az = solar_altitude_deg(lat, lon, ts)
    sample = await get_weather(lat, lon)
    lux = horizontal_illuminance_lux(alt, sample.cloud_cover, sample.precip_mm_h)
    rgb = ambient_rgb(lux, alt, sample.cloud_cover, sample.precip_mm_h)
    return {
        "at": ts.astimezone(timezone.utc).isoformat(),
        "sun": {"altitude_deg": round(alt, 3),
                "azimuth_deg": round(az, 3)},
        "weather": asdict(sample),
        "ambient": {
            "illuminance_lux": round(lux, 1),
            "color_rgb": list(rgb),
            "color_hex": rgb_to_hex(rgb),
            "label": _label_for(
                alt, sample.cloud_cover, sample.precip_mm_h, sample.temperature_c,
            ),
        },
    }


def _label_for(
    alt: float,
    cc: float,
    precip: float,
    temp_c: Optional[float] = None,
) -> str:
    if alt < -6:
        return "night"
    if alt < 0:
        return "twilight"
    if precip > 0.1 and temp_c is not None and temp_c < 1.5:
        return "snow"
    if precip > 6:
        return "storm"
    if precip > 2:
        return "rain"
    if precip > 0.3:
        return "light-rain"
    if cc > 0.85:
        return "overcast"
    if cc > 0.4:
        return "partly-cloudy"
    return "clear-sunny"
