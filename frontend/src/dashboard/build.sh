#!/usr/bin/env bash
# Pre-compile the dashboard's 21 JSX modules into a SINGLE plain JS bundle.
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
cd "$(dirname "$0")/../.."             # → frontend/

ROOT="$(pwd)"
PUB="$ROOT/public"
SRC="$ROOT/src/dashboard"
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
    "$PUB/js/blind-types.js"
    "$PUB/js/sun-path.js"
    "$PUB/js/elc-sun-path-overlay.js"
    "$PUB/js/dashboard/dashboard-helpers.js"
    "$PUB/js/dashboard/vav-psy-chart.js"
    "$PUB/js/dashboard/vav-modal.js"
    "$PUB/js/dashboard/ahu-modal.js"
    "$PUB/js/dashboard/window-graphic-modal.js"
    "$PUB/js/window-blinds-popout.js"
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
# Babel CLI: local install, else sibling red5-ahu checkout.
if [ -x "$ROOT/node_modules/.bin/babel" ]; then
    BABEL="$ROOT/node_modules/.bin/babel"
elif [ -x "$ROOT/../../red5-ahu/frontend/node_modules/.bin/babel" ]; then
    BABEL="$ROOT/../../red5-ahu/frontend/node_modules/.bin/babel"
else
    echo "ERROR: @babel/cli not found. yarn install in frontend/ or set BABEL=." >&2
    exit 1
fi
"$BABEL" \
    --config-file "$CFG" \
    --no-babelrc \
    --minified \
    --no-comments \
    "$TMP" -o "$DST"

rm -f "$TMP"

# Cache-bust dashboard.html's <script src> with a short MD5 of the compiled
# bundle.  Every rebuild produces a new hash → browsers forced to re-fetch.
# Route the bundle through /api/assets/ -- V1.9 + V2.0 both serve this path
# from /root/data/ and /app/frontend/public/ respectively, so the shared
# dashboard.html works on either backend with zero divergence.
if command -v md5sum >/dev/null 2>&1; then
    HASH=$(md5sum "$DST" | cut -c1-10)
else
    HASH=$(md5 -q "$DST" | cut -c1-10)
fi
sed_inplace() {
    if sed --version >/dev/null 2>&1; then
        sed -i "$@"
    else
        sed -i '' "$@"
    fi
}
# V2.0 / shared: rewrite the simple <script src="...dashboard.compiled.js?v=...">
# tag.  IMPORTANT: do NOT run this regex against V1.9's multi-path boot loader
# strings that end in `?v=' + HASH` — that produced broken
# `?v=<stamp>?v=' + HASH` URLs and left the controller stuck on a stale
# cached bundle (sun-path hour sim looked broken on V1.9 only).
sed_inplace -E "s|src=\"(/api)?/(assets/)?dashboard\.compiled.js(\?v=[a-f0-9]+)?\"|src=\"/api/assets/dashboard.compiled.js?v=$HASH\"|g" "$PUB/dashboard.html"
# V1.9 boot loader (if present in this tree or archives): bump var HASH only.
if grep -q "var HASH = '" "$PUB/dashboard.html" 2>/dev/null; then
    sed_inplace -E "s|var HASH = '[a-f0-9]+'|var HASH = '$HASH'|g" "$PUB/dashboard.html"
fi
echo "Cache-bust dashboard.html → /api/assets/dashboard.compiled.js?v=$HASH"

echo "Built $DST  ($(wc -c < "$DST" | awk '{printf "%.1f KB", $1/1024}'),  $(wc -l < "$DST") lines)"

# ---------------------------------------------------------------------------
# Tailwind pre-extract (2026-06-27).
#   Replaces the ~200 KB cdn.tailwindcss.com runtime JIT with a static CSS
#   file containing ONLY the utility classes actually referenced anywhere
#   under public/.  Trimmed to ~80-90 KB minified (~20 KB gzipped).
#
#   Run AFTER the JS bundle is built so the scanner sees the latest
#   minified class strings; otherwise a fresh utility added today would
#   miss this CSS rebuild and the page would render without it.
#
#   Cache-busts every HTML shell that USED to load the CDN <script>.
# ---------------------------------------------------------------------------
TW_CFG="$SRC/tailwind.config.cjs"
TW_IN="$SRC/tailwind.input.css"
TW_OUT="$PUB/dashboard.tailwind.css"
if [ -f "$TW_CFG" ] && [ -f "$TW_IN" ]; then
    if [ -x "$ROOT/node_modules/.bin/tailwindcss" ]; then
        TW="$ROOT/node_modules/.bin/tailwindcss"
    elif [ -x "$ROOT/../../red5-ahu/frontend/node_modules/.bin/tailwindcss" ]; then
        TW="$ROOT/../../red5-ahu/frontend/node_modules/.bin/tailwindcss"
    else
        TW=""
    fi
    if [ -n "$TW" ]; then
        "$TW" \
            -c "$TW_CFG" \
            -i "$TW_IN" \
            -o "$TW_OUT" \
            --minify 2>&1 | grep -vE '^(Browserslist|  npx |  Why |Rebuilding|Done in|$)' || true
        if command -v md5sum >/dev/null 2>&1; then
            TW_HASH=$(md5sum "$TW_OUT" | cut -c1-10)
        else
            TW_HASH=$(md5 -q "$TW_OUT" | cut -c1-10)
        fi
        for HTML in dashboard.html setup.html landing.html equipment_mapper.html sun_preview.html update.html; do
            TARGET="$PUB/$HTML"
            [ -f "$TARGET" ] || continue
            sed_inplace -E 's|<script src="https://cdn\.tailwindcss\.com"></script>|<link rel="stylesheet" href="/api/assets/dashboard.tailwind.css">|g' "$TARGET"
            sed_inplace -E "s|/api/assets/dashboard\.tailwind\.css(\?v=[a-f0-9]+)?|/api/assets/dashboard.tailwind.css?v=$TW_HASH|g" "$TARGET"
        done
        echo "Built $TW_OUT  ($(wc -c < "$TW_OUT" | awk '{printf "%.1f KB", $1/1024}'))   cache-bust v=$TW_HASH"
    else
        echo "WARN: tailwindcss CLI not found -- CSS rebuild skipped"
    fi
else
    echo "WARN: Tailwind extract config / input missing ($TW_CFG / $TW_IN) -- CSS rebuild skipped"
fi
