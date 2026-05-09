"""HTTP webhook bridge — POSTs telemetry JSON to a configured URL on every
publish_interval_s tick.  Stdlib-only (urllib), no extra deps.

Config keys (under "webhook" in /root/data/configs/bridges.json):
    enabled              bool
    url                  full https:// or http:// URL
    bearer_token         optional Authorization header
    publish_interval_s   seconds between posts (>=5)
    timeout_s            request timeout (>=1)

Status:
    GET /api/bridges/status returns this bridge's last-publish result.
"""
import os
import json
import time
import threading
from urllib import request as urlreq
from urllib.error import URLError

from _bridges_lib import (
    load_bridges_config, snapshot_telemetry,
    register_bridge_status, bridge_log,
)

_NAME = 'webhook'
_thread = None
_stop_evt = threading.Event()
_status = {'state': 'idle', 'enabled': False, 'last_publish_ts': 0,
           'last_status_code': None, 'last_error': None,
           'publish_count': 0, 'error_count': 0}


def _publish_once(cfg):
    snap, mtime = snapshot_telemetry()
    if snap is None:
        _status['last_error'] = 'telemetry.json not readable yet'
        _status['error_count'] += 1
        return
    body = json.dumps({'ts': time.time(), 'controller': 'red5', 'telemetry': snap}).encode('utf-8')
    headers = {'Content-Type': 'application/json'}
    if cfg.get('bearer_token'):
        headers['Authorization'] = 'Bearer ' + str(cfg['bearer_token'])
    req = urlreq.Request(cfg['url'], data=body, headers=headers, method='POST')
    try:
        with urlreq.urlopen(req, timeout=max(1, int(cfg.get('timeout_s', 5)))) as resp:
            _status['last_status_code'] = resp.status
            _status['last_publish_ts']  = time.time()
            _status['publish_count']   += 1
            _status['last_error']       = None
    except URLError as e:
        _status['last_error'] = str(e)
        _status['error_count'] += 1
        bridge_log(_NAME, 'POST failed: ' + str(e))
    except Exception as e:
        _status['last_error'] = str(e)
        _status['error_count'] += 1


def _run():
    while not _stop_evt.is_set():
        cfg = load_bridges_config().get(_NAME, {})
        if not cfg.get('enabled') or not cfg.get('url'):
            _status['state'] = 'disabled'
            _stop_evt.wait(5)
            continue
        _status['state'] = 'running'
        _status['enabled'] = True
        _publish_once(cfg)
        interval = max(5, int(cfg.get('publish_interval_s', 30)))
        _stop_evt.wait(interval)
    _status['state'] = 'stopped'


def get_status():
    return dict(_status)


def register(app, ctx):
    register_bridge_status(_NAME, get_status)
    global _thread
    if _thread is None or not _thread.is_alive():
        _stop_evt.clear()
        _thread = threading.Thread(target=_run, name='bridge-webhook', daemon=True)
        _thread.start()
        bridge_log(_NAME, 'started')
