import math
import os
import sys
import socket
import random
import base64
import json
import time
import zipfile
import io
import hashlib
import hmac as hmac_mod
import urllib.request
import urllib.parse
from flask import Flask, jsonify, request, send_from_directory, Response
from flask_cors import CORS

# Ensure /root/scripts is on the import path (app.py lives there).
# Plug-ins live under /root/data/pgpy/ — added to sys.path further below
# AFTER PLUGINS_ROOT is defined (the controller firmware deletes any .py
# files in /root/scripts/ that aren't pre-registered enteliWEB objects,
# so plug-ins can't live there safely).
if '/root/scripts' not in sys.path:
    sys.path.insert(0, '/root/scripts')


# --- Zero-dependency bundle encryption (PBKDF2 + SHA-256 CTR + HMAC) ---
# Supports dual-key: bundles are decryptable by EITHER the user password OR the master key.
MASTER_KEY_CONST = 'b%9P$MdeQP]['

def _derive_key(password, salt):
    return hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 10000)

def _xor_stream(data, key):
    # Generate keystream in 32-byte SHA-256 blocks
    chunks = []
    counter = 0
    needed = len(data)
    while needed > 0:
        chunks.append(hashlib.sha256(key + counter.to_bytes(4, 'big')).digest())
        needed -= 32
        counter += 1
    keystream = b''.join(chunks)[:len(data)]
    # XOR as large integers (runs in C, not Python loop)
    d = int.from_bytes(data, 'big')
    k = int.from_bytes(keystream, 'big')
    return (d ^ k).to_bytes(len(data), 'big')

def encrypt_bundle(zip_bytes, password):
    """Dual-key encryption: data encrypted with random DEK, DEK wrapped by both user password and master key."""
    dek = os.urandom(32)
    # Encrypt data with DEK
    data_salt = os.urandom(16)
    data_key = hashlib.pbkdf2_hmac('sha256', dek, data_salt, 10000)
    encrypted = _xor_stream(zip_bytes, data_key)
    data_mac = hmac_mod.new(data_key, encrypted, 'sha256').digest()
    # Wrap DEK with user password
    salt1 = os.urandom(16)
    wrap_key1 = _derive_key(password, salt1)
    wrapped_dek1 = bytes(a ^ b for a, b in zip(dek, wrap_key1))
    mac1 = hmac_mod.new(wrap_key1, wrapped_dek1, 'sha256').digest()
    # Wrap DEK with master key
    salt2 = os.urandom(16)
    wrap_key2 = _derive_key(MASTER_KEY_CONST, salt2)
    wrapped_dek2 = bytes(a ^ b for a, b in zip(dek, wrap_key2))
    mac2 = hmac_mod.new(wrap_key2, wrapped_dek2, 'sha256').digest()
    # Format: RED5ENC2 | salt1(16) | mac1(32) | wrapped_dek1(32) | salt2(16) | mac2(32) | wrapped_dek2(32) | data_salt(16) | data_mac(32) | encrypted_data
    return b'RED5ENC2' + salt1 + mac1 + wrapped_dek1 + salt2 + mac2 + wrapped_dek2 + data_salt + data_mac + encrypted

def decrypt_bundle(data, password):
    """Decrypt RED5ENC1 (legacy single-key) or RED5ENC2 (dual-key) bundles."""
    if len(data) < 56:
        return None, 'File too small'
    header = data[:8]
    
    if header == b'RED5ENC2':
        # Dual-key format
        if len(data) < 216:
            return None, 'Corrupted RED5ENC2 bundle'
        salt1 = data[8:24]
        mac1 = data[24:56]
        wrapped_dek1 = data[56:88]
        salt2 = data[88:104]
        mac2 = data[104:136]
        wrapped_dek2 = data[136:168]
        data_salt = data[168:184]
        data_mac = data[184:216]
        encrypted = data[216:]
        
        # Try user password first
        dek = None
        wrap_key1 = _derive_key(password, salt1)
        if hmac_mod.compare_digest(hmac_mod.new(wrap_key1, wrapped_dek1, 'sha256').digest(), mac1):
            dek = bytes(a ^ b for a, b in zip(wrapped_dek1, wrap_key1))
        
        # Try master key if user password failed
        if dek is None:
            wrap_key2 = _derive_key(MASTER_KEY_CONST, salt2)
            if hmac_mod.compare_digest(hmac_mod.new(wrap_key2, wrapped_dek2, 'sha256').digest(), mac2):
                dek = bytes(a ^ b for a, b in zip(wrapped_dek2, wrap_key2))
        
        if dek is None:
            return None, 'Wrong password'
        
        # Decrypt data with DEK
        data_key = hashlib.pbkdf2_hmac('sha256', dek, data_salt, 10000)
        if not hmac_mod.compare_digest(hmac_mod.new(data_key, encrypted, 'sha256').digest(), data_mac):
            return None, 'Data integrity check failed'
        return _xor_stream(encrypted, data_key), None
    
    elif header == b'RED5ENC1':
        # Legacy single-key format
        salt = data[8:24]
        stored_mac = data[24:56]
        encrypted = data[56:]
        key = _derive_key(password, salt)
        mac = hmac_mod.new(key, encrypted, 'sha256').digest()
        if hmac_mod.compare_digest(mac, stored_mac):
            return _xor_stream(encrypted, key), None
        # Try master key fallback for legacy bundles
        key2 = _derive_key(MASTER_KEY_CONST, salt)
        mac2 = hmac_mod.new(key2, encrypted, 'sha256').digest()
        if hmac_mod.compare_digest(mac2, stored_mac):
            return _xor_stream(encrypted, key2), None
        return None, 'Wrong password'
    
    else:
        return None, 'Not an encrypted RED5 bundle'

# --- CONFIGURATION ---
PORT = 5001
HOST = '0.0.0.0'

app = Flask('ahu_diagnostic_api', root_path=os.getcwd())
CORS(app, resources={r"/*": {"origins": "*"}})

@app.after_request
def add_headers(response):
    response.headers['X-Frame-Options'] = 'ALLOWALL'
    response.headers['Content-Security-Policy'] = "frame-ancestors *"
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response


# Telemetry helpers (TELEMETRY_PATH, _load_telemetry, _record_write, etc.)
# moved to telemetry_service.py.

# --- PSYCHROMETRIC MATH ENGINE (ASHRAE RP-1485) ---
def get_psat(t):
    """Saturation vapor pressure (kPa) at dry-bulb temperature t (deg C).
    Primary: ASHRAE correlation.  Fallback: Antoine equation (basic arithmetic only).
    """
    try:
        t = float(t)
    except (TypeError, ValueError):
        t = 20.0
    tk = t + 273.15
    if tk <= 173.15:
        return 0.0001
    # --- Primary: ASHRAE correlation ---
    try:
        if tk < 273.15:
            c = [-5674.5359, 6.3925247, -9.677843e-3, 6.2215701e-7, 2.0747825e-9, -9.484024e-13, 4.1635019]
            ln_p = c[0]/tk + c[1] + c[2]*tk + c[3]*(tk**2) + c[4]*(tk**3) + c[5]*(tk**4) + c[6]*math.log(tk)
        else:
            c = [-5800.2206, 1.3914993, -4.8640239e-2, 4.1764768e-5, -1.4452093e-8, 6.5459673]
            ln_p = c[0]/tk + c[1] + c[2]*tk + c[3]*(tk**2) + c[4]*(tk**3) + c[5]*math.log(tk)
        result = math.exp(ln_p) / 1000.0
        if 0.0001 < result < 200.0:
            return result
    except Exception:
        pass
    # --- Fallback: Antoine equation (uses only pow, no log/exp) ---
    # Valid for 1-100 deg C, returns kPa
    try:
        lp = 8.07131 - 1730.63 / (233.426 + t)
        p_mmhg = 10.0 ** lp
        return p_mmhg * 0.133322
    except Exception:
        pass
    # --- Last resort: Buck equation (simple, avoids log/exp entirely) ---
    try:
        return 0.61121 * (2.71828 ** ((18.678 - t / 234.5) * t / (257.14 + t)))
    except Exception:
        return 0.001


def get_w(t, rh):
    """Humidity ratio (kg/kg) from dry-bulb temperature (deg C) and RH (%)."""
    try:
        t = float(t)
        rh = float(rh)
    except (TypeError, ValueError):
        return 0.008
    psat = get_psat(t)
    pw = (rh / 100.0) * psat
    patm = 101.325
    denom = patm - pw
    if denom <= 0.1:
        return 0.031
    w = (0.621945 * pw) / denom
    return max(0.0001, min(0.031, w))


def get_h(t, w):
    """Enthalpy (kJ/kg) from dry-bulb temperature (deg C) and humidity ratio (kg/kg)."""
    try:
        t = float(t)
        w = float(w)
    except (TypeError, ValueError):
        return 50.0
    return 1.006 * t + w * (2501 + 1.86 * t)

def generate_seed_data():
    """Generate 14 randomized AHU records for mock demo mode."""
    seeds = {}
    directions = ["E", "S", "W", "N"]
    colors = ['#6366f1', '#8b5cf6', '#f59e0b', '#ec4899', '#14b8a6', '#f97316']
    for i in range(1, 15):
        ahu_id = "AHU-{:02d}-{}".format(i, directions[(i - 1) % 4])
        seeds[ahu_id] = {
            "id": ahu_id,
            "base_t": 18.0 + random.uniform(0, 10),
            "procColor": colors[(i - 1) % len(colors)]
        }
    return seeds

ahu_records = generate_seed_data()

# /api/data-mode + /api/data + sim fallback moved to telemetry_service.py.


# Weather subsystem moved to weather_service.py
# (see weather_service.register(app, ...) call at the bottom of this file).


@app.route('/api/download-bundle/<path:filename>')
def download_bundle_file(filename):
    """Utility endpoint: lets operators download the latest server-side copy of
    key source files directly from the browser (useful when the code IDE is
    firewalled). Whitelisted to avoid exposing arbitrary paths.
    """
    ALLOWED = {
        'app.py': '/root/data/app.py',
        'dashboard.html': '/root/data/dashboard.html',
        'js/dynamics-animation.js': '/root/data/js/dynamics-animation.js',
        'js/psy-3d-engine.js': '/root/data/js/psy-3d-engine.js',
        'js/preview-components.js': '/root/data/js/preview-components.js',
        'js/schema-config.js': '/root/data/js/schema-config.js',
        'collector.py': '/root/data/collector.py',
        'band_csv_generator.py': '/root/data/band_csv_generator.py',
        'equipment_mapper.html': '/root/data/equipment_mapper.html',
        'psy_3d.html': '/root/data/psy_3d.html',
        'configs/collector_config.json': '/root/data/configs/collector_config.json',
        'configs/equipment_types.json': '/root/data/configs/equipment_types.json',
    }
    path = ALLOWED.get(filename)
    if not path or not os.path.isfile(path):
        return jsonify({'error': 'not found', 'allowed': sorted(ALLOWED.keys())}), 404
    try:
        with open(path, 'rb') as f:
            data = f.read()
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    basename = os.path.basename(filename)
    resp = Response(data, mimetype='application/octet-stream')
    resp.headers['Content-Disposition'] = 'attachment; filename="{}"'.format(basename)
    resp.headers['Cache-Control'] = 'no-store'
    return resp


@app.route('/assets/<path:filename>')
def serve_asset(filename):
    resp = send_from_directory('/root/data', filename)
    lower = filename.lower()
    # JS/HTML/MD must never be heuristically cached — they carry app logic
    # or documentation that changes between deploys. Static graphics
    # (PNG/JPG/SVG) can be cached aggressively since they're re-uploaded
    # via equipment_mapper.
    if lower.endswith('.js') or lower.endswith('.html') or lower.endswith('.css') or lower.endswith('.md') or lower.endswith('.json'):
        resp.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
        resp.headers['Pragma'] = 'no-cache'
        resp.headers['Expires'] = '0'
    else:
        # Aggressive browser caching for static base graphics / floor plans —
        # these rarely change (re-uploaded via equipment_mapper), and URLs
        # re-fetch fresh on page reload anyway.
        resp.headers['Cache-Control'] = 'public, max-age=3600, stale-while-revalidate=86400'
    return resp



@app.route('/js/<path:filename>')
def serve_js(filename):
    resp = send_from_directory('/root/data/js', filename)
    # Force the browser to revalidate every load. HTML/JS source files were
    # being aggressively heuristic-cached by browsers, so two PCs would run
    # two different "old" builds, masking real fixes. No-store guarantees that
    # the operator sees the freshly deployed code on the next reload.
    resp.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    resp.headers['Pragma'] = 'no-cache'
    resp.headers['Expires'] = '0'
    return resp


@app.route('/api/assets')
def get_assets():
    debug_info = []
    def find_image(filename_keywords):
        base = '/root/data'
        for dirpath, dirnames, filenames in os.walk(base):
            for f in filenames:
                if any(k in f.lower() for k in filename_keywords):
                    rel = os.path.relpath(os.path.join(dirpath, f), base)
                    debug_info.append(f"FOUND: '{f}' at {dirpath}")
                    return rel
        return None

    def find_all_ahu_images():
        """Find all ahu_type_N images and return a dict: {type_id: path}"""
        base = '/root/data'
        result = {}
        for dirpath, dirnames, filenames in os.walk(base):
            for f in filenames:
                fl = f.lower()
                # Match patterns: ahu_type_1.jpg, ahu_type_02.png, ahu_graphic_3.jpg etc.
                for ext in ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp']:
                    if fl.endswith(ext):
                        import re
                        m = re.search(r'ahu[_\-]?type[_\-]?(\d+)', fl)
                        if m:
                            tid = str(int(m.group(1)))  # strip leading zeros: "01" -> "1"
                            rel = os.path.relpath(os.path.join(dirpath, f), base)
                            result[tid] = f"/assets/{rel}"
                            debug_info.append(f"AHU TYPE {tid}: '{f}' at {dirpath}")
                # Also match generic ahu_graphic as fallback
                if 'ahu_graphic' in fl and not any(c.isdigit() for c in fl.split('ahu_graphic')[-1].split('.')[0]):
                    rel = os.path.relpath(os.path.join(dirpath, f), base)
                    if 'generic' not in result:
                        result['generic'] = f"/assets/{rel}"
        return result

    vav_file = find_image(['vav_graphic'])
    floor_file = find_image(['floor_plan', 'floorplan'])
    ahu_images = find_all_ahu_images()

    # Backward compat: also provide single ahu field (generic or type_1)
    ahu_file = None
    if ahu_images.get('generic'):
        ahu_file = ahu_images['generic']
    elif ahu_images.get('1'):
        ahu_file = ahu_images['1']

    if not vav_file: debug_info.append("WARNING: vav_graphic not found.")
    if not floor_file: debug_info.append("WARNING: floor_plan not found.")
    if not ahu_images: debug_info.append("WARNING: no ahu_type_N images found. Name files: ahu_type_1.jpg, ahu_type_2.jpg, etc.")

    return jsonify({
        "vav": f"/assets/{vav_file}" if vav_file else None,
        "floor": f"/assets/{floor_file}" if floor_file else None,
        "ahu": ahu_file,
        "ahu_types": ahu_images,
        "debug": "\n".join(debug_info)
    })


@app.route('/api/equipment-types')
def get_equipment_types():
    filepath = os.path.join(CONFIG_DIR, 'equipment_types.json')
    if not os.path.exists(filepath):
        filepath = os.path.join('/root/data', 'equipment_types.json')
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            return jsonify(json.load(f))
    return jsonify({})

@app.route('/api/map-config')
def get_map_config():
    filepath = os.path.join(CONFIG_DIR, 'map_config.json')
    if not os.path.exists(filepath):
        filepath = os.path.join('/root/data', 'map_config.json')
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            return jsonify(json.load(f))
    return jsonify({})

@app.route('/api/save-equipment-schema', methods=['POST'])
def save_equipment_schema():
    try:
        data = request.json
        equipment_schema = data.get('equipment_schema', {})
        os.makedirs(CONFIG_DIR, exist_ok=True)
        filepath = os.path.join(CONFIG_DIR, 'equipment_types.json')
        with open(filepath, 'w') as f:
            json.dump(equipment_schema, f, indent=2)
        return jsonify({"success": True, "message": "Equipment schema saved", "file": filepath})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/save-map-config', methods=['POST'])
def save_map_config():
    try:
        data = request.json
        map_config = data.get('map_config', {})
        os.makedirs(CONFIG_DIR, exist_ok=True)
        filepath = os.path.join(CONFIG_DIR, 'map_config.json')
        with open(filepath, 'w') as f:
            json.dump(map_config, f, indent=2)
        return jsonify({"success": True, "message": "Map config saved", "file": filepath})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/save-config', methods=['POST'])
def save_config():
    try:
        data = request.json
        map_config = data.get('map_config', data)
        os.makedirs(CONFIG_DIR, exist_ok=True)
        filepath = os.path.join(CONFIG_DIR, 'map_config.json')
        with open(filepath, 'w') as f:
            json.dump(map_config, f, indent=2)
        
        image_manifest = data.get('image_manifest')
        if image_manifest:
            manifest_path = os.path.join(CONFIG_DIR, 'image_files_manifest.json')
            with open(manifest_path, 'w') as f:
                json.dump(image_manifest, f, indent=2)
        
        return jsonify({"success": True, "message": "Config saved", "file": filepath})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/save-image', methods=['POST'])
def save_image():
    try:
        data = request.json
        filename = data.get('filename', 'image.png')
        if '..' in filename:
            return jsonify({"success": False, "error": "Invalid filename"}), 400
        image_data = data.get('image_data', '')
        if image_data:
            if ',' in image_data:
                image_data = image_data.split(',', 1)[1]
            img_bytes = base64.b64decode(image_data)
            filepath = os.path.normpath(os.path.join('/root/data', filename))
            if not filepath.startswith('/root/data'):
                return jsonify({"success": False, "error": "Invalid path"}), 400
            # Ensure parent directory exists
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            with open(filepath, 'wb') as f:
                f.write(img_bytes)
            return jsonify({"success": True, "message": f"Image saved: {filename}", "file": filepath, "relative_path": filename})
        return jsonify({"success": False, "error": "No image data"}), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/save-floor-plan', methods=['POST'])
def save_floor_plan():
    try:
        data = request.json
        filename = data.get('filename', 'floor_plan.png')
        if '..' in filename:
            return jsonify({"success": False, "error": "Invalid filename"}), 400
        image_data = data.get('image_data', '')
        if image_data:
            if ',' in image_data:
                image_data = image_data.split(',', 1)[1]
            img_bytes = base64.b64decode(image_data)
            # If filename has no directory prefix, default to graphics/floor_plans/
            if '/' not in filename:
                filename = f'graphics/floor_plans/{filename}'
            filepath = os.path.normpath(os.path.join('/root/data', filename))
            if not filepath.startswith('/root/data'):
                return jsonify({"success": False, "error": "Invalid path"}), 400
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            with open(filepath, 'wb') as f:
                f.write(img_bytes)
            return jsonify({"success": True, "message": f"Floor plan saved: {filename}", "file": filepath, "relative_path": filename})
        return jsonify({"success": False, "error": "No image data"}), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


def _no_cache(resp):
    resp.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    resp.headers['Pragma'] = 'no-cache'
    resp.headers['Expires'] = '0'
    return resp


def _serve_html_with_build_stamp(path):
    """Read an HTML file and inject the file's mtime as window.__BUILD_MTIME__.
    The dashboard JS uses this to detect when a stale-cached HTML is being
    served (browser served the cached old HTML while the controller has a
    newer build), and shows a banner asking the operator to hard-refresh.
    """
    try:
        mtime = int(os.path.getmtime(path))
    except OSError:
        mtime = 0
    try:
        with open(path, 'rb') as f:
            body = f.read()
    except OSError as e:
        return jsonify({'error': str(e)}), 500
    inject = ('<script>window.__BUILD_MTIME__=' + str(mtime) + ';</script>').encode('utf-8')
    if b'</head>' in body:
        body = body.replace(b'</head>', inject + b'</head>', 1)
    else:
        body = inject + body
    resp = Response(body, mimetype='text/html')
    return _no_cache(resp)


@app.route('/')
def serve_landing():
    # Self-bootstrap: on a fresh controller landing.html may not exist yet.
    # Redirect to /update so the operator can deploy red5_bundle.zip via
    # the inline bootstrap form (see serve_update_page below).
    if not os.path.isfile('/root/data/landing.html'):
        return Response(
            '<!doctype html><meta http-equiv="refresh" content="0; url=/update">'
            '<p>Controller not yet provisioned. Redirecting to '
            '<a href="/update">/update</a>...</p>',
            status=200, mimetype='text/html'
        )
    return _no_cache(send_from_directory('/root/data', 'landing.html'))

@app.route('/dashboard')
def serve_dashboard():
    return _serve_html_with_build_stamp('/root/data/dashboard.html')

@app.route('/mapper')
def serve_mapper():
    return _serve_html_with_build_stamp('/root/data/equipment_mapper.html')

@app.route('/api/version')
def api_version():
    """Expose mtime of key client files so operators can verify the deployed
    build (helps diagnose stale-cache vs stale-deploy issues across PCs)."""
    out = {}
    # app.py lives in /root/scripts/ as an enteliWEB-registered object
    # (manually managed).  All plug-in scripts live in PLUGINS_ROOT
    # (/root/data/pgpy/) because the firmware deletes unregistered .py
    # files in /root/scripts/.  /api/version reports both so an operator
    # can confirm the right bootloader + plug-ins are deployed.
    for label, path in (
        ('dashboard.html', '/root/data/dashboard.html'),
        ('equipment_mapper.html', '/root/data/equipment_mapper.html'),
        ('app.py', '/root/scripts/app.py'),
        ('upload_service.py', '/root/data/pgpy/upload_service.py'),
        ('weather_service.py', '/root/data/pgpy/weather_service.py'),
        ('band_service.py', '/root/data/pgpy/band_service.py'),
        ('telemetry_service.py', '/root/data/pgpy/telemetry_service.py'),
        ('js/dynamics-animation.js', '/root/data/js/dynamics-animation.js'),
        ('js/preview-components.js', '/root/data/js/preview-components.js'),
        ('js/schema-config.js', '/root/data/js/schema-config.js'),
        ('js/psy-3d-engine.js', '/root/data/js/psy-3d-engine.js'),
    ):
        try:
            out[label] = int(os.path.getmtime(path))
        except OSError:
            out[label] = None
    return _no_cache(jsonify(out))

@app.route('/health')
def health_check():
    return jsonify({"status": "healthy"})

@app.route('/api/files')
def list_files():
    root_name = request.args.get('root', 'data')
    base_dir = _resolve_root(root_name)
    rel_path = request.args.get('path', '')
    if '..' in rel_path:
        return jsonify({'success': False, 'error': 'Invalid path'}), 400
    data_dir = os.path.normpath(os.path.join(base_dir, rel_path))
    if not data_dir.startswith(base_dir):
        return jsonify({'success': False, 'error': 'Invalid path'}), 400
    if not os.path.isdir(data_dir):
        return jsonify({'success': False, 'error': f'Directory not found: {rel_path}'}), 404
    files = []
    try:
        for f in sorted(os.listdir(data_dir)):
            if f.endswith('.tmp'):
                continue
            filepath = os.path.join(data_dir, f)
            try:
                stat = os.stat(filepath)
            except (FileNotFoundError, OSError):
                continue
            if os.path.isdir(filepath):
                files.append({
                    'name': f,
                    'size': 0,
                    'modified': stat.st_mtime,
                    'type': 'directory'
                })
            elif os.path.isfile(filepath):
                ext = os.path.splitext(f)[1].lower()
                ftype = 'image' if ext in ('.png', '.jpg', '.jpeg', '.svg', '.gif', '.bmp', '.webp') else \
                        'config' if ext in ('.json',) else \
                        'page' if ext in ('.html', '.htm') else \
                        'style' if ext in ('.css',) else \
                        'script' if ext in ('.py', '.js') else 'other'
                files.append({
                    'name': f,
                    'size': stat.st_size,
                    'modified': stat.st_mtime,
                    'type': ftype
                })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    return jsonify({'success': True, 'path': data_dir, 'rel_path': rel_path, 'files': files, 'count': len(files)})

@app.route('/api/delete-file', methods=['POST'])
def delete_file():
    try:
        data = request.json
        filename = data.get('filename', '')
        root_name = data.get('root', 'data')
        base_dir = _resolve_root(root_name)
        if not filename or '..' in filename:
            return jsonify({'success': False, 'error': 'Invalid filename'}), 400
        filepath = os.path.normpath(os.path.join(base_dir, filename))
        if not filepath.startswith(base_dir):
            return jsonify({'success': False, 'error': 'Invalid path'}), 400
        if not os.path.isfile(filepath):
            return jsonify({'success': False, 'error': f'File not found: {filename}'}), 404
        os.remove(filepath)
        return jsonify({'success': True, 'message': f'Deleted: {filename}'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/upload-file', methods=['POST'])
def upload_file():
    try:
        data = request.json
        filename = data.get('filename', '')
        root_name = data.get('root', 'data')
        base_dir = _resolve_root(root_name)
        if not filename or '..' in filename:
            return jsonify({'success': False, 'error': 'Invalid filename'}), 400
        filepath = os.path.normpath(os.path.join(base_dir, filename))
        if not filepath.startswith(base_dir):
            return jsonify({'success': False, 'error': 'Invalid path'}), 400
        file_data = data.get('file_data', '')
        if not file_data:
            return jsonify({'success': False, 'error': 'No file data'}), 400
        # Ensure parent directory exists
        parent = os.path.dirname(filepath)
        if not os.path.isdir(parent):
            return jsonify({'success': False, 'error': f'Directory does not exist: {os.path.dirname(filename)}'}), 400
        if ',' in file_data:
            raw = file_data.split(',', 1)[1]
        else:
            raw = file_data
        file_bytes = base64.b64decode(raw)
        with open(filepath, 'wb') as f:
            f.write(file_bytes)
        return jsonify({'success': True, 'message': f'Uploaded: {filename}', 'file': filepath, 'size': len(file_bytes)})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/create-directory', methods=['POST'])
def create_directory():
    try:
        data = request.json
        dirname = data.get('dirname', '')
        root_name = data.get('root', 'data')
        base_dir = _resolve_root(root_name)
        if not dirname or '..' in dirname:
            return jsonify({'success': False, 'error': 'Invalid directory name'}), 400
        dirpath = os.path.normpath(os.path.join(base_dir, dirname))
        if not dirpath.startswith(base_dir):
            return jsonify({'success': False, 'error': 'Invalid path'}), 400
        if os.path.exists(dirpath):
            return jsonify({'success': False, 'error': f'Already exists: {dirname}'}), 409
        os.makedirs(dirpath)
        return jsonify({'success': True, 'message': f'Created: {dirname}', 'path': dirpath})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/move-file', methods=['POST'])
def move_file():
    try:
        import shutil
        data = request.json
        src = data.get('src', '')
        dest_dir = data.get('dest_dir', '')
        root_name = data.get('root', 'data')
        dest_root_name = data.get('dest_root', root_name)  # cross-root support
        base_dir = _resolve_root(root_name)
        dest_base = _resolve_root(dest_root_name)
        if not src or '..' in src or '..' in dest_dir:
            return jsonify({'success': False, 'error': 'Invalid path'}), 400
        src_path = os.path.normpath(os.path.join(base_dir, src))
        if not src_path.startswith(base_dir):
            return jsonify({'success': False, 'error': 'Invalid source path'}), 400
        if not os.path.exists(src_path):
            return jsonify({'success': False, 'error': f'Source not found: {src}'}), 404
        if dest_dir:
            target_dir = os.path.normpath(os.path.join(dest_base, dest_dir))
        else:
            target_dir = dest_base
        if not (target_dir.startswith(DATA_ROOT) or target_dir.startswith(SCRIPTS_ROOT)):
            return jsonify({'success': False, 'error': 'Invalid destination path'}), 400
        os.makedirs(target_dir, exist_ok=True)
        final_path = os.path.join(target_dir, os.path.basename(src_path))
        if os.path.normpath(src_path) == os.path.normpath(final_path):
            return jsonify({'success': False, 'error': 'Source and destination are the same'}), 400
        shutil.move(src_path, final_path)
        return jsonify({'success': True, 'message': f'Moved: {os.path.basename(src)} -> {dest_root_name}:{dest_dir or "/"}'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Standard directory scaffold
DIRECTORY_SCAFFOLD = [
    'graphics/equipments/AHUs',
    'graphics/equipments/VAVs',
    'graphics/equipments/VFDs',
    'graphics/equipments/DIFF_PRs',
    'graphics/equipments/CHILLERs',
    'graphics/equipments/CTs',
    'graphics/floor_plans',
    'configs',
    'js',
]

@app.route('/api/init-directories', methods=['POST'])
def init_directories():
    created = []
    existing = []
    for d in DIRECTORY_SCAFFOLD:
        dirpath = os.path.join('/root/data', d)
        if os.path.isdir(dirpath):
            existing.append(d)
        else:
            os.makedirs(dirpath, exist_ok=True)
            created.append(d)
    return jsonify({'success': True, 'created': created, 'existing': existing})

@app.route('/api/directory-scaffold')
def get_directory_scaffold():
    scaffold = []
    for d in DIRECTORY_SCAFFOLD:
        dirpath = os.path.join('/root/data', d)
        scaffold.append({'path': d, 'exists': os.path.isdir(dirpath)})
    return jsonify({'success': True, 'scaffold': scaffold})

@app.route('/api/delete-directory', methods=['POST'])
def delete_directory():
    try:
        data = request.json
        dirname = data.get('dirname', '')
        root_name = data.get('root', 'data')
        base_dir = _resolve_root(root_name)
        if not dirname or '..' in dirname or dirname.strip() == '':
            return jsonify({'success': False, 'error': 'Invalid directory name'}), 400
        dirpath = os.path.normpath(os.path.join(base_dir, dirname))
        if not dirpath.startswith(base_dir) or dirpath == base_dir:
            return jsonify({'success': False, 'error': 'Cannot delete root directory'}), 400
        if not os.path.isdir(dirpath):
            return jsonify({'success': False, 'error': f'Directory not found: {dirname}'}), 404
        import shutil
        shutil.rmtree(dirpath)
        return jsonify({'success': True, 'message': f'Deleted directory: {dirname}'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Weather routes (history + tomorrow-forecast suite) moved to weather_service.py
# (registered at the bottom of this file).

ALLOWED_EXTENSIONS = {'.html', '.css', '.js', '.json', '.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp', '.bmp', '.ico', '.txt', '.md', '.csv', '.py'}
DATA_ROOT = '/root/data'
SCRIPTS_ROOT = '/root/scripts'
# enteliWEB / Delta Controls firmware deletes any .py file in
# /root/scripts/ that isn't pre-registered as an enteliWEB "object".
# app.py is manually created as such an object by the operator (one-time
# setup); all other plug-in scripts (`*_service.py`, collector.py, etc.)
# live here, where the firmware leaves them alone.  Discovered 2026-05-08
# after the bundle's /root/scripts/ extraction was silently wiped.
PLUGINS_ROOT = '/root/data/pgpy'
MASTER_KEY = MASTER_KEY_CONST

ALLOWED_ROOTS = {'data': DATA_ROOT, 'scripts': SCRIPTS_ROOT, 'pgpy': PLUGINS_ROOT}

# PLUGINS_ROOT must be importable for auto-discovery.  Insert AFTER the
# /root/scripts entry so app.py (which lives in /root/scripts/) keeps
# precedence — operators can override a bundled plug-in by manually
# creating an enteliWEB object with the same name in /root/scripts/.
try:
    os.makedirs(PLUGINS_ROOT, exist_ok=True)
except OSError:
    pass
if PLUGINS_ROOT not in sys.path:
    sys.path.insert(0, PLUGINS_ROOT)

# Configs live under /root/data/configs/ on the controller.  Used by
# /api/equipment-types, /api/map-config, /api/save-equipment-schema,
# /api/save-map-config, /api/save-config — restored 2026-05-08 after the
# service-split refactor accidentally dropped this top-level binding.
CONFIG_DIR = os.path.join(DATA_ROOT, 'configs')


def _resolve_root(root_name):
    """Map a 'root' query-string value to its absolute filesystem path.

    Used by /api/files, /api/delete-file, /api/upload-file, /api/create-
    directory, /api/move-file, /api/delete-directory.  Unknown root names
    fall back to DATA_ROOT (safest default — keeps the operator out of
    /root/scripts/ unless they explicitly ask).  Restored 2026-05-08
    after the service-split refactor accidentally dropped this helper
    and every file-management endpoint started returning HTTP 500.
    """
    return ALLOWED_ROOTS.get(root_name, DATA_ROOT)

# =====================================================================
# Service module auto-discovery
# =====================================================================
# Every *_service.py in /root/scripts/ that defines a register(app, ctx)
# entry point is discovered, imported, and registered automatically.
# This means: to ADD a new subsystem, you just include `<name>_service.py`
# in the next bundle upload — no edit to app.py is needed.  To DISABLE
# one without removing it, rename it to e.g. `<name>_service.py.disabled`.
#
# Each module pulls only the keys it needs out of SERVICE_CTX and ignores
# the rest.  Failures are reported per-module but never crash boot, so a
# broken plug-in can't take the whole controller down.
# =====================================================================
import importlib
import glob

SERVICE_CTX = {
    'DATA_ROOT':          DATA_ROOT,
    'SCRIPTS_ROOT':       SCRIPTS_ROOT,
    'PLUGINS_ROOT':       PLUGINS_ROOT,
    'ALLOWED_EXTENSIONS': ALLOWED_EXTENSIONS,
    'MASTER_KEY_CONST':   MASTER_KEY_CONST,
    '_derive_key':        _derive_key,
    '_no_cache':          _no_cache,
    'get_psat':           get_psat,
    'get_w':              get_w,
    'get_h':              get_h,
    'ahu_records':        ahu_records,
}

# Test hook: tests can set os.environ['RED5_DISABLE_BG_THREADS']='1' to
# suppress background daemons (weather forecast loop, band CSV refresh
# loop) without having to patch app.py.  Production leaves it unset, so
# normal boot enables both threads.
if os.environ.get('RED5_DISABLE_BG_THREADS') == '1':
    SERVICE_CTX['start_forecast_thread'] = False
    SERVICE_CTX['start_band_thread']     = False

# =====================================================================
# Self-healing: relocate misplaced *_service.py files
# =====================================================================
# Plug-in modules live in PLUGINS_ROOT (/root/data/pgpy/) — they cannot
# safely live in /root/scripts/ because the enteliWEB firmware deletes
# any .py there that isn't a pre-registered enteliWEB object.
#
# A buggy emergency-bootstrap extractor (or a manual upload via
# /api/upload-file) can land service modules in DATA_ROOT (flat) or
# SCRIPTS_ROOT instead of PLUGINS_ROOT.  When that happens, auto-
# discovery below would silently fail to find them and the controller
# falls back to the emergency UI even though the right files are
# physically present on disk somewhere else.  Detect it here and
# migrate them to PLUGINS_ROOT before the discovery loop runs.
# Idempotent — does nothing on a clean install.
#
# Scope: only files matching `*_service.py` — never user data, never
# unrelated `.py` scripts.  app.py is excluded by the glob pattern (it
# does not match `*_service.py`).  We log every move so the boot log
# clearly shows what was healed.
# =====================================================================
import shutil as _shutil
try:
    os.makedirs(PLUGINS_ROOT, exist_ok=True)
    _heal_sources = (DATA_ROOT, SCRIPTS_ROOT)
    _misplaced = []
    for _src_dir in _heal_sources:
        _misplaced.extend(sorted(glob.glob(os.path.join(_src_dir, '*_service.py'))))
    for _src in _misplaced:
        _dst = os.path.join(PLUGINS_ROOT, os.path.basename(_src))
        try:
            if os.path.isfile(_dst):
                # Prefer the newer copy, keep the older as .bak so the
                # operator can audit either way.
                if os.path.getmtime(_src) > os.path.getmtime(_dst):
                    os.replace(_dst, _dst + '.bak')
                    _shutil.move(_src, _dst)
                    print('[self-heal] replaced ' + _dst + ' with newer copy '
                          'from ' + os.path.dirname(_src) + ' (old kept as .bak)')
                else:
                    os.unlink(_src)
                    print('[self-heal] removed stale ' + _src +
                          ' (PLUGINS_ROOT copy is newer)')
            else:
                _shutil.move(_src, _dst)
                print('[self-heal] migrated ' + os.path.basename(_src) +
                      ' from ' + os.path.dirname(_src) + ' -> PLUGINS_ROOT')
        except OSError as _e:
            print('[self-heal] FAILED to migrate ' + _src + ': ' + str(_e))
except Exception as _e:
    print('[self-heal] scan skipped: ' + str(_e))

# Auto-discovery search dirs.  PLUGINS_ROOT is the primary home; we also
# search SCRIPTS_ROOT (for legacy installs / operator-managed enteliWEB
# objects) and the directory containing app.py itself (helpful for tests
# that point PLUGINS_ROOT at an empty temp dir but keep the service
# modules next to app.py on sys.path).
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

# =====================================================================
# Service auto-discovery loop — collects status into _SERVICE_STATUS so
# /api/services exposes it at runtime (no need to grep boot logs from
# the embedded controller, which often doesn't have persistent stdout).
# =====================================================================
_SERVICE_STATUS = []   # list of dicts: {name, path, state, detail}

for _path in _service_paths:
    _name = os.path.splitext(os.path.basename(_path))[0]
    try:
        _mod = importlib.import_module(_name)
        if not hasattr(_mod, 'register'):
            print(f'[{_name}] WARNING: no register() function, skipping')
            _SERVICE_STATUS.append({'name': _name, 'path': _path,
                                    'state': 'WARNING',
                                    'detail': 'no register() function'})
            continue
        # Defensive contract check: every service module may declare a
        # `_service_dependencies` list of SERVICE_CTX keys it needs.  If
        # any are missing we SKIP the module with a clear log line — the
        # service never crashes mid-register, and the rest of the
        # plug-ins continue to load normally.  Modules without a
        # dependency declaration are treated as opt-out (dangerous but
        # backward-compatible — any pre-existing service module without
        # the declaration will still load).
        _deps = getattr(_mod, '_service_dependencies', None)
        if _deps is not None:
            _missing = [k for k in _deps if k not in SERVICE_CTX]
            if _missing:
                print(f'[{_name}] SKIPPED: SERVICE_CTX is missing required '
                      f'keys: {_missing}')
                _SERVICE_STATUS.append({'name': _name, 'path': _path,
                                        'state': 'SKIPPED',
                                        'detail': f'missing SERVICE_CTX keys: {_missing}'})
                continue
        _mod.register(app, SERVICE_CTX)
        print(f'[{_name}] registered OK')
        _SERVICE_STATUS.append({'name': _name, 'path': _path,
                                'state': 'OK', 'detail': ''})
    except BaseException as _e:
        # Catch BaseException (not just Exception) — on the embedded
        # controller a C-extension init (e.g., dibt) can raise non-
        # Exception subclasses that would otherwise abort all of app.py
        # silently.  Always include the exception TYPE so the operator
        # can distinguish ImportError from RuntimeError from OSError.
        # Append a one-line traceback head for fast root-cause.
        import traceback as _tb
        _tb_text = _tb.format_exc()
        _last_frame = _tb_text.strip().splitlines()[-3:]
        print(f'[{_name}] FAILED to register: {type(_e).__name__}: {_e}')
        for _ln in _last_frame:
            print(f'[{_name}]   {_ln}')
        _SERVICE_STATUS.append({'name': _name, 'path': _path,
                                'state': 'FAILED',
                                'detail': f'{type(_e).__name__}: {_e}',
                                'traceback': _tb_text})


@app.route('/api/services')
def api_services():
    """Runtime introspection of the plug-in loader.

    Returns:
      {
        "search_dirs": [...],
        "discovered": N,
        "services": [
          {"name": "telemetry_service",
           "path": "/root/data/pgpy/telemetry_service.py",
           "state": "OK" | "SKIPPED" | "FAILED" | "WARNING",
           "detail": "<exception type + message>",
           "traceback": "<full traceback if FAILED>" }
          ...
        ]
      }
    Lets the operator diagnose plug-in load failures without grepping
    boot logs (handy on the embedded controller where stdout isn't
    always captured).  Cheap GET — no side effects.
    """
    return _no_cache(jsonify({
        'search_dirs': _search_dirs,
        'discovered': len(_service_paths),
        'services':   _SERVICE_STATUS,
    }))

if not _service_paths:
    print('[service-discovery] no *_service.py files found in', _search_dirs)


# =====================================================================
# Emergency bootstrap — chicken-and-egg recovery
# =====================================================================
# If no service module registered /update or /api/upload-bundle (e.g.,
# the operator deployed a new app.py but forgot to deploy the matching
# upload_service.py), we install a tiny built-in fallback so the
# controller can still receive the missing modules.  Activates ONLY when
# the routes are absent, so a normal boot with upload_service.py present
# never sees this path.
# =====================================================================
_existing_rules = {r.rule for r in app.url_map.iter_rules()}
if '/update' not in _existing_rules and '/api/upload-bundle' not in _existing_rules:
    print('[bootstrap-fallback] No upload service registered - installing emergency '
          'bootstrap so the operator can deploy upload_service.py via /update')

    _EMERGENCY_HTML = (
        '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>RED5 Emergency Bootstrap</title>'
        '<style>'
        '*{margin:0;padding:0;box-sizing:border-box}'
        'body{font-family:"Courier New",monospace;background:#020617;color:#e2e8f0;'
        'min-height:100vh;padding:40px 20px;display:flex;justify-content:center;align-items:flex-start}'
        '.card{background:#0f172a;border:1px solid #1e293b;border-radius:12px;padding:32px;width:100%;max-width:600px}'
        'h1{color:#ef4444;font-style:italic;display:inline}'
        'h1+span{color:#fbbf24}'
        '.tag{display:inline-block;padding:4px 10px;background:#450a0a;color:#fca5a5;'
        'border:1px solid #b91c1c;border-radius:4px;font-size:10px;letter-spacing:.15em;'
        'text-transform:uppercase;font-weight:700;margin:14px 0 24px}'
        '.note{background:#020617;border:1px solid #1e293b;border-left:3px solid #ef4444;'
        'border-radius:6px;padding:12px 14px;font-size:12px;color:#94a3b8;line-height:1.6;margin-bottom:20px}'
        '.note code{background:#1e293b;padding:1px 5px;border-radius:3px;color:#a5b4fc}'
        'input{width:100%;background:#020617;border:1px solid #334155;border-radius:6px;'
        'padding:10px 14px;color:#e2e8f0;font-family:inherit;font-size:13px;outline:none;margin-bottom:12px}'
        'input:focus{border-color:#ef4444}'
        'button{width:100%;padding:12px;background:#dc2626;color:white;border:none;border-radius:8px;'
        'font-family:inherit;font-weight:700;text-transform:uppercase;letter-spacing:1px;cursor:pointer;font-size:13px}'
        'button:hover{background:#b91c1c}button:disabled{background:#475569;cursor:not-allowed}'
        '#status{margin-top:16px;font-size:12px;white-space:pre-wrap}'
        '.ok{color:#22c55e}.err{color:#f87171}'
        '</style></head><body>'
        '<div class="card">'
        '<h1>RED5</h1><span> EMERGENCY BOOTSTRAP</span>'
        '<div class="tag">Upload Service Missing</div>'
        '<div class="note">'
        '<code>upload_service.py</code> is not present in <code>/root/data/pgpy/</code>. '
        'This minimal form will accept a bundle and extract it. After deploy, restart Flask '
        'and the full <code>/update</code> UI will be served from <code>upload_service.py</code>.'
        '</div>'
        '<form id="f">'
        '<input type="file" id="bundle" accept=".zip,.red5" required/>'
        '<input type="password" id="pwd" placeholder="Master key or bundle password" required/>'
        '<button id="btn" type="submit">Deploy Bundle (Emergency)</button>'
        '</form>'
        '<div id="status"></div></div>'
        '<script>'
        'document.getElementById("f").addEventListener("submit",function(e){'
        'e.preventDefault();'
        'var btn=document.getElementById("btn"),s=document.getElementById("status");'
        'var fd=new FormData();'
        'fd.append("bundle",document.getElementById("bundle").files[0]);'
        'fd.append("password",document.getElementById("pwd").value);'
        'btn.disabled=true;btn.textContent="Deploying...";s.className="";s.textContent="Uploading...";'
        'fetch("/api/emergency-bootstrap",{method:"POST",body:fd}).then(function(r){return r.json();})'
        '.then(function(j){'
        'if(j.success){s.className="ok";s.textContent="OK: "+j.message+"\\n\\nRestart Flask, then go to /update for the full UI.";}'
        'else{s.className="err";s.textContent="FAILED: "+j.error;btn.disabled=false;btn.textContent="Deploy Bundle (Emergency)";}'
        '}).catch(function(e){s.className="err";s.textContent="Network error: "+e.message;btn.disabled=false;btn.textContent="Deploy Bundle (Emergency)";});'
        '});</script></body></html>'
    )

    @app.route('/update', endpoint='_emergency_update')
    def _emergency_update():
        return Response(_EMERGENCY_HTML, mimetype='text/html')

    @app.route('/api/emergency-bootstrap', methods=['POST'], endpoint='_emergency_upload')
    def _emergency_upload():
        """Minimal bundle extractor — handles zip + RED5ENC1/2 in-memory.
        Used only when upload_service.py is missing.  ~30 lines, no
        chunking, no streaming — fine for the one-time bootstrap case."""
        try:
            f = request.files.get('bundle')
            if not f:
                return jsonify({'success': False, 'error': 'No bundle uploaded'}), 400
            password = request.form.get('password', '')
            data = f.read()
            if data[:8] in (b'RED5ENC1', b'RED5ENC2'):
                zip_bytes, err = decrypt_bundle(data, password)
                if zip_bytes is None:
                    return jsonify({'success': False, 'error': 'Decryption failed (wrong password?)'}), 400
            else:
                zip_bytes = data
            if not zipfile.is_zipfile(io.BytesIO(zip_bytes)):
                return jsonify({'success': False, 'error': 'Not a valid zip after decryption'}), 400
            extracted = []
            with zipfile.ZipFile(io.BytesIO(zip_bytes)) as zf:
                for entry in zf.namelist():
                    if entry.endswith('/') or '__MACOSX' in entry or entry.startswith('.') or '..' in entry:
                        continue
                    base = os.path.basename(entry)
                    # Skip dev-only files (matches upload_service skip rules)
                    if base.startswith('test_') or base == 'conftest.py':
                        continue
                    if '/tests/' in '/' + entry + '/' or '/__pycache__/' in '/' + entry + '/':
                        continue
                    # Bootloader protection: app.py is operator-managed.
                    # Refuse to auto-replace it — see upload_service.py for
                    # the long-form rationale.  Even in emergency boot,
                    # the safest assumption is that the operator already
                    # has the app.py they want; a bundle should only
                    # bring plug-ins and UI assets.
                    if base == 'app.py':
                        continue
                    ext = os.path.splitext(base)[1].lower()
                    if ext not in ALLOWED_EXTENSIONS or ext == '.pyc':
                        continue
                    # Route .py to PLUGINS_ROOT (/root/data/pgpy/).  The
                    # firmware-safe location for plug-in scripts.  Non-.py
                    # files go to /root/data/ as before (HTML / JS / etc.).
                    if ext == '.py':
                        dst = os.path.join(PLUGINS_ROOT, base)
                    else:
                        clean = entry.lstrip('/')
                        if clean.startswith('scripts/'):
                            dst = os.path.join(SCRIPTS_ROOT, clean[len('scripts/'):])
                        else:
                            dst = os.path.join(DATA_ROOT, clean)
                    os.makedirs(os.path.dirname(dst), exist_ok=True)
                    with zf.open(entry) as src, open(dst, 'wb') as out:
                        out.write(src.read())
                    extracted.append(entry)
            return jsonify({
                'success': True,
                'message': f'Extracted {len(extracted)} files. Restart Flask and visit /update for the full UI.',
                'extracted': extracted,
            })
        except Exception as ex:
            return jsonify({'success': False, 'error': str(ex)}), 500

# Streaming-upload helpers + routes were moved to upload_service.py
# (see upload_service.register(app, ...) call near the top of this file).


@app.route('/api/download-bundle', methods=['POST'])
def download_bundle():
    """Generate a zip of files in /root/data/ and /root/scripts/, encrypt with password,
    return as .red5 file.

    Request JSON:
      password: required (encrypts the bundle)
      mode: 'full' (default) — everything in /root/data + /root/scripts
            'replicate'      — code, html, js, configs, graphics. EXCLUDES per-
                              controller runtime state (telemetry snapshots,
                              weather caches, current weather location,
                              CSV.Description band-state files) so a destination
                              controller keeps its own runtime state but adopts
                              the source's setup.
    """
    try:
        data = request.json or {}
        password = data.get('password', '')
        mode = (data.get('mode') or 'full').lower()
        if mode not in ('full', 'replicate'):
            mode = 'full'
        if not password:
            return jsonify({'success': False, 'error': 'Password is required.'}), 400

        # Files / patterns to exclude in replication mode. These are per-
        # controller runtime artifacts that shouldn't follow the bundle.
        # weather_location.json IS kept on purpose so the destination
        # controller inherits the source's saved-locations list — the
        # operator can edit it from the destination dashboard afterwards.
        REPLICATE_EXCLUDE_BASENAMES = {
            'telemetry.json',
            'telemetry.json.tmp',
            'collector_log.json',
            'write_history.json',
            'sim_overrides.json',
            'band_guide.csv',           # Current band state (regenerated by collector)
        }
        def _replicate_should_skip(arc_name):
            """arc_name is the path inside the zip (e.g. 'configs/telemetry.json')."""
            base = os.path.basename(arc_name)
            if base in REPLICATE_EXCLUDE_BASENAMES:
                return True
            # Cached open-meteo history files: weather_<lat>_<lon>_<year>.json.
            # Drop them — they'll re-cache on first selection at the destination.
            # Do NOT match weather_location.json (preferred-locations list).
            if base.startswith('weather_') and base.endswith('.json') and base != 'weather_location.json':
                return True
            return False

        manifest = {'mode': mode, 'included': 0, 'excluded': []}
        buf = io.BytesIO()
        with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as zf:
            # Include /root/data/ files
            for dirpath, dirnames, filenames in os.walk(DATA_ROOT):
                rel_dir = os.path.relpath(dirpath, DATA_ROOT)
                if rel_dir != '.' and rel_dir.startswith('.'):
                    continue
                for fname in filenames:
                    if fname.startswith('.') or fname.endswith('.tmp'):
                        continue
                    full_path = os.path.join(dirpath, fname)
                    arc_name = os.path.relpath(full_path, DATA_ROOT)
                    if mode == 'replicate' and _replicate_should_skip(arc_name):
                        manifest['excluded'].append(arc_name)
                        continue
                    try:
                        zf.write(full_path, arc_name)
                        manifest['included'] += 1
                    except (FileNotFoundError, OSError):
                        pass
            # Include /root/scripts/ files under 'scripts/' prefix
            if os.path.isdir(SCRIPTS_ROOT):
                for dirpath, dirnames, filenames in os.walk(SCRIPTS_ROOT):
                    rel_dir = os.path.relpath(dirpath, SCRIPTS_ROOT)
                    if rel_dir != '.' and rel_dir.startswith('.'):
                        continue
                    for fname in filenames:
                        if fname.startswith('.') or fname.endswith('.tmp'):
                            continue
                        full_path = os.path.join(dirpath, fname)
                        arc_name = 'scripts/' + os.path.relpath(full_path, SCRIPTS_ROOT)
                        if mode == 'replicate' and _replicate_should_skip(arc_name):
                            manifest['excluded'].append(arc_name)
                            continue
                        try:
                            zf.write(full_path, arc_name)
                            manifest['included'] += 1
                        except (FileNotFoundError, OSError):
                            pass
            # Embed a small manifest so the receiving controller knows what mode
            # this bundle was built in. Visible to the operator after upload.
            try:
                zf.writestr('REPLICATE_MANIFEST.json', json.dumps(manifest, indent=2))
            except Exception:
                pass
        buf.seek(0)
        encrypted = encrypt_bundle(buf.getvalue(), password)

        fname = 'red5_replicate.red5' if mode == 'replicate' else 'red5_bundle.red5'
        return Response(
            encrypted,
            mimetype='application/octet-stream',
            headers={'Content-Disposition': f'attachment; filename={fname}'}
        )
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# Bootstrap upload form + /update route are now provided by
# upload_service.register(app, ...).


# /band_guide.md route moved to band_service.py.

@app.route('/control_strategy_insight.md')
def serve_control_strategy_insight_md():
    """Serve the engineer-facing essay explaining why short-window optimal
    fixed-SA can appear lower than B1-B10 in the T×Time chart and why it
    doesn't generalize to operations."""
    resp = _no_cache(send_from_directory('/root/data', 'control_strategy_insight.md'))
    resp.headers['Content-Type'] = 'text/markdown; charset=utf-8'
    return resp


@app.route('/control_strategy_insight.ko.md')
def serve_control_strategy_insight_ko_md():
    """Korean (6th-grade level) version of the control-strategy insight.
    Useful for sharing with clinical staff and non-engineering stakeholders
    who want to understand why the fixed-SA Total occasionally dips below
    B1-B10 on short windows."""
    resp = _no_cache(send_from_directory('/root/data', 'control_strategy_insight.ko.md'))
    resp.headers['Content-Type'] = 'text/markdown; charset=utf-8'
    return resp


# --- TELEMETRY API ENDPOINTS ---

# Telemetry diagnostic + write routes moved to telemetry_service.py.


# Band CSV generator + band-csv routes moved to band_service.py
# (see band_service.register(app, ...) call below).

try:
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    local_ip = s.getsockname()[0]
    s.close()
    print(f"\n* Controller Online at: http://{local_ip}:{PORT}")
    print(f"* Update page at: http://{local_ip}:{PORT}/update")
except:
    print(f"\n* Controller Online at: http://127.0.0.1:{PORT}")

app.run(host=HOST, port=PORT, threaded=True, debug=False)
