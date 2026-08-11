/* ------------------------------------------------------------------
 * dashboard/ahu-modal.js — AHU equipment modal renderer.
 * ------------------------------------------------------------------
 *
 * Extracted from app.js in Phase L.26 (2026-02-21).  Companion to
 * vav-modal.js (Phase L.25) — same prop-interface pattern, same
 * extraction approach.  The block had lived as an inline IIFE inside
 * App's render at `{showAhuModalFor && (() => { ... })()}` — 608
 * lines deep, with 23 closure references back to App's state, refs,
 * and helpers.
 *
 * Why a top-level function instead of a React component:
 *   Same reasoning as vav-modal.js — concat-then-Babel module loader
 *   means top-level declarations don't have access to App's closure,
 *   so we accept the explicit ctx interface for now.  Future refactor
 *   pass: convert to `<AhuEquipmentModal {...ctx} />` for React.memo
 *   and DevTools visibility.
 *
 * Ctx props expected (23):
 *   API_URL, _setForceApTick, ahuBandGuideZoomed, setAhuBandGuideZoomed,
 *   ahuBodyRef, ahuData, ahuImage, ahuImgDims, ahuImgRef, ahuModalOffset,
 *   ahuModalPopupHost, ahuModalPopupWin, ahuModalSize, ahuOuterRef,
 *   ahuTypeImages, ccEquipTypes, mapConfig, popOutAhuModal, floatPipAhuModal,
 *   setAhuData, setAhuImgDims, setDragStart, setIsAhuModalDragging,
 *   setShowAhuModalFor, showAhuModalFor, theme
 *
 * LOCALS — declared inside the body, NOT passed via ctx (would cause
 * "already declared" errors):
 *   dk, writeRW, imgScale, currentAhuImage, groupedPoints, schemaPoints,
 *   schemaAnimations, schemaType, targetAhu, ahuTypeId, etc.
 * ------------------------------------------------------------------ */

function renderAhuEquipmentModal(ctx) {
    const {
        API_URL, _setForceApTick,
        ahuBandGuideZoomed, setAhuBandGuideZoomed,
        ahuBodyRef, ahuData, ahuImage, ahuImgDims, ahuImgRef,
        ahuModalOffset, ahuModalPopupHost, ahuModalPopupWin, ahuModalSize,
        ahuOuterRef, ahuTypeImages,
        ccEquipTypes, mapConfig,
        popOutAhuModal, floatPipAhuModal,
        setAhuData, setAhuImgDims, setDragStart, setIsAhuModalDragging,
        setShowAhuModalFor, showAhuModalFor,
        theme,
    } = ctx;
    const bandGuideZoomed = !!ahuBandGuideZoomed;
                        const targetAhu = ahuData.find(a => a.id === showAhuModalFor) || ahuData[0];
                        const oaPoint = targetAhu?.points?.find(p => p.label === 'OA');
                        const saPoint = targetAhu?.points?.find(p => p.label === 'SA');
                        const raPoint = targetAhu?.points?.find(p => p.label === 'RA');
                        const ap_raw = targetAhu?.all_points || {};
                        // Apply pending writes at render time. Pending writes are cleared
                        // only from fetchTelemetry after the server confirms the value.
                        // This prevents the optimistic update itself from triggering a
                        // premature "match" that drops protection before the server catches up.
                        const ap = (() => {
                            const out = { ...ap_raw };
                            const pw = (typeof window !== 'undefined' && window._pendingWrites) || {};
                            const nowMs = Date.now();
                            for (const k of Object.keys(pw)) {
                                const [eq, lbl] = k.split('|');
                                if (eq !== showAhuModalFor) continue;
                                if (nowMs - pw[k].ts > 15000) { delete pw[k]; continue; }
                                out[lbl] = pw[k].value;
                            }
                            return out;
                        })();

                        let ahuTypeId = null;
                        if (mapConfig && mapConfig.floors) {
                            for (const floor of mapConfig.floors) {
                                const marker = (floor.markers || []).find(m => m.type === 'ahu' && m.name === showAhuModalFor);
                                if (marker) { ahuTypeId = String(marker.equipment_type_id || ''); break; }
                            }
                        }
                        // If marker has no explicit type, fall back to the first available ahu_type in schema
                        if ((!ahuTypeId || ahuTypeId === 'null' || ahuTypeId === 'undefined') && ccEquipTypes && ccEquipTypes.ahu_types) {
                            const firstKey = Object.keys(ccEquipTypes.ahu_types)[0];
                            if (firstKey) ahuTypeId = firstKey;
                        }
                        const schemaType = ccEquipTypes && ccEquipTypes.ahu_types ? ccEquipTypes.ahu_types[ahuTypeId] : null;
                        const currentAhuImage = (schemaType && schemaType.visual_assets && schemaType.visual_assets.base_graphic && `${API_URL}/api/assets/${schemaType.visual_assets.base_graphic}`) || (ahuTypeId && ahuTypeImages[ahuTypeId]) || ahuTypeImages['generic'] || ahuImage;

                        const v = (k) => { const val = ap[k]; return val !== undefined && val !== null ? (typeof val === 'number' ? val.toFixed(1) : String(val)) : '0.0'; };
                        const vn = (k) => { const val = ap[k]; return typeof val === 'number' ? val : 0; };
                        const isBool = (k) => { const val = ap[k]; return val === 1 || val === true || val === '1'; };

                        const dk = theme === 'dark';
                        const panelCls = dk ? 'bg-[#1a2332]/95 border-[#2a3a4e] text-slate-200' : 'bg-white/95 border-slate-300 text-slate-800';
                        const headerCls = dk ? 'text-emerald-400' : 'text-emerald-600';
                        const labelCls = dk ? 'text-slate-400' : 'text-slate-500';
                        const valCls = dk ? 'text-emerald-400' : 'text-emerald-600';
                        const rwBadge = dk ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-600';
                        const dotOn = 'bg-emerald-400 shadow-emerald-400/50 shadow-sm';
                        const dotOff = dk ? 'bg-slate-600' : 'bg-slate-300';
                        const toggleCls = (on) => `w-3 h-3 rounded-full inline-block ${on ? dotOn : dotOff}`;

                        // Panel component: dark card with header + rows
                        const Panel = ({title, rw, pos, children, w}) => (
                            <div className={`absolute border rounded-lg shadow-xl z-10 ${panelCls}`} style={{...pos, width: w || '145px'}}>
                                <div className={`flex justify-between items-center px-2.5 py-1.5 border-b ${dk?'border-[#2a3a4e]':'border-slate-200'}`}>
                                    <div className="flex items-center gap-1.5">
                                        <span className={`w-2 h-2 rounded-full ${dotOn}`}></span>
                                        <span className={`text-[9px] font-black uppercase tracking-wider ${headerCls}`}>{title}</span>
                                    </div>
                                    {rw && <span className={`text-[7px] font-black px-1 py-0.5 rounded ${rwBadge}`}>RW</span>}
                                </div>
                                <div className="px-2.5 py-1.5 space-y-1">{children}</div>
                            </div>
                        );

                        const Row = ({label, val, unit, color}) => (
                            <div className="flex justify-between items-center">
                                <span className={`text-[9px] font-bold ${labelCls}`}>{label}</span>
                                <span className={`text-[11px] font-black font-mono ${color || valCls}`}>{val} <span className={`text-[8px] font-normal ${labelCls}`}>{unit||''}</span></span>
                            </div>
                        );

                        const ToggleRow = ({label, on}) => (
                            <div className="flex justify-between items-center">
                                <span className={`text-[9px] font-bold ${labelCls}`}>{label}</span>
                                <span className={toggleCls(on)}></span>
                            </div>
                        );

                        // Small pill indicator for duct-mounted sensors
                        const Pill = ({val, unit, pos, color}) => (
                            <div className={`absolute flex items-center gap-1 px-2 py-0.5 rounded-full border shadow z-10 ${dk?'bg-[#1a2332]/90 border-[#2a3a4e]':'bg-white/95 border-slate-300'}`} style={pos}>
                                <span className={`w-1.5 h-1.5 rounded-full ${dotOn}`}></span>
                                <span className={`text-[9px] font-black font-mono ${color || valCls}`}>{val}</span>
                                <span className={`text-[7px] ${labelCls}`}>{unit||''}</span>
                            </div>
                        );

                        // RW write handler — optimistic UI + short "pending window" that
                        // shields the written value from stale background polls.
                        const writeRW = (label, value) => {
                            const num = parseFloat(value);
                            if (isNaN(num)) return;
                            // Debounce ANY rapid re-write to the same equip|label (phantom double-clicks
                            // would read the already-optimistically-updated boolVal and toggle it back).
                            window._lastWriteSig = window._lastWriteSig || {};
                            const dbKey = `${showAhuModalFor}|${label}`;
                            const now = Date.now();
                            if (window._lastWriteSig[dbKey] && now - window._lastWriteSig[dbKey] < 300) return;
                            window._lastWriteSig[dbKey] = now;
                            // Mark as pending for 4s so background polls don't flip it back
                            window._pendingWrites = window._pendingWrites || {};
                            window._pendingWrites[dbKey] = { value: num, ts: now };
                            _setForceApTick(t => t + 1);
                            // Optimistic update
                            setAhuData(prev => prev.map(a => {
                                if (a.id !== showAhuModalFor) return a;
                                return { ...a, all_points: { ...(a.all_points || {}), [label]: num } };
                            }));
                            fetch(`${API_URL}/api/write-point`, {
                                method: 'POST',
                                credentials: 'include',
                                headers: {'Content-Type':'application/json'},
                                body: JSON.stringify({ equipment_name: showAhuModalFor, writes: { [label]: num } })
                            }).then(r => r.json()).then(d => {
                                if (!d.success) console.warn('Write failed:', d.error);
                                if (typeof window._refetchTelemetry === 'function') window._refetchTelemetry();
                            }).catch(e => console.warn('Write error:', e));
                        };

                        // RW editable input
                        const RWInput = ({label, val, unit, color}) => (
                            <div className="flex justify-between items-center">
                                <span className={`text-[9px] font-bold ${labelCls}`}>{label}</span>
                                <div className="flex items-center gap-0.5">
                                    <input type="number" step="0.1" defaultValue={val} className="rw-input" style={{color: color || (dk ? '#22d3ee' : '#0891b2')}}
                                        onKeyDown={e => { if (e.key === 'Enter') { writeRW(label, e.target.value); e.target.blur(); } }}
                                        onBlur={e => writeRW(label, e.target.value)} />
                                    <span className={`text-[8px] ${labelCls}`}>{unit||''}</span>
                                </div>
                            </div>
                        );

                        // RW toggle (click to toggle 0/1)
                        const RWToggle = ({label, on}) => (
                            <div className="flex justify-between items-center cursor-pointer" onClick={() => writeRW(label, on ? 0 : 1)}>
                                <span className={`text-[9px] font-bold ${labelCls}`}>{label}</span>
                                <span className={`${toggleCls(on)} cursor-pointer hover:ring-2 hover:ring-cyan-400/50`}></span>
                            </div>
                        );

                        // Determine active strategies from band or point data
                        const ccActive = ap.HCV > 5 || ap.PCV > 5 || (targetAhu?.active_band?.cc_mode && targetAhu.active_band.cc_mode !== 'OFF');
                        const hcActive = ap.HV > 5 || (targetAhu?.active_band?.hc_mode && targetAhu.active_band.hc_mode !== 'OFF' && targetAhu.active_band.hc_mode !== 'REHEAT');
                        const fanRunning = isBool('INV1_STATUS') || isBool('INV2_STATUS') || vn('INV1_F') > 0 || vn('INV2_F') > 0;
                        const fanSpeed = Math.max(vn('INV1_F'), vn('INV2_F'));
                        const oaTemp = vn('OAT');
                        const saTemp = vn('SAT');
                        const isFreeze = oaTemp < 2;
                        const isHeating = hcActive || oaTemp < 15;

                        // Default airflow segments for AHU duct visualization
                        const DEFAULT_WAVY = "M 10 50 C 30 20, 70 80, 90 50";
                        const oaSegments = [
                            { id: 'oa1', type: 'OA', offsetX: 0, offsetY: 0, scale: 1.0, stretchX: 1.2, stretchY: 1.0, rotX: 0, rotY: 0, rotZ: 0, skewX: 0, skewY: 0, path: DEFAULT_WAVY },
                            { id: 'oa2', type: 'OA', offsetX: 0, offsetY: 15, scale: 0.9, stretchX: 1.1, stretchY: 1.0, rotX: 0, rotY: 0, rotZ: 0, skewX: 0, skewY: 0, path: DEFAULT_WAVY },
                        ];
                        const saSegments = [
                            { id: 'sa1', type: 'SA', offsetX: 0, offsetY: 0, scale: 1.0, stretchX: 1.2, stretchY: 1.0, rotX: 0, rotY: 0, rotZ: 90, skewX: 0, skewY: 0, path: DEFAULT_WAVY },
                            { id: 'sa2', type: 'SA', offsetX: 0, offsetY: 18, scale: 0.9, stretchX: 1.0, stretchY: 1.0, rotX: 0, rotY: 0, rotZ: 90, skewX: 0, skewY: 0, path: DEFAULT_WAVY },
                            { id: 'sa3', type: 'SA', offsetX: 0, offsetY: 36, scale: 0.85, stretchX: 1.0, stretchY: 1.0, rotX: 0, rotY: 0, rotZ: 90, skewX: 0, skewY: 0, path: DEFAULT_WAVY },
                        ];
                        const ductSegments = [
                            { id: 'duct1', type: hcActive ? 'OA' : ccActive ? 'SA' : 'RA', offsetX: 0, offsetY: 0, scale: 0.8, stretchX: 2.0, stretchY: 0.8, rotX: 0, rotY: 0, rotZ: 0, skewX: 0, skewY: 0, path: DEFAULT_WAVY },
                        ];

                        // === Schema-driven layout (mirrors Config Tool's equipment_mapper.html) ===
                        const schemaPoints = (schemaType && schemaType.points) || [];
                        const schemaAnimations = (schemaType && schemaType.visual_assets && schemaType.visual_assets.animations) || [];

                        // Group points identically to Config Tool groupedPoints useMemo
                        const SENSOR_GROUPS = [
                            { id: 'OA', defaultName: 'OA', match: ['OAT','OAH','OAD'] },
                            { id: 'SA', defaultName: 'SA', match: ['SAT','SAH','SAF','SAD','SAFM','SAPT','SATSP'], matchRegex: /^INV\d+_F$/ },
                            { id: 'Hydration', defaultName: 'Hydration', match: ['HM','HV','HSP'] },
                            { id: 'AHU', defaultName: 'AHU', match: ['AHUSS','AHUM','HCM'] },
                            { id: 'Static_Pressure', defaultName: 'Static Pressure', match: ['SPR','SPRSP'] }
                        ];
                        const groupedPoints = [];
                        {
                            const processed = new Set();
                            // Treat a point as "co-located" with the group's
                            // first candidate when both x and y match within
                            // 0.5 percentage units.  This lets the operator
                            // BREAK A POINT OUT of its hardcoded group simply
                            // by dragging it to a different location in the
                            // mapper — e.g., placing SAFM as a standalone
                            // toggle near the fan instead of inside the SA
                            // databox.  Without this guard, every label that
                            // matches a hardcoded group would be force-merged
                            // into that group regardless of where the operator
                            // placed it.
                            const POS_EPS = 0.5;
                            SENSOR_GROUPS.forEach(g => {
                                // Collect ALL label/regex matches first.
                                const candidates = [];
                                schemaPoints.forEach((p, i) => {
                                    if (processed.has(i)) return;
                                    if (g.match.includes(p.label) || (g.matchRegex && g.matchRegex.test(p.label))) {
                                        candidates.push(i);
                                    }
                                });
                                if (candidates.length === 0) return;
                                // Only points co-located with the first
                                // candidate join the group; the rest fall
                                // through to PHASE 2 as standalone pills.
                                const anchor = schemaPoints[candidates[0]];
                                const groupIndices = candidates.filter(i => {
                                    const p = schemaPoints[i];
                                    return p.x != null && p.y != null
                                        && anchor.x != null && anchor.y != null
                                        && Math.abs(p.x - anchor.x) < POS_EPS
                                        && Math.abs(p.y - anchor.y) < POS_EPS;
                                });
                                if (groupIndices.length === 0) return;
                                groupIndices.forEach(i => processed.add(i));
                                const firstPt = schemaPoints[groupIndices[0]];
                                groupedPoints.push({
                                    isGroup: true, groupId: g.id, defaultName: g.defaultName,
                                    indices: groupIndices, points: groupIndices.map(i => schemaPoints[i]),
                                    x: firstPt.x, y: firstPt.y, scale: firstPt.scale || 1.0,
                                    name: (firstPt.name && firstPt.name !== firstPt.label) ? firstPt.name : g.defaultName
                                });
                            });
                            schemaPoints.forEach((p, i) => {
                                if (!processed.has(i)) {
                                    groupedPoints.push({
                                        isGroup: false, groupId: p.label, defaultName: p.label,
                                        indices: [i], points: [p],
                                        x: p.x, y: p.y, scale: p.scale || 1.0,
                                        name: (p.name && p.name !== p.label) ? p.name : p.label
                                    });
                                }
                            });
                        }

                        const BOOL_LABELS = new Set(['AHUM','AHUSS','HCM','SAFM','HM']);
                        const isBoolPoint = (p) => (p.type === 'bool') || (p.unit === '') && BOOL_LABELS.has(p.label) || BOOL_LABELS.has(p.label) || /(_STATUS|_ALM|_SST|_M)$/.test(p.label);

                        // Scale animations' pixel-based offsets/sizes relative to how the image is rendered
                        // vs its natural size, so absolute pixel offsets in segments/animations
                        // translate correctly to the displayed image space.
                        const imgScale = (ahuImgDims.dispW && ahuImgDims.natW) ? (ahuImgDims.dispW / ahuImgDims.natW) : 1;

                        // When popped out into a separate window, the modal
                        // fills the popup viewport and is no longer
                        // draggable/resizable from the docked overlay
                        // (the OS window chrome handles both natively).
                        const isPopped = !!(ahuModalPopupWin && ahuModalPopupHost);
                        const isPip = !!(isPopped && ahuModalPopupWin.__red5IsPip);
                        const pipOk = typeof red5PipSupported === 'function' && red5PipSupported();
                        const outerStyle = isPopped
                            ? { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }
                            : { top: `${safe(ahuModalOffset.y)}px`, left: `${safe(ahuModalOffset.x)}px` };
                        const outerCls = isPopped
                            ? 'block select-none'
                            : 'absolute z-[130] select-none shadow-2xl drop-shadow-2xl';
                        const innerStyle = isPopped
                            ? { width: '100vw', height: '100vh', maxWidth: 'none', maxHeight: 'none' }
                            : { width: `${ahuModalSize.w}px`, height: `${ahuModalSize.h}px`, maxWidth: '98vw', maxHeight: '95vh', resize: 'both' };

                        const modalTree = (
                            <div className={outerCls} style={outerStyle}>
                                <div ref={ahuOuterRef} className={`${dk ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-[#e2e5e8] border-white/20 text-slate-800'} ${isPopped ? '' : 'rounded-xl border-2'} shadow-2xl relative flex flex-col overflow-hidden`} style={innerStyle} onMouseDown={e => e.stopPropagation()}>

                                    <div className={`cursor-grab active:cursor-grabbing ${dk ? 'bg-slate-900 border-slate-800' : 'bg-slate-300/60 border-slate-300'} backdrop-blur-md border-b p-2.5 flex justify-between items-center z-[60]`} onMouseDown={(e) => { if (ahuModalPopupWin) return; setIsAhuModalDragging(true); setDragStart({ x: e.clientX - ahuModalOffset.x, y: e.clientY - ahuModalOffset.y }); }}>
                                        <h3 className={`text-sm font-black tracking-widest ml-2 ${dk ? 'text-slate-300' : 'text-slate-700'}`}>{showAhuModalFor} EQUIPMENT DIAGRAM <span style={{color:'#64748b', fontSize:'10px', marginLeft:'8px', fontWeight:'normal'}}>{isPopped ? (isPip ? 'Drag the float box across monitors' : 'Resize the popped-out window directly') : 'Drag corner ↘ to resize'}</span></h3>
                                        <div className="flex items-center gap-2 mr-1" onMouseDown={e => e.stopPropagation()}>
                                            <button
                                                data-testid="qr-phone-preview-btn"
                                                onClick={() => { if (typeof window.openQrPhonePreview === 'function') window.openQrPhonePreview('ahu', showAhuModalFor); }}
                                                title="Show phone-preview QR code for this AHU"
                                                className={`px-2 py-0.5 border rounded text-[8px] font-black uppercase tracking-wider transition-all ${dk ? 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-amber-500 hover:text-amber-300' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-amber-500 hover:text-amber-600'}`}
                                            >
                                                {'\u2316 QR'}
                                            </button>
                                            <button
                                                data-testid="popout-ahu-modal-btn"
                                                onClick={() => {
                                                    if (ahuModalPopupWin && !ahuModalPopupWin.closed && !ahuModalPopupWin.__red5IsPip) {
                                                        ahuModalPopupWin.close();
                                                    } else {
                                                        popOutAhuModal();
                                                    }
                                                }}
                                                title={isPopped && !isPip ? 'Re-attach modal to this window' : 'Pop out into a browser window (move to another monitor)'}
                                                className={`px-2 py-0.5 border rounded text-[8px] font-black uppercase tracking-wider transition-all ${isPopped && !isPip ? 'bg-emerald-700 border-emerald-400 text-slate-100 hover:bg-emerald-600' : (dk ? 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-cyan-500 hover:text-cyan-300' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-cyan-500 hover:text-cyan-600')}`}
                                            >
                                                {isPopped && !isPip ? '\u21A9 ATTACH' : '\u2197 POP OUT'}
                                            </button>
                                            {pipOk && (
                                            <button
                                                data-testid="pip-ahu-modal-btn"
                                                onClick={() => {
                                                    if (ahuModalPopupWin && !ahuModalPopupWin.closed && ahuModalPopupWin.__red5IsPip) {
                                                        ahuModalPopupWin.close();
                                                    } else if (typeof floatPipAhuModal === 'function') {
                                                        floatPipAhuModal();
                                                    }
                                                }}
                                                title={isPip ? 'Re-attach float box to this window' : 'Float as a minimal always-on-top box (Chrome/Edge PiP)'}
                                                className={`px-2 py-0.5 border rounded text-[8px] font-black uppercase tracking-wider transition-all ${isPip ? 'bg-violet-700 border-violet-400 text-slate-100 hover:bg-violet-600' : (dk ? 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-violet-500 hover:text-violet-300' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-violet-500 hover:text-violet-600')}`}
                                            >
                                                {isPip ? '\u21A9 ATTACH' : '\u25A3 FLOAT'}
                                            </button>
                                            )}
                                            <button className={`${dk ? 'text-slate-400 hover:text-slate-100' : 'text-slate-500 hover:text-slate-800'} transition-colors cursor-pointer`} onClick={() => setShowAhuModalFor(null)}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div ref={ahuBodyRef} className={`red5-graphic-zone relative w-full flex-1 ${dk ? 'bg-[#d0d4d8]' : 'bg-[#d8dce0]'} overflow-hidden flex items-center justify-center p-2`}
                                         onMouseDown={(e) => {
                                             /* Click outside collapses the band-guide focus zoom. */
                                             const guide = e.currentTarget.querySelector('[data-testid^="ahu-modal-band-"]');
                                             if (!guide || guide.contains(e.target)) return;
                                             const active = (guide.ownerDocument && guide.ownerDocument.activeElement) || null;
                                             if (active === guide) guide.blur();
                                             if (typeof setAhuBandGuideZoomed === 'function') setAhuBandGuideZoomed(false);
                                         }}>
                                        {/* Band-status overlay (Phase L.44, 2026-06-27).
                                            Permanently visible transparent panel showing
                                            the current B1-B10 classification of this
                                            AHU's outdoor-air sample, plus the plain-language
                                            description of what the AHU should be doing.
                                            Pinned to the top-right of the equipment graphic
                                            zone so it doesn't cover the AHU components but
                                            stays in the operator's line of sight.
                                            Click focuses → 2× for reading; blur / click-outside → original size.
                                            Mac-only oversize: WebKit/Blink on Retina often double-paints
                                            backdrop-filter + transform:scale. Enlarge with CSS zoom and
                                            drop blur while focused instead. */}
                                        {(() => {
                                            // Band guide: live OAT/OAH + psychrometric veto vs RA.
                                            // Never trust stale active_band for the climate story.
                                            const ap = targetAhu && targetAhu.all_points;
                                            const pts = targetAhu && targetAhu.points;
                                            const oaPt = pts && pts[0];
                                            const raPt = pts && pts.find(p => p && (p.label === 'RA' || p.label === 'Return'));
                                            const oaTnum = (ap && Number.isFinite(Number(ap.OAT)))
                                                ? Number(ap.OAT)
                                                : (oaPt ? Number(oaPt.t) : NaN);
                                            const oaRnum = (ap && Number.isFinite(Number(ap.OAH)))
                                                ? Number(ap.OAH)
                                                : (oaPt ? Number(oaPt.rh) : NaN);
                                            const raTnum = (ap && Number.isFinite(Number(ap.RAT)))
                                                ? Number(ap.RAT)
                                                : (raPt ? Number(raPt.t) : NaN);
                                            const raRnum = (ap && Number.isFinite(Number(ap.RAH)))
                                                ? Number(ap.RAH)
                                                : (raPt ? Number(raPt.rh) : NaN);
                                            const adv = (Number.isFinite(oaTnum) && Number.isFinite(oaRnum))
                                                ? bandAdvise(oaTnum, oaRnum, raTnum, raRnum)
                                                : { id: '?', exact: false, oad: 15, veto: null,
                                                    weather: bandStory('?').weather,
                                                    plan: bandStory('?').plan,
                                                    set: bandStory('?').set };
                                            const ab = targetAhu && targetAhu.active_band;
                                            const band = adv.id;
                                            const exact = !!adv.exact;
                                            const disagree = !!(ab && ab.id && adv.id && ab.id !== adv.id);
                                            const oaT = Number.isFinite(oaTnum) ? oaTnum.toFixed(1) + ' \u00B0C' : '--';
                                            const oaR = Number.isFinite(oaRnum) ? oaRnum.toFixed(0) + ' % RH' : '--';
                                            const badgeCls = bandTint(band);
                                            const setLine = adv.set;
                                            const panelBg = dk
                                                ? 'bg-slate-900/30 border-slate-500/40 text-slate-100'
                                                : 'bg-white/35 border-slate-400/40 text-slate-900';
                                            return (
                                                <div data-testid={`ahu-modal-band-${showAhuModalFor}`}
                                                     key={`ahu-modal-band-${showAhuModalFor}`}
                                                     tabIndex={0}
                                                     title="Click to enlarge · click away to shrink"
                                                     className={`absolute top-2 right-2 z-40 px-2.5 py-1.5 rounded-lg border shadow-md max-w-[260px] cursor-pointer outline-none focus:border-sky-400 focus:shadow-lg ${bandGuideZoomed ? '' : 'backdrop-blur-lg'} ${panelBg}`}
                                                     style={{
                                                         fontSize: '9px',
                                                         lineHeight: 1.4,
                                                         /* CSS zoom (not transform:scale): scales badges/text
                                                            without the Mac Retina backdrop-filter double paint. */
                                                         zoom: bandGuideZoomed ? 2 : 1,
                                                         zIndex: bandGuideZoomed ? 55 : 40,
                                                         maxHeight: bandGuideZoomed ? '42vh' : undefined,
                                                         overflowY: bandGuideZoomed ? 'auto' : undefined,
                                                         /* Solid enough while zoomed so we can drop blur. */
                                                         backgroundColor: bandGuideZoomed
                                                             ? (dk ? 'rgba(15,23,42,0.92)' : 'rgba(255,255,255,0.92)')
                                                             : undefined,
                                                         transformOrigin: 'top right',
                                                     }}
                                                     onMouseDown={(e) => e.stopPropagation()}
                                                     onClick={(e) => {
                                                         e.stopPropagation();
                                                         e.currentTarget.focus();
                                                         if (typeof setAhuBandGuideZoomed === 'function') setAhuBandGuideZoomed(true);
                                                     }}
                                                     onFocus={() => {
                                                         if (typeof setAhuBandGuideZoomed === 'function') setAhuBandGuideZoomed(true);
                                                     }}
                                                     onBlur={(e) => {
                                                         if (e.currentTarget.contains(e.relatedTarget)) return;
                                                         if (typeof setAhuBandGuideZoomed === 'function') setAhuBandGuideZoomed(false);
                                                     }}
                                                >
                                                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                                        <span className={`shrink-0 px-1 py-0.5 rounded border leading-none font-black tracking-wider font-mono text-[8px] ${badgeCls}`}>
                                                            {band}
                                                        </span>
                                                        {!exact && band !== '?' && (
                                                            <span className="shrink-0 px-1 py-0.5 rounded border border-amber-500/60 text-amber-300 bg-amber-500/15 leading-none font-black tracking-wider font-mono text-[7px]"
                                                                  title="OA is outside every band window — nearest T-compatible non-economizer edge used">
                                                                NEAREST
                                                            </span>
                                                        )}
                                                        {adv.veto && (
                                                            <span className="shrink-0 px-1 py-0.5 rounded border border-fuchsia-500/60 text-fuchsia-300 bg-fuchsia-500/15 leading-none font-black tracking-wider font-mono text-[7px]"
                                                                  title={`W_oa ${adv.veto.w_oa.toFixed(1)} > W_ra ${adv.veto.w_ra.toFixed(1)} g/kg — economizer blocked`}>
                                                                PSY VETO
                                                            </span>
                                                        )}
                                                        {disagree && (
                                                            <span className="shrink-0 px-1 py-0.5 rounded border border-rose-500/60 text-rose-300 bg-rose-500/15 leading-none font-black tracking-wider font-mono text-[7px]"
                                                                  title={`Telemetry active_band=${ab.id} vs live OA classify=${adv.id}`}>
                                                                MISMATCH
                                                            </span>
                                                        )}
                                                        <span className="font-bold uppercase tracking-[0.12em] text-[7px] opacity-70">
                                                            OA-band &middot; {oaT} / {oaR}
                                                        </span>
                                                    </div>
                                                    <div className="mb-1">
                                                        <div className="text-[7px] uppercase font-bold opacity-60 tracking-wider">Outside</div>
                                                        <div>{adv.weather}</div>
                                                    </div>
                                                    <div className="mb-1">
                                                        <div className="text-[7px] uppercase font-bold opacity-60 tracking-wider">What the AHU does</div>
                                                        <div>{adv.plan}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[7px] uppercase font-bold opacity-60 tracking-wider">Setpoints</div>
                                                        <div className="font-mono text-[8px]">{setLine}</div>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                        {!currentAhuImage ? (
                                            <div className="flex flex-col items-center justify-center font-bold text-center font-mono text-[10px] w-full h-full">
                                                <span className="mb-2 uppercase tracking-widest text-red-600 text-lg">{window.t ? window.t("ahu_image_missing") : "AHU IMAGE MISSING"}</span>
                                                <span className="text-xs">Upload: ahu_type_{ahuTypeId || 'N'}.jpg</span>
                                            </div>
                                        ) : (
                                        <div className="relative pointer-events-auto shadow-[0_0_50px_rgba(0,0,0,0.15)]"
                                             style={{
                                               perspective: '1500px',
                                               display: 'grid',
                                               gridTemplateColumns: '1fr',
                                               gridTemplateRows: '1fr',
                                               maxWidth: '100%',
                                               maxHeight: '100%',
                                               /* Image is the size-source.  Setting both maxW + maxH lets it
                                                  scale-to-fit the body in BOTH dimensions; the grid cell
                                                  collapses to the image's rendered size, and every overlay
                                                  layer below shares the same cell via gridArea:'1/1' so
                                                  percentage coords ALWAYS land on the right pixel. */
                                             }}>
                                            <img ref={ahuImgRef} src={currentAhuImage} alt="AHU"
                                                 className="block pointer-events-none"
                                                 style={{ gridArea: '1 / 1', maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', display: 'block' }}
                                                 onLoad={(e) => { const im = e.target; setAhuImgDims({ natW: im.naturalWidth || 1600, natH: im.naturalHeight || 700, dispW: im.offsetWidth, dispH: im.offsetHeight }); }} />
                                            <div className="relative pointer-events-none" style={{ gridArea: '1 / 1', perspective: '1500px' }}>

                                        {/* === SCHEMA-DRIVEN OVERLAYS (mirrors Config Tool groupedPoints renderer) === */}
                                        {groupedPoints.map((grp, gi) => {
                                            if (grp.x == null || grp.y == null) return null;
                                            const gScale = grp.scale || 1.0;
                                            const hasRW = grp.points.some(p => p.access === 'RW');
                                            const displayName = grp.name;

                                            // renderValueControl — mirrors equipment_mapper.html renderValueControl
                                            const renderValueControl = (p) => {
                                                const minVal = parseFloat(p.min);
                                                const maxVal = parseFloat(p.max);
                                                const isDigital = minVal === 0 && maxVal === 1;
                                                const isRW = p.access === 'RW';
                                                const rawVal = ap[p.label];
                                                const numVal = typeof rawVal === 'number' ? rawVal : (rawVal != null ? parseFloat(rawVal) || 0 : 0);
                                                const boolVal = rawVal === 1 || rawVal === true || rawVal === '1';

                                                if (isDigital) {
                                                    if (isRW) {
                                                        return (
                                                            <button type="button" className="relative inline-flex items-center cursor-pointer pointer-events-auto bg-transparent border-0 p-0 select-none" onClick={e => { e.stopPropagation(); e.preventDefault(); writeRW(p.label, boolVal ? 0 : 1); }} onMouseDown={e => e.preventDefault()}>
                                                                <div className={`w-7 h-4 rounded-full shadow-inner relative ${boolVal ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                                                                    <div className={`absolute top-[2px] bg-white border-slate-300 border rounded-full h-3 w-3 transition-all ${boolVal ? 'left-[14px]' : 'left-[2px]'}`}></div>
                                                                </div>
                                                            </button>
                                                        );
                                                    }
                                                    return <div className={`px-1.5 py-0.5 rounded text-[7px] font-black border uppercase tracking-widest ${boolVal ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-slate-700/20 text-slate-500 border-slate-600/50'}`}>{boolVal ? 'ON' : 'OFF'}</div>;
                                                }
                                                // Analog
                                                if (isRW) {
                                                    const step = 0.1;
                                                    const inpId = `ahu_inp_${p.label}`;
                                                    const readCur = () => {
                                                        const el = document.getElementById(inpId);
                                                        const v = el ? parseFloat(el.value) : numVal;
                                                        return isNaN(v) ? numVal : v;
                                                    };
                                                    const bump = (delta) => {
                                                        const nv = +(readCur() + delta).toFixed(3);
                                                        const el = document.getElementById(inpId);
                                                        if (el) el.value = nv.toFixed(1);
                                                        writeRW(p.label, nv);
                                                    };
                                                    return (
                                                        <div className="flex items-center gap-1 pointer-events-auto">
                                                            <button type="button" onClick={e => { e.stopPropagation(); bump(-step); }} className="w-5 h-5 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 rounded text-slate-100 text-sm font-black flex items-center justify-center transition-colors select-none">−</button>
                                                            <input id={inpId} type="text" inputMode="decimal" defaultValue={numVal.toFixed(1)} onKeyDown={e => { if (e.key === 'Enter') { writeRW(p.label, e.target.value); e.target.blur(); } }} onBlur={e => writeRW(p.label, e.target.value)} onClick={e => e.stopPropagation()} className="no-spinner w-12 bg-slate-900 border border-slate-600 rounded px-1 py-0.5 text-emerald-400 font-mono text-[10px] font-black text-right outline-none focus:border-emerald-500" />
                                                            <button type="button" onClick={e => { e.stopPropagation(); bump(+step); }} className="w-5 h-5 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 rounded text-slate-100 text-sm font-black flex items-center justify-center transition-colors select-none">+</button>
                                                            {p.unit && <span className="text-[7px] font-black text-slate-400">{p.unit}</span>}
                                                        </div>
                                                    );
                                                }
                                                return <div className="font-mono text-[10px] font-black text-emerald-400 whitespace-nowrap">{numVal.toFixed(1)} {p.unit && <span className="text-[8px] text-slate-400 ml-0.5">{p.unit}</span>}</div>;
                                            };

                                            return (
                                                <div key={`grp_${gi}`} className="absolute z-20" style={{left:`${grp.x}%`,top:`${grp.y}%`,transform:`translate(-50%,-50%) scale(${gScale * Math.max(0.8, Math.min(1, imgScale))})`,transformOrigin:'center center'}}>
                                                    {hasRW ? (
                                                        // RW DATABOX — amber-bordered rectangular
                                                        <div className="flex flex-col bg-slate-950/95 border border-amber-700/60 rounded shadow-xl backdrop-blur-md min-w-[150px]">
                                                            <div className="flex items-center justify-between px-2 py-1 border-b border-amber-800/40">
                                                                <div className="flex items-center gap-1.5">
                                                                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-amber-400 shadow-[0_0_6px_#f59e0b]"></div>
                                                                    <span className="font-mono text-[8px] font-black uppercase tracking-widest text-amber-300 whitespace-nowrap">{displayName}</span>
                                                                </div>
                                                                <span className="text-[6px] font-black text-amber-500/70 uppercase tracking-widest">RW</span>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                {grp.points.map((p, pIdx) => (
                                                                    <div key={`db-${p.label}-${pIdx}`} className={`flex items-center justify-between px-2 py-0.5 ${pIdx > 0 ? 'border-t border-slate-800/40' : ''}`}>
                                                                        <span className={`text-[7px] font-black uppercase tracking-wider ${p.access === 'RW' ? 'text-amber-400' : 'text-slate-500'}`}>{p.label}</span>
                                                                        <div className="flex items-center">{renderValueControl(p)}</div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : grp.isGroup ? (
                                                        // RO GROUP PILL — rounded-xl with emerald dot + values wrapped
                                                        <div className="flex flex-col gap-1 px-3 py-1.5 bg-slate-900/90 border border-slate-700 rounded-xl shadow-xl backdrop-blur-md items-center">
                                                            <div className="flex items-center justify-center gap-1.5 w-full border-b border-slate-700/50 pb-0.5 mb-0.5">
                                                                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                                                                <span className="font-mono text-[9px] font-black uppercase tracking-widest text-slate-100 whitespace-nowrap">{displayName}</span>
                                                            </div>
                                                            <div className="flex flex-row flex-wrap gap-x-2 gap-y-1 justify-center max-w-[280px]">
                                                                {grp.points.map((p, pIdx) => (
                                                                    <div key={`comp-${p.label}-${pIdx}`} className="flex items-center">{renderValueControl(p)}</div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        // RO SINGLE PILL — rounded-full
                                                        <div className="flex flex-row gap-2 px-2.5 py-1 bg-slate-900/90 border border-slate-700 rounded-full shadow-xl backdrop-blur-md items-center">
                                                            <div className="w-2 h-2 rounded-full flex-shrink-0 bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                                                            {renderValueControl(grp.points[0])}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}

                                        {/* === SCHEMA-DRIVEN ANIMATIONS === */}
                                        <div className="absolute inset-0 pointer-events-none" style={{perspective:'1500px'}}>
                                        {schemaAnimations.map((a, ai) => {
                                            if (a.x == null || a.y == null) return null;
                                            // Sensible per-type defaults so an animation lights up
                                            // even when the operator hasn't bound a telemetry_key
                                            // yet in the mapper.  The bound `a.telemetry_key`
                                            // always wins; this only fires when it is empty/missing.
                                            const _atype0 = a.animation_type;
                                            const _defaultKey = (
                                                _atype0 === 'centrifugal_fan'        ? 'SAFP' :
                                                _atype0 === 'rectangular_fan'        ? 'EAFP' :
                                                _atype0 === 'rectangular_fan_aligner'? 'EAFP' :
                                                _atype0 === 'damper'                 ? 'OAD'  :
                                                _atype0 === 'circular_damper'        ? 'OAD'  :
                                                _atype0 === 'neon_pipe_coil'         ? (a.element_id && /heat/i.test(a.element_id) ? 'HCV' : 'CCV') :
                                                _atype0 === 'hydration_valve'        ? 'HUM'  :
                                                _atype0 === 'hydration_valve_aligner'? 'HUM'  :
                                                _atype0 === 'antifreeze_coil_valve'  ? 'HCV'  :
                                                _atype0 === 'antifreeze_coil'        ? 'HCV'  :
                                                _atype0 === 'diff_pressure_switch'   ? 'FDPS' :
                                                _atype0 === 'differential_pressure_switch_aligner' ? 'FDPS' :
                                                _atype0 === 'vfd_aligner'            ? 'SAFP' :
                                                _atype0 === 'air_flow_path'          ? 'SAFP' : ''
                                            );
                                            const tKey = (a.telemetry_key && a.telemetry_key !== 'UNKNOWN') ? a.telemetry_key : _defaultKey;
                                            const tVal = vn(tKey);
                                            const isAlarm = isBool(tKey + '_ALM');
                                            const isRunning = isBool(tKey + '_STATUS') || tVal > 0;
                                            const isAuto = isBool(tKey + '_SST');
                                            const isHeatingMode = a.element_id && a.element_id.toLowerCase().includes('heat');
                                            const atype = a.animation_type;

                                            if (atype === 'vfd_aligner') {
                                                const chassisW = a.base_w || 220, chassisH = a.base_h || 300;
                                                const screenW = a.screen_w || 140, screenH = a.screen_h || 85;
                                                const pillW = a.pill_w || 100, pillH = a.pill_h || 32;
                                                const hz = tVal;
                                                const amps = (hz / 60) * 8.5;
                                                // Apply imgScale (clamped 0.7..1.0) so the VFD chassis starts at
                                                // its original size and shrinks DOWN to 70% of original as the
                                                // modal image gets smaller.  Subtle oblique-projection rotation
                                                // gives the flat chassis/photo a 3D "tilted-toward-operator" feel.
                                                // Schema-supplied rotX/rotY/rotZ override the defaults so operators
                                                // can flatten or tilt further.
                                                const vfdScale = (a.scale ?? 1.0) * Math.max(0.7, Math.min(1, imgScale));
                                                const vfdRotY  = (a.rotY != null) ? a.rotY : -8;
                                                const vfdRotX  = (a.rotX != null) ? a.rotX :  3;
                                                const vfdRotZ  = (a.rotZ != null) ? a.rotZ :  0;
                                                return (
                                                    <div key={`anim_${ai}`} className="absolute z-20" style={{left:`${a.x}%`, top:`${a.y}%`, transform:`perspective(1200px) scale(${vfdScale}) rotateY(${vfdRotY}deg) rotateX(${vfdRotX}deg) rotateZ(${vfdRotZ}deg)`, transformStyle:'preserve-3d'}}>
                                                        <div className="relative w-0 h-0" style={{transformStyle:'preserve-3d'}}>
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

                                            if (atype === 'air_flow_path' && typeof PreviewAirFlowSimulator !== 'undefined') {
                                                return (
                                                    <div key={`anim_${ai}`} className="absolute z-10" style={{left:`${a.x}%`, top:`${a.y}%`, pointerEvents:'none'}}>
                                                        <PreviewAirFlowSimulator segments={a.segments || []} fanSpeed={fanSpeed} isActive={fanRunning} antiFreeze={isFreeze} heating={isHeatingMode} oat={oaTemp} sat={saTemp} allSensors={schemaPoints} containerW={ahuImgDims.dispW} naturalW={ahuImgDims.natW} />
                                                    </div>
                                                );
                                            }

                                            const wPx = a.base_w || 150, hPx = a.base_h || 150;
                                            // Aligners + generic animations: start at the schema's scale and
                                            // shrink down to 70 % of original as the modal image gets smaller
                                            // (matches the VFD + pill clamps so the whole graphic shrinks in
                                            // proportion when the modal is dragged narrower).
                                            const aEffScale = (a.scale||1) * Math.max(0.7, Math.min(1, imgScale));
                                            const transformStyle = `scale(${aEffScale}) scaleX(${a.stretchX||1}) scaleY(${a.stretchY||1}) skewX(${a.skewX||0}deg) skewY(${a.skewY||0}deg) rotateX(${a.rotX||0}deg) rotateY(${a.rotY||0}deg) rotateZ(${a.rotZ||0}deg)`;
                                            const isSplitDP = atype === 'diff_pressure_switch';
                                            const sX = a.sensor_x != null ? a.sensor_x : a.x;
                                            const sY = a.sensor_y != null ? a.sensor_y : a.y - 20;
                                            const sScale = a.sensor_scale != null ? a.sensor_scale : 0.8;
                                            // Decoupled M|R/S pill for centrifugal_fan — mirrors the mapper's
                                            // "DECOUPLED PILL BODY (For Fans)" block (equipment_mapper.html
                                            // ~line 4840).  Driven by real telemetry (isAuto / isRunning /
                                            // isAlarm) instead of the mapper's simulator state.  Position is
                                            // independent of the fan body (a.pill_x / a.pill_y in the schema)
                                            // so the operator can place the toggle wherever it reads best.
                                            const hasFanPill = atype === 'centrifugal_fan';
                                            const pX = a.pill_x != null ? a.pill_x : a.x;
                                            const pY = a.pill_y != null ? a.pill_y : a.y + 10;
                                            const pScale = a.pill_scale != null ? a.pill_scale : 1.0;
                                            const fanOn = isRunning && !isAlarm;
                                            return (
                                                <React.Fragment key={`anim_frag_${ai}`}>
                                                <div key={`anim_${ai}`} className="absolute z-20" style={{left:`${a.x}%`,top:`${a.y}%`,width:wPx+'px',height:hPx+'px',marginLeft:`-${wPx/2}px`,marginTop:`-${hPx/2}px`,transform:transformStyle,transformStyle:'preserve-3d'}}>
                                                    <div className="absolute inset-0 flex items-center justify-center" style={{transformStyle:'preserve-3d'}}>
                                                        {atype === 'centrifugal_fan' && typeof PreviewCentrifugalFan !== 'undefined' && <PreviewCentrifugalFan outlinePath={a.outline_path} isAuto={isAuto} isManualRunning={!isAuto && isRunning} fanSpeed={tVal} hasFault={isAlarm} isActive={false} />}
                                                        {['rectangular_fan','rectangular_fan_aligner'].includes(atype) && typeof PreviewRectangularFan !== 'undefined' && <PreviewRectangularFan isAuto={isAuto} isManualRunning={!isAuto && isRunning} fanSpeed={tVal} hasFault={isAlarm} />}
                                                        {['hydration_valve','hydration_valve_aligner'].includes(atype) && typeof PreviewHydrationValve !== 'undefined' && <PreviewHydrationValve hydrateLevel={tVal} isHeating={isHeatingMode} width={wPx} height={hPx} rotX={a.rotX||0} rotY={a.rotY||0} rotZ={a.rotZ||0} />}
                                                        {['antifreeze_coil_valve','antifreeze_coil'].includes(atype) && typeof PreviewAntiFreezeCoil !== 'undefined' && <PreviewAntiFreezeCoil activation={tVal} width={wPx} height={hPx} scale={1} stretchX={1} stretchY={1} rotX={a.rotX||0} rotY={a.rotY||0} rotZ={a.rotZ||0} skewX={a.skewX||0} skewY={a.skewY||0} numCoils={a.numCoils||4} isActive={false} />}
                                                        {atype === 'damper' && typeof PreviewDamper !== 'undefined' && <PreviewDamper damperPos={tVal} width={wPx} height={hPx} />}
                                                        {atype === 'circular_damper' && typeof PreviewCircularDamper !== 'undefined' && <PreviewCircularDamper damperPos={tVal} width={wPx} height={hPx} />}
                                                        {atype === 'neon_pipe_coil' && typeof PreviewNeonPipeCoil !== 'undefined' && <PreviewNeonPipeCoil value={tVal} isHeating={isHeatingMode} length={a.pipeLength} thickness={a.pipeThickness} separation={a.separation} />}
                                                        {['diff_pressure_switch','differential_pressure_switch_aligner'].includes(atype) && typeof PreviewPressureSwitchFilter !== 'undefined' && <PreviewPressureSwitchFilter filterLoad={tVal} separation={a.separation} thickness={a.pipeThickness} />}
                                                        {atype === 'dp_sensor_aligner' && typeof PreviewDPSensor !== 'undefined' && <PreviewDPSensor ch1={vn('FDPS')} ch2={vn('AFPC')} ch3={0.0} activeChannel={a.dp_active_channel || 0} />}
                                                        {atype === 'dp_display_aligner' && typeof PreviewDPDisplay !== 'undefined' && <PreviewDPDisplay temp={vn('SAT')} rh={vn('SAH')} dp={vn('FDPS')} vavFlow={vn('SAF')} cavFlow={vn('FMS')} activeRow={a.dp_active_row || 0} />}
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
                                                {/* Centrifugal-fan M | R/S pill (mirrors mapper).  Click-to-toggle
                                                    SAFM (Supply Air Fan Manual mode).  Visual state tracks REAL
                                                    fan telemetry (isRunning && !isAlarm), so the R/S badge shows
                                                    actual inverter state — there's a brief lag while the inverter
                                                    ramps after a write.  The schema can override the write target
                                                    via a.pill_write_target (defaults to SAFM). */}
                                                {hasFanPill && (() => {
                                                    var writeTarget = a.pill_write_target || 'SAFM';
                                                    var hasTarget = ap[writeTarget] !== undefined;
                                                    // Toggle-switch position must reflect the WRITE TARGET's own
                                                    // state (SAFM), not the fan-running state (SAFP).  Earlier
                                                    // versions drove the toggle from `fanOn` -> click wrote SAFM
                                                    // but the switch never moved because SAFP is unrelated to
                                                    // SAFM, so the operator got zero visual feedback even though
                                                    // the SA-panel SAFM toggle did flip.  Mirrors the bool-point
                                                    // renderer at renderValueControl() ~line 4789.
                                                    var rawWrite = ap[writeTarget];
                                                    var manualOn = rawWrite === 1 || rawWrite === true || rawWrite === '1';
                                                    var onClickPill = function(e){
                                                        e.stopPropagation(); e.preventDefault();
                                                        writeRW(writeTarget, manualOn ? 0 : 1);
                                                    };
                                                    return (
                                                        <div data-testid="ahu-fan-pill" className="absolute z-30" style={{left:`${pX}%`, top:`${pY}%`, transform:`translate(-50%,-50%) scale(${pScale})`}}>
                                                            <button type="button"
                                                                onClick={hasTarget ? onClickPill : undefined}
                                                                onMouseDown={e => e.preventDefault()}
                                                                disabled={!hasTarget}
                                                                title={hasTarget ? `Click to toggle ${writeTarget} (currently ${manualOn ? 'ON' : 'OFF'})` : `${writeTarget} not in telemetry`}
                                                                className={`bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border shadow-[0_10px_20px_rgba(0,0,0,0.8)] flex items-center gap-3 select-none border-slate-700 ${hasTarget ? 'pointer-events-auto cursor-pointer hover:border-emerald-400/70 hover:ring-2 hover:ring-emerald-400/30 transition-all' : 'pointer-events-none opacity-70'}`}
                                                                style={{padding:'6px 12px'}}>
                                                                <div className="w-5 h-5 bg-slate-800 rounded-full flex items-center justify-center text-[9px] font-black text-slate-400 pointer-events-none">M</div>
                                                                {/* Toggle switch -- driven by manualOn (the write target's
                                                                    own value) so it visually flips the moment the
                                                                    operator clicks, with one telemetry-poll round-trip
                                                                    for the confirm.  Previously bound to fanOn which is
                                                                    SAFP-derived and never moved. */}
                                                                <div className={`w-9 h-5 rounded-full p-0.5 shadow-inner flex items-center pointer-events-none ${manualOn ? 'bg-emerald-500' : 'bg-slate-800 border border-slate-600'}`}>
                                                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${manualOn ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                                                </div>
                                                                {/* R/S badge -- still tied to fanOn (actual inverter
                                                                    running state) because that's a distinct piece of
                                                                    info: "manual mode is engaged" vs "fan is spinning". */}
                                                                <div className={`text-[10px] font-black w-3 text-center pointer-events-none ${fanOn ? 'text-emerald-400' : 'text-slate-500'}`}>{fanOn ? 'R' : 'S'}</div>
                                                            </button>
                                                        </div>
                                                    );
                                                })()}
                                                </React.Fragment>
                                            );
                                        })}
                                        </div>

                                        {/* === Active Band pill === */}
                                        {/* High-contrast text (dark blue / pale blue) so the BAND identifier
                                            reads cleanly off the amber background in both light & dark modes.
                                            The earlier amber-on-amber palette washed out under glare. */}
                                        {targetAhu && (() => {
                                            const _ap = targetAhu.all_points;
                                            const _oa = targetAhu.points && targetAhu.points[0];
                                            const _t = (_ap && Number.isFinite(Number(_ap.OAT))) ? Number(_ap.OAT) : (_oa ? Number(_oa.t) : NaN);
                                            const _rh = (_ap && Number.isFinite(Number(_ap.OAH))) ? Number(_ap.OAH) : (_oa ? Number(_oa.rh) : NaN);
                                            const _id = (Number.isFinite(_t) && Number.isFinite(_rh))
                                                ? bandClassify(_t, _rh).id
                                                : (targetAhu.active_band && targetAhu.active_band.id);
                                            if (!_id) return null;
                                            return (
                                            <div className={`absolute top-[3%] left-[42%] px-3 py-1 rounded-full border shadow z-30 ${dk?'bg-amber-400 border-amber-500':'bg-amber-100 border-amber-400'}`}>
                                                <span className={`text-[11px] font-black tracking-wide ${dk?'text-blue-950':'text-blue-900'}`}>BAND {_id}</span>
                                            </div>
                                            );
                                        })()}
                                        </div>
                                        </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                        return isPopped
                            ? ReactDOM.createPortal(modalTree, ahuModalPopupHost)
                            : modalTree;
}
