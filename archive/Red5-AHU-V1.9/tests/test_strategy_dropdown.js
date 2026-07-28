// test_strategy_dropdown.js
// Verifies the Monthly × Sites strategy dropdown collapses 5 individual
// toggle buttons into a single dropdown with checkboxes, while leaving
// the underlying _msShow* state vars + render math 100% unchanged.
//
// Run with:  node tests/test_strategy_dropdown.js
'use strict';
const fs = require('fs');

const SRC_PATH = __dirname + '/../js/psy-3d-engine.js';
const src = fs.readFileSync(SRC_PATH, 'utf-8');

let pass = 0, fail = 0;
const ok = (cond, msg) => { if (cond) { pass++; console.log('  PASS:', msg); } else { fail++; console.log('  FAIL:', msg); } };

console.log('-- Source-level invariants --');
ok(src.includes("p3-btn-strat-dd"),       'new strategy dropdown trigger ID exists');
ok(src.includes("p3-strat-dd-panel"),     'new strategy dropdown panel ID exists');
ok(src.includes("_refreshStratDropdown"), 'dropdown refresh helper defined');
ok(src.includes("_stratDefs"),            'strategy definitions helper defined');
ok(src.includes("legacyBtn.click()"),     'forwards to legacy hidden button (preserves render math)');
ok(!src.includes("'p3-btn-ms-fixed','p3-btn-ms-dyn'"), '5-button forEach lists removed');

console.log('-- Strategy definitions are complete --');
const stratIds = ['p3-btn-ms-fixed','p3-btn-ms-dyn','p3-btn-ms-band','p3-btn-ms-banddyn','p3-btn-ms-opt'];
stratIds.forEach(id => ok(src.includes(`id:'${id}'`), `_stratDefs entry for ${id}`));

console.log('-- State-var getters (stay live, never duplicated) --');
['_msShowFixed','_msShowDyn','_msShowBand','_msShowBandDyn','_msShowOpt'].forEach(v =>
    ok(src.includes(`return ${v};`), `${v} getter present in _stratDefs`));

console.log('-- Underlying state vars + handlers preserved (zero render-math change) --');
ok(src.includes("_msShowFixed   = !_msShowFixed"),       'Fixed-SA toggle handler intact');
ok(src.includes("_msShowDyn     = !_msShowDyn"),         'Dyn-Reset toggle handler intact');
ok(src.includes("_msShowBand    = !_msShowBand"),        'B1-B10 toggle handler intact');
ok(src.includes("_msShowBandDyn = !_msShowBandDyn"),     'B1-B10+Dyn toggle handler intact');
ok(src.includes("_msShowOpt     = !_msShowOpt"),         'Opt-SA toggle handler intact');

console.log('-- Visibility wiring --');
ok(src.includes("'p3-btn-strat-dd','p3-strat-dd-panel'"), 'dropdown shown/hidden in MS-mode forEach lists');
ok(src.includes("if (sdp && !inMs) sdp.style.display = 'none'"), 'panel auto-closes on leaving MS mode');

console.log('-- Layout: row reads HEADER → SITES → STRATEGIES → OA --');
const sitesLeft  = (src.match(/sitesDdBtn\.style\.cssText[^}]*?left:(\d+)px/) || [])[1];
const stratLeft  = (src.match(/stratDdBtn\.style\.cssText[^}]*?left:(\d+)px/) || [])[1];
ok(sitesLeft && stratLeft && parseInt(stratLeft) > parseInt(sitesLeft),
   `strat dropdown (left:${stratLeft}) sits to the right of sites (left:${sitesLeft})`);

console.log('-- Outside-click + dispose cleanup --');
ok(src.includes("_stratDdOutsideHandler"), 'outside-click closer registered');
ok(src.includes("removeEventListener('click', _stratDdOutsideHandler)"), 'outside-click closer cleaned up on dispose');

console.log('-- All / None action buttons --');
ok(src.includes("data-stract=\"all\"") && src.includes("data-stract=\"none\""), 'All/None buttons present');
ok(src.includes("act === 'all'"), 'All action toggles every strategy on');

console.log(`\n${pass}/${pass+fail} tests passed`);
process.exit(fail ? 1 : 0);
