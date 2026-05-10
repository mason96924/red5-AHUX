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

const MetricBar = ({ val, max = 30, color = "#6366f1", height = "h-8", width = "w-1.5", showValue = false, theme = 'dark' }) => {
    const safeVal = safe(val);
    const pct = Math.max(showValue ? 28 : 5, Math.min(100, (Math.abs(safeVal) / max) * 100));
    return (
        <div className={`${width} ${height} ${theme==='dark'?'bg-slate-800/30':'bg-slate-200/60'} relative overflow-hidden flex flex-col justify-end shadow-inner rounded-full`}>
            <div className={"w-full transition-all duration-700 ease-out flex justify-center pt-1 " + (theme==='dark'?'shadow-lg shadow-black':'')} style={{ height: pct + "%", backgroundColor: color }}>
                {showValue && <span className="text-[9px] font-black text-white/90 drop-shadow-md tracking-tighter">{Math.abs(safeVal).toFixed(1)}</span>}
            </div>
        </div>
    );
};

const THEMES = {
    dark: { bg: 'bg-[#020617]', chartBg: '#020617', sidebar: 'bg-slate-900', border: 'border-slate-800', text: 'text-slate-100', textMuted: 'text-slate-400', svgText: '#94a3b8', svgAxis: '#475569', gridMajor: '#475569', gridMinor: '#334155', heading: 'text-white/90', card: 'bg-slate-900/95', cardBorder: 'border-indigo-500/40', vavHub: 'bg-slate-900/90', itemSelected: 'bg-slate-800 border-indigo-500 shadow-xl', btnToggle: 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700', btnLockedOff: 'bg-indigo-900/40 border-indigo-500/30 text-indigo-400', dataBlock: 'bg-slate-900/50 border-slate-700/50 text-slate-200', rangeTrack: 'bg-slate-800' },
    light: { bg: 'bg-[#f8fafc]', chartBg: '#ffffff', sidebar: 'bg-white', border: 'border-slate-200', text: 'text-slate-900', textMuted: 'text-slate-500', svgText: '#475569', svgAxis: '#1e293b', gridMajor: '#cbd5e1', gridMinor: '#e2e8f0', heading: 'text-slate-900', card: 'bg-white/95', cardBorder: 'border-slate-300', vavHub: 'bg-white/95', itemSelected: 'bg-indigo-50 border-indigo-500 shadow-md', btnToggle: 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200', btnLockedOff: 'bg-indigo-50 border-indigo-200 text-indigo-600', dataBlock: 'bg-slate-50 border-slate-200 text-slate-700', rangeTrack: 'bg-slate-300' }
};
