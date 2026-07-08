"""Try several candidate ETLC RelayOverride encodings against the SCU.

Since the observed RX frames only include unsolicited RelayStatus
(opcode 0x25) responses, we don't have ground truth for the master →
SCU RelayOverride frame yet.  This script fires several plausible
variants in sequence and prints TX + RX for each, so we can identify
which variant (if any) makes the physical relay click.

Between each variant we pause 1s to give the operator time to hear
whether that specific frame produced a click.

Target: SRM_6S at scu=0 addr=2 channel=0 → ON.
"""

from __future__ import annotations

import socket
import sys
import time

HOST = "192.168.1.222"
PORT = 9760
PREAMBLE = b"\x45\x4C\x43\x40"    # ELC@


def _cs(body: bytes) -> int:
    return (0x87 - sum(body)) & 0xFF


def _cs_xor(body: bytes) -> int:
    x = 0
    for b in body:
        x ^= b
    return x


def _cs_neg_sum(body: bytes) -> int:
    return (-sum(body)) & 0xFF


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
    # Base fields for a 6sRM channel-0 ON command.
    TYPE_6SRM = 0x15
    SCU = 0x00
    ADDR = 0x02
    SUB = 0x00
    OP_OVERRIDE = 0x07
    STATE_ON = 0x01

    variants: list[tuple[str, bytes]] = []

    # (1) Current best guess: class=0x07, opcode=0x07, checksum=0x87-sum.
    body = bytes([0x07, TYPE_6SRM, SCU, ADDR, SUB, OP_OVERRIDE, STATE_ON])
    variants.append(("current: class=0x07 op=0x07 cs=0x87-sum",
                     PREAMBLE + body + bytes((_cs(body),))))

    # (2) Same but with XOR checksum.
    variants.append(("XOR checksum",
                     PREAMBLE + body + bytes((_cs_xor(body),))))

    # (3) Same but with two's-complement (-sum) checksum.
    variants.append(("two's-complement checksum",
                     PREAMBLE + body + bytes((_cs_neg_sum(body),))))

    # (4) Try opcode 0x05 (spec §7 alt) instead of 0x07.
    body4 = bytes([0x07, TYPE_6SRM, SCU, ADDR, SUB, 0x05, STATE_ON])
    variants.append(("opcode=0x05 (alt)",
                     PREAMBLE + body4 + bytes((_cs(body4),))))

    # (5) Try opcode 0x08 (multiple-relay override) with bitmask=0x01.
    body5 = bytes([0x07, TYPE_6SRM, SCU, ADDR, SUB, 0x08, STATE_ON])
    variants.append(("opcode=0x08 (multi-relay override)",
                     PREAMBLE + body5 + bytes((_cs(body5),))))

    # (6) Master identifies as SCU=0xFF (broadcast) instead of 0.
    body6 = bytes([0x07, TYPE_6SRM, 0xFF, ADDR, SUB, OP_OVERRIDE, STATE_ON])
    variants.append(("master scu=0xFF",
                     PREAMBLE + body6 + bytes((_cs(body6),))))

    for label, fr in variants:
        _emit(label, fr)
    print("=" * 60)
    print("done.")
    print("If any of the six made the relay click, note which one and")
    print("share the label + TX bytes.  We'll bake that variant into")
    print("the codec.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
