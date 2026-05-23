#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# Red5 Studio V2.0 — End-to-end smoke test
# -----------------------------------------------------------------------------
# Run after every deploy.  Hits every critical endpoint and reports
# pass/fail for each.  Designed to be:
#   - safe to run anytime (no writes, no auth required)
#   - fast (< 5 s total)
#   - readable in a single terminal screen
#
# Usage:
#   ~/red5-studio/scripts/smoke.sh                 # local host
#   BASE_URL=http://192.168.1.158 smoke.sh          # remote host
# -----------------------------------------------------------------------------
set -uo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1}"
TIMEOUT=8

PASS=0
FAIL=0
RED=$'\033[0;31m'; GREEN=$'\033[0;32m'; YELLOW=$'\033[0;33m'; DIM=$'\033[2m'; NC=$'\033[0m'

# ---- helper -----------------------------------------------------------------
check() {
    local name="$1" url="$2" want_pattern="$3"
    local body
    body=$(curl -s --max-time "$TIMEOUT" "$url" 2>/dev/null)
    local rc=$?
    if [ $rc -ne 0 ]; then
        printf "%s ✗ %-32s%s  curl failed (rc=%d) %s%s%s\n" \
               "$RED" "$name" "$NC" "$rc" "$DIM" "$url" "$NC"
        FAIL=$((FAIL+1)); return
    fi
    if [[ "$body" == *"$want_pattern"* ]]; then
        printf "%s ✓ %-32s%s  %s%s%s\n" "$GREEN" "$name" "$NC" "$DIM" "$url" "$NC"
        PASS=$((PASS+1))
    else
        printf "%s ✗ %-32s%s  unexpected body  %s%s%s\n" \
               "$RED" "$name" "$NC" "$DIM" "$url" "$NC"
        printf "    %s%s%s\n" "$DIM" "$(echo "$body" | head -c 200)" "$NC"
        FAIL=$((FAIL+1))
    fi
}

# ---- start ------------------------------------------------------------------
echo
echo "=== Red5 Studio smoke test (target: $BASE_URL) ==="
echo

# 1) static / SPA --------------------------------------------------------------
check "landing (V2.0 React)"  "$BASE_URL/"                  "<!DOCTYPE html"
check "learn.html"            "$BASE_URL/learn.html"        "Comfort Decoded"
check "deepdive.html"         "$BASE_URL/deepdive.html"     "B1"
check "buildings.html"        "$BASE_URL/buildings.html"    "Building"
check "dashboard.html"        "$BASE_URL/dashboard.html"    "Red5"
check "psy_3d.html"           "$BASE_URL/psy_3d.html"       "Weather"
check "SPA fallback"          "$BASE_URL/some-random-route" "<!DOCTYPE html"

# 2) backend basics ------------------------------------------------------------
check "backend version"       "$BASE_URL/api/version"       "version"
check "telemetry (simulated)" "$BASE_URL/api/data"          "AHU"
check "auth/me (anon)"        "$BASE_URL/api/auth/me"       "{"
check "file-browser (anon)"   "$BASE_URL/api/files?root=data" "files"
check "telemetry-status"      "$BASE_URL/api/telemetry-status" "{"

# 3) weather-proxy resilience -------------------------------------------------
#    Date span is last 5 days so every tier can satisfy it; the test only
#    cares that *some* source returned hourly data.
START="$(date -u -d '5 days ago' '+%Y-%m-%d' 2>/dev/null || date -u -v-5d '+%Y-%m-%d')"
END="$(  date -u -d '1 day ago'  '+%Y-%m-%d' 2>/dev/null || date -u -v-1d '+%Y-%m-%d')"
check "weather-proxy (5 days)" \
      "$BASE_URL/api/weather-proxy?latitude=37.55&longitude=127.04&start_date=$START&end_date=$END&hourly=temperature_2m,relative_humidity_2m" \
      "hourly"

# Identify which tier served the request (informational; never fails).
SRC=$(curl -s --max-time "$TIMEOUT" \
    "$BASE_URL/api/weather-proxy?latitude=37.55&longitude=127.04&start_date=$START&end_date=$END&hourly=temperature_2m,relative_humidity_2m" \
    | python3 -c 'import sys,json
try:
    d=json.load(sys.stdin)
    print(d.get("source","open-meteo"))
except Exception:
    print("?")' 2>/dev/null)
printf "   %s weather served by: %s%s%s\n" "$YELLOW" "$DIM" "$SRC" "$NC"

# 4) summary -------------------------------------------------------------------
echo
TOTAL=$((PASS+FAIL))
if [ "$FAIL" -eq 0 ]; then
    echo "${GREEN}=== ALL $PASS / $TOTAL CHECKS PASSED ===${NC}"
    exit 0
else
    echo "${RED}=== $FAIL / $TOTAL CHECKS FAILED ===${NC}"
    exit 1
fi
