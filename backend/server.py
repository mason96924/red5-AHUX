"""Red5 Studio V2.0 - Phase 1 Demo Backend.

FastAPI thin shell that fronts canned V1.9 demo data:
  - equipment_types.json  (the schema editor configs)
  - collector_config.json (BACnet point map)
  - band_guide.csv        (10-band SA strategy matrix)
  - weather_*.json        (Open-Meteo Seattle history)
  - AHU-*_vav_proj.csv    (VAV airflow projections)

Telemetry is SYNTHESIZED -- the controller's live BACnet feed is replaced
with a demo simulator that drives plausible AHU/VAV state from a seasonal
clock and the loaded weather history.  Zero MongoDB, zero auth in Phase 1.

The V1.9 dashboard.html lives at /app/frontend/public/dashboard.html and
calls these endpoints via `window.API_BASE_URL || window.location.origin`.
On the hosted demo it talks to itself (same origin), so no CORS surprises.

Phase boundaries:
  Phase 1 (this file): read-only demo, JSON files, no auth, no DB.
  Phase 2 (later)    : Mongo collections, Google Auth, per-tenant config.
  Phase 3 (later)    : edge-agent that POSTs real BACnet to /api/edge/...
"""
from __future__ import annotations

import csv
import json
import math
import os
import random
import time
from datetime import datetime, timezone
from typing import Any, Optional

from dotenv import load_dotenv
load_dotenv()  # MONGO_URL + DB_NAME live in backend/.env

from fastapi import Depends, FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, PlainTextResponse

ROOT = os.path.dirname(os.path.abspath(__file__))
DEMO_DATA_DIR = os.path.join(ROOT, "demo_data")

app = FastAPI(title="Red5 Studio V2.0 Demo Backend", version="2.0.0-phase2a")
# CORS: allow_credentials=True is REQUIRED for the auth cookie to flow.
# allow_origins=["*"] is INVALID when allow_credentials=True per the CORS spec;
# we restrict to known origins (frontend dev + emergent preview hosts).
_allowed_origins = [
    os.environ.get("FRONTEND_ORIGIN", ""),
    "http://localhost:3000",
    "https://controller-dashboard-2.preview.emergentagent.com",
]
_allowed_origins = [o for o in _allowed_origins if o]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins or ["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Wire the auth router (Phase 2 Piece A).
from auth import router as auth_router  # noqa: E402
app.include_router(auth_router)

# Wire the allowlist router (Phase 2 Piece C).
from allowlist import router as allowlist_router  # noqa: E402
app.include_router(allowlist_router)

# Wire the password-login router (Phase 2 Piece F: emergency admin path).
# Lives alongside the Google OAuth flow and shares the same session_token
# cookie + user_sessions collection, so /api/auth/me and logout work for
# both paths unchanged.
from password_auth import (  # noqa: E402
    router as password_auth_router,
    ensure_password_admin_user,
)
app.include_router(password_auth_router)


@app.on_event("startup")
async def _seed_password_admin() -> None:
    """Idempotent admin-user seed for the password-login path."""
    try:
        await ensure_password_admin_user()
    except Exception as e:  # noqa: BLE001
        print("[startup] ensure_password_admin_user failed: %s" % e)

# Tenant-aware helpers (Phase 2 Piece B).
from tenants import (  # noqa: E402
    current_tenant_optional,
    read_equipment_types,
    write_equipment_types,
    read_sa_rh_clamp,
    write_sa_rh_clamp,
    read_weather_location,
    write_weather_location,
    save_tenant_asset,
    read_tenant_asset,
    list_tenant_assets,
    delete_tenant_asset,
    delete_tenant_directory,
    move_tenant_asset,
    read_collector_config,
    write_collector_config,
    read_map_config,
    write_map_config,
    WeatherLocationUpdate,
)
import base64  # noqa: E402
from fastapi.responses import Response as FastResponse  # noqa: E402


# ---------------------------------------------------------------------------
# Demo data loaders -- cached in-memory after first read.
# ---------------------------------------------------------------------------
_CACHE: dict[str, Any] = {}


def _load_json(name: str) -> Any:
    if name not in _CACHE:
        with open(os.path.join(DEMO_DATA_DIR, name), "r") as f:
            _CACHE[name] = json.load(f)
    return _CACHE[name]


def _load_csv(name: str) -> list[dict]:
    key = "csv:" + name
    if key not in _CACHE:
        with open(os.path.join(DEMO_DATA_DIR, name), "r") as f:
            rows = list(csv.DictReader(f))
        _CACHE[key] = rows
    return _CACHE[key]


# ---------------------------------------------------------------------------
# Demo telemetry simulator.
# ---------------------------------------------------------------------------
SAVED_LOCATIONS = [
    {"lat": -34.92, "lon": 138.60, "name": "NRAH (Adelaide)"},
    {"lat": -31.95, "lon": 115.86, "name": "Perth Children Hospital"},
    {"lat":  37.56, "lon": 127.04, "name": "Hanyang Univ Hospital (Seoul)"},
    {"lat":  39.91, "lon": 116.40, "name": "Beijing Geriatric Hospital"},
    {"lat":  47.60, "lon": -122.30, "name": "Seattle Children's"},
]
ACTIVE_LOCATION = SAVED_LOCATIONS[-1]  # Seattle (full weather year cached)

_DEMO_START_TS = time.time()


def _humidity_ratio(t_c: float, rh: float) -> float:
    """Humidity ratio w [kg/kg] at sea-level pressure (Magnus formula).

    V1.9 collector / psychrometric.js convention: `w` is the DECIMAL form
    (kg of water vapour per kg of dry air, e.g. 0.009).  Dashboard pills
    + animation overlay multiply by 1000 to display g/kg.  Returning the
    g/kg-direct number breaks the chart (points plot at w~9000 instead of 9)
    AND the AHU pill enthalpy field (`getH(t, w)` -> ~23,000 instead of ~45).
    """
    p_ws = 0.6108 * math.exp((17.27 * t_c) / (t_c + 237.3))
    p_w = (rh / 100.0) * p_ws
    # 622 * p_w / (P - p_w) gives g/kg.  Divide by 1000 to match V1.9 contract.
    return (622.0 * p_w / (101.325 - p_w)) / 1000.0


def _enthalpy(t_c: float, w_kgkg: float) -> float:
    """Moist-air enthalpy [kJ/kg dry air].  Matches V1.9 psychrometric.js get_h."""
    return 1.006 * t_c + w_kgkg * (2501.0 + 1.86 * t_c)


# ---------------------------------------------------------------------------
# Markov drift layer (Ornstein-Uhlenbeck style random walk).
#
# Wraps the deterministic beat-of-sines simulator so successive polls show
# small, persistent, mean-reverting fluctuations on top of the underlying
# waveform.  Without this layer the chart looks mechanically periodic.
# With it, every VAV jitters around its sine envelope like a real zone
# responding to door-opens, sun load, and occupancy noise.
#
# Math:   x_{n+1} = alpha * x_n + (1 - alpha) * mean + sigma * N(0, 1)
#         clamped to [-clamp, +clamp] so the drift can never run away.
# State persists per-key in module-level dict; each VAV/equipment driver
# gets its own walk so neighbours look uncorrelated.
# ---------------------------------------------------------------------------
_VAV_DRIFT_STATE: dict[str, dict[str, float]] = {}


def _markov_drift(key: str, sigma_t: float = 0.18, sigma_rh: float = 0.55,
                  alpha: float = 0.92, clamp_t: float = 1.4,
                  clamp_rh: float = 5.5) -> tuple[float, float]:
    """Return (dt, drh) Markov-drift offsets for the given VAV key.

    Stateful: successive calls form an OU random walk that the caller adds
    on top of its deterministic beat-of-sines value.  Defaults are tuned so
    a ~5 s poll interval shows ~0.2-0.6 deg / 0.5-1.5 %RH jitter that
    drifts coherently over ~30-60 s, matching real zone-sensor noise.
    """
    s = _VAV_DRIFT_STATE.get(key)
    if s is None:
        s = {"dt": 0.0, "drh": 0.0}
        _VAV_DRIFT_STATE[key] = s
    s["dt"] = alpha * s["dt"] + sigma_t * random.gauss(0.0, 1.0)
    s["drh"] = alpha * s["drh"] + sigma_rh * random.gauss(0.0, 1.0)
    if s["dt"] > clamp_t:
        s["dt"] = clamp_t
    elif s["dt"] < -clamp_t:
        s["dt"] = -clamp_t
    if s["drh"] > clamp_rh:
        s["drh"] = clamp_rh
    elif s["drh"] < -clamp_rh:
        s["drh"] = -clamp_rh
    return s["dt"], s["drh"]


def _scalar_drift(key: str, sigma: float = 0.25, alpha: float = 0.92,
                  clamp: float = 2.5) -> float:
    """Single-channel OU drift for non-(t, rh) driver points (DPR, VST...)."""
    s = _VAV_DRIFT_STATE.get(key)
    if s is None:
        s = {"v": 0.0}
        _VAV_DRIFT_STATE[key] = s
    s["v"] = alpha * s.get("v", 0.0) + sigma * random.gauss(0.0, 1.0)
    if s["v"] > clamp:
        s["v"] = clamp
    elif s["v"] < -clamp:
        s["v"] = -clamp
    return s["v"]


def _demo_oa_state(now_ts: float) -> dict:
    """Synthesize OA temp/RH from a daily sinusoid.  Peak at 14:00 local."""
    secs = now_ts % 86400.0
    hours = secs / 3600.0
    t = 22.0 + 6.0 * math.sin(2 * math.pi * (hours - 8.0) / 24.0)
    rh = 55.0 - 18.0 * math.sin(2 * math.pi * (hours - 8.0) / 24.0)
    rh = max(20.0, min(95.0, rh))
    return {"t": round(t, 2), "rh": round(rh, 1),
            "w": round(_humidity_ratio(t, rh), 5)}


def _resolve_band(oa_t: float, oa_rh: float) -> dict:
    rows = _load_csv("band_guide.csv")
    for r in rows:
        lo_t = float(r["OA_T_Lo"])
        hi_t = float(r["OA_T_Hi"])
        lo_h = float(r["OA_RH_Lo"])
        hi_h = float(r["OA_RH_Hi"])
        if lo_t <= oa_t <= hi_t and lo_h <= oa_rh <= hi_h:
            return r
    return rows[4]  # PASS-THROUGH default


def _simulate_ahu(ahu_id: str, oa: dict, band: dict, color: str,
                  vav_names: list[str], offset_deg: float = 0.0) -> dict:
    """Build a V1.9-shaped AHU entry (array element of /api/data response)."""
    sa_t = float(band["SA_T_Delivery"]) + offset_deg
    sa_rh = float(band["SA_RH_Delivery"])
    # Synthesize per-VAV state.  Each VAV gets its own phase offset + driver
    # frequency so the terminal hub graphic shows clearly different waveforms
    # rather than a uniform-looking grid.  Amplitudes are tuned to be obvious
    # on a 5-8 second poll without breaking the per-zone realism (zone temps
    # stay 18-27 C, RH stays 25-65%).
    vav_list = []
    t_now = time.time()
    for i, vn in enumerate(vav_names):
        # Two-period beat (~22s and ~95s) so the waveform never looks like
        # a static sine.  Each VAV has its own seed-based offset so adjacent
        # VAVs differ visibly.
        seed   = (i * 1.7 + hash(vn) % 100 * 0.013)
        wave_a = math.sin(t_now / 22.0 + seed)
        wave_b = math.sin(t_now / 95.0 + seed * 0.7)
        # Markov drift on top of the deterministic beat -- gives each zone
        # the look of a real BACnet sensor (door-open dips, sun-load creep,
        # occupancy nudges) instead of a clean sinusoid.  State persists
        # per-VAV across polls (see _markov_drift above).
        d_t, d_rh = _markov_drift(ahu_id + ":" + vn)
        vt  = 22.5 + 2.6 * wave_b + 0.6 * wave_a + d_t       # zone temp 19.9-25.1 + drift
        vrh = 47.0 + 6.5 * (-wave_b) + 2.0 * (-wave_a) + d_rh  # zone RH 38.5-55.5 + drift
        vw  = _humidity_ratio(vt, vrh)
        # VAV-level driver points: damper position (DPR), supply temp (VST),
        # setpoint (ZSP), occupancy (OCC).  Drive the terminal-hub graphic.
        # Each driver gets its own scalar Markov walk so the equipment
        # graphics also breathe instead of pulsing on a fixed clock.
        d_dpr = _scalar_drift(ahu_id + ":" + vn + ":DPR", sigma=0.9, clamp=8.0)
        d_vst = _scalar_drift(ahu_id + ":" + vn + ":VST", sigma=0.08, clamp=0.8)
        dpr = max(0.0, min(100.0, 45.0 + 25.0 * wave_b + 10.0 * wave_a + d_dpr))
        vst = 14.0 + 1.5 * wave_a + d_vst                     # supply ~12.5-15.5
        zsp = 23.0 + 0.5 * math.sin(t_now / 600.0 + seed)    # slow setpoint drift
        afm = max(0.0, min(1.0, 1.0 if dpr > 5.0 else 0.0))  # airflow status
        afs = afm
        vav_list.append({
            "id": vn,
            "t":  round(vt, 2),
            "rh": round(vrh, 1),
            "w":  round(vw, 5),
            "h":  round(_enthalpy(vt, vw), 2),
            "all_points": {
                "t":   round(vt, 2),
                "rh":  round(vrh, 1),
                "DPR": round(dpr, 1),    # damper position
                "VST": round(vst, 2),    # supply temp
                "ZSP": round(zsp, 2),    # zone setpoint
                "AFM": afm,              # airflow manual command
                "AFS": afs,              # airflow status
                "OCC": 1.0,              # occupancy (always on in demo)
            },
        })
    ra_t = sum(v["t"] for v in vav_list) / len(vav_list) if vav_list else 24.0
    ra_rh = sum(v["rh"] for v in vav_list) / len(vav_list) if vav_list else 50.0

    # ---- Equipment-graphic telemetry ---------------------------------------
    # The dashboard's animations (fan rotor, dampers, valves, VFDs, DP
    # switches) read driver points like SAFM/SAFS/OAD/HCV/CCV from
    # `ahu.all_points` -- if these are missing the animations freeze and
    # the M|S pills disable themselves.  Generate plausible values so an
    # operator-saved schema "just lights up" on the demo simulator.
    # Equipment-graphic telemetry: see _MANUAL_OVERRIDES below.
    raw_band_id = band.get("Band", 5)
    try:
        band_id = int(str(raw_band_id).lstrip("B").lstrip("b") or 5)
    except (ValueError, TypeError):
        band_id = 5
    # Fan: run by default (manual-mode pill state stored separately)
    safm = _MANUAL_OVERRIDES.get(ahu_id + ":SAFM", 1.0)   # 1 = manual-on
    eafm = _MANUAL_OVERRIDES.get(ahu_id + ":EAFM", 1.0)
    safs = 1.0 if safm > 0 else 0.0                       # status mirrors manual
    eafs = 1.0 if eafm > 0 else 0.0
    # Fan speed: 55% baseline + 10% per band offset, clamped to [40, 95]
    safp = max(40.0, min(95.0, 55.0 + (band_id - 5) * 4.0))
    eafp = max(40.0, min(95.0, safp - 5.0))
    # Damper positions: driven by band's OA_Damper_SP plus a tiny drift
    oad  = float(band["OA_Damper_SP"]) + 2.0 * math.sin(time.time() / 60.0)
    oad  = max(0.0, min(100.0, oad))
    rad  = 100.0 - oad                                    # return damper inverse
    # Coil valve positions: heating if cold OA, cooling if warm OA
    hcv = max(0.0, min(100.0, (18.0 - oa["t"]) * 6.0))
    ccv = max(0.0, min(100.0, (oa["t"] - 22.0) * 8.0))
    # Humidifier: drive toward SA_RH_Delivery
    hum = max(0.0, min(100.0, (float(band["SA_RH_Delivery"]) - 45.0) * 4.0))
    # Filter loading: 12% baseline + slow ramp; freeze-stat OK in non-cold
    fdps = 12.0 + 4.0 * math.sin(time.time() / 300.0)
    fzs  = 0.0 if oa["t"] > 2.0 else 1.0                  # 1 = tripped
    afpc = round(safp * 1.05, 1)                          # actual ~ commanded
    fms  = round(safp * 1.0, 1)
    safa = round(safp - 2.5, 1)                           # actual hz feedback

    all_points = {
        # legacy 6
        "OAT": oa["t"], "OAH": oa["rh"],
        "SAT": round(sa_t, 2), "SAH": round(sa_rh, 1),
        "RAT": round(ra_t, 2), "RAH": round(ra_rh, 1),
        # fan controls + status
        "SAFM": safm, "EAFM": eafm,
        "SAFS": safs, "EAFS": eafs,
        "SAFP": round(safp, 1), "EAFP": round(eafp, 1),
        "SAFA": safa, "AFPC": afpc, "FMS": fms,
        # damper positions
        "OAD": round(oad, 1), "SAD": round(oad, 1), "RAD": round(rad, 1),
        "EAD": round(oad, 1),
        # coil valves
        "HCV": round(hcv, 1), "CCV": round(ccv, 1),
        # humidifier
        "HUM": round(hum, 1), "HMD": round(hum, 1),
        # filter / freeze
        "FDPS": round(fdps, 1), "FZS": fzs,
        # Alarms (off in demo unless freeze tripped)
        "ALM": 1.0 if fzs > 0 else 0.0,
    }

    return {
        "id": ahu_id,
        "procColor": color,
        "source": "demo",
        "points": [
            {"label": "OA", "t": oa["t"], "rh": oa["rh"],
             "w": oa["w"], "color": "#3b82f6"},
            {"label": "SA", "t": round(sa_t, 2), "rh": round(sa_rh, 1),
             "w": round(_humidity_ratio(sa_t, sa_rh), 5), "color": "#10b981"},
            {"label": "RA", "t": round(ra_t, 2), "rh": round(ra_rh, 1),
             "w": round(_humidity_ratio(ra_t, ra_rh), 5), "color": "#f43f5e"},
        ],
        "all_points": all_points,
        "vavs": vav_list,
        "active_band": {
            "id": band["Band"],
            "sa_t_sp": float(band["SA_T_Delivery"]),
            "sa_rh_sp": float(band["SA_RH_Delivery"]),
            "oa_damper_sp": float(band["OA_Damper_SP"]),
            "cc_mode": band["CC_Mode"],
            "hc_mode": band["HC_Mode"],
            "hum_mode": band["HUM_Mode"],
            "oa_source": "demo",
        },
    }


# Manual override store (process-wide, in-memory).  When the operator clicks
# the AHU equipment-graphic M|S pill we receive `POST /api/write-point` with
# {equipment_name, writes:{SAFM:0|1}}.  Stash the value here keyed by
# "<ahu>:<point>" so the very next `/api/data` poll reflects the toggle
# without needing a real BACnet target.  Anonymous demo state -- lost on
# backend restart (intentional).
_MANUAL_OVERRIDES: dict[str, float] = {}


# Demo AHUs and their VAVs.  Mirrors the configs/AHU-*_vav_proj.csv layout.
_DEMO_AHUS = [
    ("AHU-01-E", "#6366f1",
     ["VAV-1-E-A", "VAV-1-E-B", "VAV-1-E-C", "VAV-1-E-D",
      "VAV-2-E-A", "VAV-2-E-B"]),
    ("AHU-02-S", "#f59e0b",
     ["VAV-1-S-A", "VAV-1-S-B", "VAV-1-S-C",
      "VAV-2-S-A", "VAV-2-S-B"]),
    ("AHU-03-W", "#14b8a6",
     ["VAV-1-W-A", "VAV-1-W-B", "VAV-1-W-C", "VAV-1-W-D"]),
]

# Color palette for simulator-mode (user-configured) AHUs.  Cycled deterministic-
# ally by AHU index so the dashboard's hue mapping is stable across reloads.
_AHU_COLORS = ["#6366f1", "#f59e0b", "#14b8a6", "#a855f7", "#ef4444",
               "#22d3ee", "#84cc16", "#ec4899", "#0ea5e9", "#f97316"]


def _ahus_from_config(cfg: dict) -> list[tuple[str, str, list[str]]]:
    """Translate a user-saved `collector_config.ahu_groups` dict into the
    `(ahu_id, color, vavs)` tuples that `_build_snapshot` already consumes.
    Sorting by ID keeps the dashboard order stable across saves."""
    groups = cfg.get("ahu_groups") or {}
    out: list[tuple[str, str, list[str]]] = []
    for idx, ahu_id in enumerate(sorted(groups.keys())):
        g = groups[ahu_id] or {}
        vavs = g.get("vavs")
        if not isinstance(vavs, list):
            vavs = []
        color = _AHU_COLORS[idx % len(_AHU_COLORS)]
        out.append((ahu_id, color, [str(v) for v in vavs]))
    return out


def _build_snapshot(ahus: Optional[list[tuple[str, str, list[str]]]] = None) -> list:
    """Return a V1.9-shaped /api/data ARRAY (one entry per AHU).  When `ahus`
    is supplied (e.g. from a tenant's saved collector_config) we use it
    verbatim; otherwise we fall back to the bundled demo template."""
    now = time.time()
    oa = _demo_oa_state(now)
    band = _resolve_band(oa["t"], oa["rh"])
    ahu_list = ahus if ahus is not None else _DEMO_AHUS
    return [
        _simulate_ahu(aid, oa, band, color, vavs,
                      offset_deg=((idx % 3) - 1) * 0.3)
        for idx, (aid, color, vavs) in enumerate(ahu_list)
    ]


# ---------------------------------------------------------------------------
# Core endpoints.
# ---------------------------------------------------------------------------
@app.get("/api/health")
async def health() -> dict:
    return {"ok": True, "version": "2.0.0-phase1", "mode": "demo"}


@app.get("/api/version")
async def version() -> dict:
    return {"version": "2.0.0-phase1", "build": "demo", "fork": "V2.0"}


@app.get("/api/data-mode")
async def data_mode(tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    """Reflect the operator's `mock_mode` setting so the dashboard's mode
    toggle shows the right pill on page load.  Signed-in users see their
    saved tenant state; anonymous users see the in-memory anonymous override
    (defaults to whatever the bundled collector_config.json says)."""
    if tenant:
        cfg = await read_collector_config(tenant) or {}
        mock = bool(cfg.get("mock_mode", _bundled_mock_mode_default()))
        groups = cfg.get("ahu_groups") or _load_json("collector_config.json").get("ahu_groups") or {}
        return {"mode": "mock" if mock else "simulator", "live": False,
                "source": "tenant-config", "ahu_count": len(groups)}
    cfg = _anon_effective_config()
    return {"mode": "mock" if cfg.get("mock_mode") else "simulator",
            "live": False, "source": "anon-config",
            "ahu_count": len(cfg.get("ahu_groups") or {})}


@app.get("/api/data")
async def get_data(tenant: Optional[dict] = Depends(current_tenant_optional)) -> list:
    """V1.9 contract: ARRAY of AHU entries.  Dashboard rejects non-array.

    Resolution:
      - Signed-in: tenant's saved collector_config (falling back to bundled
        demo if the tenant hasn't saved one yet).
      - Anonymous: bundled collector_config.json with the in-memory
        anonymous mock_mode override applied.

    `mock_mode:false` + non-empty `ahu_groups` -> snapshot built from those
    AHU/VAV names.  Otherwise -> the bundled `_DEMO_AHUS` template.
    """
    if tenant:
        cfg = await read_collector_config(tenant)
        if cfg is None:
            cfg = _load_json("collector_config.json")
    else:
        cfg = _anon_effective_config()
    if not cfg.get("mock_mode", True):
        ahus = _ahus_from_config(cfg)
        if ahus:
            return _build_snapshot(ahus)
    return _build_snapshot()


@app.post("/api/data-mode")
async def set_data_mode(payload: dict,
                        tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    """Persist Simulator <-> Mock.  Signed-in -> tenant's collector_config;
    anonymous -> a process-wide in-memory override so demo users can also
    toggle without signing in (state is lost on backend restart; that is
    intentional)."""
    desired_mode = (payload.get("mode") or "").lower()
    is_mock = desired_mode == "mock"
    if not tenant:
        _ANON_OVERRIDE["mock_mode"] = is_mock
        return {"success": True, "mode": desired_mode, "persisted": False,
                "scope": "anonymous-in-memory",
                "note": "Anonymous toggle held in server memory; sign in to persist across restarts."}
    cfg = await read_collector_config(tenant) or {}
    if not cfg:
        # First save -> seed from bundled defaults so we don't end up with
        # an empty `ahu_groups` on the tenant record.
        cfg = _load_json("collector_config.json") or {}
    cfg["mock_mode"] = is_mock
    await write_collector_config(tenant, cfg)
    return {"success": True, "mode": desired_mode, "persisted": True,
            "tenant_id": tenant["tenant_id"]}


# ---------------------------------------------------------------------------
# Anonymous mode override (process-wide, in-memory, demo-only).
# ---------------------------------------------------------------------------
_ANON_OVERRIDE: dict = {}  # e.g. {"mock_mode": False}


def _bundled_mock_mode_default() -> bool:
    return bool((_load_json("collector_config.json") or {}).get("mock_mode", True))


def _anon_effective_config() -> dict:
    """Bundled `collector_config.json` with any in-memory anonymous override
    (currently just `mock_mode`) layered on top."""
    cfg = dict(_load_json("collector_config.json") or {})
    if "mock_mode" in _ANON_OVERRIDE:
        cfg["mock_mode"] = _ANON_OVERRIDE["mock_mode"]
    return cfg


@app.get("/api/telemetry-status")
async def telemetry_status(tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    """V1.9-compatible health probe used by the dashboard header chip.

    The chip shows LIVE / SIM / STALE / OFF based on these flags:
      * `live=True` -> the demo simulator is producing data (always true here).
      * `mock_mode` -> reflects the operator's data-source toggle so the
        chip flips between LIVE (mock_mode=false) and SIM (mock_mode=true).
      * `stale=False`, `age_seconds=0` -> demo data is generated on each call.
      * `equipment_count` -> AHU count the dashboard expects to render.
    """
    # Resolve the effective config (tenant-saved -> bundled w/ anon override).
    if tenant:
        cfg = await read_collector_config(tenant) or _load_json("collector_config.json")
    else:
        cfg = _anon_effective_config()
    is_mock = bool(cfg.get("mock_mode", True))
    if not is_mock:
        ahu_count = len((cfg.get("ahu_groups") or {}))
        if ahu_count == 0:
            ahu_count = len(_DEMO_AHUS)
    else:
        ahu_count = len(_DEMO_AHUS)
    now = datetime.now(timezone.utc)
    return {
        "success": True,
        "live": True,
        "polling": True,
        "mock_mode": is_mock,
        "stale": False,
        "stale_s": 0,
        "age_seconds": 0,
        "equipment_count": ahu_count,
        "read_ok": ahu_count,
        "read_errors": 0,
        "timestamp_iso": now.isoformat(),
        "collector_version": "v2.0-demo",
        "mode": "demo",
    }


@app.get("/api/equipment-types")
async def equipment_types(tenant: Optional[dict] = Depends(current_tenant_optional)) -> Any:
    """Signed-in users get THEIR copy (Phase 2 Piece B); anonymous gets demo."""
    if tenant:
        tenant_eq = await read_equipment_types(tenant)
        if tenant_eq:
            return tenant_eq
    return _load_json("equipment_types.json")


@app.get("/api/collector-config")
async def collector_config(tenant: Optional[dict] = Depends(current_tenant_optional)) -> Any:
    """Signed-in users get THEIR saved collector config; anonymous gets the
    bundled demo template with the in-memory anonymous mode override applied
    so the modal's Simulator/Mock pill matches what /api/data is using."""
    if tenant:
        saved = await read_collector_config(tenant)
        if saved:
            return saved
    return _anon_effective_config()


@app.post("/api/collector-config")
async def save_collector_config(payload: dict,
                                tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    """Dashboard COLLECTOR modal posts the whole cfg JSON here.  We persist
    per-tenant when signed in.  Anonymous callers get success:true with a
    `persisted:false` flag so the modal does not show a misleading error --
    the live dashboard still works in demo mode regardless."""
    if not tenant:
        return {
            "success": True,
            "persisted": False,
            "warning": "Demo mode (anonymous) -- sign in to persist collector configuration.",
        }
    res = await write_collector_config(tenant, payload)
    return {
        "success": True,
        "persisted": True,
        "tenant_id": res["tenant_id"],
    }


@app.get("/api/services")
async def services() -> dict:
    return {
        "services": [
            {"name": "telemetry_service",       "ok": True,  "loaded_at": _DEMO_START_TS},
            {"name": "band_service",            "ok": True,  "loaded_at": _DEMO_START_TS},
            {"name": "weather_service",         "ok": True,  "loaded_at": _DEMO_START_TS},
            {"name": "band_overrides_service",  "ok": True,  "loaded_at": _DEMO_START_TS},
            {"name": "bacnet_diag_service",     "ok": False, "loaded_at": None,
             "error": "BACnet stack unavailable in demo mode"},
        ]
    }


@app.get("/api/weather-location")
async def weather_location(tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    if tenant:
        loc = await read_weather_location(tenant)
        if loc:
            return loc
    return {"active": ACTIVE_LOCATION, "saved": SAVED_LOCATIONS}


@app.post("/api/weather-location")
async def set_weather_location(update: WeatherLocationUpdate,
                               tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    """Persist the operator's weather-location pick.  Anonymous = no-op."""
    if not tenant:
        return {"ok": False, "persisted": False,
                "warning": "Sign in to save weather locations."}
    return await write_weather_location(tenant, update)


@app.get("/api/weather-history")
async def weather_history(lat: float = Query(ACTIVE_LOCATION["lat"]),
                          lon: float = Query(ACTIVE_LOCATION["lon"]),
                          year: Optional[int] = None,
                          force: bool = Query(False)) -> Any:
    """Return weather history for (lat, lon, year).

    Resolution order:
      1. Mongo `weather_cache` (per coord+year) — past years are immutable
         and cached forever; current-year cache is refreshed every 24 h.
      2. Bundled demo_data file for Seattle 2020 (offline fallback).
      3. Live open-meteo archive API (real climate for any city).

    All non-2020 responses get their dates re-stamped to the requested year
    so the dashboard's `date.startsWith('YYYY')` filter aligns when we
    serve cached data from a different year.
    """
    import httpx  # local import keeps cold-start fast
    from motor.motor_asyncio import AsyncIOMotorClient

    lat_key = round(float(lat), 2)
    lon_key = round(float(lon), 2)
    target_year = int(year) if year else datetime.now(timezone.utc).year
    is_current_year = target_year == datetime.now(timezone.utc).year

    # ---- 1. Mongo cache ----
    mongo_client = AsyncIOMotorClient(os.environ["MONGO_URL"])
    wx_col = mongo_client[os.environ["DB_NAME"]]["weather_cache"]
    cache_key = {"lat": lat_key, "lon": lon_key, "year": target_year}
    if not force:
        doc = await wx_col.find_one(cache_key, {"_id": 0, "payload": 1, "fetched_at": 1})
        if doc:
            stale = False
            if is_current_year:
                fetched = doc.get("fetched_at")
                if fetched and isinstance(fetched, datetime):
                    if fetched.tzinfo is None:
                        fetched = fetched.replace(tzinfo=timezone.utc)
                    stale = (datetime.now(timezone.utc) - fetched).total_seconds() > 86400
                else:
                    stale = True
            if not stale and doc.get("payload"):
                p = doc["payload"]
                p["_from_cache"] = True
                return p

    # ---- 2. Bundled demo file (Seattle 2020 only) ----
    bundle = os.path.join(DEMO_DATA_DIR, f"weather_{lat_key:.2f}_{lon_key:.2f}_2020.json")
    if os.path.exists(bundle):
        with open(bundle, "r") as f:
            payload = json.load(f)
        if target_year != 2020:
            payload = _restamp_year(payload, target_year)
        return payload

    # ---- 3. Live open-meteo ----
    end_d = f"{target_year}-12-31"
    today_iso = datetime.now(timezone.utc).date().isoformat()
    if end_d > today_iso:
        end_d = today_iso
    params = {
        "latitude": lat_key,
        "longitude": lon_key,
        "start_date": f"{target_year}-01-01",
        "end_date": end_d,
        "hourly": "temperature_2m,relative_humidity_2m",
        "daily": "weather_code",
        "timezone": "auto",
    }
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.get("https://archive-api.open-meteo.com/v1/archive", params=params)
        if r.status_code != 200:
            # Network fallback: serve the bundled Seattle file re-stamped.
            with open(os.path.join(DEMO_DATA_DIR, "weather_47.60_-122.30_2020.json"), "r") as f:
                payload = json.load(f)
            payload = _restamp_year(payload, target_year)
            payload["source"] = "demo-fallback"
            payload["warning"] = f"open-meteo returned {r.status_code}; serving demo data"
            return payload
        data = r.json()
    except Exception as e:  # noqa: BLE001
        with open(os.path.join(DEMO_DATA_DIR, "weather_47.60_-122.30_2020.json"), "r") as f:
            payload = json.load(f)
        payload = _restamp_year(payload, target_year)
        payload["source"] = "demo-fallback"
        payload["warning"] = f"open-meteo unreachable ({e}); serving demo data"
        return payload

    hourly = data.get("hourly") or {}
    times = hourly.get("time") or []
    temps = hourly.get("temperature_2m") or []
    rhs   = hourly.get("relative_humidity_2m") or []
    daily_raw = data.get("daily") or {}
    wc_dates = daily_raw.get("time") or []
    wc_codes = daily_raw.get("weather_code") or []
    weather_codes = {wc_dates[i]: (wc_codes[i] if i < len(wc_codes) else None)
                     for i in range(len(wc_dates))}

    # Aggregate hourly -> daily
    day_bucket: dict[str, dict] = {}
    for i, ts in enumerate(times):
        day = ts[:10]
        t = temps[i] if i < len(temps) else None
        rh = rhs[i] if i < len(rhs) else None
        if t is None or rh is None:
            continue
        day_bucket.setdefault(day, {"temps": [], "rhs": []})
        day_bucket[day]["temps"].append(t)
        day_bucket[day]["rhs"].append(rh)

    daily_out: list[dict] = []
    hourly_out: list[dict] = []
    for day in sorted(day_bucket.keys()):
        d = day_bucket[day]
        h_values = []
        for t, rh in zip(d["temps"], d["rhs"]):
            w_kgkg = _humidity_ratio(t, rh)
            h_values.append(_enthalpy(t, w_kgkg))
        daily_out.append({
            "date": day,
            "temp_min": round(min(d["temps"]), 1),
            "temp_max": round(max(d["temps"]), 1),
            "temp_avg": round(sum(d["temps"]) / len(d["temps"]), 1),
            "rh_min": round(min(d["rhs"])),
            "rh_max": round(max(d["rhs"])),
            "rh_avg": round(sum(d["rhs"]) / len(d["rhs"])),
            "h_min": round(min(h_values), 1),
            "h_max": round(max(h_values), 1),
            "h_avg": round(sum(h_values) / len(h_values), 1),
            "wc": weather_codes.get(day),
        })
    for i, ts in enumerate(times):
        t = temps[i] if i < len(temps) else None
        rh = rhs[i] if i < len(rhs) else None
        if t is None or rh is None:
            continue
        w_kgkg = _humidity_ratio(t, rh)
        hourly_out.append({
            "time": ts, "temp": round(t, 1), "rh": round(rh),
            "h": round(_enthalpy(t, w_kgkg), 1),
        })

    payload = {
        "success": True,
        "source": "open-meteo",
        "lat": lat_key,
        "lon": lon_key,
        "year": target_year,
        "timezone": data.get("timezone", ""),
        "daily": daily_out,
        "hourly": hourly_out,
        "hourly_count": len(hourly_out),
    }
    await wx_col.update_one(
        cache_key,
        {"$set": {"payload": payload, "fetched_at": datetime.now(timezone.utc), **cache_key}},
        upsert=True,
    )
    payload["_from_cache"] = False
    return payload


def _restamp_year(payload: dict, target_year: int) -> dict:
    """Rewrite a cached payload's date / time / year fields to `target_year`,
    dropping Feb-29 for non-leap years.  Used when we serve the bundled 2020
    Seattle file for a different year, or when open-meteo is unreachable."""
    is_leap = (target_year % 4 == 0 and target_year % 100 != 0) or (target_year % 400 == 0)
    yr = f"{target_year:04d}"

    def _rs(d: str) -> str:
        if not d or len(d) < 10 or d[4] != "-":
            return d
        month, day = d[5:7], d[8:10]
        if month == "02" and day == "29" and not is_leap:
            day = "28"
        return yr + "-" + month + "-" + day + d[10:]

    out = dict(payload)
    out["year"] = target_year
    if isinstance(out.get("daily"), list):
        out["daily"] = [
            {**row, "date": _rs(row.get("date", ""))}
            for row in out["daily"]
            if not (row.get("date", "").endswith("-02-29") and not is_leap)
        ]
    if isinstance(out.get("hourly"), list):
        out["hourly"] = [
            {**row, "time": _rs(row.get("time", ""))}
            for row in out["hourly"]
            if not (row.get("time", "")[5:10] == "02-29" and not is_leap)
        ]
        out["hourly_count"] = len(out["hourly"])
    return out


@app.get("/api/tomorrow-forecast")
async def tomorrow_forecast() -> dict:
    now = time.time()
    out = [{"hour": h, "t": _demo_oa_state(now + h * 3600)["t"],
            "rh": _demo_oa_state(now + h * 3600)["rh"]} for h in range(24)]
    return {"location": ACTIVE_LOCATION, "hours": out}


@app.get("/api/band-overrides/sa-rh-clamp")
async def get_sa_rh_clamp(tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    if tenant:
        clamp = await read_sa_rh_clamp(tenant)
        return {"status": "ok", "sa_rh_clamp": clamp, "tenant_id": tenant["tenant_id"]}
    return {"status": "ok", "sa_rh_clamp": None}


@app.post("/api/band-overrides/sa-rh-clamp")
async def set_sa_rh_clamp(payload: dict,
                          tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    if not tenant:
        return {
            "status": "ok",
            "sa_rh_clamp": payload.get("sa_rh_clamp"),
            "applied": False,
            "warning": "Demo mode -- sign in to persist clamp settings.",
        }
    await write_sa_rh_clamp(tenant, payload.get("sa_rh_clamp"))
    return {
        "status": "ok",
        "sa_rh_clamp": payload.get("sa_rh_clamp"),
        "applied": True,
        "tenant_id": tenant["tenant_id"],
    }


@app.get("/api/band-overrides/preview")
async def preview_clamp(lo: float = Query(...), hi: float = Query(...)) -> dict:
    rows = _load_csv("band_guide.csv")
    affected = [r for r in rows if not (lo <= float(r["SA_RH_Delivery"]) <= hi)]
    return {
        "status": "ok",
        "lo": lo, "hi": hi,
        "total_bands": len(rows),
        "affected_bands": len(affected),
        "affected": [{"band": r["Band"], "name": r["Band_Name"],
                      "delivered_rh": float(r["SA_RH_Delivery"])} for r in affected],
    }


@app.get("/api/write-history")
async def write_history() -> dict:
    return {"history": [], "mode": "demo"}


@app.get("/api/collector-log")
async def collector_log() -> dict:
    base = int(time.time())
    oa = _demo_oa_state(time.time())
    band_name = _resolve_band(oa["t"], oa["rh"])["Band_Name"]
    return {
        "log": [
            {"ts": base - 60, "level": "INFO", "msg": "Demo simulator started."},
            {"ts": base - 30, "level": "INFO", "msg": "Loaded weather year (Seattle 2020)."},
            {"ts": base - 10, "level": "INFO", "msg": "Active band: " + band_name},
        ]
    }


@app.get("/api/trend-history")
async def trend_history(point: str = Query("OA"), window_min: int = Query(60)) -> dict:
    now = time.time()
    samples = []
    for i in range(window_min, 0, -1):
        ts = now - i * 60
        oa = _demo_oa_state(ts)
        samples.append({"ts": int(ts), "t": oa["t"], "rh": oa["rh"]})
    return {"point": point, "samples": samples}


@app.get("/api/map-config")
async def map_config(tenant: Optional[dict] = Depends(current_tenant_optional)) -> Any:
    """Return the tenant's saved map_config (floors + markers).  Anonymous
    callers get the bundled demo map_config so the dashboard's floor-plan
    overlay still renders during the demo walkthrough.

    Response is the V1.9 map_config.json shape (NOT wrapped):
        { floors: [{id, name, markers: [{type, name, id, x, y, ...}]}],
          version, ... }
    The dashboard's `getFloorForAhu()` reads `data.floors[*].markers[*]`
    directly so we cannot wrap the payload in another envelope."""
    if tenant:
        saved = await read_map_config(tenant)
        if saved:
            return saved
    # Bundled demo fallback (optional file).  If absent, return an empty
    # shape with `mode:'demo'` so the legacy 'No map_config.json' banner
    # still fires for anonymous users without a saved layout.
    demo_path = os.path.join(DEMO_DATA_DIR, "map_config.json")
    if os.path.exists(demo_path):
        with open(demo_path, "r") as f:
            return json.load(f)
    return {"floors": [], "mode": "demo", "warning": "No map_config saved yet."}


@app.post("/api/save-config")
async def save_config(payload: dict,
                      tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    """Equipment-mapper SAVE TO VIRTUAL CONTROLLER button posts here.

    Payload shape (V1.9):
        { deployment_path: '/root', map_config: {...}, image_manifest: {...} }
    """
    map_cfg  = payload.get("map_config") or {}
    img_man  = payload.get("image_manifest") or {}
    if not tenant:
        return {
            "success": False,
            "error": "Demo mode (anonymous) -- sign in to save the floor-plan map_config.",
            "persisted": False,
        }
    res = await write_map_config(tenant, map_cfg, img_man)
    return {
        "success": True,
        "persisted": True,
        "tenant_id": res["tenant_id"],
        "floors": res["floors"],
        "file": f"virtual-controller://{res['tenant_id']}/map_config.json",
    }


@app.get("/api/disk-status")
async def disk_status() -> dict:
    return {
        "total_kb": 50000,
        "used_kb": 18430,
        "free_kb": 31570,
        "percent_used": 36.86,
        "mode": "demo",
    }


@app.post("/api/save-equipment-schema")
async def save_equipment_schema(payload: dict,
                                tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    # The V1.9 equipment_mapper.html sends the schema wrapped:
    #     { deployment_path: "/root", equipment_schema: { ahu_types, vav_types } }
    # while the Phase 2b backend originally expected the schema at the top
    # level.  Unwrap if present, fall back to direct payload for clients
    # (tests, integration scripts) that POST the schema flat.
    schema = payload.get("equipment_schema") if isinstance(payload.get("equipment_schema"), dict) else payload
    if not tenant:
        # Anonymous demo: return the V1.9-shaped failure so the mapper drops
        # into its built-in browser-download fallback gracefully.
        return {
            "status": "ok",
            "success": False,
            "saved_keys": list(schema.keys()),
            "persisted": False,
            "warning": "Demo mode (anonymous) -- sign in to save to your virtual controller.",
        }
    res = await write_equipment_types(tenant, schema)
    return {
        "status": "ok",
        "success": True,
        # The V1.9 mapper alerts the operator with `data.file`; we surface
        # a virtual-controller path so the dialog reads sensibly without
        # claiming a filesystem write that never happened.
        "file": "virtual-controller://%s/equipment_types" % res["tenant_id"],
        "saved_keys": list(schema.keys()),
        "persisted": True,
        "tenant_id": res["tenant_id"],
        "updated_at": res["updated_at"],
    }


@app.get("/api/files")
async def list_files(path: str = Query(""),
                     tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    """V1.9-compatible file-browser response shape used by the image picker.

    Anonymous callers get an empty list (so the picker simply shows nothing
    instead of crashing).  Signed-in callers get their tenant_assets,
    grouped by prefix into synthetic directories.
    """
    if not tenant:
        return {"success": True, "files": [],
                "warning": "Sign in to browse your uploaded assets."}
    return {"success": True, "files": await list_tenant_assets(tenant, path)}


@app.post("/api/save-image")
@app.post("/api/save-floor-plan")
async def save_image(payload: dict,
                     tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    """Mapper POSTs {deployment_path, filename, image_data} where image_data
    is a data-URL (data:image/png;base64,...).  Anonymous = preview-only no-op.

    The `/api/save-floor-plan` alias exists because the V1.9 mapper's
    floor-plan background-upload flow POSTs to that legacy URL; both
    routes share the same handler so floor-plan PNGs land in the same
    `tenant_assets` collection as every other graphic."""
    filename = payload.get("filename") or ""
    image_data = payload.get("image_data") or ""
    if not filename or not image_data:
        return {"success": False, "error": "filename and image_data are required"}
    if not tenant:
        return {
            "success": False,
            "error": "Sign in to save asset images to your virtual controller.",
            "warning": "Anonymous demo -- image preview-only; sign in to persist.",
        }
    # Decode the data-URL.  Accept both "data:<mime>;base64,XXX" and the bare
    # base64 form some clients send.
    if image_data.startswith("data:"):
        try:
            head, b64 = image_data.split(",", 1)
        except ValueError:
            return {"success": False, "error": "malformed data-URL"}
        content_type = head[len("data:"):].split(";", 1)[0] or "application/octet-stream"
    else:
        b64 = image_data
        content_type = "application/octet-stream"
    try:
        data_bytes = base64.b64decode(b64)
    except Exception as e:  # noqa: BLE001
        return {"success": False, "error": f"base64 decode failed: {e}"}
    res = await save_tenant_asset(tenant, filename, content_type, data_bytes)
    return {
        "success": True,
        "relative_path": res["relative_path"],
        "size_bytes": res["size_bytes"],
        "tenant_id": tenant["tenant_id"],
    }


@app.get("/api/assets")
async def assets_manifest() -> dict:
    """V1.9 returns a manifest of visual-asset URLs (AHU/VAV graphics).
    Demo ships no images yet, so return an empty manifest -- the dashboard
    falls back to its built-in default SVGs."""
    return {
        "ahu": None,
        "vav": None,
        "floor": None,
        "ahu_types": {},
    }


# ---------------------------------------------------------------------------
# Phase 2 comprehensive port: V1.9 endpoints used by the dashboard / mapper
# that previously 404'd in V2.0.  All operate on the tenant_assets virtual
# filesystem (signed-in) or return a polite anonymous response (no 404).
# ---------------------------------------------------------------------------

@app.post("/api/save-map-config")
async def save_map_config_alias(payload: dict,
                                tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    """V1.9 alias for /api/save-config.  Some legacy mapper builds POST here."""
    return await save_config(payload, tenant=tenant)  # type: ignore[arg-type]


@app.post("/api/create-directory")
async def create_directory(payload: dict,
                           tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    """Virtual-FS no-op: directories are derived from filename prefixes in
    `tenant_assets`, so 'creating' one is a success unless the name is bogus."""
    dirname = (payload or {}).get("dirname", "") or ""
    if not dirname or ".." in dirname:
        return {"success": False, "error": "Invalid directory name"}
    if not tenant:
        return {"success": False, "error": "Sign in to manage your virtual controller filesystem.",
                "warning": "Anonymous demo -- mapper can browse but not mutate."}
    return {"success": True, "message": f"Directory ready: {dirname}",
            "path": f"virtual-controller://{tenant['tenant_id']}/{dirname.strip('/')}"}


@app.post("/api/delete-directory")
async def delete_directory(payload: dict,
                           tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    dirname = (payload or {}).get("dirname", "") or ""
    if not dirname or ".." in dirname:
        return {"success": False, "error": "Invalid directory name"}
    if not tenant:
        return {"success": False, "error": "Sign in to delete from your virtual controller."}
    return await delete_tenant_directory(tenant, dirname)


@app.post("/api/delete-file")
async def delete_file(payload: dict,
                      tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    filename = (payload or {}).get("filename", "") or ""
    if not filename or ".." in filename:
        return {"success": False, "error": "Invalid filename"}
    if not tenant:
        return {"success": False, "error": "Sign in to delete from your virtual controller."}
    return await delete_tenant_asset(tenant, filename)


@app.post("/api/move-file")
async def move_file(payload: dict,
                    tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    src      = (payload or {}).get("src", "") or ""
    dest_dir = (payload or {}).get("dest_dir", "") or ""
    if not src or ".." in src or ".." in dest_dir:
        return {"success": False, "error": "Invalid path"}
    if not tenant:
        return {"success": False, "error": "Sign in to manage your virtual controller filesystem."}
    return await move_tenant_asset(tenant, src, dest_dir)


@app.post("/api/upload-file")
async def upload_file(payload: dict,
                      tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    """Generic file upload (V1.9 mapper uses this for non-image config drops,
    e.g. CSV).  Routes through `tenant_assets`; content_type inferred from
    the data-URL prefix, with a sensible application/octet-stream fallback."""
    filename = (payload or {}).get("filename", "") or ""
    file_data = (payload or {}).get("file_data", "") or ""
    if not filename or ".." in filename:
        return {"success": False, "error": "Invalid filename"}
    if not file_data:
        return {"success": False, "error": "No file data"}
    if not tenant:
        return {"success": False, "error": "Sign in to upload to your virtual controller."}
    if file_data.startswith("data:"):
        try:
            head, b64 = file_data.split(",", 1)
        except ValueError:
            return {"success": False, "error": "malformed data-URL"}
        content_type = head[len("data:"):].split(";", 1)[0] or "application/octet-stream"
    else:
        b64 = file_data
        content_type = "application/octet-stream"
    try:
        data_bytes = base64.b64decode(b64)
    except Exception as e:  # noqa: BLE001
        return {"success": False, "error": f"base64 decode failed: {e}"}
    res = await save_tenant_asset(tenant, filename, content_type, data_bytes)
    return {"success": True, "message": f"Uploaded: {filename}",
            "file": res["relative_path"], "size": res["size_bytes"],
            "tenant_id": tenant["tenant_id"]}


@app.post("/api/init-directories")
async def init_directories(payload: Optional[dict] = None) -> dict:
    """V1.9 created /root/data/{configs,graphics,...} on first run.  In SaaS
    the tenant_assets schema is flat -- directories are implicit -- so this
    is a no-op success."""
    return {"success": True, "created": [], "existing": [], "mode": "virtual-fs"}


@app.get("/api/directory-scaffold")
async def directory_scaffold() -> dict:
    """Mirror the V1.9 response so the mapper's `scaffold` view does not
    show a permanent red 'not initialized' badge."""
    return {"success": True, "scaffold": [
        {"path": "configs", "exists": True},
        {"path": "graphics", "exists": True},
        {"path": "graphics/equipments", "exists": True},
        {"path": "graphics/equipments/AHUs", "exists": True},
        {"path": "graphics/equipments/VAVs", "exists": True},
        {"path": "graphics/floor_plans", "exists": True},
        {"path": "graphics/icons", "exists": True},
    ]}


@app.post("/api/write-point")
async def write_point(payload: dict,
                      tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    """V1.9 BACnet RW write via dibt.Write().  In SaaS there is no real
    BACnet target -- we accept the write and reflect it back as 'applied'
    so the dashboard's APPLY TO CONTROLLER / clamp / override flows complete
    without throwing.  Each write is logged to `virtual_write_log`."""
    equip = (payload or {}).get("equipment_name") or ""
    writes = (payload or {}).get("writes") or {}
    if not equip or not isinstance(writes, dict) or not writes:
        return {"success": False, "error": "equipment_name and writes required"}
    # Update the in-memory simulator overrides so the very next /api/data
    # poll reflects the operator's pill toggle.  Anonymous demo state --
    # process-lifetime only.
    for k, v in writes.items():
        try:
            _MANUAL_OVERRIDES[f"{equip}:{k}"] = float(v)
        except (TypeError, ValueError):
            _MANUAL_OVERRIDES[f"{equip}:{k}"] = 1.0 if v else 0.0
    log_doc = {
        "tenant_id": (tenant or {}).get("tenant_id") or None,
        "equipment_name": equip,
        "writes": writes,
        "applied_at": datetime.now(timezone.utc),
        "mode": "virtual-controller",
    }
    try:
        from motor.motor_asyncio import AsyncIOMotorClient as _MC
        _mc = _MC(os.environ["MONGO_URL"])
        await _mc[os.environ["DB_NAME"]]["virtual_write_log"].insert_one(log_doc)
    except Exception:  # noqa: BLE001
        pass  # best-effort; never fail the operator's write
    return {
        "success": True,
        "equipment_name": equip,
        "writes": writes,
        "mode": "virtual-controller",
        "note": "Write accepted and logged.  Virtual controller -- no real BACnet target.",
    }


@app.post("/api/zip-files")
async def zip_files(payload: dict,
                    tenant: Optional[dict] = Depends(current_tenant_optional)) -> FastResponse:
    """Stream a ZIP of the named files from `tenant_assets`."""
    if not tenant:
        raise HTTPException(403, "Sign in to download your virtual controller assets.")
    names: list[str] = (payload or {}).get("names") or []
    base_path: str = (payload or {}).get("path") or ""
    if not isinstance(names, list) or not names:
        raise HTTPException(400, "names[] required")
    import io, zipfile
    buf = io.BytesIO()
    added = 0
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        for name in names:
            if ".." in name or name.startswith("/"):
                continue
            rel = (base_path.strip("/") + "/" + name).strip("/") if base_path else name
            doc = await read_tenant_asset(tenant, rel)
            if doc and doc.get("data_bytes"):
                zf.writestr(name, doc["data_bytes"])
                added += 1
    buf.seek(0)
    return FastResponse(content=buf.getvalue(),
                        media_type="application/zip",
                        headers={"Content-Disposition": f'attachment; filename="bundle-{added}.zip"'})


@app.post("/api/zip-dir")
async def zip_dir(payload: dict,
                  tenant: Optional[dict] = Depends(current_tenant_optional)) -> FastResponse:
    """Stream a ZIP of every file under the named virtual directory."""
    if not tenant:
        raise HTTPException(403, "Sign in to download your virtual controller assets.")
    dirname: str = (payload or {}).get("dirname") or ""
    base_path: str = (payload or {}).get("path") or ""
    prefix = ((base_path.strip("/") + "/") if base_path else "") + dirname.strip("/")
    prefix = prefix.strip("/") + "/"
    import io, zipfile, re
    from tenants import ten_asset_col as _assets_col  # noqa: WPS433
    buf = io.BytesIO()
    added = 0
    cursor = _assets_col.find(
        {"tenant_id": tenant["tenant_id"],
         "filename": {"$regex": "^" + re.escape(prefix)}},
        {"_id": 0, "filename": 1, "data_bytes": 1},
    )
    docs = await cursor.to_list(length=10000)
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        for doc in docs:
            short = doc["filename"][len(prefix):]
            zf.writestr(short or doc["filename"], doc.get("data_bytes") or b"")
            added += 1
    buf.seek(0)
    arcname = (dirname.strip("/") or "assets").replace("/", "_")
    return FastResponse(content=buf.getvalue(),
                        media_type="application/zip",
                        headers={"Content-Disposition": f'attachment; filename="{arcname}.zip"'})



# ---------------------------------------------------------------------------
# Static asset passthrough.  V1.9 uses /api/assets/<path> for *.md and *.json
# under /root/data/configs/.  In demo we serve from /app/frontend/public/.
# Path traversal blocked.
# ---------------------------------------------------------------------------
@app.get("/api/assets/{path:path}")
async def assets(path: str, request: Request,
                 tenant: Optional[dict] = Depends(current_tenant_optional)):
    public_root = os.path.normpath(os.path.join(ROOT, "..", "frontend", "public"))
    full = os.path.normpath(os.path.join(public_root, path))
    if not full.startswith(public_root):
        raise HTTPException(403, "path traversal")
    if path in ("configs/equipment_types.json", "equipment_types.json"):
        return JSONResponse(_load_json("equipment_types.json"),
                            headers={"Cache-Control": "no-store"})
    if not os.path.exists(full):
        # Phase 2 Piece B: signed-in users get their personal asset bytes
        # served back here.  Mapper uploads end up in `tenant_assets`.
        if tenant:
            doc = await read_tenant_asset(tenant, path)
            if doc and doc.get("data_bytes"):
                ctype = doc.get("content_type") or "application/octet-stream"
                return FastResponse(content=doc["data_bytes"], media_type=ctype,
                                    headers={"Cache-Control": "no-store"})
        alt = os.path.join(DEMO_DATA_DIR, os.path.basename(path))
        if os.path.exists(alt):
            full = alt
        else:
            raise HTTPException(404, f"asset not found: {path}")
    lower = full.lower()
    with open(full, "rb") as f:
        body = f.read()
    if lower.endswith(".json"):
        return JSONResponse(json.loads(body.decode("utf-8")),
                            headers={"Cache-Control": "no-store"})
    if lower.endswith(".md"):
        return PlainTextResponse(body.decode("utf-8"),
                                  headers={"Cache-Control": "no-store",
                                           "Content-Type": "text/markdown; charset=utf-8"})
    return PlainTextResponse(body.decode("utf-8", errors="replace"))


@app.get("/")
async def root() -> dict:
    return {
        "name": "Red5 Studio V2.0 Demo Backend",
        "phase": 1,
        "ui_routes": [
            "/  (React landing -- served by frontend)",
            "/dashboard.html  (V1.9 dashboard SPA)",
            "/equipment_mapper.html  (V1.9 mapper)",
        ],
        "api_endpoints": [
            "/api/health", "/api/version", "/api/data", "/api/data-mode",
            "/api/equipment-types", "/api/collector-config", "/api/services",
            "/api/weather-location", "/api/weather-history",
            "/api/tomorrow-forecast", "/api/telemetry-status",
            "/api/band-overrides/sa-rh-clamp", "/api/band-overrides/preview",
            "/api/write-history", "/api/collector-log", "/api/trend-history",
            "/api/map-config", "/api/disk-status",
            "/api/save-equipment-schema", "/api/assets/{path}",
        ],
    }
