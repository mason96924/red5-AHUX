/**
 * Givoni Comfort Zones Overlay
 * 
 * Renders bioclimatic comfort zones:
 * - Comfort Zone (20-25°C, 20-80% RH)
 * - Natural Ventilation
 * - Evaporative Cooling
 * - Thermal Mass Cooling
 * - Mechanical Cooling + Natural Ventilation
 * - Winter Zone (18-19.5°C)
 * 
 * Based on Givoni bioclimatic chart methodology
 */

import React from 'react';
import { getW } from '../../utils/psychrometric';

const GivoniOverlay = ({ x, y, pad, gridHeight }) => {
    // Comfort Zone (20-25°C, 80% RH boundary)
    const rh80 = [];
    for (let t = 20; t <= 25; t += 0.5) {
        rh80.push([t, getW(t, 80)]);
    }

    const rh100 = [];
    for (let t = 20; t <= 27; t += 0.5) {
        rh100.push([t, getW(t, 100)]);
    }

    const rh20Line = [];
    for (let t = 32; t >= 20; t -= 0.5) {
        rh20Line.push([t, getW(t, 20)]);
    }

    const rh20_CZ = [];
    for (let t = 27; t >= 20; t -= 0.5) {
        rh20_CZ.push([t, getW(t, 20)]);
    }

    // Define zone polygons
    const CZ = [...rh80, [27, getW(27, 50)], [27, getW(27, 20)], ...rh20_CZ];
    const NV = [...rh100, [32, 15.4 / 1000], [32, 6.2 / 1000], ...rh20Line];
    const Mass = [...rh80, [33, 16 / 1000], [37, getW(37, 30)], [37, 3 / 1000], [20, getW(20, 20)]];
    const MCV = [...rh80, [40, 16 / 1000], [44, getW(44, 20)], [44, 3 / 1000], [20, getW(20, 20)]];
    const EVAP = [...rh80, [25, 16 / 1000], [36, getW(36, 30)], [39, getW(39, 20)], [41, getW(41, 10)], [41, 0], [27.2, 0], [20, getW(20, 20)]];

    // Winter zone (18-19.5°C)
    const winterRH80 = [];
    for (let t = 18; t <= 19.5; t += 0.5) {
        winterRH80.push([t, getW(t, 80)]);
    }

    const winterRH20 = [];
    for (let t = 19.5; t >= 18; t -= 0.5) {
        winterRH20.push([t, getW(t, 20)]);
    }

    const WINTER = [...winterRH80, ...winterRH20];

    const safePts = (arr) => arr.map(p => `${x(p[0])},${y(p[1])}`).join(' ');

    // 19°C winter boundary line
    const wSat19 = getW(19, 100);
    const ySat19 = y(wSat19);
    const yLineTop19 = ySat19 - 85;

    return (
        <g className="pointer-events-none opacity-80 shadow-black">
            {/* Mechanical Cooling boundary lines */}
            <line 
                x1={x(40)} 
                y1={y(16 / 1000)} 
                x2={x(50)} 
                y2={y(16 / 1000)} 
                stroke="#6366f1" 
                strokeWidth="1.5" 
                strokeDasharray="4,4" 
            />
            <line 
                x1={x(50)} 
                y1={y(16 / 1000)} 
                x2={x(50)} 
                y2={y(0)} 
                stroke="#6366f1" 
                strokeWidth="1.5" 
                strokeDasharray="4,4" 
            />
            <line 
                x1={x(41)} 
                y1={y(0)} 
                x2={x(50)} 
                y2={y(0)} 
                stroke="#6366f1" 
                strokeWidth="1.5" 
                strokeDasharray="4,4" 
            />

            {/* Zone polygons */}
            <polygon 
                points={safePts(MCV)} 
                fill="#ec4899" 
                fillOpacity="0.05" 
                stroke="#ec4899" 
                strokeWidth="1" 
            />
            <polygon 
                points={safePts(Mass)} 
                fill="#8b5cf6" 
                fillOpacity="0.05" 
                stroke="#8b5cf6" 
                strokeWidth="1" 
            />
            <polygon 
                points={safePts(EVAP)} 
                fill="#06b6d4" 
                fillOpacity="0.08" 
                stroke="#06b6d4" 
                strokeWidth="1" 
            />
            <polygon 
                points={safePts(NV)} 
                fill="#f59e0b" 
                fillOpacity="0.05" 
                stroke="#f59e0b" 
                strokeWidth="1" 
            />
            <polygon 
                points={safePts(CZ)} 
                fill="#10b981" 
                fillOpacity="0.15" 
                stroke="#10b981" 
                strokeWidth="1.2" 
            />

            {/* Winter zone */}
            <polygon 
                points={safePts(WINTER)} 
                fill="#3b82f6" 
                fillOpacity="0.15" 
                stroke="none" 
            />
            <path 
                d={`M ${safePts(winterRH20)} L ${safePts(winterRH80)}`} 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="1.5" 
                strokeDasharray="4,4" 
                opacity="0.8" 
            />

            {/* 19°C boundary line */}
            <line 
                x1={x(19)} 
                y1={yLineTop19} 
                x2={x(19)} 
                y2={pad.top + gridHeight} 
                stroke="#3b82f6" 
                strokeWidth="2" 
                strokeDasharray="6,4" 
                opacity="0.8" 
            />
            <text 
                x={x(19) - 5} 
                y={yLineTop19 + 5} 
                fill="#3b82f6" 
                fontSize="10" 
                fontWeight="900" 
                transform={`rotate(-90, ${x(19) - 5}, ${yLineTop19 + 5})`} 
                className="uppercase font-black shadow-black drop-shadow-md" 
                textAnchor="end"
            >
                19°C Boundary
            </text>

            {/* Zone labels */}
            <text 
                x={x(50) - 10} 
                y={y(8 / 1000)} 
                fill="#6366f1" 
                fontSize="10" 
                textAnchor="middle" 
                transform={`rotate(-90, ${x(50) - 10}, ${y(8 / 1000)})`} 
                className="uppercase font-black font-mono tracking-widest shadow-black"
            >
                Mechanical Cooling
            </text>

            <text 
                x={x(44) - 18} 
                y={y(8 / 1000)} 
                fill="#ec4899" 
                fontSize="9" 
                textAnchor="middle" 
                transform={`rotate(-90, ${x(44) - 18}, ${y(8 / 1000)})`} 
                className="uppercase font-black font-mono tracking-tighter shadow-black"
            >
                Mass Cooling
            </text>
            <text 
                x={x(44) - 2} 
                y={y(8 / 1000)} 
                fill="#ec4899" 
                fontSize="9" 
                textAnchor="middle" 
                transform={`rotate(-90, ${x(44) - 2}, ${y(8 / 1000)})`} 
                className="uppercase font-black font-mono tracking-tighter shadow-black"
            >
                & Natural Vent.
            </text>

            <text 
                x={x(37) - 10} 
                y={y(8 / 1000)} 
                fill="#8b5cf6" 
                fontSize="9" 
                textAnchor="middle" 
                transform={`rotate(-90, ${x(37) - 10}, ${y(8 / 1000)})`} 
                className="uppercase font-black font-mono tracking-tighter shadow-black"
            >
                Mass Cooling
            </text>

            <text 
                x={x(34)} 
                y={y(0.5 / 1000) - 8} 
                fill="#06b6d4" 
                fontSize="9" 
                textAnchor="middle" 
                className="uppercase font-black font-mono tracking-widest shadow-black"
            >
                Evaporative
            </text>

            {/* Natural Ventilation curved label */}
            <path 
                id="nv-curve-label" 
                d={`M ${x(21)},${y(getW(21, 100)) + 22} Q ${x(24)},${y(getW(24, 100)) + 22} ${x(27)},${y(getW(27, 100)) + 22}`} 
                fill="none" 
            />
            <text 
                fill="#f59e0b" 
                fontSize="9" 
                fontWeight="900" 
                className="uppercase font-black font-mono tracking-widest shadow-black"
            >
                <textPath href="#nv-curve-label" startOffset="10%">
                    Natural Ventilation
                </textPath>
            </text>

            <text 
                x={x(23.5)} 
                y={y(getW(23.5, 45))} 
                fill="#10b981" 
                fontSize="11" 
                fontWeight="900" 
                textAnchor="middle" 
                className="uppercase font-black drop-shadow-md shadow-black"
            >
                Comfort
            </text>

            <text 
                x={x(18.75)} 
                y={y(getW(18.75, 45))} 
                fill="#3b82f6" 
                fontSize="11" 
                fontWeight="900" 
                textAnchor="middle" 
                transform={`rotate(-90, ${x(18.75)}, ${y(getW(18.75, 45))})`} 
                className="uppercase font-black drop-shadow-md shadow-black"
            >
                Winter
            </text>
        </g>
    );
};

export default GivoniOverlay;
