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
import re
import shutil
from pathlib import Path
from typing import Literal

from pydantic import BaseModel, Field, field_validator

DEFAULT_PROJECT_PATH = Path(
    os.environ.get("ELC_PROJECT_JSON", "configs/project.json")
)

# ----------------------------------------------------------------------
# Floor strand labels
# ----------------------------------------------------------------------
# The Settings-page "Floor" column drives the *identity* of every floor
# in the project.  Format is a single-letter prefix + integer index:
#
#   F0        Ground floor (canonical -- do NOT use "G")
#   F1..F200  Above-ground floors
#   B1..B50   Below-ground (basement) floors.  ``B0`` is NOT allowed.
#
# Uniqueness / ordering is by strand label (see :func:`strand_sort_key`).
# ``floors`` DB rows carry the label alongside their operator-editable
# ``name`` -- Settings drives which floors exist, and the Building page
# renders them by strand order.

_STRAND_RE = re.compile(r"^(F(?:0|[1-9]\d?|1\d{2}|200)|B(?:[1-9]|[1-4]\d|50))$")


def validate_strand_label(value: str) -> str:
    """Normalise + validate a floor strand label.  ``value`` may be
    lowercase; trailing whitespace is stripped.  Raises ``ValueError``
    on any deviation from the ``F0..F200`` / ``B1..B50`` grammar."""
    if value is None:
        raise ValueError("floor strand label required")
    s = str(value).strip().upper()
    if not _STRAND_RE.match(s):
        raise ValueError(
            f"invalid floor strand label {value!r} -- "
            "must be F0..F200 or B1..B50 (no B0, no G)"
        )
    return s


def strand_sort_key(label: str) -> int:
    """Integer sort key so ``sorted(labels, key=strand_sort_key)`` gives
    ``B50 < B49 < ... < B1 < F0 < F1 < ... < F200`` (basement lowest,
    ground zero, above-ground positive)."""
    if not label:
        return 0
    if label[0] == "B":
        return -int(label[1:])
    if label[0] == "F":
        return int(label[1:])
    return 0


def strand_from_legacy_name(name: str) -> str:
    """Best-effort migration helper -- derive a strand label from an
    operator-authored floor name so pre-refactor rows keep working.
    Falls back to ``F0`` (Ground) on anything unparseable.

    Mapping::

        "Ground" / ""                     -> F0
        "L1" / "Level 1" / "Floor 1"      -> F1
        "L 12" / "Floor-12"               -> F12
        "B1" / "Basement 1"               -> B1
        "Mezzanine"                       -> F0  (fallback)
    """
    n = (name or "").strip().lower()
    if not n or "ground" in n:
        return "F0"
    # Word-level basement / floor detection FIRST so "Basement 3" and
    # "Floor 12" hit before the letter-prefix fallback below.
    if "basement" in n or "cellar" in n or "sub-floor" in n or "subfloor" in n:
        m0 = re.search(r"\b(\d{1,2})\b", n)
        if m0:
            num = int(m0.group(1))
            if 1 <= num <= 50:
                return f"B{num}"
        return "B1"
    m = re.search(r"\b([fbl])\s*[-_]?\s*(\d{1,3})\b", n, re.I)
    if m:
        prefix = m.group(1).upper()
        num = int(m.group(2))
        if prefix == "L":
            prefix = "F"
        if prefix == "F" and 0 <= num <= 200:
            return f"F{num}"
        if prefix == "B" and 1 <= num <= 50:
            return f"B{num}"
    # Bare number -> assume above ground
    m2 = re.search(r"\b(\d{1,3})\b", n)
    if m2:
        num = int(m2.group(1))
        if 0 <= num <= 200:
            return f"F{num}"
    return "F0"


class ModuleEntry(BaseModel):
    """One relay module wired to an SCU."""

    dev_type: Literal["SRM_6E", "SRM_6S", "SRM_4S"]
    address: int = Field(..., ge=1, le=1023,
                         description="Physical bus address of the module (1..1023).")
    floor: str = Field(default="F0",
                       description="Floor strand label -- F0..F200 or B1..B50.  "
                       "Drives which floors exist in the project (2026-02-11).")
    note: str = Field(default="", max_length=120,
                      description="Operator-facing description (room / zone).")
    discovered: bool = Field(default=False,
                             description="True if this row came from /discover-srms rather than manual entry.")

    @field_validator("floor", mode="before")
    @classmethod
    def _normalise_floor(cls, v: str) -> str:
        return validate_strand_label(v or "F0")

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

    def strand_labels(self) -> list[str]:
        """Return the unique set of floor strand labels referenced by
        any module, in canonical order (basements first, then ground,
        then above-ground)."""
        seen: set[str] = set()
        for scu in self.scus:
            for m in scu.modules:
                seen.add(m.floor)
        return sorted(seen, key=strand_sort_key)


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
