"""routes/config_gate.py — server-side check of the engineer/config master key.

The engineer/config "recovery" master password used to be hardcoded in the
browser (landing.html, equipment_mapper.html, config-auth-modal.js), which
meant anyone could read it via the browser's View-Source.  It now lives ONLY
in the backend environment (RED5_MASTER_KEY in backend/.env) and is checked
here: the browser POSTs the typed password and receives {"ok": true|false};
the key itself is never sent to the client.
"""
from __future__ import annotations

import hmac
import os

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class UnlockRequest(BaseModel):
    password: str = ""


@router.post("/api/config/unlock")
async def config_unlock(body: UnlockRequest) -> dict:
    """Return {"ok": True} only when the supplied password matches the
    server-side master key.  Uses a constant-time compare to avoid leaking
    the key length/content via timing."""
    master = os.environ.get("RED5_MASTER_KEY", "")
    supplied = body.password or ""
    ok = bool(master) and hmac.compare_digest(supplied, master)
    return {"ok": ok}
