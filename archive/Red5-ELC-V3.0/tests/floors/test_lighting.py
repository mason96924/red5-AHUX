"""Phase 6.1b lighting-element store tests -- assignments + config.

Covers:
  * PUT-style upsert of a single element (create + update).
  * bulk_assign preserves per-device tuning (max_lux etc) when
    re-typing an already-assigned device.
  * delete cascades: removes the device from every floor it's placed on.
  * validation (unknown type, negative lux, out-of-range CCT).
"""
from __future__ import annotations

import pytest

from elc.config import store as cs
from elc.config.store import BadInput, NotFound
from elc.floors import lighting, store as floors


@pytest.fixture
def db_path(tmp_path):
    p = str(tmp_path / "config.db")
    cs.init(p)
    return p


class TestUpsert:
    def test_create_minimal(self, db_path):
        e = lighting.upsert_element("SRM/1/10/0", type="onoff", db_path=db_path)
        assert e["device_id"] == "SRM/1/10/0"
        assert e["type"] == "onoff"
        assert e["max_lux"] == 500
        assert e["beam_radius_m"] == 4.0
        assert e["cct_k"] == 4000
        assert e["shape"] == "point"

    def test_shape_persisted(self, db_path):
        e = lighting.upsert_element(
            "SRM/1/10/0", type="onoff", shape="stick", db_path=db_path,
        )
        assert e["shape"] == "stick"
        e2 = lighting.upsert_element(
            "SRM/1/10/0", type="onoff", shape="ring", db_path=db_path,
        )
        assert e2["shape"] == "ring"

    def test_bad_shape_rejected(self, db_path):
        with pytest.raises(BadInput):
            lighting.upsert_element(
                "SRM/1/10/0", type="onoff", shape="hexagon", db_path=db_path,
            )

    def test_update_existing(self, db_path):
        lighting.upsert_element("SRM/1/10/0", type="onoff", db_path=db_path)
        # Re-upsert with tuned values.
        e = lighting.upsert_element(
            "SRM/1/10/0", type="dimmer_0_10v",
            max_lux=800, beam_radius_m=6.0, cct_k=3000, db_path=db_path,
        )
        assert e["type"] == "dimmer_0_10v"
        assert e["max_lux"] == 800
        assert e["beam_radius_m"] == 6.0
        assert e["cct_k"] == 3000

    def test_unknown_type_rejected(self, db_path):
        with pytest.raises(BadInput):
            lighting.upsert_element("SRM/1/1/0", type="strobe", db_path=db_path)

    def test_negative_lux_rejected(self, db_path):
        with pytest.raises(BadInput):
            lighting.upsert_element(
                "SRM/1/1/0", type="onoff", max_lux=-1, db_path=db_path,
            )

    def test_cct_out_of_range(self, db_path):
        with pytest.raises(BadInput):
            lighting.upsert_element(
                "SRM/1/1/0", type="onoff", cct_k=500, db_path=db_path,
            )
        with pytest.raises(BadInput):
            lighting.upsert_element(
                "SRM/1/1/0", type="onoff", cct_k=15000, db_path=db_path,
            )


class TestList:
    def test_ordered_by_device_id(self, db_path):
        for d in ("SRM/1/30/0", "SRM/1/10/0", "SRM/1/20/0"):
            lighting.upsert_element(d, type="onoff", db_path=db_path)
        rows = lighting.list_elements(db_path=db_path)
        assert [r["device_id"] for r in rows] == [
            "SRM/1/10/0", "SRM/1/20/0", "SRM/1/30/0",
        ]

    def test_get_missing(self, db_path):
        with pytest.raises(NotFound):
            lighting.get_element("SRM/1/1/0", db_path=db_path)


class TestBulkAssign:
    def test_assigns_many(self, db_path):
        devs = ["SRM/1/10/0", "SRM/1/20/0", "SRM/1/30/0"]
        out = lighting.bulk_assign(devs, type="dimmer_0_10v", db_path=db_path)
        assert len(out) == 3
        for e in out:
            assert e["type"] == "dimmer_0_10v"

    def test_reassign_preserves_tuning(self, db_path):
        """Once tuned, bulk-retyping a device keeps its custom
        max_lux/beam/cct.  Only ``type`` and ``updated_at`` change."""
        lighting.upsert_element(
            "SRM/1/10/0", type="onoff", max_lux=800,
            beam_radius_m=6, cct_k=3000, db_path=db_path,
        )
        lighting.bulk_assign(
            ["SRM/1/10/0"], type="dimmer_0_10v", db_path=db_path,
        )
        e = lighting.get_element("SRM/1/10/0", db_path=db_path)
        assert e["type"] == "dimmer_0_10v"
        assert e["max_lux"] == 800
        assert e["beam_radius_m"] == 6
        assert e["cct_k"] == 3000

    def test_empty_list_rejected(self, db_path):
        with pytest.raises(BadInput):
            lighting.bulk_assign([], type="onoff", db_path=db_path)

    def test_dedupes(self, db_path):
        out = lighting.bulk_assign(
            ["SRM/1/10/0", "SRM/1/10/0", "  ", "SRM/1/20/0"],
            type="onoff", db_path=db_path,
        )
        assert len(out) == 2


class TestDeleteCascade:
    def test_unassigns(self, db_path):
        lighting.upsert_element("SRM/1/10/0", type="onoff", db_path=db_path)
        lighting.delete_element("SRM/1/10/0", db_path=db_path)
        with pytest.raises(NotFound):
            lighting.get_element("SRM/1/10/0", db_path=db_path)

    def test_missing(self, db_path):
        with pytest.raises(NotFound):
            lighting.delete_element("nope", db_path=db_path)

    def test_removes_from_floors(self, db_path):
        # Place SRM/1/10/0 on two-fixture floor (well, one; other
        # fixtures should be untouched).
        lighting.upsert_element("SRM/1/10/0", type="onoff", db_path=db_path)
        lighting.upsert_element("SRM/1/20/0", type="onoff", db_path=db_path)
        f = floors.create_floor(
            "F1",
            fixtures=[
                {"id": "L1", "device_id": "SRM/1/10/0", "x_m": 1, "y_m": 1},
                {"id": "L2", "device_id": "SRM/1/20/0", "x_m": 5, "y_m": 5},
            ],
            db_path=db_path,
        )
        # Un-assigning L1's device strips it from F1 automatically.
        lighting.delete_element("SRM/1/10/0", db_path=db_path)
        r = floors.get_floor(f["id"], db_path=db_path)
        assert [x["id"] for x in r["fixtures"]] == ["L2"]
