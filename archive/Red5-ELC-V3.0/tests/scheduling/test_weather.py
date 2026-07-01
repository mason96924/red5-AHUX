"""Weather layer tests — cache TTL + graceful degradation + hour lookup."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone

import pytest

from elc.scheduling import weather
from elc.scheduling.astro import Location


LA = Location(latitude=34.05, longitude=-118.24, timezone="America/Los_Angeles")


def _clear_sky_fetcher(latitude: float, longitude: float) -> dict[str, float]:
    """Fetcher stub: 0% clouds for the next 48 hours from 2026-06-21 UTC."""
    base = datetime(2026, 6, 21, 0, 0, tzinfo=timezone.utc)
    return {(base + timedelta(hours=h)).strftime("%Y-%m-%dT%H:00"): 0.0 for h in range(48)}


def _overcast_fetcher(latitude: float, longitude: float) -> dict[str, float]:
    base = datetime(2026, 6, 21, 0, 0, tzinfo=timezone.utc)
    return {(base + timedelta(hours=h)).strftime("%Y-%m-%dT%H:00"): 100.0 for h in range(48)}


@pytest.fixture(autouse=True)
def _flush() -> None:
    weather.clear_cache()


# ---------------------------------------------------------------------------
# outdoor_lux
# ---------------------------------------------------------------------------
def test_outdoor_lux_zero_at_night() -> None:
    at = datetime(2026, 6, 21, 8, 0, tzinfo=timezone.utc)  # 01:00 LA time
    lux = weather.outdoor_lux(LA, at, fetcher=_clear_sky_fetcher)
    assert lux == pytest.approx(weather.TWILIGHT_FLOOR_LUX)


def test_outdoor_lux_high_at_noon_clear() -> None:
    at = datetime(2026, 6, 21, 20, 0, tzinfo=timezone.utc)  # 13:00 LA (DST)
    lux = weather.outdoor_lux(LA, at, fetcher=_clear_sky_fetcher)
    assert lux > 100_000, f"expected > 100k lux clear noon, got {lux:.0f}"


def test_outdoor_lux_lower_when_overcast() -> None:
    at = datetime(2026, 6, 21, 20, 0, tzinfo=timezone.utc)
    clear = weather.outdoor_lux(LA, at, fetcher=_clear_sky_fetcher)
    weather.clear_cache()
    overcast = weather.outdoor_lux(LA, at, fetcher=_overcast_fetcher)
    assert overcast < clear
    # Model attenuates 75% at 100% cloud → expect ~25% of clear-sky value.
    assert 0.15 < (overcast / clear) < 0.35


def test_outdoor_lux_weather_disabled_ignores_fetcher() -> None:
    """When the operator turns weather off, we don't touch the fetcher."""
    calls = []

    def spy_fetcher(lat: float, lon: float) -> dict[str, float]:
        calls.append((lat, lon))
        return {}

    at = datetime(2026, 6, 21, 20, 0, tzinfo=timezone.utc)
    weather.outdoor_lux(LA, at, weather_enabled=False, fetcher=spy_fetcher)
    assert calls == []


def test_outdoor_lux_fetch_failure_falls_back_to_clear_sky() -> None:
    def raising_fetcher(lat: float, lon: float) -> dict[str, float]:
        raise weather.WeatherFetchError("simulated network flake")

    at = datetime(2026, 6, 21, 20, 0, tzinfo=timezone.utc)
    # Should not raise; falls back to clear-sky.
    lux = weather.outdoor_lux(LA, at, fetcher=raising_fetcher)
    assert lux > 100_000


# ---------------------------------------------------------------------------
# Cache TTL
# ---------------------------------------------------------------------------
def test_cache_reused_within_ttl() -> None:
    calls = 0

    def counting_fetcher(lat: float, lon: float) -> dict[str, float]:
        nonlocal calls
        calls += 1
        return _clear_sky_fetcher(lat, lon)

    at = datetime(2026, 6, 21, 20, 0, tzinfo=timezone.utc)
    t = 1_000_000.0
    weather.outdoor_lux(LA, at, fetcher=counting_fetcher, now_epoch=t)
    weather.outdoor_lux(LA, at, fetcher=counting_fetcher, now_epoch=t + 60)
    weather.outdoor_lux(LA, at, fetcher=counting_fetcher, now_epoch=t + 200)
    assert calls == 1


def test_cache_expires_after_ttl() -> None:
    calls = 0

    def counting_fetcher(lat: float, lon: float) -> dict[str, float]:
        nonlocal calls
        calls += 1
        return _clear_sky_fetcher(lat, lon)

    at = datetime(2026, 6, 21, 20, 0, tzinfo=timezone.utc)
    t = 1_000_000.0
    weather.outdoor_lux(LA, at, fetcher=counting_fetcher, now_epoch=t)
    weather.outdoor_lux(LA, at, fetcher=counting_fetcher,
                       now_epoch=t + weather.CACHE_TTL_SECONDS + 1)
    assert calls == 2


# ---------------------------------------------------------------------------
# hourly_lux_forecast
# ---------------------------------------------------------------------------
def test_hourly_lux_forecast_has_expected_count() -> None:
    at = datetime(2026, 6, 21, 12, 30, tzinfo=timezone.utc)
    forecast = weather.hourly_lux_forecast(LA, at, hours=24, fetcher=_clear_sky_fetcher)
    assert len(forecast) == 24
    # First sample rounded down to top-of-hour.
    assert forecast[0][0].minute == 0
    # Lux values are non-negative.
    assert all(lux >= 0 for _, lux in forecast)
