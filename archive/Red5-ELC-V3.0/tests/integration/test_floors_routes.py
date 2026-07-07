"""Phase 6.1 floors HTTP surface — full CRUD + DXF upload via TestClient.

Exercises the router through the real FastAPI stack so route ordering,
body parsing, and error-code mapping all get validated end-to-end.
"""
from __future__ import annotations

import io
import os
import tempfile

import ezdxf
import pytest
from fastapi.testclient import TestClient

from elc.api import build_stack
from elc.config import store as cs


@pytest.fixture
def client_and_db():
    with tempfile.TemporaryDirectory() as tmp:
        db_path = os.path.join(tmp, "elc.db")
        cs.init(db_path)
        stack = build_stack("127.0.0.1", 1, config_db_path=db_path)
        with TestClient(stack.app) as c:
            yield c, db_path


def _make_dxf(width: int = 5000, height: int = 3000) -> bytes:
    doc = ezdxf.new()
    msp = doc.modelspace()
    msp.add_line((0, 0), (width, 0))
    msp.add_line((width, 0), (width, height))
    msp.add_line((width, height), (0, height))
    msp.add_line((0, height), (0, 0))
    doc.header["$INSUNITS"] = 4  # mm
    buf = io.StringIO()
    doc.write(buf)
    return buf.getvalue().encode("utf-8")


def _make_dxf_with_rooms() -> bytes:
    """DXF with two closed room polygons on the ROOMS layer + an
    exterior outline so extents work."""
    doc = ezdxf.new()
    msp = doc.modelspace()
    # outer envelope
    msp.add_lwpolyline(
        [(0, 0), (10_000, 0), (10_000, 6_000), (0, 6_000)],
        close=True,
    )
    doc.layers.add(name="ROOMS", color=3)
    msp.add_lwpolyline(
        [(0, 0), (5_000, 0), (5_000, 6_000), (0, 6_000)],
        close=True, dxfattribs={"layer": "ROOMS"},
    )
    msp.add_lwpolyline(
        [(5_000, 0), (10_000, 0), (10_000, 6_000), (5_000, 6_000)],
        close=True, dxfattribs={"layer": "ROOMS"},
    )
    doc.header["$INSUNITS"] = 4
    buf = io.StringIO()
    doc.write(buf)
    return buf.getvalue().encode("utf-8")


class TestCrud:
    def test_list_empty(self, client_and_db):
        c, _ = client_and_db
        r = c.get("/api/elc/floors")
        assert r.status_code == 200
        assert r.json() == {"floors": []}

    def test_create_minimal(self, client_and_db):
        c, _ = client_and_db
        r = c.post("/api/elc/floors", json={"name": "Lobby"})
        assert r.status_code == 201, r.text
        body = r.json()
        assert body["name"] == "Lobby"
        assert body["width_m"] == 20.0

    def test_create_duplicate_returns_409(self, client_and_db):
        c, _ = client_and_db
        c.post("/api/elc/floors", json={"name": "X"})
        r = c.post("/api/elc/floors", json={"name": "X"})
        assert r.status_code == 409

    def test_create_empty_name_returns_400(self, client_and_db):
        c, _ = client_and_db
        r = c.post("/api/elc/floors", json={"name": ""})
        assert r.status_code == 400

    def test_get_returns_svg_and_fixtures(self, client_and_db):
        c, _ = client_and_db
        created = c.post("/api/elc/floors", json={
            "name": "Zone",
            "svg": "<svg><rect/></svg>",
            "fixtures": [
                {"id": "L1", "device_id": "SRM/1/10/0", "x_m": 2.0, "y_m": 3.0},
            ],
        }).json()
        r = c.get(f"/api/elc/floors/{created['id']}")
        assert r.status_code == 200
        body = r.json()
        assert body["svg"] == "<svg><rect/></svg>"
        assert body["fixtures"][0]["id"] == "L1"

    def test_list_omits_svg(self, client_and_db):
        c, _ = client_and_db
        c.post("/api/elc/floors", json={"name": "A", "svg": "<svg>heavy</svg>"})
        r = c.get("/api/elc/floors")
        assert r.status_code == 200
        assert r.json()["floors"][0]["svg"] == ""

    def test_background_svg_endpoint(self, client_and_db):
        c, _ = client_and_db
        created = c.post("/api/elc/floors", json={
            "name": "A", "svg": "<svg id='p'/>",
        }).json()
        r = c.get(f"/api/elc/floors/{created['id']}/background.svg")
        assert r.status_code == 200
        assert r.headers["content-type"].startswith("image/svg+xml")
        assert r.text == "<svg id='p'/>"

    def test_patch(self, client_and_db):
        c, _ = client_and_db
        f = c.post("/api/elc/floors", json={"name": "A"}).json()
        r = c.patch(f"/api/elc/floors/{f['id']}", json={
            "width_m": 40, "fixtures": [
                {"id": "L1", "device_id": "SRM/1/1/0", "x_m": 1, "y_m": 1},
            ],
        })
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["width_m"] == 40
        assert len(body["fixtures"]) == 1

    def test_patch_missing_returns_404(self, client_and_db):
        c, _ = client_and_db
        r = c.patch("/api/elc/floors/nope", json={"name": "X"})
        assert r.status_code == 404

    def test_delete(self, client_and_db):
        c, _ = client_and_db
        f = c.post("/api/elc/floors", json={"name": "A"}).json()
        r = c.delete(f"/api/elc/floors/{f['id']}")
        assert r.status_code == 204
        assert c.get(f"/api/elc/floors/{f['id']}").status_code == 404


class TestDxfImport:
    def test_happy_path(self, client_and_db):
        c, _ = client_and_db
        dxf = _make_dxf(width=6000, height=4000)
        r = c.post(
            "/api/elc/floors/import-dxf",
            data={"name": "Imported"},
            files={"dxf": ("plan.dxf", dxf, "application/octet-stream")},
        )
        assert r.status_code == 201, r.text
        body = r.json()
        assert body["name"] == "Imported"
        assert body["width_m"] == pytest.approx(6.0, rel=1e-3)
        assert body["height_m"] == pytest.approx(4.0, rel=1e-3)
        # SVG made it into storage.
        r2 = c.get(f"/api/elc/floors/{body['id']}/background.svg")
        assert r2.status_code == 200
        assert len(r2.text) > 100

    def test_garbage_upload_400(self, client_and_db):
        c, _ = client_and_db
        r = c.post(
            "/api/elc/floors/import-dxf",
            data={"name": "Bad"},
            files={"dxf": ("junk.dxf", b"not a DXF", "application/octet-stream")},
        )
        assert r.status_code == 400

    def test_duplicate_name_from_dxf(self, client_and_db):
        c, _ = client_and_db
        c.post("/api/elc/floors", json={"name": "Dup"})
        dxf = _make_dxf()
        r = c.post(
            "/api/elc/floors/import-dxf",
            data={"name": "Dup"},
            files={"dxf": ("p.dxf", dxf, "application/octet-stream")},
        )
        assert r.status_code == 409

    def test_dxf_rooms_land_on_floor(self, client_and_db):
        """A DXF that carries closed LWPOLYLINEs on the ROOMS layer
        must surface those polygons on the created floor so the
        frontend canvas can clip light gradients to room boundaries."""
        c, _ = client_and_db
        r = c.post(
            "/api/elc/floors/import-dxf",
            data={"name": "TwoRooms"},
            files={"dxf": ("p.dxf", _make_dxf_with_rooms(),
                           "application/octet-stream")},
        )
        assert r.status_code == 201, r.text
        body = r.json()
        assert len(body["rooms"]) == 2
        for room in body["rooms"]:
            assert len(room["vertices"]) == 4
            for (x_m, y_m) in room["vertices"]:
                assert 0 - 1e-6 <= x_m <= 10.0 + 1e-6
                assert 0 - 1e-6 <= y_m <= 6.0 + 1e-6
