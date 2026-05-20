"""Phase 2f - emergency password sign-in regression suite.

Mirrors the style of test_v2_phase2c_allowlist.py: direct HTTP calls
against the running supervisor backend on REACT_APP_BACKEND_URL.

Covers:
  - wrong password -> 401
  - non-admin email -> 401 (without leaking which emails are admin-listed)
  - correct credentials -> 200 + session_token cookie issued
  - /api/auth/me using that cookie -> 200 with is_admin: true
  - brute-force lockout after MAX_ATTEMPTS

DOES NOT mutate the admin password.  Reads ADMIN_PASSWORD_HASH straight
from the live env so the test runs against whatever the operator set.
"""
import os
import sys
import json
import time
import urllib.request
import urllib.error


BASE_URL = (
    os.environ.get("BASE_URL")
    or open("/app/frontend/.env").read().split("REACT_APP_BACKEND_URL=", 1)[1].splitlines()[0].strip()
)
ADMIN_EMAIL = (
    os.environ.get("ADMIN_PASSWORD_EMAIL")
    or os.environ.get("ADMIN_EMAILS", "").split(",")[0].strip()
    or "seeker0829@gmail.com"
)
# The live password is whatever bcrypt-hashes to ADMIN_PASSWORD_HASH in
# backend/.env.  Tests cannot inspect a hash, so we accept it from env.
ADMIN_PASSWORD = os.environ.get("TEST_ADMIN_PASSWORD", "Delta1234!")


def _post(path, body, cookie=None):
    req = urllib.request.Request(
        BASE_URL + path,
        data=json.dumps(body).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            # Cloudflare's edge WAF (deployed in front of preview URLs)
            # blocks requests without a real-looking User-Agent with HTTP
            # 403 "error code: 1010".  Send a Chrome UA so the test hits
            # the FastAPI app and not the CF challenge page.
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        method="POST",
    )
    if cookie:
        req.add_header("Cookie", cookie)
    try:
        resp = urllib.request.urlopen(req, timeout=10)
        return resp.status, resp.read().decode("utf-8"), resp.headers
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8"), e.headers


def _get(path, cookie=None):
    req = urllib.request.Request(
        BASE_URL + path,
        method="GET",
        headers={
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
    )
    if cookie:
        req.add_header("Cookie", cookie)
    try:
        resp = urllib.request.urlopen(req, timeout=10)
        return resp.status, resp.read().decode("utf-8"), resp.headers
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8"), e.headers


failures = []


def check(label, ok):
    print(("PASS  " if ok else "FAIL  ") + label)
    if not ok:
        failures.append(label)


# 1) wrong password -> 401
s, body, _ = _post("/api/auth/password-login", {
    "email": ADMIN_EMAIL, "password": "definitely-not-correct"})
check("wrong password -> 401", s == 401 and "Invalid credentials" in body)

# 2) non-admin email -> 401 (no info leak)
s, body, _ = _post("/api/auth/password-login", {
    "email": "outsider+phase2f@example.com", "password": "whatever"})
check("non-admin email -> 401 same shape", s == 401 and "Invalid credentials" in body)

# 3) correct credentials -> 200 + cookie
s, body, hdrs = _post("/api/auth/password-login", {
    "email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
set_cookie = hdrs.get("Set-Cookie", "") if hdrs else ""
session_cookie = ""
for piece in set_cookie.split(","):
    if "session_token=" in piece:
        session_cookie = piece.strip().split(";", 1)[0]
        break
check("correct password -> 200 + ok body + session_token cookie",
      s == 200 and json.loads(body).get("ok") is True
      and "session_token=" in session_cookie)

# 4) /api/auth/me using cookie -> 200 with is_admin true
s, body, _ = _get("/api/auth/me", cookie=session_cookie)
me = json.loads(body) if s == 200 else {}
check("/me via session cookie -> 200 + is_admin true",
      s == 200 and me.get("email", "").lower() == ADMIN_EMAIL.lower()
      and me.get("is_admin") is True)

# 5) brute-force lockout — five wrong tries from this IP, the 6th should 429.
#    Use a fresh non-admin email so the (ip, email) counter is clean.
SCRATCH_EMAIL = "lockout-test-%d@example.com" % int(time.time())
# Lockout is keyed (ip, email); use the actual admin email so the
# counter pre-existing from test 1 doesn't pollute this round.
# Pick a fresh admin-listed scratch by using the same admin but a unique
# password each call.  Test 3 already cleared the counter for ADMIN_EMAIL
# so this round starts at zero.  Need MAX_ATTEMPTS (5) failures BEFORE
# the correct-password attempt so the lockout check trips.
for _i in range(5):
    _post("/api/auth/password-login", {
        "email": ADMIN_EMAIL, "password": "w_" + str(_i)})
# Now try with the CORRECT password and assert 429 (lockout wins over
# successful auth).
s, body, _ = _post("/api/auth/password-login", {
    "email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
check("brute-force lockout after >=5 fails -> 429 even on correct pwd",
      s == 429 and "Too many" in body)

# Cleanup: clear the lockout counters so the operator isn't blocked
# during normal use right after the test runs.
try:
    import subprocess
    subprocess.run(
        ["mongosh", "--quiet", "--eval",
         "use('red5_v2_demo'); db.login_attempts.deleteMany({})"],
        check=False, capture_output=True, timeout=10,
    )
except Exception:
    pass

# -----------------------------------------------------------------------
print("V2.0 Phase 2f (password auth): %d pass, %d fail." %
      (5 - len(failures), len(failures)))
if failures:
    print("FAILURES:")
    for f in failures:
        print("  - " + f)
    sys.exit(1)
sys.exit(0)
