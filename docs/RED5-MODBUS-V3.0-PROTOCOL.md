# SCU Modbus Protocol Reference — V2.1 Distilled

Source: `SCU_ELC_STANDARD_MODBUS_PROTOCOL_V2.1.docx` (Korean original, extracted 2026-05-29).

This is a distilled, English working reference. Refer to the original for legal/contractual interpretation.

---

## 1. Transport

| Property | Value |
|---|---|
| Mode | Modbus TCP (RTU framing also supported on serial — not used here) |
| TCP connections | **One only** (explicit in spec) |
| Max message length | **50 bytes** (request or response) — significantly tighter than the standard 256-byte Modbus PDU |
| SCU Server ID | 0–31 ("SCU Device No.") |
| Pipelining | Not mentioned. Treat as strict single-outstanding-request. |
| Broadcast | Not mentioned. Avoid. |

---

## 2. Supported function codes

| FC (hex) | Name | Direction | Used for |
|---|---|---|---|
| `0x01` | Read Coils | Read | Relay state, Relay fail, PSS state, DSW state |
| `0x02` | Read Discrete Inputs | Read | Same as 0x01 — symmetric duplication per spec |
| `0x03` | Read Holding Registers | Read | Device Fail bitmask, SCU Date/Time |
| `0x05` | Write Single Coil | Write | Single relay ON/OFF, PSS toggle, Relay Fail Clear |
| `0x0F` | Write Multiple Coils | Write | Batched relay ON/OFF |
| `0x10` | Write Multiple Registers | Write | SCU Date/Time |

`0x06` (Write Single Register) is implied as supported. Higher codes (0x17 / 0x23) not mentioned.

---

## 3. Coil address map (0-based)

| Address range | Count | Function | Device type | Per device |
|---|---|---|---|---|
| 0 – 1999 | 2000 | Relay state | 4SRM | 4 relays × 500 devices |
| 2000 – 3999 | 2000 | Relay fail / Relay fail clear | 4SRM | 4 relays × 500 devices |
| 4000 – 11999 | 8000 | PSS switch | 4SRM | 16 PSS × 500 devices |
| 12000 – 14999 | 3000 | Relay state | 4eRM, 6eRM | 6 relays × 500 devices |
| 15000 – 17999 | 3000 | Relay fail | 4eRM, 6eRM | 6 relays × 500 devices |
| 24000 – 29999 | 6000 | Relay state | 6SRM | 6 relays × 1000 devices |
| 30000 – 35999 | 6000 | Relay fail | 6SRM | 6 relays × 1000 devices |
| 36000 – 51999 | 16000 | PSS switch | 6SRM | 16 PSS × 1000 devices |
| 52000 – 59999 | 8000 | PSS switch | 4eRM, 6eRM | 16 PSS × 500 devices |
| **TBD** | **TBD** | All | **48 sRM** | **48 relays × ? devices** |

**48 sRM layout is not in V2.1 spec.** Per user, the semantics are identical to 4/6 sRM. Awaiting either V2.2 spec or empirical confirmation on hardware.

### Coil address formula

For 4SRM (state block): `coil_addr = device_index * 4 + relay_index`
For 6SRM (state block): `coil_addr = 24000 + device_index * 6 + relay_index`
For 4/6eRM (state block): `coil_addr = 12000 + device_index * 6 + relay_index`

`device_index` is 0-based within the device-type. `relay_index` is 0-based within the device.

---

## 4. Holding register map

| Address range | Count | Function | Device type | Notes |
|---|---|---|---|---|
| 16000 – 16032 | 33 | Device Fail bitmask | 4SRM | One register per 16 devices; bit N = device N failed |
| 50000 – 50062 | 63 | Device Fail bitmask | 6SRM | Same encoding |
| 60000 – 60032 | 33 | Device Fail bitmask | 4eRM, 6eRM | Same encoding |
| 65500 – 65505 | 6 | SCU Date/Time | SCU | Year, Month, Day, Hour, Minute, Second (one component per register) |

**Device Fail vs Relay Fail**: distinct semantics.

- **Relay Fail** (coil block at +2000): a single relay misbehaved on a device that is otherwise communicating.
- **Device Fail** (holding register bitmask): the SCU cannot reach the downstream device at all. When set, the device's holding registers read `0xFFFFFFFF`, the Relay Fail bits are stale (do NOT trust them while Device Fail is set), and the device should be physically checked after multiple consecutive failures.

---

## 5. Write semantics

### Single relay (FC=05)

Coil value: `0xFF00` = ON, `0x0000` = OFF.

Example: turn ON relay 3 of 4SRM device 2 → coil address `10`, value `0xFF00`.

### Multiple relays (FC=0F)

Specify starting coil, count, byte count, bit-packed payload (LSB = first relay).

Example: 4SRM device 1, relays {1=ON, 2=OFF, 3=ON, 4=ON} → starting coil `4`, count `4`, byte count `1`, data `0x0D` (binary `00001101`).

### Write reflection latency

**~1 second** after a write before the same coil reads back the new value reliably. Multi-coil writes may take longer proportional to coil count.

Driver implication: schedule the re-read of any written coil block at `now + 1.2 s` minimum.

---

## 6. Exception codes

Function code OR'd with `0x80` in the response, followed by exception code byte:

| Code | Name | Driver action |
|---|---|---|
| `0x01` | ILLEGAL_FUNCTION | Permanent — log + abort that request type |
| `0x02` | ILLEGAL_DATA_ADDRESS | Permanent — log + investigate config |
| `0x03` | ILLEGAL_DATA_VALUE | Permanent — log + investigate value |
| `0x04` | ACKNOWLEDGE_TIMEOUT | Transient — retry with backoff (up to N) |
| `0x05` | CRC_MISMATCH | Transient — retry once; log if persistent |
| `0x06` | DEVICE_NUM_MISMATCH | Permanent for this server-id — log + alert |
| `0x07` | DEVICE_BUSY | **Transient** — retry with backoff (up to 3). Spec wording suggests SCU's internal queue is full. |
| `0x08` | DEVICE_DATA_LINE_SHORT | Hardware fault — mark affected device fail, log loudly |
| `0x09` | DEVICE_ETC_ALARM | Generic — log + raise alert |

**Note**: spec says exception is `Slave Address + 0x80` followed by exception code. Standard Modbus is `Function Code + 0x80`. **Verify empirically which form the SCU actually uses.** If spec wording is literal, this is a vendor deviation worth special-casing.

---

## 7. Open / unverified items (must test on hardware)

- Byte/word order for multi-register holding values (Date/Time at 65500 is the natural test fixture)
- True exception response format (`FC + 0x80` standard vs `Slave + 0x80` per spec wording)
- Whether the SCU honors larger Modbus PDUs despite the 50-byte spec limit
- Whether `DEVICE_BUSY (0x07)` is recoverable within 100 ms, 1 s, or longer
- 48 sRM register layout
- Whether SCU silently drops a second concurrent TCP connection or accepts and serves it
- Byte order of the SCU Date/Time registers (Year format — 2-byte int or BCD?)

These belong in `docs/phase0_findings.md` once measured.

---

*End of protocol reference.*
