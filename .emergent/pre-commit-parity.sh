#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# pre-commit-parity.sh -- block commits that introduce V1.9/V2.0 endpoint drift
#
# This is a thin wrapper around /app/scripts/check_v19_v20_parity.py that only
# fires when the staged diff touches a backend routes file in either tree.
# It exits non-zero if V1.9 is missing any V2.0 /api/* route, blocking the
# commit until the drift is closed.
#
# WIRING (one-time, on the dev machine -- run from inside your checkout):
#
#   cd <your-checkout-root>           # e.g. ~/red5-studio
#   ln -sf "$(pwd)/.emergent/pre-commit-parity.sh" .git/hooks/pre-commit
#
# or if you already have a pre-commit hook, append:
#
#   bash "$(git rev-parse --show-toplevel)/.emergent/pre-commit-parity.sh" || exit 1
#
# OVERRIDES:
#   - Set PARITY_SKIP=1 in env  ->  skip the check entirely (emergency only).
#   - git commit --no-verify    ->  bypass ALL hooks (git's own escape hatch).
#
# WHY:
#   /app/deploy.sh already gates PROD deploys, but that fires only when you
#   push.  This pre-commit hook closes the loop earlier -- the moment you
#   add a route to /app/backend/routes/, the hook reminds you to also add
#   it to /app/archive/Red5-Studio-V1.9/ in the SAME commit.
# ---------------------------------------------------------------------------
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo /app)"
SCRIPT="$REPO_ROOT/scripts/check_v19_v20_parity.py"

# ANSI colours (only when stdout is a tty)
if [[ -t 1 ]]; then
    RED='\033[31m'; YEL='\033[33m'; GRN='\033[32m'; BLD='\033[1m'; OFF='\033[0m'
else
    RED=''; YEL=''; GRN=''; BLD=''; OFF=''
fi

# 0. Manual skip
if [[ "${PARITY_SKIP:-0}" == "1" ]]; then
    echo -e "${YEL}[parity-hook] skipped via PARITY_SKIP=1${OFF}"
    exit 0
fi

# 1. Skip if no backend route files are staged.  This keeps frontend-only
#    and docs-only commits fast.
if ! git diff --cached --name-only --diff-filter=ACM 2>/dev/null \
        | grep -E '^(backend/routes/|archive/Red5-Studio-V1\.9/.*\.py$)' \
        >/dev/null; then
    exit 0
fi

# 2. Script must exist (older checkouts won't have it -- don't block).
if [[ ! -f "$SCRIPT" ]]; then
    echo -e "${YEL}[parity-hook] $SCRIPT not found -- skipping${OFF}"
    exit 0
fi

# 3. Run the audit.
echo -e "${BLD}[parity-hook] V1.9/V2.0 endpoint parity check...${OFF}"
set +e
JSON="$(python3 "$SCRIPT" --json 2>/dev/null)"
RC=$?
set -e

case "$RC" in
    0)  echo -e "${GRN}[parity-hook] ok -- V1.9 implements every V2.0 /api/* route${OFF}"
        exit 0 ;;
    2)
        echo -e "${RED}[parity-hook] BLOCKED -- V1.9 is missing V2.0 route(s):${OFF}"
        echo "$JSON" | python3 -c "import json,sys; d=json.load(sys.stdin); [print('    - '+r) for r in d.get('v20_only',[])]"
        echo
        echo -e "${YEL}Port the missing endpoint(s) to /app/archive/Red5-Studio-V1.9/"
        echo -e "and 'git add' them, then re-commit.${OFF}"
        echo -e "${YEL}Bypass (NOT recommended): PARITY_SKIP=1 git commit ... ${OFF}"
        echo -e "${YEL}                          git commit --no-verify ...${OFF}"
        exit 1
        ;;
    3)  echo -e "${YEL}[parity-hook] scanner could not find source trees -- allowing commit${OFF}"
        exit 0 ;;
    *)  echo -e "${RED}[parity-hook] scanner unexpected exit $RC -- allowing commit${OFF}"
        exit 0 ;;
esac

# ---------------------------------------------------------------------------
# 4. Repair-manifest consistency check.  Runs only when files inside
#    archive/Red5-Studio-V1.9/ are staged (covers every file that could
#    appear in the manifest -- .py, .html, .js, .md, .json, configs/).
#    The manifest is the single source of truth for the Repair Mode
#    allow-list + sha256 hashes; a stale manifest = stale uploads
#    accepted at deploy time.
# ---------------------------------------------------------------------------
if git diff --cached --name-only --diff-filter=ACM 2>/dev/null \
        | grep -E '^archive/Red5-Studio-V1\.9/' \
        >/dev/null; then
    MANIFEST_SCRIPT="$REPO_ROOT/scripts/check_repair_manifest.py"
    if [[ -f "$MANIFEST_SCRIPT" ]]; then
        echo -e "${BLD}[manifest-hook] Repair manifest consistency check...${OFF}"
        set +e
        python3 "$MANIFEST_SCRIPT"
        MRC=$?
        set -e
        if [[ "$MRC" != "0" ]]; then
            echo -e "${RED}[manifest-hook] BLOCKED -- repair_manifest.json is stale.${OFF}"
            echo -e "${YEL}Fix:  python3 scripts/build_repair_manifest.py && git add archive/Red5-Studio-V1.9/repair_manifest.json${OFF}"
            exit 1
        fi
        echo -e "${GRN}[manifest-hook] ok${OFF}"
    fi
fi
