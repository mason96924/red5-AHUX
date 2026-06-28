"""Unit tests for elc.codec.registry."""

from __future__ import annotations

from dataclasses import dataclass
from typing import ClassVar

import pytest

from elc.codec.frame import Frame, decode, encode
from elc.codec.messages import (
    ALL_MESSAGES,
    Heartbeat,
    RelayState,
)
from elc.codec.registry import FlagRegistry, default_registry

# ---------- default_registry sanity -----------------------------------


def test_default_registry_contains_every_message() -> None:
    for cls in ALL_MESSAGES:
        assert cls in default_registry
        assert int(cls.FLAG) in default_registry


def test_default_registry_known_flags_sorted_unique() -> None:
    flags = default_registry.known_flags()
    assert flags == sorted(set(flags))
    assert len(flags) == len(ALL_MESSAGES)


# ---------- decode_frame / encode_message round-trip -------------------


def test_decode_frame_to_typed_message() -> None:
    msg = Heartbeat(nonce=0x11223344)
    frame = default_registry.encode_message(msg)
    assert frame.msg_type == Heartbeat.FLAG
    out = default_registry.decode_frame(frame)
    assert out == msg


def test_encode_then_wire_then_decode() -> None:
    msg = Heartbeat(nonce=1)
    frame = default_registry.encode_message(msg)
    wire = encode(frame)
    buf = bytearray(wire)
    parsed = list(decode(buf))
    assert len(parsed) == 1
    assert default_registry.decode_frame(parsed[0]) == msg


def test_decode_frame_unknown_flag_raises() -> None:
    f = Frame(msg_type=0xEE, payload=b"")
    with pytest.raises(KeyError):
        default_registry.decode_frame(f)


def test_encode_message_unregistered_type_raises() -> None:
    class _Stray:
        FLAG = 0xFE

        def encode(self) -> bytes:
            return b""

    with pytest.raises(KeyError):
        default_registry.encode_message(_Stray())


# ---------- registration semantics on a fresh registry ----------------


def test_fresh_registry_starts_empty() -> None:
    reg = FlagRegistry()
    assert reg.known_flags() == []
    assert RelayState not in reg


def test_register_duplicate_flag_raises() -> None:
    reg = FlagRegistry()

    @dataclass(frozen=True)
    class A:
        FLAG: ClassVar[int] = 0x77

        def encode(self) -> bytes:
            return b""

        @classmethod
        def decode(cls, payload: bytes) -> A:  # noqa: ARG003
            return cls()

    @dataclass(frozen=True)
    class B:
        FLAG: ClassVar[int] = 0x77

        def encode(self) -> bytes:
            return b""

        @classmethod
        def decode(cls, payload: bytes) -> B:  # noqa: ARG003
            return cls()

    reg.register(A)
    with pytest.raises(ValueError):
        reg.register(B)


def test_register_missing_flag_raises() -> None:
    reg = FlagRegistry()

    @dataclass(frozen=True)
    class NoFlag:
        def encode(self) -> bytes:
            return b""

        @classmethod
        def decode(cls, payload: bytes) -> NoFlag:  # noqa: ARG003
            return cls()

    with pytest.raises(TypeError):
        reg.register(NoFlag)


def test_register_out_of_range_flag_raises() -> None:
    reg = FlagRegistry()

    class Bad:
        FLAG: ClassVar[int] = 0x100

        def encode(self) -> bytes:
            return b""

        @classmethod
        def decode(cls, payload: bytes) -> Bad:  # noqa: ARG003
            return cls()

    with pytest.raises(ValueError):
        reg.register(Bad)
