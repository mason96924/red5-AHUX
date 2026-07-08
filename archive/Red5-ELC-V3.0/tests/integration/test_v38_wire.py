"""Integration test: V3.8 wire path (post-hardware rev).

Spins up a bare TCP server (no MockScu -- MockScu speaks legacy),
wires an SrmDriver against a ScuLink(wire_version='v38'), and asserts:

1. ``driver.set_relay()`` emits the observed 12-byte ETLC frame.
2. Feeding a synthetic RelayStatus bitmask back through the socket
   fans out into one RelayState event per channel implied by the mask.
"""

from __future__ import annotations

import asyncio

import pytest

# Force api-level modules to load first so their internal import order
# resolves the (pre-existing) circular dep between drivers.srm and
# domain.replica.
import elc.api  # noqa: F401

from elc.codec.device_id import DeviceId, DeviceType
from elc.codec.etlc38 import (
    CLASS_SRM,
    FRAME_LEN,
    OPCODE_RELAY_OVERRIDE,
    PREAMBLE,
    RelayStatusV38,
    checksum,
)
from elc.codec.messages import RelayState
from elc.drivers.srm import SrmDriver
from elc.transport.tcp_scu import LinkState, ScuLink


class _EchoServer:
    """Minimal TCP server: captures the bytes sent by the client and
    lets the test push bytes back.  Accepts multiple connections
    because the V3.8 driver uses one-shot connections per command."""

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


async def test_v38_set_relay_emits_observed_frame(v38_stack):
    """set_relay(SRM_6S/0/2/0, ON) must produce the exact 12-byte
    frame we determined from the hardware log."""
    link, driver, echo = v38_stack
    assert link.wire_version == "v38"
    assert link.state == LinkState.CONNECTED

    dev = DeviceId(dev_type=DeviceType.SRM_6S, scu=0, address=2, sub_address=0)
    await driver.set_relay(dev, True)

    # One-shot connection: give it a moment for the write to hit the
    # echo server's second accept() and complete.
    for _ in range(50):
        if len(echo.received) >= FRAME_LEN:
            break
        await asyncio.sleep(0.02)

    assert len(echo.received) == FRAME_LEN
    fr = bytes(echo.received)
    assert fr[:4] == PREAMBLE
    assert fr[4] == CLASS_SRM
    assert fr[9] == OPCODE_RELAY_OVERRIDE
    assert fr[10] == 1
    assert fr[11] == checksum(fr[4:11])
    # Golden hex from the codec test:
    assert fr.hex() == "454c43400715000200070161"


async def test_v38_inbound_relay_status_fans_out_per_channel(v38_stack):
    """A RelayStatus bitmask (channels 0 and 1 ON) must produce two
    ``state=True`` RelayState events plus four ``state=False`` for
    channels 2-5."""
    link, driver, echo = v38_stack

    caught: dict[int, bool] = {}

    async def sink(msg: RelayState) -> None:
        caught[msg.device.sub_address] = msg.state

    driver.on_state_change.subscribe(sink)

    dev = DeviceId(dev_type=DeviceType.SRM_6S, scu=0, address=2, sub_address=0)
    # mask 0x03 = channels 0, 1 on
    fake = RelayStatusV38(device=dev, state_mask=0x03).encode()
    await echo.push_bytes(fake)

    for _ in range(50):
        if len(caught) >= 6:
            break
        await asyncio.sleep(0.02)

    assert caught == {0: True, 1: True, 2: False, 3: False, 4: False, 5: False}


async def test_v38_split_reads_still_parse(v38_stack):
    """Frame straddling two socket reads must still parse."""
    _link, driver, echo = v38_stack
    caught: list[tuple[int, bool]] = []

    async def sink(msg: RelayState) -> None:
        caught.append((msg.device.sub_address, msg.state))

    driver.on_state_change.subscribe(sink)

    dev = DeviceId(dev_type=DeviceType.SRM_4S, scu=0, address=3, sub_address=0)
    frame = RelayStatusV38(device=dev, state_mask=0x01).encode()
    await echo.push_bytes(frame[:5])
    await asyncio.sleep(0.03)
    assert not caught
    await echo.push_bytes(frame[5:])
    for _ in range(50):
        if caught:
            break
        await asyncio.sleep(0.02)
    # We fan out 6 channels even for a 4sRM (channels 4-5 will report
    # False from the bitmask); the important thing is channel 0 is on.
    on = [(i, s) for i, s in caught if s]
    assert on == [(0, True)]


async def test_v38_ignores_garbage_before_preamble(v38_stack):
    """Random bytes before the preamble must be skipped without crash."""
    _link, driver, echo = v38_stack
    caught: list[tuple[int, bool]] = []
    driver.on_state_change.subscribe(
        lambda m: caught.append((m.device.sub_address, m.state))
    )

    dev = DeviceId(dev_type=DeviceType.SRM_6S, scu=0, address=2, sub_address=0)
    valid = RelayStatusV38(device=dev, state_mask=0x01).encode()
    await echo.push_bytes(b"\xaa\xbb" + b"EL" + valid)
    for _ in range(50):
        if any(s for _, s in caught):
            break
        await asyncio.sleep(0.02)
    assert (0, True) in caught
