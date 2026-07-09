"""Broadcast ALL ON / ALL OFF on the ETLC V3.8 wire — opcode 0x07.

Operator-confirmed protocol (2026-07-25 hardware notes):

    "There must be a broadcast OFF.  The ALL on/off should use
     07 01/00 (for On/Off).  You send this command 6 or 4 times
     depending on the number of relays in the module almost
     simultaneously without waiting for the RX data packets.
     When it completes, the module returns with the 25 value as
     the return value with relay status."

This test pins:

  * ``driver.broadcast_v38`` fans out **exactly**
    ``len(modules) * max_channels`` frames on the wire (one per
    (module, channel) pair) via *independent, concurrent* TCP
    sockets — matching "almost simultaneously without waiting for
    the RX".
  * Every frame is a valid ETLC 0x07 RelayOverride carrying the
    requested state byte (0x01 ON / 0x00 OFF).
  * The frames land on the SCU as **concurrent socket opens**, not
    serialised behind a lock — otherwise a 6-channel × 3-module
    burst would take ~seconds instead of milliseconds.
  * A subsequent ``0x25`` RelayStatus reply is decoded and updates
    the ``Replica`` — the *hardware* state is treated as the source
    of truth (matches operator answer #4).
"""

from __future__ import annotations

import asyncio
import socket

import pytest

from elc.codec.device_id import DeviceId, DeviceType
from elc.codec.etlc38 import (
    OPCODE_RELAY_OVERRIDE,
    PREAMBLE,
    RelayStatusV38,
    TX_FRAME_LEN,
    channel_count_for,
)
from elc.domain.replica import Replica
from elc.drivers.srm import SrmDriver
from elc.transport import ScuLink

pytestmark = pytest.mark.asyncio


# ---------------------------------------------------------------------
# Minimal raw-TCP SCU stand-in.  Unlike MockScuServer this speaks the
# V3.8 preamble ('ELC@') instead of the legacy codec — the driver's
# v38 write path opens a fresh socket per frame and doesn't share the
# persistent ScuLink connection, so we can't reuse MockScuServer for
# byte-level verification here.
# ---------------------------------------------------------------------


class V38RawServer:
    """Raw-byte TCP server that captures V3.8 frames and optionally
    replies with a canned response (per-frame or global).
    """

    def __init__(self) -> None:
        self.port: int = 0
        self._server: asyncio.base_events.Server | None = None
        # (connection_index, raw_bytes) — connection_index lets a test
        # distinguish "N concurrent sockets" from "1 socket, N frames".
        self.received_bursts: list[bytes] = []
        self._reply_per_connection: bytes = b""
        # Number of connections opened so far (monotonic).
        self.connection_count: int = 0
        # Timestamps of connection acceptance for concurrency checks.
        self.connect_times: list[float] = []

    async def start(self) -> None:
        self._server = await asyncio.start_server(
            self._handle, "127.0.0.1", 0,
        )
        self.port = self._server.sockets[0].getsockname()[1]

    async def stop(self) -> None:
        if self._server is not None:
            self._server.close()
            await self._server.wait_closed()
            self._server = None

    def set_reply(self, data: bytes) -> None:
        """Every subsequent inbound frame gets this exact reply."""
        self._reply_per_connection = data

    async def _handle(
        self,
        reader: asyncio.StreamReader,
        writer: asyncio.StreamWriter,
    ) -> None:
        loop = asyncio.get_running_loop()
        self.connection_count += 1
        self.connect_times.append(loop.time())
        try:
            data = await reader.read(4096)
            if data:
                self.received_bursts.append(data)
                if self._reply_per_connection:
                    writer.write(self._reply_per_connection)
                    await writer.drain()
        finally:
            writer.close()
            try:
                await writer.wait_closed()
            except Exception:
                pass


@pytest.fixture
async def v38_server():
    srv = V38RawServer()
    await srv.start()
    try:
        yield srv
    finally:
        await srv.stop()


async def _make_v38_link(port: int) -> ScuLink:
    # wire_version='v38' installs the raw-byte handler on the persistent
    # link.  The v38 write path itself uses one-shot sockets (see
    # SrmDriver._v38_one_shot_send / _v38_burst_send) rather than the
    # persistent link — but the driver still needs (host, port) on the
    # link object to know where to dial.
    link = ScuLink(
        "127.0.0.1", port, initial_backoff=0.05, wire_version="v38",
    )
    await link.start()
    # Persistent connect can happen at any time; broadcast doesn't
    # depend on it being "CONNECTED", so no wait needed here.
    return link


# ---------------------------------------------------------------------
# 1) Correct frame count + opcode + state byte on the wire.
# ---------------------------------------------------------------------


@pytest.mark.parametrize("state,state_byte", [(True, 0x01), (False, 0x00)])
async def test_broadcast_v38_fires_one_frame_per_module_channel(
    v38_server, state, state_byte,
) -> None:
    """3 modules × max_channels=6  →  18 V3.8 opcode-0x07 frames on wire."""
    link = await _make_v38_link(v38_server.port)
    driver = SrmDriver(link)
    try:
        modules = [
            DeviceId(dev_type=DeviceType.SRM_4S, scu=0, address=3, sub_address=0),
            DeviceId(dev_type=DeviceType.SRM_6S, scu=0, address=1, sub_address=0),
            DeviceId(dev_type=DeviceType.SRM_6S, scu=0, address=2, sub_address=0),
        ]
        max_channels = max(channel_count_for(m.dev_type) for m in modules)
        assert max_channels == 6

        await driver.broadcast_v38(state, modules, max_channels)

        # 3 modules × 6 channels = 18 concurrent V3.8 frames on wire.
        # The persistent ScuLink also holds one silent TCP connection
        # to the server (no bytes ever sent through it), so we count
        # frame-bearing bursts here rather than raw connections.
        expected = len(modules) * max_channels
        assert len(v38_server.received_bursts) == expected, (
            f"expected {expected} frames, got "
            f"{len(v38_server.received_bursts)}"
        )

        # Every payload must be a well-formed V3.8 TX frame with the
        # 0x07 opcode + requested state byte.
        for raw in v38_server.received_bursts:
            assert len(raw) == TX_FRAME_LEN, f"bad frame length: {raw!r}"
            assert raw[:3] == PREAMBLE
            # Payload starts at offset 5 (after preamble+type+length),
            # opcode is payload byte 4, state is payload byte 5.
            opcode = raw[5 + 4]
            wire_state = raw[5 + 5]
            assert opcode == OPCODE_RELAY_OVERRIDE, (
                f"expected opcode 0x07, got 0x{opcode:02X}"
            )
            assert wire_state == state_byte, (
                f"expected state 0x{state_byte:02X}, got 0x{wire_state:02X}"
            )
    finally:
        await link.stop()


# ---------------------------------------------------------------------
# 2) Frames land as concurrent socket opens, NOT serialised behind a
#    per-frame lock.  Operator explicitly asked for "almost
#    simultaneously without waiting for RX".
# ---------------------------------------------------------------------


async def test_broadcast_v38_dispatches_concurrently(v38_server) -> None:
    modules = [
        DeviceId(dev_type=DeviceType.SRM_6S, scu=0, address=i, sub_address=0)
        for i in range(1, 4)
    ]
    max_ch = 6
    link = await _make_v38_link(v38_server.port)
    driver = SrmDriver(link)
    try:
        loop = asyncio.get_running_loop()
        t0 = loop.time()
        await driver.broadcast_v38(True, modules, max_ch)
        elapsed = loop.time() - t0

        # 18 frames.  If serialised behind _v38_write_lock the
        # existing 0.15s per-frame settling sleep would push this to
        # ~2.7s.  Concurrent should finish well under 1s even on a
        # slow CI runner.  This asserts we're NOT accidentally
        # reusing the serialised _v38_one_shot_send path.
        assert elapsed < 1.0, (
            f"broadcast_v38 took {elapsed:.2f}s — likely serialised"
        )
        # And every frame arrived within a very tight window (all 18
        # bursts within ~500ms of the first) — the persistent
        # ScuLink connection is silent and doesn't contribute a
        # burst timestamp here.
        burst_times = v38_server.connect_times[-(len(modules) * max_ch):]
        assert len(burst_times) == len(modules) * max_ch
        spread = max(burst_times) - min(burst_times)
        assert spread < 0.5, (
            f"connection spread {spread:.3f}s too wide — expected "
            f"near-simultaneous dial"
        )
    finally:
        await link.stop()


# ---------------------------------------------------------------------
# 3) Empty module list is a no-op (the REST layer calls this
#    unconditionally on a freshly-booted SCU with no discovered SRMs).
# ---------------------------------------------------------------------


async def test_broadcast_v38_no_modules_is_noop(v38_server) -> None:
    link = await _make_v38_link(v38_server.port)
    driver = SrmDriver(link)
    try:
        await driver.broadcast_v38(True, [], 6)
        # No burst frames on the wire — only the persistent ScuLink's
        # silent connection may exist, but it never sent any bytes.
        assert v38_server.received_bursts == []
    finally:
        await link.stop()


# ---------------------------------------------------------------------
# 4) 0x25 RelayStatus reply from the SCU updates the Replica — the
#    "hardware state is source of truth" rule from operator answer #4.
# ---------------------------------------------------------------------


async def test_broadcast_v38_replica_trusts_relaystatus_reply(v38_server) -> None:
    module = DeviceId(
        dev_type=DeviceType.SRM_6S, scu=0, address=2, sub_address=0,
    )
    # Canned SCU reply: 6-channel mask 0x3F (all six on) for this
    # module.  Every burst socket that connects will receive this
    # frame in response — the driver's _v38_burst_send drains it
    # into _on_v38_bytes which fans it out into per-channel
    # RelayState events, which the Replica consumes.
    reply = RelayStatusV38(device=module, state_mask=0x3F).encode()
    v38_server.set_reply(reply)

    link = await _make_v38_link(v38_server.port)
    driver = SrmDriver(link)
    replica = Replica()
    replica.attach(driver)
    try:
        await driver.broadcast_v38(True, [module], 6)
        # Give the async fan-out a beat to publish.
        await asyncio.sleep(0.15)
        # All 6 channels of the module must now be tracked as ON in
        # the replica — driven by the SCU's 0x25 reply, not by the
        # commanded state.
        for ch in range(1, 7):
            per_ch = DeviceId(
                dev_type=module.dev_type,
                scu=module.scu,
                address=module.address,
                sub_address=ch,
            )
            snap = replica.get(per_ch)
            assert snap is not None, f"channel {ch} not seen"
            assert snap.relay_state is True, (
                f"channel {ch}: replica={snap.relay_state}, "
                f"expected True from SCU 0x25 mask=0x3F"
            )
    finally:
        await link.stop()


# ---------------------------------------------------------------------
# 5) `max_channels=None` auto-computes from the largest module.
# ---------------------------------------------------------------------


async def test_broadcast_v38_max_channels_defaults_to_widest_module(
    v38_server,
) -> None:
    # Mix a 4SRM with a 6SRM — max should snap to 6, and BOTH modules
    # get 6 sends (the extra 2 on the 4SRM harmlessly overshoot).
    modules = [
        DeviceId(dev_type=DeviceType.SRM_4S, scu=0, address=3, sub_address=0),
        DeviceId(dev_type=DeviceType.SRM_6S, scu=0, address=1, sub_address=0),
    ]
    link = await _make_v38_link(v38_server.port)
    driver = SrmDriver(link)
    try:
        await driver.broadcast_v38(True, modules)  # no max_channels arg
        # 2 modules × 6 channels = 12 frames.
        assert len(v38_server.received_bursts) == 12
    finally:
        await link.stop()
