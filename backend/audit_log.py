"""Red5 Studio V2.0 - Phase 2 Piece G: setpoint-change audit log.

Append-only audit trail for any mutation an admin makes against the
control plane (SA-RH clamp, write-point overrides, G36 setpoints, ...).
Lives in Mongo collection `audit_log` with a 90-day TTL so the trail is
bounded but long enough for forensic walks after an incident.

Schema (one doc per change):
    {
        "event_id":    UUID hex,
        "ts":          datetime (UTC, indexed for TTL + sort),
        "user_id":     str | None,
        "user_email":  str | None,
        "tenant_id":   str | None,
        "action":      "write-point" | "g36-setpoint" | "sa-rh-clamp" | ...,
        "resource":    free-form short label (e.g. "AHU-01-E" or "tenant:abc"),
        "before":      dict | None,
        "after":       dict | None,
        "ip":          str | None,
        "user_agent":  str | None,
    }

Caller pattern:
    from audit_log import record_audit
    await record_audit(
        request, user, tenant,
        action="write-point",
        resource=equip_name,
        before=prev_state, after=writes,
    )

The helper never raises -- audit logging is best-effort and must NEVER
block the real mutation it's recording.
"""
from __future__ import annotations

import os
import uuid
from datetime import datetime, timezone, timedelta
from typing import Any, Optional

from fastapi import APIRouter, Cookie, Depends, Header, HTTPException, Query, Request
from motor.motor_asyncio import AsyncIOMotorClient


MONGO_URL = os.environ["MONGO_URL"]
DB_NAME   = os.environ["DB_NAME"]

_client = AsyncIOMotorClient(MONGO_URL)
_db = _client[DB_NAME]
audit_col = _db["audit_log"]

# 90-day TTL: long enough to walk an incident, short enough that the
# collection stays small.  Indexed on (ts) for both TTL eviction and
# default DESC sort in the read endpoint.
TTL_DAYS = 90


_ttl_index_ready = False


async def _ensure_indexes() -> None:
    """Create the TTL + sort index once per process.  Idempotent."""
    global _ttl_index_ready
    if _ttl_index_ready:
        return
    try:
        await audit_col.create_index(
            "ts",
            expireAfterSeconds=TTL_DAYS * 24 * 60 * 60,
            name="audit_ttl_ts",
        )
        await audit_col.create_index(
            [("ts", -1), ("action", 1)],
            name="audit_ts_action",
        )
        _ttl_index_ready = True
    except Exception:  # noqa: BLE001
        pass  # best-effort; never fail the caller


def _client_ip(request: Optional[Request]) -> Optional[str]:
    if request is None:
        return None
    xff = (request.headers.get("x-forwarded-for") or "").split(",")[0].strip()
    if xff:
        return xff
    real_ip = (request.headers.get("x-real-ip") or "").strip()
    if real_ip:
        return real_ip
    return (request.client.host if request.client else None)


async def record_audit(
    request: Optional[Request],
    user: Optional[dict],
    tenant: Optional[dict],
    *,
    action: str,
    resource: str,
    before: Optional[Any] = None,
    after: Optional[Any] = None,
) -> Optional[str]:
    """Append one audit row.  Returns the event_id on success, None on
    any error -- the caller MUST NOT rely on the return value or the
    write succeeding.  Audit is observability, not a transaction."""
    try:
        await _ensure_indexes()
        event_id = uuid.uuid4().hex
        doc = {
            "event_id":   event_id,
            "ts":         datetime.now(timezone.utc),
            "user_id":    (user or {}).get("user_id"),
            "user_email": (user or {}).get("email"),
            "tenant_id":  (tenant or {}).get("tenant_id"),
            "action":     action,
            "resource":   resource,
            "before":     before,
            "after":      after,
            "ip":         _client_ip(request),
            "user_agent": (request.headers.get("user-agent") if request else None),
        }
        await audit_col.insert_one(doc)
        return event_id
    except Exception:  # noqa: BLE001
        return None


# ---------------------------------------------------------------------------
# Admin gate (re-implemented here to avoid an import cycle with auth.py)
# ---------------------------------------------------------------------------
def _admin_emails() -> set[str]:
    raw = os.environ.get("ADMIN_EMAILS", "") or ""
    return {e.strip().lower() for e in raw.split(",") if e.strip()}


async def _require_admin(
    session_token: Optional[str] = Cookie(default=None),
    authorization: Optional[str] = Header(default=None),
) -> dict:
    """Resolve the session and gate to admin-listed emails.  Used by the
    audit-log read endpoint (and reusable by other admin-only routes)."""
    from auth import _resolve_session_token  # late import: avoid cycle
    token = session_token
    if not token and authorization and authorization.startswith("Bearer "):
        token = authorization[7:].strip()
    if not token:
        raise HTTPException(401, "Not authenticated")
    user = await _resolve_session_token(token)
    if not user:
        raise HTTPException(401, "Session expired or invalid")
    email = (user.get("email") or "").lower()
    if email not in _admin_emails():
        raise HTTPException(403, "Admin only")
    return user


# ---------------------------------------------------------------------------
# Read endpoint (admin only)
# ---------------------------------------------------------------------------
router = APIRouter(prefix="/api/audit-log", tags=["audit-log"])


@router.get("")
async def list_audit_events(
    limit:   int = Query(default=100, ge=1, le=500),
    action:  Optional[str] = Query(default=None),
    resource: Optional[str] = Query(default=None,
                                    description="Exact-match resource filter, e.g. `ahu:AHU-01-E`"),
    user_email: Optional[str] = Query(default=None),
    since:   Optional[str] = Query(default=None,
                                   description="ISO timestamp; only return events at or after this UTC instant"),
    admin: dict = Depends(_require_admin),
) -> dict:
    """Return the most recent N audit events, newest first.  Optional
    filters: `action` (exact match), `resource` (exact match), `user_email`
    (exact match), `since` (ISO UTC).  Always returns
    `{events: [...], count: N}` so the UI can bind without null checks."""
    await _ensure_indexes()
    q: dict = {}
    if action:
        q["action"] = action
    if resource:
        q["resource"] = resource
    if user_email:
        q["user_email"] = user_email.lower()
    if since:
        try:
            dt = datetime.fromisoformat(since.replace("Z", "+00:00"))
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            q["ts"] = {"$gte": dt}
        except ValueError:
            raise HTTPException(400, "`since` must be an ISO-8601 UTC timestamp")

    cursor = audit_col.find(q, {"_id": 0}).sort("ts", -1).limit(limit)
    events = []
    async for doc in cursor:
        # Mongo gives us a datetime; normalize to ISO for JSON.
        if isinstance(doc.get("ts"), datetime):
            ts = doc["ts"]
            if ts.tzinfo is None:
                ts = ts.replace(tzinfo=timezone.utc)
            doc["ts"] = ts.isoformat()
        events.append(doc)
    return {"events": events, "count": len(events), "ttl_days": TTL_DAYS}


@router.get("/summary")
async def audit_summary(admin: dict = Depends(_require_admin)) -> dict:
    """Counts by action over the last 24h + 7d -- powers a tiny header
    chip on the audit-log tab without paging through the full list."""
    await _ensure_indexes()
    now = datetime.now(timezone.utc)
    h24 = now - timedelta(hours=24)
    d7  = now - timedelta(days=7)
    out: dict = {"window_24h": {}, "window_7d": {}, "total": 0}

    async def _bucket(window_key: str, since: datetime) -> None:
        cursor = audit_col.aggregate([
            {"$match": {"ts": {"$gte": since}}},
            {"$group": {"_id": "$action", "n": {"$sum": 1}}},
        ])
        async for row in cursor:
            out[window_key][row["_id"] or "unknown"] = row["n"]

    await _bucket("window_24h", h24)
    await _bucket("window_7d",  d7)
    out["total"] = await audit_col.count_documents({})
    out["ttl_days"] = TTL_DAYS
    return out
