/* ------------------------------------------------------------------
 * dashboard/band-clamp-modal.js — Band SA-RH Clamp confirm dialog.
 * ------------------------------------------------------------------
 *
 * Extracted from app.js in Phase L.26 (2026-06-24).  The block had
 * lived as an inline IIFE inside App's render at the line that read
 * `{bandClampModal && (() => { ... })()}`.
 *
 * Mirrors the function-style extraction pattern set by vav-modal.js
 * and ahu-modal.js: a single top-level function `renderBandClampModal`
 * destructures a `ctx` object literal that the caller (App's render)
 * builds with the closure refs the body needs.
 *
 * Ctx props expected (7):
 *   bandClampModal, setBandClampModal,
 *   bandClampBusy,  setBandClampBusy,
 *   setBandClampApplied,
 *   theme, fetchJSON, toast
 * ------------------------------------------------------------------ */

function renderBandClampModal(ctx) {
    const {
        bandClampModal, setBandClampModal,
        bandClampBusy,  setBandClampBusy,
        setBandClampApplied,
        theme, fetchJSON, toast,
    } = ctx;

    if (!bandClampModal) return null;

    const { lo, hi, preview } = bandClampModal;
    const changed = preview.filter(p => p.changed);
    const onCancel = () => setBandClampModal(null);
    const onConfirm = async () => {
        setBandClampBusy(true);
        try {
            const j = await fetchJSON('/api/band-overrides/sa-rh-clamp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lo, hi, enabled: true, applied_by: 'dashboard' })
            });
            if (j.status === 'ok') {
                setBandClampApplied({ lo, hi });
                setBandClampModal(null);
            } else {
                toast('Apply failed: ' + (j.message || 'unknown'));
            }
        } catch (e) {
            toast(e.message);
        } finally {
            setBandClampBusy(false);
        }
    };

    return (
        <div onClick={onCancel} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm" data-testid="band-clamp-modal">
            <div onClick={e => e.stopPropagation()} className={`${theme==='dark'?'bg-slate-900 border-amber-500/60':'bg-white border-amber-400'} border-2 rounded-2xl p-5 shadow-2xl`} style={{width:'480px', maxHeight:'80vh', overflow:'hidden', display:'flex', flexDirection:'column'}}>
                <h3 className={`text-sm font-black uppercase tracking-widest ${theme==='dark'?'text-amber-400':'text-amber-700'} mb-2`}>Confirm SA-RH Clamp</h3>
                <p className={`text-[10px] font-mono mb-3 leading-relaxed ${theme==='dark'?'text-slate-400':'text-slate-600'}`}>
                    Applying <span className="font-black text-amber-500">{lo}-{hi}% RH</span> will clamp every band SA-RH target into this window and force the hum mode where needed.  This rewrites <code className={theme==='dark'?'text-emerald-300':'text-emerald-700'}>band_guide.csv</code> and every AHU <code className={theme==='dark'?'text-emerald-300':'text-emerald-700'}>CSV.Description</code> string on the controller.
                </p>
                <div className={`text-[9px] font-mono mb-2 px-2 py-1.5 rounded ${theme==='dark'?'bg-amber-900/30 border border-amber-700/40 text-amber-300':'bg-amber-50 border border-amber-300 text-amber-800'}`} data-testid="band-clamp-warning">
                    <span className="font-black uppercase tracking-wider">Warning:</span> {changed.length} of {preview.length} bands will change.  The clamped SA-RH value is written to each AHU humidity setpoint BACnet point (default: <code className={theme==='dark'?'text-emerald-300':'text-emerald-700'}>AV&lt;n&gt;</code> where <code>n</code> is the AHU number; override via <code>humidity_sp</code> in <code>collector_config.json</code>).  This DRIVES the humidifier coil mechanically -- confirm only if your AHU has a humidity loop wired to that point.
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar -mx-1 px-1" data-testid="band-clamp-preview">
                    <table className="w-full text-left border-separate border-spacing-y-1 text-[10px] font-mono">
                        <thead>
                            <tr className={`text-[8px] font-black uppercase ${theme==='dark'?'text-slate-500':'text-slate-400'}`}>
                                <th>Band</th><th>SA-RH Before</th><th>After</th><th>Hum Before</th><th>After</th>
                            </tr>
                        </thead>
                        <tbody>
                            {preview.map(p => (
                                <tr key={p.id} className={`${p.changed ? (theme==='dark'?'bg-amber-900/20':'bg-amber-50') : (theme==='dark'?'bg-slate-950/40':'bg-slate-100/50')} rounded`}>
                                    <td className={`px-2 py-1 font-black ${theme==='dark'?'text-indigo-400':'text-indigo-600'}`}>{p.id}</td>
                                    <td className="px-2 py-1">{p.before.sa_rh}%</td>
                                    <td className={`px-2 py-1 font-black ${p.changed ? (p.direction === 'down' ? 'text-cyan-400' : 'text-rose-400') : (theme==='dark'?'text-slate-500':'text-slate-400')}`}>
                                        {p.after.sa_rh}%{p.changed ? (p.direction === 'down' ? ' \u2193' : ' \u2191') : ''}
                                    </td>
                                    <td className={`px-2 py-1 text-[9px] ${theme==='dark'?'text-slate-400':'text-slate-600'}`}>{p.before.hum}</td>
                                    <td className={`px-2 py-1 text-[9px] font-black ${p.changed ? (theme==='dark'?'text-amber-400':'text-amber-700') : (theme==='dark'?'text-slate-500':'text-slate-400')}`}>{p.after.hum}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-3 flex gap-2 justify-end">
                    <button data-testid="band-clamp-cancel" onClick={onCancel} disabled={bandClampBusy} className={`px-3 py-2 rounded text-[10px] font-black uppercase tracking-wider border ${theme==='dark'?'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700':'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'}`}>Cancel</button>
                    <button data-testid="band-clamp-confirm" onClick={onConfirm} disabled={bandClampBusy} className={`px-3 py-2 rounded text-[10px] font-black uppercase tracking-wider border ${theme==='dark'?'bg-amber-500 border-amber-300 text-slate-900 hover:bg-amber-400':'bg-amber-400 border-amber-500 text-slate-900 hover:bg-amber-500'} shadow-md`}>
                        {bandClampBusy ? 'Applying...' : 'Confirm & Apply'}
                    </button>
                </div>
            </div>
        </div>
    );
}
