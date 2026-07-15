# Red5-ELC Plus Controller

Deployable Red5-ELC V3.0 package for the Delta enteliWEB controller (V1.9 AHU layout).

## Quick start

```bash
python build_bundle.py          # → red5_elc_plus_bundle.zip
```

See [CONTROLLER_UPLOAD_LIST.md](CONTROLLER_UPLOAD_LIST.md) and [docs/CONTROLLER_DEPLOY.md](docs/CONTROLLER_DEPLOY.md).

## Layout

| Path | Role |
|------|------|
| `app.py` | Flask bootloader → `/root/scripts/` (manual) |
| `collector.py` | BACnet bridge stub → `/root/scripts/` (manual) |
| `*_service.py` | Plug-ins → `/root/data/pgpy/` (bundle) |
| `pgpy/elc/` | ELC Python package |
| `configs/` | JSON, CSV, SQLite |
| `docs/` | Manuals and design `*.md` |
| `graphics/` | Floor DXFs |
| `*.html` | UI pages at `/root/data/` |
