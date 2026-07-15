"""L1 — Transport supervisor for a single SCU TCP link.

`ScuLink` owns one (host, port) pair: a supervisor task drives the
connect / read / write loops, reconnects with exponential back-off on
any error, and surfaces inbound frames to subscribers registered via
`feed()`.  Outbound frames are placed on a bounded `asyncio.Queue` so
producers never block waiting on the socket.

Concurrency model (one event loop, no threads):

    supervisor_task
        ├── (connect) ──► reader_task   ── decode() ──► dispatch frames
        └────────────► writer_task   ◄── outbound queue

On reader / writer error the supervisor cancels its peer task, sets
state DOWN, sleeps `backoff`, and loops.  Back-off resets to
`initial_backoff` after every successful connect.
"""

from __future__ import annotations

import asyncio
import contextlib
import inspect
import logging
from collections.abc import Awaitable, Callable
from enum import Enum

from elc.codec.frame import Frame, decode, encode

log = logging.getLogger(__name__)

FrameHandler = Callable[[Frame], Awaitable[None] | None]


class LinkState(str, Enum):
    DOWN = "down"
    CONNECTING = "connecting"
    CONNECTED = "connected"
    CLOSED = "closed"   # terminal — `stop()` was called


class ScuLink:
    """Supervised asyncio TCP client for one SCU."""

    def __init__(
        self,
        host: str,
        port: int,
        *,
        name: str | None = None,
        initial_backoff: float = 0.5,
        max_backoff: float = 30.0,
        backoff_factor: float = 2.0,
        connect_timeout: float = 5.0,
        outbound_maxsize: int = 256,
        wire_version: str = "legacy",
    ) -> None:
        if port <= 0 or port > 0xFFFF:
            raise ValueError(f"port {port} out of range 1..65535")
        if initial_backoff <= 0 or max_backoff < initial_backoff:
            raise ValueError("invalid back-off settings")
        if wire_version not in ("legacy", "v38"):
            raise ValueError(
                f"wire_version {wire_version!r} must be 'legacy' or 'v38'"
            )

        self.host = host
        self.port = port
        self.name = name or f"{host}:{port}"
        # ``legacy``: our internal frame.py preamble/type/length/CRC
        # framing (MockScu speaks this; every existing test relies on it).
        # ``v38``: ETLC V3.8 wire protocol -- Flag(4)+DeviceID(4)+payload+
        # checksum, used only when talking to real hardware.  In v38 mode
        # the reader loop invokes ``raw_handlers`` with each chunk from
        # the socket; the SrmDriver parses V3.8 frames from that stream.
        self.wire_version = wire_version

        self._initial_backoff = initial_backoff
        self._max_backoff = max_backoff
        self._backoff_factor = backoff_factor
        self._connect_timeout = connect_timeout

        self._state: LinkState = LinkState.DOWN
        self._connected_event = asyncio.Event()
        self._handlers: list[FrameHandler] = []
        # Raw-bytes handlers: only invoked when wire_version=='v38'.
        # The V3.8 driver installs its own 11-byte fixed-frame parser.
        self._raw_handlers: list = []
        self._outbound: asyncio.Queue[bytes] = asyncio.Queue(maxsize=outbound_maxsize)
        self._supervisor_task: asyncio.Task | None = None
        self._stop_requested = False
        # Connect-attempt counter; exposed for observability/tests.
        self.connect_attempts: int = 0

    # ---- public surface --------------------------------------------------

    @property
    def state(self) -> LinkState:
        return self._state

    def feed(self, handler: FrameHandler) -> None:
        """Subscribe to inbound frames.  Handler may be sync or async."""
        self._handlers.append(handler)

    def feed_raw(self, handler: Callable[[bytes], Awaitable[None] | None]) -> None:
        """Subscribe to raw byte chunks (used by the V3.8 driver).

        Handler receives every chunk read from the socket, unmodified.
        Kept separate from ``feed()`` so v38 handlers don't have to
        pretend to be legacy Frame handlers.
        """
        self._raw_handlers.append(handler)

    async def start(self) -> None:
        """Start the supervisor task (idempotent)."""
        if self._supervisor_task is not None and not self._supervisor_task.done():
            return
        self._stop_requested = False
        self._supervisor_task = asyncio.create_task(
            self._supervisor_loop(), name=f"scu-link[{self.name}]"
        )

    async def stop(self) -> None:
        """Request shutdown and wait for the supervisor task to exit."""
        self._stop_requested = True
        task = self._supervisor_task
        if task is not None and not task.done():
            task.cancel()
            with contextlib.suppress(asyncio.CancelledError):
                await task
        self._supervisor_task = None
        self._set_state(LinkState.CLOSED)

    async def send(self, frame: Frame) -> None:
        """Enqueue a frame for transmission.

        Blocks only when the outbound queue is full (back-pressure) — never
        on the socket directly.
        """
        await self._outbound.put(encode(frame))

    async def send_bytes(self, data: bytes) -> None:
        """Enqueue pre-encoded raw bytes (V3.8 escape hatch).

        Used by the V3.8 SrmDriver: it builds ETLC frames directly and
        needs to bypass the legacy ``Frame`` wrapper.  Legacy callers
        should keep using ``send()``.
        """
        await self._outbound.put(bytes(data))

    async def wait_connected(self, timeout: float | None = None) -> None:
        """Wait until the link reaches `CONNECTED`.  Raises on timeout."""
        await asyncio.wait_for(self._connected_event.wait(), timeout=timeout)

    # ---- internals -------------------------------------------------------

    def _set_state(self, new: LinkState) -> None:
        if self._state == new:
            return
        log.debug("ScuLink[%s] %s → %s", self.name, self._state.value, new.value)
        self._state = new
        if new is LinkState.CONNECTED:
            self._connected_event.set()
        else:
            self._connected_event.clear()

    async def _supervisor_loop(self) -> None:
        backoff = self._initial_backoff
        try:
            while not self._stop_requested:
                self._set_state(LinkState.CONNECTING)
                self.connect_attempts += 1
                try:
                    reader, writer = await asyncio.wait_for(
                        asyncio.open_connection(self.host, self.port),
                        timeout=self._connect_timeout,
                    )
                except (OSError, asyncio.TimeoutError) as e:
                    log.warning(
                        "ScuLink[%s] connect failed (%s); retry in %.2fs",
                        self.name, e, backoff,
                    )
                    self._set_state(LinkState.DOWN)
                    await asyncio.sleep(backoff)
                    backoff = min(backoff * self._backoff_factor, self._max_backoff)
                    continue

                # Connected: reset back-off and run session.
                backoff = self._initial_backoff
                self._set_state(LinkState.CONNECTED)
                try:
                    await self._serve(reader, writer)
                except Exception as e:  # noqa: BLE001
                    log.warning("ScuLink[%s] session ended: %s", self.name, e)
                finally:
                    writer.close()
                    with contextlib.suppress(Exception):
                        await writer.wait_closed()
                    self._set_state(LinkState.DOWN)

                if self._stop_requested:
                    break
                # Brief pause before reconnect attempt to avoid hot-spinning
                # on an immediately-failing socket.
                await asyncio.sleep(self._initial_backoff)
        except asyncio.CancelledError:
            raise
        finally:
            # Loop exited without an explicit stop (shouldn't normally
            # happen) — leave state as DOWN so the next `start()` works.
            if not self._stop_requested and self._state is not LinkState.CLOSED:
                self._set_state(LinkState.DOWN)

    async def _serve(self, reader: asyncio.StreamReader, writer: asyncio.StreamWriter) -> None:
        reader_task = asyncio.create_task(self._reader_loop(reader), name="scu-reader")
        writer_task = asyncio.create_task(self._writer_loop(writer), name="scu-writer")
        try:
            done, pending = await asyncio.wait(
                {reader_task, writer_task},
                return_when=asyncio.FIRST_COMPLETED,
            )
        except asyncio.CancelledError:
            done, pending = set(), {reader_task, writer_task}
            raise
        finally:
            for t in pending:
                t.cancel()
            for t in pending:
                with contextlib.suppress(asyncio.CancelledError, Exception):
                    await t
            # Surface any non-cancelled exception so the supervisor can log.
            for t in done:
                exc = t.exception()
                if exc is not None and not isinstance(exc, asyncio.CancelledError):
                    raise exc

    async def _reader_loop(self, reader: asyncio.StreamReader) -> None:
        buf = bytearray()
        while True:
            chunk = await reader.read(4096)
            if not chunk:
                return  # peer closed
            if self.wire_version == "v38":
                # V3.8 mode: skip legacy decoding and forward the raw
                # bytes to every registered raw handler.  Each handler
                # keeps its own parse buffer.
                for h in self._raw_handlers:
                    try:
                        result = h(chunk)
                    except Exception:  # noqa: BLE001
                        log.exception("ScuLink[%s] raw handler raised",
                                      self.name)
                        continue
                    if inspect.isawaitable(result):
                        try:
                            await result
                        except Exception:  # noqa: BLE001
                            log.exception(
                                "ScuLink[%s] async raw handler raised",
                                self.name,
                            )
                continue
            buf.extend(chunk)
            for frame in decode(buf):
                await self._dispatch(frame)

    async def _writer_loop(self, writer: asyncio.StreamWriter) -> None:
        while True:
            data = await self._outbound.get()
            writer.write(data)
            await writer.drain()

    async def _dispatch(self, frame: Frame) -> None:
        for h in self._handlers:
            try:
                result = h(frame)
            except Exception:  # noqa: BLE001
                log.exception("ScuLink[%s] handler raised", self.name)
                continue
            if inspect.isawaitable(result):
                try:
                    await result
                except Exception:  # noqa: BLE001
                    log.exception("ScuLink[%s] async handler raised", self.name)
