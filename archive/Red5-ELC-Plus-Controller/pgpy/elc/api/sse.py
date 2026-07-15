"""elc/api/sse.py — Server-Sent Events fallback for the live event stream.

Why this exists:
    Some HTTP intermediaries (notably Kubernetes ingress in shared preview
    environments) strip the `Upgrade: websocket` header before the request
    reaches uvicorn.  In that case the WS endpoint at /api/elc/events
    returns 404 from FastAPI's perspective even though the route exists.

    SSE rides on plain HTTP/1.1 streaming so it traverses any reasonable
    proxy without special configuration.  It is one-directional (server →
    client), which matches the WS handler's actual semantics: the WS
    handler explicitly does not process any client → server messages.

Mounted at:  GET /api/elc/events-sse
Content:     text/event-stream
Frame:       data: <json-event>\n\n
Heartbeat:   :hb\n\n every HEARTBEAT_SECS seconds (keeps idle proxies
             from closing the connection)
"""
from __future__ import annotations

import asyncio
import contextlib
import json
import logging
from typing import Any, AsyncIterator

from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse

from elc.domain.replica import Replica

log = logging.getLogger(__name__)

PER_CLIENT_QUEUE_MAX = 256
HEARTBEAT_SECS = 15.0


def attach_sse(app: FastAPI, replica: Replica, *, path: str = "/api/elc/events-sse") -> None:
    """Mount the SSE endpoint on `app`, subscribing to `replica`."""

    @app.get(path)
    async def events_sse(request: Request) -> StreamingResponse:
        queue: asyncio.Queue[dict[str, Any]] = asyncio.Queue(maxsize=PER_CLIENT_QUEUE_MAX)

        def push(event: dict[str, Any]) -> None:
            try:
                queue.put_nowait(event)
            except asyncio.QueueFull:
                with contextlib.suppress(asyncio.QueueEmpty):
                    queue.get_nowait()
                queue.put_nowait(event)
                log.warning("sse backpressure: dropped oldest event")

        replica.events.subscribe(push)

        async def stream() -> AsyncIterator[bytes]:
            try:
                # Send a hello so EventSource fires onopen on the client.
                yield b": connected\n\n"
                while True:
                    if await request.is_disconnected():
                        return
                    try:
                        event = await asyncio.wait_for(queue.get(), timeout=HEARTBEAT_SECS)
                    except asyncio.TimeoutError:
                        # Twin heartbeat: emit BOTH a raw SSE comment
                        # (keeps proxies happy on wire level) AND a
                        # proper `data:` event so the browser's
                        # onmessage handler runs and can update its
                        # last-seen-event timestamp.  Distinguishing
                        # "live but idle" from "silently dead" was
                        # impossible when the heartbeat was comment-
                        # only (EventSource swallows comments).
                        yield b": hb\n\n"
                        yield (
                            f"data: {json.dumps({'type': 'heartbeat'})}\n\n"
                            .encode("utf-8")
                        )
                        continue
                    yield f"data: {json.dumps(event)}\n\n".encode("utf-8")
            finally:
                replica.events.unsubscribe(push)

        return StreamingResponse(
            stream(),
            media_type="text/event-stream",
            headers={
                # Disable buffering at intermediate proxies so events flush.
                "Cache-Control": "no-cache, no-transform",
                "X-Accel-Buffering": "no",
                "Connection": "keep-alive",
            },
        )
