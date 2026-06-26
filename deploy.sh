#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# deploy.sh — one-shot V2.0 PROD update
#
# Run this on the PROD server after pushing changes from Emergent.  It
# performs the full update sequence so static assets in nginx's actual
# serve root stay in lock-step with the freshly-pulled `frontend/public/`
# tree.  Eliminates the "I git-pulled but the site still looks old" trap.
#
# Steps:
#   1. git pull (fast-forward only — refuses to silently merge)
#   2. rsync frontend/public/  ->  $NGINX_ROOT  (preserves CRA build/ artefacts)
#   3. restart the FastAPI backend service
#   4. reload nginx (cheap; ensures any config edits take effect)
#   5. print served-file fingerprint so you can verify without curl gymnastics
#
# Usage (from anywhere; absolute paths are used throughout):
#       ~/red5-studio/deploy.sh
# ---------------------------------------------------------------------------

set -euo pipefail

# --- config (override via env vars if your PROD layout differs) -------------
REPO_DIR="${REPO_DIR:-$HOME/red5-studio}"
NGINX_ROOT="${NGINX_ROOT:-$(grep -E '^\s*root\s' /etc/nginx/sites-available/red5 \
                          | head -1 | awk '{print $2}' | tr -d ';')}"
BACKEND_SVC="${BACKEND_SVC:-red5-backend}"   # systemd unit name

# --- pretty output ---------------------------------------------------------
bold()  { printf '\033[1m%s\033[0m\n' "$*"; }
green() { printf '\033[32m%s\033[0m\n' "$*"; }
red()   { printf '\033[31m%s\033[0m\n' "$*" >&2; }

trap 'red "✗ deploy.sh failed on line $LINENO"' ERR

bold "──────────────────────────────────────────────────────────────"
bold " Red5 Studio V2.0 — PROD update"
bold "──────────────────────────────────────────────────────────────"
echo "REPO_DIR     = $REPO_DIR"
echo "NGINX_ROOT   = $NGINX_ROOT"
echo "BACKEND_SVC  = $BACKEND_SVC"
echo

# --- sanity --------------------------------------------------------------
[[ -d "$REPO_DIR/.git" ]]                    || { red "REPO_DIR is not a git checkout"; exit 1; }
[[ -d "$REPO_DIR/frontend/public" ]]         || { red "frontend/public missing in repo"; exit 1; }
[[ -n "$NGINX_ROOT" && -d "$NGINX_ROOT" ]]   || { red "NGINX_ROOT '$NGINX_ROOT' does not exist"; exit 1; }

# --- 1. git pull ---------------------------------------------------------
bold "[1/5] git pull"
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

# --- 2. sync static assets into nginx root --------------------------------
bold "[2/5] rsync frontend/public/  →  $NGINX_ROOT/"
# IMPORTANT: NO --delete  — would wipe CRA's bundled JS/CSS in build/
# --force allows rsync to replace existing non-empty directories with
# symlinks (public/ has assets/docs → ../docs and assets/js → ../js;
# CRA's build/ may have copied those as real dirs on first build).
rsync -ah --force --info=stats1 \
      "$REPO_DIR/frontend/public/" "$NGINX_ROOT/"
echo

# --- 3. restart backend (FastAPI) -----------------------------------------
bold "[3/5] systemctl restart $BACKEND_SVC"
if systemctl list-unit-files | grep -q "^${BACKEND_SVC}\.service"; then
    sudo systemctl restart "$BACKEND_SVC"
    sudo systemctl --no-pager --lines=0 status "$BACKEND_SVC" | head -3
else
    echo "       (skipped — no '$BACKEND_SVC.service' unit found)"
fi
echo

# --- 4. reload nginx -----------------------------------------------------
bold "[4/5] nginx -t && systemctl reload nginx"
sudo nginx -t
sudo systemctl reload nginx
echo

# --- 5. fingerprint deployed setup.html -----------------------------------
bold "[5/5] verify deployed setup.html"
if [[ -f "$NGINX_ROOT/setup.html" ]]; then
    HASH_LINE=$(grep -E 'setup_walk\.compiled\.js' "$NGINX_ROOT/setup.html" | tail -1 || true)
    echo "       served: $HASH_LINE"
    if [[ "$HASH_LINE" == *"?v="* ]]; then
        green "       ✓ cache-busting hash present — deploy looks healthy"
    else
        red   "       ⚠  no ?v= hash found; nginx may be serving a stale copy"
    fi
else
    red   "       setup.html not found in $NGINX_ROOT — check NGINX_ROOT"
fi
echo
green "✓ deploy.sh complete"
