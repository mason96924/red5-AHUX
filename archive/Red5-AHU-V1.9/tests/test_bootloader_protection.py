"""Regression test for bootloader protection.

`app.py` is the plug-in loader / orchestrator for the Red5 controller.
It is operator-managed (manually uploaded for explicit version control)
and must NEVER be auto-replaced by a bundle upload — even if a sloppy
zip happens to contain it.  An ill-formed app.py landing on a live
controller would brick the boot loop.

This test verifies BOTH extractors enforce the rule:
  1. upload_service.py's _extract_zip_streaming() skips app.py.
  2. app.py's emergency_bootstrap extractor skips app.py.

If a future refactor accidentally drops the guard, this test fails
loudly before reaching production.
"""
import os, sys, tempfile, contextlib, io, json, zipfile, shutil

td = tempfile.mkdtemp(prefix="red5_bootguard_")
os.makedirs(td + "/scripts", exist_ok=True)
os.makedirs(td + "/data/configs", exist_ok=True)

sys.path.insert(0, '/app/archive/Red5-AHU-V1.9')

src = open('/app/archive/Red5-AHU-V1.9/app.py').read()
src = src.replace("/root/data", td + "/data").replace("/root/scripts", td + "/scripts")
src = src.replace("app.run(host=HOST, port=PORT, threaded=True, debug=False)", "pass")

os.environ['RED5_DISABLE_BG_THREADS'] = '1'
ns = {'__name__': '__test__', '__file__': '/app/archive/Red5-AHU-V1.9/app.py'}
with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
    exec(compile(src, '/tmp/fakeapp_bootguard.py', 'exec'), ns)
app = ns['app']
import upload_service

# Build a synthetic bundle that includes a "malicious" app.py — i.e.,
# one that would clearly break boot if installed.  Plus a benign service
# module to confirm the rest of the bundle still extracts.
TROJAN_APP_PY = b"raise SystemExit('TROJAN APP.PY EXECUTED')\n"
GOOD_SERVICE = b"""
_service_dependencies = ['DATA_ROOT']
def register(app, ctx):
    pass
"""
bundle_buf = io.BytesIO()
with zipfile.ZipFile(bundle_buf, 'w') as zf:
    zf.writestr('app.py', TROJAN_APP_PY)
    zf.writestr('mock_service.py', GOOD_SERVICE)
    zf.writestr('configs/seed.json', b'{"ok": true}')
bundle_bytes = bundle_buf.getvalue()

# Save the original app.py mtime + content so we can verify it's untouched.
# (Use a path inside td/scripts so the extractor would actually try to
# write there if the guard fails; the real app.py at SRC is left alone.)
real_app_py = td + '/scripts/app.py'
with open(real_app_py, 'wb') as f:
    f.write(b'# REAL app.py - DO NOT REPLACE\n')
original_size = os.path.getsize(real_app_py)
original_mtime = os.path.getmtime(real_app_py)

PASSED, FAILED = [], []
def test(name, ok, info=''):
    (PASSED if ok else FAILED).append((name, info))
    print(('PASS ' if ok else 'FAIL '), name, ('- ' + info) if (info and not ok) else '')


# ---------- 1. upload_service.py extractor ----------
spool = td + '/spool.zip'
with open(spool, 'wb') as f:
    f.write(bundle_bytes)
extracted, skipped, errors = upload_service._extract_zip_streaming(spool)

# 1a. app.py was skipped, not extracted.
extracted_files = [e['file'] for e in extracted]
test('1a. upload_service: app.py NOT in extracted',
     'app.py' not in extracted_files and 'scripts/app.py' not in extracted_files,
     str(extracted_files))

# 1b. app.py shows up in skipped list with the bootloader reason.
skipped_app = [s for s in skipped if 'app.py' in s.get('file', '')]
test('1b. upload_service: app.py in skipped list',
     len(skipped_app) > 0, str(skipped))
test('1c. upload_service: skip reason mentions Bootloader',
     skipped_app and 'Bootloader' in skipped_app[0].get('reason', ''),
     str(skipped_app))

# 1d. The benign service module DID extract (rest of bundle still works).
test('1d. upload_service: mock_service.py still extracted',
     any('mock_service.py' in e['file'] for e in extracted),
     str(extracted_files))

# 1e. The real app.py on disk is byte-identical to before extraction.
test('1e. upload_service: real app.py untouched (size)',
     os.path.getsize(real_app_py) == original_size,
     f'size {os.path.getsize(real_app_py)} vs {original_size}')
test('1f. upload_service: real app.py untouched (mtime)',
     os.path.getmtime(real_app_py) == original_mtime,
     'mtime changed')


# ---------- 2. emergency bootstrap extractor ----------
# The first app exec had upload_service.py available, so the real /update
# route was installed and the emergency bootstrap was NOT activated.  To
# test the emergency bootstrap path, we exec app.py a SECOND time with
# upload_service.py temporarily hidden from sys.path.
import importlib
del sys.modules['upload_service']
saved_path = sys.path[:]
# Force a fresh exec where upload_service.py is unfindable.
src2 = src.replace("_search_dirs = [SCRIPTS_ROOT]",
                   "_search_dirs = ['/nonexistent_dir_for_test']")
td2 = tempfile.mkdtemp(prefix="red5_bootguard_em_")
os.makedirs(td2 + "/scripts", exist_ok=True)
os.makedirs(td2 + "/data/configs", exist_ok=True)
src2 = src2.replace(td + "/data", td2 + "/data").replace(td + "/scripts", td2 + "/scripts")
real_app_py2 = td2 + '/scripts/app.py'
with open(real_app_py2, 'wb') as f:
    f.write(b'# EMERGENCY-MODE REAL app.py\n')

ns2 = {'__name__': '__test__', '__file__': td2 + '/scripts/app.py'}
with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
    exec(compile(src2, '/tmp/fakeapp_bootguard_em.py', 'exec'), ns2)
app2 = ns2['app']
# Confirm emergency bootstrap is registered (no real /update from upload_service)
emerg_endpoints = {r.endpoint for r in app2.url_map.iter_rules() if r.rule == '/update'}
test('2-pre. emergency bootstrap is active in this test',
     '_emergency_update' in emerg_endpoints,
     str(emerg_endpoints))

with app2.test_client() as c:
    bundle_buf2 = io.BytesIO()
    with zipfile.ZipFile(bundle_buf2, 'w') as zf:
        zf.writestr('app.py', TROJAN_APP_PY)
        zf.writestr('zzz_emergency_test_service.py', GOOD_SERVICE)
        zf.writestr('configs/seed.json', b'{"ok": true}')
    from werkzeug.datastructures import FileStorage
    fs = FileStorage(stream=io.BytesIO(bundle_buf2.getvalue()),
                     filename='test.zip', content_type='application/zip')
    r = c.post('/api/emergency-bootstrap',
               data={'bundle': fs, 'password': ''},
               content_type='multipart/form-data')

test('2a. emergency: 200 response',     r.status_code == 200, str(r.status_code))
test('2b. emergency: success=True',     r.is_json and r.get_json().get('success') is True,
     str(r.get_json() if r.is_json else r.data[:200]))
extracted_list = (r.get_json() or {}).get('extracted', []) if r.is_json else []
test('2c. emergency: app.py NOT in extracted list',
     'app.py' not in extracted_list,
     str(extracted_list))
test('2d. emergency: real app.py byte-identical',
     open(real_app_py2, 'rb').read() == b'# EMERGENCY-MODE REAL app.py\n',
     'app.py was overwritten')
test('2e. emergency: benign service WAS extracted to PLUGINS_ROOT',
     os.path.isfile(td2 + '/data/pgpy/zzz_emergency_test_service.py'),
     'service file missing in PLUGINS_ROOT')
test('2f. emergency: configs/seed.json WAS extracted',
     os.path.isfile(td2 + '/data/configs/seed.json'),
     'config file missing')


print()
print(f'PASSED: {len(PASSED)}  FAILED: {len(FAILED)}')
if FAILED:
    for n, i in FAILED:
        print(f'  - {n}: {i}')
    sys.exit(1)
