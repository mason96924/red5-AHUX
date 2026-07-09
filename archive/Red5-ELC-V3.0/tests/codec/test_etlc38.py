"""Unit tests for the ETLC V3.8 codec (vendor-tool-captured 2026-07-09)."""

from __future__ import annotations

from elc.codec.device_id import DeviceId, DeviceType
from elc.codec.etlc38 import (
    DI1_TAIL,
    OPCODE_RELAY_OVERRIDE,
    OPCODE_RELAY_STATUS,
    PREAMBLE,
    RX_FRAME_LEN,
    TX_FRAME_LEN,
    TYPE_WRAP,
    RelayOverrideV38,
    RelayStatusV38,
    channels_from_mask,
    checksum,
)


def test_preamble_is_elc():
    assert PREAMBLE == b"\x45\x4C\x43"


def test_type_wrap_is_0x40():
    assert TYPE_WRAP == 0x40


def test_di1_tail_matches_vendor_capture():
    assert DI1_TAIL == b"\x11\x12\x13\x14"


def test_frame_lengths():
    assert TX_FRAME_LEN == 16
    assert RX_FRAME_LEN == 12


def test_checksum_matches_observed_rx_frames():
    # Payload bytes (after Length, before checksum) from real hardware.
    samples = [
        (b"\x15\x00\x02\x00\x25\x01", 0x43),
        (b"\x15\x00\x02\x00\x25\x03", 0x41),
        (b"\x15\x00\x02\x00\x25\x07", 0x3D),
        (b"\x15\x00\x02\x00\x25\x17", 0x2D),
        (b"\x15\x00\x02\x00\x25\x37", 0x0D),
        (b"\x15\x00\x02\x00\x25\x3F", 0x05),
        (b"\x14\x00\x03\x00\x25\x01", 0x43),
        (b"\x14\x00\x03\x00\x25\x0F", 0x35),
    ]
    for payload, want in samples:
        assert checksum(payload) == want


def test_checksum_matches_vendor_tool_tx_capture():
    # From SCU Smart Manager V1.6.9 log 2026-07-09:
    #   6SRM addr=2 ch(UI 2)=wire 1 ON → data ...1112 13 14 [16]
    payload = b"\x15\x00\x02\x01\x07\x01" + b"\x11\x12\x13\x14"
    assert checksum(payload) == 0x16

    # UI ch 3 = wire 2 ON → [15]
    payload_ch2 = b"\x15\x00\x02\x02\x07\x01" + b"\x11\x12\x13\x14"
    assert checksum(payload_ch2) == 0x15


def test_relay_override_matches_vendor_capture():
    """The exact 16 bytes the vendor tool sent for 6SRM addr=2 ch=2 (wire 1) ON."""
    dev = DeviceId(dev_type=DeviceType.SRM_6S, scu=0, address=2, sub_address=1)
    fr = RelayOverrideV38(device=dev, state=True).encode()
    assert len(fr) == TX_FRAME_LEN
    assert fr.hex() == "454c43400b1500020107011112131416"


def test_relay_override_ch1_wire_bytes():
    """Channel is 1-based on wire: sub_address=1 → wire byte 0x01."""
    dev = DeviceId(dev_type=DeviceType.SRM_6S, scu=0, address=2, sub_address=1)
    fr = RelayOverrideV38(device=dev, state=True).encode()
    assert fr[8] == 0x01        # sub-address byte
    assert fr[9] == OPCODE_RELAY_OVERRIDE
    assert fr[10] == 0x01       # state ON


def test_relay_status_decodes_hardware_capture():
    """RX bytes captured 2026-02-11 during physical switch toggles."""
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
        assert got is not None
        assert got.device.dev_type == DeviceType.SRM_6S
        assert got.device.address == 2
        assert got.state_mask == want_mask


def test_relay_status_decodes_4srm():
    frames = [
        (bytes.fromhex("454c43400714000300250143"), 0x01),
        (bytes.fromhex("454c43400714000300250f35"), 0x0F),
    ]
    for raw, want_mask in frames:
        got = RelayStatusV38.try_decode(raw)
        assert got is not None
        assert got.device.dev_type == DeviceType.SRM_4S
        assert got.state_mask == want_mask


def test_relay_status_rejects_wrong_length():
    assert RelayStatusV38.try_decode(b"\x00" * 11) is None


def test_relay_status_rejects_wrong_preamble():
    fr = bytearray(bytes.fromhex("454c43400715000200250143"))
    fr[0] = 0x00
    assert RelayStatusV38.try_decode(bytes(fr)) is None


def test_relay_status_rejects_bad_checksum():
    fr = bytearray(bytes.fromhex("454c43400715000200250143"))
    fr[-1] ^= 0xFF
    assert RelayStatusV38.try_decode(bytes(fr)) is None


def test_relay_status_roundtrip():
    dev = DeviceId(dev_type=DeviceType.SRM_6E, scu=0, address=1, sub_address=0)
    for mask in (0x00, 0x01, 0x0F, 0x3F, 0xFF):
        raw = RelayStatusV38(device=dev, state_mask=mask).encode()
        assert len(raw) == RX_FRAME_LEN
        got = RelayStatusV38.try_decode(raw)
        assert got is not None
        assert got.device == dev
        assert got.state_mask == mask


def test_channels_from_mask():
    assert channels_from_mask(0x01, 6) == [True, False, False, False, False, False]
    assert channels_from_mask(0x03, 6) == [True, True, False, False, False, False]
    assert channels_from_mask(0x3F, 6) == [True] * 6
    assert channels_from_mask(0x00, 6) == [False] * 6
    assert channels_from_mask(0x0F, 4) == [True, True, True, True]
