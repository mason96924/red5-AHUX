"""Settings + Schedule Preview endpoint tests (Phase 4)."""
from __future__ import annotations

import os
import tempfile

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from elc.config.routes import build_config_router


@pytest.fixture()
def client():
    with tempfile.TemporaryDirectory() as tmp:
        db_path = os.path.join(tmp, "elc.db")
        app = FastAPI()
        app.include_router(build_config_router(db_path=db_path), prefix="/api/elc")
        with TestClient(app) as c:
            yield c


# ---------------------------------------------------------------------------
# Settings
# ---------------------------------------------------------------------------
class TestSettings:
    def test_defaults_returned_on_empty_db(self, client):
        r = client.get("/api/elc/settings")
        assert r.status_code == 200
        s = r.json()["settings"]
        assert s["latitude"] == "0.0"
        assert s["longitude"] == "0.0"
        assert s["timezone"] == "UTC"
        assert s["engine_mode"] == "dry_run"

    def test_patch_persists(self, client):
        r = client.patch("/api/elc/settings", json={
            "latitude": 34.05,
            "longitude": -118.24,
            "timezone": "America/Los_Angeles",
        })
        assert r.status_code == 200
        s = r.json()["settings"]
        assert float(s["latitude"]) == pytest.approx(34.05)
        assert s["timezone"] == "America/Los_Angeles"

        r2 = client.get("/api/elc/settings")
        assert r2.json()["settings"]["latitude"] == "34.05"

    def test_rejects_bad_latitude(self, client):
        r = client.patch("/api/elc/settings", json={"latitude": 999})
        assert r.status_code == 400
        assert "latitude" in r.json()["detail"]

    def test_rejects_unknown_setting(self, client):
        r = client.patch("/api/elc/settings", json={"nuclear_option": True})
        assert r.status_code == 400
        assert "unknown" in r.json()["detail"]

    def test_rejects_bad_engine_mode(self, client):
        r = client.patch("/api/elc/settings", json={"engine_mode": "yolo"})
        assert r.status_code == 400


# ---------------------------------------------------------------------------
# Schedule rule validation on create/update
# ---------------------------------------------------------------------------
class TestScheduleRuleValidation:
    def test_valid_tod_rule_accepted(self, client):
        r = client.post("/api/elc/schedules", json={
            "name": "Weekday Morning",
            "color": "#38bdf8",
            "rules": {
                "trigger": {"type": "tod", "at": "08:00"},
                "action": "on",
                "days": ["mon", "tue", "wed", "thu", "fri"],
            },
        })
        assert r.status_code == 201, r.text

    def test_invalid_rule_rejected(self, client):
        r = client.post("/api/elc/schedules", json={
            "name": "Broken",
            "color": "#38bdf8",
            "rules": {"trigger": {"type": "eclipse"}, "action": "on"},
        })
        assert r.status_code == 400

    def test_null_rules_still_ok(self, client):
        # Schedules can be created without rules (Phase 2 UI does this).
        r = client.post("/api/elc/schedules", json={
            "name": "Empty",
            "color": "#38bdf8",
            "rules": None,
        })
        assert r.status_code == 201

    def test_patch_validates_new_rules(self, client):
        r = client.post("/api/elc/schedules", json={
            "name": "S1", "color": "#38bdf8", "rules": None,
        })
        sid = r.json()["id"]
        r = client.patch(f"/api/elc/schedules/{sid}", json={
            "rules": {"trigger": {"type": "tod", "at": "25:99"}, "action": "on"},
        })
        assert r.status_code == 400


# ---------------------------------------------------------------------------
# Preview endpoint
# ---------------------------------------------------------------------------
class TestPreview:
    def _make_schedule_with_rule(self, client, rule):
        r = client.post("/api/elc/schedules", json={
            "name": "P1", "color": "#38bdf8", "rules": rule,
        })
        assert r.status_code == 201, r.text
        return r.json()["id"]

    def test_preview_tod_returns_firings(self, client):
        # Configure LA location up front.
        client.patch("/api/elc/settings", json={
            "latitude": 34.05,
            "longitude": -118.24,
            "timezone": "America/Los_Angeles",
        })
        sid = self._make_schedule_with_rule(client, {
            "trigger": {"type": "tod", "at": "08:00"}, "action": "on",
        })
        r = client.post(f"/api/elc/schedules/{sid}/preview", json={"count": 3})
        assert r.status_code == 200
        body = r.json()
        assert body["schedule_id"] == sid
        assert len(body["firings"]) == 3
        for f in body["firings"]:
            assert f["action"] == "on"
            assert "at" in f and "at_local" in f
            assert ":" in f["at_local"]

    def test_preview_null_rules_returns_notice(self, client):
        sid = self._make_schedule_with_rule(client, None)
        r = client.post(f"/api/elc/schedules/{sid}/preview")
        assert r.status_code == 200
        assert r.json()["firings"] == []
        assert "notice" in r.json()

    def test_preview_body_overrides_stored_settings(self, client):
        sid = self._make_schedule_with_rule(client, {
            "trigger": {"type": "sunrise"}, "action": "on",
        })
        # Global timezone still UTC; override to LA for what-if preview.
        r = client.post(f"/api/elc/schedules/{sid}/preview", json={
            "latitude": 34.05,
            "longitude": -118.24,
            "timezone": "America/Los_Angeles",
            "weather_enabled": False,
            "count": 1,
        })
        assert r.status_code == 200
        body = r.json()
        assert body["location"]["timezone"] == "America/Los_Angeles"
        assert len(body["firings"]) == 1

    def test_preview_bad_timezone_returns_400(self, client):
        sid = self._make_schedule_with_rule(client, {
            "trigger": {"type": "sunrise"}, "action": "on",
        })
        r = client.post(f"/api/elc/schedules/{sid}/preview", json={
            "timezone": "Mars/Olympus_Mons",
        })
        assert r.status_code == 400

    def test_preview_404_for_unknown_schedule(self, client):
        r = client.post("/api/elc/schedules/deadbeef/preview")
        assert r.status_code == 404
