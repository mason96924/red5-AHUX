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

    return router
