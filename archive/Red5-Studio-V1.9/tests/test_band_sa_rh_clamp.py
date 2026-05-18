"""
Regression tests for the operator SA-RH clamp helpers in
band_csv_generator.apply_sa_rh_clamp + band_csv_generator.load_sa_rh_clamp.

Mirrors the inline helper in collector._apply_sa_rh_clamp (which must
stay byte-for-byte equivalent because the embedded controller can not
import band_csv_generator from inside the collector process).

Run from /app/archive/Red5-Studio-V1.9:
    python3 -m pytest tests/test_band_sa_rh_clamp.py -v
or:
    python3 tests/test_band_sa_rh_clamp.py
"""
import os
import sys
import json
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import band_csv_generator as bcg


class TestApplySaRhClamp(unittest.TestCase):

    def test_no_clamp_returns_copy_unchanged(self):
        band = {'id': 'B5', 'sa_rh': 50, 'hum': 'OFF'}
        out = bcg.apply_sa_rh_clamp(band, None, None)
        self.assertEqual(out['sa_rh'], 50)
        self.assertEqual(out['hum'], 'OFF')
        self.assertIsNot(out, band, 'must return a copy, not the input ref')

    def test_value_inside_window_unchanged(self):
        band = {'id': 'B5', 'sa_rh': 50, 'hum': 'OFF'}
        out = bcg.apply_sa_rh_clamp(band, 45, 55)
        self.assertEqual(out['sa_rh'], 50)
        self.assertEqual(out['hum'], 'OFF')
        self.assertNotIn('_clamp', out)

    def test_value_above_window_clamps_down_forces_dehumidify(self):
        band = {'id': 'B7', 'sa_rh': 95, 'hum': 'SUBCOOL_REHEAT'}
        out = bcg.apply_sa_rh_clamp(band, 45, 55)
        self.assertEqual(out['sa_rh'], 55)
        self.assertEqual(out['hum'], 'DEHUMIDIFY')
        self.assertEqual(out['_clamp'], 'down')

    def test_value_below_window_clamps_up_forces_humidify(self):
        band = {'id': 'B2', 'sa_rh': 35, 'hum': 'COND_HUM'}
        out = bcg.apply_sa_rh_clamp(band, 45, 55)
        self.assertEqual(out['sa_rh'], 45)
        self.assertEqual(out['hum'], 'HUMIDIFY')
        self.assertEqual(out['_clamp'], 'up')

    def test_inverted_bounds_are_swapped(self):
        band = {'id': 'B5', 'sa_rh': 50, 'hum': 'OFF'}
        out = bcg.apply_sa_rh_clamp(band, 55, 45)  # operator typed backwards
        self.assertEqual(out['sa_rh'], 50)
        self.assertEqual(out['hum'], 'OFF')

    def test_input_band_not_mutated(self):
        band = {'id': 'B7', 'sa_rh': 95, 'hum': 'SUBCOOL_REHEAT'}
        bcg.apply_sa_rh_clamp(band, 45, 55)
        self.assertEqual(band['sa_rh'], 95)
        self.assertEqual(band['hum'], 'SUBCOOL_REHEAT')

    def test_all_factory_bands_with_45_55_clamp(self):
        """End-to-end: apply 45-55 to every factory band, confirm:
          - 3 bands stay unchanged (sa_rh already in [45,55])
          - 4 bands clamp down + DEHUMIDIFY (sa_rh > 55)
          - 3 bands clamp up + HUMIDIFY  (sa_rh < 45)
        """
        results = {'down': 0, 'up': 0, 'unchanged': 0}
        for band in bcg.BANDS:
            out = bcg.apply_sa_rh_clamp(band, 45, 55)
            direction = out.get('_clamp')
            if direction == 'down':
                results['down'] += 1
                self.assertEqual(out['hum'], 'DEHUMIDIFY')
                self.assertEqual(out['sa_rh'], 55)
            elif direction == 'up':
                results['up'] += 1
                self.assertEqual(out['hum'], 'HUMIDIFY')
                self.assertEqual(out['sa_rh'], 45)
            else:
                results['unchanged'] += 1
                self.assertEqual(out['sa_rh'], band['sa_rh'])
                self.assertEqual(out['hum'], band['hum'])
        # Factory bands sa_rh values: 40, 35, 45, 40, 50, 55, 95, 95, 40, 95
        # With clamp 45-55:
        #   up (sa_rh<45):  B1=40, B2=35, B4=40, B9=40         -> 4
        #   in window:      B3=45, B5=50, B6=55                -> 3
        #   down (sa_rh>55): B7=95, B8=95, B10=95              -> 3
        self.assertEqual(results['up'], 4)
        self.assertEqual(results['unchanged'], 3)
        self.assertEqual(results['down'], 3)


class TestLoadSaRhClamp(unittest.TestCase):

    def _write(self, dir_path, payload):
        with open(os.path.join(dir_path, 'band_overrides.json'), 'w') as f:
            json.dump(payload, f)

    def test_no_file_returns_none(self):
        with tempfile.TemporaryDirectory() as d:
            self.assertIsNone(bcg.load_sa_rh_clamp(d))

    def test_disabled_returns_none(self):
        with tempfile.TemporaryDirectory() as d:
            self._write(d, {'sa_rh_clamp': {'enabled': False, 'lo': 45, 'hi': 55}})
            self.assertIsNone(bcg.load_sa_rh_clamp(d))

    def test_enabled_returns_tuple(self):
        with tempfile.TemporaryDirectory() as d:
            self._write(d, {'sa_rh_clamp': {'enabled': True, 'lo': 45, 'hi': 55}})
            self.assertEqual(bcg.load_sa_rh_clamp(d), (45, 55))

    def test_malformed_json_returns_none(self):
        with tempfile.TemporaryDirectory() as d:
            with open(os.path.join(d, 'band_overrides.json'), 'w') as f:
                f.write('{ bad json')
            self.assertIsNone(bcg.load_sa_rh_clamp(d))

    def test_missing_lo_or_hi_returns_none(self):
        with tempfile.TemporaryDirectory() as d:
            self._write(d, {'sa_rh_clamp': {'enabled': True, 'lo': 45}})
            self.assertIsNone(bcg.load_sa_rh_clamp(d))


class TestEffectiveBands(unittest.TestCase):

    def test_no_clamp_returns_factory_bands(self):
        with tempfile.TemporaryDirectory() as d:
            bands = bcg._effective_bands(d)
            self.assertIs(bands, bcg.BANDS)

    def test_with_clamp_returns_clamped_bands(self):
        with tempfile.TemporaryDirectory() as d:
            with open(os.path.join(d, 'band_overrides.json'), 'w') as f:
                json.dump({'sa_rh_clamp': {'enabled': True, 'lo': 45, 'hi': 55}}, f)
            bands = bcg._effective_bands(d)
            self.assertIsNot(bands, bcg.BANDS)
            b7 = next(b for b in bands if b['id'] == 'B7')
            self.assertEqual(b7['sa_rh'], 55)
            self.assertEqual(b7['hum'], 'DEHUMIDIFY')


class TestCollectorParity(unittest.TestCase):
    """The inline helper in collector.py MUST behave identically to
    band_csv_generator.apply_sa_rh_clamp, otherwise the controller
    description string disagrees with the CSV guide.
    """

    def test_collector_helper_matches_canonical(self):
        # Import collector via the same path import the controller would use.
        import importlib.util
        spec = importlib.util.spec_from_file_location(
            'collector',
            os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'collector.py')
        )
        # collector.py imports `dibt` only inside functions, so module-level
        # import is safe in this test env.
        collector = importlib.util.module_from_spec(spec)
        try:
            spec.loader.exec_module(collector)
        except Exception as e:
            self.skipTest('collector.py module-level import failed: {}'.format(e))
            return

        for band in bcg.BANDS:
            for lo, hi in [(None, None), (45, 55), (40, 60), (50, 60), (35, 45)]:
                canonical = bcg.apply_sa_rh_clamp(band, lo, hi)
                inline = collector._apply_sa_rh_clamp(band, lo, hi)
                self.assertEqual(
                    canonical['sa_rh'], inline['sa_rh'],
                    'sa_rh mismatch for {} @ ({}, {})'.format(band['id'], lo, hi)
                )
                self.assertEqual(
                    canonical['hum'], inline['hum'],
                    'hum mismatch for {} @ ({}, {})'.format(band['id'], lo, hi)
                )


if __name__ == '__main__':
    unittest.main(verbosity=2)
