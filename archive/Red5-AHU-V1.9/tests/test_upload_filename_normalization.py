"""Regression test for the file-upload "(N)" rename bug.

Background
----------
When an operator clicks "Upload File" in the equipment_mapper.html config
landing page and selects equipment_mapper.html from their local Downloads
folder, the browser (Chrome/Firefox) may have already auto-renamed the
local copy to ``equipment_mapper (1).html`` because they downloaded the
same file twice.  The File API faithfully reports the local filename,
so without intervention the controller ends up with a brand new
``equipment_mapper (1).html`` sibling next to the original instead of
overwriting -- which the operator (rightly) considers a bug because
"Upload" is intended as a deploy action.

Fix
---
``equipment_mapper.html`` applies a frontend ``normalizeUploadFilename``
helper that strips a trailing ``" (N)"`` suffix from the *stem* before
sending.  This test asserts:

1. The helper exists in all three parity copies (V1.9, V2.0,
   frontend/public) and contains the canonical regex.
2. The backend ``/api/upload-file`` route overwrites an existing file
   (not appending ``(1)``) when handed the same filename twice.
"""
from __future__ import annotations

import base64
import importlib
import json
import os
import re
import sys
from pathlib import Path

import pytest


REPO = Path(__file__).resolve().parents[1]
V19  = REPO
V20  = REPO.parents[0] / "Red5-AHU-V2.0"
PUB  = REPO.parents[1] / "frontend" / "public"

PARITY_COPIES = [
    V19 / "equipment_mapper.html",
    V20 / "equipment_mapper.html",
    PUB / "equipment_mapper.html",
]


# ---------------------------------------------------------------------------
# Frontend helper presence (parity guard)
# ---------------------------------------------------------------------------

NORMALIZE_REGEX_SNIPPET = r"replace(/(\s*\(\d+\))+\s*$/, '')"


@pytest.mark.parametrize("path", PARITY_COPIES, ids=lambda p: p.parts[-3])
def test_normalize_helper_present(path: Path) -> None:
    assert path.exists(), f"missing parity copy: {path}"
    src = path.read_text(encoding="utf-8")
    assert "normalizeUploadFilename" in src, (
        f"{path}: normalizeUploadFilename helper missing -- the upload-rename "
        "regression guard was removed."
    )
    assert NORMALIZE_REGEX_SNIPPET in src, (
        f"{path}: canonical strip regex {NORMALIZE_REGEX_SNIPPET!r} missing -- "
        "the helper was modified in a way that may not strip (N) suffixes."
    )


@pytest.mark.parametrize("path", PARITY_COPIES, ids=lambda p: p.parts[-3])
def test_upload_paths_use_helper(path: Path) -> None:
    """Both single-file and directory upload paths must route through
    ``normalizeUploadFilename`` -- otherwise the bug recurs in one path."""
    src = path.read_text(encoding="utf-8")
    # Single-file path
    assert "normalizeUploadFilename(file.name)" in src, (
        f"{path}: single-file upload path no longer calls normalizeUploadFilename."
    )
    # Directory upload path
    assert "normalizeUploadFilename(rawRelPath)" in src, (
        f"{path}: directory upload path no longer calls normalizeUploadFilename."
    )


@pytest.mark.parametrize("path", PARITY_COPIES, ids=lambda p: p.parts[-3])
def test_upload_uses_native_alert(path: Path) -> None:
    """Upload result popup MUST use the browser-native ``alert()`` so
    the look-and-feel matches the delete-file ``confirm()`` dialog the
    operator already knows.  Per direct operator feedback (2026-06-09),
    a custom React modal -- however polished -- breaks muscle memory
    and is treated as a regression.  Guards:

    1. Both upload handlers call ``alert(`` (not ``setUploadResult(`` or
       any other in-page modal trigger).
    2. No leftover ``uploadResult`` state / modal JSX in the page.
    """
    src = path.read_text(encoding="utf-8")

    # 1) Both upload handlers use alert() — count the alert(...) calls
    #    inside the upload block (between uploadFileToController and
    #    createDirectoryOnController).  Strip // comments first because
    #    the explanatory comments next to the call also mention alert().
    upload_block_start = src.index("const uploadFileToController = ")
    upload_block_end   = src.index("const createDirectoryOnController = ")
    block = src[upload_block_start:upload_block_end]
    code_only = "\n".join(
        line for line in block.splitlines()
        if not line.lstrip().startswith("//")
    )
    alert_calls = code_only.count("alert(")
    assert alert_calls >= 2, (
        f"{path}: expected >=2 alert() calls in upload block "
        f"(single-file + directory), found {alert_calls}.  "
        "Upload popup must match the delete-confirm native dialog look."
    )

    # 2) No custom modal regression.
    assert "setUploadResult(" not in src, (
        f"{path}: setUploadResult / custom upload-result modal regressed in -- "
        "operator requires native browser alert() to match delete-confirm UX."
    )
    assert 'data-testid="upload-result-modal"' not in src, (
        f"{path}: custom upload-result modal JSX still present in DOM."
    )


# ---------------------------------------------------------------------------
# JS-equivalent reference impl -- proves the regex behaves as advertised.
# ---------------------------------------------------------------------------

_STRIP = re.compile(r"(\s*\(\d+\))+\s*$")


def _normalize(name: str) -> str:
    if not name:
        return name
    if "/" in name:
        dir_, leaf = name.rsplit("/", 1)
        dir_ = dir_ + "/"
    else:
        dir_, leaf = "", name
    if "." in leaf and not leaf.startswith("."):
        stem, ext = leaf.rsplit(".", 1)
        ext = "." + ext
    else:
        stem, ext = leaf, ""
    clean = _STRIP.sub("", stem)
    return dir_ + (clean or stem) + ext


@pytest.mark.parametrize(
    "raw,expected",
    [
        ("equipment_mapper.html",                "equipment_mapper.html"),
        ("equipment_mapper (1).html",            "equipment_mapper.html"),
        ("equipment_mapper (12).html",           "equipment_mapper.html"),
        ("equipment_mapper (1) (2).html",        "equipment_mapper.html"),
        ("dashboard.html",                       "dashboard.html"),
        ("graphics/equipments/AHUs/ahu (3).svg", "graphics/equipments/AHUs/ahu.svg"),
        ("(1).html",                             "(1).html"),  # nothing left if stripped -- keep original
        ("noext (1)",                            "noext"),
        ("name(1).html",                         "name.html"),
        ("a (1) b (2).html",                     "a (1) b.html"),  # only trailing run stripped
    ],
)
def test_normalize_reference_impl(raw: str, expected: str) -> None:
    assert _normalize(raw) == expected


# ---------------------------------------------------------------------------
# Backend overwrite guarantee -- /api/upload-file MUST overwrite on repeat
# ---------------------------------------------------------------------------

@pytest.fixture
def flask_app(tmp_path, monkeypatch):
    """Spin up the V1.9 Flask app pointed at a sandboxed DATA_ROOT."""
    data_root = tmp_path / "data"
    scripts_root = tmp_path / "scripts"
    data_root.mkdir()
    scripts_root.mkdir()

    # ``app.py`` calls ``app.run()`` at module scope (it is meant to be
    # executed directly on the controller, not imported).  Neutralise
    # that side-effect before importing so the test fixture doesn't
    # try to bind port 5001.
    import flask
    monkeypatch.setattr(flask.Flask, "run", lambda *a, **kw: None)
    # Background services are noisy and time-sensitive in tests.
    monkeypatch.setenv("RED5_DISABLE_BG_THREADS", "1")

    sys.path.insert(0, str(REPO))
    if "app" in sys.modules:
        del sys.modules["app"]
    app_mod = importlib.import_module("app")
    # Redirect filesystem roots to the sandbox.  The handler resolves
    # paths through ALLOWED_ROOTS, so patching that dict (plus the two
    # module-level constants for any helper that still reads them) is
    # sufficient.
    monkeypatch.setattr(app_mod, "DATA_ROOT",    str(data_root))
    monkeypatch.setattr(app_mod, "SCRIPTS_ROOT", str(scripts_root))
    monkeypatch.setitem(app_mod.ALLOWED_ROOTS, "data",    str(data_root))
    monkeypatch.setitem(app_mod.ALLOWED_ROOTS, "scripts", str(scripts_root))
    app_mod.app.config["TESTING"] = True
    try:
        yield app_mod.app, data_root
    finally:
        sys.path.remove(str(REPO))


def _b64(payload: bytes) -> str:
    return "data:application/octet-stream;base64," + base64.b64encode(payload).decode("ascii")


def test_upload_overwrites_existing_file(flask_app):
    app, data_root = flask_app
    client = app.test_client()

    # First upload -- creates the file.
    r1 = client.post(
        "/api/upload-file",
        data=json.dumps({"filename": "equipment_mapper.html", "file_data": _b64(b"VERSION-1"), "root": "data"}),
        content_type="application/json",
    )
    assert r1.status_code == 200, r1.data
    assert r1.get_json()["success"] is True

    # Second upload -- same name, new payload.  MUST overwrite.
    r2 = client.post(
        "/api/upload-file",
        data=json.dumps({"filename": "equipment_mapper.html", "file_data": _b64(b"VERSION-2"), "root": "data"}),
        content_type="application/json",
    )
    assert r2.status_code == 200, r2.data
    assert r2.get_json()["success"] is True

    target = data_root / "equipment_mapper.html"
    assert target.read_bytes() == b"VERSION-2", "second upload did not overwrite"

    # Backend never invents a "(1)" sibling.
    siblings = sorted(p.name for p in data_root.iterdir())
    assert siblings == ["equipment_mapper.html"], (
        f"backend created unexpected siblings: {siblings} -- "
        "any '(1)' file means dedupe logic crept in."
    )


def test_upload_respects_caller_provided_paren_one_name(flask_app):
    """If a caller *explicitly* sends 'foo (1).html', the backend writes
    that name verbatim -- it is the FRONTEND's job to scrub, not the
    backend's.  This locks the contract in place."""
    app, data_root = flask_app
    client = app.test_client()
    r = client.post(
        "/api/upload-file",
        data=json.dumps({"filename": "equipment_mapper (1).html", "file_data": _b64(b"x"), "root": "data"}),
        content_type="application/json",
    )
    assert r.status_code == 200
    assert (data_root / "equipment_mapper (1).html").exists()
