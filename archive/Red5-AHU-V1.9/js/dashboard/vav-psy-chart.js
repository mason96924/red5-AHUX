/* ------------------------------------------------------------------
 * dashboard/vav-psy-chart.js — abridged VAV zone-delivery psych chart.
 * ------------------------------------------------------------------
 * Shown beside the VAV equipment graphic in the VAV modal.
 * Same T–W geometry as the main chart (saturation, RH isopleths,
 * enthalpy, Givoni CZ, AHU RH-band sweet-spot), clipped to a
 * terminal window around SA → VST → Zone.
 *
 * Ctx: vav, saPoint, ahuId, sweetSpotRange, showSweetSpot, theme
 * Uses globals from psychrometric.js: getW, getH, getRH (if present),
 * buildComfortZonePoly, safe.
 * ------------------------------------------------------------------ */

function renderVavPsyChart(ctx) {
    const {
        vav, saPoint, ahuId,
        sweetSpotRange, showSweetSpot,
        theme,
    } = ctx;

    if (!vav || !saPoint) {
        return (
            <div className={`h-full flex items-center justify-center text-[10px] font-mono uppercase tracking-widest ${theme === 'dark' ? 'text-slate-500 bg-slate-950' : 'text-slate-400 bg-slate-100'}`}>
                No AHU SA point — cannot plot zone delivery
            </div>
        );
    }

    const getRh = (typeof getRH === 'function')
        ? getRH
        : (T, W) => {
            const ps = getPsat(T);
            const pv = (W * 101.325) / (0.621945 + W);
            return safe(Math.min(100, Math.max(0, 100 * pv / ps)));
        };

    const saT = Number(saPoint.t);
    const saW = (saPoint.w != null) ? Number(saPoint.w) : getW(saT, Number(saPoint.rh) || 50);
    const zoneT = Number(vav.t);
    const zoneW = (vav.w != null) ? Number(vav.w) : getW(zoneT, Number(vav.rh) || 50);
    const zoneRh = (vav.rh != null) ? Number(vav.rh) : getRh(zoneT, zoneW);

    const ap = vav.all_points || {};
    const vstRaw = ap.VST != null ? Number(ap.VST) : (ap.vst != null ? Number(ap.vst) : NaN);
    const hasVst = Number.isFinite(vstRaw);
    const vstT = hasVst ? vstRaw : saT;
    const vstW = saW; // const-w duct when discharge RH unknown

    const pts = [
        { label: 'SA', t: saT, w: saW, color: '#22d3ee' },
        ...(hasVst ? [{ label: 'VST', t: vstT, w: vstW, color: '#a78bfa' }] : []),
        { label: 'ZONE', t: zoneT, w: zoneW, color: '#34d399' },
    ];

    // Terminal window — pad around SA/VST/zone
    const ts = pts.map(p => p.t);
    const wsG = pts.map(p => p.w * 1000);
    let tMin = Math.floor(Math.min(...ts) - 2);
    let tMax = Math.ceil(Math.max(...ts) + 2);
    let wMaxG = Math.ceil(Math.max(8, Math.max(...wsG) + 2));
    // Prefer a stable terminal default when points sit inside it
    if (tMin >= 10 && tMax <= 28) { tMin = Math.min(tMin, 12); tMax = Math.max(tMax, 26); }
    if (wMaxG < 16 && Math.max(...wsG) <= 14) wMaxG = 16;
    if (!(tMax > tMin)) tMax = tMin + 10;

    const T_MIN = tMin, T_MAX = tMax, W_MAX = wMaxG;
    const VW = 640, VH = 400;
    const pad = { left: 44, right: 40, top: 18, bottom: 36 };
    const gridW = VW - pad.left - pad.right;
    const gridH = VH - pad.top - pad.bottom;
    const x = (t) => safe(pad.left + ((t - T_MIN) / (T_MAX - T_MIN)) * gridW);
    const y = (w) => safe((pad.top + gridH) - (w / (W_MAX / 1000)) * gridH);

    const rhLo = (sweetSpotRange && Number.isFinite(sweetSpotRange.lo)) ? sweetSpotRange.lo : 40;
    const rhHi = (sweetSpotRange && Number.isFinite(sweetSpotRange.hi)) ? sweetSpotRange.hi : 60;
    const showBand = showSweetSpot !== false;

    const buildSweetPoly = (lo, hi) => {
        const top = [], bot = [];
        for (let tt = 20; tt <= 27; tt += 0.5) top.push([tt, getW(tt, hi)]);
        for (let tt = 27; tt >= 20; tt -= 0.5) bot.push([tt, getW(tt, lo)]);
        return [...top, ...bot];
    };

    const cz = (typeof buildComfortZonePoly === 'function') ? buildComfortZonePoly() : [];
    const clampMap = (arr) => arr.map(([t, w]) => [
        Math.min(T_MAX, Math.max(T_MIN, t)),
        Math.min(W_MAX / 1000, Math.max(0, w)),
    ]);
    const ptsStr = (arr) => clampMap(arr).map(([t, w]) => `${x(t).toFixed(1)},${y(w).toFixed(1)}`).join(' ');

    const rhCurves = [20, 40, 60, 80, 100].map((rh) => {
        const segs = [];
        for (let t = T_MIN; t <= T_MAX + 1e-9; t += 0.5) {
            const w = getW(t, rh);
            if (w < 0 || w > W_MAX / 1000 + 0.002) {
                if (segs.length) segs.push(null);
                continue;
            }
            segs.push(`${x(t).toFixed(1)},${y(w).toFixed(1)}`);
        }
        const paths = [];
        let cur = [];
        const flush = () => {
            if (cur.length > 1) paths.push(cur.join(' L '));
            cur = [];
        };
        segs.forEach((p) => { if (p == null) flush(); else cur.push(p); });
        flush();
        return { rh, paths };
    });

    const hLines = [];
    for (let h = 20; h <= 80; h += 10) {
        const segs = [];
        for (let t = T_MIN; t <= T_MAX; t += 0.5) {
            const w = (h - 1.006 * t) / (2501 + 1.86 * t);
            if (w < 0 || w > W_MAX / 1000 || w > getW(t, 100) + 0.0002) continue;
            segs.push(`${x(t).toFixed(1)},${y(w).toFixed(1)}`);
        }
        if (segs.length > 1) hLines.push(segs.join(' L '));
    }

    const tStep = (T_MAX - T_MIN) > 16 ? 2 : 1;
    const wStep = W_MAX > 16 ? 4 : 2;
    const tTicks = [];
    for (let t = Math.ceil(T_MIN / tStep) * tStep; t <= T_MAX + 1e-9; t += tStep) tTicks.push(t);
    const wTicks = [];
    for (let wg = 0; wg <= W_MAX + 1e-9; wg += wStep) wTicks.push(wg);

    const dT = zoneT - saT;
    const dWg = (zoneW - saW) * 1000;
    const dH = getH(zoneT, zoneW) - getH(saT, saW);
    const dVst = hasVst ? (vstT - saT) : null;

    const inCz = (typeof isInComfortZone === 'function' && cz.length)
        ? isInComfortZone(zoneT, zoneW, cz)
        : (zoneT >= 20 && zoneT <= 27 && zoneRh >= 20 && zoneRh <= 80);
    const inBand = zoneRh >= rhLo && zoneRh <= rhHi;
    const status = (inCz && inBand) ? 'IN CZ+BAND' : (inCz ? 'IN CZ · OUT BAND' : 'OUT CZ');
    const statusColor = (inCz && inBand) ? '#34d399' : (inCz ? '#fbbf24' : '#f87171');

    const chipCls = theme === 'dark'
        ? 'bg-slate-950 border-slate-800'
        : 'bg-white border-slate-200';
    const panelBg = theme === 'dark' ? 'bg-slate-950' : 'bg-slate-900';
    const clipId = `vav-cz-clip-${String(vav.id || 'x').replace(/[^a-zA-Z0-9_-]/g, '_')}`;

    return (
        <div className={`h-full min-h-0 flex flex-col ${panelBg} text-slate-200`} data-testid="vav-psy-chart">
            <div className="flex-shrink-0 px-3 py-2 border-b border-slate-800 flex items-baseline justify-between gap-2">
                <h4 className="text-[10px] font-black uppercase tracking-[0.16em] text-indigo-300">Zone delivery · vs AHU SA</h4>
                <span className="text-[9px] font-mono text-slate-500">{T_MIN}–{T_MAX}°C · 0–{W_MAX} g/kg</span>
            </div>

            <div className="flex-shrink-0 flex flex-wrap gap-1.5 px-2 pt-2">
                <div className={`px-2 py-1 rounded border ${chipCls}`}>
                    <div className="text-[7px] uppercase tracking-wider text-slate-500">SA</div>
                    <div className="text-[11px] font-black text-cyan-300">{saT.toFixed(1)}°C</div>
                </div>
                {hasVst && (
                    <div className={`px-2 py-1 rounded border ${chipCls}`}>
                        <div className="text-[7px] uppercase tracking-wider text-slate-500">VST</div>
                        <div className="text-[11px] font-black text-violet-300">{vstT.toFixed(1)}°C</div>
                    </div>
                )}
                <div className={`px-2 py-1 rounded border ${chipCls}`}>
                    <div className="text-[7px] uppercase tracking-wider text-slate-500">Zone</div>
                    <div className="text-[11px] font-black text-emerald-300">{zoneT.toFixed(1)}°C · {zoneRh.toFixed(0)}%</div>
                </div>
                {showBand && (
                    <div className={`px-2 py-1 rounded border ${chipCls}`}>
                        <div className="text-[7px] uppercase tracking-wider text-slate-500">RH band</div>
                        <div className="text-[11px] font-black text-emerald-200">{rhLo}–{rhHi}%</div>
                    </div>
                )}
                <div className={`px-2 py-1 rounded border ${chipCls}`}>
                    <div className="text-[7px] uppercase tracking-wider text-slate-500">Status</div>
                    <div className="text-[10px] font-black" style={{ color: statusColor }}>{status}</div>
                </div>
                <div className={`px-2 py-1 rounded border ${chipCls}`}>
                    <div className="text-[7px] uppercase tracking-wider text-slate-500">Δh</div>
                    <div className="text-[11px] font-black">{dH >= 0 ? '+' : ''}{dH.toFixed(1)} kJ/kg</div>
                </div>
                <div className={`px-2 py-1 rounded border ${chipCls}`}>
                    <div className="text-[7px] uppercase tracking-wider text-slate-500">ΔT</div>
                    <div className="text-[11px] font-black">{dT >= 0 ? '+' : ''}{dT.toFixed(1)}°C</div>
                </div>
                <div className={`px-2 py-1 rounded border ${chipCls}`}>
                    <div className="text-[7px] uppercase tracking-wider text-slate-500">ΔW</div>
                    <div className="text-[11px] font-black">{dWg >= 0 ? '+' : ''}{dWg.toFixed(1)} g/kg</div>
                </div>
                {dVst != null && (
                    <div className={`px-2 py-1 rounded border ${chipCls}`}>
                        <div className="text-[7px] uppercase tracking-wider text-slate-500">VST−SAT</div>
                        <div className="text-[11px] font-black text-violet-300">{dVst >= 0 ? '+' : ''}{dVst.toFixed(1)}°C</div>
                    </div>
                )}
            </div>

            <div className="flex-1 min-h-0 px-1 pb-1">
                <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet" aria-label="VAV psychrometric chart">
                    <defs>
                        <clipPath id="vavPlotClip">
                            <rect x={pad.left} y={pad.top} width={gridW} height={gridH} />
                        </clipPath>
                        {cz.length > 2 && (
                            <clipPath id={clipId}>
                                <polygon points={ptsStr(cz)} />
                            </clipPath>
                        )}
                    </defs>
                    <rect x={pad.left} y={pad.top} width={gridW} height={gridH} fill="#020617" stroke="#1e293b" />
                    <g clipPath="url(#vavPlotClip)">
                        {tTicks.map((t) => (
                            <line key={`tv${t}`} x1={x(t)} y1={pad.top} x2={x(t)} y2={pad.top + gridH} stroke="#1e293b" strokeWidth="1" />
                        ))}
                        {wTicks.map((wg) => (
                            <line key={`wh${wg}`} x1={pad.left} y1={y(wg / 1000)} x2={pad.left + gridW} y2={y(wg / 1000)} stroke="#1e293b" strokeWidth="1" />
                        ))}
                        {hLines.map((d, i) => (
                            <path key={`h${i}`} d={`M ${d}`} fill="none" stroke="#3f3f1a" strokeWidth="1" opacity="0.5" />
                        ))}
                        {rhCurves.map(({ rh, paths }) => paths.map((d, i) => (
                            <path key={`rh${rh}-${i}`} d={`M ${d}`} fill="none"
                                  stroke={rh === 100 ? '#94a3b8' : '#334155'}
                                  strokeWidth={rh === 100 ? 2 : 1} />
                        )))}
                        {cz.length > 2 && (
                            <polygon points={ptsStr(cz)} fill="#10b981" fillOpacity="0.14" stroke="#10b981" strokeWidth="1.2" />
                        )}
                        {showBand && cz.length > 2 && (
                            <polygon points={ptsStr(buildSweetPoly(rhLo, rhHi))}
                                     clipPath={`url(#${clipId})`}
                                     fill="#059669" fillOpacity="0.34"
                                     stroke="#34d399" strokeWidth="0.9" strokeDasharray="3,2" />
                        )}
                        {showBand && (
                            <text x={x(Math.min(T_MAX - 0.5, Math.max(T_MIN + 0.5, 23.5)))}
                                  y={y(getW(23.5, (rhLo + rhHi) / 2))}
                                  fill="#a7f3d0" fontSize="9" fontWeight="900" textAnchor="middle">
                                {(ahuId || 'AHU')} · {rhLo}–{rhHi}% RH
                            </text>
                        )}
                        <path d={`M ${pts.map(p => `${x(p.t).toFixed(1)},${y(p.w).toFixed(1)}`).join(' L ')}`}
                              fill="none" stroke="#6366f1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1={x(saT)} y1={y(saW)} x2={x(zoneT)} y2={y(zoneW)}
                              stroke="#475569" strokeWidth="1" strokeDasharray="4 3" />
                        {pts.map((p) => (
                            <g key={p.label}>
                                <circle cx={x(p.t)} cy={y(p.w)} r={p.label === 'ZONE' ? 7 : 6}
                                        fill={p.color} stroke="#f8fafc" strokeWidth="1.8" />
                                <text x={x(p.t)} y={y(p.w) - 11} fill={p.color} fontSize="10" fontWeight="900" textAnchor="middle">{p.label}</text>
                            </g>
                        ))}
                    </g>
                    {tTicks.map((t) => (
                        <text key={`tt${t}`} x={x(t)} y={pad.top + gridH + 14} fill="#64748b" fontSize="9" textAnchor="middle">{t}</text>
                    ))}
                    {wTicks.map((wg) => (
                        <text key={`wt${wg}`} x={pad.left - 5} y={y(wg / 1000) + 3} fill="#64748b" fontSize="9" textAnchor="end">{wg}</text>
                    ))}
                    <text x={pad.left + gridW / 2} y={VH - 6} fill="#64748b" fontSize="8" textAnchor="middle" letterSpacing="0.12em">DRY BULB (°C)</text>
                    <text x={12} y={pad.top + gridH / 2} fill="#64748b" fontSize="8" textAnchor="middle"
                          transform={`rotate(-90 12 ${pad.top + gridH / 2})`} letterSpacing="0.12em">W (g/kg)</text>
                </svg>
            </div>
        </div>
    );
}
