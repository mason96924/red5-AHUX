/**
 * VAV Terminal Modal
 * 
 * Displays:
 * - VAV diagram with Korean labels (placeholder - user will provide exact text)
 * - Airflow control slider (CFM)
 * - Real-time telemetry (temp, RH, enthalpy, ΔH from SA)
 * - Animated airflow visualization
 * - Graphics loaded from [ABC]/data/graphics/vav_diagram.png
 */

import React from 'react';
import { getH } from '../../utils/psychrometric';

const VavModal = ({ 
    vavData, 
    onClose, 
    theme, 
    cfm, 
    setCfm, 
    saPoint 
}) => {
    if (!vavData) return null;

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

    const vavH = getH(vavData.t, vavData.w);
    const saH = saPoint ? getH(saPoint.t, saPoint.w) : 0;
    const deltaH = vavH - saH;

    // Placeholder Korean labels (user will provide exact text)
    const koreanLabels = {
        title: '급기 터미널 유닛',  // VAV Terminal Unit
        airflow: '풍량',  // Airflow
        temperature: '온도',  // Temperature
        humidity: '습도',  // Humidity
        enthalpy: '엔탈피',  // Enthalpy
        deltaH: 'SA 대비 엔탈피 차이'  // Enthalpy difference from SA
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`${ui.modal} border ${ui.border} rounded-2xl shadow-2xl w-[700px] max-h-[85vh] overflow-y-auto custom-scrollbar`}>
                {/* Header */}
                <div className={`p-6 border-b ${ui.border} flex justify-between items-center`}>
                    <div>
                        <h2 className="text-2xl font-black uppercase italic tracking-tight text-indigo-400">
                            {vavData.id}
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

                {/* VAV Diagram */}
                <div className="p-6 border-b border-slate-700/30">
                    <div className="bg-slate-950/40 rounded-xl p-6 border border-indigo-500/20 relative overflow-hidden">
                        {/* Animated airflow indicator */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"></div>
                        
                        {/* Placeholder for VAV diagram image */}
                        <div className="w-full h-64 bg-slate-800/50 rounded-lg flex items-center justify-center border border-dashed border-slate-600">
                            <div className="text-center">
                                <div className="text-slate-500 text-sm font-mono mb-2">
                                    📊 VAV Diagram
                                </div>
                                <div className="text-[10px] text-slate-600 font-mono">
                                    Graphics path: [ABC]/data/graphics/vav_diagram.png
                                </div>
                                <div className="text-[9px] text-slate-700 font-mono mt-2">
                                    (Korean labels will be overlaid)
                                </div>
                            </div>
                        </div>

                        {/* Animated airflow visualization */}
                        <div className="absolute top-1/2 left-8 right-8 flex items-center justify-center">
                            <div className="w-full h-2 bg-gradient-to-r from-cyan-500/20 via-cyan-400/40 to-cyan-500/20 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Telemetry Data */}
                <div className="p-6 border-b border-slate-700/30">
                    <h3 className="text-xs font-black uppercase tracking-widest text-pink-400 mb-4 font-mono">
                        Real-time Telemetry
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className={`${ui.input} p-4 rounded-lg border`}>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-mono">
                                {koreanLabels.temperature}
                            </div>
                            <div className="text-2xl font-black font-mono text-emerald-400">
                                {vavData.t.toFixed(1)}°C
                            </div>
                        </div>
                        <div className={`${ui.input} p-4 rounded-lg border`}>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-mono">
                                {koreanLabels.humidity}
                            </div>
                            <div className="text-2xl font-black font-mono text-blue-400">
                                {vavData.rh.toFixed(1)}%
                            </div>
                        </div>
                        <div className={`${ui.input} p-4 rounded-lg border`}>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-mono">
                                {koreanLabels.enthalpy}
                            </div>
                            <div className="text-2xl font-black font-mono text-pink-400">
                                {vavH.toFixed(1)} kJ/kg
                            </div>
                        </div>
                        <div className={`${ui.input} p-4 rounded-lg border`}>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-mono">
                                {koreanLabels.deltaH}
                            </div>
                            <div className={`text-2xl font-black font-mono ${
                                deltaH > 0 ? 'text-red-400' : deltaH < 0 ? 'text-cyan-400' : 'text-slate-400'
                            }`}>
                                {deltaH > 0 ? '+' : ''}{deltaH.toFixed(1)} kJ/kg
                            </div>
                        </div>
                    </div>
                </div>

                {/* Airflow Control */}
                <div className="p-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-4 font-mono">
                        {koreanLabels.airflow} Control
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className={`text-sm font-bold ${ui.text}`}>Current CFM:</span>
                            <span className="text-2xl font-black font-mono text-indigo-400">{cfm}</span>
                        </div>
                        <input
                            type="range"
                            min="200"
                            max="800"
                            step="10"
                            value={cfm}
                            onChange={(e) => setCfm(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                            <span>200 CFM</span>
                            <span>800 CFM</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VavModal;