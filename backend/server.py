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
# Local-filesystem helpers + FS-root constants -- moved to models/fs.py in
# Phase L.30 (2026-06-24).  We re-export them here so the existing Phase L.29
# router shims (`_pull_from_server()`) continue to resolve `_fs_available`,
# `_fs_root`, `_safe_join`, `DATA_ROOT`, `SCRIPTS_ROOT`, `DIRECTORY_SCAFFOLD`
# off the `server` module without any client-side change.  New code should
# `from models.fs import ...` directly.
# ---------------------------------------------------------------------------
from models.fs import (  # noqa: E402
    DATA_ROOT,
    SCRIPTS_ROOT,
    ALLOWED_FS_ROOTS,
    DIRECTORY_SCAFFOLD,
    _fs_root,
    _fs_available,
    _safe_join,
    _zero_pad_variants,
    _404_no_cache,
)

# ---------------------------------------------------------------------------
# Demo telemetry simulator -- moved to simulator/__init__.py in Phase L.30.
# Pure module (no FastAPI / no MongoDB) so it can be imported here at
# module-load time without circular-dependency risk.  Re-exporting the
# symbols at module scope lets the existing Phase L.29 router shims
# (`_pull_from_server`) keep resolving names off the `server` module
# unchanged.
# ---------------------------------------------------------------------------
from simulator import (  # noqa: E402
    _humidity_ratio,
    _enthalpy,
    _VAV_DRIFT_STATE,
    _markov_drift,
    _scalar_drift,
    _demo_oa_state,
    _resolve_band,
    _simulate_ahu,
    _MANUAL_OVERRIDES,
    _DEMO_AHUS,
    _AHU_COLORS,
    _ahus_from_config,
    _build_snapshot,
)
# Demo-data loaders + cache moved to models/loaders.py in Phase L.30.  Re-export
# so the existing L.29 router shims continue to resolve `_load_json`, `_load_csv`
# and `_CACHE` off the `server` module.
from models.loaders import _load_json, _load_csv, _CACHE  # noqa: E402



# ---------------------------------------------------------------------------
# Demo data loaders + cache moved to models/loaders.py in Phase L.30 (re-exported
# above via `from models.loaders import _load_json, _load_csv, _CACHE`).


# ---------------------------------------------------------------------------
# Demo telemetry simulator.
# ---------------------------------------------------------------------------
# Phase L.31 (2026-06-24): SAVED_LOCATIONS + ACTIVE_LOCATION moved to
# models/weather.py and unified with the per-tenant seed list (previously
# duplicated in tenants.py).  Re-exported here so the existing Phase L.29
# `_pull_from_server()` shims and the anonymous /api/weather-location
# handler keep resolving them off the `server` module unchanged.
from models.weather import SAVED_LOCATIONS, ACTIVE_LOCATION  # noqa: E402

_DEMO_START_TS = time.time()



























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

# ---------------------------------------------------------------------------
# `_zero_pad_variants` and `_404_no_cache` moved to models/fs.py in Phase L.30
# (2026-06-24).  Re-exported via the `from models.fs import ...` block above.
# ---------------------------------------------------------------------------


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
