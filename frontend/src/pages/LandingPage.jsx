/**
 * Red5 Studio V2.0 - Public Demo Landing Page (Phase 1)
 *
 * This is the polished entry point for the publicly-hosted demo. It is
 * deliberately auth-less in Phase 1 -- the goal is to let prospects /
 * partners click "Try the Demo" and immediately see the live V1.9
 * dashboard running against the FastAPI demo backend.
 *
 * Phase 2 will reintroduce auth (Emergent Google OAuth) here, gating
 * access to per-tenant data instead of the canned demo configs.
 */
import React from 'react';

const LandingPage = () => {
    return (
        <div className="min-h-screen w-screen bg-slate-950 text-slate-100 flex flex-col"
             data-testid="v2-landing-root">
            {/* Top nav */}
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
                <a
                    href="/dashboard.html"
                    data-testid="v2-nav-dashboard-link"
                    className="text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-amber-300 transition-colors"
                >
                    Open Dashboard &rarr;
                </a>
            </header>

            {/* Hero */}
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

                    {/* Quick stats row */}
                    <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                        <DemoStat
                            label="Givoni Bands"
                            value="10"
                            sub="Climate-aware SA strategy table"
                            testid="v2-stat-bands"
                        />
                        <DemoStat
                            label="Weather Year"
                            value="2020"
                            sub="Seattle (Open-Meteo) cached"
                            testid="v2-stat-weather"
                        />
                        <DemoStat
                            label="Simulated AHUs"
                            value="3"
                            sub="East / South / West zones"
                            testid="v2-stat-ahus"
                        />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-800 px-6 sm:px-10 py-4 text-[11px] font-mono text-slate-500 flex flex-col sm:flex-row justify-between gap-2">
                <span data-testid="v2-footer-mode">
                    Demo Mode &middot; Read-only &middot; No controller
                    required &middot; No login
                </span>
                <span>V2.0 / Phase 1</span>
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
