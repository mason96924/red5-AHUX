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
    const interactive = props.interactive !== false;
    const open = Math.max(0, Math.min(1, 1 - (Number(w.blind_level) || 0)));
    const type = wpNormBlindType(w.blind_type);
    const len = Math.max(Number(w.length) || 8, 3);
    const typeName = red5BlindSpecLocal(type).label;
    return (
        <div
            data-testid={props.testId}
            title={props.title || (`Window · ${typeName} · ${Math.round(open * 100)}% open`)}
            onMouseDown={interactive ? props.onMouseDown : undefined}
            onClick={interactive ? props.onClick : undefined}
            style={{
                position: 'absolute',
                left: `${w.x}%`,
                top: `${w.y}%`,
                width: `${len}%`,
                height: selected && showTrace ? 10 : 7,
                transform: `translate(-50%, -50%) rotate(${Number(w.angle_deg) || 0}deg)`,
                cursor: interactive ? (props.cursor || 'pointer') : 'inherit',
                zIndex: selected ? (props.zSelected || 95) : (props.zIdle || 16),
                pointerEvents: interactive ? 'auto' : 'none',
            }}
        >
            <svg viewBox="0 0 100 24" preserveAspectRatio="none"
                 style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}>
                <rect x="0.6" y="4" width="98.8" height="16" rx="0.6"
                      fill={showTrace ? 'rgba(56,189,248,0.10)' : 'rgba(0,0,0,0.01)'}
                      opacity={showTrace ? (0.55 + 0.35 * open) : 1}
                      stroke={showTrace ? (selected ? 'rgba(150,210,255,0.85)' : 'rgba(56,189,248,0.45)') : 'none'}
                      strokeWidth={showTrace ? (selected ? 1.1 : 0.7) : 0}/>
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
    const pad = 0.6;
    const { sMin, sMax, hMin, hMax, hSpan, sSpan, atSH, minX, maxX, minY, maxY } = axes;
    const n = 10;
    /* 1 plan-% ≈ 12 CSS px on a typical floor image — matches ELC canvas px. */
    const PX = 12;
    const line = (key, x1, y1, x2, y2, swPx, alpha) => (
        <line key={key} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#1e293b" strokeWidth={swPx} strokeLinecap="butt"
              vectorEffect="non-scaling-stroke"
              opacity={alpha}/>
    );
    if (open < 0.01) {
        const a = atSH(sMin - pad, hMax + 0.2);
        const b = atSH(sMax + pad, hMax + 0.2);
        const c = atSH(sMax + pad, hMin - 0.2);
        const d = atSH(sMin - pad, hMin - 0.2);
        return <polygon points={[a, b, c, d].map(p => p[0] + ',' + p[1]).join(' ')}
                        fill="#1e293b" opacity={0.88}/>;
    }
    if (spec.motion === 'drop') {
        const f = cover;
        if (f <= 0.001) return null;
        const a = atSH(sMin - pad, hMax + 0.2);
        const b = atSH(sMax + pad, hMax + 0.2);
        const c = atSH(sMax + pad, hMax - f * hSpan);
        const d = atSH(sMin - pad, hMax - f * hSpan);
        return <polygon points={[a, b, c, d].map(p => p[0] + ',' + p[1]).join(' ')}
                        fill="#1e293b" opacity={0.30 + 0.42 * f}/>;
    }
    const lines = [];
    if (spec.family === 'horizontal' && spec.motion === 'lift') {
        const band = cover * hSpan;
        if (band * PX < 0.4) return null;
        const pitch = band / n;
        const sw = Math.max(1.05, Math.min(4.5, (band * PX) / n * 0.78));
        for (let i = 0; i < n; i++) {
            const hv = hMax - (i + 0.5) * pitch;
            const a = atSH(sMin - pad, hv);
            const b = atSH(sMax + pad, hv);
            lines.push(line(i, a[0], a[1], b[0], b[1], sw, 0.48 + cover * 0.38));
        }
        return <g>{lines}</g>;
    }
    if (spec.family === 'horizontal' && spec.motion === 'tilt') {
        const pitch = hSpan / n;
        const sw = Math.max(1.05, (hSpan * PX / n) * (0.10 + 0.86 * cover));
        for (let i = 0; i < n; i++) {
            const hv = hMax - (i + 0.5) * pitch;
            const a = atSH(sMin - pad, hv);
            const b = atSH(sMax + pad, hv);
            lines.push(line(i, a[0], a[1], b[0], b[1], sw, 0.38 + cover * 0.48));
        }
        return <g>{lines}</g>;
    }
    const x0 = minX, x1 = maxX;
    const y0 = (minY != null ? minY : 0) - 0.15;
    const y1 = (maxY != null ? maxY : 100) + 0.15;
    const spanX = Math.max(0.2, (x1 != null && x0 != null) ? (x1 - x0) : sSpan);
    const spanPx = spanX * PX;
    if (spec.family === 'vertical' && spec.motion === 'tilt') {
        const nV = Math.max(14, Math.round(spanPx / 5.5));
        const pitch = spanX / nV;
        const sw = Math.max(0.7, (spanPx / nV) * (0.08 + 0.58 * cover));
        for (let i = 0; i < nV; i++) {
            const x = x0 + (i + 0.5) * pitch;
            lines.push(line(i, x, y0, x, y1, sw, 0.38 + cover * 0.48));
        }
        return <g>{lines}</g>;
    }
    /* vertical stack — vanes packed toward minX, opening toward maxX */
    const bandPx = open > 0.97 ? Math.max(2.2, spanPx * 0.045) : cover * spanPx;
    if (bandPx < 0.4) return null;
    const nV = Math.max(14, Math.round(bandPx / 4.5));
    const band = bandPx / PX;
    const pitch = band / nV;
    const sw = Math.max(0.7, (bandPx / nV) * 0.50);
    for (let i = 0; i < nV; i++) {
        const x = x0 + (i + 0.5) * pitch;
        lines.push(line(i, x, y0, x, y1, sw, 0.48 + cover * 0.38));
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
    const interactive = props.interactive !== false;
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
                fill={showTrace ? (selected ? 'rgba(150,210,255,0.14)' : 'rgba(56,189,248,0.05)') : 'rgba(0,0,0,0.01)'}
                stroke={showTrace ? (selected ? 'rgba(150,210,255,0.80)' : 'rgba(56,189,248,0.40)') : 'none'}
                strokeWidth={showTrace ? (selected ? 0.22 : 0.14) : 0}
                style={{ pointerEvents: interactive ? 'auto' : 'none', cursor: interactive ? 'pointer' : 'inherit' }}
                onClick={interactive ? props.onClick : undefined}
                onMouseDown={interactive ? props.onMouseDown : undefined}
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

/** ELC MODULE-SMI sim: full 0↔100 travel in 8 s (~12.5 %/s). Stop holds. */
const SMI_TRAVEL_S = 8;
const SMI_TICK_MS = 250;
const _smiMotors = new Map();
let _smiTickTimer = 0;
let _smiPatchRef = { fn: null, wins: [] };

function _smiWinKey(w, i) {
    return w && w.id != null ? String(w.id) : ('idx-' + i);
}

function _smiClosedOf(w) {
    return Math.min(1, Math.max(0, Number(w && w.blind_level) || 0));
}

function _smiEnsureTicker() {
    if (_smiTickTimer) return;
    _smiTickTimer = setInterval(function () {
        const onPatch = _smiPatchRef.fn;
        const list = _smiPatchRef.wins || [];
        const speed = 1 / SMI_TRAVEL_S;
        const dt = SMI_TICK_MS / 1000;
        let moving = false;
        list.forEach(function (w, i) {
            const id = _smiWinKey(w, i);
            const m = _smiMotors.get(id);
            if (!m || !m.moving) return;
            moving = true;
            const delta = speed * dt;
            if (Math.abs(m.target - m.closed) <= delta) {
                m.closed = m.target;
                m.moving = false;
            } else if (m.target > m.closed) {
                m.closed = Math.min(1, m.closed + delta);
            } else {
                m.closed = Math.max(0, m.closed - delta);
            }
            if (onPatch) onPatch(w.id, { blind_level: m.closed }, i);
        });
        if (!moving) {
            clearInterval(_smiTickTimer);
            _smiTickTimer = 0;
        }
    }, SMI_TICK_MS);
}

function _smiGotoClosed(wins, targetClosed, onPatch) {
    const t = Math.min(1, Math.max(0, Number(targetClosed)));
    _smiPatchRef = { fn: onPatch, wins: wins || [] };
    (wins || []).forEach(function (w, i) {
        const id = _smiWinKey(w, i);
        const prev = _smiMotors.get(id);
        const cur = prev ? prev.closed : _smiClosedOf(w);
        _smiMotors.set(id, { closed: cur, target: t, moving: Math.abs(t - cur) > 0.008 });
    });
    _smiEnsureTicker();
}

function _smiStopWins(wins, onPatch) {
    _smiPatchRef = { fn: onPatch, wins: wins || [] };
    (wins || []).forEach(function (w, i) {
        const id = _smiWinKey(w, i);
        const prev = _smiMotors.get(id);
        const cur = prev ? prev.closed : _smiClosedOf(w);
        _smiMotors.set(id, { closed: cur, target: cur, moving: false });
        if (onPatch) onPatch(w.id, { blind_level: cur }, i);
    });
}

/** Bottom-right ▤ Windows rail — slide up/down (ELC blinds-rail). */
function FloorWindowsRail(props) {
    const React = window.React;
    const {
        theme, windows, floorKey, open, onToggleOpen,
        selectedId, onSelect, onPatch, smiModules,
    } = props;
    const dk = theme !== 'light';
    const wins = Array.isArray(windows) ? windows : [];
    const [picked, setPicked] = React.useState(() => new Set());
    React.useEffect(() => {
        if (selectedId == null || selectedId === '') return;
        setPicked((prev) => {
            if (prev.has(selectedId) && prev.size === 1) return prev;
            return new Set([selectedId]);
        });
    }, [selectedId]);
    const targets = (() => {
        const sel = wins.filter((w, i) => {
            const id = w.id != null ? w.id : ('idx-' + i);
            return picked.has(id) || picked.has(w.id);
        });
        return sel.length ? sel : wins;
    })();
    const openPctOf = (w) => Math.round((1 - Math.min(1, Math.max(0, Number(w.blind_level) || 0))) * 100);
    const avgOpen = targets.length
        ? Math.round(targets.reduce((s, w) => s + openPctOf(w), 0) / targets.length)
        : null;
    const floorName = String(floorKey || '').toUpperCase();
    const mods = Array.isArray(smiModules) ? smiModules : [];
    const wiredWins = wins.filter((w) => w.smi_addr != null && w.smi_addr !== '');
    const smiMod = mods.find((m) => String(m.floor || '').toUpperCase() === floorName) || mods[0] || (wiredWins.length ? {
        id: wiredWins[0].smi_id != null ? wiredWins[0].smi_id : 1,
        port: 11,
    } : null);
    const driveKey = (w) => {
        if (!w || w.smi_addr == null || w.smi_addr === '') return '';
        const id = w.smi_id != null ? w.smi_id : (smiMod && smiMod.id);
        if (id == null || id === '') return '';
        return id + ':' + Number(w.smi_addr);
    };
    const driveTag = (w) => (w && w.smi_addr != null && w.smi_addr !== '') ? ('D' + Number(w.smi_addr)) : '';
    const patchWins = (list, fields) => {
        if (!onPatch) return;
        list.forEach((w) => {
            const wi = wins.indexOf(w);
            onPatch(w.id, fields, wi < 0 ? undefined : wi);
        });
    };
    const patchRef = React.useRef(onPatch);
    patchRef.current = onPatch;
    const applyPatch = (wid, fields, wi) => {
        const fn = patchRef.current;
        if (fn) fn(wid, fields, wi);
    };
    _smiPatchRef.fn = applyPatch;
    _smiPatchRef.wins = wins;
    const travelOpenPct = (pct) => {
        const v = Math.max(0, Math.min(100, Number(pct) || 0));
        _smiGotoClosed(targets, 1 - v / 100, applyPatch);
    };
    const smiCommand = (command) => {
        if (command === 'Stop') {
            _smiStopWins(targets, applyPatch);
        } else if (command === 'Up') {
            _smiGotoClosed(targets, 0, applyPatch);
        } else if (command === 'Down') {
            _smiGotoClosed(targets, 1, applyPatch);
        }
        const jobs = targets.filter((w) => w.smi_addr != null && w.smi_addr !== '');
        jobs.forEach((w) => {
            const addr = Number(w.smi_addr);
            const smiId = w.smi_id != null ? w.smi_id : (smiMod && smiMod.id);
            const body = JSON.stringify({ command: command, smi_id: smiId });
            ['/api/smi/drives/' + addr + '/command', '/smi/drives/' + addr + '/command'].forEach((url) => {
                try {
                    fetch(url, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body }).catch(() => {});
                } catch (_) {}
            });
        });
    };
    const [scrubOpen, setScrubOpen] = React.useState(null);
    const shownOpen = scrubOpen != null ? scrubOpen : avgOpen;
    const wireDrive = (raw) => {
        if (!targets.length) return;
        if (!raw) {
            patchWins(targets, { smi_id: null, smi_addr: null });
            return;
        }
        const parts = String(raw).split(':');
        patchWins(targets, { smi_id: parseInt(parts[0], 10), smi_addr: parseInt(parts[1], 10) });
    };
    const autoWire = () => {
        if (!smiMod || !wins.length || !onPatch) return;
        wins.forEach((w, i) => {
            onPatch(w.id, { smi_id: smiMod.id, smi_addr: i % 16 }, i);
        });
    };
    const driveKeys = targets.map(driveKey);
    const uniqueDrives = [];
    driveKeys.forEach((k) => { if (uniqueDrives.indexOf(k) < 0) uniqueDrives.push(k); });
    const mixedDrives = uniqueDrives.length > 1;
    const curDrive = uniqueDrives.length === 1 ? uniqueDrives[0] : '';
    const allOn = wins.length > 0 && wins.every((w, i) => picked.has(w.id != null ? w.id : ('idx-' + i)));
    const nAuto = targets.filter((w) => w.heat_auto).length;
    const btn = 'px-1.5 py-0.5 rounded border text-[9px] font-black uppercase tracking-wider';
    const btnIdle = dk
        ? ' bg-slate-800 border-slate-600 text-slate-200 hover:border-sky-400'
        : ' bg-white border-slate-300 text-slate-700 hover:border-sky-500';
    return (
        <div
            data-testid="blinds-rail"
            className="pointer-events-auto"
            style={{
                position: 'absolute', right: 8, bottom: 8, zIndex: 55, width: 268,
                borderRadius: 6, overflow: 'hidden',
                background: dk ? 'rgba(16,20,26,0.94)' : 'rgba(248,250,252,0.96)',
                border: dk ? '1px solid #334155' : '1px solid #cbd5e1',
                boxShadow: '0 8px 28px rgba(0,0,0,0.45)',
            }}
            onMouseDown={(e) => e.stopPropagation()}
        >
            <button type="button" data-testid="blinds-rail-tab"
                    aria-expanded={!!open}
                    onClick={() => { if (onToggleOpen) onToggleOpen(!open); }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left ${dk ? 'hover:bg-slate-800/80' : 'hover:bg-slate-100'}`}>
                <span className={`text-[10px] font-black uppercase tracking-[0.18em] ${dk ? 'text-sky-300' : 'text-sky-700'}`}>▤ Windows</span>
                <span className={`text-[10px] ${dk ? 'text-slate-500' : 'text-slate-400'}`} style={{ transform: open ? 'rotate(180deg)' : 'none' }}>▲</span>
            </button>
            <div style={{ maxHeight: open ? 420 : 0, overflow: open ? 'auto' : 'hidden', transition: 'max-height .28s ease' }}>
                <div className="px-3 pb-3 space-y-1.5">
                    <div className={`text-[9px] ${dk ? 'text-slate-400' : 'text-slate-500'}`}>
                        {!wins.length ? 'No windows on this floor'
                            : (picked.size ? (picked.size === 1 ? '1 selected' : picked.size + ' selected') : 'All windows on this floor')}
                    </div>
                    <div className="flex gap-1">
                        <button type="button" data-testid="blinds-rail-up" disabled={!wins.length}
                                className={btn + btnIdle + ' flex-1'} onClick={() => smiCommand('Up')}>Up</button>
                        <button type="button" data-testid="blinds-rail-stop" disabled={!wins.length}
                                className={btn + btnIdle + ' flex-1'} onClick={() => smiCommand('Stop')}>Stop</button>
                        <button type="button" data-testid="blinds-rail-down" disabled={!wins.length}
                                className={btn + btnIdle + ' flex-1'} onClick={() => smiCommand('Down')}>Down</button>
                    </div>
                    <div className="flex items-center gap-1">
                        <button type="button" data-testid="blinds-rail-minus" disabled={!wins.length}
                                className={btn + btnIdle} onClick={() => { if (avgOpen != null) travelOpenPct(avgOpen - 10); }}>−</button>
                        <input type="range" min="0" max="100" step="1" disabled={!wins.length}
                               data-testid="blinds-rail-slider"
                               value={shownOpen == null ? 100 : shownOpen}
                               className="flex-1 min-w-0 accent-sky-300"
                               onPointerDown={() => setScrubOpen(avgOpen == null ? 100 : avgOpen)}
                               onChange={(e) => setScrubOpen(parseInt(e.target.value, 10) || 0)}
                               onPointerUp={() => {
                                   if (scrubOpen != null) travelOpenPct(scrubOpen);
                                   setScrubOpen(null);
                               }}
                               onPointerCancel={() => setScrubOpen(null)} />
                        <button type="button" data-testid="blinds-rail-plus" disabled={!wins.length}
                                className={btn + btnIdle} onClick={() => { if (avgOpen != null) travelOpenPct(avgOpen + 10); }}>+</button>
                        <span className={`font-mono text-[10px] w-8 text-right ${dk ? 'text-slate-400' : 'text-slate-500'}`}>
                            {shownOpen == null ? '—' : shownOpen + '%'}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className={`text-[8px] uppercase w-8 shrink-0 ${dk ? 'text-slate-500' : 'text-slate-400'}`} title="Bind ticked window to a simulated MODULE-SMI drive">SMI →</span>
                        <select data-testid="blinds-rail-smi-drive" value={curDrive} disabled={!wins.length}
                                className={`flex-1 min-w-0 text-[10px] rounded border px-1 py-0.5 ${dk ? 'bg-slate-900 border-slate-600 text-slate-200' : 'bg-white border-slate-300'}`}
                                onChange={(e) => wireDrive(e.target.value)}>
                            <option value="">
                                {!smiMod ? 'No MODULE-SMI on this floor'
                                    : (mixedDrives ? 'Mixed drives — see list' : 'Not wired')}
                            </option>
                            {smiMod && Array.from({ length: 16 }, (_, i) => (
                                <option key={i} value={smiMod.id + ':' + i}>Drive {i} (DD {String(i + 1).padStart(2, '0')})</option>
                            ))}
                        </select>
                    </div>
                    <div className={`text-[8px] leading-snug ${dk ? 'text-slate-500' : 'text-slate-400'}`}>
                        {smiMod
                            ? ('Simulated module ' + smiMod.id + ' · pp ' + (smiMod.port || 11) + ' · 16 drives'
                                + (wiredWins.length ? (' · ' + wiredWins.length + ' wired') : ''))
                            : 'No simulated MODULE-SMI on this floor. Add one in Floor Plan → SMI setup.'}
                    </div>
                    <button type="button" data-testid="blinds-rail-smi-auto" disabled={!smiMod || !wins.length}
                            className={btn + btnIdle + ' w-full'}
                            onClick={autoWire}>
                        Auto-wire this floor to SMI drives 0…n
                    </button>
                    <div className="flex items-center justify-between">
                        <label className={`flex items-center gap-1.5 text-[10px] cursor-pointer ${dk ? 'text-slate-400' : 'text-slate-600'}`}>
                            <input type="checkbox" data-testid="blinds-rail-all" disabled={!wins.length} checked={allOn}
                                   onChange={(e) => {
                                       if (e.target.checked) {
                                           setPicked(new Set(wins.map((w, i) => w.id != null ? w.id : ('idx-' + i))));
                                       } else {
                                           setPicked(new Set());
                                           if (onSelect) onSelect(null);
                                       }
                                   }} />
                            All
                        </label>
                        <label className={`flex items-center gap-1.5 text-[10px] cursor-pointer ${dk ? 'text-slate-400' : 'text-slate-600'}`}
                               title="Selected windows follow daylight: open until the room is green, close when too bright, close at night">
                            <input type="checkbox" data-testid="blinds-rail-heat-all" disabled={!wins.length}
                                   checked={targets.length > 0 && nAuto === targets.length}
                                   onChange={(e) => patchWins(targets, { heat_auto: !!e.target.checked })} />
                            Auto
                        </label>
                    </div>
                    <div data-testid="blinds-rail-list" className="max-h-[140px] overflow-y-auto space-y-0.5">
                        {wins.map((w, i) => {
                            const id = w.id != null ? w.id : ('idx-' + i);
                            const on = picked.has(id) || picked.has(w.id);
                            const label = (w.name && String(w.name).trim()) || ('W' + (i + 1));
                            const dtag = driveTag(w);
                            return (
                                <label key={id} className={`flex items-center gap-1.5 px-1 py-0.5 rounded cursor-pointer text-[10px] font-mono ${on ? (dk ? 'bg-sky-900/40 text-sky-200' : 'bg-sky-100 text-sky-800') : (dk ? 'text-slate-300' : 'text-slate-700')}`}>
                                    <input type="checkbox" checked={on} onChange={() => {
                                        const next = new Set(picked);
                                        if (next.has(id)) next.delete(id); else next.add(id);
                                        setPicked(next);
                                        if (onSelect) onSelect(next.has(id) ? id : null);
                                    }} />
                                    <span className="truncate flex-1">{label}{dtag ? (' ' + dtag) : ''}</span>
                                    <span className={dk ? 'text-slate-500' : 'text-slate-400'}>{openPctOf(w)}%</span>
                                    {dtag
                                        ? <span className="text-[8px] text-emerald-400 shrink-0">{dtag}</span>
                                        : <span className={`text-[8px] shrink-0 ${dk ? 'text-slate-600' : 'text-slate-400'}`}>—</span>}
                                    {w.heat_auto ? <span className="text-[8px] text-amber-400">A</span> : null}
                                </label>
                            );
                        })}
                    </div>
                </div>
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
window.FloorWindowsRail = FloorWindowsRail;
