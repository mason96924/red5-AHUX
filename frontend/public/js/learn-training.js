// Comfort Decoded — interactive training for /learn.html
// Slide facts stay aligned with Psychart-HVAC-ASHRAE-Overview.html.
// Math comes from psychrometric.js (getW / getH) so the dots match the dashboard.
(function () {
    'use strict';

    if (typeof getW !== 'function' || typeof getH !== 'function') return;

    const NS = 'http://www.w3.org/2000/svg';
    const el = (tag, attrs, text) => {
        const e = document.createElementNS(NS, tag);
        for (const k in attrs) e.setAttribute(k, attrs[k]);
        if (text !== undefined) e.textContent = text;
        return e;
    };

    function wFromH(t, h) {
        return (h - 1.006 * t) / (2501 + 1.86 * t);
    }

    // MA fault categories A–H — same catalog as dashboard-helpers.js
    const MA_FAULT_CATALOG = {
        A: {
            pattern: 'Off-chord + small damper_mismatch',
            points: 'Sensor / probe (MAT or MAH)',
            why: 'Mix fraction matches OAD; moisture does not match T-lever'
        },
        B: {
            pattern: 'Off-chord + large damper_mismatch',
            points: 'Economizer / damper / leakage / stratification',
            why: 'Commanded OA% ≠ actual mix fraction'
        },
        C: {
            pattern: 'MAT outside OA–RA range (f < 0 or > 1)',
            points: 'Sensor bias or stratification',
            why: 'A mixing box cannot produce MAT hotter or colder than both parents'
        },
        D: {
            pattern: 'Off-chord wetter than mix; OAD ≈ minimum',
            points: 'Unmeasured moisture / EA path / duct leak',
            why: 'Extra water mass not explained by OA–RA mix'
        },
        E: {
            pattern: 'Plotted OA ≠ air entering the mixing box',
            points: 'ERV / HRV',
            why: 'Wheel moves OA toward RA before mixing'
        },
        F: {
            pattern: 'Off-chord only when wheel ON; gone when OFF',
            points: 'ERV / HRV',
            why: 'Controlled A/B confirms transfer, not sensor'
        },
        G: {
            pattern: 'Off-chord mainly at high OAD / economizer high',
            points: 'Economizer leakage / nonlinear damper / bypass',
            why: 'Mixing imperfect at extreme positions'
        },
        H: {
            pattern: 'Persistent bias independent of OAD & wheel',
            points: 'Sensor drift (OA, RA, or MA)',
            why: 'Not explained by process mode'
        }
    };

    const RED5_MA_LINE_TOL_GKG = 0.4;
    const RED5_MA_CLOSE_LINE_TOL_GKG = 0.2;
    const RED5_MA_CHORD_FRAC_TOL = 0.025;
    const RED5_MA_TEMP_LINE_TOL_C = 0.5;
    const RED5_MA_MAT_RANGE_TOL_C = 0.3;
    const RED5_MA_MIN_DT_C = 2.0;
    const RED5_MA_MIN_DW = 1.0e-4;
    const RED5_MA_DAMPER_TOL = 0.20;

    function chordWResidualGkg(oa, ra, ma) {
        const ax = oa.t, ay = oa.w * 1000;
        const bx = ra.t, by = ra.w * 1000;
        const cx = ma.t, cy = ma.w * 1000;
        const abx = bx - ax, aby = by - ay;
        const ab2 = abx * abx + aby * aby;
        if (ab2 < 1e-12) return cy - ay;
        const t = ((cx - ax) * abx + (cy - ay) * aby) / ab2;
        return cy - (ay + t * aby);
    }

    function chordOffFraction(oa, ra, ma) {
        const ax = oa.t, ay = oa.w * 1000;
        const bx = ra.t, by = ra.w * 1000;
        const cx = ma.t, cy = ma.w * 1000;
        const abx = bx - ax, aby = by - ay;
        const ab2 = abx * abx + aby * aby;
        if (ab2 < 1e-12) return null;
        const cross = abx * (cy - ay) - aby * (cx - ax);
        return Math.abs(cross) / ab2;
    }

    function projectOnChord(oa, ra, ma) {
        const ax = oa.t, ay = oa.w;
        const bx = ra.t, by = ra.w;
        const abx = bx - ax, aby = by - ay;
        const ab2 = abx * abx + aby * aby;
        if (ab2 < 1e-16) return { t: ax, w: ay, f: 0 };
        const u = ((ma.t - ax) * abx + (ma.w - ay) * aby) / ab2;
        return { t: ax + u * abx, w: ay + u * aby, f: 1 - u };
    }

    function classifyMaFault(mixing) {
        const mx = mixing || {};
        const flags = Array.isArray(mx.flags) ? mx.flags : [];
        if (!flags.length) return null;
        const off = flags.indexOf('off_mixing_line') >= 0;
        const outside = flags.indexOf('mat_outside_oa_ra') >= 0;
        const dampMis = flags.indexOf('damper_mismatch') >= 0;
        const oad = (typeof mx.oa_fraction_damper === 'number') ? mx.oa_fraction_damper : null;
        const mismatch = (typeof mx.damper_mismatch === 'number') ? mx.damper_mismatch : null;
        const dev = (typeof mx.line_deviation_g_kg === 'number') ? mx.line_deviation_g_kg : null;
        if (outside) return 'C';
        if (off && dampMis) return 'B';
        if (off && oad != null && oad <= 0.15 && dev != null && dev > 0) return 'D';
        if (off && oad != null && oad >= 0.70) return 'G';
        if (off && (mismatch == null || mismatch <= 0.20)) return 'A';
        if (off) return 'H';
        if (dampMis) return 'B';
        return 'H';
    }

    function mixingFromPoints(oa, ra, ma, commandedOa) {
        const empty = {
            flags: [], line_deviation_g_kg: null, damper_mismatch: null,
            oa_fraction_damper: commandedOa, chord_off_fraction: null, oa_fraction_t: null
        };
        const tOa = oa.t, tRa = ra.t, tMa = ma.t;
        const wOa = oa.w, wRa = ra.w, wMa = ma.w;
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
        const fMeas = fT != null ? fT : fW;
        if (fT != null) {
            const f = Math.max(0, Math.min(1, fT));
            deviation = (wMa - (f * wOa + (1 - f) * wRa)) * 1000;
        } else {
            lineTol = RED5_MA_CLOSE_LINE_TOL_GKG;
            deviation = chordWResidualGkg(oa, ra, ma);
            if (fW != null) {
                const f = Math.max(0, Math.min(1, fW));
                const tPred = f * tOa + (1 - f) * tRa;
                if (Math.abs(tMa - tPred) > RED5_MA_TEMP_LINE_TOL_C) flags.push('off_mixing_line');
            }
        }
        if (deviation != null && Math.abs(deviation) > lineTol
            && flags.indexOf('off_mixing_line') < 0) {
            flags.push('off_mixing_line');
        }
        const frac = chordOffFraction(oa, ra, ma);
        if (frac != null && frac > RED5_MA_CHORD_FRAC_TOL
            && flags.indexOf('off_mixing_line') < 0) {
            flags.push('off_mixing_line');
        }
        let mismatch = null;
        if (commandedOa != null && fMeas != null) {
            mismatch = Math.abs(Math.max(0, Math.min(1, fMeas)) - commandedOa);
        }
        if (mismatch != null && mismatch > RED5_MA_DAMPER_TOL) flags.push('damper_mismatch');
        return {
            flags, line_deviation_g_kg: deviation, damper_mismatch: mismatch,
            oa_fraction_damper: commandedOa, chord_off_fraction: frac, oa_fraction_t: fT
        };
    }

    const MIX0 = 0.30;
    const SEED = {
        oa: { t: 33, w: 0.018 },
        ra: { t: 24, w: getW(24, 50) },
        sa: { t: 14, w: 0.0084 }
    };
    const PT_A = { t: 22, w: getW(22, 90), label: 'A 60', color: '#fb7185' };
    const PT_B = { t: 28, w: getW(28, 10), label: 'B 34', color: '#f97316' };
    PT_A.h = getH(PT_A.t, PT_A.w);
    PT_B.h = getH(PT_B.t, PT_B.w);

    const live = {
        oa: { t: SEED.oa.t, w: SEED.oa.w, label: 'OA', color: '#f97316' },
        ra: { t: SEED.ra.t, w: SEED.ra.w, label: 'RA', color: '#10b981' },
        ma: { t: 0, w: 0, label: 'MA', color: '#e2e8f0' },
        sa: { t: SEED.sa.t, w: SEED.sa.w, label: 'SA', color: '#3b82f6' },
        mixFrac: MIX0,
        maSnapped: true
    };

    function stampH(p) {
        p.h = getH(p.t, p.w);
        return p;
    }

    function clipPoint(fr, t, w) {
        const tt = Math.max(fr.T_MIN, Math.min(fr.T_MAX, t));
        const ww = Math.max(fr.W_MIN, Math.min(fr.W_MAX, Math.min(w, fr.satW(tt))));
        return { t: tt, w: ww };
    }

    function placeMaOnMix() {
        live.ma.t = live.ra.t * (1 - live.mixFrac) + live.oa.t * live.mixFrac;
        live.ma.w = live.ra.w * (1 - live.mixFrac) + live.oa.w * live.mixFrac;
        live.maSnapped = true;
        stampH(live.ma);
    }

    function resetLive() {
        live.oa.t = SEED.oa.t;
        live.oa.w = SEED.oa.w;
        live.ra.t = SEED.ra.t;
        live.ra.w = SEED.ra.w;
        live.sa.t = SEED.sa.t;
        live.sa.w = SEED.sa.w;
        live.mixFrac = MIX0;
        placeMaOnMix();
        stampH(live.oa);
        stampH(live.ra);
        stampH(live.sa);
    }

    resetLive();

    function liveMixing() {
        return mixingFromPoints(live.oa, live.ra, live.ma, live.mixFrac);
    }

    function paintMaStatus(node) {
        if (!node) return;
        const mx = liveMixing();
        const cat = classifyMaFault(mx);
        const oaPct = Math.round(live.mixFrac * 100);
        if (!cat) {
            node.hidden = false;
            node.dataset.cat = '';
            node.innerHTML = '<strong>MA on the mixing line</strong> · commanded '
                + oaPct + '% OA. Drag MA off the dashed chord to raise a fault.';
            return;
        }
        const spec = MA_FAULT_CATALOG[cat];
        const dev = mx.line_deviation_g_kg;
        const devTxt = (dev != null && Number.isFinite(dev))
            ? ' Residual ' + (dev >= 0 ? '+' : '') + dev.toFixed(1) + ' g/kg.'
            : '';
        node.hidden = false;
        node.dataset.cat = cat;
        node.innerHTML = '<span class="train-cat">MA [' + cat + ']</span> <strong>'
            + spec.points + '</strong><br>' + spec.pattern + ' — ' + spec.why + '.' + devTxt;
    }

    function highlightFaultRef(cat) {
        const host = document.getElementById('read-fault-ref');
        if (!host) return;
        host.querySelectorAll('.train-fault-item').forEach((row) => {
            const on = !!cat && row.dataset.cat === cat;
            row.classList.toggle('is-live', on);
            if (on) row.setAttribute('aria-current', 'true');
            else row.removeAttribute('aria-current');
        });
    }

    let readSync = null;
    let econSync = null;

    function broadcast() {
        stampH(live.oa);
        stampH(live.ra);
        stampH(live.ma);
        stampH(live.sa);
        if (readSync) readSync();
        if (econSync) econSync();
        paintMaStatus(document.getElementById('read-ma-status'));
        paintMaStatus(document.getElementById('econ-ma-status'));
        highlightFaultRef(classifyMaFault(liveMixing()));
        const cap = document.getElementById('read-caption');
        if (cap) {
            cap.innerHTML = '<b>OA</b> outside air · <b>RA</b> return air · <b>MA</b> the mixture entering the coil · <b>SA</b> supply air delivered to the rooms. '
                + 'Dashed green = mixing; solid blue = the cooling coil. '
                + 'The <span class="en">violet diagonals</span> are lines of equal total energy: outside air here holds '
                + Math.round(live.oa.h) + ' kJ/kg against return air’s ' + Math.round(live.ra.h)
                + (live.oa.h > live.ra.h + 1
                    ? ', so it sits above RA’s line and costs more to condition — no free cooling.'
                    : ', so OA is at or below RA’s energy — economizer territory.');
        }
    }

    function makeFrame(svg, opts) {
        const W = 1100, H = 560;
        const PAD = { top: 28, right: 108, bottom: 52, left: 58 };
        const T_MIN = opts.tMin, T_MAX = opts.tMax;
        const W_MIN = 0, W_MAX = opts.wMax;
        const tToX = (t) => PAD.left + ((t - T_MIN) / (T_MAX - T_MIN)) * (W - PAD.left - PAD.right);
        const wToY = (w) => H - PAD.bottom - ((w - W_MIN) / (W_MAX - W_MIN)) * (H - PAD.top - PAD.bottom);
        const xToT = (x) => T_MIN + ((x - PAD.left) / (W - PAD.left - PAD.right)) * (T_MAX - T_MIN);
        const yToW = (y) => W_MIN + ((H - PAD.bottom - y) / (H - PAD.top - PAD.bottom)) * (W_MAX - W_MIN);
        const satW = (t) => Math.min(W_MAX, getW(t, 100));
        const xy = (t, w) => `${tToX(t)},${wToY(w)}`;

        function enthalpyPts(h, t0, t1, step) {
            const pts = [];
            const dir = t1 >= t0 ? 1 : -1;
            const eps = step * 0.51;
            for (let t = t0; dir > 0 ? t <= t1 + eps : t >= t1 - eps; t += dir * step) {
                const tt = Math.max(Math.min(t, Math.max(t0, t1)), Math.min(t0, t1));
                const w = wFromH(tt, h);
                const ws = satW(tt);
                if (w >= W_MIN && w <= ws) pts.push([tt, w]);
            }
            return pts;
        }

        function satIntersectT(h) {
            if (wFromH(T_MAX, h) > getW(T_MAX, 100)) return T_MAX;
            if (wFromH(T_MIN, h) <= getW(T_MIN, 100)) return T_MIN;
            let lo = T_MIN, hi = T_MAX;
            for (let i = 0; i < 28; i++) {
                const mid = (lo + hi) / 2;
                if (wFromH(mid, h) > getW(mid, 100)) lo = mid; else hi = mid;
            }
            return (lo + hi) / 2;
        }

        function poly(pts) {
            return pts.map((p) => xy(p[0], p[1])).join(' ');
        }

        function clientToTw(evt) {
            const pt = svg.createSVGPoint();
            pt.x = evt.clientX;
            pt.y = evt.clientY;
            const ctm = svg.getScreenCTM();
            if (!ctm) return null;
            const p = pt.matrixTransform(ctm.inverse());
            return { t: xToT(p.x), w: yToW(p.y) };
        }

        return { svg, W, H, PAD, T_MIN, T_MAX, W_MIN, W_MAX, tToX, wToY, satW, xy, enthalpyPts, satIntersectT, poly, clientToTw };
    }

    function drawBase(fr, parent, opts) {
        const g = el('g', { class: 'train-layer', 'data-layer': 'grid' });
        g.appendChild(el('rect', {
            x: fr.PAD.left, y: fr.PAD.top,
            width: fr.W - fr.PAD.left - fr.PAD.right,
            height: fr.H - fr.PAD.top - fr.PAD.bottom,
            fill: '#0d1426', rx: 4
        }));
        const rhLevels = opts.rh || [20, 40, 60, 80, 100];
        rhLevels.forEach((rh) => {
            const pts = [];
            for (let t = fr.T_MIN; t <= fr.T_MAX; t += 0.5) {
                const w = getW(t, rh);
                if (w >= fr.W_MIN && w <= fr.W_MAX) pts.push(fr.xy(t, w));
            }
            if (!pts.length) return;
            g.appendChild(el('polyline', {
                points: pts.join(' '),
                fill: 'none',
                stroke: rh === 100 ? '#1d4ed8' : '#243056',
                'stroke-width': rh === 100 ? 2.2 : 0.8,
                'stroke-dasharray': rh === 100 ? '' : '4 5'
            }));
        });
        for (let t = Math.ceil(fr.T_MIN / 5) * 5; t <= fr.T_MAX; t += 5) {
            g.appendChild(el('line', {
                x1: fr.tToX(t), y1: fr.PAD.top,
                x2: fr.tToX(t), y2: fr.H - fr.PAD.bottom,
                stroke: '#1a2440', 'stroke-width': 0.6
            }));
            g.appendChild(el('text', {
                x: fr.tToX(t), y: fr.H - fr.PAD.bottom + 18,
                fill: '#94a3b8', 'font-size': 11, 'text-anchor': 'middle',
                'font-family': 'monospace'
            }, String(t)));
        }
        g.appendChild(el('text', {
            x: (fr.W - fr.PAD.right + fr.PAD.left) / 2, y: fr.H - 12,
            fill: '#cbd5e1', 'font-size': 13, 'text-anchor': 'middle', 'font-weight': '700'
        }, 'Dry-bulb temperature  →'));
        for (let gkg = 0; gkg <= fr.W_MAX * 1000; gkg += 5) {
            const w = gkg / 1000;
            if (w > fr.W_MAX) continue;
            g.appendChild(el('text', {
                x: fr.W - fr.PAD.right + 10, y: fr.wToY(w) + 4,
                fill: '#94a3b8', 'font-size': 11, 'font-family': 'monospace'
            }, String(gkg)));
        }
        g.appendChild(el('text', {
            x: fr.W - 14, y: fr.H / 2,
            fill: '#cbd5e1', 'font-size': 13, 'font-weight': '700',
            'text-anchor': 'middle',
            transform: `rotate(90, ${fr.W - 14}, ${fr.H / 2})`
        }, 'Moisture in the air  ↑'));
        parent.appendChild(g);
        return g;
    }

    function drawSatLabel(fr, parent) {
        const t = Math.min(fr.T_MAX - 2, 36);
        const w = getW(t, 100);
        if (w > fr.W_MAX) return;
        parent.appendChild(el('text', {
            x: fr.tToX(t) + 6, y: fr.wToY(Math.min(w, fr.W_MAX)) + 4,
            fill: '#60a5fa', 'font-size': 11, 'font-weight': '800',
            'font-family': 'monospace'
        }, '100% RH (saturation)'));
    }

    function makeDot(fr, parent, key, p) {
        const g = el('g', { class: 'train-dot', 'data-pt': key });
        g.appendChild(el('circle', {
            class: 'train-hit',
            cx: fr.tToX(p.t), cy: fr.wToY(p.w), r: 16,
            fill: 'transparent', stroke: 'none'
        }));
        g.appendChild(el('circle', {
            class: 'train-mark',
            cx: fr.tToX(p.t), cy: fr.wToY(p.w), r: 7,
            fill: p.color, stroke: '#0b1220', 'stroke-width': 1.6
        }));
        g.appendChild(el('text', {
            class: 'train-dot-label',
            x: fr.tToX(p.t) + 10, y: fr.wToY(p.w) - 8,
            fill: p.color, 'font-size': 13, 'font-weight': '800',
            'font-family': 'monospace'
        }, p.label));
        parent.appendChild(g);
        return g;
    }

    function moveDot(fr, g, p, label) {
        const x = fr.tToX(p.t), y = fr.wToY(p.w);
        g.querySelectorAll('circle').forEach((c) => {
            c.setAttribute('cx', x);
            c.setAttribute('cy', y);
        });
        const mark = g.querySelector('.train-mark');
        if (mark) {
            mark.setAttribute('fill', p.color);
            mark.setAttribute('stroke', live.maSnapped || g.getAttribute('data-pt') !== 'MA' ? '#0b1220' : '#f43f5e');
            mark.setAttribute('stroke-width', g.getAttribute('data-pt') === 'MA' && !live.maSnapped ? '2.4' : '1.6');
        }
        const tx = g.querySelector('.train-dot-label');
        if (tx) {
            tx.setAttribute('x', x + 10);
            tx.setAttribute('y', y - 8);
            tx.setAttribute('fill', p.color);
            if (label) tx.textContent = label;
        }
    }

    function applyDrag(key, t, w, fr) {
        const clipped = clipPoint(fr, t, w);
        const prevMa = { t: live.ma.t, w: live.ma.w };
        if (key === 'OA' || key === 'RA') {
            const p = key === 'OA' ? live.oa : live.ra;
            p.t = clipped.t;
            p.w = clipped.w;
            if (live.maSnapped) {
                placeMaOnMix();
                live.sa.t += live.ma.t - prevMa.t;
                live.sa.w += live.ma.w - prevMa.w;
                const saC = clipPoint(fr, live.sa.t, live.sa.w);
                live.sa.t = saC.t;
                live.sa.w = saC.w;
            }
        } else if (key === 'SA') {
            live.sa.t = clipped.t;
            live.sa.w = clipped.w;
        } else if (key === 'MA') {
            live.ma.t = clipped.t;
            live.ma.w = clipped.w;
            const proj = projectOnChord(live.oa, live.ra, live.ma);
            const mx = mixingFromPoints(live.oa, live.ra, live.ma, live.mixFrac);
            const off = mx.flags.indexOf('off_mixing_line') >= 0
                || mx.flags.indexOf('mat_outside_oa_ra') >= 0;
            if (!off) {
                live.ma.t = proj.t;
                live.ma.w = proj.w;
                const dT = live.oa.t - live.ra.t;
                if (Math.abs(dT) >= RED5_MA_MIN_DT_C) {
                    live.mixFrac = Math.max(0, Math.min(1, (live.ma.t - live.ra.t) / dT));
                }
                live.maSnapped = true;
            } else {
                live.maSnapped = false;
            }
        }
        broadcast();
    }

    function bindDrag(svg, fr, keys) {
        let dragging = null;
        svg.addEventListener('pointerdown', (evt) => {
            const hit = evt.target.closest('[data-pt]');
            if (!hit) return;
            const key = hit.getAttribute('data-pt');
            if (keys.indexOf(key) < 0) return;
            dragging = key;
            svg.setPointerCapture(evt.pointerId);
            svg.classList.add('is-dragging');
            evt.preventDefault();
        });
        svg.addEventListener('pointermove', (evt) => {
            if (!dragging) return;
            const tw = fr.clientToTw(evt);
            if (!tw) return;
            applyDrag(dragging, tw.t, tw.w, fr);
        });
        const end = (evt) => {
            if (!dragging) return;
            dragging = null;
            svg.classList.remove('is-dragging');
            try { svg.releasePointerCapture(evt.pointerId); } catch (err) { /* already released */ }
        };
        svg.addEventListener('pointerup', end);
        svg.addEventListener('pointercancel', end);
        svg.addEventListener('dblclick', (evt) => {
            const hit = evt.target.closest('[data-pt]');
            if (hit && hit.getAttribute('data-pt') === 'MA') {
                placeMaOnMix();
                broadcast();
            }
        });
    }

    // =====================================================================
    // SLIDE 1 — How to read it
    // =====================================================================
    const READ_STEPS = [
        {
            id: 'all',
            chip: 'All',
            title: 'The whole picture',
            body: 'Four dots, two process lines, a comfort box and the equal-energy diagonals. Drag OA, RA, MA or SA — the mixing line and coil follow. Double-click MA to snap it back onto the chord.',
            layers: ['axes', 'sat', 'enthalpy', 'comfort', 'mix', 'coil', 'points']
        },
        {
            id: '1',
            chip: '1 · Axes',
            title: 'Two axes fix everything',
            body: 'Across is temperature; up is the actual weight of water the air carries. Pin both and the air’s state is pinned — relative humidity, dew point, wet-bulb and energy content all follow from that single dot.',
            layers: ['axes', 'points']
        },
        {
            id: '2',
            chip: '2 · Curve',
            title: 'The curve is a hard limit',
            body: 'It marks 100% humidity — air can never sit above it. Drive the dot onto the curve and water comes out: that is the dew point, a wet coil, a fogged window.',
            layers: ['sat']
        },
        {
            id: '3',
            chip: '3 · Mixing',
            title: 'Mixing is a straight line',
            body: 'Outside and return air blend to a point that must land on the line joining them. Drag MA along the dashed chord to change OA%; pull it off the line and the MA fault category lights up.',
            layers: ['mix', 'points']
        },
        {
            id: '4',
            chip: '4 · Coil',
            title: 'A coil pulls down and left',
            body: 'Left removes temperature (sensible heat); down removes water (latent heat). Drag SA to change the slope of MA→SA — that split is what sizing a coil actually means.',
            layers: ['coil', 'points']
        },
        {
            id: '5',
            chip: '5 · Comfort',
            title: 'Comfort is an area',
            body: 'The acceptable range of temperature and humidity is drawn straight onto the chart. Supply air has to be chosen so the room lands inside that box — not merely at the right temperature.',
            layers: ['comfort', 'points']
        },
        {
            id: '6',
            chip: '6 · Faults',
            title: 'Faults show up as bad geometry',
            body: 'If mixed air does not sit on the OA–RA chord, Red5 classifies it A–H (sensor, damper, MAT-out-of-range, extra moisture, ERV, high-OAD leak, or drift). Pull MA off the line to see which one you built.',
            layers: ['mix', 'fault', 'points']
        }
    ];

    function buildReadChart() {
        const svg = document.getElementById('read-chart');
        if (!svg) return null;
        while (svg.firstChild) svg.removeChild(svg.firstChild);

        const fr = makeFrame(svg, { tMin: 8, tMax: 40, wMax: 0.022 });
        const root = el('g');
        svg.appendChild(root);
        drawBase(fr, root, {});

        const sat = el('g', { class: 'train-layer', 'data-layer': 'sat' });
        const satPts = [];
        for (let t = fr.T_MIN; t <= fr.T_MAX; t += 0.4) {
            const w = getW(t, 100);
            if (w >= fr.W_MIN && w <= fr.W_MAX) satPts.push(fr.xy(t, w));
        }
        sat.appendChild(el('polyline', {
            points: satPts.join(' '), fill: 'none', stroke: '#2563eb', 'stroke-width': 2.6
        }));
        drawSatLabel(fr, sat);
        root.appendChild(sat);

        const axes = el('g', { class: 'train-layer', 'data-layer': 'axes' });
        axes.appendChild(el('line', {
            x1: fr.PAD.left, y1: fr.H - fr.PAD.bottom,
            x2: fr.W - fr.PAD.right, y2: fr.H - fr.PAD.bottom,
            stroke: '#fbbf24', 'stroke-width': 2.4
        }));
        axes.appendChild(el('line', {
            x1: fr.PAD.left, y1: fr.PAD.top,
            x2: fr.PAD.left, y2: fr.H - fr.PAD.bottom,
            stroke: '#fbbf24', 'stroke-width': 2.4
        }));
        root.appendChild(axes);

        const enthalpy = el('g', { class: 'train-layer', 'data-layer': 'enthalpy' });
        root.appendChild(enthalpy);

        const comfort = el('g', { class: 'train-layer', 'data-layer': 'comfort' });
        const cT0 = 21, cT1 = 26.5, cW0 = getW(24, 34), cW1 = getW(24, 58);
        comfort.appendChild(el('rect', {
            x: fr.tToX(cT0), y: fr.wToY(cW1),
            width: fr.tToX(cT1) - fr.tToX(cT0),
            height: fr.wToY(cW0) - fr.wToY(cW1),
            fill: 'rgba(249,115,22,0.16)', stroke: '#f97316',
            'stroke-width': 1.6, 'stroke-dasharray': '5 3', rx: 4
        }));
        comfort.appendChild(el('text', {
            x: fr.tToX(23.75), y: fr.wToY(cW0) + 16,
            fill: '#fb923c', 'font-size': 11, 'font-weight': '800',
            'text-anchor': 'middle', 'font-family': 'monospace'
        }, 'Comfort zone (ASHRAE 55)'));
        root.appendChild(comfort);

        const mix = el('g', { class: 'train-layer', 'data-layer': 'mix' });
        const mixLine = el('line', {
            stroke: '#10b981', 'stroke-width': 2.2, 'stroke-dasharray': '7 5'
        });
        mix.appendChild(mixLine);
        root.appendChild(mix);

        const coil = el('g', { class: 'train-layer', 'data-layer': 'coil' });
        const coilLine = el('line', { stroke: '#3b82f6', 'stroke-width': 2.6 });
        const coilHead = el('polygon', { fill: '#3b82f6' });
        coil.appendChild(coilLine);
        coil.appendChild(coilHead);
        root.appendChild(coil);

        const fault = el('g', { class: 'train-layer', 'data-layer': 'fault' });
        const drop = el('line', {
            stroke: '#f43f5e', 'stroke-width': 1.6, 'stroke-dasharray': '3 4'
        });
        const dropLab = el('text', {
            fill: '#fb7185', 'font-size': 10, 'font-weight': '700',
            'font-family': 'monospace'
        }, 'off the OA–RA line');
        fault.appendChild(drop);
        fault.appendChild(dropLab);
        root.appendChild(fault);

        const points = el('g', { class: 'train-layer', 'data-layer': 'points' });
        const dots = {
            OA: makeDot(fr, points, 'OA', live.oa),
            RA: makeDot(fr, points, 'RA', live.ra),
            MA: makeDot(fr, points, 'MA', live.ma),
            SA: makeDot(fr, points, 'SA', live.sa)
        };
        root.appendChild(points);

        function sync() {
            mixLine.setAttribute('x1', fr.tToX(live.oa.t));
            mixLine.setAttribute('y1', fr.wToY(live.oa.w));
            mixLine.setAttribute('x2', fr.tToX(live.ra.t));
            mixLine.setAttribute('y2', fr.wToY(live.ra.w));
            coilLine.setAttribute('x1', fr.tToX(live.ma.t));
            coilLine.setAttribute('y1', fr.wToY(live.ma.w));
            coilLine.setAttribute('x2', fr.tToX(live.sa.t));
            coilLine.setAttribute('y2', fr.wToY(live.sa.w));
            const ang = Math.atan2(fr.wToY(live.sa.w) - fr.wToY(live.ma.w), fr.tToX(live.sa.t) - fr.tToX(live.ma.t));
            const ax = fr.tToX(live.sa.t), ay = fr.wToY(live.sa.w);
            coilHead.setAttribute('points', [
                [ax, ay],
                [ax - 12 * Math.cos(ang - 0.45), ay - 12 * Math.sin(ang - 0.45)],
                [ax - 12 * Math.cos(ang + 0.45), ay - 12 * Math.sin(ang + 0.45)]
            ].map((p) => p.join(',')).join(' '));

            while (enthalpy.firstChild) enthalpy.removeChild(enthalpy.firstChild);
            [live.ra.h, live.oa.h].forEach((h, i) => {
                const pts = fr.enthalpyPts(h, fr.T_MIN, fr.T_MAX, 0.4);
                if (pts.length < 2) return;
                enthalpy.appendChild(el('polyline', {
                    points: fr.poly(pts),
                    fill: 'none', stroke: '#a78bfa',
                    'stroke-width': 1.6,
                    'stroke-dasharray': '7 5', opacity: 0.85
                }));
            });
            enthalpy.appendChild(el('text', {
                x: fr.tToX(Math.min(18, live.ra.t)), y: fr.wToY(wFromH(Math.min(18, live.ra.t), live.ra.h)) - 8,
                fill: '#c4b5fd', 'font-size': 11, 'font-weight': '700',
                'font-family': 'monospace'
            }, 'equal energy (enthalpy)'));

            const proj = projectOnChord(live.oa, live.ra, live.ma);
            const off = !live.maSnapped;
            drop.setAttribute('x1', fr.tToX(proj.t));
            drop.setAttribute('y1', fr.wToY(proj.w));
            drop.setAttribute('x2', fr.tToX(live.ma.t));
            drop.setAttribute('y2', fr.wToY(live.ma.w));
            drop.style.display = off ? '' : 'none';
            dropLab.setAttribute('x', fr.tToX(live.ma.t) + 10);
            dropLab.setAttribute('y', fr.wToY(live.ma.w) + 16);
            dropLab.style.display = off ? '' : 'none';
            live.ma.color = off ? '#f43f5e' : '#e2e8f0';
            live.ma.label = off ? 'MA?' : 'MA';
            moveDot(fr, dots.OA, live.oa, 'OA ' + Math.round(live.oa.h));
            moveDot(fr, dots.RA, live.ra, 'RA ' + Math.round(live.ra.h));
            moveDot(fr, dots.MA, live.ma, live.ma.label);
            moveDot(fr, dots.SA, live.sa, 'SA');
        }

        bindDrag(svg, fr, ['OA', 'RA', 'MA', 'SA']);
        readSync = sync;
        sync();
        return { svg, root };
    }

    function setReadLayers(active) {
        const svg = document.getElementById('read-chart');
        if (!svg) return;
        svg.querySelectorAll('[data-layer]').forEach((node) => {
            const name = node.getAttribute('data-layer');
            if (name === 'grid') {
                node.classList.remove('is-dim', 'is-lit');
                return;
            }
            const lit = !active || active.indexOf(name) !== -1;
            node.classList.toggle('is-lit', lit);
            node.classList.toggle('is-dim', !lit);
            if (name === 'fault') node.style.display = lit || !live.maSnapped ? '' : 'none';
        });
    }

    function initReadModule() {
        const host = document.getElementById('read-steps');
        const lesson = document.getElementById('read-lesson');
        if (!host || !lesson) return;
        buildReadChart();

        let idx = 0;
        function show(i) {
            idx = (i + READ_STEPS.length) % READ_STEPS.length;
            const step = READ_STEPS[idx];
            host.querySelectorAll('button').forEach((b) => {
                b.setAttribute('aria-pressed', b.dataset.step === step.id ? 'true' : 'false');
            });
            lesson.innerHTML = '<h3>' + step.title + '</h3><p>' + step.body + '</p>';
            setReadLayers(step.layers);
        }

        READ_STEPS.forEach((step) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.dataset.step = step.id;
            b.setAttribute('aria-pressed', 'false');
            b.textContent = step.chip;
            b.setAttribute('data-testid', 'read-step-' + step.id);
            b.addEventListener('click', () => show(READ_STEPS.indexOf(step)));
            host.appendChild(b);
        });
        document.getElementById('read-prev').addEventListener('click', () => show(idx - 1));
        document.getElementById('read-next').addEventListener('click', () => show(idx + 1));
        const reset = document.getElementById('read-reset');
        if (reset) reset.addEventListener('click', () => { resetLive(); broadcast(); });
        const ref = document.getElementById('read-fault-ref');
        if (ref && !ref.querySelector('.train-fault-item')) {
            ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach((k) => {
                const spec = MA_FAULT_CATALOG[k];
                const row = document.createElement('div');
                row.className = 'train-fault-item';
                row.dataset.cat = k;
                row.innerHTML = '<span class="k">' + k + '</span><span><span class="pts">'
                    + spec.points + '</span><br><span class="pat">' + spec.pattern
                    + '</span> — ' + spec.why + '</span>';
                ref.appendChild(row);
            });
        }
        show(0);
    }

    // =====================================================================
    // SLIDE 2 — When is outside air free?
    // =====================================================================
    const OUTCOMES = [
        {
            id: 'free',
            cls: 'free',
            title: '1 · Below-left of the violet line',
            body: 'Outside air holds less energy than the air coming back. Open the economizer and let mechanical cooling back off.',
            testid: 'outcome-free'
        },
        {
            id: 'min',
            cls: 'min',
            title: '2 · Above-right',
            body: 'Outside air is a load, not a resource. Close to the minimum ventilation rate 62.1 demands and let the coil do the work.',
            testid: 'outcome-min'
        },
        {
            id: 'a',
            cls: 'a',
            title: 'A · Cool but muggy',
            body: 'Cooler than return on dry-bulb, yet higher enthalpy. A dry-bulb economizer opens and imports latent load for the coil to wring back out.',
            testid: 'outcome-a'
        },
        {
            id: 'b',
            cls: 'b',
            title: 'B · Warm but dry',
            body: 'Warmer than return so dry-bulb keeps shut, yet enthalpy is below return. Energy says use it — a dry-bulb high limit still guards this corner when the load is mostly sensible.',
            testid: 'outcome-b'
        },
        {
            id: 'line',
            cls: 'line',
            title: '= · On the line',
            body: 'The two streams are energy-neutral, so the choice falls to humidity and fan power. Sequences add a deadband here so the dampers do not hunt.',
            testid: 'outcome-line'
        }
    ];

    function oaOutcome() {
        const cooler = live.oa.t < live.ra.t - 0.3;
        const lessH = live.oa.h < live.ra.h - 1;
        const onH = Math.abs(live.oa.h - live.ra.h) <= 1;
        if (onH) return 'line';
        if (cooler && lessH) return 'free';
        if (cooler && !lessH) return 'a';
        if (!cooler && lessH) return 'b';
        return 'min';
    }

    function regionPolys(fr) {
        const tSplit = live.ra.t;
        const hSplit = live.ra.h;
        const tSat = fr.satIntersectT(hSplit);
        const step = 0.4;

        const free = [];
        free.push([fr.T_MIN, fr.W_MIN]);
        free.push([tSplit, fr.W_MIN]);
        free.push([tSplit, live.ra.w]);
        fr.enthalpyPts(hSplit, tSplit, Math.max(fr.T_MIN, tSat), step).forEach((p) => free.push(p));
        if (tSat > fr.T_MIN) {
            for (let t = tSat; t >= fr.T_MIN; t -= step) free.push([t, fr.satW(t)]);
        }
        free.push([fr.T_MIN, fr.W_MIN]);

        const a = [];
        a.push([tSplit, live.ra.w]);
        fr.enthalpyPts(hSplit, tSplit, Math.max(fr.T_MIN, tSat), step).forEach((p) => a.push(p));
        for (let t = Math.max(fr.T_MIN, tSat); t <= tSplit; t += step) a.push([t, fr.satW(t)]);
        a.push([tSplit, live.ra.w]);

        const b = [];
        b.push([tSplit, fr.W_MIN]);
        b.push([fr.T_MAX, fr.W_MIN]);
        const hAtMax = wFromH(fr.T_MAX, hSplit);
        if (hAtMax > fr.W_MIN && hAtMax <= fr.satW(fr.T_MAX)) {
            b.push([fr.T_MAX, hAtMax]);
        }
        fr.enthalpyPts(hSplit, fr.T_MAX, tSplit, step).forEach((p) => b.push(p));
        b.push([tSplit, fr.W_MIN]);

        const min = [];
        min.push([tSplit, live.ra.w]);
        fr.enthalpyPts(hSplit, tSplit, fr.T_MAX, step).forEach((p) => min.push(p));
        min.push([fr.T_MAX, fr.satW(fr.T_MAX)]);
        for (let t = fr.T_MAX; t >= tSplit; t -= step) min.push([t, fr.satW(t)]);
        min.push([tSplit, live.ra.w]);

        return { free, a, b, min };
    }

    function buildEconChart() {
        const svg = document.getElementById('econ-chart');
        if (!svg) return null;
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        const fr = makeFrame(svg, { tMin: 8, tMax: 40, wMax: 0.022 });
        const root = el('g');
        svg.appendChild(root);
        drawBase(fr, root, { rh: [40, 60, 80, 100] });

        const regions = el('g', { class: 'train-layer', 'data-layer': 'regions' });
        root.appendChild(regions);

        const sat = el('g', { class: 'train-layer', 'data-layer': 'sat' });
        const satPts = [];
        for (let t = fr.T_MIN; t <= fr.T_MAX; t += 0.4) {
            const w = getW(t, 100);
            if (w >= fr.W_MIN && w <= fr.W_MAX) satPts.push(fr.xy(t, w));
        }
        sat.appendChild(el('polyline', {
            points: satPts.join(' '), fill: 'none', stroke: '#2563eb', 'stroke-width': 2.4
        }));
        root.appendChild(sat);

        const lines = el('g', { class: 'train-layer', 'data-layer': 'lines' });
        root.appendChild(lines);

        const process = el('g', { class: 'train-layer', 'data-layer': 'process' });
        const mixLine = el('line', {
            stroke: '#10b981', 'stroke-width': 2.0, 'stroke-dasharray': '7 5'
        });
        const coilLine = el('line', { stroke: '#3b82f6', 'stroke-width': 2.4 });
        process.appendChild(mixLine);
        process.appendChild(coilLine);
        root.appendChild(process);

        const points = el('g', { class: 'train-layer', 'data-layer': 'points' });
        makeDot(fr, points, 'A', PT_A);
        makeDot(fr, points, 'B', PT_B);
        const dots = {
            RA: makeDot(fr, points, 'RA', live.ra),
            OA: makeDot(fr, points, 'OA', live.oa),
            MA: makeDot(fr, points, 'MA', live.ma),
            SA: makeDot(fr, points, 'SA', live.sa)
        };
        root.appendChild(points);

        function sync() {
            while (regions.firstChild) regions.removeChild(regions.firstChild);
            const polys = regionPolys(fr);
            const fills = {
                free: { fill: 'rgba(16,185,129,0.22)', stroke: '#10b981', label: 'FREE COOLING', sub: 'both methods agree', lx: 14, ly: 0.003 },
                a:    { fill: 'rgba(244,63,94,0.20)',  stroke: '#fb7185', label: 'A 60', sub: 'cool but muggy', lx: 16, ly: 0.014 },
                b:    { fill: 'rgba(249,115,22,0.20)', stroke: '#f97316', label: 'B 34', sub: 'warm but dry', lx: 31, ly: 0.0028 },
                min:  { fill: 'rgba(100,116,139,0.16)', stroke: '#64748b', label: 'hot & humid', sub: 'minimum OA', lx: 34.5, ly: 0.017 }
            };
            ['free', 'a', 'b', 'min'].forEach((key) => {
                const g = el('g', { class: 'econ-region', 'data-region': key });
                const spec = fills[key];
                g.appendChild(el('polygon', {
                    points: fr.poly(polys[key]),
                    fill: spec.fill, stroke: spec.stroke, 'stroke-width': 1.1
                }));
                g.appendChild(el('text', {
                    x: fr.tToX(spec.lx), y: fr.wToY(spec.ly),
                    fill: spec.stroke, 'font-size': 12, 'font-weight': '800',
                    'font-family': 'monospace'
                }, spec.label));
                g.appendChild(el('text', {
                    x: fr.tToX(spec.lx), y: fr.wToY(spec.ly) + 14,
                    fill: spec.stroke, 'font-size': 10, 'font-weight': '700',
                    'font-family': 'monospace', opacity: 0.85
                }, spec.sub));
                g.style.cursor = 'pointer';
                g.addEventListener('click', () => {
                    const ev = new CustomEvent('train-outcome', { detail: key });
                    svg.dispatchEvent(ev);
                });
                regions.appendChild(g);
            });

            while (lines.firstChild) lines.removeChild(lines.firstChild);
            lines.appendChild(el('line', {
                x1: fr.tToX(live.ra.t), y1: fr.PAD.top,
                x2: fr.tToX(live.ra.t), y2: fr.H - fr.PAD.bottom,
                stroke: '#cbd5e1', 'stroke-width': 1.8, 'stroke-dasharray': '6 5',
                'data-line': 'db'
            }));
            lines.appendChild(el('text', {
                x: fr.tToX(live.ra.t) + 6, y: fr.PAD.top + 14,
                fill: '#cbd5e1', 'font-size': 11, 'font-weight': '700',
                'font-family': 'monospace', 'data-line': 'db'
            }, 'dry-bulb only'));
            const hPts = fr.enthalpyPts(live.ra.h, fr.T_MIN, fr.T_MAX, 0.4);
            lines.appendChild(el('polyline', {
                points: fr.poly(hPts),
                fill: 'none', stroke: '#a78bfa', 'stroke-width': 2.4,
                'data-line': 'h'
            }));
            const labT = Math.min(17, live.ra.t - 2);
            lines.appendChild(el('text', {
                x: fr.tToX(labT), y: fr.wToY(wFromH(labT, live.ra.h)) - 8,
                fill: '#c4b5fd', 'font-size': 11, 'font-weight': '700',
                'font-family': 'monospace', 'data-line': 'h'
            }, 'equal energy as RA'));

            mixLine.setAttribute('x1', fr.tToX(live.oa.t));
            mixLine.setAttribute('y1', fr.wToY(live.oa.w));
            mixLine.setAttribute('x2', fr.tToX(live.ra.t));
            mixLine.setAttribute('y2', fr.wToY(live.ra.w));
            coilLine.setAttribute('x1', fr.tToX(live.ma.t));
            coilLine.setAttribute('y1', fr.wToY(live.ma.w));
            coilLine.setAttribute('x2', fr.tToX(live.sa.t));
            coilLine.setAttribute('y2', fr.wToY(live.sa.w));
            live.ma.color = live.maSnapped ? '#e2e8f0' : '#f43f5e';
            moveDot(fr, dots.OA, live.oa, 'OA ' + Math.round(live.oa.h));
            moveDot(fr, dots.RA, live.ra, 'RA ' + Math.round(live.ra.h));
            moveDot(fr, dots.MA, live.ma, live.maSnapped ? 'MA' : 'MA?');
            moveDot(fr, dots.SA, live.sa, 'SA');
        }

        bindDrag(svg, fr, ['OA', 'RA', 'MA', 'SA']);
        econSync = sync;
        sync();
        return { svg, fr };
    }

    function paintEcon(method, outcome) {
        const svg = document.getElementById('econ-chart');
        if (!svg) return;
        const openByMethod = {
            both: { free: true, a: true, b: true, min: true },
            db:   { free: true, a: true,  b: false, min: false },
            h:    { free: true, a: false, b: true,  min: false }
        };
        const open = openByMethod[method] || openByMethod.both;
        svg.querySelectorAll('.econ-region').forEach((g) => {
            const key = g.getAttribute('data-region');
            const selected = outcome === key || (outcome === 'line' && (key === 'free' || key === 'min'));
            const shown = open[key];
            g.style.opacity = shown ? (selected ? '1' : '0.72') : '0.14';
            const poly = g.querySelector('polygon');
            if (poly) poly.setAttribute('stroke-width', selected ? '2.4' : '1.1');
        });
        svg.querySelectorAll('[data-line]').forEach((node) => {
            const which = node.getAttribute('data-line');
            const emphasize = method === 'both' || method === which || (outcome === 'line' && which === 'h');
            node.setAttribute('opacity', emphasize ? '1' : '0.22');
            if (node.tagName === 'polyline' || node.tagName === 'line') {
                node.setAttribute('stroke-width', emphasize && which === (method === 'db' ? 'db' : 'h') ? '3' : '2');
            }
        });
    }

    function initEconModule() {
        const methods = document.getElementById('econ-methods');
        const host = document.getElementById('econ-outcomes');
        if (!methods || !host) return;
        const built = buildEconChart();

        let method = 'both';
        let outcome = 'free';

        function render() {
            methods.querySelectorAll('button').forEach((b) => {
                b.setAttribute('aria-pressed', b.dataset.method === method ? 'true' : 'false');
            });
            host.querySelectorAll('.outcome').forEach((b) => {
                b.setAttribute('aria-pressed', b.dataset.outcome === outcome ? 'true' : 'false');
            });
            paintEcon(method, outcome);
        }

        const prevEcon = econSync;
        econSync = function () {
            if (prevEcon) prevEcon();
            outcome = oaOutcome();
            render();
        };

        methods.querySelectorAll('button').forEach((b) => {
            b.addEventListener('click', () => {
                method = b.dataset.method;
                render();
            });
        });

        OUTCOMES.forEach((o) => {
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'outcome ' + o.cls;
            card.dataset.outcome = o.id;
            card.setAttribute('aria-pressed', 'false');
            card.setAttribute('data-testid', o.testid);
            card.innerHTML = '<h4>' + o.title + '</h4><p>' + o.body + '</p>';
            card.addEventListener('click', () => {
                outcome = o.id;
                render();
            });
            host.appendChild(card);
        });

        built.svg.addEventListener('train-outcome', (ev) => {
            outcome = ev.detail;
            render();
        });

        const reset = document.getElementById('econ-reset');
        if (reset) reset.addEventListener('click', () => { resetLive(); broadcast(); });

        render();
    }

    initReadModule();
    initEconModule();
    broadcast();
})();
