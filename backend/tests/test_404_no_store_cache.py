"""Regression: 404 responses from /api/assets and /api/thumb must NOT be
sticky-cached by browsers.

History: 2026-06-17 the operator reported AHU_TYPE_01.jpg showing "No
preview" on their Mac but rendering correctly on their Linux PC -- both
hitting the same V2.0 Linux server, same logged-in tenant, same image
data in MongoDB.  Root cause: an earlier 404 (from before the image was
fully uploaded) had been heuristically cached by Safari/Chrome.  Without
an explicit `Cache-Control: no-store` on the 404 response, browsers are
free to keep serving the stale "not found" verdict for minutes to days,
diverging across PCs.

Fix: every 404 emitted by /api/assets and /api/thumb now carries
`Cache-Control: no-store`.  After a re-upload, the next request goes
through to the server and the image appears immediately on every PC.

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
async def test_assets_404_has_no_store(client):
    r = await client.get("/api/assets/THIS_FILE_DOES_NOT_EXIST_404.md")
    assert r.status_code == 404
    cc = r.headers.get("cache-control", "")
    assert "no-store" in cc.lower(), (
        f"404 from /api/assets MUST send Cache-Control: no-store so the "
        f"browser doesn't sticky-cache the miss across PCs.  Got: {cc!r}"
    )


@pytest.mark.asyncio
async def test_thumb_404_has_no_store(client):
    r = await client.get("/api/thumb", params={"path": "NONEXISTENT_42.jpg"})
    assert r.status_code == 404
    cc = r.headers.get("cache-control", "")
    assert "no-store" in cc.lower(), (
        f"404 from /api/thumb MUST send Cache-Control: no-store.  Got: {cc!r}"
    )


@pytest.mark.asyncio
async def test_assets_alias_404_has_no_store(client):
    """The bare `/assets/<path>` alias (used by the shared dashboard.html)
    must also emit no-store on 404.  Same contract as /api/assets."""
    r = await client.get("/assets/THIS_FILE_DOES_NOT_EXIST_404.md")
    assert r.status_code == 404
    cc = r.headers.get("cache-control", "")
    assert "no-store" in cc.lower(), (
        f"404 from /assets alias MUST send Cache-Control: no-store.  Got: {cc!r}"
    )


@pytest.mark.asyncio
async def test_js_alias_serves_docs_index(client):
    """Relative ``js/docs_index.js`` from dashboard.html must 200.

    Without this alias, uvicorn-direct (AHUX Cloudflare → :8003) 404s
    and the dashboard crashes: ReferenceError: red5DocsIndex is not defined.
    """
    r = await client.get("/js/docs_index.js")
    assert r.status_code == 200, r.text[:200]
    assert "red5DocsIndex" in r.text


@pytest.mark.asyncio
async def test_js_alias_404_has_no_store(client):
    r = await client.get("/js/THIS_FILE_DOES_NOT_EXIST_404.js")
    assert r.status_code == 404
    cc = r.headers.get("cache-control", "")
    assert "no-store" in cc.lower(), (
        f"404 from /js alias MUST send Cache-Control: no-store.  Got: {cc!r}"
    )
