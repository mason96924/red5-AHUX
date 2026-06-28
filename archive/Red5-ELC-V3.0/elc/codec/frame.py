"""Frame-level codec for the ELC TCP variant.

Wire layout (network byte order):

    0   1   2     3        4        5 ............ 4+N      5+N
    +---+---+---+--------+--------+----------------+---------+
    | E | L | C |  Type  | Length |   Data (N B)   | Cksum   |
    +---+---+---+--------+--------+----------------+---------+
                                  <----- N ≤ 40 ----->

`checksum` is the low byte of the unsigned sum of every byte that
precedes it (preamble + Type + Length + Data).  This matches the
ELCC48 spec referenced in docs/ARCHITECTURE.md §7 and is treated as
authoritative until contradicted by a Wireshark capture.
"""

from __future__ import annotations

from collections.abc import Iterator
from dataclasses import dataclass
from typing import Final

PREAMBLE: Final[bytes] = b"ELC"
MAX_PAYLOAD: Final[int] = 40
HEADER_LEN: Final[int] = len(PREAMBLE) + 2  # 'ELC' + Type + Length
OVERHEAD_LEN: Final[int] = HEADER_LEN + 1   # + checksum byte


class FrameError(ValueError):
    """Raised when a frame is structurally invalid."""


@dataclass(frozen=True)
class Frame:
    """A decoded ELC frame.

    `payload` may be empty.  `msg_type` is 0..255.  Checksum is *not*
    stored — `encode()` computes it and `decode()` verifies it.
    """

    msg_type: int
    payload: bytes = b""

    def __post_init__(self) -> None:
        if not 0 <= self.msg_type <= 0xFF:
            raise FrameError(f"msg_type {self.msg_type!r} out of range 0..255")
        if len(self.payload) > MAX_PAYLOAD:
            raise FrameError(
                f"payload length {len(self.payload)} > MAX_PAYLOAD ({MAX_PAYLOAD})"
            )


def checksum(data: bytes) -> int:
    """Low byte of the unsigned sum of `data`.

    Pure function; no side-effects.  Used for both encode and verify.
    """
    return sum(data) & 0xFF


def encode(frame: Frame) -> bytes:
    """Serialise a `Frame` into wire bytes (preamble + header + payload + checksum)."""
    n = len(frame.payload)
    header = bytes((frame.msg_type, n))
    body = PREAMBLE + header + frame.payload
    return body + bytes((checksum(body),))


def decode(buf: bytearray) -> Iterator[Frame]:
    """Streaming parser.

    Consumes complete frames from the *front* of `buf` (mutates in
    place) and yields each as a `Frame`.  Any leading garbage that
    cannot start a frame is dropped one byte at a time; partial frames
    at the tail are left untouched for the next read.

    On checksum mismatch the offending preamble byte is discarded and
    we keep scanning — this is the standard recovery for a noisy
    serial link bridged over TCP.
    """
    while True:
        # Find the next 'ELC' preamble.
        idx = buf.find(PREAMBLE)
        if idx == -1:
            # No preamble at all.  Keep at most len(PREAMBLE)-1 trailing
            # bytes so a preamble that straddles two reads still resolves.
            if len(buf) >= len(PREAMBLE):
                del buf[: len(buf) - (len(PREAMBLE) - 1)]
            return
        if idx > 0:
            del buf[:idx]

        # Need at least preamble + type + length to know the frame size.
        if len(buf) < HEADER_LEN:
            return

        msg_type = buf[len(PREAMBLE)]
        length = buf[len(PREAMBLE) + 1]
        if length > MAX_PAYLOAD:
            # Impossible length — corrupt preamble; skip past the 'E'.
            del buf[0]
            continue

        total = OVERHEAD_LEN + length
        if len(buf) < total:
            return  # wait for more bytes

        body = bytes(buf[: total - 1])
        cksum_recv = buf[total - 1]
        if checksum(body) != cksum_recv:
            # Bad checksum: drop the leading byte and re-scan.
            del buf[0]
            continue

        payload = bytes(buf[HEADER_LEN : HEADER_LEN + length])
        del buf[:total]
        yield Frame(msg_type=msg_type, payload=payload)
