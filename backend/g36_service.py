"""Red5 Studio V2.0 - Phase 3a: ASHRAE Guideline 36 single-zone VAV controller.

Pure-Python implementation of the three G36 primitives this product needs:

  1. **Operating-mode state machine** -- 8 modes the AHU rotates through
     based on schedule + outdoor + space conditions:

         occupied / warm_up / cool_down / setback / setup /
         freeze_protection / unoccupied / pre_cooling

  2. **Cooling / Heating / Pressure request counters** -- per-zone vote
     into a building-level Cooling-Request / Heating-Request /
     Static-Pressure-Request count, sampled each tick.

  3. **Trim & Respond reset** -- the G36 supply-air-temperature and
     duct-static-pressure reset algorithm.  Given the current setpoint,
     the request count, and the SPmin/SPmax bounds, returns the new
     setpoint nudged one Trim or Respond increment per tick.

State persists in Mongo (`g36_state`) so the dashboard can read the
latest mode + setpoints between ticks without holding the simulator
process state.  Setpoint mutations are audited via `audit_log.record_audit`.

Phase boundary:
  - This module is BACKEND-ONLY (per user choice "a").  It exposes
    `/api/g36/state/{ahu_id}` for the dashboard and `/api/g36/tick/{ahu_id}`
    for the simulator / test harness to drive it.  No WebSocket yet.

Reference:
  - ASHRAE Guideline 36-2021 §5.1.14 (mode logic),
                              §5.1.15 (T&R),
                              §5.16-5.17 (request voting).
"""
from __future__ import annotations

import os
import uuid
from datetime import datetime, timezone
from typing import Any, Optional, List, Literal

from fastapi import APIRouter, Depends, HTTPException, Request
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field

from audit_log import record_audit


MONGO_URL = os.environ["MONGO_URL"]
DB_NAME   = os.environ["DB_NAME"]

_client = AsyncIOMotorClient(MONGO_URL)
_db = _client[DB_NAME]
g36_col = _db["g36_state"]


router = APIRouter(prefix="/api/g36", tags=["g36"])


# ---------------------------------------------------------------------------
# Constants -- defaults follow ASHRAE 36-2021 Appendix B SI tables.
# ---------------------------------------------------------------------------
OperatingMode = Literal[
    "occupied",
    "warm_up",
    "cool_down",
    "setback",            # unoccupied heating
    "setup",              # unoccupied cooling
    "freeze_protection",
    "unoccupied",
    "pre_cooling",
]

ALL_MODES: tuple[OperatingMode, ...] = (
    "occupied", "warm_up", "cool_down", "setback", "setup",
    "freeze_protection", "unoccupied", "pre_cooling",
)


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------
class G36Setpoints(BaseModel):
    """Operator-tunable setpoints for one AHU."""
    # Comfort
    occ_heating_sp_c: float = Field(default=21.0, description="Occupied heating setpoint (°C)")
    occ_cooling_sp_c: float = Field(default=24.0, description="Occupied cooling setpoint (°C)")
    unocc_heating_sp_c: float = Field(default=16.0, description="Unoccupied heating setpoint (°C)")
    unocc_cooling_sp_c: float = Field(default=27.0, description="Unoccupied cooling setpoint (°C)")
    # Supply-air-temperature reset (T&R)
    sat_min_c: float = Field(default=12.0)
    sat_max_c: float = Field(default=18.0)
    sat_current_c: float = Field(default=13.0)
    # Duct-static-pressure reset (T&R)
    dsp_min_pa: float = Field(default=125.0)
    dsp_max_pa: float = Field(default=500.0)
    dsp_current_pa: float = Field(default=250.0)
    # Mode/T&R timing knobs
    occupancy_now: bool = Field(default=True,
                                description="Schedule says room is occupied right now")
    pre_cool_minutes_remaining: int = Field(default=0,
                                            description="If >0, AHU is in pre-cooling lead time")
    warmup_threshold_c: float = Field(default=2.0,
                                      description="If avg ZAT below heating SP by this much at start of occ window -> warm_up")
    cooldown_threshold_c: float = Field(default=2.0)
    freeze_oat_c: float = Field(default=4.0,
                                description="OAT below this triggers freeze_protection regardless of mode")


class ZoneTelemetry(BaseModel):
    """One zone's current state used for request voting + mode mapping."""
    zone_id: str
    zat_c: float = Field(description="Zone air temperature (°C)")
    cooling_loop_pct: float = Field(default=0.0, ge=0.0, le=100.0,
                                    description="VAV cooling loop output 0-100 %")
    heating_loop_pct: float = Field(default=0.0, ge=0.0, le=100.0,
                                    description="VAV heating loop output 0-100 %")
    damper_pct: float = Field(default=50.0, ge=0.0, le=100.0,
                              description="Damper position 0-100 %")
    airflow_setpoint_cfm: float = Field(default=0.0)
    airflow_actual_cfm: float = Field(default=0.0)


class AhuTick(BaseModel):
    """One simulator/test tick of telemetry for a single AHU."""
    oat_c: float = Field(description="Outdoor air temperature (°C)")
    sat_c: float = Field(description="Current measured supply-air temperature (°C)")
    sa_static_pa: float = Field(default=250.0, description="Current duct static pressure (Pa)")
    zones: List[ZoneTelemetry] = Field(default_factory=list)


class G36State(BaseModel):
    """Aggregate G36 read-back for one AHU."""
    ahu_id: str
    mode: OperatingMode
    mode_reason: str
    cooling_requests: int
    heating_requests: int
    pressure_requests: int
    sat_reset_c: float
    dsp_reset_pa: float
    last_tick_at: Optional[str] = None
    setpoints: G36Setpoints


# ---------------------------------------------------------------------------
# Trim & Respond  (ASHRAE 36-2021 §5.1.15)
# ---------------------------------------------------------------------------
def trim_and_respond(
    sp_current: float,
    requests: int,
    *,
    sp_min: float,
    sp_max: float,
    sp_trim: float,
    sp_response_step: float,
    sp_response_max: float,
    importance: int = 2,
    direction: Literal["decrease_on_request", "increase_on_request"] = "decrease_on_request",
) -> float:
    """One Trim-&-Respond tick.

    `direction` toggles the polarity:
      - `decrease_on_request`  -- e.g. SAT cooling: more requests -> lower SAT
      - `increase_on_request`  -- e.g. DSP: more requests -> higher pressure

    Returns the new setpoint clamped to [sp_min, sp_max].

    Per G36, the algorithm fires every Time period Td (2 min by default):
      - If `requests < importance` -> drift one TRIM step toward the
        more efficient bound (away from the request direction).
      - Else respond by `min(requests * sp_response_step, sp_response_max)`
        toward the requested direction.

    Caller is responsible for ticking on the Td cadence; this function
    is pure arithmetic so it tests cleanly.
    """
    if requests < importance:
        if direction == "decrease_on_request":
            new = sp_current + sp_trim    # release toward warmer
        else:
            new = sp_current - sp_trim    # release toward lower pressure
    else:
        # Cap the response per tick at sp_response_max.
        step = min(abs(requests) * sp_response_step, sp_response_max)
        if direction == "decrease_on_request":
            new = sp_current - step
        else:
            new = sp_current + step
    # Clamp.
    return max(sp_min, min(sp_max, new))


# ---------------------------------------------------------------------------
# Request voting  (ASHRAE 36 §5.16.4 / §5.16.5)
# ---------------------------------------------------------------------------
def count_cooling_requests(zones: List[ZoneTelemetry]) -> int:
    """A zone votes 3 requests when its cooling loop is saturated (>=95%),
    2 when at high output (>=70%), 1 when modulating (>=20%), 0 otherwise.
    Total is the building-level Cooling-Request count used by SAT T&R."""
    total = 0
    for z in zones:
        c = z.cooling_loop_pct
        if c >= 95.0:
            total += 3
        elif c >= 70.0:
            total += 2
        elif c >= 20.0:
            total += 1
    return total


def count_heating_requests(zones: List[ZoneTelemetry]) -> int:
    """Mirror of cooling-requests but for heating loops.  Used by the
    boiler/heating-coil reset (not the SAT reset)."""
    total = 0
    for z in zones:
        h = z.heating_loop_pct
        if h >= 95.0:
            total += 3
        elif h >= 70.0:
            total += 2
        elif h >= 20.0:
            total += 1
    return total


def count_pressure_requests(zones: List[ZoneTelemetry]) -> int:
    """Zone votes a pressure request when its damper is nearly wide open
    (>=95%) AND it's still under-flowing the setpoint by >=10%.  Used
    by the duct-static-pressure T&R reset."""
    total = 0
    for z in zones:
        if z.damper_pct < 95.0:
            continue
        if z.airflow_setpoint_cfm <= 0:
            continue
        gap = (z.airflow_setpoint_cfm - z.airflow_actual_cfm) / z.airflow_setpoint_cfm
        if gap >= 0.10:
            total += 1
    return total


# ---------------------------------------------------------------------------
# 8-mode state machine  (ASHRAE 36 §5.1.14)
# ---------------------------------------------------------------------------
def compute_operating_mode(tick: AhuTick, sp: G36Setpoints) -> tuple[OperatingMode, str]:
    """Pick one of the 8 operating modes given the current tick.

    Precedence (highest to lowest):
      1. freeze_protection (OAT below freeze threshold)
      2. pre_cooling (lead-time before occupancy when warm)
      3. occupied  -> warm_up (cold) / cool_down (hot) / occupied (in band)
      4. unoccupied -> setback (heat call) / setup (cool call) / unoccupied
    """
    # Average zone temperature for the broad-stroke mode decision.
    if tick.zones:
        avg_zat = sum(z.zat_c for z in tick.zones) / len(tick.zones)
    else:
        avg_zat = (sp.occ_heating_sp_c + sp.occ_cooling_sp_c) / 2.0

    # 1) Freeze protection wins over everything.
    if tick.oat_c <= sp.freeze_oat_c:
        return "freeze_protection", (
            f"OAT {tick.oat_c:.1f}°C <= freeze threshold {sp.freeze_oat_c:.1f}°C"
        )

    # 2) Pre-cooling (lead-time before occupancy when day forecast is hot).
    if sp.pre_cool_minutes_remaining > 0 and not sp.occupancy_now:
        return "pre_cooling", (
            f"Pre-cooling lead-time, {sp.pre_cool_minutes_remaining} min remaining"
        )

    # 3) Occupied branch -- warm-up / cool-down / occupied steady.
    if sp.occupancy_now:
        if avg_zat < sp.occ_heating_sp_c - sp.warmup_threshold_c:
            return "warm_up", (
                f"Avg ZAT {avg_zat:.1f}°C is >{sp.warmup_threshold_c:.1f}°C below "
                f"heating SP {sp.occ_heating_sp_c:.1f}°C at start of occ window"
            )
        if avg_zat > sp.occ_cooling_sp_c + sp.cooldown_threshold_c:
            return "cool_down", (
                f"Avg ZAT {avg_zat:.1f}°C is >{sp.cooldown_threshold_c:.1f}°C above "
                f"cooling SP {sp.occ_cooling_sp_c:.1f}°C at start of occ window"
            )
        return "occupied", (
            f"Avg ZAT {avg_zat:.1f}°C inside occupied band "
            f"[{sp.occ_heating_sp_c:.1f}, {sp.occ_cooling_sp_c:.1f}]°C"
        )

    # 4) Unoccupied branch.
    if avg_zat < sp.unocc_heating_sp_c:
        return "setback", (
            f"Avg ZAT {avg_zat:.1f}°C below unoccupied heating SP "
            f"{sp.unocc_heating_sp_c:.1f}°C"
        )
    if avg_zat > sp.unocc_cooling_sp_c:
        return "setup", (
            f"Avg ZAT {avg_zat:.1f}°C above unoccupied cooling SP "
            f"{sp.unocc_cooling_sp_c:.1f}°C"
        )
    return "unoccupied", (
        f"Avg ZAT {avg_zat:.1f}°C inside unoccupied band "
        f"[{sp.unocc_heating_sp_c:.1f}, {sp.unocc_cooling_sp_c:.1f}]°C"
    )


# ---------------------------------------------------------------------------
# Mongo helpers (per-AHU document)
# ---------------------------------------------------------------------------
async def _load(ahu_id: str) -> dict:
    """Return the persisted state doc, seeding with defaults if absent."""
    doc = await g36_col.find_one({"ahu_id": ahu_id}, {"_id": 0})
    if doc:
        return doc
    sp = G36Setpoints()
    seed = {
        "ahu_id": ahu_id,
        "mode": "unoccupied",
        "mode_reason": "Initial seed; no telemetry tick received yet.",
        "cooling_requests": 0,
        "heating_requests": 0,
        "pressure_requests": 0,
        "sat_reset_c": sp.sat_current_c,
        "dsp_reset_pa": sp.dsp_current_pa,
        "last_tick_at": None,
        "setpoints": sp.model_dump(),
    }
    await g36_col.insert_one(dict(seed))
    seed.pop("_id", None)
    return seed


async def _save(ahu_id: str, *, mode: OperatingMode, mode_reason: str,
                cooling: int, heating: int, pressure: int,
                sat: float, dsp: float, setpoints: dict) -> dict:
    """Upsert the AHU state row.  Returns the persisted doc minus _id."""
    now = datetime.now(timezone.utc)
    update = {
        "ahu_id": ahu_id,
        "mode": mode,
        "mode_reason": mode_reason,
        "cooling_requests": cooling,
        "heating_requests": heating,
        "pressure_requests": pressure,
        "sat_reset_c": sat,
        "dsp_reset_pa": dsp,
        "last_tick_at": now,
        "setpoints": setpoints,
    }
    await g36_col.update_one({"ahu_id": ahu_id}, {"$set": update}, upsert=True)
    update["last_tick_at"] = now.isoformat()
    return update


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@router.get("/state/{ahu_id}")
async def get_g36_state(ahu_id: str) -> dict:
    """Return the latest persisted G36 state for one AHU.  Anyone can
    read (it's diagnostic data); mutations require admin."""
    doc = await _load(ahu_id)
    if isinstance(doc.get("last_tick_at"), datetime):
        ts = doc["last_tick_at"]
        if ts.tzinfo is None:
            ts = ts.replace(tzinfo=timezone.utc)
        doc["last_tick_at"] = ts.isoformat()
    return doc


@router.get("/setpoints/{ahu_id}")
async def get_g36_setpoints(ahu_id: str) -> dict:
    doc = await _load(ahu_id)
    return doc.get("setpoints") or G36Setpoints().model_dump()


@router.post("/setpoints/{ahu_id}")
async def update_g36_setpoints(
    ahu_id: str,
    payload: G36Setpoints,
    request: Request,
):
    """Mutate the persisted setpoints.  Audited.  Admin gate enforced
    via the same dep audit_log uses so we don't accept anonymous
    setpoint changes from random callers."""
    # Lazy import to avoid a top-level import cycle with auth.
    from audit_log import _require_admin
    admin = await _require_admin(
        session_token=request.cookies.get("session_token"),
        authorization=request.headers.get("authorization"),
    )

    prev = await _load(ahu_id)
    prev_sp = prev.get("setpoints") or {}
    new_sp = payload.model_dump()

    # Persist.
    await g36_col.update_one(
        {"ahu_id": ahu_id},
        {"$set": {"setpoints": new_sp,
                  "last_setpoint_change_at": datetime.now(timezone.utc)}},
        upsert=True,
    )

    # Audit (best-effort).
    await record_audit(
        request, admin, None,
        action="g36-setpoint",
        resource=f"ahu:{ahu_id}",
        before=prev_sp,
        after=new_sp,
    )

    return {"ok": True, "ahu_id": ahu_id, "setpoints": new_sp}


@router.post("/tick/{ahu_id}")
async def post_g36_tick(ahu_id: str, tick: AhuTick) -> dict:
    """Drive one G36 evaluation tick.

    The simulator / test harness POSTs the current outdoor/supply/zone
    state; we recompute mode + request counts + T&R reset values and
    persist.  This endpoint is open (no admin gate) so the simulator
    process can drive it without a session token -- in production this
    would be replaced by an internal scheduled task hitting the same
    function directly.

    Returns the freshly-computed `G36State`.
    """
    prev = await _load(ahu_id)
    sp_dict = prev.get("setpoints") or {}
    sp = G36Setpoints(**sp_dict) if sp_dict else G36Setpoints()

    # 1) Operating mode.
    mode, reason = compute_operating_mode(tick, sp)

    # 2) Request voting.
    cooling = count_cooling_requests(tick.zones)
    heating = count_heating_requests(tick.zones)
    pressure = count_pressure_requests(tick.zones)

    # 3) Trim & Respond on SAT (cooling) and DSP (pressure).  Heating
    #    reset is intentionally omitted from this Phase-3a scope; the
    #    counter is exposed for the dashboard chip but does not drive a
    #    setpoint yet.
    sat_prev = float(prev.get("sat_reset_c", sp.sat_current_c))
    dsp_prev = float(prev.get("dsp_reset_pa", sp.dsp_current_pa))

    # SAT reset is GATED to cooling-aware modes -- holding SAT during
    # warm-up / freeze / setback would fight the heating coils.
    if mode in ("occupied", "cool_down", "pre_cooling", "setup"):
        sat_new = trim_and_respond(
            sat_prev, cooling,
            sp_min=sp.sat_min_c, sp_max=sp.sat_max_c,
            sp_trim=0.1, sp_response_step=0.1, sp_response_max=0.6,
            importance=2,
            direction="decrease_on_request",
        )
    else:
        sat_new = sat_prev

    # DSP reset runs whenever the fan is on (any mode except unoccupied/
    # freeze-protection where the fan may be off).
    if mode not in ("unoccupied", "freeze_protection"):
        dsp_new = trim_and_respond(
            dsp_prev, pressure,
            sp_min=sp.dsp_min_pa, sp_max=sp.dsp_max_pa,
            sp_trim=10.0, sp_response_step=15.0, sp_response_max=60.0,
            importance=2,
            direction="increase_on_request",
        )
    else:
        dsp_new = dsp_prev

    doc = await _save(ahu_id, mode=mode, mode_reason=reason,
                      cooling=cooling, heating=heating, pressure=pressure,
                      sat=sat_new, dsp=dsp_new, setpoints=sp.model_dump())
    return doc


@router.get("/modes")
async def list_modes() -> dict:
    """Static list of the 8 operating modes for the UI legend."""
    return {"modes": list(ALL_MODES)}


# ---------------------------------------------------------------------------
# Auto-tick hook for the /api/data simulator pipeline.
# ---------------------------------------------------------------------------
async def auto_tick_from_ahu_dict(
    ahu_id: str,
    ahu_dict: dict,
    *,
    throttle_seconds: int = 120,
) -> Optional[dict]:
    """Process one G36 evaluation tick directly from a synthesized AHU
    dict (the kind the /api/data simulator emits).  Returns the persisted
    state, or None on any error -- callers MUST NOT depend on the return
    value, and a G36 failure must NEVER block the /api/data response.

    Mode + request counts refresh on every call so the dashboard chip is
    always current.  Trim-&-Respond is throttled to one step per
    `throttle_seconds` (default 120 s = ASHRAE 36 Td) so the SAT/DSP
    resets walk on the canonical 2-minute cadence even though /api/data
    is polled every 5-8 seconds by the dashboard.
    """
    try:
        prev = await _load(ahu_id)
        sp_dict = prev.get("setpoints") or {}
        sp = G36Setpoints(**sp_dict) if sp_dict else G36Setpoints()

        ap = ahu_dict.get("all_points") or {}
        vavs = ahu_dict.get("vavs") or []
        zones: List[ZoneTelemetry] = []
        for v in vavs:
            vp = v.get("all_points") or {}
            zat = float(v.get("t", 22.0))
            zsp = float(vp.get("ZSP", 23.0))
            # Derive cooling/heating loop pct from the zone-temp deviation
            # from setpoint.  ASHRAE-style PI loops would land near these
            # values in steady state given a 0.3-0.4 °C/% gain.
            cooling_pct = max(0.0, min(100.0, (zat - zsp) * 35.0))
            heating_pct = max(0.0, min(100.0, (zsp - zat) * 35.0))
            dpr = float(vp.get("DPR", 50.0))
            af_sp = 1000.0
            af_actual = max(0.0, min(1200.0, dpr * 12.0))
            zones.append(ZoneTelemetry(
                zone_id=str(v.get("id", "?")),
                zat_c=zat,
                cooling_loop_pct=cooling_pct,
                heating_loop_pct=heating_pct,
                damper_pct=dpr,
                airflow_setpoint_cfm=af_sp,
                airflow_actual_cfm=af_actual,
            ))

        tick = AhuTick(
            oat_c=float(ap.get("OAT", 20.0)),
            sat_c=float(ap.get("SAT", 14.0)),
            sa_static_pa=float(ap.get("SADSP", 250.0)),
            zones=zones,
        )

        mode, reason = compute_operating_mode(tick, sp)
        cooling  = count_cooling_requests(tick.zones)
        heating  = count_heating_requests(tick.zones)
        pressure = count_pressure_requests(tick.zones)

        sat_prev = float(prev.get("sat_reset_c", sp.sat_current_c))
        dsp_prev = float(prev.get("dsp_reset_pa", sp.dsp_current_pa))

        # Throttle T&R updates to the ASHRAE-36 Td cadence.
        last = prev.get("last_tick_at")
        if isinstance(last, str):
            try:
                last = datetime.fromisoformat(last.replace("Z", "+00:00"))
            except ValueError:
                last = None
        if isinstance(last, datetime) and last.tzinfo is None:
            last = last.replace(tzinfo=timezone.utc)
        now = datetime.now(timezone.utc)
        elapsed = (now - last).total_seconds() if isinstance(last, datetime) else None
        do_tr = (elapsed is None) or (elapsed >= throttle_seconds)

        sat_new = sat_prev
        dsp_new = dsp_prev
        if do_tr:
            if mode in ("occupied", "cool_down", "pre_cooling", "setup"):
                sat_new = trim_and_respond(
                    sat_prev, cooling,
                    sp_min=sp.sat_min_c, sp_max=sp.sat_max_c,
                    sp_trim=0.1, sp_response_step=0.1, sp_response_max=0.6,
                    importance=2, direction="decrease_on_request",
                )
            if mode not in ("unoccupied", "freeze_protection"):
                dsp_new = trim_and_respond(
                    dsp_prev, pressure,
                    sp_min=sp.dsp_min_pa, sp_max=sp.dsp_max_pa,
                    sp_trim=10.0, sp_response_step=15.0, sp_response_max=60.0,
                    importance=2, direction="increase_on_request",
                )

        return await _save(
            ahu_id, mode=mode, mode_reason=reason,
            cooling=cooling, heating=heating, pressure=pressure,
            sat=sat_new, dsp=dsp_new, setpoints=sp.model_dump(),
        )
    except Exception:  # noqa: BLE001
        # Never let a G36 failure block /api/data.  The dashboard will
        # simply not render the chip on that AHU until the next tick.
        return None
