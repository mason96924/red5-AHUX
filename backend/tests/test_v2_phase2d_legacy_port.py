"""Phase 2 comprehensive port regression — every legacy V1.9 endpoint the
dashboard / mapper calls must respond with the V1.9-compatible shape so we
never again ship a release with silent 404s on a tab-by-tab user discovery.

Run:
    python3 backend/tests/test_v2_phase2d_legacy_port.py
"""
from __future__ import annotations
import asyncio
import json
import os
import sys
import urllib.error
import urllib.request
import uuid
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

from pymongo import MongoClient  # noqa: E402

BASE = os.environ.get("V2_BASE_URL", "http://localhost:8001")
MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
mc = MongoClient(MONGO_URL)
db = mc[DB_NAME]

passes = 0
failures: list[str] = []


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
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()


def seed_session() -> tuple[str, str]:
    user_id = "user_" + uuid.uuid4().hex[:12]
    token = "p2d_session_" + uuid.uuid4().hex
    now = datetime.now(timezone.utc)
    db["users"].insert_one({
        "user_id": user_id, "email": f"{user_id}@p2d.test", "name": "P2d Tester",
        "picture": None, "created_at": now, "last_login_at": now,
    })
    db["user_sessions"].insert_one({
        "user_id": user_id, "session_token": token,
        "expires_at": now + timedelta(days=7), "created_at": now,
    })
    return token, user_id


token, user_id = seed_session()
auth = {"Authorization": f"Bearer {token}"}

# --- /api/write-point ---
s, body = http("POST", "/api/write-point", body={"equipment_name": "AHU-01", "writes": {"OAD": 75}})
d = json.loads(body) if s == 200 else {}
check("write-point (anon) accepts and reflects writes",
      s == 200 and d.get("success") and d.get("writes") == {"OAD": 75},
      f"got {s} {body[:120]}")
s, body = http("POST", "/api/write-point", body={"equipment_name": ""}, headers=auth)
check("write-point rejects missing equipment_name", s == 200 and not json.loads(body).get("success"))

# --- /api/create-directory / delete-directory ---
s, body = http("POST", "/api/create-directory", body={"dirname": "graphics/p2d_test"}, headers=auth)
check("create-directory (signed) -> success virtual-fs",
      s == 200 and json.loads(body).get("success") is True)
s, body = http("POST", "/api/create-directory", body={"dirname": ".."})
check("create-directory rejects '..'", s == 200 and not json.loads(body).get("success"))
s, body = http("POST", "/api/delete-directory", body={"dirname": "foo"})
check("delete-directory anon -> friendly error",
      s == 200 and "Sign in" in (json.loads(body).get("error") or ""))

# --- /api/upload-file + /api/delete-file + /api/move-file round-trip ---
import base64
b64 = base64.b64encode(b"hello world").decode()
fn  = f"p2d_test/{uuid.uuid4().hex[:8]}.txt"
s, body = http("POST", "/api/upload-file",
               body={"filename": fn, "file_data": "data:text/plain;base64," + b64},
               headers=auth)
d = json.loads(body)
check("upload-file (signed) -> success + size",
      s == 200 and d.get("success") and d.get("size") == 11,
      f"got {s} {body[:160]}")
s, body = http("POST", "/api/move-file",
               body={"src": fn, "dest_dir": "p2d_test/sub"}, headers=auth)
d = json.loads(body)
check("move-file (signed) -> success + new path",
      s == 200 and d.get("success") and d.get("moved") and d.get("to","").startswith("p2d_test/sub/"),
      f"got {body[:160]}")
new_fn = d.get("to")
s, body = http("POST", "/api/delete-file", body={"filename": new_fn}, headers=auth)
check("delete-file (signed) -> success deleted_count=1",
      s == 200 and json.loads(body).get("success") and json.loads(body).get("deleted_count") == 1)

# --- /api/init-directories / directory-scaffold ---
s, body = http("POST", "/api/init-directories")
check("init-directories -> no-op success", s == 200 and json.loads(body).get("success"))
s, body = http("GET", "/api/directory-scaffold")
d = json.loads(body)
check("directory-scaffold -> 7 entries all exists=true",
      s == 200 and len(d.get("scaffold", [])) == 7 and all(e["exists"] for e in d["scaffold"]))

# --- /api/save-map-config alias ---
s, body = http("POST", "/api/save-map-config",
               body={"map_config": {"floors": [{"id": "f1", "markers": []}]}},
               headers=auth)
d = json.loads(body)
check("save-map-config (alias) -> success + floors=1",
      s == 200 and d.get("success") and d.get("floors") == 1)

# --- /api/zip-dir (signed) ---
s, body = http("POST", "/api/zip-dir", body={"dirname": "p2d_test"}, headers=auth)
check("zip-dir (signed) -> 200 application/zip", s == 200 and body[:2] == b"PK")
s, _ = http("POST", "/api/zip-dir", body={"dirname": "x"})
check("zip-dir (anon) -> 403", s == 403)

# --- Cleanup ---
db["user_sessions"].delete_many({"user_id": user_id})
db["users"].delete_one({"user_id": user_id})
db["tenants"].delete_many({"owner_user_id": user_id})
db["tenant_assets"].delete_many({"filename": {"$regex": "^p2d_test/"}})
db["tenant_map_config"].delete_many({})
db["virtual_write_log"].delete_many({})

total = passes + len(failures)
print(f"V2.0 Phase 2d (legacy port): {passes}/{total} pass.")
if failures:
    print("FAILURES:")
    for f in failures:
        print("  - " + f)
    sys.exit(1)
sys.exit(0)
