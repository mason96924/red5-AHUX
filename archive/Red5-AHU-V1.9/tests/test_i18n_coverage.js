/**
 * Test the i18n dictionary covers all 5 languages for every key referenced
 * in dashboard.html and dashboard-components.js, and that lookups round-trip.
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

// Load i18n.js source and extract the dictionary D.
const i18nSrc = fs.readFileSync(path.join(ROOT, 'js/i18n.js'), 'utf-8');

// Find every key referenced in the wired DOM files.
function extractKeys(file) {
    const s = fs.readFileSync(path.join(ROOT, file), 'utf-8');
    const re = /(?:window\.t|^\s*t)\(['"]([a-z][a-z0-9_]+)['"]\s*[,)]/gi;
    const re2 = /(?:window\.t|^\s*t)\(['"]([a-z][a-z0-9_]+)['"]\)/gi;
    const keys = new Set();
    let m;
    while ((m = re.exec(s))  !== null) keys.add(m[1]);
    while ((m = re2.exec(s)) !== null) keys.add(m[1]);
    return keys;
}
const dashKeys = extractKeys('dashboard.html');
const compKeys = extractKeys('js/dashboard-components.js');
const allUsed  = new Set([...dashKeys, ...compKeys]);

// Run i18n.js in a tiny sandbox to grab D.
const vm = require('vm');
const sandbox = {
    window: {},
    React: { useState: () => [null, () => {}], useEffect: () => {}, useRef: () => ({}), createElement: () => null },
    document: { documentElement: {}, addEventListener: () => {} },
    localStorage: { getItem: () => null, setItem: () => {} },
    Event: class { constructor(name) { this.name = name; } }
};
sandbox.window.dispatchEvent = () => {};
sandbox.window.addEventListener = () => {};
vm.createContext(sandbox);
vm.runInContext(i18nSrc, sandbox);
const t = sandbox.window.t;
const setLang = sandbox.window.setLang;

let pass = 0, fail = 0;
function check(name, ok, info) {
    if (ok) { pass++; console.log('PASS', name); }
    else    { fail++; console.log('FAIL', name, info || ''); }
}

// 1. Every key used in the DOM must resolve in English.
let missing = [];
allUsed.forEach(k => {
    setLang('en');
    const v = t(k);
    if (v === k) missing.push(k);
});
check('1a. all used keys resolve in EN', missing.length === 0, missing.join(', '));

// 2. Every key must have a non-empty value in all 5 languages.
const LANGS = ['en','zh-CN','zh-TW','ja','ko'];
let langMissing = [];
allUsed.forEach(k => {
    LANGS.forEach(lc => {
        setLang(lc);
        const v = t(k);
        if (!v || v === k) langMissing.push(`${k}/${lc}`);
    });
});
check('1b. all keys covered in all 5 languages', langMissing.length === 0, langMissing.slice(0, 5).join(', '));

// 3. Round-trip: same key returns different values for different languages
//    for at least one non-trivial key (proves langs are actually wired).
setLang('en');     const en_dash = t('dashboard');
setLang('zh-CN');  const cn_dash = t('dashboard');
setLang('ja');     const ja_dash = t('dashboard');
setLang('ko');     const ko_dash = t('dashboard');
check('2a. dashboard differs en/zh-CN', en_dash !== cn_dash);
check('2b. dashboard differs en/ja',    en_dash !== ja_dash);
check('2c. dashboard differs en/ko',    en_dash !== ko_dash);

// 4. Test new BACnet diag keys we'd add later — only test core newly-added DOM keys.
const newKeysSample = [
    'mechanical_cooling', 'mass_cooling', 'reload_now', 'real_time_diag_hub',
    'yearly_weather_dist', 'reset_zoom', 'collector_configuration',
    'no_vavs_assigned', 'add_new_ahu_group', 'react_crash_prevented',
    'evaporative',
];
newKeysSample.forEach(k => {
    setLang('en'); const en_v = t(k);
    setLang('ko'); const ko_v = t(k);
    setLang('ja'); const ja_v = t(k);
    setLang('zh-CN'); const cn_v = t(k);
    setLang('zh-TW'); const tw_v = t(k);
    check(`3.${k}: all 5 lang values present`,
          en_v && ko_v && ja_v && cn_v && tw_v
          && en_v !== k && ko_v !== k && ja_v !== k && cn_v !== k && tw_v !== k,
          `en=${en_v} ko=${ko_v} ja=${ja_v} cn=${cn_v} tw=${tw_v}`);
});

console.log('\nSUMMARY:', pass, 'passed,', fail, 'failed');
console.log('Total keys used in DOM:', allUsed.size);
process.exit(fail ? 1 : 0);
