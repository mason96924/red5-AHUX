#!/bin/sh
# deploy_all.sh — one-shot deploy of every controller-side file via Repair Mode.
#
# USAGE:
#   curl -s https://controller-dashboard-2.preview.emergentagent.com/deploy_all.sh \
#     | CONTROLLER=http://YOUR.CONTROLLER.IP:PORT sh
#
# Replace YOUR.CONTROLLER.IP:PORT with what's in your browser's address bar
# when you're on /update — for example: http://219.79.12.63:5001
#
# The script downloads each fresh file from the cloud preview, then POSTs it
# to your controller's /api/repair/upload-plugin endpoint.  Each upload is
# atomic (tmp+rename), and Python plug-ins are auto hot-reloaded after upload
# so no Flask restart is needed.  Total ~14 files, 1.5 MB, 30 seconds.
#
# Safe to re-run.  Each upload is idempotent.

set -e

SOURCE="${SOURCE:-https://controller-dashboard-2.preview.emergentagent.com}"
CONTROLLER="${CONTROLLER:?CONTROLLER env var required, e.g. CONTROLLER=http://219.79.12.63:5001}"

# Strip trailing slash
SOURCE="${SOURCE%/}"
CONTROLLER="${CONTROLLER%/}"

# Files to deploy.  Plug-ins land in /root/data/pgpy via the allow-list;
# UI/static files land in /root/data; configs/bridges.json into /root/data/configs.
#
# IMPORTANT: upload_service.py is uploaded FIRST.  Today's release expands the
# allow-list to accept band_overrides_service.py and dashboard.compiled.js,
# so we must update upload_service.py before pushing those two.
FILES="
upload_service.py
weather_service.py
band_service.py
band_overrides_service.py
telemetry_service.py
_bridges_lib.py
bridges_admin_service.py
webhook_bridge_service.py
mqtt_bridge_service.py
modbus_bridge_service.py
ws_bridge_service.py
update.html
dashboard.html
dashboard.compiled.js
equipment_mapper.html
data_bridges_guide.md
configs/bridges.json
"

TMP="$(mktemp -d -t red5-deploy.XXXXXX)"
trap 'rm -rf "$TMP"' EXIT

echo ""
echo "==========================================================="
echo "Red5 one-shot deploy"
echo "  source     : $SOURCE"
echo "  controller : $CONTROLLER"
echo "  workdir    : $TMP"
echo "==========================================================="
echo ""

# Step 1: download
echo "--- Downloading $(echo "$FILES" | grep -c .) files from cloud ---"
for f in $FILES; do
    dest="$TMP/$f"
    mkdir -p "$(dirname "$dest")"
    if ! curl -fsS -o "$dest" "$SOURCE/$f"; then
        echo "  FAIL: could not download $f"
        exit 1
    fi
    bytes=$(wc -c < "$dest" | tr -d ' ')
    printf "  + %-32s  %s bytes\n" "$f" "$bytes"
done
echo ""

# Step 2: upload via Repair Mode
echo "--- Uploading via /api/repair/upload-plugin ---"
ok=0
fail=0
for f in $FILES; do
    src="$TMP/$f"
    resp="$(curl -fsS -X POST "$CONTROLLER/api/repair/upload-plugin" \
                  -F "file=@$src" -F "filename=$f" 2>&1 || echo 'CURL_FAIL')"
    if echo "$resp" | grep -q '"success": true'; then
        printf "  OK  %s\n" "$f"
        ok=$((ok + 1))
    else
        printf "  FAIL %s\n       %s\n" "$f" "$resp"
        fail=$((fail + 1))
    fi
done

echo ""
echo "==========================================================="
echo "Deploy complete:  $ok ok,  $fail failed"
echo "==========================================================="
echo ""
if [ "$fail" = 0 ]; then
    echo "All files deployed.  Open /update in your browser, hard-refresh,"
    echo "and you should see all 16 Repair Mode rows + the Data Bridges card"
    echo "with live bridge state.  No Flask restart needed — modules were"
    echo "hot-reloaded after each upload."
fi
