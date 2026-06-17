"""Regression: /api/data response must include `active_band` per AHU.

History: 2026-06-17 the operator reported the yellow "BAND B5" pill at
the top of the AHU Equipment Diagram modal rendered in V2.0 but NOT in
V1.9.  Root cause was V1.9-side: `telemetry_service.api_data()` rebuilt
its own output dict and dropped the `active_band` field that
`collector.py` had written into telemetry.json.  V2.0's
`backend/server.py:_synth_ahu_state` (line ~399) DID include it.

V1.9 has been patched (collector pass-through + simulator fallback +
mock-mode in-line band classification).  These tests freeze the V2.0
contract so the field can never silently disappear again -- if it does,
the pill stops rendering and operators get no band feedback in the
graphic.
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
async def test_data_response_includes_active_band_per_ahu(client):
    r = await client.get("/api/data")
    assert r.status_code == 200, r.text
    body = r.json()
    assert isinstance(body, list) and len(body) > 0, "Expected at least one AHU"
    for ahu in body:
        ab = ahu.get("active_band")
        assert ab is not None, (
            f"AHU {ahu.get('id')!r} has no `active_band` -- the BAND pill "
            f"at the top of the AHU Equipment Diagram modal renders only "
            f"when this field is present.  Dropping it breaks V1.9 parity."
        )
        # The pill text is built from `active_band.id`.  Must be a non-empty string.
        assert isinstance(ab.get("id"), str) and ab["id"], (
            f"active_band.id must be a non-empty string for AHU "
            f"{ahu.get('id')!r}; got {ab.get('id')!r}"
        )
        # The G36/Sun-trim helper (red5BandSunTrim) reads cc_mode/hc_mode/
        # hum_mode -- protect those keys too.
        for k in ("cc_mode", "hc_mode", "hum_mode"):
            assert k in ab, (
                f"active_band missing required key {k!r} for AHU "
                f"{ahu.get('id')!r}; sun-trim helper will throw."
            )
