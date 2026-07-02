"""End-to-end integration test for the demo/stress broadcast path.

Why this exists:
    The V3.0 `/stress` console broadcast buttons rely on the demo's
    MockScuServer emitting a `BroadcastComplete` (0x17) frame in
    response to a wildcard `RelaySet`.  A previous version of
    `scripts/demo.py` naively echoed a `RelayState` for the wildcard
    device instead — which the stress-grid frontend can't match to any
    cell (address 1023 / sub_address 63 isn't rendered), so the ALL
    ON / ALL OFF buttons silently no-op'd on both PC and iOS.

    This test pins the fix:

      * A wildcard RelaySet through the mock produces exactly one
        BroadcastComplete on the driver bus.
      * The replica converts it to a single 'broadcast_complete' event.
      * The dev_type / scu / state on the event match the RelaySet
        that triggered it (so the frontend prefix match works).
"""

from __future__ import annotations

import asyncio
from typing import Any

import pytest

from elc.codec import encode
from elc.codec.device_id import ADDR_BITS, SUBADDR_BITS, DeviceId, DeviceType
from elc.codec.messages import BroadcastComplete, RelaySet, RelayState
from elc.codec.registry import default_registry
from elc.domain.replica import Replica
from elc.drivers.srm import SrmDriver
from elc.transport import LinkState, ScuLink

_WILDCARD_ADDR = (1 << ADDR_BITS) - 1
_WILDCARD_SUB = (1 << SUBADDR_BITS) - 1


def _install_demo_echo(scu_server, scu_state: dict[DeviceId, bool]) -> None:
    """Byte-for-byte mirror of `scripts.demo.echo_relay`.

    Kept inline here so this test doesn't depend on scripts/ being on
    sys.path.  If the demo's mock behaviour changes, update both.
    """
    async def echo_relay(frame, writer):  # type: ignore[no-untyped-def]
        if frame.msg_type != RelaySet.FLAG:
            return
        cmd = RelaySet.decode(frame.payload)
        is_wildcard = (
            cmd.device.address == _WILDCARD_ADDR
            and cmd.device.sub_address == _WILDCARD_SUB
        )
        if is_wildcard:
            affected = 0
            for d in list(scu_state.keys()):
                if (
                    int(d.dev_type) == int(cmd.device.dev_type)
                    and d.scu == cmd.device.scu
                ):
                    scu_state[d] = cmd.state
                    affected += 1
            reply = default_registry.encode_message(
                BroadcastComplete(
                    dev_type=int(cmd.device.dev_type),
                    scu=cmd.device.scu,
                    state=cmd.state,
                    count=affected,
                )
            )
            writer.write(encode(reply))
            await writer.drain()
            return
        scu_state[cmd.device] = cmd.state
        reply = default_registry.encode_message(
            RelayState(device=cmd.device, state=cmd.state)
        )
        writer.write(encode(reply))
        await writer.drain()

    scu_server.on_frame(echo_relay)


@pytest.mark.asyncio
async def test_wildcard_relayset_produces_broadcast_complete(mock_scu_server) -> None:
    """POST /api/elc/broadcast → wildcard RelaySet → BroadcastComplete SSE."""
    # Seed the mock SCU with a handful of SRM/1 devices (matches demo.py).
    scu_state: dict[DeviceId, bool] = {
        DeviceId(dev_type=DeviceType.SRM, scu=1, address=a, sub_address=0): False
        for a in (10, 20, 30, 40)
    }
    _install_demo_echo(mock_scu_server, scu_state)

    # Wire the real stack against the mock SCU.
    link = ScuLink(host="127.0.0.1", port=mock_scu_server.port, name="test")
    driver = SrmDriver(link)
    replica = Replica()
    replica.attach(driver)
    received: list[dict[str, Any]] = []
    replica.events.subscribe(received.append)

    await link.start()
    try:
        await link.wait_connected(timeout=3.0)
        assert link.state is LinkState.CONNECTED

        # Fire a broadcast (this is what POST /api/elc/broadcast does).
        await driver.broadcast(state=True)

        # Wait for the mock's BroadcastComplete to come back through the
        # link, driver, and replica.
        for _ in range(50):
            if any(e.get("type") == "broadcast_complete" for e in received):
                break
            await asyncio.sleep(0.02)
    finally:
        await link.stop()

    bc = [e for e in received if e.get("type") == "broadcast_complete"]
    relays = [e for e in received if e.get("type") == "relay_state"]
    assert len(bc) == 1, (
        f"expected exactly 1 broadcast_complete, got {len(bc)}; all events={received}"
    )
    assert len(relays) == 0, (
        f"wildcard broadcast must not spam per-device relay_state; got {relays}"
    )
    ev = bc[0]
    # Frontend (demo/stress.html) uses these three fields to build the
    # prefix "SRM/1/" and paint matching grid cells.
    assert ev["dev_type"] == int(DeviceType.SRM)
    assert ev["scu"] == 1
    assert ev["state"] is True
    # Count matches the number of pre-populated devices on the mock.
    assert ev["count"] == 4


@pytest.mark.asyncio
async def test_wildcard_off_after_on(mock_scu_server) -> None:
    """Two consecutive broadcasts produce two BroadcastComplete events."""
    scu_state: dict[DeviceId, bool] = {
        DeviceId(dev_type=DeviceType.SRM, scu=1, address=a, sub_address=0): False
        for a in (10, 20, 30, 40)
    }
    _install_demo_echo(mock_scu_server, scu_state)

    link = ScuLink(host="127.0.0.1", port=mock_scu_server.port, name="test")
    driver = SrmDriver(link)
    replica = Replica()
    replica.attach(driver)
    received: list[dict[str, Any]] = []
    replica.events.subscribe(received.append)

    await link.start()
    try:
        await link.wait_connected(timeout=3.0)
        await driver.broadcast(state=True)
        await driver.broadcast(state=False)

        for _ in range(50):
            bc = [e for e in received if e.get("type") == "broadcast_complete"]
            if len(bc) >= 2:
                break
            await asyncio.sleep(0.02)
    finally:
        await link.stop()

    bc = [e for e in received if e.get("type") == "broadcast_complete"]
    assert len(bc) == 2, f"expected 2 broadcast_complete events, got {len(bc)}"
    assert bc[0]["state"] is True
    assert bc[1]["state"] is False
    # Every seeded device should now be OFF in the mock's state table.
    assert all(v is False for v in scu_state.values())


@pytest.mark.asyncio
async def test_individual_relayset_still_echoes_relaystate(mock_scu_server) -> None:
    """Non-wildcard RelaySet keeps the old per-device echo behaviour."""
    scu_state: dict[DeviceId, bool] = {}
    _install_demo_echo(mock_scu_server, scu_state)

    link = ScuLink(host="127.0.0.1", port=mock_scu_server.port, name="test")
    driver = SrmDriver(link)
    replica = Replica()
    replica.attach(driver)
    received: list[dict[str, Any]] = []
    replica.events.subscribe(received.append)

    await link.start()
    try:
        await link.wait_connected(timeout=3.0)
        dev = DeviceId(dev_type=DeviceType.SRM, scu=1, address=5, sub_address=1)
        await driver.set_relay(dev, True)

        for _ in range(50):
            if any(e.get("type") == "relay_state" for e in received):
                break
            await asyncio.sleep(0.02)
    finally:
        await link.stop()

    relays = [e for e in received if e.get("type") == "relay_state"]
    bc = [e for e in received if e.get("type") == "broadcast_complete"]
    assert len(relays) == 1, f"expected 1 relay_state event, got {relays}"
    assert len(bc) == 0, "individual set must not fire broadcast_complete"
    assert relays[0]["device"] == "SRM/1/5/1"
    assert relays[0]["state"] is True
