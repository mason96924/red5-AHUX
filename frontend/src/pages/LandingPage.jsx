/**
 * Red5 Studio V2.0 - Public Demo Landing Page (Phase 2 Piece A).
 *
 * Adds Emergent Google Auth:
 *   - Unauthenticated visitors see "Sign in with Google" + "Try the Demo".
 *   - Authenticated visitors see their avatar/name and a Logout button.
 *   - The anonymous demo path is preserved: anyone can still hit
 *     /dashboard.html without signing in (Phase 2 Piece A decision = i).
 *
 * REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
 */
import React, { useCallback, useEffect, useState } from 'react';

const LandingPage = () => {
    // null -> still checking; object -> signed in; false -> anonymous.
    const [user, setUser] = useState(null);

    const checkAuth = useCallback(async () => {
        // If returning from OAuth, AuthCallback handles it -- skip /me probe.
        if (typeof window !== 'undefined' && window.location.hash && window.location.hash.includes('session_id=')) {
            return;
        }
        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || window.location.origin;
            const r = await fetch(`${backendUrl}/api/auth/me`, { credentials: 'include' });
            if (r.ok) {
                setUser(await r.json());
            } else {
                setUser(false);
            }
        } catch (err) {
            setUser(false);
        }
    }, []);

    useEffect(() => { checkAuth(); }, [checkAuth]);

    const handleSignIn = () => {
        // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
        const redirectUrl = window.location.origin + '/dashboard';
        window.location.href =
            `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
    };

    const handleLogout = async () => {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || window.location.origin;
        try {
            await fetch(`${backendUrl}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (err) {
            // swallow -- the cookie will expire on its own
        }
        setUser(false);
    };

    return (
        <div className="min-h-screen w-screen bg-slate-950 text-slate-100 flex flex-col"
             data-testid="v2-landing-root">
            <header className="border-b border-slate-800 px-6 sm:px-10 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center font-black text-slate-950">
                        R5
                    </div>
                    <div className="font-black uppercase tracking-tight text-sm">
                        Red5 Studio
                        <span className="ml-2 text-[10px] font-mono font-bold text-amber-400 align-middle"
                              data-testid="v2-phase-chip">
                            V2.0 / DEMO
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {user === null && (
                        <div data-testid="v2-auth-checking"
                             className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                            ...
                        </div>
                    )}
                    {user && user.email && (
                        <div className="flex items-center gap-3" data-testid="v2-user-pill">
                            {user.picture
                                ? <img src={user.picture} alt={user.name}
                                       className="w-7 h-7 rounded-full border border-slate-700"
                                       data-testid="v2-user-avatar" />
                                : <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 grid place-items-center font-black text-xs">
                                      {(user.name || user.email).slice(0, 1).toUpperCase()}
                                  </div>}
                            <div className="hidden sm:block text-xs">
                                <div className="font-bold leading-tight" data-testid="v2-user-name">{user.name}</div>
                                <div className="text-slate-500 leading-tight" data-testid="v2-user-email">{user.email}</div>
                            </div>
                            {user.is_admin && (
                                <a
                                    href="/admin/access-control"
                                    data-testid="v2-admin-allowlist-link"
                                    className="ml-1 px-3 py-1.5 text-[10px] font-mono font-black uppercase tracking-wider border border-amber-700 text-amber-300 hover:bg-amber-400 hover:text-slate-950 rounded transition-colors"
                                >
                                    Access Control
                                </a>
                            )}
                            <button
                                onClick={handleLogout}
                                data-testid="v2-logout-btn"
                                className="ml-1 px-3 py-1.5 text-[10px] font-mono font-black uppercase tracking-wider border border-slate-700 hover:border-rose-400 hover:text-rose-300 rounded transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                    {user === false && (
                        <button
                            onClick={handleSignIn}
                            data-testid="v2-signin-btn"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white text-slate-900 hover:bg-amber-50 font-bold text-xs tracking-tight transition-colors"
                        >
                            <span className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 via-amber-500 to-rose-500" aria-hidden />
                            Sign in with Google
                        </button>
                    )}
                    <a
                        href="/dashboard.html"
                        data-testid="v2-nav-dashboard-link"
                        className="text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-amber-300 transition-colors"
                    >
                        Open Dashboard &rarr;
                    </a>
                </div>
            </header>

            <main className="flex-1 grid place-items-center px-6 sm:px-10 py-12">
                <div className="max-w-3xl text-center">
                    <p className="text-[11px] font-mono font-black uppercase tracking-[0.25em] text-amber-400 mb-3"
                       data-testid="v2-hero-eyebrow">
                        Building Diagnostic Command Center
                    </p>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none mb-5"
                        data-testid="v2-hero-title">
                        Read the psychrometrics.<br />
                        <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-fuchsia-400 bg-clip-text text-transparent">
                            Run the building.
                        </span>
                    </h1>
                    <p className="text-base sm:text-lg text-slate-400 mb-10 leading-relaxed">
                        Live 3D psychrometric chart, Givoni-band SA strategy
                        engine, ERV B-shift visualizer, and a no-BMS-required
                        Demo Mode pulling from a year of real Open-Meteo
                        weather. Tap the dashboard below to take it for a spin.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <a
                            href="/dashboard.html"
                            data-testid="v2-cta-open-dashboard"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-950 font-black uppercase tracking-wider text-sm transition-colors"
                        >
                            Try the Dashboard
                            <span aria-hidden>&rarr;</span>
                        </a>
                        <a
                            href="/equipment_mapper.html"
                            data-testid="v2-cta-open-mapper"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-slate-700 hover:border-amber-400 hover:text-amber-300 text-slate-300 font-black uppercase tracking-wider text-sm transition-colors"
                        >
                            Equipment Mapper
                        </a>
                    </div>

                    <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                        <DemoStat label="Givoni Bands"   value="10"   sub="Climate-aware SA strategy table"     testid="v2-stat-bands"/>
                        <DemoStat label="Weather Year"   value="2020" sub="Seattle (Open-Meteo) cached"        testid="v2-stat-weather"/>
                        <DemoStat label="Simulated AHUs" value="3"    sub="East / South / West zones"         testid="v2-stat-ahus"/>
                    </div>
                </div>
            </main>

            <footer className="border-t border-slate-800 px-6 sm:px-10 py-4 text-[11px] font-mono text-slate-500 flex flex-col sm:flex-row justify-between gap-2">
                <span data-testid="v2-footer-mode">
                    Demo Mode &middot; Read-only &middot; No controller required &middot; Sign-in optional
                </span>
                <span>V2.0 / Phase 2a (auth)</span>
            </footer>
        </div>
    );
};

const DemoStat = ({ label, value, sub, testid }) => (
    <div className="border border-slate-800 rounded-md px-4 py-3 bg-slate-900/40" data-testid={testid}>
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">{label}</div>
        <div className="text-3xl font-black text-amber-300 mt-1">{value}</div>
        <div className="text-xs text-slate-400 mt-1">{sub}</div>
    </div>
);

export default LandingPage;
