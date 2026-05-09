// test_oa_sa_3d_drops.js
// Verifies the 3D OA→SA Drops layer added on top of the existing 3D engine.
// Source-of-truth assertions only — actually rendering Three.js requires a
// live browser, which we already smoke-tested via screenshots.
//
// Run with:  node tests/test_oa_sa_3d_drops.js
'use strict';
const fs = require('fs');
const SRC = fs.readFileSync(__dirname + '/../js/psy-3d-engine.js', 'utf-8');

let pass = 0, fail = 0;
const ok = (cond, msg) => { if (cond) { pass++; console.log('  PASS:', msg); } else { fail++; console.log('  FAIL:', msg); } };

console.log('-- Module-level _saReset hoisted (single source of truth) --');
ok(SRC.includes('function _saReset(t, rh, w)'), 'hoisted to module scope');
ok(SRC.includes('function computeSA(t,rh,w){ return _saReset(t,rh,w); }'),
   '2D render2DChart now delegates to _saReset (no math drift between 2D & 3D)');

console.log('-- New saDropGroup THREE.Group --');
ok(/var scene,cam,ren,orb,basePlane,pathGroup,projGroup,czGroup,dhFloorGroup,vavGroup,saDropGroup;/.test(SRC),
   'saDropGroup declared at scene-level');
ok(SRC.includes('saDropGroup=new THREE.Group();saDropGroup.visible=false;scene.add(saDropGroup);'),
   'saDropGroup created at scene init AND default-hidden');

console.log('-- Toggle wiring --');
ok(SRC.includes("saDrop:saDropGroup"), 'layer map entry');
ok(SRC.includes("['saDrop','#22d3ee','OA\\u2192SA Drops']"),
   'toggle entry with OA→SA Drops label + cyan color');
ok(SRC.includes("if (layers[t[0]] && layers[t[0]].visible === false) div.classList.add('p3off');"),
   'initial off-state mirrored to UI for hidden layers');

console.log('-- Cleared on weather-data refresh --');
ok(SRC.includes('if(saDropGroup) while(saDropGroup.children.length)saDropGroup.remove(saDropGroup.children[0]);'),
   'saDropGroup cleared at start of buildWeatherVis (no stale geometry)');

console.log('-- Drop math: same SA target as 2D, line per OA, dot per SA --');
ok(SRC.includes('var sa=_saReset(p.t,p.rh,p.w);'), 'each OA sample → SA via _saReset');
ok(SRC.includes('var oaX=t2sx(p.t), oaY=frac2sy(p.frac), oaZ=w2sz(p.w);'),
   'OA at world (t→X, frac→Y, w→Z)');
ok(SRC.includes('var saX=t2sx(sa.t), saZ=w2sz(sa.w);'),
   'SA at world (sa.t→X, Y=0, sa.w→Z) — Y=0 means "on the chart floor"');
ok(SRC.includes('saV.push(saX, 0.3, saZ);'),
   'SA dot positioned at Y=0.3 (just above floor for visibility)');
ok(SRC.includes('dV.push(oaX, oaY, oaZ, saX, 0, saZ);'),
   'drop line: 2 vertices per sample (OA at top, SA at floor)');
ok(SRC.includes('dC.push(c[0], c[1], c[2],   c[0]*0.35, c[1]*0.35, c[2]*0.35);'),
   'line vertex colors fade from full at top → 35% at floor (rain-on-floor visual)');

console.log('-- Cull no-action samples (zero-length drops) --');
ok(SRC.includes('if(Math.abs(sa.t-p.t)<0.5 && Math.abs(sa.w-p.w)<0.0003) return;'),
   'samples where SA == OA (no reset action) culled to keep floor legible');

console.log('-- Builds Points + LineSegments only when there are samples --');
ok(SRC.includes('if (saV.length){'),
   'guarded build (no empty BufferGeometry on empty weather data)');
ok(SRC.includes('saDropGroup.add(new THREE.Points(saGeo, new THREE.PointsMaterial'),
   'SA floor scatter as Points');
ok(SRC.includes('saDropGroup.add(new THREE.LineSegments(dropGeo, new THREE.LineBasicMaterial'),
   'drop lines as LineSegments (one segment per OA→SA pair)');

console.log('-- depthWrite:false for transparent layers --');
const sec = SRC.split('OA→SA "Rain-on-Floor"')[1] || '';
ok((sec.match(/depthWrite:false/g) || []).length >= 2,
   'both Points + LineSegments have depthWrite:false (no z-fighting with the floor chart)');

console.log(`\n${pass}/${pass+fail} tests passed`);
process.exit(fail ? 1 : 0);
