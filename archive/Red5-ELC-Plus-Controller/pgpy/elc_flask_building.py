"""
elc_flask_building.py — Phase 3 Flask-native Building page routes.

Wires floors, devices, tree, lighting-elements, and in-memory relay/dim
control for floor.html without uvicorn.  SCU TCP link stays disconnected
until Phase 4; relay/dim/broadcast update the local replica only.
"""
from __future__ import annotations

import asyncio
import logging
import os
from datetime import datetime, timezone
from typing import Any

from flask import Response, jsonify, request

log = logging.getLogger('elc_flask_building')

_no_cache = None
_PROJECT_PATH = None
_DB_PATH: str | None = None

_PHASE3_ROUTES = (
    'GET /api/elc/link',
    'GET /api/elc/devices',
    'GET /api/elc/devices/<id>',
    'POST /api/elc/devices/<id>/relay',
    'POST /api/elc/devices/<id>/dim',
    'POST /api/elc/discover-srms',
    'POST /api/elc/broadcast',
    'GET /api/elc/tree',
    'GET /api/elc/floors',
    'GET /api/elc/floors/<id>',
    'GET /api/elc/floors/<id>/background.svg',
    'POST /api/elc/floors',
    'PATCH /api/elc/floors/<id>',
    'DELETE /api/elc/floors/<id>',
    'POST /api/elc/floors/import-dxf',
    'GET /api/elc/lighting-elements',
    'GET /api/elc/lighting-elements/<id>',
    'PUT /api/elc/lighting-elements/<id>',
    'DELETE /api/elc/lighting-elements/<id>',
    'POST /api/elc/lighting-elements/bulk-assign',
    'GET /api/elc/ambient',
    'GET /api/elc/relay-data',
    'GET /api/elc/module-labels',
    'GET /api/elc/events-sse',
)


def phase3_routes() -> tuple[str, ...]:
    return _PHASE3_ROUTES


class _SyncReplica:
    """In-memory device state for Phase 3 (no SCU wire)."""

    def __init__(self) -> None:
        from elc.domain.replica import DeviceSnapshot
        self._DeviceSnapshot = DeviceSnapshot
        self._by_device: dict = {}

    def _emit(self, event: dict[str, Any]) -> None:
        try:
            import elc_flask_sse
            elc_flask_sse.publish(event)
        except Exception:
            log.exception('SSE publish failed')

    def register(self, device) -> bool:
        if device in self._by_device:
            return False
        snap = self._DeviceSnapshot(device=device)
        self._by_device[device] = snap
        self._emit({
            'type': 'device_registered',
            'device': str(device),
            'ts': snap.last_seen.isoformat() if snap.last_seen else None,
        })
        return True

    def get(self, device):
        return self._by_device.get(device)

    def all(self):
        return sorted(
            self._by_device.values(),
            key=lambda snap: (
                snap.device.scu,
                snap.device.address,
                snap.device.dev_type.name,
                snap.device.sub_address,
            ),
        )

    def set_relay(self, device, state: bool) -> None:
        snap = self._by_device.get(device)
        if snap is None:
            snap = self._DeviceSnapshot(device=device)
            self._by_device[device] = snap
        snap.relay_state = bool(state)
        snap.last_seen = datetime.now(timezone.utc)
        snap.update_count += 1
        self._emit({
            'type': 'relay_state',
            'device': str(device),
            'state': bool(state),
            'ts': snap.last_seen.isoformat(),
        })

    def set_dim(self, device, level: float) -> float:
        level = max(0.0, min(1.0, float(level)))
        snap = self._by_device.get(device)
        if snap is None:
            snap = self._DeviceSnapshot(device=device)
            self._by_device[device] = snap
        snap.dim_level = level
        snap.last_seen = datetime.now(timezone.utc)
        snap.update_count += 1
        self._emit({
            'type': 'dim_level',
            'device': str(device),
            'level': level,
            'mocked': True,
        })
        return level

    def broadcast_srm(self, state: bool) -> int:
        affected = 0
        now = datetime.now(timezone.utc)
        for snap in self._by_device.values():
            if snap.device.dev_type.name.startswith('SRM'):
                snap.relay_state = bool(state)
                snap.last_seen = now
                snap.update_count += 1
                affected += 1
                self._emit({
                    'type': 'relay_state',
                    'device': str(snap.device),
                    'state': bool(state),
                    'ts': now.isoformat(),
                })
        return affected


_REPLICA = _SyncReplica()


def _parse_device_id(s: str):
    from elc.codec.device_id import DeviceId
    try:
        return DeviceId.from_string(s)
    except ValueError as exc:
        raise ValueError(str(exc)) from exc


def _expand_srm_devices(cfg, *, scu_filter: int | None = None) -> list:
    from elc.codec.device_id import DeviceId, DeviceType
    from elc.codec.etlc38 import channel_count_for

    devices = []
    for scu in cfg.scus:
        if scu_filter is not None and scu.id != scu_filter:
            continue
        for mod in scu.modules:
            if not str(mod.dev_type).startswith('SRM'):
                continue
            try:
                dt = DeviceType[mod.dev_type]
                ch_count = channel_count_for(dt)
            except Exception:
                try:
                    dt = DeviceType[mod.dev_type]
                except Exception:
                    continue
                ch_count = getattr(mod, 'channel_count', 6)
            for ch in range(1, ch_count + 1):
                devices.append(DeviceId(
                    dev_type=dt,
                    scu=scu.id,
                    address=mod.address,
                    sub_address=ch,
                ))
    return devices


def _maybe_seed_from_project() -> None:
    if _REPLICA.all():
        return
    if _PROJECT_PATH is None:
        return
    from elc.config.project import load_project
    cfg = load_project(_PROJECT_PATH)
    if cfg is None:
        return
    for dev in _expand_srm_devices(cfg):
        _REPLICA.register(dev)


def _canonicalise_fixtures(floor: dict[str, Any]) -> None:
    from elc.codec.device_id import DeviceId
    for fx in floor.get('fixtures') or []:
        did = fx.get('device_id')
        if not isinstance(did, str):
            continue
        try:
            fx['device_id'] = str(DeviceId.from_string(did))
        except Exception:
            continue


def _map_store_exc(exc: Exception):
    from elc.config.store import BadInput, Conflict, NotFound
    from elc.floors.dxf import DxfImportError
    status = {
        BadInput: 400,
        NotFound: 404,
        Conflict: 409,
        DxfImportError: 400,
    }.get(type(exc))
    if status is None:
        raise exc
    return _no_cache(jsonify({'detail': str(exc)})), status


def _run_async(coro):
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        return asyncio.run(coro)
    import concurrent.futures
    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
        return pool.submit(asyncio.run, coro).result()


def register(app, data_root: str, plugins_root: str, no_cache) -> None:
    """Register Phase 3 Building page routes on the Flask app."""
    global _no_cache, _PROJECT_PATH, _DB_PATH
    _no_cache = no_cache

    import elc_flask_api
    _PROJECT_PATH = elc_flask_api._PROJECT_PATH
    if _PROJECT_PATH is None:
        _PROJECT_PATH = elc_flask_api._wire_paths(data_root, plugins_root)
    _DB_PATH = os.environ.get('ELC_CONFIG_DB_PATH')

    from elc.config.project import is_configured, load_project

    # ---- link / devices ------------------------------------------------
    def get_link():
        cfg = load_project(_PROJECT_PATH)
        host = ''
        port = 0
        if cfg and cfg.scus:
            host = cfg.scus[0].host or ''
            port = cfg.scus[0].port or 0
        return _no_cache(jsonify({
            'name': 'SCU',
            'host': host,
            'port': port,
            'state': 'disconnected',
            'connect_attempts': 0,
        }))

    def list_devices():
        _maybe_seed_from_project()
        return _no_cache(jsonify([s.to_dict() for s in _REPLICA.all()]))

    def get_device(device_id: str):
        try:
            dev = _parse_device_id(device_id)
        except ValueError as exc:
            return _no_cache(jsonify({'detail': str(exc)})), 400
        snap = _REPLICA.get(dev)
        if snap is None:
            return _no_cache(jsonify({
                'detail': f'device {device_id} not seen yet',
            })), 404
        return _no_cache(jsonify(snap.to_dict()))

    def post_relay(device_id: str):
        if device_id.endswith('/relay'):
            device_id = device_id[:-len('/relay')]
        try:
            dev = _parse_device_id(device_id)
        except ValueError as exc:
            return _no_cache(jsonify({'detail': str(exc)})), 400
        body = request.get_json(silent=True) or {}
        state = bool(body.get('state', False))
        _REPLICA.set_relay(dev, state)
        return _no_cache(jsonify({
            'ok': True,
            'device': str(dev),
            'state': state,
            'mocked': True,
        }))

    def post_dim(device_id: str):
        if device_id.endswith('/dim'):
            device_id = device_id[:-len('/dim')]
        try:
            dev = _parse_device_id(device_id)
        except ValueError as exc:
            return _no_cache(jsonify({'detail': str(exc)})), 400
        body = request.get_json(silent=True) or {}
        level = _REPLICA.set_dim(dev, body.get('level', 0.0))
        return _no_cache(jsonify({
            'ok': True,
            'device': str(dev),
            'level': level,
            'mocked': True,
        }))

    def discover_srms():
        scu = int(request.args.get('scu', 0))
        cfg = load_project(_PROJECT_PATH)
        if cfg is None:
            return _no_cache(jsonify({'detail': 'no project.json yet'})), 404
        devices = _expand_srm_devices(cfg, scu_filter=scu)
        registered_now: list[str] = []
        already_known: list[str] = []
        for dev in devices:
            if _REPLICA.register(dev):
                registered_now.append(str(dev))
            else:
                already_known.append(str(dev))
        return _no_cache(jsonify({
            'ok': True,
            'source': 'physical',
            'mode': 'advertised_inventory',
            'family_filter': 'SRM',
            'scu': scu,
            'count': len(devices),
            'registered': registered_now,
            'already_known': already_known,
            'modules_scanned': 0,
        }))

    def post_broadcast():
        body = request.get_json(silent=True) or {}
        state = bool(body.get('state', False))
        affected = _REPLICA.broadcast_srm(state)
        return _no_cache(jsonify({
            'ok': True,
            'broadcast': True,
            'state': state,
            'mode': 'phase3-mock',
            'affected': affected,
            'mocked': True,
        }))

    def get_tree():
        from elc.config import store as cfg_store
        from elc.floors import store as floor_store
        from elc.codec.etlc38 import channel_count_for
        from elc.codec.device_id import DeviceType

        cfg = load_project(_PROJECT_PATH)
        project_meta = {
            'name': cfg.project.name if cfg else '(unconfigured)',
            'configured': is_configured(_PROJECT_PATH),
        }
        scus_out = []
        primary_scu_id = None
        if cfg and cfg.scus:
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
                scus_out.append({
                    'id': scu.id,
                    'name': scu.name,
                    'host': scu.host,
                    'port': scu.port,
                    'online': False,
                    'primary': scu.id == primary_scu_id,
                    'modules': modules_out,
                })
        floors_raw = floor_store.list_floors(db_path=_DB_PATH)
        floors_out = [{
            'id': f['id'],
            'name': f['name'],
            'strand_label': f.get('strand_label'),
            'fixture_count': len(f.get('fixtures') or []),
        } for f in floors_raw]
        groups_raw = cfg_store.list_groups(db_path=_DB_PATH)
        schedules_raw = cfg_store.list_schedules(db_path=_DB_PATH)
        replica_snaps = {str(s.device): s for s in _REPLICA.all()}
        for scu in scus_out:
            for mod in scu['modules']:
                for relay in mod['relays']:
                    snap = replica_snaps.get(relay['device_id'])
                    relay['relay_state'] = snap.relay_state if snap else None
                    relay['dim_level'] = snap.dim_level if snap else None
        return _no_cache(jsonify({
            'project': project_meta,
            'scus': scus_out,
            'floors': floors_out,
            'groups': [{'id': g['id'], 'name': g['name']} for g in groups_raw],
            'schedules': [{'id': s['id'], 'name': s['name']} for s in schedules_raw],
        }))

    # ---- floors --------------------------------------------------------
    def list_floors():
        from elc.floors import store
        return _no_cache(jsonify({'floors': store.list_floors(db_path=_DB_PATH)}))

    def get_floor(fid: str):
        from elc.floors import store
        try:
            f = store.get_floor(fid, db_path=_DB_PATH)
        except Exception as exc:
            return _map_store_exc(exc)
        _canonicalise_fixtures(f)
        return _no_cache(jsonify(f))

    def get_floor_svg(fid: str):
        from elc.floors import store
        try:
            f = store.get_floor(fid, db_path=_DB_PATH)
        except Exception as exc:
            return _map_store_exc(exc)
        return Response(
            f['svg'],
            mimetype='image/svg+xml',
            headers={'Cache-Control': 'no-store'},
        )

    def create_floor():
        from elc.floors import store
        body = request.get_json(silent=True) or {}
        try:
            row = store.create_floor(
                name=body.get('name', ''),
                svg=body.get('svg', ''),
                width_m=float(body.get('width_m', 20.0)),
                height_m=float(body.get('height_m', 15.0)),
                fixtures=body.get('fixtures'),
                rooms=body.get('rooms'),
                windows=body.get('windows'),
                slab=body.get('slab'),
                strand_label=body.get('strand_label'),
                db_path=_DB_PATH,
            )
        except Exception as exc:
            return _map_store_exc(exc)
        return _no_cache(jsonify(row)), 201

    def patch_floor(fid: str):
        from elc.floors import store
        body = request.get_json(silent=True) or {}
        try:
            row = store.update_floor(
                fid,
                name=body.get('name'),
                svg=body.get('svg'),
                width_m=body.get('width_m'),
                height_m=body.get('height_m'),
                fixtures=body.get('fixtures'),
                rooms=body.get('rooms'),
                windows=body.get('windows'),
                ceiling_height_m=body.get('ceiling_height_m'),
                slab=body.get('slab'),
                strand_label=body.get('strand_label'),
                db_path=_DB_PATH,
            )
        except Exception as exc:
            return _map_store_exc(exc)
        return _no_cache(jsonify(row))

    def delete_floor(fid: str):
        from elc.floors import store
        try:
            store.delete_floor(fid, db_path=_DB_PATH)
        except Exception as exc:
            return _map_store_exc(exc)
        return Response(status=204)

    def import_dxf():
        from elc.floors import store
        from elc.floors.dxf import DxfImportError, dxf_to_svg
        name = (request.form.get('name') or '').strip()
        strand_label = request.form.get('strand_label')
        upload = request.files.get('dxf')
        if not name:
            return _no_cache(jsonify({'detail': 'name is required'})), 400
        if upload is None:
            return _no_cache(jsonify({'detail': 'dxf file is required'})), 400
        blob = upload.read()
        try:
            conv = dxf_to_svg(blob)
        except DxfImportError as exc:
            return _no_cache(jsonify({'detail': str(exc)})), 400
        except ImportError as exc:
            return _no_cache(jsonify({
                'detail': f'DXF import failed: {exc}',
            })), 503
        except Exception as exc:
            return _no_cache(jsonify({'detail': str(exc)})), 400
        try:
            floor = store.create_floor(
                name=name,
                svg=conv.svg,
                width_m=conv.width_m,
                height_m=conv.height_m,
                rooms=conv.rooms,
                windows=conv.windows,
                slab=conv.slab,
                strand_label=strand_label or store.next_strand_label(_DB_PATH),
                db_path=_DB_PATH,
            )
        except Exception as exc:
            return _map_store_exc(exc)
        return _no_cache(jsonify(floor)), 201

    # ---- lighting elements ---------------------------------------------
    def list_lighting_elements():
        from elc.floors import lighting
        return _no_cache(jsonify({
            'elements': lighting.list_elements(db_path=_DB_PATH),
        }))

    def get_lighting_element(device_id: str):
        from elc.floors import lighting
        try:
            return _no_cache(jsonify(
                lighting.get_element(device_id, db_path=_DB_PATH),
            ))
        except Exception as exc:
            return _map_store_exc(exc)

    def put_lighting_element(device_id: str):
        from elc.floors import lighting
        body = request.get_json(silent=True) or {}
        try:
            row = lighting.upsert_element(
                device_id,
                type=body.get('type', ''),
                max_lux=float(body.get('max_lux', 500)),
                beam_radius_m=float(body.get('beam_radius_m', 4.0)),
                cct_k=int(body.get('cct_k', 4000)),
                shape=str(body.get('shape', 'point')),
                tube_type=str(body.get('tube_type', 'none')),
                db_path=_DB_PATH,
            )
        except Exception as exc:
            return _map_store_exc(exc)
        return _no_cache(jsonify(row))

    def delete_lighting_element(device_id: str):
        from elc.floors import lighting
        try:
            lighting.delete_element(device_id, db_path=_DB_PATH)
        except Exception as exc:
            return _map_store_exc(exc)
        return Response(status=204)

    def bulk_assign_lighting():
        from elc.floors import lighting
        body = request.get_json(silent=True) or {}
        try:
            elements = lighting.bulk_assign(
                body.get('device_ids') or [],
                type=body.get('type', ''),
                db_path=_DB_PATH,
            )
        except Exception as exc:
            return _map_store_exc(exc)
        return _no_cache(jsonify({'elements': elements}))

    # ---- ambient / diagnostics -----------------------------------------
    def get_ambient():
        from datetime import datetime as dt_cls
        from elc.config.project import load_project
        at_raw = (request.args.get('at') or '').strip()
        cfg = load_project(_PROJECT_PATH)
        prof = cfg.project if cfg else None
        lat = float(prof.latitude) if prof else 0.0
        lon = float(prof.longitude) if prof else 0.0
        ts_dt = None
        if at_raw:
            try:
                ts_dt = dt_cls.fromisoformat(at_raw.replace('Z', '+00:00'))
            except Exception as exc:
                return _no_cache(jsonify({'detail': f'bad ISO ts: {exc}'})), 400
        try:
            from elc.weather import compute_ambient
            payload = _run_async(compute_ambient(lat, lon, ts_dt))
        except ImportError as exc:
            return _no_cache(jsonify({
                'detail': f'ambient unavailable: {exc}',
            })), 503
        except Exception as exc:
            return _no_cache(jsonify({'detail': f'ambient: {exc}'})), 502
        return _no_cache(jsonify(payload))

    def get_relay_data():
        return _no_cache(jsonify({
            'detail': 'relay-data requires SCU link (Phase 3 — not connected)',
        })), 503

    def get_module_labels():
        return _no_cache(jsonify({'overrides': {}}))

    # ---- register (specific routes before greedy paths) ------------------
    app.add_url_rule('/api/elc/link', 'elc_get_link', get_link, methods=['GET'])
    app.add_url_rule('/api/elc/devices', 'elc_list_devices',
                     list_devices, methods=['GET'])
    app.add_url_rule('/api/elc/discover-srms', 'elc_discover_srms',
                     discover_srms, methods=['POST'])
    app.add_url_rule('/api/elc/broadcast', 'elc_broadcast',
                     post_broadcast, methods=['POST'])
    app.add_url_rule('/api/elc/tree', 'elc_tree', get_tree, methods=['GET'])
    app.add_url_rule('/api/elc/ambient', 'elc_ambient', get_ambient, methods=['GET'])
    app.add_url_rule('/api/elc/relay-data', 'elc_relay_data',
                     get_relay_data, methods=['GET'])
    app.add_url_rule('/api/elc/module-labels', 'elc_module_labels',
                     get_module_labels, methods=['GET'])

    app.add_url_rule('/api/elc/floors', 'elc_list_floors',
                     list_floors, methods=['GET'])
    app.add_url_rule('/api/elc/floors/import-dxf', 'elc_import_dxf',
                     import_dxf, methods=['POST'])
    app.add_url_rule('/api/elc/floors', 'elc_create_floor',
                     create_floor, methods=['POST'])
    app.add_url_rule('/api/elc/floors/<fid>/background.svg', 'elc_floor_svg',
                     get_floor_svg, methods=['GET'])
    app.add_url_rule('/api/elc/floors/<fid>', 'elc_get_floor',
                     get_floor, methods=['GET'])
    app.add_url_rule('/api/elc/floors/<fid>', 'elc_patch_floor',
                     patch_floor, methods=['PATCH'])
    app.add_url_rule('/api/elc/floors/<fid>', 'elc_delete_floor',
                     delete_floor, methods=['DELETE'])

    app.add_url_rule('/api/elc/lighting-elements', 'elc_list_lighting',
                     list_lighting_elements, methods=['GET'])
    app.add_url_rule('/api/elc/lighting-elements/bulk-assign',
                     'elc_bulk_assign_lighting',
                     bulk_assign_lighting, methods=['POST'])
    app.add_url_rule('/api/elc/lighting-elements/<path:device_id>',
                     'elc_get_lighting', get_lighting_element, methods=['GET'])
    app.add_url_rule('/api/elc/lighting-elements/<path:device_id>',
                     'elc_put_lighting', put_lighting_element, methods=['PUT'])
    app.add_url_rule('/api/elc/lighting-elements/<path:device_id>',
                     'elc_delete_lighting', delete_lighting_element,
                     methods=['DELETE'])

    app.add_url_rule('/api/elc/devices/<path:device_id>/relay',
                     'elc_post_relay', post_relay, methods=['POST'])
    app.add_url_rule('/api/elc/devices/<path:device_id>/dim',
                     'elc_post_dim', post_dim, methods=['POST'])
    app.add_url_rule('/api/elc/devices/<path:device_id>',
                     'elc_get_device', get_device, methods=['GET'])

    log.info('Phase 3 Flask Building API registered (%d routes)',
             len(_PHASE3_ROUTES))
