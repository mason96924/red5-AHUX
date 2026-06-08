#!/usr/bin/env node
/**
 * Live test of the ``normalizeUploadFilename`` helper baked into
 * equipment_mapper.html.  Pulls the function body out of the page,
 * eval()s it in this Node context, and asserts the bug repro cases.
 *
 * Mirrors test_upload_filename_normalization.py but operates on the
 * actual JS source -- catches subtle regex breakage that the Python
 * twin cannot detect (e.g. someone tweaks the regex but the helper
 * presence check still passes).
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const PAGE = path.resolve(__dirname, '..', 'equipment_mapper.html');
const src = fs.readFileSync(PAGE, 'utf-8');

// Extract the helper definition (`const normalizeUploadFilename = ... };`).
const startMarker = 'const normalizeUploadFilename = (name) => {';
const start = src.indexOf(startMarker);
if (start < 0) {
    console.error('FAIL: normalizeUploadFilename not found in', PAGE);
    process.exit(1);
}
// Find the matching closing "};" -- the helper is small, so we can scan.
let depth = 0;
let end = -1;
for (let i = start; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
        depth--;
        if (depth === 0) {
            // include the closing brace + ';'
            end = src.indexOf(';', i);
            break;
        }
    }
}
if (end < 0) {
    console.error('FAIL: unterminated helper body');
    process.exit(1);
}
const body = src.slice(start, end + 1);

// Build a thin wrapper that exposes the const back to the test.
const fn = new Function(body + '\nreturn normalizeUploadFilename;');
const norm = fn();

const cases = [
    ['equipment_mapper.html',                'equipment_mapper.html'],
    ['equipment_mapper (1).html',            'equipment_mapper.html'],
    ['equipment_mapper (12).html',           'equipment_mapper.html'],
    ['equipment_mapper (1) (2).html',        'equipment_mapper.html'],
    ['dashboard.html',                       'dashboard.html'],
    ['graphics/equipments/AHUs/ahu (3).svg', 'graphics/equipments/AHUs/ahu.svg'],
    ['(1).html',                             '(1).html'],
    ['noext (1)',                            'noext'],
    ['name(1).html',                         'name.html'],
    ['a (1) b (2).html',                     'a (1) b.html'],
    ['',                                     ''],
];

let fails = 0;
for (const [input, expected] of cases) {
    const got = norm(input);
    if (got === expected) {
        console.log(`  ok   "${input}" -> "${got}"`);
    } else {
        console.log(`  FAIL "${input}" -> "${got}"  (expected "${expected}")`);
        fails++;
    }
}

if (fails) {
    console.error(`\n${fails} case(s) FAILED`);
    process.exit(1);
}
console.log(`\nAll ${cases.length} cases passed.`);
