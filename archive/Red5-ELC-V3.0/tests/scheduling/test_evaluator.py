"""Evaluator tests — validation + should_fire + next_fire_times.

Uses freezegun to pin `datetime.now()` inside the routes layer and
frozen datetimes as inputs elsewhere.
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

import pytest

from elc.scheduling import evaluator, weather
from elc.scheduling.astro import Location
from elc.scheduling.evaluator import (
    ALL_TRIGGER_TYPES,
    EvalContext,
    RuleError,
    next_fire_times,
    should_fire,
    validate,
)


LA = Location(latitude=34.05, longitude=-118.24, timezone="America/Los_Angeles")
LA_TZ = ZoneInfo("America/Los_Angeles")


def _clear_ctx() -> EvalContext:
    def clear(lat: float, lon: float) -> dict[str, float]:
        return {}
    return EvalContext(location=LA, weather_enabled=False, fetcher=clear)


# ---------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------
class TestValidate:
    def test_all_trigger_types_are_documented(self) -> None:
        assert ALL_TRIGGER_TYPES == {
            "tod", "sunrise", "sunset", "civil_dawn", "civil_dusk", "noon", "lux"
        }

    def test_ok_tod(self) -> None:
        validate({"trigger": {"type": "tod", "at": "08:00"}, "action": "on"})

    def test_ok_sunset_with_offset(self) -> None:
        validate({
            "trigger": {"type": "sunset", "offset_minutes": -30},
            "action": "on",
        })

    def test_ok_lux(self) -> None:
        validate({
            "trigger": {"type": "lux", "lux_below": 400},
            "action": "on",
        })

    def test_rejects_non_object(self) -> None:
        with pytest.raises(RuleError):
            validate([])

    def test_rejects_bad_trigger_type(self) -> None:
        with pytest.raises(RuleError):
            validate({"trigger": {"type": "eclipse"}, "action": "on"})

    def test_rejects_bad_tod_format(self) -> None:
        with pytest.raises(RuleError):
            validate({"trigger": {"type": "tod", "at": "8am"}, "action": "on"})

    def test_rejects_bad_action(self) -> None:
        with pytest.raises(RuleError):
            validate({"trigger": {"type": "tod", "at": "08:00"}, "action": "toggle"})

    def test_rejects_out_of_range_offset(self) -> None:
        with pytest.raises(RuleError):
            validate({
                "trigger": {"type": "sunset", "offset_minutes": 9999},
                "action": "on",
            })

    def test_rejects_unknown_day_code(self) -> None:
        with pytest.raises(RuleError):
            validate({
                "trigger": {"type": "tod", "at": "08:00"},
                "action": "on",
                "days": ["monday"],  # must be "mon"
            })

    def test_rejects_reversed_date_range(self) -> None:
        with pytest.raises(RuleError):
            validate({
                "trigger": {"type": "tod", "at": "08:00"},
                "action": "on",
                "date_range": {"from": "2026-12-31", "to": "2026-01-01"},
            })


# ---------------------------------------------------------------------------
# should_fire — TOD trigger
# ---------------------------------------------------------------------------
class TestShouldFire:
    def test_tod_fires_at_exact_moment(self) -> None:
        rule = {"trigger": {"type": "tod", "at": "08:00"}, "action": "on"}
        # 08:00 LA (DST off in Feb) = 16:00 UTC
        now = datetime(2026, 2, 3, 16, 0, tzinfo=timezone.utc)
        assert should_fire(rule, now, _clear_ctx()) is True

    def test_tod_fires_within_30s_window(self) -> None:
        rule = {"trigger": {"type": "tod", "at": "08:00"}, "action": "on"}
        now = datetime(2026, 2, 3, 16, 0, 25, tzinfo=timezone.utc)
        assert should_fire(rule, now, _clear_ctx()) is True

    def test_tod_does_not_fire_at_wrong_minute(self) -> None:
        rule = {"trigger": {"type": "tod", "at": "08:00"}, "action": "on"}
        now = datetime(2026, 2, 3, 16, 2, tzinfo=timezone.utc)
        assert should_fire(rule, now, _clear_ctx()) is False

    def test_dow_gate_blocks_wrong_day(self) -> None:
        # 2026-02-03 is a Tuesday — restrict to Monday only.
        rule = {
            "trigger": {"type": "tod", "at": "08:00"},
            "action": "on",
            "days": ["mon"],
        }
        now = datetime(2026, 2, 3, 16, 0, tzinfo=timezone.utc)
        assert should_fire(rule, now, _clear_ctx()) is False

    def test_dow_gate_admits_matching_day(self) -> None:
        rule = {
            "trigger": {"type": "tod", "at": "08:00"},
            "action": "on",
            "days": ["tue"],
        }
        now = datetime(2026, 2, 3, 16, 0, tzinfo=timezone.utc)
        assert should_fire(rule, now, _clear_ctx()) is True

    def test_exclude_date_blocks(self) -> None:
        rule = {
            "trigger": {"type": "tod", "at": "08:00"},
            "action": "on",
            "exclude_dates": ["2026-02-03"],
        }
        now = datetime(2026, 2, 3, 16, 0, tzinfo=timezone.utc)
        assert should_fire(rule, now, _clear_ctx()) is False


# ---------------------------------------------------------------------------
# should_fire — lux trigger transitions
# ---------------------------------------------------------------------------
class TestLuxShouldFire:
    def _lux_ctx(self) -> EvalContext:
        # Fetcher irrelevant; weather_enabled=False → clear-sky solar model.
        def dummy(lat: float, lon: float) -> dict[str, float]:
            return {}
        return EvalContext(location=LA, weather_enabled=False, fetcher=dummy)

    def test_first_tick_never_fires(self) -> None:
        rule = {"trigger": {"type": "lux", "lux_below": 400}, "action": "on"}
        now = datetime(2026, 6, 21, 8, 0, tzinfo=timezone.utc)  # LA night
        assert should_fire(rule, now, self._lux_ctx(), last_lux=None) is False

    def test_fires_on_downward_crossing(self) -> None:
        rule = {"trigger": {"type": "lux", "lux_below": 400}, "action": "on"}
        # At LA nighttime, lux == TWILIGHT_FLOOR_LUX (100).
        now = datetime(2026, 6, 21, 8, 0, tzinfo=timezone.utc)
        assert should_fire(rule, now, self._lux_ctx(), last_lux=500) is True

    def test_does_not_fire_when_still_dark(self) -> None:
        rule = {"trigger": {"type": "lux", "lux_below": 400}, "action": "on"}
        now = datetime(2026, 6, 21, 8, 0, tzinfo=timezone.utc)
        # Still below threshold; not a fresh crossing.
        assert should_fire(rule, now, self._lux_ctx(), last_lux=200) is False

    def test_does_not_fire_on_upward_crossing(self) -> None:
        """`lux_below` with action `on` means "when it gets dark, lights
        on".  Going *up* through threshold (dawn) must not fire this rule."""
        rule = {"trigger": {"type": "lux", "lux_below": 400}, "action": "on"}
        now = datetime(2026, 6, 21, 20, 0, tzinfo=timezone.utc)  # LA 13:00, bright
        assert should_fire(rule, now, self._lux_ctx(), last_lux=200) is False


# ---------------------------------------------------------------------------
# next_fire_times
# ---------------------------------------------------------------------------
class TestNextFireTimes:
    def test_tod_returns_five_consecutive_days(self) -> None:
        rule = {"trigger": {"type": "tod", "at": "08:00"}, "action": "on"}
        now = datetime(2026, 2, 1, 0, 0, tzinfo=timezone.utc)
        firings = next_fire_times(rule, now, _clear_ctx(), count=5)
        assert len(firings) == 5
        # All at 08:00 LA local.
        for f in firings:
            assert f.at.astimezone(LA_TZ).strftime("%H:%M") == "08:00"
            assert f.action == "on"
        # Consecutive-day spacing.
        for a, b in zip(firings, firings[1:]):
            delta = (b.at - a.at).total_seconds() / 3600
            assert 23 <= delta <= 25, f"unexpected gap {delta}h"

    def test_tod_with_mon_fri_only(self) -> None:
        rule = {
            "trigger": {"type": "tod", "at": "08:00"},
            "action": "on",
            "days": ["mon", "wed", "fri"],
        }
        now = datetime(2026, 2, 1, 0, 0, tzinfo=timezone.utc)  # 2026-02-01 is Sunday
        firings = next_fire_times(rule, now, _clear_ctx(), count=6)
        assert len(firings) == 6
        for f in firings:
            wd = f.at.astimezone(LA_TZ).weekday()
            assert wd in (0, 2, 4), f"weekday {wd} not in mon/wed/fri"

    def test_sunset_offset_reason_string(self) -> None:
        rule = {
            "trigger": {"type": "sunset", "offset_minutes": -30},
            "action": "on",
        }
        now = datetime(2026, 2, 1, 0, 0, tzinfo=timezone.utc)
        firings = next_fire_times(rule, now, _clear_ctx(), count=1)
        assert len(firings) == 1
        assert "sunset" in firings[0].reason
        assert "30min" in firings[0].reason

    def test_lux_crossings_via_hourly_forecast(self) -> None:
        """As the day wanes, lux crosses 400 downward once."""
        rule = {"trigger": {"type": "lux", "lux_below": 400}, "action": "on"}
        # Start at LA sunrise-ish so we see one downward crossing later that day.
        now = datetime(2026, 6, 21, 14, 0, tzinfo=timezone.utc)  # LA ~07:00
        firings = next_fire_times(rule, now, _clear_ctx(), count=2)
        assert len(firings) >= 1
        # First crossing should be evening LA time.
        first_local = firings[0].at.astimezone(LA_TZ)
        assert 17 <= first_local.hour <= 22

    def test_naive_from_dt_treated_as_utc(self) -> None:
        rule = {"trigger": {"type": "tod", "at": "08:00"}, "action": "on"}
        firings = next_fire_times(rule, datetime(2026, 2, 1, 0, 0), _clear_ctx(), count=1)
        assert len(firings) == 1
