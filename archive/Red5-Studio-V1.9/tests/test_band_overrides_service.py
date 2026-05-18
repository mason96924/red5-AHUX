"""
Integration test for band_overrides_service Flask plugin.

Exercises GET / POST / DELETE / preview against a temp DATA_ROOT,
verifies persistence to band_overrides.json, validation rules,
history capture, and the regenerate-band-csv side-effect.

Run from /app/archive/Red5-Studio-V1.9:
    python3 -m pytest tests/test_band_overrides_service.py -v
or:
    python3 tests/test_band_overrides_service.py
"""
import os
import sys
import json
import tempfile
import unittest

from flask import Flask

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import band_overrides_service as bos


class TestBandOverridesService(unittest.TestCase):

    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        os.makedirs(os.path.join(self.tmp, 'configs'), exist_ok=True)
        # Suppress the side-effect band-CSV regeneration so the test does
        # not depend on collector_config.json being present.
        self._orig_regen = bos._regenerate_band_csv
        bos._regenerate_band_csv = lambda: None

        self.app = Flask(__name__)
        bos.register(self.app, {'DATA_ROOT': self.tmp})
        self.client = self.app.test_client()

    def tearDown(self):
        bos._regenerate_band_csv = self._orig_regen
        import shutil
        shutil.rmtree(self.tmp, ignore_errors=True)

    def test_get_returns_null_when_no_file(self):
        r = self.client.get('/api/band-overrides/sa-rh-clamp')
        self.assertEqual(r.status_code, 200)
        body = json.loads(r.data)
        self.assertEqual(body['status'], 'ok')
        self.assertIsNone(body['sa_rh_clamp'])
        self.assertEqual(body['history'], [])

    def test_post_persists_to_disk(self):
        r = self.client.post('/api/band-overrides/sa-rh-clamp',
                             json={'lo': 45, 'hi': 55, 'enabled': True})
        self.assertEqual(r.status_code, 200)
        body = json.loads(r.data)
        self.assertEqual(body['status'], 'ok')
        self.assertTrue(body['changed'])
        self.assertEqual(body['sa_rh_clamp']['lo'], 45)
        self.assertEqual(body['sa_rh_clamp']['hi'], 55)

        # On-disk
        with open(os.path.join(self.tmp, 'configs', 'band_overrides.json'), 'r') as f:
            disk = json.load(f)
        self.assertEqual(disk['sa_rh_clamp']['lo'], 45)
        self.assertEqual(disk['sa_rh_clamp']['hi'], 55)
        self.assertEqual(len(disk['history']), 1)

    def test_post_idempotent(self):
        self.client.post('/api/band-overrides/sa-rh-clamp', json={'lo': 45, 'hi': 55, 'enabled': True})
        r = self.client.post('/api/band-overrides/sa-rh-clamp', json={'lo': 45, 'hi': 55, 'enabled': True})
        body = json.loads(r.data)
        self.assertFalse(body['changed'])

    def test_post_validates_bounds(self):
        # Missing lo / hi
        r = self.client.post('/api/band-overrides/sa-rh-clamp', json={'lo': 45})
        self.assertEqual(r.status_code, 400)
        # Inverted range
        r = self.client.post('/api/band-overrides/sa-rh-clamp', json={'lo': 60, 'hi': 40})
        self.assertEqual(r.status_code, 400)
        # Out of [0,100]
        r = self.client.post('/api/band-overrides/sa-rh-clamp', json={'lo': -5, 'hi': 50})
        self.assertEqual(r.status_code, 400)
        # Window too narrow
        r = self.client.post('/api/band-overrides/sa-rh-clamp', json={'lo': 49, 'hi': 51})
        self.assertEqual(r.status_code, 400)

    def test_delete_clears_clamp_and_appends_history(self):
        self.client.post('/api/band-overrides/sa-rh-clamp', json={'lo': 45, 'hi': 55, 'enabled': True})
        r = self.client.delete('/api/band-overrides/sa-rh-clamp')
        self.assertEqual(r.status_code, 200)
        body = json.loads(r.data)
        self.assertTrue(body['changed'])
        self.assertIsNone(body['sa_rh_clamp'])

        with open(os.path.join(self.tmp, 'configs', 'band_overrides.json'), 'r') as f:
            disk = json.load(f)
        self.assertIsNone(disk['sa_rh_clamp'])
        self.assertEqual(len(disk['history']), 2)  # apply + reset
        self.assertEqual(disk['history'][-1]['applied_by'], 'reset')

    def test_preview_returns_per_band_diff(self):
        r = self.client.get('/api/band-overrides/preview?lo=45&hi=55')
        self.assertEqual(r.status_code, 200)
        body = json.loads(r.data)
        self.assertEqual(body['status'], 'ok')
        self.assertEqual(len(body['preview']), 10)
        b7 = next(p for p in body['preview'] if p['id'] == 'B7')
        self.assertTrue(b7['changed'])
        self.assertEqual(b7['direction'], 'down')
        self.assertEqual(b7['after']['hum'], 'DEHUMIDIFY')
        self.assertEqual(b7['after']['sa_rh'], 55)
        b5 = next(p for p in body['preview'] if p['id'] == 'B5')
        self.assertFalse(b5['changed'])

    def test_post_returns_preview_in_response(self):
        r = self.client.post('/api/band-overrides/sa-rh-clamp',
                             json={'lo': 45, 'hi': 55, 'enabled': True})
        body = json.loads(r.data)
        self.assertIn('preview', body)
        self.assertEqual(len(body['preview']), 10)

    def test_history_capped(self):
        # Force 5 changes by alternating window
        for i in range(5):
            lo = 40 + i; hi = 60 + i
            self.client.post('/api/band-overrides/sa-rh-clamp',
                             json={'lo': lo, 'hi': hi, 'enabled': True})
        with open(os.path.join(self.tmp, 'configs', 'band_overrides.json'), 'r') as f:
            disk = json.load(f)
        self.assertEqual(len(disk['history']), 5)
        self.assertLessEqual(len(disk['history']), bos.HISTORY_MAX)


if __name__ == '__main__':
    unittest.main(verbosity=2)
