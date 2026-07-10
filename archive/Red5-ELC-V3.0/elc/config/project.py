"""
elc.config.project
==================
JSON-file backed "starting-point" configuration for the operator's
site.  One file at ``configs/project.json`` captures everything the
UI needs to bootstrap a new install:

  * project profile   -- name, timezone, lat/lng for sunrise/sunset
  * SCU list          -- host/port + bus id
  * modules per SCU   -- dev_type + address + operator note

The file is human-readable and hand-editable.  The Settings wizard
(``/settings``) writes it via ``POST /api/elc/project``.  On boot,
``scripts/demo.py`` reads it and expands the SCU→module hierarchy
into the flat DeviceId list the rest of the pipeline already uses.

Design notes:
  * Pure stdlib + pydantic (already in project deps).  No new deps.
  * Atomic writes: temp file + os.replace so a crashed save can't
    truncate the config.
  * Backup: prev version is copied to ``project.json.bak`` on save.
  * Absent file returns None -- callers land the operator on
    ``/settings`` (bootstrap flow, 2026-02-11 operator ask).
"""
from __future__ import annotations

import json
import os
import shutil
from pathlib import Path
from typing import Literal

from pydantic import BaseModel, Field, field_validator

DEFAULT_PROJECT_PATH = Path(
    os.environ.get("ELC_PROJECT_JSON", "configs/project.json")
)


class ModuleEntry(BaseModel):
    """One relay module wired to an SCU."""

    dev_type: Literal["SRM_6E", "SRM_6S", "SRM_4S"]
    address: int = Field(..., ge=1, le=1023,
                         description="Physical bus address of the module (1..1023).")
    note: str = Field(default="", max_length=120,
                      description="Operator-facing description (room / zone).")
    discovered: bool = Field(default=False,
                             description="True if this row came from /discover-srms rather than manual entry.")

    @property
    def channel_count(self) -> int:
        return {"SRM_4S": 4, "SRM_6S": 6, "SRM_6E": 6}[self.dev_type]


class ScuEntry(BaseModel):
    id: int = Field(..., ge=0, le=63,
                    description="Bus id (0..63).  Encoded into the top 6 bits of byte 1.")
    name: str = Field(default="", max_length=60)
    host: str = Field(default="", max_length=120,
                      description="IP or hostname the master reaches this SCU at.")
    port: int = Field(default=4001, ge=1, le=65535)
    modules: list[ModuleEntry] = Field(default_factory=list)

    @field_validator("modules")
    @classmethod
    def _unique_addresses(cls, v: list[ModuleEntry]) -> list[ModuleEntry]:
        addrs = [m.address for m in v]
        if len(addrs) != len(set(addrs)):
            dupes = sorted(a for a in set(addrs) if addrs.count(a) > 1)
            raise ValueError(f"duplicate module addresses on same SCU: {dupes}")
        return v


class ProjectProfile(BaseModel):
    name: str = Field(default="Untitled Site", max_length=120)
    timezone: str = Field(default="UTC", max_length=64,
                          description="IANA timezone id, e.g. 'Asia/Kolkata'.")
    latitude: float = Field(default=0.0, ge=-90.0, le=90.0)
    longitude: float = Field(default=0.0, ge=-180.0, le=180.0)
    sunrise_offset_min: int = Field(default=0, ge=-360, le=360,
                                    description="Minutes to add to computed sunrise for schedules.")
    sunset_offset_min: int = Field(default=0, ge=-360, le=360,
                                   description="Minutes to add to computed sunset for schedules.")


class ProjectConfig(BaseModel):
    """Root document persisted at ``configs/project.json``."""

    project: ProjectProfile = Field(default_factory=ProjectProfile)
    scus: list[ScuEntry] = Field(default_factory=list)

    @field_validator("scus")
    @classmethod
    def _unique_scu_ids(cls, v: list[ScuEntry]) -> list[ScuEntry]:
        ids = [s.id for s in v]
        if len(ids) != len(set(ids)):
            dupes = sorted(i for i in set(ids) if ids.count(i) > 1)
            raise ValueError(f"duplicate SCU ids: {dupes}")
        return v

    def to_devices_json(self) -> list[dict]:
        """Expand the SCU→module hierarchy into the flat list format
        that ``scripts/demo.py::_load_device_set`` already consumes
        (``[{dev_type, scu, address, sub_address?}, ...]``).

        For each module we emit ONE row without ``sub_address`` --
        the loader auto-expands it to N channels based on dev_type.
        """
        out: list[dict] = []
        for scu in self.scus:
            for m in scu.modules:
                out.append({
                    "dev_type": m.dev_type,
                    "scu": scu.id,
                    "address": m.address,
                })
        return out


def load_project(path: Path = DEFAULT_PROJECT_PATH) -> ProjectConfig | None:
    """Return the parsed project config or ``None`` when absent.

    Absent-file case is the "fresh install" signal -- callers should
    redirect the operator to ``/settings`` on next request.
    """
    if not path.is_file():
        return None
    raw = json.loads(path.read_text())
    return ProjectConfig.model_validate(raw)


def save_project(cfg: ProjectConfig, path: Path = DEFAULT_PROJECT_PATH) -> None:
    """Atomically persist ``cfg`` to ``path``.

    Copies the previous file to ``.bak`` and writes via a
    temp-then-rename so a crash mid-save can't truncate the config.
    """
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.is_file():
        shutil.copy2(path, path.with_suffix(path.suffix + ".bak"))
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(cfg.model_dump(), indent=2, sort_keys=False))
    os.replace(tmp, path)


def is_configured(path: Path = DEFAULT_PROJECT_PATH) -> bool:
    """True when the operator has at least one SCU with one module."""
    cfg = load_project(path)
    if cfg is None:
        return False
    return any(scu.modules for scu in cfg.scus)
