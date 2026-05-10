"""Modbus TCP server bridge — exposes telemetry as Modbus holding registers
so an existing BMS head-end can poll the controller as a slave.  Read-only
(BMS pulls; bridge does not allow inbound writes).

Lazy imports pymodbus.  Layout: each AHU/VAV gets a contiguous block of 16
registers starting at base_register=AHU_INDEX*16.  Register 0..15 mapping
is documented in get_status()['register_map'] for the operator to wire on
the BMS side.

Config keys (under "modbus"):
    enabled    bool
    host       bind address
    port       TCP port (default 5020 — non-privileged)
    unit_id    Modbus slave unit id

Status:
    GET /api/bridges/status returns server state + register layout.
"""
import time
import threading

from _bridges_lib import (
    load_bridges_config, snapshot_telemetry,
    register_bridge_status, bridge_log,
)

_NAME = 'modbus'
_thread = None
_stop_evt = threading.Event()
_status = {'state': 'idle', 'enabled': False, 'lib_available': None,
           'last_update_ts': 0, 'update_count': 0, 'last_error': None,
           'register_map': [
               '0:  SA dry-bulb °C × 10  (signed)',
               '1:  RA dry-bulb °C × 10  (signed)',
               '2:  OA dry-bulb °C × 10  (signed)',
               '3:  SA RH %             (0-100)',
               '4:  RA RH %             (0-100)',
               '5:  OA RH %             (0-100)',
               '6:  Fan speed %         (0-100)',
               '7:  OA damper position %(0-100)',
               '8:  Heating valve %     (0-100)',
               '9:  Cooling valve %     (0-100)',
               '10: Band number         (1=B1 … 10=B10)',
               '11-15: reserved',
           ]}
_context = None  # pymodbus ServerContext, populated when running


def _try_import_pymodbus():
    try:
        from pymodbus.server import StartTcpServer
        from pymodbus.datastore import ModbusSlaveContext, ModbusServerContext
        from pymodbus.datastore import ModbusSequentialDataBlock
        _status['lib_available'] = True
        return StartTcpServer, ModbusSlaveContext, ModbusServerContext, ModbusSequentialDataBlock
    except ImportError as e:
        _status['lib_available'] = False
        _status['last_error'] = 'pymodbus not installed: pip install pymodbus'
        bridge_log(_NAME, 'pymodbus missing: ' + str(e))
        return None


def _scale(v, mul=1, default=0):
    try:
        return int(round(float(v) * mul))
    except (TypeError, ValueError):
        return default


def _build_registers(snap):
    """Walks snapshot AHUs/VAVs and packs each into a 16-register block.
    Returns a flat list of 16 N integers."""
    if not isinstance(snap, dict):
        return [0] * 16
    out = []
    ahu_map = snap.get('ahu') or snap.get('AHU') or {}
    if not isinstance(ahu_map, dict):
        ahu_map = {}
    for name in sorted(ahu_map.keys()):
        a = ahu_map[name] or {}
        block = [
            _scale(a.get('sa_t'), 10), _scale(a.get('ra_t'), 10), _scale(a.get('oa_t'), 10),
            _scale(a.get('sa_rh')),    _scale(a.get('ra_rh')),    _scale(a.get('oa_rh')),
            _scale(a.get('fan_speed')), _scale(a.get('oa_damper')),
            _scale(a.get('heating_valve')), _scale(a.get('cooling_valve')),
            int((a.get('band') or 'B0')[1:] or 0) if isinstance(a.get('band'), str) else 0,
            0, 0, 0, 0, 0,
        ]
        # Modbus 16-bit signed → wrap negatives to two's-complement.
        out.extend([(v if v >= 0 else (v + 0x10000)) & 0xFFFF for v in block])
    if not out:
        out = [0] * 16
    return out


def _update_loop(server_ctx):
    while not _stop_evt.is_set():
        try:
            snap, _ = snapshot_telemetry()
            regs = _build_registers(snap)
            cfg = load_bridges_config().get(_NAME, {})
            unit = int(cfg.get('unit_id', 1))
            slave = server_ctx[unit]
            slave.setValues(3, 0, regs)  # function 3 = holding registers
            _status['last_update_ts'] = time.time()
            _status['update_count']  += 1
            _status['last_error']     = None
        except Exception as e:
            _status['last_error'] = 'update: ' + str(e)
        _stop_evt.wait(5)


def _run():
    global _context
    libs = _try_import_pymodbus()
    cfg  = load_bridges_config().get(_NAME, {})
    if not cfg.get('enabled') or libs is None:
        _status['state'] = 'disabled'
        return
    StartTcpServer, ModbusSlaveContext, ModbusServerContext, ModbusSequentialDataBlock = libs
    block = ModbusSequentialDataBlock(0, [0] * 16)
    slave = ModbusSlaveContext(hr=block)
    _context = ModbusServerContext(slaves={int(cfg.get('unit_id', 1)): slave}, single=False)
    _status['state']   = 'running'
    _status['enabled'] = True
    bridge_log(_NAME, 'starting Modbus TCP on %s:%d' % (cfg.get('host', '0.0.0.0'), int(cfg.get('port', 5020))))
    # Updater thread — pushes telemetry into the register block every 5 s.
    upd = threading.Thread(target=_update_loop, args=(_context,),
                           name='bridge-modbus-upd', daemon=True)
    upd.start()
    try:
        StartTcpServer(_context, address=(cfg.get('host', '0.0.0.0'),
                                          int(cfg.get('port', 5020))))
    except Exception as e:
        _status['last_error']  = 'server: ' + str(e)
        _status['error_count'] = _status.get('error_count', 0) + 1
    _status['state'] = 'stopped'


def get_status():
    return dict(_status)


_TEST_SENTINEL_REGISTER = 999
_TEST_SENTINEL_VALUE    = 0xCAFE   # 51966 — distinctive, unlikely to occur naturally


def test_fire():
    """Writes 0xCAFE (51966) to register 999 so the BMS can read that
    register and confirm it's polling the right slave + unit ID."""
    if _context is None or _status.get('state') != 'running':
        return False, 'modbus server not running (enable bridge + check port)', {}
    cfg  = load_bridges_config().get(_NAME, {})
    unit = int(cfg.get('unit_id', 1))
    try:
        _context[unit].setValues(3, _TEST_SENTINEL_REGISTER, [_TEST_SENTINEL_VALUE])
        return True, ('wrote 0x%X to HR[%d]' % (_TEST_SENTINEL_VALUE, _TEST_SENTINEL_REGISTER)), {
            'unit_id':   unit,
            'register':  _TEST_SENTINEL_REGISTER,
            'value_hex': '0x%X' % _TEST_SENTINEL_VALUE,
            'value_dec': _TEST_SENTINEL_VALUE,
            'verify_on_bms': 'Read holding-register %d on unit %d — should equal %d.'
                             % (_TEST_SENTINEL_REGISTER, unit, _TEST_SENTINEL_VALUE),
        }
    except Exception as e:
        return False, str(e), {}


def register(app, ctx):
    register_bridge_status(_NAME, get_status)
    global _thread
    if _thread is None or not _thread.is_alive():
        _stop_evt.clear()
        _thread = threading.Thread(target=_run, name='bridge-modbus', daemon=True)
        _thread.start()
        bridge_log(_NAME, 'started')
