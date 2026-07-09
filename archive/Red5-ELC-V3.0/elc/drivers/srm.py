"""SRM-family driver — relay set / query plus 0x15 + 0x23 events."""

from __future__ import annotations

import asyncio
import inspect
import logging
from typing import ClassVar

from elc.codec.device_id import ADDR_BITS, SUBADDR_BITS, DeviceId, DeviceType
from elc.codec.etlc38 import (
    FRAME_LEN,
    PREAMBLE,
    RelayOverrideV38,
    RelayStatusV38,
    StatusQueryV38,
    channel_count_for,
    channels_from_mask,
)
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
        # Serialises V3.8 one-shot sends so overlapping clicks don't
        # try to open two sockets simultaneously against a single-
        # connection SCU.
        self._v38_write_lock = asyncio.Lock()
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

        Serialises calls through ``self._v38_write_lock`` so
        back-to-back operator clicks don't race two socket opens
        against the SCU (some ETLC firmware locks the listen port
        for ~1s after each close).
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

        # One in-flight send at a time.  Guards against overlapping
        # connect attempts to a single-connection SCU.
        async with self._v38_write_lock:
            log.info("V3.8 TX (%d B) → %s:%s: %s",
                     len(data), host, port, data.hex())
            try:
                response = await loop.run_in_executor(None, _blocking_send_recv)
            except Exception as e:  # noqa: BLE001
                log.warning("V3.8 one-shot send failed: %s", e)
                return
            # Small settling period so the SCU can close its side
            # cleanly before we hit it again.
            await asyncio.sleep(0.15)
        if response:
            await self._on_v38_bytes(response)

    async def _on_v38_bytes(self, chunk: bytes) -> None:
        """Parse ETLC RelayStatus frames out of a raw byte stream.

        The real SCU speaks ``ELC@`` (0x45 0x4C 0x43 0x40) preamble
        with 12-byte fixed frames.  RelayStatus (opcode 0x25) carries
        a module-wide channel bitmask -- we expand it back into a per-
        channel ``RelayState`` event for every relay that we care
        about (i.e. every registered device on the same module), so
        the Replica / UI update uniformly.

        Unsolicited RX from a physical wall-switch toggle is also
        supposed to arrive here (same opcode 0x25, same 12-byte
        layout).  If the SCU uses a different opcode or length for
        wall-switch events, we log every candidate frame's opcode +
        length + payload so a hardware capture can identify the
        exact byte layout and we can extend the decoder.

        Unknown / partial frames are skipped one byte at a time until
        a valid preamble is found.
        """
        log.info("V3.8 RX chunk (%d B): %s", len(chunk), chunk.hex())
        self._v38_buffer.extend(chunk)
        while len(self._v38_buffer) >= FRAME_LEN:
            idx = self._v38_buffer.find(PREAMBLE)
            if idx == -1:
                # No preamble in buffer.  Drop everything but the last
                # 3 bytes (a preamble could straddle two reads).
                del self._v38_buffer[: -3]
                return
            if idx > 0:
                log.info("V3.8 RX skipping %d pre-preamble byte(s): %s",
                         idx, bytes(self._v38_buffer[:idx]).hex())
                del self._v38_buffer[:idx]
            if len(self._v38_buffer) < FRAME_LEN:
                return
            candidate = bytes(self._v38_buffer[:FRAME_LEN])
            status = RelayStatusV38.try_decode(candidate)
            if status is not None:
                del self._v38_buffer[:FRAME_LEN]
                log.info(
                    "V3.8 RX decoded RelayStatus dev_type=0x%02X scu=%d "
                    "addr=%d mask=0x%02X",
                    int(status.device.dev_type),
                    status.device.scu, status.device.address,
                    status.state_mask,
                )
                await self._fan_out_status(status)
                continue
            # 12 bytes starting with a preamble but not decodable as a
            # RelayStatus we know.  Dump every byte + interpret the
            # ETLC header fields so a physical wall-switch capture can
            # be turned into a new opcode handler in one edit.
            #
            # This is intentionally noisy (WARNING) so it surfaces in
            # the operator's logs — every unhandled unsolicited frame
            # is a wall-switch event we're currently blind to.
            self._log_unknown_v38_frame(candidate)
            del self._v38_buffer[:1]

    def _log_unknown_v38_frame(self, frame: bytes) -> None:
        """Loud, structured log for a 12-byte frame we couldn't decode.

        Called from :meth:`_on_v38_bytes` whenever ``RelayStatusV38.
        try_decode`` returns ``None`` even though the frame has a
        valid preamble.  Includes opcode, length byte, payload, and
        checksum-match status so a hardware capture is directly
        actionable — no re-run of ``probe-v38.py`` needed.
        """
        from elc.codec.etlc38 import (
            TYPE_WRAP as _TW, RX_FRAME_LEN as _RXL, checksum as _cs,
        )
        if len(frame) != _RXL:
            return
        type_byte = frame[3]
        len_byte = frame[4]
        payload = frame[5:11]
        cs_byte = frame[11]
        cs_calc = _cs(payload)
        opcode = payload[4] if len(payload) >= 5 else None
        log.warning(
            "V3.8 RX UNKNOWN 12-byte frame: %s  |  type=0x%02X "
            "len=%d opcode=0x%s payload=%s cs=0x%02X calc=0x%02X %s",
            frame.hex(),
            type_byte, len_byte,
            f"{opcode:02X}" if opcode is not None else "??",
            payload.hex(),
            cs_byte, cs_calc,
            "OK" if cs_byte == cs_calc and type_byte == _TW else "MISMATCH",
        )

    async def _fan_out_status(self, status: RelayStatusV38) -> None:
        """Emit one RelayState per channel implied by the module bitmask.

        The SCU sends a module-wide status; downstream code
        (Replica, UI) reasons in per-channel ``RelayState``.  Bridge
        the two here.

        Channel count is family-dependent: 4 for 4SRM, 6 for the
        6SRM/6ERM shared family (0x15), 48 for 48SRM.  Publishing
        exactly the right number is critical -- 4SRMs used to receive
        6 phantom RelayStates each, creating two orphan channels
        (sub_address 5-6) that never map to a real relay.
        """
        n_ch = channel_count_for(status.device.dev_type)
        # 1-based channel numbering on the wire: state_mask bit N
        # corresponds to physical channel N+1 (sub_address N+1 in our
        # 1-based internal model).
        channels = channels_from_mask(status.state_mask, n_ch)
        log.info("V3.8 RX RelayStatus %s mask=0x%02X (%d ch) → %s",
                 status.device, status.state_mask, n_ch,
                 [i + 1 for i, on in enumerate(channels) if on] or "all OFF")
        for chan_idx, is_on in enumerate(channels):
            per_channel = DeviceId(
                dev_type=status.device.dev_type,
                scu=status.device.scu,
                address=status.device.address,
                sub_address=chan_idx + 1,
            )
            msg = RelayState(device=per_channel, state=is_on)
            await self.on_state_change.publish(msg)
            for fut in self._pending.get(per_channel, []):
                if not fut.done():
                    fut.set_result(msg)

    async def query_module_v38(
        self,
        dev_type: DeviceType,
        scu: int,
        address: int,
    ) -> None:
        """Send an ETLC V3.8 StatusQuery for one module (or a broadcast).

        Pass ``address = 0x3FF`` (``ADDR_BROADCAST`` in etlc38) to
        issue a **PanelInfo** query -- every module of the requested
        device type replies with its own RelayStatus frame carrying
        its real address.  The one-shot recv window (400 ms) collects
        all responding frames back-to-back; ``_on_v38_bytes`` demuxes
        them.

        The SCU response is decoded end-to-end -- per-channel
        ``RelayState`` events land on ``on_state_change`` and cascade
        through Replica → SSE → UI without any extra plumbing here.

        Fire-and-forget: caller doesn't wait for the response.  Safe
        against live hardware -- a query frame never fires a relay.
        """
        dev = DeviceId(
            dev_type=dev_type,
            scu=scu,
            address=address,
            sub_address=0,
        )
        data = StatusQueryV38(device=dev).encode()
        log.info(
            "V3.8 TX StatusQuery %s (%d B: %s)",
            dev, len(data), data.hex(),
        )
        await self._v38_one_shot_send(data)

    async def panel_info(
        self,
        dev_type: DeviceType,
        scu: int = 0,
    ) -> None:
        """Broadcast PanelInfo query for every module of ``dev_type``.

        Shorthand for ``query_module_v38(dev_type, scu,
        ADDR_BROADCAST)``.  For the SRM family: two calls suffice
        (``SRM_4S = 0x14`` and ``SRM_6S = 0x15`` -- the latter covers
        both 6SRM and 6ERM because they share the wire code, per
        operator-confirmed V3.8 §1).
        """
        from elc.codec.etlc38 import ADDR_BROADCAST
        await self.query_module_v38(dev_type, scu, ADDR_BROADCAST)


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

    async def broadcast_v38(
        self,
        state: bool,
        modules: list[DeviceId],
        max_channels: int | None = None,
    ) -> None:
        """V3.8 hardware broadcast ALL ON / ALL OFF.

        Operator-confirmed protocol (2026-07-25 hardware capture,
        clarified 2026-02-11):

        * Wire opcode = ``0x07`` (RelayOverride), data byte = ``0x01``
          (ON) or ``0x00`` (OFF).
        * **Per-module channel count** — each module receives EXACTLY
          ``channel_count_for(module.dev_type)`` frames.  A 4SRM gets
          4 sends, a 6-family module (SRM_6S / SRM_6E, shared wire
          code 0x15) gets 6.  In a mixed 4+6 install this means the
          4SRM never sees frames aimed at non-existent channels 5-6.
        * All frames across ALL modules are dispatched *concurrently*
          via ``asyncio.gather`` on independent one-shot TCP sockets so
          they arrive at the SCU almost simultaneously — the sender
          does NOT wait for individual RX packets between frames.
        * Each affected module answers with a single ``0x25``
          RelayStatus once its relays settle; ``_on_v38_bytes``
          decodes it and the ``Replica`` is updated with the mask the
          hardware actually reports (source of truth = hardware).

        Args:
            max_channels: **Deprecated / ignored.**  Retained only for
                backwards compatibility with callers that used to pass
                the max across modules.  The per-module lookup above
                supersedes it; this argument no longer influences the
                frame count.

        No-op when ``modules`` is empty so the REST layer can call
        this unconditionally on a freshly-booted SCU with no known
        panels.
        """
        if not modules:
            log.info("V3.8 broadcast: no modules to target, skipping")
            return
        # ``max_channels`` intentionally ignored -- per-module count is
        # the operator-confirmed rule (see docstring).  Keep the arg
        # name so the REST layer + tests can pass it through without
        # a breaking refactor.
        _ = max_channels
        frames: list[bytes] = []
        per_module_counts: list[int] = []
        for module in modules:
            n_ch = channel_count_for(module.dev_type)
            per_module_counts.append(n_ch)
            for ch_idx in range(n_ch):
                per_ch = DeviceId(
                    dev_type=module.dev_type,
                    scu=module.scu,
                    address=module.address,
                    # 1-based internal (matches _fan_out_status /
                    # RelayOverrideV38.encode wire semantics).
                    sub_address=ch_idx + 1,
                )
                frames.append(
                    RelayOverrideV38(device=per_ch, state=state).encode()
                )
        log.info(
            "V3.8 broadcast %s → %d module(s) [%s] = %d frames (concurrent)",
            "ON" if state else "OFF", len(modules),
            "+".join(str(n) for n in per_module_counts), len(frames),
        )
        await self._v38_burst_send(frames)

    async def _v38_burst_send(self, frames: list[bytes]) -> None:
        """Fire ``frames`` on the wire as back-to-back writes on the
        ONE persistent SCU connection.

        Hardware constraint (operator-confirmed 2026-02-11 hardware
        capture): the SCU is a **single-connection** device.  Opening
        16 concurrent fresh TCP sockets — as an earlier version of
        this method did via ``asyncio.gather`` on
        ``socket.create_connection`` — makes the SCU refuse 15 of
        them (``Errno 111 Connection refused``) and only the winning
        socket delivers its frame.  In the field this manifested as
        "All Off" only toggling the first 1-3 relays of the first
        module.

        The fix: enqueue every frame on the persistent link's
        outbound queue via :meth:`ScuLink.send_bytes`.  The link's
        writer loop drains them back-to-back with just a
        ``writer.drain()`` between frames (kernel-buffer flush, no
        RTT) — that is the *fastest* way to put 16 frames on a
        single-connection SCU without pausing for RX.  Each affected
        module's ``0x25`` RelayStatus reply arrives asynchronously
        via the normal reader path and lands in ``_on_v38_bytes``,
        which updates the Replica.
        """
        if not frames:
            return
        host = getattr(self._link, "host", None)
        port = getattr(self._link, "port", None)
        send_bytes = getattr(self._link, "send_bytes", None)
        if send_bytes is None:
            log.warning(
                "V3.8 burst: link %r has no send_bytes(); skipping",
                type(self._link).__name__,
            )
            return
        log.info("V3.8 TX burst (%d frames) → %s:%s: %s",
                 len(frames), host, port,
                 " | ".join(f.hex() for f in frames))
        # Enqueue every frame back-to-back.  send_bytes() is a
        # queue-put — it returns as soon as the frame is on the
        # outbound queue, so 16 awaits complete in microseconds and
        # the writer loop drains them onto the wire immediately.
        for f in frames:
            try:
                await send_bytes(f)
            except Exception as e:  # noqa: BLE001
                log.warning("V3.8 burst enqueue failed: %s", e)

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
