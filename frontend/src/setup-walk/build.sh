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

# Tiny size readout so the operator can sanity-check the build.
echo "Built $DST  ($(wc -c < "$DST" | awk '{printf "%.1f KB", $1/1024}'),  $(wc -l < "$DST") lines)"
