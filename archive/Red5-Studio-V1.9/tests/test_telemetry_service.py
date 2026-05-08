"""Regression tests for telemetry_service.py (extracted from app.py 2026-05-06)."""
import os, sys, tempfile, contextlib, io, json

td = tempfile.mkdtemp(prefix="red5_telemetry_")
os.makedirs(td + "/scripts", exist_ok=True)
os.makedirs(td + "/data/configs", exist_ok=True)

sys.path.insert(0, '/app/archive/Red5-Studio-V1.9')

src = open('/app/archive/Red5-Studio-V1.9/app.py').read()
src = src.replace("/root/data", td + "/data").replace("/root/scripts", td + "/scripts")
src = src.replace("app.run(host=HOST, port=PORT, threaded=True, debug=False)", "pass")

os.environ['RED5_DISABLE_BG_THREADS'] = '1'
ns = {'__name__': '__test__', '__file__': '/app/archive/Red5-Studio-V1.9/app.py'}
with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
    exec(compile(src, '/tmp/fakeapp.py', 'exec'), ns)
app = ns['app']
import telemetry_service

# Drop a synthetic collector_config + telemetry on disk
open(td + '/data/configs/collector_config.json', 'w').write(json.dumps({
    'ahu_groups': {'AHU01': {'csv_id': 1, 'vavs': ['VAV1', 'VAV2']}},
    'dashboard_point_map': {'ahu': {'oa_t': 'OAT'}, 'vav': {'zone_t': 't'}}
}))

PASSED, FAILED = [], []
def test(name, ok, info=''):
    (PASSED if ok else FAILED).append((name, info))
    print(('PASS ' if ok else 'FAIL '), name, '-', info if not ok else '')

with app.test_client() as c:
    # 1. /api/data-mode get + post + persist
    r = c.get('/api/data-mode')
    j = r.get_json()
    test('1a. data-mode GET 200',    r.status_code == 200, str(r.status_code))
    test('1b. default mode=simulator', j and j.get('mode') == 'simulator', str(j))

    r = c.post('/api/data-mode', data=json.dumps({'mode': 'mock'}),
               content_type='application/json')
    test('1c. POST mode=mock ok',    r.status_code == 200 and r.get_json().get('mode') == 'mock')

    r = c.post('/api/data-mode', data=json.dumps({'mode': 'invalid'}),
               content_type='application/json')
    test('1d. POST invalid mode -> 400', r.status_code == 400, str(r.status_code))

    # 2. /api/data — sim fallback (no telemetry.json)
    c.post('/api/data-mode', data=json.dumps({'mode': 'simulator'}),
           content_type='application/json')
    r = c.get('/api/data')
    j = r.get_json()
    test('2a. /api/data sim fallback 200', r.status_code == 200)
    test('2b. /api/data returns list',     isinstance(j, list), type(j).__name__)
    test('2c. /api/data has 1 AHU (from collector_config)',
         len(j) == 1 and j[0]['id'] == 'AHU01', str(j[:1]))
    test('2d. /api/data AHU has VAVs',
         len(j[0].get('vavs', [])) == 2, str(j[0].get('vavs')))
    test('2e. /api/data source=simulator_fallback',
         j[0].get('source') == 'simulator_fallback', str(j[0].get('source')))

    # 3. /api/data — mock mode (14 AHUs)
    r = c.get('/api/data?mode=mock')
    j = r.get_json()
    test('3a. /api/data mock mode 200',  r.status_code == 200)
    test('3b. /api/data mock returns 14 AHUs', len(j) == 14, str(len(j)))
    test('3c. /api/data mock source=mock',
         all(a.get('source') == 'mock' for a in j))

    # 4. /api/telemetry-status (no telemetry.json)
    r = c.get('/api/telemetry-status')
    j = r.get_json()
    test('4a. telemetry-status 200',     r.status_code == 200)
    test('4b. live=False (no file)',     j.get('live') is False, str(j))

    # 5. /api/telemetry-raw (no telemetry.json)
    r = c.get('/api/telemetry-raw')
    j = r.get_json()
    test('5a. telemetry-raw 200',        r.status_code == 200)
    test('5b. success=False (no file)',  j.get('success') is False)

    # 6. /api/collector-config GET + POST
    r = c.get('/api/collector-config')
    j = r.get_json()
    test('6a. collector-config GET 200', r.status_code == 200)
    test('6b. config has ahu_groups',
         'ahu_groups' in (j.get('config') or {}), str(j))

    new_cfg = {'ahu_groups': {'AHU99': {'csv_id': 99, 'vavs': ['V1']}}}
    r = c.post('/api/collector-config', data=json.dumps(new_cfg),
               content_type='application/json')
    test('6c. collector-config POST ok', r.status_code == 200 and r.get_json().get('success'))

    r = c.get('/api/collector-config')
    j = r.get_json()
    test('6d. POST persisted', 'AHU99' in (j.get('config') or {}).get('ahu_groups', {}),
         str(j))

    # 7. /api/collector-log (no log file)
    r = c.get('/api/collector-log')
    j = r.get_json()
    test('7a. collector-log 200 even without file', r.status_code == 200)
    test('7b. entries=[]', j.get('entries') == [])

    # 8. /api/write-point — equipment_types.json missing returns 404 (correct).
    # First restore AHU01 (test 6c overwrote ahu_groups), then drop the schema files.
    open(td + '/data/configs/collector_config.json', 'w').write(json.dumps({
        'ahu_groups': {'AHU01': {'csv_id': 1, 'csv_object': 'AV12.1', 'vavs': ['VAV1']}}
    }))
    open(td + '/data/configs/equipment_types.json', 'w').write(json.dumps({
        'ahu_types': {'1': {'name': 'AHU-T1', 'points': [{'label': 'OAD', 'access': 'RW'}]}},
        'vav_types': {}
    }))
    open(td + '/data/configs/map_config.json', 'w').write(json.dumps({
        'floors': [{'markers': [{'name': 'AHU01', 'type': 'ahu', 'equipment_type_id': 1}]}]
    }))
    r = c.post('/api/write-point',
               data=json.dumps({'equipment_name': 'AHU01', 'writes': {'OAD': 75}}),
               content_type='application/json')
    test('8a. write-point returns 200',  r.status_code == 200, str(r.status_code) + ' body=' + r.get_data(as_text=True)[:200])
    j = r.get_json()
    test('8b. write-point produces a response shape',
         j is not None and 'success' in j, str(j))

    # 9. /api/write-history
    r = c.get('/api/write-history')
    j = r.get_json()
    test('9a. write-history 200',         r.status_code == 200)
    test('9b. has history list',          'history' in j and isinstance(j['history'], list))

    # 10. /api/trend-history (no telemetry)
    r = c.get('/api/trend-history?point=zone_t')
    test('10a. trend-history 200',       r.status_code == 200)

    # 11. /api/equipment-points/<name> (no telemetry -> 404)
    r = c.get('/api/equipment-points/AHU01')
    test('11a. equipment-points 404 without telemetry', r.status_code == 404,
         str(r.status_code))

    # 12. All 10 routes registered
    rules = sorted({r.rule for r in app.url_map.iter_rules()
                    if any(k in r.rule for k in
                           ('/api/data', '/api/telemetry', '/api/collector',
                            '/api/write-', '/api/trend', '/api/equipment-points'))})
    expected = {
        '/api/data',
        '/api/data-mode',
        '/api/telemetry-status',
        '/api/telemetry-raw',
        '/api/collector-config',
        '/api/collector-log',
        '/api/write-point',
        '/api/equipment-points/<equipment_name>',
        '/api/write-history',
        '/api/trend-history',
    }
    test('12a. all telemetry routes registered',
         set(rules) == expected, 'extra/missing: ' + str(set(rules) ^ expected))

    # 13. DATA_ROOT correctly injected
    test('13a. telemetry_service.DATA_ROOT routed',
         telemetry_service.DATA_ROOT == td + '/data', telemetry_service.DATA_ROOT)
    test('13b. CONFIG_DIR derived from DATA_ROOT',
         telemetry_service.CONFIG_DIR == td + '/data/configs')
    test('13c. ahu_records injected',
         isinstance(telemetry_service.ahu_records, dict)
         and len(telemetry_service.ahu_records) == 14)

print()
print('SUMMARY:', len(PASSED), 'passed,', len(FAILED), 'failed')
if FAILED:
    sys.exit(1)
import shutil; shutil.rmtree(td, ignore_errors=True)
