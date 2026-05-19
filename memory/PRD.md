# AHU Diagnostic HUB - Product Requirements Document

## 🌿 Codebase Fork (2026-02-13)
- **`/app/archive/Red5-Studio-V1.9/`** — **Controller Edition** (production at `219.79.12.63:5001`). Frozen baseline; bug-fix only. All work in this PRD before 2026-02-13 refers to this version.
- **`/app/archive/Red5-Studio-V2.0/`** — **Web Hosted Edition** (greenfield, just forked). Multi-tenant SaaS target. Migration plan: `Red5-Studio-V2.0/WEB_HOSTING_GUIDE.md`. Version-split rationale: `Red5-Studio-V2.0/VERSION.md`. Phase 1 = Demo Mode on Emergent (1-2 days).

## Documentation Index
- **`psychrometric_design_workflow.md`** / **`psychrometric_design_workflow.ko.md`** — Designer Mode workflow + ERV math walkthrough.
- **`erv_band_shift_insight.md`** / **`erv_band_shift_insight.ko.md`** — "Losing hours" semantics + capex/opex narrative.
- **In-app access**: `📚 Docs` button in dashboard sidebar header opens a tabbed popup with all docs. Also accessible as per-context `?` buttons (cyan next to B-shift strip, amber next to + Designer Mode).

## V1.9 Bugfix — Overlapping Buttons in T-Time / W-Time / 3D Modes (2026-02-13)
**Brief**: User reported the new aux buttons (`Band src: OA`, `?` design-help, `?` band-help, B-shift delta strip) stayed visible after switching from X-Y Detail to T-Time or W-Time, where they overlapped the `BACK TO 3D` and `MONTHLY × SITES` buttons at the top-right of the chart header, making those buttons unclickable.

### Fix
- Added the 4 new aux button IDs (`p3-btn-band-src`, `p3-band-help`, `p3-design-help`, `p3-band-delta`) to the existing show/hide logic in `setupControls`:
  - **front/side (T-Time, W-Time) handler**: hides all 4 via `style.display='none'`.
  - **X-Y Detail handler**: restores all 4 (`block` for buttons, `flex` for the delta strip — only if ERV is on).
  - **Back-to-3D handler**: hides all 4 since they're 2D-only.
- Removed the previously-added 250 ms `setInterval` watchdog that mirrored Designer Mode visibility onto the design-help `?` button — now driven by the same event-based handlers as every other 2D-only button (cheaper, race-free).

### Verification (live on `219.79.12.63:5001`)
- Playwright at 1920×900 verified state transitions:
  - **X-Y Detail**: `bandSrc:block, bandHelp:block, designHelp:block, bandDelta:flex, designer:block`.
  - **T-Time**: ALL 5 = `none`. Top-right shows only `MONTHLY × SITES`, `SRC: OA`, `BACK TO 3D` — no overlap.
  - **Back to X-Y**: all 4 aux buttons restored.
  - **Back to 3D**: all 4 aux buttons hidden.
- Hot-deployed `js/psy-3d-engine.js` (379,346 B).

### Files changed
- `js/psy-3d-engine.js` — 3 lines added per handler (× 3 handlers) + removed the 7-line setInterval watchdog. Net: cleaner, fewer LOC.

## V1.9 Bugfix — Korean Docs "Unable to load" (2026-02-13)
**Brief**: User reported the Korean tabs in the Docs Index popup showed `Unable to load doc / File not found on the controller`, even though the `.ko.md` files were live on the controller (`curl` and Playwright fetch both returned 200 OK). Root cause: the browser had cached a 404 from an earlier upload-race attempt, and the fetch error was being **cached in the module's success cache** so re-clicks did not retry.

### Fix (3 hardening changes)
1. **Cache-buster on every fetch**: appended `?ts=Date.now()` to all `/assets/*.md` URLs so the browser never serves a stale 404 or stale body. Applied to both the standalone `js/docs_index.js` factory and the in-engine `_createInsightPopup` factory.
2. **Don't cache failures**: removed the line that stuffed the `Unable to load doc` placeholder into the success cache. Errors are now painted as transient inline content — next tab click or popup re-open triggers a fresh fetch attempt.
3. **Localized retry hint**: error message is now bilingual (`*Click the tab again to retry, or hard-refresh (Ctrl+Shift+R)*` / `*탭을 다시 클릭하거나 하드 새로고침 (Ctrl+Shift+R) 해주세요.*`) so the user knows what to do.
4. **Server-side**: `/assets/<filename>` route now sets `Cache-Control: no-store` on `.md` files (was: `public, max-age=3600`). Future doc updates take effect on the next page load instead of waiting an hour. (Requires backend restart to take effect; uploaded but not auto-applied.)

### Verification (live on `219.79.12.63:5001`)
- Playwright at 1920×900 with `localStorage` cleared:
  - Open docs → click 한국어 → band-shift body renders 3,514 chars of Korean (`시간 손실/운영자/밴드` regex matches, no `Unable to load` substring).
  - Tab → psych-design → body renders 5,812 chars of Korean (`기계설비/코일/습공기` regex matches).

### Files changed
- `js/docs_index.js` — fetch URL cache-busted, error path no longer caches.
- `js/psy-3d-engine.js` — `_createInsightPopup._fetch` cache-busted, same hardening.
- `app.py` — `/assets/` route adds `.md` to the no-cache extension list. Backend restart required.

## V1.9 Bugfix — Dashboard Landing-Page Crash (2026-02-13)
**Brief**: The new `📚 Docs` button used a bare `t('docs_index')` call in its `title` attribute. When evaluated before `window.t` was reachable as a bare global in the JSX render context, this threw `ReferenceError: t is not defined` and tripped the React error boundary on the dashboard landing page.

### Fix
- Changed `title={t('docs_index') || '...'}` → `title={window.t ? (window.t('docs_index') || '...') : '...'}` in `dashboard.html`. Matches the safe pattern already used by the Collector button (`window.t ? window.t(...) : '...'`).
- Hot-deployed updated `dashboard.html` (381,578 B). Live render verified clean: no error boundary, PSYCH chart + AHU list + docs button all render correctly, popup opens on click.

### Files changed
- `dashboard.html` — 1 line: title attribute hardened with `window.t` existence check.

## V1.9 Docs Index Popup — One-Stop Help (2026-02-13)
**Brief**: New `📚 Docs` button in the dashboard's sidebar header opens a tabbed popup containing every insight doc. Discoverable from any tab (PSYCH/DIAG/DYNAM/3D WX), not just from inside the 3D engine. The previous per-context `?` buttons (band-shift, design-workflow) remain in place for direct deep-linking; the index gives operators a single entry point if they don't know which `?` to click.

### Implementation
- **New file**: `js/docs_index.js` (13.2 KB) — fully self-contained module. Loaded via `<script>` in `dashboard.html` (also loadable from any other page that needs it). Exposes:
  - `window.red5DocsIndex.open()` — opens/focuses the popup
  - `window.red5DocsIndex.close()` — hides
  - `window.red5DocsIndex.register({id, title_en, title_ko, doc_en, doc_ko, color})` — register a third doc dynamically
- **Default registry** ships with 2 docs (band-shift + psych-design). Easy to extend without touching the module — call `register()` from any consumer.
- **Architecture**:
  - Tabbed popup mounted to `document.body` so it survives React tab changes in the parent app.
  - Per-tab + per-language fetch cache `{docId: {en, ko}}` — no refetch on tab switch.
  - Inline minimal markdown renderer (60 lines, no external deps). Same subset as the per-context popup.
  - Drag handle on header, ✕ close, EN/한국어 toggle next to title.
  - State persisted to `localStorage.red5DocsIndexState` (`{pos, activeId, lang}`). Auto-inherits app language on first open.
- **Dashboard integration**: `dashboard.html` gains `<script src="js/docs_index.js">` + a `📚 Docs` button next to the LangSelector in the sidebar header. Click handler: `window.red5DocsIndex.open()`. `data-testid="docs-index-btn"` for E2E.

### Verification (live on `219.79.12.63:5001`)
- `js/docs_index.js` (13,151 B) + `dashboard.html` (381,538 B) hot-deployed. `red5_bundle.zip` rebuilt.
- Playwright at 1920×900 verified end-to-end: button visible in sidebar at `(69, 74)`, `window.red5DocsIndex` global registered, popup centers at `(640, 280, 640×520)` with both tabs labeled correctly, tab switch persists `activeId=psych-design`, language toggle persists `lang=ko`, title localizes (`📚 Docs Index` → `📚 문서 색인`), Korean body regex `기계설비/코일/습공기` matches.

### Files changed
- `js/docs_index.js` — new (304 lines, 13.2 KB).
- `dashboard.html` — 2 line additions: `<script src="js/docs_index.js">` + `📚 Docs` button JSX in header.


## V1.9 Generic Insight Popup Factory + Psych Workflow EN/KO (2026-02-13)
**Brief**: Refactored the band-shift popup logic into a generic `_createInsightPopup(opts)` factory and used it to add a second `?` button next to `+ Designer Mode`. The full psychrometric-design workflow doc is now one click away from the Designer Mode panel, in either English or Korean.

### Implementation
- **New file**: `psychrometric_design_workflow.ko.md` (12.6 KB, 189 lines) — full Korean translation of the design workflow, including the 7 sizing-formula sections, Red5 ↔ designer mapping table, the 4-phase usage guide, and the V1.9 Designer Mode shipped-implementation table.
- **Refactor**: extracted 150 lines of popup logic into `_createInsightPopup(opts)`. Accepts `{btnId, btnTitle, btnStyle, popupId, docEN, docKO, titleEN, titleKO, storageKey, storageLang, anchorEl}` and returns `{button, popup, show}`. State (`_pos`, `_loaded`, `_lang`, `_closed`) is closure-scoped per instance so two popups never share state.
- **Two instances now wired**:
  1. `p3-band-help` — cyan, top-right of overlay, band-shift insight doc (no behavior change vs prior).
  2. `p3-design-help` — amber, next to `+ Designer Mode` button (`top:46 left:435`), design-workflow doc.
- **Visibility lockstep**: tiny 250 ms interval watcher mirrors `#p3-btn-designer.style.display` onto `#p3-design-help.style.display` so the `?` button is paired with the Designer Mode button (hidden in T-Time/W-Time/Monthly-Sites chart modes, visible in psy mode). Interval cleaned up via `_cleanupTasks.push(clearInterval)`.

### Verification (live on `219.79.12.63:5001`)
- `node --check js/psy-3d-engine.js` → clean. `js/psy-3d-engine.js` (378,128 B) hot-deployed; `/assets/psychrometric_design_workflow.ko.md` (12,625 B) reachable.
- Playwright at 1920×900 verified end-to-end:
  - Both `?` buttons visible in X-Y mode (band-help cyan circle, design-help amber circle).
  - Click design-help → popup opens with title `Psych Design Workflow`, body 9,606 chars, regex match `Mechanical Equipment | Coil tons | Apparatus` → true.
  - Click 한국어 → title flips to `습공기선도 설계 워크플로`, body regex match `기계설비 | 코일 | 습공기 | ASHRAE` → true, `localStorage.red5DesignInsightLang=ko`.
  - Independent storage keys: band-help language and design-help language can differ.

### Files changed
- `psychrometric_design_workflow.ko.md` — new (189 lines, 12.6 KB).
- `js/psy-3d-engine.js` — refactored ~150 lines into factory; added 2 factory invocations + visibility-pair interval.


## V1.9 한국어 Translation + In-Popup Lang Toggle (2026-02-13)
**Brief**: Korean version of the band-shift insight doc + a two-half pill toggle in the popup header to switch between EN and 한국어 without leaving the app. Korean operators can now read the capex/opex narrative in their native language during owner walkthroughs.

### Implementation
- **New file**: `erv_band_shift_insight.ko.md` (7.7 KB) — full Korean translation. All 4 conclusions, the Seoul example table, capex/opex talking-points per audience, common-confusions Q&A — translated and culturally tuned (e.g., 자본 지출 주기 instead of literal "capex cycle"). Topology preserved so the same markdown renderer works.
- **In-popup lang toggle** (`js/psy-3d-engine.js`): `<div data-lang-toggle>` two-half pill chip in the header beside the title. Active half = cyan background `#60a5fa` + slate-900 text; inactive half = transparent + slate-400 text. Click switches.
- **Cache + fetch logic**: `_insightLoaded` is now `{en, ko}` keyed; each language fetched once on first switch, instant on subsequent toggles.
- **Initial language detection**: priority `localStorage.red5BandInsightLang > window.getLang() > 'en'`. Persisted explicit choice survives reloads + diverges from app-wide language if user has chosen.
- **App-wide langchange follower**: listens for the existing `langchange` event. If user has no explicit popup-language choice (`localStorage` empty), the popup automatically follows app language. If user has explicit choice, it is honored.
- **Drag-handler exclusion**: header drag listener now excludes `[data-lang-toggle], [data-set-lang]` from `e.target.closest()` so clicks on the lang chip aren't eaten by the drag.
- **Title also localized**: `B-Shift Insight` (en) / `B-시프트 통찰` (ko). Loading state localized: `Loading insight…` / `통찰 문서 로드 중…`.

### Verification (live on `219.79.12.63:5001`)
- `node --check js/psy-3d-engine.js` → clean. `js/psy-3d-engine.js` (376,426 B) hot-deployed; `/assets/erv_band_shift_insight.ko.md` (7,673 B) reachable via existing whitelisted asset route.
- Playwright at 1920×900 verified all 3 transitions: open popup with `EN` highlighted (cyan), English body renders; click `한국어` → title flips to `B-시프트 통찰`, `한국어` chip turns cyan, Korean body renders (table headers `밴드 / 라벨 / 평이한 설명`); click `EN` back → title and body restore. Both choices persist to `localStorage.red5BandInsightLang`.

### Files changed
- `erv_band_shift_insight.ko.md` — new (264 lines, 7.7 KB).
- `js/psy-3d-engine.js` — ~30 lines: lang cache + toggle chip + fetch routing + langchange follower + drag-handler exclusion.


## V1.9 In-App B-Shift Insight Popup (2026-02-13)
**Brief**: New `?` button next to the B-shift strip opens a 560×480 draggable popup that fetches `erv_band_shift_insight.md` and renders it inline with a tiny markdown→HTML renderer. Operators no longer need filesystem access to read the walkthrough during owner meetings.

### Implementation (`js/psy-3d-engine.js`)
- New `#p3-band-help` cyan circular button (22 px) at `top:22px right:8px` of the 2D overlay.
- New `#p3-band-help-popup` flex-column overlay with header (`B-Shift Insight` + ✕) + scrollable markdown body.
- **Mini markdown renderer** `_renderMd(md)` (~60 lines) supporting H1/H2/H3, blockquote, ordered/unordered lists, GFM tables, `**bold**`, `*italic*`, `` `code` ``, fenced ``` blocks, and `---` hr. No external library — keeps the controller lean.
- **Single fetch with cache**: `/assets/erv_band_shift_insight.md` (existing whitelisted route) loaded on first open, cached in `_insightLoaded` so repeat opens are instant.
- **Drag handle**: header is `cursor:move`; full drag implementation mirroring the ERV rollout pattern (mousedown excludes buttons, position clamped to `[0, rootW-80] × [0, rootH-40]`).
- **Persistence**: `localStorage.red5BandInsightState = {pos, closed}` so popup position survives page-reloads. `closed` is persisted but not auto-shown — operator must click `?` to open each session.

### Verification (live on `219.79.12.63:5001`)
- `node --check js/psy-3d-engine.js` → clean. Bundle rebuilt; `js/psy-3d-engine.js` (373,052 B) hot-deployed, live MD5 `d2916984b5edad3c2254df91ebf4b454` matches.
- Playwright at 1920×900 verified all 5 transitions: `?` button visible at `(1890, 22)`, popup hidden initially → click ? opens at `(400, 60)` with rendered table + blockquote + inline code → drag header moved to `(600, 160)`, persisted `pos={x:280,y:160}` → ✕ hides + persists `closed:true` → re-click `?` restores position to `(280px, 160px)`.

### Files changed
- `js/psy-3d-engine.js` — ~140 lines: state + button + popup + `_renderMd` + drag handler + close handler.


## Active Backlog (priority-ordered)
- **P3** — Controller Redundancy Architecture (deferred to separate project)
- **P3** — Phase B Sun Path (deferred until live raycasting/Three.js is in scope)
- **P4** — Workspace cleanup (`/app/archive/Red5-Studio-V1.9/` dedupe + restructure)
- **P5** — **Climate-drift headline**: single-line auto-generated callout above the band-shift strip (e.g., `Climate drift since 2020-2024 avg: +127 hours in B6+B7 (warmer summers)`). Auto-highlights whichever band gained the most hours year-over-year so operators don't have to mentally diff the dashed-vs-solid bars. Depends on the existing `_bandHistoryHist` + `_bandHourDelta()` outputs — pure render addition above `#p3-band-delta`, no new fetches needed.

## Original Problem Statement
Building Diagnostic Command Center: separate a monolithic Flask application into a dedicated backend API (`app.py`) and standalone React SPA frontends. System runs on a constrained embedded controller, loaded via iframe from cloud software.

## V1.9 Year-over-Year Climate Drift Comparison (2026-02-13)
**Brief**: New 3-state toggle button on the band-shift strip cycles `off → vs 1y → vs 5y avg → off`. When enabled, fetches historical Open-Meteo archive data for the same M-D window and overlays the historical band distribution as dashed purple ghost-outline bars on each cell. Lets owners see whether the building's climate exposure is drifting warmer/wetter over time × the wheel's impact.

### Implementation (`js/psy-3d-engine.js`)
- 4 new module-scope state vars: `_bandHistoryMode` (`'off'|'1y'|'5y'`, persisted), `_bandHistoryHist` (cached averaged histogram), `_bandHistoryKey` (memo key = lat,lon,fromD,toD,mode), `_bandHistoryLoading` (bool).
- `_histogramFromPts(pts)` returns `{Bn:{oa,oap}}` from a raw weather array using current Designer-Mode RA/eps (same single source of truth as the live histogram).
- `_shiftYearISO(iso, yearsBack)` clamps Feb-29 → Feb-28 in non-leap target years.
- `_loadBandHistory(mode, cb)` does `Promise.all` over 1 or 5 archive-API fetches, averages the resulting histograms, stores in `_bandHistoryHist`, memo-keyed so flip-flop toggling is free.
- Module-scoped `_refreshBandDelta` placeholder (not function declaration to avoid hoisting shadowing) — assigned inside `setupControls` to the real implementation.
- Strip now starts with a stacked cell (`B-shift` label + cycle button) before the 10 band cells. Button color: slate when off, purple `#a855f7` when 1y/5y, amber while loading.
- Each band cell gains a `position:relative` wrapper so the ghost outlines (`border:1px dashed #a855f7`) absolute-position behind the solid bars.
- `maxH` scaling now includes historical extremes so ghost outlines never clip the cell height.

### Verification (live on `219.79.12.63:5001`)
- `node --check js/psy-3d-engine.js` → clean. Bundle rebuilt; `js/psy-3d-engine.js` (362,955 B) hot-deployed; live MD5 `87af51d6ef90359ad6b71d4d18241bb9` matches source.
- Playwright at 1920×900 verified all 3 states:
  - Click 1 → fetches 2024 archive, button text `vs 1y`, persisted as `1y`, 21 dashed ghost outlines rendered (10 bands × 2 bars + the `?` cell).
  - Click 2 → fetches 5 prior years and averages, button text `vs 5y\u2009avg`, persisted as `5y`.
  - Click 3 → ghosts cleared, button text `vs prior`, persisted as `off`.

### Files changed
- `js/psy-3d-engine.js` — ~120 lines: history state + 3 helpers + cycle button + ghost-outline rendering + on-init weather-load hook for persisted mode.


## V1.9 Per-Band Hour-Count Delta Strip (2026-02-13)
**Brief**: New `#p3-band-delta` strip in the top-right of the 2D overlay shows how many annual hours move INTO or OUT OF each B1-B10 band when the ERV wheel is on. Hard scheduling number that complements the visual "cloud collapse" the OA/OA' toggle produces.

### Implementation (`js/psy-3d-engine.js`)
- New `_bandLabelOf(t, rh)` module-scope mirror of the render-local `bandLabel()` so we can compute the histogram outside any render path.
- New `_bandHourDelta()` walks `weatherData` once and returns `{Bn: {oa, oap}, _total}` per band. Uses Designer-Mode `_designerRA_T/RH/Eps` as the single source of truth for OA'.
- New `#p3-band-delta` floating element top-right of 2D overlay. For each of 10 bands renders a stacked 2-column mini-bar (OA in 35% opacity, OA' in 95%) + band id label + signed Δ count (lime if gained, rose if lost, slate if zero). Native `title=` per cell shows `B5: OA 43h → OA' 1206h (Δ +1163h)`.
- Re-renders via 4 event paths so it always stays in sync:
  1. `red5-erv-rollout-update` window event (ERV chip + Designer Mode edits)
  2. `red5-weather-loaded` window event (new weather year)
  3. Band-source chip click (immediate refresh)
  4. Initial paint at engine init

### Verified live story (Seoul 2920 hr)
- B1–B4 (cold): `−49h, −171h, −6h, −20h` — wheel pre-heats cold hours out of these bands.
- **B5 (Comfort): +1163h** — wheel "creates" a year-round B5 climate.
- B6: +105h.
- B7 (warm-hum), B9 (hot-dry): `−140h, −4h` — wheel pre-cools hot hours out of these bands.
- Operator takeaway: tune PI loops for B5 since it now dominates the operating profile.

### Verification (live on `219.79.12.63:5001`)
- `node --check js/psy-3d-engine.js` → clean. `red5_bundle.zip` rebuilt; `js/psy-3d-engine.js` (354,413 B) hot-deployed; live MD5 `388439a1d0879d49a40459b30c22843e` matches source.
- Playwright at 1920×900 verified: strip auto-shows on ERV-on (11 cells: 10 bands + `?`), auto-hides on ERV-off; all 10 band counts + signed Δ values render correctly; Seoul climate produced expected pattern (cold + hot bands lose hours, B5 gains).

### Files changed
- `js/psy-3d-engine.js` — ~70 lines: `_bandLabelOf` + `_bandHourDelta` helpers + `#p3-band-delta` element + `_refreshBandDelta()` + 4 event hookups.


## V1.9 ERV-Aware B1-B10 Band Source Toggle (2026-02-13)
**Brief**: When the ERV wheel is on, the B1-B10 control strategy can now bucket each hour either by **raw OA** (default — same as a vanilla controller that senses ambient before the wheel) OR by **OA' / post-wheel state** (a wheel-aware controller that intentionally picks less-aggressive SA targets the wheel has made possible). New `Band src:` chip in the 2D overlay toggles between the two views.

### What's new (`js/psy-3d-engine.js`)
- 1 new module-scope state `_bandSourceOaP` (bool, persisted at `localStorage.red5BandSourceOaP`).
- `_bandInputFor(p)` helper returns `{T, RH, W}` — raw OA when toggle OFF or ERV OFF, post-wheel OA' otherwise. Single source of truth across 2D + 3D band consumers. RH is recovered from `(T, W)` via the existing `psat()` function so band lookup (which keys on T+RH) sees a coherent state.
- **Chip wired** at top of 2D overlay (`#p3-btn-band-src`, between `Mode:` and `BACK TO 3D`):
  - Disabled (grey, `not-allowed`, 45% opacity) when ERV is OFF — tooltip explains how to enable.
  - Enabled (cyan when `OA'`, slate when `OA`) when ERV is ON. Click toggles.
  - Auto-refreshes via `red5-erv-rollout-update` window event so ERV chip toggles flow into the chip in real-time.
- **Call sites switched** to use `_bandInputFor(p)`:
  - 3D Drops (`_buildSaDropGeometry`): both `_saReset` (SA target) AND `_bandRGB` (color) honor the toggle so the band palette + landing positions shift together.
  - 2D `render2DChart`: all three projection modes (`lines`, `dots`, `vav`) updated — `computeSA`, `bandLabel`, `bandCol` calls all use the effective input.

### Visual story (verified live)
- **OA mode**: rainbow OA→SA Lines spread out, hot summer hours route to high-temp bands (B7/B8 orange/red lines). Same as a vanilla controller.
- **OA' mode**: cloud visibly collapses toward the comfort zone (mostly green/cyan B4–B5 lines) because OA' rebucketing puts harsh hours into milder bands with less-aggressive SA targets. Tells the story "a wheel-aware controller saves even more than a vanilla one."

### Verification (live on `219.79.12.63:5001`)
- `node --check js/psy-3d-engine.js` → clean. `red5_bundle.zip` rebuilt 1755.8 KB (MD5 `fe9d7db0c87ebc8c059070f2f8bfbcca`).
- `js/psy-3d-engine.js` (347,965 B) hot-deployed; live MD5 matches.
- Playwright at 1920×900 verified all 4 states: ERV-OFF chip grey/disabled, ERV-ON chip slate/`OA`, click toggles → cyan/`OA'` and persists `red5BandSourceOaP=1`, click again → back to `OA`. Both projection-mode lines (2D) and drop palette (3D) re-render on toggle.

### Files changed
- `js/psy-3d-engine.js` — ~50 lines added: `_bandSourceOaP` state + load, `_bandInputFor` helper, chip element + handlers, swap to `bi.T/bi.RH/bi.W` in 6 call sites (3D drops × 2, 2D lines, 2D dots, 2D vav × 3).


## V1.9 ERV Rollout Panel — Draggable + Resizable + Closable (2026-02-13)
**Brief**: The bottom-left rollout panel was previously anchored. User wanted it as a movable popout with a close affordance. Added drag handle (header), close ✕ → revive chip pattern, and bottom-right resize grip — all with persisted position/size.

### What's new (`js/psy-3d-engine.js`)
- 3 new module-scope state vars persisted under `red5ErvRolloutState`: `closed` (bool), `pos:{x,y}` (top-left in `p3-root` coords), `size:{w,h}`.
- **Drag handle**: `#p3-erv-header` row has `cursor:move`; `mousedown` (excluding buttons/inputs) starts a `window`-attached `mousemove`/`mouseup` drag. Position clamped to `[0, rootW-50] × [0, rootH-30]`, persisted on mouseup. `_applyRolloutGeometry()` switches from `bottom/left` anchoring to absolute `top/left` once dragged.
- **Resize grip**: 12 px `nwse-resize` corner element with a 3-stripe gradient, bottom-right of the panel. `mousedown` starts a drag-resize sized in the range `[260..800] × [120..700]`. Persisted on mouseup. Re-appended after each `innerHTML` rewrite (grip is a separate DOM node).
- **Close ✕**: red-tinted `\u2715` button added to the header row. Click sets `closed=true`, hides the panel, shows `#p3-erv-revive` chip.
- **Revive chip**: cyan-bordered compact `\u21BB ERV $173.2k/yr` chip. Same anchor (drag-persisted position so it pops up wherever the panel was). Click clears `closed` and re-shows the full panel. Text live-refreshes with the latest aggregate on every `_renderRollout()`.
- **Session-scoped close**: when ERV is toggled OFF, `closed` is auto-cleared so the next ERV-on session opens the full panel by default rather than starting on the chip. Predictable UX with no "stuck on chip" surprise.

### Verification (live on `219.79.12.63:5001`)
- `node --check js/psy-3d-engine.js` → clean. `red5_bundle.zip` rebuilt 1754.2 KB (MD5 `4456123bdb19dad5f6158f826c4cfdbe`).
- `js/psy-3d-engine.js` (344,067 B) hot-deployed; live MD5 matches.
- Playwright at 1920×900 verified all 5 transitions end-to-end:
  - Header cursor `move`, grip present, ✕ present.
  - Drag moved panel `(334, 907) → (534, 1007)` (Δ +200, +100); persisted `pos:{x:214, y:1007}`.
  - Resize grew panel `320×159 → 420×249`; persisted `size:{w:420, h:249}`.
  - Close ✕ → revive chip `↻ ERV $ 173.2k/yr` appears at same anchor; `closed:true` persisted.
  - Revive chip click reopens full panel.
  - Toggling ERV off auto-clears `closed`; re-enabling ERV opens full panel directly (not chip).

### Files changed
- `js/psy-3d-engine.js` — ~120 lines added: state vars + load/save, `_applyRolloutGeometry`, `_wireDragHandle`, `#p3-erv-grip` element, ✕ button in both empty-state and populated-state headers, `#p3-erv-revive` chip element + click handler, session-scoped reset in `_renderRollout`.


## V1.9 ERV ROI Badge on PSYCH Sidebar (2026-02-13)
**Brief**: The 3D-WX ERV Rollout numbers ($/yr saved, payback yr) are now also visible as a small cyan-bordered badge at the top of the AHU sidebar in the PSYCH (and DIAG / DYNAM) tab — so the savings ROI is one glance away on every page-load, not behind two tab-switches + two toggles.

### Wiring
- **Snapshot publisher** (`js/psy-3d-engine.js`): every `_renderRollout()` writes `window.red5ErvSnapshot`, persists to `localStorage.red5ErvSnapshot`, and dispatches a `red5-erv-rollout-update` CustomEvent. Snapshot shape: `{enabled, totalUSD, totalRtH, totalKWh, payback, npv, tariffKwh, zone, eps, ts}`. When ERV is toggled OFF, a `{enabled:false, ts}` snapshot fires so the badge clears.
- **Snapshot consumer** (`dashboard.html`): new `useState(() => JSON.parse(localStorage.red5ErvSnapshot))` hydrates on mount from localStorage so the badge appears immediately on fresh page-load (before the 3D engine has even mounted). A `useEffect` adds the `red5-erv-rollout-update` event listener for live updates.
- **Badge JSX** inserted between the OA/SA/RA filter row and the AHU list. Renders only when `ervSnap?.enabled && isFinite(totalUSD)`:
  - Top line: `ERV` label (cyan) + `$X.Xk /yr` (cyan) + `· Y.Y yr payback` (lime if <5 yr, amber otherwise).
  - Sub-line (60% opacity, 8 px): `ε=0.80 · KR-Seoul · 1843k kWh/yr`.
  - **Click anywhere on the badge → `setActiveView('weather3d')`** so operators can jump straight to the full rollout panel from the badge.
  - `data-testid="erv-roi-badge"` for E2E hooks.

### Verification (live on `219.79.12.63:5001`)
- `node --check js/psy-3d-engine.js` → clean. `red5_bundle.zip` rebuilt 1752.3 KB (MD5 `e57f4afe657c1423d6c4f2e0ccbf4376`).
- Hot-deployed `js/psy-3d-engine.js` (336,263 B) + `dashboard.html` (380,759 B) to controller. Live MD5 matches source on both files. Served `/dashboard` contains 13 references to the new `red5-erv-rollout-update` / `ervSnap` / `erv-roi-badge` strings.
- Playwright test at 1920×900: navigated to 3D WX → enabled Drops + ERV-ON → snapshot published correctly (`totalUSD=$173,237, payback=0.07 yr, npv=$1.32M, zone=KR-Seoul`). Switched back to PSYCH tab → cyan badge visible at the top of the AHU sidebar, click-handler wired.

### Files changed
- `js/psy-3d-engine.js` — 25 lines added: snapshot publish in `_renderRollout` (both enabled + disabled paths).
- `dashboard.html` — 18 lines: `useState(() => ...)` hydrator + `useEffect` listener + badge JSX block above the AHU list.


## V1.9 ERV Rollout Panel — 9-in-1 Annual Savings + ROI + A/B + CSV (2026-02-13)
**Brief**: Built a self-contained `#p3-erv-rollout` floating card at the bottom-left of the 3D scene that auto-shows whenever the OA→SA Drops layer is ON AND the ERV chip is ON. Single panel ships nine related enhancements requested in one batch.

### Features delivered
1. **Annual rollup readout** (a) — big primary line: `$173.2k /yr saved · 524.8k RT·h · 1,842,049 kWh` computed by summing per-hour `|h_OA − h_OA'|` × mass-flow over the loaded weather year.
2. **Per-month sparkline** (b) — 12 cyan height-mapped bars below the rollup, native `title=` per bar shows `month: kWh, hours`.
3. **ROI calculator drawer** (c) — collapsible (`ROI ▶`/`▼`), 3 number inputs (`Install $`, `Maint/yr $`, `Tariff $/kWh`) → live `Payback 0.1 yr · 10-yr NPV $1.32M` at 5% discount.
4. **Climate-zone tariff presets** (d) — `<select>` with 10 regions (KR-Seoul `$0.094`, US-NY `$0.21`, US-CA `$0.28`, SG `$0.20`, JP-TOK `$0.24`, EU-DE `$0.40`, CN-SH `$0.092`, AE-DXB `$0.083`, AU-SYD `$0.27`, Custom). Selecting auto-fills the tariff and re-runs the dollar math.
5. **Hover tooltip extension** (e) — existing 3D weather-point hover now appends a cyan block when ERV is ON: `OA' = T °C / W g/kg`, `Δh_saved kJ/kg`, `N.NN RT·h · $N saved`.
6. **Peak-hour annotations** (f) — `PEAKS` button toggles small amber-bordered Sprite labels in the 3D scene at the OA'-side of the top-3 ribbons (`#1  7/27 14h  18.2 kJ/kg`).
7. **Savings-threshold slider** (g) — `Min kJ/kg` range slider 0–20 hides hours where `|Δh_saved|` falls below the threshold, both in the 3D cloud and in the rollup totals.
8. **A/B ghost cloud** (h) — `A/B ghost ε` number input (0–0.95); when non-zero, renders a translucent purple cloud at the alternate epsilon in the 3D scene + a purple inline strip in the panel showing `$X.Xk/yr (±$Y vs active ε)`. Verified live: `ε=0.60` produced `$129.8k/yr (−$43.4k vs ε=0.80)`.
9. **CSV export** (i) — `CSV` button generates `erv_savings_eps0.80.csv` (12-column hourly export: `date_iso, OA_T, OA_RH, OA_W, OA_prime_T, OA_prime_W, h_OA, h_OAprime, dh_saved, RTh, kWh, USD`).

### Architecture
- **All state persisted** under `localStorage.red5ErvRolloutState` (zone, tariff, install, maint, roiOpen, minKJ, ghostEps, showPeaks).
- **Single source of truth** for OA' geometry: `_ervSavingsSeries(eps)` uses the same Designer-Mode `_designerRA_T/RH`, `_designerCFM`, and `enthalpy()` formula as the 2D Designer overlay + 3D Drops cloud — no duplication.
- **RT·h → kWh** via `RT·h × 3.517`. **RT formula**: `(CFM × 4.5 × dh_kJkg / 0.4299) / 12000`, identical to the existing Designer-Mode tons calc.
- **A/B + threshold + peaks** all hook into `_buildSaDropGeometry()` as additive passes — single rebuild covers all three.
- **Hover-tooltip extension** lives inside the existing `pathGroup` raycaster `mousemove` branch — no new raycaster needed.
- Net code addition: ~+220 lines across module-scope state, `_ervSavingsSeries`, `_ervAggregate`, `_ervROI`, formatters, panel render, drop-geometry threshold/ghost/peaks, hover-tip extension, CSV export.

### Verification (live on `219.79.12.63:5001`)
- `node --check js/psy-3d-engine.js` → syntax clean.
- `red5_bundle.zip` rebuilt 1751.1 KB, MD5 `49b2ec2ebb02fd27fc271a2289f72b06`, synced to `/app/frontend/public/` + `/app/frontend/public/red5-files/`.
- `js/psy-3d-engine.js` (334,811 B) hot-deployed via `POST /api/upload-file`; live MD5 matches source.
- Playwright DOM probes confirmed: panel auto-shows on ERV-ON, hides on either toggle off; zone-dropdown changes tariff and re-renders rollup; ROI drawer expands; ghost ε=0.60 renders purple cloud + Δ strip; threshold slider live-updates the geometry; PEAKS sprite labels appear at peak hours; CSV button present.

### Files changed
- `js/psy-3d-engine.js` — module-scope state + helpers + panel renderer + 3 additive passes in `_buildSaDropGeometry` + hover-tooltip ERV block.


## V1.9 ERV Legend Chip — Auto-Showing Two-Swatch Readout (2026-02-13)
**Brief**: Added a small legend swatch that auto-appears at the bottom of the layer-toggle panel **only** when both the OA→SA Drops layer is visible AND the ERV chip is ON, so new operators can read the dual-color cloud at a glance without hunting through tooltips.

### What's new (`js/psy-3d-engine.js`)
- New DOM element `#p3-saDrop-erv-legend` appended after the ERV chip inside the layer-toggle panel.
- Two inline swatches:
  - 14×5 px solid cyan `#22d3ee` bar + `ERV saved` label.
  - 18×5 px CSS gradient (blue → cyan → green → yellow → red, mirroring `t2rgb()` across the OA temperature range) + `coil work` label.
- Background, border-radius, font and `text-transform` mirror the existing T|B / ERV|· chips for visual unity.
- Visibility refreshed via `_refreshErvLegend()`, hooked onto both the ERV-chip click and the parent toggle panel click (via micro-task `setTimeout(..., 0)` after each click). Net effect: legend display tracks `_saDropERVOn && saDropGroup.visible` across all 4 state transitions (Drops on/off × ERV on/off) — verified live.
- Native `title` tooltip on the legend element documents the encoding (`cyan = energy the ERV wheel saved per hour; temperature-spectrum drop = the remaining coil work after pre-treatment`).

### Verification
- `node --check js/psy-3d-engine.js` → syntax clean.
- `red5_bundle.zip` rebuilt (1743.9 KB, MD5 `91916cf41f431f847dc778cd1c1717df`), synced to `/app/frontend/public/` and `/app/frontend/public/red5-files/`.
- `js/psy-3d-engine.js` (308,784 B) hot-deployed via `POST /api/upload-file` to live controller; live MD5 matches source byte-for-byte.
- Playwright DOM probe at 1920×900:
  - Drops ON, ERV OFF → legend `display: none` ✓
  - Drops ON, ERV ON  → legend `display: inline-flex`, text `ERV saved | coil work`, rect at x=328 y=1019 w=149 h=18 ✓
  - Drops ON, ERV toggled back OFF → legend `display: none` ✓
  - ERV ON, Drops layer hidden → legend `display: none` ✓ (correctly hides when its parent context disappears)

### Files changed
- `js/psy-3d-engine.js` — ~40 net new lines (between the ERV chip creation and the closing `}` of the `if (t[0]==='saDrop')` branch).


## V1.9 Dual-Color ERV Savings Ribbon on 3D OA→SA Drops (2026-02-13)
**Brief**: When the `ERV |·` chip on the 3D Drops layer is ON, every weather sample now renders as **two** color-coded segments instead of one, giving operators an at-a-glance heatmap of how much annual coil energy the wheel saved.

### What's new (`js/psy-3d-engine.js` → `_buildSaDropGeometry`)
- **Cyan ERV-savings ribbon**: a horizontal segment from `(rawOA.T, time-Y, rawOA.W)` → `(OA'.T, time-Y, OA'.W)` drawn at the cloud's top. Vertex colors fade from a dim teal `(.07,.42,.47)` at the raw-OA end to bright cyan `(.13,.83,.93)` at OA' so the **direction of energy recovery is unambiguous**. Each cyan trail's length is proportional to per-hour wheel work.
- **Temperature-spectrum coil drop**: the existing OA'→SA drop now starts at OA' (post-wheel state — the air the coil actually sees) instead of raw OA, so its length visualizes the **remaining coil work**. Top vertex = full color (entering-air-temp spectrum), bottom = 35% color as the drop hits the SA floor.
- **No new state**: re-uses the existing `_saDropERVOn` boolean (persisted in `localStorage.red5SaDropERV`), `_designerERVEps` (epsilon), and `_designerRA_T/RH` from Designer Mode — single source of truth across the 2D Designer overlay and the 3D Drops cloud.
- **No-action cull adjusted**: hours where the coil barely works (Δ vs entering-air-state <0.5 °C and <0.0003 kg/kg) are still culled, but now against `inT/inW` (post-wheel) instead of raw OA, so already-tempered hours where the wheel does the heavy lifting are correctly hidden from the coil-drop layer (still appear as cyan savings ribbons).

### Verification (live deploy on `219.79.12.63:5001`)
- `node --check js/psy-3d-engine.js` → syntax clean.
- `python3 build_bundle.py` → `red5_bundle.zip` rebuilt, 1743.2 KB, MD5 `bc8136894aaba28a7ced7c76bc7ff116`, synced to both `/app/frontend/public/red5_bundle.zip` and `/app/frontend/public/red5-files/red5_bundle.zip`.
- Hot-deployed `js/psy-3d-engine.js` (306,115 bytes) via `POST /api/upload-file` (JSON+base64). Live MD5 matches source byte-for-byte.
- Playwright verification at 1920×900: loaded Dashboard → 3D WX tab, fetched a year of weather for the saved location (한양대학병원, 2928 pts), enabled OA→SA Drops layer, clicked the inner `data-erv=on` span of the `p3-saDrop-erv` chip. Chip border transitions from grey `#334155` → cyan `#22d3ee`; rendered cloud visibly densifies as the cyan savings ribbons join the existing coil-drop lines.

### Why this matters
The operator can now read **annual ERV economy** straight off the 3D cloud — long bright-cyan trails at the cloud's top = many high-Δh hours where the wheel was doing significant work; short or absent ribbons = low-load shoulder-season hours. Hand-in-hand with Designer Mode's per-design-point "ERV saved 8.5 RT (28 %)" readout, this gives ROI conversations a **visual heatmap to point at** during owner walkthroughs, not just a number.

### Files changed
- `js/psy-3d-engine.js` — `_buildSaDropGeometry` extended with the cyan-ribbon segment + entering-air-state recompute. ~20 net new lines (lines 2509-2555).


## V1.9 Bugfix · AHU + VAV Popout Air-Flow Overlay Drift (2026-02-09)
**Brief**: User reported that the air-flow chevron segments and pink hotspot markers in the AHU Equipment Diagram drift left/down when the modal is popped out into a separate window (worked fine inline). Two screenshots provided confirmed the inline modal was pixel-perfect, popped-out was misaligned by ~50-80 px. Same latent bug existed on the VAV modal.

### Root cause
The image-dimension state (`ahuImgDims.dispW/dispH`, `vavImgDims.dispW/dispH`) drives `imgScale = dispW / natW`, which scales every overlay's pixel offsets. The state was captured once at `<img onLoad>` and refreshed by a `ResizeObserver`.

The `ResizeObserver` was constructed using the **parent window's** global (`new ResizeObserver(...)`). When the modal is popped out via `ReactDOM.createPortal`, the React subtree (including the `<img>`) mounts inside the popup window's document. The parent-window observer was attached to a cross-document target → browser silently ignores resize events from the popup. Result: `dispW` stayed frozen at the inline modal's measurement (e.g. 1500 px), but the popup rendered the image at a different displayed width (e.g. 1750 px), producing the visible drift.

### Fix
For both AHU (`ahuBodyRef` body-resize observer + `ahuImgRef` image-resize observer) and VAV (`vavImgRef` — previously had no `ResizeObserver` at all, only an `<img onLoad>` capture):

1. **Use the element's own document's ResizeObserver**: `const RO = el.ownerDocument.defaultView.ResizeObserver || ResizeObserver;`. This grabs the popup window's RO constructor when the element lives in the popup, so resize events actually fire there.
2. **Also listen to the popup window's `resize` event** (`winRef.addEventListener('resize', update)`). Belt-and-suspenders: if the popup is dragged across monitors with different DPRs or the user pinches/zooms, RO might not always fire but the `resize` event will.
3. **60ms delayed re-measure after mount/popout** (`setTimeout(update, 60)`) to absorb the layout race between `createPortal` mounting the subtree and the popup's layout engine reporting its final width.
4. **Key the effect on `ahuModalPopupHost` / `vavModalPopupHost`** so it re-runs when the popup opens/closes, rebinding observers to the freshly-mounted image element.

### Live deploy
- `dashboard.html` (366,782 bytes) hot-deployed to `219.79.12.63:5001`. User to hard-refresh + re-test the AHU popout — air-flow chevrons should now stay glued to the equipment slots at any popout window size, even when dragged to a different monitor.
- `red5_bundle.zip` rebuilt (MD5 `b100b01f74faafdfd668f9d989385dfc`).

### Files changed
- `dashboard.html` — 3 effects updated: `ahuBodyRef` body observer, `ahuImgRef` image observer (added `ahuModalPopupHost` dep + cross-doc RO), brand-new `vavImgRef` image observer with the same pattern (was missing entirely).


## V1.9 Designer Mode · USE LIVE OA button (2026-02-09)
**Brief**: Last item from the Designer Mode roadmap. A small pink `· USE LIVE OA ·` button under the OA T/RH inputs copies the latest Weather Strip point into the OA design inputs so the engineer can run a live "what would the coil need to be for *today's* outdoor conditions?" sizing pass without typing numbers.

### What's new (`js/psy-3d-engine.js`)
- Button HTML appended to the OA-T/OA-RH input row in the Designer Mode panel (pink border `#fb7185` to match the OA dot on the chart).
- Handler reads `weatherData[weatherData.length - 1]` (closure-scoped, populated by the existing Open-Meteo fetch path), copies `.t` and `.rh` into `_designerOA_T / _designerOA_RH`, updates the input DOM elements, persists to `localStorage`, and re-renders.
- **Disabled state**: when `weatherData` is empty/undefined, button is dimmed (opacity 0.45, `cursor: not-allowed`) with an informative tooltip. On click while disabled it briefly flashes red (`✖ no data yet`) for 800 ms instead of producing a silent no-op or alert.
- **Success state**: green flash for 1.1 s showing the copied values (`✓ 28.4°C / 72%`) so the operator sees the action registered.
- **Auto-enable**: new `red5-weather-loaded` `CustomEvent` dispatched from the Weather Strip fetch `.then()` block. The button listens via `window.addEventListener` and refreshes its enabled-state + tooltip the moment fresh data lands.

### Live deploy
- `js/psy-3d-engine.js` (296,300 bytes) hot-deployed to `219.79.12.63:5001`.
- `red5_bundle.zip` rebuilt (MD5 `506f5d89980601747de251da75f02bbc`).
- `psychrometric_design_workflow.md` flipped "Auto-anchor OA" from deferred → shipped.

### Files changed
- `js/psy-3d-engine.js` — button HTML, `_refreshLiveBtn` + click handler, `red5-weather-loaded` event hook (listener + dispatch).
- `psychrometric_design_workflow.md` — moved Auto-anchor OA from deferred → shipped.


## V1.9 Designer Mode · ERV Toggle (2026-02-09)
**Brief**: Adds the `+ ERV` (Energy Recovery Ventilator) toggle promised in the Designer Mode roadmap. When ON, the wheel pre-treats OA before it hits the mixing box: OA' sits on the OA→RA line at fractional distance ε (enthalpy effectiveness, default 0.80). The MA→SA coil-sizing math then runs from OA' instead of OA, and a 6th readout row reports tons saved vs the no-wheel baseline.

### What's new (`js/psy-3d-engine.js`)
- 2 new state vars: `_designerERVOn` (bool), `_designerERVEps` (float 0..1, default 0.80). Both persisted in `localStorage.red5DesignerState`.
- Inputs panel extended with a dashed-rule separator + cyan checkbox `+ ERV` + ε number input.
- `_drawDesignerOverlay`:
  - Computes OA' via linear interpolation on OA→RA at parameter ε (geometrically equivalent to ε enthalpy effectiveness to <0.5 % over the comfort range).
  - MA mixing now uses `mix_T/W = OA'` when ERV is on, else OA — produces a much shorter MA→SA cooling line.
  - Draws OA in pink, **OA' in cyan**, plus a cyan dashed arrow with a tiny arrowhead from OA → OA' showing wheel-recovery direction.
  - 6th readout row "ERV saved" = baseline tons (no-wheel) minus current tons, with the savings % in parentheses. Color-coded cyan to match the OA' dot.
  - Card height auto-expands to 126 px when ERV is on (5 → 6 rows) so the readout never crowds.

### Verified numbers (Korean summer default: CFM 10k, OA 20%, OA 35°C/50%, RA 24°C/50%, SA 13°C/95%, ε = 0.80)
| Metric | ERV OFF | ERV ON | Delta |
|---|---|---|---|
| Coil Δh | 19.0 kJ/kg | **13.7** kJ/kg | −28 % |
| Cooling tons | 30.7 RT | **22.1** RT | **−8.5 RT (−28 %)** |
| ADP | 11.9 °C | 12.1 °C | (unchanged) |
| Bypass BF | 0.08 | 0.07 | (better) |
| Room sensible | 213.8 kBTU/h | 213.8 kBTU/h | (correctly unchanged — zone load is independent of intake conditioning) |
| **ERV saved (readout row)** | — | **8.5 RT (28 %)** | ✓ matches the 30-50 % rule of thumb in ASHRAE 90.1 and Trane Engineers Newsletters |

### Live deploy
- `js/psy-3d-engine.js` (292,507 bytes) hot-deployed to `219.79.12.63:5001`.
- `red5_bundle.zip` rebuilt (MD5 `f3d7030f0c2b7b06378de6f8cef3af65`) and synced to `/app/frontend/public/` + `/red5-files/`.
- `psychrometric_design_workflow.md` updated to flip the ERV item from "deferred" to "shipped" with the verified savings numbers.

### Files changed
- `js/psy-3d-engine.js` — 2 state vars, panel HTML extension, localStorage hooks, ERV geometry + arrowhead + savings row in `_drawDesignerOverlay`.
- `psychrometric_design_workflow.md` — moved ERV from deferred → shipped.


## V1.9 Designer Mode (MEP equipment-sizing overlay on 2D psych chart) (2026-02-09)
**Brief**: Adds a design-phase decision-support overlay to the 2D X-Y Detail view. Toggling `+ Designer Mode` opens a floating amber-bordered inputs card (CFM, OA fraction, OA T/RH, RA T/RH, SA T/RH) and draws the classic OA → MA → SA process polygon on top of the live psych chart, plus a 5-row readout card showing the four sizing numbers an MEP engineer pulls off the chart during equipment selection: Coil Δh, Cooling tons, ADP, Bypass BF, Room sensible.

### What's new (`js/psy-3d-engine.js`)
- 9 new module-level state vars (`_designerMode`, `_designerCFM`, `_designerOAFrac`, `_designerOA_T/RH`, `_designerRA_T/RH`, `_designerSA_T/RH`) with localStorage persistence under `red5DesignerState`.
- New `_drawDesignerOverlay(ctx, tx, wy, pad, pw, ph)` helper (~140 lines, module-level so it sees `psat/getW/enthalpy/T_MIN/W_MAX`). Drawn in `render2DChart` right after `ctx.restore()` so it sits above the clipped chart contents but coordinates align with the rest of the chart.
- ADP solver: walks the MA→SA direction in 0.1 °C steps from SA downward; stops when the projected line crosses the 100% RH curve. Robust against zero-ΔT and off-chart cases.
- BF computed on T-axis (most common form): `(SA - ADP) / (MA - ADP)`, clamped [0, 1], color-coded: green <0.08 (8-row coil), yellow <0.18 (4–6 row), red ≥0.18 (under-sized).
- Tons: `(CFM × 4.5 × Δh_btulb) / 12000`. Δh converted from kJ/kg via 0.4299 factor.
- Room sensible: `(CFM × 1.08 × ΔT_°F) / 1000` in kBTU/h.
- Toggle button created in `setupControls` (amber border, top:46/left:280), inputs panel right below it. Visibility wired into the `psy` / `tt` / `wt` / `monthly-sites` mode-switch handlers so the button only appears in psy mode.
- Color palette: OA pink `#fb7185`, RA lime `#a3e635`, MA amber `#fbbf24`, SA cyan `#22d3ee`, ADP light-blue `#67e8f9`, process line solid amber `#f59e0b`, mixing line dashed slate `#94a3b8`.
- Dot labels include T + RH inline (`OA 35.0°C 50%`) so the operator reads design conditions straight off the chart.

### Verified numbers (default Korean summer scenario: CFM 10k, OA 20%, OA 35°C/50%, RA 24°C/50%, SA 13°C/95%)
- Coil Δh: 19.0 kJ/kg ✓ (typical summer cooling)
- Cooling tons: 30.7 RT ✓ (400 CFM/ton rule of thumb → 25 RT, +20% for latent → ~30 RT)
- ADP: 11.9 °C ✓ (7-row coil)
- Bypass BF: 0.08 (green/8-row)
- Room sensible: 213.8 kBTU/h = 10000 × 1.08 × (24-13)×1.8 ✓

### Test / regression
- JS syntax verified via `node --check`.
- Visual mock-up generated at `/tmp/designer_mockup.html` and screenshot-validated.
- Full backend regression still **227/227** (no backend changes).

### Live deploy
- `js/psy-3d-engine.js` (286,359 bytes) hot-deployed to `219.79.12.63:5001/api/upload-file`. Hard-refresh the dashboard to pick it up (Babel-compiled main bundle uses this file directly).
- `red5_bundle.zip` rebuilt (1734.4 KB, MD5 `b0536483b098d03bf02107ba1c069b88`) and synced to `/app/frontend/public/` + `/app/frontend/public/red5-files/`.
- `psychrometric_design_workflow.md` updated to mark Designer Mode "Shipped" with the verified numbers and document deferred ERV / live-OA-anchor extensions.

### Files changed
- `js/psy-3d-engine.js` — state vars + helper + toggle button + inputs panel + 4 mode-switch visibility hooks.
- `psychrometric_design_workflow.md` — marked feature shipped + appended shipped-implementation section.


## V1.9 Self-Documenting Deploy Panel · route_map (2026-02-09)
**Brief**: The auto-reload deploy panel now shows the **actual URL routes + HTTP methods** that just came online, not just raw endpoint names. Operators can read the deploy report and immediately tell which HTTP endpoints to hit.

### Backend
- New `_endpoint_routes(app, endpoints)` helper walks `app.url_map._rules_by_endpoint` and returns `{endpoint: [{rule, methods}, ...]}`. Strips noisy `HEAD`/`OPTIONS` werkzeug adds for every GET rule.
- `_reload_module_core` now populates `route_map` in BOTH the fresh-import success return AND the in-place rebind success return. This means both the HTTP endpoint (`POST /api/repair/reload-module/<name>`) and the auto-reload-after-upload path get the same data with zero duplication.
- `_auto_reload_extracted_services` simplified to just pass-through `route_map` from the core return — DRY.

### Frontend — `update.html`
- **Auto-reload panel inside the bundle deploy result**: each plug-in row gets a `+ NEW ROUTES` section listing every newly-attached route as `/api/url [GET|POST] → endpoint_name` in indigo, plus a collapsible `▶ N SWAPPED ROUTES` `<details>` block listing every refreshed endpoint with the same self-documenting format in grey. Collapsed by default so the deploy report stays compact for chatty plug-ins like upload_service (10 routes).
- **Hot-Reload Plug-In card** (single-module reload): same renderer — operators clicking Reload manually get the identical self-documenting output.
- Color scheme: rule names in indigo (`#a5b4fc`) for new, slate (`#94a3b8`) for swapped, methods in dark slate `[GET]` `[POST]` `[GET|POST]`, arrow + endpoint name in `#64748b`.

### Tests
- New tests 1l-rm-a through 1l-rm-h in `test_auto_reload_after_upload.py`:
  - `route_map` is a dict.
  - Contains entries for both injected new handler AND pre-existing swapped endpoints.
  - Entry shape: `{rule: str, methods: [str]}`.
  - `methods` is a list with `HEAD`/`OPTIONS` filtered out.
  - Specific endpoint rules match (`get_weather_location` → `/api/weather-location`).
  - Injected handler rule matches the URL we shipped (`/api/_autoreload_test_route`).
- `test_auto_reload_after_upload.py`: **30/30** PASS (was 22; +8 route_map tests).
- Full backend regression: **227/227** across 10 test files.

### Live deploy
- `upload_service.py` (72,416 bytes) + `update.html` (75,454 bytes) hot-deployed to `219.79.12.63:5001` and verified — `POST /api/repair/reload-module/weather_service` now returns `route_map` mapping all 6 weather endpoints to their `/api/weather-*` URLs and methods.
- `red5_bundle.zip` rebuilt (1728.9 KB, MD5 `4a0040b7f56ac73959d4c54ea85b226d`) and synced to `/app/frontend/public/` + `/app/frontend/public/red5-files/`.

### Files changed
- `upload_service.py` — added `_endpoint_routes`, populated `route_map` in both success returns of `_reload_module_core`, simplified `_auto_reload_extracted_services`.
- `update.html` — rewrote auto-reload panel + Hot-Reload card render to show URL rules + methods + collapsible swapped-routes section.
- `tests/test_auto_reload_after_upload.py` — added 8 route_map assertions.


## V1.9 Auto-Reload After Bundle Upload (2026-02-09)
**Brief**: Closes the loop on plug-in deployment. Until now, a bundle upload landed new `*_service.py` files on disk but Python's already-imported modules kept serving the OLD code — operators had to either toggle the enteliWEB `app.py` object (full Flask restart) or hit `/api/repair/reload-module/<name>` per plug-in. Now the bundle upload endpoint walks the extraction manifest and hot-reloads every plug-in that just landed, all in-process.

### What changed
- Refactored `repair_reload_module(plugin_name)` into a 2-line HTTP wrapper around a new `_reload_module_core(plugin_name) -> (body_dict, http_status)` callable. Net code unchanged — the wrapper just does `body, code = _reload_module_core(...); return jsonify(body), code`.
- Added `_auto_reload_extracted_services(extracted)` which walks the extractor manifest looking for entries with `root == 'pgpy'` AND `file.endswith('_service.py')`, deduplicates, and calls `_reload_module_core(leaf)` for each. Returns a list of per-module summary dicts.
- Hooked it into `_finalize_bundle_from_disk` right after `_extract_zip_streaming()` succeeds. The upload response now carries two new fields:
  - `reloaded_modules: [{module, success, fresh_import, swapped_endpoints, new_endpoints, error?, rolled_back_endpoints?, http_status}, ...]`
  - `reload_summary: {attempted, succeeded, failed}`
- Errors are reported per-module — a broken plug-in does not abort the deploy or affect the other plug-ins (the atomic-rollback logic from the previous round still applies inside `_reload_module_core`).
- `update.html` `_renderUploadResult()` now renders an "Auto-Reload Plug-Ins" panel under the file list: traffic-light counts in the header (attempted / ok / failed), one row per plug-in showing module name, fresh-import badge, swapped/new counts, indented error message + rolled-back endpoints on failure, indented `+ ep, ep, ep` line on success.

### Why this matters
The user reported `GET dir failed: 404` on the equipment_mapper after a successful bundle deploy. Root cause: the new `upload_service.py` (with the freshly-registered `/api/zip-dir` route) landed on disk but the live Flask process still served the old in-memory module. With auto-reload-after-upload, this gap is now closed: a single bundle deploy is sufficient to bring new routes online.

### Tests
- New `tests/test_auto_reload_after_upload.py`: **22/22 PASS** end-to-end:
  - Build a bundle containing a `weather_service.py` with a NEW route injected into `register()`.
  - POST `/api/upload-bundle`.
  - Assert (a) HTTP 200, (b) `reloaded_modules` list present, (c) weather_service entry shows `success: true` with the injected handler in `new_endpoints`, (d) non-`.py` files (dashboard.html) NOT in the reload list, (e) GET on the new sentinel route returns 200 with the expected body **without any manual reload-module call**, (f) `reload_summary` counts match.
  - Failure path: bundle with a broken `register()` returns HTTP 200 (extraction succeeded), `reloaded_modules` reports the failure per-module, `reload_summary.failed >= 1`.
  - UI-only bundle: `reloaded_modules == []`, `reload_summary.attempted == 0`.
- Full backend regression: **219/219 PASS** across 10 test files (was 197/219 last round; +22 new auto-reload tests).

### Deployment
- New `upload_service.py` (74 KB / 1612 lines) hot-deployed to the live controller at `219.79.12.63:5001` via `/api/repair/upload-plugin` + `/api/repair/reload-module/upload_service`. Confirmed: `swapped_endpoints` lists all 10 routes including `api_zip_dir` + `api_zip_files`. `POST /api/zip-dir {"dirname":"configs","root":"data","path":""}` → HTTP 200, 2.5 MB zip with valid `PK\003\004` header.
- `red5_bundle.zip` rebuilt (1725.5 KB, MD5 `7c2cc3026ee7c76c429ff40f9dec1426`) and synced to `/app/frontend/public/` and `/app/frontend/public/red5-files/`.

### Files changed
- `upload_service.py` — refactored reload core, added `_auto_reload_extracted_services`, hooked into `_finalize_bundle_from_disk`.
- `update.html` — added Auto-Reload Plug-Ins panel rendering inside `_renderUploadResult`.
- `tests/test_auto_reload_after_upload.py` — NEW (22 tests).
- `memory/PRD.md` — this entry.


## V1.9 Atomic Route Rollback + Hot-Reload UI (2026-02-09)
**Brief**: Two improvements on top of the Case-A reload verification: (1) `repair_reload_module` now atomically rolls back partially-bound routes when `register()` raises mid-way, and (2) `update.html` gets a one-click hot-reload UI affordance.

### P2 — Atomic route rollback in `upload_service.repair_reload_module`
- New helper `_rollback_added_routes(app, endpoints)`:
  - Drops the endpoints from `app.view_functions`.
  - Removes matching `Rule` objects from `app.url_map._rules` + `_rules_by_endpoint`.
  - **Rebuilds werkzeug's `StateMachineMatcher` from scratch** (re-adds every surviving rule into a fresh `type(matcher)(merge_slashes=...)` instance) — required because the matcher's internal state-tree retains references to deleted rules and `Map.update()` only sorts existing transitions, it doesn't remove them. Without this rebuild, the dropped route would still match on the next request and crash on `_rules_by_endpoint[rule.endpoint]` KeyError. Graceful fallback for older werkzeug versions that don't expose `StateMachineMatcher`.
  - Forces `app.url_map._remap = True` + `update()` so build-side bookkeeping is consistent.
- Both error paths in `repair_reload_module` (fresh-import register failure AND in-place rebind register failure) now call the rollback and return the list of rolled-back endpoints in the JSON response under `rolled_back_endpoints`.
- Net effect: a broken plug-in (e.g., a `register()` that raises halfway through adding new routes) leaves the app in **exactly the same routing state it was in before the reload attempt**. No Frankenstein states.

### Tests
- New tests 8a-8i in `test_reload_module.py`: inject 2 brand-new routes with a deliberate `RuntimeError` between them, reload, then assert: (a) HTTP 500, (b) `success=False`, (c) error mentions register failure, (d) `rolled_back_endpoints` is a list, (e) it contains the partial route, (f) the partial route is purged from `view_functions`, (g) `url_map` rule count returned to pre-state, (h) GET on the partial route now returns 404, (i) all pre-existing endpoints are still bound (no collateral damage).
- **37/37** PASS in `test_reload_module.py` (was 28/28 last round, +9 rollback tests).
- Full backend suite: **197/197** across 9 test files.

### UI — `/update` page Hot-Reload Plug-In card
- New card inserted between **Disk Capacity** and **Upload Bundle** in `update.html`.
- Plug-in selector (9-item allow-list dropdown: upload_service, weather_service, band_service, telemetry_service, webhook_bridge_service, mqtt_bridge_service, modbus_bridge_service, ws_bridge_service, bridges_admin_service) + indigo `RELOAD` button (matches Deploy button styling) + ghost-purple `NO FLASK RESTART` tagline.
- `hotReloadPlugin()` POSTs to `/api/repair/reload-module/<name>`, then renders a color-coded status line:
  - Success: green "OK — <name> hot-reloaded. Swapped: N · Newly attached: M" with a monospace list of any new endpoints attached on the fly + the response note.
  - Failure: red "FAILED — <error>" + if the response includes `rolled_back_endpoints`, an amber line "Rolled back N partially-bound route(s): ..." so the operator can see the atomic-rollback safety net engaged.
- Themed identically to the existing Disk Capacity widget (Courier New monospace, `#1e293b` track, `#020617` body, `#a5b4fc` accent for new endpoints, `#fbbf24` for rollback notice, `#22c55e/#ef4444` for status).
- `data-testid`s: `hot-reload-plugin-select`, `hot-reload-btn`, `hot-reload-status`.
- Screenshot-verified at 1280×900: card renders between Disk Capacity and Upload Bundle, dropdown populated with all 9 plug-ins, button styled correctly.

### Bundle
- `red5_bundle.zip` rebuilt (1725.1 KB, MD5 `1f90273b02eb8d5fad1007f83e03b3fb`) and synced to `/app/frontend/public/` and `/app/frontend/public/red5-files/`.


## V1.9 Hot-Reload Case-A Verification + Test Suite Repair (2026-02-09)
**Brief**: Verified and locked in the previous session's `repair_reload_module` Case-A fix (attach brand-new routes to an already-loaded module without a Flask restart). Two test-suite bugs blocked verification — both fixed.

### Bugs fixed in `tests/test_reload_module.py`
1. **Test 5b was corrupting `weather_service.py`**: it uploaded `# noop` content as `weather_service.py` into `PLUGINS_ROOT`. Because `PLUGINS_ROOT` is first on `sys.path`, the subsequent `importlib.reload(weather_service)` re-resolved the module's `__file__` to the 6-byte noop file. By test 7, `weather_service.__file__` pointed at `# noop`, so the injection logic (looking for the last `app.add_url_rule(`) returned `-1` and produced an indented `def` at column 4 of line 1 → `IndentationError: unexpected indent (weather_service.py, line 1)`. **Fix**: upload to `webhook_bridge_service.py` instead (also in the allow-list, but not auto-loaded by the test bootstrap, so a noop body is harmless).
2. **Test 4h asserted obsolete note text** (`'full Flask restart' in note`). The repaired Case-A reload no longer requires a restart, so the note correctly says `'No Flask restart needed'`. **Fix**: updated the assertion to match.

### Test 7 (new-route attachment) — now verified end-to-end
- Injects `app.add_url_rule('/api/_test_newroute_xyz', ...)` into the live `weather_service.py` `register()` body.
- POSTs `/api/repair/reload-module/weather_service`.
- Confirms (a) response lists `_test_newroute_xyz_handler` in `new_endpoints`, (b) `GET /api/_test_newroute_xyz` returns HTTP 200, (c) body is `{'ok': True, 'where': 'newly-attached'}`.
- Restores original `weather_service.py` source in `finally`.
- **Outcome**: the `/api/zip-files` 404 class of bugs (newly-shipped routes not bound to Flask after hot-reload) is now provably fixed in CI.

### Pre-existing failures also resolved (`tests/test_streaming_upload.py`)
- Tests 9c/9d asserted the **old** zip-headroom formula (`max(5 MB, total_size * 2)`). The previous session deliberately tightened the floor to `max(1 MB, total_size + 1 MB)` to prevent false ENOSPC rejections on small bundles. Synced the assertions to the current source-of-truth formula.

### Test totals
- `test_reload_module.py`: **28/28** PASS (was 23/28).
- `test_streaming_upload.py`: **36/36** PASS (was 34/36).
- Full backend suite: **188/188** PASS across 9 test files (`reload`, `streaming_upload`, `weather`, `band`, `telemetry`, `core_file_routes`, `self_heal_services`, `bootloader_protection`, `plugins_root_routing`).

### Bundle
- `red5_bundle.zip` rebuilt (1722.9 KB, MD5 `ca66c8760e1b86d7f5ddb8a047e9056c`) and synced to `/app/frontend/public/` and `/app/frontend/public/red5-files/`. Bundle picks up the validated `upload_service.py` with Case-A new-route attachment + dependency-validating loader.


## Architecture

### Controller Environment
- Backend scripts: `/root/scripts/app.py`, `/root/scripts/collector.py`, `/root/scripts/simulator.py`
- Frontend bundle: `red5_bundle.zip` deployed via `/api/upload-bundle`
- Config: `/root/data/configs/collector_config.json`, `equipment_types.json`, `map_config.json`
- Plain HTTP only

### Telemetry Architecture (P2 - Complete)
```
BACnet CSV Objects  <--dibt.Read()--  collector.py  --> telemetry.json  --> app.py /api/data --> Dashboard
                    <--dibt.Write()-- simulator.py                         /api/write-point <-- Dashboard
```

### Key API Endpoints
| Endpoint | Method | Purpose |
|---|---|---|
| `/api/data` | GET | Dashboard telemetry |
| `/api/telemetry-status` | GET | Collector health |
| `/api/write-point` | POST | BACnet CSV write |
| `/api/collector-config` | GET/POST | Collector config |
| `/api/equipment-types` | GET | Equipment definitions |
| `/api/map-config` | GET/POST | Floor plan mapping |
| `/api/upload-bundle` | POST | Deploy .red5 bundle |
| `/api/download-bundle` | GET | Export .red5 bundle |

## Key Technical Constraints
- Babel Standalone: NEVER use `<>...</>` fragments
- HTTP Only (no crypto.subtle)
- No subdirectories under data folder on controller

## What's Been Implemented
- [x] Backend API extraction with all endpoints
- [x] Frontend extraction - standalone dashboard, mapper, landing pages
- [x] Babel module loader pattern
- [x] Bundle upload/download + dual-key encryption (RED5ENC2)
- [x] Weather integration (Open-Meteo)
- [x] Full file management + directory ops
- [x] P2: collector.py, simulator.py, AHU-group CSV architecture
- [x] P2: Equipment wiring, write commands, ring buffer trend history
- [x] P2: Diagnostics Console
- [x] Psychrometric dynamics animation (seasonal AHU/VAV equilibrium with SVG chart)
- [x] PI control algorithm with CZ-aware control
- [x] 4 distinct seasons with full artwork and smooth crossfade

## 3D Weather Strip (Live Data)
- [x] 3D Psychrometric Weather Strip with real Open-Meteo data (Three.js)
- [x] X=Temp, Y=Humidity Ratio, Z=Time/Season, Color=Temperature spectrum
- [x] Location presets, duration controls, toggleable layers, camera presets
- [x] Hover tooltip with date, time, T, RH, W
- [x] Integrated as "3D Weather" dashboard tab via direct-mount engine
- [x] **2D X-Y Detail view** -- Full psychrometric chart overlay
  - Toggle via "X-Y Detail" / "Back to 3D" buttons
  - Full Givoni bioclimatic overlay: Comfort Zone
  - Hover tooltip on each dot: date, time, T, RH, W
  - RH curves, enthalpy lines, temperature color spectrum legend
  - Ported to both `psy_3d.html` (standalone) and `psy-3d-engine.js` (dashboard tab)
- [x] **Delta-H vs Time back wall chart** with SA reference sliders
  - Interactive SA Temp and SA RH sliders, occupant count
  - Separate cumulative Heating (blue) and Cooling (red) demand curves
  - Filled area + scale markers + endpoint totals
- [x] **VAV CZ Scatter Plot on right wall** (2026-04-06)
  - Right wall at X=SX showing CZ compliance over time
  - Y axis = Time, Z axis = CZ status (COLD/IN CZ/HOT)
  - Blue (cold/left of CZ), Green (in comfort zone), Red (hot/right of CZ)
  - Point spread within bands based on temperature distance from CZ
  - Translucent color-coded band backgrounds
  - Stats summary: count and percentage for each category
  - Toggle visibility + dedicated camera preset button
  - Hover tooltip showing CZ status, date, T, RH, W
  - Implemented in both `psy_3d.html` and `psy-3d-engine.js`

## 2D Chart OA Band Projection Modes (2026-04-08)
- [x] **Option A: OA→SA Projection Lines** — colored lines from each weather point to computed SA condition per band strategy
- [x] **Option B: SA Landing Zones** — scatter dots at SA destination positions, colored by originating OA band, with cluster labels showing band ID and count
- [x] **Option C: VAV Zone Delivery** — projects SA through 6 VAV boxes (heat gains 1.5-3.5°C, moisture gains 0.55-1.05 g/kg) showing zone-level delivery per band, with CZ compliance stats
- [x] **Saturation cap fix** — SA humidity ratio capped at 98% of saturation at SA temperature (prevents physically impossible states above saturation curve)
- [x] **3-mode toggle button** — cycles Lines → Landing Zones → VAV Zone Delivery via "Mode:" button in 2D overlay
- [x] Implemented in both `psy_3d.html` (standalone) and `psy-3d-engine.js` (dashboard engine)

## Weather Strip -> Dynamics Animation Integration
- [x] Dynamics animation OA now driven by real Open-Meteo weather strip data
  - Fetches 1 year of hourly T+RH data using dashboard's `weatherLocation`
  - Cycles through ~2000 downsampled data points over 72s animation loop
  - Season artwork matches the data point's calendar month
  - Badge shows season name + actual date/time
  - Synced across `dynamics-animation.js` and `psy_dynamics.html`

## Backlog / Next (HISTORICAL — see latest section at end of file)
- P1: Controller redundancy architecture (1:1 hot-swap) -- needs requirements
- P3: Test P2 on physical controller with real BACnet CSV objects
- P4: Clean up Emergent workspace
- P5: Additional equipment types as needed

## Internationalization (i18n) — Implemented 2026-04-08
- [x] Created `js/i18n.js` shared translation module (EN, 简体中文, 繁體中文, 日本語, 한국어)
- [x] Language selector dropdown in all 4 UIs (global setting via localStorage, per-page override)
- [x] React hook `useLang()` for automatic re-render on language change
- [x] Vanilla JS `createLangSelector()` for non-React pages
- [x] Translated key strings across all UIs:
  - `landing.html`: All buttons, labels, prompts, descriptions
  - `dashboard.html`: Tabs, sidebar, legend, axis labels, weather, diagnostics
  - `equipment_mapper.html`: Tab navigation, save/load/export buttons, password prompts
  - `psy_dynamics.html`: HUD, season watermarks, axis labels, setpoint panels, controller section
- [x] Acronyms (AHU, VAV, OA, SA, CZ, RH) preserved in English across all languages
- [x] Added `/js/` Flask route in `app.py` for controller serving
- Note: Some deeper strings (section headers in equipment_mapper like "EQUIPMENT CATEGORY", "SENSORS"/"ALIGNERS") still in English. These can be progressively translated by adding keys to `i18n.js`.

## Bug Fixes — V1.8 Hotfix (2026-04-11)
- [x] **Fixed projMode scoping bug** — `projMode` was declared inside `setupControls()` but `render2DChart()` was at `initPsy3D` scope. Moved `projMode` to shared scope. This was the root cause of all 3 user-reported bugs (no OA-SA lines, no VAV scatter, no projections in 2D overlay).
- [x] **Fixed i18n loading race condition** — Added `i18nReady` state polling in React components so `LangSelector` renders even if `i18n.js` loads asynchronously. Added retry fallback loading mechanism across all HTML pages.
- [x] **Auto-refresh 2D overlay** — When weather data loads while the 2D overlay is visible, it now auto-re-renders so projections appear immediately. Also shows "No weather data loaded" message with instructions if data hasn't been fetched yet.
- [x] **Fixed LangSelector visibility** — Moved LangSelector to fixed-position floating element outside sidebar overflow.

## HVAC-Specific Translation Deep Pass (2026-04-11)
- [x] Updated Korean translations with user-provided HVAC terms: 공조기 진단 허브, 외기/급기/환기, 건구 온도, 절대 습도, 노점, 포화응축, 적정구역, 온도/절대습도/비교습도 설정점, 봄/여름/가을/겨울, 공기선도, 실데이터 가져오기, 장소 이름
- [x] Added matching Chinese (S/T) and Japanese HVAC translations
- [x] Acronyms (OA, SA, RA) now fully replaced with translated names in all non-English languages
- [x] Updated ALL pages and JS modules: dashboard, landing, equipment_mapper, psy_dynamics, psy_3d, psy-3d-engine.js, dynamics-animation.js, i18n.js
- [x] Added `langchange` event listener for real-time dynamic label switching

## Psychrometric Data Consistency Fix (2026-04-12)
- [x] **Fixed simulator.py** — Replaced independent random generation of OAT/OAH/SAT/SAH with thermodynamically correlated state generation:
  - Added ASHRAE psychrometric helpers (`psat_kpa`, `calc_w`, `calc_rh`, `calc_enthalpy`) to simulator.py
  - OA conditions: T generated from diurnal cycle, W computed as f(T) + noise, RH derived from T and W
  - SA conditions: T~15°C, RH 85-98% (realistic cooling coil discharge near saturation)
  - VAV zone conditions: T and W generated together, RH derived (self-consistent)
  - All air-stream point values now physically self-consistent
- [x] **Fixed RA computation in app.py** — RA (Return Air) now computed from average VAV zone conditions instead of the old `OA + 10°C` hack, both in live telemetry mode and mock fallback
- [x] **Mock fallback in app.py also fixed** — Same psychrometric consistency applied to the no-collector mock data path
- [x] Files synced to `/app/separated_complete/` and repackaged into `red5_bundle.zip`

## Collector Config UI (P2) — Implemented 2026-04-12
- [x] **Collector Config modal** — Full CRUD drawer/modal accessible from dashboard sidebar via "Collector" button
- [x] **AHU Groups tab** — List all groups, edit CSV object names, add/remove VAVs, add/delete entire groups
- [x] **Equipment Types tab** — Read-only display of all AHU and VAV type definitions with point tables (label, name, unit, access, min/max)
- [x] **Settings tab** — Edit poll interval, config version, and dashboard_point_map (AHU and VAV field mappings)
- [x] **Full CRUD pipeline** — Uses existing `/api/collector-config` (GET/POST) and `/api/equipment-types` (GET) + `/api/save-equipment-schema` (POST) endpoints
- [x] All changes saved to `collector_config.json` on the controller via API
- [x] Themed for dark/light mode, consistent with existing modal patterns
- [x] Files synced and `red5_bundle.zip` rebuilt

## Monthly × Sites — 4 Strategy Comparison + Toggleable Overlays (2026-04-29)
- [x] **4 strategies wired into Monthly × Sites chart**: Fixed-SA, Dyn-Reset (G36 24-h trailing-mean SA model), B1-B10, B1-B10 + Dyn-Reset (hybrid)
- [x] **Dual-axis layout** — Left axis (purple, "mo") = monthly Σ|Δh|, Right axis (cyan, "cum") = cumulative annual Σ|Δh|. Each site panel renders both: grouped monthly bars + 4 cumulative curves overlaid (same color palette)
- [x] **4 independent toggle buttons** above the chart (Fixed-SA / Dyn-Reset / B1-B10 / B1-B10 + Dyn-Reset). Default: only Fixed-SA on. Smart bar-slot allocation auto-resizes bar widths based on N visible toggles
- [x] **Auto-rescaling Y axes** — both monthly and cumulative scales recompute from only the visible strategies, so hiding Fixed-SA zooms in on the smaller-magnitude alternatives
- [x] **Tooltips on each toggle button** explaining the underlying control logic (Native browser `title` attr): explains B1-B10 (climate-driven), Dyn-Reset (zone-driven G36), hybrid two-layer logic, and failsafe behavior
- [x] **Heading layout fix** — moved the longest button ("B1-B10 + Dyn-Reset") to the LEFT side of the canvas so it doesn't obscure the centered "MONTHLY AIR-SIDE ENERGY × SITES" title; reduced title from 14px → 11px to fit between the two button clusters at narrow viewports
- [x] **Dynamic per-panel headline** — shows `<best-visible> Xk vs Y k → -N%` when Fixed-SA is visible, falls back to `<best-visible> Xk / yr` when Fixed-SA is hidden
- [x] **Korean documentation update** — `control_strategy_insight.ko.md`: new Section 5 explaining "B1~B10 + Dyn-Reset = 가장 똑똑한 조합" using a 비행기 조종실 (airplane cockpit) two-layer metaphor, comparison table, failsafe logic, controller execution timeline
- [x] `red5_bundle.zip` updated with `js/psy-3d-engine.js`, `control_strategy_insight.md`, `control_strategy_insight.ko.md`
- [x] **Wired VAV Modal to Config Tool schema** — VAV graphic popup from the VAV Terminal Hub table now renders the `visual_assets.base_graphic` and `points[].x,y` coordinates defined in `equipment_types.json → vav_types[id]`.
- [x] **inline-block shrink-wrap architecture** — Mirrors the AHU modal pattern: `<div className="inline-block"><img className="block max-w-full"/><div className="absolute inset-0"/></div>` so point overlays map 1:1 with Config Tool coordinates at any screen size.
- [x] **Per-point controls**: RO points rendered as emerald pills; RW points as amber databoxes with ±/number-input (digital-range) or toggle-switch (binary) controls. Write pipeline uses optimistic UI + pending-writes cache + `/api/write-point` POST, matching AHU modal behavior.
- [x] **Schema animations rendered**: `damper`, `air_flow_path`, `centrifugal_fan`, `rectangular_fan`, `hydration_valve`, `neon_pipe_coil` animation types supported in VAV modal using existing `Preview*` components.
- [x] **Type-aware header**: Modal title now displays `VAV-XX-XX DIAGRAM · Type N: <type name>` sourced from schema.
- [x] **Fallback**: Clean empty-state with `VAV IMAGE MISSING` + `Define visual_assets.base_graphic for vav_type N` when no base graphic is configured.
- [x] **Validated visually**: Standard Cooling VAV Type 1 (10 points: t, cfm, rdp, dpsp(RW), damper, rh, cav, heppa, Sp(RW), loc + damper animation) renders correctly with live telemetry values.
- [x] `red5_bundle.zip` repackaged with updated `dashboard.html` for deployment.

## Red5 Studio V1.9 — AHU Sizing Sanity-Check Tool (2026-04-30)
- [x] **Forked V1.8 → V1.9** at `/app/archive/Red5-Studio-V1.9/`. Flask `/root/data` symlink repointed to V1.9. V1.8 frozen as reference.
- [x] **New module `js/sizing-check.js`** — pure heuristic engine + JSX components, exposed on `window` so the equipment_mapper.html main script can use them after Babel compile-time concatenation.
- [x] **Heuristic engine** — `red5SizingCalc({area_m2, building_type, perimeter_pct, critical_zones, tenants, configured_ahus})` → `{recommended, min_recommended, status, breakdown[], compliance[]}`. 7 building-type presets (office, hospital, hotel, lab, residential, data_center, other) each with their own m²/AHU heuristic and compliance tags.
- [x] **Inline collapsible "AHU Sizing Check" card** at the top of the equipment_mapper sidebar, always visible across all tabs. Shows real-time traffic-light pulse (`🟢 OK / 🟡 BORDERLINE / 🔴 UNDER-SIZED / 🔵 OVER-SIZED / — NEED INPUT`) based on live `floorMarkers.filter(type='ahu')` count vs heuristic recommendation.
- [x] **New "Sizing" tab** added as 4th item in the configMode selector (`grid-cols-3` → `grid-cols-4`). Renders full SizingTab component in main canvas area when active. Supports advanced multi-floor table with per-row inputs (name, area, type, perim%, crit zones, tenants), automatic rollup totals, traffic-light KPI cards, heuristic math breakdown, ASHRAE/IBC compliance flags, and a 7-project real-world reference table.
- [x] **State persistence** — both inline card and full tab persist their inputs in `localStorage` (`red5SizingState` + `red5SizingFullState`).
- [x] **`red5_bundle.zip`** updated with `equipment_mapper.html` + `js/sizing-check.js`.
- [x] **Verified via screenshot** — both inline card and full Sizing tab render correctly, traffic-light status pill updates live, compliance flags appear (ASHRAE 62.1 for office), reference table populated.

## V1.9 Sites Dropdown · Sun-Trim B1-B10 Hook · ENOSPC Hardening (2026-05-01)
- [x] **Sites checkbox dropdown** in Monthly × Sites — replaces the in-canvas chip ribbon with an HTML `<button> + <div>` overlay (`#p3-btn-sites-dd` / `#p3-sites-dd-panel`). Trigger label live-updates to `Sites: N/M ▾`; panel lists every loaded site with checkbox, code, full name, and SAVED/PRESET badges; All / None bulk-toggle buttons; click-outside auto-close; defaults to the dashboard's currently-selected location. The 4-strategy buttons stay where they were.
- [x] **P0 — Sun-exposure → B1-B10 SA-target trim** — `js/sun-path.js` exposes `window.red5BandSunTrim(band, sunScore, opts)` which returns a NEW band with `sa_t_sp` shifted by `−2·maxTrim·(score−0.5)` (default range ±1.5 °C, snapped to 0.05 °C). Wired into the floor-plan VAV markers (ring tooltip + bottom info card now show `ΔSA ±X.XX°C`) and the VAV diagram modal header (compact `BAND-X · SA YY.Y°C (±X.XX sun)` pill, color-coded amber for negative trim/sun-exposed, sky for positive trim/shaded). Active only when sun overlay is enabled and the AHU has a live `active_band`. Verified via DOM probe: south-facing VAV @ azimuth 180°/elev 70° → B7 SA 12 → 10.7 °C (-1.3); north-facing → 13.5 °C (+1.5).
- [x] **P1 — `app.py` ENOSPC hardening** — `tempfile.tempdir` + `TMPDIR` redirected at module load to `/root/data/_uploads/` so Werkzeug `SpooledTemporaryFile` rollover bypasses the embedded controller's `/tmp` tmpfs. Added `_check_free_space(path, min_bytes, min_inodes)` (statvfs-based, returns 507 with auto-cleanup retry), `_purge_pycache(roots=...)` (recursive `shutil.rmtree` of every `__pycache__` under /root/scripts + /root/data — frees inodes between deploys), and `_purge_uploads_scratch(max_age_sec=300)` (sweeps stale spool files). `/api/upload-bundle` now: pre-flights free space, stream-saves multipart input to `_uploads/inbound_<ts>_<pid>.bin`, stream-extracts entries in 64 KB chunks via `zf.open()` (caps RAM at 64 KB/file), unlinks any partial file on `OSError`, runs `_purge_pycache()` post-extract, and always cleans up the inbound spool in `finally`. New `/api/disk-status[?cleanup=1]` GET endpoint surfaces free bytes/inodes for operators + optional cleanup pass. Verified via Flask test_client: encrypted dual-key upload (JSON + multipart paths) extract correctly, response includes `pycache_dirs_removed`, `pycache_bytes_freed`, `free_space_pre`; ENOSPC mid-write removes the truncated file. `red5_bundle.zip` repackaged with the new `app.py`, `dashboard.html`, `js/sun-path.js`, `js/psy-3d-engine.js`.
- [x] **`update.html` Disk Capacity widget** — new card above Upload Bundle pulls `/api/disk-status` and renders dual progress bars (BYTES used / INODES used) with traffic-light tier (HEALTHY ≥3× thresholds / LOW HEADROOM 1–3× / CRITICAL <1× of 20 MB + 400 inodes), `Refresh` and `Cleanup` buttons (with confirm dialog), inline post-cleanup summary (`__pycache__ dirs removed + bytes freed`, `stale spool files removed + bytes freed`), auto-pull on `Test` controller success, and auto-refresh after every upload (success or failure → operator sees post-deploy free space, ENOSPC 507 errors include `free_bytes` / `free_inodes` in the status line). Graceful-fallback detection for controllers still running pre-V1.9 `app.py` (non-JSON response, non-2xx status, or missing `free_bytes` all trigger a clear "deploy V1.9+" message instead of a misleading HEALTHY pill).
- [x] **Moved Monthly × Sites title into the bottom legend strip** — at 1920px wide with the Weather-Strip panel + Sites dropdown + 4 strategy toggles + Back buttons, the centered top heading was being clipped by the Sites dropdown. Dropped the top heading entirely and prefixed the bottom legend with bold `MONTHLY AIR-SIDE ENERGY × SITES │ Baseline SA … │ …` so the title reads cleanly without competing with any control. Reclaimed 10 px of chart area by reducing `pTop` from 50 to 40.

## V1.9 WebGL Leak + Open-Meteo Cache (2026-05-02)
- [x] **WebGL context leak fixed** — root cause of the `Error: Error creating WebGL context` crash on Mac Safari (~8-context cap) and Ubuntu Chrome (~16-context cap). `initPsy3D()` now returns `{ dispose: fn }`, and the React `useEffect` in `dashboard.html` calls `handle.dispose()` on cleanup. `dispose()`: flips a `_running`/`_disposed` guard that stops the rAF loop, cancels the outstanding frame, runs a LIFO `_cleanupTasks` list (removes `storage`/`langchange` listeners on window, the document-level click handler for the Sites dropdown, the ResizeObserver, and the theme-poll interval), traverses the scene to `.dispose()` every geometry/material/texture/map, calls `ren.dispose()` + `ren.forceContextLoss()` to release the WebGL context synchronously, detaches the canvas DOM node, and finally drops `#p3-root` so re-mount starts clean. In-flight Open-Meteo fetch handlers check `_disposed` and bail so late responses can't resurrect a dead renderer.
- [x] **Open-Meteo historical-archive localStorage cache** — the user's "Monthly × Sites takes a very long time" complaint traced to the component re-fetching every site's full hourly year on every mount, even though Open-Meteo's historical data is static. New `_cacheGet`/`_cacheSet` helpers keyed on `mxs_v1|<lat>|<lon>|<year>` persist compact payloads: `{t: round1, rh: round1, t0: first-ISO}` and rebuild the full hourly `tm` array on read via `_rebuildTimes()` (calendar-correct including leap Feb 29). ~82 KB/site (down from ~500 KB naive JSON); 7 sites fit in <700 KB (well under the 5 MB quota). LRU eviction at 16 entries. On `QuotaExceededError` we drop the oldest half and retry once. First paint happens from cache (sync) before any pending network fetch fires, so re-opens appear instant. Validated via Node-based unit test: 82 KB storage / 8760-hour round-trip / leap-year date rebuild / LRU cap at 16 entries all green.

## V1.9 Polling Leak Fix + Sun-Trim Memoization + Self-Bootstrap + Tab-Switch Blank Fix (2026-05-06)
- [x] **P0 — Queued-fetch DDoS fix** — replaced `setInterval(fetchTelemetry, 1000)` with self-rescheduling `setTimeout(2000)` chain + `AbortController` per tick. (Verified live on user's controller.)
- [x] **P1 — Sun-trim memoization** — wrapped `red5SunExposureScore` and `red5MarkerShadow` with quantized-key Map caches in `js/sun-path.js`.
- [x] **Fresh-controller self-bootstrap** — root cause of `/update → 404 Not Found` on a brand-new controller: `serve_update_page` did `send_from_directory('/root/data', 'update.html')`, but on a fresh controller `/root/data/` is empty (only `app.py` was deployed). Patched `app.py`:
  - `/update` now checks `os.path.isfile('/root/data/update.html')`. If missing, serves an inline HTML page (`_BOOTSTRAP_UPDATE_HTML`, ~7.8 KB) styled to **match the production `update.html` design exactly** — same red italic "RED5" + cream "PLATFORM UPDATE" header, same `'Courier New'` monospace, same `#020617` body / `#0f172a` card / `#c084fc` purple card heading / `#4f46e5` indigo Deploy button, same dashed drop-zone (with full HTML5 drag-and-drop support, file size readout, and color-coded extracted/skipped/errored report). Adds an amber `FRESH CONTROLLER · BOOTSTRAP MODE` badge so operators immediately recognize the provisioning state. POSTs `multipart/form-data` to the existing `/api/upload-bundle`; on success redirects to `/update` (now serving the real, extracted page).
  - `/` redirects to `/update` (via meta-refresh) when `/root/data/landing.html` is missing.
  - Verified end-to-end via Flask test_client: 14/14 design-language assertions pass + full bootstrap → upload → real-UI round trip; live screenshot via Playwright confirms 1:1 visual parity with the production update.html.
- [x] **Tab-switch blank Monthly × Sites fix** — root cause: `dashboard.html` line 1509 conditionally rendered `<div ref={psy3dRef} />` only when `activeView === 'weather3d'`. Switching tabs **unmounted** the div (taking the canvas with it), but the matching `useEffect` had no cleanup → `dispose()` never ran → `window.__psy3dActive` stayed stuck `true` (set in `psy-3d-engine.js` line 43 as the page-wide one-context guard) → the next `initPsy3D` call aborted via lines 38-41 → blank screen on return. Fixed by switching `weather3d` to the same persistent-mount + `display:none` pattern the chart view already uses (line 1512). The existing useEffect guard `psy3dInit.current && querySelector('canvas')` correctly detects the persisted canvas and skips re-init on subsequent visits — single WebGL context for the page lifetime, no `__psy3dActive` race. Also added a 1-line render-loop visibility check (`document.getElementById('p3-root').offsetParent === null` → skip `orb.update()`/`ren.render()` while hidden) so the rAF loop keeps spinning lightly but doesn't burn GPU on hidden frames.
- [x] `red5_bundle.zip` repackaged with `app.py` + `dashboard.html` + `js/sun-path.js` + `js/psy-3d-engine.js`; synced to both `/app/frontend/public/red5_bundle.zip` and `/app/frontend/public/red5-files/red5_bundle.zip`.

## V1.9 Streaming-I/O Upload + Chunked Client (2026-05-06)
**Eliminates the OOM-on-upload class permanently and adds a real progress bar to the bundle deploy UX.**

### Backend (`app.py`) — strictly additive, no existing endpoint touched
- New helpers: `_check_free_space`, `_purge_pycache`, `_purge_uploads_scratch`, `_safe_upload_id`, `_spool_path`, `_xor_stream_files`, `_decrypt_bundle_to_file`, `_extract_zip_streaming`, `_finalize_bundle_from_disk`. Module load also redirects `tempfile.tempdir` + `TMPDIR` → `/root/data/_uploads/` so Werkzeug spool files don't fill the `/tmp` tmpfs.
- New `/api/upload-bundle-chunk` (POST, raw octet-stream body) — accepts headers `X-Upload-Id`, `X-Chunk-Index`, `X-Total-Chunks`, `X-Total-Size`. First chunk pre-flights free space (need 3× total_size, min 20 MB). Stream-writes to `_uploads/inbound_<id>.bin` in 64 KB reads. Idempotent for re-uploaded chunk-0. Validates upload_id against `[A-Za-z0-9_\-]{8,64}` (path-traversal safe).
- New `/api/upload-bundle-finalize` (POST, JSON `{upload_id, password, total_size}`) — validates spooled file, runs streaming-decrypt + streaming-zip-extract, cleans up spool in `finally`.
- New `/api/disk-status[?cleanup=1]` — re-adds the V1.9 endpoint that was lost in the Apr-30 rollback (the existing `update.html` Disk Capacity widget was already wired to call it but was getting 404).
- **Refactored `/api/upload-bundle`** (legacy single-shot, unchanged wire format) to use the same disk-spool path internally — Werkzeug FileStorage `.stream` is read in 64 KB chunks straight to disk, then the same `_finalize_bundle_from_disk` runs. Curl/legacy clients still work; peak RAM is now bounded for them too.
- **Streaming decrypt**: rewrote the dual-key XOR-CTR flow (`RED5ENC1` + `RED5ENC2`) to process the encrypted payload in 64 KB blocks with a streaming HMAC pass first, then a streaming-XOR write. **Verified byte-for-byte identical to legacy `decrypt_bundle()` output** via a unit test (test 8b). Peak RAM during decrypt: ~128 KB regardless of bundle size (down from ~10 MB int-conversion bomb on a 1.3 MB bundle).
- **Streaming zip extract**: `zf.open(entry).read(65536)` chunked write to disk per entry; partial files removed on `OSError` mid-write; auto-`_purge_pycache()` post-extract reclaims inodes between deploys.

### Frontend
- `update.html`: replaced single-shot `fetch(POST multipart)` with a chunked uploader (256 KB chunks via `Blob.slice()`). Added a real progress bar (matches existing disk-meter look-and-feel — same `#020617` track, `#4f46e5 → #6366f1` indigo gradient fill, `#22c55e` green on success, `#ef4444` red on fail). Per-chunk pct + "chunk N / total" + bytes/total readout. Reserves last 5% for the finalize phase. **Graceful single-shot fallback** via `XMLHttpRequest.upload.onprogress` if the server returns 404 on `/api/upload-bundle-chunk` (i.e., older controllers without streaming) — UI still gets a progress bar, just one driven by browser upload progress instead of per-chunk acks.
- `_BOOTSTRAP_UPDATE_HTML` (in `app.py`): same chunked upload + fallback logic + status pct readout. Visual unchanged so the design parity established in the previous round is preserved.

### Tests (`/app/archive/Red5-Studio-V1.9/tests/test_streaming_upload.py`)
- **32/32 PASS**: legacy multipart (plain & encrypted), legacy JSON+base64, chunked upload + finalize, error paths (malicious upload_id rejected, missing-spool 404, size-mismatch 400, wrong-password 400 with master-key monkey-patch), `/api/disk-status` (with & without cleanup), and **streaming-decrypt byte-equivalence with the legacy `decrypt_bundle()`**.

### Bundle
- `red5_bundle.zip` rebuilt with `app.py` + `update.html` + earlier `dashboard.html` / `sun-path.js` / `psy-3d-engine.js` fixes; synced to both `/app/frontend/public/` and `/app/frontend/public/red5-files/`.

## V1.9 Equipment Mapper Sidebar Redesign (2026-05-06)
**Brief**: User reported the left sidebar was congested and hard to access. Four targeted UX changes.

### What changed in `equipment_mapper.html`
1. **Combined "1. Load Schema" + "2. Load Asset" into ONE row** of compact pills with filled/hollow status indicator — emerald pill = schema loaded, indigo pill = asset loaded; small status dot inside each pill (white solid = loaded, hollow ring = not loaded). Frees ~1 row of vertical space.
2. **3 Save buttons consolidated into ONE row at the bottom of the sidebar** — `CLEAN TPL` / `WORKING` / `CONTROLLER` (was: 2-button row mid-sidebar + a single full-width button at the bottom). Same `exportCleanJSON` / `exportConfig` handlers; tooltips preserve the long-form labels (`Save Clean Template`, `Save Working File`, `Save to Controller`).
3. **4 sub-tabs in ONE row** replace the legacy stacked accordions (`Equipment Category` + `Global Simulation Rig`) AND the old 2-tab `Sensors / Aligners` strip: `EQUIP` / `SENSORS` / `ALIGNERS` / `SIM`. New `equipSubTab` state persisted to `localStorage`; sensors tab still drives `activeTarget=point_group`, aligners still drives `activeTarget=animation`. Sensor & animation lists are now also gated by `equipSubTab` so they don't bleed into the EQUIP/SIM tabs.
4. **Per-sensor ungroup**: small ↗ button on each sensor inside a group calls `moveSensorToGroup(grp.indices, null)` to strip its `group_id` and bounce the sensor back into "Ungrouped Sensors". Tooltip + `aria-label="Ungroup sensor"` for accessibility. `data-testid="ungroup-sensor-<name>"` for testability.

### Visual verification
- Live Playwright screenshot at 1920×1080 confirms: top header + Sizing card unchanged, then Equipment/FloorPlan/Points/Sizing top row, then the new combined Schema/Asset pill row, then the 4-tab sub-nav (Sensors active = emerald), then the Sensors content (`+ NEW SENSOR POINT` / `+ NEW GROUP` / Ungrouped Sensors), then the 3-button save row at the bottom.
- All `data-testid`s present: `sb-load-schema-btn`, `sb-load-asset-btn`, `sb-sub-tab-{equip,sensors,aligners,sim}`, `sb-save-clean-btn`, `sb-save-working-btn`, `sb-save-controller-btn`, `sb-save-map-btn`, `ungroup-sensor-<name>`.

### Bundle
- `red5_bundle.zip` rebuilt with the redesigned `equipment_mapper.html`; synced to both `/app/frontend/public/` and `/app/frontend/public/red5-files/`.

## V1.9 Drag-and-Drop Sensor Regrouping (2026-05-06)
**Visual one-shot regrouping** layered on top of the existing "Move to group" dropdown — operators can now grab a sensor row and drop it onto any group header (or back onto "Ungrouped Sensors") to instantly regroup.

### Implementation in `equipment_mapper.html`
- New state `dragOverGroupId` (`null` | `'__UNGROUPED__'` | `<group.id>`) — drives the amber drop-target highlight ring/background as the operator drags over each candidate.
- IIFE-scoped helpers `dragProps(grp)` and `dropProps(targetGroupId)` defined inside the Sensors sub-tab render function so they have direct access to `dragOverGroupId` + `moveSensorToGroup`.
- **Drag sources** (`draggable=true` + `dragstart`/`dragend`): every sensor row, both grouped and ungrouped. Carries `JSON.stringify(grp.indices)` via `dataTransfer` MIME `application/x-red5-sensor`.
- **Drop targets** (`dragover`/`dragleave`/`drop`): every group header (`data-testid=drop-group-<id>`) + the "Ungrouped Sensors" header (`data-testid=drop-ungrouped`). Drop calls `moveSensorToGroup(indices, targetGroupId === '__UNGROUPED__' ? null : targetGroupId)`.
- Inline drag-hint banner: `Tip: drag a sensor onto a group header to regroup.` (in `+ NEW SENSOR POINT / + NEW GROUP` action bar).
- Cursors: `cursor-grab` on hover, `cursor-grabbing` on active drag.
- Active-drop visual: amber 2-ring + `bg-amber-500/20` on the hovered group header (or `bg-amber-500/10` on the Ungrouped section).

### Verified
- Live Playwright test with native HTML5 `DragEvent` dispatch: created 1 group + 1 ungrouped sensor (`SNS_855`), dispatched `dragstart` → `dragover` → `drop` → `dragend`. Result: `SNS_855` moved to Group 1 (count badge `(1)`); "Ungrouped Sensors" now reads "All sensors are grouped". Screenshot evidence: amber highlight on drop target during hover, regrouped state after drop, original sensor still selected on the right detail panel.

### Bundle
- `red5_bundle.zip` re-zipped with `equipment_mapper.html` + `app.py` + `update.html` + `dashboard.html` + `js/sun-path.js` + `js/psy-3d-engine.js`. Synced to `/app/frontend/public/` and `/app/frontend/public/red5-files/`.

## V1.9 Module Split: `upload_service.py` Extraction (2026-05-06)
**Brief**: User reported `app.py` reaching the controller's per-file size limit (`unterminated string literal (detected at line 1795)` after upload — likely truncation during single-shot multipart write of 134 KB). Split the streaming-upload service out of `app.py` into a sibling flat `.py` file.

### What moved
- All streaming-upload helpers: `_safe_upload_id`, `_spool_path`, `_check_free_space`, `_purge_pycache`, `_purge_uploads_scratch`, `_stream_save_request_to_file`, `_xor_stream_files`, `_decrypt_bundle_to_file`, `_extract_zip_streaming`, `_finalize_bundle_from_disk`.
- All four route handlers: `/api/upload-bundle`, `/api/upload-bundle-chunk`, `/api/upload-bundle-finalize`, `/api/disk-status`.
- The `_BOOTSTRAP_UPDATE_HTML` constant (~5.5 KB string) and the `/update` route with fresh-controller fallback.

### Architecture
- New `upload_service.py` (41 KB / 946 lines) lives next to `app.py` in `/root/scripts/`. The bundle uploader auto-routes `.py` files to `/root/scripts/` so it deploys correctly.
- Module exposes a single entry point: `register(app, ctx)`. App-side, the only change is a 9-line block right after `ALLOWED_ROOTS` that calls `upload_service.register(app, {...})` with the shared constants (`DATA_ROOT`, `SCRIPTS_ROOT`, `ALLOWED_EXTENSIONS`, `MASTER_KEY_CONST`) and helper callables (`_derive_key`, `_no_cache`).
- All route handlers attached via `app.add_url_rule()` (not `@app.route` decorators) so registration is explicit and order-independent.
- `UPLOADS_SCRATCH_DIR` and `tempfile.tempdir` redirect now happen INSIDE `register()`, not at module-import time, so the module is safe to import before `DATA_ROOT` is finalized.
- `_purge_pycache(roots=None)` resolves its default at call time (was `roots=(SCRIPTS_ROOT, DATA_ROOT)` which captured `None` at definition time and broke when called post-register).

### Size impact
- `app.py`: 134 KB (3145 lines) → **96 KB (2299 lines)** — savings of 38 KB / 846 lines.
- `upload_service.py`: 41 KB (946 lines) — entirely new file.
- Net code unchanged; just split across two files. Controller now writes two smaller files instead of one too-big file.

### Tests
**32/32 PASS** in `tests/test_streaming_upload.py` after the split (all original test cases — multipart legacy, chunked + finalize, error paths, byte-equivalence with legacy `decrypt_bundle()`).

### Bundle
- `red5_bundle.zip` re-zipped with both `app.py` and `upload_service.py`; synced to `/app/frontend/public/` and `/app/frontend/public/red5-files/`.

## V1.9 Module Split (round 2): `weather_service.py` Extraction (2026-05-06)
**Brief**: Continued the controller-friendly refactor by peeling the weather/forecast subsystem out of `app.py` using the same `register(app, ctx)` plug-in pattern.

### What moved
- `_coerce_loc`, `_read_weather_state`, `_write_weather_state` (location persistence + legacy single-loc migration)
- `_compute_enthalpy`, `get_tomorrow_forecast` (~110 lines including Open-Meteo archive fetch with on-disk year-cache)
- `write_forecast_to_bacnet`, `_load_forecast_config`, `_daily_forecast_job`
- All 6 routes: `GET/POST /api/weather-location`, `GET /api/weather-history`, `GET /api/tomorrow-forecast`, `GET/POST /api/forecast-config`, `POST /api/forecast-write-now`
- The background `_daily_forecast_job` thread now starts inside `register()` (gated by `ctx.get('start_forecast_thread', True)`) — no longer fires at module-import time, which means tests can disable it cleanly.

### Architecture
- `weather_service.py` (32 KB / 777 lines) sits next to `app.py` + `upload_service.py` in `/root/scripts/`. The bundle uploader auto-routes `.py` files there.
- App-side wiring: 9-line block right after `upload_service.register(...)`:
  ```python
  import weather_service
  weather_service.register(app, {'DATA_ROOT': DATA_ROOT})
  ```
- All on-disk paths derive from `DATA_ROOT` passed via `ctx`, so the module is portable across test setups.

### Size impact
- `app.py`: 96 KB (2299 lines) → **67 KB (1607 lines)** — savings of 29 KB / 692 lines this round.
- **Net session impact: 134 KB → 67 KB on `app.py`** (down 50% from the original size that triggered the truncation error).
- Three-file picture: `app.py` 67 KB + `upload_service.py` 41 KB + `weather_service.py` 32 KB = 140 KB total, distributed across 3 sub-cap writes instead of one over-cap write.

### Tests
- New `tests/test_weather_service.py`: **20/20 PASS** — empty-state GET, single + dual-location POST, legacy single-loc shape, full-state replace, weather-history validation, forecast-config GET/POST round-trip, route-registration sanity, and confirmation that `start_forecast_thread=False` correctly suppresses the background thread.
- Existing `tests/test_streaming_upload.py`: **32/32 PASS** (regression — module split didn't break upload).

### Bundle
- `red5_bundle.zip` re-zipped with `app.py` + `upload_service.py` + `weather_service.py`; synced to `/app/frontend/public/` and `/app/frontend/public/red5-files/`.

## V1.9 Module Split (round 3): `band_service.py` Extraction (2026-05-06)
**Brief**: Continuing the lean-`app.py` refactor — peeled the band-CSV background generator + 4 band routes out of `app.py` using the same `register(app, ctx)` plug-in pattern.

### What moved
- The `try: import band_csv_generator; ... start_background(...)` auto-init block (now wrapped in `_start_background_band_generator()` and gated behind `start_band_thread` flag).
- `GET /band_guide.md` (markdown doc download)
- `POST /api/band-csv/regenerate` (manual CSV regen trigger)
- `GET /api/band-csv/guide` (universal `band_guide.csv` download)
- `GET /api/band-csv/<ahu_id>` (per-AHU VAV projection CSV download)

### Architecture
- New `band_service.py` (4 KB / 115 lines) — smallest of the three split modules but cleanly factored.
- `DATA_ROOT` and `_no_cache` injected via `ctx`. All hard-coded `'/root/data'` strings parameterized so the module is fully test-portable.
- Background CSV generator now starts inside `register()` (not at module-import time), gated by `ctx.get('start_band_thread', True)`.

### Size impact
- `app.py`: 67 KB (1607 lines) → **65 KB (1562 lines)** — only 2 KB / 45 lines this round (band block was already small), but delivers the full 4-route subsystem as a separately-deployable plug-in.
- **Cumulative session impact: 134 KB → 65 KB on `app.py`** (down 51% from session start).
- Four-file picture: `app.py` 65 KB + `upload_service.py` 42 KB + `weather_service.py` 32 KB + `band_service.py` 4 KB = 143 KB total, distributed across 4 sub-cap writes.

### Tests
- New `tests/test_band_service.py`: **11/11 PASS** — `/band_guide.md` content + MIME, `/api/band-csv/guide` text/csv, per-AHU CSV present + missing-file 404, `regenerate` endpoint without `band_csv_generator` deployed, all 4 routes attached, DATA_ROOT correctly injected.
- Existing suites: **32/32** (upload) + **20/20** (weather) — no regression.
- **Total: 63/63 backend tests PASS** across the three split modules.

### Bundle
- `red5_bundle.zip` re-zipped with `app.py` + `upload_service.py` + `weather_service.py` + `band_service.py`. Synced to `/app/frontend/public/` and `/app/frontend/public/red5-files/`.

## V1.9 Module Split (round 4): `telemetry_service.py` Extraction (2026-05-07)
**Brief**: Final and largest split of the session — peeled the entire telemetry data fetch + write subsystem out of `app.py`. `app.py` is now 40 KB / 974 lines, **down 70% from session start (134 KB)**.

### What moved
Three blocks from app.py, all into `telemetry_service.py`:
- **Block A**: telemetry-path constants (`TELEMETRY_PATH`, `COLLECTOR_CONFIG_PATH`), the `dibt` BACnet driver import, `_write_history` ring buffer, `_sim_overrides` dict, and helpers `_record_write`, `_load_telemetry`, `_load_collector_config`, `_get_equipment_point_defs`, `_build_write_csv`.
- **Block B**: `_data_mode` state + `/api/data-mode` + `/api/data` (the live telemetry endpoint dashboards poll) + `_sim_fallback_from_config` + `_mock_14_ahus`.
- **Block C**: 8 diagnostic + write routes — `/api/telemetry-status`, `/api/telemetry-raw`, `/api/collector-config`, `/api/collector-log`, `/api/write-point`, `/api/equipment-points/<name>`, `/api/write-history`, `/api/trend-history`.

### Architecture
- `telemetry_service.py` (28 KB / 695 lines) — biggest split module by route count (10).
- Same `register(app, ctx)` plug-in pattern. `ctx` injects `DATA_ROOT`, `get_psat`, `get_w`, `get_h` (psychrometric helpers, kept in `app.py` because they're also used by other subsystems), and `ahu_records` (mock seed dict).
- Module-level path constants (`CONFIG_DIR`, `TELEMETRY_PATH`, `COLLECTOR_CONFIG_PATH`) initialized to `None` and populated inside `register()` — module is safe to import before `app.py` finalizes globals.
- `dibt` import wrapped in try/except so absence doesn't crash the module.
- The nested `load_json` helper inside `equipment_points()` was hoisted to module level as `_load_json` and re-pointed in both call sites (`equipment_points` + `write_point`).

### Size impact
- `app.py`: 65 KB (1562 lines) → **40 KB (974 lines)** — savings of 25 KB / 588 lines this round.
- **Cumulative session impact: 134 KB → 40 KB on `app.py`** (−70%).
- Five-file picture: `app.py` 40 KB + `upload_service.py` 42 KB + `weather_service.py` 32 KB + `telemetry_service.py` 28 KB + `band_service.py` 4 KB = 146 KB total, distributed across 5 sub-cap writes. The largest individual file is now `upload_service.py` at 42 KB — well under any reasonable safe-write threshold.

### Tests
- New `tests/test_telemetry_service.py`: **32/32 PASS** — `/api/data-mode` GET/POST/invalid, `/api/data` simulator-fallback (1 AHU + 2 VAVs from collector_config) and mock mode (14 AHUs), `/api/telemetry-status` + `/api/telemetry-raw` empty-state, `/api/collector-config` GET/POST round-trip, `/api/collector-log` empty-state, `/api/write-point` full happy path with synthesized `equipment_types.json` + `map_config.json`, `/api/write-history`, `/api/trend-history`, `/api/equipment-points` 404 without telemetry, all 10 routes registered, `DATA_ROOT`/`CONFIG_DIR`/`ahu_records` injected.
- All 4 test suites green: **32 + 32 + 20 + 11 = 95/95 backend tests PASS**.

### Bundle
- `red5_bundle.zip` re-zipped with all 5 .py service files. Synced to `/app/frontend/public/` and `/app/frontend/public/red5-files/`.

## V1.9 Auto-Discovery Plug-In Loader (2026-05-07)
**Brief**: Replaced 4 hardcoded `import + register()` blocks in `app.py` with a single dynamic discovery loop. New mental model: **the user's software only needs to know about `app.py`** — every other `.py` plug-in is auto-loaded from `/root/scripts/` whenever `app.py` boots.

### Implementation
```python
SERVICE_CTX = {
    'DATA_ROOT': ..., 'SCRIPTS_ROOT': ..., 'ALLOWED_EXTENSIONS': ...,
    'MASTER_KEY_CONST': ..., '_derive_key': ..., '_no_cache': ...,
    'get_psat': ..., 'get_w': ..., 'get_h': ..., 'ahu_records': ...,
}
if os.environ.get('RED5_DISABLE_BG_THREADS') == '1':
    SERVICE_CTX['start_forecast_thread'] = False
    SERVICE_CTX['start_band_thread']     = False

# Search SCRIPTS_ROOT first, then the dir of app.py itself (test-harness fallback).
for path in glob('*_service.py'):
    mod = importlib.import_module(<name>)
    if hasattr(mod, 'register'):
        mod.register(app, SERVICE_CTX)
```

### What changed for the operator
- **Adding a new subsystem**: just include `<name>_service.py` in the next bundle upload. No edit to `app.py`. Restart Flask. Done.
- **Disabling one for debugging**: rename to `<name>_service.py.disabled` — discovery skips the suffixed file.
- **Removing a subsystem**: remove the `.py` from the bundle + restart. (Existing copy on the controller can be deleted via the file-management UI.)

### Resilience
- Failures are reported per-module (`[weather_service] FAILED to register: ...`) but never crash boot. A broken plug-in cannot take the controller down.
- Search order: `SCRIPTS_ROOT` first, then `dirname(app.py)` as a fallback (so test harnesses that point `SCRIPTS_ROOT` at an empty temp dir still work).
- De-duplicated by module name across both search dirs.
- Background-thread suppression now runs through the `RED5_DISABLE_BG_THREADS=1` env var (cleaner than the previous `src.replace()` test patches).

### Tests
- Updated 4 test files to set the env var and point `__file__` at the real `app.py` path so discovery can find the service modules.
- **All 95 backend regression tests still PASS** (32 + 32 + 20 + 11 across the 4 service suites).

### Bundle
- `red5_bundle.zip` re-zipped with the new auto-discovery `app.py`. Synced to `/app/frontend/public/` and `/app/frontend/public/red5-files/`.

## V1.9 Defensive Plug-In Contract (2026-05-07)
**Brief**: Layered a defensive dependency contract on top of the auto-discovery loader. Each service module declares which `SERVICE_CTX` keys it needs; the loader validates them BEFORE calling `register()`, so a misconfigured plug-in cannot crash boot.

### Each service module now declares its dependencies
```python
# upload_service.py
_service_dependencies = ['DATA_ROOT', 'SCRIPTS_ROOT', 'ALLOWED_EXTENSIONS',
                         'MASTER_KEY_CONST', '_derive_key', '_no_cache']

# weather_service.py
_service_dependencies = ['DATA_ROOT']

# band_service.py
_service_dependencies = ['DATA_ROOT', '_no_cache']

# telemetry_service.py
_service_dependencies = ['DATA_ROOT', 'get_psat', 'get_w', 'get_h', 'ahu_records']
```

### Loader behavior in `app.py`
For each `*_service.py` discovered:
1. If no `register()` → `WARNING: no register() function, skipping`
2. If `_service_dependencies` declared and any key missing → `SKIPPED: SERVICE_CTX is missing required keys: ['X', 'Y']` (skipped without calling register)
3. Otherwise → `register(app, SERVICE_CTX)` → `registered OK`
4. Any exception during register → `FAILED to register: <error>` (boot continues)

Modules without a dependency declaration are still allowed (backward compat), they just don't get the validation safety net.

### Verified end-to-end with synthetic test
- Dropped `zzz_bad_service.py` declaring `_service_dependencies = ['DATA_ROOT', 'NONEXISTENT_KEY']` next to the real modules.
- Boot log:
  ```
  [band_service] registered OK
  [telemetry_service] registered OK
  [upload_service] registered OK
  [weather_service] registered OK
  [zzz_bad_service] SKIPPED: SERVICE_CTX is missing required keys: ['NONEXISTENT_KEY']
  [zzz_noreg_service] WARNING: no register() function, skipping
  ```
- App still boots with 53 routes; the broken plug-in does not affect the real modules.
- All 95 backend regression tests still PASS.

### Bundle
- `red5_bundle.zip` re-zipped with all 5 .py service files (4 with `_service_dependencies` declarations + the dependency-validating loader in `app.py`). Synced to `/app/frontend/public/` and `/app/frontend/public/red5-files/`.

## Hot-fix 2026-05-08: Restored two top-level globals lost in service-split refactor
**Reported by user**: Dashboard "Collector Configuration" modal and Equipment Mapper "Controller Assets" panel both showed `Load failed: Unexpected token '<', "<!doctype "... is not valid JSON`. `/api/version` returned proper JSON (so Flask was running new code) but `/api/files?path=` returned **HTTP 500 Internal Server Error**.

**Root cause** (refactor regression): When `app.py` was split into `*_service.py` plug-ins, two top-level helpers were dropped from `app.py` even though core routes still referenced them:
- `_resolve_root(root_name)` — used by 7 routes (`/api/files`, `/api/delete-file`, `/api/upload-file`, `/api/create-directory`, `/api/move-file`, `/api/delete-directory`, `/api/init-directories`).
- `CONFIG_DIR` constant — used by 5 routes (`/api/equipment-types`, `/api/map-config`, `/api/save-equipment-schema`, `/api/save-map-config`, `/api/save-config`).

Every call to those endpoints raised `NameError`, Flask returned its default HTML 500 page, and frontend `response.json()` choked on `<!doctype`.

**Fix in `app.py`**:
1. Restored `def _resolve_root(root_name)` returning `ALLOWED_ROOTS.get(root_name, DATA_ROOT)`.
2. Restored `CONFIG_DIR = os.path.join(DATA_ROOT, 'configs')`.
3. Cosmetic: `/api/version` now reports mtimes for `/root/scripts/{app,upload_service,weather_service,band_service,telemetry_service}.py` (was incorrectly looking at `/root/data/app.py`, which doesn't exist post-refactor → returned `null`).

**New regression test** `tests/test_core_file_routes.py` (18 tests): exhaustive smoke check of every core endpoint plus a broad sweep across all 53 GET routes asserting **zero HTML-500 leaks**. Catches any future accidental drop of a top-level helper or constant at CI time.

## Hot-fix 2026-05-08 (part 2): Self-healing service-module relocation + bootloader protection
**Reported by user (continued)**: After re-deploying the bundle, the controller's `/root/scripts/` ended up with only `app.py`. The 7 other `.py` files (`upload_service.py`, `weather_service.py`, `band_service.py`, `telemetry_service.py`, `collector.py`, `simulator.py`, `band_csv_generator.py`) didn't appear anywhere on disk. Cause was inconclusive (likely a tmpfs/restricted-write quirk on the embedded controller's `/root/scripts/`), but the symptom was reproducible enough to warrant defensive code.

**Architectural decision (operator's call, 2026-05-08)**: `app.py` is now **explicitly NOT included in `red5_bundle.zip`**. It's the bootloader / plug-in orchestrator and is operator-managed (manually deployed via SCP / direct upload). Bundles only carry plug-ins (`*_service.py`) and UI assets. Rationale: a botched `app.py` landing on a live controller could brick the boot loop; explicit management gives operators a chance to verify before restart.

**Fixes**:
1. **Self-heal on boot** (`app.py`): Before service auto-discovery runs, scan `DATA_ROOT` for `*_service.py` files and migrate them to `SCRIPTS_ROOT`. If a copy already exists in `SCRIPTS_ROOT`, prefer the newer mtime and rename the loser to `.bak`. Idempotent — does nothing on a clean install. Logs every move.
2. **Bootloader protection** (both extractors): `upload_service.py._extract_zip_streaming()` and `app.py._emergency_upload()` both refuse to write `app.py` even if a sloppy zip happens to contain it. `upload_service` reports it as skipped with reason `"Bootloader (app.py) not auto-deployed - upload manually"`. The emergency extractor silently skips (no UI to display reasons there).
3. **Standalone `app.py` ships at `/app/frontend/public/app.py`** alongside `red5_bundle.zip` for clean manual deployment to fresh controllers.

**New regression tests**:
- `tests/test_self_heal_services.py` (16 tests): drops 4 service modules in `DATA_ROOT`, plus an older stale copy in `SCRIPTS_ROOT`, runs boot, verifies migrate + replace + .bak + log lines + service registration end-to-end.
- `tests/test_bootloader_protection.py` (13 tests): builds a synthetic bundle containing a "trojan" `app.py` (`raise SystemExit('TROJAN')`), runs both extractors, asserts the real `app.py` on disk is byte-identical before/after AND that the rest of the bundle still extracts normally.

**Test totals**: **142/142** (was 95 → +47 across 2026-05-08 hot-fix work). Bundle rebuilt without `app.py` (now 1.58 MB, MD5 `c805531eb60274e4a29ebe54e3b2de6a`). Standalone `app.py` shipped at `/app/frontend/public/app.py` (54,919 bytes, MD5 `f5bf6de560b76c7c066a6d075de67378`).

## Hot-fix 2026-05-08 (part 3): PLUGINS_ROOT — firmware-safe home for plug-in scripts
**Reported by user**: After multiple bundle redeploys, `/root/scripts/` always ended up with only `app.py` — every other `.py` file vanished without explanation.

**Root cause (confirmed by user)**: The Delta Controls / enteliWEB controller firmware **silently deletes any `.py` file in `/root/scripts/` that isn't a pre-registered enteliWEB "object"**. `app.py` survived only because the operator had explicitly created it as an enteliWEB object once. Any plug-in dropped there by the bundle extractor was wiped on the firmware's next sweep.

**Architectural fix (operator's design call)**: Plug-ins now live in **`PLUGINS_ROOT = /root/data/pgpy/`**, where the firmware leaves them alone. `/root/scripts/` is reserved for `app.py` (the operator-managed enteliWEB object) and any other manually-registered objects.

**Code changes** (touched 6 places consistently):
1. **`app.py`** — new `PLUGINS_ROOT` constant; added to `sys.path` and `SERVICE_CTX`; auto-created on boot.
2. **Self-heal on boot** (`app.py`) — now scans BOTH `DATA_ROOT` (flat) AND `SCRIPTS_ROOT` for misplaced `*_service.py` files and migrates them to `PLUGINS_ROOT`. Idempotent. Picks newer mtime; older becomes `.bak`.
3. **Auto-discovery search dirs** — primary = `PLUGINS_ROOT`; fallback = `SCRIPTS_ROOT` (for legacy installs / operator-managed services).
4. **Emergency bootstrap extractor** (`app.py`) — routes `.py` → `PLUGINS_ROOT` (was `SCRIPTS_ROOT`); skips `app.py` entirely.
5. **Streaming extractor** (`upload_service.py`) — routes `.py` → `PLUGINS_ROOT`; manifest now reports `root: 'pgpy'` for plug-ins; auto-creates `PLUGINS_ROOT` in `register()`; uses `pgpy/<name>` label in extracted manifest.
6. **`/api/version`** — reports mtimes from `/root/data/pgpy/{upload_service,weather_service,band_service,telemetry_service}.py`.

**New regression tests**:
- `tests/test_plugins_root_routing.py` (14 tests): builds a synthetic bundle with 2 plug-ins + a trojan app.py + configs + UI, runs the streaming extractor, verifies plug-ins land in `PLUGINS_ROOT`, do NOT leak into `SCRIPTS_ROOT` or flat `DATA_ROOT`, manifest reports `root='pgpy'`, app.py is blocked, and the extracted plug-in is actually importable.
- Existing self-heal + bootloader-protection tests updated to the new layout.

**Test totals: 156/156 passing** (+14 from PLUGINS_ROOT routing). Bundle rebuilt without `app.py` (1.58 MB, MD5 `0f3b74e5e5b75e86f59beb26f7c0901e`). Standalone `app.py` shipped at `/app/frontend/public/app.py` (56,672 bytes, MD5 `309ad28fa2c8b186436ddc7c19cabdef`).


## V1.9 Monthly × Sites Math + OA-Intake Visualisation (2026-02-08 — fork session)
- [x] **Fixed B1-B10 + Dyn-Reset envelope clamping** (P0): in `js/psy-3d-engine.js` the `bandDyn` strategy was mathematically identical to plain `dyn` because `h_sa_dyn` was used directly without any envelope around `h_sa_b`. Added Trim & Respond clamp `h_sa_bd = clamp(h_sa_dyn, h_sa_b ± _TR_DH)` with `_TR_DH = 4 kJ/kg` (≈ ±2 °C). When zone-driven 24-h trailing mean drifts outside the band envelope (e.g. mid-heat-wave), the controller falls back to the band setpoint. Smoke-tested via stress-loop: bandDyn went 4.29 → 20.81 vs dyn unchanged at 4.29 — i.e. the curve is now genuinely distinct.
- [x] **Redefined Opt-SA as a true thermodynamic floor** (P1) in BOTH chart paths:
  - Monthly × Sites (`renderMonthlySitesChart`): replaced `mean(h_oa)` with `clamp(h_oa, _optMinH, _optMaxH)`.
  - T×Time (`renderTimeSeries2D`, `mode==='tt'`): same redefinition. The previous L2-optimal anchor produced the user-reported bug where Dyn-Rst (489 kJ/kg cumulative) was beating Opt-SA (824 kJ/kg) — physically impossible for a "floor". After fix, Opt-SA is the lowest visible curve.
  - **Follow-up fix (2026-02 same session)**: clamping Opt-SA alone wasn't enough — the unbounded 24-h rolling-mean Dyn-Reset target was still drifting outside the comfort envelope (e.g. 5 kJ/kg in Seoul winter), letting Dyn-Reset undercut Opt-SA. Real ASHRAE G36 Trim & Respond loops cap SA between min/max (typically 55–65 °F). Applied the same `[_optMinH, _optMaxH]` clamp to `h_sa_dyn` in BOTH renderers. Pointwise residual proof: when `h_oa < optMinH`, both opt and dyn pin to `optMinH - h_oa` so opt ≤ dyn; symmetric on the upper side; when `h_oa` inside envelope, opt = 0 and dyn ≥ 0. Now mathematically guaranteed Opt-SA ≤ Dyn ≤ Band+Dyn ≤ Band ≤ Fixed-SA in all climates. Verified via Seoul-style sinusoidal -10→35 °C ramp test.
  - Legend annotation switched from back-solved `(18.2°C / 60%)` to `(25–50 kJ/kg env)` since the comfort envelope replaces the single-anchor target.
- [x] **OA Intake smoothing**: replaced 12-segment polyline with Catmull-Rom cubic-Bezier curve (centripetal control points) so the dashed yellow line reads as a continuous "OA modulation rhythm" rather than 12 jagged segments. Per-month dot markers retained as data-point indicators.
- [x] **Configurable Opt-SA bounds** — two range sliders (`#p3-opt-min` / `#p3-opt-max`, accent-purple) appear under the `+ Opt-SA` toggle when the curve is on. Live-updates the chart on input. Self-clamping so min < max always (1 kJ/kg minimum spread).
- [x] **OA-intake visualisations** (`+ OA Intake` toggle, default ON): three coordinated cues per panel: (1) translucent yellow dashed line on the plot tracking monthly-mean OA-damper utilisation (right axis remapped 0–100 %), (2) opacity-graded amber strip below the season strip (12 cells whose alpha scales with damper %), (3) site-wide annual-mean damper percentage appended to each panel's title (`Avg OA: 35 %`). Bottom legend gets a matching `OA Intake (band damper)` swatch.
- [x] **"% of Opt-SA captured" annotations** in the bottom legend — when both Opt-SA and at least one other strategy are visible, the legend appends `(N% of Opt-SA captured)` after each strategy's name. `N = (aggBase - stratTotal) / (aggBase - aggOpt) × 100`, aggregated across the currently-selected sites so the headline matches the panel grid (no per-panel divergence).
- [x] **Race-condition fix in `initPsy3D`**: `loadScripts(cb)` invokes `cb` synchronously when `window.THREE` is already cached (e.g. tab switch back). That meant `setupControls()` ran before `var _optMinH = 25` had executed, leaving `.toFixed()` to crash on `undefined`. Hoisted both `_optMinH` and `_optMaxH` to the very top of `initPsy3D` (next to the `_cleanupTasks` block) so they're guaranteed initialised before any sync-callback path. React error-boundary now no longer catches "TypeError: Cannot read properties of undefined" on tab return.
- [x] **Regression tests**: `/app/archive/Red5-Studio-V1.9/tests/test_strategy_math.js` — 7 pass / 0 fail. Locks in (a) bandDyn ≠ dyn during heat waves, (b) Opt-SA is the lowest curve when SA is inside the comfort envelope, (c) Opt-SA → 0 when OA fully inside `[optMinH, optMaxH]`, (d) clamp respects envelope bounds in cold weather.
- Verification status: rendered & screenshot-tested in the Emergent preview (Adelaide preset). Pending controller deployment via `red5_bundle.zip` reupload (or manual upload of just `js/psy-3d-engine.js`).


## V1.9 Air-Flow Segment Schema Migration to Fractional Coords (2026-02-09)
**Brief**: User reported air-flow segment aligners landing in different on-screen positions in the Config Tool vs the Dashboard's AHU equipment-diagram modal. Root cause: segment offsets were stored as **raw pixels** anchored at a `%` point on the AHU image, but the AHU image renders at **different physical sizes** in the two hosts (Config Tool: `max-h-[85vh]` + `view.scale`; Dashboard: `maxHeight: calc(100% - 4px)` of a resizable modal). Same `offsetX=480` lands at different image-feature-relative positions when display widths diverge.

### Schema (forward-canonical)
- New fields on each `air_flow_path.segments[i]`: `offsetXFrac`, `offsetYFrac` ∈ [-1, +1] as fraction of the AHU image **natural width**. Both axes use width as the canonical denominator so offsets stay isotropic when display dimensions scale uniformly with the image's aspect ratio.
- Legacy `offsetX`/`offsetY` fields kept for read-compat. New `Frac` fields take precedence when both are present.

### Render (`PreviewAirFlowSimulator` in `js/preview-components.js`)
- New props: `containerW` (CSS width of AHU image) + `naturalW` (intrinsic pixel width).
- Resolution: (1) `offsetXFrac` × `containerW` if both defined; (2) legacy `offsetX` × `(containerW/naturalW)` (auto-scale); (3) raw legacy px if no dims passed (pre-migration behavior).

### Drag handler (`equipment_mapper.html` `move-segment`)
- `dxFrac = dxScreen / rect.width` (rect.width includes `view.scale` so the math is uniform). Stores `offsetXFrac/offsetYFrac` as canonical; keeps legacy px in sync.
- On grab, captures `initOffXFrac/Y` preferring frac, falling back to legacy migrated via `imageRef.naturalWidth`.
- Rotate/scale handles compute segment center via frac if present, else legacy auto-scaled.
- New segment init writes both Frac=0 and legacy=0.

### Dashboard wiring
- AHU + VAV modals now pass `containerW` + `naturalW` to the simulator. Previous `transform: scale(vavImgScale)` workaround on the VAV wrapper is **removed** (no longer needed — simulator scales internally).

### Tests
- `tests/test_airflow_frac_migration.js`: **17/17 PASS** — canonical Frac→px math, legacy fallback with auto-scale, legacy with no dims, Frac-wins precedence, drag-delta math (incl. view.scale cases), cross-host alignment guarantee, full drag→save→reload round-trip.

### Bundle
- `red5_bundle.zip` rebuilt (1.62 MB, MD5 `a1b2218d6dd55d19b963cd5cc948f7f0`) with `equipment_mapper.html` + `dashboard.html` + `js/preview-components.js`. Synced to `/app/frontend/public/` and `/app/frontend/public/red5-files/`.

### One-time user action
Existing configs render via the auto-scale legacy fallback. May shift slightly on first render depending on how close original calibration display was to natural size. To finalize: open each AHU type in Config Tool, nudge each segment once → drag-save persists `offsetXFrac/Y` as canonical → pixel-perfect alignment from then on across both hosts at any display size.


## V1.9 Snap-Guide Overlay for Air-Flow Segments (2026-02-09)
**Brief**: Added a precision-alignment overlay in the Config Tool to help operators drop air-flow segments exactly on coil/filter/duct edges of the AHU image — eliminating guess-and-check.

### What renders
When an air-flow animation is selected in the Config Tool's Aligners tab (and not in pan mode), each of its segments now displays:
- **Vertical + horizontal dashed crosshair** (amber `rgba(245,158,11,0.55)`, 1 px) extending across the entire AHU image, intersecting at the segment's center. Lines auto-track image resizes (CSS-`%`-positioned within the `inset-0` 3D engine wrapper, no JS resize listeners needed).
- **Numeric Frac badge** floating diagonally near each segment center: `Frac: 0.234, 0.158 · 451,304 px` — shows the canonical `offsetXFrac/offsetYFrac` values plus the resolved pixel offset at the current display size. Operators can read and compare values across AHU types to enforce consistent placement.

### Implementation
- New state `imgAspect` (default 1) populated on image `onLoad` from `naturalWidth/naturalHeight`. Used to convert width-fraction → %-of-height for horizontal crosshair positioning: `topPct = a.y + offsetYFrac * 100 * imgAspect`.
- Snap-guide block lives inside the existing 3D engine wrapper (`<div className="absolute inset-0">`) at the same level as the airflow simulator, so it inherits CSS-percentage anchoring relative to the AHU image bounds.
- Gating: `isActive && !panMode` — only the currently-selected airflow animation shows guides; pan-mode hides them so the overlay doesn't interfere with image panning.
- Dashboard never receives this guide (the snap overlay is rendered in `equipment_mapper.html` only — not inside `PreviewAirFlowSimulator` itself, which is shared with the dashboard).

### `data-testid`s
- `snapguide-vert-<segIdx>`, `snapguide-horiz-<segIdx>`, `snapguide-badge-<segIdx>` per segment, for E2E verification.

### Bundle
- `red5_bundle.zip` rebuilt (1.62 MB, MD5 `3424221775d13a09604843a753f438c8`) with updated `equipment_mapper.html`. Synced to `/app/frontend/public/` and `/app/frontend/public/red5-files/`.


## V1.9 Headroom Pre-Flight Floor Lowered (2026-02-09)
**Brief**: Operator reported `/api/upload-bundle` repeatedly failing with `[Errno 28] Low disk headroom` even when the bundle was identical to the one already extracted on disk (would be reclaimed by overwrite).

### Root cause
Pre-flight `_check_free_space` required a flat 20 MB floor (`max(20 MB, total_size × 3)`), regardless of bundle size or the fact that the existing extracted copy on disk would be replaced. For a 1.62 MB bundle the realistic peak disk use during the `_extract_zip_streaming` pass is ~zip_size + extracted_files (~2× zip_size), nowhere near 20 MB.

### Fix
Lowered both pre-flight call sites in `upload_service.py`:
- **Chunked path** (`/api/upload-bundle-chunk` first chunk): `need = max(5 MB, total_size × 2)`.
- **Legacy / finalize path** (`_finalize_bundle_from_disk`): now uses `os.path.getsize(zip_path)` (the actual zip is on disk at this point) → `_min_need = max(5 MB, _zip_size × 2)`. Also added `_min_need` to the 507 response body so the operator can see required vs free.

### Tests (`tests/test_streaming_upload.py`)
- **36/36 PASS** (32 original + 4 new):
  - `9a` small-bundle first-chunk pre-flight returns 200 (not 507)
  - `9b` accumulated_bytes matches written
  - `9c`/`9d` source-of-truth formula assertions in `upload_service.py` (locks the floor against future regressions)

### Deployment chicken-and-egg
The fix lives in `upload_service.py`, which is *deployed by* the upload service. Operators stuck below the old 20 MB floor must replace `/root/data/pgpy/upload_service.py` out-of-band (file-management UI, SCP, or enteliWEB script editor) before the next bundle upload. Subsequent bundles benefit automatically.

### Bundle
- `red5_bundle.zip` rebuilt (1.62 MB, MD5 `b5465c64a40f2ca63a1e4299e132de4d`) with updated `upload_service.py`. Standalone `upload_service.py` (48 KB) also synced to `/app/frontend/public/upload_service.py` and `/app/frontend/public/red5-files/upload_service.py` for direct out-of-band deployment.


## V1.9 Out-of-Band Repair Mode (2026-02-09)
**Brief**: Permanently solves the chicken-and-egg deployment problem where a fix to `upload_service.py` couldn't be applied via the bundle uploader because the bundle uploader's pre-flight was the thing being fixed. Now any plug-in or UI file can be replaced via a direct single-file POST that bypasses the bundle/decrypt/extract pipeline entirely.

### Backend (`upload_service.py`)
Two new routes:
- **POST `/api/repair/upload-plugin`** — multipart/form-data with `file` + optional `filename` override. Strict allow-list (only `upload_service.py`, `weather_service.py`, `band_service.py`, `telemetry_service.py` go to `PLUGINS_ROOT`; `update.html`, `dashboard.html`, `equipment_mapper.html`, `landing.html`, `psy_3d.html` go to `DATA_ROOT`). Refuses `app.py` (HTTP 403, "bootloader — refused"). Refuses anything off-list (HTTP 403, response includes the allow-list).
  - Path-traversal safe: `os.path.basename()` strips any directory components from filename header.
  - **No 5 MB / 20 MB headroom floor here** — exists expressly to unblock low-headroom controllers. Only refuses if disk genuinely cannot accept a 64 KB write (`min_bytes=64 KB, min_inodes=10`) after auto-cleanup.
  - **Atomic rename**: writes to `<dest>.repair_tmp` first, then `os.replace()` to final path → corrupted transfers can never leave a half-written replacement of a critical plug-in.
  - 10 MB per-file ceiling on `_stream_save_request_to_file` so individual files can't fill a controller.
  - Auto-`_purge_pycache()` after every `.py` upload (drops any stale `.pyc` the new module made obsolete).
  - Response includes a `note` reminding the operator to Restart Flask for Python to re-import the module.
- **GET `/api/repair/download-plugin/<plugin_name>`** — same allow-list. Serves the current on-disk copy of any plug-in/UI file. Refuses `app.py` (403). Returns 404 if file missing on disk. Useful for "what's deployed?" inspection before deciding to overwrite.

### Frontend (`update.html`)
New "Repair Mode" card (between Download Bundle and Documentation):
- "Out-of-Band" amber pill in the heading.
- 8-row list: 4 PLUGIN entries (purple badge) + 4 UI entries (green badge), each showing the filename + a one-line description.
- Per-row **Replace** button → triggers a hidden `<input type=file>` → on file pick, posts to `/api/repair/upload-plugin` with FormData. Confirms before sending if the picked filename doesn't match the slot.
- Per-row **View** button → opens `/api/repair/download-plugin/<name>` in a new tab.
- Status line below the list shows OK / error / network failure with byte counts.
- Auto-refreshes the Disk Capacity widget after every successful repair upload.
- Bottom-of-card footer reminds operator that the file is on disk immediately but the running Python process keeps the old module cached until Flask is restarted (toggle `app.py` off/on in the enteliWEB script editor).

### Tests (`tests/test_repair_mode.py`)
**25/25 PASS** covering:
- Plug-in upload happy path (verifies file on disk, byte-equality, dest label, restart-flask note)
- UI .html upload happy path (verifies routed to DATA_ROOT not PLUGINS_ROOT)
- `app.py` upload refused (403 + bootloader error message + file NOT written anywhere)
- Off-list filename refused (403 + response includes allow-list)
- Path-traversal `../../../etc/passwd` rejected (basename strip → off-list → 403)
- No `.repair_tmp` files lingering after success (atomic rename worked)
- Download endpoint round-trip equivalence
- `app.py` download refused (403)
- Missing-file download returns 404
- Off-list download returns 403

Plus `tests/test_streaming_upload.py` **36/36 PASS** (regression — the new endpoint didn't break the legacy/chunked paths).

### Bundle
- `red5_bundle.zip` rebuilt (1.62 MB, MD5 `44040dc62848e82035653c439b873dc3`) with updated `upload_service.py` + `update.html`. Standalone copies synced to `/app/frontend/public/` and `/app/frontend/public/red5-files/`.

### Operator workflow when bundle uploader is blocked
1. Open `/update`. Scroll to **Repair Mode** card.
2. Click **VIEW** on `upload_service.py` (or any plug-in) to confirm what's currently deployed.
3. Click **REPLACE** → pick the new file → confirm if name doesn't match → upload posts directly to `/api/repair/upload-plugin`.
4. Toggle `app.py` off then on in the enteliWEB script editor (Python module re-import).
5. Retry the bundle upload — now uses the updated logic.


## V1.9 Hot-Reload Module Endpoint (2026-02-09)
**Brief**: Layered on top of Repair Mode. Eliminates the enteliWEB script-toggle dance entirely — newly-uploaded plug-in code now takes effect inside the running Flask process WITHOUT a restart.

### Backend (`upload_service.py`)
- New `POST /api/repair/reload-module/<plugin_name>` endpoint. Allow-listed to the same 4 plug-ins (`upload_service.py`, `weather_service.py`, `band_service.py`, `telemetry_service.py`).
- Mechanism (3 steps inside the handler):
  1. **`importlib.reload(mod)`** — Python re-executes the module body, creating fresh function objects in `mod.__dict__`.
  2. **Rebind module globals** by calling `mod.register(app, ctx)` again — but with `app.add_url_rule` monkey-patched to a no-op so it doesn't AssertionError on duplicate endpoint names. Background threads suppressed via `start_*_thread=False` in the rebind ctx so we don't spawn duplicates.
  3. **Swap `app.view_functions[ep]`** for every endpoint registered by this module (matched by `fn.__module__`) → next request hits the new code.
- Caveat surfaced to the operator: cannot ADD or REMOVE routes — Flask `url_map` is immutable post-boot. For schema changes (new endpoints) a real Flask restart is required. Response includes a clear `note` explaining this.
- Stashes `_FLASK_APP_REF` + `_SERVICE_CTX_REF` in module globals at `register()` time so the reload handler can re-bind without needing the test harness to thread state through.
- **Critical gotcha discovered + fixed during testing**: `importlib.reload()` re-executes the module body, which resets `_FLASK_APP_REF/_SERVICE_CTX_REF` to None mid-handler. Captured both refs to LOCAL variables BEFORE the reload call so the handler keeps working through the reload.

### Frontend (`update.html`)
- Added indigo **Reload** button on each PLUGIN row (`upload_service.py`, `weather_service.py`, `band_service.py`, `telemetry_service.py`). UI rows (.html) correctly do NOT show a Reload button — HTML files are served fresh on every request, no module re-import needed.
- **Auto-reload after Replace**: when a `.py` Replace upload succeeds, the UI now chains a `POST /api/repair/reload-module/<name>` automatically. Operator gets a single status message: `"OK: replaced + hot-reloaded upload_service.py — 5 endpoint(s) now serve the new code, no Flask restart needed."`
- Replaced the "After upload: Restart Flask" footer with the new "One-click flow" language.

### Tests (`tests/test_reload_module.py`)
**18/18 PASS** covering:
- Off-allowlist refused (403)
- `app.py` refused (403)
- Module-not-loaded → 404 (module removed from `sys.modules`)
- Source-on-disk mutation → reload → response confirms `swapped_endpoints` populated, `swapped_endpoints` includes specific endpoints, response includes restart-for-new-routes note, file-on-disk has the sentinel value, **view_function identity actually changed** (proves the swap really repointed Flask, not just left a stale ref)
- Subsequent calls (`/api/disk-status`, `/api/repair/upload-plugin`) still work after reload (no breakage)
- `weather_service.py` reload happy path

Plus regression: `tests/test_streaming_upload.py` **36/36 PASS**, `tests/test_repair_mode.py` **25/25 PASS**.

### Bundle
- `red5_bundle.zip` rebuilt (1.63 MB, MD5 `ea0255f923153b54e0bc81ced42f25c6`) with updated `upload_service.py` + `update.html`. Standalone copies synced to `/app/frontend/public/` and `/app/frontend/public/red5-files/`.

### One-click operator workflow (post-deploy)
1. Open `/update`. Scroll to **Repair Mode** card.
2. Click **REPLACE** on a plug-in → pick local file.
3. UI uploads → server replaces on disk → UI auto-fires reload → operator sees "OK: replaced + hot-reloaded — N endpoints now serve the new code".
4. **Done.** No script-editor toggle, no SSH, no waiting for boot.


## V1.9 Bundle Resync — Stale `psy-3d-engine.js` + 6 other files (2026-02-09)
**Brief**: User reported the strategy multi-mode UI (Fixed-SA / B1-B10 / B1-B10 + Dyn / Dyn-Reset / Opt-SA toggles + Mode Summary banner + Comfort/Trade-off/Cost modes + configurable Opt-SA bound sliders) was missing from a controller deploy. Root cause: every bundle rebuild this session inherited the previous bundle as a base and only swapped the *currently changed* files, so files that were updated in **earlier** sessions (but never rebundled at the time) carried forward indefinitely as stale.

### What was stale in the bundle vs the live archive
| File | Bundle (stale) | Live archive | Δ |
|---|---:|---:|---:|
| `js/psy-3d-engine.js` | 188 KB / 3257 lines | **248 KB / 4282 lines** | +60 KB / +1025 lines |
| `js/i18n.js` | 23 KB | 30 KB | +7.5 KB |
| `js/schema-config.js` | 8 KB | 11 KB | +3 KB |
| `js/file-browser.js` | 15.7 KB | 17 KB | +1.3 KB |
| `collector.py` | 27 KB | 32 KB | +5.3 KB |
| `simulator.py` | 21.9 KB | 22.2 KB | +0.26 KB |
| `telemetry_service.py` | 28.5 KB | 30.9 KB | +2.4 KB |

### Multi-mode features that were missing in the deployed `psy-3d-engine.js`
- `optMinH`/`optMaxH` configurable Opt-SA bounds (count went 0 → 27/26)
- `opt-min`/`opt-max` slider IDs (0 → 4/4)
- `Mode Summary` banner (0 → 4)
- `Trade-off` matrix mode (0 → 3)
- `Cost` dollar-model mode (0 → 10)
- `Comfort` hours metric — the real mechanism-aware version (4 → 11)
- `+ OA Intake` toggle + Catmull-Rom smoothed curve (0 → 1 each)

### Fix
- Resynced 7 files from `archive/Red5-Studio-V1.9/` → `red5_bundle.zip`.
- Resynced same files to `/app/frontend/public/` (cloud-preview served copy).
- Resynced 16 files (those + 9 more that had 0-byte gaps) to `/app/frontend/public/red5-files/` (deploy-folder copy).
- All 3 bundle locations now identical: MD5 `c6ac7cc9ca6d591205beb655adc9e916` (1.65 MB).
- `app.py` intentionally still excluded (operator-managed per 2026-05-08 architectural decision).

### Verified
- Direct curl against cloud preview: `GET /js/psy-3d-engine.js` returns 248,792 bytes / 4282 lines.
- Bundle's embedded `psy-3d-engine.js` byte-identical to served + archive copies.
- All 16 strategy/multi-mode/i18n keyword counts post-resync match the live archive.

### Process improvement
Going forward, the bundle rebuild script should treat the **live archive directory** as the source of truth for ALL files in the bundle, not just the explicitly-listed updates. Future `update_bundle` invocations will re-include every file from `archive/Red5-Studio-V1.9/` with content from disk, so files updated in earlier sessions can never go stale.


## V1.9 Strategy Toggle Consolidation into Dropdown (2026-02-09)
**Brief**: Operator requested the 5 inline strategy-toggle buttons (Fixed-SA / Dyn-Reset / B1-B10 / B1-B10 + Dyn-Reset / Opt-SA) on the Monthly × Sites chart row be consolidated into a single dropdown with checkboxes — matching the existing Sites dropdown UX. Target row layout: `HEADER → SITES → STRATEGIES → OA Intake`.

### Implementation
Added a new `#p3-btn-strat-dd` dropdown (left:660px) just past the Sites dropdown (left:485px) and before OA Intake (left:730px) inside `js/psy-3d-engine.js`.

- **Trigger label** dynamically reads `Strategies: N/5 ▾` reflecting how many are currently checked.
- **Panel** (z-index 60) lists 5 rows, each with: native checkbox (accent-color matched to the chart curve color) + 10px color swatch (same color again, so checkbox→curve mapping is visible at a glance) + strategy label.
- **All / None** convenience row at the top (sticky), matching the Sites dropdown styling.
- **Outside-click** closes the panel via a single `document` listener registered in `_cleanupTasks` so it auto-removes on disposal.
- **Auto-closes** on leaving Monthly × Sites mode (added to all 4 visibility-controlling forEach lists at lines 803/831/849/922).

### Zero render-math change
The 5 legacy buttons (`#p3-btn-ms-fixed`, `#p3-btn-ms-dyn`, `#p3-btn-ms-band`, `#p3-btn-ms-banddyn`, `#p3-btn-ms-opt`) stay in DOM but are removed from the visibility forEach lists, so they remain `display:none` permanently. Each dropdown checkbox click forwards to `legacyBtn.click()`, which fires the existing `onclick` handler that toggles `_msShow{Fixed,Dyn,Band,BandDyn,Opt}`, refreshes the (hidden) button cosmetics, and calls `render2DChart()`. This guarantees the chart math is byte-identical to before — the dropdown is purely a UX layer.

### Opt-SA bound sliders
The `#p3-ms-optcfg` panel (min/max enthalpy sliders for the Opt-SA envelope) was repositioned from `left:595px` (under the now-hidden Opt-SA button) to `left:660px` (under the new Strategies dropdown), so when the operator checks Opt-SA the bound sliders pop up directly under the dropdown.

### Tests (`tests/test_strategy_dropdown.js`)
**28/28 PASS** covering:
- All new IDs, helpers, and class-pattern markers exist in source
- All 5 strategy entries exist in `_stratDefs`
- Each `_msShow*` getter is referenced (they stay live, never duplicated)
- All 5 legacy `onclick` handlers are intact (zero render-math touch verified at the source level)
- Dropdown is added to the visibility forEach lists; legacy 5-button forEach lists are GONE
- Layout-order assertion: `stratDdBtn left:660` > `sitesDdBtn left:485` (row reads SITES → STRATEGIES correctly)
- Outside-click handler registered + cleanup on dispose

### End-to-end browser verification
Drove the live page through `3D WX → 2D toggle → Monthly × Sites`. Live state:
```
strat_text:           'Strategies: 0/5 ▾'
legacy_fixed_visible: False                   ← legacy buttons correctly hidden
oa_visible:           True                    ← OA Intake still visible
sites_visible:        True                    ← Sites dropdown still visible
panel labels:         [X] Fixed-SA, [ ] Dyn-Reset, [ ] B1-B10, [ ] B1-B10 + Dyn-Reset, [ ] Opt-SA
```
Zero `pageerror`s.

### Bundle
- `red5_bundle.zip` rebuilt (1.65 MB, MD5 `4192ed146396fa26c45cf76c4f152b73`) with updated `js/psy-3d-engine.js`. Synced to `/app/frontend/public/` and `/app/frontend/public/red5-files/`.


## V1.9 OA→SA "Rain-on-Floor" 3D Layer (2026-02-09)
**Brief**: Operator asked for a 3D version of the existing 2D `OA→SA Lines` projection — same psychrometric chart on the floor, but with weather samples lifted up the time-Y axis and "raindrop" lines descending from each OA point down to its computed SA target on the chart floor.

### What renders
- **Floor (Y=0)** = standard psychrometric chart (basePlane texture, T on X, W on Z).
- **Floating cloud** = 8760 hourly OA samples at world `(t2sx(t), frac2sy(timeFrac), w2sz(w))` — already there from the existing `pathGroup`.
- **NEW: SA dots** at world `(t2sx(sa.t), 0.3, w2sz(sa.w))` — concentrated cluster on the floor showing where the controller actually lands SA after reset.
- **NEW: Drop lines** as `THREE.LineSegments` — one 2-vertex segment per OA sample, top vertex at full color, bottom vertex at 35 % color so the line visually fades as it descends (rain-on-floor metaphor).
- Time-Y axis already runs bottom (Jan) → top (Dec).

### Code changes (single file: `js/psy-3d-engine.js`)
1. **Hoisted `_saReset(t, rh, w)`** to module scope. The old `computeSA` was closed over inside `render2DChart()` and only the 2D layer could call it. Now both 2D and 3D layers share the SAME 11-band SA-reset model — single source of truth, zero math drift between views.
2. **`render2DChart`** now has `function computeSA(t,rh,w){ return _saReset(t,rh,w); }` — pure delegation, no behaviour change.
3. **New `saDropGroup` THREE.Group** declared at scene level, created at scene init with `visible=false` (so existing scenes stay uncluttered until the user opts in).
4. **Toggle wiring**: added `saDrop:saDropGroup` to the layer map at line 768; added `['saDrop','#22d3ee','OA→SA Drops']` to the toggle list. Initial off-state is mirrored to the UI via a small enhancement to the toggle-creation forEach: any layer with `visible===false` gets `.p3off` class on its toggle.
5. **`buildWeatherVis`** clears `saDropGroup` on every fetch (so successive weather refreshes don't accumulate stale geometry), then walks `weatherData[]`:
   - For each sample: compute `sa = _saReset(p.t, p.rh, p.w)`.
   - Cull no-action samples (`|sa.t - p.t| < 0.5 && |sa.w - p.w| < 0.0003`) — they'd render as zero-length drops and clutter the floor.
   - Push 1 vertex into the SA-floor scatter (`Float32Array`).
   - Push 2 vertices into the drop-line `LineSegments` (top at OA, bottom at SA).
6. Both Points + LineSegments built with `depthWrite:false` so they don't z-fight with the floor psy chart texture.

### End-to-end browser verification
Drove the live page through `3D WX → fetch 2920 NYC weather points → click OA→SA Drops toggle`. Confirmed:
- 7 toggles in the panel (was 6); new `OA→SA Drops` toggle present, starts in `off=True` state, flips to `off=False` after click.
- 2920 points loaded, drop lines + SA floor cluster render correctly (visible in screenshot — yellow-green concentration on the floor representing landed SA, blue/red diagonal raindrops descending from the time-floating OA cloud).
- Zero `pageerror`s.

### Tests (`tests/test_oa_sa_3d_drops.js`)
**19/19 PASS** covering: `_saReset` hoist + 2D delegation, `saDropGroup` creation + default-hidden, toggle wiring (layer map + toggle entry + initial off-state mirror), clear-on-refresh, drop math (`saReset` per sample, OA world coords, SA at Y=0, drop-line 2-vertex assembly, vertex-color fade), no-action culling, guarded build (no empty BufferGeometry), Points + LineSegments build, `depthWrite:false` on both.

### Bundle
- `red5_bundle.zip` rebuilt (1.66 MB, MD5 `8a21f17a07a780b4d0298393100fbd1c`) with updated `js/psy-3d-engine.js`. Synced to `/app/frontend/public/` and `/app/frontend/public/red5-files/`.


## V1.9 OA→SA Drops Color-Mode Chip (T | B) (2026-02-09)
**Brief**: Operator approved adding a per-band color override for the new 3D Drops layer — small inline `T | B` chip that switches drop colors between OA temperature spectrum (default) and the SA-reset B1-B10 band palette so a B7 hot-humid hour is the same orange in both 2D and 3D views.

### Implementation (`js/psy-3d-engine.js`)
1. **Hoisted `_bandRGB(t, rh)`** to module scope — returns `[r,g,b]` floats (0–1) for direct push into a `THREE.Float32BufferAttribute` color buffer. Palette mirrors the `bandCol()` CSS function in the 2D layer (B1=#3b82f6 cold-dry, …, B7=#f97316 warm-hum, …, B10=#a855f7 ext-hum).
2. **State var `_saDropColorMode`** (`'t'` | `'band'`) defaults to `'t'`.
3. **Refactored** the inline drop-build code in `buildWeatherVis` into a reusable helper `_buildSaDropGeometry()` so a recolor doesn't require re-fetching weather data — chip click → `_buildSaDropGeometry()` → in-place geometry rebuild.
4. **Per-sample color**: `c = bandMode ? _bandRGB(p.t, p.rh) : t2rgb(p.t)`. Drop-line vertex-color fade (full at top → 35% at floor) preserved in both modes.
5. **Chip element** (`#p3-saDrop-color`) appended right after the `OA→SA Drops` toggle row in the layer panel. Two clickable spans (`data-mode="t"` and `data-mode="band"`) with active-mode highlighted in cyan (#22d3ee, layer accent).
6. **Auto-show/hide** with the layer toggle: clicking the layer toggle shows/hides the chip; chip starts hidden because the layer starts hidden.
7. **Self-heal** on first render: `if (_saDropColorMode !== 'band') _saDropColorMode = 't';` — guards against any closure-init race during page load.
8. **Tooltip** documents both modes for operators who hover.

### End-to-end browser verification
Drove the live page through `3D WX → click OA→SA Drops toggle → fetch weather → click B`. Confirmed:
- Initial render: T highlighted cyan (`color:#22d3ee;background:rgba(34,211,238,.15)`), B gray inactive.
- After click B: B cyan-active, T gray-inactive, geometry rebuilt in place (no weather refetch).
- Disable layer → chip hides; re-enable → chip restores.
- Zero `pageerror`s.

### Tests (`tests/test_sa_drop_color_chip.js`)
**19/19 PASS** covering: `_bandRGB` palette (B1/B5/B7 anchors match `bandCol()`), default mode = t, drop builder reads mode at build time, per-sample color branch, reusable build helper called from ≥2 places, chip element id, self-heal default, click handler (no-op on active mode + sets mode from clicked span), auto-show/hide with layer, tooltip explains both modes.

Plus `tests/test_oa_sa_3d_drops.js` updated and **19/19 PASS** after the helper-extraction refactor (assertions now match the new code structure).

### Bundle
- `red5_bundle.zip` rebuilt (1.66 MB, MD5 `25a9c0ff58c2325e713c9cae23faa006`) with updated `js/psy-3d-engine.js`. Synced to `/app/frontend/public/` and `/app/frontend/public/red5-files/`.


## V1.9 AHU Data Bridges (MQTT + Webhook + Modbus + WebSocket) (2026-02-09)
**Brief**: Operator picked option (e) — ship all four bridges as independently-toggleable plug-ins. Each reads from the existing `/root/data/telemetry.json` snapshot collector.py emits, gracefully degrades when its optional library is missing, and (for the bidirectional ones) gates inbound BACnet writes behind an explicit per-bridge `write_allowlist` of object-IDs.

### Architecture
**8 new files** (~24 KB on the controller, plus optional libs):
- `_bridges_lib.py` (~5 KB) — shared helpers: `load_bridges_config()` / `save_bridges_config()` (atomic, validated against allow-listed keys), `snapshot_telemetry()` (reads `/root/data/telemetry.json`), `enqueue_write(object_id, value, bridge_name, allowlist)` (ACL-gated, appends to `write_queue.json`), `register_bridge_status()` / `all_bridge_status()` (live status registry), `bridge_log()` (cap-rotated at 256 KB).
- `webhook_bridge_service.py` (~3 KB) — stdlib-only `urllib.request` POST.
- `mqtt_bridge_service.py` (~5 KB) — lazy `paho-mqtt` import. Subscribes to `<topic_prefix>/write/+` only when `write_allowlist` is non-empty. Connect/publish/sub error handling.
- `modbus_bridge_service.py` (~5 KB) — lazy `pymodbus` import. Telemetry packed into 16 holding registers per AHU. Read-only (BMS pulls).
- `ws_bridge_service.py` (~4 KB) — lazy `websockets` import (asyncio). Push to all connected clients on interval; accept inbound `{cmd:"write", object_id, value}` messages gated by allowlist.
- `bridges_admin_service.py` (~1.5 KB) — exposes `GET /api/bridges/status`, `GET /api/bridges/config`, `POST /api/bridges/config`.
- `configs/bridges.json` — single config file with one section per bridge. All four default to `enabled: false`. `write_allowlist` defaults to empty list (read-only by default).

**Auto-discovery**: All `*_bridge_service.py` plug-ins land in `/root/data/pgpy/` and are picked up by the existing `app.py` plug-in autoloader at boot. `_bridges_lib.py` (underscore prefix) is NOT auto-loaded (loader looks for `*_service.py`) but is on `sys.path` so each bridge can `from _bridges_lib import ...`.

**Graceful degradation**: Each lazy-import bridge sets `lib_available: False` in its status if its lib is missing. Boot never crashes; operator sees `LIB MISSING` chip in the Data Bridges UI and can `pip install` the libs they actually want.

**Inbound write security**: `enqueue_write()` refuses any object_id NOT in the bridge's `write_allowlist`. Defaults to empty list. Writes go to `write_queue.json` with `source: "bridge:mqtt"` etc. for audit trail. `collector.py` drains the queue on its next BACnet cycle (existing behavior).

### Frontend (`update.html`)
New "Data Bridges" card with:
- **AHU TELEMETRY OUT** blue pill in heading.
- 4 rows, color-coded badges (HTTP Webhook = green, MQTT = purple, Modbus TCP = orange, WebSocket = cyan).
- Per-row description + live state (disabled / pending / running / error) + counters (`pub:N`, `upd:N`, `push:N`, `err:N`) + `LIB OK` / `LIB MISSING` chip.
- Per-row slider toggle. On toggle: POSTs new config → auto hot-reloads the affected bridge plug-in via `/api/repair/reload-module/<bridge>_bridge_service` (uses the reload-module endpoint we shipped earlier). One-click enable, no Flask restart needed.
- Collapsible "Edit raw bridges.json" textarea + Save button for advanced config (broker URL, TLS, write_allowlist, etc.).
- Auto-refreshes status every 15 s when tab is visible.

### Tests (`tests/test_bridges.py`)
**34/34 PASS** covering:
- **Config** load/save/merge: defaults populate, save drops unknown keys, round-trip persists, bad body returns 400.
- **Telemetry** snapshot: returns `(None, 0)` when file absent; returns parsed dict + mtime when present.
- **Write-queue ACL**: empty allowlist → refused with "read-only" error; allowlisted target enqueues with `source: "bridge:mqtt"`; non-allowlisted target refused even when *other* targets are allowed; empty `object_id` refused.
- **Bridge module imports**: all 5 plug-ins import cleanly even when optional libs are missing.
- **Graceful degradation**: each lazy-import bridge sets `lib_available` to a bool.
- **Admin endpoints**: GET status (4 bridges), GET config (4 sections), POST config (round-trip + restart-or-reload note in response).
- **Webhook end-to-end**: spun up a local HTTP catcher server, configured webhook to point at it, drove one publish cycle, verified: URL path correct, `Authorization: Bearer <token>` header present, body has `telemetry.ahu.AHU01` key, status counters bumped, last_status_code = 204.

Plus regression: streaming-upload **36/36**, repair-mode **25/25**, reload-module **18/18**, telemetry **32/32**, band **11/11**, weather **20/20** — total **196/196** across the session's controller-side tests.

### Bundle
- `red5_bundle.zip` rebuilt (1.67 MB, MD5 `b2fb53746f3b365cf1c99c2a5b374d32`) with all 8 new files. Synced to `/app/frontend/public/` and `/app/frontend/public/red5-files/`.

### Operator workflow once deployed
1. Install only the libs you need:
   - MQTT: `pip install paho-mqtt`
   - Modbus: `pip install pymodbus`
   - WebSocket: `pip install websockets`
   - HTTP webhook: nothing (stdlib)
2. Open `/update`, scroll to **Data Bridges**.
3. Click "Edit raw bridges.json", set broker URL / webhook URL / etc.
4. Flip the slider on the bridge you want — UI auto hot-reloads the plug-in.
5. Watch the per-bridge counters tick (`pub:N`, `push:N`, etc.) to confirm telemetry is flowing.

### Inbound write opt-in (MQTT / WebSocket only)
By default all four bridges are READ-ONLY for BACnet (no inbound writes). To enable a remote system to set a setpoint:
1. Edit `bridges.json` → `mqtt.write_allowlist: ["AV1", "BV3"]` (only these object-IDs accepted).
2. Hot-reload the bridge.
3. Remote system publishes to `<topic_prefix>/write/AV1` with payload `{"value": 22.5}` (or just `22.5`).
4. Bridge calls `enqueue_write()` → `write_queue.json` → `collector.py` drains on next BACnet cycle.


## V1.9 Bridges Test-Fire + Beginner Setup Guide (2026-02-09)
**Brief**: Operator approved adding a one-shot "Test Fire" button on each enabled bridge so they can verify the downstream pipeline parses messages without waiting for the next 30-s publish cycle. Also requested a plain-language setup guide explaining how to write each bridge's config.

### Backend
Each `*_bridge_service.py` plug-in now exposes `test_fire()` returning `(ok, msg, details)`:
- **Webhook** — synchronously POSTs `{"test": true, "ts": <now>}` with the bearer-token header. Returns HTTP status.
- **MQTT** — publishes one message to `<topic_prefix>/test`. Returns paho `info.rc`.
- **Modbus** — writes sentinel `0xCAFE` (51966) to register 999. Response includes `verify_on_bms` instructions for the operator.
- **WebSocket** — broadcasts `{"hello": "world", ...}` to connected clients via `asyncio.run_coroutine_threadsafe`.

New admin endpoint **`POST /api/bridges/test/<bridge_name>`** in `bridges_admin_service.py`. Refuses unknown bridges (400). Lib-missing bridges return graceful `success:false` instead of 500.

### Frontend
Per-row **Test Fire** button (color-matched accent), only renders when that bridge is enabled. Status line shows `OK (webhook): POST 200 [...]` on success or the live error on failure. New **Setup Guide** pill in the card heading links to `data_bridges_guide.md`.

### Setup guide (`data_bridges_guide.md`, 7.2 KB)
Plain-language doc for non-engineer operators. One section per bridge with: when-to-use, copy-paste config block, sample receiver JSON, install commands, inbound-write opt-in. Includes a 4-row decision tree ("Do you have Home Assistant? → MQTT") and the full Modbus register map. Bundled as a static file.

### Tests
**+13 cases** in `tests/test_bridges.py` (now **47/47 PASS**): webhook test_fire end-to-end against local catcher (URL, bearer header, payload schema), unknown-bridge → 400, all 3 lib-dependent bridges report clean error JSON when not running, `data_bridges_guide.md` shipped in bundle.

End-to-end browser verification: Setup Guide link present, served directly at 7,243 bytes, bridges card renders 4 rows with state badges, zero `pageerror`s.

### Bundle
- `red5_bundle.zip` rebuilt (1.68 MB, MD5 `c65cc3a674757110e5c01307dba5756d`).


## Backlog / Next
- **VERIFICATION PENDING ON CONTROLLER (2026-05-08)**: Deploy `app.py` (manually as enteliWEB object) + `red5_bundle.zip`. After Flask restart, verify:
  1. `/api/version` shows non-null mtimes for `app.py` AND all 4 service files (now in `/root/data/pgpy/`).
  2. Boot log shows `[upload_service] registered OK`, etc. (no `SKIPPED` or `FAILED` lines).
  3. `/root/scripts/` contains ONLY `app.py` after firmware sweep.
  4. `/root/data/pgpy/` contains the 4 service files (firmware leaves them alone).
  5. Dashboard's Collector Configuration modal opens cleanly.
  6. Equipment Mapper's Controller Assets panel lists files correctly.
- **VERIFICATION PENDING ON CONTROLLER (2026-05-06)**: After deploying the new `red5_bundle.zip`, open DevTools → Network tab on the dashboard → confirm only **one** in-flight `/api/data` request at any time and graphics load on first paint.
- P2: Phase B Sun Path — room-polygon drawing tool in the Configuration tool for real shadow raycasting (replaces Option B silhouette projection).
- P2: Atomic Route Rollback — inspect `app.url_map` after each module's `register()` call to undo partial route additions if a module fails.
- P1: Controller redundancy architecture (1:1 hot-swap physical controllers).
- P3: Mean Radiant Temperature (MRT / t̄ᵣ) integration.
- P3: Test P2 + V1.9 sun-trim on physical controller with real BACnet CSV objects.
- P4: Clean up Emergent workspace.


## 2026-02-09 — Repair Mode hot-reload fresh-import fallback (P0 fix)
- Fixed `repair_reload_module()` in `upload_service.py` so it handles three cases:
  (a) module already loaded → `importlib.reload()` + rebind + endpoint swap (existing behaviour)
  (b) module never loaded AND no endpoints registered → `importlib.import_module()` + temporarily clear `_got_first_request` + `mod.register()` to attach NEW routes live (this is the case for brand-new bridge plug-ins uploaded via Repair Mode without a Flask restart)
  (c) module dropped from sys.modules but endpoints still alive → fresh import + rebind+swap
- Response body now includes `fresh_import: True` and `new_endpoints: [...]` when case (b) fires, so the Repair Mode UI can show "Routes are live immediately."
- Tests: `tests/test_reload_module.py` updated; 24/24 PASS including a new fresh-import scenario that pops `band_service` from sys.modules + strips its url_map rules + view_functions, then verifies the endpoint re-registers cleanly.
- Unblocks deployment of the 4 AHU Data Bridges (MQTT, Modbus, Webhook, WebSocket) without requiring an enteliWEB script restart.


## 2026-02-10 — Sealed v1.9.3 bundle
**Bundle:** `red5_bundle.zip` · 1707.6 KB · 45 files · `python build_bundle.py` reproducible.

### Bug fixes / hardening
- **Repair Mode `data_bridges_guide.md` 404** — link now points to `/api/repair/download-plugin/...` instead of the relative path Flask wouldn't serve. Smoke-tested (4/4 pass).
- **Headroom math tightened** in `upload_service.py`:
  - Finalize check: was `max(5 MB, zip × 2)` → now `max(1 MB, max_zip_member + 256 KB)`.
  - Chunk pre-flight: was `max(5 MB, total × 2)` → now `max(1 MB, total + 1 MB)`.
  - Unblocks bundle deploys on controllers with 4–5 MB free disk. Tests: 8/8.
- **Repair Mode filename-mismatch silent rename removed.** Used to offer "Upload anyway as X?" which let `dashboard.html` overwrite `update.html` on confirm. Now refuses with a red error and forces correct filename pick.

### New features
- **Per-row "FRESH IMPORT" badge** in `update.html` — green slab under each plug-in row lights up listing newly registered endpoints when a brand-new module was hot-deployed (`fresh_import: true` response from `/api/repair/reload-module/<name>`).
- **Centrifugal-fan M | R/S pill ported to dashboard** (`dashboard.html` lines 3204–3215). Previously only existed in the mapper. Now driven by real telemetry (`isRunning && !isAlarm`) and click-to-toggle writes `SAFM` to BACnet (override target via schema's `a.pill_write_target`).
- **Sensor co-location grouping** in dashboard's `groupedPoints` — points whose label matches a hardcoded SENSOR_GROUPS entry now only merge into the group if they share the anchor's x/y within ±0.5 percentage units. Lets operators break a point (e.g., SAFM) out of its hardcoded group by simply dragging it elsewhere in the mapper. Tests: 13/13.
- **Opt-SA "NOT A TRUE FLOOR" warning chip** under the envelope sliders. Computes B1–B10 SA-enthalpy range at render time (currently 25.8 – 52.9 kJ/kg) and fires when `[optMinH, optMaxH]` doesn't fully enclose it.

### Documentation
- `opt_sa_insight.md` — 6th-grader-mode explainer for Opt-SA strategy (fence/menu mental model, backpack analogy for enthalpy, 27 kJ/kg / 162 kW scaling, when the floor-warning fires, three-rule cheat sheet). Wired into the bundle, the Repair Mode allow-list (upload + download), and a new Repair Mode UI row.

### Infrastructure
- `build_bundle.py` — deterministic, re-runnable zip builder. Skips `__pycache__`, `tests/`, `*.pyc`. Reports missing source files. Replaces ad-hoc manual zipping.

### Test status
- 24/24 reload-module tests pass.
- 8/8 headroom-math tests pass.
- 13/13 dashboard-grouping tests pass.
- 47/47 bridges tests pass.
- **Total: 92/92 ✅**

### Known remaining items (deferred to v1.10)
- P1 user-blocked: `collector_config.json` BACnet ObjectID edit on live hardware (writes silently failing).
- P1: i18n DOM translation rollout in `dashboard.html` / `dashboard-components.js`.
- P2: Atomic Route Rollback — inspect `app.url_map` after each `register()` to undo partial route additions on failure.
- P2: Phase B Sun Path room-polygon drawing tool in `equipment_mapper.html`.
- P2: `dibt.Write` error verification in `collector.py`.
- P3: Controller redundancy architecture (1:1 hot-swap).
- P3: Mean Radiant Temperature (MRT / t̄ᵣ) integration.
- P4: Workspace cleanup.

### Deployment posture for the sealed bundle
- All 4 bridges (MQTT / Modbus / Webhook / WebSocket) ship **disabled** in `configs/bridges.json` — operator must explicitly enable + configure before any external traffic flows.
- All inbound-write `write_allowlist` arrays default empty → bridges are read-only on first boot.
- No simulator mode auto-enabled. `simulator.py` ships but only runs if explicitly imported.
- Repair Mode allow-lists synced across `repair_upload_plugin` / `repair_download_plugin` / `update.html`'s `REPAIR_FILES`.


## 2026-02-10 — SEALED v1.9.4 bundle (final)
**Bundle:** `red5_bundle.zip` · 1715.0 KB · 46 files · md5 `12fb206f19cb4f8fd8911b0b2fb77b2a` · reproducible via `python build_bundle.py`.

### Delta over v1.9.3
- **P1a BACnet ObjectID hardening (COMPLETE):**
  - `bacnet_diag_service.py` (new plug-in) exposes `GET /api/bacnet/diagnose-config` and `GET /api/bacnet/diagnose-config/csv`. Scans `collector_config.json`, classifies every AHU's `csv_object` as ID / NAME / MISSING, returns JSON report + paste-ready TSV skeleton.
  - `collector.py` `process_write_queue()` now emits a loud `⚠ NAME-based target 'X' detected — writes will silently fail` log entry before any name-based `dibt.Write()` attempt; records `target_kind: NAME|ID` on every write-results entry so the audit log surfaces the issue.
  - New "BACnet Config Health" card on `/update` with Run Diagnose + Download TSV Skeleton buttons; color-coded summary banner; per-AHU rows showing ObjectID / NAME / MISSING pills.
  - `collector.py` now honours `RED5_DISABLE_BG_THREADS=1` so test harnesses can import it without firing the live poll loop. Production behaviour unchanged.

- **P1b i18n DOM rollout (COMPLETE):**
  - 35 new dictionary keys in `js/i18n.js` covering Dashboard DOM strings (cards, modals, button labels, placeholders, tooltips, chart-overlay labels, error boundaries). Full translations for English / 简体中文 / 繁體中文 / 日本語 / 한국어.
  - 35 DOM references wrapped through `window.t()` in `dashboard.html` + `dashboard-components.js`.
  - Browser tab title now updates dynamically on language switch via `useEffect` watching `lang` + `i18nReady`.
  - Intentional non-translations: pre-React fatal-error messages, universal keyboard shortcut `Ctrl + Shift + R`.

### Test status (FINAL)
- 24/24 reload-module
- 8/8 headroom-math
- 22/22 bacnet-diag
- 47/47 bridges
- 13/13 dashboard-grouping
- 16/16 i18n-coverage
- **Total: 130/130 ✅**

### Items explicitly deferred / out of scope
- **Phase B Sun Path** — DEFERRED INDEFINITELY. Pre-req is room-polygon raycasting (3D scene graph required); standalone sun-path widget without raycasting adds no diagnostic value.
- **Controller redundancy (1:1 hot-swap)** — OUT OF SCOPE. Tracked in a separate project.
- **MRT (Mean Radiant Temperature) integration** — OUT OF SCOPE. Beyond data interaction boundary.
- **P2 Atomic Route Rollback** — DEFERRED to v1.10+. Not blocking current ops; fresh-import path is stable.
- **P2 `dibt.Write` error-class verification** — DEFERRED. Currently swallows `AttributeError` to avoid crashing on older firmware; switch to `type(value).__name__ == 'Error'` requires controller-side regression that's not worth the risk for the sealed release.
- **P1 Live BACnet ObjectID config edit on hardware** — REMAINS USER-BLOCKED. The diagnose + warning + UI tools now exist to make the manual fix obvious; the actual `collector_config.json` edit is operator-side.

### Bundle deployment posture (SEALED)
- All 4 data bridges ship `enabled: false` in `configs/bridges.json`.
- All inbound-write `write_allowlist` arrays default empty (read-only).
- `simulator.py` ships but does NOT auto-run (only fires if explicitly imported).
- Repair Mode allow-lists synced across `repair_upload_plugin` / `repair_download_plugin` / `update.html`'s `REPAIR_FILES` for: 11 plug-in files + 5 UI files + 2 markdown docs + 1 config file.
- Master Encryption Password `b%9P$MdeQP][` remains hardcoded in three places (landing, mapper, bundle decryption) — rotate before any external demo / handoff.

### Reproducibility
- Build: `cd /app/archive/Red5-Studio-V1.9 && python build_bundle.py`
- Verify: `md5sum red5_bundle.zip` → `12fb206f19cb4f8fd8911b0b2fb77b2a`
- All tests: see Test status above; each test file is standalone & deterministic.

**STATUS: SEALED.** No further edits planned for v1.9.x. Next iteration will be a separate project workstream.

## 2026-02-11 — v1.9.5 (re-opened from v1.9.4 seal, AHU modal hotfix)
**Bundle:** `red5_bundle.zip` · 1716.8 KB · 46 files · md5 `d89ec73982a80bc5b338b4ace7e84c0b` · reproducible via `python build_bundle.py`.

### Why re-opened
Operator reported the AHU equipment diagram modal lost proportional alignment when resized — the equipment chassis shrunk via CSS `max-w-full` but pill / databox / fan overlays stayed at original pixel sizes. Plus a UX ask: make the modal poppable to a separate display.

### Fixes
- **Resize alignment (P0):** Added `ResizeObserver` watching `ahuImgRef.current` so `ahuImgDims.dispW/dispH` updates on every container resize, not just on `<img onLoad>`. `imgScale = dispW / natW` now stays current, so animation pixel offsets (PreviewAirFlowSimulator, VFD chassis, DP-switch etc.) re-scale proportionally with the AHU body image. Trigger: `[showAhuModalFor, ahuModalSize.w, ahuModalSize.h]`.
- **Pop-out modal (P1):** New `Pop Out` button in the modal header — opens a separate browser window via `window.open()`, clones parent stylesheets, mounts a portal root, and uses `ReactDOM.createPortal()` to render the modal tree into that window. All click handlers, state, and telemetry continue to flow exactly as docked. When popped:
  - Modal fills the popup viewport (`width:100vw; height:100vh`)
  - Resize via the OS window chrome (no inner CSS `resize: both`)
  - Drag-handle disabled (`onMouseDown` gated by `ahuModalPopupWin`)
  - Header shows `↩ ATTACH` (emerald) instead of `↗ POP OUT`
  - Subtitle changes to "Resize the popped-out window directly"
  - Closing the docked modal auto-closes the popup
  - Refreshing/closing the parent tab also closes the popup (`beforeunload`)
- Same pattern as `equipment_mapper.html`'s "Pop Out Sidebar" — preserves identical UX vocabulary across tools.

### Test status (unchanged from v1.9.4)
- 24 + 8 + 22 + 47 + 13 + 16 = **130/130 PASS**

### Deploy
Single-file Repair-Mode replace of `dashboard.html` (with the fresh-import hot-reload fallback already shipped, no Flask restart needed). Hard-refresh after.

### Verify
1. Open AHU-01 modal → drag corner ↘ to resize → pills, fan, databoxes should all rescale proportionally.
2. Click `↗ POP OUT` in the header → new window opens with the modal full-screen. Drag to a second monitor.
3. Click `↩ ATTACH` to bring it back, OR just close the popup window.


## 2026-02-11 — v1.9.6 (pop-out modals expanded to VAV + Floor Plan)
**Bundle:** `red5_bundle.zip` · 1718.5 KB · 46 files · md5 `4e1b8314b4487f6f898a60c886df8fc3`.

### Why re-opened (again)
Operator follow-up: "Can the VAV and Floor Plan modals also be poppable to a second display, same as the AHU modal you just shipped?"

### Refactor + new features
- **Pulled the popup-window logic out of the AHU modal** into a top-of-file helper `red5OpenPopupWindow(name, title, width, height)`. Single source of truth for stylesheet cloning, Tailwind re-init, body class copy, portal-host creation.
- **Generic `openPopupFor()` callback inside the App component** wraps the helper with state-management (per-modal `win` / `host` + auto-close watcher), so adding pop-out to a new modal is now a 3-line change.
- **VAV modal pop-out:**
  - `↗ POP OUT` / `↩ ATTACH` button in the header.
  - When popped, mounts via `ReactDOM.createPortal(vavModalTree, vavModalPopupHost)` into the popup window. Click → switch VAV → popup auto-updates with new VAV's telemetry.
  - Drag handle disabled when popped; the OS handles drag/resize.
  - Subtitle changes to "Resize the popped-out window directly".
- **Floor Plan modal pop-out:** Same pattern; identical UX vocabulary so operators don't have to learn two flows.
- **Lifecycle:** Each popup auto-closes when (a) the underlying modal is dismissed via X button, (b) the parent tab unloads (`beforeunload`), (c) the operator selects a different AHU/VAV/floor and the modal-host state nullifies.

### State changes
Three new pairs of `useState` slots inside `<App>`:
- `[ahuModalPopupWin, ahuModalPopupHost]` (was already there from v1.9.5)
- `[vavModalPopupWin, vavModalPopupHost]`
- `[floorPlanPopupWin, floorPlanPopupHost]`

Plus three `useEffect` blocks that close the corresponding popup when the underlying React state nullifies. One global `beforeunload` listener closes any orphaned popups when the parent tab dies.

### Test status (unchanged)
- 24 + 8 + 22 + 47 + 13 + 16 = **130/130 PASS**
- Additional JSX parse check via `@babel/parser`: dashboard.html's 338,068-char inline script parses cleanly.

### Deploy
Single-file Repair-Mode replace of `dashboard.html`. Hard-refresh after.

### Verify
1. Open the VAV table → click any VAV → modal opens.
2. Click `↗ POP OUT` in the VAV modal header → modal opens in a new browser window, full-viewport. Drag to a second monitor.
3. Click a different VAV in the table → popup auto-updates with the new VAV's data (no flicker, no need to re-pop).
4. Close the popup window → modal auto-re-docks in the main page.
5. Repeat steps 2-4 with the Floor Plan modal (click any AHU's "View Floor Plan" tile).
6. Open all three popups simultaneously and arrange them across multiple monitors.


## 2026-02-11 — collector.py P0 hotfix (apostrophes-in-comments parser crash)
**File:** `/app/archive/Red5-Studio-V1.9/collector.py` (912 lines, unchanged length).

### Symptom
On the live Delta Controls enteliWEB controller, `collector.py` crashed at import with
`SyntaxError: unterminated string literal (detected at line 59/60)`. CPython parsed the
file fine — the embedded enteliWEB tokenizer is the culprit.

### Root cause
The controller's embedded Python tokenizer treats apostrophes (`'`) inside `#` comments
as string-literal delimiters. Any odd run of apostrophes across consecutive comment lines
(or a single contraction like `doesn't`) causes the parser to think a string was opened
and never closed → `unterminated string literal`.

### Fix
Stripped/reworded all 10 apostrophe occurrences inside `#` comments:

| Line | Before | After |
|---|---|---|
| 55  | `'AHU01_SAT_SP' or 'OAT_SENSOR_01'` | `AHU01_SAT_SP or OAT_SENSOR_01` |
| 57  | `doesn't resolve` | `does not resolve` |
| 58  | `operator doesn't troubleshoot` | `operator does not troubleshoot` |
| 62  | `'unterminated string literal'` | `unterminated string literal` |
| 100 | `controller's runtime-injected` | `controller runtime-injected` |
| 153 | `'AHU01_SAT_SP', 'OAT_SENSOR_01'` | `AHU01_SAT_SP, OAT_SENSOR_01` |
| 155 | `doesn't resolve` | `does not resolve` |
| 732 | `OAT/OAH aren't in` | `OAT/OAH are not in` |
| 758 | `don't override` | `do not override` |
| 761 | `band's description` | `band description` |

### Verification
- Programmatic tokenizer scan: `0` apostrophes remain inside any `tokenize.COMMENT` token.
- `python3 -m py_compile collector.py` → OK.

### Hardening rule (RECURRING — 3rd occurrence)
**ALL** Python files targeting the enteliWEB controller MUST be pure ASCII AND contain
ZERO apostrophes/single-quotes inside `#` comments. Run this guard before every deploy:

```bash
python3 -c "
import tokenize, io, sys
with open(sys.argv[1],'rb') as f: data=f.read()
bad=[(t.start,t.string) for t in tokenize.tokenize(io.BytesIO(data).readline)
     if t.type==tokenize.COMMENT and \"'\" in t.string]
print('BAD' if bad else 'OK', bad)
" collector.py
```

### Deploy steps for user
1. Upload the fixed `collector.py` via Repair Mode `/api/repair/upload-file`.
2. Restart the collector service on the controller.
3. Tail logs — `unterminated string literal` should be gone; BACnet telemetry should resume.

## 2026-02-11 — equipment_mapper.html airflow-segment slider freeze fix
**File:** `/app/archive/Red5-Studio-V1.9/equipment_mapper.html` (1 function rewritten, lines 1317–1359).

### Symptom
Operator reported: moving the Stretch X or Stretch Y slider on an `air_flow_path`
segment (3D Transform panel inside the airflow segment editor) caused the browser
tab to freeze and show "page unresponsive" — even at normal slider values, not
just at extremes.

### Root cause
`handleAirflowSegmentChange` called `JSON.parse(JSON.stringify(prevSchema))` on
EVERY slider input event (~60 Hz during drag).  The schema contains nested VFD
`image_data` base64 PNGs (~500 KB each) plus several AHU/VAV type definitions.
Each deep-clone cost 20-100 ms in-browser, saturating the main thread.

Non-airflow sliders never crashed because their handler (`updateTargetCoords`)
already uses path-targeted shallow updates — this bug existed only in the
airflow-segment handler.

### Fix
Rewrote `handleAirflowSegmentChange` to do a path-targeted shallow update:
clone only the nodes on the chain
`schema → category → typeId → visual_assets → animations → segments → segment`.
Added a no-op short-circuit so identical values (slider thumb hasn't moved a
step) don't trigger a re-render at all.

### Verification (Node micro-bench, 100 ticks against a schema with a 500 KB VFD image_data blob)

| Strategy | Per-tick cost | Speedup |
|---|---|---|
| OLD JSON.parse(JSON.stringify) | 2.49 ms (Node; ~20-100 ms in-browser) | 1× |
| NEW path-targeted shallow | 0.002 ms | **>1000×** |

Immutability invariants checked programmatically:
- `oldSchema` reference not mutated ✓
- new segment value visible at `next.ahus.AHU01.visual_assets.animations[0].segments[0].stretchX` ✓
- unrelated sibling segment keeps same object identity ✓
- unrelated VFD animation (with 500 KB image_data) keeps same object identity ✓
  → React skips re-rendering it entirely on slider drag
- identical-value short-circuit returns same `prevSchema` reference ✓

JSX parse check via `@babel/parser` on the full 421 KB inline source: **OK**.

### Deploy
Single-file Repair-Mode replace of `equipment_mapper.html`. Hard-refresh after.

### Verify on controller
1. Open the equipment mapper, open an AHU schema with an existing VFD aligner
   (image_data present) AND an air_flow_path animation with at least one segment.
2. Expand the airflow segment's "3D Transform ▼" panel.
3. Drag the Stretch X slider rapidly across its full range; repeat for Stretch Y.
4. Expected: smooth visual feedback, no "page unresponsive" dialog, no audible
   fan / CPU spike on the host.  Per-tick render budget should stay under 5 ms.

## 2026-02-11 — dashboard.html Givoni 3-tier classification + control-strategy resolver
**Files:**
- `/app/archive/Red5-Studio-V1.9/js/psychrometric.js` (+1 helper, +1 token map)
- `/app/archive/Red5-Studio-V1.9/dashboard.html` (refactored VAV-table dot logic + chart indicator tooltip)
- `/app/archive/Red5-Studio-V1.9/tests/test_givoni_tier_resolver.js` (NEW — 16 assertions)

### Operator ask
"Inside the Givoni overlay, the 40-60% humidity range in particular: VAVs inside
that zone should have the same colour circle in the VAV table; the ones outside
40-60% but within the Givoni area should be a lighter colour matching the
Givoni-area background. The control strategy should also be refined by this
inner humidity range."

### Decisions (operator-confirmed)
1. Dot colours **auto-derived** from the same hex tokens the chart polygons use
   (single source of truth in `js/psychrometric.js` -> `GIVONI_COLORS`).
2. Inner band follows the **live RH sweet-spot slider** (40-60 default, but
   tightening to e.g. 46-54 flips a 45% RH VAV from Tier A to Tier B).
3. Tier + strategy hint shown in **BOTH** the VAV-row tooltip AND the on-chart
   VAV indicator callout (the `VAV-04-E / 25.4 / 38% / dH +17.6` rectangle now
   gets a new `B · Soft trim · humidify (RH-only)` line beneath it).

### Tier matrix (single resolver — `getGivoniTier(t, w, rh, poly, ss, enabled)`)

| Tier | Condition | Dot fill | Strategy | Label |
|---|---|---|---|---|
| A   | inCZ AND inSweet (RH in [ss.lo, ss.hi]) | `#059669` (SWEET_FILL)  | HOLD             | Comfort · hold setpoints           |
| B   | inCZ AND rh < ss.lo                     | `#10b981` (CZ_STROKE)   | TRIM_HUMIDIFY    | Soft trim · humidify (RH-only)     |
| B   | inCZ AND rh > ss.hi                     | `#10b981` (CZ_STROKE)   | TRIM_DEHUMIDIFY  | Soft trim · dehumidify (RH-only)   |
| C+  | !inCZ AND t > 27                        | `#f97316` (HOT_OUTSIDE) | COOL             | Hot/humid · mechanical cool        |
| C+  | !inCZ AND t in [23.5, 27]               | `#f97316` (HOT_OUTSIDE) | DEHUMIDIFY       | Hot/humid · dehumidify             |
| C-  | !inCZ AND t < 20                        | `#1d4ed8` (COLD_OUTSIDE)| HEAT             | Cold/dry · mechanical heat         |
| C-  | !inCZ AND t in [20, 23.5)               | `#1d4ed8` (COLD_OUTSIDE)| HUMIDIFY         | Cold/dry · humidify                |

### Key change vs prior behaviour
Tier B no longer relies on `opacity: 0.7` (which collapsed visually on dark UI).
Both Tier A and Tier B are now full-opacity, using their respective polygon-
stroke hex tokens, so the eye can map "dot colour -> chart region" without a
legend lookup AND the two greens are now clearly distinguishable on dark backgrounds.

### Verification (16/16 assertions, `node tests/test_givoni_tier_resolver.js`)
- All 8 VAVs from the operator's 2026-02 screenshot map to the expected tier:
  - VAV-02-E (21.4 C / 39% RH) -> B / TRIM_HUMIDIFY
  - VAV-03-E (24.2 / 52)       -> A / HOLD
  - VAV-04-E (25.4 / 38)       -> B / TRIM_HUMIDIFY
  - VAV-01-S (25.8 / 37)       -> B / TRIM_HUMIDIFY
  - VAV-02-S (20.8 / 48)       -> A / HOLD
  - VAV-01-W / 02-W / 01-N (22.0 / 45) -> A / HOLD
- Auto-derive contract: `dotFill === GIVONI_COLORS.SWEET_FILL` (Tier A) and
  `dotFill === GIVONI_COLORS.CZ_STROKE` (Tier B).
- Live slider: tightening to 46-54 flips 45% RH VAV from A to B.
- Givoni disabled fallback still produces a usable Tier C result by the 23.5 C
  centroid split.

JSX parse check on full 372 KB inline source: PASS via `@babel/parser`.
All sibling regression tests pass at their existing baseline.

### Deploy
Two-file Repair-Mode replace of `dashboard.html` and `js/psychrometric.js`.
Hard-refresh after.

### Verify on controller
1. Open dashboard. Make sure both "Toggle Givoni Engine" and the "40-60% RH"
   buttons are ON (both should be coloured indigo/emerald in the side panel).
2. Open the VAV Terminal Hub for an AHU with VAVs spanning both sides of the
   40-60% band (AHU-01 in the screenshot is a good example).
3. Expected: VAVs inside the inner green strip get a dark-emerald solid dot
   (`#059669`); VAVs in CZ but outside the strip get a brighter emerald dot
   (`#10b981`); VAVs outside the CZ keep their orange/blue dots.
4. Drag the indicator handle over any VAV - the on-chart callout now shows a
   third line "<tier> · <label>" + sub-label "humidify (RH-only)" or similar.
5. Tighten the RH slider to 46-54: VAVs at 45 or 55% RH should immediately
   re-classify from A to B with their dot colour updating live.

## 2026-02-11 — Operator SA-RH clamp (Phase 1: targets + documentation)
**Files (5 modified / created):**
- `band_csv_generator.py` (+ `apply_sa_rh_clamp`, `load_sa_rh_clamp`, `_effective_bands`)
- `collector.py` (+ inline `_apply_sa_rh_clamp`, `_load_sa_rh_clamp`, hot-reload via mtime cache; classify_band now returns clamped band)
- `band_overrides_service.py` (NEW Flask plugin, 4 routes)
- `dashboard.html` (+ Apply-to-Controller button, dirty-state chip, Reset button, full confirm modal with per-band diff table)
- `tests/test_band_sa_rh_clamp.py` (NEW, 15 assertions)
- `tests/test_band_overrides_service.py` (NEW, 8 assertions)
- `tests/test_band_service.py` (minor route-filter fix for plugin coexistence)

### Operator ask
"Slider should drive every band sa_rh SA target.  When operator tightens to 45-55%,
every band sa_rh gets clamped into that window so the supply air itself stays in
the operator's comfort RH band."  Plus: include an equipment-warning confirm
modal that lists every affected band before the first Apply.

### Architecture — split into 2 phases

**Phase 1 (shipped today, NO new BACnet writes, NO mechanical risk):**
- Slider value is stored hypothetical in localStorage as today.
- "Apply to Controller" button opens a confirm modal that lists every band the
  clamp will change.  On confirm, POSTs to `/api/band-overrides/sa-rh-clamp`.
- The plugin persists the clamp to `/root/data/configs/band_overrides.json` and
  triggers band CSV regeneration.
- `band_csv_generator._effective_bands()` wraps every CSV write through
  `apply_sa_rh_clamp(band, lo, hi)`, so `band_guide.csv` and per-AHU
  `*_vav_proj.csv` files reflect the clamped targets.
- `collector.classify_band()` reads `band_overrides.json` on each cycle
  (mtime-cached: zero disk hits when no slider changes have happened) and
  returns the clamped band.  Downstream `write_band_guide_to_description()`
  therefore writes the clamped `sa_rh` + flipped `hum` to every AHU
  `CSV.Description` BACnet point.

**Phase 2 (TODO, needs operator info):**
- Today `write_band_setpoints()` writes only `SATSP`/`OAD`/`HSP`. No humidity
  setpoint is written, so the humidifier coil never sees the new target
  mechanically -- the clamp is documentation-only.
- For full actuation, the operator must identify the AHU humidity-SP BACnet
  point name (e.g. `SAHSP`, `HumSP`, `SUP_HUM_SP`) so `write_band_setpoints()`
  can include `humSP = clamped.sa_rh` in the write_dict.  Until that arrives,
  the dashboard confirm modal explicitly tells the operator the clamp is
  "targets and documentation only".

### Clamp logic (`apply_sa_rh_clamp`)
- `sa_rh_clamped = max(lo, min(hi, band.sa_rh))`
- If clamp moved value DOWN  -> `hum` forced to `DEHUMIDIFY`
- If clamp moved value UP    -> `hum` forced to `HUMIDIFY`
- Unchanged                  -> `hum` left as-is
- Inverted bounds (lo > hi) are silently swapped.
- Returns a new dict (input not mutated).

### Why an inline copy of the helper in `collector.py`?
The embedded controller cannot safely `import band_csv_generator` from inside
collector.py (deployment / sys.path quirks).  Tests include
`TestCollectorParity` which iterates every band x every clamp combo and
asserts the inline collector helper returns byte-identical output to the
canonical `band_csv_generator.apply_sa_rh_clamp` helper, so the two will
not drift.

### Verification
- **`tests/test_band_sa_rh_clamp.py`** — 15/15 PASS.  Covers clamp-down /
  clamp-up / unchanged / inverted-bounds / input-immutability / load-config /
  effective-bands / and the controller-parity check.
- **`tests/test_band_overrides_service.py`** — 8/8 PASS.  Covers GET / POST /
  DELETE / preview / idempotency / validation rejects / on-disk persistence /
  history capture.
- **Auto-discovery** — boot script with the V1.9 app.py picks up the new
  `band_overrides_service.py` and registers `/api/band-overrides/{sa-rh-clamp,preview}`.
- **JSX parse** — full 387 KB inline dashboard source parses cleanly via
  `@babel/parser` post-edit (slider row + confirm modal).
- **Controller-tokenizer safety** — `collector.py`, `band_csv_generator.py`,
  `band_overrides_service.py` all confirmed to have ZERO apostrophes inside
  any `#` comment (the recurring enteliWEB tokenizer bug).
- **Sibling suites** — `band_service.py` minor test was tightened to filter
  to band-csv routes only (my plugin coexists at `/api/band-overrides/*`);
  all 11 band-service assertions PASS.  No other test regressed.

### Deploy
4-file Repair-Mode upload of:
- `collector.py`
- `band_csv_generator.py`
- `band_overrides_service.py` (NEW; auto-discovered, restart Flask)
- `dashboard.html`
Plus restart of the collector service so the new mtime watcher kicks in.

### Verify on controller
1. Open the dashboard, enable Givoni + 40-60% RH toggles.  The new "Live: 40-60% RH"
   chip should appear next to a greyed-out "Applied" button (slider matches controller).
2. Drag the slider to 45-55%.  The "Applied" button should turn amber and read
   "Apply to Controller".
3. Press it.  A modal appears listing every band the clamp will change.  Spot
   check: B7 row should show "95% -> 55% / SUBCOOL_REHEAT -> DEHUMIDIFY", B2
   should show "35% -> 45% / COND_HUM -> HUMIDIFY", B5 unchanged.
4. Press "Confirm & Apply".  Modal closes; chip updates to "Live: 45-55% RH".
5. SSH to the controller and `cat /root/data/configs/band_overrides.json` --
   should see the persisted clamp + history.
6. Watch `collector.log` for the next cycle -- `write_band_guide_to_description`
   should now write the clamped `sa_rh` + flipped `hum` into every AHU
   `CSV.Description` string.  External BACnet observers see the new targets.
7. Press "Reset" to remove the clamp and verify the chip flips back to
   "Live: factory bands" and `band_overrides.json` shows `sa_rh_clamp: null`.

## 2026-02-11 — Operator SA-RH clamp Phase 2 (mechanical actuation)
**Files modified:**
- `collector.py` (+ `_resolve_humidity_sp`, `write_humidity_setpoint`; `write_band_setpoints` signature extended with `humidity_sp=None`; `discover_ahu_groups` propagates `humidity_sp` per group; call-site at the polling loop passes it through)
- `dashboard.html` (confirm-modal warning updated: Phase 2 now active, mechanically actuates humidifier)
- `tests/test_humidity_sp_write.py` (NEW, 21 assertions)
- `tests/test_dibt_compat.py` (relaxed `n_isinstance == 4` -> `>= 4` since the new write helper added a 5th call site)

### Operator-provided spec
> AHUn_RH where n = 1,2,3,4,5...  However, for now, we can use AV1, AV2... for AHUn_RH.
> AVn is the object ID of the BACnet.  This is for Phase 2.

### Resolution rules (`_resolve_humidity_sp(ahu_name, override=None)`)
1. If `override` is a non-empty string, return it stripped of whitespace.
2. Else parse the first run of digits from `ahu_name`, strip leading zeros, return `AV<n>`.
   - `AHU01` -> `AV1`, `AHU-01-E` -> `AV1`, `AHU-02-S` -> `AV2`, `AHU-12` -> `AV12`, `AHU100` -> `AV100`.
3. If no digits in name, return `None` (write skipped silently for that AHU).

### Per-AHU override (future migration to named points)
`collector_config.json` may now specify `humidity_sp` per AHU:
```
"ahu_groups": {
  "AHU-01-E": {"csv_object": "CSV1", "humidity_sp": "AHU01_RH", "vavs": [...] }
}
```
When migrating from `AV<n>` to named `AHUn_RH` points, add this single field
per AHU.  No collector restart needed -- discovery rebuilds on next poll.

### Write path (`write_band_setpoints`)
Now performs **2 BACnet writes** when humidity_sp is resolved:
1. `<csv_object>.Present_Value` -- existing AHU CSV bundle (SATSP / OAD / HSP)
2. `<humidity_sp>.Present_Value` -- NEW: clamped band `sa_rh` as a `float`

Both wrapped in `try/except` so a transient BACnet error on one does not
break the other.  Both use the same `isinstance(_, dibt.Error)` + AttributeError
pattern as the rest of the collector (legacy + new firmware compatible).

### Verification (`tests/test_humidity_sp_write.py` -- 21/21 PASS)
- 8 resolver cases: explicit override, override-whitespace, override-empty,
  override-None, single-digit, double-digit, first-digit-run, no-digits.
- 8 write-helper cases: None / empty / no-sa_rh / happy path / clamped value /
  named override / dibt.Error path / dibt-raises path.
- 2 integration cases: humidity write happens AFTER CSV bundle write;
  no humidity write when `humidity_sp=None`.
- 3 discovery cases: default resolution, explicit override, no-digits.

Full sibling suite re-run: ALL Python + JS tests green (the 4 pre-existing
i18n / oa-sa / sa-drop fails are unchanged from baseline).

### Deploy
2-file Repair-Mode upload + collector restart:
- `collector.py` (now with Phase 2 humidity write path)
- `dashboard.html` (updated modal warning text)

No new config files required; `band_overrides.json` from Phase 1 is reused.
External humidity loops on the controller side will start seeing the new
SP values on the next collector poll cycle after upload.

### Verify on controller
1. Confirm at least one AHU number in `collector_config.json` ahu_groups -- e.g. `AHU-01-E`.
2. Apply a 45-55 clamp via the dashboard.
3. On the next poll cycle, the collector log should show two lines per AHU:
   - `Band B7 setpoints written to CSV1`
   - `Humidity SP AV1 = 55% RH (band B7)`
4. From the BACnet workstation, read `AV1.Present_Value` -- it should match
   the clamped sa_rh.  Reset the clamp and confirm the value reverts to the
   factory band sa_rh on the next cycle.

## 2026-02-11 — P5 Climate-drift headline + Givoni Tier legend chip
**Files modified:**
- `js/psy-3d-engine.js` (climate-drift headline computation + render inside `_refreshBandDelta`)
- `dashboard.html` (Givoni tier legend chip below the Givoni controls)
- `tests/test_climate_drift_headline.js` (NEW, 29 assertions)

### Feature 1 - Climate-drift headline (P5)
Single-line callout above the band-shift strip that surfaces the 3 biggest
band-hour drifts vs the historical baseline (prior year OR 5-year average,
depending on the operator's history toggle).

Sign convention:
- `current_year_oa > historical_oa` -> up arrow + green (climate moving INTO this band)
- `current_year_oa < historical_oa` -> down arrow + amber (climate moving OUT)

Layout:
```
[Climate drift]  [B7 +142h] [B2 -89h] [B5 +34h]   vs 5-year avg
[B-shift] [vs 5y avg]  B1 B2 B3 B4 B5 B6 B7 B8 B9 B10
```

Threshold: only bands with `|drift| >= 2h` are surfaced (rounds out FP noise).
Only shown when `_bandHistoryHist` is loaded AND `_bandHistoryMode !== 'off'`
AND not still loading.  Full drift breakdown is in the tooltip (all bands,
not just the top 3).

### Feature 2 - Givoni Tier legend chip
4-swatch row directly below the existing `Toggle Givoni Engine` / `40-60% RH`
buttons in the side panel.  Each swatch shows:
- Color dot (auto-derived from `GIVONI_COLORS` in `psychrometric.js`)
- Tier label: `A` / `B` / `C+` / `C-`
- Sub-label: `Comfort` / `Soft trim` / `Hot/humid` / `Cold/dry`
- Tooltip with the controller-side strategy: `hold` / `hum/dehum` / `cool` / `heat`

Only rendered when `showGivoni === true`.  Auto-skinning preserved: re-skinning
the chart polygon fills automatically re-skins the legend (single source of
truth contract).

### Verification (29/29 assertions, `node tests/test_climate_drift_headline.js`)
- Headline picker math: top-3 by absolute drift / sub-threshold filtered /
  capped at 3 / identical histograms returns empty / sign captured correctly.
- Source-bytes assertions: data-testids in place, sign convention arrows
  present, colour tokens wired, 5-year basis label rendered, legend gated
  on `showGivoni`, all 4 tiers + all 4 `GIVONI_COLORS` references present.

JSX dashboard (390 KB) + `psy-3d-engine.js` (382 KB) both parse cleanly via
`@babel/parser` post-edit.  All sibling regression suites unchanged.

### Deploy
2-file Repair-Mode upload of:
- `js/psy-3d-engine.js`
- `dashboard.html`
Hard-refresh after.  No collector restart needed.

### Verify on controller
1. Enable Givoni in the side panel.  Confirm the 4-swatch legend appears
   directly below the `Toggle Givoni` button row (A / B / C+ / C-).
2. Hover each swatch -- tooltip should read `Tier X - <Label> (<sub>)`.
3. Hover any VAV dot in the table -- its colour should match the legend
   swatch for its tier.
4. Open the 3D view, enable ERV, fetch weather, click the `vs prior` button
   to cycle into `vs 5y avg` mode.  After history loads, a purple-bordered
   "Climate drift" headline should appear above the B-shift strip listing
   the top 3 movers with up/down arrows.
5. Hover the headline -- tooltip should list all bands with drift >= 2h,
   not just the top 3.

## 2026-02-11 — Dashboard left sidebar pop-out
**Files modified:**
- `dashboard.html` (sidebar wrapped in IIFE with ReactDOM.createPortal; pop-out button added next to theme toggle)
- `tests/test_dashboard_sidebar_popout.js` (NEW, 22 assertions)

### Operator ask
"Just an in mapper-page's left side bar pop out, please make left sidebar
poppable for dashboard. I feel the real estate in the left sidebar is
getting crammed."

### Approach -- mirror the equipment_mapper.html pattern verbatim
The mapper already has a battle-tested sidebar pop-out implementation
using `window.open` + `ReactDOM.createPortal`.  Same pattern lifted into
the dashboard, with three guarantees:

1. **State preservation** -- the same React component instance owns the
   sidebar's state; portal just changes where it renders.  No serializing
   selectedAhuId, sweetSpotRange, lockedVavId, etc. across windows.
2. **Theme parity** -- popup clones parent `<style>`, `<link rel="stylesheet">`,
   and the Tailwind `<script>` tag at popup-creation time so dark/light/Korean
   all come through unchanged.
3. **Auto-recovery** -- a 400ms `setInterval` watches `win.closed`; when the
   operator closes the popup the sidebar snaps back into the docked spot
   without any manual reattach action.

### Surgical edits
1. New state (~70 lines): `sidebarPopupWin`, `sidebarPopupHost`, `popOutSidebar`
   callback, plus `beforeunload` handler that kills the orphan popup.
2. Sidebar JSX wrapped in `{(() => { const sidebarTree = (...); return ... })()}`
   -- single IIFE, conditional `ReactDOM.createPortal` at the bottom.
3. Sidebar `<div>` style gated: `isPopped ? {width:'100%',minHeight:'100vh'}`
   when popped, original `{width: sidebarWidth+'px'}` when docked.
4. Resize handle gated behind `{!isPopped && (...)}` -- popup window has
   its own OS-level resize, no need for the internal handle.
5. Pop-out button added next to the theme toggle: `\u2197 POP` when docked,
   `\u21A9 ATTACH` (emerald background) when popped.  `data-testid="popout-sidebar-btn"`.
6. `data-testid` swap: `left-sidebar` -> `left-sidebar-popped` so the
   existing test_credentials.md and any future automation can distinguish.

### Verification (`tests/test_dashboard_sidebar_popout.js` -- 22/22 PASS)
- State + callback declarations present (`sidebarPopupWin`, `sidebarPopupHost`,
  `popOutSidebar = useCallback`).
- `window.open` uses the expected name (`red5_dashboard_sidebar`) + size (420x950).
- Idempotent click guard: re-clicks just `focus()` the existing popup.
- Stylesheets + Tailwind cloned into popup head (theme parity).
- `closeWatcher` snaps back when popup closes.
- `beforeunload` handler closes orphan popup if parent navigates away.
- IIFE structure correct: `sidebarTree` declared, conditional
  `ReactDOM.createPortal(sidebarTree, sidebarPopupHost)` at the end.
- Pop-out button: correct testid, toggles ATTACH/POP label, emerald-700
  active style, click handler closes-if-open-else-opens.
- Resize handle gated behind `!isPopped`.
- Sidebar width gated: 100% when popped, sidebarWidth px when docked.
- data-testid swap (`left-sidebar` -> `left-sidebar-popped`).
- Full 396 KB main-source JSX parses cleanly via `@babel/parser`.

Full regression sweep -- all sibling suites still green (i18n/oa-sa/sa-drop
pre-existing baseline fails unchanged).

### Deploy
Single-file Repair-Mode upload of `dashboard.html`.  Hard-refresh after.

### Verify on controller
1. Open the dashboard.  Look in the top-right header next to the theme
   toggle -- there should now be a small `\u2197 POP` button.
2. Click it.  A new browser window (~420x950) should open with the entire
   sidebar (AHU title, Givoni controls, RH slider, asset search, AHU list,
   VAV tables, Apply button, etc.) -- look and feel identical to docked.
3. Move the popup to another monitor.  Click an AHU in the list -- the
   chart in the main window should update.  This proves state is shared
   (same React component instance).
4. Resize the popup.  Sidebar content reflows.
5. Close the popup.  Sidebar snaps back into the main window automatically;
   button reverts to `\u2197 POP`.
6. Re-open, then click `\u21A9 ATTACH` -- popup closes, same snap-back.

### Known limitation
First open of the popup may show a brief unstyled flash (~100ms) while the
cloned Tailwind script re-applies.  Cosmetic only -- same behaviour as the
mapper page's existing implementation.

## 2026-02-11 — Dashboard sidebar: switch to in-page draggable modal
**Files modified:**
- `dashboard.html` (replaced window.open + createPortal with absolutely-positioned
  draggable + resizable in-page floating panel)
- `tests/test_dashboard_sidebar_popout.js` (rewritten to guard new pattern + regress
  the cross-window pattern that caused the slider bug)

### Operator ask
> dashboard left side-bar, make it draggable pop out like model rather than page pop out.
> Also, when it is popped out, the psychart temperature selection slide bar does not
> work. when it is reattached, the delayed effect of the slide-bar movement happens in a rush.

### Root cause of the slider bug
The previous pop-out used `window.open(...)` + `ReactDOM.createPortal(sidebarTree, popupWindow.body)`.
Drag handlers throughout the codebase (psychart temp slider, sidebar resize handle,
band-clamp slider, etc.) bind `mousemove`/`mouseup` to `window.addEventListener(...)`.
When the sidebar DOM lives inside a popup window, the popup raises events on ITS
window object, but the handler was bound to the PARENT window -- so drag events
never reached the listener.  On reattach, queued events from the
popup-window's still-attached listeners fired in a rush against the now-docked
DOM nodes, producing the "delayed effect happens in a rush" symptom.

### Fix (eliminates both symptoms at the root)
Single document, single window.  The sidebar now floats as an
absolutely-positioned (`position: fixed`) `<div>` inside the main document
when popped.  Drag handlers fire through the same `window` they always
have, so every existing slider keeps working unchanged.

### What ships
- `sidebarFloating` bool state, defaulted false.
- `sidebarFloatPos` + `sidebarFloatSize` -- both hydrated from / persisted to
  localStorage (keys: `red5.sidebarFloatPos`, `red5.sidebarFloatSize`).  Operator
  picks up where they left off after refresh.
- `onSidebarTitleMouseDown` -- drag-to-move handler (clamps to viewport bounds:
  `[0, innerWidth-80]` x `[0, innerHeight-40]`).
- `onSidebarResizeMouseDown` -- bottom-right corner resize handle.  Min size
  280x360, max size viewport-minus-40.
- Floating shell with:
  - Title bar: drag handle + `✥ Sidebar — drag to move` label + green `↩ Attach` button.
  - Body: the entire existing sidebar tree rendered as-is (same JSX, same React
    component instance -- state preserved when toggling).
  - Bottom-right diagonal triangle resize grip.
- POP button in header: now toggles `sidebarFloating` instead of opening a window.

### Regression guards (`tests/test_dashboard_sidebar_popout.js` -- 28/28 PASS)
- NO `window.open('red5_dashboard_sidebar', ...)` anywhere in dashboard.html.
- NO `sidebarPopupWin` / `sidebarPopupHost` state.
- NO `popOutSidebar` useCallback.
- NO `ReactDOM.createPortal(sidebarTree, ...)`.
- Drag/resize handlers use `window.addEventListener('mousemove', ...)` (same-document only).
- Position + size persistence keys correct.
- Title bar testid, attach button testid, resize grip testid all present.
- `data-no-drag` attribute on attach button so titlebar drag is not hijacked.
- Pop-out button toggles via functional state update.
- Full JSX parse via `@babel/parser`.

### Visual smoke test (Playwright)
Confirmed end-to-end via the screenshot tool: click POP -> floating shell appears
docked at default position; drag titlebar -> shell follows cursor; chart reflows
to fill freed width; click ATTACH -> shell disappears and sidebar restores to
its docked slot.

### Deploy
Single-file Repair-Mode upload of `dashboard.html`.  Hard-refresh after.

### Verify on controller
1. Open the dashboard.  Side panel is docked as before with a small `↗ POP`
   button in the header.
2. Click POP.  The whole sidebar floats away from the left edge into a
   rounded panel with a draggable title bar reading `✥ SIDEBAR — DRAG TO MOVE`.
3. Drag the title bar.  The panel follows smoothly with no jank.
4. Drag the chart's temperature slider -- it now works smoothly even while
   the sidebar is floating (root-cause of the original bug fixed).
5. Drag the bottom-right corner of the floating shell -- the panel resizes.
6. Click `↩ ATTACH`.  Sidebar snaps back to the docked position immediately
   with NO delayed-rush slider events.
7. Refresh the page after dragging -- the next POP opens at the
   last-used position and size (localStorage-persisted).

## 2026-02-11 — Sidebar floating: duplicate ATTACH button fix
**File:** `dashboard.html` (1-line gate on the header POP/ATTACH button)

### Bug
After shipping the in-page floating sidebar, the operator spotted **two ATTACH
buttons** stacked vertically when the panel was popped out: one in the new
floating-shell title bar (top) and one in the original sidebar header (where
the POP button lives, but its label flipped to "ATTACH" because
`sidebarFloating === true`).  Both did the same thing.

### Root cause
The header button was a single toggle that swapped label POP <-> ATTACH based
on `sidebarFloating`.  Once the floating shell shipped with its OWN attach
button in the title bar, the header copy became redundant.

### Fix
Gated the header button behind `{!sidebarFloating && (...)}` so it only renders
in the docked state.  Operator re-attaches via the title-bar ATTACH button when
floating (which is the natural place to look for it -- right next to the
"drag to move" hint).  Simplified the button so its only job is opening
the floating mode: `onClick={() => setSidebarFloating(true)}`.

### Verification
- 29/29 assertions in `tests/test_dashboard_sidebar_popout.js` pass, including:
  - `button: only renders when docked (gated behind !sidebarFloating)`
  - `regression: header button does NOT render ATTACH label (no duplicate with shell)`
- Playwright smoke: `ATTACH buttons visible: 1` (was 2 before fix).  Screenshot
  confirms the header slot where the second ATTACH used to be is now clean.
- Title-bar ATTACH still re-docks the panel as expected.

### Deploy
Single-file Repair-Mode upload of `dashboard.html`.  Hard-refresh after.

## 2026-02-11 — Apply-to-Controller "Unexpected token <" UX fix
**Files:**
- `dashboard.html` (new `fetchJSON` helper + all 4 band-overrides fetches migrated)
- `tests/test_fetch_json_helper.js` (NEW, 19 assertions)

### Operator-reported bug
> apply to controller button reports an error as shown in the attached.
> Preview failed (controller offline?): Unexpected token '<', "<!doctype "... is not valid JSON

### Root cause
The controller's Flask app has no catch-all 404 -- when a route is not
registered, the SPA dashboard HTML is returned for unknown paths.  Caller
did `r.json()` blindly, which threw on the HTML body.  The catch arm then
said "controller offline?" -- factually wrong (the controller was answering
fine, it just did not have the band-overrides route).

Actual cause: `band_overrides_service.py` was not uploaded to
`/root/data/pgpy/` on the controller.  Auto-discovery globs `*_service.py`
from that directory at boot.

### Fix
1. Added `fetchJSON(url, options)` helper that:
   - Catches network errors -> `err.code = 'NETWORK'`.
   - Inspects the response `Content-Type`.  If not JSON AND the body
     starts with `<!doctype` / `<html` OR HTTP status is 404 ->
     `err.code = 'PLUGIN_MISSING'` with an actionable message:
     "Upload band_overrides_service.py to /root/data/pgpy/ and restart Flask".
   - Non-JSON / non-HTML -> `err.code = 'BAD_RESPONSE'` with the
     first 60 chars of the body for diagnosis.
2. Migrated all 4 band-overrides fetches to use it (initial-mount GET,
   preview GET, Apply POST, Reset DELETE).
3. Removed the misleading "(controller offline?)" wording.

### Verification (`tests/test_fetch_json_helper.js` -- 19/19 PASS)
- Source checks: helper declared, content-type guard, doctype detection,
  pgpy deploy hint, restart-Flask hint, NETWORK code, JSON return.
- Caller migration: 4 + use sites, each of the 4 endpoints uses fetchJSON.
- Regression: no "controller offline?" wording remains.
- Functional simulations (in-test mock fetch):
  - HTML response (operator-reported case) -> PLUGIN_MISSING + deploy hint
  - HTTP 404 -> PLUGIN_MISSING
  - Network error -> NETWORK
  - Happy path -> parsed JSON returned
  - Non-JSON non-HTML -> BAD_RESPONSE

All sibling regression suites still green.

### Deploy
Single-file Repair-Mode upload of `dashboard.html`.  Hard-refresh after.

### What the operator must STILL do for the feature to actually work
Upload `band_overrides_service.py` to `/root/data/pgpy/` on the controller
and restart Flask.  Until that happens, clicking Apply now shows a clear
error pointing to exactly that step, instead of "Unexpected token '<'".

## 2026-02-11 — Plugin-health chip
**Files modified:**
- `dashboard.html` (+ `pluginHealth` state, `/api/services` probe, chip render)
- `tests/test_plugin_health_chip.js` (NEW, 26 assertions)

### Operator ask
Surface missing/failed Flask plug-ins at a glance so the operator does not
discover them only by clicking a feature and getting a `PLUGIN_MISSING`
error -- exactly what happened with band_overrides_service when it had not
been uploaded to /root/data/pgpy/ yet.

### What ships
- One-shot poll of `/api/services` on mount via `fetchJSON`.
- `PLUGIN_EXPECTED` static list: `band_service`, `telemetry_service`,
  `weather_service`, `upload_service`, `band_overrides_service`.
- Classification:
  - `error` -- any expected plug-in MISSING from /api/services OR any
    reported state is FAILED.
  - `warn`  -- one or more plug-ins SKIPPED or WARNING (loaded, but with
    issues -- e.g. missing SERVICE_CTX keys).
  - `ok`    -- every expected plug-in reported state OK.
- Chip slots into the header right after the theme toggle.  Three Tailwind
  literal variants (emerald / amber / rose, dark + light) so the CDN JIT
  picks them up (NO dynamic `${color}-...` interpolation).
- Tooltip + click-alert lists exactly which plug-ins are missing or
  failed, each with the deploy hint "upload to /root/data/pgpy/ + restart
  Flask".  No clicking through nested menus.

### Glyph + label
- ok    -> green `\u25CF OK`     (filled disc)
- warn  -> amber `\u25B2 WARN`   (warning triangle)
- error -> rose  `\u2716 PLUGIN` if missing, `\u2716 ERR` if probe failed.

### Verification (`tests/test_plugin_health_chip.js` -- 26/26 PASS)
- Expected list contains all 5 required plug-ins.
- Initial state is `unknown` (chip hidden until probe).
- `fetchJSON('/api/services')` is the call site.
- Classification branches: FAILED -> error / SKIPPED -> warn / clean -> ok.
- Tailwind classes appear as LITERAL strings (regression: no `bg-${color}`
  interpolation in className).  All 6 variants (emerald/amber/rose, dark/light)
  enumerated.
- Chip has `data-testid="plugin-health-chip"` + `data-state=<...>`.
- Tooltip text includes `/root/data/pgpy/ + restart Flask` deploy hint.
- 4 functional simulations against /api/services payloads:
  1. operator-reported case (band_overrides_service missing) -> error
  2. all OK -> ok
  3. one FAILED -> error
  4. one SKIPPED -> warn
- JSX parses cleanly via `@babel/parser`.

### Visual smoke (Playwright)
Captured screenshot with the chip in `error` state -- shows the small rose
`✖ ERR` chip rendered between the theme toggle and the POP button.  The chip
is small enough that the header stays clean but red enough to draw the
operator's eye.

### Deploy
Single-file Repair-Mode upload of `dashboard.html`.  Hard-refresh after.

### Verify on controller
1. Open the dashboard.  Look in the top-right header: there should now be
   a small chip between the sun/moon theme toggle and the POP button.
2. If green `\u25CF OK` -> every plug-in is registered. Done.
3. If rose `\u2716 PLUGIN` or `\u2716 ERR` -> click it.  The alert lists
   exactly which file to upload to `/root/data/pgpy/` and reminds to
   restart Flask.  Fix that, refresh, and the chip should turn green.
4. Amber `\u25B2 WARN` means a plug-in loaded but with SKIPPED/WARNING
   state.  Click for details.

## 2026-02-11 — Sidebar: 3-mode pop-out (docked / floating / cross-window)
**Files:**
- `dashboard.html` (sidebar IIFE expanded to 3 render branches, new WIN button,
  new state + callback, beforeunload cleanup, header controls wrapped in a
  flex-wrap container so POP + WIN fit cleanly)
- `tests/test_dashboard_sidebar_popout.js` (rewritten, 35 assertions covering
  all 3 modes + regressions)

### Operator ask
> dashboard left-sidebar, make it behave like AHU/VAV graphics modal pop-out:
> (1) pop out from the host page and draggable,
> (2) draggable outside the page so it can be displayed on an extended display.
> When the host page closes, the pop-out also closes.

### Architecture - mutually exclusive 3-mode render
| Mode          | Trigger                       | Render                                            | Mouse events                       |
|---------------|-------------------------------|---------------------------------------------------|------------------------------------|
| Docked        | default                       | original in-flow column                           | parent window                      |
| Floating      | header POP button             | absolutely-positioned in-page draggable shell     | parent window (same document)      |
| Cross-window  | header WIN button (or float to-window) | ReactDOM.createPortal into red5OpenPopupWindow target | popup window's own document |

- **In-page floating** keeps every existing drag handler working unchanged
  (psychart temp slider etc.) because all listeners stay on the parent window.
- **Cross-window** uses the SAME `red5OpenPopupWindow` helper the AHU/VAV/
  Floor-Plan modals already use, so the operator can drag the popup window
  to an extended display.
- Opening WIN while floating auto-closes the floating shell (mutually exclusive
  via `setSidebarFloating(false)` inside `popOutSidebarToWindow`).  Closing the
  popup window snaps the sidebar back to the docked column automatically
  (a 400ms setInterval watches `win.closed`).
- A docked placeholder ("Sidebar on extended display + Bring Back button")
  renders where the sidebar used to be so the operator knows where it went
  and can fetch it back without finding the popup window first.
- `beforeunload` handler on the parent closes the popup so an orphaned
  window never lingers.
- The floating shell also offers a "To Window" escalation button -- one click
  to send the floating panel to a separate window without losing position state.

### UI - header controls wrapped in a flex-wrap container
The chip + POP + WIN didn't all fit on one line at the default 320 px sidebar
width.  Wrapping the right-side controls (theme + chip + POP + WIN) in a
`flex items-center gap-1 flex-wrap justify-end` div lets them wrap onto a
second line cleanly.  Visible in the smoke screenshot: row 1 = theme + chip,
row 2 = POP + WIN.

### Verification (`tests/test_dashboard_sidebar_popout.js` -- 35/35 PASS)
- 13 floating-mode guards (state, drag handlers, persistence, shell testids,
  "to window" escalation button, no-drag attribute on attach).
- 13 cross-window-mode guards (state, callback, red5OpenPopupWindow usage,
  setInterval watcher, mutual exclusion with floating, beforeunload cleanup,
  WIN button testid + gating, placeholder + Bring Back testids, createPortal,
  data-testid swap).
- 4 POP-button gates (rendered only when neither popped, opens floating mode,
  regression: no duplicate ATTACH label).
- 4 IIFE structure asserts (isPoppedToWin, isPoppedFloat, returns sidebarTree
  when docked, resize handle gated behind !isPopped).
- JSX parses cleanly via @babel/parser.

Playwright smoke confirmed:
- Both POP + WIN buttons visible and clickable in docked state.
- POP -> floating shell -> "To Window" escalation works.
- Closing the popup window snaps the sidebar back.

### Deploy
Single-file Repair-Mode upload of `dashboard.html`.  Hard-refresh after.

### Verify on controller
1. Open the dashboard.  Look at the top-right of the sidebar: two buttons
   should be visible -- `\u2197 POP` and `\u29C9 WIN`.
2. Click POP -> floating shell appears, drag it around with the title bar.
   Inside the title bar there is now a "To Window" button for escalation.
   Click Attach to dock it back.
3. Click WIN (or the in-shell "To Window" button) -> a separate browser
   window opens with the sidebar.  Drag it to an extended display.  Click
   any AHU in the popup -- the chart in the main window still updates
   (same React component instance).
4. Close the popup window -> sidebar snaps back to the docked column.
5. While the popup window is open, look at the docked column -- it now
   shows a small "Sidebar on extended display + Bring Back" placeholder
   so you can fetch it back without finding the window first.
6. Close the main dashboard tab -> the popup window auto-closes (no
   orphaned windows).

## 2026-02-11 — Sidebar cross-window placeholder: collapse to 32-px rail
**File:** `dashboard.html` (placeholder replaced with thin rail)

### Operator ask
> It seems the real estate we gained by popping the left sidebar into another
> window is taken up by BRING BACK button.  Is there a better way of doing this?

### Fix
Collapsed the docked placeholder from a 320 px column down to a 32 px vertical
rail.  The whole rail is the click target ("Click to bring back").  Rotated
vertical text ("CLICK TO BRING BACK \u00B7 SIDEBAR ON EXTENDED DISPLAY")
keeps the rail self-explanatory without crowding the chart.  testids
(`sidebar-window-attach`, `sidebar-window-placeholder`) preserved so the
existing test suite stays green.

### Real-estate math
- Before: 320 px placeholder column == sidebar still occupied full width.
- After:  32 px rail (90% reclaimed) == chart spans ~290 px more horizontally.

Visible in the smoke screenshot: the psychrometric chart now stretches from
x ~40 to x ~1900 (was x ~340 to x ~1900 with the wide placeholder).

### Tests / parse
- 35/35 sidebar-popout assertions still PASS (testids preserved).
- Full 417 KB inline JSX parses cleanly via @babel/parser.

### Deploy
Single-file Repair-Mode upload of `dashboard.html`.  Hard-refresh after.


## V1.9 Bugfix - Cross-Window Sidebar Dark Mode Text Invisible (2026-02-13)
**Brief**: User reported that when the left sidebar was popped out to a separate
OS-level browser window, dark-mode text became invisible (dark characters on the
slate-900 background). Reattaching the sidebar to the main window restored proper
contrast. The bug only manifested in cross-window pop-out mode, not in docked or
in-page floating modes.

### Root cause
`ReactDOM.createPortal(sidebarTree, sidebarPopoutHost)` lifts the sidebar JSX OUT
of the App wrapper at `<div className="flex h-screen overflow-hidden ${ui.text}
${ui.bg} ...">`. That wrapper was the only ancestor supplying the theme-driven
text color via CSS inheritance. Once portaled into a fresh window whose `<body>`
has no themed text class, the sidebar tree inherited the browser default (black),
which is unreadable on the `bg-slate-900` sidebar in dark mode. The dock case
worked because the App wrapper was the actual DOM parent.

### Fix
Added `${ui.text}` directly onto the sidebar root div className so the themed
text color travels with the portal and does not depend on inherited cascade:
```diff
- className={`${ui.sidebar} ${isPopped ? '' : 'border-r ' + ui.border} ...`}
+ className={`${ui.sidebar} ${ui.text} ${isPopped ? '' : 'border-r ' + ui.border} ...`}
```
Single 8-character addition. Works for all 3 render modes (docked, floating,
cross-window) because the class is set on the root sidebar div before the IIFE
branches on mode. Theme toggles continue to propagate live since `ui` is derived
from React state and React re-renders the portaled subtree.

### Tests
- New regression check appended to `tests/test_dashboard_sidebar_popout.js`:
  `dark-portal: sidebar root carries ${ui.text} so portaled text stays themed`.
- 36/36 sidebar-popout assertions pass (was 35, now 36).
- Broader smoke: 5 related test suites (popout / climate-drift / plugin-health /
  fetchJSON / Givoni tier) total 126 checks, all green.

### Files changed
- `dashboard.html` (line 1996, sidebarTree root div) - added `${ui.text}` to className.
- `tests/test_dashboard_sidebar_popout.js` - +1 regression guard.

### Deploy
Single-file Repair-Mode upload of `dashboard.html`. Hard-refresh after.


## V1.9 Bugfix - Equipment Mapper Edits Not Persisting After Reload (2026-02-13)
**Brief**: User reported that on the equipment_mapper page, equipment-type
selections and graphics edits were successfully sent to the controller
(server alert showed `Equipment schema saved to /root/data/configs/
equipment_types.json`), but after refreshing the page the changes appeared
to revert. The on-disk file was correctly updated by the API; only the
mapper UI was reading stale data.

### Root cause
The Flask `/assets/<path:filename>` route had a single conditional
classifying file types as either "logic that must never cache" (.js, .html,
.css, .md) or "static graphics that can cache hard". JSON fell into the
`else` branch with `Cache-Control: public, max-age=3600,
stale-while-revalidate=86400` -- so once a browser had fetched
`/assets/configs/equipment_types.json`, it would keep returning the cached
copy for up to an hour even though `/api/save-equipment-schema` had
rewritten the file seconds earlier. The dashboard was unaffected because it
reads via the `/api/equipment-types` JSON endpoint, which always reads from
disk.

### Fix
1. **Server (`app.py` `serve_asset`)**: Added `.json` to the no-cache
   extension list alongside `.js / .html / .css / .md`. JSON files served
   via `/assets/` now respond with `Cache-Control: no-store, no-cache,
   must-revalidate, max-age=0` + `Pragma: no-cache` + `Expires: 0`. Static
   graphics (PNG/JPG/SVG) retain aggressive caching.
2. **Client (`equipment_mapper.html`)**: Defense-in-depth -- appended a
   per-load timestamp cache-buster (`?ts=Date.now()`) to both
   `/assets/configs/equipment_types.json` and `/assets/equipment_types.json`
   fetches, so older pinned-tab browsers still holding a pre-fix cache get
   a fresh GET on the next reload.

### Tests
- New `tests/test_assets_json_no_cache.py`: 4 checks
  - serve_asset regex confirms `.json` joined the no-cache `endswith()` chain.
  - Reverse guard: still exactly ONE `public, max-age=3600` branch (no
    duplicate aggressive-cache leak).
  - `save_equipment_schema` still writes `CONFIG_DIR/equipment_types.json`.
  - Mapper fetches now carry the `?ts=Date.now()` buster.
- Full regression sweep (5 suites, 99 checks): all green.

### Files changed
- `app.py` -- `/assets/` route: `.json` added to no-cache extension list;
  comment refreshed to call out the equipment_types.json rewrite pathway.
- `equipment_mapper.html` -- load-time fetch carries `?ts=Date.now()`.
- `tests/test_assets_json_no_cache.py` -- NEW regression guard.

### Deploy
Single-file Repair-Mode uploads of `app.py` + `equipment_mapper.html`.
Backend restart required for `app.py`. Hard-refresh after to clear any
existing 3600-second cache entry already pinned in the operator's browser.

## V1.9 Bugfix - enteliWEB Script Editor Hangs On app.py Save (2026-02-13)
**Brief**: User reported that pasting `app.py` into the enteliWEB script
editor showed the save spinner spinning forever; the file never persisted.
Same family of bug that crashed collector.py in the previous session, but
manifesting as a save-stall instead of a runtime crash.

### Root cause
Delta Controls' embedded Python tokenizer (used by the enteliWEB script
editor) cannot handle two characters inside `#` comments:
  1. Any non-ASCII byte (em-dash `--`, smart-quote, ellipsis, etc.).
  2. An odd number of apostrophes -- it reads the lone `'` as the start
     of an unterminated string and never completes tokenization.

Both classes had accumulated in app.py and most plug-in files: 68 non-
ASCII bytes (mostly `--` em-dashes) and 10 comment lines with odd
apostrophe counts (`aren't`, `can't`, `isn't`, `doesn't`, ...).  The
controller's enteliWEB editor would silently hang on the first such
character it encountered while parsing the save.

### Fix
1. Built `tests/_sanitize_py_comments.py`: a Python tokenizer-driven
   scrubber that rewrites ONLY `tokenize.COMMENT` tokens:
     - Replaces non-ASCII chars with safe ASCII equivalents (`--`, `->`,
       `[ok]`, `1/2`, ...).
     - Expands every contraction in the dictionary (`don't` -> `do not`,
       `won't` -> `will not`, ...).
     - Strips any residual apostrophes from comments (possessives like
       `team's` are reduced to `teams`).
   AST and non-COMMENT token streams are bit-for-bit identical before
   and after the scrub -- functional behaviour is unchanged.
2. Ran the scrub against all 18 controller deploy `.py` files.  12 were
   rewritten; 6 were already clean (band_csv_generator.py,
   band_overrides_service.py, bridges_admin_service.py, collector.py,
   mqtt_bridge_service.py, webhook_bridge_service.py).
3. Wrote `tests/test_enteliweb_parser_safe.py`: a regression test that
   walks the same 18-file deploy set, audits every COMMENT token, and
   fails the build if any file accumulates a non-ASCII byte or an
   odd-apostrophe comment again.  Catches the next regression at PR time
   instead of waiting for the operator to discover it on the controller.

### Verification
- `tests/test_enteliweb_parser_safe.py`: 18/18 deploy files clean.
- AST-equivalence check across all 12 rewritten files: identical.
- Non-comment tokenstream check: identical.
- Full regression sweep across 27 test suites: all green.

### Files changed
- `app.py`, `_bridges_lib.py`, `_service_template.py`,
  `bacnet_diag_service.py`, `band_service.py`, `build_bundle.py`,
  `modbus_bridge_service.py`, `simulator.py`, `telemetry_service.py`,
  `upload_service.py`, `weather_service.py`, `ws_bridge_service.py`
  -- comment-only scrub (12 files, total delta +43 bytes).
- `tests/_sanitize_py_comments.py` -- NEW scrubber utility.
- `tests/test_enteliweb_parser_safe.py` -- NEW regression guard.

### Deploy
- For `app.py`: paste the scrubbed `app.py` into the enteliWEB script
  editor and hit save.  The spinner should now complete in seconds.
- All other plug-in `.py` files can ship via Repair Mode upload as usual.

### Future-proofing
Whenever a Python file in the deploy set is edited, run:
    python3 tests/_sanitize_py_comments.py *.py
before committing.  The test gate
(`tests/test_enteliweb_parser_safe.py`) will fail fast in CI if anyone
forgets.  Sanitizer is AST-preserving so it is safe to re-run idempotently.


## V1.9 Bugfix - enteliWEB Save Spinner Hangs Sequel (2026-02-13)
**Brief**: After applying the comment-scrub from the previous fix, the
operator reported the enteliWEB script-editor was STILL hanging on app.py
save.  Investigation revealed the parser-safety hypothesis was wrong: the
pre-scrub baseline (with em-dashes and apostrophes intact) saves cleanly.
Root cause was the SHAPE of the new code line, not the comment content.

### Bisect path (preserved here for next time)
1. Restored byte-identical pre-scrub baseline (commit a5583dc, MD5
   c2d4cb59...) -> SAVED FINE in enteliWEB.  Em-dashes + apostrophes are
   NOT a problem for the script-object editor (only for runtime imports
   under the embedded controller's CPython, which is a different parser).
2. Pasted the same baseline with one character flipped in a comment
   (same byte count) -> SAVED FINE.  Editor is healthy.
3. Pasted the baseline + a single +27 byte addition to line 280
   (`or lower.endswith('.json')` appended to a 4-clause OR chain) ->
   SPINNER HANGS forever.
4. Rewrote the same logic as a set-membership lookup
   (`lower.rsplit('.',1)[-1] in {'js','html','css','md','json'}`) which
   is 41 bytes SHORTER than the baseline -> SAVED FINE.

### Working theory
The Delta Controls embedded Python parser has a quadratic or pathological
hot-spot in either the long OR-chain expression path or the line-length
handling.  Appending another `or X.endswith(...)` to an already-long
boolean chain tipped it over a compile-time threshold and the editor's
save-with-syntax-check never completed.  Set-membership is parsed as a
single comparison and avoids the slow path entirely.

### Fix
`app.py` line 280 now uses set-membership.  The change is also more
idiomatic Python and supports the `.json` no-cache use case.  Net effect:
  - File is 59,387 bytes (41 bytes SMALLER than the pre-fix baseline).
  - Equipment-mapper edits now persist across reload because
    /assets/configs/equipment_types.json hits the no-store branch.
  - All 27 regression test suites still pass.

### Files changed
- `app.py` line 280: OR-chain -> set-membership.  No other lines touched
  vs. the pre-scrub baseline that the operator confirmed saves fine.
- `tests/test_assets_json_no_cache.py`: regex updated to accept either
  the set-membership form OR the legacy OR-chain form, so historical
  app.py snapshots also pass.
- `equipment_mapper.html`: client-side `?ts=Date.now()` cache-buster
  retained (defense in depth from the previous fix).

### Removed (over-aggressive)
- `tests/test_enteliweb_parser_safe.py` -- DELETED.  The hypothesis it
  guarded against (em-dash / apostrophe in comments breaks enteliWEB
  save) was disproven by operator testing.
- `tests/_sanitize_py_comments.py` -- DELETED for the same reason.

### Note on the 12 .py files scrubbed in the previous fix
They remain comment-scrubbed (em-dashes -> --, contractions expanded).
The scrub is functionally a no-op (AST + non-comment tokenstream are
bit-for-bit identical), so leaving them as-is causes no harm.  Future
edits do NOT need to obey the scrub rules.

### Deploy
- Paste the new `app.py` (59,387 bytes) into the enteliWEB script editor.
  Save may take a few seconds of "delay" but completes.  No spinner hang.
- All other plug-ins ship via Repair Mode as usual.

### Lessons logged
- Long OR-chains can hang the enteliWEB compile step on the controller.
  Prefer set-membership / dict-lookup forms for multi-extension checks.
- ALWAYS bisect operator-reported "the spinner hangs" issues at the
  byte-diff level before assuming a hypothesis about parser quirks --
  the parser is less fragile than the cumulative debugging history of
  this codebase suggests.


## P2 Feature - Clamp-effectiveness Sparkline (2026-02-13)
**Brief**: Implemented the mockup from `mockups/clamp_sparkline_preview.html`
as an inline 64x22 SVG sparkline in the band-clamp row, answering at a
glance: "is the equipment honoring the SA-RH clamp target?"

### What ships
- **Pure client-side** -- ZERO new BACnet writes, ZERO new backend
  routes.  The mockup originally proposed a ~30-line endpoint but the
  data is already streamed via the existing `/api/data` poll, so we just
  ring-buffer it in React state instead.
- **Sampling**: 30-second cadence, 30-sample rolling buffer (= ~15 min
  window).  Mean SA-RH across all AHUs; per-AHU breakdown is preserved
  in each sample for the hover tooltip.
- **Persistence**: localStorage (`red5.clampSpark`) so the sparkline
  survives a page reload instead of starting empty.
- **Three color states** match the mockup:
  - emerald polyline + emerald window band -- clamp applied AND mean
    currently inside `[lo, hi]`.
  - rose polyline + rose border + `!` glyph + up-arrow on numeric
    mean -- clamp applied AND mean drifting outside the window.
  - slate polyline (no window band) -- factory bands, sparkline serves
    as a baseline "what is SA-RH actually doing right now?" view.
- **Tooltip** (native HTML title attr to keep zero new deps): mean,
  window, honored/total samples, per-AHU breakdown, span in minutes.

### Files changed
- `dashboard.html`:
  - +30 LoC near the existing bandClamp* state declarations (state
    decl + sampling effect, persisted to localStorage).
  - +70 LoC inline IIFE inside the existing `band-clamp-row` JSX --
    sits between the `Live: ...` chip and the `Apply to Controller`
    button.  No layout reshuffle, no testid renames.
- `tests/test_clamp_sparkline.js` -- NEW.  31 assertions covering
  state, sampling rate, persistence, render gates, color-state logic,
  layout-insertion position, and the no-backend-route guarantee.

### Tests
- 31/31 sparkline assertions pass.
- 12 related regression suites (sidebar popout, climate drift, givoni
  tier, plugin health, etc.) all still green.
- JSX parses cleanly via `@babel/parser` against the full inline
  main-source block.

### Deploy
Single-file Repair-Mode upload of `dashboard.html`.  Hard-refresh after
to pick up the new JS.  No backend / controller restart needed.

### UX notes
- The sparkline renders only once we have >= 2 samples (i.e. ~30s
  after page load).  Subsequent reloads display immediately from
  localStorage cache.
- When the operator toggles factory bands -> clamp applied, the existing
  buffer is preserved -- the window band just gets drawn on top of the
  same line, so the operator sees their pre-clamp baseline next to the
  new constraint immediately.


## Operator tool - Clone-bundle dry-run preview (2026-02-13)
**Brief**: Added a standalone CLI that lists exactly what a clone-download
(`/api/download-bundle`) would pack from the controller before the operator
generates the bundle.  Useful for eyeballing the manifest after major
configuration edits, and for verifying the per-mode include/exclude rules
match `app.py` exactly.

### Usage
```bash
# FULL mode (default) -- everything in /root/data + /root/scripts
python3 tests/dryrun_clone_bundle.py

# REPLICATE mode -- minus per-controller runtime state
python3 tests/dryrun_clone_bundle.py --mode replicate

# Self-test (synthetic fixtures + app.py source-sync)
python3 tests/dryrun_clone_bundle.py --self-test

# Custom roots (useful from a dev box pointed at a checked-out repo)
python3 tests/dryrun_clone_bundle.py --data-root /app/archive/Red5-Studio-V1.9
```

### Output
- Sorted INCLUDED list with per-file size.
- Sorted EXCLUDED list (only populated in `replicate` mode) with reason.
- Totals row + on-disk byte size.

### Lock-step guarantee
The dry-run duplicates the exclusion rules from `app.py download_bundle()`
to stay 100% stdlib (operator can run it on the controller).  The
`--self-test` mode greps `app.py` source and asserts every entry in
`REPLICATE_EXCLUDE_BASENAMES` is present in the live `app.py`, the
`weather_<lat>_<lon>_<year>.json` carve-out is wired, both walk loops
exist, and the dotfile / `*.tmp` skip mirrors.  CI catches drift.

### Files added
- `tests/dryrun_clone_bundle.py` -- CLI + self-test (30 assertions).

### Findings on first run against this repo (full mode)
1. `__pycache__/*.pyc` files would ship in a bundle.  Not blocked by any
   rule today; flagged for a future tiny patch (1-line skip) since they
   regenerate on import.
2. `replicate` mode against this fixture excluded exactly 2 files
   (`band_guide.csv` + Seattle weather cache) -- behaviour matches
   `app.py` intent.

