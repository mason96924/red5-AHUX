# Red5-ELC V3.0 — Architecture

**Status**: Draft v0.1 — 2026-06-28
**Scope**: Replace the SCU's Windows-PC counterpart so a Red5 controller owns
SCU configuration, runtime operation, scheduling, scene/AG management,
audit + telemetry, and the event-driven view that the existing Red5
dashboard renders.

The ELC ecosystem is deep (SCU + SRM/ELCC48 relays + DSW switches + DALI
masters/slaves + WGM/SHG wireless gateways + DT8 tunable-white +
EnOcean/Zigbee), but every layer reuses the **same 5-field serial frame**
and the **same hierarchical address** (`DeviceType / SCU / Address /
SubAddress`).  The architecture below leans on that invariant so we ship
one protocol stack, not five.

---

## 1.  System context

```
                            ┌──────────────────────────────────┐
                            │   Red5 Dashboard (V1.9 / V2.0)   │
                            │   (existing pentagon Setup Walk, │
                            │    Givoni, weather strip, etc.)  │
                            └──────────────┬───────────────────┘
                                           │  WebSocket  /api/elc/events
                                           │  REST       /api/elc/*
                                           ▼
   ┌────────────────────────────────────────────────────────────────┐
   │                Red5-ELC V3.0  (this project)                   │
   │                                                                │
   │   ┌──────────┐  ┌─────────┐  ┌──────────────┐  ┌──────────┐   │
   │   │  REST /  │  │  Live   │  │  Device      │  │  Audit / │   │
   │   │  WS API  │  │  State  │  │  Drivers     │  │  Sched   │   │
   │   └──────────┘  └─────────┘  └──────────────┘  └──────────┘   │
   │            ▲          ▲             ▲              ▲          │
   │            └──────────┴──── domain ─┴──────────────┘          │
   │                              ▲                                │
   │            ┌─────────────────┴─────────────────┐              │
   │            │  Codec (frame ↔ message objects)  │              │
   │            └─────────────────┬─────────────────┘              │
   │                              ▼                                │
   │            ┌─────────────────────────────────────┐            │
   │            │       Transport supervisors         │            │
   │            │  TCP-SCU client │ RS-485 multi-bus  │            │
   │            └─────────────────┬───────────────────┘            │
   └──────────────────────────────┼────────────────────────────────┘
                                  │
        ┌────────────────────┬────┴────┬──────────────────┐
        ▼                    ▼         ▼                  ▼
    ┌─────────┐         ┌─────────┐ ┌─────────┐      ┌─────────┐
    │  SCU-1  │ TCP/IP  │  SCU-2  │ │ SCU-3   │ ...  │  SCU-N  │
    └────┬────┘         └────┬────┘ └────┬────┘      └────┬────┘
         │ RS-485 38400 8N1                                │
   ┌─────┴─────┬─────┬─────┬─────┐                  ┌─────┴─────┐
   ▼           ▼     ▼     ▼     ▼                  ▼           ▼
  SRM/       DSW   DALI  WGM   SHG               ELCC48      ...
  ELCC48     sw    Mst   Gw    Gw                Slaves
                          │     │
                          ▼     ▼
                  Zigbee  EnOcean
                  WDM     WOM/SHS
```

Roles:

* **Red5 Dashboard** — unchanged; gains a new `/api/elc/*` namespace and a
  `/ws/elc` event stream.  The pentagon Setup Walk gets an additional
  "SCU Topology" page later; not in MVP.
* **Red5-ELC V3.0** — the focus of this document.  Lives in
  `/app/archive/Red5-ELC-V3.0/` initially (so the V1.9 parity gate stays
  green) and graduates into the controller image once it's stable.
* **SCU** — speaks ELC over TCP/IP to *us*; bridges to its downstream
  RS-485 bus on our behalf.  We treat its TCP socket as the canonical
  link layer and *never* speak directly to the device-side RS-485 from
  the controller.
* **Sub-modules** (SRM, DSW, DALI, WGM/SHG, ELCC48 slaves) — addressable
  through the SCU.  Generate unsolicited events (relay status change,
  fail report, power-up, occupancy/photo, demand-control).

---

## 2.  Layered architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ L5  Public API     │  FastAPI routes + WebSocket fan-out        │
│                    │  Auth via existing tenant cookie/session   │
├─────────────────────────────────────────────────────────────────┤
│ L4  Domain         │  Live state replica (in-memory + Mongo)    │
│                    │  Scheduler · Scenes · AGs · Audit log      │
├─────────────────────────────────────────────────────────────────┤
│ L3  Device drivers │  Per-family driver (SRM, DSW, DALI, WGM,   │
│                    │  SHG, ELCC48).  Wraps the codec's flag set │
│                    │  with idiomatic methods (set_relay, query  │
│                    │  status, set_scene, ...).                  │
├─────────────────────────────────────────────────────────────────┤
│ L2  Codec          │  Frame ↔ message object.  Pure functions,  │
│                    │  no I/O.  100 % unit-testable.             │
├─────────────────────────────────────────────────────────────────┤
│ L1  Transport      │  TCP-SCU client (one per SCU)              │
│                    │  RS-485 multi-bus (future, direct)         │
│                    │  Supervisors: reconnect + back-off         │
└─────────────────────────────────────────────────────────────────┘
```

Hard rule: data only crosses a layer through the function signatures
defined here.  Codec never imports asyncio.  Drivers never `recv()`
bytes.  API never builds frames.  This is the seam that keeps the
protocol's enormous flag set from cross-contaminating the rest of the
codebase.

### L1 — Transport supervisor

```python
# transport/tcp_scu.py
class ScuLink:
    """One per (host, port).  Owns the asyncio socket, the inbound
    parser stream, and the outbound write queue.  Reconnects with
    exponential back-off on any error; surfaces a `state` observable
    (connected/connecting/down) for the supervisor to react to."""

    async def send(self, frame: Frame) -> None: ...   # never blocks
    def feed(self, on_frame: Callable[[Frame], None]) -> None: ...
```

Concurrency model: **one asyncio task per SCU socket**, plus a single
shared event-loop for the whole process.  No thread per SCU — we expect
~1-50 SCUs per controller and asyncio handles that comfortably.  Inbound
frames are pushed onto a `asyncio.Queue` consumed by the codec/router.

### L2 — Codec

```python
# codec/frame.py
PREAMBLE   = b"ELC"
MAX_PAYLOAD = 40

@dataclass(frozen=True)
class Frame:
    msg_type: int          # the "Type" byte
    payload : bytes        # 0..40 bytes
    # checksum is computed/verified at the edges; never stored.

def encode(f: Frame) -> bytes:                # raises ValueError on overflow
def decode(buf: bytearray) -> Iterator[Frame] # streaming: peels frames off a buffer
def checksum(b: bytes) -> int:                # = sum(b) & 0xFF  (per ELCC48 spec)
```

Frame layout (TCP variant, the one we use against the SCU):

```
 0   1   2     3        4        5 ............ 4+N      5+N
+---+---+---+--------+--------+----------------+---------+
| E | L | C |  Type  | Length |   Data (N B)   | Cksum   |
+---+---+---+--------+--------+----------------+---------+
                              <----- N ≤ 40 ----->
```

A separate "message" layer sits one level up: each `msg_type` (Flag)
gets a typed dataclass — `RelayState`, `FailReport`, `TimeDateSet`,
`DaliArcPower`, etc.  The codec carries a registry of
`flag → (encode, decode)` pairs.  Adding a new flag is a 10-line
contribution, not a refactor.

Address encoding helper (4 B Device-ID):

```
 31..22       21..16   15..6      5..0
+----------+--------+--------+----------+
| DevType  |  SCU   | Addr   | SubAddr  |
| 10 bits  | 6 bits | 10 b   |  8 bits  |
+----------+--------+--------+----------+
```

`DeviceId` is a frozen dataclass with `.encode_4b()` / `.decode_4b()`
helpers and an `IntEnum` for `DeviceType`.

### L3 — Device drivers

One file per family:

```
drivers/
  base.py          # AbstractDevice; common request_response + event hook
  srm.py           # SRM-style relay modules (incl. ELCC48 master)
  dsw.py           # Direct switch modules
  dali.py          # DALI master ↔ slave incl. DT8 tunable-white
  wgm.py           # Wireless Gateway Module (Zigbee WDM)
  shg.py           # Smart Home Gateway (EnOcean WOM, SHS)
  elcc48_slave.py  # 8-byte master/slave protocol variant
```

Each driver subscribes to the inbound frame router for the flags it
cares about, and exposes a small, opinionated API:

```python
class SrmDriver(AbstractDevice):
    async def set_relay(self, address: DeviceId, state: bool) -> None: ...
    async def query(self, address: DeviceId) -> RelayState: ...
    on_state_change : EventBus[RelayState]   # unsolicited 0x15 events
    on_fail         : EventBus[FailReport]   # unsolicited 0x23 events
```

`EventBus` is a tiny pub/sub built on `asyncio.Queue` per subscriber —
no external dep, fan-out is O(N subscribers) per event.

### L4 — Domain (the bit that *replaces* the SCU's PC)

This is where we stop being "a thin protocol wrapper" and become "the
brain".  The PC counterpart owns:

* **Live state replica** — the truth about every relay, switch, dimmer,
  sensor.  Refreshed lazily from drivers + updated *eagerly* from
  unsolicited events.  In-memory dict keyed by `DeviceId`, mirrored to
  Mongo on change.
* **Scheduler** — Normal-day, Special-day, Special-date programs (flags
  0x3 / 0x4 / 0x6).  Runs in the same asyncio loop.  Persists to Mongo.
  Re-broadcasts the active schedule to each SCU on (re)connect.
* **Scenes & AGs** — DALI scene tables, WGM/SHG access groups.  Edited
  via REST, pushed to devices via driver methods, change-set audited.
* **Audit log** — same JSONL-rotating file as V1.9 (`audit_log_service`).
  Every state change, every config push, every command we initiate.
* **Demand response** — flag 0x22 inbound events trigger a configurable
  shed plan (e.g. dim AG-1 to 50 %).  Plug-in hook, not hard-coded.

```
            ┌─────────────────────────────────────────────┐
            │              Domain bus                     │
            │   (in-process pub/sub, asyncio.Queue based) │
            └────┬────────────┬────────────┬──────────────┘
                 ▼            ▼            ▼
            replica       scheduler     audit-log
            (in-mem +     (re-publishes (jsonl, 100 KB
             Mongo)        on connect)   rotation)
```

### L5 — Public API

REST (FastAPI router mounted at `/api/elc`):

| Method | Path                                | Purpose                       |
| ------ | ----------------------------------- | ----------------------------- |
| GET    | `/api/elc/scus`                     | List configured SCUs + state  |
| POST   | `/api/elc/scus`                     | Register a new SCU            |
| GET    | `/api/elc/scus/{id}/devices`        | Topology (cached)             |
| POST   | `/api/elc/scus/{id}/rescan`         | Force rediscovery             |
| GET    | `/api/elc/devices/{deviceId}`       | Live state + config           |
| POST   | `/api/elc/devices/{deviceId}/relay` | `{state: bool}` → set         |
| POST   | `/api/elc/scenes/{id}/recall`       | Recall a DALI / WGM scene     |
| GET    | `/api/elc/schedule`                 | Normal/Special programs       |
| PUT    | `/api/elc/schedule`                 | Replace schedule + broadcast  |
| GET    | `/api/elc/audit?since=…&limit=…`    | Tail the audit log            |

WebSocket: `GET /ws/elc/events` — server-push of every domain event
(state change, fail, power-up, schedule fired, demand response).  The
dashboard subscribes and updates the live tiles without polling.

---

## 3.  Concurrency model

```
┌────────────────────────  process: red5-elc  ────────────────────────┐
│                                                                     │
│   uvicorn (one process)                                             │
│      ├─ main asyncio event loop                                     │
│      │     ├─ HTTP / WS workers (FastAPI)                           │
│      │     ├─ ScuLink task         × N  (one per SCU socket)        │
│      │     ├─ Router task                (codec → driver dispatch)  │
│      │     ├─ Driver event tasks   × M  (subscribers per flag)      │
│      │     ├─ Scheduler tick       × 1  (1 s heartbeat)             │
│      │     └─ Audit-log writer     × 1  (jsonl flush, 100 ms batch) │
│      └─ Mongo motor pool (async, share-nothing)                     │
└─────────────────────────────────────────────────────────────────────┘
```

Why a single event loop:

* Tasks are I/O-bound (socket + Mongo).
* SCU TCP throughput per link is < 100 frames/s; with 50 SCUs we're at
  5 k frames/s, well inside Python asyncio + uvloop territory.
* Eliminates the GIL contention that a thread-per-SCU model would have
  caused us to fight.

Why NOT threading:

* The protocol is request-response **plus** unsolicited events on the
  same socket.  Anything thread-based requires reader+writer threads
  per link and a serialised handshake to avoid interleaving — asyncio
  gets that for free.

Concurrency rules:

1. **Producers never block consumers**.  All cross-task communication
   goes through bounded `asyncio.Queue`.  On overflow we drop the
   *oldest* state-update (with an audit-log warn) but never the newest;
   audit events are written to a separate, never-dropped queue.
2. **Drivers never call each other.**  Cross-driver flows go through
   the domain bus.  Keeps the dependency graph acyclic.
3. **Reconnect lives in the transport supervisor.**  Drivers see a
   *connected* socket or a `LinkDown` exception, never have to
   reconnect themselves.

---

## 4.  Persistence

Mongo collections (existing controller Mongo instance, new prefix `elc_`):

```
elc_scus          { _id, host, port, name, state, last_seen_iso }
elc_devices       { _id (DeviceId), scu_id, type, name, ag, last_state, last_seen_iso }
elc_schedule      { _id, kind:"normal"|"special_day"|"special_date", ... }
elc_scenes        { _id, scu_id, kind:"dali"|"wgm"|"shg", values:{ ... } }
elc_audit         JSONL file at /root/data/elc_audit.jsonl (100 KB rotation)
                  -- matches V1.9 pattern; queryable via /api/elc/audit
```

In-memory replica = source of truth for *current* values.  Mongo = source
of truth for *configuration* (names, schedules, scenes) and *history*.
On startup the replica is hydrated from Mongo + a fresh poll per SCU.

---

## 5.  Deployment & parity

Mirrors the V1.9 / V2.0 split we already operate:

* **V2.0**: `/app/backend/elc/` package; FastAPI router mounted on the
  existing app.  Mongo via the existing pool.  Reachable from the
  dashboard via `/api/elc/*` and `/ws/elc/events`.
* **V1.9** (field controllers): identical Python code shipped as a
  *plug-in* (`elc_service.py` + `drivers/` subdir) under
  `/root/scripts/`, registered via the same upload_service flow that
  ships `audit_log_service.py` today.  Flask side gets a thin shim that
  proxies `/api/elc/*` into the asyncio runtime (we'll use `anyio` so
  the same code runs under Flask sync handlers via `anyio.from_thread`).
* **Parity gate**: pre-commit hook diff'ing the REST surface between
  the FastAPI router and the Flask plug-in, same pattern as today.

---

## 6.  Phased delivery

| Phase | What                                                              | Done = |
| ----- | ----------------------------------------------------------------- | ------ |
| **0** | Project scaffolding under `archive/Red5-ELC-V3.0/`; CI; pytest    | Tests pass on empty stack |
| **1** | Codec (frame + checksum + DeviceId + flag registry, 8-10 flags)   | 100 % unit coverage on chosen flags |
| **2** | `ScuLink` transport (TCP, supervisor, back-off)                   | Round-trips a Time/Date set+ack against a mock SCU |
| **3** | `SrmDriver` + relay set/query + 0x15 state events                 | Toggle a real relay via FastAPI in dev; audit log shows it |
| **4** | Live state replica + WebSocket event push                         | Dashboard widget shows relay state changing live |
| **5** | Scheduler + Mongo persistence                                     | Re-broadcast on SCU reconnect verified |
| **6** | DSW driver, DALI driver (DT0/DT6 first, DT8 later)                | Wall switch + DALI dimming end-to-end |
| **7** | WGM driver, SHG driver, ELCC48 slave protocol                     | Full device-family coverage |
| **8** | Demand-response hook + plug-in extension API                      | One example plug-in (e.g. shed AG-1 on 0x22) |
| **9** | V1.9 plug-in package + parity gate green                          | Same dashboard works against a V1.9 controller |

Phases 1-3 are roughly the original "Modbus codec/client/driver" pages
in the previous plan, just speaking ELC.  Phase 4 onwards is where this
project starts paying for itself — replacing the PC counterpart's
brain rather than just being a remote control.

---

## 7.  Open questions (to chase down before Phase 1 starts)

1. **Checksum** — doc says "sum of bytes, low byte" for ELCC48; we'll
   adopt that everywhere unless a sample frame proves otherwise.  Need
   one captured frame from a live SCU to confirm.
2. **TCP port** — doc mentions a `setip` debug command sets host/port
   but no default.  Need from you (or capture from one of your SCUs).
3. **Multi-master** — when our controller has the link, can the SCU's
   own LCD/web UI still write?  If yes, we MUST treat every unsolicited
   event as authoritative and never assume our last-write reflects the
   current state.  Plan to assume yes (safer).
4. **Frame fragmentation** — TCP doesn't preserve frame boundaries.  The
   codec's `decode()` already streams a `bytearray`; just confirming we
   never assume one socket-read = one frame.
5. **Time sync** — flag 0x01 broadcast.  Do we want to act as time
   master and push our NTP-synced clock to every SCU on connect?
   Strong yes from me — operators routinely complain about schedule
   drift across SCUs; we get this for free.

---

## 8.  Out of scope (this draft)

* DALI commissioning UI (we'll wrap existing DALI master commands; not
  re-implementing addressing wizard).
* Zigbee/EnOcean PHY — we talk *to* WGM/SHG, not directly to the
  wireless devices.
* SCU firmware updates — separate protocol path; we proxy the bytes
  but don't generate them.

---

## 9.  Repo layout (proposed)

```
/app/archive/Red5-ELC-V3.0/
├── docs/
│   └── ARCHITECTURE.md         (this file)
├── elc/
│   ├── __init__.py
│   ├── codec/
│   │   ├── frame.py            # encode/decode + checksum
│   │   ├── messages.py         # dataclasses per flag
│   │   ├── device_id.py        # 4 B DeviceId codec
│   │   └── registry.py         # flag → (encode, decode)
│   ├── transport/
│   │   ├── tcp_scu.py
│   │   └── supervisor.py
│   ├── drivers/
│   │   ├── base.py
│   │   ├── srm.py
│   │   ├── dsw.py
│   │   ├── dali.py
│   │   ├── wgm.py
│   │   ├── shg.py
│   │   └── elcc48_slave.py
│   ├── domain/
│   │   ├── replica.py          # in-memory + Mongo mirror
│   │   ├── scheduler.py
│   │   ├── scenes.py
│   │   ├── audit.py
│   │   └── bus.py              # in-process pub/sub
│   ├── api/
│   │   ├── rest.py             # FastAPI router
│   │   └── ws.py               # WebSocket fan-out
│   └── plugins/                # extension hook directory
├── tests/
│   ├── codec/
│   ├── transport/              # uses a `MockScu` fake
│   ├── drivers/
│   └── integration/            # end-to-end against MockScu
└── README.md
```

The plug-in directory is intentional — V1.9 operators will want to add
custom demand-response or scene logic without recompiling.  Same shape
as today's `band_overrides_service.py` plug-in.

---

*End of draft v0.1.*  Ready to be opened up for changes before any code lands.
