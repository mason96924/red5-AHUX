"""
Monthly B1-B10 energy expenditure per hospital site.
Uses published monthly climate normals → synthesizes hourly OA → applies the
same classifyBand() / enthalpy logic that runs on the controller → integrates
Δh per band per month.

Not a controller feature — one-shot analysis requested by the user.
"""
import math
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from datetime import datetime, timedelta

# ===== Psychrometry (mirror of psy-3d-engine.js) =====
def sat_pressure(T_C):
    # Antoine-equivalent (kPa)
    return 0.6108 * math.exp(17.27 * T_C / (T_C + 237.3))

def humidity_ratio(T_C, RH_pct, P=101.325):
    pw = sat_pressure(T_C) * (RH_pct / 100.0)
    return 0.622 * pw / (P - pw)

def enthalpy(T_C, W):
    # kJ/kg dry air
    return 1.006 * T_C + W * (2501 + 1.86 * T_C)

# ===== BANDS (mirror of psy-3d-engine.js) =====
BANDS = [
    {"id": "B1",  "oa_t": (-50, 5),   "oa_rh": (0, 30),   "sa_t": 21.0, "sa_rh": 40, "oa_damper": 15},
    {"id": "B2",  "oa_t": (5, 15),    "oa_rh": (30, 60),  "sa_t": 19.5, "sa_rh": 35, "oa_damper": 15},
    {"id": "B3",  "oa_t": (15, 20),   "oa_rh": (0, 30),   "sa_t": 19.0, "sa_rh": 45, "oa_damper": 30},
    {"id": "B4",  "oa_t": (18, 22),   "oa_rh": (30, 50),  "sa_t": 20.0, "sa_rh": 40, "oa_damper": 100},
    {"id": "B5",  "oa_t": (22, 25),   "oa_rh": (40, 60),  "sa_t": 23.5, "sa_rh": 50, "oa_damper": 100},
    {"id": "B6",  "oa_t": (25, 27),   "oa_rh": (50, 70),  "sa_t": 25.0, "sa_rh": 55, "oa_damper": 50},
    {"id": "B10", "oa_t": (30, 50),   "oa_rh": (85, 100), "sa_t": 11.0, "sa_rh": 95, "oa_damper": 15},
    {"id": "B7",  "oa_t": (27, 32),   "oa_rh": (60, 80),  "sa_t": 12.0, "sa_rh": 95, "oa_damper": 15},
    {"id": "B8",  "oa_t": (32, 38),   "oa_rh": (70, 100), "sa_t": 13.0, "sa_rh": 95, "oa_damper": 15},
    {"id": "B9",  "oa_t": (35, 50),   "oa_rh": (0, 30),   "sa_t": 15.0, "sa_rh": 40, "oa_damper": 15},
]

def classify_band(T, RH):
    # Exact band match
    for b in BANDS:
        if b["oa_t"][0] <= T <= b["oa_t"][1] and b["oa_rh"][0] <= RH <= b["oa_rh"][1]:
            return b
    # Fallback: nearest by Euclidean (T-norm, RH-norm) distance to band center
    best, bestd = BANDS[0], 1e9
    for b in BANDS:
        ct = (b["oa_t"][0] + b["oa_t"][1]) / 2
        cr = (b["oa_rh"][0] + b["oa_rh"][1]) / 2
        d = ((T - ct) / 50) ** 2 + ((RH - cr) / 100) ** 2
        if d < bestd:
            bestd, best = d, b
    return best


# ===== Climate normals (WMO / Bureau of Meteorology / KMA) =====
# monthly mean Tmin/Tmax/RH_avg at 09:00 and 15:00
# Source refs abbreviated: BoM Perth 2024, BoM Adelaide 2024, KMA Seoul 2024.
CITIES = {
    "Perth Children's Hospital (Perth, AU)": {
        # BoM Perth Airport station 009021 long-term means
        #             J    F    M    A    M    J    J    A    S    O    N    D
        "tmin": np.array([17.6,17.9,16.2,13.4,10.5, 8.5, 7.6, 7.8, 9.0,10.5,13.1,15.5]),
        "tmax": np.array([31.8,32.0,30.1,26.2,22.6,19.2,18.2,18.9,20.5,23.0,26.2,29.3]),
        "rh_mean": np.array([50,52,55,59,66,72,73,70,65,59,54,51]),
    },
    "NRAH (Adelaide, AU)": {
        # BoM Adelaide Kent Town 023090 long-term means
        "tmin": np.array([17.0,17.1,15.3,12.3, 9.9, 7.8, 7.0, 7.5, 9.0,10.9,13.4,15.4]),
        "tmax": np.array([29.4,29.5,26.4,22.7,19.0,16.1,15.3,16.7,19.1,22.1,25.3,27.2]),
        "rh_mean": np.array([45,48,49,54,63,71,72,66,59,53,49,46]),
    },
    "Hanyang Univ Hospital (Seoul, KR)": {
        # KMA Seoul station 108 long-term means
        "tmin": np.array([-5.9,-3.4, 1.6, 7.8,13.2,18.2,21.9,22.4,17.7,10.8, 4.3,-2.5]),
        "tmax": np.array([ 1.5, 4.7,10.4,17.8,23.0,27.1,28.6,29.6,25.8,19.8,11.6, 4.3]),
        "rh_mean": np.array([59,57,60,58,63,71,79,75,69,64,63,61]),
    },
}


def synthesize_hourly(city_data, year=2025):
    """Generate 8760 hourly (T, RH) pairs from monthly climate normals.
    Daily sinusoid between tmin (~06:00) and tmax (~15:00); RH pulls inverse
    of T so midday is drier, adds small stochastic noise for realism.
    """
    rng = np.random.default_rng(42)
    hours = []
    t_vals = []
    rh_vals = []
    start = datetime(year, 1, 1)
    for h in range(8760):
        dt = start + timedelta(hours=h)
        m = dt.month - 1
        # Linear interp between adjacent months for smooth month-boundary
        next_m = (m + 1) % 12
        # fraction through current month [0,1)
        days_in_m = (datetime(year, m + 2, 1) - datetime(year, m + 1, 1)).days \
            if m < 11 else (datetime(year + 1, 1, 1) - datetime(year, 12, 1)).days
        frac = (dt.day - 1 + dt.hour / 24) / days_in_m
        tmin = city_data["tmin"][m] * (1 - frac) + city_data["tmin"][next_m] * frac
        tmax = city_data["tmax"][m] * (1 - frac) + city_data["tmax"][next_m] * frac
        rh_m = city_data["rh_mean"][m] * (1 - frac) + city_data["rh_mean"][next_m] * frac
        # Daily sinusoid: min at 06:00, max at 15:00
        phase = 2 * math.pi * (dt.hour - 6) / 24  # 0 at 06:00
        # cos(phase) swings -1..+1; we want -1 at 06:00 → cold, +1 at 18:00 → hot
        # Better: peak ~15:00 → offset 15-6=9h → phase shift
        phase2 = 2 * math.pi * (dt.hour - 15) / 24
        swing = math.cos(phase2)  # +1 at 15:00, -1 at 03:00
        T = (tmin + tmax) / 2 + (tmax - tmin) / 2 * swing
        # RH anticorrelated with T within the day
        RH = rh_m - swing * 12 + rng.normal(0, 3)
        RH = max(5, min(100, RH))
        T += rng.normal(0, 0.8)
        hours.append(dt)
        t_vals.append(T)
        rh_vals.append(RH)
    return hours, np.array(t_vals), np.array(rh_vals)


def monthly_band_energy(hours, T, RH):
    """Return dict: month_idx (0-11) → kJ/kg accumulated under B1-B10 strategy."""
    monthly = np.zeros(12)
    for h, t, rh in zip(hours, T, RH):
        b = classify_band(t, rh)
        W_oa = humidity_ratio(t, rh)
        h_oa = enthalpy(t, W_oa)
        W_sa = humidity_ratio(b["sa_t"], b["sa_rh"])
        h_sa = enthalpy(b["sa_t"], W_sa)
        fOA = b["oa_damper"] / 100.0
        dpk = abs(fOA * (h_oa - h_sa))
        monthly[h.month - 1] += dpk
    return monthly


def monthly_baseline_energy(hours, T, RH, sa_t=13.0, sa_rh=50):
    """Conventional fixed-SA baseline (100% OA, no band logic)."""
    W_sa = humidity_ratio(sa_t, sa_rh)
    h_sa = enthalpy(sa_t, W_sa)
    monthly = np.zeros(12)
    for h, t, rh in zip(hours, T, RH):
        W_oa = humidity_ratio(t, rh)
        h_oa = enthalpy(t, W_oa)
        monthly[h.month - 1] += abs(h_oa - h_sa)
    return monthly


# ===== Run analysis =====
results = {}
for name, data in CITIES.items():
    hours, T, RH = synthesize_hourly(data)
    band_m = monthly_band_energy(hours, T, RH)
    base_m = monthly_baseline_energy(hours, T, RH)
    results[name] = {"band": band_m, "base": base_m}
    print(f"{name}")
    print(f"  Annual B1-B10: {band_m.sum()/1000:.1f}k kJ/kg  |  "
          f"Fixed-SA baseline: {base_m.sum()/1000:.1f}k kJ/kg  |  "
          f"Saving: {(1 - band_m.sum()/base_m.sum())*100:.1f}%")

# ===== Plot =====
months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
x = np.arange(12)
width = 0.28

fig, axes = plt.subplots(3, 1, figsize=(13, 12), sharex=True)
fig.patch.set_facecolor("#0f172a")

colors_band = {"Perth Children's Hospital (Perth, AU)": "#10b981",
               "NRAH (Adelaide, AU)":                    "#06b6d4",
               "Hanyang Univ Hospital (Seoul, KR)":      "#f59e0b"}

for ax, (name, d) in zip(axes, results.items()):
    c = colors_band[name]
    ax.set_facecolor("#020617")
    ax.bar(x - width/2, d["base"] / 1000, width,
           label="Fixed-SA baseline (13°C / 50%)",
           color="#7c3aed", alpha=.85, edgecolor="#4c1d95")
    ax.bar(x + width/2, d["band"] / 1000, width,
           label="B1-B10 strategy",
           color=c, alpha=.95, edgecolor=c)
    # Saving annotation per month
    for i in range(12):
        pct = (1 - d["band"][i] / d["base"][i]) * 100 if d["base"][i] > 1 else 0
        ax.text(i, max(d["band"][i], d["base"][i]) / 1000 + 0.3,
                f"-{pct:.0f}%", ha="center", fontsize=8,
                color="#94a3b8", fontweight="bold")
    ax.set_title(name, color="#e2e8f0", fontsize=13, fontweight="bold", loc="left")
    ax.set_ylabel("Monthly Δh  (k kJ/kg)", color="#cbd5e1", fontsize=10)
    ax.tick_params(colors="#94a3b8")
    ax.grid(axis="y", alpha=.15, color="#475569")
    for spine in ax.spines.values():
        spine.set_color("#334155")
    leg = ax.legend(loc="upper left", facecolor="#0f172a",
                    edgecolor="#334155", labelcolor="#cbd5e1", fontsize=9)
    # Year-total annotation
    ann = (1 - d["band"].sum() / d["base"].sum()) * 100
    ax.text(.99, .95,
            f"Annual total\n"
            f"B1-B10: {d['band'].sum()/1000:.1f}k kJ/kg\n"
            f"Baseline: {d['base'].sum()/1000:.1f}k kJ/kg\n"
            f"Saving: -{ann:.0f}%",
            transform=ax.transAxes, ha="right", va="top",
            fontsize=9, color="#e2e8f0",
            family="monospace",
            bbox=dict(facecolor="#020617", edgecolor="#334155",
                      boxstyle="round,pad=.5"))

axes[-1].set_xticks(x)
axes[-1].set_xticklabels(months, color="#cbd5e1")
axes[-1].set_xlabel("Month", color="#cbd5e1", fontsize=10)

fig.suptitle("Monthly air-side energy per site — B1-B10 strategy vs. fixed-SA baseline",
             color="#e2e8f0", fontsize=14, fontweight="bold", y=.995)
fig.tight_layout(rect=[0, 0, 1, 0.98])
fig.savefig("/tmp/band_monthly_energy.png", dpi=130, facecolor=fig.get_facecolor())
print("\nSaved /tmp/band_monthly_energy.png")
