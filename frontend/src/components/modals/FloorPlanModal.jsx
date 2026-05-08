/**
 * Floor Plan Modal
 * 
 * Displays:
 * - Floor plan image with AHU and VAV markers
 * - AHU corner positions (from map_config.json)
 * - VAV scatter positions with safe grid
 * - Click markers to view equipment diagrams
 * - Graphics loaded from [ABC]/data/graphics/floor_plans/
 */

import React, { useState } from 'react';

const FloorPlanModal = ({ 
    ahuData, 
    onClose, 
    theme,
    onOpenAhuModal,
    onOpenVavModal
}) => {
    if (!ahuData) return null;

    const ui = theme === 'dark'
        ? {
            modal: 'bg-slate-900/98',
            border: 'border-slate-700',
            text: 'text-slate-100',
            textMuted: 'text-slate-400'
        }
        : {
            modal: 'bg-white/98',
            border: 'border-slate-300',
            text: 'text-slate-900',
            textMuted: 'text-slate-500'
        };

    // Placeholder Korean labels
    const koreanLabels = {
        title: '평면도 매핑',  // Floor Plan Mapping
        ahuPosition: '공조기 위치',  // AHU Position
        vavPositions: 'VAV 터미널 위치'  // VAV Terminal Positions
    };

    // Generate placeholder positions for VAVs (safe grid layout)
    const generateVavPositions = () => {
        if (!ahuData.vavs) return [];
        
        const positions = [];
        const gridSize = Math.ceil(Math.sqrt(ahuData.vavs.length));
        const spacing = 80;
        const offsetX = 150;
        const offsetY = 100;

        ahuData.vavs.forEach((vav, idx) => {
            const row = Math.floor(idx / gridSize);
            const col = idx % gridSize;
            positions.push({
                ...vav,
                x: offsetX + col * spacing,
                y: offsetY + row * spacing
            });
        });

        return positions;
    };

    const vavPositions = generateVavPositions();

    // AHU position (corner)
    const ahuPosition = { x: 50, y: 50 };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`${ui.modal} border ${ui.border} rounded-2xl shadow-2xl w-[900px] max-h-[90vh] overflow-y-auto custom-scrollbar`}>
                {/* Header */}
                <div className={`p-6 border-b ${ui.border} flex justify-between items-center`}>
                    <div>
                        <h2 className="text-2xl font-black uppercase italic tracking-tight text-indigo-400">
                            {ahuData.id} - {koreanLabels.title}
                        </h2>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-mono">
                            Floor Plan Mapper
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className={`${
                            theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'
                        } px-4 py-2 rounded-lg border text-sm font-bold hover:bg-opacity-80 transition-all`}
                    >
                        Close
                    </button>
                </div>

                {/* Floor Plan Canvas */}
                <div className="p-6">
                    <div className="bg-slate-950/40 rounded-xl border border-indigo-500/20 relative overflow-hidden" style={{ height: '600px' }}>
                        {/* Placeholder floor plan background */}
                        <div className="absolute inset-0 bg-slate-800/30 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-slate-500 text-sm font-mono mb-2">
                                    🏢 Floor Plan Image
                                </div>
                                <div className="text-[10px] text-slate-600 font-mono">
                                    Graphics path: [ABC]/data/graphics/floor_plans/{ahuData.id}.png
                                </div>
                                <div className="text-[9px] text-slate-700 font-mono mt-2">
                                    (Loaded from map_config.json)
                                </div>
                            </div>
                        </div>

                        {/* Grid overlay */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <defs>
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(100,116,139,0.1)" strokeWidth="1"/>
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>

                        {/* AHU Marker */}
                        <div
                            className="absolute cursor-pointer hover:scale-110 transition-transform group"
                            style={{ left: `${ahuPosition.x}px`, top: `${ahuPosition.y}px` }}
                            onClick={() => onOpenAhuModal && onOpenAhuModal(ahuData)}
                        >
                            <div className="relative">
                                <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                    <span className="text-white text-xs font-black">AHU</span>
                                </div>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {ahuData.id}
                                </div>
                            </div>
                        </div>

                        {/* VAV Markers */}
                        {vavPositions.map((vav, idx) => (
                            <div
                                key={vav.id}
                                className="absolute cursor-pointer hover:scale-125 transition-transform group"
                                style={{ left: `${vav.x}px`, top: `${vav.y}px` }}
                                onClick={() => onOpenVavModal && onOpenVavModal(vav)}
                            >
                                <div className="relative">
                                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center shadow-md border border-white">
                                        <span className="text-white text-[8px] font-black">{idx + 1}</span>
                                    </div>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {vav.id}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="p-6 border-t border-slate-700/30">
                    <div className="flex items-center justify-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center border-2 border-white">
                                <span className="text-white text-[9px] font-black">AHU</span>
                            </div>
                            <span className={`text-xs font-bold ${ui.text}`}>{koreanLabels.ahuPosition}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center border border-white">
                                <span className="text-white text-[8px] font-black">V</span>
                            </div>
                            <span className={`text-xs font-bold ${ui.text}`}>{koreanLabels.vavPositions} ({ahuData.vavs?.length || 0})</span>
                        </div>
                    </div>
                    <div className="text-center mt-4 text-[10px] text-slate-500 font-mono">
                        Click markers to view equipment details
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FloorPlanModal;