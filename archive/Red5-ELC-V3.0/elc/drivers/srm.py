"""SRM-family driver — relay set / query plus 0x15 + 0x23 events."""

from __future__ import annotations

import asyncio
import inspect
import logging
from typing import ClassVar

from elc.codec.device_id import ADDR_BITS, SUBADDR_BITS, DeviceId, DeviceType
from elc.codec.etlc38 import RelayOverrideV38, RelayStateV38
from elc.codec.messages import BroadcastComplete, FailReport, RelaySet, RelayState, StatusQuery
from elc.domain.bus import EventBus
from elc.drivers.base import AbstractDevice

log = logging.getLogger(__name__)


class SrmDriver(AbstractDevice):
    """Driver for SRM / ELCC48-master relay modules.

    Sends `RelaySet` / `StatusQuery` over its `ScuLink`; converts
    unsolicited 0x15 `RelayState`, 0x17 `BroadcastComplete`, and 0x23
    `FailReport` frames into `EventBus` events.
    """

    HANDLED_MESSAGES: ClassVar[tuple[type, ...]] = (
        RelayState,
        BroadcastComplete,
        FailReport,
    )

    DEFAULT_QUERY_TIMEOUT: ClassVar[float] = 2.0

    def __init__(self, link, *, registry=None) -> None:  # type: ignore[no-untyped-def]
        from elc.codec.registry import default_registry
        super().__init__(link, registry=registry or default_registry)
        self.on_state_change: EventBus[RelayState] = EventBus()
        self.on_broadcast: EventBus[BroadcastComplete] = EventBus()
        self.on_fail: EventBus[FailReport] = EventBus()
        # Pending Futures awaiting a RelayState for a given DeviceId.
        self._pending: dict[DeviceId, list[asyncio.Future[RelayState]]] = {}
        # V3.8 mode: install a raw-byte handler on the link to parse
        # ETLC-format RelayState echoes.  Legacy mode leaves the base
        # class's Frame-registry path in charge.
        self._v38_buffer = bytearray()
        if getattr(link, "wire_version", "legacy") == "v38":
            link.feed_raw(self._on_v38_bytes)

    # ---- outbound -----------------------------------------------------

    async def set_relay(self, device: DeviceId, state: bool) -> None:
        """Tell the SCU to set `device` relay to `state`.

        Fire-and-forget at the protocol level — the unsolicited 0x15
        echo (observed via `on_state_change`) is treated as the
        authoritative confirmation per architecture §7 Q3.

        In V3.8 mode (physical hardware), emits an ETLC ``RelayOverride``
        (opcode 0x07) frame directly; in legacy mode the internal
        codec+registry wraps a ``RelaySet`` for MockScu.
        """
        if getattr(self._link, "wire_version", "legacy") == "v38":
            data = RelayOverrideV38(device=device, state=state).encode()
            log.info(
                "V3.8 TX RelayOverride %s → %s  (%d B: %s)",
                device, "ON" if state else "OFF", len(data), data.hex(),
            )
            # Some ETLC SCU firmware only processes frames from a
            # *fresh* TCP connection -- the persistent ScuLink socket
            # observes silent drops even though the bytes on the wire
            # are byte-identical to a working one-shot probe.  Open a
            # dedicated socket per command to mimic probe-v38.py's
            # behaviour.  We still keep the persistent ``self._link``
            # around for future inbound-event work; the write path
            # just doesn't share it.
            await self._v38_one_shot_send(data)
            return
        frame = self._registry.encode_message(RelaySet(device=device, state=state))
        await self._link.send(frame)

    async def _v38_one_shot_send(self, data: bytes) -> None:
        """Open a dedicated TCP socket, send ``data``, drain any
        response into the V3.8 parse buffer, then close.

        Mirrors ``scripts/probe-v38.py``: same fresh-connection
        semantics that the ETLC SCU firmware appears to require for
        write operations.  Response bytes still route through the
        normal ``_on_v38_bytes`` handler so unsolicited RelayState
        echoes update the replica identically to persistent-link
        traffic.
        """
        import socket
        host = getattr(self._link, "host", None)
        port = getattr(self._link, "port", None)
        if host is None or port is None:
            log.warning("V3.8 one-shot: link has no host/port; skipping")
            return
        loop = asyncio.get_running_loop()

        def _blocking_send_recv() -> bytes:
            with socket.create_connection((host, port), timeout=2.0) as s:
                s.sendall(data)
                s.settimeout(0.4)
                buf = bytearray()
                try:
                    while True:
                        chunk = s.recv(4096)
                        if not chunk:
                            break
                        buf.extend(chunk)
                except socket.timeout:
                    pass
            return bytes(buf)

        try:
            response = await loop.run_in_executor(None, _blocking_send_recv)
        except Exception as e:  # noqa: BLE001
            log.warning("V3.8 one-shot send failed: %s", e)
            return
        if response:
            await self._on_v38_bytes(response)

    async def _on_v38_bytes(self, chunk: bytes) -> None:
        """Parse ETLC RelayState echoes out of a raw byte stream.

        V3.8 frames are fixed-length (11 bytes) framed by the sentinel
        ``FF FF FF FF``.  On any parse failure (bad checksum, unknown
        opcode) we skip one byte and rescan -- standard recovery for a
        noisy or partially-implemented protocol.
        """
        log.info("V3.8 RX chunk (%d B): %s", len(chunk), chunk.hex())
        self._v38_buffer.extend(chunk)
        while len(self._v38_buffer) >= 11:
            idx = self._v38_buffer.find(b"\xff\xff\xff\xff")
            if idx == -1:
                # No sentinel in buffer.  Drop everything but the last
                # 3 bytes (a sentinel could straddle two reads).
                del self._v38_buffer[: -3]
                return
            if idx > 0:
                del self._v38_buffer[:idx]
            if len(self._v38_buffer) < 11:
                return
            candidate = bytes(self._v38_buffer[:11])
            parsed = RelayStateV38.try_decode(candidate)
            if parsed is not None:
                del self._v38_buffer[:11]
                log.info("V3.8 RX RelayState %s = %s",
                         parsed.device, "ON" if parsed.state else "OFF")
                # Fabricate a legacy ``RelayState`` so downstream
                # subscribers (Replica etc.) don't need to care about
                # the wire version -- one internal event model.
                await self.on_state_change.publish(
                    RelayState(device=parsed.device, state=parsed.state)
                )
                # Resolve any waiting query() Futures.
                for fut in self._pending.get(parsed.device, []):
                    if not fut.done():
                        fut.set_result(
                            RelayState(device=parsed.device, state=parsed.state)
                        )
                continue
            # 11 bytes starting with sentinel but not a RelayState we
            # know -- could be RelayStatus (0x25), FailReport (0x23),
            # etc.  Skip the sentinel and keep scanning.
            del self._v38_buffer[:1]

    async def broadcast(
        self,
        state: bool,
        *,
        scu: int = 1,
        dev_type: DeviceType = DeviceType.SRM,
    ) -> None:
        """Broadcast set to every device of `dev_type` on the given SCU.

        Uses the wildcard DeviceId (`Addr` + `SubAddr` all-ones) per
        architecture §2.  One frame on the wire regardless of how many
        physical relays it lands on.  Each affected device still emits
        its own unsolicited `RelayState` echo, so the live replica and
        WS feed remain authoritative.
        """
        wildcard = DeviceId(
            dev_type=dev_type,
            scu=scu,
            address=(1 << ADDR_BITS) - 1,
            sub_address=(1 << SUBADDR_BITS) - 1,
        )
        frame = self._registry.encode_message(RelaySet(device=wildcard, state=state))
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

    async def _on_BroadcastComplete(self, msg: BroadcastComplete) -> None:  # noqa: N802
        await self.on_broadcast.publish(msg)

    async def _on_FailReport(self, msg: FailReport) -> None:  # noqa: N802
        await self.on_fail.publish(msg)


# Keep `inspect` import in case future subclasses rely on signature
# introspection (mirrors EventBus's pattern).  Touch to silence linters.
_ = inspect
