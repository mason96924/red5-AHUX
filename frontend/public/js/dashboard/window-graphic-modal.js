/* ------------------------------------------------------------------
 * dashboard/window-graphic-modal.js — Window graphic (AHU-modal chrome)
 * All ELC window options: open, type, length, height, rotate, skew,
 * stretch, sill/head, name, 2D aperture note.
 * ------------------------------------------------------------------ */
function WindowBlindGraphic(props) {
    const w = props.w || {};
    const open = Math.max(0, Math.min(1, 1 - (Number(w.blind_level) || 0)));
    const type = window.red5NormalizeBlindType ? window.red5NormalizeBlindType(w.blind_type) : 'roller';
    const spec = window.red5BlindSpec ? window.red5BlindSpec(type) : { label: 'Roller' };
    const W = 280, H = 180;
    const glass = { x: 28, y: 18, w: 224, h: 144 };
    const rects = window.red5BlindElevationRects
        ? window.red5BlindElevationRects(type, open, glass.x, glass.y, glass.w, glass.h)
        : [];
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" data-testid="window-graphic-svg">
            <rect x="8" y="8" width={W - 16} height={H - 16} rx="4" fill="#cbd5e1" stroke="#64748b" strokeWidth="6"/>
            <rect x={glass.x} y={glass.y} width={glass.w} height={glass.h} fill="#7dd3fc" opacity="0.55"/>
            <rect x={glass.x} y={glass.y} width={glass.w} height={glass.h} fill="url(#wgSky)" opacity="0.85"/>
            <defs>
                <linearGradient id="wgSky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#38bdf8"/>
                    <stop offset="1" stopColor="#fbbf24" stopOpacity="0.45"/>
                </linearGradient>
            </defs>
            {rects.map((r, i) => (
                <rect key={i} x={r.x} y={r.y} width={r.width} height={r.height}
                      fill="#1e293b" opacity={r.opacity}/>
            ))}
            <text x={W / 2} y={H - 2} textAnchor="middle" fontSize="9" fill="#334155" fontFamily="ui-monospace,monospace">
                {(spec.label || 'Roller') + ' · ' + Math.round(open * 100) + '% open'}
            </text>
        </svg>
    );
}

function renderWindowGraphicModal(ctx) {
    const {
        theme, window: win, windowIndex, floorKey,
        onPatch, onClose, onTraceAperture,
        layoutMode
    } = ctx;
    if (!win) return null;
    const dk = theme === 'dark';
    const w = win;
    const openPct = Math.round((1 - Math.min(1, Math.max(0, Number(w.blind_level) || 0))) * 100);
    const spec = window.red5BlindSpec ? window.red5BlindSpec(w.blind_type) : { id: 'roller', hint: '' };
    const blindType = spec.id || 'roller';
    const patch = (fields) => { if (onPatch) onPatch(w.id, fields, windowIndex); };
    const layout = layoutMode !== false;
    const row = (label, title, control) => (
        <div className="flex items-center gap-2" title={title || ''}>
            <span className={`text-[9px] uppercase tracking-wider w-16 shrink-0 ${dk ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
            <div className="flex-1 min-w-0">{control}</div>
        </div>
    );
    const slider = (val, min, max, step, onVal, suffix) => (
        <div className="flex items-center gap-1.5">
            <input type="range" min={min} max={max} step={step} value={val}
                   className="flex-1 min-w-0 accent-sky-300 cursor-pointer"
                   onChange={(e) => onVal(+e.target.value)}/>
            <span className={`font-mono text-[10px] w-14 text-right ${dk ? 'text-sky-300' : 'text-sky-700'}`}>
                {typeof val === 'number' && !Number.isInteger(val) ? val.toFixed(2) : val}{suffix || ''}
            </span>
        </div>
    );
    return (
        <div className="absolute z-[55] pointer-events-auto"
             data-testid="window-graphic-modal"
             style={{
                 left: `${Math.min(72, Math.max(8, Number(w.x) || 50))}%`,
                 top: `${Math.min(58, Math.max(6, Number(w.y) || 50))}%`,
                 transform: 'translate(-50%, 18px)',
                 width: 340,
             }}
             onMouseDown={(e) => e.stopPropagation()}>
            <div className={`${dk ? 'bg-slate-900 border-slate-600 text-slate-200' : 'bg-[#e2e5e8] border-white/40 text-slate-800'} rounded-xl border-2 shadow-2xl overflow-hidden`}>
                <div className={`${dk ? 'bg-slate-900 border-slate-800' : 'bg-slate-300/60 border-slate-300'} border-b p-2.5 flex justify-between items-center`}>
                    <h3 className={`text-[11px] font-black tracking-widest ml-1 ${dk ? 'text-slate-300' : 'text-slate-700'}`}>
                        W{(windowIndex || 0) + 1} WINDOW GRAPHIC
                    </h3>
                    <button className={`${dk ? 'text-slate-400 hover:text-slate-100' : 'text-slate-500 hover:text-slate-800'}`}
                            onClick={() => onClose && onClose()}
                            data-testid="window-graphic-close">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div className={`red5-graphic-zone ${dk ? 'bg-[#d0d4d8]' : 'bg-[#d8dce0]'} p-2`}>
                    <div className="h-[160px] rounded border border-slate-400/60 bg-slate-200 overflow-hidden">
                        <WindowBlindGraphic w={w}/>
                    </div>
                </div>
                <div className={`${dk ? 'bg-slate-950/80' : 'bg-white/80'} p-2.5 space-y-2 text-[10px]`}>
                    {row('Name', 'Window identifier',
                        <input type="text" maxLength={24} value={w.name || ''}
                               placeholder={'W' + ((windowIndex || 0) + 1)}
                               className={`w-full rounded border px-1.5 py-1 font-mono text-[11px] outline-none ${dk ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300'}`}
                               onChange={(e) => patch({ name: e.target.value })}/>
                    )}
                    {row('Open →', '100% = fully open',
                        slider(openPct, 0, 100, 1, (v) => patch({ blind_level: 1 - v / 100 }), '%')
                    )}
                    <div>
                        <div className={`text-[9px] uppercase tracking-wider mb-1 ${dk ? 'text-slate-400' : 'text-slate-500'}`}>Type</div>
                        {window.WindowBlindTypeSelect ? (
                            <window.WindowBlindTypeSelect
                                theme={theme}
                                value={blindType}
                                onChange={(bt) => patch({ blind_type: bt })}
                            />
                        ) : null}
                        {spec.hint ? (
                            <div className={`text-[9px] leading-snug mt-1 ${dk ? 'text-slate-500' : 'text-slate-500'}`}>{spec.hint}</div>
                        ) : null}
                    </div>
                    {layout && row('Length →', 'Span on the plan',
                        slider(Number(w.length) || 8, 1, 80, 0.5, (v) => patch({ length: v }), '%')
                    )}
                    {layout && row('Height →', 'Glass height sill→head (m)',
                        slider(Math.max(0.05, (Number(w.head_height_m) || 2.2) - (Number(w.sill_height_m) || 1.0)),
                            0.05, 8, 0.05,
                            (v) => patch({ head_height_m: (Number(w.sill_height_m) || 1.0) + v }),
                            ' m')
                    )}
                    {layout && row('Rotate →', 'Rotate on the floor plan',
                        slider(Math.round(Number(w.angle_deg) || 0), -180, 180, 1, (v) => patch({ angle_deg: v }), '°')
                    )}
                    {layout && !(Array.isArray(w.vertices) && w.vertices.length >= 3) && (
                        <>
                            {row('Skew X →', 'Shear top edge along the wall',
                                slider(Number(w.skew_x != null ? w.skew_x : 0.42), -2, 2, 0.01, (v) => patch({ skew_x: v }))
                            )}
                            {row('Skew Y →', 'Shear top edge into the room',
                                slider(Number(w.skew_y) || 0, -2, 2, 0.01, (v) => patch({ skew_y: v }))
                            )}
                            {row('Stretch X →', 'Scale pane width along the wall',
                                slider(Number(w.stretch_x) || 1, 0.3, 3, 0.05, (v) => patch({ stretch_x: v }), '×')
                            )}
                            {row('Stretch Y →', 'Scale pane height',
                                slider(Number(w.stretch_y) || 1, 0.3, 3, 0.05, (v) => patch({ stretch_y: v }), '×')
                            )}
                        </>
                    )}
                    {layout && (
                        <div className="flex items-center justify-between pt-1 border-t border-slate-700/40">
                            <span className={`text-[9px] font-mono ${dk ? 'text-sky-400' : 'text-sky-700'}`}>
                                {Array.isArray(w.vertices) && w.vertices.length >= 3
                                    ? ('2D TRACE · ' + w.vertices.length + ' pts')
                                    : '2.5D RECTANGLE'}
                            </span>
                            {onTraceAperture && (
                                <button type="button"
                                        className="px-2 py-0.5 rounded border text-[9px] font-black uppercase tracking-wider border-sky-500/60 text-sky-300 hover:bg-sky-900/30"
                                        onClick={() => onTraceAperture(w.id)}>
                                    Trace aperture
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

window.renderWindowGraphicModal = renderWindowGraphicModal;
window.WindowBlindGraphic = WindowBlindGraphic;
