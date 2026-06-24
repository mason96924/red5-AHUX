/* ------------------------------------------------------------------
 * dashboard/config-auth-modal.js -- Engineer-mode password gate.
 * ------------------------------------------------------------------
 *
 * Extracted from app.js in Phase L.26 (2026-06-24).  Small 41-line
 * conditional block; gates the /mapper route behind a hash check
 * against the MASTER_KEY or a tenant-set password hash in localStorage.
 * ------------------------------------------------------------------ */

function renderConfigAuthModal(ctx) {
    const {
        showConfigAuth, setShowConfigAuth,
        configPwInput, setConfigPwInput,
        configPwError, setConfigPwError,
    } = ctx;

    if (!showConfigAuth) return null;

<div onClick={() => setShowConfigAuth(false)} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
    <div onClick={e => e.stopPropagation()} className="bg-slate-900 border-2 border-amber-500/50 rounded-2xl p-8 w-80">
        <h3 className="text-sm font-black uppercase tracking-widest text-amber-400 mb-4">{window.t ? window.t("config_password") : "Config Password"}</h3>
        <input 
            type="password" 
            value={configPwInput} 
            onChange={e => { setConfigPwInput(e.target.value); setConfigPwError(''); }}
            onKeyDown={e => { if (e.key === 'Enter') { const MASTER_KEY = 'b%9P$MdeQP]['; const pw = configPwInput; if (!pw || !pw.trim()) return; const hashPw = (s) => { let h = 0; for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h = h & h; } const hex = Math.abs(h).toString(16).padStart(8, '0'); let h2 = 0; const salted = s + hex; for (let i = 0; i < salted.length; i++) { h2 = ((h2 << 5) - h2) + salted.charCodeAt(i); h2 = h2 & h2; } return hex + Math.abs(h2).toString(16).padStart(8, '0'); }; const storedHash = localStorage.getItem('configPasswordHash') || ''; if (pw === MASTER_KEY || (storedHash && hashPw(pw) === storedHash)) { sessionStorage.setItem('engineerAuthenticated', 'true'); window.location.href = window.location.origin + '/mapper'; } else if (!storedHash) { setConfigPwError('No password set. Use landing page first.'); } else { setConfigPwError('Incorrect password.'); setConfigPwInput(''); } } }}
            autoFocus
            placeholder={window.t ? window.t("enter_password_ph") : "Enter password"}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-4 text-sm text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
        />
        {configPwError && <p className="text-red-400 text-xs font-bold mt-2">{configPwError}</p>}
        <div className="flex gap-2 mt-4">
            <button 
                onClick={() => {
                    const MASTER_KEY = 'b%9P$MdeQP][';
                    const pw = configPwInput;
                    if (!pw || !pw.trim()) return;
                    const hashPw = (s) => { let h = 0; for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h = h & h; } const hex = Math.abs(h).toString(16).padStart(8, '0'); let h2 = 0; const salted = s + hex; for (let i = 0; i < salted.length; i++) { h2 = ((h2 << 5) - h2) + salted.charCodeAt(i); h2 = h2 & h2; } return hex + Math.abs(h2).toString(16).padStart(8, '0'); };
                    const storedHash = localStorage.getItem('configPasswordHash') || '';
                    if (pw === MASTER_KEY || (storedHash && hashPw(pw) === storedHash)) {
                        sessionStorage.setItem('engineerAuthenticated', 'true');
                        window.location.href = window.location.origin + '/mapper';
                    } else if (!storedHash) {
                        setConfigPwError('No password set. Use landing page first.');
                    } else {
                        setConfigPwError('Incorrect password.');
                        setConfigPwInput('');
                    }
                }}
                className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-slate-100 font-black text-xs uppercase tracking-widest rounded-lg transition-all"
            >
                Enter
            </button>
            <button onClick={() => setShowConfigAuth(false)} className="flex-1 py-2 bg-slate-800 border border-slate-600 text-slate-400 font-black text-xs uppercase tracking-widest rounded-lg hover:bg-slate-700 transition-all">Cancel</button>
        </div>
    </div>
</div>
}
