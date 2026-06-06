"""Tests for the SCU Modbus TCP simulator.

These tests verify the simulator implements the SCU V2.1 spec correctly.
They double as a Modbus TCP framing reference because they speak the
wire protocol directly (no driver code yet).

Run:
    cd archive/Red5-Modbus-V3.0
    python3 -m pytest tests/test_scu_simulator.py -v
"""
from __future__ import annotations

import asyncio
import os
import struct
import sys

import pytest

# Make the simulator importable
HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(HERE)
sys.path.insert(0, PROJECT_ROOT)
from tools.scu_simulator import (
    SCUSimulator, SCUState,
    FC_READ_COILS, FC_READ_HOLDING_REGS,
    FC_WRITE_SINGLE_COIL, FC_WRITE_MULTIPLE_COILS,
    FC_WRITE_MULTIPLE_REGS,
    EX_ILLEGAL_FUNCTION, EX_ILLEGAL_DATA_VALUE,
    EX_DEVICE_NUM_MISMATCH, EX_DEVICE_BUSY,
    MAX_MESSAGE_BYTES,
)


# ---------------------------------------------------------------------------
# Test harness
# ---------------------------------------------------------------------------

class SimRunner:
    """Spin up a simulator on an ephemeral port, drive it via raw TCP,
    tear down."""
    def __init__(self, state=None, **kw):
        self.state = state or SCUState()
        self.sim = SCUSimulator("127.0.0.1", 0, 1, state=self.state, **kw)
        self.server = None
        self.port = None

    async def __aenter__(self):
        self.server = await asyncio.start_server(
            self.sim._handle_client, "127.0.0.1", 0,
        )
        self.port = self.server.sockets[0].getsockname()[1]
        return self

    async def __aexit__(self, *exc):
        self.server.close()
        await self.server.wait_closed()

    async def open_client(self):
        return await asyncio.open_connection("127.0.0.1", self.port)

    @staticmethod
    async def round_trip(reader, writer, req: bytes) -> bytes:
        writer.write(req); await writer.drain()
        # Read MBAP header
        header = await reader.readexactly(7)
        _, _, length, _ = struct.unpack(">HHHB", header)
        pdu = await reader.readexactly(length - 1)
        return header + pdu


def build_request(tid: int, unit: int, pdu: bytes) -> bytes:
    return struct.pack(">HHHB", tid, 0, len(pdu) + 1, unit) + pdu


# ---------------------------------------------------------------------------
# FC=01 Read Coils
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_read_coils_returns_correct_bits():
    state = SCUState()
    # Set some 4SRM device-0 relays: relay1=ON, relay2=OFF, relay3=ON, relay4=ON
    state.set_coil(0, True)
    state.set_coil(1, False)
    state.set_coil(2, True)
    state.set_coil(3, True)
    async with SimRunner(state=state) as runner:
        reader, writer = await runner.open_client()
        # FC=01 start=0 qty=4
        pdu = struct.pack(">BHH", FC_READ_COILS, 0, 4)
        resp = await runner.round_trip(reader, writer, build_request(1, 1, pdu))
        # MBAP(7) + FC(1) + byte_count(1) + bits(1) = 10 bytes
        assert len(resp) == 10
        assert resp[7] == FC_READ_COILS
        assert resp[8] == 1  # byte_count
        # Bits: relay1(bit0)=1, relay2(bit1)=0, relay3(bit2)=1, relay4(bit3)=1 -> 0b1101 = 0x0D
        assert resp[9] == 0x0D
        writer.close(); await writer.wait_closed()


@pytest.mark.asyncio
async def test_read_coils_unknown_addr_returns_zero():
    """Per spec: 'Unused parts are filled with 0.'"""
    async with SimRunner() as runner:
        reader, writer = await runner.open_client()
        pdu = struct.pack(">BHH", FC_READ_COILS, 999, 8)
        resp = await runner.round_trip(reader, writer, build_request(1, 1, pdu))
        assert resp[9] == 0x00
        writer.close(); await writer.wait_closed()


@pytest.mark.asyncio
async def test_read_coils_oversize_returns_exception():
    """Requesting too many coils should NOT crash; spec cap is 50 bytes total."""
    async with SimRunner() as runner:
        reader, writer = await runner.open_client()
        # 500 coils -> 63 bytes of bit data, won't fit in 50-byte response
        pdu = struct.pack(">BHH", FC_READ_COILS, 0, 500)
        resp = await runner.round_trip(reader, writer, build_request(1, 1, pdu))
        # Should be exception: FC|0x80 followed by code
        assert resp[7] == (FC_READ_COILS | 0x80)
        assert resp[8] == EX_ILLEGAL_DATA_VALUE
        writer.close(); await writer.wait_closed()


# ---------------------------------------------------------------------------
# FC=05 Write Single Coil + write-reflection latency
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_write_single_coil_has_one_second_reflection_delay():
    """Spec: relay state change reflects ~1 second AFTER the command."""
    state = SCUState()
    async with SimRunner(state=state) as runner:
        reader, writer = await runner.open_client()
        # Write coil 0 = ON
        pdu = struct.pack(">BHH", FC_WRITE_SINGLE_COIL, 0, 0xFF00)
        resp = await runner.round_trip(reader, writer, build_request(1, 1, pdu))
        # Response is echo of request PDU
        assert resp[7] == FC_WRITE_SINGLE_COIL
        # Immediately read it back -- per spec, should still be OFF
        pdu = struct.pack(">BHH", FC_READ_COILS, 0, 1)
        resp = await runner.round_trip(reader, writer, build_request(2, 1, pdu))
        assert resp[9] & 1 == 0, "relay should not have flipped yet (1s latency)"
        # Wait > 1 s and read again
        await asyncio.sleep(1.2)
        resp = await runner.round_trip(reader, writer, build_request(3, 1, pdu))
        assert resp[9] & 1 == 1, "relay should be ON now"
        writer.close(); await writer.wait_closed()


@pytest.mark.asyncio
async def test_write_single_coil_rejects_invalid_value():
    async with SimRunner() as runner:
        reader, writer = await runner.open_client()
        # Value 0x1234 is neither 0x0000 nor 0xFF00 -- invalid per Modbus spec
        pdu = struct.pack(">BHH", FC_WRITE_SINGLE_COIL, 0, 0x1234)
        resp = await runner.round_trip(reader, writer, build_request(1, 1, pdu))
        assert resp[7] == (FC_WRITE_SINGLE_COIL | 0x80)
        assert resp[8] == EX_ILLEGAL_DATA_VALUE
        writer.close(); await writer.wait_closed()


# ---------------------------------------------------------------------------
# FC=0F Write Multiple Coils
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_write_multiple_coils_applies_bit_pattern():
    """Spec example: 4SRM device 1, relays {1=ON,2=OFF,3=ON,4=ON}
    -> start coil 4, qty 4, byte count 1, bit data 0x0D"""
    state = SCUState()
    async with SimRunner(state=state) as runner:
        reader, writer = await runner.open_client()
        pdu = struct.pack(">BHHB", FC_WRITE_MULTIPLE_COILS, 4, 4, 1) + bytes([0x0D])
        resp = await runner.round_trip(reader, writer, build_request(1, 1, pdu))
        # Response: FC, start, qty (5 bytes PDU)
        assert resp[7] == FC_WRITE_MULTIPLE_COILS
        # Wait for deferred apply
        await asyncio.sleep(1.5)
        # Verify via direct state inspection (faster than another read)
        assert state.get_coil(4) is True   # relay1
        assert state.get_coil(5) is False  # relay2
        assert state.get_coil(6) is True   # relay3
        assert state.get_coil(7) is True   # relay4
        writer.close(); await writer.wait_closed()


# ---------------------------------------------------------------------------
# FC=03 Read Holding Registers
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_read_datetime_registers():
    state = SCUState()
    state.set_reg(65500, 2026)
    state.set_reg(65501, 5)
    state.set_reg(65502, 29)
    state.set_reg(65503, 12)
    state.set_reg(65504, 30)
    state.set_reg(65505, 0)
    async with SimRunner(state=state) as runner:
        reader, writer = await runner.open_client()
        pdu = struct.pack(">BHH", FC_READ_HOLDING_REGS, 65500, 6)
        resp = await runner.round_trip(reader, writer, build_request(1, 1, pdu))
        assert resp[7] == FC_READ_HOLDING_REGS
        assert resp[8] == 12  # byte_count = 6 regs * 2
        regs = struct.unpack(">6H", resp[9:21])
        assert regs == (2026, 5, 29, 12, 30, 0)
        writer.close(); await writer.wait_closed()


@pytest.mark.asyncio
async def test_read_device_fail_bitmask():
    """4SRM device-3 failed -> bit 3 of register 16000 set."""
    state = SCUState()
    state.set_reg(16000, 0b00001000)  # bit 3
    async with SimRunner(state=state) as runner:
        reader, writer = await runner.open_client()
        pdu = struct.pack(">BHH", FC_READ_HOLDING_REGS, 16000, 1)
        resp = await runner.round_trip(reader, writer, build_request(1, 1, pdu))
        reg = struct.unpack(">H", resp[9:11])[0]
        assert reg & (1 << 3) != 0
        assert reg & (1 << 0) == 0
        writer.close(); await writer.wait_closed()


# ---------------------------------------------------------------------------
# Server-ID enforcement
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_wrong_server_id_returns_device_num_mismatch():
    async with SimRunner() as runner:
        reader, writer = await runner.open_client()
        # server_id=1 in sim, request unit_id=99
        pdu = struct.pack(">BHH", FC_READ_COILS, 0, 1)
        resp = await runner.round_trip(reader, writer, build_request(1, 99, pdu))
        assert resp[7] == (FC_READ_COILS | 0x80)
        assert resp[8] == EX_DEVICE_NUM_MISMATCH
        writer.close(); await writer.wait_closed()


# ---------------------------------------------------------------------------
# Single-connection enforcement
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_second_connection_rejected():
    """Spec: 'Only one connection is allowed for TCP/IP.'"""
    async with SimRunner() as runner:
        r1, w1 = await runner.open_client()
        # Give the server a moment to register the first connection
        await asyncio.sleep(0.05)
        # Second connection should be accepted at TCP level then immediately closed
        r2, w2 = await runner.open_client()
        # readexactly should raise IncompleteReadError because peer closed
        with pytest.raises(asyncio.IncompleteReadError):
            await r2.readexactly(1)
        w2.close()
        # First connection should still work
        pdu = struct.pack(">BHH", FC_READ_COILS, 0, 1)
        resp = await runner.round_trip(r1, w1, build_request(1, 1, pdu))
        assert resp[7] == FC_READ_COILS
        w1.close(); await w1.wait_closed()


# ---------------------------------------------------------------------------
# DEVICE_BUSY fault injection
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_busy_injection_returns_device_busy_then_recovers():
    state = SCUState()
    state.busy_remaining = 2  # next 2 requests will return busy
    async with SimRunner(state=state) as runner:
        reader, writer = await runner.open_client()
        pdu = struct.pack(">BHH", FC_READ_COILS, 0, 1)
        # First two should be busy
        for tid in (1, 2):
            resp = await runner.round_trip(reader, writer, build_request(tid, 1, pdu))
            assert resp[7] == (FC_READ_COILS | 0x80)
            assert resp[8] == EX_DEVICE_BUSY
        # Third should succeed
        resp = await runner.round_trip(reader, writer, build_request(3, 1, pdu))
        assert resp[7] == FC_READ_COILS
        writer.close(); await writer.wait_closed()


# ---------------------------------------------------------------------------
# Illegal function code
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_illegal_function_code_returns_illegal_function():
    async with SimRunner() as runner:
        reader, writer = await runner.open_client()
        # FC=0x42 is undefined
        pdu = bytes([0x42, 0, 0, 0, 0])
        resp = await runner.round_trip(reader, writer, build_request(1, 1, pdu))
        assert resp[7] == (0x42 | 0x80)
        assert resp[8] == EX_ILLEGAL_FUNCTION
        writer.close(); await writer.wait_closed()


# ---------------------------------------------------------------------------
# 50-byte message cap
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_responses_never_exceed_50_bytes():
    """Sweep across a range of read sizes; every response frame must
    fit in MAX_MESSAGE_BYTES."""
    async with SimRunner() as runner:
        reader, writer = await runner.open_client()
        # Try several sizes; the simulator must either fit-or-reject
        for qty in (1, 8, 16, 200, 328, 329, 500, 1000):
            pdu = struct.pack(">BHH", FC_READ_COILS, 0, qty)
            resp = await runner.round_trip(reader, writer, build_request(qty, 1, pdu))
            # Either it's a valid response within the cap...
            # ...or it's an exception (also within the cap, exceptions are small)
            assert len(resp) <= MAX_MESSAGE_BYTES, (
                f"qty={qty}: response is {len(resp)} bytes, exceeds spec cap"
            )
        writer.close(); await writer.wait_closed()
