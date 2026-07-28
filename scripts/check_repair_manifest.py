#!/usr/bin/env python3
"""
check_repair_manifest.py
========================
Pre-commit / CI guard: verify archive/Red5-AHU-V1.9/repair_manifest.json
is in sync with the actual file contents.  Catches a commit that changes
upload_service.py / sidebar.js / dashboard.compiled.js etc. but forgets
to run scripts/build_repair_manifest.py first.

Exit code:
    0  manifest matches every listed file
    1  one or more mismatches (CI fails)
    2  manifest missing entirely
"""
import hashlib
import json
import os
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARCHIVE   = os.path.join(REPO_ROOT, 'archive', 'Red5-AHU-V1.9')
MANIFEST  = os.path.join(ARCHIVE, 'repair_manifest.json')


def main():
    if not os.path.isfile(MANIFEST):
        print('FAIL: ' + MANIFEST + ' is missing.  Run scripts/build_repair_manifest.py.')
        return 2
    with open(MANIFEST) as f:
        m = json.load(f)
    mismatches = []
    missing = []
    for entry in m.get('files', []) or []:
        name = entry.get('name')
        path = os.path.join(ARCHIVE, name)
        if not os.path.isfile(path):
            missing.append(name)
            continue
        # repair_manifest.json carries sha256=null (would be a fixed
        # point against itself); existence is the only check.
        if entry.get('sha256') is None:
            continue
        with open(path, 'rb') as f:
            data = f.read()
        sha = hashlib.sha256(data).hexdigest()
        if sha != entry.get('sha256') or len(data) != entry.get('size'):
            mismatches.append({
                'name': name,
                'expected_sha': entry.get('sha256', '?')[:16],
                'got_sha':      sha[:16],
                'expected_size': entry.get('size'),
                'got_size':      len(data),
            })
    if not mismatches and not missing:
        print('OK: repair_manifest.json matches all {} files on disk.'.format(len(m.get('files', []))))
        return 0
    if mismatches:
        print('FAIL: {} file(s) in repair_manifest.json do not match disk:'.format(len(mismatches)))
        for x in mismatches:
            print('  - {} : expected {} ({}B) got {} ({}B)'.format(
                x['name'], x['expected_sha'], x['expected_size'],
                x['got_sha'], x['got_size']))
    if missing:
        print('FAIL: {} file(s) listed in manifest but missing on disk:'.format(len(missing)))
        for n in missing:
            print('  - ' + n)
    print('\nRun:  python3 scripts/build_repair_manifest.py   to regenerate.')
    return 1


if __name__ == '__main__':
    sys.exit(main())
