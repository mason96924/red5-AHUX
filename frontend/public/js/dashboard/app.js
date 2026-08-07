/* ------------------------------------------------------------------
 * dashboard/app.jsx — main React application module for the AHU dashboard.
 * ------------------------------------------------------------------
 *
 * Loaded LAST in the dashboard.html module-loader pipeline (see the
 * `jsModules` array near the bottom of dashboard.html).  All listed
 * modules — including this one — are concatenated together and
 * Babel-transpiled as a single block, so top-level declarations from
 * helper modules (Icon, Sparkline, red5OpenPopupWindow, etc.) are
 * directly visible inside this App closure.
 *
 * Why this file is huge:
 *   The App component is the entire dashboard surface — sidebar,
 *   psychrometric chart, AHU panel, equipment modals, diagnostics
 *   console, config-tool launcher, etc.  Future refactor passes will
 *   peel off self-contained subtrees (DiagnosticsConsole, the AHU and
 *   VAV equipment modals, sidebar groups) once their prop interfaces
 *   are designed.  Until then, treat this file as the trunk and the
 *   modules in /js/dashboard/ as the branches.
 *
 * IMPORTANT: this file is fetched as text and injected inside a
 * `<script type="text/babel" data-presets="react">` tag — it is NOT
 * executed directly by the browser, so it can use JSX freely.  Do
 * NOT use ES modules / import statements; there is no bundler.
 * ------------------------------------------------------------------ */

        const { useState, useEffect, useMemo, useRef, useCallback } = React;

        // ====================================================================
        // External modules concatenated by the loader at the bottom of this
        // file (see `jsModules` array).  Top-level utilities live in:
        //   - js/psychrometric.js, js/dashboard-components.js, js/schema-config.js,
        //     js/preview-components.js, js/sun-path.js
        //   - js/dashboard/dashboard-helpers.js  ← red5OpenPopupWindow, Icon, Sparkline
        // Anything new and shared between sub-modules belongs in the
        // js/dashboard/ folder so the file boundary stays clear.
        // ====================================================================

        // Components loaded from: js/psychrometric.js, js/dashboard-components.js

        const App = () => {
            const lang = window.useLang ? window.useLang() : 'en';
            const [i18nReady, setI18nReady] = useState(!!window.LangSelector);
            const [vavImage, setVavImage] = useState(null);
            const [floorImage, setFloorImage] = useState(null);
            const [ahuImage, setAhuImage] = useState(null);
            const [ahuTypeImages, setAhuTypeImages] = useState({});
            const [vavTypeImages, setVavTypeImages] = useState({});
            const [pyDebug, setPyDebug] = useState('');

            // Icon + Sparkline are now top-level helpers loaded via
            // js/dashboard/dashboard-helpers.js (see module loader at the
            // bottom of this file).  Keeping them out of the App closure
            // makes them reusable and lets future sub-modules import them
            // without prop drilling.

            const [theme, setTheme] = useState(() => (typeof localStorage !== 'undefined' && localStorage.getItem('red5.theme')) || 'dark');
            useEffect(() => { try { localStorage.setItem('red5.theme', theme); } catch(e){} }, [theme]);
            // Dark-mode brightness slider.  The whole app is built around
            // a binary `theme === 'dark'` flag with hundreds of hard-coded
            // `bg-slate-950`/`bg-slate-900` classes, so refactoring each
            // one to support a 3rd "dim" theme would be massive surgery.
            // Instead we apply a runtime CSS `filter: brightness()` to
            // the root container only when dark mode is active.  Range
            // 1.5-3.0 (= 150% .. 300% of factory dark).  The lower
            // bound was raised from 0.7 to 1.5 on operator feedback --
            // the old factory dark (1.0) and everything below were
            // unreadable on their monitor.  Default 2.0 sits at the
            // sweet spot.  Stored per-browser, no server round-trip.
            //
            // The slider doubles as the Light/Dark mode switch: dragging
            // it to the exact maximum (300%) flips the theme to LIGHT
            // and the brightness filter is disabled.  Dragging it back
            // below the max snaps the theme back to DARK at whatever
            // brightness the slider shows.  This replaces the old
            // standalone sun/moon toggle button.
            const DARK_LEVEL_MIN     = 1.5;
            const DARK_LEVEL_MAX     = 3.0;
            const DARK_LEVEL_DEFAULT = 2.0;
            const [darkLevel, setDarkLevel] = useState(() => {
                try {
                    // If the user was last in LIGHT mode, snap the slider
                    // to its max so the UI stays consistent on reload.
                    if (localStorage.getItem('red5.theme') === 'light') return DARK_LEVEL_MAX;
                    const v = parseFloat(localStorage.getItem('red5.darkLevel'));
                    // Clamp legacy saved values (could be anywhere from the
                    // old 0.7..2.5 range) into the new floor/ceiling so a
                    // returning user doesn't load a value that's below the
                    // current slider's `min` -- that would render the slider
                    // visually empty until they touched it.
                    if (!Number.isNaN(v)) {
                        return Math.max(DARK_LEVEL_MIN, Math.min(DARK_LEVEL_MAX, v));
                    }
                } catch (e) {}
                return DARK_LEVEL_DEFAULT;
            });
            useEffect(() => { try { localStorage.setItem('red5.darkLevel', String(darkLevel)); } catch(e){} }, [darkLevel]);
            // Slider <-> theme bridge: max (3.0) means LIGHT, anything
            // below is DARK.  Using >= rather than === lets float-rounding
            // (e.g. 2.9999) still count as "at max".
            useEffect(() => {
                if (darkLevel >= DARK_LEVEL_MAX) {
                    if (theme !== 'light') setTheme('light');
                } else {
                    if (theme !== 'dark') setTheme('dark');
                }
            }, [darkLevel]);
            // Resizable left sidebar — bounded to [250, 360] so the header
            // ("AHU DIAGNOSTIC HUB" + theme toggle) keeps a small gap at min,
            // and the FULL baseline (360 px, widened L.45 2026-02 for the
            // 3rd SA-drift pill on each AHU card) stays the comfortable max.
            const [sidebarWidth, setSidebarWidth] = useState(() => {
                /* Sidebar now snaps to one of two widths (Phase L.41
                   2026-06-27, widened L.45 2026-02): SLIM (264) or
                   FULL (360).  SLIM was bumped from 224 → 264 px so the
                   3rd MetricBar (SA-drift) fits next to exchange /
                   absorption without the AHU's preset / venue text
                   intruding on the OA/SA/RA stats column.
                   Any legacy in-between value in localStorage is
                   normalised to whichever side it's closest to. */
                /* Three legal widths now, not two: MA adds a 4th stats row
                   AND a 4th pill (exchange splits into mixing + coil), and
                   360 is ~40 px short of both -- the nowrap stats text then
                   overflows its min-w-0 column and the preset card, painted
                   after it, covers the RH digits.  Snap to the nearest of
                   264 / 360 / 400 so a widened sidebar survives a reload
                   instead of being normalised straight back down. */
                try {
                    const v = parseInt(localStorage.getItem('red5.sidebarWidth'), 10);
                    if (!Number.isNaN(v)) return v < 312 ? 264 : (v >= 380 ? 400 : 360);
                } catch (e) {}
                return 360;
            });
            const API_URL = window.API_BASE_URL || window.location.origin;

            // ---- Left sidebar in-page floating mode ----
            // Previously this was a cross-window window.open + ReactDOM.createPortal
            // popup.  That had two latent bugs:
            //   1) Range-slider drags inside the popup did not work because their
            //      onMouseDown attached mousemove/mouseup to `window` (the parent),
            //      not the popup window -- events fired in the popup never reached
            //      the listener.
            //   2) On re-attach, queued slider mousemove events fired in a rush
            //      because the portal teardown moved the slider DOM node back
            //      under the parent window's listener mid-drag.
            // Switching to an in-page absolutely-positioned floating panel keeps
            // every DOM event inside a single document, so window-level mousemove
            // listeners (used by the temp slider, the resize handle, etc.) work
            // unchanged.  Position + size persist to localStorage so the operator
            // does not have to re-position the panel after each refresh.
            const [sidebarFloating, setSidebarFloating] = useState(false);
            const [sidebarFloatPos, setSidebarFloatPos] = useState(() => {
                try { const v = JSON.parse(localStorage.getItem('red5.sidebarFloatPos')); if (v && typeof v.x === 'number') return v; } catch (e) {}
                return { x: 24, y: 24 };
            });
            const [sidebarFloatSize, setSidebarFloatSize] = useState(() => {
                try { const v = JSON.parse(localStorage.getItem('red5.sidebarFloatSize')); if (v && typeof v.w === 'number') return v; } catch (e) {}
                return { w: 380, h: 800 };
            });
            const sidebarDragRef = useRef({ active: false, startX: 0, startY: 0, baseX: 0, baseY: 0 });
            const sidebarResizeRef = useRef({ active: false, startX: 0, startY: 0, baseW: 0, baseH: 0 });

            // Drag handle mousedown -> follow mousemove via window listener so
            // dragging stays smooth even if the cursor leaves the title bar
            // (same pattern used by VAV / Floor Plan modals in this file).
            const onSidebarTitleMouseDown = useCallback((e) => {
                // Ignore clicks on the title bar's buttons (pop-out/attach, close).
                if (e.target.closest('[data-no-drag]')) return;
                e.preventDefault();
                sidebarDragRef.current = { active: true, startX: e.clientX, startY: e.clientY, baseX: sidebarFloatPos.x, baseY: sidebarFloatPos.y };
                const onMove = (mv) => {
                    if (!sidebarDragRef.current.active) return;
                    const nx = Math.max(0, Math.min(window.innerWidth - 80,
                        sidebarDragRef.current.baseX + (mv.clientX - sidebarDragRef.current.startX)));
                    const ny = Math.max(0, Math.min(window.innerHeight - 40,
                        sidebarDragRef.current.baseY + (mv.clientY - sidebarDragRef.current.startY)));
                    setSidebarFloatPos({ x: nx, y: ny });
                };
                const onUp = () => {
                    sidebarDragRef.current.active = false;
                    window.removeEventListener('mousemove', onMove);
                    window.removeEventListener('mouseup', onUp);
                    setSidebarFloatPos(p => { try { localStorage.setItem('red5.sidebarFloatPos', JSON.stringify(p)); } catch (e) {} return p; });
                };
                window.addEventListener('mousemove', onMove);
                window.addEventListener('mouseup', onUp);
            }, [sidebarFloatPos]);

            // Resize handle (bottom-right corner) mousedown.
            const onSidebarResizeMouseDown = useCallback((e) => {
                e.preventDefault();
                e.stopPropagation();
                sidebarResizeRef.current = { active: true, startX: e.clientX, startY: e.clientY, baseW: sidebarFloatSize.w, baseH: sidebarFloatSize.h };
                const onMove = (mv) => {
                    if (!sidebarResizeRef.current.active) return;
                    const nw = Math.max(280, Math.min(window.innerWidth - 40,
                        sidebarResizeRef.current.baseW + (mv.clientX - sidebarResizeRef.current.startX)));
                    const nh = Math.max(360, Math.min(window.innerHeight - 40,
                        sidebarResizeRef.current.baseH + (mv.clientY - sidebarResizeRef.current.startY)));
                    setSidebarFloatSize({ w: nw, h: nh });
                };
                const onUp = () => {
                    sidebarResizeRef.current.active = false;
                    window.removeEventListener('mousemove', onMove);
                    window.removeEventListener('mouseup', onUp);
                    setSidebarFloatSize(s => { try { localStorage.setItem('red5.sidebarFloatSize', JSON.stringify(s)); } catch (e) {} return s; });
                };
                window.addEventListener('mousemove', onMove);
                window.addEventListener('mouseup', onUp);
            }, [sidebarFloatSize]);

            // ---- Left sidebar cross-window pop-out (extended-display) ----
            // Mirrors the AHU / VAV / Floor-Plan modal pattern in this file:
            // `red5OpenPopupWindow` spawns a fresh OS-level browser window with
            // the same Tailwind + stylesheets, then we portal the sidebar JSX
            // into it via ReactDOM.createPortal so React state stays wired to
            // the original component instance.  In-page floating mode and
            // window pop-out mode are MUTUALLY EXCLUSIVE -- opening one closes
            // the other so the operator never has two copies of the sidebar
            // fighting for the same state.  The window auto-closes when the
            // parent tab unloads (registered in a useEffect below).
            const [sidebarPopoutWin,  setSidebarPopoutWin]  = useState(null);
            const [sidebarPopoutHost, setSidebarPopoutHost] = useState(null);
            const popOutSidebarToWindow = useCallback(() => {
                if (sidebarPopoutWin && !sidebarPopoutWin.closed) { sidebarPopoutWin.focus(); return; }
                const result = red5OpenPopupWindow('sidebar', 'Red5 Sidebar (popped out)', 420, 950);
                if (!result) {
                    toast('Popup window blocked. Please allow popups for this site, then click the WIN button again.');
                    return;
                }
                // Mutually exclusive with in-page floating mode.
                setSidebarFloating(false);
                setSidebarPopoutWin(result.win);
                setSidebarPopoutHost(result.host);
                const watcher = setInterval(() => {
                    if (result.win.closed) {
                        clearInterval(watcher);
                        setSidebarPopoutWin(null);
                        setSidebarPopoutHost(null);
                    }
                }, 400);
            }, [sidebarPopoutWin]);

            // Close orphan sidebar popup when the parent tab navigates away.
            // (AHU/VAV/Floor-Plan popups have their own equivalent useEffect;
            // we register a dedicated one for the sidebar so it stays
            // independent of the modal lifecycle.)
            useEffect(() => {
                const onUnload = () => {
                    if (sidebarPopoutWin && !sidebarPopoutWin.closed) {
                        try { sidebarPopoutWin.close(); } catch (e) {}
                    }
                };
                window.addEventListener('beforeunload', onUnload);
                return () => window.removeEventListener('beforeunload', onUnload);
            }, [sidebarPopoutWin]);

            // === Stale-cache detector ===
            // Flask injects window.__BUILD_MTIME__ at HTTP response time. We compare it
            // against the live /api/version to detect when this browser is running a
            // stale-cached HTML while the controller has a newer build deployed.
            const [staleCache, setStaleCache] = useState(null);
            /* ERV Rollout snapshot — written by psy-3d-engine.js whenever
               the ERV chip is ON in the 3D WX tab. Hydrate from
               localStorage so a fresh page-load shows the badge before
               the 3D engine mounts; refresh on the custom event. */
            const [ervSnap, setErvSnap] = useState(() => {
                try {
                    const raw = localStorage.getItem('red5ErvSnapshot');
                    return raw ? JSON.parse(raw) : null;
                } catch (e) { return null; }
            });
            useEffect(() => {
                const onUpd = (e) => setErvSnap(e.detail || null);
                window.addEventListener('red5-erv-rollout-update', onUpd);
                return () => window.removeEventListener('red5-erv-rollout-update', onUpd);
            }, []);
            // Reflect language changes in the browser tab title — the
            // <title> in <head> is outside React so we update it here
            // whenever i18n.js becomes available or the language flips.
            useEffect(() => {
                if (window.t) {
                    try { document.title = window.t('ahu_diagnostic_hub_v') + ' v31.39'; } catch (e) {}
                }
            }, [lang, i18nReady]);
            useEffect(() => {
                const myMtime = window.__BUILD_MTIME__;
                if (!myMtime) return; // older app.py (pre-build-stamp); skip detector
                const check = () => {
                    fetch(`${API_URL}/api/version`, { cache: 'no-store' })
                        .then(r => r.ok ? r.json() : null)
                        .then(v => {
                            if (!v) return;
                            const live = v['dashboard.html'];
                            if (live && live > myMtime) {
                                setStaleCache({ mine: myMtime, latest: live });
                            }
                        })
                        .catch(() => {});
                };
                check();
                const id = setInterval(check, 60000);
                return () => clearInterval(id);
            }, []);
            const [tempRange, setTempRange] = useState(() => {
                /* Lazy-init from the same key the setup walk's Psy Chart
                 * page writes (`red5_temp_range`).  This is what propagates
                 * the "Temperature Axis Range" sliders from the setup walk
                 * into the live dashboard chart.  Default: -15..50 °C.  */
                try {
                    const raw = localStorage.getItem('red5_temp_range');
                    if (raw) {
                        const p = JSON.parse(raw);
                        if (Number.isFinite(p.min) && Number.isFinite(p.max) && p.min < p.max) return p;
                    }
                } catch (e) { /* fall through */ }
                return { min: -15, max: 50 };
            });
            useEffect(() => {
                try { localStorage.setItem('red5_temp_range', JSON.stringify(tempRange)); } catch (e) {}
            }, [tempRange]);
            /* Live update — when the setup walk saves a new temp axis range,
             * pick it up without requiring a page reload. */
            useEffect(() => {
                const onTempChange = (e) => {
                    const d = e && e.detail;
                    if (d && Number.isFinite(d.min) && Number.isFinite(d.max) && d.min < d.max) {
                        setTempRange({ min: d.min, max: d.max });
                    }
                };
                window.addEventListener('r5-temp-range-change', onTempChange);
                return () => window.removeEventListener('r5-temp-range-change', onTempChange);
            }, []);
            const [searchTerm, setSearchTerm] = useState('');
            const [ahuData, setAhuData] = useState([]);
            const [telemetryStatus, setTelemetryStatus] = useState(null);
            const [dataMode, setDataMode] = useState('simulator');
            const [activeView, setActiveView] = useState('chart');
            const [collectorLog, setCollectorLog] = useState([]);
            const [writeHistory, setWriteHistory] = useState([]);
            const [trendHistory, setTrendHistory] = useState({});
            const [selectedAhuId, setSelectedAhuId] = useState(null);
            const [indicatorPos, setIndicatorPos] = useState({ t: 25, w: 0.015 }); 
            const [isLockedToSA, setIsLockedToSA] = useState(false);
            const [lockedVavId, setLockedVavId] = useState(null);
            const [isProcessVisible, setIsProcessVisible] = useState(false);
            const [isDraggingIndicator, setIsDraggingIndicator] = useState(false);
            const [showGivoni, setShowGivoni] = useState(true);
            const [showSweetSpot, setShowSweetSpot] = useState(true);
            // Operator-tunable sweet-spot range (RH percent).  Defaults to
            // ASHRAE 55 / ISO 7730's 40-60% band but can be tightened
            // (e.g. 45-55% for cleanrooms / archives) or widened.
            // Persisted to localStorage so the operator's preference
            // survives page reload.
            const [sweetSpotRange, setSweetSpotRange] = useState(() => {
                try {
                    const raw = localStorage.getItem('red5_sweet_spot_range');
                    if (raw) {
                        const p = JSON.parse(raw);
                        if (Number.isFinite(p.lo) && Number.isFinite(p.hi) && p.lo < p.hi) return p;
                    }
                } catch (e) { /* fall through */ }
                return { lo: 40, hi: 60 };
            });
            useEffect(() => {
                try { localStorage.setItem('red5_sweet_spot_range', JSON.stringify(sweetSpotRange)); } catch (e) {}
                // Notify the 3D WX engine (psy-3d-engine.js) to rebuild
                // its RH-band slab + re-classify the scatter into in-band
                // (1.6×) / out-of-band markers.  The engine listens on
                // `window` for this event so the React<->vanilla-JS
                // boundary stays one-way and decoupled.
                try {
                    window.dispatchEvent(new CustomEvent('r5-rh-band-change', {
                        detail: { lo: sweetSpotRange.lo, hi: sweetSpotRange.hi }
                    }));
                } catch (e) {}
            }, [sweetSpotRange]);

            /* T-clip range for the 3D WX RH-band slab.  Bounds the magenta
               volume to the operator's chosen occupied-space comfort T
               range (default 21..27 °C, ASHRAE 55 Cat A).  Pure visual /
               classification setting — no BACnet writes — persisted per
               browser so the choice survives reloads. */
            const [tClipRange, setTClipRange] = useState(() => {
                try {
                    const raw = localStorage.getItem('red5_t_clip_range');
                    if (raw) {
                        const p = JSON.parse(raw);
                        if (Number.isFinite(p.lo) && Number.isFinite(p.hi) && p.lo < p.hi) return p;
                    }
                } catch (e) {}
                return { lo: 21, hi: 27 };
            });
            useEffect(() => {
                try { localStorage.setItem('red5_t_clip_range', JSON.stringify(tClipRange)); } catch (e) {}
                try {
                    window.dispatchEvent(new CustomEvent('r5-t-clip-change', {
                        detail: { lo: tClipRange.lo, hi: tClipRange.hi }
                    }));
                } catch (e) {}
            }, [tClipRange]);

            // Robust JSON fetch that catches the common controller-side
            // failure mode where an unregistered route gets handled by the
            // SPA fallback and returns HTML instead of JSON.  Without this
            // helper the caller sees a cryptic "Unexpected token '<'" from
            // r.json() and assumes the controller is offline -- when in
            // reality band_overrides_service.py just was not uploaded to
            // /root/data/pgpy/ yet, or Flask was not restarted after the
            // upload.  We detect HTML in the response and surface a
            // controller-side deploy hint that the operator can act on.
            const fetchJSON = async (url, options) => {
                let r;
                try {
                    r = await fetch(url, options);
                } catch (netErr) {
                    const err = new Error('Controller unreachable: ' + netErr.message);
                    err.code = 'NETWORK';
                    throw err;
                }
                const ct = (r.headers.get('content-type') || '').toLowerCase();
                if (!ct.includes('application/json')) {
                    const head = (await r.text()).slice(0, 60).replace(/\s+/g, ' ').trim();
                    if (r.status === 404 || /<!doctype/i.test(head) || /<html/i.test(head)) {
                        const err = new Error(
                            'Band-overrides service not found on the controller. '
                          + 'Upload band_overrides_service.py to /root/data/pgpy/ '
                          + 'and restart Flask, then try again.\n\n'
                          + '(HTTP ' + r.status + ', response began with: ' + head + ')'
                        );
                        err.code = 'PLUGIN_MISSING';
                        throw err;
                    }
                    const err = new Error('Unexpected non-JSON response (HTTP ' + r.status + '): ' + head);
                    err.code = 'BAD_RESPONSE';
                    throw err;
                }
                return r.json();
            };

            // ---- Plugin health (auto-discovered Flask services) ----
            // Polls /api/services once on mount.  Compares the live status
            // against an "expected" set so we can warn the operator when a
            // required plug-in is missing (e.g. the band_overrides_service
            // bug operators hit when they forget to upload it to
            // /root/data/pgpy/).  Same chip serves as a green-light "all
            // good" indicator when nothing is wrong.
            const PLUGIN_EXPECTED = ['band_service', 'telemetry_service',
                                     'weather_service', 'upload_service',
                                     'band_overrides_service'];
            const [pluginHealth, setPluginHealth] = useState({ state: 'unknown', missing: [], failed: [], total: 0 });
            useEffect(() => {
                let cancelled = false;
                (async () => {
                    try {
                        const j = await fetchJSON('/api/services');
                        if (cancelled) return;
                        const svc = (j && j.services) || [];
                        const seen = new Set(svc.map(s => s.name));
                        const missing = PLUGIN_EXPECTED.filter(n => !seen.has(n));
                        const failed  = svc.filter(s => s.state === 'FAILED' || s.state === 'SKIPPED' || s.state === 'WARNING');
                        let state = 'ok';
                        if (missing.length || failed.some(s => s.state === 'FAILED')) state = 'error';
                        else if (failed.length) state = 'warn';
                        setPluginHealth({ state, missing, failed, total: svc.length });
                    } catch (e) {
                        if (cancelled) return;
                        setPluginHealth({ state: 'error', missing: [], failed: [], total: 0, detail: e.message });
                    }
                })();
                return () => { cancelled = true; };
            }, []);

            // Operator SA-RH clamp - the SLIDER (sweetSpotRange) is hypothetical
            // until the operator presses "Apply to Controller", at which point
            // we POST to /api/band-overrides/sa-rh-clamp and the value here
            // (bandClampApplied) gets updated.  Dirty state = slider differs
            // from applied = Apply button highlighted amber.
            //   null    -> no clamp on controller (factory bands)
            //   {lo,hi} -> clamp currently enforced on controller
            const [bandClampApplied, setBandClampApplied] = useState(null);
            const [bandClampModal,   setBandClampModal]   = useState(null);  // { lo, hi, preview }
            const [bandClampBusy,    setBandClampBusy]    = useState(false);
            useEffect(() => {
                let cancelled = false;
                (async () => {
                    try {
                        const j = await fetchJSON('/api/band-overrides/sa-rh-clamp');
                        if (cancelled) return;
                        if (j.status === 'ok' && j.sa_rh_clamp && j.sa_rh_clamp.enabled) {
                            setBandClampApplied({ lo: j.sa_rh_clamp.lo, hi: j.sa_rh_clamp.hi });
                        }
                    } catch (e) {
                        // Silent on initial mount -- the operator gets a
                        // clear error message later when they actually
                        // click Apply / Reset.  fetchJSON already classified
                        // the failure (PLUGIN_MISSING, NETWORK, etc.).
                        if (typeof console !== 'undefined') console.warn('[band-overrides initial GET]', e.message);
                    }
                })();
                return () => { cancelled = true; };
            }, []);

            // Clamp-effectiveness sparkline (P2 mockup):
            // Rolling buffer of mean SA-RH (across all AHUs) sampled from the
            // existing /api/data polling loop.  Pure client-side -- zero new
            // BACnet writes, zero new backend routes.  30 samples @ ~30s
            // cadence = a 15-min rolling window.  Persisted to localStorage so
            // the chart survives page reloads instead of starting empty.
            const SPARK_MAX        = 30;
            const SPARK_INTERVAL_MS = 30 * 1000;
            const [clampSpark, setClampSpark] = useState(() => {
                try {
                    const v = JSON.parse(localStorage.getItem('red5.clampSpark') || '[]');
                    if (Array.isArray(v)) return v.slice(-SPARK_MAX);
                } catch (e) {}
                return [];
            });
            useEffect(() => {
                if (!Array.isArray(ahuData) || ahuData.length === 0) return;
                // Collect SA-RH per AHU.  Skip equipment that does not expose
                // an SA point or whose rh is non-finite (mock mode w/ NaN).
                const perAhu = [];
                ahuData.forEach(a => {
                    const sa = (a.points || []).find(p => p.label === 'SA');
                    if (!sa) return;
                    const rh = Number(sa.rh);
                    if (!Number.isFinite(rh)) return;
                    perAhu.push({ id: a.id, rh });
                });
                if (perAhu.length === 0) return;
                const meanRh = perAhu.reduce((s, x) => s + x.rh, 0) / perAhu.length;
                const ts = Date.now();
                setClampSpark(prev => {
                    if (prev.length > 0 && (ts - prev[prev.length - 1].ts) < SPARK_INTERVAL_MS) {
                        return prev;
                    }
                    const next = [...prev, { ts, meanRh, perAhu }].slice(-SPARK_MAX);
                    try { localStorage.setItem('red5.clampSpark', JSON.stringify(next)); } catch (e) {}
                    return next;
                });
            }, [ahuData]);
            const [showPath, setShowPath] = useState(true);
            const [vecVis, setVecVis] = useState({ enthalpy: true, sensible: true, latent: true, diagnostic: true });
            const [pointVisibility, setPointVisibility] = useState({ RA: true, OA: true, SA: true, MA: true });

            /* MA can't be known at first paint -- it depends on whether MAT is
               mapped -- so the 4-pill width is applied once the data says so.
               Only nudges the operator off the old FULL default: a deliberate
               SLIM (264) stays slim, where the preset card is hidden anyway
               and there is nothing to collide with. */
            React.useEffect(() => {
                const hasMA = (ahuData || []).some(a => (a.points || []).some(p => p && p.label === 'MA'));
                if (!hasMA || sidebarWidth !== 360) return;
                setSidebarWidth(400);
                try { localStorage.setItem('red5.sidebarWidth', '400'); } catch (_) {}
            }, [ahuData, sidebarWidth]);

            /* Per-AHU venue-preset → RH band map.  MUST stay byte-identical
               to the PRESETS list inside sidebar.js so a venue picked in
               the sidebar dropdown maps to the same lo/hi here when the
               psychrometric chart draws that AHU's sweet-spot polygon.
               (2026-06-26 — wired per-AHU sweet-spot polygons feature.) */
            const VENUE_PRESET_MAP = {
                custom:     { lo: 40, hi: 60 },
                office:     { lo: 30, hi: 60 },
                museum:     { lo: 40, hi: 55 },
                hotel:      { lo: 30, hi: 60 },
                library:    { lo: 40, hi: 55 },
                hospital:   { lo: 30, hi: 60 },
                lecture:    { lo: 30, hi: 60 },
                concert:    { lo: 40, hi: 55 },
                meeting:    { lo: 30, hi: 60 },
                exhibition: { lo: 40, hi: 55 },
            };
            /* Version counter bumped whenever the sidebar dispatches
               `r5-ahu-preset-change`.  Used as a useMemo dependency so
               `ahuSweetSpots` recomputes from localStorage on every
               dropdown pick without us having to lift the per-AHU
               preset choices into React state. */
            const [ahuPresetVersion, setAhuPresetVersion] = useState(0);
            useEffect(() => {
                const h = () => setAhuPresetVersion(v => v + 1);
                window.addEventListener('r5-ahu-preset-change', h);
                return () => window.removeEventListener('r5-ahu-preset-change', h);
            }, []);

            /* Live update — setup walk Save (and any other writer of
               r5-rh-band-change with applyToAllAhus) must update React
               sweetSpotRange AND seed per-AHU venue keys so the sidebar
               AHU detail cards reflect the walk-through choice.  Also
               keeps sweetSpotRange in sync when the selected AHU's
               band is mirrored (issue: VAV psy chart ignored per-AHU). */
            useEffect(() => {
                const onRhBandChange = (e) => {
                    const d = e && e.detail;
                    if (!d || !Number.isFinite(d.lo) || !Number.isFinite(d.hi) || !(d.lo < d.hi)) return;
                    setSweetSpotRange(prev =>
                        (prev && prev.lo === d.lo && prev.hi === d.hi) ? prev : { lo: d.lo, hi: d.hi });
                    if (d.applyToAllAhus) {
                        const preset = d.preset || 'custom';
                        try {
                            localStorage.setItem('red5_rh_preset', preset);
                            (ahuData || []).forEach(ahu => {
                                if (ahu && ahu.id) {
                                    localStorage.setItem('red5_rh_preset_' + ahu.id, preset);
                                }
                            });
                        } catch (err) {}
                        setAhuPresetVersion(v => v + 1);
                    }
                };
                window.addEventListener('r5-rh-band-change', onRhBandChange);
                return () => window.removeEventListener('r5-rh-band-change', onRhBandChange);
            }, [ahuData]);

            /* Per-AHU "applied to controller" bands — fetched from the
               backend on mount.  Used by the sidebar to decide which AHU
               rows are dirty (current preset !== applied preset) and so
               which `APPLY ↑` chips should pulse.  Empty {} on anon /
               demo mode (POST simply echoes back with applied=false). */
            const [appliedAhuBands, setAppliedAhuBands] = useState({});
            const [applyBusy, setApplyBusy] = useState(false);
            const [showApplyModal, setShowApplyModal] = useState(false);
            useEffect(() => {
                let alive = true;
                fetchJSON('/api/band-overrides/ahu-rh-bands', { credentials: 'include' })
                    .then(j => {
                        if (!alive) return;
                        const bands = (j && j.ahu_rh_bands) || {};
                        setAppliedAhuBands(bands);
                    })
                    .catch(() => {});
                return () => { alive = false; };
            }, []);
            /* Apply one or more per-AHU bands to the controller.  Accepts
               an array of {ahu_id, lo, hi, preset_id} and on success
               merges the returned bands into appliedAhuBands so the
               dirty-chip logic settles to "clean" without a refetch.
               (Uses the relative-URL `fetchJSON` form proven by the
               sa-rh-clamp Apply flow — absolute URL + credentials:
               include round-trips lose the session_token cookie in
               some PROD reverse-proxy setups even when same-origin.) */
            const applyAhuBands = useCallback(async (bandsList) => {
                if (!Array.isArray(bandsList) || bandsList.length === 0) return null;
                setApplyBusy(true);
                try {
                    const j = await fetchJSON('/api/band-overrides/ahu-rh-bands', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ bands: bandsList }),
                    });
                    if (j && j.ahu_rh_bands) setAppliedAhuBands(j.ahu_rh_bands);
                    /* Diagnostic logging — leave on for now so the next time
                       Apply silently degrades to "Demo mode" we can read
                       Network tab + console to find out whether the cookie
                       reached the server (j.tenant_id present ⇒ auth OK). */
                    try {
                        console.log('[apply-rh-bands] POST response:', {
                            applied:     j && j.applied,
                            applied_cnt: j && j.applied_count,
                            tenant_id:   j && j.tenant_id,
                            warning:     j && j.warning,
                            signed_in:   !!window.__v2_signed_in,
                            user_email:  window.__v2_user_email || null,
                        });
                    } catch (_) {}
                    if (window.toast) {
                        if (j.applied) {
                            window.toast(`Applied ${j.applied_count || bandsList.length} AHU band(s) to controller`, 'success');
                        } else if (window.__v2_signed_in) {
                            /* Auth pill says we're signed in but the POST got
                               Demo mode back ⇒ the session cookie did NOT
                               reach the band-overrides handler.  Surface a
                               sharper hint than "Sign in to persist..." so
                               the operator immediately checks DevTools
                               Network → Request Headers for a Cookie line. */
                            window.toast(
                                'Signed in (' + (window.__v2_user_email || 'unknown')
                                + ') but POST returned Demo mode — session cookie not reaching the controller. '
                                + 'Open DevTools Network → this POST → Request Headers and check for "Cookie: session_token=...".',
                                'error'
                            );
                        } else {
                            window.toast(j.warning || 'Sign in to persist bands', 'info');
                        }
                    }
                    return j;
                } catch (e) {
                    if (window.toast) window.toast('Failed to apply bands: ' + (e && e.message || e), 'error');
                    return null;
                } finally {
                    setApplyBusy(false);
                }
            }, []);
            
            const [cardOffset, setCardOffset] = useState({ x: 200, y: 30 });
            const [vavTableOffset, setVavTableOffset] = useState({ x: 780, y: 20 });
            const [isCardDragging, setIsCardDragging] = useState(false);
            const [isVavDragging, setIsVavDragging] = useState(false);
            const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

            const [selectedVavForModal, setSelectedVavForModal] = useState(null);
            const [vavModalOffset, setVavModalOffset] = useState({ x: 250, y: 80 });
            const [isVavModalDragging, setIsVavModalDragging] = useState(false);
            const [vavCfm, setVavCfm] = useState(400);

            // Keep open VAV modal bound to the same live row the Terminal Hub
            // shows. Click stored a snapshot; /api/data replaces ahuData every
            // poll — refresh the selection object by id (prefer selected AHU).
            useEffect(() => {
                if (!selectedVavForModal || !Array.isArray(ahuData)) return;
                const id = selectedVavForModal.id;
                const prefer = ahuData.find(a => a.id === selectedAhuId);
                const order = prefer
                    ? [prefer, ...ahuData.filter(a => a !== prefer)]
                    : ahuData;
                for (const a of order) {
                    const hit = (a.vavs || []).find(v => v.id === id);
                    if (hit) {
                        if (hit !== selectedVavForModal) setSelectedVavForModal(hit);
                        return;
                    }
                }
            }, [ahuData, selectedAhuId, selectedVavForModal && selectedVavForModal.id]);

            // AHU + VAV modal dimensions persisted to localStorage so the
            // operator's preferred diagram size restores on next open
            // instead of always defaulting to 1600x900 / 1400x850.  Lazy
            // initializer reads once at mount; the modal element itself
            // is observed below (look for "modalSizePersist" effect) so
            // user-resizes via the `resize:both` CSS handle are written
            // back without lag.
            const _LS_AHU_SIZE = 'red5AhuModalSize';
            const _LS_VAV_SIZE = 'red5VavModalSize';
            const _LS_FP_SIZE  = 'red5FloorPlanModalSize';
            const _loadSize = (key, fallback) => {
                try {
                    const raw = localStorage.getItem(key);
                    if (!raw) return fallback;
                    const j = JSON.parse(raw);
                    if (typeof j.w === 'number' && typeof j.h === 'number'
                        && j.w >= 400 && j.h >= 300 && j.w <= 4000 && j.h <= 3000) {
                        return j;
                    }
                } catch (e) { /* corrupt or quota - ignore */ }
                return fallback;
            };
            const [showAhuModalFor, setShowAhuModalFor] = useState(null);
            const [_forceApTick, _setForceApTick] = useState(0);
            const [ahuModalSize, setAhuModalSize] = useState(() => _loadSize(_LS_AHU_SIZE, { w: 1600, h: 900 }));
            const ahuOuterRef = useRef(null);
            const [ahuBodySize, setAhuBodySize] = useState({ w: 1560, h: 820 });
            const ahuBodyRef = useRef(null);
            // Pop-out window/host state hoisted UP to here so the AHU
            // useEffects below (which depend on ahuModalPopupHost so they
            // re-run when the modal pops in/out and re-bind ResizeObservers
            // to the popup-document image) can reference it without a
            // temporal-dead-zone ReferenceError at first render.
            const [ahuModalPopupWin,  setAhuModalPopupWin]  = useState(null);
            const [ahuModalPopupHost, setAhuModalPopupHost] = useState(null);
            const [vavModalPopupWin,  setVavModalPopupWin]  = useState(null);
            const [vavModalPopupHost, setVavModalPopupHost] = useState(null);
            const [floorPlanPopupWin,  setFloorPlanPopupWin]  = useState(null);
            const [floorPlanPopupHost, setFloorPlanPopupHost] = useState(null);
            useEffect(() => {
                if (!showAhuModalFor || !ahuBodyRef.current) return;
                const el = ahuBodyRef.current;
                const update = () => { setAhuBodySize({ w: el.clientWidth, h: el.clientHeight }); };
                update();
                // CRITICAL: when the modal is popped out via createPortal,
                // `el` lives inside the popup window's document.  The
                // PARENT window's ResizeObserver silently ignores cross-
                // document targets — we must grab the observer constructor
                // from the element's own document so resize events in the
                // popup actually fire.  Same applies to the ahuImgRef
                // ResizeObserver below.
                const RO = (el.ownerDocument && el.ownerDocument.defaultView && el.ownerDocument.defaultView.ResizeObserver) || (typeof ResizeObserver !== 'undefined' ? ResizeObserver : null);
                if (RO) {
                    const ro = new RO(update);
                    ro.observe(el);
                    // Also re-measure on window resize in case the popup is
                    // being dragged across monitors with different DPRs.
                    const winRef = el.ownerDocument && el.ownerDocument.defaultView;
                    if (winRef) winRef.addEventListener('resize', update);
                    return () => {
                        ro.disconnect();
                        if (winRef) winRef.removeEventListener('resize', update);
                    };
                }
            }, [showAhuModalFor, ahuModalPopupHost]);
            const [ahuModalOffset, setAhuModalOffset] = useState({ x: 150, y: 50 });
            const [isAhuModalDragging, setIsAhuModalDragging] = useState(false);
            const [ahuImgDims, setAhuImgDims] = useState({ natW: 1600, natH: 700, dispW: 1600, dispH: 700 });
            const ahuImgRef = useRef(null);
            // The AHU equipment image scales via CSS (max-w-full + maxHeight)
            // whenever the modal is resized.  We rely on `imgScale = dispW /
            // natW` to scale pixel-based animation offsets so they stay
            // proportional to the rendered image.  Without a ResizeObserver
            // here, `dispW` is captured only at <img onLoad> and goes stale
            // on every resize — the equipment shrinks but the overlays stay
            // huge, causing the misalignment the operator reported.
            useEffect(() => {
                if (!showAhuModalFor) return;
                const im = ahuImgRef.current;
                if (!im) return;
                const update = () => {
                    if (!im) return;
                    const nW = im.naturalWidth || 1600, nH = im.naturalHeight || 700;
                    const dW = im.offsetWidth || nW,    dH = im.offsetHeight || nH;
                    setAhuImgDims(prev => (prev.natW === nW && prev.natH === nH
                                            && prev.dispW === dW && prev.dispH === dH)
                                          ? prev
                                          : { natW: nW, natH: nH, dispW: dW, dispH: dH });
                };
                update();
                // CRITICAL (popout fix): see ahuBodyRef comment above.
                // Use the image's OWN document's ResizeObserver so events
                // in the popped-out window actually fire.  Also schedule
                // a microtask + a 60ms delayed re-measure to absorb the
                // layout race between createPortal mounting the React
                // subtree and the popup's layout engine reporting its
                // final width.
                const RO = (im.ownerDocument && im.ownerDocument.defaultView && im.ownerDocument.defaultView.ResizeObserver) || (typeof ResizeObserver !== 'undefined' ? ResizeObserver : null);
                const winRef = im.ownerDocument && im.ownerDocument.defaultView;
                let ro = null;
                if (RO) { ro = new RO(update); ro.observe(im); }
                if (winRef) winRef.addEventListener('resize', update);
                const settleT = setTimeout(update, 60);
                return () => {
                    if (ro) ro.disconnect();
                    if (winRef) winRef.removeEventListener('resize', update);
                    clearTimeout(settleT);
                };
            }, [showAhuModalFor, ahuModalSize.w, ahuModalSize.h, ahuModalPopupHost]);
            // Pop-out window state for AHU / VAV / Floor-Plan modals.  Each
            // modal owns its own popup so the operator can fan them out across
            // multiple monitors (e.g. AHU diagram on monitor 2, floor plan on
            // monitor 3, VAV detail on the main screen).  When the active
            // selection changes, the popup auto-updates via React's normal
            // state flow — selecting a different AHU rerenders the AHU popup
            // with the new AHU's telemetry instead of closing and reopening it.
            // (state declarations hoisted ABOVE the AHU/VAV useEffects so the
            // image-resize effects can depend on *PopupHost without TDZ.)

            // Generic open-or-focus helper.  ``setterPair`` is [setWin, setHost]
            // for the modal whose popup we're spawning.  Size comes from the
            // docked modal's persisted w×h so the popped window keeps the
            // same aspect instead of a one-size-fits-all (or browser-default
            // tiny) rectangle.
            //
            // ``closeOthers`` — optional list of [win, setWin, setHost] to
            // clear when opening Document PiP (browser allows only one PiP
            // per tab; also used when switching POP OUT ↔ FLOAT).
            const watchExternalClose = useCallback((win, setterPair) => {
                const watcher = setInterval(() => {
                    if (!win || win.closed) {
                        clearInterval(watcher);
                        setterPair[0](null);
                        setterPair[1](null);
                    }
                }, 400);
                try {
                    win.addEventListener('pagehide', () => {
                        clearInterval(watcher);
                        setterPair[0](null);
                        setterPair[1](null);
                    });
                } catch (e) {}
            }, []);

            const closeExternal = useCallback((win, setterPair) => {
                if (win && !win.closed) {
                    try { win.close(); } catch (e) {}
                }
                setterPair[0](null);
                setterPair[1](null);
            }, []);

            const openPopupFor = useCallback((label, title, currentWin, setterPair, size, closeOthers) => {
                // Already a browser pop-out (not PiP) → focus / resize.
                if (currentWin && !currentWin.closed && !currentWin.__red5IsPip) {
                    try {
                        const w = (size && size.w) || 1400;
                        const h = (size && size.h) || 900;
                        const chromeW = Math.max(0, (currentWin.outerWidth || w) - (currentWin.innerWidth || w));
                        const chromeH = Math.max(0, (currentWin.outerHeight || h) - (currentWin.innerHeight || h));
                        currentWin.resizeTo(w + chromeW, h + chromeH);
                    } catch (e) {}
                    try { currentWin.focus(); } catch (e) {}
                    return;
                }
                // Switching from PiP → browser window, or fresh open.
                if (currentWin && !currentWin.closed) closeExternal(currentWin, setterPair);
                if (Array.isArray(closeOthers)) {
                    closeOthers.forEach(entry => {
                        if (entry && entry[0] && entry[0] !== currentWin)
                            closeExternal(entry[0], [entry[1], entry[2]]);
                    });
                }
                const w = (size && size.w) || 1600;
                const h = (size && size.h) || 900;
                const result = red5OpenPopupWindow(label, title, w, h);
                if (!result) {
                    toast('Popup window blocked. Please allow popups for this site, then click Pop Out again.');
                    return;
                }
                setterPair[0](result.win);
                setterPair[1](result.host);
                watchExternalClose(result.win, setterPair);
            }, [closeExternal, watchExternalClose]);

            const openPipFor = useCallback(async (label, title, currentWin, setterPair, size, closeOthers) => {
                if (!red5PipSupported()) {
                    toast('Float (PiP) needs Chrome or Edge. Use Pop Out instead.');
                    return;
                }
                // Already floating this modal in PiP → focus (nothing else to do).
                if (currentWin && !currentWin.closed && currentWin.__red5IsPip) {
                    try { currentWin.focus(); } catch (e) {}
                    return;
                }
                if (currentWin && !currentWin.closed) closeExternal(currentWin, setterPair);
                // Document PiP allows only one window per tab — detach siblings.
                if (Array.isArray(closeOthers)) {
                    closeOthers.forEach(entry => {
                        if (entry && entry[0] && entry[0] !== currentWin)
                            closeExternal(entry[0], [entry[1], entry[2]]);
                    });
                }
                const w = (size && size.w) || 1600;
                const h = (size && size.h) || 900;
                const result = await red5OpenPipWindow(label, title, w, h);
                if (!result) {
                    toast('Could not open Float window. Try Pop Out, or check PiP is allowed.');
                    return;
                }
                setterPair[0](result.win);
                setterPair[1](result.host);
                watchExternalClose(result.win, setterPair);
            }, [closeExternal, watchExternalClose]);

            // Close every popup when the parent tab is about to unload.
            useEffect(() => {
                const onUnload = () => {
                    [ahuModalPopupWin, vavModalPopupWin, floorPlanPopupWin].forEach(w => {
                        if (w && !w.closed) { try { w.close(); } catch (e) {} }
                    });
                };
                window.addEventListener('beforeunload', onUnload);
                return () => window.removeEventListener('beforeunload', onUnload);
            }, [ahuModalPopupWin, vavModalPopupWin, floorPlanPopupWin]);

            // Auto-close the popup when its underlying modal toggles off.
            useEffect(() => {
                if (!showAhuModalFor && ahuModalPopupWin && !ahuModalPopupWin.closed) ahuModalPopupWin.close();
            }, [showAhuModalFor, ahuModalPopupWin]);
            useEffect(() => {
                if (!selectedVavForModal && vavModalPopupWin && !vavModalPopupWin.closed) vavModalPopupWin.close();
            }, [selectedVavForModal, vavModalPopupWin]);
            // floor-plan auto-close is wired below after showFloorPlanForAhu is declared
            // popOut* callbacks are declared after vavModalSize / floorPlanModalSize
            // to avoid TDZ (those sizes live further down).
            const [vavImgDims, setVavImgDims] = useState({ natW: 1600, natH: 1004, dispW: 1600, dispH: 1004 });
            const vavImgRef = useRef(null);
            const vavOuterRef = useRef(null);
            const [vavModalSize, setVavModalSize] = useState(() => _loadSize(_LS_VAV_SIZE, { w: 1400, h: 850 }));
            // VAV modal pop-out lives in a separate window; mirror the AHU
            // image-resize handling so the air-flow chevron overlays stay
            // aligned to the rendered image at every popped-out width.
            // Keyed on vavModalPopupHost so the effect re-binds when the
            // popout opens/closes and vavImgRef.current points at the
            // newly-mounted image in the popup document.
            useEffect(() => {
                const im = vavImgRef.current;
                if (!im) return;
                const update = () => {
                    if (!im) return;
                    const nW = im.naturalWidth || 1600, nH = im.naturalHeight || 1004;
                    const dW = im.offsetWidth || nW,    dH = im.offsetHeight || nH;
                    setVavImgDims(prev => (prev.natW === nW && prev.natH === nH
                                           && prev.dispW === dW && prev.dispH === dH)
                                          ? prev
                                          : { natW: nW, natH: nH, dispW: dW, dispH: dH });
                };
                update();
                const RO = (im.ownerDocument && im.ownerDocument.defaultView && im.ownerDocument.defaultView.ResizeObserver) || (typeof ResizeObserver !== 'undefined' ? ResizeObserver : null);
                const winRef = im.ownerDocument && im.ownerDocument.defaultView;
                let ro = null;
                if (RO) { ro = new RO(update); ro.observe(im); }
                if (winRef) winRef.addEventListener('resize', update);
                const settleT = setTimeout(update, 60);
                return () => {
                    if (ro) ro.disconnect();
                    if (winRef) winRef.removeEventListener('resize', update);
                    clearTimeout(settleT);
                };
            }, [vavModalSize.w, vavModalSize.h, vavModalPopupHost]);

            // modalSizePersist: observe the AHU + VAV modal outer div for
            // user-driven resizes (the CSS `resize:both` handle the user
            // drags from the bottom-right corner doesn't update React
            // state by itself).  Debounce 200ms so we don't pound
            // localStorage on every pixel of a drag.  Only persists when
            // the modal is NOT popped out (popped-out windows use OS
            // window sizing, irrelevant to the inline modal preference).
            useEffect(() => {
                if (!showAhuModalFor || ahuModalPopupHost) return;
                const el = ahuOuterRef.current;
                if (!el) return;
                let debounce = null;
                const update = () => {
                    if (!el) return;
                    const w = el.offsetWidth, h = el.offsetHeight;
                    if (w < 400 || h < 300) return;
                    if (debounce) clearTimeout(debounce);
                    debounce = setTimeout(() => {
                        setAhuModalSize(prev => (prev.w === w && prev.h === h) ? prev : { w: w, h: h });
                        try { localStorage.setItem(_LS_AHU_SIZE, JSON.stringify({ w: w, h: h })); } catch(_) {}
                    }, 200);
                };
                update();
                const RO = (typeof ResizeObserver !== 'undefined') ? ResizeObserver : null;
                let ro = null;
                if (RO) { ro = new RO(update); ro.observe(el); }
                return () => {
                    if (ro) ro.disconnect();
                    if (debounce) clearTimeout(debounce);
                };
            }, [showAhuModalFor, ahuModalPopupHost]);

            useEffect(() => {
                if (!selectedVavForModal || vavModalPopupHost) return;
                const el = vavOuterRef.current;
                if (!el) return;
                let debounce = null;
                const update = () => {
                    if (!el) return;
                    const w = el.offsetWidth, h = el.offsetHeight;
                    if (w < 400 || h < 300) return;
                    if (debounce) clearTimeout(debounce);
                    debounce = setTimeout(() => {
                        setVavModalSize(prev => (prev.w === w && prev.h === h) ? prev : { w: w, h: h });
                        try { localStorage.setItem(_LS_VAV_SIZE, JSON.stringify({ w: w, h: h })); } catch(_) {}
                    }, 200);
                };
                update();
                const RO = (typeof ResizeObserver !== 'undefined') ? ResizeObserver : null;
                let ro = null;
                if (RO) { ro = new RO(update); ro.observe(el); }
                return () => {
                    if (ro) ro.disconnect();
                    if (debounce) clearTimeout(debounce);
                };
            }, [selectedVavForModal, vavModalPopupHost]);

            const [showFloorPlanForAhu, setShowFloorPlanForAhu] = useState(null);
            const [floorPlanModalSize, setFloorPlanModalSize] = useState(() => _loadSize(_LS_FP_SIZE, { w: 1400, h: 900 }));
            const floorOuterRef = useRef(null);

            useEffect(() => {
                if (!showFloorPlanForAhu || floorPlanPopupHost) return;
                const el = floorOuterRef.current;
                if (!el) return;
                let debounce = null;
                const update = () => {
                    if (!el) return;
                    const w = el.offsetWidth, h = el.offsetHeight;
                    if (w < 400 || h < 300) return;
                    if (debounce) clearTimeout(debounce);
                    debounce = setTimeout(() => {
                        setFloorPlanModalSize(prev => (prev.w === w && prev.h === h) ? prev : { w: w, h: h });
                        try { localStorage.setItem(_LS_FP_SIZE, JSON.stringify({ w: w, h: h })); } catch(_) {}
                    }, 200);
                };
                update();
                const RO = (typeof ResizeObserver !== 'undefined') ? ResizeObserver : null;
                let ro = null;
                if (RO) { ro = new RO(update); ro.observe(el); }
                return () => {
                    if (ro) ro.disconnect();
                    if (debounce) clearTimeout(debounce);
                };
            }, [showFloorPlanForAhu, floorPlanPopupHost]);

            useEffect(() => {
                if (!showFloorPlanForAhu && floorPlanPopupWin && !floorPlanPopupWin.closed) floorPlanPopupWin.close();
            }, [showFloorPlanForAhu, floorPlanPopupWin]);

            const popOutAhuModal       = useCallback(() => openPopupFor('ahu_modal',  'Red5 AHU Equipment Diagram (popped out)',  ahuModalPopupWin,  [setAhuModalPopupWin,  setAhuModalPopupHost],  ahuModalSize, [
                [vavModalPopupWin, setVavModalPopupWin, setVavModalPopupHost],
                [floorPlanPopupWin, setFloorPlanPopupWin, setFloorPlanPopupHost],
            ].filter(e => e[0] && e[0].__red5IsPip)),  [openPopupFor, ahuModalPopupWin, ahuModalSize, vavModalPopupWin, floorPlanPopupWin]);
            const popOutVavModal       = useCallback(() => openPopupFor('vav_modal',  'Red5 VAV Detail (popped out)',             vavModalPopupWin,  [setVavModalPopupWin,  setVavModalPopupHost],  vavModalSize, [
                [ahuModalPopupWin, setAhuModalPopupWin, setAhuModalPopupHost],
                [floorPlanPopupWin, setFloorPlanPopupWin, setFloorPlanPopupHost],
            ].filter(e => e[0] && e[0].__red5IsPip)),  [openPopupFor, vavModalPopupWin, vavModalSize, ahuModalPopupWin, floorPlanPopupWin]);
            const popOutFloorPlanModal = useCallback(() => openPopupFor('floor_plan', 'Red5 Floor Plan (popped out)',             floorPlanPopupWin, [setFloorPlanPopupWin, setFloorPlanPopupHost], floorPlanModalSize, [
                [ahuModalPopupWin, setAhuModalPopupWin, setAhuModalPopupHost],
                [vavModalPopupWin, setVavModalPopupWin, setVavModalPopupHost],
            ].filter(e => e[0] && e[0].__red5IsPip)), [openPopupFor, floorPlanPopupWin, floorPlanModalSize, ahuModalPopupWin, vavModalPopupWin]);

            const floatPipAhuModal = useCallback(() => openPipFor('ahu_modal', 'Red5 AHU Equipment Diagram', ahuModalPopupWin, [setAhuModalPopupWin, setAhuModalPopupHost], ahuModalSize, [
                [vavModalPopupWin, setVavModalPopupWin, setVavModalPopupHost],
                [floorPlanPopupWin, setFloorPlanPopupWin, setFloorPlanPopupHost],
            ]), [openPipFor, ahuModalPopupWin, ahuModalSize, vavModalPopupWin, floorPlanPopupWin]);
            const floatPipVavModal = useCallback(() => openPipFor('vav_modal', 'Red5 VAV Detail', vavModalPopupWin, [setVavModalPopupWin, setVavModalPopupHost], vavModalSize, [
                [ahuModalPopupWin, setAhuModalPopupWin, setAhuModalPopupHost],
                [floorPlanPopupWin, setFloorPlanPopupWin, setFloorPlanPopupHost],
            ]), [openPipFor, vavModalPopupWin, vavModalSize, ahuModalPopupWin, floorPlanPopupWin]);
            const floatPipFloorPlanModal = useCallback(() => openPipFor('floor_plan', 'Red5 Floor Plan', floorPlanPopupWin, [setFloorPlanPopupWin, setFloorPlanPopupHost], floorPlanModalSize, [
                [ahuModalPopupWin, setAhuModalPopupWin, setAhuModalPopupHost],
                [vavModalPopupWin, setVavModalPopupWin, setVavModalPopupHost],
            ]), [openPipFor, floorPlanPopupWin, floorPlanModalSize, ahuModalPopupWin, vavModalPopupWin]);
            const [floorPlanOffset, setFloorPlanOffset] = useState({ x: 100, y: 50 });

            /* Sun-Path Phase A integration (Dashboard). Tracks live sun-state
               (enabled, azimuth, elevation) + building lat/lon for façade
               exposure highlighting + directional shadows on AHU/VAV markers
               inside the Floor Plan modal.  Read-only here — authored by the
               Config Tool's Sun-Path compass; the dashboard only consumes. */
            const [sunState, setSunState] = useState(null);
            // Belt-and-suspenders: SunCompass also broadcasts on window so a
            // missed props.onChange (seen on V1.9: dial ON, parent sunState
            // null → no VAV rings) cannot leave markers dark.
            useEffect(() => {
                const onSun = (e) => {
                    if (e && e.detail) setSunState(e.detail);
                };
                window.addEventListener('r5-sun-state', onSun);
                return () => window.removeEventListener('r5-sun-state', onSun);
            }, []);
            // Building lat/lon for solar math.  DERIVED from `weatherLocation`
            // (declared below) so the floor-plan sun path follows the user's
            // active weather selection in real time.  Falls back to NYC only
            // when nothing is picked yet.  Bug history (2026-05-29): an
            // earlier useEffect tried `data[0]` against /api/weather-location,
            // but that endpoint returns {active, saved, default} (a dict, not
            // an array), so the check `Array.isArray(data) && data[0]` was
            // always false and the sun path was permanently stuck on NYC
            // regardless of what the operator selected. 
            const [isFloorPlanDragging, setIsFloorPlanDragging] = useState(false);
            const [mapConfig, setMapConfig] = useState(null);
            const [floorWindowsPanelOpen, setFloorWindowsPanelOpen] = useState(false);
            const [selectedFloorWindowId, setSelectedFloorWindowId] = useState(null);
            
            // Weather strip state
            const [showWeatherStrip, setShowWeatherStrip] = useState(false);
            const [weatherAllDaily, setWeatherAllDaily] = useState([]);
            const [weatherAllHourly, setWeatherAllHourly] = useState([]);
            const [weatherLoading, setWeatherLoading] = useState(false);
            const [weatherLocation, setWeatherLocation] = useState(() => {
                try { return JSON.parse(localStorage.getItem('weatherLocation')) || null; } catch { return null; }
            });
            // Derived value -- always reflects the active weather location.
            // See comment near `sunState` declaration for bug history.
            const buildingLatLon = (weatherLocation && typeof weatherLocation.lat === 'number')
                ? {lat: weatherLocation.lat, lon: weatherLocation.lon}
                : {lat: 40.7128, lon: -74.0060};
            // ELC-style building aspect (façade facing). Slim v1: drives
            // northOffsetDeg for sun ray / window shafts on the floor plan.
            const [buildingFacing, setBuildingFacing] = useState(() => {
                try {
                    const v = localStorage.getItem('red5.building_facing');
                    if (v && ['auto','N','NE','E','SE','S','SW','W','NW'].indexOf(v) >= 0) return v;
                } catch (e) {}
                return 'auto';
            });
            const buildingFacingOffset = (typeof window.red5FacingToNorthOffset === 'function')
                ? window.red5FacingToNorthOffset(buildingFacing, buildingLatLon.lat)
                : 0;
            // Saved-location list is now controller-backed (single source of truth on the
            // controller). Local copy mirrors `savedWeatherLocations` so the modal can
            // render synchronously without flicker.
            const [savedWeatherLocations, setSavedWeatherLocations] = useState(() => {
                try { return JSON.parse(localStorage.getItem('savedWeatherLocations')) || []; } catch { return []; }
            });
            // Pinned default location (★) — loaded on every fresh session
            // before the operator picks an explicit `active`.  Single source
            // of truth lives on the server (`tenant_weather_location.default`);
            // local mirror lets the modal render stars without flicker.
            const [defaultLocation, setDefaultLocation] = useState(() => {
                try { return JSON.parse(localStorage.getItem('defaultWeatherLocation')) || null; } catch { return null; }
            });
            const [weatherSaveError, setWeatherSaveError] = useState('');
            // Hydrate weather state (active + saved list) from controller. Run on
            // mount and whenever the operator opens the location modal — that's
            // sufficient for cross-PC visibility of newly added/removed entries.
            // Background polling was tried earlier but raced against in-flight
            // POSTs from the same browser, occasionally reverting the local
            // selection back to the controller's previous state. Keep it
            // simple: pull on demand only.
            const hydrateWeatherState = useCallback(() => {
                return fetch(`${API_URL}/api/weather-location`, { cache: 'no-store' })
                    .then(r => r.ok ? r.json() : null)
                    .then(state => {
                        if (!state) return;
                        const active = state.active && typeof state.active.lat === 'number' && typeof state.active.lon === 'number' ? state.active : null;
                        const saved = Array.isArray(state.saved) ? state.saved.filter(s => s && typeof s.lat === 'number' && typeof s.lon === 'number') : [];
                        const pinned = state.default && typeof state.default.lat === 'number' && typeof state.default.lon === 'number' ? state.default : null;
                        const facing = state.building_facing;
                        if (facing && ['auto','N','NE','E','SE','S','SW','W','NW'].indexOf(facing) >= 0) {
                            setBuildingFacing(facing);
                            try { localStorage.setItem('red5.building_facing', facing); } catch (e) {}
                        }
                        try { localStorage.setItem('savedWeatherLocations', JSON.stringify(saved)); } catch (e) {}
                        if (pinned) {
                            try { localStorage.setItem('defaultWeatherLocation', JSON.stringify(pinned)); } catch (e) {}
                        } else {
                            try { localStorage.removeItem('defaultWeatherLocation'); } catch (e) {}
                        }
                        setSavedWeatherLocations(saved);
                        setDefaultLocation(pinned);
                        // Active is only adopted from the server on first mount —
                        // i.e. when local state has no active yet. Otherwise the
                        // operator's just-clicked selection could be reverted.
                        // Fresh-session precedence: pinned default > stored active
                        // > nothing — so the operator's "★" choice always wins
                        // on first open of the day.
                        setWeatherLocation(prev => {
                            if (prev) return prev;
                            return pinned || active || prev;
                        });
                    })
                    .catch(() => {});
            }, []);
            // Initial hydrate on mount only. (No polling — see comment above.)
            useEffect(() => {
                hydrateWeatherState();
            }, [hydrateWeatherState]);
            // Persist full weather state (active + saved list) to controller.
            const persistWeatherState = useCallback((active, savedList) => {
                setWeatherSaveError('');
                // 60 s timeout. Embedded controllers writing to flash with fsync
                // can take several seconds; if the request queues behind the
                // background prefetch's GET storm on a thread-limited Flask
                // instance, total budget can run long. 60 s is generous but
                // still bounded so a truly stalled connection (Opera GX VPN,
                // disconnected network) doesn't leave the operator wondering
                // whether the save landed.
                const controller = new AbortController();
                const TIMEOUT_MS = 60000;
                const timer = setTimeout(() => controller.abort('timeout'), TIMEOUT_MS);
                const _t0 = performance.now();
                return fetch(`${API_URL}/api/weather-location`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ active: active || null, saved: savedList || [], building_facing: buildingFacing || 'auto' }),
                    signal: controller.signal
                })
                .then(async r => {
                    if (!r.ok) {
                        const txt = await r.text().catch(() => '');
                        throw new Error(`HTTP ${r.status}: ${txt.slice(0, 120)}`);
                    }
                    return r.json();
                })
                .catch(e => {
                    const elapsed = Math.round(performance.now() - _t0);
                    console.warn(`weather-location save failed after ${elapsed}ms:`, e);
                    // Reliable abort detection across browsers — modern browsers
                    // throw the abort reason directly (e === 'timeout'), older
                    // ones throw a DOMException named 'AbortError'. Check the
                    // signal state itself.
                    const wasAborted = controller.signal.aborted;
                    let reason;
                    if (wasAborted) {
                        reason = `Save timed out after ${Math.round(TIMEOUT_MS/1000)} s (took ~${elapsed}ms). The list shown locally is not persisted on the controller. Possible causes: VPN/ad-blocker, slow flash write, or the controller is unreachable.`;
                    } else {
                        const msg = (e && e.message) ? e.message : (typeof e === 'string' ? e : 'unknown');
                        reason = 'Save to controller failed: ' + msg;
                    }
                    setWeatherSaveError(reason);
                    setTimeout(() => setWeatherSaveError(prev => prev === reason ? '' : prev), 60000);
                })
                .finally(() => {
                    clearTimeout(timer);
                });
            }, [buildingFacing]);

            // ----------------------------------------------------------------
            // Pin / unpin a default location.  Persists to the server's
            // `tenant_weather_location.default` field so the dashboard
            // auto-loads this hospital on every fresh session, regardless
            // of what was last active.  Pass `null` to clear the pin.
            // ----------------------------------------------------------------
            const pinLocation = useCallback((loc) => {
                const body = (loc && typeof loc.lat === 'number' && typeof loc.lon === 'number')
                    ? { default: { lat: loc.lat, lon: loc.lon, name: loc.name || '' } }
                    : { default: null };
                if (body.default) {
                    try { localStorage.setItem('defaultWeatherLocation', JSON.stringify(body.default)); } catch (e) {}
                } else {
                    try { localStorage.removeItem('defaultWeatherLocation'); } catch (e) {}
                }
                setDefaultLocation(body.default);
                return fetch(`${API_URL}/api/weather-location`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    credentials: 'include',
                    body: JSON.stringify(body)
                }).catch(e => console.warn('pin failed:', e));
            }, []);
            const [weatherZoom, setWeatherZoom] = useState(null);
            const [weatherDragStart, setWeatherDragStart] = useState(null);
            const [weatherDragCurrent, setWeatherDragCurrent] = useState(null);
            const [showWeatherSettings, setShowWeatherSettings] = useState(false);
            // Whenever the operator opens the weather location modal, re-pull the
            // controller-side state so the dropdown reflects any additions/removals
            // performed on a different PC since this browser was last synced.
            useEffect(() => {
                if (showWeatherSettings) hydrateWeatherState();
            }, [showWeatherSettings, hydrateWeatherState]);
            const [weatherError, setWeatherError] = useState(null);
            const [weatherViewMode, setWeatherViewMode] = useState('active_year');
            const [weatherNavDate, setWeatherNavDate] = useState(() => new Date().toISOString().slice(0, 10));
            const [weatherHoverIdx, setWeatherHoverIdx] = useState(null);
            const [forecast, setForecast] = useState(null);

            const [showConfigAuth, setShowConfigAuth] = useState(false);
            const [configPwInput, setConfigPwInput] = useState('');
            const [configPwError, setConfigPwError] = useState('');

            /* --- Collector Config Modal state --- */
            const [showCollectorCfg, setShowCollectorCfg] = useState(false);
            const [ccTab, setCcTab] = useState('groups');
            const [ccConfig, setCcConfig] = useState(null);
            const [ccEquipTypes, setCcEquipTypes] = useState(null);
            const [ccSaving, setCcSaving] = useState(false);
            const [ccMsg, setCcMsg] = useState('');
            const [ccEditGroup, setCcEditGroup] = useState(null);
            const [ccNewGroupName, setCcNewGroupName] = useState('');
            const [ccNewGroupCsv, setCcNewGroupCsv] = useState('');
            const [ccNewVav, setCcNewVav] = useState('');

            const loadCollectorCfg = async () => {
                try {
                    // If equipment types are already loaded at page startup
                    // (initial asset fetch stashes them into ccEquipTypes /
                    // window._equipTypesCache), skip the redundant 1.7 MB
                    // download on modal open.  The modal was blocking on a
                    // full equipment-types re-fetch every time; reusing the
                    // cached copy collapses open time from ~500ms to ~5ms.
                    const cached = (window._equipTypesCache && Object.keys(window._equipTypesCache).length)
                        ? window._equipTypesCache : null;
                    if (cached) {
                        const cfgRes = await fetch(API_URL + '/api/collector-config', { credentials: 'include' });
                        const cfgData = await cfgRes.json();
                        setCcConfig(cfgData.config || cfgData);
                        setCcEquipTypes(cached);
                        setCcMsg('');
                        return;
                    }
                    const [cfgRes, etRes] = await Promise.all([
                        fetch(API_URL + '/api/collector-config', { credentials: 'include' }),
                        fetch(API_URL + '/api/equipment-types', { credentials: 'include' })
                    ]);
                    const cfgData = await cfgRes.json();
                    const etData = await etRes.json();
                    setCcConfig(cfgData.config || cfgData);
                    setCcEquipTypes(etData);
                    window._equipTypesCache = etData;
                    setCcMsg('');
                } catch (e) { setCcMsg('Load failed: ' + e.message); }
            };

            const saveCollectorCfg = async (cfg) => {
                setCcSaving(true); setCcMsg('');
                try {
                    const r = await fetch(API_URL + '/api/collector-config', {
                        method: 'POST',
                        credentials: 'include',
                        headers: {'Content-Type':'application/json'},
                        body: JSON.stringify(cfg)
                    });
                    const d = await r.json();
                    if (d.success) {
                        setCcConfig(cfg);
                        setCcMsg(d.persisted === false
                            ? (d.warning || 'Saved (preview only -- sign in to persist).')
                            : 'Saved.');
                    } else {
                        setCcMsg('Error: ' + (d.error || d.detail || 'Unknown'));
                    }
                } catch (e) { setCcMsg('Save failed: ' + e.message); }
                setCcSaving(false);
            };

            const saveEquipTypes = async (et) => {
                setCcSaving(true); setCcMsg('');
                try {
                    const r = await fetch(API_URL + '/api/save-equipment-schema', {
                        method: 'POST',
                        credentials: 'include',
                        headers: {'Content-Type':'application/json'},
                        body: JSON.stringify({ equipment_schema: et })
                    });
                    const d = await r.json();
                    if (d.success) {
                        setCcEquipTypes(et);
                        setCcMsg(d.persisted === false
                            ? (d.warning || 'Saved (preview only -- sign in to persist).')
                            : 'Equipment types saved.');
                    } else {
                        setCcMsg(d.warning
                            ? d.warning
                            : 'Error: ' + (d.error || d.detail || 'Unknown'));
                    }
                } catch (e) { setCcMsg('Save failed: ' + e.message); }
                setCcSaving(false);
            };

            const openCollectorCfg = () => {
                loadCollectorCfg();
                setShowCollectorCfg(true);
                setCcEditGroup(null);
                setCcMsg('');
            };

            /* Poll for i18n.js availability (handles async script loading) */
            useEffect(() => {
                if (window.LangSelector) { setI18nReady(true); return; }
                const iv = setInterval(() => { if (window.LangSelector) { setI18nReady(true); clearInterval(iv); } }, 200);
                return () => clearInterval(iv);
            }, []);

            const svgRef = useRef(null);
            const dynRef = useRef(null);
            const psy3dRef = useRef(null);
            const psy3dInit = useRef(false);
            const width = 1300, height = 750;
            const T_MIN = tempRange.min, T_MAX = tempRange.max, W_MAX = 30;
            const gridWidth = 1092, gridHeight = 540, pad = { left: 90, right: 100, top: 105, bottom: 105 };

            const ui = THEMES[theme];

            const x = (temp) => safe(pad.left + ((temp - T_MIN) / (T_MAX - T_MIN)) * gridWidth);
            const y = (moist) => safe((pad.top + gridHeight) - (moist / (W_MAX / 1000)) * gridHeight);
            const invX = (mx) => T_MIN + ((mx - pad.left) / gridWidth) * (T_MAX - T_MIN);
            const invY = (my) => ((pad.top + gridHeight - my) / gridHeight) * (W_MAX / 1000);

            const filteredAhuData = useMemo(() => {
                if (!searchTerm || !ahuData) return ahuData || [];
                const q = searchTerm.toLowerCase();
                if (!q.includes('*') && !q.includes('?')) {
                    return ahuData.filter(a => a.id.toLowerCase().includes(q));
                }
                try {
                    let pattern = q.replace(/[.+^${}()|[\]\\]/g, (m) => '\\\\' + m); 
                    pattern = "^.*" + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + ".*$";
                    const rx = new RegExp(pattern, "i");
                    return ahuData.filter(a => rx.test(a.id));
                } catch(e) { return ahuData.filter(a => a.id.toLowerCase().includes(q)); }
            }, [ahuData, searchTerm]);

            // Load image asset URLs from backend
            useEffect(() => {
                const API_URL = window.API_BASE_URL || window.location.origin;
                fetch(`${API_URL}/api/assets`)
                    .then(r => r.json())
                    .then(data => {
                        if (data.vav) setVavImage(`${API_URL}${data.vav}`);
                        if (data.floor) setFloorImage(`${API_URL}${data.floor}`);
                        if (data.ahu) setAhuImage(`${API_URL}${data.ahu}`);
                        if (data.ahu_types) {
                            const imgs = {};
                            Object.entries(data.ahu_types).forEach(([tid, path]) => {
                                imgs[tid] = `${API_URL}${path}`;
                            });
                            setAhuTypeImages(imgs);
                        }
                        if (data.vav_types) {
                            // V1.9 returns a {filename: '/assets/<rel>'} map so the
                            // dashboard can resolve `base_graphic` even when the
                            // schema stores only the bare filename. Mirrors AHU.
                            const vimgs = {};
                            Object.entries(data.vav_types).forEach(([fname, path]) => {
                                vimgs[fname] = `${API_URL}${path}`;
                            });
                            setVavTypeImages(vimgs);
                        }
                        // Cache equipment_types for overlay positions
                        fetch(`${API_URL}/api/equipment-types`).then(r => r.json()).then(et => {
                            window._equipTypesCache = et;
                            setCcEquipTypes(et);
                            // Preload AHU + VAV base graphics into browser cache so modals open instantly.
                            // new Image().src = url triggers the fetch and seeds the HTTP cache; no DOM mount.
                            try {
                                const types = [...Object.values(et.ahu_types || {}), ...Object.values(et.vav_types || {})];
                                types.forEach(tdef => {
                                    const p = tdef && tdef.visual_assets && tdef.visual_assets.base_graphic;
                                    if (p) { const im = new Image(); im.src = `${API_URL}/api/assets/${p}`; }
                                });
                            } catch (e) {}
                        }).catch(() => {});
                        if (data.debug) setPyDebug(data.debug);
                    })
                    .catch(e => console.error('Asset fetch error:', e));
            }, []);

            // Fetch map_config.json for floor plan layout
            useEffect(() => {
                const API_URL = window.API_BASE_URL || window.location.origin;
                fetch(`${API_URL}/api/map-config`, { credentials: 'include' })
                    .then(r => { if (!r.ok) throw new Error('No map_config.json'); return r.json(); })
                    .then(data => {
                        // Backend may return a wrapper with `{floors:..., mode:'demo'}`
                        // when nothing is saved; treat that as "no map" so the
                        // fallback layout renders instead of an empty grid.
                        if (data && Array.isArray(data.floors) && data.floors.length > 0) setMapConfig(data);
                        else setMapConfig(null);
                    })
                    .catch(() => setMapConfig(null));
            }, []);

            // Browser-session memoization of weather history. After loading
            // a city's data once in this tab, switching back to it is instant
            // (no controller round-trip). Saves the operator from waiting
            // ~1-3 s per switch on slow embedded controllers.
            const weatherCacheRef = useRef({});
            // Guard against stale fetch results overwriting newer data when the
            // operator quickly switches between locations.
            const weatherFetchSeqRef = useRef(0);
            // Status of the most recent weather-history fetch — surfaced as a
            // small badge in the UI so the operator can see whether the data
            // came from the browser, the controller cache, or open-meteo.
            const [weatherFetchStatus, setWeatherFetchStatus] = useState(null);

            // Fetch weather history - both current year and previous year
            const fetchWeatherHistory = async (loc) => {
                if (!loc || !loc.lat || !loc.lon) return;
                const mySeq = ++weatherFetchSeqRef.current;
                const cacheKey = loc.lat.toFixed(2) + ',' + loc.lon.toFixed(2);
                const memo = weatherCacheRef.current[cacheKey];
                if (memo) {
                    setWeatherAllDaily(memo.daily);
                    setWeatherAllHourly(memo.hourly);
                    setWeatherError(null);
                    setWeatherLoading(false);
                    setWeatherFetchStatus({ source: 'browser', ms: 0, name: loc.name || cacheKey });
                    return;
                }
                setWeatherLoading(true);
                setWeatherError(null);
                const _t0 = performance.now();
                try {
                    const API_URL = window.API_BASE_URL || window.location.origin;
                    const thisYear = new Date().getFullYear();
                    const lastYear = thisYear - 1;
                    const [r1, r2] = await Promise.all([
                        fetch(`${API_URL}/api/weather-history?lat=${loc.lat}&lon=${loc.lon}&year=${lastYear}`).then(r => r.json()),
                        fetch(`${API_URL}/api/weather-history?lat=${loc.lat}&lon=${loc.lon}&year=${thisYear}`).then(r => r.json())
                    ]);
                    // If a newer selection started while we were waiting, drop our results.
                    if (mySeq !== weatherFetchSeqRef.current) return;
                    const d1 = (r1.success && r1.daily) ? r1.daily : [];
                    const d2 = (r2.success && r2.daily) ? r2.daily : [];
                    const h1 = (r1.success && r1.hourly) ? r1.hourly : [];
                    const h2 = (r2.success && r2.hourly) ? r2.hourly : [];
                    const merged = [...d1, ...d2].sort((a, b) => a.date.localeCompare(b.date));
                    const mergedHourly = [...h1, ...h2].sort((a, b) => a.time.localeCompare(b.time));
                    if (merged.length > 0) {
                        setWeatherAllDaily(merged);
                        setWeatherAllHourly(mergedHourly);
                        weatherCacheRef.current[cacheKey] = { daily: merged, hourly: mergedHourly };
                        const bothCached = (r1._from_cache === true) && (r2._from_cache === true);
                        setWeatherFetchStatus({
                            source: bothCached ? 'controller' : 'net',
                            ms: Math.round(performance.now() - _t0),
                            name: loc.name || cacheKey
                        });
                    } else {
                        setWeatherError(r1.error || r2.error || 'No weather data returned');
                        setWeatherFetchStatus(null);
                    }
                } catch (err) {
                    if (mySeq !== weatherFetchSeqRef.current) return;
                    console.error('[Weather] Fetch error:', err);
                    setWeatherError('Fetch failed: ' + (err && err.message ? err.message : err));
                    setWeatherFetchStatus(null);
                } finally {
                    if (mySeq === weatherFetchSeqRef.current) setWeatherLoading(false);
                }
            };
            
            useEffect(() => {
                if (weatherLocation) fetchWeatherHistory(weatherLocation);
            }, [weatherLocation]);

            // Background prefetch: after the active location loads, quietly
            // pre-populate the memo for every other saved location so the
            // operator's NEXT selection is also instant. Runs sequentially
            // (one location at a time) so we don't hammer the embedded
            // controller's CPU all at once. Skips the active location and
            // anything already memoized.
            useEffect(() => {
                if (!Array.isArray(savedWeatherLocations) || savedWeatherLocations.length === 0) return;
                let cancelled = false;
                const run = async () => {
                    // Initial delay so the active location's fetch finishes first
                    // and the operator's first interaction (click weather, pick a
                    // location, settle UI) doesn't compete with prefetch GETs for
                    // the controller's limited request slots.
                    await new Promise(res => setTimeout(res, 4000));
                    const API_URL = window.API_BASE_URL || window.location.origin;
                    const thisYear = new Date().getFullYear();
                    const lastYear = thisYear - 1;
                    for (const loc of savedWeatherLocations) {
                        if (cancelled) return;
                        if (!loc || typeof loc.lat !== 'number' || typeof loc.lon !== 'number') continue;
                        const key = loc.lat.toFixed(2) + ',' + loc.lon.toFixed(2);
                        if (weatherCacheRef.current[key]) continue;
                        try {
                            // Sequential within a location too — keeps concurrent
                            // requests against the controller at 1 at any moment,
                            // leaving plenty of headroom for the operator's
                            // interactive POSTs (selectLocation persist).
                            const r1 = await fetch(`${API_URL}/api/weather-history?lat=${loc.lat}&lon=${loc.lon}&year=${lastYear}`).then(r => r.json());
                            if (cancelled) return;
                            const r2 = await fetch(`${API_URL}/api/weather-history?lat=${loc.lat}&lon=${loc.lon}&year=${thisYear}`).then(r => r.json());
                            if (cancelled) return;
                            const d1 = (r1.success && r1.daily) ? r1.daily : [];
                            const d2 = (r2.success && r2.daily) ? r2.daily : [];
                            const h1 = (r1.success && r1.hourly) ? r1.hourly : [];
                            const h2 = (r2.success && r2.hourly) ? r2.hourly : [];
                            const merged = [...d1, ...d2].sort((a, b) => a.date.localeCompare(b.date));
                            const mergedHourly = [...h1, ...h2].sort((a, b) => a.time.localeCompare(b.time));
                            if (merged.length > 0) {
                                weatherCacheRef.current[key] = { daily: merged, hourly: mergedHourly };
                            }
                        } catch (e) {
                            // Silent — prefetch is best-effort. The user's explicit
                            // selection will retry through fetchWeatherHistory.
                        }
                        // Yield 1.5 s between locations so the controller stays
                        // responsive to interactive POSTs.
                        await new Promise(res => setTimeout(res, 1500));
                    }
                };
                run();
                return () => { cancelled = true; };
            }, [savedWeatherLocations]);

            // Compute visible weather data based on view mode
            const getWeatherView = () => {
                const all = weatherAllDaily;
                if (!all || all.length === 0) return null;
                const today = new Date().toISOString().slice(0, 10);
                const thisYearStr = today.slice(0, 4);
                const lastYearStr = String(parseInt(thisYearStr) - 1);
                const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

                switch (weatherViewMode) {
                    case 'active_year': {
                        // Base: full previous year (Jan 1 - Dec 31)
                        const base = all.filter(d => d.date >= lastYearStr + '-01-01' && d.date <= lastYearStr + '-12-31');
                        // Overlay: current YTD (Jan 1 - today), mapped to same day-of-year positions
                        const overlay = all.filter(d => d.date >= thisYearStr + '-01-01' && d.date <= today);
                        const label = lastYearStr + ' + ' + thisYearStr + ' YTD (' + overlay.length + 'd)';
                        return { data: base, overlay, boundary: -1, label };
                    }
                    case 'full_year': {
                        const yr = weatherNavDate.slice(0, 4);
                        const data = all.filter(d => d.date.startsWith(yr));
                        return { data, boundary: -1, label: yr + ' (' + data.length + 'd)' };
                    }
                    case 'month': {
                        const ym = weatherNavDate.slice(0, 7);
                        const data = all.filter(d => d.date.startsWith(ym));
                        const mi = parseInt(ym.slice(5, 7)) - 1;
                        return { data, boundary: -1, label: months[mi] + ' ' + ym.slice(0, 4) };
                    }
                    case 'week': {
                        const nd = new Date(weatherNavDate + 'T12:00:00');
                        const day = nd.getDay();
                        const mon = new Date(nd);
                        mon.setDate(nd.getDate() - (day === 0 ? 6 : day - 1));
                        const sun = new Date(mon);
                        sun.setDate(mon.getDate() + 6);
                        const s = mon.toISOString().slice(0, 10);
                        const e = sun.toISOString().slice(0, 10);
                        // Use hourly data with 8hr markers
                        const hourlyData = weatherAllHourly.filter(h => h.time.slice(0,10) >= s && h.time.slice(0,10) <= e);
                        if (hourlyData.length > 0) {
                            const mapped = hourlyData.map(h => ({
                                date: h.time,
                                temp_min: h.temp, temp_max: h.temp, temp_avg: h.temp,
                                rh_min: h.rh, rh_max: h.rh, rh_avg: h.rh,
                                h_avg: h.h
                            }));
                            return { data: mapped, boundary: -1, label: s.slice(5) + ' to ' + e.slice(5), isHourly: true, hourlyInterval: 8 };
                        }
                        const data = all.filter(d => d.date >= s && d.date <= e);
                        return { data, boundary: -1, label: s.slice(5) + ' to ' + e.slice(5) };
                    }
                    case 'day': {
                        const target = weatherNavDate;
                        // Use hourly data for full day granularity
                        const hourlyData = weatherAllHourly.filter(h => h.time.slice(0,10) === target);
                        if (hourlyData.length > 0) {
                            const mapped = hourlyData.map(h => ({
                                date: h.time,
                                temp_min: h.temp, temp_max: h.temp, temp_avg: h.temp,
                                rh_min: h.rh, rh_max: h.rh, rh_avg: h.rh,
                                h_avg: h.h
                            }));
                            return { data: mapped, boundary: -1, label: target, isHourly: true, hourlyInterval: 1 };
                        }
                        // Fallback to daily
                        const nd = new Date(weatherNavDate + 'T12:00:00');
                        const prev = new Date(nd); prev.setDate(nd.getDate() - 1);
                        const next = new Date(nd); next.setDate(nd.getDate() + 1);
                        const sF = prev.toISOString().slice(0, 10);
                        const eF = next.toISOString().slice(0, 10);
                        const data = all.filter(d => d.date >= sF && d.date <= eF);
                        return { data, boundary: -1, label: weatherNavDate, centerDate: weatherNavDate };
                    }
                    default: return { data: all, boundary: -1, label: '' };
                }
            };

            // Navigation helpers
            const weatherNav = (dir) => {
                const nd = new Date(weatherNavDate + 'T12:00:00');
                switch (weatherViewMode) {
                    case 'full_year': nd.setFullYear(nd.getFullYear() + dir); break;
                    case 'month': nd.setMonth(nd.getMonth() + dir); break;
                    case 'week': nd.setDate(nd.getDate() + dir * 7); break;
                    case 'day': nd.setDate(nd.getDate() + dir); break;
                }
                setWeatherNavDate(nd.toISOString().slice(0, 10));
                setWeatherZoom(null);
            };

            // Poll telemetry data from separated backend
            // NOTE: accepts optional AbortSignal so the polling loop can cancel
            // an in-flight request when the component unmounts.
            const fetchTelemetry = React.useCallback(async (signal) => {
                try {
                    const API_URL = window.API_BASE_URL || window.location.origin;
                    const response = await fetch(`${API_URL}/api/data`, signal ? { signal, credentials: 'include' } : { credentials: 'include' });
                    if (!response.ok) return;
                    const data = await response.json();
                    if (!Array.isArray(data)) return;
                    // Server-confirmed pending-write clearing:
                    // Only clear a pending write if this server response contains a matching
                    // value for that label AND the response arrived AFTER the pending write
                    // was created (never clear based on optimistic updates).
                    const pw = window._pendingWrites || {};
                    const nowMs = Date.now();
                    for (const k of Object.keys(pw)) {
                        const [eq, lbl] = k.split('|');
                        const rec = data.find(x => x.id === eq);
                        if (!rec) continue;
                        const srvVal = (rec.all_points || {})[lbl];
                        if (srvVal === pw[k].value) {
                            delete pw[k];
                        }
                    }
                    setAhuData(data);
                    _setForceApTick(t => t + 1);
                } catch (e) { /* AbortError or network blip - ignore */ }
            }, []);
            // Self-rescheduling poll loop: a new fetch is NEVER scheduled until the
            // previous one resolves/aborts. Prevents the queued-fetch DDoS bug where
            // a 1s setInterval would stack 20+ pending /api/data requests when the
            // controller was slow.
            useEffect(() => {
                const POLL_MS = 2000; // gap between completion of one poll and start of the next
                let cancelled = false;
                let timer = null;
                let controller = null;

                const tick = async () => {
                    if (cancelled) return;
                    controller = new AbortController();
                    try {
                        await fetchTelemetry(controller.signal);
                    } finally {
                        controller = null;
                        if (!cancelled) {
                            timer = setTimeout(tick, POLL_MS);
                        }
                    }
                };
                tick();

                return () => {
                    cancelled = true;
                    if (timer) clearTimeout(timer);
                    if (controller) { try { controller.abort(); } catch (e) {} }
                };
            }, [fetchTelemetry]);
            // Expose refetch so writeRW can trigger immediate refresh
            useEffect(() => { window._refetchTelemetry = fetchTelemetry; }, [fetchTelemetry]);

            // ── IFRAME-MODE MODAL AUTO-OPEN ──
            // Allows another page (e.g. mobile_mockup.html) to embed this dashboard
            // as an iframe focused on a single AHU/VAV equipment modal.  Triggered
            // via URL params:  ?iframe=1&modal_ahu=AHU-05-N  or  ?modal_vav=VAV-001
            // The `iframe=1` flag toggles a body class that hides every chrome
            // element except the modal itself, so the iframe content area is the
            // bare equipment graphic + data pills + animations.
            useEffect(() => {
                try {
                    const qp = new URLSearchParams(window.location.search);
                    if (qp.get('iframe') === '1') {
                        document.body.classList.add('iframe-modal-mode');
                    }
                    const wantAhu = qp.get('modal_ahu');
                    const wantVav = qp.get('modal_vav');
                    if (wantAhu) { setShowAhuModalFor(wantAhu); return; }
                    if (wantVav && ahuData && ahuData.length) {
                        for (const a of ahuData) {
                            const v = (a.vavs || []).find(x => x.id === wantVav);
                            if (v) {
                                setSelectedVavForModal(v);
                                setLockedVavId(v.id);
                                setIsLockedToSA(false);
                                break;
                            }
                        }
                    }
                } catch (e) { /* params parse - safe to ignore */ }
            }, [ahuData]);

            // Load initial data mode from backend
            useEffect(() => {
                const API_URL = window.API_BASE_URL || window.location.origin;
                fetch(API_URL + '/api/data-mode', { credentials: 'include' }).then(r => r.json()).then(d => {
                    if (d.success && d.mode) setDataMode(d.mode);
                }).catch(() => {});
            }, []);

            // Poll telemetry status (collector health)
            useEffect(() => {
                const checkStatus = async () => {
                    try {
                        const API_URL = window.API_BASE_URL || window.location.origin;
                        const r = await fetch(`${API_URL}/api/telemetry-status`, { credentials: 'include' });
                        if (r.ok) setTelemetryStatus(await r.json());
                    } catch (e) { }
                };
                checkStatus();
                const iv = setInterval(checkStatus, 10000);
                return () => clearInterval(iv);
            }, []);

            // Poll diagnostics data when on diagnostics view
            useEffect(() => {
                if (activeView !== 'diagnostics') return;
                const API_URL = window.API_BASE_URL || window.location.origin;
                const poll = async () => {
                    try {
                        const [logR, writeR, trendR] = await Promise.all([
                            fetch(`${API_URL}/api/collector-log`),
                            fetch(`${API_URL}/api/write-history`),
                            fetch(`${API_URL}/api/trend-history`)
                        ]);
                        if (logR.ok) { const d = await logR.json(); setCollectorLog(d.entries || []); }
                        if (writeR.ok) { const d = await writeR.json(); setWriteHistory(d.history || []); }
                        if (trendR.ok) { const d = await trendR.json(); setTrendHistory(d.data || {}); }
                    } catch (e) {}
                };
                poll();
                const iv = setInterval(poll, 5000);
                return () => clearInterval(iv);
            }, [activeView]);

            // Fetch tomorrow's forecast when weather location is available
            useEffect(() => {
                if (!weatherLocation) return;
                const API_URL = window.API_BASE_URL || window.location.origin;
                fetch(`${API_URL}/api/tomorrow-forecast?lat=${weatherLocation.lat}&lon=${weatherLocation.lon}`)
                    .then(r => r.json())
                    .then(d => { if (d.success) setForecast(d); })
                    .catch(() => {});
            }, [weatherLocation]);

            useEffect(() => {
                if (selectedAhuId && ahuData.length > 0) {
                    const ahu = ahuData.find(a => a.id === selectedAhuId);
                    if (ahu && ahu.points) {
                        const sa = ahu.points[1], targetVav = ahu.vavs ? ahu.vavs.find(v => v.id === lockedVavId) : null;
                        let targetT, targetW;
                        if (targetVav) { targetT = targetVav.t; targetW = targetVav.w; }
                        else if (sa && isLockedToSA) { targetT = sa.t; targetW = sa.w; }
                        
                        if (targetT !== undefined) {
                            setIndicatorPos({ t: targetT, w: targetW });
                        }
                        setIsProcessVisible(true);
                    }
                } else {
                    setIsProcessVisible(false);
                }
            }, [selectedAhuId, isLockedToSA, lockedVavId, ahuData]);

            // Dynamics animation — stable useEffect (not inline component)
            useEffect(() => {
                if (activeView !== 'dynamics' || !dynRef.current) return;
                if (typeof initDynamicsAnimation !== 'function') return;
                const cleanup = initDynamicsAnimation(dynRef.current, theme === 'dark', { tMin: tempRange.min, tMax: tempRange.max });
                return cleanup;
            }, [activeView, theme, tempRange.min, tempRange.max]);

            // 3D Weather Strip — mount engine into ref div
            useEffect(() => {
                if (activeView !== 'weather3d' || !psy3dRef.current) return;
                if (typeof initPsy3D !== 'function') return;
                if (psy3dInit.current && psy3dRef.current.querySelector('canvas')) return;
                psy3dInit.current = true;
                var wl = null;
                try { wl = JSON.parse(localStorage.getItem('weatherLocation')); } catch(e) {}
                initPsy3D(psy3dRef.current, { weatherLocation: wl || weatherLocation });
            }, [activeView]);

            // ----------------------------------------------------------------
            // Bidirectional location sync: PSYCH tab <-> 3D WX tab.
            // ----------------------------------------------------------------
            // Bug fixed: previously the 3D WX engine read `weatherLocation`
            // ONCE at mount and kept rendering the original city's scatter
            // cloud even after the operator picked a new location in the
            // dashboard's weather modal.  Now:
            //
            //   PSYCH -> 3D WX: when `weatherLocation` changes AND the engine
            //   is already mounted, call its public `setPsy3DLocation()` so
            //   the form fields update and the scatter cloud re-fetches.
            //
            //   3D WX -> PSYCH: the engine fires a `r5-location-change`
            //   CustomEvent whenever its internal dropdown picks a new
            //   location; we mirror it into React state + localStorage so
            //   the bottom weather strip flips to the same city.
            useEffect(() => {
                if (!weatherLocation) return;
                if (typeof window.setPsy3DLocation === 'function') {
                    window.setPsy3DLocation(weatherLocation);
                }
            }, [weatherLocation && weatherLocation.lat, weatherLocation && weatherLocation.lon]);

            useEffect(() => {
                const handler = (ev) => {
                    const loc = ev && ev.detail;
                    if (!loc || typeof loc.lat !== 'number' || typeof loc.lon !== 'number') return;
                    // Guard against echo: only update if it's actually different.
                    if (weatherLocation
                        && Math.abs(weatherLocation.lat - loc.lat) < 1e-4
                        && Math.abs(weatherLocation.lon - loc.lon) < 1e-4) return;
                    setWeatherLocation(loc);
                    try { localStorage.setItem('weatherLocation', JSON.stringify(loc)); } catch (e) {}
                };
                window.addEventListener('r5-location-change', handler);
                return () => window.removeEventListener('r5-location-change', handler);
            }, [weatherLocation]);

            // Comfort zone and diagnostics loaded from js/psychrometric.js
            // Functions: getEnergyMetrics, buildComfortZonePoly, isInComfortZone,
            //            getZoneDemand, getVavDiagnostic, getAhuDiagnostic
            
            const comfortZonePoly = useMemo(() => buildComfortZonePoly(), []);

            // Find floor and markers for a given AHU from map_config.json
            const getFloorForAhu = (ahuId) => {
                if (!mapConfig || !mapConfig.floors) return null;
                for (const floor of mapConfig.floors) {
                    if (!floor.markers) continue;
                    const ahuMarker = floor.markers.find(m => m.type === 'ahu' && (m.name === ahuId || m.id === ahuId));
                    if (ahuMarker) {
                        return {
                            floor: floor,
                            ahuMarker: ahuMarker,
                            vavMarkers: floor.markers.filter(m => m.type === 'vav'),
                            allMarkers: floor.markers
                        };
                    }
                }
                return null;
            };

            // Live floor-plan: set ONE window's open % (0–100) → blind_level 0–1 closed.
            // Match by window id when present, else by index so each bar stays independent.
            // Updates shafts immediately and debounces POST /api/save-config.
            const setFloorWindowOpenPct = useCallback((floorId, windowId, openPct, windowIndex) => {
                const open = Math.max(0, Math.min(100, Number(openPct) || 0)) / 100;
                const blind = 1 - open;
                setMapConfig(prev => {
                    if (!prev || !Array.isArray(prev.floors)) return prev;
                    let changed = false;
                    const floors = prev.floors.map(f => {
                        if (f.id !== floorId && f.name !== floorId && (f.id || f.name) !== floorId) return f;
                        const windows = (f.windows || []).map((w, i) => {
                            let match = false;
                            if (windowId != null && w.id != null) {
                                match = String(w.id) === String(windowId);
                            } else if (windowIndex != null) {
                                match = i === windowIndex;
                            }
                            if (!match) return w;
                            if (Math.abs((w.blind_level || 0) - blind) < 1e-6) return w;
                            changed = true;
                            return Object.assign({}, w, { blind_level: blind });
                        });
                        return changed ? Object.assign({}, f, { windows }) : f;
                    });
                    if (!changed) return prev;
                    const next = Object.assign({}, prev, { floors });
                    try { clearTimeout(window.__red5WinBlindSaveT); } catch (e) {}
                    window.__red5WinBlindSaveT = setTimeout(() => {
                        const API_URL = window.API_BASE_URL || window.location.origin;
                        fetch(`${API_URL}/api/save-config`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({ map_config: next, image_manifest: {} }),
                        }).then(r => r.json()).then(j => {
                            if (j && (j.success || j.ok || j.persisted)) return;
                            if (window.toast) window.toast((j && j.error) || 'Blind save needs sign-in / write access.', 'info');
                        }).catch(() => {});
                    }, 450);
                    return next;
                });
            }, []);

            const ahuMetrics = useMemo(() => {
                if (!selectedAhuId) return { exchange: 0, absorption: 0 };
                const ahu = ahuData.find(a => a.id === selectedAhuId);
                return getEnergyMetrics(ahu);
            }, [selectedAhuId, ahuData]);

            /* Per-AHU sweet-spot bands — one entry per AHU, derived from
               `localStorage.red5_rh_preset_<ahuId>` + VENUE_PRESET_MAP.
               Recomputes whenever ahuData changes OR the sidebar
               dispatches r5-ahu-preset-change (via the version counter).
               renderGivoniOverlay reads this to draw a polygon per
               visible/selected AHU instead of one global polygon. */
            const ahuSweetSpots = useMemo(() => {
                let globalPreset = 'custom';
                try { globalPreset = localStorage.getItem('red5_rh_preset') || 'custom'; } catch (e) {}
                return ahuData.map(ahu => {
                    let id = 'custom';
                    try {
                        id = localStorage.getItem(`red5_rh_preset_${ahu.id}`)
                            || globalPreset
                            || 'custom';
                    } catch (e) {}
                    const band = VENUE_PRESET_MAP[id] || VENUE_PRESET_MAP.custom;
                    return { ahuId: ahu.id, presetId: id, lo: band.lo, hi: band.hi, color: ahu.procColor || '#10b981' };
                });
            }, [ahuData, ahuPresetVersion]);

            /* Per-AHU preset -> 3D-engine RH-band slab.
               The 3D engine (`psy-3d-engine.js`) draws a single RH slab
               from a global `red5_sweet_spot_range` in localStorage +
               listens for the `r5-rh-band-change` event.  Bug reported
               2026-07-01: changing a per-AHU preset in the sidebar
               updated the 2D chart but NOT the 3D slab, because the
               3D engine had no visibility into the per-AHU keys.
               Fix: whenever the SELECTED AHU's effective (lo, hi)
               changes (via a preset dropdown pick OR selection
               changing to a different AHU with a different preset),
               mirror it into `red5_sweet_spot_range` and dispatch
               `r5-rh-band-change` so the 3D engine rebuilds the slab
               in place.  If no AHU is selected we leave the slab
               untouched -- matches the operator's mental model that
               the 3D slab reflects "the AHU I'm currently looking at". */
            const lastBandDispatchRef = useRef('');
            useEffect(() => {
                // Determine which AHU's preset drives the 3D slab.  If
                // the operator has clicked a card, respect that
                // selection; otherwise default to the first AHU so
                // single-AHU deployments (and first-page-load, before
                // any click) still get a correctly-sized slab.
                let driverAhuId = selectedAhuId;
                if (!driverAhuId && ahuSweetSpots.length > 0) {
                    driverAhuId = ahuSweetSpots[0].ahuId;
                }
                if (!driverAhuId) return;
                const spot = ahuSweetSpots.find(s => s.ahuId === driverAhuId);
                if (!spot) return;
                // ahuSweetSpots is a useMemo over ahuData, and ahuData is
                // replaced by every /api/data poll -- so this effect re-runs
                // on a 2s cadence with an identical band.  Firing the event
                // anyway made the 3D engine rebuild its whole weather vis
                // (and blank the SA / Mix-Coil layers for a round trip)
                // twice a minute per minute: the layers visibly pulsed.
                // Only speak when the band actually moved.
                const bandKey = `${driverAhuId}|${spot.lo}|${spot.hi}`;
                if (lastBandDispatchRef.current === bandKey) return;
                lastBandDispatchRef.current = bandKey;
                try {
                    localStorage.setItem('red5_sweet_spot_range',
                        JSON.stringify({ lo: spot.lo, hi: spot.hi }));
                } catch (e) {}
                window.dispatchEvent(new CustomEvent('r5-rh-band-change',
                    { detail: { lo: spot.lo, hi: spot.hi } }));
            }, [selectedAhuId, ahuSweetSpots]);

            /* Per-AHU 24h rolling averages of exchange / absorption —
               source for the pill trend arrows (Phase L.39).  Fetched
               on mount + refreshed every 5 min from the EWMA the backend
               maintains in `models.state._ROLLING_AVGS`.  Empty {} until
               the first GET resolves, in which case MetricBar receives
               null delta and renders no arrow.  Once data is in,
               sidebar.js computes delta = current − avg per pill. */
            const [ahuRollingAvgs, setAhuRollingAvgs] = useState({});
            useEffect(() => {
                let alive = true;
                const load = () => {
                    fetchJSON('/api/ahu-rolling-avgs')
                        .then(j => { if (alive && j && j.averages) setAhuRollingAvgs(j.averages); })
                        .catch(() => {});
                };
                load();
                const handle = setInterval(load, 5 * 60 * 1000);  // 5 min
                return () => { alive = false; clearInterval(handle); };
            }, []);

            /* Per-AHU SA-drift RMS for the sidebar drift pill (P1 refinement,
               2026-02).  Same cadence as ahuRollingAvgs (5 min) -- drift
               is a slow-moving controller-health metric.  Endpoint:
               /api/ahu-drift-scores -> {scores:{ahu_id:{rms_c,base_rms_c,trend,n_samples}}}. */
            const [ahuDriftScores, setAhuDriftScores] = useState({});
            useEffect(() => {
                let alive = true;
                const load = () => {
                    fetchJSON('/api/ahu-drift-scores?window_min=60')
                        .then(j => { if (alive && j && j.scores) setAhuDriftScores(j.scores); })
                        .catch(() => {});
                };
                load();
                const handle = setInterval(load, 5 * 60 * 1000);
                return () => { alive = false; clearInterval(handle); };
            }, []);

            const renderGivoniOverlay = () => {
                if (!showGivoni) return null;
                const rh80 = []; for(let t=20; t<=25; t+=0.5) rh80.push([t, getW(t, 80)]);
                const rh100 = []; for(let t=20; t<=27; t+=0.5) rh100.push([t, getW(t, 100)]);
                const rh20Line = []; for(let t=32; t>=20; t-=0.5) rh20Line.push([t, getW(t, 20)]);
                const rh20_CZ = []; for(let t=27; t>=20; t-=0.5) rh20_CZ.push([t, getW(t, 20)]);

                const CZ = [...rh80, [27, getW(27, 50)], [27, getW(27, 20)], ...rh20_CZ];
                // Operator-defined "sweet spot" sub-strip — now driven by
                // the PER-AHU venue-preset dropdowns in the sidebar
                // (2026-06-26).  Option B: when an AHU is selected, only
                // its band is drawn; otherwise all distinct bands across
                // AHUs are drawn (deduped by lo/hi).  Geometric
                // intersection with the CZ is enforced via SVG <clipPath>
                // below so any configured band stays visually clipped at
                // the CZ's slanted upper-right boundary.
                const visibleSpots = (() => {
                    if (!ahuSweetSpots || ahuSweetSpots.length === 0) return [];
                    if (selectedAhuId) {
                        return ahuSweetSpots.filter(s => s.ahuId === selectedAhuId);
                    }
                    const seen = new Set();
                    const out = [];
                    for (const s of ahuSweetSpots) {
                        const k = s.lo + '-' + s.hi;
                        if (seen.has(k)) continue;
                        seen.add(k);
                        out.push(s);
                    }
                    return out;
                })();
                const buildSweetPoly = (lo, hi) => {
                    const top = [], bot = [];
                    for (let tt = 20; tt <= 27; tt += 0.5) top.push([tt, getW(tt, hi)]);
                    for (let tt = 27; tt >= 20; tt -= 0.5) bot.push([tt, getW(tt, lo)]);
                    return [...top, ...bot];
                };
                const NV = [...rh100, [32, 15.4/1000], [32, 6.2/1000], ...rh20Line];
                const Mass = [...rh80, [33, 16/1000], [37, getW(37, 30)], [37, 3/1000], [20, getW(20, 20)]];
                const MCV = [...rh80, [40, 16/1000], [44, getW(44, 20)], [44, 3/1000], [20, getW(20, 20)]];
                const EVAP = [...rh80, [25, 16/1000], [36, getW(36, 30)], [39, getW(39, 20)], [41, getW(41, 10)], [41, 0], [27.2, 0], [20, getW(20, 20)]];
                
                const winterRH80 = []; for(let t=18; t<=19.5; t+=0.5) winterRH80.push([t, getW(t, 80)]);
                const winterRH20 = []; for(let t=19.5; t>=18; t-=0.5) winterRH20.push([t, getW(t, 20)]);
                const WINTER = [...winterRH80, ...winterRH20];

                const safePts = (arr) => arr.map(p => `${safe(x(p[0]))},${safe(y(p[1]))}`).join(' ');
                const wSat19 = getW(19, 100);
                const ySat19 = safe(y(wSat19));
                const yLineTop19 = ySat19 - 85; 

                return (
                    <g className="pointer-events-none opacity-80 shadow-black">
                        <line x1={safe(x(40))} y1={safe(y(16/1000))} x2={safe(x(50))} y2={safe(y(16/1000))} stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4,4" />
                        <line x1={safe(x(50))} y1={safe(y(16/1000))} x2={safe(x(50))} y2={safe(y(0))} stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4,4" />
                        <line x1={safe(x(41))} y1={safe(y(0))} x2={safe(x(50))} y2={safe(y(0))} stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4,4" />
                        <polygon points={safePts(MCV)} fill="#ec4899" fillOpacity="0.05" stroke="#ec4899" strokeWidth="1" />
                        <polygon points={safePts(Mass)} fill="#8b5cf6" fillOpacity="0.05" stroke="#8b5cf6" strokeWidth="1" />
                        <polygon points={safePts(EVAP)} fill="#06b6d4" fillOpacity="0.08" stroke="#06b6d4" strokeWidth="1" />
                        <polygon points={safePts(NV)} fill="#f59e0b" fillOpacity="0.05" stroke="#f59e0b" strokeWidth="1" />
                        <polygon points={safePts(CZ)} fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeWidth="1.2" />
                        {/* Per-AHU sweet-spot sub-strips — darker emerald
                            (or AHU process colour) inside the CZ polygon.
                            Geometric clipping via SVG <clipPath>
                            guarantees pixel-perfect intersection with the
                            CZ at the slanted upper-right boundary (where
                            the 60% RH isopleth crosses the 80%→50% CZ
                            ceiling around T~26.3). */}
                        {showSweetSpot && visibleSpots.length > 0 && (
                            <g>
                                <defs>
                                    <clipPath id="cz-clip-path" clipPathUnits="userSpaceOnUse">
                                        <polygon points={safePts(CZ)} />
                                    </clipPath>
                                </defs>
                                {visibleSpots.map((spot, i) => {
                                    const poly = buildSweetPoly(spot.lo, spot.hi);
                                    // Stagger label X across multiple bands so
                                    // 30-60 vs 40-55 labels don't collide when
                                    // no AHU is focused.  Single-band view
                                    // (selected AHU) just centres at 23.5°C.
                                    const labelTemp = selectedAhuId
                                        ? 23.5
                                        : (21.5 + i * 1.8);
                                    const labelClamped = Math.min(26.5, Math.max(20.5, labelTemp));
                                    const ringColor = spot.color || '#10b981';
                                    return (
                                        <g key={`sweet-${spot.ahuId}-${i}`}>
                                            <polygon data-testid={`givoni-sweet-strip-${spot.ahuId}`}
                                                     points={safePts(poly)}
                                                     clipPath="url(#cz-clip-path)"
                                                     fill="#059669"
                                                     fillOpacity={selectedAhuId ? "0.32" : "0.22"}
                                                     stroke={ringColor}
                                                     strokeWidth="0.9"
                                                     strokeDasharray="3,2" />
                                            <text x={safe(x(labelClamped))} y={safe(y(getW(labelClamped, (spot.lo + spot.hi) / 2)))}
                                                  fill="#022c22" fontSize="8" fontWeight="900"
                                                  textAnchor="middle"
                                                  className="uppercase font-black font-mono tracking-widest pointer-events-none"
                                                  style={{paintOrder:'stroke', stroke:'#a7f3d0', strokeWidth:'2.5px', strokeLinejoin:'round'}}>
                                                {selectedAhuId ? `${spot.ahuId} · ${spot.lo}-${spot.hi}% RH` : `${spot.lo}-${spot.hi}% RH`}
                                            </text>
                                        </g>
                                    );
                                })}
                            </g>
                        )}
                        <polygon points={safePts(WINTER)} fill="#3b82f6" fillOpacity="0.15" stroke="none" />
                        <path d={`M ${safePts(winterRH20)} L ${safePts(winterRH80)}`} fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.8" />
                        <line x1={safe(x(19))} y1={yLineTop19} x2={safe(x(19))} y2={pad.top+gridHeight} stroke="#3b82f6" strokeWidth="2" strokeDasharray="6,4" opacity="0.8" />
                        <text x={safe(x(19))-5} y={yLineTop19 + 5} fill="#3b82f6" fontSize="10" fontWeight="900" transform={`rotate(-90, ${safe(x(19))-5}, ${yLineTop19 + 5})`} className="uppercase font-black shadow-black drop-shadow-md" textAnchor="end">19°C Boundary</text>
                        <text x={safe(x(50)-10)} y={safe(y(8/1000))} fill="#6366f1" fontSize="10" textAnchor="middle" transform={`rotate(-90, ${safe(x(50)-10)}, ${safe(y(8/1000))})`} className="uppercase font-black font-mono tracking-widest shadow-black">{window.t ? window.t("mechanical_cooling") : "Mechanical Cooling"}</text>
                        <text x={safe(x(44)-18)} y={safe(y(8/1000))} fill="#ec4899" fontSize="9" textAnchor="middle" transform={`rotate(-90, ${safe(x(44)-18)}, ${safe(y(8/1000))})`} className="uppercase font-black font-mono tracking-tighter shadow-black">{window.t ? window.t("mass_cooling") : "Mass Cooling"}</text>
                        <text x={safe(x(44)-2)} y={safe(y(8/1000))} fill="#ec4899" fontSize="9" textAnchor="middle" transform={`rotate(-90, ${safe(x(44)-2)}, ${safe(y(8/1000))})`} className="uppercase font-black font-mono tracking-tighter shadow-black">& {t('natural_ventilation')}</text>
                        <text x={safe(x(37)-10)} y={safe(y(8/1000))} fill="#8b5cf6" fontSize="9" textAnchor="middle" transform={`rotate(-90, ${safe(x(37)-10)}, ${safe(y(8/1000))})`} className="uppercase font-black font-mono tracking-tighter shadow-black">{window.t ? window.t("mass_cooling") : "Mass Cooling"}</text>
                        <text x={safe(x(34))} y={safe(y(0.5/1000)-8)} fill="#06b6d4" fontSize="9" textAnchor="middle" className="uppercase font-black font-mono tracking-widest shadow-black">{window.t ? window.t("evaporative") : "Evaporative"}</text>
                        <path id="nv-curve-label" d={`M ${safe(x(21))},${safe(y(getW(21,100))+22)} Q ${safe(x(24))},${safe(y(getW(24,100))+22)} ${safe(x(27))},${safe(y(getW(27,100))+22)}`} fill="none" />
                        <text fill="#f59e0b" fontSize="9" fontWeight="900" className="uppercase font-black font-mono tracking-widest shadow-black"><textPath href="#nv-curve-label" startOffset="10%">{t('natural_ventilation')}</textPath></text>
                        <text x={safe(x(23.5))} y={safe(y(getW(23.5, 45)))} fill="#10b981" fontSize="11" fontWeight="900" textAnchor="middle" className="uppercase font-black drop-shadow-md shadow-black">{t('comfort')}</text>
                        <text x={safe(x(18.75))} y={safe(y(getW(18.75, 45)))} fill="#3b82f6" fontSize="11" fontWeight="900" textAnchor="middle" transform={`rotate(-90, ${safe(x(18.75))}, ${safe(y(getW(18.75, 45)))})`} className="uppercase font-black drop-shadow-md shadow-black">{window.t ? window.t("winter") : "Winter"}</text>
                    </g>
                );
            };

            const renderGrid = () => {
                const els = [];
                for(let t_idx = Math.floor(T_MIN); t_idx <= T_MAX; t_idx++){
                    const isMajor = t_idx % 5 === 0;
                    const wSat = getW(t_idx, 100);
                    const ySatLine = Math.max(pad.top, y(wSat)); 
                    els.push(<line key={`v-grid-${t_idx}`} x1={safe(x(t_idx))} y1={safe(ySatLine)} x2={safe(x(t_idx))} y2={pad.top+gridHeight} stroke={ui.gridMajor} strokeWidth={isMajor ? 1.5 : 0.8} opacity={isMajor ? 0.6 : 0.2} />);
                    if (isMajor) els.push(<text key={`tl-${t_idx}`} x={safe(x(t_idx))} y={pad.top+gridHeight+25} textAnchor="middle" fill={ui.svgText} fontSize="12" fontWeight="900" className="font-mono">{t_idx}</text>);
                }
                
                for(let wVal=0; wVal<=W_MAX; wVal+=5) {
                    els.push(<line key={`w-grid-${wVal}`} x1={pad.left} y1={safe(y(wVal/1000))} x2={pad.left + gridWidth} y2={safe(y(wVal/1000))} stroke={ui.gridMajor} strokeWidth="0.8" opacity="0.4"/>);
                    els.push(<text key={`wval-${wVal}`} x={pad.left + gridWidth + 10} y={safe(y(wVal/1000)) + 4} fill={ui.svgText} fontSize="10" fontWeight="900" className="font-mono">{wVal}</text>);
                }
                
                [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].forEach(rh => {
                    const pts = []; 
                    for (let t_pt=T_MIN; t_pt<=T_MAX; t_pt+=0.5) {
                        const w = getW(t_pt, rh);
                        if (w <= W_MAX/1000 + 0.005) {
                            pts.push(`${safe(x(t_pt))},${safe(y(w))}`);
                        }
                    }
                    if (pts.length > 0) {
                        els.push(<path key={`rh-${rh}`} d={`M ${pts.join(' L ')}`} fill="none" stroke={rh===100?"#4f46e5":ui.gridMajor} strokeWidth={rh===100?2:1} opacity="0.4" />);
                        let labelT = T_MAX - 1.5; 
                        while(getW(labelT, rh) > (W_MAX/1000 - 0.001) && labelT > T_MIN) labelT -= 0.5;
                        if (labelT > T_MIN && rh !== 100) {
                            els.push(<text key={`rhl-${rh}`} x={safe(x(labelT))} y={safe(y(getW(labelT, rh))-5)} fill={rh===100 ? "#4f46e5" : ui.svgText} fontSize="9" fontWeight="900" textAnchor="middle" opacity="0.7" className="font-mono">{rh}%</text>);
                        }
                    }
                });
                
                for(let h_val=0; h_val<=120; h_val+=10){
                    const pts = [];
                    for(let temp=T_MIN; temp<=T_MAX; temp+=1){
                        const w=(h_val-1.006*temp)/(2501+1.86*temp);
                        if(w>=0 && w<= (W_MAX/1000 + 0.002)) pts.push(`${safe(x(temp))},${safe(y(w))}`);
                    }
                    if(pts.length>1) {
                        els.push(<path key={`h-${h_val}`} d={`M ${pts.join(' L ')}`} fill="none" stroke="#f472b6" strokeWidth="0.6" strokeDasharray="6,4" opacity="0.4"/>);
                        /* Label placement: enthalpy lines enter the chart from
                         * either the LEFT edge (T = T_MIN, W small) when h is
                         * low, or the TOP edge (W = W_MAX, T low) when h is
                         * high.  Putting every label at pts[0] crams the low-h
                         * labels into the Y-axis tick zone where they overlap
                         * the humidity-ratio numerals (bug visible 2026-06-26).
                         * Detect the entry edge and label at the appropriate
                         * end so labels cascade along the top OR the bottom
                         * edge -- never on top of Y-axis ticks. */
                        const wAtTmin = (h_val - 1.006 * T_MIN) / (2501 + 1.86 * T_MIN);
                        const entersFromTop = wAtTmin > (W_MAX / 1000 + 0.002);
                        const labelPt = entersFromTop ? pts[0].split(',')
                                                      : pts[pts.length - 1].split(',');
                        const labelDX = entersFromTop ? -8 : 6;
                        const labelDY = entersFromTop ? -8 : -4;
                        const labelAnchor = entersFromTop ? 'end' : 'start';
                        els.push(<text key={`hl-${h_val}`}
                                       x={safe(parseFloat(labelPt[0]) + labelDX)}
                                       y={safe(parseFloat(labelPt[1]) + labelDY)}
                                       fill="#f472b6" fontSize="9" fontWeight="900"
                                       textAnchor={labelAnchor} opacity="0.8">{h_val}</text>);
                    }
                }
                
                const tAtH85 = (85 - 2501 * 0.031) / (1.006 + 1.86 * 0.031);
                els.push(<text key="h-title" x={safe(x(tAtH85))} y={pad.top - 8} fill="#f472b6" fontSize="10" fontWeight="900" opacity="0.8" className="font-mono uppercase tracking-widest shadow-black" textAnchor="middle">Enthalpy (kJ/kg)</text>);

                const satW25 = getW(25, 100);
                const xSatPos = x(25);
                const ySatPos = y(satW25);
                const xNext = x(25.5);
                const yNext = y(getW(25.5, 100));
                const angle = safe(Math.atan2(yNext - ySatPos, xNext - xSatPos) * (180 / Math.PI));
                els.push(
                    <text 
                        key="satLabel" 
                        x={xSatPos} 
                        y={ySatPos - 12} 
                        fill="#cc00ff" 
                        fontSize="10" 
                        fontWeight="900" 
                        textAnchor="middle" 
                        transform={`rotate(${angle}, ${xSatPos}, ${ySatPos - 12})`} 
                        className="tracking-widest uppercase shadow-black font-black font-mono"
                    >
                        {t('saturation_line')}
                    </text>
                );

                return els;
            };

            const renderVectors = () => {
                const pos = indicatorPos; 
                if (!pos || !Number.isFinite(pos.t) || !Number.isFinite(pos.w)) return null;
                
                const hI = getH(pos.t, pos.w);
                const xI = safe(x(pos.t));
                const yI = safe(y(pos.w));
                const ySat = safe(y(getW(pos.t, 100)));
                const dLen = 12; 
                const yAxis = safe(y(0));

                let low = -50, high = pos.t; 
                for(let k=0; k<15; k++) { 
                    let mid = (low+high)/2; 
                    if(((hI - 1.006 * mid) / (2501 + 1.86 * mid)) > getW(mid, 100)) low = mid; else high = mid; 
                }
                const xNW = safe(x(high)), yNW = safe(y(getW(high, 100)));
                
                let lD = -50, hD = pos.t; 
                for(let k=0; k<20; k++){ 
                    let mid = (lD+hD)/2; 
                    if(getW(mid, 100) < pos.w) lD = mid; else hD = mid; 
                }
                const tDpCalculated = hD;
                const xDp = safe(x(Math.max(T_MIN, tDpCalculated)));
                
                let tSE = Math.min(pos.t + dLen, T_MAX); 
                let wSE = (hI - 1.006 * tSE) / (2501 + 1.86 * tSE); 
                if (wSE < 0) { wSE = 0; tSE = hI / 1.006; }
                const xSE = safe(x(tSE)), ySE = safe(y(wSE));
                
                let dx = xSE - xI;
                let diagSlope = (Math.abs(dx) < 0.5) ? 0 : (ySE - yI) / dx * -1.5;
                let tNE = Math.min(pos.t + dLen, T_MAX), xNE = safe(x(tNE)), yNE = safe(yI + diagSlope * (xNE - xI));
                
                let tSW = Math.max(pos.t - dLen, T_MIN); 
                let xSW = safe(x(tSW)); 
                let ySW = yI + diagSlope * (xSW - xI); 
                if (ySW > yAxis) { ySW = yAxis; if (diagSlope !== 0) xSW = xI + (yAxis - yI) / diagSlope; }

                // === Saturation clipping for the Diagnostic line ===
                // The diagnostic line is a straight line in (t,w) space with slope chosen
                // for visual emphasis, NOT one of the physically-bounded canonical lines.
                // Below ~10°C the saturation curve dw_sat/dt is GENTLER than this line's
                // slope, so a SW path that starts safely below saturation can curve into
                // (and cross) the saturation boundary at lower temperatures — a physical
                // impossibility (the air would just condense). Clip both ends at the
                // first sat-curve crossing so the arrow tip terminates exactly on the
                // saturation curve, never past it.
                const clipLineToSat = (t0, w0, t1, w1) => {
                    if (!Number.isFinite(t0) || !Number.isFinite(w0) || !Number.isFinite(t1) || !Number.isFinite(w1)) {
                        return { t: t1, w: w1 };
                    }
                    if (w0 >= getW(t0, 100)) return { t: t0, w: w0 };
                    const steps = 80;
                    let pT = t0, pW = w0;
                    for (let i = 1; i <= steps; i++) {
                        const f = i / steps;
                        const t = t0 + f * (t1 - t0);
                        const w = w0 + f * (w1 - w0);
                        if (w >= getW(t, 100)) {
                            let lo = 0, hi = 1;
                            for (let k = 0; k < 24; k++) {
                                const m = (lo + hi) / 2;
                                const tm = pT + m * (t - pT);
                                const wm = pW + m * (w - pW);
                                if (wm >= getW(tm, 100)) hi = m;
                                else lo = m;
                            }
                            const f2 = (lo + hi) / 2;
                            return { t: pT + f2 * (t - pT), w: pW + f2 * (w - pW) };
                        }
                        pT = t; pW = w;
                    }
                    return { t: t1, w: w1 };
                };
                const wNEchart = invY(yNE);
                const neClip = clipLineToSat(pos.t, pos.w, tNE, wNEchart);
                const xNEc = safe(x(neClip.t)), yNEc = safe(y(neClip.w));
                const wSWchart = invY(ySW);
                const swClip = clipLineToSat(pos.t, pos.w, tSW, wSWchart);
                const xSWc = safe(x(swClip.t)), ySWc = safe(y(swClip.w));

                const satPointer = `M ${xI - 75},${ySat - 25} L ${xI - 15},${ySat - 25} L ${xI},${ySat}`;
                const dpPointer = `M ${xDp - 75},${yI - 25} L ${xDp - 15},${yI - 25} L ${xDp},${yI}`;

                const tBendEnd = Math.min(T_MAX, pos.t + 4);
                const latentPath = [`${xI},${yI}`, `${xI},${ySat}`];
                for(let i = pos.t + 0.1; i <= tBendEnd; i += 0.1) { 
                    latentPath.push(`${safe(x(i))},${safe(y(getW(i, 100)))}`); 
                }

                const sensPath = [`${xI},${yI}`, `${xDp},${yI}`];
                if (tDpCalculated >= T_MIN) {
                    for(let i = tDpCalculated - 0.1; i >= Math.max(T_MIN, tDpCalculated - 5); i -= 0.1) {
                        sensPath.push(`${safe(x(i))},${safe(y(getW(i, 100)))}`);
                    }
                }

                return (
                    <g className="pointer-events-none drop-shadow-md">
                        {vecVis.enthalpy && pos.w > 0.0001 && (
                            <g>
                                <line x1={xI} y1={yI} x2={xNW} y2={yNW} stroke="#f472b6" strokeWidth="1.5" strokeDasharray="8,4" markerEnd="url(#arrow-pink)" />
                                <line x1={xI} y1={yI} x2={xSE} y2={ySE} stroke="#f472b6" strokeWidth="1.5" strokeDasharray="8,4" markerEnd="url(#arrow-pink)" />
                            </g>
                        )}
                        {vecVis.latent && (
                            <g>
                                <path d={`M ${latentPath.join(' L ')}`} fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="8,4" markerEnd="url(#arrow-yellow)" />
                                <line x1={xI} y1={yI} x2={xI} y2={yAxis} stroke="#fbbf24" strokeWidth="2" strokeDasharray="8,4" markerEnd="url(#arrow-yellow)" />
                                <g>
                                    <path d={satPointer} fill="none" stroke="#fbbf24" strokeWidth="1.2" markerEnd="url(#arrow-yellow)" />
                                    <text x={xI - 80} y={ySat - 25} textAnchor="end" fill="#fbbf24" fontSize="9" fontWeight="900" className="italic font-mono shadow-black">{t('saturation_point')}</text>
                                </g>
                            </g>
                        )}
                        {vecVis.sensible && (
                            <g>
                                <path d={`M ${sensPath.join(' L ')}`} fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="8,4" markerEnd="url(#arrow-blue)" />
                                <line x1={xI} y1={yI} x2={safe(x(Math.min(pos.t + 10, T_MAX)))} y2={yI} stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="8,4" markerEnd="url(#arrow-blue)" />
                                <g>
                                    <path d={dpPointer} fill="none" stroke="#60a5fa" strokeWidth="1.2" markerEnd="url(#arrow-blue)" />
                                    <text x={xDp - 80} y={yI - 25} textAnchor="end" fill="#60a5fa" fontSize="9" fontWeight="900" className="italic font-mono shadow-black">Dew Point ({tDpCalculated.toFixed(1)}°)</text>
                                </g>
                            </g>
                        )}
                        {vecVis.diagnostic && (
                            <g>
                                <line x1={xI} y1={yI} x2={xNEc} y2={yNEc} stroke="#10b981" strokeWidth="2" strokeDasharray="6,3" markerEnd="url(#arrow-emerald)" />
                                <line x1={xI} y1={yI} x2={xSWc} y2={ySWc} stroke="#10b981" strokeWidth="2" strokeDasharray="6,3" markerEnd="url(#arrow-emerald)" />
                            </g>
                        )}
                    </g>
                );
            };

            const renderIndicatorTooltip = () => {
                const currentAhu = ahuData.find(a => a.id === selectedAhuId);
                if (!currentAhu && !indicatorPos) return null;
                
                let tVal, rhVal, hVal, wVal, title;
                if (lockedVavId && currentAhu) {
                    const lockedVav = currentAhu.vavs?.find(v => v.id === lockedVavId);
                    if (!lockedVav) return null;
                    tVal = lockedVav.t; rhVal = lockedVav.rh; hVal = lockedVav.h;
                    wVal = lockedVav.w != null ? lockedVav.w : getW(lockedVav.t, lockedVav.rh);
                    title = lockedVav.id;
                } else {
                    if (!indicatorPos) return null;
                    tVal = indicatorPos.t;
                    const pw = (indicatorPos.w * P_ATM) / (0.621945 + indicatorPos.w);
                    rhVal = Math.min(100, Math.max(0, (pw / getPsat(tVal)) * 100));
                    hVal = getH(indicatorPos.t, indicatorPos.w);
                    wVal = indicatorPos.w;
                    title = null;
                }
                
                const saP = currentAhu?.points?.find(p => p.label === 'SA');
                const saH = saP ? getH(saP.t, saP.w) : 0; 
                const diffH = hVal - saH;
                
                // Givoni-tier strategy hint -- mirrors the VAV-table dot
                // logic so the operator sees the same recommendation in
                // both places (the row tooltip AND this on-chart callout).
                const _gvSweet = (showGivoni && showSweetSpot) ? sweetSpotRange : null;
                const gv = getGivoniTier(tVal, wVal, rhVal, comfortZonePoly, _gvSweet, showGivoni);
                const showTier = showGivoni;
                const tooltipH = (title ? 42 : 32) + (showTier ? 14 : 0);
                const tooltipW = 96;

                return (
                    <g transform={`translate(8, ${title ? -45 : -35})`} className="pointer-events-none drop-shadow-lg shadow-black">
                        <rect x="0" y="0" width={tooltipW} height={tooltipH} 
                              fill={theme==='dark' ? "rgba(15, 23, 42, 0.6)" : "rgba(255, 255, 255, 0.6)"} 
                              stroke={theme==='dark' ? "#6366f1" : "#818cf8"} strokeWidth="1.5" rx="6" />
                        {title && <text x={tooltipW/2} y="12" textAnchor="middle" fill="#818cf8" fontSize="8" fontWeight="900" className="uppercase tracking-widest">{title}</text>}
                        <text x={tooltipW/2} y={title ? "24" : "14"} textAnchor="middle" fill={theme==='dark' ? "#f8fafc" : "#0f172a"} fontSize="9" fontWeight="900" className="font-mono">{tVal.toFixed(1)}° / {rhVal.toFixed(0)}%</text>
                        <text x={tooltipW/2} y={title ? "36" : "26"} textAnchor="middle" fill={theme==='dark' ? "#f472b6" : "#db2777"} fontSize="9" fontWeight="900" className="font-mono">ΔH: {diffH > 0 ? '+' : ''}{diffH.toFixed(1)}</text>
                        {showTier && (
                            <g data-testid="givoni-tier-hint">
                                <circle cx="7" cy={title ? 50 : 40} r="3" fill={gv.dotFill} stroke={gv.ringStroke} strokeWidth="0.8" />
                                <text x="13" y={title ? 53 : 43} textAnchor="start"
                                      fill={gv.dotFill}
                                      fontSize="8" fontWeight="900" className="font-mono uppercase tracking-wider">
                                    {gv.tier} · {gv.label}
                                </text>
                                <text x="13" y={title ? 61 : 51} textAnchor="start"
                                      fill={theme==='dark' ? "#94a3b8" : "#475569"}
                                      fontSize="7" fontWeight="700" className="font-mono lowercase">
                                    {gv.subLabel}
                                </text>
                            </g>
                        )}
                    </g>
                );
            };

            // ===== SPARKLINE COMPONENT =====
            // Lifted to js/dashboard/dashboard-helpers.js (top-level, props-only).
            // Kept here as a comment marker so future readers grep -n Sparkline
            // and find it where they expect it.

            // ===== DIAGNOSTICS CONSOLE =====
            const DiagnosticsConsole = () => {
                const s = telemetryStatus || {};
                const isLive = s.live && !s.mock_mode && !s.stale;
                const isMock = s.mock_mode && s.live;
                const statusLabel = isLive ? 'LIVE BACNET' : isMock ? 'SIMULATOR' : s.stale ? 'STALE' : 'OFFLINE';
                const statusColor = isLive ? '#22c55e' : isMock ? '#f59e0b' : s.stale ? '#ef4444' : '#64748b';

                // Get trend keys for selected AHU
                const selectedAhu = ahuData.find(a => a.id === selectedAhuId);
                const trendKeys = selectedAhuId ? Object.keys(trendHistory).filter(k => k.startsWith(selectedAhuId + '.') || (selectedAhu && selectedAhu.vavs && selectedAhu.vavs.some(v => k.startsWith(v.id + '.')))) : Object.keys(trendHistory).slice(0, 20);

                return React.createElement('div', { className: `flex-1 overflow-hidden flex flex-col ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`, 'data-testid': 'diagnostics-console' },
                    // Header bar
                    React.createElement('div', { className: `flex items-center justify-between px-6 py-3 border-b ${theme === 'dark' ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'}` },
                        React.createElement('h2', { className: 'text-sm font-black uppercase tracking-widest text-indigo-400' }, t('diagnostics_console')),
                        React.createElement('div', { className: 'flex items-center gap-3' },
                            React.createElement('span', { className: 'inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-black uppercase border', style: { color: statusColor, borderColor: statusColor, backgroundColor: statusColor + '15' } },
                                React.createElement('span', { style: { width: 6, height: 6, borderRadius: '50%', backgroundColor: statusColor, display: 'inline-block', animation: (isLive || isMock) ? 'pulse 2s infinite' : 'none' } }),
                                statusLabel
                            ),
                            s.live && React.createElement('span', { className: `text-[10px] font-mono ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}` }, `v${s.collector_version || '?'} | ${s.equipment_count || 0} equip | ${Math.round(s.age_seconds || 0)}s ago`)
                        )
                    ),
                    // 2x2 Grid
                    React.createElement('div', { className: 'flex-1 grid grid-cols-2 grid-rows-2 gap-px overflow-hidden', style: { backgroundColor: theme === 'dark' ? '#1e293b' : '#e2e8f0' } },
                        // Panel 1: Collector Status
                        React.createElement('div', { className: `overflow-auto p-4 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`, 'data-testid': 'diag-status' },
                            React.createElement('h3', { className: 'text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-3' }, 'Collector Status'),
                            React.createElement('div', { className: 'space-y-2' },
                                [
                                    ['Mode', statusLabel],
                                    ['Equipment', `${s.equipment_count || 0} AHU groups`],
                                    ['Read OK', s.read_ok || 0],
                                    ['Read Errors', s.read_errors || 0],
                                    ['Last Update', s.timestamp_iso || 'N/A'],
                                    ['Data Age', `${Math.round(s.age_seconds || 0)}s`],
                                    ['Version', s.collector_version || 'N/A'],
                                    ['dibt', s.mock_mode ? 'Not available (mock)' : 'Available']
                                ].map(([k, v], i) => React.createElement('div', { key: i, className: `flex justify-between text-[11px] py-1 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}` },
                                    React.createElement('span', { className: `font-bold uppercase tracking-wide ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}` }, k),
                                    React.createElement('span', { className: `font-mono font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}` }, String(v))
                                ))
                            )
                        ),
                        // Panel 2: Trend Sparklines
                        React.createElement('div', { className: `overflow-auto p-4 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`, 'data-testid': 'diag-trends' },
                            React.createElement('h3', { className: 'text-[10px] font-black uppercase tracking-[0.2em] text-violet-500 mb-3' }, selectedAhuId ? `${t('trends')}: ${selectedAhuId}` : t('trends_select_ahu')),
                            React.createElement('div', { className: 'space-y-1.5' },
                                trendKeys.length === 0
                                    ? React.createElement('p', { className: 'text-[10px] text-slate-500 italic' }, 'No trend data yet. Collector builds history over time.')
                                    : trendKeys.slice(0, 24).map(key => {
                                        const vals = trendHistory[key] || [];
                                        const current = vals.length > 0 ? vals[vals.length - 1] : null;
                                        const parts = key.split('.');
                                        const ptLabel = parts[parts.length - 1];
                                        const equipId = parts.slice(0, -1).join('.');
                                        const isVav = equipId.toUpperCase().includes('VAV');
                                        return React.createElement('div', { key, className: `flex items-center gap-2 py-0.5 border-b ${theme === 'dark' ? 'border-slate-800/50' : 'border-slate-100'}` },
                                            React.createElement('span', { className: `w-20 text-[9px] font-black uppercase tracking-tight truncate ${isVav ? 'text-amber-500' : 'text-cyan-500'}`, title: key }, isVav ? `${equipId.split('-').pop()}.${ptLabel}` : ptLabel),
                                            React.createElement(Sparkline, { data: vals, width: 80, height: 20, color: isVav ? '#f59e0b' : '#6366f1' }),
                                            React.createElement('span', { className: `text-[10px] font-mono font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`, style: { minWidth: 40, textAlign: 'right' } }, current !== null ? (typeof current === 'number' ? current.toFixed(1) : current) : '-')
                                        );
                                    })
                            )
                        ),
                        // Panel 3: Live Log Feed
                        React.createElement('div', { className: `overflow-auto p-4 flex flex-col ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`, 'data-testid': 'diag-log' },
                            React.createElement('h3', { className: 'text-[10px] font-black uppercase tracking-[0.2em] text-sky-500 mb-3' }, 'Collector Log'),
                            React.createElement('div', { className: 'flex-1 overflow-auto custom-scrollbar', style: { maxHeight: 'calc(100% - 24px)' } },
                                collectorLog.length === 0
                                    ? React.createElement('p', { className: 'text-[10px] text-slate-500 italic' }, 'No log entries. Start collector to see logs.')
                                    : [...collectorLog].reverse().map((entry, i) => React.createElement('div', { key: i, className: `text-[10px] font-mono py-0.5 border-b ${theme === 'dark' ? 'border-slate-800/30 text-slate-400' : 'border-slate-100 text-slate-500'}` },
                                        React.createElement('span', { className: 'text-slate-600 mr-2' }, entry.time ? entry.time.split(' ')[1] : ''),
                                        entry.msg
                                    ))
                            )
                        ),
                        // Panel 4: Write Command History
                        React.createElement('div', { className: `overflow-auto p-4 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`, 'data-testid': 'diag-writes' },
                            React.createElement('h3', { className: 'text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-3' }, 'Write History'),
                            writeHistory.length === 0
                                ? React.createElement('p', { className: 'text-[10px] text-slate-500 italic' }, 'No write commands sent yet.')
                                : React.createElement('div', { className: 'space-y-1.5' },
                                    writeHistory.slice(0, 30).map((w, i) => React.createElement('div', { key: i, className: `p-2 rounded border text-[10px] ${w.success ? (theme === 'dark' ? 'border-emerald-900/50 bg-emerald-950/30' : 'border-emerald-200 bg-emerald-50') : (theme === 'dark' ? 'border-red-900/50 bg-red-950/30' : 'border-red-200 bg-red-50')}` },
                                        React.createElement('div', { className: 'flex justify-between items-center' },
                                            React.createElement('span', { className: `font-black uppercase ${w.success ? 'text-emerald-400' : 'text-red-400'}` }, w.equipment),
                                            React.createElement('span', { className: 'text-slate-500 font-mono' }, w.timestamp_iso ? w.timestamp_iso.split('T')[1] : '')
                                        ),
                                        React.createElement('div', { className: `mt-0.5 font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}` },
                                            Object.entries(w.writes || {}).map(([k, v]) => `${k}=${v}`).join(', '),
                                            w.mock && React.createElement('span', { className: 'ml-2 text-amber-500' }, '[MOCK]')
                                        )
                                    ))
                                )
                        )
                    )
                );
            };

            return (
                <React.Fragment>
                {staleCache && (
                    <div data-testid="stale-cache-banner" style={{position:'fixed', top:0, left:0, right:0, zIndex:99999, background:'#dc2626', color:'#fff', padding:'10px 16px', display:'flex', alignItems:'center', justifyContent:'center', gap:'12px', fontSize:'12px', fontWeight:900, letterSpacing:'0.05em', boxShadow:'0 4px 12px rgba(0,0,0,0.4)', fontFamily:'SF Mono,Fira Code,monospace'}}>
                        <span style={{textTransform:'uppercase'}}>⚠ Stale Cache Detected</span>
                        <span style={{fontWeight:600, opacity:0.9, textTransform:'none'}}>
                            This browser is running build {staleCache.mine} but controller has {staleCache.latest}. Press <kbd style={{padding:'2px 6px', background:'#fff', color:'#dc2626', borderRadius:'4px', fontFamily:'monospace', fontWeight:900}}>Ctrl + Shift + R</kbd> to load the new build.
                        </span>
                        <button onClick={() => { try { if (caches && caches.keys) caches.keys().then(ks => ks.forEach(k => caches.delete(k))); } catch (e) {} location.reload(); }} style={{padding:'4px 10px', background:'#fff', color:'#dc2626', border:'none', borderRadius:'4px', fontWeight:900, cursor:'pointer', fontFamily:'inherit', fontSize:'10px', textTransform:'uppercase'}}>{window.t ? window.t('reload_now') : 'Reload Now'}</button>
                    </div>
                )}
                <div className={`flex h-screen overflow-hidden ${ui.text} ${ui.bg} transition-colors duration-500`} style={{
                    ...(staleCache ? {paddingTop:'42px'} : {}),
                    // Dark-mode brightness dimmer.  See useState block where
                    // `darkLevel` is declared.  Only applied when dark mode is
                    // active and the operator has moved the slider off 1.0,
                    // so the light-mode path stays pixel-identical and we
                    // don't pay for a wasted GPU filter when nothing's
                    // changed.  `transition` so the dimmer animates smoothly
                    // when the slider is dragged.
                    ...(theme === 'dark' && Math.abs(darkLevel - 1) > 0.001 ? {
                        filter: `brightness(${darkLevel})`,
                        // Expose the same value as a CSS custom property so
                        // child <img> elements can apply an inverse-brightness
                        // filter and stay at their natural luminance.  See
                        // the `img { filter: ... }` rule in the head <style>.
                        '--red5-dim': String(darkLevel),
                        transition: 'filter 120ms linear',
                    } : {}),
                }} onMouseMove={(e) => {
                    if (isCardDragging) setCardOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
                    else if (isVavDragging) setVavTableOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
                    else if (isVavModalDragging) setVavModalOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
                    else if (isAhuModalDragging) setAhuModalOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
                    else if (isFloorPlanDragging) setFloorPlanOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
                    else if (isDraggingIndicator && svgRef.current) {
                        const rect = svgRef.current.getBoundingClientRect();
                        const mx = (e.clientX - rect.left) * (width / rect.width); 
                        const my = (e.clientY - rect.top) * (height / rect.height);
                        let tCand = Math.max(T_MIN, Math.min(T_MAX, invX(mx))); 
                        let wLimit = getW(tCand, 95); 
                        let wCand = Math.max(0, Math.min(wLimit, invY(my)));
                        setIndicatorPos({ t: tCand, w: wCand });
                    }
                }} onMouseUp={() => {setIsDraggingIndicator(false); setIsCardDragging(false); setIsVavDragging(false); setIsVavModalDragging(false); setIsAhuModalDragging(false); setIsFloorPlanDragging(false);}}>
                    
                    {/* LEFT SIDEBAR — three render modes:
                          docked      : original in-flow column.
                          floating    : in-page draggable+resizable shell
                                        (same document, mouse events stable).
                          cross-window: portaled into a separate OS-level
                                        browser window for extended displays
                                        (mirrors AHU/VAV modal pattern). */}
                    {/* LEFT SIDEBAR -- extracted to sidebar.js (L.27) */}
                    {renderSidebar({ sidebarWidth, setSidebarWidth, sidebarFloating, setSidebarFloating, sidebarFloatPos, sidebarFloatSize, sidebarPopoutWin, sidebarPopoutHost, popOutSidebarToWindow, onSidebarResizeMouseDown, onSidebarTitleMouseDown, activeView, setActiveView, theme, ui, darkLevel, setDarkLevel, i18nReady, searchTerm, setSearchTerm, filteredAhuData, selectedAhuId, setSelectedAhuId, setShowFloorPlanForAhu, setShowAhuModalFor, isLockedToSA, setIsLockedToSA, setLockedVavId, showPath, setShowPath, pointVisibility, setPointVisibility, showGivoni, setShowGivoni, showSweetSpot, setShowSweetSpot, sweetSpotRange, setSweetSpotRange, tClipRange, setTClipRange, tempRange, setTempRange, bandClampApplied, setBandClampApplied, bandClampBusy, setBandClampBusy, setBandClampModal, clampSpark, telemetryStatus, pluginHealth, ervSnap, red5DocsIndex, getEnergyMetrics, getH, setAhuModalSize, setVavModalSize, setFloorPlanModalSize, setShowConfigAuth, setConfigPwInput, setConfigPwError, openCollectorCfg, fetchJSON, toast, ahuSweetSpots, appliedAhuBands, applyAhuBands, applyBusy, showApplyModal, setShowApplyModal, ahuPresetVersion, ahuRollingAvgs, ahuDriftScores, t })}

                    {activeView === 'diagnostics' && React.createElement(DiagnosticsConsole)}
                    {activeView === 'dynamics' && (
                        <div ref={dynRef} className="flex-1 relative" style={{width:'100%',height:'100%'}} data-testid="dynamics-view" />
                    )}
                    {/* weather3d (Monthly × Sites): keep the container PERSISTENTLY mounted
                        and toggle visibility instead of unmounting.  Unmounting kills the
                        WebGL canvas without running dispose(), so window.__psy3dActive stays
                        stuck true and the next initPsy3D() aborts -> blank screen on return.
                        See psy-3d-engine.js lines 38-43 for the page-wide one-context guard. */}
                    <div ref={psy3dRef}
                         className="flex-1 relative"
                         style={{width:'100%', height:'100%', display: activeView === 'weather3d' ? 'block' : 'none'}}
                         data-testid="weather3d-view" />
                    <div className="flex flex-col flex-1 overflow-hidden" style={activeView !== 'chart' ? {display:'none'} : {}}>
                    {/* Psychrometric Chart -- extracted to psy-chart-svg.js (L.28) */}
                    {renderPsyChartSvg({ width, height, gridWidth, gridHeight, pad, svgRef, T_MIN, T_MAX, invX, getW, x, y, safe, getH, selectedAhuId, setSelectedAhuId, lockedVavId, setLockedVavId, isLockedToSA, setIsLockedToSA, showPath, setShowPath, pointVisibility, setPointVisibility, cardOffset, setIsCardDragging, setDragStart, setIsVavDragging, vavTableOffset, vavCfm, setVavCfm, setSelectedVavForModal, indicatorPos, isProcessVisible, setIsProcessVisible, setIsDraggingIndicator, vecVis, setVecVis, ahuData, ahuMetrics, comfortZonePoly, sweetSpotRange, showGivoni, showSweetSpot, setShowFloorPlanForAhu, setShowAhuModalFor, weatherFetchStatus, weatherLocation, weatherSaveError, setWeatherSaveError, showWeatherStrip, setShowWeatherStrip, setShowWeatherSettings, forecast, renderGrid, renderGivoniOverlay, renderVectors, renderIndicatorTooltip, getAhuDiagnostic, getVavDiagnostic, getGivoniTier, MetricBar, LockIcon, theme, ui, t })}

                    
                    {/* YEARLY WEATHER STRIP */}
                    {/* Weather strip panel — extracted to weather-strip-panel.js (L.26) */}
                    {renderWeatherStripPanel({
                        showWeatherStrip,
                        weatherLocation, setShowWeatherSettings,
                        weatherLoading, weatherAllDaily, weatherError,
                        weatherViewMode, setWeatherViewMode,
                        weatherNavDate, setWeatherNavDate,
                        weatherZoom, setWeatherZoom,
                        weatherDragStart, setWeatherDragStart,
                        weatherDragCurrent, setWeatherDragCurrent,
                        weatherHoverIdx, setWeatherHoverIdx,
                        weatherNav, getWeatherView,
                        theme, t,
                    })}

                    </div>
                    
                    {/* Band SA-RH Clamp Confirm Modal — extracted to band-clamp-modal.js (L.26) */}
                    {renderBandClampModal({
                        bandClampModal, setBandClampModal,
                        bandClampBusy,  setBandClampBusy,
                        setBandClampApplied,
                        theme, fetchJSON, toast,
                    })}

                    {/* Weather Location Settings Modal */}
                    {/* Weather Location Settings Modal — extracted to weather-settings-modal.js (L.26) */}
                    {renderWeatherSettingsModal({
                        showWeatherSettings, setShowWeatherSettings,
                        weatherLocation, setWeatherLocation,
                        savedWeatherLocations, setSavedWeatherLocations,
                        defaultLocation, pinLocation,
                        weatherSaveError, persistWeatherState, setWeatherZoom,
                        theme, toast, t,
                    })}

                    {/* VAV Graphic Overlay Modal — RH band from selected
                        AHU's venue preset (ahuSweetSpots), not only the
                        global sweetSpotRange slider state. */}
                    {selectedVavForModal && renderVavEquipmentModal({
                        API_URL, _setForceApTick, ahuData, setAhuData, selectedAhuId,
                        ccEquipTypes, mapConfig, popOutVavModal, floatPipVavModal,
                        selectedVavForModal, setSelectedVavForModal, setDragStart,
                        setIsVavModalDragging, setVavImgDims, vavImgDims, sunState, theme,
                        vavCfm, vavImage, vavImgRef, vavTypeImages,
                        vavModalOffset, vavModalPopupHost, vavModalPopupWin, vavModalSize,
                        vavOuterRef,
                        sweetSpotRange: (() => {
                            const spot = (ahuSweetSpots || []).find(s => s.ahuId === selectedAhuId);
                            return spot ? { lo: spot.lo, hi: spot.hi } : sweetSpotRange;
                        })(),
                        showSweetSpot,
                        comfortZonePoly, showGivoni, getGivoniTier,
                    })}

                    {/* Floor Plan Mapper Modal */}
                    {/* Floor Plan Mapper Modal — extracted to floor-plan-modal.js (L.26) */}
                    {renderFloorPlanModal({
                        showFloorPlanForAhu, setShowFloorPlanForAhu,
                        floorPlanPopupWin, floorPlanPopupHost,
                        floorPlanOffset, floorPlanModalSize,
                        setIsFloorPlanDragging, setDragStart,
                        floorOuterRef,
                        selectedAhuId, setSelectedAhuId,
                        lockedVavId, setLockedVavId,
                        setShowAhuModalFor,
                        setSelectedVavForModal, setVavCfm, setIsLockedToSA,
                        ahuData, mapConfig, setMapConfig, floorImage,
                        buildingLatLon, sunState, setSunState,
                        buildingFacingOffset,
                        floorWindowsPanelOpen, setFloorWindowsPanelOpen,
                        selectedFloorWindowId, setSelectedFloorWindowId,
                        setFloorWindowOpenPct,
                        comfortZonePoly,
                        showGivoni, showSweetSpot, sweetSpotRange,
                        theme, safe, getFloorForAhu, getVavDiagnostic, popOutFloorPlanModal, floatPipFloorPlanModal,
                    })}


                    {/* AHU SCADA Overlay Modal */}
                    {showAhuModalFor && renderAhuEquipmentModal({
                        API_URL, _setForceApTick,
                        ahuBodyRef, ahuData, ahuImage, ahuImgDims, ahuImgRef,
                        ahuModalOffset, ahuModalPopupHost, ahuModalPopupWin, ahuModalSize,
                        ahuOuterRef, ahuTypeImages, ccEquipTypes, mapConfig, popOutAhuModal, floatPipAhuModal,
                        setAhuData, setAhuImgDims, setDragStart, setIsAhuModalDragging,
                        setShowAhuModalFor, showAhuModalFor, theme,
                    })}


                {/* === Collector Config Modal === */}
                {/* Collector Config Modal -- extracted to collector-config-modal.js (L.26) */}
                {renderCollectorConfigModal({
                    showCollectorCfg, setShowCollectorCfg,
                    ccTab, setCcTab,
                    ccConfig, setCcConfig,
                    ccEquipTypes,
                    ccSaving, ccMsg, setCcMsg,
                    ccEditGroup, setCcEditGroup,
                    ccNewGroupName, setCcNewGroupName,
                    ccNewGroupCsv, setCcNewGroupCsv,
                    ccNewVav, setCcNewVav,
                    saveCollectorCfg,
                    dataMode, setDataMode,
                    pluginHealth,
                    API_URL, theme,
                })}



                {/* Config Auth Modal -- extracted to config-auth-modal.js (L.26) */}
                {renderConfigAuthModal({
                    showConfigAuth, setShowConfigAuth,
                    configPwInput, setConfigPwInput,
                    configPwError, setConfigPwError,
                })}

                </div>
                </React.Fragment>
            );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<ErrorBoundary><App /></ErrorBoundary>);
        // Prove the compiled JS (not just dashboard.html) actually mounted.
        try {
            window.__RED5_BUNDLE_ID = 'SP30';
            window.__red5DashboardMounted = true;
            var _stamp = document.getElementById('red5-html-build');
            if (_stamp) {
                var _t = String(_stamp.textContent || '');
                if (_t.indexOf('·JS') < 0) _stamp.textContent = _t + '·JS';
            }
            if (typeof window.__red5BootOk === 'function') window.__red5BootOk();
        } catch (_e) {}
