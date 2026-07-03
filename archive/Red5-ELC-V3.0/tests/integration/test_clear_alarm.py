"""Phase 3 aligner acknowledge — POST /api/elc/devices/{id}/clear-alarm.

The operator UI shows a fail_report as a *sticky* red alarm on the
device tile.  This test pins the semantics of the acknowledge route
that clears it:

  * A device that's never alarmed → cleared=False, no snapshot invented.
  * A device with an alarm → cleared=True, snapshot's last_fail_code
    is None afterwards, and an `alarm_cleared` event is published so
    every open operator view drops the red border.
  * Second consecutive click on the same device → cleared=False
    (idempotent no-op, no event).
"""
from __future__ import annotations

import httpx
import pytest

from elc.api import build_stack
from elc.codec.device_id import DeviceId, DeviceType
from elc.codec.messages import FailReport

pytestmark = pytest.mark.asyncio


def _dev(addr: int = 10) -> DeviceId:
    return DeviceId(dev_type=DeviceType.SRM, scu=1, address=addr, sub_address=0)


@pytest.fixture
async def stack(mock_scu_server):
    stack = build_stack(
        "127.0.0.1", mock_scu_server.port, name="test", initial_backoff=0.05,
    )
    await stack.link.start()
    await stack.link.wait_connected(timeout=2.0)
    try:
        yield stack
    finally:
        await stack.link.stop()


class TestClearAlarm:
    async def test_clear_when_no_snapshot_returns_cleared_false(self, stack):
        transport = httpx.ASGITransport(app=stack.app)
        async with httpx.AsyncClient(
            transport=transport, base_url="http://test",
        ) as c:
            r = await c.post("/api/elc/devices/SRM/1/99/0/clear-alarm")
        assert r.status_code == 200
        body = r.json()
        assert body["ok"] is True
        assert body["cleared"] is False
        assert body["device"] == "SRM/1/99/0"

    async def test_clear_active_alarm(self, stack):
        # Inject a fail_report directly into the replica (no need to
        # round-trip through the mock SCU, which doesn't emit FailReport).
        dev = _dev(10)
        await stack.replica._on_fail(  # noqa: SLF001
            FailReport(device=dev, fail_code=17, detail=b"overtemp"),
        )
        snap = stack.replica.get(dev)
        assert snap is not None and snap.last_fail_code == 17

        # Capture the alarm_cleared event.
        seen: list[dict] = []
        stack.replica.events.subscribe(seen.append)

        transport = httpx.ASGITransport(app=stack.app)
        async with httpx.AsyncClient(
            transport=transport, base_url="http://test",
        ) as c:
            r = await c.post(f"/api/elc/devices/{dev}/clear-alarm")
        assert r.status_code == 200
        body = r.json()
        assert body["cleared"] is True

        snap = stack.replica.get(dev)
        assert snap is not None and snap.last_fail_code is None

        cleared_events = [e for e in seen if e["type"] == "alarm_cleared"]
        assert len(cleared_events) == 1
        assert cleared_events[0]["device"] == str(dev)

    async def test_clear_is_idempotent(self, stack):
        dev = _dev(20)
        await stack.replica._on_fail(  # noqa: SLF001
            FailReport(device=dev, fail_code=9, detail=b""),
        )

        transport = httpx.ASGITransport(app=stack.app)
        async with httpx.AsyncClient(
            transport=transport, base_url="http://test",
        ) as c:
            r1 = await c.post(f"/api/elc/devices/{dev}/clear-alarm")
            r2 = await c.post(f"/api/elc/devices/{dev}/clear-alarm")

        assert r1.json()["cleared"] is True
        assert r2.json()["cleared"] is False

    async def test_bad_device_id_returns_400(self, stack):
        transport = httpx.ASGITransport(app=stack.app)
        async with httpx.AsyncClient(
            transport=transport, base_url="http://test",
        ) as c:
            r = await c.post("/api/elc/devices/not-a-device/clear-alarm")
        assert r.status_code == 400
