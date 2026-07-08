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
byte  5      device type    (SRM_6S=0x15, SRM_4S=0x14, SRM_6E=0x16, ...)
byte  6      SCU bus number (physical SCU broadcasts as 0)
byte  7      module address
byte  8      sub-address    (relay channel index, 0-based)
byte  9      opcode         (0x07=RelayOverride, 0x25=RelayStatus)
byte  10     data byte      (state or channel bitmask, opcode-dependent)
byte  11     checksum       = (0x87 - sum(bytes[4..10])) & 0xFF
```

**Note:** the V3.8 doc's talk of `Flag = 0xFFFFFFFF` and 11-byte
frames does NOT match hardware.  Real preamble is `45 4C 43 40`
("ELC@") and frames are 12 bytes.  We suspect the `0xFFFFFFFF` prose
was for a different device class or a discontinued wire version.

## 2. Device Type Codes (SRM family)

| Family        | Code (hex) | Channels | Verified? |
|---------------|-----------:|---------:|:---------:|
| `4SRM`        | `0x14`     | 4        | ✅ RX      |
| `6SRM`        | `0x15`     | 6        | ✅ RX      |
| `ERM` (4e/6e) | `0x16`     | 4 or 6   | ⏳ TBD     |
| `48SRM`       | `0x18`     | 48       | ⏳ TBD     |

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
