"""End-to-end: REST → ScuLink → MockScu → WS push.

Uses a real uvicorn server bound to an ephemeral port so the
WebSocket handshake actually crosses an HTTP/1.1 upgrade.
"""

from __future__ import annotations

import asyncio
import contextlib
import json

import httpx
import pytest
import uvicorn
import websockets

from elc.api import build_stack
from elc.codec import encode
from elc.codec.device_id import DeviceId, DeviceType
from elc.codec.messages import RelayState
from elc.codec.registry import default_registry


def _dev(addr: int = 30) -> DeviceId:
    return DeviceId(dev_type=DeviceType.SRM, scu=1, address=addr, sub_address=0)


class _UvicornInProcess:
    """Run a uvicorn server in the same event loop on an ephemeral port."""

    def __init__(self, app) -> None:  # type: ignore[no-untyped-def]
        self._config = uvicorn.Config(
            app, host="127.0.0.1", port=0, log_level="warning", lifespan="off"
        )
        self._server = uvicorn.Server(self._config)
        self._task: asyncio.Task | None = None

    async def start(self) -> None:
        self._task = asyncio.create_task(self._server.serve())
        # Wait until the server has bound + started accepting.
        while not self._server.started:
            await asyncio.sleep(0.01)

    @property
    def port(self) -> int:
        # uvicorn stores the bound socket inside `Server.servers`.
        return self._server.servers[0].sockets[0].getsockname()[1]

    async def stop(self) -> None:
        self._server.should_exit = True
        self._server.force_exit = True
        if self._task is not None:
            with contextlib.suppress(asyncio.CancelledError, asyncio.TimeoutError, Exception):
                await asyncio.wait_for(self._task, timeout=2.0)
            if not self._task.done():
                self._task.cancel()
                with contextlib.suppress(asyncio.CancelledError, Exception):
                    await self._task


@pytest.fixture
async def e2e(mock_scu_server):
    stack = build_stack(
        "127.0.0.1",
        mock_scu_server.port,
        name="e2e",
        initial_backoff=0.05,
    )
    await stack.link.start()
    await stack.link.wait_connected(timeout=2.0)

    server = _UvicornInProcess(stack.app)
    await server.start()
    try:
        yield stack, server
    finally:
        await server.stop()
        await stack.link.stop()


# ---------- WS receives replica events --------------------------------


async def test_ws_pushes_relaystate_event(e2e, mock_scu_server) -> None:
    stack, server = e2e
    base = f"http://127.0.0.1:{server.port}"
    ws_url = f"ws://127.0.0.1:{server.port}/ws/elc/events"

    # Mock SCU echoes an unsolicited RelayState in response to anything.
    async def push_state(frame, writer):  # type: ignore[no-untyped-def]
        wire = encode(
            default_registry.encode_message(
                RelayState(device=_dev(), state=True)
            )
        )
        writer.write(wire)
        await writer.drain()

    mock_scu_server.on_frame(push_state)

    async with websockets.connect(ws_url) as ws:
        # Trigger by POSTing a relay command.
        async with httpx.AsyncClient(base_url=base) as client:
            r = await client.post(
                f"/api/elc/devices/{_dev()}/relay", json={"state": True}
            )
            assert r.status_code == 200

        raw = await asyncio.wait_for(ws.recv(), timeout=2.0)
        event = json.loads(raw)
        assert event["type"] == "relay_state"
        assert event["device"] == str(_dev())
        assert event["state"] is True

    # And the REST device endpoint must reflect the same state.
    async with httpx.AsyncClient(base_url=base) as client:
        r = await client.get(f"/api/elc/devices/{_dev()}")
        assert r.status_code == 200
        body = r.json()
        assert body["relay_state"] is True


async def test_ws_multiple_clients_each_get_event(e2e, mock_scu_server) -> None:
    """Fan-out must reach every connected WS client independently."""
    stack, server = e2e
    base = f"http://127.0.0.1:{server.port}"
    ws_url = f"ws://127.0.0.1:{server.port}/ws/elc/events"

    async def push_state(frame, writer):  # type: ignore[no-untyped-def]
        wire = encode(
            default_registry.encode_message(
                RelayState(device=_dev(77), state=True)
            )
        )
        writer.write(wire)
        await writer.drain()

    mock_scu_server.on_frame(push_state)

    async with websockets.connect(ws_url) as ws_a, websockets.connect(ws_url) as ws_b:
        async with httpx.AsyncClient(base_url=base) as client:
            await client.post(
                f"/api/elc/devices/{_dev()}/relay", json={"state": True}
            )

        raw_a = await asyncio.wait_for(ws_a.recv(), timeout=2.0)
        raw_b = await asyncio.wait_for(ws_b.recv(), timeout=2.0)
        ev_a = json.loads(raw_a)
        ev_b = json.loads(raw_b)
        assert ev_a == ev_b
        assert ev_a["device"] == "SRM/1/77/0"


async def test_ws_disconnect_releases_subscription(e2e, mock_scu_server) -> None:
    """Closing a WS must unsubscribe from the replica."""
    stack, server = e2e
    ws_url = f"ws://127.0.0.1:{server.port}/ws/elc/events"

    initial = stack.replica.events.subscriber_count
    async with websockets.connect(ws_url):
        # Briefly let the handler run + subscribe.
        deadline = asyncio.get_event_loop().time() + 1.0
        while (
            stack.replica.events.subscriber_count <= initial
            and asyncio.get_event_loop().time() < deadline
        ):
            await asyncio.sleep(0.02)
        assert stack.replica.events.subscriber_count == initial + 1
    # After context exit, the subscriber must be gone.
    deadline = asyncio.get_event_loop().time() + 1.0
    while (
        stack.replica.events.subscriber_count != initial
        and asyncio.get_event_loop().time() < deadline
    ):
        await asyncio.sleep(0.02)
    assert stack.replica.events.subscriber_count == initial
