"""REST API tests — uses httpx ASGI transport for in-memory HTTP.

WebSocket tests live in `test_e2e.py` and use a real uvicorn so they
can exercise the full transport + driver + replica + WS chain.
"""

from __future__ import annotations

import asyncio
import contextlib

import httpx
import pytest

from elc.api import build_stack
from elc.codec import encode
from elc.codec.device_id import DeviceId, DeviceType
from elc.codec.messages import RelaySet, RelayState
from elc.codec.registry import default_registry

pytestmark = pytest.mark.asyncio


def _dev(addr: int = 10) -> DeviceId:
    return DeviceId(dev_type=DeviceType.SRM, scu=1, address=addr, sub_address=0)


def _id(dev: DeviceId) -> str:
    return str(dev)


@pytest.fixture
async def stack(mock_scu_server):
    """Live stack wired to MockScuServer; link connected."""
    stack = build_stack(
        "127.0.0.1", mock_scu_server.port, name="test", initial_backoff=0.05
    )
    await stack.link.start()
    await stack.link.wait_connected(timeout=2.0)
    try:
        yield stack
    finally:
        await stack.link.stop()


@pytest.fixture
async def client(stack):
    transport = httpx.ASGITransport(app=stack.app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


# ---------- /api/elc/link ---------------------------------------------


async def test_link_state(client, stack) -> None:
    r = await client.get("/api/elc/link")
    assert r.status_code == 200
    body = r.json()
    assert body["state"] == "connected"
    assert body["name"] == "test"
    assert body["connect_attempts"] >= 1


# ---------- POST /api/elc/devices/{id}/relay --------------------------


async def test_set_relay_emits_frame(client, stack, mock_scu_server) -> None:
    dev = _dev()
    r = await client.post(
        f"/api/elc/devices/{_id(dev)}/relay", json={"state": True}
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body == {"ok": True, "device": str(dev), "state": True}

    # The MockScu must have received a RelaySet frame.
    deadline = asyncio.get_event_loop().time() + 2.0
    while not mock_scu_server.received_frames and asyncio.get_event_loop().time() < deadline:
        await asyncio.sleep(0.01)
    assert len(mock_scu_server.received_frames) == 1
    f = mock_scu_server.received_frames[0]
    assert f.msg_type == RelaySet.FLAG
    decoded = RelaySet.decode(f.payload)
    assert decoded.device == dev
    assert decoded.state is True


async def test_set_relay_off_works(client, stack, mock_scu_server) -> None:
    dev = _dev(20)
    r = await client.post(
        f"/api/elc/devices/{_id(dev)}/relay", json={"state": False}
    )
    assert r.status_code == 200
    assert r.json()["state"] is False


async def test_set_relay_bad_device_id(client) -> None:
    r = await client.post(
        "/api/elc/devices/BOGUS/relay", json={"state": True}
    )
    assert r.status_code == 400


async def test_set_relay_503_when_link_down(mock_scu_server) -> None:
    """Stack with no link.start() must reject relay writes."""
    stack = build_stack(
        "127.0.0.1", mock_scu_server.port, initial_backoff=0.05
    )
    transport = httpx.ASGITransport(app=stack.app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as c:
        r = await c.post(
            f"/api/elc/devices/{_id(_dev())}/relay", json={"state": True}
        )
        assert r.status_code == 503


# ---------- GET /api/elc/devices  (+ single device) -------------------


async def test_devices_endpoints_reflect_replica(
    client, stack, mock_scu_server
) -> None:
    # Have the MockScu push an unsolicited RelayState so the replica
    # records a snapshot.
    async def push_state(frame, writer):  # type: ignore[no-untyped-def]
        wire = encode(
            default_registry.encode_message(
                RelayState(device=_dev(50), state=True)
            )
        )
        writer.write(wire)
        await writer.drain()

    mock_scu_server.on_frame(push_state)

    # Trigger by sending any frame from the controller side.
    r = await client.post(
        f"/api/elc/devices/{_id(_dev())}/relay", json={"state": True}
    )
    assert r.status_code == 200

    # Wait for the inbound state to land in the replica.
    deadline = asyncio.get_event_loop().time() + 2.0
    while not stack.replica.get(_dev(50)) and asyncio.get_event_loop().time() < deadline:
        await asyncio.sleep(0.01)

    r = await client.get(f"/api/elc/devices/{_id(_dev(50))}")
    assert r.status_code == 200
    body = r.json()
    assert body["device"] == str(_dev(50))
    assert body["relay_state"] is True

    r = await client.get("/api/elc/devices")
    assert r.status_code == 200
    rows = r.json()
    assert any(row["device"] == str(_dev(50)) for row in rows)


async def test_device_404_when_unseen(client) -> None:
    r = await client.get(f"/api/elc/devices/{_id(_dev(999))}")
    assert r.status_code == 404


# ---------- GET /api/elc/demo-devices ---------------------------------


async def test_demo_devices_defaults_to_empty_mock(client) -> None:
    """When build_stack is called without demo_devices, the endpoint
    reports source=mock and an empty inventory (no crash)."""
    r = await client.get("/api/elc/demo-devices")
    assert r.status_code == 200
    body = r.json()
    assert body["source"] == "mock"
    assert body["count"] == 0
    assert body["devices"] == []


async def test_demo_devices_reports_physical_inventory(mock_scu_server) -> None:
    """When build_stack is passed a device list + data_source='physical',
    /demo-devices returns exactly that list.  This is the code path the
    editor's Seed button relies on to switch label + count to the
    operator's real 6eRM/6sRM/4sRM inventory."""
    inventory = [
        DeviceId(dev_type=DeviceType.SRM, scu=1, address=10, sub_address=i)
        for i in range(6)
    ] + [
        DeviceId(dev_type=DeviceType.SRM, scu=1, address=20, sub_address=i)
        for i in range(6)
    ] + [
        DeviceId(dev_type=DeviceType.SRM, scu=1, address=30, sub_address=i)
        for i in range(4)
    ]
    stack = build_stack(
        "127.0.0.1", mock_scu_server.port, initial_backoff=0.05,
        demo_devices=inventory, data_source="physical",
    )
    transport = httpx.ASGITransport(app=stack.app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as c:
        r = await c.get("/api/elc/demo-devices")
        assert r.status_code == 200
        body = r.json()
        assert body["source"] == "physical"
        assert body["count"] == 16
        assert body["devices"] == [str(d) for d in inventory]


# ---------- POST /api/elc/devices/{id}/register -----------------------


async def test_register_device_populates_replica_without_relay(
    client, stack, mock_scu_server
) -> None:
    """Register endpoint must NOT emit any RelaySet frame -- registering
    a device on a physical SCU should never physically switch relays.
    """
    dev = _dev(70)
    r = await client.post(f"/api/elc/devices/{_id(dev)}/register")
    assert r.status_code == 200, r.text
    body = r.json()
    assert body == {"ok": True, "device": str(dev), "registered": True}

    # The MockScu must NOT have received any frame from this call.
    # Give the loop a beat to expose any accidental write.
    await asyncio.sleep(0.05)
    assert len(mock_scu_server.received_frames) == 0

    # Device now visible via the standard endpoints, with unknown state.
    r = await client.get(f"/api/elc/devices/{_id(dev)}")
    assert r.status_code == 200
    snap = r.json()
    assert snap["device"] == str(dev)
    assert snap["relay_state"] is None


async def test_register_device_is_idempotent(client, stack) -> None:
    dev = _dev(80)
    r1 = await client.post(f"/api/elc/devices/{_id(dev)}/register")
    r2 = await client.post(f"/api/elc/devices/{_id(dev)}/register")
    assert r1.json()["registered"] is True
    assert r2.json()["registered"] is False


async def test_register_device_bad_id(client) -> None:
    r = await client.post("/api/elc/devices/BOGUS/register")
    assert r.status_code == 400


# ---------- POST /api/elc/devices/{id}/dim ---------------------------


async def test_dim_sets_level_and_broadcasts_event(
    client, stack, mock_scu_server
) -> None:
    """POST /dim clamps to [0,1], updates the replica snapshot, and
    emits a ``dim_level`` event so subscribed WS/SSE clients update.
    """
    dev = _dev(90)
    # Register first so the snapshot exists (mirrors real UI flow).
    await client.post(f"/api/elc/devices/{_id(dev)}/register")

    seen: list[dict[str, Any]] = []
    async def sink(ev: dict[str, Any]) -> None:
        if ev.get("type") == "dim_level":
            seen.append(ev)
    stack.replica.events.subscribe(sink)

    r = await client.post(
        f"/api/elc/devices/{_id(dev)}/dim", json={"level": 0.42}
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["ok"] is True
    assert body["device"] == str(dev)
    assert body["level"] == pytest.approx(0.42)
    assert body["mocked"] is True

    await asyncio.sleep(0.02)
    assert len(seen) == 1
    assert seen[0]["device"] == str(dev)
    assert seen[0]["level"] == pytest.approx(0.42)

    # Snapshot reflects the level.
    r2 = await client.get(f"/api/elc/devices/{_id(dev)}")
    assert r2.json()["dim_level"] == pytest.approx(0.42)

    # No wire frame emitted -- dim is UI-only (Phase 6.1 stub).
    assert len(mock_scu_server.received_frames) == 0


async def test_dim_clamps_out_of_range(client) -> None:
    dev = _dev(91)
    r_hi = await client.post(
        f"/api/elc/devices/{_id(dev)}/dim", json={"level": 3.7}
    )
    r_lo = await client.post(
        f"/api/elc/devices/{_id(dev)}/dim", json={"level": -0.5}
    )
    assert r_hi.json()["level"] == pytest.approx(1.0)
    assert r_lo.json()["level"] == pytest.approx(0.0)


# Silence unused-import lint for fixtures.
_ = contextlib
