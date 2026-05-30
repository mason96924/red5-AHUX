# modbus/

Stdlib-only Modbus TCP client primitives.

## Why hand-rolled?

- Pure stdlib (`asyncio`, `socket`, `struct`) — no `pip install` dependency on the controller
- Need precise control over the 50-byte SCU PDU ceiling and transaction-ID matching
- Single-outstanding-request semantics (no pipelining) keeps the implementation small

## Files (planned)

| File | Purpose |
|---|---|
| `codec.py` | Encode/decode of MBAP header + PDU for FC=01, 02, 03, 05, 06, 0F, 10 |
| `tcp_client.py` | Async TCP client with persistent connection, reconnect/backoff, per-request timeout, transaction-ID matching |
| `exceptions.py` | Modbus exception type hierarchy + SCU-specific exception codes (0x04–0x09) |

## NOT in this module

- Anything driver-specific (SCU address map, register-block planning, etc.) — that lives in `drivers/scu_modbus.py`
- The driver framework / point cache / DIBT bridge — those live in `collector.py`
