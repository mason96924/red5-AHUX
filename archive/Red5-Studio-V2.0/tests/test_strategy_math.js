/* Pure-math regression tests for the Monthly × Sites strategy loop.
   Run via:  node tests/test_strategy_math.js
   These are JS-only, no DOM, so the controller's stripped Node env can run
   them.  They exist so future refactors can't silently re-collapse
   bandDyn≡dyn or revert Opt-SA back to the L2-optimal mean(h_oa).      */
'use strict';

function enthalpy(T, W) { return 1.006*T + W*(2501 + 1.86*T); }

function runLoop({oaT, W, bandFn, h_sa_u, optMin, optMax, TR_DH=4}) {
  const hOa = oaT.map(T => enthalpy(T, W));
  let rollSum = 0; const win = 4;
  let dyn=0, bandDyn=0, opt=0, base=0, band=0;
  for (let i=0;i<hOa.length;i++) {
    rollSum += hOa[i];
    if (i>=win) rollSum -= hOa[i-win];
    const h_sa_dyn_raw = rollSum / Math.min(i+1, win);
    // Same envelope clamp the engine applies — guarantees Opt-SA is the floor.
    const h_sa_dyn = Math.max(optMin, Math.min(optMax, h_sa_dyn_raw));
    const b = bandFn(oaT[i]);
    const h_sa_b = enthalpy(b.sa_t, W);
    const h_sa_bd = Math.max(h_sa_b - TR_DH, Math.min(h_sa_b + TR_DH, h_sa_dyn));
    const h_sa_opt = Math.max(optMin, Math.min(optMax, hOa[i]));
    const damp = b.oa_damper/100;
    base    += Math.abs(damp*(hOa[i] - h_sa_u));
    dyn     += Math.abs(damp*(hOa[i] - h_sa_dyn));
    band    += Math.abs(damp*(hOa[i] - h_sa_b));
    bandDyn += Math.abs(damp*(hOa[i] - h_sa_bd));
    opt     += Math.abs(damp*(hOa[i] - h_sa_opt));
  }
  return {base, dyn, band, bandDyn, opt};
}

function bandHotDay(T) {
  if (T < 18)      return {sa_t:13, oa_damper:60};
  else if (T < 28) return {sa_t:14, oa_damper:40};
  else             return {sa_t:15, oa_damper:20};
}

let pass = 0, fail = 0;
function assert(cond, msg) {
  if (cond) { pass++; console.log('  PASS:', msg); }
  else      { fail++; console.error('  FAIL:', msg); }
}

console.log('Test: bandDyn must differ from dyn during a heat wave');
{
  const r = runLoop({
    oaT: [22,24,26,28,30,32,34,36],
    W: 0.008,
    bandFn: bandHotDay,
    h_sa_u: enthalpy(13, 0.008),
    optMin: 25, optMax: 50,
  });
  assert(Math.abs(r.bandDyn - r.dyn) > 1, 'bandDyn ≠ dyn (got bandDyn='+r.bandDyn.toFixed(2)+', dyn='+r.dyn.toFixed(2)+')');
  assert(r.opt < r.dyn,   'Opt-SA < Dyn-Reset (true floor)');
  assert(r.opt < r.band,  'Opt-SA < B1-B10');
  assert(r.opt < r.base,  'Opt-SA < Fixed-SA');
}

console.log('\nTest: clamp range respected for Opt-SA');
{
  // Cold day with all OA enthalpies BELOW the comfort floor → Opt-SA must
  // condition them up to the floor.  Use a Fixed-SA setpoint inside the
  // envelope (h_sa_u ≈ 30 kJ/kg ≈ 13 °C @ 70 % RH) so the Opt-SA-vs-Fixed
  // comparison is apples-to-apples (both inside or above the comfort
  // envelope).  If the operator picked a Fixed-SA outside the envelope
  // (e.g. 13 °C dry, 20 kJ/kg) Fixed-SA could legitimately undercut
  // Opt-SA in raw energy — but it would also be outside human comfort.
  const coldOa = [-5,-4,-3,-2,-1,0,1,2];
  const r = runLoop({
    oaT: coldOa,
    W: 0.003,
    bandFn: () => ({sa_t:13, oa_damper:30}),
    h_sa_u: 30,  // pretend the operator picked a comfortable ~22 °C @ 50 %RH
    optMin: 25, optMax: 50,
  });
  assert(r.opt > 0, 'Opt-SA energy > 0 when all OA below comfort floor');
  assert(r.opt < r.base, 'Opt-SA < Fixed-SA when Fixed-SA inside envelope');
}

console.log('\nTest: when OA sits inside [optMin,optMax] envelope, Opt-SA → 0');
{
  // Mild day all OA-h between 30 and 45 kJ/kg, all inside [25,50].
  const oaT = [12,13,14,15,16,17,18,19];
  const r = runLoop({
    oaT,
    W: 0.008,
    bandFn: () => ({sa_t:14, oa_damper:50}),
    h_sa_u: enthalpy(20, 0.008),
    optMin: 25, optMax: 50,
  });
  assert(r.opt < 0.001, 'Opt-SA energy ≈ 0 when OA fully within envelope (got '+r.opt.toFixed(4)+')');
}

console.log('\nTest: Opt-SA must remain the floor in EXTREME climates (Seoul-style)');
{
  // Seoul-style: deep winter h_oa down to ~0 kJ/kg, hot summer up to ~80 kJ/kg.
  // Without clamping the rolling-mean Dyn-Reset target, Dyn would undercut
  // Opt-SA because rm tracks h_oa closely on long windows.  With the
  // envelope clamp on Dyn, Opt-SA must remain ≤ Dyn pointwise.
  const oaT = [];
  for (let h=0; h<200; h++) {
    // Temperature ramp -10 → 35 over the dataset (sinusoidal-ish).
    oaT.push(-10 + 45 * Math.sin(h/200 * Math.PI));
  }
  const r = runLoop({
    oaT,
    W: 0.005,
    bandFn: () => ({sa_t:14, oa_damper:50}),
    h_sa_u: enthalpy(13, 0.005),
    optMin: 25, optMax: 50,
  });
  console.log('  Seoul-style totals: opt='+r.opt.toFixed(0)+'  dyn='+r.dyn.toFixed(0)+'  bandDyn='+r.bandDyn.toFixed(0)+'  band='+r.band.toFixed(0)+'  base='+r.base.toFixed(0));
  assert(r.opt <= r.dyn,     'Opt-SA ≤ Dyn-Rst even in extreme climate');
  assert(r.opt <= r.bandDyn, 'Opt-SA ≤ B1-B10+Dyn even in extreme climate');
  assert(r.opt <= r.band,    'Opt-SA ≤ B1-B10 even in extreme climate');
}

console.log('\n----------------------------------------------');
console.log(' '+pass+' passed, '+fail+' failed');
console.log('----------------------------------------------');
process.exit(fail ? 1 : 0);
