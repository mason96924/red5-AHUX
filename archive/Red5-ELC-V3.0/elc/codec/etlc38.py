"""ETLC V3.8 wire codec — probe implementation.

Best-guess V3.8-compliant encoding of a single ``RelaySet`` frame.
Used ONLY when the SCU driver is in physical mode; MockScu still
speaks the legacy ``elc.codec.frame`` format.

See ``docs/RED5-ETLC-V3.8-PROTOCOL.md`` for the spec this implements.
The doc has known ambiguities (§8) -- this module makes explicit
choices for each so a *single* physical-hardware probe can resolve
them:

* Flag length: **4 bytes** (spec is inconsistent 4-vs-8; we picked
  the smaller which is what the SRM/ERM section text prefers).
* DeviceID bit layout: **Type(8) + SCU(6) + Address(10) + SubAddr(8)**
  = 32 bits total.  The doc text says Type(10) but every actual code
  value listed is < 0x40 (fits in 6 bits), and the SCU time-broadcast
  frame example uses ``TTTTTTTT UUUUUUAA AAAAAAAA 00SSSSSS`` which
  clearly gives Type 8 bits.  Trust the example over the summary.
* Endianness: **big-endian** for DeviceID (matches SCU time-broadcast
  example above); little-endian on multi-byte payload values.
* Checksum: **sum of every byte from Flag through end of payload,
  modulo 256** (matches the ELC48 Master/Slaver algorithm; the SRM
  section defers to "checksum" without further detail).

After the probe frame is verified on real hardware, this module will
be promoted to the primary codec and the legacy ``frame.py`` will
migrate to a "MockScu-only" role.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Final

from elc.codec.device_id import DeviceId, DeviceType

FLAG_STANDARD: Final[bytes] = b"\xff\xff\xff\xff"

# Opcodes per V3.8 spec (SRM / ERM / ELCC48 family).
OPCODE_RELAY_OVERRIDE: Final[int] = 0x07        # single relay set
OPCODE_MULTI_RELAY_OVERRIDE: Final[int] = 0x08  # batched via bitmask
OPCODE_DATA_REQUEST: Final[int] = 0x14          # query -> subtype 0x11
OPCODE_RELAY_STATE: Final[int] = 0x15           # unsolicited echo
OPCODE_FAIL_REPORT: Final[int] = 0x23
OPCODE_RELAY_STATUS: Final[int] = 0x25          # response to 0x14/0x11

SUBTYPE_REQ_RELAY_STATUS: Final[int] = 0x11


class EtlcFrameError(ValueError):
    """Raised when a frame is structurally invalid."""


def encode_device_id_v38(dev: DeviceId) -> bytes:
    """Pack a DeviceId into the V3.8 4-byte on-wire layout.

    Bit layout (MSB → LSB, big-endian):

        31..24   23..18   17..8    7..0
        +-------+-------+---------+---------+
        | Type  |  SCU  | Address | SubAddr |
        | 8 bits| 6 bits| 10 bits |  8 bits |
        +-------+-------+---------+---------+

    The existing internal DeviceId still uses 10+6+10+6 (see
    ``codec/device_id.py``).  We repack here rather than change the
    internal layout because *many* tests depend on it -- once the
    probe confirms the V3.8 layout, the internal DeviceId will be
    updated in Commit 2.
    """
    type_val = int(dev.dev_type) & 0xFF
    scu_val = dev.scu & 0x3F
    addr_val = dev.address & 0x3FF
    sub_val = dev.sub_address & 0xFF
    raw = (
        (type_val << 24)
        | (scu_val << 18)
        | (addr_val << 8)
        | sub_val
    )
    return raw.to_bytes(4, "big")


def decode_device_id_v38(data: bytes) -> DeviceId:
    if len(data) != 4:
        raise EtlcFrameError(f"DeviceId requires 4 bytes, got {len(data)}")
    raw = int.from_bytes(data, "big")
    type_val = (raw >> 24) & 0xFF
    scu_val = (raw >> 18) & 0x3F
    addr_val = (raw >> 8) & 0x3FF
    sub_val = raw & 0xFF
    try:
        dev_type = DeviceType(type_val)
    except ValueError:
        dev_type = DeviceType.UNKNOWN
    return DeviceId(dev_type=dev_type, scu=scu_val, address=addr_val,
                    sub_address=sub_val)


def checksum(data: bytes) -> int:
    """Byte-sum modulo 256.

    Per the ELC48 Master section of the spec; the SRM section doesn't
    detail the algorithm but this is the most common choice and the
    likely one the SCU uses.  If the probe frame is rejected, first
    thing to test is XOR-of-all-bytes.
    """
    return sum(data) & 0xFF


@dataclass(frozen=True)
class RelayOverrideV38:
    """ETLC V3.8 single-relay override frame (opcode 0x07).

    Wire layout:

        [ Flag: 4 bytes 0xFFFFFFFF ]
        [ DeviceID: 4 bytes         ]  target relay
        [ Opcode:  1 byte 0x07      ]
        [ State:   1 byte (0 / 1)   ]
        [ Checksum: 1 byte          ]

    Total: 11 bytes.  Minimum-viable frame to command the SCU.
    """

    device: DeviceId
    state: bool

    def encode(self) -> bytes:
        body = (
            FLAG_STANDARD
            + encode_device_id_v38(self.device)
            + bytes((OPCODE_RELAY_OVERRIDE, 1 if self.state else 0))
        )
        return body + bytes((checksum(body),))

    @classmethod
    def decode(cls, frame: bytes) -> RelayOverrideV38:
        if len(frame) != 11:
            raise EtlcFrameError(
                f"RelayOverrideV38 needs 11 bytes, got {len(frame)}"
            )
        if frame[:4] != FLAG_STANDARD:
            raise EtlcFrameError(f"bad Flag: {frame[:4].hex()}")
        if frame[8] != OPCODE_RELAY_OVERRIDE:
            raise EtlcFrameError(
                f"bad opcode: 0x{frame[8]:02x}, want 0x07"
            )
        if checksum(frame[:10]) != frame[10]:
            raise EtlcFrameError(
                f"checksum mismatch: got 0x{frame[10]:02x}, "
                f"want 0x{checksum(frame[:10]):02x}"
            )
        return cls(
            device=decode_device_id_v38(frame[4:8]),
            state=bool(frame[9]),
        )


@dataclass(frozen=True)
class RelayStateV38:
    """ETLC V3.8 unsolicited relay-state echo (opcode 0x15).

    Same wire layout as RelayOverrideV38 but with opcode 0x15 -- the
    SCU sends this on every relay state change (including changes
    driven by physical switches on the module itself, per spec §4).
    """

    device: DeviceId
    state: bool

    def encode(self) -> bytes:
        body = (
            FLAG_STANDARD
            + encode_device_id_v38(self.device)
            + bytes((OPCODE_RELAY_STATE, 1 if self.state else 0))
        )
        return body + bytes((checksum(body),))

    @classmethod
    def try_decode(cls, frame: bytes) -> RelayStateV38 | None:
        """Non-throwing decode -- returns None on any mismatch so the
        driver can silently skip non-relay-state traffic (like the
        RelayStatus 0x25 or FailReport 0x23 we haven't wired yet)."""
        if len(frame) != 11:
            return None
        if frame[:4] != FLAG_STANDARD:
            return None
        if frame[8] != OPCODE_RELAY_STATE:
            return None
        if checksum(frame[:10]) != frame[10]:
            return None
        return cls(
            device=decode_device_id_v38(frame[4:8]),
            state=bool(frame[9]),
        )
