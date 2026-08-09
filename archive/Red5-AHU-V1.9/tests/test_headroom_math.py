"""Finalize headroom uses extract-growth (overwrite reclaim + site-preserve),
not max(1 MB, largest_member + 256 KB).

Reproduces the operator failure mode: ~4.5 MB free → upload 2.65 MB spool →
~1.7 MB free left → old math refused because equipment_types.json (~1.7 MB)
dominated largest_member even when site-preserve would skip writing it.
"""
import os, sys, tempfile, zipfile, shutil, types

# Controllers have Flask; local mac checkout may not. Stub for unit test.
if 'flask' not in sys.modules:
    _flask = types.ModuleType('flask')
    class _J: pass
    _flask.jsonify = lambda *a, **k: None
    _flask.request = _J()
    _flask.Response = object
    _flask.send_from_directory = lambda *a, **k: None
    _flask.make_response = lambda *a, **k: None
    sys.modules['flask'] = _flask

td = tempfile.mkdtemp(prefix="red5_headroom_")
os.makedirs(td + "/scripts", exist_ok=True)
os.makedirs(td + "/data/pgpy", exist_ok=True)
os.makedirs(td + "/data/configs", exist_ok=True)
os.makedirs(td + "/data/_uploads", exist_ok=True)

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ['RED5_DISABLE_BG_THREADS'] = '1'

import upload_service as us

us.DATA_ROOT = td + "/data"
us.SCRIPTS_ROOT = td + "/scripts"
us.PLUGINS_ROOT = td + "/data/pgpy"
us.ALLOWED_EXTENSIONS = {
    '.py', '.html', '.js', '.css', '.json', '.md', '.svg', '.png', '.jpg',
    '.jpeg', '.gif', '.woff', '.woff2', '.ttf', '.map', '.txt', '.csv',
}
us.UPLOADS_SCRATCH_DIR = td + "/data/_uploads"

PASSED = []; FAILED = []
def t(name, ok, info=''):
    (PASSED if ok else FAILED).append((name, info))
    print(('PASS ' if ok else 'FAIL '), name, '-', info if not ok else '')

# Zip: huge site-preserve member + small real payload.
big = b'E' * 1_700_000
small = b'<html>dashboard</html>'
zip_path = td + "/data/_uploads/inbound_test.bin"
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_STORED) as zf:
    zf.writestr('configs/equipment_types.json', big)
    zf.writestr('dashboard.html', small)

# Site already has equipment_types — preserve skip.
open(td + "/data/configs/equipment_types.json", 'wb').write(big)

need, mx = us._estimate_extract_min_bytes(zip_path)
t('1a. preserved largest member does not dominate need',
  need <= 256 * 1024 + 64 * 1024,
  'need=%s max_growth=%s' % (need, mx))
t('1b. max_growth is dashboard-sized (or 0 if somehow present)',
  mx <= max(len(small), 1024),
  'max_growth=%s' % mx)

# Mock free space at the post-spool reality (~1.7 MB).
calls = []
def fake_check(path, min_bytes=10*1024*1024, min_inodes=200):
    free_b, free_i = 1_700_000, 12000
    calls.append({'min_bytes': min_bytes, 'free_b': free_b})
    return (free_b >= min_bytes and free_i >= min_inodes), free_b, free_i
us._check_free_space = fake_check
us._purge_pycache = lambda roots=None: (0, 0)
us._purge_uploads_scratch = lambda max_age_sec=300: (0, 0)
us._auto_reload_extracted_services = lambda extracted: []

body, code = us._finalize_bundle_from_disk(zip_path, password='x')
t('2a. finalize succeeds with 1.7 MB free (operator case)', code == 200,
  str(code) + ' ' + str(body)[:180])
t('2b. required min_bytes was well under 1.7 MB',
  calls and calls[0]['min_bytes'] <= 1_700_000,
  'min_bytes=' + str(calls[0]['min_bytes'] if calls else None))
t('2c. dashboard.html extracted',
  any(e.get('file') == 'dashboard.html' for e in (body.get('extracted') or [])),
  str(body.get('extracted'))[:200])

# Old formula would have refused.
old_need = max(1 * 1024 * 1024, 1_700_000 + 256 * 1024)
t('3a. old largest-member formula would refuse 1.7 MB free',
  old_need > 1_700_000,
  'old_need=' + str(old_need))

print()
print('SUMMARY:', len(PASSED), 'passed,', len(FAILED), 'failed')
shutil.rmtree(td, ignore_errors=True)
sys.exit(1 if FAILED else 0)
