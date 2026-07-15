"""Composition root — wires ScuLink + SrmDriver + Replica + API.

For the V2.0 FastAPI host application the entry point is roughly:

    from elc.api.app import build_app
    elc_app, scu = await build_app(host="10.0.0.5", port=7000)
    main_app.mount("/", elc_app)

For tests we use the same factory and drive the ScuLink against a
`MockScuServer` instead of real hardware.
"""

from __future__ import annotations

from dataclasses import dataclass

from fastapi import FastAPI

from elc.api.rest import build_router
from elc.api.sse import attach_sse
from elc.api.ws import attach_ws
from elc.codec.device_id import DeviceId
from elc.config.routes import build_config_router
from elc.domain.replica import Replica
from elc.drivers.srm import SrmDriver
from elc.floors.routes import build_floors_router, build_lighting_router
from elc.scheduling.engine import SchedulerEngine
from elc.transport import ScuLink


@dataclass
class ElcStack:
    """Bundle of every long-lived object in one place — kept so tests
    and integrations can reach in without re-wiring."""

    app: FastAPI
    link: ScuLink
    driver: SrmDriver
    replica: Replica
    scheduler: SchedulerEngine


def build_stack(
    host: str,
    port: int,
    *,
    name: str | None = None,
    initial_backoff: float = 0.5,
    config_db_path: str | None = None,
    scheduler_tick_seconds: float = 30.0,
    demo_devices: list[DeviceId] | None = None,
    data_source: str = "mock",
) -> ElcStack:
    """Construct (but do not start) the ELC stack.

    Caller is responsible for ``await stack.link.start()``,
    ``await stack.scheduler.start()`` and matching shutdown.

    ``config_db_path`` overrides the operator-UI config SQLite location
    (Phase 1: groups/schedules CRUD).  Leave ``None`` on the target
    device to use ``elc.config.store.DEFAULT_DB_PATH``; tests point it
    at a per-run temp path.

    ``scheduler_tick_seconds`` sets the Phase 4 scheduler-engine cadence
    (default 30s).  The engine is *not* auto-started -- call
    ``await stack.scheduler.start()`` when you want time-of-day / sun /
    lux rules to begin dispatching to the driver.  Even started, a
    controller boots with ``engine_mode = "dry_run"`` so no hardware
    fires until the operator explicitly flips it live.
    """
    link = ScuLink(
        host=host, port=port, name=name,
        initial_backoff=initial_backoff,
        # Physical hardware speaks ETLC V3.8; mock stays on legacy so
        # the existing 385-test suite keeps passing unchanged.
        wire_version=("v38" if data_source == "physical" else "legacy"),
    )
    driver = SrmDriver(link)
    replica = Replica()
    replica.attach(driver)
    scheduler = SchedulerEngine(
        driver=driver,
        db_path=config_db_path,
        tick_seconds=scheduler_tick_seconds,
    )

    app = FastAPI(title="Red5-ELC", version="0.1.0")
    # Config router is prefix-less; mount under the same /api/elc namespace
    # so /api/elc/groups, /api/elc/schedules, /api/elc/devices/{id}/schedules
    # sit alongside /api/elc/link, /api/elc/devices, /api/elc/broadcast.
    #
    # Order matters: FastAPI matches routes in registration order.  The
    # REST router's `/devices/{device_id:path}` is a greedy catch-all
    # that would swallow `/devices/SRM/1/1/1/schedules` (returning HTTP
    # 400 "not seen yet" instead of the join query).  Register the
    # more-specific config routes first so they win the match.
    app.include_router(
        build_config_router(db_path=config_db_path),
        prefix="/api/elc",
        tags=["elc-config"],
    )
    # Phase 6.1 — floor plans + fixture placements (top-down view).
    # Piggy-backs on the same SQLite file as the config router.
    app.include_router(
        build_floors_router(db_path=config_db_path),
        prefix="/api/elc",
        tags=["elc-floors"],
    )
    # Phase 6.1b — per-device lighting-element assignments.
    app.include_router(
        build_lighting_router(db_path=config_db_path),
        prefix="/api/elc",
        tags=["elc-lighting"],
    )
    app.include_router(build_router(
        driver=driver,
        replica=replica,
        link=link,
        scheduler=scheduler,
        demo_devices=demo_devices,
        data_source=data_source,
    ))
    attach_ws(app, replica)
    # Phase 3 (operator view): SSE fallback for browsers behind proxies
    # that strip the WebSocket Upgrade header (Cloudflare access rules,
    # some corporate MITM proxies).
    attach_sse(app, replica)

    return ElcStack(
        app=app, link=link, driver=driver, replica=replica, scheduler=scheduler,
    )
