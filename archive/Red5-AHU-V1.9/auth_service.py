"""
auth_service.py -- 10-user access control for the Red5 controller (Stage B).
============================================================================
Drop-in plug-in.  Place this file in /root/data/pgpy/ and app.py's service
loader auto-registers it via register(app, ctx).  NO app.py edits required.

ROLES
-----
  * Viewer  (no login)          : read (GET) + "operate" endpoints only.
  * Editor  (1 of up to 10 users): + config-change endpoints.
  * Admin   (master key)         : + user management + plugin/repair/bundle.

STORAGE (outside the web-served tree, so it is never listed/downloadable)
-------
  /root/.red5/users.json     -- usernames + PBKDF2 password hashes (no plaintext)
  /root/.red5/auth_secret    -- random secret used to sign session cookies
  /root/.red5/auth_settings.json -- {"enforce": bool}
  (Falls back to <DATA_ROOT>/.red5/ only if /root/.red5 is not writable.)

SESSIONS
--------
  On login a signed token (HMAC-SHA256 over username|role|expiry) is set as an
  HttpOnly cookie 'red5_auth', valid ~24h.  The signing secret never leaves the
  controller, so tokens cannot be forged.

ENFORCEMENT
-----------
  A single before_request hook checks each mutating request:
    * ADMIN paths  -> require Admin.
    * EDITOR paths -> require Editor or Admin.
    * everything else (reads + operate) -> allowed.
  Starts in REPORT-ONLY mode (logs would-block, blocks nothing).  An admin
  enables real blocking via POST /api/auth/enforce {"enable": true}; the choice
  is persisted.  This prevents locking anyone out during rollout.

  Enforcement is fail-open on internal errors (a bug here must never brick the
  controller's config access).

AUDIT
-----
  Allowed config/admin changes are recorded through audit_log_service.record()
  when that sibling plug-in is present (username + action + path).

ENDPOINTS
---------
  POST   /api/auth/login              {username, password} -> set cookie
  POST   /api/auth/logout             clear cookie
  GET    /api/auth/whoami             -> {role, username}
  POST   /api/auth/change-password    {old, new}           (editor: own pw)
  GET    /api/auth/users              (admin) -> list usernames+status
  POST   /api/auth/users              (admin) {username}   add user (<=10)
  DELETE /api/auth/users/<username>   (admin) remove user
  POST   /api/auth/users/<username>/reset (admin) clear pw (forces re-set)
  GET    /api/auth/enforce            (admin) -> {enforce: bool}
  POST   /api/auth/enforce            (admin) {enable: bool}
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

from flask import jsonify, request, make_response

# --------------------------------------------------------------------------
# Configuration constants
# --------------------------------------------------------------------------
COOKIE_NAME    = 'red5_auth'
TOKEN_TTL      = 24 * 60 * 60      # 24 hours (decision: ~1 day)
PBKDF2_ITERS   = 100_000
MAX_USERS      = 10
ADMIN_NAME     = 'admin'           # reserved login; authenticates via master key

# Config-change endpoints -> require Editor (or Admin).  These are the paths a
# Viewer must NOT be able to hit.  "Operate" endpoints (write-point, g36
# setpoints/tick, band overrides, data-mode, weather/forecast) are intentionally
# NOT listed, so view/operate still works without a login.
EDITOR_PREFIXES = (
    '/api/upload-file',
    '/api/delete-file',
    '/api/create-directory',
    '/api/delete-directory',
    '/api/move-file',
    '/api/init-directories',
    '/api/save-config',
    '/api/save-equipment-schema',
    '/api/save-map-config',
    '/api/save-image',
    '/api/save-floor-plan',
)

# Admin-only endpoints (master key).  Includes anything that can deploy code or
# manage users -- highest blast radius.
ADMIN_PREFIXES = (
    '/api/auth/users',
    '/api/auth/enforce',
    '/api/repair/',
    '/api/upload-bundle',
    '/api/zip-files',
    '/api/zip-dir',
)

# Auth endpoints that must always be reachable (no token required to reach them).
# /api/auth/master-key self-guards rotation (needs current key or admin), and
# must stay open so the first key can be bootstrapped on a fresh controller.
OPEN_AUTH_PREFIXES = (
    '/api/auth/login',
    '/api/auth/logout',
    '/api/auth/whoami',
    '/api/auth/master-key',
)

_MUTATING = {'POST', 'PUT', 'PATCH', 'DELETE'}

# --------------------------------------------------------------------------
# Module state (populated in register())
# --------------------------------------------------------------------------
_STATE_DIR   = None      # type: ignore   e.g. /root/.red5
_DATA_ROOT   = None      # type: ignore   e.g. /root/data (where master_key.txt lives)
_MASTER_KEY  = ''        # type: ignore   from SERVICE_CTX at registration
_MASTER_KEY_SOURCE = 'none'  # 'file' | 'env' | 'none'
_SECRET      = b''       # signing secret (bytes)
_LOCK        = threading.Lock()


# --------------------------------------------------------------------------
# Small helpers: paths, storage dir
# --------------------------------------------------------------------------
def _pick_state_dir(data_root):
    """Prefer /root/.red5 (outside the web-served tree).  Fall back to
    <data_root>/.red5 only if the first isn't creatable."""
    for cand in ('/root/.red5', os.path.join(data_root or '/root/data', '.red5')):
        try:
            os.makedirs(cand, exist_ok=True)
            # Confirm writable with a probe.
            probe = os.path.join(cand, '.probe')
            with open(probe, 'w') as f:
                f.write('x')
            os.unlink(probe)
            return cand
        except Exception:
            continue
    # Last resort: data_root itself (still server-side; hashes only).
    return data_root or '/root/data'


def _users_path():
    return os.path.join(_STATE_DIR, 'users.json')


def _settings_path():
    return os.path.join(_STATE_DIR, 'auth_settings.json')


def _secret_path():
    return os.path.join(_STATE_DIR, 'auth_secret')


def _now():
    return int(time.time())


def _now_iso():
    return datetime.now(timezone.utc).isoformat(timespec='seconds')


# --------------------------------------------------------------------------
# Signing secret
# --------------------------------------------------------------------------
def _load_or_create_secret():
    """Persistent random secret for HMAC-signing cookies."""
    p = _secret_path()
    try:
        with open(p, 'rb') as f:
            data = f.read().strip()
            if len(data) >= 16:
                return data
    except Exception:
        pass
    secret = base64.urlsafe_b64encode(os.urandom(32))
    try:
        with open(p, 'wb') as f:
            f.write(secret)
        try:
            os.chmod(p, 0o600)
        except Exception:
            pass
    except Exception:
        pass
    return secret


# --------------------------------------------------------------------------
# User store
# --------------------------------------------------------------------------
def _load_users():
    try:
        with open(_users_path(), 'r', encoding='utf-8') as f:
            data = json.load(f)
        if isinstance(data, dict) and isinstance(data.get('users'), dict):
            return data
    except Exception:
        pass
    return {'users': {}}


def _save_users(data):
    tmp = _users_path() + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(data, f, separators=(',', ':'))
    os.replace(tmp, _users_path())
    try:
        os.chmod(_users_path(), 0o600)
    except Exception:
        pass


def _hash_password(password, salt=None, iters=PBKDF2_ITERS):
    if salt is None:
        salt = os.urandom(16)
    dk = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, iters)
    return salt.hex(), dk.hex(), iters


def _verify_password(password, rec):
    try:
        salt = bytes.fromhex(rec.get('salt', ''))
        iters = int(rec.get('iter', PBKDF2_ITERS))
        expect = rec.get('hash', '')
        _, got, _ = _hash_password(password, salt, iters)
        return hmac.compare_digest(got, expect)
    except Exception:
        return False


# --------------------------------------------------------------------------
# Settings (enforce flag)
# --------------------------------------------------------------------------
def _load_settings():
    try:
        with open(_settings_path(), 'r', encoding='utf-8') as f:
            data = json.load(f)
        if isinstance(data, dict):
            return {'enforce': bool(data.get('enforce', False))}
    except Exception:
        pass
    return {'enforce': False}   # default: report-only


def _save_settings(settings):
    tmp = _settings_path() + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump({'enforce': bool(settings.get('enforce', False))}, f)
    os.replace(tmp, _settings_path())


# --------------------------------------------------------------------------
# Tokens (signed cookie)
# --------------------------------------------------------------------------
def _sign(msg_bytes):
    return hmac.new(_SECRET, msg_bytes, hashlib.sha256).hexdigest()


def _make_token(username, role, ttl=TOKEN_TTL):
    payload = {'u': username, 'r': role, 'exp': _now() + int(ttl)}
    raw = json.dumps(payload, separators=(',', ':')).encode('utf-8')
    b = base64.urlsafe_b64encode(raw).decode('ascii')
    return b + '.' + _sign(b.encode('ascii'))


def _parse_token(token):
    """Return {'u':..., 'r':...} if the token is valid and unexpired, else None."""
    try:
        b, sig = token.split('.', 1)
        if not hmac.compare_digest(sig, _sign(b.encode('ascii'))):
            return None
        payload = json.loads(base64.urlsafe_b64decode(b.encode('ascii')))
        if int(payload.get('exp', 0)) < _now():
            return None
        return {'u': payload.get('u', ''), 'r': payload.get('r', 'viewer')}
    except Exception:
        return None


def _identity():
    """Current request identity from the cookie: dict with 'u' and 'r'.
    Defaults to viewer."""
    tok = request.cookies.get(COOKIE_NAME, '')
    if tok:
        ident = _parse_token(tok)
        if ident:
            return ident
    return {'u': '', 'r': 'viewer'}


# --------------------------------------------------------------------------
# Audit
# --------------------------------------------------------------------------
def _audit(action, resource, username, extra=None):
    try:
        import audit_log_service  # sibling plug-in
        audit_log_service.record(action=action, resource=resource,
                                 user_email=username or '<anon>',
                                 extra=extra)
    except Exception:
        pass


# --------------------------------------------------------------------------
# Endpoints
# --------------------------------------------------------------------------
def login():
    """POST /api/auth/login {username, password}.
    - admin: password must equal the master key.
    - existing user with no password yet: first login SETS the password.
    - existing user: password verified.
    """
    body = request.get_json(silent=True) or {}
    username = (body.get('username') or '').strip()
    password = body.get('password') or ''
    if not username or not password:
        return jsonify({'ok': False, 'error': 'username and password required'}), 400

    # Admin path -- authenticate against the master key.
    if username == ADMIN_NAME:
        if _MASTER_KEY and hmac.compare_digest(password, _MASTER_KEY):
            resp = make_response(jsonify({'ok': True, 'role': 'admin',
                                          'username': ADMIN_NAME}))
            _set_cookie(resp, _make_token(ADMIN_NAME, 'admin'))
            _audit('login', 'admin', ADMIN_NAME)
            return resp
        return jsonify({'ok': False, 'error': 'invalid credentials'}), 401

    with _LOCK:
        data = _load_users()
        rec = data['users'].get(username)
        if rec is None:
            # Unknown user.  Admin must create the username first.
            return jsonify({'ok': False, 'error': 'invalid credentials'}), 401

        first_time = not rec.get('pw_set')
        if first_time:
            # Self-service: first login sets this user's password.
            salt, h, iters = _hash_password(password)
            rec.update({'salt': salt, 'hash': h, 'iter': iters,
                        'pw_set': True, 'pw_set_at': _now_iso()})
            data['users'][username] = rec
            _save_users(data)
            _audit('password_set', 'user:' + username, username)
        else:
            if not _verify_password(password, rec):
                return jsonify({'ok': False, 'error': 'invalid credentials'}), 401

    resp = make_response(jsonify({'ok': True, 'role': 'editor',
                                  'username': username,
                                  'password_was_set': first_time}))
    _set_cookie(resp, _make_token(username, 'editor'))
    _audit('login', 'user:' + username, username)
    return resp


def logout():
    resp = make_response(jsonify({'ok': True}))
    # Expire BOTH variants so sign-out works regardless of which was set:
    # the Secure; Partitioned one (HTTPS/iframe) and the legacy Lax one. A
    # Partitioned cookie lives in separate per-top-site storage, so a Lax-only
    # delete won't match it and the session would stick ("can't sign out").
    resp.set_cookie(COOKIE_NAME, '', max_age=0, path='/',
                    httponly=True, samesite='None', secure=True)
    _partition_cookie(resp, COOKIE_NAME)
    resp.set_cookie(COOKIE_NAME, '', max_age=0, path='/',
                    httponly=True, samesite='Lax')
    return resp


def whoami():
    ident = _identity()
    return jsonify({'role': ident['r'], 'username': ident['u'],
                    'master_key_configured': bool(_MASTER_KEY)})


def _master_key_path():
    """Canonical location app.py + auth_service both read from."""
    root = _DATA_ROOT or '/root/data'
    return os.path.join(root, 'master_key.txt')


def master_key_status():
    """Report ONLY whether a master key exists -- never the value.
    Powers the upload-only Master Key card on /update."""
    return jsonify({
        'configured': bool(_MASTER_KEY),
        'source': _MASTER_KEY_SOURCE,
        'length': len(_MASTER_KEY) if _MASTER_KEY else 0,
    })


def set_master_key():
    """Upload / rotate the controller master key (upload-only; never viewable).

    Rules:
      * Bootstrap (no key yet): anyone on the LAN may set the first key.
      * Rotate (key already set): the caller MUST prove they hold the current
        key -- signed in as admin (cookie) OR sending it in ``current_key`` --
        otherwise 403.

    Accepts multipart (``file`` = master_key.txt) OR JSON/form
    ``{new_key, current_key}``.  Writes 0600 and updates the in-memory key so
    admin login works immediately (bundle-decryption paths still read
    MASTER_KEY_CONST captured at boot, so a restart is recommended for those)."""
    global _MASTER_KEY, _MASTER_KEY_SOURCE

    new_key = ''
    current_key = ''
    f = request.files.get('file') if request.files else None
    if f is not None:
        try:
            new_key = f.read().decode('utf-8', 'replace')
        except Exception:
            new_key = ''
        current_key = (request.form.get('current_key') or '').strip()
    else:
        body = request.get_json(silent=True) or {}
        new_key = body.get('new_key') or body.get('key') or ''
        current_key = (body.get('current_key') or '').strip()
    new_key = (new_key or '').strip()

    if len(new_key) < 8:
        return jsonify({'ok': False,
                        'error': 'master key too short (min 8 characters)'}), 400

    if _MASTER_KEY:
        ident = _identity()
        is_admin = ident['r'] == 'admin'
        proved = is_admin or (current_key
                              and hmac.compare_digest(current_key, _MASTER_KEY))
        if not proved:
            return jsonify({'ok': False,
                            'error': 'current master key or admin session required to rotate'}), 403

    path = _master_key_path()
    try:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        tmp = path + '.tmp'
        with open(tmp, 'w', encoding='utf-8') as fh:
            fh.write(new_key)
        os.replace(tmp, path)
        try:
            os.chmod(path, 0o600)
        except Exception:
            pass
    except Exception as exc:
        return jsonify({'ok': False, 'error': 'could not write key: ' + str(exc)}), 500

    was_configured = bool(_MASTER_KEY)
    _MASTER_KEY = new_key
    _MASTER_KEY_SOURCE = 'file'
    _audit('master_key_set', 'master_key.txt',
           _identity()['u'] or 'bootstrap',
           extra={'rotated': was_configured})
    return jsonify({
        'ok': True,
        'configured': True,
        'rotated': was_configured,
        'note': ('Admin login works now. Restart app.py so bundle '
                 'decryption also uses the new key.'),
    })


def change_password():
    """POST /api/auth/change-password {old, new} -- editor changes own password."""
    ident = _identity()
    if ident['r'] not in ('editor', 'admin'):
        return jsonify({'ok': False, 'error': 'login required'}), 401
    if ident['r'] == 'admin':
        return jsonify({'ok': False, 'error': 'admin password is the master key'}), 400
    body = request.get_json(silent=True) or {}
    old = body.get('old') or ''
    new = body.get('new') or ''
    if len(new) < 6:
        return jsonify({'ok': False, 'error': 'new password too short (min 6)'}), 400
    with _LOCK:
        data = _load_users()
        rec = data['users'].get(ident['u'])
        if not rec or not _verify_password(old, rec):
            return jsonify({'ok': False, 'error': 'old password incorrect'}), 401
        salt, h, iters = _hash_password(new)
        rec.update({'salt': salt, 'hash': h, 'iter': iters, 'pw_set': True,
                    'pw_set_at': _now_iso()})
        data['users'][ident['u']] = rec
        _save_users(data)
    _audit('password_change', 'user:' + ident['u'], ident['u'])
    return jsonify({'ok': True})


def list_users():
    """GET /api/auth/users (admin) -- usernames + status, never hashes."""
    with _LOCK:
        data = _load_users()
    out = []
    for name, rec in sorted(data['users'].items()):
        out.append({'username': name,
                    'password_set': bool(rec.get('pw_set')),
                    'created': rec.get('created', ''),
                    'pw_set_at': rec.get('pw_set_at', '')})
    return jsonify({'users': out, 'count': len(out), 'max': MAX_USERS})


def add_user():
    """POST /api/auth/users (admin) {username} -- create a username (<=10)."""
    body = request.get_json(silent=True) or {}
    username = (body.get('username') or '').strip()
    if not username or username == ADMIN_NAME:
        return jsonify({'ok': False, 'error': 'invalid username'}), 400
    if not all(c.isalnum() or c in ('_', '-', '.', '@') for c in username):
        return jsonify({'ok': False, 'error': 'username has invalid characters'}), 400
    with _LOCK:
        data = _load_users()
        if username in data['users']:
            return jsonify({'ok': False, 'error': 'user already exists'}), 409
        if len(data['users']) >= MAX_USERS:
            return jsonify({'ok': False, 'error': f'max {MAX_USERS} users'}), 409
        data['users'][username] = {'pw_set': False, 'created': _now_iso()}
        _save_users(data)
    _audit('user_add', 'user:' + username, ADMIN_NAME)
    return jsonify({'ok': True, 'username': username})


def delete_user(username):
    """DELETE /api/auth/users/<username> (admin)."""
    username = (username or '').strip()
    with _LOCK:
        data = _load_users()
        if username not in data['users']:
            return jsonify({'ok': False, 'error': 'no such user'}), 404
        del data['users'][username]
        _save_users(data)
    _audit('user_delete', 'user:' + username, ADMIN_NAME)
    return jsonify({'ok': True})


def reset_user(username):
    """POST /api/auth/users/<username>/reset (admin) -- clear password so the
    user sets a new one on next login."""
    username = (username or '').strip()
    with _LOCK:
        data = _load_users()
        rec = data['users'].get(username)
        if rec is None:
            return jsonify({'ok': False, 'error': 'no such user'}), 404
        rec.pop('salt', None)
        rec.pop('hash', None)
        rec.pop('iter', None)
        rec['pw_set'] = False
        data['users'][username] = rec
        _save_users(data)
    _audit('user_reset', 'user:' + username, ADMIN_NAME)
    return jsonify({'ok': True})


def get_enforce():
    return jsonify(_load_settings())


def set_enforce():
    """POST /api/auth/enforce {enable: bool} (admin)."""
    body = request.get_json(silent=True) or {}
    enable = bool(body.get('enable'))
    _save_settings({'enforce': enable})
    _audit('enforce_set', 'auth', ADMIN_NAME, extra={'enforce': enable})
    return jsonify({'ok': True, 'enforce': enable})


# --------------------------------------------------------------------------
# Cookie helper
# --------------------------------------------------------------------------
def _req_is_https():
    """True when the request reached us over HTTPS -- directly or via a
    TLS-terminating proxy/tunnel (Cloudflare sets X-Forwarded-Proto=https).
    Controls whether we may issue a cross-site-capable cookie."""
    xfp = request.headers.get('X-Forwarded-Proto', '')
    if xfp:
        return xfp.split(',')[0].strip().lower() == 'https'
    try:
        return bool(request.is_secure)
    except Exception:
        return False


def _partition_cookie(resp, name):
    """Append the CHIPS `Partitioned` attribute to `name`'s Set-Cookie header
    so the session cookie is accepted (and cleared) inside a cross-site iframe
    (enteliWeb / command-center). Only added when the cookie is `Secure`
    (Partitioned without Secure is invalid)."""
    cookies = resp.headers.getlist('Set-Cookie')
    if not cookies:
        return
    del resp.headers['Set-Cookie']
    prefix = name + '='
    for c in cookies:
        lc = c.lower()
        if c.startswith(prefix) and 'secure' in lc and 'partitioned' not in lc:
            c = c + '; Partitioned'
        resp.headers.add('Set-Cookie', c)


def _set_cookie(resp, token):
    # Over HTTPS (the c*.geniusmason.com proxy / enteliWeb iframe) issue a
    # cross-site-capable cookie: SameSite=None; Secure; Partitioned. Over plain
    # HTTP on the LAN (http://192.168.x.x) fall back to SameSite=Lax, since a
    # Secure cookie would not be stored and would break direct login there.
    if _req_is_https():
        resp.set_cookie(COOKIE_NAME, token, max_age=TOKEN_TTL, path='/',
                        httponly=True, samesite='None', secure=True)
        _partition_cookie(resp, COOKIE_NAME)
    else:
        resp.set_cookie(COOKIE_NAME, token, max_age=TOKEN_TTL, path='/',
                        httponly=True, samesite='Lax')


# --------------------------------------------------------------------------
# Enforcement (before_request)
# --------------------------------------------------------------------------
def _required_role_for(path):
    """Return 'admin', 'editor', or None (unprotected) for a path."""
    for p in ADMIN_PREFIXES:
        if path.startswith(p):
            return 'admin'
    for p in EDITOR_PREFIXES:
        if path.startswith(p):
            return 'editor'
    return None


def _is_scripts_root_request():
    """True when the web UI is trying to reach /root/scripts via the file API."""
    if request.path == '/api/files' and request.args.get('root') == 'scripts':
        return True
    if request.method in _MUTATING:
        body = request.get_json(silent=True) or {}
        if body.get('root') == 'scripts':
            return True
    return False


def _enforce():
    """Flask before_request hook.  Returns a Response to short-circuit (block),
    or None to allow.  Fail-open on any internal error."""
    try:
        method = request.method.upper()
        path = request.path or ''

        # Hide /root/scripts from the asset browser (always, all roles).
        if _is_scripts_root_request():
            return jsonify({'success': False,
                            'error': 'This location is not available.'}), 403

        # Never gate the auth endpoints needed to log in / check identity.
        for p in OPEN_AUTH_PREFIXES:
            if path.startswith(p):
                return None

        # Only mutating requests are gated (reads and "operate" GETs pass).
        # (Admin user-management GET is handled below explicitly.)
        need = _required_role_for(path)
        if need is None:
            return None
        if method not in _MUTATING and need != 'admin':
            # e.g. a GET to an editor-config path -> allow (read-only view).
            return None
        # For admin paths, gate all methods (incl. GET /api/auth/users list).

        ident = _identity()
        role = ident['r']
        allowed = (role == 'admin') or (need == 'editor' and role == 'editor')

        settings = _load_settings()
        if allowed:
            # Record the successful config/admin action for the audit trail.
            if method in _MUTATING:
                _audit('config_change', path, ident['u'] or role,
                       extra={'method': method})
            return None

        # Not allowed.
        if not settings.get('enforce'):
            # Report-only mode: log what WOULD be blocked, but allow it.
            _audit('would_block', path, ident['u'] or 'viewer',
                   extra={'method': method, 'need': need})
            return None

        # Enforce mode: block.
        _audit('blocked', path, ident['u'] or 'viewer',
               extra={'method': method, 'need': need})
        return jsonify({'success': False,
                        'error': 'Authentication required',
                        'need': need}), 403
    except Exception:
        # A bug in the gate must never brick the controller.
        return None


# --------------------------------------------------------------------------
# Registration -- called by app.py's plug-in loader.
# --------------------------------------------------------------------------
_service_dependencies = ['DATA_ROOT']


def register(app, ctx=None):
    global _STATE_DIR, _DATA_ROOT, _MASTER_KEY, _MASTER_KEY_SOURCE, _SECRET
    ctx = ctx or {}
    data_root = ctx.get('DATA_ROOT') or os.environ.get('RED5_DATA_ROOT') or '/root/data'
    _DATA_ROOT = data_root
    _MASTER_KEY = ctx.get('MASTER_KEY_CONST') or ''
    _MASTER_KEY_SOURCE = 'env' if _MASTER_KEY else 'none'
    # Fallback: if the master key wasn't passed in SERVICE_CTX (older app.py),
    # read it straight from the file so admin login still works.
    if not _MASTER_KEY:
        try:
            with open(os.path.join(data_root, 'master_key.txt')) as _mk:
                _MASTER_KEY = _mk.read().strip()
                if _MASTER_KEY:
                    _MASTER_KEY_SOURCE = 'file'
        except Exception:
            _MASTER_KEY = ''
    _STATE_DIR = _pick_state_dir(data_root)
    _SECRET = _load_or_create_secret()

    # Endpoints
    app.add_url_rule('/api/auth/login',           'auth_login',
                     login,           methods=['POST'])
    app.add_url_rule('/api/auth/logout',          'auth_logout',
                     logout,          methods=['POST'])
    app.add_url_rule('/api/auth/whoami',          'auth_whoami',
                     whoami,          methods=['GET'])
    app.add_url_rule('/api/auth/change-password', 'auth_change_password',
                     change_password, methods=['POST'])
    app.add_url_rule('/api/auth/users',           'auth_users_list',
                     list_users,      methods=['GET'])
    app.add_url_rule('/api/auth/users',           'auth_users_add',
                     add_user,        methods=['POST'])
    app.add_url_rule('/api/auth/users/<username>', 'auth_users_delete',
                     delete_user,     methods=['DELETE'])
    app.add_url_rule('/api/auth/users/<username>/reset', 'auth_users_reset',
                     reset_user,      methods=['POST'])
    app.add_url_rule('/api/auth/enforce',         'auth_enforce_get',
                     get_enforce,     methods=['GET'])
    app.add_url_rule('/api/auth/enforce',         'auth_enforce_set',
                     set_enforce,     methods=['POST'])
    # Master key: status (never returns the value) + upload/rotate.
    app.add_url_rule('/api/auth/master-key',      'auth_master_key_status',
                     master_key_status, methods=['GET'])
    app.add_url_rule('/api/auth/master-key',      'auth_master_key_set',
                     set_master_key,  methods=['POST'])

    # Enforcement hook (report-only until an admin enables it).
    #
    # Only register the before_request hook ONCE.  On a hot-reload,
    # importlib.reload() re-runs register() AFTER the app has served its
    # first request -- and Flask forbids before_request() at that point
    # ("setup method ... can no longer be called").  Because the app object
    # persists across reloads and importlib.reload() updates this module's
    # globals in place, the hook registered at boot already executes the
    # freshly reloaded _enforce code, so we simply skip re-adding it.
    _already_hooked = getattr(app, '_red5_auth_enforce_hooked', False) or any(
        getattr(fn, '__name__', '') == '_enforce'
        and getattr(fn, '__module__', '') == __name__
        for fn in (app.before_request_funcs.get(None) or [])
    )
    if not _already_hooked:
        try:
            app.before_request(_enforce)
            app._red5_auth_enforce_hooked = True
        except (AssertionError, RuntimeError):
            # App already handled its first request (hot-reload path): the
            # existing hook stays in effect with the reloaded code.
            pass

    print('[auth_service] registered OK (state dir: %s, enforce: %s)'
          % (_STATE_DIR, _load_settings().get('enforce')))
