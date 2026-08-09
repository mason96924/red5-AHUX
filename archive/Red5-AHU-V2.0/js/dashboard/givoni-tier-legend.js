/* ------------------------------------------------------------------
 * dashboard/givoni-tier-legend.js — extracted from app.js in Phase L.26 (2026-06-24).
 *
 * Six-swatch legend matching getGivoniTier quadrants.  C-H (cool/humid)
 * must not share a teal/cyan hue with Comfort emerald — operators read
 * that as "safe green" on the floor plan.
 * Ctx props expected: showGivoni, theme
 * ------------------------------------------------------------------ */

function renderGivoniTierLegend(ctx) {
    const { showGivoni, theme } = ctx;
    if (!(showGivoni)) return null;

    const swatches = [
        { tier: 'A',   fill: GIVONI_COLORS.TIER_A_DOT,  label: 'Comfort',    sub: 'hold' },
        { tier: 'B',   fill: GIVONI_COLORS.TIER_B_DOT,  label: 'Soft trim',  sub: 'hum/dehum' },
        { tier: 'C+H', fill: GIVONI_COLORS.HOT_HUMID,   label: 'Hot/humid',  sub: 'cool' },
        { tier: 'C+D', fill: GIVONI_COLORS.HOT_DRY,     label: 'Hot/dry',    sub: 'cool' },
        { tier: 'C-H', fill: GIVONI_COLORS.COOL_WET,    label: 'Cool/humid', sub: 'heat' },
        { tier: 'C-D', fill: GIVONI_COLORS.COLD_DRY,    label: 'Cool/dry',   sub: 'heat' },
    ];
    return (
        <div className={`mt-2.5 grid grid-cols-3 gap-1 px-0.5`} data-testid="givoni-tier-legend">
            {swatches.map(s => (
                <div key={s.tier}
                     title={`Tier ${s.tier} — ${s.label} (${s.sub})`}
                     data-testid={`givoni-tier-legend-${s.tier}`}
                     className={`flex flex-col items-center gap-0.5 py-1.5 rounded-md border ${theme==='dark'?'bg-slate-950/60 border-slate-800':'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ background: s.fill, boxShadow: '0 0 4px ' + s.fill + '99' }} />
                        <span className="font-black text-[8px] font-mono tracking-wider" style={{ color: s.fill }}>{s.tier}</span>
                    </div>
                    <span className={`text-[7px] font-mono font-bold uppercase tracking-wider ${theme==='dark'?'text-slate-400':'text-slate-600'}`}>{s.label}</span>
                </div>
            ))}
        </div>
    );
}
