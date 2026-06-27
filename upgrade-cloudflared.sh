#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# upgrade-cloudflared.sh — safely upgrade cloudflared on the PROD server.
#
# Why:
#   Older cloudflared versions (< 2026.6.0) carry a quic-go regression that
#   crashes the datagram-manager goroutine under sustained QUIC traffic,
#   manifesting on the dashboard as periodic Cloudflare Error 1033
#   ("tunnel not connected to Cloudflare's network").  The fix shipped in
#   2026.6.0 (TUN-10630 + revert of TUN-10557 quic-go bump).
#
# What this does:
#   [1] Reads the currently-installed cloudflared version.
#   [2] If already at TARGET (default 2026.6.0) or newer → exits clean.
#   [3] Otherwise downloads the matching linux-amd64 / linux-arm64 binary
#       straight from GitHub Releases (no package-manager dependency, so it
#       works on Debian, Ubuntu, RHEL, Alpine, …).
#   [4] Backs up the current binary to /usr/local/bin/cloudflared.<old-ver>
#       before swapping it in (one-line rollback if needed).
#   [5] Restarts the `cloudflared` systemd service (if present) so the new
#       binary is actually running.
#   [6] Verifies the version reported by `cloudflared --version` matches
#       TARGET, otherwise refuses to declare success.
#
# Usage (run on the PROD server as root or with sudo):
#       sudo ~/red5-studio/upgrade-cloudflared.sh
#
# Override target version / arch if you need to pin to something specific:
#       TARGET=2026.6.0 ARCH=arm64 sudo ./upgrade-cloudflared.sh
#
# Rollback (revert to the binary that was running before the upgrade):
#       sudo mv /usr/local/bin/cloudflared.<old-ver> /usr/local/bin/cloudflared
#       sudo systemctl restart cloudflared
# ---------------------------------------------------------------------------

set -euo pipefail

# --- config ----------------------------------------------------------------
TARGET="${TARGET:-2026.6.0}"
BIN_PATH="${BIN_PATH:-/usr/local/bin/cloudflared}"
SERVICE_NAME="${SERVICE_NAME:-cloudflared}"

# Detect CPU arch automatically if not overridden.
if [ -z "${ARCH:-}" ]; then
    case "$(uname -m)" in
        x86_64|amd64)   ARCH="amd64" ;;
        aarch64|arm64)  ARCH="arm64" ;;
        armv7l|armv6l)  ARCH="arm" ;;
        *) echo "ERROR: unsupported CPU arch '$(uname -m)'. Set ARCH=amd64|arm64|arm manually." >&2; exit 1 ;;
    esac
fi

DL_URL="https://github.com/cloudflare/cloudflared/releases/download/${TARGET}/cloudflared-linux-${ARCH}"

# --- helpers ---------------------------------------------------------------
log()  { printf "\033[1;36m[cf-upgrade]\033[0m %s\n" "$*"; }
warn() { printf "\033[1;33m[cf-upgrade]\033[0m %s\n" "$*" >&2; }
die()  { printf "\033[1;31m[cf-upgrade]\033[0m %s\n" "$*" >&2; exit 1; }

# Tolerant version compare: returns 0 if $1 >= $2 (semver-ish CalVer).
ver_ge() { [ "$(printf '%s\n%s\n' "$1" "$2" | sort -V | head -n1)" = "$2" ]; }

require_root() {
    if [ "$(id -u)" -ne 0 ]; then
        die "Run this script with sudo (it writes to ${BIN_PATH} + restarts ${SERVICE_NAME})."
    fi
}

# --- main ------------------------------------------------------------------
require_root

log "Target version : ${TARGET}"
log "Target arch    : ${ARCH}"
log "Binary path    : ${BIN_PATH}"
log "Service name   : ${SERVICE_NAME}"
log "Download URL   : ${DL_URL}"

# [1] Detect current version (or treat as 0 if cloudflared is not installed).
if command -v cloudflared >/dev/null 2>&1; then
    CUR_VER="$(cloudflared --version 2>/dev/null | awk '{for(i=1;i<=NF;i++) if($i ~ /^[0-9]+\.[0-9]+\.[0-9]+$/){print $i; exit}}')"
    CUR_VER="${CUR_VER:-unknown}"
    log "Current version: ${CUR_VER}"
else
    CUR_VER="not-installed"
    log "cloudflared is not installed yet — performing a clean install."
fi

# [2] Skip if already at target or newer.
if [ "${CUR_VER}" != "not-installed" ] && [ "${CUR_VER}" != "unknown" ]; then
    if ver_ge "${CUR_VER}" "${TARGET}"; then
        log "Already at ${CUR_VER} (>= ${TARGET}). Nothing to do."
        exit 0
    fi
fi

# [3] Download new binary into a tmp file first.
TMP_BIN="$(mktemp --tmpdir cloudflared-XXXXXX)"
trap 'rm -f "${TMP_BIN}"' EXIT

log "Downloading ${TARGET} (${ARCH})..."
if ! curl --fail --silent --show-error --location \
        --connect-timeout 15 --max-time 180 \
        -o "${TMP_BIN}" "${DL_URL}"; then
    die "Download failed. Check network + that ${DL_URL} exists (try the URL in a browser)."
fi

# Sanity: file should be > 5 MB and ELF.
SZ="$(stat -c%s "${TMP_BIN}" 2>/dev/null || stat -f%z "${TMP_BIN}" 2>/dev/null || echo 0)"
if [ "${SZ}" -lt 5000000 ]; then
    die "Downloaded binary is suspiciously small (${SZ} bytes). Aborting; old binary untouched."
fi
if ! head -c4 "${TMP_BIN}" | grep -q $'\x7fELF'; then
    die "Downloaded file is not an ELF binary. Aborting; old binary untouched."
fi
chmod +x "${TMP_BIN}"

# [4] Quick smoke-test: the new binary should print TARGET as its version.
NEW_REPORTED="$("${TMP_BIN}" --version 2>/dev/null | awk '{for(i=1;i<=NF;i++) if($i ~ /^[0-9]+\.[0-9]+\.[0-9]+$/){print $i; exit}}')"
if [ "${NEW_REPORTED}" != "${TARGET}" ]; then
    die "New binary reports version '${NEW_REPORTED}' (expected '${TARGET}'). Aborting; old binary untouched."
fi
log "New binary self-reports as ${NEW_REPORTED} ✔"

# [5] Back up the current binary (if any) and install the new one atomically.
if [ -f "${BIN_PATH}" ] && [ "${CUR_VER}" != "not-installed" ]; then
    BACKUP="${BIN_PATH}.${CUR_VER}.bak"
    log "Backing up ${BIN_PATH} → ${BACKUP}"
    cp -p "${BIN_PATH}" "${BACKUP}"
fi
log "Installing new binary..."
install -m 0755 "${TMP_BIN}" "${BIN_PATH}"

# [6] Restart the service so the new binary is actually running.
if systemctl list-unit-files 2>/dev/null | grep -q "^${SERVICE_NAME}\.service"; then
    log "Restarting systemd service: ${SERVICE_NAME}"
    systemctl restart "${SERVICE_NAME}"
    sleep 2
    if systemctl is-active --quiet "${SERVICE_NAME}"; then
        log "Service ${SERVICE_NAME} is active ✔"
    else
        warn "Service ${SERVICE_NAME} did not come back active. Showing last 20 log lines:"
        journalctl -u "${SERVICE_NAME}" -n 20 --no-pager >&2 || true
        die "cloudflared service failed to start. Roll back with: mv ${BIN_PATH}.${CUR_VER}.bak ${BIN_PATH} && systemctl restart ${SERVICE_NAME}"
    fi
else
    warn "No systemd service '${SERVICE_NAME}.service' found."
    warn "If you run cloudflared a different way (sysvinit, supervisord, tmux, manual nohup, ...) you need to restart it yourself."
fi

# [7] Final verification.
FINAL_VER="$(cloudflared --version 2>/dev/null | awk '{for(i=1;i<=NF;i++) if($i ~ /^[0-9]+\.[0-9]+\.[0-9]+$/){print $i; exit}}')"
if [ "${FINAL_VER}" = "${TARGET}" ]; then
    log "Upgrade complete. cloudflared is now ${FINAL_VER}."
    log "If a backup was made it lives at: ${BIN_PATH}.${CUR_VER}.bak"
else
    die "Upgrade reported version '${FINAL_VER}' (expected '${TARGET}'). Something is off — investigate manually."
fi
