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

    @app.route('/api/config/unlock', methods=['POST'])
    def config_unlock():
        body = request.get_json(silent=True) or {}
        supplied = body.get('password') or ''
        master = _MASTER_KEY or ''
        ok = bool(master) and hmac_mod.compare_digest(supplied, master)
        return jsonify({'ok': ok})
