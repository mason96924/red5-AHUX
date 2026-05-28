# Red5-Modbus TCP — Design Document

**Authored**: 2026-05-27
**Source session**: Red5-Studio (V1.9/V2.0) — captured as a starting reference for the spin-off project.

---

## 1. Purpose

A pluggable-driver gateway that runs on a Delta Controls controller, written in Python with `asyncio`. Each driver bridges some external protocol or device family to BACnet objects exposed via DIBT (Delta Intelligent Building Technology).

**First driver**: Modbus TCP. **Target**: a single SCU (Modbus TCP server) that aggregates ~1000 proprietary devices on its RS-485 south side.

**Future drivers** (out of scope for v1, in scope for design): additional Modbus TCP servers, Modbus RTU over serial, OPC UA, MQTT, REST-polling, vendor-proprietary protocols.

**Priorities**: speed and reliability of the data path, in that order, with reliability dominating once minimum-acceptable speed is met.

---

## 2. Topology

```
┌──────────────────────────────────────────────────────────────┐
│  DELTA CONTROLLER  (Python asyncio runtime)                   │
│                                                                │
│   ┌──────────────────────────────────────────────────────┐   │
│   │  Driver registry / loader                              │   │
│   │                                                          │   │
│   │   ┌──────────┐   ┌──────────┐   ┌──────────┐          │   │
│   │   │ SCU Mb   │   │ Driver 2 │   │ Driver N │          │   │
│   │   │ driver   │   │ (future) │   │ (future) │          │   │
│   │   └────┬─────┘   └────┬─────┘   └────┬─────┘          │   │
│   │        └────────┬─────┴────────┬─────┘                  │   │
│   │                 ▼              ▼                          │   │
│   │       ┌────────────────────────────┐                    │   │
│   │       │  Unified point cache       │                    │   │
│   │       │  {point_id: {value, ts,    │                    │   │
│   │       │   reliability}}            │                    │   │
│   │       └────────────┬───────────────┘                    │   │
│   │                    ▼                                     │   │
│   │       ┌────────────────────────────┐                    │   │
│   │       │  DIBT bridge               │                    │   │
│   │       │  - BACnet read = lookup    │                    │   │
│   │       │  - BACnet write = enqueue  │                    │   │
│   │       │    onto driver's queue     │                    │   │
│   │       └────────────────────────────┘                    │   │
│   └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
       │ Modbus TCP (persistent)                │
       ▼                                          ▼
   ┌────────────┐                          ┌────────────┐
   │ SCU (one   │                          │ Future     │
   │  Modbus    │                          │ device     │
   │  TCP svr)  │                          │            │
   └────┬───────┘                          └────────────┘
        │ RS-485 (slow, serialized)
        ▼
   ~1000 proprietary devices
```

---

## 3. Hard Delta controller constraints

These are non-negotiable and were learned the hard way:

- `/root/scripts/` is **managed by enteliWEB**. Only `app.py` and `collector.py` live there, placed manually via the **enteliWEB-registered-object workflow**. The firmware deletes any unregistered `.py` file from `/root/scripts/`.
- enteliWEB does **NOT auto-respawn** the Python process on exit. **Never call** `os._exit()`, `sys.exit()`, `os.kill()`, or anything that terminates the interpreter. If you kill it, the controller goes dark until an operator manually starts the registered object via enteliWEB UI.
- Plug-in scripts (everything except the bootloader files above) live under **`/root/data/pgpy/`** — that path **is** writable via bundle uploads and the firmware leaves it alone.
- Assume **stdlib-only Python** unless explicitly confirmed otherwise on the target controller. `asyncio`, `socket`, `struct`, `time`, `json`, `os`, `sys`, `threading`, `concurrent.futures.ThreadPoolExecutor` should all be present.

---

## 4. Pluggable driver architecture

### 4.1 Driver interface

Every driver implements the same async contract. Keep it small — drivers vary widely:

```python
class Driver(Protocol):
    name: str                  # human label, e.g. "scu_mb"
    config: dict               # per-driver config (host, port, register map, etc.)

    async def connect(self) -> None: ...
    async def disconnect(self) -> None: ...
    async def poll_cycle(self) -> None:
        """One iteration: read tier-1 points, then maybe tier-2.
        Updates the shared cache with new values + timestamps."""
    async def write_point(self, point_id: str, value) -> None:
        """Queue a write to the underlying device.
        Returns when the write is confirmed on the wire, or raises."""
    def points(self) -> Iterable[PointDef]:
        """Enumerate every point this driver exposes -- used by the
        DIBT bridge at startup to register BACnet objects."""
```

### 4.2 Driver registry

- Drivers live as Python modules under `/root/data/pgpy/drivers/`.
- A small loader scans that directory at startup, imports each module, instantiates any class subclassing `Driver`, and registers it.
- Per-driver config lives in a JSON file (`/root/data/configs/drivers/<name>.json`) — never hardcoded.
- A driver failing to start does **not** stop other drivers. Failure is logged; the failing driver's points are still registered with reliability=fail so BACnet consumers see the state.

### 4.3 Lifecycle

```
startup → loader scans drivers/ → for each driver:
            instantiate → connect (with retry/backoff) → schedule poll_cycle loop
                                                       → schedule writer drain loop
shutdown → cancel all tasks → disconnect each driver
```

All drivers share one event loop. There is no per-driver thread, unless a driver legitimately needs blocking I/O isolation (covered in §5).

---

## 5. asyncio building blocks

| Construct | Use |
|---|---|
| `asyncio.open_connection()` | Persistent TCP to each TCP-based driver target |
| `asyncio.Queue` | Per-driver write queue; BACnet writes feed in, the driver's writer task drains |
| `asyncio.Event` | Per-transaction "response arrived" signal, keyed by Modbus transaction ID (or driver-specific ID) |
| `asyncio.wait_for(coro, timeout=...)` | Per-request timeout — **mandatory on every wire operation** |
| `asyncio.create_task()` | Spawn each driver's poll loop, writer drain, watchdog |
| `asyncio.gather(return_exceptions=True)` | Run all driver tasks concurrently; collect failures without propagating cancellation across drivers |
| `loop.run_in_executor(...)` | Wrap blocking calls (DIBT, sync libraries) so they don't stall the loop |

### 5.1 The DIBT blocking trap

DIBT is almost certainly **synchronous and blocking** at the Python level (the BACnet stack is C-side; DIBT is the bridge). If you call `dibt.write_object(...)` directly inside a coroutine, the **entire event loop pauses** during that call. At 250ms polling cadence, even 50ms DIBT blocks cause measurable jitter.

**First milestone in the new project**: write a 10-line script that times 1000 sequential DIBT reads. Print p50 / p95 / p99.

- p99 < 5ms → call DIBT directly from coroutines. Simple.
- p99 ≥ 5ms → wrap DIBT calls in `loop.run_in_executor(thread_pool, dibt_call, ...)`. The coroutine awaits the executor future; the loop stays responsive.

Decision data, not opinion.

---

## 6. SCU driver — first concrete driver

### 6.1 Wire protocol

Modbus TCP. Single persistent connection. The wire framing itself is well-documented (Modbus Application Protocol Specification V1.1b3). However, real-world implementations diverge in ways that bite:

- **Register addressing**: vendor docs may number registers 1-based or 0-based, and may add 40001 offsets (legacy "Modicon" notation). The wire is always 0-based. Confirm empirically against the SCU.
- **Byte/word order for multi-register values**: Modbus is big-endian per register, but 32-bit values can be ABCD, CDAB, BADC, or DCBA across two consecutive registers. There is no spec answer — every gateway picks one. **Test before trusting.**
- **Exception responses**: function code OR'd with 0x80. Some gateways instead just close the socket. Both must be handled.
- **Unit ID / slave ID field**: for a TCP-native server this is often ignored or required to be a specific value (commonly 0xFF or 0x01). The SCU's docs should specify.
- **Function code support**: not every server implements every FC. Worth probing FC=03, FC=04, FC=06, FC=16, FC=23 at integration time.

A from-scratch implementation of the framing for a single driver is achievable, but plan on real integration time matching this surface, not nominal LoC.

### 6.2 Read strategy

- **Coalesce**: Modbus FC=03 reads up to 125 registers per request. Group adjacent registers in the SCU's map into single reads. One coalesced read replacing 10 individual reads is the single biggest speed lever you have.
- **Pipelining**: issue multiple requests on the wire with distinct transaction IDs and match responses. **Test whether the SCU honors this** — many gateways internally serialize anyway. If it serializes, fall back to strict request-response and put effort into coalescing instead.
- **2-tier polling cadence**:
  - Fast tier: critical points (alarms, COV setpoints) — 250ms to 1s
  - Slow tier: trends, status, config — 5s to 30s
- **Adaptive promotion**: if a BACnet consumer reads a slow-tier point, promote it to fast tier for N seconds. Demote back when interest cools.

### 6.3 Write strategy

- Per-driver `asyncio.Queue` holds pending writes.
- Writer task drains the queue. For Modbus, prefer FC=16 (Write Multiple Registers) over FC=06 when you have ≥2 adjacent writes batched.
- Each write awaits its response (or timeout). The DIBT-side caller of `write_point()` awaits this so BACnet's commit semantics line up.

### 6.4 Reliability

- **Reconnect loop**: persistent connection with exponential backoff (start 500ms, cap at 30s). On reconnect, do not flush the cache — keep last-known values but flip a `reliability=stale` flag on every point owned by that driver.
- **Per-request timeout**: every wire operation uses `asyncio.wait_for(..., timeout=...)`. Defaults: 2s for reads, 5s for writes. Tunable per driver.
- **Watchdog**: tag every cache entry with `last_updated_ts`. A central watchdog coroutine inspects timestamps every N seconds; entries older than 3× their tier cadence get `reliability=stale`.
- **Heartbeat BACnet object**: every driver updates a dedicated `<driver>_alive` AV (or BV) on each successful poll cycle. Downstream BACnet consumers monitor this to detect process death — necessary because enteliWEB does not auto-respawn.

---

## 7. Unified point cache

Single in-memory dict, owned by the runtime, written by drivers, read by the DIBT bridge:

```python
cache: dict[str, CacheEntry] = {}

@dataclass
class CacheEntry:
    value: Any
    last_updated: float         # time.monotonic()
    reliability: str            # "good" | "stale" | "fail"
    driver: str
    point_def: PointDef         # type, scale, units, etc.
```

Point IDs are flat strings, namespaced by driver: `scu_mb.dev_42.flow_setpoint`. Keep them stable across restarts — they are what BACnet consumers bind to.

The cache is **single-threaded by default** (asyncio is one thread). No locks needed unless you cross into a thread executor for blocking work — at which point use `asyncio.Lock` only around the specific write that touches the cache.

---

## 8. DIBT bridge

A thin layer that:

1. At startup, walks every driver's `points()` and registers a corresponding BACnet object via DIBT (Analog Value, Binary Value, Multi-state Value as appropriate).
2. Hooks BACnet read intents to a cache lookup (`cache[point_id].value`).
3. Hooks BACnet write intents to `driver.write_point(point_id, value)` — awaiting the result.
4. Surfaces `reliability` via the BACnet object's `reliability` property when DIBT exposes that.

If DIBT is synchronous, see §5.1 — wrap in `run_in_executor`.

---

## 9. Roadmap (suggested phases)

| Phase | Scope | Done-when |
|---|---|---|
| **0. Reconnaissance** | Time DIBT calls; probe SCU register layout, pipelining behavior, exception conventions, supported FCs. | One markdown report documenting empirical findings. |
| **1. SCU driver alone, read-only** | One driver, one TCP connection, coalesced reads, 2-tier polling, cache, no writes, no DIBT yet (print to console). | 1 hour of stable polling without disconnect. |
| **2. Reliability** | Reconnect/backoff, per-request timeouts, watchdog, stale flag. | Pull network cable; cache flips stale; reconnects; flag clears. |
| **3. Writes** | Write queue, FC=16 batching, write timeout + retry policy. | End-to-end write round-trip < 1s p95. |
| **4. DIBT bridge** | Object registration, read hook, write hook, heartbeat AV. | BACnet consumer reads + writes work via DIBT against the SCU. |
| **5. Driver framework** | Extract Driver protocol, registry/loader, per-driver config files. | A stub second driver loads cleanly alongside SCU and gets ignored if disabled. |
| **6. Observability** | Per-driver stats (reads/s, errors, p99 latency) exposed as BACnet AVs and via a small HTTP debug endpoint. | Dashboard visible in enteliWEB. |
| **7. Second real driver** | Choose target (e.g., second Modbus TCP device family) and implement. | Two drivers running concurrently in production. |

---

## 10. Anti-patterns (lessons borrowed from Red5-Studio)

- **Never write to `/root/scripts/` from Python.** enteliWEB deletes unregistered files there. Only `app.py` + `collector.py` belong there, placed manually.
- **Never call `os._exit()` / `sys.exit()` from inside Flask or asyncio.** enteliWEB does not respawn. The controller goes dark.
- **No `pip install` until you confirm the target controller has Internet access and you have a tested wheel.** Pure-stdlib first.
- **Do not assume that fixing a bug locally means it ships.** The bundle deploy pipeline explicitly skips `app.py` and `collector.py`. Every change to those files requires a manual enteliWEB step.
- **Add a regression test the moment you fix a subtle bug.** A test file under `tests/` that asserts the invariant takes 5 minutes to write and catches the regression for the rest of the project's life.

---

## 11. Open questions for the kickoff conversation

a. **SCU register map**: how are the 1000 downstream devices laid out in the SCU's Modbus address space? One unit_id per device? Block-per-device with stride? Function-code dispatch?
b. **Does the SCU pipeline?** Empirical test, not a docs answer.
c. **RS-485 polling cadence on SCU's south side**: realistic floor on data freshness.
d. **DIBT API shape and timing**: sync vs async, thread-safe, p99 latency for a single read/write.
e. **Target controller Python version + what modules ship by default.**
f. **Number of fast-tier vs slow-tier points** (rough): drives polling design.
g. **What goes BACnet-side**: are downstream consumers all on the same controller, or remote? Affects how the BACnet object set is sized and exposed.

---

*End of design document.*
