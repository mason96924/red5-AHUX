"""Integration test: V3.8 wire path.

Spins up a bare TCP echo server (no MockScu -- MockScu speaks legacy),
wires an SrmDriver against a ScuLink(wire_version='v38'), and asserts:

1. ``driver.set_relay()`` emits an 11-byte ETLC ``RelayOverride`` frame
   with our best-guess V3.8 layout.
2. Feeding a synthetic ``RelayStateV38`` frame back through the socket
   triggers ``driver.on_state_change`` with the correct DeviceId.
"""

from __future__ import annotations

import asyncio

import pytest

# Force api-level modules to load first so their internal import order
# resolves the (pre-existing) circular dep between drivers.srm and
# domain.replica.  Importing elc.api first mirrors what production
# code does and mirrors the ordering the other integration tests use.
import elc.api  # noqa: F401

from elc.codec.device_id import DeviceId, DeviceType
from elc.codec.etlc38 import (
    FLAG_STANDARD,
    OPCODE_RELAY_OVERRIDE,
    OPCODE_RELAY_STATE,
    RelayOverrideV38,
    RelayStateV38,
    checksum,
)
from elc.codec.messages import RelayState
from elc.drivers.srm import SrmDriver
from elc.transport.tcp_scu import LinkState, ScuLink


class _EchoServer:
    """Minimal TCP server that captures the bytes it receives and lets
    the test push arbitrary bytes back to the client.  No protocol
    smarts -- we're driving the client, not simulating the SCU."""

    def __init__(self) -> None:
        self.received: bytearray = bytearray()
        self._server: asyncio.AbstractServer | None = None
        self._writer: asyncio.StreamWriter | None = None
        self._writers: list[asyncio.StreamWriter] = []
        self.client_connected = asyncio.Event()

    async def start(self) -> int:
        self._server = await asyncio.start_server(
            self._handle, host="127.0.0.1", port=0
        )
        return self._server.sockets[0].getsockname()[1]

    async def _handle(self, reader, writer):  # type: ignore[no-untyped-def]
        self._writer = writer
        self._writers.append(writer)
        self.client_connected.set()
        try:
            while True:
                chunk = await reader.read(4096)
                if not chunk:
                    return
                self.received.extend(chunk)
        finally:
            try:
                writer.close()
                await writer.wait_closed()
            except Exception:
                pass

    async def push_bytes(self, data: bytes) -> None:
        assert self._writer is not None
        self._writer.write(data)
        await self._writer.drain()

    async def stop(self) -> None:
        for w in self._writers:
            try:
                w.close()
                await w.wait_closed()
            except Exception:
                pass
        if self._server is not None:
            self._server.close()
            await self._server.wait_closed()


@pytest.fixture
async def v38_stack():
    """A minimal (link + driver) wired for V3.8, no MockScu, no FastAPI."""
    echo = _EchoServer()
    port = await echo.start()

    link = ScuLink(
        host="127.0.0.1", port=port,
        initial_backoff=0.05, wire_version="v38",
    )
    driver = SrmDriver(link)
    await link.start()
    await link.wait_connected(timeout=2.0)
    await echo.client_connected.wait()
    try:
        yield link, driver, echo
    finally:
        await link.stop()
        await echo.stop()


async def test_v38_set_relay_emits_etlc_frame(v38_stack):
    """set_relay() must produce the exact 11-byte V3.8 frame."""
    link, driver, echo = v38_stack
    assert link.wire_version == "v38"
    assert link.state == LinkState.CONNECTED

    dev = DeviceId(
        dev_type=DeviceType.SRM_6S, scu=1, address=2, sub_address=0,
    )
    await driver.set_relay(dev, True)

    # Give the writer loop a beat to flush.
    for _ in range(20):
        if len(echo.received) >= 11:
            break
        await asyncio.sleep(0.01)

    assert len(echo.received) == 11, (
        f"expected 11-byte ETLC frame, got {len(echo.received)}: "
        f"{bytes(echo.received).hex()}"
    )
    frame = bytes(echo.received)
    assert frame[:4] == FLAG_STANDARD
    assert frame[8] == OPCODE_RELAY_OVERRIDE
    assert frame[9] == 1  # state ON
    assert checksum(frame[:10]) == frame[10]

    # And the frame is exactly what our probe script would send.
    expected = RelayOverrideV38(device=dev, state=True).encode()
    assert frame == expected


async def test_v38_inbound_relay_state_fires_event(v38_stack):
    """A synthetic V3.8 RelayState echo must reach on_state_change."""
    link, driver, echo = v38_stack

    caught: list[RelayState] = []

    async def sink(msg: RelayState) -> None:
        caught.append(msg)

    driver.on_state_change.subscribe(sink)

    dev = DeviceId(
        dev_type=DeviceType.SRM_ERM, scu=1, address=1, sub_address=3,
    )
    fake_echo = RelayStateV38(device=dev, state=True).encode()
    await echo.push_bytes(fake_echo)

    for _ in range(20):
        if caught:
            break
        await asyncio.sleep(0.02)

    assert len(caught) == 1
    assert caught[0].device == dev
    assert caught[0].state is True


async def test_v38_split_reads_still_parse(v38_stack):
    """Frames straddling two socket reads must still parse correctly.

    The V3.8 raw-handler buffers unparsed bytes across chunks; this
    test verifies a frame split into 5-byte + 6-byte chunks arrives
    intact.
    """
    _link, driver, echo = v38_stack
    caught: list[RelayState] = []

    async def sink(msg: RelayState) -> None:
        caught.append(msg)

    driver.on_state_change.subscribe(sink)

    dev = DeviceId(
        dev_type=DeviceType.SRM_4S, scu=1, address=3, sub_address=1,
    )
    frame = RelayStateV38(device=dev, state=False).encode()
    await echo.push_bytes(frame[:5])
    await asyncio.sleep(0.02)
    assert not caught, "should not fire on partial frame"
    await echo.push_bytes(frame[5:])
    for _ in range(20):
        if caught:
            break
        await asyncio.sleep(0.02)

    assert len(caught) == 1
    assert caught[0].device == dev
    assert caught[0].state is False


async def test_v38_ignores_garbage_before_sentinel(v38_stack):
    """Random bytes preceding a valid frame must be skipped, not crash."""
    _link, driver, echo = v38_stack
    caught: list[RelayState] = []
    driver.on_state_change.subscribe(lambda m: caught.append(m))

    dev = DeviceId(
        dev_type=DeviceType.SRM_6S, scu=1, address=2, sub_address=4,
    )
    valid = RelayStateV38(device=dev, state=True).encode()
    # Prepend a nonsense byte and an incomplete sentinel to exercise
    # the resynchronisation loop.
    await echo.push_bytes(b"\xaa" + b"\xff\xff\xff" + valid)
    for _ in range(30):
        if caught:
            break
        await asyncio.sleep(0.02)
    assert len(caught) == 1
    assert caught[0].device == dev
