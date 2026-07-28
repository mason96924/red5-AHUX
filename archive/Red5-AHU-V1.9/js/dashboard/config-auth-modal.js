/* ------------------------------------------------------------------
 * dashboard/config-auth-modal.js -- Legacy config gate (server-auth).
 * ------------------------------------------------------------------
 * Replaced the old browser-side master-key check.  If this modal is
 * ever shown, send the operator to Settings (/) to sign in.
 * ------------------------------------------------------------------ */

function renderConfigAuthModal(ctx) {
    const { showConfigAuth, setShowConfigAuth } = ctx;

    if (!showConfigAuth) return null;

    return (
<div onClick={() => setShowConfigAuth(false)} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
    <div onClick={e => e.stopPropagation()} className="bg-slate-900 border-2 border-amber-500/50 rounded-2xl p-8 w-80 text-center">
        <h3 className="text-sm font-black uppercase tracking-widest text-amber-400 mb-4">Sign in required</h3>
        <p className="text-slate-400 text-xs mb-6 leading-relaxed">
            Configuration changes require a registered account. Sign in at Settings, then open Config from the dashboard.
        </p>
        <div className="flex gap-2">
            <button
                onClick={() => { window.location.href = '/?auth=config'; }}
                className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-slate-100 font-black text-xs uppercase tracking-widest rounded-lg transition-all"
            >
                Go to Settings
            </button>
            <button onClick={() => setShowConfigAuth(false)} className="flex-1 py-2 bg-slate-800 border border-slate-600 text-slate-400 font-black text-xs uppercase tracking-widest rounded-lg hover:bg-slate-700 transition-all">Cancel</button>
        </div>
    </div>
</div>
    );
}
