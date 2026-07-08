"""Unit tests for elc.codec.device_id."""

from __future__ import annotations

import pytest

from elc.codec.device_id import (
    ADDR_BITS,
    DEVTYPE_BITS,
    SCU_BITS,
    SUBADDR_BITS,
    DeviceId,
    DeviceType,
)


def test_bit_widths_sum_to_32() -> None:
    assert DEVTYPE_BITS + SCU_BITS + ADDR_BITS + SUBADDR_BITS == 32


def test_encode_decode_roundtrip_simple() -> None:
    d = DeviceId(dev_type=DeviceType.SRM, scu=3, address=42, sub_address=7)
    raw = d.encode_4b()
    assert len(raw) == 4
    assert DeviceId.decode_4b(raw) == d


def test_encode_decode_roundtrip_all_zero() -> None:
    d = DeviceId(dev_type=DeviceType.UNKNOWN, scu=0, address=0, sub_address=0)
    assert d.encode_4b() == b"\x00\x00\x00\x00"
    assert DeviceId.decode_4b(b"\x00\x00\x00\x00") == d


def test_encode_decode_roundtrip_max_each_field() -> None:
    d = DeviceId(
        dev_type=DeviceType(0),         # IntEnum cap is the table, not the bitfield
        scu=(1 << SCU_BITS) - 1,
        address=(1 << ADDR_BITS) - 1,
        sub_address=(1 << SUBADDR_BITS) - 1,
    )
    raw = d.encode_4b()
    assert DeviceId.decode_4b(raw) == d


def test_decode_unknown_devtype_falls_back_to_unknown() -> None:
    # devtype value 200 is outside the IntEnum table but still fits
    # in 8 bits (V3.8 layout has DEVTYPE_BITS=8).
    raw = (200 << (32 - DEVTYPE_BITS)).to_bytes(4, "big")
    d = DeviceId.decode_4b(raw)
    assert d.dev_type is DeviceType.UNKNOWN


def test_decode_requires_4_bytes() -> None:
    with pytest.raises(ValueError):
        DeviceId.decode_4b(b"\x00\x00\x00")
    with pytest.raises(ValueError):
        DeviceId.decode_4b(b"\x00\x00\x00\x00\x00")


@pytest.mark.parametrize(
    "field,value",
    [
        ("scu", 1 << SCU_BITS),
        ("scu", -1),
        ("address", 1 << ADDR_BITS),
        ("address", -1),
        ("sub_address", 1 << SUBADDR_BITS),
        ("sub_address", -1),
    ],
)
def test_construction_rejects_out_of_range(field: str, value: int) -> None:
    kwargs = dict(dev_type=DeviceType.SRM, scu=0, address=0, sub_address=0)
    kwargs[field] = value
    with pytest.raises(ValueError):
        DeviceId(**kwargs)


def test_bit_field_isolation() -> None:
    """Each field must not bleed into its neighbours."""
    a = DeviceId(dev_type=DeviceType.SRM, scu=0, address=0, sub_address=0)
    b = DeviceId(dev_type=DeviceType.SRM, scu=0, address=0, sub_address=1)
    c = DeviceId(dev_type=DeviceType.SRM, scu=0, address=1, sub_address=0)
    d = DeviceId(dev_type=DeviceType.SRM, scu=1, address=0, sub_address=0)
    raws = {a.encode_4b(), b.encode_4b(), c.encode_4b(), d.encode_4b()}
    assert len(raws) == 4


def test_str_renders_hierarchy() -> None:
    d = DeviceId(dev_type=DeviceType.DALI_MASTER, scu=2, address=10, sub_address=5)
    assert str(d) == "DALI_MASTER/2/10/5"


def test_frozen_dataclass() -> None:
    d = DeviceId(dev_type=DeviceType.SRM, scu=1, address=2, sub_address=3)
    # Frozen dataclasses raise FrozenInstanceError (a subclass of AttributeError).
    with pytest.raises(AttributeError):
        d.scu = 5  # type: ignore[misc]
