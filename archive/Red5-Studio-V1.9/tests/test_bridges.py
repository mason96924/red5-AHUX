"""End-to-end test of the AHU data bridges (webhook + MQTT + Modbus + WS).

Strategy:
  - Boot the Flask app under tempfile DATA_ROOT/SCRIPTS_ROOT (same harness as
    test_repair_mode.py / test_reload_module.py).
  - Verify _bridges_lib config load/save/merge + write-queue ACL.
  - Verify each *_bridge_service module imports cleanly even when its
    optional library is missing (graceful degradation).
  - Verify bridges_admin_service exposes /api/bridges/{status,config}.
  - Verify webhook bridge actually POSTs telemetry to a captured local URL.
"""
import os, sys, json, time, tempfile, io, contextlib, threading
from urllib.parse import urlparse
import http.server, socketserver

# ---------- harness ----------
td = tempfile.mkdtemp(prefix="red5_bridges_")
os.makedirs(td + "/scripts", exist_ok=True)
os.makedirs(td + "/data", exist_ok=True)
os.makedirs(td + "/data/pgpy", exist_ok=True)
os.makedirs(td + "/data/configs", exist_ok=True)

# Copy the bridge plug-ins + _bridges_lib into the fake PLUGINS_ROOT so
# auto-discovery picks them up.
import shutil
SRC_DIR = '/app/archive/Red5-Studio-V1.9'
for f in ('_bridges_lib.py', 'webhook_bridge_service.py',
          'mqtt_bridge_service.py', 'modbus_bridge_service.py',
          'ws_bridge_service.py', 'bridges_admin_service.py'):
    shutil.copy(os.path.join(SRC_DIR, f), os.path.join(td, 'data', 'pgpy', f))

# Patch DATA_ROOT path inside the copied _bridges_lib so it points to our temp.
lib_path = os.path.join(td, 'data', 'pgpy', '_bridges_lib.py')
with open(lib_path, 'r') as f:
    lib_src = f.read()
lib_src = lib_src.replace("DATA_ROOT     = '/root/data'",
                          "DATA_ROOT     = %r" % os.path.join(td, 'data'))
with open(lib_path, 'w') as f:
    f.write(lib_src)

sys.path.insert(0, SRC_DIR)
sys.path.insert(0, os.path.join(td, 'data', 'pgpy'))   # so _bridges_lib import works

src = open(os.path.join(SRC_DIR, 'app.py')).read()
src = src.replace("/root/data", td + "/data").replace("/root/scripts", td + "/scripts")
src = src.replace("app.run(host=HOST, port=PORT, threaded=True, debug=False)", "pass")
ns = {'__name__': '__test__', '__file__': os.path.join(SRC_DIR, 'app.py')}
with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
    exec(compile(src, '/tmp/fakeapp_bridges.py', 'exec'), ns)
app = ns['app']

PASSED, FAILED = [], []
def test(name, ok, info=''):
    (PASSED if ok else FAILED).append((name, info))
    print(('PASS ' if ok else 'FAIL '), name, '-', info if not ok else '')

import _bridges_lib as bl

# ---------- 1. Config load/save/merge ----------
print("\n-- 1. Config load / save / merge --")
cfg0 = bl.load_bridges_config()
test('1a. default config has all 4 bridges',
     all(k in cfg0 for k in ('mqtt', 'webhook', 'modbus', 'websocket')))
test('1b. all four default to disabled',
     not any(cfg0[k]['enabled'] for k in cfg0))

# Save with one enabled — verify persistence + that unknown keys are rejected.
new_cfg = dict(cfg0)
new_cfg['webhook'] = dict(new_cfg['webhook'])
new_cfg['webhook']['enabled'] = True
new_cfg['webhook']['url'] = 'http://example/ingest'
new_cfg['webhook']['this_is_an_unknown_key'] = 'should be dropped'
saved = bl.save_bridges_config(new_cfg)
test('1c. save returns cleaned config', saved['webhook']['enabled'])
test('1d. save drops unknown keys',
     'this_is_an_unknown_key' not in saved['webhook'])
reloaded = bl.load_bridges_config()
test('1e. round-trip persists', reloaded['webhook']['url'] == 'http://example/ingest')

# Reset for subsequent tests.
new_cfg['webhook']['enabled'] = False
bl.save_bridges_config(new_cfg)

# ---------- 2. Telemetry tap ----------
print("\n-- 2. Telemetry snapshot --")
test('2a. snapshot returns (None,0) when no telemetry file yet',
     bl.snapshot_telemetry() == (None, 0))
sample = {'ahu': {'AHU01': {'sa_t': 13.2, 'oa_t': 8.1, 'fan_speed': 65, 'band': 'B5'}}}
with open(os.path.join(td, 'data', 'telemetry.json'), 'w') as f:
    json.dump(sample, f)
snap, mtime = bl.snapshot_telemetry()
test('2b. snapshot reads written telemetry', snap == sample and mtime > 0)

# ---------- 3. Write-queue ACL ----------
print("\n-- 3. Write-queue ACL --")
ok, info = bl.enqueue_write('AV1', 22.5, 'mqtt', allowlist=[])
test('3a. empty allowlist → write refused', not ok and 'read-only' in info)
ok, info = bl.enqueue_write('AV1', 22.5, 'mqtt', allowlist=['AV1'])
test('3b. allowlisted write enqueues', ok)
with open(os.path.join(td, 'data', 'configs', 'write_queue.json')) as f:
    q = json.load(f)
test('3c. queue has 1 entry, source=bridge:mqtt',
     len(q) == 1 and q[0]['source'] == 'bridge:mqtt' and q[0]['object_id'] == 'AV1')
ok, info = bl.enqueue_write('AV2', 22.5, 'mqtt', allowlist=['AV1'])
test('3d. non-allowlisted target refused even if other targets are allowed',
     not ok and 'AV2' in info)
ok, info = bl.enqueue_write('', 22.5, 'mqtt', allowlist=['AV1'])
test('3e. empty object_id refused', not ok)

# ---------- 4. Each bridge module imports cleanly ----------
print("\n-- 4. Bridge plug-in modules --")
import importlib
for mod_name in ('webhook_bridge_service', 'mqtt_bridge_service',
                 'modbus_bridge_service', 'ws_bridge_service',
                 'bridges_admin_service'):
    sys.modules.pop(mod_name, None)   # force fresh import
    try:
        m = importlib.import_module(mod_name)
        test('4. import ' + mod_name, hasattr(m, 'register'))
    except Exception as e:
        test('4. import ' + mod_name, False, str(e))

# ---------- 5. mqtt/modbus/ws bridges report lib_available=False if libs missing ----------
print("\n-- 5. Graceful degradation when optional libs missing --")
# These libs are NOT installed in CI by default, so lib_available should be False.
import mqtt_bridge_service, modbus_bridge_service, ws_bridge_service
# Trigger the lazy import once.
mqtt_bridge_service._try_import_paho()
modbus_bridge_service._try_import_pymodbus()
ws_bridge_service._try_import_websockets()
test('5a. mqtt status reports lib_available bool',
     mqtt_bridge_service.get_status().get('lib_available') in (True, False))
test('5b. modbus status reports lib_available bool',
     modbus_bridge_service.get_status().get('lib_available') in (True, False))
test('5c. ws status reports lib_available bool',
     ws_bridge_service.get_status().get('lib_available') in (True, False))

# ---------- 6. Admin endpoints (mounted via auto-discovery) ----------
print("\n-- 6. Admin endpoints --")
with app.test_client() as c:
    r = c.get('/api/bridges/config')
    j = r.get_json() or {}
    test('6a. GET /api/bridges/config returns 200', r.status_code == 200)
    test('6b. config has 4 bridge keys',
         all(k in (j.get('config') or {}) for k in ('mqtt','webhook','modbus','websocket')))

    r = c.get('/api/bridges/status')
    j = r.get_json() or {}
    test('6c. GET /api/bridges/status returns 200', r.status_code == 200)
    bridges = j.get('bridges') or {}
    test('6d. status includes all 4 bridges',
         all(k in bridges for k in ('mqtt','webhook','modbus','websocket')))

    # POST a new config — verify cleanup & persistence.
    new = bl.load_bridges_config()
    new['webhook']['url']     = 'http://test.local/ingest'
    new['webhook']['enabled'] = True
    r = c.post('/api/bridges/config',
               data=json.dumps(new), content_type='application/json')
    j = r.get_json() or {}
    test('6e. POST /api/bridges/config returns 200', r.status_code == 200)
    test('6f. round-trip saved url', j.get('config', {}).get('webhook', {}).get('url') == 'http://test.local/ingest')
    test('6g. POST response includes restart-or-reload note',
         'reload-module' in (j.get('note') or ''))

    # Bad body
    r = c.post('/api/bridges/config', data='not json', content_type='application/json')
    test('6h. POST with non-dict body returns 400', r.status_code == 400)

# ---------- 7. Webhook bridge actually POSTs to a captured local URL ----------
print("\n-- 7. Webhook bridge end-to-end POST --")
captured = []

class _Catcher(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        ln = int(self.headers.get('Content-Length') or 0)
        body = self.rfile.read(ln).decode('utf-8') if ln else ''
        captured.append({'path': self.path,
                         'auth': self.headers.get('Authorization'),
                         'body': body})
        self.send_response(204); self.end_headers()
    def log_message(self, *_a, **_k): pass

httpd = socketserver.TCPServer(('127.0.0.1', 0), _Catcher)
port  = httpd.server_address[1]
srv_t = threading.Thread(target=httpd.serve_forever, daemon=True); srv_t.start()

try:
    # Configure webhook to hit our test server.
    cfg = bl.load_bridges_config()
    cfg['webhook'].update({'enabled': True,
                           'url': 'http://127.0.0.1:%d/ingest' % port,
                           'bearer_token': 'unit-test-token',
                           'publish_interval_s': 5,
                           'timeout_s': 2})
    bl.save_bridges_config(cfg)

    # Drive one publish cycle directly (skip the thread/sleep dance).
    import webhook_bridge_service as ws
    ws._publish_once(bl.load_bridges_config()['webhook'])

    test('7a. webhook POST hit our test server', len(captured) == 1, str(captured))
    if captured:
        sent = captured[0]
        test('7b. URL path correct', sent['path'] == '/ingest')
        test('7c. Authorization header carries bearer token',
             sent['auth'] == 'Bearer unit-test-token')
        body = json.loads(sent['body'] or '{}')
        test('7d. body has telemetry key',
             isinstance(body.get('telemetry'), dict)
             and 'ahu' in body['telemetry'])
    test('7e. status counts the publish',
         ws.get_status()['publish_count'] >= 1)
    test('7f. status records HTTP 204', ws.get_status()['last_status_code'] == 204)
finally:
    httpd.shutdown()

print('\nSUMMARY:', len(PASSED), 'passed,', len(FAILED), 'failed')
if FAILED:
    sys.exit(1)
shutil.rmtree(td, ignore_errors=True)
