"""
elc_runtime.py — in-process FastAPI stack for the Red5-ELC controller.
=======================================================================
Started by elc_service.py on a background thread (uvicorn on 127.0.0.1).
Flask proxies /api/elc/* to this internal server.
"""
from __future__ import annotations

import asyncio
import json
import logging
import os
import sys
from pathlib import Path

log = logging.getLogger('elc_runtime')

_DEFAULT_PORT = 18990


def _data_root() -> str:
    return os.environ.get('RED5_DATA_ROOT', '/root/data')


def _config_dir() -> str:
    return os.path.join(_data_root(), 'configs')


def _ensure_paths(plugins_root: str) -> None:
    if plugins_root not in sys.path:
        sys.path.insert(0, plugins_root)
    os.environ.setdefault('ELC_CONFIG_DB_PATH',
                          os.path.join(_config_dir(), 'elc_config.db'))
    os.environ.setdefault('ELC_PROJECT_PATH',
                          os.path.join(_config_dir(), 'project.json'))


def _load_demo_devices() -> list:
    from elc.codec.device_id import DeviceId, DeviceType
    from elc.codec.etlc38 import channel_count_for

    sample = Path(_config_dir()) / 'samples' / 'scu-6e6s4s.json'
    if sample.is_file():
        rows = json.loads(sample.read_text(encoding='utf-8'))
    else:
        rows = [
            {'dev_type': 'SRM_6E', 'scu': 1, 'address': 10, 'sub_address': 1},
            {'dev_type': 'SRM_6S', 'scu': 1, 'address': 11, 'sub_address': 1},
        ]
    devices = []
    for row in rows:
        dt = DeviceType[row['dev_type']]
        ch = channel_count_for(dt)
        for sub in range(1, ch + 1):
            devices.append(DeviceId(
                dev_type=dt,
                scu=int(row['scu']),
                address=int(row['address']),
                sub_address=sub,
            ))
    return devices


def _attach_controller_routes(stack, project_path: Path) -> None:
    """Routes that demo.py adds beyond the core FastAPI routers."""
    from fastapi import HTTPException
    from fastapi.responses import FileResponse, RedirectResponse

    from elc.config.project import (
        ProjectConfig,
        is_configured,
        load_project,
        save_project,
    )
    from elc.scheduling.astro import sun_times_for
    from elc.weather import compute_ambient

    @stack.app.get('/api/elc/project', include_in_schema=False)
    async def get_project():
        cfg = load_project(project_path)
        if cfg is None:
            raise HTTPException(status_code=404, detail='no project.json')
        return cfg.model_dump()

    @stack.app.post('/api/elc/project', include_in_schema=False)
    async def post_project(body: dict):
        try:
            cfg = ProjectConfig.model_validate(body)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f'invalid project.json: {e}')
        save_project(cfg, project_path)
        from elc.floors.store import get_or_create_floor_by_strand
        created = []
        for label in cfg.strand_labels():
            row = get_or_create_floor_by_strand(label)
            if row.get('created_at') == row.get('updated_at'):
                created.append(label)
        return {'ok': True, 'path': str(project_path), 'floors_created': created}

    @stack.app.get('/api/elc/ambient', include_in_schema=False)
    async def ambient(at: str = ''):
        from datetime import datetime as _dt
        cfg = load_project(project_path)
        prof = cfg.project if cfg else None
        lat = float(prof.latitude) if prof else 0.0
        lon = float(prof.longitude) if prof else 0.0
        ts_dt = None
        if at:
            try:
                ts_dt = _dt.fromisoformat(at.replace('Z', '+00:00'))
            except Exception as e:
                raise HTTPException(status_code=400, detail=f'bad ISO ts: {e}')
        try:
            return await compute_ambient(lat, lon, ts_dt)
        except Exception as e:
            raise HTTPException(status_code=502, detail=f'ambient: {e}')

    @stack.app.get('/api/elc/tree', include_in_schema=False)
    async def tree_view():
        from elc.config import store as cfg_store
        from elc.floors import store as floor_store
        from elc.codec.etlc38 import channel_count_for
        from elc.codec.device_id import DeviceType

        cfg = load_project(project_path)
        project_meta = {
            'name': cfg.project.name if cfg else '(unconfigured)',
            'configured': is_configured(project_path),
        }
        scus_out = []
        link_online = getattr(getattr(stack.link, 'state', None), 'value', '') == 'connected'
        primary_host = getattr(stack.link, 'host', '') or ''
        primary_port = getattr(stack.link, 'port', 0) or 0
        primary_scu_id = None
        if cfg:
            for scu in cfg.scus:
                if scu.host and primary_host and scu.host == primary_host and scu.port == primary_port:
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
                    except Exception:
                        channels = 6
                    relays = []
                    for ch in range(1, channels + 1):
                        did = f'{mod.dev_type}/{scu.id}/{mod.address}/{ch}'
                        relays.append({
                            'device_id': did,
                            'scu': scu.id,
                            'dev_type': mod.dev_type,
                            'address': mod.address,
                            'channel': ch,
                        })
                    modules_out.append({
                        'dev_type': mod.dev_type,
                        'address': mod.address,
                        'floor': mod.floor,
                        'note': mod.note,
                        'discovered': bool(mod.discovered),
                        'channels': channels,
                        'relays': relays,
                    })
                is_primary = scu.id == primary_scu_id
                scus_out.append({
                    'id': scu.id,
                    'name': scu.name,
                    'host': scu.host,
                    'port': scu.port,
                    'online': bool(link_online and is_primary),
                    'primary': is_primary,
                    'modules': modules_out,
                })
        floors_raw = floor_store.list_floors(db_path=None)
        floors_out = [{'id': f['id'], 'name': f['name'],
                       'strand_label': f.get('strand_label'),
                       'fixture_count': len(f.get('fixtures') or [])} for f in floors_raw]
        groups_raw = cfg_store.list_groups()
        schedules_raw = cfg_store.list_schedules()
        replica_snaps = {str(s.device): s for s in stack.replica.all()}
        for scu in scus_out:
            for mod in scu['modules']:
                for relay in mod['relays']:
                    snap = replica_snaps.get(relay['device_id'])
                    relay['relay_state'] = snap.relay_state if snap else None
                    relay['dim_level'] = snap.dim_level if snap else None
        return {
            'project': project_meta,
            'scus': scus_out,
            'floors': floors_out,
            'groups': [{'id': g['id'], 'name': g['name']} for g in groups_raw],
            'schedules': [{'id': s['id'], 'name': s['name']} for s in schedules_raw],
        }

    @stack.app.middleware('http')
    async def redirect_bare(request, call_next):
        if request.url.path in ('/floor', '/editor') and not is_configured(project_path):
            if request.query_params.get('force') != '1':
                return RedirectResponse(url='/settings', status_code=302)
        return await call_next(request)


async def run_stack(plugins_root: str, port: int = _DEFAULT_PORT) -> None:
    _ensure_paths(plugins_root)
    from elc.api import build_stack
    from elc.codec import encode
    from elc.codec.device_id import ADDR_BITS, SUBADDR_BITS, DeviceId
    from elc.codec.messages import BroadcastComplete, RelaySet, RelayState
    from elc.codec.registry import default_registry
    from elc.config.project import load_project
    from mock_scu import MockScuServer

    source = os.environ.get('ELC_DATA_SOURCE', 'physical').strip().lower()
    if source not in {'mock', 'physical'}:
        source = 'physical'

    demo_devices = _load_demo_devices()
    scu = None
    project_path = Path(os.environ['ELC_PROJECT_PATH'])

    if source == 'mock':
        scu = MockScuServer()
        await scu.start()
        scu_host, scu_port = '127.0.0.1', scu.port
        state = {d: False for d in demo_devices}
        wildcard_addr = (1 << ADDR_BITS) - 1
        wildcard_sub = (1 << SUBADDR_BITS) - 1

        async def echo_relay(frame, writer):
            if frame.msg_type != RelaySet.FLAG:
                return
            cmd = RelaySet.decode(frame.payload)
            if (cmd.device.address == wildcard_addr
                    and cmd.device.sub_address == wildcard_sub):
                affected = 0
                for d in list(state.keys()):
                    if int(d.dev_type) == int(cmd.device.dev_type) and d.scu == cmd.device.scu:
                        state[d] = cmd.state
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
            state[cmd.device] = cmd.state
            reply = default_registry.encode_message(
                RelayState(device=cmd.device, state=cmd.state)
            )
            writer.write(encode(reply))
            await writer.drain()

        scu.on_frame(echo_relay)
    else:
        cfg = load_project(project_path)
        scu_host = os.environ.get('ELC_SCU_HOST') or (cfg.scus[0].host if cfg and cfg.scus else '192.168.1.222')
        scu_port = int(os.environ.get('ELC_SCU_PORT') or (cfg.scus[0].port if cfg and cfg.scus else 9760))

    config_db = os.environ['ELC_CONFIG_DB_PATH']
    stack = build_stack(
        scu_host, scu_port, name='elc-controller',
        config_db_path=config_db,
        demo_devices=demo_devices,
        data_source=source,
    )
    _attach_controller_routes(stack, project_path)

    await stack.link.start()
    try:
        await stack.link.wait_connected(timeout=15.0 if source == 'physical' else 3.0)
    except asyncio.TimeoutError:
        log.warning('ScuLink not connected at boot — UI will retry')

    import uvicorn
    bind = os.environ.get('ELC_INTERNAL_HOST', '127.0.0.1')
    config = uvicorn.Config(stack.app, host=bind, port=port,
                            log_level='warning', lifespan='off')
    server = uvicorn.Server(config)
    log.info('ELC internal API http://%s:%d', bind, port)
    try:
        await server.serve()
    finally:
        await stack.link.stop()
        if scu is not None:
            await scu.stop()


def main() -> None:
    plugins_root = os.environ.get('RED5_PLUGINS_ROOT', '/root/data/pgpy')
    port = int(os.environ.get('ELC_INTERNAL_PORT', str(_DEFAULT_PORT)))
    logging.basicConfig(level=logging.INFO)
    asyncio.run(run_stack(plugins_root, port))


if __name__ == '__main__':
    main()
