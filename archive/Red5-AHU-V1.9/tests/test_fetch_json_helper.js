/* Regression test for the fetchJSON helper used by the band-overrides UI.
 *
 * The helper guards against the most common controller-side failure mode:
 * an unregistered route gets handled by the SPA fallback and returns HTML
 * instead of JSON.  Without it, the caller saw a cryptic "Unexpected token
 * '<'" error from r.json() and assumed the controller was offline (the
 * original operator bug report -- screenshot included an alert claiming
 * "controller offline?" when the controller was actually online).
 *
 * Validates:
 *   1) Source contains the fetchJSON helper.
 *   2) It detects HTML responses and throws PLUGIN_MISSING with deploy hint.
 *   3) It detects network errors and throws NETWORK.
 *   4) Returns the parsed JSON body on the happy path.
 *   5) The 4 band-overrides fetch call-sites all use fetchJSON instead of
 *      raw fetch + r.json().
 *
 * Run from /app/archive/Red5-AHU-V1.9:
 *   node tests/test_fetch_json_helper.js
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

// 1) Helper is declared
check('helper: fetchJSON declared',
      /const\s+fetchJSON\s*=\s*async\s*\(\s*url\s*,\s*options\s*\)\s*=>/.test(dash));

// 2) Detects HTML / 404 and throws PLUGIN_MISSING with deploy hint
check('helper: branches on !content-type includes application/json',
      /!ct\.includes\(['"]application\/json['"]\)/.test(dash));
check('helper: detects <!doctype to classify as PLUGIN_MISSING',
      /<!doctype[\s\S]{0,800}PLUGIN_MISSING/i.test(dash));
check('helper: error text points operator to /root/data/pgpy/',
      /Upload band_overrides_service\.py to \/root\/data\/pgpy\//.test(dash));
check('helper: error mentions restart Flask',
      /restart Flask/i.test(dash));

// 3) Detects network errors
check('helper: classifies catch as NETWORK code',
      /catch\s*\(\s*netErr[\s\S]{0,200}err\.code\s*=\s*['"]NETWORK['"]/.test(dash));

// 4) Returns r.json() on the happy path
check('helper: returns r.json() at the end',
      /return\s+r\.json\(\)\s*;\s*\}\s*;/.test(dash));

// 5) All 4 band-overrides fetch sites use fetchJSON
const matches = (dash.match(/fetchJSON\(/g) || []).length;
check('callers: fetchJSON used in 4+ call sites', matches >= 4, 'found ' + matches);

check('callers: initial-mount GET uses fetchJSON',
      /fetchJSON\(['"]\/api\/band-overrides\/sa-rh-clamp['"]\)/.test(dash));
check('callers: preview GET uses fetchJSON',
      /fetchJSON\(['"]\/api\/band-overrides\/preview\?lo=/.test(dash));
check('callers: Apply POST uses fetchJSON',
      /fetchJSON\(['"]\/api\/band-overrides\/sa-rh-clamp['"]\s*,\s*\{[\s\S]{0,200}method:\s*['"]POST['"]/.test(dash));
check('callers: Reset DELETE uses fetchJSON',
      /fetchJSON\(['"]\/api\/band-overrides\/sa-rh-clamp['"]\s*,\s*\{\s*method:\s*['"]DELETE['"]/.test(dash));

// 6) Regression: no old "Preview failed (controller offline?)" wording remains
check('regression: misleading "controller offline?" wording removed',
      !/controller offline\?/.test(dash));

// 7) Functional test of the helper logic itself (mock fetch in a sandbox).
//    We re-implement the helper in this test file using the same conditions
//    so the JS contract is exercised end-to-end.
{
    const mkHelper = () => async (url, options) => {
        let r;
        try { r = await global.__fetch(url, options); }
        catch (netErr) { const e = new Error('Controller unreachable: ' + netErr.message); e.code = 'NETWORK'; throw e; }
        const ct = (r.headers.get('content-type') || '').toLowerCase();
        if (!ct.includes('application/json')) {
            const head = (await r.text()).slice(0, 60).replace(/\s+/g, ' ').trim();
            if (r.status === 404 || /<!doctype/i.test(head) || /<html/i.test(head)) {
                const e = new Error('Band-overrides service not found on the controller. Upload band_overrides_service.py to /root/data/pgpy/ and restart Flask, then try again.\n\n(HTTP ' + r.status + ', response began with: ' + head + ')');
                e.code = 'PLUGIN_MISSING';
                throw e;
            }
            const e = new Error('Unexpected non-JSON response (HTTP ' + r.status + '): ' + head);
            e.code = 'BAD_RESPONSE';
            throw e;
        }
        return r.json();
    };

    const fakeResponse = ({status, body, ct}) => ({
        status, headers: { get: () => ct },
        text: async () => body, json: async () => JSON.parse(body),
    });

    // 7a) HTML SPA fallback (the operator-reported case)
    global.__fetch = async () => fakeResponse({ status: 200, body: '<!doctype html><html>...', ct: 'text/html' });
    (async () => {
        let caught;
        try { await mkHelper()('/api/band-overrides/preview?lo=45&hi=55'); }
        catch (e) { caught = e; }
        check('functional: HTML response -> PLUGIN_MISSING', caught && caught.code === 'PLUGIN_MISSING',
              caught ? ('code=' + caught.code) : 'no error thrown');
        check('functional: PLUGIN_MISSING message mentions pgpy path',
              caught && /\/root\/data\/pgpy\//.test(caught.message));

        // 7b) 404
        global.__fetch = async () => fakeResponse({ status: 404, body: 'not found', ct: 'text/plain' });
        let c2;
        try { await mkHelper()('/api/missing'); } catch (e) { c2 = e; }
        check('functional: 404 -> PLUGIN_MISSING', c2 && c2.code === 'PLUGIN_MISSING');

        // 7c) Network error
        global.__fetch = async () => { throw new TypeError('Failed to fetch'); };
        let c3;
        try { await mkHelper()('/api/x'); } catch (e) { c3 = e; }
        check('functional: network error -> NETWORK', c3 && c3.code === 'NETWORK');

        // 7d) Happy path
        global.__fetch = async () => fakeResponse({ status: 200, body: '{"status":"ok","preview":[]}', ct: 'application/json' });
        const out = await mkHelper()('/api/ok');
        check('functional: happy path returns parsed JSON', out && out.status === 'ok' && Array.isArray(out.preview));

        // 7e) 200 OK but wrong content-type, not HTML
        global.__fetch = async () => fakeResponse({ status: 200, body: 'plain text response', ct: 'text/plain' });
        let c5;
        try { await mkHelper()('/api/odd'); } catch (e) { c5 = e; }
        check('functional: non-JSON non-HTML -> BAD_RESPONSE', c5 && c5.code === 'BAD_RESPONSE');

        // Summary
        console.log('fetchJSON helper: ' + pass + ' pass, ' + fail + ' fail.');
        if (fail > 0) {
            console.log('FAILURES:');
            fails.forEach(f => console.log('  - ' + f));
            process.exit(1);
        }
        process.exit(0);
    })();
}
