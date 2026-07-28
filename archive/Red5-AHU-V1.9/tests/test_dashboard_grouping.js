/**
 * Test the dashboard's new groupedPoints co-location logic.
 *
 * Scenario A: All SA-family points share the same x/y (default schema).
 *             Expected: they merge into one SA group at that location.
 *
 * Scenario B: User drags SAFM to a different location near the fan.
 *             Expected: SAFM becomes a STANDALONE pill at its own x/y;
 *             the rest of the SA-family points remain merged into the SA
 *             group at their shared location.
 *
 * Scenario C: A point label matches a group but its parent group's first
 *             candidate has no x/y at all → that group is skipped.
 *             The point itself falls through to PHASE 2 as standalone.
 */

const SENSOR_GROUPS = [
    { id: 'OA', defaultName: 'OA', match: ['OAT','OAH','OAD'] },
    { id: 'SA', defaultName: 'SA', match: ['SAT','SAH','SAF','SAD','SAFM','SAPT','SATSP'], matchRegex: /^INV\d+_F$/ },
    { id: 'Hydration', defaultName: 'Hydration', match: ['HM','HV','HSP'] },
    { id: 'AHU', defaultName: 'AHU', match: ['AHUSS','AHUM','HCM'] },
    { id: 'Static_Pressure', defaultName: 'Static Pressure', match: ['SPR','SPRSP'] }
];

function buildGroupedPoints(schemaPoints) {
    const groupedPoints = [];
    const processed = new Set();
    const POS_EPS = 0.5;
    SENSOR_GROUPS.forEach(g => {
        const candidates = [];
        schemaPoints.forEach((p, i) => {
            if (processed.has(i)) return;
            if (g.match.includes(p.label) || (g.matchRegex && g.matchRegex.test(p.label))) {
                candidates.push(i);
            }
        });
        if (candidates.length === 0) return;
        const anchor = schemaPoints[candidates[0]];
        const groupIndices = candidates.filter(i => {
            const p = schemaPoints[i];
            return p.x != null && p.y != null
                && anchor.x != null && anchor.y != null
                && Math.abs(p.x - anchor.x) < POS_EPS
                && Math.abs(p.y - anchor.y) < POS_EPS;
        });
        if (groupIndices.length === 0) return;
        groupIndices.forEach(i => processed.add(i));
        const firstPt = schemaPoints[groupIndices[0]];
        groupedPoints.push({
            isGroup: true, groupId: g.id, defaultName: g.defaultName,
            indices: groupIndices, points: groupIndices.map(i => schemaPoints[i]),
            x: firstPt.x, y: firstPt.y,
        });
    });
    schemaPoints.forEach((p, i) => {
        if (!processed.has(i)) {
            groupedPoints.push({
                isGroup: false, groupId: p.label, defaultName: p.label,
                indices: [i], points: [p], x: p.x, y: p.y,
            });
        }
    });
    return groupedPoints;
}

let pass = 0, fail = 0;
function eq(name, got, want) {
    const ok = JSON.stringify(got) === JSON.stringify(want);
    if (ok) { pass++; console.log('PASS', name); }
    else    { fail++; console.log('FAIL', name, '\n   got: ', got, '\n   want:', want); }
}
function truthy(name, v, info) {
    if (v) { pass++; console.log('PASS', name); }
    else   { fail++; console.log('FAIL', name, info || ''); }
}

// ---------- A: default schema (everything co-located) ----------
{
    const pts = [
        { label: 'SAT',  x: 12.2, y: 79.9 },
        { label: 'SAH',  x: 12.2, y: 79.9 },
        { label: 'SAF',  x: 12.2, y: 79.9 },
        { label: 'SAFM', x: 12.2, y: 79.9 },
        { label: 'SATSP',x: 12.2, y: 79.9 },
        { label: 'INV1_F', x: 12.2, y: 79.9 },
    ];
    const g = buildGroupedPoints(pts);
    eq('A1. one SA group rendered', g.length, 1);
    truthy('A2. SA group has all 6 members',
           g[0].indices.length === 6 && g[0].groupId === 'SA',
           JSON.stringify(g[0]));
    eq('A3. SA group anchor at SAT location', [g[0].x, g[0].y], [12.2, 79.9]);
}

// ---------- B: user moved SAFM near the fan ----------
{
    const pts = [
        { label: 'SAT',  x: 12.2, y: 79.9 },
        { label: 'SAH',  x: 12.2, y: 79.9 },
        { label: 'SAF',  x: 12.2, y: 79.9 },
        { label: 'SAFM', x: 70.5, y: 35.0 },   // <-- moved near fan
        { label: 'SATSP',x: 12.2, y: 79.9 },
        { label: 'INV1_F', x: 12.2, y: 79.9 },
    ];
    const g = buildGroupedPoints(pts);
    // Expect: 1 SA group (5 members) + 1 standalone SAFM
    eq('B1. two entries (SA group + standalone SAFM)', g.length, 2);
    const saGrp = g.find(x => x.isGroup && x.groupId === 'SA');
    const safmStd = g.find(x => !x.isGroup && x.groupId === 'SAFM');
    truthy('B2. SA group still rendered', !!saGrp);
    truthy('B3. SA group has 5 (not 6) members — SAFM excluded',
           saGrp && saGrp.indices.length === 5,
           saGrp && saGrp.indices.length);
    truthy('B4. SAFM rendered as standalone pill', !!safmStd);
    eq('B5. SAFM standalone uses its own x/y near the fan',
       safmStd ? [safmStd.x, safmStd.y] : null,
       [70.5, 35.0]);
    truthy('B6. SAFM NOT inside the SA group',
           saGrp && !saGrp.points.some(p => p.label === 'SAFM'));
}

// ---------- C: anchor (first candidate) has no x/y → all skipped ----------
{
    const pts = [
        { label: 'SAT',  x: null, y: null },   // anchor missing coords
        { label: 'SAH',  x: 50,   y: 50   },   // would-be member, but anchor has no pos
        { label: 'SAF',  x: 50,   y: 50   },
    ];
    const g = buildGroupedPoints(pts);
    truthy('C1. no SA group (anchor has no coords)',
           !g.some(x => x.isGroup && x.groupId === 'SA'));
    truthy('C2. SAH falls through as standalone',
           g.some(x => !x.isGroup && x.groupId === 'SAH'));
    truthy('C3. SAF falls through as standalone',
           g.some(x => !x.isGroup && x.groupId === 'SAF'));
}

// ---------- D: tolerance — sub-half-percent jitter still groups ----------
{
    const pts = [
        { label: 'SAT',  x: 12.20, y: 79.90 },
        { label: 'SAH',  x: 12.21, y: 79.92 },   // 0.01-0.02 jitter
        { label: 'SAF',  x: 12.10, y: 79.50 },   // within 0.5 tolerance (0.4 dy)
    ];
    const g = buildGroupedPoints(pts);
    const sa = g.find(x => x.isGroup && x.groupId === 'SA');
    truthy('D1. tolerance accepts <0.5 jitter',
           sa && sa.indices.length === 3,
           sa && sa.indices.length);
}

console.log('\nSUMMARY:', pass, 'passed,', fail, 'failed');
process.exit(fail ? 1 : 0);
