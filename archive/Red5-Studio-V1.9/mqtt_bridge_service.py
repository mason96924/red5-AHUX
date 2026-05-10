"""MQTT bridge — publishes telemetry JSON to <topic_prefix>/telemetry every
publish_interval_s, and subscribes to <topic_prefix>/write/<object_id> for
inbound BACnet writes.  Inbound writes are gated by a write_allowlist of
object-IDs (default empty = read-only).

Lazy imports paho-mqtt so a missing library never crashes the boot.

Config keys (under "mqtt" in /root/data/configs/bridges.json):
    enabled              bool
    broker_host          str
    broker_port          int (default 1883)
    tls                  bool (uses default Mozilla certs, no client cert)
    username             optional
    password             optional
    topic_prefix         e.g. "controller/red5"
    publish_interval_s   seconds between publishes (>=5)
    qos                  0 | 1 | 2
    write_allowlist      list of object_ids that inbound writes may target

Status:
    GET /api/bridges/status returns last connect/publish/sub result.
"""
import json
import time
import threading

from _bridges_lib import (
    load_bridges_config, snapshot_telemetry,
    enqueue_write, register_bridge_status, bridge_log,
)

_NAME = 'mqtt'
_thread = None
_stop_evt = threading.Event()
_client = None
_status = {'state': 'idle', 'enabled': False, 'connected': False,
           'last_publish_ts': 0, 'publish_count': 0, 'error_count': 0,
           'last_error': None, 'lib_available': None}


def _try_import_paho():
    try:
        import paho.mqtt.client as mqtt  # noqa: F401
        _status['lib_available'] = True
        return mqtt
    except ImportError as e:
        _status['lib_available'] = False
        _status['last_error'] = 'paho-mqtt not installed: pip install paho-mqtt'
        bridge_log(_NAME, 'paho-mqtt missing: ' + str(e))
        return None


def _on_connect(c, _ud, _flags, rc):
    _status['connected'] = (rc == 0)
    if rc != 0:
        _status['last_error'] = 'connect rc=' + str(rc)
    cfg = load_bridges_config().get(_NAME, {})
    prefix = cfg.get('topic_prefix') or 'controller/red5'
    # Subscribe to inbound writes only if allowlist is non-empty (read-only by default).
    if cfg.get('write_allowlist'):
        c.subscribe(prefix + '/write/+', qos=int(cfg.get('qos', 1)))
        bridge_log(_NAME, 'subscribed to ' + prefix + '/write/+ (allowlist=%d)' % len(cfg['write_allowlist']))


def _on_message(_c, _ud, msg):
    cfg = load_bridges_config().get(_NAME, {})
    prefix = cfg.get('topic_prefix') or 'controller/red5'
    object_id = msg.topic.replace(prefix + '/write/', '', 1)
    try:
        payload = msg.payload.decode('utf-8') if isinstance(msg.payload, (bytes, bytearray)) else str(msg.payload)
        try:
            value = json.loads(payload)
            if isinstance(value, dict) and 'value' in value:
                value = value['value']
        except ValueError:
            try:
                value = float(payload)
            except ValueError:
                value = payload
    except Exception as e:
        _status['last_error'] = 'payload decode: ' + str(e)
        return
    ok, info = enqueue_write(object_id, value, _NAME, cfg.get('write_allowlist') or [])
    if ok:
        bridge_log(_NAME, 'enqueued write %s = %s' % (object_id, value))
    else:
        bridge_log(_NAME, 'write refused: ' + info)


def _publish_once(c, cfg):
    snap, _ = snapshot_telemetry()
    if snap is None:
        return
    payload = json.dumps({'ts': time.time(), 'telemetry': snap})
    topic = (cfg.get('topic_prefix') or 'controller/red5') + '/telemetry'
    try:
        c.publish(topic, payload, qos=int(cfg.get('qos', 1)), retain=False)
        _status['last_publish_ts'] = time.time()
        _status['publish_count']  += 1
        _status['last_error']      = None
    except Exception as e:
        _status['last_error']  = 'publish: ' + str(e)
        _status['error_count'] += 1


def _run():
    global _client
    mqtt = _try_import_paho()
    while not _stop_evt.is_set():
        cfg = load_bridges_config().get(_NAME, {})
        if not cfg.get('enabled') or mqtt is None or not cfg.get('broker_host'):
            _status['state'] = 'disabled'
            if _client is not None:
                try:
                    _client.disconnect()
                except Exception:
                    pass
                _client = None
            _stop_evt.wait(5)
            continue
        _status['state'] = 'running'
        _status['enabled'] = True
        if _client is None:
            _client = mqtt.Client()
            if cfg.get('username'):
                _client.username_pw_set(cfg['username'], cfg.get('password', ''))
            if cfg.get('tls'):
                try:
                    _client.tls_set()
                except Exception as e:
                    _status['last_error'] = 'tls_set: ' + str(e)
            _client.on_connect = _on_connect
            _client.on_message = _on_message
            try:
                _client.connect(cfg['broker_host'], int(cfg.get('broker_port', 1883)), keepalive=60)
                _client.loop_start()
            except Exception as e:
                _status['last_error']  = 'connect: ' + str(e)
                _status['error_count'] += 1
                _client = None
                _stop_evt.wait(15)
                continue
        if _status['connected']:
            _publish_once(_client, cfg)
        interval = max(5, int(cfg.get('publish_interval_s', 30)))
        _stop_evt.wait(interval)
    _status['state'] = 'stopped'
    if _client is not None:
        try:
            _client.loop_stop()
            _client.disconnect()
        except Exception:
            pass


def get_status():
    return dict(_status)


def test_fire():
    """One-shot manual publish — sends a test message to <topic_prefix>/test
    so the operator can verify broker reachability + topic naming."""
    cfg = load_bridges_config().get(_NAME, {})
    if _client is None or not _status.get('connected'):
        return False, 'mqtt client not connected (enable bridge + check broker host)', {}
    topic = (cfg.get('topic_prefix') or 'controller/red5') + '/test'
    payload = json.dumps({'test': True, 'ts': time.time(),
                          'note': 'test-fire from /update Data Bridges card'})
    try:
        info = _client.publish(topic, payload, qos=int(cfg.get('qos', 1)), retain=False)
        # paho returns MQTTMessageInfo; rc=0 means OK.
        rc = getattr(info, 'rc', 0)
        return rc == 0, ('publish rc=' + str(rc)), {'topic': topic, 'payload': payload}
    except Exception as e:
        return False, str(e), {'topic': topic}


def register(app, ctx):
    register_bridge_status(_NAME, get_status)
    global _thread
    if _thread is None or not _thread.is_alive():
        _stop_evt.clear()
        _thread = threading.Thread(target=_run, name='bridge-mqtt', daemon=True)
        _thread.start()
        bridge_log(_NAME, 'started')
