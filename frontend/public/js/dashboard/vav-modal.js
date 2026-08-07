/* ------------------------------------------------------------------
 * dashboard/vav-modal.js — VAV equipment modal renderer.
 * ------------------------------------------------------------------
 *
 * Extracted from app.js in Phase L.25 (2026-02-21).  The block had
 * lived as an inline IIFE inside App's render at the line that read
 * `{selectedVavForModal && (() => { ... })()}` — 366 lines deep,
 * with ~26 closure references back to App's state, refs, and
 * helpers.
 *
 * Approach (since the module loader concatenates files at the TOP
 * level before Babel transpilation, a function defined here does
 * NOT have access to App's lexical closure):
 *   - Define one top-level function, `renderVavEquipmentModal(ctx)`.
 *   - The caller (App's render) builds a `ctx` object literal with
 *     all the closure refs the body needs, then calls the function.
 *   - The function destructures `ctx` at the top, then runs the
 *     original IIFE body verbatim.
 *
 * Future refactor: convert this to a proper React functional component
 * (`<VavEquipmentModal {...ctx} />`) so we get the usual lifecycle +
 * memoisation niceties.  For now, the function-style port keeps the
 * behaviour byte-identical to the pre-extraction IIFE.
 *
 * Ctx props expected (26):
 *   API_URL, _setForceApTick, ahuData, setAhuData, selectedAhuId,
 *   ccEquipTypes, mapConfig, popOutVavModal,
 *   selectedVavForModal, setSelectedVavForModal, setDragStart,
 *   setIsVavModalDragging, setVavImgDims, vavImgDims, sunState, theme,
 *   vavCfm, vavImage, vavImgRef, vavTypeImages, vavModalOffset,
 *   vavModalPopupHost, vavModalPopupWin, vavModalSize, vavOuterRef,
 *   sweetSpotRange, showSweetSpot
 * ------------------------------------------------------------------ */

function renderVavEquipmentModal(ctx) {
    const {
        API_URL, _setForceApTick,
        ahuData, setAhuData, selectedAhuId,
        ccEquipTypes,
        mapConfig,
        popOutVavModal, floatPipVavModal,
        selectedVavForModal, setSelectedVavForModal,
        setDragStart, setIsVavModalDragging,
        setVavImgDims, vavImgDims,
        sunState, theme,
        vavCfm,
        vavImage, vavImgRef, vavTypeImages,
        vavModalOffset, vavModalPopupHost, vavModalPopupWin, vavModalSize,
        vavOuterRef,
        sweetSpotRange, showSweetSpot,
    } = ctx;
                        const currentAhuForModal = ahuData.find(a => a.id === selectedAhuId) || ahuData[0];
                        const saPoint = currentAhuForModal?.points?.find(p => p.label === 'SA');
                        const saTemp = saPoint ? saPoint.t : 22;
                        const vavTemp = selectedVavForModal.t;
                        
                        // === Schema-driven VAV graphic & layout ===
                        // Look up VAV type_id from map_config marker, fall back to first vav_type.
                        let vavTypeId = null;
                        let vavMarkerPos = null;
                        if (mapConfig && mapConfig.floors) {
                            for (const floor of mapConfig.floors) {
                                const marker = (floor.markers || []).find(m => m.type === 'vav' && m.name === selectedVavForModal.id);
                                if (marker) { vavTypeId = String(marker.equipment_type_id || ''); vavMarkerPos = {x:marker.x, y:marker.y}; break; }
                            }
                        }
                        // Sun-Path → B1-B10 trim: only amber-ring VAVs (in-shaft × blinds).
                        let modalSunScore = null, modalBandTrim = null;
                        if (sunState && sunState.enabled && sunState.sun && vavMarkerPos) {
                            let floorWins = [], floorRooms = [];
                            if (mapConfig && mapConfig.floors) {
                                for (const floor of mapConfig.floors) {
                                    const marker = (floor.markers || []).find(m => m.type === 'vav' && m.name === selectedVavForModal.id);
                                    if (marker) {
                                        floorWins = floor.windows || [];
                                        floorRooms = floor.rooms || [];
                                        break;
                                    }
                                }
                            }
                            const opts = { rooms: floorRooms };
                            modalSunScore = window.red5SunBlindScore
                                ? window.red5SunBlindScore(vavMarkerPos.x, vavMarkerPos.y, sunState.sun, floorWins, opts)
                                : (window.red5SunExposureScore
                                    ? window.red5SunExposureScore(vavMarkerPos.x/100, vavMarkerPos.y/100, sunState.sun)
                                    : 0);
                            const _ahuForBand = ahuData.find(a => a.id === selectedAhuId) || ahuData[0];
                            if (_ahuForBand && _ahuForBand.active_band && window.red5BandSunTrim) {
                                modalBandTrim = window.red5BandSunTrim(_ahuForBand.active_band, modalSunScore);
                            }
                        }
                        if ((!vavTypeId || vavTypeId === 'null' || vavTypeId === 'undefined') && ccEquipTypes && ccEquipTypes.vav_types) {
                            const firstKey = Object.keys(ccEquipTypes.vav_types)[0];
                            if (firstKey) vavTypeId = firstKey;
                        }
                        const vavSchema = ccEquipTypes && ccEquipTypes.vav_types ? ccEquipTypes.vav_types[vavTypeId] : null;
                        const schemaVavGraphic = (vavSchema && vavSchema.visual_assets && vavSchema.visual_assets.base_graphic) || null;
                        // Resolve VAV image with the same robustness as AHU:
                        //   - If `base_graphic` is a relative PATH (contains '/'), use /api/assets/<path>
                        //   - If it's a bare FILENAME, prefer the backend-discovered map
                        //     (handles legacy schemas that stored only "vav_graphic.jpg")
                        //   - Final fallback: backend's legacy single-VAV `data.vav` field
                        const bareName = schemaVavGraphic ? schemaVavGraphic.split('/').pop() : null;
                        const isPathLike = !!(schemaVavGraphic && schemaVavGraphic.indexOf('/') >= 0);
                        const schemaVavImage = isPathLike
                            ? `${API_URL}/api/assets/${schemaVavGraphic}`
                            : null;
                        const discoveredVavImage = (bareName && vavTypeImages[bareName]) || null;
                        const effectiveVavImage = schemaVavImage || discoveredVavImage || vavImage;
                        const vavSchemaPoints = (vavSchema && vavSchema.points) || [];
                        const vavSchemaAnimations = (vavSchema && vavSchema.visual_assets && vavSchema.visual_assets.animations) || [];
                        // Live telemetry lookup for point labels on the VAV schema
                        const vavLive = selectedVavForModal.all_points || {};
                        const vavV = (lbl) => {
                            const v = vavLive[lbl];
                            if (typeof v === 'number') return v.toFixed(1);
                            if (v != null) return String(v);
                            return '--';
                        };
                        
                        const isSaLower = saTemp < vavTemp;
                        const startColor = isSaLower ? '#3b82f6' : '#ea580c'; 
                        const endColor = isSaLower ? '#ea580c' : '#3b82f6';   
                        const startOpacity = "0.3"; const endOpacity = "0.3";
                        const pulseFrequency = (vavCfm / 1000) * 4; 
                        const isAirflowOff = vavCfm === 0;
                        const animDur = isAirflowOff ? '0s' : `${(1 / pulseFrequency).toFixed(3)}s`;

                        // VAV point-value helpers (with pending-writes merge)
                        const vavEquipId = selectedVavForModal.id;
                        const vavAp = (() => {
                            const out = { ...(selectedVavForModal.all_points || {}) };
                            // Also allow top-level properties like t, rh, cfm on selectedVavForModal
                            if (selectedVavForModal.t != null && out.t == null) out.t = selectedVavForModal.t;
                            if (selectedVavForModal.rh != null && out.rh == null) out.rh = selectedVavForModal.rh;
                            const pw = (typeof window !== 'undefined' && window._pendingWrites) || {};
                            const nowMs = Date.now();
                            for (const k of Object.keys(pw)) {
                                const [eq, lbl] = k.split('|');
                                if (eq !== vavEquipId) continue;
                                if (nowMs - pw[k].ts > 15000) { delete pw[k]; continue; }
                                out[lbl] = pw[k].value;
                            }
                            return out;
                        })();
                        const vavVn = (k) => { const v = vavAp[k]; return typeof v === 'number' ? v : (v != null ? parseFloat(v) || 0 : 0); };
                        const vavIsBool = (k) => { const v = vavAp[k]; return v === 1 || v === true || v === '1'; };

                        const writeVavRW = (label, value) => {
                            const num = parseFloat(value);
                            if (isNaN(num)) return;
                            window._lastWriteSig = window._lastWriteSig || {};
                            const dbKey = `${vavEquipId}|${label}`;
                            const now = Date.now();
                            if (window._lastWriteSig[dbKey] && now - window._lastWriteSig[dbKey] < 300) return;
                            window._lastWriteSig[dbKey] = now;
                            window._pendingWrites = window._pendingWrites || {};
                            window._pendingWrites[dbKey] = { value: num, ts: now };
                            _setForceApTick(t => t + 1);
                            setAhuData(prev => prev.map(a => ({
                                ...a,
                                vavs: (a.vavs || []).map(v => v.id === vavEquipId
                                    ? { ...v, all_points: { ...(v.all_points || {}), [label]: num } }
                                    : v)
                            })));
                            fetch(`${API_URL}/api/write-point`, {
                                method: 'POST',
                                credentials: 'include',
                                headers: {'Content-Type':'application/json'},
                                body: JSON.stringify({ equipment_name: vavEquipId, writes: { [label]: num } })
                            }).then(r => r.json()).then(d => {
                                if (!d.success) console.warn('VAV Write failed:', d.error);
                                if (typeof window._refetchTelemetry === 'function') window._refetchTelemetry();
                            }).catch(e => console.warn('VAV Write error:', e));
                        };

                        const vavIsPopped = !!(vavModalPopupWin && vavModalPopupHost);
                        const vavIsPip = !!(vavIsPopped && vavModalPopupWin.__red5IsPip);
                        const vavPipOk = typeof red5PipSupported === 'function' && red5PipSupported();
                        const vavOuterStyle = vavIsPopped
                            ? { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }
                            : { top: `${safe(vavModalOffset.y)}px`, left: `${safe(vavModalOffset.x)}px` };
                        const vavOuterCls = vavIsPopped
                            ? 'block select-none'
                            : 'absolute z-[120] select-none shadow-2xl drop-shadow-2xl';
                        const vavInnerStyle = vavIsPopped
                            ? { width: '100vw', height: '100vh', maxWidth: 'none', maxHeight: 'none' }
                            : { width: `${vavModalSize.w}px`, height: `${vavModalSize.h}px`, maxWidth: '98vw', maxHeight: '95vh', resize: 'both' };

                        const vavModalTree = (
                            <div className={vavOuterCls} style={vavOuterStyle}>
                                <div ref={vavOuterRef} className={`${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-[#e2e5e8] border-white/20 text-slate-800'} ${vavIsPopped ? '' : 'rounded-xl border-2'} shadow-2xl relative flex flex-col overflow-hidden`} style={vavInnerStyle} onMouseDown={e => e.stopPropagation()}>
                                    
                                    <div className={`cursor-grab active:cursor-grabbing ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-300/60 border-slate-300'} backdrop-blur-md border-b p-3 flex justify-between items-center z-[60]`} onMouseDown={(e) => { if (vavIsPopped) return; setIsVavModalDragging(true); setDragStart({ x: e.clientX - vavModalOffset.x, y: e.clientY - vavModalOffset.y }); }}>
                                        <h3 className={`text-sm font-black tracking-widest ml-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{selectedVavForModal.id} DIAGRAM {vavSchema && <span className="text-[9px] font-normal text-slate-500 ml-2">Type {vavTypeId}: {vavSchema.name}</span>}{modalBandTrim && (
                                            <span className={`ml-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold tracking-wider ${modalBandTrim.sun_trim_c < 0
                                                ? (theme === 'dark' ? 'bg-amber-500/15 border-amber-500/50 text-amber-400' : 'bg-amber-100 border-amber-400 text-amber-700')
                                                : modalBandTrim.sun_trim_c > 0
                                                ? (theme === 'dark' ? 'bg-sky-500/15 border-sky-500/50 text-sky-400' : 'bg-sky-100 border-sky-400 text-sky-700')
                                                : (theme === 'dark' ? 'bg-slate-700/40 border-slate-600 text-slate-400' : 'bg-slate-200 border-slate-300 text-slate-500')
                                            }`} title={`Sun-exposure ${(modalBandTrim.sun_score*100).toFixed(0)}% on this VAV → band ${modalBandTrim.id} SA target ${modalBandTrim.base_sa_t}°C ${modalBandTrim.sun_trim_c >= 0 ? '+' : ''}${modalBandTrim.sun_trim_c.toFixed(2)}°C ⇒ ${modalBandTrim.sa_t_sp}°C local target`}>
                                                <span className="text-[8px] opacity-70 uppercase">{modalBandTrim.id}</span>
                                                <span>SA {modalBandTrim.sa_t_sp}°C</span>
                                                {modalBandTrim.sun_trim_c !== 0 && <span className="opacity-80">({modalBandTrim.sun_trim_c > 0 ? '+' : ''}{modalBandTrim.sun_trim_c.toFixed(2)} sun)</span>}
                                            </span>
                                        )}<span style={{color:'#64748b', fontSize:'10px', marginLeft:'8px', fontWeight:'normal'}}>{vavIsPopped ? (vavIsPip ? 'Drag the float box across monitors' : 'Resize the popped-out window directly') : 'Drag corner ↘ to resize'}</span></h3>
                                        <div className="flex items-center gap-2 mr-1" onMouseDown={e => e.stopPropagation()}>
                                            <button
                                                data-testid="qr-phone-preview-btn"
                                                onClick={() => { if (typeof window.openQrPhonePreview === 'function') window.openQrPhonePreview('vav', selectedVavForModal.id); }}
                                                title="Show phone-preview QR code for this VAV"
                                                className={`px-2 py-0.5 border rounded text-[8px] font-black uppercase tracking-wider transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-amber-500 hover:text-amber-300' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-amber-500 hover:text-amber-600'}`}
                                            >
                                                {'\u2316 QR'}
                                            </button>
                                            <button
                                                data-testid="popout-vav-modal-btn"
                                                onClick={() => {
                                                    if (vavModalPopupWin && !vavModalPopupWin.closed && !vavModalPopupWin.__red5IsPip) {
                                                        vavModalPopupWin.close();
                                                    } else {
                                                        popOutVavModal();
                                                    }
                                                }}
                                                title={vavIsPopped && !vavIsPip ? 'Re-attach VAV modal to this window' : 'Pop out into a browser window'}
                                                className={`px-2 py-0.5 border rounded text-[8px] font-black uppercase tracking-wider transition-all ${vavIsPopped && !vavIsPip ? 'bg-emerald-700 border-emerald-400 text-slate-100 hover:bg-emerald-600' : (theme === 'dark' ? 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-cyan-500 hover:text-cyan-300' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-cyan-500 hover:text-cyan-600')}`}
                                            >
                                                {vavIsPopped && !vavIsPip ? '\u21A9 ATTACH' : '\u2197 POP OUT'}
                                            </button>
                                            {vavPipOk && (
                                            <button
                                                data-testid="pip-vav-modal-btn"
                                                onClick={() => {
                                                    if (vavModalPopupWin && !vavModalPopupWin.closed && vavModalPopupWin.__red5IsPip) {
                                                        vavModalPopupWin.close();
                                                    } else if (typeof floatPipVavModal === 'function') {
                                                        floatPipVavModal();
                                                    }
                                                }}
                                                title={vavIsPip ? 'Re-attach float box to this window' : 'Float as a minimal always-on-top box (Chrome/Edge PiP)'}
                                                className={`px-2 py-0.5 border rounded text-[8px] font-black uppercase tracking-wider transition-all ${vavIsPip ? 'bg-violet-700 border-violet-400 text-slate-100 hover:bg-violet-600' : (theme === 'dark' ? 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-violet-500 hover:text-violet-300' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-violet-500 hover:text-violet-600')}`}
                                            >
                                                {vavIsPip ? '\u21A9 ATTACH' : '\u25A3 FLOAT'}
                                            </button>
                                            )}
                                            <button className={`${theme === 'dark' ? 'text-slate-400 hover:text-slate-100' : 'text-slate-500 hover:text-slate-800'} transition-colors cursor-pointer`} onClick={() => setSelectedVavForModal(null)}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2">
                                    <div className={`red5-graphic-zone relative w-full min-h-[240px] lg:min-h-0 ${theme === 'dark' ? 'bg-[#d0d4d8]' : 'bg-[#d8dce0]'} overflow-hidden flex items-center justify-center p-2 lg:border-r lg:border-slate-700`}>
                                        {!effectiveVavImage ? (
                                            <div className="flex flex-col items-center justify-center font-bold text-center font-mono text-[10px] w-full h-full">
                                                <span className="mb-2 uppercase tracking-widest text-red-600 text-lg">{window.t ? window.t("vav_image_missing") : "VAV IMAGE MISSING"}</span>
                                                <span className="text-xs">Define <code className="bg-slate-200 px-1 rounded">visual_assets.base_graphic</code> for vav_type {vavTypeId || 'N'} in the Config Tool</span>
                                            </div>
                                        ) : (
                                        <div className="relative pointer-events-auto shadow-[0_0_50px_rgba(0,0,0,0.15)]"
                                             style={{
                                               display: 'grid',
                                               gridTemplateColumns: '1fr',
                                               gridTemplateRows: '1fr',
                                               maxWidth: '100%',
                                               maxHeight: '100%',
                                             }}>
                                            <img ref={vavImgRef} src={effectiveVavImage} alt="VAV" className="block pointer-events-none"
                                                 style={{ gridArea: '1 / 1', maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', display: 'block' }}
                                                 onLoad={(e) => { const im = e.target; setVavImgDims({ natW: im.naturalWidth || 1600, natH: im.naturalHeight || 1004, dispW: im.offsetWidth, dispH: im.offsetHeight }); }} />
                                            <div className="relative pointer-events-none" style={{ gridArea: '1 / 1' }}>

                                                {/* Image-fit scale: pills/animations multiply this so they shrink with the image when the modal is small (fixes pill drift on tablet/phone). */}
                                                {(() => { /* keep a no-op so the closure scope is obvious */ return null; })()}

                                                {/* === SCHEMA-DRIVEN VAV POINTS === */}
                                                {vavSchemaPoints.map((p, pi) => {
                                                    if (p.x == null || p.y == null) return null;
                                                    const vavImgScale = (vavImgDims.dispW && vavImgDims.natW) ? (vavImgDims.dispW / vavImgDims.natW) : 1;
                                                    // Original schema scale is the DEFAULT (full size at imgScale>=1).
                                                    // Pills shrink with the image but never below 80% of original —
                                                    // the readability floor.  imgScale > 1 is capped (no grow).
                                                    const gScale = (p.scale || 1.0) * Math.max(0.8, Math.min(1, vavImgScale));
                                                    const isRW = p.access === 'RW';
                                                    const minVal = parseFloat(p.min);
                                                    const maxVal = parseFloat(p.max);
                                                    const isDigital = minVal === 0 && maxVal === 1;
                                                    const rawVal = vavAp[p.label];
                                                    const numVal = typeof rawVal === 'number' ? rawVal : (rawVal != null ? parseFloat(rawVal) || 0 : 0);
                                                    const boolVal = rawVal === 1 || rawVal === true || rawVal === '1';
                                                    const displayName = (p.name && p.name !== p.label) ? p.name : p.label;

                                                    const renderCtl = () => {
                                                        if (isDigital) {
                                                            if (isRW) {
                                                                return (
                                                                    <button type="button" className="relative inline-flex items-center cursor-pointer pointer-events-auto bg-transparent border-0 p-0 select-none" onClick={e => { e.stopPropagation(); e.preventDefault(); writeVavRW(p.label, boolVal ? 0 : 1); }} onMouseDown={e => e.preventDefault()}>
                                                                        <div className={`w-7 h-4 rounded-full shadow-inner relative ${boolVal ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                                                                            <div className={`absolute top-[2px] bg-white border-slate-300 border rounded-full h-3 w-3 transition-all ${boolVal ? 'left-[14px]' : 'left-[2px]'}`}></div>
                                                                        </div>
                                                                    </button>
                                                                );
                                                            }
                                                            return <div className={`px-1.5 py-0.5 rounded text-[7px] font-black border uppercase tracking-widest ${boolVal ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-slate-700/20 text-slate-500 border-slate-600/50'}`}>{boolVal ? 'ON' : 'OFF'}</div>;
                                                        }
                                                        if (isRW) {
                                                            const step = 0.1;
                                                            const inpId = `vav_inp_${p.label}`;
                                                            const readCur = () => {
                                                                const el = document.getElementById(inpId);
                                                                const v = el ? parseFloat(el.value) : numVal;
                                                                return isNaN(v) ? numVal : v;
                                                            };
                                                            const bump = (delta) => {
                                                                const nv = +(readCur() + delta).toFixed(3);
                                                                const el = document.getElementById(inpId);
                                                                if (el) el.value = nv.toFixed(1);
                                                                writeVavRW(p.label, nv);
                                                            };
                                                            return (
                                                                <div className="flex items-center gap-1 pointer-events-auto">
                                                                    <button type="button" onClick={e => { e.stopPropagation(); bump(-step); }} className="w-5 h-5 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 rounded text-slate-100 text-sm font-black flex items-center justify-center transition-colors select-none">−</button>
                                                                    <input id={inpId} type="text" inputMode="decimal" defaultValue={numVal.toFixed(1)} onKeyDown={e => { if (e.key === 'Enter') { writeVavRW(p.label, e.target.value); e.target.blur(); } }} onBlur={e => writeVavRW(p.label, e.target.value)} onClick={e => e.stopPropagation()} className="no-spinner w-12 bg-slate-900 border border-slate-600 rounded px-1 py-0.5 text-emerald-400 font-mono text-[10px] font-black text-right outline-none focus:border-emerald-500" />
                                                                    <button type="button" onClick={e => { e.stopPropagation(); bump(+step); }} className="w-5 h-5 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 rounded text-slate-100 text-sm font-black flex items-center justify-center transition-colors select-none">+</button>
                                                                    {p.unit && <span className="text-[7px] font-black text-slate-400">{p.unit}</span>}
                                                                </div>
                                                            );
                                                        }
                                                        return <div className="font-mono text-[10px] font-black text-emerald-400 whitespace-nowrap">{rawVal != null ? numVal.toFixed(1) : '--'} {p.unit && <span className="text-[8px] text-slate-400 ml-0.5">{p.unit}</span>}</div>;
                                                    };

                                                    return (
                                                        <div key={`vpt_${pi}_${p.label}`} className="absolute z-20" style={{left:`${p.x}%`,top:`${p.y}%`,transform:`translate(-50%,-50%) scale(${gScale})`,transformOrigin:'center center'}}>
                                                            {isRW ? (
                                                                <div className="flex flex-col bg-slate-950/95 border border-amber-700/60 rounded shadow-xl backdrop-blur-md min-w-[150px]">
                                                                    <div className="flex items-center justify-between px-2 py-1 border-b border-amber-800/40">
                                                                        <div className="flex items-center gap-1.5">
                                                                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-amber-400 shadow-[0_0_6px_#f59e0b]"></div>
                                                                            <span className="font-mono text-[8px] font-black uppercase tracking-widest text-amber-300 whitespace-nowrap">{displayName}</span>
                                                                        </div>
                                                                        <span className="text-[6px] font-black text-amber-500/70 uppercase tracking-widest">RW</span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between px-2 py-0.5">
                                                                        <span className="text-[7px] font-black uppercase tracking-wider text-amber-400">{p.label}</span>
                                                                        <div className="flex items-center">{renderCtl()}</div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="flex flex-row gap-2 px-2.5 py-1 bg-slate-900/90 border border-slate-700 rounded-full shadow-xl backdrop-blur-md items-center">
                                                                    <div className="w-2 h-2 rounded-full flex-shrink-0 bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                                                                    <span className="font-mono text-[8px] font-black uppercase tracking-widest text-slate-100 whitespace-nowrap">{displayName}</span>
                                                                    {renderCtl()}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}

                                                {/* === SCHEMA-DRIVEN VAV ANIMATIONS === */}
                                                {(() => {
                                                    const vavImgScale = (vavImgDims.dispW && vavImgDims.natW) ? (vavImgDims.dispW / vavImgDims.natW) : 1;
                                                    return vavSchemaAnimations.map((a, ai) => {
                                                        if (a.x == null || a.y == null) return null;
                                                        const tKey = a.telemetry_key || '';
                                                        const tVal = vavVn(tKey);
                                                        const isAlarm = vavIsBool(tKey + '_ALM');
                                                        const isRunning = vavIsBool(tKey + '_STATUS') || tVal > 0;
                                                        const atype = a.animation_type;

                                                        if (atype === 'air_flow_path' && typeof PreviewAirFlowSimulator !== 'undefined') {
                                                            // Schema-migration (2026-02): segment offsets are now stored as
                                                            // offsetXFrac/offsetYFrac (fraction of natural image width). The
                                                            // simulator renders them at containerW px directly, so the wrapper
                                                            // no longer needs a transform: scale(vavImgScale) workaround.
                                                            return (
                                                                <div key={`vanim_${ai}`} className="absolute z-10" style={{left:`${a.x}%`, top:`${a.y}%`, pointerEvents:'none'}}>
                                                                    <PreviewAirFlowSimulator segments={a.segments || []} fanSpeed={Math.max(vavVn('cfm') / 10, 20)} isActive={false} antiFreeze={false} heating={false} oat={22} sat={vavVn('t') || 22} allSensors={vavSchemaPoints} containerW={vavImgDims.dispW} naturalW={vavImgDims.natW} />
                                                                </div>
                                                            );
                                                        }

                                                        if (atype === 'vfd_aligner') {
                                                            const chassisW = a.base_w || 220, chassisH = a.base_h || 300;
                                                            const screenW = a.screen_w || 140, screenH = a.screen_h || 85;
                                                            const pillW = a.pill_w || 100, pillH = a.pill_h || 32;
                                                            const hz = tVal;
                                                            const amps = (hz / 60) * 8.5;
                                                            return (
                                                                <div key={`vanim_${ai}`} className="absolute z-20" style={{left:`${a.x}%`, top:`${a.y}%`, transform:`perspective(1200px) scale(${(a.scale ?? 1.0) * Math.max(0.7, Math.min(1, vavImgScale))}) rotateY(${(a.rotY != null) ? a.rotY : -8}deg) rotateX(${(a.rotX != null) ? a.rotX : 3}deg) rotateZ(${a.rotZ||0}deg)`, transformStyle:'preserve-3d'}}>
                                                                    <div className="relative w-0 h-0">
                                                                        <div className="absolute" style={{left:0,top:0,width:chassisW+'px',height:chassisH+'px',transform:'translate(-50%,-50%)'}}>
                                                                            {typeof PreviewVFDChassis !== 'undefined' && <PreviewVFDChassis imageData={a.image_data} isRunning={isRunning} isAlarm={isAlarm} />}
                                                                        </div>
                                                                        <div className="absolute" style={{left:(a.screen_dx||0)+'px',top:(a.screen_dy||0)+'px',width:screenW+'px',height:screenH+'px',transform:`translate(-50%,-50%) scale(${a.screen_scale ?? 1.0})`}}>
                                                                            {typeof PreviewVFDDisplay !== 'undefined' && <PreviewVFDDisplay targetHz={hz} actualHz={isRunning?hz:0} amps={isRunning?amps:0} isRunning={isRunning} hasFault={isAlarm} />}
                                                                        </div>
                                                                        <div className="absolute" style={{left:(a.pill_dx||0)+'px',top:(a.pill_dy||0)+'px',width:pillW+'px',height:pillH+'px',transform:`translate(-50%,-50%) scale(${a.pill_scale ?? 1.0})`}}>
                                                                            {typeof PreviewVFDPill !== 'undefined' && <PreviewVFDPill isActivated={true} isRunning={isRunning} hasFault={isAlarm} onToggleActivate={()=>{}} />}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }

                                                        const wPx = a.base_w || 120, hPx = a.base_h || 120;
                                                        // Aligners + generic animations: start at the schema's scale
                                                        // and shrink down to 70 % of original as the modal image gets
                                                        // smaller (matches the VFD + pill clamps).
                                                        const effScale = (a.scale || 1) * Math.max(0.7, Math.min(1, vavImgScale));
                                                        const transformStyle = `scale(${effScale}) scaleX(${a.stretchX||1}) scaleY(${a.stretchY||1}) skewX(${a.skewX||0}deg) skewY(${a.skewY||0}deg) rotateX(${a.rotX||0}deg) rotateY(${a.rotY||0}deg) rotateZ(${a.rotZ||0}deg)`;
                                                        const isSplitDP = atype === 'diff_pressure_switch';
                                                        const sX = a.sensor_x != null ? a.sensor_x : a.x;
                                                        const sY = a.sensor_y != null ? a.sensor_y : a.y - 20;
                                                        const sScale = a.sensor_scale != null ? a.sensor_scale : 0.8;

                                                        return (
                                                            <React.Fragment key={`vanim_frag_${ai}`}>
                                                            <div key={`vanim_${ai}`} className="absolute z-20" style={{left:`${a.x}%`,top:`${a.y}%`,width:wPx+'px',height:hPx+'px',marginLeft:`-${wPx/2}px`,marginTop:`-${hPx/2}px`,transform:transformStyle,transformStyle:'preserve-3d'}}>
                                                                <div className="absolute inset-0 flex items-center justify-center" style={{transformStyle:'preserve-3d'}}>
                                                                    {atype === 'damper' && typeof PreviewDamper !== 'undefined' && <PreviewDamper damperPos={tVal} width={wPx} height={hPx} />}
                                                                    {atype === 'circular_damper' && typeof PreviewCircularDamper !== 'undefined' && <PreviewCircularDamper damperPos={tVal} width={wPx} height={hPx} />}
                                                                    {atype === 'centrifugal_fan' && typeof PreviewCentrifugalFan !== 'undefined' && <PreviewCentrifugalFan outlinePath={a.outline_path} isAuto={false} isManualRunning={isRunning} fanSpeed={tVal} hasFault={isAlarm} isActive={false} />}
                                                                    {['rectangular_fan','rectangular_fan_aligner'].includes(atype) && typeof PreviewRectangularFan !== 'undefined' && <PreviewRectangularFan isAuto={false} isManualRunning={isRunning} fanSpeed={tVal} hasFault={isAlarm} />}
                                                                    {['hydration_valve','hydration_valve_aligner'].includes(atype) && typeof PreviewHydrationValve !== 'undefined' && <PreviewHydrationValve hydrateLevel={tVal} isHeating={false} width={wPx} height={hPx} rotX={a.rotX||0} rotY={a.rotY||0} rotZ={a.rotZ||0} />}
                                                                    {['antifreeze_coil_valve','antifreeze_coil'].includes(atype) && typeof PreviewAntiFreezeCoil !== 'undefined' && <PreviewAntiFreezeCoil activation={tVal} width={wPx} height={hPx} scale={1} stretchX={1} stretchY={1} rotX={a.rotX||0} rotY={a.rotY||0} rotZ={a.rotZ||0} skewX={a.skewX||0} skewY={a.skewY||0} numCoils={a.numCoils||4} isActive={false} />}
                                                                    {atype === 'neon_pipe_coil' && typeof PreviewNeonPipeCoil !== 'undefined' && <PreviewNeonPipeCoil value={tVal} isHeating={false} length={a.pipeLength} thickness={a.pipeThickness} separation={a.separation} />}
                                                                    {['diff_pressure_switch','differential_pressure_switch_aligner'].includes(atype) && typeof PreviewPressureSwitchFilter !== 'undefined' && <PreviewPressureSwitchFilter filterLoad={tVal} separation={a.separation} thickness={a.pipeThickness} />}
                                                                    {atype === 'dp_sensor_aligner' && typeof PreviewDPSensor !== 'undefined' && <PreviewDPSensor ch1={vavVn(a.ch1_key || 't')} ch2={vavVn(a.ch2_key || 'rh')} ch3={vavVn(a.ch3_key || 'rdp')} activeChannel={a.dp_active_channel || 0} />}
                                                                    {atype === 'dp_display_aligner' && typeof PreviewDPDisplay !== 'undefined' && <PreviewDPDisplay temp={vavVn('t')} rh={vavVn('rh')} dp={vavVn('rdp')} vavFlow={vavVn('cfm')} cavFlow={vavVn('cav')} activeRow={a.dp_active_row || 0} />}
                                                                </div>
                                                            </div>
                                                            {/* Split DP — second part: round Pa display disc */}
                                                            {isSplitDP && typeof PreviewPressureSwitchDisplay !== 'undefined' && (
                                                                <div className="absolute z-20" style={{left:`${sX}%`,top:`${sY}%`,width:'150px',height:'100px',marginLeft:'-75px',marginTop:'-50px',transform:`scale(${sScale}) scaleX(${a.sensor_stretchX||1}) scaleY(${a.sensor_stretchY||1}) skewX(${a.sensor_skewX||0}deg) skewY(${a.sensor_skewY||0}deg) rotateX(${a.sensor_rotX||0}deg) rotateY(${a.sensor_rotY||0}deg) rotateZ(${a.sensor_rotZ||0}deg)`,transformStyle:'preserve-3d'}}>
                                                                    <div className="absolute inset-0 flex items-center justify-center" style={{transformStyle:'preserve-3d'}}>
                                                                        <PreviewPressureSwitchDisplay filterLoad={tVal} />
                                                                    </div>
                                                                </div>
                                                            )}
                                                            </React.Fragment>
                                                        );
                                                    });
                                                })()}

                                            </div>
                                        </div>
                                        )}
                                    </div>
                                    <div className="relative w-full min-h-[280px] lg:min-h-0 overflow-hidden border-t lg:border-t-0 border-slate-700">
                                        {typeof renderVavPsyChart === 'function' && renderVavPsyChart({
                                            vav: selectedVavForModal,
                                            saPoint,
                                            ahuId: currentAhuForModal && currentAhuForModal.id,
                                            sweetSpotRange,
                                            showSweetSpot,
                                            theme,
                                        })}
                                    </div>
                                    </div>
                                </div>
                            </div>
                        );
                        return vavIsPopped
                            ? ReactDOM.createPortal(vavModalTree, vavModalPopupHost)
                            : vavModalTree;
}
