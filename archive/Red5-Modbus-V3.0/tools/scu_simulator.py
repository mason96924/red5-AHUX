"""SCU Modbus TCP simulator.

Stdlib-only async TCP server that mimics the Daekyung ELC SCU
(Lighting Control Gateway) per V2.1 of its Modbus protocol.

GOALS
-----
1. Be strict about the spec footguns so the real driver gets
   exercised against them in dev:
     - 50-byte message length cap (request AND response)
     - Single TCP connection only (refuse the second one)
     - Sequential request/response (no pipelining)
     - 1-second write reflection latency
     - Exception code 0x06 (DEVICE_NUM_MISMATCH) when server_id wrong
     - Exception code 0x07 (DEVICE_BUSY) is configurable for fault tests
2. Be configurable so tests can inject failures:
     - Set relay state
     - Set relay fail
     - Set device fail (bitmask)
     - Inject TCP disconnect
     - Inject DEVICE_BUSY for N consecutive requests
3. Be observable: structured logs of every transaction.

NOT GOALS
---------
- Bit-exact reproduction of vendor timing
- Modeling DSW (switch panel) -- spec mentions but doesn't detail
- 48 sRM specifics (range TBD in real spec)

USAGE
-----
    python3 scu_simulator.py --host 0.0.0.0 --port 5020 --server-id 1
    python3 scu_simulator.py --config sim_config.json
"""

from __future__ import annotations

import argparse
import asyncio
import json
import logging
import struct
import time
from dataclasses import dataclass, field
from typing import Optional

# =============================================================================
# Constants -- per SCU V2.1 spec
# =============================================================================

MAX_MESSAGE_BYTES = 50  # request OR response, per spec

# Function codes
FC_READ_COILS = 0x01
FC_READ_DISCRETE_INPUTS = 0x02
FC_READ_HOLDING_REGS = 0x03
FC_WRITE_SINGLE_COIL = 0x05
FC_WRITE_SINGLE_REG = 0x06
FC_WRITE_MULTIPLE_COILS = 0x0F
FC_WRITE_MULTIPLE_REGS = 0x10

# Exception codes (Modbus standard + SCU vendor extension)
EX_ILLEGAL_FUNCTION = 0x01
EX_ILLEGAL_DATA_ADDRESS = 0x02
EX_ILLEGAL_DATA_VALUE = 0x03
EX_ACK_TIMEOUT = 0x04
EX_CRC_MISMATCH = 0x05
EX_DEVICE_NUM_MISMATCH = 0x06
EX_DEVICE_BUSY = 0x07
EX_DEVICE_DATA_LINE_SHORT = 0x08
EX_DEVICE_ETC_ALARM = 0x09

# Coil address ranges per device type
COIL_4SRM_STATE = (0, 1999)
COIL_4SRM_FAIL = (2000, 3999)
COIL_4SRM_PSS = (4000, 11999)
COIL_EM_STATE = (12000, 14999)   # 4eRM + 6eRM
COIL_EM_FAIL = (15000, 17999)
COIL_6SRM_STATE = (24000, 29999)
COIL_6SRM_FAIL = (30000, 35999)
COIL_6SRM_PSS = (36000, 51999)
COIL_EM_PSS = (52000, 59999)

# Holding register ranges
HR_4SRM_DEVICE_FAIL = (16000, 16032)
HR_6SRM_DEVICE_FAIL = (50000, 50062)
HR_EM_DEVICE_FAIL = (60000, 60032)
HR_DATETIME = (65500, 65505)


# =============================================================================
# State model
# =============================================================================

@dataclass
class SCUState:
    """Mutable simulated state of the SCU.

    Coils are stored as a sparse dict {address: bool}.  Holding registers
    same {address: uint16}.  Unknown addresses default to 0 (per spec:
    "unused parts are filled with 0").
    """
    coils: dict[int, bool] = field(default_factory=dict)
    holding_regs: dict[int, int] = field(default_factory=dict)

    # ---- fault injection knobs (set by admin API or config) ----
    busy_remaining: int = 0          # next N requests return DEVICE_BUSY
    force_disconnect_after: int = -1  # if >=0, disconnect after this many ops

    def get_coil(self, addr: int) -> bool:
        return self.coils.get(addr, False)

    def set_coil(self, addr: int, value: bool) -> None:
        self.coils[addr] = bool(value)

    def get_reg(self, addr: int) -> int:
        return self.holding_regs.get(addr, 0)

    def set_reg(self, addr: int, value: int) -> None:
        self.holding_regs[addr] = value & 0xFFFF


# =============================================================================
# Modbus TCP framing
# =============================================================================

@dataclass
class MBAPHeader:
    transaction_id: int
    protocol_id: int
    length: int
    unit_id: int

    @classmethod
    def parse(cls, buf: bytes) -> "MBAPHeader":
        if len(buf) < 7:
            raise ValueError(f"MBAP header too short ({len(buf)} bytes)")
        tid, pid, length, uid = struct.unpack(">HHHB", buf[:7])
        return cls(tid, pid, length, uid)

    def pack(self) -> bytes:
        return struct.pack(">HHHB", self.transaction_id, self.protocol_id,
                           self.length, self.unit_id)


def make_exception_response(tid: int, unit_id: int, fc: int,
                            exception_code: int) -> bytes:
    """Build an exception response frame."""
    pdu = bytes([fc | 0x80, exception_code])
    header = MBAPHeader(tid, 0, len(pdu) + 1, unit_id)
    return header.pack() + pdu


def make_response(tid: int, unit_id: int, pdu: bytes) -> bytes:
    """Wrap a PDU in MBAP header and enforce the 50-byte cap."""
    header = MBAPHeader(tid, 0, len(pdu) + 1, unit_id)
    frame = header.pack() + pdu
    if len(frame) > MAX_MESSAGE_BYTES:
        # This should never happen if request validation rejected oversize
        # ranges, but we guard anyway.
        raise ValueError(
            f"Response frame {len(frame)} bytes exceeds {MAX_MESSAGE_BYTES}"
        )
    return frame


# =============================================================================
# Request handlers
# =============================================================================

def _validate_response_size(payload_bytes: int) -> bool:
    """Return True if a PDU of `payload_bytes` (including FC byte and
    byte-count byte) would fit in MAX_MESSAGE_BYTES once wrapped in
    the 7-byte MBAP header."""
    return (7 + payload_bytes) <= MAX_MESSAGE_BYTES


def handle_read_coils(state: SCUState, pdu: bytes) -> bytes:
    """FC=01 / FC=02: read coils.

    PDU (request):   FC | start_addr_hi | start_addr_lo | qty_hi | qty_lo
    PDU (response):  FC | byte_count    | coil_bytes...
    """
    if len(pdu) != 5:
        return _exc_pdu(pdu[0], EX_ILLEGAL_DATA_VALUE)
    fc, start, qty = struct.unpack(">BHH", pdu)
    if qty < 1 or qty > 2000:
        return _exc_pdu(fc, EX_ILLEGAL_DATA_VALUE)
    # Per spec: max response is 50 bytes total. Header=7, then FC=1,
    # byte_count=1, then coil bytes. So max coil_bytes = 41.
    byte_count = (qty + 7) // 8
    if not _validate_response_size(2 + byte_count):
        return _exc_pdu(fc, EX_ILLEGAL_DATA_VALUE)
    # Pack coils into bytes, LSB-first per Modbus spec
    out = bytearray(byte_count)
    for i in range(qty):
        if state.get_coil(start + i):
            out[i // 8] |= (1 << (i % 8))
    return bytes([fc, byte_count]) + bytes(out)


def handle_read_holding_regs(state: SCUState, pdu: bytes) -> bytes:
    """FC=03: read holding registers."""
    if len(pdu) != 5:
        return _exc_pdu(pdu[0], EX_ILLEGAL_DATA_VALUE)
    fc, start, qty = struct.unpack(">BHH", pdu)
    if qty < 1 or qty > 125:
        return _exc_pdu(fc, EX_ILLEGAL_DATA_VALUE)
    # max response payload (excl MBAP) = 50-7 = 43 bytes
    # = FC(1) + byte_count(1) + qty*2.  So qty <= 20.
    if not _validate_response_size(2 + qty * 2):
        return _exc_pdu(fc, EX_ILLEGAL_DATA_VALUE)
    out = bytearray()
    for i in range(qty):
        out += struct.pack(">H", state.get_reg(start + i))
    return bytes([fc, qty * 2]) + bytes(out)


def handle_write_single_coil(state: SCUState, pdu: bytes) -> tuple[bytes, Optional[tuple]]:
    """FC=05: write a single coil.

    Returns (response_pdu, deferred_write) where deferred_write is
    (delay_seconds, callable) -- the simulator schedules the actual
    coil state change after the spec'd 1-second latency.
    """
    if len(pdu) != 5:
        return _exc_pdu(pdu[0], EX_ILLEGAL_DATA_VALUE), None
    fc, addr, value = struct.unpack(">BHH", pdu)
    if value not in (0x0000, 0xFF00):
        return _exc_pdu(fc, EX_ILLEGAL_DATA_VALUE), None
    new_state = (value == 0xFF00)
    # Per spec: relay state change reflects ~1 second after command.
    # Echo the request back as response immediately.
    def apply():
        state.set_coil(addr, new_state)
    return pdu, (1.0, apply)


def handle_write_multiple_coils(state: SCUState, pdu: bytes) -> tuple[bytes, Optional[tuple]]:
    """FC=0F: write multiple coils."""
    if len(pdu) < 6:
        return _exc_pdu(pdu[0], EX_ILLEGAL_DATA_VALUE), None
    fc, start, qty, byte_count = struct.unpack(">BHHB", pdu[:6])
    if qty < 1 or qty > 1968 or byte_count != (qty + 7) // 8:
        return _exc_pdu(fc, EX_ILLEGAL_DATA_VALUE), None
    if len(pdu) != 6 + byte_count:
        return _exc_pdu(fc, EX_ILLEGAL_DATA_VALUE), None
    # Check response size: FC(1) + start(2) + qty(2) = 5 bytes -> always fits
    payload = pdu[6:]
    def apply():
        for i in range(qty):
            bit = (payload[i // 8] >> (i % 8)) & 1
            state.set_coil(start + i, bool(bit))
    # Spec note: multi-coil writes may take longer than 1 s.
    delay = 1.0 + 0.001 * qty  # ~1 ms extra per coil; arbitrary but plausible
    response = struct.pack(">BHH", fc, start, qty)
    return response, (delay, apply)


def handle_write_multiple_regs(state: SCUState, pdu: bytes) -> bytes:
    """FC=10: write multiple holding registers (used for SCU Date/Time)."""
    if len(pdu) < 6:
        return _exc_pdu(pdu[0], EX_ILLEGAL_DATA_VALUE)
    fc, start, qty, byte_count = struct.unpack(">BHHB", pdu[:6])
    if qty < 1 or qty > 123 or byte_count != qty * 2:
        return _exc_pdu(fc, EX_ILLEGAL_DATA_VALUE)
    if len(pdu) != 6 + byte_count:
        return _exc_pdu(fc, EX_ILLEGAL_DATA_VALUE)
    for i in range(qty):
        val = struct.unpack(">H", pdu[6 + i * 2: 8 + i * 2])[0]
        state.set_reg(start + i, val)
    return struct.pack(">BHH", fc, start, qty)


def _exc_pdu(fc: int, code: int) -> bytes:
    """Build the PDU portion of an exception response (without MBAP)."""
    return bytes([(fc & 0x7F) | 0x80, code])


# =============================================================================
# Server
# =============================================================================

class SCUSimulator:
    def __init__(self, host: str, port: int, server_id: int,
                 state: Optional[SCUState] = None,
                 strict_single_connection: bool = True) -> None:
        self.host = host
        self.port = port
        self.server_id = server_id
        self.state = state or SCUState()
        self.strict_single_connection = strict_single_connection
        self._active_writer: Optional[asyncio.StreamWriter] = None
        self._log = logging.getLogger("scu_sim")

    async def serve_forever(self) -> None:
        srv = await asyncio.start_server(self._handle_client, self.host, self.port)
        addrs = ", ".join(str(s.getsockname()) for s in srv.sockets)
        self._log.info("SCU sim listening on %s (server_id=%d)",
                       addrs, self.server_id)
        async with srv:
            await srv.serve_forever()

    async def _handle_client(self, reader: asyncio.StreamReader,
                             writer: asyncio.StreamWriter) -> None:
        peer = writer.get_extra_info("peername")
        if self.strict_single_connection and self._active_writer is not None:
            self._log.warning("rejecting 2nd connection from %s "
                              "(spec allows one only)", peer)
            writer.close()
            await writer.wait_closed()
            return
        self._active_writer = writer
        self._log.info("client connected: %s", peer)
        try:
            await self._client_loop(reader, writer)
        except asyncio.IncompleteReadError:
            self._log.info("client %s closed connection", peer)
        except Exception:
            self._log.exception("client loop error")
        finally:
            self._active_writer = None
            try:
                writer.close()
                await writer.wait_closed()
            except Exception:
                pass

    async def _client_loop(self, reader: asyncio.StreamReader,
                           writer: asyncio.StreamWriter) -> None:
        op_count = 0
        while True:
            # Read MBAP header (7 bytes)
            header_buf = await reader.readexactly(7)
            header = MBAPHeader.parse(header_buf)
            # `length` includes unit_id (1) + PDU; we already read 1 unit_id.
            pdu_len = header.length - 1
            pdu = await reader.readexactly(pdu_len)

            # Enforce request size cap
            request_size = 7 + pdu_len
            if request_size > MAX_MESSAGE_BYTES:
                self._log.warning("oversized request %d bytes -> ILLEGAL_DATA_VALUE",
                                  request_size)
                resp = make_exception_response(header.transaction_id,
                                               header.unit_id,
                                               pdu[0] if pdu else 0,
                                               EX_ILLEGAL_DATA_VALUE)
                writer.write(resp); await writer.drain()
                continue

            # Server ID check
            if header.unit_id != self.server_id:
                resp = make_exception_response(header.transaction_id,
                                               header.unit_id,
                                               pdu[0] if pdu else 0,
                                               EX_DEVICE_NUM_MISMATCH)
                writer.write(resp); await writer.drain()
                continue

            # Busy injection
            if self.state.busy_remaining > 0:
                self.state.busy_remaining -= 1
                resp = make_exception_response(header.transaction_id,
                                               header.unit_id,
                                               pdu[0] if pdu else 0,
                                               EX_DEVICE_BUSY)
                writer.write(resp); await writer.drain()
                continue

            response_pdu, deferred = await self._dispatch(pdu)
            try:
                resp = make_response(header.transaction_id, header.unit_id,
                                     response_pdu)
            except ValueError as ex:
                self._log.error("response oversized: %s", ex)
                resp = make_exception_response(header.transaction_id,
                                               header.unit_id,
                                               pdu[0] if pdu else 0,
                                               EX_ILLEGAL_DATA_VALUE)
            writer.write(resp); await writer.drain()

            if deferred:
                delay, apply = deferred
                asyncio.create_task(self._apply_deferred(delay, apply))

            op_count += 1
            if (self.state.force_disconnect_after >= 0 and
                op_count >= self.state.force_disconnect_after):
                self._log.info("force-disconnect after %d ops", op_count)
                writer.close()
                return

    async def _apply_deferred(self, delay: float, fn) -> None:
        await asyncio.sleep(delay)
        try:
            fn()
        except Exception:
            self._log.exception("deferred apply error")

    async def _dispatch(self, pdu: bytes) -> tuple[bytes, Optional[tuple]]:
        if not pdu:
            return _exc_pdu(0, EX_ILLEGAL_FUNCTION), None
        fc = pdu[0]
        if fc == FC_READ_COILS or fc == FC_READ_DISCRETE_INPUTS:
            return handle_read_coils(self.state, pdu), None
        if fc == FC_READ_HOLDING_REGS:
            return handle_read_holding_regs(self.state, pdu), None
        if fc == FC_WRITE_SINGLE_COIL:
            return handle_write_single_coil(self.state, pdu)
        if fc == FC_WRITE_MULTIPLE_COILS:
            return handle_write_multiple_coils(self.state, pdu)
        if fc == FC_WRITE_MULTIPLE_REGS:
            return handle_write_multiple_regs(self.state, pdu), None
        return _exc_pdu(fc, EX_ILLEGAL_FUNCTION), None


# =============================================================================
# Config + CLI
# =============================================================================

def populate_from_config(state: SCUState, cfg: dict) -> None:
    """Seed state from a config dict.

    Schema:
      {
        "coils":         { "<addr>": true/false, ... },
        "holding_regs":  { "<addr>": <uint16>, ... },
        "datetime":      { "year":2026, "month":5, "day":29, "hour":12,
                           "minute":0, "second":0 }   (optional)
      }
    """
    for addr, val in (cfg.get("coils") or {}).items():
        # Skip comment keys (any key starting with "_" or non-numeric)
        if not addr.lstrip("-").isdigit():
            continue
        state.set_coil(int(addr), bool(val))
    for addr, val in (cfg.get("holding_regs") or {}).items():
        if not addr.lstrip("-").isdigit():
            continue
        state.set_reg(int(addr), int(val))
    dt = cfg.get("datetime")
    if dt:
        state.set_reg(65500, dt.get("year",   2026))
        state.set_reg(65501, dt.get("month",  1))
        state.set_reg(65502, dt.get("day",    1))
        state.set_reg(65503, dt.get("hour",   0))
        state.set_reg(65504, dt.get("minute", 0))
        state.set_reg(65505, dt.get("second", 0))


def main() -> int:
    parser = argparse.ArgumentParser(description="SCU Modbus TCP simulator")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=5020)
    parser.add_argument("--server-id", type=int, default=1)
    parser.add_argument("--config", help="Path to JSON state config")
    parser.add_argument("--allow-multi-conn", action="store_true",
                        help="Disable single-connection enforcement (off-spec; for testing)")
    parser.add_argument("--verbose", action="store_true")
    args = parser.parse_args()

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s %(name)s %(levelname)s %(message)s",
    )

    state = SCUState()
    if args.config:
        with open(args.config) as f:
            cfg = json.load(f)
        populate_from_config(state, cfg)

    sim = SCUSimulator(args.host, args.port, args.server_id,
                       state=state,
                       strict_single_connection=not args.allow_multi_conn)
    try:
        asyncio.run(sim.serve_forever())
    except KeyboardInterrupt:
        return 0
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
