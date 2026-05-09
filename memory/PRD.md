# AHU Diagnostic HUB - Product Requirements Document

## Original Problem Statement
Building Diagnostic Command Center: separate a monolithic Flask application into a dedicated backend API (`app.py`) and standalone React SPA frontends. System runs on a constrained embedded controller, loaded via iframe from cloud software.

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
