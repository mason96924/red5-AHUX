"""
pages_service.py — ELC HTML entry points.
=========================================
Serves floor/editor/settings pages from DATA_ROOT.  Drop into pgpy/ via
bundle upload; app.py auto-discovers register(app, ctx).
"""
from __future__ import annotations

import os

from flask import Response, send_from_directory

_service_dependencies = ['DATA_ROOT', '_no_cache']

_DATA_ROOT = None
_no_cache = None

_PAGES = {
    '/': 'index.html',
    '/index.html': 'index.html',
    '/floor': 'floor.html',
    '/floor.html': 'floor.html',
    '/editor': 'editor.html',
    '/editor.html': 'editor.html',
    '/settings': 'settings.html',
    '/settings.html': 'settings.html',
    '/stress': 'stress.html',
    '/stress.html': 'stress.html',
}

_BOOTSTRAP_HTML = (
    '<!doctype html><meta http-equiv="refresh" content="0; url=/update">'
    '<p>ELC controller not yet provisioned. Redirecting to '
    '<a href="/update">/update</a>...</p>'
)


def register(app, ctx):
    global _DATA_ROOT, _no_cache
    _DATA_ROOT = ctx['DATA_ROOT']
    _no_cache = ctx['_no_cache']

    @app.before_request
    def _root_redirect():
        from flask import request
        if request.path != '/' or request.method != 'GET':
            return None
        index = os.path.join(_DATA_ROOT, 'index.html')
        if not os.path.isfile(index):
            return Response(_BOOTSTRAP_HTML, status=200, mimetype='text/html')
        return _no_cache(send_from_directory(_DATA_ROOT, 'index.html'))

    for route, filename in _PAGES.items():
        if route == '/':
            continue

        def _make(filename=filename):
            def _serve():
                path = os.path.join(_DATA_ROOT, filename)
                if not os.path.isfile(path):
                    return Response(
                        f'<h1>Missing {filename}</h1><p>Deploy via /update bundle.</p>',
                        status=404,
                        mimetype='text/html',
                    )
                return _no_cache(send_from_directory(_DATA_ROOT, filename))
            return _serve

        app.add_url_rule(route, endpoint=f'elc_page_{filename}', view_func=_make())
