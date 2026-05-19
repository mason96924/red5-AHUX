"""Red5 Studio V2.0 - Phase 2 Piece C: Domain / email allow-listing.

When the allowlist is non-empty, only emails that match an explicit
`email` entry OR whose domain matches a `domain` entry can complete a
Google sign-in.  An *empty* allowlist means "open" (demo-friendly default)
so that we never accidentally lock the operator out of the live demo.

Admin model:
  - `ADMIN_EMAILS` env var (comma-separated) lists the bootstrap admins.
  - Anyone with `email` in that list can read + mutate the allowlist via
    the admin-gated `/api/auth/allowlist` endpoints.

Collection (db = $DB_NAME):
  auth_allowlist
    id          custom UUID prefix "al_"
    type        'domain' | 'email'
    value       lowercased ("example.com" or "alice@example.com")
    added_by    user_id of the admin who added it
    added_at    datetime
"""
from __future__ import annotations

import os
import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field

from auth import current_user

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME   = os.environ["DB_NAME"]

_client = AsyncIOMotorClient(MONGO_URL)
_db = _client[DB_NAME]
allowlist_col = _db["auth_allowlist"]


def _admin_emails() -> set[str]:
    raw = os.environ.get("ADMIN_EMAILS", "") or ""
    return {e.strip().lower() for e in raw.split(",") if e.strip()}


def is_admin(user_doc: dict) -> bool:
    email = (user_doc.get("email") or "").lower()
    return email in _admin_emails()


async def is_email_allowed(email: str) -> bool:
    """Return True if `email` may sign in.

    Empty allowlist -> open (demo-friendly).  Otherwise check exact-email
    entries first, then domain entries.  Admin emails are *always* allowed
    so a misconfigured allowlist can't lock the bootstrap operator out.
    """
    if not email:
        return False
    lo = email.lower()
    if lo in _admin_emails():
        return True
    count = await allowlist_col.count_documents({})
    if count == 0:
        return True
    if await allowlist_col.find_one({"type": "email", "value": lo}, {"_id": 0}):
        return True
    domain = lo.split("@", 1)[1] if "@" in lo else ""
    if domain and await allowlist_col.find_one({"type": "domain", "value": domain}, {"_id": 0}):
        return True
    return False


# ---------------------------------------------------------------------------
# FastAPI router (admin-gated CRUD)
# ---------------------------------------------------------------------------
router = APIRouter(prefix="/api/auth/allowlist", tags=["auth", "allowlist"])


class AllowlistEntry(BaseModel):
    type: str = Field(..., pattern="^(domain|email)$")
    value: str


async def _require_admin(user: dict = Depends(current_user)) -> dict:
    if not is_admin(user):
        raise HTTPException(403, "Admin access required")
    return user


@router.get("")
async def list_entries(_admin: dict = Depends(_require_admin)) -> dict:
    cur = allowlist_col.find({}, {"_id": 0}).sort("added_at", -1)
    items = await cur.to_list(length=1000)
    # Serialize datetimes for the JSON response.
    for it in items:
        if isinstance(it.get("added_at"), datetime):
            it["added_at"] = it["added_at"].isoformat()
    return {"open": len(items) == 0, "entries": items}


@router.post("")
async def add_entry(entry: AllowlistEntry,
                    admin: dict = Depends(_require_admin)) -> dict:
    value = entry.value.strip().lower()
    if entry.type == "email" and "@" not in value:
        raise HTTPException(400, "email entry must contain '@'")
    if entry.type == "domain" and ("@" in value or "." not in value):
        raise HTTPException(400, "domain entry must look like 'example.com'")
    existing = await allowlist_col.find_one(
        {"type": entry.type, "value": value}, {"_id": 0}
    )
    if existing:
        return {"ok": True, "duplicate": True, "entry": _serialize(existing)}
    doc = {
        "id": "al_" + uuid.uuid4().hex[:12],
        "type": entry.type,
        "value": value,
        "added_by": admin["user_id"],
        "added_at": datetime.now(timezone.utc),
    }
    await allowlist_col.insert_one(doc)
    return {"ok": True, "duplicate": False, "entry": _serialize(doc)}


@router.delete("/{entry_id}")
async def delete_entry(entry_id: str,
                       _admin: dict = Depends(_require_admin)) -> dict:
    res = await allowlist_col.delete_one({"id": entry_id})
    if res.deleted_count == 0:
        raise HTTPException(404, "entry not found")
    return {"ok": True, "deleted_id": entry_id}


def _serialize(doc: dict) -> dict:
    out = {k: v for k, v in doc.items() if k != "_id"}
    if isinstance(out.get("added_at"), datetime):
        out["added_at"] = out["added_at"].isoformat()
    return out
