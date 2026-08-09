# B1–B10 Band Control Guide

A Givoni-style climate-band strategy for AHU control. Each band picks an
SA target + OA damper position best suited to a given OA condition,
replacing fixed T/RH setpoint control. Typical seasonal energy reduction
vs. conventional SA setpoint control: **70–75 %** in temperate climates.

> Source of truth for bands: `BANDS` array in `js/psy-3d-engine.js` and
> mirrored in `collector.py`. Do not edit one without the other.

---

## Plain-language summary (6th-grade level)

A "dumb" AHU obeys one rule like *"keep supply air at 13 °C / 50 % RH no
matter what."* That's like wearing a winter coat *and* shorts every day.

The B1-B10 strategy is **10 outfits**, one per weather mood:

1. Look outside (T, RH).
2. Pick the matching band (B1 cold-dry … B10 hot-humid).
3. Use *that* band's SA target + damper position.

Same comfort, much less electricity — because we stop fighting the
weather and meet it halfway.

---

## The 10 bands at a glance

| Band | When active (OA T / RH)        | SA target          | OA damper | Climate mood          |
|------|--------------------------------|--------------------|----------:|-----------------------|
| B1   | −50…5 °C / 0–100 %             | 21.0 °C / 40 % RH  |     15 %  | cold (any RH)         |
| B2   | 5–16 °C / 0–100 %              | 19.5 °C / 35 % RH  |     15 %  | cool (any RH)         |
| B3   | 15–22 °C / 0–35 %              | 19.0 °C / 45 % RH  |     30 %  | mild & dry            |
| B4 ⭐ | 18–23 °C / 32–55 %             | 20.0 °C / 40 % RH  |    100 %  | mild — **economizer** |
| B5   | 22–26 °C / 40–70 %             | 23.5 °C / 50 % RH  |    100 %  | warm — economizer     |
| B6   | 25–28 °C / 45–70 %             | 25.0 °C / 55 % RH  |     50 %  | warmer (mix 50/50)    |
| B7   | 26–36 °C / 45–90 %             | 12.0 °C / 95 % RH  |     15 %  | hot & humid           |
| B8   | 32–45 °C / 65–100 %            | 13.0 °C / 95 % RH  |     15 %  | hot & very humid      |
| B9   | 25–50 °C / 0–50 %              | 15.0 °C / 40 % RH  |     15 %  | hot & dry             |
| B10  | 28–50 °C / 80–100 %            | 11.0 °C / 95 % RH  |     15 %  | extreme hot & humid   |

⭐ B4 = the magic "free cooling" band. All coils OFF, 100 % outside air.

---

## Per-band control detail

For each band: when it activates, what the AHU delivers, and what each
component does.

### 🧊 Cold bands

#### B1 — Very cold & dry  *(OA: −50…5 °C, 0–100 % RH)*
- **SA:** 21.0 °C / 40 % RH | **OA damper:** 15 %
- Cooling coil: **OFF**
- Heating coil: **HIGH** — biggest annual lift
- Humidifier: **ON** (steam / evaporative)

Why: pull in only the legal-minimum fresh air; recirculate warm/humid
return air. Heating coil does the heavy work; humidifier replaces winter
dryness.

#### B2 — Cool & dry  *(OA: 5–16 °C, 0–100 % RH)*
- **SA:** 19.5 °C / 35 % RH | **OA damper:** 15 %
- Cooling: OFF — Heating: low–medium modulating — Humidifier: light

Why: same min-OA logic as B1, milder lift.

---

### 🌤️ Mild bands (economizer sweet spot)

#### B3 — Mild & dry  *(OA: 15–22 °C, 0–35 % RH)*
- **SA:** 19.0 °C / 45 % RH | **OA damper:** 30 %
- Cooling: OFF — Heating: trim only — Humidifier: ON (dry OA)

Why: OA already near SA — barely any coil work; humidifier compensates
for low OA moisture.

#### B4 — Mild & moderate humidity  *(OA: 18–23 °C, 32–55 % RH)* ⭐
- **SA:** 20.0 °C / 40 % RH | **OA damper:** **100 %**
- All coils: **OFF** — Humidifier: OFF
- RA damper: **closed** | Exhaust damper: **open**

Why: outside air ≈ desired SA. Bypass coils entirely; building breathes
straight outside air. Chiller + boiler both off → biggest savings.

---

### 🌞 Warm comfort bands

> **Standards basis** — B5 and B6 sit inside the **ASHRAE Standard
> 55-2023** Category A summer comfort polygon (operative T 23-27 °C,
> RH 30-60 %).  See `📘 ASHRAE 55 Reference` for the underlying PMV/PPD
> reasoning.

#### B5 — Warm & medium humidity  *(OA: 22–26 °C, 40–70 % RH)*
- **SA:** 23.5 °C / 50 % RH | **OA damper:** **100 %**
- Cooling coil: light trim only — Heating: OFF — Humidifier: OFF

Why: still in economizer range — 100 % OA cheaper than mechanical
cooling with recirculation. Coil does final small trim.

#### B6 — Warmer  *(OA: 25–28 °C, 45–70 % RH)*
- **SA:** 25.0 °C / 55 % RH | **OA damper:** 50 %
- Cooling coil: medium modulating — Heating: OFF — Humidifier: OFF

Why: OA now warmer than SA. Mix 50/50 with cooler return air to lower
coil load.

---

### ☀️ Hot bands

#### B7 — Hot & humid  *(OA: 26–36 °C, 45–90 % RH)*
- **SA:** 12.0 °C / 95 % RH | **OA damper:** 15 %
- Cooling coil: **HIGH** + dehumidification — Heating: OFF (or reheat
  trim) — Humidifier: OFF

Why: pull in legal minimum hot/humid OA; coil drags air down across the
saturation curve to wring out moisture. SA leaves coil near-saturation.
Reheat coil may bump sensible temperature back up to comfort.

#### B8 — Hot & very humid  *(OA: 32–45 °C, 65–100 % RH)*
- **SA:** 13.0 °C / 95 % RH | **OA damper:** 15 %
- Cooling coil: **MAX** — Heating: optional reheat — Humidifier: OFF

Why: same strategy as B7, scaled up. Most coil-heavy band of the year.

#### B9 — Hot & DRY  *(OA: 25–50 °C, 0–50 % RH)*
- **SA:** 15.0 °C / 40 % RH | **OA damper:** 15 %
- Cooling coil: heavy **sensible-only** (dry coil) — Heating: OFF —
  Humidifier: OFF (an indirect evaporative pre-cooler can slash load)

Why: hot but dry → no dehumidification needed. Coil only sheds sensible
heat. Arid-climate retrofits should add evaporative pre-cooling.

#### B10 — Extreme hot & humid (monsoon)  *(OA: 28–50 °C, 80–100 % RH)*
- **SA:** 11.0 °C / 95 % RH | **OA damper:** 15 %
- Cooling coil: **ABSOLUTE MAX** — Heating: likely as reheat —
  Humidifier: OFF

Why: worst case. Coil drops air to ~11 °C to wring moisture; reheat
warms the dehumidified air back up to comfort without re-adding moisture.

---

## 🎛️ Component duty cycle (5-second summary)

| Component                  | Hardest in           | Idle in                          |
|----------------------------|----------------------|----------------------------------|
| Heating coil               | B1, B2               | B3–B10 (used as reheat in B7/B8/B10 only) |
| Cooling coil               | B7, B8, B10          | B1–B4                            |
| Humidifier                 | B1, B2, B3           | All warm bands                   |
| **OA damper @ 100 %** ⭐    | **B4, B5**           | all others                       |
| OA damper @ 15 % (minimum) | B1, B2, B7, B8, B9, B10 | B3 (30 %), B6 (50 %)          |

---

## 🔍 Why this beats fixed-setpoint control

A conventional fixed-setpoint AHU runs the cooling coil at a constant SA
target year-round — even in February. B1-B10 looks at what outside air
can give you **for free** and only spends energy on what's still missing.

In a temperate climate the B3+B4+B5 economizer bands cover ~25–30 % of
the year, during which the coils are essentially OFF.

The 2D T×Time chart on the dashboard makes this gap visible: the green
B1-B10 cumulative curve typically reads ~25 % of the purple Total curve
by year-end → ~75 % energy reduction.

---

## Files this guide reflects

- `js/psy-3d-engine.js` — `BANDS` table + `classifyBand()` function +
  `BAND_COLOR` ramp
- `collector.py` — runtime band classification on live BACnet OA data
- `band_csv_generator.py` — exports per-AHU band-guide CSVs
  (`AHU-XX_band_guide.csv`)
- `equipment_types.json` — ground-truth band table for the controller
