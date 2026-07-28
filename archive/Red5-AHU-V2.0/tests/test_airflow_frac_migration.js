// test_airflow_frac_migration.js
// Verifies the canonical-Frac coordinate model for air_flow_path segments.
// Run with:  node tests/test_airflow_frac_migration.js
'use strict';

let pass = 0, fail = 0;
const ok = (cond, msg) => { if (cond) { pass++; console.log('  PASS:', msg); } else { fail++; console.log('  FAIL:', msg); } };
const approx = (a, b, eps=1e-6) => Math.abs(a - b) < eps;

// ---- mirrored math from PreviewAirFlowSimulator (preview-components.js) ----
function resolveSegPx(seg, containerW, naturalW) {
  const legacyScale = (containerW && naturalW) ? (containerW / naturalW) : 1;
  const fx = (seg.offsetXFrac != null && containerW != null) ? (seg.offsetXFrac * containerW) : ((seg.offsetX || 0) * legacyScale);
  const fy = (seg.offsetYFrac != null && containerW != null) ? (seg.offsetYFrac * containerW) : ((seg.offsetY || 0) * legacyScale);
  return { x: fx, y: fy };
}

// ---- mirrored drag-handler math from equipment_mapper.html move-segment ----
// rect.width is the on-screen image width INCLUDING view.scale.
function dragDeltaToFrac(dxScreen, dyScreen, rectWidth) {
  return { dxFrac: rectWidth > 0 ? dxScreen / rectWidth : 0, dyFrac: rectWidth > 0 ? dyScreen / rectWidth : 0 };
}

console.log('-- Frac canonical render path --');
{
  // Image displayed at its natural size (1500 x 800), seg at 0.2 of width right & 0.5 down.
  const seg = { offsetXFrac: 0.2, offsetYFrac: 0.5 };
  const px = resolveSegPx(seg, 1500, 1500);
  ok(approx(px.x, 300), '0.2 frac × 1500 W = 300 px x');
  ok(approx(px.y, 750), '0.5 frac × 1500 W = 750 px y');
}
{
  // Same seg, image shrunk to half size.
  const seg = { offsetXFrac: 0.2, offsetYFrac: 0.5 };
  const px = resolveSegPx(seg, 750, 1500);
  ok(approx(px.x, 150), 'when display halves, x px also halves');
  ok(approx(px.y, 375), 'when display halves, y px also halves');
}

console.log('-- Legacy fallback (no Frac fields) --');
{
  // Old config: offsetX=480 px, offsetY=200 px, calibrated against natural size 1600.
  // Image now displayed at 800 (half size). Renderer should auto-scale by 800/1600=0.5.
  const seg = { offsetX: 480, offsetY: 200 };
  const px = resolveSegPx(seg, 800, 1600);
  ok(approx(px.x, 240), 'legacy 480 px × (800/1600) = 240 px');
  ok(approx(px.y, 100), 'legacy 200 px × (800/1600) = 100 px');
}
{
  // Legacy with no naturalW supplied → no scaling (pre-migration behaviour).
  const seg = { offsetX: 480, offsetY: 200 };
  const px = resolveSegPx(seg, null, null);
  ok(approx(px.x, 480), 'legacy with no containerW falls through to raw px (480)');
  ok(approx(px.y, 200), 'legacy with no containerW falls through to raw px (200)');
}

console.log('-- Frac wins when both are present --');
{
  // Migrated config has both fields. Frac is canonical → must win.
  const seg = { offsetX: 999, offsetY: 999, offsetXFrac: 0.1, offsetYFrac: 0.2 };
  const px = resolveSegPx(seg, 1000, 1000);
  ok(approx(px.x, 100), 'with both fields, Frac (0.1) wins over legacy (999)');
  ok(approx(px.y, 200), 'with both fields, Frac (0.2) wins over legacy (999)');
}

console.log('-- Drag delta → frac conversion --');
{
  // Image displayed at 1000 px wide, view.scale=1 → rect.width=1000.
  // User drags 200 px right, 100 px down.
  const { dxFrac, dyFrac } = dragDeltaToFrac(200, 100, 1000);
  ok(approx(dxFrac, 0.2), '200/1000 = 0.2 dxFrac');
  ok(approx(dyFrac, 0.1), '100/1000 = 0.1 dyFrac');
}
{
  // With view.scale=2, rect.width=2000 (image rendered 2x larger on screen).
  // Same seg drag of 200 px on screen represents only 0.1 of the image width.
  const { dxFrac } = dragDeltaToFrac(200, 0, 2000);
  ok(approx(dxFrac, 0.1), 'drag 200 px at view.scale=2 (rect.width=2000) → 0.1 dxFrac');
}

console.log('-- Cross-host alignment guarantee --');
{
  // The whole point of the migration: same data, different display sizes,
  // segments still land at the same image-feature-relative position.
  const seg = { offsetXFrac: 0.45, offsetYFrac: 0.3 };
  const config = resolveSegPx(seg, 1200, 2000);   // config tool at 1200 wide
  const dash   = resolveSegPx(seg, 1800, 2000);   // dashboard at 1800 wide
  ok(approx(config.x / 1200, dash.x / 1800), 'x as fraction-of-display equal across hosts');
  ok(approx(config.y / 1200, dash.y / 1800), 'y as fraction-of-display equal across hosts');
}

console.log('-- Round-trip: drag → save Frac → reload → render --');
{
  // User drags seg from offsetXFrac 0.0 by 360 px on screen on a 1200-wide display.
  const initFrac = 0.0;
  const dxScreen = 360;
  const rectW = 1200;
  const newFrac = initFrac + dragDeltaToFrac(dxScreen, 0, rectW).dxFrac;
  ok(approx(newFrac, 0.3), '0.0 + 360/1200 = 0.3 saved');
  // Reload on dashboard at 1800 wide:
  const px = resolveSegPx({ offsetXFrac: newFrac }, 1800, 2000);
  ok(approx(px.x, 540), '0.3 × 1800 = 540 px on dashboard (lands at same image feature)');
}

console.log(`\n${pass}/${pass+fail} tests passed`);
process.exit(fail ? 1 : 0);
