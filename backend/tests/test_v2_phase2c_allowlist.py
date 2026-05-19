"""Regression test for Phase 2 Piece C - Sign-in allowlist + admin CRUD.

Validates:
  * Allowlist is open when empty (any email allowed)
  * `is_email_allowed` matches by exact email AND by domain (case-insensitive)
  * Admin emails always bypass the allowlist
  * /api/auth/me returns is_admin=true for ADMIN_EMAILS members
  * Admin-gated CRUD (list / add / delete) rejects non-admins (403)
  * Duplicate add is idempotent
  * Invalid `type` / `value` payloads return 400/422
  * Delete returns 404 for unknown ids
  * The /api/auth/session endpoint short-circuits to 403 when an email
    fails the allowlist.  We can't test this end-to-end without a live
    Emergent session_id; instead we exercise the unit `is_email_allowed`
    and trust the wired-in call site (see auth.py).

Run:
    python3 backend/tests/test_v2_phase2c_allowlist.py
"""
from __future__ import annotations
import asyncio
import json
import os
import sys
import uuid
import urllib.error
import urllib.request
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

# Make sibling backend modules importable.
sys.path.insert(0, os.path.normpath(os.path.join(os.path.dirname(__file__), "..")))

from pymongo import MongoClient  # noqa: E402

BASE = os.environ.get("V2_BASE_URL", "http://localhost:8001")
MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]

# Pin the admin roster for THIS test process so we don't depend on the
# operator's .env edits.  The backend reads ADMIN_EMAILS afresh on each
# call (no cache) -- but only WITHIN its own process.  Since we hit the
# live backend over HTTP, we test via the seeded admin email instead.
admin_email = os.environ.get("ADMIN_EMAILS", "seeker0829@gmail.com").split(",")[0].strip().lower()

mc = MongoClient(MONGO_URL)
db = mc[DB_NAME]

failures: list[str] = []
passes = 0


def check(name: str, ok: bool, info: str = "") -> None:
    global passes
    if ok:
        passes += 1
    else:
        failures.append(name + ("  " + info if info else ""))


def http(method: str, path: str, body=None, headers=None):
    data = None
    h = headers.copy() if headers else {}
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        h["Content-Type"] = "application/json"
    req = urllib.request.Request(BASE + path, data=data, headers=h, method=method)
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return r.status, r.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8")


def seed_session(email: str, expires_in_days: int = 7) -> str:
    user_id = "user_" + uuid.uuid4().hex[:12]
    token = "test_session_" + uuid.uuid4().hex
    now = datetime.now(timezone.utc)
    db["users"].insert_one({
        "user_id": user_id, "email": email, "name": email,
        "picture": None, "created_at": now, "last_login_at": now,
    })
    db["user_sessions"].insert_one({
        "user_id": user_id, "session_token": token,
        "expires_at": now + timedelta(days=expires_in_days),
        "created_at": now,
    })
    return token, user_id


# ---------------------------------------------------------------------------
# Cleanup any prior test runs first.
# ---------------------------------------------------------------------------
db["auth_allowlist"].delete_many({"value": {"$regex": "^phase2c-"}})
db["users"].delete_many({"email": {"$regex": "^phase2c-"}})

# Make sure the allowlist starts empty (open mode) so the in-process tests
# below work irrespective of any operator-added entries.  Snapshot first
# so we can restore.
prior_entries = list(db["auth_allowlist"].find({}, {"_id": 0}))
db["auth_allowlist"].delete_many({})

# ---------------------------------------------------------------------------
# 1. Unit-level: is_email_allowed (open list, admin bypass, domain match).
# ---------------------------------------------------------------------------
from allowlist import is_email_allowed, is_admin  # noqa: E402

loop = asyncio.new_event_loop()

# 1a. Open allowlist -> any email allowed
ok = loop.run_until_complete(is_email_allowed("anyone@anywhere.test"))
check("1a. open allowlist allows arbitrary email", ok is True)

# 1b. Add domain entry, then non-matching email is rejected
db["auth_allowlist"].insert_one({
    "id": "al_" + uuid.uuid4().hex[:12],
    "type": "domain", "value": "phase2c-example.com",
    "added_by": "test", "added_at": datetime.now(timezone.utc),
})
ok = loop.run_until_complete(is_email_allowed("nope@elsewhere.test"))
check("1b. non-matching email rejected when list has a domain entry", ok is False)

# 1c. Matching domain is allowed
ok = loop.run_until_complete(is_email_allowed("alice@phase2c-example.com"))
check("1c. domain entry matches sub-emails", ok is True)

# 1d. Case-insensitive match
ok = loop.run_until_complete(is_email_allowed("ALICE@PHASE2C-EXAMPLE.COM"))
check("1d. domain match is case-insensitive", ok is True)

# 1e. Exact email entry
db["auth_allowlist"].insert_one({
    "id": "al_" + uuid.uuid4().hex[:12],
    "type": "email", "value": "phase2c-allowed@third.test",
    "added_by": "test", "added_at": datetime.now(timezone.utc),
})
ok = loop.run_until_complete(is_email_allowed("phase2c-allowed@third.test"))
check("1e. exact-email entry allows that email", ok is True)
ok = loop.run_until_complete(is_email_allowed("other@third.test"))
check("1e2. exact-email entry rejects other addresses at same domain", ok is False)

# 1f. Admin always bypasses
ok = loop.run_until_complete(is_email_allowed(admin_email))
check("1f. admin email always allowed (bypasses list)", ok is True)

# 1g. is_admin helper
check("1g. is_admin true for admin roster member",
      is_admin({"email": admin_email}) is True)
check("1g2. is_admin false for non-admin",
      is_admin({"email": "phase2c-allowed@third.test"}) is False)

# Reset list back to empty for the HTTP-level tests.
db["auth_allowlist"].delete_many({})

# ---------------------------------------------------------------------------
# 2. HTTP: /api/auth/me returns is_admin field
# ---------------------------------------------------------------------------
admin_token, admin_user_id = seed_session(admin_email)
non_admin_email = "phase2c-nonadmin@example.test"
non_admin_token, non_admin_user_id = seed_session(non_admin_email)

s, body = http("GET", "/api/auth/me",
               headers={"Authorization": "Bearer " + admin_token})
data = json.loads(body) if s == 200 else {}
check("2a. admin /me returns is_admin=true",
      s == 200 and data.get("is_admin") is True,
      "status=%d body=%s" % (s, body[:120]))

s, body = http("GET", "/api/auth/me",
               headers={"Authorization": "Bearer " + non_admin_token})
data = json.loads(body) if s == 200 else {}
check("2b. non-admin /me returns is_admin=false",
      s == 200 and data.get("is_admin") is False)

# ---------------------------------------------------------------------------
# 3. /api/auth/allowlist gating
# ---------------------------------------------------------------------------
# 3a. Anonymous = 401
s, _ = http("GET", "/api/auth/allowlist")
check("3a. anonymous GET allowlist -> 401", s == 401, "got %d" % s)

# 3b. Non-admin = 403
s, _ = http("GET", "/api/auth/allowlist",
            headers={"Authorization": "Bearer " + non_admin_token})
check("3b. non-admin GET allowlist -> 403", s == 403, "got %d" % s)

# 3c. Admin = 200, empty + open=true
s, body = http("GET", "/api/auth/allowlist",
               headers={"Authorization": "Bearer " + admin_token})
data = json.loads(body) if s == 200 else {}
check("3c. admin GET allowlist -> 200 open=true empty",
      s == 200 and data.get("open") is True and data.get("entries") == [],
      "got %d %s" % (s, body[:120]))

# 3d. Add a domain
s, body = http("POST", "/api/auth/allowlist",
               body={"type": "domain", "value": "phase2c-add.test"},
               headers={"Authorization": "Bearer " + admin_token})
data = json.loads(body) if s == 200 else {}
entry_id = (data.get("entry") or {}).get("id")
check("3d. admin POST domain -> 200 + entry id",
      s == 200 and entry_id and not data.get("duplicate"),
      "got %d %s" % (s, body[:160]))

# 3e. Re-add same domain -> duplicate=true, still 200
s, body = http("POST", "/api/auth/allowlist",
               body={"type": "domain", "value": "phase2c-add.test"},
               headers={"Authorization": "Bearer " + admin_token})
data = json.loads(body) if s == 200 else {}
check("3e. duplicate add is idempotent",
      s == 200 and data.get("duplicate") is True)

# 3f. Add an email
s, body = http("POST", "/api/auth/allowlist",
               body={"type": "email", "value": "phase2c-add@example.test"},
               headers={"Authorization": "Bearer " + admin_token})
check("3f. admin POST email -> 200", s == 200)

# 3g. Bad type -> 422 (pydantic) or 400
s, _ = http("POST", "/api/auth/allowlist",
            body={"type": "bogus", "value": "x"},
            headers={"Authorization": "Bearer " + admin_token})
check("3g. invalid type -> 4xx", 400 <= s < 500)

# 3h. domain entry missing dot -> 400
s, _ = http("POST", "/api/auth/allowlist",
            body={"type": "domain", "value": "nodots"},
            headers={"Authorization": "Bearer " + admin_token})
check("3h. domain without dot -> 400", s == 400)

# 3i. email entry missing @ -> 400
s, _ = http("POST", "/api/auth/allowlist",
            body={"type": "email", "value": "no-at-sign"},
            headers={"Authorization": "Bearer " + admin_token})
check("3i. email without @ -> 400", s == 400)

# 3j. List now has 2 entries, open=false
s, body = http("GET", "/api/auth/allowlist",
               headers={"Authorization": "Bearer " + admin_token})
data = json.loads(body)
check("3j. list now contains 2 entries open=false",
      len(data.get("entries", [])) == 2 and data.get("open") is False,
      "got entries=%d open=%s" % (len(data.get("entries", [])), data.get("open")))

# 3k. Non-admin POST -> 403
s, _ = http("POST", "/api/auth/allowlist",
            body={"type": "domain", "value": "phase2c-other.test"},
            headers={"Authorization": "Bearer " + non_admin_token})
check("3k. non-admin POST -> 403", s == 403)

# 3l. Delete the entry
s, _ = http("DELETE", "/api/auth/allowlist/" + entry_id,
            headers={"Authorization": "Bearer " + admin_token})
check("3l. admin DELETE existing entry -> 200", s == 200, "got %d" % s)

# 3m. Delete unknown id -> 404
s, _ = http("DELETE", "/api/auth/allowlist/al_bogus_id_xxx",
            headers={"Authorization": "Bearer " + admin_token})
check("3m. DELETE unknown id -> 404", s == 404)

# 3n. Non-admin DELETE -> 403
s, _ = http("DELETE", "/api/auth/allowlist/anything",
            headers={"Authorization": "Bearer " + non_admin_token})
check("3n. non-admin DELETE -> 403", s == 403)

# ---------------------------------------------------------------------------
# Cleanup
# ---------------------------------------------------------------------------
db["users"].delete_one({"user_id": admin_user_id})
db["users"].delete_one({"user_id": non_admin_user_id})
db["user_sessions"].delete_many({"user_id": {"$in": [admin_user_id, non_admin_user_id]}})
db["auth_allowlist"].delete_many({})
# Restore prior entries (if any) -- be careful with datetime/iso strings.
for e in prior_entries:
    if isinstance(e.get("added_at"), str):
        try:
            e["added_at"] = datetime.fromisoformat(e["added_at"])
        except Exception:  # noqa: BLE001
            e["added_at"] = datetime.now(timezone.utc)
if prior_entries:
    db["auth_allowlist"].insert_many(prior_entries)

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
total = passes + len(failures)
print("V2.0 Phase 2c (allowlist): %d/%d pass." % (passes, total))
if failures:
    print("FAILURES:")
    for f in failures:
        print("  - " + f)
    sys.exit(1)
sys.exit(0)
