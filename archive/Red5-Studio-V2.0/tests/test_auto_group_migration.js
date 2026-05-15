/**
 * Auto-group migration regression test (Node.js, no dependencies).
 *
 * Verifies that migrateAutoGroups() inside js/schema-config.js correctly
 * converts legacy point lists (where points have no `group_id` and the
 * UI relied on a hard-coded match list) into the unified `sensor_groups`
 * + `group_id` model — and is idempotent on subsequent runs.
 *
 * Run:  node tests/test_auto_group_migration.js
 */
const fs = require('fs');

// schema-config.js is a browser-style script with top-level `const`,
// `let`, etc. — no module.exports.  Wrap it in a function that
// returns the names we care about.
const src = fs.readFileSync(__dirname + '/../js/schema-config.js', 'utf8');
const factory = new Function(src + '; return { sanitizeSchema, migrateAutoGroups, SEED_GROUPS };');
const { sanitizeSchema, migrateAutoGroups, SEED_GROUPS } = factory();

let pass = 0, fail = 0;
function t(name, ok, info = '') {
    if (ok) { pass++; console.log('PASS', name); }
    else    { fail++; console.log('FAIL', name, info ? '- ' + info : ''); }
}

// ---------- 1. SEED_GROUPS bound and non-empty ----------
t('1a. SEED_GROUPS is an array', Array.isArray(SEED_GROUPS));
t('1b. SEED_GROUPS has expected ids',
    ['OA','SA','Hydration','AHU','Static_Pressure'].every(id => SEED_GROUPS.find(g => g.id === id)));

// ---------- 2. Legacy schema with no sensor_groups ----------
const legacy = {
    ahu_types: {
        '1': { name: 'My AHU', points: [
            { label: 'OAT', name: 'OAT', x: 10, y: 20, unit: 'C' },
            { label: 'OAH', name: 'OAH', x: 11, y: 21 },
            { label: 'SAT', name: 'SAT', x: 30, y: 40 },
            { label: 'SAF', name: 'SAF', x: 31, y: 41 },
            { label: 'INV1_F', name: 'INV1 fan',  x: 32, y: 42 },   // matches /^INV\d+_F$/
            { label: 'AFPC', name: 'AFPC',  x: 50, y: 60 },          // not in any seed
            { label: 'FDPS', name: 'FDPS',  x: 51, y: 61 },
        ]},
    },
};
const out = sanitizeSchema(legacy);
const e = out.ahu_types['1'];

t('2a. sensor_groups[] created', Array.isArray(e.sensor_groups));
const ids = e.sensor_groups.map(g => g.id);
t('2b. OA group seeded',         ids.includes('OA'),  ids.join(','));
t('2c. SA group seeded',         ids.includes('SA'),  ids.join(','));
t('2d. Hydration group NOT seeded (no matching points)',
    !ids.includes('Hydration'), 'unexpected: ' + ids.join(','));

const byLabel = Object.fromEntries(e.points.map(p => [p.label, p]));
t('3a. OAT.group_id = OA',       byLabel.OAT.group_id === 'OA');
t('3b. OAH.group_id = OA',       byLabel.OAH.group_id === 'OA');
t('3c. SAT.group_id = SA',       byLabel.SAT.group_id === 'SA');
t('3d. SAF.group_id = SA',       byLabel.SAF.group_id === 'SA');
t('3e. INV1_F.group_id = SA (regex match)',
    byLabel.INV1_F.group_id === 'SA',  'got: ' + byLabel.INV1_F.group_id);
t('3f. AFPC.group_id = null (not in any seed)',
    byLabel.AFPC.group_id === null,    'got: ' + byLabel.AFPC.group_id);
t('3g. FDPS.group_id = null',
    byLabel.FDPS.group_id === null);

// ---------- 4. Idempotency: re-running on the migrated output is no-op ----------
const out2 = sanitizeSchema(JSON.parse(JSON.stringify(out)));
const e2 = out2.ahu_types['1'];
t('4a. sensor_groups[] length unchanged on re-run',
    e2.sensor_groups.length === e.sensor_groups.length,
    `before=${e.sensor_groups.length}, after=${e2.sensor_groups.length}`);
t('4b. group ids identical on re-run',
    JSON.stringify(e2.sensor_groups.map(g => g.id).sort())
      === JSON.stringify(e.sensor_groups.map(g => g.id).sort()));
t('4c. group_id values identical on re-run',
    e2.points.every((p, i) => p.group_id === e.points[i].group_id));

// ---------- 5. User-defined sensor_groups[] survive ----------
const withCustom = {
    ahu_types: {
        '1': {
            name: 'My AHU',
            sensor_groups: [
                { id: 'group_custom1', name: 'My custom group', collapsed: false },
            ],
            points: [
                { label: 'OAT', name: 'OAT', x: 10, y: 20 },
                { label: 'X1',  name: 'X1',  x: 30, y: 40, group_id: 'group_custom1' },
                { label: 'X2',  name: 'X2',  x: 31, y: 41, group_id: 'group_custom1' },
            ],
        },
    },
};
const outC = sanitizeSchema(withCustom);
const eC = outC.ahu_types['1'];
const idsC = eC.sensor_groups.map(g => g.id);
t('5a. custom group still present',  idsC.includes('group_custom1'));
t('5b. OA seeded for unmigrated OAT', idsC.includes('OA'));
t('5c. X1 still in custom group',     eC.points.find(p => p.label === 'X1').group_id === 'group_custom1');
t('5d. X2 still in custom group',     eC.points.find(p => p.label === 'X2').group_id === 'group_custom1');
t('5e. OAT migrated into OA',         eC.points.find(p => p.label === 'OAT').group_id === 'OA');

// ---------- 6. Already-migrated point with group_id set is NOT re-migrated ----------
const preMigrated = {
    ahu_types: {
        '1': {
            name: 'My AHU',
            sensor_groups: [{ id: 'manual_oa', name: 'Operator OA', collapsed: false }],
            points: [
                { label: 'OAT', name: 'OAT', x: 1, y: 2, group_id: 'manual_oa' },
                { label: 'OAH', name: 'OAH', x: 3, y: 4, group_id: 'manual_oa' },
            ],
        },
    },
};
const outP = sanitizeSchema(preMigrated);
const eP = outP.ahu_types['1'];
const idsP = eP.sensor_groups.map(g => g.id);
t('6a. operator OA group preserved',     idsP.includes('manual_oa'));
t('6b. OAT stays in manual_oa (NOT in OA seed)',
    eP.points.find(p => p.label === 'OAT').group_id === 'manual_oa');
t('6c. SEED OA group NOT created (no orphan OAT points)',
    !idsP.includes('OA'), 'ids=' + idsP.join(','));

// ---------- 7. Empty/missing schema = no crash ----------
t('7a. {} survives sanitizeSchema', sanitizeSchema({}) && true);
t('7b. {ahu_types:{}} survives',    sanitizeSchema({ ahu_types: {} }) && true);
t('7c. type with no points',
    Object.keys(sanitizeSchema({ ahu_types: { '1': { name: 'X', points: [] } } })
        .ahu_types['1'].sensor_groups || []).length === 0);

console.log();
console.log(`PASSED: ${pass}  FAILED: ${fail}`);
if (fail) process.exit(1);
