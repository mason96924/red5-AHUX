"""End-to-end test of the Out-of-Band Repair Mode endpoints.

Covers:
  - POST /api/repair/upload-plugin happy path (plugin → PLUGINS_ROOT)
  - POST /api/repair/upload-plugin happy path (UI .html → DATA_ROOT)
  - POST /api/repair/upload-plugin refuses app.py
  - POST /api/repair/upload-plugin refuses files outside the allow-list
  - POST /api/repair/upload-plugin tmp+rename atomicity (no half-written files)
  - GET  /api/repair/download-plugin/<name>
  - GET  /api/repair/download-plugin/app.py refused
  - GET  /api/repair/download-plugin/<missing> returns 404
"""
import os, sys, tempfile, io, contextlib

td = tempfile.mkdtemp(prefix="red5_repair_")
os.makedirs(td + "/scripts", exist_ok=True)
os.makedirs(td + "/data", exist_ok=True)
os.makedirs(td + "/data/pgpy", exist_ok=True)

sys.path.insert(0, '/app/archive/Red5-AHU-V1.9')

src = open('/app/archive/Red5-AHU-V1.9/app.py').read()
src = src.replace("/root/data", td + "/data").replace("/root/scripts", td + "/scripts")
src = src.replace("app.run(host=HOST, port=PORT, threaded=True, debug=False)", "pass")
ns = {'__name__': '__test__', '__file__': '/app/archive/Red5-AHU-V1.9/app.py'}
with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
    exec(compile(src, '/tmp/fakeapp_repair.py', 'exec'), ns)
app = ns['app']

PASSED = []
FAILED = []
def test(name, ok, info=''):
    (PASSED if ok else FAILED).append((name, info))
    print(('PASS ' if ok else 'FAIL '), name, '-', info if not ok else '')

NEW_UPLOAD_SVC = b"# new upload_service.py with 5 MB floor\n# bytes are a marker for round-trip\n"
NEW_DASHBOARD = b"<html>NEW DASHBOARD</html>"
TROJAN_APP_PY = b"raise SystemExit('TROJAN')"
EVIL_FILENAME = b"# malicious code"

with app.test_client() as c:
    # --- 1. Upload upload_service.py to PLUGINS_ROOT ---
    r = c.post('/api/repair/upload-plugin',
               data={'file': (io.BytesIO(NEW_UPLOAD_SVC), 'upload_service.py'),
                     'filename': 'upload_service.py'},
               content_type='multipart/form-data')
    j = r.get_json() or {}
    test('1a. upload upload_service.py status 200', r.status_code == 200, str(r.status_code))
    test('1b. upload upload_service.py success', bool(j.get('success')), str(j))
    test('1c. dest reports pgpy/upload_service.py', j.get('dest') == 'pgpy/upload_service.py', str(j.get('dest')))
    test('1d. file written to disk',
         os.path.isfile(td + '/data/pgpy/upload_service.py'))
    test('1e. file bytes match',
         open(td + '/data/pgpy/upload_service.py', 'rb').read() == NEW_UPLOAD_SVC)
    test('1f. response includes restart-flask note',
         'Restart Flask' in (j.get('note') or ''))

    # --- 2. Upload dashboard.html to DATA_ROOT ---
    r = c.post('/api/repair/upload-plugin',
               data={'file': (io.BytesIO(NEW_DASHBOARD), 'dashboard.html'),
                     'filename': 'dashboard.html'},
               content_type='multipart/form-data')
    j = r.get_json() or {}
    test('2a. upload dashboard.html success', bool(j.get('success')), str(j))
    test('2b. dest reports data/dashboard.html', j.get('dest') == 'data/dashboard.html')
    test('2c. dashboard.html written',
         os.path.isfile(td + '/data/dashboard.html'))
    test('2d. dashboard.html does NOT leak to pgpy',
         not os.path.isfile(td + '/data/pgpy/dashboard.html'))

    # --- 3. Refuse app.py ---
    r = c.post('/api/repair/upload-plugin',
               data={'file': (io.BytesIO(TROJAN_APP_PY), 'app.py'),
                     'filename': 'app.py'},
               content_type='multipart/form-data')
    j = r.get_json() or {}
    test('3a. app.py upload returns 403', r.status_code == 403, str(r.status_code))
    test('3b. app.py upload error mentions bootloader',
         'bootloader' in (j.get('error') or '').lower())
    test('3c. app.py NOT written anywhere',
         not os.path.isfile(td + '/data/app.py')
         and not os.path.isfile(td + '/data/pgpy/app.py')
         and not os.path.isfile(td + '/scripts/pgpy/app.py'))

    # --- 4. Refuse off-list filename ---
    r = c.post('/api/repair/upload-plugin',
               data={'file': (io.BytesIO(EVIL_FILENAME), 'totally_evil.py'),
                     'filename': 'totally_evil.py'},
               content_type='multipart/form-data')
    j = r.get_json() or {}
    test('4a. off-list filename returns 403', r.status_code == 403)
    test('4b. response includes allow-list',
         isinstance(j.get('allowed'), list) and 'upload_service.py' in (j.get('allowed') or []))
    test('4c. evil file NOT written',
         not os.path.isfile(td + '/data/totally_evil.py')
         and not os.path.isfile(td + '/data/pgpy/totally_evil.py'))

    # --- 5. Path-traversal attempts via filename header ---
    r = c.post('/api/repair/upload-plugin',
               data={'file': (io.BytesIO(b'x'), '../../../etc/passwd'),
                     'filename': '../../../etc/passwd'},
               content_type='multipart/form-data')
    test('5a. path-traversal filename rejected (off-list after basename)',
         r.status_code == 403)

    # --- 6. Tmp+rename atomicity: no .repair_tmp file lingers after success ---
    test('6a. no leftover .repair_tmp after upload',
         not any(p.endswith('.repair_tmp')
                 for p in os.listdir(td + '/data/pgpy')))

    # --- 7. Download endpoint round-trip ---
    r = c.get('/api/repair/download-plugin/upload_service.py')
    test('7a. download upload_service.py status 200', r.status_code == 200, str(r.status_code))
    test('7b. download body matches what we just uploaded', r.data == NEW_UPLOAD_SVC)

    r = c.get('/api/repair/download-plugin/dashboard.html')
    test('7c. download dashboard.html status 200', r.status_code == 200)
    test('7d. download dashboard.html body matches', r.data == NEW_DASHBOARD)

    # --- 8. Download refuses app.py ---
    r = c.get('/api/repair/download-plugin/app.py')
    test('8a. download app.py returns 403', r.status_code == 403)

    # --- 9. Download missing file returns 404 ---
    r = c.get('/api/repair/download-plugin/weather_service.py')
    test('9a. download missing file returns 404', r.status_code == 404)

    # --- 10. Download off-list returns 403 ---
    r = c.get('/api/repair/download-plugin/secret_credentials.txt')
    test('10a. download off-list returns 403', r.status_code == 403)

print()
print('SUMMARY:', len(PASSED), 'passed,', len(FAILED), 'failed')
if FAILED:
    sys.exit(1)
import shutil; shutil.rmtree(td, ignore_errors=True)
