#!/usr/bin/env python3
"""Smoke tests for V2.0 Stage B studio_auth (V1.9 parity).

Run:
    RED5_MASTER_KEY=testkey python3 backend/tests/test_v2_studio_auth.py
"""
from __future__ import annotations

import json
import os
import shutil
import sys
import tempfile

# Ensure backend/ is importable.
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

os.environ.setdefault("MONGO_URL", "mongodb://localhost:27017")
os.environ.setdefault("DB_NAME", "red5_test_studio_auth")
os.environ["RED5_MASTER_KEY"] = "test-master-key-99"
os.environ["COOKIE_SECURE"] = "false"

TMP = tempfile.mkdtemp(prefix="studio_auth_test_")
os.environ["STUDIO_AUTH_STATE_DIR"] = TMP

from fastapi.testclient import TestClient  # noqa: E402

import studio_auth  # noqa: E402
from server import app  # noqa: E402

studio_auth.init_studio_auth()
client = TestClient(app)

passes = 0
fails = 0


def check(name: str, ok: bool, info: str = "") -> None:
    global passes, fails
    if ok:
        passes += 1
        print("  OK  " + name)
    else:
        fails += 1
        print("  FAIL " + name + (" — " + info if info else ""))


# 1) Anonymous whoami -> viewer
r = client.get("/api/auth/whoami")
check("anonymous whoami -> viewer", r.status_code == 200 and r.json().get("role") == "viewer")

# 2) Admin login with master key
r = client.post("/api/auth/login", json={"username": "admin", "password": "test-master-key-99"})
check("admin login -> ok", r.status_code == 200 and r.json().get("ok") is True)
cookie = r.cookies.get("red5_auth")
check("admin login sets red5_auth cookie", bool(cookie))

# 3) whoami as admin
r = client.get("/api/auth/whoami", cookies={"red5_auth": cookie})
check("whoami admin", r.json().get("role") == "admin")

# 4) Add editor user
r = client.post("/api/auth/users", json={"username": "editor1"}, cookies={"red5_auth": cookie})
check("admin add user", r.status_code == 200 and r.json().get("ok") is True)

# 5) Editor first-login sets password
client.post("/api/auth/logout")
r = client.post("/api/auth/login", json={"username": "editor1", "password": "secret12"})
check("editor first login", r.status_code == 200 and r.json().get("password_was_set") is True)
ed_cookie = r.cookies.get("red5_auth")

# 6) Enforcement off — anonymous save-image allowed (report-only)
client.post("/api/auth/logout")
r = client.post("/api/save-image", json={"filename": "x.png", "file_data": "data:image/png;base64,AA==", "root": "data"})
check("enforce off: anonymous save-image not hard-blocked", r.status_code == 200)

# 7) Turn enforcement on (admin)
r = client.post("/api/auth/enforce", json={"enable": True}, cookies={"red5_auth": cookie})
check("admin enable enforce", r.status_code == 200 and r.json().get("enforce") is True)

# 8) Anonymous save blocked when enforcing
client.post("/api/auth/logout")
r = client.post("/api/save-image", json={"filename": "y.png", "file_data": "data:image/png;base64,AA==", "root": "data"})
check("enforce on: anonymous save-image blocked", r.status_code == 403)

# 9) Editor save allowed when enforcing
r = client.post("/api/save-image", json={"filename": "z.png", "file_data": "data:image/png;base64,AA==", "root": "data"},
                 cookies={"red5_auth": ed_cookie})
check("enforce on: editor save-image allowed", r.status_code == 200)

# 10) Logout clears studio cookie path
r = client.post("/api/auth/logout", cookies={"red5_auth": ed_cookie, "session_token": "bogus"})
check("logout ok", r.status_code == 200 and r.json().get("ok") is True)

shutil.rmtree(TMP, ignore_errors=True)
print("\nV2.0 studio_auth: %d pass, %d fail." % (passes, fails))
sys.exit(1 if fails else 0)
