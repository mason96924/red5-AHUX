"""models/weather.py -- canonical weather-location seed.

Phase L.31 (2026-06-24): single source of truth for the bundled list of
demo / reference locations and the default active pick.  Replaces the
two divergent lists that previously lived in:

  * `server.py::SAVED_LOCATIONS` / `ACTIVE_LOCATION` (anonymous fallback)
  * `tenants.py::_DEMO_SAVED_LOCATIONS` / `_DEMO_ACTIVE_LOCATION`
    (per-tenant seed in `get_or_create_tenant_for_user`)

The unified list combines:
  * **Red5 reference / customer sites** -- the hospital deployments that
    were the original demo dataset.  These give first-time signed-in
    users a domain-coherent "pick the building closest to yours" UX out
    of the box.
  * **4-season reference cities** -- world capitals whose Open-Meteo
    archive history covers a clean four-season range (cold winter,
    warm summer, decent diurnal swing).  Used as the default active
    pick because the bundled dashboard demos a year-of-data overlay
    that looks empty / weird if the seed location is in a tropical or
    polar climate.

`ACTIVE_LOCATION = New York` -- explicitly chosen for that 4-season
property; intentionally NOT one of the hospital sites (Seattle
Children's is borderline, others are closer to single-season climates).
"""
from __future__ import annotations

SAVED_LOCATIONS = [
    # Red5 reference / customer sites
    {"lat": -34.92, "lon":  138.60, "name": "NRAH (Adelaide)"},
    {"lat": -31.95, "lon":  115.86, "name": "Perth Children Hospital"},
    {"lat":  37.56, "lon":  127.04, "name": "Hanyang Univ Hospital (Seoul)"},
    {"lat":  39.91, "lon":  116.40, "name": "Beijing Geriatric Hospital"},
    {"lat":  47.60, "lon": -122.30, "name": "Seattle Children's"},
    # 4-season reference cities (default active = New York; see module docstring)
    {"lat":  40.71, "lon":  -74.01, "name": "New York"},
    {"lat":  51.51, "lon":   -0.13, "name": "London"},
    {"lat":  52.52, "lon":   13.40, "name": "Berlin"},
    {"lat":  49.28, "lon": -123.12, "name": "Vancouver"},
    {"lat":  35.68, "lon":  139.69, "name": "Tokyo"},
    {"lat":  47.92, "lon":  106.92, "name": "Ulaanbaatar"},
    {"lat":  25.03, "lon":  121.57, "name": "Taipei"},
    {"lat":  22.32, "lon":  114.17, "name": "Hong Kong"},
    {"lat":   1.35, "lon":  103.82, "name": "Singapore"},
    {"lat": -33.87, "lon":  151.21, "name": "Sydney"},
]

# Index 5 = New York -- chosen for 4-season climate with reliable
# Open-Meteo historical coverage (the dashboard's year-overlay rendering
# looks correct here).  See module docstring for the longer rationale.
ACTIVE_LOCATION = SAVED_LOCATIONS[5]
