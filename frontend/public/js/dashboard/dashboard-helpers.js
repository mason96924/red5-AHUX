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
// The popup auto-closes when the parent tab unloads (registered by
// the calling component) — we don't try to keep orphaned popups
// alive because they'd point at a dead React root.
// ----------------------------------------------------------------------
function red5OpenPopupWindow(name, title, width, height) {
    const winName = 'red5_' + name;
    const features = 'width=' + width + ',height=' + height +
        ',resizable=yes,scrollbars=yes,menubar=no,toolbar=no,location=no,status=no';
    const win = window.open('', winName, features);
    if (!win) return null;
    win.document.open();
    win.document.write('<!doctype html><html><head></head><body></body></html>');
    win.document.close();
    const titleEl = win.document.createElement('title');
    titleEl.textContent = title;
    win.document.head.appendChild(titleEl);
    const baseEl = win.document.createElement('base');
    baseEl.href = window.location.href;
    win.document.head.appendChild(baseEl);
    // Clone every <style> and stylesheet <link> so Tailwind class names resolve.
    document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach(node => {
        win.document.head.appendChild(node.cloneNode(true));
    });
    // Re-execute the Tailwind CDN runtime so utility classes are compiled in the popup.
    const tailwind = document.querySelector('script[src*="tailwindcss"]');
    if (tailwind) {
        const tw = win.document.createElement('script');
        tw.src = tailwind.src;
        win.document.head.appendChild(tw);
    }
    win.document.body.className = document.body.className;
    win.document.body.style.margin = '0';
    win.document.body.style.background = 'transparent';
    const host = win.document.createElement('div');
    host.id = 'red5-popup-' + name;
    host.style.cssText = 'display:block;width:100vw;min-height:100vh;position:relative;';
    win.document.body.appendChild(host);
    return { win: win, host: host };
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
const bandLabelOf = (t, rh) => {
    if (!Number.isFinite(t) || !Number.isFinite(rh)) return '?';
    if (t <  5  && rh < 30)                         return 'B1';
    if (t >= 5  && t <  15 && rh >= 30 && rh <= 60) return 'B2';
    if (t >= 15 && t <  20 && rh < 30)              return 'B3';
    if (t >= 18 && t <  22 && rh >= 30 && rh <= 50) return 'B4';
    if (t >= 22 && t <= 25 && rh >= 40 && rh <= 60) return 'B5';
    if (t >  25 && t <= 27 && rh >= 50 && rh <= 70) return 'B6';
    if (t >  27 && t <= 32 && rh >  60 && rh <= 80) return 'B7';
    if (t >  32 && t <= 38 && rh >  70)             return 'B8';
    if (t >  35 && rh < 30)                         return 'B9';
    if (t >  30 && rh > 85)                         return 'B10';
    return '?';
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
