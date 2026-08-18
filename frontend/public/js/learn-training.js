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

    // ---------- slide points (published training numbers) ----------
    const OA = { t: 33, w: 0.018, label: 'OA', color: '#f97316' };
    const RA = { t: 24, w: getW(24, 50), label: 'RA', color: '#10b981' };
    const MIX = 0.30;
    const MA = {
        t: RA.t * (1 - MIX) + OA.t * MIX,
        w: RA.w * (1 - MIX) + OA.w * MIX,
        label: 'MA',
        color: '#e2e8f0'
    };
    const SA = { t: 14, w: 0.0084, label: 'SA', color: '#3b82f6' };
    const MA_LIE = { t: MA.t + 0.4, w: MA.w + 0.0036, label: 'MA?', color: '#f43f5e' };
    const PT_A = { t: 22, w: getW(22, 90), label: 'A 60', color: '#fb7185' };
    const PT_B = { t: 28, w: getW(28, 10), label: 'B 34', color: '#f97316' };
    OA.h = getH(OA.t, OA.w);
    RA.h = getH(RA.t, RA.w);
    MA.h = getH(MA.t, MA.w);
    SA.h = getH(SA.t, SA.w);
    PT_A.h = getH(PT_A.t, PT_A.w);
    PT_B.h = getH(PT_B.t, PT_B.w);

    function makeFrame(svg, opts) {
        const W = 1100, H = 560;
        const PAD = { top: 28, right: 108, bottom: 52, left: 58 };
        const T_MIN = opts.tMin, T_MAX = opts.tMax;
        const W_MIN = 0, W_MAX = opts.wMax;
        const tToX = (t) => PAD.left + ((t - T_MIN) / (T_MAX - T_MIN)) * (W - PAD.left - PAD.right);
        const wToY = (w) => H - PAD.bottom - ((w - W_MIN) / (W_MAX - W_MIN)) * (H - PAD.top - PAD.bottom);
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
            // Left of this T the h-isoline sits above saturation (impossible).
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

        function clipToSat(t, w) {
            return [t, Math.min(w, satW(t))];
        }

        return { svg, W, H, PAD, T_MIN, T_MAX, W_MIN, W_MAX, tToX, wToY, satW, xy, enthalpyPts, satIntersectT, poly, clipToSat };
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

    function drawDot(fr, parent, p, extra) {
        const g = el('g', extra || {});
        g.appendChild(el('circle', {
            cx: fr.tToX(p.t), cy: fr.wToY(p.w), r: 7,
            fill: p.color, stroke: '#0b1220', 'stroke-width': 1.6
        }));
        g.appendChild(el('text', {
            x: fr.tToX(p.t) + 10, y: fr.wToY(p.w) - 8,
            fill: p.color, 'font-size': 13, 'font-weight': '800',
            'font-family': 'monospace'
        }, p.label));
        parent.appendChild(g);
        return g;
    }

    // =====================================================================
    // SLIDE 1 — How to read it
    // =====================================================================
    const READ_STEPS = [
        {
            id: 'all',
            chip: 'All',
            title: 'The whole picture',
            body: 'Four dots, two process lines, a comfort box and the equal-energy diagonals. Step through the six points to light each piece on its own.',
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
            body: 'Outside and return air blend to a point that must land on the line joining them. How far along it sits gives the proportion: a third of the way from RA means a third outside air.',
            layers: ['mix', 'points']
        },
        {
            id: '4',
            chip: '4 · Coil',
            title: 'A coil pulls down and left',
            body: 'Left removes temperature (sensible heat); down removes water (latent heat). The slope of MA→SA is the split between them — and that split is what sizing a coil actually means.',
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
            body: 'If the mixed-air dot does not sit on the line between outside and return air, something is lying — a stuck damper or a drifting sensor. The picture catches what alarm limits miss.',
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
        [RA.h, OA.h, 64].forEach((h, i) => {
            const pts = fr.enthalpyPts(h, fr.T_MIN, fr.T_MAX, 0.4);
            if (pts.length < 2) return;
            enthalpy.appendChild(el('polyline', {
                points: fr.poly(pts),
                fill: 'none', stroke: '#a78bfa',
                'stroke-width': i === 2 ? 1.2 : 1.6,
                'stroke-dasharray': '7 5', opacity: i === 2 ? 0.45 : 0.85
            }));
        });
        enthalpy.appendChild(el('text', {
            x: fr.tToX(18), y: fr.wToY(wFromH(18, RA.h)) - 8,
            fill: '#c4b5fd', 'font-size': 11, 'font-weight': '700',
            'font-family': 'monospace'
        }, 'equal energy (enthalpy)'));
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
        mix.appendChild(el('line', {
            x1: fr.tToX(OA.t), y1: fr.wToY(OA.w),
            x2: fr.tToX(RA.t), y2: fr.wToY(RA.w),
            stroke: '#10b981', 'stroke-width': 2.2, 'stroke-dasharray': '7 5'
        }));
        root.appendChild(mix);

        const coil = el('g', { class: 'train-layer', 'data-layer': 'coil' });
        coil.appendChild(el('line', {
            x1: fr.tToX(MA.t), y1: fr.wToY(MA.w),
            x2: fr.tToX(SA.t), y2: fr.wToY(SA.w),
            stroke: '#3b82f6', 'stroke-width': 2.6
        }));
        const ang = Math.atan2(fr.wToY(SA.w) - fr.wToY(MA.w), fr.tToX(SA.t) - fr.tToX(MA.t));
        const ax = fr.tToX(SA.t), ay = fr.wToY(SA.w);
        coil.appendChild(el('polygon', {
            points: [
                [ax, ay],
                [ax - 12 * Math.cos(ang - 0.45), ay - 12 * Math.sin(ang - 0.45)],
                [ax - 12 * Math.cos(ang + 0.45), ay - 12 * Math.sin(ang + 0.45)]
            ].map((p) => p.join(',')).join(' '),
            fill: '#3b82f6'
        }));
        root.appendChild(coil);

        const points = el('g', { class: 'train-layer', 'data-layer': 'points' });
        drawDot(fr, points, OA);
        drawDot(fr, points, RA);
        drawDot(fr, points, MA);
        drawDot(fr, points, SA);
        root.appendChild(points);

        const fault = el('g', { class: 'train-layer', 'data-layer': 'fault' });
        fault.appendChild(el('line', {
            x1: fr.tToX(MA.t), y1: fr.wToY(MA.w),
            x2: fr.tToX(MA_LIE.t), y2: fr.wToY(MA_LIE.w),
            stroke: '#f43f5e', 'stroke-width': 1.6, 'stroke-dasharray': '3 4'
        }));
        drawDot(fr, fault, MA_LIE);
        fault.appendChild(el('text', {
            x: fr.tToX(MA_LIE.t) + 10, y: fr.wToY(MA_LIE.w) + 16,
            fill: '#fb7185', 'font-size': 10, 'font-weight': '700',
            'font-family': 'monospace'
        }, 'off the OA–RA line'));
        root.appendChild(fault);

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
            if (name === 'fault') node.style.display = lit ? '' : 'none';
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
            body: 'At 22 °C it is 2° cooler than the return, so a dry-bulb economizer opens — yet it carries 60 kJ/kg against 48. You have just imported latent load for the coil to wring back out.',
            testid: 'outcome-a'
        },
        {
            id: 'b',
            cls: 'b',
            title: 'B · Warm but dry',
            body: 'At 28 °C dry-bulb keeps it shut, yet 34 kJ/kg is far below the return. Energy says use it — though a dry-bulb high limit still guards this corner when the load is mostly sensible.',
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

    function regionPolys(fr) {
        const tSplit = RA.t;
        const hSplit = RA.h;
        const tSat = fr.satIntersectT(hSplit);
        const step = 0.4;

        const free = [];
        free.push([fr.T_MIN, fr.W_MIN]);
        free.push([tSplit, fr.W_MIN]);
        free.push([tSplit, RA.w]);
        fr.enthalpyPts(hSplit, tSplit, Math.max(fr.T_MIN, tSat), step).forEach((p) => free.push(p));
        if (tSat > fr.T_MIN) {
            for (let t = tSat; t >= fr.T_MIN; t -= step) free.push([t, fr.satW(t)]);
        }
        free.push([fr.T_MIN, fr.W_MIN]);

        const a = [];
        a.push([tSplit, RA.w]);
        fr.enthalpyPts(hSplit, tSplit, Math.max(fr.T_MIN, tSat), step).forEach((p) => a.push(p));
        for (let t = Math.max(fr.T_MIN, tSat); t <= tSplit; t += step) a.push([t, fr.satW(t)]);
        a.push([tSplit, RA.w]);

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
        min.push([tSplit, RA.w]);
        fr.enthalpyPts(hSplit, tSplit, fr.T_MAX, step).forEach((p) => min.push(p));
        const lastH = min[min.length - 1];
        if (lastH && lastH[0] < fr.T_MAX) {
            min.push([fr.T_MAX, fr.satW(fr.T_MAX)]);
        } else if (lastH) {
            min.push([fr.T_MAX, fr.satW(fr.T_MAX)]);
        }
        for (let t = fr.T_MAX; t >= tSplit; t -= step) min.push([t, fr.satW(t)]);
        min.push([tSplit, RA.w]);

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

        const polys = regionPolys(fr);
        const regions = el('g', { class: 'train-layer', 'data-layer': 'regions' });
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
            regions.appendChild(g);
        });
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
        lines.appendChild(el('line', {
            x1: fr.tToX(RA.t), y1: fr.PAD.top,
            x2: fr.tToX(RA.t), y2: fr.H - fr.PAD.bottom,
            stroke: '#cbd5e1', 'stroke-width': 1.8, 'stroke-dasharray': '6 5',
            'data-line': 'db'
        }));
        lines.appendChild(el('text', {
            x: fr.tToX(RA.t) + 6, y: fr.PAD.top + 14,
            fill: '#cbd5e1', 'font-size': 11, 'font-weight': '700',
            'font-family': 'monospace', 'data-line': 'db'
        }, 'dry-bulb only'));
        const hPts = fr.enthalpyPts(RA.h, fr.T_MIN, fr.T_MAX, 0.4);
        lines.appendChild(el('polyline', {
            points: fr.poly(hPts),
            fill: 'none', stroke: '#a78bfa', 'stroke-width': 2.4,
            'data-line': 'h'
        }));
        const labT = 17;
        lines.appendChild(el('text', {
            x: fr.tToX(labT), y: fr.wToY(wFromH(labT, RA.h)) - 8,
            fill: '#c4b5fd', 'font-size': 11, 'font-weight': '700',
            'font-family': 'monospace', 'data-line': 'h'
        }, 'equal energy as RA'));
        root.appendChild(lines);

        const points = el('g', { class: 'train-layer', 'data-layer': 'points' });
        drawDot(fr, points, { t: RA.t, w: RA.w, label: 'RA 48', color: '#10b981' });
        drawDot(fr, points, { t: PT_A.t, w: PT_A.w, label: 'A 60', color: '#fb7185' });
        drawDot(fr, points, { t: PT_B.t, w: PT_B.w, label: 'B 34', color: '#f97316' });
        drawDot(fr, points, { t: OA.t, w: OA.w, label: 'OA 79', color: '#94a3b8' });
        root.appendChild(points);

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
            const emphasize = method === 'both' || method === which || outcome === 'line' && which === 'h';
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
        buildEconChart();

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

        document.getElementById('econ-chart').querySelectorAll('.econ-region').forEach((g) => {
            g.style.cursor = 'pointer';
            g.addEventListener('click', () => {
                outcome = g.getAttribute('data-region');
                render();
            });
        });

        render();
    }

    initReadModule();
    initEconModule();
})();
