"""Minimal MockScuServer for controller mock mode (no tests/ dependency)."""
from __future__ import annotations

import asyncio
import contextlib
import inspect
from collections.abc import Awaitable, Callable

from elc.codec import Frame
from elc.codec import decode as codec_decode

ServerFrameHandler = Callable[
    [Frame, asyncio.StreamWriter], Awaitable[None] | None
]


class MockScuServer:
    def __init__(self, host: str = '127.0.0.1') -> None:
        self.host = host
        self.port: int = 0
        self.received_frames: list[Frame] = []
        self._server = None
        self._handlers: list[ServerFrameHandler] = []
        self._writers: set[asyncio.StreamWriter] = set()

    async def start(self) -> None:
        self._server = await asyncio.start_server(self._handle_client, self.host, 0)
        sock = self._server.sockets[0]
        self.port = sock.getsockname()[1]

    async def stop(self) -> None:
        await self.disconnect_all()
        if self._server is not None:
            self._server.close()
            await self._server.wait_closed()
            self._server = None

    async def disconnect_all(self) -> None:
        for w in list(self._writers):
            with contextlib.suppress(Exception):
                w.close()
        for w in list(self._writers):
            with contextlib.suppress(Exception):
                await w.wait_closed()
        self._writers.clear()

    def on_frame(self, handler: ServerFrameHandler) -> None:
        self._handlers.append(handler)

    async def _handle_client(self, reader, writer) -> None:
        self._writers.add(writer)
        buf = bytearray()
        try:
            while True:
                data = await reader.read(4096)
                if not data:
                    return
                buf.extend(data)
                for frame in codec_decode(buf):
                    self.received_frames.append(frame)
                    for h in self._handlers:
                        result = h(frame, writer)
                        if inspect.isawaitable(result):
                            await result
        except (ConnectionResetError, BrokenPipeError, asyncio.CancelledError):
            return
        finally:
            self._writers.discard(writer)
            with contextlib.suppress(Exception):
                writer.close()
