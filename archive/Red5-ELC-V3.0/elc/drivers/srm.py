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
        """
        # 1-based channel numbering on the wire: state_mask bit N
        # corresponds to physical channel N+1 (sub_address N+1 in our
        # 1-based internal model).  6 channels covers 6sRM/6eRM;
        # 4sRM ignores channels 5-6 in the mask.
        channels = channels_from_mask(status.state_mask, 6)
        log.info("V3.8 RX RelayStatus %s mask=0x%02X → %s",
                 status.device, status.state_mask,
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
