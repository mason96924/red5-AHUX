/**
 * Psychrometric Calculations (Client-side)
 * 
 * JavaScript mirror of backend/scripts/psychrometric.py
 * ASHRAE RP-1485 formulations - DO NOT MODIFY CORE MATH
 */

// Atmospheric pressure (kPa)
export const P_ATM = 101.325;

/**
 * Calculate saturation vapor pressure (ASHRAE RP-1485)
 * @param {number} t - Dry bulb temperature (°C)
 * @returns {number} - Saturation pressure (kPa)
 */
export const getPsat = (t) => {
    const tk = t + 273.15;
    
    if (tk <= 173.15) return 0.0001;
    
    try {
        let lnP;
        
        if (tk < 273.15) {
            // Ice (below freezing)
            const c = [
                -5.6745359e3,
                6.3925247,
                -9.677843e-3,
                6.2215701e-7,
                2.0747825e-9,
                -9.484024e-13,
                4.1635019
            ];
            lnP = (
                c[0] / tk + c[1] + c[2] * tk + c[3] * Math.pow(tk, 2) +
                c[4] * Math.pow(tk, 3) + c[5] * Math.pow(tk, 4) + c[6] * Math.log(tk)
            );
        } else {
            // Water (above freezing)
            const c = [
                -5.8002206e3,
                1.3914993,
                -4.8640239e-2,
                4.1764768e-5,
                -1.4452093e-8,
                6.5459673
            ];
            lnP = (
                c[0] / tk + c[1] + c[2] * tk + c[3] * Math.pow(tk, 2) +
                c[4] * Math.pow(tk, 3) + c[5] * Math.log(tk)
            );
        }
        
        return Math.exp(lnP) / 1000; // Convert Pa to kPa
    } catch (e) {
        return 0.001;
    }
};

/**
 * Calculate humidity ratio from temperature and relative humidity
 * @param {number} t - Dry bulb temperature (°C)
 * @param {number} rh - Relative humidity (%)
 * @param {number} pAtm - Atmospheric pressure (kPa)
 * @returns {number} - Humidity ratio (kg/kg)
 */
export const getW = (t, rh, pAtm = P_ATM) => {
    const psat = getPsat(t);
    const pw = (rh / 100.0) * psat;
    
    const denom = pAtm - pw;
    if (denom <= 0.1) return 0.031; // Maximum reasonable value
    
    const w = (0.621945 * pw) / denom;
    return Math.max(0.0001, Math.min(0.031, w));
};

/**
 * Calculate enthalpy from temperature and humidity ratio
 * @param {number} t - Dry bulb temperature (°C)
 * @param {number} w - Humidity ratio (kg/kg)
 * @returns {number} - Enthalpy (kJ/kg)
 */
export const getH = (t, w) => {
    // h = cp_air * T + W * (h_fg + cp_vapor * T)
    // Simplified: h ≈ 1.006*T + W*(2501 + 1.86*T)
    return 1.006 * t + w * (2501 + 1.86 * t);
};

/**
 * Calculate relative humidity from temperature and humidity ratio
 * @param {number} t - Dry bulb temperature (°C)
 * @param {number} w - Humidity ratio (kg/kg)
 * @param {number} pAtm - Atmospheric pressure (kPa)
 * @returns {number} - Relative humidity (%)
 */
export const getRHfromW = (t, w, pAtm = P_ATM) => {
    const psat = getPsat(t);
    const pw = (w * pAtm) / (0.621945 + w);
    const rh = Math.min(100.0, Math.max(0.0, (pw / psat) * 100));
    return rh;
};

/**
 * Calculate dew point temperature
 * @param {number} t - Dry bulb temperature (°C)
 * @param {number} rh - Relative humidity (%)
 * @param {number} maxIterations - Maximum iterations
 * @returns {number} - Dew point temperature (°C)
 */
export const getDewPoint = (t, rh, maxIterations = 20) => {
    const w = getW(t, rh);
    
    // Binary search for dew point
    let low = -50.0;
    let high = t;
    
    for (let i = 0; i < maxIterations; i++) {
        const mid = (low + high) / 2;
        const wSat = getW(mid, 100.0);
        
        if (wSat < w) {
            low = mid;
        } else {
            high = mid;
        }
    }
    
    return high;
};

/**
 * Safe value wrapper for calculations
 * @param {number} val - Value to check
 * @returns {number} - Safe value (0 if invalid)
 */
export const safe = (val) => {
    return (typeof val === 'number' && Number.isFinite(val)) ? val : 0;
};

/**
 * Process a complete psychrometric point
 * @param {number} t - Temperature (°C)
 * @param {number} rh - Relative humidity (%)
 * @returns {object} - Complete point properties
 */
export const processPoint = (t, rh) => {
    const w = getW(t, rh);
    const h = getH(t, w);
    const dewPoint = getDewPoint(t, rh);
    
    return {
        t,
        rh,
        w,
        h,
        dewPoint
    };
};
