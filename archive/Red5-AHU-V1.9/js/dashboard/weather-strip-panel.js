/* ------------------------------------------------------------------
 * dashboard/weather-strip-panel.js — bottom weather distribution strip.
 * ------------------------------------------------------------------
 *
 * Extracted from app.js in Phase L.26 (2026-06-24). The block had
 * lived as an inline `{showWeatherStrip && ( ... )}` conditional in
 * App's render -- 365 lines, with rich nested IIFEs for the rubber-
 * band drag selection, hover-tooltip, and overlay-year layers.
 *
 * Same function-style pattern as the other modal extractions: ctx
 * destructures App's state + helpers up top, body is byte-identical
 * to the pre-extraction block (modulo one block-of-dedent).
 * ------------------------------------------------------------------ */

function renderWeatherStripPanel(ctx) {
    const {
        showWeatherStrip,
        weatherLocation, setShowWeatherSettings,
        weatherLoading, weatherAllDaily, weatherError,
        weatherViewMode, setWeatherViewMode,
        weatherNavDate, setWeatherNavDate,
        weatherZoom, setWeatherZoom,
        weatherDragStart, setWeatherDragStart,
        weatherDragCurrent, setWeatherDragCurrent,
        weatherHoverIdx, setWeatherHoverIdx,
        weatherNav, getWeatherView,
        theme, t,
    } = ctx;

    if (!showWeatherStrip) return null;

    return (
<div className={`w-full ${theme==='dark'?'bg-slate-900 border-slate-800':'bg-slate-100 border-slate-300'} border-t`}>
    {!weatherLocation ? (
        <div className="flex items-center justify-between px-6 py-3">
            <span className={`text-[10px] font-black uppercase tracking-widest ${theme==='dark'?'text-slate-500':'text-slate-400'}`}>{window.t ? window.t("yearly_weather_dist") : "Yearly Weather Distribution"}</span>
            <button onClick={() => setShowWeatherSettings(true)} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-slate-100 text-[9px] font-black uppercase tracking-wider rounded transition-all">{t('set_location')}</button>
        </div>
    ) : weatherLoading ? (
        <div className="flex items-center justify-center py-4">
            <span className={`text-[10px] font-mono ${theme==='dark'?'text-indigo-400':'text-indigo-600'} animate-pulse`}>Loading weather data for {weatherLocation.name || `${weatherLocation.lat}, ${weatherLocation.lon}`}...</span>
        </div>
    ) : weatherAllDaily.length > 0 ? (
        <div className="relative">
            {/* Left-side controls overlay - aligned with chart Y-axis margin */}
            <div className="absolute left-0 top-0 bottom-0 z-10 flex flex-col justify-center items-center gap-1" style={{width: '6.9%'}}>
                <span className={`text-[7px] font-black uppercase tracking-widest leading-tight text-center ${theme==='dark'?'text-slate-600':'text-slate-400'}`}>
                    {weatherLocation.name || 'Weather'}
                </span>
                <div className="flex flex-col gap-0.5 items-center">
                    {['active_year','full_year','month','week','day'].map(m => {
                        const labels = { active_year: 'Active', full_year: 'Full Yr', month: 'Month', week: 'Week', day: 'Day' };
                        const active = weatherViewMode === m;
                        return (
                            <button key={m} onClick={() => { setWeatherViewMode(m); setWeatherZoom(null); setWeatherNavDate(new Date().toISOString().slice(0,10)); }}
                                className={`w-full px-1 py-0 text-[7px] font-black uppercase tracking-wider rounded transition-all leading-tight ${active ? (theme==='dark'?'bg-indigo-600 text-slate-100':'bg-indigo-500 text-slate-100') : (theme==='dark'?'text-slate-500 hover:text-slate-300':'text-slate-400 hover:text-slate-600')}`}
                            >{labels[m]}</button>
                        );
                    })}
                </div>
                {weatherViewMode !== 'active_year' && (
                    <div className="flex items-center gap-0.5">
                        <button onClick={() => weatherNav(-1)} className={`text-[9px] font-black ${theme==='dark'?'text-slate-500 hover:text-slate-100':'text-slate-400 hover:text-slate-800'} transition-all`}>&lt;</button>
                        <button onClick={() => weatherNav(1)} className={`text-[9px] font-black ${theme==='dark'?'text-slate-500 hover:text-slate-100':'text-slate-400 hover:text-slate-800'} transition-all`}>&gt;</button>
                    </div>
                )}
                <button onClick={() => setShowWeatherSettings(true)} className={`text-[6px] font-black uppercase ${theme==='dark'?'text-slate-600 hover:text-slate-400':'text-slate-400 hover:text-slate-600'} transition-all`}>Loc</button>
            </div>
            {/* SVG Strip - viewBox matches chart width for horizontal alignment */}
            {(() => {
                const view = getWeatherView();
                if (!view || !view.data || view.data.length < 2) return <div className="px-4 py-2" style={{paddingLeft:'7%'}}><span className={`text-[9px] font-mono ${theme==='dark'?'text-slate-600':'text-slate-400'}`}>{window.t ? window.t("no_data_for_period") : "No data for this period"}</span></div>;
                const allVisible = view.data;
                const isHourly = view.isHourly || false;
                const hourlyInterval = view.hourlyInterval || 1;
                const zStart = weatherZoom ? weatherZoom.start : 0;
                const zEnd = weatherZoom ? Math.min(weatherZoom.end, allVisible.length - 1) : allVisible.length - 1;
                const visible = allVisible.slice(zStart, zEnd + 1);
                if (visible.length < 1) return null;
                const overlay = view.overlay || null;
                const stripW = 1300;
                const stripH = 130;
                const spad = { l: 90, r: 118, t: 6, b: 22 };
                const gW = stripW - spad.l - spad.r;
                const gH = stripH - spad.t - spad.b;
                
                // Include overlay temps in range calculation
                const allTemps = visible.flatMap(d => [d.temp_min, d.temp_max]).concat(overlay ? overlay.flatMap(d => [d.temp_min, d.temp_max]) : []);
                const tMin = Math.floor(Math.min(...allTemps) / 5) * 5;
                const tMax = Math.ceil(Math.max(...allTemps) / 5) * 5;
                const hVals = visible.map(d => d.h_avg).concat(overlay ? overlay.map(d => d.h_avg) : []);
                const hMin = Math.floor(Math.min(...hVals) / 10) * 10;
                const hMax = Math.ceil(Math.max(...hVals) / 10) * 10;
                
                const xScale = (i) => spad.l + (i / Math.max(1, visible.length - 1)) * gW;
                const yT = (t) => spad.t + gH - ((t - tMin) / (tMax - tMin || 1)) * gH;
                const yRH = (rh) => spad.t + gH - (rh / 100) * gH;
                const yH = (h) => spad.t + gH - ((h - hMin) / (hMax - hMin || 1)) * gH;
                
                const tempMaxPath = visible.map((d, i) => `${i===0?'M':'L'}${xScale(i).toFixed(1)},${yT(d.temp_max).toFixed(1)}`).join('');
                const tempMinPath = visible.map((d, i) => `${i===0?'M':'L'}${xScale(i).toFixed(1)},${yT(d.temp_min).toFixed(1)}`).join('');
                const tempAvgPath = visible.map((d, i) => `${i===0?'M':'L'}${xScale(i).toFixed(1)},${yT(d.temp_avg).toFixed(1)}`).join('');
                const rhPath = visible.map((d, i) => `${i===0?'M':'L'}${xScale(i).toFixed(1)},${yRH(d.rh_avg).toFixed(1)}`).join('');
                const hPath = visible.map((d, i) => `${i===0?'M':'L'}${xScale(i).toFixed(1)},${yH(d.h_avg).toFixed(1)}`).join('');
                const tempFill = tempMaxPath + visible.slice().reverse().map((d, i) => `L${xScale(visible.length - 1 - i).toFixed(1)},${yT(d.temp_min).toFixed(1)}`).join('') + 'Z';
                
                const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                const periodLabel = view.label;

                return (
                    <svg 
                        viewBox={`0 0 ${stripW} ${stripH}`} 
                        className="w-full cursor-crosshair select-none" 
                        style={{ height: '130px' }}
                        preserveAspectRatio="none"
                        onMouseDown={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const px = (e.clientX - rect.left) / rect.width * stripW;
                            const idx = Math.round(((px - spad.l) / gW) * (visible.length - 1));
                            const clamped = Math.max(0, Math.min(idx, visible.length - 1)) + zStart;
                            setWeatherDragStart(clamped);
                            setWeatherDragCurrent(clamped);
                        }}
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const px = (e.clientX - rect.left) / rect.width * stripW;
                            const rawIdx = Math.round(((px - spad.l) / gW) * (visible.length - 1));
                            const clampedLocal = Math.max(0, Math.min(rawIdx, visible.length - 1));
                            if (weatherDragStart !== null) {
                                setWeatherDragCurrent(Math.max(0, Math.min(clampedLocal + zStart, allVisible.length - 1)));
                            } else {
                                setWeatherHoverIdx(clampedLocal);
                            }
                        }}
                        onMouseUp={(e) => {
                            if (weatherDragStart === null) return;
                            const rect = e.currentTarget.getBoundingClientRect();
                            const px = (e.clientX - rect.left) / rect.width * stripW;
                            const rawIdx = Math.round(((px - spad.l) / gW) * (visible.length - 1)) + zStart;
                            const idx = Math.max(0, Math.min(rawIdx, allVisible.length - 1));
                            const s = Math.min(weatherDragStart, idx);
                            const en = Math.max(weatherDragStart, idx);
                            if (en - s > 2) {
                                setWeatherZoom({ start: s, end: en });
                            }
                            setWeatherDragStart(null);
                            setWeatherDragCurrent(null);
                        }}
                        onMouseLeave={() => { setWeatherDragStart(null); setWeatherDragCurrent(null); setWeatherHoverIdx(null); }}
                    >
                        {/* Base layer: previous year (dimmed in active_year) or normal */}
                        <path d={tempFill} fill={overlay ? (theme==='dark'?'rgba(249,115,22,0.06)':'rgba(249,115,22,0.04)') : (theme==='dark'?'rgba(249,115,22,0.12)':'rgba(249,115,22,0.08)')} />
                        <path d={tempMaxPath} fill="none" stroke={overlay?'rgba(249,115,22,0.15)':'rgba(249,115,22,0.3)'} strokeWidth="0.8" />
                        <path d={tempMinPath} fill="none" stroke={overlay?'rgba(249,115,22,0.15)':'rgba(249,115,22,0.3)'} strokeWidth="0.8" />
                        <path d={tempAvgPath} fill="none" stroke={overlay?'rgba(249,115,22,0.35)':'#f97316'} strokeWidth={overlay?'1':'1.5'} />
                        <path d={rhPath} fill="none" stroke={overlay?'rgba(56,189,248,0.25)':'#38bdf8'} strokeWidth="1" opacity={overlay?'0.4':'0.6'} />
                        <path d={hPath} fill="none" stroke={overlay?'rgba(236,72,153,0.2)':'#ec4899'} strokeWidth="1" opacity={overlay?'0.3':'0.5'} strokeDasharray="3,2" />
                        
                        {/* Overlay: current YTD on top (bright, thick) */}
                        {overlay && overlay.length > 1 && (() => {
                            // Map overlay dates to base X positions by day-of-year
                            const baseYear = visible[0] && visible[0].date.slice(0,4);
                            const ovlMapped = overlay.map(od => {
                                const mmdd = od.date.slice(5);
                                const matchDate = baseYear + '-' + mmdd;
                                const baseIdx = visible.findIndex(bd => bd.date === matchDate);
                                return baseIdx >= 0 ? { ...od, xi: baseIdx } : null;
                            }).filter(Boolean);
                            if (ovlMapped.length < 2) return null;
                            const ovlTempPath = ovlMapped.map((d, i) => `${i===0?'M':'L'}${xScale(d.xi).toFixed(1)},${yT(d.temp_avg).toFixed(1)}`).join('');
                            const ovlTempMaxPath = ovlMapped.map((d, i) => `${i===0?'M':'L'}${xScale(d.xi).toFixed(1)},${yT(d.temp_max).toFixed(1)}`).join('');
                            const ovlTempMinPath = ovlMapped.map((d, i) => `${i===0?'M':'L'}${xScale(d.xi).toFixed(1)},${yT(d.temp_min).toFixed(1)}`).join('');
                            const ovlFill = ovlTempMaxPath + ovlMapped.slice().reverse().map((d, i) => `L${xScale(d.xi).toFixed(1)},${yT(d.temp_min).toFixed(1)}`).join('') + 'Z';
                            const ovlRhPath = ovlMapped.map((d, i) => `${i===0?'M':'L'}${xScale(d.xi).toFixed(1)},${yRH(d.rh_avg).toFixed(1)}`).join('');
                            const ovlHPath = ovlMapped.map((d, i) => `${i===0?'M':'L'}${xScale(d.xi).toFixed(1)},${yH(d.h_avg).toFixed(1)}`).join('');
                            // End marker line
                            const lastXi = ovlMapped[ovlMapped.length - 1].xi;
                            return (
                                <React.Fragment>
                                    <path d={ovlFill} fill={theme==='dark'?'rgba(249,115,22,0.18)':'rgba(249,115,22,0.12)'} />
                                    <path d={ovlTempMaxPath} fill="none" stroke="rgba(249,115,22,0.5)" strokeWidth="0.8" />
                                    <path d={ovlTempMinPath} fill="none" stroke="rgba(249,115,22,0.5)" strokeWidth="0.8" />
                                    <path d={ovlTempPath} fill="none" stroke="#f97316" strokeWidth="2.5" />
                                    <path d={ovlRhPath} fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.8" />
                                    <path d={ovlHPath} fill="none" stroke="#ec4899" strokeWidth="1.5" opacity="0.7" strokeDasharray="3,2" />
                                    <line x1={xScale(lastXi)} y1={spad.t} x2={xScale(lastXi)} y2={spad.t + gH} stroke={theme==='dark'?'#22d3ee':'#0891b2'} strokeWidth="1" strokeDasharray="3,2" />
                                    <text x={xScale(lastXi) + 4} y={spad.t + gH - 4} fontSize="7" fill={theme==='dark'?'#22d3ee':'#0891b2'} fontWeight="900">TODAY</text>
                                </React.Fragment>
                            );
                        })()}
                        
                        {/* Y axis labels */}
                        <text x={spad.l - 6} y={spad.t + 8} textAnchor="end" fontSize="8" fill={theme==='dark'?'#64748b':'#94a3b8'} fontWeight="900">{tMax}C</text>
                        <text x={spad.l - 6} y={spad.t + gH} textAnchor="end" fontSize="8" fill={theme==='dark'?'#64748b':'#94a3b8'} fontWeight="900">{tMin}C</text>
                        
                        {/* Right margin: period label + legend + zoom reset */}
                        <text x={stripW - spad.r + 10} y={spad.t + 14} textAnchor="start" fontSize="9" fill={theme==='dark'?'#38bdf8':'#0284c7'} fontWeight="900" className="font-mono">{periodLabel}</text>
                        {weatherZoom && (
                            <text x={stripW - spad.r + 10} y={spad.t + 28} textAnchor="start" fontSize="7" fill={theme==='dark'?'#6366f1':'#4f46e5'} fontWeight="900" className="cursor-pointer" onClick={() => setWeatherZoom(null)}>{window.t ? window.t("reset_zoom") : "RESET ZOOM"}</text>
                        )}
                        <text x={stripW - spad.r + 10} y={spad.t + gH - 22} textAnchor="start" fontSize="7" fill="#f97316" fontWeight="800">T</text>
                        <text x={stripW - spad.r + 24} y={spad.t + gH - 22} textAnchor="start" fontSize="7" fill="#38bdf8" fontWeight="800">RH</text>
                        <text x={stripW - spad.r + 10} y={spad.t + gH - 10} textAnchor="start" fontSize="7" fill="#ec4899" fontWeight="800">H</text>
                        
                        {/* Overlay year labels in right margin */}
                        {overlay && (
                            <React.Fragment>
                                <text x={stripW - spad.r + 10} y={spad.t + gH - 34} textAnchor="start" fontSize="7" fill={theme==='dark'?'rgba(249,115,22,0.4)':'rgba(249,115,22,0.5)'} fontWeight="800">{visible[0] && visible[0].date.slice(0,4)}</text>
                                <text x={stripW - spad.r + 42} y={spad.t + gH - 34} textAnchor="start" fontSize="7" fill="#f97316" fontWeight="900">{overlay[0] && overlay[0].date.slice(0,4)}</text>
                            </React.Fragment>
                        )}
                        
                        {/* X axis labels */}
                        {visible.map((d, i) => {
                            if (isHourly) {
                                // Hourly mode: show time markers
                                const timeStr = d.date.length > 10 ? d.date.slice(11, 16) : '';
                                const hour = parseInt(timeStr.slice(0, 2) || '0');
                                const dateStr = d.date.slice(0, 10);
                                const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
                                
                                if (hourlyInterval === 8) {
                                    // Week: 8hr markers (00:00, 08:00, 16:00) + day name at midnight
                                    if (hour % 8 !== 0) return null;
                                    const isMidnight = hour === 0;
                                    const dayName = dayNames[new Date(dateStr + 'T12:00:00').getDay()];
                                    const label = isMidnight ? dayName + ' ' + dateStr.slice(8) : timeStr;
                                    return (
                                        <React.Fragment key={i}>
                                            <line x1={xScale(i)} y1={spad.t} x2={xScale(i)} y2={spad.t + gH} stroke={isMidnight ? (theme==='dark'?'rgba(100,116,139,0.3)':'rgba(148,163,184,0.35)') : (theme==='dark'?'rgba(100,116,139,0.1)':'rgba(148,163,184,0.12)')} strokeWidth={isMidnight ? '1' : '0.5'} />
                                            <text x={xScale(i)} y={stripH - 5} textAnchor="middle" fontSize={isMidnight ? '8' : '7'} fill={isMidnight ? (theme==='dark'?'#94a3b8':'#64748b') : (theme==='dark'?'#475569':'#94a3b8')} fontWeight={isMidnight ? '900' : '600'}>{label}</text>
                                        </React.Fragment>
                                    );
                                } else {
                                    // Day: every hour, bold every 3hrs
                                    const isMajor = hour % 3 === 0;
                                    if (!isMajor && visible.length > 30) return null;
                                    return (
                                        <React.Fragment key={i}>
                                            <line x1={xScale(i)} y1={spad.t} x2={xScale(i)} y2={spad.t + gH} stroke={isMajor ? (theme==='dark'?'rgba(100,116,139,0.25)':'rgba(148,163,184,0.3)') : (theme==='dark'?'rgba(100,116,139,0.08)':'rgba(148,163,184,0.1)')} strokeWidth={isMajor ? '0.8' : '0.4'} />
                                            <text x={xScale(i)} y={stripH - 5} textAnchor="middle" fontSize={isMajor ? '8' : '6.5'} fill={isMajor ? (theme==='dark'?'#94a3b8':'#64748b') : (theme==='dark'?'#475569':'#94a3b8')} fontWeight={isMajor ? '900' : '600'}>{timeStr}</text>
                                        </React.Fragment>
                                    );
                                }
                            }
                            // Daily mode
                            const isMonthStart = d.date.endsWith('-01');
                            const totalLabels = Math.min(15, visible.length);
                            const showLabel = visible.length <= 14 ? true :
                                visible.length <= 40 ? (i % Math.max(1, Math.floor(visible.length / totalLabels)) === 0) :
                                isMonthStart;
                            if (!showLabel) return null;
                            const label = visible.length <= 14 ? d.date.slice(5) :
                                visible.length <= 90 ? d.date.slice(5) :
                                months[parseInt(d.date.slice(5,7)) - 1];
                            return (
                                <React.Fragment key={i}>
                                    <line x1={xScale(i)} y1={spad.t} x2={xScale(i)} y2={spad.t + gH} stroke={theme==='dark'?'rgba(100,116,139,0.15)':'rgba(148,163,184,0.2)'} strokeWidth="0.5" />
                                    <text x={xScale(i)} y={stripH - 5} textAnchor="middle" fontSize="8" fill={theme==='dark'?'#475569':'#94a3b8'} fontWeight="800">{label}</text>
                                </React.Fragment>
                            );
                        })}
                        
                        {/* Comfort zone temperature band */}
                        <rect x={spad.l} y={yT(27)} width={gW} height={Math.max(0, yT(20) - yT(27))} fill={theme==='dark'?'rgba(16,185,129,0.06)':'rgba(16,185,129,0.04)'} />
                        <line x1={spad.l} y1={yT(20)} x2={spad.l + gW} y2={yT(20)} stroke="rgba(16,185,129,0.3)" strokeWidth="0.5" strokeDasharray="4,3" />
                        <line x1={spad.l} y1={yT(27)} x2={spad.l + gW} y2={yT(27)} stroke="rgba(16,185,129,0.3)" strokeWidth="0.5" strokeDasharray="4,3" />
                        
                        {/* Rubber band selection highlight */}
                        {weatherDragStart !== null && weatherDragCurrent !== null && (() => {
                            const s = Math.min(weatherDragStart, weatherDragCurrent) - zStart;
                            const en = Math.max(weatherDragStart, weatherDragCurrent) - zStart;
                            const x1 = xScale(Math.max(0, s));
                            const x2 = xScale(Math.min(visible.length - 1, en));
                            if (x2 - x1 < 2) return null;
                            return (
                                <React.Fragment>
                                    <rect x={x1} y={spad.t} width={x2 - x1} height={gH} fill={theme==='dark'?'rgba(99,102,241,0.2)':'rgba(99,102,241,0.15)'} stroke="#6366f1" strokeWidth="1" rx="2" />
                                    <line x1={x1} y1={spad.t} x2={x1} y2={spad.t + gH} stroke="#6366f1" strokeWidth="1.5" />
                                    <line x1={x2} y1={spad.t} x2={x2} y2={spad.t + gH} stroke="#6366f1" strokeWidth="1.5" />
                                    <text x={(x1 + x2) / 2} y={spad.t + gH / 2} textAnchor="middle" fontSize="10" fill="#818cf8" fontWeight="900">{Math.abs(en - s) + 1}d</text>
                                </React.Fragment>
                            );
                        })()}
                        
                        {/* Hover cursor line + data box */}
                        {weatherHoverIdx !== null && weatherDragStart === null && visible[weatherHoverIdx] && (() => {
                            const hx = xScale(weatherHoverIdx);
                            const dp = visible[weatherHoverIdx];
                            const mmdd = dp.date.slice(5, 10);
                            const ovlPoint = overlay && overlay.find(o => o.date.slice(5, 10) === mmdd);
                            
                            // Show current year data when available, else base
                            const show = ovlPoint || dp;
                            const showYear = show.date.slice(0, 4);
                            const dateLabel = isHourly && show.date.length > 10 ? show.date.slice(0,10) + ' ' + show.date.slice(11,16) : mmdd + ' ' + showYear;
                            
                            // WMO weather code to label
                            const wmoLabel = (code) => {
                                if (code == null) return '';
                                const map = {0:'Clear',1:'Mostly Clear',2:'Partly Cloudy',3:'Overcast',45:'Fog',48:'Rime Fog',51:'Lt Drizzle',53:'Drizzle',55:'Hvy Drizzle',56:'Frzg Drizzle',57:'Hvy Frzg Drizzle',61:'Lt Rain',63:'Rain',65:'Hvy Rain',66:'Frzg Rain',67:'Hvy Frzg Rain',71:'Lt Snow',73:'Snow',75:'Hvy Snow',77:'Snow Grains',80:'Lt Showers',81:'Showers',82:'Hvy Showers',85:'Snow Showers',86:'Hvy Snow Showers',95:'Thunderstorm',96:'T-Storm+Hail',99:'T-Storm+Hvy Hail'};
                                return map[code] || ('WMO ' + code);
                            };
                            // For hourly view, get weather code from daily data for that date
                            const showWC = isHourly ? null : show.wc;
                            const baseWC = isHourly ? null : dp.wc;
                            const wcText = wmoLabel(showWC);
                            
                            const dT = ovlPoint ? (ovlPoint.temp_avg - dp.temp_avg).toFixed(1) : null;
                            const dRH = ovlPoint ? (ovlPoint.rh_avg - dp.rh_avg) : null;
                            const dH = ovlPoint ? (ovlPoint.h_avg - dp.h_avg).toFixed(1) : null;
                            const fmtD = (v) => (parseFloat(v) >= 0 ? '+' : '') + v;
                            const dClr = theme==='dark' ? '#a5b4fc' : '#6366f1';
                            // Compute h_min/h_max from T/RH if backend didn't provide them
                            const hMinMax = (d) => ({
                                hMin: d.h_min != null ? d.h_min : getH(d.temp_min, getW(d.temp_min, d.rh_min)).toFixed(1),
                                hMax: d.h_max != null ? d.h_max : getH(d.temp_max, getW(d.temp_max, d.rh_max)).toFixed(1)
                            });
                            const showH = hMinMax(show);
                            const dpH = hMinMax(dp);
                            
                            const boxW = ovlPoint ? 260 : 220;
                            const boxH = 52;
                            const boxX = hx + boxW + 20 > stripW - spad.r ? hx - boxW - 8 : hx + 8;
                            const boxY = spad.t + 2;
                            const cGrey = theme==='dark'?'#64748b':'#94a3b8';
                            const col = { lbl: boxX+5, val: boxX+50, unit: boxX+53, bkt: boxX+80, mn: boxX+108, sl: boxX+111, mx: boxX+138, br: boxX+141, dlt: boxX+160, pyBkt: boxX+185, pyMn: boxX+210, pySl: boxX+213, pyMx: boxX+238, pyBr: boxX+241 };
                            return (
                                <React.Fragment>
                                    <line x1={hx} y1={spad.t} x2={hx} y2={spad.t + gH} stroke={theme==='dark'?'#f8fafc':'#1e293b'} strokeWidth="1" opacity="0.7" />
                                    <circle cx={hx} cy={yT(show.temp_avg)} r="3" fill="#f97316" stroke={theme==='dark'?'#0f172a':'#fff'} strokeWidth="1.5" />
                                    <circle cx={hx} cy={yRH(show.rh_avg)} r="2.5" fill="#38bdf8" stroke={theme==='dark'?'#0f172a':'#fff'} strokeWidth="1" />
                                    <text x={col.lbl} y={boxY + 9} fontSize="7" fill={cGrey} fontWeight="800">{dateLabel}{wcText ? '  ' + wcText : ''}{ovlPoint && baseWC != null ? '  (' + dp.date.slice(0,4) + ': ' + wmoLabel(baseWC) + ')' : ''}</text>
                                    {/* T row */}
                                    <text x={col.lbl} y={boxY + 22} fontSize="8" fill="#f97316" fontWeight="900">T:</text>
                                    <text x={col.val} y={boxY + 22} fontSize="8" fill="#f97316" fontWeight="900" textAnchor="end">{show.temp_avg}</text>
                                    <text x={col.unit} y={boxY + 22} fontSize="7" fill="#f97316" fontWeight="700">C</text>
                                    <text x={col.bkt} y={boxY + 22} fontSize="7" fill={cGrey} fontWeight="700">[</text>
                                    <text x={col.mn} y={boxY + 22} fontSize="7" fill={cGrey} fontWeight="700" textAnchor="end">{show.temp_min}</text>
                                    <text x={col.sl} y={boxY + 22} fontSize="7" fill={cGrey} fontWeight="700">/</text>
                                    <text x={col.mx} y={boxY + 22} fontSize="7" fill={cGrey} fontWeight="700" textAnchor="end">{show.temp_max}</text>
                                    <text x={col.br} y={boxY + 22} fontSize="7" fill={cGrey} fontWeight="700">]</text>
                                    {dT !== null && <text x={col.dlt} y={boxY + 22} fontSize="7" fill={dClr} fontWeight="900">{fmtD(dT)}</text>}
                                    {ovlPoint && <text x={col.pyBkt} y={boxY + 22} fontSize="6" fill={cGrey} fontWeight="600">[</text>}
                                    {ovlPoint && <text x={col.pyMn} y={boxY + 22} fontSize="6" fill={cGrey} fontWeight="600" textAnchor="end">{dp.temp_min}</text>}
                                    {ovlPoint && <text x={col.pySl} y={boxY + 22} fontSize="6" fill={cGrey} fontWeight="600">/</text>}
                                    {ovlPoint && <text x={col.pyMx} y={boxY + 22} fontSize="6" fill={cGrey} fontWeight="600" textAnchor="end">{dp.temp_max}</text>}
                                    {ovlPoint && <text x={col.pyBr} y={boxY + 22} fontSize="6" fill={cGrey} fontWeight="600">]</text>}
                                    {/* RH row */}
                                    <text x={col.lbl} y={boxY + 33} fontSize="8" fill="#38bdf8" fontWeight="900">RH:</text>
                                    <text x={col.val} y={boxY + 33} fontSize="8" fill="#38bdf8" fontWeight="900" textAnchor="end">{show.rh_avg}</text>
                                    <text x={col.unit} y={boxY + 33} fontSize="7" fill="#38bdf8" fontWeight="700">%</text>
                                    <text x={col.bkt} y={boxY + 33} fontSize="7" fill={cGrey} fontWeight="700">[</text>
                                    <text x={col.mn} y={boxY + 33} fontSize="7" fill={cGrey} fontWeight="700" textAnchor="end">{show.rh_min}</text>
                                    <text x={col.sl} y={boxY + 33} fontSize="7" fill={cGrey} fontWeight="700">/</text>
                                    <text x={col.mx} y={boxY + 33} fontSize="7" fill={cGrey} fontWeight="700" textAnchor="end">{show.rh_max}</text>
                                    <text x={col.br} y={boxY + 33} fontSize="7" fill={cGrey} fontWeight="700">]</text>
                                    {dRH !== null && <text x={col.dlt} y={boxY + 33} fontSize="7" fill={dClr} fontWeight="900">{fmtD(dRH)}</text>}
                                    {ovlPoint && <text x={col.pyBkt} y={boxY + 33} fontSize="6" fill={cGrey} fontWeight="600">[</text>}
                                    {ovlPoint && <text x={col.pyMn} y={boxY + 33} fontSize="6" fill={cGrey} fontWeight="600" textAnchor="end">{dp.rh_min}</text>}
                                    {ovlPoint && <text x={col.pySl} y={boxY + 33} fontSize="6" fill={cGrey} fontWeight="600">/</text>}
                                    {ovlPoint && <text x={col.pyMx} y={boxY + 33} fontSize="6" fill={cGrey} fontWeight="600" textAnchor="end">{dp.rh_max}</text>}
                                    {ovlPoint && <text x={col.pyBr} y={boxY + 33} fontSize="6" fill={cGrey} fontWeight="600">]</text>}
                                    {/* H row */}
                                    <text x={col.lbl} y={boxY + 44} fontSize="8" fill="#ec4899" fontWeight="900">H:</text>
                                    <text x={col.val} y={boxY + 44} fontSize="8" fill="#ec4899" fontWeight="900" textAnchor="end">{show.h_avg}</text>
                                    <text x={col.unit} y={boxY + 44} fontSize="7" fill="#ec4899" fontWeight="700">kJ</text>
                                    <text x={col.bkt} y={boxY + 44} fontSize="7" fill={cGrey} fontWeight="700">[</text>
                                    <text x={col.mn} y={boxY + 44} fontSize="7" fill={cGrey} fontWeight="700" textAnchor="end">{showH.hMin}</text>
                                    <text x={col.sl} y={boxY + 44} fontSize="7" fill={cGrey} fontWeight="700">/</text>
                                    <text x={col.mx} y={boxY + 44} fontSize="7" fill={cGrey} fontWeight="700" textAnchor="end">{showH.hMax}</text>
                                    <text x={col.br} y={boxY + 44} fontSize="7" fill={cGrey} fontWeight="700">]</text>
                                    {dH !== null && <text x={col.dlt} y={boxY + 44} fontSize="7" fill={dClr} fontWeight="900">{fmtD(dH)}</text>}
                                    {ovlPoint && <text x={col.pyBkt} y={boxY + 44} fontSize="6" fill={cGrey} fontWeight="600">[</text>}
                                    {ovlPoint && <text x={col.pyMn} y={boxY + 44} fontSize="6" fill={cGrey} fontWeight="600" textAnchor="end">{dpH.hMin}</text>}
                                    {ovlPoint && <text x={col.pySl} y={boxY + 44} fontSize="6" fill={cGrey} fontWeight="600">/</text>}
                                    {ovlPoint && <text x={col.pyMx} y={boxY + 44} fontSize="6" fill={cGrey} fontWeight="600" textAnchor="end">{dpH.hMax}</text>}
                                    {ovlPoint && <text x={col.pyBr} y={boxY + 44} fontSize="6" fill={cGrey} fontWeight="600">]</text>}
                                </React.Fragment>
                            );
                        })()}
                    </svg>
                );
            })()}
        </div>
    ) : (
        <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
                <span className={`text-[10px] font-mono ${theme==='dark'?'text-slate-600':'text-slate-400'}`}>{window.t ? window.t("no_weather_loaded") : "No weather data loaded"}</span>
                {weatherError && <span className={`text-[9px] font-mono text-red-400`}>{weatherError}</span>}
            </div>
            <button onClick={() => setShowWeatherSettings(true)} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-slate-100 text-[9px] font-black uppercase tracking-wider rounded transition-all">{t('set_location')}</button>
        </div>
    )}
</div>
    );
}
