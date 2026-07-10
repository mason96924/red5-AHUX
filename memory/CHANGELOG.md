# Changelog

Reverse-chronological log of shipped changes.  PRD.md holds the
original problem statement + long-form architecture; this file just
captures what has been implemented and when.

## 2026-02-11 — Schedule Editor: Group ↔ Popout sync + placedSet bug fix

### What shipped

- **Group card is the source of truth.**  `refreshAll` fetches
  every group's members in parallel into `state.groupMembers`.  On
  popout open, `_syncMaskFromGroup` overwrites the localStorage
  mask for each module on the floor so checkbox-checked = "member
  of linked group".  Popout title shows `— linked to group: [Name]`
  and a `[N changes staged]` amber badge when marks deviate.
- **`state.contextGroupId`** is set by any group interaction (dot
  click, floor ×, drop) so the popout mirrors the last-touched
  group.  `_lastPopoutSyncKey` invalidated after refreshAll to
  reflect fresh state.
- **Floor × in group card resets ALL relays** of every module on the
  floor (uses `state.devices` to enumerate).  No residual memberships.
- **`placedSet` filter removed from `_floorModulesForFloor`** -- the
  ROOT of "drop didn't override" bug.  Previously, checking a relay
  that wasn't literally in `state.floorPlacements` (common because
  placement doesn't always list every channel of every module) got
  silently filtered from the drag payload.
- **Floor drop uses SET semantics** (`_syncFloorsToGroup`).  For
  the modules in the payload, the group's members are made to
  exactly equal the payload's channels: DELETEs current members
  not in payload; POSTs channels not yet members.  Toast reports
  `synced (+X / -Y, target N ch)`.
- **Tests**: 394/394 pytest passing.


## 2026-02-11 — Settings wizard (bootstrap flow) + astro sun-times

### What shipped

- **New `configs/project.json`** — one human-readable file capturing
  the site's identity: project profile (name, timezone, lat/lng,
  sunrise/sunset offsets) + SCU list + per-SCU module inventory
  (dev_type / address / note / discovered flag).
- **`elc/config/project.py`** -- pydantic model + atomic save/load
  (temp-file + rename, `.bak` backup on overwrite).  Validators
  reject duplicate SCU ids / duplicate module addresses / bad
  dev_types.  `to_devices_json()` expands the SCU→module hierarchy
  into the flat `[{dev_type, scu, address}, ...]` list the demo's
  `_load_device_set` already consumes.
- **`elc/util/astro.py`** -- wraps `astral>=3.2` (pure Python).
  `sun_times_for(lat, lng, tz_name, on=?, sunrise_offset_min=?,
  sunset_offset_min=?)` returns dawn / sunrise / solar_noon /
  sunset / dusk (local + UTC), day_length_min.  Applies offsets to
  sunrise/sunset only; civil twilight boundaries untouched.
- **REST endpoints** (in `scripts/demo.py`, `include_in_schema=False`):
  * `GET  /api/elc/project`               -- read
  * `POST /api/elc/project`               -- validate + persist
  * `POST /api/elc/project/expand-devices` -- flat device list
  * `GET  /api/elc/sun-times?date_iso=?` -- today's or given-date
    solar events for the project coords
  * `GET  /settings`                       -- serves settings.html
- **Bootstrap redirect middleware**: `/`, `/floor`, `/editor` are
  302→`/settings` when no project.json (or empty) exists.  Bypass
  via `?force=1` on any of those routes.
- **`demo/settings.html`** -- wizard UI with 3 sections:
  1. Project profile (name/tz/lat-lng/offsets), "Use browser location"
     button that fills lat/lng from `navigator.geolocation`, live
     sun-times preview strip.
  2. SCUs & Modules: repeatable SCU blocks (bus id, name, host, port,
     Discover, × Remove).  Each SCU has an inline modules table with
     dev_type dropdown, address, note, × delete.  Discover button
     merges results from `/discover-srms` (marks each merged row
     `discovered: true`).
  3. Preview & Save: live JSON preview + sticky footer (Reload / Save
     & continue → auto-redirects to /floor after save).
- **Tests** (`tests/config/test_project_config.py`): 11 new tests
  covering channel-count-by-type, validator rejections, save/load
  round-trip + backup, absent-file → None, `is_configured` gating,
  `to_devices_json` shape, sun-times keys / Bangalore sanity /
  offset-shift semantics.  Full suite: **410/410 passing** (up from
  399).

### Deferred

- Hot-reload of the driver on save: today the JSON is committed but
  the SCU link stays bound to the previous inventory; operator
  restarts `demo.py` to pick up new modules.  A hot-reload path
  (driver.rebind + rediscover) is a follow-up.
- Timezone dropdown (currently free-text `p-tz`): swap for the
  IANA-tz list once we settle on a source (browser Intl or bundled).


## 2026-02-11 — SCU Data Reports (opcode 0x14, protocol §8)

### What shipped

- **Codec** (`elc/codec/etlc38.py`):
  * New constants: `OPCODE_DATA_REQUEST` (alias of 0x14),
    `DATA_TYPE_RELAY_STATE` (0x11), `DATA_TYPE_TOTAL_ONTIME` (0x06),
    `DATA_TYPE_DAILY_ONTIME` (0x07), `DATA_TYPE_MONTHLY_ONTIME`
    (0x08), `DATA_TYPE_DAILY_POWER` (0x0A),
    `DATA_TYPE_MONTHLY_POWER` (0x0B).
  * `DataRequestV38(device, data_type)` generalises the existing
    `StatusQueryV38` -- `data_type=0x11` is byte-equivalent (regression
    covered by test).
  * `DataReportV38` -- variable-length RX decoder (LL-byte-driven).
    `try_decode(frame, expected_data_type)` returns a report; the
    `parse_payload()` method parses `0x06` into
    `{total_cycle, total_ontime, month_ontime, day_ontime}` per
    operator-confirmed DF layout, and returns raw hex only for the
    other data types (pending real hardware capture).
- **Driver** (`elc/drivers/srm.py`):
  * `SrmDriver.request_relay_data_v38(device, data_type, timeout=1.5)`
    -- fresh one-shot TCP query (SCU single-connection constraint),
    length-driven RX read, decodes via `DataReportV38`, returns dict.
- **REST** (`elc/api/rest.py`):
  * `GET /api/elc/relay-data?device={did}&data_type={hex_or_dec}` --
    wraps the driver method.  Returns parsed fields + `raw_hex` +
    `tx_hex`.  No DB persistence.  503 when link disconnected; 400
    when link is not V3.8.
- **UI** (`demo/floor.html`):
  * Relay drill-down panel (`#ee-ops`) now includes a **"SCU
    Reports"** section with 5 buttons: Total & On-Time / Daily On-
    Time / Monthly On-Time / Daily Power / Monthly Power.  Result
    pane shows parsed values (when we have a decoder) + tx / rx
    hex for operator inspection.  Live query only -- no history.
- **Protocol doc** (`docs/RED5-ETLC-V3.8-PROTOCOL.md`):
  * New §8 documenting the data-request family, TX + RX layouts,
    per-data-type DF interpretations, consumer paths, safety
    guarantees.
- **Tests**: 5 new codec tests (encode DF0, back-compat with
  StatusQueryV38 wire bytes, 0x06 payload parse, unknown-type raw
  fallback, checksum-corruption reject).  Full suite: 399/399.

### Deferred items

- Real DF-layout parsers for `0x07/0x08/0x0A/0x0B` -- awaiting
  hardware RX capture (raw hex is exposed in UI + REST so operator
  can validate then extend `parse_payload`).
- Units for on-time counters (currently marked `seconds` -- TBD).



### What shipped

- **Group card is the source of truth.**  `refreshAll` fetches
  every group's members in parallel into `state.groupMembers`.  On
  popout open, `_syncMaskFromGroup` overwrites the localStorage
  mask for each module on the floor so checkbox-checked = "member
  of linked group".  Popout title shows `— linked to group: [Name]`.
- **`state.contextGroupId`** is set by any group interaction (dot
  click, floor ×, drop) so the popout mirrors the last-touched
  group.  `_lastPopoutSyncKey` invalidated after refreshAll to
  reflect fresh state.
- **Floor × in group card resets ALL relays** of every module on the
  floor (uses `state.devices` to enumerate, not just
  `state.floorPlacements`).  No residual memberships remain.
- **placedSet filter removed from `_floorModulesForFloor`** -- the
  ROOT of "drop didn't override" bug.  Previously, checking a relay
  that wasn't literally in `state.floorPlacements` (common because
  placement doesn't always list every channel of every module) got
  silently filtered from the drag payload.  Now: if a module has
  ANY placement on the floor, ALL its channels are draggable.
- **Floor drop uses SET semantics** (`_syncFloorsToGroup`).  For
  the modules in the payload, the group's members are made to
  exactly equal the payload's channels: DELETEs current members
  not in payload; POSTs channels not yet members.  Toast reports
  `synced (+X / -Y, target N ch)`.
- **Group members view (unchanged, kept from prior iteration)**:
  every module on a group's floor shows ALL channels as dots
  (solid = member, hollow = not).  Click any dot to toggle.  No
  × on module rows; × on floor header now wipes all channels of
  all modules.
- **Tests**: 394/394 pytest passing.


## 2026-02-25 — V3.0 Phase 6.1M: ETLC V3.8 burst-broadcast (opcode 0x07)

### What shipped

- **Broadcast ALL ON / ALL OFF via burst opcode `0x07`** matching the
  operator-confirmed 2026-07-25 hardware protocol note.  Per module,
  N concurrent frames land on the SCU (N = max channel count across
  discovered SRM-family modules — 4 for 4SRM-only, 6 when any 6SRM/
  6ERM is present, 48 for 48SRM) using `asyncio.gather` over
  independent one-shot TCP sockets.  No inter-frame delay, no per-
  frame serialisation lock — matches "almost simultaneously without
  waiting for the RX".
  - New driver method: `SrmDriver.broadcast_v38(state, modules,
    max_channels=None)` in `elc/drivers/srm.py`.  Auto-derives
    `max_channels` from `channel_count_for(dev_type)` when omitted.
  - New burst helper: `SrmDriver._v38_burst_send(frames)` — bypasses
    the `_v38_write_lock` used by singular relay ops.
  - Legacy `driver.broadcast(...)` wildcard-`RelaySet` path is
    unchanged so mock/dev-mode and Phase-4 broadcast-complete tests
    keep working byte-for-byte.
- **REST `POST /api/elc/broadcast`** now enumerates registered SRM
  modules from the replica, dedupes by `(dev_type, scu, address)`,
  and routes v38 links through `broadcast_v38`.  Response includes
  `mode: "v38_burst"` + `modules` + `max_channels` + `frames`
  counters so the UI can surface exactly how many frames landed on
  the wire.  Empty-inventory case returns a `note` hinting the
  operator to run `POST /discover-srms` first.
- **Frontend broadcast bar** (`demo/floor.html`) now fires one
  server-side call instead of a browser-serialised loop of per-
  channel POSTs.  Toast surfaces `modules × ch = frames` for
  transparency; falls back to a helpful "no SRM modules known"
  toast when the discovery step hasn't run yet.
- **`Replica` remains the source of truth** — each module answers
  with a single `0x25 RelayStatus`, `_on_v38_bytes` decodes the
  channel mask, and `Replica` mirrors whatever the hardware
  reports (not the commanded state).  Confirmed by the new
  regression test.
- **`docs/RED5-ETLC-V3.8-PROTOCOL.md` §7** now documents the burst
  protocol byte-for-byte.
- **6 new regression tests** in
  `tests/drivers/test_srm_broadcast_v38.py`:
  - Frame count = `modules × max_channels`, opcode 0x07, correct
    state byte (parametrised ON/OFF).
  - Dispatched concurrently (< 1s for 18 frames; < 0.5s dial
    spread) — pins the anti-serialisation contract.
  - Empty-module list is a no-op.
  - `Replica` trusts the SCU's `0x25` reply mask.
  - `max_channels=None` auto-derives from widest module.
- **Full suite still green: 394 tests pass** (391 pre-existing +
  3 net new after parametrisation).


## 2026-02-11 — V3.0 Phase 6.1L: ETLC V3.8 hardware protocol scaffolding

### What shipped

- **Live on/off + 0-10V dim controls** on the floor-plan element editor
  sidebar (`floor.html`).  Dim slider is a UI stub (`{mocked: true}`)
  until the analog wire frame lands.
- **Delete-from-canvas button** in the floor toolbar; same effect as
  Delete/Backspace, kept next to Align H/V.
- **Sort placed devices in DIN-rail order** (`Replica.all()` sorted
  by `(scu, address, dev_type, sub_address)`), matched client-side
  in editor + floor pages.
- **Canvas + operator mode now respect `relay_state=false`** — was
  hard-coded ON in layout mode; dim slider modulates canvas beam
  brightness via `fixtureBrightness()`.
- **Device-id canonicalisation** on floor read
  (`elc/floors/routes.py`) — old placements with stale enum-alias
  or SCU-number strings get rewritten to the current canonical form
  so the SRM-grid purple highlight fires correctly on canvas click.
- **V3.8 wire codec scaffolding**: `elc/codec/etlc38.py` +
  `docs/RED5-ETLC-V3.8-PROTOCOL.md` + `scripts/probe-v38.py` +
  `scripts/probe-variants.py`.  ScuLink gained a `wire_version="v38"`
  mode with a raw-bytes handler channel; SrmDriver opens a fresh
  TCP socket per command (mimics probe behaviour).
- **Checksum algorithm verified** against 10 observed RX frames:
  `cs = (~(sum(data) + 0x80) + 1) & 0xFF`, matches doc text exactly.
- **Preamble is 3 bytes "ELC"** (not 4 bytes "ELC@" as we first
  assumed).  Codec + tests updated accordingly.
- **391 tests passing**; every observed hardware RX byte is baked
  into `tests/codec/test_etlc38.py` as a golden regression.

### Known hardware blocker

None of the four master→SCU RelayOverride variants tried on 2026-02-11
elicited any response from the physical SCU:

  * Type=0x07 minimal (5 data bytes)
  * Type=0x07 with 1-byte Flag=0xFF
  * Type=0x07 with 4-byte Flag=FFFFFFFF
  * Type=0x08 multi-relay bitmask

The SCU RX path (physical switch on module → SCU broadcasts
Type=0x40 RelayStatus 0x25) works and our codec decodes it perfectly.
The TX path is blocked pending ground-truth from a working ETLC
master (vendor Windows tool / touch panel / mobile app) captured via
`tcpdump -w vendor.pcap 'host 192.168.1.222 and port 9760'`.  See
`docs/RED5-ETLC-V3.8-PROTOCOL.md §6` for the six ambiguities that
need resolving.


## 2026-02-11 — V3.0 Phase 6.1k: SCU-aware editor "Seed" button

The editor page's `Seed 30 demo devices` button was hardcoded to the
mock topology (30 SRMs at `SRM/1/{10..300}/0`) *and* seeded by firing
`state: true` RelaySet writes — safe against MockScu, dangerous
against a real SCU (would physically switch every relay on).

### Backend
- `Replica.register(device)` — new public method (`elc/domain/replica.py`).
  Creates a snapshot with `relay_state=None` (unknown), emits a
  `device_registered` event, and is idempotent.
- `GET /api/elc/demo-devices` — returns `{source, count, devices}`
  where `devices` is the list loaded from `ELC_DEVICES_JSON` (or the
  30-SRM mock grid when unset).  Used by the editor to relabel the
  Seed button and drive the safe-seed loop.
- `POST /api/elc/devices/{id}/register` — safe replica-only insertion,
  no `RelaySet` frame emitted.  Verified by test that asserts
  `mock_scu_server.received_frames == []` after registration.
- `build_router` / `build_stack` grew `demo_devices` +
  `data_source` params; `scripts/demo.py` passes both through.

### Frontend (`demo/editor.html`)
- Seed handler now fetches `/demo-devices`, calls `/register` per
  entry (no relay flip), and toasts a source-aware message.
- Button label + tooltip auto-update on load: "Seed 16 SCU channels"
  in physical mode, "Seed 30 demo devices" in mock.
- Empty-state hint copy no longer hardcodes "30".

### Tests
- 5 new pytest cases in `tests/integration/test_rest.py` covering:
  default-mock demo-devices, physical-inventory demo-devices,
  register-doesn't-emit-frames, register-idempotency, bad-id 400.
- Full suite: 368/368 passing.


## 2026-02-07 — V3.0 Phase 6.1d: Non-point Shapes + Compliance Heatmap

Two visualisation features on top of the wall-clipping foundation:

### 1. Non-point Light-source Shapes
`lighting_elements.shape` now supports **5 categories**: `point`,
`stick` (fluorescent tube), `strip` (LED strip), `ring`, `polyline`
(LED strip forming an arbitrary outline).  Each fixture placement
carries its own geometry (`angle_deg`, `length_m`, `radius_m`,
`vertices`) so the same "LED strip" element can be cut to different
lengths per floor.

**Rendering:** `sampleShapePoints(fx, el)` in `demo/floor.html`
samples the shape's centre line and drops overlapping radial
gradients along it.  With additive compositing the result reads as
a tube (stick/strip), an annulus (ring), or a custom outline
(polyline).  Per-sample lux is scaled by `1/√N` so long strips stay
peak-matched to point sources.

**UI:** Toolbar dropdown "Shape" (`data-testid="shape-picker"`)
selects the shape for the *next* placement.  Dropping an SRM tile
with a non-point shape plants the anchor and enters a click-flow
banner: click endpoint for stick/strip, click radius edge for ring,
click each vertex + Enter/double-click for polyline.  Escape
cancels.  Live rubber-band preview drawn on canvas.  Element
editor gained a `Shape` `<select>` so shapes can also be changed
after placement.

### 2. Compliance Heatmap Toggle
Toolbar toggle `Heatmap: On/Off`
(`data-testid="floor-heatmap-toggle"`) colours each room by
average lux vs code-compliance minimum.

- **Per-room threshold** — `_infer_room_type()` on backend maps DXF
  room name substrings ("office", "corridor", "meeting", "kitchen",
  "warehouse", "workspace", "bathroom", "storage") to types.  Types
  → default min lux via `_ROOM_MIN_LUX_DEFAULTS` (office=300,
  corridor=100, meeting=300, warehouse=200, ...).  Rooms carry both
  fields (`type`, `min_lux`) with explicit overrides supported on
  create/update.
- **Sampling** — `paintHeatmapOverlay()` calls `ctx.getImageData()`
  on the already-lit canvas (per-user choice: "what the eye sees
  IS what gets scored"), samples every 3rd pixel inside each
  polygon's bounding box, ray-casts against the polygon, and
  averages Rec-709 luminance.  Inverse of `luxToAlpha()` recovers
  lux estimate.
- **Colouring** — green (>= min), amber (within 10 % below), red
  (below).  Room-name + `avg/min lx` label at each polygon
  centroid; corner legend explains the palette.

**Backend Schema:**
- `lighting_elements.shape` column added with `'point'` default; additive `ALTER TABLE` migration for legacy DBs.
- `_validate_fixture` accepts optional `angle_deg`, `length_m`, `radius_m`, `vertices` (validated).
- `_validate_rooms` accepts optional `type` (enum of 9 room types) + `min_lux`; defaults inferred when omitted.
- `DxfConversion.rooms` unchanged — room `type` gets inferred lazily at store-write time from `name`.

**Tests added (24 new):**
- `test_store.py::TestRoomTypeAndMinLux` (5) — type inference, override, validation.
- `test_store.py::TestFixtureShapeGeometry` (6) — geometry round-trip + validation.
- `test_lighting.py::TestUpsert::test_shape_persisted`, `test_bad_shape_rejected`.
- `test_lighting.py::TestUpsert::test_create_minimal` gained `shape="point"` assertion.

Full suite: **353 tests, all green** (up from 340).

**Verification:**
- `/tmp/floor_shapes.png` — Office 1 = point bulb, Office 2 = stick (horizontal tube), Kitchen = ring (annular halo), Corridor = long LED strip, Meeting Room A = polyline forming a rectangular picture-frame.
- `/tmp/floor_heatmap.png` — traffic-light overlay + per-room "avg/min lx" labels; empty rooms glow red, well-lit rooms green, Kitchen shows amber "281/300 lx" (marginal).

Files touched: `elc/config/store.py`, `elc/floors/{store,lighting,routes}.py`, `demo/floor.html`, 2 test files.

---

## 2026-02-07 — V3.0 Phase 6.1c: Wall/Partition Clipping for Lighting Visualization

Fixture light gradients on the top-down floor canvas now respect room
partition walls — a lamp in Office 1 no longer bleeds into Office 2 or
the corridor.  End-to-end shipped: DXF room extraction → DB storage →
canvas clipping.

**Backend (Red5-ELC-V3.0):**
- `elc/config/store.py`: added `rooms_json` column to the `floors`
  table schema, plus an additive `ALTER TABLE` migration for legacy
  DBs that were created before the column existed.
- `elc/floors/store.py`: plumbed `rooms` through `create_floor` /
  `update_floor` / `get_floor` / `list_floors` with a new
  `_validate_rooms` guard (>=3 vertex pairs per polygon).
- `elc/floors/dxf.py`: `DxfConversion` now carries a `rooms` list;
  `_extract_rooms()` pulls every closed LWPOLYLINE on layer `ROOMS`
  out of the modelspace, translates to metres with a Y-flip so
  coordinates match the SVG viewport, and returns
  `{id, name, vertices}` dicts.  The ROOMS layer is turned off
  before SVG rendering so the polygons are invisible in the plan
  itself.
- `elc/floors/routes.py`: `POST /floors`, `PATCH /floors/{id}`, and
  `POST /floors/import-dxf` all accept / return `rooms`.
- `scripts/make_sample_dxf.py`: new `_room()` helper emits closed
  polylines on the `ROOMS` layer + XDATA room names.  The 40×25 m
  office sample now carries 9 rooms (4 offices, kitchen, corridor,
  2 meeting rooms, open workspace); warehouse sample carries 2.

**Frontend (`demo/floor.html`):**
- Added `pointInPolygon`, `findContainingRoom`, `tracePolygonPath`
  helpers.
- In `paintCanvas()`, each fixture's radial gradient is now drawn
  inside a `save() → clip() → restore()` block.  Clip region is the
  smallest room polygon containing the fixture; if none matches
  (e.g., corridor without a closed boundary in the DXF), clip
  falls back to the floor's outer bounding box so light doesn't
  spill off the plan.

**Tests:** 340 / 340 green (11 new).
