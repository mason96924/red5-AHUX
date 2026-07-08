"""Try candidate ETLC master→SCU RelayOverride frames (post-doc re-read).

The 2026-02-11 re-extraction of the ETLC V3.8 doc revealed:

  * Preamble is 3 bytes ("ELC" = 45 4C 43), not 4 bytes.
  * Byte 3 is Type (the opcode itself for master TX).
  * Byte 4 is Length (# bytes remaining: data + checksum).
  * Checksum = (~(sum(data_bytes) + 0x80) + 1) & 0xFF.
    Equivalent to (0x80 - sum(data)) & 0xFF.  Verified vs 10 observed
    RX frames with Type=0x40 wrapper.

For master TX, the doc lists Relay Override at Type=0x07 (single) and
Type=0x08 (multi).  The doc's format for 0x08 is:

    TTTTTTTT | UUUUUUAA | AAAAAAAA | 00SSSSSS | FFFFFFFF |
    LLLLLLLL | RRRRRRRR | .. DI1 ..

Some fields are ambiguous (FFFFFFFF may be 1 byte 0xFF or 4 bytes,
DI1 is described as "action subject" -- probably a source-ID byte).

This script fires four variants of a single-relay ON command in
sequence with 2-second pauses so the operator can hear which one (if
any) makes the physical 6sRM channel-0 relay click.

Target: SRM_6S (0x15) at scu=0 addr=2 channel=0 → ON.
"""

from __future__ import annotations

import socket
import sys
import time

HOST = "192.168.1.222"
PORT = 9760
PREAMBLE = b"\x45\x4C\x43"      # "ELC" (3 bytes)


def _cs_doc(data: bytes) -> int:
    """(~(sum(data) + 0x80) + 1) & 0xFF -- the algorithm from the
    ETLC doc, matches observed RX byte-for-byte."""
    return ((~(sum(data) + 0x80)) + 1) & 0xFF


def _frame(type_byte: int, data: bytes) -> bytes:
    """Build a full frame: PRE + Type + Length + Data + Checksum.

    Length is "number of bytes after Length itself" = len(data) + 1
    (for the checksum), matching the observed RX Length=0x07 when
    data was 6 bytes.
    """
    length = len(data) + 1
    cs = _cs_doc(data)
    return PREAMBLE + bytes((type_byte, length)) + data + bytes((cs,))


def _emit(label: str, frame: bytes) -> None:
    print("=" * 60)
    print(f"variant : {label}")
    print(f"TX ({len(frame)} B): {' '.join(f'{b:02X}' for b in frame)}")
    try:
        with socket.create_connection((HOST, PORT), timeout=3.0) as s:
            s.sendall(frame)
            s.settimeout(1.0)
            buf = bytearray()
            deadline = time.monotonic() + 1.0
            while time.monotonic() < deadline:
                try:
                    chunk = s.recv(4096)
                    if not chunk:
                        break
                    buf.extend(chunk)
                except socket.timeout:
                    break
        if buf:
            print(f"RX ({len(buf)} B): {' '.join(f'{b:02X}' for b in buf)}")
        else:
            print("RX: (nothing)")
    except OSError as e:
        print(f"error : {e}")
    print("  >> did the relay click?  waiting 2s ...")
    time.sleep(2.0)


def main() -> int:
    TYPE_RELAY_OVERRIDE = 0x07
    TYPE_MULTI_OVERRIDE = 0x08
    TYPE_6SRM = 0x15
    SCU = 0x00
    ADDR = 0x02
    SUB = 0x00
    STATE_ON = 0x01

    variants: list[tuple[str, bytes]] = []

    # (A) Straight interpretation of doc: Type=0x07 (single override),
    #     Data = dev_type + scu + addr + sub + state.
    data_a = bytes([TYPE_6SRM, SCU, ADDR, SUB, STATE_ON])
    variants.append(("Type=0x07 minimal (5 data bytes)",
                     _frame(TYPE_RELAY_OVERRIDE, data_a)))

    # (B) Doc mentions FFFFFFFF (Flag) between sub-address and payload.
    #     Interpret as ONE 0xFF byte.
    data_b = bytes([TYPE_6SRM, SCU, ADDR, SUB, 0xFF, STATE_ON])
    variants.append(("Type=0x07 with 1-byte Flag=0xFF",
                     _frame(TYPE_RELAY_OVERRIDE, data_b)))

    # (C) FFFFFFFF interpreted as 4 bytes.
    data_c = bytes([TYPE_6SRM, SCU, ADDR, SUB, 0xFF, 0xFF, 0xFF, 0xFF, STATE_ON])
    variants.append(("Type=0x07 with 4-byte Flag=FFFFFFFF",
                     _frame(TYPE_RELAY_OVERRIDE, data_c)))

    # (D) Multi-relay override 0x08 with bitmask -- easier per doc.
    #     Data = dev_type + scu + addr + subaddr + mask_target + mask_on
    data_d = bytes([TYPE_6SRM, SCU, ADDR, 0x01, 0x01, 0x01])
    variants.append(("Type=0x08 multi-relay, bitmask=0x01 (ch 0 only)",
                     _frame(TYPE_MULTI_OVERRIDE, data_d)))

    for label, fr in variants:
        _emit(label, fr)

    print("=" * 60)
    print("done.  If any variant made the physical relay click,")
    print("please share the label + TX bytes.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
