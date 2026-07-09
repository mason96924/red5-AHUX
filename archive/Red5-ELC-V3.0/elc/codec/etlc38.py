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
        payload = bytes([
            int(self.device.dev_type) & 0xFF,
            self.device.scu & 0xFF,
            self.device.address & 0xFF,
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
        payload = bytes([
            int(self.device.dev_type) & 0xFF,
            self.device.scu & 0xFF,
            self.device.address & 0xFF,
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
        device = DeviceId(
            dev_type=dev_type,
            scu=payload[1],
            address=payload[2],
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

    The expected response is an unsolicited-shaped RelayStatus (0x25,
    12-byte RX frame) which ``SrmDriver._on_v38_bytes`` already
    decodes end-to-end (per-channel RelayState events → replica → SSE
    → UI).  Safe against live hardware -- issuing a query frame never
    fires a relay.
    """

    device: DeviceId

    def encode(self) -> bytes:
        payload = bytes([
            int(self.device.dev_type) & 0xFF,
            self.device.scu & 0xFF,
            self.device.address & 0xFF,
            self.device.sub_address & 0xFF,
            OPCODE_STATUS_QUERY,
            0x00,                          # reserved / data byte
        ]) + DI1_TAIL
        return _wrap(payload)
