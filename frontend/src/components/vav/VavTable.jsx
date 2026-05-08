/**
 * VAV Terminal Table Component
 * 
 * Draggable table displaying:
 * - All VAV terminals for selected AHU
 * - Temperature, humidity, enthalpy
 * - ΔH from Supply Air
 * - Individual lock buttons
 * - Click VAV ID to view diagram
 */

import React from 'react';
import LockIcon from '../common/LockIcon';
import { getH } from '../../utils/psychrometric';

const VavTable = ({
    selectedAhu,
    theme,
    vavTableOffset,
    setIsVavDragging,
    setDragStart,
    lockedVavId,
    setLockedVavId,
    setIsLockedToSA,
    setSelectedVavForModal,
    setVavCfm
}) => {
    const ui = theme === 'dark'
        ? {
            vavHub: 'bg-slate-900/90',
            border: 'border-indigo-500/30',
            headerBg: 'bg-indigo-600/10 border-indigo-500/20',
            text: 'text-slate-100',
            rowBg: 'bg-slate-950/40 hover:bg-indigo-500/10',
            rowSelected: 'bg-indigo-500/30',
            btnToggle: 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
        }
        : {
            vavHub: 'bg-white/95',
            border: 'border-indigo-200',
            headerBg: 'bg-indigo-50 border-indigo-200',
            text: 'text-slate-900',
            rowBg: 'bg-slate-100 hover:bg-indigo-100',
            rowSelected: 'bg-indigo-200',
            btnToggle: 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
        };

    if (!selectedAhu || !selectedAhu.vavs || selectedAhu.vavs.length === 0) {
        return null;
    }

    const saPoint = selectedAhu.points?.find(p => p.label === 'SA');
    const saH = saPoint ? getH(saPoint.t, saPoint.w) : 0;

    return (
        <div
            className="absolute z-50 w-[500px] select-none shadow-2xl"
            style={{
                top: `${vavTableOffset.y}px`,
                left: `${vavTableOffset.x}px`
            }}
        >
            <div className={`${ui.vavHub} backdrop-blur-xl border ${ui.border} rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 shadow-black`}>
                <div
                    className={`p-4 ${ui.headerBg} border-b flex justify-between items-center cursor-grab active:cursor-grabbing font-black shadow-black`}
                    onMouseDown={(e) => {
                        setIsVavDragging(true);
                        setDragStart({ x: e.clientX - vavTableOffset.x, y: e.clientY - vavTableOffset.y });
                    }}
                >
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 font-black font-mono shadow-black">
                        VAV Terminal HUB
                    </h3>
                </div>
                
                <div className="max-h-[250px] overflow-y-auto custom-scrollbar p-2 bg-opacity-20 font-mono text-[11px]">
                    <table className="w-full text-left border-separate border-spacing-y-1">
                        <thead>
                            <tr className="text-[9px] font-black uppercase text-slate-400">
                                <th>ID</th>
                                <th>Temp</th>
                                <th>Humid %</th>
                                <th>Enthalpy</th>
                                <th>ΔH(SA)</th>
                                <th className="text-center font-black">Lock</th>
                            </tr>
                        </thead>
                        <tbody className="opacity-90">
                            {selectedAhu.vavs.map(v => {
                                const diffH = v.h - saH;
                                const isLocked = lockedVavId === v.id;
                                
                                return (
                                    <tr
                                        key={v.id}
                                        className={`rounded-lg transition-colors shadow-black ${
                                            isLocked ? ui.rowSelected : ui.rowBg
                                        }`}
                                    >
                                        <td
                                            className="px-3 py-2 text-indigo-500 font-bold cursor-pointer hover:underline transition-colors hover:text-indigo-400"
                                            onMouseDown={(e) => {
                                                e.stopPropagation();
                                                setSelectedVavForModal(v);
                                                setVavCfm(Math.floor(Math.random() * 300 + 400));
                                                setLockedVavId(v.id);
                                                setIsLockedToSA(false);
                                            }}
                                            title="View Diagram"
                                        >
                                            {v.id}
                                        </td>
                                        <td className="font-black">{v.t.toFixed(1)}°</td>
                                        <td className="font-black">{v.rh.toFixed(0)}%</td>
                                        <td className="text-pink-500 font-black">{v.h.toFixed(1)}</td>
                                        <td className="text-blue-500 font-black">
                                            {diffH > 0 ? '+' : ''}{diffH.toFixed(1)}
                                        </td>
                                        <td className="text-center">
                                            <button
                                                onMouseDown={(e) => {
                                                    e.stopPropagation();
                                                    setLockedVavId(isLocked ? null : v.id);
                                                    setIsLockedToSA(false);
                                                }}
                                                className={`p-1.5 rounded-lg border transition-all shadow-black ${
                                                    isLocked
                                                        ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg'
                                                        : ui.btnToggle
                                                }`}
                                            >
                                                <LockIcon />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VavTable;
