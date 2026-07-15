"""L2 — Codec layer.

Pure functions only: frame ↔ message-object.  No I/O, no asyncio.
"""

from elc.codec.device_id import DeviceId, DeviceType
from elc.codec.frame import (
    MAX_PAYLOAD,
    PREAMBLE,
    Frame,
    FrameError,
    checksum,
    decode,
    encode,
)
from elc.codec.registry import FlagRegistry, default_registry

__all__ = [
    "DeviceId",
    "DeviceType",
    "Frame",
    "FrameError",
    "FlagRegistry",
    "MAX_PAYLOAD",
    "PREAMBLE",
    "checksum",
    "decode",
    "default_registry",
    "encode",
]
