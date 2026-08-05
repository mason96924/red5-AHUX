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
    const none = { exchange: 0, absorption: 0, mixing: null, coil: null };
    if (!ahu || !ahu.points) return none;
    const sa = ahu.points[1], oa = ahu.points[0], ra = ahu.points[2];
    if (!ra || !oa || !sa) return none;
    const hOa = getH(oa.t, oa.w), hSa = getH(sa.t, sa.w), hRa = getH(ra.t, ra.w);
    /* MA splits the OA->SA drop into the part the dampers gave away for
       free and the part the coil paid for; the sum is `exchange`, so the
       pair is one number decomposed rather than two estimates.  No MA
       (MAT unmapped) => nulls, and the caller shows `exchange` alone. */
    const ma = ahu.points.find(p => p && p.label === 'MA');
    const hMa = ma ? getH(ma.t, ma.w) : null;
    return {
        exchange:   hSa - hOa,
        absorption: hRa - hSa,
        mixing:     Number.isFinite(hMa) ? hMa - hOa : null,
        coil:       Number.isFinite(hMa) ? hSa - hMa : null,
    };
};

// Givoni-region color tokens.  Single source of truth shared by the chart
// polygon fills AND the VAV-table tier dots, so re-skinning the chart
// automatically re-skins the dot legend (auto-derive contract).
//   CZ_*    : outer Givoni Comfort Zone (looser ASHRAE 55 envelope)
//   SWEET_* : operator-defined inner RH sweet-spot (default 40-60% RH)
const GIVONI_COLORS = {
    CZ_STROKE:    '#10b981',  // outer CZ polygon stroke
    CZ_FILL:      '#10b981',  // outer CZ polygon fill (used at low opacity)
    SWEET_STROKE: '#047857',  // inner sweet-spot stroke
    SWEET_FILL:   '#059669',  // inner sweet-spot polygon fill
    // Outer-tier quadrants per ASHRAE / Givoni convention.  Split by
    // BOTH temperature (warm vs cool) AND humidity ratio (wet vs dry).
    //
    //                    W < ~9.3 g/kg (dry)   W >= ~9.3 g/kg (wet)
    //   T >= 23.5  (warm)  HOT_DRY  (red)        HOT_HUMID (orange)
    //   T <  23.5  (cool)  COLD_DRY (deep-blue)  COOL_WET  (cyan)
    HOT_HUMID:    '#f97316',  // C+H warm + moist  (cool + dehumidify)
    HOT_DRY:      '#ef4444',  // C+D warm + arid   (cool + humidify)
    COOL_WET:     '#06b6d4',  // C-H cool + moist  (heat + dehumidify)
    COLD_DRY:     '#1d4ed8',  // C-D cool + arid   (heat + humidify)
    // Backward-compat aliases (older callers reference these names).
    HOT_OUTSIDE:  '#f97316',  // old name -> HOT_HUMID
    COLD_OUTSIDE: '#1d4ed8',  // old name -> COLD_DRY
    // Tier-dot colours (legend pills + per-VAV state indicators).  Decoupled
    // from the polygon fills so the chart geometry stays emerald while the
    // legend can offer clearer hue contrast.
    TIER_A_DOT:   '#10b981',  // bright emerald — true comfort, hold
    TIER_B_DOT:   '#a8c0a8',  // sage / light green-grey — comfort zone, RH soft-trim
};

// Humidity classification per industry standard.
// Used to split the OUTSIDE of the comfort zone into wet vs dry quadrants.
//
// Threshold: Relative Humidity = 50%  (midpoint of the ASHRAE Standard
// 55-2020 recommended 40-60% comfort band).  Why RH and not humidity
// ratio W? -- Cool air physically cannot hold much moisture, so a W-based
// threshold mis-labels e.g. 17 C / 90% RH as "dry" even though occupants
// would call that air "damp" (mold risk per ASHRAE 62.1-2022 Sec. 5.10).
// RH-based classification matches both occupant perception AND the
// IAQ thresholds used by ASHRAE 62.1 (60% upper) and ASHRAE 55 (40%
// lower comfort recommended band).
//
// References:
//   ASHRAE Standard 55-2020 - Thermal Environmental Conditions for Human Occupancy
//   ASHRAE Standard 62.1-2022 - Ventilation for Acceptable Indoor Air Quality
//   ASHRAE Handbook of Fundamentals 2021, Ch. 9 (Thermal Comfort)
const RH_WET_DRY_SPLIT = 50;   // %RH; midpoint of 40-60 comfort band

// Givoni-aware tier classification + control-strategy resolver.
// Returns a single object describing where the (T, RH, W) point sits
// relative to the Givoni overlay AND what the controller should do
// about it.  Tiers:
//   A    - inside CZ AND inside operator-defined sweet-spot RH strip
//          -> HOLD setpoints (true comfort)
//   B    - inside CZ but outside sweet-spot strip
//          -> SOFT TRIM (RH-only humidify or dehumidify; no temp change)
//   C+H  - outside CZ, warm + moist  (T >= 23.5, W >= WET_DRY_SPLIT)
//          -> mech cool + dehumidify
//   C+D  - outside CZ, warm + arid   (T >= 23.5, W <  WET_DRY_SPLIT)
//          -> mech cool + humidify  (rare; arid-summer climates)
//   C-H  - outside CZ, cool + moist  (T <  23.5, W >= WET_DRY_SPLIT)
//          -> mech heat + dehumidify (shoulder-season "cold-and-clammy")
//   C-D  - outside CZ, cool + arid   (T <  23.5, W <  WET_DRY_SPLIT)
//          -> mech heat + humidify  (classic winter)
//
// The wet/dry split uses humidity ratio W (kg dry air) -- the proper
// absolute-moisture measure per ASHRAE Handbook Fundamentals.  Using RH
// here would be wrong because cool air at 89% RH carries much LESS
// moisture than warm air at 60% RH, yet RH-only logic would label the
// cool-air state "dry."
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
            dotFill: GIVONI_COLORS.TIER_A_DOT,
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
            dotFill: GIVONI_COLORS.TIER_B_DOT,
            dotOpacity: 1,
            ringStroke: GIVONI_COLORS.SWEET_STROKE,
            strategy,
            label: 'Soft trim',
            subLabel,
            tooltip: ('In Givoni CZ but outside ' + _ss.lo + '-' + _ss.hi + '% RH | Soft trim ' + (tooLow ? 'humidify' : 'dehumidify')),
        };
    }

    // Tier C — outside Givoni.  Split into 4 quadrants per ASHRAE
    // Standard 55-2020 + 62.1-2022 conventions:
    //   warm/cool axis: T threshold = 23.5 C  (CZ centroid)
    //   wet/dry  axis: RH threshold = 50%      (midpoint of 40-60 band)
    const hotSide = t >= 23.5;
    const wetSide = rh >= RH_WET_DRY_SPLIT;

    if (hotSide && wetSide) {
        return {
            tier: 'C+H',
            dotFill: GIVONI_COLORS.HOT_HUMID,
            dotOpacity: 1,
            ringStroke: '#9a3412',
            strategy: 'COOL_DEHUMIDIFY',
            label: 'Hot/humid',
            subLabel: 'cool + dehumidify',
            tooltip: ('Outside CZ - warm + humid (' + t.toFixed(1) + ' C, ' + rh.toFixed(0) + '% RH) | cool + dehumidify'),
        };
    }
    if (hotSide && !wetSide) {
        return {
            tier: 'C+D',
            dotFill: GIVONI_COLORS.HOT_DRY,
            dotOpacity: 1,
            ringStroke: '#7f1d1d',
            strategy: 'COOL_HUMIDIFY',
            label: 'Hot/dry',
            subLabel: 'cool + humidify',
            tooltip: ('Outside CZ - warm + arid (' + t.toFixed(1) + ' C, ' + rh.toFixed(0) + '% RH) | evaporative cool + humidify'),
        };
    }
    if (!hotSide && wetSide) {
        return {
            tier: 'C-H',
            dotFill: GIVONI_COLORS.COOL_WET,
            dotOpacity: 1,
            ringStroke: '#155e75',
            strategy: 'HEAT_DEHUMIDIFY',
            label: 'Cool/humid',
            subLabel: 'heat + dehumidify',
            tooltip: ('Outside CZ - cool + humid (' + t.toFixed(1) + ' C, ' + rh.toFixed(0) + '% RH) | heat + dehumidify'),
        };
    }
    // !hotSide && !wetSide -- cool + arid (heated indoor air, winter)
    return {
        tier: 'C-D',
        dotFill: GIVONI_COLORS.COLD_DRY,
        dotOpacity: 1,
        ringStroke: '#1e3a8a',
        strategy: 'HEAT_HUMIDIFY',
        label: 'Cool/dry',
        subLabel: 'heat + humidify',
        tooltip: ('Outside CZ - cool + arid (' + t.toFixed(1) + ' C, ' + rh.toFixed(0) + '% RH) | heat + humidify'),
    };
};
