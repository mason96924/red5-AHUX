"""4-byte hierarchical Device-ID codec.

Bit layout (MSB → LSB, 32 bits total):

    31..22   21..16   15..6     5..0
    +--------+-------+---------+---------+
    | DevType|  SCU  | Address | SubAddr |
    | 10 bits| 6 bits| 10 bits |  6 bits |
    +--------+-------+---------+---------+

Note: the prose in `docs/ARCHITECTURE.md §2` labels SubAddr "8 bits",
which doesn't fit 32 bits with the other three fields.  We follow the
bit *positions* (5..0 → 6 bits), which is the layout the ELCC48 spec
itself uses.  Re-confirm against a captured frame.
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import IntEnum
from typing import Final


class DeviceType(IntEnum):
    """Coarse device-family enumeration.

    Values are placeholders until the official ELC type-code table is
    extracted from a live SCU.  Drivers must look up their type via
    this enum so the table can be re-assigned centrally.
    """

    UNKNOWN = 0
    SCU = 1
    SRM = 2          # Slim Relay Module / ELCC48 master
    DSW = 3          # Direct Switch
    DALI_MASTER = 4
    DALI_SLAVE = 5
    WGM = 6          # Wireless Gateway Module (Zigbee)
    SHG = 7          # Smart Home Gateway (EnOcean)
    ELCC48_SLAVE = 8
    DT8 = 9          # Tunable-white DALI device


DEVTYPE_BITS: Final[int] = 10
SCU_BITS: Final[int] = 6
ADDR_BITS: Final[int] = 10
SUBADDR_BITS: Final[int] = 6

_DEVTYPE_SHIFT: Final[int] = 32 - DEVTYPE_BITS                       # 22
_SCU_SHIFT: Final[int] = _DEVTYPE_SHIFT - SCU_BITS                   # 16
_ADDR_SHIFT: Final[int] = _SCU_SHIFT - ADDR_BITS                     # 6
_SUBADDR_SHIFT: Final[int] = 0

_DEVTYPE_MASK: Final[int] = (1 << DEVTYPE_BITS) - 1
_SCU_MASK: Final[int] = (1 << SCU_BITS) - 1
_ADDR_MASK: Final[int] = (1 << ADDR_BITS) - 1
_SUBADDR_MASK: Final[int] = (1 << SUBADDR_BITS) - 1


@dataclass(frozen=True, slots=True)
class DeviceId:
    """A hierarchical address: which SCU, which device, which sub-unit."""

    dev_type: DeviceType
    scu: int
    address: int
    sub_address: int = 0

    def __post_init__(self) -> None:
        for name, value, bits in (
            ("dev_type", int(self.dev_type), DEVTYPE_BITS),
            ("scu", self.scu, SCU_BITS),
            ("address", self.address, ADDR_BITS),
            ("sub_address", self.sub_address, SUBADDR_BITS),
        ):
            if not 0 <= value < (1 << bits):
                raise ValueError(
                    f"{name}={value} out of range for {bits}-bit field"
                )

    # ---- packing -----------------------------------------------------

    def encode_4b(self) -> bytes:
        """Pack into 4 big-endian bytes."""
        raw = (
            (int(self.dev_type) & _DEVTYPE_MASK) << _DEVTYPE_SHIFT
            | (self.scu & _SCU_MASK) << _SCU_SHIFT
            | (self.address & _ADDR_MASK) << _ADDR_SHIFT
            | (self.sub_address & _SUBADDR_MASK) << _SUBADDR_SHIFT
        )
        return raw.to_bytes(4, "big")

    @classmethod
    def decode_4b(cls, data: bytes) -> DeviceId:
        if len(data) != 4:
            raise ValueError(f"DeviceId requires exactly 4 bytes, got {len(data)}")
        raw = int.from_bytes(data, "big")
        dev = (raw >> _DEVTYPE_SHIFT) & _DEVTYPE_MASK
        scu = (raw >> _SCU_SHIFT) & _SCU_MASK
        addr = (raw >> _ADDR_SHIFT) & _ADDR_MASK
        sub = (raw >> _SUBADDR_SHIFT) & _SUBADDR_MASK
        try:
            dev_type = DeviceType(dev)
        except ValueError:
            dev_type = DeviceType.UNKNOWN
        return cls(dev_type=dev_type, scu=scu, address=addr, sub_address=sub)

    # ---- ergonomics --------------------------------------------------

    def __str__(self) -> str:
        return (
            f"{self.dev_type.name}/{self.scu}/{self.address}/{self.sub_address}"
        )
