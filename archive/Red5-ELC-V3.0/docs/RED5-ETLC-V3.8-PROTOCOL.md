# Red5-ELC V3.0 — ETLC Protocol Reference (V3.8)

Distilled from `ETLC protocol V3.8_202600507 - ESM.docx` (asset #20).
This is our single source of truth for the proprietary wire protocol
that the physical SCU speaks (as distinct from `RED5-MODBUS-V3.0-
PROTOCOL.md`, which covers the Modbus fallback).

Any change to `elc/codec/*` MUST be cross-referenced against this
file.  When the doc is inconsistent with hardware behaviour, capture
the observation here with a dated bullet.

---

## 1. Device Type Codes (SRM family)

| Family        | Code (hex) | Code (dec) | Channels | Notes                          |
|---------------|-----------:|-----------:|---------:|--------------------------------|
| `4SRM`        | `0x14`     | 20         | 4        | 4-ch switching RM              |
| `6SRM`        | `0x15`     | 21         | 6        | 6-ch switching RM              |
| `ERM`         | `0x16`     | 22         | 4 or 6   | 4eRM + 6eRM share this code;<br>channel count inferred from sub-address range |
| `48SRM`       | `0x18`     | 24         | 48       | TBD layout                     |
| `SCU`         | `0x05`     | 5          | -        | Head unit                      |
| `SMARTORL`    | `0x01`     | 1          | -        |                                |
| `4DSW`        | `0x0A`     | 10         | 4        | Direct switch, 4-button        |
| `8DSW`        | `0x0B`     | 11         | 8        |                                |
| `STS1/DSW16`  | `0x0C`     | 12         | 16       |                                |
| `STS2`        | `0x0D`     | 13         | -        |                                |
| `SU`          | `0x0E`     | 14         | -        |                                |
| `DALI Master` | `0x1E`     | 30         | -        |                                |
| `WGM-4Switch` | `0x23`     | 35         | -        |                                |
| `WGM-8Switch` | `0x24`     | 36         | -        |                                |
| `SHG`         | `0x25`     | 37         | -        |                                |
| `MultiSensor` | `0x3E`     | 62         | -        |                                |

## 2. Addressing (SRM / ERM / ELCC48 / DSW)

DeviceID is **4 bytes** packed as:

```
[Device Type: 10 bits] [SCU: 6 bits] [Address: 10 bits] [SubAddress: 8 bits]
```

* `Address = 0x3FF` (all ones in 10 bits) is a broadcast wildcard.
* `SubAddress = 0xFF` broadcasts to every channel on a module.
* Two modules of *different type codes* can share an `Address` value --
  the type discriminates them on the wire.

## 3. Framing

For SRM/ERM/ELCC48/DSW frames a **Flag** field (8 bytes, value
`0xFFFFFFFF` for standard protocol) precedes the payload.  Full
frame layout on the wire:

```
[ Flag: 4 bytes (0xFFFFFFFF)   ]  # protocol discriminator
[ DeviceID: 4 bytes            ]  # target device
[ Command byte(s) + payload    ]  # opcode-specific
[ Checksum: 1 byte             ]  # simple sum of all preceding bytes
```

TCP transport is a **server** (SCU listens).  Multi-byte values
inside DSW/WGM/SHG payloads are **little-endian**; the SRM family
convention appears to follow the same rule (to be empirically
verified).

## 4. Opcodes (SRM / ERM / ELCC48)

| Purpose                             | Opcode  | Direction | Notes                                        |
|-------------------------------------|--------:|:---------:|----------------------------------------------|
| Set single relay override           | `0x07`  | master →  | State bit in payload                         |
| Set multiple relays (batched)       | `0x08`  | master →  | Bitmask per module                           |
| Data request (query)                | `0x14`  | master →  | Sub-type `0x11` = `Req_Relay_Status`         |
| Relay state (unsolicited echo)      | `0x15`  | ← device  | Sent on any relay change                     |
| Fail report                         | `0x23`  | ← device  | See §6 for status bit layout                 |
| Relay status (response to `0x14`)   | `0x25`  | ← device  | Payload = current relay bits per module      |
| PSS switch broadcast                | `0x01`  | master →  |                                              |
| Pattern switch broadcast            | `0x02`  | master →  |                                              |
| Normal day schedule broadcast       | `0x03`  | master →  |                                              |
| Special day schedule broadcast      | `0x04`  | master →  |                                              |
| Special date schedule broadcast     | `0x06`  | master →  |                                              |

**0-10V analog dim**: the SRM family does not natively expose a
dim-level opcode in the ETLC spec.  Analog dimming is a **DALI**
command family (see §7); on SRM channels 0-10V is driven by a
separate DM010V board via `0xC1/0xE2/0xD0` messages under DALI
addressing.

## 5. Worked frame examples (from doc)

* **SCU time-broadcast (0x01)** (bit-packed):
  `TTTTTTTT UUUUUUAA AAAAAAAA 00SSSSSS FFFFFFFF SSSSSSSS MMMMMMMM HHHHHHHH DDDDDDDD NNNNNNNN YYYYYYYY YYYYYYYY`

* **SRM Multiple Relay Override (0x08)**:
  - Relay 1-6 all ON: `SubAddr(1)`, `DF0~ : 0x3F 0x3F DI1`
  - Relays 10, 11, 16 ON: `SubAddr(2) DF0~ : 0x86 0x86 DI1`
  - Relays 10, 11, 16 OFF: `SubAddr(2) DF0~ : 0x86 0 DI1`

## 6. Status / error bits

**SCU Ready (0x46) response**:
* `DF0` = SCU number
* `DF1.0` = `ETLC_TX_QUEUE_FULL`
* `DF1.7` = `ETLC_LINE_SHORT`

**DALI Master Device Status (0xC5)**:
* `DF0.0` DALI Line Short
* `DF0.1` Master Fail
* `DF0.2` Master Not Ready
* `DF0.3` Address Allocation in progress
* `DF0.4` DM010V device present
* `DF0.5` Master Available Queue (`1` = not available)
* `DF0.6` Master Download in progress

**WGM/SHG Device State (0xC2)**:
* `DF0.0` Wireless Fail
* `DF0.1` Device Fail
* `DF0.2` Not Ready
* `DF0.3` Queue ≥ 50% full
* `DF0.4` Queue full
* `DF0.5` Wireless / WiFi Fail (SHG only)

## 7. Adjacent protocols (for reference)

* **DALI Master**: `0xC1` (data request), `0xC3` (device type report),
  `0xC5` (status), `0xC7` (photo sensor level), `0xCF/0xE2/0xD0`
  (level control).
* **WGM/SHG**: `0xC1` (data request), `0xC4/0xD4` (WDM equipment info),
  `0xD5` (AG equipment info), `0xD0` (direct LED control), `0xE2..E5`
  (state / group / level echoes).
* **DSW**: `0x6F` (switch options), `0xD6` (address allocation,
  response `0xE1`).
* **ELC48 Master/Slave**: 8-byte address + 8-byte flag + variable
  payload + 1-byte checksum (sum of all preceding bytes).

## 8. Items still needing empirical verification

1. Exact byte order of the `Flag` field on the wire (spec says 4
   bytes = `0xFFFFFFFF`; also referenced as 8 bytes elsewhere).
   **Blocking two-way hardware sync.**
2. Checksum algorithm for SRM family frames -- spec references
   opcode `0x59` (CheckSum) and `0xB2` (Switch Checksum) but the
   arithmetic isn't detailed for standard frames.  Likely simple
   byte-sum modulo 256 (as ELC48 Master uses), to be captured.
3. Whether the SCU echoes `0x15` on receipt of a `0x07` we sent,
   or only on genuine hardware state changes.
4. Behaviour of TCP connection under multiple simultaneous clients
   (SCU is described as a server; SHG allows up to 5 concurrent
   TCP clients, SCU limit unspecified).
5. `48SRM` sub-address layout (48 channels doesn't fit an 8-bit
   sub-addr cleanly; likely split across two module addresses).
6. Whether 4eRM and 6eRM truly share type code `0x16`, or if the
   spec collapses them and hardware disambiguates by sub-address
   range (0-3 vs 0-5).
7. Little-endian assumption for SRM payloads (explicit for DSW/WGM
   only in the doc).

*Last updated: 2026-02-11 (initial extraction from V3.8 doc).*
