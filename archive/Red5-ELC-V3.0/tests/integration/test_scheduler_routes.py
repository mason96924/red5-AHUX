"""Integration test: scheduler REST endpoints wired into the ELC stack.

Verifies:
  * GET  /api/elc/scheduler/status returns running=false initially.
  * POST /api/elc/scheduler/start flips running=true.
  * POST /api/elc/scheduler/stop flips it back.
  * POST /api/elc/scheduler/tick runs an evaluation pass and returns
    the dispatch list.

Uses the FastAPI TestClient against build_stack() so this catches
router-wiring regressions (e.g. someone re-mounts routes and swallows
the /scheduler/* prefix).
"""
from __future__ import annotations

import os
import tempfile

import pytest
from fastapi.testclient import TestClient

from elc.api import build_stack
from elc.config import store as cs


@pytest.fixture()
def stack_client():
    with tempfile.TemporaryDirectory() as tmp:
        db_path = os.path.join(tmp, "elc.db")
        cs.init(db_path)
        # Point at a bogus SCU port -- link stays DISCONNECTED, but the
        # scheduler routes don't touch it, so the router still answers.
        stack = build_stack(
            host="127.0.0.1", port=1, config_db_path=db_path,
        )
        with TestClient(stack.app) as client:
            yield client, stack, db_path


class TestSchedulerRoutes:
    def test_status_initially_stopped(self, stack_client) -> None:
        client, _, _ = stack_client
        r = client.get("/api/elc/scheduler/status")
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["running"] is False
        assert body["tick_seconds"] == 30.0

    def test_start_stop(self, stack_client) -> None:
        client, _, _ = stack_client
        r = client.post("/api/elc/scheduler/start")
        assert r.status_code == 200, r.text
        assert r.json()["running"] is True

        r = client.get("/api/elc/scheduler/status")
        assert r.json()["running"] is True

        r = client.post("/api/elc/scheduler/stop")
        assert r.status_code == 200
        assert r.json()["running"] is False

    def test_tick_returns_dispatch_list(self, stack_client) -> None:
        client, _, _ = stack_client
        # No schedules seeded → empty list, but shape is correct.
        r = client.post("/api/elc/scheduler/tick")
        assert r.status_code == 200, r.text
        body = r.json()
        assert "dispatches" in body
        assert isinstance(body["dispatches"], list)
        assert body["dispatches"] == []
