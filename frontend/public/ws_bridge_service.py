"""WebSocket bridge — listens on host:port, pushes telemetry deltas every
publish_interval_s, and accepts inbound writes via JSON messages.  Lazy
imports `websockets` (asyncio).

Inbound message format:
    {"cmd": "write", "object_id": "AV1", "value": 22.5}

Inbound writes are gated by write_allowlist (default empty = read-only).

Config keys (under "websocket"):
    enabled            bool
    host               bind address
    port               TCP port
    write_allowlist    list of object_ids that inbound writes may target

Status:
    GET /api/bridges/status returns connect count + push count.
"""
import json
import time
import threading
import asyncio

from _bridges_lib import (
    load_bridges_config, snapshot_telemetry,
    enqueue_write, register_bridge_status, bridge_log,
)

_NAME = 'websocket'
_thread = None
_stop_evt = threading.Event()
_clients = set()        # active WebSocket connections
_status = {'state': 'idle', 'enabled': False, 'lib_available': None,
           'connections_total': 0, 'clients_now': 0, 'push_count': 0,
           'last_push_ts': 0, 'last_error': None}


def _try_import_websockets():
    try:
        import websockets  # noqa: F401
        _status['lib_available'] = True
        return websockets
    except ImportError as e:
        _status['lib_available'] = False
        _status['last_error'] = 'websockets not installed: pip install websockets'
        bridge_log(_NAME, 'websockets missing: ' + str(e))
        return None


def _run():
    ws_mod = _try_import_websockets()
    cfg    = load_bridges_config().get(_NAME, {})
    if not cfg.get('enabled') or ws_mod is None:
        _status['state'] = 'disabled'
        return

    async def _handle(websocket):
        # On open: bump counters.
        _clients.add(websocket)
        _status['connections_total'] += 1
        _status['clients_now']        = len(_clients)
        try:
            async for raw in websocket:
                # Inbound writes — JSON-decoded, ACL-gated.
                try:
                    msg = json.loads(raw)
                except (TypeError, ValueError):
                    continue
                if not isinstance(msg, dict) or msg.get('cmd') != 'write':
                    continue
                _cfg = load_bridges_config().get(_NAME, {})
                ok, info = enqueue_write(msg.get('object_id'), msg.get('value'),
                                         _NAME, _cfg.get('write_allowlist') or [])
                try:
                    await websocket.send(json.dumps({'ok': ok, 'info': info}))
                except Exception:
                    break
        except Exception as e:
            _status['last_error'] = 'handler: ' + str(e)
        finally:
            _clients.discard(websocket)
            _status['clients_now'] = len(_clients)

    async def _push_loop():
        while not _stop_evt.is_set():
            cfg2 = load_bridges_config().get(_NAME, {})
            if not cfg2.get('enabled'):
                await asyncio.sleep(2)
                continue
            snap, _ = snapshot_telemetry()
            if snap is not None and _clients:
                payload = json.dumps({'ts': time.time(), 'telemetry': snap})
                dead = []
                for ws in list(_clients):
                    try:
                        await ws.send(payload)
                    except Exception:
                        dead.append(ws)
                for ws in dead:
                    _clients.discard(ws)
                _status['push_count']  += 1
                _status['last_push_ts'] = time.time()
            _status['clients_now'] = len(_clients)
            await asyncio.sleep(max(2, int(cfg2.get('publish_interval_s', 5))))

    async def _main():
        host = cfg.get('host', '0.0.0.0')
        port = int(cfg.get('port', 5021))
        bridge_log(_NAME, 'starting WS server on %s:%d' % (host, port))
        try:
            srv = await ws_mod.serve(_handle, host, port)
        except Exception as e:
            _status['last_error'] = 'serve: ' + str(e)
            _status['state']      = 'error'
            return
        _status['state']   = 'running'
        _status['enabled'] = True
        push_task = asyncio.create_task(_push_loop())
        try:
            while not _stop_evt.is_set():
                await asyncio.sleep(1)
        finally:
            push_task.cancel()
            srv.close()

    try:
        asyncio.run(_main())
    except Exception as e:
        _status['last_error'] = 'asyncio: ' + str(e)
    _status['state'] = 'stopped'


def get_status():
    return dict(_status)


def register(app, ctx):
    register_bridge_status(_NAME, get_status)
    global _thread
    if _thread is None or not _thread.is_alive():
        _stop_evt.clear()
        _thread = threading.Thread(target=_run, name='bridge-ws', daemon=True)
        _thread.start()
        bridge_log(_NAME, 'started')
