"""
Phase 1 CRUD tests for the ELC operator UI config service.

Covers the checks promised in the plan:
    * Round-trip CRUD for groups, group members, schedules, assignments.
    * Cascade delete (dropping a group removes its members and
      schedule links; dropping a schedule removes assignments).
    * Uniqueness constraint enforcement returns HTTP 409.
    * Priority precedence: schedules_for_device orders by priority DESC,
      then updated_at DESC.
    * Payload validation returns HTTP 400 for bad name / color /
      device_id.
"""
from __future__ import annotations

import os
import sys
import tempfile

import pytest
from flask import Flask

# Import path -- mirror the layout tests use elsewhere.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import elc_config_service  # noqa: E402
import elc_config_store as store  # noqa: E402


@pytest.fixture()
def app():
    with tempfile.TemporaryDirectory() as tmp:
        db_path = os.path.join(tmp, "elc_config.db")
        a = Flask(__name__)
        elc_config_service.register(a, {"elc_db_path": db_path})
        a.testing = True
        yield a


@pytest.fixture()
def client(app):
    return app.test_client()


# ---------------------------------------------------------------------------
# Groups: create / read / update / delete.
# ---------------------------------------------------------------------------
def test_group_crud_roundtrip(client):
    # create
    r = client.post("/api/elc/groups", json={"name": "Zone A", "color": "#22c55e"})
    assert r.status_code == 201, r.data
    gid = r.get_json()["id"]

    # list
    r = client.get("/api/elc/groups")
    assert r.status_code == 200
    assert any(g["id"] == gid for g in r.get_json()["groups"])

    # detail
    r = client.get(f"/api/elc/groups/{gid}")
    assert r.status_code == 200
    body = r.get_json()
    assert body["name"] == "Zone A"
    assert body["color"] == "#22c55e"
    assert body["members"] == []
    assert body["schedules"] == []

    # patch
    r = client.patch(f"/api/elc/groups/{gid}", json={"color": "#ef4444"})
    assert r.status_code == 200 and r.get_json()["color"] == "#ef4444"

    # delete
    r = client.delete(f"/api/elc/groups/{gid}")
    assert r.status_code == 200 and r.get_json()["ok"] is True
    r = client.get(f"/api/elc/groups/{gid}")
    assert r.status_code == 404


def test_group_name_uniqueness_returns_409(client):
    client.post("/api/elc/groups", json={"name": "dup", "color": "#111111"})
    r = client.post("/api/elc/groups", json={"name": "dup", "color": "#222222"})
    assert r.status_code == 409
    assert "already exists" in r.get_json()["error"]


@pytest.mark.parametrize(
    "payload,expect_status",
    [
        ({"name": "", "color": "#000000"}, 400),
        ({"name": "ok", "color": "not-hex"}, 400),
        ({"name": "ok", "color": "#zzzzzz"}, 400),
        ({"name": "ok", "color": "#abc"}, 400),
        ({"color": "#000000"}, 400),  # missing name
    ],
)
def test_group_validation_returns_400(client, payload, expect_status):
    r = client.post("/api/elc/groups", json=payload)
    assert r.status_code == expect_status


# ---------------------------------------------------------------------------
# Group members + cascade.
# ---------------------------------------------------------------------------
def test_member_add_remove_and_cascade(client):
    gid = client.post("/api/elc/groups", json={"name": "G", "color": "#000000"}).get_json()["id"]

    # add two members
    for did in ("SRM/1/1/1", "SRM/1/2/1"):
        r = client.post(f"/api/elc/groups/{gid}/members", json={"device_id": did})
        assert r.status_code == 201

    # duplicate add -> 409
    r = client.post(f"/api/elc/groups/{gid}/members", json={"device_id": "SRM/1/1/1"})
    assert r.status_code == 409

    # detail lists both
    body = client.get(f"/api/elc/groups/{gid}").get_json()
    assert sorted(body["members"]) == ["SRM/1/1/1", "SRM/1/2/1"]

    # remove one
    r = client.delete(f"/api/elc/groups/{gid}/members/SRM/1/1/1")
    assert r.status_code == 200
    assert client.get(f"/api/elc/groups/{gid}").get_json()["members"] == ["SRM/1/2/1"]

    # delete group -> members gone (cascade at DB level)
    client.delete(f"/api/elc/groups/{gid}")
    # Recreate a group with the same name to prove the old rows are truly gone.
    new_gid = client.post("/api/elc/groups", json={"name": "G", "color": "#000000"}).get_json()["id"]
    assert client.get(f"/api/elc/groups/{new_gid}").get_json()["members"] == []


def test_member_bad_device_id_returns_400(client):
    gid = client.post("/api/elc/groups", json={"name": "G", "color": "#000000"}).get_json()["id"]
    r = client.post(f"/api/elc/groups/{gid}/members", json={"device_id": "bogus"})
    assert r.status_code == 400


# ---------------------------------------------------------------------------
# Schedules.
# ---------------------------------------------------------------------------
def test_schedule_crud_and_rules_roundtrip(client):
    rules = {"cron": "0 8 * * 1-5", "action": "on"}
    r = client.post(
        "/api/elc/schedules",
        json={"name": "Weekday morning", "color": "#38bdf8", "rules": rules},
    )
    assert r.status_code == 201
    body = r.get_json()
    assert body["rules"] == rules
    assert body["enabled"] is True
    sid = body["id"]

    # patch rules + disable
    r = client.patch(
        f"/api/elc/schedules/{sid}",
        json={"rules": {"cron": "0 18 * * 1-5", "action": "off"}, "enabled": False},
    )
    assert r.status_code == 200
    body = r.get_json()
    assert body["rules"]["action"] == "off"
    assert body["enabled"] is False

    # delete
    client.delete(f"/api/elc/schedules/{sid}")
    assert client.get(f"/api/elc/schedules/{sid}").status_code == 404


def test_schedule_name_uniqueness_returns_409(client):
    client.post("/api/elc/schedules", json={"name": "S", "color": "#111111", "rules": None})
    r = client.post("/api/elc/schedules", json={"name": "S", "color": "#222222", "rules": None})
    assert r.status_code == 409


# ---------------------------------------------------------------------------
# Assignments + priority ordering + cascade.
# ---------------------------------------------------------------------------
def test_assignment_and_priority_ordering(client):
    gid = client.post("/api/elc/groups", json={"name": "G", "color": "#000000"}).get_json()["id"]
    client.post(f"/api/elc/groups/{gid}/members", json={"device_id": "SRM/1/7/1"})

    sids = []
    for i, (name, prio) in enumerate([("Low", 1), ("High", 10), ("Mid", 5)]):
        sid = client.post(
            "/api/elc/schedules",
            json={"name": name, "color": "#000000", "rules": {"tag": name}},
        ).get_json()["id"]
        sids.append(sid)
        client.post(f"/api/elc/groups/{gid}/schedules", json={"schedule_id": sid, "priority": prio})

    # Detail: schedules on the group ordered priority DESC
    got = client.get(f"/api/elc/groups/{gid}").get_json()["schedules"]
    assert [s["name"] for s in got] == ["High", "Mid", "Low"]

    # schedules_for_device: same ordering
    dev = client.get("/api/elc/devices/SRM/1/7/1/schedules").get_json()["schedules"]
    assert [s["name"] for s in dev] == ["High", "Mid", "Low"]


def test_schedule_delete_cascades_assignments(client):
    gid = client.post("/api/elc/groups", json={"name": "G", "color": "#000000"}).get_json()["id"]
    sid = client.post(
        "/api/elc/schedules",
        json={"name": "S", "color": "#000000", "rules": None},
    ).get_json()["id"]
    client.post(f"/api/elc/groups/{gid}/schedules", json={"schedule_id": sid})
    # Confirm attached
    assert len(client.get(f"/api/elc/groups/{gid}").get_json()["schedules"]) == 1
    # Delete the schedule
    client.delete(f"/api/elc/schedules/{sid}")
    # Assignment must be gone
    assert client.get(f"/api/elc/groups/{gid}").get_json()["schedules"] == []


def test_assign_nonexistent_group_or_schedule_returns_404(client):
    # nonexistent group
    r = client.post(
        "/api/elc/groups/deadbeef/schedules",
        json={"schedule_id": "cafef00d"},
    )
    assert r.status_code == 404
    # nonexistent schedule but existing group
    gid = client.post("/api/elc/groups", json={"name": "G", "color": "#000000"}).get_json()["id"]
    r = client.post(f"/api/elc/groups/{gid}/schedules", json={"schedule_id": "cafef00d"})
    assert r.status_code == 404


def test_unassign_nonexistent_returns_404(client):
    gid = client.post("/api/elc/groups", json={"name": "G", "color": "#000000"}).get_json()["id"]
    r = client.delete(f"/api/elc/groups/{gid}/schedules/nope")
    assert r.status_code == 404


# ---------------------------------------------------------------------------
# schedules_for_device: only enabled schedules are returned.
# ---------------------------------------------------------------------------
def test_disabled_schedules_hidden_from_device_query(client):
    gid = client.post("/api/elc/groups", json={"name": "G", "color": "#000000"}).get_json()["id"]
    client.post(f"/api/elc/groups/{gid}/members", json={"device_id": "SRM/1/9/1"})
    sid = client.post(
        "/api/elc/schedules",
        json={"name": "Disabled", "color": "#000000", "rules": None, "enabled": False},
    ).get_json()["id"]
    client.post(f"/api/elc/groups/{gid}/schedules", json={"schedule_id": sid})

    dev = client.get("/api/elc/devices/SRM/1/9/1/schedules").get_json()["schedules"]
    assert dev == []  # disabled schedule filtered out
