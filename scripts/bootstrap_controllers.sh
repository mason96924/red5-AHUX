#!/usr/bin/env bash
# bootstrap_controllers.sh -- one-shot push of upload_service.py +
# repair_manifest.json + dashboard UI files to a list of V1.9 controllers.
#
# What it does, per controller (in order):
#   1. upload_service.py            (X-Force-Override -- self-upgrade)
#   2. /api/repair/reload-module    (new routing code goes live)
#   3. repair_manifest.json         (now lands in DATA_ROOT correctly)
#   4. dashboard.compiled.js
#   5. dashboard.html
#   6. update.html
#   7. GET /api/repair/verify       (per-file PASS / FAIL summary)
#
# Each step's sha256 is checked by the controller against the freshly
# uploaded manifest (step 3) -- so steps 4-6 fail loudly if local files
# are out of date.
#
# Idempotent: re-running on an already-current controller is a no-op
# (every upload writes identical bytes, the integrity check passes,
# nothing breaks).
#
# Flags:
#   --bootstrap-only    Stop after step 3 (skip pushing UI files).
#                       Useful for very old controllers where you want
#                       to bring the integrity-checker live first and
#                       eyeball the UI rows in /update before pushing
#                       the bigger bundles.
#   --ui-only           Skip steps 1-2 (assume upload_service.py +
#                       reload have already been done in a previous
#                       run).  Useful for the routine post-rebuild
#                       flow once every controller is bootstrapped.
#   (no flag)           Run all 7 steps.  Safe default.
#
# Usage:
#   bash scripts/bootstrap_controllers.sh 192.168.1.158 192.168.1.208
#   bash scripts/bootstrap_controllers.sh --ui-only          (controllers.txt)
#   bash scripts/bootstrap_controllers.sh --bootstrap-only 192.168.1.158

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ARCHIVE="$REPO_ROOT/archive/Red5-Studio-V1.9"
LIST_FILE="$REPO_ROOT/controllers.txt"

# ---- parse flags ----------------------------------------------------------
MODE='all'
ARGS=()
for a in "$@"; do
    case "$a" in
        --bootstrap-only)  MODE='bootstrap' ;;
        --ui-only)         MODE='ui' ;;
        --help|-h)
            sed -n '2,33p' "$0"; exit 0 ;;
        --*)               echo "unknown flag: $a" >&2; exit 2 ;;
        *)                 ARGS+=("$a") ;;
    esac
done

# ---- collect target IPs ---------------------------------------------------
TARGETS=()
if [[ ${#ARGS[@]} -gt 0 ]]; then
    TARGETS=("${ARGS[@]}")
elif [[ -f "$LIST_FILE" ]]; then
    while IFS= read -r line; do
        line="${line%%#*}"
        line="${line//[[:space:]]/}"
        [[ -z "$line" ]] && continue
        TARGETS+=("$line")
    done < "$LIST_FILE"
else
    echo "Usage:  $0 [--bootstrap-only|--ui-only] <ip1> [ip2 ...]" >&2
    echo "   or:  put IPs in $LIST_FILE (one per line)" >&2
    exit 2
fi

# ---- file lookups & sanity ------------------------------------------------
MANIFEST="$ARCHIVE/repair_manifest.json"
UPLOAD_SVC="$ARCHIVE/upload_service.py"

if [[ ! -f "$MANIFEST" ]]; then
    echo "FATAL: $MANIFEST is missing.  Run scripts/build_repair_manifest.py first." >&2
    exit 2
fi
if [[ ! -f "$UPLOAD_SVC" ]]; then
    echo "FATAL: $UPLOAD_SVC is missing." >&2
    exit 2
fi

# Candidate files to push when the controller's verify report flags
# them as stale or missing.  Anything in this list is eligible; the
# script consults /api/repair/verify after step 3 and only sends the
# subset the controller actually needs.  Newly-introduced files that
# are in the manifest but not in this list are still picked up via
# the $ARCHIVE/$n fallback in the push loop below.
UI_FILES=()
for f in dashboard.compiled.js dashboard.html dashboard.tailwind.css update.html \
         band_overrides_service.py telemetry_service.py \
         audit_log_service.py weather_service.py band_service.py \
         bridges_admin_service.py bacnet_diag_service.py \
         _bridges_lib.py \
         webhook_bridge_service.py mqtt_bridge_service.py \
         modbus_bridge_service.py ws_bridge_service.py \
         landing.html setup.html setup_walk.compiled.js \
         equipment_mapper.html psy_3d.html \
         data_bridges_guide.md opt_sa_insight.md \
         configs/bridges.json js/audit_log.js img/psy_silhouette.jpg; do
    p="$ARCHIVE/$f"
    [[ -f "$p" ]] && UI_FILES+=("$p")
done

EXPECTED=$(grep -c '"name":' "$MANIFEST")

# ---- colours --------------------------------------------------------------
if [[ -t 1 ]]; then
    R=$'\033[31m'; G=$'\033[32m'; Y=$'\033[33m'; B=$'\033[1m'; D=$'\033[2m'; X=$'\033[0m'
else
    R=''; G=''; Y=''; B=''; D=''; X=''
fi

success_in() {
    grep -qE '"success":\s*true' <<< "$1" 2>/dev/null
}

# Push one file via /api/repair/upload-plugin.  Returns 0 = OK, 1 = fail.
# Args: <ip> <local_path> [force-override-1|""]
push_file() {
    local ip="$1" path="$2" force="${3:-}"
    local name
    name="$(basename "$path")"
    local hdr=()
    [[ -n "$force" ]] && hdr=(-H "X-Force-Override: 1")
    local resp
    resp=$(curl -s --max-time 30 -X POST \
                 "${hdr[@]}" \
                 -F "file=@${path}" \
                 "http://${ip}:5001/api/repair/upload-plugin" \
                 2>&1 || true)
    if success_in "$resp"; then
        return 0
    fi
    # On sha256 mismatch the controller returns the expected vs got hash --
    # surface it so the operator knows their local file is stale.
    local why
    why=$(grep -oE '"error":"[^"]*"' <<< "$resp" | head -1 || true)
    echo "${R}FAIL${X}    $name -- ${why:-$resp}"
    return 1
}

reload_module() {
    local ip="$1" mod="$2"
    local resp
    resp=$(curl -s --max-time 30 -X POST \
                 "http://${ip}:5001/api/repair/reload-module/${mod}" \
                 2>&1 || true)
    success_in "$resp"
}

verify_controller() {
    local ip="$1"
    curl -s --max-time 15 "http://${ip}:5001/api/repair/verify" 2>/dev/null
}

echo "${B}mode=${MODE}  controllers=${#TARGETS[@]}  ui-files=${#UI_FILES[@]}  manifest-entries=${EXPECTED}${X}"

PASS=0; FAIL=0
for ip in "${TARGETS[@]}"; do
    echo ""
    echo "${B}[${ip}]${X}"
    ok=1

    if [[ "$MODE" != "ui" ]]; then
        # Step 1+2 : upgrade upload_service.py and hot-reload it.
        printf '  %-30s ... ' "upload_service.py"
        if push_file "$ip" "$UPLOAD_SVC" "force"; then
            echo "${G}OK${X} (forced)"
        else
            ok=0
        fi
        if [[ "$ok" == "1" ]]; then
            printf '  %-30s ... ' "reload upload_service"
            if reload_module "$ip" "upload_service"; then
                echo "${G}OK${X}"
            else
                echo "${R}FAIL${X}"
                ok=0
            fi
        fi
    fi

    # Step 3 : manifest (regardless of mode).
    if [[ "$ok" == "1" ]]; then
        printf '  %-30s ... ' "repair_manifest.json"
        if push_file "$ip" "$MANIFEST" ""; then
            echo "${G}OK${X}"
        else
            ok=0
        fi
    fi

    # Steps 4-6 : UI files, unless we are in bootstrap-only mode.
    # The list of files to push is driven by the controller's verify
    # report -- we ask it which files are stale or missing and only
    # send those (plus the locally-buildable subset).  This catches
    # newly-added plug-ins / static assets that pre-dated changes to
    # the script's hard-coded UI_FILES list.
    if [[ "$MODE" != "bootstrap" && "$ok" == "1" ]]; then
        REPORT=$(verify_controller "$ip")
        STALE=$(printf '%s' "$REPORT" | python3 -c '
import json, sys
try:
    d = json.loads(sys.stdin.read())
    out = []
    for f in (d.get("files") or []):
        if f.get("status") != "ok":
            out.append(f.get("name"))
    print("\n".join(out))
except Exception:
    pass
' 2>/dev/null)
        # Build the push set: every stale file that exists in our
        # local archive AND is not upload_service.py (already pushed)
        # AND not repair_manifest.json (already pushed).
        TO_PUSH=()
        # Preserve declared display order from UI_FILES for files that
        # ARE stale, then append any other stale files at the end.
        declare -A STALE_SET=()
        while IFS= read -r n; do [[ -n "$n" ]] && STALE_SET["$n"]=1; done <<< "$STALE"
        for ui in "${UI_FILES[@]}"; do
            n="$(basename "$ui")"
            if [[ -n "${STALE_SET[$n]:-}" ]]; then
                TO_PUSH+=("$ui")
                unset 'STALE_SET[$n]'
            fi
        done
        # Anything still in STALE_SET wasn't in UI_FILES (e.g. .py
        # plug-ins, js/audit_log.js).  Look them up under $ARCHIVE.
        for n in "${!STALE_SET[@]}"; do
            [[ "$n" == "upload_service.py" || "$n" == "repair_manifest.json" ]] && continue
            p="$ARCHIVE/$n"
            [[ -f "$p" ]] && TO_PUSH+=("$p")
        done
        for ui in "${TO_PUSH[@]}"; do
            bn="$(basename "$ui")"
            printf '  %-30s ... ' "$bn"
            if push_file "$ip" "$ui" ""; then
                # Auto hot-reload every *_service.py we just replaced so
                # the new code goes live without a manual "Reload" click.
                # bacnet_diag_service is the only allow-listed plug-in
                # that doesn't ship a hot-reload-safe register() yet --
                # silently skip on a 4xx so we don't break the push loop.
                if [[ "$bn" == *_service.py ]]; then
                    mod="${bn%.py}"
                    if reload_module "$ip" "$mod"; then
                        echo "${G}OK${X} (reloaded)"
                    else
                        echo "${G}OK${X} ${D}(reload skipped)${X}"
                    fi
                else
                    echo "${G}OK${X}"
                fi
            else
                ok=0
                break
            fi
        done
    fi

    # Step 7 : verify report (a single one-shot diff vs manifest).
    if [[ "$ok" == "1" ]]; then
        printf '  %-30s ... ' "verify"
        REPORT=$(verify_controller "$ip")
        SUMMARY=$(printf '%s' "$REPORT" | python3 -c '
import json, sys
try:
    raw = sys.stdin.read()
    if not raw.strip():
        print("UNREACHABLE  (empty response from /api/repair/verify)")
        sys.exit(0)
    d = json.loads(raw)
    pp = d.get("pass", 0); ff = d.get("fail", 0); mm = d.get("missing", 0)
    if ff == 0 and mm == 0:
        print(f"OK  pass={pp} fail=0 miss=0")
    else:
        bad = [f["name"] for f in (d.get("files") or []) if f.get("status") != "ok"]
        suffix = "..." if len(bad) > 5 else ""
        print(f"PARTIAL  pass={pp} fail={ff} miss={mm}  bad={chr(44).join(bad[:5])}{suffix}")
except Exception as ex:
    print(f"UNREACHABLE  ({ex})")
' 2>/dev/null)
        if [[ "$SUMMARY" == OK* ]]; then
            echo "${G}${SUMMARY}${X}"
            PASS=$((PASS+1))
        else
            echo "${Y}${SUMMARY}${X}"
            FAIL=$((FAIL+1))
        fi
    else
        FAIL=$((FAIL+1))
    fi
done

echo ""
echo "${B}Summary:${X}  ${G}PASS $PASS${X}  ${R}FAIL $FAIL${X}"
[[ "$FAIL" -eq 0 ]] || exit 1
