"""Tests for the Settings-driven floor strand refactor (2026-02-11).

Covers:
* :func:`elc.config.project.validate_strand_label` accepts F0..F200 /
  B1..B50 and rejects everything else (including ``B0`` and ``G``).
* :func:`strand_sort_key` orders B50 < B1 < F0 < F1 < F200.
* :func:`strand_from_legacy_name` migrates ``L1`` → ``F1`` and falls
  back to ``F0`` for unknown names.
* :class:`ModuleEntry` normalises the ``floor`` field to upper-case
  and rejects invalid labels.
* :meth:`ProjectConfig.strand_labels` returns canonical order.
* :func:`elc.floors.store.get_or_create_floor_by_strand` creates on
  first call and returns the same row on subsequent calls (idempotent).
"""
from __future__ import annotations

import pytest
from pydantic import ValidationError

from elc.config.project import (
    ModuleEntry,
    ProjectConfig,
    ScuEntry,
    strand_from_legacy_name,
    strand_sort_key,
    validate_strand_label,
)


# ---- validate_strand_label ------------------------------------------

@pytest.mark.parametrize("label,expected", [
    ("F0", "F0"), ("f0", "F0"), ("  F0  ", "F0"),
    ("F1", "F1"), ("F99", "F99"), ("F100", "F100"), ("F200", "F200"),
    ("B1", "B1"), ("B50", "B50"), ("b25", "B25"),
])
def test_validate_strand_label_accepts_canonical(label, expected):
    assert validate_strand_label(label) == expected


@pytest.mark.parametrize("label", [
    "G", "GROUND", "B0", "F201", "B51", "F-1", "F1.5",
    "L1", "", " ", None, "F", "B", "F00", "B00", "FF1",
])
def test_validate_strand_label_rejects_bad(label):
    with pytest.raises((ValueError, TypeError)):
        validate_strand_label(label)


# ---- strand_sort_key ------------------------------------------------

def test_strand_sort_key_orders_basement_below_ground():
    labels = ["F1", "B1", "F0", "B50", "F200", "B10"]
    assert sorted(labels, key=strand_sort_key) == [
        "B50", "B10", "B1", "F0", "F1", "F200",
    ]


# ---- strand_from_legacy_name ----------------------------------------

@pytest.mark.parametrize("name,expected", [
    ("Ground", "F0"), ("ground floor", "F0"), ("", "F0"),
    ("L1", "F1"), ("L 2", "F2"), ("Level 12", "F12"),
    ("Floor 3", "F3"), ("F5", "F5"),
    ("Basement 1", "B1"), ("B7", "B7"),
    ("Mezzanine", "F0"), ("Rooftop", "F0"),
    ("7", "F7"),           # bare number → above-ground
    ("L999", "F0"),        # out of range → default
])
def test_strand_from_legacy_name(name, expected):
    assert strand_from_legacy_name(name) == expected


# ---- ModuleEntry.floor ----------------------------------------------

def test_module_entry_defaults_to_ground():
    m = ModuleEntry(dev_type="SRM_6S", address=1)
    assert m.floor == "F0"


def test_module_entry_normalises_floor_case():
    m = ModuleEntry(dev_type="SRM_6S", address=1, floor="f3")
    assert m.floor == "F3"


def test_module_entry_rejects_bad_floor():
    with pytest.raises(ValidationError):
        ModuleEntry(dev_type="SRM_6S", address=1, floor="G")


# ---- ProjectConfig.strand_labels -----------------------------------

def test_project_config_strand_labels_returns_canonical_order():
    cfg = ProjectConfig(scus=[
        ScuEntry(id=0, modules=[
            ModuleEntry(dev_type="SRM_6S", address=1, floor="F2"),
            ModuleEntry(dev_type="SRM_6S", address=2, floor="F0"),
            ModuleEntry(dev_type="SRM_4S", address=3, floor="B1"),
        ]),
        ScuEntry(id=1, modules=[
            ModuleEntry(dev_type="SRM_6E", address=1, floor="F2"),  # dupe with SCU 0
        ]),
    ])
    assert cfg.strand_labels() == ["B1", "F0", "F2"]


# ---- get_or_create_floor_by_strand (DB) ------------------------------

def test_get_or_create_floor_by_strand_is_idempotent(tmp_path):
    db = str(tmp_path / "elc.db")
    from elc.config.store import init
    from elc.floors.store import get_or_create_floor_by_strand

    init(db)
    a = get_or_create_floor_by_strand("F0", db_path=db)
    b = get_or_create_floor_by_strand("F0", db_path=db)
    assert a["id"] == b["id"]
    assert a["strand_label"] == "F0"


def test_get_or_create_floor_by_strand_creates_distinct_rows(tmp_path):
    db = str(tmp_path / "elc.db")
    from elc.config.store import init
    from elc.floors.store import get_or_create_floor_by_strand, list_floors

    init(db)
    for lbl in ("F0", "F1", "B1"):
        get_or_create_floor_by_strand(lbl, db_path=db)
    labels = {f["strand_label"] for f in list_floors(db_path=db)}
    assert labels == {"F0", "F1", "B1"}


def test_get_or_create_floor_by_strand_upcases(tmp_path):
    db = str(tmp_path / "elc.db")
    from elc.config.store import init
    from elc.floors.store import get_or_create_floor_by_strand

    init(db)
    a = get_or_create_floor_by_strand("f3", db_path=db)
    b = get_or_create_floor_by_strand("F3", db_path=db)
    assert a["id"] == b["id"] and a["strand_label"] == "F3"
