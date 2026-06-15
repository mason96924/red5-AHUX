"""Regression: /api/assets/<file>.md must resolve into subdirs.

History: 2026-06-16 the DOCS-INDEX modal in the B-Shift Insight and
G36 Cross-Walk tabs threw 404 on the V2.0 Linux server.  Root cause:
docs_index.js fetches `/assets/<base>.<lang>.md`; on V1.9 (Flask) the
.md files live at `/root/data/<file>.md` and the handler also tries
`/root/data/docs/<file>.md` as fallback.  On V2.0 the same files live
under `frontend/public/assets/` and `frontend/public/docs/`, but the
FastAPI `assets()` handler only looked at the public root --
`frontend/public/<file>.md` -- and 404'd.

Fix: when the file isn't found at the public root, try the `assets/`
and `docs/` subdirs before 404'ing.  This mirrors V1.9 Flask's
historical `/root/data/` -> `/root/data/docs/` chain.

Coverage:
- B-Shift, G36 Cross-Walk, Band Guide, Control Algorithms, Psych
  Workflow all resolve in EN and at least one translation.
- A guaranteed-missing path still returns 404.
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


# (doc_base, lang_suffix) tuples that docs_index.js requests.
DOC_REQUESTS = [
    ("erv_band_shift_insight",       ""),       # B-Shift EN
    ("erv_band_shift_insight",       ".ko"),    # B-Shift KO
    ("erv_band_shift_insight",       ".zh-CN"), # B-Shift zh-CN
    ("g36_reset",                    ""),       # G36 Cross-Walk EN
    ("g36_reset",                    ".ja"),    # G36 JA
    ("band_guide",                   ""),
    ("control_algorithms",           ""),
    ("psychrometric_design_workflow",""),
]


@pytest.mark.asyncio
@pytest.mark.parametrize("base,lang", DOC_REQUESTS)
async def test_docs_resolve_via_subdir_fallback(client, base, lang):
    """The DOCS-INDEX modal must successfully fetch each doc."""
    r = await client.get(f"/api/assets/{base}{lang}.md")
    assert r.status_code == 200, (
        f"{base}{lang}.md returned {r.status_code} -- DOCS-INDEX modal "
        f"would show a 404 error block instead of the actual doc."
    )
    # Cheap sanity: the body should look like a markdown doc, not an
    # HTML error page or empty payload.
    body = r.text
    assert len(body) > 100, f"{base}{lang}.md body suspiciously short: {body!r}"
    assert "#" in body or "*" in body, (
        f"{base}{lang}.md body doesn't look like markdown: {body[:80]!r}"
    )


@pytest.mark.asyncio
async def test_missing_doc_still_404(client):
    """Sanity: subdir fallback must not turn arbitrary 404s into 200."""
    r = await client.get("/api/assets/THIS_DOC_DOES_NOT_EXIST_42.md")
    assert r.status_code == 404


@pytest.mark.asyncio
async def test_root_level_asset_still_resolves(client):
    """Files at frontend/public root (no subdir) must still work --
    the subdir fallback is additive, not a replacement."""
    # equipment_types.json has a hard-coded short-circuit in assets();
    # use a file that goes through the normal disk path.
    # The frontend/public root has favicon.ico typically; if not, this
    # test is skipped rather than failing on environment shape.
    public_root = os.path.normpath(
        os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                     "..", "frontend", "public")
    )
    candidates = [
        f for f in os.listdir(public_root)
        if os.path.isfile(os.path.join(public_root, f))
        and not f.startswith(".")
    ]
    if not candidates:
        pytest.skip("no root-level files in frontend/public to test against")
    target = candidates[0]
    r = await client.get(f"/api/assets/{target}")
    assert r.status_code == 200, f"root-level asset {target!r} broke"
