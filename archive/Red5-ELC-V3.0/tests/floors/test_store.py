"""Phase 6.1 store CRUD tests — floors table + fixture validation."""
from __future__ import annotations

import pytest

from elc.config import store as cs
from elc.config.store import BadInput, Conflict, NotFound
from elc.floors import store as floors


@pytest.fixture
def db_path(tmp_path):
    p = str(tmp_path / "config.db")
    cs.init(p)
    return p


class TestCreate:
    def test_minimal(self, db_path):
        f = floors.create_floor("Lobby", db_path=db_path)
        assert f["id"]
        assert f["name"] == "Lobby"
        assert f["width_m"] == 20.0
        assert f["height_m"] == 15.0
        assert f["svg"] == ""
        assert f["fixtures"] == []
        assert f["created_at"] == f["updated_at"]

    def test_with_svg_and_size(self, db_path):
        f = floors.create_floor(
            "Warehouse", svg="<svg/>", width_m=100, height_m=50, db_path=db_path,
        )
        assert f["svg"] == "<svg/>"
        assert f["width_m"] == 100
        assert f["height_m"] == 50

    def test_with_fixtures(self, db_path):
        f = floors.create_floor(
            "Zone A",
            fixtures=[
                {"id": "L1", "device_id": "SRM/1/10/0", "x_m": 2.0, "y_m": 3.0},
                {"id": "L2", "device_id": "SRM/1/20/0", "x_m": 5.0, "y_m": 3.0,
                 "type": "dimmer_0_10v", "max_lux": 800},
            ],
            db_path=db_path,
        )
        assert len(f["fixtures"]) == 2
        assert f["fixtures"][0]["id"] == "L1"
        assert f["fixtures"][0]["type"] == "onoff"      # default
        assert f["fixtures"][0]["max_lux"] == 500       # default
        assert f["fixtures"][1]["type"] == "dimmer_0_10v"

    def test_empty_name_rejected(self, db_path):
        with pytest.raises(BadInput):
            floors.create_floor("   ", db_path=db_path)

    def test_negative_size_rejected(self, db_path):
        with pytest.raises(BadInput):
            floors.create_floor("Bad", width_m=-1, db_path=db_path)
        with pytest.raises(BadInput):
            floors.create_floor("Bad", height_m=0, db_path=db_path)

    def test_duplicate_name_conflict(self, db_path):
        floors.create_floor("Lobby", db_path=db_path)
        with pytest.raises(Conflict):
            floors.create_floor("Lobby", db_path=db_path)

    def test_svg_size_cap(self, db_path):
        with pytest.raises(BadInput):
            floors.create_floor("Big", svg="x" * (6 * 1024 * 1024), db_path=db_path)


class TestFixtureValidation:
    def test_missing_field(self, db_path):
        with pytest.raises(BadInput):
            floors.create_floor(
                "X", fixtures=[{"id": "L1", "x_m": 0.0, "y_m": 0.0}], db_path=db_path,
            )

    def test_unknown_type(self, db_path):
        with pytest.raises(BadInput):
            floors.create_floor(
                "X", fixtures=[
                    {"id": "L1", "device_id": "SRM/1/1/0", "x_m": 0.0, "y_m": 0.0,
                     "type": "laser"},
                ], db_path=db_path,
            )

    def test_duplicate_fixture_ids(self, db_path):
        with pytest.raises(BadInput):
            floors.create_floor(
                "X", fixtures=[
                    {"id": "L1", "device_id": "SRM/1/1/0", "x_m": 0, "y_m": 0},
                    {"id": "L1", "device_id": "SRM/1/2/0", "x_m": 1, "y_m": 1},
                ], db_path=db_path,
            )

    def test_zero_beam_radius(self, db_path):
        with pytest.raises(BadInput):
            floors.create_floor(
                "X", fixtures=[
                    {"id": "L1", "device_id": "SRM/1/1/0", "x_m": 0, "y_m": 0,
                     "beam_radius_m": 0},
                ], db_path=db_path,
            )


class TestReads:
    def test_list_and_get(self, db_path):
        a = floors.create_floor("A", db_path=db_path)
        floors.create_floor("B", svg="<svg>b</svg>", db_path=db_path)
        listed = floors.list_floors(db_path=db_path)
        assert [f["name"] for f in listed] == ["A", "B"]  # ORDER BY name
        # List response elides SVG to keep payload small.
        assert all(f["svg"] == "" for f in listed)
        # Get returns SVG.
        full = floors.get_floor(a["id"], db_path=db_path)
        assert full["name"] == "A"

    def test_get_without_svg(self, db_path):
        f = floors.create_floor("X", svg="<svg>big</svg>", db_path=db_path)
        r = floors.get_floor(f["id"], include_svg=False, db_path=db_path)
        assert r["svg"] == ""

    def test_get_missing(self, db_path):
        with pytest.raises(NotFound):
            floors.get_floor("nope", db_path=db_path)


class TestUpdate:
    def test_partial(self, db_path):
        f = floors.create_floor("A", width_m=10, height_m=5, db_path=db_path)
        updated = floors.update_floor(f["id"], width_m=20, db_path=db_path)
        assert updated["width_m"] == 20
        assert updated["height_m"] == 5     # untouched
        assert updated["updated_at"] > f["updated_at"]

    def test_fixtures_replacement(self, db_path):
        f = floors.create_floor("A", db_path=db_path)
        floors.update_floor(
            f["id"], fixtures=[
                {"id": "L1", "device_id": "SRM/1/1/0", "x_m": 0, "y_m": 0},
            ], db_path=db_path,
        )
        r = floors.get_floor(f["id"], db_path=db_path)
        assert len(r["fixtures"]) == 1

        # Passing [] clears.
        floors.update_floor(f["id"], fixtures=[], db_path=db_path)
        r = floors.get_floor(f["id"], db_path=db_path)
        assert r["fixtures"] == []

    def test_fixtures_none_leaves_untouched(self, db_path):
        f = floors.create_floor(
            "A", fixtures=[
                {"id": "L1", "device_id": "SRM/1/1/0", "x_m": 0, "y_m": 0},
            ], db_path=db_path,
        )
        floors.update_floor(f["id"], width_m=99, fixtures=None, db_path=db_path)
        r = floors.get_floor(f["id"], db_path=db_path)
        assert len(r["fixtures"]) == 1

    def test_name_collision(self, db_path):
        floors.create_floor("A", db_path=db_path)
        b = floors.create_floor("B", db_path=db_path)
        with pytest.raises(Conflict):
            floors.update_floor(b["id"], name="A", db_path=db_path)

    def test_missing(self, db_path):
        with pytest.raises(NotFound):
            floors.update_floor("nope", name="X", db_path=db_path)


class TestDelete:
    def test_ok(self, db_path):
        f = floors.create_floor("A", db_path=db_path)
        floors.delete_floor(f["id"], db_path=db_path)
        assert floors.list_floors(db_path=db_path) == []

    def test_missing(self, db_path):
        with pytest.raises(NotFound):
            floors.delete_floor("nope", db_path=db_path)
