"""Flag → (encoder, decoder) registry.

Bridges raw `Frame`s with typed message dataclasses.  Adding a new
flag is two lines: define the dataclass with `FLAG` + `encode/decode`
in `messages.py`, then `register(MyMsg)` here (or pass it through
`ALL_MESSAGES`).

The registry stays codec-pure — it imports neither asyncio nor
sockets.  Drivers consume it via `decode_frame`/`encode_message`.
"""

from __future__ import annotations

from collections.abc import Callable, Iterable
from dataclasses import dataclass
from typing import Any

from elc.codec.frame import Frame


@dataclass(frozen=True)
class _Entry:
    cls: type
    encode: Callable[[Any], bytes]
    decode: Callable[[bytes], Any]


class FlagRegistry:
    """Bidirectional map between message-type bytes and dataclasses."""

    def __init__(self) -> None:
        self._by_flag: dict[int, _Entry] = {}
        self._by_cls: dict[type, _Entry] = {}

    # ---- registration -----------------------------------------------

    def register(self, cls: type) -> type:
        """Register a message dataclass.  Returns it (decorator-friendly)."""
        if not hasattr(cls, "FLAG"):
            raise TypeError(f"{cls.__name__} has no FLAG class attribute")
        flag = int(cls.FLAG)
        if not 0 <= flag <= 0xFF:
            raise ValueError(f"{cls.__name__}.FLAG={flag} out of range")
        if flag in self._by_flag:
            raise ValueError(
                f"flag 0x{flag:02X} already registered to "
                f"{self._by_flag[flag].cls.__name__}"
            )

        entry = _Entry(
            cls=cls,
            encode=lambda obj: obj.encode(),
            decode=cls.decode,  # type: ignore[attr-defined]
        )
        self._by_flag[flag] = entry
        self._by_cls[cls] = entry
        return cls

    def register_all(self, classes: Iterable[type]) -> None:
        for c in classes:
            self.register(c)

    # ---- lookup ------------------------------------------------------

    def __contains__(self, key: int | type) -> bool:
        if isinstance(key, int):
            return key in self._by_flag
        return key in self._by_cls

    def known_flags(self) -> list[int]:
        return sorted(self._by_flag)

    # ---- conversion --------------------------------------------------

    def decode_frame(self, frame: Frame) -> Any:
        """Frame → typed message instance.

        Raises `KeyError` for unknown flags so the transport layer can
        decide whether to log+drop or surface to a generic handler.
        """
        entry = self._by_flag.get(frame.msg_type)
        if entry is None:
            raise KeyError(f"unknown flag 0x{frame.msg_type:02X}")
        return entry.decode(frame.payload)

    def encode_message(self, msg: Any) -> Frame:
        """Typed message → Frame ready for `codec.encode()`."""
        entry = self._by_cls.get(type(msg))
        if entry is None:
            raise KeyError(f"unregistered message type {type(msg).__name__}")
        return Frame(msg_type=int(entry.cls.FLAG), payload=entry.encode(msg))


def _build_default_registry() -> FlagRegistry:
    # Imported lazily to avoid a top-level cycle (messages imports nothing
    # from registry, but keeping symmetry).
    from elc.codec.messages import ALL_MESSAGES

    reg = FlagRegistry()
    reg.register_all(ALL_MESSAGES)
    return reg


default_registry: FlagRegistry = _build_default_registry()
