"""
elc.scheduling.evaluator
========================
Pure rule engine.  No I/O, no clock, no side effects: functions take a
``now`` datetime + an :class:`EvalContext` and return whether a rule
would fire, plus the next N times it *will* fire.

Rule schema (stored in ``schedules.rules_json``)::

    {
        "trigger": {
            "type": "tod" | "sunrise" | "sunset" |
                    "civil_dawn" | "civil_dusk" | "lux",
            "at": "HH:MM",                # required iff type == "tod"
            "offset_minutes": -30,         # optional, sun-events only
            "lux_below": 400,              # required iff type == "lux"
        },
        "action": "on" | "off",
        "days": ["mon","tue","wed","thu","fri","sat","sun"],  # optional
                                                              # (default: all)
        "date_range": {"from":"YYYY-MM-DD","to":"YYYY-MM-DD"},# optional
        "exclude_dates": ["YYYY-MM-DD", ...],                 # optional
    }

Every rule matches on:
    1. Day-of-week gate (``days``, default = every day).
    2. Date range gate (``date_range``, default = unbounded).
    3. Excluded-dates gate (``exclude_dates``, default = none).
    4. Trigger firing:
         * "tod"    → the given HH:MM on that day, in the controller tz.
         * sun-*    → sun_event(loc, date) + offset_minutes.
         * "lux"    → whenever ``outdoor_lux(loc, at) < lux_below`` and
                      the previous sample was ≥ threshold.  Preview
                      returns the *next* crossing point sampled hourly.

Public functions:
    * validate(rule)               → raises RuleError on bad schema
    * should_fire(rule, now, ctx)  → bool (60-second window)
    * next_fire_times(rule, from_dt, ctx, count=5) → list of
                                     :class:`Firing` events
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, time, timedelta
from typing import Any

from elc.scheduling import astro, weather
from elc.scheduling.astro import Location, sun_events

# ---------------------------------------------------------------------------
# Types
# ---------------------------------------------------------------------------
class RuleError(Exception):
    """Rule payload is malformed or references unknown values."""


@dataclass(frozen=True)
class Firing:
    """One scheduled firing of a rule.  ``reason`` is a short human
    string the UI shows in the preview panel, e.g. "sunset −30 min",
    "lux < 400 (cloudy)"."""
    at: datetime
    action: str
    reason: str


@dataclass(frozen=True)
class EvalContext:
    """Everything the evaluator needs beyond the rule itself.

    ``weather_enabled`` and ``fetcher`` are only consulted for ``lux``
    triggers.  Time-of-day / sun triggers are pure functions of
    (loc, date).
    """
    location: Location
    weather_enabled: bool = True
    fetcher: weather.CloudCoverFetcher = weather.open_meteo_fetch


# Canonical day-of-week codes -- Python's %A gives locale-dependent
# strings so we hand-roll to keep the rule payload locale-agnostic.
DOW_CODES: tuple[str, ...] = ("mon", "tue", "wed", "thu", "fri", "sat", "sun")

SUN_TRIGGER_TYPES = frozenset({"sunrise", "sunset", "civil_dawn", "civil_dusk", "noon"})
ALL_TRIGGER_TYPES = SUN_TRIGGER_TYPES | {"tod", "lux"}

_SHOULD_FIRE_WINDOW = timedelta(seconds=30)  # ± window around target moment


# ---------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------
def validate(rule: Any) -> None:
    """Raise :class:`RuleError` if ``rule`` doesn't match the schema.

    Called by the routes layer on POST/PATCH so bad payloads never
    reach the DB.
    """
    if not isinstance(rule, dict):
        raise RuleError("rule must be an object")

    trigger = rule.get("trigger")
    if not isinstance(trigger, dict):
        raise RuleError("rule.trigger must be an object")
    ttype = trigger.get("type")
    if ttype not in ALL_TRIGGER_TYPES:
        raise RuleError(f"trigger.type must be one of {sorted(ALL_TRIGGER_TYPES)}")

    if ttype == "tod":
        _validate_hhmm(trigger.get("at"))
    elif ttype in SUN_TRIGGER_TYPES:
        off = trigger.get("offset_minutes", 0)
        if not isinstance(off, int) or not (-720 <= off <= 720):
            raise RuleError("trigger.offset_minutes must be an int in [-720, 720]")
    elif ttype == "lux":
        thr = trigger.get("lux_below")
        if not isinstance(thr, (int, float)) or thr <= 0:
            raise RuleError("trigger.lux_below must be a positive number")

    action = rule.get("action")
    if action not in ("on", "off"):
        raise RuleError("rule.action must be 'on' or 'off'")

    if "days" in rule:
        days = rule["days"]
        if not isinstance(days, list) or not days:
            raise RuleError("rule.days must be a non-empty array")
        unknown = set(days) - set(DOW_CODES)
        if unknown:
            raise RuleError(f"rule.days has unknown codes: {sorted(unknown)}")

    if "date_range" in rule:
        dr = rule["date_range"]
        if not isinstance(dr, dict) or set(dr.keys()) - {"from", "to"}:
            raise RuleError("rule.date_range must be {from?, to?}")
        for k in ("from", "to"):
            if k in dr:
                _validate_ymd(dr[k])
        if "from" in dr and "to" in dr:
            if date.fromisoformat(dr["from"]) > date.fromisoformat(dr["to"]):
                raise RuleError("rule.date_range.from must be <= date_range.to")

    if "exclude_dates" in rule:
        excl = rule["exclude_dates"]
        if not isinstance(excl, list):
            raise RuleError("rule.exclude_dates must be an array")
        for d in excl:
            _validate_ymd(d)


def _validate_hhmm(s: Any) -> None:
    if not isinstance(s, str) or len(s) != 5 or s[2] != ":":
        raise RuleError("trigger.at must be 'HH:MM'")
    try:
        hh, mm = int(s[:2]), int(s[3:])
    except ValueError as e:
        raise RuleError("trigger.at must be 'HH:MM'") from e
    if not (0 <= hh <= 23 and 0 <= mm <= 59):
        raise RuleError("trigger.at hours 0..23 minutes 0..59")


def _validate_ymd(s: Any) -> None:
    if not isinstance(s, str):
        raise RuleError("date must be 'YYYY-MM-DD'")
    try:
        date.fromisoformat(s)
    except ValueError as e:
        raise RuleError(f"date {s!r} not YYYY-MM-DD") from e


# ---------------------------------------------------------------------------
# Gate helpers
# ---------------------------------------------------------------------------
def _matches_gates(rule: dict, on: date) -> bool:
    """True iff the day-of-week + date-range + exclude gates all admit
    ``on``."""
    days = rule.get("days")
    if days is not None:
        dow_code = DOW_CODES[on.weekday()]
        if dow_code not in days:
            return False
    dr = rule.get("date_range")
    if dr is not None:
        if "from" in dr and on < date.fromisoformat(dr["from"]):
            return False
        if "to" in dr and on > date.fromisoformat(dr["to"]):
            return False
    excl = rule.get("exclude_dates") or []
    if on.isoformat() in excl:
        return False
    return True


# ---------------------------------------------------------------------------
# Target-moment computation
# ---------------------------------------------------------------------------
def _target_moment(rule: dict, on: date, ctx: EvalContext) -> datetime | None:
    """Return the datetime this rule *targets* on the given local
    ``on`` date (in ``ctx.location.timezone``), or ``None`` if the
    trigger doesn't fire on a specific moment (lux triggers).

    Sun events that don't occur on ``on`` (polar night) return ``None``.
    """
    trigger = rule["trigger"]
    ttype = trigger["type"]
    tz = ctx.location.tzinfo
    if ttype == "tod":
        hh, mm = int(trigger["at"][:2]), int(trigger["at"][3:])
        return datetime.combine(on, time(hh, mm), tzinfo=tz)
    if ttype in SUN_TRIGGER_TYPES:
        try:
            events = sun_events(ctx.location, on)
        except astro.NoEventToday:
            return None
        base = events[ttype].astimezone(tz)
        offset = trigger.get("offset_minutes", 0)
        return base + timedelta(minutes=offset)
    return None  # lux -- handled separately


# ---------------------------------------------------------------------------
# Public: should_fire
# ---------------------------------------------------------------------------
def should_fire(
    rule: dict,
    now: datetime,
    ctx: EvalContext,
    *,
    last_lux: float | None = None,
) -> bool:
    """True iff ``now`` falls inside the trigger's firing window.

    * TOD / sun triggers fire in a ± :data:`_SHOULD_FIRE_WINDOW` window
      around the target moment.  The scheduler engine tick rate (~30s)
      is fast enough that the ±30s window catches every event exactly
      once without needing per-schedule state.
    * Lux triggers fire on the transition ``last_lux ≥ threshold``
      → current ``< threshold``.  ``last_lux=None`` means "first tick,
      no history" — we don't fire (avoids spurious startup pulses when
      it's already dark).
    """
    now_local = now.astimezone(ctx.location.tzinfo)
    if not _matches_gates(rule, now_local.date()):
        return False

    ttype = rule["trigger"]["type"]
    if ttype == "lux":
        threshold = rule["trigger"]["lux_below"]
        current_lux = weather.outdoor_lux(
            ctx.location, now, weather_enabled=ctx.weather_enabled, fetcher=ctx.fetcher,
        )
        if last_lux is None:
            return False
        return last_lux >= threshold > current_lux

    target = _target_moment(rule, now_local.date(), ctx)
    if target is None:
        return False
    return abs((now - target).total_seconds()) <= _SHOULD_FIRE_WINDOW.total_seconds()


# ---------------------------------------------------------------------------
# Public: next_fire_times
# ---------------------------------------------------------------------------
def next_fire_times(
    rule: dict,
    from_dt: datetime,
    ctx: EvalContext,
    count: int = 5,
    *,
    horizon_days: int = 90,
) -> list[Firing]:
    """Return up to ``count`` next firings of ``rule`` after ``from_dt``.

    Scans forward day-by-day up to ``horizon_days``.  For lux triggers,
    samples the hourly outdoor-lux forecast and reports every downward
    threshold crossing (up to the caller-provided count).

    ``from_dt`` should be timezone-aware; naive input is treated as
    UTC.
    """
    if from_dt.tzinfo is None:
        from_dt = from_dt.replace(tzinfo=weather._UTC)

    ttype = rule["trigger"]["type"]

    if ttype == "lux":
        return _next_lux_crossings(rule, from_dt, ctx, count, horizon_days)

    out: list[Firing] = []
    tz = ctx.location.tzinfo
    from_local = from_dt.astimezone(tz)
    start_date = from_local.date()

    for day_off in range(horizon_days):
        d = start_date + timedelta(days=day_off)
        if not _matches_gates(rule, d):
            continue
        target = _target_moment(rule, d, ctx)
        if target is None:
            continue
        if target <= from_dt:
            continue
        out.append(Firing(
            at=target,
            action=rule["action"],
            reason=_reason_for(rule, target, ctx),
        ))
        if len(out) >= count:
            break
    return out


def _next_lux_crossings(
    rule: dict, from_dt: datetime, ctx: EvalContext, count: int, horizon_days: int,
) -> list[Firing]:
    threshold = rule["trigger"]["lux_below"]
    action = rule["action"]
    tz = ctx.location.tzinfo

    # Sample hourly for the horizon.  Open-Meteo's free tier only
    # returns 3-day forecasts anyway; capping at 3 * 24h is realistic.
    max_hours = min(horizon_days * 24, 72)
    forecast = weather.hourly_lux_forecast(
        ctx.location, from_dt, hours=max_hours,
        weather_enabled=ctx.weather_enabled, fetcher=ctx.fetcher,
    )

    out: list[Firing] = []
    prev_lux: float | None = None
    for at, lux in forecast:
        at_local = at.astimezone(tz)
        if not _matches_gates(rule, at_local.date()):
            prev_lux = lux
            continue
        if prev_lux is not None and prev_lux >= threshold > lux:
            out.append(Firing(
                at=at,
                action=action,
                reason=f"lux < {int(threshold)} (est. {int(lux)} lx)",
            ))
            if len(out) >= count:
                return out
        prev_lux = lux
    return out


def _reason_for(rule: dict, at: datetime, ctx: EvalContext) -> str:
    trigger = rule["trigger"]
    ttype = trigger["type"]
    tz = ctx.location.tzinfo
    at_local = at.astimezone(tz)
    hhmm = at_local.strftime("%H:%M")
    if ttype == "tod":
        return f"time = {hhmm}"
    if ttype in SUN_TRIGGER_TYPES:
        off = trigger.get("offset_minutes", 0)
        base_label = ttype.replace("_", " ")
        if off == 0:
            return f"{base_label} at {hhmm}"
        sign = "+" if off > 0 else "−"
        return f"{base_label} {sign}{abs(off)}min → {hhmm}"
    return hhmm


__all__ = [
    "ALL_TRIGGER_TYPES",
    "DOW_CODES",
    "EvalContext",
    "Firing",
    "RuleError",
    "SUN_TRIGGER_TYPES",
    "next_fire_times",
    "should_fire",
    "validate",
]
