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
const getVavDiagnostic = (vav, saPoint, comfortPoly) => {
    const demand = getZoneDemand(vav.t, vav.w, comfortPoly);
    const distSA = saPoint ? getPsyDistance(vav.t, vav.w, saPoint.t, saPoint.w) : 0;
    const deltaH = saPoint ? (vav.h - getH(saPoint.t, saPoint.w)) : 0;
    
    let status;
    if (demand.inCZ && distSA < 3) status = 'optimal';
    else if (demand.inCZ) status = 'comfort';
    else if (Math.abs(vav.t - 23.5) < 5.5) status = 'warning';
    else status = 'alarm';
    
    const totalDemand = demand.heatingDemand + demand.coolingDemand;
    
    return { ...demand, distSA, deltaH, status, totalDemand };
};

// AHU-level aggregate demand diagnostic
const getAhuDiagnostic = (ahu, comfortPoly) => {
    if (!ahu || !ahu.points || !ahu.vavs) return null;
    const oa = ahu.points[0], sa = ahu.points[1], ra = ahu.points[2];
    if (!oa || !sa || !ra) return null;
    
    const vavDiags = ahu.vavs.map(v => getVavDiagnostic(v, sa, comfortPoly));
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
    if (inCZCount === totalVavs) recs.push('All zones in CZ');
    
    return {
        process, inCZCount, totalVavs,
        totalHeating, totalCooling, avgDistSA,
        comfortPct: Math.round((inCZCount / totalVavs) * 100),
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
