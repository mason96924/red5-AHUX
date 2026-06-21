# ASHRAE Guideline 36 — Reference

> *High-Performance Sequences of Operation for HVAC Systems*
> ANSI/ASHRAE Guideline 36 (current edition: G36-2021, addendum a published 2023)

---

## TL;DR

Guideline 36 is the **operator's manual for HVAC control logic**.  It tells you
exactly what an AHU, VAV, chiller, and boiler should do at each moment of the
day — when to open the economizer, when to override the supply-air-temperature
setpoint, when to switch occupancy modes, when to alarm.

Most modern BAS contractors (Trane, Distech, JCI, Honeywell, Siemens) ship
"G36-compliant" sequences out of the box.  Red5 Studio's job is to (a) tell
you whether your real-world controller is following them and (b) let you
override them when site reality demands.

The G36 timeline strip in the dashboard (`#g36-timeline-strip`) maps your
last 4 h / 24 h of real telemetry into the seven G36 mode states so you
can see drift at a glance.

---

## 1. The seven G36 operating modes

G36 §5.1 defines seven mutually-exclusive modes every AHU must report:

| # | Mode | Trigger | What Red5 shows |
|---|---|---|---|
| 1 | **Occupied**      | Scheduled hours, occupancy sensor on | Green |
| 2 | **Warm-up**       | Pre-occupied, zone T below morning setback | Orange |
| 3 | **Cool-down**     | Pre-occupied, zone T above evening setback | Light blue |
| 4 | **Setback**       | Unoccupied, T outside narrow band | Grey |
| 5 | **Setup**         | Unoccupied, no T excursion | Faint grey |
| 6 | **Unoccupied**    | Off-hours, fan off | Dark slate |
| 7 | **Freeze protect**| Coil temp < 4 °C | Red |

These map straight to the legend in the G36 timeline strip.  An AHU showing
"OCCUPIED" green when the schedule says "UNOCCUPIED" is the #1 way Red5
catches stuck dampers / failed VFDs / runaway override locks.

---

## 2. Setpoint reset (Trim & Respond — T&R)

G36 §5.1.14 defines **trim-and-respond** as the canonical way to reset SA
temp / SA pressure / chilled-water temp / hot-water temp.  Algorithm:

```
every Tick (default 2 min):
    if zone_request_count >= I:
        SP += SP_res * (zone_request_count / I)  # respond
    else:
        SP -= SP_trim                            # trim
    clamp(SP, min, max)
```

| Parameter | Default | Red5 surface |
|-----------|---------|--------------|
| `Tick`             | 2 min   | hardcoded |
| `I` (importance)   | 2 zones | per-AHU band |
| `SP_res` (respond) | +0.3 °C | per-band |
| `SP_trim` (trim)   | -0.1 °C | per-band |
| `Delay_initial`    | 5 min   | per-band |

The band-shift sliders in the dashboard adjust `SP_res` and `SP_trim` per
zone group — see the [band_guide.md](/docs#band).

---

## 3. Zone requests

A G36 zone "votes" for setpoint change by reporting **how many requests**
it currently has:

- **Cooling request**: zone T > setpoint + 1 °C  → +1 cooling request
- **Pressure request**: damper position > 95 % AND zone underventilated → +1 SA-pressure request
- **Static-pressure request**: VAV inlet damper > 95 % full-open → +1 fan-speed request
- **Heating request**: zone T < setpoint - 1 °C → +1 heating request (RH coil)

Each AHU collects all VAV requests every Tick and either trims or responds
based on the count.  Red5's `/api/data` exposes these as `req_cool`,
`req_press`, `req_heat`, `req_fan` per VAV.

---

## 4. AHU sequences (§5.16)

### 5.16.1 Supply-air temperature reset

T&R reset between `SAT_min = 12 °C` and `SAT_max = 18 °C`, driven by the
cooling-request count summed across all served zones.  Defaults Red5 ships:

```
SAT_min: 12.5 °C   (matches dew-point safety margin for CZ 1-3)
SAT_max: 18.0 °C   (lets ERV bypass without freezing)
SP_res:  +0.3 °C
SP_trim: -0.1 °C
```

### 5.16.2 Static-pressure reset

T&R reset between `SP_min = 50 Pa` and `SP_max = 750 Pa`, driven by
static-pressure-request count from VAV inlet dampers.  The point of the
algorithm is to run the supply fan at the *lowest pressure that still
satisfies the most-demanding damper* — this is where 30 %+ of the fan
energy savings come from on a real building.

### 5.16.3 Economizer

Differential-dry-bulb OR differential-enthalpy (per CZ, see 90.1 §6.4.3.4
above).  G36 strictly defines the hysteresis to prevent damper hunting:

```
ECON_ON  when (T_OA + 1) < T_RA
ECON_OFF when (T_OA - 1) > T_RA
```

Same with enthalpy.  Red5's Givoni overlay shows the operator the live
economizer state — when the cyan corner gates, ERV is bypassed; outside the
cyan corner, ERV is active.

### 5.16.4 Minimum outdoor airflow

Either fixed `MIN_OA_CFM` or **CO₂-based DCV** (per 90.1 §6.4.3.4.5).  Red5
plumbs the live CO₂ telemetry into the DCV setpoint and visualizes the OA
fraction against ASHRAE 62.1 zone requirement.

---

## 5. VAV / Terminal Unit sequences (§5.17)

### 5.17.1 Cooling-only VAV

Damper modulates from `MIN_FLOW` to `MAX_FLOW` based on zone T deviation
from cooling setpoint.  No reheat.

### 5.17.2 VAV with reheat

Two stages:
1. **Stage 1 — Cooling**: damper from `MIN_FLOW` to `MAX_COOL_FLOW`, reheat off
2. **Stage 2 — Heating**: damper at `MIN_HEAT_FLOW`, reheat valve modulates 0-100 %

The transition is rate-limited (slope of 0.1 °C/min) to prevent oscillation.

Red5's VAV equipment modal shows live `DPR` (damper %) + `HCV` (reheat
valve %) + `ZT` (zone T) + `ZRH` (zone RH) so you can verify both stages
are behaving on a per-zone basis.

### 5.17.3 Series fan-powered VAV

Adds a small in-line fan that runs continuously in occupied mode; primary
damper modulates as above.  Mostly used in perimeter zones with high
heating need.  Red5 supports the extra `series_fan_status` BV.

---

## 6. Chilled-water plant (§5.20)

CHWS-T reset via T&R, gated by cooling-request count across all AHUs.
`CHWS_min = 6 °C`, `CHWS_max = 12 °C`.

CHW pump-pressure reset driven by valve-position requests — keep the
most-demanding chilled-water coil valve at 95-100 % open.

Red5 doesn't drive the chiller directly (that's a BACnet write the BAS
contractor owns) but it monitors `CHWS_T`, `CHWR_T`, `kW_chiller`, and
`chiller_efficiency_COP` and surfaces drift via the diagnostics tab.

---

## 7. Hot-water plant (§5.21)

Mirror image of CHW but driven by heating-request count.  `HWS_min = 38 °C`
(supply), `HWS_max = 60 °C`.

---

## 8. Alarms (§5.5)

G36 defines **63 specific alarm conditions** an HVAC system must report.
The most operator-relevant for Red5:

| Alarm | Trigger | Red5 surface |
|---|---|---|
| Low SA temp (high-limit cut-out) | `SAT < 4 °C` for 5 min | Red dot + log |
| High duct static pressure | `SP > SP_max * 1.25` for 10 min | Red dot |
| Fan failure | `cmd ON AND status OFF` for 60 s | Red banner |
| Damper fault | `cmd != position` for 5 min | Per-VAV badge |
| Coil freeze | `mixed_air_T < 4 °C` | Red mode override |
| Zone temperature exception | `|ZT - SP| > 2 °C` for 30 min | Yellow VAV row |

The `freeze_protection` mode in the G36 timeline strip ties to the last
two alarms — it forces the AHU into mode 7 (full OA closure, full HC
demand, fans on min) until an operator clears.

---

## 9. Reading G36 effectively

The standard is **300+ pages of pseudocode**.  Practical reading order:

1. **§4** — Mode definitions (the seven occupancy modes)
2. **§5.1** — Common subroutines (T&R, hysteresis, request counts)
3. **§5.16 + §5.17** — AHU + VAV sequences (90 % of operator work)
4. Skip the chiller / boiler / plant sections unless your BAS contractor
   actually wired them up
5. **§5.5** — Alarms (when something looks wrong, this is the lookup)

---

## 10. G36 vs your real building

A common operator frustration: *"G36 says X but my building does Y."*

Three reasons that happens:

- **Legacy controllers** can't run T&R — they're just PI loops with fixed
  setpoints.  Red5 surfaces this as `g36_mode = "OCCUPIED (no T&R)"` if it
  detects setpoints aren't moving over 30 min.
- **Site-specific overrides** layered on top of G36 by the BAS contractor
  (e.g. "always 14 °C SAT in summer regardless of requests").  Document
  these in the Asset Notes pane — they become invisible otherwise.
- **G36 was never installed** — many "G36-compliant" projects just have
  the *names* of the modes in the BAS sequence document but never actually
  shipped the algorithm.  Red5's timeline strip catches this by showing
  the modes never transition.

When in doubt: pull up the BAS sequence of operations PDF and compare it to
the G36 reference algorithm side-by-side.  The differences are where your
energy savings are hiding.

---

## 11. Practical: which Red5 features run G36 vs verify G36

| G36 clause | Red5 behaviour |
|---|---|
| §5.1.14 T&R | Verifies (reads SAT_SP movement from BAS), doesn't drive |
| §5.16.1 SAT reset | Verifies via SAT trend slope |
| §5.16.2 SP reset | Verifies via SP trend |
| §5.16.3 economizer | Visualises via Givoni cyan corner |
| §5.16.4 OA min / DCV | Verifies via OA-fraction badge |
| §5.17.x VAV sequences | Per-zone DPR + HCV visualisation |
| §5.5 alarms | Real-time alarm rollup in the diagnostic ribbon |

Red5 is a **G36 observer**, not a G36 implementer.  The actual sequences
run on the BAS controller (Distech ECP, Trane SC+, Honeywell N4, etc.).
Red5's job is to tell you whether the BAS is doing what its sequence-of-
operations document claims it does.

---

## 12. Reading further

- **Standard text**: [ashrae.org/technical-resources/ashrae-handbook/ashrae-guideline-36](https://www.ashrae.org/technical-resources/ashrae-handbook/ashrae-guideline-36)
- **G36 implementation playbook** by Taylor Engineering (the firm that wrote
  most of G36): [taylorengineers.com/wp-content/uploads/2020/07/G36-implementation.pdf](https://taylorengineers.com/wp-content/uploads/2020/07/G36-implementation.pdf) (verify URL — paywall sometimes)
- **Companion docs in Red5**:
  - [control_algorithms.md](/docs#control-algorithms) for the math
  - [band_guide.md](/docs#band) for site-specific overrides
  - [ashrae_55_reference.md](/docs#ashrae-55) for comfort-side numbers
  - [ashrae_90_1_reference.md](/docs#ashrae-90-1) for energy-side numbers
