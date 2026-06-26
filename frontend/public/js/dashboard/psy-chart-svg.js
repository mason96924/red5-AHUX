/* ------------------------------------------------------------------
 * dashboard/psy-chart-svg.js -- psychrometric chart container.
 * ------------------------------------------------------------------
 *
 * Extracted from app.js in Phase L.28 (2026-06-24).  This is the
 * dashboard's centrepiece -- 163 lines covering:
 *
 *   * Selected-AHU Info Card overlay (drag-positioned, shows OA/SA/RA
 *     temps + exchange/absorption MetricBars)
 *   * VAV Terminal Hub table overlay (drag-positioned, shows the live
 *     CZ% badge + per-VAV diagnostic rows)
 *   * The main SVG psychrometric chart (defs, grid, Givoni overlay,
 *     AHU/VAV dot scatter, process vectors, draggable indicator)
 *   * Bottom-left legend chip cluster (enthalpy/latent/sensible/
 *     diagnostic colour swatches + weather strip toggle + status
 *     chip + forecast micro-summary)
 *
 * Same function-style pattern as the other dashboard/* modules: ctx
 * destructures the 65 App-scope refs the body needs.  Body is
 * byte-identical to the pre-extraction JSX modulo one block of dedent.
 * ------------------------------------------------------------------ */

function renderPsyChartSvg(ctx) {
    const { width, height, gridWidth, gridHeight, pad, svgRef, T_MIN, T_MAX, invX, getW, x, y, safe, getH, selectedAhuId, setSelectedAhuId, lockedVavId, setLockedVavId, isLockedToSA, setIsLockedToSA, showPath, setShowPath, pointVisibility, setPointVisibility, cardOffset, setIsCardDragging, setDragStart, setIsVavDragging, vavTableOffset, vavCfm, setVavCfm, setSelectedVavForModal, indicatorPos, isProcessVisible, setIsProcessVisible, setIsDraggingIndicator, vecVis, setVecVis, ahuData, ahuMetrics, comfortZonePoly, sweetSpotRange, showGivoni, showSweetSpot, setShowFloorPlanForAhu, setShowAhuModalFor, weatherFetchStatus, weatherLocation, weatherSaveError, setWeatherSaveError, showWeatherStrip, setShowWeatherStrip, setShowWeatherSettings, forecast, renderGrid, renderGivoniOverlay, renderVectors, renderIndicatorTooltip, getAhuDiagnostic, getVavDiagnostic, getGivoniTier, MetricBar, LockIcon, theme, ui, t } = ctx;

    return (
<div className="flex-1 relative flex items-center justify-center overflow-hidden font-black shadow-black shadow-inner">
    <div className="absolute top-10 left-24 z-10 pointer-events-none font-black shadow-black"><h2 className={`text-3xl font-black italic uppercase ${ui.heading} tracking-tight font-black shadow-black shadow-black`}>{t('psychrometric_chart')}</h2></div>
    
    {/* Selected AHU Info Card */}
    {selectedAhuId && ahuData.find(a => a.id === selectedAhuId) && (
        <div className={`absolute z-40 select-none shadow-2xl ${theme==='dark'?'shadow-black/80':'shadow-slate-300/80'}`} style={{ top: `${safe(pad.top + cardOffset.y)}px`, left: `${safe(pad.left + cardOffset.x)}px` }}>
            <div className={`${ui.card} p-4 rounded-2xl border-l-[8px] border-l-indigo-50 border ${ui.cardBorder} shadow-2xl w-[320px] font-black shadow-black`}>
                <div className={`flex justify-between gap-3 mb-3 pb-3 border-b ${theme==='dark'?'border-slate-800':'border-slate-200'} cursor-grab active:cursor-grabbing font-black items-stretch shadow-black`} onMouseDown={(e) => { setIsCardDragging(true); setDragStart({ x: e.clientX - cardOffset.x, y: e.clientY - cardOffset.y }); }}>
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <div 
                                className={`text-2xl font-black tracking-tight uppercase italic cursor-pointer hover:text-sky-400 hover:underline transition-colors ${theme==='dark'?'text-slate-100 shadow-black':'text-slate-900'}`}
                                onMouseDown={(e) => { 
                                    e.stopPropagation(); 
                                    setShowFloorPlanForAhu(selectedAhuId); 
                                }}
                                title={window.t ? window.t("click_to_map_vavs") : "Click to map VAVs on Floor Plan"}
                            >
                                {selectedAhuId}
                            </div>
                            <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-1 mb-2 font-black font-mono">{window.t ? window.t("real_time_diag_hub") : "Real-time Diagnostic Hub"}</div>
                        </div>
                        <div className="grid grid-cols-3 gap-1 mt-2 h-full">
                            {ahuData.find(a => a.id === selectedAhuId)?.points.map(p => {
                                const pt = Number(p.t); const prh = Number(p.rh); const pw = Number(p.w); const tTxt = Number.isFinite(pt) ? pt.toFixed(1) + '°' : '--°'; const rhTxt = Number.isFinite(prh) ? prh.toFixed(0) + '%' : '--%'; const hTxt = (Number.isFinite(pt) && Number.isFinite(pw)) ? getH(pt, pw).toFixed(1) + 'h' : '--h';
                                /* Point-visibility toggle (moved here from sidebar 2026-06-26):
                                 * clicking the OA / SA / RA text label inside its data pill
                                 * toggles that point on/off across the chart.  Visual cue:
                                 * inactive labels dim to 35% opacity and add a strike-through. */
                                const active = pointVisibility[p.label] !== false;
                                const toggle = (e) => {
                                    e.stopPropagation();
                                    if (typeof setPointVisibility === 'function') {
                                        setPointVisibility({ ...pointVisibility, [p.label]: !active });
                                    }
                                };
                                return ( <div key={p.label} className={`flex flex-col justify-center ${ui.dataBlock} py-1.5 rounded-lg border text-center shadow-inner h-full transition-opacity ${active ? '' : 'opacity-40'}`}>
                                    <button data-testid={`ahu-point-toggle-${p.label}`} onClick={toggle}
                                            title={active ? `Hide ${p.label} marker on chart` : `Show ${p.label} marker on chart`}
                                            className={`text-[9px] font-black mb-0.5 shadow-black uppercase tracking-wider cursor-pointer hover:underline ${active ? '' : 'line-through'}`}
                                            style={{color: p.color, background:'transparent', border:'none'}}>
                                        {p.label}
                                    </button>
                                    <span className={`text-[10px] font-mono ${theme==='dark'?'text-slate-200':'text-slate-700'}`}>{tTxt}</span>
                                    <span className={`text-[8px] font-mono ${ui.textMuted}`}>{rhTxt}</span>
                                    <span className="text-[8px] font-mono text-pink-400 mt-0.5">{hTxt}</span>
                                </div> );
                            })}
                        </div>
                    </div>
                    <div className="flex gap-2 items-stretch">
                        <div className="flex flex-col items-center gap-1 h-full flex-1"><MetricBar theme={theme} val={ahuMetrics.exchange} color="#3b82f6" max={25} height="flex-1 min-h-[90px] w-full" width="w-14" showValue={true} /><span className="text-[8px] text-blue-400 font-black tracking-tighter shadow-black">Exchange</span></div>
                        <div className="flex flex-col items-center gap-1 h-full flex-1"><MetricBar theme={theme} val={ahuMetrics.absorption} color="#f472b6" max={25} height="flex-1 min-h-[90px] w-full" width="w-14" showValue={true} /><span className="text-[8px] text-pink-400 font-black tracking-tighter shadow-black">Absorption</span></div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5 mb-3 font-black"><button onClick={() => setVecVis({...vecVis, enthalpy: !vecVis.enthalpy})} className={`py-1.5 rounded border text-[9px] font-bold transition-all shadow-black ${vecVis.enthalpy ? 'bg-pink-600/30 border-pink-500 text-pink-500' : ui.btnToggle}`}>{t('enthalpy')}</button><button onClick={() => setVecVis({...vecVis, sensible: !vecVis.sensible})} className={`py-1.5 rounded border text-[9px] font-bold transition-all shadow-black ${vecVis.sensible ? 'bg-blue-600/30 border-blue-500 text-blue-500' : ui.btnToggle}`}>{t('sensible')}</button><button onClick={() => setVecVis({...vecVis, latent: !vecVis.latent})} className={`py-1.5 rounded border text-[9px] font-bold transition-all shadow-black ${vecVis.latent ? 'bg-yellow-600/30 border-yellow-500 text-yellow-600' : ui.btnToggle}`}>{t('latent')}</button><button onClick={() => setVecVis({...vecVis, diagnostic: !vecVis.diagnostic})} className={`py-1.5 rounded border text-[9px] font-bold transition-all shadow-black ${vecVis.diagnostic ? 'bg-emerald-600/30 border-emerald-400 text-emerald-600' : ui.btnToggle}`}>{t('diagnostic')}</button></div>
                <div className="flex gap-2 mt-1 text-xs font-black"><button onClick={() => {setSelectedAhuId(null); setLockedVavId(null);}} className={`flex-1 ${ui.btnToggle} py-2.5 rounded-xl uppercase shadow-lg font-black tracking-widest text-[9px]`}>Close</button><button onClick={() => setShowPath(!showPath)} className={`flex-1 py-2.5 rounded-xl border transition-all text-[9px] font-black shadow-black ${showPath ? 'bg-indigo-600 border-indigo-400 text-slate-100' : ui.btnToggle}`}>Path</button><button onClick={() => {setIsLockedToSA(!isLockedToSA); setLockedVavId(null);}} className={`flex-1 py-2.5 rounded-xl border transition-all text-[9px] font-black shadow-black ${isLockedToSA ? 'bg-emerald-600 border-emerald-400 text-slate-100 shadow-lg' : ui.btnLockedOff}`}>{isLockedToSA ? 'SA Locked' : 'Lock SA'}</button></div>
            </div>
        </div>
    )}

    {/* VAV Terminal Table */}
    {selectedAhuId && ahuData.find(a => a.id === selectedAhuId) && (
        <div className={`absolute z-50 w-[620px] select-none shadow-2xl ${theme==='dark'?'shadow-black/80':'shadow-slate-300/80'}`} style={{ top: `${safe(vavTableOffset.y)}px`, left: `${safe(vavTableOffset.x)}px` }}>
            <div className={`${ui.vavHub} backdrop-blur-xl border border-indigo-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 shadow-black`}>
                {(() => {
                    const currentAhu = ahuData.find(a => a.id === selectedAhuId);
                    const oaP = currentAhu?.points?.find(p => p.label === 'OA');
                    const saP = currentAhu?.points?.find(p => p.label === 'SA');
                    // Active sweet-spot filter narrows the CZ% to the
                    // intersection of (CZ polygon) AND (operator-defined
                    // RH band) when both overlay toggles are on.  Off-state
                    // falls back to the looser CZ-only count so the figure
                    // stays consistent with what the operator sees.
                    const activeSweet = (showGivoni && showSweetSpot) ? { lo: sweetSpotRange.lo, hi: sweetSpotRange.hi } : null;
                    const ahuDiag = getAhuDiagnostic(currentAhu, comfortZonePoly, activeSweet);
                    return (
                        <React.Fragment>
                <div className={`p-4 ${theme==='dark'?'bg-indigo-600/10 border-indigo-500/20':'bg-indigo-50 border-indigo-200'} border-b cursor-grab active:cursor-grabbing font-black shadow-black`} onMouseDown={(e) => { setIsVavDragging(true); setDragStart({ x: e.clientX - vavTableOffset.x, y: e.clientY - vavTableOffset.y }); }}>
                    <div className="flex justify-between items-center">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 font-mono shadow-black">{t('vav_terminal_hub')}</h3>
                        {ahuDiag && (
                            <div className="flex items-center gap-3">
                                <span className={`text-[9px] font-black uppercase tracking-wider ${ahuDiag.process === 'heating' ? 'text-orange-400' : ahuDiag.process === 'cooling' ? 'text-cyan-400' : 'text-emerald-400'}`}>
                                    {ahuDiag.process === 'heating' ? 'HTG' : ahuDiag.process === 'cooling' ? 'CLG' : 'IDLE'}
                                </span>
                                <span className={`text-[10px] font-black ${ahuDiag.comfortPct >= 80 ? 'text-emerald-400' : ahuDiag.comfortPct >= 50 ? 'text-amber-400' : 'text-red-400'}`}
                                      title={activeSweet ? `${ahuDiag.inCZCount}/${ahuDiag.totalVavs} VAVs inside Givoni CZ AND ${activeSweet.lo}-${activeSweet.hi}% RH` : `${ahuDiag.inCZCount}/${ahuDiag.totalVavs} VAVs inside Givoni CZ`}>
                                    {ahuDiag.comfortPct}% {activeSweet ? 'CZ' + String.fromCharCode(0x2229) + 'SS' : 'CZ'}
                                </span>
                            </div>
                        )}
                    </div>
                    {/* Comfort-tier legend (A/B/C+/C-) — moved here from the sidebar so the
                        operator sees the CZ tier colour code right next to the VAV table that
                        uses those colours.  Only rendered while the Givoni overlay is on. */}
                    {renderGivoniTierLegend({ showGivoni, theme })}
                    {ahuDiag && ahuDiag.recommendations.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                            {ahuDiag.recommendations.slice(0, 2).map((r, i) => (
                                <span key={i} className={`text-[8px] px-1.5 py-0.5 rounded ${theme==='dark'?'bg-amber-900/30 text-amber-400 border border-amber-700/50':'bg-amber-50 text-amber-700 border border-amber-200'} font-bold`}>{r}</span>
                            ))}
                        </div>
                    )}
                </div>
                <div className={`max-h-[280px] overflow-y-auto custom-scrollbar p-2 bg-opacity-20 font-mono text-[11px] ${ui.text}`}>
                    <table className="w-full text-left border-separate border-spacing-y-1">
                        <thead><tr className={`text-[9px] font-black uppercase text-slate-400`}><th className="w-5">CZ</th><th>ID</th><th>Temp</th><th>RH%</th><th>h</th><th>Dh(SA)</th><th>Dist</th><th>Demand</th><th className="text-center font-black">Lock</th></tr></thead>
                        <tbody className="opacity-90">
                            {currentAhu.vavs && currentAhu.vavs.map(v => {
                                const saH = saP ? getH(saP.t, saP.w) : 0;
                                const diffH = v.h - saH;
                                // Pass the SAME activeSweet filter as the AHU-level
                                // diagnostic so the row's status and the badge's
                                // CZ% stay in sync: a VAV that's "in CZ but not
                                // sweet" will downgrade from optimal/comfort to
                                // warning here too, matching the badge count.
                                const diag = getVavDiagnostic(v, saP, comfortZonePoly, activeSweet);
                                // Givoni-aware tier classification.  Single resolver in
                                // psychrometric.js owns BOTH the dot colour (auto-derived
                                // from the same hex tokens the chart polygons use) AND the
                                // control-strategy hint shown in the tooltip + chart
                                // callout, so visual + recommendation stay in lock-step.
                                //   Tier A -> SWEET_FILL    + HOLD setpoints
                                //   Tier B -> CZ_STROKE     + Soft trim humidify/dehumidify
                                //   Tier C+ -> HOT_OUTSIDE  + mech cool / dehumidify
                                //   Tier C- -> COLD_OUTSIDE + mech heat / humidify
                                const _gvSweet = (showGivoni && showSweetSpot) ? sweetSpotRange : null;
                                const gv = getGivoniTier(v.t, v.w, v.rh, comfortZonePoly, _gvSweet, showGivoni);
                                const statusStyle = {
                                    backgroundColor: gv.dotFill,
                                    boxShadow: '0 0 5px ' + gv.dotFill + '80',
                                };
                                const statusTitle = gv.tooltip;
                                return (
                                    <tr key={v.id} className={`rounded-lg transition-colors shadow-black ${lockedVavId === v.id ? 'bg-indigo-500/30' : (theme==='dark'?'bg-slate-950/40 hover:bg-indigo-500/10':'bg-slate-100 hover:bg-indigo-100')}`}>
                                        <td className="px-1 py-2" title={statusTitle} data-testid={`vav-cz-status-${v.id}`}>
                                            <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={statusStyle}></div>
                                        </td>
                                        <td className="px-2 py-2 text-indigo-500 font-bold cursor-pointer hover:underline transition-colors hover:text-indigo-400" onMouseDown={(e) => { e.stopPropagation(); setSelectedVavForModal(v); setVavCfm(Math.floor(Math.random() * 300 + 400)); setLockedVavId(v.id); setIsLockedToSA(false); }} title={window.t ? window.t("view_diagram") : "View Diagram"}>{v.id}</td>
                                        <td className="font-black">{v.t.toFixed(1)}</td>
                                        <td className="font-black">{v.rh.toFixed(0)}</td>
                                        <td className="text-pink-500 font-black">{v.h.toFixed(1)}</td>
                                        <td className={`font-black ${Math.abs(diffH) < 3 ? 'text-emerald-500' : Math.abs(diffH) < 6 ? 'text-blue-500' : 'text-red-400'}`}>{diffH > 0 ? '+' : ''}{diffH.toFixed(1)}</td>
                                        <td className={`font-black text-[10px] ${diag.distSA < 3 ? 'text-emerald-500' : diag.distSA < 6 ? 'text-slate-400' : 'text-amber-400'}`}>{diag.distSA.toFixed(1)}</td>
                                        <td className={`font-black text-[10px] ${diag.totalDemand === 0 ? 'text-emerald-500' : diag.demandType === 'heating' ? 'text-orange-400' : 'text-cyan-400'}`}>{diag.totalDemand === 0 ? '--' : diag.totalDemand.toFixed(1)}</td>
                                        <td className="text-center"><button onMouseDown={(e) => { e.stopPropagation(); setLockedVavId(lockedVavId === v.id ? null : v.id); setIsLockedToSA(false); }} className={`p-1.5 rounded-lg border transition-all shadow-black ${lockedVavId === v.id ? 'bg-emerald-600 border-emerald-400 text-slate-100 shadow-lg' : ui.btnToggle}`}><LockIcon/></button></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                        </React.Fragment>
                    );
                })()}
            </div>
        </div>
    )}

    <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className={`w-full h-full cursor-crosshair transition-all duration-500 shadow-black shadow-black`}>
        <defs>
            <marker id="arrow-pink" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 Z" fill="#f472b6" /></marker>
            <marker id="arrow-yellow" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 Z" fill="#fbbf24" /></marker>
            <marker id="arrow-yellow-small" markerWidth="4" markerHeight="4" refX="4" refY="2" orient="auto"><path d="M0,0 L0,4 L4,2 Z" fill="#fbbf24" /></marker>
            <marker id="arrow-blue" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 Z" fill="#60a5fa" /></marker>
            <marker id="arrow-blue-small" markerWidth="4" markerHeight="4" refX="4" refY="2" orient="auto"><path d="M0,0 L0,4 L4,2 Z" fill="#60a5fa" /></marker>
            <marker id="arrow-emerald" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 Z" fill="#10b981" /></marker>
        </defs>
        <rect x={pad.left} y={pad.top} width={gridWidth} height={gridHeight} fill={ui.chartBg} className="transition-all duration-500 shadow-black shadow-black" />
        {renderGrid()}{renderGivoniOverlay()}
        {ahuData.map(ahu => { const isFocused = selectedAhuId === ahu.id; return ( <g key={ahu.id} opacity={selectedAhuId && !isFocused ? 0.12 : 1}> {isFocused && showPath && ( <g>{(pointVisibility.OA && pointVisibility.SA) && <line x1={safe(x(ahu.points[0].t))} y1={safe(y(ahu.points[0].w))} x2={safe(x(ahu.points[1].t))} y2={safe(y(ahu.points[1].w))} stroke={ahu.procColor} strokeWidth={isFocused ? 3.5 : 1.5} strokeDasharray={isFocused ? "" : "5,4"} />}{(pointVisibility.SA && pointVisibility.RA) && <line x1={safe(x(ahu.points[1].t))} y1={safe(y(ahu.points[1].w))} x2={safe(x(ahu.points[2].t))} y2={safe(y(ahu.points[2].w))} stroke={ahu.procColor} strokeWidth={isFocused ? 3.5 : 1.5} strokeDasharray={isFocused ? "" : "5,4"} />}</g> )} {ahu.points && ahu.points.map(p => { if (pointVisibility[p.label] === false) return null; return ( <g key={p.label}><circle cx={safe(x(p.t))} cy={safe(y(p.w))} r={isFocused ? 6.5 : 4} fill={p.color} stroke={theme==='dark'?'white':'#334155'} strokeWidth="2" className="shadow-lg shadow-black" />{isFocused && p.label === 'SA' && ( <text x={safe(x(p.t))} y={safe(y(p.w) - 15)} textAnchor="middle" fill={theme==='dark'?'white':'#000'} fontSize="12" fontWeight="900" style={{ filter: theme==='dark'?'drop-shadow(0px 0px 4px rgba(0,0,0,0.8))':'' }} className="uppercase tracking-widest font-black tracking-tighter font-mono shadow-black">{ahu.id}</text> )}</g> ); })} {isFocused && ahu.vavs && ahu.vavs.map(v => { const isThisLocked = lockedVavId === v.id; const _vavSweet = (showGivoni && showSweetSpot) ? sweetSpotRange : null; const _vavGv = getGivoniTier(v.t, v.w, v.rh, comfortZonePoly, _vavSweet, showGivoni); const _vavDotFill = _vavGv.dotFill; return ( <g key={v.id} onMouseDown={(e) => { e.stopPropagation(); setLockedVavId(isThisLocked ? null : v.id); setIsLockedToSA(false); }} className="cursor-pointer shadow-black shadow-black"><title>{v.id} -- {_vavGv.label}</title><circle cx={safe(x(v.t))} cy={safe(y(v.w))} r={isThisLocked ? "5.5" : "4"} fill={_vavDotFill} stroke={isThisLocked ? "#fff" : _vavDotFill} strokeWidth={isThisLocked ? "2" : "0.5"} className="transition-all shadow-black shadow-black" style={{ filter: `drop-shadow(0 0 ${isThisLocked ? '6' : '3'}px ${_vavDotFill})` }} /></g> ); })} </g> ); })}
        {isProcessVisible && renderVectors()}
        <g onMouseDown={() => { setIsDraggingIndicator(true); setIsProcessVisible(true); setIsLockedToSA(false); setLockedVavId(null); }} className="cursor-move shadow-black shadow-black"><g transform={"translate(" + safe(x(indicatorPos.t)) + ", " + safe(y(indicatorPos.w)) + ")"}>
            <circle cx="0" cy="0" r="4" fill="white" stroke="#6366f1" strokeWidth="2.5" className="shadow-xl shadow-black" />
            {isProcessVisible && renderIndicatorTooltip()}
        </g></g>
        <text x={pad.left + gridWidth/2} y={pad.top + gridHeight + 70} textAnchor="middle" fill={ui.svgAxis} fontSize="14" fontWeight="900" className={`uppercase tracking-[0.3em] font-black italic shadow-black shadow-black`}>{t('dry_bulb_temp')} (°C)</text><text x={pad.left + gridWidth + 65} y={pad.top + gridHeight/2} transform={`rotate(-90, ${pad.left + gridWidth + 65}, ${pad.top+gridHeight/2})`} textAnchor="middle" fill={ui.svgAxis} fontSize="14" fontWeight="900" className={`uppercase tracking-[0.3em] font-black italic shadow-black shadow-black`}>{t('humidity_ratio')} (g/kg)</text>
    </svg>
    {/* Legend — relocated 2026-06-26 from horizontal bottom-strip to a
        vertical stack parked in the chart's mid-left gutter (low T,
        mid-W area), where it doesn't collide with the Y-axis tick
        numbers (HUMIDITY RATIO) on the left edge or the ENTHALPY
        diagonals at the top.  All controls (weather toggle, location
        chip, fetch-status pill, save-error pill, tomorrow forecast)
        retain their original behaviour and data-testids. */}
    <div data-testid="psy-chart-legend"
         className={`absolute top-1/2 left-16 -translate-y-1/2 flex flex-col gap-2 p-3 ${theme==='dark'?'bg-slate-900/80 shadow-black/40 border-slate-800':'bg-white/90 shadow-slate-300/60 border-slate-200'} rounded-xl border shadow-2xl z-30 font-black text-[10px] ${ui.textMuted} uppercase tracking-widest backdrop-blur-sm`}>
        <div className="flex items-center gap-2 whitespace-nowrap font-mono"><div className="w-6 h-0 border-t-2 border-dashed border-pink-400"></div> {t('enthalpy')}</div>
        <div className="flex items-center gap-2 whitespace-nowrap font-mono"><div className="w-6 h-0 border-t-2 border-dashed border-yellow-400"></div> {t('latent')}</div>
        <div className="flex items-center gap-2 whitespace-nowrap font-mono"><div className="w-6 h-0 border-t-2 border-dashed border-blue-400"></div> {t('sensible')}</div>
        <div className="flex items-center gap-2 whitespace-nowrap font-mono"><div className="w-6 h-0 border-t-2 border-dashed border-emerald-500"></div> {t('diagnostic')}</div>
        <div className={`h-px ${theme==='dark'?'bg-slate-700':'bg-slate-300'} my-0.5`}></div>
        <button data-testid="weather-toggle" onClick={() => { if (!weatherLocation) { setShowWeatherSettings(true); } setShowWeatherStrip(p => !p); }} className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider transition-all ${showWeatherStrip ? (theme==='dark'?'bg-indigo-600 text-slate-100':'bg-indigo-500 text-slate-100') : (theme==='dark'?'bg-slate-700 text-slate-400 border border-slate-600':'bg-slate-200 text-slate-500 border border-slate-300')}`}>{t('weather')}</button>
        {showWeatherStrip && <button onClick={() => setShowWeatherSettings(true)} className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-wider transition-all ${theme==='dark'?'bg-slate-700 text-sky-400 border border-slate-600 hover:text-slate-100':'bg-slate-200 text-sky-600 border border-slate-300 hover:text-sky-800'}`}>{weatherLocation ? (weatherLocation.name || weatherLocation.lat + ',' + weatherLocation.lon) : t('set_location')}</button>}
        {showWeatherStrip && weatherFetchStatus && (() => {
            const cfg = weatherFetchStatus.source === 'browser'
                ? { label: 'BROWSER', color: theme==='dark'?'text-indigo-300 border-indigo-500/40 bg-indigo-500/10':'text-indigo-700 border-indigo-300 bg-indigo-50' }
                : weatherFetchStatus.source === 'controller'
                ? { label: 'CACHE',   color: theme==='dark'?'text-emerald-300 border-emerald-500/40 bg-emerald-500/10':'text-emerald-700 border-emerald-300 bg-emerald-50' }
                : { label: 'NET',     color: theme==='dark'?'text-orange-300 border-orange-500/40 bg-orange-500/10':'text-orange-700 border-orange-300 bg-orange-50' };
            return <span data-testid="weather-fetch-status" className={`px-1.5 py-0.5 rounded border text-[7px] font-mono font-black tracking-widest text-center ${cfg.color}`} title={`Source: ${weatherFetchStatus.source} | ${weatherFetchStatus.ms}ms`}>{cfg.label} {weatherFetchStatus.ms}ms</span>;
        })()}
        {weatherSaveError && <button onClick={() => setWeatherSaveError('')} data-testid="weather-save-error-inline" className={`px-1.5 py-0.5 rounded border text-[7px] font-mono font-black tracking-widest ${theme==='dark'?'text-red-300 border-red-500/40 bg-red-500/10 hover:bg-red-500/20':'text-red-700 border-red-300 bg-red-50 hover:bg-red-100'}`} title={weatherSaveError + ' — click to dismiss'}>SAVE FAILED ✕</button>}
        {forecast && showWeatherStrip && <div className={`flex flex-col gap-0.5 px-2 py-1 rounded text-[8px] font-mono font-bold ${theme==='dark'?'bg-slate-800 border border-slate-700 text-emerald-400':'bg-emerald-50 border border-emerald-200 text-emerald-700'}`}>
            <span className="uppercase tracking-wider text-[7px] opacity-70">{t('tomorrow')}</span>
            <span className="text-orange-400">{forecast.t_min}/{forecast.t_max}°C</span>
            <span className="text-sky-400">{forecast.rh_min}/{forecast.rh_max}%</span>
            <span className="text-pink-400">{forecast.h_min}/{forecast.h_max}kJ</span>
        </div>}
    </div>
</div>
    );
}
