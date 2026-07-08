"""ETLC V3.8 wire codec -- corrected against observed hardware behaviour.

Wire format (12 bytes fixed):

    byte  0..3   preamble = ASCII "ELC@" (45 4C 43 40)
    byte  4      class byte -- 0x07 for the SRM/ERM family
    byte  5      device type (SRM_6S=0x15, SRM_4S=0x14, SRM_6E=0x16, ...)
    byte  6      SCU bus number (the physical SCU broadcasts as 0)
    byte  7      module address
    byte  8      sub-address (relay channel index, 0-based)
    byte  9      opcode (0x07=RelayOverride, 0x25=RelayStatus)
    byte  10     data byte (state or channel bitmask depending on opcode)
    byte  11     checksum = (0x87 - sum(bytes[4..10])) & 0xFF

Derivation of the checksum: for every observed RX frame we saw
``sum(bytes[4..10]) + checksum == 0x87``, invariant across state, type,
and address changes.  0x87 is likely ``0x80 | class_byte`` (class byte
= 0x07 for SRM), which we assume so the algorithm generalises to
future message classes.

*Everything* in this module was rebuilt from the actual hardware RX
observed on 2026-02-11 (see log capture in the CHANGELOG).  The V3.8
spec doc's talk of ``Flag = 0xFFFFFFFF`` is either aspirational,
outdated, or for a different message class; our SCU firmware speaks
what's coded below.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Final

from elc.codec.device_id import DeviceId, DeviceType

# Wire constants (observed) -----------------------------------------
PREAMBLE: Final[bytes] = b"ELC@"          # 45 4C 43 40
CLASS_SRM: Final[int] = 0x07              # byte 4 for SRM/ERM family
FRAME_LEN: Final[int] = 12                # every observed frame is 12 B

# Opcodes per V3.8 doc + hardware confirmation ----------------------
OPCODE_RELAY_OVERRIDE: Final[int] = 0x07  # master → SCU, single relay
OPCODE_RELAY_STATUS: Final[int] = 0x25    # SCU → master, module bitmask


class EtlcFrameError(ValueError):
    """Raised when a frame is structurally invalid."""


def checksum(header_and_payload: bytes) -> int:
    """(0x87 - sum(bytes[4..10])) & 0xFF.

    ``header_and_payload`` must be bytes[4..10] (7 bytes) -- the class
    byte, dev-id fields, opcode, and data byte, with the preamble
    stripped and the checksum position excluded.
    """
    if len(header_and_payload) != 7:
        raise EtlcFrameError(
            f"checksum body must be 7 B, got {len(header_and_payload)}"
        )
    return (0x87 - sum(header_and_payload)) & 0xFF


def _encode(dev: DeviceId, opcode: int, data_byte: int) -> bytes:
    """Assemble a full 12-byte ETLC frame."""
    body = bytes((
        CLASS_SRM,
        int(dev.dev_type) & 0xFF,
        dev.scu & 0xFF,
        dev.address & 0xFF,
        dev.sub_address & 0xFF,
        opcode & 0xFF,
        data_byte & 0xFF,
    ))
    return PREAMBLE + body + bytes((checksum(body),))


@dataclass(frozen=True)
class RelayOverrideV38:
    """Set a single relay on/off (opcode 0x07)."""

    device: DeviceId
    state: bool

    def encode(self) -> bytes:
        return _encode(self.device, OPCODE_RELAY_OVERRIDE,
                       1 if self.state else 0)


@dataclass(frozen=True)
class RelayStatusV38:
    """Module-wide relay-state bitmask (opcode 0x25, unsolicited).

    The SCU emits this whenever ANY relay on the module changes state,
    whether driven by our RelayOverride or by a physical switch on the
    module itself.  ``state_mask`` bit N == 1 means relay channel N is
    currently on.
    """

    device: DeviceId   # ``sub_address`` is 0 for module-wide status
    state_mask: int    # bitmask of channels currently ON

    def encode(self) -> bytes:
        return _encode(self.device, OPCODE_RELAY_STATUS,
                       self.state_mask & 0xFF)

    @classmethod
    def try_decode(cls, frame: bytes) -> RelayStatusV38 | None:
        """Non-throwing decode -- returns None on any structural mismatch."""
        if len(frame) != FRAME_LEN:
            return None
        if frame[:4] != PREAMBLE:
            return None
        if frame[4] != CLASS_SRM:
            return None
        if frame[9] != OPCODE_RELAY_STATUS:
            return None
        try:
            expected_cs = checksum(frame[4:11])
        except EtlcFrameError:
            return None
        if expected_cs != frame[11]:
            return None
        try:
            dev_type = DeviceType(frame[5])
        except ValueError:
            dev_type = DeviceType.UNKNOWN
        device = DeviceId(
            dev_type=dev_type,
            scu=frame[6],
            address=frame[7],
            sub_address=frame[8],
        )
        return cls(device=device, state_mask=frame[10])


def channels_from_mask(mask: int, module_channel_count: int = 6) -> list[bool]:
    """Turn a RelayStatus bitmask into a per-channel list.

    ``module_channel_count`` defaults to 6 for the 6sRM / 6eRM
    families; use 4 for 4sRM / 4eRM, 48 for 48sRM.
    """
    return [(mask >> i) & 1 == 1 for i in range(module_channel_count)]
