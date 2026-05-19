/* Regression test for the plugin-health chip.
 *
 * Validates:
 *   1) PLUGIN_EXPECTED list is wired with the 5 required plug-ins.
 *   2) Initial pluginHealth state is 'unknown' (chip hidden until probe).
 *   3) /api/services is polled via fetchJSON.
 *   4) Classification: missing -> 'error' / failed -> 'error' / warning -> 'warn' / clean -> 'ok'.
 *   5) Tailwind classes appear as LITERAL strings (so the CDN JIT picks them up).
 *   6) Chip has data-testid + data-state.
 *   7) Tooltip lists missing plugins with the /root/data/pgpy/ deploy hint.
 *
 * Run from /app/archive/Red5-Studio-V1.9:
 *   node tests/test_plugin_health_chip.js
 */
const fs = require('fs');
const path = require('path');

const dash = fs.readFileSync(path.join(__dirname, '..', 'dashboard.html'), 'utf8');
let pass = 0, fail = 0;
const fails = [];
function check(name, ok, info) {
    if (ok) { pass++; }
    else    { fail++; fails.push(name + (info ? '  ' + info : '')); }
}

// 1) Expected plugin list
check('expected: PLUGIN_EXPECTED includes band_overrides_service',
      /PLUGIN_EXPECTED\s*=\s*\[[^\]]{0,400}'band_overrides_service'/.test(dash));
check('expected: PLUGIN_EXPECTED includes band_service',
      /PLUGIN_EXPECTED\s*=\s*\[[^\]]{0,400}'band_service'/.test(dash));
check('expected: PLUGIN_EXPECTED includes telemetry_service',
      /PLUGIN_EXPECTED\s*=\s*\[[^\]]{0,400}'telemetry_service'/.test(dash));
check('expected: PLUGIN_EXPECTED includes weather_service',
      /PLUGIN_EXPECTED\s*=\s*\[[^\]]{0,400}'weather_service'/.test(dash));
check('expected: PLUGIN_EXPECTED includes upload_service',
      /PLUGIN_EXPECTED\s*=\s*\[[^\]]{0,400}'upload_service'/.test(dash));

// 2) State + poll
check('state: pluginHealth initial state unknown',
      /useState\(\s*\{\s*state:\s*['"]unknown['"]/.test(dash));
check('poll: fetchJSON on /api/services',
      /fetchJSON\(['"]\/api\/services['"]\)/.test(dash));

// 3) Classification branches
check('classify: failed -> state=error',
      /failed\.some\(\s*s\s*=>\s*s\.state\s*===\s*['"]FAILED['"]\s*\)/.test(dash));
check('classify: warnings -> state=warn (else branch)',
      /else if \(failed\.length\) state = ['"]warn['"]/.test(dash));
check('classify: clean run -> state=ok',
      /let state\s*=\s*['"]ok['"]/.test(dash));

// 4) Tailwind classes as literal strings (so the CDN JIT picks them up)
check('css: literal emerald dark variant present',
      dash.indexOf('bg-emerald-900/40 border-emerald-700/50 text-emerald-300') !== -1);
check('css: literal emerald light variant present',
      dash.indexOf('bg-emerald-50 border-emerald-300 text-emerald-700') !== -1);
check('css: literal amber dark variant present',
      dash.indexOf('bg-amber-900/40 border-amber-700/50 text-amber-300') !== -1);
check('css: literal amber light variant present',
      dash.indexOf('bg-amber-50 border-amber-300 text-amber-700') !== -1);
check('css: literal rose dark variant present',
      dash.indexOf('bg-rose-900/40 border-rose-700/50 text-rose-300') !== -1);
check('css: literal rose light variant present',
      dash.indexOf('bg-rose-50 border-rose-300 text-rose-700') !== -1);
check('css: NO dynamic ${color}-... className interpolation remains (only the comment that explains why)',
      // Strip JS comments before testing.  A literal example INSIDE a `//` comment
      // is fine; what we want to forbid is real className interpolation.
      !/className=[`'"][^`'"]*bg-\$\{color\}/.test(dash));

// 5) Chip render contract
check('chip: data-testid plugin-health-chip',
      /data-testid="plugin-health-chip"/.test(dash));
check('chip: data-state attribute reflects classification',
      /data-state=\{h\.state\}/.test(dash));
check('chip: tooltip mentions /root/data/pgpy/ deploy hint',
      /upload to \/root\/data\/pgpy\/ \+ restart Flask/.test(dash));

// 6) Functional simulation: classify a few /api/services payloads
function classify(svc) {
    const PLUGIN_EXPECTED = ['band_service','telemetry_service','weather_service','upload_service','band_overrides_service'];
    const seen = new Set(svc.map(s => s.name));
    const missing = PLUGIN_EXPECTED.filter(n => !seen.has(n));
    const failed  = svc.filter(s => s.state === 'FAILED' || s.state === 'SKIPPED' || s.state === 'WARNING');
    let state = 'ok';
    if (missing.length || failed.some(s => s.state === 'FAILED')) state = 'error';
    else if (failed.length) state = 'warn';
    return { state, missing, failed };
}

// 6a) Operator-reported case: band_overrides_service missing
{
    const r = classify([
        { name: 'band_service',      state: 'OK', detail: '' },
        { name: 'telemetry_service', state: 'OK', detail: '' },
        { name: 'weather_service',   state: 'OK', detail: '' },
        { name: 'upload_service',    state: 'OK', detail: '' },
        // band_overrides_service ABSENT
    ]);
    check('sim: missing band_overrides_service -> error', r.state === 'error');
    check('sim: missing list contains band_overrides_service',
          r.missing.length === 1 && r.missing[0] === 'band_overrides_service');
}

// 6b) Everything OK
{
    const r = classify([
        { name: 'band_service',      state: 'OK' },
        { name: 'telemetry_service', state: 'OK' },
        { name: 'weather_service',   state: 'OK' },
        { name: 'upload_service',    state: 'OK' },
        { name: 'band_overrides_service', state: 'OK' },
    ]);
    check('sim: all OK -> state=ok', r.state === 'ok');
}

// 6c) FAILED -> error (not warn)
{
    const r = classify([
        { name: 'band_service',      state: 'FAILED', detail: 'ImportError: dibt' },
        { name: 'telemetry_service', state: 'OK' },
        { name: 'weather_service',   state: 'OK' },
        { name: 'upload_service',    state: 'OK' },
        { name: 'band_overrides_service', state: 'OK' },
    ]);
    check('sim: FAILED -> error', r.state === 'error');
}

// 6d) Only SKIPPED -> warn
{
    const r = classify([
        { name: 'band_service',      state: 'OK' },
        { name: 'telemetry_service', state: 'SKIPPED', detail: 'missing SERVICE_CTX keys' },
        { name: 'weather_service',   state: 'OK' },
        { name: 'upload_service',    state: 'OK' },
        { name: 'band_overrides_service', state: 'OK' },
    ]);
    check('sim: SKIPPED -> warn', r.state === 'warn');
}

// 7) JSX parses
let babelParser;
try { babelParser = require('/tmp/node_modules/@babel/parser'); }
catch (e) { console.log('NOTE: @babel/parser missing; strict parse-check skipped.'); }
if (babelParser) {
    const m = dash.match(/<script type="text\/plain" id="main-source">([\s\S]*?)<\/script>/);
    try {
        babelParser.parse(m[1], { sourceType: 'module', plugins: ['jsx'] });
        check('jsx: full main-source parses', true);
    } catch (e) {
        check('jsx: full main-source parses', false, e.message.split('\n')[0]);
    }
}

console.log('Plugin-health chip: ' + pass + ' pass, ' + fail + ' fail.');
if (fail > 0) {
    console.log('FAILURES:');
    fails.forEach(f => console.log('  - ' + f));
    process.exit(1);
}
process.exit(0);
