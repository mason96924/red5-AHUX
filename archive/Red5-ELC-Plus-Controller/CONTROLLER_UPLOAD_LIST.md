# Red5-ELC Plus Controller — Upload List

Branch: `red5-plus-controller`  
Package: `archive/Red5-ELC-Plus-Controller/`

## enteliWEB objects (manual, one-time)

Copy from dev repo → paste into enteliWEB script editor:

| File | Controller path |
|------|-----------------|
| `app.py` | `/root/scripts/app.py` |
| `collector.py` | `/root/scripts/collector.py` |

**Never** bundle-deploy these two files — `upload_service.py` blocks them.

## Bundle deploy (everything else)

```bash
cd archive/Red5-ELC-Plus-Controller
python build_bundle.py
# → red5_elc_plus_bundle.zip
```

Upload at `http://<controller>:5001/update`

## Verify after deploy

```bash
curl http://<controller>:5001/api/health
curl http://<controller>:5001/api/services
curl http://<controller>:5001/api/elc-health
```

Expected services: `upload_service`, `elc_service`, `pages_service` — all `state: OK`.

## Pages

| URL | File |
|-----|------|
| `/` | `index.html` |
| `/floor` | `floor.html` |
| `/editor` | `editor.html` |
| `/settings` | `settings.html` |
| `/update` | `update.html` |
