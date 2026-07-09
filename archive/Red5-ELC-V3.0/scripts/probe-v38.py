"""ETLC V3.8 hardware probe -- **v2, vendor-tool captured**.

Frame format now matches what "SCU Smart Manager V1.6.9" sends on the
wire (captured 2026-07-09 by the operator):

    45 4C 43   40   0B   <payload:10>              <cs>
    preamble  type len   dev_type|scu|addr|ch|op|state|DI1(4B)  cs

Where:
  * preamble = "ELC" (45 4C 43)
  * type     = 0x40 (ETLC protocol wrapper)
  * length   = 0x0B (11 bytes remaining: 10 data + 1 checksum)
  * payload  = [dev_type][scu][module_addr][channel_0based]
               [opcode=0x07][state][DI1:0x11,0x12,0x13,0x14]
  * checksum = (~(sum(payload) + 0x80) + 1) & 0xFF

Wire vs UI addressing convention (per operator, 2026-07-09):
  * SCU:     0-based on wire  (UI SCU=1  → wire 0x00)
  * Module:  1-based on wire  (UI addr=2 → wire 0x02)
  * Channel: 0-based on wire  (UI sub=2  → wire 0x01)  ← different!

Golden validation vs vendor-tool capture (6SRM addr=2 sub=2 ON):
    TX = 45 4C 43 40 0B  15 00 02 01 07 01 11 12 13 14  F6
"""

from __future__ import annotations

import argparse
import socket
import sys
import time

HOST_DEFAULT = "192.168.1.222"
PORT_DEFAULT = 9760

PREAMBLE = b"\x45\x4C\x43"                 # "ELC"
TYPE_WRAP = 0x40                            # ETLC protocol wrapper
DI1_TAIL = bytes((0x11, 0x12, 0x13, 0x14))  # captured DI1 source-ID


def _cs(payload: bytes) -> int:
    """(~(sum(payload) + 0x80) + 1) & 0xFF -- matches vendor tool."""
    return ((~(sum(payload) + 0x80)) + 1) & 0xFF


def build_relay_override(
    *, dev_type: int, scu: int, module_addr: int,
    channel_wire: int, state_on: bool,
) -> bytes:
    payload = bytes([
        dev_type & 0xFF,
        scu & 0xFF,
        module_addr & 0xFF,
        channel_wire & 0xFF,
        0x07,                        # opcode = Relay Override
        0x01 if state_on else 0x00,  # state
    ]) + DI1_TAIL
    assert len(payload) == 10
    return PREAMBLE + bytes((TYPE_WRAP, len(payload) + 1)) + payload + bytes((_cs(payload),))


def _fmt(data: bytes) -> str:
    return " ".join(f"{b:02X}" for b in data)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--host", default=HOST_DEFAULT)
    ap.add_argument("--port", type=int, default=PORT_DEFAULT)
    ap.add_argument("--dev-type", type=lambda s: int(s, 0), default=0x15,
                    help="Wire dev_type byte.  6SRM=0x15, 4SRM=0x14, ERM=0x16.")
    ap.add_argument("--scu", type=int, default=0,
                    help="Wire SCU number (0-based). UI SCU=1 -> pass 0.")
    ap.add_argument("--addr", type=int, default=2,
                    help="Module address (1-based on wire).")
    ap.add_argument("--channel-ui", type=int, default=1,
                    help="Channel number as shown in the UI (1-based); "
                         "we subtract 1 to get the wire value.")
    ap.add_argument("--state", choices=("on", "off"), default="on")
    ap.add_argument("--timeout", type=float, default=2.0)
    args = ap.parse_args()

    channel_wire = args.channel_ui - 1
    frame = build_relay_override(
        dev_type=args.dev_type, scu=args.scu, module_addr=args.addr,
        channel_wire=channel_wire, state_on=(args.state == "on"),
    )
    print(f"Target       : dev=0x{args.dev_type:02X} scu={args.scu} "
          f"addr={args.addr} ch(UI)={args.channel_ui} ch(wire)={channel_wire} "
          f"→ {args.state.upper()}")
    print(f"SCU endpoint : {args.host}:{args.port}")
    print(f"TX ({len(frame)} B): {_fmt(frame)}")
    print(f"  checksum   : 0x{frame[-1]:02X}")
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
                    break
                buf.extend(chunk)
            except socket.timeout:
                break

    if buf:
        print(f"RX ({len(buf)} B): {_fmt(bytes(buf))}")
    else:
        print("RX: (nothing)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
