/* ------------------------------------------------------------------
 * window-blinds-popout.js — blinds UI for floor windows.
 * Operator (dashboard floor plan) pops Open % + type next to the
 * clicked window. Mapper config uses the Windows list / panel instead.
 * ------------------------------------------------------------------ */

function wpNormBlindType(t) {
    return window.red5NormalizeBlindType ? window.red5NormalizeBlindType(t) : 'roller';
}

function red5BlindSpecLocal(t) {
    return window.red5BlindSpec ? window.red5BlindSpec(t) : { id: 'roller', label: 'Roller', hint: '', motion: 'drop' };
}

function WindowBlindTypeSelect(props) {
    const bt = wpNormBlindType(props.value);
    const dk = props.theme !== 'light';
    const types = window.RED5_BLIND_TYPES || [
        { id: 'roller', label: 'Roller', short: 'Roller' },
        { id: 'horizontal', label: 'Horizontal — lift', short: 'H · lift' },
        { id: 'horizontal-tilt', label: 'Horizontal — tilt', short: 'H · tilt' },
        { id: 'vertical', label: 'Vertical — tilt', short: 'V · tilt' },
        { id: 'vertical-stack', label: 'Vertical — stack', short: 'V · stack' },
    ];
    return (
        <div className="grid grid-cols-5 gap-1" data-testid={props.testId || 'wp-blind-type'} role="listbox" aria-label="Blind style">
            {types.map((t) => {
                const on = t.id === bt;
                return (
                    <button
                        key={t.id}
                        type="button"
                        role="option"
                        aria-selected={on}
                        title={t.hint || t.label}
                        onClick={() => { if (props.onChange) props.onChange(t.id); }}
                        className={`rounded border px-0.5 pt-0.5 pb-1 cursor-pointer text-center transition-all ${
                            on
                                ? (dk ? 'border-sky-400 bg-sky-950/70 ring-1 ring-sky-400/80' : 'border-sky-500 bg-sky-50 ring-1 ring-sky-400')
                                : (dk ? 'border-slate-700 bg-slate-900/80 hover:border-slate-500' : 'border-slate-300 bg-white hover:border-slate-400')
                        }`}
                    >
                        <div className="pointer-events-none h-[34px] overflow-hidden rounded-sm">
                            <WindowBlindPreview
                                w={{ blind_type: t.id, blind_level: 0.5 }}
                                width={120}
                                height={48}
                                className="w-full h-[34px]"
                            />
                        </div>
                        <div className={`mt-0.5 text-[7px] font-black uppercase tracking-wide leading-tight ${
                            on ? (dk ? 'text-sky-300' : 'text-sky-700') : (dk ? 'text-slate-500' : 'text-slate-500')
                        }`}>{t.short}</div>
                    </button>
                );
            })}
        </div>
    );
}

function WindowBlindPreview(props) {
    const w = props.w || {};
    const open = Math.max(0, Math.min(1, 1 - (Number(w.blind_level) || 0)));
    const type = wpNormBlindType(w.blind_type);
    const W = Number(props.width) || 220;
    const H = Number(props.height) || 72;
    const glass = { x: 10, y: 8, w: W - 20, h: H - 20 };
    const rects = window.red5BlindElevationRects
        ? window.red5BlindElevationRects(type, open, glass.x, glass.y, glass.w, glass.h)
        : [];
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className={props.className || 'w-full h-[72px]'} data-testid="window-blind-preview">
            <rect x="4" y="4" width={W - 8} height={H - 8} rx="3" fill="#cbd5e1" stroke="#64748b" strokeWidth="4"/>
            <rect x={glass.x} y={glass.y} width={glass.w} height={glass.h} fill="#38bdf8" opacity="0.55"/>
            {rects.map((r, i) => (
                <rect key={i} x={r.x} y={r.y} width={r.width} height={r.height}
                      fill="#1e293b" opacity={r.opacity}/>
            ))}
        </svg>
    );
}

function WindowBlindMarks(props) {
    const x = Number(props.x) || 0;
    const y = Number(props.y) || 0;
    const W = Math.max(0.5, Number(props.width) || 100);
    const H = Math.max(0.5, Number(props.height) || 24);
    const open = Math.max(0, Math.min(1, Number(props.open)));
    const type = wpNormBlindType(props.type);
    const fill = props.fill || '#1e293b';
    const rects = window.red5BlindElevationRects
        ? window.red5BlindElevationRects(type, open, x, y, W, H)
        : [];
    if (!rects.length) return null;
    return (
        <g>
            {rects.map((r, i) => (
                <rect key={i} x={r.x} y={r.y} width={r.width} height={r.height}
                      fill={fill} opacity={r.opacity}/>
            ))}
        </g>
    );
}

/** 2.5D wall pane on the plan — glass + roller/slats so type is visible. */
function WindowPlanPane(props) {
    const w = props.w || {};
    const selected = !!props.selected;
    const showTrace = props.showTrace !== false;
    const open = Math.max(0, Math.min(1, 1 - (Number(w.blind_level) || 0)));
    const type = wpNormBlindType(w.blind_type);
    const len = Math.max(Number(w.length) || 8, 3);
    const typeName = red5BlindSpecLocal(type).label;
    return (
        <div
            data-testid={props.testId}
            title={props.title || (`Window · ${typeName} · ${Math.round(open * 100)}% open`)}
            onMouseDown={props.onMouseDown}
            onClick={props.onClick}
            style={{
                position: 'absolute',
                left: `${w.x}%`,
                top: `${w.y}%`,
                width: `${len}%`,
                height: selected && showTrace ? 32 : 16,
                transform: `translate(-50%, -50%) rotate(${Number(w.angle_deg) || 0}deg)`,
                cursor: props.cursor || 'pointer',
                zIndex: selected ? (props.zSelected || 95) : (props.zIdle || 16),
                pointerEvents: 'auto',
            }}
        >
            <svg viewBox="0 0 100 24" preserveAspectRatio="none"
                 style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}>
                <rect x="0.6" y="1" width="98.8" height="22" rx="1.2"
                      fill={showTrace ? (selected ? '#7dd3fc' : '#38bdf8') : 'rgba(0,0,0,0.01)'}
                      opacity={showTrace ? (0.38 + 0.42 * open) : 1}
                      stroke={showTrace ? (selected ? '#fde68a' : 'rgba(186,230,253,0.55)') : 'none'}
                      strokeWidth={showTrace ? (selected ? 2.2 : 1.2) : 0}/>
                {(showTrace || open < 0.99) && (
                    <WindowBlindMarks width={100} height={24} open={open} type={type}/>
                )}
            </svg>
        </div>
    );
}

/**
 * First traced edge (vertices[0]→[1]) is the HEAD — same rule as red5-elc.
 * Horizontal slats stay parallel to that slope. Vertical vanes follow the
 * jambs (parallelogram), not a Euclidean 90° from the head.
 */
function wpHeadSillAxes(verts) {
    return window.red5HeadSillAxes ? window.red5HeadSillAxes(verts) : null;
}

function TracedWindowBlindMarks(props) {
    const verts = props.verts || [];
    const axes = wpHeadSillAxes(verts);
    if (!axes) return null;
    const open = Math.max(0, Math.min(1, Number(props.open)));
    const spec = red5BlindSpecLocal(props.type);
    const cover = 1 - open;
    const sealed = open < 0.01;
    if (!sealed && cover < 0.012 && spec.motion !== 'stack' && spec.motion !== 'lift') return null;
    const pad = 0.6;
    const { sMin, sMax, hMin, hMax, hSpan, sSpan, atSH } = axes;
    const n = 10;
    const lines = [];
    if (sealed || spec.motion === 'drop') {
        const f = sealed ? 1 : cover;
        if (f <= 0.001) return null;
        const a = atSH(sMin - pad, hMax + 0.2);
        const b = atSH(sMax + pad, hMax + 0.2);
        const c = atSH(sMax + pad, hMax - f * hSpan);
        const d = atSH(sMin - pad, hMax - f * hSpan);
        return <polygon points={[a, b, c, d].map(p => p[0] + ',' + p[1]).join(' ')}
                        fill="#1e293b" opacity={0.30 + 0.42 * f}/>;
    }
    if (spec.family === 'horizontal' && spec.motion === 'lift') {
        const band = cover * hSpan;
        if (band < 0.15) return null;
        const pitch = band / n;
        const sw = Math.max(0.28, Math.min(1.2, pitch * 0.78));
        for (let i = 0; i < n; i++) {
            const hv = hMax - (i + 0.5) * pitch;
            const a = atSH(sMin - pad, hv);
            const b = atSH(sMax + pad, hv);
            lines.push(
                <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
                      stroke="#1e293b" strokeWidth={sw} strokeLinecap="butt"
                      opacity={0.48 + cover * 0.38}/>
            );
        }
        return <g>{lines}</g>;
    }
    if (spec.family === 'horizontal' && spec.motion === 'tilt') {
        const pitch = hSpan / n;
        const sw = Math.max(0.28, pitch * (0.10 + 0.86 * cover));
        for (let i = 0; i < n; i++) {
            const hv = hMax - (i + 0.5) * pitch;
            const a = atSH(sMin - pad, hv);
            const b = atSH(sMax + pad, hv);
            lines.push(
                <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
                      stroke="#1e293b" strokeWidth={sw} strokeLinecap="butt"
                      opacity={0.38 + cover * 0.48}/>
            );
        }
        return <g>{lines}</g>;
    }
    if (spec.family === 'vertical' && spec.motion === 'tilt') {
        const pitch = sSpan / n;
        const sw = Math.max(0.28, pitch * (0.10 + 0.86 * cover));
        for (let i = 0; i < n; i++) {
            const sv = sMin + (i + 0.5) * pitch;
            const a = atSH(sv, hMin - 0.2);
            const b = atSH(sv, hMax + 0.2);
            lines.push(
                <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
                      stroke="#1e293b" strokeWidth={sw} strokeLinecap="butt"
                      opacity={0.38 + cover * 0.48}/>
            );
        }
        return <g>{lines}</g>;
    }
    /* vertical stack — vanes packed toward sMin, opening on sMax */
    const band = open > 0.97 ? Math.max(0.35, sSpan * 0.045) : cover * sSpan;
    if (band < 0.12) return null;
    const pitch = band / n;
    const sw = Math.max(0.28, pitch * 0.72);
    for (let i = 0; i < n; i++) {
        const sv = sMin + (i + 0.5) * pitch;
        const a = atSH(sv, hMin - 0.2);
        const b = atSH(sv, hMax + 0.2);
        lines.push(
            <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
                  stroke="#1e293b" strokeWidth={sw} strokeLinecap="butt"
                  opacity={0.48 + cover * 0.38}/>
        );
    }
    return <g>{lines}</g>;
}

/** Blind marks clipped to a traced glass polygon (plan % coords). */
function TracedWindowBlindOverlay(props) {
    const w = props.w || {};
    const verts = Array.isArray(w.vertices) ? w.vertices : [];
    if (verts.length < 3) return null;
    const selected = !!props.selected;
    const showTrace = props.showTrace !== false;
    const open = Math.max(0, Math.min(1, 1 - (Number(w.blind_level) || 0)));
    const type = wpNormBlindType(w.blind_type);
    const clipId = 'wb-clip-' + String(w.id || props.clipKey || 'w');
    return (
        <g data-testid={props.testId}>
            <clipPath id={clipId}>
                <polygon points={verts.map(v => `${v[0]},${v[1]}`).join(' ')}/>
            </clipPath>
            <polygon
                points={verts.map(v => `${v[0]},${v[1]}`).join(' ')}
                fill={showTrace ? (selected ? 'rgba(125,211,252,0.28)' : 'rgba(125,211,252,0.12)') : 'rgba(0,0,0,0.01)'}
                stroke={showTrace ? (selected ? '#fbbf24' : '#7dd3fc') : 'none'}
                strokeWidth={showTrace ? (selected ? 1.25 : 1) : 0}
                vectorEffect="non-scaling-stroke"
                style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                onClick={props.onClick}
                onMouseDown={props.onMouseDown}
            />
            <g clipPath={'url(#' + clipId + ')'} style={{ pointerEvents: 'none' }}>
                <TracedWindowBlindMarks verts={verts} open={open} type={type}/>
            </g>
        </g>
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
    const spec = red5BlindSpecLocal(w.blind_type);
    const typeName = spec.short || spec.label;
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
            className={`absolute z-[96] w-[280px] rounded-md border shadow-2xl pointer-events-auto ${
                dk ? 'bg-slate-950/95 border-sky-500/70 text-slate-200' : 'bg-white/95 border-sky-400 text-slate-800'
            }`}
            style={{
                left: `${w.x}%`,
                top: `${w.y}%`,
                width: 280,
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
                <span className="font-mono truncate" title={spec.hint}>{label} · {typeName}</span>
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
                <div>
                    <div className="text-[8px] opacity-60 uppercase mb-1" title="Blind style">Type</div>
                    <WindowBlindTypeSelect
                        theme={theme}
                        value={w.blind_type}
                        testId={`window-type-${w.id}`}
                        onChange={(bt) => patch({ blind_type: bt })}
                    />
                </div>
                <div className={`text-[8px] leading-snug ${dk ? 'text-slate-500' : 'text-slate-500'}`}>{spec.hint}</div>
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

window.WindowBlindTypeSelect = WindowBlindTypeSelect;
window.WindowBlindPreview = WindowBlindPreview;
window.WindowBlindMarks = WindowBlindMarks;
window.WindowPlanPane = WindowPlanPane;
window.TracedWindowBlindOverlay = TracedWindowBlindOverlay;
window.WindowBlindsPopout = WindowBlindsPopout;
