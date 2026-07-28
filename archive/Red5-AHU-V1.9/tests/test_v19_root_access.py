"""V1.9: verify GET / serves access.html (Access Control), not landing.html.

Routes live in pages_service.py (plug-in) so app.py stays under the
enteliWEB size budget.  Deploy via bundle upload — no app.py paste needed.

Run from archive/Red5-AHU-V1.9/:
    python3 tests/test_v19_root_access.py
"""
from __future__ import annotations

import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
V19 = os.path.dirname(HERE)
PAGES = os.path.join(V19, "pages_service.py")


def test_source_routes() -> None:
    src = open(PAGES, encoding="utf-8").read()
    assert "_root_is_access" in src
    assert "access.html" in src
    assert re.search(r"@app\.route\(['\"]/access\.html['\"]\)", src)
    app_src = open(os.path.join(V19, "app.py"), encoding="utf-8").read()
    assert not re.search(r"@app\.route\(['\"]/access\.html['\"]\)", app_src)
    print("  source routes OK")


def test_flask_client() -> None:
    try:
        import flask  # noqa: F401
    except ImportError:
        print("  Flask client SKIPPED (pip install flask flask-cors)")
        return

    os.environ.setdefault("RED5_MASTER_KEY", "test-key")
    flask.Flask.run = lambda *a, **k: None  # type: ignore[method-assign]

    import app as app_mod  # noqa: E402

    access_src = open(os.path.join(V19, "access.html"), encoding="utf-8").read()
    assert "RED5 STUDIO" in access_src and "brand-ahu" in access_src

    real_isfile = os.path.isfile
    real_send = app_mod.send_from_directory

    def _isfile(path):
        if path.endswith("access.html"):
            return True
        return real_isfile(path)

    def _send(directory, filename):
        if filename == "access.html":
            from flask import Response
            return app_mod._no_cache(Response(access_src, mimetype="text/html"))
        return real_send(directory, filename)

    app_mod.os.path.isfile = _isfile
    app_mod.send_from_directory = _send

    client = app_mod.app.test_client()
    r_root = client.get("/")
    r_access = client.get("/access.html")
    assert r_root.status_code == 200
    assert r_access.status_code == 200
    assert b"RED5 STUDIO" in r_root.data
    assert r_root.data == r_access.data
    print("  Flask client OK")


def main() -> int:
    print("test_v19_root_access")
    test_source_routes()
    test_flask_client()
    print("PASS")
    return 0


if __name__ == "__main__":
    sys.path.insert(0, V19)
    raise SystemExit(main())
