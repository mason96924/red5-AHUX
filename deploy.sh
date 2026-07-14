#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# deploy.sh — one-shot V2.0 PROD update
#
# Run on the PROD server after pushing changes from Emergent.
#
# Why this script exists:
#   • `git pull` alone does NOT update the directory nginx serves from
#     (`frontend/build/`).
#   • CRA's `yarn build` is what produces a *valid* React `index.html`
#     (with the webpack bundle <script> tags injected).  Simply rsyncing
#     `frontend/public/` over `build/` destroys those injected tags and
#     leaves an empty React shell — the bug that bit us on 2026-06-26.
#
# Pipeline (in order):
#   [1] git pull --ff-only
#   [2] yarn install        (only if node_modules is missing / lockfile changed)
#   [3] yarn build          (rebuilds build/ with a fresh, valid index.html
#                            + bundled main.<hash>.js — handles every React
#                            route in App.js automatically)
#   [4] mirror any stand-alone static files that CRA might not pick up
#       (defensive rsync; safe because yarn build already produced a complete
#       build/ tree).  Excludes index.html so the React build is preserved.
#   [5] restart red5-backend.service
#   [6] reload nginx
#   [7] print served-file fingerprint so health is visible at a glance
#
# Usage (absolute path; safe from any cwd):
#       ~/red5-studio/deploy.sh
#
# Override via env vars if your layout differs:
#       REPO_DIR=/srv/red5 NGINX_ROOT=/var/www/red5 ./deploy.sh
# ---------------------------------------------------------------------------

set -euo pipefail

# --- config -----------------------------------------------------------------
REPO_DIR="${REPO_DIR:-$HOME/red5-studio}"
FRONTEND_DIR="${FRONTEND_DIR:-$REPO_DIR/frontend}"
NGINX_ROOT="${NGINX_ROOT:-$( (grep -E '^\s*root\s' /etc/nginx/sites-available/red5 2>/dev/null || true) \
                          | head -1 | awk '{print $2}' | tr -d ';')}"
BACKEND_SVC="${BACKEND_SVC:-red5-backend}"

# --- pretty output ----------------------------------------------------------
bold()   { printf '\033[1m%s\033[0m\n' "$*"; }
green()  { printf '\033[32m%s\033[0m\n' "$*"; }
red()    { printf '\033[31m%s\033[0m\n' "$*" >&2; }
yellow() { printf '\033[33m%s\033[0m\n' "$*"; }

trap 'red "✗ deploy.sh failed on line $LINENO"' ERR

# --- CLI flags --------------------------------------------------------------
SKIP_PARITY=0
for arg in "$@"; do
    case "$arg" in
        --skip-parity-check)
            SKIP_PARITY=1
            ;;
        -h|--help)
            grep '^#' "$0" | head -33 | sed 's/^# \{0,1\}//'
            echo
            echo "Flags:"
            echo "  --skip-parity-check   skip the V1.9/V2.0 endpoint-parity preflight"
            echo "                        (emergency hot-fix only -- you SHOULD NOT use this routinely)"
            exit 0
            ;;
        *)
            red "unknown flag: $arg (try --help)"; exit 1
            ;;
    esac
done

bold "──────────────────────────────────────────────────────────────"
bold " Red5 Studio V2.0 — PROD update"
bold "──────────────────────────────────────────────────────────────"
echo "REPO_DIR     = $REPO_DIR"
echo "FRONTEND_DIR = $FRONTEND_DIR"
echo "NGINX_ROOT   = $NGINX_ROOT"
echo "BACKEND_SVC  = $BACKEND_SVC"
[[ "$SKIP_PARITY" == "1" ]] && yellow "PARITY CHECK = SKIPPED (--skip-parity-check)"
echo

# --- sanity -----------------------------------------------------------------
[[ -d "$REPO_DIR/.git" ]]                  || { red "REPO_DIR is not a git checkout"; exit 1; }
[[ -d "$FRONTEND_DIR/public" ]]            || { red "frontend/public missing"; exit 1; }
[[ -n "$NGINX_ROOT" && -d "$NGINX_ROOT" ]] || { red "NGINX_ROOT '$NGINX_ROOT' missing"; exit 1; }
command -v yarn >/dev/null                 || { red "yarn not installed (sudo apt-get install yarn)"; exit 1; }

# --- 0a. no-cache meta preflight --------------------------------------------
# Every *.html in frontend/public/ must carry the sentinel attribute
# `data-cache-policy="no-cache"`.  Without it, browsers cache the HTML
# indefinitely and PROD users see stale UI after every deploy until
# they hard-refresh -- the 2026-06-28 psy_3d.html SA-toggle invisibility
# bug that prompted this gate.
#
# Restore the tags by running:
#   python3 scripts/inject_no_cache_meta.py
bold "[0a/7] no-cache meta preflight (frontend/public/*.html)"
MISSING_CACHE=()
shopt -s nullglob
for html in "$FRONTEND_DIR"/public/*.html; do
    if ! grep -q 'data-cache-policy="no-cache"' "$html"; then
        MISSING_CACHE+=("$(basename "$html")")
    fi
done
shopt -u nullglob
if [[ ${#MISSING_CACHE[@]} -gt 0 ]]; then
    red "       ✗ ${#MISSING_CACHE[@]} HTML file(s) missing the no-cache meta tag:"
    for f in "${MISSING_CACHE[@]}"; do
        red "         - $f"
    done
    red ""
    red "       Refusing to deploy.  Run:"
    red "           python3 scripts/inject_no_cache_meta.py"
    red "       commit + push, then re-run deploy.sh."
    trap - ERR
    exit 4
else
    green "       ✓ all $(ls "$FRONTEND_DIR"/public/*.html 2>/dev/null | wc -l) HTML pages tagged"
fi
echo

# --- 0. parity preflight ----------------------------------------------------
# Static scan of /app/backend/routes/*.py (V2.0 FastAPI) vs
# /app/archive/Red5-Studio-V1.9/*.py (the Flask app PROD actually serves)
# to catch the class of bug where a route is added to V2.0 but never
# ported back to V1.9 -- PROD then 404s on the new endpoint and a UI
# feature silently disappears (e.g. the 2026-06-27 missing
# /api/ahu-rolling-avgs that hid every pill Delta-arrow on PROD).
#
# Failure exits with code 4 BEFORE any side effects (git pull / yarn /
# nginx reload), so a drifted deploy is impossible without --skip-parity-check.
PARITY_SCRIPT="$REPO_DIR/scripts/check_v19_v20_parity.py"
bold "[0/7] V1.9/V2.0 endpoint-parity preflight"
if [[ "$SKIP_PARITY" == "1" ]]; then
    yellow "       SKIPPED via --skip-parity-check (you SHOULD circle back and fix the drift)"
elif [[ ! -f "$PARITY_SCRIPT" ]]; then
    yellow "       SKIPPED -- $PARITY_SCRIPT not found (older checkout?)"
else
    # Run the audit.  Exit codes: 0=ok, 2=drift, 3=scan error.
    # The ERR trap can fire from a non-zero exit inside $(...) even with
    # `set +e`, so disable it for this block and reinstate after.
    trap - ERR
    set +e
    PARITY_JSON="$(python3 "$PARITY_SCRIPT" --json --log /var/log/red5/parity_warnings.log 2>/dev/null)"
    PARITY_RC=$?
    set -e
    trap 'red "✗ deploy.sh failed on line $LINENO"' ERR
    case "$PARITY_RC" in
        0) green "       ✓ parity OK -- V1.9 implements every V2.0 /api/* route" ;;
        2)
            red "       ✗ V1.9 IS MISSING V2.0 ROUTE(S):"
            echo "$PARITY_JSON" \
                | python3 -c "import json,sys; d=json.load(sys.stdin); [print('         - '+r) for r in d.get('v20_only',[])]" >&2
            red ""
            red "       Refusing to deploy.  Port the missing routes to"
            red "       /app/archive/Red5-Studio-V1.9/ then re-run.  In an"
            red "       absolute emergency you can override with"
            red "       \"deploy.sh --skip-parity-check\" (logged + dangerous)."
            trap - ERR
            exit 4
            ;;
        3) yellow "       ⚠  parity scanner couldn't find source trees -- continuing anyway"
            echo "       (exit 3 from $PARITY_SCRIPT)" ;;
        *) red "       ✗ parity scanner unexpected exit $PARITY_RC"; trap - ERR; exit 4 ;;
    esac
fi
echo

# --- 1. git pull -----------------------------------------------------------
bold "[1/7] git pull --ff-only"
cd "$REPO_DIR"
BEFORE_SHA=$(git rev-parse --short HEAD)
git pull --ff-only
AFTER_SHA=$(git rev-parse --short HEAD)
if [[ "$BEFORE_SHA" == "$AFTER_SHA" ]]; then
    echo "       already at $AFTER_SHA — nothing new from origin"
else
    echo "       $BEFORE_SHA → $AFTER_SHA"
fi
echo

# --- 2. yarn install (only when needed) -------------------------------------
bold "[2/7] yarn install (skipped if node_modules is up-to-date)"
cd "$FRONTEND_DIR"
if [[ ! -d node_modules ]] || \
   [[ package.json -nt node_modules ]] || \
   [[ yarn.lock    -nt node_modules ]]; then
    # NOTE: NO --frozen-lockfile.  This script runs on the PROD box where
    # ad-hoc `yarn add` history can leave lockfile drift; we'd rather
    # auto-heal the lockfile than fail the deploy.  CI/CD pipelines that
    # need strict reproducibility should use `yarn install --frozen-lockfile`
    # explicitly, not this script.
    yarn install --network-timeout 600000
else
    echo "       node_modules already current — skipping"
fi
echo

# --- 3. yarn build (regenerates build/index.html + bundles) -----------------
bold "[3/7] yarn build  (writes $FRONTEND_DIR/build/)"
yarn build
echo

# --- 4. defensive mirror of stand-alone static files ------------------------
#  CRA's `yarn build` already copies everything from public/ into build/
#  EXCEPT it transforms index.html.  So a `yarn build` alone is sufficient.
#  This rsync is a belt-and-braces no-op for now — kept as a safety net in
#  case future asset trees grow outside public/.  --exclude index.html is
#  critical: we must NOT overwrite the React-built index.html with the
#  raw CRA template.
bold "[4/7] mirror build/  →  $NGINX_ROOT/  (excludes index.html)"
rsync -ah --force --info=stats1 \
      --exclude=index.html \
      "$FRONTEND_DIR/build/" "$NGINX_ROOT/"
# Finally copy the React-built index.html separately, atomically.
if [[ "$FRONTEND_DIR/build" -ef "$NGINX_ROOT" ]]; then
    echo "       (NGINX_ROOT already points at build/ — skipping copy)"
else
    cp -f "$FRONTEND_DIR/build/index.html" "$NGINX_ROOT/index.html"
fi
echo

# --- 5. backend restart -----------------------------------------------------
bold "[5/7] systemctl restart $BACKEND_SVC"
if systemctl list-unit-files | grep -q "^${BACKEND_SVC}\.service"; then
    sudo systemctl restart "$BACKEND_SVC"
    sudo systemctl --no-pager --lines=0 status "$BACKEND_SVC" | head -3
else
    echo "       (skipped — no '$BACKEND_SVC.service' unit)"
fi
echo

# --- 6. nginx reload --------------------------------------------------------
bold "[6/7] nginx -t && systemctl reload nginx"
sudo nginx -t
sudo systemctl reload nginx
echo

# --- 7. health fingerprint --------------------------------------------------
bold "[7/7] verify served assets"
PASS=1

# 7a — setup.html cache-bust hash
if [[ -f "$NGINX_ROOT/setup.html" ]]; then
    HASH_LINE=$(grep -E 'setup_walk\.compiled\.js' "$NGINX_ROOT/setup.html" | tail -1 || true)
    echo "       setup.html  : $HASH_LINE"
    if [[ "$HASH_LINE" != *"?v="* ]]; then
        red "       ⚠  no ?v= hash on setup_walk.compiled.js"
        PASS=0
    fi
else
    red "       setup.html missing in $NGINX_ROOT"
    PASS=0
fi

# 7b — React index.html actually has the bundle
if [[ -f "$NGINX_ROOT/index.html" ]]; then
    BUNDLE=$(grep -oE '/static/js/main\.[a-f0-9]+\.js' "$NGINX_ROOT/index.html" | head -1 || true)
    echo "       index.html  : ${BUNDLE:-(no React bundle reference found)}"
    if [[ -z "$BUNDLE" ]]; then
        red "       ⚠  index.html has no React bundle tag — SPA routes will be blank"
        PASS=0
    fi
else
    red "       index.html missing in $NGINX_ROOT"
    PASS=0
fi

# 7c — dashboard auth uses Stage B whoami (not legacy /api/auth/me)
if [[ -f "$NGINX_ROOT/dashboard.html" ]]; then
    if grep -q "/api/auth/whoami" "$NGINX_ROOT/dashboard.html" \
       && ! grep -q "/api/auth/me" "$NGINX_ROOT/dashboard.html"; then
        echo "       dashboard.html: auth pill uses /api/auth/whoami ✓"
    else
        red "       ⚠  dashboard.html still calls /api/auth/me — top-right will show GUEST"
        PASS=0
    fi
else
    red "       dashboard.html missing in $NGINX_ROOT"
    PASS=0
fi

# 7d — access.html present (GET / rewrite target)
if [[ -f "$NGINX_ROOT/access.html" ]]; then
    if grep -q "RED5 STUDIO" "$NGINX_ROOT/access.html"; then
        echo "       access.html   : present ✓"
    else
        red "       ⚠  access.html missing RED5 STUDIO heading"
        PASS=0
    fi
else
    red "       access.html missing in $NGINX_ROOT"
    PASS=0
fi

echo
if [[ "$PASS" == "1" ]]; then
    green "✓ deploy.sh complete — deploy looks healthy"
else
    red   "✗ deploy.sh finished WITH WARNINGS — see above"
    exit 2
fi
