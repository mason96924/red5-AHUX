/* ------------------------------------------------------------------
 * window-blinds-popout.js — ELC-style selected-window config.
 * Pops next to the clicked window. Layout (mapper) and operator
 * (dashboard floor plan) share Open % + blind type; layout also
 * gets name / trace / delete.
 * ------------------------------------------------------------------ */

function red5NormalizeBlindType(t) {
    const v = String(t || 'roller').toLowerCase();
    return (v === 'horizontal' || v === 'vertical') ? v : 'roller';
}

function WindowBlindTypeSelect(props) {
    const bt = red5NormalizeBlindType(props.value);
    const dk = props.theme !== 'light';
    return (
        <select
            value={bt}
            data-testid={props.testId || 'wp-blind-type'}
            title="Blind style"
            className={props.className || `w-full rounded border px-1.5 py-1 font-mono text-[11px] ${dk ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800'}`}
            onChange={(e) => {
                if (props.onChange) props.onChange(red5NormalizeBlindType(e.target.value));
            }}
        >
            <option value="roller">Roller</option>
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
        </select>
    );
}

function WindowBlindPreview(props) {
    const w = props.w || {};
    const open = Math.max(0, Math.min(1, 1 - (Number(w.blind_level) || 0)));
    const type = red5NormalizeBlindType(w.blind_type);
    const W = 220, H = 72;
    const glass = { x: 10, y: 8, w: 200, h: 52 };
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[72px]" data-testid="window-blind-preview">
            <rect x="4" y="4" width={W - 8} height={H - 8} rx="3" fill="#cbd5e1" stroke="#64748b" strokeWidth="4"/>
            <rect x={glass.x} y={glass.y} width={glass.w} height={glass.h} fill="#38bdf8" opacity="0.55"/>
            {type === 'roller' && (1 - open) * glass.h > 0.5 && (
                <rect x={glass.x} y={glass.y} width={glass.w} height={(1 - open) * glass.h}
                      fill="#334155" opacity="0.88"/>
            )}
            {type === 'horizontal' && Array.from({ length: 8 }).map((_, i) => {
                const y = glass.y + (i + 0.5) * (glass.h / 8);
                const tilt = 1 - open;
                return (
                    <rect key={i} x={glass.x + 2} y={y - (1 + tilt * 2.5)}
                          width={glass.w - 4} height={1.2 + tilt * 5}
                          fill="#1e293b" opacity={0.35 + tilt * 0.55}/>
                );
            })}
            {type === 'vertical' && Array.from({ length: 8 }).map((_, i) => {
                const x = glass.x + (i + 0.5) * (glass.w / 8);
                const tilt = 1 - open;
                return (
                    <rect key={i} x={x - (1 + tilt * 3)} y={glass.y + 1}
                          width={1.2 + tilt * 7} height={glass.h - 2}
                          fill="#1e293b" opacity={0.35 + tilt * 0.55}/>
                );
            })}
        </svg>
    );
}

function WindowBlindsPopout(props) {
    const {
        theme, w, windowIndex, layoutMode,
        onChange, onClose, onTrace, onDelete,
    } = props;
    if (!w) return null;
    const dk = theme !== 'light';
    const layout = layoutMode === true;
    const openPct = Math.round((1 - Math.min(1, Math.max(0, Number(w.blind_level) || 0))) * 100);
    const label = (w.name && String(w.name).trim()) || ('W' + ((windowIndex || 0) + 1));
    const traced = Array.isArray(w.vertices) && w.vertices.length >= 3;
    const placeAbove = (Number(w.y) || 50) > 28;
    const storageKey = 'red5.winBlindPopout.' + String(w.id || windowIndex || 'w');
    const [pos, setPos] = React.useState(() => {
        try {
            const p = JSON.parse(localStorage.getItem(storageKey) || 'null');
            if (p && typeof p.x === 'number' && typeof p.y === 'number') return p;
        } catch (_) {}
        return { x: 0, y: 0 };
    });
    const [drag, setDrag] = React.useState(null);
    const posRef = React.useRef(pos);
    posRef.current = pos;

    React.useEffect(() => {
        if (!drag) return undefined;
        const onMove = (e) => {
            setPos({
                x: drag.baseX + (e.clientX - drag.startX),
                y: drag.baseY + (e.clientY - drag.startY),
            });
        };
        const onUp = () => {
            setDrag(null);
            try { localStorage.setItem(storageKey, JSON.stringify(posRef.current)); } catch (_) {}
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
    }, [drag, storageKey]);

    const patch = (fields) => { if (onChange) onChange(fields); };
    const baseTy = placeAbove ? 'calc(-100% - 14px)' : '16px';

    return (
        <div
            data-testid="window-blinds-popout"
            className={`absolute z-[96] w-[240px] rounded-md border shadow-2xl pointer-events-auto ${
                dk ? 'bg-slate-950/95 border-sky-500/70 text-slate-200' : 'bg-white/95 border-sky-400 text-slate-800'
            }`}
            style={{
                left: `${w.x}%`,
                top: `${w.y}%`,
                width: 240,
                zIndex: 96,
                transform: `translate(-50%, ${baseTy}) translate(${pos.x}px, ${pos.y}px)`,
                cursor: drag ? 'grabbing' : 'grab',
                userSelect: 'none',
                touchAction: 'none',
            }}
            onMouseDown={(e) => {
                if (e.button !== 0) return;
                const t = e.target;
                if (t && t.closest && (t.closest('button') || t.closest('input') || t.closest('select'))) return;
                e.stopPropagation();
                e.preventDefault();
                setDrag({ startX: e.clientX, startY: e.clientY, baseX: pos.x, baseY: pos.y });
            }}
            onClick={(e) => e.stopPropagation()}
            title="Drag to move · this window’s blinds"
        >
            <div className={`flex items-center justify-between px-2 py-1.5 border-b text-[9px] uppercase tracking-widest ${
                dk ? 'border-slate-700 text-sky-300' : 'border-slate-200 text-sky-700'
            }`}>
                <span className="font-mono truncate">{label} · Blinds</span>
                <button type="button" className="text-sm px-1 opacity-60 hover:opacity-100 cursor-pointer"
                        data-testid="window-blinds-popout-close"
                        onClick={() => { if (onClose) onClose(); }}>×</button>
            </div>
            <div className={`px-1.5 pt-1.5 ${dk ? 'bg-slate-900/80' : 'bg-slate-100'}`}>
                <WindowBlindPreview w={w}/>
            </div>
            <div className="px-2 py-2 space-y-2">
                {layout && (
                    <div className="flex items-center gap-1.5">
                        <span className="text-[8px] opacity-60 w-10 shrink-0 uppercase">Name</span>
                        <input type="text" maxLength={24} value={w.name || ''}
                               placeholder={label}
                               className={`flex-1 min-w-0 rounded border px-1.5 py-0.5 font-mono text-[11px] outline-none ${dk ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300'}`}
                               onChange={(e) => patch({ name: e.target.value })}/>
                    </div>
                )}
                <div className="flex items-center gap-1.5">
                    <span className="text-[8px] opacity-60 w-10 shrink-0 uppercase" title="100% = fully open">Open</span>
                    <input type="range" min="0" max="100" step="1" value={openPct}
                           className="flex-1 min-w-0 accent-sky-300 cursor-pointer"
                           data-testid={`wp-open-${w.id}`}
                           onChange={(e) => {
                               const v = parseInt(e.target.value, 10) || 0;
                               patch({ blind_level: 1 - v / 100 });
                           }}/>
                    <span className="font-mono text-[10px] text-sky-400 w-9 text-right">{openPct}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-[8px] opacity-60 w-10 shrink-0 uppercase" title="Blind style">Type</span>
                    <div className="flex-1 min-w-0">
                        <WindowBlindTypeSelect
                            theme={theme}
                            value={w.blind_type}
                            testId={`window-type-${w.id}`}
                            onChange={(bt) => patch({ blind_type: bt })}
                        />
                    </div>
                </div>
                {layout && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-700/40">
                        <span className="text-[8px] font-mono opacity-60">
                            {traced ? ('2D glass · ' + w.vertices.length + ' pts') : '2.5D wall'}
                        </span>
                        <div className="flex items-center gap-2">
                            {onTrace && (
                                <button type="button"
                                        className="text-[8px] font-black uppercase tracking-widest text-sky-400 hover:text-sky-200"
                                        onClick={() => onTrace(w.id)}>
                                    {traced ? 'Re-trace' : 'Trace'}
                                </button>
                            )}
                            {onDelete && (
                                <button type="button"
                                        className="text-[8px] font-black uppercase tracking-widest text-rose-400 hover:text-rose-300"
                                        onClick={() => onDelete(w.id)}>
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                )}
                {!layout && (
                    <div className="text-[8px] opacity-50">This window · 0% closed · 100% open</div>
                )}
            </div>
        </div>
    );
}

window.red5NormalizeBlindType = red5NormalizeBlindType;
window.WindowBlindTypeSelect = WindowBlindTypeSelect;
window.WindowBlindPreview = WindowBlindPreview;
window.WindowBlindsPopout = WindowBlindsPopout;
