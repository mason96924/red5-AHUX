"""End-to-end test of streaming-I/O upload + chunked endpoints.

Covers:
  1. Legacy /api/upload-bundle (multipart) — plain .zip
  2. Legacy /api/upload-bundle (multipart) — encrypted RED5ENC2 .red5
  3. Legacy /api/upload-bundle (json+base64) — plain .zip
  4. Chunked: /api/upload-bundle-chunk × N + /api/upload-bundle-finalize
  5. /api/disk-status (with and without cleanup=1)
  6. Error paths: invalid upload_id, size mismatch, wrong password,
     missing chunks
  7. Streaming-decrypt round-trip equivalence with the legacy
     decrypt_bundle() to prove the rewrite produces identical output.
"""
import os, sys, tempfile, io, zipfile, json, contextlib, base64

td = tempfile.mkdtemp(prefix="red5_stream_")
os.makedirs(td + "/scripts", exist_ok=True)
os.makedirs(td + "/data", exist_ok=True)

# Make upload_service.py findable BEFORE we exec the patched app.py
# (app.py imports upload_service near the top of its register() block).
sys.path.insert(0, '/app/archive/Red5-Studio-V1.9')

src = open('/app/archive/Red5-Studio-V1.9/app.py').read()
src = src.replace("/root/data", td + "/data").replace("/root/scripts", td + "/scripts")
src = src.replace("app.run(host=HOST, port=PORT, threaded=True, debug=False)", "pass")
ns = {'__name__': '__test__', '__file__': '/app/archive/Red5-Studio-V1.9/app.py'}
with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
    exec(compile(src, '/tmp/fakeapp.py', 'exec'), ns)
app = ns['app']
encrypt_bundle = ns['encrypt_bundle']
decrypt_bundle = ns['decrypt_bundle']
# Streaming helpers moved to upload_service.py (2026-05-06 split).
import upload_service
_decrypt_bundle_to_file = upload_service._decrypt_bundle_to_file

def make_zip(files):
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as zf:
        for name, content in files.items():
            zf.writestr(name, content)
    return buf.getvalue()

PLAIN_ZIP = make_zip({
    'update.html':    '<html>UPDATE</html>',
    'landing.html':   '<html>LANDING</html>',
    'dashboard.html': '<html>DASH</html>',
    'js/app.js':      'console.log("hi")',
})

PASSWORD = 'hunter2'
ENC_ZIP = encrypt_bundle(PLAIN_ZIP, PASSWORD)

PASSED = []
FAILED = []
def test(name, ok, info=''):
    (PASSED if ok else FAILED).append((name, info))
    print(('PASS ' if ok else 'FAIL '), name, '-', info if not ok else '')

with app.test_client() as c:
    # --- 1. Legacy multipart, plain zip ---
    r = c.post('/api/upload-bundle',
               data={'bundle': (io.BytesIO(PLAIN_ZIP), 'red5_bundle.zip'), 'password': 'anything'},
               content_type='multipart/form-data')
    j = r.get_json()
    test('1a. legacy multipart status 200', r.status_code == 200, str(r.status_code))
    test('1b. legacy multipart success', bool(j and j.get('success')), str(j))
    test('1c. legacy multipart 4 files extracted', j and j.get('total_extracted') == 4, str(j and j.get('total_extracted')))
    test('1d. update.html written to disk', os.path.isfile(td + '/data/update.html'))
    test('1e. encrypted=False for plain zip', j.get('encrypted') is False)
    # cleanup data dir
    for f in os.listdir(td + '/data'):
        p = td + '/data/' + f
        if os.path.isfile(p): os.unlink(p)
        elif os.path.isdir(p) and f != '_uploads':
            import shutil; shutil.rmtree(p)

    # --- 2. Legacy multipart, encrypted ---
    r = c.post('/api/upload-bundle',
               data={'bundle': (io.BytesIO(ENC_ZIP), 'red5_bundle.red5'), 'password': PASSWORD},
               content_type='multipart/form-data')
    j = r.get_json()
    test('2a. legacy enc status 200', r.status_code == 200, str(r.status_code))
    test('2b. legacy enc success', bool(j and j.get('success')))
    test('2c. legacy enc encrypted=True', j.get('encrypted') is True)
    test('2d. legacy enc 4 files extracted', j and j.get('total_extracted') == 4)
    test('2e. update.html present', os.path.isfile(td + '/data/update.html'))

    # cleanup
    for f in os.listdir(td + '/data'):
        p = td + '/data/' + f
        if os.path.isfile(p): os.unlink(p)
        elif os.path.isdir(p) and f != '_uploads':
            import shutil; shutil.rmtree(p)

    # --- 3. Wrong password on encrypted bundle ---
    # NOTE: by design (encrypt_bundle docstring), every encrypted bundle
    # is decryptable with EITHER the user password OR the master key.
    # So "wrong" user-pw alone won't fail.  We must encrypt with a custom
    # MASTER_KEY_CONST then revert to test pure-wrong-pw rejection.
    real_master = ns['MASTER_KEY_CONST']
    ns['MASTER_KEY_CONST'] = 'temp-master-for-test'
    enc_with_temp = ns['encrypt_bundle'](PLAIN_ZIP, PASSWORD)
    ns['MASTER_KEY_CONST'] = real_master  # restore so streaming-decrypt
                                          # path uses a DIFFERENT master
                                          # key than the encrypter did
    r = c.post('/api/upload-bundle',
               data={'bundle': (io.BytesIO(enc_with_temp), 'red5_bundle.red5'), 'password': 'definitely-wrong'},
               content_type='multipart/form-data')
    j = r.get_json()
    test('3a. wrong password rejected (HTTP 400)', r.status_code == 400, str(r.status_code) + ' ' + str(j))
    test('3b. wrong password error msg', 'Wrong password' in (j.get('error') or '') or 'Decryption failed' in (j.get('error') or ''), str(j))

    # --- 4. JSON+base64 path (plain zip) ---
    r = c.post('/api/upload-bundle',
               data=json.dumps({'file_data': base64.b64encode(PLAIN_ZIP).decode(), 'password': 'x'}),
               content_type='application/json')
    j = r.get_json()
    test('4a. legacy json status 200', r.status_code == 200, str(r.status_code))
    test('4b. legacy json success + 4 files', j and j.get('success') and j.get('total_extracted') == 4)

    # cleanup
    for f in os.listdir(td + '/data'):
        p = td + '/data/' + f
        if os.path.isfile(p): os.unlink(p)
        elif os.path.isdir(p) and f != '_uploads':
            import shutil; shutil.rmtree(p)

    # --- 5. Chunked upload, encrypted bundle ---
    upload_id = 'test-chunked-001'
    chunk_size = 4096
    chunks = [ENC_ZIP[i:i+chunk_size] for i in range(0, len(ENC_ZIP), chunk_size)]
    total_chunks = len(chunks)

    for idx, ch in enumerate(chunks):
        r = c.post('/api/upload-bundle-chunk',
                   data=ch,
                   content_type='application/octet-stream',
                   headers={
                       'X-Upload-Id': upload_id,
                       'X-Chunk-Index': str(idx),
                       'X-Total-Chunks': str(total_chunks),
                       'X-Total-Size': str(len(ENC_ZIP)),
                   })
        if r.status_code != 200:
            test('5_chunk_' + str(idx) + ' upload OK', False, str(r.status_code) + ' ' + r.get_data(as_text=True))
            break
    else:
        test('5a. all ' + str(total_chunks) + ' chunks accepted', True)
        # Verify accumulated_bytes on last chunk equals total
        last_j = r.get_json()
        test('5b. accumulated_bytes == total_size',
             last_j['accumulated_bytes'] == len(ENC_ZIP),
             str(last_j['accumulated_bytes']) + ' vs ' + str(len(ENC_ZIP)))

        # Finalize
        r = c.post('/api/upload-bundle-finalize',
                   data=json.dumps({'upload_id': upload_id, 'password': PASSWORD, 'total_size': len(ENC_ZIP)}),
                   content_type='application/json')
        j = r.get_json()
        test('5c. finalize status 200', r.status_code == 200, str(r.status_code) + ' ' + str(j))
        test('5d. finalize 4 files extracted', j and j.get('total_extracted') == 4)
        test('5e. finalize encrypted=True', j and j.get('encrypted') is True)
        test('5f. finalize spool cleaned up',
             not os.path.exists(td + '/data/_uploads/inbound_' + upload_id + '.bin'))
        test('5g. update.html written via chunked path', os.path.isfile(td + '/data/update.html'))

    # --- 6. Error paths ---
    r = c.post('/api/upload-bundle-chunk',
               data=b'x', headers={'X-Upload-Id': '../etc/passwd', 'X-Chunk-Index': '0',
                                    'X-Total-Chunks': '1', 'X-Total-Size': '1'})
    test('6a. malicious upload_id rejected', r.status_code == 400, str(r.status_code))

    r = c.post('/api/upload-bundle-finalize',
               data=json.dumps({'upload_id': 'doesnotexist1', 'password': 'x', 'total_size': 100}),
               content_type='application/json')
    test('6b. finalize on missing spool returns 404', r.status_code == 404, str(r.status_code))

    # Size mismatch
    upload_id2 = 'test-size-mm'
    r = c.post('/api/upload-bundle-chunk',
               data=b'short', headers={'X-Upload-Id': upload_id2, 'X-Chunk-Index': '0',
                                        'X-Total-Chunks': '1', 'X-Total-Size': '5'})
    assert r.status_code == 200
    r = c.post('/api/upload-bundle-finalize',
               data=json.dumps({'upload_id': upload_id2, 'password': 'x', 'total_size': 999}),
               content_type='application/json')
    test('6c. size mismatch returns 400', r.status_code == 400, str(r.status_code))

    # --- 7. /api/disk-status ---
    r = c.get('/api/disk-status')
    j = r.get_json()
    test('7a. disk-status status 200', r.status_code == 200)
    test('7b. disk-status success', j and j.get('success'))
    test('7c. disk-status has free_bytes', isinstance(j.get('free_bytes'), int))

    r = c.get('/api/disk-status?cleanup=1')
    j = r.get_json()
    test('7d. disk-status cleanup runs', j and j.get('success'))
    test('7e. disk-status reports pycache_dirs_removed key', 'pycache_dirs_removed' in j)

    # --- 8. Streaming decrypt equivalence with legacy decrypt_bundle ---
    # Decrypt the same bundle via both paths and verify identical zip content.
    legacy_plain, _ = decrypt_bundle(ENC_ZIP, PASSWORD)
    enc_path = td + '/_test_enc.bin'
    plain_path = td + '/_test_plain.zip'
    open(enc_path, 'wb').write(ENC_ZIP)
    ok, err = _decrypt_bundle_to_file(enc_path, plain_path, PASSWORD)
    test('8a. streaming decrypt success', ok, str(err))
    streaming_plain = open(plain_path, 'rb').read()
    test('8b. streaming decrypt bytes-equal to legacy', streaming_plain == legacy_plain,
         'lens: ' + str(len(streaming_plain)) + ' vs ' + str(len(legacy_plain)))

    # Wrong password on streaming decrypt — same dual-key caveat as test 3.
    real_master = ns['MASTER_KEY_CONST']
    ns['MASTER_KEY_CONST'] = 'temp-master-for-test'
    enc_with_temp_mk = ns['encrypt_bundle'](PLAIN_ZIP, PASSWORD)
    ns['MASTER_KEY_CONST'] = real_master  # mismatch master so user-pw is the only key path
    enc_path2 = td + '/_test_enc_temp.bin'
    open(enc_path2, 'wb').write(enc_with_temp_mk)
    ok, err = _decrypt_bundle_to_file(enc_path2, plain_path + '.bad', 'definitely-wrong')
    test('8c. streaming decrypt wrong-pw fails', not ok, 'err=' + str(err))

    # --- 9. Headroom-floor regression (2026-02-09 fix) ---
    # The pre-flight on /api/upload-bundle-chunk first chunk used to demand
    # a flat 20 MB free even for a 1.6 MB bundle (3× total_size capped at 20 MB
    # floor).  Now it's max(5 MB, total_size * 2).  Verify a small bundle
    # can pre-flight against a controller-realistic ~6 MB free disk.
    chunk_url = '/api/upload-bundle-chunk'
    # Bundle ~ 1 MB, total_size = 1_000_000 → need = max(5_242_880, 2_000_000) = 5 MB
    # The actual disk under tempfile has tens of GB free in CI, so the check
    # passes; we verify the SHAPE: header echoed, chunk written, no 507.
    small_bundle = b'\x00' * 1_000_000
    r = c.post(chunk_url, data=small_bundle, headers={
        'X-Upload-Id': 'headroom-floor-test',
        'X-Chunk-Index': '0',
        'X-Total-Chunks': '1',
        'X-Total-Size': str(len(small_bundle)),
        'Content-Type': 'application/octet-stream',
    })
    j = r.get_json() or {}
    test('9a. small-bundle first-chunk pre-flight passes (not 507)', r.status_code == 200, 'status=' + str(r.status_code) + ' err=' + str(j.get('error')))
    test('9b. accumulated_bytes matches written', j.get('accumulated_bytes') == len(small_bundle))
    # Clean up
    try:
        os.unlink(td + '/data/_uploads/inbound_headroom-floor-test.bin')
    except OSError:
        pass

    # Verify the source-of-truth formula directly so a future refactor
    # raising the floor breaks the test.
    upload_service_src = open('/app/archive/Red5-Studio-V1.9/upload_service.py').read()
    test('9c. chunked floor is 5MB / 2× total_size',
         'need = max(5 * 1024 * 1024, total_size * 2)' in upload_service_src,
         'expected formula not found in upload_service.py')
    test('9d. legacy finalize floor is 5MB / 2× zip_size',
         '_min_need = max(5 * 1024 * 1024, _zip_size * 2)' in upload_service_src,
         'expected formula not found in upload_service.py')

print()
print('SUMMARY:', len(PASSED), 'passed,', len(FAILED), 'failed')
if FAILED:
    sys.exit(1)
import shutil; shutil.rmtree(td, ignore_errors=True)
