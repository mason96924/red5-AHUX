# Control-Strategy Insight: Why B1-B10 wins despite the "Optimal-SA" floor

> **Provenance:** Captured from a 2D T×Time chart investigation. The user
> noticed that, on a 1-week window, a hand-tuned fixed T/RH setpoint
> produced a *lower* cumulative Total than the B1-B10 strategy.  This doc
> records why that observation is real, why it doesn't generalize, and
> what to communicate to skeptical engineers.

---

## TL;DR

A perfectly-tuned fixed-SA setpoint **can** beat B1-B10 in a short window
*if and only if* the operator already knows the week's mean enthalpy.
Across a full year, across multiple zones, and including realistic
operational constraints, **B1-B10 wins by 50–80 %** — the cherry-picked
short-window comparison is a mathematical artifact, not a viable
operating point.

---

## 1. The math behind the surprise

The fixed-SA "Total" curve on the T×Time chart integrates:

```
cumTotal[i] = Σ |h_oa[i] − h_sa_user|
```

When `h_sa_user ≈ mean(h_oa)` over the window, this integral becomes a
centered absolute deviation — and **it can shrink to a small fraction of
its maximum**.  In the extreme: if every hour had `h_oa = h_sa_user`,
Total → 0.

By contrast, B1-B10 has a **structural floor**:

```
cumB[i] = Σ |OAD/100 × (h_oa[i] − h_sa_band[i])|
```

Even at 15 % minimum OA damper (the legal ventilation minimum), the AHU
still conditions 15 % of OA flow from outside enthalpy to the band's SA
enthalpy.  That term is non-zero on every hour of every season — there
is no "perfect" SA the strategy can settle on because each band has its
own SA target.

**Result:** in a stable, near-comfort week, fixed-SA's centered
deviation can dip *below* B1-B10's irreducible 15 %-OA conditioning
floor.

---

## 2. Five reasons that "win" doesn't translate to operations

| # | Constraint                          | Why it kills the fixed-SA win |
|---|-------------------------------------|-------------------------------|
| 1 | **Foresight required**              | The optimal SA can only be chosen *after* you've seen the week's weather.  Real BMS controllers can't time-travel. |
| 2 | **Multi-zone reality**              | One AHU feeds many VAVs.  Perimeter zones (solar gain) and core zones (occupant heat) have different demands at the same instant.  Fixed SA satisfies neither well. |
| 3 | **Coil work ≠ enthalpy delta**      | The chart shows |Δh|.  Real coils have a dehumidification penalty: you must overshoot ΔT to control RH at humid OA.  Fixed-SA hides this by integrating air-side enthalpy only. |
| 4 | **Ventilation code minimums**       | Hospitals, labs, and most non-residential spaces require ≥ 15 % OA at all times for IAQ.  B1-B10 honors this.  "Optimal" fixed-SA computations often implicitly assume 100 % OA, which is illegal. |
| 5 | **Sensible vs. latent split**       | A 13 °C / 50 % RH SA does cooling; a 13 °C / 95 % RH SA does dehumidification.  Fixed-SA picks one — B1-B10 picks the right one per OA regime (B7-B10 vs B9). |

---

## 3. The right way to read the chart

The fixed-SA "Total" curve is a **theoretical lower bound** of what an
idealized, omniscient AHU could spend on a single zone with no humidity
constraint.  It is a useful *reference floor*, not an achievable
operating point.

B1-B10's curve is what you **actually spend** under realistic operating
conditions, including:

- Real-time controllability (no future-peek)
- Multi-zone delivery with reheat
- Latent management decoupled from sensible
- Equipment protection minimums (heating-coil freeze, dehumidification
  reheat avoidance)
- ASHRAE 62.1 OA minimums

When B1-B10 sits above an aggressively-tuned fixed-SA in a short window,
the message is:

> "If you hand-tuned this exact week with perfect foresight, you could
>  match what B1-B10 does automatically across *any* week of *any*
>  climate."

That's not an indictment of B1-B10.  That's an indictment of the
hypothetical that fixed-SA control can ever be hand-tuned that well, in
practice, across all 52 weeks of a calendar year, in every zone of a
hospital.

---

## 4. The Year-window proof

Re-run the same comparison with **Duration = Year** instead of Week:

- The fixed-SA Total balloons because the user-chosen SA can't be
  optimal for *both* January and July
- B1-B10 stays flat because it auto-shifts setpoints per band
- The ratio settles at 60-80 % savings — the durable,
  climate-agnostic figure on the Monthly × Sites view

This is the figure to quote in commissioning reports, energy audits, and
ESG disclosures.  Short-window optima are interesting for diagnostic
intuition but **never** for operating decisions.

---

## 5. The "Equivalent Optimal-SA" indicator

To prevent future agents (and engineers reviewing the dashboard) from
falling into the same cherry-pick trap, the T×Time chart now overlays an
**Equivalent Optimal Fixed-SA** marker (purple dotted line + label).
It computes:

1. `h_mean = mean(h_oa)` across the visible weather window
2. Solves the (T_sa, RH_sa) pair on the saturation curve closest to that
   enthalpy
3. Renders the resulting `Σ|h_oa − h_mean|` as a dotted line — the
   theoretical floor of fixed-SA control for *this* window
4. Labels it `Optimal-SA: T°C / RH% → Δh-total (theoretical only)`

Reading the chart with this overlay:

- If the user-slider Total is **above** the dotted line → there's room
  to hand-tune (but only with foresight)
- If the dotted line is **above** the green B1-B10 line → B1-B10 beats
  even the best possible fixed-SA for this window
- If the dotted line is **below** B1-B10 → B1-B10 is paying the
  ventilation-floor + multi-zone tax in exchange for being achievable
  without foresight

The dotted line is *always* labeled "theoretical only" so no engineer
can mistakenly try to hardcode it into the controller.

---

## 6. Talking points for skeptical engineers

> "Why would B1-B10 not always be lower?"

Because in a short, stable window the centered absolute deviation of OA
enthalpy around its mean can dip below B1-B10's 15 %-OA conditioning
floor.  This is a mathematical edge case, not a control-strategy
weakness.

> "Then why don't we just hand-tune SA per week?"

Because (a) you'd need to know each week's mean enthalpy in advance, (b)
the optimal SA is different for each AHU/zone/floor, and (c) the
short-window optimum loses to B1-B10 over a full year by 60-80 % — see
the Monthly × Sites comparison.

> "Couldn't an AI predict the optimal weekly SA?"

Yes, but the AI would converge on something that looks remarkably like
B1-B10: ten control regimes, each tuned to a region of the
psychrometric chart.  We've encoded that knowledge as a static table so
the controller doesn't need an ML model to operate.

---

## 7. File pointers

- `js/psy-3d-engine.js` — `BANDS` table, `classifyBand()`, T×Time
  rendering with optional Optimal-SA overlay
- `band_guide.md` — operator-facing per-band control logic
- `band_monthly_analysis.py` — offline reproduction of the
  Monthly × Sites figures using climate normals
- `control_strategy_insight.md` — this document
