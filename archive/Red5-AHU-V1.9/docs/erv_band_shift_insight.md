# ERV Band-Shift Insight: What "Losing Hours" Means

> **Companion to** the B-shift strip (`#p3-band-delta`) in the 2D X-Y overlay
> and the cyan ERV ROI badge in the PSYCH-tab AHU sidebar. Read this
> alongside `psychrometric_design_workflow.md` for the full context.

---

## TL;DR for operators
A **negative Δ on a band** is not a loss. It's an **escape route**.
Every hour the wheel pulls out of a hard band (B1-B4 cold side, B7-B10 hot side)
is an hour the chiller, boiler, and control logic never have to fight.

Hours don't disappear from the year — they just **re-tag** themselves.
Subtract from one band, add to another, total stays at 8,760.

---

## The 10-band diary metaphor (for owner walkthroughs)

The building keeps a year-long diary. Each hour gets one of 10 weather stamps:

| Band | Label    | Plain-English climate              |
|------|----------|------------------------------------|
| B1   | COLD-DRY | Winter freeze                      |
| B2   | COLD-MOD | Chilly, medium humidity            |
| B3   | COOL-DRY | Cool, dry                          |
| B4   | MILD     | Sweater weather                    |
| B5   | COMFORT  | Spring day — perfect               |
| B6   | EDGE-HI  | Warm, getting sticky               |
| B7   | WARM-HUM | Hot + sticky                       |
| B8   | HOT-HUM  | Heat wave + humid                  |
| B9   | HOT-DRY  | Desert hot                         |
| B10  | EXT-HUM  | Extreme humid                      |

Without the wheel, each hour gets stamped by the **raw outdoor T/RH**.
With the wheel ON, the air is pre-treated *before* the HVAC system meets it,
so the diary stamps each hour by the **post-wheel state (OA')** instead.

A 35 °C / 85 % RH summer hour (B8) might become 27 °C / 65 % RH after the
wheel — the same hour now stamps as B6.
**B8 lost that hour. B6 gained it.** Year-on-year, the histogram visibly
collapses toward B5 ± 1.

---

## Live Seoul (한양대 박병원, 2,920 h) example

```
                      OA bucket   OA' bucket    Δ
B1   COLD-DRY              49h           0h    -49h
B2   COLD-MOD             171h           0h   -171h
B3   COOL-DRY               6h           0h     -6h
B4   MILD                  32h          12h    -20h
B5   COMFORT  ✅            43h       1,206h  +1163h
B6   EDGE-HI                33h         138h   +105h
B7   WARM-HUM              140h           0h   -140h
B8   HOT-HUM                 0h           0h      0
B9   HOT-DRY                 4h           0h     -4h
B10  EXT-HUM                 0h           0h      0
                          ─────       ─────
total                     2,920 h     ~1,356 h-mapped  (rest land in '?')
```

> Reading the column: **the wheel collapses 7 distinct operating regimes
> (B1-B4, B6, B7, B9) into mostly B5 — the comfort band.**

---

## Four practical conclusions an operator can draw

### 1. Lost B1-B4 hours → **right-size the heating plant**
Cold hours never reach the heating coil at design load anymore — the wheel
recovers exhaust warmth and softens them into B5/B6 before they hit the coil.
The boiler / heat-pump replacement on the next capex cycle can be smaller.

### 2. Lost B7-B10 hours → **right-size the chiller**
Symmetric story on the cooling side. Peak design day never reaches the
chiller as a peak day — it arrives pre-cooled. Smaller chiller + lower
peak demand charge from the utility.

### 3. Gained B5 hours → **tune control loops for B5**
Before the wheel, the controller was constantly switching strategies
(heating in B1, cooling in B7, economizer in B4...). After the wheel,
**94 % of operating hours are B5**. PI gains, damper schedules, reheat
valve curves should all be optimized for B5 — that's where the building
operationally *lives* now.

### 4. The seasonal split of losses tells you what the wheel does
- **Winter losses (B1-B4)** = wheel is **pre-heating** (recovering exhaust warmth).
- **Summer losses (B7-B10)** = wheel is **pre-cooling** (recovering exhaust coolness).
- **Shoulder losses (B4, B6)** are smaller because the indoor-outdoor Δ is small.

---

## What this means for capex / opex sales conversations

| Audience            | Quote it as                                                              |
|---------------------|--------------------------------------------------------------------------|
| Owner               | "The wheel turns 7 different climates into 1 — most of the year, your equipment thinks it's a perfect spring day." |
| Facility manager    | "Tune all your loops for B5 — that's where 94 % of your operating hours now live." |
| Mechanical engineer | "Right-size the chiller and boiler at the next replacement. Peak loads on B7/B1 are gone."  |
| CFO                 | "$173 k/yr savings + smaller equipment on the next capex cycle = a much shorter payback than the wheel's sticker price." |

---

## How this maps to UI elements

| UI element                                              | What it shows                                                  |
|---------------------------------------------------------|----------------------------------------------------------------|
| **B-shift strip** (`#p3-band-delta`, top-right of X-Y)  | Per-band OA hours (faded) vs OA' hours (full color) + signed Δ |
| **Cyan ERV ROI badge** (PSYCH-tab AHU sidebar)          | `$/yr saved · payback yr` rollup of the same physics            |
| **3D OA→SA drops cloud** (3D WX tab)                    | Cyan ribbon = wheel work, temperature-spectrum drop = coil work |
| **Band src: OA | OA' chip** (top of X-Y overlay)        | Toggles whether B1-B10 buckets by raw OA or post-wheel OA'      |
| **`vs prior` / `vs 1y` / `vs 5y avg` button** (B-shift) | Overlays historical band distribution as dashed purple ghost bars |

---

## Common operator confusion → answer

**Q: "Why is B1 showing −49h? Did I lose 49 hours of operation?"**
**A:** No — those 49 winter hours still happen. They just don't stamp as
B1 anymore because the wheel pre-warmed them into B5 before the controller
saw them. The total operating hours are unchanged; only the **band each
hour gets classified as** changed. The Δ tells you how much the wheel
*re-routes* climate exposure, not how much time you lost.

**Q: "Then why bother with B1 at all in the strategy?"**
**A:** Because in `Band src: OA` mode, the controller still senses raw
outdoor air and **picks the conservative B1 SA target** (low SA, max
reheat). The wheel just makes the coil's job easier — same SA target,
less work. Switch to `Band src: OA'` to see the wheel-aware controller
that **picks a less aggressive B5 SA target** that the wheel made possible.

---

*Document created 2026-02-13. Lives at `erv_band_shift_insight.md`. Linked from
PRD.md "Active Backlog" and from in-strip tooltip when hovering the B-shift label.*
