/**
 * AHU Sidebar Component
 * 
 * Left sidebar displaying:
 * - Theme toggle
 * - Givoni zone toggle
 * - AHU search with wildcards (* and ?)
 * - AHU list with energy metrics
 * - Axis range controls
 * - Point visibility toggles (OA/SA/RA)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import MetricBar from '../common/MetricBar';
import { getH } from '../../utils/psychrometric';

const AhuSidebar = ({
    theme,
    setTheme,
    showGivoni,
    setShowGivoni,
    searchTerm,
    setSearchTerm,
    filteredAhuData,
    selectedAhuId,
    setSelectedAhuId,
    tempRange,
    setTempRange,
    pointVisibility,
    setPointVisibility,
    setShowFloorPlanForAhu
}) => {
    const navigate = useNavigate();
    
    const ui = theme === 'dark'
        ? {
            sidebar: 'bg-slate-900',
            border: 'border-slate-800',
            text: 'text-slate-100',
            textMuted: 'text-slate-400',
            itemSelected: 'bg-slate-800 border-indigo-500 shadow-xl',
            btnToggle: 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700',
            rangeTrack: 'bg-slate-800'
        }
        : {
            sidebar: 'bg-white',
            border: 'border-slate-200',
            text: 'text-slate-900',
            textMuted: 'text-slate-500',
            itemSelected: 'bg-indigo-50 border-indigo-500 shadow-md',
            btnToggle: 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200',
            rangeTrack: 'bg-slate-300'
        };

    const getEnergyMetrics = (ahu) => {
        if (!ahu || !ahu.points || ahu.points.length < 3) {
            return { exchange: 0, absorption: 0 };
        }
        
        const sa = ahu.points[1];
        const oa = ahu.points[0];
        const ra = ahu.points[2];
        
        if (!ra || !oa || !sa) return { exchange: 0, absorption: 0 };
        
        return {
            exchange: getH(sa.t, sa.w) - getH(oa.t, oa.w),
            absorption: getH(ra.t, ra.w) - getH(sa.t, sa.w)
        };
    };

    return (
        <div className={`w-80 ${ui.sidebar} border-r ${ui.border} flex flex-col z-20 shadow-2xl overflow-hidden`}>
            {/* Back to Home & Logout Buttons */}
            <div className="p-4 border-b border-slate-800 space-y-2">
                <button
                    onClick={() => navigate('/')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all font-bold text-sm shadow-lg hover:shadow-xl"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                </button>
                <button
                    onClick={() => navigate('/')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all font-medium text-sm border border-slate-700"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
            </div>
            
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-center font-black">
                <h1 className="text-xl font-black italic uppercase tracking-tighter text-indigo-400 font-mono shadow-black">
                    AHU Diagnostic HUB
                </h1>
                <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className={`${
                        theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
                    } text-[10px] p-1 rounded border outline-none`}
                >
                    <option value="dark">DARK</option>
                    <option value="light">LIGHT</option>
                </select>
            </div>

            {/* Givoni Toggle */}
            <div className={`p-4 border-b ${ui.border} bg-opacity-50`}>
                <button
                    onClick={() => setShowGivoni(!showGivoni)}
                    className={`w-full py-2.5 rounded-xl text-[11px] font-black border transition-all ${
                        showGivoni
                            ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
                            : ui.btnToggle
                    }`}
                >
                    Toggle Givoni Engine
                </button>
            </div>

            {/* Search */}
            <div className={`p-4 border-b ${ui.border} bg-opacity-10 space-y-2`}>
                <h2 className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.2em] px-1 font-black shadow-black">
                    Asset Search
                </h2>
                <input
                    type="text"
                    placeholder="Search ID (Wildcard *, ?)..."
                    className={`w-full ${
                        theme === 'dark' ? 'bg-slate-950' : 'bg-slate-100'
                    } border ${ui.border} rounded-xl py-2 px-4 text-[11px] focus:outline-none focus:border-indigo-500 font-medium ${ui.text}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Axis Settings */}
            <div className={`p-4 border-b ${ui.border} bg-opacity-20 space-y-3`}>
                <h2 className="text-[10px] font-black uppercase text-pink-500 tracking-[0.2em] px-1 font-black shadow-black">
                    Axis Settings
                </h2>
                <div className="space-y-4 px-1">
                    <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-bold uppercase text-slate-500 italic font-black shadow-black">
                            <span>Min Temp</span>
                            <span>{tempRange.min}°C</span>
                        </div>
                        <input
                            type="range"
                            min="-15"
                            max="20"
                            step="1"
                            value={tempRange.min}
                            onChange={(e) => setTempRange({ ...tempRange, min: parseInt(e.target.value) })}
                            className={`w-full h-1 ${ui.rangeTrack} rounded-lg appearance-none cursor-pointer accent-indigo-500`}
                        />
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-bold uppercase text-slate-500 italic font-black shadow-black">
                            <span>Max Temp</span>
                            <span>{tempRange.max}°C</span>
                        </div>
                        <input
                            type="range"
                            min="30"
                            max="50"
                            step="1"
                            value={tempRange.max}
                            onChange={(e) => setTempRange({ ...tempRange, max: parseInt(e.target.value) })}
                            className={`w-full h-1 ${ui.rangeTrack} rounded-lg appearance-none cursor-pointer accent-indigo-500`}
                        />
                    </div>
                </div>
            </div>

            {/* Point Visibility Toggle */}
            <div className={`p-4 border-b ${ui.border} bg-opacity-5`}>
                <div className="flex justify-between items-center px-2">
                    {['OA', 'SA', 'RA'].map(p => {
                        const configs = {
                            OA: { rgb: '59, 130, 246' },
                            SA: { rgb: '16, 185, 129' },
                            RA: { rgb: '244, 63, 94' }
                        };
                        const active = pointVisibility[p];
                        const c = configs[p];
                        
                        return (
                            <button
                                key={p}
                                onClick={() => setPointVisibility({ ...pointVisibility, [p]: !pointVisibility[p] })}
                                className="w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center font-black text-[10px] shadow-black"
                                style={{
                                    backgroundColor: active ? `rgb(${c.rgb})` : `rgba(${c.rgb}, 0.15)`,
                                    borderColor: active ? (theme === 'dark' ? '#fff' : '#000') : `rgb(${c.rgb})`,
                                    color: active ? '#fff' : `rgb(${c.rgb})`,
                                    opacity: active ? 1 : 0.6
                                }}
                            >
                                {p}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* AHU List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar bg-opacity-20">
                {filteredAhuData.map(ahu => {
                    const isSelected = selectedAhuId === ahu.id;
                    const m = getEnergyMetrics(ahu);
                    
                    return (
                        <div
                            key={ahu.id}
                            onClick={() => {
                                setSelectedAhuId(ahu.id);
                                setShowFloorPlanForAhu(null);
                            }}
                            className={`p-3 rounded-xl border transition-all cursor-pointer ${
                                isSelected ? ui.itemSelected : ui.border + ' bg-opacity-50 hover:bg-opacity-40'
                            }`}
                        >
                            <div className="flex justify-between items-center mb-1 font-black uppercase text-xs shadow-black">
                                {ahu.id}
                                <div className="flex gap-1.5">
                                    <MetricBar theme={theme} val={m.exchange} color="#3b82f6" height="h-5" max={20} />
                                    <MetricBar theme={theme} val={m.absorption} color="#f472b6" height="h-5" max={20} />
                                </div>
                            </div>
                            <div className="space-y-0.5">
                                {ahu.points?.map(p => (
                                    <div
                                        key={p.label}
                                        className={`flex items-center justify-between font-mono text-[9px] opacity-90 border-b ${
                                            theme === 'dark' ? 'border-white/5' : 'border-black/5'
                                        } last:border-0 py-0.5`}
                                    >
                                        <span style={{ color: p.color }} className="font-black uppercase tracking-tighter shadow-black">
                                            {p.label}
                                        </span>
                                        <span className={`${ui.text} font-bold font-mono tracking-tighter`}>
                                            {p.t.toFixed(1)}° / {p.rh.toFixed(0)}% / {getH(p.t, p.w).toFixed(1)}h
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AhuSidebar;
