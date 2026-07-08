"""L4 — Live state replica (in-memory).

Subscribes to driver event buses and maintains a per-`DeviceId`
snapshot.  Re-publishes every change on its own `events` bus as a
JSON-shaped dict so the WebSocket layer can forward straight to
clients.

Mongo mirror is intentionally out of scope here — Phase 5 will add
it as a second subscriber.  Keep this layer purely in-memory so the
WebSocket smoke test runs without a Mongo dep.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any

from elc.codec.device_id import DeviceId
from elc.codec.messages import BroadcastComplete, FailReport, RelayState
from elc.domain.bus import EventBus
from elc.drivers.srm import SrmDriver


@dataclass
class DeviceSnapshot:
    device: DeviceId
    relay_state: bool | None = None
    last_fail_code: int | None = None
    last_fail_detail: bytes = b""
    last_seen: datetime | None = None
    update_count: int = field(default=0)

    def to_dict(self) -> dict[str, Any]:
        return {
            "device": str(self.device),
            "relay_state": self.relay_state,
            "last_fail_code": self.last_fail_code,
            "last_seen": (
                self.last_seen.isoformat() if self.last_seen else None
            ),
            "update_count": self.update_count,
        }


class Replica:
    """In-memory authoritative store for current device state."""

    def __init__(self) -> None:
        self._by_device: dict[DeviceId, DeviceSnapshot] = {}
        self.events: EventBus[dict[str, Any]] = EventBus()

    # ---- driver wiring -----------------------------------------------

    def attach(self, driver: SrmDriver) -> None:
        """Subscribe to a driver's event buses."""
        driver.on_state_change.subscribe(self._on_relay_state)
        driver.on_broadcast.subscribe(self._on_broadcast_complete)
        driver.on_fail.subscribe(self._on_fail)

    # ---- reads --------------------------------------------------------

    def get(self, device: DeviceId) -> DeviceSnapshot | None:
        return self._by_device.get(device)

    def all(self) -> list[DeviceSnapshot]:
        return list(self._by_device.values())

    # ---- ops ----------------------------------------------------------

    async def register(self, device: DeviceId) -> bool:
        """Announce a device to the replica without touching hardware.

        Creates a snapshot with ``relay_state=None`` (unknown) so the
        operator UI can list the channel before any RelayState frame
        has been received.  Used by the "Seed SCU channels" button on
        the editor page when talking to a **physical** SCU -- we must
        NOT drive relays just to make them appear in the inventory.

        Returns ``True`` when the device is newly registered,
        ``False`` when it was already known (idempotent).
        """
        if device in self._by_device:
            return False
        snap = self._touch(device)
        # `_touch` bumps update_count to 1 and stamps last_seen; leave
        # relay_state at its dataclass default (None) so the UI can
        # style unknown-state channels distinctly from "off".
        await self.events.publish({
            "type": "device_registered",
            "device": str(device),
            "ts": snap.last_seen.isoformat() if snap.last_seen else None,
        })
        return True

    async def clear_alarm(self, device: DeviceId) -> bool:
        """Operator-initiated alarm acknowledge.  Clears the sticky
        ``last_fail_code`` on the snapshot and publishes an
        ``alarm_cleared`` event so every subscribed operator view drops
        the red border.  Returns ``True`` when a snapshot existed and
        had an alarm to clear.
        """
        snap = self._by_device.get(device)
        if snap is None or snap.last_fail_code is None:
            return False
        snap.last_fail_code = None
        snap.last_fail_detail = b""
        snap.last_seen = datetime.now(timezone.utc)
        snap.update_count += 1
        await self.events.publish({
            "type": "alarm_cleared",
            "device": str(device),
            "ts": snap.last_seen.isoformat(),
        })
        return True

    # ---- inbound from drivers ----------------------------------------

    async def _on_relay_state(self, msg: RelayState) -> None:
        snap = self._touch(msg.device)
        snap.relay_state = msg.state
        await self.events.publish({
            "type": "relay_state",
            "device": str(msg.device),
            "state": msg.state,
            "ts": snap.last_seen.isoformat() if snap.last_seen else None,
        })

    async def _on_broadcast_complete(self, msg: BroadcastComplete) -> None:
        # Apply the broadcast state to every device the replica knows
        # about that matches (dev_type, scu).  This keeps per-device
        # reads consistent for callers of get()/all() without needing
        # N individual RelayState frames over the wire.
        now = datetime.now(timezone.utc)
        affected = 0
        for snap in self._by_device.values():
            if (
                int(snap.device.dev_type) == msg.dev_type
                and snap.device.scu == msg.scu
            ):
                snap.relay_state = msg.state
                snap.last_seen = now
                snap.update_count += 1
                affected += 1
        await self.events.publish({
            "type": "broadcast_complete",
            "dev_type": msg.dev_type,
            "scu": msg.scu,
            "state": msg.state,
            "count": msg.count,
            "affected_replica": affected,
            "ts": now.isoformat(),
        })

    async def _on_fail(self, msg: FailReport) -> None:
        snap = self._touch(msg.device)
        snap.last_fail_code = msg.fail_code
        snap.last_fail_detail = msg.detail
        await self.events.publish({
            "type": "fail_report",
            "device": str(msg.device),
            "fail_code": msg.fail_code,
            "ts": snap.last_seen.isoformat() if snap.last_seen else None,
        })

    # ---- helpers ------------------------------------------------------

    def _touch(self, device: DeviceId) -> DeviceSnapshot:
        snap = self._by_device.get(device)
        if snap is None:
            snap = DeviceSnapshot(device=device)
            self._by_device[device] = snap
        snap.last_seen = datetime.now(timezone.utc)
        snap.update_count += 1
        return snap
