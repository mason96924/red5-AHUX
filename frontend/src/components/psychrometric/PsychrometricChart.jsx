/**
 * Psychrometric Chart Component (Main Orchestrator)
 * 
 * Combines all sub-components:
 * - ChartGrid (ASHRAE grid, RH curves, enthalpy)
 * - GivoniOverlay (comfort zones)
 * - VectorDisplay (process vectors)
 * - AHU/VAV point plotting
 * - Process path lines
 * - Draggable indicator
 * 
 * ASHRAE RP-1485 - ALL CALCULATIONS PRESERVED
 */

import React, { useRef } from 'react';
import ChartGrid from './ChartGrid';
import GivoniOverlay from './GivoniOverlay';
import VectorDisplay from './VectorDisplay';
import { getPsat, getH } from '../../utils/psychrometric';

const P_ATM = 101.325;

const PsychrometricChart = ({
    width = 1300,
    height = 750,
    tempRange,
    theme,
    showGivoni,
    ahuData,
    selectedAhuId,
    selectedAhu,
    pointVisibility,
    showPath,
    indicatorPos,
    setIndicatorPos,
    isDraggingIndicator,
    setIsDraggingIndicator,
    vecVis,
    lockedVavId,
    isLockedToSA,
    onIndicatorDragStart,
    onVavClick
}) => {
    const svgRef = useRef(null);
    
    const T_MIN = tempRange.min;
    const T_MAX = tempRange.max;
    const W_MAX = 30;
    
    const gridWidth = 1092;
    const gridHeight = 540;
    const pad = { left: 90, right: 100, top: 105, bottom: 105 };

    const ui = theme === 'dark'
        ? { chartBg: '#020617', heading: 'text-white/90' }
        : { chartBg: '#ffffff', heading: 'text-slate-900' };

    const x = (temp) => {
        const val = pad.left + ((temp - T_MIN) / (T_MAX - T_MIN)) * gridWidth;
        return isFinite(val) ? val : pad.left;
    };

    const y = (moist) => {
        const val = (pad.top + gridHeight) - (moist / (W_MAX / 1000)) * gridHeight;
        return isFinite(val) ? val : pad.top + gridHeight;
    };

    const invX = (mx) => T_MIN + ((mx - pad.left) / gridWidth) * (T_MAX - T_MIN);
    const invY = (my) => ((pad.top + gridHeight - my) / gridHeight) * (W_MAX / 1000);

    const handleMouseMove = (e) => {
        if (isDraggingIndicator && svgRef.current) {
            const rect = svgRef.current.getBoundingClientRect();
            const mx = (e.clientX - rect.left) * (width / rect.width);
            const my = (e.clientY - rect.top) * (height / rect.height);
            
            let tCand = Math.max(T_MIN, Math.min(T_MAX, invX(mx)));
            let wCand = Math.max(0, invY(my));
            
            setIndicatorPos({ t: tCand, w: wCand });
        }
    };

    return (
        <div
            className="flex-1 relative flex items-center justify-center overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseUp={() => setIsDraggingIndicator(false)}
        >
            <div className="absolute top-10 left-24 z-10 pointer-events-none">
                <h2 className={`text-3xl font-black italic uppercase ${ui.heading} tracking-tight`}>
                    Psychrometric <span className="text-indigo-500">Chart</span>
                </h2>
            </div>

            <svg
                ref={svgRef}
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-full cursor-crosshair"
            >
                <defs>
                    <marker id="arrow-pink" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
                        <path d="M0,0 L0,6 L6,3 Z" fill="#f472b6" />
                    </marker>
                    <marker id="arrow-yellow" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
                        <path d="M0,0 L0,6 L6,3 Z" fill="#fbbf24" />
                    </marker>
                    <marker id="arrow-blue" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
                        <path d="M0,0 L0,6 L6,3 Z" fill="#60a5fa" />
                    </marker>
                    <marker id="arrow-emerald" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
                        <path d="M0,0 L0,6 L6,3 Z" fill="#10b981" />
                    </marker>
                </defs>

                <rect x={pad.left} y={pad.top} width={gridWidth} height={gridHeight} fill={ui.chartBg} />

                <ChartGrid
                    tempRange={tempRange}
                    width={width}
                    height={height}
                    gridWidth={gridWidth}
                    gridHeight={gridHeight}
                    pad={pad}
                    x={x}
                    y={y}
                    theme={theme}
                />

                {showGivoni && <GivoniOverlay x={x} y={y} pad={pad} gridHeight={gridHeight} />}

                {ahuData.map(ahu => {
                    const isFocused = selectedAhuId === ahu.id;
                    
                    return (
                        <g key={ahu.id} opacity={selectedAhuId && !isFocused ? 0.12 : 1}>
                            {isFocused && showPath && (
                                <g>
                                    {pointVisibility.OA && pointVisibility.SA && (
                                        <line
                                            x1={x(ahu.points[0].t)}
                                            y1={y(ahu.points[0].w)}
                                            x2={x(ahu.points[1].t)}
                                            y2={y(ahu.points[1].w)}
                                            stroke={ahu.procColor}
                                            strokeWidth={3.5}
                                        />
                                    )}
                                    {pointVisibility.SA && pointVisibility.RA && (
                                        <line
                                            x1={x(ahu.points[1].t)}
                                            y1={y(ahu.points[1].w)}
                                            x2={x(ahu.points[2].t)}
                                            y2={y(ahu.points[2].w)}
                                            stroke={ahu.procColor}
                                            strokeWidth={3.5}
                                        />
                                    )}
                                </g>
                            )}

                            {ahu.points && ahu.points.map(p => {
                                if (pointVisibility[p.label] === false) return null;
                                
                                return (
                                    <g key={p.label}>
                                        <circle
                                            cx={x(p.t)}
                                            cy={y(p.w)}
                                            r={isFocused ? 6.5 : 4}
                                            fill={p.color}
                                            stroke={theme === 'dark' ? 'white' : '#334155'}
                                            strokeWidth="2"
                                        />
                                        {isFocused && p.label === 'SA' && (
                                            <text
                                                x={x(p.t)}
                                                y={y(p.w) - 15}
                                                textAnchor="middle"
                                                fill={theme === 'dark' ? 'white' : '#000'}
                                                fontSize="12"
                                                fontWeight="900"
                                            >
                                                {ahu.id}
                                            </text>
                                        )}
                                    </g>
                                );
                            })}

                            {isFocused && ahu.vavs && ahu.vavs.map(v => {
                                const isThisLocked = lockedVavId === v.id;
                                
                                return (
                                    <g 
                                        key={v.id}
                                        style={{ cursor: 'pointer', pointerEvents: 'all' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (onVavClick) {
                                                onVavClick(v);
                                            }
                                        }}
                                    >
                                        <circle
                                            cx={x(v.t)}
                                            cy={y(v.w)}
                                            r={isThisLocked ? 5 : 3}
                                            fill={isThisLocked ? '#818cf8' : '#a78bfa'}
                                            stroke={isThisLocked ? '#fff' : '#312e81'}
                                            strokeWidth={isThisLocked ? 2 : 1}
                                        />
                                        {/* Invisible larger hit area for easier clicking */}
                                        <circle
                                            cx={x(v.t)}
                                            cy={y(v.w)}
                                            r={10}
                                            fill="transparent"
                                        />
                                    </g>
                                );
                            })}
                        </g>
                    );
                })}

                {(lockedVavId || isLockedToSA) && (
                    <VectorDisplay
                        indicatorPos={indicatorPos}
                        vecVis={vecVis}
                        x={x}
                        y={y}
                        tempRange={tempRange}
                        theme={theme}
                        lockedVavId={lockedVavId}
                        selectedAhu={selectedAhu}
                    />
                )}

                {/* Vector Legend Panel - Below X-axis, one line */}
                {(lockedVavId || isLockedToSA) && (
                    <g className="pointer-events-none">
                        {/* Legend box background */}
                        <rect 
                            x={pad.left} 
                            y={pad.top + gridHeight + 50} 
                            width="400" 
                            height="30" 
                            fill={theme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)'} 
                            stroke={theme === 'dark' ? '#475569' : '#cbd5e1'} 
                            strokeWidth="2" 
                            rx="6"
                        />
                        
                        {/* Enthalpy */}
                        {vecVis.enthalpy && (
                            <g>
                                <line 
                                    x1={pad.left + 10} 
                                    y1={pad.top + gridHeight + 65} 
                                    x2={pad.left + 35} 
                                    y2={pad.top + gridHeight + 65} 
                                    stroke="#f472b6" 
                                    strokeWidth="2" 
                                    strokeDasharray="6,3"
                                />
                                <text 
                                    x={pad.left + 40} 
                                    y={pad.top + gridHeight + 69} 
                                    fill="#f472b6" 
                                    fontSize="10" 
                                    fontWeight="700" 
                                    className="font-mono"
                                >
                                    Enthalpy
                                </text>
                            </g>
                        )}
                        
                        {/* Sensible */}
                        {vecVis.sensible && (
                            <g>
                                <line 
                                    x1={pad.left + 105} 
                                    y1={pad.top + gridHeight + 65} 
                                    x2={pad.left + 130} 
                                    y2={pad.top + gridHeight + 65} 
                                    stroke="#60a5fa" 
                                    strokeWidth="2" 
                                    strokeDasharray="6,3"
                                />
                                <text 
                                    x={pad.left + 135} 
                                    y={pad.top + gridHeight + 69} 
                                    fill="#60a5fa" 
                                    fontSize="10" 
                                    fontWeight="700" 
                                    className="font-mono"
                                >
                                    Sensible
                                </text>
                            </g>
                        )}
                        
                        {/* Latent */}
                        {vecVis.latent && (
                            <g>
                                <line 
                                    x1={pad.left + 200} 
                                    y1={pad.top + gridHeight + 65} 
                                    x2={pad.left + 225} 
                                    y2={pad.top + gridHeight + 65} 
                                    stroke="#fbbf24" 
                                    strokeWidth="2" 
                                    strokeDasharray="6,3"
                                />
                                <text 
                                    x={pad.left + 230} 
                                    y={pad.top + gridHeight + 69} 
                                    fill="#fbbf24" 
                                    fontSize="10" 
                                    fontWeight="700" 
                                    className="font-mono"
                                >
                                    Latent
                                </text>
                            </g>
                        )}
                        
                        {/* Diagnostic */}
                        {vecVis.diagnostic && (
                            <g>
                                <line 
                                    x1={pad.left + 285} 
                                    y1={pad.top + gridHeight + 65} 
                                    x2={pad.left + 310} 
                                    y2={pad.top + gridHeight + 65} 
                                    stroke="#10b981" 
                                    strokeWidth="2" 
                                    strokeDasharray="6,3"
                                />
                                <text 
                                    x={pad.left + 315} 
                                    y={pad.top + gridHeight + 69} 
                                    fill="#10b981" 
                                    fontSize="10" 
                                    fontWeight="700" 
                                    className="font-mono"
                                >
                                    Diagnostic
                                </text>
                            </g>
                        )}
                    </g>
                )}

                <g 
                    onMouseDown={() => {
                        setIsDraggingIndicator(true);
                        if (onIndicatorDragStart) onIndicatorDragStart();
                    }} 
                    className="cursor-move"
                    style={{ pointerEvents: 'all' }}
                >
                    <circle
                        cx={x(indicatorPos.t)}
                        cy={y(indicatorPos.w)}
                        r="4"
                        fill="white"
                        stroke="#6366f1"
                        strokeWidth="2.5"
                    />
                    
                    {/* Data box tooltip */}
                    {(() => {
                        if (!selectedAhu && !indicatorPos) return null;
                        
                        let tVal, rhVal, hVal, title;
                        if (lockedVavId && selectedAhu) {
                            const lockedVav = selectedAhu.vavs?.find(v => v.id === lockedVavId);
                            if (!lockedVav) return null;
                            tVal = lockedVav.t;
                            rhVal = lockedVav.rh;
                            hVal = lockedVav.h;
                            title = lockedVav.id;
                        } else {
                            if (!indicatorPos) return null;
                            tVal = indicatorPos.t;
                            const pw = (indicatorPos.w * 101.325) / (0.621945 + indicatorPos.w);
                            rhVal = Math.min(100, Math.max(0, (pw / getPsat(tVal)) * 100));
                            hVal = getH(indicatorPos.t, indicatorPos.w);
                            title = null;
                        }
                        
                        const saP = selectedAhu?.points?.find(p => p.label === 'SA');
                        const saH = saP ? getH(saP.t, saP.w) : 0;
                        const diffH = hVal - saH;
                        
                        return (
                            <g transform={`translate(${x(indicatorPos.t) + 8}, ${y(indicatorPos.w) + (title ? -45 : -35)})`} className="pointer-events-none">
                                <rect 
                                    x="0" 
                                    y="0" 
                                    width="85" 
                                    height={title ? "42" : "32"}
                                    fill="rgba(30, 41, 59, 0.95)"
                                    stroke="#6366f1"
                                    strokeWidth="2"
                                    rx="6"
                                />
                                {title && (
                                    <text 
                                        x="42.5" 
                                        y="12" 
                                        textAnchor="middle" 
                                        fill="#818cf8" 
                                        fontSize="8" 
                                        fontWeight="900" 
                                        className="uppercase tracking-widest"
                                    >
                                        {title}
                                    </text>
                                )}
                                <text 
                                    x="42.5" 
                                    y={title ? 24 : 14} 
                                    textAnchor="middle" 
                                    fill="#ffffff"
                                    fontSize="11" 
                                    fontWeight="900" 
                                    style={{ fontFamily: 'monospace' }}
                                >
                                    {String(tVal.toFixed(1)) + '° / ' + String(rhVal.toFixed(0)) + '%'}
                                </text>
                                <text 
                                    x="42.5" 
                                    y={title ? 36 : 26} 
                                    textAnchor="middle" 
                                    fill="#f472b6"
                                    fontSize="11" 
                                    fontWeight="900" 
                                    style={{ fontFamily: 'monospace' }}
                                >
                                    {'ΔH: ' + (diffH > 0 ? '+' : '') + String(diffH.toFixed(1))}
                                </text>
                            </g>
                        );
                    })()}
                </g>
            </svg>
        </div>
    );
};

export default PsychrometricChart;
