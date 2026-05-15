"""Test the BACnet config diagnose service + collector write-time
   defensive warning for name-based csv_object targets."""
import os
import sys
import io
import json
import tempfile
import shutil
import contextlib

td = tempfile.mkdtemp(prefix="red5_bacnet_diag_")
os.makedirs(td + "/scripts", exist_ok=True)
os.makedirs(td + "/data", exist_ok=True)
os.makedirs(td + "/data/pgpy", exist_ok=True)
os.makedirs(td + "/data/configs", exist_ok=True)

# Drop a mixed-quality collector_config.json on disk.
config = {
    "version": "1.1",
    "interval": 5,
    "mock_mode": True,
    "ahu_groups": {
        "AHU-01": {"csv_object": "CSV1", "vavs": []},      # ID — good
        "AHU-02": {"csv_object": "AV23", "vavs": []},      # ID — good
        "AHU-03": {"csv_object": "AHU03_CMD", "vavs": []}, # NAME — broken
        "AHU-04": {"csv_object": "", "vavs": []},          # MISSING
        "AHU-05": {"csv_object": "MSV5", "vavs": []},      # ID — good
    },
}
open(td + "/data/configs/collector_config.json", "w").write(json.dumps(config))

sys.path.insert(0, '/app/archive/Red5-Studio-V1.9')
os.environ['RED5_DISABLE_BG_THREADS'] = '1'

src = open('/app/archive/Red5-Studio-V1.9/app.py').read()
src = src.replace("/root/data", td + "/data").replace("/root/scripts", td + "/scripts")
src = src.replace("app.run(host=HOST, port=PORT, threaded=True, debug=False)", "pass")
ns = {'__name__': '__test__', '__file__': '/app/archive/Red5-Studio-V1.9/app.py'}
with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
    exec(compile(src, '/tmp/fakeapp_bacnet.py', 'exec'), ns)
app = ns['app']

PASSED = []; FAILED = []
def t(name, ok, info=''):
    (PASSED if ok else FAILED).append((name, info))
    print(('PASS ' if ok else 'FAIL '), name, '-', info if not ok else '')

with app.test_client() as c:
    # 1. /api/bacnet/diagnose-config — JSON report
    r = c.get('/api/bacnet/diagnose-config')
    t('1a. JSON status 200', r.status_code == 200, str(r.status_code))
    j = r.get_json() or {}
    t('1b. success true', j.get('success') is True, str(j)[:160])
    t('1c. total_ahus = 5', j.get('total_ahus') == 5, str(j.get('total_ahus')))
    t('1d. bad_count = 2 (NAME + MISSING)', j.get('bad_count') == 2, str(j.get('bad_count')))
    t('1e. healthy false', j.get('healthy') is False, str(j.get('healthy')))
    totals = j.get('totals') or {}
    t('1f. totals.id = 3',      totals.get('id') == 3,      str(totals))
    t('1g. totals.name = 1',    totals.get('name') == 1,    str(totals))
    t('1h. totals.missing = 1', totals.get('missing') == 1, str(totals))

    # Per-AHU classification
    by_ahu = {a['ahu']: a for a in j.get('ahus', [])}
    t('1i. AHU-01 -> ID',      by_ahu.get('AHU-01', {}).get('kind') == 'ID')
    t('1j. AHU-03 -> NAME',    by_ahu.get('AHU-03', {}).get('kind') == 'NAME')
    t('1k. AHU-04 -> MISSING', by_ahu.get('AHU-04', {}).get('kind') == 'MISSING')
    t('1l. AHU-03 has suggestion', bool(by_ahu.get('AHU-03', {}).get('suggestion')))

    # 2. TSV skeleton endpoint
    r = c.get('/api/bacnet/diagnose-config/csv')
    t('2a. CSV status 200', r.status_code == 200, str(r.status_code))
    body = r.get_data(as_text=True)
    t('2b. body has AHU-03 row', 'AHU-03' in body and 'NAME' in body, body[:200])
    t('2c. body has TAB separator', '\t' in body)

    # 3. Edge case — missing file
    os.unlink(td + "/data/configs/collector_config.json")
    r = c.get('/api/bacnet/diagnose-config')
    t('3a. missing-file still 200 (treated as empty)', r.status_code == 200, str(r.status_code))
    j = r.get_json() or {}
    t('3b. empty config -> healthy true (0 AHUs)',
      j.get('healthy') is True and j.get('total_ahus') == 0, str(j))

    # 4. Edge case — malformed JSON
    open(td + "/data/configs/collector_config.json", "w").write("{not json")
    r = c.get('/api/bacnet/diagnose-config')
    j = r.get_json() or {}
    t('4a. parse error -> 500 success false',
      r.status_code == 500 and j.get('success') is False, str(j)[:160])

# 5. collector.py defensive write-time warning
# Restore valid config so collector loads cleanly.
open(td + "/data/configs/collector_config.json", "w").write(json.dumps(config))
# Drop a queued write targeting a NAME-based csv_object.
write_queue = [
    {"id": "test-1", "ts": 1700000000, "csv_object": "AHU03_CMD",
     "csv_value": "SAT=18", "equip_name": "AHU-03", "writes": [{"label": "SAT"}]},
    {"id": "test-2", "ts": 1700000001, "csv_object": "CSV1",
     "csv_value": "SAT=20", "equip_name": "AHU-01", "writes": [{"label": "SAT"}]},
]
open(td + "/data/configs/write_queue.json", "w").write(json.dumps(write_queue))

# Patch collector module-scoped paths and invoke process_write_queue in mock mode.
import importlib
import collector as col
col.CONFIG_DIR     = td + "/data/configs"
col.WRITE_QUEUE_PATH   = os.path.join(col.CONFIG_DIR, 'write_queue.json')
col.WRITE_RESULTS_PATH = os.path.join(col.CONFIG_DIR, 'write_results.json')

# Capture log output
log_buf = []
col.log = lambda *args: log_buf.append(' '.join(str(a) for a in args))
col.process_write_queue(mock_mode=True)
log_text = '\n'.join(log_buf)
t('5a. NAME-target warning emitted',
  'NAME-based target' in log_text and 'AHU03_CMD' in log_text,
  log_text[:300])
t('5b. ID-target (CSV1) did NOT trigger warning',
  log_text.count('NAME-based target') == 1,
  'count=' + str(log_text.count('NAME-based target')))

# Check the results file records target_kind
results = json.load(open(td + "/data/configs/write_results.json"))
t('5c. results recorded for both writes', len(results) == 2, str(len(results)))
kinds = sorted([r.get('target_kind') for r in results])
t('5d. target_kind labels = [ID, NAME]', kinds == ['ID', 'NAME'], str(kinds))

print()
print('SUMMARY:', len(PASSED), 'passed,', len(FAILED), 'failed')
shutil.rmtree(td, ignore_errors=True)
sys.exit(1 if FAILED else 0)
