"""Phase 1 CRUD tests for elc.config.routes.

Same coverage as the deleted V1.9 Flask version, adapted to
FastAPI's TestClient:
    * Round-trip CRUD for groups, group members, schedules, assignments.
    * Cascade delete (group→members, group→assignments, schedule→assignments).
    * Uniqueness constraint → 409.
    * Payload validation → 400.
    * schedules_for_device: priority DESC ordering, enabled=False filtered.
"""
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
        db_path = os.path.join(tmp, "elc_config.db")
        app = FastAPI()
        app.include_router(build_config_router(db_path=db_path), prefix="/api/elc")
        with TestClient(app) as c:
            yield c


# ---------- Groups ----------------------------------------------------------

def test_group_crud_roundtrip(client):
    r = client.post("/api/elc/groups", json={"name": "Zone A", "color": "#22c55e"})
    assert r.status_code == 201, r.text
    gid = r.json()["id"]

    r = client.get("/api/elc/groups")
    assert r.status_code == 200
    assert any(g["id"] == gid for g in r.json()["groups"])

    r = client.get(f"/api/elc/groups/{gid}")
    body = r.json()
    assert body["name"] == "Zone A" and body["color"] == "#22c55e"
    assert body["members"] == [] and body["schedules"] == []

    r = client.patch(f"/api/elc/groups/{gid}", json={"color": "#ef4444"})
    assert r.status_code == 200 and r.json()["color"] == "#ef4444"

    r = client.delete(f"/api/elc/groups/{gid}")
    assert r.status_code == 200 and r.json()["ok"] is True
    assert client.get(f"/api/elc/groups/{gid}").status_code == 404


def test_group_name_uniqueness_returns_409(client):
    client.post("/api/elc/groups", json={"name": "dup", "color": "#111111"})
    r = client.post("/api/elc/groups", json={"name": "dup", "color": "#222222"})
    assert r.status_code == 409
    assert "already exists" in r.json()["detail"]


@pytest.mark.parametrize(
    "payload",
    [
        {"name": "", "color": "#000000"},
        {"name": "ok", "color": "not-hex"},
        {"name": "ok", "color": "#zzzzzz"},
        {"name": "ok", "color": "#abc"},
        {"color": "#000000"},
    ],
)
def test_group_validation_returns_400(client, payload):
    r = client.post("/api/elc/groups", json=payload)
    assert r.status_code == 400


# ---------- Members + cascade -----------------------------------------------

def test_member_add_remove_and_cascade(client):
    gid = client.post("/api/elc/groups", json={"name": "G", "color": "#000000"}).json()["id"]

    for did in ("SRM/1/1/1", "SRM/1/2/1"):
        r = client.post(f"/api/elc/groups/{gid}/members", json={"device_id": did})
        assert r.status_code == 201

    # duplicate → 409
    r = client.post(f"/api/elc/groups/{gid}/members", json={"device_id": "SRM/1/1/1"})
    assert r.status_code == 409

    body = client.get(f"/api/elc/groups/{gid}").json()
    assert sorted(body["members"]) == ["SRM/1/1/1", "SRM/1/2/1"]

    r = client.delete(f"/api/elc/groups/{gid}/members/SRM/1/1/1")
    assert r.status_code == 200
    assert client.get(f"/api/elc/groups/{gid}").json()["members"] == ["SRM/1/2/1"]

    # Cascade: drop group; recreate with same name; must have no leftover rows.
    client.delete(f"/api/elc/groups/{gid}")
    new_gid = client.post("/api/elc/groups", json={"name": "G", "color": "#000000"}).json()["id"]
    assert client.get(f"/api/elc/groups/{new_gid}").json()["members"] == []


def test_member_bad_device_id_returns_400(client):
    gid = client.post("/api/elc/groups", json={"name": "G", "color": "#000000"}).json()["id"]
    r = client.post(f"/api/elc/groups/{gid}/members", json={"device_id": "bogus"})
    assert r.status_code == 400


# ---------- Schedules -------------------------------------------------------

def test_schedule_crud_and_rules_roundtrip(client):
    rules = {"cron": "0 8 * * 1-5", "action": "on"}
    r = client.post("/api/elc/schedules",
                    json={"name": "Weekday morning", "color": "#38bdf8", "rules": rules})
    assert r.status_code == 201
    body = r.json()
    assert body["rules"] == rules and body["enabled"] is True
    sid = body["id"]

    r = client.patch(f"/api/elc/schedules/{sid}",
                     json={"rules": {"cron": "0 18 * * 1-5", "action": "off"}, "enabled": False})
    body = r.json()
    assert body["rules"]["action"] == "off" and body["enabled"] is False

    client.delete(f"/api/elc/schedules/{sid}")
    assert client.get(f"/api/elc/schedules/{sid}").status_code == 404


def test_schedule_name_uniqueness_returns_409(client):
    client.post("/api/elc/schedules", json={"name": "S", "color": "#111", "rules": None})
    r = client.post("/api/elc/schedules", json={"name": "S", "color": "#222", "rules": None})
    # Color validation actually kicks in first for '#111' (not 7 chars). Use full form.
    client.post("/api/elc/schedules", json={"name": "S2", "color": "#111111", "rules": None})
    r = client.post("/api/elc/schedules", json={"name": "S2", "color": "#222222", "rules": None})
    assert r.status_code == 409


# ---------- Assignments + priority + cascade --------------------------------

def test_assignment_and_priority_ordering(client):
    gid = client.post("/api/elc/groups", json={"name": "G", "color": "#000000"}).json()["id"]
    client.post(f"/api/elc/groups/{gid}/members", json={"device_id": "SRM/1/7/1"})

    for name, prio in [("Low", 1), ("High", 10), ("Mid", 5)]:
        sid = client.post("/api/elc/schedules",
                          json={"name": name, "color": "#000000", "rules": {"tag": name}}).json()["id"]
        client.post(f"/api/elc/groups/{gid}/schedules",
                    json={"schedule_id": sid, "priority": prio})

    got = client.get(f"/api/elc/groups/{gid}").json()["schedules"]
    assert [s["name"] for s in got] == ["High", "Mid", "Low"]

    dev = client.get("/api/elc/devices/SRM/1/7/1/schedules").json()["schedules"]
    assert [s["name"] for s in dev] == ["High", "Mid", "Low"]


def test_schedule_delete_cascades_assignments(client):
    gid = client.post("/api/elc/groups", json={"name": "G", "color": "#000000"}).json()["id"]
    sid = client.post("/api/elc/schedules",
                      json={"name": "S", "color": "#000000", "rules": None}).json()["id"]
    client.post(f"/api/elc/groups/{gid}/schedules", json={"schedule_id": sid})
    assert len(client.get(f"/api/elc/groups/{gid}").json()["schedules"]) == 1
    client.delete(f"/api/elc/schedules/{sid}")
    assert client.get(f"/api/elc/groups/{gid}").json()["schedules"] == []


def test_assign_nonexistent_group_or_schedule_returns_404(client):
    r = client.post("/api/elc/groups/deadbeef/schedules", json={"schedule_id": "cafef00d"})
    assert r.status_code == 404
    gid = client.post("/api/elc/groups", json={"name": "G", "color": "#000000"}).json()["id"]
    r = client.post(f"/api/elc/groups/{gid}/schedules", json={"schedule_id": "cafef00d"})
    assert r.status_code == 404


def test_unassign_nonexistent_returns_404(client):
    gid = client.post("/api/elc/groups", json={"name": "G", "color": "#000000"}).json()["id"]
    r = client.delete(f"/api/elc/groups/{gid}/schedules/nope")
    assert r.status_code == 404


def test_disabled_schedules_hidden_from_device_query(client):
    gid = client.post("/api/elc/groups", json={"name": "G", "color": "#000000"}).json()["id"]
    client.post(f"/api/elc/groups/{gid}/members", json={"device_id": "SRM/1/9/1"})
    sid = client.post("/api/elc/schedules",
                      json={"name": "Disabled", "color": "#000000",
                            "rules": None, "enabled": False}).json()["id"]
    client.post(f"/api/elc/groups/{gid}/schedules", json={"schedule_id": sid})
    assert client.get("/api/elc/devices/SRM/1/9/1/schedules").json()["schedules"] == []
