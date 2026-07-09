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

### Phase B — Channel detail modal
- [ ] Clicking a module box opens a **modal** with:
    * Per-channel On/Off toggle rows (one per sub_address)
    * Live-state reflected via dot next to each toggle
    * "Multi-Select" button that flips the modal into a
      checkbox-per-channel selection mode
- [ ] Multi-select mode adds a batch action bar:
    * All On / All Off / Clear (unassign)
    * Assign type = On/Off relay  |  0-10V dimmer
    * Group vs individual state toggle
- [ ] Property editor (`type`, `max_lux`, `beam_radius`, `cct_k`,
      `shape`, `tube_type`) moves into the modal, applying to the
      selection
- [ ] Auto-drop new fixtures at a default coordinate on Multi-Select
      "Apply" so operators can Multi-Select 8 channels and see them
      all on the plan in one go — placement then draggable
- [ ] Modal state persists via `?module=...` query param so refresh
      keeps context

### Phase C — Follow-ups
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

*Last updated: 2026-07-09 Phase A **complete** — Broadcast All On/All
Off cluster wired above the module grid with confirmation dialog and
data-testid coverage.  Phase B next: click a module box to open the
channel-detail modal.*

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
