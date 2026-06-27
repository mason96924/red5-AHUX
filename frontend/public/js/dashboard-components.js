// AHU Diagnostic HUB — Dashboard UI Components
// Reusable React components and theme definitions for the dashboard.
// Depends on: safe() from psychrometric.js

class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null, errorInfo: null }; }
    static getDerivedStateFromError(error) { return { hasError: true, error }; }
    componentDidCatch(error, errorInfo) { console.error("Caught Crash:", error, errorInfo); this.setState({errorInfo}); }
    render() {
        if (this.state.hasError) {
            return (
                <div className="flex h-screen items-center justify-center bg-slate-900 text-red-500 p-10 font-mono text-sm">
                    <div>
                        <h1 className="text-2xl font-bold mb-4">{(window.t && window.t('react_crash_prevented')) || 'React Rendering Crash Prevented'}</h1>
                        <p className="mb-4">{(window.t && window.t('react_crash_msg')) || 'System caught the following error instead of a black screen:'}</p>
                        <p className="font-bold text-white">{this.state.error ? this.state.error.toString() : ''}</p>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

const LockIcon = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;

const MetricBar = ({ val, max = 30, color = "#6366f1", height = "h-8", width = "w-1.5", showValue = false, delta = null, theme = 'dark' }) => {
    const safeVal = safe(val);
    /* Fill height now reflects |val|/max linearly with a tiny 2% floor
       so a value of "0.08" renders almost empty and "2.81" clearly
       taller — fixes the 2026-06-26 issue where all three AHUs'
       pills looked identical because of a 28% min-fill that hid the
       differences between sub-kJ/kg enthalpy deltas.  When showValue
       is on the numeric label is placed in an absolutely-positioned
       overlay so it stays visible at the top of the pill regardless
       of fill height.  Optional `delta` (number) renders a tiny
       trend arrow at the bottom of the pill — ▲/▼ in a DARKER SHADE
       of the pill's own fill colour (2026-06-27 fix: was emerald/rose
       which blended into the pink absorption pill and was invisible);
       near-zero deltas (|d| < 0.2) render as a dim "·" so we don't
       cry wolf for AHUs that are basically steady. */
    const pct = Math.max(2, Math.min(100, (Math.abs(safeVal) / max) * 100));
    const valText = Math.abs(safeVal).toFixed(safeVal < 10 ? 2 : 1);
    // Darken helper: multiply RGB by `factor` (clamped) so we get a
    // readable shade of the pill's own fill colour for the trend
    // arrow.  Works on #rrggbb hex only; non-hex inputs pass through.
    const _darken = (hex, factor) => {
        if (typeof hex !== 'string' || hex[0] !== '#' || hex.length !== 7) return hex;
        const r = Math.max(0, Math.min(255, Math.round(parseInt(hex.slice(1,3), 16) * factor)));
        const g = Math.max(0, Math.min(255, Math.round(parseInt(hex.slice(3,5), 16) * factor)));
        const b = Math.max(0, Math.min(255, Math.round(parseInt(hex.slice(5,7), 16) * factor)));
        return '#' + [r,g,b].map(n => n.toString(16).padStart(2,'0')).join('');
    };
    let deltaEl = null;
    if (delta !== null && delta !== undefined && Number.isFinite(delta)) {
        const flat = Math.abs(delta) < 0.2;
        if (!flat) {
            const up = delta > 0;
            const dTxt  = Math.abs(delta) < 10 ? delta.toFixed(1) : delta.toFixed(0);
            const text  = (up ? '+' : '') + dTxt;
            // Dark layer above the fill line, white layer below.  The
            // clip-path is applied to the FULL-pill overlay (not the
            // text span) so the percentages are relative to the pill's
            // coordinate space rather than the text's own bounding box.
            // dColorAbove is chosen for contrast against the empty
            // pill background (slate-100 in light, slate-800 in dark).
            const dColorAbove = theme==='dark' ? '#cbd5e1' : '#0f172a';
            const clipBelow = `inset(${100 - pct}% 0 0 0)`;
            const clipAbove = `inset(0 0 ${pct}% 0)`;
            deltaEl = (
                <>
                    <div className="absolute inset-0 flex items-end justify-center pb-0.5 pointer-events-none"
                         style={{ clipPath: clipAbove, WebkitClipPath: clipAbove }}
                         title={`Δ vs 24 h rolling avg: ${up?'+':''}${delta.toFixed(2)} kJ/kg`}>
                        <span className="text-[9px] font-bold font-mono tracking-tight tabular-nums leading-none"
                              style={{ color: dColorAbove }}>{text}</span>
                    </div>
                    <div className="absolute inset-0 flex items-end justify-center pb-0.5 pointer-events-none"
                         style={{ clipPath: clipBelow, WebkitClipPath: clipBelow }}
                         title={`Δ vs 24 h rolling avg: ${up?'+':''}${delta.toFixed(2)} kJ/kg`}>
                        <span className="text-[9px] font-bold font-mono tracking-tight tabular-nums leading-none"
                              style={{ color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.85)' }}>{text}</span>
                    </div>
                </>
            );
        }
    }
    const alarming = Math.abs(delta || 0) >= 3;
    return (
        <div className={`${width} ${height} ${theme==='dark'?'bg-slate-800/30':'bg-slate-200/60'} relative overflow-hidden flex flex-col justify-end shadow-inner rounded-full`}>
            <div className={"w-full transition-all duration-700 ease-out " + (theme==='dark'?'shadow-lg shadow-black':'')} style={{ height: pct + "%", backgroundColor: color }} />
            {alarming && (
                /* Peripheral-vision cue.  This empty overlay is rendered
                   ONLY when |delta| >= 3, with a key that flips between
                   "up" and "dn".  React mounts a fresh node whenever the
                   alarm boundary is crossed OR the direction flips, so
                   the 600 ms CSS keyframe (.red5-pill-pulse) plays once
                   on transition and stays silent during steady alarm. */
                <div key={(delta || 0) > 0 ? 'up' : 'dn'}
                     className="red5-pill-pulse absolute inset-0 rounded-full pointer-events-none"
                     data-testid="metric-pill-alarm-pulse"></div>
            )}
            {showValue && (() => {
                // Dual-layer rendering so the value text stays legible
                // whether the pill is mostly empty (text floats on the
                // background -- needs DARK colour) or mostly full
                // (text submerged in the coloured fill -- needs WHITE).
                // clip-path on the full-pill overlay so the percentage
                // refers to the pill's coordinate space, not the text
                // span's own bounding box.
                const clipAbove = `inset(0 0 ${pct}% 0)`;
                const clipBelow = `inset(${100 - pct}% 0 0 0)`;
                const colAbove  = theme==='dark' ? '#e2e8f0' : '#0f172a';
                return (
                    <>
                        <div className="absolute inset-0 flex justify-center pt-1 pointer-events-none"
                             style={{ clipPath: clipAbove, WebkitClipPath: clipAbove }}>
                            <span className="text-[8px] font-black tracking-tighter"
                                  style={{ color: colAbove }}>{valText}</span>
                        </div>
                        <div className="absolute inset-0 flex justify-center pt-1 pointer-events-none"
                             style={{ clipPath: clipBelow, WebkitClipPath: clipBelow }}>
                            <span className="text-[8px] font-black tracking-tighter"
                                  style={{ color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.85)' }}>{valText}</span>
                        </div>
                    </>
                );
            })()}
            {deltaEl}
        </div>
    );
};

const THEMES = {
    dark: { bg: 'bg-[#020617]', chartBg: '#020617', sidebar: 'bg-slate-900', border: 'border-slate-800', text: 'text-slate-100', textMuted: 'text-slate-400', svgText: '#94a3b8', svgAxis: '#475569', gridMajor: '#475569', gridMinor: '#334155', heading: 'text-white/90', card: 'bg-slate-900/95', cardBorder: 'border-indigo-500/40', vavHub: 'bg-slate-900/90', itemSelected: 'bg-slate-800 border-indigo-500 shadow-xl', btnToggle: 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700', btnLockedOff: 'bg-indigo-900/40 border-indigo-500/30 text-indigo-400', dataBlock: 'bg-slate-900/50 border-slate-700/50 text-slate-200', rangeTrack: 'bg-slate-800' },
    light: { bg: 'bg-[#f8fafc]', chartBg: '#ffffff', sidebar: 'bg-white', border: 'border-slate-200', text: 'text-slate-900', textMuted: 'text-slate-500', svgText: '#475569', svgAxis: '#1e293b', gridMajor: '#cbd5e1', gridMinor: '#e2e8f0', heading: 'text-slate-900', card: 'bg-white/95', cardBorder: 'border-slate-300', vavHub: 'bg-white/95', itemSelected: 'bg-indigo-50 border-indigo-500 shadow-md', btnToggle: 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200', btnLockedOff: 'bg-indigo-50 border-indigo-200 text-indigo-600', dataBlock: 'bg-slate-50 border-slate-200 text-slate-700', rangeTrack: 'bg-slate-300' }
};
