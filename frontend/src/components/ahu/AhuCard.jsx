/**
 * AHU Info Card Component
 * 
 * Draggable card displaying:
 * - AHU name (clickable to show floor plan)
 * - OA/SA/RA telemetry blocks
 * - Energy metrics (vertical bars)
 * - Vector visibility toggles
 * - Process path toggle
 * - Lock to SA button
 * - Close button
 */

import React from 'react';
import MetricBar from '../common/MetricBar';
import { getH } from '../../utils/psychrometric';

const AhuCard = ({
    ahu,
    ahuMetrics,
    theme,
    cardOffset,
    pad,
    setIsCardDragging,
    setDragStart,
    vecVis,
    setVecVis,
    showPath,
    setShowPath,
    isLockedToSA,
    setIsLockedToSA,
    setSelectedAhuId,
    setLockedVavId,
    setShowFloorPlanForAhu
}) => {
    const ui = theme === 'dark'
        ? {
            card: 'bg-slate-900/95',
            cardBorder: 'border-indigo-500/40',
            dataBlock: 'bg-slate-900/50 border-slate-700/50 text-slate-200',
            btnToggle: 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700',
            btnLockedOff: 'bg-indigo-900/40 border-indigo-500/30 text-indigo-400'
        }
        : {
            card: 'bg-white/95',
            cardBorder: 'border-slate-300',
            dataBlock: 'bg-slate-50 border-slate-200 text-slate-700',
            btnToggle: 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200',
            btnLockedOff: 'bg-indigo-50 border-indigo-200 text-indigo-600'
        };

    return (
        <div
            className="absolute z-40 select-none shadow-2xl"
            style={{
                top: `${pad.top + cardOffset.y}px`,
                left: `${pad.left + cardOffset.x}px`
            }}
        >
            <div className={`${ui.card} p-4 rounded-2xl border-l-[8px] border-l-indigo-50 border ${ui.cardBorder} shadow-2xl w-[320px] font-black shadow-black`}>
                <div
                    className={`flex justify-between gap-3 mb-3 pb-3 border-b ${
                        theme === 'dark' ? 'border-slate-800' : 'border-slate-200'
                    } cursor-grab active:cursor-grabbing font-black items-stretch shadow-black`}
                    onMouseDown={(e) => {
                        setIsCardDragging(true);
                        setDragStart({ x: e.clientX - cardOffset.x, y: e.clientY - cardOffset.y });
                    }}
                >
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <div
                                className={`text-2xl font-black tracking-tight uppercase italic cursor-pointer hover:text-sky-400 hover:underline transition-colors ${
                                    theme === 'dark' ? 'text-white shadow-black' : 'text-slate-900'
                                }`}
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    setShowFloorPlanForAhu(ahu.id);
                                }}
                                title="Click to map VAVs on Floor Plan"
                            >
                                {ahu.id}
                            </div>
                            <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-1 mb-2 font-black font-mono">
                                Real-time Diagnostic Hub
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-1 mt-2 h-full">
                            {ahu.points.map(p => (
                                <div
                                    key={p.label}
                                    className={`flex flex-col justify-center ${ui.dataBlock} py-1.5 rounded-lg border text-center shadow-inner h-full`}
                                >
                                    <span className="text-[9px] font-black mb-0.5 shadow-black" style={{ color: p.color }}>
                                        {p.label}
                                    </span>
                                    <span className={`text-[10px] font-mono ${
                                        theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                                    }`}>
                                        {p.t.toFixed(1)}°
                                    </span>
                                    <span className={`text-[8px] font-mono ${
                                        theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                                    }`}>
                                        {p.rh.toFixed(0)}%
                                    </span>
                                    <span className="text-[8px] font-mono text-pink-400 mt-0.5">
                                        {getH(p.t, p.w).toFixed(1)}h
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-2 items-stretch">
                        <div className="flex flex-col items-center gap-1 h-full flex-1">
                            <MetricBar
                                theme={theme}
                                val={ahuMetrics.exchange}
                                color="#3b82f6"
                                max={25}
                                height="flex-1 min-h-[90px] w-full"
                                width="w-14"
                                showValue={true}
                            />
                            <span className="text-[8px] text-blue-400 font-black tracking-tighter shadow-black">
                                Exchange
                            </span>
                        </div>
                        <div className="flex flex-col items-center gap-1 h-full flex-1">
                            <MetricBar
                                theme={theme}
                                val={ahuMetrics.absorption}
                                color="#f472b6"
                                max={25}
                                height="flex-1 min-h-[90px] w-full"
                                width="w-14"
                                showValue={true}
                            />
                            <span className="text-[8px] text-pink-400 font-black tracking-tighter shadow-black">
                                Absorption
                            </span>
                        </div>
                    </div>
                </div>

                {/* Vector Toggles */}
                <div className="grid grid-cols-2 gap-1.5 mb-3 font-black">
                    <button
                        onClick={() => setVecVis({ ...vecVis, enthalpy: !vecVis.enthalpy })}
                        className={`py-1.5 rounded border text-[9px] font-bold transition-all shadow-black ${
                            vecVis.enthalpy ? 'bg-pink-600/30 border-pink-500 text-pink-500' : ui.btnToggle
                        }`}
                    >
                        Enthalpy
                    </button>
                    <button
                        onClick={() => setVecVis({ ...vecVis, sensible: !vecVis.sensible })}
                        className={`py-1.5 rounded border text-[9px] font-bold transition-all shadow-black ${
                            vecVis.sensible ? 'bg-blue-600/30 border-blue-500 text-blue-500' : ui.btnToggle
                        }`}
                    >
                        Sensible
                    </button>
                    <button
                        onClick={() => setVecVis({ ...vecVis, latent: !vecVis.latent })}
                        className={`py-1.5 rounded border text-[9px] font-bold transition-all shadow-black ${
                            vecVis.latent ? 'bg-yellow-600/30 border-yellow-500 text-yellow-600' : ui.btnToggle
                        }`}
                    >
                        Latent
                    </button>
                    <button
                        onClick={() => setVecVis({ ...vecVis, diagnostic: !vecVis.diagnostic })}
                        className={`py-1.5 rounded border text-[9px] font-bold transition-all shadow-black ${
                            vecVis.diagnostic ? 'bg-emerald-600/30 border-emerald-400 text-emerald-600' : ui.btnToggle
                        }`}
                    >
                        Diagnostic
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-1 text-xs font-black">
                    <button
                        onClick={() => {
                            setSelectedAhuId(null);
                            setLockedVavId(null);
                        }}
                        className={`flex-1 ${ui.btnToggle} py-2.5 rounded-xl uppercase shadow-lg font-black tracking-widest text-[9px]`}
                    >
                        Close
                    </button>
                    <button
                        onClick={() => setShowPath(!showPath)}
                        className={`flex-1 py-2.5 rounded-xl border transition-all text-[9px] font-black shadow-black ${
                            showPath ? 'bg-indigo-600 border-indigo-400 text-white' : ui.btnToggle
                        }`}
                    >
                        Path
                    </button>
                    <button
                        onClick={() => {
                            setIsLockedToSA(!isLockedToSA);
                            setLockedVavId(null);
                        }}
                        className={`flex-1 py-2.5 rounded-xl border transition-all text-[9px] font-black shadow-black ${
                            isLockedToSA ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg' : ui.btnLockedOff
                        }`}
                    >
                        {isLockedToSA ? 'SA Locked' : 'Lock SA'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AhuCard;
