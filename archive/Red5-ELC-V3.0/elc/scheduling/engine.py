"""
elc.scheduling.engine
=====================
Phase 4 Day 3 — background scheduler runner.

Wires the pure evaluator (:mod:`elc.scheduling.evaluator`) into the
running ELC stack.  Ticks on a fixed period, walks every enabled
schedule, and — for each rule whose firing window contains the current
tick — dispatches ``driver.set_relay(device, state)`` for every device
in every group the schedule is assigned to.

Design principles:
    * **Pure I/O boundary.**  All rule logic lives in the evaluator;
      this file is just plumbing: SQLite reads → evaluator call →
      driver dispatch.
    * **Deterministic tick.**  The engine takes an injectable
      ``clock`` callable (defaults to ``datetime.now(tz=UTC)``) so
      tests can drive it with ``freezegun`` or a fake clock without
      sleeping.
    * **Safe by default.**  A brand-new controller boots with
      ``engine_mode = "dry_run"`` — the engine walks the same code
      path but **does not** call the driver.  Every would-be dispatch
      is still recorded on the ``events`` bus so the operator UI can
      show a "would fire" preview.
    * **No per-schedule cursor.**  Firing windows are ±30s around the
      target moment.  A ~30s tick period therefore catches every rule
      exactly once per day without needing to persist "did we already
      fire this today?" state.  The engine keeps a *tick-local* set
      of ``(schedule_id, rule_idx, target_iso)`` keys to guard against
      the edge case where two consecutive ticks both fall inside the
      same 60s firing window.
    * **Lux history.**  Lux triggers need the previous sample to
      detect a downward crossing; the engine caches the last lux
      value per ``(schedule_id, rule_idx)`` in RAM.

Public surface:
    * :class:`SchedulerEngine`
        * ``start()`` / ``stop()`` — lifecycle
        * ``tick(now=None)`` — single evaluation pass (returns list of
          :class:`Dispatch` for tests / UI preview)
        * ``events`` — :class:`EventBus[dict]` publishing every
          dispatch (real or dry-run)

The engine is wired into :func:`elc.api.app.build_stack` behind a
feature flag so existing tests / demos that don't want a running
scheduler are unaffected.
"""
from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from typing import Any, Awaitable, Callable

from elc.codec.device_id import DeviceId
from elc.config import store as config_store
from elc.domain.bus import EventBus
from elc.drivers.srm import SrmDriver
from elc.scheduling import evaluator, weather
from elc.scheduling.astro import BadLocation, Location

log = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Types
# ---------------------------------------------------------------------------
@dataclass(frozen=True)
class Dispatch:
    """One relay-set decision the engine made this tick.

    ``executed`` is ``False`` in dry-run mode (or if the driver call
    raised).  ``reason`` mirrors :class:`evaluator.Firing.reason` so
    the UI can show "sunset -30min" next to each dispatch line.
    """
    at: datetime
    device: str            # canonical DeviceId string
    state: bool
    schedule_id: str
    schedule_name: str
    rule_index: int
    reason: str
    executed: bool


ClockFn = Callable[[], datetime]


# ---------------------------------------------------------------------------
# Engine
# ---------------------------------------------------------------------------
class SchedulerEngine:
    """Ticks the evaluator against SQLite state and dispatches to the driver.

    Parameters
    ----------
    driver:
        The :class:`SrmDriver` to dispatch relay-set calls through.  The
        engine only ever calls ``driver.set_relay(dev, state)`` — it
        never touches broadcasts, so it can be composed with a
        replica-backed viewer without conflict.
    db_path:
        SQLite config store path.  Passed straight through to
        :mod:`elc.config.store` so tests can point at a temp file.
    tick_seconds:
        Cadence.  Defaults to 30s.  The evaluator's ±30s firing window
        assumes at most ~1 min between ticks; if you push this up
        you'll start missing rules.
    clock:
        Injectable time source.  Defaults to
        ``datetime.now(tz=UTC)``.  Freezegun-compatible.
    """

    _MAX_TICK_SECONDS = 55  # keep the ±30s firing window covered

    def __init__(
        self,
        *,
        driver: SrmDriver,
        db_path: str | None = None,
        tick_seconds: float = 30.0,
        clock: ClockFn | None = None,
        weather_fetcher: weather.CloudCoverFetcher | None = None,
    ) -> None:
        if tick_seconds <= 0 or tick_seconds > self._MAX_TICK_SECONDS:
            raise ValueError(
                f"tick_seconds must be in (0, {self._MAX_TICK_SECONDS}]"
            )
        self._driver = driver
        self._db_path = db_path
        self._tick_seconds = tick_seconds
        self._clock: ClockFn = clock or (lambda: datetime.now(timezone.utc))
        self._weather_fetcher = weather_fetcher or weather.open_meteo_fetch

        self.events: EventBus[dict[str, Any]] = EventBus()

        # RAM-only caches.  Keys: (schedule_id, rule_index).
        self._last_lux: dict[tuple[str, int], float] = {}
        self._fired_targets: dict[tuple[str, int], str] = {}

        self._task: asyncio.Task[None] | None = None
        self._stop_event = asyncio.Event()

    # ---- lifecycle ---------------------------------------------------
    async def start(self) -> None:
        if self._task is not None and not self._task.done():
            return
        self._stop_event.clear()
        self._task = asyncio.create_task(self._run(), name="elc-scheduler")

    async def stop(self) -> None:
        self._stop_event.set()
        if self._task is not None:
            self._task.cancel()
            try:
                await self._task
            except (asyncio.CancelledError, Exception):
                pass
            self._task = None

    @property
    def running(self) -> bool:
        return self._task is not None and not self._task.done()

    # ---- main loop ---------------------------------------------------
    async def _run(self) -> None:
        # First tick fires immediately so operators see live behaviour
        # the moment they flip engine_mode → live.  Subsequent ticks
        # honour the cadence.
        try:
            while not self._stop_event.is_set():
                try:
                    await self.tick()
                except Exception as e:  # never let a bad rule kill the loop
                    log.exception("scheduler tick failed: %s", e)
                    await self.events.publish({
                        "type": "engine_error",
                        "error": str(e),
                        "ts": self._clock().isoformat(),
                    })
                try:
                    await asyncio.wait_for(
                        self._stop_event.wait(), timeout=self._tick_seconds,
                    )
                except asyncio.TimeoutError:
                    continue
        except asyncio.CancelledError:
            return

    # ---- single-pass entry point (public for tests + preview UI) -----
    async def tick(self, now: datetime | None = None) -> list[Dispatch]:
        """One evaluation pass.  Returns every :class:`Dispatch` the
        tick produced (executed or dry-run).  Publishes each on
        :attr:`events` as ``{"type": "dispatch", ...}``.
        """
        now = now if now is not None else self._clock()
        settings = config_store.get_settings(self._db_path)
        ctx = self._build_context(settings)
        if ctx is None:
            return []

        mode = settings.get("engine_mode", "dry_run")
        live = (mode == "live")

        schedules = config_store.list_schedules(self._db_path)
        out: list[Dispatch] = []
        for sched in schedules:
            if not sched.get("enabled"):
                continue
            rules = sched.get("rules") or []
            if not rules:
                continue
            devices = self._devices_for_schedule(sched["id"])
            if not devices:
                continue
            for idx, rule in enumerate(rules):
                dispatches = await self._evaluate_rule(
                    sched=sched,
                    rule=rule,
                    rule_index=idx,
                    devices=devices,
                    ctx=ctx,
                    now=now,
                    live=live,
                )
                out.extend(dispatches)

        # Housekeep: forget fired-target keys older than one day so
        # the dict can't grow unbounded on a long-running controller.
        self._prune_fired_targets(now)
        return out

    # ---- rule evaluation --------------------------------------------
    async def _evaluate_rule(
        self,
        *,
        sched: dict[str, Any],
        rule: dict[str, Any],
        rule_index: int,
        devices: list[str],
        ctx: evaluator.EvalContext,
        now: datetime,
        live: bool,
    ) -> list[Dispatch]:
        try:
            evaluator.validate(rule)
        except evaluator.RuleError as e:
            await self.events.publish({
                "type": "rule_invalid",
                "schedule_id": sched["id"],
                "schedule_name": sched["name"],
                "rule_index": rule_index,
                "error": str(e),
                "ts": now.isoformat(),
            })
            return []

        key = (sched["id"], rule_index)
        ttype = rule["trigger"]["type"]

        # Lux triggers need the previous sample to detect a downward
        # crossing.  Keep the cache in sync even on ticks that don't fire.
        last_lux = self._last_lux.get(key) if ttype == "lux" else None

        try:
            fired = evaluator.should_fire(rule, now, ctx, last_lux=last_lux)
        except Exception as e:
            log.exception("should_fire raised: %s", e)
            return []

        if ttype == "lux":
            # Update history *after* the decision so the transition
            # detector works correctly.
            self._last_lux[key] = weather.outdoor_lux(
                ctx.location, now,
                weather_enabled=ctx.weather_enabled, fetcher=ctx.fetcher,
            )

        if not fired:
            return []

        # Idempotency: refuse to fire the same target twice within a
        # single day.  Sun events shift by a few minutes daily; using
        # the ISO date + hour:minute of the target moment as the key
        # is enough to dedupe adjacent ticks without persisting state.
        target_key = self._target_dedup_key(rule, ctx, now)
        if self._fired_targets.get(key) == target_key:
            return []
        self._fired_targets[key] = target_key

        state = (rule["action"] == "on")
        reason = self._reason(rule, now, ctx)
        out: list[Dispatch] = []
        for dev_str in devices:
            executed = False
            if live:
                try:
                    dev = DeviceId.from_string(dev_str)
                    await self._driver.set_relay(dev, state)
                    executed = True
                except Exception as e:
                    log.exception("dispatch to %s failed: %s", dev_str, e)
            d = Dispatch(
                at=now,
                device=dev_str,
                state=state,
                schedule_id=sched["id"],
                schedule_name=sched["name"],
                rule_index=rule_index,
                reason=reason,
                executed=executed,
            )
            await self.events.publish({
                "type": "dispatch",
                "at": d.at.isoformat(),
                "device": d.device,
                "state": d.state,
                "schedule_id": d.schedule_id,
                "schedule_name": d.schedule_name,
                "rule_index": d.rule_index,
                "reason": d.reason,
                "executed": d.executed,
            })
            out.append(d)
        return out

    # ---- helpers -----------------------------------------------------
    def _build_context(
        self, settings: dict[str, str]
    ) -> evaluator.EvalContext | None:
        try:
            location = Location(
                latitude=float(settings.get("latitude", "0.0")),
                longitude=float(settings.get("longitude", "0.0")),
                timezone=settings.get("timezone", "UTC"),
            )
        except (BadLocation, ValueError) as e:
            log.warning("scheduler: invalid location settings: %s", e)
            return None

        weather_enabled = str(settings.get("weather_enabled", "1")) in ("1", "true")
        holiday_dates = frozenset(
            row["date"] for row in
            config_store.list_calendar_days(kind="holiday", db_path=self._db_path)
        )
        event_dates = frozenset(
            row["date"] for row in
            config_store.list_calendar_days(kind="event", db_path=self._db_path)
        )
        return evaluator.EvalContext(
            location=location,
            weather_enabled=weather_enabled,
            fetcher=self._weather_fetcher,
            holiday_dates=holiday_dates,
            event_dates=event_dates,
        )

    def _devices_for_schedule(self, schedule_id: str) -> list[str]:
        """Every device that inherits ``schedule_id`` via a group.

        De-duplicated across groups; order stable (device_id ASC) so
        dispatch logs are readable.
        """
        with config_store.get_conn(self._db_path) as conn:
            rows = conn.execute(
                """SELECT DISTINCT gm.device_id
                     FROM group_members gm
                     JOIN group_schedules gs ON gs.group_id = gm.group_id
                    WHERE gs.schedule_id = ?
                    ORDER BY gm.device_id""",
                (schedule_id,),
            ).fetchall()
        return [r["device_id"] for r in rows]

    def _target_dedup_key(
        self, rule: dict[str, Any], ctx: evaluator.EvalContext, now: datetime,
    ) -> str:
        """A key that changes across days but not across ticks inside
        the same firing window."""
        ttype = rule["trigger"]["type"]
        local_date = now.astimezone(ctx.location.tzinfo).date()
        if ttype == "lux":
            # Lux transitions can happen multiple times a day (clouds
            # roll in/out); dedupe on the hour instead.
            return f"lux:{local_date.isoformat()}:{now.astimezone(ctx.location.tzinfo).hour}"
        # For TOD / sun triggers, use the target moment's HH:MM which
        # is stable across the ±30s window.
        target = evaluator._target_moment(rule, local_date, ctx)  # noqa: SLF001
        if target is None:
            return f"{ttype}:{local_date.isoformat()}:none"
        return f"{ttype}:{local_date.isoformat()}:{target.strftime('%H:%M')}"

    def _reason(
        self, rule: dict[str, Any], now: datetime, ctx: evaluator.EvalContext,
    ) -> str:
        """Human-readable firing reason for dispatch logs."""
        ttype = rule["trigger"]["type"]
        if ttype == "lux":
            thr = rule["trigger"]["lux_below"]
            return f"lux < {int(thr)}"
        target = evaluator._target_moment(  # noqa: SLF001
            rule, now.astimezone(ctx.location.tzinfo).date(), ctx,
        )
        if target is None:
            return ttype
        return evaluator._reason_for(rule, target, ctx)  # noqa: SLF001

    def _prune_fired_targets(self, now: datetime) -> None:
        """Drop dedup keys whose date component is >1 day behind ``now``."""
        cutoff = (now - timedelta(days=1)).date().isoformat()
        stale = [
            k for k, v in self._fired_targets.items()
            if _iso_date_in(v) < cutoff
        ]
        for k in stale:
            del self._fired_targets[k]


# Extract "YYYY-MM-DD" from a dedup key like "tod:2026-02-14:07:30"
def _iso_date_in(dedup_key: str) -> str:
    parts = dedup_key.split(":")
    return parts[1] if len(parts) >= 2 else "0000-00-00"


__all__ = ["Dispatch", "SchedulerEngine"]
