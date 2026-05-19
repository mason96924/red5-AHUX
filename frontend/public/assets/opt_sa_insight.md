# Opt-SA Insight

> A plain-language guide to the **Opt-SA** (Optimal Supply Air) strategy in the
> Red5 Building Diagnostic Command Center — what it does, how it compares to
> B1–B10 (Givoni bands) and Dyn-Reset, and how to read the envelope-sliders
> + floor-warning chip without getting lost in psychrometrics.

---

## 1. The mental model — Opt-SA is an *adjustable fence*

Think of every 1 kg "puff" of air as carrying a backpack of two things:

1. **Heat** — how hot it is. 🔥
2. **Moisture** — how much water is dissolved in it. 💧

**Enthalpy `h` (kJ/kg)** is the total weight of that backpack. Hotter AND
wetter air ⇒ heavier backpack.

Opt-SA sets a "comfort fence" in backpack-weight units:

```
   ┌──────── max (upper fence) ─────────┐
   │                                    │
   │   "happy zone" — do nothing here   │
   │                                    │
   └──────── min (lower fence) ─────────┘
```

For every hour the controller does the cheapest thing possible:

| Condition | What Opt-SA does | Energy cost |
|---|---|---|
| OA backpack heavier than upper fence | Cool DOWN to the fence, then stop | proportional to `h_oa − max` |
| OA backpack lighter than lower fence | Heat UP to the fence, then stop | proportional to `min − h_oa` |
| OA already inside the fence | Don't touch the air | **0** — free! |

That's the whole strategy. It's the **bare minimum** the building could ever
do while still keeping conditioned air inside an acceptable comfort band.
That's why Opt-SA is plotted as the **theoretical energy floor** on the
Monthly × Sites chart — *no real-world strategy can do less work and still
deliver comfort*.

---

## 2. How Opt-SA compares to the other strategies

| Strategy | What it picks for SA each hour | How aggressive |
|---|---|---|
| **Fixed-SA** | A constant SA enthalpy the operator sets (e.g. 38 kJ/kg) | One-size-fits-all — wasteful in mild weather, undersized in extremes |
| **B1-B10 (Givoni bands)** | One of 10 fixed SA targets based on OA temperature & humidity | A discrete "menu" of 10 backpacks (25.8 → 52.9 kJ/kg) |
| **Dyn-Reset** | A 24-h rolling mean of `h_oa`, clamped to the Opt-SA envelope | Drifts smoothly with weather; can lag heat waves |
| **B1-B10 + Dyn-Reset** | Band SA target ± 5 kJ/kg, biased by Dyn-Reset | Hybrid: band's structure + Dyn-Reset's responsiveness |
| **Opt-SA** | `clamp(h_oa, min, max)` — closest fence to current OA | Cheapest possible, by definition |

Visual mental map of typical cumulative energy curves over a year:

```
Energy ▲
  ($)  │                         Fixed-SA  ━━━━━━━━━━━━━
       │                        B1-B10    ━━━━━━━━━━━━
       │                        Band+Dyn  ━━━━━━━━━━━
       │                        Dyn-Reset ━━━━━━━━━━
       │                        Opt-SA    ━━━━━━━━━━   ◀ floor
       └─────────────────────────────────────────────► Time
```

If your Opt-SA line ever climbs *above* one of the others, something is off —
either the envelope is too tight (see §5) or the band table is mistuned.

---

## 3. Why Opt-SA "snaps onto" B1-B10 when you raise `max`

B1-B10's SA targets span roughly **25.8 → 52.9 kJ/kg** (B9 dry & cool → B6
warm & humid). When you slide the `max` knob:

| `max` setting | What Opt-SA does in summer | Energy curve behavior |
|---|---|---|
| **80 kJ/kg** (way above bands) | Almost never has to cool — fence too far away | Opt-SA flat, **far below** B1-B10 (big gap) |
| **52.9** (= B6's SA) | Cools to ~53; B6 also targets ~53 | **Touches / overlaps** B1-B10 during B6 hours |
| **30** (= B7-B8's SA) | Cools all the way to 30, even when B1 would only cool to 50 | Opt-SA **rises**, may match or exceed B1-B10 |

**Why the overlap?** As you bring `max` toward one of the band SA targets,
the two strategies start picking the *same* SA setpoint for the same hour →
same conditioning work → energy curves trace each other.

This is also why a *very tight* envelope can make Opt-SA *more aggressive*
than B1-B10 in mild weather: the fence forces aggressive cooling in hours
where some bands would happily deliver warmer SA. **That breaks the floor
property.** See §5.

---

## 4. What 25.8 and 52.9 kJ/kg actually mean

These are the lightest and heaviest "air backpacks" your B1-B10 system would
ever ask the AHU to deliver into the zone:

| Band | SA target (T, RH) | Backpack weight |
|---|---|---|
| **B9** | 15 °C, 40 % RH (cool & dry) | **25.8 kJ/kg** — lightest |
| **B1** | 21 °C, 40 % RH | 36.8 kJ/kg |
| **B7** | 12 °C, 95 % RH | 33.0 kJ/kg |
| **B8** | 13 °C, 95 % RH | 35.5 kJ/kg |
| **B5** | 23.5 °C, 50 % RH | 46.6 kJ/kg |
| **B6** | 25 °C, 55 % RH (warm, mildly humid) | **52.9 kJ/kg** — heaviest |

Computed live by the dashboard from the BANDS table in `psy-3d-engine.js`
(line ~348). Retune `sa_t` / `sa_rh` and these bounds follow automatically.

### What does the delta (52.9 − 25.8 = **27 kJ/kg**) mean?

For one kilogram of air, **27 kJ** of energy is roughly enough to do EITHER:

- 🌡️ **Pure sensible cooling:** drop the air temperature by **~27 °C** without
  changing its moisture content
- 💧 **Pure latent drying:** remove **~11 grams of water** from each kilogram
  of air (about a teaspoon and a half) at constant temperature
- 🌗 **A typical real mix:** cool by ~15 °C *and* remove ~5 g of water

### Scaling to a real AHU

A typical commercial AHU pushes around **5 000 L/s ≈ 6 kg/s** of air.

```
27 kJ/kg × 6 kg/s = 162 kW
```

So the 27 kJ/kg menu spread translates to roughly **162 kW of
conditioning-load swing** — the AHU might be lazily delivering ~30 kW on a
mild day (B6 light backpack) or hammering at ~190 kW on a peak monsoon day
(B9 / B10 heavy lift). That's a meaningful chunk of your annual electricity
bill, and it's exactly the spread Opt-SA is trying to minimise.

---

## 5. The "NOT A TRUE FLOOR" warning chip

The amber chip beneath the Opt-SA envelope sliders fires whenever your
fence shrinks **inside** the B1-B10 SA-enthalpy range (25.8 – 52.9 kJ/kg).
Two failure modes it warns about:

| Condition | What it means physically |
|---|---|
| `min > 25.8` | Opt-SA is forced UP to a fence that's heavier than B9's target. In dry-mild weather, B9 cools the air to 25.8 but Opt-SA refuses to go below `min` → Opt-SA does **more** latent work than B9 → curve rises **above** B1-B10. |
| `max < 52.9` | Opt-SA is forced DOWN to a fence that's lighter than B6's target. In warm-humid weather, B6 only cools to 52.9 but Opt-SA cools to `max` → Opt-SA does **more** sensible work than B6 → curve rises **above** B1-B10. |

When the warning fires, Opt-SA **stops being a theoretical floor** — it
becomes a "what-if we forced strict comfort limits" scenario. Still useful
for regulated environments (labs, pharma cleanrooms, museums) where you
*want* a tighter envelope than B1-B10 provides, but it's no longer the
mathematical lower bound on energy.

### Rule of thumb

| Goal | Suggested `[min, max]` | Why |
|---|---|---|
| **Opt-SA stays a true floor** | `min ≤ 25.8`, `max ≥ 53` | Fully encloses B1-B10's SA range; warning silent |
| **Tight commercial comfort** | `min = 30`, `max = 45` | Triggers warning, but reflects ASHRAE 55 acceptable indoor envelope |
| **Lab / pharma (regulated)** | `min = 35`, `max = 40` | Triggers warning (intentional — you accept higher energy for stricter comfort) |

### Recovery
- Want the warning gone? Slide `min` down to 25 or less, `max` up to 55 or
  more. The chip vanishes silently.
- Want to keep your tighter envelope? Ignore the chip — it's informational,
  not blocking. Just read the Opt-SA line as "your custom comfort floor"
  rather than "absolute energy floor".

---

## 6. Reading the Monthly × Sites chart in one minute

1. **Top toolbar (Strategy dropdown)** — pick which strategies overlay
   (Band, Band+Dyn, Dyn, Opt, Fixed, $-violation).
2. **Mode chips (A / B / C / $)** down the right edge of the toolbar:
   - **A** = comfort hours covered per strategy (latent coverage)
   - **B** = energy cost per strategy ($/year, uses live tariff config)
   - **C** = energy intensity (kWh/m² · yr — apples-to-apples vs. ASHRAE)
   - **$** = violation cost (uncovered humid hours × $/hr rate)
3. **Opt-SA envelope card** — purple-bordered popover; drag the two
   sliders to retune the fence. Floor warning lives at the bottom.
4. **Curves** — annual cumulative energy/cost. Read top-to-bottom: most
   wasteful on top, theoretical floor at bottom.

A healthy reading looks like:

```
Fixed-SA  ▔▔▔▔▔▔▔▔▔  (highest — wasteful baseline)
 │                  ↓ ~20-30% savings
B1-B10    ━━━━━━━━━  (clean band-based)
 │                  ↓ ~5-10% extra
Band+Dyn  ──────────  (hybrid)
 │                  ↓ ~5-10% extra
Dyn-Reset ──────────  (continuous reset)
 │                  ↓ small final gap
Opt-SA    ──────────  (theoretical floor)
```

If the gaps look wrong (e.g. Dyn-Reset above B1-B10, or Opt-SA above
anything), check the envelope warning first — that's the #1 cause.

---

## 7. Cheat sheet — three rules to remember

1. **Opt-SA is a fence, not a fixed target.** Wider fence = less work =
   lower energy. Narrower fence = more work = higher energy.
2. **B1-B10's SA targets span 25.8 → 52.9 kJ/kg.** Keep your fence
   *outside* that range for Opt-SA to remain a true energy floor.
3. **The 27 kJ/kg delta ≈ 162 kW** of AHU conditioning swing for a typical
   ~6 kg/s unit. That's why band-tuning is worth doing well — every
   percentage point of strategy improvement on this strip translates to
   real kilowatts and real money.

---

*Generated as part of the Red5 dashboard documentation set. Companion
guides: `band_guide.md`, `data_bridges_guide.md`, `control_algorithms.md`,
`control_strategy_insight.md`.*
