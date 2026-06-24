"""models/data.py -- Pydantic response models for /api/data.

Phase L.34 (2026-06-24): adds a typed response shape to the dashboard's
single largest endpoint.  Previously the handler returned raw `list[dict]`
straight from `_build_snapshot()` (the simulator).  That works at runtime
but offers:

  * no contract a frontend developer can grep
  * no auto-generated OpenAPI schema
  * no field-level validation of telemetry values

This module declares the snapshot shape verbatim from the current
simulator output -- adopting Pydantic does NOT change the wire format.
The dashboard continues to receive the exact same JSON; we just gain a
schema-checked boundary on every response.

Loose-typed sub-objects (`AHUPoints` / `VAVPoints`) intentionally stay as
`Dict[str, float | int | str | None]` because the real BACnet bridge can
surface arbitrary point lists from the controller -- the demo's 26-key
shape is a subset.  Locking those down would break operators whose
schemas include manufacturer-specific point names.
"""
from __future__ import annotations

from typing import Dict, List, Optional, Union

from pydantic import BaseModel, ConfigDict, Field

# Loose telemetry-point dict.  Values are mostly floats but a few BACnet
# alarms come back as bool/int and the bridge translates to 0/1; the
# Open-Meteo `weather_code` comes back as int; some operator schemas use
# strings for "OCC" (OCCUPIED/UNOCCUPIED).  Union keeps the wire format
# untouched while still validating types at the boundary.
PointValue = Union[float, int, str, bool, None]


class PsyPoint(BaseModel):
    """One of the three plotted dots in the chart (OA / SA / RA)."""
    model_config = ConfigDict(extra="allow")
    label: str
    t: float = Field(..., description="Dry-bulb temperature, deg C")
    rh: float = Field(..., description="Relative humidity, 0-100 percent")
    w: float = Field(..., description="Humidity ratio, kg-water / kg-dry-air")
    color: str = Field(..., description="Hex stroke colour, e.g. '#3b82f6'")


class VAVSnapshot(BaseModel):
    """Per-VAV terminal telemetry."""
    model_config = ConfigDict(extra="allow")
    id: str
    t: float
    rh: float
    w: float
    h: float = Field(..., description="Enthalpy, kJ/kg")
    all_points: Dict[str, PointValue] = Field(default_factory=dict)


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


class AHUSnapshot(BaseModel):
    """One AHU's complete state -- this is what /api/data returns N of."""
    model_config = ConfigDict(extra="allow")
    id: str
    procColor: str = Field(..., description="Hex colour for the AHU's chart trace + pill")
    source: str = Field(..., description="'demo' | 'live'")
    points: List[PsyPoint] = Field(..., min_length=1)
    all_points: Dict[str, PointValue] = Field(default_factory=dict)
    vavs: List[VAVSnapshot] = Field(default_factory=list)
    active_band: Optional[ActiveBand] = None
    g36: Optional[G36State] = None


# /api/data returns a bare top-level array of AHUs.  FastAPI accepts
# `response_model=List[AHUSnapshot]` to validate that shape.
SnapshotList = List[AHUSnapshot]
