# Red5 Studio V1.9 — Update Runbook (Refactor Sync)

> **Use this when**: you already have V1.9 running on a Delta Controls / enteliWEB
> controller (or any Flask host loading `red5_bundle.zip`), and you want to
> push the latest modularized frontend (`js/dashboard/` — 16 ES-style files)
> plus any other source changes since your last bundle.
>
> **Downtime**: zero. Plug-in `.py` modules hot-reload on the controller;
> static `.html`/`.js` files are atomic-replace.
> **Safe to re-run**: yes. Every upload is idempotent (tmp+rename).

V1.9 has only ONE structural change since the last deploy:
the inline React block in `dashboard.html` was split into 16 modules under
`js/dashboard/`. The controller doesn't care — `build_bundle.py` already
walks the whole `js/` tree (`SUBDIR_TREES = ['js', 'configs', 'docs']`),
so the new files get into the zip automatically. You just need to **rebuild
the bundle and re-push it**.

Backend `.py` services (`upload_service.py`, `weather_service.py`,
`band_service.py`, etc.) are unchanged structurally — same files, same
locations — but rebuilding the bundle picks up any line-level fixes too.

---

## Phase 0 — Where you do this from

`build_bundle.py` runs on whatever box owns `/app/archive/Red5-Studio-V1.9/`.
That's the Emergent preview environment by default. The output
`red5_bundle.zip` is then either:

1. **Pushed via the preview's `/red5_bundle.zip` URL** through the
   controller's Repair Mode (recommended — single command, ~30 s), or
2. **Uploaded manually via enteliWEB → File Transfer**, or
3. **scp'd to the controller** if SSH is available.

You'll find your controller's IP/port in your browser's address bar when
you're on `/update` (e.g. `http://219.79.12.63:5001`).

---

## Phase 1 — Rebuild the bundle (15 seconds)

In the Emergent preview container (or wherever the V1.9 source tree lives):

```bash
cd /app/archive/Red5-Studio-V1.9
python3 build_bundle.py
```

Expected output:
```
============================================================
Built /app/archive/Red5-Studio-V1.9/red5_bundle.zip
  size:    ~2.2 MB
  files:   ~120
  skipped: <tests/ noise>
============================================================
```

**CHECKPOINT 1** — verify the new `js/dashboard/` modules are inside the zip:

```bash
unzip -l red5_bundle.zip | grep 'js/dashboard/' | wc -l
# Expect: 16
unzip -l red5_bundle.zip | grep -c 'js/dashboard/app.js'
# Expect: 1
unzip -l red5_bundle.zip | wc -l
# Expect: >100 entries
```

If `js/dashboard/` count is 0, parity drifted — `js/dashboard/` is missing
from `/app/archive/Red5-Studio-V1.9/`. Restore parity from
`/app/frontend/public/js/dashboard/`:

```bash
rsync -avh --delete /app/frontend/public/js/dashboard/ \
                    /app/archive/Red5-Studio-V1.9/js/dashboard/
# also keep the master dashboard.html in sync
cp /app/frontend/public/dashboard.html /app/archive/Red5-Studio-V1.9/dashboard.html

# checksum-verify (must print 'OK' for every file)
( cd /app/frontend/public           && md5sum js/dashboard/*.js dashboard.html ) > /tmp/v2.md5
( cd /app/archive/Red5-Studio-V1.9  && md5sum -c /tmp/v2.md5 )
```

Then re-run `python3 build_bundle.py` and re-check the unzip count.

---

## Phase 2 — Snapshot the controller (optional but cheap)

If your controller exposes `/api/repair/list-plugins` or you have SSH:

```bash
# Via Repair Mode list endpoint (read-only)
curl -s http://YOUR.CONTROLLER.IP:PORT/api/repair/list-plugins | \
    python3 -m json.tool > /tmp/plugins-before-$(date +%Y%m%d-%H%M%S).json

# Or, if SSH'd onto the controller:
sudo tar -czf /root/data-backup-$(date +%Y%m%d-%H%M%S).tar.gz /root/data/
```

You don't strictly need this — every upload is atomic and the controller
keeps the old file in `*.bak` for ~24 h — but it's nice to have a manual
rollback target.

---

## Phase 3 — Push the bundle

Pick whichever matches your controller's connectivity.

### Option A — One-shot via Repair Mode (preferred)

The pre-existing `deploy_all.sh` only covers the top-level plug-in `.py`
files + static HTML — it does NOT walk `js/dashboard/`. To push EVERYTHING
in the new bundle, upload the zip itself and let the controller's extractor
unpack it.

If your controller supports zip-extract upload:
```bash
SOURCE=https://controller-dashboard-2.preview.emergentagent.com   # your preview URL
CONTROLLER=http://YOUR.CONTROLLER.IP:PORT

# Download the freshly-built zip from the preview
curl -fsS -o /tmp/red5_bundle.zip "$SOURCE/red5_bundle.zip"
ls -la /tmp/red5_bundle.zip        # confirm size matches the build output

# Push via the bundle-upload endpoint
curl -fsS -X POST "$CONTROLLER/api/repair/upload-bundle" \
     -F "file=@/tmp/red5_bundle.zip" \
     -F "filename=red5_bundle.zip"
# Expect: {"success": true, "extracted": 120, ...}
```

If your controller only exposes per-file upload (`/api/repair/upload-plugin`),
use this loop to push every modular JS file individually:

```bash
SOURCE=https://controller-dashboard-2.preview.emergentagent.com
CONTROLLER=http://YOUR.CONTROLLER.IP:PORT
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

# Pull the 16 modular JS files + dashboard.html + the legacy single-file plugins
MODULES="app.js ahu-modal.js band-clamp-modal.js collector-config-modal.js \
         config-auth-modal.js dashboard-helpers.js floor-plan-modal.js \
         givoni-tier-legend.js psy-chart-svg.js sidebar.js \
         sweet-spot-slider.js t-clip-slider.js telemetry-status-badge.js \
         vav-modal.js weather-settings-modal.js weather-strip-panel.js"

for m in $MODULES; do
    src="js/dashboard/$m"
    dest="$TMP/$src"
    mkdir -p "$(dirname "$dest")"
    curl -fsS -o "$dest" "$SOURCE/$src"
    curl -fsS -X POST "$CONTROLLER/api/repair/upload-plugin" \
         -F "file=@$dest" -F "filename=$src" >/dev/null && \
         echo "OK  $src"
done

# And the dashboard shell that <script>-includes them
curl -fsS -o "$TMP/dashboard.html" "$SOURCE/dashboard.html"
curl -fsS -X POST "$CONTROLLER/api/repair/upload-plugin" \
     -F "file=@$TMP/dashboard.html" -F "filename=dashboard.html"
```

Then re-run the existing one-shot for the backend services:
```bash
curl -s "$SOURCE/deploy_all.sh" | CONTROLLER="$CONTROLLER" sh
```

### Option B — enteliWEB File Transfer (manual GUI)

1. Log into enteliWEB → your controller → Tools → File Transfer.
2. Upload `red5_bundle.zip` to `/root/data/`.
3. SSH into the controller (or use the embedded shell) and run:
   ```bash
   cd /root/data
   unzip -o red5_bundle.zip
   # Plug-in .py files go to /root/data/pgpy automatically via upload_service
   # — but a manual unzip drops them at /root/data/.  Move them:
   mv -f *.py pgpy/ 2>/dev/null
   # Restart Flask only if you bypassed upload_service:
   systemctl restart red5 2>/dev/null || pkill -f 'python.*app.py'
   ```

### Option C — Direct scp (controllers with SSH)

```bash
scp /app/archive/Red5-Studio-V1.9/red5_bundle.zip root@CTRL:/root/data/
ssh root@CTRL 'cd /root/data && unzip -o red5_bundle.zip && mv -f *.py pgpy/ 2>/dev/null'
```

---

## Phase 4 — Verify

Hard-refresh the controller's dashboard (`http://CTRL/dashboard.html`) with
`Ctrl-F5` to bust the browser cache.

| Check | Where | Expected |
|---|---|---|
| Dashboard renders | / or /dashboard.html | full UI, no blank screen |
| No 404s | DevTools → Network | every `/js/dashboard/*.js` returns 200 |
| AHU pill click → modal | top dashboard | `ahu-modal.js` opens |
| Band-clamp modal | Bands → row | `band-clamp-modal.js` opens |
| Floor plan tab | Floor Plan button | renders |
| Weather settings | gear icon | `weather-settings-modal.js` opens |
| Psy chart SVG | 3D WX tab → 2D toggle | renders |
| Telemetry alive | `/api/telemetry/...` | data flowing (`telemetry-status-badge.js` green) |
| Repair Mode | /update | 16+ plug-in rows + Data Bridges card |

Any 404 on `/js/dashboard/*.js` means the bundle didn't extract there.
Confirm with:
```bash
ssh root@CTRL 'ls /root/data/js/dashboard/ | wc -l'
# Expect: 16
```
If 0, re-run Phase 3 (the per-file Option A loop is most reliable here).

---

## Phase 5 — Rollback

V1.9 doesn't have a built-in version pin — each upload is the current
version. To revert:

```bash
# If you took the Phase 2 SSH snapshot:
ssh root@CTRL 'cd / && tar -xzf /root/data-backup-20260525-1430.tar.gz'
ssh root@CTRL 'pkill -f "python.*app.py"'    # bootloader respawns app.py

# If you don't have a snapshot, re-build red5_bundle.zip from a git-checkout
# of the prior commit and push it again:
cd /app/archive/Red5-Studio-V1.9
git log --oneline | head -10          # find the SHA before the refactor
git checkout <SHA> -- .               # CAREFUL: scoped to this dir only
python3 build_bundle.py
# … push as Phase 3 …
git checkout HEAD -- .                # back to current
```

---

## Quick reference — single-command refresh (idempotent)

Once you've done the above end-to-end once and confirmed it works, a routine
"sync everything from preview to controller" looks like this:

```bash
# 1. Rebuild bundle on the dev side
( cd /app/archive/Red5-Studio-V1.9 && python3 build_bundle.py )

# 2. Push every changed file (the existing deploy_all.sh handles the 15
#    legacy paths; the loop below covers the new modular JS)
SOURCE=https://controller-dashboard-2.preview.emergentagent.com
CONTROLLER=http://YOUR.CONTROLLER.IP:PORT
curl -s "$SOURCE/deploy_all.sh" | CONTROLLER="$CONTROLLER" sh

# 3. Then sync the new js/dashboard/ tree
TMP=$(mktemp -d) && trap 'rm -rf "$TMP"' EXIT
for m in app.js ahu-modal.js band-clamp-modal.js collector-config-modal.js \
         config-auth-modal.js dashboard-helpers.js floor-plan-modal.js \
         givoni-tier-legend.js psy-chart-svg.js sidebar.js \
         sweet-spot-slider.js t-clip-slider.js telemetry-status-badge.js \
         vav-modal.js weather-settings-modal.js weather-strip-panel.js; do
    f="js/dashboard/$m"
    mkdir -p "$TMP/$(dirname "$f")"
    curl -fsS -o "$TMP/$f" "$SOURCE/$f"
    curl -fsS -X POST "$CONTROLLER/api/repair/upload-plugin" \
         -F "file=@$TMP/$f" -F "filename=$f" >/dev/null && echo "OK $f"
done
```

Save the second half (Phase 3 Option A loop) as `deploy_dashboard_modules.sh`
next to `deploy_all.sh` for next time.

---

## What changed under the hood (FYI)

- `js/dashboard/app.js` is now the entrypoint (~2287 lines, down from
  4200+). It `<script>`-loads 15 sibling modules at boot.
- Each modal/panel/component is a standalone file:
  `ahu-modal.js`, `vav-modal.js`, `band-clamp-modal.js`,
  `collector-config-modal.js`, `config-auth-modal.js`, `floor-plan-modal.js`,
  `weather-settings-modal.js`, `weather-strip-panel.js`,
  `givoni-tier-legend.js`, `psy-chart-svg.js`, `sidebar.js`,
  `dashboard-helpers.js`, `sweet-spot-slider.js`, `t-clip-slider.js`,
  `telemetry-status-badge.js`.
- Backend `.py` service files are unchanged in name/location — V1.9 stays
  Flask-monolithic on purpose (the controller's bootloader expects flat
  plug-in files in `/root/data/pgpy/`).
- The V1.9/V2.0/frontend-public parity rule still applies: any HTML/JS edit
  must be mirrored across all three trees and the V1.9 bundle rebuilt.

---

*End of V1.9 update runbook.*
