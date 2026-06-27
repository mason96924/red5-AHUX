const { useState, useMemo } = React;

/* =========================================================================
 * STEP DEFINITIONS — the 4 walk paths the user described
 * ========================================================================= */
const STEPS = [
    { key:'psy',      label:'Psy Chart Setting',    sub:'Givoni · RH range · axis range', kind:'page',  iconColor:'#818cf8', accent:'indigo' },
    { key:'location', label:'Location Setting',     sub:'City name & lat / long',         kind:'modal', iconColor:'#fbbf24', accent:'amber' },
    { key:'language', label:'Language Setting',     sub:'EN · FR · ES · ZH · …',          kind:'modal', iconColor:'#34d399', accent:'emerald' },
    { key:'plugins',  label:'Plug-in Setting',      sub:'List · upload · modify',         kind:'modal', iconColor:'#f472b6', accent:'pink' },
];

/* =========================================================================
 * ROOT APP
 * ========================================================================= */
function App() {
    /* completion + per-step config -- mockup state, never persisted */
    const [done, setDone] = useState({ psy:false, location:false, language:false, plugins:false });
    const [route, setRoute] = useState('hub');   // 'hub' | 'psy'
    const [modal, setModal] = useState(null);     // 'location' | 'language' | 'plugins' | null

    const [psyCfg, setPsyCfg]         = useState({ givoni:true, rhPreset:'office', rhLo:30, rhHi:60, tLo:-15, tHi:50, theme:'dark', darkLevel:2.0 });
    const [locCfg, setLocCfg]         = useState({ siteName:'My Building', city:'Toronto, ON', lat:43.6532, lon:-79.3832 });
    const [langCfg, setLangCfg]       = useState(() => {
        /* Lazy init from the same localStorage key the dashboard reads, so
         * reopening the setup walk shows the currently-active language
         * rather than always defaulting to English. */
        try {
            const v = localStorage.getItem('i18n_lang');
            const allowed = ['en','zh-CN','zh-TW','ja','ko'];
            if (v && allowed.indexOf(v) !== -1) return { lang: v };
        } catch (e) { /* private mode -> fall through */ }
        return { lang:'en' };
    });
    const [pluginCfg, setPluginCfg]   = useState({ enabled:['weather','givoni','sweet_spot'] });

    const completeCount = Object.values(done).filter(Boolean).length;

    const finish = (key) => {
        setDone(d => ({...d, [key]:true}));
        setRoute('hub');
        setModal(null);
    };

    /* full-page Psy Chart editor */
    if (route === 'psy') {
        return <PsyChartSettingPage cfg={psyCfg} setCfg={setPsyCfg}
                                    onBack={() => setRoute('hub')}
                                    onSave={() => finish('psy')} />;
    }

    /* default: HUB screen */
    return (
        <div className="min-h-screen px-6 py-8">
            {/* ------------- header ------------- */}
            <div className="max-w-5xl mx-auto flex items-center justify-between mb-10 fade-up">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight">
                        <span className="text-red-500">Red5</span> <span className="text-white">Studio</span>
                        <span className="text-slate-500 font-normal italic"> &nbsp;/&nbsp; setup walk</span>
                    </h1>
                    <p className="text-slate-500 text-xs mt-1 font-mono tracking-wide">Configure once. Skip any step you don't need.</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="pill bg-slate-800 text-slate-400">{completeCount}/4 DONE</span>
                    <a href="/dashboard.html"
                       onClick={() => { try { localStorage.setItem('red5.setup.done','1'); } catch(e){} }}
                       className="text-xs text-slate-500 hover:text-slate-300 underline underline-offset-4">Skip all →</a>
                </div>
            </div>

            {/* ------------- tile grid ------------- */}
            <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5 fade-up" style={{animationDelay:'.08s'}}>
                {STEPS.map((s, i) => (
                    <Tile key={s.key}
                          step={s}
                          done={done[s.key]}
                          index={i+1}
                          onClick={() => s.kind === 'page' ? setRoute(s.key) : setModal(s.key)} />
                ))}
            </div>

            {/* ------------- footer CTA ------------- */}
            <div className="max-w-5xl mx-auto mt-10 flex items-center justify-between fade-up" style={{animationDelay:'.18s'}}>
                <p className="text-slate-500 text-xs font-mono">
                    {completeCount === 0 && '↑ Pick a setting to start, or skip all and go straight to the dashboard.'}
                    {completeCount > 0 && completeCount < 4 && `↑ ${4 - completeCount} step${4 - completeCount === 1 ? '' : 's'} remaining (optional).`}
                    {completeCount === 4 && '✓ All steps configured.  Ready when you are.'}
                </p>
                <a href="/dashboard.html"
                   onClick={() => { try { localStorage.setItem('red5.setup.done','1'); } catch(e){} }}
                   className={`px-7 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all
                              ${completeCount === 4
                                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'}`}>
                    Open Dashboard →
                </a>
            </div>

            {/* ------------- modals ------------- */}
            {modal === 'location' && <LocationModal cfg={locCfg} setCfg={setLocCfg}
                                                   onClose={() => setModal(null)}
                                                   onSave={() => finish('location')} />}
            {modal === 'language' && <LanguageModal cfg={langCfg} setCfg={setLangCfg}
                                                   onClose={() => setModal(null)}
                                                   onSave={() => finish('language')} />}
            {modal === 'plugins'  && <PluginsModal  cfg={pluginCfg} setCfg={setPluginCfg}
                                                   onClose={() => setModal(null)}
                                                   onSave={() => finish('plugins')} />}
        </div>
    );
}

/* =========================================================================
 * Tile (large easy-on-eyes button)
 * ========================================================================= */
function Tile({ step, done, index, onClick }) {
    return (
        <button onClick={onClick}
                data-testid={`setup-tile-${step.key}`}
                aria-label={`Open ${step.label}`}
                className={`tile-btn relative text-left bg-slate-900/70 border-2 border-slate-700/70
                            rounded-2xl p-6 sm:p-7 ${done ? 'done' : ''}`}>
            {done && <span className="check" data-testid={`setup-tile-${step.key}-done`}>✓</span>}
            <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                     style={{background:`${step.iconColor}22`, border:`1px solid ${step.iconColor}55`}}>
                    <TileIcon kind={step.key} color={step.iconColor} />
                </div>
                <div className="text-3xl font-black text-slate-700">0{index}</div>
            </div>
            <h3 className="text-lg sm:text-xl font-black uppercase tracking-wider mb-1"
                style={{color:step.iconColor}}>{step.label}</h3>
            <p className="text-slate-400 text-sm leading-snug">{step.sub}</p>
            <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                <span className="pill bg-slate-800 text-slate-400">{step.kind === 'page' ? 'Full page' : 'Popup'}</span>
                {done && <span className="pill bg-emerald-900/40 text-emerald-400">Configured</span>}
            </div>
        </button>
    );
}

function TileIcon({ kind, color }) {
    /* simple inline SVGs so we keep the file self-contained */
    const stroke = { stroke:color, fill:'none', strokeWidth:2, strokeLinecap:'round', strokeLinejoin:'round' };
    if (kind === 'psy')      return <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}><path d="M3 3v18h18"/><path d="M3 17c4-1 7-6 9-9s5-3 9-2"/></svg>;
    if (kind === 'location') return <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}><path d="M12 22s-7-6.4-7-12a7 7 0 1 1 14 0c0 5.6-7 12-7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>;
    if (kind === 'language') return <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>;
    if (kind === 'plugins')  return <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}><path d="M9 3v6M15 3v6"/><path d="M5 9h14v6a4 4 0 0 1-4 4h-1v3M9 19v3"/></svg>;
    return null;
}

/* =========================================================================
 * Psy Chart Setting -- FULL PAGE, live skeleton responds to controls
 * ========================================================================= */
function PsyChartSettingPage({ cfg, setCfg, onBack, onSave }) {
    const update = (k, v) => setCfg(c => ({...c, [k]:v}));

    /* On mount: hydrate from the SAME localStorage key the dashboard reads
     * (`red5_sweet_spot_range`) plus the preset id (`red5_rh_preset`) so
     * the dropdown label stays consistent with the slider values across
     * reloads.  If the operator has already tuned the RH band on the
     * dashboard, the setup walk starts from those values. */
    React.useEffect(() => {
        try {
            const raw    = localStorage.getItem('red5_sweet_spot_range');
            const preset = localStorage.getItem('red5_rh_preset');
            const patch  = {};
            if (raw) {
                const p = JSON.parse(raw);
                if (Number.isFinite(p.lo) && Number.isFinite(p.hi) && p.lo < p.hi) {
                    patch.rhLo = p.lo;
                    patch.rhHi = p.hi;
                }
            }
            if (preset && RH_PRESETS.find(x => x.id === preset)) {
                patch.rhPreset = preset;
            }
            /* Theme + brightness — same keys app.js (dashboard) reads. */
            const th = localStorage.getItem('red5.theme');
            if (th === 'light' || th === 'dark') patch.theme = th;
            const dl = parseFloat(localStorage.getItem('red5.darkLevel'));
            if (Number.isFinite(dl) && dl >= 1.5 && dl <= 3.0) patch.darkLevel = dl;
            /* Temperature axis range — written by this same page's save
             * handler; load it here so reopening the setup walk shows the
             * current dashboard axis instead of always defaulting to -15..50. */
            try {
                const trRaw = localStorage.getItem('red5_temp_range');
                if (trRaw) {
                    const tr = JSON.parse(trRaw);
                    if (Number.isFinite(tr.min) && Number.isFinite(tr.max) && tr.min < tr.max) {
                        patch.tLo = tr.min;
                        patch.tHi = tr.max;
                    }
                }
            } catch (e) { /* ignore */ }
            if (Object.keys(patch).length) setCfg(c => ({...c, ...patch}));
        } catch (e) { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* On save: persist the RH band to localStorage so the dashboard's
     * sweet-spot polygon picks it up on next load.  Also persist the venue
     * preset id (for future "show preset name on dashboard" features). */
    const persistAndSave = () => {
        try {
            localStorage.setItem('red5_sweet_spot_range',
                JSON.stringify({ lo: cfg.rhLo, hi: cfg.rhHi }));
            if (cfg.rhPreset) {
                localStorage.setItem('red5_rh_preset', cfg.rhPreset);
            }
            /* Theme + brightness — written to the SAME keys the dashboard
             * (app.js lines 57-58 and 84-97) reads as its useState lazy
             * initialiser, so the chosen theme takes effect on next dashboard
             * load.  app.js treats darkLevel >= 3.0 as light-mode trigger. */
            if (cfg.theme === 'light' || cfg.theme === 'dark') {
                localStorage.setItem('red5.theme', cfg.theme);
            }
            if (Number.isFinite(cfg.darkLevel)) {
                localStorage.setItem('red5.darkLevel', String(cfg.darkLevel));
            }
            /* Temperature axis range — drives the dashboard's psy chart
             * X axis (`tempRange.min/max` in app.js).  We write the same
             * shape app.js reads (`{min, max}`) so its lazy useState init
             * picks it up on next load, AND dispatch a custom event so
             * any open dashboard tab updates live without a refresh. */
            if (Number.isFinite(cfg.tLo) && Number.isFinite(cfg.tHi) && cfg.tLo < cfg.tHi) {
                localStorage.setItem('red5_temp_range',
                    JSON.stringify({ min: cfg.tLo, max: cfg.tHi }));
                window.dispatchEvent(new CustomEvent('r5-temp-range-change', {
                    detail: { min: cfg.tLo, max: cfg.tHi }
                }));
            }
            window.dispatchEvent(new CustomEvent('r5-rh-band-change', {
                detail: { lo: cfg.rhLo, hi: cfg.rhHi }
            }));
            console.info('[setup walk] psy chart saved -> RH', cfg.rhLo, '-', cfg.rhHi,
                         '% T-axis', cfg.tLo, '..', cfg.tHi, '°C preset=', cfg.rhPreset);
        } catch (e) {
            console.warn('[setup walk] could not persist psy settings:', e);
        }
        onSave();
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                <button onClick={onBack}
                        className="text-slate-400 hover:text-white text-xs uppercase tracking-widest font-black">
                    ← Back to setup
                </button>
                <h1 className="text-sm uppercase tracking-[0.3em] font-black text-indigo-400">Psy Chart Setting</h1>
                <button onClick={persistAndSave}
                        className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs uppercase tracking-widest font-black">
                    Save & return ✓
                </button>
            </div>

            {/* body — chart left, controls right */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 p-6 max-w-7xl mx-auto w-full">
                <PsySkeleton cfg={cfg} />
                <PsyControlPanel cfg={cfg} update={update} setCfg={setCfg} />
            </div>
        </div>
    );
}

/* RH band presets — recognised industry standards for each venue type.
 * Sources: ASHRAE 55 (comfort), ASHRAE 170 (healthcare),
 * AAM/NPS/Smithsonian guidance (collections), CIBSE TM40 (libraries). */
const RH_PRESETS = [
    { id:'custom',          label:'Custom (manual)',                 lo:null, hi:null, note:'' },
    { id:'office',          label:'Office',                          lo:30,   hi:60,   note:'ASHRAE 55 comfort'                  },
    { id:'museum',          label:'Museum',                          lo:40,   hi:55,   note:'AAM collection preservation'        },
    { id:'hotel',           label:'Hotel guest room',                lo:30,   hi:60,   note:'general occupant comfort'           },
    { id:'library',         label:'Library / Archive',               lo:40,   hi:55,   note:'paper & binding preservation'       },
    { id:'hospital',        label:'Hospital (general)',              lo:30,   hi:60,   note:'ASHRAE 170 patient areas'           },
    { id:'lecture',         label:'Lecture hall',                    lo:30,   hi:60,   note:'high occupancy comfort'             },
    { id:'concert',         label:'Concert hall',                    lo:40,   hi:55,   note:'instrument tuning stability'        },
    { id:'meeting',         label:'Meeting room',                    lo:30,   hi:60,   note:'small group comfort'                },
    { id:'exhibition',      label:'Exhibition hall',                 lo:40,   hi:55,   note:'mixed art / artifact display'       },
];

/* Real psy chart — uses the SAME getW + GIVONI_COLORS + polygon math as the
 * production dashboard.  Source of truth:  js/psychrometric.js  and the
 * renderGivoniOverlay() block at app.js:1641-1722.
 * Anything you change in those files MUST be mirrored here. */
function PsySkeleton({ cfg }) {
    /* Canvas + padding */
    const W = 760, H = 480;
    const pad = { left: 56, right: 40, top: 28, bottom: 56 };
    const gridW = W - pad.left - pad.right;
    const gridH = H - pad.top  - pad.bottom;

    const T_MIN = cfg.tLo, T_MAX = cfg.tHi;
    const W_MIN = 0,       W_MAX = 0.030;          // kg/kg

    /* axis scales -- match the live dashboard */
    const x  = (t) => pad.left + ((t - T_MIN) / (T_MAX - T_MIN)) * gridW;
    const y  = (w) => pad.top  + (1 - (w - W_MIN) / (W_MAX - W_MIN)) * gridH;
    const _getW = (typeof getW === 'function') ? getW : ((t, rh) => 0);

    const safePts = (arr) => arr.map(p => `${(x(p[0])||0).toFixed(2)},${(y(p[1])||0).toFixed(2)}`).join(' ');

    /* ---- Givoni polygons -- COPIED VERBATIM from app.js:1643-1669 ---- */
    const rh80 = []; for (let t=20; t<=25; t+=0.5) rh80.push([t, _getW(t, 80)]);
    const rh100= []; for (let t=20; t<=27; t+=0.5) rh100.push([t, _getW(t, 100)]);
    const rh20Line = []; for (let t=32; t>=20; t-=0.5) rh20Line.push([t, _getW(t, 20)]);
    const rh20_CZ  = []; for (let t=27; t>=20; t-=0.5) rh20_CZ.push([t, _getW(t, 20)]);
    const CZ   = [...rh80, [27, _getW(27, 50)], [27, _getW(27, 20)], ...rh20_CZ];

    const rhHi_top = []; for (let tt=20; tt<=27; tt+=0.5) rhHi_top.push([tt, _getW(tt, cfg.rhHi)]);
    const rhLo_bot = []; for (let tt=27; tt>=20; tt-=0.5) rhLo_bot.push([tt, _getW(tt, cfg.rhLo)]);
    const SWEET = [...rhHi_top, ...rhLo_bot];

    const NV   = [...rh100, [32, 15.4/1000], [32, 6.2/1000], ...rh20Line];
    const Mass = [...rh80, [33, 16/1000], [37, _getW(37, 30)], [37, 3/1000], [20, _getW(20, 20)]];
    const MCV  = [...rh80, [40, 16/1000], [44, _getW(44, 20)], [44, 3/1000], [20, _getW(20, 20)]];
    const EVAP = [...rh80, [25, 16/1000], [36, _getW(36, 30)], [39, _getW(39, 20)],
                  [41, _getW(41, 10)], [41, 0], [27.2, 0], [20, _getW(20, 20)]];

    const winterRH80 = []; for (let t=18; t<=19.5; t+=0.5) winterRH80.push([t, _getW(t, 80)]);
    const winterRH20 = []; for (let t=19.5; t>=18; t-=0.5) winterRH20.push([t, _getW(t, 20)]);
    const WINTER = [...winterRH80, ...winterRH20];

    /* RH isopleth curves for the chart grid */
    const isopleths = [20, 40, 60, 80, 100];

    /* Theme palette — drives the live preview so the dim/light controls
     * have visible feedback right on the chart.  In dim/dark mode we also
     * apply a CSS brightness filter mapped from cfg.darkLevel (1.5 .. 2.8
     * → 0.6 .. 1.4) so the user can SEE the brightness slider working. */
    const isLight = cfg.theme === 'light';
    const palette = isLight
        ? { bg:'#f8fafc', grid:'#cbd5e1', tick:'#475569', axis:'#1e293b',
            panelBg:'rgba(248,250,252,0.85)', panelBorder:'#cbd5e1',
            pillBg:'#e2e8f0', pillFg:'#475569', metaFg:'#64748b' }
        : { bg:'#0b1220', grid:'#1e293b', tick:'#94a3b8', axis:'#cbd5e1',
            panelBg:'rgba(15,23,42,0.6)', panelBorder:'#1e293b',
            pillBg:'#1e293b', pillFg:'#94a3b8', metaFg:'#64748b' };
    const dimFilter = isLight
        ? 'none'
        : `brightness(${(Math.max(1.5, Math.min(2.8, cfg.darkLevel || 2.0)) / 2.0).toFixed(2)})`;

    return (
        <div className="rounded-2xl p-4 border transition-colors duration-300"
             style={{background: palette.panelBg, borderColor: palette.panelBorder}}>
            <div className="flex items-center justify-between mb-3">
                <span className="pill" style={{background:palette.pillBg, color:palette.pillFg}}>PSYCHROMETRIC CHART · live preview</span>
                <span className="text-[10px] font-mono" style={{color:palette.metaFg}}>{T_MIN}°C → {T_MAX}°C  ·  {cfg.rhLo}–{cfg.rhHi}% RH</span>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto transition-[filter] duration-300"
                 style={{background: palette.bg, borderRadius:8, filter: dimFilter}}>
                {/* ---- grid: vertical T lines, horizontal W lines ---- */}
                {Array.from({length:11}).map((_,i) => {
                    const t = T_MIN + (i/10) * (T_MAX - T_MIN);
                    return (
                        <g key={'vt'+i}>
                            <line x1={x(t)} y1={pad.top} x2={x(t)} y2={pad.top+gridH}
                                  stroke={palette.grid} strokeWidth="0.6"/>
                            <text x={x(t)} y={pad.top+gridH+16} fontSize="9.5" fill={palette.tick}
                                  textAnchor="middle">{t.toFixed(0)}</text>
                        </g>
                    );
                })}
                {Array.from({length:7}).map((_,i) => {
                    const w = W_MIN + (i/6) * (W_MAX - W_MIN);
                    return (
                        <g key={'hw'+i}>
                            <line x1={pad.left} y1={y(w)} x2={pad.left+gridW} y2={y(w)}
                                  stroke={palette.grid} strokeWidth="0.6"/>
                            <text x={pad.left-8} y={y(w)+3} fontSize="9.5" fill={palette.tick}
                                  textAnchor="end">{(w*1000).toFixed(0)}</text>
                        </g>
                    );
                })}
                {/* ---- RH isopleths (curves) ---- */}
                {isopleths.map(rh => {
                    const pts = [];
                    for (let t = T_MIN; t <= T_MAX; t += 0.5) {
                        const ww = _getW(t, rh);
                        if (ww >= W_MIN && ww <= W_MAX) pts.push([t, ww]);
                    }
                    return (
                        <g key={'iso'+rh}>
                            <polyline points={safePts(pts)} fill="none"
                                      stroke={rh === 100 ? '#6366f1' : '#ec489955'} strokeWidth="0.8"
                                      strokeDasharray={rh === 100 ? '' : '3,3'}/>
                            {pts.length > 0 && (
                                <text x={x(pts[Math.floor(pts.length*0.65)][0])}
                                      y={y(pts[Math.floor(pts.length*0.65)][1]) - 4}
                                      fontSize="9" fill="#ec489999" fontWeight="700">{rh}%</text>
                            )}
                        </g>
                    );
                })}

                {/* ---- Givoni overlay (copied verbatim from app.js render order) ---- */}
                {cfg.givoni && (
                    <g className="pointer-events-none" opacity="0.9">
                        <line x1={x(40)} y1={y(16/1000)} x2={x(50)} y2={y(16/1000)}
                              stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4,4"/>
                        <line x1={x(50)} y1={y(16/1000)} x2={x(50)} y2={y(0)}
                              stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4,4"/>
                        <line x1={x(41)} y1={y(0)} x2={x(50)} y2={y(0)}
                              stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4,4"/>

                        <polygon points={safePts(MCV)}  fill="#ec4899" fillOpacity="0.05" stroke="#ec4899" strokeWidth="1"/>
                        <polygon points={safePts(Mass)} fill="#8b5cf6" fillOpacity="0.05" stroke="#8b5cf6" strokeWidth="1"/>
                        <polygon points={safePts(EVAP)} fill="#06b6d4" fillOpacity="0.08" stroke="#06b6d4" strokeWidth="1"/>
                        <polygon points={safePts(NV)}   fill="#f59e0b" fillOpacity="0.05" stroke="#f59e0b" strokeWidth="1"/>
                        <polygon points={safePts(CZ)}   fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeWidth="1.2"/>

                        {/* Sweet-spot band, clipped to CZ */}
                        <defs>
                            <clipPath id="cz-clip-walk" clipPathUnits="userSpaceOnUse">
                                <polygon points={safePts(CZ)}/>
                            </clipPath>
                        </defs>
                        <polygon points={safePts(SWEET)} clipPath="url(#cz-clip-walk)"
                                 fill="#059669" fillOpacity="0.32" stroke="#047857" strokeWidth="0.8" strokeDasharray="3,2"/>

                        <polygon points={safePts(WINTER)} fill="#3b82f6" fillOpacity="0.15" stroke="none"/>
                        <line x1={x(19)} y1={pad.top+18} x2={x(19)} y2={pad.top+gridH}
                              stroke="#3b82f6" strokeWidth="2" strokeDasharray="6,4" opacity="0.8"/>

                        {/* Region labels — same colors & spirit as live chart */}
                        <text x={x(50)-10} y={y(8/1000)} fill="#6366f1" fontSize="10" fontWeight="900"
                              textAnchor="middle" transform={`rotate(-90, ${x(50)-10}, ${y(8/1000)})`}
                              letterSpacing="2">MECHANICAL COOLING</text>
                        <text x={x(44)-2} y={y(8/1000)} fill="#ec4899" fontSize="9" fontWeight="900"
                              textAnchor="middle" transform={`rotate(-90, ${x(44)-2}, ${y(8/1000)})`}
                              letterSpacing="1.5">MASS COOLING</text>
                        <text x={x(37)-10} y={y(8/1000)} fill="#8b5cf6" fontSize="9" fontWeight="900"
                              textAnchor="middle" transform={`rotate(-90, ${x(37)-10}, ${y(8/1000)})`}
                              letterSpacing="1.5">MASS COOLING</text>
                        <text x={x(34)} y={y(0.5/1000)-8} fill="#06b6d4" fontSize="9" fontWeight="900"
                              textAnchor="middle" letterSpacing="2">EVAPORATIVE</text>
                        <text x={x(23.5)} y={y(_getW(23.5, 45))} fill="#10b981" fontSize="11"
                              fontWeight="900" textAnchor="middle" letterSpacing="1.5">COMFORT</text>
                        <text x={x(18.75)} y={y(_getW(18.75, 45))} fill="#3b82f6" fontSize="11"
                              fontWeight="900" textAnchor="middle"
                              transform={`rotate(-90, ${x(18.75)}, ${y(_getW(18.75, 45))})`}>WINTER</text>
                        <text x={x(23.5)} y={y(_getW(23.5, (cfg.rhLo+cfg.rhHi)/2))}
                              fill="#022c22" fontSize="8" fontWeight="900" textAnchor="middle"
                              style={{paintOrder:'stroke', stroke:'#a7f3d0', strokeWidth:'2.5px', strokeLinejoin:'round'}}
                              letterSpacing="1.5">{cfg.rhLo}-{cfg.rhHi}% RH</text>
                    </g>
                )}

                {/* axis labels */}
                <text x={pad.left + gridW/2} y={H-12} fontSize="11" fill={palette.axis}
                      textAnchor="middle" fontWeight="800" letterSpacing="2">DRY BULB TEMP (°C)</text>
                <text x={16} y={pad.top + gridH/2} fontSize="11" fill={palette.axis}
                      textAnchor="middle" fontWeight="800" letterSpacing="2"
                      transform={`rotate(-90 16 ${pad.top + gridH/2})`}>HUMIDITY RATIO (g/kg)</text>
            </svg>
        </div>
    );
}

function PsyControlPanel({ cfg, update, setCfg }) {
    return (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-6">
            {/* Theme + brightness  -- relocated from the dashboard sidebar 2026-06-25.
                Two controls: Dark/Light mode toggle, and Brightness slider (only
                meaningful in dark mode).  Live preview applies to the surrounding
                control panel so the operator can FEEL the change before saving. */}
            <div data-testid="psy-cfg-theme-block">
                <div className="field-label mb-2">Display Mode</div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <button data-testid="psy-cfg-theme-dark"
                            onClick={() => setCfg(c => ({...c, theme:'dark', darkLevel:Math.min(c.darkLevel || 2.0, 2.6)}))}
                            className={`py-2.5 rounded-lg text-xs font-black uppercase tracking-widest border transition-all
                                ${cfg.theme === 'dark'
                                    ? 'bg-slate-800 border-yellow-500/70 text-yellow-300 shadow-lg shadow-yellow-500/10'
                                    : 'bg-slate-900/30 border-slate-700 text-slate-500 hover:bg-slate-800/60'}`}>
                        🌙  Dim / Dark
                    </button>
                    <button data-testid="psy-cfg-theme-light"
                            onClick={() => setCfg(c => ({...c, theme:'light', darkLevel:3.0}))}
                            className={`py-2.5 rounded-lg text-xs font-black uppercase tracking-widest border transition-all
                                ${cfg.theme === 'light'
                                    ? 'bg-slate-100 border-sky-500/70 text-sky-700 shadow-lg shadow-sky-500/10'
                                    : 'bg-slate-900/30 border-slate-700 text-slate-500 hover:bg-slate-800/60'}`}>
                        ☀  Light
                    </button>
                </div>
                {/* Brightness slider — only meaningful when theme === 'dark' */}
                <div className={cfg.theme === 'light' ? 'opacity-40 pointer-events-none' : ''}>
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Dim brightness</label>
                        <span className="text-[10px] font-mono text-yellow-300 tabular-nums">{Math.round((cfg.darkLevel || 2.0) * 100)}%</span>
                    </div>
                    <input type="range"
                           data-testid="psy-cfg-dark-level"
                           min="1.5" max="2.8" step="0.02"
                           value={cfg.theme === 'light' ? 2.0 : (cfg.darkLevel || 2.0)}
                           onChange={(e) => setCfg(c => ({...c, darkLevel: parseFloat(e.target.value), theme:'dark'}))}
                           className="range-input w-full"
                           style={{ accentColor:'#facc15' }}/>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 italic">
                    Applied to the whole dashboard.  Dim is recommended for control rooms; Light for daytime walk-throughs.
                </p>
            </div>

            {/* Givoni toggle */}
            <div>
                <div className="field-label mb-2">Givoni Engine</div>
                <button onClick={() => update('givoni', !cfg.givoni)}
                        className={`w-full py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all
                                    ${cfg.givoni
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                        : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                    {cfg.givoni ? 'Givoni ON' : 'Givoni OFF'}
                </button>
                <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                    Overlays the 4 climate-strategy regions (Comfort, Nat Vent, Evap, Mech Cool).
                </p>
            </div>

            {/* RH range */}
            <div>
                <div className="field-label mb-2">RH Sweet-Spot Range</div>
                <div className="mb-3">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1 block">Venue preset</label>
                    <select className="field-input cursor-pointer"
                            value={cfg.rhPreset || 'custom'}
                            onChange={(e) => {
                                const p = RH_PRESETS.find(p => p.id === e.target.value);
                                if (!p) return;
                                if (p.id === 'custom') {
                                    update('rhPreset', 'custom');
                                } else {
                                    setCfg(c => ({...c, rhPreset:p.id, rhLo:p.lo, rhHi:p.hi}));
                                }
                            }}>
                        {RH_PRESETS.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.label}{p.lo != null ? `  ·  ${p.lo}-${p.hi}% RH` : ''}
                            </option>
                        ))}
                    </select>
                    {(() => {
                        const p = RH_PRESETS.find(x => x.id === (cfg.rhPreset || 'custom'));
                        return p && p.note ? (
                            <p className="text-[10px] text-slate-500 mt-1.5 italic">{p.note}</p>
                        ) : null;
                    })()}
                </div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-slate-400 w-10">{cfg.rhLo}%</span>
                    <input type="range" min="20" max={cfg.rhHi-5} value={cfg.rhLo}
                           onChange={(e) => setCfg(c => ({...c, rhLo:+e.target.value, rhPreset:'custom'}))}
                           className="range-input flex-1"/>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-400 w-10">{cfg.rhHi}%</span>
                    <input type="range" min={cfg.rhLo+5} max="90" value={cfg.rhHi}
                           onChange={(e) => setCfg(c => ({...c, rhHi:+e.target.value, rhPreset:'custom'}))}
                           className="range-input flex-1"/>
                </div>
            </div>

            {/* Axis range */}
            <div>
                <div className="field-label mb-2">Temperature Axis Range</div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-slate-400 w-10">{cfg.tLo}°</span>
                    <input type="range" min="-40" max={cfg.tHi-10} value={cfg.tLo}
                           onChange={(e) => update('tLo', +e.target.value)}
                           className="range-input flex-1"/>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-400 w-10">{cfg.tHi}°</span>
                    <input type="range" min={cfg.tLo+10} max="60" value={cfg.tHi}
                           onChange={(e) => update('tHi', +e.target.value)}
                           className="range-input flex-1"/>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                    Chart will be redrawn with this dry-bulb temperature window.
                </p>
            </div>

            <div className="border-t border-slate-800 pt-4">
                <p className="text-[10px] text-slate-500 leading-relaxed">
                    Changes preview live in the skeleton chart on the left.  Hit
                    <span className="text-indigo-400 font-black"> Save & return </span>
                    in the header when you're happy.
                </p>
            </div>
        </div>
    );
}

/* =========================================================================
 * Location Setting -- modal w/ interactive Leaflet map + reverse geocoding
 * Click anywhere on the map (or drag the marker) to set lat/lon.
 * Manual lat/lon edits re-centre the marker.  City name is auto-populated
 * via OpenStreetMap Nominatim (no key required, rate-limited to ~1 req/s).
 * ========================================================================= */
function LocationModal({ cfg, setCfg, onClose, onSave }) {
    const mapBoxRef = React.useRef(null);
    const mapRef    = React.useRef(null);
    const markerRef = React.useRef(null);
    const [geoBusy, setGeoBusy] = React.useState(false);

    /* ----- saved locations (operator-added, surfaced as a datalist on the
     * Site-name input).  We fetch /api/weather-location once on mount and
     * filter out the bundled demo cities so the dropdown shows ONLY what
     * the operator has personally curated -- otherwise the suggestion list
     * is dominated by the seed entries and feels like noise. */
    const BUNDLED_DEFAULT_NAMES = React.useMemo(() => new Set([
        'NRAH (Adelaide)', 'Perth Children Hospital',
        'Hanyang Univ Hospital (Seoul)', 'Beijing Geriatric Hospital',
        "Seattle Children's", 'New York', 'London', 'Berlin',
        'Vancouver', 'Tokyo', 'Ulaanbaatar', 'Taipei',
        'Hong Kong', 'Singapore', 'Sydney',
    ]), []);
    const [customLocs, setCustomLocs] = React.useState([]);
    React.useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const r = await fetch('/api/weather-location', { credentials:'include' });
                if (!r.ok) return;
                const j = await r.json();
                const saved = Array.isArray(j.saved) ? j.saved : [];
                const customs = saved.filter(s => s && s.name && !BUNDLED_DEFAULT_NAMES.has(s.name));
                if (!cancelled) setCustomLocs(customs);
            } catch (e) { /* offline / anon -> no dropdown, no biggie */ }
        })();
        return () => { cancelled = true; };
    }, [BUNDLED_DEFAULT_NAMES]);

    /* When the user picks a name from the datalist (or types one that
     * exactly matches a saved entry), pull its lat/lon and recentre the
     * map.  Free-form typing still works -- the name is just kept as the
     * site label.  Avoids surprising the operator who types "Pavilion B"
     * (a label they invented) and expects the map NOT to jump. */
    const onSiteNameChange = (newName) => {
        setCfg(c => ({...c, siteName:newName}));
        const hit = customLocs.find(s => s.name === newName);
        if (hit && Number.isFinite(hit.lat) && Number.isFinite(hit.lon)) {
            const lat = Math.round(+hit.lat * 10000) / 10000;
            const lon = Math.round(+hit.lon * 10000) / 10000;
            setCfg(c => ({...c, siteName:newName, lat, lon, city:newName}));
            if (mapRef.current) mapRef.current.setView([lat, lon], 11);
        }
    };

    /* ----- search state ----- */
    const [searchQ, setSearchQ]         = React.useState('');
    const [searchHits, setSearchHits]   = React.useState([]);
    const [searchBusy, setSearchBusy]   = React.useState(false);
    const [searchOpen, setSearchOpen]   = React.useState(false);
    const searchDebounceRef             = React.useRef(null);

    /* Forward-geocode: query -> [{lat, lon, display_name, type, ...}] */
    const runSearch = async (q) => {
        if (!q || q.trim().length < 3) { setSearchHits([]); return; }
        try {
            setSearchBusy(true);
            const url = `https://nominatim.openstreetmap.org/search?format=json&limit=6&q=${encodeURIComponent(q)}`;
            const r = await fetch(url, { headers:{ 'Accept':'application/json' } });
            const j = await r.json();
            setSearchHits(Array.isArray(j) ? j : []);
            setSearchOpen(true);
        } catch (e) { setSearchHits([]); }
        finally { setSearchBusy(false); }
    };

    /* debounced search-on-type */
    React.useEffect(() => {
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = setTimeout(() => runSearch(searchQ), 400);
        return () => searchDebounceRef.current && clearTimeout(searchDebounceRef.current);
    }, [searchQ]);

    const pickSearchHit = (hit) => {
        const lat = Math.round(+hit.lat * 10000) / 10000;
        const lon = Math.round(+hit.lon * 10000) / 10000;
        setCfg(c => ({...c, lat, lon, city:hit.display_name}));
        if (mapRef.current) mapRef.current.setView([lat, lon], hit.type === 'city' ? 11 : 15);
        setSearchOpen(false);
        setSearchQ('');
    };

    /* Reverse-geocode lat/lon -> city / country via Nominatim.  No API key. */
    const reverseGeocode = async (lat, lon) => {
        try {
            setGeoBusy(true);
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`;
            const r = await fetch(url, { headers: { 'Accept':'application/json' } });
            const j = await r.json();
            const a = j.address || {};
            const city = a.city || a.town || a.village || a.hamlet || a.county || '';
            const region = a.state || a.region || '';
            const country = a.country || '';
            const label = [city, region, country].filter(Boolean).join(', ') || j.display_name || '';
            if (label) setCfg(c => ({...c, city:label}));
        } catch (e) { /* offline or rate-limited -> keep prior name */ }
        finally { setGeoBusy(false); }
    };

    /* Init Leaflet on first render of the modal */
    React.useEffect(() => {
        if (!mapBoxRef.current || mapRef.current) return;
        const map = L.map(mapBoxRef.current, { zoomControl: true, attributionControl: true })
                     .setView([cfg.lat, cfg.lon], 6);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        const marker = L.marker([cfg.lat, cfg.lon], { draggable: true }).addTo(map);
        marker.bindTooltip('Drag me or click anywhere on the map', { permanent: false });

        const applyLatLon = (lat, lon) => {
            const r = (n) => Math.round(n * 10000) / 10000;
            setCfg(c => ({...c, lat:r(lat), lon:r(lon)}));
            reverseGeocode(r(lat), r(lon));
        };
        marker.on('dragend', () => {
            const ll = marker.getLatLng();
            applyLatLon(ll.lat, ll.lng);
        });
        map.on('click', (e) => {
            marker.setLatLng(e.latlng);
            applyLatLon(e.latlng.lat, e.latlng.lng);
        });

        mapRef.current = map;
        markerRef.current = marker;

        /* Leaflet renders blank if it boots inside a hidden element — kick it
           once the modal animation settles. */
        setTimeout(() => map.invalidateSize(), 250);
        return () => { map.remove(); mapRef.current = null; markerRef.current = null; };
    }, []);

    /* Keep marker in sync when user edits lat/lon fields manually */
    React.useEffect(() => {
        if (mapRef.current && markerRef.current) {
            markerRef.current.setLatLng([cfg.lat, cfg.lon]);
            mapRef.current.panTo([cfg.lat, cfg.lon]);
        }
    }, [cfg.lat, cfg.lon]);

    const useMyLocation = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = Math.round(pos.coords.latitude  * 10000) / 10000;
                const lon = Math.round(pos.coords.longitude * 10000) / 10000;
                setCfg(c => ({...c, lat, lon}));
                if (mapRef.current) mapRef.current.setView([lat, lon], 11);
                reverseGeocode(lat, lon);
            },
            (err) => { /* user denied or unavailable -> no-op */ }
        );
    };

    /* When user clicks "Save & return", POST the selection to the same
     * /api/weather-location endpoint the dashboard reads.  Setting BOTH
     * `active` and `default` means the weather strip on the dashboard
     * loads this location immediately on next page load (and stays pinned
     * for any future fresh sessions).  Anonymous users get a soft warning
     * back from the server (persisted:false) -- we surface that as a toast
     * so the operator knows they need to sign in to keep the pick across
     * page reloads.  We always also write to localStorage so the SAME
     * tab keeps the chosen location for the current session. */
    const [saveMsg, setSaveMsg] = React.useState(null);
    const persistAndSave = async () => {
        const loc = { lat: cfg.lat, lon: cfg.lon, name: cfg.siteName || cfg.city };
        /* Local fallback — works for anonymous users so the dashboard at
         * least sees the new lat/lon in the same browser. */
        try {
            localStorage.setItem('red5.weather_location', JSON.stringify(loc));
        } catch (e) { /* private mode -- ignore */ }

        let persisted = false, warning = '';
        try {
            const r = await fetch('/api/weather-location', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify({ active: loc, default: loc }),
            });
            const j = await r.json();
            window._lastWeatherLocationSave = j;
            persisted = !!j.persisted;
            warning   = j.warning || '';
            console.info('[setup walk] /api/weather-location <-', j);
        } catch (e) {
            warning = 'Network error — saved locally only.';
            console.warn('[setup walk] could not persist location:', e);
        }

        if (persisted) {
            onSave();           // happy path: close + mark step done
        } else {
            /* Surface the warning, hold the modal open for 1.6s so the
             * operator reads it, then close.  The local copy is already
             * written, so the dashboard will still see the new location
             * in this browser session. */
            setSaveMsg(warning || 'Saved locally only — sign in to save server-side.');
            setTimeout(() => { setSaveMsg(null); onSave(); }, 1600);
        }
    };


    return (
        <ModalShell title="Location Setting" subtitle="Click the map, drag the pin, or use your device" accent="amber" onClose={onClose} onSave={persistAndSave} size="max">
            {saveMsg && (
                <div data-testid="loc-save-msg"
                     className="mb-3 px-4 py-2.5 rounded-lg bg-amber-900/30 border border-amber-700/50 text-amber-200 text-xs font-mono">
                    ⚠  {saveMsg}
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 h-full" style={{minHeight:'56vh'}}>
                {/* MAP — fills the left side, with a search bar floating on top */}
                <div className="relative" style={{minHeight:'56vh'}}>
                    <div ref={mapBoxRef}
                         style={{ height:'100%', minHeight:'56vh', width:'100%', borderRadius:'12px',
                                  overflow:'hidden', border:'1px solid #334155', background:'#0b1220' }}/>

                    {/* Search bar overlay — sits in the top-centre of the map */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[500]" style={{width:'min(560px, calc(100% - 110px))'}}>
                        <div className="relative">
                            <input type="text"
                                   value={searchQ}
                                   onChange={(e) => setSearchQ(e.target.value)}
                                   onFocus={() => searchHits.length && setSearchOpen(true)}
                                   placeholder="🔎  Search by address, building, or place name…"
                                   className="w-full px-4 py-2.5 rounded-xl bg-slate-900/95 border border-slate-600 text-slate-100 text-sm placeholder-slate-500 shadow-2xl backdrop-blur"
                                   style={{outline:'none'}}/>
                            {searchBusy && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 text-xs">…</span>
                            )}
                            {searchOpen && searchHits.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900/97 border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto backdrop-blur">
                                    {searchHits.map((h, i) => (
                                        <button key={h.place_id || i}
                                                onClick={() => pickSearchHit(h)}
                                                className="w-full text-left px-4 py-2.5 hover:bg-amber-900/30 border-b border-slate-800 last:border-b-0 transition-all">
                                            <div className="text-sm text-slate-200 truncate">{h.display_name}</div>
                                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
                                                {h.type || h.class} · {(+h.lat).toFixed(3)}, {(+h.lon).toFixed(3)}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {searchOpen && searchHits.length === 0 && searchQ.length >= 3 && !searchBusy && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900/97 border border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-400">
                                    No results for "{searchQ}".  Try a more specific term.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* SIDE PANEL */}
                <div className="space-y-4 overflow-y-auto pr-1">
                    {/* User-friendly site name (the one the operator uses to identify this location).
                        Phase L.44+ : when /api/weather-location returns one or more
                        operator-curated entries (i.e. anything outside the bundled demo
                        set), surface them as a native <datalist> dropdown inside this
                        input.  Picking one auto-fills lat/lon and recentres the map;
                        free-form typing still works for fresh labels. */}
                    <div>
                        <div className="field-label mb-1.5">
                            Site name (saved)
                            {customLocs.length > 0 && (
                                <span className="ml-2 text-amber-400/80 normal-case tracking-normal text-[10px]"
                                      data-testid="loc-saved-hint">
                                    ▾ {customLocs.length} saved
                                </span>
                            )}
                        </div>
                        <input className="field-input" value={cfg.siteName || ''}
                               list={customLocs.length > 0 ? 'red5-saved-locations' : undefined}
                               data-testid="loc-site-name-input"
                               placeholder={customLocs.length > 0
                                   ? 'Pick a saved location, or type a new one…'
                                   : 'e.g. HQ Tower, North Wing, Pavilion B…'}
                               onChange={(e) => onSiteNameChange(e.target.value)}/>
                        {customLocs.length > 0 && (
                            <datalist id="red5-saved-locations">
                                {customLocs.map(loc => (
                                    <option key={loc.name} value={loc.name}>
                                        {Number.isFinite(loc.lat) && Number.isFinite(loc.lon)
                                            ? `${(+loc.lat).toFixed(2)}, ${(+loc.lon).toFixed(2)}`
                                            : ''}
                                    </option>
                                ))}
                            </datalist>
                        )}
                        <p className="text-[10px] text-slate-500 mt-1 italic">
                            {customLocs.length > 0
                                ? 'Pick a previously-saved location, or type a new label for this place.'
                                : 'Your label for this place — shown on the dashboard header.'}
                        </p>
                    </div>

                    <div className="border-t border-slate-800 pt-3">
                        <div className="field-label mb-1.5">
                            Resolved address / city
                            {geoBusy && <span className="ml-2 text-amber-400 normal-case tracking-normal">… resolving</span>}
                        </div>
                        <input className="field-input" value={cfg.city}
                               onChange={(e)=>setCfg({...cfg, city:e.target.value})}/>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <div className="field-label mb-1.5">Latitude</div>
                            <input className="field-input" type="number" step="0.0001" value={cfg.lat}
                                   onChange={(e)=>setCfg({...cfg, lat:+e.target.value})}/>
                        </div>
                        <div>
                            <div className="field-label mb-1.5">Longitude</div>
                            <input className="field-input" type="number" step="0.0001" value={cfg.lon}
                                   onChange={(e)=>setCfg({...cfg, lon:+e.target.value})}/>
                        </div>
                    </div>

                    <button onClick={useMyLocation}
                            className="w-full py-2.5 rounded-lg bg-amber-700/70 border border-amber-500/40 text-xs font-black uppercase tracking-widest text-amber-50 hover:bg-amber-600/70">
                        📍  Use my device location
                    </button>

                    <div className="border-t border-slate-800 pt-3 mt-2">
                        <div className="field-label mb-2">Quick jumps</div>
                        <div className="grid grid-cols-2 gap-1.5">
                            {[
                                { name:'Toronto, ON',   lat:43.6532, lon:-79.3832, z:11 },
                                { name:'New York, NY',  lat:40.7128, lon:-74.0060, z:11 },
                                { name:'London, UK',    lat:51.5074, lon: -0.1278, z:11 },
                                { name:'Paris, FR',     lat:48.8566, lon:  2.3522, z:11 },
                                { name:'Tokyo, JP',     lat:35.6762, lon:139.6503, z:11 },
                                { name:'Sydney, AU',    lat:-33.8688,lon:151.2093, z:11 },
                            ].map(j => (
                                <button key={j.name}
                                        onClick={() => {
                                            setCfg(c => ({...c, lat:j.lat, lon:j.lon, city:j.name}));
                                            if (mapRef.current) mapRef.current.setView([j.lat, j.lon], j.z);
                                        }}
                                        className="text-left px-2.5 py-1.5 rounded-md bg-slate-800/70 border border-slate-700 text-[11px] font-bold text-slate-300 hover:bg-slate-700 hover:border-amber-500/40 transition-all">
                                    {j.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <p className="text-[10px] text-slate-500 leading-relaxed">
                        Tiles: OpenStreetMap · Geocode: Nominatim (free, ~1 req/s).
                        Used for Open-Meteo weather feed and sunrise/sunset estimation.
                    </p>
                </div>
            </div>
        </ModalShell>
    );
}

/* =========================================================================
 * Language Setting -- modal
 * ========================================================================= */
function LanguageModal({ cfg, setCfg, onClose, onSave }) {
    const langs = [
        { code:'en',    label:'English',                native:'English'    },
        { code:'zh-CN', label:'Chinese (Simplified)',   native:'简体中文'    },
        { code:'zh-TW', label:'Chinese (Traditional)',  native:'繁體中文'    },
        { code:'ja',    label:'Japanese',               native:'日本語'      },
        { code:'ko',    label:'Korean',                 native:'한국어'      },
    ];

    /* On Save & return: write the picked language code to the same
     * localStorage key the dashboard's i18n.js reads (`i18n_lang`), and
     * dispatch the `langchange` event so any open dashboard/config tab
     * picks it up live.  This is what makes the setup walk's language
     * choice actually drive the dashboard / config / mapper UI -- the
     * sidebar selector that used to live in the dashboard header has
     * been removed (2026-06-26) and the setup walk is now the single
     * source of truth for UI language. */
    const persistAndSave = () => {
        try {
            localStorage.setItem('i18n_lang', cfg.lang);
            window.dispatchEvent(new Event('langchange'));
            console.info('[setup walk] i18n_lang <-', cfg.lang);
        } catch (e) {
            console.warn('[setup walk] could not persist language:', e);
        }
        onSave();
    };
    return (
        <ModalShell title="Language Setting" subtitle="Pick your default interface language" accent="emerald" onClose={onClose} onSave={persistAndSave}>
            <div className="grid grid-cols-2 gap-3">
                {langs.map(l => (
                    <button key={l.code} onClick={()=>setCfg({...cfg, lang:l.code})}
                            className={`text-left p-3 rounded-xl border-2 transition-all
                                ${cfg.lang === l.code
                                    ? 'border-emerald-500 bg-emerald-900/20'
                                    : 'border-slate-700 bg-slate-800/40 hover:bg-slate-800'}`}>
                        <div className="text-[10px] uppercase tracking-widest font-black text-slate-500">{l.code}</div>
                        <div className="text-sm font-black text-slate-200">{l.native}</div>
                        <div className="text-[11px] text-slate-500">{l.label}</div>
                    </button>
                ))}
            </div>
        </ModalShell>
    );
}

/* =========================================================================
 * Plug-in Setting -- modal w/ list + upload zone
 * ========================================================================= */
/* Per-plug-in mock configuration fields.  Keys map to plug-in `id`. */
const PLUGIN_CONFIG_FIELDS = {
    weather:    [
        { key:'provider',  label:'Provider',          type:'select',  options:['Open-Meteo','NWS','ECMWF'], def:'Open-Meteo' },
        { key:'refresh',   label:'Refresh interval',  type:'select',  options:['1 min','5 min','15 min','30 min','1 h'], def:'15 min' },
        { key:'cache',     label:'Cache TTL (min)',   type:'number',  def:30 },
    ],
    givoni:     [
        { key:'climate',   label:'Climate model',     type:'select',  options:['Givoni 1992','ASHRAE 55','Adaptive'], def:'Givoni 1992' },
        { key:'massive',   label:'Heavyweight construction',  type:'toggle', def:false },
    ],
    sweet_spot: [
        { key:'tracking',  label:'Track outdoor RH',  type:'toggle', def:true },
        { key:'hyst',      label:'Hysteresis (% RH)', type:'number', def:2 },
    ],
    g36:        [
        { key:'mode',      label:'Sequence mode',     type:'select',  options:['Single-zone VAV','Multi-zone VAV','DOAS w/ FCU'], def:'Multi-zone VAV' },
        { key:'verbose',   label:'Verbose logging',   type:'toggle', def:false },
    ],
    dibt:       [
        { key:'host',      label:'Bridge host',       type:'text',   def:'192.168.1.100' },
        { key:'port',      label:'Telegram port',     type:'number', def:47808 },
        { key:'poll_ms',   label:'Poll interval (ms)',type:'number', def:2000 },
    ],
    lighting:   [
        { key:'gateway',   label:'Modbus gateway IP', type:'text',   def:'10.0.0.50' },
        { key:'unit_id',   label:'Unit ID',           type:'number', def:1 },
        { key:'tcp_port',  label:'TCP port',          type:'number', def:502 },
    ],
};

function PluginsModal({ cfg, setCfg, onClose, onSave }) {
    const ALL = [
        { id:'weather',     name:'Weather',         desc:'Open-Meteo OA feed',          ver:'2.1.0' },
        { id:'givoni',      name:'Givoni Engine',   desc:'Climate-strategy overlay',    ver:'1.3.4' },
        { id:'sweet_spot',  name:'Sweet-Spot RH',   desc:'Adjustable RH band',          ver:'1.0.1' },
        { id:'g36',         name:'G36 Sequences',   desc:'ASHRAE Guideline 36',         ver:'0.9.2' },
        { id:'dibt',        name:'DIBT Bridge',     desc:'Delta Controls (DIBT) BACnet bridge',           ver:'0.4.0' },
        { id:'lighting',    name:'Lighting (Red5)', desc:'V3.0 Modbus TCP client',      ver:'0.1.0-beta' },
    ];
    const toggle = (id) => setCfg(c => ({
        ...c,
        enabled: c.enabled.includes(id) ? c.enabled.filter(x => x !== id) : [...c.enabled, id]
    }));

    /* expansion state — which plug-in's "Configure" panel is open */
    const [expandedId, setExpandedId] = React.useState(null);

    const updateField = (pluginId, fieldKey, value) => {
        setCfg(c => ({
            ...c,
            fields: { ...(c.fields || {}), [pluginId]: { ...((c.fields || {})[pluginId] || {}), [fieldKey]: value } }
        }));
    };

    const fieldVal = (pluginId, field) => {
        const stored = cfg.fields && cfg.fields[pluginId] && cfg.fields[pluginId][field.key];
        return stored !== undefined ? stored : field.def;
    };

    return (
        <ModalShell title="Plug-in Setting" subtitle="Enable, upload or modify plug-ins" accent="pink" onClose={onClose} onSave={onSave} size="wide">
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {ALL.map(p => {
                    const on = cfg.enabled.includes(p.id);
                    const expanded = expandedId === p.id;
                    const fields = PLUGIN_CONFIG_FIELDS[p.id] || [];
                    return (
                        <div key={p.id}
                             className={`rounded-xl border transition-all
                                ${on ? 'border-pink-500/40 bg-pink-900/10' : 'border-slate-700 bg-slate-800/40'}
                                ${expanded ? 'ring-1 ring-pink-500/30' : ''}`}>
                            <div className="flex items-center justify-between p-3">
                                <div>
                                    <div className="text-sm font-black text-slate-100">{p.name}
                                        <span className="ml-2 text-[10px] font-mono text-slate-500">v{p.ver}</span>
                                    </div>
                                    <div className="text-xs text-slate-400">{p.desc}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => toggle(p.id)}
                                            data-testid={`plugin-toggle-${p.id}`}
                                            className={`px-3 py-1 rounded-md text-[10px] uppercase tracking-widest font-black border
                                                ${on ? 'border-pink-500/60 text-pink-300 bg-pink-900/30' : 'border-slate-600 text-slate-400 bg-slate-800'}`}>
                                        {on ? 'Enabled' : 'Disabled'}
                                    </button>
                                    <button onClick={() => setExpandedId(expanded ? null : p.id)}
                                            data-testid={`plugin-config-${p.id}`}
                                            className={`px-3 py-1 rounded-md text-[10px] uppercase tracking-widest font-black border transition-all
                                                ${expanded
                                                    ? 'border-pink-500 bg-pink-900/30 text-pink-200'
                                                    : 'border-slate-600 text-slate-400 bg-slate-800 hover:bg-slate-700 hover:border-pink-500/50 hover:text-pink-300'}`}>
                                        {expanded ? 'Close ▴' : 'Configure ▾'}
                                    </button>
                                </div>
                            </div>
                            {expanded && (
                                <div className="px-4 pb-4 border-t border-pink-500/20 bg-slate-950/40" data-testid={`plugin-config-panel-${p.id}`}>
                                    {fields.length === 0 ? (
                                        <p className="text-xs text-slate-500 italic py-3">No configurable options for this plug-in yet.</p>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
                                            {fields.map(f => {
                                                const v = fieldVal(p.id, f);
                                                return (
                                                    <div key={f.key}>
                                                        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 block mb-1">{f.label}</label>
                                                        {f.type === 'select' && (
                                                            <select className="field-input cursor-pointer"
                                                                    value={v}
                                                                    onChange={(e) => updateField(p.id, f.key, e.target.value)}>
                                                                {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                                                            </select>
                                                        )}
                                                        {f.type === 'number' && (
                                                            <input type="number" className="field-input"
                                                                   value={v}
                                                                   onChange={(e) => updateField(p.id, f.key, +e.target.value)}/>
                                                        )}
                                                        {f.type === 'text' && (
                                                            <input type="text" className="field-input"
                                                                   value={v}
                                                                   onChange={(e) => updateField(p.id, f.key, e.target.value)}/>
                                                        )}
                                                        {f.type === 'toggle' && (
                                                            <button onClick={() => updateField(p.id, f.key, !v)}
                                                                    className={`w-full py-2 rounded-lg text-xs font-black uppercase tracking-widest border transition-all
                                                                        ${v
                                                                            ? 'bg-pink-700/40 border-pink-500/60 text-pink-200'
                                                                            : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                                                                {v ? 'ON' : 'OFF'}
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                    <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-800">
                                        <button onClick={() => {
                                                    // reset this plug-in's fields to defaults
                                                    setCfg(c => {
                                                        const next = { ...(c.fields || {}) };
                                                        delete next[p.id];
                                                        return { ...c, fields: next };
                                                    });
                                                }}
                                                className="px-3 py-1.5 rounded-md text-[10px] uppercase tracking-widest font-black border border-slate-600 text-slate-400 hover:bg-slate-800">
                                            Reset defaults
                                        </button>
                                        <button onClick={() => setExpandedId(null)}
                                                className="px-3 py-1.5 rounded-md text-[10px] uppercase tracking-widest font-black bg-pink-600 hover:bg-pink-500 text-white">
                                            Done
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-5 p-4 border-2 border-dashed border-slate-700 rounded-xl text-center hover:border-pink-500/40 transition-all cursor-pointer">
                <div className="text-3xl mb-1">⤴</div>
                <div className="text-sm font-black text-slate-300">Drop a .py / .zip / .red5 plug-in here</div>
                <div className="text-[11px] text-slate-500 mt-1">or click to choose a file (mock — not wired)</div>
            </div>
        </ModalShell>
    );
}

/* =========================================================================
 * Modal Shell -- shared
 * ========================================================================= */
function ModalShell({ title, subtitle, accent='indigo', onClose, onSave, size='', children }) {
    const colorMap = {
        indigo:'#818cf8', amber:'#fbbf24', emerald:'#34d399', pink:'#f472b6'
    };
    const c = colorMap[accent] || '#818cf8';
    const sizeMap = {
        wide: 'max-w-2xl',
        map:  'max-w-3xl',
        max:  'max-w-[96vw] w-[96vw] h-[92vh]',
    };
    const width = sizeMap[size] || 'max-w-md';
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop" onClick={onClose}>
            {/* Flex-column shell: header (fixed) + scrollable content + sticky footer.
                Critical for size="max" where children alone exceed the modal height
                and would otherwise push the Save & return button below the viewport. */}
            <div className={`bg-slate-900 border-2 rounded-2xl w-full ${width} mx-4 fade-up flex flex-col`}
                 onClick={(e) => e.stopPropagation()}
                 style={{borderColor:`${c}66`, maxHeight: '92vh'}}>
                <div className="flex items-start justify-between p-6 pb-4 border-b border-slate-800/60 shrink-0">
                    <div>
                        <h3 className="text-lg font-black uppercase tracking-widest" style={{color:c}}>{title}</h3>
                        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
                    </div>
                    <button data-testid="modal-close" onClick={onClose} className="text-slate-500 hover:text-white text-2xl leading-none">×</button>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5">
                    {children}
                </div>
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 shrink-0 bg-slate-900 rounded-b-2xl">
                    <button data-testid="modal-cancel" onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs uppercase tracking-widest font-black text-slate-400 hover:bg-slate-700">
                        Cancel
                    </button>
                    <button data-testid="modal-save" onClick={onSave}
                            className="px-5 py-2 rounded-lg text-xs uppercase tracking-widest font-black text-white"
                            style={{background:c, boxShadow:`0 0 12px ${c}55`}}>
                        Save & return ✓
                    </button>
                </div>
            </div>
        </div>
    );
}

/* mount */
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
