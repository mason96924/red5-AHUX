#!/usr/bin/env bash
# bootstrap_controllers.sh -- one-shot push of `upload_service.py` +
# `repair_manifest.json` to a list of V1.9 controllers.
#
# What it does, per controller:
#   1. POST upload_service.py with X-Force-Override (sha256 mismatch is
#      expected -- we are TRYING to upgrade the very module that does
#      the integrity check, so we cannot also satisfy it).
#   2. POST /api/repair/reload-module/upload_service so the new routing
#      code goes live without a Flask restart.
#   3. POST repair_manifest.json.  The reloaded upload_service routes
#      this to DATA_ROOT correctly (previous version misrouted it to
#      PLUGINS_ROOT, leaving the manifest endpoint serving the stale
#      on-disk copy).
#   4. GET /api/repair/manifest and confirm the file count matches
#      the freshly-built manifest in this repo.
#
# Idempotent: re-running on an already-bootstrapped controller is a
# no-op (X-Force-Override silently overwrites with identical bytes,
# reload re-imports, manifest upload writes the same content).
#
# Usage:
#   bash scripts/bootstrap_controllers.sh 192.168.1.158 192.168.1.208 ...
#   bash scripts/bootstrap_controllers.sh                      (uses controllers.txt)

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ARCHIVE="$REPO_ROOT/archive/Red5-Studio-V1.9"
MANIFEST="$ARCHIVE/repair_manifest.json"
UPLOAD_SVC="$ARCHIVE/upload_service.py"
LIST_FILE="$REPO_ROOT/controllers.txt"

if [[ ! -f "$MANIFEST" ]]; then
    echo "FATAL: $MANIFEST is missing.  Run scripts/build_repair_manifest.py first."
    exit 2
fi
if [[ ! -f "$UPLOAD_SVC" ]]; then
    echo "FATAL: $UPLOAD_SVC is missing."
    exit 2
fi

EXPECTED=$(grep -c '"name":' "$MANIFEST")

# Collect controller IPs.
TARGETS=()
if [[ $# -gt 0 ]]; then
    TARGETS=("$@")
elif [[ -f "$LIST_FILE" ]]; then
    while IFS= read -r line; do
        line="${line%%#*}"
        line="${line//[[:space:]]/}"
        [[ -z "$line" ]] && continue
        TARGETS+=("$line")
    done < "$LIST_FILE"
else
    cat <<EOF >&2
Usage:  $0 <ip1> [ip2 ...]
   or:  echo -e "192.168.1.158\n192.168.1.208" > controllers.txt && $0

No controllers specified and no controllers.txt found.
EOF
    exit 2
fi

# ANSI colours when stdout is a tty.
if [[ -t 1 ]]; then
    R=$'\033[31m'; G=$'\033[32m'; Y=$'\033[33m'; B=$'\033[1m'; X=$'\033[0m'
else
    R=''; G=''; Y=''; B=''; X=''
fi

success_in() {
    # Match "success":true with or without whitespace.
    grep -qE '"success":\s*true' <<< "$1" 2>/dev/null
}

echo "${B}Pushing upload_service.py + repair_manifest.json ($EXPECTED entries) to ${#TARGETS[@]} controller(s):${X}"

PASS=0; FAIL=0
for ip in "${TARGETS[@]}"; do
    printf '  %-18s ' "$ip"

    # ---- step 1: upload_service.py (forced -- we change the integrity
    # checker, so we cannot also satisfy its check) ------------------
    UP_RESP=$(curl -s --max-time 15 -X POST \
                   -H "X-Force-Override: 1" \
                   -F "file=@${UPLOAD_SVC}" \
                   "http://${ip}:5001/api/repair/upload-plugin" \
                   2>&1 || true)
    if ! success_in "$UP_RESP"; then
        echo "${R}FAIL${X}  upload_service.py -- $UP_RESP"
        FAIL=$((FAIL+1)); continue
    fi

    # ---- step 2: hot-reload so the new routing code goes live ------
    RL_RESP=$(curl -s --max-time 15 -X POST \
                   "http://${ip}:5001/api/repair/reload-module/upload_service" \
                   2>&1 || true)
    if ! success_in "$RL_RESP"; then
        echo "${R}FAIL${X}  reload upload_service -- $RL_RESP"
        FAIL=$((FAIL+1)); continue
    fi

    # ---- step 3: now upload the manifest.  Reloaded upload_service
    # routes it to DATA_ROOT correctly. ------------------------------
    MAN_RESP=$(curl -s --max-time 15 -X POST \
                    -F "file=@${MANIFEST}" \
                    "http://${ip}:5001/api/repair/upload-plugin" \
                    2>&1 || true)
    if ! success_in "$MAN_RESP"; then
        echo "${R}FAIL${X}  repair_manifest.json -- $MAN_RESP"
        FAIL=$((FAIL+1)); continue
    fi
    # Sanity-check the dest field -- previous routing bug sent it to
    # pgpy/.  A correctly-routed manifest reports `data/`.
    if ! grep -q '"dest":"data/repair_manifest.json"' <<< "$MAN_RESP"; then
        echo "${Y}WARN${X}  manifest landed at $(grep -oE '"dest":"[^"]*"' <<< "$MAN_RESP")"
    fi

    # ---- step 4: read back and confirm count ------------------------
    GOT_COUNT=$(curl -s --max-time 10 "http://${ip}:5001/api/repair/manifest" \
                    | python3 -c 'import json,sys; m=json.load(sys.stdin); print(len(m.get("files") or []))' \
                    2>/dev/null || echo 0)

    if [[ "$GOT_COUNT" == "$EXPECTED" ]]; then
        echo "${G}OK${X}  (manifest now reports $GOT_COUNT files)"
        PASS=$((PASS+1))
    else
        echo "${Y}MISMATCH${X}  (controller reports $GOT_COUNT, expected $EXPECTED)"
        FAIL=$((FAIL+1))
    fi
done

echo
echo "${B}Summary:${X}  ${G}PASS $PASS${X}  ${R}FAIL $FAIL${X}"
[[ "$FAIL" -eq 0 ]] || exit 1
