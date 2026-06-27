#!/usr/bin/env bash
# bootstrap_controllers.sh -- one-shot push of `repair_manifest.json` to a
# list of V1.9 controllers.  Designed for the one-time bootstrap when
# upgrading from a controller whose update.html does not yet have a
# manifest row in its UI (so the operator literally cannot click Replace).
#
# Usage:
#   bash scripts/bootstrap_controllers.sh 192.168.1.158 192.168.1.208 ...
#
# Or, if a controllers.txt file exists in the repo root (one IP per line,
# blank lines and `#` comments ignored):
#   bash scripts/bootstrap_controllers.sh
#
# Each push:
#   1. POSTs the freshly-built repair_manifest.json to /api/repair/upload-plugin
#   2. Reads the controller's manifest back and prints PASS / FAIL based on
#      whether it now reports the expected file count
#
# Idempotent.  Re-running on an already-bootstrapped controller is a no-op.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MANIFEST="$REPO_ROOT/archive/Red5-Studio-V1.9/repair_manifest.json"
LIST_FILE="$REPO_ROOT/controllers.txt"

if [[ ! -f "$MANIFEST" ]]; then
    echo "FATAL: $MANIFEST is missing.  Run scripts/build_repair_manifest.py first."
    exit 2
fi

# Expected entry count = lines containing `"name":` in the manifest.
EXPECTED=$(grep -c '"name":' "$MANIFEST")

# Collect controller IPs from $@ or $LIST_FILE.
TARGETS=()
if [[ $# -gt 0 ]]; then
    TARGETS=("$@")
elif [[ -f "$LIST_FILE" ]]; then
    while IFS= read -r line; do
        line="${line%%#*}"           # strip trailing comments
        line="${line//[[:space:]]/}" # strip whitespace
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

echo "${B}Pushing $MANIFEST ($EXPECTED entries) to ${#TARGETS[@]} controller(s):${X}"

PASS=0; FAIL=0
for ip in "${TARGETS[@]}"; do
    printf '  %-18s ... ' "$ip"

    # 1. Upload the manifest.
    UP_RESP=$(curl -s --max-time 10 -X POST \
                   -F "file=@${MANIFEST}" \
                   "http://${ip}:5001/api/repair/upload-plugin" \
                   2>&1 || true)
    if ! grep -q '"success": true' <<< "$UP_RESP" 2>/dev/null; then
        echo "${R}FAIL${X} (upload)  -- $UP_RESP"
        FAIL=$((FAIL+1))
        continue
    fi

    # 2. Read the manifest back and confirm the file count matches.
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
