"""routes/weather.py -- weather endpoints.

Phase L.29 (2026-06-24): auto-extracted from server.py using AST.
Handler bodies are byte-identical to the originals; only changes are
`@app.` -> `@router.` and the `_pull_from_server()` shim below that
imports every helper and module-level constant from `server` into this
router's namespace so handler bodies can use them unchanged.
"""
from __future__ import annotations

from typing import Any, Optional, Dict
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import JSONResponse, PlainTextResponse
from datetime import datetime, timezone
import os, json, math, time, random, csv, base64
import urllib.parse, urllib.request

from tenants import (
    current_tenant_optional,
    read_equipment_types, write_equipment_types,
    read_sa_rh_clamp, write_sa_rh_clamp,
    read_weather_location, write_weather_location,
    save_tenant_asset, read_tenant_asset, list_tenant_assets,
    delete_tenant_asset, delete_tenant_directory, create_tenant_directory,
    move_tenant_asset,
    read_collector_config, write_collector_config,
    read_map_config, write_map_config,
    WeatherLocationUpdate,
)
from audit_log import record_audit
from g36_service import auto_tick_from_ahu_dict

router = APIRouter()

import server as _server  # noqa: E402  -- lazy module reference

def _pull_from_server():
    g = globals()
    for name in ('ACTIVE_LOCATION', 'ALLOWED_FS_ROOTS', 'DATA_ROOT', 'DEMO_DATA_DIR', 'DIRECTORY_SCAFFOLD', 'ROOT', 'SAVED_LOCATIONS', 'SCRIPTS_ROOT', '_404_no_cache', '_AHU_COLORS', '_ANON_OVERRIDE', '_CACHE', '_DEMO_AHUS', '_DEMO_START_TS', '_LAST_WEATHER_SOURCE', '_LAST_WEATHER_TS', '_MANUAL_OVERRIDES', '_VAV_DRIFT_STATE', '_WEATHER_NOW_CACHE', '_WEATHER_NOW_TTL_S', '_ahus_from_config', '_anon_effective_config', '_build_snapshot', '_bundled_mock_mode_default', '_demo_oa_state', '_enthalpy', '_fs_available', '_fs_root', '_humidity_ratio', '_load_csv', '_load_json', '_mark_weather_source', '_markov_drift', '_nasa_power_history', '_nasa_power_to_openmeteo', '_resolve_band', '_restamp_year', '_safe_join', '_scalar_drift', '_set_last_weather_source', '_simulate_ahu', '_v2_weatherapi_key', '_weatherapi_to_openmeteo', '_zero_pad_variants', 'httpx'):
        if hasattr(_server, name):
            g[name] = getattr(_server, name)

_pull_from_server()


@router.get("/api/weather-location")
async def weather_location(tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    if tenant:
        loc = await read_weather_location(tenant)
        if loc:
            # Fresh-session fallback: when no `active` has been picked yet
            # but the operator has pinned a default, surface that as the
            # active location so the dashboard auto-loads it on first open
            # instead of stranding the user on the bundled "Seattle Children's"
            # baseline.  `default` itself is also returned verbatim so the
            # UI can render the star indicator.
            if not loc.get("active") and loc.get("default"):
                loc["active"] = loc["default"]
            # 2026-05-25 fix: when the operator has not saved any custom
            # locations yet (`saved` is empty/missing), seed the dropdown
            # with the bundled demo cities so the modal isn't empty.  The
            # moment the operator adds their first real location and POSTs,
            # the persisted `saved` array fully replaces this fallback --
            # we never silently mix user content with bundled defaults
            # AFTER the user has started curating their own list.
            if not loc.get("saved"):
                loc["saved"] = SAVED_LOCATIONS
            return loc
    return {"active": ACTIVE_LOCATION, "saved": SAVED_LOCATIONS, "default": None}


@router.post("/api/weather-location")
async def set_weather_location(update: WeatherLocationUpdate,
                               tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    """Persist the operator's weather-location pick.  Anonymous = no-op."""
    if not tenant:
        return {"ok": False, "persisted": False,
                "warning": "Sign in to save weather locations."}
    return await write_weather_location(tenant, update)


@router.get("/api/weather-proxy")
async def weather_proxy(
    latitude: float = Query(...),
    longitude: float = Query(...),
    start_date: str = Query(...),
    end_date: str = Query(...),
    hourly: str = Query("temperature_2m,relative_humidity_2m"),
    timezone_q: str = Query("auto", alias="timezone"),
) -> Any:
    """3-tier weather-history proxy used by the psy_3d.html page.

    Order:
      1. open-meteo /v1/archive  (free, no key, ideal; blocked on some Korean ISPs)
      2. weatherapi.com history.json (free key, last 7 days only)
      3. NASA POWER hourly point   (free, no key, unlimited history)

    The front-end always sees the open-meteo response shape.  The `source`
    field in the body tells you which tier served the data."""
    import httpx  # local import keeps cold-start fast
    om_error = wa_error = np_error = None

    # ---- 1) open-meteo
    om_params = {
        "latitude":   latitude,
        "longitude":  longitude,
        "start_date": start_date,
        "end_date":   end_date,
        "hourly":     hourly,
        "timezone":   timezone_q,
    }
    try:
        async with httpx.AsyncClient(timeout=8) as client:
            r = await client.get("https://archive-api.open-meteo.com/v1/archive",
                                 params=om_params)
        if r.status_code == 200:
            _mark_weather_source("open-meteo", "ok")
            return r.json()
        om_error = f"HTTP {r.status_code}"
    except Exception as e:  # noqa: BLE001
        om_error = str(e)

    # ---- 2) weatherapi.com
    key = _v2_weatherapi_key()
    if key:
        wa_params = {
            "key":    key,
            "q":      f"{latitude},{longitude}",
            "dt":     start_date,
            "end_dt": end_date,
        }
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                r = await client.get("https://api.weatherapi.com/v1/history.json",
                                     params=wa_params)
            if r.status_code == 200:
                payload = _weatherapi_to_openmeteo(r.json(), latitude, longitude)
                if payload.get("hourly", {}).get("time"):
                    _mark_weather_source("weatherapi.com", "ok")
                    return payload
                wa_error = "empty payload (range likely older than 7-day free-tier window)"
            else:
                wa_error = f"HTTP {r.status_code}"
        except Exception as e:  # noqa: BLE001
            wa_error = str(e)
    else:
        wa_error = "no API key configured"

    # ---- 3) NASA POWER
    np_params = {
        "parameters":    "T2M,RH2M",
        "community":     "RE",
        "longitude":     longitude,
        "latitude":      latitude,
        "start":         start_date.replace("-", ""),
        "end":           end_date.replace("-", ""),
        "format":        "JSON",
        "time-standard": "UTC",
    }
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.get("https://power.larc.nasa.gov/api/temporal/hourly/point",
                                 params=np_params)
        if r.status_code == 200:
            payload = _nasa_power_to_openmeteo(r.json(), latitude, longitude)
            if payload.get("hourly", {}).get("time"):
                _mark_weather_source("nasa-power", "ok")
                return payload
            np_error = "empty payload from NASA POWER"
        else:
            np_error = f"HTTP {r.status_code}"
    except Exception as e:  # noqa: BLE001
        np_error = str(e)

    _mark_weather_source(
        "error", "error",
        detail=f"open-meteo={om_error}; weatherapi={wa_error}; nasa-power={np_error}",
    )
    return {"success": False,
            "error":  "all weather sources failed",
            "open_meteo_error": om_error,
            "weatherapi_error": wa_error,
            "nasa_power_error": np_error}


@router.get("/api/weather-health")
async def weather_health() -> Any:
    """Lightweight live-status endpoint for the dashboard's source dot.

    Returns the upstream that satisfied the most recent /api/weather-proxy
    call so operators get instant visual feedback when Open-Meteo is
    blocked and the proxy has cascaded to WeatherAPI or NASA POWER."""
    return dict(_LAST_WEATHER_SOURCE)


@router.get("/api/weather-history")
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


@router.get("/api/tomorrow-forecast")
async def tomorrow_forecast() -> dict:
    now = time.time()
    out = [{"hour": h, "t": _demo_oa_state(now + h * 3600)["t"],
            "rh": _demo_oa_state(now + h * 3600)["rh"]} for h in range(24)]
    return {"location": ACTIVE_LOCATION, "hours": out}


@router.get("/api/weather-current")
async def weather_current(lat: float = Query(...), lon: float = Query(...)) -> dict:
    key = (round(lat, 2), round(lon, 2))
    now_ts = time.time()
    hit = _WEATHER_NOW_CACHE.get(key)
    if hit and (now_ts - hit[0]) < _WEATHER_NOW_TTL_S:
        return hit[1]
    import urllib.parse  # noqa: PLC0415
    import urllib.request  # noqa: PLC0415
    params = urllib.parse.urlencode({
        "latitude":  lat,
        "longitude": lon,
        "current": ("temperature_2m,relative_humidity_2m,cloud_cover,"
                    "wind_speed_10m,wind_direction_10m,precipitation,"
                    "shortwave_radiation,weather_code"),
        "timezone": "auto",
    })
    url = "https://api.open-meteo.com/v1/forecast?" + params
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Red5-Studio-V2.0"})
        with urllib.request.urlopen(req, timeout=8) as resp:
            raw = json.loads(resp.read().decode("utf-8"))
    except Exception as e:  # noqa: BLE001
        return {"success": False, "error": str(e)}
    cur = raw.get("current") or {}
    units = raw.get("current_units") or {}
    payload = {
        "success": True,
        "lat": lat, "lon": lon,
        "time": cur.get("time"),
        "tz": raw.get("timezone"),
        "temperature_c":      cur.get("temperature_2m"),
        "relative_humidity":  cur.get("relative_humidity_2m"),
        "cloud_cover":        cur.get("cloud_cover"),
        "wind_speed_kmh":     cur.get("wind_speed_10m"),
        "wind_direction_deg": cur.get("wind_direction_10m"),
        "precipitation_mm":   cur.get("precipitation"),
        "ghi_wm2":            cur.get("shortwave_radiation"),
        "weather_code":       cur.get("weather_code"),
        "units": {
            "temperature_c":    units.get("temperature_2m", "°C"),
            "wind_speed_kmh":   units.get("wind_speed_10m", "km/h"),
            "precipitation_mm": units.get("precipitation", "mm"),
            "ghi_wm2":          units.get("shortwave_radiation", "W/m²"),
        },
        "source":  "open-meteo",
        "fetched": int(now_ts),
        "ttl_s":   _WEATHER_NOW_TTL_S,
    }
    _WEATHER_NOW_CACHE[key] = (now_ts, payload)
    return payload
