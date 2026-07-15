"""Typed message dataclasses for the ELC flag set.

Each message owns a `FLAG` class attribute (the `msg_type` byte) plus
`encode()` / `decode()` methods that round-trip the *payload* portion
of a Frame.  The codec's `FlagRegistry` (registry.py) wires these
together so the rest of the stack can speak in dataclasses, never
bytes.

⚠️  Byte layouts for the unsolicited / command flags below are *draft*
— they reflect the architecture-doc summary plus protocol conventions
(big-endian, fixed-length).  Confirm against a live capture before
Phase 2 (transport) is plumbed against real hardware.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import ClassVar

from elc.codec.device_id import DeviceId


class MessageError(ValueError):
    """Raised when a payload doesn't match the declared layout."""


# ---------------------------------------------------------------------
# 0x01 — Time / date broadcast (we act as master per arch §7 Q5)
# ---------------------------------------------------------------------

@dataclass(frozen=True)
class TimeDateSet:
    FLAG: ClassVar[int] = 0x01

    year: int       # 4-digit, e.g. 2026
    month: int      # 1..12
    day: int        # 1..31
    hour: int       # 0..23
    minute: int     # 0..59
    second: int     # 0..59
    dow: int = 0    # 0=Sun..6=Sat (placeholder; spec TBD)

    def encode(self) -> bytes:
        if not 1970 <= self.year <= 2099:
            raise MessageError(f"year {self.year} out of range 1970..2099")
        return (
            self.year.to_bytes(2, "big")
            + bytes(
                (self.month, self.day, self.hour, self.minute, self.second, self.dow)
            )
        )

    @classmethod
    def decode(cls, payload: bytes) -> TimeDateSet:
        if len(payload) != 8:
            raise MessageError(f"TimeDateSet needs 8 bytes, got {len(payload)}")
        year = int.from_bytes(payload[:2], "big")
        return cls(
            year=year,
            month=payload[2],
            day=payload[3],
            hour=payload[4],
            minute=payload[5],
            second=payload[6],
            dow=payload[7],
        )

    @classmethod
    def from_datetime(cls, dt: datetime) -> TimeDateSet:
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return cls(
            year=dt.year,
            month=dt.month,
            day=dt.day,
            hour=dt.hour,
            minute=dt.minute,
            second=dt.second,
            dow=(dt.weekday() + 1) % 7,   # Mon=0 → Sun=0 (placeholder mapping)
        )


# ---------------------------------------------------------------------
# 0x14 / 0x15 — Relay command + status
# ---------------------------------------------------------------------

@dataclass(frozen=True)
class RelaySet:
    """Command frame: ask the SCU to set a relay to `state`."""

    FLAG: ClassVar[int] = 0x14

    device: DeviceId
    state: bool

    def encode(self) -> bytes:
        return self.device.encode_4b() + bytes((1 if self.state else 0,))

    @classmethod
    def decode(cls, payload: bytes) -> RelaySet:
        if len(payload) != 5:
            raise MessageError(f"RelaySet needs 5 bytes, got {len(payload)}")
        return cls(device=DeviceId.decode_4b(payload[:4]), state=bool(payload[4]))


@dataclass(frozen=True)
class RelayState:
    """Unsolicited / response: current state of a relay."""

    FLAG: ClassVar[int] = 0x15

    device: DeviceId
    state: bool

    def encode(self) -> bytes:
        return self.device.encode_4b() + bytes((1 if self.state else 0,))

    @classmethod
    def decode(cls, payload: bytes) -> RelayState:
        if len(payload) != 5:
            raise MessageError(f"RelayState needs 5 bytes, got {len(payload)}")
        return cls(device=DeviceId.decode_4b(payload[:4]), state=bool(payload[4]))


# ---------------------------------------------------------------------
# 0x17 — Broadcast acknowledgement
# ---------------------------------------------------------------------
#
# Emitted by an SCU exactly once after it has applied a wildcard
# `RelaySet` (the broadcast variant where address+sub_address are all
# ones).  Replaces the legacy fanout where the SCU would echo one
# `RelayState` per affected device, which produced N events per
# broadcast and overran per-client SSE/WS queues at high device counts.
# A single BroadcastComplete carries enough info for replicas and UIs
# to update every matching device locally.

@dataclass(frozen=True)
class BroadcastComplete:
    """Unsolicited: ``state`` was applied to every device matching
    ``(dev_type, scu)``.  Sent in lieu of N individual RelayState
    frames after a wildcard RelaySet."""

    FLAG: ClassVar[int] = 0x17

    dev_type: int   # DeviceType value (10-bit, 0..1023)
    scu: int        # 0..63 (6-bit)
    state: bool
    count: int = 0  # informational: devices affected on the SCU side

    def encode(self) -> bytes:
        if not 0 <= self.dev_type <= 0x3FF:
            raise MessageError(f"dev_type {self.dev_type} out of 0..1023")
        if not 0 <= self.scu <= 0x3F:
            raise MessageError(f"scu {self.scu} out of 0..63")
        if not 0 <= self.count <= 0xFFFF:
            raise MessageError(f"count {self.count} out of 0..65535")
        return (
            self.dev_type.to_bytes(2, "big")
            + bytes((self.scu, 1 if self.state else 0))
            + self.count.to_bytes(2, "big")
        )

    @classmethod
    def decode(cls, payload: bytes) -> BroadcastComplete:
        if len(payload) != 6:
            raise MessageError(f"BroadcastComplete needs 6 bytes, got {len(payload)}")
        return cls(
            dev_type=int.from_bytes(payload[:2], "big"),
            scu=payload[2],
            state=bool(payload[3]),
            count=int.from_bytes(payload[4:], "big"),
        )


# ---------------------------------------------------------------------
# 0x16 — Status query (request → expect 0x15 in response)
# ---------------------------------------------------------------------

@dataclass(frozen=True)
class StatusQuery:
    FLAG: ClassVar[int] = 0x16

    device: DeviceId

    def encode(self) -> bytes:
        return self.device.encode_4b()

    @classmethod
    def decode(cls, payload: bytes) -> StatusQuery:
        if len(payload) != 4:
            raise MessageError(f"StatusQuery needs 4 bytes, got {len(payload)}")
        return cls(device=DeviceId.decode_4b(payload))


# ---------------------------------------------------------------------
# 0x22 — Demand-response inbound event
# ---------------------------------------------------------------------

@dataclass(frozen=True)
class DemandResponse:
    """Utility-issued shed request.  `level` is 0..100 (% shed)."""

    FLAG: ClassVar[int] = 0x22

    level: int      # 0..100
    flags: int = 0  # vendor-defined bitmask

    def encode(self) -> bytes:
        if not 0 <= self.level <= 100:
            raise MessageError(f"DemandResponse level {self.level} out of 0..100")
        if not 0 <= self.flags <= 0xFF:
            raise MessageError(f"DemandResponse flags {self.flags} out of 0..255")
        return bytes((self.level, self.flags))

    @classmethod
    def decode(cls, payload: bytes) -> DemandResponse:
        if len(payload) != 2:
            raise MessageError(f"DemandResponse needs 2 bytes, got {len(payload)}")
        return cls(level=payload[0], flags=payload[1])


# ---------------------------------------------------------------------
# 0x23 — Failure report
# ---------------------------------------------------------------------

@dataclass(frozen=True)
class FailReport:
    FLAG: ClassVar[int] = 0x23

    device: DeviceId
    fail_code: int        # 0..255; vendor-defined
    detail: bytes = b""   # 0..35 trailing bytes (≤ MAX_PAYLOAD−5)

    def encode(self) -> bytes:
        if not 0 <= self.fail_code <= 0xFF:
            raise MessageError(f"fail_code {self.fail_code} out of 0..255")
        if len(self.detail) > 35:
            raise MessageError(f"FailReport detail too long ({len(self.detail)} > 35)")
        return self.device.encode_4b() + bytes((self.fail_code,)) + self.detail

    @classmethod
    def decode(cls, payload: bytes) -> FailReport:
        if len(payload) < 5:
            raise MessageError(f"FailReport needs ≥5 bytes, got {len(payload)}")
        return cls(
            device=DeviceId.decode_4b(payload[:4]),
            fail_code=payload[4],
            detail=bytes(payload[5:]),
        )


# ---------------------------------------------------------------------
# 0x30 — DALI arc-power command (DT0/DT6 dim)
# ---------------------------------------------------------------------

@dataclass(frozen=True)
class DaliArcPower:
    FLAG: ClassVar[int] = 0x30

    device: DeviceId
    arc: int                # 0..254 (255 = MASK / no-change per DALI spec)
    fade_time: int = 0      # 0..15

    def encode(self) -> bytes:
        if not 0 <= self.arc <= 0xFF:
            raise MessageError(f"arc {self.arc} out of 0..255")
        if not 0 <= self.fade_time <= 0x0F:
            raise MessageError(f"fade_time {self.fade_time} out of 0..15")
        return self.device.encode_4b() + bytes((self.arc, self.fade_time))

    @classmethod
    def decode(cls, payload: bytes) -> DaliArcPower:
        if len(payload) != 6:
            raise MessageError(f"DaliArcPower needs 6 bytes, got {len(payload)}")
        return cls(
            device=DeviceId.decode_4b(payload[:4]),
            arc=payload[4],
            fade_time=payload[5],
        )


# ---------------------------------------------------------------------
# 0x40 — Scene recall (DALI / WGM / SHG)
# ---------------------------------------------------------------------

@dataclass(frozen=True)
class SceneRecall:
    FLAG: ClassVar[int] = 0x40

    device: DeviceId        # group address or scene-owner
    scene_id: int           # 0..255

    def encode(self) -> bytes:
        if not 0 <= self.scene_id <= 0xFF:
            raise MessageError(f"scene_id {self.scene_id} out of 0..255")
        return self.device.encode_4b() + bytes((self.scene_id,))

    @classmethod
    def decode(cls, payload: bytes) -> SceneRecall:
        if len(payload) != 5:
            raise MessageError(f"SceneRecall needs 5 bytes, got {len(payload)}")
        return cls(
            device=DeviceId.decode_4b(payload[:4]),
            scene_id=payload[4],
        )


# ---------------------------------------------------------------------
# 0x50 — Power-up announcement (unsolicited)
# ---------------------------------------------------------------------

@dataclass(frozen=True)
class PowerUp:
    FLAG: ClassVar[int] = 0x50

    device: DeviceId
    firmware: bytes = b""   # 0..16 bytes; vendor-defined

    def encode(self) -> bytes:
        if len(self.firmware) > 16:
            raise MessageError(f"firmware string too long ({len(self.firmware)} > 16)")
        return self.device.encode_4b() + self.firmware

    @classmethod
    def decode(cls, payload: bytes) -> PowerUp:
        if len(payload) < 4:
            raise MessageError(f"PowerUp needs ≥4 bytes, got {len(payload)}")
        return cls(
            device=DeviceId.decode_4b(payload[:4]),
            firmware=bytes(payload[4:]),
        )


# ---------------------------------------------------------------------
# 0x60 — Heartbeat (light-weight liveness ping; we send, SCU echoes)
# ---------------------------------------------------------------------

@dataclass(frozen=True)
class Heartbeat:
    FLAG: ClassVar[int] = 0x60

    nonce: int = 0          # 4-byte client-chosen value

    def encode(self) -> bytes:
        if not 0 <= self.nonce <= 0xFFFFFFFF:
            raise MessageError(f"nonce {self.nonce} out of 0..2^32-1")
        return self.nonce.to_bytes(4, "big")

    @classmethod
    def decode(cls, payload: bytes) -> Heartbeat:
        if len(payload) != 4:
            raise MessageError(f"Heartbeat needs 4 bytes, got {len(payload)}")
        return cls(nonce=int.from_bytes(payload, "big"))


# ---------------------------------------------------------------------
# Public list — fed straight into the default registry.
# ---------------------------------------------------------------------

ALL_MESSAGES: list[type] = [
    TimeDateSet,
    RelaySet,
    RelayState,
    BroadcastComplete,
    StatusQuery,
    DemandResponse,
    FailReport,
    DaliArcPower,
    SceneRecall,
    PowerUp,
    Heartbeat,
]


# Touch `field` so static-analysis doesn't strip the import; reserved
# for future messages that need default_factory containers.
_ = field
