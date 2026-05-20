/**
 * AdminLogin.jsx — emergency password sign-in for the bootstrap admin.
 *
 * Reachable only at /admin-login (not linked from the landing page) so the
 * existence of the form is incidental, not advertised.  On success it
 * receives the SAME httpOnly session_token cookie the Google OAuth path
 * issues, then forwards to /dashboard.html.
 *
 * REMINDER: this is a fallback path that runs alongside the Emergent
 * Google OAuth flow -- both paths must share the same cookie + session
 * collection; never branch the rest of the app on which one was used.
 */
import { useState } from "react";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || window.location.origin;
            const r = await fetch(`${backendUrl}/api/auth/password-login`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim(), password }),
            });
            if (r.status === 429) {
                setError("Too many failed attempts. Try again in 15 minutes.");
                setLoading(false);
                return;
            }
            if (!r.ok) {
                let detail = "Invalid credentials";
                try {
                    const body = await r.json();
                    if (body && typeof body.detail === "string") detail = body.detail;
                } catch (e) { /* keep default */ }
                setError(detail);
                setLoading(false);
                return;
            }
            // Success — server set the session_token cookie.  Send the user
            // to the V1.9 SPA, mirroring the OAuth callback's target.
            window.location.replace("/dashboard.html");
        } catch (err) {
            setError("Sign-in failed. Check your network and try again.");
            setLoading(false);
        }
    };

    return (
        <div
            data-testid="admin-login-root"
            className="min-h-screen w-screen bg-slate-950 text-slate-100 grid place-items-center font-mono px-6"
        >
            <form
                onSubmit={handleSubmit}
                data-testid="admin-login-form"
                className="w-full max-w-sm border border-slate-800 rounded-lg bg-slate-900/50 backdrop-blur p-7 space-y-5 shadow-xl"
            >
                <div>
                    <div className="text-amber-400 text-[10px] font-black uppercase tracking-[0.25em] mb-1">
                        Admin Access
                    </div>
                    <h1 className="text-xl font-black tracking-tight">
                        Emergency password sign-in
                    </h1>
                    <p className="text-slate-400 text-xs leading-relaxed mt-2">
                        Fallback path for the bootstrap admin when Google OAuth is unavailable on your device.
                    </p>
                </div>

                <div className="space-y-3">
                    <label className="block">
                        <span className="text-[10px] uppercase tracking-widest text-slate-400">Email</span>
                        <input
                            data-testid="admin-login-email"
                            type="email"
                            autoComplete="username"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-sm font-mono focus:border-amber-400 focus:outline-none"
                            placeholder="you@example.com"
                        />
                    </label>
                    <label className="block">
                        <span className="text-[10px] uppercase tracking-widest text-slate-400">Password</span>
                        <input
                            data-testid="admin-login-password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-sm font-mono focus:border-amber-400 focus:outline-none"
                        />
                    </label>
                </div>

                {error ? (
                    <div
                        data-testid="admin-login-error"
                        className="text-rose-400 text-xs font-bold border border-rose-900 bg-rose-950/30 rounded px-3 py-2"
                    >
                        {error}
                    </div>
                ) : null}

                <button
                    type="submit"
                    data-testid="admin-login-submit"
                    disabled={loading}
                    className="w-full px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black uppercase tracking-wider text-xs rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? "Signing in..." : "Sign in"}
                </button>

                <div className="text-[10px] text-slate-500 text-center pt-2 border-t border-slate-800">
                    <a
                        href="/"
                        data-testid="admin-login-back"
                        className="hover:text-amber-400 transition-colors"
                    >
                        Back to home
                    </a>
                </div>
            </form>
        </div>
    );
};

export default AdminLogin;
