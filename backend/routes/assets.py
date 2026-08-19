"""routes/assets.py — Asset & thumbnail serving.

Extracted from `server.py` in Phase L.28 (2026-06-24).  Three handlers:

  * `GET /api/assets/{path:path}` -- serves files from the dual-mode
    resolver: public tree for git-tracked UI (dashboard.compiled.js,
    HTML, tailwind CSS), else FS root (`/root/data`) -> public tree ->
    tenant_assets -> zero-pad fallback.  Binary-safe with mimetype guessing.
    Site graphics stay DATA_ROOT-first (V1.9 parity).  Git UI must not,
    or Linux AHU :8001 keeps a stale /root/data/dashboard.compiled.js
    after git pull while AHUX :8003 (no DATA_ROOT JS shadow) looks current.
  * `GET /assets/{path:path}` -- bare alias; V1.9's Flask backend serves
    images at /assets/<path> and the shared dashboard.html (mirrored
    across V1.9 and V2.0) uses that URL form.  Forwards to the same view.
  * `GET /api/thumb` -- normalised raster preview for the image picker,
    fixes the Windows-Chrome "CMYK JPEG shows No preview" bug by
    re-encoding through Pillow into vanilla sRGB PNG.

Phase L.30 (2026-06-24): the FS helpers + 404 helper moved to
models/fs.py; the data-loader cache (`_load_json`, `DEMO_DATA_DIR`,
`ROOT`) is the last remaining server-module reference, imported lazily
on first request to keep the existing demo state intact.
"""
from __future__ import annotations

import json
import os
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import (
    JSONResponse,
    PlainTextResponse,
    Response as FastResponse,
)

from tenants import current_tenant_optional, read_tenant_asset
from models.fs import (
    _fs_available,
    _fs_root,
    _safe_join,
    _zero_pad_variants,
    _404_no_cache,
)

# `_load_json`, `DEMO_DATA_DIR`, `ROOT` still live in server.py because they
# back the demo-mode telemetry cache.  Imported lazily so this router can be
# wired in alongside the others without circular-dependency risk.
_server = None  # type: ignore[assignment]


def _import_server():
    global _server
    if _server is None:
        import server as _s  # noqa: PLC0415
        _server = _s
    return _server


router = APIRouter()

# Git-tracked UI that must beat a leftover /root/data copy after git pull.
# Keep this list to compiled shells + HTML; photos/configs stay DATA_ROOT-first.
_GIT_UI_ASSETS = frozenset({
    "dashboard.compiled.js",
    "dashboard.tailwind.css",
    "setup_walk.compiled.js",
})


def _git_ui_beats_data_root(path: str) -> bool:
    base = os.path.basename((path or "").replace("\\", "/"))
    return base in _GIT_UI_ASSETS or base.endswith(".html")


@router.get("/api/assets/{path:path}")
async def assets(path: str, request: Request,
                 tenant: Optional[dict] = Depends(current_tenant_optional)):
    s = _import_server()
    public_root = os.path.normpath(os.path.join(s.ROOT, "..", "frontend", "public"))
    full = os.path.normpath(os.path.join(public_root, path))
    if not full.startswith(public_root):
        raise HTTPException(403, "path traversal")
    if path in ("configs/equipment_types.json", "equipment_types.json"):
        return JSONResponse(s._load_json("equipment_types.json"),
                            headers={"Cache-Control": "no-store"})
    # V1.9 parity: site graphics from /root/data first when that FS exists.
    # Do not let that shadow git UI (dashboard.compiled.js) — AHU :8001
    # would keep the old undim-less bundle after git pull.
    if _fs_available("data") and not (
            _git_ui_beats_data_root(path) and os.path.isfile(full)):
        fs_full = _safe_join(_fs_root("data"), path)
        if fs_full and os.path.isfile(fs_full):
            full = fs_full
        else:
            for variant in _zero_pad_variants(path):
                fs_variant = _safe_join(_fs_root("data"), variant)
                if fs_variant and os.path.isfile(fs_variant):
                    full = fs_variant
                    break
    if not os.path.exists(full):
        # Signed-in users get their tenant_assets bytes served back here.
        if tenant:
            doc = await read_tenant_asset(tenant, path)
            if doc and doc.get("data_bytes"):
                ctype = doc.get("content_type") or "application/octet-stream"
                return FastResponse(content=doc["data_bytes"], media_type=ctype,
                                    headers={"Cache-Control": "no-store"})
            for variant in _zero_pad_variants(path):
                doc = await read_tenant_asset(tenant, variant)
                if doc and doc.get("data_bytes"):
                    ctype = doc.get("content_type") or "application/octet-stream"
                    return FastResponse(content=doc["data_bytes"], media_type=ctype,
                                        headers={"Cache-Control": "no-store"})
        alt = os.path.join(s.DEMO_DATA_DIR, os.path.basename(path))
        if os.path.exists(alt):
            full = alt
        else:
            # Disk-side zero-pad fallback for the demo public tree.
            for variant in _zero_pad_variants(path):
                variant_full = os.path.normpath(os.path.join(public_root, variant))
                if variant_full.startswith(public_root) and os.path.exists(variant_full):
                    full = variant_full
                    break
            else:
                # Subdir fallback for V1.9 parity: try .../assets/<path> and
                # .../docs/<path> before declaring 404.
                _resolved = False
                for _subdir in ("assets", "docs"):
                    _candidate = os.path.normpath(os.path.join(public_root, _subdir, path))
                    if (_candidate.startswith(public_root)
                            and os.path.exists(_candidate)):
                        full = _candidate
                        _resolved = True
                        break
                if not _resolved:
                    return _404_no_cache(f"asset not found: {path}")
    lower = full.lower()
    with open(full, "rb") as f:
        body = f.read()
    if lower.endswith(".json"):
        return JSONResponse(json.loads(body.decode("utf-8")),
                            headers={"Cache-Control": "no-store"})
    if lower.endswith(".md"):
        return PlainTextResponse(body.decode("utf-8"),
                                 headers={"Cache-Control": "no-store",
                                          "Content-Type": "text/markdown; charset=utf-8"})
    # Binary-safe pass-through with mimetype guessing.
    import mimetypes as _mt
    ctype, _ = _mt.guess_type(full)
    if not ctype:
        if lower.endswith((".jpg", ".jpeg")):
            ctype = "image/jpeg"
        elif lower.endswith(".png"):
            ctype = "image/png"
        elif lower.endswith(".svg"):
            ctype = "image/svg+xml"
        elif lower.endswith((".html", ".htm")):
            ctype = "text/html; charset=utf-8"
        elif lower.endswith(".css"):
            ctype = "text/css; charset=utf-8"
        elif lower.endswith(".js"):
            ctype = "application/javascript; charset=utf-8"
        else:
            ctype = "application/octet-stream"
    return FastResponse(content=body, media_type=ctype,
                        headers={"Cache-Control": "no-store"})


@router.get("/assets/{path:path}")
async def assets_alias(path: str, request: Request,
                       tenant: Optional[dict] = Depends(current_tenant_optional)):
    """Bare `/assets/<path>` -- V1.9 URL spelling used by the shared
    dashboard.html.  Forwards to the same view function above."""
    return await assets(path, request, tenant)


@router.get("/js/{path:path}")
async def js_alias(path: str, request: Request,
                   tenant: Optional[dict] = Depends(current_tenant_optional)):
    """Bare `/js/<path>` -- V1.9 Flask URL spelling.

    dashboard.html (and mapper / setup) load helpers with relative
    ``src="js/docs_index.js"``.  AHU hid that behind nginx; AHUX
    Cloudflare hits uvicorn directly, so those URLs 404'd and the
    dashboard crashed with ``ReferenceError: red5DocsIndex is not defined``.
    """
    return await assets(f"js/{path}", request, tenant)


@router.get("/api/thumb")
async def thumb(path: str = Query(...),
                max: int = Query(256, ge=16, le=1024),
                tenant: Optional[dict] = Depends(current_tenant_optional)):
    """Normalised raster preview for the image picker.

    Mirror of the V1.9 Flask /api/thumb (added 2026-06-12 to fix the
    Windows-Chrome "AHU_TYPE_01.jpg shows No preview" bug -- CMYK JPEGs
    can't be decoded by Skia, so we re-encode through Pillow into
    vanilla sRGB PNG).  SVG passes through unchanged.
    """
    s = _import_server()
    rel = (path or "").lstrip("/")
    ext = os.path.splitext(rel)[1].lower()
    raster_exts = {".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".tif", ".tiff"}
    if ext not in raster_exts:
        return FastResponse(status_code=302, headers={"Location": f"/api/assets/{rel}"})

    public_root = os.path.normpath(os.path.join(s.ROOT, "..", "frontend", "public"))
    full = os.path.normpath(os.path.join(public_root, rel))
    if not full.startswith(public_root):
        raise HTTPException(403, "path traversal")
    raw_bytes: Optional[bytes] = None
    if _fs_available("data"):
        fs_full = _safe_join(_fs_root("data"), rel)
        if fs_full and os.path.isfile(fs_full):
            with open(fs_full, "rb") as f:
                raw_bytes = f.read()
    if raw_bytes is None and os.path.exists(full):
        with open(full, "rb") as f:
            raw_bytes = f.read()
    elif raw_bytes is None and tenant:
        doc = await read_tenant_asset(tenant, rel)
        if doc and doc.get("data_bytes"):
            raw_bytes = doc["data_bytes"]
    if raw_bytes is None:
        for variant in _zero_pad_variants(rel):
            variant_full = os.path.normpath(os.path.join(public_root, variant))
            if variant_full.startswith(public_root) and os.path.exists(variant_full):
                with open(variant_full, "rb") as f:
                    raw_bytes = f.read()
                break
            if tenant:
                doc = await read_tenant_asset(tenant, variant)
                if doc and doc.get("data_bytes"):
                    raw_bytes = doc["data_bytes"]
                    break
    if raw_bytes is None:
        alt = os.path.join(s.DEMO_DATA_DIR, os.path.basename(rel))
        if os.path.exists(alt):
            with open(alt, "rb") as f:
                raw_bytes = f.read()
    if raw_bytes is None:
        return _404_no_cache(f"thumb source not found: {rel}")

    try:
        from PIL import Image, ImageOps  # noqa: PLC0415
        import io as _thumb_io          # noqa: PLC0415
    except ImportError:
        return FastResponse(status_code=302, headers={"Location": f"/api/assets/{rel}"})

    try:
        with Image.open(_thumb_io.BytesIO(raw_bytes)) as im:
            im = ImageOps.exif_transpose(im)
            if im.mode in ("CMYK", "YCbCr"):
                im = im.convert("RGB")
            elif im.mode in ("LA", "P"):
                im = im.convert("RGBA")
            if im.mode == "RGBA":
                bg = Image.new("RGB", im.size, (15, 23, 42))
                bg.paste(im, mask=im.split()[-1])
                im = bg
            elif im.mode != "RGB":
                im = im.convert("RGB")
            im.thumbnail((max, max), Image.LANCZOS)
            buf = _thumb_io.BytesIO()
            im.save(buf, format="PNG", optimize=True)
            data = buf.getvalue()
    except Exception:  # noqa: BLE001
        return FastResponse(status_code=302, headers={"Location": f"/api/assets/{rel}"})

    return FastResponse(
        content=data,
        media_type="image/png",
        headers={"Cache-Control": "public, max-age=3600, stale-while-revalidate=86400"},
    )
