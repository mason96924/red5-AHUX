# Red5-Modbus V3.0 — Design Document

**Authored**: 2026-05-29
**Project status**: Pre-implementation. Spec captured; skeleton seeded; no driver code yet.
**Predecessor lineage**: Borrows deployment machinery and directory layout from Red5-Studio V1.9. Runtime is fresh — no HVAC code carried over.

---

## 1. Goal

A pluggable-driver gateway running on a dedicated Delta Controls controller. Bridges Modbus TCP devices into BACnet objects via DIBT (Delta Controls Python library).

**First driver**: Modbus TCP client to a Daekyung ELC SCU (Lighting Control Gateway) supporting up to ~2000 physical relays in a mix of 4/6 sRM, 4/6 eRM, and 48 sRM modules.

**Future drivers**: additional Modbus TCP servers, Modbus RTU, OPC UA, MQTT, vendor-proprietary protocols. Driver framework is the deliverable; SCU driver is the first proof.

**Priorities (in order)**:
1. Reliability of the data path (no silent stale reads, no commands lost)
2. Speed sufficient to meet UI/BMS expectations (~1 s end-to-end latency, fast tier)
3. Operational visibility (per-driver diagnostics, BACnet heartbeat)
4. Plug-in ergonomics (adding driver #2 should not require touching driver #1)

---

## 2. Vocabulary

| Term | Meaning |
|---|---|
| **Red5 Controller** | Delta Controls controller running this gateway. Modbus TCP **client**. |
| **SCU** | Daekyung ELC Lighting Control Gateway. Modbus TCP **server**. |
| **sRM / eRM** | Daekyung lighting relay modules. sRM = physical relays. eRM = software relays driven by Daekyung's own logic. Driver does not care which — same Modbus surface. |
| **4 / 6 / 48 sRM** | sRM variants with 4, 6, or 48 relays per module. Wire-level protocol is identical across counts (per user). 48 sRM register layout to be confirmed empirically when hardware arrives. |
| **Relay** | A single addressable on/off circuit. The atomic unit of BACnet representation. |
| **PSS** | Power Save State (per SCU spec). Per-relay binary state. Internal-only — accessible in UI/graphics but **not** exposed as a BACnet object. |
| **DIBT** | Delta Intelligent Building Technology. Python library on Delta Controls hardware that bridges Python to BACnet objects. |

---

## 3. Hard Delta controller constraints

Inherited verbatim from V1.9 — these are deployment-platform truths, not application choices:

- `/root/scripts/` is **managed by enteliWEB**. Only two files live there:
  - `app.py` — Flask web admin/UI
  - `collector.py` — asyncio runtime (drivers + DIBT bridge)

  Both placed **manually via the enteliWEB-registered-object workflow**. The firmware deletes any unregistered `.py` file from `/root/scripts/`.

- enteliWEB does **NOT auto-respawn**. Never call `os._exit()`, `sys.exit()`, `os.kill()`, or anything that exits the Python interpreter. The controller goes dark until a human starts the registered object via enteliWEB UI.

- Plug-in scripts (drivers, services) live under **`/root/data/pgpy/`**. That path is writable from bundle uploads. The firmware leaves it alone.

- Assume **stdlib-only Python** unless empirically confirmed otherwise on the target controller. Permitted modules: `asyncio`, `socket`, `struct`, `time`, `json`, `os`, `sys`, `threading`, `concurrent.futures.ThreadPoolExecutor`, `dataclasses`, `typing`, `logging`.

---

## 4. SCU protocol summary (per V2.1 spec)

Full table is in `PROTOCOL_REFERENCE.md`. Key facts that drive the driver design:

- **One TCP connection only** per SCU (explicit in spec).
- **Max Modbus message length 50 bytes** request or response. Significantly tighter than the standard 256-byte Modbus TCP PDU. **Coalescing plans must respect this.**
- **No pipelining mentioned**. Treat as strict sequential request/response — one outstanding request at a time per SCU.
- **Write reflection latency ~1 second** — after `Force Single Coil` / `Force Multiple Coils`, the read-back of the same coil block is unreliable for ≥1 s. Driver must schedule re-poll of touched coils ≥1.2 s after the write.
- **Slave ID range 0–31** (called *"SCU Device No."* in spec). Driver supports configurable server-id; first install will use one.
- **Address space layout** (coil addresses, 0-based):
  - 4SRM relay state: `0–1999` (500 devices × 4 relays)
  - 4SRM relay fail: `2000–3999`
  - 4SRM PSS: `4000–11999` (8 PSS per device)
  - 4/6eRM relay state: `12000–14999` (500 devices × 6 relays)
  - 4/6eRM relay fail: `15000–17999`
  - 6SRM relay state: `24000–29999` (1000 devices × 6 relays)
  - 6SRM relay fail: `30000–35999`
  - 6SRM PSS: `36000–51999` (16 PSS per device)
  - 4/6eRM PSS: `52000–59999`
- **Device Fail bitmask** in holding registers — distinct from per-relay fail:
  - 4SRM device fail: `16000–16032`
  - 6SRM device fail: `50000–50062`
  - 4/6eRM device fail: `60000–60032`
- **48 sRM register layout**: not in V2.1 spec. Per user: identical to 4/6 sRM semantically, just with 48 relays per module. **Address range TBD when hardware arrives or vendor confirms.**
- **Exception codes** beyond standard 0x01-0x03: `0x04` ACK_TIMEOUT, `0x05` CRC_MISMATCH, `0x06` DEVICE_NUM_MISMATCH, `0x07` DEVICE_BUSY, `0x08` DEVICE_DATA_LINE_SHORT, `0x09` DEVICE_ETC_ALARM.

**Footguns to test empirically when hardware available**:
- Byte/word order for multi-register reads (the spec is silent — Date/Time block at 65500 is the easiest test fixture).
- Whether `DEVICE_BUSY` is a transient retry condition or persistent fault.
- Real wire-time per request (with 50-byte cap, round-trip should be <50 ms on LAN, but the SCU's internal queuing to RS-485 may dominate).
- 48 sRM register range.

---

## 5. DIBT integration plan (with explicit open issues)

Per the *Delta Controls Python Library* PDF reviewed:

### What DIBT clearly provides

- `dibt.Read(objref, propname) → (STATUS, value)` — synchronous, blocking
- `dibt.Write(objref, propname, value, priority=None) → STATUS` — synchronous, blocking
- `dibt.Create(objref, properties_dict) → STATUS` — dynamic object creation at runtime
- `dibt.Delete(objref) → STATUS`
- `dibt.GetPropertyDataType(objref) → (STATUS, type)`
- `dibt.ReadRange(objref, start, end) → (STATUS, list)` — for trendlogs

`objref` format: `"binaryValue 2001"` (objectType + space + instance number). **No name-based addressing.**

### Open issues — must be resolved before driver build

The PDF is silent or unclear on these. Marked here for resolution before relevant code is written.

- **DIBT-1 — Writable `reliability` property?**
  PDF shows `Read` of `reliability` but not `Write`. Our design uses `reliability` to surface relay Fail State. If `dibt.Write(..., "reliability", ...)` doesn't work, fallback options:
  - Use `outOfService` + `presentValue` clamp
  - Use `statusFlags` (set the FAULT bit)
  - Use a custom proprietary property
  - Pair each BV with an adjacent BV "fail" mirror
  Resolution path: try `dibt.Write("binaryValue 1", "reliability", 7)` on first hardware contact. Default to `statusFlags` if it fails.

- **DIBT-2 — BACnet-write callbacks?**
  PDF shows no event API. The driver needs to know when a BMS writes a BV (= command relay ON/OFF). Without callbacks, the only options are:
  - **Output BV** (commandable, polled by driver) + **Input BV** (read-only, driver-written feedback). Doubles the BACnet object count to ~4000. Polling 2000 output BVs at 250 ms cadence is 8000 reads/sec into DIBT — too much.
  - Hope DIBT exposes a subscription mechanism not in this PDF (user mentioned newer multithread/non-blocking features — TBD).
  - Use BACnet COV subscription from inside Python (if DIBT exposes a client-side COV subscribe API).
  Resolution path: Phase 0 reconnaissance. Until resolved, **the driver only supports the SCU → BACnet direction** (reads, no writes from BMS).

- **DIBT-3 — Thread-safety / async-compatibility?**
  PDF doesn't address. User stated DIBT supports multithread and non-blocking, but this PDF doesn't reflect that. Safe default assumption: **synchronous, not thread-safe**. Wrap all DIBT calls in a single-worker `ThreadPoolExecutor` so we serialize from one place and the asyncio loop never blocks. If empirical testing shows DIBT is genuinely thread-safe, we can scale the worker count.
  Resolution path: Phase 0 microbenchmark. Run 1000 reads on `max_workers=1`, then `max_workers=4`, measure throughput and correctness.

- **DIBT-4 — Performance?**
  PDF gives no numbers. Phase 0 must measure: p50, p95, p99 of a single `dibt.Read` on the target controller hardware. Drives polling cadence ceilings.

---

## 6. Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│  RED5 CONTROLLER  (Delta Controls hardware)                       │
│                                                                    │
│   ┌───────────────────────────────────────────────────────────┐  │
│   │  app.py    (/root/scripts/app.py)                          │  │
│   │  Flask web admin/UI: /update, /api/assets, /api/files,     │  │
│   │  /api/upload-file (parity with V1.9 deployment surface)    │  │
│   └────────────────────────────┬──────────────────────────────┘  │
│                                │                                   │
│   ┌────────────────────────────▼──────────────────────────────┐  │
│   │  collector.py    (/root/scripts/collector.py)              │  │
│   │  asyncio event loop. Owns the runtime.                     │  │
│   │                                                              │  │
│   │  ┌──────────────────────────────────────────────────────┐ │  │
│   │  │ Driver Registry  (drivers/registry.py)                │ │  │
│   │  │  - scans drivers/ on startup                           │ │  │
│   │  │  - instantiates each Driver subclass                   │ │  │
│   │  │  - supervises connect / poll_cycle / writer_drain      │ │  │
│   │  │  - exposes per-driver stats                            │ │  │
│   │  └──────────────────────────────────────────────────────┘ │  │
│   │                                                              │  │
│   │  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │  │
│   │  │ SCU      │  │ Driver 2 │  │ Driver N │                 │  │
│   │  │ driver   │  │ (future) │  │ (future) │                 │  │
│   │  │          │  │          │  │          │                 │  │
│   │  │ - poll   │  │          │  │          │                 │  │
│   │  │ - write  │  │          │  │          │                 │  │
│   │  │   queue  │  │          │  │          │                 │  │
│   │  └────┬─────┘  └────┬─────┘  └────┬─────┘                 │  │
│   │       │             │             │                          │  │
│   │       └─────────────┴─────────────┘                          │  │
│   │                     │                                         │  │
│   │       ┌─────────────▼──────────────┐                         │  │
│   │       │ Unified Point Cache         │                        │  │
│   │       │ {point_id: CacheEntry}      │                        │  │
│   │       │ - value, ts, reliability,   │                        │  │
│   │       │   driver, point_def         │                        │  │
│   │       └─────────────┬──────────────┘                         │  │
│   │                     │                                         │  │
│   │       ┌─────────────▼──────────────┐                         │  │
│   │       │ DIBT Bridge                 │                        │  │
│   │       │ - sync DIBT calls wrapped   │                        │  │
│   │       │   in ThreadPoolExecutor     │                        │  │
│   │       │ - BV creation at startup    │                        │  │
│   │       │ - reads cache → writes to   │                        │  │
│   │       │   BACnet object             │                        │  │
│   │       │ - writes from BACnet TBD    │                        │  │
│   │       │   (see DIBT-2)              │                        │  │
│   │       └─────────────────────────────┘                        │  │
│   │                                                                │  │
│   └────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
        │                                                          
        │ Modbus TCP (one persistent connection per SCU)
        ▼
   ┌────────────────────┐
   │ SCU                │
   │ (TCP server)       │
   └──────────┬─────────┘
              │ RS-485
              ▼
   ~2000 physical relays in a mix of 4/6 sRM, 4/6 eRM, 48 sRM
```

### Process model

- **One Python process** running `collector.py` continuously. asyncio single-threaded event loop.
- **`app.py` is a separate process** — Flask web admin. Communicates with `collector.py` only via the shared cache files in `/root/data/state/` (JSON snapshots) and/or a UNIX-domain socket.
- **Why split**: if `app.py` crashes (e.g., a route handler throws), the data-collection runtime keeps polling. Operational safety > convenience.

### Cache

- In-memory dict in `collector.py`, owned by the driver registry.
- Single-threaded by default (asyncio is one thread). No locks needed unless an executor thread modifies it directly — and we keep cache mutations on the loop thread by convention.
- Periodic snapshot to `/root/data/state/cache.json` for `app.py` to consume.

### Driver interface

```python
class Driver(Protocol):
    name: str                    # e.g. "scu_lighting_01"
    config: dict
    cache: dict                  # reference to the shared cache

    async def connect(self) -> None: ...
    async def disconnect(self) -> None: ...
    async def poll_cycle(self) -> None:
        """Single pass: read all fast-tier points, opportunistically
        slow-tier. Updates cache with new values + timestamps."""
    async def write_point(self, point_id: str, value) -> None:
        """Enqueue or perform a write to the underlying device.
        Awaits confirmation or raises."""
    def points(self) -> Iterable[PointDef]:
        """Enumerate every point this driver exposes.
        Used at startup by the DIBT bridge to register BACnet objects."""
    def stats(self) -> dict:
        """Per-driver counters: polls_completed, errors, p99_latency, etc."""
```

### Cache entry

```python
@dataclass
class CacheEntry:
    value: Any
    last_updated: float         # time.monotonic()
    reliability: str            # "good" | "stale" | "fail_relay" | "fail_device"
    driver: str
    point_def: "PointDef"
```

### Point definition

```python
@dataclass
class PointDef:
    point_id: str               # "scu01.6srm.012.relay.3"   (driver-namespaced)
    bacnet_object_type: str     # "binaryValue"
    bacnet_instance: int        # 1234
    bacnet_object_name: str     # "MAIN-03-LOBBY-N01-R012"
    bacnet_units: str           # for AV; None for BV
    description: str
    metadata: dict              # building, floor, area, location, device_type, etc.
```

---

## 7. BACnet object plan

### Mapping

- **One Binary Value per physical relay.** 2000 BVs at full population.
- **PSS does NOT get a BACnet object.** Stays internal-only. Accessible in UI/graphics via direct cache read.
- **Device Fail** does not get its own BACnet object; it's surfaced via the affected BVs' `reliability` (see DIBT-1 for fallback if `reliability` is not writable).

### Object naming convention

Per user agreement, fixed-width hyphen-separated, hierarchy fully in the name:

```
{BLDG:3}-{FLR:02}-{AREA:4}-{LOC:3}-R{NNN:03}
```

Example: `MAIN-03-LOBBY-N01-R012` (22 characters; well under any 32-char truncation).

- `BLDG` — 3-char building code (alpha)
- `FLR` — 2-digit floor (zero-padded; supports `B1`, `B2` via `B1` prefix encoding TBD)
- `AREA` — 4-char area code (alpha or alphanumeric, e.g., `LOBBY`, `OFC1`, `MECH`)
- `LOC` — 3-char location within area (`N01`, `S01`, `CTR`)
- `R{NNN}` — relay number 3-digit zero-padded

Stored as the BACnet object's `objectName` property. Lookup in driver is always by `objref` (object id) since DIBT uses ids — the name is metadata for the BMS UI.

### Instance number scheme

- BVs reserved range: instance `1000–2999` for relay objects (2000 slots).
- AVs reserved range: instance `1000–1999` for diagnostic / heartbeat objects.
- Stable mapping: a given physical relay always gets the same instance, regardless of restart. Mapping table persisted in `configs/relay_map.json`.

### Heartbeat object

- One `analogValue` per driver, e.g., `analogValue 1001`, `objectName = "SCU01-HEARTBEAT"`.
- `presentValue` incremented every successful poll cycle. Stale presentValue tells external BMS that the driver is stuck.

---

## 8. Polling plan (SCU driver, first cut)

### Tiers

- **Fast tier (1 s cadence)**: All relay state coils. All relay fail coils. All device-fail holding registers.
- **Slow tier (30 s cadence)**: PSS coils.
- **Adaptive**: when a relay BV is written from BACnet (DIBT-2 dependent), promote that relay's coil to fast tier for 5 s after the write so the read-back confirms (and respects the 1-s SCU latency).

### Read coalescing

50-byte SCU message ceiling: header ~9 bytes, payload ~41 bytes ≈ **328 coils per FC=01 request maximum**. Plan:

- **6SRM state block** (24000–29999, 6000 coils): 19 reads
- **6SRM fail block** (30000–35999, 6000 coils): 19 reads
- **4SRM state + fail**: as needed by population
- **eRM state + fail**: as needed by population
- **Device Fail holding registers**: 3 reads (one per device type, FC=03)

A fully populated 2000-relay deployment using 6SRM only: ~40 reads/cycle. At 50 ms wire-time per round trip (estimated), one full cycle = 2 seconds. **This exceeds the 1-s fast-tier target.** Mitigations to evaluate empirically when SCU available:

1. Read only populated coils (skip empty device slots) — large win in mixed deployments
2. Confirm 50-ms estimate; might be much faster on LAN
3. Accept 2-s cadence as the realistic floor; downstream BMS expectations should align
4. Test if SCU honors larger messages despite the 50-byte spec ceiling

**Decision deferred to Phase 1 measurement.**

### Write strategy

- Per-driver `asyncio.Queue` for outbound writes.
- Coalesce adjacent coil writes within a single poll cycle into one FC=15 (Force Multiple Coils) call.
- Single-coil writes use FC=05.
- After any write, schedule a re-read of the affected coil block at `now + 1.2 s` to confirm reflection.

---

## 9. Reliability

| Layer | Mechanism |
|---|---|
| Connection | Exponential backoff reconnect (500 ms → 30 s). On disconnect, mark all driver's cache entries `reliability=stale`. |
| Request | `asyncio.wait_for(..., timeout=2.0)` on every wire operation. Default 2 s for reads, 5 s for writes. Per-driver tunable. |
| Exception responses | All SCU exception codes (0x01–0x09) logged with their meaning. `DEVICE_BUSY` triggers retry-with-backoff (up to 3); others mark relay `reliability=fail`. |
| Per-relay fail | Coil read in fail block — flips affected BV's reliability to "fail_relay". |
| Per-device fail | Holding register bitmask — flips all BVs in that device to "fail_device". Distinct from per-relay fail so ops can triage. |
| Watchdog | Background task checks `last_updated` ages every 5 s. Entry older than 3× its tier cadence → `reliability=stale`. |
| Heartbeat | AV `presentValue` incremented every poll cycle. External BMS monitors. |

---

## 10. Phased roadmap

| Phase | Scope | Done-when |
|---|---|---|
| **0. Reconnaissance** | (a) DIBT microbenchmark (p50/p95/p99 of Read). (b) Try `dibt.Write(..., "reliability", ...)`. (c) Discover whether DIBT has callback/COV API. (d) Probe SCU empirically for byte/word order, real wire-time per request, 48 sRM register range, DEVICE_BUSY semantics. | A markdown report `docs/phase0_findings.md` with measured numbers. |
| **1. SCU simulator** | Stdlib-only async TCP server speaking Modbus TCP per SCU V2.1 spec. Configurable register population (mixed device types). Models 1-s write reflection latency. | Driver dev/test loop works against `localhost:5020`. Will also serve as a permanent test fixture. |
| **2. SCU driver — read only** | One driver, one TCP client, coalesced reads, 2-tier polling, cache, reconnect loop, watchdog. No BACnet yet — print cache to console. | 1 hour of stable polling against simulator; no leaks, no crashes. |
| **3. SCU driver — writes** | Write queue, FC=15 batching, write timeout + retry, post-write re-poll. Still no BACnet. Test via `app.py`'s admin endpoint. | End-to-end write round-trip < 1 s p95 against simulator. |
| **4. DIBT bridge — outputs** | BV creation at startup (2000 objects), per-poll DIBT write to update `presentValue`. Heartbeat AV. Reliability mapping per DIBT-1 resolution. | BACnet consumer can read all 2000 BVs and see live state from simulator. |
| **5. DIBT bridge — inputs** | BACnet-driven writes mapped to driver write queue. Mechanism depends on DIBT-2 resolution. | BMS commands a BV; relay coil on SCU flips; feedback reflects within 2 s. |
| **6. Driver framework extraction** | Pull `Driver` Protocol, `registry.py`, config loader, watchdog into reusable shape. Stub second driver loads cleanly. | A no-op `tests/drivers/test_dummy_driver.py` registers and runs alongside SCU. |
| **7. UI** | V1.9-style admin/diagnostics + 2000-relay live-status grid + floor-plan placement (graphics-mapped). | Operator can identify a faulted relay by floor plan in < 5 seconds. |
| **8. Real SCU hardware bring-up** | Swap simulator endpoint for real SCU IP. Validate every Phase 0 finding. Capture any new footguns in `docs/phase8_findings.md`. | One full week of stable operation against real hardware. |

---

## 11. Anti-patterns (lessons from Red5-Studio V1.9)

- **Never write to `/root/scripts/` from Python.** enteliWEB deletes unregistered files there. Only `app.py` + `collector.py` belong there, placed manually.
- **Never call `os._exit()` / `sys.exit()` / `os.kill()` from any code path.** enteliWEB does not respawn. The controller goes dark.
- **No `pip install` without explicit per-controller verification.** Pure-stdlib first.
- **`app.py` and `collector.py` are NOT auto-deployed by bundle uploads** (build_bundle.py explicitly skips them — see V1.9 lineage). Every change requires a manual enteliWEB step. **Reflect this in the deploy doc.**
- **Add a regression test the moment you fix a subtle bug.** A test under `tests/` that asserts the invariant takes 5 minutes to write and saves the project from silent rollback later.
- **Empirical first, code second.** Don't trust spec language for byte order, pipelining, real latency, exception semantics. Test against hardware (or simulator) before implementing on top of an assumption.

---

## 12. Open issues tracking

Living list. Resolve before the affected Phase begins.

| ID | Issue | Affects | Resolution path |
|---|---|---|---|
| DIBT-1 | Is `reliability` writable from Python? | Phase 4 | Phase 0 experiment on hardware |
| DIBT-2 | How do we detect BACnet-side writes to BVs? | Phase 5 | Phase 0 discovery; vendor confirmation |
| DIBT-3 | Is DIBT thread-safe? | Phases 4, 5 | Phase 0 microbenchmark |
| DIBT-4 | DIBT per-call latency on this hardware? | Phases 4, 5 | Phase 0 microbenchmark |
| SCU-1 | 48 sRM register range — same as 4/6 sRM family or distinct? | Phase 2 | Vendor confirmation OR empirical when hardware arrives |
| SCU-2 | Real wire-time per Modbus request | Phase 2 | Phase 0 / Phase 8 measurement |
| SCU-3 | Byte/word order for multi-register reads (Date/Time block at 65500) | Phase 4 | Phase 8 measurement against real SCU |
| SCU-4 | DEVICE_BUSY (0x07) — transient retry condition or persistent fault? | Phase 2 | Phase 8 empirical |
| NAME-1 | Building code conventions for multi-building installs | Phase 4 | User policy decision |
| NAME-2 | Below-grade floor encoding in `FLR` field (B1 / B2 / etc.) | Phase 4 | User policy decision |
| BACNET-1 | If `reliability` is not writable, fallback choice between `statusFlags`, `outOfService`, or paired-mirror BV | Phase 4 | After DIBT-1 resolution |

---

*End of design document. Iterate as Phase 0 findings arrive.*
