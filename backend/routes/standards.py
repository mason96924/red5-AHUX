"""routes/standards.py — Standards documents read-only API.

Extracted from `server.py` (Phase L.28, 2026-06-24).  Surfaces the
curated set of `*.md` files under `frontend/public/docs/` to the
dashboard's "Standards" modal so a consulting engineer or commissioning
agent can read the band guide, G36 cross-walk, control algorithms,
etc. right inside the dashboard.  Whitelist-only — anything not listed
in `_STANDARDS_CATALOG` returns 404 to keep the surface tight and
prevent accidental exposure of operator-private docs.
"""
from __future__ import annotations

import os
from typing import Any

from fastapi import APIRouter, HTTPException
from fastapi.responses import PlainTextResponse

router = APIRouter()

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

_STANDARDS_CATALOG: list[dict] = [
    {"slug": "g36_reset",                     "title": "ASHRAE Guideline 36 \u2014 Trim-and-Respond Cross-Walk",  "category": "Standards"},
    {"slug": "band_guide",                    "title": "Givoni Band Guide (dyn-reset knob reference)",            "category": "Algorithms"},
    {"slug": "control_algorithms",            "title": "Control Algorithms \u2014 Full Reference",               "category": "Algorithms"},
    {"slug": "control_strategy_insight",      "title": "Control Strategy Insight",                                "category": "Algorithms"},
    {"slug": "psychrometric_design_workflow", "title": "Psychrometric Design Workflow",                           "category": "Design"},
    {"slug": "erv_band_shift_insight",        "title": "ERV Band Shift Insight",                                  "category": "Design"},
    {"slug": "opt_sa_insight",                "title": "Optimal Supply-Air Setpoint Insight",                     "category": "Design"},
    {"slug": "data_bridges_guide",            "title": "BACnet / Modbus Data Bridges",                            "category": "Integration"},
]


def _docs_root() -> str:
    return os.path.normpath(os.path.join(ROOT, "..", "frontend", "public", "docs"))


@router.get("/api/standards")
async def list_standards() -> dict:
    """List the available standards documents with title + category."""
    docs_root = _docs_root()
    items = []
    for entry in _STANDARDS_CATALOG:
        full = os.path.join(docs_root, entry["slug"] + ".md")
        items.append({**entry, "available": os.path.isfile(full)})
    return {"items": items}


@router.get("/api/standards/{slug}")
async def get_standard(slug: str) -> Any:
    """Return the raw markdown body for one whitelisted doc."""
    if not any(d["slug"] == slug for d in _STANDARDS_CATALOG):
        raise HTTPException(404, "unknown standards slug")
    docs_root = _docs_root()
    full = os.path.normpath(os.path.join(docs_root, slug + ".md"))
    if not full.startswith(docs_root) or not os.path.isfile(full):
        raise HTTPException(404, "doc missing on disk")
    with open(full, "rb") as f:
        body = f.read().decode("utf-8")
    return PlainTextResponse(body,
                             headers={"Cache-Control": "public, max-age=300",
                                      "Content-Type": "text/markdown; charset=utf-8"})
