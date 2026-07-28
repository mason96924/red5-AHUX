# Red5 `dyn-reset` ↔ ASHRAE Guideline 36 Trim-and-Respond Cross-Walk

**Audience**: HVAC controls engineers and commissioning agents who already understand the Red5 `dyn-reset` knob set (see `band_guide.md`) and need to map it onto an ASHRAE Guideline 36-compliant sequence of operation (SOO) — typically because a building owner has specified G36 in their handover documents.

**TL;DR**: `dyn-reset` is **G36-inspired** but **not G36-compliant out of the box**. This document tells you exactly what to add, change, or document to bridge that gap. It is laid out so you can hand a printed copy to a third-party commissioning agent and have them run their checks against it.

---

## 1 · One-paragraph background

ASHRAE Guideline 36 ("High-Performance Sequences of Operation for HVAC Systems", current edition: **Guideline 36-2021**) codifies thirty-plus years of demand-controlled VAV best practice into a single, prescriptive sequence library. Its core idea — **operate the AHU at the highest supply-air temperature (SAT) and lowest duct static pressure (SP) that still satisfies every zone** — is the same principle Red5 `dyn-reset` was written against. The difference is in the **counting method**. Red5 reacts to the **magnitude** of each zone's deviation from setpoint; G36 reacts to the **count** of zones whose deviation exceeds a per-loop ignore threshold (the "Trim & Respond" method, T&R hereafter). T&R is provably more stable when one rogue zone misbehaves, and it is the algorithm a G36 audit will check for.

---

## 2 · Parameter cross-walk

Below is the side-by-side map. Every Red5 `dyn-reset` knob has an equivalent G36 T&R parameter — sometimes one-to-one, sometimes with caveats. G36 default values come from **Guideline 36-2021 Table 5.1.14.3** (cooling SAT reset) and **§5.1.14.4** (duct static pressure reset).

### 2.1 Supply-Air Temperature (SAT) cooling reset

| Red5 knob (`band_guide.md`) | G36 T&R parameter | G36 default | Notes |
|---|---|---|---|
| `sat_min_c` | **SPmin** (minimum SAT) | 12.8 °C / 55 °F | Same meaning. G36 allows lower for cleanrooms / RH-driven designs. |
| `sat_max_c` | **SPmax** (maximum SAT) | 18.3 °C / 65 °F | Same meaning. Cap higher only after wet-bulb / dehumidification check. |
| `sat_init_c` | **SP0** (initial reset value after mode change) | SPmax (18.3 °C) | G36 starts permissive (warm SAT) and trims down toward demand. Red5 currently starts at `sat_init_c`; rename to `sat_initial_c` and set to `sat_max_c` for parity. |
| **— (no Red5 equivalent yet)** | **I** (ignored requests count) | 2 | Number of "cooling requests" to ignore before responding. **Add to Red5 as `sat_ignored_requests`**. |
| **— (no Red5 equivalent yet)** | **T** (time step / sample period) | 5 min | T&R loop period. Red5's reset loop runs every 30 s — needs a separate slower aggregator. |
| **— (no Red5 equivalent yet)** | **Td** (initial delay after enable) | 10 min | "Wait for the AHU to stabilize before counting requests." **Add as `sat_initial_delay_s`**. |
| `decay_step_c` | **SPtrim** (trim amount per T&R cycle) | +0.1 °C per cycle | When zero responses come in, *trim* (warm) the SAT by this much. **Red5's decay is exponential; G36's is linear.** See §2.4 below. |
| **— (no Red5 equivalent yet)** | **SPres** (respond amount per request) | −0.2 °C per request above I | When `requests > I`, *respond* (cool) the SAT by `SPres × (requests − I)`, capped at SPres-max. **Add as `sat_response_step_c` and `sat_response_max_c`**. |
| `hysteresis_c` | **(no direct G36 equivalent)** | — | G36 has no hysteresis band; it relies on T (5-min sample) to prevent chattering. Setting `hysteresis_c = 0` and `T = 5 min` is G36-compliant. |

### 2.2 Duct static pressure (SP) reset — identical structure

| Red5 knob | G36 T&R parameter | G36 default |
|---|---|---|
| `sp_min_pa` | **SPmin** | 75 Pa (0.3 in.w.g.) |
| `sp_max_pa` | **SPmax** | 374 Pa (1.5 in.w.g.) |
| `sp_init_pa` | **SP0** | SPmin (start low, respond up) |
| — | **I** (ignored requests) | 2 |
| — | **T** (time step) | 2 min |
| — | **Td** (initial delay) | 10 min |
| `sp_trim_pa` | **SPtrim** | −12.5 Pa per cycle (trim down when no requests) |
| — | **SPres** | +37 Pa per request above I |
| — | **SPres-max** | +93 Pa per cycle (cap on aggressive responses) |

> Note the **sign flip**: SAT trims **upward** (warmer, more efficient) and responds **downward** (cooler, satisfies more zones). SP trims **downward** (lower pressure, less fan power) and responds **upward** (more pressure, opens more dampers). The trim/respond *direction* is what makes both reset loops energy-positive.

### 2.3 Outside-air (OA) reset

G36 §5.1.6 mandates a separate **economizer high-limit** plus **minimum OA tracking** (CO2-based DCV when occupied). Red5 has no equivalent yet — currently OA fraction is computed from the band engine's enthalpy comparison. To reach compliance, add:

| Red5 parameter (to add) | G36 reference | Default |
|---|---|---|
| `econ_high_limit_oat_c` | §5.1.6.2 (fixed dry-bulb, climate-zone-specific) | 23.9 °C (Zone 1, hot/humid); 22.2 °C (Zone 5–8) |
| `econ_high_limit_enthalpy_kjkg` | §5.1.6.2 (fixed enthalpy, dual-set option) | 65 kJ/kg dry air |
| `oa_min_cfm_per_person` | §5.1.6.3 | per ASHRAE 62.1 Table 6-1 (≈ 4.7 L/s/person office, 7.6 L/s/person classroom) |
| `dcv_co2_setpoint_ppm` | §5.1.6.3.b | 1000 ppm; respond when zone CO2 > setpoint |

### 2.4 The trim & respond algorithm (pseudocode)

The single function below is **all you need to add** to make `dyn-reset` swap into G36 T&R. Drop this beside `_reset_loop` in `app.py` (V1.9) or `band_engine.py` (V2.0).

```python
def trim_and_respond(now_setpoint, requests, params):
    """
    G36-2021 §5.1.14 Trim & Respond.

    Args:
      now_setpoint : current SAT (or SP) value, °C (or Pa)
      requests     : int — count of zones requesting MORE cooling
                     (for SAT loop, count zones with cooling-loop > 95%
                     for at least 2 consecutive samples — see G36 §5.16.5)
      params       : dict with keys: sp_min, sp_max, ignored, sp_trim,
                     sp_res, sp_res_max  (signs per §2.1/§2.2 above)

    Returns:
      next_setpoint clamped to [sp_min, sp_max]
    """
    if requests <= params['ignored']:
        # Trim: walk back toward the energy-efficient end of the range.
        proposed = now_setpoint + params['sp_trim']
    else:
        # Respond: each excess request pulls the setpoint by sp_res,
        # capped by sp_res_max per cycle so a runaway zone can't whip
        # the whole AHU.
        excess = requests - params['ignored']
        delta  = params['sp_res'] * excess
        # cap by absolute value, preserving sign of sp_res
        if abs(delta) > abs(params['sp_res_max']):
            delta = params['sp_res_max']
        proposed = now_setpoint + delta
    return max(params['sp_min'], min(params['sp_max'], proposed))
```

Call this **once per T (5 min for SAT, 2 min for SP)** with the latest request count from the VAV poll loop. Replace the existing exponential decay in `_reset_loop` with this for the SAT and SP setpoints separately.

### 2.5 "Cooling-request" definition (the part Red5 will need new code for)

A zone counts as **one cooling request** when, for two consecutive samples (≥ 2 min apart), **any** of the following is true (G36 §5.16.5):

1. Zone temperature > zone cooling setpoint + 1.7 °C (3 °F), AND zone has been calling for cooling for ≥ 2 samples.
2. Zone air-handling damper is fully open (≥ 95%) AND zone is still > cooling setpoint + 0.6 °C (1 °F).
3. (Pressure loop only) Zone damper > 95% open and air flow < 90% of setpoint.

Red5 currently exposes per-zone deviation in the band engine but doesn't aggregate it into a discrete request count. **Add a `compute_cooling_requests(zones, dt)` function** that returns `int` and feed it into `trim_and_respond()`.

---

## 3 · The 8 G36 operating modes (which Red5 does **not** have explicitly)

Red5 today operates in a continuous-control regime guided by the Givoni band. G36 partitions operation into **discrete modes** with hard transition criteria. Adding these is the largest gap.

| # | Mode | Trigger | Typical setpoints |
|---|---|---|---|
| 1 | **Occupied** | Schedule + any zone has occupancy or temp deviation | Setpoints per zone schedule |
| 2 | **Warm-up** | OAT < heating setpoint − 2.8 °C AND any zone < heating setpoint − 0.6 °C, before scheduled start | Heating-only, full OA closed, fan ON |
| 3 | **Cool-down** | OAT > cooling setpoint + 2.8 °C AND any zone > cooling setpoint + 0.6 °C, before scheduled start | Cooling-only, full OA closed, fan ON |
| 4 | **Setback heating** | Any zone < heating-setback (typ. 15.6 °C / 60 °F) when unoccupied | Heating-only, minimum airflow |
| 5 | **Setup cooling** | Any zone > cooling-setback (typ. 29.4 °C / 85 °F) when unoccupied | Cooling-only, minimum airflow |
| 6 | **Unoccupied** | Schedule says unoccupied AND no setback/setup triggered | Fan OFF, dampers closed |
| 7 | **Freeze-protection** | OAT < 1.7 °C AND any zone < 4.4 °C | Heating to maintain 4.4 °C, OA fully closed |
| 8 | **Smoke / shutdown** | Fire-alarm input asserted | Fan OFF (or per fire-marshal sequence), dampers closed |

**Transition rules** (G36 §5.1.4.4): a mode is entered only when **all** of its triggers have held for ≥ 10 min, and exited only when **none** of its triggers hold for ≥ 10 min. This prevents thrashing between, e.g., Cool-down and Occupied at start-up.

Red5 path to add this: a new `mode_engine.py` (V2.0) / `_mode_loop` (V1.9) that owns the 8-state machine and gates the existing band engine's reset outputs.

---

## 4 · G36 mandatory points list

A G36 audit checks that you can **read or command** every point below. Red5 V1.9 already exposes most via BACnet; check `bacnet_map.json` against this table during commissioning.

### 4.1 Per AHU (≈ 40 mandatory points)

| # | Point | Direction | Type |
|---|---|---|---|
| 1 | Supply-air temperature (SAT) | AI | °C |
| 2 | Return-air temperature (RAT) | AI | °C |
| 3 | Outside-air temperature (OAT) | AI | °C |
| 4 | Mixed-air temperature (MAT) | AI | °C |
| 5 | Supply-air RH | AI | % |
| 6 | Return-air RH | AI | % |
| 7 | Outside-air RH | AI | % |
| 8 | Supply-fan speed feedback | AI | % |
| 9 | Supply-fan VFD command | AO | % |
| 10 | Duct static pressure | AI | Pa |
| 11 | Duct static pressure setpoint | AV | Pa |
| 12 | SAT setpoint (after T&R) | AV | °C |
| 13 | OA damper position feedback | AI | % |
| 14 | OA damper command | AO | % |
| 15 | RA damper command | AO | % |
| 16 | Heating-coil valve position | AO | % |
| 17 | Cooling-coil valve position | AO | % |
| 18 | Filter differential pressure | AI | Pa |
| 19 | Smoke detector | BI | — |
| 20 | Freeze-stat | BI | — |
| 21 | Supply-fan start/stop command | BO | — |
| 22 | Supply-fan status (current-sensor) | BI | — |
| 23 | Economizer enable | BO | — |
| 24 | Operating mode (1–8 above) | MV | enum |
| 25 | Cooling-request count (computed) | AV | count |
| 26 | Heating-request count (computed) | AV | count |
| 27 | Pressure-request count (computed) | AV | count |
| 28 | Alarm: SAT deviation | BV | — |
| 29 | Alarm: SP deviation | BV | — |
| 30 | Alarm: Filter loaded | BV | — |
| 31–40 | Per-coil status / alarms / minimum-OA flow tracking | mix | — |

### 4.2 Per VAV box (≈ 20 mandatory points)

| # | Point | Direction |
|---|---|---|
| 1 | Zone temperature | AI |
| 2 | Zone cooling setpoint | AV |
| 3 | Zone heating setpoint | AV |
| 4 | Zone airflow | AI |
| 5 | Zone airflow setpoint | AV |
| 6 | Zone damper position | AI |
| 7 | Zone damper command | AO |
| 8 | Zone reheat valve | AO |
| 9 | Zone occupancy sensor | BI |
| 10 | Zone CO2 sensor (DCV-equipped boxes) | AI |
| 11 | Zone cooling-loop output | AV |
| 12 | Zone heating-loop output | AV |
| 13 | Cooling request flag | BV |
| 14 | Heating request flag | BV |
| 15 | Pressure request flag | BV |
| 16–20 | Per-zone alarms / minimum-airflow override / schedule occupancy | mix |

---

## 5 · Commissioning trends (CT 1–9)

G36 §6.2 mandates **at least nine 30-day trend logs** with ≤ 1-minute sample interval. These are the audit's primary evidence that your sequence is working as written. Red5 V1.9 already logs most via the collector; check `collector/config.json` against this list.

| CT # | Trend | Purpose |
|---|---|---|
| **CT-1** | SAT, SAT-setpoint, all zone-temps | Show SAT reset is responsive to zone demand |
| **CT-2** | SP, SP-setpoint, all damper positions | Show SP reset is responsive to damper demand |
| **CT-3** | OAT, MAT, RAT, OA damper command + position | Show economizer is tracking enthalpy |
| **CT-4** | Heating-coil valve, cooling-coil valve | Show no simultaneous heat/cool |
| **CT-5** | Cooling-request count, heating-request count, pressure-request count | Show T&R is counting correctly |
| **CT-6** | Operating-mode enum | Show mode transitions are stable (no thrashing) |
| **CT-7** | Per-zone airflow, airflow-setpoint, CO2 (DCV zones) | Show DCV is overriding minimum airflow when needed |
| **CT-8** | Supply-fan VFD command, status, current | Show fan tracks command and never runs against closed damper |
| **CT-9** | All alarm BVs | Show no spurious alarms |

Red5 collector already supports this at 1-minute resolution. Just enable the trends in `collector/trends.json` and let them run for 30 continuous days during the commissioning window.

---

## 6 · Alarm class matrix (G36 §5.1.16)

Every alarm in the points list above must be classified A / B / C with a published response time. Red5 has alarms but no class field yet — add `alarm_class: 'A'|'B'|'C'` to each alarm definition.

| Class | Examples | Annunciation | Response time |
|---|---|---|---|
| **A** (life-safety) | Freeze-stat, smoke, supply-fan failure, freeze-protection mode active | Immediate dispatch, audible at panel | < 10 min |
| **B** (equipment) | SAT/SP deviation > 30 min, filter loaded, valve override active, sensor failure | BMS notification, ticket auto-opened | < 4 h |
| **C** (informational) | Schedule override, manual setpoint adjustment, mode transition | Logged only | < 24 h |

---

## 7 · Path to G36 compliance — gap analysis

Run this checklist against your current install:

| # | G36 requirement | Red5 status | Action |
|---|---|---|---|
| 1 | Trim-and-Respond SAT reset | **GAP** — Red5 uses magnitude-based exponential decay | Implement §2.4 `trim_and_respond()`; replace `_reset_loop` SAT branch |
| 2 | Trim-and-Respond SP reset | **GAP** — same as above | Same `trim_and_respond()` with the SP parameter dict |
| 3 | Cooling/heating/pressure request counters | **GAP** — Red5 has per-zone deviation but no aggregator | Add `compute_*_requests()` per §2.5 to the VAV poll loop |
| 4 | 8 operating modes + transitions | **GAP** — Red5 is continuous-control | New `mode_engine.py` (V2.0) / `_mode_loop` (V1.9); §3 above |
| 5 | Economizer with fixed dry-bulb or enthalpy high-limit | **PARTIAL** — Red5 uses enthalpy comparison; needs explicit high-limit | Add `econ_high_limit_oat_c` and `econ_high_limit_enthalpy_kjkg` per §2.3 |
| 6 | Minimum OA / DCV per ASHRAE 62.1 | **GAP** — Red5 has OA fraction but no per-person minimum tracking | Add CO2 input to VAV poll + DCV override logic |
| 7 | 40 mandatory points per AHU | **MOSTLY OK** — Red5 V1.9 exposes ~35 via BACnet | Check `bacnet_map.json` against §4.1; add the missing ~5 (mostly computed-AV request counts) |
| 8 | 20 mandatory points per VAV | **MOSTLY OK** — same | Check; add request flag BVs |
| 9 | 9 commissioning trends @ 1 min | **OK** — Red5 collector already supports | Enable in `collector/trends.json`; run 30 days |
| 10 | Alarm class A/B/C tagging | **GAP** — Red5 alarms exist but unclassified | Add `alarm_class` field per §6 |
| 11 | Freeze-protection automatic mode | **PARTIAL** — freeze-stat input is wired but doesn't force mode | Tie into the mode engine added in #4 |
| 12 | No simultaneous heat + cool | **OK** — Red5 band engine prevents this | Verify via CT-4 trend |

**Estimated effort to close all 12 gaps**: ≈ 3–4 dev-weeks for V2.0, plus another 1 week of CT-trend collection during a representative season. For V1.9, add ≈ 2 weeks for the BACnet point expansion since each new point requires a controller flash.

---

## 8 · "But I just want to *say* G36 in our spec sheet"

If the goal is marketing parity (not actual G36 compliance), the minimum credible implementation is:

1. **§2.4 trim_and_respond()** — replace decay-based reset (≈ 1 day).
2. **§2.5 cooling-request counter** — aggregate per-zone (≈ 1 day).
3. **§3 mode engine** — even a 4-mode subset (Occupied / Unoccupied / Warm-up / Cool-down) covers 90% of audit checks (≈ 3 days).
4. **§5 CT-1, CT-2, CT-5** — three trends, 30 days each (zero dev work; just enable).
5. **§7 row 7** — confirm BACnet points list.

That's ≈ 1 dev-week and gets you to **"G36-aware"** status — enough to satisfy a casual spec but not an ASHRAE audit. If the building owner sends a third-party commissioning agent (e.g., a CxA from a firm like Engineering Economics, kW Engineering, or P2S), they **will** run the full §3–§7 checklist and a partial implementation will be flagged.

---

## 9 · References

- ASHRAE Guideline 36-2021, "High-Performance Sequences of Operation for HVAC Systems"
- ANSI/ASHRAE Standard 62.1-2022, "Ventilation for Acceptable Indoor Air Quality"
- ANSI/ASHRAE Standard 90.1-2022, "Energy Standard for Buildings Except Low-Rise Residential Buildings" §6.5.3.1 (DCV)
- Hydeman M., Stein J., et al. (2003), *Advanced Variable Air Volume System Design Guide*, Pacific Gas & Electric — the original source of the trim-and-respond algorithm
- LBNL FlexLab G36 reference implementation: <https://github.com/lbl-srg/ctrl-flow-dev> (open-source Modelica reference)
- Red5 `band_guide.md` — current `dyn-reset` knob documentation (sibling file to this one)

---

*This document is paired with `band_guide.md` on the controller. Updates to either should be reflected in the other.*
*Last updated: 2026-05-24 — initial G36 cross-walk paired with the dashboard's `★ Pin default location` feature shipping in Phase L.7.*
