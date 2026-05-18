"""
band_overrides_service.py
==========================
Operator-driven SA-RH clamp override.  Persists the dashboard
40-60% RH slider to /root/data/configs/band_overrides.json so the
band CSV generator and collector pick it up across restarts.

Routes:
  GET    /api/band-overrides/sa-rh-clamp        current clamp + history
  POST   /api/band-overrides/sa-rh-clamp        apply new clamp window
  DELETE /api/band-overrides/sa-rh-clamp        reset to factory bands
  GET    /api/band-overrides/preview            dry-run: show effect on each band

POST body:
  { "lo": 45, "hi": 55, "enabled": true, "applied_by": "operator" }

Idempotent: same lo/hi as current does not append a duplicate history row.
After every successful POST/DELETE the band CSV is regenerated so the
universal band_guide.csv reflects the new targets immediately (the
collector picks up the change on its next cycle via mtime watch).
"""
_service_dependencies = ['DATA_ROOT']

import os
import json
import time
from flask import jsonify, request

DATA_ROOT = None
HISTORY_MAX = 200


def _config_path():
    return os.path.join(DATA_ROOT, 'configs', 'band_overrides.json')


def _read():
    """Load band_overrides.json or return a default skeleton."""
    p = _config_path()
    if not os.path.exists(p):
        return {'sa_rh_clamp': None, 'history': []}
    try:
        with open(p, 'r') as f:
            data = json.load(f)
        if 'history' not in data:
            data['history'] = []
        return data
    except Exception:
        return {'sa_rh_clamp': None, 'history': []}


def _write(data):
    """Persist band_overrides.json atomically (write-temp + rename)."""
    p = _config_path()
    os.makedirs(os.path.dirname(p), exist_ok=True)
    tmp = p + '.tmp'
    with open(tmp, 'w') as f:
        json.dump(data, f, indent=2)
    os.replace(tmp, p)


def _regenerate_band_csv():
    """Trigger band_guide.csv regeneration so the new clamp is reflected
    immediately.  Best-effort: any failure is logged and ignored (the
    background generator will re-run within 5 minutes regardless).
    """
    try:
        import band_csv_generator
        cfg = os.path.join(DATA_ROOT, 'configs', 'collector_config.json')
        band_csv_generator.generate_all(cfg, os.path.join(DATA_ROOT, 'configs'))
    except Exception as e:
        print('* band_overrides: CSV regen warning: {}'.format(e))


def _preview_bands(lo, hi):
    """Return what each band looks like after clamping (for the dashboard
    confirm modal).  No persistence side-effect.
    """
    try:
        import band_csv_generator
    except Exception:
        return []
    bands = band_csv_generator.BANDS
    out = []
    for b in bands:
        clamped = band_csv_generator.apply_sa_rh_clamp(b, lo, hi)
        out.append({
            'id': b['id'],
            'name': b.get('name', ''),
            'before': {'sa_rh': b['sa_rh'], 'hum': b['hum']},
            'after':  {'sa_rh': clamped['sa_rh'], 'hum': clamped['hum']},
            'changed': clamped.get('_clamp') is not None,
            'direction': clamped.get('_clamp'),
        })
    return out


# ---- Handlers ----

def _get_clamp():
    data = _read()
    return jsonify({
        'status': 'ok',
        'sa_rh_clamp': data.get('sa_rh_clamp'),
        'history': data.get('history', [])[-20:],  # last 20 only
    })


def _post_clamp():
    body = request.get_json(silent=True) or {}
    lo = body.get('lo')
    hi = body.get('hi')
    enabled = bool(body.get('enabled', True))
    applied_by = str(body.get('applied_by') or 'unknown')[:64]

    # Validate
    if lo is None or hi is None:
        return jsonify({'status': 'error', 'message': 'lo and hi required'}), 400
    try:
        lo = int(lo); hi = int(hi)
    except (TypeError, ValueError):
        return jsonify({'status': 'error', 'message': 'lo and hi must be integers'}), 400
    if lo < 0 or hi > 100 or lo > hi:
        return jsonify({'status': 'error', 'message': 'invalid range (need 0 <= lo <= hi <= 100)'}), 400
    if (hi - lo) < 5:
        return jsonify({'status': 'error', 'message': 'window too narrow (min span 5% RH)'}), 400

    data = _read()
    prev = data.get('sa_rh_clamp')
    now = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())

    new_clamp = {
        'enabled': enabled,
        'lo': lo,
        'hi': hi,
        'applied_at': now,
        'applied_by': applied_by,
    }

    # Idempotent: same window + same enabled flag is a no-op
    if prev and prev.get('lo') == lo and prev.get('hi') == hi and prev.get('enabled') == enabled:
        return jsonify({'status': 'ok', 'sa_rh_clamp': prev, 'changed': False})

    history = data.get('history', [])
    history.append({
        'ts': now,
        'lo': lo,
        'hi': hi,
        'enabled': enabled,
        'prev_lo': (prev or {}).get('lo'),
        'prev_hi': (prev or {}).get('hi'),
        'prev_enabled': (prev or {}).get('enabled'),
        'applied_by': applied_by,
    })
    if len(history) > HISTORY_MAX:
        history = history[-HISTORY_MAX:]

    data['sa_rh_clamp'] = new_clamp
    data['history'] = history
    _write(data)
    _regenerate_band_csv()

    return jsonify({
        'status': 'ok',
        'sa_rh_clamp': new_clamp,
        'changed': True,
        'preview': _preview_bands(lo, hi),
    })


def _delete_clamp():
    data = _read()
    prev = data.get('sa_rh_clamp')
    if prev is None:
        return jsonify({'status': 'ok', 'sa_rh_clamp': None, 'changed': False})
    now = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    history = data.get('history', [])
    history.append({
        'ts': now,
        'lo': None,
        'hi': None,
        'enabled': False,
        'prev_lo': prev.get('lo'),
        'prev_hi': prev.get('hi'),
        'prev_enabled': prev.get('enabled'),
        'applied_by': 'reset',
    })
    if len(history) > HISTORY_MAX:
        history = history[-HISTORY_MAX:]
    data['sa_rh_clamp'] = None
    data['history'] = history
    _write(data)
    _regenerate_band_csv()
    return jsonify({'status': 'ok', 'sa_rh_clamp': None, 'changed': True})


def _preview_clamp():
    """Dry-run: show what each band looks like under a candidate clamp.
    Used by the dashboard confirm modal before the operator hits Apply.
    """
    lo = request.args.get('lo', type=int)
    hi = request.args.get('hi', type=int)
    if lo is None or hi is None:
        return jsonify({'status': 'error', 'message': 'lo and hi required'}), 400
    if lo < 0 or hi > 100 or lo > hi:
        return jsonify({'status': 'error', 'message': 'invalid range'}), 400
    return jsonify({'status': 'ok', 'preview': _preview_bands(lo, hi)})


def register(app, ctx):
    global DATA_ROOT
    DATA_ROOT = ctx['DATA_ROOT']

    app.add_url_rule('/api/band-overrides/sa-rh-clamp', 'band_overrides_get',
                     _get_clamp, methods=['GET'])
    app.add_url_rule('/api/band-overrides/sa-rh-clamp', 'band_overrides_post',
                     _post_clamp, methods=['POST'])
    app.add_url_rule('/api/band-overrides/sa-rh-clamp', 'band_overrides_delete',
                     _delete_clamp, methods=['DELETE'])
    app.add_url_rule('/api/band-overrides/preview', 'band_overrides_preview',
                     _preview_clamp, methods=['GET'])
