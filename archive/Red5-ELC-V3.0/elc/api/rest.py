"""L5 — REST router (FastAPI).

Wires the SrmDriver + Replica behind `/api/elc/*`.  Kept layout-loose
so the V2.0 FastAPI app and the V1.9 Flask shim can both import
`build_router(...)` and mount it.
"""

from __future__ import annotations

import asyncio
from typing import Any

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from elc.codec.device_id import DeviceId, DeviceType
from elc.domain.replica import Replica
from elc.drivers.srm import SrmDriver
from elc.scheduling.engine import SchedulerEngine
from elc.transport import LinkState, ScuLink


class _RelayBody(BaseModel):
    state: bool


class _DimBody(BaseModel):
    # 0.0 (off) .. 1.0 (full).  Values outside the range are clamped
    # server-side rather than rejected -- operators tuning a slider
    # shouldn't see a 422 for a fingertip overshoot.
    level: float


def _parse_device_id(s: str) -> DeviceId:
    try:
        return DeviceId.from_string(s)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        ) from e


def build_router(
    *,
    driver: SrmDriver,
    replica: Replica,
    link: ScuLink,
    scheduler: SchedulerEngine | None = None,
    demo_devices: list[DeviceId] | None = None,
    data_source: str = "mock",
) -> APIRouter:
    """Construct the `/api/elc/*` router bound to a running stack.

    ``demo_devices`` optionally advertises the operator's real device
    inventory (e.g. the 6eRM + 6sRM + 4sRM channels loaded from
    ``ELC_DEVICES_JSON``) via ``GET /demo-devices``.  The editor page
    reads that list to safely seed the replica without firing any
    relays.  ``data_source`` is echoed back with the same endpoint so
    the UI can label the seed button appropriately ("Seed 16 SCU
    channels" vs. "Seed 30 demo devices").
    """
    router = APIRouter(prefix="/api/elc", tags=["elc"])
    _demo_devices: list[DeviceId] = list(demo_devices or [])
    _data_source = (data_source or "mock").strip().lower()

    @router.get("/link")
    async def link_state() -> dict[str, Any]:
        return {
            "name": link.name,
            "host": link.host,
            "port": link.port,
            "state": link.state.value,
            "connect_attempts": link.connect_attempts,
        }

    @router.get("/devices")
    async def list_devices() -> list[dict[str, Any]]:
        return [snap.to_dict() for snap in replica.all()]

    @router.get("/demo-devices")
    async def demo_devices_list() -> dict[str, Any]:
        """Return the operator's advertised device inventory.

        In ``mock`` mode this is a generated 30-SRM grid (matches the
        historical demo).  In ``physical`` mode it comes from whatever
        ``ELC_DEVICES_JSON`` was loaded at boot (e.g. 6eRM + 6sRM + 4sRM
        = 16 channels).  The editor page uses this to seed the replica
        by calling ``POST /devices/{id}/register`` per entry --
        importantly, **without** flipping any relay.
        """
        return {
            "source": _data_source,
            "count": len(_demo_devices),
            "devices": [str(d) for d in _demo_devices],
        }

    @router.post("/devices/{device_id:path}/register")
    async def register_device(device_id: str) -> dict[str, Any]:
        """Register a device in the replica without touching hardware.

        Used by the editor "Seed SCU channels" button when a physical
        SCU is on the wire -- we want the operator to see their real
        6eRM/6sRM/4sRM channels appear in the device grid immediately,
        without any RelaySet frame being sent (which would physically
        switch relays on).  Idempotent: registering an already-known
        device returns ``registered: false`` (200 OK).
        """
        if device_id.endswith("/register"):
            device_id = device_id[: -len("/register")]
        dev = _parse_device_id(device_id)
        registered = await replica.register(dev)
        return {"ok": True, "device": str(dev), "registered": registered}

    @router.post("/discover-srms")
    async def discover_srms(scu: int = 0) -> dict[str, Any]:
        """Broadcast-discover SRM-family modules on the SCU.

        Args:
            scu: SCU bus address to query (0-15).  The frontend passes
                the operator's last-selected SCU here so multi-SCU
                installs can be enumerated one bus at a time.  Defaults
                to 0 which matches the single-SCU dev/mock layout.

        Per operator-confirmed V3.8 §1.a/§1.b (2026-07-09):
        * Only TWO device-type codes matter for the SRM family:
          ``0x14`` (4SRM) and ``0x15`` (6SRM AND 6ERM — they share
          the wire code).
        * Query with ``address = 0x3FF`` (10-bit broadcast) and the
          SCU replies with one RelayStatus frame per populated
          module, each carrying its real (dev_type, scu, address)
          plus a full channel-state bitmask.

        Physical mode: fire the two broadcast queries and let the
        RX pipeline auto-register whichever modules respond (via
        the ``Replica._touch`` + ``_on_relay_state`` cascade -- any
        RelayState decoded for an unknown device creates a snapshot
        automatically).  The frontend polls ``GET /devices`` after
        a settle window and the module dots light up with true
        hardware state.

        Mock mode: falls back to the legacy "advertised inventory"
        register loop -- the MockScu already carries synthetic state.
        """
        # Mock-mode / dev-mode: no wire, just register the advertised
        # inventory so the UI has something to show.  Filter to the
        # requested SCU bus so multi-SCU demo JSON files behave the
        # same as physical hardware (each bus discovered independently).
        if _data_source != "physical":
            srm_devices = [
                d for d in _demo_devices
                if d.dev_type.name.startswith("SRM") and d.scu == scu
            ]
            registered_now: list[str] = []
            already_known: list[str] = []
            for d in srm_devices:
                if await replica.register(d):
                    registered_now.append(str(d))
                else:
                    already_known.append(str(d))
            return {
                "ok": True,
                "source": _data_source,
                "mode": "advertised_inventory",
                "family_filter": "SRM",
                "scu": scu,
                "count": len(srm_devices),
                "registered": registered_now,
                "already_known": already_known,
                "modules_scanned": 0,
            }

        # Physical mode: broadcast PanelInfo to the two SRM device
        # families.  Auto-registration happens downstream when the
        # SCU's RelayStatus responses land in _on_v38_bytes.
        #
        # The two queries fire CONCURRENTLY via asyncio.gather() —
        # same async-fan-out philosophy as broadcast_v38 (operator-
        # confirmed 2026-02-11).  Each module returns its 0x25
        # RelayStatus independently and the RX pipeline is safe to
        # interleave decodes.
        from elc.codec.device_id import DeviceType as _DT
        pre_count = len(replica.all())
        types_to_query = (_DT.SRM_4S, _DT.SRM_6S)   # 0x14, 0x15

        async def _one(dt: DeviceType) -> str | None:
            try:
                await driver.panel_info(dt, scu=scu)
                return f"0x{int(dt):02X}"
            except Exception:                        # noqa: BLE001
                # One family failing (e.g. no 4SRMs on this SCU) is
                # not fatal -- proceed with the other.
                return None

        results = await asyncio.gather(*[_one(dt) for dt in types_to_query])
        scanned_types: list[str] = [r for r in results if r]
        # Give the SCU + reader loop a beat to publish per-channel
        # RelayStates so the caller sees fresh state via GET /devices.
        await asyncio.sleep(1.0)
        post_devices = replica.all()
        new_ids = [
            str(s.device)
            for s in post_devices
        ][pre_count:]
        return {
            "ok": True,
            "source": _data_source,
            "mode": "broadcast_query",
            "family_filter": "SRM",
            "scu": scu,
            "queried_types": scanned_types,
            "modules_scanned": len(scanned_types),
            "registered": new_ids,
            "already_known": [str(s.device) for s in post_devices][:pre_count],
        }

    @router.get("/devices/{device_id:path}")
    async def get_device(device_id: str) -> dict[str, Any]:
        dev = _parse_device_id(device_id)
        snap = replica.get(dev)
        if snap is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"device {device_id} not seen yet",
            )
        return snap.to_dict()

    @router.post("/devices/{device_id:path}/relay")
    async def set_relay(device_id: str, body: _RelayBody) -> dict[str, Any]:
        if link.state is not LinkState.CONNECTED:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"link {link.name} not connected (state={link.state.value})",
            )
        # device_id arrives with the trailing "/relay" already stripped by
        # the route template, but :path captures it greedily — strip
        # explicitly so /devices/SRM/1/2/3/relay still works.
        if device_id.endswith("/relay"):
            device_id = device_id[: -len("/relay")]
        dev = _parse_device_id(device_id)
        await driver.set_relay(dev, body.state)
        return {"ok": True, "device": str(dev), "state": body.state}

    @router.post("/devices/{device_id:path}/dim")
    async def set_dim(device_id: str, body: _DimBody) -> dict[str, Any]:
        """UI-facing 0-10V dim endpoint (Phase 6.1 stub).

        Records the requested level in the replica and broadcasts a
        ``dim_level`` event so every open UI updates in lockstep.  This
        endpoint does NOT emit an analog wire frame today -- that lands
        in Phase 6.2 with the real ELC dim opcode.  Response includes
        ``mocked: true`` so the frontend can badge the control until
        real hardware control is available.
        """
        if device_id.endswith("/dim"):
            device_id = device_id[: -len("/dim")]
        dev = _parse_device_id(device_id)
        await replica.set_dim_level(dev, body.level)
        return {
            "ok": True,
            "device": str(dev),
            "level": max(0.0, min(1.0, float(body.level))),
            "mocked": True,
        }

    @router.post("/devices/{device_id:path}/clear-alarm")
    async def clear_alarm(device_id: str) -> dict[str, Any]:
        """Operator-facing alarm acknowledge.

        The Aligner spec (Phase 3) treats ``fail_report`` as *sticky*:
        an alarming device stays red until the operator explicitly
        clears it.  This route is the acknowledge action.  Returns
        ``cleared: false`` (200 OK, not 404) when the device wasn't
        alarming so the UI can no-op cleanly on repeat clicks.
        """
        if device_id.endswith("/clear-alarm"):
            device_id = device_id[: -len("/clear-alarm")]
        dev = _parse_device_id(device_id)
        cleared = await replica.clear_alarm(dev)
        return {"ok": True, "device": str(dev), "cleared": cleared}

    @router.post("/broadcast")
    async def broadcast(body: _RelayBody) -> dict[str, Any]:
        if link.state is not LinkState.CONNECTED:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"link {link.name} not connected (state={link.state.value})",
            )
        # V3.8 hardware path: enumerate registered SRM-family modules
        # from the replica, dedupe by (dev_type, scu, address) since the
        # replica stores per-channel snapshots, then fire opcode 0x07
        # RelayOverride frames concurrently (see driver.broadcast_v38).
        # Falls back to the legacy wildcard RelaySet for mock / non-v38
        # links so the tests + editor demo keep working unchanged.
        if getattr(link, "wire_version", "legacy") == "v38":
            from elc.codec.etlc38 import channel_count_for
            srm_families = {
                DeviceType.SRM, DeviceType.SRM_4S,
                DeviceType.SRM_6S, DeviceType.SRM_48S,
            }  # SRM_6E / SRM_ERM / SRM_4E all alias to SRM_6S per IntEnum
            seen: set[tuple[int, int, int]] = set()
            modules: list[DeviceId] = []
            for snap in replica.all():
                d = snap.device
                if d.dev_type not in srm_families:
                    continue
                key = (int(d.dev_type), d.scu, d.address)
                if key in seen:
                    continue
                seen.add(key)
                modules.append(DeviceId(
                    dev_type=d.dev_type,
                    scu=d.scu,
                    address=d.address,
                    sub_address=0,
                ))
            if modules:
                # Per-module channel count (operator-confirmed rule
                # 2026-02-11): a 4SRM in a mixed 4+6 install still gets
                # only 4 frames.  Sum is the true frame count on the
                # wire.  ``broadcast_v38`` now ignores its
                # ``max_channels`` arg but we keep computing it for
                # response transparency.
                per_module = [channel_count_for(m.dev_type) for m in modules]
                total_frames = sum(per_module)
                max_ch = max(per_module)
                await driver.broadcast_v38(body.state, modules)
                return {
                    "ok": True,
                    "broadcast": True,
                    "state": body.state,
                    "mode": "v38_burst",
                    "modules": len(modules),
                    "max_channels": max_ch,
                    "per_module_channels": per_module,
                    "frames": total_frames,
                }
            # No known SRM modules yet — surface that to the caller so
            # the operator can hit "Discover SRMs" first instead of
            # silently doing nothing.
            return {
                "ok": True,
                "broadcast": True,
                "state": body.state,
                "mode": "v38_burst",
                "modules": 0,
                "note": "no SRM modules known; run POST /discover-srms first",
            }
        await driver.broadcast(body.state)
        return {
            "ok": True,
            "broadcast": True,
            "state": body.state,
            "mode": "legacy_wildcard",
        }

    @router.get("/relay-data")
    async def relay_data(device: str, data_type: int) -> dict[str, Any]:
        """Fetch an on-demand data report from an SRM module.

        Wraps ``SrmDriver.request_relay_data_v38`` (opcode 0x14 with a
        data-type sub-code -- see protocol doc §8).  Legal
        ``data_type`` values today (2026-02-11):

          * ``0x06`` (6)  Relay Total Count + On Time (parsed)
          * ``0x07`` (7)  Relay Daily On Time         (raw only)
          * ``0x08`` (8)  Relay Monthly On Time       (raw only)
          * ``0x0A`` (10) Power Daily                 (raw only)
          * ``0x0B`` (11) Power Monthly               (raw only)
          * ``0x11`` (17) Relay State bitmask         (existing path)

        Query params:
            device:    device_id like ``6SRM/0/2/1``
            data_type: integer (accepts decimal or 0x-hex from query)

        Returns a JSON blob with ``raw_hex`` (always) + parsed fields
        when we have a decoder for that data type.  No DB
        persistence -- pure query.

        Safe against live hardware: this opcode never fires a relay.
        """
        if link.state is not LinkState.CONNECTED:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"link {link.name} not connected (state={link.state.value})",
            )
        if getattr(link, "wire_version", "legacy") != "v38":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="/relay-data requires a V3.8 link",
            )
        dev = _parse_device_id(device)
        result = await driver.request_relay_data_v38(dev, data_type & 0xFF)
        return {"ok": True, **result}

    # ---- Phase 4 scheduler engine control --------------------------------
    # These are only mounted when a SchedulerEngine was wired into the
    # stack (build_stack() passes one; small test harnesses that skip
    # scheduling can omit it and lose only these routes).
    if scheduler is not None:
        @router.get("/scheduler/status")
        async def scheduler_status() -> dict[str, Any]:
            return {
                "running": scheduler.running,
                "tick_seconds": scheduler._tick_seconds,  # noqa: SLF001
            }

        @router.post("/scheduler/start")
        async def scheduler_start() -> dict[str, Any]:
            await scheduler.start()
            return {"ok": True, "running": scheduler.running}

        @router.post("/scheduler/stop")
        async def scheduler_stop() -> dict[str, Any]:
            await scheduler.stop()
            return {"ok": True, "running": scheduler.running}

        @router.post("/scheduler/tick")
        async def scheduler_tick() -> dict[str, Any]:
            """Run one evaluation pass immediately.  Useful for smoke
            tests and the operator's "run now" preview button.  Returns
            every dispatch (executed or dry-run) the tick produced.
            """
            out = await scheduler.tick()
            return {
                "dispatches": [
                    {
                        "at": d.at.isoformat(),
                        "device": d.device,
                        "state": d.state,
                        "schedule_id": d.schedule_id,
                        "schedule_name": d.schedule_name,
                        "rule_index": d.rule_index,
                        "reason": d.reason,
                        "executed": d.executed,
                    }
                    for d in out
                ],
            }

    return router
