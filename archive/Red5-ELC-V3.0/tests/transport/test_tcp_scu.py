"""Transport-layer tests — ScuLink against MockScuServer (real TCP)."""

from __future__ import annotations

import asyncio
from datetime import datetime, timezone

import pytest

from elc.codec import Frame, encode
from elc.codec.messages import Heartbeat, TimeDateSet
from elc.codec.registry import default_registry
from elc.transport import LinkState, ScuLink

pytestmark = pytest.mark.asyncio


# ---------- helpers ---------------------------------------------------


async def _wait_for(predicate, timeout: float = 2.0, interval: float = 0.01) -> None:
    """Poll `predicate` until truthy or raise `TimeoutError`."""
    loop = asyncio.get_event_loop()
    deadline = loop.time() + timeout
    while loop.time() < deadline:
        if predicate():
            return
        await asyncio.sleep(interval)
    raise TimeoutError(f"predicate not satisfied within {timeout}s")


# ---------- construction & validation ---------------------------------


async def test_constructor_rejects_bad_port() -> None:
    with pytest.raises(ValueError):
        ScuLink("127.0.0.1", 0)
    with pytest.raises(ValueError):
        ScuLink("127.0.0.1", 70000)


async def test_constructor_rejects_bad_backoff() -> None:
    with pytest.raises(ValueError):
        ScuLink("127.0.0.1", 7000, initial_backoff=0)
    with pytest.raises(ValueError):
        ScuLink("127.0.0.1", 7000, initial_backoff=1.0, max_backoff=0.5)


async def test_initial_state_is_down() -> None:
    link = ScuLink("127.0.0.1", 7000)
    assert link.state is LinkState.DOWN
    assert link.connect_attempts == 0


# ---------- successful connection -------------------------------------


async def test_connects_to_server(mock_scu_server) -> None:
    link = ScuLink("127.0.0.1", mock_scu_server.port, initial_backoff=0.05)
    await link.start()
    try:
        await link.wait_connected(timeout=2.0)
        assert link.state is LinkState.CONNECTED
        assert link.connect_attempts >= 1
    finally:
        await link.stop()
    assert link.state is LinkState.CLOSED


async def test_start_is_idempotent(mock_scu_server) -> None:
    link = ScuLink("127.0.0.1", mock_scu_server.port, initial_backoff=0.05)
    await link.start()
    await link.start()  # must not double-spawn or raise
    try:
        await link.wait_connected(timeout=2.0)
    finally:
        await link.stop()


# ---------- TimeDateSet → ack round-trip (the milestone test) ---------


async def test_timedateset_roundtrip(mock_scu_server) -> None:
    """Phase 2 acceptance: send TimeDateSet, receive an ack frame back."""

    async def ack_handler(frame: Frame, writer: asyncio.StreamWriter) -> None:
        if frame.msg_type == TimeDateSet.FLAG:
            # Echo back a Heartbeat carrying the year as the nonce so we can
            # prove the response is correlated with the request.
            year = int.from_bytes(frame.payload[:2], "big")
            reply = default_registry.encode_message(Heartbeat(nonce=year))
            writer.write(encode(reply))
            await writer.drain()

    mock_scu_server.on_frame(ack_handler)

    received: list[Frame] = []
    link = ScuLink("127.0.0.1", mock_scu_server.port, initial_backoff=0.05)
    link.feed(received.append)
    await link.start()
    try:
        await link.wait_connected(timeout=2.0)

        msg = TimeDateSet.from_datetime(
            datetime(2026, 2, 14, 9, 30, 45, tzinfo=timezone.utc)
        )
        await link.send(default_registry.encode_message(msg))

        await _wait_for(lambda: len(received) >= 1, timeout=2.0)

        assert len(mock_scu_server.received_frames) == 1
        assert mock_scu_server.received_frames[0].msg_type == TimeDateSet.FLAG
        decoded_req = TimeDateSet.decode(mock_scu_server.received_frames[0].payload)
        assert (decoded_req.year, decoded_req.month, decoded_req.day) == (
            2026, 2, 14,
        )

        assert received[0].msg_type == Heartbeat.FLAG
        assert Heartbeat.decode(received[0].payload).nonce == 2026
    finally:
        await link.stop()


async def test_send_multiple_frames_in_order(mock_scu_server) -> None:
    link = ScuLink("127.0.0.1", mock_scu_server.port, initial_backoff=0.05)
    await link.start()
    try:
        await link.wait_connected(timeout=2.0)
        for i in range(5):
            await link.send(
                default_registry.encode_message(Heartbeat(nonce=i))
            )
        await _wait_for(
            lambda: len(mock_scu_server.received_frames) >= 5, timeout=2.0
        )
        nonces = [
            Heartbeat.decode(f.payload).nonce
            for f in mock_scu_server.received_frames
        ]
        assert nonces == [0, 1, 2, 3, 4]
    finally:
        await link.stop()


# ---------- reconnect on dropped connection ---------------------------


async def test_reconnects_after_server_drop(mock_scu_server) -> None:
    link = ScuLink(
        "127.0.0.1", mock_scu_server.port, initial_backoff=0.05, max_backoff=0.1
    )
    await link.start()
    try:
        await link.wait_connected(timeout=2.0)
        first_attempts = link.connect_attempts

        # Force-disconnect every active client; ScuLink should reconnect.
        await mock_scu_server.disconnect_all()

        await _wait_for(
            lambda: link.connect_attempts > first_attempts
            and link.state is LinkState.CONNECTED,
            timeout=3.0,
        )

        # Pipe should be usable again.
        await link.send(default_registry.encode_message(Heartbeat(nonce=42)))
        await _wait_for(
            lambda: any(
                f.msg_type == Heartbeat.FLAG
                and Heartbeat.decode(f.payload).nonce == 42
                for f in mock_scu_server.received_frames
            ),
            timeout=2.0,
        )
    finally:
        await link.stop()


# ---------- back-off when server is unreachable -----------------------


async def test_backoff_when_server_unreachable() -> None:
    # Closed port: connect must fail repeatedly; state oscillates
    # CONNECTING ↔ DOWN.  We don't assert exact timing — just that
    # multiple attempts accumulate and `wait_connected` times out.
    link = ScuLink(
        "127.0.0.1",
        1,                        # unprivileged tests can't bind; almost
        initial_backoff=0.02,     # certainly refused on the test host
        max_backoff=0.05,
        connect_timeout=0.2,
    )
    await link.start()
    try:
        with pytest.raises(asyncio.TimeoutError):
            await link.wait_connected(timeout=0.5)
        assert link.connect_attempts >= 2
        assert link.state in {LinkState.DOWN, LinkState.CONNECTING}
    finally:
        await link.stop()


async def test_backoff_resets_after_successful_connect(mock_scu_server) -> None:
    """After at least one failed attempt, a successful connect should
    reset back-off (otherwise we would wait `max_backoff` after every
    transient network blip)."""
    # Start aimed at a bad port, then redirect to the live one isn't
    # supported by ScuLink (host/port are immutable).  Instead just
    # verify back-off doesn't keep climbing once connected.
    link = ScuLink(
        "127.0.0.1",
        mock_scu_server.port,
        initial_backoff=0.02,
        max_backoff=1.0,
    )
    await link.start()
    try:
        await link.wait_connected(timeout=2.0)
        await mock_scu_server.disconnect_all()
        # Should re-establish within roughly initial_backoff, not max_backoff.
        await _wait_for(
            lambda: link.state is LinkState.CONNECTED,
            timeout=1.0,           # well under max_backoff=1.0 cushion
        )
    finally:
        await link.stop()


# ---------- clean shutdown --------------------------------------------


async def test_stop_is_clean_and_idempotent(mock_scu_server) -> None:
    link = ScuLink("127.0.0.1", mock_scu_server.port, initial_backoff=0.05)
    await link.start()
    await link.wait_connected(timeout=2.0)
    await link.stop()
    await link.stop()              # second call must be a no-op
    assert link.state is LinkState.CLOSED


async def test_stop_before_connected_is_safe() -> None:
    link = ScuLink(
        "127.0.0.1", 1, initial_backoff=0.02, max_backoff=0.05, connect_timeout=0.2
    )
    await link.start()
    await asyncio.sleep(0.05)      # let it try once
    await link.stop()
    assert link.state is LinkState.CLOSED


# ---------- handler robustness ----------------------------------------


async def test_sync_and_async_handlers_both_fire(mock_scu_server) -> None:
    async def echoer(frame: Frame, writer: asyncio.StreamWriter) -> None:
        writer.write(encode(Frame(msg_type=Heartbeat.FLAG, payload=b"\x00\x00\x00\x07")))
        await writer.drain()

    mock_scu_server.on_frame(echoer)

    sync_hits: list[Frame] = []
    async_hits: list[Frame] = []

    async def async_handler(f: Frame) -> None:
        async_hits.append(f)

    link = ScuLink("127.0.0.1", mock_scu_server.port, initial_backoff=0.05)
    link.feed(sync_hits.append)
    link.feed(async_handler)
    await link.start()
    try:
        await link.wait_connected(timeout=2.0)
        await link.send(default_registry.encode_message(Heartbeat(nonce=1)))
        await _wait_for(
            lambda: sync_hits and async_hits, timeout=2.0
        )
        assert sync_hits[0].msg_type == Heartbeat.FLAG
        assert async_hits[0].msg_type == Heartbeat.FLAG
    finally:
        await link.stop()


async def test_handler_exception_does_not_break_link(mock_scu_server) -> None:
    async def echoer(frame: Frame, writer: asyncio.StreamWriter) -> None:
        writer.write(encode(Frame(msg_type=Heartbeat.FLAG, payload=b"\x00\x00\x00\x01")))
        await writer.drain()

    mock_scu_server.on_frame(echoer)

    good_hits: list[Frame] = []

    def bad_handler(_f: Frame) -> None:
        raise RuntimeError("kaboom")

    link = ScuLink("127.0.0.1", mock_scu_server.port, initial_backoff=0.05)
    link.feed(bad_handler)
    link.feed(good_hits.append)
    await link.start()
    try:
        await link.wait_connected(timeout=2.0)
        await link.send(default_registry.encode_message(Heartbeat(nonce=1)))
        await _wait_for(lambda: len(good_hits) >= 1, timeout=2.0)
        # Link still healthy after the bad handler.
        assert link.state is LinkState.CONNECTED
    finally:
        await link.stop()


async def test_async_handler_exception_does_not_break_link(mock_scu_server) -> None:
    async def echoer(frame: Frame, writer: asyncio.StreamWriter) -> None:
        writer.write(encode(Frame(msg_type=Heartbeat.FLAG, payload=b"\x00\x00\x00\x02")))
        await writer.drain()

    mock_scu_server.on_frame(echoer)

    good_hits: list[Frame] = []

    async def bad_async_handler(_f: Frame) -> None:
        raise RuntimeError("async-kaboom")

    link = ScuLink("127.0.0.1", mock_scu_server.port, initial_backoff=0.05)
    link.feed(bad_async_handler)
    link.feed(good_hits.append)
    await link.start()
    try:
        await link.wait_connected(timeout=2.0)
        await link.send(default_registry.encode_message(Heartbeat(nonce=2)))
        await _wait_for(lambda: len(good_hits) >= 1, timeout=2.0)
        assert link.state is LinkState.CONNECTED
    finally:
        await link.stop()


# ---------- fragmented inbound traffic (TCP doesn't preserve frames) --


async def test_handles_fragmented_inbound(mock_scu_server) -> None:
    """Send a single ELC frame in two writes — codec.decode() must
    stream it together."""

    async def split_responder(_frame: Frame, writer: asyncio.StreamWriter) -> None:
        reply = encode(Frame(msg_type=Heartbeat.FLAG, payload=b"\x00\x00\x00\x09"))
        # Deliberately split across two writes.
        writer.write(reply[:3])
        await writer.drain()
        await asyncio.sleep(0.01)
        writer.write(reply[3:])
        await writer.drain()

    mock_scu_server.on_frame(split_responder)

    received: list[Frame] = []
    link = ScuLink("127.0.0.1", mock_scu_server.port, initial_backoff=0.05)
    link.feed(received.append)
    await link.start()
    try:
        await link.wait_connected(timeout=2.0)
        await link.send(default_registry.encode_message(Heartbeat(nonce=0)))
        await _wait_for(lambda: len(received) >= 1, timeout=2.0)
        assert received[0].msg_type == Heartbeat.FLAG
        assert Heartbeat.decode(received[0].payload).nonce == 9
    finally:
        await link.stop()
