"""Regression tests for band_service.py (extracted from app.py 2026-05-06)."""
import os, sys, tempfile, contextlib, io

td = tempfile.mkdtemp(prefix="red5_band_")
os.makedirs(td + "/scripts", exist_ok=True)
os.makedirs(td + "/data/configs", exist_ok=True)

sys.path.insert(0, '/app/archive/Red5-AHU-V1.9')

src = open('/app/archive/Red5-AHU-V1.9/app.py').read()
src = src.replace("/root/data", td + "/data").replace("/root/scripts", td + "/scripts")
src = src.replace("app.run(host=HOST, port=PORT, threaded=True, debug=False)", "pass")

os.environ['RED5_DISABLE_BG_THREADS'] = '1'
ns = {'__name__': '__test__', '__file__': '/app/archive/Red5-AHU-V1.9/app.py'}
with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
    exec(compile(src, '/tmp/fakeapp.py', 'exec'), ns)
app = ns['app']
import band_service

# Drop synthetic CSVs/MD on disk so the routes have something to serve.
open(td + '/data/band_guide.md', 'w').write('# Band Guide')
open(td + '/data/band_guide.csv', 'w').write('vav,band\nVAV1,B\n')
open(td + '/data/AHU01_vav_proj.csv', 'w').write('vav,zone\nVAV1,Z1\n')

PASSED, FAILED = [], []
def test(name, ok, info=''):
    (PASSED if ok else FAILED).append((name, info))
    print(('PASS ' if ok else 'FAIL '), name, '-', info if not ok else '')

with app.test_client() as c:
    # 1. /band_guide.md
    r = c.get('/band_guide.md')
    test('1a. /band_guide.md returns 200', r.status_code == 200)
    test('1b. /band_guide.md is markdown',
         r.headers.get('Content-Type') == 'text/markdown; charset=utf-8',
         r.headers.get('Content-Type'))
    test('1c. /band_guide.md body matches', r.get_data(as_text=True) == '# Band Guide')

    # 2. /api/band-csv/guide
    r = c.get('/api/band-csv/guide')
    test('2a. /api/band-csv/guide 200', r.status_code == 200)
    test('2b. text/csv MIME',
         (r.headers.get('Content-Type') or '').startswith('text/csv'))

    # 3. /api/band-csv/<ahu_id> — present
    r = c.get('/api/band-csv/AHU01')
    test('3a. AHU01 vav-proj 200', r.status_code == 200)

    # 4. /api/band-csv/<ahu_id> — missing
    r = c.get('/api/band-csv/AHU99')
    test('4a. missing AHU returns 404', r.status_code == 404)
    j = r.get_json()
    test('4b. error msg names the file',
         j and 'AHU99_vav_proj.csv' in j.get('error', ''),
         str(j))

    # 5. /api/band-csv/regenerate — without band_csv_generator deployed
    r = c.post('/api/band-csv/regenerate')
    test('5a. regenerate ok=200 even without generator',
         r.status_code == 200, str(r.status_code))

    # 6. Routes registered.  Filter to band-csv only (the band-overrides
    # plugin also has 'band' in its route name but is a separate service).
    rules = sorted({r.rule for r in app.url_map.iter_rules()
                    if r.rule == '/band_guide.md' or r.rule.startswith('/api/band-csv')})
    test('6a. all 4 band routes attached',
         set(rules) == {
             '/band_guide.md',
             '/api/band-csv/regenerate',
             '/api/band-csv/guide',
             '/api/band-csv/<ahu_id>',
         },
         'got: ' + str(rules))

    # 7. start_band_thread=False -> generator NOT started
    test('7a. DATA_ROOT routed', band_service.DATA_ROOT == td + '/data',
         band_service.DATA_ROOT)

print()
print('SUMMARY:', len(PASSED), 'passed,', len(FAILED), 'failed')
if FAILED:
    sys.exit(1)
import shutil; shutil.rmtree(td, ignore_errors=True)
