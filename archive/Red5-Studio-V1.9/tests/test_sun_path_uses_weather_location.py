"""Sun-path / buildingLatLon regression test.

Regression history (2026-05-29):
  - The dashboard's sun-path compass was permanently stuck on NYC coordinates
    (40.7128, -74.0060) regardless of which weather location the operator
    selected.  Root cause: the code fetched /api/weather-location and tried
    to read `data[0].lat` -- but the endpoint returns {active, saved,
    default} (a dict, not an array), so the `Array.isArray(data) && data[0]`
    guard was always false and the lat/lon never updated.  Same bug in
    equipment_mapper.html.

Invariants this test enforces:
  1. Neither dashboard.html nor equipment_mapper.html contains the buggy
     `Array.isArray(data) && data[0]` pattern against /api/weather-location.
  2. The sun-path widget receives lat/lon that derive from
     `weatherLocation` (dashboard) or read the correct `data.active` shape
     (mapper).
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
V19  = os.path.dirname(HERE)

FILES = [
    os.path.join(V19, 'dashboard.html'),
    os.path.join(V19, 'equipment_mapper.html'),
]


def test_no_array_indexing_on_weather_location_response():
    for f in FILES:
        if not os.path.exists(f):
            continue
        src = open(f).read()
        # The buggy pattern: anywhere within a few lines of /api/weather-location
        # fetch, we should NOT have `data[0]`
        # Find the fetch and inspect a 200-char window after it
        for m in re.finditer(r"fetch\(['\"]/api/weather-location", src):
            window = src[m.start(): m.start() + 600]
            assert 'data[0]' not in window, (
                f'{f}: /api/weather-location response is indexed as data[0], '
                f'but the endpoint returns {{active, saved, default}} (dict). '
                f'This is the regression that left the sun-path stuck on NYC.'
            )


def test_dashboard_derives_buildinglatlon_from_weather_location_state():
    """Dashboard should derive buildingLatLon from `weatherLocation` state,
    not maintain a separate stale copy."""
    src = open(os.path.join(V19, 'dashboard.html')).read()
    # Must reference weatherLocation when computing buildingLatLon
    m = re.search(
        r'const\s+buildingLatLon\s*=\s*\(?weatherLocation',
        src,
    )
    assert m, (
        'dashboard.html: buildingLatLon must be derived from `weatherLocation` '
        'state so the sun-path follows the active weather selection.'
    )


def test_mapper_reads_active_field_correctly():
    """Mapper should read `data.active` from /api/weather-location."""
    src = open(os.path.join(V19, 'equipment_mapper.html')).read()
    # Window of ~600 chars after the fetch
    m = re.search(r"fetch\(['\"]/api/weather-location", src)
    assert m
    window = src[m.start(): m.start() + 1000]
    assert 'data.active' in window, (
        'equipment_mapper.html: must read data.active from /api/weather-location '
        'response.  data is {active, saved, default} -- treating it as an array '
        'was the original bug.'
    )
