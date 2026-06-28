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


# Silence unused-import lint for fixtures.
_ = contextlib
