/* ------------------------------------------------------------------
 * dashboard/weather-settings-modal.js — Weather location chooser.
 * ------------------------------------------------------------------
 *
 * Extracted from app.js in Phase L.26 (2026-06-24).  The block had
 * lived as an inline IIFE inside App's render at the line that read
 * `{showWeatherSettings && (() => { ... })()}`.
 *
 * Follows the function-style pattern set by vav-modal.js,
 * ahu-modal.js, and band-clamp-modal.js: a single top-level
 * `renderWeatherSettingsModal(ctx)` destructures the closure refs.
 *
 * Ctx props expected (11):
 *   showWeatherSettings, setShowWeatherSettings,
 *   weatherLocation, setWeatherLocation,
 *   savedWeatherLocations, setSavedWeatherLocations,
 *   defaultLocation, pinLocation,
 *   weatherSaveError, persistWeatherState, setWeatherZoom,
 *   theme, toast, t
 * ------------------------------------------------------------------ */

async function lookupElevationM(lat, lng) {
    try {
        const url = 'https://api.open-meteo.com/v1/elevation?latitude='
            + encodeURIComponent(lat) + '&longitude=' + encodeURIComponent(lng);
        const r = await fetch(url, { headers: { Accept: 'application/json' } });
        if (!r.ok) return null;
        const j = await r.json();
        const e = Array.isArray(j.elevation) ? j.elevation[0] : j.elevation;
        return Number.isFinite(Number(e)) ? Number(e) : null;
    } catch (_) {
        return null;
    }
}

function locElevationM(loc) {
    if (!loc) return null;
    const e = loc.elevation_m != null ? loc.elevation_m : loc.asl;
    return Number.isFinite(Number(e)) ? Number(e) : null;
}

function renderWeatherSettingsModal(ctx) {
    const {
        showWeatherSettings, setShowWeatherSettings,
        weatherLocation, setWeatherLocation,
        savedWeatherLocations, setSavedWeatherLocations,
        defaultLocation, pinLocation,
        weatherSaveError, persistWeatherState, setWeatherZoom,
        theme, toast, t,
    } = ctx;

    if (!showWeatherSettings) return null;

    const savedLocs = savedWeatherLocations;
    const currentKey = weatherLocation ? weatherLocation.lat.toFixed(4)+','+weatherLocation.lon.toFixed(4) : '';
    const curName = weatherLocation ? (weatherLocation.name || weatherLocation.lat+', '+weatherLocation.lon) : 'Select location';

    const selectLocation = (loc) => {
        // Ensure the selected location is also in the saved list (top of it)
        const key = loc.lat.toFixed(4)+','+loc.lon.toFixed(4);
        const dedupedSaved = savedWeatherLocations.filter(l => (l.lat.toFixed(4)+','+l.lon.toFixed(4)) !== key);
        const nextSaved = [loc, ...dedupedSaved].slice(0, 20);
        try { localStorage.setItem('weatherLocation', JSON.stringify(loc)); } catch (e) {}
        try { localStorage.setItem('savedWeatherLocations', JSON.stringify(nextSaved)); } catch (e) {}
        setWeatherLocation(loc);
        setSavedWeatherLocations(nextSaved);
        setWeatherZoom(null);
        setShowWeatherSettings(false);
        persistWeatherState(loc, nextSaved);
    };
    const applyElevation = (elevRaw) => {
        if (!weatherLocation) { toast('Pick a location first.'); return; }
        const elev = Number(elevRaw);
        if (!Number.isFinite(elev) || elev < -500 || elev > 9000) {
            toast('Enter elevation in metres ASL (−500 to 9000).');
            return;
        }
        const loc = Object.assign({}, weatherLocation, { elevation_m: Math.round(elev) });
        const key = loc.lat.toFixed(4)+','+loc.lon.toFixed(4);
        const nextSaved = savedWeatherLocations.map(l =>
            (l.lat.toFixed(4)+','+l.lon.toFixed(4)) === key ? Object.assign({}, l, { elevation_m: loc.elevation_m }) : l
        );
        try { localStorage.setItem('weatherLocation', JSON.stringify(loc)); } catch (e) {}
        try { localStorage.setItem('savedWeatherLocations', JSON.stringify(nextSaved)); } catch (e) {}
        setWeatherLocation(loc);
        setSavedWeatherLocations(nextSaved);
        persistWeatherState(loc, nextSaved);
    };
    const lookupAslFor = async (lat, lon, inputId) => {
        const elev = await lookupElevationM(lat, lon);
        if (elev == null) { toast('ASL lookup failed (offline or blocked).'); return null; }
        const rounded = Math.round(elev);
        const el = document.getElementById(inputId);
        if (el) el.value = String(rounded);
        return rounded;
    };
    const addNew = async () => {
        const name = document.getElementById('wl-new-name').value.trim();
        const lat = parseFloat(document.getElementById('wl-new-lat').value);
        const lon = parseFloat(document.getElementById('wl-new-lon').value);
        let elev = parseFloat(document.getElementById('wl-new-asl').value);
        if (!name) { toast('Enter a location name.'); return; }
        if (isNaN(lat) || isNaN(lon)) { toast('Enter valid coordinates.'); return; }
        if (!Number.isFinite(elev)) {
            const looked = await lookupElevationM(lat, lon);
            if (looked != null) elev = Math.round(looked);
        }
        const loc = { name, lat, lon };
        if (Number.isFinite(elev)) loc.elevation_m = elev;
        selectLocation(loc);
    };
    const removeLocation = (idx, e) => {
        e.stopPropagation();
        const removed = savedWeatherLocations[idx];
        const nextSaved = savedWeatherLocations.filter((_, i) => i !== idx);
        try { localStorage.setItem('savedWeatherLocations', JSON.stringify(nextSaved)); } catch (e) {}
        setSavedWeatherLocations(nextSaved);
        // If we removed the active one, clear active too
        let nextActive = weatherLocation;
        if (removed && weatherLocation
            && removed.lat.toFixed(4) === weatherLocation.lat.toFixed(4)
            && removed.lon.toFixed(4) === weatherLocation.lon.toFixed(4)) {
            nextActive = nextSaved[0] || null;
            if (nextActive) {
                try { localStorage.setItem('weatherLocation', JSON.stringify(nextActive)); } catch (e) {}
            } else {
                try { localStorage.removeItem('weatherLocation'); } catch (e) {}
            }
            setWeatherLocation(nextActive);
        }
        persistWeatherState(nextActive, nextSaved);
    };

    return (
        <div onClick={() => setShowWeatherSettings(false)} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div onClick={e => e.stopPropagation()} className={`${theme==='dark'?'bg-slate-900 border-indigo-500/50':'bg-white border-slate-300'} border-2 rounded-2xl p-5`} style={{width:'360px', overflow:'hidden'}}>
                <h3 className={`text-sm font-black uppercase tracking-widest ${theme==='dark'?'text-indigo-400':'text-indigo-600'} mb-3`}>{window.t ? window.t("weather_location") : "Weather Location"}</h3>
                {weatherSaveError && (
                    <div data-testid="weather-save-error" className={`mb-3 px-2 py-1.5 rounded text-[9px] font-mono font-bold ${theme==='dark'?'bg-red-900/40 border border-red-500/40 text-red-300':'bg-red-50 border border-red-300 text-red-700'}`}>
                        {weatherSaveError}
                    </div>
                )}

                {/* Custom dropdown with inline delete */}
                <div className="mb-3 relative">
                    <label className={`text-[8px] font-black uppercase tracking-widest ${theme==='dark'?'text-slate-400':'text-slate-500'} block mb-1`}>{window.t ? window.t("current_location") : "Current Location"}</label>
                    <button
                        id="wl-dropdown-btn"
                        onClick={() => { const dd = document.getElementById('wl-dropdown-list'); dd.style.display = dd.style.display === 'block' ? 'none' : 'block'; }}
                        className={`w-full text-left ${theme==='dark'?'bg-slate-950 border-slate-700 text-slate-100':'bg-white border-slate-300 text-slate-800'} border rounded-lg py-2 px-3 text-[11px] font-mono font-bold focus:outline-none focus:border-indigo-500 cursor-pointer`}
                        style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2394a3b8' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 10px center', paddingRight:'28px', boxSizing:'border-box'}}
                    >
                        {curName}
                    </button>
                    <div
                        id="wl-dropdown-list"
                        style={{display:'none', position:'absolute', top:'100%', left:0, right:0, zIndex:10, maxHeight:'180px', overflowY:'auto'}}
                        className={`mt-1 rounded-lg border shadow-xl ${theme==='dark'?'bg-slate-950 border-slate-700':'bg-white border-slate-200'}`}
                    >
                        {savedLocs.map((loc, i) => {
                            const key = loc.lat.toFixed(4)+','+loc.lon.toFixed(4);
                            const isActive = key === currentKey;
                            const defKey = defaultLocation ? (defaultLocation.lat.toFixed(4)+','+defaultLocation.lon.toFixed(4)) : '';
                            const isPinned = key === defKey;
                            return (
                                <div key={i} className={`flex items-center px-3 py-2 text-[11px] font-mono ${theme==='dark'?'border-b border-slate-800 last:border-0':'border-b border-slate-100 last:border-0'} ${isActive ? (theme==='dark'?'bg-indigo-600/20 text-indigo-300':'bg-indigo-50 text-indigo-700') : (theme==='dark'?'text-slate-300 hover:bg-slate-800':'text-slate-700 hover:bg-slate-50')} transition-all`}>
                                    <div onClick={() => { document.getElementById('wl-dropdown-list').style.display='none'; selectLocation(loc); }} className="flex-1 cursor-pointer truncate font-bold">
                                        {loc.name || 'Unnamed'} <span className={`text-[8px] font-normal ${theme==='dark'?'text-slate-500':'text-slate-400'}`}>({loc.lat.toFixed(2)}, {loc.lon.toFixed(2)}{locElevationM(loc) != null ? ' · ' + Math.round(locElevationM(loc)) + ' m' : ''})</span>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); pinLocation(isPinned ? null : loc); }}
                                        title={isPinned ? 'Unpin (no auto-load default)' : 'Pin as default — auto-load this on every fresh session'}
                                        data-testid={`pin-location-${i}`}
                                        className={`ml-1 w-5 h-5 flex items-center justify-center rounded text-sm flex-shrink-0 transition-all ${isPinned ? (theme==='dark'?'text-amber-300 hover:bg-amber-500/20':'text-amber-500 hover:bg-amber-50') : (theme==='dark'?'text-slate-600 hover:text-amber-300 hover:bg-amber-500/10':'text-slate-300 hover:text-amber-500 hover:bg-amber-50')}`}
                                    >{isPinned ? '★' : '☆'}</button>
                                    <button onClick={(e) => { e.stopPropagation(); document.getElementById('wl-dropdown-list').style.display='none'; removeLocation(i, e); }} className={`ml-2 w-5 h-5 flex items-center justify-center rounded text-xs flex-shrink-0 ${theme==='dark'?'text-red-400 hover:bg-red-500/20':'text-red-500 hover:bg-red-50'} transition-all`} title="Delete">&times;</button>
                                </div>
                            );
                        })}
                        {savedLocs.length === 0 && (
                            <div className={`px-3 py-2 text-[10px] italic ${theme==='dark'?'text-slate-600':'text-slate-400'}`}>{window.t ? window.t("no_saved_locations") : "No saved locations"}</div>
                        )}
                    </div>
                </div>

                {/* Add new location */}
                <div className={`p-3 rounded-lg border border-dashed ${theme==='dark'?'border-slate-600 bg-slate-800/30':'border-slate-300 bg-slate-50'}`}>
                    <div className={`text-[8px] font-black uppercase tracking-widest ${theme==='dark'?'text-slate-400':'text-slate-500'} mb-2`}>Add New</div>
                    <input id="wl-new-name" type="text" placeholder={window.t ? window.t("location_name_ph") : "Location name"} className={`w-full mb-2 ${theme==='dark'?'bg-slate-950 border-slate-700 text-slate-100':'bg-white border-slate-300 text-slate-800'} border rounded py-1.5 px-2 text-[11px] font-mono focus:outline-none focus:border-indigo-500`} style={{boxSizing:'border-box'}} />
                    <div className="flex gap-1.5 mb-2">
                        <input id="wl-new-lat" type="number" step="0.01" placeholder="Lat" className={`flex-1 min-w-0 ${theme==='dark'?'bg-slate-950 border-slate-700 text-slate-100':'bg-white border-slate-300 text-slate-800'} border rounded py-1.5 px-2 text-[11px] font-mono focus:outline-none focus:border-indigo-500`} style={{boxSizing:'border-box'}} />
                        <input id="wl-new-lon" type="number" step="0.01" placeholder="Lon" className={`flex-1 min-w-0 ${theme==='dark'?'bg-slate-950 border-slate-700 text-slate-100':'bg-white border-slate-300 text-slate-800'} border rounded py-1.5 px-2 text-[11px] font-mono focus:outline-none focus:border-indigo-500`} style={{boxSizing:'border-box'}} />
                    </div>
                    <div className="flex gap-1.5 mb-2">
                        <input id="wl-new-asl" type="number" step="1" placeholder="ASL (m)" title="Metres above mean sea level from terrain DEM for the site lat/lng (not GPS altitude)" className={`flex-1 min-w-0 ${theme==='dark'?'bg-slate-950 border-slate-700 text-slate-100':'bg-white border-slate-300 text-slate-800'} border rounded py-1.5 px-2 text-[11px] font-mono focus:outline-none focus:border-indigo-500`} style={{boxSizing:'border-box'}} />
                        <button type="button" onClick={async () => {
                            const lat = parseFloat(document.getElementById('wl-new-lat').value);
                            const lon = parseFloat(document.getElementById('wl-new-lon').value);
                            if (!Number.isFinite(lat) || !Number.isFinite(lon)) { toast('Enter lat/lon first.'); return; }
                            const elev = await lookupAslFor(lat, lon, 'wl-new-asl');
                            if (elev != null) toast('ASL from DEM: ' + elev + ' m');
                        }} className={`shrink-0 px-2 py-1.5 rounded border text-[8px] font-black uppercase tracking-widest ${theme==='dark'?'bg-slate-950 border-slate-700 text-sky-300 hover:border-indigo-400':'bg-white border-slate-300 text-indigo-600 hover:border-indigo-400'}`} title="Fetch metres ASL from Open-Meteo terrain DEM for the current lat/lng">Lookup ASL</button>
                    </div>
                    <button onClick={addNew} className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-slate-100 font-black text-[9px] uppercase tracking-widest rounded transition-all">+ Add &amp; Load</button>
                </div>

                {weatherLocation && (
                    <div className={`mt-3 p-3 rounded-lg border ${theme==='dark'?'border-slate-700 bg-slate-800/20':'border-slate-200 bg-slate-50'}`}>
                        <div className={`text-[8px] font-black uppercase tracking-widest ${theme==='dark'?'text-slate-400':'text-slate-500'} mb-2`}>Site elevation (m ASL)</div>
                        <div className="flex gap-1.5 mb-1.5">
                            <input id="wl-cur-asl" key={'asl-'+currentKey} type="number" step="1" defaultValue={locElevationM(weatherLocation) != null ? Math.round(locElevationM(weatherLocation)) : ''} placeholder="m ASL" title="Metres above mean sea level from terrain DEM for the site lat/lng (not GPS altitude)" className={`flex-1 min-w-0 ${theme==='dark'?'bg-slate-950 border-slate-700 text-slate-100':'bg-white border-slate-300 text-slate-800'} border rounded py-1.5 px-2 text-[11px] font-mono focus:outline-none focus:border-indigo-500`} style={{boxSizing:'border-box'}} />
                            <button type="button" onClick={async () => {
                                const elev = await lookupAslFor(weatherLocation.lat, weatherLocation.lon, 'wl-cur-asl');
                                if (elev == null) return;
                                applyElevation(elev);
                                toast('ASL from DEM: ' + elev + ' m');
                            }} className={`shrink-0 px-2 py-1.5 rounded border text-[8px] font-black uppercase tracking-widest ${theme==='dark'?'bg-slate-950 border-slate-700 text-sky-300 hover:border-indigo-400':'bg-white border-slate-300 text-indigo-600 hover:border-indigo-400'}`} title="Fetch metres ASL from Open-Meteo terrain DEM">Lookup ASL</button>
                        </div>
                        <button type="button" onClick={() => applyElevation(document.getElementById('wl-cur-asl').value)} className={`w-full py-1 rounded border text-[8px] font-black uppercase tracking-widest ${theme==='dark'?'bg-slate-950 border-slate-700 text-slate-300 hover:border-indigo-400':'bg-white border-slate-300 text-slate-600 hover:border-indigo-400'}`}>Save ASL</button>
                        <div className={`mt-1.5 text-[8px] leading-snug ${theme==='dark'?'text-slate-500':'text-slate-400'}`}>ASL comes from a terrain DEM for the lat/lng (not browser GPS). Use Lookup ASL when working remotely.</div>
                    </div>
                )}

                <button onClick={() => setShowWeatherSettings(false)} className={`w-full mt-3 py-1.5 ${theme==='dark'?'bg-slate-800 border-slate-600 text-slate-400':'bg-slate-100 border-slate-300 text-slate-500'} border font-black text-[9px] uppercase tracking-widest rounded-lg transition-all`}>{t('cancel')}</button>
            </div>
        </div>
    );
}
