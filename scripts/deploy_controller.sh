#!/usr/bin/env bash
# deploy_controller.sh — one-shot V1.9 controller deploy.
#
# What it does:
#   1. Builds the V1.9 bundle (calls build_bundle.py)
#   2. Uploads the bundle to /api/upload-bundle on the target controller
#   3. Pushes the new app.py to /api/update-app-py  (bootloader bypass,
#      gated by master key, ast-validated server-side, atomic-write)
#   4. POSTs /api/restart-flask to activate the new code
#
# Replaces the old workflow:
#   - Manual bundle upload via /update UI
#   - Manual app.py copy into /root/scripts/ via enteliWEB
#   - Manual stop/start of the registered object
#
# Usage:
#   ./scripts/deploy_controller.sh c1
#   ./scripts/deploy_controller.sh c1 --no-app-py        # bundle + restart only
#   ./scripts/deploy_controller.sh c1 --no-restart       # bundle + app.py, no restart
#   ./scripts/deploy_controller.sh c1 c2 c3 c4           # multiple hosts in one go
#
# Required:
#   - The target controllers must be running app.py >= 2026-05-27 (the
#     version that includes /api/update-app-py and /api/restart-flask).
#     First-time deploy of those endpoints themselves still requires the
#     manual enteliWEB workflow -- after that, every subsequent deploy
#     is one command.
#
# Environment:
#   RED5_MASTER_KEY    Master key (defaults to the value in app.py).  Pass
#                      via env so it doesn't show up in shell history.
#   RED5_DOMAIN        Domain suffix (default: geniusmason.com).  Hosts
#                      get resolved as <name>.<RED5_DOMAIN>.
#
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
V19="$HERE/archive/Red5-Studio-V1.9"

DOMAIN="${RED5_DOMAIN:-geniusmason.com}"
MASTER_KEY="${RED5_MASTER_KEY:-}"

PUSH_APP_PY=1
DO_RESTART=1
HOSTS=()

usage() {
  cat <<EOF
Usage: $0 <host> [<host> ...] [--no-app-py] [--no-restart]

  <host>          Controller name (e.g. c1) -- resolved to <host>.<RED5_DOMAIN>
                  Or a full URL: https://c1.geniusmason.com
  --no-app-py     Skip pushing /root/scripts/app.py (bundle + restart only)
  --no-restart    Skip the final Flask restart (use when batching changes)
  --domain <d>    Override RED5_DOMAIN
  --key <k>       Override RED5_MASTER_KEY (insecure -- prefer env var)

Examples:
  $0 c1
  $0 c1 c2 c3 c4
  RED5_MASTER_KEY='...' $0 c1
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --no-app-py)   PUSH_APP_PY=0; shift ;;
    --no-restart)  DO_RESTART=0; shift ;;
    --domain)      DOMAIN="$2"; shift 2 ;;
    --key)         MASTER_KEY="$2"; shift 2 ;;
    -h|--help)     usage; exit 0 ;;
    -*)            echo "Unknown flag: $1"; usage; exit 1 ;;
    *)             HOSTS+=("$1"); shift ;;
  esac
done

if [[ ${#HOSTS[@]} -eq 0 ]]; then
  usage; exit 1
fi

# Auto-fill master key from app.py if env not set (convenience for the
# common case where you're running this on the same machine that holds
# the source).  Production deploys should always set RED5_MASTER_KEY.
if [[ -z "$MASTER_KEY" ]]; then
  MASTER_KEY="$(grep -oP "MASTER_KEY_CONST\s*=\s*['\"]\K[^'\"]+" "$V19/app.py" || true)"
  if [[ -z "$MASTER_KEY" ]]; then
    echo "ERROR: master key not found in env or app.py"; exit 1
  fi
fi

# --- Step 1: build bundle ------------------------------------------------
echo "==> Building bundle"
( cd "$V19" && python3 build_bundle.py )
BUNDLE="$V19/red5_bundle.zip"
APP_PY="$V19/app.py"
if [[ ! -f "$BUNDLE" ]]; then echo "ERROR: bundle build failed"; exit 1; fi
if [[ ! -f "$APP_PY" ]];  then echo "ERROR: app.py not found"; exit 1; fi

deploy_one() {
  local host="$1"
  local base
  if [[ "$host" == http* ]]; then base="$host"; else base="https://${host}.${DOMAIN}"; fi
  echo
  echo "==> [$host] deploying to $base"

  # 1) Upload bundle (multipart)
  echo "    [1/3] uploading bundle (${BUNDLE##*/})"
  local http
  http=$(curl -sS -o /tmp/red5_upload.json -w "%{http_code}" \
    -F "bundle=@$BUNDLE" \
    -F "password=$MASTER_KEY" \
    "$base/api/upload-bundle") || { echo "    curl failed (network?)"; return 1; }
  if [[ "$http" != "200" ]]; then
    echo "    HTTP $http"; cat /tmp/red5_upload.json; echo; return 1
  fi
  python3 -c "import json,sys; d=json.load(open('/tmp/red5_upload.json')); print('   ', 'ok' if d.get('success') else 'FAIL', '-', d.get('message') or d.get('error'))"

  # 2) Push app.py (optional)
  if [[ $PUSH_APP_PY -eq 1 ]]; then
    echo "    [2/3] pushing /root/scripts/app.py"
    http=$(curl -sS -o /tmp/red5_apppy.json -w "%{http_code}" \
      -H "X-Master-Key: $MASTER_KEY" \
      -F "app_py=@$APP_PY" \
      "$base/api/update-app-py") || { echo "    curl failed"; return 1; }
    if [[ "$http" != "200" ]]; then
      echo "    HTTP $http"; cat /tmp/red5_apppy.json; echo
      echo "    Hint: this endpoint exists in app.py >= 2026-05-27."
      echo "    For older controllers, copy app.py manually via enteliWEB once,"
      echo "    then this command will work on subsequent deploys."
      return 1
    fi
    python3 -c "import json; d=json.load(open('/tmp/red5_apppy.json')); print('   ', 'ok' if d.get('success') else 'FAIL', '-', d.get('message') or d.get('error'), '-', d.get('bytes'), 'bytes')"
  else
    echo "    [2/3] skipped (--no-app-py)"
  fi

  # 3) Hot-reload Flask modules (does NOT kill the process)
  if [[ $DO_RESTART -eq 1 ]]; then
    echo "    [3/3] hot-reloading Flask modules"
    http=$(curl -sS -o /tmp/red5_restart.json -w "%{http_code}" \
      -X POST \
      -H "X-Master-Key: $MASTER_KEY" \
      "$base/api/restart-flask") || { echo "    curl failed"; return 1; }
    if [[ "$http" != "200" ]]; then
      echo "    HTTP $http"; cat /tmp/red5_restart.json; echo; return 1
    fi
    python3 -c "import json; d=json.load(open('/tmp/red5_restart.json')); print('   ', 'ok' if d.get('success') else 'FAIL', '-', len(d.get('reloaded') or []), 'modules reloaded'); fl=d.get('failed') or []; [print('    !! failed to reload:', f) for f in fl]"
    # /api/restart-flask reloads in-place (no process exit), so /api/version
    # should respond immediately -- no wait, no respawn delay.
    http=$(curl -sS -o /tmp/red5_ver.json -w "%{http_code}" "$base/api/version" || echo 000)
    if [[ "$http" == "200" ]]; then
      echo "    /api/version returns 200 -- modules reloaded, process alive."
    else
      echo "    WARNING: /api/version returned $http after reload."
    fi
    echo "    NOTE: NEW @app.route decorators (rare) need a manual"
    echo "          Stop/Start of the app.py object in enteliWEB to register."
  else
    echo "    [3/3] skipped (--no-restart)"
  fi

  echo "==> [$host] done"
}

FAILED=()
for h in "${HOSTS[@]}"; do
  if ! deploy_one "$h"; then
    FAILED+=("$h")
  fi
done

echo
echo "============================================================"
if [[ ${#FAILED[@]} -eq 0 ]]; then
  echo "All ${#HOSTS[@]} deploy(s) succeeded."
else
  echo "Deploys finished with ${#FAILED[@]} failure(s): ${FAILED[*]}"
  exit 1
fi
