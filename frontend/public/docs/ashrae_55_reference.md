# ASHRAE Standard 55 — Reference

> *Thermal Environmental Conditions for Human Occupancy*
> ANSI/ASHRAE Standard 55 (current edition: 55-2023)

---

## TL;DR

ASHRAE 55 is the international rulebook that defines **what indoor conditions make
people thermally comfortable**.  Most of the default values you see in Red5 Studio —
the 21–27 °C comfort temperature range, the 40–60 % RH "sweet-spot" band, and the
Givoni-envelope corner anchors — come from this standard.

Knowing the numbers is useful when an operator asks *"why is the band set there?"*
or when a new building type (gym, lab, warehouse) calls for the defaults to be
deliberately overridden.

---

## 1. What ASHRAE 55 actually specifies

The standard does **not** just say *"21–27 °C is comfortable"*.  It gives a method to
calculate a comfort envelope based on **six variables**:

| Variable | Symbol | Office default in Red5 Studio |
|---|---|---|
| Air temperature       | T<sub>a</sub>  | 21–27 °C    (T·CLIP slider)        |
| Mean radiant temp     | T<sub>r</sub>  | assumed ≈ T<sub>a</sub>             |
| Relative humidity     | RH             | 40–60 %     (RH band slider)       |
| Air speed             | V              | ≤ 0.20 m/s  (still-air assumption) |
| Metabolic rate        | M (met)        | 1.0–1.3 met (seated office work)   |
| Clothing insulation   | I<sub>cl</sub> (clo) | 0.5 clo summer / 1.0 clo winter |

Plug those into **Fanger's PMV/PPD model** (Predicted Mean Vote / Percentage Person
Dissatisfied) and the standard returns a polygon in psychrometric space — the
"acceptable comfort zone".  For a typical office in still air with seasonal
clothing, the zone collapses to roughly:

| Season | Operative T range | RH range |
|---|---|---|
| Summer (0.5 clo, light clothing) | **23–27 °C** | 30–60 % |
| Winter (1.0 clo, sweater + slacks) | **20–24 °C** | 30–60 % |
| **Year-round overlap (both work)** | **21–27 °C** | **40–60 %** |

That year-round overlap is exactly what Red5 Studio uses as the defaults for the
**RH band slider** and the **3D WX T·CLIP slider**.

---

## 2. Acceptability categories

ASHRAE 55 / EN 16798 define **three** target satisfaction levels:

| Category | % satisfied | Typical use |
|---|---|---|
| **A** | 90 % | Premium spaces — operating theatres, executive offices, museums |
| **B** | 80 % | Typical office, school classroom, hotel room  ← *Red5 default* |
| **C** | 65 % | Back-of-house corridors, light industry |

The narrower the comfort polygon, the higher the satisfaction target.  Red5
Studio's 21–27 °C / 40–60 % defaults track **Category A** (the strictest, premium
office spec).  If your building is Category B, you can safely widen to 20–28 °C /
30–60 % via the sliders without breaching the standard.

---

## 3. Where ASHRAE 55 lives in Red5 Studio

### 3.1 Temperature: the T·CLIP slider (sidebar, "3D WX · T·CLIP")

- **Default** 21–27 °C — ASHRAE 55-2023 Category A year-round overlap
- **Stored in** `localStorage['red5_t_clip_range']`
- **Used by** the 3D WX magenta slab geometry (`_buildRhBandSlab`) — slab only
  renders inside this T window, where indoor RH control is physically actionable
- **Also used by** the `FREE | T·CLIP` chip — when in `T·CLIP` mode, weather-scatter
  in-band markers (1.6×) are gated by `T ∈ [T_lo, T_hi]` in addition to the RH check

### 3.2 Humidity: the RH-band slider (sidebar, sweet-spot range)

- **Default** 40–60 % RH — ASHRAE 55 §5.2.3 "humidity limits" combined with
  WHO's air-quality guidance on mucous membrane health (RH < 30 %) and
  mould-growth thresholds (RH > 60 %)
- **Stored in** `localStorage['red5_sweet_spot_range']`
- **Drives** the magenta slab cross-section, the in-band marker highlight,
  AND the band-clamp logic that pushes the chosen RH window to the BACnet controller

### 3.3 Comfort polygon: the Givoni envelope (cyan wireframe)

The Givoni envelope is Givoni's 1969 *Building Climatic Design* polygon, which
**extends** ASHRAE 55 by adding bioclimatic strategy regions:

| Region | ASHRAE 55 equivalent | What Givoni adds |
|---|---|---|
| Comfort core | yes — PMV/PPD comfort zone | — |
| Soft-trim band (B) | partial — RH boundary | passive humid/dehum recommendation |
| Hot-humid (C+) | outside | active cooling strategy |
| Cold-dry (C–) | outside | active heating strategy |
| Passive solar | outside | "free heating" strategy |
| Natural ventilation | outside | "free cooling" strategy |
| Evaporative cooling | outside | "free cooling in dry climates" strategy |

So the **Givoni envelope in the dashboard is ASHRAE 55 + actionable HVAC
strategy advice** — comfort + how to get there cheaply.

### 3.4 Air-speed assumption

Red5 Studio currently assumes **V ≤ 0.20 m/s** (still air) — the ASHRAE 55 default
for sedentary occupancy.  This matters because elevated air speed (e.g. ceiling
fans) **shifts the comfort envelope upward by ~1.5 °C per 0.1 m/s** — a building
with operable ceiling fans can be comfortable at 28–29 °C, well outside our
default T·CLIP.  If your buildings use elevated air speed as a comfort strategy,
manually widen the T·CLIP to 21–29 °C.

---

## 4. When to deliberately override the defaults

The 21–27 °C / 40–60 % defaults are tuned for **sedentary-to-light-activity
occupants in conditioned spaces** — offices, schools, residences, hotels.
ASHRAE 55 explicitly does **not** cover:

| Space type | Recommended override | Reason |
|---|---|---|
| Gymnasium, dance studio | T·CLIP 16–22 °C, RH 30–60 % | M ≥ 3.0 met — body generates heat fast |
| Commercial kitchen | T·CLIP 18–24 °C, RH 30–55 % | M ≈ 2 met, sensible-heat source nearby |
| Cleanroom (semiconductor) | T·CLIP 20–22 °C, RH 45–55 % | Process-driven, not comfort-driven |
| Museum / archive | T·CLIP 19–22 °C, RH 45–55 % | Artefact preservation (collection-specific) |
| Datacentre | T·CLIP 18–27 °C, RH 20–80 % | ASHRAE TC 9.9 *equipment* envelope, not comfort |
| Hospital OR | T·CLIP 20–24 °C, RH 30–60 % | ASHRAE 170 — surgical sequence |
| Warehouse, vestibule | not applicable | ASHRAE 55 doesn't govern; use building code |
| Building with ceiling fans (V > 0.2 m/s) | T·CLIP 21–29 °C, RH unchanged | Elevated-air-speed comfort shift |

When you override, **double-click the slider's RESET button to return to ASHRAE 55
Cat A defaults**.

---

## 5. Compliance notes

If your client's spec requires ASHRAE 55-2023 compliance documentation:

- The dashboard's **Givoni Engine** badge + the RH-band slider's "applied" chip
  together prove that occupied spaces are kept inside the standard's polygon
  ≥ 95 % of occupied hours.  Pull the metric from the *Comfort 3D* coverage stat
  (3D WX panel — bottom right "Pts / In-band / Sweet-spot %" readout).
- For PMV/PPD documentation, ASHRAE 55 § 5.3.4 allows the *operative-temperature*
  comfort method (what Red5 uses) as an alternative to a full PMV/PPD report.
  Submit the T-clip & RH-band slider settings + a 12-month coverage chart from
  the *Comfort 3D* layer.

---

## 6. Cross-references in this manual

| Where ASHRAE 55 is *implicitly* invoked | Now explicit in |
|---|---|
| `control_algorithms.md` § 2 "Givoni Comfort Zone Definition" | Link added |
| `control_algorithms.md` § 4.4 "Humidity Control" — 40-60 % RH | Cited as ASHRAE 55 §5.2.3 |
| `control_strategy_insight.md` | Brief reference where comfort is discussed |
| `band_guide.md` § B5 "Warm & medium humidity (40-60 % RH)" | Cited |
| `psychrometric_design_workflow.md` § "40-60 % RH sweet-spot strip" | Cited |

---

## 7. External reading

- ASHRAE Standard 55-2023, full PDF — purchase at <https://www.ashrae.org/technical-resources/bookstore>
- CBE Thermal Comfort Tool (free, interactive PMV/PPD calculator):
  <https://comfort.cbe.berkeley.edu/>
- ISO 7730:2005 — international equivalent of ASHRAE 55, used in EU specs
- EN 16798-1:2019 — European indoor-environment standard, defines the Cat A/B/C
  satisfaction levels Red5 Studio uses

---

*This reference was added to the Red5 Studio manual on 2026-06-20 to make
explicit which values in the controller defaults come directly from ASHRAE 55,
and to give operators a concise crib for when to override them.*
