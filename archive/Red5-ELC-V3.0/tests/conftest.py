"""Shared pytest fixtures (MockScu, MockScuServer, registries)."""

from __future__ import annotations

import asyncio
import contextlib
import inspect
from collections.abc import AsyncIterator, Awaitable, Callable, Iterator

import pytest

from elc.codec import Frame
from elc.codec import decode as codec_decode
from elc.codec import encode as codec_encode
from elc.codec.registry import FlagRegistry
from elc.codec.registry import default_registry as _default_registry

# ---------------------------------------------------------------------
# MockScu — in-memory SCU fake (no sockets).  Used by codec tests.
# ---------------------------------------------------------------------


class MockScu:
    """Round-trips frames in memory without sockets.

    Each frame written to `send_bytes()` is parsed using the streaming
    codec and appended to `received_frames`.  Tests can "respond" by
    calling `enqueue_response(...)`.
    """

    def __init__(self) -> None:
        self._inbound_buf: bytearray = bytearray()
        self.received_frames: list[Frame] = []
        self.outbound: bytearray = bytearray()

    def send_bytes(self, data: bytes) -> None:
        self._inbound_buf.extend(data)
        self.received_frames.extend(codec_decode(self._inbound_buf))

    def send_frame(self, frame: Frame) -> None:
        self.send_bytes(codec_encode(frame))

    def enqueue_response(self, frame_or_bytes: Frame | bytes) -> None:
        if isinstance(frame_or_bytes, Frame):
            self.outbound.extend(codec_encode(frame_or_bytes))
        else:
            self.outbound.extend(frame_or_bytes)

    def drain_outbound(self) -> bytes:
        data = bytes(self.outbound)
        self.outbound.clear()
        return data


@pytest.fixture
def mock_scu() -> Iterator[MockScu]:
    yield MockScu()


@pytest.fixture
def registry() -> FlagRegistry:
    """The default flag registry, pre-populated with ALL_MESSAGES."""
    return _default_registry


# ---------------------------------------------------------------------
# MockScuServer — asyncio TCP server speaking ELC.  Used by transport
# and (later) driver integration tests.
# ---------------------------------------------------------------------

# Handler signature: (frame, writer) -> Awaitable | None
ServerFrameHandler = Callable[
    [Frame, asyncio.StreamWriter], Awaitable[None] | None
]


class MockScuServer:
    """Minimal asyncio TCP server that decodes ELC frames.

    Listens on `127.0.0.1` on an ephemeral port (read `port` after
    `start()`).  Frames arriving from any client are appended to
    `received_frames` and dispatched to every registered handler.

    A handler may call `writer.write(encode(reply))` + `await
    writer.drain()` to push a reply on the same socket.
    """

    def __init__(self, host: str = "127.0.0.1") -> None:
        self.host = host
        self.port: int = 0
        self.received_frames: list[Frame] = []

        self._server: asyncio.base_events.Server | None = None
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
        """Force-disconnect every currently attached client."""
        for w in list(self._writers):
            with contextlib.suppress(Exception):
                w.close()
        for w in list(self._writers):
            with contextlib.suppress(Exception):
                await w.wait_closed()
        self._writers.clear()

    def on_frame(self, handler: ServerFrameHandler) -> None:
        self._handlers.append(handler)

    async def _handle_client(
        self, reader: asyncio.StreamReader, writer: asyncio.StreamWriter
    ) -> None:
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


@pytest.fixture
async def mock_scu_server() -> AsyncIterator[MockScuServer]:
    srv = MockScuServer()
    await srv.start()
    try:
        yield srv
    finally:
        await srv.stop()
