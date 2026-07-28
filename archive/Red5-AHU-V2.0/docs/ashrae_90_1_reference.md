# ASHRAE Standard 90.1 — Reference

> *Energy Standard for Sites and Buildings Except Low-Rise Residential Buildings*
> ANSI/ASHRAE/IES Standard 90.1 (current edition: 90.1-2022)

---

## TL;DR

ASHRAE 90.1 is the **energy efficiency rulebook** for every commercial building in the
US (and the de-facto model code in Korea, Japan, the EU, the Gulf, and most of
ASEAN).  It tells you the *minimum* envelope U-values, lighting power densities,
HVAC efficiencies, controls, and metering you must install — and the *paths* you
can take to prove compliance.

Knowing 90.1 matters in Red5 Studio because **most of our band defaults, fan-speed
caps, OA reset schedules, economizer triggers, and energy-recovery toggles are
calibrated to satisfy 90.1 Section 6 (HVAC).**  When an operator overrides one of
these defaults, this doc is the source of truth for what compliance margin they
are eating into.

---

## 1. Scope & Compliance Paths

90.1 applies to **every new building, every addition, and every alteration that
touches the envelope, lighting, or HVAC**.  Three compliance paths:

| Path | What you do | When to choose it |
|---|---|---|
| **Prescriptive** | Meet every line-item table value (U, LPD, EER, etc.) | New box-build, simple geometry |
| **Energy Cost Budget (ECB)** | Whole-building simulation vs reference building, prove ≤ baseline cost | Custom geometry, mixed-use, hospitals |
| **Performance Rating Method (PRM, Appendix G)** | Same as ECB but produces a *score* used for LEED / Title 24 / K-LEED | Green-rated projects |

Red5 Studio's controls assume the **Prescriptive** path by default. If your
project is on ECB/PRM, the band shifts you make in the dashboard need to be
echoed in the simulation model so the credited savings stay accurate.

---

## 2. Section 6 — HVAC (the part Red5 cares about)

### 6.4.3.4 — Economizer Control

Required on any cooling system ≥ 33 kW (per climate zone table 6.5.1-1). Two
approved control types — Red5 ships both:

- **Differential-dry-bulb**: OA economizer locks out when `T_OA > T_RA + 2 K`
- **Differential-enthalpy**: OA economizer locks out when `H_OA > H_RA`
  *Mandatory in CZ 1A, 2A, 3A, 4A* (humid east-coast US / SE Asia / KR / JP).

The dashboard's **Givoni-envelope cyan corner** is the differential-enthalpy
lockout in graphical form.  When operator moves the corner inward, they are
making the economizer more conservative than 90.1 requires (fine, just less
free-cooling).

### 6.5.3.6 — Energy Recovery Ventilation (ERV)

Required when `OA fraction ≥ 10 %` AND `supply CFM ≥ table 6.5.6.1-1 trigger`
(varies by CZ + operating hours).  Minimum sensible-heat effectiveness 50 %.

Red5 tracks ERV state in the **3D WX Magenta RH slab** + the per-AHU
`erv_active` telemetry.  When `H_OA ≤ H_RA` AND OA economizer is engaged, ERV
must bypass (else you waste the free cool).  This is a known 90.1 gotcha
operators forget — Red5 nags via the orange-corner alarm.

### 6.5.2.1 — Fan Power Limitation

Total nameplate fan kW for any system ≥ 22 kW must be ≤ the table 6.5.3.1.1A
limit (`brake_kW ≤ CFM * 0.001 + adj`).  This caps the fan-speed slider at
`90 %` for VAV fans by default — operator can override but it counts as a
90.1-conformance variance and must be logged.

### 6.5.3.3 — Hydronic Variable Flow

Pumping systems > 7.5 kW with > 3 control valves must use variable-speed
pumping driven by `ΔP` setpoint.  Red5 enforces this via the **VAV damper
position averaging** scheme — pump RPM rides on the most-demanding zone's DPR.

### 6.4.3.4.5 — Demand-Controlled Ventilation (DCV)

Required for any space with `design occupancy ≥ 40 people / 100 m²` AND
`OA fraction ≥ 25 %`.  Driven by zone CO₂ sensors.  Red5 plumbs `CO2_zone`
points straight into the band-shift logic — see [band_guide.md](/docs#band).

---

## 3. Section 8 — Power (lighting + receptacle)

Mostly a V3.0 / Lighting concern, but two cross-system points matter:

- **Automatic Receptacle Control (8.4.2)**: ≥ 50 % of branch-circuit
  receptacles in offices, classrooms, conference rooms must shut off
  automatically.  Affects the *occupancy fold-down* signal Red5 receives from
  the BAS — when receptacle circuit goes dead, HVAC drops to unoccupied band.
- **Lighting Power Density (Table 9.5.1)**: max LPD per space type.  V3.0 is
  the system that enforces this directly; V2.0 just consumes the
  `lighting_on/off` BV alarm.

---

## 4. Section 9 — Lighting Controls

90.1-2022 reorganised lighting controls into **mandatory** vs **path-specific**:

- Occupancy sensors required in 11 space types (Table 9.4.1.1)
- Daylight harvesting required for any space with `≥ 50 W lighting` adjacent
  to a window
- Automatic time-of-day shut-off + manual override
- Receptacle control linked to occupancy

V3.0 of Red5 Studio is being built explicitly to integrate lighting platforms
that satisfy these controls (Daekyung SCU first, with DALI-IP, KNX-IP, and
Casambi planned).  See [RED5-MODBUS-V3.0-DESIGN.md](/docs#v3-design).

---

## 5. Section 10 — Other Equipment

Sets minimum efficiency for motors, transformers, water heaters.  Mostly
prescribed by equipment selection at design time — Red5 verifies via the
**Energy Snapshot** widget on the landing page (compares nameplate vs OEM
table).

---

## 6. Section 11 — Energy Cost Budget Method (ECB)

If you go ECB, your "proposed design" must beat the "budget building" in
annual energy cost.  Red5's `/api/data` exports the per-zone, per-AHU, and
per-band energy totals an hour at a time — that feeds straight into the
ECB modeling tools (eQUEST, EnergyPlus, IES-VE).

---

## 7. Appendix G — Performance Rating Method (PRM)

The PRM is how you score your building for LEED / K-LEED / BREEAM / WELL.
Mostly the same as ECB but produces a single "% better than 90.1 baseline"
number.  Red5's **24-month rolling YoY chart** is the operator-facing
verification dashboard for the PRM claim — actual energy vs the baseline
the design team filed.

---

## 8. Practical: which Red5 features satisfy which 90.1 clause

| 90.1 clause | Red5 feature | Notes |
|---|---|---|
| 6.4.3.4 economizer | OA economizer toggle + Givoni cyan corner | Diff-dry-bulb default; switch to diff-enthalpy in humid CZ |
| 6.5.3.6 ERV | 3D WX RH-band magenta slab | Auto-bypass when `H_OA ≤ H_RA` |
| 6.5.2.1 fan power | VAV fan-speed cap | Defaults to 90 %; auditable override |
| 6.4.3.4.5 DCV | Band-shift CO₂ override | Per-zone, optional |
| 6.5.3.3 var-flow pump | Damper-position pump-pressure reset | Built-in |
| 9.x lighting | V3.0 Modbus lighting integration | Separate archive |
| App. G PRM | YoY energy widget | Surfaces % vs baseline |

---

## 9. Climate-Zone shortcuts (table 6.5.1-1 at a glance)

| CZ | Region | OA economizer | ERV trigger | Default cooling EER |
|----|--------|---------------|-------------|---------------------|
| 1A | Miami / SG / KL  | Yes (enthalpy) | ≥ 10 % OA  | 13.4 |
| 2A | Houston / TPE / HK | Yes (enthalpy) | ≥ 15 % OA | 13.0 |
| 3A | Atlanta / Shanghai / Seoul | Yes (enthalpy or dry-bulb) | ≥ 20 % OA | 12.8 |
| 4A | NYC / Tokyo / Seoul winter | Yes (dry-bulb) | ≥ 30 % OA | 12.0 |
| 5A | Chicago / Hokkaido | Yes (dry-bulb) | ≥ 40 % OA | 11.5 |
| 6A | Minneapolis / NE-China | Yes (dry-bulb) | ≥ 50 % OA | 11.0 |
| 7  | International Falls / Yakutsk | Yes (dry-bulb) | ≥ 60 % OA | 10.6 |
| 8  | Arctic | Yes (dry-bulb) | mandatory  | 10.0 |

Red5 auto-pulls the operator's CZ from `weather_location` → Open-Meteo
station code → climate-zone lookup, and pre-loads the corresponding default
band positions.

---

## 10. Reading further

- **Standard text**: [ashrae.org/technical-resources/standards-and-guidelines/standards-addenda](https://www.ashrae.org/technical-resources/standards-and-guidelines/standards-addenda)
- **User's Manual** (essential — the standard alone is unreadable): ASHRAE
  publishes a companion `User's Manual for ASHRAE Standard 90.1-2022`
- **Cross-references**: 90.1 ↔ IECC commercial provisions are aligned
  every 3 years; the local AHJ may enforce either.
- **Red5 mapping**: see [control_algorithms.md](/docs#control-algorithms) for
  the algorithmic side of these compliance points.
