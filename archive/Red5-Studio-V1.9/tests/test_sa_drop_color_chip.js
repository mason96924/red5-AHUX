// test_sa_drop_color_chip.js
// Verifies the OA→SA Drops color-mode chip (T | B) added to the layer toggle.
//
// Run with:  node tests/test_sa_drop_color_chip.js
'use strict';
const fs = require('fs');
const SRC = fs.readFileSync(__dirname + '/../js/psy-3d-engine.js', 'utf-8');

let pass = 0, fail = 0;
const ok = (cond, msg) => { if (cond) { pass++; console.log('  PASS:', msg); } else { fail++; console.log('  FAIL:', msg); } };

console.log('-- Module-level _bandRGB (matches 2D bandCol palette) --');
ok(/function _bandRGB\(t, rh\)/.test(SRC), 'helper exists at module scope');
// Spot-check a couple of palette anchors against bandCol() in the 2D layer:
ok(/\[0\.231, 0\.510, 0\.965\].*B1.*cold-dry/.test(SRC),  'B1 cold-dry  = #3b82f6 (matches bandCol)');
ok(/\[0\.063, 0\.725, 0\.506\].*B5.*comfort/.test(SRC),   'B5 comfort   = #10b981 (matches bandCol)');
ok(/\[0\.976, 0\.451, 0\.086\].*B7.*warm-hum/.test(SRC),  'B7 warm-hum  = #f97316 (matches bandCol)');

console.log('-- Color-mode state var --');
ok(SRC.includes("var _saDropColorMode = 't';"),       'default mode = t (temperature spectrum)');
ok(SRC.includes("var bandMode = (_saDropColorMode === 'band');"),
   'drop builder reads mode at build time');
ok(SRC.includes("c = bandMode ? _bandRGB(p.t, p.rh) : t2rgb(p.t);"),
   'per-sample color: bandMode → _bandRGB, else t2rgb (existing temperature spectrum)');

console.log('-- Reusable build helper (called from buildWeatherVis AND chip click) --');
ok(SRC.includes("function _buildSaDropGeometry()"),
   '_buildSaDropGeometry helper extracted');
ok(SRC.includes("_buildSaDropGeometry();"),
   'called from at least one place');
// Should be invoked in BOTH places (buildWeatherVis + chip click handler):
const calls = (SRC.match(/_buildSaDropGeometry\(\);/g) || []).length;
ok(calls >= 2, `called in ≥2 places (buildWeatherVis + chip click) — found ${calls}`);

console.log('-- Chip element + initial-state self-heal --');
ok(SRC.includes("chip.id='p3-saDrop-color';"),    'chip element id');
ok(/Self-heal: if anything else clobbered/.test(SRC),
   'self-heal default (handles closure-init race)');
ok(SRC.includes("if (_saDropColorMode !== 'band') _saDropColorMode = 't';"),
   'forces _saDropColorMode to t if not already band on first render');

console.log('-- Chip click handler (recolors without re-fetch) --');
ok(SRC.includes("if (m === _saDropColorMode) return;"),   'no-op when clicking the active mode');
ok(SRC.includes("_saDropColorMode = m;"),                 'sets mode from clicked span');

console.log('-- Chip auto-shows/hides with the layer toggle --');
ok(SRC.includes("if (t[0]==='saDrop')"),
   'layer-toggle handler aware of saDrop key');
ok(SRC.includes("chip.style.display = o.visible ? 'inline-flex' : 'none';"),
   'chip visibility tracks layer visibility');
ok(SRC.includes("if (saDropGroup && saDropGroup.visible) chip.style.display = 'inline-flex';"),
   'chip starts hidden if layer is hidden (matches default)');

console.log('-- Tooltip explains both modes --');
ok(SRC.includes("OA temperature spectrum") && SRC.includes("SA-reset band palette"),
   'title attribute documents both modes');

console.log(`\n${pass}/${pass+fail} tests passed`);
process.exit(fail ? 1 : 0);
