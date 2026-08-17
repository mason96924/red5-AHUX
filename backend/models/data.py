"""models/data.py -- Pydantic response models for /api/data.

Phase L.34 (2026-06-24): adds a typed response shape to the dashboard's
single largest endpoint.  Previously the handler returned raw `list[dict]`
straight from `_build_snapshot()` (the simulator).

Phase L.35 (2026-06-24): tightened the `all_points` dicts into named
`AHUPoints` / `VAVPoints` models that enumerate every BACnet point the
demo simulator emits today.  `extra="allow"` is preserved on both so
operator-specific points (e.g. manufacturer alarms, chiller-specific
sensors) continue to flow through unchanged -- the named fields are the
documented core, additional fields are tolerated for forward compat.
"""
from __future__ import annotations

from typing import Dict, List, Optional, Union

from pydantic import BaseModel, ConfigDict, Field

PointValue = Union[float, int, str, bool, None]


class PsyPoint(BaseModel):
    """One plotted dot in the chart: OA / SA / RA, plus MA when derivable.

    MA is appended LAST rather than inserted in air-path order, so the
    positional ``points[0..2]`` accesses in the dashboard and the health
    route keep resolving to OA / SA / RA on units with no mixed-air data.
    """
    model_config = ConfigDict(extra="allow")
    label: str
    t: float = Field(..., description="Dry-bulb temperature, deg C")
    rh: float = Field(..., description="Relative humidity, 0-100 percent")
    w: float = Field(..., description="Humidity ratio, kg-water / kg-dry-air")
    color: str = Field(..., description="Hex stroke colour, e.g. '#3b82f6'")
    derived: Optional[bool] = Field(
        None, description="True when the state was computed, not measured. "
                          "A derived MA sits on the OA-RA line by "
                          "construction and is never evidence that it does.")
    basis: Optional[str] = Field(
        None, description="MA only: 'measured' | 'mat' | 'mat+damper' | "
                          "'damper' -- see models/mixing.py")


class AHUPoints(BaseModel):
    """Canonical 26-point BACnet schema emitted per AHU by the demo simulator.

    Field names mirror the V1.9 BACnet bridge spelling so the dashboard's
    ``ahu.all_points.SAT`` accesses still resolve.  Every value is a 5-decimal
    sensor reading (no integer flags) -- alarms come back as 0.0 / 1.0 floats
    so the simulator output round-trips through the BACnet object types
    unchanged.  Every field is ``Optional`` because a real operator's
    controller may not wire every sensor (e.g. some AHUs lack a humidifier).
    """
    model_config = ConfigDict(extra="allow")
    # Outdoor / supply / return / exhaust air sensors (deg C, % RH)
    OAT: Optional[float] = Field(None, description="Outdoor-air temperature, deg C")
    OAH: Optional[float] = Field(None, description="Outdoor-air RH, 0-100 percent")
    SAT: Optional[float] = Field(None, description="Supply-air temperature, deg C")
    SAH: Optional[float] = Field(None, description="Supply-air RH, 0-100 percent")
    RAT: Optional[float] = Field(None, description="Return-air temperature, deg C")
    RAH: Optional[float] = Field(None, description="Return-air RH, 0-100 percent")
    # Mixed air.  MAT is usually already present in the field as the freeze /
    # low-limit sensor; MAH almost never is.  Both optional -- see
    # models/mixing.py for what the chart can and cannot conclude from each.
    MAT: Optional[float] = Field(None, description="Mixed-air temperature, deg C")
    MAH: Optional[float] = Field(None, description="Mixed-air RH, 0-100 percent")
    # Fans -- Modbus/BACnet status, speed, power, alarm
    SAFM: Optional[float] = Field(None, description="Supply fan MODE: 0=off, 1=auto")
    EAFM: Optional[float] = Field(None, description="Exhaust fan MODE: 0=off, 1=auto")
    SAFS: Optional[float] = Field(None, description="Supply fan STATUS: 0=stopped, 1=running")
    EAFS: Optional[float] = Field(None, description="Exhaust fan STATUS: 0=stopped, 1=running")
    SAFP: Optional[float] = Field(None, description="Supply fan SPEED command, 0-100 percent")
    EAFP: Optional[float] = Field(None, description="Exhaust fan SPEED command, 0-100 percent")
    SAFA: Optional[float] = Field(None, description="Supply fan amperage, A")
    AFPC: Optional[float] = Field(None, description="Air-flow / pressure controller setpoint, Pa or percent")
    FMS:  Optional[float] = Field(None, description="Fan master speed reference, 0-100 percent")
    # Damper actuator positions, 0-100 percent
    OAD: Optional[float] = Field(None, description="Outdoor-air damper, 0-100 percent open")
    SAD: Optional[float] = Field(None, description="Supply-air damper, 0-100 percent open")
    RAD: Optional[float] = Field(None, description="Return-air damper, 0-100 percent open")
    EAD: Optional[float] = Field(None, description="Exhaust-air damper, 0-100 percent open")
    # Coils + humidifier valve positions / commands, 0-100 percent
    HCV: Optional[float] = Field(None, description="Heating-coil valve, 0-100 percent open")
    CCV: Optional[float] = Field(None, description="Cooling-coil valve, 0-100 percent open")
    HUM: Optional[float] = Field(None, description="Humidifier output, 0-100 percent")
    HMD: Optional[float] = Field(None, description="Humidifier demand, 0-100 percent")
    # Safety / alarm
    FDPS: Optional[float] = Field(None, description="Filter differential pressure, Pa")
    FZS:  Optional[float] = Field(None, description="Freeze-stat trip status: 0=ok, 1=tripped")
    ALM:  Optional[float] = Field(None, description="Aggregate alarm: 0=ok, 1=any-active")


class VAVPoints(BaseModel):
    """Canonical 8-point BACnet schema emitted per VAV terminal by the demo
    simulator.  Same forward-compat rule as AHUPoints -- extra keys are
    tolerated so an operator wiring per-VAV reheat valves or pressure
    transducers can surface them without a schema change."""
    model_config = ConfigDict(extra="allow")
    t:   Optional[float] = Field(None, description="Zone dry-bulb temperature, deg C")
    rh:  Optional[float] = Field(None, description="Zone RH, 0-100 percent")
    DPR: Optional[float] = Field(None, description="VAV damper position, 0-100 percent")
    VST: Optional[float] = Field(None, description="VAV supply temperature, deg C")
    ZSP: Optional[float] = Field(None, description="Zone setpoint, deg C")
    AFM: Optional[float] = Field(None, description="Airflow MODE: 0=off, 1=auto")
    AFS: Optional[float] = Field(None, description="Airflow STATUS: 0=stopped, 1=running")
    OCC: Optional[float] = Field(None, description="Occupancy: 0=unoccupied, 1=occupied")


class VAVSnapshot(BaseModel):
    """Per-VAV terminal telemetry."""
    model_config = ConfigDict(extra="allow")
    id: str
    t: float
    rh: float
    w: float
    h: float = Field(..., description="Enthalpy, kJ/kg")
    all_points: VAVPoints = Field(default_factory=VAVPoints)


class ActiveBand(BaseModel):
    """Givoni-band controller output (resolved each tick by _resolve_band)."""
    model_config = ConfigDict(extra="allow")
    id: str
    sa_t_sp: float = Field(..., description="Supply-air temperature setpoint, deg C")
    sa_rh_sp: float = Field(..., description="Supply-air RH setpoint, 0-100 percent")
    oa_damper_sp: float = Field(..., description="Outdoor-air damper setpoint, 0-100 percent")
    cc_mode: str = Field(..., description="Cooling-coil mode: OFF / SEN / LAT / RH-CLAMP")
    hc_mode: str = Field(..., description="Heating-coil mode: OFF / ON / RH-CLAMP")
    hum_mode: str = Field(..., description="Humidifier mode: OFF / ON / RH-CLAMP")
    oa_source: str = Field(..., description="'demo' | 'live' | 'open-meteo' etc.")


class G36State(BaseModel):
    """ASHRAE Guideline 36 trim-and-respond controller snapshot."""
    model_config = ConfigDict(extra="allow")
    mode: str = Field(..., description="'occupied' | 'warm_up' | 'cool_down' | ...")
    mode_reason: str
    cooling_requests: int
    heating_requests: int
    pressure_requests: int
    sat_reset_c: float = Field(..., description="Current supply-air-temp reset value, deg C")
    dsp_reset_pa: float = Field(..., description="Current duct-static-pressure reset value, Pa")
    last_tick_at: str = Field(..., description="ISO-8601 UTC timestamp of the last G36 tick")


class MixingState(BaseModel):
    """Mixing-box cross-checks that accompany the MA point.

    Present only when MA could be located at all.  ``mat`` / ``damper`` place
    MA on the OA–RA chord by construction, so off-line distance is not a
    fault.  ``mat+damper`` keeps measured MAT but takes W from OAD — that
    point is often visibly off-chord on mild days (OA≈RA) and is a real
    flag.  ``measured`` (MAT+MAH) exposes both off-chord and damper checks.
    """
    model_config = ConfigDict(extra="allow")
    basis: str = Field(..., description="'measured' | 'mat' | 'mat+damper' | 'damper'")
    oa_fraction: Optional[float] = Field(
        None, description="Outdoor-air mass fraction actually used to place MA, 0-1")
    oa_fraction_raw: Optional[float] = Field(
        None, description="Unclamped fraction; outside 0-1 means MAT is "
                          "impossible for this OA/RA pair")
    oa_fraction_temp: Optional[float] = None
    oa_fraction_humidity: Optional[float] = None
    oa_fraction_damper: Optional[float] = None
    damper_mismatch: Optional[float] = Field(
        None, description="|measured fraction - damper fraction|, 0-1")
    line_deviation_g_kg: Optional[float] = Field(
        None, description="Measured MA minus predicted MA humidity ratio, g/kg. "
                          "Only meaningful when basis == 'measured'.")
    flags: List[str] = Field(default_factory=list)


class AHUSnapshot(BaseModel):
    """One AHU's complete state -- this is what /api/data returns N of."""
    model_config = ConfigDict(extra="allow")
    id: str
    procColor: str = Field(..., description="Hex colour for the AHU's chart trace + pill")
    source: str = Field(..., description="'demo' | 'live'")
    points: List[PsyPoint] = Field(..., min_length=1)
    all_points: AHUPoints = Field(default_factory=AHUPoints)
    vavs: List[VAVSnapshot] = Field(default_factory=list)
    active_band: Optional[ActiveBand] = None
    g36: Optional[G36State] = None
    mixing: Optional[MixingState] = None


# /api/data returns a bare top-level array of AHUs.
SnapshotList = List[AHUSnapshot]

