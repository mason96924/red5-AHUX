"""routes/config_gate.py — server-side check of the engineer/config master key.

The engineer/config "recovery" master password used to be hardcoded in the
browser (landing.html, equipment_mapper.html, config-auth-modal.js), which
meant anyone could read it via the browser's View-Source.  It now lives ONLY
in the backend and is checked here: the browser POSTs the typed password and
receives {"ok": true|false}; the key itself is never sent to the client.

Two ways to unlock, so the gate stays in lock-step with admin login:
  1. A signed-in **admin** session (the `red5_auth` cookie) unlocks directly —
     no need to re-type the master key you already logged in with.
  2. Otherwise the typed password is compared against the SAME master-key
     source `studio_auth` uses for admin login (RED5_MASTER_KEY env OR
     data/master_key.txt).  The previous version read ONLY the env var, so a
     deployment that stored the key in master_key.txt could log in as admin
     but never pass this gate.
"""
from __future__ import annotations

import hmac

from fastapi import APIRouter, Request
from pydantic import BaseModel

import studio_auth

router = APIRouter()


class UnlockRequest(BaseModel):
    password: str = ""


@router.post("/api/config/unlock")
async def config_unlock(body: UnlockRequest, request: Request) -> dict:
    """Return {"ok": True} when the caller is a signed-in admin OR the supplied
    password matches the server-side master key (constant-time compare)."""
    studio_auth.init_studio_auth()

    # 1) Already signed in as admin -> unlock without re-entering the key.
    ident = studio_auth.identity_from_request(request)
    if ident.get("r") == "admin":
        return {"ok": True, "via": "session"}

    # 2) Fall back to the typed password, checked against the same master-key
    #    source admin login uses (env var OR master_key.txt).
    master = studio_auth.master_key()
    supplied = body.password or ""
    ok = bool(master) and hmac.compare_digest(supplied, master)
    return {"ok": ok, "via": "master_key" if ok else None}
