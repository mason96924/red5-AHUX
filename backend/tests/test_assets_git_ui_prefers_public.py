"""Regression: git-tracked dashboard.compiled.js must beat /root/data.

History: 2026-08-19 AHUX (:8003) showed the undimmed process mini-psychart
after git pull, but AHU (:8001 / dcred5-studio.com) did not.  Cause:
assets() served /root/data/dashboard.compiled.js (DATA_ROOT-first) while
pages._resolve_html already preferred frontend/public/dashboard.html.
The HTML gained .red5-undim CSS; the stale JS never put the class on
the badge.

    cd backend && python3 tests/test_assets_git_ui_prefers_public.py
"""
from __future__ import annotations

import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def main() -> int:
    print("test_assets_git_ui_prefers_public")
    src = open(os.path.join(ROOT, "routes", "assets.py"), encoding="utf-8").read()
    assert "_GIT_UI_ASSETS" in src
    assert "dashboard.compiled.js" in src.split("_GIT_UI_ASSETS", 1)[1].split(")", 1)[0]
    assert "_git_ui_beats_data_root" in src
    assert "not (" in src and "_git_ui_beats_data_root(path)" in src
    assert "os.path.isfile(full)" in src
    print("  git-UI-before-DATA_ROOT source check OK")
    print("PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
