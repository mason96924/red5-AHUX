/**
 * Vector Display Component
 * 
 * Renders psychrometric process vectors:
 * - Enthalpy vectors (pink)
 * - Sensible heat vectors (blue)
 * - Latent heat vectors (yellow)
 * - Diagnostic vectors (green)
 * 
 * Includes saturation point and dew point indicators
 */

import React from 'react';
import { getPsat, getW, getH } from '../../utils/psychrometric';

const VectorDisplay = ({ 
    indicatorPos, 
    vecVis, 
    x, 
    y, 
    tempRange, 
    theme,
    lockedVavId,
    selectedAhu
}) => {
    if (!indicatorPos || !Number.isFinite(indicatorPos.t) || !Number.isFinite(indicatorPos.w)) {
        return null;
    }

    const pos = indicatorPos;
    const T_MIN = tempRange.min;
    const T_MAX = tempRange.max;
    
    // Calculate RH from W (humidity ratio) - do this OUTSIDE JSX
    const Pws = getPsat(pos.t);
    const Pw = (pos.w * 101.325) / (0.622 + pos.w);
    const RH = Math.round((Pw / Pws) * 100);
    
    // Calculate ΔH if AHU is selected
    let deltaH = 0;
    if (selectedAhu && selectedAhu.points) {
        const sa = selectedAhu.points.find(p => p.label === 'SA');
        if (sa) {
            deltaH = getH(pos.t, pos.w) - getH(sa.t, sa.w);
        }
    }
    
    const hI = getH(pos.t, pos.w);
    const xI = x(pos.t);
    const yI = y(pos.w);
    const ySat = y(getW(pos.t, 100));
    const dLen = 12;
    const yAxis = y(0);

    // Find enthalpy line intersection with saturation curve (Northwest)
    let low = -50, high = pos.t;
    for (let k = 0; k < 15; k++) {
        let mid = (low + high) / 2;
        if (((hI - 1.006 * mid) / (2501 + 1.86 * mid)) > getW(mid, 100)) {
            low = mid;
        } else {
            high = mid;
        }
    }
    const xNW = x(high);
    const yNW = y(getW(high, 100));

    // Find dew point
    let lD = -50, hD = pos.t;
    for (let k = 0; k < 20; k++) {
        let mid = (lD + hD) / 2;
        if (getW(mid, 100) < pos.w) {
            lD = mid;
        } else {
            hD = mid;
        }
    }
    const tDpCalculated = hD;
    const xDp = x(Math.max(T_MIN, tDpCalculated));
    const yDp = y(pos.w); // Dew point is at constant humidity ratio (horizontal line)

    // Southeast enthalpy vector
    let tSE = Math.min(pos.t + dLen, T_MAX);
    let wSE = (hI - 1.006 * tSE) / (2501 + 1.86 * tSE);
    if (wSE < 0) {
        wSE = 0;
        tSE = hI / 1.006;
    }
    const xSE = x(tSE);
    const ySE = y(wSE);

    // Diagonal slope for NE/SW vectors
    let dx = xSE - xI;
    let diagSlope = (Math.abs(dx) < 0.5) ? 0 : (ySE - yI) / dx * -1.5;
    
    let tNE = Math.min(pos.t + dLen, T_MAX);
    let xNE = x(tNE);
    let yNE = yI + diagSlope * (xNE - xI);

    let tSW = Math.max(pos.t - dLen, T_MIN);
    let xSW = x(tSW);
    let ySW = yI + diagSlope * (xSW - xI);
    if (ySW > yAxis) {
        ySW = yAxis;
        if (diagSlope !== 0) xSW = xI + (yAxis - yI) / diagSlope;
    }

    // Saturation pointer
    const satPointer = `M ${xI - 75},${ySat - 25} L ${xI - 15},${ySat - 25} L ${xI},${ySat}`;
    
    // Dew point pointer
    const dpPointer = `M ${xDp - 75},${yI - 25} L ${xDp - 15},${yI - 25} L ${xDp},${yI}`;

    // Latent path (vertical + curved to saturation)
    const tBendEnd = Math.min(T_MAX, pos.t + 4);
    const latentPath = [`${xI},${yI}`, `${xI},${ySat}`];
    for (let i = pos.t + 0.1; i <= tBendEnd; i += 0.1) {
        latentPath.push(`${x(i)},${y(getW(i, 100))}`);
    }

    // Sensible path (horizontal + curved to saturation)
    const sensPath = [`${xI},${yI}`, `${xDp},${yI}`];
    if (tDpCalculated >= T_MIN) {
        for (let i = tDpCalculated - 0.1; i >= Math.max(T_MIN, tDpCalculated - 5); i -= 0.1) {
            sensPath.push(`${x(i)},${y(getW(i, 100))}`);
        }
    }

    return (
        <g style={{ pointerEvents: 'none' }}>
            {/* Enthalpy vectors (pink) */}
            {vecVis.enthalpy && pos.w > 0.0001 && (
                <g>
                    <line 
                        x1={xI} 
                        y1={yI} 
                        x2={xNW} 
                        y2={yNW} 
                        stroke="#f472b6" 
                        strokeWidth="0.9" 
                        strokeDasharray="8,4" 
                        markerEnd="url(#arrow-pink)" 
                        opacity="0.9"
                    />
                    <line 
                        x1={xI} 
                        y1={yI} 
                        x2={xSE} 
                        y2={ySE} 
                        stroke="#f472b6" 
                        strokeWidth="0.9" 
                        strokeDasharray="8,4" 
                        markerEnd="url(#arrow-pink)" 
                        opacity="0.9"
                    />
                </g>
            )}

            {/* Latent vectors (yellow) */}
            {vecVis.latent && (
                <g>
                    <path 
                        d={`M ${latentPath.join(' L ')}`} 
                        fill="none" 
                        stroke="#fbbf24" 
                        strokeWidth="0.9" 
                        strokeDasharray="8,4" 
                        markerEnd="url(#arrow-yellow)" 
                    />
                    <line 
                        x1={xI} 
                        y1={yI} 
                        x2={xI} 
                        y2={yAxis} 
                        stroke="#fbbf24" 
                        strokeWidth="0.9" 
                        strokeDasharray="8,4" 
                        markerEnd="url(#arrow-yellow)" 
                    />
                    
                    {/* Saturation Point - EXACT monolithic implementation */}
                    <g>
                        <circle 
                            cx={xI} 
                            cy={ySat} 
                            r="5" 
                            fill="#fbbf24" 
                            stroke="#fff" 
                            strokeWidth="2"
                        />
                        
                        {/* Bent arrow path: M start L corner L marker */}
                        <path 
                            d={`M ${xI - 75},${ySat - 25} L ${xI - 15},${ySat - 25} L ${xI},${ySat}`}
                            fill="none" 
                            stroke="#fbbf24" 
                            strokeWidth="1.2" 
                            markerEnd="url(#arrow-yellow)"
                        />
                        
                        {/* Text to the left */}
                        <text 
                            x={xI - 80} 
                            y={ySat - 25} 
                            textAnchor="end" 
                            fill="#fbbf24" 
                            fontSize="9" 
                            fontWeight="900" 
                            className="italic font-mono"
                        >
                            Saturation
                        </text>
                    </g>
                </g>
            )}

            {/* Sensible vectors (blue) */}
            {vecVis.sensible && (
                <g>
                    <path 
                        d={`M ${sensPath.join(' L ')}`} 
                        fill="none" 
                        stroke="#60a5fa" 
                        strokeWidth="0.9" 
                        strokeDasharray="8,4" 
                        markerEnd="url(#arrow-blue)" 
                    />
                    <line 
                        x1={xI} 
                        y1={yI} 
                        x2={x(Math.min(pos.t + 10, T_MAX))} 
                        y2={yI} 
                        stroke="#60a5fa" 
                        strokeWidth="0.9" 
                        strokeDasharray="8,4" 
                        markerEnd="url(#arrow-blue)" 
                    />
                    
                    {/* Dew Point - EXACT monolithic implementation */}
                    <g>
                        <circle 
                            cx={xDp} 
                            cy={yDp} 
                            r="5" 
                            fill="#60a5fa" 
                            stroke="#fff" 
                            strokeWidth="2"
                        />
                        
                        {/* Bent arrow path: M start L corner L marker */}
                        <path 
                            d={`M ${xDp - 75},${yDp - 25} L ${xDp - 15},${yDp - 25} L ${xDp},${yDp}`}
                            fill="none" 
                            stroke="#60a5fa" 
                            strokeWidth="1.2" 
                            markerEnd="url(#arrow-blue)"
                        />
                        
                        {/* Text to the left */}
                        <text 
                            x={xDp - 80} 
                            y={yDp - 25} 
                            textAnchor="end" 
                            fill="#60a5fa" 
                            fontSize="11" 
                            fontWeight="900" 
                            style={{ fontFamily: 'monospace', fontStyle: 'italic' }}
                        >
                            {'Dew Point (' + String(tDpCalculated.toFixed(1)) + '°)'}
                        </text>
                    </g>
                </g>
            )}

            {/* Diagnostic vectors (green) */}
            {vecVis.diagnostic && (
                <g>
                    <line 
                        x1={xI} 
                        y1={yI} 
                        x2={xNE} 
                        y2={yNE} 
                        stroke="#10b981" 
                        strokeWidth="0.9" 
                        strokeDasharray="6,3" 
                        markerEnd="url(#arrow-emerald)" 
                        opacity="0.9"
                    />
                    <line 
                        x1={xI} 
                        y1={yI} 
                        x2={xI + (xSW - xI)} 
                        y2={yI + (ySW - yI)} 
                        stroke="#10b981" 
                        strokeWidth="0.9" 
                        strokeDasharray="6,3" 
                        markerEnd="url(#arrow-emerald)" 
                        opacity="0.9"
                    />
                </g>
            )}
        </g>
    );
};

export default VectorDisplay;
