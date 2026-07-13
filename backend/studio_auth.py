"""studio_auth.py — V1.9 Stage B access control for the V2.0 Linux server.

Ports the controller's auth_service.py behaviour to FastAPI:
  - Roles: viewer (anonymous), editor (registered user), admin (master key)
  - Cookie: red5_auth (HMAC-signed, HttpOnly)
  - State: users.json + auth_settings.json + auth_secret under a hidden dir
  - Enforcement middleware on config-change API paths (report-only by default)

Coexists with the Phase 2 Google OAuth stack (session_token cookie).
"""
from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import threading
import time
from datetime import datetime, timezone
from typing import Any, Optional

from fastapi import APIRouter, Cookie, HTTPException, Request, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from models.fs import DATA_ROOT

# ---------------------------------------------------------------------------
# Constants (kept in lock-step with archive/Red5-Studio-V1.9/auth_service.py)
# ---------------------------------------------------------------------------
COOKIE_NAME = "red5_auth"
TOKEN_TTL = 24 * 60 * 60
PBKDF2_ITERS = 100_000
MAX_USERS = 10
ADMIN_NAME = "admin"

EDITOR_PREFIXES = (
    "/api/upload-file",
    "/api/delete-file",
    "/api/create-directory",
    "/api/delete-directory",
    "/api/move-file",
    "/api/init-directories",
    "/api/save-config",
    "/api/save-equipment-schema",
    "/api/save-map-config",
    "/api/save-image",
    "/api/save-floor-plan",
)

ADMIN_PREFIXES = (
    "/api/auth/users",
    "/api/auth/enforce",
    "/api/repair/",
    "/api/upload-bundle",
    "/api/zip-files",
    "/api/zip-dir",
)

OPEN_AUTH_PREFIXES = (
    "/api/auth/login",
    "/api/auth/logout",
    "/api/auth/whoami",
)

_MUTATING = {"POST", "PUT", "PATCH", "DELETE"}

_LOCK = threading.Lock()
_STATE_DIR: Optional[str] = None
_MASTER_KEY = ""
_SECRET = b""
_initialized = False

router = APIRouter(tags=["studio-auth"])


# ---------------------------------------------------------------------------
# Storage helpers
# ---------------------------------------------------------------------------
def _pick_state_dir(data_root: str) -> str:
    override = os.environ.get("STUDIO_AUTH_STATE_DIR", "").strip()
    if override:
        os.makedirs(override, mode=0o700, exist_ok=True)
        return override
    for cand in ("/root/.red5", os.path.join(data_root or "/root/data", ".red5")):
        try:
            os.makedirs(cand, mode=0o700, exist_ok=True)
            probe = os.path.join(cand, ".probe")
            with open(probe, "w", encoding="utf-8") as f:
                f.write("x")
            os.unlink(probe)
            return cand
        except OSError:
            continue
    fallback = os.path.join(data_root or "/root/data", ".red5")
    os.makedirs(fallback, mode=0o700, exist_ok=True)
    return fallback


def _users_path() -> str:
    return os.path.join(_STATE_DIR or "", "users.json")


def _settings_path() -> str:
    return os.path.join(_STATE_DIR or "", "auth_settings.json")


def _secret_path() -> str:
    return os.path.join(_STATE_DIR or "", "auth_secret")


def _now() -> int:
    return int(time.time())


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _load_or_create_secret() -> bytes:
    p = _secret_path()
    try:
        with open(p, "rb") as f:
            data = f.read().strip()
            if len(data) >= 16:
                return data
    except OSError:
        pass
    secret = base64.urlsafe_b64encode(os.urandom(32))
    try:
        with open(p, "wb") as f:
            f.write(secret)
        os.chmod(p, 0o600)
    except OSError:
        pass
    return secret


def _load_users() -> dict:
    try:
        with open(_users_path(), "r", encoding="utf-8") as f:
            data = json.load(f)
        if isinstance(data, dict) and isinstance(data.get("users"), dict):
            return data
    except (OSError, json.JSONDecodeError):
        pass
    return {"users": {}}


def _save_users(data: dict) -> None:
    tmp = _users_path() + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, separators=(",", ":"))
    os.replace(tmp, _users_path())
    try:
        os.chmod(_users_path(), 0o600)
    except OSError:
        pass


def _hash_password(password: str, salt: Optional[bytes] = None, iters: int = PBKDF2_ITERS):
    if salt is None:
        salt = os.urandom(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iters)
    return salt.hex(), dk.hex(), iters


def _verify_password(password: str, rec: dict) -> bool:
    try:
        salt = bytes.fromhex(rec.get("salt", ""))
        iters = int(rec.get("iter", PBKDF2_ITERS))
        expect = rec.get("hash", "")
        _, got, _ = _hash_password(password, salt, iters)
        return hmac.compare_digest(got, expect)
    except (ValueError, TypeError):
        return False


def _load_settings() -> dict:
    try:
        with open(_settings_path(), "r", encoding="utf-8") as f:
            data = json.load(f)
        if isinstance(data, dict):
            return {"enforce": bool(data.get("enforce", False))}
    except (OSError, json.JSONDecodeError):
        pass
    return {"enforce": False}


def _save_settings(settings: dict) -> None:
    tmp = _settings_path() + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump({"enforce": bool(settings.get("enforce", False))}, f)
    os.replace(tmp, _settings_path())


def _sign(msg_bytes: bytes) -> str:
    return hmac.new(_SECRET, msg_bytes, hashlib.sha256).hexdigest()


def _make_token(username: str, role: str, ttl: int = TOKEN_TTL) -> str:
    payload = {"u": username, "r": role, "exp": _now() + int(ttl)}
    raw = json.dumps(payload, separators=(",", ":")).encode("utf-8")
    b = base64.urlsafe_b64encode(raw).decode("ascii")
    return b + "." + _sign(b.encode("ascii"))


def _parse_token(token: str) -> Optional[dict]:
    try:
        b, sig = token.split(".", 1)
        if not hmac.compare_digest(sig, _sign(b.encode("ascii"))):
            return None
        payload = json.loads(base64.urlsafe_b64decode(b.encode("ascii")))
        if int(payload.get("exp", 0)) < _now():
            return None
        return {"u": payload.get("u", ""), "r": payload.get("r", "viewer")}
    except (ValueError, json.JSONDecodeError):
        return None


def _cookie_secure() -> bool:
    return os.environ.get("COOKIE_SECURE", "true").lower() in ("1", "true", "yes")


def _set_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        max_age=TOKEN_TTL,
        path="/",
        httponly=True,
        samesite="lax",
        secure=_cookie_secure(),
    )


def clear_studio_cookie(response: Response) -> None:
    response.delete_cookie(COOKIE_NAME, path="/")


def identity_from_request(request: Request) -> dict:
    """Return {'u': username, 'r': role} for the current request."""
    tok = request.cookies.get(COOKIE_NAME, "")
    if tok:
        ident = _parse_token(tok)
        if ident:
            return ident
    return {"u": "", "r": "viewer"}


def _master_key() -> str:
    key = os.environ.get("RED5_MASTER_KEY", "").strip()
    if key:
        return key
    try:
        with open(os.path.join(DATA_ROOT, "master_key.txt"), encoding="utf-8") as f:
            return f.read().strip()
    except OSError:
        return ""


def init_studio_auth() -> None:
    global _STATE_DIR, _MASTER_KEY, _SECRET, _initialized
    if _initialized:
        return
    _STATE_DIR = _pick_state_dir(DATA_ROOT)
    _MASTER_KEY = _master_key()
    _SECRET = _load_or_create_secret()
    _initialized = True
    print("[studio_auth] ready (state=%s enforce=%s)" % (
        _STATE_DIR, _load_settings().get("enforce")))


async def _audit(action: str, resource: str, username: str, extra: Any = None) -> None:
    try:
        from audit_log import record_audit  # noqa: WPS433
        await record_audit(
            None, {"email": username or "<anon>"}, None,
            action=action, resource=resource,
            before=None, after=extra,
        )
    except Exception:  # noqa: BLE001
        pass


def _require_admin(ident: dict) -> None:
    if ident.get("r") != "admin":
        raise HTTPException(403, "Admin required")


# ---------------------------------------------------------------------------
# Request models
# ---------------------------------------------------------------------------
class LoginBody(BaseModel):
    username: str = ""
    password: str = ""


class ChangePasswordBody(BaseModel):
    old: str = ""
    new: str = ""


class AddUserBody(BaseModel):
    username: str = ""


class EnforceBody(BaseModel):
    enable: bool = False


# ---------------------------------------------------------------------------
# Routes (V1.9-compatible paths)
# ---------------------------------------------------------------------------
@router.post("/api/auth/login")
async def studio_login(body: LoginBody, response: Response):
    init_studio_auth()
    username = (body.username or "").strip()
    password = body.password or ""
    if not username or not password:
        return JSONResponse(
            status_code=400,
            content={"ok": False, "error": "username and password required"},
        )

    if username == ADMIN_NAME:
        if _MASTER_KEY and hmac.compare_digest(password, _MASTER_KEY):
            _set_cookie(response, _make_token(ADMIN_NAME, "admin"))
            await _audit("login", "admin", ADMIN_NAME)
            return {"ok": True, "role": "admin", "username": ADMIN_NAME}
        return JSONResponse(
            status_code=401,
            content={"ok": False, "error": "invalid credentials"},
        )

    with _LOCK:
        data = _load_users()
        rec = data["users"].get(username)
        if rec is None:
            return JSONResponse(
                status_code=401,
                content={"ok": False, "error": "invalid credentials"},
            )

        first_time = not rec.get("pw_set")
        if first_time:
            salt, hsh, iters = _hash_password(password)
            rec.update({
                "salt": salt, "hash": hsh, "iter": iters,
                "pw_set": True, "pw_set_at": _now_iso(),
            })
            data["users"][username] = rec
            _save_users(data)
            await _audit("password_set", "user:" + username, username)
        elif not _verify_password(password, rec):
            return JSONResponse(
                status_code=401,
                content={"ok": False, "error": "invalid credentials"},
            )

    _set_cookie(response, _make_token(username, "editor"))
    await _audit("login", "user:" + username, username)
    return {
        "ok": True,
        "role": "editor",
        "username": username,
        "password_was_set": first_time,
    }


@router.get("/api/auth/whoami")
async def studio_whoami(request: Request):
    init_studio_auth()
    ident = identity_from_request(request)
    return {"role": ident["r"], "username": ident["u"]}


@router.post("/api/auth/change-password")
async def studio_change_password(body: ChangePasswordBody, request: Request):
    init_studio_auth()
    ident = identity_from_request(request)
    if ident["r"] not in ("editor", "admin"):
        raise HTTPException(401, "login required")
    if ident["r"] == "admin":
        raise HTTPException(400, "admin password is the master key")
    if len(body.new or "") < 6:
        raise HTTPException(400, "new password too short (min 6)")

    with _LOCK:
        data = _load_users()
        rec = data["users"].get(ident["u"])
        if not rec or not _verify_password(body.old or "", rec):
            raise HTTPException(401, "old password incorrect")
        salt, hsh, iters = _hash_password(body.new)
        rec.update({
            "salt": salt, "hash": hsh, "iter": iters,
            "pw_set": True, "pw_set_at": _now_iso(),
        })
        data["users"][ident["u"]] = rec
        _save_users(data)

    await _audit("password_change", "user:" + ident["u"], ident["u"])
    return {"ok": True}


@router.get("/api/auth/users")
async def studio_list_users(request: Request):
    init_studio_auth()
    _require_admin(identity_from_request(request))
    with _LOCK:
        data = _load_users()
    out = []
    for name, rec in sorted(data["users"].items()):
        out.append({
            "username": name,
            "password_set": bool(rec.get("pw_set")),
            "created": rec.get("created", ""),
            "pw_set_at": rec.get("pw_set_at", ""),
        })
    return {"users": out, "count": len(out), "max": MAX_USERS}


@router.post("/api/auth/users")
async def studio_add_user(body: AddUserBody, request: Request):
    init_studio_auth()
    _require_admin(identity_from_request(request))
    username = (body.username or "").strip()
    if not username or username == ADMIN_NAME:
        raise HTTPException(400, "invalid username")
    if not all(c.isalnum() or c in ("_", "-", ".", "@") for c in username):
        raise HTTPException(400, "username has invalid characters")

    with _LOCK:
        data = _load_users()
        if username in data["users"]:
            raise HTTPException(409, "user already exists")
        if len(data["users"]) >= MAX_USERS:
            raise HTTPException(409, f"max {MAX_USERS} users")
        data["users"][username] = {"pw_set": False, "created": _now_iso()}
        _save_users(data)

    await _audit("user_add", "user:" + username, ADMIN_NAME)
    return {"ok": True, "username": username}


@router.delete("/api/auth/users/{username}")
async def studio_delete_user(username: str, request: Request):
    init_studio_auth()
    _require_admin(identity_from_request(request))
    username = (username or "").strip()
    with _LOCK:
        data = _load_users()
        if username not in data["users"]:
            raise HTTPException(404, "no such user")
        del data["users"][username]
        _save_users(data)
    await _audit("user_delete", "user:" + username, ADMIN_NAME)
    return {"ok": True}


@router.post("/api/auth/users/{username}/reset")
async def studio_reset_user(username: str, request: Request):
    init_studio_auth()
    _require_admin(identity_from_request(request))
    username = (username or "").strip()
    with _LOCK:
        data = _load_users()
        rec = data["users"].get(username)
        if rec is None:
            raise HTTPException(404, "no such user")
        rec.pop("salt", None)
        rec.pop("hash", None)
        rec.pop("iter", None)
        rec["pw_set"] = False
        data["users"][username] = rec
        _save_users(data)
    await _audit("user_reset", "user:" + username, ADMIN_NAME)
    return {"ok": True}


@router.get("/api/auth/enforce")
async def studio_get_enforce(request: Request):
    init_studio_auth()
    _require_admin(identity_from_request(request))
    return _load_settings()


@router.post("/api/auth/enforce")
async def studio_set_enforce(body: EnforceBody, request: Request):
    init_studio_auth()
    _require_admin(identity_from_request(request))
    _save_settings({"enforce": bool(body.enable)})
    await _audit("enforce_set", "auth", ADMIN_NAME, extra={"enforce": bool(body.enable)})
    return {"ok": True, "enforce": bool(body.enable)}


# ---------------------------------------------------------------------------
# Enforcement middleware
# ---------------------------------------------------------------------------
def _required_role_for(path: str) -> Optional[str]:
    for p in ADMIN_PREFIXES:
        if path.startswith(p):
            return "admin"
    for p in EDITOR_PREFIXES:
        if path.startswith(p):
            return "editor"
    return None


def _is_scripts_root_request(request: Request) -> bool:
    if request.url.path == "/api/files" and request.query_params.get("root") == "scripts":
        return True
    return False


async def studio_auth_middleware(request: Request, call_next):
    """Mirror auth_service._enforce() — fail-open on internal errors."""
    try:
        init_studio_auth()
        method = request.method.upper()
        path = request.url.path or ""

        if _is_scripts_root_request(request):
            return JSONResponse(
                {"success": False, "error": "This location is not available."},
                status_code=403,
            )

        for p in OPEN_AUTH_PREFIXES:
            if path.startswith(p):
                return await call_next(request)

        need = _required_role_for(path)
        if need is None:
            return await call_next(request)
        if method not in _MUTATING and need != "admin":
            return await call_next(request)

        ident = identity_from_request(request)
        role = ident["r"]
        allowed = (role == "admin") or (need == "editor" and role == "editor")

        if allowed:
            return await call_next(request)

        settings = _load_settings()
        if not settings.get("enforce"):
            await _audit("would_block", path, ident["u"] or "viewer",
                         extra={"method": method, "need": need})
            return await call_next(request)

        await _audit("blocked", path, ident["u"] or "viewer",
                     extra={"method": method, "need": need})
        return JSONResponse(
            {"success": False, "error": "Authentication required", "need": need},
            status_code=403,
        )
    except Exception:  # noqa: BLE001
        return await call_next(request)


def register_studio_auth(app) -> None:
    """Wire Stage B studio auth routes + enforcement middleware."""
    init_studio_auth()
    app.include_router(router)
    app.middleware("http")(studio_auth_middleware)
