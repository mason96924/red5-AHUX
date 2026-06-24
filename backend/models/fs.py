"""models/fs.py -- Local-filesystem helpers + constants.

Phase L.30 (2026-06-24): extracted from `server.py`.  Consolidates the
V1.9-on-Linux filesystem path resolution, path-traversal safe join,
zero-pad alternate-spelling fallback, and the 404-no-cache helper into
a single import surface so router modules no longer need the lazy
`_pull_from_server()` shim for FS-related names.

The helpers are pure -- no FastAPI / no MongoDB / no global state --
which lets the route modules import them at module-load time without
introducing a circular dependency with `server.py`.

V1.9 parity: on the operator's Linux deploy, `/root/data` and
`/root/scripts` exist on disk and the dashboard's Controller Assets
browser reads/writes them directly.  On the hosted SaaS preview those
paths do NOT exist; routes that branch on `_fs_available(root)` fall
back to per-tenant virtual filesystems stored in MongoDB.
"""
from __future__ import annotations

import os
import re
from typing import Optional

from fastapi.responses import JSONResponse

DATA_ROOT = os.environ.get("DATA_ROOT", "/root/data")
SCRIPTS_ROOT = os.environ.get("SCRIPTS_ROOT", "/root/scripts")
ALLOWED_FS_ROOTS = {"data": DATA_ROOT, "scripts": SCRIPTS_ROOT}

# V1.9-style scaffold the INIT SCAFFOLD button creates under DATA_ROOT.
DIRECTORY_SCAFFOLD = [
    "graphics/equipments/AHUs",
    "graphics/equipments/VAVs",
    "graphics/equipments/VFDs",
    "graphics/equipments/DIFF_PRs",
    "graphics/equipments/CHILLERs",
    "graphics/equipments/CTs",
    "graphics/floor_plans",
    "configs",
    "js",
]


def _fs_root(root_name: str) -> str:
    return ALLOWED_FS_ROOTS.get(root_name or "data", DATA_ROOT)


def _fs_available(root_name: str) -> bool:
    """True iff the local filesystem root exists.  This is the switch
    between V1.9-on-Linux mode (real `/root/data`) and the hosted demo
    mode (tenant_assets virtual filesystem)."""
    try:
        return os.path.isdir(_fs_root(root_name))
    except OSError:
        return False


def _safe_join(base: str, rel: str) -> Optional[str]:
    """Path-traversal-safe join.  Returns None when `rel` would escape `base`."""
    if rel is None:
        rel = ""
    if ".." in rel:
        return None
    full = os.path.normpath(os.path.join(base, rel))
    if not (full == base or full.startswith(base + os.sep)):
        return None
    return full


# Asset name normaliser.  Historically the equipment_types schema was loosely
# typed: V1.8 stored `AHU_TYPE_1.jpg`, V1.9 settled on the zero-padded
# `AHU_TYPE_01.jpg`.  Either spelling can show up depending on when the
# tenant uploaded their schema.  Rather than force every user to re-edit
# JSON by hand, when a file lookup misses we try the same path with the
# alternate digit padding (single <-> 2-digit).  Only the FINAL segment is
# considered, and only the suffix immediately before the extension --
# this is intentionally narrow so it can't paper over real typos.
_PAD_RE = re.compile(r"_(\d{1,2})(\.[A-Za-z0-9]+)$")


def _zero_pad_variants(rel_path: str) -> list[str]:
    """Return alternate spellings of `rel_path` with the trailing
    numeric suffix toggled between 1- and 2-digit zero padding.

    Examples:
        AHU_TYPE_1.jpg   -> ['AHU_TYPE_01.jpg']
        AHU_TYPE_01.jpg  -> ['AHU_TYPE_1.jpg']
        AHU_TYPE_10.jpg  -> []                   (already 2 digits, >9)
        foo/bar.jpg      -> []                   (no numeric suffix)
    """
    head, _, tail = rel_path.rpartition("/")
    m = _PAD_RE.search(tail)
    if not m:
        return []
    digits, ext = m.group(1), m.group(2)
    n = int(digits)
    out: list[str] = []
    if len(digits) == 1:
        alt = _PAD_RE.sub(f"_{n:02d}{ext}", tail)
        out.append(f"{head}/{alt}" if head else alt)
    elif len(digits) == 2 and n < 10:
        alt = _PAD_RE.sub(f"_{n}{ext}", tail)
        out.append(f"{head}/{alt}" if head else alt)
    return out


def _404_no_cache(detail: str):
    """Return a 404 that browsers will NOT cache.

    Why this exists: Chrome / Safari apply heuristic caching to 404
    responses that omit Cache-Control.  A user once hit an asset before
    it had been uploaded -> Chrome cached the 404 -> after the upload
    succeeded the user still saw "No preview" until a hard refresh.
    Worse: different PCs cached different states ("works on Linux PC,
    broken on the Mac next to it").  By emitting `Cache-Control:
    no-store` on every 404 from /api/assets and /api/thumb, a freshly
    uploaded asset becomes visible on the very next page load on every
    PC, with no cache-invalidation dance required.
    """
    return JSONResponse(
        {"detail": detail},
        status_code=404,
        headers={"Cache-Control": "no-store"},
    )
