/* ------------------------------------------------------------------
 * dashboard/t-clip-slider.js — extracted from app.js in Phase L.26 (2026-06-24).
 *
 * Originally an inline IIFE `{activeView === 'weather3d' && (() => { ... })()}` inside
 * App's render.  Body kept byte-identical modulo one block-of-dedent.
 * Ctx props expected: tClipRange, setTClipRange, theme, activeView
 * ------------------------------------------------------------------ */

function renderTClipSlider(ctx) {
    const { tClipRange, setTClipRange, theme, activeView } = ctx;
    if (!(activeView === 'weather3d')) return null;

const T_ABS_LO = 15, T_ABS_HI = 32, T_GAP = 2;
const tPct = (v) => ((v - T_ABS_LO) / (T_ABS_HI - T_ABS_LO)) * 100;
const tPick = (clientX, trackEl) => {
    const r = trackEl.getBoundingClientRect();
    const v = T_ABS_LO + ((clientX - r.left) / r.width) * (T_ABS_HI - T_ABS_LO);
    return Math.abs(v - tClipRange.lo) <= Math.abs(v - tClipRange.hi) ? 'lo' : 'hi';
};
const tStartDrag = (e, handle) => {
    e.preventDefault();
    const trackEl = e.currentTarget.closest('[data-testid="t-clip-range"]');
    const r = trackEl.getBoundingClientRect();
    const which = handle || tPick(e.clientX, trackEl);
    const ownerWin = (e.view)
        || (e.target && e.target.ownerDocument && e.target.ownerDocument.defaultView)
        || window;
    const onMove = (mv) => {
        const raw = T_ABS_LO + ((mv.clientX - r.left) / r.width) * (T_ABS_HI - T_ABS_LO);
        const v = Math.round(Math.max(T_ABS_LO, Math.min(T_ABS_HI, raw)));
        setTClipRange(prev => {
            if (which === 'lo') return { lo: Math.min(v, prev.hi - T_GAP), hi: prev.hi };
            return { lo: prev.lo, hi: Math.max(v, prev.lo + T_GAP) };
        });
    };
    const onUp = () => {
        ownerWin.removeEventListener('mousemove', onMove);
        ownerWin.removeEventListener('mouseup', onUp);
    };
    ownerWin.addEventListener('mousemove', onMove);
    ownerWin.addEventListener('mouseup', onUp);
};
const tTrackBg   = theme === 'dark' ? 'bg-slate-700' : 'bg-slate-300';
// Handle is now a 28-px pill that DISPLAYS its own temperature value
// inside (was 16 px with a floating label pill above it).  Two boxes
// dropped, single number now legible at a glance.  Min gap bumped
// 1->2 °C so the two enlarged thumbs never visually overlap.
const tHandleCls = `absolute -top-3 w-7 h-7 -ml-3.5 rounded-full ring-2 ring-white shadow-md cursor-grab active:cursor-grabbing flex items-center justify-center font-mono font-extrabold tabular-nums select-none ${theme==='dark'?'bg-pink-400 text-slate-900':'bg-pink-500 text-white'}`;
return (
    <div className="mt-4">
        <div className="flex items-center justify-between mb-1 px-1">
            <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${theme==='dark'?'text-pink-400':'text-pink-600'}`}
                  title="Dry-bulb T-clip range for the 3D WX RH-band slab. The magenta volume in the 3D scene is bounded to this T window.&#10;Default 21-27 °C = ASHRAE 55-2023 Cat A year-round overlap. Open the 'ASHRAE 55 Reference' doc for the standard's reasoning + per-space-type override table.">3D WX · T·CLIP</span>
            <span className={`text-[8px] font-mono ${theme==='dark'?'text-pink-300':'text-pink-700'}`}>{tClipRange.lo}–{tClipRange.hi}°C</span>
        </div>
        <div data-testid="t-clip-range" className="px-1 pt-5 pb-1 relative">
            <div className={`relative h-2 ${tTrackBg} rounded-full`}
                 onMouseDown={(e) => tStartDrag(e)}>
                <div className="absolute h-2 bg-pink-500 rounded-full"
                     style={{left:`${tPct(tClipRange.lo)}%`, width:`${tPct(tClipRange.hi)-tPct(tClipRange.lo)}%`}} />
                <div className={tHandleCls} style={{left:`${tPct(tClipRange.lo)}%`, fontSize: '10px', lineHeight: 1}}
                     data-testid="t-clip-lo-handle"
                     onMouseDown={(e) => { e.stopPropagation(); tStartDrag(e, 'lo'); }}>
                    {tClipRange.lo}
                </div>
                <div className={tHandleCls} style={{left:`${tPct(tClipRange.hi)}%`, fontSize: '10px', lineHeight: 1}}
                     data-testid="t-clip-hi-handle"
                     onMouseDown={(e) => { e.stopPropagation(); tStartDrag(e, 'hi'); }}>
                    {tClipRange.hi}
                </div>
            </div>
            <div className="flex justify-between text-[8px] font-mono mt-1.5 text-slate-500">
                <span>15°C</span>
                <button
                    data-testid="t-clip-reset"
                    onClick={() => setTClipRange({ lo: 21, hi: 27 })}
                    title="Reset to ASHRAE 55 Cat A default (21–27 °C)"
                    className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-black tracking-wider transition-all ${theme==='dark'?'text-slate-500 hover:text-pink-300 hover:bg-slate-800':'text-slate-500 hover:text-pink-700 hover:bg-slate-100'}`}>Reset</button>
                <span>32°C</span>
            </div>
        </div>
    </div>
);
}
