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
# Required SERVICE_CTX keys -- app.py checks these before calling register()
# and skips the module (with a clear SKIPPED log line) if any are missing.
_service_dependencies = [
    'DATA_ROOT', 'SCRIPTS_ROOT', 'PLUGINS_ROOT', 'ALLOWED_EXTENSIONS', 'MASTER_KEY_CONST',
    '_derive_key', '_no_cache',
]
import os
import re
import sys
import time
import json
import base64
import hashlib
import hmac as hmac_mod
import importlib
import zipfile

from flask import jsonify, request, Response, send_from_directory, make_response


# Filled in by register(); module-level so helpers can reach them.
DATA_ROOT = None
SCRIPTS_ROOT = None
PLUGINS_ROOT = None        # /root/data/pgpy -- firmware-safe home for plug-ins
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
# Streaming-I/O upload helpers (additive -- none of the existing routes
# below this block were changed; only the legacy /api/upload-bundle was
# refactored to spool through disk so memory peak is bounded).
#
# Why: the original /api/upload-bundle did
#     file_bytes = request.files[bundle].read()      # whole bundle in RAM
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


# ----------------------------------------------------------------------
# Repair Mode manifest — SINGLE source of truth.
#
# `/root/data/repair_manifest.json` holds the canonical list of files
# Repair Mode can flash, plus each file's expected sha256 + byte-count.
# Both the upload allow-list and the download allow-list derive from it
# at request time, and uploads are rejected if the content's sha256 does
# not match the manifest.  This catches the "operator dragged an outdated
# local file into the picker" failure mode (the 2 MB stale dashboard
# bundle that bit us on controller .208).
#
# Cache for ~5 s so a burst of upload validations doesn't re-read disk
# per request, but a fresh manifest upload still goes live quickly.
# ----------------------------------------------------------------------

_MANIFEST_CACHE = {'data': None, 'mtime': 0, 'fetched_at': 0}

# Fallback allow-list used when the manifest file is absent (e.g. fresh
# controller that has not yet had a manifest uploaded).  Lets the
# operator upload `repair_manifest.json` itself + the other files for
# the very first time.  After that the manifest becomes authoritative.
_FALLBACK_PLUGIN_FILES = {
    'upload_service.py', 'weather_service.py',
    'band_service.py', 'band_overrides_service.py',
    'telemetry_service.py',
    'webhook_bridge_service.py', 'mqtt_bridge_service.py',
    'modbus_bridge_service.py', 'ws_bridge_service.py',
    'bridges_admin_service.py', '_bridges_lib.py',
    'bacnet_diag_service.py',
    'audit_log_service.py',
    'auth_service.py',
    'pages_service.py',
}
_FALLBACK_UI_FILES = {
    'update.html', 'dashboard.html', 'dashboard.compiled.js',
    'dashboard.tailwind.css',
    'equipment_mapper.html', 'landing.html', 'access.html', 'psy_3d.html',
    'setup.html', 'setup_walk.compiled.js',
    'data_bridges_guide.md', 'opt_sa_insight.md',
    'configs/bridges.json',
    'js/audit_log.js',
    'repair_manifest.json',  # so the manifest itself can be flashed
}
_FALLBACK_HOT_RELOAD = set(_FALLBACK_PLUGIN_FILES)  # all plug-ins by default


def _manifest_path():
    """Where the manifest lives on disk.  Returns None until DATA_ROOT
    has been populated by register()."""
    if DATA_ROOT is None:
        return None
    return os.path.join(DATA_ROOT, 'repair_manifest.json')


def _load_manifest(force=False):
    """Return the parsed manifest dict (or None if absent / unreadable).

    Cached in-memory for 5 s so a flurry of /api/repair/* calls doesn't
    hammer the SD card.  `force=True` skips the cache (used by an
    explicit /api/repair/manifest/reload route)."""
    import json as _json
    p = _manifest_path()
    if p is None:
        return None
    try:
        st = os.stat(p)
    except OSError:
        _MANIFEST_CACHE['data'] = None
        return None
    now = time.time()
    if (not force
        and _MANIFEST_CACHE['data'] is not None
        and _MANIFEST_CACHE['mtime'] == st.st_mtime
        and now - _MANIFEST_CACHE['fetched_at'] < 5.0):
        return _MANIFEST_CACHE['data']
    try:
        with open(p, 'r') as f:
            data = _json.load(f)
    except (OSError, ValueError):
        return None
    if not isinstance(data, dict) or 'files' not in data:
        return None
    # Build O(1) lookup indexes.
    by_name = {}
    for entry in data.get('files', []) or []:
        n = entry.get('name')
        if isinstance(n, str) and n:
            by_name[n] = entry
    data['_by_name'] = by_name
    _MANIFEST_CACHE['data'] = data
    _MANIFEST_CACHE['mtime'] = st.st_mtime
    _MANIFEST_CACHE['fetched_at'] = now
    return data


def _manifest_allow_set(kind=None):
    """Set of file names (basenames) the manifest currently permits.
    `kind` filters by 'plugin' / 'ui' / 'config' / 'doc'; None = all.
    Falls back to the static set when no manifest is present so a fresh
    controller still has a path to flash the first manifest."""
    m = _load_manifest()
    if m is None:
        if kind == 'plugin':
            return set(_FALLBACK_PLUGIN_FILES)
        if kind == 'ui':
            return set(_FALLBACK_UI_FILES)
        if kind in ('config', 'doc'):
            # Fresh controllers have no docs/configs in the fallback
            # set -- those land via the first manifest flash.
            return set()
        return set(_FALLBACK_PLUGIN_FILES) | set(_FALLBACK_UI_FILES)
    out = set()
    for e in m.get('files', []) or []:
        if kind is None or e.get('kind') == kind:
            out.add(e.get('name'))
    out.discard(None)
    # Always allow the manifest itself to be uploaded so a corrupt
    # manifest can be replaced without ssh access -- but ONLY as a UI
    # file, never as a plug-in.  Without this guard the upload
    # classifier would route repair_manifest.json into PLUGINS_ROOT
    # because plug-in is checked before ui in repair_upload_plugin,
    # leaving DATA_ROOT/repair_manifest.json untouched and the manifest
    # endpoint still serving the stale on-disk copy.
    if kind in (None, 'ui'):
        out.add('repair_manifest.json')
    return out


def _manifest_static_allow_set():
    """Union of every non-plugin manifest entry: 'ui', 'config', 'doc'.
    These all land under DATA_ROOT (routed by path/extension in the
    upload handler) and share one allow-list at the classifier level.
    Introduced 2026-02 so docs (band_guide.md) and configs
    (equipment_types.json) stop having to masquerade as 'ui'."""
    m = _load_manifest()
    if m is None:
        # No manifest yet -- fall back to the bootstrap UI set so a
        # fresh controller can still receive its first flash.
        out = set(_FALLBACK_UI_FILES)
        out.add('repair_manifest.json')
        return out
    out = set()
    for e in m.get('files', []) or []:
        if e.get('kind') in ('ui', 'config', 'doc'):
            n = e.get('name')
            if n:
                out.add(n)
    out.add('repair_manifest.json')
    return out


def _manifest_hot_reload_set():
    """Set of plug-in basenames the manifest marks as hot-reloadable.
    Falls back to the static set when no manifest is present."""
    m = _load_manifest()
    if m is None:
        return set(_FALLBACK_HOT_RELOAD)
    out = set()
    for e in m.get('files', []) or []:
        if e.get('hot_reload') and e.get('kind') == 'plugin':
            out.add(e.get('name'))
    out.discard(None)
    return out


def _manifest_lookup(name):
    """Return the manifest entry for `name` (basename) or None."""
    m = _load_manifest()
    if m is None:
        return None
    return m.get('_by_name', {}).get(name)


def _resolve_ui_path(name):
    """Where does a UI / static file actually live on disk?

    Mirrors app.py's `_find_standards_doc()` fallback chain so verify
    and download don't report `.md` files as missing when they're
    actually under `/root/data/docs/`.  Returns the first existing
    path, or the default write location if none exists yet.

    Layout reality on V1.9 controllers:
      * `.md` standards docs  -> /root/data/docs/<name>  (preferred)
                              -> /root/data/<name>       (legacy install)
      * configs/bridges.json  -> /root/data/configs/bridges.json
      * everything else       -> /root/data/<name>
    """
    if DATA_ROOT is None:
        return name
    # configs subpath is encoded directly in the manifest name.
    if name.startswith('configs/') or name.startswith('js/'):
        return os.path.join(DATA_ROOT, name)
    candidates = [os.path.join(DATA_ROOT, name)]
    if name.endswith('.md'):
        # Preferred location first so writes land there if nothing on
        # disk yet, but if the file already lives in legacy /root/data
        # we'll keep it there to avoid orphan copies.
        candidates.insert(0, os.path.join(DATA_ROOT, 'docs', name))
    for p in candidates:
        if os.path.isfile(p):
            return p
    # Nothing on disk yet -- pick the FIRST candidate as the write
    # destination (docs/ for .md, root for everything else).
    return candidates[0]


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
                # do not recurse into the just-removed dir
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
            # Auth state packed by /api/download-bundle as red5_auth/<file>.
            if clean_name.startswith('red5_auth/'):
                auth_leaf = clean_name[len('red5_auth/'):]
                if auth_leaf not in ('users.json', 'auth_settings.json', 'auth_secret'):
                    skipped.append({'file': clean_name, 'reason': 'Unknown auth state file'})
                    continue
                auth_root = '/root/.red5'
                try:
                    os.makedirs(auth_root, mode=0o700, exist_ok=True)
                except OSError as ex:
                    errors.append({'file': clean_name, 'error': str(ex)})
                    continue
                dest_path = os.path.join(auth_root, auth_leaf)
                try:
                    size_written = 0
                    with zf.open(entry, 'r') as src, open(dest_path, 'wb') as dst:
                        while True:
                            chunk = src.read(65536)
                            if not chunk:
                                break
                            dst.write(chunk)
                            size_written += len(chunk)
                    extracted.append({'file': 'red5_auth/' + auth_leaf,
                                        'size': size_written, 'root': 'red5_auth'})
                except OSError as ex:
                    errors.append({'file': clean_name, 'error': str(ex)})
                continue
            if clean_name.startswith('scripts/'):
                target_root = SCRIPTS_ROOT
                clean_name = clean_name[len('scripts/'):]
            else:
                target_root = DATA_ROOT
                # NOTE (2026-05-25): the previous "auto-strip unknown
                # top-level folder" heuristic was deleted because it
                # silently broke every custom subfolder a user might
                # create (docs/, images/, floor_plans/, etc.).  Bundles
                # created by our own `/api/replicate-bundle` already
                # store paths relative to DATA_ROOT, so the prefix is
                # always meaningful.  A hand-rolled zip that contains
                # an extra wrapper folder is the uploader's
                # responsibility to flatten before bundling.

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
            # operator (it is the plug-in loader) and must NEVER be
            # auto-replaced by a bundle upload -- even if a sloppy zip
            # happens to contain it.  A botched app.py landing on a live
            # controller could brick the boot loop.  Operators who want
            # to upgrade app.py do so manually (SCP / direct upload) so
            # they can verify it before the next restart.
            if base_name == 'app.py':
                skipped.append({'file': clean_name, 'reason': 'Bootloader (app.py) not auto-deployed - upload manually'})
                continue
            if ext.lower() == '.py':
                # Plug-in scripts live in PLUGINS_ROOT (/root/data/pgpy/),
                # NOT /root/scripts/ -- the controller firmware deletes any
                # .py file in /root/scripts/ that is not a pre-registered
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

            # Site-authored configs: never clobber on bundle update. Fresh
            # controllers (file missing) still get the bundled defaults.
            # Operators who want factory schema again: delete the file on
            # the controller, or upload equipment_types.json via Controller
            # button / Load Schema.  Symptom fixed 2026-08-08: every SP*
            # zip was resetting carefully laid-out AHU equipment schema.
            _SITE_CONFIG_PRESERVE = {
                'configs/equipment_types.json',
                'configs/map_config.json',
                'configs/collector_config.json',
                'configs/image_files_manifest.json',
                # Site override copy (Controller dual-write). Bundle json is
                # normally forced under configs/, but preserve if present.
                'equipment_types.json',
            }
            if clean_name in _SITE_CONFIG_PRESERVE and os.path.isfile(dest_path):
                skipped.append({
                    'file': clean_name,
                    'reason': 'Site config preserved (already on controller)',
                })
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
                # Disk full mid-write -- remove the partial file.
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
            # Decryption succeeded -- the encrypted spool is now dead
            # weight (~bundle-size on disk).  Drop it BEFORE the pre-flight
            # headroom check so tight-disk controllers (~25 MB free) can
            # still deploy a ~10 MB encrypted bundle.  Without this, the
            # spool + plain copy together consume 2x bundle-size and the
            # pre-flight check below would refuse the deploy with an
            # [Errno 28] "Low disk headroom" -- even though we no longer
            # need the encrypted source.  The `finally` block's existence
            # check makes the late re-attempt a safe no-op.
            try:
                if os.path.exists(spool_path):
                    os.unlink(spool_path)
            except OSError:
                pass

        if not zipfile.is_zipfile(zip_path):
            return {'success': False, 'error': 'File is not a valid zip archive (after decryption).'}, 400

        # Pre-flight: refuse the deploy if free space is dangerously low.
        # Headroom calibrated to the ACTUAL extraction worst case rather
        # than a blanket 2x zip-size: _extract_zip_streaming() writes
        # entries one at a time via zf.open() so peak additional disk
        # use is bounded by the LARGEST single member (existing files
        # are overwritten in place; extraction does not duplicate the
        # whole zip).  Plus a 256 KB safety margin and a 1 MB floor so
        # tiny bundles still get a sane minimum.
        try:
            with zipfile.ZipFile(zip_path, 'r') as _zf_probe:
                _max_member = max((_i.file_size for _i in _zf_probe.infolist()),
                                  default=0)
        except (zipfile.BadZipFile, OSError):
            _max_member = 0
        _min_need = max(1 * 1024 * 1024, _max_member + 256 * 1024)
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
                    'largest_member': _max_member,
                }, 507

        extracted, skipped, errors = _extract_zip_streaming(zip_path)

        # Post-extract cleanup: drop pyc caches that the new .py files
        # made stale.  Frees inodes between deploys.
        pyc_dirs, pyc_bytes = _purge_pycache()

        # Auto-reload any *_service.py that just landed in PLUGINS_ROOT so
        # the new code goes live WITHOUT toggling the enteliWEB app.py
        # object.  Errors are reported per-module; a broken plug-in cannot
        # take down the deploy.
        reloaded_modules = _auto_reload_extracted_services(extracted)

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
            'reloaded_modules': reloaded_modules,
            'reload_summary': {
                'attempted': len(reloaded_modules),
                'succeeded': sum(1 for r in reloaded_modules if r.get('success')),
                'failed':    sum(1 for r in reloaded_modules if not r.get('success')),
            },
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


# === ROUTE: /api/upload-bundle-chunk === methods=[POST]
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

        # First chunk: pre-flight free space.  We need room for the
        # spool itself (= total_size) plus a working margin for the
        # eventual extract step.  Using `total_size + 1 MB` is correct
        # for plain zips -- encryption is detected at finalize-time and
        # decrypt-into-side-file happens lazily; if there is not enough
        # room then, the finalize endpoint refuses cleanly with a 507.
        # The old `max(5 MB, total_size * 2)` was way too pessimistic
        # for tiny bundles on a tight controller.  Floor 1 MB.
        if chunk_index == 0:
            try:
                if os.path.exists(spool):
                    os.unlink(spool)
            except OSError:
                pass
            need = max(1 * 1024 * 1024, total_size + 1 * 1024 * 1024)
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


# === ROUTE: /api/upload-bundle-finalize === methods=[POST]
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
            # Cleanup counters live under a nested 'cleanup' key, present
            # only when ?cleanup=1 was passed.  Matches the update.html
            # contract (`if (payload.cleanup) { ... }`) so the "Cleanup
            # freed ..." panel actually renders.
            'cleanup': ({
                'pycache_dirs_removed':  pyc_dirs,
                'pycache_bytes_freed':   pyc_bytes,
                'uploads_files_removed': stale_files,
                'uploads_bytes_freed':   stale_bytes,
            } if cleanup else None),
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# === ROUTE: /api/upload-bundle === methods=[POST]
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
            # Stream-copy from Werkzeugs FileStorage (its .stream is the
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
                # b64decode is O(n) memory in the OUTPUT -- for our typical
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
    # app.py has been deployed).  Instead of returning Flasks default 404,
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

        # Strip any path components -- we only care about the basename.
        # configs/* and js/* keep their subpath; everything else is leaf.
        if not (name.startswith('configs/') or name.startswith('js/')):
            name = os.path.basename(name)

        # Manifest basename rescue: a multipart upload carries only the
        # leaf filename (e.g. "audit_log.js"), but the manifest may list
        # it under a subdir ("js/audit_log.js").  If the bare leaf is
        # NOT in the allow-list yet matches exactly one manifest entry
        # by basename, substitute the canonical name so the upload
        # routes to the right directory.
        if '/' not in name:
            m = _load_manifest()
            if m is not None:
                cands = [e['name'] for e in (m.get('files') or [])
                         if isinstance(e.get('name'), str)
                         and '/' in e['name']
                         and os.path.basename(e['name']) == name]
                if len(cands) == 1:
                    name = cands[0]

        # Allow-list is now derived from /root/data/repair_manifest.json
        # at request time -- single source of truth shared with the UI
        # rows in update.html and the download / reload endpoints.
        # `static_files` unions ui/config/doc -- all non-plugin assets
        # share one allow-list and are routed below by path/extension.
        plugin_files = _manifest_allow_set('plugin')
        static_files = _manifest_static_allow_set()

        if name == 'app.py':
            return jsonify({'success': False, 'error': 'app.py is the bootloader — refused. Replace via enteliWEB script editor.'}), 403
        if name in plugin_files:
            dest_root = PLUGINS_ROOT
            dest_label = 'pgpy'
        elif name in static_files:
            # configs/* and js/* live under their respective subdirs --
            # preserve the subdir on disk so dashboard.html's relative
            # `<script src="js/audit_log.js">` still resolves.
            if name.startswith('configs/'):
                dest_root  = os.path.join(DATA_ROOT, 'configs')
                dest_label = 'data/configs'
                name       = os.path.basename(name)
            elif name.startswith('js/'):
                dest_root  = os.path.join(DATA_ROOT, 'js')
                dest_label = 'data/js'
                name       = os.path.basename(name)
            elif name.startswith('img/'):
                # img/* lives under /root/data/img/ -- preserve the subdir so
                # dashboard.html's `<img src="/api/assets/img/...">` resolves
                # via the existing /api/assets/<path:filename> route.
                dest_root  = os.path.join(DATA_ROOT, 'img')
                dest_label = 'data/img'
                name       = os.path.basename(name)
            elif name.endswith('.md'):
                # Resolver returns the existing file's location if one
                # is already on disk (e.g. /root/data/docs/foo.md) so
                # we OVERWRITE rather than create a duplicate at the
                # legacy path.  For fresh installs this lands the file
                # under /root/data/docs/ by default.
                _resolved = _resolve_ui_path(name)
                dest_root = os.path.dirname(_resolved)
                dest_label = ('data/docs'
                              if dest_root.rstrip('/').endswith('/docs')
                              else 'data')
            else:
                dest_root = DATA_ROOT
                dest_label = 'data'
        else:
            return jsonify({'success': False, 'error': 'Filename not in repair allow-list', 'allowed': sorted(plugin_files | static_files)}), 403

        # Disk-full guard (very lenient -- only refuse if we literally cannot
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
            # ----- Content integrity check ----------------------------
            # Compare sha256 of the uploaded bytes to the expected hash
            # baked into repair_manifest.json.  Catches the "operator
            # picked a stale local file" failure mode that bricked the
            # cog-icon redirect on .208 with a 2 MB pre-minified bundle.
            # Skipped (a) when no manifest is present (fresh controller),
            # (b) for the manifest itself (chicken-and-egg), or
            # (c) when the operator sends the explicit X-Force-Override
            # header (escape hatch for one-off field hotfixes).
            entry = _manifest_lookup(name)
            force_override = (request.headers.get('X-Force-Override', '').lower()
                              in ('1', 'true', 'yes'))
            if (entry is not None
                    and name != 'repair_manifest.json'
                    and not force_override):
                expected_sha = entry.get('sha256')
                expected_size = entry.get('size')
                try:
                    h = hashlib.sha256()
                    with open(tmp_path, 'rb') as _fh:
                        while True:
                            chunk = _fh.read(65536)
                            if not chunk:
                                break
                            h.update(chunk)
                    got_sha = h.hexdigest()
                except OSError as ex:
                    got_sha = None
                    return jsonify({'success': False,
                                    'error': 'integrity check failed: cannot read spool ('+str(ex)+')'}), 500
                if expected_sha and got_sha != expected_sha:
                    try:
                        os.unlink(tmp_path)
                    except OSError:
                        pass
                    return jsonify({
                        'success': False,
                        'error': ('sha256 mismatch -- your local copy is out of date or corrupted. '
                                  'Pull the latest commit and try again, or send '
                                  'X-Force-Override: 1 to bypass.'),
                        'filename': name,
                        'expected_sha256': expected_sha,
                        'got_sha256': got_sha,
                        'expected_size': expected_size,
                        'got_size': bytes_written,
                    }), 409
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

        # If the manifest itself just landed, drop the cache so the new
        # allow-list / hashes go live immediately.
        if name == 'repair_manifest.json':
            _MANIFEST_CACHE['data'] = None
            _MANIFEST_CACHE['mtime'] = 0
            _MANIFEST_CACHE['fetched_at'] = 0

        # Audit-log every Repair Mode upload.  No-op when the audit
        # plug-in isn't loaded.  Logged AFTER os.replace so we don't
        # record the upload of a file that failed to land.
        _als = sys.modules.get('audit_log_service')
        if _als is not None and hasattr(_als, 'record'):
            _als.record(
                action='repair_upload',
                resource=dest_label + '/' + name,
                after={'bytes': bytes_written,
                       'sha256_verified': bool(_manifest_lookup(name)) and name != 'repair_manifest.json',
                       'force_override': force_override},
            )

        return jsonify({
            'success': True,
            'dest': dest_label + '/' + name,
            'bytes': bytes_written,
            'root': dest_label,
            'sha256_verified': bool(_manifest_lookup(name)) and name != 'repair_manifest.json',
            'note': 'Restart Flask (or toggle the app.py enteliWEB script object) for Python to re-import the new module.',
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


def repair_download_plugin(plugin_name):
    """Out-of-band repair download: serve the current copy of a plug-in
    file directly so the operator can see what's deployed before deciding
    to overwrite.  Allow-list is derived from repair_manifest.json --
    same source of truth as the upload counterpart.
    """
    plugin_files = _manifest_allow_set('plugin')
    static_files = _manifest_static_allow_set()
    name = (plugin_name or '').strip()
    # Preserve configs/ subpath; basename-strip everything else.
    if name not in static_files:
        name = os.path.basename(name)
    if name == 'app.py':
        return jsonify({'success': False, 'error': 'app.py refused (bootloader)'}), 403
    if name in plugin_files:
        path = os.path.join(PLUGINS_ROOT, name)
    elif name in static_files:
        path = _resolve_ui_path(name)
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


def repair_manifest():
    """GET /api/repair/manifest -- expose the active manifest JSON so the
    update.html UI can render Repair Mode rows dynamically AND
    operators can run a one-shot verification snippet against it.
    Returns the live manifest on disk (`{"absent": true}` if missing)."""
    m = _load_manifest()
    if m is None:
        return jsonify({'absent': True, 'note': 'No repair_manifest.json on disk; fallback allow-list in use.'}), 200
    # Strip private cache fields before returning.
    out = {k: v for k, v in m.items() if not k.startswith('_')}
    return _no_cache(jsonify(out))


def repair_verify_deploy():
    """GET /api/repair/verify -- compute sha256 of every manifest-listed
    file on disk, compare to the expected hash, return a per-file pass /
    fail report.  Lets the operator click ONE button on /update and see
    which controller files are out-of-date or corrupt."""
    m = _load_manifest()
    if m is None:
        return jsonify({'absent': True, 'error': 'No manifest deployed; cannot verify.'}), 404
    results = []
    n_pass = n_fail = n_missing = 0
    for entry in m.get('files', []) or []:
        name = entry.get('name')
        if not name:
            continue
        kind = entry.get('kind')
        if kind == 'plugin':
            path = os.path.join(PLUGINS_ROOT, name)
        else:
            path = _resolve_ui_path(name)
        item = {'name': name, 'kind': kind, 'expected_sha256': entry.get('sha256'),
                'expected_size': entry.get('size')}
        if not os.path.isfile(path):
            item['status'] = 'missing'
            n_missing += 1
            results.append(item)
            continue
        # Manifest self-reference: sha256 is None (can't hash a value
        # that includes itself).  File-on-disk is sufficient proof.
        if entry.get('sha256') is None:
            try:
                item['got_size'] = os.path.getsize(path)
            except OSError:
                pass
            item['status'] = 'ok'
            n_pass += 1
            results.append(item)
            continue
        try:
            h = hashlib.sha256()
            size = 0
            with open(path, 'rb') as f:
                while True:
                    buf = f.read(65536)
                    if not buf:
                        break
                    h.update(buf)
                    size += len(buf)
        except OSError as ex:
            item['status'] = 'unreadable'
            item['error'] = str(ex)
            n_fail += 1
            results.append(item)
            continue
        got = h.hexdigest()
        item['got_sha256'] = got
        item['got_size'] = size
        if got == entry.get('sha256'):
            item['status'] = 'ok'
            n_pass += 1
        else:
            item['status'] = 'mismatch'
            n_fail += 1
        results.append(item)
    return jsonify({
        'success': True,
        'manifest_version': m.get('version'),
        'total': len(results),
        'pass': n_pass,
        'fail': n_fail,
        'missing': n_missing,
        'files': results,
    })


def _rollback_added_routes(app, endpoints):
    """Remove a list of endpoints from a Flask ``app`` — used to undo a
    partial ``mod.register()`` that raised mid-way through.

    Removes the matching ``Rule`` objects from ``app.url_map._rules`` (and
    the per-endpoint index ``_rules_by_endpoint`` + werkzeug's internal
    state-machine matcher), drops the entries from ``app.view_functions``,
    and forces werkzeug to rebuild its matcher from the remaining rules so
    the routing table is consistent on the next request.

    Returns the list of endpoints that were actually rolled back (some may
    have already been absent if register() failed before binding them).
    """
    if not endpoints:
        return []
    eps = set(endpoints)
    removed = []
    # 1. Drop view_functions entries.
    for ep in list(eps):
        if ep in app.view_functions:
            try:
                del app.view_functions[ep]
                removed.append(ep)
            except KeyError:
                pass
    # 2. Drop matching Rule objects from url_map._rules + _rules_by_endpoint.
    #    werkzeug Rule objects are bound to their parent Map and cannot be
    #    reassigned to a fresh Map without a RuntimeError, so we mutate the
    #    list in place.
    _to_remove = [r for r in list(app.url_map._rules) if r.endpoint in eps]
    for _r in _to_remove:
        try:
            app.url_map._rules.remove(_r)
        except ValueError:
            pass
        _by_ep = getattr(app.url_map, '_rules_by_endpoint', None)
        if _by_ep is not None and _r.endpoint in _by_ep:
            _by_ep[_r.endpoint] = [x for x in _by_ep[_r.endpoint] if x is not _r]
            if not _by_ep[_r.endpoint]:
                del _by_ep[_r.endpoint]
    # 3. Rebuild werkzeugs StateMachineMatcher from scratch -- it does not
    #    expose a "remove rule" API and its internal state-tree keeps
    #    references to deleted rules otherwise.  Re-add every surviving
    #    rule (except build-only rules, which the matcher skips).
    try:
        matcher = app.url_map._matcher
        fresh_matcher = type(matcher)(merge_slashes=app.url_map.merge_slashes)
        for _r in app.url_map._rules:
            if not getattr(_r, 'build_only', False):
                fresh_matcher.add(_r)
        app.url_map._matcher = fresh_matcher
    except Exception:
        # Old werkzeug versions (<2.3) do not have StateMachineMatcher; fall
        # back to flipping _remap and hoping Map.update() handles it.
        pass
    try:
        app.url_map._remap = True
        app.url_map.update()
    except Exception:
        pass
    return sorted(set(removed))


def _reload_module_core(plugin_name):
    """Core hot-reload logic. Returns ``(body_dict, http_status)`` so it can
    be called both from the HTTP route handler (``repair_reload_module``)
    AND from auto-reload-after-extract inside the bundle deploy flow.

    Three cases are handled:

      (a) Module already loaded (auto-discovered at boot) →
          importlib.reload(mod) → rebind globals + ATTACH NEW routes
          via a filtering add_url_rule wrapper (existing endpoints are
          skipped; new endpoints are attached on the fly by toggling
          Flask's _got_first_request flag) → swap app.view_functions[ep]
          for every previously-registered endpoint.  Next request hits
          new code; brand-new routes added to the module since boot
          also go live without a Flask restart.

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
      - Background threads started inside register() will NOT be
        re-spawned in case (a) (we suppress them via start_*_thread=False
        during the rebind call).
    """
    # Restrict to the same plug-in allow-list as repair_upload_plugin,
    # now derived from repair_manifest.json (single source of truth).
    plugin_files = _manifest_hot_reload_set()
    name = os.path.basename(plugin_name or '').strip()
    if not name.endswith('.py'):
        name = name + '.py'
    if name not in plugin_files:
        return {'success': False, 'error': 'not in reload allow-list',
                'allowed': sorted(plugin_files)}, 403

    mod_name = name[:-3]   # strip .py
    mod = sys.modules.get(mod_name)

    if _FLASK_APP_REF is None or _SERVICE_CTX_REF is None:
        return {'success': False,
                'error': 'reload context not initialised'}, 500
    # Capture refs to LOCALS -- importlib.reload() re-executes the module body
    # which resets these globals to None until the new register() runs.
    app = _FLASK_APP_REF
    ctx_snapshot = _SERVICE_CTX_REF

    # 1. Snapshot which endpoints belong to this module BEFORE reload.
    pre_endpoints = []
    for ep, fn in list(app.view_functions.items()):
        if getattr(fn, '__module__', '') == mod_name:
            pre_endpoints.append((ep, fn.__name__))

    # 2a. Fresh-import case -- module never imported in this Flask session.
    if mod is None:
        try:
            mod = importlib.import_module(mod_name)
        except Exception as ex:
            return {'success': False,
                    'error': 'fresh import failed: ' + str(ex),
                    'module': mod_name}, 500
        if not pre_endpoints:
            if not hasattr(mod, 'register'):
                return {'success': False,
                        'error': 'module has no register() function',
                        'module': mod_name}, 500
            real_add_url_rule_fresh = app.add_url_rule
            fresh_added = []
            def _tracking_add_url_rule(rule, endpoint=None, view_func=None, **kw):
                ep_local = endpoint or (view_func.__name__ if view_func is not None else None)
                real_add_url_rule_fresh(rule, endpoint=endpoint, view_func=view_func, **kw)
                if ep_local is not None:
                    fresh_added.append(ep_local)
            _orig_first = getattr(app, '_got_first_request', False)
            try:
                app._got_first_request = False
            except AttributeError:
                pass
            app.add_url_rule = _tracking_add_url_rule
            try:
                mod.register(app, ctx_snapshot)
            except Exception as ex:
                _rolled_back = _rollback_added_routes(app, fresh_added)
                return {'success': False,
                        'error': 'fresh register() failed: ' + str(ex),
                        'module': mod_name,
                        'rolled_back_endpoints': _rolled_back}, 500
            finally:
                app.add_url_rule = real_add_url_rule_fresh
                try:
                    app._got_first_request = _orig_first
                except AttributeError:
                    pass
            new_endpoints = sorted(
                ep for ep, fn in app.view_functions.items()
                if getattr(fn, '__module__', '') == mod_name
            )
            return {
                'success': True,
                'module': mod_name,
                'fresh_import': True,
                'new_endpoints': new_endpoints,
                'route_map': _endpoint_routes(app, new_endpoints),
                'note': 'Fresh module imported and registered. Routes are live immediately.',
            }, 200

    # 2b. Reload path -- new function objects are created here.
    else:
        try:
            importlib.reload(mod)
        except Exception as ex:
            return {'success': False,
                    'error': 'importlib.reload failed: ' + str(ex),
                    'module': mod_name}, 500

    # 3. Re-bind module globals by calling register() with filtering+tracking
    #    add_url_rule wrapper.
    real_add_url_rule = app.add_url_rule
    existing_endpoints = set(app.view_functions.keys())
    newly_added = []
    def _filtering_add_url_rule(rule, endpoint=None, view_func=None, **kw):
        ep = endpoint or (view_func.__name__ if view_func is not None else None)
        if ep is None:
            return None
        if ep in existing_endpoints:
            return None   # duplicate -- will be swapped in step 4
        was_first = getattr(app, '_got_first_request', False)
        try:
            try: app._got_first_request = False
            except AttributeError: pass
            real_add_url_rule(rule, endpoint=endpoint, view_func=view_func, **kw)
            newly_added.append(ep)
        finally:
            try: app._got_first_request = was_first
            except AttributeError: pass
    rebind_ctx = dict(ctx_snapshot)
    rebind_ctx['start_forecast_thread'] = False
    rebind_ctx['start_band_thread']     = False
    app.add_url_rule = _filtering_add_url_rule
    try:
        if hasattr(mod, 'register'):
            mod.register(app, rebind_ctx)
    except Exception as ex:
        app.add_url_rule = real_add_url_rule
        rolled_back = _rollback_added_routes(app, newly_added)
        return {'success': False,
                'error': 'rebind register() failed: ' + str(ex),
                'module': mod_name,
                'rolled_back_endpoints': rolled_back}, 500
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

    return {
        'success': True,
        'module': mod_name,
        'swapped_endpoints': swapped,
        'missing_endpoints': missing,
        'new_endpoints': newly_added,
        'route_map': _endpoint_routes(app, swapped + newly_added),
        'note': ('Module hot-reloaded. ' +
                 ('Newly attached: ' + ', '.join(newly_added) + '. ' if newly_added else '') +
                 'No Flask restart needed.'),
    }, 200


def repair_reload_module(plugin_name):
    """HTTP wrapper around ``_reload_module_core``.  See that function's
    docstring for the full reload semantics."""
    body, code = _reload_module_core(plugin_name)
    # Audit-log every reload (no-op if audit_log_service is not loaded).
    _als = sys.modules.get('audit_log_service')
    if _als is not None and hasattr(_als, 'record'):
        _als.record(
            action='repair_reload',
            resource=str(plugin_name),
            after={'http_status': code,
                   'ok': bool(isinstance(body, dict) and body.get('success'))},
        )
    return jsonify(body), code


def _endpoint_routes(app, endpoints):
    """Return ``{endpoint: [{rule, methods}, ...]}`` for each endpoint in
    ``endpoints``.  ``methods`` is sorted, excludes the implicit HEAD/OPTIONS
    werkzeug adds for every GET rule so the deploy report stays readable.
    """
    out = {}
    if not endpoints:
        return out
    eps = set(endpoints)
    by_ep = getattr(app.url_map, '_rules_by_endpoint', None) or {}
    for ep in eps:
        rules = by_ep.get(ep) or []
        for r in rules:
            methods = sorted(m for m in (r.methods or set())
                             if m not in ('HEAD', 'OPTIONS'))
            out.setdefault(ep, []).append({
                'rule': r.rule,
                'methods': methods,
            })
    return out


def _auto_reload_extracted_services(extracted):
    """Walk the extractor's manifest, find every ``pgpy/<name>_service.py``
    entry, and hot-reload each one in-process so its routes go live
    WITHOUT a Flask restart.  Called from ``_finalize_bundle_from_disk``
    right after extraction succeeds.

    Returns a list of per-module summary dicts (one per attempted reload).
    Each entry includes a ``route_map`` field mapping each endpoint
    (swapped + new) to its concrete URL rule + HTTP methods, so the deploy
    report is self-documenting: operators see ``/api/weather-location [GET]``
    next to ``get_weather_location`` and can immediately tell which HTTP
    routes just came online.

    Errors are reported per-module — a broken plug-in does not abort the
    deploy or affect the other plug-ins.
    """
    results = []
    if not extracted or _FLASK_APP_REF is None:
        return results
    app = _FLASK_APP_REF
    seen = set()
    for entry in extracted:
        path = (entry.get('file') or '') if isinstance(entry, dict) else ''
        # Only auto-reload plug-ins that landed in PLUGINS_ROOT.
        if not path.startswith('pgpy/'):
            continue
        leaf = path[len('pgpy/'):]
        if not leaf.endswith('_service.py'):
            continue
        if leaf in seen:
            continue
        seen.add(leaf)
        mod_name = leaf[:-3]
        try:
            body, code = _reload_module_core(leaf)
        except Exception as ex:
            results.append({'module': mod_name,
                            'success': False,
                            'error': 'auto-reload crashed: ' + str(ex)})
            continue
        swapped = body.get('swapped_endpoints') or []
        new_eps = body.get('new_endpoints')     or []
        results.append({
            'module': mod_name,
            'success': bool(body.get('success')),
            'http_status': code,
            'fresh_import': bool(body.get('fresh_import')),
            'swapped_endpoints': swapped,
            'new_endpoints':     new_eps,
            'route_map':         body.get('route_map') or {},
            'error': body.get('error'),
            'rolled_back_endpoints': body.get('rolled_back_endpoints') or [],
        })
    return results





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

    # Re-route Pythons tempfile module away from the /tmp tmpfs (which is
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
    # Manifest = single source of truth for which files Repair Mode can
    # flash + their expected sha256.  /manifest exposes it for the
    # update.html UI to render rows dynamically; /verify re-hashes every
    # file on disk and reports OK / mismatch / missing per row.
    app.add_url_rule('/api/repair/manifest',        'repair_manifest',
                     repair_manifest,        methods=['GET'])
    app.add_url_rule('/api/repair/verify',          'repair_verify_deploy',
                     repair_verify_deploy,   methods=['GET'])
    app.add_url_rule('/update',                     'serve_update_page',
                     serve_update_page,      methods=['GET'])
    # Multi-file / directory zip downloads (called from equipment_mappers
    # "GET SELECTED" button on the Controller Assets file browser).
    # Without these two routes the frontends POST hits a 404 and the
    # operator sees "GET selected failed: 404" in an alert.
    app.add_url_rule('/api/zip-files',              'api_zip_files',
                     api_zip_files,          methods=['POST'])
    app.add_url_rule('/api/zip-dir',                'api_zip_dir',
                     api_zip_dir,            methods=['POST'])

    # ---- Equipment schema dual-write (site + configs) --------------------
    # app.py is NOT auto-deployed by bundle upload (bootloader).  Rebind the
    # live view functions here so a normal /update zip that includes
    # upload_service.py still gets: save → /root/data/equipment_types.json
    # AND configs/; GET prefers the site copy.  Survives factory configs/
    # overwrite on later bundle updates.
    def _equipment_types_get():
        from flask import jsonify
        candidates = [
            os.path.join(DATA_ROOT, 'equipment_types.json'),
            os.path.join(DATA_ROOT, 'configs', 'equipment_types.json'),
        ]
        for filepath in candidates:
            if os.path.isfile(filepath):
                try:
                    with open(filepath, 'r') as f:
                        return jsonify(json.load(f))
                except Exception as e:
                    return jsonify({'success': False, 'error': str(e)}), 500
        return jsonify({})

    def _equipment_schema_save():
        from flask import jsonify, request
        try:
            data = request.json or {}
            equipment_schema = data.get('equipment_schema', {})
            configs_dir = os.path.join(DATA_ROOT, 'configs')
            os.makedirs(configs_dir, exist_ok=True)
            os.makedirs(DATA_ROOT, exist_ok=True)
            site_path = os.path.join(DATA_ROOT, 'equipment_types.json')
            configs_path = os.path.join(configs_dir, 'equipment_types.json')
            payload = json.dumps(equipment_schema, indent=2)
            for filepath in (site_path, configs_path):
                with open(filepath, 'w') as f:
                    f.write(payload)
            return jsonify({
                'success': True,
                'message': 'Equipment schema saved (site + configs)',
                'file': site_path,
                'files': [site_path, configs_path],
            })
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

    if 'get_equipment_types' in app.view_functions:
        app.view_functions['get_equipment_types'] = _equipment_types_get
    if 'save_equipment_schema' in app.view_functions:
        app.view_functions['save_equipment_schema'] = _equipment_schema_save
