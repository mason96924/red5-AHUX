"""Regression: git-tracked frontend/public HTML must beat a stale DATA_ROOT copy.

History: 2026-08-18 AHUX (:8003 / ahux.dcred5-studio.com) showed the
color-coded AHU mode timeline after git pull, but dcred5-studio.com
(:8001) stayed on the old all-mint bar.  Causes: (1) pages._resolve_html
preferred /root/data/ahu.html; (2) nginx try_files served leftover
~/red5-studio/frontend/build/ahu.html.  This test locks the FastAPI
order.  Nginx must proxy /ahu.html to :8001.

    cd backend && python3 tests/test_resolve_html_prefers_public.py
"""
from __future__ import annotations

import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def main() -> int:
    print("test_resolve_html_prefers_public")
    src = open(os.path.join(ROOT, "routes", "pages.py"), encoding="utf-8").read()
    fn = src.split("def _resolve_html", 1)[1].split("def ", 1)[0]
    pub_at = fn.find("pub_path")
    fs_at = fn.find("fs_path")
    assert pub_at >= 0 and fs_at >= 0, "_resolve_html must consider both public and DATA_ROOT"
    assert pub_at < fs_at, (
        "frontend/public must be checked before DATA_ROOT so git pull of "
        "ahu.html is what dcred5-studio.com / :8001 serves"
    )
    assert 'os.path.isfile(pub_path)' in fn
    assert 'return pub_path' in fn
    assert '"ahu.html"' in src.split("_BUILD_STAMP_PAGES", 1)[1].split(")", 1)[0]
    print("  resolve-order source check OK")
    print("PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
