#!/usr/bin/env bash
# Pre-compile the dashboard's 20 JSX modules into a SINGLE plain JS bundle.
#
# Why:
#   dashboard.html used to (a) load `@babel/standalone` (3 MB) at runtime,
#   (b) `fetch()` each of the 20 .js sources, (c) concatenate them into a
#   <script type="text/babel"> block, then (d) JIT-transpile.  That cost
#   roughly 4 seconds of first-paint time on Delta Controls hardware.  This
#   offline build does the same concatenation + Babel transform ONCE
#   into /app/frontend/public/dashboard.compiled.js, after which
#   dashboard.html just loads that single file via <script src>.
#
# IMPORTANT — file order matters.  Functions are hoisted but top-level
# `const`/`let` are NOT — so we MUST keep the exact order the runtime
# loader uses (dashboard.html lines 468-489).
#
# Usage:
#   bash /app/frontend/src/dashboard/build.sh

set -euo pipefail
cd "$(dirname "$0")/../.."             # → /app/frontend

PUB=/app/frontend/public
SRC=/app/frontend/src/dashboard
CFG="$SRC/babel.config.json"
# Deterministic temp filename (was `mktemp` -- the random suffix leaked into
# the inline source map and made byte-identical rebuilds impossible).
TMP=/tmp/red5_dashboard_concat.jsx
DST="$PUB/dashboard.compiled.js"

# Mirror of dashboard.html lines 468-489.  Keep IN SYNC.
MODULES=(
    "$PUB/js/psychrometric.js"
    "$PUB/js/dashboard-components.js"
    "$PUB/js/schema-config.js"
    "$PUB/js/preview-components.js"
    "$PUB/js/sun-path.js"
    "$PUB/js/dashboard/dashboard-helpers.js"
    "$PUB/js/dashboard/vav-modal.js"
    "$PUB/js/dashboard/ahu-modal.js"
    "$PUB/js/dashboard/band-clamp-modal.js"
    "$PUB/js/dashboard/weather-settings-modal.js"
    "$PUB/js/dashboard/weather-strip-panel.js"
    "$PUB/js/dashboard/floor-plan-modal.js"
    "$PUB/js/dashboard/collector-config-modal.js"
    "$PUB/js/dashboard/config-auth-modal.js"
    "$PUB/js/dashboard/telemetry-status-badge.js"
    "$PUB/js/dashboard/givoni-tier-legend.js"
    "$PUB/js/dashboard/sweet-spot-slider.js"
    "$PUB/js/dashboard/t-clip-slider.js"
    "$PUB/js/dashboard/sidebar.js"
    "$PUB/js/dashboard/psy-chart-svg.js"
    "$PUB/js/dashboard/app.js"
)

# Concatenate sources with a blank-line separator (same as runtime).
> "$TMP"
for m in "${MODULES[@]}"; do
    if [ ! -f "$m" ]; then
        echo "ERROR: missing source $m" >&2
        exit 1
    fi
    printf '\n/* ===== %s ===== */\n' "${m#$PUB/}" >> "$TMP"
    cat "$m" >> "$TMP"
done

# Babel transform (preset-env + preset-react).
# 2026-06-27: production bundle for embedded Delta controllers.
#   --minified   -- strip whitespace + shorten identifiers
#   --no-comments-- drop JSDoc / banner comments
#   (no --source-maps) -- inline source maps roughly DOUBLE the bundle
#                         and are useless on the controller (no devtools).
# Result: 2.1 MB -> ~380 KB, comfortably under tight flash quotas.
node_modules/.bin/babel \
    --config-file "$CFG" \
    --no-babelrc \
    --minified \
    --no-comments \
    "$TMP" -o "$DST"

rm -f "$TMP"

# Cache-bust dashboard.html's <script src> with a short MD5 of the compiled
# bundle.  Every rebuild produces a new hash → browsers forced to re-fetch.
HASH=$(md5sum "$DST" | cut -c1-10)
sed -i -E "s|(/dashboard\.compiled\.js)(\?v=[a-f0-9]+)?|\1?v=$HASH|g" "$PUB/dashboard.html"
echo "Cache-bust dashboard.html → /dashboard.compiled.js?v=$HASH"

echo "Built $DST  ($(wc -c < "$DST" | awk '{printf "%.1f KB", $1/1024}'),  $(wc -l < "$DST") lines)"
