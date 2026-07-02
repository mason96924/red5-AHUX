"""Scheduler engine tests — tick, dispatch, dry-run vs live, dedupe.

The engine is a thin plumbing layer around the pure evaluator, so
these tests focus on:

  * A live-mode tick dispatches to every device in every group
    assigned to a firing schedule (and only those).
  * A dry-run tick evaluates the same rules but never calls the driver.
  * Consecutive ticks inside the ±30s firing window fire the rule
    exactly once (dedup guard).
  * Lux triggers see the previous sample on the second tick.
  * Location/timezone are read from the config settings store.
  * Disabled schedules are skipped.
  * Rule validation errors are surfaced on the events bus but don't
    kill the tick.
  * Start/stop wires the background asyncio task cleanly.
"""
from __future__ import annotations

import asyncio
import json
import os
import sqlite3
import tempfile
from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock
from zoneinfo import ZoneInfo

import pytest

from elc.config import store as cs
from elc.scheduling.engine import Dispatch, SchedulerEngine

LA_TZ = ZoneInfo("America/Los_Angeles")


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------
@pytest.fixture
def db_path(tmp_path):
    p = str(tmp_path / "config.db")
    cs.init(p)
    return p


@pytest.fixture
def la_settings(db_path):
    """Point the scheduler at Los Angeles so sun-events are deterministic."""
    cs.update_settings(
        {
            "latitude": "34.05",
            "longitude": "-118.24",
            "timezone": "America/Los_Angeles",
            "weather_enabled": "0",
            "engine_mode": "live",
        },
        db_path=db_path,
    )
    return db_path


def _make_driver() -> MagicMock:
    """Return a driver mock whose set_relay is an AsyncMock."""
    driver = MagicMock()
    driver.set_relay = AsyncMock()
    return driver


def _seed_group_with_devices(db_path: str, name: str, devices: list[str]) -> str:
    g = cs.create_group(name, "#ff9900", db_path=db_path)
    for d in devices:
        cs.add_group_member(g["id"], d, db_path=db_path)
    return g["id"]


def _seed_schedule(
    db_path: str, name: str, rules: list[dict], enabled: bool = True
) -> str:
    s = cs.create_schedule(name, "#00ff00", rules, enabled=enabled, db_path=db_path)
    return s["id"]


def _assign(db_path: str, group_id: str, schedule_id: str, priority: int = 0) -> None:
    cs.assign_schedule(group_id, schedule_id, priority=priority, db_path=db_path)


# ---------------------------------------------------------------------------
# Basic tick behaviour
# ---------------------------------------------------------------------------
class TestTick:
    @pytest.mark.asyncio
    async def test_fires_tod_rule_in_live_mode(self, la_settings) -> None:
        db_path = la_settings
        gid = _seed_group_with_devices(
            db_path, "morning", ["SRM/1/10/0", "SRM/1/20/0"]
        )
        sid = _seed_schedule(
            db_path, "morning-on",
            [{"trigger": {"type": "tod", "at": "07:00"}, "action": "on"}],
        )
        _assign(db_path, gid, sid)

        driver = _make_driver()
        # 07:00 America/Los_Angeles == 15:00 UTC in Feb (PST → UTC-8).
        now = datetime(2026, 2, 14, 15, 0, 0, tzinfo=timezone.utc)
        engine = SchedulerEngine(
            driver=driver, db_path=db_path, clock=lambda: now,
        )

        out = await engine.tick(now)

        assert driver.set_relay.await_count == 2
        assert {d.device for d in out} == {"SRM/1/10/0", "SRM/1/20/0"}
        assert all(d.state is True for d in out)
        assert all(d.executed for d in out)

    @pytest.mark.asyncio
    async def test_dry_run_evaluates_but_does_not_dispatch(self, la_settings) -> None:
        db_path = la_settings
        cs.update_settings({"engine_mode": "dry_run"}, db_path=db_path)

        gid = _seed_group_with_devices(db_path, "g", ["SRM/1/10/0"])
        sid = _seed_schedule(
            db_path, "s",
            [{"trigger": {"type": "tod", "at": "07:00"}, "action": "on"}],
        )
        _assign(db_path, gid, sid)

        driver = _make_driver()
        now = datetime(2026, 2, 14, 15, 0, 0, tzinfo=timezone.utc)
        engine = SchedulerEngine(driver=driver, db_path=db_path, clock=lambda: now)

        out = await engine.tick(now)

        driver.set_relay.assert_not_awaited()
        assert len(out) == 1
        assert out[0].executed is False
        assert out[0].state is True

    @pytest.mark.asyncio
    async def test_disabled_schedule_is_skipped(self, la_settings) -> None:
        db_path = la_settings
        gid = _seed_group_with_devices(db_path, "g", ["SRM/1/10/0"])
        sid = _seed_schedule(
            db_path, "s",
            [{"trigger": {"type": "tod", "at": "07:00"}, "action": "on"}],
            enabled=False,
        )
        _assign(db_path, gid, sid)

        driver = _make_driver()
        now = datetime(2026, 2, 14, 15, 0, 0, tzinfo=timezone.utc)
        engine = SchedulerEngine(driver=driver, db_path=db_path, clock=lambda: now)

        assert await engine.tick(now) == []
        driver.set_relay.assert_not_awaited()

    @pytest.mark.asyncio
    async def test_rule_outside_firing_window_does_nothing(self, la_settings) -> None:
        db_path = la_settings
        gid = _seed_group_with_devices(db_path, "g", ["SRM/1/10/0"])
        sid = _seed_schedule(
            db_path, "s",
            [{"trigger": {"type": "tod", "at": "07:00"}, "action": "on"}],
        )
        _assign(db_path, gid, sid)

        driver = _make_driver()
        # 09:00 LA — two hours after target, outside ±30s window.
        now = datetime(2026, 2, 14, 17, 0, 0, tzinfo=timezone.utc)
        engine = SchedulerEngine(driver=driver, db_path=db_path, clock=lambda: now)

        assert await engine.tick(now) == []
        driver.set_relay.assert_not_awaited()


# ---------------------------------------------------------------------------
# Idempotency guard: two consecutive ticks inside the same firing window
# ---------------------------------------------------------------------------
class TestDedupe:
    @pytest.mark.asyncio
    async def test_two_ticks_fire_once(self, la_settings) -> None:
        db_path = la_settings
        gid = _seed_group_with_devices(db_path, "g", ["SRM/1/10/0"])
        sid = _seed_schedule(
            db_path, "s",
            [{"trigger": {"type": "tod", "at": "07:00"}, "action": "on"}],
        )
        _assign(db_path, gid, sid)

        driver = _make_driver()
        now = datetime(2026, 2, 14, 15, 0, 0, tzinfo=timezone.utc)
        engine = SchedulerEngine(driver=driver, db_path=db_path, clock=lambda: now)

        out1 = await engine.tick(now)
        # 20s later — still inside the ±30s window, but same target moment.
        out2 = await engine.tick(now.replace(second=20))

        assert len(out1) == 1
        assert out2 == []
        assert driver.set_relay.await_count == 1


# ---------------------------------------------------------------------------
# Multiple groups / schedules
# ---------------------------------------------------------------------------
class TestFanOut:
    @pytest.mark.asyncio
    async def test_dispatches_to_every_group_member(self, la_settings) -> None:
        db_path = la_settings
        gid1 = _seed_group_with_devices(db_path, "a", ["SRM/1/10/0"])
        gid2 = _seed_group_with_devices(db_path, "b", ["SRM/1/20/0", "SRM/1/30/0"])
        sid = _seed_schedule(
            db_path, "everyone",
            [{"trigger": {"type": "tod", "at": "07:00"}, "action": "off"}],
        )
        _assign(db_path, gid1, sid)
        _assign(db_path, gid2, sid)

        driver = _make_driver()
        now = datetime(2026, 2, 14, 15, 0, 0, tzinfo=timezone.utc)
        engine = SchedulerEngine(driver=driver, db_path=db_path, clock=lambda: now)

        out = await engine.tick(now)
        devices = sorted({d.device for d in out})
        assert devices == ["SRM/1/10/0", "SRM/1/20/0", "SRM/1/30/0"]
        assert all(d.state is False for d in out)

    @pytest.mark.asyncio
    async def test_device_in_two_groups_dispatched_once(self, la_settings) -> None:
        """If a device is in multiple groups both tied to the same
        schedule, we still dispatch to it exactly once."""
        db_path = la_settings
        gid1 = _seed_group_with_devices(db_path, "a", ["SRM/1/10/0"])
        gid2 = _seed_group_with_devices(db_path, "b", ["SRM/1/10/0"])
        sid = _seed_schedule(
            db_path, "s",
            [{"trigger": {"type": "tod", "at": "07:00"}, "action": "on"}],
        )
        _assign(db_path, gid1, sid)
        _assign(db_path, gid2, sid)

        driver = _make_driver()
        now = datetime(2026, 2, 14, 15, 0, 0, tzinfo=timezone.utc)
        engine = SchedulerEngine(driver=driver, db_path=db_path, clock=lambda: now)

        out = await engine.tick(now)
        assert [d.device for d in out] == ["SRM/1/10/0"]
        assert driver.set_relay.await_count == 1


# ---------------------------------------------------------------------------
# Events bus
# ---------------------------------------------------------------------------
class TestEvents:
    @pytest.mark.asyncio
    async def test_publishes_dispatch_events(self, la_settings) -> None:
        db_path = la_settings
        gid = _seed_group_with_devices(db_path, "g", ["SRM/1/10/0"])
        sid = _seed_schedule(
            db_path, "s",
            [{"trigger": {"type": "tod", "at": "07:00"}, "action": "on"}],
        )
        _assign(db_path, gid, sid)

        driver = _make_driver()
        now = datetime(2026, 2, 14, 15, 0, 0, tzinfo=timezone.utc)
        engine = SchedulerEngine(driver=driver, db_path=db_path, clock=lambda: now)
        received: list[dict] = []
        engine.events.subscribe(received.append)

        await engine.tick(now)
        await asyncio.sleep(0)
        await asyncio.sleep(0)

        dispatches = [e for e in received if e["type"] == "dispatch"]
        assert len(dispatches) == 1
        e = dispatches[0]
        assert e["device"] == "SRM/1/10/0"
        assert e["state"] is True
        assert e["executed"] is True
        assert e["schedule_id"] == sid
        assert e["reason"] == "time = 07:00"

    @pytest.mark.asyncio
    async def test_invalid_rule_emits_event_and_skips(self, la_settings) -> None:
        db_path = la_settings
        gid = _seed_group_with_devices(db_path, "g", ["SRM/1/10/0"])
        # Bad rule: missing 'at' for tod trigger.
        sid = _seed_schedule(
            db_path, "bad",
            [{"trigger": {"type": "tod"}, "action": "on"}],
        )
        _assign(db_path, gid, sid)

        driver = _make_driver()
        now = datetime(2026, 2, 14, 15, 0, 0, tzinfo=timezone.utc)
        engine = SchedulerEngine(driver=driver, db_path=db_path, clock=lambda: now)
        received: list[dict] = []
        engine.events.subscribe(received.append)

        out = await engine.tick(now)
        await asyncio.sleep(0)

        assert out == []
        driver.set_relay.assert_not_awaited()
        invalids = [e for e in received if e["type"] == "rule_invalid"]
        assert len(invalids) == 1
        assert invalids[0]["schedule_id"] == sid


# ---------------------------------------------------------------------------
# Sun-event triggers (LA at civil dusk).
# ---------------------------------------------------------------------------
class TestSunTrigger:
    @pytest.mark.asyncio
    async def test_sunset_trigger_fires_near_target(self, la_settings) -> None:
        """Rather than pin sunset to an exact second, ask the evaluator
        for the next firing and drive the tick at that moment."""
        from elc.scheduling.evaluator import EvalContext, next_fire_times
        from elc.scheduling.astro import Location

        db_path = la_settings
        gid = _seed_group_with_devices(db_path, "g", ["SRM/1/10/0"])
        sid = _seed_schedule(
            db_path, "dusk",
            [{"trigger": {"type": "sunset"}, "action": "on"}],
        )
        _assign(db_path, gid, sid)

        # Look up the actual sunset moment via the evaluator.
        loc = Location(34.05, -118.24, "America/Los_Angeles")
        ctx = EvalContext(location=loc, weather_enabled=False, fetcher=lambda a, b: {})
        rule = {"trigger": {"type": "sunset"}, "action": "on"}
        fires = next_fire_times(
            rule,
            datetime(2026, 2, 14, 12, 0, tzinfo=timezone.utc),
            ctx,
            count=1,
        )
        assert fires, "expected sunset firing within horizon"
        target = fires[0].at

        driver = _make_driver()
        engine = SchedulerEngine(driver=driver, db_path=db_path, clock=lambda: target)
        out = await engine.tick(target)

        assert len(out) == 1
        assert out[0].device == "SRM/1/10/0"
        assert out[0].state is True
        assert "sunset" in out[0].reason


# ---------------------------------------------------------------------------
# Lifecycle: start / stop the background task
# ---------------------------------------------------------------------------
class TestLifecycle:
    @pytest.mark.asyncio
    async def test_start_and_stop(self, la_settings) -> None:
        driver = _make_driver()
        engine = SchedulerEngine(
            driver=driver, db_path=la_settings, tick_seconds=0.05,
        )
        await engine.start()
        assert engine.running is True
        # Let a few ticks fire (no schedules seeded → no-ops).
        await asyncio.sleep(0.12)
        await engine.stop()
        assert engine.running is False

    def test_rejects_bad_tick_seconds(self) -> None:
        driver = _make_driver()
        with pytest.raises(ValueError):
            SchedulerEngine(driver=driver, db_path=":memory:", tick_seconds=0)
        with pytest.raises(ValueError):
            SchedulerEngine(driver=driver, db_path=":memory:", tick_seconds=120)


# ---------------------------------------------------------------------------
# Bad settings → engine no-ops (no crash)
# ---------------------------------------------------------------------------
class TestSettingsGuard:
    @pytest.mark.asyncio
    async def test_missing_timezone_falls_back_gracefully(self, db_path) -> None:
        # Deliberately don't call la_settings.  Defaults are lat=0/lon=0/tz=UTC
        # which the evaluator handles without crashing.
        gid = _seed_group_with_devices(db_path, "g", ["SRM/1/10/0"])
        sid = _seed_schedule(
            db_path, "s",
            [{"trigger": {"type": "tod", "at": "12:00"}, "action": "on"}],
        )
        _assign(db_path, gid, sid)

        driver = _make_driver()
        # Default engine_mode is "dry_run", so no dispatch even if fired.
        now = datetime(2026, 2, 14, 12, 0, 0, tzinfo=timezone.utc)
        engine = SchedulerEngine(driver=driver, db_path=db_path, clock=lambda: now)
        out = await engine.tick(now)
        # With defaults, engine_mode=dry_run → executed=False.
        assert all(d.executed is False for d in out)
