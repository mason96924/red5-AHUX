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
from typing import Any, Optional, Dict

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

# Wire the audit-log router (Phase 2 Piece G: append-only mutation trail).
from audit_log import router as audit_router, record_audit  # noqa: E402
app.include_router(audit_router)

# Wire the G36 router (Phase 3a: ASHRAE Guideline 36 controller).
from g36_service import router as g36_router, auto_tick_from_ahu_dict  # noqa: E402
app.include_router(g36_router)

# Wire the domain routers extracted from this file in Phase L.28 (2026-06-24).
from routes.standards import router as standards_router  # noqa: E402
app.include_router(standards_router)
from routes.files import router as files_router  # noqa: E402
app.include_router(files_router)
from routes.assets import router as assets_router  # noqa: E402
app.include_router(assets_router)
# Phase L.29 routers are wired at the BOTTOM of this file (after all helpers
# and module-level constants like ACTIVE_LOCATION / _DEMO_AHUS / _CACHE are
# defined, so each router's `_pull_from_server()` shim resolves cleanly).


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
    create_tenant_directory,
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
# Local-filesystem file browser (V1.9 parity on Linux server).
# V1.9 Flask reads/writes /root/data and /root/scripts directly.  V2.0
# FastAPI must do the same when those paths exist on the host so the
# Controller Assets browser, uploader, and asset URLs all "just work" on
# the operator's Linux deploy.  When the paths don't exist (preview /
# SaaS sandbox), fall back to the tenant_assets virtual filesystem.
# ---------------------------------------------------------------------------
DATA_ROOT = os.environ.get("DATA_ROOT", "/root/data")
SCRIPTS_ROOT = os.environ.get("SCRIPTS_ROOT", "/root/scripts")
ALLOWED_FS_ROOTS = {"data": DATA_ROOT, "scripts": SCRIPTS_ROOT}
# V1.9-style scaffold the INIT SCAFFOLD button creates under DATA_ROOT.
DIRECTORY_SCAFFOLD = [
    "graphics/equipments/AHUs",
    "graphics/equipments/VAVs",
    "graphics/equipments/VFDs",
    "graphics/equipments/DIFF_PRs",
    "graphics/equipments/CHILLERs",
    "graphics/equipments/CTs",
    "graphics/floor_plans",
    "configs",
    "js",
]


def _fs_root(root_name: str) -> str:
    return ALLOWED_FS_ROOTS.get(root_name or "data", DATA_ROOT)


def _fs_available(root_name: str) -> bool:
    """True iff the local filesystem root exists.  This is the switch
    between V1.9-on-Linux mode (real `/root/data`) and the hosted demo
    mode (tenant_assets virtual filesystem)."""
    try:
        return os.path.isdir(_fs_root(root_name))
    except OSError:
        return False


def _safe_join(base: str, rel: str) -> Optional[str]:
    """Path-traversal-safe join.  Returns None when `rel` would escape `base`."""
    if rel is None:
        rel = ""
    if ".." in rel:
        return None
    full = os.path.normpath(os.path.join(base, rel))
    if not (full == base or full.startswith(base + os.sep)):
        return None
    return full



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
    {"lat":  47.92, "lon": 106.92, "name": "Ulaanbaatar"},
    {"lat":  40.71, "lon": -74.01, "name": "New York"},
    {"lat":  51.51, "lon":  -0.13, "name": "London"},
    {"lat":  52.52, "lon":  13.40, "name": "Berlin"},
    {"lat":  49.28, "lon": -123.12, "name": "Vancouver"},
    {"lat":  35.68, "lon": 139.69, "name": "Tokyo"},
    {"lat":  39.91, "lon": 116.40, "name": "Beijing"},
    {"lat":  25.03, "lon": 121.57, "name": "Taipei"},
    {"lat":  22.32, "lon": 114.17, "name": "Hong Kong"},
    {"lat":   1.35, "lon": 103.82, "name": "Singapore"},
    {"lat": -33.87, "lon": 151.21, "name": "Sydney"},
]
ACTIVE_LOCATION = SAVED_LOCATIONS[1]  # New York -- 4 -season climate with reliable Open-Meteo data

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
# [Phase L.29] handler moved to routes/*.py


# [Phase L.29] handler moved to routes/*.py


# [Phase L.29] handler moved to routes/*.py


# [Phase L.29] handler moved to routes/*.py


# [Phase L.29] handler moved to routes/*.py


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


# [Phase L.29] handler moved to routes/*.py


# [Phase L.29] handler moved to routes/*.py


# [Phase L.29] handler moved to routes/*.py


# [Phase L.29] handler moved to routes/*.py


# [Phase L.29] handler moved to routes/*.py


# [Phase L.29] handler moved to routes/*.py


# [Phase L.29] handler moved to routes/*.py


# ----------------------------------------------------------------------------
# Weather-proxy health tracking
# ----------------------------------------------------------------------------
# `_LAST_WEATHER_SOURCE` is updated on every /api/weather-proxy call so the
# dashboard's auth pill can render a colored dot showing which upstream
# satisfied the most recent request:
#   "open-meteo"     -> emerald  (primary, free, no key)
#   "weatherapi.com" -> cyan     (fallback, ≤ 7-day window, requires key)
#   "nasa-power"     -> amber    (last-resort, unlimited history, slower)
#   "error"          -> red      (all three failed)
# Exposed via GET /api/weather-health.  Process-local; intentionally no
# persistence — this is a live-status indicator, not an audit log.
_LAST_WEATHER_SOURCE: Dict[str, Any] = {
    "source":     None,         # "open-meteo" | "weatherapi.com" | "nasa-power" | "error"
    "status":     "unknown",    # "ok" | "error" | "unknown"
    "updated_at": None,         # ISO-8601 UTC timestamp of the last call
    "detail":     None,         # short human-readable note (errors etc.)
}


def _mark_weather_source(source: Optional[str], status: str, detail: Optional[str] = None) -> None:
    _LAST_WEATHER_SOURCE["source"]     = source
    _LAST_WEATHER_SOURCE["status"]     = status
    _LAST_WEATHER_SOURCE["updated_at"] = datetime.now(timezone.utc).isoformat()
    _LAST_WEATHER_SOURCE["detail"]     = detail


def _v2_weatherapi_key():
    """Read the weatherapi.com API key from a server-local file.
    Place a single-line `weatherapi_key.txt` next to backend/.env on the
    self-host machine.  Returns None when the key is missing."""
    import os as _os
    for candidate in ("/app/backend/weatherapi_key.txt",
                      _os.path.join(_os.path.dirname(__file__), "weatherapi_key.txt")):
        try:
            with open(candidate, "r") as f:
                key = f.read().strip()
            if key:
                return key
        except Exception:  # noqa: BLE001
            continue
    return None


def _weatherapi_to_openmeteo(wapi_json: dict, requested_lat: float, requested_lon: float) -> dict:
    """weatherapi.com history.json -> open-meteo /v1/archive shape."""
    fc = (wapi_json or {}).get("forecast", {}) or {}
    days = fc.get("forecastday", []) or []
    times, temps, rhs = [], [], []
    daily_dates, daily_codes = [], []
    for day in days:
        date_str = day.get("date", "")
        if date_str:
            daily_dates.append(date_str)
            daily_codes.append(((day.get("day") or {}).get("condition") or {}).get("code"))
        for h in day.get("hour", []) or []:
            t = h.get("time", "")
            if t and " " in t:
                t = t.replace(" ", "T")
            times.append(t)
            temps.append(h.get("temp_c"))
            rhs.append(h.get("humidity"))
    loc = (wapi_json or {}).get("location", {}) or {}
    return {
        "latitude":  loc.get("lat",  requested_lat),
        "longitude": loc.get("lon",  requested_lon),
        "timezone":  loc.get("tz_id", "auto"),
        "source":    "weatherapi.com",
        "hourly": {
            "time":                 times,
            "temperature_2m":       temps,
            "relative_humidity_2m": rhs,
        },
        "daily": {
            "time":         daily_dates,
            "weather_code": daily_codes,
        },
    }


def _nasa_power_to_openmeteo(power_json: dict, requested_lat: float, requested_lon: float) -> dict:
    """NASA POWER hourly -> open-meteo /v1/archive shape."""
    params_dict = (((power_json or {}).get("properties") or {}).get("parameter")) or {}
    t2m  = params_dict.get("T2M")  or {}
    rh2m = params_dict.get("RH2M") or {}
    keys = sorted(set(t2m.keys()) | set(rh2m.keys()))
    times, temps, rhs = [], [], []
    for k in keys:
        if len(k) != 10:
            continue
        iso = k[0:4] + "-" + k[4:6] + "-" + k[6:8] + "T" + k[8:10] + ":00"
        times.append(iso)
        tv = t2m.get(k);  temps.append(None if (tv is None or tv <= -900) else tv)
        rv = rh2m.get(k); rhs.append(None if (rv is None or rv <= -900) else rv)
    return {
        "latitude":  requested_lat,
        "longitude": requested_lon,
        "timezone":  "UTC",
        "source":    "nasa-power",
        "hourly": {
            "time":                 times,
            "temperature_2m":       temps,
            "relative_humidity_2m": rhs,
        },
    }


# [Phase L.29] handler moved to routes/*.py


# [Phase L.29] handler moved to routes/*.py


# [Phase L.29] handler moved to routes/*.py


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


# [Phase L.29] handler moved to routes/*.py


# [Phase L.29] handler moved to routes/*.py


# [Phase L.29] handler moved to routes/*.py


# [Phase L.29] handler moved to routes/*.py


# [Phase L.29] handler moved to routes/*.py


# [Phase L.29] handler moved to routes/*.py


# [Phase L.29] handler moved to routes/*.py


# [Phase L.29] handler moved to routes/*.py


# [Phase L.29] handler moved to routes/*.py



# [Phase L.29] handler moved to routes/*.py


# [Phase L.29] handler moved to routes/*.py


# [Phase L.29] handler moved to routes/*.py


# [Phase L.29] handler moved to routes/*.py


# ---------------------------------------------------------------------------
# File-management API (/api/files, /api/save-image, /api/upload-file, /api/move-file,
# /api/create-directory, /api/delete-*, /api/init-directories, /api/directory-scaffold,
# /api/assets manifest) was extracted to routes/files.py in Phase L.28 (2026-06-24).
# The local-filesystem helpers (_fs_available, _fs_root, _safe_join, DIRECTORY_SCAFFOLD)
# still live above and are imported lazily by the router module.
# ---------------------------------------------------------------------------




# [Phase L.29] handler moved to routes/*.py


# [Phase L.29] handler moved to routes/*.py


# [Phase L.29] handler moved to routes/*.py



# ---------------------------------------------------------------------------
# Engineer-facing standards / documentation library
# ---------------------------------------------------------------------------
# Surfaces the curated set of *.md files under `frontend/public/docs/` to the
# dashboard's "Standards" modal so a consulting engineer or commissioning
# agent can read the band guide, G36 cross-walk, control algorithms, etc.
# right inside the dashboard.  Whitelist-only — anything not listed in
# `_STANDARDS_CATALOG` returns 404 to keep the surface tight and prevent
# accidental exposure of operator-private docs.
# ---------------------------------------------------------------------------
# Standards documents -- extracted to routes/standards.py in Phase L.28.
# ---------------------------------------------------------------------------


# ---------------------------------------------------------------------------
# Static asset passthrough.  V1.9 uses /api/assets/<path> for *.md and *.json
# under /root/data/configs/.  In demo we serve from /app/frontend/public/.
# Path traversal blocked.
# ---------------------------------------------------------------------------

# Asset name normaliser. Historically the equipment_types schema was loosely
# typed: V1.8 stored `AHU_TYPE_1.jpg`, V1.9 settled on the zero-padded
# `AHU_TYPE_01.jpg`. Either spelling can show up depending on when the
# tenant uploaded their schema. Rather than force every user to re-edit
# JSON by hand, when a file lookup misses we try the same path with the
# alternate digit padding (single <-> 2-digit). Only the FINAL segment is
# considered, and only the suffix immediately before the extension --
# this is intentionally narrow so it can't paper over real typos.
import re as _re_pad
_PAD_RE = _re_pad.compile(r"_(\d{1,2})(\.[A-Za-z0-9]+)$")
def _zero_pad_variants(rel_path: str) -> list[str]:
    """Return alternate spellings of `rel_path` with the trailing
    numeric suffix toggled between 1- and 2-digit zero padding.

    Examples:
        AHU_TYPE_1.jpg   -> ['AHU_TYPE_01.jpg']
        AHU_TYPE_01.jpg  -> ['AHU_TYPE_1.jpg']
        AHU_TYPE_10.jpg  -> []                   (already 2 digits, >9)
        foo/bar.jpg      -> []                   (no numeric suffix)
    """
    head, _, tail = rel_path.rpartition("/")
    m = _PAD_RE.search(tail)
    if not m:
        return []
    digits, ext = m.group(1), m.group(2)
    n = int(digits)
    out: list[str] = []
    if len(digits) == 1:
        alt = _PAD_RE.sub(f"_{n:02d}{ext}", tail)
        out.append(f"{head}/{alt}" if head else alt)
    elif len(digits) == 2 and n < 10:
        alt = _PAD_RE.sub(f"_{n}{ext}", tail)
        out.append(f"{head}/{alt}" if head else alt)
    return out


def _404_no_cache(detail: str):
    """Return a 404 that browsers will NOT cache.

    Why this exists: Chrome / Safari apply heuristic caching to 404
    responses that omit Cache-Control.  A user once hit an asset before
    it had been uploaded -> Chrome cached the 404 -> after the upload
    succeeded the user still saw "No preview" until a hard refresh.
    Worse: different PCs cached different states ("works on Linux PC,
    broken on the Mac next to it").  By emitting `Cache-Control:
    no-store` on every 404 from /api/assets and /api/thumb, a freshly
    uploaded asset becomes visible on the very next page load on every
    PC, with no cache-invalidation dance required.
    """
    return JSONResponse(
        {"detail": detail},
        status_code=404,
        headers={"Cache-Control": "no-store"},
    )


# ---------------------------------------------------------------------------
# Asset & thumbnail serving (/api/assets/{path}, /assets/{path}, /api/thumb)
# was extracted to routes/assets.py in Phase L.28 (2026-06-24).
# ---------------------------------------------------------------------------




# [Phase L.29] handler moved to routes/*.py



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


# ---------------------------------------------------------------------------
# Phase L.29 (2026-06-24) -- wire the route groups extracted from server.py.
# Imports MUST live here at the bottom of the file so that every module-level
# helper and constant (`ACTIVE_LOCATION`, `_DEMO_AHUS`, `_CACHE`, etc.) is
# already defined by the time each router's `_pull_from_server()` shim runs.
# ---------------------------------------------------------------------------
from routes.health import router as health_router  # noqa: E402
app.include_router(health_router)
from routes.equipment import router as equipment_router  # noqa: E402
app.include_router(equipment_router)
from routes.telemetry import router as telemetry_router  # noqa: E402
app.include_router(telemetry_router)
from routes.weather import router as weather_router  # noqa: E402
app.include_router(weather_router)
from routes.bands import router as bands_router  # noqa: E402
app.include_router(bands_router)
from routes.history import router as history_router  # noqa: E402
app.include_router(history_router)
from routes.mapper import router as mapper_router  # noqa: E402
app.include_router(mapper_router)
from routes.maintenance import router as maintenance_router  # noqa: E402
app.include_router(maintenance_router)
