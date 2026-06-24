"""models/loaders.py -- demo-data file readers + in-memory cache.

Phase L.30 (2026-06-24): extracted from server.py.  Tiny wrappers around
`open()` that cache the parsed result in `_CACHE` so repeated reads of
`equipment_types.json` / `band_guide.csv` / `tier_color.json` etc. on a
hot dashboard don't re-hit the disk.

Both the simulator (which uses `_load_csv("band_guide.csv")` in
`_resolve_band`) and several router groups need these, so they live in
`models/` where everything else can `from models.loaders import ...`.
The cache lives at module scope so all callers share the same dict.
"""
from __future__ import annotations

import csv
import json
import os
from typing import Any

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEMO_DATA_DIR = os.path.join(ROOT, "demo_data")

_CACHE: dict[str, Any] = {}


def _load_json(name: str) -> Any:
    if name not in _CACHE:
        with open(os.path.join(DEMO_DATA_DIR, name), "r") as f:
            _CACHE[name] = json.load(f)
    return _CACHE[name]


def _load_csv(name: str) -> list[dict]:
    key = "csv:" + name
    if key not in _CACHE:
        with open(os.path.join(DEMO_DATA_DIR, name), "r") as f:
            rows = list(csv.DictReader(f))
        _CACHE[key] = rows
    return _CACHE[key]
