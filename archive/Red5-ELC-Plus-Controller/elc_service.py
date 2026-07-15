"""
elc_service.py — Flask plug-in: start ELC FastAPI stack + proxy /api/elc/*.
==========================================================================
Bundle lands in /root/data/pgpy/.  app.py auto-discovers register(app, ctx).
"""
from __future__ import annotations

import logging
import os
import sys
import threading
import urllib.error
import urllib.request

from flask import Response, request, stream_with_context

_service_dependencies = ['DATA_ROOT', 'PLUGINS_ROOT', '_no_cache']

_DATA_ROOT = None
_PLUGINS_ROOT = None
_no_cache = None
_THREAD = None
_INTERNAL_PORT = 18990
_INTERNAL_BASE = f'http://127.0.0.1:{_INTERNAL_PORT}'

log = logging.getLogger('elc_service')


def _start_background(plugins_root: str, data_root: str) -> None:
    global _THREAD
    if _THREAD and _THREAD.is_alive():
        return

    os.environ['RED5_PLUGINS_ROOT'] = plugins_root
    os.environ['RED5_DATA_ROOT'] = data_root
    os.environ.setdefault('ELC_INTERNAL_PORT', str(_INTERNAL_PORT))
    os.environ.setdefault('ELC_DATA_SOURCE', 'physical')

    def _runner():
        if plugins_root not in sys.path:
            sys.path.insert(0, plugins_root)
        try:
            import elc_runtime
            elc_runtime.main()
        except Exception:
            log.exception('ELC runtime thread crashed')

    _THREAD = threading.Thread(target=_runner, name='elc-runtime', daemon=True)
    _THREAD.start()
    log.info('ELC runtime thread started (port %s)', _INTERNAL_PORT)


def _forward_headers():
    hop = {}
    for key in ('Content-Type', 'Accept', 'Authorization'):
        val = request.headers.get(key)
        if val:
            hop[key] = val
    return hop


def register(app, ctx):
    global _DATA_ROOT, _PLUGINS_ROOT, _no_cache
    _DATA_ROOT = ctx['DATA_ROOT']
    _PLUGINS_ROOT = ctx['PLUGINS_ROOT']
    _no_cache = ctx['_no_cache']

    try:
        os.makedirs(os.path.join(_DATA_ROOT, 'configs'), exist_ok=True)
        os.makedirs(os.path.join(_DATA_ROOT, 'graphics', 'floor_plans'), exist_ok=True)
    except OSError:
        pass

    _start_background(_PLUGINS_ROOT, _DATA_ROOT)

    @app.route('/api/elc/events-sse', methods=['GET'])
    def proxy_sse():
        url = f'{_INTERNAL_BASE}/api/elc/events-sse'
        if request.query_string:
            url += '?' + request.query_string.decode('utf-8')

        def generate():
            req = urllib.request.Request(url, headers=_forward_headers(), method='GET')
            try:
                with urllib.request.urlopen(req, timeout=300) as resp:
                    while True:
                        chunk = resp.read(4096)
                        if not chunk:
                            break
                        yield chunk
            except Exception as exc:
                yield f'data: {{"error":"{exc}"}}\n\n'.encode('utf-8')

        return Response(
            stream_with_context(generate()),
            mimetype='text/event-stream',
            headers={'Cache-Control': 'no-cache', 'X-Accel-Buffering': 'no'},
        )

    @app.route('/api/elc', defaults={'subpath': ''}, methods=[
        'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'])
    @app.route('/api/elc/<path:subpath>', methods=[
        'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'])
    def proxy_elc(subpath):
        if request.method == 'OPTIONS':
            return Response(status=204)
        path = '/api/elc/' + subpath if subpath else '/api/elc'
        url = _INTERNAL_BASE + path
        if request.query_string:
            url += '?' + request.query_string.decode('utf-8')
        body = request.get_data()
        req = urllib.request.Request(
            url,
            data=body if body else None,
            headers=_forward_headers(),
            method=request.method,
        )
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                data = resp.read()
                excluded = {'transfer-encoding', 'connection', 'content-encoding'}
                headers = [(k, v) for k, v in resp.headers.items()
                           if k.lower() not in excluded]
                return Response(data, status=resp.status, headers=headers)
        except urllib.error.HTTPError as e:
            payload = e.read()
            return Response(payload, status=e.code, mimetype=e.headers.get_content_type())
        except Exception as exc:
            return _no_cache(Response(
                f'{{"detail":"ELC backend unavailable: {exc}"}}',
                status=502,
                mimetype='application/json',
            ))

    @app.route('/api/elc-health', methods=['GET'])
    def elc_health():
        try:
            with urllib.request.urlopen(
                f'{_INTERNAL_BASE}/api/elc/link', timeout=2
            ) as resp:
                return Response(resp.read(), status=resp.status,
                                mimetype='application/json')
        except Exception as exc:
            return _no_cache(Response(
                f'{{"ok":false,"detail":"{exc}"}}',
                status=503,
                mimetype='application/json',
            ))
