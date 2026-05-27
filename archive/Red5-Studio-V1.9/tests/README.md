# Red5-Studio V1.9 Regression Tests

Fast pytest assertions covering bugs that have regressed at least once.

## Why this exists
On 2026-05-27 the codebase suffered a full day of regression cleanup. Five
fixes that had been applied weeks earlier had silently rolled back, most
likely via the `6a13f64 restore from versioned backup` commit. This test
suite catches each of those regressions in <1 second so future agents (or
CI) can verify the invariants are still in place.

## Run it

```bash
cd /app/archive/Red5-Studio-V1.9
pytest tests/ -v
```

Or just run the regression sanity check:

```bash
python -m pytest tests/ -q
```

## What each test enforces

| File | Invariant |
|---|---|
| `test_bundle_layout.py` | Every `.md` in `red5_bundle.zip` lives under `docs/`, never at root. `build_bundle.py` ROOT_FILES contains zero `.md` entries. |
| `test_upload_creates_parent.py` | `/api/upload-file` and `/api/save-image` source both call `os.makedirs(..., exist_ok=True)` on the parent directory (so wiping `graphics/` and re-uploading works). |
| `test_equipment_types_paths.py` | Every `vav_type.visual_assets.base_graphic` and every `ahu_type.visual_assets.base_graphic` in `configs/equipment_types.json` is either null/empty OR contains a `/` (i.e., not a bare filename). |
| `test_flask_routes.py` | `app.py` registers `/dashboard.html`, `/equipment_mapper.html`, `/landing.html`, `/ahu.html` routes (regression of HOME-button 404). |
| `test_landing_redirects.py` | `landing.html` and `red5_landing.html` redirect to `/dashboard.html`, never bare `/dashboard`. |
| `test_restart_endpoint.py` | `/api/restart-flask` exists and is gated by MASTER_KEY (so it can't be deleted by a future "simplification" pass). |

## Adding a new test

Every time we fix a subtle regression, add a 10-line test here that
asserts the *invariant*, not the implementation. The next time a backup
restore or a refactor breaks the invariant, this suite will scream.
