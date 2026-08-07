/* dashboard-helpers.js — top-level utilities shared by the AHU dashboard.
 *
 * Loaded by dashboard.html's module loader (see the `jsModules` array near
 * the bottom of dashboard.html).  All listed modules are concatenated
 * with the inline `main-source` and transpiled together as a single Babel
 * block, so anything declared at top level here is visible to App.jsx
 * without `window.*` shenanigans.
 *
 * What lives here (Phase L.23 first slice):
 *   - red5OpenPopupWindow  → cross-modal pop-out helper (browser window
 *                            cloning + style mirroring) used by both AHU
 *                            and VAV equipment modals.
 *   - Icon                 → inline Lucide-style SVG icon renderer; pure
 *                            functional component, lifted out of App so
 *                            it can be unit-tested + reused by future
 *                            sub-modules.
 *   - Sparkline            → minimal trend mini-chart renderer; pure
 *                            functional component, props-only, no closure
 *                            access needed.
 *
 * What does NOT belong here:
 *   - Anything that reads/writes App's React state, refs, or memoised
 *     values (those need to stay inside the App closure or receive their
 *     deps via props).
 */

// ====================================================================
// Cross-modal pop-out helper.
// ----------------------------------------------------------------------
// Opens a separate browser window, clones the parent's stylesheets +
// Tailwind CDN, and returns { win, host } where `host` is a freshly
// created <div> in the new window.  Callers feed that host into
// ReactDOM.createPortal() to render their modal tree into the popup,
// preserving all React state, telemetry, click handlers etc.
//
// Also: red5OpenPipWindow — Document Picture-in-Picture (Chrome/Edge):
// a minimal always-on-top floating box with almost no browser chrome.
// Only one PiP window is allowed per tab; use alongside window.open
// pop-outs (operators pick POP OUT vs FLOAT).
// ----------------------------------------------------------------------

/** Shared: copy parent styles into an already-opened external window. */
function red5FillExternalWindow(win, name, title) {
    try {
        if (!win.document.head.querySelector('title')) {
            const titleEl = win.document.createElement('title');
            titleEl.textContent = title;
            win.document.head.appendChild(titleEl);
        } else {
            win.document.title = title;
        }
    } catch (e) {}
    try {
        if (!win.document.head.querySelector('base')) {
            const baseEl = win.document.createElement('base');
            baseEl.href = window.location.href;
            win.document.head.appendChild(baseEl);
        }
    } catch (e) {}
    // Clone styles once (idempotent if host already exists).
    try {
        if (!win.document.getElementById('red5-popup-' + name)) {
            document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach(node => {
                win.document.head.appendChild(node.cloneNode(true));
            });
            const tailwind = document.querySelector('script[src*="tailwindcss"]');
            if (tailwind) {
                const tw = win.document.createElement('script');
                tw.src = tailwind.src;
                win.document.head.appendChild(tw);
            }
        }
    } catch (e) {}
    try {
        win.document.body.className = document.body.className;
        win.document.body.style.margin = '0';
        win.document.body.style.background = 'transparent';
        win.document.body.style.overflow = 'hidden';
        win.document.body.style.width = '100%';
        win.document.body.style.height = '100%';
    } catch (e) {}
    let host = null;
    try {
        host = win.document.getElementById('red5-popup-' + name);
        if (!host) {
            host = win.document.createElement('div');
            host.id = 'red5-popup-' + name;
            host.style.cssText = 'display:block;width:100%;height:100%;min-height:100%;position:relative;box-sizing:border-box;';
            win.document.body.appendChild(host);
        }
    } catch (e) {
        return null;
    }
    return host;
}

function red5ClampPopupSize(width, height) {
    const w = Math.max(480, Math.round(Number(width) || 1400));
    const h = Math.max(360, Math.round(Number(height) || 900));
    const availW = (typeof screen !== 'undefined' && screen.availWidth) ? screen.availWidth : w;
    const availH = (typeof screen !== 'undefined' && screen.availHeight) ? screen.availHeight : h;
    return {
        openW: Math.min(w, Math.max(640, availW - 40)),
        openH: Math.min(h, Math.max(480, availH - 60)),
    };
}

function red5PipSupported() {
    return !!(typeof window !== 'undefined' && window.documentPictureInPicture
        && typeof window.documentPictureInPicture.requestWindow === 'function');
}

function red5OpenPopupWindow(name, title, width, height) {
    const winName = 'red5_' + name;
    const { openW, openH } = red5ClampPopupSize(width, height);
    const features = 'width=' + openW + ',height=' + openH +
        ',resizable=yes,scrollbars=yes,menubar=no,toolbar=no,location=no,status=no';
    const win = window.open('', winName, features);
    if (!win) return null;

    // Modern Chromium often ignores features width/height (and reuses a
    // named window at its previous tiny size). Force the content area to
    // match the docked modal after chrome is measurable.
    const applySize = () => {
        try {
            const chromeW = Math.max(0, (win.outerWidth || openW) - (win.innerWidth || openW));
            const chromeH = Math.max(0, (win.outerHeight || openH) - (win.innerHeight || openH));
            win.resizeTo(openW + chromeW, openH + chromeH);
        } catch (e) { /* popup resize blocked by browser policy */ }
    };
    try { win.resizeTo(openW, openH); } catch (e) {}
    try { setTimeout(applySize, 0); setTimeout(applySize, 50); } catch (e) {}

    try {
        win.document.open();
        win.document.write('<!doctype html><html><head></head><body></body></html>');
        win.document.close();
    } catch (e) {}
    win.__red5IsPip = false;
    const host = red5FillExternalWindow(win, name, title);
    if (!host) return null;
    return { win: win, host: host, isPip: false };
}

/**
 * Document Picture-in-Picture floating window (Chrome / Edge).
 * Minimal chrome, always-on-top, user can drag across monitors.
 * Must be called from a user-gesture handler. Async.
 */
async function red5OpenPipWindow(name, title, width, height) {
    if (!red5PipSupported()) return null;
    const { openW, openH } = red5ClampPopupSize(width, height);
    let win;
    try {
        win = await window.documentPictureInPicture.requestWindow({
            width: openW,
            height: openH,
            disallowReturnToOpener: true,
        });
    } catch (e) {
        console.warn('[red5] Document PiP request failed:', e);
        return null;
    }
    if (!win) return null;
    win.__red5IsPip = true;
    const host = red5FillExternalWindow(win, name, title);
    if (!host) {
        try { win.close(); } catch (e) {}
        return null;
    }
    return { win: win, host: host, isPip: true };
}

// ====================================================================
// Icon — inline Lucide-style SVG renderer.
// ----------------------------------------------------------------------
// Used by the toolbar buttons in the left sidebar.  Kept here (rather
// than a separate <svg> CDN or icon package) so the build stays
// dependency-free and the icons inherit `currentColor` from whichever
// Tailwind text-* class the button uses.  Each `name` matches the
// Lucide canonical icon so future swaps are a 30-second search.
// ----------------------------------------------------------------------
const Icon = ({ name, size = 14, strokeWidth = 2, className = '' }) => {
    const paths = {
        'book-open': (
            <>
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </>
        ),
        'clipboard-list': (
            <>
                <rect width="8" height="4" x="8" y="2" rx="1" />
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <path d="M12 11h4" />
                <path d="M12 16h4" />
                <path d="M8 11h.01" />
                <path d="M8 16h.01" />
            </>
        ),
        'radio-tower': (
            <>
                <path d="M4.9 16.1C1 12.2 1 5.8 4.9 1.9" />
                <path d="M7.8 4.7a6.14 6.14 0 0 0-.8 7.5" />
                <circle cx="12" cy="9" r="2" />
                <path d="M16.2 4.8c2 2 2.26 5.11.8 7.47" />
                <path d="M19.1 1.9a9.96 9.96 0 0 1 0 14.1" />
                <path d="M9.5 18h5" />
                <path d="m8 22 4-11 4 11" />
            </>
        ),
        'settings': (
            <>
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
            </>
        ),
        'rotate-ccw': (
            <>
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
            </>
        ),
        /* Tab icons added 2026-06-27 (Phase L.41) — used when the
           sidebar is in compact mode and the PSYCH / DIAG / DYNAM /
           3D WX tabs collapse from text labels to icons-only.  Paths
           are lifted from lucide-react so they sit naturally next to
           the existing book-open / radio-tower / settings family. */
        'line-chart': (
            <>
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
            </>
        ),
        'search': (
            <>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
            </>
        ),
        'activity': (
            <>
                <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.5.5 0 0 1-.96 0L9.24 2.18a.5.5 0 0 0-.96 0l-2.35 8.36A2 2 0 0 1 4 12H2" />
            </>
        ),
        'box': (
            <>
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
            </>
        ),
    };
    return (
        <svg width={size} height={size} viewBox="0 0 24 24"
             fill="none" stroke="currentColor" strokeWidth={strokeWidth}
             strokeLinecap="round" strokeLinejoin="round"
             className={className}
             aria-hidden="true">
            {paths[name] || null}
        </svg>
    );
};

// ====================================================================
// Sparkline — minimal trend-line renderer.
// ----------------------------------------------------------------------
// Renders a polyline + current-value dot for a numeric series.  Used by
// the diagnostics console and the AHU/VAV summary panel to surface
// 60-sample telemetry trends without pulling in a charting library.
// Pure functional — no React state, no closure deps.
// ----------------------------------------------------------------------
const Sparkline = ({ data, width, height, color, label }) => {
    if (!data || data.length < 2) return React.createElement('span', {className: 'text-[9px] text-slate-600 italic'}, 'no data');
    const vals = data.filter(v => v !== null && typeof v === 'number');
    if (vals.length < 2) return React.createElement('span', {className: 'text-[9px] text-slate-600 italic'}, 'no data');
    const min = Math.min(...vals), max = Math.max(...vals);
    const range = max - min || 1;
    const points = vals.map((v, i) => `${(i / (vals.length - 1)) * width},${height - ((v - min) / range) * (height - 4) - 2}`).join(' ');
    const current = vals[vals.length - 1];
    return React.createElement('svg', { width, height, className: 'inline-block' },
        React.createElement('polyline', { points, fill: 'none', stroke: color || '#6366f1', strokeWidth: 1.5, strokeLinejoin: 'round' }),
        React.createElement('circle', { cx: width, cy: height - ((current - min) / range) * (height - 4) - 2, r: 2, fill: color || '#6366f1' })
    );
};


// ====================================================================
// OA-condition -> B1..B10 band helpers (Phase L.43).
// ----------------------------------------------------------------------
// Shared by the sidebar AHU rows and the AHU equipment modal so the
// classification + plain-language description stay byte-identical
// across surfaces.  Rules mirror psy-3d-engine.js BANDS[] (lines
// 1065-1076).  Keep in sync if either side is retuned.
// ====================================================================

// Classify an outdoor-air (T deg C, RH %) sample to one of B1..B10 or
// '?' (no match).  Rules are evaluated top-to-bottom -- first match
// wins -- so overlapping windows (e.g. B4 vs B5) are resolved by the
// order here, not by mutual exclusion.
// Classify an outdoor-air (T deg C, RH %) sample to one of B1..B10 or
// '?' (no match).
//
// Historically these rules were hand-typed with strict `<` inequalities
// and returned '?' whenever no window matched -- but that disagreed
// with the CSV band-guide the detail page (`ahu.html`) loads from
// `/api/band-guide`, which uses closed `[lo, hi]` intervals and falls
// back to B5 (PASS-THROUGH) on any miss.  The result was the sidebar
// showing '?' while the detail page showed a valid band for the same
// OA sample -- reported by operators on 2026-07-01.
//
// This function now mirrors the CSV verbatim (see
// `frontend/public/AHU-01-E_band_guide.csv`), first-match-wins in the
// same top-to-bottom order the CSV lists, with the B5 fallback so the
// two surfaces never disagree.  Only genuinely-bad (`NaN`) T/RH still
// yields '?' -- that's the operator's "sensor offline" signal, not
// "no recipe for this weather".
const bandLabelOf = (t, rh) => {
    if (!Number.isFinite(t) || !Number.isFinite(rh)) return '?';
    // B1  COLD-DRY      T ∈ [-50, 5],  RH ∈ [0, 30]
    if (t >= -50 && t <=  5 && rh >=  0 && rh <=  30) return 'B1';
    // B2  COLD-MOD      T ∈ [5, 15],   RH ∈ [30, 60]
    if (t >=   5 && t <= 15 && rh >= 30 && rh <=  60) return 'B2';
    // B3  COOL-DRY      T ∈ [15, 20],  RH ∈ [0, 30]
    if (t >=  15 && t <= 20 && rh >=  0 && rh <=  30) return 'B3';
    // B4  ECONOMIZER    T ∈ [18, 22],  RH ∈ [30, 50]
    if (t >=  18 && t <= 22 && rh >= 30 && rh <=  50) return 'B4';
    // B5  PASS-THROUGH  T ∈ [22, 25],  RH ∈ [40, 60]
    if (t >=  22 && t <= 25 && rh >= 40 && rh <=  60) return 'B5';
    // B6  WARM-MOD      T ∈ [25, 27],  RH ∈ [50, 70]
    if (t >=  25 && t <= 27 && rh >= 50 && rh <=  70) return 'B6';
    // B7  WARM-HUM      T ∈ [27, 32],  RH ∈ [60, 80]
    if (t >=  27 && t <= 32 && rh >= 60 && rh <=  80) return 'B7';
    // B8  HOT-HUM       T ∈ [32, 38],  RH ∈ [70, 100]
    if (t >=  32 && t <= 38 && rh >= 70 && rh <= 100) return 'B8';
    // B9  HOT-DRY       T ∈ [35, 50],  RH ∈ [0, 30]
    if (t >=  35 && t <= 50 && rh >=  0 && rh <=  30) return 'B9';
    // B10 EXTREME-HUM   T ∈ [30, 50],  RH ∈ [85, 100]
    if (t >=  30 && t <= 50 && rh >= 85 && rh <= 100) return 'B10';
    // Fallback: mirrors backend / `ahu.html::_resolveBand`'s B5 exit --
    // valid OA that falls into a gap between windows still gets a
    // sensible operator answer instead of the misleading '?' chip.
    return 'B5';
};

// Tailwind classes for the band-status chip.  Cool side blue, mid
// bands emerald (comfort), hot side red/orange.  `?` is amber +
// pulsing to signal SAFE-MODE (no pre-tuned recipe for this OA).
// Text shades bumped one tier darker (300 -> 400, 200 -> 300) on
// 2026-06-27 per operator request: the lighter tier read as washed-out
// against the translucent 10% fill, especially the amber/rose chips on
// a bright monitor.  Hue is preserved so the band-to-colour mapping
// stays consistent with the 3D WX overlay legend.
const bandTint = (b) => {
    switch (b) {
        case 'B1': case 'B2': case 'B3': return 'border-sky-500/50 text-sky-400 bg-sky-500/10';
        case 'B4': case 'B5':            return 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10';
        case 'B6':                       return 'border-amber-500/50 text-amber-400 bg-amber-500/10';
        case 'B7': case 'B8': case 'B10':return 'border-rose-500/60 text-rose-400 bg-rose-500/10';
        case 'B9':                       return 'border-red-500/60 text-red-400 bg-red-500/10';
        default:                         return 'border-amber-500/60 text-amber-300 bg-amber-500/15 animate-pulse';
    }
};

// Plain-language description per band for the AHU modal overlay and
// chip tooltip.  6th-grade reading level: what does the weather feel
// like, what is the AHU doing about it, what setpoints fire?
// Setpoints mirror psy-3d-engine.js BANDS[] (lines 1065-1076).
const bandStory = (b) => {
    switch (b) {
        case 'B1': return {
            weather: 'Freezing and dry outside (under 5 deg C, under 30 % RH). Think winter morning.',
            plan:    'Keep most outside air OUT. Heat the supply air to ~21 deg C and add a little moisture.',
            set:     'SA = 21.0 deg C @ 40 % RH   |   OA damper = 15 % (minimum)'
        };
        case 'B2': return {
            weather: 'Cool and comfortable outside (5-15 deg C, 30-60 % RH). Think spring or fall.',
            plan:    'Bring in just enough outside air. Gentle heating.',
            set:     'SA = 19.5 deg C @ 35 % RH   |   OA damper = 15 %'
        };
        case 'B3': return {
            weather: 'Mild but very dry outside (15-20 deg C, under 30 % RH). Think dry mild day.',
            plan:    'Open the damper a little to use the cool outside air. Add some moisture.',
            set:     'SA = 19.0 deg C @ 45 % RH   |   OA damper = 30 %'
        };
        case 'B4': return {
            weather: 'Outside air is almost perfect (18-22 deg C, 30-50 % RH).',
            plan:    'Open the damper WIDE and let the outside air do the cooling for free.',
            set:     'SA = 20.0 deg C @ 40 % RH   |   OA damper = 100 % (free cooling)'
        };
        case 'B5': return {
            weather: 'Outside feels exactly like a comfortable room (22-25 deg C, 40-60 % RH).',
            plan:    'Blow outside air straight in. Almost no work for the AHU.',
            set:     'SA = 23.5 deg C @ 50 % RH   |   OA damper = 100 % (free cooling)'
        };
        case 'B6': return {
            weather: 'Outside is warm and a bit humid (25-27 deg C, 50-70 % RH).',
            plan:    'Mix some outside air with return air. Light cooling.',
            set:     'SA = 25.0 deg C @ 55 % RH   |   OA damper = 50 %'
        };
        case 'B7': return {
            weather: 'Outside is hot and sticky (27-32 deg C, 60-80 % RH). Typical summer.',
            plan:    'Close the damper. Run the AC hard to cool AND pull moisture out.',
            set:     'SA = 12.0 deg C @ 95 % RH   |   OA damper = 15 %'
        };
        case 'B8': return {
            weather: 'Very hot and very humid outside (32-38 deg C, over 70 % RH). Heat wave.',
            plan:    'Lock outside air out. Push cooling and dehumidifying to the max.',
            set:     'SA = 13.0 deg C @ 95 % RH   |   OA damper = 15 %'
        };
        case 'B9': return {
            weather: 'Very hot but bone dry outside (over 35 deg C, under 30 % RH). Desert.',
            plan:    'Cool the air down -- do not waste energy removing humidity that is not there.',
            set:     'SA = 15.0 deg C @ 40 % RH   |   OA damper = 15 %'
        };
        case 'B10': return {
            weather: 'Tropical outside (over 30 deg C, over 85 % RH). Air feels like soup.',
            plan:    'Close the damper tight. Cool aggressively and squeeze moisture out.',
            set:     'SA = 11.0 deg C @ 95 % RH   |   OA damper = 15 %'
        };
        default:   return {  // '?' -- outside all 10 bands
            weather: 'Outside conditions do not match any of the 10 pre-tuned bands.',
            plan:    'AHU should run in SAFE-MODE: ASHRAE 55 Cat A defaults until weather moves back into a band.',
            set:     'SA = 21.0 deg C @ 50 % RH   |   OA damper = minimum for indoor air quality   |   economizer ON when outside is cooler than inside'
        };
    }
};

/* ------------------------------------------------------------------
 * renderProcessMiniBadge — overview-slide OA–MA–SA / RA sketch.
 * Full psy range from 5 °C dry-bulb (not −15), light plot, saturation curve,
 * purple enthalpy diagonals through OA/RA/SA (RA bold), green RH band only.
 * Point colours (fixed — match operator request / live chart intent):
 *   OA dark cyan · RA pinkish-red · SA green · MA black with yellow ring.
 * Click the plot to drop a magnifying glass (center = click); drag to move;
 * slider / wheel adjusts zoom (leftmost = Off). Double-click clears the lens.
 * Ctx: { ahu, theme, sweetSpotRange, showSweetSpot, T_MIN, T_MAX }
 * ------------------------------------------------------------------ */
function renderProcessMiniBadge(ctx) {
    /* Hooks first — this helper is invoked during App render like a component. */
    const VW = 440, VH = 248;
    const [lens, setLens] = React.useState(null); /* { cx, cy } in SVG user units */
    const [lastLens, setLastLens] = React.useState({ cx: VW * 0.56, cy: VH * 0.60 });
    const [zoom, setZoom] = React.useState(2.2); /* 1.0 = Off */
    const [dragging, setDragging] = React.useState(false);
    const lensR = 93; /* 1.5× prior 62 px radius */
    const magOn = zoom > 1.001 && !!lens;

    const { ahu, theme, sweetSpotRange, showSweetSpot, T_MIN: tMinIn, T_MAX: tMaxIn } = ctx || {};
    if (!ahu || !ahu.points) return null;
    const by = {};
    (ahu.points || []).forEach((p) => { if (p && p.label) by[p.label] = p; });
    const OA = by.OA, RA = by.RA, SA = by.SA, MA = by.MA;
    if (!OA || !RA || !SA) return null;

    const rhLo = (sweetSpotRange && Number.isFinite(sweetSpotRange.lo)) ? sweetSpotRange.lo : 40;
    const rhHi = (sweetSpotRange && Number.isFinite(sweetSpotRange.hi)) ? sweetSpotRange.hi : 60;
    const drawBand = showSweetSpot !== false;
    const _getW = (typeof getW === 'function') ? getW : null;
    const _getH = (typeof getH === 'function') ? getH : null;

    /* Chart window: dry-bulb from 5 °C (not −15) through main-chart T_MAX; W 0–30 g/kg. */
    const tMin = 5;
    const tMax = Number.isFinite(tMaxIn) ? Math.max(tMaxIn, 35) : 50;
    const wMin = 0;
    const wMax = 0.030; /* 30 g/kg — matches main-chart W_MAX */

    /* ~2× card — overview sketch on white. */
    const L = 40, R = 18, TOP = 20, BOT = 30;
    const gw = VW - L - R, gh = VH - TOP - BOT;
    const xOf = (t) => L + ((Number(t) - tMin) / (tMax - tMin)) * gw;
    const yOf = (w) => TOP + gh - ((Number(w) - wMin) / (wMax - wMin)) * gh;
    const fmt = (p) => {
        const t = Number(p.t);
        const rh = Number(p.rh);
        return (Number.isFinite(t) ? t.toFixed(1) + '\u00B0' : '--') +
            ' \u00B7 ' + (Number.isFinite(rh) ? rh.toFixed(0) + '%' : '--');
    };

    const satSegs = [];
    for (let tt = tMin; tt <= tMax + 1e-9; tt += 0.35) {
        let ws = null;
        if (_getW) {
            try { ws = _getW(tt, 100); } catch (_) { ws = null; }
        }
        if (!Number.isFinite(ws)) {
            const tC = Math.max(-20, Math.min(60, tt));
            const ps = 0.61094 * Math.exp((17.625 * tC) / (tC + 243.04));
            ws = 0.621945 * ps / (101.325 - ps);
        }
        if (ws < wMin) continue;
        if (ws > wMax) {
            satSegs.push(xOf(tt).toFixed(1) + ',' + yOf(wMax).toFixed(1));
            break;
        }
        satSegs.push(xOf(tt).toFixed(1) + ',' + yOf(ws).toFixed(1));
    }
    const satPath = satSegs.length > 1 ? ('M ' + satSegs.join(' L ')) : '';

    /* Constant-enthalpy diagonals — overview style: violet, dashed, clipped at sat. */
    const enthalpyPath = (pt) => {
        if (!_getH || !pt) return '';
        const h0 = _getH(Number(pt.t), Number(pt.w));
        if (!Number.isFinite(h0)) return '';
        const segs = [];
        for (let tt = tMin; tt <= tMax + 1e-9; tt += 0.4) {
            const w = (h0 - 1.006 * tt) / (2501 + 1.86 * tt);
            if (!Number.isFinite(w) || w < wMin || w > wMax) {
                if (segs.length) segs.push(null);
                continue;
            }
            if (_getW) {
                try {
                    const ws = _getW(tt, 100);
                    if (Number.isFinite(ws) && w > ws + 0.00015) {
                        if (segs.length) segs.push(null);
                        continue;
                    }
                } catch (_) {}
            }
            segs.push(xOf(tt).toFixed(1) + ',' + yOf(w).toFixed(1));
        }
        const parts = [];
        let cur = [];
        const flush = () => { if (cur.length > 1) parts.push('M ' + cur.join(' L ')); cur = []; };
        segs.forEach((p) => { if (p == null) flush(); else cur.push(p); });
        flush();
        return parts[0] || '';
    };
    const hOA = enthalpyPath(OA);
    const hRA = enthalpyPath(RA);
    const hSA = enthalpyPath(SA);

    /* Green RH band (lo–hi isopleths over comfort T) — not Givoni engine. */
    let bandPts = '';
    if (drawBand && _getW) {
        const top = [], bot = [];
        const tBandLo = 20, tBandHi = 27;
        for (let tt = tBandLo; tt <= tBandHi + 1e-9; tt += 0.35) {
            top.push([tt, Math.min(wMax, _getW(tt, rhHi))]);
        }
        for (let tt = tBandHi; tt >= tBandLo - 1e-9; tt -= 0.35) {
            bot.push([tt, Math.max(wMin, _getW(tt, rhLo))]);
        }
        bandPts = top.concat(bot).map(([t, w]) =>
            xOf(t).toFixed(1) + ',' + yOf(w).toFixed(1)
        ).join(' ');
    }

    /* "equal energy (enthalpy)" — just outside sat where RA’s h-line meets 100% RH. */
    let hLabelX = L + gw * 0.40;
    let hLabelY = TOP + 56;
    if (_getH && _getW && RA) {
        const h0 = _getH(Number(RA.t), Number(RA.w));
        let tHit = Number(RA.t);
        /* Along constant-h, colder T → higher W → hits sat to the left of RA */
        for (let tt = Number(RA.t); tt >= tMin; tt -= 0.2) {
            const wh = (h0 - 1.006 * tt) / (2501 + 1.86 * tt);
            let ws;
            try { ws = _getW(tt, 100); } catch (_) { ws = null; }
            if (!Number.isFinite(wh) || !Number.isFinite(ws)) continue;
            if (wh >= ws - 0.0001) { tHit = tt; break; }
        }
        let wsHit;
        try { wsHit = _getW(tHit, 100); } catch (_) { wsHit = null; }
        if (Number.isFinite(wsHit)) {
            hLabelX = xOf(tHit) - 4;
            hLabelY = yOf(Math.min(wMax, wsHit)) - 10;
        }
        hLabelX = Math.max(L + 90, Math.min(L + gw * 0.62, hLabelX));
        hLabelY = Math.max(TOP + 22, Math.min(TOP + gh * 0.55, hLabelY));
    }

    const ox = xOf(OA.t), oy = yOf(OA.w);
    const rx = xOf(RA.t), ry = yOf(RA.w);
    const sx = xOf(SA.t), sy = yOf(SA.w);
    const mx = MA ? xOf(MA.t) : (ox + rx) / 2;
    const my = MA ? yOf(MA.w) : (oy + ry) / 2;

    /* Fixed point colours (do not inherit / wash from dark parent). */
    const colOA = '#0e7490';     /* dark cyan — outdoor */
    const colRA = '#e11d48';     /* pinkish red — return */
    const colSA = '#059669';     /* green — supply */
    const colMA = '#0f172a';     /* black — mixed */
    const colMARing = '#eab308'; /* yellow ring around MA */
    const colBand = '#047857';  /* overview green for RH band + mix line only */
    const colH = '#6d28d9';
    const colSat = '#1d4ed8';
    const cardBg = '#ffffff';
    const cardBd = '#cbd5e1';
    const titleC = '#334155';
    const axisC = '#334155';
    const arrId = 'pmini-arr-' + String(ahu.id || 'x').replace(/[^a-zA-Z0-9_-]/g, '_');
    void theme; /* badge is always light; ignore dashboard dark theme inheritance */

    /* Left of the band polygon — clear of RA (inside the band at ~24 °C) */
    const bandLabelX = xOf(18.5);
    const bandLabelY = _getW
        ? yOf((_getW(20, rhLo) + _getW(20, rhHi)) / 2) + 4
        : (TOP + gh * 0.55);

    const clipId = 'pmini-clip-' + String(ahu.id || 'x').replace(/[^a-zA-Z0-9_-]/g, '_');
    const svgToLocal = (svgEl, clientX, clientY) => {
        try {
            const pt = svgEl.createSVGPoint();
            pt.x = clientX; pt.y = clientY;
            const ctm = svgEl.getScreenCTM();
            if (!ctm) return null;
            const p = pt.matrixTransform(ctm.inverse());
            return {
                cx: Math.max(8, Math.min(VW - 8, p.x)),
                cy: Math.max(8, Math.min(VH - 8, p.y)),
            };
        } catch (_) { return null; }
    };

    const chartLayers = (
        <g>
            <rect x="2" y="2" width={VW - 4} height={VH - 4} rx="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
            <line x1={L} y1={TOP + gh} x2={L + gw} y2={TOP + gh} stroke="#64748b" strokeWidth="1.5" />
            <line x1={L} y1={TOP} x2={L} y2={TOP + gh} stroke="#64748b" strokeWidth="1.5" />
            {hOA && <path d={hOA} fill="none" stroke={colH} strokeWidth="1.4" strokeDasharray="2 4" />}
            {hSA && <path d={hSA} fill="none" stroke={colH} strokeWidth="1.4" strokeDasharray="2 4" />}
            {hRA && <path d={hRA} fill="none" stroke={colH} strokeWidth="2" strokeDasharray="7 4" />}
            {satPath && (
                <path d={satPath} fill="none" stroke={colSat} strokeWidth="2.8" strokeLinecap="round" />
            )}
            {satPath && (
                <g fontFamily="system-ui,sans-serif">
                    <text x={L + gw * 0.78} y={TOP + 16} fill={colSat} style={{ fill: colSat }} fontSize="12" fontWeight="700">100% RH</text>
                    <text x={L + gw * 0.78} y={TOP + 30} fill="#475569" style={{ fill: '#475569' }} fontSize="11">(saturation)</text>
                </g>
            )}
            {hRA && (
                <text x={hLabelX} y={hLabelY} fill={colH} style={{ fill: colH }} fontSize="10.5" fontWeight="700"
                      textAnchor="end" fontFamily="system-ui,sans-serif">equal energy (enthalpy)</text>
            )}
            {bandPts && (
                <g>
                    <polygon points={bandPts}
                             fill="#10b981" fillOpacity="0.22"
                             stroke={colBand} strokeWidth="1.8"
                             strokeDasharray="5 3" />
                    <text x={bandLabelX} y={bandLabelY} fill={colBand} style={{ fill: colBand }} fontSize="11"
                          fontWeight="800" textAnchor="middle"
                          fontFamily="system-ui,sans-serif">
                        RH band
                    </text>
                </g>
            )}
            <line x1={ox} y1={oy} x2={rx} y2={ry} stroke={colBand} strokeWidth="2.2"
                  strokeDasharray="6 4" />
            <line x1={mx} y1={my} x2={sx} y2={sy} stroke={colSA} strokeWidth="2.6"
                  markerEnd={'url(#' + arrId + ')'} />
            <circle cx={ox} cy={oy} r="6.5" fill={colOA} />
            <text x={ox + 10} y={oy - 6} fill={colOA} style={{ fill: colOA }} fontSize="13" fontWeight="800"
                  fontFamily="system-ui,sans-serif">OA</text>
            <circle cx={rx} cy={ry} r="6.5" fill={colRA} />
            <text x={rx + 8} y={ry + 18} fill={colRA} style={{ fill: colRA }} fontSize="13" fontWeight="800"
                  fontFamily="system-ui,sans-serif">RA</text>
            <circle cx={mx} cy={my} r="6" fill={colMA} stroke={colMARing} strokeWidth="2.5" />
            <text x={mx + 9} y={my - 7} fill={colMA} style={{ fill: colMA }} fontSize="13" fontWeight="800"
                  fontFamily="system-ui,sans-serif">MA</text>
            <circle cx={sx} cy={sy} r="6.5" fill={colSA} />
            <text x={sx - 26} y={sy - 8} fill={colSA} style={{ fill: colSA }} fontSize="13" fontWeight="800"
                  fontFamily="system-ui,sans-serif">SA</text>
            <text x={L + gw / 2} y={VH - 8} fill={axisC} style={{ fill: axisC }} fontSize="12" fontWeight="700"
                  textAnchor="middle" fontFamily="system-ui,sans-serif">Dry-bulb temperature →</text>
            <text x={14} y={TOP + gh / 2} fill={axisC} style={{ fill: axisC }} fontSize="12" fontWeight="700"
                  textAnchor="middle"
                  transform={`rotate(-90, 14, ${TOP + gh / 2})`}
                  fontFamily="system-ui,sans-serif">Moisture in the air →</text>
        </g>
    );

    return (
        <details
            data-testid="process-mini-badge"
            className="absolute top-3 right-3 z-40 select-none"
            style={{ maxWidth: 460, color: '#0f172a', isolation: 'isolate', opacity: 1 }}
            onMouseDown={(e) => e.stopPropagation()}
        >
            <summary
                className="list-none cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black tracking-wider uppercase font-mono bg-slate-900 border-slate-500 text-white hover:border-sky-400"
                title="Show OA–MA–SA / RA process sketch (full chart range)"
            >
                <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: colOA }} />
                <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: colMA, outline: `2px solid ${colMARing}`, outlineOffset: 1 }} />
                <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: colRA }} />
                <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: colSA }} />
                Process
            </summary>
            <div
                className="mt-1.5 rounded-xl border p-2 shadow-xl"
                style={{ background: cardBg, borderColor: cardBd, width: VW + 16, color: '#0f172a' }}
            >
                <div className="px-1 pb-1 flex items-center gap-2" style={{ color: titleC }}>
                    <div className="text-[9px] font-black uppercase tracking-[0.14em] font-mono flex-1 min-w-0">
                        {ahu.id} · OA–MA–SA / RA
                        {drawBand ? ` · ${rhLo}–${rhHi}% RH` : ''}
                    </div>
                    <label className="shrink-0 inline-flex items-center gap-1 font-mono text-[9px] font-bold"
                           title="Magnifier zoom — slide fully left to turn off"
                           onMouseDown={(e) => e.stopPropagation()}>
                        <span style={{ color: '#64748b' }}>{zoom <= 1.001 ? 'Off' : (zoom.toFixed(1) + '\u00D7')}</span>
                        <input type="range" min="1" max="4.5" step="0.1" value={zoom}
                               data-testid="process-mini-zoom"
                               onChange={(e) => {
                                   const z = Number(e.target.value);
                                   setZoom(z);
                                   if (z <= 1.001) {
                                       if (lens) setLastLens(lens);
                                       setLens(null);
                                   } else if (!lens) {
                                       setLens(lastLens);
                                   }
                               }}
                               style={{ width: 72, accentColor: '#0e7490', cursor: 'pointer' }} />
                    </label>
                </div>
                <svg viewBox={`0 0 ${VW} ${VH}`} width={VW} height={VH} aria-hidden="true"
                     data-testid="process-mini-svg"
                     style={{ color: '#0f172a', display: 'block', cursor: magOn ? 'grab' : 'zoom-in', touchAction: 'none' }}
                     onClick={(e) => {
                         if (dragging) return;
                         if (e.detail >= 2) {
                             if (lens) setLastLens(lens);
                             setLens(null);
                             setZoom(1);
                             return;
                         }
                         const loc = svgToLocal(e.currentTarget, e.clientX, e.clientY);
                         if (!loc) return;
                         setLens(loc);
                         setLastLens(loc);
                         if (zoom <= 1.001) setZoom(2.2);
                     }}
                     onWheel={(e) => {
                         e.preventDefault();
                         e.stopPropagation();
                         const dy = e.deltaY;
                         setZoom((z) => {
                             const next = Math.max(1, Math.min(4.5, z + (dy < 0 ? 0.15 : -0.15)));
                             if (next <= 1.001) {
                                 setLens((cur) => { if (cur) setLastLens(cur); return null; });
                             } else {
                                 setLens((cur) => {
                                     if (cur) return cur;
                                     const loc = svgToLocal(e.currentTarget, e.clientX, e.clientY);
                                     const place = loc || lastLens;
                                     setLastLens(place);
                                     return place;
                                 });
                             }
                             return next;
                         });
                     }}
                     onMouseDown={(e) => {
                         e.stopPropagation();
                         if (!magOn || e.button !== 0) return;
                         const loc = svgToLocal(e.currentTarget, e.clientX, e.clientY);
                         if (!loc) return;
                         const dx = loc.cx - lens.cx, dy = loc.cy - lens.cy;
                         if (dx * dx + dy * dy <= lensR * lensR) setDragging(true);
                     }}
                     onMouseMove={(e) => {
                         if (!dragging) return;
                         const loc = svgToLocal(e.currentTarget, e.clientX, e.clientY);
                         if (loc) { setLens(loc); setLastLens(loc); }
                     }}
                     onMouseUp={() => setDragging(false)}
                     onMouseLeave={() => setDragging(false)}
                >
                    <defs>
                        <marker id={arrId} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                            <path d="M0,0 L7,3.5 L0,7 Z" fill={colSA} />
                        </marker>
                    </defs>
                    {chartLayers}
                    {magOn && (
                        <g data-testid="process-mini-lens" style={{ pointerEvents: 'none' }}>
                            <defs>
                                <clipPath id={clipId}>
                                    <circle cx={lens.cx} cy={lens.cy} r={lensR} />
                                </clipPath>
                                <filter id={clipId + '-sh'} x="-20%" y="-20%" width="140%" height="140%">
                                    <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#0f172a" floodOpacity="0.28" />
                                </filter>
                            </defs>
                            <circle cx={lens.cx} cy={lens.cy} r={lensR + 1.5}
                                    fill="none" stroke="#0f172a" strokeOpacity="0.12" strokeWidth="10" />
                            <g clipPath={'url(#' + clipId + ')'}>
                                <g transform={`translate(${lens.cx} ${lens.cy}) scale(${zoom}) translate(${-lens.cx} ${-lens.cy})`}>
                                    {chartLayers}
                                </g>
                            </g>
                            <circle cx={lens.cx} cy={lens.cy} r={lensR}
                                    fill="none" stroke="#e2e8f0" strokeWidth="5"
                                    filter={'url(#' + clipId + '-sh)'} />
                            <circle cx={lens.cx} cy={lens.cy} r={lensR}
                                    fill="none" stroke="#0f172a" strokeWidth="1.6" />
                            <circle cx={lens.cx} cy={lens.cy} r={lensR - 3}
                                    fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1.2" />
                            <line x1={lens.cx + lensR * 0.72} y1={lens.cy + lensR * 0.72}
                                  x2={lens.cx + lensR * 1.15} y2={lens.cy + lensR * 1.15}
                                  stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
                            <line x1={lens.cx + lensR * 0.72} y1={lens.cy + lensR * 0.72}
                                  x2={lens.cx + lensR * 1.15} y2={lens.cy + lensR * 1.15}
                                  stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                        </g>
                    )}
                </svg>
                <div className="px-1 pt-1 text-[8px] font-mono" style={{ color: '#94a3b8' }}>
                    {magOn
                        ? 'Drag lens · scroll/slider zoom · left=Off · double-click clears'
                        : 'Slider left = Off · click plot or raise zoom to magnify'}
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 px-1 pt-1 font-mono text-[11px] font-extrabold leading-tight">
                    <div style={{ color: colOA }}>OA {fmt(OA)}</div>
                    <div style={{ color: colRA }}>RA {fmt(RA)}</div>
                    <div style={{ color: colMA }}>MA {MA ? fmt(MA) : '—'}</div>
                    <div style={{ color: colSA }}>SA {fmt(SA)}</div>
                </div>
            </div>
        </details>
    );
}
