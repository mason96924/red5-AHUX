"""
Red5-AHU controller -- guarded enteliWEB bootloader.

Paste this once into the `app` PG object (/root/scripts/app.py).  It never
needs editing again: every bundle keeps shipping the real bootloader to
/root/data/pgpy/app_main.py, and this file execs it when it is there.

Why this is no longer a single exec() line.  On a fresh controller
app_main.py does not exist yet, so

    exec(compile(open('/root/data/pgpy/app_main.py').read(), ..., 'exec'))

raised FileNotFoundError before Flask was built.  Nothing bound :5001, so
there was no /update, so the bundle that would have created app_main.py
could not be uploaded.  The documented way out was to fetch app_main.py over
HTTP from a controller that already worked
(/assets/app_canonical_c2.py.txt) -- no use at a first site, or when the
only controller is the broken one.  The emergency bootstrap page inside
app_main.py and upload_service.py's "Fresh Controller" mode are both inside
files that are missing at that moment.

What it does:
  * app_main.py present -> exec it, exactly as the one-liner did, and get
    out of the way.
  * missing, or it raises before the port is bound -> serve a self-contained
    bootstrap page on the same port that accepts red5_bundle.zip, write it to
    disk with the same routing upload_service uses, then exec the bootloader
    it just installed.  No enteliWEB Stop/Start, and a truncated or
    half-deployed app_main.py can no longer take the port dark -- the page
    comes back with the traceback on it.

Encrypted .red5 bundles are refused here: decrypting one needs the crypto
that lives in app_main.py.  build_bundle.py emits a plain zip.

Keep this file small.  A large PG object save fails with
QERR_CLASS_OS::QERR_CODE_NO_SPACE while the filesystem still has tens of
megabytes free, and enteliWEB then keeps only the first part of the script
-- which looks like a successful save until it fails at runtime.
"""
import html
import io
import os
import sys
import threading
import traceback
import zipfile

DATA_ROOT = os.environ.get('RED5_DATA_ROOT', '/root/data')
SCRIPTS_ROOT = os.environ.get('RED5_SCRIPTS_ROOT', '/root/scripts')
PLUGINS_ROOT = os.path.join(DATA_ROOT, 'pgpy')
AUTH_ROOT = os.environ.get('RED5_AUTH_ROOT', '/root/.red5')
HOST = os.environ.get('RED5_HOST', '0.0.0.0')
PORT = int(os.environ.get('RED5_PORT', '5001'))

# Where the real bootloader may sit.  pgpy/ is where the bundle puts it;
# /root/scripts is probed second only so a hand-staged file is still found
# (the firmware deletes unregistered .py files there, so it cannot be the
# deploy target).
BOOTLOADERS = (
    os.path.join(PLUGINS_ROOT, 'app_main.py'),
    os.path.join(SCRIPTS_ROOT, 'app_main.py'),
)

ALLOWED_EXTENSIONS = (
    '.html', '.css', '.js', '.json', '.png', '.jpg', '.jpeg', '.svg', '.gif',
    '.webp', '.bmp', '.ico', '.txt', '.md', '.csv', '.py',
)

AUTH_FILES = ('users.json', 'auth_settings.json', 'auth_secret')

# Site-authored configs: a recovery upload must not reset an AHU's equipment
# schema or mapper layout.  Same list upload_service preserves.
SITE_CONFIGS = (
    'configs/equipment_types.json',
    'configs/map_config.json',
    'configs/collector_config.json',
    'configs/image_files_manifest.json',
)


def log(msg):
    print('[red5-boot] ' + msg, flush=True)


def bootloader_path():
    """First non-empty bootloader on disk, or None."""
    for path in BOOTLOADERS:
        try:
            if os.path.getsize(path) > 0:
                return path
        except OSError:
            continue
    return None


def run_bootloader(path):
    """exec the real bootloader in this process.

    Raises whatever it raises; a clean return means its own app.run() ended.
    """
    log('exec ' + path)
    if SCRIPTS_ROOT not in sys.path:
        sys.path.insert(0, SCRIPTS_ROOT)
    with open(path) as fh:
        source = fh.read()
    exec(compile(source, path, 'exec'), {'__name__': '__main__'})


def is_hidden_member(entry):
    """True for a zip member with a dot-leading path component.

    Covers .DS_Store, js/.eslintrc.json, and the AppleDouble sidecars that
    Finder's Compress writes as __MACOSX/._name.  Those keep the real suffix
    -- splitext('._floor.html') is ('._floor', '.html') -- so the extension
    allow-list below does not stop them, and ._x_service.py would match the
    '*_service.py' plug-in glob.
    """
    return any(part.startswith('.') for part in entry.strip('/').split('/'))


def zip_dest(entry):
    """Absolute path one zip member lands at, or None to skip it.

    Mirrors _extract_zip_streaming() in upload_service.py and the emergency
    bootstrap in app_main.py -- the three must stay in step.
    """
    clean = entry.lstrip('/')
    if (not clean or clean.endswith('/') or '..' in clean
            or is_hidden_member(clean)):
        return None
    base = os.path.basename(clean)
    if base.startswith('test_') or base == 'conftest.py':
        return None
    padded = '/' + clean + '/'
    if '/tests/' in padded or '/__pycache__/' in padded:
        return None
    # app.py is the operator's pasted loader.  A bundle must never replace it:
    # /root/scripts is firmware-managed and a botched copy breaks the boot loop.
    if base == 'app.py':
        return None
    if clean.startswith('red5_auth/'):
        leaf = clean[len('red5_auth/'):]
        return os.path.join(AUTH_ROOT, leaf) if leaf in AUTH_FILES else None
    ext = os.path.splitext(clean)[1].lower()
    if ext == '.pyc' or ext not in ALLOWED_EXTENSIONS:
        return None
    if ext == '.py':
        return os.path.join(PLUGINS_ROOT, base)
    if (ext == '.json' and not clean.startswith('configs/')
            and base != 'repair_manifest.json'):
        # upload_service files every loose .json under configs/, including
        # repair_manifest.json -- which _manifest_path() then looks for at
        # DATA_ROOT and never finds.  Put the manifest where the reader
        # expects it; everything else follows upload_service.
        clean = 'configs/' + base
    if clean.startswith('scripts/'):
        return os.path.join(SCRIPTS_ROOT, clean[len('scripts/'):])
    return os.path.join(DATA_ROOT, clean)


def extract(zip_bytes):
    """Write every deployable member to disk.  Returns the file count."""
    written = 0
    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as zf:
        for entry in zf.namelist():
            dest = zip_dest(entry)
            if dest is None:
                continue
            rel = os.path.relpath(dest, DATA_ROOT).replace(os.sep, '/')
            if rel in SITE_CONFIGS and os.path.isfile(dest):
                continue
            parent = os.path.dirname(dest)
            if parent:
                os.makedirs(parent, exist_ok=True)
            with zf.open(entry) as src, open(dest, 'wb') as out:
                out.write(src.read())
            written += 1
    return written


def page(reason, detail):
    return (
        '<!DOCTYPE html><html><head><meta charset="UTF-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        '<title>RED5 Bootstrap</title><style>'
        'body{font-family:"Courier New",monospace;background:#020617;color:#e2e8f0;'
        'margin:0;padding:36px 16px}'
        '.card{background:#0f172a;border:1px solid #1e293b;border-radius:12px;'
        'padding:26px;max-width:620px;margin:0 auto}'
        'b{color:#8b0000;font-style:italic;font-size:21px}b+i{color:#d97a30;font-size:13px}'
        '.tag{display:inline-block;padding:4px 10px;margin:14px 0 18px;background:#422006;'
        'color:#fbbf24;border:1px solid #b45309;border-radius:4px;font-size:10px;'
        'letter-spacing:.15em;font-weight:700}'
        '.note,pre{background:#020617;border:1px solid #1e293b;border-radius:6px;'
        'padding:12px;font-size:12px;line-height:1.6;color:#94a3b8;margin-bottom:16px}'
        '.note{border-left:3px solid #ef4444}'
        'code{color:#a5b4fc}'
        'pre{font-size:11px;color:#64748b;max-height:150px;overflow:auto;white-space:pre-wrap}'
        'input,button{width:100%;font-family:inherit;font-size:13px;border-radius:6px;'
        'padding:11px;margin-bottom:12px}'
        'input{background:#020617;border:1px solid #334155;color:#e2e8f0}'
        'button{background:#dc2626;color:#fff;border:0;font-weight:700;letter-spacing:1px;'
        'cursor:pointer}button:disabled{background:#475569}'
        '#s{font-size:12px;white-space:pre-wrap}.ok{color:#22c55e}.err{color:#f87171}'
        '</style></head><body><div class="card">'
        '<b>RED5</b><i> STUDIO*AHU</i>'
        '<div class="tag">FRESH CONTROLLER / BOOTSTRAP MODE</div>'
        '<div class="note">' + html.escape(reason) + '. Upload '
        '<code>red5_bundle.zip</code> (plain zip, not <code>.red5</code>) to '
        'provision this controller. The full stack starts by itself once the '
        'bundle lands &mdash; no enteliWEB Stop/Start.</div>'
        '<pre>' + html.escape(detail) + '</pre>'
        '<form id="f"><input type="file" id="b" accept=".zip" required>'
        '<button id="go" type="submit">DEPLOY BUNDLE</button></form>'
        '<div id="s"></div></div><script>'
        'document.getElementById("f").addEventListener("submit",function(e){'
        'e.preventDefault();var g=document.getElementById("go"),s=document.getElementById("s");'
        'var fd=new FormData();fd.append("bundle",document.getElementById("b").files[0]);'
        'g.disabled=true;s.className="";s.textContent="Uploading...";'
        'fetch("/api/bootstrap-upload",{method:"POST",body:fd}).then(function(r){return r.json()})'
        '.then(function(j){if(j.success){s.className="ok";s.textContent=j.message;'
        'if(j.promoting){setTimeout(function(){location.href="/update"},4000)}}'
        'else{s.className="err";s.textContent="FAILED: "+j.error;g.disabled=false}})'
        '.catch(function(x){s.className="err";s.textContent="Network error: "+x.message;'
        'g.disabled=false})});'
        '</script></body></html>'
    )


def bootstrap_app(reason, detail):
    """Flask app serving the bootstrap page + upload.  Returns (app, state);
    state['promote'] holds the bootloader path once a bundle has landed."""
    from flask import Flask, Response, jsonify, request

    flask_app = Flask('red5_boot', root_path=os.getcwd())
    try:
        from flask_cors import CORS
        CORS(flask_app, resources={r"/*": {"origins": "*"}})
    except Exception:
        pass  # flask_cors is optional here; the page is same-origin
    state = {'promote': None, 'server': None}

    def serve_page():
        return Response(page(reason, detail), mimetype='text/html')

    def health():
        return jsonify({'ok': True, 'app': 'red5-boot', 'mode': 'bootstrap',
                        'reason': reason, 'bootloader': bootloader_path()})

    def upload():
        try:
            f = request.files.get('bundle')
            if f is None:
                return jsonify({'success': False, 'error': 'No bundle uploaded'}), 400
            data = f.read()
            if data[:8] in (b'RED5ENC1', b'RED5ENC2'):
                return jsonify({
                    'success': False,
                    'error': 'Encrypted bundle: bootstrap mode takes the plain '
                             'red5_bundle.zip only',
                }), 400
            if not zipfile.is_zipfile(io.BytesIO(data)):
                return jsonify({'success': False, 'error': 'Not a zip file'}), 400
            count = extract(data)
            found = bootloader_path()
            log('bootstrap extracted {0} files, bootloader={1}'.format(count, found))
            if found is None:
                return jsonify({
                    'success': True,
                    'promoting': False,
                    'message': 'Extracted {0} files, but app_main.py is still '
                               'missing -- wrong bundle?'.format(count),
                })
            state['promote'] = found
            if state['server'] is not None:
                # Hand the port over once this response is on the wire.
                threading.Timer(0.6, state['server'].shutdown).start()
            return jsonify({
                'success': True,
                'promoting': True,
                'message': 'Extracted {0} files. Starting the full stack '
                           'now...'.format(count),
            })
        except Exception as ex:
            log('bootstrap upload failed: ' + traceback.format_exc())
            return jsonify({'success': False,
                            'error': type(ex).__name__ + ': ' + str(ex)}), 500

    flask_app.add_url_rule('/', 'page', serve_page)
    flask_app.add_url_rule('/update', 'update', serve_page)
    flask_app.add_url_rule('/update.html', 'update_html', serve_page)
    flask_app.add_url_rule('/api/health', 'health', health)
    flask_app.add_url_rule('/api/bootstrap-upload', 'upload', upload,
                           methods=['POST'])
    return flask_app, state


def serve_bootstrap(reason, detail):
    """Serve until a bundle lands.  Returns the bootloader path to exec, or
    None if the server stopped without one."""
    from werkzeug.serving import make_server

    flask_app, state = bootstrap_app(reason, detail)
    server = make_server(HOST, PORT, flask_app, threaded=True)
    state['server'] = server
    log('bootstrap mode on http://{0}:{1}/  ({2})'.format(HOST, PORT, reason))
    try:
        server.serve_forever()
    finally:
        server.server_close()
    return state['promote']


def main():
    path = bootloader_path()
    while True:
        if path is None:
            reason = 'app_main.py is not on disk yet'
            detail = 'Looked for:\n  ' + '\n  '.join(BOOTLOADERS)
            log(reason)
        else:
            try:
                run_bootloader(path)
                log('bootloader returned; nothing left to run')
                return
            except Exception:
                detail = traceback.format_exc()
                reason = 'app_main.py failed to run'
                log(reason + ':\n' + detail)
        try:
            path = serve_bootstrap(reason, detail)
        except OSError as err:
            # Almost always "address already in use": another copy of the app
            # object is still holding :5001.  Stop it in enteliWEB first.
            log('cannot bind {0}:{1}: {2}'.format(HOST, PORT, err))
            return
        if path is None:
            log('bootstrap server stopped without a bundle')
            return


# Unconditional call: a PG object may exec this file with globals whose
# __name__ is not '__main__', and a loader that silently does nothing would
# take the controller off the network.  RED5_BOOT_IMPORT_ONLY is the test hook.
if os.environ.get('RED5_BOOT_IMPORT_ONLY') != '1':
    main()
