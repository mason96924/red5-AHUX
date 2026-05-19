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
    return {"active": doc.get("active"), "saved": doc.get("saved", [])}


# ---------------------------------------------------------------------------
# Tenant-scoped image asset storage (Phase 2 Piece B / hotfix).
# Mapper POSTs base64-encoded PNG/JPG/SVG bytes to /api/save-image.  We
# decode them and stash in `tenant_assets`.  Subsequent GETs flow through
# /api/assets/<filename> -> read_tenant_asset(tenant, filename).
# ---------------------------------------------------------------------------
ten_asset_col = _db["tenant_assets"]


async def save_tenant_asset(tenant: dict, filename: str,
                            content_type: str, data_bytes: bytes) -> dict:
    """Upsert image bytes for (tenant, filename).  Returns the relative path
    the V1.9 mapper writes into the schema's `visual_assets.base_graphic`."""
    now = datetime.now(timezone.utc)
    # Normalize the filename so the schema field round-trips cleanly.
    safe = filename.lstrip("/").replace("\\", "/")
    await ten_asset_col.update_one(
        {"tenant_id": tenant["tenant_id"], "filename": safe},
        {"$set": {
            "tenant_id": tenant["tenant_id"],
            "filename": safe,
            "content_type": content_type,
            "data_bytes": data_bytes,
            "size_bytes": len(data_bytes),
            "updated_at": now,
        }},
        upsert=True,
    )
    return {"ok": True, "relative_path": safe, "size_bytes": len(data_bytes)}


async def read_tenant_asset(tenant: dict, filename: str) -> Optional[dict]:
    safe = filename.lstrip("/").replace("\\", "/")
    return await ten_asset_col.find_one(
        {"tenant_id": tenant["tenant_id"], "filename": safe},
        {"_id": 0},
    )


class WeatherLocationUpdate(BaseModel):
    active: Optional[dict] = None
    saved:  Optional[list] = None


async def write_weather_location(tenant: dict, update: WeatherLocationUpdate) -> dict:
    now = datetime.now(timezone.utc)
    set_doc: dict[str, Any] = {"updated_at": now}
    if update.active is not None:
        set_doc["active"] = update.active
    if update.saved is not None:
        set_doc["saved"] = update.saved
    await ten_loc_col.update_one(
        {"tenant_id": tenant["tenant_id"]},
        {"$set": set_doc},
        upsert=True,
    )
    return {"ok": True, "persisted": True, "tenant_id": tenant["tenant_id"]}
