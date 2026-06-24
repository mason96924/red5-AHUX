"""Regression test for V1.9-on-Linux dual-mode file browser.

Hits the live uvicorn instance on localhost:8001 (FS mode is active here
because /root/data exists in the pod) and exercises every file-management
endpoint through a unique tmp sub-folder so it doesn't collide with other
test data.

Validates: /api/files, /api/save-image, /api/upload-file, /api/assets/
(binary-safe), /api/create-directory, /api/delete-directory,
/api/delete-file, /api/directory-scaffold, /api/init-directories.

Run:
    python3 backend/tests/test_fs_mode_file_browser.py
"""
from __future__ import annotations
import base64
import json
import os
import sys
import urllib.error
import urllib.request
import uuid

BASE = os.environ.get("V2_BASE_URL", "http://localhost:8001")

# 1x1 PNG.
TINY_PNG_B64 = ("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUA"
                "AACnej3aAAAAAXRSTlMAQObYZgAAAAxJREFUCNdjYGBgAAAABAAB"
                "JzQnCgAAAABJRU5ErkJggg==")
TINY_PNG = base64.b64decode(TINY_PNG_B64)

# Unique sub-directory under /root/data so we never collide with other
# pod state.  Tests clean up after themselves.
SCOPE = "test_fs_" + uuid.uuid4().hex[:8]

failures: list[str] = []
passes = 0


def check(name: str, ok: bool, info: str = "") -> None:
    global passes
    if ok:
        passes += 1
    else:
        failures.append(name + (" -- " + info if info else ""))


def _req(method: str, path: str, body=None, headers=None, raw: bool = False):
    h = {"Content-Type": "application/json"}
    if headers:
        h.update(headers)
    data = json.dumps(body).encode("utf-8") if body is not None else None
    req = urllib.request.Request(BASE + path, data=data, headers=h, method=method)
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return r.status, (r.read() if raw else r.read().decode("utf-8")), dict(r.headers)
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", errors="replace"), dict(e.headers or {})


# Bail early if FS mode isn't active on this pod (eg a SaaS-only deploy).
s, b, _ = _req("GET", "/api/files?root=data")
if json.loads(b).get("mode") != "filesystem":
    print("[skip] /root/data not present on this host -- FS-mode tests N/A.")
    sys.exit(0)


# ---- 1. INIT: create scoped sub-tree -----------------------------------
s, b, _ = _req("POST", "/api/create-directory",
               body={"dirname": SCOPE, "root": "data"})
check("create-directory creates a real folder under /root/data",
      s == 200 and json.loads(b).get("success") is True)
check("the folder exists on disk", os.path.isdir(f"/root/data/{SCOPE}"))


# ---- 2. SAVE-IMAGE writes bytes to disk --------------------------------
s, b, _ = _req("POST", "/api/save-image", body={
    "filename": f"{SCOPE}/AHU_TYPE_01.png",
    "image_data": "data:image/png;base64," + TINY_PNG_B64,
})
upl = json.loads(b)
check("save-image writes bytes via filesystem mode",
      s == 200 and upl.get("success") is True
      and upl.get("mode") == "filesystem")
on_disk = f"/root/data/{SCOPE}/AHU_TYPE_01.png"
check("save-image landed at the expected path", os.path.isfile(on_disk))
with open(on_disk, "rb") as fh:
    check("on-disk bytes start with PNG signature", fh.read().startswith(b"\x89PNG"))


# ---- 3. /api/assets/ serves it back binary-safe ------------------------
s, raw, hdrs = _req("GET", f"/api/assets/{SCOPE}/AHU_TYPE_01.png", raw=True)
ctype = (hdrs.get("content-type") or hdrs.get("Content-Type") or "").lower()
check("GET /api/assets/<png> returns 200 + image/png + exact bytes",
      s == 200 and ctype.startswith("image/png") and raw == TINY_PNG)


# ---- 4. /api/files lists the file in the scoped dir --------------------
s, b, _ = _req("GET", f"/api/files?path={SCOPE}&root=data")
lst = json.loads(b)
check("file browser lists newly-uploaded PNG inside the scoped dir",
      lst.get("success") is True
      and lst.get("mode") == "filesystem"
      and any(f["name"] == "AHU_TYPE_01.png" and f["type"] == "image"
              for f in lst.get("files", [])))


# ---- 5. /api/upload-file (generic data URL) ----------------------------
s, b, _ = _req("POST", "/api/upload-file", body={
    "filename": f"{SCOPE}/config.json",
    "file_data": "data:application/json;base64,"
                 + base64.b64encode(b'{"k":1}').decode(),
    "root": "data",
})
ufl = json.loads(b)
check("upload-file writes generic content to disk",
      s == 200 and ufl.get("success") is True
      and ufl.get("mode") == "filesystem"
      and os.path.isfile(f"/root/data/{SCOPE}/config.json"))


# ---- 6. /api/directory-scaffold reflects real FS state -----------------
s, b, _ = _req("GET", "/api/directory-scaffold")
sca = json.loads(b)
check("directory-scaffold runs in filesystem mode",
      sca.get("success") is True and sca.get("mode") == "filesystem")


# ---- 7. Path-traversal guards ------------------------------------------
s, b, _ = _req("GET", "/api/files?path=../etc&root=data")
check("path-traversal blocked on list", json.loads(b).get("success") is False)
s, b, _ = _req("POST", "/api/delete-file",
               body={"filename": "../etc/passwd", "root": "data"})
check("path-traversal blocked on delete", json.loads(b).get("success") is False)


# ---- 8. Cleanup: delete file + dir -------------------------------------
for f in ("AHU_TYPE_01.png", "config.json"):
    _req("POST", "/api/delete-file",
         body={"filename": f"{SCOPE}/{f}", "root": "data"})
s, b, _ = _req("POST", "/api/delete-directory",
               body={"dirname": SCOPE, "root": "data"})
check("delete-directory removes the scoped folder",
      json.loads(b).get("success") is True
      and not os.path.exists(f"/root/data/{SCOPE}"))


# ---- Summary -----------------------------------------------------------
total = passes + len(failures)
print(f"V2.0 FS-mode file browser: {passes}/{total} pass.")
if failures:
    print("FAILURES:")
    for f in failures:
        print("  - " + f)
    sys.exit(1)
sys.exit(0)
