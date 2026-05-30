# Red5-Modbus V3.0

Pluggable-driver Modbus TCP client gateway for Delta Controls controllers.

**Status**: Pre-implementation. Design complete, code not yet written.

**Design docs**:
- [`docs/RED5-MODBUS-V3.0-DESIGN.md`](../../docs/RED5-MODBUS-V3.0-DESIGN.md) — full design
- [`docs/RED5-MODBUS-V3.0-PROTOCOL.md`](../../docs/RED5-MODBUS-V3.0-PROTOCOL.md) — SCU protocol reference

## Directory layout

```
archive/Red5-Modbus-V3.0/
├── README.md                  # this file
├── app.py                     # PLACEHOLDER — Flask web admin/UI
├── collector.py               # PLACEHOLDER — asyncio runtime (drivers + DIBT bridge)
├── build_bundle.py            # PLACEHOLDER — bundle builder (to be adapted from V1.9)
├── drivers/                   # Per-protocol driver modules (deployed via bundle)
├── modbus/                    # Modbus TCP client primitives (stdlib only)
├── pgpy/                      # Future plug-in service modules
├── configs/                   # JSON configs (system + per-driver instance)
├── docs/                      # User-facing markdown (deployed to controller)
├── js/                        # UI JavaScript
├── graphics/                  # UI assets (icons, floor plans)
└── tests/                     # Regression test suite — populated as we build
```

## Hardware constraints (CRITICAL — same as V1.9)

`/root/scripts/` on the target Delta controller is **managed by enteliWEB**.

- `app.py` and `collector.py` MUST be placed there **manually** via the enteliWEB-registered-object workflow. The firmware deletes any unregistered `.py` file from `/root/scripts/`.
- enteliWEB does NOT auto-respawn. Never call `os._exit()` / `sys.exit()` / `os.kill()` from any code path. The controller goes dark.
- Plug-in scripts go under `/root/data/pgpy/`. That path is writable from bundle uploads.

See the design doc §3 for the full constraint list.

## Build status

| Item | Status |
|---|---|
| Design doc | ✅ |
| Protocol reference | ✅ |
| Directory skeleton | ✅ |
| Phase 0 (reconnaissance) | ⏳ pending hardware |
| Phase 1 (SCU simulator) | ⏳ |
| Phase 2 (driver, read only) | ⏳ |
| ... | ⏳ |

See design doc §10 for the full phased roadmap.
