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
        ahuData, mapConfig, floorImage,
        buildingLatLon, sunState, setSunState,
        comfortZonePoly,
        // Helpers + look-up tables
        theme, safe, getFloorForAhu, getVavDiagnostic, popOutFloorPlanModal,
    } = ctx;

    if (!showFloorPlanForAhu) return null;

const floorIsPopped = !!(floorPlanPopupWin && floorPlanPopupHost);
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
            <h3 className={`text-lg font-black tracking-widest ml-2 uppercase ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>FLOOR PLAN - {showFloorPlanForAhu} ZONE {!floorIsPopped && <span style={{color:'#64748b', fontSize:'10px', marginLeft:'8px', fontWeight:'normal', textTransform:'none', letterSpacing:'normal'}}>Drag corner ↘ to resize</span>}</h3>
            <div className="flex items-center gap-2 mr-2" onMouseDown={e => e.stopPropagation()}>
                <button
                    data-testid="popout-floorplan-modal-btn"
                    onClick={() => { if (floorPlanPopupWin && !floorPlanPopupWin.closed) { floorPlanPopupWin.close(); } else { popOutFloorPlanModal(); } }}
                    title={floorIsPopped ? 'Re-attach floor plan to this window' : 'Pop the floor plan out into a draggable window'}
                    className={`px-2 py-0.5 border rounded text-[8px] font-black uppercase tracking-wider transition-all ${floorIsPopped ? 'bg-emerald-700 border-emerald-400 text-slate-100 hover:bg-emerald-600' : (theme === 'dark' ? 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-cyan-500 hover:text-cyan-300' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-cyan-500 hover:text-cyan-600')}`}
                >
                    {floorIsPopped ? '\u21A9 ATTACH' : '\u2197 POP OUT'}
                </button>
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
                                <window.SunRayOverlay sun={sunState.sun} theme={theme} cloudCover={sunState.cloudCover} ghiWm2={sunState.ghiWm2} />
                            )}
                            <div className="absolute inset-0 pointer-events-none">
                            <div className={`absolute top-4 left-4 z-10 text-sm font-mono px-3 py-1.5 rounded pointer-events-auto ${theme === 'dark' ? 'text-emerald-400 bg-slate-900/80' : 'text-emerald-700 bg-white/80'}`}>
                                {floorData.floor.name} - {floorData.floor.image_path}
                            </div>
                            
                            {/* Render ALL AHU markers from map_config */}
                            {floorData.allMarkers.filter(m => m.type === 'ahu').map(marker => {
                                const isActive = marker.name === showFloorPlanForAhu || marker.id === showFloorPlanForAhu;
                                // Sun-Path Phase A: compute exposure halo + directional
                                // shadow for this marker when the overlay is active.
                                let sunRing = null, sunShadow = null;
                                if (sunState && sunState.enabled && sunState.sun && window.red5SunExposureScore) {
                                    const sc = window.red5SunExposureScore(marker.x/100, marker.y/100, sunState.sun);
                                    sunRing = window.red5ExposureColor(sc);
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
                                            style={(sunRing && !isActive) ? {borderColor: sunRing, boxShadow: `0 0 18px ${sunRing}`} : {}}
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
                                // Use the SAME 4-state diagnostic as the VAV list so map and list agree:
                                //   optimal/comfort → green, warning → amber, alarm → red, no-data → slate
                                const saP = activeAhu && activeAhu.points ? activeAhu.points[1] : null;
                                const diag = liveVav ? getVavDiagnostic(liveVav, saP, comfortZonePoly) : null;
                                const dotColor = !liveVav ? 'bg-slate-500'
                                    : diag.status === 'optimal' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]'
                                    : diag.status === 'comfort' ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.65)]'
                                    : diag.status === 'warning' ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)]'
                                    : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]';

                                // Sun-Path → B1-B10 band trim (P0 hook).  Compute once per VAV
                                // so both the ring tooltip path and the plain-marker path can
                                // surface the per-VAV trimmed SA target.
                                let vavSunScore = null, vavBandTrim = null;
                                if (sunState && sunState.enabled && sunState.sun && window.red5SunExposureScore) {
                                    vavSunScore = window.red5SunExposureScore(marker.x/100, marker.y/100, sunState.sun);
                                    if (activeAhu && activeAhu.active_band && window.red5BandSunTrim) {
                                        vavBandTrim = window.red5BandSunTrim(activeAhu.active_band, vavSunScore);
                                    }
                                }
                                const trimSuffix = vavBandTrim && vavBandTrim.sun_trim_c !== 0
                                    ? ` · ${vavBandTrim.id} SA→${vavBandTrim.sa_t_sp}°C (${vavBandTrim.sun_trim_c > 0 ? '+' : ''}${vavBandTrim.sun_trim_c.toFixed(2)} sun)`
                                    : '';

                                return (
                                    <div key={marker.id} className="absolute flex flex-col items-center z-20 group pointer-events-auto" style={{ left: `${marker.x}%`, top: `${marker.y}%`, transform: 'translate(-50%, -50%)' }}>
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
                                        {(() => {
                                            // Compute sun-exposure ring for the dot.
                                            if (!(sunState && sunState.enabled && sunState.sun && window.red5SunExposureScore)) return null;
                                            const sc = vavSunScore != null ? vavSunScore : window.red5SunExposureScore(marker.x/100, marker.y/100, sunState.sun);
                                            const ring = window.red5ExposureColor(sc);
                                            if (!ring) return null;
                                            return (
                                                <div
                                                    className={`w-6 h-6 rounded-full border-[3px] cursor-pointer group-hover:scale-125 transition-all duration-300 ${dotColor} ${isLocked ? 'border-cyan-400 scale-125 ring-4 ring-cyan-400/60' : ''}`}
                                                    style={{borderColor: ring, boxShadow: `0 0 15px ${ring}`}}
                                                    title={(liveVav ? `${marker.name}: ${liveVav.t.toFixed(1)}C ${liveVav.rh.toFixed(0)}%RH${diag ? ' — ' + diag.status : ''}` : marker.name) + ' · sun-exposed' + trimSuffix}
                                                    onMouseDown={(e) => { e.stopPropagation(); if (liveVav) { setSelectedVavForModal(liveVav); setVavCfm(Math.floor(Math.random() * 300 + 400)); setLockedVavId(liveVav.id); setIsLockedToSA(false); } }}
                                                ></div>
                                            );
                                        })() || (
                                        <div 
                                            className={`w-6 h-6 rounded-full border-[3px] cursor-pointer group-hover:scale-125 transition-all duration-300 ${dotColor} ${isLocked ? 'border-cyan-400 scale-125 ring-4 ring-cyan-400/60' : 'border-white'}`}
                                            title={(liveVav ? `${marker.name}: ${liveVav.t.toFixed(1)}C ${liveVav.rh.toFixed(0)}%RH${diag ? ' — ' + diag.status : ''}` : marker.name) + trimSuffix}
                                            onMouseDown={(e) => { e.stopPropagation(); if (liveVav) { setSelectedVavForModal(liveVav); setVavCfm(Math.floor(Math.random() * 300 + 400)); setLockedVavId(liveVav.id); setIsLockedToSA(false); } }}
                                        ></div>)}
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
                            <div className={`absolute top-4 left-4 z-10 text-sm font-mono px-3 py-1.5 rounded ${theme === 'dark' ? 'text-amber-400 bg-slate-900/80' : 'text-amber-700 bg-white/80'}`}>
                                No map_config.json — using fallback layout
                            </div>
                            
                            {/* Fallback: hardcoded 4-corner AHU layout */}
                            {(() => {
                                const floorAhus = ahuData.slice(0, 4);
                                const ahuPositions = [{ left: 25, top: 25 }, { left: 75, top: 25 }, { left: 25, top: 75 }, { left: 75, top: 75 }];
                                return floorAhus.map((ahu, i) => {
                                    const pos = ahuPositions[i]; const isActiveAhu = showFloorPlanForAhu === ahu.id;
                                    // Sun-Path Phase A: halo + shadow for fallback AHU markers
                                    let sunRing = null, sunShadow = null;
                                    if (sunState && sunState.enabled && sunState.sun && window.red5SunExposureScore) {
                                        const sc = window.red5SunExposureScore(pos.left/100, pos.top/100, sunState.sun);
                                        sunRing = window.red5ExposureColor(sc);
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
                                                style={(sunRing && !isActiveAhu) ? {borderColor: sunRing, boxShadow: `0 0 18px ${sunRing}`} : {}}
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
                                    let sunRing = null, sunShadow = null;
                                    if (sunState && sunState.enabled && sunState.sun && window.red5SunExposureScore) {
                                        const sc = window.red5SunExposureScore(gp.left/100, gp.top/100, sunState.sun);
                                        sunRing = window.red5ExposureColor(sc);
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
                                                style={sunRing ? {borderColor: sunRing, boxShadow: `0 0 15px ${sunRing}`} : {}}
                                                title={v.id + (sunRing ? ' · sun-exposed' : '')}
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
