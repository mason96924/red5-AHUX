# Cloudflared Upgrade — 2026.6.0 (Datagram-Manager / Error 1033 Fix)

## TL;DR

```bash
ssh prod
cd ~/red5-studio && git pull
sudo ./upgrade-cloudflared.sh
```

The script is idempotent — if cloudflared is already at 2026.6.0 (or
newer) it prints "Nothing to do" and exits clean. Safe to re-run after
every deploy.

---

## Why this upgrade matters

Versions of `cloudflared` released before **2026.6.0** ship with a
regressed `quic-go` (v0.59.1) that intermittently crashes the
datagram-manager goroutine under sustained QUIC traffic.  On the
dashboard this surfaces as **Cloudflare Error 1033** ("tunnel not
connected to Cloudflare's network") — the tunnel goes Inactive for
~30–90s until cloudflared restarts itself.

**2026.6.0** (released **2026-06-18**) ships two fixes that together
close the issue:

1. **TUN-10630** — fixes a pre-check protocol override that prevented
   the new automated connectivity probe (added in 2026.5.2) from
   recovering when QUIC was unhealthy.
2. **Revert of TUN-10557** — backs out the bad quic-go bump.

After this upgrade the tunnel stays healthy across long periods of
heavy psychrometric chart traffic (verified against the upstream
release notes; user-side verification recommended over the first
24 h).

---

## What the upgrade script does

| Step | Action                                                             |
| ---: | ------------------------------------------------------------------ |
| 1    | `cloudflared --version` → detect current version                   |
| 2    | If already ≥ TARGET (default 2026.6.0) → exit clean                |
| 3    | Auto-detect CPU arch (amd64 / arm64 / arm)                         |
| 4    | Download the matching linux binary from GitHub Releases            |
| 5    | Sanity-check the download (size > 5 MB, ELF magic, version match)  |
| 6    | Back up the current binary to `<path>.<old-version>.bak`           |
| 7    | `install -m 0755` the new binary atomically                        |
| 8    | `systemctl restart cloudflared` + verify the service stays active  |
| 9    | `cloudflared --version` again → confirm reported version = TARGET  |

If any check fails the script aborts BEFORE replacing the running
binary, so the tunnel never enters a half-upgraded state.

---

## Rollback

If the new binary misbehaves (extremely unlikely — 2026.6.0 is the
stable release Cloudflare's own infra runs on), roll back instantly:

```bash
sudo mv /usr/local/bin/cloudflared.<old-version>.bak /usr/local/bin/cloudflared
sudo systemctl restart cloudflared
cloudflared --version  # should report the old version
```

---

## Environment overrides

| Variable        | Default                          | Purpose                                             |
| --------------- | -------------------------------- | --------------------------------------------------- |
| `TARGET`        | `2026.6.0`                       | Pin to a specific version (e.g. for canary tests).  |
| `ARCH`          | auto (`uname -m`)                | Force `amd64` / `arm64` / `arm` if detection fails. |
| `BIN_PATH`      | `/usr/local/bin/cloudflared`     | Where cloudflared is installed on this host.        |
| `SERVICE_NAME`  | `cloudflared`                    | Override if the systemd unit has a different name.  |

Example — install a specific older version explicitly:

```bash
sudo TARGET=2026.5.2 ./upgrade-cloudflared.sh
```

---

## Verifying the fix worked

After the upgrade is in place, monitor the tunnel for an hour or two:

```bash
# Live tunnel log (look for clean reconnects + no Error 1033)
sudo journalctl -u cloudflared -f

# One-shot health view
cloudflared tunnel list
# All tunnels should show:  Status: HEALTHY  Connectors: 4
```

If you still see periodic 1033s, capture 10 minutes of cloudflared
logs and ping back — the residual cause is almost always an MTU /
firewall issue at the network edge, not the binary itself.
