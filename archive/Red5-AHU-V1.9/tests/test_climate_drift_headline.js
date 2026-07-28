/* Regression test for the climate-drift headline math + Givoni tier legend chip.
 *
 * Climate-drift headline:
 *   - Top 3 movers by |hist[b].oa - histHist[b].oa| are surfaced.
 *   - Only shown when comparison mode is on AND history is loaded.
 *   - Sign convention: current > historical -> up arrow + green (climate
 *     moving INTO the band); current < historical -> down arrow + amber.
 *
 * Givoni tier legend chip:
 *   - 4 swatches A / B / C+ / C- with colours auto-derived from
 *     GIVONI_COLORS in psychrometric.js.
 *   - Only rendered when showGivoni === true.
 *
 * This test re-implements the headline-pick logic outside of the
 * 4500-line psy-3d-engine.js module so the math can be exercised
 * deterministically and the JS strings in the rendered HTML can be
 * grep-asserted.
 *
 * Run from /app/archive/Red5-AHU-V1.9:
 *   node tests/test_climate_drift_headline.js
 */
const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
const fails = [];
function check(name, ok, info) {
    if (ok) { pass++; }
    else    { fail++; fails.push(name + (info ? '  ' + info : '')); }
}

// ---------- 1. Re-implementation of the picker (verbatim from psy-3d-engine.js) ----------
function pickClimateDriftTop(hist, histHist) {
    const BANDS = ['B1','B2','B3','B4','B5','B6','B7','B8','B9','B10'];
    const drifts = BANDS.map(b => ({
        band: b,
        drift: (hist[b].oa || 0) - (histHist[b].oa || 0),
        abs:   Math.abs((hist[b].oa || 0) - (histHist[b].oa || 0)),
    })).filter(x => x.abs >= 2);
    drifts.sort((a, b) => b.abs - a.abs);
    return drifts.slice(0, 3);
}

// ---------- Synthetic histograms ----------
const emptyBand = { oa: 0, oap: 0 };
function buildHist(spec) {
    const out = {};
    ['B1','B2','B3','B4','B5','B6','B7','B8','B9','B10','?'].forEach(b => {
        out[b] = { oa: spec[b]?.oa || 0, oap: spec[b]?.oap || 0 };
    });
    return out;
}

// ---------- Case 1: B7 gained 142h, B2 lost 89h, B5 gained 34h ----------
{
    const hist     = buildHist({ B7:{oa:580}, B2:{oa:411}, B5:{oa:2034}, B1:{oa:200} });
    const histHist = buildHist({ B7:{oa:438}, B2:{oa:500}, B5:{oa:2000}, B1:{oa:201} });
    const top = pickClimateDriftTop(hist, histHist);
    check('case 1: 3 movers returned', top.length === 3, 'got=' + top.length);
    check('case 1: top = B7', top[0].band === 'B7', 'got=' + top[0].band);
    check('case 1: B7 drift = +142', top[0].drift === 142, 'got=' + top[0].drift);
    check('case 1: 2nd = B2 -89', top[1].band === 'B2' && top[1].drift === -89);
    check('case 1: 3rd = B5 +34', top[2].band === 'B5' && top[2].drift === 34);
    check('case 1: B1 |drift|=1 filtered out (below threshold)',
          !top.some(t => t.band === 'B1'));
}

// ---------- Case 2: identical histograms -> no movers ----------
{
    const eq = buildHist({ B1:{oa:100}, B5:{oa:2000}, B8:{oa:300} });
    const top = pickClimateDriftTop(eq, eq);
    check('case 2: zero movers when identical', top.length === 0);
}

// ---------- Case 3: sub-threshold drift is filtered ----------
{
    const a = buildHist({ B5:{oa:2001} });
    const b = buildHist({ B5:{oa:2000} });
    const top = pickClimateDriftTop(a, b);
    check('case 3: |drift|=1 below threshold (2) is filtered', top.length === 0);
}

// ---------- Case 4: only 1 mover ----------
{
    const a = buildHist({ B8:{oa:500}, B1:{oa:100} });
    const b = buildHist({ B8:{oa:300}, B1:{oa:100} });
    const top = pickClimateDriftTop(a, b);
    check('case 4: single mover', top.length === 1 && top[0].band === 'B8' && top[0].drift === 200);
}

// ---------- Case 5: many movers -> top 3 only ----------
{
    const a = buildHist({ B1:{oa:100}, B2:{oa:200}, B3:{oa:300}, B4:{oa:400}, B5:{oa:500} });
    const b = buildHist({ B1:{oa:50},  B2:{oa:100}, B3:{oa:150}, B4:{oa:200}, B5:{oa:250} });
    const top = pickClimateDriftTop(a, b);
    check('case 5: capped at 3 even with 5 movers', top.length === 3);
    check('case 5: top is biggest drift (B5 +250)', top[0].band === 'B5' && top[0].drift === 250);
    check('case 5: 2nd is B4 +200', top[1].band === 'B4' && top[1].drift === 200);
    check('case 5: 3rd is B3 +150', top[2].band === 'B3' && top[2].drift === 150);
}

// ---------- 2. Verify the rendered psy-3d-engine.js bytes contain the new wiring ----------
const eng = fs.readFileSync(path.join(__dirname, '..', 'js', 'psy-3d-engine.js'), 'utf8');
check('source: headline div has data-erv-headline=climate-drift',
      eng.indexOf('data-erv-headline="climate-drift"') !== -1);
check('source: headline label is uppercase "Climate drift"',
      eng.indexOf('Climate drift') !== -1);
check('source: bands row wrapped in data-erv-row=bands',
      eng.indexOf('data-erv-row="bands"') !== -1);
check('source: sign convention up arrow used',
      eng.indexOf('\\u2191') !== -1);
check('source: sign convention down arrow used',
      eng.indexOf('\\u2193') !== -1);
check('source: green delta colour is #a3e635 (gaining)',
      eng.indexOf('#a3e635') !== -1);
check('source: amber delta colour is #fb7185 (losing)',
      eng.indexOf('#fb7185') !== -1);
check('source: 5-year avg basis label includes "vs 5"',
      eng.indexOf('vs 5\\u2011year avg') !== -1 || eng.indexOf('vs 5\u2011year avg') !== -1);

// ---------- 3. Verify the Givoni tier legend chip is wired in dashboard.html ----------
const dash = fs.readFileSync(path.join(__dirname, '..', 'dashboard.html'), 'utf8');
check('dashboard: legend has data-testid givoni-tier-legend',
      dash.indexOf('givoni-tier-legend') !== -1);
check('dashboard: legend has per-tier testids',
      dash.indexOf('givoni-tier-legend-${s.tier}') !== -1);
check('dashboard: legend references GIVONI_COLORS.SWEET_FILL',
      dash.indexOf('GIVONI_COLORS.SWEET_FILL') !== -1);
check('dashboard: legend references GIVONI_COLORS.CZ_STROKE',
      dash.indexOf('GIVONI_COLORS.CZ_STROKE') !== -1);
check('dashboard: legend references GIVONI_COLORS.HOT_OUTSIDE',
      dash.indexOf('GIVONI_COLORS.HOT_OUTSIDE') !== -1);
check('dashboard: legend references GIVONI_COLORS.COLD_OUTSIDE',
      dash.indexOf('GIVONI_COLORS.COLD_OUTSIDE') !== -1);
check('dashboard: legend is gated on showGivoni',
      /showGivoni\s*&&\s*\(\(\)\s*=>\s*\{[\s\S]{0,1000}givoni-tier-legend/.test(dash));
check('dashboard: all 4 tiers present in swatches',
      ["tier: 'A'", "tier: 'B'", "tier: 'C+'", "tier: 'C-'"].every(s => dash.indexOf(s) !== -1));

// ---------- Summary ----------
console.log('Climate-drift headline + Givoni tier legend: ' + pass + ' pass, ' + fail + ' fail.');
if (fail > 0) {
    console.log('FAILURES:');
    fails.forEach(f => console.log('  - ' + f));
    process.exit(1);
}
process.exit(0);
