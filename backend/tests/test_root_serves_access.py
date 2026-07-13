"""Verify GET / serves Access Control (access.html), not the old landing page.

Run on Mac or server venv:
    cd backend && python3 tests/test_root_serves_access.py
"""
from __future__ import annotations

import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = os.path.dirname(ROOT)
sys.path.insert(0, ROOT)


def _static_checks() -> None:
    pages = open(os.path.join(ROOT, "routes", "pages.py"), encoding="utf-8").read()
    root_block = pages.split("def _serve_root")[1].split("@router.get")[0]
    assert 'return _serve("access.html")' in root_block
    assert 'return _serve("landing.html")' not in root_block

    app = open(os.path.join(REPO, "archive", "Red5-Studio-V1.9", "app.py"), encoding="utf-8").read()
    m = re.search(
        r"@app\.route\('/'\)\ndef serve_root_access\(\):.*?send_from_directory\('/root/data', '(\w+\.html)'\)",
        app,
        re.S,
    )
    assert m and m.group(1) == "access.html"

    access = open(os.path.join(REPO, "frontend", "public", "access.html"), encoding="utf-8").read()
    landing = open(os.path.join(REPO, "frontend", "public", "landing.html"), encoding="utf-8").read()
    assert "Access Control" in access
    assert "Access Control" not in landing
    print("  static checks OK")


def _http_checks() -> None:
    os.environ.setdefault("MONGO_URL", "mongodb://localhost:27017")
    os.environ.setdefault("DB_NAME", "red5_test_root_access")
    os.environ.setdefault("RED5_MASTER_KEY", "test-key")
    os.environ["COOKIE_SECURE"] = "false"

    from fastapi.testclient import TestClient  # noqa: PLC0415
    import server  # noqa: PLC0415

    client = TestClient(server.app)
    r_root = client.get("/")
    r_access = client.get("/access.html")
    r_landing = client.get("/landing.html")

    assert r_root.status_code == 200, r_root.text[:200]
    assert r_access.status_code == 200, r_access.text[:200]
    assert "Access Control" in r_root.text, "GET / must serve access.html"
    assert r_root.text == r_access.text, "GET / and GET /access.html must match"
    assert "Red5 Studio" in r_landing.text or "Building Diagnostic" in r_landing.text
    print("  HTTP checks OK")


def main() -> int:
    print("test_root_serves_access")
    _static_checks()
    try:
        _http_checks()
    except ImportError as exc:
        print(f"  HTTP checks SKIPPED ({exc}) — run on server venv for full test")
    print("PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
