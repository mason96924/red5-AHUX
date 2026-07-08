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

    **Numeric values come from ETLC protocol V3.8** (see
    docs/RED5-ETLC-V3.8-PROTOCOL.md §1).  Do NOT reassign these
    without updating the protocol doc and re-verifying against
    hardware -- they are what the SCU expects on the wire.

    SRM variants: on the ETLC wire the type + module-address pair
    is the unique identifier for a module.  Two modules of
    *different* types may share the same ``address`` (e.g. 6eRM@1
    and 4sRM@1) -- that's fine on the wire because ``dev_type``
    differentiates them.  Two modules of the *same* type must not
    share an address.

    Legacy ``SRM = 2`` is kept for pre-Phase-6.1k data / tests that
    predate the type-family split.  New code should use the
    specific SRM_4S / SRM_6S / SRM_ERM subtypes.
    """

    UNKNOWN = 0
    SMARTORL = 1                 # ETLC_DEVICE_SMARTORL
    SRM = 2                      # legacy, kept for back-compat
    DSW = 3                      # generic DSW (legacy)
    DALI_MASTER_LEGACY = 4       # kept for pre-V3.8 tests; use DALI_MASTER (0x1E)
    DALI_SLAVE = 5               # (V3.8 assigns 0x05 to SCU; retained for tests)
    WGM = 6                      # (legacy alias)
    SHG_LEGACY = 7               # kept for pre-V3.8 tests; use SHG (0x25)
    ELCC48_SLAVE = 8
    DT8 = 9                      # Tunable-white DALI device
    # --- V3.8 wire-authoritative codes below ------------------------
    # Direct-Switch family
    DSW_4 = 0x0A          # 10  ETLC_DEVICE_4DSW / ETLC_DEVICE_DSW_START
    DSW_8 = 0x0B          # 11  ETLC_DEVICE_8DSW
    DSW_STS1 = 0x0C       # 12  ETLC_DEVICE_STS1 (DSW16)
    DSW_STS2 = 0x0D       # 13  ETLC_DEVICE_STS2 / ETLC_DEVICE_DSW_END
    SU = 0x0E             # 14  (DSW_END + 1)
    # SRM family — V3.8 §1
    SRM_4S = 0x14         # 20  ETLC_DEVICE_4SRM  (4-ch switching relay)
    SRM_6S = 0x15         # 21  ETLC_DEVICE_6SRM  (6-ch switching relay)
    SRM_ERM = 0x16        # 22  ETLC_DEVICE_ERM   (energy-metering RM, 4e / 6e)
    SRM_48S = 0x18        # 24  ETLC_DEVICE_48SRM (48-ch, layout TBD)
    # Head unit
    SCU = 0x05            # 5   ETLC_DEVICE_SCU (moved to actual V3.8 code)
    # DALI / wireless / smart-home
    DALI_MASTER = 0x1E    # 30
    WGM_4SWITCH = 0x23    # 35
    WGM_8SWITCH = 0x24    # 36
    SHG = 0x25            # 37
    MULTI_SENSOR = 0x3E   # 62

    # ---- Legacy aliases (application-code convenience) ---------------
    # These are OLD names for module families we kept working during the
    # V3.8 migration.  They resolve to the same wire code as the
    # underscore-suffixed name.  Prefer the underscored name in new
    # code.
    #
    # NOTE: Python IntEnum forbids duplicate NAMEs but allows the same
    # numeric value under a different name via aliasing -- so
    # ``SRM_6E`` below is an alias of ``SRM_ERM``, not a new member.
    SRM_4E = 0x16         # alias of SRM_ERM (4-channel eRM)
    SRM_6E = 0x16         # alias of SRM_ERM (6-channel eRM)


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
