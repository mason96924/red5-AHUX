# Red5-ELC V3.0

Red5 controller replacement for the SCU's PC counterpart.  Speaks the
proprietary ELC protocol over TCP to one or more SCUs and bridges every
downstream device family (SRM, DSW, DALI, WGM, SHG, ELCC48) to the Red5
dashboard via `/api/elc/*` REST + `/ws/elc/events` WebSocket.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full design.

## Status

Phase 0 (scaffold) + Phase 1 (codec) — in progress.

## Layout

```
elc/
  codec/        # L2: frame ↔ message objects (pure, no I/O)
  transport/    # L1: asyncio TCP supervisor (Phase 2)
  drivers/      # L3: per-family device API (Phase 3+)
  domain/       # L4: live replica, scheduler, scenes, audit (Phase 4+)
  api/          # L5: FastAPI REST + WebSocket (Phase 4+)
  plugins/      # extension hooks (Phase 8+)
tests/
  codec/        # 100 % unit coverage on selected flags (Phase 1)
  transport/
  drivers/
  integration/  # uses MockScu fake
```

## Local development

```bash
cd /app/archive/Red5-ELC-V3.0
pip install -e ".[dev]"
pytest -q
```

## Adopted assumptions (confirmed 2026-02 with user)

1. **Checksum** = `sum(bytes_before_checksum) & 0xFF`, applied to every
   frame on every link.  To be re-confirmed against a Wireshark capture
   once demo equipment ships.
2. **TCP port** — unset.  Configurable per-SCU; default placeholder is
   `7000` until we capture a real session.
3. **Multi-master writes** — assumed yes.  Every unsolicited event from
   the SCU is authoritative; we never trust our last-write as the
   current state.
4. **Frame fragmentation** — `decode()` is a streaming parser over a
   `bytearray`; one socket-read ≠ one frame.
5. **Time master** — Red5 will broadcast flag `0x01` (TimeDateSet) on
   every SCU (re)connect using its NTP-synced clock.
