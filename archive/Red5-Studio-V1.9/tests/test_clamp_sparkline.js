/* Regression test for the clamp-effectiveness sparkline (P2).
 *
 * What ships:
 *   - clampSpark state + 30-sample / 30-second rolling buffer (mean SA-RH
 *     across all AHUs).  Persisted to localStorage so the sparkline
 *     survives page reloads.
 *   - Inline 64x22 SVG slotted into the existing band-clamp-row IIFE,
 *     between the "Live: ..." chip and the Apply button.
 *   - Three color states keyed on clamp applied + mean-vs-window:
 *       - emerald  (clamp applied AND mean inside window)
 *       - rose + "!" glyph (clamp applied AND mean drifting outside)
 *       - slate    (no clamp applied -- baseline view)
 *   - Per-AHU tooltip + honored/total samples.
 *
 * Pure client-side: zero new BACnet writes, zero new backend routes.
 *
 * Run from /app/archive/Red5-Studio-V1.9:
 *   node tests/test_clamp_sparkline.js
 */
const fs = require('fs');
const path = require('path');

const dashPath = path.join(__dirname, '..', 'dashboard.html');
const dash = fs.readFileSync(dashPath, 'utf8');

let pass = 0, fail = 0;
const fails = [];
function check(name, ok, info) {
    if (ok) pass++;
    else { fail++; fails.push(name + (info ? '  ' + info : '')); }
}

// ====================================================================
// STATE + SAMPLING
// ====================================================================
check('state: SPARK_MAX = 30 declared',
    /const\s+SPARK_MAX\s*=\s*30/.test(dash));
check('state: SPARK_INTERVAL_MS = 30 seconds',
    /const\s+SPARK_INTERVAL_MS\s*=\s*30\s*\*\s*1000/.test(dash));
check('state: clampSpark state hydrated from localStorage',
    /useState\([\s\S]{0,400}red5\.clampSpark/.test(dash));
check('state: clampSpark hydrate clamps to SPARK_MAX',
    /clampSpark[\s\S]{0,500}\.slice\(-SPARK_MAX\)/.test(dash));
check('sample: useEffect re-runs on ahuData change',
    /useEffect\(\s*\(\)\s*=>\s*\{[\s\S]{0,3000}setClampSpark\(prev[\s\S]{0,800}\}\s*,\s*\[ahuData\]\)/.test(dash));
check('sample: finds SA point via label === SA',
    /\.find\(p\s*=>\s*p\.label\s*===\s*'SA'\)/.test(dash));
check('sample: skips non-finite RH (mock mode NaN)',
    /Number\.isFinite\(rh\)/.test(dash));
check('sample: throttles to SPARK_INTERVAL_MS',
    /ts\s*-\s*prev\[prev\.length\s*-\s*1\]\.ts[\s\S]{0,80}SPARK_INTERVAL_MS/.test(dash));
check('sample: persists buffer to localStorage',
    /localStorage\.setItem\(['"]red5\.clampSpark['"]/.test(dash));
check('sample: buffer is slice(-SPARK_MAX) cap',
    /\.\.\.prev,\s*\{\s*ts,\s*meanRh,\s*perAhu\s*\}\][\s\S]{0,30}\.slice\(-SPARK_MAX\)/.test(dash));

// ====================================================================
// RENDER: 3 STATES + INLINE SVG
// ====================================================================
check('render: gated behind clampSpark.length >= 2 (needs >= 2 samples for polyline)',
    /clampSpark\.length\s*>=\s*2\s*&&/.test(dash));
check('render: 64 x 22 SVG dimensions match mockup',
    /const W\s*=\s*64,\s*H\s*=\s*22/.test(dash));
check('render: shows last 12 samples (60-min window when SPARK_INTERVAL_MS = 30s)',
    /clampSpark\.slice\(-12\)/.test(dash));
check('render: window band (emerald rect) is drawn ONLY when clamp applied',
    /\{applied\s*&&\s*\([\s\S]{0,1000}<rect[\s\S]{0,200}fill="rgba\(16,185,129,0\.18\)"/.test(dash));
check('render: window upper bound dashed line',
    /<line[^>]*y1=\{yOf\(applied\.hi\)\}[^>]*strokeDasharray="2,1.5"/.test(dash));
check('render: window lower bound dashed line',
    /<line[^>]*y1=\{yOf\(applied\.lo\)\}[^>]*strokeDasharray="2,1.5"/.test(dash));
check('render: polyline carries the meanRh series',
    /<polyline[^>]*points=\{points\}/.test(dash));
check('render: endpoint dot marker',
    /<circle[\s\S]{0,300}r="1\.7"\s+fill=\{dotFill\}/.test(dash));
check('render: numeric mean shown to the right (5-decimal-format)',
    /meanRh\.toFixed\(1\)\}%/.test(dash));
check('render: tooltip title contains "Mean SA-RH" + honored count',
    /Mean SA-RH:[\s\S]{0,500}Honored:/.test(dash));
check('render: per-AHU breakdown line in tooltip',
    /perAhuStr/.test(dash)
    && /\$\{p\.id\}:\$\{p\.rh\.toFixed\(0\)\}%/.test(dash));

// ====================================================================
// COLOR STATES
// ====================================================================
check('color: emerald stroke when applied AND inside band',
    /insideBand\s*\?\s*'#34d399'/.test(dash));
check('color: rose stroke when applied AND drifting outside band',
    /insideBand\s*\?\s*'#34d399'\s*:\s*'#fb7185'/.test(dash));
check('color: slate stroke when no clamp applied',
    /!applied\s*\?\s*'#94a3b8'/.test(dash));
check('color: rose border + "!" glyph when applied AND not inside band',
    /\{applied\s*&&\s*!insideBand\s*&&\s*\([\s\S]{0,300}<text[\s\S]{0,200}fill="#fb7185"[\s\S]{0,80}>!</.test(dash));
check('color: up-arrow on numeric mean when meanRh > applied.hi',
    /driftAbove\s*=\s*applied\s*&&\s*meanRh\s*>\s*applied\.hi/.test(dash)
    && /driftAbove\s*\?\s*'\\u2191'/.test(dash));

// ====================================================================
// LAYOUT INSERTION POINT (between Live chip and Apply button)
// ====================================================================
check('layout: band-clamp-row testid is preserved (no regression)',
    /data-testid="band-clamp-row"/.test(dash));
check('layout: clamp-spark testid present on the wrapper div',
    /data-testid="clamp-spark"/.test(dash));
check('layout: clamp-spark-mean testid present on the numeric label',
    /data-testid="clamp-spark-mean"/.test(dash));
check('layout: sparkline sits between band-clamp-live and band-clamp-apply',
    /data-testid="band-clamp-live"[\s\S]{0,8000}data-testid="clamp-spark"[\s\S]{0,8000}data-testid="band-clamp-apply"/.test(dash));

// ====================================================================
// NO BACKEND CHURN
// --------------------------------------------------------------------
// The mockup originally proposed a 30-line backend endpoint
// (/api/band-overrides/effectiveness).  We deliberately chose the
// purely-client path so this ships with ZERO controller-side risk.
// ====================================================================
check('zero-backend: no /api/band-overrides/effectiveness call added',
    !/\/api\/band-overrides\/effectiveness/.test(dash));

// ---- Summary ----
console.log('Clamp-effectiveness sparkline: ' + pass + ' pass, ' + fail + ' fail.');
if (fail > 0) {
    console.log('FAILURES:');
    fails.forEach(f => console.log('  - ' + f));
    process.exit(1);
}
process.exit(0);
