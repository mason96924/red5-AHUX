"""Red5 Studio V2.0 - Phase 2 Piece B: tenant collections + isolation.

Adds per-user data isolation.  Phase 2 Piece B = 1 user = 1 tenant.
Multi-user-per-tenant org/billing lands in Phase 4.

Collections (db = $DB_NAME):
  tenants
    tenant_id     custom UUID prefix "ten_"
    owner_user_id link back to users.user_id
    name          default "<user.name>'s controller"
    created_at, updated_at

  tenant_equipment_types
    tenant_id     unique secondary index
    ahu_types     dict
    vav_types     dict
    updated_at

  tenant_band_overrides
    tenant_id     unique secondary index
    sa_rh_clamp   {enabled, lo, hi} | null
    updated_at

  tenant_locations
    tenant_id     unique secondary index
    active        {lat, lon, name}
    saved         [{lat, lon, name}, ...]
    updated_at

On first call to get_or_create_tenant_for_user(user_id) we lazily seed
all three side-collections with COPIES of the canned demo_data/ values
(operator decision matrix point `x`).
"""
from __future__ import annotations

import json
import os
import uuid
from datetime import datetime, timezone
from typing import Any, Optional

from fastapi import Cookie, Header
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel

from auth import _resolve_session_token  # reuse session lookup

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]

_client = AsyncIOMotorClient(MONGO_URL)
_db = _client[DB_NAME]
tenants_col      = _db["tenants"]
ten_eq_col       = _db["tenant_equipment_types"]
ten_bo_col       = _db["tenant_band_overrides"]
ten_loc_col      = _db["tenant_locations"]

ROOT = os.path.dirname(os.path.abspath(__file__))
DEMO_DATA_DIR = os.path.join(ROOT, "demo_data")

# Canon demo data used as seed for a freshly-created tenant.  These mirror
# the constants in server.py -- we re-derive them here so this module
# stays import-safe in isolation (avoids a circular import).
_DEMO_SAVED_LOCATIONS = [
    {"lat": -34.92, "lon": 138.60, "name": "NRAH (Adelaide)"},
    {"lat": -31.95, "lon": 115.86, "name": "Perth Children Hospital"},
    {"lat":  37.56, "lon": 127.04, "name": "Hanyang Univ Hospital (Seoul)"},
    {"lat":  39.91, "lon": 116.40, "name": "Beijing Geriatric Hospital"},
    {"lat":  47.60, "lon": -122.30, "name": "Seattle Children's"},
]
_DEMO_ACTIVE_LOCATION = _DEMO_SAVED_LOCATIONS[-1]


# ---------------------------------------------------------------------------
# Tenant lifecycle
# ---------------------------------------------------------------------------
async def get_or_create_tenant_for_user(user_doc: dict) -> dict:
    """Idempotent: returns the existing tenant or builds a fresh one + seeds
    its side-collections from canned demo_data/."""
    user_id = user_doc["user_id"]
    existing = await tenants_col.find_one({"owner_user_id": user_id}, {"_id": 0})
    if existing:
        return existing

    tenant_id = "ten_" + uuid.uuid4().hex[:12]
    now = datetime.now(timezone.utc)
    name = (user_doc.get("name") or user_doc.get("email") or "Untitled") + "'s controller"
    doc = {
        "tenant_id": tenant_id,
        "owner_user_id": user_id,
        "name": name,
        "created_at": now,
        "updated_at": now,
    }
    await tenants_col.insert_one(doc)

    # Seed equipment_types from the canned demo file.
    with open(os.path.join(DEMO_DATA_DIR, "equipment_types.json"), "r") as f:
        seed_eq = json.load(f)
    await ten_eq_col.insert_one({
        "tenant_id": tenant_id,
        "ahu_types": seed_eq.get("ahu_types", {}),
        "vav_types": seed_eq.get("vav_types", {}),
        "updated_at": now,
    })
    # Seed band_overrides as "no clamp applied".
    await ten_bo_col.insert_one({
        "tenant_id": tenant_id,
        "sa_rh_clamp": None,
        "updated_at": now,
    })
    # Seed weather locations from the canned list (Seattle = active by default).
    await ten_loc_col.insert_one({
        "tenant_id": tenant_id,
        "active": dict(_DEMO_ACTIVE_LOCATION),
        "saved": [dict(loc) for loc in _DEMO_SAVED_LOCATIONS],
        "updated_at": now,
    })

    return doc


# ---------------------------------------------------------------------------
# FastAPI dependencies
# ---------------------------------------------------------------------------
async def current_tenant_optional(
    session_token: Optional[str] = Cookie(default=None),
    authorization: Optional[str] = Header(default=None),
) -> Optional[dict]:
    """Return the tenant doc for a signed-in user, or None for anonymous.

    Anonymous callers must STILL get demo data on the read endpoints --
    callers handle the `tenant is None` case by falling back to the
    canned demo configs.
    """
    token = session_token
    if not token and authorization and authorization.startswith("Bearer "):
        token = authorization[7:].strip()
    if not token:
        return None
    user = await _resolve_session_token(token)
    if not user:
        return None
    return await get_or_create_tenant_for_user(user)


# ---------------------------------------------------------------------------
# Read / write helpers (used by server.py endpoint shells)
# ---------------------------------------------------------------------------
async def read_equipment_types(tenant: Optional[dict]) -> Optional[dict]:
    """Return {ahu_types, vav_types} for the tenant, or None if anonymous."""
    if not tenant:
        return None
    doc = await ten_eq_col.find_one({"tenant_id": tenant["tenant_id"]}, {"_id": 0})
    if not doc:
        return None
    return {"ahu_types": doc.get("ahu_types", {}),
            "vav_types": doc.get("vav_types", {})}


async def write_equipment_types(tenant: dict, payload: dict) -> dict:
    """Overwrite the tenant equipment_types with the operator-edited payload."""
    now = datetime.now(timezone.utc)
    await ten_eq_col.update_one(
        {"tenant_id": tenant["tenant_id"]},
        {"$set": {
            "ahu_types": payload.get("ahu_types", {}),
            "vav_types": payload.get("vav_types", {}),
            "updated_at": now,
        }},
        upsert=True,
    )
    return {"ok": True, "persisted": True, "tenant_id": tenant["tenant_id"],
            "updated_at": now.isoformat()}


async def read_sa_rh_clamp(tenant: Optional[dict]) -> Optional[dict]:
    if not tenant:
        return None
    doc = await ten_bo_col.find_one({"tenant_id": tenant["tenant_id"]}, {"_id": 0})
    if not doc:
        return None
    return doc.get("sa_rh_clamp")


async def write_sa_rh_clamp(tenant: dict, sa_rh_clamp: Optional[dict]) -> dict:
    now = datetime.now(timezone.utc)
    await ten_bo_col.update_one(
        {"tenant_id": tenant["tenant_id"]},
        {"$set": {"sa_rh_clamp": sa_rh_clamp, "updated_at": now}},
        upsert=True,
    )
    return {"ok": True, "persisted": True, "tenant_id": tenant["tenant_id"]}


async def read_weather_location(tenant: Optional[dict]) -> Optional[dict]:
    if not tenant:
        return None
    doc = await ten_loc_col.find_one({"tenant_id": tenant["tenant_id"]}, {"_id": 0})
    if not doc:
        return None
    return {
        "active":  doc.get("active"),
        "saved":   doc.get("saved", []),
        "default": doc.get("default"),   # pinned-on-fresh-session location
    }


# ---------------------------------------------------------------------------
# Tenant-scoped image asset storage (Phase 2 Piece B / hotfix).
# Mapper POSTs base64-encoded PNG/JPG/SVG bytes to /api/save-image.  We
# decode them and stash in `tenant_assets`.  Subsequent GETs flow through
# /api/assets/<filename> -> read_tenant_asset(tenant, filename).
# ---------------------------------------------------------------------------
ten_asset_col = _db["tenant_assets"]
ten_cfg_col   = _db["tenant_collector_config"]
ten_map_col   = _db["tenant_map_config"]


async def save_tenant_asset(tenant: dict, filename: str,
                            content_type: str, data_bytes: bytes,
                            root: str = "data") -> dict:
    """Upsert image bytes for (tenant, root, filename).  `root` is the
    virtual top-level folder (`data` or `scripts`), keeping the two
    namespaces independent so deleting from one does not touch the
    other."""
    now = datetime.now(timezone.utc)
    root = (root or "data").strip() or "data"
    # Normalize the filename so the schema field round-trips cleanly.
    safe = filename.lstrip("/").replace("\\", "/")
    await ten_asset_col.update_one(
        {"tenant_id": tenant["tenant_id"], "root": root, "filename": safe},
        {"$set": {
            "tenant_id": tenant["tenant_id"],
            "root": root,
            "filename": safe,
            "content_type": content_type,
            "data_bytes": data_bytes,
            "size_bytes": len(data_bytes),
            "updated_at": now,
        }},
        upsert=True,
    )
    return {"ok": True, "relative_path": safe, "size_bytes": len(data_bytes), "root": root}


async def read_tenant_asset(tenant: dict, filename: str,
                            root: str = "data") -> Optional[dict]:
    safe = filename.lstrip("/").replace("\\", "/")
    root = (root or "data").strip() or "data"
    return await ten_asset_col.find_one(
        {"tenant_id": tenant["tenant_id"], "root": root, "filename": safe},
        {"_id": 0},
    )


async def list_tenant_assets(tenant: dict, path_prefix: str = "",
                             root: str = "data") -> list[dict]:
    """Browse-style listing for the image-picker modal.

    Returns directory entries (synthetic, derived from filename prefixes
    plus persisted empty-directory markers) and image files under
    `path_prefix` within the given virtual `root` (`data` or `scripts`).
    Matches the V1.9 /api/files response shape:
    { name, type: 'image'|'directory', size?, full_path? }.
    """
    safe_prefix = path_prefix.strip("/").replace("\\", "/")
    root = (root or "data").strip() or "data"
    cursor = ten_asset_col.find(
        {"tenant_id": tenant["tenant_id"], "root": root},
        {"_id": 0, "filename": 1, "size_bytes": 1, "content_type": 1,
         "is_directory": 1},
    )
    all_docs = await cursor.to_list(length=10000)
    dirs: set[str] = set()
    files: list[dict] = []
    for d in all_docs:
        fname = d["filename"]
        # Only consider entries that live under the requested prefix.
        if safe_prefix:
            if not fname.startswith(safe_prefix + "/"):
                continue
            rest = fname[len(safe_prefix) + 1:]
        else:
            rest = fname
        # Empty-directory markers (created by /api/create-directory) are
        # stored as filename ending in "/" with is_directory=true and no
        # data_bytes.  Surface them as immediate-child directories.
        if d.get("is_directory") and rest.endswith("/"):
            dir_name = rest.rstrip("/").split("/", 1)[0]
            if dir_name:
                dirs.add(dir_name)
            continue
        if "/" in rest:
            dirs.add(rest.split("/", 1)[0])
        else:
            files.append({
                "name": rest,
                "type": "image",
                "size": d.get("size_bytes", 0),
                "full_path": fname,
            })
    out = [{"name": d, "type": "directory"} for d in sorted(dirs)]
    out.extend(sorted(files, key=lambda x: x["name"]))
    return out


async def create_tenant_directory(tenant: dict, dirname: str,
                                  root: str = "data") -> dict:
    """Persist an empty-directory marker so the folder shows up in the
    image-picker even before any file lives in it.  Idempotent — re-creating
    the same directory just touches `updated_at`."""
    safe = dirname.strip("/").replace("\\", "/")
    root = (root or "data").strip() or "data"
    if not safe:
        return {"success": False, "error": "Empty directory name"}
    marker = safe + "/"   # trailing slash distinguishes the marker
    now = datetime.now(timezone.utc)
    await ten_asset_col.update_one(
        {"tenant_id": tenant["tenant_id"], "root": root, "filename": marker},
        {"$set": {
            "tenant_id":    tenant["tenant_id"],
            "root":         root,
            "filename":     marker,
            "is_directory": True,
            "size_bytes":   0,
            "updated_at":   now,
        }},
        upsert=True,
    )
    return {"success": True, "dirname": safe, "root": root,
            "path": f"virtual-controller://{tenant['tenant_id']}/{root}/{safe}"}


class WeatherLocationUpdate(BaseModel):
    active:  Optional[dict] = None
    saved:   Optional[list] = None
    # Pinned default location -- when set, the dashboard auto-loads this on
    # any fresh session where no `active` has been explicitly chosen yet.
    # Pass `{}` (empty dict) or `null` to clear the pin.  Shape:
    #   {"lat": <float>, "lon": <float>, "name": <str>}
    default: Optional[dict] = None


async def read_collector_config(tenant: Optional[dict]) -> Optional[dict]:
    """Return the tenant's saved collector_config, or None if anonymous /
    not yet saved."""
    if not tenant:
        return None
    doc = await ten_cfg_col.find_one({"tenant_id": tenant["tenant_id"]},
                                     {"_id": 0, "tenant_id": 0, "updated_at": 0})
    return doc or None


async def write_collector_config(tenant: dict, cfg: dict) -> dict:
    """Persist the collector_config payload sent by the dashboard's COLLECTOR
    modal.  We strip MongoDB-illegal keys (`_id`) defensively but otherwise
    accept the operator's payload verbatim."""
    now = datetime.now(timezone.utc)
    safe = {k: v for k, v in cfg.items() if not k.startswith("_")}
    safe["tenant_id"] = tenant["tenant_id"]
    safe["updated_at"] = now
    await ten_cfg_col.update_one(
        {"tenant_id": tenant["tenant_id"]},
        {"$set": safe},
        upsert=True,
    )
    return {"ok": True, "persisted": True, "tenant_id": tenant["tenant_id"]}


async def read_map_config(tenant: Optional[dict]) -> Optional[dict]:
    """Return the tenant's saved map_config (floors + markers) or None."""
    if not tenant:
        return None
    doc = await ten_map_col.find_one(
        {"tenant_id": tenant["tenant_id"]},
        {"_id": 0, "tenant_id": 0, "updated_at": 0},
    )
    return doc or None


async def write_map_config(tenant: dict, map_config: dict,
                           image_manifest: Optional[dict] = None) -> dict:
    """Persist the equipment_mapper's map_config.json payload per-tenant.
    `image_manifest` (file -> b64) is stored alongside but separately so we
    can keep it out of the main payload return shape."""
    safe = {k: v for k, v in (map_config or {}).items() if not k.startswith("_")}
    safe["tenant_id"] = tenant["tenant_id"]
    safe["updated_at"] = datetime.now(timezone.utc)
    if image_manifest:
        safe["_image_manifest"] = image_manifest
    await ten_map_col.update_one(
        {"tenant_id": tenant["tenant_id"]},
        {"$set": safe},
        upsert=True,
    )
    floors = len(safe.get("floors") or [])
    return {"ok": True, "persisted": True, "tenant_id": tenant["tenant_id"],
            "floors": floors}



async def write_weather_location(tenant: dict, update: WeatherLocationUpdate) -> dict:
    now = datetime.now(timezone.utc)
    set_doc: dict[str, Any] = {"updated_at": now}
    unset_doc: dict[str, Any] = {}
    # `model_fields_set` (pydantic v2) tells us which fields were actually
    # present in the request body, distinguishing "didn't send" from
    # "explicitly sent null".  Without this we can't tell whether the
    # operator meant to clear a pinned default or just omitted the field.
    sent = update.model_fields_set
    if update.active is not None:
        set_doc["active"] = update.active
    if update.saved is not None:
        set_doc["saved"] = update.saved
    if "default" in sent:
        # Sending `{lat, lon, name}` pins; sending `null` (or `{}` after
        # the strip below) clears.
        if isinstance(update.default, dict) and update.default.get("lat") is not None:
            set_doc["default"] = {
                "lat":  update.default.get("lat"),
                "lon":  update.default.get("lon"),
                "name": update.default.get("name") or "",
            }
        else:
            unset_doc["default"] = ""
    ops: dict[str, Any] = {"$set": set_doc}
    if unset_doc:
        ops["$unset"] = unset_doc
    await ten_loc_col.update_one(
        {"tenant_id": tenant["tenant_id"]},
        ops,
        upsert=True,
    )
    return {"ok": True, "persisted": True, "tenant_id": tenant["tenant_id"]}


# ---------------------------------------------------------------------------
# Tenant-asset file-system helpers (Phase 2 comprehensive port from V1.9).
# The V1.9 controller exposes /api/create-directory, /api/delete-directory,
# /api/delete-file, /api/move-file, /api/upload-file, /api/init-directories.
# In SaaS we have no filesystem -- we treat `tenant_assets.filename` as a
# virtual path and operate on it via Mongo updates.  Directories are pure
# fictions reconstructed from filename prefixes; "create directory" is a
# no-op success because listing logic already derives dirs from prefixes.
# ---------------------------------------------------------------------------


async def delete_tenant_asset(tenant: dict, filename: str,
                              root: str = "data") -> dict:
    safe = filename.lstrip("/").replace("\\", "/")
    root = (root or "data").strip() or "data"
    r = await ten_asset_col.delete_one(
        {"tenant_id": tenant["tenant_id"], "root": root, "filename": safe})
    return {"success": r.deleted_count > 0,
            "deleted_count": r.deleted_count,
            "filename": safe,
            "root": root}


async def delete_tenant_directory(tenant: dict, dirname: str,
                                  root: str = "data") -> dict:
    safe = dirname.strip("/").replace("\\", "/")
    root = (root or "data").strip() or "data"
    if not safe:
        return {"success": False, "error": "Cannot delete root directory"}
    prefix = safe + "/"
    r = await ten_asset_col.delete_many(
        {"tenant_id": tenant["tenant_id"], "root": root,
         "filename": {"$regex": "^" + _re_escape(prefix)}},
    )
    return {"success": True, "deleted_count": r.deleted_count,
            "dirname": safe, "root": root}


async def move_tenant_asset(tenant: dict, src: str, dest_dir: str,
                            root: str = "data") -> dict:
    src_safe  = src.lstrip("/").replace("\\", "/")
    dest_safe = dest_dir.strip("/").replace("\\", "/")
    root = (root or "data").strip() or "data"
    doc = await ten_asset_col.find_one(
        {"tenant_id": tenant["tenant_id"], "root": root, "filename": src_safe})
    if not doc:
        return {"success": False, "error": f"Source not found: {src_safe}"}
    basename = src_safe.rsplit("/", 1)[-1]
    new_name = (dest_safe + "/" + basename) if dest_safe else basename
    if new_name == src_safe:
        return {"success": True, "moved": False, "filename": src_safe}
    await ten_asset_col.update_one(
        {"_id": doc["_id"]},
        {"$set": {"filename": new_name, "updated_at": datetime.now(timezone.utc)}},
    )
    return {"success": True, "moved": True, "from": src_safe, "to": new_name}


def _re_escape(s: str) -> str:
    import re as _re
    return _re.escape(s)
