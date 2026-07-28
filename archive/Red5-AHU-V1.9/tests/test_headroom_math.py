"""Sanity test: bundle-upload finalize headroom math now uses
   max(1 MB, largest_zip_member + 256 KB), not max(5 MB, zip_size * 2).

   We feed a tiny zip containing one ~1.6 MB file; with mock free-space
   barely above 1.85 MB the finalize MUST succeed.  With the OLD math,
   the same disk would have rejected it (needed 5 MB).
"""
import os, sys, io, tempfile, contextlib, zipfile, shutil

td = tempfile.mkdtemp(prefix="red5_headroom_")
os.makedirs(td + "/scripts", exist_ok=True)
os.makedirs(td + "/data", exist_ok=True)
os.makedirs(td + "/data/pgpy", exist_ok=True)

sys.path.insert(0, '/app/archive/Red5-AHU-V1.9')
os.environ['RED5_DISABLE_BG_THREADS'] = '1'

src = open('/app/archive/Red5-AHU-V1.9/app.py').read()
src = src.replace("/root/data", td + "/data").replace("/root/scripts", td + "/scripts")
src = src.replace("app.run(host=HOST, port=PORT, threaded=True, debug=False)", "pass")
ns = {'__name__': '__test__', '__file__': '/app/archive/Red5-AHU-V1.9/app.py'}
with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
    exec(compile(src, '/tmp/fakeapp_headroom.py', 'exec'), ns)
app = ns['app']

import upload_service as us

PASSED = []; FAILED = []
def t(name, ok, info=''):
    (PASSED if ok else FAILED).append((name, info))
    print(('PASS ' if ok else 'FAIL '), name, '-', info if not ok else '')

# Build a small in-memory zip with one ~1.6 MB member.
big_member = b'x' * (1_600_000)
zip_path = td + "/data/_uploads/test.zip"
os.makedirs(os.path.dirname(zip_path), exist_ok=True)
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_STORED) as zf:
    zf.writestr('configs/equipment_types.json', big_member)
    zf.writestr('dashboard.html', b'<html>hi</html>')
zsize = os.path.getsize(zip_path)
t('1a. test zip built', zsize > 1_500_000, str(zsize))

# Mock _check_free_space to report 4.8 MB free / 11.8k inodes (operator's
# observed reality on the controller).
calls = []
def fake_check_free_space(path, min_bytes=10*1024*1024, min_inodes=200):
    free_b, free_i = 4_800_000, 11800
    calls.append({'min_bytes': min_bytes, 'free_b': free_b, 'free_i': free_i})
    return (free_b >= min_bytes and free_i >= min_inodes), free_b, free_i
us._check_free_space = fake_check_free_space

# Call the finalize helper directly.
body, code = us._finalize_bundle_from_disk(zip_path, password='test')
t('2a. finalize returns 200', code == 200, str(code) + ' / ' + str(body)[:200])
t('2b. extraction succeeded', bool(body.get('success')), str(body)[:200])
t('2c. min_need <= 2 MB (new math)',
  calls[0]['min_bytes'] <= 2 * 1024 * 1024,
  'min_bytes=' + str(calls[0]['min_bytes']))
t('2d. min_need >= 1.85 MB (max_member + 256KB)',
  calls[0]['min_bytes'] >= 1_856_256,
  'min_bytes=' + str(calls[0]['min_bytes']))

# Confirm OLD math (max(5MB, zip_size * 2)) would have FAILED the same disk.
old_min_need = max(5 * 1024 * 1024, zsize * 2)
t('3a. old formula would have refused this deploy',
  old_min_need > 4_800_000,
  'old_min_need=' + str(old_min_need))

# Confirm chunk-upload pre-flight uses tighter formula too.
us._check_free_space = fake_check_free_space  # (re-bind defensively)
calls.clear()
with app.test_client() as c:
    # First chunk
    payload = b'a' * 100  # tiny
    r = c.post('/api/upload-bundle-chunk',
               data=payload,
               headers={
                   'Content-Type': 'application/octet-stream',
                   'X-Upload-Id': 'red5-test-headroom',
                   'X-Chunk-Index': '0',
                   'X-Total-Chunks': '1',
                   'X-Total-Size': str(zsize),
               })
    j = r.get_json() or {}
    t('4a. chunk pre-flight OK with 4.8 MB free for 1.6 MB upload',
      r.status_code == 200, str(r.status_code) + ' / ' + str(j))
    t('4b. chunk pre-flight need <= total_size + 1 MB + slack',
      calls and calls[0]['min_bytes'] <= zsize + 1_100_000,
      'need=' + str(calls[0]['min_bytes']) if calls else 'no call')

print()
print('SUMMARY:', len(PASSED), 'passed,', len(FAILED), 'failed')
shutil.rmtree(td, ignore_errors=True)
sys.exit(1 if FAILED else 0)
