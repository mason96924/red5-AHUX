"""4-byte hierarchical Device-ID codec.

Bit layout (MSB → LSB, 32 bits total, V3.8-aligned):

    31..24   23..18   17..8     7..0
    +--------+-------+---------+---------+
    | DevType|  SCU  | Address | SubAddr |
    | 8 bits | 6 bits| 10 bits |  8 bits |
    +--------+-------+---------+---------+

Per ``docs/RED5-ETLC-V3.8-PROTOCOL.md §2``, the SubAddress field is
8 bits (sub-address broadcast is 0xFF).  All V3.8 device-type codes
fit in 8 bits (max is 0x3E = 62), so DevType shrinks from 10 to 8.
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
    # 4eRM and 6eRM share this wire code (V3.8 spec §1); operators
    # typically talk about a 6eRM module so we pick that as the
    # primary name -- otherwise ``str(DeviceId)`` prints ``SRM_ERM``
    # which doesn't match the string in the operator's ELC_DEVICES_JSON.
    # ``SRM_ERM`` and ``SRM_4E`` are aliases with the same wire code.
    SRM_6E = 0x16         # 22  primary name for the ERM family
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
    # ---- Legacy / spec aliases --------------------------------------
    # ``SRM_ERM`` is the V3.8 spec name for the ERM family; we keep it
    # as an alias so code referring to it (docs / tests) still works.
    # ``SRM_4E`` shares the same wire code (0x16) -- the ETLC protocol
    # doesn't distinguish 4e/6e at the type level, only by channel
    # count derived from sub-address range.  Prefer the primary
    # ``SRM_6E`` in new code -- it matches the operator's ELC_DEVICES_
    # JSON.
    #
    # NOTE: Python IntEnum forbids duplicate NAMEs but allows the same
    # numeric value under different names as aliases.
    SRM_ERM = 0x16        # alias of SRM_6E (V3.8 spec name)
    SRM_4E = 0x16         # alias of SRM_6E (4-channel eRM variant)


DEVTYPE_BITS: Final[int] = 8
SCU_BITS: Final[int] = 6
ADDR_BITS: Final[int] = 10
SUBADDR_BITS: Final[int] = 8

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
