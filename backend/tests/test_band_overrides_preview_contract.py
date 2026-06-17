"""Regression: /api/band-overrides/preview must return the V1.9 shape
the dashboard reads.

History: 2026-06-17 operator clicked "Apply to Controller" on the
band RH range and the dashboard crashed with:

    TypeError: Cannot read properties of undefined (reading 'filter')

Root cause was a V2.0/V1.9 contract drift.  V1.9 Flask's
`band_overrides_service` returned:

    {"status": "ok", "preview": [{id, name, before, after, changed, direction}, ...]}

V2.0's FastAPI returned a totally different shape:

    {"status": "ok", "lo", "hi", "total_bands", "affected_bands", "affected": [...]}

The dashboard's `onApply` handler does:

    setBandClampModal({ lo, hi, preview: j.preview });

...and the confirm modal then does:

    const changed = preview.filter(p => p.changed);

so `j.preview === undefined` → `.filter()` on undefined → React crash.

The V2.0 endpoint was rewritten to mirror the V1.9 shape exactly.
These tests freeze that contract.
"""
from __future__ import annotations

import os
import sys

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from server import app  # noqa: E402


@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as c:
        yield c


@pytest.mark.asyncio
async def test_preview_returns_v1_9_shape(client):
    r = await client.get("/api/band-overrides/preview", params={"lo": 40, "hi": 60})
    assert r.status_code == 200, r.text
    j = r.json()
    # Top-level fields the dashboard reads.
    assert j.get("status") == "ok"
    assert "preview" in j, (
        "Response is missing the `preview` array.  Without it the "
        "dashboard's Apply-to-Controller confirm modal crashes at "
        "preview.filter(...).  Do not rename this field."
    )
    assert isinstance(j["preview"], list) and len(j["preview"]) > 0
    # Per-band shape -- locked because the modal renders these exact keys.
    for row in j["preview"]:
        for k in ("id", "name", "before", "after", "changed", "direction"):
            assert k in row, f"preview row missing key {k!r}: {row!r}"
        for sub in ("sa_rh", "hum"):
            assert sub in row["before"], f"before missing {sub!r}: {row!r}"
            assert sub in row["after"],  f"after  missing {sub!r}: {row!r}"
        assert isinstance(row["changed"], bool)
        assert row["direction"] in (None, "up", "down")


@pytest.mark.asyncio
async def test_preview_marks_changed_when_clamping(client):
    """A tight clamp window must flag at least one band as `changed`."""
    r = await client.get("/api/band-overrides/preview", params={"lo": 48, "hi": 52})
    assert r.status_code == 200
    preview = r.json()["preview"]
    changed = [p for p in preview if p["changed"]]
    assert len(changed) > 0, "48-52% RH window should clamp at least one band"
    # Direction must be self-consistent: down means new<original, up means new>original.
    for p in changed:
        if p["direction"] == "down":
            assert p["after"]["sa_rh"] < p["before"]["sa_rh"]
            assert p["after"]["hum"] == "DEHUMIDIFY"
        elif p["direction"] == "up":
            assert p["after"]["sa_rh"] > p["before"]["sa_rh"]
            assert p["after"]["hum"] == "HUMIDIFY"


@pytest.mark.asyncio
async def test_preview_swapped_args_normalised(client):
    """Caller passing lo>hi should not 500 -- V1.9 silently swaps them."""
    r = await client.get("/api/band-overrides/preview", params={"lo": 60, "hi": 40})
    assert r.status_code == 200
    j = r.json()
    assert j.get("status") == "ok"
    assert isinstance(j.get("preview"), list) and len(j["preview"]) > 0
