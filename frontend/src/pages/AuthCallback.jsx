/**
 * AuthCallback - handles the Emergent OAuth redirect.
 *
 * The Emergent auth flow lands the browser at:
 *    <frontend>/dashboard#session_id=<one-time-id>
 *
 * AppRouter detects `location.hash.includes('session_id=')` synchronously
 * (NOT in a useEffect -- that runs after the first render and creates a
 * race with any ProtectedRoute / AuthProvider check_auth call) and
 * renders THIS component instead of the normal routes.  We then:
 *   1. exchange the session_id for a session_token via POST /api/auth/session
 *   2. let the browser store the httpOnly cookie returned in the response
 *   3. navigate to /dashboard.html (the live V1.9 SPA) with replace=true
 *      so the session_id never appears in history.
 *
 * useRef-gated to be idempotent under React 18 StrictMode (which double-
 * invokes effects in development).
 */
import { useEffect, useRef, useState } from 'react';

const AuthCallback = () => {
    const hasProcessed = useRef(false);
    const [status, setStatus] = useState('Signing you in...');

    useEffect(() => {
        // Idempotency guard -- StrictMode double-fires effects in dev.
        if (hasProcessed.current) return;
        hasProcessed.current = true;

        const fragment = window.location.hash || '';
        const match = fragment.match(/session_id=([^&]+)/);
        if (!match) {
            setStatus('Missing session_id in URL.  Redirecting...');
            window.location.replace('/');
            return;
        }
        const sessionId = decodeURIComponent(match[1]);

        const backendUrl = process.env.REACT_APP_BACKEND_URL || window.location.origin;
        fetch(`${backendUrl}/api/auth/session`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId }),
        })
            .then(async (r) => {
                if (r.status === 403) {
                    // Allowlist rejection (Phase 2c).  Surface a friendly screen
                    // instead of redirecting away silently.
                    let detail = 'Access not permitted. Contact your administrator.';
                    try {
                        const body = await r.json();
                        if (body && body.detail) detail = body.detail;
                    } catch (e) { /* keep default */ }
                    setStatus('denied:' + detail);
                    return null;
                }
                if (!r.ok) {
                    const txt = await r.text();
                    throw new Error('Session exchange failed: ' + txt);
                }
                return r.json();
            })
            .then((body) => {
                if (body === null) return;  // 403 path already handled
                // Clear the fragment so a back-button does not re-trigger.
                // Honor an optional post-login redirect target set by other
                // legacy pages (e.g. equipment_mapper.html) so the user lands
                // back where they kicked off the sign-in flow.
                let target = '/dashboard.html';
                try {
                    const stashed = localStorage.getItem('r5_post_login_redirect');
                    if (stashed && stashed.startsWith('/')) {
                        target = stashed;
                        localStorage.removeItem('r5_post_login_redirect');
                    }
                } catch (e) { /* localStorage may be disabled */ }
                window.location.replace(target);
            })
            .catch((err) => {
                console.error('[AuthCallback]', err);
                setStatus('Sign-in failed.  Returning to home...');
                setTimeout(() => window.location.replace('/'), 1500);
            });
    }, []);

    if (status.startsWith('denied:')) {
        const message = status.slice('denied:'.length);
        return (
            <div data-testid="auth-callback-denied"
                 className="min-h-screen w-screen bg-slate-950 text-slate-100 grid place-items-center px-6">
                <div className="max-w-md text-center border border-rose-900 rounded-lg p-8 bg-slate-900/40">
                    <div className="text-rose-400 text-[10px] font-mono font-black uppercase tracking-[0.25em] mb-3">
                        403 — Access Denied
                    </div>
                    <h1 className="text-2xl font-black mb-3">Sign-in not permitted</h1>
                    <p className="text-slate-300 text-sm leading-relaxed mb-6"
                       data-testid="auth-callback-denied-message">
                        {message}
                    </p>
                    <a href="/"
                       data-testid="auth-callback-denied-home"
                       className="inline-block px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black uppercase tracking-wider text-xs rounded">
                        Back to home
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div data-testid="auth-callback-root"
             className="min-h-screen w-screen bg-slate-950 text-slate-100 grid place-items-center font-mono text-sm">
            <div className="flex items-center gap-3 px-4 py-3 border border-slate-800 rounded-md">
                <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" aria-hidden />
                <span>{status}</span>
            </div>
        </div>
    );
};

export default AuthCallback;
