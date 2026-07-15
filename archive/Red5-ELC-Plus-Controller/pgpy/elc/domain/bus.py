"""In-process pub/sub used across the domain + driver layers.

Subscribers register a callback (sync or async).  Publish dispatches
to every subscriber serially; one handler raising never stops the
broadcast.  This is intentionally tiny — no external dep, no broker,
no replay buffer.  Bigger fan-out lives in the WebSocket layer.
"""

from __future__ import annotations

import contextlib
import inspect
import logging
from collections.abc import Awaitable, Callable
from typing import Generic, TypeVar

log = logging.getLogger(__name__)

T = TypeVar("T")
Handler = Callable[[T], "Awaitable[None] | None"]


class EventBus(Generic[T]):
    """Tiny pub/sub.  Order of dispatch = order of subscription."""

    def __init__(self) -> None:
        self._handlers: list[Handler[T]] = []

    def subscribe(self, handler: Handler[T]) -> None:
        self._handlers.append(handler)

    def unsubscribe(self, handler: Handler[T]) -> None:
        with contextlib.suppress(ValueError):
            self._handlers.remove(handler)

    @property
    def subscriber_count(self) -> int:
        return len(self._handlers)

    async def publish(self, event: T) -> None:
        # Snapshot the handler list so subscribe/unsubscribe inside a
        # handler can't mutate iteration order.
        for h in list(self._handlers):
            try:
                result = h(event)
            except Exception:  # noqa: BLE001
                log.exception("EventBus handler raised on sync invoke")
                continue
            if inspect.isawaitable(result):
                try:
                    await result
                except Exception:  # noqa: BLE001
                    log.exception("EventBus handler raised on await")
