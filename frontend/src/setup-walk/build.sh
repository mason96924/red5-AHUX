#!/usr/bin/env bash
# Pre-compile /app/frontend/src/setup-walk/setup_walk.jsx  →
#                /app/frontend/public/setup_walk.compiled.js
#
# Run from /app/frontend/ so node_modules/.bin/babel resolves.
#
# Why a separate compile?  setup.html used to load
#   <script src="https://unpkg.com/@babel/standalone…/babel.min.js"></script>
# and a 3-MB Babel runtime had to JIT every JSX block on first paint.
# Babel/JSX is now compiled once, offline, into a plain ES module.
#
# Also rebuilds dashboard.tailwind.css (2026-02): setup_walk.jsx uses
# arbitrary Tailwind classes (text-[15px], min-h-[88px], etc.) that the
# Tailwind JIT only emits if it scans the JSX source.  Without a rebuild
# of the static dashboard.tailwind.css after editing setup_walk.jsx,
# new arbitrary utilities silently render as defaults in PROD.  This
# step keeps the CSS in sync with the JSX automatically.

set -euo pipefail
cd "$(dirname "$0")/../.."             # → /app/frontend

SRC=/app/frontend/src/setup-walk/setup_walk.jsx
DST=/app/frontend/public/setup_walk.compiled.js
CFG=/app/frontend/src/setup-walk/babel.config.json

node_modules/.bin/babel \
    --config-file "$CFG" \
    --no-babelrc \
    --source-maps inline \
    "$SRC" -o "$DST"

# Cache-bust the <script src> in setup.html with a short MD5 of the compiled
# bundle.  Every rebuild produces a new hash → browser is forced to re-fetch.
HASH=$(md5sum "$DST" | cut -c1-10)
sed -i -E "s|(/setup_walk\.compiled\.js)(\?v=[a-f0-9]+)?|\1?v=$HASH|g" /app/frontend/public/setup.html
echo "Cache-bust setup.html → /setup_walk.compiled.js?v=$HASH"

# Tiny size readout so the operator can sanity-check the build.
echo "Built $DST  ($(wc -c < "$DST" | awk '{printf "%.1f KB", $1/1024}'),  $(wc -l < "$DST") lines)"

# --- Tailwind rebuild (2026-02) ---------------------------------------------
# The legacy dashboard.tailwind.css is shared by dashboard.html, setup.html,
# landing.html, equipment_mapper.html, sun_preview.html, update.html.  Any
# arbitrary utility class introduced inside setup_walk.jsx needs to be
# scanned + emitted; otherwise it silently renders as a default.  Use the
# same config as /app/frontend/src/dashboard/build.sh so the two scripts
# stay in lock-step (single source of truth for the legacy bundle).
TW_CFG=/app/frontend/src/dashboard/tailwind.config.cjs
TW_IN=/app/frontend/src/dashboard/tailwind.input.css
TW_OUT=/app/frontend/public/dashboard.tailwind.css
if [ -f "$TW_CFG" ] && [ -f "$TW_IN" ]; then
    node_modules/.bin/tailwindcss \
        --config "$TW_CFG" \
        -i "$TW_IN" \
        -o "$TW_OUT" \
        --minify 2>&1 | grep -vE '^(Browserslist|  npx |  Why |Rebuilding|Done in|$)' || true

    TW_HASH=$(md5sum "$TW_OUT" | cut -c1-10)
    # Same HTML shells dashboard/build.sh updates -- swap CDN <script> for
    # a static <link> and refresh the ?v= cache-bust.  Idempotent.
    for HTML in dashboard.html setup.html landing.html equipment_mapper.html sun_preview.html update.html; do
        TARGET=/app/frontend/public/$HTML
        [ -f "$TARGET" ] || continue
        sed -i -E 's|<script src="https://cdn\.tailwindcss\.com"></script>|<link rel="stylesheet" href="/api/assets/dashboard.tailwind.css">|g' "$TARGET"
        sed -i -E "s|/api/assets/dashboard\.tailwind\.css(\?v=[a-f0-9]+)?|/api/assets/dashboard.tailwind.css?v=$TW_HASH|g" "$TARGET"
    done
    echo "Built $TW_OUT  ($(wc -c < "$TW_OUT" | awk '{printf "%.1f KB", $1/1024}'))   cache-bust v=$TW_HASH"
else
    echo "WARN: Tailwind extract config / input missing ($TW_CFG / $TW_IN) -- CSS rebuild skipped"
fi
