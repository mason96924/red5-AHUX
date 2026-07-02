"""L5 — REST router (FastAPI).

Wires the SrmDriver + Replica behind `/api/elc/*`.  Kept layout-loose
so the V2.0 FastAPI app and the V1.9 Flask shim can both import
`build_router(...)` and mount it.
"""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from elc.codec.device_id import DeviceId
from elc.domain.replica import Replica
from elc.drivers.srm import SrmDriver
from elc.scheduling.engine import SchedulerEngine
from elc.transport import LinkState, ScuLink


class _RelayBody(BaseModel):
    state: bool


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
) -> APIRouter:
    """Construct the `/api/elc/*` router bound to a running stack."""
    router = APIRouter(prefix="/api/elc", tags=["elc"])

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

    @router.post("/broadcast")
    async def broadcast(body: _RelayBody) -> dict[str, Any]:
        if link.state is not LinkState.CONNECTED:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"link {link.name} not connected (state={link.state.value})",
            )
        await driver.broadcast(body.state)
        return {"ok": True, "broadcast": True, "state": body.state}

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
