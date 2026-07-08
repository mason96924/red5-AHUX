#!/usr/bin/env python3
"""Red5-ELC demo console.

Boots the ELC stack pointed at either:

  * a **MockScuServer** on an ephemeral port (default) that echoes
    every RelaySet back as a RelayState -- handy for poking buttons
    and stress testing without hardware, or
  * a **physical SCU** on the LAN, driven by real 6eRM / 6sRM /
    4sRM modules -- enabled by setting ``ELC_DATA_SOURCE=physical``
    plus ``ELC_SCU_HOST`` / ``ELC_SCU_PORT``.

Environment variables:
    DEMO_PORT           Uvicorn port (default 8888)
    ELC_DATA_SOURCE     'mock' (default) | 'physical'
    ELC_SCU_HOST        physical SCU IP (default 192.168.1.222)
    ELC_SCU_PORT        physical SCU port (default 9760)
    ELC_DEVICES_JSON    path to JSON defining the on-air device set.
                        Format: [{"dev_type":"SRM","scu":1,
                                  "address":10,"sub_address":0}, ...]
                        When ``mock`` is active this list drives the
                        mock's echo state; when ``physical`` it's used
                        for the UI-side seeding only (the real SCU
                        already knows about its own modules).
    ELC_CONFIG_DB_PATH  SQLite path (default /tmp/elc_demo_config.db)

Run:
    # MockScu (default -- no hardware needed)
    python scripts/demo.py

    # Real hardware (SCU + 1x 6eRM + 1x 6sRM + 1x 4sRM)
    ELC_DATA_SOURCE=physical \\
    ELC_SCU_HOST=192.168.1.222 ELC_SCU_PORT=9760 \\
    ELC_DEVICES_JSON=./demo/samples/scu-6e6s4s.json \\
    python scripts/demo.py
"""

from __future__ import annotations

import asyncio
import json
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
from elc.codec.device_id import ADDR_BITS, SUBADDR_BITS, DeviceId, DeviceType  # noqa: E402
from elc.codec.messages import BroadcastComplete, FailReport, RelaySet, RelayState  # noqa: E402
from elc.codec.registry import default_registry  # noqa: E402

# Wildcard address / sub_address values used by SrmDriver.broadcast() to
# signal "every device of this (dev_type, scu)" — architecture §2.
_WILDCARD_ADDR = (1 << ADDR_BITS) - 1
_WILDCARD_SUB = (1 << SUBADDR_BITS) - 1

# MockScuServer lives in tests/conftest.py — pull it directly.
sys.path.insert(0, str(REPO_ROOT / "tests"))
from conftest import MockScuServer  # type: ignore  # noqa: E402

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s"
)
log = logging.getLogger("demo")


def _load_device_set() -> list[DeviceId]:
    """Return the DeviceId list for the demo.

    * If ``ELC_DEVICES_JSON`` points at a readable file, parse it and
      turn each entry into a DeviceId.  Unknown ``dev_type`` names
      raise so misconfiguration fails loud.
    * Otherwise fall back to 30 SRMs on scu=1 -- the historical mock
      layout that /floor's grid expects.
    """
    path = os.environ.get("ELC_DEVICES_JSON")
    if path:
        raw = json.loads(Path(path).read_text())
        out: list[DeviceId] = []
        for entry in raw:
            out.append(DeviceId(
                dev_type=DeviceType[entry["dev_type"]],
                scu=int(entry["scu"]),
                address=int(entry["address"]),
                sub_address=int(entry["sub_address"]),
            ))
        return out
    return [
        DeviceId(dev_type=DeviceType.SRM, scu=1, address=10 * (i + 1), sub_address=0)
        for i in range(30)
    ]


DEMO_DEVICES = _load_device_set()


async def main() -> None:
    port = int(os.environ.get("DEMO_PORT", "8888"))
    source = os.environ.get("ELC_DATA_SOURCE", "mock").strip().lower()
    if source not in {"mock", "physical"}:
        raise SystemExit(
            f"ELC_DATA_SOURCE must be 'mock' or 'physical', got {source!r}"
        )

    # ---- Boot the data source ---------------------------------------
    scu = None                        # MockScuServer instance, or None for physical
    if source == "physical":
        scu_host = os.environ.get("ELC_SCU_HOST", "192.168.1.222")
        scu_port = int(os.environ.get("ELC_SCU_PORT", "9760"))
        log.info("╔══════════════════════════════════════════════════════════╗")
        log.info("║ DATA SOURCE: PHYSICAL SCU @ %-25s ║", f"{scu_host}:{scu_port}")
        log.info("║ Devices: %-48s ║",
                 ", ".join(f"{d.dev_type.name}/{d.address}" for d in DEMO_DEVICES[:6])
                 + ("..." if len(DEMO_DEVICES) > 6 else ""))
        log.info("╚══════════════════════════════════════════════════════════╝")
    else:
        scu = MockScuServer()
        await scu.start()
        scu_host, scu_port = "127.0.0.1", scu.port
        log.info("╔══════════════════════════════════════════════════════════╗")
        log.info("║ DATA SOURCE: MOCK SCU (127.0.0.1:%-5d)                  ║", scu.port)
        log.info("╚══════════════════════════════════════════════════════════╝")

        # State table on the SCU side so the echo reflects the LAST written value.
        scu_state: dict[DeviceId, bool] = {d: False for d in DEMO_DEVICES}

        async def echo_relay(frame, writer):  # type: ignore[no-untyped-def]
            if frame.msg_type == RelaySet.FLAG:
                cmd = RelaySet.decode(frame.payload)
                # Detect a wildcard broadcast (address + sub_address all-ones,
                # per architecture §2 / SrmDriver.broadcast()).  A real SCU
                # applies the state to every matching device and replies with
                # one BroadcastComplete frame -- NOT N RelayState echoes.  The
                # mock has to model the same behaviour or the stress-console
                # broadcast buttons never see anything to paint.
                is_wildcard = (
                    cmd.device.address == _WILDCARD_ADDR
                    and cmd.device.sub_address == _WILDCARD_SUB
                )
                if is_wildcard:
                    affected = 0
                    for d in list(scu_state.keys()):
                        if (
                            int(d.dev_type) == int(cmd.device.dev_type)
                            and d.scu == cmd.device.scu
                        ):
                            scu_state[d] = cmd.state
                            affected += 1
                    reply = default_registry.encode_message(
                        BroadcastComplete(
                            dev_type=int(cmd.device.dev_type),
                            scu=cmd.device.scu,
                            state=cmd.state,
                            count=affected,
                        )
                    )
                    writer.write(encode(reply))
                    await writer.drain()
                    return
                scu_state[cmd.device] = cmd.state
                reply = default_registry.encode_message(
                    RelayState(device=cmd.device, state=cmd.state)
                )
                writer.write(encode(reply))
                await writer.drain()

        scu.on_frame(echo_relay)

    # ---- ELC stack pointed at whichever SCU we selected -------------
    # Config DB in /tmp so the demo works unprivileged (default is
    # /var/lib/elc/config.db which requires root on first-run mkdir).
    config_db = os.environ.get("ELC_CONFIG_DB_PATH", "/tmp/elc_demo_config.db")
    stack = build_stack(
        scu_host, scu_port, name="demo-scu", initial_backoff=0.2,
        config_db_path=config_db,
    )
    await stack.link.start()
    # Physical SCUs can take longer to accept the first TCP connection
    # (spanning-tree convergence, DHCP renew, PoE inrush).  Bump the
    # wait so a cold rack doesn't crash the demo on start.
    connect_timeout = 15.0 if source == "physical" else 3.0
    try:
        await stack.link.wait_connected(timeout=connect_timeout)
    except asyncio.TimeoutError:
        if source == "physical":
            log.error("Cannot reach %s:%d -- check IP, port, firewall, and "
                      "that the SCU's ELC service is running.",
                      scu_host, scu_port)
            raise
        raise
    log.info("ScuLink connected (state=%s)", stack.link.state.value)

    # ---- Static mount so / serves the demo console ------------------
    demo_dir = REPO_ROOT / "demo"
    stack.app.mount(
        "/static", StaticFiles(directory=str(demo_dir)), name="static"
    )

    # Aggressive no-cache headers for the three static HTML entry
    # points.  Without these, iOS Safari (and other aggressive HTTP/1.1
    # caches sitting between the operator and the tunnel) hold on to
    # stale bundles for hours, and users see yesterday's UI after a
    # code push -- confirmed in the wild 2026-07-02 (private mode
    # fixed it; regular Safari didn't).  The compiled JS + CSS
    # sub-resources are still safe to cache because they carry a
    # ?v=<hash> query-string that rotates on every rebuild.
    _NO_CACHE = {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }

    @stack.app.get("/", include_in_schema=False)
    async def index() -> FileResponse:
        return FileResponse(str(demo_dir / "index.html"), headers=_NO_CACHE)

    @stack.app.get("/stress", include_in_schema=False)
    async def stress() -> FileResponse:
        return FileResponse(str(demo_dir / "stress.html"), headers=_NO_CACHE)

    @stack.app.get("/editor", include_in_schema=False)
    async def editor() -> FileResponse:
        return FileResponse(str(demo_dir / "editor.html"), headers=_NO_CACHE)

    @stack.app.get("/floor", include_in_schema=False)
    async def floor() -> FileResponse:
        return FileResponse(str(demo_dir / "floor.html"), headers=_NO_CACHE)

    @stack.app.get("/samples/{name}", include_in_schema=False)
    async def sample_file(name: str) -> FileResponse:
        """Serve any file from ``demo/samples/`` (currently just
        ``warehouse-20x12.dxf``) as a download.  Keeps sample assets
        one HTTP GET away without needing scp / rsync from the pod."""
        # Reject path-escape attempts.  ``Path.name`` strips directory
        # components and any resolve() outside ``samples/`` fails below.
        p = (demo_dir / "samples" / Path(name).name).resolve()
        if not p.exists() or (demo_dir / "samples").resolve() not in p.parents:
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail=f"no sample named {name!r}")
        return FileResponse(
            str(p),
            filename=p.name,
            media_type="application/octet-stream",
        )

    # ---- Sprinkle a few random failures so the WS log shows variety -
    # Mock-mode only.  When a real SCU is on the wire, failures come
    # from actual hardware -- injecting synthetic FailReports would
    # confuse the operator into thinking their tubes are broken.
    chaos_task = None
    if source == "mock" and scu is not None:
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
║  Live events     ws://127.0.0.1:{p}/api/elc/events
╠══════════════════════════════════════════════════════════════╣
║  Fake SCU        127.0.0.1:{s}  (MockScuServer)
║  Ctrl-C to stop.
╚══════════════════════════════════════════════════════════════╝
"""
    print(banner, flush=True)

    try:
        await server.serve()
    finally:
        chaos_task.cancel() if chaos_task else None
        await stack.link.stop()
        if scu is not None:
            await scu.stop()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nstopped.")
