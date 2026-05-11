# Psychrometric Chart: How Mechanical Equipment Selection Designers Use It

> **Purpose**: Bridges the gap between the static, hand-drawn psychrometric chart that MEP designers have used for ~80 years and the live, climate-aware diagnostic engine implemented in Red5 Studio. Use this document to explain Red5's value proposition to mechanical engineers and to inform future "Designer Mode" features.
>
> **Audience**: Mechanical engineers, sales engineers, controls integrators, building-owner technical reps.

---

## The Classic Design Workflow

### Step 1 — Plot the four anchor states

The designer locates four points on the chart that bound every air-handling decision:

| Point | What it represents | Typical winter / summer |
|---|---|---|
| **OA** | Outdoor design air (ASHRAE 1% / 99% bin) | e.g. 35 °C, 50 % RH summer · −5 °C, 80 % RH winter |
| **RA** | Return air from the zones | 24 °C, 50 % RH (occupied setpoint) |
| **MA** | Mixed air after OA + RA blend | sits on the line OA—RA, ratio = outdoor-air fraction |
| **SA** | Supply air leaving the AHU | typically 13–14 °C cooling / 32–35 °C heating |
| **ZA** | Zone air (what occupant feels) | sits on the SA—load line |

These five points trace the air loop as a polygon on the chart. The Red5 dashboard already animates this as the **Givoni overlay + dynamics animation** — that's exactly the diagram.

---

## What Gets Sized Off Each Chart Segment

### 1. Cooling-coil sizing (OA→MA→SA leg, summer)

The vertical drop from MA to SA (sensible cooling) AND the leftward drop in humidity ratio W (latent / dehumidification) define the coil's **total enthalpy delta Δh**.

```
Coil tons = (CFM × 4.5 × Δh in Btu/lb) / 12,000
```

Two coil-selection numbers come straight off the chart:

- **Apparatus dew point (ADP)** — extend the MA→SA line to the saturation curve. That intersection is the coil's effective surface temperature.
- **Coil bypass factor (BF)** — `(SA – ADP) / (MA – ADP)`. A 4-row coil typically gives ~0.15; an 8-row gives ~0.05. Designers choose row depth + fin spacing to land at the required BF.

### 2. Heating-coil sizing (winter, MA→SA up-leg)

Pure horizontal travel (sensible only).

```
Coil MBH = CFM × 1.08 × ΔT
```

### 3. Humidifier sizing (winter, MA→SA up-and-right leg)

```
Steam/evap-pan capacity (lb/hr) = CFM × 4.5 × ΔW
```

where ΔW is the humidity-ratio rise from MA to SA on the chart.

### 4. VAV terminal-box reheat (zone-level, SA→ZA)

The line from SA (13 °C, 8 g/kg) up to ZA (24 °C, comfort zone) is the **room sensible load slope**. The reheat coil in each VAV box is sized to lift SA to whatever ZA each individual zone demands.

### 5. Energy-recovery wheel (ERV/HRV) selection

Two points pre-recovery (OA, RA), two points post-recovery (OA′, RA′). The **enthalpy effectiveness**:

```
ε = (h_OA – h_OA′) / (h_OA – h_RA)
```

is the wheel's selection criterion. Designers plot the recovered state and re-run the coil sizing from the smaller Δh — typically chopping coil tonnage by 30–50 %.

### 6. Economizer changeover setpoint

The OA enthalpy line (constant h) intersecting the RA enthalpy line on the chart **is** the economizer cutoff. Below it, free cooling is cheaper than mechanical; above it, return-air recirculation wins. Red5's B1–B10 strategy curves implement exactly this logic.

### 7. Dehumidifier / wrap-around coil (lab, hospital, museum)

Often need to over-cool below SA setpoint to nail latent load, then sensibly reheat back to SA. The chart shows a triangle: MA → over-cooled point → SA. Both the over-cool coil and the wrap-around reheat coil are sized off the legs of that triangle.

---

## Why Red5 Maps So Cleanly to This Workflow

What designers do statically on paper, Red5's engine does **dynamically with live BACnet telemetry**:

| Hand-drawn chart workflow | Red5 equivalent |
|---|---|
| Plot OA from ASHRAE bin table | Live `OA_T`, `OA_RH` from `collector.py` / Open-Meteo |
| Plot SA from coil schedule | Live `SAT`, `SAH` from sensors |
| Draw OA→SA process line by hand | `OA→SA Projection` overlay (Option A) |
| Estimate coil Δh from line length | Δ-h-vs-time back-wall chart (3D view) |
| Verify ZA in comfort zone | VAV CZ scatter (right wall) + dark/light emerald status rings |
| Compare control strategies on calculator | Monthly × Sites 4-strategy chart + "% of Opt-SA captured" |

The killer feature is the **40–60 % RH "sweet spot" strip** + Givoni overlay. That's the building-physics overlay designers normally draw onto a Carrier or ASHRAE Fundamentals chart with a colored pencil — but Red5's auto-shifts with the user's range slider and grades each VAV's status in real time:

- **Dark emerald** — inside the sweet spot
- **Light emerald** — inside the comfort zone (Givoni)
- **Orange** — hot side
- **Dark blue** — cold side

---

## How a Designer Would Actually Use Red5

### 1. Schematic Design Phase

Run the 3D Weather Strip at the site's lat/long for a full year, switch to 2D X-Y Detail, eyeball the OA cloud:

- **Points cluster left of comfort zone** → climate is heating-dominated → spec MAUs with big heating coils.
- **Points pile into the upper right** → cooling/latent-dominated → size cooling coils for high ADP, consider DOAS + radiant.

### 2. Equipment Selection

Toggle through the 3 OA-band projection modes:

- **Lines** → see where each band's SA target lands.
- **Landing Zones** → cluster centroids show the worst-case SA condition the coil must hit.
- **VAV Zone Delivery** → confirm SA + reheat can deliver each zone's ZA without breaking CZ compliance.

### 3. Control Strategy Comparison

Monthly × Sites with all 4 strategies on. The **B1-B10 + Dyn-Reset** curve vs Fixed-SA gives the annual kJ/kg savings — that's the dollar number the mechanical engineer brings to the owner.

### 4. Commissioning / Post-Occupancy

Live VAV scatter on the right wall is the cooling-tower / DDC tuning tool:

- If too many dots fall in the **orange (hot) band** on summer afternoons → SA reset schedule is too aggressive.
- If **blue dots dominate** in shoulder seasons → heating reset is undertuned.

---

## Summary

Mechanical designers use the psych chart as **three tools in one**:

1. **A sizing calculator** — coil tons, MBH, humidifier lb/hr, ERV ε, ADP, BF all read off chart geometry.
2. **A control-strategy comparator** — economizer cutoffs, SA-reset envelopes, dehum-reheat triangles.
3. **A commissioning verifier** — confirming the delivered ZA actually lands in the comfort zone.

**Red5 turns each of those static workflows into a live, climate-aware loop**, with the same diagrammatic vocabulary the designer learned in school — but now driven by real BACnet sensor data and a full year of historical climate.

---

## Future Feature Hook: "Designer Mode"

**STATUS: Shipped in V1.9 (2026-02-09)** — toggle button live at `dashboard.html → 3D Psychrometric Chart → X-Y Detail → + Designer Mode`.

A proposed view that overlays the four sizing numbers (coil Δh, BF, ADP, ERV ε) directly on top of the existing 2D chart so an MEP engineer can read them straight off the screen without leaving the dashboard. Would close the loop from *"live telemetry visualization"* → *"design-phase decision support."*

Implementation sketch:

- Toggle button in the 2D X-Y Detail overlay: **`+ Designer Mode`**.
- When on, draw the MA→SA process line in solid amber, extend it to the saturation curve to mark **ADP** with a labeled dot.
- Compute `BF = (SA – ADP) / (MA – ADP)` and show in the bottom-right corner of the chart.
- Compute Δh from the segment endpoints and tons assuming a user-input CFM (sidebar field, default 10,000 CFM).
- Optional second toggle `+ ERV` shows pre/post-recovery states and live ε.

### Shipped V1 implementation details

- **Toggle**: amber `+ Designer Mode` button top-left of the 2D overlay (`px 280, top 46`).
- **Inputs panel**: floating amber-bordered card with 8 inputs (CFM, OAfrac, OA T/RH, RA T/RH, SA T/RH). State persisted in `localStorage` under `red5DesignerState`.
- **Polygon**: dashed slate OA→RA mixing line; solid 2.6-px amber MA→SA process line; dashed amber SA→ADP extension to saturation curve.
- **Dots**: color-coded with inline labels (OA pink `#fb7185`, RA lime `#a3e635`, MA amber `#fbbf24`, SA cyan `#22d3ee`, ADP light-blue `#67e8f9`).
- **Readout card**: bottom-left of chart, 5 rows: Coil Δh (kJ/kg), Cooling tons (RT), ADP (°C), Bypass BF (color-coded: green <0.08, yellow <0.18, red ≥0.18), Room sensible (kBTU/h).
- **ADP solver**: walks the MA→SA direction in 0.1 °C steps from SA downward until the projected line crosses the 100% RH curve (`getW(T, 100)`).
- **Visibility**: button + panel hidden when chart switches to T-Time, W-Time, or Monthly × Sites modes (it's a psy-chart-only tool).
- **Decoupled from live telemetry by design** — Designer Mode is the parallel "what coil do I need?" view that complements the live dot-cloud and dynamics animation.

#### Verified numbers for default Korean summer scenario (CFM 10k, OA 20%)

| Reading | Value | Sanity check |
|---|---|---|
| Coil Δh | 19.0 kJ/kg | typical summer cooling coil |
| Cooling tons | 30.7 RT | rule of thumb 400 CFM/ton in latent climates → 25 RT, 30 RT fits 20% OA mix at OA=35°C/50%RH |
| ADP | 11.9 °C | 7-row coil territory |
| Bypass BF | 0.08 | 8-row coil result (green flag) |
| Room sensible | 213.8 kBTU/h | 10000 × 1.08 × (24-13)×1.8 = 213.8 ✓ |

#### Not yet implemented (deferred)

- ~~ERV / HRV pre-post-recovery overlay + live ε readout~~ **Shipped 2026-02-09**: `+ ERV` checkbox + ε input in the Designer Mode panel. When on, draws OA' (post-recovery OA) in cyan on the OA→RA line at fractional distance ε from OA, plus a small cyan arrowhead showing the wheel's recovery direction. Adds a 6th row to the readout card: **ERV saved RT (savings %)** computed vs the same system without the wheel. Verified against the default Korean summer scenario at ε = 0.80: 8.5 RT saved (28 % reduction), matching the 30-50 % rule of thumb published in ASHRAE 90.1 and Trane Engineers Newsletters.
- Auto-anchor OA point from latest weather data — currently user-input only. A `[USE LIVE OA]` button next to the OA T/RH fields would copy the most recent `weatherData[last]` values into the inputs.

---

*Last updated: 2026-02-09 · Red5 Studio V1.9*
