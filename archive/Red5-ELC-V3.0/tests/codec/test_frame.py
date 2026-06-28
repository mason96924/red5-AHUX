"""Unit tests for elc.codec.frame."""

from __future__ import annotations

import pytest

from elc.codec.frame import (
    HEADER_LEN,
    MAX_PAYLOAD,
    OVERHEAD_LEN,
    PREAMBLE,
    Frame,
    FrameError,
    checksum,
    decode,
    encode,
)

# ---------- Frame validation ------------------------------------------


def test_frame_defaults_to_empty_payload() -> None:
    f = Frame(msg_type=0x01)
    assert f.payload == b""


def test_frame_rejects_msg_type_out_of_range() -> None:
    with pytest.raises(FrameError):
        Frame(msg_type=-1)
    with pytest.raises(FrameError):
        Frame(msg_type=256)


def test_frame_rejects_payload_over_max() -> None:
    with pytest.raises(FrameError):
        Frame(msg_type=0x01, payload=b"x" * (MAX_PAYLOAD + 1))


def test_frame_accepts_max_payload() -> None:
    Frame(msg_type=0x01, payload=b"x" * MAX_PAYLOAD)


# ---------- checksum ---------------------------------------------------


def test_checksum_known_values() -> None:
    assert checksum(b"") == 0
    assert checksum(b"\x01\x02\x03") == 6
    # Overflow wraps:
    assert checksum(b"\xFF\x02") == 0x01
    assert checksum(b"\xFF" * 4) == 0xFC


# ---------- encode -----------------------------------------------------


def test_encode_empty_payload() -> None:
    out = encode(Frame(msg_type=0x01))
    # E L C 0x01 0x00 cksum
    expected_body = PREAMBLE + b"\x01\x00"
    assert out == expected_body + bytes((checksum(expected_body),))
    assert len(out) == OVERHEAD_LEN


def test_encode_with_payload() -> None:
    payload = b"\x10\x20\x30"
    out = encode(Frame(msg_type=0x15, payload=payload))
    body = PREAMBLE + bytes((0x15, len(payload))) + payload
    assert out == body + bytes((checksum(body),))
    assert len(out) == OVERHEAD_LEN + len(payload)


def test_encode_max_payload() -> None:
    payload = bytes(range(MAX_PAYLOAD))
    out = encode(Frame(msg_type=0x42, payload=payload))
    assert len(out) == OVERHEAD_LEN + MAX_PAYLOAD


# ---------- decode: happy paths ---------------------------------------


def test_decode_single_frame_roundtrip() -> None:
    f = Frame(msg_type=0x14, payload=b"\x00\x00\x00\x01\x01")
    buf = bytearray(encode(f))
    out = list(decode(buf))
    assert out == [f]
    assert buf == bytearray()


def test_decode_two_back_to_back_frames() -> None:
    a = Frame(msg_type=0x14, payload=b"\xAA")
    b = Frame(msg_type=0x15, payload=b"\xBB\xCC")
    buf = bytearray(encode(a) + encode(b))
    out = list(decode(buf))
    assert out == [a, b]
    assert buf == bytearray()


def test_decode_handles_zero_length_payload() -> None:
    f = Frame(msg_type=0x60)
    buf = bytearray(encode(f))
    out = list(decode(buf))
    assert out == [f]


# ---------- decode: streaming / fragmentation -------------------------


def test_decode_waits_for_full_frame() -> None:
    f = Frame(msg_type=0x14, payload=b"\xAA\xBB")
    wire = encode(f)
    # Feed one byte at a time; only the final byte should emit the frame.
    buf = bytearray()
    emitted: list[Frame] = []
    for i, byte in enumerate(wire):
        buf.append(byte)
        emitted.extend(decode(buf))
        if i < len(wire) - 1:
            assert emitted == []
    assert emitted == [f]
    assert buf == bytearray()


def test_decode_keeps_partial_header_for_next_read() -> None:
    f = Frame(msg_type=0x14, payload=b"\xAA")
    wire = encode(f)
    buf = bytearray(wire[:2])           # only 'EL', not even full preamble
    assert list(decode(buf)) == []
    assert buf == bytearray(wire[:2])   # untouched: preamble may straddle

    buf.extend(wire[2:])                # complete the frame
    assert list(decode(buf)) == [f]


# ---------- decode: recovery -------------------------------------------


def test_decode_skips_garbage_before_preamble() -> None:
    f = Frame(msg_type=0x14, payload=b"\xAA")
    buf = bytearray(b"\x00\xFF\x99" + encode(f))
    assert list(decode(buf)) == [f]


def test_decode_drops_frame_on_bad_checksum() -> None:
    f = Frame(msg_type=0x14, payload=b"\xAA")
    wire = bytearray(encode(f))
    wire[-1] ^= 0xFF                  # corrupt checksum
    out = list(decode(wire))
    assert out == []                  # frame rejected
    # Buffer should have advanced past the bogus 'E'; no infinite loop.
    assert b"ELC" not in wire


def test_decode_recovers_after_bad_frame() -> None:
    bad = bytearray(encode(Frame(msg_type=0x14, payload=b"\xAA")))
    bad[-1] ^= 0xFF
    good = encode(Frame(msg_type=0x15, payload=b"\xBB"))
    buf = bytearray(bad + good)
    out = list(decode(buf))
    assert out == [Frame(msg_type=0x15, payload=b"\xBB")]


def test_decode_rejects_length_over_max() -> None:
    # Forge a frame with length=41 — codec should treat the leading 'E' as
    # garbage and resync (no frame emitted, no exception).
    wire = bytearray(PREAMBLE + bytes((0x14, MAX_PAYLOAD + 1)))
    out = list(decode(wire))
    assert out == []


def test_decode_partial_header_returns_no_frames() -> None:
    buf = bytearray(PREAMBLE + b"\x14")   # missing length byte
    assert len(buf) == HEADER_LEN - 1
    assert list(decode(buf)) == []
    assert bytes(buf) == PREAMBLE + b"\x14"


# ---------- exhaustive round-trip -------------------------------------


@pytest.mark.parametrize("msg_type", [0x00, 0x01, 0x15, 0x7F, 0x80, 0xFF])
@pytest.mark.parametrize("length", [0, 1, 7, MAX_PAYLOAD])
def test_roundtrip_property(msg_type: int, length: int) -> None:
    payload = bytes(i & 0xFF for i in range(length))
    f = Frame(msg_type=msg_type, payload=payload)
    buf = bytearray(encode(f))
    out = list(decode(buf))
    assert out == [f]
