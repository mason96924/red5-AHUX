"""
Phase 2 regression tests for the operator SA-RH clamp:
  - _resolve_humidity_sp (pure name resolver)
  - write_humidity_setpoint (BACnet write with dibt mocked out)
  - write_band_setpoints (humidity write happens after CSV bundle write)

Run from /app/archive/Red5-Studio-V1.9:
    python3 tests/test_humidity_sp_write.py
"""
import os
import sys
import importlib.util
import unittest


def _load_collector():
    """Load collector.py with RED5_DISABLE_BG_THREADS=1 so main() does not
    run, and inject a stub `dibt` so the BACnet write paths are exercisable.
    """
    os.environ['RED5_DISABLE_BG_THREADS'] = '1'
    here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    sys.path.insert(0, here)
    spec = importlib.util.spec_from_file_location('collector', os.path.join(here, 'collector.py'))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


collector = _load_collector()


class StubError(Exception):
    """Mock of dibt.Error used to verify error-path handling."""
    pass


class StubDibt(object):
    """In-test BACnet stub.  Records every Write call so the test can
    assert on (ref, value).  Set `next_result` to a StubError instance to
    force the error path.
    """
    Error = StubError

    def __init__(self):
        self.writes = []
        self.next_result = None  # if set, returned by next Write()

    def Write(self, ref, Value=None):
        self.writes.append((ref, Value))
        r = self.next_result
        self.next_result = None
        return r if r is not None else True


class TestResolveHumiditySp(unittest.TestCase):

    def test_explicit_override_wins(self):
        self.assertEqual(collector._resolve_humidity_sp('AHU-01-E', 'AHU01_RH'), 'AHU01_RH')

    def test_override_whitespace_stripped(self):
        self.assertEqual(collector._resolve_humidity_sp('AHU-01', '  CUSTOM_PT  '), 'CUSTOM_PT')

    def test_override_empty_string_falls_through_to_av(self):
        self.assertEqual(collector._resolve_humidity_sp('AHU-01-E', ''), 'AV1')

    def test_override_none_falls_through_to_av(self):
        self.assertEqual(collector._resolve_humidity_sp('AHU-01-E', None), 'AV1')

    def test_av_index_strips_leading_zero(self):
        self.assertEqual(collector._resolve_humidity_sp('AHU01'), 'AV1')
        self.assertEqual(collector._resolve_humidity_sp('AHU09'), 'AV9')
        self.assertEqual(collector._resolve_humidity_sp('AHU-01-E'), 'AV1')

    def test_av_index_two_digits(self):
        self.assertEqual(collector._resolve_humidity_sp('AHU-12'), 'AV12')
        self.assertEqual(collector._resolve_humidity_sp('AHU100'), 'AV100')

    def test_first_digit_run_wins(self):
        # AHU-02-S has two digit runs (02 and 0 from -S? No, just 02).
        # Build a synthetic name where stopping at the first run matters.
        self.assertEqual(collector._resolve_humidity_sp('AHU-02-S'), 'AV2')
        # Stop at first non-digit AFTER digits.
        self.assertEqual(collector._resolve_humidity_sp('FOO3BAR9'), 'AV3')

    def test_no_digits_returns_none(self):
        self.assertIsNone(collector._resolve_humidity_sp('AHU-MAIN'))
        self.assertIsNone(collector._resolve_humidity_sp(''))


class TestWriteHumiditySetpoint(unittest.TestCase):

    def setUp(self):
        self.stub = StubDibt()
        self._orig_dibt = getattr(collector, 'dibt', None)
        collector.dibt = self.stub

    def tearDown(self):
        if self._orig_dibt is None:
            try:
                del collector.dibt
            except AttributeError:
                pass
        else:
            collector.dibt = self._orig_dibt

    def test_none_sp_is_noop(self):
        collector.write_humidity_setpoint(None, {'id': 'B5', 'sa_rh': 50})
        self.assertEqual(self.stub.writes, [])

    def test_empty_sp_is_noop(self):
        collector.write_humidity_setpoint('', {'id': 'B5', 'sa_rh': 50})
        self.assertEqual(self.stub.writes, [])

    def test_no_sa_rh_is_noop(self):
        collector.write_humidity_setpoint('AV1', {'id': 'B5'})
        self.assertEqual(self.stub.writes, [])

    def test_happy_path_writes_present_value(self):
        collector.write_humidity_setpoint('AV1', {'id': 'B5', 'sa_rh': 55})
        self.assertEqual(len(self.stub.writes), 1)
        ref, value = self.stub.writes[0]
        self.assertEqual(ref, 'AV1.Present_Value')
        self.assertEqual(value, 55.0)
        self.assertIsInstance(value, float)

    def test_clamped_value_propagates(self):
        # The clamped B7 (95 -> 55, hum=DEHUMIDIFY) is what would actually
        # reach this function in the live flow.
        clamped = {'id': 'B7', 'sa_rh': 55, 'hum': 'DEHUMIDIFY'}
        collector.write_humidity_setpoint('AV3', clamped)
        self.assertEqual(self.stub.writes[0], ('AV3.Present_Value', 55.0))

    def test_named_override_writes_to_that_ref(self):
        collector.write_humidity_setpoint('AHU01_RH', {'id': 'B5', 'sa_rh': 50})
        self.assertEqual(self.stub.writes[0][0], 'AHU01_RH.Present_Value')

    def test_dibt_error_does_not_raise(self):
        # Stub returns a StubError -- function must catch and log.
        self.stub.next_result = StubError('bacnet busy')
        collector.write_humidity_setpoint('AV1', {'id': 'B5', 'sa_rh': 50})
        self.assertEqual(len(self.stub.writes), 1)

    def test_dibt_exception_does_not_propagate(self):
        # Stub raises -- the write helper should swallow and log.
        def _explode(ref, Value=None):
            raise RuntimeError('network down')
        self.stub.Write = _explode
        try:
            collector.write_humidity_setpoint('AV1', {'id': 'B5', 'sa_rh': 50})
        except Exception as e:
            self.fail('write_humidity_setpoint must not raise: {}'.format(e))


class TestWriteBandSetpointsIntegration(unittest.TestCase):
    """Confirm the humidity write is invoked as part of the full write
    path -- not a regression where a future refactor drops the call.
    """

    def setUp(self):
        self.stub = StubDibt()
        self._orig_dibt = getattr(collector, 'dibt', None)
        collector.dibt = self.stub

    def tearDown(self):
        if self._orig_dibt is None:
            try:
                del collector.dibt
            except AttributeError:
                pass
        else:
            collector.dibt = self._orig_dibt

    def test_humidity_write_happens_after_csv_bundle_write(self):
        band = {
            'id': 'B7', 'sa_t': 12.0, 'sa_rh': 55, 'reheat_t': 23.0,
            'oa_damper': 15, 'cc': 'AGGRESSIVE', 'hc': 'REHEAT', 'hum': 'DEHUMIDIFY',
        }
        # Minimal AHU point defs -- build_write_csv only needs the iteration
        # protocol.  We pass empty lists; build_write_csv returns an empty
        # CSV which is fine for this test since we only care about the
        # subsequent humidity write call.
        collector.write_band_setpoints(
            csv_object='CSV1',
            band=band,
            ahu_point_defs=[],
            vav_entries=[],
            humidity_sp='AV1',
        )
        # Expect 2 writes: 1 for the AHU CSV bundle, 1 for humidity SP.
        self.assertEqual(len(self.stub.writes), 2)
        self.assertEqual(self.stub.writes[0][0], 'CSV1.Present_Value')
        self.assertEqual(self.stub.writes[1], ('AV1.Present_Value', 55.0))

    def test_no_humidity_sp_means_only_csv_write(self):
        band = {'id': 'B5', 'sa_t': 23.5, 'sa_rh': 50, 'oa_damper': 100, 'hum': 'OFF'}
        collector.write_band_setpoints(
            csv_object='CSV1', band=band,
            ahu_point_defs=[], vav_entries=[], humidity_sp=None,
        )
        self.assertEqual(len(self.stub.writes), 1)
        self.assertEqual(self.stub.writes[0][0], 'CSV1.Present_Value')


class TestDiscoverAhuGroupsHumiditySp(unittest.TestCase):
    """discover_ahu_groups must propagate the resolved humidity_sp into
    each group dict so the polling loop can pass it to write_band_setpoints.
    """

    def test_default_resolution_per_ahu(self):
        cfg = {
            'ahu_groups': {
                'AHU-01-E': {'csv_object': 'CSV1', 'vavs': []},
                'AHU-02-S': {'csv_object': 'CSV2', 'vavs': []},
                'AHU-12':   {'csv_object': 'CSV12', 'vavs': []},
            }
        }
        equipment_lookup = {}
        equipment_types = {}
        groups = collector.discover_ahu_groups(cfg, equipment_lookup, equipment_types)
        by_name = {g['ahu_name']: g for g in groups}
        self.assertEqual(by_name['AHU-01-E']['humidity_sp'], 'AV1')
        self.assertEqual(by_name['AHU-02-S']['humidity_sp'], 'AV2')
        self.assertEqual(by_name['AHU-12']['humidity_sp'], 'AV12')

    def test_explicit_override_in_config(self):
        cfg = {
            'ahu_groups': {
                'AHU-01': {'csv_object': 'CSV1', 'vavs': [], 'humidity_sp': 'AHU01_RH'},
            }
        }
        groups = collector.discover_ahu_groups(cfg, {}, {})
        self.assertEqual(groups[0]['humidity_sp'], 'AHU01_RH')

    def test_no_digits_yields_none(self):
        cfg = {
            'ahu_groups': {
                'AHU-MAIN': {'csv_object': 'CSV1', 'vavs': []},
            }
        }
        groups = collector.discover_ahu_groups(cfg, {}, {})
        self.assertIsNone(groups[0]['humidity_sp'])


if __name__ == '__main__':
    unittest.main(verbosity=2)
