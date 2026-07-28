"""Smoke test for /api/zip-files and /api/zip-dir registration + behaviour.

The endpoints were defined in upload_service.py but never registered in the
register() block — clicking "GET SELECTED" in equipment_mapper's controller-
assets file browser returned 404.  This test verifies (a) both routes are
live, (b) they accept multiple file names + a directory name and stream
back a valid zip with the right Content-Type / Content-Disposition, and
(c) malformed payloads error cleanly.
"""
import os
import sys
import io
import zipfile
import tempfile
import shutil
import contextlib

td = tempfile.mkdtemp(prefix="red5_zip_files_")
os.makedirs(td + "/scripts", exist_ok=True)
os.makedirs(td + "/data", exist_ok=True)
os.makedirs(td + "/data/pgpy", exist_ok=True)
os.makedirs(td + "/data/configs", exist_ok=True)
os.makedirs(td + "/data/sub", exist_ok=True)

# Drop a few files so the endpoint has something to zip.
open(td + "/data/dashboard.html", "w").write("<html>dashboard</html>\n")
open(td + "/data/update.html", "w").write("<html>update</html>\n")
open(td + "/data/configs/bridges.json", "w").write("{}\n")
open(td + "/data/sub/a.txt", "w").write("aaa\n")
open(td + "/data/sub/b.txt", "w").write("bbb\n")

sys.path.insert(0, '/app/archive/Red5-AHU-V1.9')
os.environ['RED5_DISABLE_BG_THREADS'] = '1'

src = open('/app/archive/Red5-AHU-V1.9/app.py').read()
src = src.replace("/root/data", td + "/data").replace("/root/scripts", td + "/scripts")
src = src.replace("app.run(host=HOST, port=PORT, threaded=True, debug=False)", "pass")
ns = {'__name__': '__test__', '__file__': '/app/archive/Red5-AHU-V1.9/app.py'}
with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
    exec(compile(src, '/tmp/fakeapp_zipfiles.py', 'exec'), ns)
app = ns['app']

PASSED = []; FAILED = []
def t(name, ok, info=''):
    (PASSED if ok else FAILED).append((name, info))
    print(('PASS ' if ok else 'FAIL '), name, '-', info if not ok else '')

with app.test_client() as c:
    # 1. Routes are registered.
    have_routes = sorted(r.rule for r in app.url_map.iter_rules() if r.rule.startswith('/api/zip'))
    t('1a. /api/zip-files route registered', '/api/zip-files' in have_routes, str(have_routes))
    t('1b. /api/zip-dir route registered',   '/api/zip-dir'   in have_routes, str(have_routes))

    # 2. Multi-file GET SELECTED happy path.
    r = c.post('/api/zip-files', json={
        'names': ['dashboard.html', 'update.html'],
        'root':  'data', 'path': ''
    })
    t('2a. status 200', r.status_code == 200, str(r.status_code))
    t('2b. content-type zip', 'application/zip' in (r.headers.get('Content-Type') or ''), r.headers.get('Content-Type'))
    t('2c. filename header present', 'attachment' in (r.headers.get('Content-Disposition') or ''), r.headers.get('Content-Disposition'))
    t('2d. X-File-Count = 2', r.headers.get('X-File-Count') == '2', r.headers.get('X-File-Count'))
    # Validate the zip body.
    zf = zipfile.ZipFile(io.BytesIO(r.get_data()))
    names = sorted(zf.namelist())
    t('2e. zip body has both files', names == ['dashboard.html', 'update.html'], str(names))
    t('2f. dashboard content preserved', zf.read('dashboard.html').decode().startswith('<html>dashboard'))

    # 3. Multi-file with one missing -> partial zip + count reflects only valid.
    r = c.post('/api/zip-files', json={
        'names': ['dashboard.html', 'does_not_exist.html'],
        'root':  'data', 'path': ''
    })
    t('3a. partial-match still 200', r.status_code == 200, str(r.status_code))
    t('3b. X-File-Count = 1', r.headers.get('X-File-Count') == '1', r.headers.get('X-File-Count'))

    # 4. Directory zip (GET on a folder row).
    r = c.post('/api/zip-dir', json={'dirname': 'sub', 'root': 'data', 'path': ''})
    t('4a. status 200', r.status_code == 200, str(r.status_code))
    zf = zipfile.ZipFile(io.BytesIO(r.get_data()))
    names = sorted(zf.namelist())
    t('4b. zip body has both subfiles',
      'sub/a.txt' in names and 'sub/b.txt' in names, str(names))

    # 5. Empty names -> 400.
    r = c.post('/api/zip-files', json={'names': [], 'root': 'data', 'path': ''})
    t('5a. empty names -> 400', r.status_code == 400, str(r.status_code))

    # 6. Missing dirname -> 400.
    r = c.post('/api/zip-dir', json={'root': 'data', 'path': ''})
    t('6a. empty dirname -> 400', r.status_code == 400, str(r.status_code))

    # 7. Path traversal attempt -> filtered out (404 because no files matched).
    r = c.post('/api/zip-files', json={
        'names': ['../../etc/passwd', '/etc/shadow'],
        'root':  'data', 'path': ''
    })
    t('7a. path-traversal rejected -> 404 no-match',
      r.status_code == 404, str(r.status_code))

    # 8. Scripts root works (e.g. zipping collector.py + simulator.py).
    open(td + "/scripts/collector.py", "w").write("# collector\n")
    r = c.post('/api/zip-files', json={
        'names': ['collector.py'], 'root': 'scripts', 'path': ''
    })
    t('8a. scripts root status 200', r.status_code == 200, str(r.status_code))

print()
print('SUMMARY:', len(PASSED), 'passed,', len(FAILED), 'failed')
shutil.rmtree(td, ignore_errors=True)
sys.exit(1 if FAILED else 0)
