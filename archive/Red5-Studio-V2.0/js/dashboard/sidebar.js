/* ------------------------------------------------------------------
 * dashboard/sidebar.js — left sidebar (docked / floating / popped).
 * ------------------------------------------------------------------
 *
 * Extracted from app.js in Phase L.27 (2026-06-24).  At 519 lines it
 * is by far the largest remaining IIFE in the App component -- covers
 * the top header bar, language menu, gear/help/audit chips, view-tab
 * switcher (PSYCH / DIAG / DYNAM / 3D WX), the Givoni Engine toggle,
 * 40-60 % RH clamp slider, comfort presets (A/B/C+/C-), the sweet-
 * spot + T-clip range sliders, asset search, axis settings, OA/SA/RA
 * dot legend, and the per-AHU detail pills.
 *
 * Same function-style pattern as the other extracted modules: `ctx`
 * destructures App's state + setters + helpers; body is byte-identical
 * to the pre-extraction IIFE modulo one block of dedent.
 *
 * Ctx props expected (58):
   *   sidebarWidth, setSidebarWidth, sidebarFloating, setSidebarFloating, sidebarFloatPos, sidebarFloatSize
   *   sidebarPopoutWin, sidebarPopoutHost, popOutSidebarToWindow, onSidebarResizeMouseDown, onSidebarTitleMouseDown, activeView
   *   setActiveView, theme, ui, darkLevel, setDarkLevel, i18nReady
   *   searchTerm, setSearchTerm, filteredAhuData, selectedAhuId, setSelectedAhuId, setShowFloorPlanForAhu
   *   pointVisibility, setPointVisibility, showGivoni, setShowGivoni, showSweetSpot, setShowSweetSpot
   *   sweetSpotRange, setSweetSpotRange, tClipRange, setTClipRange, tempRange, setTempRange
   *   bandClampApplied, setBandClampApplied, bandClampBusy, setBandClampBusy, setBandClampModal, clampSpark
   *   telemetryStatus, pluginHealth, ervSnap, red5DocsIndex, getEnergyMetrics, getH
   *   setAhuModalSize, setVavModalSize, setFloorPlanModalSize, setShowConfigAuth, setConfigPwInput, setConfigPwError
   *   openCollectorCfg, fetchJSON, toast, t
 * ------------------------------------------------------------------ */

function renderSidebar(ctx) {
    // Dark-mode brightness slider bounds.  Mirror of the constants in app.js
    // (lines 77-78); duplicated here because the sidebar's dark-level UI was
    // extracted into its own module and can no longer see App's closure
    // scope.  Keep the two copies in sync if either side is tuned.
    const DARK_LEVEL_MIN = 1.5;
    const DARK_LEVEL_MAX = 3.0;
    const DARK_LEVEL_DEFAULT = 2.0;
    const { sidebarWidth, setSidebarWidth, sidebarFloating, setSidebarFloating, sidebarFloatPos, sidebarFloatSize, sidebarPopoutWin, sidebarPopoutHost, popOutSidebarToWindow, onSidebarResizeMouseDown, onSidebarTitleMouseDown, activeView, setActiveView, theme, ui, darkLevel, setDarkLevel, i18nReady, searchTerm, setSearchTerm, filteredAhuData, selectedAhuId, setSelectedAhuId, setShowFloorPlanForAhu, pointVisibility, setPointVisibility, showGivoni, setShowGivoni, showSweetSpot, setShowSweetSpot, sweetSpotRange, setSweetSpotRange, tClipRange, setTClipRange, tempRange, setTempRange, bandClampApplied, setBandClampApplied, bandClampBusy, setBandClampBusy, setBandClampModal, clampSpark, telemetryStatus, pluginHealth, ervSnap, red5DocsIndex, getEnergyMetrics, getH, setAhuModalSize, setVavModalSize, setFloorPlanModalSize, setShowConfigAuth, setConfigPwInput, setConfigPwError, openCollectorCfg, fetchJSON, toast, t } = ctx;

    /* ---------------- Venue preset chip --------------------------------
       Mirror of the RH_PRESETS list in setup_walk_mockup.html (the source
       of truth for venue-type RH bands).  Keep the two lists in sync. */
    const VENUE_PRESETS = [
        { id:'office',     label:'Office',           icon:'🏢', lo:30, hi:60 },
        { id:'museum',     label:'Museum',           icon:'🏛',  lo:40, hi:55 },
        { id:'hotel',      label:'Hotel',            icon:'🛏',  lo:30, hi:60 },
        { id:'library',    label:'Library',          icon:'📚', lo:40, hi:55 },
        { id:'hospital',   label:'Hospital',         icon:'⚕',  lo:30, hi:60 },
        { id:'lecture',    label:'Lecture hall',     icon:'🎓', lo:30, hi:60 },
        { id:'concert',    label:'Concert hall',     icon:'🎼', lo:40, hi:55 },
        { id:'meeting',    label:'Meeting room',     icon:'💬', lo:30, hi:60 },
        { id:'exhibition', label:'Exhibition hall',  icon:'🖼',  lo:40, hi:55 },
    ];
    /* Resolve preset:
       1. honour `localStorage['red5_rh_preset']` IF its lo/hi match the live sweetSpotRange
       2. else pick the first VENUE_PRESETS row that matches lo/hi exactly
       3. else fall back to 'Custom'  */
    let venuePreset = null;
    try {
        const saved = localStorage.getItem('red5_rh_preset');
        if (saved) {
            const v = VENUE_PRESETS.find(x => x.id === saved);
            if (v && v.lo === sweetSpotRange.lo && v.hi === sweetSpotRange.hi) venuePreset = v;
        }
    } catch (e) { /* localStorage unavailable */ }
    if (!venuePreset) {
        venuePreset = VENUE_PRESETS.find(v => v.lo === sweetSpotRange.lo && v.hi === sweetSpotRange.hi) || null;
    }
    const venueChipLabel = venuePreset ? venuePreset.label.toUpperCase() : 'CUSTOM';
    const venueChipIcon  = venuePreset ? venuePreset.icon : '🎚';
    const venueChipTitle = venuePreset
        ? `Venue preset: ${venuePreset.label} (${venuePreset.lo}-${venuePreset.hi}% RH) — click to change in setup walk`
        : `Custom RH band (${sweetSpotRange.lo}-${sweetSpotRange.hi}% RH) — click to pick a venue preset`;

    const isPoppedToWin   = !!sidebarPopoutWin;
    const isPoppedFloat   = sidebarFloating && !isPoppedToWin;
    const isPopped        = isPoppedFloat || isPoppedToWin;
    const sidebarTree = (
<div
    className={`${ui.sidebar} ${ui.text} ${isPopped ? '' : 'border-r ' + ui.border} flex flex-col z-20 shadow-2xl overflow-hidden flex-shrink-0 relative`}
    style={isPopped ? {width:'100%',height:'100%',minHeight:0} : { width: `${sidebarWidth}px` }}
    data-testid={isPoppedToWin ? "left-sidebar-popped-window" : (isPoppedFloat ? "left-sidebar-popped" : "left-sidebar")}
>
    {/* Inline resize handle only used when docked.  Float
        mode has the floating-shell corner grip; cross-window
        mode has the OS window border. */}
    {!isPopped && (
    <div
        data-testid="sidebar-resize-handle"
        onMouseDown={(e) => {
            e.preventDefault();
            const startX = e.clientX;
            const startW = sidebarWidth;
            const onMove = (mv) => {
                const next = Math.max(250, Math.min(400, startW + (mv.clientX - startX)));
                setSidebarWidth(next);
                try { localStorage.setItem('red5.sidebarWidth', String(next)); } catch (e) {}
            };
            const onUp = () => {
                window.removeEventListener('mousemove', onMove);
                window.removeEventListener('mouseup', onUp);
            };
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onUp);
        }}
        className="absolute top-0 right-0 h-full w-1 cursor-col-resize z-30 hover:bg-indigo-500/40"
        title={window.t ? window.t("drag_to_resize") : "Drag to resize"}
    />
    )}
    <div className="p-4 pb-3 border-b border-slate-800 font-black" style={{overflow:'visible'}}>
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-lg font-black italic uppercase tracking-tighter text-indigo-400 font-mono shadow-black whitespace-nowrap">{t('ahu_diagnostic_hub')}</h1>
                <div className="flex items-center gap-2 mt-1">
                    <p className="text-[9px] text-slate-500 tracking-widest uppercase">by Delta Controls</p>
                    {/* Telemetry Status Badge -- extracted to telemetry-status-badge.js (L.26) */}
                    {renderTelemetryStatusBadge({ telemetryStatus })}

                </div>
            </div>
            <div className="flex items-center gap-1 flex-wrap justify-end">
            {/* Plugin-health chip - polls /api/services once on
                mount.  Surfaces missing or failed plugins at a
                glance so the operator does not discover them
                only by clicking a feature and getting a
                PLUGIN_MISSING error (e.g. the band-overrides
                case). */}
            {(() => {
                const h = pluginHealth;
                if (h.state === 'unknown') return null;
                const isOk    = h.state === 'ok';
                const isWarn  = h.state === 'warn';
                // Tailwind JIT only picks up CLASS NAMES that appear as
                // complete literal strings in the source -- dynamic
                // interpolation like `bg-${color}-900/40` would compile
                // to runtime bytes that JIT never sees, so the chip
                // would render unstyled.  Enumerate every variant.
                const cls = isOk
                    ? (theme === 'dark'
                        ? 'bg-emerald-900/40 border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/60'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100')
                    : (isWarn
                        ? (theme === 'dark'
                            ? 'bg-amber-900/40 border-amber-700/50 text-amber-300 hover:bg-amber-900/60'
                            : 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100')
                        : (theme === 'dark'
                            ? 'bg-rose-900/40 border-rose-700/50 text-rose-300 hover:bg-rose-900/60'
                            : 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100'));
                const dot   = isOk ? '\u25CF' : (isWarn ? '\u25B2' : '\u2716');
                const lines = [];
                if (h.missing && h.missing.length) {
                    lines.push('Missing (' + h.missing.length + '):');
                    for (const m of h.missing) lines.push('  - ' + m + ' (upload to /root/data/pgpy/ + restart Flask)');
                }
                if (h.failed && h.failed.length) {
                    lines.push('Loaded but not OK (' + h.failed.length + '):');
                    for (const f of h.failed) lines.push('  - ' + f.name + ' [' + f.state + '] ' + (f.detail || ''));
                }
                if (h.detail) lines.push('Probe error: ' + h.detail);
                if (!lines.length) lines.push('All ' + h.total + ' Flask plug-ins registered OK');
                const tip = lines.join('\n');
                return (
                    <button
                        data-testid="plugin-health-chip"
                        data-state={h.state}
                        title={tip}
                        onClick={() => toast(tip)}
                        className={`flex-shrink-0 px-1.5 py-1 border rounded text-[8px] font-black uppercase tracking-wider transition-all ${cls}`}
                    >
                        {dot} {isOk ? 'OK' : (isWarn ? 'WARN' : (h.missing && h.missing.length ? 'PLUGIN' : 'ERR'))}
                    </button>
                );
            })()}
            {/* Cross-window pop-out - opens a separate
                browser window the operator can drag to an
                extended display.  Mirrors the AHU / VAV /
                Floor-Plan modal pattern.  Hidden when the
                sidebar is already in a popout window
                (operator brings it back via the "Bring
                Back" button in the docked placeholder). */}
            {!sidebarPopoutWin && (
            <button
                onClick={popOutSidebarToWindow}
                className={`px-1.5 py-1 border rounded text-[8px] font-black uppercase tracking-wider transition-all flex-shrink-0 ${theme==='dark'?'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-violet-500 hover:text-violet-300':'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200 hover:border-violet-500 hover:text-violet-700'}`}
                title="Pop the sidebar out to a separate browser window (extended display)"
                data-testid="popout-sidebar-window-btn"
            >
                {'\u29C9 WIN'}
            </button>
            )}
            {/* DIM slider relocated 2026-06-25 to the setup walk's
                "Psy Chart Setting" page (theme + brightness now live
                under the same RH/Givoni configuration screen).  The
                live values are still read from localStorage keys
                `red5.theme` and `red5.darkLevel` by app.js, so this
                sidebar's removal is purely UI -- no behaviour
                change.  Click the venue-preset chip to reach setup. */}
            </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {/* Language selector relocated to /setup.html → Language Setting
                (2026-06-26).  The setup walk now writes localStorage.i18n_lang
                directly, so the dashboard simply reads whatever is current. */}
            {/* ----- Venue Preset chip ------------------------------------------------
                Tiny pill that shows the operator which industry-standard RH band
                is currently active (Office / Museum / Hotel / Library / Hospital /
                Lecture hall / Concert hall / Meeting room / Exhibition hall) or
                "Custom" if the live sweetSpotRange doesn't match any preset.
                Clicking it opens the setup walk so the operator can re-pick.    */}
            <button
                onClick={() => { window.location.href = '/setup.html?force=1'; }}
                data-testid="venue-preset-chip"
                title={venueChipTitle}
                aria-label={venueChipTitle}
                className={`flex items-center gap-1 px-2 py-1 rounded border text-[10px] font-black uppercase tracking-wider transition-all ${
                    venuePreset
                        ? (theme === 'dark'
                            ? 'bg-emerald-900/30 border-emerald-600/60 text-emerald-300 hover:bg-emerald-800/40'
                            : 'bg-emerald-50 border-emerald-400 text-emerald-700 hover:bg-emerald-100')
                        : (theme === 'dark'
                            ? 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
                            : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200')
                }`}>
                <span aria-hidden style={{fontSize:'11px'}}>{venueChipIcon}</span>
                <span data-testid="venue-preset-chip-label">{venueChipLabel}</span>
                <span className="font-mono opacity-70 tabular-nums">{sweetSpotRange.lo}-{sweetSpotRange.hi}%</span>
            </button>
            {/* Standards / Docs button — single entry point.
                Opens the docs popup at whichever tab the
                operator was last reading (G36 cross-walk on
                first ever open, since that's the default
                activeId in localStorage). */}
            <button
                onClick={() => window.red5DocsIndex && window.red5DocsIndex.open()}
                data-testid="standards-btn"
                title="Open Standards — ASHRAE Guideline 36 cross-walk, Band Guide, Control Algorithms, B-Shift Insight, Psych Design Workflow"
                aria-label="Open Standards"
                className={`p-1.5 rounded border transition-all ${theme==='dark'?'bg-slate-800 border-slate-600 text-violet-400 hover:bg-slate-700 hover:border-violet-400':'bg-slate-100 border-slate-300 text-violet-600 hover:bg-violet-50'}`}>
                <Icon name="book-open" />
            </button>
            <button onClick={openCollectorCfg} className={`p-1.5 rounded border transition-all ${theme==='dark'?'bg-slate-800 border-slate-600 text-cyan-400 hover:bg-slate-700 hover:border-cyan-400':'bg-slate-100 border-slate-300 text-cyan-600 hover:bg-cyan-50'}`} data-testid="collector-config-btn" title={window.t ? window.t("collector_configuration") : "Collector Configuration"} aria-label="Collector Configuration">
                <Icon name="radio-tower" />
            </button>
            <button onClick={() => { setConfigPwInput(''); setConfigPwError(''); setShowConfigAuth(true); }} className={`p-1.5 ${theme==='dark'?'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-amber-500 hover:text-amber-400':'bg-slate-100 border-slate-300 text-slate-600 hover:bg-amber-50 hover:text-amber-600'} border rounded transition-all`} title={t('config')} aria-label={t('config')}>
                <Icon name="settings" />
            </button>
            {/* Reset Modal Sizes: clears localStorage entries
                for the AHU / VAV / Floor Plan modal dimensions
                so the next time an operator opens a modal it
                falls back to the safe defaults.  Useful when
                a modal got accidentally shrunk to an unusable
                size (the resize:both handle has no minimum
                limit short of 400x300).  Brief green flash
                on success so the user sees the action
                registered without an alert/toast.  Icon-only
                since the tooltip carries the semantic. */}
            <button data-testid="reset-modal-sizes-btn"
                    onClick={(e) => {
                        try {
                            localStorage.removeItem('red5AhuModalSize');
                            localStorage.removeItem('red5VavModalSize');
                            localStorage.removeItem('red5FloorPlanModalSize');
                        } catch(_) {}
                        setAhuModalSize({ w: 1600, h: 900 });
                        setVavModalSize({ w: 1400, h: 850 });
                        setFloorPlanModalSize({ w: 1400, h: 900 });
                        const b = e.currentTarget;
                        b.dataset.flashed = '1';
                        b.style.color = '#22c55e';
                        b.style.borderColor = '#22c55e';
                        setTimeout(() => {
                            b.style.color = '';
                            b.style.borderColor = '';
                            delete b.dataset.flashed;
                        }, 1100);
                    }}
                    title="Reset AHU / VAV / Floor Plan modal sizes to their defaults. Clears the stored sizes from local storage."
                    aria-label="Reset modal sizes"
                    className={`p-1.5 ${theme==='dark'?'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-cyan-400 hover:text-cyan-400':'bg-slate-100 border-slate-300 text-slate-600 hover:bg-cyan-50 hover:text-cyan-600'} border rounded transition-all`}>
                <Icon name="rotate-ccw" />
            </button>
        </div>
    </div>
    <div className={`flex border-b ${ui.border}`} data-testid="view-tabs" style={{gap:'1px'}}>
        {[
            {id:'chart',     label:t('psych_tab'),     color:'indigo', full:t('psychrometric_chart')},
            {id:'diagnostics',label:t('diag'),  color:'emerald',full:t('diagnostics_console')},
            {id:'dynamics',  label:t('dynam_tab'),     color:'violet', full:t('dynamics_animation')},
            {id:'weather3d', label:t('weather_3d_short'), color:'sky', full:t('weather_3d')}
        ].map(tab => {
            const active = activeView === tab.id;
            const colorMap = {indigo:'99,102,241',emerald:'52,211,153',violet:'167,139,250',sky:'56,189,248'};
            const rgb = colorMap[tab.color];
            return React.createElement('button', {
                key: tab.id,
                onClick: () => setActiveView(tab.id),
                title: tab.full,
                'data-testid': 'tab-'+tab.id,
                className: 'flex-1 py-2 text-[9px] font-black uppercase tracking-[0.12em] transition-all flex items-center justify-center gap-1.5 min-w-0 ' +
                    (active
                        ? 'border-b-2'
                        : (theme==='dark' ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')),
                style: active ? {color:'rgb('+rgb+')', borderBottomColor:'rgb('+rgb+')', background:'rgba('+rgb+',0.08)'} : {}
            },
                React.createElement('span', {style:{width:6,height:6,borderRadius:'50%',flexShrink:0,background: active ? 'rgb('+rgb+')' : (theme==='dark'?'#334155':'#cbd5e1')}})  ,
                React.createElement('span', {style:{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}, tab.label)
            );
        })}
    </div>
    <div className={`p-4 border-b ${ui.border} bg-opacity-50`}>
        {/* Givoni Engine toggle and RH-band indicator pill removed
            2026-06-26 — both controls are now owned by the setup walk's
            Psy Chart Setting page (left-side preview).  The overlay
            stays ON by default (showGivoni/showSweetSpot initialised
            true in app.js), so the chart still renders the Givoni
            regions and the sweet-spot band; only the toggle UI is
            gone from the dashboard.  The slider below remains. */}

        {/* Tier legend chip — relocated to the VAV Terminal Hub header
            (psy-chart-svg.js) so the colour key lives next to the table
            that uses it.  Sidebar no longer renders it. */}

        {/* Sweet Spot Slider -- extracted to sweet-spot-slider.js (L.26) */}
        {renderSweetSpotSlider({
            showGivoni, showSweetSpot, sweetSpotRange, setSweetSpotRange, theme,
            bandClampApplied, setBandClampApplied,
            bandClampBusy, setBandClampBusy,
            setBandClampModal,
            clampSpark,
            fetchJSON, toast,
        })}

        {/* T-CLIP dual-handle slider — bounds the 3D WX
            RH-band slab to the operator's occupied-space
            comfort T window.  Same dual-handle pattern as
            the RH slider above, in magenta to visually
            tie back to the RH-BAND chip in the 3D WX
            legend.  Pure 3D visualisation control — no
            Apply-to-Controller wiring needed.  Only
            rendered when the 3D WX tab is in focus
            (`activeView === 'weather3d'`) — under any
            other tab the slider has no visible effect
            and just clutters the sidebar. */}
        {/* T Clip Slider -- extracted to t-clip-slider.js (L.26) */}
        {renderTClipSlider({ tClipRange, setTClipRange, theme, activeView })}

    </div>
    <div className={`p-4 border-b ${ui.border} bg-opacity-10 space-y-2`}><h2 className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.2em] px-1 font-black shadow-black">{t('asset_search')}</h2><input type="text" placeholder="Search ID (Wildcard *, ?)..." className={`w-full ${theme==='dark'?'bg-slate-950':'bg-slate-100'} border ${ui.border} rounded-xl py-2 px-4 text-[11px] focus:outline-none focus:border-indigo-500 font-medium ${ui.text}`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
    {/* AXIS SETTINGS removed from dashboard 2026-06-26 — the dry-bulb
        temperature axis range is now owned by the setup walk's
        Psy Chart Setting page (/setup.html?force=1).  The dashboard
        reads `localStorage.red5_temp_range` lazily and listens for
        `r5-temp-range-change` events for live updates, so removing
        the inline slider here has no functional regression — only
        the duplicate control is gone. */}
    <div className={`p-4 border-b ${ui.border} bg-opacity-5`}><div className="flex justify-between items-center px-2">{['OA', 'SA', 'RA'].map(p => { const configs = { OA: { rgb: '59, 130, 246' }, SA: { rgb: '16, 185, 129' }, RA: { rgb: '244, 63, 94' } }; const labels = { OA: t('oa'), SA: t('sa'), RA: t('ra') }; const active = pointVisibility[p]; const c = configs[p]; return <button key={p} onClick={() => setPointVisibility({...pointVisibility, [p]: !pointVisibility[p]})} className="w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center font-black text-[10px] shadow-black" style={{ backgroundColor: active ? `rgb(${c.rgb})` : `rgba(${c.rgb}, 0.15)`, borderColor: active ? (theme==='dark'?'#fff':'#000') : `rgb(${c.rgb})`, color: active ? '#fff' : `rgb(${c.rgb})`, opacity: active ? 1 : 0.6 }}>{labels[p]}</button>; })}</div></div>
    {/* ERV ROI badge — only shown when the 3D WX tab's ERV
        chip is ON. Click anywhere on the badge to jump
        directly to the 3D WX tab + the rollout panel. */}
    {ervSnap && ervSnap.enabled && isFinite(ervSnap.totalUSD) && (
        <div onClick={() => setActiveView('weather3d')}
             data-testid="erv-roi-badge"
             className={`mx-2 mt-2 p-2 rounded-lg border cursor-pointer hover:opacity-90 transition-opacity`}
             style={{ borderColor: '#22d3ee', background: 'rgba(34,211,238,.08)' }}>
            <div className="flex items-center justify-between gap-2 font-mono text-[10px]">
                <span style={{ color: '#22d3ee' }} className="font-black uppercase tracking-widest">ERV</span>
                <span className={ui.text}>
                    <b style={{ color: '#22d3ee' }}>
                        {ervSnap.totalUSD >= 1e6 ? '$' + (ervSnap.totalUSD/1e6).toFixed(2) + 'M'
                         : ervSnap.totalUSD >= 1e3 ? '$' + (ervSnap.totalUSD/1e3).toFixed(1) + 'k'
                         : '$' + ervSnap.totalUSD.toFixed(0)}
                    </b>
                    <span className="opacity-70"> /yr · </span>
                    <b style={{ color: isFinite(ervSnap.payback) && ervSnap.payback < 5 ? '#a3e635' : '#fbbf24' }}>
                        {isFinite(ervSnap.payback)
                            ? (ervSnap.payback < 99 ? ervSnap.payback.toFixed(1) + ' yr' : '>99 yr')
                            : 'never'}
                    </b>
                    <span className="opacity-70"> payback</span>
                </span>
            </div>
            <div className="font-mono text-[8px] opacity-60 mt-0.5">
                ε={ervSnap.eps ? ervSnap.eps.toFixed(2) : '0.80'} · {ervSnap.zone || 'KR-Seoul'} · {(ervSnap.totalKWh/1000).toFixed(0)}k kWh/yr
            </div>
        </div>
    )}
    <div className={`flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar bg-opacity-20`}>{filteredAhuData.map(ahu => { 
        const isSelected = selectedAhuId === ahu.id; 
        const m = getEnergyMetrics(ahu); 
        return ( 
            <div key={ahu.id} onClick={() => { setSelectedAhuId(ahu.id); setShowFloorPlanForAhu(null); }} className={`p-3 rounded-xl border transition-all cursor-pointer ${isSelected ? ui.itemSelected : ui.border + ' bg-opacity-50 hover:bg-opacity-40'}`}>
                <div className="flex justify-between items-center mb-1 font-black uppercase text-xs shadow-black"><div className="flex items-center gap-1.5">{ahu.id}<a href={`/ahu.html?id=${encodeURIComponent(ahu.id)}`} target="_blank" rel="noopener noreferrer" onClick={(e)=>e.stopPropagation()} title="Open per-AHU performance detail" data-testid={`ahu-drill-${ahu.id}`} className="text-[10px] px-1.5 py-0.5 rounded border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400 transition-colors leading-none font-bold tracking-widest">DETAIL ↗</a></div><div className="flex gap-1.5"><MetricBar theme={theme} val={m.exchange} color="#3b82f6" height="h-5" max={20}/><MetricBar theme={theme} val={m.absorption} color="#f472b6" height="h-5" max={20}/></div></div>
                <div className="space-y-0.5">{ahu.points?.map(p => { const pt = Number(p.t); const prh = Number(p.rh); const pw = Number(p.w); const tTxt = Number.isFinite(pt) ? pt.toFixed(1) + '°' : '--'; const rhTxt = Number.isFinite(prh) ? prh.toFixed(0) + '%' : '--%'; const hTxt = (Number.isFinite(pt) && Number.isFinite(pw)) ? getH(pt, pw).toFixed(1) + 'h' : '--h'; return ( <div key={p.label} className={`flex items-center justify-between font-mono text-[9px] opacity-90 border-b ${theme==='dark'?'border-white/5':'border-black/5'} last:border-0 py-0.5`}><span style={{ color: p.color }} className="font-black uppercase tracking-tighter shadow-black">{p.label}</span><span className={`${ui.text} font-bold font-mono tracking-tighter`}>{tTxt} / {rhTxt} / {hTxt}</span></div> ); })}</div>
                {ahu.g36 && (() => {
                    /* G36 chip — operating mode + request counts + reset values.
                       Color picked from the mode so a glance tells you what's
                       happening: green=occupied, amber=warm/cool-down,
                       cyan=pre_cooling, slate=unoccupied/setback/setup,
                       red=freeze. */
                    const modeColors = {
                        occupied:          '#10b981',
                        warm_up:           '#f59e0b',
                        cool_down:         '#22d3ee',
                        setback:           '#64748b',
                        setup:             '#64748b',
                        freeze_protection: '#ef4444',
                        unoccupied:        '#475569',
                        pre_cooling:       '#06b6d4',
                    };
                    const c = modeColors[ahu.g36.mode] || '#94a3b8';
                    const satTxt = (typeof ahu.g36.sat_reset_c === 'number') ? ahu.g36.sat_reset_c.toFixed(1) + '°' : '--';
                    const dspTxt = (typeof ahu.g36.dsp_reset_pa === 'number') ? Math.round(ahu.g36.dsp_reset_pa) + 'Pa' : '--';
                    return (
                        <div data-testid={`g36-chip-${ahu.id}`}
                             title={'G36 mode: ' + (ahu.g36.mode || '?') + '\n' + (ahu.g36.mode_reason || '') +
                                    '\nCool req: ' + (ahu.g36.cooling_requests || 0) +
                                    '   Heat req: ' + (ahu.g36.heating_requests || 0) +
                                    '   Press req: ' + (ahu.g36.pressure_requests || 0)}
                             className={`mt-1.5 px-2 py-1 rounded border flex items-center justify-between gap-2 font-mono text-[8px] ${theme==='dark' ? 'bg-slate-900/60 border-slate-700' : 'bg-white border-slate-200'}`}>
                            <div className="flex items-center gap-1.5">
                                <span style={{background: c, boxShadow: `0 0 6px ${c}`}} className="inline-block w-2 h-2 rounded-full" />
                                <span style={{color: c}} className="font-black uppercase tracking-wider">G36 · {ahu.g36.mode || '?'}</span>
                            </div>
                            <div className={`flex gap-1.5 ${theme==='dark' ? 'text-slate-400' : 'text-slate-600'} tracking-tighter`}>
                                <span>SAT {satTxt}</span>
                                <span>DSP {dspTxt}</span>
                                <span className={ahu.g36.cooling_requests > 0 ? 'text-cyan-400' : ''}>C{ahu.g36.cooling_requests || 0}</span>
                                <span className={ahu.g36.pressure_requests > 0 ? 'text-amber-400' : ''}>P{ahu.g36.pressure_requests || 0}</span>
                            </div>
                        </div>
                    );
                })()}
            </div> 
        ); 
    })}</div>
</div>
    );
    if (isPoppedToWin && sidebarPopoutHost) {
        // Cross-window mode: portal the sidebar React tree
        // into the popup window's host div + render a THIN
        // vertical rail (~36 px) in place of the old docked
        // column so the chart claims the freed real estate.
        // The rail itself is clickable -- click anywhere on
        // it to close the popup and bring the sidebar back.
        const placeholder = (
            <button
                type="button"
                data-testid="sidebar-window-attach"
                onClick={() => { try { sidebarPopoutWin.close(); } catch (e) {} }}
                title="Sidebar is on the extended display.  Click to bring it back."
                className={`flex flex-col items-center justify-center py-2 z-20 flex-shrink-0 cursor-pointer transition-all border-r ${theme==='dark' ? 'bg-slate-950 border-indigo-500/30 hover:bg-indigo-900/20 text-indigo-300' : 'bg-slate-50 border-slate-300 hover:bg-indigo-50 text-indigo-600'}`}
                style={{ width: '32px' }}
            >
                <span className="text-[11px] font-black mb-1">{'\u29C9'}</span>
                {/* Vertical "SIDEBAR \u2192 EXT DISPLAY \u00B7 CLICK TO BRING BACK"
                    rotated so it reads upward along the rail. */}
                <span
                    className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '0.2em' }}
                    data-testid="sidebar-window-placeholder"
                >
                    {'\u21A9 Click to bring back \u00B7 Sidebar on extended display'}
                </span>
            </button>
        );
        return (
            <React.Fragment>
                {placeholder}
                {ReactDOM.createPortal(sidebarTree, sidebarPopoutHost)}
            </React.Fragment>
        );
    }
    if (isPoppedFloat) {
        // In-page floating shell.  Same document, so mouse
        // events for every existing drag-handler (including
        // the psychart temp slider) work unchanged.
        return (
            <div
                className={`fixed z-[80] rounded-xl shadow-2xl overflow-hidden ${theme==='dark' ? 'border border-indigo-500/40 bg-slate-900' : 'border border-slate-300 bg-white'}`}
                style={{
                    left: sidebarFloatPos.x + 'px',
                    top:  sidebarFloatPos.y + 'px',
                    width:  sidebarFloatSize.w + 'px',
                    height: sidebarFloatSize.h + 'px',
                }}
                data-testid="sidebar-floating-shell"
            >
                <div
                    onMouseDown={onSidebarTitleMouseDown}
                    className={`cursor-grab active:cursor-grabbing flex items-center justify-between px-3 py-1.5 border-b ${theme==='dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}
                    data-testid="sidebar-floating-titlebar"
                >
                    <span className={`text-[10px] font-black uppercase tracking-widest ${theme==='dark' ? 'text-indigo-300' : 'text-indigo-600'}`}>
                        {'\u2725 Sidebar \u2014 drag to move'}
                    </span>
                    <div className="flex items-center gap-1">
                        {/* Escalation: send the floating panel out to a separate window
                            without losing position state.  Float -> window. */}
                        <button
                            data-no-drag
                            data-testid="sidebar-floating-to-window"
                            onClick={popOutSidebarToWindow}
                            className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border transition-all ${theme==='dark' ? 'bg-slate-700 border-slate-500 text-slate-200 hover:bg-cyan-700 hover:border-cyan-400' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-cyan-100 hover:border-cyan-400'}`}
                            title="Send the sidebar to a separate browser window (extended display)"
                        >{'\u29C9 To Window'}</button>
                        <button
                            data-no-drag
                            data-testid="sidebar-floating-attach"
                            onClick={() => setSidebarFloating(false)}
                            className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border bg-emerald-700 border-emerald-400 text-slate-100 hover:bg-emerald-600 transition-all"
                            title="Re-attach sidebar to the docked position"
                        >{'\u21A9 Attach'}</button>
                    </div>
                </div>
                <div className="flex flex-col" style={{ height: 'calc(100% - 30px)' }}>
                    {sidebarTree}
                </div>
                <div
                    onMouseDown={onSidebarResizeMouseDown}
                    title="Drag to resize"
                    data-testid="sidebar-floating-resize"
                    className={`absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize z-[81] ${theme==='dark' ? 'bg-indigo-500/40 hover:bg-indigo-500/80' : 'bg-indigo-300 hover:bg-indigo-500'}`}
                    style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
                />
            </div>
        );
    }
    return sidebarTree;
}
