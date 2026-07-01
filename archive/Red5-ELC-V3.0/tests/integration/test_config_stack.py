"""Composition test — config router mounts cleanly alongside the
device / relay / broadcast REST routes inside `build_stack()`.

Guards against two regressions:
  * Route-prefix collision under `/api/elc/*` when both routers ship
    handlers at that root (e.g. `/devices/{id}` vs
    `/devices/{did:path}/schedules`).
  * `build_config_router()` not being invoked (silent config outage
    where the tests in `tests/config/` still pass but the composed
    app never exposes the endpoints).
"""
from __future__ import annotations

import os
import tempfile

import httpx
import pytest

from elc.api import build_stack

pytestmark = pytest.mark.asyncio


@pytest.fixture
async def stack_with_config():
    """Stack built without starting the link — config routes are
    stateless w.r.t. the SCU, and starting the link isn't required
    to exercise the sqlite-backed handlers.
    """
    with tempfile.TemporaryDirectory() as tmp:
        db_path = os.path.join(tmp, "elc_config.db")
        stack = build_stack(
            "127.0.0.1", 9,  # port 9 (discard) — link stays DOWN
            name="config-test",
            initial_backoff=0.05,
            config_db_path=db_path,
        )
        yield stack


@pytest.fixture
async def client(stack_with_config):
    transport = httpx.ASGITransport(app=stack_with_config.app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


async def test_config_routes_reachable_via_full_stack(client) -> None:
    """A CRUD round-trip proves the router is mounted at /api/elc."""
    r = await client.get("/api/elc/groups")
    assert r.status_code == 200
    assert r.json() == {"groups": []}

    r = await client.post(
        "/api/elc/groups", json={"name": "Stage-Left", "color": "#22c55e"}
    )
    assert r.status_code == 201, r.text
    gid = r.json()["id"]

    r = await client.get("/api/elc/groups")
    assert any(g["id"] == gid for g in r.json()["groups"])


async def test_existing_rest_routes_still_work(client) -> None:
    """`/api/elc/link` is served by the existing REST router — verifies
    no route-prefix collision or override by the new config router.
    """
    r = await client.get("/api/elc/link")
    assert r.status_code == 200
    body = r.json()
    assert set(body.keys()) == {"name", "host", "port", "state", "connect_attempts"}
    assert body["name"] == "config-test"


async def test_device_schedules_join_endpoint_wired(client) -> None:
    """The path-form `/api/elc/devices/{did:path}/schedules` sits
    under the same prefix as the REST driver's `/devices/{id}` — this
    catches a `:path` greediness or route-order regression.
    """
    r = await client.get("/api/elc/devices/SRM/1/1/1/schedules")
    assert r.status_code == 200
    body = r.json()
    assert body["device_id"] == "SRM/1/1/1"
    assert body["schedules"] == []
