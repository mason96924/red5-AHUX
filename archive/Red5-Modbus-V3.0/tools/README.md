# tools/

Developer tools, not deployed to the controller.

| File | Purpose |
|---|---|
| `scu_simulator.py` | Stdlib-only async TCP server that mimics the Daekyung ELC SCU per V2.1 of its Modbus protocol. Strict about the spec footguns (50-byte cap, single connection, 1-s write reflection). Use as the driver dev/test fixture until real hardware arrives. |
| `sim_config.json` | Example simulator state config (mixed device population + injected faults). |

## Run the simulator

```bash
cd archive/Red5-Modbus-V3.0
python3 tools/scu_simulator.py --port 5020 --server-id 1 --config tools/sim_config.json --verbose
```

In another terminal, point the driver (when written) at `127.0.0.1:5020`.

## Smoke-test from the shell

```bash
# Read 8 coils starting at addr 0 (4SRM device 0 relays + neighbors)
# MBAP: tid=0001 pid=0000 len=0006 uid=01
# PDU:  fc=01 start=0000 qty=0008
python3 -c "
import socket, struct
s = socket.create_connection(('127.0.0.1', 5020), timeout=2)
req = bytes.fromhex('000100000006010000000008')
s.sendall(req)
resp = s.recv(64)
print('hex:', resp.hex())
print('coil bits:', bin(resp[9]) if len(resp) > 9 else 'short')
s.close()
"
```

## What the simulator does NOT model

- Bit-exact vendor timing
- DSW (switch panel) state -- spec mentions but doesn't detail
- 48 sRM specifics -- range TBD in real spec
- True multi-server scenarios (only one server per process; spin up multiple processes on different ports if you need multiple SCUs in dev)

## Fault injection

Live admin API is not exposed yet (no need until tests demand it). To inject
faults right now, modify `sim_config.json` or instantiate `SCUSimulator`
programmatically from a test and set `state.busy_remaining` / `state.force_disconnect_after`
directly.
