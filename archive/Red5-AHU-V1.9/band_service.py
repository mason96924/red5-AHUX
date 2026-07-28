"""
band_service.py
===============
Band CSV generator background task + band-csv download routes + the
public-facing /band_guide.md doc route.

Extracted from app.py on 2026-05-06.  Same plug-in pattern as
upload_service.py + weather_service.py:
    band_service.register(app, ctx)

Endpoints registered:
  GET  /band_guide.md
  POST /api/band-csv/regenerate
  GET  /api/band-csv/guide
  GET  /api/band-csv/<ahu_id>
"""
# Required SERVICE_CTX keys -- validated by app.py auto-discovery.
_service_dependencies = ['DATA_ROOT', '_no_cache']
import os
from flask import jsonify, send_from_directory


DATA_ROOT = None
_no_cache = None


def serve_band_guide_md():
    """Serve the human-readable Band Control Strategy guide.

    Linked from update.html so anyone deploying the controller can fetch
    the doc alongside the bundle.  Served as text/markdown — browsers
    display the raw content; markdown viewers render it nicely.
    """
    resp = _no_cache(send_from_directory(DATA_ROOT, 'band_guide.md'))
    resp.headers['Content-Type'] = 'text/markdown; charset=utf-8'
    return resp



def _start_background_band_generator():
    """Initial generation + 5-minute background refresh of band_guide.csv
    and per-AHU VAV projection CSVs.  Skipped if collector_config.json is
    missing or band_csv_generator.py is not deployed.

    Outputs are written into /root/data/configs/ (alongside the other
    persisted configuration files) rather than /root/data/ root."""
    # --- Band CSV Generator Background Task ---
    try:
        import band_csv_generator
        CONFIG_PATH = os.path.join(DATA_ROOT, 'collector_config.json')
        # Drop generated CSVs under configs/ so the root stays clean.
        OUTPUT_DIR = os.path.join(DATA_ROOT, 'configs')
        try:
            os.makedirs(OUTPUT_DIR, exist_ok=True)
        except OSError:
            pass
        if os.path.exists(CONFIG_PATH):
            band_csv_generator.generate_all(CONFIG_PATH, OUTPUT_DIR)
            band_csv_generator.start_background(CONFIG_PATH, OUTPUT_DIR, interval=300)
            print("* Band CSV guide generator started (background, 5-min interval)")
        else:
            print("* Band CSV: collector_config.json not found, skipping")
    except ImportError:
        print("* Band CSV: band_csv_generator.py not found, skipping")
    except Exception as e:
        print(f"* Band CSV: Error — {e}")




def regenerate_band_csv():
    """Manually trigger CSV regeneration into /root/data/configs/."""
    try:
        import band_csv_generator
        cfg = os.path.join(DATA_ROOT, 'collector_config.json')
        OUTPUT_DIR = os.path.join(DATA_ROOT, 'configs')
        try:
            os.makedirs(OUTPUT_DIR, exist_ok=True)
        except OSError:
            pass
        files = band_csv_generator.generate_all(cfg, OUTPUT_DIR)
        return jsonify({'status': 'ok', 'files': [os.path.basename(f) for f in files]})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


def _resolve_csv(filename):
    """Return (directory, filename) tuple for a generated CSV.  Prefer
    /root/data/configs/<file> (new location) and fall back to
    /root/data/<file> (legacy location) so an upgrade is transparent
    even before the 5-min regen runs."""
    configs_dir = os.path.join(DATA_ROOT, 'configs')
    if os.path.exists(os.path.join(configs_dir, filename)):
        return configs_dir, filename
    return DATA_ROOT, filename


def get_band_guide():
    """Download the universal band_guide.csv."""
    directory, filename = _resolve_csv('band_guide.csv')
    if not os.path.exists(os.path.join(directory, filename)):
        return jsonify({'error': 'band_guide.csv not found — trigger /api/band-csv/regenerate first'}), 404
    return send_from_directory(directory, filename, mimetype='text/csv')


def get_band_csv(ahu_id):
    """Download a per-AHU VAV projection CSV."""
    filename = ahu_id + '_vav_proj.csv'
    directory, filename = _resolve_csv(filename)
    if not os.path.exists(os.path.join(directory, filename)):
        return jsonify({'error': filename + ' not found'}), 404
    return send_from_directory(directory, filename, mimetype='text/csv')



def register(app, ctx):
    """Attach band routes to ``app`` and stash shared paths.

    ``ctx`` keys:
        DATA_ROOT (required)
        _no_cache (required) -- callable from app.py used for cache-busting
                                response headers

    Optional flags:
        start_band_thread (default True) -- set False in tests to skip the
            initial generation + background interval thread.
    """
    global DATA_ROOT, _no_cache
    DATA_ROOT = ctx['DATA_ROOT']
    _no_cache = ctx['_no_cache']

    app.add_url_rule('/band_guide.md',           'serve_band_guide_md',
                     serve_band_guide_md, methods=['GET'])
    app.add_url_rule('/api/band-csv/regenerate', 'regenerate_band_csv',
                     regenerate_band_csv, methods=['POST'])
    app.add_url_rule('/api/band-csv/guide',      'get_band_guide',
                     get_band_guide, methods=['GET'])
    app.add_url_rule('/api/band-csv/<ahu_id>',   'get_band_csv',
                     get_band_csv, methods=['GET'])
    # /api/band-guide -- JSON view of band_guide.csv (V2.0 parity).
    # The /api/band-csv/guide route above serves the raw CSV; this one
    # returns rows parsed + numeric columns coerced to float so the
    # dashboard frontend doesn't have to parseFloat() every cell.
    app.add_url_rule('/api/band-guide',          'get_band_guide_json',
                     get_band_guide_json, methods=['GET'])

    if ctx.get('start_band_thread', True):
        _start_background_band_generator()

# ---------------------------------------------------------------------------
# /api/band-guide   (GET)  -- V2.0 parity (backend/routes/bands.py:247).
# Returns the 10-band SA strategy matrix as a JSON array with NUMERIC
# columns coerced to float.  Powers the per-AHU detail page's band table.
# Frontend highlights the row matching the AHU's current OA conditions.
# ---------------------------------------------------------------------------
_BAND_GUIDE_NUMERIC = {
    'OA_T_Lo', 'OA_T_Hi', 'OA_RH_Lo', 'OA_RH_Hi',
    'SA_T_CC_SP', 'SA_T_Delivery', 'SA_W_SP_gkg',
    'SA_RH_Delivery', 'OA_Damper_SP', 'Energy_Rank',
}


def get_band_guide_json():
    """Return band_guide.csv as JSON rows with numeric columns float-coerced."""
    import csv as _csv
    directory, filename = _resolve_csv('band_guide.csv')
    csv_path = os.path.join(directory, filename)
    if not os.path.exists(csv_path):
        return jsonify({'error': 'band_guide.csv not found -- trigger /api/band-csv/regenerate first',
                        'bands': [], 'count': 0}), 404
    out = []
    with open(csv_path, 'r', encoding='utf-8', newline='') as fh:
        for row in _csv.DictReader(fh):
            clean = {}
            for k, v in row.items():
                if k in _BAND_GUIDE_NUMERIC:
                    try:
                        clean[k] = float(v)
                    except (TypeError, ValueError):
                        clean[k] = v
                else:
                    clean[k] = v
            out.append(clean)
    resp = jsonify({'bands': out, 'count': len(out)})
    if _no_cache:
        _no_cache(resp)
    return resp
