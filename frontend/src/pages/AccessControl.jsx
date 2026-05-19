/**
 * AccessControl - Admin-only allowlist manager (Phase 2 Piece C).
 *
 * Visible at /admin/access-control.  Only renders for signed-in admins
 * (server-side check via /api/auth/me?is_admin=true); non-admins are
 * shown a polite rejection and a link back to the landing page.
 *
 * Backend contract:
 *   GET    /api/auth/allowlist          -> {open, entries: [...]}
 *   POST   /api/auth/allowlist  {type, value}
 *   DELETE /api/auth/allowlist/{id}
 *
 * REMINDER: All fetches include `credentials: 'include'` for the
 * httpOnly session_token cookie.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_BACKEND_URL;

const AccessControl = () => {
    const navigate = useNavigate();
    const [me, setMe] = useState(null);
    const [entries, setEntries] = useState([]);
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newType, setNewType] = useState('domain');
    const [newValue, setNewValue] = useState('');
    const [busy, setBusy] = useState(false);

    const loadMe = useCallback(async () => {
        try {
            const r = await fetch(`${API}/api/auth/me`, { credentials: 'include' });
            if (r.ok) setMe(await r.json()); else setMe(false);
        } catch (e) { setMe(false); }
    }, []);

    const loadEntries = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const r = await fetch(`${API}/api/auth/allowlist`, { credentials: 'include' });
            if (!r.ok) {
                setError(`Failed to load allowlist (${r.status})`);
                setEntries([]);
                setOpen(true);
                return;
            }
            const body = await r.json();
            setEntries(body.entries || []);
            setOpen(!!body.open);
        } catch (e) {
            setError('Network error loading allowlist');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadMe(); }, [loadMe]);
    useEffect(() => { if (me && me.is_admin) loadEntries(); }, [me, loadEntries]);

    const addEntry = async (e) => {
        e.preventDefault();
        if (!newValue.trim()) return;
        setBusy(true);
        setError('');
        try {
            const r = await fetch(`${API}/api/auth/allowlist`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: newType, value: newValue.trim() }),
            });
            if (!r.ok) {
                const txt = await r.text();
                setError(`Add failed: ${txt}`);
                return;
            }
            setNewValue('');
            await loadEntries();
        } finally {
            setBusy(false);
        }
    };

    const removeEntry = async (id) => {
        setBusy(true);
        setError('');
        try {
            const r = await fetch(`${API}/api/auth/allowlist/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!r.ok) {
                setError(`Remove failed (${r.status})`);
                return;
            }
            await loadEntries();
        } finally {
            setBusy(false);
        }
    };

    // Auth state guards
    if (me === null) {
        return (
            <div className="min-h-screen w-screen bg-slate-950 text-slate-300 grid place-items-center font-mono text-sm"
                 data-testid="access-control-loading">
                Checking access...
            </div>
        );
    }
    if (!me || !me.email) {
        return (
            <div className="min-h-screen w-screen bg-slate-950 text-slate-100 grid place-items-center"
                 data-testid="access-control-anonymous">
                <div className="max-w-md text-center border border-slate-800 rounded-lg p-8">
                    <h1 className="text-xl font-black mb-2">Sign-in required</h1>
                    <p className="text-slate-400 text-sm mb-6">
                        Access Control is restricted to administrators.
                    </p>
                    <button data-testid="access-control-back-home"
                            onClick={() => navigate('/')}
                            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black uppercase tracking-wider text-xs rounded">
                        Go to home
                    </button>
                </div>
            </div>
        );
    }
    if (!me.is_admin) {
        return (
            <div className="min-h-screen w-screen bg-slate-950 text-slate-100 grid place-items-center"
                 data-testid="access-control-forbidden">
                <div className="max-w-md text-center border border-rose-900 rounded-lg p-8">
                    <div className="text-rose-400 text-[10px] font-mono font-black uppercase tracking-widest mb-2">
                        403 — Admin Only
                    </div>
                    <h1 className="text-xl font-black mb-2">Access Control is admin-only</h1>
                    <p className="text-slate-400 text-sm mb-6">
                        You're signed in as <span className="text-amber-300">{me.email}</span> but
                        you are not on the admin roster.  Ask an existing administrator to add you,
                        or contact the deployment owner.
                    </p>
                    <button data-testid="access-control-back-home"
                            onClick={() => navigate('/')}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-black uppercase tracking-wider text-xs rounded border border-slate-700">
                        Back to home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-screen bg-slate-950 text-slate-100 flex flex-col"
             data-testid="access-control-root">
            <header className="border-b border-slate-800 px-6 sm:px-10 py-4 flex items-center justify-between">
                <div>
                    <div className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-amber-400">
                        V2.0 / Phase 2c · Access Control
                    </div>
                    <h1 className="text-2xl font-black tracking-tight" data-testid="access-control-title">
                        Sign-in Allowlist
                    </h1>
                </div>
                <button data-testid="access-control-back"
                        onClick={() => navigate('/')}
                        className="px-3 py-1.5 text-[10px] font-mono font-black uppercase tracking-wider border border-slate-700 hover:border-amber-300 hover:text-amber-300 rounded">
                    &larr; Back
                </button>
            </header>

            <main className="flex-1 px-6 sm:px-10 py-8 max-w-3xl w-full mx-auto">
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                    Limit who can sign in with Google.  Add an exact email
                    (<code className="text-amber-300">alice@example.com</code>) or an
                    entire domain (<code className="text-amber-300">example.com</code>).
                    {' '}
                    <strong className="text-slate-200">An empty list is "open":</strong> anyone
                    with a Google identity can sign in.  Admin accounts on the
                    <code className="text-amber-300 mx-1">ADMIN_EMAILS</code> roster always
                    bypass this list, so a typo can never lock you out.
                </p>

                {open && (
                    <div data-testid="access-control-open-banner"
                         className="mb-6 border border-amber-700 bg-amber-950/40 rounded-md px-4 py-3 text-sm">
                        <span className="text-amber-300 font-bold">Allowlist is OPEN.</span>
                        <span className="text-slate-300 ml-2">
                            Anyone with a Google account can sign in until you add at least one entry.
                        </span>
                    </div>
                )}

                <form onSubmit={addEntry}
                      className="flex flex-col sm:flex-row gap-2 mb-6"
                      data-testid="access-control-add-form">
                    <select value={newType} onChange={(e) => setNewType(e.target.value)}
                            data-testid="access-control-type-select"
                            className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm">
                        <option value="domain">Domain</option>
                        <option value="email">Email</option>
                    </select>
                    <input
                        type="text"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        placeholder={newType === 'domain' ? 'example.com' : 'alice@example.com'}
                        data-testid="access-control-value-input"
                        className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm font-mono"
                    />
                    <button type="submit" disabled={busy || !newValue.trim()}
                            data-testid="access-control-add-btn"
                            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-black uppercase tracking-wider text-xs rounded">
                        Add
                    </button>
                </form>

                {error && (
                    <div data-testid="access-control-error"
                         className="mb-4 border border-rose-700 bg-rose-950/40 rounded-md px-4 py-2 text-sm text-rose-300">
                        {error}
                    </div>
                )}

                <div className="border border-slate-800 rounded-md overflow-hidden"
                     data-testid="access-control-table">
                    <div className="grid grid-cols-[100px_1fr_140px_80px] gap-2 px-4 py-2 bg-slate-900 text-[10px] font-mono font-black uppercase tracking-widest text-slate-500">
                        <div>Type</div>
                        <div>Value</div>
                        <div>Added</div>
                        <div className="text-right">Action</div>
                    </div>
                    {loading && (
                        <div className="px-4 py-6 text-center text-slate-500 text-sm" data-testid="access-control-loading-row">
                            Loading...
                        </div>
                    )}
                    {!loading && entries.length === 0 && (
                        <div className="px-4 py-6 text-center text-slate-500 text-sm" data-testid="access-control-empty-row">
                            No entries yet.  Anyone can sign in.
                        </div>
                    )}
                    {!loading && entries.map((e) => (
                        <div key={e.id}
                             data-testid={`access-control-row-${e.id}`}
                             className="grid grid-cols-[100px_1fr_140px_80px] gap-2 px-4 py-2 border-t border-slate-800 items-center text-sm">
                            <div>
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase tracking-wider ${e.type === 'domain' ? 'bg-indigo-900/50 text-indigo-300' : 'bg-emerald-900/50 text-emerald-300'}`}>
                                    {e.type}
                                </span>
                            </div>
                            <div className="font-mono text-slate-200">{e.value}</div>
                            <div className="text-[11px] text-slate-500 font-mono">
                                {e.added_at ? new Date(e.added_at).toLocaleDateString() : '—'}
                            </div>
                            <div className="text-right">
                                <button
                                    onClick={() => removeEntry(e.id)}
                                    disabled={busy}
                                    data-testid={`access-control-remove-${e.id}`}
                                    className="text-rose-400 hover:text-rose-300 disabled:opacity-40 text-xs font-mono font-bold uppercase"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default AccessControl;
