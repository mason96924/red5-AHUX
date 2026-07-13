"""routes/pages.py — top-level HTML page routes (V1.9 parity).

Serves user-facing pages at ``/`` (Access Control) and ``/<page>.html`` without the
``/api/assets/`` prefix so operators can open ``http://host:8001/`` directly.
"""
from __future__ import annotations

import os
from typing import Optional

from fastapi import APIRouter, HTTPException
from fastapi.responses import HTMLResponse, Response

from models.fs import _fs_available, _fs_root

_server = None  # type: ignore[assignment]


def _import_server():
    global _server
    if _server is None:
        import server as _s  # noqa: PLC0415
        _server = _s
    return _server


router = APIRouter()

_NO_CACHE = {
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    "Pragma": "no-cache",
    "Expires": "0",
}

_BUILD_STAMP_PAGES = frozenset({"dashboard.html", "equipment_mapper.html"})


def _public_root() -> str:
    s = _import_server()
    return os.path.normpath(os.path.join(s.ROOT, "..", "frontend", "public"))


def _resolve_html(filename: str) -> Optional[str]:
    if _fs_available("data"):
        fs_path = os.path.join(_fs_root("data"), filename)
        if os.path.isfile(fs_path):
            return fs_path
    pub_path = os.path.join(_public_root(), filename)
    if os.path.isfile(pub_path):
        return pub_path
    return None


def _html_response(path: str, *, build_stamp: bool = False) -> Response:
    try:
        mtime = int(os.path.getmtime(path))
    except OSError:
        mtime = 0
    try:
        with open(path, "rb") as fh:
            body = fh.read()
    except OSError as exc:
        raise HTTPException(404, f"page not found: {os.path.basename(path)}") from exc
    if build_stamp:
        inject = (
            f"<script>window.__BUILD_MTIME__={mtime};</script>"
        ).encode("utf-8")
        if b"</head>" in body:
            body = body.replace(b"</head>", inject + b"</head>", 1)
        else:
            body = inject + body
    return HTMLResponse(content=body, headers=_NO_CACHE)


def _serve(filename: str) -> Response:
    path = _resolve_html(filename)
    if not path:
        raise HTTPException(404, f"page not found: {filename}")
    return _html_response(path, build_stamp=filename in _BUILD_STAMP_PAGES)


def _serve_root() -> Response:
    """``/`` is the Access Control sign-in (same as access.html)."""
    if not _resolve_html("access.html"):
        html = (
            '<!doctype html><meta http-equiv="refresh" content="0; url=/update.html">'
            "<p>Controller not yet provisioned. Redirecting to "
            '<a href="/update.html">/update.html</a>...</p>'
        )
        return HTMLResponse(content=html, headers=_NO_CACHE)
    return _serve("access.html")


@router.get("/", include_in_schema=False)
async def root_access() -> Response:
    return _serve_root()


@router.get("/landing.html", include_in_schema=False)
async def landing_html() -> Response:
    return _serve("landing.html")


@router.get("/access.html", include_in_schema=False)
async def access_html() -> Response:
    return _serve("access.html")


@router.get("/setup.html", include_in_schema=False)
async def setup_html() -> Response:
    return _serve("setup.html")


@router.get("/dashboard", include_in_schema=False)
@router.get("/dashboard.html", include_in_schema=False)
async def dashboard_html() -> Response:
    return _serve("dashboard.html")


@router.get("/mapper", include_in_schema=False)
@router.get("/equipment_mapper.html", include_in_schema=False)
async def mapper_html() -> Response:
    return _serve("equipment_mapper.html")


@router.get("/ahu.html", include_in_schema=False)
async def ahu_html() -> Response:
    return _serve("ahu.html")


@router.get("/sun_preview.html", include_in_schema=False)
async def sun_preview_html() -> Response:
    return _serve("sun_preview.html")


@router.get("/update.html", include_in_schema=False)
async def update_html() -> Response:
    return _serve("update.html")


@router.get("/mobile", include_in_schema=False)
@router.get("/mobile_mockup.html", include_in_schema=False)
async def mobile_html() -> Response:
    return _serve("mobile_mockup.html")


@router.get("/psy_3d.html", include_in_schema=False)
async def psy_3d_html() -> Response:
    return _serve("psy_3d.html")


@router.get("/deepdive.html", include_in_schema=False)
async def deepdive_html() -> Response:
    return _serve("deepdive.html")
