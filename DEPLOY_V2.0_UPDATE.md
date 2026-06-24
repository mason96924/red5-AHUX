# Red5 Studio V2.0 — Update Runbook (Refactor Sync)

> **Use this when**: you already have V2.0 deployed per `docs/DEPLOY_V2.0.md`
> (or `PC_LINUX_DEPLOY.md` + `PC_LINUX_BACKEND_DEPLOY.md`) and you want to
> pull in the latest refactored backend (`routes/`, `models/`, `simulator/`)
> and the modularized frontend (`js/dashboard/`).
>
> **Downtime**: ~30 seconds for backend restart, zero for frontend (atomic
> rsync).
> **Safe to re-run**: yes. Every step is idempotent.

The two structural changes since your last deploy:

| Area | Before | After |
|---|---|---|
| Backend | one ~2400-line `server.py` | thin `server.py` (~575 lines) + `routes/` (11 files) + `models/` (5 files) + `simulator/` |
| Frontend | one ~4200-line inline block in `dashboard.html`/`app.js` | `app.js` (~2287 lines) + `js/dashboard/` (16 ES-style modules) |

No new env vars. No DB migration. No new Python dependency. `requirements.txt`
is unchanged from the last deploy.

---

## Phase 0 — Snapshot before you touch anything (60 s)

On the prod server:

```bash
TS=$(date +%Y%m%d-%H%M%S)
sudo -u newborn cp -r /home/red5-studio/backend  /home/red5-studio/backend.$TS
sudo -u newborn cp -r /home/red5-studio/frontend /home/red5-studio/frontend.$TS

# Mongo (only if you're paranoid — schema didn't change, but cheap insurance)
mkdir -p /home/newborn/mongo-dumps
mongodump --uri "mongodb://localhost:27017" --db red5_v2_prod \
          --out /home/newborn/mongo-dumps/$TS
```

Write `$TS` down — you'll need it if you need to roll back in Phase 6.

---

## Phase 1 — Push the refactored backend

The new layout adds three sibling folders next to `server.py`. They MUST all
land together; `server.py` imports from them at boot.

### 1.1 From your dev box (or via `git pull` if you `Save to GitHub`'d)

```bash
# Option A — scp directly from /app (preferred for first sync)
cd /app
scp -r backend/server.py        you@server:/home/red5-studio/backend/
scp -r backend/routes/          you@server:/home/red5-studio/backend/
scp -r backend/models/          you@server:/home/red5-studio/backend/
scp -r backend/simulator/       you@server:/home/red5-studio/backend/
scp    backend/requirements.txt you@server:/home/red5-studio/backend/

# Option B — rsync (safer; deletes stale files inside those dirs)
rsync -avh --delete backend/server.py     you@server:/home/red5-studio/backend/server.py
rsync -avh --delete backend/routes/       you@server:/home/red5-studio/backend/routes/
rsync -avh --delete backend/models/       you@server:/home/red5-studio/backend/models/
rsync -avh --delete backend/simulator/    you@server:/home/red5-studio/backend/simulator/
```

### 1.2 Fix ownership + permissions

```bash
sudo chown -R newborn:newborn /home/red5-studio/backend
sudo find /home/red5-studio/backend -type d -exec chmod 755 {} \;
sudo find /home/red5-studio/backend -type f -exec chmod 644 {} \;
sudo chmod 600 /home/red5-studio/backend/.env
```

### 1.3 Clear stale `__pycache__` (avoids stale imports of removed symbols)

```bash
sudo -u newborn find /home/red5-studio/backend -name __pycache__ -type d -exec rm -rf {} +
```

### 1.4 Reinstall deps ONLY if `requirements.txt` changed

```bash
sudo -u newborn -i
cd /home/red5-studio/backend && source venv/bin/activate
pip install -r requirements.txt        # no-op if already current
exit
```

**CHECKPOINT 1**:
```bash
ls /home/red5-studio/backend/routes/ | wc -l       # 12 (11 routers + __init__.py)
ls /home/red5-studio/backend/models/ | wc -l       # 5  (state, fs, data, weather, loaders) + __init__.py
ls /home/red5-studio/backend/simulator/ | wc -l    # 1  (__init__.py)
```

---

## Phase 2 — Smoke-test the backend BEFORE restarting systemd

```bash
sudo -u newborn -i
cd /home/red5-studio/backend && source venv/bin/activate

# Boot it in foreground; if it crashes, you see the traceback inline
uvicorn server:app --host 127.0.0.1 --port 8002    # NOTE: 8002 to avoid clobbering live
```

In another SSH window:
```bash
curl -s http://127.0.0.1:8002/api/health
curl -s http://127.0.0.1:8002/api/version
curl -s http://127.0.0.1:8002/openapi.json | python3 -c "import sys,json; d=json.load(sys.stdin); print('paths:', len(d['paths']))"
# Expect: paths: 60+   (no 500)
```

`Ctrl-C` the foreground uvicorn when you're satisfied.

**If `/openapi.json` returns 500**: pre-refactor bug. Confirm `models/data.py`
landed (`ls /home/red5-studio/backend/models/data.py`). If missing, re-run
Phase 1.1.

**If `uvicorn` errors with `ModuleNotFoundError: No module named 'routes'`**:
the new dirs didn't make it. Re-run 1.1 + 1.3.

---

## Phase 3 — Push the modularized frontend

The new layout adds `js/dashboard/` (16 files). `dashboard.html` already
references them; if you skip this step you'll see a blank dashboard.

```bash
# From /app on your dev box:
rsync -avh --delete frontend/public/js/dashboard/  you@server:/home/red5-studio/frontend/js/dashboard/
rsync -avh         frontend/public/dashboard.html  you@server:/home/red5-studio/frontend/dashboard.html

# Anything else that may have shifted in the public tree (cheap; rsync is diff-only)
rsync -avh frontend/public/                        you@server:/home/red5-studio/frontend/
```

```bash
sudo chown -R newborn:newborn /home/red5-studio/frontend
sudo find /home/red5-studio/frontend -type d -exec chmod 755 {} \;
sudo find /home/red5-studio/frontend -type f -exec chmod 644 {} \;
```

**CHECKPOINT 3**:
```bash
ls /home/red5-studio/frontend/js/dashboard/ | wc -l    # 16
ls /home/red5-studio/frontend/js/dashboard/app.js      # exists, ~2287 lines
grep -c "js/dashboard/" /home/red5-studio/frontend/dashboard.html
# Expect: > 10  (one <script> per module)
```

---

## Phase 4 — Restart the backend

```bash
sudo systemctl restart red5-backend.service
sudo systemctl status  red5-backend.service        # active (running)
sudo journalctl -u red5-backend.service -n 50 --no-pager
```

Watch the journal for `Application startup complete.` — that's your green
light.

```bash
curl -s https://your-domain.example.com/api/health
curl -s https://your-domain.example.com/api/version
```

**No nginx reload needed** — config didn't change.

---

## Phase 5 — Browser verification

Hard-refresh `https://your-domain.example.com/dashboard.html` (Cmd-Shift-R /
Ctrl-F5). Confirm:

| Check | Where | Expected |
|---|---|---|
| No 404s in devtools Network tab | `/js/dashboard/*.js` rows | all 200 |
| No JS console errors | DevTools console | clean |
| AHU modal opens | click any AHU pill | modal renders (uses `ahu-modal.js`) |
| Band-clamp modal opens | Bands tab → row click | renders (uses `band-clamp-modal.js`) |
| Floor plan tab | Floor Plan button | renders (uses `floor-plan-modal.js`) |
| Weather settings | gear icon next to weather | renders (uses `weather-settings-modal.js`) |
| Psy chart SVG | 3D WX tab → 2D toggle | renders (uses `psy-chart-svg.js`) |

Any single 404 on `/js/dashboard/*.js` means Phase 3 missed that file — rsync again.

---

## Phase 6 — Rollback (only if Phase 5 fails)

```bash
TS=20260525-1430     # the timestamp you wrote down in Phase 0

sudo systemctl stop red5-backend.service
sudo -u newborn rm -rf /home/red5-studio/backend  /home/red5-studio/frontend
sudo -u newborn mv /home/red5-studio/backend.$TS  /home/red5-studio/backend
sudo -u newborn mv /home/red5-studio/frontend.$TS /home/red5-studio/frontend
sudo systemctl start red5-backend.service

# Mongo (only if you suspect data drift — unlikely, schema didn't change)
mongorestore --uri "mongodb://localhost:27017" --drop \
             --nsInclude 'red5_v2_prod.*' \
             /home/newborn/mongo-dumps/$TS
```

---

## Phase 7 — Regression test (optional, recommended for prod-critical hosts)

The pytest suite ships with the backend. Run on the server after restart to
catch anything site-specific (file paths, weather provider, etc.):

```bash
sudo -u newborn -i
cd /home/red5-studio/backend && source venv/bin/activate
pip install pytest pytest-asyncio        # one-time; not in requirements.txt
pytest -q                                # expect 76/76 passing
exit
```

If anything red appears, the failing test name tells you which module to
re-rsync. Don't keep the test deps in prod once verified:

```bash
pip uninstall -y pytest pytest-asyncio
```

---

## What changed under the hood (FYI, not required reading)

- `server.py` now only mounts routers + wires CORS + boots. Every endpoint
  body moved to one of:
  - `routes/health.py`, `routes/files.py`, `routes/assets.py`,
    `routes/weather.py`, `routes/history.py`, `routes/equipment.py`,
    `routes/bands.py`, `routes/standards.py`, `routes/telemetry.py`,
    `routes/maintenance.py`, `routes/mapper.py`
- Pydantic response models for `/api/data` (and the supporting types) live in
  `models/data.py`. The browser response shape is byte-for-byte unchanged.
- `simulator/__init__.py` holds the demo-data generator that used to live in
  `server.py`.
- `models/state.py`, `models/fs.py`, `models/loaders.py`, `models/weather.py`
  hold the constants and helpers that used to be globals at the top of
  `server.py`.

If you ever need to look up "which file owns route X?", `grep -R "@router" routes/`.

---

*End of update runbook. Re-run from Phase 0 every time you sync a refactor.*
