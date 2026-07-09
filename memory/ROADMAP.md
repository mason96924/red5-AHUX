# Red5-ELC V3.0 — Roadmap

## In-flight: SRM Devices Sidebar Redesign (2026-07-09)

Operator wants the right-hand panel restructured from a flat 16-tile
channel grid into a module-first hierarchy with live-state indicators
and a channel-detail modal.

### Phase A — Module-first sidebar + live dots + broadcast  ✅ DONE (2026-07-09)
- [x] Replace the flat channel grid with **module boxes** (one per
      unique `(dev_type, scu, address)` triple in `state.devices`)
- [x] Each module box shows:
    * Header line: `SRM_6E · SCU 0 · Addr 1` (device family + bus + address)
    * Row of channel dots — one dot per sub_address in the module
    * Dot colour: green = ON, dim grey = OFF, hollow = unknown
    * Live-update via SSE `relay_state` events (already flowing)
- [x] Top-of-panel **Broadcast** cluster:
    * "All On" — POST relay=true to every registered device (per-
      channel loops; multi-relay opcode 0x08 lands after Phase B
      hardware verification)
    * "All Off" — mirror
    * Confirmation dialog is always shown (safer)
- [x] Preserve current selection semantics: clicking a module box
      still adds all its channels to `state.selectedDeviceIds`,
      so the existing align/delete cluster in the toolbar keeps
      working
- [x] `data-testid` attributes on every new interactive element
      (`broadcast-bar`, `broadcast-on`, `broadcast-off`,
      `module-box-{type}-{scu}-{addr}`, `mod-dot-{device_id}`)

### Phase B — Channel detail modal  ✅ DONE (2026-07-09)
- [x] Clicking a module box opens a **modal** with:
    * Per-channel On/Off toggle rows (one per sub_address)
    * Live-state reflected via dot next to each toggle (SSE-driven)
    * "Multi-Select" tab that flips the modal into a
      checkbox-per-channel selection mode
- [x] Multi-select mode adds a batch action bar:
    * Select all / Clear
    * All On / All Off / Un-assign
- [x] Property editor (`type`, `max_lux`, `beam_radius`, `cct_k`,
      `shape`, `tube_type`) now lives inside the modal, applying
      to the current selection via bulk-assign + PUT.
- [x] **Copy from…** dropdown at the top of the property editor —
      grouped by module, pre-fills every field from an existing
      assigned channel (any module, any floor).  Turns "make these 8
      match that one" into two clicks.
- [x] Auto-drop unplaced channels at a small grid inside the current
      floor's 10% inset on "Apply" — operator can multi-select N
      channels and see them all on the plan in one go.
- [x] Modal state persists via `?module=...` query param, restored
      on page load once devices are refreshed.
- [x] Escape / backdrop-click / × button all close.
- [x] Ctrl/Cmd/Shift-click on the module box preserves the legacy
      "select all channels into canvas selection" behaviour for the
      align/delete toolbar workflows.

### Phase C — UX consolidation  ✅ DONE (2026-07-09 batches 2 + 3 + 4)
- [x] LHS floor list collapsed into a header **Floor** dropdown; the
      `＋ New floor…` action lives inside the dropdown itself.
- [x] Floor details moved into a **pop-up modal** opened via a new
      **Details** header button (enabled only when a floor is loaded).
- [x] DXF import moved into the floor details modal.  Sample-DXF
      download links and the standalone Import DXF toolbar button
      were removed.
- [x] **Schedules** header button opens the schedule / group editor
      (`/editor`) inside an iframe modal — the operator never leaves
      the floor page to bind schedules to groups.
- [x] Module modal — **modes merged (batch 4)**.  No more
      Individual / Multi-Select tabs; every row shows both a
      checkbox (for multi-row Save) AND an ON/OFF toggle button
      (for immediate relay operations).  Property editor and batch
      bar are always visible.  "Apply" renamed to
      "Save changes to selection".
- [x] Module modal channel rows are drag sources — assigned AND
      un-assigned.  Un-assigned drop auto-upserts a sane `onoff`
      default.
- [x] All three modals draggable via header, viewport-clamped.
      Panel position resets to centred on close.
- [x] `.mm-backdrop.dragging` transparent + pointer-events:none so
      the canvas underneath receives the drop.
- [x] Header **Discover SRMs** button + backend
      `POST /api/elc/discover-srms` (SRM-family only).
- [x] Purple `.opened` highlight on the module box whose modal is
      open — restores the visual that was orphaned when the click
      behaviour changed.
- [x] Canvas element-editor toggle now calls `renderSrmGrid()` and
      `renderModuleModal()` — module dots + open-modal rows flip
      immediately, no waiting for the SSE echo.
- [x] Property Save is reflected on canvas via `paintCanvas()` inside
      `_mmApplyProps` — already in place; verified with the merged
      layout that gives the Save button a permanent home.

### Phase C — Follow-ups (deferred)
- [ ] One-shot cleanup: delete orphaned legacy 0-based placements
      (script `scripts/purge-legacy-channels.py`)
- [ ] Persist "last opened module" between page loads
- [ ] "Live device inventory" panel with last-heard-from timestamps
      (already discussed — a commissioning aid)

---

## Prior roadmap items (pre-2026-07-09, still applicable)

### P1 - Hardware protocol
- [x] ETLC V3.8 wire codec verified against vendor tool capture
- [x] Bi-directional hardware sync (canvas ↔ physical relays)
- [ ] Multi-relay opcode `0x08` (batched updates, more efficient
      than per-channel 0x07 for broadcast operations)
- [ ] 0-10V analog dim wire frame (Phase 6.2) — currently a UI stub
      emitting `dim_level` events with `mocked: true`
- [ ] 48SRM channel-layout empirical verification
- [ ] Fail report (`0x23`) parser — surface hardware faults in the
      Live Events panel

### P2 - Persistence
- [ ] SQLite-backed audit log — every relay change / RelayStatus
      event streamed to disk with timestamp for post-incident review
- [ ] Wire FailReport → DB

### P2 - Observability
- [ ] SA drift alerting service `/api/ahu-drift-scores`
- [ ] Toast/email/webhook triggers on drift threshold breach

### Backlog
- Style unknown-state channels distinctly from OFF in the SRM grid
- Auto-seed on connect so operators don't have to click Seed after
  each restart
- 4eRM vs 6eRM disambiguation (both use type code 0x16)
- Deploy-lock button (temporary "read-only" mode for critical ops)

*Last updated: 2026-07-09 Phase A **and** Phase B **complete**.  Phase
C follow-ups remain: legacy 0-based placement purge, "last opened
module" persistence, live inventory panel with last-heard-from
timestamps.*

---

## 2026-07-09 — ETLC V3.8 addressing scheme clarified (operator note)

Operator confirmation captured verbatim in
`archive/Red5-ELC-V3.0/docs/RED5-ETLC-V3.8-PROTOCOL.md` §1.a — future
agents implementing device enumeration or new drivers **must** read
that section before writing any codec/driver code.

TL;DR:
* Wire byte 5 = 8-bit device_type.
* Wire byte 6 = **low 6 bits = SCU (0..63), high 2 bits = addr[9:8]**.
* Wire byte 7 = **addr[7:0]**.
* Therefore module_address is **10 bits (0..1023)** per (SCU, family).
* Device families to walk for a full `PanelInfo` sweep:
  `6srm, 4srm, elcc48, erm, dsw, dsw4, dsw8, gds4, gds8, gds16,
   dm, wgm, shg`  (13 families × 64 SCUs × 1024 addrs).
