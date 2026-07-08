"""ETLC V3.8 hardware probe -- one-shot test.

Opens a plain TCP socket to the SCU, sends ONE RelayOverride frame
(opcode 0x07) in our best-guess V3.8 format, waits briefly for any
response, and prints everything.  Used to resolve the ambiguities in
docs/RED5-ETLC-V3.8-PROTOCOL.md §8 against actual hardware without
having to route through the full driver stack.

Usage (on a machine on the SCU's LAN):

    cd archive/Red5-ELC-V3.0
    python scripts/probe-v38.py --state on   \\
        --host 192.168.1.222 --port 9760   \\
        --dev-type SRM_6S --scu 1 --addr 2 --sub 0

What to look for:

    * TX bytes are printed hex-formatted
    * If the SCU sends anything back within 2s, RX bytes are also
      hex-formatted with an attempt to parse as V3.8 RelayState.
    * Silent SCU + no relay click = frame rejected; likely one of
      Flag length, checksum algorithm, or byte order is wrong.
      Copy-paste the TX bytes into a message and I'll re-encode with
      alternative choices.
    * Physical relay click + no RX = we can send but we can't hear.
      Fix parse side next.
    * Physical relay click + RX matching our RelayState decoder = we
      have full bidirectional V3.8 in one commit.  Ship it.

This script does NOT go through the driver/ScuLink stack.  It's a
minimal TCP send/recv so any success can be attributed cleanly to
the frame bytes, not to our transport layer.
"""

from __future__ import annotations

import argparse
import socket
import sys
import time

from elc.codec.device_id import DeviceId, DeviceType
from elc.codec.etlc38 import (
    RelayOverrideV38,
    RelayStateV38,
    checksum,
    decode_device_id_v38,
)


def _fmt_bytes(data: bytes) -> str:
    """`FF FF FF FF 15 04 02 00 07 01 22` style, groups of 1 byte."""
    return " ".join(f"{b:02X}" for b in data)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--host", default="192.168.1.222")
    ap.add_argument("--port", type=int, default=9760)
    ap.add_argument("--dev-type", default="SRM_6S",
                    help="One of SRM_4S, SRM_6S, SRM_ERM, SRM_48S")
    ap.add_argument("--scu", type=int, default=1)
    ap.add_argument("--addr", type=int, default=2, help="Module address")
    ap.add_argument("--sub", type=int, default=0, help="Relay channel (0-5)")
    ap.add_argument("--state", choices=("on", "off"), default="on")
    ap.add_argument("--timeout", type=float, default=2.0,
                    help="Seconds to wait for a response after sending.")
    args = ap.parse_args()

    try:
        dev_type = DeviceType[args.dev_type]
    except KeyError:
        print(f"error: unknown device type {args.dev_type!r}", file=sys.stderr)
        return 2

    dev = DeviceId(
        dev_type=dev_type, scu=args.scu,
        address=args.addr, sub_address=args.sub,
    )
    frame = RelayOverrideV38(device=dev, state=(args.state == "on")).encode()

    print(f"Probe target : {dev} → {args.state.upper()}")
    print(f"SCU endpoint : {args.host}:{args.port}")
    print(f"TX ({len(frame):>2} B): {_fmt_bytes(frame)}")
    print(f"  checksum   : 0x{frame[-1]:02X} "
          f"(sum of bytes 0..{len(frame)-2} = 0x{checksum(frame[:-1]):02X})")
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
        print()
        print("Diagnosis hints:")
        print(" * If a physical relay clicked → frame accepted but SCU stays "
              "silent (parse side needs work).")
        print(" * If nothing happened          → frame rejected; likely one "
              "of: Flag len, checksum, bit order.")
        print(" * Please share the TX bytes above; that'll be enough to "
              "iterate on the next attempt.")
        return 0

    print(f"RX ({len(buf):>2} B): {_fmt_bytes(bytes(buf))}")
    # Try parsing as a V3.8 RelayState echo.
    for offset in range(0, len(buf) - 10):
        candidate = bytes(buf[offset : offset + 11])
        parsed = RelayStateV38.try_decode(candidate)
        if parsed is not None:
            print(f"  parsed as RelayState V3.8 (offset {offset}): "
                  f"{parsed.device} = {'ON' if parsed.state else 'OFF'}")
            break
    else:
        print("  (no V3.8 RelayState frame found in the response)")

    return 0


if __name__ == "__main__":
    sys.exit(main())
