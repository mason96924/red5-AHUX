"""ETLC V3.8 hardware probe -- one-shot test (post-hardware-capture rev).

Opens a plain TCP socket to the SCU, sends ONE RelayOverride frame
(opcode 0x07) in the *observed* V3.8 wire format:

    preamble "ELC@"  + class 0x07 + type + scu + addr + sub +
    opcode 0x07 + state + checksum

Bypasses the driver / ScuLink stack.  Prints TX / RX in hex and
tries to parse the RX as a RelayStatus (opcode 0x25) frame.
"""

from __future__ import annotations

import argparse
import socket
import sys
import time

from elc.codec.device_id import DeviceId, DeviceType
from elc.codec.etlc38 import (
    FRAME_LEN,
    RelayOverrideV38,
    RelayStatusV38,
    channels_from_mask,
    checksum,
)


def _fmt(data: bytes) -> str:
    return " ".join(f"{b:02X}" for b in data)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--host", default="192.168.1.222")
    ap.add_argument("--port", type=int, default=9760)
    ap.add_argument("--dev-type", default="SRM_6S",
                    help="SRM_4S | SRM_6S | SRM_6E | SRM_48S")
    ap.add_argument("--scu", type=int, default=0,
                    help="SCU bus number.  Physical SCU reports 0.")
    ap.add_argument("--addr", type=int, default=2)
    ap.add_argument("--sub", type=int, default=0)
    ap.add_argument("--state", choices=("on", "off"), default="on")
    ap.add_argument("--timeout", type=float, default=2.0)
    args = ap.parse_args()

    try:
        dev_type = DeviceType[args.dev_type]
    except KeyError:
        print(f"error: unknown device type {args.dev_type!r}", file=sys.stderr)
        return 2

    dev = DeviceId(dev_type=dev_type, scu=args.scu,
                   address=args.addr, sub_address=args.sub)
    frame = RelayOverrideV38(device=dev, state=(args.state == "on")).encode()
    assert len(frame) == FRAME_LEN

    print(f"Probe target : {dev} → {args.state.upper()}")
    print(f"SCU endpoint : {args.host}:{args.port}")
    print(f"TX ({len(frame):>2} B): {_fmt(frame)}")
    print(f"  header sum : 0x{sum(frame[4:11]):02X}  "
          f"checksum={_fmt(frame[-1:])} "
          f"(expected 0x{checksum(frame[4:11]):02X})")
    print()

    with socket.create_connection((args.host, args.port), timeout=5.0) as sock:
        sock.sendall(frame)
        sock.settimeout(args.timeout)
        buf = bytearray()
        deadline = time.monotonic() + args.timeout
        while time.monotonic() < deadline:
            try:
                chunk = sock.recv(4096)
                if not chunk:
                    print("  (connection closed by SCU)")
                    break
                buf.extend(chunk)
            except socket.timeout:
                break

    if not buf:
        print("RX: (no bytes received within timeout)")
        return 0

    print(f"RX ({len(buf):>2} B): {_fmt(bytes(buf))}")
    for offset in range(0, len(buf) - FRAME_LEN + 1):
        cand = bytes(buf[offset : offset + FRAME_LEN])
        status = RelayStatusV38.try_decode(cand)
        if status is not None:
            channels = channels_from_mask(status.state_mask, 6)
            print(f"  parsed as RelayStatus V3.8 (offset {offset}): "
                  f"{status.device} mask=0x{status.state_mask:02X}  "
                  f"channels-on={[i for i, on in enumerate(channels) if on]}")
            break
    else:
        print("  (no V3.8 RelayStatus frame found in the response)")

    return 0


if __name__ == "__main__":
    sys.exit(main())
