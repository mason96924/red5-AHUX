"""
upload_service.py
=================
Streaming-I/O bundle upload + fresh-controller bootstrap UI for the Red5
embedded controller.

This module was extracted from app.py on 2026-05-06 to keep the main script
under the embedded controller's per-file size budget.  It defines NO routes
at import time; instead, app.py calls ``upload_service.register(app, ctx)``
once during startup and the helpers + Flask routes get attached to the
caller's app instance using the caller's constants and helpers (passed via
the ``ctx`` dict) — so this file has zero duplication of MASTER_KEY,
DATA_ROOT, _derive_key, etc.

Endpoints registered:
  GET  /update                         (with bootstrap fallback)
  POST /api/upload-bundle              (legacy, refactored to spool to disk)
  POST /api/upload-bundle-chunk        (chunked, raw octet-stream)
  POST /api/upload-bundle-finalize     (chunked, JSON)
  GET  /api/disk-status[?cleanup=1]
"""
# Required SERVICE_CTX keys — app.py checks these before calling register()
# and skips the module (with a clear SKIPPED log line) if any are missing.
_service_dependencies = [
    'DATA_ROOT', 'SCRIPTS_ROOT', 'PLUGINS_ROOT', 'ALLOWED_EXTENSIONS', 'MASTER_KEY_CONST',
    '_derive_key', '_no_cache',
]
import os
import re
import sys
import time
import base64
import hashlib
import hmac as hmac_mod
import importlib
import zipfile

from flask import jsonify, request, Response, send_from_directory, make_response


# Filled in by register(); module-level so helpers can reach them.
DATA_ROOT = None
SCRIPTS_ROOT = None
PLUGINS_ROOT = None        # /root/data/pgpy — firmware-safe home for plug-ins
ALLOWED_EXTENSIONS = None
MASTER_KEY_CONST = None
UPLOADS_SCRATCH_DIR = None
_derive_key = None         # callable from app.py
_no_cache = None           # callable from app.py
# Reload-module endpoint needs a back-reference to the live ctx + app so it
# can rebind plug-in globals after importlib.reload().  Stashed by register().
_FLASK_APP_REF = None
_SERVICE_CTX_REF = None


# ----------------------------------------------------------------------
# Streaming-I/O upload helpers (additive — none of the existing routes
# below this block were changed; only the legacy /api/upload-bundle was
# refactored to spool through disk so memory peak is bounded).
#
# Why: the original /api/upload-bundle did
#     file_bytes = request.files['bundle'].read()      # whole bundle in RAM
#     ... decrypt_bundle(file_bytes) ...               # 2nd full copy + giant
#                                                       # int.from_bytes alloc
#     ... zipfile.ZipFile(io.BytesIO(zip_bytes)) ...   # 3rd full copy
# On a memory-tight controller a 1.3 MB bundle peaked at ~10 MB of Python
# heap and could OOM-kill Flask.  These helpers stream the upload to
# disk in 64 KB chunks, decrypt in 64 KB chunks (CTR keystream is
# trivially per-block), and extract zip entries via zf.open() so peak
# memory is bounded to ~128 KB regardless of bundle size.
# ----------------------------------------------------------------------

UPLOADS_SCRATCH_DIR = None  # populated by register() once DATA_ROOT is known

# (The tempfile redirect + makedirs() block previously lived here at module
# import time.  It has been moved into register() so this module is safe to
# import before app.py has finalized DATA_ROOT.)


_UPLOAD_ID_RE = None  # lazy

def _safe_upload_id(s):
    """Validate an upload-id is a short alphanumeric / hyphen string we
    can safely use as a filename.  Defends against path-traversal or any
    weird characters from a malicious or buggy client."""
    global _UPLOAD_ID_RE
    if _UPLOAD_ID_RE is None:
        import re
        _UPLOAD_ID_RE = re.compile(r'^[A-Za-z0-9_\-]{8,64}$')
    if not isinstance(s, str) or not _UPLOAD_ID_RE.match(s):
        return None
    return s


def _spool_path(upload_id):
    return os.path.join(UPLOADS_SCRATCH_DIR, 'inbound_' + upload_id + '.bin')


def _check_free_space(path, min_bytes=10 * 1024 * 1024, min_inodes=200):
    """Returns (ok: bool, free_bytes: int, free_inodes: int).  On
    platforms without statvfs (Windows dev box) returns (True, -1, -1)."""
    try:
        st = os.statvfs(path)
    except (AttributeError, OSError):
        return True, -1, -1
    free_bytes = st.f_bavail * st.f_frsize
    free_inodes = st.f_favail
    return (free_bytes >= min_bytes and free_inodes >= min_inodes), free_bytes, free_inodes


def _purge_pycache(roots=None):
    """Walk the given roots and recursively rmtree every __pycache__ dir.
    Returns (dirs_removed, bytes_freed).

    Default ``roots`` is resolved at CALL time (not definition time) so it
    picks up the post-register() values of SCRIPTS_ROOT / DATA_ROOT.  This
    is important because this module is imported before app.py has
    populated those globals.
    """
    if roots is None:
        roots = (SCRIPTS_ROOT, PLUGINS_ROOT, DATA_ROOT)
    import shutil
    dirs = 0
    bytes_freed = 0
    for root in roots:
        if not root or not os.path.isdir(root):
            continue
        for dirpath, dirnames, _ in os.walk(root):
            if '__pycache__' in dirnames:
                target = os.path.join(dirpath, '__pycache__')
                try:
                    for f in os.listdir(target):
                        try:
                            bytes_freed += os.path.getsize(os.path.join(target, f))
                        except OSError:
                            pass
                    shutil.rmtree(target, ignore_errors=True)
                    dirs += 1
                except OSError:
                    pass
                # don't recurse into the just-removed dir
                dirnames.remove('__pycache__')
    return dirs, bytes_freed


def _purge_uploads_scratch(max_age_sec=300):
    """Delete stale spool files left behind by failed/aborted uploads."""
    import shutil  # noqa
    if not os.path.isdir(UPLOADS_SCRATCH_DIR):
        return 0, 0
    now = time.time()
    files = 0
    bytes_freed = 0
    for f in os.listdir(UPLOADS_SCRATCH_DIR):
        p = os.path.join(UPLOADS_SCRATCH_DIR, f)
        try:
            st = os.stat(p)
            if not os.path.isfile(p):
                continue
            if now - st.st_mtime < max_age_sec:
                continue
            bytes_freed += st.st_size
            os.unlink(p)
            files += 1
        except OSError:
            pass
    return files, bytes_freed


def _stream_save_request_to_file(stream, dest_path, max_bytes=None, chunk=65536):
    """Read a Werkzeug input stream chunk by chunk and write to disk.
    Returns total bytes written.  Raises IOError if max_bytes exceeded."""
    total = 0
    with open(dest_path, 'wb') as f:
        while True:
            buf = stream.read(chunk)
            if not buf:
                break
            total += len(buf)
            if max_bytes is not None and total > max_bytes:
                raise IOError('upload exceeded max_bytes (' + str(max_bytes) + ')')
            f.write(buf)
    return total


def _xor_stream_files(in_path, out_path, key, length, hmac_obj=None, chunk=65536):
    """Stream-XOR (CTR-mode) decrypt/encrypt: reads `length` bytes from
    in_path starting at the current offset, writes to out_path.  Optional
    hmac_obj is updated with the *input* bytes (i.e., the ciphertext on
    decrypt — matches the legacy decrypt_bundle which HMACs over the
    encrypted payload).

    Memory: O(chunk) — never materializes the full payload."""
    if chunk % 32 != 0:
        chunk = (chunk // 32 + 1) * 32
    counter = 0
    bytes_done = 0
    with open(in_path, 'rb') as f_in:
        # caller is responsible for seek; we read up to `length` more bytes
        with open(out_path, 'wb') as f_out:
            while bytes_done < length:
                want = min(chunk, length - bytes_done)
                data = f_in.read(want)
                if not data:
                    break
                if hmac_obj is not None:
                    hmac_obj.update(data)
                # generate keystream for this slice
                blocks = (len(data) + 31) // 32
                ks_parts = []
                for i in range(blocks):
                    ks_parts.append(hashlib.sha256(key + (counter + i).to_bytes(4, 'big')).digest())
                counter += blocks
                keystream = b''.join(ks_parts)[:len(data)]
                # XOR via int conversion is fast for small chunks
                d = int.from_bytes(data, 'big')
                k = int.from_bytes(keystream, 'big')
                xored = (d ^ k).to_bytes(len(data), 'big')
                f_out.write(xored)
                bytes_done += len(data)
    return bytes_done


def _decrypt_bundle_to_file(in_path, out_path, password):
    """Streaming version of decrypt_bundle().  Reads the encrypted bundle
    from in_path, writes the plain zip to out_path.  Returns (ok, error)."""
    in_size = os.path.getsize(in_path)
    if in_size < 56:
        return False, 'File too small'

    with open(in_path, 'rb') as f:
        header = f.read(8)

        if header == b'RED5ENC2':
            if in_size < 216:
                return False, 'Corrupted RED5ENC2 bundle'
            salt1 = f.read(16); mac1 = f.read(32); wrapped_dek1 = f.read(32)
            salt2 = f.read(16); mac2 = f.read(32); wrapped_dek2 = f.read(32)
            data_salt = f.read(16); data_mac = f.read(32)
            payload_offset = f.tell()
            payload_len = in_size - payload_offset

            dek = None
            wrap_key1 = _derive_key(password, salt1)
            if hmac_mod.compare_digest(hmac_mod.new(wrap_key1, wrapped_dek1, 'sha256').digest(), mac1):
                dek = bytes(a ^ b for a, b in zip(wrapped_dek1, wrap_key1))
            if dek is None:
                wrap_key2 = _derive_key(MASTER_KEY_CONST, salt2)
                if hmac_mod.compare_digest(hmac_mod.new(wrap_key2, wrapped_dek2, 'sha256').digest(), mac2):
                    dek = bytes(a ^ b for a, b in zip(wrapped_dek2, wrap_key2))
            if dek is None:
                return False, 'Wrong password'

            data_key = hashlib.pbkdf2_hmac('sha256', dek, data_salt, 10000)
            # We need an HMAC pass over the ciphertext BEFORE decrypting to
            # match the legacy compare_digest behaviour.  Streaming HMAC:
            mac_check = hmac_mod.new(data_key, b'', 'sha256')
            with open(in_path, 'rb') as g:
                g.seek(payload_offset)
                left = payload_len
                while left > 0:
                    chunk = g.read(min(65536, left))
                    if not chunk:
                        break
                    mac_check.update(chunk)
                    left -= len(chunk)
            if not hmac_mod.compare_digest(mac_check.digest(), data_mac):
                return False, 'Data integrity check failed'

            # Stream-decrypt the payload to out_path.
            with open(in_path, 'rb') as g:
                g.seek(payload_offset)
                with open(out_path, 'wb') as out_f:
                    counter = 0
                    bytes_done = 0
                    while bytes_done < payload_len:
                        want = min(65536, payload_len - bytes_done)
                        ct = g.read(want)
                        if not ct:
                            break
                        blocks = (len(ct) + 31) // 32
                        ks_parts = []
                        for i in range(blocks):
                            ks_parts.append(hashlib.sha256(data_key + (counter + i).to_bytes(4, 'big')).digest())
                        counter += blocks
                        keystream = b''.join(ks_parts)[:len(ct)]
                        d = int.from_bytes(ct, 'big')
                        k = int.from_bytes(keystream, 'big')
                        out_f.write((d ^ k).to_bytes(len(ct), 'big'))
                        bytes_done += len(ct)
            return True, None

        elif header == b'RED5ENC1':
            salt = f.read(16); stored_mac = f.read(32)
            payload_offset = f.tell()
            payload_len = in_size - payload_offset

            for try_key_pwd in (password, MASTER_KEY_CONST):
                key = _derive_key(try_key_pwd, salt)
                mac_check = hmac_mod.new(key, b'', 'sha256')
                with open(in_path, 'rb') as g:
                    g.seek(payload_offset)
                    left = payload_len
                    while left > 0:
                        chunk = g.read(min(65536, left))
                        if not chunk:
                            break
                        mac_check.update(chunk)
                        left -= len(chunk)
                if hmac_mod.compare_digest(mac_check.digest(), stored_mac):
                    with open(in_path, 'rb') as g:
                        g.seek(payload_offset)
                        with open(out_path, 'wb') as out_f:
                            counter = 0
                            bytes_done = 0
                            while bytes_done < payload_len:
                                want = min(65536, payload_len - bytes_done)
                                ct = g.read(want)
                                if not ct:
                                    break
                                blocks = (len(ct) + 31) // 32
                                ks_parts = []
                                for i in range(blocks):
                                    ks_parts.append(hashlib.sha256(key + (counter + i).to_bytes(4, 'big')).digest())
                                counter += blocks
                                keystream = b''.join(ks_parts)[:len(ct)]
                                d = int.from_bytes(ct, 'big')
                                k = int.from_bytes(keystream, 'big')
                                out_f.write((d ^ k).to_bytes(len(ct), 'big'))
                                bytes_done += len(ct)
                    return True, None
            return False, 'Wrong password'
        else:
            return False, 'Not an encrypted RED5 bundle'


def _extract_zip_streaming(zip_path):
    """Extract a zip from disk (NOT loaded into RAM) into DATA_ROOT /
    SCRIPTS_ROOT using the same routing rules as the legacy upload-bundle.
    Returns (extracted, skipped, errors).  Each entry is decompressed in
    64 KB chunks via zf.open() so peak RAM is bounded."""
    extracted = []
    skipped = []
    errors = []
    with zipfile.ZipFile(zip_path, 'r') as zf:
        for entry in zf.namelist():
            if entry.endswith('/') or '__MACOSX' in entry or entry.startswith('.'):
                continue
            if '..' in entry:
                skipped.append({'file': entry, 'reason': 'Path traversal blocked'})
                continue

            clean_name = entry.lstrip('/')
            if clean_name.startswith('scripts/'):
                target_root = SCRIPTS_ROOT
                clean_name = clean_name[len('scripts/'):]
            else:
                target_root = DATA_ROOT
                parts = clean_name.split('/')
                if len(parts) > 1 and parts[0] not in ('js', 'configs', 'graphics', 'assets'):
                    ext0 = os.path.splitext(parts[0])[1]
                    if not ext0:
                        clean_name = '/'.join(parts[1:])

            _, ext = os.path.splitext(clean_name)
            # Defensive: never deploy test files or pyc cache to the
            # controller, even if they sneak into the zip (e.g., a careless
            # `zip -r` of the dev folder).
            base_name = os.path.basename(clean_name)
            if (base_name.startswith('test_')
                or base_name == 'conftest.py'
                or '/tests/' in '/' + clean_name + '/'
                or '/__pycache__/' in '/' + clean_name + '/'
                or ext.lower() == '.pyc'):
                skipped.append({'file': clean_name, 'reason': 'Dev-only test/cache file (not deployed)'})
                continue
            # Bootloader protection: app.py is explicitly managed by the
            # operator (it's the plug-in loader) and must NEVER be
            # auto-replaced by a bundle upload — even if a sloppy zip
            # happens to contain it.  A botched app.py landing on a live
            # controller could brick the boot loop.  Operators who want
            # to upgrade app.py do so manually (SCP / direct upload) so
            # they can verify it before the next restart.
            if base_name == 'app.py':
                skipped.append({'file': clean_name, 'reason': 'Bootloader (app.py) not auto-deployed - upload manually'})
                continue
            if ext.lower() == '.py':
                # Plug-in scripts live in PLUGINS_ROOT (/root/data/pgpy/),
                # NOT /root/scripts/ — the controller firmware deletes any
                # .py file in /root/scripts/ that isn't a pre-registered
                # enteliWEB object.  app.py is the only exception (operator-
                # managed) and is already filtered out above.
                target_root = PLUGINS_ROOT
                clean_name = os.path.basename(clean_name)
            if ext.lower() == '.json' and not clean_name.startswith('configs/'):
                clean_name = 'configs/' + os.path.basename(clean_name)
            if ext.lower() not in ALLOWED_EXTENSIONS:
                skipped.append({'file': clean_name, 'reason': 'Extension "' + ext + '" not allowed'})
                continue

            dest_path = os.path.normpath(os.path.join(target_root, clean_name))
            if not (dest_path.startswith(DATA_ROOT) or dest_path.startswith(SCRIPTS_ROOT)
                    or dest_path.startswith(PLUGINS_ROOT)):
                skipped.append({'file': clean_name, 'reason': 'Resolved outside target directory'})
                continue

            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            try:
                size_written = 0
                with zf.open(entry, 'r') as src, open(dest_path, 'wb') as dst:
                    while True:
                        chunk = src.read(65536)
                        if not chunk:
                            break
                        dst.write(chunk)
                        size_written += len(chunk)
                if target_root == PLUGINS_ROOT:
                    dest_label = 'pgpy/' + clean_name
                    dest_root_label = 'pgpy'
                elif target_root == SCRIPTS_ROOT:
                    dest_label = 'scripts/' + clean_name
                    dest_root_label = 'scripts'
                else:
                    dest_label = clean_name
                    dest_root_label = 'data'
                extracted.append({'file': dest_label, 'size': size_written, 'root': dest_root_label})
            except OSError as ex:
                # Disk full mid-write — remove the partial file.
                try:
                    if os.path.exists(dest_path):
                        os.unlink(dest_path)
                except OSError:
                    pass
                errors.append({'file': clean_name, 'error': str(ex)})
            except Exception as ex:
                errors.append({'file': clean_name, 'error': str(ex)})
    return extracted, skipped, errors


def _finalize_bundle_from_disk(spool_path, password):
    """Common code path for both /api/upload-bundle (legacy single-shot)
    and /api/upload-bundle-finalize (chunked).  Takes a spooled file on
    disk (encrypted or plain zip), extracts everything, returns the
    response body dict.  Always cleans up the spool file."""
    zip_path = spool_path
    plain_made = False
    try:
        # Detect encrypted vs plain zip.
        with open(spool_path, 'rb') as fh:
            magic = fh.read(8)
        is_encrypted = magic in (b'RED5ENC1', b'RED5ENC2')

        if is_encrypted:
            plain_path = spool_path + '.zip'
            ok, err = _decrypt_bundle_to_file(spool_path, plain_path, password)
            if not ok:
                # Drop the half-written plain file
                try:
                    if os.path.exists(plain_path):
                        os.unlink(plain_path)
                except OSError:
                    pass
                return {'success': False, 'error': 'Decryption failed: ' + (err or 'unknown')}, 400
            zip_path = plain_path
            plain_made = True

        if not zipfile.is_zipfile(zip_path):
            return {'success': False, 'error': 'File is not a valid zip archive (after decryption).'}, 400

        # Pre-flight: refuse the deploy if free space is dangerously low.
        # Headroom calibrated to the actual zip size (zip is on disk here):
        # peak disk use during _extract_zip_streaming is ~zip_size + extracted_files
        # (~1.1× zip).  Floor at 5 MB so tiny bundles still get a sane minimum.
        try:
            _zip_size = os.path.getsize(zip_path)
        except OSError:
            _zip_size = 0
        _min_need = max(5 * 1024 * 1024, _zip_size * 2)
        ok, free_bytes, free_inodes = _check_free_space(DATA_ROOT,
                                                       min_bytes=_min_need,
                                                       min_inodes=400)
        if not ok:
            # Try a quick auto-cleanup pass before giving up.
            _purge_pycache()
            _purge_uploads_scratch()
            ok2, free_bytes, free_inodes = _check_free_space(DATA_ROOT, _min_need, 400)
            if not ok2:
                return {
                    'success': False,
                    'error': '[Errno 28] Low disk headroom; refusing to deploy.',
                    'free_bytes': free_bytes,
                    'free_inodes': free_inodes,
                    'required_bytes': _min_need,
                }, 507

        extracted, skipped, errors = _extract_zip_streaming(zip_path)

        # Post-extract cleanup: drop pyc caches that the new .py files
        # made stale.  Frees inodes between deploys.
        pyc_dirs, pyc_bytes = _purge_pycache()

        return {
            'success': True,
            'message': 'Bundle extracted: ' + str(len(extracted)) + ' files deployed.',
            'extracted': extracted,
            'skipped': skipped,
            'errors': errors,
            'total_extracted': len(extracted),
            'total_skipped': len(skipped),
            'total_errors': len(errors),
            'encrypted': is_encrypted,
            'pycache_dirs_removed': pyc_dirs,
            'pycache_bytes_freed': pyc_bytes,
        }, 200
    finally:
        # Always remove both the inbound spool and any plain copy.
        for p in (spool_path, spool_path + '.zip' if plain_made else None):
            if not p:
                continue
            try:
                if os.path.exists(p):
                    os.unlink(p)
            except OSError:
                pass


# === ROUTE: /api/upload-bundle-chunk === methods=['POST']
def upload_bundle_chunk():
    """Receive ONE chunk of a chunked upload.  Idempotent for the SAME
    chunk_index (will re-write the same offset).

    Headers (preferred) OR query string:
      X-Upload-Id     : opaque [A-Za-z0-9_\\-]{8,64} (client-generated)
      X-Chunk-Index   : 0-based int
      X-Total-Chunks  : int
      X-Total-Size    : final file size in bytes (for pre-flight check)

    Body: raw chunk bytes (NOT multipart).  Streamed in 64 KB reads — at
    no point is the full chunk buffered in Python memory."""
    try:
        h = request.headers
        upload_id = _safe_upload_id(h.get('X-Upload-Id') or request.args.get('upload_id', ''))
        if not upload_id:
            return jsonify({'success': False, 'error': 'Invalid or missing upload_id'}), 400
        try:
            chunk_index = int(h.get('X-Chunk-Index', request.args.get('chunk_index', '0')))
            total_chunks = int(h.get('X-Total-Chunks', request.args.get('total_chunks', '1')))
            total_size = int(h.get('X-Total-Size', request.args.get('total_size', '0')))
        except (TypeError, ValueError):
            return jsonify({'success': False, 'error': 'Invalid chunk metadata'}), 400
        if chunk_index < 0 or chunk_index >= total_chunks:
            return jsonify({'success': False, 'error': 'chunk_index out of range'}), 400
        if total_size < 0 or total_size > 200 * 1024 * 1024:
            return jsonify({'success': False, 'error': 'total_size out of range'}), 400

        os.makedirs(UPLOADS_SCRATCH_DIR, exist_ok=True)
        spool = _spool_path(upload_id)

        # First chunk: pre-flight free space (need 3x total_size for safety
        # — encrypted spool + plain zip + extracted files).
        if chunk_index == 0:
            try:
                if os.path.exists(spool):
                    os.unlink(spool)
            except OSError:
                pass
            need = max(5 * 1024 * 1024, total_size * 2)
            ok, free_bytes, free_inodes = _check_free_space(DATA_ROOT, min_bytes=need, min_inodes=400)
            if not ok:
                _purge_uploads_scratch()
                ok, free_bytes, free_inodes = _check_free_space(DATA_ROOT, min_bytes=need, min_inodes=400)
                if not ok:
                    return jsonify({
                        'success': False,
                        'error': '[Errno 28] Low disk headroom for upload',
                        'free_bytes': free_bytes,
                        'free_inodes': free_inodes,
                        'required_bytes': need,
                    }), 507

        # Stream-write this chunk (append mode for non-first chunks).
        mode = 'ab' if chunk_index > 0 else 'wb'
        bytes_written = 0
        with open(spool, mode) as f:
            while True:
                buf = request.stream.read(65536)
                if not buf:
                    break
                f.write(buf)
                bytes_written += len(buf)

        accumulated = os.path.getsize(spool)
        return jsonify({
            'success': True,
            'upload_id': upload_id,
            'chunk_index': chunk_index,
            'chunk_bytes': bytes_written,
            'accumulated_bytes': accumulated,
            'total_chunks': total_chunks,
            'total_size': total_size,
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# === ROUTE: /api/upload-bundle-finalize === methods=['POST']
def upload_bundle_finalize():
    """Finalize a chunked upload: validate the spooled file matches the
    expected size, then run the same decrypt + extract pipeline as the
    legacy single-shot endpoint."""
    try:
        body = request.get_json(silent=True) or {}
        upload_id = _safe_upload_id(body.get('upload_id', ''))
        password = body.get('password', '')
        total_size = int(body.get('total_size', 0))
        if not upload_id:
            return jsonify({'success': False, 'error': 'Invalid or missing upload_id'}), 400
        if not password:
            return jsonify({'success': False, 'error': 'Password is required.'}), 400
        spool = _spool_path(upload_id)
        if not os.path.isfile(spool):
            return jsonify({'success': False, 'error': 'Upload not found (chunks missing)'}), 404
        actual_size = os.path.getsize(spool)
        if total_size > 0 and actual_size != total_size:
            try:
                os.unlink(spool)
            except OSError:
                pass
            return jsonify({'success': False, 'error': 'Size mismatch: expected ' + str(total_size) + ', got ' + str(actual_size)}), 400

        body_resp, code = _finalize_bundle_from_disk(spool, password)
        return jsonify(body_resp), code
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# === ROUTE: /api/disk-status === methods=None
def disk_status():
    """Free-space + inode readout for the controller's data partition.
    Optional ?cleanup=1 first runs _purge_pycache + _purge_uploads_scratch
    so the operator can reclaim space without redeploying."""
    try:
        cleanup = request.args.get('cleanup') in ('1', 'true', 'yes')
        pyc_dirs = pyc_bytes = stale_files = stale_bytes = 0
        if cleanup:
            pyc_dirs, pyc_bytes = _purge_pycache()
            stale_files, stale_bytes = _purge_uploads_scratch()

        try:
            st = os.statvfs(DATA_ROOT)
            total_bytes = st.f_blocks * st.f_frsize
            free_bytes = st.f_bavail * st.f_frsize
            total_inodes = st.f_files
            free_inodes = st.f_favail
        except (AttributeError, OSError):
            total_bytes = free_bytes = total_inodes = free_inodes = -1

        return jsonify({
            'success': True,
            'data_root': DATA_ROOT,
            'total_bytes': total_bytes,
            'free_bytes': free_bytes,
            'total_inodes': total_inodes,
            'free_inodes': free_inodes,
            'pycache_dirs_removed': pyc_dirs,
            'pycache_bytes_freed': pyc_bytes,
            'stale_uploads_removed': stale_files,
            'stale_uploads_bytes_freed': stale_bytes,
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# === ROUTE: /api/upload-bundle === methods=['POST']
def upload_bundle():
    """Legacy single-shot upload.  Refactored to spool the multipart
    payload to disk in 64 KB chunks and reuse the same finalize path as
    /api/upload-bundle-finalize, so peak RAM is bounded for both code
    paths.  Wire format and response shape are unchanged — existing
    clients keep working."""
    spool = None
    try:
        password = ''
        os.makedirs(UPLOADS_SCRATCH_DIR, exist_ok=True)
        spool = os.path.join(UPLOADS_SCRATCH_DIR, 'inbound_legacy_' + str(int(time.time() * 1000)) + '.bin')

        if request.files and 'bundle' in request.files:
            password = request.form.get('password', '')
            # Stream-copy from Werkzeug's FileStorage (its .stream is the
            # underlying SpooledTemporaryFile-like object).
            src = request.files['bundle'].stream
            with open(spool, 'wb') as f:
                while True:
                    buf = src.read(65536)
                    if not buf:
                        break
                    f.write(buf)
        elif request.content_type and 'json' in request.content_type:
            data = request.get_json(silent=True) or {}
            password = data.get('password', '')
            b64 = data.get('file_data', '') or ''
            if ',' in b64:
                b64 = b64.split(',', 1)[1]
            # base64 decode in chunks to avoid the giant int allocation
            with open(spool, 'wb') as f:
                # b64decode is O(n) memory in the OUTPUT — for our typical
                # 1-2 MB bundle this is acceptable; we then write the
                # decoded bytes to disk and free the buffer immediately.
                decoded = base64.b64decode(b64)
                f.write(decoded)
                del decoded
        else:
            return jsonify({'success': False, 'error': 'No file provided.'}), 400

        if os.path.getsize(spool) == 0:
            return jsonify({'success': False, 'error': 'No file provided.'}), 400
        if not password:
            return jsonify({'success': False, 'error': 'Password is required.'}), 400

        body, code = _finalize_bundle_from_disk(spool, password)
        spool = None  # _finalize_bundle_from_disk already cleaned up
        return jsonify(body), code
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        # Belt-and-suspenders: if we bailed before _finalize cleaned up,
        # remove the spool now.
        if spool:
            try:
                if os.path.exists(spool):
                    os.unlink(spool)
            except OSError:
                pass


_BOOTSTRAP_UPDATE_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>RED5 Platform Update — Bootstrap</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Courier New',monospace;background:#020617;color:#e2e8f0;min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:40px 20px}
h1{font-size:28px;font-weight:900;margin-bottom:8px;letter-spacing:-1px}
h1 span{color:#ef4444;font-style:italic}
.sub{color:#64748b;font-size:12px;margin-bottom:24px}
.bootstrap-tag{display:inline-block;padding:4px 10px;background:#422006;color:#fbbf24;border:1px solid #b45309;border-radius:4px;font-size:10px;letter-spacing:.15em;text-transform:uppercase;font-weight:700;margin-bottom:32px}
.card{background:#0f172a;border:1px solid #1e293b;border-radius:12px;padding:32px;width:100%;max-width:600px;margin-bottom:24px}
.card h2{font-size:16px;color:#c084fc;text-transform:uppercase;letter-spacing:2px;margin-bottom:16px}
.note-box{background:#020617;border:1px solid #1e293b;border-left:3px solid #f59e0b;border-radius:6px;padding:12px 14px;font-size:12px;color:#94a3b8;line-height:1.6;margin-bottom:20px}
.note-box code{background:#1e293b;padding:1px 5px;border-radius:3px;color:#a5b4fc}
.drop-zone{border:2px dashed #334155;border-radius:8px;padding:48px 24px;text-align:center;cursor:pointer;transition:all .2s}
.drop-zone:hover,.drop-zone.active{border-color:#6366f1;background:#1e1b4b20}
.drop-zone input{display:none}
.drop-zone p{color:#94a3b8;font-size:14px}
.drop-zone .icon{font-size:36px;margin-bottom:12px;color:#475569}
.btn{display:inline-block;padding:12px 32px;border:none;border-radius:8px;font-family:inherit;font-size:14px;font-weight:700;cursor:pointer;text-transform:uppercase;letter-spacing:1px;transition:all .15s}
.btn-primary{background:#4f46e5;color:white;width:100%;margin-top:16px}
.btn-primary:hover{background:#4338ca}
.btn-primary:disabled{background:#334155;color:#64748b;cursor:not-allowed}
.selected-file{margin-top:12px;padding:8px 12px;background:#1e293b;border-radius:6px;font-size:12px;color:#a5b4fc}
.pwd-row{display:flex;gap:8px;align-items:center;margin-bottom:12px;margin-top:20px}
.pwd-row label{font-size:12px;color:#94a3b8;white-space:nowrap;min-width:80px}
.pwd-input{flex:1;background:#020617;border:1px solid #334155;border-radius:6px;padding:10px 14px;color:#e2e8f0;font-family:inherit;font-size:13px;outline:none}
.pwd-input:focus{border-color:#6366f1}
.pwd-input::placeholder{color:#475569}
#status{margin-top:16px;font-size:13px;white-space:pre-wrap}
.status-ok{color:#22c55e}.status-err{color:#ef4444}.status-info{color:#f59e0b}
.report{margin-top:12px;background:#020617;border:1px solid #1e293b;border-radius:6px;padding:16px;font-size:11px;max-height:240px;overflow-y:auto}
.report .file{color:#94a3b8;padding:2px 0}.report .file.ok::before{content:'OK ';color:#22c55e}
.report .file.skip::before{content:'-- ';color:#f59e0b}.report .file.err::before{content:'XX ';color:#ef4444}
</style>
</head>
<body>
<h1><span>RED5</span> PLATFORM UPDATE</h1>
<p class="sub">Standalone update tool — upload or download encrypted bundles (.red5)</p>
<div class="bootstrap-tag">Fresh Controller &middot; Bootstrap Mode</div>

<div class="card">
  <h2>Bootstrap Deploy</h2>
  <div class="note-box">
    <code>/root/data/</code> has no UI files yet. Drop the encrypted <code>.red5</code>
    or plain <code>.zip</code> bundle below to provision this controller. Once it
    deploys, the full Update / Dashboard / Mapper UIs will be served normally and
    this Bootstrap screen disappears automatically.
  </div>

  <div class="pwd-row">
    <label for="pwd">Password:</label>
    <input type="password" id="pwd" class="pwd-input" placeholder="Enter password or master key" autocomplete="off"/>
  </div>

  <label class="drop-zone" id="dz">
    <input type="file" id="bundle" accept=".zip,.red5"/>
    <div class="icon">&#128230;</div>
    <p id="dz-label">Drop encrypted .red5 or plain .zip file here or click to browse</p>
    <div class="selected-file" id="sel" style="display:none"></div>
  </label>

  <button class="btn btn-primary" id="btn" disabled>Deploy Bundle</button>

  <div id="status"></div>
  <div id="report" class="report" style="display:none"></div>
</div>

<script>
(function(){
  var dz       = document.getElementById('dz');
  var input    = document.getElementById('bundle');
  var sel      = document.getElementById('sel');
  var dzLabel  = document.getElementById('dz-label');
  var pwd      = document.getElementById('pwd');
  var btn      = document.getElementById('btn');
  var status   = document.getElementById('status');
  var report   = document.getElementById('report');
  var picked   = null;

  function refreshBtn(){
    btn.disabled = !(picked && pwd.value.trim());
  }
  function setStatus(msg, cls){
    status.textContent = msg;
    status.className = cls || '';
  }
  function logFile(file, cls){
    report.style.display = 'block';
    var d = document.createElement('div');
    d.className = 'file ' + (cls || '');
    d.textContent = file;
    report.appendChild(d);
    report.scrollTop = report.scrollHeight;
  }
  function setPicked(f){
    picked = f;
    if (f) {
      sel.style.display = 'block';
      sel.textContent = f.name + ' \u00b7 ' + Math.round(f.size/1024) + ' KB';
      dzLabel.style.display = 'none';
    } else {
      sel.style.display = 'none';
      dzLabel.style.display = 'block';
    }
    refreshBtn();
  }

  input.addEventListener('change', function(e){ if (e.target.files[0]) setPicked(e.target.files[0]); });
  pwd.addEventListener('input', refreshBtn);

  ['dragenter','dragover'].forEach(function(ev){
    dz.addEventListener(ev, function(e){ e.preventDefault(); e.stopPropagation(); dz.classList.add('active'); });
  });
  ['dragleave','drop'].forEach(function(ev){
    dz.addEventListener(ev, function(e){ e.preventDefault(); e.stopPropagation(); dz.classList.remove('active'); });
  });
  dz.addEventListener('drop', function(e){
    var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) setPicked(f);
  });

  btn.addEventListener('click', function(){
    if (!picked || !pwd.value.trim()) return;
    btn.disabled = true; btn.textContent = 'Deploying...';
    setStatus('Uploading ' + picked.name + ' (' + Math.round(picked.size/1024) + ' KB)...', 'status-info');
    report.innerHTML = ''; report.style.display = 'none';

    var CHUNK = 262144;                              // 256 KB per chunk
    var total = picked.size;
    var totalChunks = Math.max(1, Math.ceil(total / CHUNK));
    var uploadId = 'up-' + Date.now().toString(36) + '-' +
                   Math.random().toString(36).slice(2, 12);

    function postChunk(idx){
      var start = idx * CHUNK;
      var end = Math.min(start + CHUNK, total);
      var blob = picked.slice(start, end);
      return fetch('/api/upload-bundle-chunk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'X-Upload-Id': uploadId,
          'X-Chunk-Index': String(idx),
          'X-Total-Chunks': String(totalChunks),
          'X-Total-Size': String(total)
        },
        body: blob
      }).then(function(r){
        if (r.status === 404) throw new Error('__FALLBACK__');
        return r.json().then(function(j){ return {status: r.status, body: j}; });
      }).then(function(res){
        if (res.status !== 200 || !res.body || !res.body.success) {
          throw new Error((res.body && res.body.error) || ('HTTP ' + res.status));
        }
        var pctDone = Math.round(((idx + 1) / totalChunks) * 95);
        setStatus('Uploading\u2026 ' + pctDone + '%  (chunk ' + (idx + 1) + ' / ' + totalChunks + ')', 'status-info');
      });
    }

    function uploadAll(i){
      if (i >= totalChunks) return Promise.resolve();
      return postChunk(i).then(function(){ return uploadAll(i + 1); });
    }

    function finalize(){
      setStatus('Decrypting and extracting on controller\u2026', 'status-info');
      return fetch('/api/upload-bundle-finalize', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({upload_id: uploadId, password: pwd.value, total_size: total})
      }).then(function(r){ return r.json().then(function(j){ return {status: r.status, body: j}; }); });
    }

    function legacyFallback(){
      setStatus('Old controller — falling back to single-shot upload\u2026', 'status-info');
      var fd = new FormData();
      fd.append('bundle', picked);
      fd.append('password', pwd.value);
      return fetch('/api/upload-bundle', { method: 'POST', body: fd })
        .then(function(r){ return r.json().then(function(j){ return {status: r.status, body: j}; }); });
    }

    function handleResult(res){
      var j = res.body;
      if (j && j.success) {
        setStatus('OK \u00b7 ' + (j.message || 'extracted'), 'status-ok');
        (j.extracted || []).forEach(function(e){ logFile(e.file + '  (' + Math.round(e.size/1024) + ' KB)', 'ok'); });
        (j.skipped  || []).forEach(function(e){ logFile(e.file + ' \u2014 ' + e.reason,        'skip'); });
        (j.errors   || []).forEach(function(e){ logFile(e.file + ' \u2014 ' + e.error,         'err'); });
        setStatus('Controller provisioned. Loading full UI in 2s\u2026', 'status-ok');
        setTimeout(function(){ window.location.href = '/update'; }, 2000);
      } else {
        setStatus('FAILED: ' + (j && j.error ? j.error : ('HTTP ' + res.status)), 'status-err');
        btn.disabled = false; btn.textContent = 'Deploy Bundle';
      }
    }

    uploadAll(0)
      .then(finalize)
      .then(handleResult)
      .catch(function(e){
        if (e && e.message === '__FALLBACK__') {
          legacyFallback().then(handleResult).catch(function(e2){
            setStatus('Network error: ' + (e2 && e2.message ? e2.message : String(e2)), 'status-err');
            btn.disabled = false; btn.textContent = 'Deploy Bundle';
          });
          return;
        }
        setStatus('Upload error: ' + (e && e.message ? e.message : String(e)), 'status-err');
        btn.disabled = false; btn.textContent = 'Deploy Bundle';
      });
  });
})();
</script>
</body>
</html>"""


# === ROUTE: /update ===
def zip_files_to_response(filenames, root_name, base_path, archive_name):
    """Stream a ZIP of the given filenames back to the caller.

    Built in-memory (not on disk) — these archives are typically a few
    MB, not gigabytes, and the controller's /tmp tmpfs would refuse a
    larger build anyway.  Files outside ALLOWED_ROOTS are rejected with
    400 before any I/O happens.

    Used by:
      /api/zip-files (POST {names: [...], root, path})  — multi-file GET
      /api/zip-dir   (POST {dirname, root, path})       — directory GET
    """
    import io as _io
    target_root = SCRIPTS_ROOT if root_name == 'scripts' else (
        PLUGINS_ROOT if root_name == 'pgpy' else DATA_ROOT)
    base_dir = os.path.normpath(os.path.join(target_root, base_path or ''))
    if not (base_dir.startswith(DATA_ROOT) or base_dir.startswith(SCRIPTS_ROOT)
            or base_dir.startswith(PLUGINS_ROOT)):
        return jsonify({'success': False, 'error': 'Path resolves outside allowed roots'}), 400

    buf = _io.BytesIO()
    added = 0
    with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as zf:
        for name in filenames:
            if '..' in name or name.startswith('/'):
                continue
            full = os.path.normpath(os.path.join(base_dir, name))
            if not (full.startswith(DATA_ROOT) or full.startswith(SCRIPTS_ROOT)
                    or full.startswith(PLUGINS_ROOT)):
                continue
            if os.path.isfile(full):
                zf.write(full, arcname=name)
                added += 1
            elif os.path.isdir(full):
                # Walk subtree, preserve relative paths (request 3 spec).
                for r, _dirs, files in os.walk(full):
                    rel_dir = os.path.relpath(r, base_dir)
                    for fn in files:
                        srcp = os.path.join(r, fn)
                        arc  = os.path.normpath(os.path.join(rel_dir, fn))
                        zf.write(srcp, arcname=arc)
                        added += 1
    if added == 0:
        return jsonify({'success': False, 'error': 'No files matched / nothing to zip'}), 404
    buf.seek(0)
    resp = make_response(buf.getvalue())
    resp.headers['Content-Type']        = 'application/zip'
    resp.headers['Content-Disposition'] = f'attachment; filename="{archive_name}"'
    resp.headers['X-File-Count']        = str(added)
    return resp


def api_zip_files():
    """POST { names: [str], root: 'data'|'scripts'|'pgpy', path: '' }"""
    payload = request.get_json(silent=True) or {}
    names   = payload.get('names') or []
    root    = payload.get('root')  or 'data'
    path_   = payload.get('path')  or ''
    if not isinstance(names, list) or not names:
        return jsonify({'success': False, 'error': 'names[] required'}), 400
    archive = 'red5_files_{}.zip'.format(int(time.time()))
    return zip_files_to_response(names, root, path_, archive)


def api_zip_dir():
    """POST { dirname: str, root: 'data'|'scripts'|'pgpy', path: '' }

    `dirname` is the leaf directory name relative to `path`. The whole
    subtree is zipped with relative paths preserved.
    """
    payload = request.get_json(silent=True) or {}
    dirname = (payload.get('dirname') or '').strip()
    root    = payload.get('root')  or 'data'
    path_   = payload.get('path')  or ''
    if not dirname:
        return jsonify({'success': False, 'error': 'dirname required'}), 400
    archive = '{}_{}.zip'.format(dirname.replace('/', '_'), int(time.time()))
    return zip_files_to_response([dirname], root, path_, archive)


def serve_update_page():
    # Self-bootstrap: on a fresh controller /root/data/ may be empty (only
    # app.py has been deployed).  Instead of returning Flask's default 404,
    # serve a minimal inline HTML form that POSTs the bundle to
    # /api/upload-bundle.  Once the bundle is uploaded the real update.html
    # takes over on the next request.  This makes every fresh controller
    # commission itself with just app.py + a browser.
    update_path = '/root/data/update.html'
    if not os.path.isfile(update_path):
        return _no_cache(Response(_BOOTSTRAP_UPDATE_HTML, mimetype='text/html'))
    return _no_cache(send_from_directory('/root/data', 'update.html'))



def repair_upload_plugin():
    """Out-of-band repair upload: replaces a single plug-in `.py` file in
    PLUGINS_ROOT (or a UI/asset file in DATA_ROOT) directly, bypassing the
    bundle/decrypt/extract pipeline.

    Use case: the operator's controller is stuck below the headroom floor
    of the bundle uploader, OR a single plug-in has a broken release that
    needs a hotfix without re-uploading the whole bundle.

    Security: the file must match a strict allow-list — only known plug-in
    names + a small set of UI/asset files.  Refuses `app.py` (bootloader).

    POST multipart/form-data:
        file: <file blob>
        filename (optional): override (defaults to the upload's filename)
    Returns: {success, dest, bytes, root}
    """
    try:
        if 'file' not in request.files:
            return jsonify({'success': False, 'error': 'No file in form data'}), 400
        f = request.files['file']
        # Caller can override filename if needed (rare).
        name = (request.form.get('filename') or f.filename or '').strip()
        if not name:
            return jsonify({'success': False, 'error': 'Missing filename'}), 400

        # Strip any path components — we only care about the basename.
        name = os.path.basename(name)

        # Allow-list — narrow attack surface.  These map to a specific dest root.
        # NOTE: keep in sync with the corresponding lists in repair_download_plugin()
        # and repair_reload_module() below.
        plugin_files = {
            'upload_service.py',
            'weather_service.py',
            'band_service.py',
            'telemetry_service.py',
            # AHU data bridges (added 2026-02-09):
            'webhook_bridge_service.py',
            'mqtt_bridge_service.py',
            'modbus_bridge_service.py',
            'ws_bridge_service.py',
            'bridges_admin_service.py',
            '_bridges_lib.py',          # shared helper, not a plug-in (no register())
        }
        ui_files = {'update.html', 'dashboard.html', 'equipment_mapper.html',
                    'landing.html', 'psy_3d.html',
                    # docs + configs (added 2026-02-09):
                    'data_bridges_guide.md', 'configs/bridges.json'}
        if name == 'app.py':
            return jsonify({'success': False, 'error': 'app.py is the bootloader — refused. Replace via enteliWEB script editor.'}), 403
        if name in plugin_files:
            dest_root = PLUGINS_ROOT
            dest_label = 'pgpy'
        elif name in ui_files:
            # configs/bridges.json lives in DATA_ROOT/configs/ — preserve the subdir.
            if name.startswith('configs/'):
                dest_root  = os.path.join(DATA_ROOT, 'configs')
                dest_label = 'data/configs'
                name       = os.path.basename(name)
            else:
                dest_root = DATA_ROOT
                dest_label = 'data'
        else:
            return jsonify({'success': False, 'error': 'Filename not in repair allow-list', 'allowed': sorted(plugin_files | ui_files)}), 403

        # Disk-full guard (very lenient — only refuse if we literally cannot
        # write a few KB safely).  No 20 MB / 5 MB floor here: this endpoint
        # exists EXPRESSLY to unblock low-headroom controllers.
        ok_disk, free_b, free_i = _check_free_space(DATA_ROOT, min_bytes=64 * 1024, min_inodes=10)
        if not ok_disk:
            _purge_pycache()
            _purge_uploads_scratch()
            ok_disk, free_b, free_i = _check_free_space(DATA_ROOT, min_bytes=64 * 1024, min_inodes=10)
            if not ok_disk:
                return jsonify({'success': False, 'error': 'Disk genuinely full', 'free_bytes': free_b, 'free_inodes': free_i}), 507

        os.makedirs(dest_root, exist_ok=True)
        dest_path = os.path.join(dest_root, name)
        # Write to a temp side-file then rename, so we never leave a
        # half-written replacement of a critical plug-in.
        tmp_path = dest_path + '.repair_tmp'
        try:
            bytes_written = _stream_save_request_to_file(f.stream, tmp_path,
                                                         max_bytes=10 * 1024 * 1024,
                                                         chunk=65536)
            os.replace(tmp_path, dest_path)
        except Exception:
            try:
                if os.path.exists(tmp_path):
                    os.unlink(tmp_path)
            except OSError:
                pass
            raise

        # Drop any stale .pyc that the new .py made obsolete.
        if name.endswith('.py'):
            _purge_pycache()

        return jsonify({
            'success': True,
            'dest': dest_label + '/' + name,
            'bytes': bytes_written,
            'root': dest_label,
            'note': 'Restart Flask (or toggle the app.py enteliWEB script object) for Python to re-import the new module.',
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


def repair_download_plugin(plugin_name):
    """Out-of-band repair download: serve the current copy of a plug-in
    file directly so the operator can see what's deployed before deciding
    to overwrite.  Same allow-list as the upload counterpart.
    """
    plugin_files = {
        'upload_service.py', 'weather_service.py',
        'band_service.py', 'telemetry_service.py',
        'webhook_bridge_service.py', 'mqtt_bridge_service.py',
        'modbus_bridge_service.py', 'ws_bridge_service.py',
        'bridges_admin_service.py', '_bridges_lib.py',
    }
    ui_files = {'update.html', 'dashboard.html', 'equipment_mapper.html',
                'landing.html', 'psy_3d.html',
                'data_bridges_guide.md', 'configs/bridges.json'}
    name = (plugin_name or '').strip()
    # Preserve configs/ subpath; basename-strip everything else.
    if name not in ui_files:
        name = os.path.basename(name)
    if name == 'app.py':
        return jsonify({'success': False, 'error': 'app.py refused (bootloader)'}), 403
    if name in plugin_files:
        path = os.path.join(PLUGINS_ROOT, name)
    elif name in ui_files:
        if name.startswith('configs/'):
            path = os.path.join(DATA_ROOT, name)
        else:
            path = os.path.join(DATA_ROOT, name)
    else:
        return jsonify({'success': False, 'error': 'not in repair allow-list'}), 403
    if not os.path.isfile(path):
        return jsonify({'success': False, 'error': 'file not on disk', 'path': path}), 404
    if name.endswith('.py'):
        mime = 'text/x-python'
    elif name.endswith('.json'):
        mime = 'application/json'
    elif name.endswith('.md'):
        mime = 'text/markdown'
    else:
        mime = 'text/html'
    return _no_cache(send_from_directory(os.path.dirname(path),
                                         os.path.basename(path),
                                         mimetype=mime, as_attachment=False))


def repair_reload_module(plugin_name):
    """Hot-reload a single plug-in module inside the running Flask process,
    so newly-uploaded plug-in code takes effect WITHOUT toggling app.py
    via the enteliWEB script editor.

    Three cases are handled:

      (a) Module already loaded (auto-discovered at boot) →
          importlib.reload(mod) → rebind globals via register() with
          add_url_rule no-op'd → swap app.view_functions[ep] for every
          previously-registered endpoint.  Next request hits new code.

      (b) Module never loaded AND no endpoints registered yet (brand-new
          plug-in just landed via /api/repair/upload-plugin in this
          Flask session) → importlib.import_module() + mod.register()
          attaches the new routes for the first time.  This is the
          common path for hot-deploying a new plug-in WITHOUT a full
          Flask restart.

      (c) Module dropped from sys.modules but endpoints still live in
          app.view_functions (unusual; happens in tests) →
          import_module() then fall through to the rebind+swap path.

    Caveats:
      - For case (a), cannot ADD or REMOVE routes — only the function
        bodies change.  For schema/route-shape changes use case (b) by
        first uploading the new file as if it were brand new.
      - Background threads started inside register() will NOT be
        re-spawned in case (a) (we suppress them via start_*_thread=False
        during the rebind call).
    """
    # Restrict to the same plug-in allow-list as repair_upload_plugin.
    plugin_files = {
        'upload_service.py', 'weather_service.py',
        'band_service.py', 'telemetry_service.py',
        'webhook_bridge_service.py', 'mqtt_bridge_service.py',
        'modbus_bridge_service.py', 'ws_bridge_service.py',
        'bridges_admin_service.py',
    }
    name = os.path.basename(plugin_name or '').strip()
    if not name.endswith('.py'):
        name = name + '.py'
    if name not in plugin_files:
        return jsonify({'success': False, 'error': 'not in reload allow-list',
                        'allowed': sorted(plugin_files)}), 403

    mod_name = name[:-3]   # strip .py
    mod = sys.modules.get(mod_name)

    if _FLASK_APP_REF is None or _SERVICE_CTX_REF is None:
        return jsonify({'success': False,
                        'error': 'reload context not initialised'}), 500
    # Capture refs to LOCALS — importlib.reload() re-executes the module body
    # which resets these globals to None until the new register() runs.
    app = _FLASK_APP_REF
    ctx_snapshot = _SERVICE_CTX_REF

    # 1. Snapshot which endpoints belong to this module BEFORE reload.
    pre_endpoints = []
    for ep, fn in list(app.view_functions.items()):
        if getattr(fn, '__module__', '') == mod_name:
            pre_endpoints.append((ep, fn.__name__))

    # 2a. Fresh-import case — module never imported in this Flask session
    #     (e.g., a brand-new plug-in just dropped into PLUGINS_ROOT via
    #     /api/repair/upload-plugin).  importlib.reload() would KeyError
    #     here, so do a normal import_module().  PLUGINS_ROOT is already
    #     on sys.path (set in app.py), so the new file resolves cleanly.
    if mod is None:
        try:
            mod = importlib.import_module(mod_name)
        except Exception as ex:
            return jsonify({'success': False,
                            'error': 'fresh import failed: ' + str(ex),
                            'module': mod_name}), 500
        # If no pre-existing endpoints belong to this module, register()
        # has never run — call it now so the new routes go live.
        if not pre_endpoints:
            if not hasattr(mod, 'register'):
                return jsonify({'success': False,
                                'error': 'module has no register() function',
                                'module': mod_name}), 500
            # Flask refuses add_url_rule() after the app has handled its
            # first request (sets _got_first_request=True).  We MUST bypass
            # that lock here — the whole point of this endpoint is to add
            # routes to a long-running, request-serving app.  Toggle the
            # flag, run register(), restore the flag.  Same trick used by
            # Flask's own test_client when reusing an app across requests.
            _orig_first = getattr(app, '_got_first_request', False)
            try:
                app._got_first_request = False
            except AttributeError:
                pass
            try:
                mod.register(app, ctx_snapshot)
            except Exception as ex:
                return jsonify({'success': False,
                                'error': 'fresh register() failed: ' + str(ex),
                                'module': mod_name}), 500
            finally:
                try:
                    app._got_first_request = _orig_first
                except AttributeError:
                    pass
            new_endpoints = sorted(
                ep for ep, fn in app.view_functions.items()
                if getattr(fn, '__module__', '') == mod_name
            )
            return jsonify({
                'success': True,
                'module': mod_name,
                'fresh_import': True,
                'new_endpoints': new_endpoints,
                'note': 'Fresh module imported and registered. Routes are live immediately.',
            })
        # else: module dropped from sys.modules but its endpoints still
        # live in app.view_functions — fall through to the rebind+swap
        # path below using the freshly-imported `mod`.

    # 2b. Reload the module — new function objects are created here.
    else:
        try:
            importlib.reload(mod)
        except Exception as ex:
            return jsonify({'success': False,
                            'error': 'importlib.reload failed: ' + str(ex),
                            'module': mod_name}), 500

    # 3. Re-bind module globals (DATA_ROOT, etc.) by calling register() with
    #    add_url_rule no-op'd so it can't AssertionError on dup endpoints.
    #    Suppress background threads — they're already running.
    real_add_url_rule = app.add_url_rule
    rebind_ctx = dict(ctx_snapshot)
    rebind_ctx['start_forecast_thread'] = False
    rebind_ctx['start_band_thread']     = False
    app.add_url_rule = lambda *args, **kw: None
    try:
        if hasattr(mod, 'register'):
            mod.register(app, rebind_ctx)
    except Exception as ex:
        app.add_url_rule = real_add_url_rule
        return jsonify({'success': False,
                        'error': 'rebind register() failed: ' + str(ex)}), 500
    finally:
        app.add_url_rule = real_add_url_rule

    # 4. Re-point every previously-registered endpoint at the new function.
    swapped = []
    missing = []
    for ep, fn_name in pre_endpoints:
        new_fn = getattr(mod, fn_name, None)
        if new_fn is not None:
            app.view_functions[ep] = new_fn
            swapped.append(ep)
        else:
            missing.append(ep + ':' + fn_name)

    return jsonify({
        'success': True,
        'module': mod_name,
        'swapped_endpoints': swapped,
        'missing_endpoints': missing,
        'note': 'Module hot-reloaded. New routes (if any) require a full Flask restart to register.',
    })


def register(app, ctx):
    """Attach this module's routes to ``app`` and stash shared constants.

    ``ctx`` keys (all required):
        DATA_ROOT, SCRIPTS_ROOT, PLUGINS_ROOT, ALLOWED_EXTENSIONS,
        MASTER_KEY_CONST, _derive_key, _no_cache
    """
    global DATA_ROOT, SCRIPTS_ROOT, PLUGINS_ROOT, ALLOWED_EXTENSIONS, MASTER_KEY_CONST
    global UPLOADS_SCRATCH_DIR, _derive_key, _no_cache
    global _FLASK_APP_REF, _SERVICE_CTX_REF

    DATA_ROOT          = ctx['DATA_ROOT']
    SCRIPTS_ROOT       = ctx['SCRIPTS_ROOT']
    PLUGINS_ROOT       = ctx['PLUGINS_ROOT']
    ALLOWED_EXTENSIONS = ctx['ALLOWED_EXTENSIONS']
    MASTER_KEY_CONST   = ctx['MASTER_KEY_CONST']
    _derive_key        = ctx['_derive_key']
    _no_cache          = ctx['_no_cache']
    UPLOADS_SCRATCH_DIR = os.path.join(DATA_ROOT, '_uploads')
    _FLASK_APP_REF     = app
    _SERVICE_CTX_REF   = ctx

    # Re-route Python's tempfile module away from the /tmp tmpfs (which is
    # RAM-backed on the embedded controller).
    try:
        os.makedirs(UPLOADS_SCRATCH_DIR, exist_ok=True)
        os.makedirs(PLUGINS_ROOT, exist_ok=True)
        import tempfile as _tempfile
        _tempfile.tempdir = UPLOADS_SCRATCH_DIR
        os.environ['TMPDIR'] = UPLOADS_SCRATCH_DIR
    except OSError:
        pass

    app.add_url_rule('/api/upload-bundle-chunk',    'upload_bundle_chunk',
                     upload_bundle_chunk,    methods=['POST'])
    app.add_url_rule('/api/upload-bundle-finalize', 'upload_bundle_finalize',
                     upload_bundle_finalize, methods=['POST'])
    app.add_url_rule('/api/disk-status',            'disk_status',
                     disk_status,            methods=['GET'])
    app.add_url_rule('/api/upload-bundle',          'upload_bundle',
                     upload_bundle,          methods=['POST'])
    app.add_url_rule('/api/repair/upload-plugin',   'repair_upload_plugin',
                     repair_upload_plugin,   methods=['POST'])
    app.add_url_rule('/api/repair/download-plugin/<path:plugin_name>',
                     'repair_download_plugin',
                     repair_download_plugin, methods=['GET'])
    app.add_url_rule('/api/repair/reload-module/<path:plugin_name>',
                     'repair_reload_module',
                     repair_reload_module,   methods=['POST'])
    app.add_url_rule('/update',                     'serve_update_page',
                     serve_update_page,      methods=['GET'])
