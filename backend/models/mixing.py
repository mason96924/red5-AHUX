"""models/mixing.py -- mixed-air (MA) state derivation for the psy chart.

The mixing box is the one place on the chart where the geometry is exact.
Water mass and energy are both conserved across a mixing junction, so
humidity ratio and enthalpy mix linearly with dry-air mass fraction and the
mixed state must lie ON the straight OA-RA segment, dividing it in the ratio
of the two mass flows (the lever rule).  Dry-bulb is linear to within about
0.05 K -- moist-air cp varies slightly with humidity -- which is invisible at
chart scale.

Why this matters for the drawing: OA->SA is not a physical process.  No
device in the AHU takes outside air to supply air; that line is a chord
across two processes at once (mixing, then the coil), so the coil's apparent
sensible/latent split is contaminated by mixing.  With MA present every drawn
segment maps to exactly one piece of equipment:

    OA -> MA  and  RA -> MA     mixing box
    MA -> SA                    coil(s) + humidifier
    SA -> RA                    the room picking up load

Three ways to locate MA, in descending order of trust:

  ``measured``  MAT and MAH both wired.  MA is an independent measurement, so
                its distance from the OA-RA line is a real fault signal:
                sensor drift, an unmeasured moisture source, or duct leakage.
                Rare in the field -- mixed-air humidity is seldom installed.

  ``mat``       MAT only, the common case (it is the freeze / low-limit
                sensor).  W is back-calculated from the temperature-derived
                OA fraction, so MA lands on the line BY CONSTRUCTION and
                "is MA on the line?" proves nothing.  The diagnostic worth
                having instead is the derived OA fraction against the
                commanded damper position.

  ``damper``    No MA sensor at all.  MA is placed by lever rule from the
                damper command.  This is model output, not measurement: it
                fixes the geometry of the coil leg but detects nothing, and
                must be labelled so nobody reads it as confirmation.

Field caveats deliberately encoded here rather than assumed away:

  * A single-point MAT in a mixing box measures stratification, not a mixed
    average -- cold OA and warm RA stay in layers for several duct diameters.
    This is the most likely cause of a false damper-mismatch flag, which is
    why ``DAMPER_TOL`` is generous.
  * The temperature-derived fraction goes singular as OA approaches RA.  APAR
    (NIST's 28 mass/energy-balance AHU rules) uses a 2.0 C threshold; the same
    value is used here.  A humidity-derived fraction survives exactly that
    condition, so when MAH is available the two estimates are complementary
    rather than redundant.
  * Damper position is not flow.  Treating percent-open as percent-flow is a
    linear approximation to a characteristic that is anything but; the
    ``damper`` basis is the weakest of the three for that reason too.
"""
from __future__ import annotations

import math
from typing import Optional, Tuple

# Amber ring identity -- chart MA is black fill + yellow ring; OA blue
# (#3b82f6), SA green (#10b981), RA rose (#f43f5e).
MA_COLOR = "#eab308"

MIN_DT_C = 2.0        # APAR temperature threshold; below this f_t is junk
MIN_DW_KGKG = 1.0e-4  # 0.1 g/kg -- below this f_w is junk
FRACTION_TOL = 0.05   # slack on the physical 0..1 bound before flagging
DAMPER_TOL = 0.20     # OA-fraction disagreement that raises a flag
LINE_TOL_GKG = 1.0    # off-line distance that raises a flag, g/kg
CLOSE_LINE_TOL_GKG = 0.2  # tighter when OA≈RA (no stable f_t)
CHORD_FRAC_TOL = 0.08 # |perp|/|OA–RA| in (T,w g/kg); catches auto-zoom visuals
TEMP_LINE_TOL_C = 0.5 # when OA≈RA, T residual vs humidity lever (deg C)
MAT_RANGE_TOL_C = 0.3 # MAT outside [min(OA,RA), max(OA,RA)] (deg C)


def humidity_ratio(t_c: float, rh: float) -> float:
    """Humidity ratio w [kg/kg dry air] at sea level.  Magnus formula.

    Matches the decimal-kg/kg convention used everywhere else in the stack
    (the dashboard multiplies by 1000 for its g/kg display).
    """
    p_ws = 0.6108 * math.exp((17.27 * t_c) / (t_c + 237.3))
    p_w = (rh / 100.0) * p_ws
    denom = 101.325 - p_w
    if denom <= 0.1:
        return 0.031
    return (621.945 * p_w / denom) / 1000.0


def rh_from_w(t_c: float, w_kgkg: float) -> float:
    """Inverse of :func:`humidity_ratio` -- RH [%] from dry-bulb and w.

    Needed because a derived MA has no measured RH of its own: the chart
    plots (t, w) but the hover card and sidebar row want a percentage.
    Clamped to 0..100; a derived w above saturation reads as 100 rather than
    returning something impossible.
    """
    if w_kgkg <= 0:
        return 0.0
    p_ws = 0.6108 * math.exp((17.27 * t_c) / (t_c + 237.3))
    if p_ws <= 0:
        return 0.0
    w = w_kgkg * 1000.0
    p_w = 101.325 * w / (621.945 + w)
    return max(0.0, min(100.0, 100.0 * p_w / p_ws))


def chord_w_residual_gkg(
    t_oa: float, w_oa: float,
    t_ra: float, w_ra: float,
    t_ma: float, w_ma: float,
) -> float:
    """Humidity residual (g/kg) of MA vs the infinite OA–RA mixing line.

    Projects MA onto the chord in the (T °C, w g/kg) plane and returns the
    w-component of that residual.  Works when ΔT is too small for a stable
    temperature lever — the usual OA≈RA case on mild days.
    """
    ax, ay = float(t_oa), float(w_oa) * 1000.0
    bx, by = float(t_ra), float(w_ra) * 1000.0
    cx, cy = float(t_ma), float(w_ma) * 1000.0
    abx, aby = bx - ax, by - ay
    ab2 = abx * abx + aby * aby
    if ab2 < 1e-12:
        return cy - ay
    t = ((cx - ax) * abx + (cy - ay) * aby) / ab2
    return cy - (ay + t * aby)


def chord_off_fraction(
    t_oa: float, w_oa: float,
    t_ra: float, w_ra: float,
    t_ma: float, w_ma: float,
) -> Optional[float]:
    """Perpendicular distance / |OA–RA| in the (T °C, w g/kg) plane.

    Absolute g/kg residuals look tiny when OA≈RA, but the process mini-badge
    auto-zooms that cluster so the same offset reads as a clear off-chord.
    Fraction of chord length matches that visual.
    """
    ax, ay = float(t_oa), float(w_oa) * 1000.0
    bx, by = float(t_ra), float(w_ra) * 1000.0
    cx, cy = float(t_ma), float(w_ma) * 1000.0
    abx, aby = bx - ax, by - ay
    ab2 = abx * abx + aby * aby
    if ab2 < 1e-12:
        return None
    cross = abx * (cy - ay) - aby * (cx - ax)
    return abs(cross) / ab2


def enthalpy(t_c: float, w_kgkg: float) -> float:
    """Moist-air enthalpy [kJ/kg dry air]."""
    return 1.006 * t_c + w_kgkg * (2501.0 + 1.86 * t_c)


def _clamp01(v: float) -> float:
    return max(0.0, min(1.0, v))


def derive_mixed_air(
    oa: Optional[dict],
    ra: Optional[dict],
    mat: Optional[float] = None,
    mah: Optional[float] = None,
    oad: Optional[float] = None,
) -> Tuple[Optional[dict], Optional[dict]]:
    """Locate the mixed-air state from whatever is actually available.

    Args:
        oa, ra: psy points, each ``{"t": degC, "rh": pct, "w": kg/kg}``.
        mat:    measured mixed-air temperature, deg C, or None.
        mah:    measured mixed-air RH, percent, or None.
        oad:    commanded outdoor-air damper position, 0-100 percent.

    Returns:
        ``(ma_point, diagnostics)``, or ``(None, None)`` when MA cannot be
        located at all (no MAT and no damper feedback).  Callers append
        ``ma_point`` to the AHU's ``points`` list -- it goes LAST so the
        positional ``points[0..2]`` accesses in older dashboard code and in
        the health route keep resolving to OA / SA / RA.
    """
    if not oa or not ra:
        return None, None
    try:
        t_oa, w_oa = float(oa["t"]), float(oa["w"])
        t_ra, w_ra = float(ra["t"]), float(ra["w"])
    except (KeyError, TypeError, ValueError):
        return None, None

    mat = None if mat is None else _as_float(mat)
    mah = None if mah is None else _as_float(mah)
    oad = None if oad is None else _as_float(oad)

    f_damper = None if oad is None else _clamp01(oad / 100.0)
    flags: list[str] = []

    # Temperature-derived OA fraction.  Ill-conditioned as OA approaches RA.
    f_t = None
    d_t = t_oa - t_ra
    if mat is not None and abs(d_t) >= MIN_DT_C:
        f_t = (mat - t_ra) / d_t

    # Humidity-derived OA fraction -- independent of f_t, and available
    # precisely when f_t is not (OA and RA at similar temperature).
    f_w = None
    w_ma_meas = None
    if mat is not None and mah is not None:
        w_ma_meas = humidity_ratio(mat, mah)
        d_w = w_oa - w_ra
        if abs(d_w) >= MIN_DW_KGKG:
            f_w = (w_ma_meas - w_ra) / d_w

    if mat is not None and w_ma_meas is not None:
        basis = "measured"
        t_ma, w_ma = mat, w_ma_meas
        f = f_t if f_t is not None else f_w
    elif mat is not None:
        if f_t is not None:
            basis, f = "mat", f_t
        elif f_damper is not None:
            # OA and RA too close to divide -- borrow the damper's fraction
            # for W only.  T is still the measurement.
            basis, f = "mat+damper", f_damper
            flags.append("oa_ra_temp_too_close")
        else:
            return None, None
        t_ma = mat
        f_plot = _clamp01(f)
        w_ma = f_plot * w_oa + (1.0 - f_plot) * w_ra
    elif f_damper is not None:
        basis, f = "damper", f_damper
        t_ma = f * t_oa + (1.0 - f) * t_ra
        w_ma = f * w_oa + (1.0 - f) * w_ra
    else:
        return None, None

    w_ma = max(0.0, w_ma)

    # --- Plausibility and cross-checks -----------------------------------
    # A mixed state outside the OA-RA range is thermodynamically impossible
    # in a simple mixing box: APAR's Rule 10 family.  Real causes are MAT
    # sensor drift or stratification at the sensor.
    if f is not None and (f < -FRACTION_TOL or f > 1.0 + FRACTION_TOL):
        flags.append("mat_outside_oa_ra")

    # Direct T-range check (independent of the ΔT ≥ 2 °C floor used for f_t).
    # When OA≈RA the fraction is ill-conditioned, but MAT hotter/colder than
    # both parents is still a physical impossibility for simple mixing.
    if mat is not None:
        t_lo, t_hi = min(t_oa, t_ra), max(t_oa, t_ra)
        if mat < t_lo - MAT_RANGE_TOL_C or mat > t_hi + MAT_RANGE_TOL_C:
            if "mat_outside_oa_ra" not in flags:
                flags.append("mat_outside_oa_ra")

    # Derived fraction vs what the damper was told to do.  Only meaningful
    # when the fraction came from a measurement, not from the damper itself.
    mismatch = None
    if basis in ("mat", "measured") and f_damper is not None and f is not None:
        mismatch = abs(_clamp01(f) - f_damper)
        if mismatch > DAMPER_TOL:
            flags.append("damper_mismatch")

    # With both MA channels wired the off-line distance becomes real.
    # Prefer the classical T-lever w residual; when ΔT is too small for f_t,
    # fall back to chord projection (and a T residual vs the humidity lever).
    deviation_gkg = None
    if basis == "measured":
        line_tol = LINE_TOL_GKG
        if f_t is not None:
            w_pred = _clamp01(f_t) * w_oa + (1.0 - _clamp01(f_t)) * w_ra
            deviation_gkg = (w_ma - w_pred) * 1000.0
        else:
            # OA≈RA: classical T-lever is junk — use chord projection and a
            # tighter humidity tolerance so mild-day off-chord still flags.
            line_tol = CLOSE_LINE_TOL_GKG
            deviation_gkg = chord_w_residual_gkg(
                t_oa, w_oa, t_ra, w_ra, t_ma, w_ma
            )
            if f_w is not None:
                t_pred = _clamp01(f_w) * t_oa + (1.0 - _clamp01(f_w)) * t_ra
                if abs(t_ma - t_pred) > TEMP_LINE_TOL_C:
                    if "off_mixing_line" not in flags:
                        flags.append("off_mixing_line")
        if (
            deviation_gkg is not None
            and abs(deviation_gkg) > line_tol
            and "off_mixing_line" not in flags
        ):
            flags.append("off_mixing_line")
        # Zoom-aware: when OA≈RA the process mini auto-frames the cluster,
        # so a sub-threshold g/kg residual still looks clearly off-chord.
        frac = chord_off_fraction(t_oa, w_oa, t_ra, w_ra, t_ma, w_ma)
        if (
            frac is not None
            and frac > CHORD_FRAC_TOL
            and "off_mixing_line" not in flags
        ):
            flags.append("off_mixing_line")

    ma_point = {
        "label": "MA",
        "t": round(t_ma, 2),
        "rh": round(rh_from_w(t_ma, w_ma), 1),
        "w": round(w_ma, 5),
        "color": MA_COLOR,
        "derived": basis != "measured",
        "basis": basis,
    }
    diagnostics = {
        "basis": basis,
        "oa_fraction": None if f is None else round(_clamp01(f), 3),
        "oa_fraction_raw": None if f is None else round(f, 3),
        "oa_fraction_temp": None if f_t is None else round(f_t, 3),
        "oa_fraction_humidity": None if f_w is None else round(f_w, 3),
        "oa_fraction_damper": None if f_damper is None else round(f_damper, 3),
        "damper_mismatch": None if mismatch is None else round(mismatch, 3),
        "line_deviation_g_kg": (
            None if deviation_gkg is None else round(deviation_gkg, 2)
        ),
        "flags": flags,
    }
    return ma_point, diagnostics


def _as_float(v) -> Optional[float]:
    try:
        f = float(v)
    except (TypeError, ValueError):
        return None
    return None if math.isnan(f) or math.isinf(f) else f


def mixed_air_from_points(points: list, all_points: dict) -> Tuple[
        Optional[dict], Optional[dict]]:
    """Convenience wrapper: pull OA/RA off a psy ``points`` list and MAT /
    MAH / OAD off an ``all_points`` dict, then derive.

    Tolerates the several spellings a real operator's point map may use for
    mixed air, since MAT is not part of the documented 26-point schema and
    arrives through the ``extra="allow"`` passthrough.
    """
    by_label = {p.get("label"): p for p in (points or []) if isinstance(p, dict)}
    mat = _first(all_points, ("MAT", "MA_T", "MIXED_AIR_TEMP", "MAT_1"))
    mah = _first(all_points, ("MAH", "MA_RH", "MIXED_AIR_RH"))
    oad = _first(all_points, ("OAD",))
    return derive_mixed_air(by_label.get("OA"), by_label.get("RA"),
                            mat=mat, mah=mah, oad=oad)


def _first(d: Optional[dict], keys) -> Optional[float]:
    if not isinstance(d, dict):
        return None
    for k in keys:
        if d.get(k) is not None:
            return _as_float(d[k])
    return None
