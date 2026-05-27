# Revert app.py — 2026-05-27

This directory contains the `app.py` from commit **3f0cdb0** (dated 2026-05-25),
which is the last known-good version BEFORE today's session.

Use this if you want to roll back your controllers to the pre-today state.

## What's in this version
- ✅ All work prior to 2026-05-27 (G36 service, weather, audit log, etc.)
- ❌ No `/api/restart-flask` endpoint  (added then removed today)
- ❌ No `/api/update-app-py` endpoint  (added then removed today)
- ❌ No HOME-button `.html` route aliases  (today's fix)
- ❌ No VAV graphic discovery in `/api/assets`  (today's fix)
- ❌ No `/api/upload-file` auto-mkdir  (today's fix)

## Deploy

For each controller (c1, c2, c3, c4):
1. Manually copy `app.py` into `/root/scripts/` via the enteliWEB-registered-object workflow.
2. Stop/Start the registered `app.py` object.

After all 4 are on this version, all four `curl /api/restart-flask` calls
will return **404** (endpoint doesn't exist). That's the signal that the
revert is complete.

## File integrity
- Source commit: `3f0cdb0f22c44a1481d37ce00548a6c812e42149`
- MD5: `cf21c9fd89622c51fd29d429730068b6`
- Lines: 1679
- Syntax: valid Python

Once you've finished the rollback, you can delete this directory.
