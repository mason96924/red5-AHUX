"""
elc.util.astro
==============
Sunrise / sunset / civil-twilight computation for the operator's
site coordinates.  Wraps :mod:`astral` so callers get a small,
JSON-friendly dict of ISO strings + minutes-since-midnight.

Used by:
  * ``GET /api/elc/sun-times`` -- returns today's (or a given date's)
    events, applying the project's ``sunrise_offset_min`` /
    ``sunset_offset_min`` from ``configs/project.json``.
  * Astronomical schedules (Phase 4) -- rules like "on 15 min before
    sunset, off 30 min after sunrise" resolve to concrete UTC
    timestamps here.

Astral is pure-Python and works offline -- important for embedded
site controllers that may not have internet access at boot.  ~30 s
accuracy for civilian use, plenty for lighting schedules.
"""
from __future__ import annotations

from datetime import date, datetime, timezone
from zoneinfo import ZoneInfo

from astral import LocationInfo
from astral.sun import sun


def sun_times_for(
    latitude: float,
    longitude: float,
    tz_name: str,
    *,
    on: date | None = None,
    sunrise_offset_min: int = 0,
    sunset_offset_min: int = 0,
) -> dict:
    """Compute today's (or ``on``'s) solar events at the given site.

    Returns a JSON-serialisable dict:
        {
          "date": "2026-02-11",
          "timezone": "Asia/Kolkata",
          "dawn":    "05:35:12",   # civil dawn (sun 6° below)
          "sunrise": "05:59:49",   # rim above horizon + offset
          "solar_noon": "12:24:58",
          "sunset":  "18:50:07",   # rim below horizon + offset
          "dusk":    "19:14:44",   # civil dusk
          "sunrise_offset_min": 0,
          "sunset_offset_min":  0,
          "day_length_min": 771,
        }

    Times are local-clock in the operator's timezone (``tz_name``).
    Applied offsets shift ``sunrise`` and ``sunset`` only -- civil
    twilight boundaries are un-shifted for the astronomical reference.
    """
    tz = ZoneInfo(tz_name)
    d = on or datetime.now(tz).date()
    loc = LocationInfo(
        name="site", region="",
        timezone=tz_name,
        latitude=latitude, longitude=longitude,
    )
    events = sun(loc.observer, date=d, tzinfo=tz)
    sr = events["sunrise"]
    ss = events["sunset"]
    # Apply operator offsets (in-minutes) to sunrise/sunset only.
    from datetime import timedelta
    sr_shifted = sr + timedelta(minutes=sunrise_offset_min)
    ss_shifted = ss + timedelta(minutes=sunset_offset_min)
    day_length_min = int((ss - sr).total_seconds() // 60)
    return {
        "date": d.isoformat(),
        "timezone": tz_name,
        "latitude": latitude,
        "longitude": longitude,
        "dawn":       events["dawn"].strftime("%H:%M:%S"),
        "sunrise":    sr_shifted.strftime("%H:%M:%S"),
        "solar_noon": events["noon"].strftime("%H:%M:%S"),
        "sunset":     ss_shifted.strftime("%H:%M:%S"),
        "dusk":       events["dusk"].strftime("%H:%M:%S"),
        "sunrise_offset_min": sunrise_offset_min,
        "sunset_offset_min":  sunset_offset_min,
        "day_length_min": day_length_min,
        "sunrise_utc": sr_shifted.astimezone(timezone.utc).isoformat(),
        "sunset_utc":  ss_shifted.astimezone(timezone.utc).isoformat(),
    }
