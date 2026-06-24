/* ------------------------------------------------------------------
 * dashboard/sweet-spot-slider.js — extracted from app.js in Phase L.26 (2026-06-24).
 *
 * Originally an inline IIFE `{showGivoni && showSweetSpot && (() => { ... })()}` inside
 * App's render.  Body kept byte-identical modulo one block-of-dedent.
 * Ctx props expected: showGivoni, showSweetSpot, sweetSpotRange, setSweetSpotRange, theme
 * ------------------------------------------------------------------ */

function renderSweetSpotSlider(ctx) {
    const {
        showGivoni, showSweetSpot, sweetSpotRange, setSweetSpotRange, theme,
        bandClampApplied, setBandClampApplied,
        bandClampBusy, setBandClampBusy,
        setBandClampModal,
        clampSpark,
        fetchJSON, toast,
    } = ctx;
    if (!(showGivoni && showSweetSpot)) return null;

// Dual-handle RH range slider matching the
// dry-bulb axis-settings widget below.  Track
// is bounded [30, 70]% so the strip can never
// configure outside the operator's expected
// comfort regime; min gap of 2% prevents the
// handles from collapsing.
const ABS_LO = 30, ABS_HI = 70, GAP = 2;
const pct = (v) => ((v - ABS_LO) / (ABS_HI - ABS_LO)) * 100;
const pickHandle = (clientX, trackEl) => {
    const r = trackEl.getBoundingClientRect();
    const v = ABS_LO + ((clientX - r.left) / r.width) * (ABS_HI - ABS_LO);
    return Math.abs(v - sweetSpotRange.lo) <= Math.abs(v - sweetSpotRange.hi) ? 'lo' : 'hi';
};
const startDrag = (e, handle) => {
    e.preventDefault();
    const trackEl = e.currentTarget.closest('[data-testid="sweet-spot-range"]');
    const r = trackEl.getBoundingClientRect();
    const which = handle || pickHandle(e.clientX, trackEl);
    // Popout fix (2026-06-08): when the sidebar is rendered into a
    // popped-out window, the slider DOM lives there but `window` in
    // this closure is the PARENT window.  Attach drag listeners to
    // the window that actually owns the slider so mousemove/mouseup
    // events in the popout fire correctly.
    const ownerWin = (e.view)
        || (e.target && e.target.ownerDocument && e.target.ownerDocument.defaultView)
        || window;
    const onMove = (mv) => {
        const raw = ABS_LO + ((mv.clientX - r.left) / r.width) * (ABS_HI - ABS_LO);
        const v = Math.round(Math.max(ABS_LO, Math.min(ABS_HI, raw)));
        setSweetSpotRange(prev => {
            if (which === 'lo') return { lo: Math.min(v, prev.hi - GAP), hi: prev.hi };
            return { lo: prev.lo, hi: Math.max(v, prev.lo + GAP) };
        });
    };
    const onUp = () => {
        ownerWin.removeEventListener('mousemove', onMove);
        ownerWin.removeEventListener('mouseup', onUp);
    };
    ownerWin.addEventListener('mousemove', onMove);
    ownerWin.addEventListener('mouseup', onUp);
};
const trackBg   = theme === 'dark' ? 'bg-slate-700' : 'bg-slate-300';
const handleCls = `absolute -top-1 w-4 h-4 -ml-2 rounded-full ring-2 ring-white shadow-md cursor-grab active:cursor-grabbing ${theme==='dark'?'bg-emerald-400':'bg-emerald-500'}`;
const labelCls  = `absolute -top-7 -translate-x-1/2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold whitespace-nowrap pointer-events-none ${theme==='dark'?'bg-slate-900 text-emerald-300 border border-emerald-500/40':'bg-white text-emerald-700 border border-emerald-300'}`;
return (
    <div data-testid="sweet-spot-range" className="mt-3 px-1 pt-6 pb-1 relative">
        <div className={`relative h-2 ${trackBg} rounded-full`}
             onMouseDown={(e) => startDrag(e)}>
            <div className="absolute h-2 bg-emerald-500 rounded-full"
                 style={{left:`${pct(sweetSpotRange.lo)}%`, width:`${pct(sweetSpotRange.hi)-pct(sweetSpotRange.lo)}%`}} />
            <div className={handleCls} style={{left:`${pct(sweetSpotRange.lo)}%`}}
                 data-testid="sweet-spot-lo-handle"
                 onMouseDown={(e) => { e.stopPropagation(); startDrag(e, 'lo'); }}>
                <span className={labelCls} style={{left:'50%'}}>{sweetSpotRange.lo}%</span>
            </div>
            <div className={handleCls} style={{left:`${pct(sweetSpotRange.hi)}%`}}
                 data-testid="sweet-spot-hi-handle"
                 onMouseDown={(e) => { e.stopPropagation(); startDrag(e, 'hi'); }}>
                <span className={labelCls} style={{left:'50%'}}>{sweetSpotRange.hi}%</span>
            </div>
        </div>
        <div className="flex justify-between text-[8px] font-mono mt-1.5 text-slate-500">
            <span>30% RH</span>
            <button
                data-testid="sweet-spot-reset"
                onClick={() => setSweetSpotRange({ lo: 40, hi: 60 })}
                title="Reset to ASHRAE 55 default (40-60%)"
                className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-black tracking-wider transition-all ${theme==='dark'?'text-slate-500 hover:text-emerald-300 hover:bg-slate-800':'text-slate-500 hover:text-emerald-700 hover:bg-slate-100'}`}>Reset</button>
            <span>70% RH</span>
        </div>
        {/* Apply-to-Controller row.  The slider above is hypothetical
            until pressed; the small chip on the left shows what is
            currently enforced on the BACnet side. */}
        {(() => {
            const applied = bandClampApplied;
            const dirty = applied
                ? (applied.lo !== sweetSpotRange.lo || applied.hi !== sweetSpotRange.hi)
                : true;
            const appliedLabel = applied
                ? `Live: ${applied.lo}-${applied.hi}% RH`
                : 'Live: factory bands';
            const onApply = async () => {
                try {
                    const j = await fetchJSON('/api/band-overrides/preview?lo=' + sweetSpotRange.lo + '&hi=' + sweetSpotRange.hi);
                    if (j.status === 'ok') {
                        setBandClampModal({ lo: sweetSpotRange.lo, hi: sweetSpotRange.hi, preview: j.preview });
                    } else {
                        toast('Preview failed: ' + (j.message || 'unknown'));
                    }
                } catch (e) {
                    toast(e.message);
                }
            };
            const onReset = async () => {
                if (!applied) return;
                if (!window.confirm('Reset to factory bands?  This removes the SA-RH clamp from the controller.')) return;
                setBandClampBusy(true);
                try {
                    const j = await fetchJSON('/api/band-overrides/sa-rh-clamp', { method: 'DELETE' });
                    if (j.status === 'ok') {
                        setBandClampApplied(null);
                    } else {
                        toast('Reset failed: ' + (j.message || 'unknown'));
                    }
                } catch (e) {
                    toast(e.message);
                } finally {
                    setBandClampBusy(false);
                }
            };
            return (
                <div className="mt-2 flex items-center gap-2" data-testid="band-clamp-row">
                    <span className={`text-[8px] font-mono font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${applied ? (theme==='dark'?'bg-emerald-900/40 text-emerald-300 border border-emerald-700/40':'bg-emerald-50 text-emerald-700 border border-emerald-200') : (theme==='dark'?'bg-slate-800 text-slate-400 border border-slate-700':'bg-slate-100 text-slate-500 border border-slate-300')}`}
                          data-testid="band-clamp-live">{appliedLabel}</span>
                    {/* Clamp-effectiveness sparkline -- "is the equipment honouring the target?"
                        Inline 64x22 SVG plotted from clampSpark (mean SA-RH across all AHUs over
                        the last ~15 min, sampled every 30s).  Pure client-side, no new BACnet
                        writes.  Three color states: emerald inside band, rose drifting outside,
                        slate baseline when no clamp is applied. */}
                    {clampSpark.length >= 2 && (() => {
                        const W = 64, H = 22, PADX = 2;
                        const lastN = clampSpark.slice(-12);
                        const last = lastN[lastN.length - 1];
                        const meanRh = last.meanRh;
                        // Y-domain: prefer the clamp window with a 5-pt cushion,
                        // else fall back to the actual sample min/max with padding.
                        let yMin, yMax;
                        if (applied) {
                            yMin = Math.min(applied.lo - 5, Math.min(...lastN.map(s => s.meanRh)) - 2);
                            yMax = Math.max(applied.hi + 5, Math.max(...lastN.map(s => s.meanRh)) + 2);
                        } else {
                            const vs = lastN.map(s => s.meanRh);
                            yMin = Math.min(...vs) - 3;
                            yMax = Math.max(...vs) + 3;
                        }
                        if (yMax - yMin < 10) { const c = (yMin + yMax) / 2; yMin = c - 5; yMax = c + 5; }
                        const yOf = (rh) => H - ((rh - yMin) / (yMax - yMin)) * H;
                        const xOf = (i) => PADX + (i * (W - 2 * PADX)) / Math.max(1, lastN.length - 1);
                        // Honored = mean inside band at each sample (only meaningful when clamp applied)
                        const honored = applied
                            ? lastN.filter(s => s.meanRh >= applied.lo && s.meanRh <= applied.hi).length
                            : null;
                        const insideBand = applied && meanRh >= applied.lo && meanRh <= applied.hi;
                        const driftAbove = applied && meanRh > applied.hi;
                        const stroke   = !applied ? '#94a3b8' : (insideBand ? '#34d399' : '#fb7185');
                        const dotFill  = stroke;
                        const dotEdge  = !applied ? '#0f172a' : (insideBand ? '#022c22' : '#7f1d1d');
                        const borderC  = !applied ? 'rgba(100,116,139,0.35)'
                                            : (insideBand ? 'rgba(16,185,129,0.3)' : 'rgba(251,113,133,0.5)');
                        const textCls  = !applied ? 'text-slate-400' : (insideBand ? 'text-emerald-300' : 'text-rose-300');
                        const points   = lastN.map((s, i) => `${xOf(i).toFixed(1)},${yOf(s.meanRh).toFixed(1)}`).join(' ');
                        // Per-AHU tooltip line
                        const perAhuStr = (last.perAhu || []).map(p => { const rh = Number(p.rh); return `${p.id}:${Number.isFinite(rh) ? rh.toFixed(0) : '--'}%`; }).join(', ');
                        const tipParts = [
                            `Mean SA-RH: ${meanRh.toFixed(1)}%`,
                            applied ? `Window: ${applied.lo}-${applied.hi}% RH` : 'No clamp applied (factory bands)',
                            applied ? `Honored: ${honored}/${lastN.length} samples` : null,
                            `Sources: ${perAhuStr}`,
                            `Window: ~${Math.round((last.ts - lastN[0].ts) / 60000)} min`,
                        ].filter(Boolean);
                        return (
                            <div className="flex items-center gap-1.5"
                                 data-testid="clamp-spark"
                                 title={tipParts.join('\n')}>
                                <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ background: 'rgba(15,23,42,0.6)', border: `1px solid ${borderC}`, borderRadius: 3 }}>
                                    {applied && (
                                        <React.Fragment>
                                            <rect x="0" y={yOf(applied.hi)} width={W} height={Math.max(0, yOf(applied.lo) - yOf(applied.hi))} fill="rgba(16,185,129,0.18)"/>
                                            <line x1="0" y1={yOf(applied.hi)} x2={W} y2={yOf(applied.hi)} stroke="#10b981" strokeWidth="0.5" strokeDasharray="2,1.5" opacity="0.7"/>
                                            <line x1="0" y1={yOf(applied.lo)} x2={W} y2={yOf(applied.lo)} stroke="#10b981" strokeWidth="0.5" strokeDasharray="2,1.5" opacity="0.7"/>
                                        </React.Fragment>
                                    )}
                                    <polyline fill="none" stroke={stroke} strokeWidth="1.4" points={points}/>
                                    <circle cx={xOf(lastN.length - 1)} cy={yOf(meanRh)} r="1.7" fill={dotFill} stroke={dotEdge} strokeWidth="0.5"/>
                                    {applied && !insideBand && (
                                        <text x={W - 9} y={H - 1} fontSize="9" fontWeight="900" fill="#fb7185" fontFamily="ui-monospace,Menlo,monospace">!</text>
                                    )}
                                </svg>
                                <span className={`text-[9px] font-mono font-black ${textCls}`} data-testid="clamp-spark-mean">
                                    {meanRh.toFixed(1)}%{driftAbove ? '\u2191' : ''}
                                </span>
                            </div>
                        );
                    })()}
                    <button
                        data-testid="band-clamp-apply"
                        onClick={onApply}
                        disabled={!dirty || bandClampBusy}
                        title={dirty ? 'Apply slider window to controller (clamps every band SA-RH target)' : 'Slider matches controller - nothing to apply'}
                        className={`flex-1 py-1.5 rounded text-[9px] font-black uppercase tracking-wider border transition-all ${
                            !dirty
                                ? (theme==='dark' ? 'bg-slate-800/60 border-slate-700 text-slate-600 cursor-not-allowed' : 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed')
                                : (theme==='dark' ? 'bg-amber-500 border-amber-300 text-slate-900 hover:bg-amber-400 shadow-md shadow-amber-600/30' : 'bg-amber-400 border-amber-500 text-slate-900 hover:bg-amber-500 shadow-md')
                        }`}>
                        {bandClampBusy ? '...' : (dirty ? 'Apply to Controller' : 'Applied')}
                    </button>
                    {applied && (
                        <button
                            data-testid="band-clamp-reset"
                            onClick={onReset}
                            disabled={bandClampBusy}
                            title="Remove the SA-RH clamp from the controller (revert to factory bands)"
                            className={`px-2 py-1.5 rounded text-[9px] font-black uppercase tracking-wider border transition-all ${theme==='dark' ? 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-rose-900/30 hover:border-rose-600 hover:text-rose-300' : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-rose-50 hover:text-rose-700'}`}>Reset</button>
                    )}
                </div>
            );
        })()}
    </div>
);
}
