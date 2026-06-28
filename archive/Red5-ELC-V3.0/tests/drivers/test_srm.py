"""Tests for the SrmDriver — uses MockScuServer + a controllable
'SCU' that echoes / fabricates RelayState frames on demand."""

from __future__ import annotations

import asyncio

import pytest

from elc.codec import Frame, encode
from elc.codec.device_id import DeviceId, DeviceType
from elc.codec.messages import (
    FailReport,
    RelaySet,
    RelayState,
    StatusQuery,
)
from elc.codec.registry import default_registry
from elc.drivers import SrmDriver
from elc.transport import ScuLink

pytestmark = pytest.mark.asyncio


def _dev(addr: int = 10) -> DeviceId:
    return DeviceId(dev_type=DeviceType.SRM, scu=1, address=addr, sub_address=0)


async def _wait_for(predicate, timeout: float = 2.0, interval: float = 0.01) -> None:
    loop = asyncio.get_event_loop()
    deadline = loop.time() + timeout
    while loop.time() < deadline:
        if predicate():
            return
        await asyncio.sleep(interval)
    raise TimeoutError(f"predicate not satisfied within {timeout}s")


async def _make_link(server) -> ScuLink:  # type: ignore[no-untyped-def]
    link = ScuLink("127.0.0.1", server.port, initial_backoff=0.05)
    await link.start()
    await link.wait_connected(timeout=2.0)
    return link


# ---------- set_relay sends RelaySet on the wire ----------------------


async def test_set_relay_emits_relayset_frame(mock_scu_server) -> None:
    link = await _make_link(mock_scu_server)
    driver = SrmDriver(link)
    try:
        await driver.set_relay(_dev(), True)
        await _wait_for(
            lambda: len(mock_scu_server.received_frames) >= 1, timeout=2.0
        )
        f = mock_scu_server.received_frames[0]
        assert f.msg_type == RelaySet.FLAG
        decoded = RelaySet.decode(f.payload)
        assert decoded.device == _dev()
        assert decoded.state is True
    finally:
        await link.stop()


# ---------- query() sends StatusQuery + awaits RelayState -------------


async def test_query_resolves_when_relaystate_arrives(mock_scu_server) -> None:
    device = _dev(15)

    async def responder(frame: Frame, writer):  # type: ignore[no-untyped-def]
        if frame.msg_type == StatusQuery.FLAG:
            reply = default_registry.encode_message(
                RelayState(device=device, state=True)
            )
            writer.write(encode(reply))
            await writer.drain()

    mock_scu_server.on_frame(responder)

    link = await _make_link(mock_scu_server)
    driver = SrmDriver(link)
    try:
        state = await driver.query(device, timeout=2.0)
        assert state.device == device
        assert state.state is True
    finally:
        await link.stop()


async def test_query_times_out_when_no_response(mock_scu_server) -> None:
    link = await _make_link(mock_scu_server)
    driver = SrmDriver(link)
    try:
        with pytest.raises(asyncio.TimeoutError):
            await driver.query(_dev(), timeout=0.2)
        # Pending Future must be cleaned up after timeout.
        assert driver._pending == {}  # noqa: SLF001
    finally:
        await link.stop()


async def test_query_for_other_device_does_not_resolve(mock_scu_server) -> None:
    """RelayState for device A must not satisfy a query for device B."""
    a, b = _dev(1), _dev(2)

    async def responder_for_a(frame: Frame, writer):  # type: ignore[no-untyped-def]
        if frame.msg_type == StatusQuery.FLAG:
            reply = default_registry.encode_message(
                RelayState(device=a, state=True)
            )
            writer.write(encode(reply))
            await writer.drain()

    mock_scu_server.on_frame(responder_for_a)

    link = await _make_link(mock_scu_server)
    driver = SrmDriver(link)
    try:
        with pytest.raises(asyncio.TimeoutError):
            await driver.query(b, timeout=0.3)
    finally:
        await link.stop()


# ---------- 0x15 / 0x23 surface on the event buses -------------------


async def test_unsolicited_relaystate_fires_event(mock_scu_server) -> None:
    device = _dev(7)

    async def push_unsolicited(frame: Frame, writer):  # type: ignore[no-untyped-def]
        # On any inbound frame, send back an unsolicited 0x15.
        wire = encode(
            default_registry.encode_message(RelayState(device=device, state=True))
        )
        writer.write(wire)
        await writer.drain()

    mock_scu_server.on_frame(push_unsolicited)

    link = await _make_link(mock_scu_server)
    driver = SrmDriver(link)
    received: list[RelayState] = []
    driver.on_state_change.subscribe(received.append)
    try:
        # Trigger by sending anything.
        await driver.set_relay(device, True)
        await _wait_for(lambda: len(received) >= 1, timeout=2.0)
        assert received[0].device == device
        assert received[0].state is True
    finally:
        await link.stop()


async def test_failreport_surfaces_on_on_fail(mock_scu_server) -> None:
    device = _dev(8)

    async def push_fail(frame: Frame, writer):  # type: ignore[no-untyped-def]
        wire = encode(
            default_registry.encode_message(
                FailReport(device=device, fail_code=0x42, detail=b"x")
            )
        )
        writer.write(wire)
        await writer.drain()

    mock_scu_server.on_frame(push_fail)

    link = await _make_link(mock_scu_server)
    driver = SrmDriver(link)
    failures: list[FailReport] = []
    driver.on_fail.subscribe(failures.append)
    try:
        await driver.set_relay(device, True)
        await _wait_for(lambda: len(failures) >= 1, timeout=2.0)
        assert failures[0].fail_code == 0x42
        assert failures[0].device == device
    finally:
        await link.stop()


# ---------- driver ignores unrelated flags -----------------------------


async def test_driver_ignores_unrelated_flags(mock_scu_server) -> None:
    """A frame with a flag the driver doesn't handle must not raise."""

    async def push_unrelated(frame: Frame, writer):  # type: ignore[no-untyped-def]
        # Send a Heartbeat (0x60) — not in SrmDriver.HANDLED_MESSAGES.
        wire = encode(Frame(msg_type=0x60, payload=b"\x00\x00\x00\x01"))
        writer.write(wire)
        await writer.drain()

    mock_scu_server.on_frame(push_unrelated)

    link = await _make_link(mock_scu_server)
    driver = SrmDriver(link)
    state_events: list[RelayState] = []
    driver.on_state_change.subscribe(state_events.append)
    try:
        await driver.set_relay(_dev(), True)
        # Give the wire a moment.
        await asyncio.sleep(0.1)
        assert state_events == []
        assert link.state.value == "connected"
    finally:
        await link.stop()
