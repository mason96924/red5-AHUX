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
# Process-wide mutable state moved to models/state.py in Phase L.32
# (2026-06-24).  Re-exported here so the existing L.29 router shims keep
# resolving the names off the `server` module unchanged.
# ---------------------------------------------------------------------------
from models.state import (  # noqa: E402
    _ANON_OVERRIDE,
    _DEMO_START_TS,
    _LAST_WEATHER_SOURCE,
    _LAST_WEATHER_TS,
    _WEATHER_NOW_CACHE,
    _WEATHER_NOW_TTL_S,
)



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



























# ---------------------------------------------------------------------------
# Core endpoints.
# ---------------------------------------------------------------------------
# [Phase L.29] handler moved to routes/*.py


# [Phase L.29] handler moved to routes/*.py


# [Phase L.29] handler moved to routes/*.py


# [Phase L.29] handler moved to routes/*.py


# [Phase L.29] handler moved to routes/*.py


# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------
# Anonymous mode override moved to models/state.py in Phase L.32; re-exported
# above.
# ---------------------------------------------------------------------------


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
# Weather-proxy health tracking -- `_LAST_WEATHER_SOURCE` moved to
# models/state.py in Phase L.32 (re-exported above).
# ----------------------------------------------------------------------------


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


# ---------------------------------------------------------------------------
# Phase V3.0-δ — Red5-ELC demo mount (2026-02)
# ---------------------------------------------------------------------------
# Adds the V3.0 ELC protocol stack to the running backend so the demo
# console is reachable through the existing public preview URL.  In demo
# mode a `MockScuServer` stands in for real SCU hardware.
#
# Lives at:
#   GET  /api/elc-demo/              → live console (HTML)
#   GET  /api/elc/link               → link/connection status JSON
#   GET  /api/elc/devices            → list of known device snapshots
#   POST /api/elc/devices/{id}/relay → toggle a relay
#   WS   /api/elc/events             → live event stream
#
# To swap MockScu for a real device, point `_build_link_kwargs()` at the
# SCU's host/port and skip starting MockScuServer.
#
# IMPORTANT: this whole stack is OPTIONAL.  If the Red5-ELC-V3.0 source
# tree is not present alongside backend/ (e.g. a PROD checkout that omits
# the archive/), `_ELC_IMPORTED` stays False and the backend boots
# normally without the demo routes.  Without this guard a missing optional
# package would crash uvicorn at module-load time, take the whole site
# down (502 on every /api/* route), and trigger a systemd crash-loop.
# Hardcoded `/app/...` paths were the root cause of the 2026-06-29 PROD
# outage -- they only existed in the sandbox, not on the deploy host.
# ---------------------------------------------------------------------------
import os as _elc_os  # noqa: E402
import sys as _sys  # noqa: E402

_REPO_ROOT = _elc_os.path.dirname(_elc_os.path.dirname(_elc_os.path.abspath(__file__)))
_ELC_DEMO_DIR = _elc_os.path.join(_REPO_ROOT, "archive", "Red5-ELC-V3.0")
_sys.path.insert(0, _ELC_DEMO_DIR)
_sys.path.insert(0, _elc_os.path.join(_ELC_DEMO_DIR, "tests"))

_ELC_IMPORTED = False
try:
    from fastapi.responses import FileResponse as _FileResponse  # noqa: E402
    from fastapi.staticfiles import StaticFiles as _StaticFiles  # noqa: E402

    from elc.api.rest import build_router as _build_elc_router  # noqa: E402
    from elc.api.sse import attach_sse as _attach_elc_sse  # noqa: E402
    from elc.api.ws import attach_ws as _attach_elc_ws  # noqa: E402
    from elc.codec import encode as _elc_encode  # noqa: E402
    from elc.codec.device_id import ADDR_BITS as _ADDR_BITS  # noqa: E402
    from elc.codec.device_id import SUBADDR_BITS as _SUBADDR_BITS  # noqa: E402
    from elc.codec.device_id import DeviceId as _ElcDeviceId  # noqa: E402
    from elc.codec.device_id import DeviceType as _ElcDeviceType  # noqa: E402
    from elc.codec.messages import (  # noqa: E402
        BroadcastComplete as _BroadcastComplete,
        RelaySet as _RelaySet,
        RelayState as _RelayState,
    )
    from elc.codec.registry import default_registry as _elc_registry  # noqa: E402
    from elc.domain.replica import Replica as _ElcReplica  # noqa: E402
    from elc.drivers.srm import SrmDriver as _SrmDriver  # noqa: E402
    from elc.transport import ScuLink as _ScuLink  # noqa: E402

    # MockScuServer is a test fixture, but it's import-safe (pure asyncio).
    from conftest import MockScuServer as _MockScuServer  # type: ignore  # noqa: E402
    _ELC_IMPORTED = True
except ImportError as _elc_imp_err:
    print(f"[elc] optional V3.0 demo stack not available -- skipping mount ({_elc_imp_err})")

_elc_state: dict[str, object] = {}

# ---------------------------------------------------------------------------
# Route registration at IMPORT TIME (not inside startup).
#
# Why: previously the ELC routes (/api/elc/*, /api/elc-demo/*) were
# registered inside @app.on_event("startup"), AFTER
# `await link.wait_connected(timeout=3.0)`.  Any request hitting those
# paths during the up-to-3s startup window got a real 404 from FastAPI
# because the route literally did not exist yet.  uvicorn's watchfiles
# reloader (`Will watch for changes in these directories: ['/app/backend']`)
# auto-restarts on every code edit, so the 404 window kept re-opening.
#
# Fix: build replica/driver/link at import time with a placeholder port
# (the link is just a TCP CLIENT -- constructing it does no I/O).  Then
# register every route while the FastAPI app is still being built.
# Startup only does async I/O (start MockScu, learn its ephemeral port,
# mutate link.port, then start the link).
# ---------------------------------------------------------------------------
if _ELC_IMPORTED:
    _ADDR_BCAST = (1 << _ADDR_BITS) - 1
    _SUB_BCAST = (1 << _SUBADDR_BITS) - 1

    # Pre-seed device set so the very first broadcast (before any
    # individual writes) has targets to echo for.
    _seen_devices: set[_ElcDeviceId] = set()
    for _addr in (10, 20, 30, 40):
        _seen_devices.add(_ElcDeviceId(
            dev_type=_ElcDeviceType.SRM, scu=1, address=_addr, sub_address=0,
        ))
    for _i in range(400):
        _seen_devices.add(_ElcDeviceId(
            dev_type=_ElcDeviceType.SRM, scu=1, address=100 + _i, sub_address=0,
        ))
    _seen_state: dict[_ElcDeviceId, bool] = {d: False for d in _seen_devices}

    # Replica/driver/link are constructed synchronously (no network
    # I/O at construction).  port=1 is a valid-but-unused placeholder;
    # startup rewrites it to MockScu's ephemeral port BEFORE we call
    # link.start().  (ScuLink's __init__ rejects port 0.)
    _elc_replica = _ElcReplica()
    _elc_link = _ScuLink("127.0.0.1", 1, name="demo-scu", initial_backoff=0.2)
    _elc_driver = _SrmDriver(_elc_link)
    _elc_replica.attach(_elc_driver)

    # All routes are now visible the instant uvicorn says
    # "Application startup complete".  No 404 race window.
    app.include_router(
        _build_elc_router(driver=_elc_driver, replica=_elc_replica, link=_elc_link)
    )
    _attach_elc_ws(app, _elc_replica, path="/api/elc/events")
    # SSE fallback for environments whose HTTP proxy strips Upgrade
    # headers.  Anywhere WS works, the client uses it; SSE is only
    # reached when ws.onclose fires before ws.onopen.
    _attach_elc_sse(app, _elc_replica, path="/api/elc/events-sse")

    _ELC_DEMO_HTML = _elc_os.path.join(_ELC_DEMO_DIR, "demo")
    app.mount(
        "/api/elc-demo/static",
        _StaticFiles(directory=_ELC_DEMO_HTML),
        name="elc-demo-static",
    )

    @app.get("/api/elc-demo/", include_in_schema=False)
    async def _elc_demo_index() -> _FileResponse:
        return _FileResponse(f"{_ELC_DEMO_HTML}/index.html")

    @app.get("/api/elc-demo/stress", include_in_schema=False)
    async def _elc_demo_stress() -> _FileResponse:
        return _FileResponse(f"{_ELC_DEMO_HTML}/stress.html")


@app.on_event("startup")
async def _elc_startup() -> None:
    if not _ELC_IMPORTED:
        # PROD or any deploy without the optional Red5-ELC-V3.0 tree --
        # silently skip; the rest of the backend boots normally.
        return

    async def _echo_relay(frame, writer):  # type: ignore[no-untyped-def]
        if frame.msg_type != _RelaySet.FLAG:
            return
        cmd = _RelaySet.decode(frame.payload)
        is_broadcast = (
            cmd.device.address == _ADDR_BCAST
            and cmd.device.sub_address == _SUB_BCAST
        )
        if is_broadcast:
            # Apply the broadcast state to every matching device the
            # mock SCU knows about, then emit ONE BroadcastComplete
            # frame.  Previously the mock echoed N RelayState frames
            # (one per device), which overran the per-client SSE/WS
            # queues and produced inconsistent partial paints across
            # multiple browser tabs.  See PRD changelog 2026-02 entry
            # "broadcast coalescing".
            affected = 0
            for dev in _seen_devices:
                if dev.dev_type == cmd.device.dev_type and dev.scu == cmd.device.scu:
                    _seen_state[dev] = cmd.state
                    affected += 1
            reply = _elc_registry.encode_message(
                _BroadcastComplete(
                    dev_type=int(cmd.device.dev_type),
                    scu=cmd.device.scu,
                    state=cmd.state,
                    count=affected,
                )
            )
            writer.write(_elc_encode(reply))
            await writer.drain()
        else:
            _seen_devices.add(cmd.device)
            _seen_state[cmd.device] = cmd.state
            reply = _elc_registry.encode_message(
                _RelayState(device=cmd.device, state=cmd.state)
            )
            writer.write(_elc_encode(reply))
            await writer.drain()

    scu = _MockScuServer()
    await scu.start()
    scu.on_frame(_echo_relay)

    # Now that MockScu's ephemeral port is known, point the
    # already-registered link at it.  This is safe: link.start() is
    # the only thing that reads link.port (in asyncio.open_connection),
    # and we haven't called start() yet.
    _elc_link.port = scu.port

    await _elc_link.start()
    try:
        await _elc_link.wait_connected(timeout=3.0)
    except Exception as e:  # noqa: BLE001
        print(f"[elc] link did not connect: {e}")

    _elc_state["scu"] = scu
    _elc_state["link"] = _elc_link
    print(f"[elc] demo ready  (fake SCU on :{scu.port})")


@app.on_event("shutdown")
async def _elc_shutdown() -> None:
    if not _ELC_IMPORTED:
        return
    link = _elc_state.get("link")
    scu = _elc_state.get("scu")
    if link is not None:
        await link.stop()  # type: ignore[attr-defined]
    if scu is not None:
        await scu.stop()  # type: ignore[attr-defined]
