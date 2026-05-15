"""Regression test for PLUGINS_ROOT (/root/data/pgpy) routing.

The Delta Controls / enteliWEB controller firmware silently deletes any
.py file in /root/scripts/ that isn't a pre-registered enteliWEB
"object".  app.py is the one operator-managed exception (created via
enteliWEB once, then left alone).  All bundle-deployed plug-in scripts
must therefore land in PLUGINS_ROOT (/root/data/pgpy/), where the
firmware leaves them alone.

This test verifies:
  1. upload_service.py routes .py files to PLUGINS_ROOT (not SCRIPTS_ROOT).
  2. PLUGINS_ROOT is auto-created if missing.
  3. The extracted file's reported root label is 'pgpy'.
  4. Non-.py files still go to /root/data (e.g. configs, html, js).
  5. app.py is still excluded (bootloader protection).
  6. The plug-in is importable from PLUGINS_ROOT after extraction.
"""
import os, sys, tempfile, contextlib, io, zipfile, shutil

td = tempfile.mkdtemp(prefix="red5_pgpy_")
os.makedirs(td + "/scripts", exist_ok=True)
os.makedirs(td + "/data/configs", exist_ok=True)
# Deliberately do NOT pre-create /data/pgpy — the extractor must create it.

sys.path.insert(0, '/app/archive/Red5-Studio-V1.9')

src = open('/app/archive/Red5-Studio-V1.9/app.py').read()
src = src.replace("/root/data", td + "/data").replace("/root/scripts", td + "/scripts")
src = src.replace("app.run(host=HOST, port=PORT, threaded=True, debug=False)", "pass")

os.environ['RED5_DISABLE_BG_THREADS'] = '1'
ns = {'__name__': '__test__', '__file__': '/app/archive/Red5-Studio-V1.9/app.py'}
with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
    exec(compile(src, '/tmp/fakeapp_pgpy.py', 'exec'), ns)
app = ns['app']
import upload_service

# Synthetic bundle: 2 plug-ins + a config + an HTML page + a trojan app.py
bundle_buf = io.BytesIO()
with zipfile.ZipFile(bundle_buf, 'w') as zf:
    zf.writestr('app.py',                      b"raise SystemExit('TROJAN')\n")
    zf.writestr('mqtt_bridge_service.py',      b"_service_dependencies = ['DATA_ROOT']\n"
                                               b"def register(app, ctx): pass\n")
    zf.writestr('foo_service.py',              b"_service_dependencies = ['DATA_ROOT']\n"
                                               b"def register(app, ctx): pass\n")
    zf.writestr('configs/seed.json',           b'{"hello": "world"}')
    zf.writestr('dashboard.html',              b'<html>UI</html>')
    zf.writestr('js/widget.js',                b'console.log("ok")')
spool = td + '/spool.zip'
with open(spool, 'wb') as f:
    f.write(bundle_buf.getvalue())

extracted, skipped, errors = upload_service._extract_zip_streaming(spool)

PASSED, FAILED = [], []
def test(name, ok, info=''):
    (PASSED if ok else FAILED).append((name, info))
    print(('PASS ' if ok else 'FAIL '), name, ('- ' + info) if (info and not ok) else '')


# 1. PLUGINS_ROOT was auto-created by the extractor (or upload_service.register).
test('1a. PLUGINS_ROOT exists',
     os.path.isdir(td + '/data/pgpy'),
     'pgpy directory not created')

# 2. Both plug-ins ended up in PLUGINS_ROOT.
for svc in ('mqtt_bridge_service.py', 'foo_service.py'):
    test(f'2. {svc} in PLUGINS_ROOT',
         os.path.isfile(td + '/data/pgpy/' + svc),
         'missing at ' + td + '/data/pgpy/' + svc)

# 3. NEITHER plug-in is in SCRIPTS_ROOT (firmware-unsafe).
for svc in ('mqtt_bridge_service.py', 'foo_service.py'):
    test(f'3. {svc} NOT in SCRIPTS_ROOT (firmware-safe)',
         not os.path.isfile(td + '/scripts/' + svc),
         'leaked into SCRIPTS_ROOT')

# 4. NEITHER plug-in is loose in DATA_ROOT.
for svc in ('mqtt_bridge_service.py', 'foo_service.py'):
    test(f'4. {svc} NOT loose in DATA_ROOT',
         not os.path.isfile(td + '/data/' + svc),
         'leaked into DATA_ROOT (flat)')

# 5. The extractor's manifest reports root='pgpy' for each plug-in.
pgpy_entries = [e for e in extracted if e.get('root') == 'pgpy']
test('5a. manifest reports >=2 pgpy entries',
     len(pgpy_entries) >= 2, str(pgpy_entries))
pgpy_files = {e['file'] for e in pgpy_entries}
test('5b. manifest labels pgpy files with "pgpy/" prefix',
     all(f.startswith('pgpy/') for f in pgpy_files),
     str(pgpy_files))

# 6. app.py was rejected (bootloader protection).
skipped_app = [s for s in skipped if 'app.py' in s.get('file', '')]
test('6a. app.py blocked by bootloader protection',
     len(skipped_app) > 0, str(skipped))

# 7. configs/seed.json went to DATA_ROOT/configs/ (not pgpy).
test('7a. configs/seed.json in /data/configs/',
     os.path.isfile(td + '/data/configs/seed.json'),
     'config file misrouted')

# 8. dashboard.html went to DATA_ROOT root.
test('8a. dashboard.html in /data/',
     os.path.isfile(td + '/data/dashboard.html'),
     'html misrouted')

# 9. js/widget.js went to DATA_ROOT/js/.
test('9a. js/widget.js in /data/js/',
     os.path.isfile(td + '/data/js/widget.js'),
     'js misrouted')

# 10. The extracted plug-in must actually be importable from PLUGINS_ROOT
#     (this exercises the sys.path entry that app.py adds at boot).
sys.path.insert(0, td + '/data/pgpy')
try:
    import importlib
    if 'mqtt_bridge_service' in sys.modules:
        del sys.modules['mqtt_bridge_service']
    mod = importlib.import_module('mqtt_bridge_service')
    test('10. extracted plug-in is importable',
         hasattr(mod, 'register') and getattr(mod, '_service_dependencies', None) == ['DATA_ROOT'])
except Exception as ex:
    test('10. extracted plug-in is importable', False, str(ex))


print()
print(f'PASSED: {len(PASSED)}  FAILED: {len(FAILED)}')
if FAILED:
    print('--- extracted manifest ---')
    for e in extracted:
        print('  ', e)
    print('--- skipped ---')
    for s in skipped:
        print('  ', s)
    for n, i in FAILED:
        print(f'  - {n}: {i}')
    sys.exit(1)
