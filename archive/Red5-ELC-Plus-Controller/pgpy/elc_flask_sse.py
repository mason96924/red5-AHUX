"""
elc_flask_sse.py — Flask-native Server-Sent Events for Phase 3.

Mirrors pgpy/elc/api/sse.py without asyncio: streams replica events to
floor.html / editor.html EventSource clients.
"""
from __future__ import annotations

import json
import logging
import queue
import threading

from flask import Response, stream_with_context

log = logging.getLogger('elc_flask_sse')

PER_CLIENT_QUEUE_MAX = 256
HEARTBEAT_SECS = 15.0

_subscribers: list[queue.Queue] = []
_subscribers_lock = threading.Lock()


def publish(event: dict) -> None:
    """Fan-out one JSON event to every connected SSE client."""
    with _subscribers_lock:
        dead: list[queue.Queue] = []
        for client_q in _subscribers:
            try:
                client_q.put_nowait(event)
            except queue.Full:
                try:
                    client_q.get_nowait()
                except queue.Empty:
                    pass
                try:
                    client_q.put_nowait(event)
                except queue.Full:
                    dead.append(client_q)
                    log.warning('sse backpressure: dropped client queue')
        for client_q in dead:
            _subscribers.remove(client_q)


def register(app) -> None:
    """Mount GET /api/elc/events-sse on the Flask app."""

    def events_sse():
        client_q: queue.Queue = queue.Queue(maxsize=PER_CLIENT_QUEUE_MAX)
        with _subscribers_lock:
            _subscribers.append(client_q)

        def generate():
            yield b': connected\n\n'
            try:
                while True:
                    try:
                        event = client_q.get(timeout=HEARTBEAT_SECS)
                    except queue.Empty:
                        yield b': hb\n\n'
                        yield (
                            f"data: {json.dumps({'type': 'heartbeat'})}\n\n"
                        ).encode('utf-8')
                        continue
                    yield f'data: {json.dumps(event)}\n\n'.encode('utf-8')
            finally:
                with _subscribers_lock:
                    if client_q in _subscribers:
                        _subscribers.remove(client_q)

        return Response(
            stream_with_context(generate()),
            mimetype='text/event-stream',
            headers={
                'Cache-Control': 'no-cache, no-transform',
                'X-Accel-Buffering': 'no',
                'Connection': 'keep-alive',
            },
        )

    app.add_url_rule('/api/elc/events-sse', 'elc_events_sse',
                     events_sse, methods=['GET'])
    log.info('Phase 3 SSE registered at /api/elc/events-sse')
