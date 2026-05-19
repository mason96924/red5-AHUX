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
                if (!r.ok) {
                    const txt = await r.text();
                    throw new Error('Session exchange failed: ' + txt);
                }
                return r.json();
            })
            .then((body) => {
                // Clear the fragment so a back-button does not re-trigger.
                // After Piece A, the post-login landing is the V1.9 dashboard.
                window.location.replace('/dashboard.html');
            })
            .catch((err) => {
                console.error('[AuthCallback]', err);
                setStatus('Sign-in failed.  Returning to home...');
                setTimeout(() => window.location.replace('/'), 1500);
            });
    }, []);

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
