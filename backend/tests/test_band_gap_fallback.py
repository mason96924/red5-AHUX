"""Band window tiling + gap-fallback regressions.

Retile (2026-08-09): expand B1-B10 OA windows so operational climate is
mostly exact-match, and nearest-center never invents B4/B5 (100% OA) for
warm or cold gap weather.
"""
from __future__ import annotations

import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from simulator import _resolve_band  # noqa: E402

# Mirror dashboard-helpers BAND_WINDOWS (B10 before B7/B8 for overlap).
_WINDOWS = [
    ("B1", -50, 5, 0, 100),
    ("B2", 5, 16, 0, 100),
    ("B3", 15, 22, 0, 35),
    ("B4", 18, 23, 32, 55),
    ("B5", 22, 26, 40, 70),
    ("B6", 25, 28, 45, 70),
    ("B10", 28, 50, 80, 100),
    ("B7", 26, 36, 45, 90),
    ("B8", 32, 45, 65, 100),
    ("B9", 25, 50, 0, 50),
]

_OAD = {
    "B1": 15, "B2": 15, "B3": 30, "B4": 100, "B5": 100,
    "B6": 50, "B7": 15, "B8": 15, "B9": 15, "B10": 15,
}


def _classify(t: float, rh: float):
    for bid, t0, t1, r0, r1 in _WINDOWS:
        if t0 <= t <= t1 and r0 <= rh <= r1:
            return bid, True
    best, best_d = _WINDOWS[0][0], float("inf")
    for bid, t0, t1, r0, r1 in _WINDOWS:
        dist = math.hypot(t - (t0 + t1) / 2.0, rh - (r0 + r1) / 2.0)
        if dist < best_d:
            best, best_d = bid, dist
    return best, False


def test_reported_case_is_exact_b7_min_oa():
    bid, exact = _classify(28.5, 58.0)
    assert exact is True
    assert bid == "B7"
    assert _OAD[bid] == 15


def test_backend_resolve_matches_reported_case():
    row = _resolve_band(28.5, 58.0)
    assert row["Band"] == "B7"
    assert float(row["OA_Damper_SP"]) == 15.0


def test_cold_any_rh_is_b1():
    assert _classify(-2.0, 80.0) == ("B1", True)
    assert _classify(-2.0, 10.0) == ("B1", True)


def test_cool_any_rh_is_b2():
    assert _classify(10.0, 20.0) == ("B2", True)
    assert _classify(10.0, 90.0) == ("B2", True)


def test_warm_gap_nearest_never_100_oa():
    """Sweep: no gap cell with T>=26 may nearest-assign OAD 100%."""
    t = 26.0
    while t <= 42.0:
        rh = 5.0
        while rh <= 98.0:
            bid, exact = _classify(t, rh)
            if not exact:
                assert _OAD[bid] < 100, (t, rh, bid)
            rh += 2.0
        t += 0.5


def test_cold_gap_nearest_never_100_oa():
    t = -5.0
    while t <= 16.0:
        rh = 5.0
        while rh <= 98.0:
            bid, exact = _classify(t, rh)
            if not exact:
                assert _OAD[bid] < 100, (t, rh, bid)
            rh += 2.0
        t += 0.5


def test_exact_coverage_operational_climate():
    total = gaps = 0
    t = -5.0
    while t <= 42.0:
        rh = 5.0
        while rh <= 98.0:
            total += 1
            _bid, exact = _classify(t, rh)
            if not exact:
                gaps += 1
            rh += 2.0
        t += 0.5
    # Retile target: well above the old ~32% exact coverage.
    assert (total - gaps) / total >= 0.85, (total - gaps) / total
