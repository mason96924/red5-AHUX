# Controller Upload Reference

> Last updated: 2026-02-13 (session that added `tests/`, `mockups/`, `__pycache__/`, `_diagnostic/` to the clone-bundle exclude list).

## Quick answer

**Three ways to ship code to the controller, in order of preference:**

1. **Clone bundle (`/api/download-bundle`)** -- one encrypted file, ships everything in this repo EXCEPT dev-only trees (`tests/`, `mockups/`, `__pycache__/`, `_diagnostic/`). Use this for full-controller sync / commissioning a fresh controller.

2. **Repair Mode (`/api/repair/upload-plugin`)** -- single-file replacement of one plug-in or one UI file. Use this for hotfixes when disk is tight or you only need to change one or two files. Strict allow-list (see below).

3. **enteliWEB script editor** -- the ONLY way to update `app.py` (bootloader, refused by Repair Mode).

The list below is the source-of-truth manifest. Anything NOT on the list is local-only.

## Files that ship to the controller

### A. `app.py` -- bootloader (special)
| File | Destination | Method |
|---|---|---|
| `app.py` | `/root/scripts/app.py` | **enteliWEB script editor only** (Repair Mode refuses it) |

### B. Plug-ins (`*_service.py` + `_bridges_lib.py` + helpers)
Auto-discovered from `/root/data/pgpy/`. Hot-reloadable via `/api/repair/reload-module/<name>`.

| File | Destination | Repair-Mode allow-listed |
|---|---|---|
| `_bridges_lib.py` | `/root/data/pgpy/` | YES |
| `bacnet_diag_service.py` | `/root/data/pgpy/` | YES |
| `band_service.py` | `/root/data/pgpy/` | YES |
| `band_overrides_service.py` | `/root/data/pgpy/` | NO -- bundle only |
| `bridges_admin_service.py` | `/root/data/pgpy/` | YES |
| `g36_service.py` | `/root/data/pgpy/` | YES |
| `modbus_bridge_service.py` | `/root/data/pgpy/` | YES |
| `mqtt_bridge_service.py` | `/root/data/pgpy/` | YES |
| `telemetry_service.py` | `/root/data/pgpy/` | YES |
| `upload_service.py` | `/root/data/pgpy/` | YES |
| `weather_service.py` | `/root/data/pgpy/` | YES |
| `webhook_bridge_service.py` | `/root/data/pgpy/` | YES |
| `ws_bridge_service.py` | `/root/data/pgpy/` | YES |

### C. Runtime libs called by plug-ins (`/root/data/`)
Not plug-ins themselves (no `register()`), but imported by them.

| File | Destination | Repair-Mode allow-listed |
|---|---|---|
| `band_csv_generator.py` | `/root/data/` | NO -- bundle only |
| `collector.py` | `/root/data/` | NO -- bundle only |
| `simulator.py` | `/root/data/` | NO -- bundle only |

### D. UI / HTML
| File | Destination | Repair-Mode allow-listed |
|---|---|---|
| `dashboard.html` | `/root/data/` | YES |
| `equipment_mapper.html` | `/root/data/` | YES |
| `landing.html` | `/root/data/` | YES |
| `psy_3d.html` | `/root/data/` | YES |
| `sun_preview.html` | `/root/data/` | NO -- bundle only |
| `update.html` | `/root/data/` | YES |

### E. JS assets (`/root/data/js/`)
| File |
|---|
| `js/dashboard-components.js` |
| `js/docs_index.js` |
| `js/dynamics-animation.js` |
| `js/file-browser.js` |
| `js/i18n.js` |
| `js/image-picker.js` |
| `js/preview-components.js` |
| `js/psy-3d-engine.js` |
| `js/psychrometric.js` |
| `js/schema-config.js` |
| `js/sizing-check.js` |
| `js/sun-path.js` |
| `js/utils.js` |

### F. Configs (`/root/data/configs/`)
| File | Note |
|---|---|
| `configs/equipment_types.json` | Equipment schema (edited via equipment_mapper) |
| `configs/collector_config.json` | BACnet point map |
| `configs/bridges.json` | Data-bridges config (Repair-Mode allow-listed) |
| `configs/AHU-01-E_vav_proj.csv` | VAV projection (replace per your site) |
| `configs/AHU-02-S_vav_proj.csv` | VAV projection (replace per your site) |
| `configs/band_guide.csv` | **REGENERATED** by collector -- excluded from `replicate` mode |
| `configs/weather_*.json` | Cached weather histories -- excluded from `replicate` mode |

### G. Markdown docs (operator-facing in-app help)
| File | Repair-Mode allow-listed |
|---|---|
| `band_guide.md` | NO -- bundle only |
| `control_algorithms.md` | NO -- bundle only |
| `control_strategy_insight.md` | NO -- bundle only |
| `control_strategy_insight.ko.md` | NO -- bundle only |
| `data_bridges_guide.md` | YES |
| `erv_band_shift_insight.md` | NO -- bundle only |
| `erv_band_shift_insight.ko.md` | NO -- bundle only |
| `opt_sa_insight.md` | YES |
| `psychrometric_design_workflow.md` | NO -- bundle only |
| `psychrometric_design_workflow.ko.md` | NO -- bundle only |

### H. Docs subfolder
| File |
|---|
| `docs/data_exchange_diagram.md` |

## Files that DO NOT ship (local/dev-only)

These are auto-excluded from clone-bundle by the new `EXCLUDE_DIRS` rule:

```
tests/        -- regression suites (run with node / python3 on dev box)
mockups/      -- HTML design previews
__pycache__/  -- Python bytecode caches (regenerated on import)
_diagnostic/  -- per-session bisect scratch dir
```

Also auto-excluded:
- dotfiles (`.foo`, `.git`, etc.)
- `*.tmp` (in-flight atomic-write files)

**Bundle-build artifacts** (`red5_bundle.zip`, `red5_replicate.red5`):
These end up in the repo root after running `build_bundle.py`. Consider
adding them to `.gitignore` so they don't follow into clone bundles.

## How to verify before shipping

Run the dry-run preview to see exactly what your next clone download will
contain, including reasons for any exclusions:

```bash
# FULL mode (everything except dev-only trees)
python3 tests/dryrun_clone_bundle.py --mode full

# REPLICATE mode (additionally strips per-controller runtime state)
python3 tests/dryrun_clone_bundle.py --mode replicate

# Run against this repo instead of /root/data (for dev-box use):
python3 tests/dryrun_clone_bundle.py --data-root . \
                                      --scripts-root /tmp/_does_not_exist \
                                      --mode replicate
```

The dry-run uses the SAME exclusion rules as `app.py download_bundle()`
(verified by the `--self-test` mode).
