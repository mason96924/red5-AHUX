"""Round-trip and replica-fanout test for the coalesced broadcast path.

Why this exists:
    Before broadcast coalescing the mock SCU echoed N RelayState frames
    (one per device) in response to a wildcard RelaySet.  That overran
    the per-client SSE/WS queues (PER_CLIENT_QUEUE_MAX = 256) when
    multiple browsers were attached, producing inconsistent partial
    paints across viewers.  These tests pin the new contract:

      * BroadcastComplete encodes / decodes round-trip cleanly.
      * `default_registry` knows the new flag.
      * SrmDriver fires `on_broadcast` exactly once per inbound
        BroadcastComplete frame.
      * Replica fans the broadcast out as ONE 'broadcast_complete'
        event (not N relay_state events) and updates every matching
        snapshot in lock-step.
"""

from __future__ import annotations

import asyncio
from unittest.mock import MagicMock

import pytest

from elc.codec.device_id import DeviceId, DeviceType
from elc.codec.messages import BroadcastComplete
from elc.codec.registry import default_registry
from elc.domain.replica import Replica
from elc.drivers.srm import SrmDriver


# ---------- codec round-trip --------------------------------------------------

def test_broadcast_complete_roundtrip() -> None:
    msg = BroadcastComplete(dev_type=int(DeviceType.SRM), scu=1, state=True, count=400)
    encoded = msg.encode()
    assert len(encoded) == 6
    assert BroadcastComplete.decode(encoded) == msg


def test_broadcast_complete_registered() -> None:
    assert BroadcastComplete.FLAG in default_registry
    assert BroadcastComplete.FLAG in default_registry.known_flags()


def test_broadcast_complete_rejects_out_of_range() -> None:
    with pytest.raises(ValueError):
        BroadcastComplete(dev_type=2048, scu=1, state=True).encode()
    with pytest.raises(ValueError):
        BroadcastComplete(dev_type=2, scu=64, state=True).encode()
    with pytest.raises(ValueError):
        BroadcastComplete(dev_type=2, scu=1, state=True, count=70000).encode()


# ---------- driver / replica fanout -------------------------------------------

@pytest.mark.asyncio
async def test_replica_emits_single_broadcast_event() -> None:
    """One BroadcastComplete frame must produce exactly one replica event
    on the public bus, regardless of how many devices the replica is
    tracking that match (dev_type, scu)."""
    link = MagicMock()
    link.send = MagicMock(side_effect=lambda *a, **kw: asyncio.sleep(0))
    driver = SrmDriver(link)
    replica = Replica()
    replica.attach(driver)

    # Pre-populate replica with 200 SRM/1 devices and 50 SRM/2 devices.
    # The SRM/2 group must NOT be touched by an SRM/1 broadcast.
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc)
    for addr in range(100, 300):
        d = DeviceId(dev_type=DeviceType.SRM, scu=1, address=addr, sub_address=0)
        replica._touch(d)  # noqa: SLF001 -- test fixture priming
        replica._by_device[d].relay_state = False
        replica._by_device[d].last_seen = now
    for addr in range(100, 150):
        d = DeviceId(dev_type=DeviceType.SRM, scu=2, address=addr, sub_address=0)
        replica._touch(d)  # noqa: SLF001
        replica._by_device[d].relay_state = False
        replica._by_device[d].last_seen = now

    received: list[dict] = []
    replica.events.subscribe(received.append)

    # Fire one BroadcastComplete for SRM/1 → state=True
    await driver._on_BroadcastComplete(  # noqa: SLF001 -- exercising the inbound path
        BroadcastComplete(dev_type=int(DeviceType.SRM), scu=1, state=True, count=200)
    )
    # Let the replica's async subscriber run.
    await asyncio.sleep(0)
    await asyncio.sleep(0)

    # EXACTLY one event must be published, of type broadcast_complete.
    bc_events = [e for e in received if e.get("type") == "broadcast_complete"]
    relay_events = [e for e in received if e.get("type") == "relay_state"]
    assert len(bc_events) == 1, (
        f"expected 1 broadcast_complete event, got {len(bc_events)}; "
        f"all events: {received}"
    )
    assert len(relay_events) == 0, "broadcast must not produce per-device relay_state spam"

    ev = bc_events[0]
    assert ev["dev_type"] == int(DeviceType.SRM)
    assert ev["scu"] == 1
    assert ev["state"] is True
    assert ev["count"] == 200
    assert ev["affected_replica"] == 200

    # SRM/1 snapshots updated to True.
    for addr in range(100, 300):
        d = DeviceId(dev_type=DeviceType.SRM, scu=1, address=addr, sub_address=0)
        assert replica.get(d).relay_state is True
    # SRM/2 snapshots untouched.
    for addr in range(100, 150):
        d = DeviceId(dev_type=DeviceType.SRM, scu=2, address=addr, sub_address=0)
        assert replica.get(d).relay_state is False
