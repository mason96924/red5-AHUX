# Unoccupied Moisture Control — Design Note

> *Should the AHU and chiller plant defend the building when nobody is in it?*
> Status: **proposal — no code written.** Decisions needed before implementation.
> Subject: `g36_service.py` mode machine, Red5-AHU-V1.9.

---

## TL;DR

Temperature setback already exists and works: `setback` at 16 °C and `setup` at
27 °C are live modes, and the building is defended to that band rather than left
to drift. **Moisture is not in the decision at all** — a grep for any humidity
term in `g36_service.py` returns nothing.

Three findings shape what should be built:

1. **No new sensors are needed.** Zone RH is already mapped, collected, and
   published per VAV, along with humidity ratio and enthalpy. It is discarded
   one function before the mode decision.
2. **The trigger should be worst-zone space RH, near 65% — not a dew point
   limit.** A 12–13 °C dew point target leaves under 1 g/kg of drying authority
   against `sat_min_c = 12.0`, so the AHU would run all night and never
   satisfy. Dew point is the right criterion only for condensation on surfaces
   that are *actively* cold.
3. **`g36_service.py` is advisory.** It writes no hardware. Changing it changes
   what the dashboard reports, not what the plant does. Who owns the action is
   the first decision, and it is not a coding decision.

---

## 1. Why unoccupied operation rather than shutdown

A building with the AHU and chiller plant fully off tracks outside air. In a
humid climate that means the fabric — gypsum, carpet, furnishings — adsorbs
moisture across a weekend, and surface RH at the coldest interior surfaces can
sit above the mould threshold for the whole unoccupied period.

The standards do not ask for a dead building:

| Standard | What it says about unoccupied hours |
|---|---|
| **90.1 §6.4.3.3** | Automatic shutoff **or** setback. Setback is a compliance path, not a concession — roughly 13 °C heating / 29 °C cooling. |
| **62.1** | Ventilation is an *occupancy* requirement. Unoccupied outside air should be closed, not maintained. |
| **55** | Occupied hours only. Comfort is not the driver here. |
| **160** | The real mould criterion: 30-day running average **surface** RH at or below 80%. Note *surface*, not room air. |
| **Guideline 36** | Supplies the mode machine — `setback`, `setup`, `warm_up`, `cool_down` — that this note extends. |

**Why "it normalises during pre-cooling" does not close the argument.** It holds
for temperature and fails for moisture, for two reasons. Moisture adsorbed into
the fabric over a weekend releases over many hours, so the morning pull-down
chases a load the building keeps re-supplying — this is where long, expensive
Monday startups come from. And mould germination happens well inside a 48-hour
window at high surface RH; once it is in the fabric, normalising the air does
not undo it. The 160 criterion is a 30-day *average*, which is not permission to
spend weekends above 80%.

---

## 2. What the code does today

The eight-mode machine is complete and the unoccupied band is enforced:

```
# g36_service.py:62
ALL_MODES = ('occupied', 'warm_up', 'cool_down', 'setback', 'setup',
             'freeze_protection', 'unoccupied', 'pre_cooling')

# g36_service.py:73
'unocc_heating_sp_c': 16.0,
'unocc_cooling_sp_c': 27.0,
```

`_compute_mode()` (line 231) decides on one variable:

```
avg_zat = sum(z.get('zat_c', 22.0) for z in zones) / len(zones)   # line 234
```

and returns `setback` below 16 °C, `setup` above 27 °C, `unoccupied` in between
(lines 259–269). There is no path by which a humid-but-temperate space leaves
`unoccupied`.

**What a tick produces.** `_do_tick()` (line 293) emits `sat_reset_c` and
`dsp_reset_pa` and nothing else. There is no outside-air damper output, no fan
command, no chilled-water setpoint. Note that `setup` is already in the SAT
trim-and-respond list (line 323), so the plumbing for a humidity-driven SAT
reset partly exists — but the requests feeding it come from `_vote_cooling()`,
which reads `cooling_loop_pct`, itself derived from zone *temperature* deviation
alone.

**It is advisory.** `sat_reset_c` is consumed only by the dashboard
(`js/dashboard/sidebar.js`). The hardware write path lives in `write_queue` via
`telemetry_service.py`, `collector.py`, and `_bridges_lib.py`, gated by
per-bridge `write_allowlist` entries that are empty in `configs/bridges.json`,
with every bridge disabled. Read-only by default, deliberately.

---

## 3. The data is already there

`configs/collector_config.json` maps humidity at every point that matters:

```json
"dashboard_point_map": {
  "ahu": { "oa_t": "OAT", "oa_rh": "OAH", "sa_t": "SAT",
           "sa_rh": "SAH", "ma_t": "MAT", "ma_rh": "MAH" },
  "vav": { "zone_t": "t", "zone_rh": "rh" }
}
```

`telemetry_service.py:510` already resolves it per zone and computes the
psychrometrics on the way through:

```python
vav_list.append({"id": vav_name, "t": vt, "rh": vrh, "w": vw, "h": vh,
                 "all_points": vav_pts})
```

Then `_derive_zones_from_ahu_entry()` (line 370) reads `v.get('t')` and never
touches `rh` or `w`. **That single omission is the whole gap.** The state
machine is not short of data; it is structurally blind to the axis.

**Dew point needs no new model.** The Magnus form already in
`telemetry_service.py` inverts in closed form:

```
a  = ln(RH/100) + 17.27·T/(T + 237.3)
Td = 237.3·a / (17.27 − a)
```

Checked against the Hyland–Wexler `get_psat()` in `app_canonical_c2.py`, the two
agree within **0.01 K** across 22–30 °C and 55–80% RH. Either is defensible.

> **Pre-existing inconsistency worth knowing:** `app_canonical_c2.get_w()` uses
> Hyland–Wexler while `telemetry_service._ahu_history_w()` uses Magnus. They
> disagree slightly. Not introduced here, but do not compare their outputs
> directly and expect equality.

---

## 4. Choosing the trigger

The candidate setpoints, against what a 12 °C coil at 95% RH leaving can
actually deliver (8.29 g/kg):

| Trigger | Space W | Drying authority | Verdict |
|---|---|---|---|
| RH 60% at 27 °C | 13.42 g/kg | 5.13 g/kg | Satisfiable |
| **RH 65% at 27 °C** | 14.57 g/kg | 6.28 g/kg | **Recommended** |
| Dew point 13 °C | 9.33 g/kg | 1.04 g/kg | Runs forever |
| Dew point 12 °C | 8.73 g/kg | 0.44 g/kg | Unreachable in practice |

A gram per kilogram is swamped by infiltration and residual internal gains. A
dew point trigger at that level produces continuous operation with no
satisfaction — the worst of both outcomes, and it will be switched off by the
first operator who notices the energy bill.

**65% RH is the mould-protection number.** For an unoccupied space with no
actively cold surfaces, interior surfaces sit near room temperature, so space RH
approximates surface RH and 65% gives real margin under the 160 limit of 80%.

**When a dew point limit *is* correct:** only where surfaces are held cold
overnight — chilled beams, exposed chilled water, an active radiant slab. Then
the setpoint must be derived from the measured surface temperature plus margin,
not from a rule of thumb. If the plant is off overnight, that pipework rises to
room temperature and the condensation mechanism disappears; only the mould
mechanism remains.

**Worst zone, not average.** `avg_zat` averaging is defensible for temperature
and wrong for moisture: mould grows in one corner, not on average. A single
humid perimeter zone must be able to call the mode by itself.

Proposed additions to `SETPOINT_DEFAULTS`:

| Key | Default | Meaning |
|---|---|---|
| `unocc_rh_high_pct` | 65.0 | Worst-zone RH that forces dehumidification |
| `unocc_rh_deadband_pct` | 5.0 | Release at 60% — prevents chatter at the limit |
| `unocc_dewpoint_high_c` | *unset* | Optional, only where cold surfaces stay active |
| `unocc_min_runtime_min` | 30 | Minimum call length, see §6 |

---

## 5. Outside air and chilled water will decide whether this works

Two ways to spend the fan energy and get nothing:

**Outside air must close.** In a humid climate, unoccupied operation with any
minimum OA position imports latent load faster than the coil removes it. 62.1
requires ventilation for occupancy, not for empty hours. Nothing in
`g36_service.py` commands the OA damper today, so this has to come from the BAS
sequence — or from a write path that does not yet exist.

**Chilled water temperature reset fights you.** Raising CHWST overnight for
efficiency is exactly what removes latent capability: a 9 °C coil dehumidifies,
a 13 °C coil largely does not. Low-load dehumidification also pushes chillers
toward short-cycling and surge, which is why this duty often belongs to a small
dedicated unit or a DOAS rather than the main plant. The trade study is a plant
decision, not a control-logic one.

---

## 6. Runtime and cycling

Cycling on a satisfied *temperature* dehumidifies badly. A short `setup` call
gives a wet coil only briefly, and condensate re-evaporates off the coil into
the space once the fan keeps running after the valve closes. You can run all
night and remove very little moisture.

So a humidity call needs to be a **latent** call, not a temperature call:

- drive SAT toward `sat_min_c` rather than trimming against cooling requests
- hold for `unocc_min_runtime_min` regardless of dry-bulb satisfaction
- release on the RH deadband, not on temperature
- if the AHU has a reheat capability, this is where it earns its keep — cold
  coil for moisture, reheat to avoid overcooling an empty space

The cleanest fit to the existing structure is a fourth request type alongside
cooling / heating / pressure, since `setup` is already wired into the SAT
trim-and-respond. That keeps G36's request-based idiom intact.

---

## 7. Fail-safe on a dead humidity sensor

`zone_rh` legitimately arrives as `None` — `telemetry_service.py:491–497`
already records a `gaps` entry when the point is missing. The trigger must
decide this deliberately, because both naive answers are bad: treating `None` as
dry silently disables the protection, and treating it as wet runs the plant
indefinitely on a failed sensor.

Proposed behaviour:

1. Hold the last known good reading for a bounded window (suggest 60 min).
2. After that, drop the affected zone from the worst-zone calculation and raise
   a visible fault — the mode falls back to temperature-only for that zone.
3. If *every* zone in an AHU group has lost RH, report the AHU as
   moisture-unprotected rather than reporting `unoccupied` as though it were
   healthy.
4. `freeze_protection` precedence is unchanged and stays first in
   `_compute_mode()`.

---

## 8. What this note does not decide

- **Who owns the action.** `g36_service.py` cannot command anything today. The
  options are (a) the enteliWEB/BAS sequence owns unoccupied moisture control
  and Red5 reports compliance with it, or (b) Red5 gains a write path through
  `write_queue` with an explicit allowlist. These have very different
  commissioning and liability profiles. **This is the first decision.**
- **Real cold-surface temperatures on site**, without which no condensation
  setpoint can be derived rather than guessed.
- **Whether the main plant or a dedicated unit** carries the night latent load.
- **Translations.** Only the English base exists. `js/docs_index.js` expects
  five languages per entry, so this file is deliberately *not* registered in the
  docs index yet — registering it would add a viewer entry whose `ko`, `ja`,
  `zh-CN`, and `zh-TW` files 404.
