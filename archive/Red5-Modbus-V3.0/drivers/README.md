# drivers/

Per-protocol driver modules. Each driver implements the `Driver` Protocol defined in `drivers/base.py`.

## Deployment

Drivers are **plug-in scripts** — they live under `/root/data/pgpy/drivers/` on the target controller and ARE deployed via bundle upload.

(Contrast with `app.py` and `collector.py`, which live in `/root/scripts/` and require manual enteliWEB placement.)

## Adding a new driver

1. Create `drivers/<myproto>.py`
2. Subclass `Driver` from `drivers/base.py`
3. Implement: `connect`, `disconnect`, `poll_cycle`, `write_point`, `points`, `stats`
4. Add per-instance config schema in `configs/drivers/<myproto>_<id>.json`
5. Add a regression test in `tests/drivers/test_<myproto>.py`
6. Driver registry auto-discovers on next `collector.py` start

## Current drivers

| File | Status | Notes |
|---|---|---|
| `base.py` | placeholder | Defines the `Driver` Protocol + supporting dataclasses |
| `registry.py` | placeholder | Driver discovery and supervision |
| `scu_modbus.py` | placeholder | First driver — Daekyung ELC SCU lighting gateway |
