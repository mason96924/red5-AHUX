/**
 * Chart Grid Component
 * 
 * Renders psychrometric chart grid with:
 * - Temperature grid lines
 * - Humidity ratio grid lines
 * - RH curves (10-100%)
 * - Enthalpy lines
 * - Saturation curve
 * 
 * ASHRAE RP-1485 - DO NOT MODIFY CORE CALCULATIONS
 */

import React from 'react';
import { getPsat, getW } from '../../utils/psychrometric';

const ChartGrid = ({ 
    tempRange, 
    width, 
    height, 
    gridWidth, 
    gridHeight, 
    pad, 
    x, 
    y, 
    theme 
}) => {
    const T_MIN = tempRange.min;
    const T_MAX = tempRange.max;
    const W_MAX = 30; // g/kg
    
    const ui = theme === 'dark' 
        ? { svgText: '#94a3b8', svgAxis: '#475569', gridMajor: '#475569', gridMinor: '#334155' }
        : { svgText: '#475569', svgAxis: '#1e293b', gridMajor: '#cbd5e1', gridMinor: '#e2e8f0' };

    const elements = [];

    // Temperature grid lines (vertical)
    for (let t_idx = Math.floor(T_MIN); t_idx <= T_MAX; t_idx++) {
        const isMajor = t_idx % 5 === 0;
        const wSat = getW(t_idx, 100);
        const ySatLine = Math.max(pad.top, y(wSat));
        
        elements.push(
            <line
                key={`v-grid-${t_idx}`}
                x1={x(t_idx)}
                y1={ySatLine}
                x2={x(t_idx)}
                y2={pad.top + gridHeight}
                stroke={ui.gridMajor}
                strokeWidth={isMajor ? 1.5 : 0.8}
                opacity={isMajor ? 0.6 : 0.2}
            />
        );
        
        if (isMajor) {
            elements.push(
                <text
                    key={`tl-${t_idx}`}
                    x={x(t_idx)}
                    y={pad.top + gridHeight + 25}
                    textAnchor="middle"
                    fill={ui.svgText}
                    fontSize="12"
                    fontWeight="900"
                    className="font-mono"
                >
                    {t_idx}
                </text>
            );
        }
    }

    // Humidity ratio grid lines (horizontal)
    for (let wVal = 0; wVal <= W_MAX; wVal += 5) {
        elements.push(
            <line
                key={`w-grid-${wVal}`}
                x1={pad.left}
                y1={y(wVal / 1000)}
                x2={pad.left + gridWidth}
                y2={y(wVal / 1000)}
                stroke={ui.gridMajor}
                strokeWidth="0.8"
                opacity="0.4"
            />
        );
        
        elements.push(
            <text
                key={`wval-${wVal}`}
                x={pad.left + gridWidth + 10}
                y={y(wVal / 1000) + 4}
                fill={ui.svgText}
                fontSize="10"
                fontWeight="900"
                className="font-mono"
            >
                {wVal}
            </text>
        );
    }

    // RH curves (10%, 20%, ..., 100%)
    [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].forEach(rh => {
        const pts = [];
        
        for (let t_pt = T_MIN; t_pt <= T_MAX; t_pt += 0.5) {
            const w = getW(t_pt, rh);
            if (w <= W_MAX / 1000 + 0.005) {
                pts.push(`${x(t_pt)},${y(w)}`);
            }
        }
        
        if (pts.length > 0) {
            elements.push(
                <path
                    key={`rh-${rh}`}
                    d={`M ${pts.join(' L ')}`}
                    fill="none"
                    stroke={rh === 100 ? '#4f46e5' : ui.gridMajor}
                    strokeWidth={rh === 100 ? 2 : 1}
                    opacity="0.4"
                />
            );
            
            // Label RH curves
            let labelT = T_MAX - 1.5;
            while (getW(labelT, rh) > (W_MAX / 1000 - 0.001) && labelT > T_MIN) {
                labelT -= 0.5;
            }
            
            if (labelT > T_MIN && rh !== 100) {
                elements.push(
                    <text
                        key={`rhl-${rh}`}
                        x={x(labelT)}
                        y={y(getW(labelT, rh)) - 5}
                        fill={rh === 100 ? '#4f46e5' : ui.svgText}
                        fontSize="9"
                        fontWeight="900"
                        textAnchor="middle"
                        opacity="0.7"
                        className="font-mono"
                    >
                        {rh}%
                    </text>
                );
            }
        }
    });

    // Enthalpy lines (-20 to 120 kJ/kg)
    for (let h_val = -20; h_val <= 120; h_val += 10) {
        const pts = [];
        
        for (let temp = T_MIN; temp <= T_MAX; temp += 1) {
            const w = (h_val - 1.006 * temp) / (2501 + 1.86 * temp);
            if (w >= 0 && w <= W_MAX / 1000 + 0.002) {
                pts.push(`${x(temp)},${y(w)}`);
            }
        }
        
        if (pts.length > 1) {
            elements.push(
                <path
                    key={`h-${h_val}`}
                    d={`M ${pts.join(' L ')}`}
                    fill="none"
                    stroke="#f472b6"
                    strokeWidth="0.6"
                    strokeDasharray="6,4"
                    opacity="0.4"
                />
            );
            
            const lp = pts[0].split(',');
            elements.push(
                <text
                    key={`hl-${h_val}`}
                    x={parseFloat(lp[0]) - 8}
                    y={parseFloat(lp[1]) - 8}
                    fill="#f472b6"
                    fontSize="9"
                    fontWeight="900"
                    textAnchor="end"
                    opacity="0.8"
                >
                    {h_val}
                </text>
            );
        }
    }

    // Enthalpy label
    const tAtH85 = (85 - 2501 * 0.031) / (1.006 + 1.86 * 0.031);
    elements.push(
        <text
            key="h-title"
            x={x(tAtH85)}
            y={pad.top - 8}
            fill="#f472b6"
            fontSize="10"
            fontWeight="900"
            opacity="0.8"
            className="font-mono uppercase tracking-widest shadow-black"
            textAnchor="middle"
        >
            Enthalpy (kJ/kg)
        </text>
    );

    // Saturation curve label
    const satW25 = getW(25, 100);
    const xSatPos = x(25);
    const ySatPos = y(satW25);
    const xNext = x(25.5);
    const yNext = y(getW(25.5, 100));
    const angle = Math.atan2(yNext - ySatPos, xNext - xSatPos) * (180 / Math.PI);
    
    elements.push(
        <text
            key="satLabel"
            x={xSatPos}
            y={ySatPos - 12}
            fill="#cc00ff"
            fontSize="10"
            fontWeight="900"
            textAnchor="middle"
            transform={`rotate(${angle}, ${xSatPos}, ${ySatPos - 12})`}
            className="tracking-widest uppercase shadow-black font-black font-mono"
        >
            Saturation Line
        </text>
    );

    // Axis labels
    elements.push(
        <text
            key="x-axis-label"
            x={pad.left + gridWidth / 2}
            y={pad.top + gridHeight + 70}
            textAnchor="middle\"
            fill={ui.svgAxis}
            fontSize="14\"
            fontWeight="900\"
            className="uppercase tracking-[0.3em] font-black italic shadow-black\"
        >
            Dry Bulb Temp (°C)
        </text>
    );

    elements.push(
        <text
            key="y-axis-label"
            x={pad.left + gridWidth + 65}
            y={pad.top + gridHeight / 2}
            transform={`rotate(-90, ${pad.left + gridWidth + 65}, ${pad.top + gridHeight / 2})`}
            textAnchor="middle"
            fill={ui.svgAxis}
            fontSize="14"
            fontWeight="900"
            className="uppercase tracking-[0.3em] font-black italic shadow-black"
        >
            Humidity Ratio (g/kg)
        </text>
    );

    return <g className="chart-grid\">{elements}</g>;
};

export default ChartGrid;
