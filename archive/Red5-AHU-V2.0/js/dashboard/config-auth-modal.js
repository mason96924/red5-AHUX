/* ------------------------------------------------------------------
 * dashboard/config-auth-modal.js -- Stage B config gate.
 * Requires a signed-in editor/admin session (red5_auth cookie).
 * ------------------------------------------------------------------ */

function renderConfigAuthModal(ctx) {
    const {
        showConfigAuth, setShowConfigAuth,
        configPwInput, setConfigPwInput,
        configPwError, setConfigPwError,
    } = ctx;

    if (!showConfigAuth) return null;

    const submitConfigPw = async () => {
        const u = (configPwInput || '').trim();
        const p = (configPwInput || '').trim();
        // configPwInput reused as "username:password" or single password for admin
        const parts = u.split(':');
        const username = parts.length > 1 ? parts[0].trim() : 'admin';
        const password = parts.length > 1 ? parts.slice(1).join(':') : u;
        if (!password) {
            setConfigPwError('Enter password (or username:password).');
            return;
        }
        try {
            const resp = await fetch((window.API_BASE_URL || '') + '/api/auth/login', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const j = await resp.json();
            if (j && j.ok) {
                sessionStorage.setItem('engineerAuthenticated', 'true');
                window.location.href = window.location.origin + '/mapper';
                return;
            }
            setConfigPwError('Invalid credentials. Contact your administrator.');
            setConfigPwInput('');
        } catch (e) {
            setConfigPwError('Sign-in failed.');
        }
    };

    return (
<div onClick={() => setShowConfigAuth(false)} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
    <div onClick={e => e.stopPropagation()} className="bg-slate-900 border-2 border-amber-500/50 rounded-2xl p-8 w-96">
        <h3 className="text-sm font-black uppercase tracking-widest text-amber-400 mb-2">{window.t ? window.t("config_password") : "Config Access"}</h3>
        <p className="text-slate-500 text-xs mb-4">Sign in with your registered username and password. Admin: use <code className="text-amber-300">admin</code> and your master key.</p>
        <input 
            type="password" 
            value={configPwInput} 
            onChange={e => { setConfigPwInput(e.target.value); setConfigPwError(''); }}
            onKeyDown={e => { if (e.key === 'Enter') { submitConfigPw(); } }}
            autoFocus
            placeholder="password or username:password"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-4 text-sm text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
        />
        {configPwError && <p className="text-red-400 text-xs font-bold mt-2">{configPwError}</p>}
        <div className="flex gap-2 mt-4">
            <button 
                onClick={submitConfigPw}
                className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-slate-100 font-black text-xs uppercase tracking-widest rounded-lg transition-all"
            >
                Sign in
            </button>
            <button onClick={() => setShowConfigAuth(false)} className="flex-1 py-2 bg-slate-800 border border-slate-600 text-slate-400 font-black text-xs uppercase tracking-widest rounded-lg hover:bg-slate-700 transition-all">Cancel</button>
        </div>
        <p className="text-[10px] text-slate-600 mt-3 text-center">
            <a href="/" className="text-indigo-400 hover:underline">Open landing page</a>
            {' · '}
            <a href="/access.html" className="text-indigo-400 hover:underline">Manage users (admin)</a>
        </p>
    </div>
</div>
    );
}
