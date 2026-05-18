// Regression test for the Givoni-aware 3-tier classifier in js/psychrometric.js
// Verifies:
//   1) Each VAV from the operator's 2026-02 screenshot lands in the right tier
//      with the right control-strategy recommendation.
//   2) Tier-A and Tier-B dot fills auto-derive from the same hex tokens the
//      chart polygons use (auto-derive contract).
//   3) The inner band follows the live RH sweet-spot slider, not a hard-
//      coded 40-60 (a VAV at the edge flips tier when the slider tightens).
//   4) Disabling the Givoni overlay still produces a usable Tier-C result
//      based on hot-side / cold-side temp split.
//
// Run from /app/archive/Red5-Studio-V1.9:
//   node tests/test_givoni_tier_resolver.js
//
// Exits 0 on all pass, 1 otherwise.

const fs = require('fs');
const path = require('path');

const code = fs.readFileSync(path.join(__dirname, '..', 'js', 'psychrometric.js'), 'utf8');
// Expose top-level `const X = ...` declarations as globals so the eval sandbox
// can see them after evaluation (mirrors the browser-script-tag environment).
const exposed = code.replace(/^const ([A-Za-z_][A-Za-z0-9_]*)\s*=\s*/gm, 'globalThis.$1 = ');
eval(exposed);

const poly = buildComfortZonePoly();
const ss   = { lo: 40, hi: 60 };

const cases = [
    // From the operator's screenshot (2026-02-11)
    { id: 'VAV-02-E', t: 21.4, rh: 39, tier: 'B',  strategy: 'TRIM_HUMIDIFY'   },
    { id: 'VAV-03-E', t: 24.2, rh: 52, tier: 'A',  strategy: 'HOLD'            },
    { id: 'VAV-04-E', t: 25.4, rh: 38, tier: 'B',  strategy: 'TRIM_HUMIDIFY'   },
    { id: 'VAV-01-S', t: 25.8, rh: 37, tier: 'B',  strategy: 'TRIM_HUMIDIFY'   },
    { id: 'VAV-02-S', t: 20.8, rh: 48, tier: 'A',  strategy: 'HOLD'            },
    { id: 'VAV-01-W', t: 22.0, rh: 45, tier: 'A',  strategy: 'HOLD'            },
    { id: 'VAV-02-W', t: 22.0, rh: 45, tier: 'A',  strategy: 'HOLD'            },
    { id: 'VAV-01-N', t: 22.0, rh: 45, tier: 'A',  strategy: 'HOLD'            },
    // Synthetic edge cases
    { id: 'OUTSIDE-HOT',  t: 30.0, rh: 60, tier: 'C+', strategy: 'COOL'            },
    { id: 'OUTSIDE-COLD', t: 15.0, rh: 30, tier: 'C-', strategy: 'HEAT'            },
    { id: 'CZ-HIGH-RH',   t: 24.0, rh: 75, tier: 'B',  strategy: 'TRIM_DEHUMIDIFY' },
    // In-temp-band but outside CZ (dry side, T < 23.5 centroid -> humidify)
    { id: 'IN-T-DRY',     t: 23.0, rh: 15, tier: 'C-', strategy: 'HUMIDIFY'        },
];

let pass = 0, fail = 0;
const fails = [];

for (const c of cases) {
    const w = getW(c.t, c.rh);
    const r = getGivoniTier(c.t, w, c.rh, poly, ss, true);
    const ok = r.tier === c.tier && r.strategy === c.strategy;
    if (ok) {
        pass++;
    } else {
        fail++;
        fails.push(`${c.id}: got tier=${r.tier} strategy=${r.strategy}, expected tier=${c.tier} strategy=${c.strategy}`);
    }
}

// Auto-derive contract: dot fills MUST equal the polygon-fill hex tokens.
const rA = getGivoniTier(23, getW(23, 50), 50, poly, ss, true);
const rB = getGivoniTier(23, getW(23, 38), 38, poly, ss, true);
const autoA = rA.dotFill === GIVONI_COLORS.SWEET_FILL;
const autoB = rB.dotFill === GIVONI_COLORS.CZ_STROKE;
if (autoA) pass++; else { fail++; fails.push(`Auto-derive A: dotFill=${rA.dotFill} != SWEET_FILL=${GIVONI_COLORS.SWEET_FILL}`); }
if (autoB) pass++; else { fail++; fails.push(`Auto-derive B: dotFill=${rB.dotFill} != CZ_STROKE=${GIVONI_COLORS.CZ_STROKE}`); }

// Live-slider responsiveness: tighten to 46-54, a VAV at 45% RH must drop A->B.
const rTight = getGivoniTier(22.0, getW(22.0, 45), 45, poly, { lo: 46, hi: 54 }, true);
if (rTight.tier === 'B' && rTight.strategy === 'TRIM_HUMIDIFY') pass++;
else { fail++; fails.push(`Live slider: tighten 46-54 should drop 45% RH to B/TRIM_HUMIDIFY, got ${rTight.tier}/${rTight.strategy}`); }

// Givoni disabled: still classifies hot vs cold via the 23.5 C split.
const rOff = getGivoniTier(30, getW(30, 60), 60, poly, null, false);
if (rOff.tier === 'C+' && rOff.strategy === 'COOL') pass++;
else { fail++; fails.push(`Givoni disabled hot side: got ${rOff.tier}/${rOff.strategy}, expected C+/COOL`); }

console.log(`Givoni tier resolver: ${pass} pass, ${fail} fail.`);
if (fail > 0) {
    console.log('FAILURES:');
    for (const f of fails) console.log('  - ' + f);
    process.exit(1);
}
process.exit(0);
