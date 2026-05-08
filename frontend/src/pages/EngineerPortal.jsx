/**
 * Engineer Portal - Authenticated Access
 * 
 * Provides choice between:
 * 1. Configuration Tool (equipment/map setup)
 * 2. Master UI Dashboard (operational interface)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import useInactivityLogout from '../hooks/useInactivityLogout';

const EngineerPortal = () => {
    const navigate = useNavigate();
    
    // Auto logout after 30 minutes of inactivity
    useInactivityLogout(30);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-8">
            <div className="max-w-6xl w-full">
                {/* Header */}
                <div className="text-center mb-16">
                    {/* Logout Button */}
                    <div className="flex justify-end mb-8">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium text-sm transition-all border border-slate-700"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                    
                    <h1 className="text-6xl font-black italic uppercase tracking-tight text-white mb-4 drop-shadow-2xl">
                        HVAC Control <span className="text-indigo-400">System</span>
                    </h1>
                    <p className="text-slate-400 text-lg font-mono tracking-wide">
                        Hardware Controller Management Platform
                    </p>
                    <div className="mt-4 text-[10px] text-slate-600 font-mono">
                        Version 12.10 | Deployment: [ABC] Controller | Engineer Access
                    </div>
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Config Tool Card */}
                    <div 
                        onClick={() => navigate('/config-tool', { state: { authenticated: true } })}
                        className="group relative bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 hover:border-indigo-500 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20"
                    >
                        <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 text-[9px] font-black px-3 py-1 rounded-full border border-emerald-500/30">
                            PASSWORD PROTECTED
                        </div>
                        
                        <div className="mb-6">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-black uppercase italic text-white mb-2 tracking-tight">
                                Configuration Tool
                            </h2>
                            <p className="text-slate-400 text-sm font-medium">
                                Setup & Admin Interface
                            </p>
                        </div>

                        <div className="space-y-2 mb-6">
                            <div className="flex items-start gap-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5"></div>
                                <span className="text-slate-300">Equipment schema mapping</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5"></div>
                                <span className="text-slate-300">Floor plan configuration</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5"></div>
                                <span className="text-slate-300">Load/Edit/Save workflows</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5"></div>
                                <span className="text-slate-300">SHA-256 password security</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                            <span className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">
                                Admin Access Required
                            </span>
                            <div className="text-emerald-400 group-hover:translate-x-2 transition-transform">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Master UI Card */}
                    <div 
                        onClick={() => navigate('/dashboard')}
                        className="group relative bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 hover:border-indigo-500 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20"
                    >
                        <div className="absolute top-4 right-4 bg-indigo-500/20 text-indigo-400 text-[9px] font-black px-3 py-1 rounded-full border border-indigo-500/30 animate-pulse">
                            REAL-TIME
                        </div>
                        
                        <div className="mb-6">
                            <div className="w-16 h-16 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-black uppercase italic text-white mb-2 tracking-tight">
                                Master UI Dashboard
                            </h2>
                            <p className="text-slate-400 text-sm font-medium">
                                Operational Control Interface
                            </p>
                        </div>

                        <div className="space-y-2 mb-6">
                            <div className="flex items-start gap-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5"></div>
                                <span className="text-slate-300">Psychrometric chart visualization</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5"></div>
                                <span className="text-slate-300">Real-time AHU/VAV telemetry</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5"></div>
                                <span className="text-slate-300">Energy diagnostics & vectors</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5"></div>
                                <span className="text-slate-300">Floor plan mapping</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                            <span className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">
                                Operator Interface
                            </span>
                            <div className="text-indigo-400 group-hover:translate-x-2 transition-transform">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center text-slate-600 text-xs font-mono">
                    <div className="mb-2">
                        🔒 Secure Local Deployment | 📡 3-Second Telemetry Polling
                    </div>
                    <div>
                        Data Path: [ABC]/data/ | Scripts: [ABC]/scripts/
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EngineerPortal;
