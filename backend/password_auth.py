"""Red5 Studio V2.0 - Phase 2 Piece F: emergency password login (admin only).

This module ADDS a second sign-in path for the bootstrap admin email while
keeping the existing Emergent Google OAuth flow (auth.py) untouched.  Both
paths issue the SAME `session_token` cookie and persist into the SAME
`user_sessions` Mongo collection, so:

  - /api/auth/me        works unchanged
  - /api/auth/logout    works unchanged
  - tenant + allowlist  logic re-used
  - admin gating (ADMIN_EMAILS env) re-used

Endpoint:
  POST /api/auth/password-login
       body: {"email": "...", "password": "..."}
       response: same shape as /api/auth/session; sets session_token cookie.

Security:
  - Password stored as bcrypt hash in .env (ADMIN_PASSWORD_HASH); the env
    value MUST be double-quoted so the shell can't expand the $ glyphs.
  - Brute-force lockout: 5 failed attempts per (email, ip) -> 15 min
    cooldown.  Counters live in Mongo `login_attempts` collection (TTL).
  - Only emails in ADMIN_EMAILS are even allowed to attempt password
    login -- prevents this path from becoming a general signup backdoor.

Idempotent admin seed:
  On import, ensure a `users` row exists for ADMIN_PASSWORD_EMAIL.  We
  never store the password itself, only re-use the hash from .env at
  verification time -- so rotating the password is a single env edit.
"""
from __future__ import annotations

import os
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt
from fastapi import APIRouter, HTTPException, Request, Response
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr


MONGO_URL = os.environ["MONGO_URL"]
DB_NAME   = os.environ["DB_NAME"]

_client = AsyncIOMotorClient(MONGO_URL)
_db = _client[DB_NAME]
users_col          = _db["users"]
sessions_col       = _db["user_sessions"]
login_attempts_col = _db["login_attempts"]


SESSION_LIFETIME = timedelta(days=7)
COOKIE_NAME      = "session_token"

MAX_ATTEMPTS     = 5
LOCKOUT_WINDOW   = timedelta(minutes=15)


def _client_ip(request: Request) -> str:
    """Resolve the real client IP behind reverse proxies / k8s ingress.

    Honors `X-Forwarded-For` (left-most entry = original client) so that
    the brute-force counter is keyed by the actual remote IP rather than
    whichever ingress replica happened to terminate the TCP connection.
    Without this, requests from the same browser can be bucketed under
    different upstream IPs and the lockout never trips (flaky test).
    """
    xff = request.headers.get("x-forwarded-for", "") or ""
    if xff:
        first = xff.split(",")[0].strip()
        if first:
            return first
    real_ip = (request.headers.get("x-real-ip", "") or "").strip()
    if real_ip:
        return real_ip
    return (request.client.host if request.client else "unknown") or "unknown"


router = APIRouter(prefix="/api/auth", tags=["auth", "password"])


class PasswordLoginRequest(BaseModel):
    email: EmailStr
    password: str


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _admin_emails() -> set[str]:
    raw = os.environ.get("ADMIN_EMAILS", "") or ""
    return {e.strip().lower() for e in raw.split(",") if e.strip()}


def _password_admin_email() -> Optional[str]:
    v = os.environ.get("ADMIN_PASSWORD_EMAIL", "").strip().lower()
    return v or None


def _password_hash() -> Optional[str]:
    """Bcrypt hash for the password-login admin, read from env each time so
    rotation is a single .env edit + supervisor restart away."""
    return os.environ.get("ADMIN_PASSWORD_HASH") or None


def _verify(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except (ValueError, TypeError):
        return False


async def _record_failure(ip: str, email: str) -> int:
    """Insert a failure row and return the count of failures inside the
    lockout window for the given (ip, email) pair."""
    now = datetime.now(timezone.utc)
    await login_attempts_col.insert_one({
        "identifier": f"{ip}:{email.lower()}",
        "created_at": now,
    })
    cutoff = now - LOCKOUT_WINDOW
    return await login_attempts_col.count_documents({
        "identifier": f"{ip}:{email.lower()}",
        "created_at": {"$gte": cutoff},
    })


async def _is_locked_out(ip: str, email: str) -> bool:
    cutoff = datetime.now(timezone.utc) - LOCKOUT_WINDOW
    count = await login_attempts_col.count_documents({
        "identifier": f"{ip}:{email.lower()}",
        "created_at": {"$gte": cutoff},
    })
    return count >= MAX_ATTEMPTS


async def _clear_failures(ip: str, email: str) -> None:
    await login_attempts_col.delete_many({
        "identifier": f"{ip}:{email.lower()}",
    })


# ---------------------------------------------------------------------------
# Admin user upsert (idempotent; called at import)
# ---------------------------------------------------------------------------
async def ensure_password_admin_user() -> None:
    """Make sure a `users` row exists for the password-admin email so the
    OAuth-side flows that look up by email (tenant seed, /api/auth/me)
    keep working when the user signs in via password.  The bcrypt hash
    itself lives ONLY in env; we never write it to the users doc."""
    email = _password_admin_email()
    if not email or not _password_hash():
        return
    existing = await users_col.find_one({"email": email}, {"_id": 0})
    if existing:
        return
    now = datetime.now(timezone.utc)
    await users_col.insert_one({
        "user_id":       "user_" + uuid.uuid4().hex[:12],
        "email":         email,
        "name":          email,
        "picture":       None,
        "google_sub":    None,
        "created_at":    now,
        "last_login_at": now,
    })


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@router.post("/password-login")
async def password_login(payload: PasswordLoginRequest,
                         request: Request,
                         response: Response):
    email = payload.email.strip().lower()
    ip = _client_ip(request)

    # Hard gate -- only admin-listed emails can attempt password login.
    # This prevents this endpoint from becoming a general signup oracle.
    if email not in _admin_emails():
        # Same response shape as a wrong-password to avoid leaking which
        # emails are admin-listed.
        raise HTTPException(401, "Invalid credentials")

    if await _is_locked_out(ip, email):
        raise HTTPException(429, "Too many failed attempts. Try again later.")

    expected_email = _password_admin_email()
    expected_hash  = _password_hash()
    if not expected_email or not expected_hash or email != expected_email:
        await _record_failure(ip, email)
        raise HTTPException(401, "Invalid credentials")

    if not _verify(payload.password, expected_hash):
        attempts = await _record_failure(ip, email)
        # On the Nth failure the next attempt is already locked.
        if attempts >= MAX_ATTEMPTS:
            raise HTTPException(429, "Too many failed attempts. Try again later.")
        raise HTTPException(401, "Invalid credentials")

    # Success -- clear counters, upsert user, mint session.
    await _clear_failures(ip, email)
    await ensure_password_admin_user()

    user = await users_col.find_one({"email": email}, {"_id": 0})
    if not user:
        # Should never happen post-ensure, but guard anyway.
        raise HTTPException(500, "Admin user could not be provisioned")

    now = datetime.now(timezone.utc)
    expires_at = now + SESSION_LIFETIME
    session_token = uuid.uuid4().hex
    await sessions_col.insert_one({
        "user_id":       user["user_id"],
        "session_token": session_token,
        "expires_at":    expires_at,
        "created_at":    now,
    })
    await users_col.update_one(
        {"user_id": user["user_id"]},
        {"$set": {"last_login_at": now}},
    )

    response.set_cookie(
        key=COOKIE_NAME,
        value=session_token,
        max_age=int(SESSION_LIFETIME.total_seconds()),
        httponly=True,
        secure=True,
        samesite="lax",
        path="/",
    )

    # Tenant seed -- mirror the OAuth path so the rest of the app
    # (tenant_*, allowlist) just works.  Late-imported to avoid cycle.
    try:
        from tenants import get_or_create_tenant_for_user  # noqa: E402
        await get_or_create_tenant_for_user({
            "user_id": user["user_id"],
            "email":   user["email"],
            "name":    user.get("name") or user["email"],
        })
    except Exception as e:  # noqa: BLE001
        print("[password_auth] tenant seed failed: %s" % e)

    return {
        "ok": True,
        "user": {
            "user_id": user["user_id"],
            "email":   user["email"],
            "name":    user.get("name") or user["email"],
            "picture": user.get("picture"),
        },
    }
