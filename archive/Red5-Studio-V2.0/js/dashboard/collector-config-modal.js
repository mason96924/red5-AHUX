/* ------------------------------------------------------------------
 * dashboard/collector-config-modal.js — Collector config editor.
 * ------------------------------------------------------------------
 *
 * Extracted from app.js in Phase L.26 (2026-06-24).  The block had
 * lived as an inline `{showCollectorCfg && ( ... )}` conditional --
 * 143 lines covering AHU groups, equipment types, and settings tabs.
 *
 * Follows the function-style pattern used by the other extracted
 * modals; ctx destructures all the App-scope refs.
 * ------------------------------------------------------------------ */

function renderCollectorConfigModal(ctx) {
    const {
        showCollectorCfg, setShowCollectorCfg,
        ccTab, setCcTab,
        ccConfig, setCcConfig,
        ccEquipTypes,
        ccSaving, ccMsg, setCcMsg,
        ccEditGroup, setCcEditGroup,
        ccNewGroupName, setCcNewGroupName,
        ccNewGroupCsv, setCcNewGroupCsv,
        ccNewVav, setCcNewVav,
        saveCollectorCfg,
        dataMode, setDataMode,
        API_URL, theme,
    } = ctx;

    if (!showCollectorCfg) return null;

    return (
<div onClick={() => setShowCollectorCfg(false)} className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/70 backdrop-blur-sm" data-testid="collector-config-modal">
    <div onClick={e => e.stopPropagation()} className={`${theme==='dark'?'bg-slate-900 border-cyan-500/40':'bg-white border-slate-300'} border-2 rounded-2xl w-[700px] max-h-[85vh] flex flex-col shadow-2xl`}>
        <div className={`p-5 border-b ${theme==='dark'?'border-slate-700':'border-slate-200'} flex justify-between items-center`}>
            <h3 className={`text-sm font-black uppercase tracking-widest ${theme==='dark'?'text-cyan-400':'text-cyan-600'}`}>{window.t ? window.t("collector_configuration") : "Collector Configuration"}</h3>
            <button onClick={() => setShowCollectorCfg(false)} className={`w-7 h-7 rounded-full flex items-center justify-center text-lg font-bold ${theme==='dark'?'bg-slate-800 text-slate-400 hover:text-slate-100':'bg-slate-100 text-slate-500 hover:text-slate-800'} transition-all`}>&times;</button>
        </div>
        <div className={`flex border-b ${theme==='dark'?'border-slate-700':'border-slate-200'}`}>
            {['groups','types','settings'].map(tb => (
                <button key={tb} onClick={() => setCcTab(tb)} className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${ccTab===tb ? (theme==='dark'?'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5':'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50') : (theme==='dark'?'text-slate-500 hover:text-slate-300':'text-slate-400 hover:text-slate-600')}`}>{tb === 'groups' ? 'AHU Groups' : tb === 'types' ? 'Equipment Types' : 'Settings'}</button>
            ))}
        </div>
        {ccMsg && <div className={`px-5 py-2 text-[10px] font-bold ${ccMsg.includes('Error')||ccMsg.includes('fail') ? 'text-red-400 bg-red-500/10' : 'text-emerald-400 bg-emerald-500/10'}`}>{ccMsg}</div>}
        <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{maxHeight:'60vh'}}>
            {!ccConfig ? (
                <div className={`text-center py-10 ${theme==='dark'?'text-slate-500':'text-slate-400'} text-sm`}>{window.t ? window.t("loading_configuration") : "Loading configuration..."}</div>
            ) : ccTab === 'groups' ? (
                <div className="space-y-3">
                    {Object.entries(ccConfig.ahu_groups || {}).map(([name, grp]) => (
                        <div key={name} className={`p-4 rounded-xl border ${ccEditGroup===name ? (theme==='dark'?'border-cyan-500/50 bg-cyan-500/5':'border-cyan-500 bg-cyan-50') : (theme==='dark'?'border-slate-700 bg-slate-800/50':'border-slate-200 bg-slate-50')}`}>
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className={`text-sm font-black uppercase tracking-wider ${theme==='dark'?'text-indigo-400':'text-indigo-600'} font-mono`}>{name}</div>
                                    <div className={`text-[9px] ${theme==='dark'?'text-slate-500':'text-slate-400'} mt-0.5 font-mono`}>CSV: {grp.csv_object || '(none)'}</div>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {(grp.vavs || []).map(v => (
                                            <span key={v} className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono ${theme==='dark'?'bg-violet-500/20 text-violet-300 border border-violet-500/30':'bg-violet-100 text-violet-700 border border-violet-200'}`}>
                                                {v}
                                                {ccEditGroup===name && <button onClick={() => { const c = JSON.parse(JSON.stringify(ccConfig)); c.ahu_groups[name].vavs = c.ahu_groups[name].vavs.filter(x => x !== v); setCcConfig(c); }} className="ml-1 text-red-400 hover:text-red-300 font-black">&times;</button>}
                                            </span>
                                        ))}
                                        {(!grp.vavs || grp.vavs.length === 0) && <span className={`text-[8px] italic ${theme==='dark'?'text-slate-600':'text-slate-400'}`}>{window.t ? window.t("no_vavs_assigned") : "No VAVs assigned"}</span>}
                                    </div>
                                    {ccEditGroup===name && (
                                        <div className="space-y-2 mt-3">
                                            <div className="flex gap-1">
                                                <input type="text" value={ccNewVav} onChange={e=>setCcNewVav(e.target.value)} placeholder={window.t ? window.t("add_vav_name_ph") : "Add VAV name"} className={`flex-1 ${theme==='dark'?'bg-slate-950 border-slate-600 text-slate-100':'bg-white border-slate-300 text-slate-800'} border rounded px-2 py-1 text-[10px] font-mono focus:outline-none focus:border-cyan-500`} />
                                                <button onClick={() => { if (!ccNewVav.trim()) return; const c = JSON.parse(JSON.stringify(ccConfig)); if (!c.ahu_groups[name].vavs) c.ahu_groups[name].vavs = []; if (!c.ahu_groups[name].vavs.includes(ccNewVav.trim())) { c.ahu_groups[name].vavs.push(ccNewVav.trim()); setCcConfig(c); setCcNewVav(''); } }} className="px-2 py-1 bg-cyan-600 text-slate-100 rounded text-[9px] font-black uppercase hover:bg-cyan-500 transition-all">+VAV</button>
                                            </div>
                                            <div>
                                                <label className={`text-[8px] font-black uppercase tracking-wider ${theme==='dark'?'text-slate-400':'text-slate-500'}`}>{window.t ? window.t("csv_object_label") : "CSV Object:"}</label>
                                                <input type="text" defaultValue={grp.csv_object||''} onBlur={e => { const c = JSON.parse(JSON.stringify(ccConfig)); c.ahu_groups[name].csv_object = e.target.value.trim(); setCcConfig(c); }} className={`w-full mt-1 ${theme==='dark'?'bg-slate-950 border-slate-600 text-slate-100':'bg-white border-slate-300 text-slate-800'} border rounded px-2 py-1 text-[10px] font-mono focus:outline-none focus:border-cyan-500`} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-1 ml-2">
                                    <button onClick={() => setCcEditGroup(ccEditGroup===name ? null : name)} className={`px-2 py-1 text-[8px] font-black uppercase rounded transition-all ${ccEditGroup===name ? 'bg-cyan-600 text-slate-100' : (theme==='dark'?'bg-slate-700 text-slate-400 hover:text-cyan-400':'bg-slate-200 text-slate-500 hover:text-cyan-600')}`}>{ccEditGroup===name ? 'Done' : 'Edit'}</button>
                                    <button onClick={() => { if (!confirm('Delete group ' + name + '?')) return; const c = JSON.parse(JSON.stringify(ccConfig)); delete c.ahu_groups[name]; setCcConfig(c); if (ccEditGroup===name) setCcEditGroup(null); }} className={`px-2 py-1 text-[8px] font-black uppercase rounded transition-all ${theme==='dark'?'bg-slate-700 text-red-400 hover:bg-red-600 hover:text-slate-100':'bg-slate-200 text-red-500 hover:bg-red-500 hover:text-slate-100'}`}>Del</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className={`p-4 rounded-xl border border-dashed ${theme==='dark'?'border-slate-600 bg-slate-800/30':'border-slate-300 bg-slate-50'}`}>
                        <div className={`text-[9px] font-black uppercase tracking-wider ${theme==='dark'?'text-slate-400':'text-slate-500'} mb-2`}>{window.t ? window.t("add_new_ahu_group") : "Add New AHU Group"}</div>
                        <div className="flex gap-2">
                            <input type="text" value={ccNewGroupName} onChange={e=>setCcNewGroupName(e.target.value)} placeholder={window.t ? window.t("ahu_name_ph") : "AHU name (e.g. AHU-03-W)"} className={`flex-1 ${theme==='dark'?'bg-slate-950 border-slate-600 text-slate-100':'bg-white border-slate-300 text-slate-800'} border rounded px-2 py-1.5 text-[10px] font-mono focus:outline-none focus:border-cyan-500`} />
                            <input type="text" value={ccNewGroupCsv} onChange={e=>setCcNewGroupCsv(e.target.value)} placeholder={window.t ? window.t("csv_object_ph") : "CSV object"} className={`w-36 ${theme==='dark'?'bg-slate-950 border-slate-600 text-slate-100':'bg-white border-slate-300 text-slate-800'} border rounded px-2 py-1.5 text-[10px] font-mono focus:outline-none focus:border-cyan-500`} />
                            <button onClick={() => { if (!ccNewGroupName.trim()) return; const c = JSON.parse(JSON.stringify(ccConfig)); if (!c.ahu_groups) c.ahu_groups = {}; if (c.ahu_groups[ccNewGroupName.trim()]) { setCcMsg('Error: Group already exists'); return; } c.ahu_groups[ccNewGroupName.trim()] = { csv_object: ccNewGroupCsv.trim() || 'CSV_' + ccNewGroupName.trim().replace(/[^A-Za-z0-9]/g,''), vavs: [] }; setCcConfig(c); setCcNewGroupName(''); setCcNewGroupCsv(''); }} className="px-3 py-1.5 bg-cyan-600 text-slate-100 rounded text-[9px] font-black uppercase hover:bg-cyan-500 transition-all">Add</button>
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button onClick={() => saveCollectorCfg(ccConfig)} disabled={ccSaving} className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-slate-100 font-black text-[10px] uppercase tracking-widest rounded-lg transition-all">{ccSaving ? 'Saving...' : 'Save Config'}</button>
                    </div>
                </div>
            ) : ccTab === 'types' ? (
                <div className="space-y-4">
                    {ccEquipTypes ? ['ahu_types', 'vav_types'].map(typeKey => {
                        const types = ccEquipTypes[typeKey] || {};
                        return (
                            <div key={typeKey} className="space-y-3">
                                <h4 className={`text-[10px] font-black uppercase tracking-widest ${theme==='dark'?'text-indigo-400':'text-indigo-600'}`}>{typeKey === 'ahu_types' ? 'AHU Types' : 'VAV Types'}</h4>
                                {Object.entries(types).map(([tid, tdef]) => (
                                    <div key={tid} className={`p-3 rounded-xl border ${theme==='dark'?'border-slate-700 bg-slate-800/50':'border-slate-200 bg-slate-50'}`}>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className={`text-xs font-black font-mono ${theme==='dark'?'text-amber-400':'text-amber-600'}`}>Type {tid}: {tdef.name || ''}</span>
                                            <span className={`text-[8px] ${theme==='dark'?'text-slate-500':'text-slate-400'} font-mono`}>{(tdef.points||[]).length} points</span>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-[9px]">
                                                <thead><tr className={`${theme==='dark'?'text-slate-400 border-slate-700':'text-slate-500 border-slate-200'} border-b`}>
                                                    {['Label','Name','Unit','Access'].map(h => <th key={h} className="py-1 px-2 text-left font-black uppercase tracking-wider">{h}</th>)}
                                                </tr></thead>
                                                <tbody>
                                                    {(tdef.points||[]).map((pt, pi) => (
                                                        <tr key={pi} className={`${theme==='dark'?'border-slate-800 hover:bg-slate-800/50':'border-slate-100 hover:bg-slate-100'} border-b transition-colors`}>
                                                            <td className={`py-1 px-2 font-black font-mono ${theme==='dark'?'text-cyan-300':'text-cyan-600'}`}>{pt.label}</td>
                                                            <td className={`py-1 px-2 font-mono ${theme==='dark'?'text-slate-300':'text-slate-700'}`}>{pt.name}</td>
                                                            <td className={`py-1 px-2 ${theme==='dark'?'text-slate-400':'text-slate-500'}`}>{pt.unit || '-'}</td>
                                                            <td className="py-1 px-2"><span className={`px-1 py-0.5 rounded text-[7px] font-black ${pt.access==='RW' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>{pt.access}</span></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    }) : <div className={`text-center py-10 ${theme==='dark'?'text-slate-500':'text-slate-400'} text-sm`}>{window.t ? window.t("loading_equip_types") : "Loading equipment types..."}</div>}
                </div>
            ) : ccTab === 'settings' ? (
                <div className="space-y-4">
                    <div className={`p-4 rounded-xl border ${theme==='dark'?'border-slate-700 bg-slate-800/50':'border-slate-200 bg-slate-50'}`}>
                        <label className={`text-[9px] font-black uppercase tracking-widest ${theme==='dark'?'text-slate-400':'text-slate-500'} block mb-2`}>{window.t ? window.t("data_source_mode") : "Data Source Mode"}</label>
                        <div className="flex gap-2">
                            <button onClick={() => { fetch(API_URL + '/api/data-mode', { method:'POST', credentials: 'include', headers:{'Content-Type':'application/json'}, body: JSON.stringify({mode:'simulator'}) }).then(r=>r.json()).then(d=>{ if(d.success) { setDataMode('simulator'); if (ccConfig) { const c = JSON.parse(JSON.stringify(ccConfig)); c.mock_mode = false; setCcConfig(c); setCcMsg(d.persisted === false ? 'Switched to Simulator (preview only -- sign in to persist).' : 'Switched to Simulator.'); } } }); }} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${dataMode==='simulator' ? 'bg-emerald-600 border-emerald-400 text-slate-100' : (theme==='dark'?'bg-slate-800 border-slate-600 text-slate-400':'bg-slate-100 border-slate-300 text-slate-500')}`} data-testid="mode-simulator-btn">Simulator (Config AHUs)</button>
                            <button onClick={() => { fetch(API_URL + '/api/data-mode', { method:'POST', credentials: 'include', headers:{'Content-Type':'application/json'}, body: JSON.stringify({mode:'mock'}) }).then(r=>r.json()).then(d=>{ if(d.success) { setDataMode('mock'); if (ccConfig) { const c = JSON.parse(JSON.stringify(ccConfig)); c.mock_mode = true; setCcConfig(c); setCcMsg(d.persisted === false ? 'Switched to Mock (preview only -- sign in to persist).' : 'Switched to Mock.'); } } }); }} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${dataMode==='mock' ? 'bg-amber-600 border-amber-400 text-slate-100' : (theme==='dark'?'bg-slate-800 border-slate-600 text-slate-400':'bg-slate-100 border-slate-300 text-slate-500')}`} data-testid="mode-mock-btn">Mock (14 Demo AHUs)</button>
                        </div>
                        <p className={`text-[8px] mt-2 ${theme==='dark'?'text-slate-600':'text-slate-400'}`}>Simulator reads from collector_config.json. Mock generates 14 random demo AHUs.</p>
                    </div>
                    <div className={`p-4 rounded-xl border ${theme==='dark'?'border-slate-700 bg-slate-800/50':'border-slate-200 bg-slate-50'}`}>
                        <label className={`text-[9px] font-black uppercase tracking-widest ${theme==='dark'?'text-slate-400':'text-slate-500'} block mb-2`}>Poll Interval (seconds)</label>
                        <input type="number" min="1" max="300" defaultValue={ccConfig.interval || 5} onBlur={e => { const c = JSON.parse(JSON.stringify(ccConfig)); c.interval = Math.max(1, Math.min(300, parseInt(e.target.value) || 5)); setCcConfig(c); }} className={`w-32 ${theme==='dark'?'bg-slate-950 border-slate-600 text-slate-100':'bg-white border-slate-300 text-slate-800'} border rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-cyan-500`} />
                    </div>
                    <div className={`p-4 rounded-xl border ${theme==='dark'?'border-slate-700 bg-slate-800/50':'border-slate-200 bg-slate-50'}`}>
                        <label className={`text-[9px] font-black uppercase tracking-widest ${theme==='dark'?'text-slate-400':'text-slate-500'} block mb-3`}>{window.t ? window.t("dashboard_point_map") : "Dashboard Point Map"}</label>
                        {['ahu', 'vav'].map(eqType => {
                            const dpm = (ccConfig.dashboard_point_map || {})[eqType] || {};
                            return (
                                <div key={eqType} className="mb-3">
                                    <div className={`text-[9px] font-black uppercase ${theme==='dark'?'text-indigo-400':'text-indigo-600'} mb-1`}>{eqType.toUpperCase()} Mappings</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(dpm).map(([k, v]) => (
                                            <div key={k} className="flex gap-1 items-center">
                                                <span className={`text-[8px] font-mono font-bold ${theme==='dark'?'text-slate-400':'text-slate-500'} w-16 text-right`}>{k}:</span>
                                                <input type="text" defaultValue={v} onBlur={e => { const c = JSON.parse(JSON.stringify(ccConfig)); if (!c.dashboard_point_map) c.dashboard_point_map = {}; if (!c.dashboard_point_map[eqType]) c.dashboard_point_map[eqType] = {}; c.dashboard_point_map[eqType][k] = e.target.value.trim(); setCcConfig(c); }} className={`flex-1 ${theme==='dark'?'bg-slate-950 border-slate-600 text-slate-100':'bg-white border-slate-300 text-slate-800'} border rounded px-2 py-1 text-[10px] font-mono focus:outline-none focus:border-cyan-500`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-end pt-2">
                        <button onClick={() => saveCollectorCfg(ccConfig)} disabled={ccSaving} className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-slate-100 font-black text-[10px] uppercase tracking-widest rounded-lg transition-all">{ccSaving ? 'Saving...' : 'Save Config'}</button>
                    </div>
                </div>
            ) : null}
        </div>
    </div>
</div>
    );
}
