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
