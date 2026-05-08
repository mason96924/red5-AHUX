/**
 * Main Landing Page - Password Protected Entry Point
 * 
 * Flow:
 * - No password / Skip → Master UI Dashboard (public operational view)
 * - With password → Engineer Portal (Config Tool + Master UI options)
 * 
 * Uses the password created in Config Tool (stored in localStorage)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isFirstTime, setIsFirstTime] = useState(false);

    // Check if password exists on mount
    React.useEffect(() => {
        const hasPassword = localStorage.getItem('hashedPassword');
        setIsFirstTime(!hasPassword);
        
        // Clear password fields for security (after logout or page load)
        setPassword('');
        setConfirmPassword('');
        setError('');
    }, []);

    const handleCreatePassword = async (e) => {
        e.preventDefault();
        
        if (!password.trim()) {
            setError('Password cannot be empty');
            setTimeout(() => setError(''), 3000);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setTimeout(() => setError(''), 3000);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setTimeout(() => setError(''), 3000);
            return;
        }

        // Hash and store the new password
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        
        try {
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            
            localStorage.setItem('hashedPassword', hashHex);
            
            // Password created, proceed to Engineer Portal
            navigate('/engineer-portal');
        } catch (err) {
            setError('Failed to create password: ' + err.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        
        if (!password.trim()) {
            // No password entered - go to public dashboard
            navigate('/dashboard');
            return;
        }

        // Get the user-created password hash from Config Tool (localStorage)
        const storedHash = localStorage.getItem('hashedPassword');
        
        // Master key hash for emergency access (password: b%9P$MdeQP][)
        const MASTER_KEY_HASH = '466d4a3ceb4bdba2cfab78a16650d92d4718dc0f280ab3b4e3d79c9a5b75df0c';

        // Hash the entered password using same method as Config Tool
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        
        crypto.subtle.digest('SHA-256', data).then(hashBuffer => {
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const inputHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            
            // Check against user password first, then master key
            if ((storedHash && inputHash === storedHash) || inputHash === MASTER_KEY_HASH) {
                // Correct password or master key - go to engineer portal
                navigate('/engineer-portal');
            } else {
                setError('Incorrect password');
                setTimeout(() => setError(''), 3000);
            }
        });
    };

    const skipToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-8">
            <div className="max-w-lg w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-black italic uppercase tracking-tight leading-none mb-3">
                        <span className="text-red-500">Red5</span>{' '}
                        <span className="text-white">Platform Studio</span>
                    </h1>
                    <p className="text-slate-500 text-sm font-medium tracking-wide">
                        by Delta Controls
                    </p>
                </div>

                {/* Password Card */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 shadow-2xl">
                    {isFirstTime ? (
                        // First-time setup: Create Password
                        <>
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-white mb-2">
                                    🔐 Create Your Password
                                </h2>
                                <p className="text-slate-400 text-sm">
                                    Set up your engineer password to secure access to configuration tools
                                </p>
                            </div>

                            <form onSubmit={handleCreatePassword} className="space-y-4">
                                {/* New Password */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setError('');
                                        }}
                                        placeholder="Create a password..."
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-indigo-500 transition-colors"
                                        autoFocus
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            setError('');
                                        }}
                                        placeholder="Confirm password..."
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-indigo-500 transition-colors"
                                    />
                                </div>

                                {error && (
                                    <p className="text-red-400 text-xs mt-2 animate-pulse">
                                        ⚠️ {error}
                                    </p>
                                )}

                                {/* Buttons */}
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={skipToDashboard}
                                        className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold text-sm uppercase tracking-wide transition-all"
                                    >
                                        Skip
                                    </button>
                                    <button
                                        type="submit"
                                        className="py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-sm uppercase tracking-wide transition-all shadow-lg shadow-indigo-500/20"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>

                            {/* Info */}
                            <div className="mt-6 pt-6 border-t border-slate-800">
                                <div className="flex items-start gap-2 text-xs text-slate-500">
                                    <svg className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="font-medium text-slate-400 mb-1">First-time Setup:</p>
                                        <p>Create a password to access engineer tools, or skip for operational dashboard only.</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        // Regular login
                        <>
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-white mb-2">
                                    Welcome
                                </h2>
                                <p className="text-slate-400 text-sm">
                                    Enter password for engineer access, or skip to operational dashboard
                                </p>
                            </div>

                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                {/* Password Input */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Password (optional)
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setError('');
                                        }}
                                        placeholder="Enter engineer password..."
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-indigo-500 transition-colors"
                                        autoFocus
                                    />
                                    {error && (
                                        <p className="text-red-400 text-xs mt-2 animate-pulse">
                                            ⚠️ {error}
                                        </p>
                                    )}
                                </div>

                                {/* Buttons */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={skipToDashboard}
                                        className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold text-sm uppercase tracking-wide transition-all"
                                    >
                                        Skip
                                    </button>
                                    <button
                                        type="submit"
                                        className="py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-sm uppercase tracking-wide transition-all shadow-lg shadow-indigo-500/20"
                                    >
                                        Enter
                                    </button>
                                </div>
                            </form>

                            {/* Info */}
                            <div className="mt-6 pt-6 border-t border-slate-800">
                                <div className="flex items-start gap-2 text-xs text-slate-500">
                                    <svg className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="font-medium text-slate-400 mb-1">Access Levels:</p>
                                        <p><span className="text-emerald-400">With Password:</span> Full engineer access (Config Tool + Master UI)</p>
                                        <p className="mt-1"><span className="text-indigo-400">Skip:</span> Operational dashboard only</p>
                                        <p className="mt-2 text-amber-400/60">
                                            🔑 Emergency master key available for recovery
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-slate-600 text-xs font-mono">
                    <div className="mb-1">
                        🔒 Secure Hardware Controller Platform
                    </div>
                    <div>
                        Version 12.10 | [ABC] Deployment
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
