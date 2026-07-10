"""Tests for elc.config.project + elc.util.astro (2026-02-11)."""
from __future__ import annotations

import json
from datetime import date
from pathlib import Path

import pytest
from pydantic import ValidationError

from elc.config.project import (
    ModuleEntry,
    ProjectConfig,
    ScuEntry,
    is_configured,
    load_project,
    save_project,
)
from elc.util.astro import sun_times_for


# ---- Pydantic model validation ----

def test_module_entry_channel_count_by_type():
    assert ModuleEntry(dev_type="SRM_4S", address=1).channel_count == 4
    assert ModuleEntry(dev_type="SRM_6S", address=1).channel_count == 6
    assert ModuleEntry(dev_type="SRM_6E", address=1).channel_count == 6


def test_module_entry_rejects_bad_type():
    with pytest.raises(ValidationError):
        ModuleEntry(dev_type="SRM_7X", address=1)


def test_scu_entry_rejects_duplicate_module_addresses():
    with pytest.raises(ValidationError) as exc:
        ScuEntry(id=0, modules=[
            ModuleEntry(dev_type="SRM_6E", address=1),
            ModuleEntry(dev_type="SRM_6S", address=1),  # dup
        ])
    assert "duplicate module addresses" in str(exc.value)


def test_project_config_rejects_duplicate_scu_ids():
    with pytest.raises(ValidationError) as exc:
        ProjectConfig(scus=[ScuEntry(id=0), ScuEntry(id=0)])
    assert "duplicate SCU ids" in str(exc.value)


# ---- Round-trip persistence ----

def test_save_load_roundtrip(tmp_path: Path):
    path = tmp_path / "project.json"
    cfg = ProjectConfig(
        project={
            "name": "Test Site", "timezone": "UTC",
            "latitude": 12.9716, "longitude": 77.5946,
            "sunrise_offset_min": 5, "sunset_offset_min": -10,
        },
        scus=[ScuEntry(
            id=0, name="SCU-A", host="10.0.0.1", port=4001,
            modules=[
                ModuleEntry(dev_type="SRM_6E", address=1, note="Lobby"),
                ModuleEntry(dev_type="SRM_4S", address=3, note="Corridor"),
            ],
        )],
    )
    save_project(cfg, path)
    loaded = load_project(path)
    assert loaded is not None
    assert loaded.project.name == "Test Site"
    assert loaded.project.sunrise_offset_min == 5
    assert loaded.scus[0].modules[0].note == "Lobby"
    # Bak file created from the save (only on 2nd write; first save has no prev).
    save_project(cfg, path)
    assert path.with_suffix(".json.bak").is_file()


def test_load_project_missing_returns_none(tmp_path: Path):
    assert load_project(tmp_path / "nope.json") is None


def test_is_configured_absent(tmp_path: Path):
    assert is_configured(tmp_path / "absent.json") is False


def test_is_configured_needs_modules(tmp_path: Path):
    path = tmp_path / "p.json"
    save_project(ProjectConfig(scus=[ScuEntry(id=0)]), path)  # no modules
    assert is_configured(path) is False
    save_project(ProjectConfig(scus=[ScuEntry(
        id=0, modules=[ModuleEntry(dev_type="SRM_6S", address=1)],
    )]), path)
    assert is_configured(path) is True


def test_to_devices_json_shape():
    cfg = ProjectConfig(scus=[
        ScuEntry(id=0, modules=[
            ModuleEntry(dev_type="SRM_6E", address=1),
            ModuleEntry(dev_type="SRM_4S", address=3),
        ]),
        ScuEntry(id=1, modules=[
            ModuleEntry(dev_type="SRM_6S", address=2),
        ]),
    ])
    devs = cfg.to_devices_json()
    assert devs == [
        {"dev_type": "SRM_6E", "scu": 0, "address": 1},
        {"dev_type": "SRM_4S", "scu": 0, "address": 3},
        {"dev_type": "SRM_6S", "scu": 1, "address": 2},
    ]


# ---- Astro (astral wrapper) ----

def test_sun_times_returns_expected_keys():
    r = sun_times_for(latitude=12.9716, longitude=77.5946,
                      tz_name="Asia/Kolkata",
                      on=date(2026, 2, 11))
    for k in ("sunrise", "sunset", "dawn", "dusk",
              "solar_noon", "day_length_min",
              "sunrise_utc", "sunset_utc",
              "sunrise_offset_min", "sunset_offset_min"):
        assert k in r, f"missing key: {k}"
    # Bangalore Feb 11 sunrise ~06:30 local, sunset ~18:20 local.
    hh_sr = int(r["sunrise"].split(":")[0])
    hh_ss = int(r["sunset"].split(":")[0])
    assert 5 <= hh_sr <= 7
    assert 17 <= hh_ss <= 19


def test_sun_times_offsets_shift_only_sunrise_sunset():
    base = sun_times_for(12.9716, 77.5946, "Asia/Kolkata",
                         on=date(2026, 2, 11))
    shifted = sun_times_for(12.9716, 77.5946, "Asia/Kolkata",
                            on=date(2026, 2, 11),
                            sunrise_offset_min=15,
                            sunset_offset_min=-30)
    # Dawn/dusk are un-shifted (civil twilight, astronomical).
    assert base["dawn"] == shifted["dawn"]
    assert base["dusk"] == shifted["dusk"]
    # Sunrise shifted forward, sunset shifted back.
    assert base["sunrise"] != shifted["sunrise"]
    assert base["sunset"] != shifted["sunset"]
    assert shifted["sunrise_offset_min"] == 15
    assert shifted["sunset_offset_min"] == -30
