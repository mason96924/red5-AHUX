"""Test the dibt-free write-queue architecture (2026-05-08).

Background:
  /api/write-point used to call dibt.Write() directly.  But dibt is the
  Delta Controls native binding and only exists when a script runs as
  an enteliWEB-registered "object" — Python plug-ins auto-loaded by
  Flask cannot import it.  The fix splits write commands into two
  hops:

    1. /api/write-point appends a JSON entry to write_queue.json and
       returns success immediately ("queued").
    2. collector.py (which IS an enteliWEB object with dibt available)
       drains the queue on each poll cycle, executes dibt.Write(), and
       writes audit records to write_results.json.

Tests:
  1. /api/write-point appends to write_queue.json (no dibt needed).
  2. The queue entry contains all the fields collector expects.
  3. The Flask response is {"success": true, "queued": true, ...}.
  4. collector.process_write_queue() drains the queue and produces
     audit records in write_results.json.
  5. Mock-mode and dibt-unavailable branches both produce a record.
  6. Real dibt is invoked in a smoke test where we inject a fake
     dibt module into globals().
  7. write_results.json is capped at WRITE_RESULTS_MAX entries.
"""
import os, sys, tempfile, contextlib, io, json, importlib

td = tempfile.mkdtemp(prefix="red5_writequeue_")
os.makedirs(td + "/scripts", exist_ok=True)
os.makedirs(td + "/data/configs", exist_ok=True)
os.makedirs(td + "/data/pgpy", exist_ok=True)

sys.path.insert(0, '/app/archive/Red5-Studio-V1.9')

# Seed the configs so /api/write-point can resolve the equipment.
open(td + '/data/configs/collector_config.json', 'w').write(json.dumps({
    'ahu_groups': {'AHU01': {'csv_object': 'CSV_AHU01', 'vavs': ['VAV01']}}
}))
open(td + '/data/configs/equipment_types.json', 'w').write(json.dumps({
    'ahu_types': {'1': {'name': 'Std AHU', 'points': [
        {'label': 'OAD', 'access': 'RW'},
        {'label': 'SATSP', 'access': 'RW'},
    ]}},
    'vav_types': {'1': {'name': 'Std VAV', 'points': [
        {'label': 't', 'access': 'RO'},
        {'label': 'Sp', 'access': 'RW'},
    ]}}
}))
open(td + '/data/configs/map_config.json', 'w').write(json.dumps({
    'floors': [{'name': 'F1', 'markers': [
        {'name': 'AHU01',  'type': 'ahu', 'equipment_type_id': '1'},
        {'name': 'VAV01',  'type': 'vav', 'equipment_type_id': '1'},
    ]}]
}))

src = open('/app/archive/Red5-Studio-V1.9/app.py').read()
src = src.replace("/root/data", td + "/data").replace("/root/scripts", td + "/scripts")
src = src.replace("app.run(host=HOST, port=PORT, threaded=True, debug=False)", "pass")

os.environ['RED5_DISABLE_BG_THREADS'] = '1'
ns = {'__name__': '__test__', '__file__': '/app/archive/Red5-Studio-V1.9/app.py'}
with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
    exec(compile(src, '/tmp/fakeapp_writequeue.py', 'exec'), ns)
app = ns['app']

PASSED, FAILED = [], []
def test(name, ok, info=''):
    (PASSED if ok else FAILED).append((name, info))
    print(('PASS ' if ok else 'FAIL '), name, ('- ' + info) if (info and not ok) else '')


# ---------- 1. /api/write-point queues without invoking dibt ----------
queue_path = td + '/data/configs/write_queue.json'
test('1a. queue file does not yet exist', not os.path.isfile(queue_path))

with app.test_client() as c:
    r = c.post('/api/write-point',
               data=json.dumps({'equipment_name': 'AHU01', 'writes': {'OAD': 75}}),
               content_type='application/json')
    j = r.get_json()
    test('1b. /api/write-point status 200',  r.status_code == 200, str(r.status_code))
    test('1c. response success=True',        j and j.get('success') is True, str(j))
    test('1d. response queued=True',         j and j.get('queued') is True, str(j))
    test('1e. response includes queue_id',   j and bool(j.get('queue_id')), str(j))
    test('1f. response csv_object correct',  j and j.get('csv_object') == 'CSV_AHU01')
    test('1g. response csv_value ends with *', j and j.get('csv_value', '').endswith('*'))

# Now the queue file MUST exist with one entry
test('2a. queue file written',           os.path.isfile(queue_path))
with open(queue_path) as f:
    queue = json.load(f)
test('2b. queue is a list of length 1',  isinstance(queue, list) and len(queue) == 1)
entry = queue[0]
test('2c. entry has csv_object',         entry.get('csv_object') == 'CSV_AHU01')
test('2d. entry has csv_value',          'csv_value' in entry)
test('2e. entry has equip_name',         entry.get('equip_name') == 'AHU01')
test('2f. entry has writes dict',        entry.get('writes') == {'OAD': 75})
test('2g. entry has timestamp',          isinstance(entry.get('ts'), (int, float)))
test('2h. entry has source label',       entry.get('source') == '/api/write-point')

# ---------- 3. A second write appends to the same queue ----------
with app.test_client() as c:
    r2 = c.post('/api/write-point',
                data=json.dumps({'equipment_name': 'VAV01', 'writes': {'Sp': 22}}),
                content_type='application/json')
test('3a. second /api/write-point 200',   r2.status_code == 200)
with open(queue_path) as f:
    queue = json.load(f)
test('3b. queue now has 2 entries',       len(queue) == 2)
test('3c. second entry has equip_name=VAV01', queue[1].get('equip_name') == 'VAV01')

# ---------- 4. collector.process_write_queue() drains queue ----------
# Patch collector's CONFIG_DIR to point at our test dir, then import.
src_collector = open('/app/archive/Red5-Studio-V1.9/collector.py').read()
src_collector = src_collector.replace("/root/data", td + "/data")
collector_ns = {'__name__': '__not_main__', '__file__': td + '/scripts/collector.py'}
# Strip the unconditional `main()` call at the end so the import doesn't run forever
src_collector = src_collector.replace('\nmain()\n', '\n# main() suppressed in tests\n')
with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
    exec(compile(src_collector, '/tmp/fake_collector.py', 'exec'), collector_ns)

processed = collector_ns['process_write_queue'](mock_mode=True)
test('4a. process_write_queue returns 2',  processed == 2, str(processed))

# Queue should now be empty
with open(queue_path) as f:
    queue_after = json.load(f)
test('4b. queue drained after processing', queue_after == [], str(queue_after))

# Results file should have 2 entries
results_path = td + '/data/configs/write_results.json'
test('4c. write_results.json created',     os.path.isfile(results_path))
with open(results_path) as f:
    results = json.load(f)
test('4d. results contains 2 records',     len(results) == 2, str(len(results)))
test('4e. result 1 success=True',          results[0].get('success') is True)
test('4f. result 1 mock=True (mock_mode)', results[0].get('mock') is True)
test('4g. result has completed timestamp', isinstance(results[0].get('completed'), (int, float)))
test('4h. result preserves queue id',      results[0].get('id') == entry['id'])

# ---------- 5. Real dibt path: inject a fake dibt module ----------
class FakeDibtError(BaseException): pass
class FakeDibt:
    Error = FakeDibtError
    last_call = None
    @staticmethod
    def Write(ref, Value):
        FakeDibt.last_call = (ref, Value)
        return True   # success sentinel (not a FakeDibtError)
collector_ns['dibt'] = FakeDibt

# Push another queued write
with app.test_client() as c:
    c.post('/api/write-point',
           data=json.dumps({'equipment_name': 'AHU01', 'writes': {'SATSP': 18}}),
           content_type='application/json')

processed = collector_ns['process_write_queue'](mock_mode=False)
test('5a. process_write_queue returns 1',  processed == 1)
test('5b. dibt.Write was actually called', FakeDibt.last_call is not None,
     str(FakeDibt.last_call))
test('5c. dibt.Write ref ends with .Present_Value',
     FakeDibt.last_call and FakeDibt.last_call[0].endswith('.Present_Value'))

with open(results_path) as f:
    results = json.load(f)
real_result = results[-1]
test('5d. real-mode result success=True',  real_result.get('success') is True, str(real_result))
test('5e. real-mode result mock NOT set',  real_result.get('mock') is None, str(real_result))

# ---------- 6. dibt error path ----------
class FakeDibtFail:
    Error = FakeDibtError
    @staticmethod
    def Write(ref, Value):
        return FakeDibtError('hardware-fault-12')
collector_ns['dibt'] = FakeDibtFail

with app.test_client() as c:
    c.post('/api/write-point',
           data=json.dumps({'equipment_name': 'AHU01', 'writes': {'OAD': 30}}),
           content_type='application/json')
collector_ns['process_write_queue'](mock_mode=False)
with open(results_path) as f:
    results = json.load(f)
err_result = results[-1]
test('6a. dibt error captured success=False', err_result.get('success') is False)
test('6b. dibt error message in record',      'hardware-fault-12' in str(err_result.get('error', '')),
     str(err_result))

# ---------- 7. Result ring buffer cap ----------
WRITE_RESULTS_MAX = collector_ns['WRITE_RESULTS_MAX']
# Push WRITE_RESULTS_MAX + 50 writes
import time as _t
big_queue = [
    {'id': 'mass-' + str(i), 'ts': _t.time(), 'csv_object': 'CSV_AHU01',
     'csv_value': str(i), 'equip_name': 'AHU01', 'writes': {'OAD': i},
     'source': 'test'}
    for i in range(WRITE_RESULTS_MAX + 50)
]
collector_ns['_atomic_write_json'](queue_path, big_queue)
collector_ns['process_write_queue'](mock_mode=True)
with open(results_path) as f:
    results = json.load(f)
test('7a. results capped at WRITE_RESULTS_MAX', len(results) == WRITE_RESULTS_MAX,
     'len=' + str(len(results)))
# Newest entries kept (ring buffer = trim oldest)
test('7b. ring buffer keeps newest',
     results[-1].get('id', '').startswith('mass-' + str(WRITE_RESULTS_MAX + 49)),
     results[-1].get('id'))


print()
print(f'PASSED: {len(PASSED)}  FAILED: {len(FAILED)}')
if FAILED:
    for n, i in FAILED:
        print(f'  - {n}: {i}')
    sys.exit(1)
