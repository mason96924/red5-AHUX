"""
================================================================================
  Red5-ELC Plus Controller — Flask bootloader (app.py)
================================================================================
  /root/scripts/ is MANAGED BY ENTELIWEB.

  Two files MUST live in /root/scripts/ and can ONLY be placed manually:

      /root/scripts/app.py        <- this Flask server
      /root/scripts/collector.py  <- ELC ↔ BACnet bridge (stub for now)

  All other Python goes under /root/data/pgpy/ (PLUGINS_ROOT).
  See docs/CONTROLLER_DEPLOY.md for the full layout.
================================================================================
"""
from __future__ import annotations

import glob
import hashlib
import hmac as hmac_mod
import importlib
import os
import sys
import traceback

from flask import Flask, Response, jsonify, request, send_from_directory
from flask_cors import CORS

if '/root/scripts' not in sys.path:
    sys.path.insert(0, '/root/scripts')

# --- Bundle encryption (shared with upload_service.py) -----------------
MASTER_KEY_CONST = os.environ.get('RED5_MASTER_KEY', '')
if not MASTER_KEY_CONST:
    try:
        with open('/root/data/master_key.txt', encoding='utf-8') as _f:
            MASTER_KEY_CONST = _f.read().strip()
    except OSError:
        MASTER_KEY_CONST = ''


def _derive_key(password, salt):
    return hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 10000)


def _xor_stream(data, key):
    chunks = []
    counter = 0
    needed = len(data)
    while needed > 0:
        chunks.append(hashlib.sha256(key + counter.to_bytes(4, 'big')).digest())
        needed -= 32
        counter += 1
    keystream = b''.join(chunks)[:len(data)]
    d = int.from_bytes(data, 'big')
    k = int.from_bytes(keystream, 'big')
    return (d ^ k).to_bytes(len(data), 'big')


PORT = int(os.environ.get('RED5_PORT', '5001'))
HOST = os.environ.get('RED5_HOST', '0.0.0.0')

app = Flask('red5_elc_controller', root_path=os.getcwd())
CORS(app, resources={r'/*': {'origins': '*'}})


@app.after_request
def add_headers(response):
    response.headers['X-Frame-Options'] = 'ALLOWALL'
    response.headers['Content-Security-Policy'] = 'frame-ancestors *'
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response


def _no_cache(resp):
    resp.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    resp.headers['Pragma'] = 'no-cache'
    resp.headers['Expires'] = '0'
    return resp


ALLOWED_EXTENSIONS = {
    '.html', '.css', '.js', '.json', '.png', '.jpg', '.jpeg', '.svg', '.gif',
    '.webp', '.bmp', '.ico', '.txt', '.md', '.csv', '.py', '.dxf', '.zip',
}
DATA_ROOT = os.environ.get('RED5_DATA_ROOT', '/root/data')
SCRIPTS_ROOT = os.environ.get('RED5_SCRIPTS_ROOT', '/root/scripts')
PLUGINS_ROOT = os.path.join(DATA_ROOT, 'pgpy')
CONFIG_DIR = os.path.join(DATA_ROOT, 'configs')
ALLOWED_ROOTS = {'data': DATA_ROOT, 'scripts': SCRIPTS_ROOT, 'pgpy': PLUGINS_ROOT}

try:
    os.makedirs(PLUGINS_ROOT, exist_ok=True)
except OSError:
    pass
if PLUGINS_ROOT not in sys.path:
    sys.path.insert(0, PLUGINS_ROOT)


@app.route('/api/health')
def health_probe():
    return _no_cache(jsonify({'ok': True, 'app': 'red5-elc-plus'}))


@app.route('/assets/<path:filename>')
@app.route('/api/assets/<path:filename>')
def serve_asset(filename):
    if '..' in filename:
        return jsonify({'error': 'invalid path'}), 400
    if os.path.isfile(os.path.join(DATA_ROOT, filename)):
        return _no_cache(send_from_directory(DATA_ROOT, filename))
    if os.path.isfile(os.path.join(DATA_ROOT, 'docs', filename)):
        return _no_cache(send_from_directory(os.path.join(DATA_ROOT, 'docs'), filename))
    return jsonify({'error': 'not found'}), 404


@app.route('/js/<path:filename>')
def serve_js(filename):
    return _no_cache(send_from_directory(os.path.join(DATA_ROOT, 'js'), filename))


@app.route('/update')
@app.route('/update.html')
def serve_update():
    path = os.path.join(DATA_ROOT, 'update.html')
    if not os.path.isfile(path):
        return Response(
            '<!doctype html><p>Missing update.html — deploy bundle first.</p>',
            mimetype='text/html',
        )
    return _no_cache(send_from_directory(DATA_ROOT, 'update.html'))


DIRECTORY_SCAFFOLD = [
    'graphics/floor_plans',
    'graphics/elc',
    'configs',
    'docs',
    'js',
    'img',
    'pgpy',
]


@app.route('/api/init-directories', methods=['POST'])
def init_directories():
    created, existing = [], []
    for d in DIRECTORY_SCAFFOLD:
        dirpath = os.path.join(DATA_ROOT, d)
        if os.path.isdir(dirpath):
            existing.append(d)
        else:
            os.makedirs(dirpath, exist_ok=True)
            created.append(d)
    return jsonify({'success': True, 'created': created, 'existing': existing})


# --- Plug-in auto-discovery ------------------------------------------
SERVICE_CTX = {
    'DATA_ROOT': DATA_ROOT,
    'SCRIPTS_ROOT': SCRIPTS_ROOT,
    'PLUGINS_ROOT': PLUGINS_ROOT,
    'ALLOWED_EXTENSIONS': ALLOWED_EXTENSIONS,
    'MASTER_KEY_CONST': MASTER_KEY_CONST,
    '_derive_key': _derive_key,
    '_no_cache': _no_cache,
    '_xor_stream': _xor_stream,
}

_search_dirs = [PLUGINS_ROOT, SCRIPTS_ROOT]
try:
    _here = os.path.dirname(os.path.abspath(__file__))
    if _here and _here not in _search_dirs:
        _search_dirs.append(_here)
except NameError:
    pass

_seen = set()
_service_paths = []
for _d in _search_dirs:
    for _p in sorted(glob.glob(os.path.join(_d, '*_service.py'))):
        _name = os.path.splitext(os.path.basename(_p))[0]
        if _name in _seen:
            continue
        _seen.add(_name)
        _service_paths.append(_p)

_SERVICE_STATUS = []
for _path in _service_paths:
    _name = os.path.splitext(os.path.basename(_path))[0]
    try:
        _spec_name = _name
        if _path.startswith(PLUGINS_ROOT):
            _spec_name = _name
        _mod = importlib.import_module(_spec_name)
        if not hasattr(_mod, 'register'):
            _SERVICE_STATUS.append({
                'name': _name, 'path': _path, 'state': 'WARNING',
                'detail': 'no register()',
            })
            continue
        _deps = getattr(_mod, '_service_dependencies', None)
        if _deps is not None:
            _missing = [k for k in _deps if k not in SERVICE_CTX]
            if _missing:
                _SERVICE_STATUS.append({
                    'name': _name, 'path': _path, 'state': 'SKIPPED',
                    'detail': f'missing keys: {_missing}',
                })
                continue
        _mod.register(app, SERVICE_CTX)
        print(f'[{_name}] registered OK')
        _SERVICE_STATUS.append({'name': _name, 'path': _path, 'state': 'OK', 'detail': ''})
    except BaseException as _e:
        print(f'[{_name}] FAILED: {_e}')
        traceback.print_exc()
        _SERVICE_STATUS.append({
            'name': _name, 'path': _path, 'state': 'FAILED',
            'detail': f'{type(_e).__name__}: {_e}',
        })


@app.route('/api/services')
def api_services():
    return _no_cache(jsonify({
        'search_dirs': _search_dirs,
        'discovered': len(_service_paths),
        'services': _SERVICE_STATUS,
    }))


@app.route('/api/version')
def api_version():
    def _mtime(path):
        try:
            return os.path.getmtime(path)
        except OSError:
            return None
    files = ['app.py', 'collector.py', 'elc_service.py', 'upload_service.py',
             'pages_service.py']
    mtimes = {}
    for fn in files:
        for root in (SCRIPTS_ROOT, PLUGINS_ROOT, DATA_ROOT):
            p = os.path.join(root, fn)
            if os.path.isfile(p):
                mtimes[fn] = _mtime(p)
                break
    return _no_cache(jsonify({'app': 'red5-elc-plus', 'mtimes': mtimes}))


if __name__ == '__main__':
    print(f'[red5-elc] Flask on {HOST}:{PORT}  DATA_ROOT={DATA_ROOT}')
    app.run(host=HOST, port=PORT, debug=False, threaded=True)
