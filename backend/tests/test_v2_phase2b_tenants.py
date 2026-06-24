"""Regression test for Phase 2 Piece B - tenant collections + isolation.

Verifies that a signed-in user gets THEIR own copy of the equipment_types
schema, band-clamp settings, and weather locations, while anonymous
visitors keep getting the canned demo data.

Uses MongoDB directly to seed two distinct test users, then exercises the
read + write endpoints with each user's session_token and confirms that
edits made under one identity do NOT leak into the other.

Run:
    python3 backend/tests/test_v2_phase2b_tenants.py
"""
from __future__ import annotations
import json
import os
import sys
import time
import urllib.error
import urllib.error as _ue_top
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


def _request(method, path, body=None, headers=None):
    h = {"Content-Type": "application/json"}
    if headers:
        h.update(headers)
    data = None
    if body is not None:
        data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(BASE + path, data=data, headers=h, method=method)
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return r.status, r.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8")


def get(path, token=None):
    h = {"Authorization": "Bearer " + token} if token else {}
    return _request("GET", path, headers=h)


def post(path, body, token=None):
    h = {"Authorization": "Bearer " + token} if token else {}
    return _request("POST", path, body=body, headers=h)


# Seed two distinct test users + sessions ----------------------------------
mc = MongoClient(MONGO_URL)
db = mc[DB_NAME]
now = datetime.now(timezone.utc)


def seed_user(slug):
    user_id = f"user_test_b_{slug}_" + uuid.uuid4().hex[:8]
    token = f"test_phase2b_{slug}_" + uuid.uuid4().hex[:12]
    db["users"].insert_one({
        "user_id": user_id,
        "email": f"{slug}@phase2b.test",
        "name": f"Phase 2b Tester {slug.upper()}",
        "picture": None,
        "created_at": now,
        "last_login_at": now,
    })
    db["user_sessions"].insert_one({
        "user_id": user_id,
        "session_token": token,
        "expires_at": now + timedelta(days=7),
        "created_at": now,
    })
    return user_id, token


user_a, token_a = seed_user("alpha")
user_b, token_b = seed_user("bravo")


# ====== 1. Anonymous reads return the canned demo data =====================
s, body = get("/api/equipment-types")
demo_eq = json.loads(body)
check("anonymous /api/equipment-types -> 200 + ahu_types",
      s == 200 and "ahu_types" in demo_eq)

s, body = get("/api/band-overrides/sa-rh-clamp")
check("anonymous /api/band-overrides/sa-rh-clamp -> 200 + clamp:null",
      s == 200 and json.loads(body)["sa_rh_clamp"] is None)

s, body = get("/api/weather-location")
demo_wl = json.loads(body)
check("anonymous /api/weather-location -> 200 + active:Seattle",
      s == 200 and demo_wl["active"]["name"].startswith("Seattle"))


# ====== 2. First signed-in read auto-creates the tenant + seeds it ========
s, body = get("/api/equipment-types", token_a)
tenant_a_eq = json.loads(body)
check("signed-in /api/equipment-types -> seeded with demo schema",
      s == 200 and "ahu_types" in tenant_a_eq
      and set(tenant_a_eq["ahu_types"].keys()) == set(demo_eq["ahu_types"].keys()))

# tenants collection should now have a row for user_a
tenant_a_doc = db["tenants"].find_one({"owner_user_id": user_a}, {"_id": 0})
check("first read auto-creates tenants row for the signed-in user",
      tenant_a_doc is not None and tenant_a_doc["tenant_id"].startswith("ten_"))


# ====== 3. Persisted writes show up on subsequent reads ===================
modified_eq = {
    "ahu_types": {"DEMO_TYPE": {"label": "Phase 2b Test Type", "icon": "test"}},
    "vav_types": {"DEMO_VAV":  {"label": "Phase 2b Test VAV"}},
}
s, body = post("/api/save-equipment-schema", modified_eq, token_a)
saved = json.loads(body)
check("POST /api/save-equipment-schema flat payload -> persisted:true",
      s == 200 and saved["persisted"] is True and "tenant_id" in saved)
check("POST /api/save-equipment-schema -> V1.9 response shape (success:true + file)",
      saved.get("success") is True
      and saved.get("file", "").startswith("virtual-controller://"))

# V1.9 equipment_mapper sends the schema WRAPPED:
#     { deployment_path: "/root", equipment_schema: {...} }
# The Phase 2b backend must unwrap to avoid storing the envelope.
wrapped = {
    "deployment_path": "/root",
    "equipment_schema": {
        "ahu_types": {"DEMO_TYPE": {"label": "Phase 2b Test Type", "icon": "test"},
                      "VAV_WRAP_TYPE": {"label": "Wrap unwrap proof"}},
        "vav_types": {"DEMO_VAV": {"label": "Phase 2b Test VAV"}},
    },
}
s, body = post("/api/save-equipment-schema", wrapped, token_a)
saved = json.loads(body)
check("POST /api/save-equipment-schema wrapped envelope -> persisted (V1.9 client shape)",
      s == 200 and saved["success"] is True and saved["persisted"] is True)

s, body = get("/api/equipment-types", token_a)
after = json.loads(body)
check("signed-in read after save -> sees the modified schema",
      s == 200 and "DEMO_TYPE" in after["ahu_types"]
      and "VAV_WRAP_TYPE" in after["ahu_types"]
      and after["ahu_types"]["DEMO_TYPE"]["label"] == "Phase 2b Test Type")
check("signed-in read after wrapped save -> envelope keys NOT leaked into schema",
      "deployment_path" not in after
      and "equipment_schema" not in after)

# Anonymous wrapped save should also unwrap gracefully and report warning.
s, body = post("/api/save-equipment-schema", wrapped)
anon_save = json.loads(body)
check("anonymous wrapped save -> persisted:false + warning (no crash)",
      s == 200 and anon_save["persisted"] is False and "warning" in anon_save)


# ====== 4. Tenant isolation: user A's edits do not leak into user B ======
s, body = get("/api/equipment-types", token_b)
tenant_b = json.loads(body)
check("user B's /api/equipment-types is NOT polluted by user A's edits",
      s == 200 and "DEMO_TYPE" not in tenant_b["ahu_types"])

# Sanity: anonymous reads still return the original canned configs
s, body = get("/api/equipment-types")
anon = json.loads(body)
check("anonymous read STILL gets canned demo data (no leak from tenant edits)",
      s == 200 and "DEMO_TYPE" not in anon["ahu_types"])


# ====== 5. Band-clamp per tenant ==========================================
clamp_payload = {"sa_rh_clamp": {"enabled": True, "lo": 42.0, "hi": 56.0}}
s, body = post("/api/band-overrides/sa-rh-clamp", clamp_payload, token_a)
res = json.loads(body)
check("POST /api/band-overrides/sa-rh-clamp (signed in) -> applied:true",
      s == 200 and res["applied"] is True and "tenant_id" in res)

s, body = get("/api/band-overrides/sa-rh-clamp", token_a)
back = json.loads(body)
check("GET /api/band-overrides/sa-rh-clamp (signed in) -> returns saved clamp",
      s == 200 and back["sa_rh_clamp"]
      and back["sa_rh_clamp"]["lo"] == 42.0
      and back["sa_rh_clamp"]["hi"] == 56.0)

s, body = get("/api/band-overrides/sa-rh-clamp", token_b)
back_b = json.loads(body)
check("user B's clamp is still null (isolated from A)",
      s == 200 and back_b["sa_rh_clamp"] is None)

s, body = get("/api/band-overrides/sa-rh-clamp")
check("anonymous clamp read still returns null (not polluted)",
      s == 200 and json.loads(body)["sa_rh_clamp"] is None)


# ====== 6. Weather location per tenant ====================================
loc_update = {
    "active": {"lat": -34.92, "lon": 138.60, "name": "Adelaide (test active)"}
}
s, body = post("/api/weather-location", loc_update, token_a)
check("POST /api/weather-location (signed in) -> persisted",
      s == 200 and json.loads(body)["persisted"] is True)

s, body = get("/api/weather-location", token_a)
wl_a = json.loads(body)
check("GET /api/weather-location (signed in) -> Adelaide",
      s == 200 and wl_a["active"]["name"].startswith("Adelaide"))

s, body = get("/api/weather-location", token_b)
wl_b = json.loads(body)
check("user B's active location still Seattle (isolated)",
      s == 200 and wl_b["active"]["name"].startswith("Seattle"))

# Anonymous post returns warning + does NOT persist
s, body = post("/api/weather-location", loc_update)
check("anonymous /api/weather-location POST -> persisted:false",
      s == 200 and json.loads(body)["persisted"] is False)


# ====== 7. Image upload + tenant-asset fetchback ==========================
# 1x1 transparent PNG (97 bytes).
TINY_PNG_B64 = ("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAAC"
                "nej3aAAAAAXRSTlMAQObYZgAAAAxJREFUCNdjYGBgAAAABAABJzQnCgAAAA"
                "BJRU5ErkJggg==")
upload_payload = {
    "deployment_path": "/root",
    "filename": "ahu_types/TEST_TYPE/base_graphic.png",
    "image_data": "data:image/png;base64," + TINY_PNG_B64,
}
s, body = post("/api/save-image", upload_payload, token_a)
upl = json.loads(body)
_save_fs_mode = upl.get("mode") == "filesystem"
check("POST /api/save-image (signed in) -> success:true + relative_path",
      s == 200 and upl["success"] is True
      and upl["relative_path"] == "ahu_types/TEST_TYPE/base_graphic.png"
      and upl["size_bytes"] > 0)

# Read it back via /api/assets/<path>: backend returns the bytes with
# the original content-type.  Use a raw urlopen so we can inspect headers.
req = urllib.request.Request(
    BASE + "/api/assets/ahu_types/TEST_TYPE/base_graphic.png",
    headers={"Authorization": "Bearer " + token_a},
)
try:
    with urllib.request.urlopen(req, timeout=10) as r:
        img_status = r.status
        img_bytes = r.read()
        img_ct = r.headers.get("Content-Type", "")
except _ue_top.HTTPError as e:
    img_status = e.code
    img_bytes = b""
    img_ct = ""
check("GET /api/assets/<uploaded image> -> 200 + image/png + correct bytes",
      img_status == 200 and img_ct.startswith("image/png")
      and img_bytes.startswith(b"\x89PNG"))

# User B cannot read user A's uploaded asset.  This isolation only holds
# in virtual-FS mode; in FS-mode the bytes are on disk and shared.
import urllib.error as _ue
if not _save_fs_mode:
    req = urllib.request.Request(
        BASE + "/api/assets/ahu_types/TEST_TYPE/base_graphic.png",
        headers={"Authorization": "Bearer " + token_b},
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            bbody = r.read()
            bs = r.status
    except _ue.HTTPError as e:
        bs = e.code
        bbody = b""
    check("user B cannot read user A's uploaded asset (404 isolated)",
          bs == 404)

# Anonymous /api/save-image returns success:false + warning in virtual-FS
# mode.  In FS mode the host filesystem is the single source of truth, so
# anonymous writes succeed (V1.9 parity -- the controller has no auth).
if not _save_fs_mode:
    s, body = post("/api/save-image", upload_payload)
    anon_upl = json.loads(body)
    check("anonymous /api/save-image -> success:false + sign-in warning",
          s == 200 and anon_upl["success"] is False
          and "warning" in anon_upl)
else:
    print("  [info] FS-mode active -- skipping anonymous-write rejection assertion.")

# Bad payload guard (no filename) -> success:false (no crash, no upload).
s, body = post("/api/save-image", {"image_data": "data:image/png;base64," + TINY_PNG_B64}, token_a)
check("POST /api/save-image without filename -> success:false (no crash)",
      s == 200 and json.loads(body)["success"] is False)

# /api/files browser listing (signed-in vs anonymous).
# When the pod has /root/data on disk (Linux deploy parity mode), /api/files
# returns FS contents -- the per-tenant isolation contract only applies when
# the server is in virtual-FS mode.  Detect mode from the first response.
s, body = get("/api/files", token_a)
files_a = json.loads(body)
_fs_mode = files_a.get("mode") == "filesystem"
check("GET /api/files (signed in) -> success + lists tenant assets",
      s == 200 and files_a["success"] is True
      and (_fs_mode  # FS mode: just confirm it returned a directory listing
           or any(f["name"] == "ahu_types" and f["type"] == "directory"
                  for f in files_a["files"])))

if not _fs_mode:
    s, body = get("/api/files?path=ahu_types/TEST_TYPE", token_a)
    files_inner = json.loads(body)
    check("GET /api/files?path=<dir> -> lists images inside the directory",
          s == 200 and any(f["name"] == "base_graphic.png" and f["type"] == "image"
                           for f in files_inner["files"]))

    s, body = get("/api/files", token_b)
    files_b = json.loads(body)
    check("user B's /api/files is empty (isolated from A's uploads)",
          s == 200 and files_b["files"] == [])

    s, body = get("/api/files")
    files_anon = json.loads(body)
    check("anonymous /api/files -> empty + sign-in warning",
          s == 200 and files_anon["files"] == [] and "warning" in files_anon)
else:
    print("  [info] FS-mode active (/root/data on disk) -- skipping virtual-FS isolation assertions.")


# ====== 8. Anonymous /api/auth/me still 401 (auth unchanged) ==============

s, _ = get("/api/auth/me")
check("anonymous /api/auth/me still 401 (Phase 2a contract preserved)",
      s == 401)


# Cleanup ------------------------------------------------------------------
for tok in (token_a, token_b):
    db["user_sessions"].delete_many({"session_token": tok})
for uid in (user_a, user_b):
    db["users"].delete_one({"user_id": uid})
    t = db["tenants"].find_one({"owner_user_id": uid}, {"_id": 0})
    if t:
        tid = t["tenant_id"]
        db["tenant_equipment_types"].delete_many({"tenant_id": tid})
        db["tenant_band_overrides"].delete_many({"tenant_id": tid})
        db["tenant_locations"].delete_many({"tenant_id": tid})
        db["tenant_assets"].delete_many({"tenant_id": tid})
        db["tenants"].delete_one({"tenant_id": tid})


# ---- Summary ----
total = passes + len(failures)
print("V2.0 Phase 2b (tenants): %d/%d pass." % (passes, total))
if failures:
    print("FAILURES:")
    for f in failures:
        print("  - " + f)
    sys.exit(1)
sys.exit(0)
