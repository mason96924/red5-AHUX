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
    const sealed = open < 0.01;
    const W = 220, H = 72;
    const glass = { x: 10, y: 8, w: 200, h: 52 };
    const shade = (
        <rect x={glass.x} y={glass.y} width={glass.w} height={glass.h}
              fill="#334155" opacity="0.88"/>
    );
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[72px]" data-testid="window-blind-preview">
            <rect x="4" y="4" width={W - 8} height={H - 8} rx="3" fill="#cbd5e1" stroke="#64748b" strokeWidth="4"/>
            <rect x={glass.x} y={glass.y} width={glass.w} height={glass.h} fill="#38bdf8" opacity="0.55"/>
            {sealed && shade}
            {!sealed && type === 'roller' && (1 - open) * glass.h > 0.5 && (
                <rect x={glass.x} y={glass.y} width={glass.w} height={(1 - open) * glass.h}
                      fill="#334155" opacity="0.88"/>
            )}
            {!sealed && type === 'horizontal' && Array.from({ length: 8 }).map((_, i) => {
                const y = glass.y + (i + 0.5) * (glass.h / 8);
                const tilt = 1 - open;
                return (
                    <rect key={i} x={glass.x + 2} y={y - (1 + tilt * 2.5)}
                          width={glass.w - 4} height={1.2 + tilt * 5}
                          fill="#1e293b" opacity={0.35 + tilt * 0.55}/>
                );
            })}
            {!sealed && type === 'vertical' && Array.from({ length: 8 }).map((_, i) => {
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

function WindowBlindMarks(props) {
    const x = Number(props.x) || 0;
    const y = Number(props.y) || 0;
    const W = Math.max(0.5, Number(props.width) || 100);
    const H = Math.max(0.5, Number(props.height) || 24);
    const open = Math.max(0, Math.min(1, Number(props.open)));
    const type = red5NormalizeBlindType(props.type);
    const sealed = open < 0.01;
    const fill = props.fill || '#1e293b';
    if (sealed) {
        return <rect x={x} y={y} width={W} height={H} fill={fill} opacity="0.88"/>;
    }
    if (type === 'roller') {
        const drop = (1 - open) * H;
        if (drop < 0.35) return null;
        return <rect x={x} y={y} width={W} height={drop} fill={fill} opacity="0.88"/>;
    }
    if (type === 'horizontal') {
        const n = Math.max(4, Math.round(5 + (1 - open) * 7));
        const tilt = 1 - open;
        const slatH = Math.max(H / n * (0.32 + 0.58 * tilt), 0.55);
        return (
            <g>
                {Array.from({ length: n }).map((_, i) => {
                    const cy = y + (i + 0.5) * (H / n);
                    return (
                        <rect key={i} x={x} y={cy - slatH / 2} width={W} height={slatH}
                              fill={fill} opacity={0.40 + tilt * 0.48}/>
                    );
                })}
            </g>
        );
    }
    const n = Math.max(4, Math.round(5 + (1 - open) * 7));
    const tilt = 1 - open;
    const slatW = Math.max(W / n * (0.28 + 0.62 * tilt), 0.55);
    return (
        <g>
            {Array.from({ length: n }).map((_, i) => {
                const cx = x + (i + 0.5) * (W / n);
                return (
                    <rect key={i} x={cx - slatW / 2} y={y} width={slatW} height={H}
                          fill={fill} opacity={0.40 + tilt * 0.48}/>
                );
            })}
        </g>
    );
}

/** 2.5D wall pane on the plan — glass + roller/slats so type is visible. */
function WindowPlanPane(props) {
    const w = props.w || {};
    const selected = !!props.selected;
    const showTrace = props.showTrace !== false;
    const open = Math.max(0, Math.min(1, 1 - (Number(w.blind_level) || 0)));
    const type = red5NormalizeBlindType(w.blind_type);
    const len = Math.max(Number(w.length) || 8, 3);
    const typeName = type === 'horizontal' ? 'horizontal slats' : type === 'vertical' ? 'vertical slats' : 'roller';
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
 * Roller / horizontal louvers stay parallel to that slope. Vertical is
 * screen-upright.
 */
function red5HeadSillAxes(verts) {
    if (!verts || verts.length < 2) return null;
    const pts = verts.map(v => [Number(v[0]), Number(v[1])]);
    let sx = pts[1][0] - pts[0][0];
    let sy = pts[1][1] - pts[0][1];
    const slen = Math.hypot(sx, sy) || 1;
    sx /= slen; sy /= slen;
    let hx = -sy, hy = sx;
    let cx = 0, cy = 0;
    for (let i = 0; i < pts.length; i++) { cx += pts[i][0]; cy += pts[i][1]; }
    cx /= pts.length; cy /= pts.length;
    const headH0 = pts[0][0] * hx + pts[0][1] * hy;
    if (cx * hx + cy * hy > headH0) { hx = -hx; hy = -hy; }
    const dotsS = pts.map(p => p[0] * sx + p[1] * sy);
    const dotsH = pts.map(p => p[0] * hx + p[1] * hy);
    const sMin = Math.min.apply(null, dotsS), sMax = Math.max.apply(null, dotsS);
    const hMin = Math.min.apply(null, dotsH), hMax = Math.max.apply(null, dotsH);
    return {
        sMin, sMax, hMin, hMax,
        sSpan: Math.max(0.2, sMax - sMin),
        hSpan: Math.max(0.2, hMax - hMin),
        atSH: (sv, hv) => [sv * sx + hv * hx, sv * sy + hv * hy],
        minX: Math.min.apply(null, pts.map(p => p[0])),
        maxX: Math.max.apply(null, pts.map(p => p[0])),
        minY: Math.min.apply(null, pts.map(p => p[1])),
        maxY: Math.max.apply(null, pts.map(p => p[1])),
    };
}

function TracedWindowBlindMarks(props) {
    const verts = props.verts || [];
    const axes = red5HeadSillAxes(verts);
    if (!axes) return null;
    const open = Math.max(0, Math.min(1, Number(props.open)));
    const type = red5NormalizeBlindType(props.type);
    const cover = 1 - open;
    const sealed = open < 0.01;
    if (!sealed && cover < 0.01) return null;
    const pad = 0.6;
    const { sMin, sMax, hMax, hSpan, atSH, minX, maxX, minY, maxY } = axes;
    const bandPoints = (frac) => {
        const f = Math.min(1, Math.max(0, frac));
        const a = atSH(sMin - pad, hMax + 0.2);
        const b = atSH(sMax + pad, hMax + 0.2);
        const c = atSH(sMax + pad, hMax - f * hSpan);
        const d = atSH(sMin - pad, hMax - f * hSpan);
        return [a, b, c, d].map(p => p[0] + ',' + p[1]).join(' ');
    };
    if (sealed || type === 'roller') {
        const f = sealed ? 1 : cover;
        if (f <= 0.001) return null;
        return <polygon points={bandPoints(f)} fill="#1e293b" opacity={0.30 + 0.42 * f}/>;
    }
    if (type === 'horizontal') {
        const n = Math.max(5, Math.round(6 + cover * 10));
        const sw = Math.max(0.32, Math.min(1.15, hSpan / n * 0.85));
        const lines = [];
        for (let i = 0; i < n; i++) {
            const u = (i + 0.5) / n;
            if (u > cover) continue;
            const hv = hMax - u * hSpan;
            const a = atSH(sMin - pad, hv);
            const b = atSH(sMax + pad, hv);
            lines.push(
                <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
                      stroke="#1e293b" strokeWidth={sw} strokeLinecap="butt"
                      opacity={0.40 + cover * 0.45}/>
            );
        }
        return (
            <g>
                {cover > 0.7 && (
                    <polygon points={bandPoints(cover)} fill="#1e293b" opacity={0.18 + 0.35 * cover}/>
                )}
                {lines}
            </g>
        );
    }
    const n = Math.max(5, Math.round(6 + cover * 10));
    const wPx = Math.max(0.4, maxX - minX);
    const sw = Math.max(0.28, Math.min(1.0, wPx / n * 0.75));
    const lines = [];
    for (let i = 0; i < n; i++) {
        const u = (i + 0.5) / n;
        const x = minX + wPx * u;
        lines.push(
            <line key={i} x1={x} y1={minY - 0.3} x2={x} y2={maxY + 0.3}
                  stroke="#1e293b" strokeWidth={sw} strokeLinecap="butt"
                  opacity={0.40 + cover * 0.45}/>
        );
    }
    return (
        <g>
            {cover > 0.55 && (
                <rect x={minX} y={minY} width={wPx} height={Math.max(0.4, maxY - minY)}
                      fill="#1e293b" opacity={(cover - 0.55) * 0.55}/>
            )}
            {lines}
        </g>
    );
}

/** Blind marks clipped to a traced glass polygon (plan % coords). */
function TracedWindowBlindOverlay(props) {
    const w = props.w || {};
    const verts = Array.isArray(w.vertices) ? w.vertices : [];
    if (verts.length < 3) return null;
    const selected = !!props.selected;
    const showTrace = props.showTrace !== false;
    const open = Math.max(0, Math.min(1, 1 - (Number(w.blind_level) || 0)));
    const type = red5NormalizeBlindType(w.blind_type);
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
    const type = red5NormalizeBlindType(w.blind_type);
    const typeName = type === 'horizontal' ? 'Horizontal' : type === 'vertical' ? 'Vertical' : 'Roller';
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
                <span className="font-mono truncate">{label} · {typeName}</span>
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
window.red5HeadSillAxes = red5HeadSillAxes;
window.WindowBlindTypeSelect = WindowBlindTypeSelect;
window.WindowBlindPreview = WindowBlindPreview;
window.WindowBlindMarks = WindowBlindMarks;
window.WindowPlanPane = WindowPlanPane;
window.TracedWindowBlindOverlay = TracedWindowBlindOverlay;
window.WindowBlindsPopout = WindowBlindsPopout;
