"""Astro layer tests — sun events at known lat/lon, DST awareness."""
from __future__ import annotations

from datetime import date

import pytest

from elc.scheduling.astro import (
    BadLocation,
    Location,
    NoEventToday,
    solar_elevation,
    sun_event,
    sun_events,
)


# ---------------------------------------------------------------------------
# Location construction
# ---------------------------------------------------------------------------
def test_location_rejects_out_of_range_lat() -> None:
    with pytest.raises(BadLocation):
        Location(latitude=95.0, longitude=0.0, timezone="UTC")


def test_location_rejects_bad_timezone() -> None:
    with pytest.raises(BadLocation):
        Location(latitude=0.0, longitude=0.0, timezone="Not/A/Real/Zone")


def test_location_ok() -> None:
    loc = Location(latitude=34.05, longitude=-118.24, timezone="America/Los_Angeles")
    assert loc.latitude == 34.05


# ---------------------------------------------------------------------------
# Sun events at known reference points
# ---------------------------------------------------------------------------
# Los Angeles equinox: sunrise ~06:20 local, sunset ~18:15 local
# (astral / NOAA reference; small variation across years).
def test_sun_events_la_equinox() -> None:
    loc = Location(latitude=34.05, longitude=-118.24, timezone="America/Los_Angeles")
    ev = sun_events(loc, date(2026, 3, 20))  # March equinox 2026
    assert 5 <= ev["sunrise"].hour <= 7
    assert 17 <= ev["sunset"].hour <= 19
    assert ev["civil_dawn"] < ev["sunrise"] < ev["noon"] < ev["sunset"] < ev["civil_dusk"]


def test_sun_events_respect_dst_boundary() -> None:
    """LA DST 2026 starts on 2026-03-08.  Sunrise clock time jumps
    ~1h ahead between 03-07 and 03-09."""
    loc = Location(latitude=34.05, longitude=-118.24, timezone="America/Los_Angeles")
    before = sun_events(loc, date(2026, 3, 7))["sunrise"]
    after = sun_events(loc, date(2026, 3, 9))["sunrise"]
    # Local wall-clock times should differ by roughly +1h (DST spring-forward).
    delta_hours = (after.hour + after.minute / 60) - (before.hour + before.minute / 60)
    assert 0.7 < delta_hours < 1.2, f"expected ~+1h DST jump, got {delta_hours:.2f}h"


def test_sun_event_polar_night_raises() -> None:
    """Nuuk-ish latitude in December has no sunrise on many days."""
    loc = Location(latitude=82.0, longitude=0.0, timezone="UTC")
    with pytest.raises(NoEventToday):
        sun_events(loc, date(2026, 12, 21))


def test_sun_event_unknown_name() -> None:
    loc = Location(latitude=0.0, longitude=0.0, timezone="UTC")
    with pytest.raises(Exception):
        sun_event(loc, date(2026, 6, 21), "high-noon-showdown")


# ---------------------------------------------------------------------------
# Solar elevation
# ---------------------------------------------------------------------------
def test_solar_elevation_positive_at_noon_summer() -> None:
    loc = Location(latitude=34.05, longitude=-118.24, timezone="America/Los_Angeles")
    ev = sun_events(loc, date(2026, 6, 21))  # summer solstice
    noon = ev["noon"]
    # Peak elevation in LA at summer solstice is ~79°.  Allow wide margin.
    assert 60 < solar_elevation(loc, noon) < 90


def test_solar_elevation_negative_at_midnight() -> None:
    loc = Location(latitude=34.05, longitude=-118.24, timezone="America/Los_Angeles")
    ev = sun_events(loc, date(2026, 6, 21))
    midnight = ev["noon"].replace(hour=0, minute=0, second=0, microsecond=0)
    assert solar_elevation(loc, midnight) < 0
