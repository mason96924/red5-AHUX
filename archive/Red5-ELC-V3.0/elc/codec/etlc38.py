"""ETLC V3.8 wire codec -- vendor-tool-captured (2026-07-09).

Frame:  45 4C 43   40   LL   <payload>              <cs>

* preamble = "ELC" (45 4C 43)
* type     = 0x40 (ETLC protocol wrapper)
* length   = number of bytes remaining (payload + checksum)
* checksum = (~(sum(payload) + 0x80) + 1) & 0xFF

TX payload (10 B, opcode 0x07 RelayOverride):
    [dev_type][scu][addr][channel_0based][0x07][state][DI1: 11 12 13 14]

RX payload (6 B, opcode 0x25 RelayStatus, unsolicited from SCU):
    [dev_type][scu][addr][00][0x25][state_mask]

Wire-vs-UI addressing:
    SCU:     0-based on wire (UI SCU=1  → wire 0)
    Module:  1-based on wire (UI addr=2 → wire 2)
    Channel: 0-based on wire (UI ch=2   → wire 1)
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Final

from elc.codec.device_id import DeviceId, DeviceType

PREAMBLE: Final[bytes] = b"\x45\x4C\x43"
TYPE_WRAP: Final[int] = 0x40
DI1_TAIL: Final[bytes] = b"\x11\x12\x13\x14"

OPCODE_RELAY_OVERRIDE: Final[int] = 0x07
OPCODE_RELAY_STATUS: Final[int] = 0x25
# Master → SCU "please tell me the current relay state of this
# module".  Kept in sync with the legacy StatusQuery opcode (0x16)
# in elc/codec/messages.py so V3.8 shares the semantic even if the
# vendor tool never emits it -- the SCU echoes an unsolicited
# RelayStatus (0x25) in response, which _on_v38_bytes already
# decodes.  Safe: the SCU never fires a relay in response to a
# query frame.
OPCODE_STATUS_QUERY: Final[int] = 0x16

TX_FRAME_LEN: Final[int] = 16
RX_FRAME_LEN: Final[int] = 12

# Legacy aliases -- pre-2026-07-09 tests reference these names.
CLASS_SRM: Final[int] = TYPE_WRAP
FRAME_LEN: Final[int] = RX_FRAME_LEN


class EtlcFrameError(ValueError):
    """Raised when a frame is structurally invalid."""


def checksum(payload: bytes) -> int:
    """(~(sum(payload) + 0x80) + 1) & 0xFF."""
    return ((~(sum(payload) + 0x80)) + 1) & 0xFF


# ETLC V3.8 §1.a — the SCU byte + module-address byte are actually a
# packed 6-bit-SCU + 10-bit-address field spread across two adjacent
# bytes.  These helpers centralise the split so every message class
# uses the same layout, and so a future re-interpretation (e.g. a
# vendor firmware that redefines the top-2-bit meaning) lands in one
# place.
#
#     byte 6:  [ addr[9:8] : 2 ][ scu : 6 ]
#     byte 7:  [ addr[7:0] : 8 ]
#
# ``address`` uses the full 10-bit range ``0..1023``.  ``0x3FF`` is
# reserved as the *broadcast* address for PanelInfo queries -- every
# module of the requested device type replies with its own frame.

SCU_MASK: Final[int] = 0x3F                  # 6 low bits
ADDR_HI_SHIFT: Final[int] = 6                # top 2 bits of byte 6
ADDR_HI_MASK: Final[int] = 0x03
ADDR_MAX: Final[int] = 0x3FF                 # 10 bits → 1023
ADDR_BROADCAST: Final[int] = 0x3FF           # PanelInfo wildcard


def encode_scu_addr(scu: int, address: int) -> tuple[int, int]:
    """Split (scu, address) into wire bytes 6 and 7.

    ``scu`` is 6 bits (0..63); ``address`` is 10 bits (0..1023).
    Returns ``(byte6, byte7)``.  Silently masks over-range inputs to
    keep the encode path allocation-free; range-checking happens at
    the DeviceId construction site.
    """
    byte6 = ((address >> 8) & ADDR_HI_MASK) << ADDR_HI_SHIFT | (scu & SCU_MASK)
    byte7 = address & 0xFF
    return byte6, byte7


def decode_scu_addr(byte6: int, byte7: int) -> tuple[int, int]:
    """Inverse of :func:`encode_scu_addr` — returns ``(scu, address)``."""
    scu = byte6 & SCU_MASK
    address = ((byte6 >> ADDR_HI_SHIFT) & ADDR_HI_MASK) << 8 | byte7
    return scu, address


def _wrap(payload: bytes) -> bytes:
    return (
        PREAMBLE
        + bytes((TYPE_WRAP, len(payload) + 1))
        + payload
        + bytes((checksum(payload),))
    )


@dataclass(frozen=True)
class RelayOverrideV38:
    """Master → SCU single-relay override (opcode 0x07)."""

    device: DeviceId
    state: bool

    def encode(self) -> bytes:
        scu_byte, addr_byte = encode_scu_addr(
            self.device.scu, self.device.address,
        )
        payload = bytes([
            int(self.device.dev_type) & 0xFF,
            scu_byte,
            addr_byte,
            self.device.sub_address & 0xFF,
            OPCODE_RELAY_OVERRIDE,
            0x01 if self.state else 0x00,
        ]) + DI1_TAIL
        return _wrap(payload)


@dataclass(frozen=True)
class RelayStatusV38:
    """SCU → master unsolicited module state (opcode 0x25)."""

    device: DeviceId
    state_mask: int
    def encode(self) -> bytes:
        scu_byte, addr_byte = encode_scu_addr(
            self.device.scu, self.device.address,
        )
        payload = bytes([
            int(self.device.dev_type) & 0xFF,
            scu_byte,
            addr_byte,
            self.device.sub_address & 0xFF,
            OPCODE_RELAY_STATUS,
            self.state_mask & 0xFF,
        ])
        return _wrap(payload)

    @classmethod
    def try_decode(cls, frame: bytes) -> "RelayStatusV38 | None":
        if len(frame) != RX_FRAME_LEN:
            return None
        if frame[:3] != PREAMBLE:
            return None
        if frame[3] != TYPE_WRAP:
            return None
        if frame[4] + 5 != RX_FRAME_LEN:
            return None
        payload = frame[5:11]
        if payload[4] != OPCODE_RELAY_STATUS:
            return None
        if checksum(payload) != frame[11]:
            return None
        try:
            dev_type = DeviceType(payload[0])
        except ValueError:
            dev_type = DeviceType.UNKNOWN
        scu, address = decode_scu_addr(payload[1], payload[2])
        device = DeviceId(
            dev_type=dev_type,
            scu=scu,
            address=address,
            sub_address=payload[3],
        )
        return cls(device=device, state_mask=payload[5])


def channels_from_mask(mask: int, module_channel_count: int = 6) -> list[bool]:
    return [(mask >> i) & 1 == 1 for i in range(module_channel_count)]


@dataclass(frozen=True)
class StatusQueryV38:
    """Master → SCU "read module state" (opcode 0x16).

    Encoded with the same wrapper + preamble as RelayOverride so the
    SCU's parser accepts it on the same TCP path.  The device's
    ``sub_address`` is ignored -- a query is module-wide -- but we
    pass it through unchanged so the frame layout matches RelayOverride
    byte-for-byte apart from the opcode.

    **Broadcast (PanelInfo) queries** — set ``device.address`` to
    ``ADDR_BROADCAST`` (0x3FF).  The SCU responds with one RelayStatus
    frame *per module of the requested device type*, each carrying its
    own real address.  For the SRM family (dev_type 0x14 = 4SRM,
    0x15 = 6SRM/6ERM shared), this is exactly the discovery mechanism
    the operator uses -- see ETLC §1.a and §1.b.

    The expected response is an unsolicited-shaped RelayStatus (0x25,
    12-byte RX frame) which ``SrmDriver._on_v38_bytes`` already
    decodes end-to-end (per-channel RelayState events → replica → SSE
    → UI).  Safe against live hardware -- issuing a query frame never
    fires a relay.
    """

    device: DeviceId

    def encode(self) -> bytes:
        scu_byte, addr_byte = encode_scu_addr(
            self.device.scu, self.device.address,
        )
        payload = bytes([
            int(self.device.dev_type) & 0xFF,
            scu_byte,
            addr_byte,
            self.device.sub_address & 0xFF,
            OPCODE_STATUS_QUERY,
            0x00,                          # reserved / data byte
        ]) + DI1_TAIL
        return _wrap(payload)
