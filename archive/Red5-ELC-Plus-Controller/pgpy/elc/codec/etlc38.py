"""ETLC V3.8 wire codec -- vendor-tool-captured (2026-07-09).

Frame:  45 4C 43   40   LL   <payload>              <cs>

* preamble = "ELC" (45 4C 43)
* type     = 0x40 (ETLC protocol wrapper)
* length   = number of bytes remaining (payload + checksum)
* checksum = (~(sum(payload) + 0x80) + 1) & 0xFF

TX payload (10 B, opcode 0x07 RelayOverride):
    [dev_type][scu][addr][channel_0based][0x07][state][DI1: 11 12 13 14]

RX payload (6 B, opcode 0x25 RelayStatus, unsolicited from SCU):
    [dev_type][scu][addr][00][0x25][state_mask]

Wire-vs-UI addressing:
    SCU:     0-based on wire (UI SCU=1  → wire 0)
    Module:  1-based on wire (UI addr=2 → wire 2)
    Channel: 0-based on wire (UI ch=2   → wire 1)
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Final

from elc.codec.device_id import DeviceId, DeviceType

PREAMBLE: Final[bytes] = b"\x45\x4C\x43"
TYPE_WRAP: Final[int] = 0x40
DI1_TAIL: Final[bytes] = b"\x11\x12\x13\x14"

OPCODE_RELAY_OVERRIDE: Final[int] = 0x07
OPCODE_RELAY_STATUS: Final[int] = 0x25
# Master → SCU "please tell me the current relay state" (PanelInfo).
# Byte-verified against SCU Smart Manager V1.6.9 vendor capture,
# 2026-07-09.  TX payload for 6SRM broadcast reads:
#
#     15 03 FF 00 14 11
#     ^^ ^^ ^^ ^^ ^^ ^^
#     |  |  |  |  |  |
#     |  |  |  |  |  data byte (DF0 = 0x11 = "relay state" query)
#     |  |  |  |  opcode 0x14 (Data Request family)
#     |  |  |  sub-address (channel 0-based; 0x00 = module-wide)
#     |  |  addr[7:0]
#     |  scu<<2 | addr[9:8]
#     dev_type
#
# SCU replies with one RelayStatus (opcode 0x25) frame per populated
# module of the queried device type -- see _on_v38_bytes.  Safe: the
# SCU never fires a relay in response to a query frame.
#
# Opcode 0x14 is the generic "Data Request" family; the DF0 byte
# picks WHICH report (see DATA_TYPE_* below).  0x11 = current
# relay state (existing behaviour).  Other sub-codes return
# aggregate metrics (on-time counters, power) as an operator drill-
# down query (2026-02-11 operator ask, per protocol doc §8).
OPCODE_STATUS_QUERY: Final[int] = 0x14
OPCODE_DATA_REQUEST: Final[int] = 0x14                      # alias
STATUS_QUERY_DATA: Final[int] = 0x11

DATA_TYPE_RELAY_STATE: Final[int]     = 0x11
DATA_TYPE_TOTAL_ONTIME: Final[int]    = 0x06  # total cycle + total/month/day on-time
DATA_TYPE_DAILY_ONTIME: Final[int]    = 0x07
DATA_TYPE_MONTHLY_ONTIME: Final[int]  = 0x08
DATA_TYPE_DAILY_POWER: Final[int]     = 0x0A
DATA_TYPE_MONTHLY_POWER: Final[int]   = 0x0B

DATA_TYPE_LABEL: Final[dict[int, str]] = {
    DATA_TYPE_RELAY_STATE:    "Relay State (bitmask)",
    DATA_TYPE_TOTAL_ONTIME:   "Relay Total Count + On-Time",
    DATA_TYPE_DAILY_ONTIME:   "Relay Daily On-Time",
    DATA_TYPE_MONTHLY_ONTIME: "Relay Monthly On-Time",
    DATA_TYPE_DAILY_POWER:    "Power Daily",
    DATA_TYPE_MONTHLY_POWER:  "Power Monthly",
}

TX_FRAME_LEN: Final[int] = 16
RX_FRAME_LEN: Final[int] = 12

# Legacy aliases -- pre-2026-07-09 tests reference these names.
CLASS_SRM: Final[int] = TYPE_WRAP
FRAME_LEN: Final[int] = RX_FRAME_LEN


class EtlcFrameError(ValueError):
    """Raised when a frame is structurally invalid."""


def checksum(payload: bytes) -> int:
    """(~(sum(payload) + 0x80) + 1) & 0xFF."""
    return ((~(sum(payload) + 0x80)) + 1) & 0xFF


# ETLC V3.8 §1.a — the SCU byte + module-address byte are actually a
# packed 6-bit-SCU + 10-bit-address field spread across two adjacent
# bytes.  These helpers centralise the split so every message class
# uses the same layout, and so a future re-interpretation (e.g. a
# vendor firmware that redefines the top-2-bit meaning) lands in one
# place.
#
# Operator-confirmed 2026-07-09 (bit-order fix from vendor capture):
#
#     byte 6:  [ scu : 6                    ][ addr[9:8] : 2 ]
#     byte 7:  [ addr[7:0]                                 : 8 ]
#
# So broadcast address ``0x3FF`` for SCU 0 encodes to bytes
# ``0x03 0xFF`` (byte 6 top-6 bits = 0, low-2 bits = 0b11) -- NOT
# ``0xC0 0xFF`` which is what a naive "top-2-bits-are-high-address"
# reading would produce.
#
# ``address`` uses the full 10-bit range ``0..1023``.  ``0x3FF`` is
# reserved as the *broadcast* address for PanelInfo queries -- every
# module of the requested device type replies with its own frame.

SCU_MASK: Final[int] = 0x3F                  # 6 bits
SCU_SHIFT: Final[int] = 2                    # scu occupies bits 7:2 of byte 6
ADDR_HI_MASK: Final[int] = 0x03              # low 2 bits of byte 6
ADDR_MAX: Final[int] = 0x3FF                 # 10 bits → 1023
ADDR_BROADCAST: Final[int] = 0x3FF           # PanelInfo wildcard


def encode_scu_addr(scu: int, address: int) -> tuple[int, int]:
    """Split (scu, address) into wire bytes 6 and 7.

    ``scu`` is 6 bits (0..63); ``address`` is 10 bits (0..1023).
    Returns ``(byte6, byte7)``.  Silently masks over-range inputs to
    keep the encode path allocation-free; range-checking happens at
    the DeviceId construction site.

    Layout (see comment block above):
        byte6 = (scu << 2) | addr[9:8]
        byte7 = addr[7:0]
    """
    byte6 = ((scu & SCU_MASK) << SCU_SHIFT) | ((address >> 8) & ADDR_HI_MASK)
    byte7 = address & 0xFF
    return byte6, byte7


def decode_scu_addr(byte6: int, byte7: int) -> tuple[int, int]:
    """Inverse of :func:`encode_scu_addr` — returns ``(scu, address)``."""
    scu = (byte6 >> SCU_SHIFT) & SCU_MASK
    address = ((byte6 & ADDR_HI_MASK) << 8) | byte7
    return scu, address


def _wrap(payload: bytes) -> bytes:
    return (
        PREAMBLE
        + bytes((TYPE_WRAP, len(payload) + 1))
        + payload
        + bytes((checksum(payload),))
    )


@dataclass(frozen=True)
class RelayOverrideV38:
    """Master → SCU single-relay override (opcode 0x07)."""

    device: DeviceId
    state: bool

    def encode(self) -> bytes:
        scu_byte, addr_byte = encode_scu_addr(
            self.device.scu, self.device.address,
        )
        payload = bytes([
            int(self.device.dev_type) & 0xFF,
            scu_byte,
            addr_byte,
            self.device.sub_address & 0xFF,
            OPCODE_RELAY_OVERRIDE,
            0x01 if self.state else 0x00,
        ]) + DI1_TAIL
        return _wrap(payload)


@dataclass(frozen=True)
class RelayStatusV38:
    """SCU → master unsolicited module state (opcode 0x25)."""

    device: DeviceId
    state_mask: int
    def encode(self) -> bytes:
        scu_byte, addr_byte = encode_scu_addr(
            self.device.scu, self.device.address,
        )
        payload = bytes([
            int(self.device.dev_type) & 0xFF,
            scu_byte,
            addr_byte,
            self.device.sub_address & 0xFF,
            OPCODE_RELAY_STATUS,
            self.state_mask & 0xFF,
        ])
        return _wrap(payload)

    @classmethod
    def try_decode(cls, frame: bytes) -> "RelayStatusV38 | None":
        if len(frame) != RX_FRAME_LEN:
            return None
        if frame[:3] != PREAMBLE:
            return None
        if frame[3] != TYPE_WRAP:
            return None
        if frame[4] + 5 != RX_FRAME_LEN:
            return None
        payload = frame[5:11]
        if payload[4] != OPCODE_RELAY_STATUS:
            return None
        if checksum(payload) != frame[11]:
            return None
        try:
            dev_type = DeviceType(payload[0])
        except ValueError:
            dev_type = DeviceType.UNKNOWN
        scu, address = decode_scu_addr(payload[1], payload[2])
        device = DeviceId(
            dev_type=dev_type,
            scu=scu,
            address=address,
            sub_address=payload[3],
        )
        return cls(device=device, state_mask=payload[5])


def channels_from_mask(mask: int, module_channel_count: int = 6) -> list[bool]:
    return [(mask >> i) & 1 == 1 for i in range(module_channel_count)]


def channel_count_for(dev_type: DeviceType) -> int:
    """Number of relay channels for a given SRM-family device type.

    Operator-confirmed 2026-07-09 -- 4SRM has 4 channels, the
    6-family (both 6SRM and 6ERM, sharing 0x15) has 6, and 48SRM
    (byte code TBD) has 48.  Anything unknown defaults to 6 so a
    novel family degrades gracefully rather than truncating state.
    """
    if dev_type == DeviceType.SRM_4S:
        return 4
    if dev_type == DeviceType.SRM_48S:
        return 48
    # SRM_6S / SRM_6E / SRM_ERM / SRM_4E all alias to 0x15 → 6 channels.
    return 6


@dataclass(frozen=True)
class StatusQueryV38:
    """Master → SCU "read module state" (opcode 0x16).

    Encoded with the same wrapper + preamble as RelayOverride so the
    SCU's parser accepts it on the same TCP path.  The device's
    ``sub_address`` is ignored -- a query is module-wide -- but we
    pass it through unchanged so the frame layout matches RelayOverride
    byte-for-byte apart from the opcode.

    **Broadcast (PanelInfo) queries** — set ``device.address`` to
    ``ADDR_BROADCAST`` (0x3FF).  The SCU responds with one RelayStatus
    frame *per module of the requested device type*, each carrying its
    own real address.  For the SRM family (dev_type 0x14 = 4SRM,
    0x15 = 6SRM/6ERM shared), this is exactly the discovery mechanism
    the operator uses -- see ETLC §1.a and §1.b.

    The expected response is an unsolicited-shaped RelayStatus (0x25,
    12-byte RX frame) which ``SrmDriver._on_v38_bytes`` already
    decodes end-to-end (per-channel RelayState events → replica → SSE
    → UI).  Safe against live hardware -- issuing a query frame never
    fires a relay.
    """

    device: DeviceId

    def encode(self) -> bytes:
        scu_byte, addr_byte = encode_scu_addr(
            self.device.scu, self.device.address,
        )
        payload = bytes([
            int(self.device.dev_type) & 0xFF,
            scu_byte,
            addr_byte,
            self.device.sub_address & 0xFF,
            OPCODE_STATUS_QUERY,
            STATUS_QUERY_DATA,             # vendor-captured 0x11
        ]) + DI1_TAIL
        return _wrap(payload)



@dataclass(frozen=True)
class DataRequestV38:
    """Master → SCU generic data request (opcode 0x14, variable DF0).

    Same 16-byte TX frame as :class:`StatusQueryV38`; the only
    difference is DF0 (byte 5 of the payload) which picks WHICH
    report the SCU should return.  For ``data_type = 0x11`` this
    class is byte-equivalent to :class:`StatusQueryV38` (existing
    relay-state query, response arrives as :class:`RelayStatusV38`).

    For other data types (0x06/0x07/0x08/0x0A/0x0B, per protocol
    doc §8), the SCU replies with a variable-length frame -- opcode
    still 0x14 echoed, but the DFn payload carries the metric
    values (see :class:`DataReportV38` for decoding).

    Safe against live hardware -- issuing a data-request frame never
    fires a relay.  The `sub_address` (byte 3) targets a specific
    channel of the module (0-based; 0 = module-wide when the report
    is inherently module-scoped).

    .. note::
       Byte 3 is device-family dependent (protocol doc §8, future):

       * SRM / eRM (this codec today) -- ``sub_address`` = channel
         (1..6).
       * DALI (future)               -- ``group_number`` (1..64).

       DALI reports are ALSO multi-frame: several RX frames with
       the same group byte must be concatenated in arrival order
       before decoding.  Not implemented here; see doc §8 "Future
       -- DALI device family".
    """

    device: DeviceId
    data_type: int

    def encode(self) -> bytes:
        scu_byte, addr_byte = encode_scu_addr(
            self.device.scu, self.device.address,
        )
        payload = bytes([
            int(self.device.dev_type) & 0xFF,
            scu_byte,
            addr_byte,
            self.device.sub_address & 0xFF,
            OPCODE_DATA_REQUEST,
            self.data_type & 0xFF,
        ]) + DI1_TAIL
        return _wrap(payload)


@dataclass(frozen=True)
class DataReportV38:
    """SCU → master response to a :class:`DataRequestV38`.

    Variable-length frame -- LL byte drives the total length.
    Layout (payload):

        byte 0: dev_type
        byte 1: scu + addr_hi   (encoded)
        byte 2: addr_lo
        byte 3: sub_address     (channel; echo of the request)
        byte 4: opcode          (0x14 = data-request family, echoed)
        byte 5+: DF0, DF1, ..., DFn  (data-type-specific payload)
        last:  checksum

    We keep this decoder deliberately generic -- the DF-payload
    parsing is delegated to :meth:`parse_payload` per data_type
    since the request/response is a matched pair on a fresh
    one-shot TCP connection (see driver.request_relay_data).  The
    caller knows the ``data_type`` it asked for and passes it in.
    ``raw_hex`` is always populated so the operator can validate
    layouts against real captures.
    """

    device: DeviceId
    data_type: int
    df_bytes: bytes
    raw_hex: str

    @classmethod
    def try_decode(
        cls,
        frame: bytes,
        expected_data_type: int | None = None,
    ) -> "DataReportV38 | None":
        # Minimum viable frame:  preamble(3) + type(1) + LL(1) + payload(>=6) + cs(1) = 12
        if len(frame) < 12:
            return None
        if frame[:3] != PREAMBLE or frame[3] != TYPE_WRAP:
            return None
        ll = frame[4]
        expected_len = 5 + ll
        if len(frame) != expected_len:
            return None
        payload = frame[5:5 + ll - 1]           # exclude checksum byte
        cs = frame[5 + ll - 1]
        if checksum(payload) != cs:
            return None
        if len(payload) < 6:
            return None
        if payload[4] != OPCODE_DATA_REQUEST:
            return None
        try:
            dev_type = DeviceType(payload[0])
        except ValueError:
            dev_type = DeviceType.UNKNOWN
        scu, address = decode_scu_addr(payload[1], payload[2])
        device = DeviceId(
            dev_type=dev_type,
            scu=scu,
            address=address,
            sub_address=payload[3],
        )
        data_type = expected_data_type if expected_data_type is not None else payload[5]
        # DF0 is at payload[5] .. include it in df_bytes so per-type
        # parsers see the full sub-payload (the DF numbering in the
        # vendor doc starts at 0 = byte 5 of the payload).
        df_bytes = bytes(payload[5:])
        return cls(
            device=device,
            data_type=data_type,
            df_bytes=df_bytes,
            raw_hex=frame.hex(),
        )

    def parse_payload(self) -> dict:
        """Best-effort parse of DFn bytes for known data_types.

        Falls back to ``{"raw_hex": ...}`` for unknown / partial
        frames so the operator can inspect and confirm layouts
        against real hardware before we lock in a strict decoder.

        Layouts (per operator confirmation 2026-02-11, doc §8):

        * ``0x06`` Relay Total Count & On Time:
              DF0-DF2 total_cycle (u24 BE)
              DF3-DF5 total_ontime  (u24 BE)
              DF6-DF7 month_ontime  (u16 BE)
              DF8-DF9 day_ontime    (u16 BE)

        The remaining data-types (0x07/0x08/0x0A/0x0B) currently
        return raw bytes only -- the vendor doc DF layouts still
        need one confirmed hardware capture apiece before we can
        parse them safely.  See protocol doc §8 for the shape.
        """
        raw = {"raw_hex": self.raw_hex, "df_hex": self.df_bytes.hex()}
        b = self.df_bytes
        if self.data_type == DATA_TYPE_TOTAL_ONTIME and len(b) >= 10:
            return {
                **raw,
                "total_cycle":  (b[0] << 16) | (b[1] << 8) | b[2],
                "total_ontime": (b[3] << 16) | (b[4] << 8) | b[5],
                "month_ontime": (b[6] << 8)  | b[7],
                "day_ontime":   (b[8] << 8)  | b[9],
                "units": {
                    "total_cycle":  "count",
                    "total_ontime": "seconds",  # TBD -- confirm on real capture
                    "month_ontime": "seconds",  # TBD
                    "day_ontime":   "seconds",  # TBD
                },
            }
        # Other data-types: emit raw for operator inspection.
        return raw
