#!/usr/bin/env python3
"""Red5-ELC demo console.

Boots:
  * a MockScuServer on an ephemeral port (acts as a fake SCU and
    echoes every RelaySet back as a RelayState so the dashboard shows
    immediate feedback),
  * the full ELC stack (codec + ScuLink + SrmDriver + Replica + REST + WS),
  * a tiny static-file mount so opening the browser at the listed URL
    serves `demo/index.html` from the same origin.

No real hardware required — handy for poking buttons, watching live
WS events, and clicking around Swagger UI.

Run:
    python scripts/demo.py
    # or pick a port:
    DEMO_PORT=8888 python scripts/demo.py
"""

from __future__ import annotations

import asyncio
import logging
import os
import random
import sys
from pathlib import Path

from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

# Allow `python scripts/demo.py` from the repo root without installing.
REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT))

from elc.api import build_stack  # noqa: E402
from elc.codec import encode  # noqa: E402
from elc.codec.device_id import DeviceId, DeviceType  # noqa: E402
from elc.codec.messages import FailReport, RelaySet, RelayState  # noqa: E402
from elc.codec.registry import default_registry  # noqa: E402

# MockScuServer lives in tests/conftest.py — pull it directly.
sys.path.insert(0, str(REPO_ROOT / "tests"))
from conftest import MockScuServer  # type: ignore  # noqa: E402

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s"
)
log = logging.getLogger("demo")


DEMO_DEVICES = [
    DeviceId(dev_type=DeviceType.SRM, scu=1, address=10, sub_address=0),
    DeviceId(dev_type=DeviceType.SRM, scu=1, address=20, sub_address=0),
    DeviceId(dev_type=DeviceType.SRM, scu=1, address=30, sub_address=0),
    DeviceId(dev_type=DeviceType.SRM, scu=1, address=40, sub_address=0),
]


async def main() -> None:
    port = int(os.environ.get("DEMO_PORT", "8765"))

    # ---- MockScu (fake hardware) ------------------------------------
    scu = MockScuServer()
    await scu.start()
    log.info("MockScu listening on 127.0.0.1:%d", scu.port)

    # State table on the SCU side so the echo reflects the LAST written value.
    scu_state: dict[DeviceId, bool] = {d: False for d in DEMO_DEVICES}

    async def echo_relay(frame, writer):  # type: ignore[no-untyped-def]
        if frame.msg_type == RelaySet.FLAG:
            cmd = RelaySet.decode(frame.payload)
            scu_state[cmd.device] = cmd.state
            reply = default_registry.encode_message(
                RelayState(device=cmd.device, state=cmd.state)
            )
            writer.write(encode(reply))
            await writer.drain()

    scu.on_frame(echo_relay)

    # ---- ELC stack pointed at the fake SCU --------------------------
    stack = build_stack(
        "127.0.0.1", scu.port, name="demo-scu", initial_backoff=0.2
    )
    await stack.link.start()
    await stack.link.wait_connected(timeout=3.0)
    log.info("ScuLink connected (state=%s)", stack.link.state.value)

    # ---- Static mount so / serves the demo console ------------------
    demo_dir = REPO_ROOT / "demo"
    stack.app.mount(
        "/static", StaticFiles(directory=str(demo_dir)), name="static"
    )

    @stack.app.get("/", include_in_schema=False)
    async def index() -> FileResponse:
        return FileResponse(str(demo_dir / "index.html"))

    # ---- Sprinkle a few random failures so the WS log shows variety -
    async def chaos_monkey() -> None:
        await asyncio.sleep(8)
        while True:
            await asyncio.sleep(random.uniform(15, 30))
            dev = random.choice(DEMO_DEVICES)
            wire = encode(
                default_registry.encode_message(
                    FailReport(
                        device=dev,
                        fail_code=random.choice([0x01, 0x04, 0x42, 0x99]),
                        detail=b"demo",
                    )
                )
            )
            for w in list(scu._writers):  # noqa: SLF001
                try:
                    w.write(wire)
                    await w.drain()
                except Exception:
                    pass
    chaos_task = asyncio.create_task(chaos_monkey())

    # ---- Run uvicorn in-process -------------------------------------
    import uvicorn

    config = uvicorn.Config(
        stack.app,
        host="127.0.0.1",
        port=port,
        log_level="warning",
        lifespan="off",
    )
    server = uvicorn.Server(config)

    p = f"{port}"
    s = f"{scu.port}"
    banner = f"""
╔══════════════════════════════════════════════════════════════╗
║  Red5-ELC V3.0 · Demo Console                                ║
╠══════════════════════════════════════════════════════════════╣
║  Web console     http://127.0.0.1:{p}/
║  Swagger UI      http://127.0.0.1:{p}/docs
║  Link status     http://127.0.0.1:{p}/api/elc/link
║  Device list     http://127.0.0.1:{p}/api/elc/devices
║  Live events     ws://127.0.0.1:{p}/ws/elc/events
╠══════════════════════════════════════════════════════════════╣
║  Fake SCU        127.0.0.1:{s}  (MockScuServer)
║  Ctrl-C to stop.
╚══════════════════════════════════════════════════════════════╝
"""
    print(banner, flush=True)

    try:
        await server.serve()
    finally:
        chaos_task.cancel()
        await stack.link.stop()
        await scu.stop()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nstopped.")
