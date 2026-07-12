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
                {"id": "L2", "device_id": "SRM/1/20/0", "x_m": 5.0, "y_m": 3.0},
            ],
            db_path=db_path,
        )
        assert len(f["fixtures"]) == 2
        assert f["fixtures"][0]["id"] == "L1"
        assert f["fixtures"][0]["device_id"] == "SRM/1/10/0"
        # Post-6.1b: fixtures are placement-only.  type / max_lux / etc
        # live in the shared lighting_elements table.
        assert "type" not in f["fixtures"][0]
        assert "max_lux" not in f["fixtures"][0]

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

    def test_duplicate_fixture_ids(self, db_path):
        with pytest.raises(BadInput):
            floors.create_floor(
                "X", fixtures=[
                    {"id": "L1", "device_id": "SRM/1/1/0", "x_m": 0, "y_m": 0},
                    {"id": "L1", "device_id": "SRM/1/2/0", "x_m": 1, "y_m": 1},
                ], db_path=db_path,
            )

    def test_duplicate_device_ids_on_same_floor(self, db_path):
        with pytest.raises(BadInput, match="same device"):
            floors.create_floor(
                "X", fixtures=[
                    {"id": "L1", "device_id": "SRM/1/1/0", "x_m": 0, "y_m": 0},
                    {"id": "L2", "device_id": "SRM/1/1/0", "x_m": 1, "y_m": 1},
                ], db_path=db_path,
            )

    def test_device_on_another_floor_conflicts(self, db_path):
        """1:1 placement -- a device on floor A can't also land on floor B."""
        floors.create_floor(
            "Floor-A",
            fixtures=[{"id": "L1", "device_id": "SRM/1/1/0", "x_m": 0, "y_m": 0}],
            db_path=db_path,
        )
        with pytest.raises(Conflict, match="already placed"):
            floors.create_floor(
                "Floor-B",
                fixtures=[{"id": "L1", "device_id": "SRM/1/1/0", "x_m": 1, "y_m": 1}],
                db_path=db_path,
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


class TestRooms:
    """Phase 6.1c — room polygons for canvas light clipping."""

    _RECT = [[0.0, 0.0], [5.0, 0.0], [5.0, 3.0], [0.0, 3.0]]

    def test_default_empty(self, db_path):
        f = floors.create_floor("A", db_path=db_path)
        assert f["rooms"] == []

    def test_create_with_rooms(self, db_path):
        f = floors.create_floor(
            "A",
            rooms=[
                {"id": "R-1", "name": "West", "vertices": self._RECT},
            ],
            db_path=db_path,
        )
        assert len(f["rooms"]) == 1
        assert f["rooms"][0]["name"] == "West"
        assert f["rooms"][0]["vertices"] == self._RECT

    def test_update_rooms_replaces(self, db_path):
        f = floors.create_floor(
            "A",
            rooms=[{"vertices": self._RECT}],
            db_path=db_path,
        )
        floors.update_floor(f["id"], rooms=[], db_path=db_path)
        r = floors.get_floor(f["id"], db_path=db_path)
        assert r["rooms"] == []

    def test_update_rooms_none_leaves_untouched(self, db_path):
        f = floors.create_floor(
            "A",
            rooms=[{"vertices": self._RECT}],
            db_path=db_path,
        )
        floors.update_floor(f["id"], width_m=99, rooms=None, db_path=db_path)
        r = floors.get_floor(f["id"], db_path=db_path)
        assert len(r["rooms"]) == 1

    def test_validation_bad_vertex(self, db_path):
        with pytest.raises(BadInput):
            floors.create_floor(
                "A",
                rooms=[{"vertices": [[0, 0], [1, 0], "nope"]}],
                db_path=db_path,
            )

    def test_validation_too_few_vertices(self, db_path):
        with pytest.raises(BadInput):
            floors.create_floor(
                "A",
                rooms=[{"vertices": [[0, 0], [1, 1]]}],
                db_path=db_path,
            )


class TestRoomTypeAndMinLux:
    """Phase 6.1d — room `type` and `min_lux` for compliance heatmap."""

    _RECT = [[0.0, 0.0], [5.0, 0.0], [5.0, 3.0], [0.0, 3.0]]

    def test_type_defaults_to_other_for_unknown_name(self, db_path):
        f = floors.create_floor(
            "A",
            rooms=[{"name": "Unnamed", "vertices": self._RECT}],
            db_path=db_path,
        )
        assert f["rooms"][0]["type"] == "other"
        assert f["rooms"][0]["min_lux"] == 200

    def test_type_inferred_from_name(self, db_path):
        f = floors.create_floor(
            "A",
            rooms=[
                {"name": "Office 3", "vertices": self._RECT},
                {"name": "Corridor N", "vertices":
                    [[0, 3], [5, 3], [5, 4], [0, 4]]},
                {"name": "Meeting Room A", "vertices":
                    [[0, 4], [5, 4], [5, 5], [0, 5]]},
            ],
            db_path=db_path,
        )
        types = {r["name"]: r["type"] for r in f["rooms"]}
        assert types["Office 3"] == "office"
        assert types["Corridor N"] == "corridor"
        assert types["Meeting Room A"] == "meeting"
        lux = {r["name"]: r["min_lux"] for r in f["rooms"]}
        assert lux["Office 3"] == 300
        assert lux["Corridor N"] == 100
        assert lux["Meeting Room A"] == 300

    def test_explicit_type_overrides_inferred(self, db_path):
        f = floors.create_floor(
            "A",
            rooms=[{"name": "Office 3", "type": "warehouse",
                    "vertices": self._RECT}],
            db_path=db_path,
        )
        assert f["rooms"][0]["type"] == "warehouse"
        assert f["rooms"][0]["min_lux"] == 200

    def test_explicit_min_lux_overrides_default(self, db_path):
        f = floors.create_floor(
            "A",
            rooms=[{"name": "Office 3", "min_lux": 750,
                    "vertices": self._RECT}],
            db_path=db_path,
        )
        assert f["rooms"][0]["min_lux"] == 750

    def test_bad_type_rejected(self, db_path):
        with pytest.raises(BadInput):
            floors.create_floor(
                "A",
                rooms=[{"type": "hangar", "vertices": self._RECT}],
                db_path=db_path,
            )


class TestFixtureShapeGeometry:
    """Phase 6.1d — placements can carry non-point shape geometry."""

    def test_default_placement_omits_geometry(self, db_path):
        f = floors.create_floor(
            "A",
            fixtures=[{"id": "L-1", "device_id": "SRM/1/10/0",
                       "x_m": 3, "y_m": 4}],
            db_path=db_path,
        )
        fx = f["fixtures"][0]
        assert "length_m" not in fx
        assert "angle_deg" not in fx
        assert "radius_m" not in fx
        assert "vertices" not in fx

    def test_stick_geometry_persisted(self, db_path):
        f = floors.create_floor(
            "A",
            fixtures=[{"id": "L-1", "device_id": "SRM/1/10/0",
                       "x_m": 5, "y_m": 3,
                       "length_m": 2.4, "angle_deg": 90}],
            db_path=db_path,
        )
        fx = f["fixtures"][0]
        assert fx["length_m"] == 2.4
        assert fx["angle_deg"] == 90

    def test_ring_geometry_persisted(self, db_path):
        f = floors.create_floor(
            "A",
            fixtures=[{"id": "L-1", "device_id": "SRM/1/10/0",
                       "x_m": 5, "y_m": 3, "radius_m": 1.5}],
            db_path=db_path,
        )
        assert f["fixtures"][0]["radius_m"] == 1.5

    def test_polyline_geometry_persisted(self, db_path):
        vs = [[0, 0], [1, 0], [1, 1], [2, 1]]
        f = floors.create_floor(
            "A",
            fixtures=[{"id": "L-1", "device_id": "SRM/1/10/0",
                       "x_m": 0, "y_m": 0, "vertices": vs}],
            db_path=db_path,
        )
        assert f["fixtures"][0]["vertices"] == vs

    def test_negative_length_rejected(self, db_path):
        with pytest.raises(BadInput):
            floors.create_floor(
                "A",
                fixtures=[{"id": "L-1", "device_id": "SRM/1/10/0",
                           "x_m": 5, "y_m": 3, "length_m": -1}],
                db_path=db_path,
            )

    def test_polyline_too_few_vertices_rejected(self, db_path):
        with pytest.raises(BadInput):
            floors.create_floor(
                "A",
                fixtures=[{"id": "L-1", "device_id": "SRM/1/10/0",
                           "x_m": 0, "y_m": 0, "vertices": [[0, 0]]}],
                db_path=db_path,
            )

    def test_rectangle_geometry_persisted(self, db_path):
        f = floors.create_floor(
            "A",
            fixtures=[{"id": "L-1", "device_id": "SRM/1/10/0",
                       "x_m": 5, "y_m": 3,
                       "polygon_kind": "rectangle",
                       "width_m": 3.0, "height_m": 1.5}],
            db_path=db_path,
        )
        fx = f["fixtures"][0]
        assert fx["polygon_kind"] == "rectangle"
        assert fx["width_m"] == 3.0
        assert fx["height_m"] == 1.5

    def test_ngon_geometry_persisted(self, db_path):
        f = floors.create_floor(
            "A",
            fixtures=[{"id": "L-1", "device_id": "SRM/1/10/0",
                       "x_m": 5, "y_m": 3,
                       "polygon_kind": "polygon",
                       "radius_m": 2.0, "sides": 6, "angle_deg": 30}],
            db_path=db_path,
        )
        fx = f["fixtures"][0]
        assert fx["polygon_kind"] == "polygon"
        assert fx["sides"] == 6
        assert fx["radius_m"] == 2.0

    def test_bad_polygon_kind_rejected(self, db_path):
        with pytest.raises(BadInput):
            floors.create_floor(
                "A",
                fixtures=[{"id": "L-1", "device_id": "SRM/1/10/0",
                           "x_m": 5, "y_m": 3, "polygon_kind": "trapezoid"}],
                db_path=db_path,
            )

    def test_sides_out_of_range_rejected(self, db_path):
        with pytest.raises(BadInput):
            floors.create_floor(
                "A",
                fixtures=[{"id": "L-1", "device_id": "SRM/1/10/0",
                           "x_m": 0, "y_m": 0, "sides": 2}],
                db_path=db_path,
            )
        with pytest.raises(BadInput):
            floors.create_floor(
                "A2",
                fixtures=[{"id": "L-1", "device_id": "SRM/1/10/0",
                           "x_m": 0, "y_m": 0, "sides": 30}],
                db_path=db_path,
            )


class TestSchemaMigration:
    """Legacy DBs created before the ``rooms_json`` column existed
    should get it added automatically on the next init/open."""

    def test_adds_rooms_json_column_to_legacy_db(self, tmp_path):
        import sqlite3

        p = str(tmp_path / "legacy.db")
        conn = sqlite3.connect(p)
        # Simulate an old floors table without rooms_json.
        conn.execute("""
            CREATE TABLE floors (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                svg TEXT NOT NULL DEFAULT '',
                width_m REAL NOT NULL DEFAULT 20.0,
                height_m REAL NOT NULL DEFAULT 15.0,
                fixtures_json TEXT NOT NULL DEFAULT '[]',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        """)
        conn.execute(
            "INSERT INTO floors (id, name, svg, width_m, height_m, "
            "fixtures_json, created_at, updated_at) "
            "VALUES ('x', 'Old', '', 5, 5, '[]', 't', 't')"
        )
        conn.commit()
        conn.close()

        # Re-init through the store — should add the missing column.
        cs.init(p)
        f = floors.get_floor("x", db_path=p)
        assert f["rooms"] == []



class TestWindowName:
    """2026-02-12s — Optional operator-set window identifier."""

    def test_name_persists_round_trip(self, db_path):
        f = floors.create_floor("F1", db_path=db_path)
        floors.update_floor(f["id"], windows=[{
            "x_m": 1.0, "y_m": 2.0, "length_m": 1.2,
            "angle_deg": 0.0, "name": "N_W1",
        }], db_path=db_path)
        got = floors.get_floor(f["id"], db_path=db_path)
        assert got["windows"][0]["name"] == "N_W1"

    def test_empty_name_is_dropped(self, db_path):
        f = floors.create_floor("F1", db_path=db_path)
        floors.update_floor(f["id"], windows=[{
            "x_m": 1.0, "y_m": 2.0, "length_m": 1.2,
            "angle_deg": 0.0, "name": "   ",
        }], db_path=db_path)
        got = floors.get_floor(f["id"], db_path=db_path)
        assert "name" not in got["windows"][0]

    def test_omitted_name_is_dropped(self, db_path):
        f = floors.create_floor("F1", db_path=db_path)
        floors.update_floor(f["id"], windows=[{
            "x_m": 1.0, "y_m": 2.0, "length_m": 1.2,
            "angle_deg": 0.0,
        }], db_path=db_path)
        got = floors.get_floor(f["id"], db_path=db_path)
        assert "name" not in got["windows"][0]

    def test_name_trimmed_and_capped(self, db_path):
        f = floors.create_floor("F1", db_path=db_path)
        floors.update_floor(f["id"], windows=[{
            "x_m": 1.0, "y_m": 2.0, "length_m": 1.2,
            "angle_deg": 0.0, "name": "  My Very Long Custom Window Name That Goes On And On And On  ",
        }], db_path=db_path)
        got = floors.get_floor(f["id"], db_path=db_path)
        assert got["windows"][0]["name"].startswith("My Very")
        assert len(got["windows"][0]["name"]) <= 64
        # Whitespace trimmed on both sides.
        assert not got["windows"][0]["name"].startswith(" ")
        assert not got["windows"][0]["name"].endswith(" ")



class TestSlabShape:
    """Phase 2026-02-13 — per-floor slab shape config."""

    def test_default_is_none(self, db_path):
        f = floors.create_floor("F1", db_path=db_path)
        assert f["slab"] is None

    def test_rect_slab_roundtrip(self, db_path):
        f = floors.create_floor(
            "F1", slab={"type": "rect"}, db_path=db_path,
        )
        assert f["slab"] == {"type": "rect"}

    def test_polygon_slab_roundtrip(self, db_path):
        slab = {
            "type": "polygon",
            "cx_m": 10.0,
            "cy_m": 7.5,
            "radius_m": 5.0,
            "sides": 6,
            "rotation_deg": 30.0,
        }
        f = floors.create_floor("F1", slab=slab, db_path=db_path)
        got = f["slab"]
        assert got["type"] == "polygon"
        assert got["cx_m"] == 10.0
        assert got["cy_m"] == 7.5
        assert got["radius_m"] == 5.0
        assert got["sides"] == 6
        assert got["rotation_deg"] == 30.0

    def test_polygon_bad_sides_rejected(self, db_path):
        with pytest.raises(BadInput):
            floors.create_floor(
                "F1",
                slab={"type": "polygon", "radius_m": 5, "sides": 2},
                db_path=db_path,
            )
        with pytest.raises(BadInput):
            floors.create_floor(
                "F2",
                slab={"type": "polygon", "radius_m": 5, "sides": 30},
                db_path=db_path,
            )

    def test_polygon_negative_radius_rejected(self, db_path):
        with pytest.raises(BadInput):
            floors.create_floor(
                "F1",
                slab={"type": "polygon", "radius_m": -1, "sides": 6},
                db_path=db_path,
            )

    def test_polyline_slab_roundtrip(self, db_path):
        slab = {
            "type": "polyline",
            "vertices": [[0, 0], [10, 0], [10, 8], [5, 8], [5, 4], [0, 4]],
            "rotation_deg": 0.0,
        }
        f = floors.create_floor("F1", slab=slab, db_path=db_path)
        got = f["slab"]
        assert got["type"] == "polyline"
        assert got["vertices"] == [
            [0.0, 0.0], [10.0, 0.0], [10.0, 8.0],
            [5.0, 8.0], [5.0, 4.0], [0.0, 4.0],
        ]

    def test_polyline_too_few_vertices_rejected(self, db_path):
        with pytest.raises(BadInput):
            floors.create_floor(
                "F1",
                slab={"type": "polyline", "vertices": [[0, 0], [1, 1]]},
                db_path=db_path,
            )

    def test_bad_type_rejected(self, db_path):
        with pytest.raises(BadInput):
            floors.create_floor(
                "F1", slab={"type": "hexagon"}, db_path=db_path,
            )

    def test_update_slab(self, db_path):
        f = floors.create_floor("F1", db_path=db_path)
        assert f["slab"] is None
        floors.update_floor(
            f["id"],
            slab={"type": "polygon", "radius_m": 4.0, "sides": 8},
            db_path=db_path,
        )
        got = floors.get_floor(f["id"], db_path=db_path)
        assert got["slab"]["type"] == "polygon"
        assert got["slab"]["sides"] == 8

    def test_reset_slab_to_rect(self, db_path):
        f = floors.create_floor(
            "F1",
            slab={"type": "polygon", "radius_m": 4.0, "sides": 6},
            db_path=db_path,
        )
        floors.update_floor(f["id"], slab={"type": "rect"}, db_path=db_path)
        got = floors.get_floor(f["id"], db_path=db_path)
        assert got["slab"] == {"type": "rect"}

    def test_slab_omitted_leaves_previous(self, db_path):
        f = floors.create_floor(
            "F1",
            slab={"type": "polygon", "radius_m": 4.0, "sides": 6},
            db_path=db_path,
        )
        # Update something unrelated -- slab must survive.
        floors.update_floor(f["id"], width_m=25.0, db_path=db_path)
        got = floors.get_floor(f["id"], db_path=db_path)
        assert got["width_m"] == 25.0
        assert got["slab"]["type"] == "polygon"
