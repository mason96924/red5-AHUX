# Red5-ELC Plus Controller — Deploy Guide

## Runtime layout on the controller

```
/root/scripts/                         ← enteliWEB-managed (manual only)
├── app.py                             ← Flask bootloader
└── collector.py                       ← ELC ↔ BACnet bridge (stub)

/root/data/                            ← bundle-deployed
├── floor.html, editor.html, settings.html, index.html, update.html
├── repair_manifest.json
├── configs/
│   ├── project.json                   ← operator Settings output
│   ├── elc_config.db                  ← SQLite (floors, groups, schedules)
│   ├── collector_config.json          ← BACnet point map (future)
│   └── elc_telemetry.json             ← collector output (stub)
├── docs/                              ← *.md manuals and design docs
├── graphics/
│   └── floor_plans/                   ← DXF floor drawings
├── img/                               ← bmp, jpg, svg assets
├── js/                                ← client JavaScript
└── pgpy/
    ├── elc_service.py                 ← starts ELC API + proxies /api/elc/*
    ├── upload_service.py
    ├── pages_service.py
    ├── elc_runtime.py
    ├── mock_scu.py
    └── elc/                           ← full ELC Python package
```

## First-time setup

1. Register **two** enteliWEB Python objects pointing at:
   - `/root/scripts/app.py`
   - `/root/scripts/collector.py`
2. Build bundle on Mac: `python build_bundle.py`
3. Open `http://<controller>:5001/update` and upload `red5_elc_plus_bundle.zip`
4. Start both enteliWEB objects
5. Open `http://<controller>:5001/settings` → configure SCU IP + modules → Save
6. Open `http://<controller>:5001/floor`

## Deploy methods

| Method | When |
|--------|------|
| **Bundle upload** (`/update`) | Full or incremental deploy |
| **Repair Mode** | Single-file hotfix (see `repair_manifest.json`) |
| **enteliWEB editor** | Only way to update `app.py` or `collector.py` |

## Environment variables (optional)

| Variable | Default | Purpose |
|----------|---------|---------|
| `ELC_DATA_SOURCE` | `physical` | `physical` or `mock` |
| `ELC_SCU_HOST` | from project.json | SCU IP override |
| `ELC_SCU_PORT` | from project.json | SCU port override |
| `RED5_DATA_ROOT` | `/root/data` | Data root |
| `ELC_INTERNAL_PORT` | `18990` | Internal FastAPI port |

## Architecture

- **Flask** (`app.py`) serves HTML and proxies `/api/elc/*` to an internal **FastAPI** stack (`elc_runtime.py` on `127.0.0.1:18990`)
- **collector.py** will read/write BACnet and publish `configs/elc_telemetry.json` (stub today)
- Floor DXF imports land in `graphics/floor_plans/` or are stored in SQLite via the API
