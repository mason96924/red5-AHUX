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
from elc.codec.etlc38 import channel_count_for  # noqa: E402
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


def _warn_typoed_env() -> None:
    """Loud-warn on common env-var typos so an operator running against
    real hardware doesn't silently boot the 30-SRM mock inventory.

    ``ELC_DEVICE_JSON`` (missing S) has caught the operator once already
    (2026-02-11).  Any ``ELC_*`` env var that isn't in the canonical
    list gets printed to stderr before boot.
    """
    known = {
        "ELC_DATA_SOURCE", "ELC_SCU_HOST", "ELC_SCU_PORT",
        "ELC_DEVICES_JSON", "ELC_CONFIG_DB_PATH",
    }
    for key in os.environ:
        if key.startswith("ELC_") and key not in known:
            print(
                f"\N{WARNING SIGN}  {key} is not a recognised ELC env var. "
                f"Did you mean ELC_DEVICES_JSON?  Known keys: "
                f"{', '.join(sorted(known))}",
                file=sys.stderr, flush=True,
            )


# Module label overrides — populated from devices.json so operators
# can write "SRM_6E" in the JSON and have the UI display it as
# "SRM_6E" even though on the wire the byte is 0x15 (same as SRM_6S).
# See _entry_to_devices below.  Keyed on (scu, address) since 6E and
# 6S can't coexist at the same (type=0x15, address) tuple.
MODULE_LABEL_OVERRIDES: dict[tuple[int, int], str] = {}


def _entry_to_devices(entry: dict) -> list[DeviceId]:
    """Turn one JSON entry into one or more DeviceIds.

    * ``dev_type`` is required (and must be a valid ``DeviceType`` name);
      entries missing it are treated as pure-comment objects and dropped.
    * If ``sub_address`` is provided, the entry maps to a single channel
      (legacy per-channel behaviour).
    * If ``sub_address`` is **omitted**, the entry is auto-expanded into
      one DeviceId per channel (1..N) using
      :func:`channel_count_for` so operators can write one JSON line per
      *module* instead of N lines per channel.
    * If the JSON label differs from the canonical enum name (e.g.
      ``"SRM_6E"`` collapses to ``SRM_6S`` because they share wire code
      0x15), the ORIGINAL string is recorded in
      ``MODULE_LABEL_OVERRIDES`` so the UI can retain the 6E vs 6S
      distinction even though the codec cannot.
    """
    if "dev_type" not in entry:
        return []
    raw_label = str(entry["dev_type"])
    dev_type = DeviceType[raw_label]
    scu = int(entry["scu"])
    address = int(entry["address"])
    # If the raw label doesn't match the canonical enum member name
    # (SRM_6E → SRM_6S), record the raw label as a display override
    # keyed on (scu, addr) for use by the frontend.
    if raw_label != dev_type.name:
        MODULE_LABEL_OVERRIDES[(scu, address)] = raw_label
    if "sub_address" in entry:
        return [DeviceId(
            dev_type=dev_type,
            scu=scu,
            address=address,
            sub_address=int(entry["sub_address"]),
        )]
    n_ch = channel_count_for(dev_type)
    return [
        DeviceId(dev_type=dev_type, scu=scu, address=address, sub_address=sub)
        for sub in range(1, n_ch + 1)
    ]


def _load_device_set() -> list[DeviceId]:
    """Return the DeviceId list for the demo.

    Resolution order (2026-02-11: project.json now primary):
      1. ``configs/project.json`` — the Settings wizard's output.
         When present + non-empty, this IS the operator's inventory
         and no env vars are needed.
      2. ``ELC_DEVICES_JSON`` — explicit override path (module- or
         channel-granular; auto-expanded when ``sub_address`` is absent).
         Kept for scripting / CI / pre-Settings-page installs.
      3. ``demo/samples/scu-6e6s4s.json`` — the canonical operator
         hardware layout (1× 6eRM @1, 1× 6sRM @2, 1× 4sRM @3).  Used as
         the default so ``python scripts/demo.py`` with no config
         still boots against the real-world module mix.
      4. Legacy synthetic fallback — 30× SRM modules spaced by 10,
         kept only for absolute backwards compatibility if the
         sample file is missing.
    """
    _warn_typoed_env()
    # Priority 1: configs/project.json (Settings wizard output).
    try:
        from elc.config.project import load_project, is_configured
        if is_configured():
            cfg = load_project()
            if cfg is not None:
                out: list[DeviceId] = []
                for entry in cfg.to_devices_json():
                    out.extend(_entry_to_devices(entry))
                return out
    except Exception as e:  # noqa: BLE001
        # Config parse error shouldn't hard-fail boot; fall through.
        log.warning("project.json load failed, falling back: %s", e)
    # Priority 2 + 3: env var, then bundled sample.
    path = os.environ.get("ELC_DEVICES_JSON")
    if not path:
        default_sample = REPO_ROOT / "demo" / "samples" / "scu-6e6s4s.json"
        if default_sample.is_file():
            path = str(default_sample)
    if path:
        raw = json.loads(Path(path).read_text())
        out = []
        for entry in raw:
            out.extend(_entry_to_devices(entry))
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

    # ---- Boot banner: ALWAYS visible so operators (and forked agents)
    # never have to hunt for the right invocation.  Print via plain
    # stdout, not the logger, so the block survives any log-level
    # filtering an operator or CI might apply.  DO NOT REMOVE -- see
    # /app/memory/PRD.md §"demo.py startup banner rule".
    print("", flush=True)
    print("=" * 68, flush=True)
    print(" RED5-ELC V3.0 demo — startup instructions", flush=True)
    print("=" * 68, flush=True)
    print(f" Current mode      : {source.upper()}", flush=True)
    print(f" HTTP UI           : http://127.0.0.1:{port}/floor", flush=True)
    print("", flush=True)
    print(" How to run in MOCK mode (no hardware needed):", flush=True)
    print("   python scripts/demo.py", flush=True)
    print("", flush=True)
    print(" How to run against PHYSICAL SCU + real 6eRM/6sRM/4sRM:", flush=True)
    print("   export PYTHONUNBUFFERED=1", flush=True)
    print("   export ELC_DATA_SOURCE=physical", flush=True)
    print("   python scripts/demo.py 2>&1 | tee /tmp/demo.log", flush=True)
    print("   -> open http://127.0.0.1:8888/settings first time to", flush=True)
    print("      set SCU IP/port + module list; then Save & Continue.", flush=True)
    print("", flush=True)
    print(" Watch just the ETLC V3.8 wire traffic in another terminal:", flush=True)
    print("   tail -f /tmp/demo.log | grep 'V3\\.8'", flush=True)
    print("", flush=True)
    print(" Config precedence (2026-02-11):", flush=True)
    print("   1. configs/project.json    (Settings wizard output — preferred)", flush=True)
    print("   2. ELC_SCU_HOST/PORT env   (scripting / CI override)", flush=True)
    print("   3. ELC_DEVICES_JSON env    (legacy path)", flush=True)
    print("   4. demo/samples/scu-6e6s4s.json  (bundled default)", flush=True)
    print("", flush=True)
    print(" Other useful env vars:", flush=True)
    print("   DEMO_PORT=8888                       (HTTP port)", flush=True)
    print("   DEMO_HOST=127.0.0.1                  (bind addr — set to 0.0.0.0", flush=True)
    print("                                         when reverse-proxying from another host)", flush=True)
    print("=" * 68, flush=True)
    print("", flush=True)

    # ---- Boot the data source ---------------------------------------
    scu = None                        # MockScuServer instance, or None for physical
    if source == "physical":
        # Prefer configs/project.json's first SCU host/port (Settings
        # wizard output) over env vars.  Env vars still win when set,
        # so scripted / CI overrides remain effective.
        _proj_host, _proj_port = None, None
        try:
            from elc.config.project import load_project
            _cfg = load_project()
            if _cfg and _cfg.scus:
                _proj_host = _cfg.scus[0].host or None
                _proj_port = _cfg.scus[0].port or None
        except Exception:  # noqa: BLE001
            pass
        scu_host = os.environ.get("ELC_SCU_HOST") or _proj_host or "192.168.1.222"
        scu_port = int(os.environ.get("ELC_SCU_PORT") or _proj_port or 9760)
        log.info("╔══════════════════════════════════════════════════════════╗")
        log.info("║ DATA SOURCE: PHYSICAL SCU @ %-25s ║", f"{scu_host}:{scu_port}")
        log.info("║ Devices: %-48s ║",
                 ", ".join(
                     f"{d.dev_type.name}/{d.address}/{d.sub_address}"
                     for d in DEMO_DEVICES[:4]
                 )
                 + (f"... (+{len(DEMO_DEVICES) - 4} more)" if len(DEMO_DEVICES) > 4 else ""))
        log.info("║ Channel count: %-42d ║", len(DEMO_DEVICES))
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
        demo_devices=DEMO_DEVICES,
        data_source=source,
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

    @stack.app.get("/api/elc/floor-devices", include_in_schema=False)
    async def floor_devices() -> dict:
        """Return {floor_id: [device_id, …]} derived from each floor's
        fixture placements.  Powers the Editor's Devices panel which
        lists floors and, per floor, the modules whose relays have
        been placed on that floor's canvas.  Empty when no floors
        exist or when no fixtures have been placed yet.
        """
        from elc.floors import store as _floor_store
        out: dict[str, list[str]] = {}
        try:
            floors = _floor_store.list_floors()
        except Exception:               # noqa: BLE001
            return {"placements": {}}
        for f in floors:
            try:
                detail = _floor_store.get_floor(f["id"], include_svg=False)
            except Exception:           # noqa: BLE001
                continue
            devs = [
                fx.get("device_id")
                for fx in (detail.get("fixtures") or [])
                if fx.get("device_id")
            ]
            # Deduplicate but preserve first-seen order.
            seen: set[str] = set()
            out[f["id"]] = [d for d in devs if not (d in seen or seen.add(d))]
        return {"placements": out}

    @stack.app.get("/api/elc/module-labels", include_in_schema=False)
    async def module_labels() -> dict:
        """Return {"<scu>/<addr>": "<display-label>"} for every module
        whose devices.json label differs from the canonical enum
        member name (e.g. ``SRM_6E`` vs ``SRM_6S``).  The Floor page
        uses this to preserve the operator's original label in the
        UI even though the codec collapses aliases.  Empty when the
        demo has no overrides (i.e. the JSON already used canonical
        names).
        """
        return {
            "overrides": {
                f"{scu}/{addr}": label
                for (scu, addr), label in MODULE_LABEL_OVERRIDES.items()
            }
        }

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

    # ------------------------------------------------------------------
    # Setup / Settings (2026-02-11 operator ask -- "starting point"
    # wizard for a fresh install).  See elc.config.project for the
    # JSON schema and elc.util.astro for sunrise/sunset compute.
    # ------------------------------------------------------------------
    from elc.config.project import (
        ProjectConfig,
        DEFAULT_PROJECT_PATH,
        load_project,
        save_project,
        is_configured,
    )
    from elc.util.astro import sun_times_for
    from fastapi import HTTPException
    from fastapi.responses import RedirectResponse

    @stack.app.get("/api/elc/project", include_in_schema=False)
    async def get_project() -> dict:
        """Return the current ``configs/project.json`` or {} when absent."""
        cfg = load_project(DEFAULT_PROJECT_PATH)
        return {
            "configured": is_configured(DEFAULT_PROJECT_PATH),
            "path": str(DEFAULT_PROJECT_PATH),
            "project": cfg.model_dump() if cfg else None,
        }

    @stack.app.post("/api/elc/project", include_in_schema=False)
    async def post_project(body: dict) -> dict:
        """Validate + persist ``configs/project.json``.  Backs up the
        previous file to ``project.json.bak`` before writing.  The
        client (Settings page) should call
        ``/api/elc/project/expand-devices`` afterwards to hot-reload
        the running demo's device inventory.

        Side-effect (2026-02-11): every unique ``module.floor`` strand
        label the operator typed materialises as a real floor row via
        :func:`get_or_create_floor_by_strand`, so the Building page
        can render slabs without the operator having to click any
        "+ Floor" button.
        """
        try:
            cfg = ProjectConfig.model_validate(body)
        except Exception as e:  # noqa: BLE001
            raise HTTPException(status_code=400, detail=f"invalid project.json: {e}")
        save_project(cfg, DEFAULT_PROJECT_PATH)
        # Auto-create any missing floors so the Building page has
        # something to render.  Existing floors are left untouched;
        # a strand no longer referenced by any module is NOT
        # auto-deleted (safer -- the operator may still have fixture
        # placements on it).
        from elc.floors.store import get_or_create_floor_by_strand
        created: list[str] = []
        for label in cfg.strand_labels():
            row = get_or_create_floor_by_strand(label)
            if row.get("created_at") == row.get("updated_at"):
                created.append(label)
        return {"ok": True, "path": str(DEFAULT_PROJECT_PATH),
                "floors_created": created}

    @stack.app.post("/api/elc/project/expand-devices", include_in_schema=False)
    async def expand_devices() -> dict:
        """Expand the SCU→module hierarchy in project.json into the
        flat device-id list the running demo uses.  Returns the
        expanded rows; a hot-reload of the driver is a separate
        operator step (restart demo.py) since the SCU link is bound
        at boot.
        """
        cfg = load_project(DEFAULT_PROJECT_PATH)
        if cfg is None:
            raise HTTPException(status_code=404, detail="no project.json yet")
        return {"devices": cfg.to_devices_json(), "scus": len(cfg.scus)}

    @stack.app.get("/api/elc/sun-times", include_in_schema=False)
    async def sun_times(date_iso: str = "") -> dict:
        """Compute today's (or ``date_iso``'s) sunrise/sunset for the
        project's site coordinates.  Falls back to UTC / (0, 0) if
        no project.json exists yet -- useful for the Settings wizard
        preview while the operator is still typing.
        """
        cfg = load_project(DEFAULT_PROJECT_PATH)
        prof = cfg.project if cfg else None
        from datetime import date as date_cls
        on = date_cls.fromisoformat(date_iso) if date_iso else None
        try:
            return sun_times_for(
                latitude=prof.latitude if prof else 0.0,
                longitude=prof.longitude if prof else 0.0,
                tz_name=prof.timezone if prof else "UTC",
                on=on,
                sunrise_offset_min=prof.sunrise_offset_min if prof else 0,
                sunset_offset_min=prof.sunset_offset_min if prof else 0,
            )
        except Exception as e:  # noqa: BLE001
            raise HTTPException(status_code=400, detail=f"sun-times: {e}")

    # ------------------------------------------------------------------
    # Tree view rollup — a single denormalised snapshot the /floor page
    # renders as the collapsible "Tree" strip.  Composes:
    #   * SCUs / modules / relays  (from project.json + live replica)
    #   * Floors                    (from floors store)
    #   * Groups + membership       (from config store)
    #   * Schedules + group links   (from config store)
    #   * Reverse indexes:           relay -> [group,...], floor,
    #                                group -> [schedule,...]
    # Kept as one round-trip (vs. the browser stitching 5 endpoints)
    # so operators see a consistent snapshot; the SSE stream continues
    # to push per-relay state deltas after the initial load.
    # ------------------------------------------------------------------
    @stack.app.get("/api/elc/tree", include_in_schema=False)
    async def tree_view() -> dict:
        from elc.config import store as cfg_store
        from elc.floors import store as floor_store

        cfg = load_project(DEFAULT_PROJECT_PATH)
        project_meta = {
            "name": cfg.project.name if cfg else "(unconfigured)",
            "configured": is_configured(DEFAULT_PROJECT_PATH),
        }

        # ---- SCUs / modules --------------------------------------------
        scus_out: list[dict] = []
        _link_state = getattr(stack.link, "state", None)
        link_online = getattr(_link_state, "value", str(_link_state)) == "connected"
        primary_host = getattr(stack.link, "host", "") or ""
        primary_port = getattr(stack.link, "port", 0) or 0

        # The demo maintains a single ScuLink today; pair it to exactly
        # one SCU in project.json (first host+port match, else the first
        # SCU whose host is blank -- which just means "use whatever the
        # demo booted with", the common case for env-driven setups).
        # Multi-link support (one transport per SCU bus) is future work;
        # until then only the paired SCU reflects link state.
        primary_scu_id: int | None = None
        if cfg:
            for scu in cfg.scus:
                if (scu.host and primary_host
                        and scu.host == primary_host
                        and scu.port == primary_port):
                    primary_scu_id = scu.id
                    break
            if primary_scu_id is None:
                for scu in cfg.scus:
                    if not scu.host:
                        primary_scu_id = scu.id
                        break
            if primary_scu_id is None and cfg.scus:
                primary_scu_id = cfg.scus[0].id
        if cfg:
            for scu in cfg.scus:
                modules_out = []
                for mod in scu.modules:
                    try:
                        channels = channel_count_for(DeviceType[mod.dev_type])
                    except Exception:  # noqa: BLE001
                        channels = 6
                    relays = []
                    for ch in range(1, channels + 1):
                        did = f"{mod.dev_type}/{scu.id}/{mod.address}/{ch}"
                        relays.append({
                            "device_id": did,
                            "scu": scu.id,
                            "dev_type": mod.dev_type,
                            "address": mod.address,
                            "channel": ch,
                        })
                    modules_out.append({
                        "dev_type": mod.dev_type,
                        "address": mod.address,
                        "floor": mod.floor,
                        "note": mod.note,
                        "discovered": bool(mod.discovered),
                        "channels": channels,
                        "relays": relays,
                    })
                # Only the primary SCU (the one build_stack dialled) is
                # considered "online".  Additional buses in project.json
                # are metadata-only until a per-SCU link is wired.
                is_primary = (scu.id == primary_scu_id)
                scus_out.append({
                    "id": scu.id,
                    "name": scu.name,
                    "host": scu.host,
                    "port": scu.port,
                    "online": bool(link_online and is_primary),
                    "primary": is_primary,
                    "modules": modules_out,
                })

        # ---- Floors + fixture -> floor reverse index --------------------
        floors_raw = floor_store.list_floors(db_path=None)
        floors_out = []
        fixture_floor: dict[str, dict] = {}
        for f in floors_raw:
            fixtures = f.get("fixtures", []) or []
            summary = {
                "id": f["id"],
                "name": f["name"],
                "strand_label": f.get("strand_label"),
                "width_m": f.get("width_m"),
                "height_m": f.get("height_m"),
                "fixture_count": len(fixtures),
            }
            floors_out.append(summary)
            for fx in fixtures:
                did = fx.get("device_id")
                if did:
                    fixture_floor[did] = {
                        "id": f["id"], "name": f["name"],
                        "strand_label": f.get("strand_label"),
                    }

        # ---- Groups + reverse index (relay -> groups) -------------------
        groups_raw = cfg_store.list_groups()
        groups_out: list[dict] = []
        relay_groups: dict[str, list[dict]] = {}
        group_schedules_index: dict[str, list[dict]] = {}
        for g in groups_raw:
            detail = cfg_store.get_group(g["id"])
            members = detail.get("members", [])
            scheds = [
                {"id": s["id"], "name": s["name"], "color": s.get("color")}
                for s in detail.get("schedules", [])
            ]
            groups_out.append({
                "id": g["id"],
                "name": g["name"],
                "color": g.get("color"),
                "members": members,
                "schedules": scheds,
            })
            group_schedules_index[g["id"]] = scheds
            for did in members:
                relay_groups.setdefault(did, []).append(
                    {"id": g["id"], "name": g["name"], "color": g.get("color")}
                )

        # ---- Schedules + reverse index (schedule -> groups) -------------
        schedules_raw = cfg_store.list_schedules()
        schedule_groups: dict[str, list[dict]] = {}
        for g in groups_raw:
            for s in group_schedules_index.get(g["id"], []):
                schedule_groups.setdefault(s["id"], []).append(
                    {"id": g["id"], "name": g["name"], "color": g.get("color")}
                )
        schedules_out = []
        for s in schedules_raw:
            schedules_out.append({
                "id": s["id"],
                "name": s["name"],
                "color": s.get("color"),
                "enabled": bool(s.get("enabled", True)),
                "rules": s.get("rules"),
                "groups": schedule_groups.get(s["id"], []),
            })

        # ---- Attach live state + reverse indexes to every relay ---------
        replica_snaps = {
            str(snap.device): snap for snap in stack.replica.all()
        }
        for scu in scus_out:
            for mod in scu["modules"]:
                for relay in mod["relays"]:
                    did = relay["device_id"]
                    snap = replica_snaps.get(did)
                    relay["relay_state"] = (
                        snap.relay_state if snap else None
                    )
                    relay["dim_level"] = (
                        snap.dim_level if snap else None
                    )
                    relay["last_fail_code"] = (
                        snap.last_fail_code if snap else None
                    )
                    relay["groups"] = relay_groups.get(did, [])
                    relay["floor"] = fixture_floor.get(did)

        return {
            "project": project_meta,
            "scus": scus_out,
            "floors": floors_out,
            "groups": groups_out,
            "schedules": schedules_out,
        }

    @stack.app.get("/settings", include_in_schema=False)
    async def settings_page() -> FileResponse:
        """Serve the setup / configuration wizard."""
        return FileResponse(str(demo_dir / "settings.html"))

    # Bootstrap redirect: when the operator lands on /floor with no
    # project.json yet, send them to /settings first.  Deep-link to
    # /floor?force=1 still works so agents/ops can bypass the redirect.
    @stack.app.middleware("http")
    async def _redirect_to_settings_when_bare(request, call_next):
        if request.url.path in ("/", "/floor", "/editor"):
            if not is_configured(DEFAULT_PROJECT_PATH):
                if request.query_params.get("force") != "1":
                    return RedirectResponse(url="/settings", status_code=302)
        return await call_next(request)

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
    # Bind host is configurable via DEMO_HOST so the same script can:
    #   * default to 127.0.0.1 for local dev + same-box nginx proxy
    #   * bind 0.0.0.0 when nginx / a load balancer runs elsewhere
    # See /app/memory/PRD.md §"V3.0 Reverse-proxy rule" for the
    # nginx server block template.
    import uvicorn
    bind_host = os.environ.get("DEMO_HOST", "127.0.0.1")

    config = uvicorn.Config(
        stack.app,
        host=bind_host,
        port=port,
        log_level="warning",
        lifespan="off",
    )
    server = uvicorn.Server(config)

    p = f"{port}"
    # In physical mode there's no MockScuServer (scu is None); the SCU
    # line is replaced with the real host:port for operator sanity.
    if scu is not None:
        scu_line = f"║  Fake SCU        127.0.0.1:{scu.port}  (MockScuServer)"
    else:
        scu_line = f"║  Physical SCU    {scu_host}:{scu_port}"
    banner = f"""
╔══════════════════════════════════════════════════════════════╗
║  Red5-ELC V3.0 · Demo Console                                ║
╠══════════════════════════════════════════════════════════════╣
║  Web console     http://127.0.0.1:{p}/
║  Editor          http://127.0.0.1:{p}/editor
║  Swagger UI      http://127.0.0.1:{p}/docs
║  Link status     http://127.0.0.1:{p}/api/elc/link
║  Device list     http://127.0.0.1:{p}/api/elc/devices
║  Advertised set  http://127.0.0.1:{p}/api/elc/demo-devices
║  Live events     ws://127.0.0.1:{p}/api/elc/events
╠══════════════════════════════════════════════════════════════╣
{scu_line}
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
