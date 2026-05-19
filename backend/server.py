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
    """Humidity ratio w [g/kg] at sea-level pressure (Magnus formula)."""
    p_ws = 0.6108 * math.exp((17.27 * t_c) / (t_c + 237.3))
    p_w = (rh / 100.0) * p_ws
    return 622.0 * p_w / (101.325 - p_w)


def _enthalpy(t_c: float, w_gkg: float) -> float:
    """Moist-air enthalpy [kJ/kg dry air].  Matches V1.9 psychrometric.js get_h."""
    w_kg = w_gkg / 1000.0
    return 1.006 * t_c + w_kg * (2501.0 + 1.86 * t_c)


def _demo_oa_state(now_ts: float) -> dict:
    """Synthesize OA temp/RH from a daily sinusoid.  Peak at 14:00 local."""
    secs = now_ts % 86400.0
    hours = secs / 3600.0
    t = 22.0 + 6.0 * math.sin(2 * math.pi * (hours - 8.0) / 24.0)
    rh = 55.0 - 18.0 * math.sin(2 * math.pi * (hours - 8.0) / 24.0)
    rh = max(20.0, min(95.0, rh))
    return {"t": round(t, 2), "rh": round(rh, 1),
            "w": round(_humidity_ratio(t, rh), 3)}


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
    # Synthesize per-VAV zone temps/RHs (small dither so chart shows spread)
    vav_list = []
    for i, vn in enumerate(vav_names):
        wave = math.sin(time.time() / 90.0 + i * 0.7)
        vt = 22.0 + 1.5 * wave
        vrh = 45.0 + 4.0 * (-wave)
        vw = _humidity_ratio(vt, vrh)
        vav_list.append({
            "id": vn, "t": round(vt, 2), "rh": round(vrh, 1),
            "w": round(vw, 3), "h": round(_enthalpy(vt, vw), 2),
            "all_points": {"t": round(vt, 2), "rh": round(vrh, 1)},
        })
    ra_t = sum(v["t"] for v in vav_list) / len(vav_list) if vav_list else 24.0
    ra_rh = sum(v["rh"] for v in vav_list) / len(vav_list) if vav_list else 50.0
    return {
        "id": ahu_id,
        "procColor": color,
        "source": "demo",
        "points": [
            {"label": "OA", "t": oa["t"], "rh": oa["rh"],
             "w": oa["w"], "color": "#3b82f6"},
            {"label": "SA", "t": round(sa_t, 2), "rh": round(sa_rh, 1),
             "w": round(_humidity_ratio(sa_t, sa_rh), 3), "color": "#10b981"},
            {"label": "RA", "t": round(ra_t, 2), "rh": round(ra_rh, 1),
             "w": round(_humidity_ratio(ra_t, ra_rh), 3), "color": "#f43f5e"},
        ],
        "all_points": {
            "OAT": oa["t"], "OAH": oa["rh"],
            "SAT": round(sa_t, 2), "SAH": round(sa_rh, 1),
            "RAT": round(ra_t, 2), "RAH": round(ra_rh, 1),
        },
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


def _build_snapshot() -> list:
    """Return a V1.9-shaped /api/data ARRAY (one entry per AHU)."""
    now = time.time()
    oa = _demo_oa_state(now)
    band = _resolve_band(oa["t"], oa["rh"])
    offsets = [0.0, 0.3, -0.2]
    return [
        _simulate_ahu(aid, oa, band, color, vavs, off)
        for (aid, color, vavs), off in zip(_DEMO_AHUS, offsets)
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
async def data_mode() -> dict:
    return {"mode": "demo", "live": False, "source": "phase1-simulator"}


@app.get("/api/data")
async def get_data() -> list:
    """V1.9 contract: ARRAY of AHU entries.  Dashboard rejects non-array."""
    return _build_snapshot()


@app.post("/api/data-mode")
async def set_data_mode(payload: dict) -> dict:
    """Demo backend accepts the mode toggle but always returns demo data."""
    return {"success": True, "mode": payload.get("mode", "simulator"),
            "warning": "Demo mode -- mode toggle is cosmetic; data source is fixed."}


@app.get("/api/telemetry-status")
async def telemetry_status() -> dict:
    return {
        "last_update": datetime.now(timezone.utc).isoformat(),
        "stale_s": 0,
        "polling": True,
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
async def collector_config() -> Any:
    return _load_json("collector_config.json")


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
                          year: Optional[int] = None) -> Any:
    """Return the cached Open-Meteo year file.  Defaults to active location
    (Seattle in demo) so the dashboard can call this with zero args on first
    paint before the user has picked a city."""
    fname = f"weather_{lat:.2f}_{lon:.2f}_2020.json"
    path = os.path.join(DEMO_DATA_DIR, fname)
    if not os.path.exists(path):
        path = os.path.join(DEMO_DATA_DIR, "weather_47.60_-122.30_2020.json")
    with open(path, "r") as f:
        return json.load(f)


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
async def map_config() -> dict:
    return {"schema": _load_json("equipment_types.json"), "mode": "demo"}


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


@app.post("/api/save-image")
async def save_image(payload: dict,
                     tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    """Mapper POSTs {deployment_path, filename, image_data} where image_data
    is a data-URL (data:image/png;base64,...).  Anonymous = preview-only no-op."""
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
