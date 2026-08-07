/* ------------------------------------------------------------------
 * dashboard/floor-plan-modal.js — Floor Plan Mapper modal renderer.
 * ------------------------------------------------------------------
 *
 * Extracted from app.js in Phase L.26 (2026-06-24). The block had
 * lived as an inline IIFE inside App's render at the line that read
 * `{showFloorPlanForAhu && (() => { ... })()}` — 331 lines, with
 * heavy use of sun-path + map_config helpers.
 *
 * Follows the same function-style pattern as vav-modal.js and
 * ahu-modal.js: a single top-level function destructures a `ctx`
 * object literal that the caller (App's render) builds with the
 * closure refs the body needs.
 *
 * Body is intentionally byte-identical to the pre-extraction IIFE
 * (modulo a single block of dedent) so behaviour stays unchanged.
 * ------------------------------------------------------------------ */

/** Draggable ▤ Blinds chip — parks clear of the sun-path badge. */
function LiveBlindsButton(props) {
    const {
        theme, floorWindowsPanelOpen, setFloorWindowsPanelOpen,
        selectedFloorWindowId, setSelectedFloorWindowId, windows,
    } = props;
    const [pos, setPos] = React.useState(() => {
        try {
            const p = JSON.parse(localStorage.getItem('red5.liveWindowOpenBtnPos') || 'null');
            if (p && typeof p.x === 'number' && typeof p.y === 'number') return p;
        } catch (_) {}
        /* Default below the collapsed sun chip so they don't stack. */
        return { x: 0, y: 40 };
    });
    const [drag, setDrag] = React.useState(null);
    const movedRef = React.useRef(false);
    const posRef = React.useRef(pos);
    posRef.current = pos;

    React.useEffect(() => {
        if (!drag) return undefined;
        const onMove = (e) => {
            const dx = e.clientX - drag.startX;
            const dy = e.clientY - drag.startY;
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) movedRef.current = true;
            setPos({ x: drag.baseX + dx, y: drag.baseY + dy });
        };
        const onUp = () => {
            setDrag(null);
            try { localStorage.setItem('red5.liveWindowOpenBtnPos', JSON.stringify(posRef.current)); } catch (_) {}
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
    }, [drag]);

    const onMouseDown = (e) => {
        if (e.button !== 0) return;
        e.stopPropagation();
        e.preventDefault();
        movedRef.current = false;
        setDrag({ startX: e.clientX, startY: e.clientY, baseX: pos.x, baseY: pos.y });
    };

    const onClick = (e) => {
        e.stopPropagation();
        if (movedRef.current) return;
        if (floorWindowsPanelOpen) {
            if (setFloorWindowsPanelOpen) setFloorWindowsPanelOpen(false);
            if (setSelectedFloorWindowId) setSelectedFloorWindowId(null);
            return;
        }
        const wins = windows || [];
        if (!selectedFloorWindowId && wins.length && setSelectedFloorWindowId) {
            const w0 = wins[0];
            setSelectedFloorWindowId(w0.id != null ? w0.id : 'idx-0');
        }
        if (setFloorWindowsPanelOpen) setFloorWindowsPanelOpen(true);
    };

    return (
        <button
            type="button"
            data-testid="live-windows-blinds-btn"
            className={`absolute z-40 px-2.5 py-1.5 rounded border text-[10px] font-black uppercase tracking-wider pointer-events-auto transition-colors ${
                floorWindowsPanelOpen
                    ? 'bg-amber-600 border-amber-400 text-slate-900'
                    : (theme === 'dark' ? 'bg-slate-900/90 border-sky-500/50 text-sky-300 hover:bg-slate-800' : 'bg-white/90 border-sky-400 text-sky-700 hover:bg-sky-50')
            }`}
            style={{
                top: 16, right: 16,
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                cursor: drag ? 'grabbing' : 'grab',
                userSelect: 'none',
                touchAction: 'none',
            }}
            onMouseDown={onMouseDown}
            onClick={onClick}
            title="Drag to move · click to set blinds (closed ↔ open)"
        >
            ▤ Blinds
        </button>
    );
}

/** Draggable per-window blind 0–100% pill (Closed ↔ Open). */
function LiveBlindControlPill(props) {
    const {
        theme, wi, wid, w, floorKey, openPct,
        setFloorWindowOpenPct, setFloorWindowsPanelOpen, setSelectedFloorWindowId,
    } = props;
    const placeAbove = (Number(w.y) || 50) > 22;
    const storageKey = 'red5.liveBlindPillPos.' + String(wid);
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

    const baseTx = placeAbove ? '-50%' : '-50%';
    const baseTy = placeAbove ? 'calc(-100% - 16px)' : '16px';

    return (
        <div
            data-testid="live-window-individual-control"
            className={`absolute z-[55] w-[220px] rounded-md border shadow-2xl pointer-events-auto ${
                theme === 'dark' ? 'bg-slate-950/95 border-amber-500/70 text-slate-200' : 'bg-white/95 border-amber-400 text-slate-800'
            }`}
            style={{
                left: `${w.x}%`,
                top: `${w.y}%`,
                transform: `translate(${baseTx}, ${baseTy}) translate(${pos.x}px, ${pos.y}px)`,
                cursor: drag ? 'grabbing' : 'grab',
                userSelect: 'none',
                touchAction: 'none',
            }}
            onMouseDown={(e) => {
                if (e.button !== 0) return;
                const t = e.target;
                if (t && t.closest && (t.closest('button') || t.closest('input'))) return;
                e.stopPropagation();
                e.preventDefault();
                setDrag({ startX: e.clientX, startY: e.clientY, baseX: pos.x, baseY: pos.y });
            }}
            title="Drag to move · this window’s blind only"
        >
            <div className={`flex items-center justify-between px-2 py-1.5 border-b text-[9px] uppercase tracking-widest ${
                theme === 'dark' ? 'border-slate-700 text-amber-300' : 'border-slate-200 text-amber-700'
            }`}>
                <span>W{wi + 1} · Blind</span>
                <button type="button" className="text-sm px-1 opacity-60 hover:opacity-100 cursor-pointer"
                        onClick={() => {
                            if (setFloorWindowsPanelOpen) setFloorWindowsPanelOpen(false);
                            if (setSelectedFloorWindowId) setSelectedFloorWindowId(null);
                        }}>×</button>
            </div>
            <div className="px-2 py-2">
                <div className="flex items-center gap-1.5">
                    <span className="text-[8px] opacity-60 w-10 shrink-0">Closed</span>
                    <input type="range" min="0" max="100" step="1" value={openPct}
                           className="flex-1 min-w-0 accent-amber-400 cursor-pointer"
                           data-testid={`live-window-open-${wid}`}
                           onChange={(e) => {
                               const v = parseInt(e.target.value, 10) || 0;
                               if (setFloorWindowOpenPct) setFloorWindowOpenPct(floorKey, w.id, v, wi);
                           }}/>
                    <span className="text-[8px] opacity-60 w-8 shrink-0 text-right">Open</span>
                    <span className="font-mono text-[10px] text-amber-400 w-9 text-right">{openPct}%</span>
                </div>
                <div className="text-[8px] opacity-50 mt-1">This window only · 0% closed · 100% open</div>
            </div>
        </div>
    );
}

/** Amber VAV/AHU ring: sun exposure × blind open of windows lighting this marker. */
function liveSunRingStyle(xPct, yPct, sunState, windows, buildingFacingOffset) {
    if (!(sunState && sunState.enabled && sunState.sun)) return { score: 0, style: null, color: null };
    const opts = { northOffsetDeg: typeof buildingFacingOffset === 'number' ? buildingFacingOffset : 0 };
    const wins = windows || [];
    let score = 0;
    if (window.red5SunBlindScore) {
        score = window.red5SunBlindScore(Number(xPct), Number(yPct), sunState.sun, wins, opts);
    } else if (window.red5SunExposureScore) {
        score = window.red5SunExposureScore(Number(xPct) / 100, Number(yPct) / 100, sunState.sun, opts);
    }
    const style = window.red5ExposureRingStyle ? window.red5ExposureRingStyle(score) : null;
    const color = window.red5ExposureColor ? window.red5ExposureColor(score) : null;
    return { score: score || 0, style: style || null, color: color || null };
}

function renderFloorPlanModal(ctx) {
    const {
        // State + setters
        showFloorPlanForAhu, setShowFloorPlanForAhu,
        floorPlanPopupWin, floorPlanPopupHost,
        floorPlanOffset, floorPlanModalSize,
        setIsFloorPlanDragging, setDragStart,
        floorOuterRef,
        selectedAhuId, setSelectedAhuId,
        lockedVavId, setLockedVavId,
        setShowAhuModalFor,
        setSelectedVavForModal, setVavCfm, setIsLockedToSA,
        // Data
        ahuData, mapConfig, setMapConfig, floorImage,
        buildingLatLon, sunState, setSunState,
        buildingFacingOffset,
        floorWindowsPanelOpen, setFloorWindowsPanelOpen,
        selectedFloorWindowId, setSelectedFloorWindowId,
        setFloorWindowOpenPct,
        comfortZonePoly,
        showGivoni, showSweetSpot, sweetSpotRange,
        // Helpers + look-up tables
        theme, safe, getFloorForAhu, getVavDiagnostic, popOutFloorPlanModal, floatPipFloorPlanModal,
    } = ctx;

    if (!showFloorPlanForAhu) return null;

const floorIsPopped = !!(floorPlanPopupWin && floorPlanPopupHost);
const floorIsPip = !!(floorIsPopped && floorPlanPopupWin.__red5IsPip);
const floorPipOk = typeof red5PipSupported === 'function' && red5PipSupported();
const floorOuterStyle = floorIsPopped
    ? { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }
    : { top: `${safe(floorPlanOffset.y)}px`, left: `${safe(floorPlanOffset.x)}px` };
const floorOuterCls = floorIsPopped
    ? 'block select-none'
    : 'absolute z-[110] select-none shadow-2xl drop-shadow-2xl';
const floorInnerStyle = floorIsPopped
    ? { width: '100vw', height: '100vh', maxWidth: 'none', maxHeight: 'none' }
    : { width: `${floorPlanModalSize.w}px`, height: `${floorPlanModalSize.h}px`, maxWidth: '95vw', maxHeight: '95vh', resize: 'both' };

const floorModalTree = (
<div className={floorOuterCls} style={floorOuterStyle}>
    <div ref={floorOuterRef} className={`${theme === 'dark' ? 'bg-slate-900 border-indigo-500/50 text-slate-100' : 'bg-white border-slate-300 text-slate-800'} ${floorIsPopped ? '' : 'rounded-2xl border'} shadow-2xl relative flex flex-col overflow-hidden`} style={floorInnerStyle} onMouseDown={e => e.stopPropagation()}>
        
        <div className={`cursor-grab active:cursor-grabbing ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'} border-b p-4 flex justify-between items-center z-[60] relative`} onMouseDown={(e) => { if (floorIsPopped) return; setIsFloorPlanDragging(true); setDragStart({ x: e.clientX - floorPlanOffset.x, y: e.clientY - floorPlanOffset.y }); }}>
            <h3 className={`text-lg font-black tracking-widest ml-2 uppercase ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>FLOOR PLAN - {showFloorPlanForAhu} ZONE {!floorIsPopped && <span style={{color:'#64748b', fontSize:'10px', marginLeft:'8px', fontWeight:'normal', textTransform:'none', letterSpacing:'normal'}}>Drag corner ↘ to resize</span>}{floorIsPopped && <span style={{color:'#64748b', fontSize:'10px', marginLeft:'8px', fontWeight:'normal', textTransform:'none', letterSpacing:'normal'}}>{floorIsPip ? 'Drag the float box across monitors' : 'Resize the popped-out window directly'}</span>}</h3>
            <div className="flex items-center gap-2 mr-2" onMouseDown={e => e.stopPropagation()}>
                <button
                    data-testid="popout-floorplan-modal-btn"
                    onClick={() => {
                        if (floorPlanPopupWin && !floorPlanPopupWin.closed && !floorPlanPopupWin.__red5IsPip) {
                            floorPlanPopupWin.close();
                        } else {
                            popOutFloorPlanModal();
                        }
                    }}
                    title={floorIsPopped && !floorIsPip ? 'Re-attach floor plan to this window' : 'Pop out into a browser window'}
                    className={`px-2 py-0.5 border rounded text-[8px] font-black uppercase tracking-wider transition-all ${floorIsPopped && !floorIsPip ? 'bg-emerald-700 border-emerald-400 text-slate-100 hover:bg-emerald-600' : (theme === 'dark' ? 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-cyan-500 hover:text-cyan-300' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-cyan-500 hover:text-cyan-600')}`}
                >
                    {floorIsPopped && !floorIsPip ? '\u21A9 ATTACH' : '\u2197 POP OUT'}
                </button>
                {floorPipOk && (
                <button
                    data-testid="pip-floorplan-modal-btn"
                    onClick={() => {
                        if (floorPlanPopupWin && !floorPlanPopupWin.closed && floorPlanPopupWin.__red5IsPip) {
                            floorPlanPopupWin.close();
                        } else if (typeof floatPipFloorPlanModal === 'function') {
                            floatPipFloorPlanModal();
                        }
                    }}
                    title={floorIsPip ? 'Re-attach float box to this window' : 'Float as a minimal always-on-top box (Chrome/Edge PiP)'}
                    className={`px-2 py-0.5 border rounded text-[8px] font-black uppercase tracking-wider transition-all ${floorIsPip ? 'bg-violet-700 border-violet-400 text-slate-100 hover:bg-violet-600' : (theme === 'dark' ? 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-violet-500 hover:text-violet-300' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-violet-500 hover:text-violet-600')}`}
                >
                    {floorIsPip ? '\u21A9 ATTACH' : '\u25A3 FLOAT'}
                </button>
                )}
                <button className={`${theme === 'dark' ? 'text-slate-400 hover:text-slate-100' : 'text-slate-500 hover:text-slate-800'} transition-colors cursor-pointer`} onClick={() => setShowFloorPlanForAhu(null)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
        </div>
        
        <div className={`red5-graphic-zone relative bg-slate-200 overflow-hidden flex items-center justify-center`}>
            
            {(() => {
                const floorData = getFloorForAhu(showFloorPlanForAhu);
                const API_URL = window.API_BASE_URL || window.location.origin;
                const activeAhu = ahuData.find(a => a.id === showFloorPlanForAhu);
                
                if (floorData && floorData.floor.image_path) {
                    // === MAP_CONFIG DRIVEN FLOOR PLAN ===
                    const imgSrc = `${API_URL}/api/assets/${floorData.floor.image_path}`;
                    return (
                        <div className="relative inline-block">
                            <img 
                                src={imgSrc} 
                                className="block pointer-events-none opacity-60 transition-all duration-500" 
                                style={{ maxWidth: 'calc(min(1400px, 95vw) - 20px)', maxHeight: 'calc(min(850px, 90vh) - 90px)', mixBlendMode: 'multiply' }}
                                alt={floorData.floor.name}
                            />
                            {/* Sun-Path Phase A: compass + directional ray overlay.
                                Compass lives in the top-right corner of the floor plan
                                image.  Ray overlay washes a warm gradient across the
                                plan from the sun's incoming direction.  Both only
                                visible when the Sun-Path toggle is ON. */}
                            {window.SunCompass && (
                                <window.SunCompass
                                    lat={buildingLatLon.lat}
                                    lon={buildingLatLon.lon}
                                    theme={theme}
                                    onChange={(s) => setSunState(s)}
                                />
                            )}
                            {sunState && sunState.enabled && sunState.sun && window.SunRayOverlay && (
                                <window.SunRayOverlay sun={sunState.sun} theme={theme} cloudCover={sunState.cloudCover} ghiWm2={sunState.ghiWm2}
                                    northOffsetDeg={typeof buildingFacingOffset === 'number' ? buildingFacingOffset : 0} />
                            )}
                            {sunState && sunState.enabled && sunState.sun && window.WindowsSunshaftOverlay && floorData.floor.windows && floorData.floor.windows.length > 0 && (
                                <window.WindowsSunshaftOverlay
                                    windows={floorData.floor.windows}
                                    sun={sunState.sun}
                                    theme={theme}
                                    cloudCover={sunState.cloudCover}
                                    northOffsetDeg={typeof buildingFacingOffset === 'number' ? buildingFacingOffset : 0}
                                    showBars={false}
                                />
                            )}
                            {/* Live window bars — click to set blinds; no amber halo on the glass */}
                            {(floorData.floor.windows || []).map((w, wi) => {
                                const wid = w.id != null ? w.id : ('idx-' + wi);
                                const sel = selectedFloorWindowId === wid || selectedFloorWindowId === w.id;
                                const open = 1 - Math.min(1, Math.max(0, Number(w.blind_level) || 0));
                                const len = Math.max(Number(w.length) || 8, 3);
                                return (
                                    <div
                                        key={wid}
                                        data-testid={`live-window-${wid}`}
                                        title={`W${wi + 1} · blind ${Math.round(open * 100)}% open — click to set`}
                                        onMouseDown={(e) => {
                                            e.stopPropagation();
                                            if (setSelectedFloorWindowId) setSelectedFloorWindowId(wid);
                                            if (setFloorWindowsPanelOpen) setFloorWindowsPanelOpen(true);
                                        }}
                                        style={{
                                            position: 'absolute',
                                            left: `${w.x}%`,
                                            top: `${w.y}%`,
                                            width: `${len}%`,
                                            height: '10px',
                                            transform: `translate(-50%, -50%) rotate(${Number(w.angle_deg) || 0}deg)`,
                                            cursor: 'pointer',
                                            zIndex: sel ? 45 : 35,
                                            pointerEvents: 'auto',
                                        }}
                                    >
                                        <div style={{
                                            position: 'absolute', left: 0, right: 0, top: '2px', bottom: '2px',
                                            borderRadius: 2,
                                            background: sel ? '#38bdf8' : '#7dd3fc',
                                            opacity: 0.45 + 0.40 * open,
                                            boxShadow: '0 0 4px rgba(125,211,252,0.35)',
                                            border: sel ? '1px solid #e0f2fe' : '1px solid rgba(186,230,253,0.45)',
                                        }} />
                                    </div>
                                );
                            })}
                            {/* Individual blind control — draggable Closed ↔ Open pill */}
                            {floorWindowsPanelOpen && (() => {
                                const wins = floorData.floor.windows || [];
                                let wi = wins.findIndex((w, i) => {
                                    const wid = w.id != null ? w.id : ('idx-' + i);
                                    return selectedFloorWindowId === wid || selectedFloorWindowId === w.id;
                                });
                                if (wi < 0 && wins.length) wi = 0;
                                const w = wi >= 0 ? wins[wi] : null;
                                if (!w) return null;
                                const wid = w.id != null ? w.id : ('idx-' + wi);
                                const floorKey = floorData.floor.id || floorData.floor.name || 'floor';
                                const openPct = Math.round((1 - Math.min(1, Math.max(0, Number(w.blind_level) || 0))) * 100);
                                return (
                                    <LiveBlindControlPill
                                        key={'live-blind-pill-' + wid}
                                        theme={theme}
                                        wi={wi}
                                        wid={wid}
                                        w={w}
                                        floorKey={floorKey}
                                        openPct={openPct}
                                        setFloorWindowOpenPct={setFloorWindowOpenPct}
                                        setFloorWindowsPanelOpen={setFloorWindowsPanelOpen}
                                        setSelectedFloorWindowId={setSelectedFloorWindowId}
                                    />
                                );
                            })()}
                            {/* INLINE zIndex (not Tailwind): must sit ABOVE SunRayOverlay
                                (zIndex:5) and BuildingShadow (zIndex:6).  Map_config path
                                previously wrapped markers in a z-auto layer under the ray,
                                so amber rings computed but were painted under the wash. */}
                            <div className="absolute inset-0 pointer-events-none" style={{zIndex: 40}}>
                            <div className={`absolute top-4 left-4 z-10 text-sm font-mono px-3 py-1.5 rounded pointer-events-auto ${theme === 'dark' ? 'text-emerald-400 bg-slate-900/80' : 'text-emerald-700 bg-white/80'}`}>
                                {floorData.floor.name} - {floorData.floor.image_path}
                            </div>
                            {(floorData.floor.windows || []).length > 0 && (
                                <LiveBlindsButton
                                    theme={theme}
                                    floorWindowsPanelOpen={floorWindowsPanelOpen}
                                    setFloorWindowsPanelOpen={setFloorWindowsPanelOpen}
                                    selectedFloorWindowId={selectedFloorWindowId}
                                    setSelectedFloorWindowId={setSelectedFloorWindowId}
                                    windows={floorData.floor.windows || []}
                                />
                            )}
                            {/* Render ALL AHU markers from map_config */}
                            {floorData.allMarkers.filter(m => m.type === 'ahu').map(marker => {
                                const isActive = marker.name === showFloorPlanForAhu || marker.id === showFloorPlanForAhu;
                                // Sun-Path Phase A: compute exposure halo + directional
                                // shadow for this marker when the overlay is active.
                                let sunRing = null, sunRingStyle = null, sunShadow = null;
                                if (sunState && sunState.enabled && sunState.sun) {
                                    const ring = liveSunRingStyle(marker.x, marker.y, sunState, floorData.floor.windows, buildingFacingOffset);
                                    sunRing = ring.color;
                                    sunRingStyle = ring.style;
                                    if (window.red5MarkerShadow) sunShadow = window.red5MarkerShadow(sunState.sun);
                                }
                                return (
                                    <div key={marker.id} className="absolute flex flex-col items-center z-30 group pointer-events-auto" style={{ left: `${marker.x}%`, top: `${marker.y}%`, transform: 'translate(-50%, -50%)' }}>
                                        {sunShadow && (
                                            <div style={{
                                                position:'absolute', left:'50%', top:'28px',
                                                width: sunShadow.length_px, height: 7,
                                                transform: 'translate(0, -50%) rotate(' + (sunShadow.angle_deg - 90) + 'deg)',
                                                transformOrigin: '0 50%',
                                                background: 'linear-gradient(90deg, rgba(15,23,42,' + sunShadow.opacity + '), rgba(15,23,42,0))',
                                                borderRadius: 999, pointerEvents:'none', zIndex:-1
                                            }}/>
                                        )}
                                        <div 
                                            className={`w-14 h-14 rounded-lg border-2 cursor-pointer group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg ${isActive ? 'bg-orange-500 border-white shadow-[0_0_25px_rgba(249,115,22,0.9)] scale-110' : (theme === 'dark' ? 'bg-slate-800 border-slate-500 shadow-black' : 'bg-white border-slate-400')} opacity-80 group-hover:opacity-100`}
                                            style={(sunRingStyle && !isActive) ? sunRingStyle : {}}
                                            title={marker.name + (sunRing ? ' · sun-exposed' : '')}
                                            onMouseDown={(e) => { e.stopPropagation(); setSelectedAhuId(marker.name); setShowFloorPlanForAhu(marker.name); setLockedVavId(null); }}
                                        >
                                            <span className={`text-xs font-black ${isActive ? 'text-slate-100' : (theme === 'dark' ? 'text-slate-400' : 'text-slate-600')}`}>{(marker.name || '').split('-')[1] || 'AHU'}</span>
                                        </div>
                                        <div className={`mt-3 border px-3 py-1.5 rounded-lg text-xs min-w-[80px] text-center shadow-2xl font-mono cursor-pointer transition-colors flex flex-col items-center ${theme === 'dark' ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-slate-300'} ${isActive ? '!border-orange-500' : 'group-hover:border-orange-400'}`}
                                            title={isActive ? 'Click to view diagram' : 'Click to select'}
                                            onMouseDown={(e) => {
                                                e.stopPropagation();
                                                if (isActive) {
                                                    // Clicking the active AHU box opens its diagram modal directly.
                                                    setShowAhuModalFor(marker.name);
                                                } else {
                                                    // Otherwise, focus this AHU on the floor plan.
                                                    setSelectedAhuId(marker.name);
                                                    setShowFloorPlanForAhu(marker.name);
                                                    setLockedVavId(null);
                                                }
                                            }}
                                        >
                                            <div className={`${isActive ? 'text-orange-500' : (theme === 'dark' ? 'text-slate-400' : 'text-slate-700')} font-black`}>{marker.name}</div>
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {/* Render VAV markers from map_config with live telemetry */}
                            {floorData.vavMarkers.map(marker => {
                                const liveVav = activeAhu && activeAhu.vavs ? activeAhu.vavs.find(v => v.id === marker.name) : null;
                                const isLocked = lockedVavId === marker.name;
                                // Use the SAME Givoni-tier resolver as the VAV list
                                // (psy-chart-svg.js line ~111).  Single source of
                                // truth for dot colour so the floor-plan pin and
                                // the VAV table row bullet always agree:
                                //   A → green (in CZ & sweet-spot)
                                //   B → teal (in CZ, outside sweet-spot)
                                //   C+H/D → red/orange (warm, outside CZ)
                                //   C-W/D → blue (cool, outside CZ)
                                // Previously this used `getVavDiagnostic` (a
                                // 4-state optimal/comfort/warning/alarm classifier)
                                // which diverged from the list after the VAV
                                // table migrated to Givoni tiers in Phase L.35.
                                const _gvSweet = (showGivoni && showSweetSpot) ? sweetSpotRange : null;
                                const gv = liveVav ? getGivoniTier(liveVav.t, liveVav.w, liveVav.rh, comfortZonePoly, _gvSweet, showGivoni) : null;
                                const saP = activeAhu && activeAhu.points ? activeAhu.points[1] : null;
                                const diag = liveVav ? getVavDiagnostic(liveVav, saP, comfortZonePoly) : null;
                                const dotStyle = gv
                                    ? { backgroundColor: gv.dotFill, boxShadow: '0 0 12px ' + gv.dotFill + 'cc' }
                                    : null;
                                const dotColor = !liveVav ? 'bg-slate-500' : '';

                                // Sun-Path → B1-B10 band trim (P0 hook).  Compute once per VAV
                                // so both the ring tooltip path and the plain-marker path can
                                // surface the per-VAV trimmed SA target.
                                // Coerce x/y — map_config occasionally stores numeric strings;
                                // NaN scores produced invisible rgba(NaN,…) “rings”.
                                const mx = Number(marker.x), my = Number(marker.y);
                                let vavSunScore = null, vavBandTrim = null, sunRing = null, sunRingStyle = null;
                                if (sunState && sunState.enabled && sunState.sun
                                    && Number.isFinite(mx) && Number.isFinite(my)) {
                                    const ring = liveSunRingStyle(mx, my, sunState, floorData.floor.windows, buildingFacingOffset);
                                    vavSunScore = ring.score;
                                    sunRing = ring.color;
                                    sunRingStyle = ring.style;
                                    if (activeAhu && activeAhu.active_band && window.red5BandSunTrim) {
                                        vavBandTrim = window.red5BandSunTrim(activeAhu.active_band, vavSunScore);
                                    }
                                }
                                const trimSuffix = vavBandTrim && vavBandTrim.sun_trim_c !== 0
                                    ? ` · ${vavBandTrim.id} SA→${vavBandTrim.sa_t_sp}°C (${vavBandTrim.sun_trim_c > 0 ? '+' : ''}${vavBandTrim.sun_trim_c.toFixed(2)} sun)`
                                    : '';

                                return (
                                    <div key={marker.id} className="absolute flex flex-col items-center z-20 group pointer-events-auto" style={{ left: `${mx}%`, top: `${my}%`, transform: 'translate(-50%, -50%)' }}>
                                        {(() => {
                                            // Sun-Path Phase A: directional shadow for this
                                            // VAV marker pointing away from the sun.
                                            if (!(sunState && sunState.enabled && sunState.sun && window.red5MarkerShadow)) return null;
                                            const sh = window.red5MarkerShadow(sunState.sun);
                                            if (!sh) return null;
                                            return (
                                                <div style={{
                                                    position:'absolute', left:'50%', top:'12px',
                                                    width: sh.length_px, height: 5,
                                                    transform: 'translate(0, -50%) rotate(' + (sh.angle_deg - 90) + 'deg)',
                                                    transformOrigin: '0 50%',
                                                    background: 'linear-gradient(90deg, rgba(15,23,42,' + sh.opacity + '), rgba(15,23,42,0))',
                                                    borderRadius: 999, pointerEvents:'none', zIndex:-1
                                                }}/>
                                            );
                                        })()}
                                        <div
                                            className={`w-6 h-6 rounded-full border-[3px] cursor-pointer group-hover:scale-125 transition-all duration-300 ${dotColor} ${isLocked ? 'border-cyan-400 scale-125 ring-4 ring-cyan-400/60' : (sunRing ? '' : 'border-white')}`}
                                            style={Object.assign({}, dotStyle || {}, (sunRingStyle && !isLocked) ? sunRingStyle : {})}
                                            title={(liveVav ? `${marker.name}: ${liveVav.t.toFixed(1)}C ${liveVav.rh.toFixed(0)}%RH${gv ? ' — Tier ' + gv.tier + ' (' + gv.label + ')' : ''}` : marker.name) + (sunRing ? ' · sun / blind' : '') + trimSuffix}
                                            onMouseDown={(e) => { e.stopPropagation(); if (liveVav) { setSelectedVavForModal(liveVav); setVavCfm(Math.floor(Math.random() * 300 + 400)); setLockedVavId(liveVav.id); setIsLockedToSA(false); } }}
                                        ></div>
                                        <div className={`mt-2 border px-2.5 py-1.5 rounded text-[10px] min-w-[90px] text-center shadow-lg font-mono cursor-pointer transition-colors ${theme === 'dark' ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-slate-300'} ${isLocked ? '!border-cyan-400' : 'group-hover:border-indigo-400'}`}
                                            onMouseDown={(e) => { e.stopPropagation(); if (liveVav) { setSelectedVavForModal(liveVav); setVavCfm(Math.floor(Math.random() * 300 + 400)); setLockedVavId(liveVav.id); setIsLockedToSA(false); } }}
                                        >
                                            <div className={`${isLocked ? 'text-cyan-400' : 'text-sky-500'} font-black mb-0.5`}>{marker.name}</div>
                                            {liveVav && <div className={`flex justify-center gap-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}><span>{liveVav.t.toFixed(1)}&deg;C</span><span className="text-slate-500">·</span><span>{liveVav.rh.toFixed(0)}%</span></div>}
                                            {!liveVav && <div className="text-slate-500">--</div>}
                                            {vavBandTrim && vavBandTrim.sun_trim_c !== 0 && (
                                                <div className={`mt-0.5 text-[8px] tracking-wider ${vavBandTrim.sun_trim_c < 0 ? (theme==='dark' ? 'text-amber-400' : 'text-amber-600') : (theme==='dark' ? 'text-sky-400' : 'text-sky-600')}`}
                                                    title={`Sun-exposure ${(vavBandTrim.sun_score*100).toFixed(0)}% → ${vavBandTrim.id} SA ${vavBandTrim.base_sa_t}°C ${vavBandTrim.sun_trim_c > 0 ? '+' : ''}${vavBandTrim.sun_trim_c.toFixed(2)}°C`}>
                                                    ΔSA {vavBandTrim.sun_trim_c > 0 ? '+' : ''}{vavBandTrim.sun_trim_c.toFixed(2)}°C
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            </div>
                        </div>
                    );
                } else {
                    // === FALLBACK: no map_config or no floor found ===
                    // Wrap in a fixed-ratio box so absolute-positioned markers +
                    // the sun compass have a non-zero canvas to sit on.
                    return (
                        <div className="red5-graphic-zone relative" style={{width: '80vw', maxWidth: 1200, height: '70vh', maxHeight: 700}}>
                            <React.Fragment>
                            {floorImage ? (
                                <img src={floorImage} className="absolute inset-0 w-full h-full object-contain z-0 opacity-40 transition-all duration-500" style={{ mixBlendMode: 'multiply' }} alt="Floor Plan" />
                            ) : (
                                <div className="absolute inset-0 blueprint-grid opacity-30 pointer-events-none z-0"></div>
                            )}
                            {/* Sun-Path Phase A: compass + ray overlay in the fallback
                                layout.  Lets users exercise sun-path even without a
                                real map_config.json uploaded. */}
                            {window.SunCompass && (
                                <window.SunCompass
                                    lat={buildingLatLon.lat}
                                    lon={buildingLatLon.lon}
                                    theme={theme}
                                    onChange={(s) => setSunState(s)}
                                />
                            )}
                            {sunState && sunState.enabled && sunState.sun && window.SunRayOverlay && (
                                <window.SunRayOverlay sun={sunState.sun} theme={theme} cloudCover={sunState.cloudCover} ghiWm2={sunState.ghiWm2} />
                            )}
                            <div className={`absolute top-4 left-4 z-10 flex items-center gap-2 text-sm font-mono px-3 py-1.5 rounded ${theme === 'dark' ? 'text-amber-400 bg-slate-900/80' : 'text-amber-700 bg-white/80'}`}>
                                <span>No map_config.json — using fallback layout</span>
                                {/* Snapshot helper (Phase L.43, 2026-06-27) —
                                    converts the hard-coded fallback positions
                                    of this view into a starter map_config.json
                                    so operators don't have to hand-author JSON
                                    when rolling the floor view out to a new
                                    building.  Anonymous callers get a warning
                                    toast; signed-in users get the layout
                                    persisted + the modal reloads against the
                                    new real config. */}
                                <button
                                    data-testid="floor-snapshot-btn"
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        const ahuPos = [{x:25,y:25},{x:75,y:25},{x:25,y:75},{x:75,y:75}];
                                        const vavPos = [{x:50,y:50},{x:40,y:30},{x:60,y:30},{x:40,y:70},{x:60,y:70},{x:12,y:50},{x:88,y:50},{x:50,y:15},{x:50,y:85},{x:25,y:50},{x:75,y:50},{x:35,y:50},{x:65,y:50},{x:50,y:33},{x:50,y:67},{x:35,y:15},{x:65,y:15},{x:35,y:85},{x:65,y:85}];
                                        const markers = [];
                                        ahuData.slice(0,4).forEach((a, i) => {
                                            const p = ahuPos[i];
                                            markers.push({ type:'ahu', id:a.id, name:a.id, x:p.x, y:p.y });
                                            (a.vavs || []).forEach((v, j) => {
                                                const q = vavPos[j % vavPos.length];
                                                markers.push({ type:'vav', id:v.id, name:v.id, ahu_id:a.id, x:q.x, y:q.y });
                                            });
                                        });
                                        const newCfg = {
                                            version: '1.0',
                                            floors: [{
                                                id: 'floor1',
                                                name: 'Floor 1',
                                                markers,
                                            }],
                                        };
                                        try {
                                            const API_URL = window.API_BASE_URL || window.location.origin;
                                            const r = await fetch(`${API_URL}/api/save-config`, {
                                                method: 'POST',
                                                headers: {'Content-Type':'application/json'},
                                                credentials: 'include',
                                                body: JSON.stringify({ map_config: newCfg, image_manifest: {} }),
                                            });
                                            const j = await r.json();
                                            if (j && j.success && setMapConfig) {
                                                setMapConfig(newCfg);
                                                if (window.toast) window.toast(`Saved ${markers.length} markers across ${newCfg.floors.length} floor — you can drag them in the Equipment Mapper.`, 'success');
                                            } else {
                                                if (window.toast) window.toast(j.error || 'Sign in to save the floor plan to the controller.', 'info');
                                            }
                                        } catch (err) {
                                            if (window.toast) window.toast('Save failed: ' + (err && err.message || err), 'error');
                                        }
                                    }}
                                    className={`px-2 py-0.5 rounded border text-[10px] font-black uppercase tracking-wider transition-all ${theme==='dark' ? 'bg-amber-500/10 border-amber-500/40 text-amber-200 hover:bg-amber-500/20' : 'bg-amber-100 border-amber-400 text-amber-700 hover:bg-amber-200'}`}
                                    title="Save the current fallback marker positions as a starter map_config.json on the controller — you can fine-tune them in the Equipment Mapper afterwards.">
                                    Use This View ↑
                                </button>
                            </div>
                            
                            {/* Fallback: hardcoded 4-corner AHU layout */}
                            {(() => {
                                const floorAhus = ahuData.slice(0, 4);
                                const ahuPositions = [{ left: 25, top: 25 }, { left: 75, top: 25 }, { left: 25, top: 75 }, { left: 75, top: 75 }];
                                return floorAhus.map((ahu, i) => {
                                    const pos = ahuPositions[i]; const isActiveAhu = showFloorPlanForAhu === ahu.id;
                                    // Sun-Path Phase A: halo + shadow for fallback AHU markers
                                    let sunRing = null, sunRingStyle = null, sunShadow = null;
                                    if (sunState && sunState.enabled && sunState.sun) {
                                        const ring = liveSunRingStyle(pos.left, pos.top, sunState, [], buildingFacingOffset);
                                        sunRing = ring.color;
                                        sunRingStyle = ring.style;
                                        if (window.red5MarkerShadow) sunShadow = window.red5MarkerShadow(sunState.sun);
                                    }
                                    return (
                                        <div key={ahu.id} className="absolute flex flex-col items-center z-30 group" style={{ left: `${pos.left}%`, top: `${pos.top}%`, transform: 'translate(-50%, -50%)' }}>
                                            {sunShadow && (
                                                <div style={{
                                                    position:'absolute', left:'50%', top:'28px',
                                                    width: sunShadow.length_px, height: 7,
                                                    transform: 'translate(0, -50%) rotate(' + (sunShadow.angle_deg - 90) + 'deg)',
                                                    transformOrigin: '0 50%',
                                                    background: 'linear-gradient(90deg, rgba(15,23,42,' + sunShadow.opacity + '), rgba(15,23,42,0))',
                                                    borderRadius: 999, pointerEvents:'none', zIndex:-1
                                                }}/>
                                            )}
                                            <div className={`w-14 h-14 rounded-lg border-2 cursor-pointer group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg ${isActiveAhu ? 'bg-orange-500 border-white scale-110' : (theme === 'dark' ? 'bg-slate-800 border-slate-500' : 'bg-white border-slate-400')} opacity-80 group-hover:opacity-100`}
                                                style={(sunRingStyle && !isActiveAhu) ? sunRingStyle : {}}
                                                title={ahu.id + (sunRing ? ' · sun-exposed' : '')}
                                                onMouseDown={(e) => { e.stopPropagation(); setSelectedAhuId(ahu.id); setShowFloorPlanForAhu(ahu.id); setLockedVavId(null); }}
                                            >
                                                <span className={`text-xs font-black ${isActiveAhu ? 'text-slate-100' : (theme === 'dark' ? 'text-slate-400' : 'text-slate-600')}`}>{ahu.id.split('-')[1] || 'AHU'}</span>
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                            
                            {/* Fallback: scatter VAVs */}
                            {(() => {
                                if (!activeAhu || !activeAhu.vavs) return null;
                                const safePos = [{left:50,top:50},{left:40,top:30},{left:60,top:30},{left:40,top:70},{left:60,top:70},{left:12,top:50},{left:88,top:50},{left:50,top:15},{left:50,top:85},{left:25,top:50},{left:75,top:50},{left:35,top:50},{left:65,top:50},{left:50,top:33},{left:50,top:67},{left:35,top:15},{left:65,top:15},{left:35,top:85},{left:65,top:85}];
                                return activeAhu.vavs.map((v, i) => {
                                    const gp = safePos[i % safePos.length]; const isLocked = lockedVavId === v.id;
                                    // Sun-Path Phase A: halo + directional shadow for
                                    // fallback-layout VAV dots.
                                    let sunRing = null, sunRingStyle = null, sunShadow = null;
                                    if (sunState && sunState.enabled && sunState.sun) {
                                        const ring = liveSunRingStyle(gp.left, gp.top, sunState, [], buildingFacingOffset);
                                        sunRing = ring.color;
                                        sunRingStyle = ring.style;
                                        if (window.red5MarkerShadow) sunShadow = window.red5MarkerShadow(sunState.sun);
                                    }
                                    return (
                                        <div key={v.id} className="absolute flex flex-col items-center z-20 group" style={{ left: `${gp.left}%`, top: `${gp.top}%`, transform: 'translate(-50%, -50%)' }}>
                                            {sunShadow && (
                                                <div style={{
                                                    position:'absolute', left:'50%', top:'12px',
                                                    width: sunShadow.length_px, height: 5,
                                                    transform: 'translate(0, -50%) rotate(' + (sunShadow.angle_deg - 90) + 'deg)',
                                                    transformOrigin: '0 50%',
                                                    background: 'linear-gradient(90deg, rgba(15,23,42,' + sunShadow.opacity + '), rgba(15,23,42,0))',
                                                    borderRadius: 999, pointerEvents:'none', zIndex:-1
                                                }}/>
                                            )}
                                            <div className={`w-6 h-6 rounded-full border-[3px] cursor-pointer group-hover:scale-125 transition-all duration-300 ${isLocked ? 'bg-rose-500 scale-125' : 'bg-emerald-500'} ${sunRing ? '' : 'border-white'}`}
                                                style={sunRingStyle || {}}
                                                title={v.id + (sunRing ? ' · sun / blind' : '')}
                                                onMouseDown={(e) => { e.stopPropagation(); setSelectedVavForModal(v); setVavCfm(Math.floor(Math.random() * 300 + 400)); setLockedVavId(v.id); setIsLockedToSA(false); }}
                                            ></div>
                                            <div className={`mt-2 border px-2.5 py-1.5 rounded text-[10px] min-w-[90px] text-center shadow-lg font-mono ${theme === 'dark' ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-slate-300'}`}
                                                onMouseDown={(e) => { e.stopPropagation(); setSelectedVavForModal(v); setVavCfm(Math.floor(Math.random() * 300 + 400)); setLockedVavId(v.id); setIsLockedToSA(false); }}
                                            >
                                                <div className={`${isLocked ? 'text-rose-500' : 'text-sky-500'} font-black mb-0.5`}>{v.id}</div>
                                                <div className={`flex justify-center gap-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}><span>{v.t.toFixed(1)}&deg;C</span><span className="text-slate-500">·</span><span>{v.rh.toFixed(0)}%</span></div>
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                        </React.Fragment>
                        </div>
                    );
                }
            })()}

        </div>
    </div>
</div>
);
return floorIsPopped
    ? ReactDOM.createPortal(floorModalTree, floorPlanPopupHost)
    : floorModalTree;
}
