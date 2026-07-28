"""Regression tests for core file-management + config endpoints in app.py.

Catches the 2026-05-08 regression where `_resolve_root()` and `CONFIG_DIR`
were dropped during the service-split refactor — every file-management
route (`/api/files`, `/api/delete-file`, ...) and every config route
(`/api/equipment-types`, `/api/map-config`, ...) silently 500-ed with
NameError.  Frontend callers got HTML error pages and crashed at
`response.json()` with `Unexpected token '<'`.

This test file pulls every route in app.py, hits each one with a smoke
request via Flask's test_client, and asserts no route returns 500 caused
by NameError.  Result: any future accidental drop of a top-level helper
or constant is caught at CI time, not on the controller.
"""
import os, sys, tempfile, contextlib, io, json

td = tempfile.mkdtemp(prefix="red5_core_routes_")
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

# Minimal seed data so config endpoints have something to read.
open(td + '/data/configs/equipment_types.json', 'w').write(json.dumps({'AHU': {'points': []}}))
open(td + '/data/configs/map_config.json',      'w').write(json.dumps({'floors': []}))

PASSED, FAILED = [], []
def test(name, ok, info=''):
    (PASSED if ok else FAILED).append((name, info))
    print(('PASS ' if ok else 'FAIL '), name, ('- ' + info) if (info and not ok) else '')


def _is_html_500(resp):
    """Catch the exact Flask-default-500-HTML we want to avoid."""
    if resp.status_code != 500:
        return False
    body = resp.get_data(as_text=True).lower()
    return body.startswith('<!doctype') or '<title>500' in body


with app.test_client() as c:
    # ---- _resolve_root() consumers -----------------------------------
    r = c.get('/api/files?root=data&path=')
    test('1a. /api/files (root=data)  200',           r.status_code == 200, f'status={r.status_code}')
    test('1b. /api/files returns JSON',               r.is_json, 'not JSON')
    test('1c. /api/files NOT html-500',               not _is_html_500(r), 'HTML 500 leaked')

    r = c.get('/api/files?root=scripts&path=')
    test('2a. /api/files (root=scripts) 200',         r.status_code == 200, f'status={r.status_code}')

    r = c.get('/api/files?root=&path=')   # empty root falls back to data
    test('3a. /api/files (root="")     200',          r.status_code == 200, f'status={r.status_code}')

    r = c.get('/api/files?root=data&path=..%2F..%2Fetc')
    test('4a. /api/files traversal -> 400',           r.status_code == 400, f'status={r.status_code}')

    # ---- CONFIG_DIR consumers ----------------------------------------
    r = c.get('/api/equipment-types')
    test('5a. /api/equipment-types 200',              r.status_code == 200, f'status={r.status_code}')
    test('5b. /api/equipment-types JSON',             r.is_json, 'not JSON')
    test('5c. /api/equipment-types has AHU key',      'AHU' in (r.get_json() or {}), str(r.get_json())[:80])

    r = c.get('/api/map-config')
    test('6a. /api/map-config 200',                   r.status_code == 200)
    test('6b. /api/map-config JSON',                  r.is_json)

    r = c.post('/api/save-equipment-schema',
               data=json.dumps({'equipment_schema': {'VAV': {'points': []}}}),
               content_type='application/json')
    test('7a. /api/save-equipment-schema 200',        r.status_code == 200, f'status={r.status_code}')
    test('7b. ... saved to disk',
         os.path.isfile(td + '/data/configs/equipment_types.json'))

    r = c.post('/api/save-map-config',
               data=json.dumps({'map_config': {'floors': [{'name': 'F1'}]}}),
               content_type='application/json')
    test('8a. /api/save-map-config 200',              r.status_code == 200)

    # ---- /api/version (cosmetic regression: app.py mtime null) -------
    # Touch the *_service.py files so they have mtimes
    open(td + '/scripts/app.py', 'w').write('# placeholder')
    open(td + '/scripts/upload_service.py', 'w').write('# placeholder')
    r = c.get('/api/version')
    j = r.get_json()
    test('9a. /api/version 200',                      r.status_code == 200)
    test('9b. /api/version reports app.py NOT null',  j.get('app.py') is not None, str(j.get('app.py')))
    test('9c. /api/version reports services',         'upload_service.py' in j, str(list(j)))

    # ---- broad sweep: NO route returns html-500 for a basic GET ------
    skip = {
        '/static/<path:filename>',          # flask built-in
        '/api/upload-bundle-chunk',         # POST stream
        '/api/upload-bundle-finalize',      # POST stream
        '/api/upload-bundle',               # POST stream
        '/api/emergency-bootstrap',         # POST stream
        '/api/upload-file',                 # POST multipart
        '/api/save-image',                  # POST
        '/api/save-floor-plan',             # POST
        '/api/delete-file',                 # POST
        '/api/delete-directory',            # POST
        '/api/move-file',                   # POST
        '/api/create-directory',            # POST
        '/api/init-directories',            # POST
        '/api/save-equipment-schema',       # POST (already covered)
        '/api/save-map-config',             # POST (already covered)
        '/api/save-config',                 # POST
        '/api/download-bundle',             # POST
        '/api/write-point',                 # POST
        '/api/forecast-write-now',          # POST
        '/api/band-csv/regenerate',         # POST
    }
    sweep_failures = []
    for rule in app.url_map.iter_rules():
        path = rule.rule
        if path in skip or '<' in path:     # skip dynamic + POST-only
            continue
        if 'GET' not in rule.methods:
            continue
        rr = c.get(path)
        if _is_html_500(rr):
            sweep_failures.append(path)
    test(f'10. broad sweep: 0 HTML-500 leaks across {len(list(app.url_map.iter_rules()))} routes',
         not sweep_failures, 'leaks: ' + ', '.join(sweep_failures))


print()
print(f'PASSED: {len(PASSED)}  FAILED: {len(FAILED)}')
if FAILED:
    for n, i in FAILED:
        print(f'  - {n}: {i}')
    sys.exit(1)
