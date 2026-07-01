"""Calendar + holiday/event evaluator-gate tests."""
from __future__ import annotations

import os
import tempfile

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from freezegun import freeze_time

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
# Calendar CRUD
# ---------------------------------------------------------------------------
class TestCalendarCRUD:
    def test_empty_by_default(self, client):
        r = client.get("/api/elc/calendar")
        assert r.status_code == 200
        assert r.json() == {"days": []}

    def test_add_and_list_holiday(self, client):
        r = client.post("/api/elc/calendar", json={
            "date": "2026-12-25", "label": "Christmas", "kind": "holiday",
        })
        assert r.status_code == 201, r.text
        eid = r.json()["id"]
        r2 = client.get("/api/elc/calendar")
        assert len(r2.json()["days"]) == 1
        assert r2.json()["days"][0]["id"] == eid

    def test_add_event_day(self, client):
        r = client.post("/api/elc/calendar", json={
            "date": "2026-07-04", "label": "Grand Opening", "kind": "event",
        })
        assert r.status_code == 201
        r2 = client.get("/api/elc/calendar?kind=event")
        assert len(r2.json()["days"]) == 1
        r3 = client.get("/api/elc/calendar?kind=holiday")
        assert r3.json()["days"] == []

    def test_duplicate_same_date_and_kind_rejected(self, client):
        client.post("/api/elc/calendar", json={
            "date": "2026-12-25", "label": "Christmas", "kind": "holiday",
        })
        r = client.post("/api/elc/calendar", json={
            "date": "2026-12-25", "label": "Christmas Day", "kind": "holiday",
        })
        assert r.status_code == 409

    def test_same_date_different_kind_ok(self, client):
        """A date can be both a holiday and an event (event beats
        holiday in the evaluator)."""
        client.post("/api/elc/calendar", json={
            "date": "2026-12-25", "label": "Christmas", "kind": "holiday",
        })
        r = client.post("/api/elc/calendar", json={
            "date": "2026-12-25", "label": "Late-shift party", "kind": "event",
        })
        assert r.status_code == 201

    def test_delete(self, client):
        eid = client.post("/api/elc/calendar", json={
            "date": "2026-12-25", "label": "Christmas", "kind": "holiday",
        }).json()["id"]
        r = client.delete(f"/api/elc/calendar/{eid}")
        assert r.status_code == 204
        assert client.get("/api/elc/calendar").json()["days"] == []

    def test_delete_unknown_404(self, client):
        r = client.delete("/api/elc/calendar/deadbeef")
        assert r.status_code == 404

    def test_reject_bad_date(self, client):
        r = client.post("/api/elc/calendar", json={
            "date": "not-a-date", "label": "x", "kind": "holiday",
        })
        assert r.status_code == 400

    def test_reject_bad_kind(self, client):
        r = client.post("/api/elc/calendar", json={
            "date": "2026-12-25", "label": "x", "kind": "birthday",
        })
        assert r.status_code == 400

    def test_reject_empty_label(self, client):
        r = client.post("/api/elc/calendar", json={
            "date": "2026-12-25", "label": "   ", "kind": "holiday",
        })
        assert r.status_code == 400


# ---------------------------------------------------------------------------
# Suggest holidays (uses the `holidays` library, offline)
# ---------------------------------------------------------------------------
class TestSuggestHolidays:
    def test_us_2026_includes_christmas(self, client):
        r = client.post("/api/elc/calendar/suggest-holidays", json={
            "country": "US", "year": 2026,
        })
        assert r.status_code == 200
        dates = {h["date"] for h in r.json()["holidays"]}
        assert "2026-12-25" in dates
        assert "2026-07-04" in dates  # Independence Day

    def test_in_2026_includes_republic_day(self, client):
        r = client.post("/api/elc/calendar/suggest-holidays", json={
            "country": "IN", "year": 2026,
        })
        assert r.status_code == 200
        dates = {h["date"] for h in r.json()["holidays"]}
        assert "2026-01-26" in dates  # Republic Day

    def test_unknown_country(self, client):
        r = client.post("/api/elc/calendar/suggest-holidays", json={
            "country": "ZZ", "year": 2026,
        })
        assert r.status_code == 400

    def test_bad_year(self, client):
        r = client.post("/api/elc/calendar/suggest-holidays", json={
            "country": "US", "year": 1000,
        })
        assert r.status_code == 400

    def test_bulk_add_from_suggestion(self, client):
        # Ideal flow: suggest → pick some → bulk add.
        suggested = client.post("/api/elc/calendar/suggest-holidays", json={
            "country": "US", "year": 2026,
        }).json()["holidays"][:3]
        entries = [dict(kind="holiday", **h) for h in suggested]
        r = client.post("/api/elc/calendar/bulk", json={"entries": entries})
        assert r.status_code == 201
        assert len(r.json()["inserted"]) == 3
        # Re-run is idempotent — skips duplicates instead of 409-ing.
        r2 = client.post("/api/elc/calendar/bulk", json={"entries": entries})
        assert r2.status_code == 201
        assert r2.json()["inserted"] == []
        assert r2.json()["skipped"] == 3


# ---------------------------------------------------------------------------
# Evaluator gates -- holidays skip, events override day-of-week
# ---------------------------------------------------------------------------
class TestHolidayEventGates:
    """Uses the /preview endpoint end-to-end so we exercise the whole
    chain (routes → store → evaluator context building → gate logic).

    Time frozen to 2026-02-01 so the assertions about Feb 2026 dates
    stay stable regardless of when CI runs the suite.
    """

    def _setup_la_with_calendar(self, client):
        client.patch("/api/elc/settings", json={
            "latitude": 34.05, "longitude": -118.24,
            "timezone": "America/Los_Angeles",
        })

    @freeze_time("2026-02-01T00:00:00+00:00")
    def test_skip_holidays_default_on_removes_that_date(self, client):
        self._setup_la_with_calendar(client)
        # Add 2026-02-04 (a Wednesday) as a holiday.
        client.post("/api/elc/calendar", json={
            "date": "2026-02-04", "label": "Test holiday", "kind": "holiday",
        })
        # TOD-08:00 mon-fri.
        sid = client.post("/api/elc/schedules", json={
            "name": "S", "color": "#ffffff", "rules": {
                "trigger": {"type": "tod", "at": "08:00"},
                "action": "on",
                "days": ["mon", "tue", "wed", "thu", "fri"],
            },
        }).json()["id"]
        # Ask for a bunch of firings; verify 2026-02-04 is NOT among them.
        r = client.post(f"/api/elc/schedules/{sid}/preview", json={"count": 10})
        assert r.status_code == 200
        local_dates = {f["at_local"][:10] for f in r.json()["firings"]}
        assert "2026-02-04" not in local_dates

    @freeze_time("2026-02-01T00:00:00+00:00")
    def test_skip_holidays_off_keeps_the_date(self, client):
        self._setup_la_with_calendar(client)
        client.post("/api/elc/calendar", json={
            "date": "2026-02-04", "label": "Test holiday", "kind": "holiday",
        })
        sid = client.post("/api/elc/schedules", json={
            "name": "S2", "color": "#ffffff", "rules": {
                "trigger": {"type": "tod", "at": "08:00"},
                "action": "on",
                "days": ["mon", "tue", "wed", "thu", "fri"],
                "skip_holidays": False,  # explicit override
            },
        }).json()["id"]
        r = client.post(f"/api/elc/schedules/{sid}/preview", json={"count": 10})
        local_dates = {f["at_local"][:10] for f in r.json()["firings"]}
        assert "2026-02-04" in local_dates

    @freeze_time("2026-02-01T00:00:00+00:00")
    def test_event_day_overrides_day_of_week_gate(self, client):
        self._setup_la_with_calendar(client)
        # 2026-02-07 is a Saturday.  Mark it as an event day.
        client.post("/api/elc/calendar", json={
            "date": "2026-02-07", "label": "Sat Special", "kind": "event",
        })
        sid = client.post("/api/elc/schedules", json={
            "name": "S3", "color": "#ffffff", "rules": {
                "trigger": {"type": "tod", "at": "08:00"},
                "action": "on",
                "days": ["mon", "tue", "wed", "thu", "fri"],  # excludes Sat
                "include_events": True,
            },
        }).json()["id"]
        r = client.post(f"/api/elc/schedules/{sid}/preview", json={"count": 10})
        local_dates = {f["at_local"][:10] for f in r.json()["firings"]}
        assert "2026-02-07" in local_dates

    @freeze_time("2026-02-01T00:00:00+00:00")
    def test_event_beats_holiday_when_both_set(self, client):
        self._setup_la_with_calendar(client)
        # 2026-02-07 is a Saturday -- add both flags.
        client.post("/api/elc/calendar", json={
            "date": "2026-02-07", "label": "H", "kind": "holiday",
        })
        client.post("/api/elc/calendar", json={
            "date": "2026-02-07", "label": "E", "kind": "event",
        })
        sid = client.post("/api/elc/schedules", json={
            "name": "S4", "color": "#ffffff", "rules": {
                "trigger": {"type": "tod", "at": "08:00"},
                "action": "on",
                # every day of week (no `days` field)
                "include_events": True,   # event beats holiday
            },
        }).json()["id"]
        r = client.post(f"/api/elc/schedules/{sid}/preview", json={"count": 10})
        local_dates = {f["at_local"][:10] for f in r.json()["firings"]}
        assert "2026-02-07" in local_dates
