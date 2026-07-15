"""
elc.scheduling.astro
====================
Sun / twilight events for a given (lat, lon, IANA timezone, date).

Wraps the ``astral`` library which handles DST + edge cases (polar
night, midnight sun) correctly.  We expose a tiny surface so the
evaluator doesn't need to know about astral internals.

Also exposes :func:`solar_elevation` for the weather-layer's outdoor-lux
estimate: solar elevation angle in degrees at a given moment.
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from astral import LocationInfo, Observer
from astral.sun import elevation as _astral_elevation
from astral.sun import sun as _astral_sun

# ---------------------------------------------------------------------------
# Exceptions
# ---------------------------------------------------------------------------
class AstroError(Exception):
    """Base for anything this module raises deliberately."""


class BadLocation(AstroError):
    """Invalid lat / lon / timezone."""


class NoEventToday(AstroError):
    """Requested sun event does not occur on the given date at this
    latitude (e.g. polar night → no sunrise).  Rare but real."""


# ---------------------------------------------------------------------------
# Public types
# ---------------------------------------------------------------------------
@dataclass(frozen=True)
class Location:
    """Where the controller physically is.  Immutable so it can be
    hashed for weather-cache keys."""
    latitude: float
    longitude: float
    timezone: str      # IANA identifier, e.g. "America/Los_Angeles"

    def __post_init__(self) -> None:
        if not (-90.0 <= self.latitude <= 90.0):
            raise BadLocation(f"latitude {self.latitude} out of range")
        if not (-180.0 <= self.longitude <= 180.0):
            raise BadLocation(f"longitude {self.longitude} out of range")
        try:
            ZoneInfo(self.timezone)
        except ZoneInfoNotFoundError as e:
            raise BadLocation(f"unknown timezone {self.timezone!r}") from e

    @property
    def tzinfo(self) -> ZoneInfo:
        return ZoneInfo(self.timezone)


# Set of sun-event names we support.  Kept in sync with the evaluator's
# rule schema.
SUN_EVENTS: tuple[str, ...] = ("sunrise", "sunset", "civil_dawn", "civil_dusk", "noon")


# ---------------------------------------------------------------------------
# Sun events
# ---------------------------------------------------------------------------
def sun_events(loc: Location, on: date) -> dict[str, datetime]:
    """Return every supported sun event for ``on`` at ``loc``, keyed by
    canonical name.  Values are timezone-aware datetimes in ``loc.timezone``.

    astral's field names:
        dawn      → civil_dawn (civil twilight begin)
        sunrise   → sunrise
        noon      → solar noon
        sunset    → sunset
        dusk      → civil_dusk (civil twilight end)
    """
    info = LocationInfo(
        name="controller", region="", timezone=loc.timezone,
        latitude=loc.latitude, longitude=loc.longitude,
    )
    try:
        raw = _astral_sun(info.observer, date=on, tzinfo=loc.tzinfo)
    except ValueError as e:
        # astral raises ValueError for polar cases: "Sun is always below
        # the horizon on this day, at this location."
        raise NoEventToday(str(e)) from e
    return {
        "sunrise":    raw["sunrise"],
        "sunset":     raw["sunset"],
        "civil_dawn": raw["dawn"],
        "civil_dusk": raw["dusk"],
        "noon":       raw["noon"],
    }


def sun_event(loc: Location, on: date, event: str) -> datetime:
    """Convenience: single named event.  Raises :class:`AstroError` if
    ``event`` isn't a known name."""
    if event not in SUN_EVENTS:
        raise AstroError(f"unknown sun event {event!r} (expected one of {SUN_EVENTS})")
    return sun_events(loc, on)[event]


# ---------------------------------------------------------------------------
# Solar elevation (used by the weather layer to estimate outdoor lux)
# ---------------------------------------------------------------------------
def solar_elevation(loc: Location, at: datetime) -> float:
    """Sun's altitude above the horizon in degrees at ``at``.  Negative
    = below horizon (twilight or night).  Used by the weather layer's
    lux estimate."""
    observer = Observer(latitude=loc.latitude, longitude=loc.longitude)
    return float(_astral_elevation(observer, dateandtime=at))
