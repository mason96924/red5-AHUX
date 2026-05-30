# tests/

Regression test suite for Red5-Modbus V3.0.

**Started day-one** — lessons from V1.9 where regression tests added late let earlier fixes silently rollback. Every subtle bug fix gets a 10-line test asserting the invariant.

## Run

```bash
cd archive/Red5-Modbus-V3.0
python3 -m pytest tests/ -q
```

## Conventions

- Pytest collection: `test_*.py` with `def test_*(...)`.
- Standalone scripts that call `sys.exit()` are filtered via `conftest.py` (same pattern as V1.9).
- Fast tests only (sub-second). Slow integration tests gated behind `@pytest.mark.slow`.

## Planned test areas (populate as code lands)

| File | Covers |
|---|---|
| `test_modbus_codec.py` | FC encode/decode round-trips; 50-byte PDU enforcement; exception parsing |
| `test_modbus_tcp_client.py` | Reconnect/backoff; transaction-ID matching; per-request timeout |
| `test_scu_address_planner.py` | Coil-block read coalescing under 50-byte ceiling; mixed-population device coverage |
| `test_scu_driver_poll.py` | Read cycle against in-process simulator; cache update timestamps; reliability flags |
| `test_scu_driver_write.py` | Write queue; FC=15 batching; 1.2-s post-write re-poll scheduling |
| `test_driver_registry.py` | Driver discovery; isolated failure (one driver crash doesn't kill others) |
| `test_dibt_bridge.py` | (Mocked DIBT) BV creation; presentValue updates; reliability mapping per DIBT-1 |
| `test_naming_convention.py` | objectName format `{BLDG:3}-{FLR:02}-{AREA:4}-{LOC:3}-R{NNN:03}` |
| `test_build_bundle.py` | (parity with V1.9) ROOT_FILES has no `.md`; bundle layout invariants |
