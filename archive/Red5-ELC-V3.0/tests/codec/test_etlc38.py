"""Unit tests for the ETLC V3.8 probe codec.

Zero-hardware tests: verify our best-guess wire format encodes /
decodes symmetrically, hits the expected byte counts, and rejects
mangled frames.  Hardware iteration will still be needed to confirm
the actual byte values against the SCU.
"""

from __future__ import annotations

import pytest

from elc.codec.device_id import DeviceId, DeviceType
from elc.codec.etlc38 import (
    FLAG_STANDARD,
    OPCODE_RELAY_OVERRIDE,
    OPCODE_RELAY_STATE,
    EtlcFrameError,
    RelayOverrideV38,
    RelayStateV38,
    checksum,
    decode_device_id_v38,
    encode_device_id_v38,
)


def _dev(*, dev_type=DeviceType.SRM_6S, scu=1, address=2, sub_address=0):
    return DeviceId(
        dev_type=dev_type, scu=scu, address=address, sub_address=sub_address,
    )


# ---------- DeviceID V3.8 packing ------------------------------------


def test_device_id_v38_roundtrip():
    for dev in [
        _dev(dev_type=DeviceType.SRM_4S, address=3, sub_address=0),
        _dev(dev_type=DeviceType.SRM_6S, address=2, sub_address=5),
        _dev(dev_type=DeviceType.SRM_ERM, address=1, sub_address=5),
        _dev(dev_type=DeviceType.SRM_48S, scu=3, address=1023, sub_address=255),
    ]:
        out = encode_device_id_v38(dev)
        assert len(out) == 4
        back = decode_device_id_v38(out)
        assert back == dev


def test_device_id_v38_bit_positions():
    """Verify the specific bit positions per §2 of protocol doc.

    Type=0x15 (SRM_6S), SCU=1, Addr=2, Sub=0 should pack as:
        0001 0101  00 0001  00 0000 0010  0000 0000
        = 0x15 04 02 00  (with SCU=1 shifted into positions 23..18)

    Byte 0: 0x15  (type)
    Byte 1: 000001 00 = 0x04  (scu=1 in top 6 bits + top 2 bits of addr)
    Byte 2: 00000010 = 0x02  (middle 8 bits of addr = 0x002)
    Byte 3: 0x00  (subaddress)
    """
    dev = _dev(dev_type=DeviceType.SRM_6S, scu=1, address=2, sub_address=0)
    assert encode_device_id_v38(dev) == bytes([0x15, 0x04, 0x02, 0x00])


def test_device_id_v38_max_values():
    """Boundary check: max field values pack correctly."""
    dev = DeviceId(
        dev_type=DeviceType.SRM_48S,  # 0x18
        scu=0x3F,                       # 6 bits max
        address=0x3FF,                  # 10 bits max (broadcast)
        sub_address=0xFF,               # 8 bits max (broadcast)
    )
    out = encode_device_id_v38(dev)
    # Byte 0: 0x18 (type)
    # Byte 1: 111111 11 = 0xFF (scu all-ones + top 2 bits of addr all-ones)
    # Byte 2: 11111111 = 0xFF (middle 8 bits of addr)
    # Byte 3: 0xFF (subaddress all-ones)
    assert out == bytes([0x18, 0xFF, 0xFF, 0xFF])


# ---------- Checksum -------------------------------------------------


def test_checksum_matches_byte_sum():
    assert checksum(b"") == 0
    assert checksum(bytes([0x01, 0x02, 0x03])) == 0x06
    assert checksum(bytes([0xFF, 0xFF, 0xFF, 0xFF])) == 0xFC   # 4*0xFF & 0xFF


# ---------- RelayOverride (opcode 0x07) ------------------------------


def test_relay_override_frame_size_and_shape():
    """A single relay-override frame must be exactly 11 bytes:
    Flag(4) + DeviceID(4) + Opcode(1) + State(1) + Checksum(1)."""
    fr = RelayOverrideV38(device=_dev(), state=True).encode()
    assert len(fr) == 11
    assert fr[:4] == FLAG_STANDARD
    assert fr[8] == OPCODE_RELAY_OVERRIDE
    assert fr[9] == 1
    # Checksum verifies the same body on the receiver side.
    assert checksum(fr[:10]) == fr[10]


def test_relay_override_roundtrip():
    for state in (True, False):
        for dev in [
            _dev(dev_type=DeviceType.SRM_4S, address=3, sub_address=2),
            _dev(dev_type=DeviceType.SRM_6S, address=2, sub_address=5),
            _dev(dev_type=DeviceType.SRM_ERM, address=1, sub_address=0),
        ]:
            fr = RelayOverrideV38(device=dev, state=state).encode()
            back = RelayOverrideV38.decode(fr)
            assert back.device == dev
            assert back.state == state


def test_relay_override_rejects_wrong_length():
    with pytest.raises(EtlcFrameError, match="11 bytes"):
        RelayOverrideV38.decode(b"\x00" * 10)


def test_relay_override_rejects_bad_flag():
    fr = bytearray(RelayOverrideV38(device=_dev(), state=True).encode())
    fr[0] = 0x00
    fr[-1] = checksum(bytes(fr[:10]))
    with pytest.raises(EtlcFrameError, match="Flag"):
        RelayOverrideV38.decode(bytes(fr))


def test_relay_override_rejects_bad_checksum():
    fr = bytearray(RelayOverrideV38(device=_dev(), state=True).encode())
    fr[-1] ^= 0xFF
    with pytest.raises(EtlcFrameError, match="checksum"):
        RelayOverrideV38.decode(bytes(fr))


def test_relay_override_rejects_wrong_opcode():
    fr = bytearray(RelayOverrideV38(device=_dev(), state=True).encode())
    fr[8] = 0x15   # RelayState opcode instead
    fr[-1] = checksum(bytes(fr[:10]))
    with pytest.raises(EtlcFrameError, match="opcode"):
        RelayOverrideV38.decode(bytes(fr))


# ---------- RelayState (opcode 0x15) ---------------------------------


def test_relay_state_frame_shape():
    fr = RelayStateV38(device=_dev(), state=True).encode()
    assert len(fr) == 11
    assert fr[8] == OPCODE_RELAY_STATE


def test_relay_state_try_decode_valid():
    fr = RelayStateV38(device=_dev(), state=False).encode()
    got = RelayStateV38.try_decode(fr)
    assert got is not None
    assert got.state is False
    assert got.device == _dev()


def test_relay_state_try_decode_ignores_non_relay_state_frames():
    # Different opcode -> not RelayState -> try_decode returns None.
    fr = RelayOverrideV38(device=_dev(), state=True).encode()
    assert RelayStateV38.try_decode(fr) is None


def test_relay_state_try_decode_none_on_bad_checksum():
    fr = bytearray(RelayStateV38(device=_dev(), state=True).encode())
    fr[-1] ^= 0xFF
    assert RelayStateV38.try_decode(bytes(fr)) is None


# ---------- Concrete hardware-probe frame ---------------------------


def test_concrete_probe_frame_for_srm_6s_channel_0_on():
    """The exact bytes we'll send to the SCU as our probe.

    Target: SRM_6S at module_address=2, sub_address=0, scu=1 → ON.
    Expected on-wire bytes (V3.8 best-guess):

        FF FF FF FF   Flag
        15            Type = SRM_6S (0x15)
        04            SCU=1 << 2 | top 2 bits of addr (0x02 >> 8 = 0)
        02            middle 8 bits of addr
        00            sub_address = 0
        07            Opcode = RelayOverride
        01            State = ON
        22            Checksum: 0xFF*4 + 0x15 + 0x04 + 0x02 + 0x07 + 0x01
                                = 0x3FC + 0x23 = 0x41F & 0xFF = 0x1F

    If you get a rejection on this specific frame from the SCU, share
    the pcap and we resolve the ambiguities empirically.
    """
    dev = DeviceId(
        dev_type=DeviceType.SRM_6S, scu=1, address=2, sub_address=0,
    )
    fr = RelayOverrideV38(device=dev, state=True).encode()
    assert fr.hex() == "ffffffff150402000701" + f"{checksum(fr[:10]):02x}"
    # And decodes back losslessly.
    back = RelayOverrideV38.decode(fr)
    assert back.device == dev and back.state is True
