"""Shared helpers for AHU data bridges (MQTT / Webhook / Modbus / WebSocket).

Loaded by each `*_bridge_service.py` plug-in via:
    from _bridges_lib import (
        load_bridges_config, save_bridges_config,
        snapshot_telemetry, enqueue_write, register_bridge_status,
        bridge_log,
    )

Underscore prefix in filename keeps the auto-discovery loader (looks for
`*_service.py`) from trying to call register() on this module.
"""
import os
import json
import time
import threading

# ---------------------------------------------------------------- paths --
DATA_ROOT     = '/root/data'
CONFIGS_DIR   = os.path.join(DATA_ROOT, 'configs')
BRIDGES_CONF  = os.path.join(CONFIGS_DIR, 'bridges.json')
# Must match collector.py / telemetry_service.py (configs/, not data root).
TELEMETRY_F   = os.path.join(CONFIGS_DIR, 'telemetry.json')
WRITE_QUEUE_F = os.path.join(CONFIGS_DIR, 'write_queue.json')
LOG_F         = os.path.join(DATA_ROOT, 'bridges.log')

_DEFAULT_CONFIG = {
    'mqtt':      {'enabled': False, 'broker_host': 'localhost', 'broker_port': 1883,
                  'tls': False, 'username': '', 'password': '',
                  'topic_prefix': 'controller/red5', 'publish_interval_s': 30,
                  'qos': 1, 'write_allowlist': []},
    'webhook':   {'enabled': False, 'url': '', 'bearer_token': '',
                  'publish_interval_s': 30, 'timeout_s': 5},
    'modbus':    {'enabled': False, 'host': '0.0.0.0', 'port': 5020, 'unit_id': 1},
    'websocket': {'enabled': False, 'host': '0.0.0.0', 'port': 5021,
                  'write_allowlist': []},
}

# Each bridge calls register_bridge_status('mqtt', lambda: {...}) on register()
# so the admin endpoint can render a live picture of all four.
_status_callbacks = {}
_status_lock      = threading.Lock()


# --------------------------------------------------------- bridge config --
def load_bridges_config():
    """Read /root/data/configs/bridges.json, falling back to defaults for any
    missing keys.  Returns a {bridge_name: settings} dict."""
    try:
        with open(BRIDGES_CONF, 'r') as f:
            on_disk = json.load(f)
    except (OSError, ValueError):
        on_disk = {}
    # Merge per-bridge — preserves operator's overrides while filling in any
    # new defaults a future release adds.
    merged = {}
    for k, defaults in _DEFAULT_CONFIG.items():
        merged[k] = dict(defaults)
        if isinstance(on_disk.get(k), dict):
            merged[k].update(on_disk[k])
    return merged


def save_bridges_config(cfg):
    """Write /root/data/configs/bridges.json atomically (tmp+rename).
    Validates that each bridge dict has ONLY known keys to prevent
    config-key sprawl from a malicious client."""
    if not isinstance(cfg, dict):
        raise ValueError('config must be a dict')
    cleaned = {}
    for k, defaults in _DEFAULT_CONFIG.items():
        merged = dict(defaults)
        section = cfg.get(k, {})
        if not isinstance(section, dict):
            section = {}
        for sk, sv in section.items():
            if sk in defaults:
                merged[sk] = sv
        cleaned[k] = merged
    os.makedirs(CONFIGS_DIR, exist_ok=True)
    tmp = BRIDGES_CONF + '.tmp'
    with open(tmp, 'w') as f:
        json.dump(cleaned, f, indent=2)
    os.replace(tmp, BRIDGES_CONF)
    return cleaned


# --------------------------------------------------------- telemetry tap --
def snapshot_telemetry():
    """Returns the most recent telemetry snapshot collector.py wrote to
    /root/data/configs/telemetry.json, plus its mtime so a bridge can decide
    whether anything has changed since its last publish.  Returns (None, 0)
    if the file isn't readable yet."""
    try:
        st = os.stat(TELEMETRY_F)
        with open(TELEMETRY_F, 'r') as f:
            return json.load(f), st.st_mtime
    except (OSError, ValueError):
        return None, 0


# ----------------------------------------------- write-queue with ACL --
def enqueue_write(object_id, value, bridge_name, allowlist):
    """Append a BACnet write request to write_queue.json.  Refuses if the
    target object_id is not in the bridge's write_allowlist (operator
    explicitly opts in per object).  Empty allowlist = read-only.

    Queue entry shape matches collector.process_write_queue /
    POST /api/write-point: {csv_object, csv_value, ...}.  object_id is the
    BACnet ObjectID (e.g. CSV1, AV23); value becomes Present_Value.

    Returns (ok: bool, msg: str).  collector.py drains the queue on its
    next BACnet cycle.
    """
    if not isinstance(object_id, str) or not object_id:
        return False, 'invalid object_id'
    if not isinstance(allowlist, (list, tuple)):
        allowlist = []
    if object_id not in allowlist:
        return False, ('object_id %r not in %s.write_allowlist (read-only by default)'
                       % (object_id, bridge_name))
    try:
        try:
            with open(WRITE_QUEUE_F, 'r') as f:
                q = json.load(f)
        except (OSError, ValueError):
            q = []
        if not isinstance(q, list):
            q = []
        csv_value = value if isinstance(value, str) else str(value)
        q.append({
            'id':         '%d-%s' % (int(time.time() * 1000), bridge_name),
            'ts':         time.time(),
            'csv_object': object_id,
            'csv_value':  csv_value,
            'equip_name': '',
            'writes':     {object_id: value},
            'source':     'bridge:' + bridge_name,
            # Legacy aliases kept for older tests / log greps
            'object_id':  object_id,
            'value':      value,
        })
        os.makedirs(CONFIGS_DIR, exist_ok=True)
        tmp = WRITE_QUEUE_F + '.tmp'
        with open(tmp, 'w') as f:
            json.dump(q, f)
        os.replace(tmp, WRITE_QUEUE_F)
        return True, 'enqueued'
    except Exception as e:
        return False, 'enqueue failed: ' + str(e)


# ----------------------------------------------- bridge status registry --
def register_bridge_status(name, status_fn):
    """Each bridge registers a no-arg callable that returns its live status
    dict.  bridges_admin_service.py calls them all in /api/bridges/status."""
    with _status_lock:
        _status_callbacks[name] = status_fn


def all_bridge_status():
    """Returns {bridge_name: status_dict_or_error} snapshot."""
    out = {}
    with _status_lock:
        cbs = dict(_status_callbacks)
    for name, fn in cbs.items():
        try:
            out[name] = fn()
        except Exception as e:
            out[name] = {'enabled': False, 'error': str(e)}
    # Also include any bridges that NEVER registered (lib-not-installed case)
    cfg = load_bridges_config()
    for k in cfg:
        out.setdefault(k, {'enabled': False, 'state': 'not-loaded',
                           'note': 'bridge plug-in did not register; library may be missing'})
    return out


# ---------------------------------------------------------------- log --
def bridge_log(name, msg):
    """Append a single line to /root/data/bridges.log.  Caps the file at
    256 KB on rotation (rare on this disk-tight controller)."""
    try:
        line = '%s [%s] %s\n' % (time.strftime('%Y-%m-%dT%H:%M:%S'), name, msg)
        if os.path.exists(LOG_F) and os.path.getsize(LOG_F) > 256 * 1024:
            try:
                os.replace(LOG_F, LOG_F + '.1')
            except OSError:
                pass
        with open(LOG_F, 'a') as f:
            f.write(line)
    except OSError:
        pass
