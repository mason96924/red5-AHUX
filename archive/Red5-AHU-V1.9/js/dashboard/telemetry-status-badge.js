/* ------------------------------------------------------------------
 * dashboard/telemetry-status-badge.js — extracted from app.js in Phase L.26 (2026-06-24).
 *
 * Originally an inline IIFE `{telemetryStatus && (() => { ... })()}` inside
 * App's render.  Body kept byte-identical modulo one block-of-dedent.
 * Ctx props expected: telemetryStatus
 * ------------------------------------------------------------------ */

function renderTelemetryStatusBadge(ctx) {
    const { telemetryStatus } = ctx;
    if (!(telemetryStatus)) return null;

const s = telemetryStatus;
const isLive = s.live && !s.mock_mode && !s.stale;
const isMock = s.mock_mode && s.live;
const isStale = s.live && s.stale && !s.mock_mode;
const isOff = !s.live;
const label = isLive ? 'LIVE' : isMock ? 'SIM' : isStale ? 'STALE' : 'OFF';
const color = isLive ? '#22c55e' : isMock ? '#f59e0b' : isStale ? '#ef4444' : '#64748b';
return React.createElement('span', {
    className: 'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border',
    style: { color, borderColor: color, backgroundColor: color + '15' },
    title: isLive ? `Live BACnet (${s.equipment_count} equip, ${Math.round(s.age_seconds)}s ago)` : isMock ? `Simulator mode (${s.equipment_count} equip)` : isStale ? `Data stale (${Math.round(s.age_seconds)}s old)` : 'Collector not running'
},
    React.createElement('span', {
        style: { width: 5, height: 5, borderRadius: '50%', backgroundColor: color, display: 'inline-block', animation: isLive || isMock ? 'pulse 2s infinite' : 'none' }
    }),
    label
);
}
