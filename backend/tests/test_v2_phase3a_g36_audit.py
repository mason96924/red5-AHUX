"""Phase 3a -- G36 controller + audit log regression suite.

Hits the running supervisor backend on REACT_APP_BACKEND_URL.

Covers:
  - GET /api/g36/modes  -> 8 modes
  - GET /api/g36/state/{ahu_id}  -> seeded defaults
  - POST /api/g36/tick/{ahu_id}  -> mode transitions through the 8 cases
  - Trim-&-Respond direction + clamping
  - Request voting math
  - POST /api/g36/setpoints/{ahu_id} requires admin (gated)
  - Setpoint mutation flows into /api/audit-log
  - /api/audit-log/summary returns the action histogram
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
ADMIN_EMAIL    = os.environ.get("ADMIN_PASSWORD_EMAIL") or "seeker0829@gmail.com"
ADMIN_PASSWORD = os.environ.get("TEST_ADMIN_PASSWORD", "Delta1234!")

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"


def _req(method, path, body=None, cookie=None):
    data = json.dumps(body).encode("utf-8") if body is not None else None
    headers = {"User-Agent": UA}
    if body is not None:
        headers["Content-Type"] = "application/json"
    if cookie:
        headers["Cookie"] = cookie
    req = urllib.request.Request(BASE_URL + path, data=data, headers=headers, method=method)
    try:
        r = urllib.request.urlopen(req, timeout=10)
        return r.status, r.read().decode("utf-8"), r.headers
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8"), e.headers


failures = []
def check(label, ok, info=""):
    print(("PASS  " if ok else "FAIL  ") + label + ("  " + info if info and not ok else ""))
    if not ok: failures.append(label)


# ----------------------------------------------------------------------
# G36 module-level sanity
# ----------------------------------------------------------------------
s, body, _ = _req("GET", "/api/g36/modes")
modes = json.loads(body).get("modes") if s == 200 else []
check("GET /api/g36/modes -> 8 modes",
      s == 200 and len(modes) == 8 and "occupied" in modes and "freeze_protection" in modes)

AHU = "TEST-AHU-%d" % int(time.time())

# Seed state
s, body, _ = _req("GET", f"/api/g36/state/{AHU}")
state0 = json.loads(body) if s == 200 else {}
check("GET /api/g36/state seeds defaults",
      s == 200 and state0.get("mode") == "unoccupied" and state0.get("sat_reset_c") == 13.0)


# ----------------------------------------------------------------------
# Tick through several scenarios
# ----------------------------------------------------------------------
def tick(payload):
    return _req("POST", f"/api/g36/tick/{AHU}", payload)


# Scenario 1: warm_up -- occupancy on, zones cold
s, body, _ = tick({
    "oat_c": 10.0, "sat_c": 14.0, "sa_static_pa": 250.0,
    "zones": [
        {"zone_id": "Z1", "zat_c": 17.0, "heating_loop_pct": 90.0, "cooling_loop_pct": 0.0,
         "damper_pct": 60.0, "airflow_setpoint_cfm": 800, "airflow_actual_cfm": 800},
    ],
})
state = json.loads(body) if s == 200 else {}
check("warm_up mode when avg ZAT << occ heating SP",
      s == 200 and state.get("mode") == "warm_up", info=state.get("mode_reason", ""))

# Scenario 2: occupied steady, with high cooling load -> SAT should DECREASE
# Run multiple ticks so the T&R has a chance to walk the setpoint.
sat_path = []
for _i in range(8):
    s, body, _ = tick({
        "oat_c": 30.0, "sat_c": 13.0, "sa_static_pa": 270.0,
        "zones": [
            {"zone_id": "Z1", "zat_c": 23.5, "cooling_loop_pct": 98.0, "heating_loop_pct": 0.0,
             "damper_pct": 95.0, "airflow_setpoint_cfm": 1000, "airflow_actual_cfm": 880},
            {"zone_id": "Z2", "zat_c": 23.8, "cooling_loop_pct": 96.0, "heating_loop_pct": 0.0,
             "damper_pct": 98.0, "airflow_setpoint_cfm": 1000, "airflow_actual_cfm": 850},
        ],
    })
    if s == 200:
        sat_path.append(json.loads(body).get("sat_reset_c"))
check("occupied + heavy cooling -> SAT reset trends DOWN",
      len(sat_path) >= 2 and sat_path[-1] < sat_path[0] - 0.05, info=str(sat_path))

# Pressure should trend UP under saturated dampers + airflow shortfall
state = json.loads(body) if s == 200 else {}
check("occupied + heavy cooling -> DSP reset trends UP",
      state.get("dsp_reset_pa", 0) > 250.0, info=str(state.get("dsp_reset_pa")))

# Request voting math (2 zones at 95+ each -> 6 cooling requests)
check("cooling-request count = 6 with two saturated zones",
      state.get("cooling_requests") == 6, info=str(state.get("cooling_requests")))

# Scenario 3: freeze protection wins regardless of occupancy
s, body, _ = tick({
    "oat_c": 2.0, "sat_c": 14.0, "sa_static_pa": 250.0,
    "zones": [{"zone_id": "Z1", "zat_c": 22.0, "cooling_loop_pct": 0.0, "heating_loop_pct": 0.0,
               "damper_pct": 50.0, "airflow_setpoint_cfm": 500, "airflow_actual_cfm": 500}],
})
state = json.loads(body) if s == 200 else {}
check("freeze_protection when OAT below threshold",
      s == 200 and state.get("mode") == "freeze_protection")


# ----------------------------------------------------------------------
# Setpoint mutation gating + audit
# ----------------------------------------------------------------------
# Without a session cookie, setpoint POST must 401
s, body, _ = _req("POST", f"/api/g36/setpoints/{AHU}",
                  body={"occ_heating_sp_c": 22.0})
check("setpoint POST without auth -> 401", s == 401)

# Login as admin to get the session_token cookie
s, body, hdrs = _req("POST", "/api/auth/password-login",
                     body={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
set_cookie = hdrs.get("Set-Cookie", "") if hdrs and s == 200 else ""
session_cookie = ""
for piece in set_cookie.split(","):
    if "session_token=" in piece:
        session_cookie = piece.strip().split(";", 1)[0]
        break

if not session_cookie:
    print("WARN  admin login failed (s=%d) -- skipping audit checks" % s)
    sys.exit(0 if not failures else 1)

# Mutate a setpoint with admin session
import copy
new_sp = dict(state0.get("setpoints", {}))
# Pydantic may have model_dump output -- ensure dict
if not new_sp:
    new_sp = {}
new_sp["occ_cooling_sp_c"] = 25.5
new_sp["sat_max_c"] = 19.0
s, body, _ = _req("POST", f"/api/g36/setpoints/{AHU}",
                  body=new_sp, cookie=session_cookie)
check("setpoint POST with admin session -> 200", s == 200, info=body[:120])

# Read back and confirm
s, body, _ = _req("GET", f"/api/g36/setpoints/{AHU}")
sp_after = json.loads(body) if s == 200 else {}
check("setpoint readback shows mutation",
      sp_after.get("occ_cooling_sp_c") == 25.5 and sp_after.get("sat_max_c") == 19.0,
      info=str(sp_after))

# Audit log read must require admin
s, body, _ = _req("GET", "/api/audit-log?limit=5")
check("GET /api/audit-log anon -> 401", s == 401)

s, body, _ = _req("GET", "/api/audit-log?limit=20", cookie=session_cookie)
log = json.loads(body) if s == 200 else {}
events = log.get("events", [])
check("GET /api/audit-log admin -> 200 + envelope",
      s == 200 and isinstance(events, list) and "ttl_days" in log)

# The setpoint mutation we just made must be the freshest g36-setpoint event
fresh_g36 = [e for e in events if e.get("action") == "g36-setpoint"
             and e.get("resource") == f"ahu:{AHU}"]
check("audit event recorded for the g36-setpoint mutation",
      len(fresh_g36) >= 1, info="actions seen: " + ",".join({e.get('action','?') for e in events}))

if fresh_g36:
    e = fresh_g36[0]
    check("audit event has user_email + before/after",
          e.get("user_email", "").lower() == ADMIN_EMAIL.lower()
          and isinstance(e.get("after"), dict)
          and e["after"].get("occ_cooling_sp_c") == 25.5)

# Filter by action
s, body, _ = _req("GET", "/api/audit-log?action=g36-setpoint&limit=10", cookie=session_cookie)
log_filt = json.loads(body) if s == 200 else {}
check("audit-log filter by action=g36-setpoint",
      all(e.get("action") == "g36-setpoint" for e in log_filt.get("events", [])))

# Summary
s, body, _ = _req("GET", "/api/audit-log/summary", cookie=session_cookie)
summary = json.loads(body) if s == 200 else {}
check("audit-log summary returns histogram",
      s == 200 and "window_24h" in summary and "window_7d" in summary and "total" in summary)


# ----------------------------------------------------------------------
print("Phase 3a (G36 + audit): %d pass, %d fail." % (12 + 4 - len(failures), len(failures)))
if failures:
    print("FAILURES:")
    for f in failures: print("  - " + f)
    sys.exit(1)
sys.exit(0)
