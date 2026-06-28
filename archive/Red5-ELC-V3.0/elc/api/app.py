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
from elc.api.ws import attach_ws
from elc.domain.replica import Replica
from elc.drivers.srm import SrmDriver
from elc.transport import ScuLink


@dataclass
class ElcStack:
    """Bundle of every long-lived object in one place — kept so tests
    and integrations can reach in without re-wiring."""

    app: FastAPI
    link: ScuLink
    driver: SrmDriver
    replica: Replica


def build_stack(
    host: str,
    port: int,
    *,
    name: str | None = None,
    initial_backoff: float = 0.5,
) -> ElcStack:
    """Construct (but do not start) the ELC stack.

    Caller is responsible for `await stack.link.start()` and shutdown.
    """
    link = ScuLink(host=host, port=port, name=name, initial_backoff=initial_backoff)
    driver = SrmDriver(link)
    replica = Replica()
    replica.attach(driver)

    app = FastAPI(title="Red5-ELC", version="0.1.0")
    app.include_router(build_router(driver=driver, replica=replica, link=link))
    attach_ws(app, replica)

    return ElcStack(app=app, link=link, driver=driver, replica=replica)
