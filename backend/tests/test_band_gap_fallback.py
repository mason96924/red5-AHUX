"""Band guide audit contracts — permanent regressions.

These encode the full-grid audit, not one screenshot:
  - cool humid OA must never become a hot-band story
  - gap fallback must never invent OAD >= 100
  - JS / backend parity
  - screenshot cases
"""
from __future__ import annotations

import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from simulator import _resolve_band  # noqa: E402

_WINDOWS = [
    ("B1", -50, 5, 0, 100),
    ("B3", 15, 22, 0, 35),
    ("B2", 5, 18, 0, 100),
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
    "B6": 50, "B7": 15, "B8": 15, "B9": 15, "B10": 15, "?": 15,
}

_T_MARGIN = 5.0


def _classify(t: float, rh: float):
    for bid, t0, t1, r0, r1 in _WINDOWS:
        if t0 <= t <= t1 and r0 <= rh <= r1:
            return bid, True
    best, best_d = None, float("inf")
    for bid, t0, t1, r0, r1 in _WINDOWS:
        if _OAD[bid] >= 100:
            continue
        if t < t0 - _T_MARGIN or t > t1 + _T_MARGIN:
            continue
        t_c = min(max(t, t0), t1)
        rh_c = min(max(rh, r0), r1)
        dist = math.hypot(t - t_c, rh - rh_c)
        if dist < best_d:
            best, best_d = bid, dist
    return (best or "?"), False


def _W(t, rh):
    pws = 610.94 * math.exp(17.625 * t / (t + 243.04))
    pw = rh / 100.0 * pws
    return 0.622 * pw / (101325 - pw) * 1000


def test_cool_humid_screenshot_is_b2():
    bid, exact = _classify(16.1, 72.9)
    assert bid == "B2" and exact is True
    assert _resolve_band(16.1, 72.9)["Band"] == "B2"


def test_cool_oa_never_maps_to_hot_band():
    t = 5.0
    while t <= 20.0:
        rh = 5.0
        while rh <= 98.0:
            bid, _ = _classify(t, rh)
            assert bid not in ("B7", "B8", "B10"), (t, rh, bid)
            rh += 2.0
        t += 0.5


def test_gap_fallback_never_invents_100_oa():
    t = -5.0
    while t <= 42.0:
        rh = 5.0
        while rh <= 98.0:
            bid, exact = _classify(t, rh)
            if not exact:
                assert _OAD[bid] < 100, (t, rh, bid)
            rh += 2.0
        t += 0.5


def test_backend_gap_never_invents_100_oa():
    t = -5.0
    while t <= 42.0:
        rh = 5.0
        while rh <= 98.0:
            row = _resolve_band(t, rh)
            # exact hits may still be B4/B5; only gaps are constrained here
            bid, exact = _classify(t, rh)
            if not exact:
                assert float(row["OA_Damper_SP"]) < 100, (t, rh, row["Band"])
            rh += 5.0
        t += 1.0


def test_js_backend_parity_dense():
    for t in [i * 0.5 for i in range(-10, 90)]:
        for rh in range(5, 100, 5):
            jid, _ = _classify(t, rh)
            bid = _resolve_band(t, rh)["Band"]
            assert jid == bid, (t, rh, jid, bid)


def test_warm_case_b7():
    assert _classify(28.5, 58.0) == ("B7", True)
    assert _resolve_band(28.5, 58.0)["Band"] == "B7"


def test_mild_dry_b3():
    assert _classify(17.0, 30.0) == ("B3", True)


def test_economizer_exact_wetter_than_ra_still_exists_in_recipe():
    """Document: exact B5 can still authorize 100% OA when OA is wetter than
    typical RA. UI bandAdvise() must PSY-VETO; this test locks the recipe fact
    so we do not pretend the CSV alone is safe."""
    ra = (22.3, 48.0)
    w_ra = _W(*ra)
    wet_econ = 0
    t = 22.0
    while t <= 26.0:
        rh = 40.0
        while rh <= 70.0:
            bid, exact = _classify(t, rh)
            if exact and bid in ("B4", "B5") and _W(t, rh) > w_ra + 1.0:
                wet_econ += 1
            rh += 2.0
        t += 0.5
    assert wet_econ > 0, "expected B4/B5 wetter-than-RA cells — UI veto required"


def test_psy_veto_clamps_economizer_when_oa_wetter_than_ra():
    from simulator import psy_veto_oad
    # Exact B5 recipe would be 100%; OA 24°C/65% is wetter than RA 22.3/48
    oad, vetoed, w_oa, w_ra = psy_veto_oad(100, 24.0, 65.0, 22.3, 48.0)
    assert vetoed is True
    assert oad == 15.0
    assert w_oa > w_ra + 1.0


def test_psy_veto_allows_economizer_when_oa_drier():
    from simulator import psy_veto_oad
    # OA 20°C/40% vs RA 22.3/48 — OA typically drier; keep 100
    oad, vetoed, _, _ = psy_veto_oad(100, 20.0, 40.0, 22.3, 48.0)
    assert vetoed is False
    assert oad == 100.0


def test_psy_veto_noop_without_ra():
    from simulator import psy_veto_oad
    oad, vetoed, _, _ = psy_veto_oad(100, 24.0, 65.0, None, None)
    assert vetoed is False
    assert oad == 100.0


def test_exact_coverage():
    total = gaps = 0
    t = -5.0
    while t <= 42.0:
        rh = 5.0
        while rh <= 98.0:
            total += 1
            _, exact = _classify(t, rh)
            if not exact:
                gaps += 1
            rh += 2.0
        t += 0.5
    assert (total - gaps) / total >= 0.85
