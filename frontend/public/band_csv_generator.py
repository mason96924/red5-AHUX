"""
band_csv_generator.py — Generates per-AHU band strategy CSV guides.

Reads collector_config.json to discover AHUs and their VAVs, then produces
a CSV lookup table per AHU with:
  - Band classification (B1-B10) and OA condition ranges
  - SA setpoints (T, W, RH) the AHU should target
  - Coil & humidifier commands
  - Per-VAV expected zone delivery (T, W, CZ compliance)

Output: data/{AHU_ID}_band_guide.csv (flat directory)

Designed to run as a background task — call generate_all() on startup
or whenever equipment config / weather location changes.
"""
import os
import csv
import json
import math
import threading
import time
import logging

log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Psychrometric helpers (matching frontend psy engine exactly)
# ---------------------------------------------------------------------------

def get_w(t, rh):
    """Humidity ratio (kg/kg) from dry-bulb temperature (°C) and RH (%)."""
    es = 0.6108 * math.exp((17.27 * t) / (t + 237.3))
    e = es * rh / 100.0
    w = 0.622 * e / (101.325 - e)
    return max(w, 0.0)


def get_rh(t, w):
    """Approximate RH (%) from dry-bulb temperature and humidity ratio."""
    e = (w * 101.325) / (0.622 + w)
    es = 0.6108 * math.exp((17.27 * t) / (t + 237.3))
    if es < 1e-9:
        return 0.0
    return min(max(e / es * 100.0, 0.0), 100.0)


def enthalpy(t, w):
    """Moist-air enthalpy (kJ/kg) from T (°C) and W (kg/kg)."""
    return 1.006 * t + w * (2501.0 + 1.86 * t)


def in_cz(zt, zw):
    """Check if zone point is inside Givoni Comfort Zone."""
    if zt < 20.0 or zt > 27.0:
        return False
    w_lo = get_w(zt, 20.0)
    w_hi = get_w(zt, 80.0)
    return w_lo <= zw <= w_hi

# ---------------------------------------------------------------------------
# Band definitions (matching control_algorithms.md Section 10.8)
# ---------------------------------------------------------------------------

BANDS = [
    {
        'id': 'B1', 'name': 'COLD-DRY',
        'oa_t': (-50, 5), 'oa_rh': (0, 30),
        'sa_t': 21.0, 'sa_rh': 40, 'reheat_t': None,
        'oa_damper': 15, 'cc': 'OFF', 'hc': 'AGGRESSIVE', 'hum': 'HUMIDIFY',
        'tag': 'HEATING + HUMIDIFY', 'energy_rank': 9,
    },
    {
        'id': 'B2', 'name': 'COLD-MOD',
        'oa_t': (5, 15), 'oa_rh': (30, 60),
        'sa_t': 19.5, 'sa_rh': 35, 'reheat_t': None,
        'oa_damper': 15, 'cc': 'OFF', 'hc': 'MODERATE', 'hum': 'COND_HUM',
        'tag': 'HEATING (+/-HUM)', 'energy_rank': 8,
    },
    {
        'id': 'B3', 'name': 'COOL-DRY',
        'oa_t': (15, 20), 'oa_rh': (0, 30),
        'sa_t': 19.0, 'sa_rh': 45, 'reheat_t': None,
        'oa_damper': 30, 'cc': 'OFF', 'hc': 'OFF', 'hum': 'HUMIDIFY',
        'tag': 'RH PRIORITY - HUMIDIFY', 'energy_rank': 6,
    },
    {
        'id': 'B4', 'name': 'ECONOMIZER',
        'oa_t': (18, 22), 'oa_rh': (30, 50),
        'sa_t': 20.0, 'sa_rh': 40, 'reheat_t': None,
        'oa_damper': 100, 'cc': 'OFF', 'hc': 'OFF', 'hum': 'OFF',
        'tag': 'ECONOMIZER', 'energy_rank': 2,
    },
    {
        'id': 'B5', 'name': 'PASS-THROUGH',
        'oa_t': (22, 25), 'oa_rh': (40, 60),
        'sa_t': 23.5, 'sa_rh': 50, 'reheat_t': None,
        'oa_damper': 100, 'cc': 'OFF', 'hc': 'OFF', 'hum': 'OFF',
        'tag': 'PASS-THROUGH', 'energy_rank': 1,
    },
    {
        'id': 'B6', 'name': 'WARM-MOD',
        'oa_t': (25, 27), 'oa_rh': (50, 70),
        'sa_t': 25.0, 'sa_rh': 55, 'reheat_t': None,
        'oa_damper': 50, 'cc': 'LIGHT', 'hc': 'OFF', 'hum': 'ACCEPT',
        'tag': 'RH PRIORITY - OA REDUCE', 'energy_rank': 5,
    },
    {
        'id': 'B7', 'name': 'WARM-HUM',
        'oa_t': (27, 32), 'oa_rh': (60, 80),
        'sa_t': 12.0, 'sa_rh': 95, 'reheat_t': 23.0,
        'oa_damper': 15, 'cc': 'AGGRESSIVE', 'hc': 'REHEAT', 'hum': 'SUBCOOL_REHEAT',
        'tag': 'CC SUBCOOL + REHEAT', 'energy_rank': 7,
    },
    {
        'id': 'B8', 'name': 'HOT-HUM',
        'oa_t': (32, 38), 'oa_rh': (70, 100),
        'sa_t': 13.0, 'sa_rh': 95, 'reheat_t': 22.0,
        'oa_damper': 15, 'cc': 'MAXIMUM', 'hc': 'REHEAT', 'hum': 'SUBCOOL_REHEAT',
        'tag': 'MAX COOL + SUBCOOL DEHUMID', 'energy_rank': 10,
    },
    {
        'id': 'B9', 'name': 'HOT-DRY',
        'oa_t': (35, 50), 'oa_rh': (0, 30),
        'sa_t': 15.0, 'sa_rh': 40, 'reheat_t': None,
        'oa_damper': 15, 'cc': 'AGGRESSIVE', 'hc': 'OFF', 'hum': 'OFF',
        'tag': 'COOLING ONLY - DRY AIR', 'energy_rank': 4,
    },
    {
        'id': 'B10', 'name': 'EXTREME-HUM',
        'oa_t': (30, 50), 'oa_rh': (85, 100),
        'sa_t': 11.0, 'sa_rh': 95, 'reheat_t': 22.0,
        'oa_damper': 15, 'cc': 'MAXIMUM', 'hc': 'REHEAT', 'hum': 'SUBCOOL_REHEAT',
        'tag': 'EXTREME HUMID - MAX SUBCOOL', 'energy_rank': 3,
    },
]


def compute_sa(band):
    """Compute SA setpoints for a band.
    Returns (sa_t_cc, sa_w, sa_rh, sa_t_delivery) where sa_t_delivery
    is the post-reheat temperature for SUBCOOL_REHEAT bands.
    """
    sa_t = band['sa_t']
    sa_rh = band['sa_rh']
    sa_w = get_w(sa_t, sa_rh)
    # Saturation cap
    w_sat = get_w(sa_t, 100.0)
    if sa_w > w_sat:
        sa_w = w_sat * 0.98
        sa_rh = min(sa_rh, 98.0)
    # Post-reheat: SA_W stays (dehumidified), but SA_T rises to reheat target
    reheat_t = band.get('reheat_t')
    sa_t_delivery = reheat_t if reheat_t is not None else sa_t
    sa_rh_delivery = get_rh(sa_t_delivery, sa_w)
    return sa_t, sa_w, sa_rh, sa_t_delivery, sa_rh_delivery


def compute_vav_zone(sa_t, sa_w, vav_index, num_vavs):
    """Compute expected VAV zone delivery for a given VAV.
    Uses distributed heat/moisture gains per VAV index.
    """
    mid = (num_vavs - 1) / 2.0
    heat_gain = 2.5 + (vav_index - mid) * 0.4
    moist_gain = 0.0008 + (vav_index - mid) * 0.0001
    zone_t = sa_t + heat_gain
    zone_w = sa_w + moist_gain
    return zone_t, zone_w, in_cz(zone_t, zone_w)

# ---------------------------------------------------------------------------
# CSV generation
# ---------------------------------------------------------------------------

def generate_ahu_csv(ahu_id, vav_ids, output_dir):
    """Generate a band strategy CSV guide for a single AHU."""
    filename = f"{ahu_id}_band_guide.csv"
    filepath = os.path.join(output_dir, filename)
    num_vavs = len(vav_ids)

    # Build header
    header = [
        'Band', 'Band_Name',
        'OA_T_Lo', 'OA_T_Hi', 'OA_RH_Lo', 'OA_RH_Hi',
        'SA_T_CC_SP', 'SA_Reheat_T', 'SA_T_Delivery', 'SA_W_SP_gkg', 'SA_RH_Delivery',
        'OA_Damper_SP', 'CC_Mode', 'HC_Mode', 'HUM_Mode',
        'Control_Tag', 'Energy_Rank',
    ]
    for vid in vav_ids:
        header.extend([f'{vid}_Zone_T', f'{vid}_Zone_W_gkg', f'{vid}_CZ'])

    rows = []
    for band in BANDS:
        sa_t_cc, sa_w, sa_rh_cc, sa_t_del, sa_rh_del = compute_sa(band)
        reheat_t = band.get('reheat_t')
        row = [
            band['id'], band['name'],
            band['oa_t'][0], band['oa_t'][1],
            band['oa_rh'][0], band['oa_rh'][1],
            round(sa_t_cc, 1),
            round(reheat_t, 1) if reheat_t is not None else '-',
            round(sa_t_del, 1),
            round(sa_w * 1000, 2),
            round(sa_rh_del, 0),
            band['oa_damper'], band['cc'], band['hc'], band['hum'],
            band['tag'], band['energy_rank'],
        ]
        for vi, vid in enumerate(vav_ids):
            zt, zw, zcz = compute_vav_zone(sa_t_del, sa_w, vi, num_vavs)
            row.extend([round(zt, 1), round(zw * 1000, 2), 'IN' if zcz else 'OUT'])
        rows.append(row)

    with open(filepath, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(rows)

    log.info(f"Generated {filepath} ({len(rows)} bands, {num_vavs} VAVs)")
    return filepath


def generate_all(config_path=None, output_dir=None):
    """Generate band strategy CSVs for all AHUs defined in collector_config.json."""
    if config_path is None:
        # Try common locations
        for p in ['collector_config.json', '/root/data/collector_config.json',
                   os.path.join(os.path.dirname(__file__), 'collector_config.json')]:
            if os.path.exists(p):
                config_path = p
                break
    if output_dir is None:
        output_dir = os.path.dirname(config_path) if config_path else '.'

    if not config_path or not os.path.exists(config_path):
        log.warning("collector_config.json not found — skipping CSV generation")
        return []

    with open(config_path, 'r') as f:
        config = json.load(f)

    ahu_groups = config.get('ahu_groups', {})
    if not ahu_groups:
        log.warning("No ahu_groups in config — skipping CSV generation")
        return []

    generated = []
    for ahu_id, ahu_cfg in ahu_groups.items():
        vav_ids = ahu_cfg.get('vavs', [])
        if not vav_ids:
            vav_ids = [f'{ahu_id}-VAV-{i+1:02d}' for i in range(6)]
        path = generate_ahu_csv(ahu_id, vav_ids, output_dir)
        generated.append(path)

    log.info(f"Band CSV generation complete: {len(generated)} AHU files")
    return generated

# ---------------------------------------------------------------------------
# Background runner
# ---------------------------------------------------------------------------

_bg_thread = None
_bg_stop = threading.Event()

def _bg_loop(config_path, output_dir, interval=300):
    """Background loop: regenerate CSVs every `interval` seconds."""
    while not _bg_stop.is_set():
        try:
            generate_all(config_path, output_dir)
        except Exception as e:
            log.error(f"Band CSV generation error: {e}")
        _bg_stop.wait(interval)


def start_background(config_path=None, output_dir=None, interval=300):
    """Start background CSV generation thread."""
    global _bg_thread
    if _bg_thread and _bg_thread.is_alive():
        return
    _bg_stop.clear()
    _bg_thread = threading.Thread(
        target=_bg_loop, args=(config_path, output_dir, interval),
        daemon=True, name='band-csv-gen'
    )
    _bg_thread.start()
    log.info(f"Band CSV background generator started (interval={interval}s)")


def stop_background():
    """Stop the background generation thread."""
    _bg_stop.set()
    if _bg_thread:
        _bg_thread.join(timeout=5)


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO, format='%(asctime)s %(message)s')
    import sys
    cfg = sys.argv[1] if len(sys.argv) > 1 else 'collector_config.json'
    out = sys.argv[2] if len(sys.argv) > 2 else os.path.dirname(cfg) or '.'
    files = generate_all(cfg, out)
    for f in files:
        print(f"  -> {f}")
