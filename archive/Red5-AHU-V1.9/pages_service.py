"""
pages_service.py — short HTML URLs + root → Access Control (V2.0 parity).
========================================================================
Drop-in plug-in.  Place in /root/data/pgpy/; app.py auto-discovers it via
register(app, ctx).  NO app.py paste required on deploy.

Routes:
  GET  /              → access.html (before_request intercept; overrides app.py
                        serve_landing when this plug-in is loaded)
  GET  /access.html
  GET  /setup.html
  GET  /learn.html    → Comfort Decoded (Deep Dive crumb; app.py is not
                        auto-deployed so this must live in the plug-in)
  GET  /mobile             → mobile_mockup.html (canonical share/QR target)
  GET  /mobile_mockup.html → same file
  GET  /api/health    → {"ok": true, ...}  liveness probe (V2.0 parity)
  POST /api/config/unlock   → {"ok": true|false}  (server-side master key)
"""
from __future__ import annotations

import hmac as hmac_mod
import os

from flask import jsonify, request, Response, send_from_directory

_service_dependencies = ['DATA_ROOT', 'MASTER_KEY_CONST', '_no_cache']

_DATA_ROOT = None
_MASTER_KEY = None
_no_cache = None

_BOOTSTRAP_HTML = (
    '<!doctype html><meta http-equiv="refresh" content="0; url=/update">'
    '<p>Controller not yet provisioned. Redirecting to '
    '<a href="/update">/update</a>...</p>'
)


def register(app, ctx):
    global _DATA_ROOT, _MASTER_KEY, _no_cache
    _DATA_ROOT = ctx['DATA_ROOT']
    _MASTER_KEY = ctx['MASTER_KEY_CONST']
    _no_cache = ctx['_no_cache']

    @app.before_request
    def _root_is_access():
        if request.path != '/' or request.method != 'GET':
            return None
        access = os.path.join(_DATA_ROOT, 'access.html')
        if not os.path.isfile(access):
            return Response(_BOOTSTRAP_HTML, status=200, mimetype='text/html')
        return _no_cache(send_from_directory(_DATA_ROOT, 'access.html'))

    @app.route('/access.html')
    def serve_access_html():
        return _no_cache(send_from_directory(_DATA_ROOT, 'access.html'))

    @app.route('/setup.html')
    def serve_setup_html():
        return _no_cache(send_from_directory(_DATA_ROOT, 'setup.html'))

    @app.route('/learn.html')
    def serve_learn_html():
        """Comfort Decoded — Deep Dive 'Back to interactive chart'. Bootloader
        app.py is not auto-deployed, so this URL must be registered here."""
        return _no_cache(send_from_directory(_DATA_ROOT, 'learn.html'))

    # Older app.py bootloaders already define these two.  Registering a
    # duplicate raises inside register(), which the discovery loop would
    # record as FAILED for the WHOLE module -- taking /, /access.html and
    # /learn.html down with it.  Register only what's actually missing.
    _rules = {r.rule for r in app.url_map.iter_rules()}

    if '/mobile' not in _rules:
        @app.route('/mobile')
        @app.route('/mobile_mockup.html')
        def serve_mobile_mockup():
            """Mobile phone view. Reads live data from /api/data and renders
            the same controller in a phone-first layout.  Both URLs serve the
            same file; /mobile is the canonical share/QR target."""
            return _no_cache(send_from_directory(_DATA_ROOT, 'mobile_mockup.html'))

    if '/api/health' not in _rules:
        @app.route('/api/health')
        def health_probe():
            """Liveness probe (V2.0 parity, backend/routes/health.py:92)."""
            return jsonify({'ok': True, 'version': '1.9.0', 'mode': 'legacy'})

    @app.route('/api/config/unlock', methods=['POST'])
    def config_unlock():
        body = request.get_json(silent=True) or {}
        supplied = body.get('password') or ''
        master = _MASTER_KEY or ''
        ok = bool(master) and hmac_mod.compare_digest(supplied, master)
        return jsonify({'ok': ok})
