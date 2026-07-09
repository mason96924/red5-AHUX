# Red5-ELC V3.0 — Roadmap

## In-flight: SRM Devices Sidebar Redesign (2026-07-09)

Operator wants the right-hand panel restructured from a flat 16-tile
channel grid into a module-first hierarchy with live-state indicators
and a channel-detail modal.

### Phase A — Module-first sidebar + live dots + broadcast  🟨 IN PROGRESS
- [ ] Replace the flat channel grid with **module boxes** (one per
      unique `(dev_type, scu, address)` triple in `state.devices`)
- [ ] Each module box shows:
    * Header line: `SRM_6E · SCU 0 · Addr 1` (device family + bus + address)
    * Row of channel dots — one dot per sub_address in the module
    * Dot colour: green = ON, dim grey = OFF, hollow = unknown
    * Live-update via SSE `relay_state` events (already flowing)
- [ ] Top-of-panel **Broadcast** cluster:
    * "All On" — POST relay=true to every registered device (per-
      channel loops; multi-relay opcode 0x08 lands after Phase B
      hardware verification)
    * "All Off" — mirror
    * Confirmation dialog is always shown (safer)
- [ ] Preserve current selection semantics: clicking a module box
      still adds all its channels to `state.selectedDeviceIds`,
      so the existing align/delete cluster in the toolbar keeps
      working
- [ ] `data-testid` attributes on every new interactive element

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

*Last updated: 2026-07-09 Phase A kickoff.*
