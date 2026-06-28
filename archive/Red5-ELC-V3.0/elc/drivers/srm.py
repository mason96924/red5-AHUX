"""SRM-family driver — relay set / query plus 0x15 + 0x23 events."""

from __future__ import annotations

import asyncio
import inspect
from typing import ClassVar

from elc.codec.device_id import DeviceId
from elc.codec.messages import FailReport, RelaySet, RelayState, StatusQuery
from elc.domain.bus import EventBus
from elc.drivers.base import AbstractDevice


class SrmDriver(AbstractDevice):
    """Driver for SRM / ELCC48-master relay modules.

    Sends `RelaySet` / `StatusQuery` over its `ScuLink`; converts
    unsolicited 0x15 `RelayState` and 0x23 `FailReport` frames into
    `EventBus` events.
    """

    HANDLED_MESSAGES: ClassVar[tuple[type, ...]] = (RelayState, FailReport)

    DEFAULT_QUERY_TIMEOUT: ClassVar[float] = 2.0

    def __init__(self, link, *, registry=None) -> None:  # type: ignore[no-untyped-def]
        from elc.codec.registry import default_registry
        super().__init__(link, registry=registry or default_registry)
        self.on_state_change: EventBus[RelayState] = EventBus()
        self.on_fail: EventBus[FailReport] = EventBus()
        # Pending Futures awaiting a RelayState for a given DeviceId.
        self._pending: dict[DeviceId, list[asyncio.Future[RelayState]]] = {}

    # ---- outbound -----------------------------------------------------

    async def set_relay(self, device: DeviceId, state: bool) -> None:
        """Tell the SCU to set `device` relay to `state`.

        Fire-and-forget at the protocol level — the unsolicited 0x15
        echo (observed via `on_state_change`) is treated as the
        authoritative confirmation per architecture §7 Q3.
        """
        frame = self._registry.encode_message(RelaySet(device=device, state=state))
        await self._link.send(frame)

    async def query(
        self,
        device: DeviceId,
        *,
        timeout: float | None = None,
    ) -> RelayState:
        """Send StatusQuery and await the next matching RelayState."""
        if timeout is None:
            timeout = self.DEFAULT_QUERY_TIMEOUT

        loop = asyncio.get_event_loop()
        fut: asyncio.Future[RelayState] = loop.create_future()
        self._pending.setdefault(device, []).append(fut)
        try:
            frame = self._registry.encode_message(StatusQuery(device=device))
            await self._link.send(frame)
            return await asyncio.wait_for(fut, timeout=timeout)
        finally:
            queue = self._pending.get(device)
            if queue is not None and fut in queue:
                queue.remove(fut)
                if not queue:
                    self._pending.pop(device, None)

    # ---- inbound (registered via AbstractDevice.HANDLED_MESSAGES) ----

    async def _on_RelayState(self, msg: RelayState) -> None:  # noqa: N802
        # Resolve any outstanding query Futures for this device.
        for fut in self._pending.get(msg.device, []):
            if not fut.done():
                fut.set_result(msg)
        await self.on_state_change.publish(msg)

    async def _on_FailReport(self, msg: FailReport) -> None:  # noqa: N802
        await self.on_fail.publish(msg)


# Keep `inspect` import in case future subclasses rely on signature
# introspection (mirrors EventBus's pattern).  Touch to silence linters.
_ = inspect
