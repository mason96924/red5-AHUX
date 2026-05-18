// AHU Diagnostic HUB — Psychrometric Engine
// Pure math functions for psychrometric calculations, comfort zone analysis,
// and demand-driven diagnostics. No React state dependencies.

const P_ATM = 101.325;
const safe = (val) => (typeof val === 'number' && Number.isFinite(val)) ? val : 0;

const getPsat = (T) => {
    const TK = safe(T) + 273.15;
    if (TK <= 173.15) return 0.0001; 
    let lp;
    if (TK < 273.15) { 
        const c = [-5.6745359e3, 6.3925247, -9.677843e-3, 6.2215701e-7, 2.0747825e-9, -9.484024e-13, 4.1635019];
        lp = c[0]/TK + c[1] + c[2]*TK + c[3]*Math.pow(TK, 2) + c[4]*Math.pow(TK, 3) + c[5]*Math.pow(TK, 4) + c[6]*Math.log(TK);
    } else { 
        const c = [-5.8002206e3, 1.3914993, -4.8640239e-2, 4.1764768e-5, -1.4452093e-8, 6.5459673];
        lp = c[0]/TK + c[1] + c[2]*TK + c[3]*Math.pow(TK, 2) + c[4]*Math.pow(TK, 3) + c[5]*Math.log(TK);
    }
    return safe(Math.exp(lp) / 1000);
};

const getW = (T, RH) => {
    const ps = getPsat(T);
    const pw = (safe(RH) / 100) * ps;
    return safe((0.621945 * pw) / (P_ATM - pw));
};

const getH = (T, W) => safe(1.006 * T + W * (2501 + 1.86 * T));

// Build the Givoni Comfort Zone polygon vertices [t, w]
const buildComfortZonePoly = () => {
    const pts = [];
    for (let t = 20; t <= 25; t += 0.5) pts.push([t, getW(t, 80)]);
    pts.push([27, getW(27, 50)]);
    pts.push([27, getW(27, 20)]);
    for (let t = 27; t >= 20; t -= 0.5) pts.push([t, getW(t, 20)]);
    return pts;
};

// Point-in-polygon (ray casting) — requires comfort zone polygon
const isInComfortZone = (t, w, poly) => {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const xi = poly[i][0], yi = poly[i][1];
        const xj = poly[j][0], yj = poly[j][1];
        if ((yi > w) !== (yj > w) && t < (xj - xi) * (w - yi) / (yj - yi) + xi) {
            inside = !inside;
        }
    }
    return inside;
};

// Psychrometric distance (T/W space, W scaled to g/kg)
const getPsyDistance = (t1, w1, t2, w2) => {
    const dT = t1 - t2;
    const dW = (w1 - w2) * 1000;
    return Math.sqrt(dT * dT + dW * dW);
};

// Demand calculation: delta-H to nearest CZ boundary
const getZoneDemand = (t, w, comfortPoly) => {
    const inCZ = isInComfortZone(t, w, comfortPoly);
    const h = getH(t, w);
    if (inCZ) return { inCZ: true, heatingDemand: 0, coolingDemand: 0, demandType: 'none' };
    
    if (t < 20) {
        const boundaryH = getH(20, w);
        return { inCZ: false, heatingDemand: boundaryH - h, coolingDemand: 0, demandType: 'heating' };
    } else if (t > 27) {
        const boundaryH = getH(27, w);
        return { inCZ: false, heatingDemand: 0, coolingDemand: h - boundaryH, demandType: 'cooling' };
    } else {
        return { inCZ: false, heatingDemand: 0, coolingDemand: 0, demandType: 'humidity' };
    }
};

// Full VAV diagnostic — demand-driven, no setpoints
// Geometric containment helper: is the (T, RH) point inside the
// operator-defined sweet-spot strip?  The strip is bounded by:
//   T in [20, 27] degC  (same as CZ)
//   RH in [lo, hi]      (operator-defined; default 40-60%)
// We additionally clip to the CZ via demand.inCZ in the callers so a
// VAV that happens to be at 23 C / 50% RH but somehow outside the CZ
// (impossible by geometry but a safety net) won't be counted.
const inSweetSpot = (t, rh, sweetSpot) => {
    if (!sweetSpot) return true;   // no filter -> always-in
    if (t < 20 || t > 27) return false;
    return rh >= sweetSpot.lo && rh <= sweetSpot.hi;
};

const getVavDiagnostic = (vav, saPoint, comfortPoly, sweetSpot) => {
    const demand = getZoneDemand(vav.t, vav.w, comfortPoly);
    const distSA = saPoint ? getPsyDistance(vav.t, vav.w, saPoint.t, saPoint.w) : 0;
    const deltaH = saPoint ? (vav.h - getH(saPoint.t, saPoint.w)) : 0;

    // When a sweet-spot filter is active, a VAV only counts as "in CZ"
    // for downstream metrics if it's inside BOTH the Givoni CZ polygon
    // AND the operator-defined RH strip.  The intersection is what the
    // operator is actually targeting on the dashboard, so the comfort
    // percentage should reflect that, not the looser CZ-only count.
    const inCZ_and_sweet = demand.inCZ && inSweetSpot(vav.t, vav.rh, sweetSpot);

    let status;
    if (inCZ_and_sweet && distSA < 3) status = 'optimal';
    else if (inCZ_and_sweet) status = 'comfort';
    else if (Math.abs(vav.t - 23.5) < 5.5) status = 'warning';
    else status = 'alarm';

    const totalDemand = demand.heatingDemand + demand.coolingDemand;

    // We deliberately overwrite `inCZ` on the returned object so any
    // callers downstream of this point (notably getAhuDiagnostic) see
    // the AND-narrowed value.  If you need the wider CZ-only result,
    // omit the sweetSpot argument.
    return { ...demand, inCZ: inCZ_and_sweet, distSA, deltaH, status, totalDemand };
};

// AHU-level aggregate demand diagnostic
const getAhuDiagnostic = (ahu, comfortPoly, sweetSpot) => {
    if (!ahu || !ahu.points || !ahu.vavs) return null;
    const oa = ahu.points[0], sa = ahu.points[1], ra = ahu.points[2];
    if (!oa || !sa || !ra) return null;

    const vavDiags = ahu.vavs.map(v => getVavDiagnostic(v, sa, comfortPoly, sweetSpot));
    const inCZCount = vavDiags.filter(d => d.inCZ).length;
    const totalVavs = ahu.vavs.length;
    const totalHeating = vavDiags.reduce((s, d) => s + d.heatingDemand, 0);
    const totalCooling = vavDiags.reduce((s, d) => s + d.coolingDemand, 0);
    const avgDistSA = vavDiags.reduce((s, d) => s + d.distSA, 0) / totalVavs;

    let process;
    if (totalHeating === 0 && totalCooling === 0) process = 'idle';
    else if (totalHeating > totalCooling) process = 'heating';
    else process = 'cooling';

    const recs = [];
    const oaH = getH(oa.t, oa.w);
    const raH = getH(ra.t, ra.w);

    if (process === 'cooling' && oaH < raH) {
        recs.push('Economizer: free cooling available');
    }
    if (process === 'heating' && oa.t < 5) {
        recs.push('Minimize OA damper (freeze risk)');
    }
    if (sa.rh > 75) recs.push('SA humidity high');
    if (sa.rh < 25) recs.push('SA humidity low');
    if (inCZCount === totalVavs) {
        recs.push(sweetSpot ? 'All zones in sweet-spot' : 'All zones in CZ');
    }

    return {
        process, inCZCount, totalVavs,
        totalHeating, totalCooling, avgDistSA,
        comfortPct: Math.round((inCZCount / totalVavs) * 100),
        // Annotate so the dashboard's CZ% chip can show whether the
        // figure reflects CZ-only or CZ-and-sweet-spot.
        comfortMode: sweetSpot ? 'sweet' : 'cz',
        sweetSpot: sweetSpot || null,
        recommendations: recs
    };
};

// Energy metrics for AHU card
const getEnergyMetrics = (ahu) => {
    if (!ahu || !ahu.points) return { exchange: 0, absorption: 0 };
    const sa = ahu.points[1], oa = ahu.points[0], ra = ahu.points[2];
    if (!ra || !oa || !sa) return { exchange: 0, absorption: 0 };
    return { exchange: getH(sa.t, sa.w) - getH(oa.t, oa.w), absorption: getH(ra.t, ra.w) - getH(sa.t, sa.w) };
};

// Givoni-region color tokens.  Single source of truth shared by the chart
// polygon fills AND the VAV-table tier dots, so re-skinning the chart
// automatically re-skins the dot legend (auto-derive contract).
//   CZ_*    : outer Givoni Comfort Zone (looser ASHRAE 55 envelope)
//   SWEET_* : operator-defined inner RH sweet-spot (default 40-60% RH)
const GIVONI_COLORS = {
    CZ_STROKE:    '#10b981',  // outer CZ stroke / Tier B dot fill
    CZ_FILL:      '#10b981',  // outer CZ polygon fill (used at low opacity)
    SWEET_STROKE: '#047857',  // inner sweet-spot stroke
    SWEET_FILL:   '#059669',  // inner sweet-spot fill / Tier A dot fill
    HOT_OUTSIDE:  '#f97316',  // Tier C dot — outside CZ on hot/humid side
    COLD_OUTSIDE: '#1d4ed8',  // Tier C dot — outside CZ on cold/dry side
};

// Givoni-aware tier classification + control-strategy resolver.
// Returns a single object describing where the (T, RH, W) point sits
// relative to the Givoni overlay AND what the controller should do
// about it.  Tiers:
//   A   - inside CZ AND inside operator-defined sweet-spot RH strip
//         -> HOLD setpoints (true comfort)
//   B   - inside CZ but outside sweet-spot strip
//         -> SOFT TRIM (RH-only humidify or dehumidify; no temp change)
//   C+  - outside CZ on hot/humid side  (T >= 23.5 by chart-centroid split)
//         -> mechanical cooling (or dehumidify if T in [20,27] but RH high)
//   C-  - outside CZ on cold/dry side   (T <  23.5)
//         -> mechanical heating (or humidify if T in [20,27] but RH low)
//
// All callers (VAV-table row dot, chart indicator tooltip, AHU strategy
// banner) MUST use this resolver so the colour + recommendation stay
// in lock-step across the UI.
const getGivoniTier = (t, w, rh, comfortPoly, sweetSpot, enabled) => {
    const _enabled = enabled !== false;  // default ON
    const demand = getZoneDemand(t, w, comfortPoly);
    const inCZ = demand.inCZ;
    const _ss = (_enabled && sweetSpot) ? sweetSpot : null;
    const inSS = _ss ? (t >= 20 && t <= 27 && rh >= _ss.lo && rh <= _ss.hi) : inCZ;

    // Tier A — inner comfort band (CZ AND sweet-spot)
    if (inCZ && (!_ss || inSS)) {
        return {
            tier: 'A',
            dotFill: GIVONI_COLORS.SWEET_FILL,
            dotOpacity: 1,
            ringStroke: GIVONI_COLORS.SWEET_STROKE,
            strategy: 'HOLD',
            label: 'Comfort',
            subLabel: 'hold setpoints',
            tooltip: _ss
                ? ('In sweet-spot band (' + _ss.lo + '-' + _ss.hi + '% RH) | HOLD setpoints')
                : 'In Givoni CZ | HOLD setpoints',
        };
    }

    // Tier B — outer Givoni band (CZ but outside sweet-spot)
    if (inCZ && _ss) {
        const tooLow  = rh < _ss.lo;
        const strategy = tooLow ? 'TRIM_HUMIDIFY' : 'TRIM_DEHUMIDIFY';
        const subLabel = tooLow ? 'humidify (RH-only)' : 'dehumidify (RH-only)';
        return {
            tier: 'B',
            dotFill: GIVONI_COLORS.CZ_STROKE,
            dotOpacity: 1,
            ringStroke: GIVONI_COLORS.SWEET_STROKE,
            strategy,
            label: 'Soft trim',
            subLabel,
            tooltip: ('In Givoni CZ but outside ' + _ss.lo + '-' + _ss.hi + '% RH | Soft trim ' + (tooLow ? 'humidify' : 'dehumidify')),
        };
    }

    // Tier C — outside Givoni
    const hotSide = t >= 23.5;
    if (hotSide) {
        // Hot side: pure mech cool when over 27 C, else dehumidify only
        const strategy = (t > 27) ? 'COOL' : 'DEHUMIDIFY';
        const subLabel = (t > 27) ? 'mechanical cool' : 'dehumidify';
        return {
            tier: 'C+',
            dotFill: GIVONI_COLORS.HOT_OUTSIDE,
            dotOpacity: 1,
            ringStroke: '#9a3412',
            strategy,
            label: 'Hot/humid',
            subLabel,
            tooltip: ('Outside CZ - hot/humid side (' + t.toFixed(1) + ' C, ' + rh.toFixed(0) + '% RH) | ' + subLabel),
        };
    }
    // Cold side
    const strategy = (t < 20) ? 'HEAT' : 'HUMIDIFY';
    const subLabel = (t < 20) ? 'mechanical heat' : 'humidify';
    return {
        tier: 'C-',
        dotFill: GIVONI_COLORS.COLD_OUTSIDE,
        dotOpacity: 1,
        ringStroke: '#1e3a8a',
        strategy,
        label: 'Cold/dry',
        subLabel,
        tooltip: ('Outside CZ - cold/dry side (' + t.toFixed(1) + ' C, ' + rh.toFixed(0) + '% RH) | ' + subLabel),
    };
};
