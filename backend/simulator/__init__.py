"""simulator/__init__.py -- demo telemetry simulator.

Phase L.30 (2026-06-24): extracted from `server.py`.  All of the
deterministic-beat-of-sines + Markov-drift state that powers
/api/data when the operator hasn\'t saved a real BACnet config.

Pure module -- no FastAPI, no HTTP, no MongoDB.  Imported by
`server.py` at module load time and re-exported from there so the
existing Phase L.29 router shims continue to resolve the names
verbatim (e.g. ``_simulate_ahu``, ``_DEMO_AHUS``).

Math + AHU/VAV waveform shapes preserved byte-identical from the
original location in server.py to keep dashboard rendering unchanged.
"""
from __future__ import annotations

import math
import random
import time
from typing import Optional

# `_load_csv` is used by `_resolve_band` to look up the band-guide CSV.
# Moved to models/loaders.py in Phase L.30 -- direct import, no shim needed.
from models.loaders import _load_csv


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
