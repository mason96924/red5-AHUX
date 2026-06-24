"""routes/files.py — file-management API (V1.9 parity on Linux deploy).

Extracted from `server.py` in Phase L.28 (2026-06-24).

These twelve endpoints back the Controller Assets browser in the
dashboard's `/mapper` route.  They are dual-mode:

  * On the operator's Linux server the V1.9 file roots
    (`/root/data`, `/root/scripts`) exist on disk -- we read/write
    them directly, byte-for-byte the same as V1.9 Flask did.
  * On the hosted SaaS preview those paths do NOT exist, so the
    same endpoints fall back to per-tenant virtual filesystems
    stored in MongoDB (`tenant_assets`).

The local-FS helpers (`_fs_available`, `_fs_root`, `_safe_join`,
`DIRECTORY_SCAFFOLD`) live in `server.py` and are imported lazily so
the router can be wired in at the bottom of `server.py` without
circular import issues.
"""
from __future__ import annotations

import base64
import os
import shutil
from typing import Optional

from fastapi import APIRouter, Depends, Query

from tenants import (
    current_tenant_optional,
    list_tenant_assets,
    save_tenant_asset,
    delete_tenant_asset,
    delete_tenant_directory,
    create_tenant_directory,
    move_tenant_asset,
)

# Local-FS helpers are imported on first request to avoid a circular
# import (this module is loaded by `server.py` at the bottom of its
# import block).  We snapshot the references once at first use.
_fs_available = None  # type: ignore[assignment]
_fs_root = None       # type: ignore[assignment]
_safe_join = None     # type: ignore[assignment]
_DIRECTORY_SCAFFOLD: list[str] = []


def _ensure_fs_helpers() -> None:
    global _fs_available, _fs_root, _safe_join, _DIRECTORY_SCAFFOLD
    if _fs_available is None:
        import server as _server  # noqa: PLC0415  -- intentional late import
        _fs_available = _server._fs_available
        _fs_root = _server._fs_root
        _safe_join = _server._safe_join
        _DIRECTORY_SCAFFOLD = _server.DIRECTORY_SCAFFOLD


router = APIRouter()


@router.get("/api/files")
async def list_files(path: str = Query(""),
                     root: str = Query("data"),
                     tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    """V1.9-compatible file browser."""
    _ensure_fs_helpers()
    if _fs_available(root):
        base = _fs_root(root)
        data_dir = _safe_join(base, path)
        if data_dir is None:
            return {"success": False, "error": "Invalid path"}
        if not os.path.isdir(data_dir):
            return {"success": False, "error": f"Directory not found: {path}"}
        files: list[dict] = []
        try:
            for f in sorted(os.listdir(data_dir)):
                if f.endswith(".tmp"):
                    continue
                filepath = os.path.join(data_dir, f)
                try:
                    stat = os.stat(filepath)
                except (FileNotFoundError, OSError):
                    continue
                if os.path.isdir(filepath):
                    files.append({"name": f, "size": 0,
                                  "modified": stat.st_mtime,
                                  "type": "directory"})
                elif os.path.isfile(filepath):
                    ext = os.path.splitext(f)[1].lower()
                    ftype = ("image" if ext in (".png", ".jpg", ".jpeg", ".svg",
                                                ".gif", ".bmp", ".webp")
                             else "config" if ext in (".json",)
                             else "page"   if ext in (".html", ".htm")
                             else "style"  if ext in (".css",)
                             else "script" if ext in (".py", ".js")
                             else "other")
                    files.append({"name": f, "size": stat.st_size,
                                  "modified": stat.st_mtime, "type": ftype})
        except Exception as e:  # noqa: BLE001
            return {"success": False, "error": str(e)}
        return {"success": True, "path": data_dir, "rel_path": path,
                "files": files, "count": len(files), "root": root,
                "mode": "filesystem"}
    if not tenant:
        return {"success": True, "files": [],
                "warning": "Sign in to browse your uploaded assets."}
    return {"success": True, "files": await list_tenant_assets(tenant, path, root=root),
            "root": root, "mode": "virtual"}


@router.post("/api/save-image")
@router.post("/api/save-floor-plan")
async def save_image(payload: dict,
                     tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    """Mapper POSTs {deployment_path, filename, image_data} where image_data
    is a data-URL (data:image/png;base64,...)."""
    _ensure_fs_helpers()
    filename = payload.get("filename") or ""
    image_data = payload.get("image_data") or ""
    if not filename or not image_data:
        return {"success": False, "error": "filename and image_data are required"}
    root = (payload or {}).get("root", "data") or "data"
    if image_data.startswith("data:"):
        try:
            head, b64 = image_data.split(",", 1)
        except ValueError:
            return {"success": False, "error": "malformed data-URL"}
        content_type = head[len("data:"):].split(";", 1)[0] or "application/octet-stream"
    else:
        b64 = image_data
        content_type = "application/octet-stream"
    try:
        data_bytes = base64.b64decode(b64)
    except Exception as e:  # noqa: BLE001
        return {"success": False, "error": f"base64 decode failed: {e}"}
    if _fs_available(root):
        base = _fs_root(root)
        filepath = _safe_join(base, filename)
        if filepath is None:
            return {"success": False, "error": "Invalid path"}
        try:
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            with open(filepath, "wb") as f:
                f.write(data_bytes)
        except OSError as e:
            return {"success": False, "error": str(e)}
        return {"success": True, "relative_path": filename,
                "size_bytes": len(data_bytes), "root": root,
                "file": filepath, "mode": "filesystem"}
    if not tenant:
        return {"success": False,
                "error": "Sign in to save asset images to your virtual controller.",
                "warning": "Anonymous demo -- image preview-only; sign in to persist."}
    res = await save_tenant_asset(tenant, filename, content_type, data_bytes, root=root)
    return {"success": True, "relative_path": res["relative_path"],
            "size_bytes": res["size_bytes"], "root": res["root"],
            "tenant_id": tenant["tenant_id"], "mode": "virtual"}


@router.get("/api/assets")
async def assets_manifest() -> dict:
    """V1.9 returns a manifest of visual-asset URLs (AHU/VAV graphics).
    Demo ships no images yet, so return an empty manifest -- the dashboard
    falls back to its built-in default SVGs."""
    return {"ahu": None, "vav": None, "floor": None, "ahu_types": {}}


@router.post("/api/create-directory")
async def create_directory(payload: dict,
                           tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    """Create a directory.  Local FS on Linux deploy, marker doc otherwise."""
    _ensure_fs_helpers()
    dirname = (payload or {}).get("dirname", "") or ""
    root = (payload or {}).get("root", "data") or "data"
    if not dirname or ".." in dirname:
        return {"success": False, "error": "Invalid directory name"}
    if _fs_available(root):
        base = _fs_root(root)
        dirpath = _safe_join(base, dirname)
        if dirpath is None:
            return {"success": False, "error": "Invalid path"}
        if os.path.exists(dirpath):
            return {"success": False, "error": f"Already exists: {dirname}"}
        try:
            os.makedirs(dirpath)
        except OSError as e:
            return {"success": False, "error": str(e)}
        return {"success": True, "message": f"Created: {dirname}",
                "path": dirpath, "mode": "filesystem"}
    if not tenant:
        return {"success": False, "error": "Sign in to manage your virtual controller filesystem.",
                "warning": "Anonymous demo -- mapper can browse but not mutate."}
    res = await create_tenant_directory(tenant, dirname, root=root)
    if res.get("success"):
        res["message"] = f"Directory ready: {dirname}"
    return res


@router.post("/api/delete-directory")
async def delete_directory(payload: dict,
                           tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    _ensure_fs_helpers()
    dirname = (payload or {}).get("dirname", "") or ""
    root = (payload or {}).get("root", "data") or "data"
    if not dirname or ".." in dirname or dirname.strip() == "":
        return {"success": False, "error": "Invalid directory name"}
    if _fs_available(root):
        base = _fs_root(root)
        dirpath = _safe_join(base, dirname)
        if dirpath is None or dirpath == base:
            return {"success": False, "error": "Cannot delete root directory"}
        if not os.path.isdir(dirpath):
            return {"success": False, "error": f"Directory not found: {dirname}"}
        try:
            shutil.rmtree(dirpath)
        except OSError as e:
            return {"success": False, "error": str(e)}
        return {"success": True, "message": f"Deleted directory: {dirname}",
                "mode": "filesystem"}
    if not tenant:
        return {"success": False, "error": "Sign in to delete from your virtual controller."}
    return await delete_tenant_directory(tenant, dirname, root=root)


@router.post("/api/delete-file")
async def delete_file(payload: dict,
                      tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    _ensure_fs_helpers()
    filename = (payload or {}).get("filename", "") or ""
    root = (payload or {}).get("root", "data") or "data"
    if not filename or ".." in filename:
        return {"success": False, "error": "Invalid filename"}
    if _fs_available(root):
        base = _fs_root(root)
        filepath = _safe_join(base, filename)
        if filepath is None:
            return {"success": False, "error": "Invalid path"}
        if not os.path.isfile(filepath):
            return {"success": False, "error": f"File not found: {filename}"}
        try:
            os.remove(filepath)
        except OSError as e:
            return {"success": False, "error": str(e)}
        return {"success": True, "message": f"Deleted: {filename}",
                "mode": "filesystem"}
    if not tenant:
        return {"success": False, "error": "Sign in to delete from your virtual controller."}
    return await delete_tenant_asset(tenant, filename, root=root)


@router.post("/api/move-file")
async def move_file(payload: dict,
                    tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    _ensure_fs_helpers()
    src       = (payload or {}).get("src", "") or ""
    dest_dir  = (payload or {}).get("dest_dir", "") or ""
    root      = (payload or {}).get("root", "data") or "data"
    dest_root = (payload or {}).get("dest_root", root) or root
    if not src or ".." in src or ".." in dest_dir:
        return {"success": False, "error": "Invalid path"}
    if _fs_available(root) or _fs_available(dest_root):
        base = _fs_root(root)
        dest_base = _fs_root(dest_root)
        src_path = _safe_join(base, src)
        if src_path is None:
            return {"success": False, "error": "Invalid source path"}
        if not os.path.exists(src_path):
            return {"success": False, "error": f"Source not found: {src}"}
        target_dir = _safe_join(dest_base, dest_dir) if dest_dir else dest_base
        if target_dir is None:
            return {"success": False, "error": "Invalid destination path"}
        try:
            os.makedirs(target_dir, exist_ok=True)
            final_path = os.path.join(target_dir, os.path.basename(src_path))
            if os.path.normpath(src_path) == os.path.normpath(final_path):
                return {"success": False, "error": "Source and destination are the same"}
            shutil.move(src_path, final_path)
        except OSError as e:
            return {"success": False, "error": str(e)}
        return {"success": True,
                "message": f"Moved: {os.path.basename(src)} -> {dest_root}:{dest_dir or '/'}",
                "mode": "filesystem"}
    if not tenant:
        return {"success": False, "error": "Sign in to manage your virtual controller filesystem."}
    return await move_tenant_asset(tenant, src, dest_dir, root=root)


@router.post("/api/upload-file")
async def upload_file(payload: dict,
                      tenant: Optional[dict] = Depends(current_tenant_optional)) -> dict:
    """Generic file upload.  Local FS on Linux deploy, tenant_assets otherwise."""
    _ensure_fs_helpers()
    filename = (payload or {}).get("filename", "") or ""
    file_data = (payload or {}).get("file_data", "") or ""
    root = (payload or {}).get("root", "data") or "data"
    if not filename or ".." in filename:
        return {"success": False, "error": "Invalid filename"}
    if not file_data:
        return {"success": False, "error": "No file data"}
    if file_data.startswith("data:"):
        try:
            head, b64 = file_data.split(",", 1)
        except ValueError:
            return {"success": False, "error": "malformed data-URL"}
        content_type = head[len("data:"):].split(";", 1)[0] or "application/octet-stream"
    else:
        b64 = file_data.split(",", 1)[1] if "," in file_data else file_data
        content_type = "application/octet-stream"
    try:
        data_bytes = base64.b64decode(b64)
    except Exception as e:  # noqa: BLE001
        return {"success": False, "error": f"base64 decode failed: {e}"}
    if _fs_available(root):
        base = _fs_root(root)
        filepath = _safe_join(base, filename)
        if filepath is None:
            return {"success": False, "error": "Invalid path"}
        try:
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            with open(filepath, "wb") as f:
                f.write(data_bytes)
        except OSError as e:
            return {"success": False, "error": str(e)}
        return {"success": True, "message": f"Uploaded: {filename}",
                "file": filepath, "size": len(data_bytes),
                "root": root, "mode": "filesystem"}
    if not tenant:
        return {"success": False, "error": "Sign in to upload to your virtual controller."}
    res = await save_tenant_asset(tenant, filename, content_type, data_bytes, root=root)
    return {"success": True, "message": f"Uploaded: {filename}",
            "file": res["relative_path"], "size": res["size_bytes"],
            "root": res["root"],
            "tenant_id": tenant["tenant_id"], "mode": "virtual"}


@router.post("/api/init-directories")
async def init_directories(payload: Optional[dict] = None) -> dict:
    """V1.9 created /root/data/{configs,graphics,...} on first run.  When the
    Linux FS root exists, materialise the scaffold there (idempotent).  In
    SaaS the tenant_assets schema is flat -- directories are implicit -- so
    it's a no-op success."""
    _ensure_fs_helpers()
    if _fs_available("data"):
        base = _fs_root("data")
        created: list[str] = []
        existing: list[str] = []
        for d in _DIRECTORY_SCAFFOLD:
            dirpath = os.path.join(base, d)
            if os.path.isdir(dirpath):
                existing.append(d)
            else:
                try:
                    os.makedirs(dirpath, exist_ok=True)
                    created.append(d)
                except OSError:
                    pass
        return {"success": True, "created": created, "existing": existing,
                "mode": "filesystem"}
    return {"success": True, "created": [], "existing": [], "mode": "virtual-fs"}


@router.get("/api/directory-scaffold")
async def directory_scaffold() -> dict:
    """Reflect real FS state when on the Linux deploy; in SaaS pretend
    everything exists (the virtual FS is flat / implicit)."""
    _ensure_fs_helpers()
    if _fs_available("data"):
        base = _fs_root("data")
        scaffold = [{"path": d, "exists": os.path.isdir(os.path.join(base, d))}
                    for d in _DIRECTORY_SCAFFOLD]
        return {"success": True, "scaffold": scaffold, "mode": "filesystem"}
    return {"success": True, "scaffold": [
        {"path": "configs", "exists": True},
        {"path": "graphics", "exists": True},
        {"path": "graphics/equipments", "exists": True},
        {"path": "graphics/equipments/AHUs", "exists": True},
        {"path": "graphics/equipments/VAVs", "exists": True},
        {"path": "graphics/floor_plans", "exists": True},
        {"path": "graphics/icons", "exists": True},
    ], "mode": "virtual-fs"}
