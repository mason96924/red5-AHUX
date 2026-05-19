"""Red5 Studio V2.0 - Phase 2 Piece A: Emergent Google Auth.

Implements:
  POST /api/auth/session  -- exchanges a `session_id` (from URL fragment)
                              for a `session_token` + sets httpOnly cookie.
  GET  /api/auth/me        -- returns current user (cookie OR Bearer).
  POST /api/auth/logout   -- clears server session + cookie.

Storage (MongoDB, db = $DB_NAME):
  users           -- one doc per signed-in identity
                     ( user_id, email, name, picture, google_sub,
                       created_at, last_login_at )
  user_sessions   -- one doc per session_token issued
                     ( user_id, session_token, expires_at, created_at )

Cookie:
  session_token   path=/, httpOnly=True, secure=True, samesite="none"
                  7-day expiry (mirrored in user_sessions.expires_at)

Important:
  - User identity comes from Emergent's `/auth/v1/env/oauth/session-data`
    endpoint -- we never touch Google directly, no API keys required.
  - Custom user_id is `"user_" + uuid4().hex[:12]` -- NOT MongoDB _id.
  - All queries project `{"_id": 0}` so responses serialize cleanly.

Anonymous-demo invariant (Phase 2 Piece A scope):
  -  /api/auth/me 401s for anonymous visitors -- that is fine.
  -  All other /api/* endpoints stay open so /dashboard.html keeps working
     without sign-in.  Per-tenant gating ships in Piece B.
"""
from __future__ import annotations

import os
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional

import httpx
from fastapi import APIRouter, Cookie, Header, HTTPException, Request, Response
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel


MONGO_URL = os.environ["MONGO_URL"]
DB_NAME   = os.environ["DB_NAME"]

_client = AsyncIOMotorClient(MONGO_URL)
_db = _client[DB_NAME]
users_col    = _db["users"]
sessions_col = _db["user_sessions"]

EMERGENT_SESSION_DATA_URL = (
    "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"
)
SESSION_LIFETIME = timedelta(days=7)
COOKIE_NAME = "session_token"

router = APIRouter(prefix="/api/auth", tags=["auth"])


class User(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None


class SessionExchangeRequest(BaseModel):
    session_id: str


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
async def _resolve_session_token(session_token: str) -> Optional[dict]:
    """Look up session_token -> user doc.  Returns None if expired/missing."""
    sdoc = await sessions_col.find_one(
        {"session_token": session_token}, {"_id": 0}
    )
    if not sdoc:
        return None
    exp = sdoc.get("expires_at")
    if isinstance(exp, str):
        exp = datetime.fromisoformat(exp)
    if exp is not None and exp.tzinfo is None:
        exp = exp.replace(tzinfo=timezone.utc)
    if exp is not None and exp < datetime.now(timezone.utc):
        return None
    return await users_col.find_one(
        {"user_id": sdoc["user_id"]}, {"_id": 0}
    )


async def current_user(
    session_token: Optional[str] = Cookie(default=None),
    authorization: Optional[str] = Header(default=None),
) -> dict:
    """Cookie first, then `Authorization: Bearer ...` fallback.  401 otherwise."""
    token = session_token
    if not token and authorization and authorization.startswith("Bearer "):
        token = authorization[7:].strip()
    if not token:
        raise HTTPException(401, "Not authenticated")
    user = await _resolve_session_token(token)
    if not user:
        raise HTTPException(401, "Session expired or invalid")
    return user


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@router.post("/session")
async def exchange_session(payload: SessionExchangeRequest, response: Response):
    """Front-end posts the URL-fragment session_id here right after the
    Emergent Google redirect. We call Emergent's session-data endpoint
    server-side (the spec forbids doing it from the browser), persist the
    user + session, and set the httpOnly session_token cookie."""
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.get(
                EMERGENT_SESSION_DATA_URL,
                headers={"X-Session-ID": payload.session_id},
            )
    except httpx.RequestError as e:
        raise HTTPException(502, f"Emergent auth upstream unreachable: {e}")

    if r.status_code != 200:
        raise HTTPException(401, f"Emergent auth rejected the session_id: {r.status_code}")
    data = r.json()
    email = data.get("email")
    if not email:
        raise HTTPException(400, "Emergent response missing email")

    # Upsert user keyed on email so re-logins do not duplicate identities.
    now = datetime.now(timezone.utc)
    existing = await users_col.find_one({"email": email}, {"_id": 0})
    if existing:
        user_id = existing["user_id"]
        await users_col.update_one(
            {"user_id": user_id},
            {"$set": {
                "name": data.get("name") or existing.get("name", email),
                "picture": data.get("picture") or existing.get("picture"),
                "google_sub": data.get("id") or existing.get("google_sub"),
                "last_login_at": now,
            }},
        )
    else:
        user_id = "user_" + uuid.uuid4().hex[:12]
        await users_col.insert_one({
            "user_id": user_id,
            "email": email,
            "name": data.get("name") or email,
            "picture": data.get("picture"),
            "google_sub": data.get("id"),
            "created_at": now,
            "last_login_at": now,
        })

    # Persist server-side session row + set cookie.
    expires_at = now + SESSION_LIFETIME
    session_token = data.get("session_token") or uuid.uuid4().hex
    await sessions_col.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": expires_at,
        "created_at": now,
    })

    response.set_cookie(
        key=COOKIE_NAME,
        value=session_token,
        max_age=int(SESSION_LIFETIME.total_seconds()),
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
    )

    return {
        "ok": True,
        "user": {
            "user_id": user_id,
            "email": email,
            "name": data.get("name") or email,
            "picture": data.get("picture"),
        },
    }


@router.get("/me")
async def me(request: Request,
             session_token: Optional[str] = Cookie(default=None),
             authorization: Optional[str] = Header(default=None)):
    """Return current user or 401.  Used by the React app to decide whether
    to render the avatar drop-down or the Sign-in button, AND by the V1.9
    SPA so it can surface who is signed in."""
    user = await current_user(session_token=session_token, authorization=authorization)
    return {
        "user_id": user["user_id"],
        "email": user["email"],
        "name": user["name"],
        "picture": user.get("picture"),
    }


@router.post("/logout")
async def logout(response: Response,
                 session_token: Optional[str] = Cookie(default=None)):
    if session_token:
        await sessions_col.delete_one({"session_token": session_token})
    response.delete_cookie(COOKIE_NAME, path="/")
    return {"ok": True}
