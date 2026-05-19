"""Dry-run: list what /api/download-bundle would actually pack.

Mirrors the file-selection logic in app.py download_bundle() exactly so
the operator can eyeball the packing list before generating the bundle.

USAGE (on the controller, or anywhere)
--------------------------------------
List FULL bundle contents from real controller paths:
    python3 tests/dryrun_clone_bundle.py

List REPLICATE bundle (per-controller runtime state stripped):
    python3 tests/dryrun_clone_bundle.py --mode replicate

Point at a custom tree (e.g. this repo) instead of /root/data:
    python3 tests/dryrun_clone_bundle.py --data-root /app/archive/Red5-Studio-V1.9 \
                                          --scripts-root /tmp/scripts_does_not_exist

Self-test (verifies dryrun mirrors app.py and runs synthetic fixtures):
    python3 tests/dryrun_clone_bundle.py --self-test


WHAT IT DOES
------------
- walks DATA_ROOT recursively
- walks SCRIPTS_ROOT recursively, prefixing arc-names with 'scripts/'
- skips dotfiles + .tmp files (same as app.py)
- in replicate mode also skips per-controller runtime artifacts
  (telemetry snapshots, weather caches, etc.)
- prints a sorted include list, then the exclude list with reasons
- ends with a totals row and a manifest-style summary

The exclusion rules are KEPT IN LOCK-STEP with app.py via the
--self-test mode which greps app.py source and asserts the rules match.
"""
from __future__ import annotations

import argparse
import os
import re
import sys
import tempfile

THIS_DIR = os.path.dirname(os.path.abspath(__file__))
APP_PY   = os.path.join(THIS_DIR, '..', 'app.py')


# ---------------------------------------------------------------------------
# Exclusion rules -- MUST match app.py download_bundle() exactly.
# The --self-test mode verifies this list is byte-for-byte represented in
# app.py.  Edit BOTH files together if you ever change these.
# ---------------------------------------------------------------------------
REPLICATE_EXCLUDE_BASENAMES = {
    'telemetry.json',
    'telemetry.json.tmp',
    'collector_log.json',
    'write_history.json',
    'sim_overrides.json',
    'band_guide.csv',
}

# Directory-level skips applied to BOTH modes.  These trees are dev-only
# and must never reach a controller (operator-tooling tests, design
# mockups, Python bytecode cache, diagnostic scratch).
EXCLUDE_DIRS = {'tests', 'mockups', '__pycache__', '_diagnostic'}


def _path_in_excluded_dir(rel_path: str) -> bool:
    parts = rel_path.replace('\\', '/').split('/')
    for p in parts:
        if p in EXCLUDE_DIRS:
            return True
    return False


def _replicate_should_skip(arc_name: str):
    """Return (skip: bool, reason: str).  Matches app.py logic exactly."""
    base = os.path.basename(arc_name)
    if base in REPLICATE_EXCLUDE_BASENAMES:
        return True, 'replicate-exclude basename'
    # Cached open-meteo history files: weather_<lat>_<lon>_<year>.json.
    if (base.startswith('weather_') and base.endswith('.json')
            and base != 'weather_location.json'):
        return True, 'replicate-exclude weather cache'
    return False, ''


def _walk_root(root_dir: str, prefix: str, mode: str):
    """Yield (arc_name, full_path, included: bool, reason: str).

    Unlike app.py (which prunes dirnames for perf), the dry-run walks
    into excluded subtrees and labels each file -- the operator can see
    exactly what is being filtered.
    """
    if not os.path.isdir(root_dir):
        return
    for dirpath, dirnames, filenames in os.walk(root_dir):
        rel_dir = os.path.relpath(dirpath, root_dir)
        if rel_dir != '.' and rel_dir.startswith('.'):
            continue
        for fname in sorted(filenames):
            if fname.startswith('.'):
                continue  # dotfiles -- mirrored skip
            if fname.endswith('.tmp'):
                continue  # in-flight atomic writes -- mirrored skip
            full_path = os.path.join(dirpath, fname)
            rel = os.path.relpath(full_path, root_dir)
            arc_name = (prefix + rel) if prefix else rel
            if _path_in_excluded_dir(arc_name):
                yield arc_name, full_path, False, 'dev-only directory (tests/mockups/__pycache__/_diagnostic)'
                continue
            if mode == 'replicate':
                skip, reason = _replicate_should_skip(arc_name)
                if skip:
                    yield arc_name, full_path, False, reason
                    continue
            yield arc_name, full_path, True, ''


def plan(mode: str, data_root: str, scripts_root: str):
    """Return (included, excluded, totals) -- pure function, no side effects."""
    included = []
    excluded = []
    for arc_name, full_path, ok, reason in _walk_root(data_root, '', mode):
        (included if ok else excluded).append((arc_name, full_path, reason))
    for arc_name, full_path, ok, reason in _walk_root(scripts_root, 'scripts/', mode):
        (included if ok else excluded).append((arc_name, full_path, reason))
    # Sort for deterministic output (matches the order operators expect)
    included.sort(key=lambda r: r[0])
    excluded.sort(key=lambda r: r[0])
    total_bytes = 0
    for _, fp, _ in included:
        try:
            total_bytes += os.path.getsize(fp)
        except OSError:
            pass
    return included, excluded, {
        'mode': mode,
        'included': len(included),
        'excluded': len(excluded),
        'total_bytes': total_bytes,
    }


def _format_size(n):
    for unit in ('B', 'KB', 'MB', 'GB'):
        if n < 1024:
            return '%.1f %s' % (n, unit)
        n /= 1024.0
    return '%.1f TB' % n


def cmd_list(mode: str, data_root: str, scripts_root: str):
    included, excluded, totals = plan(mode, data_root, scripts_root)
    print('=' * 70)
    print('CLONE DRY-RUN  mode=%s' % mode)
    print('  data_root    : %s' % data_root)
    print('  scripts_root : %s' % scripts_root)
    print('=' * 70)
    print('INCLUDED (%d files, %s):' % (len(included), _format_size(totals['total_bytes'])))
    for arc, fp, _ in included:
        try:
            sz = os.path.getsize(fp)
        except OSError:
            sz = 0
        print('  %s  (%s)' % (arc, _format_size(sz)))
    if excluded:
        print()
        print('EXCLUDED (%d files, replicate-mode only):' % len(excluded))
        for arc, _, reason in excluded:
            print('  %s  [%s]' % (arc, reason))
    print()
    print('TOTAL: %d included / %d excluded / %s on disk' % (
        totals['included'], totals['excluded'], _format_size(totals['total_bytes'])))
    return 0


# ---------------------------------------------------------------------------
# Self-test
# ---------------------------------------------------------------------------
def _self_test():
    failures = []

    def check(name, ok, info=''):
        if not ok:
            failures.append(name + ('  ' + info if info else ''))

    # ---- 1. Synthetic fixture exercises every code path ----
    with tempfile.TemporaryDirectory() as tmp:
        data = os.path.join(tmp, 'data')
        scripts = os.path.join(tmp, 'scripts')
        os.makedirs(os.path.join(data, 'configs'), exist_ok=True)
        os.makedirs(os.path.join(data, 'pgpy'), exist_ok=True)
        os.makedirs(scripts, exist_ok=True)

        def w(p, body='x'):
            with open(p, 'w') as f:
                f.write(body)

        # Files that should be INCLUDED in both modes
        w(os.path.join(data, 'dashboard.html'))
        w(os.path.join(data, 'configs', 'collector_config.json'))
        w(os.path.join(data, 'configs', 'equipment_types.json'))
        w(os.path.join(data, 'configs', 'weather_location.json'))   # NOT a cache
        w(os.path.join(data, 'pgpy', 'band_overrides_service.py'))
        w(os.path.join(scripts, 'app.py'))

        # Files that should be SKIPPED unconditionally (dotfiles + .tmp)
        w(os.path.join(data, '.hidden'))
        w(os.path.join(data, 'configs', 'something.tmp'))

        # Dev-only trees that should ALWAYS be skipped (both modes)
        os.makedirs(os.path.join(data, 'tests'), exist_ok=True)
        os.makedirs(os.path.join(data, 'mockups'), exist_ok=True)
        os.makedirs(os.path.join(data, '__pycache__'), exist_ok=True)
        os.makedirs(os.path.join(data, '_diagnostic'), exist_ok=True)
        w(os.path.join(data, 'tests', 'test_foo.py'))
        w(os.path.join(data, 'mockups', 'sketch.html'))
        w(os.path.join(data, '__pycache__', 'app.cpython-311.pyc'))
        w(os.path.join(data, '_diagnostic', 'scratch.txt'))

        # Files that should be SKIPPED in replicate mode only
        w(os.path.join(data, 'telemetry.json'))
        w(os.path.join(data, 'collector_log.json'))
        w(os.path.join(data, 'write_history.json'))
        w(os.path.join(data, 'sim_overrides.json'))
        w(os.path.join(data, 'configs', 'band_guide.csv'))
        w(os.path.join(data, 'configs', 'weather_47.60_-122.30_2020.json'))   # cache
        w(os.path.join(data, 'configs', 'weather_30.00_120.00_2024.json'))    # cache

        # ---- FULL mode ----
        inc_full, exc_full, totals_full = plan('full', data, scripts)
        inc_full_names = {r[0] for r in inc_full}
        exc_full_names = {r[0] for r in exc_full}

        check('full: dashboard.html included', 'dashboard.html' in inc_full_names)
        check('full: configs/collector_config.json included',
              'configs/collector_config.json' in inc_full_names)
        check('full: pgpy plug-in included',
              'pgpy/band_overrides_service.py' in inc_full_names)
        check('full: scripts/app.py included under scripts/ prefix',
              'scripts/app.py' in inc_full_names)
        check('full: dotfile .hidden NEVER included',
              '.hidden' not in inc_full_names)
        check('full: *.tmp NEVER included',
              'configs/something.tmp' not in inc_full_names)
        check('full: telemetry.json INCLUDED (full mode keeps runtime state)',
              'telemetry.json' in inc_full_names)
        check('full: weather cache INCLUDED in full mode',
              'configs/weather_47.60_-122.30_2020.json' in inc_full_names)
        check('full: exclude list contains ONLY the 4 dev-only trees in full mode',
              len(exc_full) == 4,
              'got: %s' % sorted(exc_full_names))
        check('full: tests/ subtree excluded in full mode',
              'tests/test_foo.py' in exc_full_names)
        check('full: mockups/ subtree excluded in full mode',
              'mockups/sketch.html' in exc_full_names)
        check('full: __pycache__/ subtree excluded in full mode',
              '__pycache__/app.cpython-311.pyc' in exc_full_names)
        check('full: _diagnostic/ subtree excluded in full mode',
              '_diagnostic/scratch.txt' in exc_full_names)

        # ---- REPLICATE mode ----
        inc_rep, exc_rep, totals_rep = plan('replicate', data, scripts)
        inc_rep_names = {r[0] for r in inc_rep}
        exc_rep_names = {r[0] for r in exc_rep}

        check('replicate: dashboard.html still included',
              'dashboard.html' in inc_rep_names)
        check('replicate: pgpy plug-in still included',
              'pgpy/band_overrides_service.py' in inc_rep_names)
        check('replicate: weather_location.json KEPT (not a cache)',
              'configs/weather_location.json' in inc_rep_names)

        check('replicate: telemetry.json EXCLUDED',
              'telemetry.json' in exc_rep_names)
        check('replicate: collector_log.json EXCLUDED',
              'collector_log.json' in exc_rep_names)
        check('replicate: write_history.json EXCLUDED',
              'write_history.json' in exc_rep_names)
        check('replicate: sim_overrides.json EXCLUDED',
              'sim_overrides.json' in exc_rep_names)
        check('replicate: band_guide.csv EXCLUDED',
              'configs/band_guide.csv' in exc_rep_names)
        check('replicate: weather cache (Seattle) EXCLUDED',
              'configs/weather_47.60_-122.30_2020.json' in exc_rep_names)
        check('replicate: weather cache (Shanghai) EXCLUDED',
              'configs/weather_30.00_120.00_2024.json' in exc_rep_names)
        check('replicate: dotfile/.tmp still skipped silently',
              '.hidden' not in inc_rep_names and
              '.hidden' not in exc_rep_names and
              'configs/something.tmp' not in inc_rep_names)
        check('replicate: replicate-mode included matches full-included',
              totals_rep['included'] == totals_full['included'] - 7,
              'full=%d  replicate=%d  expected_delta=7 runtime files' % (totals_full['included'], totals_rep['included']))
        check('replicate: dev-only trees also excluded (inherited from full mode)',
              'tests/test_foo.py' in exc_rep_names
              and 'mockups/sketch.html' in exc_rep_names
              and '__pycache__/app.cpython-311.pyc' in exc_rep_names
              and '_diagnostic/scratch.txt' in exc_rep_names)

    # ---- 2. Verify the rules in this script MATCH app.py source ----
    if os.path.exists(APP_PY):
        with open(APP_PY, 'r') as f:
            src = f.read()
        # The REPLICATE_EXCLUDE_BASENAMES set in app.py must contain every
        # basename we list here.  Look inside the set literal so we do not
        # match the same basename appearing in a comment elsewhere.
        m = re.search(r"REPLICATE_EXCLUDE_BASENAMES\s*=\s*\{(.*?)\}", src, re.DOTALL)
        check('app-py-sync: REPLICATE_EXCLUDE_BASENAMES set found in app.py', m is not None)
        if m:
            set_body = m.group(1)
            for base in REPLICATE_EXCLUDE_BASENAMES:
                # Plain substring -- NOT regex.  Earlier version called
                # re.escape() which turned dots into '\.' and broke the
                # match against the literal set-body text.
                pat = "'" + base + "'"
                check('app-py-sync: %s present in REPLICATE_EXCLUDE_BASENAMES' % base,
                      pat in set_body,
                      'not found in set literal')
        # Weather-cache pattern + weather_location.json carve-out must be present.
        check('app-py-sync: weather_ + .json + weather_location.json carve-out',
              re.search(r"base\.startswith\('weather_'\)[\s\S]{0,200}weather_location\.json", src) is not None)
        # Dotfile + *.tmp skip
        check('app-py-sync: dotfile skip mirrored',
              re.search(r"fname\.startswith\('\.'\)", src) is not None)
        check('app-py-sync: *.tmp skip mirrored',
              re.search(r"fname\.endswith\('\.tmp'\)", src) is not None)
        # Both roots walked
        check('app-py-sync: os.walk(DATA_ROOT)',
              "os.walk(DATA_ROOT)" in src)
        check('app-py-sync: os.walk(SCRIPTS_ROOT)',
              "os.walk(SCRIPTS_ROOT)" in src)
        # scripts/ arc-name prefix
        check('app-py-sync: scripts/ arc-name prefix used',
              "'scripts/'" in src)
        # EXCLUDE_DIRS set + helper + os.walk pruning must be present in app.py
        m_ed = re.search(r"EXCLUDE_DIRS\s*=\s*\{(.*?)\}", src, re.DOTALL)
        check('app-py-sync: EXCLUDE_DIRS set declared in app.py', m_ed is not None)
        if m_ed:
            ed_body = m_ed.group(1)
            for d in EXCLUDE_DIRS:
                pat = "'" + d + "'"
                check('app-py-sync: EXCLUDE_DIRS contains %s' % d,
                      pat in ed_body,
                      'missing in app.py')
        check('app-py-sync: _path_in_excluded_dir helper present',
              '_path_in_excluded_dir' in src)
        check('app-py-sync: os.walk dirnames pruned via EXCLUDE_DIRS',
              re.search(r"dirnames\[:\]\s*=\s*\[d for d in dirnames if d not in EXCLUDE_DIRS\]", src) is not None)
    else:
        check('app-py-sync: app.py reachable for source sync check',
              False, 'expected at ' + APP_PY)

    # ---- Summary ----
    if failures:
        print('Clone dry-run self-test: %d FAIL(s).' % len(failures))
        for f in failures:
            print('  - ' + f)
        return 1
    print('Clone dry-run self-test: all checks pass.')
    return 0


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument('--mode', default='full', choices=['full', 'replicate'],
                    help='Which bundle mode to simulate (default: full)')
    ap.add_argument('--data-root', default='/root/data',
                    help='Path to walk for /root/data contents (default: /root/data)')
    ap.add_argument('--scripts-root', default='/root/scripts',
                    help='Path to walk for /root/scripts contents (default: /root/scripts)')
    ap.add_argument('--self-test', action='store_true',
                    help='Run the synthetic-fixture self-test and exit')
    args = ap.parse_args()

    if args.self_test:
        sys.exit(_self_test())

    if not os.path.isdir(args.data_root):
        print('data-root not found: %s' % args.data_root, file=sys.stderr)
        sys.exit(2)
    sys.exit(cmd_list(args.mode, args.data_root, args.scripts_root))


if __name__ == '__main__':
    main()
