# Changelog

Reverse-chronological log of shipped changes.  PRD.md holds the
original problem statement + long-form architecture; this file just
captures what has been implemented and when.

## 2026-02-12e — Length ±10 cm nudges + window-blue slider colour

### What shipped

- **Length ± buttons** on every Length row (per-window and batch):
  small pill buttons flanking the metres readout, each click
  nudges the length by 10 cm (0.1 m).  Clamped to [0.2 m,
  2 × longest floor side].  Autosaves after every click.
- **Slider accent colour** on all Windows-panel sliders (Blinds /
  Length / Angle, per-row and batch) changed from the app-wide
  orange accent to the window bar's own light-blue
  `#96d2ff` (rgb 150, 210, 255) so the control visually maps to
  the thing it drives.
- **Selected-row highlight** re-tinted from orange to the same
  light-blue (10% background + 2 px left border) for the same
  reason.

### Why

Operator: "Windows length adjustment, make provide +/- sign for
step increment of 10 cm.  Make the active color of windows
setting (i.e. active slider background) matching the color of
windows."  Both changes ship together.

### Tests

- 458/458 pytest still green.
- Manual Playwright smoke, 2-window floor (2.00 m / 3.00 m):
    - Row `+` on W1: 2.00 → 2.10 m.  Row `−` x3: 2.10 → 1.80 m
      (persisted 1.80).
    - Select-all, batch `+` x2: W1 1.80 → 2.00 m, W2 3.00 →
      3.20 m (both persisted).
    - Computed slider `accent-color` reads `rgb(150, 210, 255)`.
    - Selected row inline style contains `rgba(150,210,255`.

--------------------------------------------------------------------

## 2026-02-12d — Windows panel: batch Length + Angle

### What shipped

- Batch bar now has **three** sliders instead of one: `Blinds →`,
  `Length →`, `Angle →`.  All disabled when 0 selected, enabled
  when 1+ ticked.  Each drives the corresponding property on
  every ticked window in one pass.
- Sensible defaults on selection change:
    - Blinds → arithmetic mean of selected blind levels.
    - Length → arithmetic mean of selected lengths.
    - Angle  → **circular mean** (atan2 of Σcos, Σsin) so a mix
      of e.g. 170° and -170° averages to 180° instead of 0°.
- Per-row Blinds / Length / Angle sliders + labels update
  in-place while the batch slider is dragged (no re-render, so
  focus and mouse-capture stay).

### Why

Operator: "Widows group operation should be available for length
as well as angle, not just blinds."  Ships all three.

### Tests

- 458/458 pytest still green.
- Manual Playwright smoke, 3-window floor (1.5/2.5/3.0 m at
  0°/0°/90°, blinds 10/50/90%):
    - Select-all → batch length reads 2.33 m, angle reads 27°
      (circular-mean sanity).
    - Batch length → 4.0 m + angle → 45°: all three windows =
      4.0 m / 45° (persisted).
    - Untick W2, batch angle → 90°: W1 & W3 = 90°, W2 stayed at
      45° (persisted).

--------------------------------------------------------------------

## 2026-02-12c — Windows panel: multi-select + batch blinds

### What shipped

- **Per-row checkbox** and a sticky **batch bar** at the top of the
  Windows panel:
    - `Select all` checkbox (drives every row on/off).
    - `N of M selected` live counter.
    - `Blinds →` batch slider (0-100%, step 1) — disabled when
      nothing is selected; defaults to the average blind level of
      the current selection.
- **Selected rows** are visually highlighted with a subtle
  `rgba(255,140,20,0.10)` background + 2 px accent left-border.
- **Batch slider drag** updates *only* the ticked windows in one
  pass, syncs each row's individual Blinds slider + value in-place
  (no re-render, focus preserved), repaints the canvas, and saves
  on release.
- **Selection state** (`state.windowSel`, a `Set` of window IDs)
  persists while the panel is toggled open/closed, and clears
  automatically on floor-switch (`selectFloor`).  Stale IDs are
  pruned every render, so deleting a window doesn't leave dead
  ticks behind.

### Why

Operator: "One or more (or all) windows in the windows list could
be highlighted and the open operation could be applied to all."
Common daylight-simulation ops (raise all blinds at dusk, close
all south-facing at noon) previously required N slider drags —
now it's one.

### Tests

- 458/458 pytest still green (`python -m pytest`).
- Manual Playwright smoke on 3-window floor:
    - Initial: `0 of 3 selected`, batch slider disabled.
    - Tick W1 + W3 → `2 of 3 selected`, batch slider enabled at
      the (10+90)/2 = 50% average.
    - Batch → 75% → W1=0.75, W2 unchanged=0.50, W3=0.75 (persisted).
    - `Select all` → 3 of 3.
    - Batch → 0% → all three saved at 0.00 server-side.

--------------------------------------------------------------------

## 2026-02-12b — Windows panel: length + angle sliders, canvas drag

### What shipped

- **Length + Angle sliders** in every Windows-panel row alongside
  the existing Blinds slider.  Each row now has three sliders with
  live monospaced readouts:
    - Blinds — 0-100%, step 1
    - Length — 0.2 m … 2 × floor's longest side, step 0.05
    - Angle — -180° … 180°, step 1
  Row header updates live to `W# · <cardinal> · L.LL m` as sliders
  move; changes autosave on `change`.

- **Canvas drag = reposition** for placed windows.
  `mousedown` inside 10 px of any window bar (segment-distance,
  not centroid) grabs the bar for rigid translation; `mouseup`
  saves via `PATCH /api/elc/floors/{id}`.  Works regardless of
  bar length or angle.  Left-click only — right-click still
  toggles blinds 0 ↔ last-value.

- **Segment-based hit-testing**: `_windowSegmentPx` and
  `_pointToWindowDistPx` helpers replace the old centroid-only
  test, so long or oblique window bars are grabbable along their
  whole length instead of only near the centre.

- **Empty-state hint** updated to mention drag ("… or drag placed
  windows to reposition.").

### Why

Operator feedback: "Windows placement is too cumbersome. line/tube
replacement. 1) length-setting 2) windows drawn should be
draggable for easy replacement 3) angle-setting — all these with
slide bar for open control."  This ships all three.

### Tests

- 458/458 pytest still green (`python -m pytest`).
- Manual Playwright smoke: seeded 1 window at (3, 0.3), length 2.5,
  angle 0°.  Panel showed 3 sliders + label `W1 · south · 2.50 m`.
  Length slider → 4.00 m updated label to `W1 · south · 4.00 m`.
  Angle slider → 90° updated label to `W1 · west · 4.00 m` and
  rotated the canvas bar to vertical.  Canvas mousedown+move+up
  translated the bar to world (5.99, 5.00); GET on the floor
  returned the same values → persisted.

--------------------------------------------------------------------

## 2026-02-12 — Windows/Blinds floating panel

### What shipped

- **New floating "Windows · Blinds" mini-panel** on `/floor`
  (`demo/floor.html`).  Draggable by its header (mirrors the
  time-scrub widget pattern), anchored to bottom-right by default,
  toggled by the new `▤ Windows` toolbar button.  Lists every window
  on the current floor as `W# · L.LL m · <cardinal>` with:
    - **Smooth 1%** range slider (0-100) bound to `blind_level`.
    - Live percentage read-out.
    - Delete (✕) button per row.
    - Empty-state message when the floor has no windows.
  All changes call `_saveWindows()` (PATCH `/api/elc/floors/{id}`)
  and re-run `paintCanvas()` so the sunbeam simulation updates
  instantly.

- **Right-click on a canvas window bar now = quick 0 ↔ last-value
  toggle** (previously opened a popover which was hard to hit).
  The last non-zero level is remembered on `w._lastBlind` so
  restoring is idempotent.  Old `_openBlindPopover` popover code
  removed.

- **Cardinal direction derived from `angle_deg`**: window normal
  is compared against N/E/S/W in world space; screen-Y inversion
  handled so `angle_deg=0` (horizontal window) → normal faces
  south (down on canvas) which matches the paint code.

- Placement toast updated: "Adjust blinds in the Windows panel
  (▤ Windows)" — no more "right-click to set blinds" wording.

### Why

Operators complained the right-click popover was unusable: the
browser's default context menu kept winning, and hit-detection on
the thin window bar required pixel-perfect clicks.  The always-on
Windows panel gives a stable, visible target list with sliders.

### Tests

- 458/458 pytest still green (`python -m pytest`).
- Manual Playwright smoke: seeded 2 windows, opened the panel,
  slider #1 → 80% persisted server-side (verified via GET), and
  right-click on canvas at W2 centroid toggled 0% → 100% with
  the panel updating live.

--------------------------------------------------------------------

## 2026-02-11f — Daylight sim Phase 2A: windows + beams + blinds

### What shipped

- **Windows are now first-class floor data.**  New `windows_json`
  + `ceiling_height_m` columns on the ``floors`` table (idempotent
  ALTER migrations).  Each window record::

      {id, x_m, y_m, length_m, angle_deg,
       blind_level, sill_height_m, head_height_m}

  `x_m/y_m` is the window centre; `angle_deg` is the wall-segment
  direction so the interior normal is 90° CCW of it.

- **API**: `PATCH /api/elc/floors/{id}` accepts `windows`,
  `ceiling_height_m` in addition to the existing fields.
  Server-side validates each window (types + `blind_level` clamped
  to 0..1); rejects invalid entries with 400.

- **Canvas placement** (`demo/floor.html`):
    - Press **`w`** on the canvas to enter Window-placement mode.
      Click two points on a wall → a window is centred between them
      with computed `length_m` + `angle_deg`.  Auto-saves via PATCH.
      **`Esc`** cancels.
    - Windows render as a light-blue bar with a tick perpendicular
      to the wall showing the interior normal direction.
    - **Right-click** on a window opens a **blind-level slider**
      popover (0 % open → 100 % closed) with live preview + a
      Delete button.

- **Interior beam projection**.  In `paintCanvas` after the fixture
  pass, every window computes:
    * Sun-vs-window dot product from the current `state.ambient`.
    * If the sun is above the horizon, the window faces the sun
      (dot > 0.05), and blind_level < 0.98, project a radial-
      gradient wedge into the room using the ambient colour, with
      intensity = ``dot × (1 - blind) × min(lux / 60 000, 1) × 0.6``.
    * Composite mode `lighter` so beams from multiple windows sum
      correctly.

- **Ceiling height** exposed on `floor.ceiling_height_m` (default
  3.0 m); wired through create/update/read paths.  Ready for the
  Phase 2B reflective-bleed model.

### Verified

Playwright end-to-end: placed two windows on a 30×20 m floor (one
on the south wall, one on the east with blind_level=0.5).  Scrubbed
time to 09:00 UTC (sun alt 68°, azimuth 3°) → a bright warm wedge
projects downward from the south wall window into the room, exactly
matching the sun's direction; east-facing window contributes
minimally (correctly attenuated).  Pytest 458/458 still green.

### Deferred to Phase 2B

- Per-project `elevation_m` field.
- `neighbouring_building_polygons` for cast-shadow modelling.
- Reflective bleed of beam energy into adjacent room polygons.
- Auto-detecting windows from DXF `WINDOWS` / `WIN` layer.
- Small sun-icon overlay on the 2.5D Building side-view showing
  the sun's arc as the time slider is dragged.

## 2026-02-11e — Outdoor ambient light spectrum (Phase 1 of daylight sim)

### What shipped

- **Weather provider abstraction** (`elc/weather.py`) that composes
  three data sources with graceful fallback:
    1. OpenWeatherMap  -- when ``OPENWEATHER_KEY`` env var is set
    2. Open-Meteo      -- free, no API key, canonical default
    3. NOAA (US-only)  -- last resort when the primary two fail
  Cached in-process for 5 min to stay under OWM's free-tier budget.
  Failure of every provider serves an "offline" placeholder so the
  UI never has to blank the canvas.
- **Solar geometry** (self-contained NOAA algorithm, ~0.1° precision)
  returning `(altitude_deg, azimuth_deg)` for any lat/lon + ISO ts.
- **Illuminance model** that maps solar altitude + cloud cover +
  precipitation to horizontal-plane lux, calibrated against the CIE
  values: ~110 000 lx at clear noon, ~17 500 lx overcast noon,
  1..600 lx twilight, ~0..1 lx starlight.
- **Colour spectrum** matching the operator's ask: deep blue-black
  at night, warm orange near the horizon, cool grey overcast, warm
  beige on a sunny day.  Continuous perceptual (log) brightness scale.
- New endpoint `GET /api/elc/ambient?at=<ISO>` returning
  ``{at, sun, weather, ambient: {illuminance_lux, color_rgb,
  color_hex, label}}``.
- **Canvas paint update**: the entire canvas is now filled first
  with the ambient colour, then the DXF/floor rectangle covers just
  the interior in the panel background colour, so the surrounding
  area transitions through the sun/weather spectrum.
- **Ambient widget** in the header showing swatch + label + lux.
  Click to reveal a **time-scrub slider** (00:00–23:59 minutes-of-
  day) + **Live** button; slider previews any hour of the day for
  the current date, Live returns to real-time.  Polls every 5 min
  when unscrubbed.

### Verified

Playwright end-to-end: at UTC "now" (night at the pod's site) the
canvas painted `#060913`; scrubbing to 12:00 UTC shifted to
`#bfb8a1` (overcast noon, 17 587 lx via Open-Meteo real data); no
API key required.  Pytest 458/458 still green.

### Deferred to Phase 4-5 (next session)

- Per-window `blind_level` slider (0..1) + right-click "Blinds…" UI.
- Interior daylight beam through each window (Simple-beam model
  with reflective bleed to adjacent rooms).
- `elevation_m` on project + `height_m` per floor +
  `neighbouring_building_polygons` for shadow modelling.

## 2026-02-11d — Multi-select persistence, SCU-reports dropdown, displayDeviceId sweep

### Bug fix: multi-select shape / tube / length changes now persist

**Symptom** (operator ask): swipe-select many fixtures, change shape /
tube / length -- the selected fixtures visually update, but the
changes revert as soon as focus moves to an unselected element.

**Root cause**: `state.selectedDeviceIds` contains inventory-normalised
IDs (canonical replica form, e.g. `SRM_6S/0/2/1`), but fixture rows
placed before the 2026-02-11b aliasing fix still carry the operator's
legacy form (`SRM_6E/0/2/1`).  The persistence loops in
`maybeBulkApplyShape` and `onDimensionEdit` compared raw
`fx.device_id` against the selection set -- when the strings didn't
match, the loops silently skipped every fixture and never called
`savePlacements`.  Element metadata (which is keyed by device_id
directly via the API) DID persist, so the visual reflected changes
until the next re-render pulled the un-persisted fixture geometry
back from the floors store.

**Fix**: normalise BOTH sides of the comparison through
`_normaliseToInventory` (which maps SRM_6E -> SRM_6S canonical via
the replica inventory).  Any selection now resolves to the correct
fixture rows regardless of the string form each side stores.

### SCU Reports dropdown

Collapsed the 5-button SCU reports strip in the element editor
into a single `<select>` + Run button (2026-02-11 operator ask).
The dropdown also auto-runs on change so iterating through reports
takes one click instead of two.  Data-type hex codes remain in the
option labels (`Total & On-Time (0x06)`) for operator debugging.

### displayDeviceId sweep

Added last session, wired to `#ee-device` element-editor header.
This pass extends coverage so the operator's typed name (`SRM_6E`)
shows up everywhere the raw device_id was surfaced:

- Tree view relay leaves (both Physical + Logical / group members).
- Toasts: `Focused ...`, `No element for ...`, `... -> ON/OFF`,
  `... dim -> N%`, `Removed ... from floor`,
  `Copied properties from ...`, `Auto-assigned ... as On/Off`.

Canvas fixture labels already went through `moduleLabelFor()` --
no change needed.

### Verification

Playwright end-to-end: placed one fixture as `SRM_6E/0/2/1`
(legacy) + one as `SRM_6S/0/1/1` (canonical), both as line shape
with T5 tube, selected both, changed dim-length to 5 m, then
cleared the selection to trigger a full refresh.  Confirmed:

    savedLengths:       [SRM_6S/0/2/1 -> 5, SRM_6S/0/1/1 -> 5]
    AFTER SWITCH FOCUS: [SRM_6S/0/2/1 -> 5, SRM_6S/0/1/1 -> 5]

...and screenshot showed `Editing SRM_6E/0/2/1` header, the new
SCU Reports dropdown open in the element editor.  Pytest still
458 / 458.

## 2026-02-11c — Element-editor header respects Settings-typed name

The "Editing X" header in the right-rail element editor was
writing the raw replica-canonical device_id (``SRM_6S/0/2/1``)
instead of the Settings-typed form (``SRM_6E/0/2/1``).  Added a
new helper `displayDeviceId(did)` in `demo/floor.html` that
rewrites the type segment through `moduleLabelFor()`, and wired
the element-editor `#ee-device` label to it.  Same helper is now
available for any other spot that surfaces a raw device_id
verbatim (canvas labels, tree leaves, toasts).

Verified live: element editor for the SRM_6E-typed module at
address 2 now reads ``Editing SRM_6E/0/2/1``.  Pytest 458/458.

## 2026-02-11b — SRM_6E / SRM_6S aliasing fix (per-floor filter + label)

### Symptoms

Operator assigned Floor `F1` to all three modules on SCU 0 in
Settings (one each of `SRM_6S`, `SRM_6E`, `SRM_4S`), but the
Building page's RHS panel on F1 showed only 2 modules (`SRM_6S`
addr 1 + `SRM_4S` addr 3 -- the `SRM_6E` at addr 2 was missing).
Additionally, a fixture placed on the canvas from an earlier
session labeled its device as `SRM_6S/0/1/1` when the operator
expected `SRM_6E/0/1/1`.

### Root cause

`SRM_6S`, `SRM_6E`, `SRM_ERM`, and `SRM_4E` all share ETLC wire
code `0x15`.  Python's `IntEnum` treats identical values as
aliases of the first canonical member (`SRM_6S`), so **every
device coming from the replica or discovery is stringified as
`SRM_6S/...`, regardless of what the operator typed in Settings.**

The per-floor filter was keyed by the operator-typed name
(`SRM_6E/0/2`), but the replica reports the canonical form
(`SRM_6S/0/2`).  The lookup missed → the module was treated as
default `F0` → hidden on `F1`.  Same issue caused the canvas
fixture label to fall back to `SRM_6S`.

### Fix

`demo/floor.html`:

- New `_CANONICAL_DEV_TYPE` map + `_canonicalDevType(t)` helper
  that projects the 0x15-family aliases onto `SRM_6S`.
- `_projSnap.moduleFloor` is now keyed by the CANONICAL type, so
  the filter matches the replica.
- `_projSnap.moduleTypedName` stores the operator's typed name
  for every module in Settings (present or absent from Settings
  is now distinguishable, so the legacy `state.moduleLabels`
  override no longer wrongly shadows an explicit Settings entry).
- `moduleLabelFor(devTypeName, scu, addr)` reordered:
  1. Settings-typed name (`_projSnap.moduleTypedName`) wins.
  2. Legacy `state.moduleLabels` (devices.json override) only fires
     when Settings has no entry for that `(scu, addr)`.
  3. Canonical wire type as final fallback.
- `renderSrmGrid` tags every module with `m.display_type` so the
  module box header prints the Settings-typed name.

### Verification

Playwright test: posted a project.json with modules of type
`SRM_6S`/`SRM_6E`/`SRM_4S` on addresses 1/2/3, all mapped to
`F1`; ran `/discover-srms`; selected F1 in the Building page;
confirmed module box headers read exactly
`SRM_6S SCU 0 · Addr 1`, `SRM_6E SCU 0 · Addr 2`,
`SRM_4S SCU 0 · Addr 3`, and the "3 of 3 SRMs on this floor
(F1)" summary matched.  Pytest 458/458 green (unchanged).

## 2026-02-11 — Settings-driven floor identity (strand labels)

### What shipped

- **Floors are now identified by a *strand label*** typed in Settings.
  Format: ``F0..F200`` (F0 = Ground, no ``G``, no ``B0``) or
  ``B1..B50``.  The Settings-page "SCUs & Modules" table gained a
  new **Floor** column between Address and Note; every unique label
  the operator types automatically materialises as a real floor row
  on `POST /api/elc/project`, so the operator never has to click a
  "+ Floor" button again -- which has been removed from the Building
  page.
- **RHS "SRM Devices" panel filters per-floor**.  When the operator
  selects a floor slab, the panel shows only modules whose Settings
  Floor field matches that floor's strand label, plus a
  ``N of M SRMs on this floor (F1)`` summary at the top.  If more
  than one SCU serves the same floor, the modules group under
  per-SCU headers (``SCU-Test · 192.168.1.222:4001``); single-SCU
  floors skip the header level (module boxes already carry
  ``SCU N · Addr M``).
- **Building side-view (2.5D slabs)** sorts by strand
  (``B50 → B1 → F0 → F1 → F200``) and labels each slab
  ``F1 · <operator name>`` so the identity is visible even when the
  name diverges.
- **Floor picker** now shows ``F1 · <name> · WxH m``.
- **Legacy floors auto-migrate** on first boot.  ``L1`` → ``F1``,
  ``Ground`` → ``F0``, ``Basement 3`` → ``B3``, ``L999`` → ``F0``,
  unknown → ``F0``.  Name-collision case appends ``_2`` /``_3`` so
  no legacy row is silently dropped.

### Details

**Data model:**
- `elc/config/project.py`:
  - New `validate_strand_label(s)`, `strand_sort_key(s)`,
    `strand_from_legacy_name(s)` helpers.
  - `ModuleEntry.floor` field with `field_validator` that upper-cases
    and range-checks (F0..F200 / B1..B50).
  - `ProjectConfig.strand_labels()` returns unique labels across
    all modules in canonical order.
- `elc/config/store.py`:
  - New ALTER TABLE migration: `floors.strand_label TEXT NULL`.
  - One-shot backfill (`_backfill_floor_strands`) on first boot
    after the migration.
- `elc/floors/store.py`:
  - `list_floors` / `get_floor` / `create_floor` / `update_floor`
    all round-trip `strand_label`.
  - New `get_or_create_floor_by_strand(label)` -- idempotent, used
    by the `/api/elc/project` save handler to materialise floors.

**API changes:**
- `POST /api/elc/project` now creates any missing floor whose
  strand label appears in the payload's modules, and returns
  ``floors_created: [labels...]`` for operator visibility.
- `GET /api/elc/tree` exposes `strand_label` on floor rows and
  `floor` on module rows.

**Frontend:**
- `demo/settings.html`: Floor column added to the SCUs & Modules
  table with pattern-validated input (browser-native red outline
  on invalid), Note column shrunk.  Discover-flow defaults new
  rows to ``F0``.
- `demo/floor.html`:
  - "+ Floor" button removed from the Building panel header.
  - `_projSnap` module cache (fetched on boot + on window focus)
    holds SCU host/port + `moduleFloor` lookup.
  - `renderSrmGrid` filters modules by `_projSnap.moduleFloor`
    against the current floor's `strand_label`, renders the
    per-floor summary, groups by SCU with headers (hidden when
    single-SCU), and emits a
    "no SRMs assigned to X, open Settings" placeholder when the
    filter empties the panel.
  - `_floorSortKey` prefers `strand_label` (basement negative,
    ground zero, above-ground positive) with legacy name fallback.
  - 2.5D slab labels show ``strand · name``; floor picker shows
    ``strand · name · WxH m``.

**Tests:** 458 / 458 green (48 new).  New file
`tests/config/test_floor_strand.py` covers label validation,
sort ordering, legacy-name migration, ModuleEntry normalisation,
`strand_labels()` canonical order, and
`get_or_create_floor_by_strand` idempotency + upper-case
normalisation + distinct-row creation.

Frontend verified live via Playwright: posted a project.json with
three modules on F0/F1/B1, ran `/discover-srms`, then cycled the
floor picker across all three slabs and confirmed the RHS panel
showed exactly the right module box + "1 of 3 SRMs on this floor
(F0/F1/B1)" summary each time.

## 2026-02-11 — Building page: Tree view (SCU / SRM / relay / floor / group / schedule)

### What shipped

- **Collapsible "Tree" strip** in the Building page header.  Clicking
  the top-right ▼ Tree button slides a two-column panel down between
  the nav and the canvas showing every relationship in the site at
  a glance -- physical hardware topology and logical schedule/group
  hierarchy side-by-side.
- **View switch** -- Both / Physical / Logical, so operators can
  focus one side or cross-reference (default: Both).
- **Physical column** (`SCU → Module → Relay`) with per-relay badges:
  live state (ON / OFF / dim %), every group the relay belongs to,
  and the floor it's placed on.
- **Logical column** (`Floors` / `Groups` / `Schedules`) with reverse
  indexes: each group expands to show its members with live state,
  each schedule expands to show its assigned groups.
- **Live via SSE** -- relay state badges update in real time from
  the existing `/events-sse` stream (no extra socket).  Handles
  `relay_state`, `dim_level`, and `broadcast_complete` events.
- **Filter box** -- case-insensitive substring across every node's
  text; auto-expands matching branches, hides non-matching siblings.
- **Right-click context menu** wired to every node type:
  - relay: Jump to on canvas · Edit element · Assign to group ·
    Toggle ON/OFF · Set dim level · Delete placement
  - group: Open in Schedule editor · Rename · Delete
  - schedule: Open in Schedule editor · Rename · Toggle enabled · Delete
  - floor: Open on canvas · Rename · Delete
  - module: Select module's relays (bulk-select on canvas)
  - scu: Open in Settings
- **Canvas ↔ tree sync** -- left-clicking a relay node selects the
  device on the canvas, refreshes the SRM grid, and opens its
  lighting-element editor (if configured).

### Details

**Backend (`scripts/demo.py`):**
- New endpoint `GET /api/elc/tree` returns one denormalised rollup:
  project meta, SCUs (with online flag), modules, relays (with live
  state from the replica + reverse `groups[]` + `floor`), floors
  (id/name/dims/fixture count), groups (with member device_ids and
  assigned schedules), and schedules (with reverse `groups[]`).
  Composes from `elc.config.store.list_groups/list_schedules`,
  `elc.floors.store.list_floors`, `stack.replica.all()`, and
  `elc.codec.etlc38.channel_count_for` per module type.

**Frontend (`demo/floor.html`):**
- New CSS block (tree strip, view switch, tree lines, badges,
  context menu) added just before `</style>`.
- New DOM: `<section id="tree-strip">` between `</header>` and
  `<main>`, plus a floating `<div id="tree-ctx-menu">`.
- New JS module `_tree` (~350 lines) added just before
  `_startSse()`: `_fetchTree`, `_renderTreePhysical`,
  `_renderTreeLogical`, `_applyTreeFilter`, `_liveUpdateTreeRelay`,
  context-menu open/close, `_treeCtxAction` for each node kind.
- `onLiveEvent` now also patches the tree's live badges via
  `_liveUpdateTreeRelay` for `relay_state`, `dim_level`, and
  `broadcast_complete` events (only when the strip has been
  fetched at least once, so idle sessions have zero overhead).
- Top-nav button `#btn-tree` toggles the strip's `.open` class
  (CSS `max-height` animation).

**Tests:** 410 / 410 backend tests still green (no test change).
Frontend verified via Playwright: seeded 3 fixtures + 2 groups + 1
schedule via `/api/elc/floors|groups|schedules`, opened the tree
strip, and confirmed:
- both-view renders Physical (SRM_6S Addr 1 · 6 relays with Lobby /
  Corridor / L1·Ground badges) + Logical (Floors, Groups collapsible,
  Schedules) columns side-by-side;
- Physical-only view hides Logical column and vice versa;
- Filter "Corridor" narrows Physical to just `SRM_6S/0/1/3` and
  Logical to just the Corridor group with matching branches
  auto-expanded.

## 2026-02-11 — Canvas swipe (rubber-band) multi-select

### What shipped

- **Rubber-band selection on the top-down canvas** in
  `demo/floor.html`.  Operators can now drag a rectangle over empty
  canvas area to bulk-select fixtures instead of shift-clicking
  each one.
- **Additive by default**: swiping adds the fixtures whose anchor
  lies inside the box to `state.selectedDeviceIds`; existing
  selection is preserved.  No modifier keys required (per operator
  choice, 2026-02-11).
- **Empty-canvas only**: marquee only starts when mousedown does
  NOT hit an existing fixture handle or anchor -- single-fixture
  click-select and drag-to-move remain unchanged.

### Details

**Frontend (`demo/floor.html`):**
- `canvas.mousedown`: after the two fixture hit-test passes fall
  through, sets `dragState = { mode: 'marquee', startSx, startSy,
  curSx, curSy, moved:false }`.
- `canvas.mousemove`: early branch when `dragState.mode ===
  'marquee'` -- just updates `curSx/curSy` + `paintCanvas()` (no
  fixture geometry mutation).
- `canvas.mouseup`: on `mode === 'marquee'` release, computes AABB
  in screen space, iterates `state.currentFloor.fixtures`, adds
  every fixture whose `(x_m, y_m)` anchor maps into the rectangle
  to `state.selectedDeviceIds` (via `_normaliseToInventory` so
  legacy SCU-numbered placements still match).  Guards against
  no-op mousedown (drag < 3 px) so a plain empty click stays a
  no-op.  Fans out to `renderSrmGrid()` + `updateAssignBar()` +
  `syncShapeSubcontrols()` + `openElementEditor`/`closeElementEditor`
  to mirror the existing single-click sync pattern.  Emits a toast
  `+N selected (M total)` when new fixtures were added.
- `paintCanvas()`: draws a translucent blue (`rgba(96,165,250,0.15)`)
  fill + dashed `rgba(96,165,250,0.9)` outline for the live marquee
  when `dragState.mode === 'marquee'`.

**Tests:** 410 / 410 green (no backend change).  Frontend verified
via Playwright: swipe over 3 fixtures at 5/15/25 m selected the two
that fell inside the marquee and left the third untouched;
right-rail "2 SELECTED" bar + Align H/V + Delete buttons activated
correctly.

## 2026-02-11 — Schedule Editor: Group ↔ Popout sync + placedSet bug fix

### What shipped

- **Group card is the source of truth.**  `refreshAll` fetches
  every group's members in parallel into `state.groupMembers`.  On
  popout open, `_syncMaskFromGroup` overwrites the localStorage
  mask for each module on the floor so checkbox-checked = "member
  of linked group".  Popout title shows `— linked to group: [Name]`
  and a `[N changes staged]` amber badge when marks deviate.
- **`state.contextGroupId`** is set by any group interaction (dot
  click, floor ×, drop) so the popout mirrors the last-touched
  group.  `_lastPopoutSyncKey` invalidated after refreshAll to
  reflect fresh state.
- **Floor × in group card resets ALL relays** of every module on the
  floor (uses `state.devices` to enumerate).  No residual memberships.
- **`placedSet` filter removed from `_floorModulesForFloor`** -- the
  ROOT of "drop didn't override" bug.  Previously, checking a relay
  that wasn't literally in `state.floorPlacements` (common because
  placement doesn't always list every channel of every module) got
  silently filtered from the drag payload.
- **Floor drop uses SET semantics** (`_syncFloorsToGroup`).  For
  the modules in the payload, the group's members are made to
  exactly equal the payload's channels: DELETEs current members
  not in payload; POSTs channels not yet members.  Toast reports
  `synced (+X / -Y, target N ch)`.
- **Tests**: 394/394 pytest passing.


## 2026-02-11 — Settings wizard (bootstrap flow) + astro sun-times

### What shipped

- **New `configs/project.json`** — one human-readable file capturing
  the site's identity: project profile (name, timezone, lat/lng,
  sunrise/sunset offsets) + SCU list + per-SCU module inventory
  (dev_type / address / note / discovered flag).
- **`elc/config/project.py`** -- pydantic model + atomic save/load
  (temp-file + rename, `.bak` backup on overwrite).  Validators
  reject duplicate SCU ids / duplicate module addresses / bad
  dev_types.  `to_devices_json()` expands the SCU→module hierarchy
  into the flat `[{dev_type, scu, address}, ...]` list the demo's
  `_load_device_set` already consumes.
- **`elc/util/astro.py`** -- wraps `astral>=3.2` (pure Python).
  `sun_times_for(lat, lng, tz_name, on=?, sunrise_offset_min=?,
  sunset_offset_min=?)` returns dawn / sunrise / solar_noon /
  sunset / dusk (local + UTC), day_length_min.  Applies offsets to
  sunrise/sunset only; civil twilight boundaries untouched.
- **REST endpoints** (in `scripts/demo.py`, `include_in_schema=False`):
  * `GET  /api/elc/project`               -- read
  * `POST /api/elc/project`               -- validate + persist
  * `POST /api/elc/project/expand-devices` -- flat device list
  * `GET  /api/elc/sun-times?date_iso=?` -- today's or given-date
    solar events for the project coords
  * `GET  /settings`                       -- serves settings.html
- **Bootstrap redirect middleware**: `/`, `/floor`, `/editor` are
  302→`/settings` when no project.json (or empty) exists.  Bypass
  via `?force=1` on any of those routes.
- **`demo/settings.html`** -- wizard UI with 3 sections:
  1. Project profile (name/tz/lat-lng/offsets), "Use browser location"
     button that fills lat/lng from `navigator.geolocation`, live
     sun-times preview strip.
  2. SCUs & Modules: repeatable SCU blocks (bus id, name, host, port,
     Discover, × Remove).  Each SCU has an inline modules table with
     dev_type dropdown, address, note, × delete.  Discover button
     merges results from `/discover-srms` (marks each merged row
     `discovered: true`).
  3. Preview & Save: live JSON preview + sticky footer (Reload / Save
     & continue → auto-redirects to /floor after save).
- **Tests** (`tests/config/test_project_config.py`): 11 new tests
  covering channel-count-by-type, validator rejections, save/load
  round-trip + backup, absent-file → None, `is_configured` gating,
  `to_devices_json` shape, sun-times keys / Bangalore sanity /
  offset-shift semantics.  Full suite: **410/410 passing** (up from
  399).

### Deferred

- Hot-reload of the driver on save: today the JSON is committed but
  the SCU link stays bound to the previous inventory; operator
  restarts `demo.py` to pick up new modules.  A hot-reload path
  (driver.rebind + rediscover) is a follow-up.
- Timezone dropdown (currently free-text `p-tz`): swap for the
  IANA-tz list once we settle on a source (browser Intl or bundled).


## 2026-02-11 — SCU Data Reports (opcode 0x14, protocol §8)

### What shipped

- **Codec** (`elc/codec/etlc38.py`):
  * New constants: `OPCODE_DATA_REQUEST` (alias of 0x14),
    `DATA_TYPE_RELAY_STATE` (0x11), `DATA_TYPE_TOTAL_ONTIME` (0x06),
    `DATA_TYPE_DAILY_ONTIME` (0x07), `DATA_TYPE_MONTHLY_ONTIME`
    (0x08), `DATA_TYPE_DAILY_POWER` (0x0A),
    `DATA_TYPE_MONTHLY_POWER` (0x0B).
  * `DataRequestV38(device, data_type)` generalises the existing
    `StatusQueryV38` -- `data_type=0x11` is byte-equivalent (regression
    covered by test).
  * `DataReportV38` -- variable-length RX decoder (LL-byte-driven).
    `try_decode(frame, expected_data_type)` returns a report; the
    `parse_payload()` method parses `0x06` into
    `{total_cycle, total_ontime, month_ontime, day_ontime}` per
    operator-confirmed DF layout, and returns raw hex only for the
    other data types (pending real hardware capture).
- **Driver** (`elc/drivers/srm.py`):
  * `SrmDriver.request_relay_data_v38(device, data_type, timeout=1.5)`
    -- fresh one-shot TCP query (SCU single-connection constraint),
    length-driven RX read, decodes via `DataReportV38`, returns dict.
- **REST** (`elc/api/rest.py`):
  * `GET /api/elc/relay-data?device={did}&data_type={hex_or_dec}` --
    wraps the driver method.  Returns parsed fields + `raw_hex` +
    `tx_hex`.  No DB persistence.  503 when link disconnected; 400
    when link is not V3.8.
- **UI** (`demo/floor.html`):
  * Relay drill-down panel (`#ee-ops`) now includes a **"SCU
    Reports"** section with 5 buttons: Total & On-Time / Daily On-
    Time / Monthly On-Time / Daily Power / Monthly Power.  Result
    pane shows parsed values (when we have a decoder) + tx / rx
    hex for operator inspection.  Live query only -- no history.
- **Protocol doc** (`docs/RED5-ETLC-V3.8-PROTOCOL.md`):
  * New §8 documenting the data-request family, TX + RX layouts,
    per-data-type DF interpretations, consumer paths, safety
    guarantees.
- **Tests**: 5 new codec tests (encode DF0, back-compat with
  StatusQueryV38 wire bytes, 0x06 payload parse, unknown-type raw
  fallback, checksum-corruption reject).  Full suite: 399/399.

### Deferred items

- Real DF-layout parsers for `0x07/0x08/0x0A/0x0B` -- awaiting
  hardware RX capture (raw hex is exposed in UI + REST so operator
  can validate then extend `parse_payload`).
- Units for on-time counters (currently marked `seconds` -- TBD).



### What shipped

- **Group card is the source of truth.**  `refreshAll` fetches
  every group's members in parallel into `state.groupMembers`.  On
  popout open, `_syncMaskFromGroup` overwrites the localStorage
  mask for each module on the floor so checkbox-checked = "member
  of linked group".  Popout title shows `— linked to group: [Name]`.
- **`state.contextGroupId`** is set by any group interaction (dot
  click, floor ×, drop) so the popout mirrors the last-touched
  group.  `_lastPopoutSyncKey` invalidated after refreshAll to
  reflect fresh state.
- **Floor × in group card resets ALL relays** of every module on the
  floor (uses `state.devices` to enumerate, not just
  `state.floorPlacements`).  No residual memberships remain.
- **placedSet filter removed from `_floorModulesForFloor`** -- the
  ROOT of "drop didn't override" bug.  Previously, checking a relay
  that wasn't literally in `state.floorPlacements` (common because
  placement doesn't always list every channel of every module) got
  silently filtered from the drag payload.  Now: if a module has
  ANY placement on the floor, ALL its channels are draggable.
- **Floor drop uses SET semantics** (`_syncFloorsToGroup`).  For
  the modules in the payload, the group's members are made to
  exactly equal the payload's channels: DELETEs current members
  not in payload; POSTs channels not yet members.  Toast reports
  `synced (+X / -Y, target N ch)`.
- **Group members view (unchanged, kept from prior iteration)**:
  every module on a group's floor shows ALL channels as dots
  (solid = member, hollow = not).  Click any dot to toggle.  No
  × on module rows; × on floor header now wipes all channels of
  all modules.
- **Tests**: 394/394 pytest passing.


## 2026-02-25 — V3.0 Phase 6.1M: ETLC V3.8 burst-broadcast (opcode 0x07)

### What shipped

- **Broadcast ALL ON / ALL OFF via burst opcode `0x07`** matching the
  operator-confirmed 2026-07-25 hardware protocol note.  Per module,
  N concurrent frames land on the SCU (N = max channel count across
  discovered SRM-family modules — 4 for 4SRM-only, 6 when any 6SRM/
  6ERM is present, 48 for 48SRM) using `asyncio.gather` over
  independent one-shot TCP sockets.  No inter-frame delay, no per-
  frame serialisation lock — matches "almost simultaneously without
  waiting for the RX".
  - New driver method: `SrmDriver.broadcast_v38(state, modules,
    max_channels=None)` in `elc/drivers/srm.py`.  Auto-derives
    `max_channels` from `channel_count_for(dev_type)` when omitted.
  - New burst helper: `SrmDriver._v38_burst_send(frames)` — bypasses
    the `_v38_write_lock` used by singular relay ops.
  - Legacy `driver.broadcast(...)` wildcard-`RelaySet` path is
    unchanged so mock/dev-mode and Phase-4 broadcast-complete tests
    keep working byte-for-byte.
- **REST `POST /api/elc/broadcast`** now enumerates registered SRM
  modules from the replica, dedupes by `(dev_type, scu, address)`,
  and routes v38 links through `broadcast_v38`.  Response includes
  `mode: "v38_burst"` + `modules` + `max_channels` + `frames`
  counters so the UI can surface exactly how many frames landed on
  the wire.  Empty-inventory case returns a `note` hinting the
  operator to run `POST /discover-srms` first.
- **Frontend broadcast bar** (`demo/floor.html`) now fires one
  server-side call instead of a browser-serialised loop of per-
  channel POSTs.  Toast surfaces `modules × ch = frames` for
  transparency; falls back to a helpful "no SRM modules known"
  toast when the discovery step hasn't run yet.
- **`Replica` remains the source of truth** — each module answers
  with a single `0x25 RelayStatus`, `_on_v38_bytes` decodes the
  channel mask, and `Replica` mirrors whatever the hardware
  reports (not the commanded state).  Confirmed by the new
  regression test.
- **`docs/RED5-ETLC-V3.8-PROTOCOL.md` §7** now documents the burst
  protocol byte-for-byte.
- **6 new regression tests** in
  `tests/drivers/test_srm_broadcast_v38.py`:
  - Frame count = `modules × max_channels`, opcode 0x07, correct
    state byte (parametrised ON/OFF).
  - Dispatched concurrently (< 1s for 18 frames; < 0.5s dial
    spread) — pins the anti-serialisation contract.
  - Empty-module list is a no-op.
  - `Replica` trusts the SCU's `0x25` reply mask.
  - `max_channels=None` auto-derives from widest module.
- **Full suite still green: 394 tests pass** (391 pre-existing +
  3 net new after parametrisation).


## 2026-02-11 — V3.0 Phase 6.1L: ETLC V3.8 hardware protocol scaffolding

### What shipped

- **Live on/off + 0-10V dim controls** on the floor-plan element editor
  sidebar (`floor.html`).  Dim slider is a UI stub (`{mocked: true}`)
  until the analog wire frame lands.
- **Delete-from-canvas button** in the floor toolbar; same effect as
  Delete/Backspace, kept next to Align H/V.
- **Sort placed devices in DIN-rail order** (`Replica.all()` sorted
  by `(scu, address, dev_type, sub_address)`), matched client-side
  in editor + floor pages.
- **Canvas + operator mode now respect `relay_state=false`** — was
  hard-coded ON in layout mode; dim slider modulates canvas beam
  brightness via `fixtureBrightness()`.
- **Device-id canonicalisation** on floor read
  (`elc/floors/routes.py`) — old placements with stale enum-alias
  or SCU-number strings get rewritten to the current canonical form
  so the SRM-grid purple highlight fires correctly on canvas click.
- **V3.8 wire codec scaffolding**: `elc/codec/etlc38.py` +
  `docs/RED5-ETLC-V3.8-PROTOCOL.md` + `scripts/probe-v38.py` +
  `scripts/probe-variants.py`.  ScuLink gained a `wire_version="v38"`
  mode with a raw-bytes handler channel; SrmDriver opens a fresh
  TCP socket per command (mimics probe behaviour).
- **Checksum algorithm verified** against 10 observed RX frames:
  `cs = (~(sum(data) + 0x80) + 1) & 0xFF`, matches doc text exactly.
- **Preamble is 3 bytes "ELC"** (not 4 bytes "ELC@" as we first
  assumed).  Codec + tests updated accordingly.
- **391 tests passing**; every observed hardware RX byte is baked
  into `tests/codec/test_etlc38.py` as a golden regression.

### Known hardware blocker

None of the four master→SCU RelayOverride variants tried on 2026-02-11
elicited any response from the physical SCU:

  * Type=0x07 minimal (5 data bytes)
  * Type=0x07 with 1-byte Flag=0xFF
  * Type=0x07 with 4-byte Flag=FFFFFFFF
  * Type=0x08 multi-relay bitmask

The SCU RX path (physical switch on module → SCU broadcasts
Type=0x40 RelayStatus 0x25) works and our codec decodes it perfectly.
The TX path is blocked pending ground-truth from a working ETLC
master (vendor Windows tool / touch panel / mobile app) captured via
`tcpdump -w vendor.pcap 'host 192.168.1.222 and port 9760'`.  See
`docs/RED5-ETLC-V3.8-PROTOCOL.md §6` for the six ambiguities that
need resolving.


## 2026-02-11 — V3.0 Phase 6.1k: SCU-aware editor "Seed" button

The editor page's `Seed 30 demo devices` button was hardcoded to the
mock topology (30 SRMs at `SRM/1/{10..300}/0`) *and* seeded by firing
`state: true` RelaySet writes — safe against MockScu, dangerous
against a real SCU (would physically switch every relay on).

### Backend
- `Replica.register(device)` — new public method (`elc/domain/replica.py`).
  Creates a snapshot with `relay_state=None` (unknown), emits a
  `device_registered` event, and is idempotent.
- `GET /api/elc/demo-devices` — returns `{source, count, devices}`
  where `devices` is the list loaded from `ELC_DEVICES_JSON` (or the
  30-SRM mock grid when unset).  Used by the editor to relabel the
  Seed button and drive the safe-seed loop.
- `POST /api/elc/devices/{id}/register` — safe replica-only insertion,
  no `RelaySet` frame emitted.  Verified by test that asserts
  `mock_scu_server.received_frames == []` after registration.
- `build_router` / `build_stack` grew `demo_devices` +
  `data_source` params; `scripts/demo.py` passes both through.

### Frontend (`demo/editor.html`)
- Seed handler now fetches `/demo-devices`, calls `/register` per
  entry (no relay flip), and toasts a source-aware message.
- Button label + tooltip auto-update on load: "Seed 16 SCU channels"
  in physical mode, "Seed 30 demo devices" in mock.
- Empty-state hint copy no longer hardcodes "30".

### Tests
- 5 new pytest cases in `tests/integration/test_rest.py` covering:
  default-mock demo-devices, physical-inventory demo-devices,
  register-doesn't-emit-frames, register-idempotency, bad-id 400.
- Full suite: 368/368 passing.


## 2026-02-07 — V3.0 Phase 6.1d: Non-point Shapes + Compliance Heatmap

Two visualisation features on top of the wall-clipping foundation:

### 1. Non-point Light-source Shapes
`lighting_elements.shape` now supports **5 categories**: `point`,
`stick` (fluorescent tube), `strip` (LED strip), `ring`, `polyline`
(LED strip forming an arbitrary outline).  Each fixture placement
carries its own geometry (`angle_deg`, `length_m`, `radius_m`,
`vertices`) so the same "LED strip" element can be cut to different
lengths per floor.

**Rendering:** `sampleShapePoints(fx, el)` in `demo/floor.html`
samples the shape's centre line and drops overlapping radial
gradients along it.  With additive compositing the result reads as
a tube (stick/strip), an annulus (ring), or a custom outline
(polyline).  Per-sample lux is scaled by `1/√N` so long strips stay
peak-matched to point sources.

**UI:** Toolbar dropdown "Shape" (`data-testid="shape-picker"`)
selects the shape for the *next* placement.  Dropping an SRM tile
with a non-point shape plants the anchor and enters a click-flow
banner: click endpoint for stick/strip, click radius edge for ring,
click each vertex + Enter/double-click for polyline.  Escape
cancels.  Live rubber-band preview drawn on canvas.  Element
editor gained a `Shape` `<select>` so shapes can also be changed
after placement.

### 2. Compliance Heatmap Toggle
Toolbar toggle `Heatmap: On/Off`
(`data-testid="floor-heatmap-toggle"`) colours each room by
average lux vs code-compliance minimum.

- **Per-room threshold** — `_infer_room_type()` on backend maps DXF
  room name substrings ("office", "corridor", "meeting", "kitchen",
  "warehouse", "workspace", "bathroom", "storage") to types.  Types
  → default min lux via `_ROOM_MIN_LUX_DEFAULTS` (office=300,
  corridor=100, meeting=300, warehouse=200, ...).  Rooms carry both
  fields (`type`, `min_lux`) with explicit overrides supported on
  create/update.
- **Sampling** — `paintHeatmapOverlay()` calls `ctx.getImageData()`
  on the already-lit canvas (per-user choice: "what the eye sees
  IS what gets scored"), samples every 3rd pixel inside each
  polygon's bounding box, ray-casts against the polygon, and
  averages Rec-709 luminance.  Inverse of `luxToAlpha()` recovers
  lux estimate.
- **Colouring** — green (>= min), amber (within 10 % below), red
  (below).  Room-name + `avg/min lx` label at each polygon
  centroid; corner legend explains the palette.

**Backend Schema:**
- `lighting_elements.shape` column added with `'point'` default; additive `ALTER TABLE` migration for legacy DBs.
- `_validate_fixture` accepts optional `angle_deg`, `length_m`, `radius_m`, `vertices` (validated).
- `_validate_rooms` accepts optional `type` (enum of 9 room types) + `min_lux`; defaults inferred when omitted.
- `DxfConversion.rooms` unchanged — room `type` gets inferred lazily at store-write time from `name`.

**Tests added (24 new):**
- `test_store.py::TestRoomTypeAndMinLux` (5) — type inference, override, validation.
- `test_store.py::TestFixtureShapeGeometry` (6) — geometry round-trip + validation.
- `test_lighting.py::TestUpsert::test_shape_persisted`, `test_bad_shape_rejected`.
- `test_lighting.py::TestUpsert::test_create_minimal` gained `shape="point"` assertion.

Full suite: **353 tests, all green** (up from 340).

**Verification:**
- `/tmp/floor_shapes.png` — Office 1 = point bulb, Office 2 = stick (horizontal tube), Kitchen = ring (annular halo), Corridor = long LED strip, Meeting Room A = polyline forming a rectangular picture-frame.
- `/tmp/floor_heatmap.png` — traffic-light overlay + per-room "avg/min lx" labels; empty rooms glow red, well-lit rooms green, Kitchen shows amber "281/300 lx" (marginal).

Files touched: `elc/config/store.py`, `elc/floors/{store,lighting,routes}.py`, `demo/floor.html`, 2 test files.

---

## 2026-02-07 — V3.0 Phase 6.1c: Wall/Partition Clipping for Lighting Visualization

Fixture light gradients on the top-down floor canvas now respect room
partition walls — a lamp in Office 1 no longer bleeds into Office 2 or
the corridor.  End-to-end shipped: DXF room extraction → DB storage →
canvas clipping.

**Backend (Red5-ELC-V3.0):**
- `elc/config/store.py`: added `rooms_json` column to the `floors`
  table schema, plus an additive `ALTER TABLE` migration for legacy
  DBs that were created before the column existed.
- `elc/floors/store.py`: plumbed `rooms` through `create_floor` /
  `update_floor` / `get_floor` / `list_floors` with a new
  `_validate_rooms` guard (>=3 vertex pairs per polygon).
- `elc/floors/dxf.py`: `DxfConversion` now carries a `rooms` list;
  `_extract_rooms()` pulls every closed LWPOLYLINE on layer `ROOMS`
  out of the modelspace, translates to metres with a Y-flip so
  coordinates match the SVG viewport, and returns
  `{id, name, vertices}` dicts.  The ROOMS layer is turned off
  before SVG rendering so the polygons are invisible in the plan
  itself.
- `elc/floors/routes.py`: `POST /floors`, `PATCH /floors/{id}`, and
  `POST /floors/import-dxf` all accept / return `rooms`.
- `scripts/make_sample_dxf.py`: new `_room()` helper emits closed
  polylines on the `ROOMS` layer + XDATA room names.  The 40×25 m
  office sample now carries 9 rooms (4 offices, kitchen, corridor,
  2 meeting rooms, open workspace); warehouse sample carries 2.

**Frontend (`demo/floor.html`):**
- Added `pointInPolygon`, `findContainingRoom`, `tracePolygonPath`
  helpers.
- In `paintCanvas()`, each fixture's radial gradient is now drawn
  inside a `save() → clip() → restore()` block.  Clip region is the
  smallest room polygon containing the fixture; if none matches
  (e.g., corridor without a closed boundary in the DXF), clip
  falls back to the floor's outer bounding box so light doesn't
  spill off the plan.

**Tests:** 340 / 340 green (11 new).
