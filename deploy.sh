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
NGINX_ROOT="${NGINX_ROOT:-$(grep -E '^\s*root\s' /etc/nginx/sites-available/red5 \
                          | head -1 | awk '{print $2}' | tr -d ';')}"
BACKEND_SVC="${BACKEND_SVC:-red5-backend}"

# --- pretty output ----------------------------------------------------------
bold()  { printf '\033[1m%s\033[0m\n' "$*"; }
green() { printf '\033[32m%s\033[0m\n' "$*"; }
red()   { printf '\033[31m%s\033[0m\n' "$*" >&2; }

trap 'red "✗ deploy.sh failed on line $LINENO"' ERR

bold "──────────────────────────────────────────────────────────────"
bold " Red5 Studio V2.0 — PROD update"
bold "──────────────────────────────────────────────────────────────"
echo "REPO_DIR     = $REPO_DIR"
echo "FRONTEND_DIR = $FRONTEND_DIR"
echo "NGINX_ROOT   = $NGINX_ROOT"
echo "BACKEND_SVC  = $BACKEND_SVC"
echo

# --- sanity -----------------------------------------------------------------
[[ -d "$REPO_DIR/.git" ]]                  || { red "REPO_DIR is not a git checkout"; exit 1; }
[[ -d "$FRONTEND_DIR/public" ]]            || { red "frontend/public missing"; exit 1; }
[[ -n "$NGINX_ROOT" && -d "$NGINX_ROOT" ]] || { red "NGINX_ROOT '$NGINX_ROOT' missing"; exit 1; }
command -v yarn >/dev/null                 || { red "yarn not installed (sudo apt-get install yarn)"; exit 1; }

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
    yarn install --frozen-lockfile
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

echo
if [[ "$PASS" == "1" ]]; then
    green "✓ deploy.sh complete — deploy looks healthy"
else
    red   "✗ deploy.sh finished WITH WARNINGS — see above"
    exit 2
fi
