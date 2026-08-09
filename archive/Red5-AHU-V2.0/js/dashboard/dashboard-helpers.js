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

/* Canonical OA/RA/SA/MA colours for sidebar labels + main psy-chart dots.
 * MA fill/ring are separate: black disc + yellow outer ring on the chart. */
const RED5_POINT_COLORS = {
    OA: '#3b82f6', /* bluish — outdoor */
    RA: '#f43f5e', /* pinkish red — return */
    SA: '#10b981', /* green — supply */
    MA: '#eab308', /* yellow — label / ring identity */
};
const RED5_MA_FILL = '#0f172a';   /* black disc */
const RED5_MA_RING = '#eab308';   /* yellow outer ring */
const RED5_POINT_DOT_OPACITY = 0.8; /* 20% transparent on the main chart */
function red5PointColor(label, fallback) {
    return RED5_POINT_COLORS[label] || fallback || '#94a3b8';
}

/* MA fault categories A–H (ma_off_chord_diagnostics.html). Rank from
 * ahu.mixing.flags + damper/OAD context for the sidebar glow popup. */
const MA_FAULT_CATALOG = {
    A: {
        pattern: 'Off-chord + small damper_mismatch',
        points: 'Sensor / probe (MAT or MAH)',
        why: 'Mix fraction matches OAD; moisture does not match T-lever',
        needs: 'MAT+MAH, OAD',
        needsExplain: 'MAT alone cannot prove off-chord (W is forced onto the line). You need MAH for independent humidity, and OAD to show the mix ratio still matches the damper — so the fault is the sensor, not economizer.',
    },
    B: {
        pattern: 'Off-chord + large damper_mismatch',
        points: 'Economizer / damper / leakage / stratification',
        why: 'Commanded OA% ≠ actual mix fraction',
        needs: 'MAT, OAD (± MAH)',
        needsExplain: 'Compare temperature-derived OA fraction from MAT to commanded OAD. Large disagreement ⇒ damper/leak/stratification. MAH strengthens the case but is not required to flag a damper mismatch.',
    },
    C: {
        pattern: 'MAT outside OA–RA range (f < 0 or > 1)',
        points: 'Sensor bias or stratification',
        why: 'MAT outside OA–RA temperature range (APAR Rule 10 family)',
        needs: 'MAT, OA, RA',
        needsExplain: 'A simple mixing box cannot produce MAT hotter or colder than both parents. Confirm the three temperatures; stratification at a single-point MAT is the most common false positive.',
    },
    D: {
        pattern: 'Off-chord wetter than mix; OAD ≈ minimum',
        points: 'Unmeasured moisture / EA path / duct leak',
        why: 'Extra water mass not explained by OA–RA mix',
        needs: 'MAT + MAH',
        needsExplain: 'Extra water mass only shows when MA humidity is measured (MAT+MAH). Without MAH you cannot see “wetter than the chord.”',
    },
    E: {
        pattern: 'Plotted OA ≠ air entering the mixing box',
        points: 'ERV / HRV',
        why: 'Wheel moves OA toward RA in h (and sometimes w) before mixing',
        needs: 'EA T/RH, wheel enable, or OA-after-ERV',
        needsExplain: 'Prove the wheel is active and compare exhaust air (or OA after the wheel) to free-stream OA — without those points, ERV looks like a random sensor fault.',
    },
    F: {
        pattern: 'Off-chord only when wheel ON; gone when OFF',
        points: 'ERV / HRV',
        why: 'Controlled A/B confirms transfer, not sensor',
        needs: 'Wheel status + same sensors',
        needsExplain: 'Toggle the wheel and watch the chord residual. If the fault tracks wheel enable, it is ERV transfer — not a failed MAT/MAH.',
    },
    G: {
        pattern: 'Off-chord mainly at high OAD / economizer high',
        points: 'Economizer leakage / nonlinear damper / bypass',
        why: 'Mixing imperfect at extreme positions',
        needs: 'OAD + MAT(+MAH)',
        needsExplain: 'A healthy economizer moves MA along the chord. Off-chord at high OAD points to leakage, bypass, or stratification — not “economizer on” by itself.',
    },
    H: {
        pattern: 'Persistent bias independent of OAD & wheel',
        points: 'Sensor drift (OA, RA, or MA)',
        why: 'Not explained by process mode',
        needs: 'Cross-check / handheld',
        needsExplain: 'When flags persist across OAD and ERV modes, verify OA/RA/MA with a handheld or sibling sensor before chasing dampers.',
    },
};

function classifyMaFault(mixing, opts) {
    const mx = mixing || {};
    const flags = Array.isArray(mx.flags) ? mx.flags : [];
    if (!flags.length) return null;
    const off = flags.indexOf('off_mixing_line') >= 0;
    const outside = flags.indexOf('mat_outside_oa_ra') >= 0;
    const dampMis = flags.indexOf('damper_mismatch') >= 0;
    const oad = (typeof mx.oa_fraction_damper === 'number') ? mx.oa_fraction_damper : null;
    const mismatch = (typeof mx.damper_mismatch === 'number') ? mx.damper_mismatch : null;
    const dev = (typeof mx.line_deviation_g_kg === 'number') ? mx.line_deviation_g_kg : null;
    const ervOn = !!(opts && opts.ervEnabled);

    if (outside) return 'C';
    if (off && ervOn) return 'E';
    if (off && dampMis) return 'B';
    if (off && oad != null && oad <= 0.15 && dev != null && dev > 0) return 'D';
    if (off && oad != null && oad >= 0.70) return 'G';
    if (off && (mismatch == null || mismatch <= 0.20)) return 'A';
    if (off) return 'H';
    if (dampMis) return 'B';
    if (flags.indexOf('oa_ra_temp_too_close') >= 0) return null;
    return 'H';
}

/* Client-side off-chord / MAT-range checks — same thresholds as mixed_air.py.
 * Used when ahu.mixing.flags is missing/stale so the sidebar glow still
 * tracks what the process mini-badge already shows geometrically. */
const RED5_MA_LINE_TOL_GKG = 0.4;
const RED5_MA_CLOSE_LINE_TOL_GKG = 0.2; /* when OA≈RA / no stable f_t */
/* |perp|/|OA–RA| — ~0.025 ≈ 3–5 px “slightly off” on auto-framed process mini */
const RED5_MA_CHORD_FRAC_TOL = 0.025;
const RED5_MA_TEMP_LINE_TOL_C = 0.5;
const RED5_MA_MAT_RANGE_TOL_C = 0.3;
const RED5_MA_MIN_DT_C = 2.0;
const RED5_MA_MIN_DW = 1.0e-4;
const RED5_MA_DAMPER_TOL = 0.20;

function red5ChordWResidualGkg(oa, ra, ma) {
    const ax = Number(oa.t), ay = Number(oa.w) * 1000;
    const bx = Number(ra.t), by = Number(ra.w) * 1000;
    const cx = Number(ma.t), cy = Number(ma.w) * 1000;
    if (![ax, ay, bx, by, cx, cy].every(Number.isFinite)) return null;
    const abx = bx - ax, aby = by - ay;
    const ab2 = abx * abx + aby * aby;
    if (ab2 < 1e-12) return cy - ay;
    const t = ((cx - ax) * abx + (cy - ay) * aby) / ab2;
    return cy - (ay + t * aby);
}

function red5ChordOffFraction(oa, ra, ma) {
    const ax = Number(oa.t), ay = Number(oa.w) * 1000;
    const bx = Number(ra.t), by = Number(ra.w) * 1000;
    const cx = Number(ma.t), cy = Number(ma.w) * 1000;
    if (![ax, ay, bx, by, cx, cy].every(Number.isFinite)) return null;
    const abx = bx - ax, aby = by - ay;
    const ab2 = abx * abx + aby * aby;
    if (ab2 < 1e-12) return null;
    const cross = abx * (cy - ay) - aby * (cx - ax);
    return Math.abs(cross) / ab2;
}

function red5ReadOadFraction(ahu) {
    const ap = (ahu && ahu.all_points) || {};
    const raw = ap.OAD != null ? ap.OAD : (ap.oa_damper != null ? ap.oa_damper : null);
    const n = Number(raw);
    if (!Number.isFinite(n)) return null;
    return Math.max(0, Math.min(1, n / 100));
}

function clientMaMixingFromPoints(ahu) {
    const by = {};
    (ahu && ahu.points || []).forEach((p) => { if (p && p.label) by[p.label] = p; });
    const oa = by.OA, ra = by.RA, ma = by.MA;
    const empty = { flags: [], line_deviation_g_kg: null, damper_mismatch: null, oa_fraction_damper: null, chord_off_fraction: null };
    if (!oa || !ra || !ma) return empty;
    /* Derived MA is forced onto the chord — geometry alone cannot fault it. */
    if (ma.derived === true) return empty;

    const tOa = Number(oa.t), tRa = Number(ra.t), tMa = Number(ma.t);
    const wOa = Number(oa.w), wRa = Number(ra.w), wMa = Number(ma.w);
    if (![tOa, tRa, tMa, wOa, wRa, wMa].every(Number.isFinite)) return empty;

    const flags = [];
    const tLo = Math.min(tOa, tRa), tHi = Math.max(tOa, tRa);
    if (tMa < tLo - RED5_MA_MAT_RANGE_TOL_C || tMa > tHi + RED5_MA_MAT_RANGE_TOL_C) {
        flags.push('mat_outside_oa_ra');
    }

    const dT = tOa - tRa;
    const dW = wOa - wRa;
    let fT = null, fW = null;
    if (Math.abs(dT) >= RED5_MA_MIN_DT_C) fT = (tMa - tRa) / dT;
    if (Math.abs(dW) >= RED5_MA_MIN_DW) fW = (wMa - wRa) / dW;

    let deviation = null;
    let lineTol = RED5_MA_LINE_TOL_GKG;
    let fMeas = fT != null ? fT : fW;
    if (fT != null) {
        const f = Math.max(0, Math.min(1, fT));
        deviation = (wMa - (f * wOa + (1 - f) * wRa)) * 1000;
    } else {
        lineTol = RED5_MA_CLOSE_LINE_TOL_GKG;
        deviation = red5ChordWResidualGkg(oa, ra, ma);
        if (fW != null) {
            const f = Math.max(0, Math.min(1, fW));
            const tPred = f * tOa + (1 - f) * tRa;
            if (Math.abs(tMa - tPred) > RED5_MA_TEMP_LINE_TOL_C) {
                flags.push('off_mixing_line');
            }
        }
    }
    if (deviation != null && Math.abs(deviation) > lineTol
        && flags.indexOf('off_mixing_line') < 0) {
        flags.push('off_mixing_line');
    }
    const frac = red5ChordOffFraction(oa, ra, ma);
    if (frac != null && frac > RED5_MA_CHORD_FRAC_TOL
        && flags.indexOf('off_mixing_line') < 0) {
        flags.push('off_mixing_line');
    }

    const srv = (ahu && ahu.mixing) || {};
    let oadFrac = (typeof srv.oa_fraction_damper === 'number') ? srv.oa_fraction_damper : red5ReadOadFraction(ahu);
    let mismatch = (typeof srv.damper_mismatch === 'number') ? srv.damper_mismatch : null;
    if (mismatch == null && oadFrac != null && fMeas != null) {
        const fClamp = Math.max(0, Math.min(1, fMeas));
        mismatch = Math.abs(fClamp - oadFrac);
    }
    if (mismatch != null && mismatch > RED5_MA_DAMPER_TOL && flags.indexOf('damper_mismatch') < 0) {
        flags.push('damper_mismatch');
    }

    return {
        flags,
        line_deviation_g_kg: deviation == null ? null : Math.round(deviation * 100) / 100,
        damper_mismatch: mismatch == null ? null : Math.round(mismatch * 1000) / 1000,
        oa_fraction_damper: oadFrac,
        chord_off_fraction: frac == null ? null : Math.round(frac * 1000) / 1000,
    };
}

function resolveMaMixing(ahu) {
    const srv = (ahu && ahu.mixing) || {};
    const cli = clientMaMixingFromPoints(ahu);
    const flagSet = {};
    (srv.flags || []).forEach((f) => { flagSet[f] = true; });
    (cli.flags || []).forEach((f) => { flagSet[f] = true; });
    const flags = Object.keys(flagSet);
    return {
        basis: srv.basis || (ahu && ahu.points && (ahu.points.find(p => p.label === 'MA') || {}).basis) || null,
        oa_fraction: srv.oa_fraction,
        oa_fraction_raw: srv.oa_fraction_raw,
        oa_fraction_temp: srv.oa_fraction_temp,
        oa_fraction_humidity: srv.oa_fraction_humidity,
        oa_fraction_damper: srv.oa_fraction_damper != null ? srv.oa_fraction_damper : cli.oa_fraction_damper,
        damper_mismatch: srv.damper_mismatch != null ? srv.damper_mismatch : cli.damper_mismatch,
        line_deviation_g_kg: srv.line_deviation_g_kg != null ? srv.line_deviation_g_kg : cli.line_deviation_g_kg,
        flags,
    };
}

function maFaultTipModel(ahuOrMixing, opts) {
    opts = opts || {};
    let mx;
    if (ahuOrMixing && Array.isArray(ahuOrMixing.points)) {
        mx = resolveMaMixing(ahuOrMixing);
    } else if (opts.ahu) {
        mx = resolveMaMixing(Object.assign({}, opts.ahu, { mixing: ahuOrMixing || opts.ahu.mixing }));
    } else {
        mx = ahuOrMixing || {};
    }
    const flags = Array.isArray(mx.flags) ? mx.flags.slice() : [];
    if (!flags.length) return null;
    const cat = classifyMaFault(mx, opts);
    if (!cat) return null;
    const info = MA_FAULT_CATALOG[cat] || MA_FAULT_CATALOG.H;
    return {
        cat,
        flags,
        flagText: flags.join(' · '),
        pattern: info.pattern,
        points: info.points,
        why: info.why,
        needs: info.needs,
        needsExplain: info.needsExplain,
        lineDev: mx.line_deviation_g_kg,
        mismatch: mx.damper_mismatch,
    };
}

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

// Classify outdoor-air (T °C, RH %) → B1..B10.
// Exact CSV windows first; gap → nearest window *edge* among T-compatible
// bands (never hard B5, never nearest-*center*).
//
// Why edge, not center: OA 16.1 °C / 73 % RH sits 0.1 °C above B2's old
// ceiling. Center-distance snapped to B7 ("hot and sticky") because B7's
// RH mid matched — a total lie next to live OAT. Edge-distance stays on B2.
// T_MARGIN also rejects bands whose dry-bulb window cannot contain OA.
//
// B3 (mild-dry) is listed before B2 so dry 15-18 °C stays B3 after B2's
// ceiling moved to 18 °C (closes the cool-humid hairline gap).
const BAND_WINDOWS = [
    { id: 'B1',  t: [-50, 5],  rh: [0, 100] },
    { id: 'B3',  t: [15, 22],  rh: [0, 35] },
    { id: 'B2',  t: [5, 18],   rh: [0, 100] },
    { id: 'B4',  t: [18, 23],  rh: [32, 55] },
    { id: 'B5',  t: [22, 26],  rh: [40, 70] },
    { id: 'B6',  t: [25, 28],  rh: [45, 70] },
    // B10 before B7/B8 so extreme-humid wins over warm-hum on overlap.
    { id: 'B10', t: [28, 50],  rh: [80, 100] },
    { id: 'B7',  t: [26, 36],  rh: [45, 90] },
    { id: 'B8',  t: [32, 45],  rh: [65, 100] },
    { id: 'B9',  t: [25, 50],  rh: [0, 50] },
];

/** Recipe OAD % per band — keep in lockstep with band_guide.csv. */
const BAND_OAD = {
    B1: 15, B2: 15, B3: 30, B4: 100, B5: 100,
    B6: 50, B7: 15, B8: 15, B9: 15, B10: 15, '?': 15,
};

/** Max °C outside a band's T window still allowed for NEAREST fallback. */
const BAND_T_MARGIN = 5;

/** Humidity ratio g/kg dry air (Magnus, P=101325 Pa). */
const bandHumidityRatio_gkg = (t, rh) => {
    if (!Number.isFinite(t) || !Number.isFinite(rh)) return NaN;
    const pws = 610.94 * Math.exp((17.625 * t) / (t + 243.04));
    const pw = (rh / 100) * pws;
    return 0.622 * pw / (101325 - pw) * 1000;
};

/** Classify OA (T °C, RH %) → { id, exact }.
 *  Exact window match first; otherwise nearest window edge among bands
 *  that are T-compatible AND not economizer/pass-through (OAD < 100).
 *  Gap fallback must never invent 100 % OA. If nothing qualifies → '?'. */
const bandClassify = (t, rh) => {
    if (!Number.isFinite(t) || !Number.isFinite(rh)) return { id: '?', exact: false };
    for (let i = 0; i < BAND_WINDOWS.length; i++) {
        const b = BAND_WINDOWS[i];
        if (t >= b.t[0] && t <= b.t[1] && rh >= b.rh[0] && rh <= b.rh[1]) {
            return { id: b.id, exact: true };
        }
    }
    let best = null;
    let bestDist = Infinity;
    for (let j = 0; j < BAND_WINDOWS.length; j++) {
        const b2 = BAND_WINDOWS[j];
        if ((BAND_OAD[b2.id] || 0) >= 100) continue; // never invent free-cooling from a gap
        if (t < b2.t[0] - BAND_T_MARGIN || t > b2.t[1] + BAND_T_MARGIN) continue;
        const tClamp = Math.min(Math.max(t, b2.t[0]), b2.t[1]);
        const rhClamp = Math.min(Math.max(rh, b2.rh[0]), b2.rh[1]);
        const dist = Math.hypot(t - tClamp, rh - rhClamp);
        if (dist < bestDist) {
            bestDist = dist;
            best = b2.id;
        }
    }
    return { id: best || '?', exact: false };
};

const bandLabelOf = (t, rh) => bandClassify(t, rh).id;

/**
 * Operator-facing band advice. Classification alone is not enough:
 * B4/B5 exact windows still authorize 100 % OA when OA is wetter than RA.
 * Veto: if W_oa > W_ra + 1 g/kg, clamp advised OAD to 15 % and rewrite plan.
 */
const bandAdvise = (oaT, oaRh, raT, raRh) => {
    const cls = bandClassify(oaT, oaRh);
    const raw = bandStory(cls.id);
    let oad = BAND_OAD[cls.id] != null ? BAND_OAD[cls.id] : 15;
    let veto = null;
    const wOa = bandHumidityRatio_gkg(oaT, oaRh);
    const wRa = bandHumidityRatio_gkg(raT, raRh);
    if (Number.isFinite(wOa) && Number.isFinite(wRa) && wOa > wRa + 1.0 && oad > 15) {
        veto = {
            reason: 'OA wetter than RA',
            w_oa: wOa,
            w_ra: wRa,
            oad_before: oad,
        };
        oad = 15;
    }
    let weather = raw.weather;
    let plan = raw.plan;
    let set = raw.set.replace(/OA damper = [^|]+/, 'OA damper = ' + oad + ' %');
    if (!cls.exact && cls.id !== '?') {
        weather = 'OA is outside every exact band window — nearest T-compatible non-economizer recipe below. Live OA is NOT the band\'s named climate.';
    }
    if (veto) {
        plan = 'PSY VETO: outdoor air carries more moisture than return air (W_oa '
            + wOa.toFixed(1) + ' > W_ra ' + wRa.toFixed(1)
            + ' g/kg). Keep OA damper at minimum — do not free-cool / pass-through.';
        weather = (cls.exact ? raw.weather + ' ' : '')
            + 'However OA is wetter than RA, so the 100 % OA recipe is blocked.';
    }
    return {
        id: cls.id,
        exact: cls.exact,
        oad,
        veto,
        weather,
        plan,
        set,
    };
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
            weather: 'Freezing outside (under 5 deg C, any humidity). Think winter morning.',
            plan:    'Keep most outside air OUT. Heat the supply air to ~21 deg C and add a little moisture.',
            set:     'SA = 21.0 deg C @ 40 % RH   |   OA damper = 15 % (minimum)'
        };
        case 'B2': return {
            weather: 'Cool outside (5-18 deg C, any humidity). Think spring or fall.',
            plan:    'Bring in just enough outside air. Gentle heating.',
            set:     'SA = 19.5 deg C @ 35 % RH   |   OA damper = 15 %'
        };
        case 'B3': return {
            weather: 'Mild but dry outside (15-22 deg C, under 35 % RH). Think dry mild day.',
            plan:    'Open the damper a little to use the cool outside air. Add some moisture.',
            set:     'SA = 19.0 deg C @ 45 % RH   |   OA damper = 30 %'
        };
        case 'B4': return {
            weather: 'Outside air is almost perfect (18-23 deg C, 32-55 % RH).',
            plan:    'Open the damper WIDE and let the outside air do the cooling for free.',
            set:     'SA = 20.0 deg C @ 40 % RH   |   OA damper = 100 % (free cooling)'
        };
        case 'B5': return {
            weather: 'Outside feels like a comfortable room (22-26 deg C, 40-70 % RH).',
            plan:    'Blow outside air straight in. Almost no work for the AHU.',
            set:     'SA = 23.5 deg C @ 50 % RH   |   OA damper = 100 % (free cooling)'
        };
        case 'B6': return {
            weather: 'Outside is warm and a bit humid (25-28 deg C, 45-70 % RH).',
            plan:    'Mix some outside air with return air. Light cooling.',
            set:     'SA = 25.0 deg C @ 55 % RH   |   OA damper = 50 %'
        };
        case 'B7': return {
            weather: 'Outside is hot and sticky (26-36 deg C, 45-90 % RH). Typical summer.',
            plan:    'Close the damper. Subcool on the coil, then reheat to the delivery SA.',
            set:     'SA = 23.0 deg C @ 47 % RH (coil 12 deg C)   |   OA damper = 15 %'
        };
        case 'B8': return {
            weather: 'Very hot and very humid outside (32-45 deg C, over 65 % RH). Heat wave.',
            plan:    'Lock outside air out. Max cool + subcool dehumidify, then reheat.',
            set:     'SA = 22.0 deg C @ 54 % RH (coil 13 deg C)   |   OA damper = 15 %'
        };
        case 'B9': return {
            weather: 'Warm-to-hot but dry outside (over 25 deg C, under 50 % RH).',
            plan:    'Cool the air down -- do not waste energy removing humidity that is not there.',
            set:     'SA = 15.0 deg C @ 40 % RH   |   OA damper = 15 %'
        };
        case 'B10': return {
            weather: 'Tropical outside (over 28 deg C, over 80 % RH). Air feels like soup.',
            plan:    'Close the damper tight. Extreme subcool dehumidify, then reheat.',
            set:     'SA = 22.0 deg C @ 47 % RH (coil 11 deg C)   |   OA damper = 15 %'
        };
        default:   return {  // '?' -- sensor offline / NaN
            weather: 'Outside conditions do not match any of the 10 pre-tuned bands.',
            plan:    'AHU should run in SAFE-MODE: ASHRAE 55 Cat A defaults until weather moves back into a band.',
            set:     'SA = 21.0 deg C @ 50 % RH   |   OA damper = minimum for indoor air quality   |   economizer ON when outside is cooler than inside'
        };
    }
};

/* ------------------------------------------------------------------
 * renderProcessMiniBadge — overview-slide OA–MA–SA / RA sketch.
 * Auto-frames the plot so the OA/RA/MA/SA cluster sits in the middle
 * (not a fixed 5–50 °C window). Light plot, saturation curve, purple
 * enthalpy diagonals through OA/RA/SA (RA bold), green RH band only.
 * Point colours (fixed — match operator request / live chart intent):
 *   OA darker blue · RA pinkish-red · SA darker green · MA black with yellow ring.
 *   State dots/rings 20% transparent (opacity 0.80), including MA yellow ring.
 *   OA/RA/MA/SA labels 10% transparent (opacity 0.90).
 * Click the plot to pick a focus point; slider / wheel zooms that section
 * (leftmost = Off). Double-click resets. No magnifying-glass chrome —
 * the plot itself enlarges around the selected point.
 * MUST be invoked on every App render (even with ahu=null) so its React
 * hooks stay at a stable call index — gating the call behind selectedAhuId
 * caused "React Rendering Crash Prevented" (hooks count flip).
 * Ctx: { ahu, theme, sweetSpotRange, showSweetSpot, T_MIN, T_MAX }
 * ------------------------------------------------------------------ */
function renderProcessMiniBadge(ctx) {
    /* Hooks first — this helper is invoked during App render like a component. */
    const VW = 440, VH = 248;
    const [focus, setFocus] = React.useState(null); /* { cx, cy } in SVG user units */
    const [lastFocus, setLastFocus] = React.useState({ cx: VW * 0.56, cy: VH * 0.60 });
    const [zoom, setZoom] = React.useState(1.0); /* 1.0 = Off */
    const [dragging, setDragging] = React.useState(false);
    const dragRef = React.useRef(null);
    const magOn = zoom > 1.001 && !!focus;

    const { ahu, theme, sweetSpotRange, showSweetSpot } = ctx || {};
    if (!ahu || !ahu.points) return null;
    const by = {};
    (ahu.points || []).forEach((p) => { if (p && p.label) by[p.label] = p; });
    const OA = by.OA, RA = by.RA, SA = by.SA, MA = by.MA;
    if (!OA || !RA || !SA) return null;

    const _maFault = (MA && typeof maFaultTipModel === 'function')
        ? maFaultTipModel(ahu, {})
        : null;
    const _maOff = !!_maFault;

    const rhLo = (sweetSpotRange && Number.isFinite(sweetSpotRange.lo)) ? sweetSpotRange.lo : 40;
    const rhHi = (sweetSpotRange && Number.isFinite(sweetSpotRange.hi)) ? sweetSpotRange.hi : 60;
    const drawBand = showSweetSpot !== false;
    const _getW = (typeof getW === 'function') ? getW : null;
    const _getH = (typeof getH === 'function') ? getH : null;

    /* Auto-frame around OA/RA/MA/SA — cluster midpoint = plot center. */
    const cluster = [OA, RA, SA].concat(MA ? [MA] : []);
    let tLo = Infinity, tHi = -Infinity, wLo = Infinity, wHi = -Infinity;
    cluster.forEach((p) => {
        const t = Number(p.t), w = Number(p.w);
        if (Number.isFinite(t)) { tLo = Math.min(tLo, t); tHi = Math.max(tHi, t); }
        if (Number.isFinite(w)) { wLo = Math.min(wLo, w); wHi = Math.max(wHi, w); }
    });
    if (!Number.isFinite(tLo)) { tLo = 15; tHi = 25; }
    if (!Number.isFinite(wLo)) { wLo = 0.006; wHi = 0.012; }
    const tMid = (tLo + tHi) / 2;
    const wMid = (wLo + wHi) / 2;
    /* Half-span: ≥ ~1.4× data span, with floor so a tight cluster still has air. */
    const tHalf = Math.max((tHi - tLo) * 1.4, 6);
    const wHalf = Math.max((wHi - wLo) * 1.5, 0.003);
    let tMin = tMid - tHalf;
    let tMax = tMid + tHalf;
    let wMin = wMid - wHalf;
    let wMax = wMid + wHalf;
    if (wMin < 0) { wMax -= wMin; wMin = 0; }

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

    /* Green RH band (lo–hi isopleths) — clip to visible dry-bulb window. */
    let bandPts = '';
    let tBandLo = 20, tBandHi = 27;
    if (drawBand && _getW) {
        const top = [], bot = [];
        tBandLo = Math.max(tMin, 18);
        tBandHi = Math.min(tMax, 28);
        if (tBandHi > tBandLo + 0.4) {
            for (let tt = tBandLo; tt <= tBandHi + 1e-9; tt += 0.35) {
                top.push([tt, Math.min(wMax, Math.max(wMin, _getW(tt, rhHi)))]);
            }
            for (let tt = tBandHi; tt >= tBandLo - 1e-9; tt -= 0.35) {
                bot.push([tt, Math.min(wMax, Math.max(wMin, _getW(tt, rhLo)))]);
            }
            bandPts = top.concat(bot).map(([t, w]) =>
                xOf(t).toFixed(1) + ',' + yOf(w).toFixed(1)
            ).join(' ');
        }
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
    const colOA = RED5_POINT_COLORS.OA; /* bluish — outdoor */
    const colRA = RED5_POINT_COLORS.RA; /* pinkish red — return */
    const colSA = RED5_POINT_COLORS.SA; /* green — supply */
    const colMA = (typeof RED5_MA_FILL === 'string' ? RED5_MA_FILL : '#0f172a');
    const colMARing = (typeof RED5_MA_RING === 'string' ? RED5_MA_RING : RED5_POINT_COLORS.MA);
    const dotOp = 0.80;          /* 20% transparent fill + ring (incl. MA yellow) */
    const labelOp = 0.90;        /* 10% transparent OA/RA/MA/SA labels */
    const colBand = '#047857';  /* overview green for RH band + mix line only */
    const colH = '#6d28d9';
    const colSat = '#1d4ed8';
    const cardBg = '#ffffff';
    const cardBd = '#cbd5e1';
    const titleC = '#334155';
    const axisC = '#334155';
    const arrId = 'pmini-arr-' + String(ahu.id || 'x').replace(/[^a-zA-Z0-9_-]/g, '_');
    void theme; /* badge is always light; ignore dashboard dark theme inheritance */

    /* RH-band label near the left edge of the visible band polygon */
    const tBandLabel = tBandLo + Math.min(2.5, (tBandHi - tBandLo) * 0.35);
    const bandLabelX = xOf(tBandLabel);
    const bandLabelY = _getW
        ? yOf((_getW(tBandLabel, rhLo) + _getW(tBandLabel, rhHi)) / 2) + 4
        : (TOP + gh * 0.55);

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

    /* Zoom the plot itself around the focus (no circular loupe overlay). */
    const vbW = magOn ? VW / zoom : VW;
    const vbH = magOn ? VH / zoom : VH;
    let vbX = magOn ? focus.cx - vbW / 2 : 0;
    let vbY = magOn ? focus.cy - vbH / 2 : 0;
    if (magOn) {
        vbX = Math.max(-VW * 0.15, Math.min(VW - vbW + VW * 0.15, vbX));
        vbY = Math.max(-VH * 0.15, Math.min(VH - vbH + VH * 0.15, vbY));
    }

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
            <line x1={ox} y1={oy} x2={rx} y2={ry}
                  stroke={_maOff ? '#ef4444' : colBand} strokeWidth={_maOff ? 2.8 : 2.2}
                  strokeDasharray="6 4" />
            <line x1={mx} y1={my} x2={sx} y2={sy} stroke={colSA} strokeWidth="2.6"
                  markerEnd={'url(#' + arrId + ')'} />
            <circle cx={ox} cy={oy} r="6.5" fill={colOA} fillOpacity={dotOp} stroke={colOA} strokeOpacity={dotOp} strokeWidth="1.6" />
            <text x={ox + 10} y={oy - 6} fill={colOA} fillOpacity={labelOp} style={{ fill: colOA, fillOpacity: labelOp }}
                  fontSize="13" fontWeight="800" fontFamily="system-ui,sans-serif">OA</text>
            <circle cx={rx} cy={ry} r="6.5" fill={colRA} fillOpacity={dotOp} stroke={colRA} strokeOpacity={dotOp} strokeWidth="1.6" />
            <text x={rx + 8} y={ry + 18} fill={colRA} fillOpacity={labelOp} style={{ fill: colRA, fillOpacity: labelOp }}
                  fontSize="13" fontWeight="800" fontFamily="system-ui,sans-serif">RA</text>
            <circle cx={mx} cy={my} r="6" fill={colMA} fillOpacity={dotOp}
                    stroke={_maOff ? '#ef4444' : colMARing} strokeOpacity={dotOp}
                    strokeWidth={_maOff ? 3.2 : 2.5} />
            <text x={mx + 9} y={my - 7}
                  fill={_maOff ? '#ef4444' : colMARing} fillOpacity={labelOp}
                  style={{ fill: _maOff ? '#ef4444' : colMARing, fillOpacity: labelOp }}
                  fontSize="13" fontWeight="800" fontFamily="system-ui,sans-serif">
                {_maOff ? ('MA·' + _maFault.cat) : 'MA'}
            </text>
            <circle cx={sx} cy={sy} r="6.5" fill={colSA} fillOpacity={dotOp} stroke={colSA} strokeOpacity={dotOp} strokeWidth="1.6" />
            <text x={sx - 26} y={sy - 8} fill={colSA} fillOpacity={labelOp} style={{ fill: colSA, fillOpacity: labelOp }}
                  fontSize="13" fontWeight="800" fontFamily="system-ui,sans-serif">SA</text>
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
                title="Show OA–MA–SA / RA process sketch (auto-framed on state points)"
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
                           title="Zoom selected section — slide fully left to turn off"
                           onMouseDown={(e) => e.stopPropagation()}>
                        <span style={{ color: '#64748b' }}>{zoom <= 1.001 ? 'Off' : (zoom.toFixed(1) + '\u00D7')}</span>
                        <input type="range" min="1" max="4.5" step="0.1" value={zoom}
                               data-testid="process-mini-zoom"
                               onChange={(e) => {
                                   const z = Number(e.target.value);
                                   setZoom(z);
                                   if (z <= 1.001) {
                                       if (focus) setLastFocus(focus);
                                       setFocus(null);
                                   } else if (!focus) {
                                       setFocus(lastFocus);
                                   }
                               }}
                               style={{ width: 72, accentColor: '#1e3a8a', cursor: 'pointer' }} />
                    </label>
                </div>
                <svg viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`} width={VW} height={VH} aria-hidden="true"
                     data-testid="process-mini-svg"
                     style={{ color: '#0f172a', display: 'block', cursor: magOn ? 'grab' : 'crosshair', touchAction: 'none' }}
                     onClick={(e) => {
                         if (dragging || (dragRef.current && dragRef.current.moved)) {
                             dragRef.current = null;
                             return;
                         }
                         if (e.detail >= 2) {
                             if (focus) setLastFocus(focus);
                             setFocus(null);
                             setZoom(1);
                             return;
                         }
                         const loc = svgToLocal(e.currentTarget, e.clientX, e.clientY);
                         if (!loc) return;
                         setFocus(loc);
                         setLastFocus(loc);
                         if (zoom <= 1.001) setZoom(2.2);
                     }}
                     onWheel={(e) => {
                         e.preventDefault();
                         e.stopPropagation();
                         const dy = e.deltaY;
                         setZoom((z) => {
                             const next = Math.max(1, Math.min(4.5, z + (dy < 0 ? 0.15 : -0.15)));
                             if (next <= 1.001) {
                                 setFocus((cur) => { if (cur) setLastFocus(cur); return null; });
                             } else {
                                 setFocus((cur) => {
                                     if (cur) return cur;
                                     const loc = svgToLocal(e.currentTarget, e.clientX, e.clientY);
                                     const place = loc || lastFocus;
                                     setLastFocus(place);
                                     return place;
                                 });
                             }
                             return next;
                         });
                     }}
                     onMouseDown={(e) => {
                         e.stopPropagation();
                         if (!magOn || e.button !== 0) return;
                         dragRef.current = {
                             x: e.clientX,
                             y: e.clientY,
                             cx: focus.cx,
                             cy: focus.cy,
                             moved: false,
                         };
                         setDragging(true);
                     }}
                     onMouseMove={(e) => {
                         if (!dragging || !dragRef.current || !focus) return;
                         const sx = vbW / VW;
                         const sy = vbH / VH;
                         const dx = (e.clientX - dragRef.current.x) * sx;
                         const dy = (e.clientY - dragRef.current.y) * sy;
                         if (Math.abs(dx) + Math.abs(dy) > 0.5) dragRef.current.moved = true;
                         const next = {
                             cx: Math.max(8, Math.min(VW - 8, dragRef.current.cx - dx)),
                             cy: Math.max(8, Math.min(VH - 8, dragRef.current.cy - dy)),
                         };
                         setFocus(next);
                         setLastFocus(next);
                     }}
                     onMouseUp={() => { setDragging(false); }}
                     onMouseLeave={() => { setDragging(false); dragRef.current = null; }}
                >
                    <defs>
                        <marker id={arrId} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                            <path d="M0,0 L7,3.5 L0,7 Z" fill={colSA} />
                        </marker>
                    </defs>
                    {chartLayers}
                </svg>
                <div className="px-1 pt-1 text-[8px] font-mono" style={{ color: '#94a3b8' }}>
                    {magOn
                        ? 'Drag to pan · scroll/slider zoom · left=Off · double-click clears'
                        : 'Slider left = Off · click plot or raise zoom to magnify'}
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 px-1 pt-1 font-mono text-[11px] font-extrabold leading-tight">
                    <div style={{ color: colOA }}>OA {fmt(OA)}</div>
                    <div style={{ color: colRA }}>RA {fmt(RA)}</div>
                    <div style={{ color: colMARing }}>MA {MA ? fmt(MA) : '—'}</div>
                    <div style={{ color: colSA }}>SA {fmt(SA)}</div>
                </div>
            </div>
        </details>
    );
}
