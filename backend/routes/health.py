"""routes/health.py -- health endpoints.

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

# Phase L.33 (2026-06-24): direct imports replacing the original
# `_pull_from_server()` shim.  Each name now lives in its canonical
# module; `server` still exports the few helpers (mark/set weather
# source, nasa-power adapter, weatherapi key reader, etc.) that
# genuinely live there.
from models.fs import (
    ALLOWED_FS_ROOTS,
    DATA_ROOT,
    DIRECTORY_SCAFFOLD,
    SCRIPTS_ROOT,
    _404_no_cache,
    _fs_available,
    _fs_root,
    _safe_join,
    _zero_pad_variants,
)
from models.loaders import (
    DEMO_DATA_DIR,
    ROOT,
    _CACHE,
    _load_csv,
    _load_json,
)
from models.data import AHUSnapshot, SnapshotList
from models.weather import (
    ACTIVE_LOCATION,
    SAVED_LOCATIONS,
)
from models.state import (
    _ANON_OVERRIDE,
    _DEMO_START_TS,
    _LAST_WEATHER_SOURCE,
    _LAST_WEATHER_TS,
    _WEATHER_NOW_CACHE,
    _WEATHER_NOW_TTL_S,
)
from simulator import (
    _AHU_COLORS,
    _DEMO_AHUS,
    _MANUAL_OVERRIDES,
    _VAV_DRIFT_STATE,
    _ahus_from_config,
    _build_snapshot,
    _demo_oa_state,
    _enthalpy,
    _humidity_ratio,
    _markov_drift,
    _resolve_band,
    _scalar_drift,
    _simulate_ahu,
)
from server import (
    _anon_effective_config,
    _bundled_mock_mode_default,
    _mark_weather_source,
    _v2_weatherapi_key,
)
@router.get("/api/health")
async def health() -> dict:
    return {"ok": True, "version": "2.0.0-phase1", "mode": "demo"}


@router.get("/api/version")
async def version() -> dict:
    return {"version": "2.0.0-phase1", "build": "demo", "fork": "V2.0"}


@router.get("/api/data-mode")
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


@router.get("/api/data", response_model=SnapshotList,
            response_model_exclude_none=False)
async def get_data(tenant: Optional[dict] = Depends(current_tenant_optional)) -> SnapshotList:
    """V1.9 contract: ARRAY of AHU entries.  Dashboard rejects non-array.

    Resolution:
      - Signed-in: tenant's saved collector_config (falling back to bundled
        demo if the tenant hasn't saved one yet).
      - Anonymous: bundled collector_config.json with the in-memory
        anonymous mock_mode override applied.

    `mock_mode:false` + non-empty `ahu_groups` -> snapshot built from those
    AHU/VAV names.  Otherwise -> the bundled `_DEMO_AHUS` template.

    Per-AHU enrichment: each entry is decorated with a `g36` block
    (operating mode + request counts + SAT/DSP reset values) computed
    from the synthesized telemetry.  Mode + request counts refresh on
    every poll; the T&R reset values walk on the canonical 2-minute
    ASHRAE-36 Td cadence (throttled inside `auto_tick_from_ahu_dict`).
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
            snapshot = _build_snapshot(ahus)
        else:
            snapshot = _build_snapshot()
    else:
        snapshot = _build_snapshot()

    # Decorate each AHU with G36 state.  Runs all ticks in parallel so
    # the /api/data response stays under ~50 ms even with 10+ AHUs.
    import asyncio
    g36_results = await asyncio.gather(
        *[auto_tick_from_ahu_dict(a["id"], a) for a in snapshot],
        return_exceptions=True,
    )
    for ahu, g36 in zip(snapshot, g36_results):
        if isinstance(g36, dict):
            # Shrink the payload to just what the dashboard chip needs.
            ahu["g36"] = {
                "mode":             g36.get("mode"),
                "mode_reason":      g36.get("mode_reason"),
                "cooling_requests": g36.get("cooling_requests", 0),
                "heating_requests": g36.get("heating_requests", 0),
                "pressure_requests": g36.get("pressure_requests", 0),
                "sat_reset_c":      g36.get("sat_reset_c"),
                "dsp_reset_pa":     g36.get("dsp_reset_pa"),
                "last_tick_at":     g36.get("last_tick_at"),
            }

    # Phase L.39 — feed the per-AHU EWMA accumulator for the pill trend
    # arrows.  alpha = poll-interval / 24h, so the EWMA closely tracks
    # a true 24h moving average while needing only three floats per AHU
    # (exchange, absorption, sample-count).  Bootstrap: first sample
    # seeds at current value so initial delta = 0.
    try:
        _update_rolling_avgs(snapshot)
    except Exception:   # noqa: BLE001 — never let a stats blip break /api/data
        pass

    return snapshot


def _update_rolling_avgs(snapshot: list) -> None:
    """Update `_ROLLING_AVGS` in place from the freshly-built snapshot.

    Reads OA/SA/RA from each AHU's `points` array and computes the same
    exchange/absorption deltas the dashboard's MetricBar pills display
    (h_SA − h_OA and h_RA − h_SA respectively).  Uses the simulator's
    `_enthalpy` helper so the maths matches what the frontend renders.
    """
    from models.state import _ROLLING_AVGS, _ROLLING_ALPHA
    for ahu in snapshot:
        aid = ahu.get("id")
        pts = {p.get("label"): p for p in (ahu.get("points") or []) if isinstance(p, dict)}
        oa, sa, ra = pts.get("OA"), pts.get("SA"), pts.get("RA")
        if not (aid and oa and sa and ra):
            continue
        try:
            # `w` in the snapshot is stored as kg/kg (e.g. 0.00824),
            # matching what _enthalpy expects.
            h_oa = _enthalpy(float(oa["t"]), float(oa["w"]))
            h_sa = _enthalpy(float(sa["t"]), float(sa["w"]))
            h_ra = _enthalpy(float(ra["t"]), float(ra["w"]))
        except (KeyError, TypeError, ValueError):
            continue
        ex = h_sa - h_oa
        ab = h_ra - h_sa
        prev = _ROLLING_AVGS.get(aid)
        if not prev:
            _ROLLING_AVGS[aid] = {"exchange": ex, "absorption": ab, "n": 1}
        else:
            a = _ROLLING_ALPHA
            _ROLLING_AVGS[aid] = {
                "exchange":   a * ex + (1.0 - a) * prev["exchange"],
                "absorption": a * ab + (1.0 - a) * prev["absorption"],
                "n":          prev.get("n", 0) + 1,
            }


@router.post("/api/data-mode")
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


@router.get("/api/disk-status")
async def disk_status() -> dict:
    return {
        "total_kb": 50000,
        "used_kb": 18430,
        "free_kb": 31570,
        "percent_used": 36.86,
        "mode": "demo",
    }
