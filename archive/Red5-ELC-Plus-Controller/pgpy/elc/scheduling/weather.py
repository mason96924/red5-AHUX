"""
elc.scheduling.weather
======================
Open-Meteo forecast integration + outdoor-lux estimation.

Open-Meteo (open-meteo.com) is free, no API key needed, and already
used elsewhere in the Red5 stack.  We fetch the ``cloud_cover`` hourly
forecast for the controller's location, cache it for 5 minutes, and
translate ``(cloud_cover%, solar_elevation°) → outdoor_lux``.

Lux model (deliberately simple, defensible, tweakable):
    * clear_sky_lux ≈ 128,000 × sin(elev)              (rough peak-noon
      value at solar zenith with dry, clear atmosphere)
    * clamp at 0 when sun is below horizon
    * cloud_factor = 1 − (cloud_cover_fraction × 0.75) (75%-attenuation
      at 100% overcast; matches published rules-of-thumb for typical
      thick stratocumulus)
    * lux = clear_sky_lux × cloud_factor + 100 (twilight/starlight floor)

The model is not calibrated against a photometer -- for the operator's
"turn the lights on when it gets dark" use case, the shape of the curve
matters far more than absolute accuracy, and the operator picks the
threshold empirically anyway.

If ``weather_enabled`` is off or Open-Meteo is unreachable, we still
provide a lux estimate from the sun elevation alone (equivalent to
``cloud_cover = 0``) so a lux trigger degrades gracefully into a
"clear-sky sunrise/sunset trigger" instead of stalling.
"""
from __future__ import annotations

import json
import math
import ssl
import time
import urllib.error
import urllib.request
from datetime import date, datetime, timedelta
from typing import Callable

from elc.scheduling.astro import Location, solar_elevation

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
CLEAR_SKY_PEAK_LUX = 128_000.0
CLOUD_ATTENUATION = 0.75
TWILIGHT_FLOOR_LUX = 100.0

CACHE_TTL_SECONDS = 300.0  # 5 min
_UA = "red5-elc/0.1 (+scheduling.weather)"


# ---------------------------------------------------------------------------
# Fetcher protocol -- injected in tests so we don't hit the real API.
# Signature: (latitude, longitude) -> {"YYYY-MM-DDTHH:00": cloud_cover_pct}
# ---------------------------------------------------------------------------
CloudCoverFetcher = Callable[[float, float], dict[str, float]]


def open_meteo_fetch(latitude: float, longitude: float, *, timeout: float = 8.0) -> dict[str, float]:
    """Fetch hourly cloud-cover for the next ~48h from Open-Meteo.

    Returns a dict mapping ISO8601 local-timezone timestamps (as returned
    by the API, no timezone suffix) → cloud_cover percent (0–100).

    Raises :class:`WeatherFetchError` on network / decode failures so
    the caller can decide whether to fall back to a clear-sky estimate.
    """
    url = (
        "https://api.open-meteo.com/v1/forecast"
        f"?latitude={latitude}&longitude={longitude}"
        "&hourly=cloud_cover&forecast_days=3&timezone=UTC"
    )
    req = urllib.request.Request(url, headers={"User-Agent": _UA})
    ctx = ssl.create_default_context()
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as r:
            payload = json.loads(r.read().decode("utf-8"))
    except (urllib.error.URLError, TimeoutError, ValueError, OSError) as e:
        raise WeatherFetchError(f"open-meteo fetch failed: {e}") from e
    hourly = payload.get("hourly") or {}
    times = hourly.get("time") or []
    covers = hourly.get("cloud_cover") or []
    if not times or len(times) != len(covers):
        raise WeatherFetchError("open-meteo response missing hourly.cloud_cover")
    return {t: float(c) for t, c in zip(times, covers) if c is not None}


class WeatherFetchError(Exception):
    """Upstream weather API failed / returned unusable data."""


# ---------------------------------------------------------------------------
# Cache -- one entry per (lat, lon) rounded to 3 decimals (~110 m).
# ---------------------------------------------------------------------------
_CACHE: dict[tuple[float, float], tuple[float, dict[str, float]]] = {}
# key -> (fetched_at_epoch, cloud_cover_by_iso_hour)


def _cache_key(loc: Location) -> tuple[float, float]:
    return (round(loc.latitude, 3), round(loc.longitude, 3))


def clear_cache() -> None:
    """Test helper -- flushes the in-process cache."""
    _CACHE.clear()


def _get_cloud_cover_map(
    loc: Location,
    *,
    now_epoch: float,
    fetcher: CloudCoverFetcher,
) -> dict[str, float]:
    key = _cache_key(loc)
    hit = _CACHE.get(key)
    if hit is not None and (now_epoch - hit[0]) < CACHE_TTL_SECONDS:
        return hit[1]
    covers = fetcher(loc.latitude, loc.longitude)
    _CACHE[key] = (now_epoch, covers)
    return covers


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------
def outdoor_lux(
    loc: Location,
    at: datetime,
    *,
    weather_enabled: bool = True,
    fetcher: CloudCoverFetcher = open_meteo_fetch,
    now_epoch: float | None = None,
) -> float:
    """Estimated horizontal illuminance in lux at ``at`` for ``loc``.

    * ``weather_enabled=False`` bypasses the API entirely and uses a
      clear-sky (cloud_cover=0) model.  Useful in unit tests and when
      the operator has intentionally turned weather off.
    * Fetch failures degrade to clear-sky, never raise.  Lux is a
      convenience input; the scheduler must not stall on transient
      network flakes.
    """
    elev_deg = solar_elevation(loc, at)
    if elev_deg <= 0.0:
        return TWILIGHT_FLOOR_LUX

    cloud_pct = 0.0
    if weather_enabled:
        try:
            covers = _get_cloud_cover_map(
                loc, now_epoch=now_epoch or time.time(), fetcher=fetcher,
            )
            cloud_pct = _lookup_hour(covers, at)
        except WeatherFetchError:
            cloud_pct = 0.0  # graceful fallback

    clear_sky = CLEAR_SKY_PEAK_LUX * math.sin(math.radians(elev_deg))
    cloud_factor = 1.0 - (cloud_pct / 100.0) * CLOUD_ATTENUATION
    return max(TWILIGHT_FLOOR_LUX, clear_sky * cloud_factor)


def _lookup_hour(covers: dict[str, float], at: datetime) -> float:
    """Find the cloud_cover value for the hour bucket containing ``at``.

    Open-Meteo is called with ``timezone=UTC`` so the keys are of the
    form ``2026-02-15T13:00`` (UTC).  We convert ``at`` to UTC and
    look up the top-of-hour key.  If missing (edge of the forecast
    window or a DST off-by-one), scan a few neighbouring hours.
    """
    at_utc = at.astimezone(_UTC)
    key = at_utc.strftime("%Y-%m-%dT%H:00")
    if key in covers:
        return covers[key]
    for delta in (-1, 1, -2, 2):
        alt = (at_utc + timedelta(hours=delta)).strftime("%Y-%m-%dT%H:00")
        if alt in covers:
            return covers[alt]
    return 0.0  # no data → assume clear sky


# UTC constant used above.
from datetime import timezone as _dt_timezone  # noqa: E402
_UTC = _dt_timezone.utc


# ---------------------------------------------------------------------------
# Preview helper -- returns hourly lux estimates over the next N hours,
# used by the schedule /preview endpoint so the UI can plot a curve.
# ---------------------------------------------------------------------------
def hourly_lux_forecast(
    loc: Location,
    from_dt: datetime,
    hours: int = 24,
    *,
    weather_enabled: bool = True,
    fetcher: CloudCoverFetcher = open_meteo_fetch,
) -> list[tuple[datetime, float]]:
    """Return ``[(at, lux), ...]`` on the hour starting from
    ``from_dt`` (rounded down to the top of the hour) for ``hours``
    hours forward."""
    out: list[tuple[datetime, float]] = []
    base = from_dt.replace(minute=0, second=0, microsecond=0)
    for h in range(hours):
        at = base + timedelta(hours=h)
        lux = outdoor_lux(loc, at, weather_enabled=weather_enabled, fetcher=fetcher)
        out.append((at, lux))
    return out


__all__ = [
    "CACHE_TTL_SECONDS",
    "CloudCoverFetcher",
    "WeatherFetchError",
    "clear_cache",
    "hourly_lux_forecast",
    "open_meteo_fetch",
    "outdoor_lux",
]

# unused import guard for ``date`` -- kept for future date-only lookups
_ = date
