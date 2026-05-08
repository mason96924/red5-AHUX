/**
 * AHU Equipment Modal
 * 
 * Displays:
 * - AHU equipment diagram with Korean labels (placeholder)
 * - OA/SA/RA telemetry display
 * - Fan speed control
 * - Energy exchange metrics
 * - Graphics loaded from [ABC]/data/graphics/ahu_diagram.png
 */

import React from 'react';
import { getH } from '../../utils/psychrometric';

const AhuModal = ({ 
    ahuData, 
    onClose, 
    theme, 
    fanSpeed, 
    setFanSpeed 
}) => {
    if (!ahuData) return null;

    const ui = theme === 'dark'
        ? {
            modal: 'bg-slate-900/98',
            border: 'border-slate-700',
            text: 'text-slate-100',
            textMuted: 'text-slate-400',
            input: 'bg-slate-800 border-slate-700 text-white'
        }
        : {
            modal: 'bg-white/98',
            border: 'border-slate-300',
            text: 'text-slate-900',
            textMuted: 'text-slate-500',
            input: 'bg-slate-100 border-slate-300 text-slate-900'
        };

    // Calculate energy metrics
    const oa = ahuData.points.find(p => p.label === 'OA');
    const sa = ahuData.points.find(p => p.label === 'SA');
    const ra = ahuData.points.find(p => p.label === 'RA');

    const exchange = sa && oa ? getH(sa.t, sa.w) - getH(oa.t, oa.w) : 0;
    const absorption = ra && sa ? getH(ra.t, ra.w) - getH(sa.t, sa.w) : 0;

    // Placeholder Korean labels
    const koreanLabels = {
        title: '공조기 장비',  // AHU Equipment
        outsideAir: '외기',  // Outside Air
        supplyAir: '급기',  // Supply Air
        returnAir: '환기',  // Return Air
        fanSpeed: '팬 속도',  // Fan Speed
        energyExchange: '에너지 교환',  // Energy Exchange
        energyAbsorption: '에너지 흡수'  // Energy Absorption
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`${ui.modal} border ${ui.border} rounded-2xl shadow-2xl w-[800px] max-h-[85vh] overflow-y-auto custom-scrollbar`}>
                {/* Header */}
                <div className={`p-6 border-b ${ui.border} flex justify-between items-center`}>
                    <div>
                        <h2 className="text-3xl font-black uppercase italic tracking-tight text-indigo-400">
                            {ahuData.id}
                        </h2>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-mono">
                            {koreanLabels.title}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className={`${ui.input} px-4 py-2 rounded-lg border text-sm font-bold hover:bg-opacity-80 transition-all`}
                    >
                        Close
                    </button>
                </div>

                {/* AHU Equipment Diagram */}
                <div className="p-6 border-b border-slate-700/30">
                    <div className="bg-slate-950/40 rounded-xl p-8 border border-indigo-500/20 relative">
                        {/* Placeholder for AHU diagram image */}
                        <div className="w-full h-80 bg-slate-800/50 rounded-lg flex items-center justify-center border border-dashed border-slate-600">
                            <div className="text-center">
                                <div className="text-slate-500 text-lg font-mono mb-2">
                                    🏭 AHU Equipment Diagram
                                </div>
                                <div className="text-[10px] text-slate-600 font-mono">
                                    Graphics path: [ABC]/data/graphics/ahu_diagram.png
                                </div>
                                <div className="text-[9px] text-slate-700 font-mono mt-2">
                                    (Korean labels: {koreanLabels.outsideAir}, {koreanLabels.supplyAir}, {koreanLabels.returnAir})
                                </div>
                            </div>
                        </div>

                        {/* Flow indicators */}
                        <div className="absolute top-1/3 left-4 w-8 h-8 bg-blue-500/30 rounded-full animate-pulse"></div>
                        <div className="absolute top-1/3 right-4 w-8 h-8 bg-emerald-500/30 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                        <div className="absolute bottom-1/3 right-4 w-8 h-8 bg-pink-500/30 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                    </div>
                </div>

                {/* Telemetry Grid (OA/SA/RA) */}
                <div className="p-6 border-b border-slate-700/30">
                    <h3 className="text-xs font-black uppercase tracking-widest text-pink-400 mb-4 font-mono">
                        Air Points Telemetry
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        {ahuData.points.map(p => (
                            <div key={p.label} className={`${ui.input} p-4 rounded-xl border-l-4`} style={{ borderLeftColor: p.color }}>
                                <div className="text-[11px] uppercase tracking-wider mb-2 font-black" style={{ color: p.color }}>
                                    {p.label === 'OA' ? koreanLabels.outsideAir : p.label === 'SA' ? koreanLabels.supplyAir : koreanLabels.returnAir}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className={ui.textMuted}>Temp:</span>
                                        <span className={`font-black font-mono ${ui.text}`}>{p.t.toFixed(1)}°C</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className={ui.textMuted}>RH:</span>
                                        <span className={`font-black font-mono ${ui.text}`}>{p.rh.toFixed(1)}%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className={ui.textMuted}>W:</span>
                                        <span className={`font-black font-mono ${ui.text}`}>{(p.w * 1000).toFixed(1)} g/kg</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className={ui.textMuted}>H:</span>
                                        <span className="font-black font-mono text-pink-400">{getH(p.t, p.w).toFixed(1)} kJ/kg</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Energy Metrics */}
                <div className="p-6 border-b border-slate-700/30">
                    <h3 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-4 font-mono">
                        Energy Performance
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className={`${ui.input} p-5 rounded-lg border-l-4 border-blue-500`}>
                            <div className="text-[10px] text-blue-400 uppercase tracking-wider mb-1 font-mono">
                                {koreanLabels.energyExchange}
                            </div>
                            <div className="text-3xl font-black font-mono text-blue-400">
                                {exchange.toFixed(2)}
                            </div>
                            <div className="text-[9px] text-slate-500 mt-1">kJ/kg (SA - OA)</div>
                        </div>
                        <div className={`${ui.input} p-5 rounded-lg border-l-4 border-pink-500`}>
                            <div className="text-[10px] text-pink-400 uppercase tracking-wider mb-1 font-mono">
                                {koreanLabels.energyAbsorption}
                            </div>
                            <div className="text-3xl font-black font-mono text-pink-400">
                                {absorption.toFixed(2)}
                            </div>
                            <div className="text-[9px] text-slate-500 mt-1">kJ/kg (RA - SA)</div>
                        </div>
                    </div>
                </div>

                {/* Fan Speed Control */}
                <div className="p-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-4 font-mono">
                        {koreanLabels.fanSpeed} Control
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className={`text-sm font-bold ${ui.text}`}>Current Speed:</span>
                            <span className="text-2xl font-black font-mono text-indigo-400">{fanSpeed}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={fanSpeed}
                            onChange={(e) => setFanSpeed(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                            <span>0%</span>
                            <span>25%</span>
                            <span>50%</span>
                            <span>75%</span>
                            <span>100%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AhuModal;