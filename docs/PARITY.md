# Red5 V1.9 ↔ V2.0 Endpoint Parity

> **TL;DR** — PROD runs **V1.9 Flask** (`/app/archive/Red5-Studio-V1.9/`). The dashboard frontend is shared with **V2.0 FastAPI** (`/app/backend/`). Every `/api/*` route added to V2.0 **must** be ported to V1.9 in the same commit, or PROD silently 404s and a feature disappears.

## Why this exists

The dashboard's compiled JS bundle calls `/api/*` endpoints without knowing which backend is serving them. When V2.0 gets a new route but V1.9 doesn't, the preview (V2.0) works perfectly and PROD (V1.9) breaks invisibly. We've shipped this bug at least twice:

| Date         | Symptom on PROD                                | Root cause                                              |
| ------------ | ---------------------------------------------- | ------------------------------------------------------- |
| 2026-06-26   | "Apply to Controller" 404'd                    | V2.0-only: `/api/band-overrides/ahu-rh-bands`           |
| 2026-06-27   | Pill Δ-arrows + 1h-vs-24h sparkline vanished   | V2.0-only: `/api/ahu-rolling-avgs`                      |

Three protection layers were added (in order of when they fire):

---

## Layer 1 — Pre-commit hook (catches drift at `git commit`)

**File**: `/.emergent/pre-commit-parity.sh`
**Wiring** (one-time, per developer machine):

```bash
cd <your-checkout-root>
ln -sf "$(pwd)/.emergent/pre-commit-parity.sh" .git/hooks/pre-commit
```

**Behaviour**:
- Fires only when staged diff touches `backend/routes/` or `archive/Red5-Studio-V1.9/*.py`.
- Runs `scripts/check_v19_v20_parity.py --json`.
- Exit `1` (block) on drift, with the missing-route list printed.
- Exit `0` (silent) on clean commits.

**Bypass** (emergencies only):

```bash
PARITY_SKIP=1 git commit -m "..."        # skip parity check only
git commit --no-verify -m "..."           # skip ALL hooks
```

---

## Layer 2 — `deploy.sh` hard-gate (catches drift at deploy time)

**File**: `/deploy.sh`, preflight step **`[0/7]`**, runs **before** `git pull` / `yarn install` / `yarn build` / nginx reload.

**Behaviour**:
- Drift → red error + missing-route list + `exit 4` with **zero** side effects.
- Override: `./deploy.sh --skip-parity-check` (logged in yellow).
- Help: `./deploy.sh --help`.

---

## Layer 3 — V1.9 boot warning (catches drift in production)

**File**: `/archive/Red5-Studio-V1.9/app.py`, runs at every Flask startup just before `app.run`.

**Behaviour**:
- Best-effort, **never blocks boot**.
- Appends one-line `WARN` to `/var/log/red5/parity_warnings.log`:
  ```
  2026-06-27T05:12:00+00:00  WARN  parity-drift  v20_only=[/api/foo,/api/bar]
  ```
- Echoes drift to stdout (captured by supervisor + Cloudflare tail).

---

## Recipe — porting a route from V2.0 → V1.9

> **Shortcut**: just run
> ```bash
> python3 /app/scripts/port-route.py /api/your-new-thing --diff
> ```
> and skip steps 1-3 below — the scaffolder finds the V2.0 source, picks the right V1.9 service file, appends a TODO stub + `app.add_url_rule(...)` next to its siblings inside `register()`, and saves a `.before` backup. You only need to fill in the body (step 2) before committing.

You added a `@router.get("/api/my-new-thing")` to V2.0. Now do this **in the same commit**:

1. **Find the matching V1.9 service file**. Group endpoints by feature:
   - `/api/data`, `/api/ahu-*`, `/api/trend-history` → `telemetry_service.py`
   - `/api/band-overrides/*`, `/api/band-csv/*`     → `band_overrides_service.py` / `band_csv_service.py`
   - `/api/bridges/*`, `/api/bacnet/*`              → `_bridges_lib.py` / `bridges_service.py`
   - one-offs → `app.py`

2. **Add a function with the same response shape**. Use V2.0's `routes/<file>.py` as the source of truth. Use V1.9's existing helpers (`ctx['get_h']`, `ctx['safe_load_json']`, etc.) — do NOT introduce new dependencies.

3. **Register the route in the file's `register(app, ctx)`**:

   ```python
   app.add_url_rule('/api/my-new-thing', 'my_new_thing', my_new_thing, methods=['GET'])
   ```

4. **Mirror the dashboard bundle if you edited the frontend too**:

   ```bash
   cd /app/frontend/src/dashboard && bash build.sh
   cp /app/frontend/public/dashboard.compiled.js /app/archive/Red5-Studio-V1.9/
   cp /app/frontend/public/dashboard.compiled.js /app/archive/Red5-Studio-V2.0/
   cp /app/frontend/public/dashboard.html        /app/archive/Red5-Studio-V1.9/
   cp /app/frontend/public/dashboard.html        /app/archive/Red5-Studio-V2.0/
   ```

5. **Verify locally**:

   ```bash
   python3 /app/scripts/check_v19_v20_parity.py
   # expect: exit 0, "V1.9 implements every V2.0 /api/* route"
   ```

6. **Commit** — the pre-commit hook will run the same audit and rubber-stamp it.

---

## Debugging a drift report

```bash
python3 /app/scripts/check_v19_v20_parity.py --json | python3 -m json.tool
```

Output keys:

| Key                | Meaning                                                          |
| ------------------ | ---------------------------------------------------------------- |
| `ok`               | `true` iff V1.9 has every V2.0 `/api/*` route                    |
| `v20_only`         | **Real bugs**: V2.0 has these, V1.9 doesn't — port these         |
| `v19_only`         | Legacy V1.9-only routes (bridges/bacnet/band-csv/etc.) — usually fine, leave alone |
| `shared_count`     | Count of routes both backends serve                              |

Path placeholders are canonicalized to `{*}` so `<int:foo>` ≡ `{foo}` ≡ `<path:bar>` ≡ `{bar:path}`. False positives from name differences are eliminated.

---

## Files reference

| File                                                | Role                                |
| --------------------------------------------------- | ----------------------------------- |
| `scripts/check_v19_v20_parity.py`                   | Static scanner (the brain)          |
| `scripts/port-route.py`                             | Scaffold the V1.9 side of a V2.0 route |
| `.emergent/pre-commit-parity.sh`                    | Git pre-commit wrapper              |
| `deploy.sh`                                         | PROD deploy with `[0/7]` parity gate|
| `archive/Red5-Studio-V1.9/app.py`                   | Boot-time best-effort warning       |
| `/var/log/red5/parity_warnings.log`                 | PROD-side audit trail               |

---

*Last updated: 2026-06-27 (Phase L.45 – L.47).*
