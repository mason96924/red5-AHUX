"""Regression test for Phase 2 Piece A - Emergent Google Auth.

Validates the FastAPI surface and DB integration without hitting the live
Emergent OAuth servers.  Uses MongoDB directly to seed a test session, then
exercises the endpoints with both Cookie and Bearer credentials.

Run:
    python3 backend/tests/test_v2_phase2a_auth.py
"""
from __future__ import annotations
import json
import os
import sys
import time
import urllib.error
import urllib.request
import uuid

from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

from pymongo import MongoClient

BASE = os.environ.get("V2_BASE_URL", "http://localhost:8001")
MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]

failures = []
passes = 0


def check(name, ok, info=""):
    global passes
    if ok:
        passes += 1
    else:
        failures.append(name + ("  " + info if info else ""))


def get(path, headers=None):
    req = urllib.request.Request(BASE + path, headers=headers or {})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return r.status, r.read().decode("utf-8"), dict(r.headers)
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8"), dict(e.headers)


def post(path, body, headers=None):
    h = {"Content-Type": "application/json"}
    if headers:
        h.update(headers)
    req = urllib.request.Request(
        BASE + path,
        data=json.dumps(body).encode("utf-8"),
        headers=h,
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return r.status, r.read().decode("utf-8"), dict(r.headers)
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8"), dict(e.headers)


# Seed a test user + session directly in MongoDB.
mc = MongoClient(MONGO_URL)
db = mc[DB_NAME]
test_email   = f"phase2a-test-{int(time.time())}@example.com"
test_user_id = "user_" + uuid.uuid4().hex[:12]
test_token   = "test_session_" + uuid.uuid4().hex
now = datetime.now(timezone.utc)
db["users"].insert_one({
    "user_id": test_user_id,
    "email": test_email,
    "name": "Phase 2a Test User",
    "picture": "https://example.com/avatar.png",
    "created_at": now,
    "last_login_at": now,
})
db["user_sessions"].insert_one({
    "user_id": test_user_id,
    "session_token": test_token,
    "expires_at": now + timedelta(days=7),
    "created_at": now,
})

# ---- 1. Anonymous /api/auth/me returns 401 ----
s, body, _ = get("/api/auth/me")
check("anonymous /api/auth/me -> 401", s == 401)

# ---- 2. Bearer-token auth path resolves the user ----
s, body, _ = get("/api/auth/me", {"Authorization": "Bearer " + test_token})
ok = (s == 200)
data = json.loads(body) if ok else {}
check("Bearer auth -> 200 + correct email",
      ok and data.get("email") == test_email,
      "got %d  body=%s" % (s, body[:120]))
check("Bearer auth response shape: user_id/email/name/picture",
      ok and all(k in data for k in ("user_id", "email", "name", "picture")))

# ---- 3. Cookie auth path resolves the user ----
s, body, _ = get("/api/auth/me", {"Cookie": "session_token=" + test_token})
check("Cookie auth -> 200",
      s == 200 and json.loads(body)["email"] == test_email)

# ---- 4. Invalid session token -> 401 ----
s, _, _ = get("/api/auth/me", {"Authorization": "Bearer bogus_token_xxx"})
check("invalid token -> 401", s == 401)

# ---- 5. Expired session is rejected ----
expired_token = "test_expired_" + uuid.uuid4().hex
db["user_sessions"].insert_one({
    "user_id": test_user_id,
    "session_token": expired_token,
    "expires_at": now - timedelta(days=1),
    "created_at": now - timedelta(days=8),
})
s, _, _ = get("/api/auth/me", {"Authorization": "Bearer " + expired_token})
check("expired token -> 401", s == 401)

# ---- 6. Logout deletes the session row ----
s, body, _ = post("/api/auth/logout", {}, {"Cookie": "session_token=" + test_token})
check("logout -> 200", s == 200 and json.loads(body)["ok"] is True)
remaining = db["user_sessions"].count_documents({"session_token": test_token})
check("logout removes session row from DB", remaining == 0,
      "got %d remaining" % remaining)
# Subsequent /me with the same token should 401
s, _, _ = get("/api/auth/me", {"Authorization": "Bearer " + test_token})
check("post-logout token -> 401", s == 401)

# ---- 7. exchange_session with bogus session_id reaches Emergent and 401s ----
s, body, _ = post("/api/auth/session", {"session_id": "bogus_id_for_test"})
check("POST /api/auth/session bogus id -> 401 from Emergent upstream",
      s == 401,
      "got %d  body=%s" % (s, body[:120]))

# ---- 8. Anonymous demo path is preserved (/api/data still open) ----
s, body, _ = get("/api/data")
check("anonymous /api/data still works (anonymous demo preserved)",
      s == 200 and isinstance(json.loads(body), list))

# ---- 9. Mongo projection check: no _id leaks ----
s, body, _ = get("/api/auth/me", {"Authorization": "Bearer " + expired_token})
# (Will be 401, but lets check live /me)
# Re-issue a fresh test session for this check.
fresh_token = "fresh_" + uuid.uuid4().hex
db["user_sessions"].insert_one({
    "user_id": test_user_id,
    "session_token": fresh_token,
    "expires_at": now + timedelta(days=7),
    "created_at": now,
})
s, body, _ = get("/api/auth/me", {"Authorization": "Bearer " + fresh_token})
data = json.loads(body)
check("/api/auth/me response excludes Mongo _id",
      "_id" not in data,
      "body had keys: %s" % list(data.keys()))

# Cleanup
db["users"].delete_one({"user_id": test_user_id})
db["user_sessions"].delete_many({"user_id": test_user_id})

# ---- Summary ----
total = passes + len(failures)
print("V2.0 Phase 2a (auth): %d/%d pass." % (passes, total))
if failures:
    print("FAILURES:")
    for f in failures:
        print("  - " + f)
    sys.exit(1)
sys.exit(0)
