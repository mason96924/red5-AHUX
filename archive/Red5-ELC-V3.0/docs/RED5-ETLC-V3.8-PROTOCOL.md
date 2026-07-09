# Red5-ELC V3.0 — ETLC Protocol Reference (V3.8, hardware-verified)

Distilled from `ETLC protocol V3.8_202600507 - ESM.docx` (asset #20)
AND from actual RX capture on the operator's physical SCU at
192.168.1.222 on 2026-02-11.  **Where the doc and hardware disagree,
hardware wins.**  This file reflects hardware.

Any change to `elc/codec/etlc38.py` MUST be cross-referenced against
this file.  When code and file diverge, capture the observation here
with a dated bullet.

---

## 1. Wire format (12 bytes, fixed length)

```
byte  0..3   preamble = ASCII "ELC@"  (45 4C 43 40)
byte  4      class byte = 0x07  (SRM/ERM family)
byte  5      device type    (SRM_6S=0x15, SRM_4S=0x14, SRM_6E=0x16, ...)  [P0]
byte  6      SCU byte       (LOW 6 bits = SCU number 0..63;                [P1]
                             HIGH 2 bits = MSBs of the module address)
byte  7      module address (LOW 8 bits — combined with the HIGH 2 bits    [P2]
                             from byte 6 to form a 10-bit module address,
                             0..1023 modules per device type)
byte  8      sub-address    (relay channel index, 0-based on the wire;
                             the V3.0 UI presents it 1-based to operators)
byte  9      opcode         (0x07=RelayOverride, 0x25=RelayStatus)
byte  10     data byte      (state or channel bitmask, opcode-dependent)
byte  11     checksum       = (0x87 - sum(bytes[4..10])) & 0xFF
```

**Note:** the V3.8 doc's talk of `Flag = 0xFFFFFFFF` and 11-byte
frames does NOT match hardware.  Real preamble is `45 4C 43 40`
("ELC@") and frames are 12 bytes.  We suspect the `0xFFFFFFFF` prose
was for a different device class or a discontinued wire version.

### 1.a. Addressing scheme — operator-confirmed 2026-07-09

Bytes `[P0, P1, P2]` (relative to the payload — i.e. wire bytes 5, 6, 7)
together identify **one physical module** on an SCU bus.  Bit layout,
authoritative (bit-order corrected 2026-07-09 from vendor capture):

```
                          bit  7 6 5 4 3 2 1 0
byte 5 (device_type)      ─── [ D D D D D D D D ]   8 bits, device family code
byte 6 (SCU + addr high)  ─── [ S S S S S S|A A ]   HIGH 6 bits = scu (0..63)
                                                    LOW  2 bits = addr[9:8]
byte 7 (addr low)         ─── [ A A A A A A A A ]   LOW  8 bits = addr[7:0]

    scu            (6  bit) =  (byte6 >> 2) & 0x3F              → 0..63
    module_address (10 bit) =  ((byte6 & 0x03) << 8) | byte7    → 0..1023
```

Canonical examples (operator-verified via probe captures):

| scu | address (dec / hex) | byte 6 | byte 7 |
|-----|--------------------:|:------:|:------:|
| 0   | 0                   | `0x00` | `0x00` |
| 0   | 2                   | `0x00` | `0x02` |
| 0   | 255                 | `0x00` | `0xFF` |
| 0   | 256                 | `0x01` | `0x00` |
| 0   | **1023 (0x3FF, broadcast)** | **`0x03`** | **`0xFF`** |
| 1   | 1023 (broadcast)    | `0x07` | `0xFF` |
| 3   | 0                   | `0x0C` | `0x00` |
| 63  | 1023                | `0xFF` | `0xFF` |

Consequences:
* **64 SCUs max** per controller / bus (6-bit SCU field).
* **1024 module addresses max** per (SCU, device_type) tuple —
  each device family has its own address space.
* **Enumeration via PanelInfo broadcast** — set the module address
  to `0x3FF` and every module of the queried device type responds
  with its own real address + relay mask.  A full SRM sweep is
  therefore **two** broadcast queries (`dev_type = 0x14` for 4SRM,
  `dev_type = 0x15` for both 6SRM and 6ERM — see §2), not a per-
  address walk of `[0, 1023]`.

### 1.b. Device family codes to iterate for PanelInfo enumeration

The 13 SRM-class families currently defined by the ETLC V3.8 spec —
each family occupies its own 10-bit address space per SCU, so a full
site sweep is `13 × 64 × 1024 = 851,968` addressable slots (sparse in
practice; only populated slots reply):

| Family    | Notes                                             |
|-----------|---------------------------------------------------|
| `6srm`    | 6-channel switching relay module (`0x15`)         |
| `4srm`    | 4-channel switching relay module (`0x14`)         |
| `elcc48`  | 48-channel controller card                        |
| `erm`     | Extended relay module — 4e / 6e variants (`0x16`) |
| `dsw`     | Dimming switch (generic)                          |
| `dsw4`    | 4-channel dimming switch                          |
| `dsw8`    | 8-channel dimming switch                          |
| `gds4`    | 4-channel general-purpose digital-signal driver   |
| `gds8`    | 8-channel general-purpose digital-signal driver   |
| `gds16`   | 16-channel general-purpose digital-signal driver  |
| `dm`      | Dimmer module                                     |
| `wgm`     | Wall-gang module                                  |
| `shg`     | Shade / drape controller                          |

Byte codes for `dsw*`, `gds*`, `dm`, `wgm`, `shg`, `elcc48` are still
awaiting a hardware RX capture — they must be filled in section 2
before we implement drivers for them.  The addressing math above,
however, is universal across the whole SRM family per operator
confirmation on 2026-07-09.

## 2. Device Type Codes (SRM-class families)

**Operator-confirmed 2026-07-09** — the SRM family uses ONLY TWO wire
codes.  The 6SRM and 6ERM share `0x15`; the SCU cannot distinguish
them by device-type byte alone (address differentiates the modules
in practice).  A PanelInfo broadcast (address `0x3FF`) for `0x15`
returns BOTH families side-by-side, each carrying its own real
address and channel mask.

| Family        | Code (hex) | Channels | Verified? |
|---------------|-----------:|---------:|:---------:|
| `4SRM`        | `0x14`     | 4        | ✅ RX      |
| `6SRM`        | `0x15`     | 6        | ✅ RX      |
| `6ERM`        | `0x15`     | 6        | ✅ RX (shares 0x15 with 6SRM) |
| `48SRM`       | `0x18`     | 48       | ⏳ TBD     |

So a full SRM-family sweep is **two** PanelInfo queries — one for
`0x14`, one for `0x15` — not one per module.  Each query uses the
10-bit broadcast address `0x3FF` (see §1.a).

**Discovery pattern in `POST /api/elc/discover-srms`** (post-fix):
```
driver.panel_info(SRM_4S, scu=0)   # → all 4SRMs on this SCU respond
driver.panel_info(SRM_6S, scu=0)   # → all 6SRMs + 6ERMs respond
```
Each responder's `RelayStatus` frame flows into `_on_v38_bytes`,
per-channel `RelayState` events cascade through the replica's
`_touch()` auto-register path, and the UI paints module dots with
true hardware state.

Awaiting hardware RX capture — placeholders documented so the codec
can be extended in one place once the byte is known:

| Family    | Code (hex) | Channels        | Verified? |
|-----------|-----------:|-----------------|:---------:|
| `ELCC48`  | `TBD`      | 48 (controller) | ❌ pending |
| `DSW`     | `TBD`      | 1 (dim switch)  | ❌ pending |
| `DSW4`    | `TBD`      | 4               | ❌ pending |
| `DSW8`    | `TBD`      | 8               | ❌ pending |
| `GDS4`    | `TBD`      | 4               | ❌ pending |
| `GDS8`    | `TBD`      | 8               | ❌ pending |
| `GDS16`   | `TBD`      | 16              | ❌ pending |
| `DM`      | `TBD`      | 1 (dimmer)      | ❌ pending |
| `WGM`     | `TBD`      | (wall-gang)     | ❌ pending |
| `SHG`     | `TBD`      | (shade)         | ❌ pending |

**Next hardware session — capture task list**:
* Physically toggle each family (or issue the vendor tool's Panel
  Info sweep) with `probe-v38.py --sniff` recording; extract byte 5
  and update the appropriate row above.
* Once known, extend `elc/codec/etlc38.py::DeviceType` enum and
  add golden-bytes tests in `tests/codec/test_etlc38.py`.
* The addressing math in §1.a already covers all of these — only
  the family byte is missing.

## 3. Opcodes (SRM family)

| Purpose                          | Opcode | Direction | Verified? |
|----------------------------------|:------:|:---------:|:---------:|
| RelayOverride (single relay set) | `0x07` | master →  | ⏳ TBD     |
| RelayStatus (module bitmask)     | `0x25` | ← device  | ✅ RX      |

Data byte semantics:
* `0x07 RelayOverride`: `0x01` = ON, `0x00` = OFF for the relay
  identified by `(dev_type, scu, address, sub_address)`.
* `0x25 RelayStatus`: **bitmask** of every channel currently ON for
  the *module* identified by `(dev_type, scu, address)`.  `sub_address`
  in this frame is `0x00`.  Bit N = channel N on.

## 4. Checksum

`cs = (0x87 - sum(bytes[4..10])) & 0xFF`

Verified against 10 distinct observed RX frames.  Constant `0x87` is
likely `0x80 | class_byte` (class byte = 0x07 for SRM); until we've
observed another class byte on the wire, code uses literal `0x87`.

## 5. Golden hardware bytes (from 2026-02-11 log)

Physical switch on module: channel 0 of 6sRM turned ON
```
45 4C 43 40  07 15 00 02 00 25 01 43
```

Physical switch: channels 0+1+2+4+5 of 6sRM ON
```
45 4C 43 40  07 15 00 02 00 25 37 0D
```

Physical switch: all 4 channels of 4sRM ON
```
45 4C 43 40  07 14 00 03 00 25 0F 35
```

Master TX to turn 6sRM/scu=0/addr=2/channel=0 ON (computed, TBD verified)
```
45 4C 43 40  07 15 00 02 00 07 01 61
```

## 6. Items still needing empirical verification

1. Does the SCU accept our RelayOverride (0x07) frame with the
   checksum algorithm above?  If not, adjust in `elc/codec/etlc38.py`
   and re-verify the golden bytes in `tests/codec/test_etlc38.py`.
2. Does the physical relay click when the RelayOverride is sent from
   demo.py using the one-shot-connection strategy?
3. What frames come back after a successful RelayOverride — echo of
   our command, a fresh RelayStatus with the new module mask, or
   nothing at all?
4. Multi-channel `0x08` opcode (batched relay set) — data-byte
   layout with bitmask, TBD.
5. 4eRM vs 6eRM disambiguation (both are `0x16`) — channel count
   inferred from sub-address range.
6. 48sRM layout — 48 channels doesn't fit an 8-bit sub-address;
   likely split across two module addresses.
7. Whether SCU only listens on a fresh connection per command (our
   current design, based on the probe-vs-persistent finding on
   2026-02-11), or can accept multiple commands on a persistent
   socket after a handshake we haven't yet identified.

*Last hardware capture: 2026-02-11 (log lines 20:44 – 21:25).*
