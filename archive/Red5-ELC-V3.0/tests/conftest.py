"""Shared pytest fixtures (MockScu, registries, etc.)."""

from __future__ import annotations

from collections.abc import Iterator

import pytest

from elc.codec import (
    Frame,
)
from elc.codec import (
    decode as codec_decode,
)
from elc.codec import (
    encode as codec_encode,
)
from elc.codec.registry import FlagRegistry
from elc.codec.registry import default_registry as _default_registry

# ---------------------------------------------------------------------
# MockScu — an in-memory SCU fake used by codec / transport tests.
# ---------------------------------------------------------------------

class MockScu:
    """Round-trips frames in memory without sockets.

    Each frame written to `MockScu.send_bytes(...)` is parsed using the
    streaming codec and appended to `received_frames`.  Tests can
    "respond" by calling `enqueue_response(frame_or_bytes)`, which
    appends to an outbound buffer the transport layer (Phase 2) will
    eventually `recv()` from.

    Used by codec tests today; reused unmodified by transport + driver
    integration tests later.
    """

    def __init__(self) -> None:
        self._inbound_buf: bytearray = bytearray()
        self.received_frames: list[Frame] = []
        self.outbound: bytearray = bytearray()

    # ---- inbound (controller → SCU) ---------------------------------

    def send_bytes(self, data: bytes) -> None:
        self._inbound_buf.extend(data)
        self.received_frames.extend(codec_decode(self._inbound_buf))

    def send_frame(self, frame: Frame) -> None:
        self.send_bytes(codec_encode(frame))

    # ---- outbound (SCU → controller) --------------------------------

    def enqueue_response(self, frame_or_bytes: Frame | bytes) -> None:
        if isinstance(frame_or_bytes, Frame):
            self.outbound.extend(codec_encode(frame_or_bytes))
        else:
            self.outbound.extend(frame_or_bytes)

    def drain_outbound(self) -> bytes:
        data = bytes(self.outbound)
        self.outbound.clear()
        return data


@pytest.fixture
def mock_scu() -> Iterator[MockScu]:
    scu = MockScu()
    yield scu


@pytest.fixture
def registry() -> FlagRegistry:
    """The default flag registry, pre-populated with ALL_MESSAGES."""
    return _default_registry
