"""Regression test for self-healing service-module relocation.

If an operator (or a buggy emergency-bootstrap extractor) drops
`upload_service.py`, `weather_service.py`, etc. into DATA_ROOT instead
of SCRIPTS_ROOT, app.py boot-time logic must:

  1. Detect the misplaced file(s).
  2. Move them to SCRIPTS_ROOT.
  3. Pick the newer copy if both exist (keeping the older as `.bak`).
  4. Remove the stale DATA_ROOT copy if the SCRIPTS_ROOT copy is newer.
  5. Then the auto-discovery loop registers them normally so the
     controller boots fully even though the bundle was extracted to
     the wrong place.

This is the regression that bit a real controller on 2026-05-08:
operator uploaded a bundle, only `app.py` ended up in /root/scripts/
(the other 7 .py files landed in /root/data/), services failed to
register, dashboard saw HTML 500s.  The self-heal step makes the boot
idempotent — next restart fixes it without operator intervention.
"""
import os, sys, tempfile, contextlib, io, shutil, time

td = tempfile.mkdtemp(prefix="red5_selfheal_")
os.makedirs(td + "/scripts", exist_ok=True)
os.makedirs(td + "/data/configs", exist_ok=True)

sys.path.insert(0, '/app/archive/Red5-Studio-V1.9')

# Copy the real service modules into DATA_ROOT (the *wrong* place) so
# we can verify the self-heal step migrates them to PLUGINS_ROOT.
SRC = '/app/archive/Red5-Studio-V1.9'
for svc in ('upload_service.py', 'weather_service.py',
            'band_service.py', 'telemetry_service.py'):
    shutil.copy(os.path.join(SRC, svc), td + '/data/' + svc)

# ALSO drop one stale copy in PLUGINS_ROOT — older mtime — to check
# the "DATA_ROOT copy is newer" branch picks the newer version.
os.makedirs(td + '/data/pgpy', exist_ok=True)
shutil.copy(os.path.join(SRC, 'band_service.py'), td + '/data/pgpy/band_service.py')
old = time.time() - 86400  # 1 day ago
os.utime(td + '/data/pgpy/band_service.py', (old, old))

src = open(SRC + '/app.py').read()
src = src.replace("/root/data", td + "/data").replace("/root/scripts", td + "/scripts")
src = src.replace("app.run(host=HOST, port=PORT, threaded=True, debug=False)", "pass")

os.environ['RED5_DISABLE_BG_THREADS'] = '1'
ns = {'__name__': '__test__', '__file__': td + '/scripts/app.py'}
buf = io.StringIO()
with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
    exec(compile(src, '/tmp/fakeapp_selfheal.py', 'exec'), ns)
log = buf.getvalue()
app = ns['app']

PASSED, FAILED = [], []
def test(name, ok, info=''):
    (PASSED if ok else FAILED).append((name, info))
    print(('PASS ' if ok else 'FAIL '), name, ('- ' + info) if (info and not ok) else '')


# 1. After self-heal, the 4 service modules MUST exist in PLUGINS_ROOT.
for svc in ('upload_service.py', 'weather_service.py',
            'band_service.py', 'telemetry_service.py'):
    test(f'1. {svc} migrated to PLUGINS_ROOT',
         os.path.isfile(td + '/data/pgpy/' + svc),
         'missing at ' + td + '/data/pgpy/' + svc)

# 2. After self-heal, the 4 service modules MUST be GONE from DATA_ROOT
#    (no duplicates left to confuse future operators).
for svc in ('upload_service.py', 'weather_service.py',
            'telemetry_service.py'):
    test(f'2. {svc} removed from DATA_ROOT',
         not os.path.isfile(td + '/data/' + svc),
         'still present in DATA_ROOT')

# 3. The newer-DATA_ROOT-copy branch: band_service.py was newer in DATA_ROOT
#    than the stale 1-day-old copy in PLUGINS_ROOT.  Self-heal must have
#    KEPT the new one and renamed the stale to .bak.
test('3a. stale band_service.py kept as .bak',
     os.path.isfile(td + '/data/pgpy/band_service.py.bak'),
     'no .bak found')

# 4. Boot log should show explicit self-heal lines.
test('4a. self-heal log present',
     '[self-heal]' in log,
     'no self-heal log lines emitted')
test('4b. self-heal mentions migration',
     'migrated' in log or 'replaced' in log,
     'self-heal log missing migrate/replace verbs')

# 5. After self-heal + auto-discovery, all 4 services should be registered.
rules = {r.rule for r in app.url_map.iter_rules()}
test('5a. /api/data registered (telemetry_service)',     '/api/data' in rules)
test('5b. /api/weather-history registered (weather)',    '/api/weather-history' in rules)
test('5c. /api/band-csv/<ahu_id> registered (band)',     '/api/band-csv/<ahu_id>' in rules)
test('5d. /update registered (upload_service, NOT emergency fallback)',
     '/update' in rules)
test('5e. /api/upload-bundle-chunk registered (streaming)',
     '/api/upload-bundle-chunk' in rules)

# 6. Boot should NOT have fallen back to the emergency bootstrap.
test('6a. emergency bootstrap NOT activated',
     'bootstrap-fallback' not in log,
     log[-500:])

print()
print(f'PASSED: {len(PASSED)}  FAILED: {len(FAILED)}')
if FAILED:
    print('\n--- BOOT LOG ---')
    print(log)
    for n, i in FAILED:
        print(f'  - {n}: {i}')
    sys.exit(1)
