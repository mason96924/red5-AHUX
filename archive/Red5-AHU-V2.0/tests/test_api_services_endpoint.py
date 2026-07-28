"""Test the /api/services runtime introspection endpoint.

This was added 2026-05-08 specifically to diagnose plug-in load failures
on the embedded controller (where stdout boot logs aren't always
captured).  An operator can hit GET /api/services and immediately see
which services registered OK, which were SKIPPED for missing
SERVICE_CTX keys, and which FAILED with the full exception traceback.

This exercise is what would have made the dibt-related telemetry_service
load failure obvious within seconds instead of an hour of guessing.
"""
import os, sys, tempfile, contextlib, io, json, shutil

td = tempfile.mkdtemp(prefix="red5_services_endpoint_")
os.makedirs(td + "/scripts", exist_ok=True)
os.makedirs(td + "/data/configs", exist_ok=True)
os.makedirs(td + "/data/pgpy", exist_ok=True)

sys.path.insert(0, '/app/archive/Red5-AHU-V1.9')

# Drop a synthetic broken plug-in into PLUGINS_ROOT so we get a FAILED
# entry to validate the FAILED branch of /api/services.
broken = '''
_service_dependencies = ['DATA_ROOT']
def register(app, ctx):
    raise RuntimeError("simulated init failure for /api/services test")
'''
with open(td + '/data/pgpy/zzz_broken_test_service.py', 'w') as f:
    f.write(broken)

# Drop another with a missing dep so we cover SKIPPED.
missing_dep = '''
_service_dependencies = ['NONEXISTENT_KEY']
def register(app, ctx):
    raise AssertionError("should never be called")
'''
with open(td + '/data/pgpy/zzz_skipped_test_service.py', 'w') as f:
    f.write(missing_dep)

# And one with no register() to cover WARNING.
no_register = '''
# Intentionally missing register()
'''
with open(td + '/data/pgpy/zzz_warning_test_service.py', 'w') as f:
    f.write(no_register)

src = open('/app/archive/Red5-AHU-V1.9/app.py').read()
src = src.replace("/root/data", td + "/data").replace("/root/scripts", td + "/scripts")
src = src.replace("app.run(host=HOST, port=PORT, threaded=True, debug=False)", "pass")

os.environ['RED5_DISABLE_BG_THREADS'] = '1'
ns = {'__name__': '__test__', '__file__': '/app/archive/Red5-AHU-V1.9/app.py'}
buf = io.StringIO()
with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
    exec(compile(src, '/tmp/fakeapp_services.py', 'exec'), ns)
boot_log = buf.getvalue()
app = ns['app']

PASSED, FAILED = [], []
def test(name, ok, info=''):
    (PASSED if ok else FAILED).append((name, info))
    print(('PASS ' if ok else 'FAIL '), name, ('- ' + info) if (info and not ok) else '')


with app.test_client() as c:
    r = c.get('/api/services')
    test('1. /api/services 200',          r.status_code == 200, str(r.status_code))
    test('2. /api/services returns JSON', r.is_json, r.data[:120].decode(errors='ignore'))

    j = r.get_json() or {}
    test('3. response has search_dirs',   'search_dirs' in j, str(j.keys()))
    test('4. response has services list', isinstance(j.get('services'), list), str(j.keys()))
    test('5. discovered count >= 4',      j.get('discovered', 0) >= 4, str(j.get('discovered')))

    by_name = {s['name']: s for s in j.get('services', [])}
    test('6a. upload_service     OK',     by_name.get('upload_service',     {}).get('state') == 'OK',
         str(by_name.get('upload_service')))
    test('6b. weather_service    OK',     by_name.get('weather_service',    {}).get('state') == 'OK')
    test('6c. band_service       OK',     by_name.get('band_service',       {}).get('state') == 'OK')
    test('6d. telemetry_service  OK',     by_name.get('telemetry_service',  {}).get('state') == 'OK')

    # 7. broken plug-in shows up as FAILED with a traceback.
    broken_entry = by_name.get('zzz_broken_test_service')
    test('7a. broken plug-in present',       broken_entry is not None, str(by_name.keys()))
    test('7b. broken plug-in state=FAILED',  broken_entry and broken_entry.get('state') == 'FAILED',
         str(broken_entry))
    test('7c. broken plug-in detail mentions RuntimeError',
         broken_entry and 'RuntimeError' in broken_entry.get('detail', ''),
         str(broken_entry.get('detail') if broken_entry else None))
    test('7d. broken plug-in includes traceback',
         broken_entry and 'simulated init failure' in (broken_entry.get('traceback') or ''),
         (broken_entry or {}).get('traceback', '')[:200])

    # 8. missing-dep plug-in shows up as SKIPPED.
    skipped_entry = by_name.get('zzz_skipped_test_service')
    test('8a. skipped plug-in state=SKIPPED', skipped_entry and skipped_entry.get('state') == 'SKIPPED',
         str(skipped_entry))
    test('8b. skipped plug-in detail mentions NONEXISTENT_KEY',
         skipped_entry and 'NONEXISTENT_KEY' in skipped_entry.get('detail', ''))

    # 9. no-register plug-in shows up as WARNING.
    warning_entry = by_name.get('zzz_warning_test_service')
    test('9a. warning plug-in state=WARNING',
         warning_entry and warning_entry.get('state') == 'WARNING',
         str(warning_entry))

    # 10. Boot log should contain the type-prefixed FAILED line for the broken plug-in.
    test('10. boot log includes [zzz_broken_test_service] FAILED',
         '[zzz_broken_test_service] FAILED to register: RuntimeError' in boot_log,
         boot_log[-400:])


print()
print(f'PASSED: {len(PASSED)}  FAILED: {len(FAILED)}')
if FAILED:
    print('\n--- BOOT LOG ---')
    print(boot_log)
    for n, i in FAILED:
        print(f'  - {n}: {i}')
    sys.exit(1)
