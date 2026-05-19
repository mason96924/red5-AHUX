"""Regression test for the V2.0 Phase 1 demo backend.

Verifies the FastAPI surface required by the V1.9 dashboard.html so the
hosted demo never regresses past basic functionality.

Run:
    python3 tests/test_v2_phase1_backend.py
"""
from __future__ import annotations
import os
import sys
import time
import urllib.request
import urllib.error
import json
import subprocess

BASE = os.environ.get("V2_BASE_URL", "http://localhost:8001")


def get(path, qs=""):
    url = BASE + path + qs
    try:
        with urllib.request.urlopen(url, timeout=10) as r:
            return r.status, r.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8")
    except Exception as e:
        return -1, str(e)


def post(path, body):
    req = urllib.request.Request(
        BASE + path,
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return r.status, r.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8")


# -----------------------------------------------------------------------
failures = []


def check(name, ok, info=""):
    if not ok:
        failures.append(name + ("  " + info if info else ""))


# Health + version
s, body = get("/api/health")
check("/api/health  -> 200 + ok:true",
      s == 200 and json.loads(body).get("ok") is True,
      "got %d  %s" % (s, body[:120]))

s, body = get("/api/version")
check("/api/version  -> 200 + version starts with 2.0",
      s == 200 and json.loads(body)["version"].startswith("2.0"),
      "got %d  %s" % (s, body[:120]))

# Data array contract (V1.9 dashboard expects Array.isArray(data))
s, body = get("/api/data")
data = json.loads(body) if s == 200 else None
check("/api/data  -> 200 + ARRAY (V1.9 dashboard contract)",
      s == 200 and isinstance(data, list) and len(data) > 0)
if isinstance(data, list) and data:
    a = data[0]
    check("/api/data  -> entry has id + procColor + points + vavs + active_band",
          all(k in a for k in ("id", "procColor", "points", "vavs", "active_band")))
    labels = [p["label"] for p in a["points"]]
    check("/api/data  -> point labels = ['OA','SA','RA']",
          labels == ["OA", "SA", "RA"],
          "got: %s" % labels)
    check("/api/data  -> OA has t, rh, w + numeric",
          all(isinstance(a["points"][0].get(k), (int, float)) for k in ("t", "rh", "w")))
    # V1.9 contract: w is kg/kg (decimal), NOT g/kg.  Dashboard pills and the
    # animation overlay multiply by 1000 to display g/kg, so a g/kg value
    # would plot at w*1000 ~= 9000 (completely off-chart) and render
    # nonsensical enthalpy in the AHU pill (~23,000 kJ/kg).
    oa = a["points"][0]
    check("/api/data  -> w is kg/kg decimal (V1.9 contract, NOT g/kg)",
          0.0 < oa["w"] < 0.05,
          "got w=%s (expected ~0.009 kg/kg, NOT 9 g/kg)" % oa["w"])

# Equipment + collector configs
s, body = get("/api/equipment-types")
et = json.loads(body) if s == 200 else None
check("/api/equipment-types  -> has ahu_types + vav_types",
      s == 200 and "ahu_types" in et and "vav_types" in et)

s, body = get("/api/collector-config")
check("/api/collector-config  -> 200", s == 200)

# Services list
s, body = get("/api/services")
svc = json.loads(body) if s == 200 else None
check("/api/services  -> contains telemetry_service",
      s == 200 and any(x["name"] == "telemetry_service" for x in svc["services"]))

# Weather
s, body = get("/api/weather-location")
wl = json.loads(body) if s == 200 else None
check("/api/weather-location  -> active + saved (>=4 cities)",
      s == 200 and "active" in wl and len(wl["saved"]) >= 4)

# Weather history: BOTH with and without lat/lon (dashboard issues both)
s, body = get("/api/weather-history", "?lat=47.60&lon=-122.30")
check("/api/weather-history  ?lat&lon  -> 200",
      s == 200 and json.loads(body).get("source") == "open-meteo")

s, body = get("/api/weather-history")
check("/api/weather-history (no args)  -> 200 (defaults to active location)",
      s == 200,
      "regression: dashboard fires this before user picks a city")

# Tomorrow forecast
s, body = get("/api/tomorrow-forecast")
tf = json.loads(body) if s == 200 else None
check("/api/tomorrow-forecast  -> 24 hours",
      s == 200 and len(tf["hours"]) == 24)

# Band overrides
s, body = get("/api/band-overrides/sa-rh-clamp")
check("/api/band-overrides/sa-rh-clamp  -> 200",
      s == 200 and json.loads(body)["status"] == "ok")

s, body = get("/api/band-overrides/preview", "?lo=40&hi=55")
prev = json.loads(body) if s == 200 else None
check("/api/band-overrides/preview  -> reports affected count",
      s == 200 and "affected_bands" in prev and prev["total_bands"] == 10)

# Trend / collector log / write history
s, body = get("/api/trend-history", "?point=OA&window_min=60")
th = json.loads(body) if s == 200 else None
check("/api/trend-history  -> 60 samples",
      s == 200 and len(th["samples"]) == 60)

s, body = get("/api/write-history")
check("/api/write-history  -> empty list (demo never writes)",
      s == 200 and json.loads(body)["history"] == [])

s, body = get("/api/collector-log")
check("/api/collector-log  -> non-empty log",
      s == 200 and len(json.loads(body)["log"]) > 0)

# Disk status + map config
s, body = get("/api/disk-status")
check("/api/disk-status  -> 200 + percent_used",
      s == 200 and "percent_used" in json.loads(body))

s, body = get("/api/map-config")
data = json.loads(body) if s == 200 else {}
check("/api/map-config  -> V1.9 floors-array shape",
      s == 200 and "floors" in data and isinstance(data["floors"], list))

# Assets (no-path manifest + with-path passthrough)
s, body = get("/api/assets")
check("/api/assets (no path)  -> manifest with ahu/vav/floor keys",
      s == 200 and "ahu_types" in json.loads(body))

s, body = get("/api/assets/configs/equipment_types.json")
check("/api/assets/configs/equipment_types.json  -> serves equipment schema",
      s == 200 and "ahu_types" in json.loads(body))

# POSTs (demo accepts but does not persist)
s, body = post("/api/save-equipment-schema", {"ahu_types": {}, "vav_types": {}})
check("POST /api/save-equipment-schema  -> ok + persisted:false (demo)",
      s == 200 and json.loads(body)["persisted"] is False)

s, body = post("/api/data-mode", {"mode": "simulator"})
check("POST /api/data-mode  -> success:true",
      s == 200 and json.loads(body)["success"] is True)

s, body = post("/api/band-overrides/sa-rh-clamp", {"sa_rh_clamp": {"enabled": True, "lo": 40, "hi": 55}})
check("POST /api/band-overrides/sa-rh-clamp  -> ok + applied:false (demo)",
      s == 200 and json.loads(body)["applied"] is False)

# -----------------------------------------------------------------------
print("V2.0 Phase 1 backend: %d pass, %d fail." % (26 - len(failures), len(failures)))
if failures:
    print("FAILURES:")
    for f in failures:
        print("  - " + f)
    sys.exit(1)
sys.exit(0)
