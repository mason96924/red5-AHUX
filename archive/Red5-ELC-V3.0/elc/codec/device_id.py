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

    SRM variants: on the ELC wire the type + module-address pair is
    the unique identifier for a module.  Two modules of *different*
    types may share the same ``address`` (e.g. 6eRM@1 and 4sRM@1) --
    that's fine on the wire because ``dev_type`` differentiates them.
    Two modules of the *same* type must not share an address.

    Numeric values in the 10..14 range are provisional; they'll be
    reconciled once we capture a real SCU device-inventory response.
    """

    UNKNOWN = 0
    SCU = 1
    SRM = 2          # Generic / legacy SRM (kept for back-compat)
    DSW = 3          # Direct Switch
    DALI_MASTER = 4
    DALI_SLAVE = 5
    WGM = 6          # Wireless Gateway Module (Zigbee)
    SHG = 7          # Smart Home Gateway (EnOcean)
    ELCC48_SLAVE = 8
    DT8 = 9          # Tunable-white DALI device
    # SRM family sub-types -- see docs/RED5-MODBUS-V3.0-PROTOCOL.md §3
    # for the equivalent Modbus coil-block layout.  Provisional values,
    # to be re-mapped when the ELC device-type table is captured.
    SRM_4E = 10      # 4-channel Energy-metering Relay Module
    SRM_6E = 11      # 6-channel Energy-metering Relay Module
    SRM_4S = 12      # 4-channel Switching Relay Module
    SRM_6S = 13      # 6-channel Switching Relay Module
    SRM_48S = 14     # 48-channel Switching Relay Module (layout TBD)


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

    @classmethod
    def from_string(cls, s: str) -> DeviceId:
        """Parse the canonical string form `DEVTYPE/SCU/ADDR/SUB`.

        Used by the REST layer where the device id is a URL segment.
        Raises `ValueError` on any malformed input.
        """
        parts = s.split("/")
        if len(parts) != 4:
            raise ValueError(f"expected DEVTYPE/SCU/ADDR/SUB, got {s!r}")
        type_str, scu_str, addr_str, sub_str = parts
        try:
            dev_type = DeviceType[type_str]
        except KeyError as e:
            raise ValueError(f"unknown DeviceType {type_str!r}") from e
        try:
            scu = int(scu_str)
            addr = int(addr_str)
            sub = int(sub_str)
        except ValueError as e:
            raise ValueError(f"non-integer field in {s!r}") from e
        return cls(dev_type=dev_type, scu=scu, address=addr, sub_address=sub)
