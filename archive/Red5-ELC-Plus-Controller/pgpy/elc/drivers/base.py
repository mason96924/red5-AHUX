"""Driver base — shared inbound dispatch + EventBus wiring.

Each concrete driver subclasses `AbstractDevice`, declares which flag
classes it cares about via `HANDLED_MESSAGES`, and implements one
`_dispatch_<flag>` method per message type.  The base wires
`ScuLink.feed()` and routes decoded messages to the right handler.
"""

from __future__ import annotations

import logging
from typing import ClassVar

from elc.codec.frame import Frame
from elc.codec.registry import FlagRegistry, default_registry
from elc.transport import ScuLink

log = logging.getLogger(__name__)


class AbstractDevice:
    """Common driver scaffolding: link binding + inbound dispatch."""

    # Concrete drivers override.  Listed by *class*, not by FLAG int.
    HANDLED_MESSAGES: ClassVar[tuple[type, ...]] = ()

    def __init__(
        self,
        link: ScuLink,
        *,
        registry: FlagRegistry = default_registry,
    ) -> None:
        self._link = link
        self._registry = registry
        # Flag-int → instance method that consumes the decoded message.
        self._dispatch: dict[int, callable] = {}
        for cls in self.HANDLED_MESSAGES:
            method = getattr(self, f"_on_{cls.__name__}", None)
            if method is None:
                raise TypeError(
                    f"{type(self).__name__} declares {cls.__name__} in "
                    f"HANDLED_MESSAGES but does not implement _on_{cls.__name__}"
                )
            self._dispatch[int(cls.FLAG)] = method
        link.feed(self._handle_frame)

    async def _handle_frame(self, frame: Frame) -> None:
        handler = self._dispatch.get(frame.msg_type)
        if handler is None:
            return  # not one of ours
        try:
            msg = self._registry.decode_frame(frame)
        except KeyError:
            return
        except Exception:  # noqa: BLE001
            log.exception("driver %s failed to decode flag 0x%02X",
                          type(self).__name__, frame.msg_type)
            return
        await handler(msg)
