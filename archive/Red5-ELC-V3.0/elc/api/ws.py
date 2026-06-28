"""L5 — WebSocket fan-out for `/ws/elc/events`.

Each connected client gets a bounded per-socket `asyncio.Queue` fed
from the Replica's event bus.  On overflow we drop the *oldest*
event with a warning — matches the protocol rule from
architecture §3.

To detect client-side disconnects promptly (so we unsubscribe from
the EventBus and don't leak handlers), we run a parallel `receive`
loop alongside the `send` loop and shut both down when either ends.
"""

from __future__ import annotations

import asyncio
import contextlib
import logging
from typing import Any

from fastapi import FastAPI, WebSocket, WebSocketDisconnect

from elc.domain.replica import Replica

log = logging.getLogger(__name__)

PER_CLIENT_QUEUE_MAX = 256


def attach_ws(app: FastAPI, replica: Replica, *, path: str = "/ws/elc/events") -> None:
    """Mount the WebSocket endpoint on `app`, subscribing to `replica`."""

    @app.websocket(path)
    async def events_ws(ws: WebSocket) -> None:
        await ws.accept()
        queue: asyncio.Queue[dict[str, Any]] = asyncio.Queue(maxsize=PER_CLIENT_QUEUE_MAX)

        def push(event: dict[str, Any]) -> None:
            try:
                queue.put_nowait(event)
            except asyncio.QueueFull:
                with contextlib.suppress(asyncio.QueueEmpty):
                    queue.get_nowait()
                queue.put_nowait(event)
                log.warning("ws backpressure: dropped oldest event")

        replica.events.subscribe(push)

        async def send_loop() -> None:
            while True:
                event = await queue.get()
                await ws.send_json(event)

        async def recv_loop() -> None:
            # We don't process any client → server messages, but we MUST
            # await receive so the handler observes the disconnect.
            while True:
                await ws.receive()

        sender = asyncio.create_task(send_loop(), name="ws-send")
        receiver = asyncio.create_task(recv_loop(), name="ws-recv")
        try:
            await asyncio.wait(
                {sender, receiver}, return_when=asyncio.FIRST_COMPLETED
            )
        except WebSocketDisconnect:
            pass
        finally:
            for t in (sender, receiver):
                t.cancel()
            for t in (sender, receiver):
                with contextlib.suppress(asyncio.CancelledError, WebSocketDisconnect, Exception):
                    await t
            replica.events.unsubscribe(push)
