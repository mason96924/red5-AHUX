"""Unit tests for the ETLC V3.8 codec (post-hardware-capture rev).

The wire format was reverse-engineered from actual SCU RX chunks
captured on 2026-02-11.  Every observation is baked into a golden
test below so any regression breaks loudly.
"""

from __future__ import annotations

import pytest

from elc.codec.device_id import DeviceId, DeviceType
from elc.codec.etlc38 import (
    CLASS_SRM,
    FRAME_LEN,
    OPCODE_RELAY_OVERRIDE,
    OPCODE_RELAY_STATUS,
    PREAMBLE,
    EtlcFrameError,
    RelayOverrideV38,
    RelayStatusV38,
    channels_from_mask,
    checksum,
)


# ---------- Wire constants -------------------------------------------


def test_preamble_is_elc_at_symbol():
    assert PREAMBLE == bytes([0x45, 0x4C, 0x43, 0x40])


def test_frame_length_is_12():
    assert FRAME_LEN == 12


def test_class_srm_is_0x07():
    assert CLASS_SRM == 0x07


# ---------- Checksum -------------------------------------------------


def test_checksum_matches_observed_hardware_values():
    """Golden values from the 2026-02-11 hardware log:

        RX: 45 4C 43 40 07 15 00 02 00 25 01 43   ->  cs 0x43
        RX: 45 4C 43 40 07 15 00 02 00 25 03 41   ->  cs 0x41
        RX: 45 4C 43 40 07 15 00 02 00 25 07 3D   ->  cs 0x3D
        RX: 45 4C 43 40 07 15 00 02 00 25 17 2D   ->  cs 0x2D
        RX: 45 4C 43 40 07 15 00 02 00 25 37 0D   ->  cs 0x0D
        RX: 45 4C 43 40 07 14 00 03 00 25 01 43   ->  cs 0x43

    Formula: cs = (0x87 - sum(bytes[4..10])) & 0xFF.
    """
    samples = [
        (b"\x07\x15\x00\x02\x00\x25\x01", 0x43),
        (b"\x07\x15\x00\x02\x00\x25\x03", 0x41),
        (b"\x07\x15\x00\x02\x00\x25\x07", 0x3D),
        (b"\x07\x15\x00\x02\x00\x25\x17", 0x2D),
        (b"\x07\x15\x00\x02\x00\x25\x37", 0x0D),
        (b"\x07\x14\x00\x03\x00\x25\x01", 0x43),
        (b"\x07\x15\x00\x02\x00\x25\x3F", 0x05),   # all six on
    ]
    for body, expected in samples:
        assert checksum(body) == expected, (
            f"body {body.hex()} -> got 0x{checksum(body):02X}, "
            f"want 0x{expected:02X}"
        )


def test_checksum_requires_7_byte_body():
    with pytest.raises(EtlcFrameError, match="7 B"):
        checksum(b"\x00" * 6)
    with pytest.raises(EtlcFrameError, match="7 B"):
        checksum(b"\x00" * 8)


# ---------- RelayOverride (opcode 0x07, master → SCU) ---------------


def test_relay_override_frame_shape_and_size():
    dev = DeviceId(dev_type=DeviceType.SRM_6S, scu=0, address=2, sub_address=0)
    fr = RelayOverrideV38(device=dev, state=True).encode()
    assert len(fr) == FRAME_LEN
    assert fr[:4] == PREAMBLE
    assert fr[4] == CLASS_SRM
    assert fr[5] == 0x15  # SRM_6S
    assert fr[6] == 0x00  # scu
    assert fr[7] == 0x02  # address
    assert fr[8] == 0x00  # sub-address (channel 0)
    assert fr[9] == OPCODE_RELAY_OVERRIDE
    assert fr[10] == 1    # state ON
    assert fr[11] == checksum(fr[4:11])


def test_relay_override_off_state():
    dev = DeviceId(dev_type=DeviceType.SRM_6S, scu=0, address=2, sub_address=0)
    fr = RelayOverrideV38(device=dev, state=False).encode()
    assert fr[10] == 0


def test_relay_override_concrete_expected_bytes_for_6srm_ch0_on():
    """Exact TX bytes the driver will send when the operator clicks
    SRM_6S/0/2/0 → ON.  If this test changes, hardware needs re-verified.
    """
    dev = DeviceId(dev_type=DeviceType.SRM_6S, scu=0, address=2, sub_address=0)
    fr = RelayOverrideV38(device=dev, state=True).encode()
    # Preamble(4) + class(1) + type + scu + addr + sub + opcode + data + cs
    expected_body = bytes([0x07, 0x15, 0x00, 0x02, 0x00, 0x07, 0x01])
    expected_cs = checksum(expected_body)
    assert fr == PREAMBLE + expected_body + bytes((expected_cs,))
    # Human-readable golden:
    assert fr.hex() == "454c43400715000200070161"


# ---------- RelayStatus (opcode 0x25, SCU → master, unsolicited) ----


def test_relay_status_decodes_hardware_capture():
    """The exact RX bytes we saw on 2026-02-11 when the operator
    flipped channels 0, 0+1, 0+1+2 physically on the 6sRM module."""
    frames = [
        (bytes.fromhex("454c43400715000200250143"), 0x01),
        (bytes.fromhex("454c43400715000200250341"), 0x03),
        (bytes.fromhex("454c4340071500020025073d"), 0x07),
        (bytes.fromhex("454c4340071500020025172d"), 0x17),
        (bytes.fromhex("454c4340071500020025370d"), 0x37),
        (bytes.fromhex("454c43400715000200253f05"), 0x3F),
    ]
    for raw, want_mask in frames:
        got = RelayStatusV38.try_decode(raw)
        assert got is not None, f"failed to decode {raw.hex()}"
        assert got.device.dev_type == DeviceType.SRM_6S
        assert got.device.scu == 0
        assert got.device.address == 2
        assert got.device.sub_address == 0
        assert got.state_mask == want_mask


def test_relay_status_decodes_4srm_hardware_capture():
    """The 4sRM lines from the log -- address=3."""
    frames = [
        (bytes.fromhex("454c43400714000300250143"), 0x01),
        (bytes.fromhex("454c43400714000300250341"), 0x03),
        (bytes.fromhex("454c4340071400030025073d"), 0x07),
        (bytes.fromhex("454c43400714000300250f35"), 0x0F),
    ]
    for raw, want_mask in frames:
        got = RelayStatusV38.try_decode(raw)
        assert got is not None
        assert got.device.dev_type == DeviceType.SRM_4S
        assert got.device.address == 3
        assert got.state_mask == want_mask


def test_relay_status_try_decode_rejects_wrong_length():
    assert RelayStatusV38.try_decode(b"\x00" * 11) is None


def test_relay_status_try_decode_rejects_wrong_preamble():
    fr = bytearray(bytes.fromhex("454c43400715000200250143"))
    fr[0] = 0x00
    assert RelayStatusV38.try_decode(bytes(fr)) is None


def test_relay_status_try_decode_rejects_bad_checksum():
    fr = bytearray(bytes.fromhex("454c43400715000200250143"))
    fr[-1] ^= 0xFF
    assert RelayStatusV38.try_decode(bytes(fr)) is None


def test_relay_status_try_decode_ignores_relayoverride_opcode():
    """A frame with opcode 0x07 (RelayOverride) must NOT decode as
    RelayStatus -- keeps the parser opcode-strict."""
    dev = DeviceId(dev_type=DeviceType.SRM_6S, scu=0, address=2, sub_address=0)
    fr = RelayOverrideV38(device=dev, state=True).encode()
    assert RelayStatusV38.try_decode(fr) is None


def test_relay_status_encode_decode_roundtrip():
    dev = DeviceId(dev_type=DeviceType.SRM_6E, scu=0, address=1, sub_address=0)
    for mask in (0x00, 0x01, 0x0F, 0x3F, 0xFF):
        raw = RelayStatusV38(device=dev, state_mask=mask).encode()
        assert len(raw) == FRAME_LEN
        got = RelayStatusV38.try_decode(raw)
        assert got is not None
        assert got.device == dev
        assert got.state_mask == mask


# ---------- Channel mask expansion ----------------------------------


def test_channels_from_mask_6_channels():
    assert channels_from_mask(0x01, 6) == [True, False, False, False, False, False]
    assert channels_from_mask(0x03, 6) == [True, True, False, False, False, False]
    assert channels_from_mask(0x3F, 6) == [True] * 6
    assert channels_from_mask(0x00, 6) == [False] * 6


def test_channels_from_mask_4_channels():
    """4sRM only exposes channels 0-3; bits above are noise."""
    assert channels_from_mask(0x0F, 4) == [True, True, True, True]
    assert channels_from_mask(0x03, 4) == [True, True, False, False]


def test_channels_from_mask_48_channels():
    """48sRM -- bitmask spans multiple bytes; we take 48 bits."""
    mask = (1 << 47) | 1  # channel 0 and 47 on
    bits = channels_from_mask(mask, 48)
    assert bits[0] is True
    assert bits[47] is True
    assert sum(bits) == 2
