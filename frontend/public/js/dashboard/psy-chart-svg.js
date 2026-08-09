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
    const { width, height, gridWidth, gridHeight, pad, svgRef, T_MIN, T_MAX, invX, getW, x, y, safe, getH, selectedAhuId, setSelectedAhuId, lockedVavId, setLockedVavId, isLockedToSA, setIsLockedToSA, showPath, setShowPath, pointVisibility, setPointVisibility, cardOffset, setIsCardDragging, setDragStart, setIsVavDragging, vavTableOffset, vavCfm, setVavCfm, setSelectedVavForModal, indicatorPos, isProcessVisible, setIsProcessVisible, setIsDraggingIndicator, vecVis, setVecVis, ahuData, ahuMetrics, comfortZonePoly, sweetSpotRange, showGivoni, showSweetSpot, setShowFloorPlanForAhu, setShowAhuModalFor, weatherFetchStatus, weatherLocation, weatherSaveError, setWeatherSaveError, showWeatherStrip, setShowWeatherStrip, setShowWeatherSettings, forecast, renderGrid, renderGivoniOverlay, renderVectors, renderIndicatorTooltip, getAhuDiagnostic, getVavDiagnostic, getGivoniTier, MetricBar, LockIcon, theme, ui, t, vavHubPopupWin, vavHubPopupHost, vavHubFloating, setVavHubFloating, vavHubFloatPos, vavHubFloatSize, popOutVavHub, floatVavHub, onVavHubTitleMouseDown, onVavHubResizeMouseDown } = ctx;

    /* ----------------------------------------------------------------
     * Process legs.  With MA present every drawn segment corresponds to
     * exactly one piece of equipment:
     *
     *     OA -> MA, RA -> MA   the mixing box
     *     MA -> SA             coil(s) + humidifier
     *     SA -> RA             the room picking up load
     *
     * The two mixing legs are collinear by construction -- humidity ratio
     * mixes linearly with mass fraction -- so they render as one straight
     * OA-RA line passing through MA.  A measured MA (both MAT and MAH
     * wired) may sit off that line, and the shallow V it then draws is the
     * fault signal.
     *
     * Without MA we fall back to the legacy OA->SA chord.  That line is no
     * physical process: it spans mixing and the coil at once, so the coil's
     * apparent sensible/latent split is contaminated by mixing.  It stays
     * only so units with no mixed-air data still draw something.
     * ---------------------------------------------------------------- */
    const processLegs = (ahu, isFocused) => {
        const P = {};
        (ahu.points || []).forEach(p => { if (p && p.label) P[p.label] = p; });
        const shown = l => pointVisibility[l] !== false && !!P[l];
        const sw = isFocused ? 3.5 : 1.5;
        const dash = isFocused ? "" : "5,4";
        // A derived MA lies on the OA-RA line because it was computed to,
        // not because the box was measured doing it.  Dotted mixing legs say
        // "constructed"; solid ones say "measured".
        const derived = P.MA ? P.MA.derived !== false : false;
        const legs = P.MA
            ? [['OA', 'MA', true], ['RA', 'MA', true], ['MA', 'SA', false], ['SA', 'RA', false]]
            : [['OA', 'SA', false], ['SA', 'RA', false]];
        return legs.map(([a, b, isMix]) => {
            if (!shown(a) || !shown(b)) return null;
            return <line key={`${a}-${b}`}
                x1={safe(x(P[a].t))} y1={safe(y(P[a].w))}
                x2={safe(x(P[b].t))} y2={safe(y(P[b].w))}
                stroke={ahu.procColor}
                strokeWidth={isMix ? sw * 0.75 : sw}
                strokeDasharray={isMix ? (derived ? "2,3" : "") : dash}
                opacity={isMix ? 0.8 : 1} />;
        });
    };

    /* Hover text for the MA dot -- states plainly which of the three bases
       produced it, because the diagnostic worth trusting differs for each. */
    const maTitle = (ahu, p) => {
        const mx = ahu.mixing || {};
        const basis = {
            measured: t('ma_basis_measured'),
            mat: t('ma_basis_mat'),
            'mat+damper': t('ma_basis_mat_damper'),
            damper: t('ma_basis_damper'),
        }[p.basis || mx.basis] || (p.basis || '');
        const bits = [`${t('mixed_air')} — ${basis}`];
        if (mx.oa_fraction != null) bits.push(`${t('oa_fraction')}: ${Math.round(mx.oa_fraction * 100)}%`);
        if (mx.oa_fraction_damper != null) bits.push(`${t('oa_damper')}: ${Math.round(mx.oa_fraction_damper * 100)}%`);
        if (mx.line_deviation_g_kg != null) bits.push(`${t('off_line')}: ${mx.line_deviation_g_kg} g/kg`);
        (mx.flags || []).forEach(f => bits.push(`⚠ ${t('ma_flag_' + f)}`));
        return bits.join('\n');
    };

    return (
<div className="flex-1 relative flex items-center justify-center overflow-hidden font-black shadow-black shadow-inner">
    <div className="absolute top-10 left-24 z-10 pointer-events-none font-black shadow-black"><h2 className={`text-3xl font-black italic uppercase ${ui.heading} tracking-tight font-black shadow-black shadow-black`}>{t('psychrometric_chart')}</h2></div>
    {typeof renderProcessMiniBadge === 'function' && renderProcessMiniBadge({
        ahu: selectedAhuId ? (ahuData.find(a => a.id === selectedAhuId) || null) : null,
        theme,
        sweetSpotRange,
        showSweetSpot,
        T_MIN,
        T_MAX,
    })}
    
    {/* Selected AHU "info card" (the floating box on the chart that
        previously showed OA/SA/RA pills + vector toggles + Close/Path/
        Lock SA buttons + Exchange/Absorption bars) was REMOVED on
        2026-06-26.  Its functions migrated as follows:
          - vector visibility (enthalpy/latent/sensible/diagnostic)
            → click the swatches in the vertical legend on the chart's left
          - point visibility (OA/SA/RA)
            → click the OA/SA/RA labels inside each sidebar AHU row
          - Lock SA / Path / Close → chips on the sidebar AHU row
            (appear when that AHU is selected)
          - Exchange / Absorption bars → already shown on the sidebar row
        Removing the card declutters the chart and avoids two parallel
        controls for the same state. */}

    {/* VAV Terminal Table — docked on chart, in-page float, or POP OUT / PiP */}
    {selectedAhuId && ahuData.find(a => a.id === selectedAhuId) && (() => {
        const currentAhu = ahuData.find(a => a.id === selectedAhuId);
        const saP = currentAhu?.points?.find(p => p.label === 'SA');
        const activeSweet = (showGivoni && showSweetSpot) ? { lo: sweetSpotRange.lo, hi: sweetSpotRange.hi } : null;
        const ahuDiag = getAhuDiagnostic(currentAhu, comfortZonePoly, activeSweet);
        const hubIsPopped = !!(vavHubPopupWin && vavHubPopupHost);
        const hubIsPip = !!(hubIsPopped && vavHubPopupWin.__red5IsPip);
        const hubIsFloatPage = !!(vavHubFloating && !hubIsPopped);
        const hubDetached = hubIsPopped || hubIsFloatPage;
        const pipOk = typeof red5PipSupported === 'function' && red5PipSupported();

        const hubChromeBtns = (
            <div className="flex items-center gap-1" data-no-drag onMouseDown={(e) => e.stopPropagation()}>
                <button
                    type="button"
                    data-testid="popout-vav-hub-btn"
                    data-no-drag
                    onClick={() => {
                        if (hubIsPopped && !hubIsPip) {
                            try { vavHubPopupWin.close(); } catch (e) {}
                        } else if (typeof popOutVavHub === 'function') {
                            popOutVavHub();
                        }
                    }}
                    title={hubIsPopped && !hubIsPip ? 'Re-attach VAV hub to the chart' : 'Pop out into a browser window'}
                    className={`px-1.5 py-0.5 border rounded text-[8px] font-black uppercase tracking-wider transition-all ${hubIsPopped && !hubIsPip ? 'bg-emerald-700 border-emerald-400 text-slate-100 hover:bg-emerald-600' : (theme === 'dark' ? 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-cyan-500 hover:text-cyan-300' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-cyan-500 hover:text-cyan-600')}`}
                >{hubIsPopped && !hubIsPip ? '\u21A9 ATTACH' : '\u2197 POP OUT'}</button>
                {(pipOk || !hubIsPopped) && (
                    <button
                        type="button"
                        data-testid="float-vav-hub-btn"
                        data-no-drag
                        onClick={() => {
                            if (hubIsPip) {
                                try { vavHubPopupWin.close(); } catch (e) {}
                            } else if (hubIsFloatPage) {
                                setVavHubFloating(false);
                            } else if (typeof floatVavHub === 'function') {
                                floatVavHub();
                            }
                        }}
                        title={hubIsPip || hubIsFloatPage ? 'Re-attach float box to the chart' : (pipOk ? 'Float as a minimal always-on-top box (Chrome/Edge PiP)' : 'Float as an in-page panel')}
                        className={`px-1.5 py-0.5 border rounded text-[8px] font-black uppercase tracking-wider transition-all ${(hubIsPip || hubIsFloatPage) ? 'bg-violet-700 border-violet-400 text-slate-100 hover:bg-violet-600' : (theme === 'dark' ? 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-violet-500 hover:text-violet-300' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-violet-500 hover:text-violet-600')}`}
                    >{(hubIsPip || hubIsFloatPage) ? '\u21A9 ATTACH' : '\u25A3 FLOAT'}</button>
                )}
            </div>
        );

        const hubPanel = (
            <div className={`${ui.vavHub} backdrop-blur-xl border border-indigo-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden ${hubDetached ? 'h-full rounded-none border-0' : 'animate-in zoom-in-95 duration-200'} shadow-black`} data-testid="vav-terminal-hub">
                <div
                    className={`p-4 ${theme==='dark'?'bg-indigo-600/10 border-indigo-500/20':'bg-indigo-50 border-indigo-200'} border-b font-black shadow-black ${hubIsFloatPage ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
                    onMouseDown={(e) => {
                        if (hubDetached) return;
                        if (e.target.closest('[data-no-drag]')) return;
                        setIsVavDragging(true);
                        setDragStart({ x: e.clientX - vavTableOffset.x, y: e.clientY - vavTableOffset.y });
                    }}
                >
                    <div className="flex justify-between items-center gap-2">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 font-mono shadow-black">{t('vav_terminal_hub')}</h3>
                        <div className="flex items-center gap-2 flex-wrap justify-end">
                            {ahuDiag && (
                                <div className="flex items-center gap-3">
                                    <span className={`text-[9px] font-black uppercase tracking-wider ${ahuDiag.process === 'heating' ? 'text-orange-400' : ahuDiag.process === 'cooling' ? 'text-cyan-400' : 'text-emerald-400'}`}>
                                        {ahuDiag.process === 'heating' ? 'HTG' : ahuDiag.process === 'cooling' ? 'CLG' : 'IDLE'}
                                    </span>
                                    <span className={`text-[10px] font-black ${ahuDiag.comfortPct >= 80 ? 'text-emerald-400' : ahuDiag.comfortPct >= 50 ? 'text-amber-400' : 'text-red-400'}`}
                                          title={activeSweet
                                              ? `${ahuDiag.inCZCount} of ${ahuDiag.totalVavs} VAVs inside Givoni CZ AND RH ${activeSweet.lo}–${activeSweet.hi}%`
                                              : `${ahuDiag.inCZCount} of ${ahuDiag.totalVavs} VAVs inside Givoni CZ`}>
                                        {ahuDiag.comfortPct}% ({ahuDiag.inCZCount}/{ahuDiag.totalVavs}) {activeSweet ? 'CZ∩SS' : 'CZ'}
                                    </span>
                                </div>
                            )}
                            {hubChromeBtns}
                        </div>
                    </div>
                    {renderGivoniTierLegend({ showGivoni, theme })}
                    {ahuDiag && ahuDiag.recommendations.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                            {ahuDiag.recommendations.slice(0, 2).map((r, i) => (
                                <span key={i} className={`text-[8px] px-1.5 py-0.5 rounded ${theme==='dark'?'bg-amber-900/30 text-amber-400 border border-amber-700/50':'bg-amber-50 text-amber-700 border border-amber-200'} font-bold`}>{r}</span>
                            ))}
                        </div>
                    )}
                </div>
                <div className={`${hubDetached ? 'flex-1 min-h-0' : 'max-h-[280px]'} overflow-y-auto custom-scrollbar p-2 bg-opacity-20 font-mono text-[11px] ${ui.text}`}>
                    <table className="w-full text-left border-separate border-spacing-y-1">
                        <thead><tr className={`text-[9px] font-black uppercase text-slate-400`}><th className="w-5">CZ</th><th>ID</th><th>Temp</th><th>RH%</th><th>h</th><th>Dh(SA)</th><th>Dist</th><th>Demand</th><th className="text-center font-black">Lock</th></tr></thead>
                        <tbody className="opacity-90">
                            {currentAhu.vavs && currentAhu.vavs.map(v => {
                                const saH = saP ? getH(saP.t, saP.w) : 0;
                                const diffH = v.h - saH;
                                const diag = getVavDiagnostic(v, saP, comfortZonePoly, activeSweet);
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
            </div>
        );

        const docked = !hubDetached ? (
            <div className={`absolute z-50 w-[620px] select-none shadow-2xl ${theme==='dark'?'shadow-black/80':'shadow-slate-300/80'}`} style={{ top: `${safe(vavTableOffset.y)}px`, left: `${safe(vavTableOffset.x)}px` }}>
                {hubPanel}
            </div>
        ) : (
            <button
                type="button"
                data-testid="vav-hub-attach-chip"
                onClick={() => {
                    if (hubIsPopped) { try { vavHubPopupWin.close(); } catch (e) {} }
                    setVavHubFloating(false);
                }}
                className={`absolute z-50 top-4 right-4 px-2 py-1 rounded-lg border text-[9px] font-black uppercase tracking-wider ${theme==='dark' ? 'bg-slate-900/90 border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/40' : 'bg-white/95 border-indigo-300 text-indigo-700 hover:bg-indigo-50'}`}
                title="VAV Terminal Hub is detached — click to bring it back"
            >{'\u21A9'} VAV Hub {hubIsPip ? 'PiP' : hubIsPopped ? 'window' : 'float'} · click to attach</button>
        );

        const portals = [];
        if (hubIsPopped && vavHubPopupHost) {
            portals.push(ReactDOM.createPortal(
                <div className="h-full w-full flex flex-col overflow-hidden" data-testid="vav-hub-popped-host">{hubPanel}</div>,
                vavHubPopupHost
            ));
        }
        if (hubIsFloatPage) {
            portals.push(ReactDOM.createPortal(
                <div
                    className={`fixed z-[90] rounded-xl shadow-2xl overflow-hidden ${theme==='dark' ? 'border border-indigo-500/40 bg-slate-900' : 'border border-slate-300 bg-white'}`}
                    style={{
                        left: (vavHubFloatPos && vavHubFloatPos.x) + 'px',
                        top: (vavHubFloatPos && vavHubFloatPos.y) + 'px',
                        width: (vavHubFloatSize && vavHubFloatSize.w) + 'px',
                        height: (vavHubFloatSize && vavHubFloatSize.h) + 'px',
                    }}
                    data-testid="vav-hub-floating-shell"
                >
                    <div
                        onMouseDown={onVavHubTitleMouseDown}
                        className={`cursor-grab active:cursor-grabbing flex items-center justify-between px-3 py-1.5 border-b ${theme==='dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}
                        data-testid="vav-hub-floating-titlebar"
                    >
                        <span className={`text-[10px] font-black uppercase tracking-widest ${theme==='dark' ? 'text-indigo-300' : 'text-indigo-600'}`}>
                            {'\u2725 VAV Hub \u2014 drag to move'}
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                data-no-drag
                                data-testid="vav-hub-floating-to-window"
                                onClick={popOutVavHub}
                                className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border transition-all ${theme==='dark' ? 'bg-slate-700 border-slate-500 text-slate-200 hover:bg-cyan-700 hover:border-cyan-400' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-cyan-100 hover:border-cyan-400'}`}
                                title="Send the VAV hub to a separate browser window"
                            >{'\u29C9 To Window'}</button>
                            <button
                                data-no-drag
                                data-testid="vav-hub-floating-attach"
                                onClick={() => setVavHubFloating(false)}
                                className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border bg-emerald-700 border-emerald-400 text-slate-100 hover:bg-emerald-600 transition-all"
                                title="Re-attach VAV hub to the chart"
                            >{'\u21A9 Attach'}</button>
                        </div>
                    </div>
                    <div className="flex flex-col overflow-hidden" style={{ height: 'calc(100% - 30px)' }}>
                        {hubPanel}
                    </div>
                    <div
                        onMouseDown={onVavHubResizeMouseDown}
                        title="Drag to resize"
                        data-testid="vav-hub-floating-resize"
                        className={`absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize z-[91] ${theme==='dark' ? 'bg-indigo-500/40 hover:bg-indigo-500/80' : 'bg-indigo-300 hover:bg-indigo-500'}`}
                        style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
                    />
                </div>,
                document.body
            ));
        }

        return (
            <React.Fragment>
                {docked}
                {portals}
            </React.Fragment>
        );
    })()}

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
        {ahuData.map(ahu => { const isFocused = selectedAhuId === ahu.id; return ( <g key={ahu.id} opacity={selectedAhuId && !isFocused ? 0.12 : 1}> {isFocused && showPath && ( <g>{processLegs(ahu, isFocused)}</g> )} {ahu.points && ahu.points.map(p => { if (pointVisibility[p.label] === false) return null; const _pc = (typeof red5PointColor === 'function' ? red5PointColor(p.label, p.color) : p.color); const _dop = (typeof RED5_POINT_DOT_OPACITY === 'number' ? RED5_POINT_DOT_OPACITY : 0.8); const _isMA = p.label === 'MA'; const _maFill = (typeof RED5_MA_FILL === 'string' ? RED5_MA_FILL : '#0f172a'); const _maRing = (typeof RED5_MA_RING === 'string' ? RED5_MA_RING : '#eab308'); return ( <g key={p.label}>{_isMA && <title>{maTitle(ahu, p)}</title>}<circle cx={safe(x(p.t))} cy={safe(y(p.w))} r={isFocused ? 6.5 : 4} fill={_isMA ? _maFill : _pc} fillOpacity={_dop} stroke={_isMA ? _maRing : (theme==='dark'?'white':'#334155')} strokeOpacity={_dop} strokeWidth={_isMA ? 2.5 : 2} className="shadow-lg shadow-black" />{isFocused && p.label === 'SA' && ( <text x={safe(x(p.t))} y={safe(y(p.w) - 15)} textAnchor="middle" fill={theme==='dark'?'white':'#000'} fontSize="12" fontWeight="900" style={{ filter: theme==='dark'?'drop-shadow(0px 0px 4px rgba(0,0,0,0.8))':'' }} className="uppercase tracking-widest font-black tracking-tighter font-mono shadow-black">{ahu.id}</text> )}</g> ); })} {isFocused && ahu.vavs && ahu.vavs.map(v => { const isThisLocked = lockedVavId === v.id; const _vavSweet = (showGivoni && showSweetSpot) ? sweetSpotRange : null; const _vavGv = getGivoniTier(v.t, v.w, v.rh, comfortZonePoly, _vavSweet, showGivoni); const _vavDotFill = _vavGv.dotFill; return ( <g key={v.id} onMouseDown={(e) => { e.stopPropagation(); setLockedVavId(isThisLocked ? null : v.id); setIsLockedToSA(false); }} className="cursor-pointer shadow-black shadow-black"><title>{v.id} -- {_vavGv.label}</title><circle cx={safe(x(v.t))} cy={safe(y(v.w))} r={isThisLocked ? "5.5" : "4"} fill={_vavDotFill} stroke={isThisLocked ? "#fff" : _vavDotFill} strokeWidth={isThisLocked ? "2" : "0.5"} className="transition-all shadow-black shadow-black" style={{ filter: `drop-shadow(0 0 ${isThisLocked ? '6' : '3'}px ${_vavDotFill})` }} /></g> ); })} </g> ); })}
        {isProcessVisible && renderVectors()}
        <g onMouseDown={() => { setIsDraggingIndicator(true); setIsProcessVisible(true); setIsLockedToSA(false); setLockedVavId(null); }} className="cursor-move shadow-black shadow-black"><g transform={"translate(" + safe(x(indicatorPos.t)) + ", " + safe(y(indicatorPos.w)) + ")"}>
            <circle cx="0" cy="0" r="4" fill="white" stroke="#6366f1" strokeWidth="2.5" className="shadow-xl shadow-black" />
            {isProcessVisible && renderIndicatorTooltip()}
        </g></g>
        <text x={pad.left + gridWidth/2} y={pad.top + gridHeight + 70} textAnchor="middle" fill={ui.svgAxis} fontSize="14" fontWeight="900" className={`uppercase tracking-[0.3em] font-black italic shadow-black shadow-black`}>{t('dry_bulb_temp')} (°C)</text><text x={pad.left + gridWidth + 65} y={pad.top + gridHeight/2} transform={`rotate(-90, ${pad.left + gridWidth + 65}, ${pad.top+gridHeight/2})`} textAnchor="middle" fill={ui.svgAxis} fontSize="14" fontWeight="900" className={`uppercase tracking-[0.3em] font-black italic shadow-black shadow-black`}>{t('humidity_ratio')} (g/kg)</text>
        {/* Property chips — INSIDE the SVG at the same y as the dry-bulb
            label so they cannot drift when the chart scales (controller). */}
        {(() => {
            const currentAhu = ahuData && ahuData.find(a => a.id === selectedAhuId);
            let tVal = indicatorPos && Number.isFinite(indicatorPos.t) ? indicatorPos.t : null;
            let wVal = indicatorPos && Number.isFinite(indicatorPos.w) ? indicatorPos.w : null;
            if (lockedVavId && currentAhu) {
                const lv = currentAhu.vavs && currentAhu.vavs.find(v => v.id === lockedVavId);
                if (lv && Number.isFinite(lv.t)) {
                    tVal = lv.t;
                    wVal = lv.w != null ? lv.w : (typeof getW === 'function' ? getW(lv.t, lv.rh) : null);
                }
            }
            if (tVal == null || wVal == null || typeof getH !== 'function') return null;
            const Wg = wVal * 1000;
            const Pv = typeof getPv === 'function' ? getPv(wVal) : (wVal * 101.325) / (0.621945 + wVal);
            const vSp = typeof getV === 'function' ? getV(tVal, wVal) : null;
            const hVal = getH(tVal, wVal);
            const tdp = typeof getTdpFromW === 'function' ? getTdpFromW(wVal) : null;
            const twb = typeof getTwb === 'function' ? getTwb(tVal, wVal) : null;
            const fmt = (n, d) => (Number.isFinite(n) ? n.toFixed(d) : '—');
            const chips = [
                { key: 'W',   sym: 'W',   val: fmt(Wg, 1),   unit: 'g/kg',   color: '#a3e635', title: 'Absolute humidity (humidity ratio)', active: false },
                { key: 'Pv',  sym: 'Pv',  val: fmt(Pv, 2),   unit: 'kPa',    color: '#a78bfa', title: 'Vapor pressure', active: false },
                { key: 'v',   sym: 'v',   val: fmt(vSp, 3),  unit: 'm³/kg',  color: '#fb7185', title: 'Specific volume (air volume)', active: false },
                { key: 'h',   sym: 'h',   val: fmt(hVal, 1), unit: 'kJ/kg',  color: '#f472b6', title: 'Enthalpy', active: !!(vecVis && vecVis.enthalpy) },
                { key: 'Tdp', sym: 'Tdp', val: fmt(tdp, 1),  unit: '°C',     color: '#fbbf24', title: 'Dew point', active: false },
                { key: 'Twb', sym: 'Twb', val: fmt(twb, 1),  unit: '°C',     color: '#2dd4bf', title: 'Wet bulb', active: false },
            ];
            // Dry-bulb label baseline is pad.top+gridHeight+70. Chip row
            // height 22 → top at +59 centers the chips on that label row.
            // X starts ~one pill past the centered label (label ~±110 from mid).
            const labelY = pad.top + gridHeight + 70;
            const chipH = 22;
            const chipY = labelY - 16;
            const chipX = pad.left + gridWidth / 2 + 200;
            const chipW = Math.max(120, width - chipX - 8);
            return (
                <foreignObject data-testid="psy-axis-prop-chips"
                               x={chipX} y={chipY} width={chipW} height={chipH + 2}
                               style={{ overflow: 'visible' }}>
                    <div xmlns="http://www.w3.org/1999/xhtml"
                         style={{
                             display: 'flex',
                             justifyContent: 'flex-end',
                             alignItems: 'center',
                             gap: '4px',
                             height: '100%',
                             width: '100%',
                             boxSizing: 'border-box',
                             fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                         }}>
                        {chips.map(c => (
                            <span key={c.key}
                                  title={c.title}
                                  data-testid={`psy-chip-${c.key}`}
                                  style={{
                                      display: 'inline-flex',
                                      alignItems: 'baseline',
                                      gap: '4px',
                                      height: chipH,
                                      padding: '0 7px 0 6px',
                                      borderRadius: 999,
                                      border: `1px solid ${c.active ? c.color : (theme === 'dark' ? '#475569' : '#cbd5e1')}`,
                                      background: c.active
                                          ? (theme === 'dark' ? 'rgba(15,23,42,0.92)' : 'rgba(255,255,255,0.95)')
                                          : (theme === 'dark' ? 'rgba(15,23,42,0.82)' : 'rgba(255,255,255,0.9)'),
                                      color: c.active ? '#f1f5f9' : (theme === 'dark' ? '#94a3b8' : '#64748b'),
                                      boxShadow: c.active ? `inset 3px 0 0 ${c.color}` : 'none',
                                      fontSize: 10,
                                      fontWeight: 700,
                                      whiteSpace: 'nowrap',
                                      lineHeight: '22px',
                                  }}>
                                <span style={{ color: c.active ? c.color : 'inherit', fontWeight: 900 }}>{c.sym}</span>
                                <span style={{ fontVariantNumeric: 'tabular-nums', color: c.active ? '#f8fafc' : (theme === 'dark' ? '#cbd5e1' : '#334155') }}>{c.val}</span>
                                <span style={{ fontSize: 8, color: theme === 'dark' ? '#64748b' : '#94a3b8' }}>{c.unit}</span>
                            </span>
                        ))}
                    </div>
                </foreignObject>
            );
        })()}
    </svg>
    {/* Legend — relocated 2026-06-26 from horizontal bottom-strip to a
        vertical stack parked in the chart's mid-left gutter (low T,
        mid-W area), where it doesn't collide with the Y-axis tick
        numbers (HUMIDITY RATIO) on the left edge or the ENTHALPY
        diagonals at the top.  All controls (weather toggle, location
        chip, fetch-status pill, save-error pill, tomorrow forecast)
        retain their original behaviour and data-testids.

        Phase L.43 (2026-06-27): legend is now draggable — the operator
        can park it anywhere the chart background isn't busy.  Drag
        handle = the legend body itself (process-line rows still
        toggle on click; the drag starts only if the pointer moves
        > 4 px before mouseup).  Position persisted to localStorage
        under `red5.legendOffset`. */}
    {(() => {
        const [legendOffset, setLegendOffset] = React.useState(() => {
            try { return JSON.parse(localStorage.getItem('red5.legendOffset') || 'null') || {x:0,y:0}; }
            catch (_) { return {x:0,y:0}; }
        });
        const [legendDrag, setLegendDrag] = React.useState(null);
        const legendRef = React.useRef(null);
        /* Clamp the offset so the legend always stays fully inside the
           chart host frame (Phase L.43 follow-up, 2026-06-27).  Computed
           on every mousemove from the *live* legend + host bounds, so
           it also recovers gracefully if the operator resizes the
           browser mid-drag.  A 6 px margin keeps the legend off the
           frame edges. */
        const clampOffset = (dx, dy) => {
            const el = legendRef.current;
            if (!el) return { x: dx, y: dy };
            const host = el.closest('.red5-graphic-zone') || el.parentElement;
            if (!host) return { x: dx, y: dy };
            const hb = host.getBoundingClientRect();
            const lb = el.getBoundingClientRect();
            // Convert proposed offset into a hypothetical bounding box.
            const proposedLeft  = lb.left + (dx - legendOffset.x);
            const proposedTop   = lb.top  + (dy - legendOffset.y);
            const M = 6;
            let outX = dx, outY = dy;
            if (proposedLeft < hb.left + M)                outX = dx + (hb.left + M - proposedLeft);
            if (proposedLeft + lb.width > hb.right - M)    outX = dx - (proposedLeft + lb.width - (hb.right - M));
            if (proposedTop  < hb.top + M)                 outY = dy + (hb.top + M - proposedTop);
            if (proposedTop  + lb.height > hb.bottom - M)  outY = dy - (proposedTop + lb.height - (hb.bottom - M));
            return { x: outX, y: outY };
        };
        React.useEffect(() => {
            if (!legendDrag) return;
            const onMove = (e) => {
                const proposedX = legendDrag.baseX + (e.clientX - legendDrag.startX);
                const proposedY = legendDrag.baseY + (e.clientY - legendDrag.startY);
                setLegendOffset(clampOffset(proposedX, proposedY));
            };
            const onUp = () => {
                setLegendDrag(null);
                try { localStorage.setItem('red5.legendOffset', JSON.stringify(legendOffset)); } catch (_) {}
            };
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup',   onUp);
            return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
        }, [legendDrag, legendOffset]);
        /* Listen for an app-wide reset event (fired by the gear menu /
           Setup walk "↺ Reset Legend Position" link) so operators who
           accidentally drag the legend off the visible area can
           recover with one click.  Clears state + localStorage. */
        React.useEffect(() => {
            const onReset = () => {
                setLegendOffset({x:0,y:0});
                try { localStorage.removeItem('red5.legendOffset'); } catch (_) {}
            };
            window.addEventListener('r5-reset-legend-position', onReset);
            return () => window.removeEventListener('r5-reset-legend-position', onReset);
        }, []);
        const startDrag = (e) => {
            // Don't start drag if the click landed on an interactive
            // child (button, select, anchor) — those should retain
            // their own click semantics.
            const tag = (e.target && e.target.tagName || '').toUpperCase();
            if (tag === 'BUTTON' || tag === 'SELECT' || tag === 'A' || tag === 'INPUT') return;
            setLegendDrag({
                startX: e.clientX,
                startY: e.clientY,
                baseX:  legendOffset.x,
                baseY:  legendOffset.y,
            });
            e.stopPropagation();
        };
        return (
    <div data-testid="psy-chart-legend"
         ref={legendRef}
         onMouseDown={startDrag}
         style={{transform: `translate(${legendOffset.x}px, calc(-50% + ${legendOffset.y}px))`, cursor: legendDrag ? 'grabbing' : 'grab'}}
         className={`absolute top-1/2 left-16 flex flex-col gap-2 p-3 ${theme==='dark'?'bg-slate-900/80 shadow-black/40 border-slate-800':'bg-white/90 shadow-slate-300/60 border-slate-200'} rounded-xl border shadow-2xl z-30 font-black text-[10px] ${ui.textMuted} uppercase tracking-widest backdrop-blur-sm select-none`}>
        {/* Tiny grab affordance so operators discover the drag. */}
        <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full ${theme==='dark'?'bg-slate-700':'bg-slate-300'} opacity-60`} title="Drag the legend to reposition (it can't leave the chart frame)" />
        {/* Reset-position icon — only shows when the legend has been
            moved.  One click restores the default mid-left-gutter
            parking spot and clears localStorage so the legend stays
            put next time the dashboard loads. */}
        {(legendOffset.x !== 0 || legendOffset.y !== 0) && (
            <button
                data-testid="legend-reset-position"
                onClick={(e) => {
                    e.stopPropagation();
                    setLegendOffset({x:0,y:0});
                    try { localStorage.removeItem('red5.legendOffset'); } catch (_) {}
                }}
                onMouseDown={(e) => e.stopPropagation()}
                title="Reset legend to its default position"
                className={`absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full border text-[10px] font-black transition-all ${theme==='dark' ? 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-indigo-600 hover:text-white hover:border-indigo-400' : 'bg-white border-slate-300 text-slate-600 hover:bg-indigo-500 hover:text-white hover:border-indigo-500'}`}>
                {'\u21BA'}
            </button>
        )}
        {/* Process-line swatches are now interactive toggles (2026-06-26):
            clicking a row flips vecVis[key] so the corresponding vector
            family hides/shows on the chart.  Dimmed + line-through =
            currently hidden.  Replaces the old toggle buttons from the
            removed floating AHU detail card. */}
        {[
            { key:'enthalpy',   label: t('enthalpy'),   color:'#f472b6', dotCls:'border-pink-400'    },
            { key:'latent',     label: t('latent'),     color:'#facc15', dotCls:'border-yellow-400'  },
            { key:'sensible',   label: t('sensible'),   color:'#60a5fa', dotCls:'border-blue-400'    },
            { key:'diagnostic', label: t('diagnostic'), color:'#10b981', dotCls:'border-emerald-500' },
        ].map(item => {
            const on = !!(vecVis && vecVis[item.key]);
            return (
                <button key={item.key}
                        data-testid={`legend-toggle-${item.key}`}
                        onClick={() => setVecVis && setVecVis({ ...vecVis, [item.key]: !on })}
                        title={on ? `Hide ${item.label} vectors` : `Show ${item.label} vectors`}
                        className={`flex items-center gap-2 whitespace-nowrap font-mono bg-transparent border-0 p-0 cursor-pointer transition-opacity ${on ? '' : 'opacity-40 line-through'} hover:opacity-100`}
                        style={{color:'inherit'}}>
                    <span className={`inline-block w-6 h-0 border-t-2 border-dashed ${item.dotCls}`}></span>
                    <span>{item.label}</span>
                </button>
            );
        })}
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
        );
    })()}
</div>
    );
}
