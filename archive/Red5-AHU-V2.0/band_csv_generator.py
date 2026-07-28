"""
band_csv_generator.py - Generates band strategy CSV guides.

Produces:
  1. band_guide.csv          - Universal B1-B10 lookup (same for all AHUs)
  2. {AHU_ID}_vav_proj.csv   - Per-AHU VAV zone delivery projections

Reads collector_config.json to discover AHUs and their VAVs.
Designed to run as a background task - call generate_all() on startup
or whenever equipment config / weather location changes.
"""
import os
import csv
import json
import math
import threading
import time
import logging

log = logging.getLogger('band_csv_generator')

# ---------------------------------------------------------------------------
# Psychrometric helpers (matching frontend psy engine exactly)
# ---------------------------------------------------------------------------

def get_w(t, rh):
    """Humidity ratio (kg/kg) from dry-bulb temperature and RH (%)."""
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
    """Moist-air enthalpy (kJ/kg) from T and W (kg/kg)."""
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
    Returns (sa_t_cc, sa_w, sa_rh, sa_t_delivery, sa_rh_delivery).
    """
    sa_t = band['sa_t']
    sa_rh = band['sa_rh']
    sa_w = get_w(sa_t, sa_rh)
    w_sat = get_w(sa_t, 100.0)
    if sa_w > w_sat:
        sa_w = w_sat * 0.98
        sa_rh = min(sa_rh, 98.0)
    reheat_t = band.get('reheat_t')
    sa_t_delivery = reheat_t if reheat_t is not None else sa_t
    sa_rh_delivery = get_rh(sa_t_delivery, sa_w)
    return sa_t, sa_w, sa_rh, sa_t_delivery, sa_rh_delivery


def compute_vav_zone(sa_t, sa_w, vav_index, num_vavs):
    """Compute expected VAV zone delivery for a given VAV."""
    mid = (num_vavs - 1) / 2.0
    heat_gain = 2.5 + (vav_index - mid) * 0.4
    moist_gain = 0.0008 + (vav_index - mid) * 0.0001
    zone_t = sa_t + heat_gain
    zone_w = sa_w + moist_gain
    return zone_t, zone_w, in_cz(zone_t, zone_w)

# ---------------------------------------------------------------------------
# CSV generation
# ---------------------------------------------------------------------------

def generate_universal_csv(output_dir):
    """Generate the universal band_guide.csv (no per-AHU or per-VAV columns)."""
    filepath = os.path.join(output_dir, 'band_guide.csv')

    header = [
        'Band', 'Band_Name',
        'OA_T_Lo', 'OA_T_Hi', 'OA_RH_Lo', 'OA_RH_Hi',
        'SA_T_CC_SP', 'SA_Reheat_T', 'SA_T_Delivery', 'SA_W_SP_gkg', 'SA_RH_Delivery',
        'OA_Damper_SP', 'CC_Mode', 'HC_Mode', 'HUM_Mode',
        'Control_Tag', 'Energy_Rank',
    ]

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
        rows.append(row)

    with open(filepath, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(rows)

    log.info("Generated %s (universal, %d bands)", filepath, len(rows))
    return filepath


def generate_vav_projection_csv(ahu_id, vav_ids, output_dir):
    """Generate per-AHU VAV zone projection CSV."""
    filename = ahu_id + '_vav_proj.csv'
    filepath = os.path.join(output_dir, filename)
    num_vavs = len(vav_ids)

    header = ['Band', 'Band_Name', 'SA_T_Delivery', 'SA_W_SP_gkg']
    for vid in vav_ids:
        header.extend([vid + '_Zone_T', vid + '_Zone_W_gkg', vid + '_CZ'])

    rows = []
    for band in BANDS:
        sa_t_cc, sa_w, sa_rh_cc, sa_t_del, sa_rh_del = compute_sa(band)
        row = [
            band['id'], band['name'],
            round(sa_t_del, 1),
            round(sa_w * 1000, 2),
        ]
        for vi, vid in enumerate(vav_ids):
            zt, zw, zcz = compute_vav_zone(sa_t_del, sa_w, vi, num_vavs)
            row.extend([round(zt, 1), round(zw * 1000, 2), 'IN' if zcz else 'OUT'])
        rows.append(row)

    with open(filepath, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(rows)

    log.info("Generated %s (%d bands, %d VAVs)", filepath, len(rows), num_vavs)
    return filepath


# ---------------------------------------------------------------------------
# Compact band-guide string for BACnet Description field
# ---------------------------------------------------------------------------

def format_band_guide_string(max_len=None):
    """Produce a compact pipe-delimited band-guide string suitable for
    writing to a BACnet CharacterString property (e.g. CSV_AHUnn.Description).

    Format per band (all 10 bands joined by '|'):
        <id>:<oaTlo>-<oaThi>/<oaRHlo>-<oaRHhi>:<saT>,<saRH>,<reheat|->,<oad>,<cc>,<hc>,<hum>

    Example (single band):  B1:-50-5/0-30:21,40,-,15,OFF,AGGRESSIVE,HUMIDIFY

    If `max_len` is provided and the string exceeds it, the tail is truncated
    and an ellipsis (...) is appended.
    """
    parts = []
    for b in BANDS:
        reheat = b['reheat_t']
        reheat_s = '-' if reheat is None else str(reheat)
        parts.append(
            '{id}:{t0}-{t1}/{r0}-{r1}:{sa},{srh},{rh},{oad},{cc},{hc},{hum}'.format(
                id=b['id'],
                t0=b['oa_t'][0], t1=b['oa_t'][1],
                r0=b['oa_rh'][0], r1=b['oa_rh'][1],
                sa=b['sa_t'], srh=b['sa_rh'], rh=reheat_s,
                oad=b['oa_damper'], cc=b['cc'], hc=b['hc'], hum=b['hum'],
            )
        )
    s = '|'.join(parts)
    if max_len is not None and len(s) > max_len:
        s = s[:max_len - 3] + '...'
    return s


def format_band_description(band):
    """Compact description string for the CURRENTLY ACTIVE band (just ONE band).
    Accepts a slim band dict (as kept in collector.py) or a full one from BANDS here —
    missing `name` and `tag` are looked up by `id` against this module's BANDS list.

    Format: <id>:<name>|SA=<saT>C/<saRH>%|RH=<reheat|->|OAD=<oad>%|CC=<cc>|HC=<hc>|HUM=<hum>|TAG=<tag>
    Example: B5:PASS-THROUGH|SA=23.5C/50%|RH=-|OAD=100%|CC=OFF|HC=OFF|HUM=OFF|TAG=PASS-THROUGH
    """
    bid = band.get('id', '?')
    # Fall back to BANDS metadata for name/tag if caller only supplied a slim dict
    _meta = next((b for b in BANDS if b['id'] == bid), {})
    name = band.get('name') or _meta.get('name', '?')
    tag = band.get('tag') or _meta.get('tag', '-')

    reheat = band.get('reheat_t')
    reheat_s = '-' if reheat is None else '{}C'.format(reheat)
    return '{id}:{name}|SA={sa}C/{srh}%|RH={rh}|OAD={oad}%|CC={cc}|HC={hc}|HUM={hum}|TAG={tag}'.format(
        id=bid, name=name,
        sa=band.get('sa_t', '-'), srh=band.get('sa_rh', '-'), rh=reheat_s,
        oad=band.get('oa_damper', '-'), cc=band.get('cc', '-'), hc=band.get('hc', '-'), hum=band.get('hum', '-'),
        tag=tag
    )


def generate_all(config_path=None, output_dir=None):
    """Generate universal band_guide.csv + per-AHU VAV projection CSVs."""
    if config_path is None:
        for p in ['/root/data/configs/collector_config.json', 'collector_config.json', '/root/data/collector_config.json']:
            if os.path.exists(p):
                config_path = p
                break
    if output_dir is None:
        output_dir = os.path.dirname(config_path) if config_path else '.'

    if not config_path or not os.path.exists(config_path):
        log.warning("collector_config.json not found - skipping CSV generation")
        return []

    generated = []

    # 1. Universal band guide (one file for all AHUs)
    path = generate_universal_csv(output_dir)
    generated.append(path)

    # 2. Per-AHU VAV projections
    with open(config_path, 'r') as f:
        config = json.load(f)

    ahu_groups = config.get('ahu_groups', {})
    for ahu_id, ahu_cfg in ahu_groups.items():
        vav_ids = ahu_cfg.get('vavs', [])
        if not vav_ids:
            vav_ids = [ahu_id + '-VAV-' + str(i + 1).zfill(2) for i in range(6)]
        path = generate_vav_projection_csv(ahu_id, vav_ids, output_dir)
        generated.append(path)

    log.info("Band CSV generation complete: %d files", len(generated))
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
            log.error("Band CSV generation error: %s", e)
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
    log.info("Band CSV background generator started (interval=%ds)", interval)


def stop_background():
    """Stop the background generation thread."""
    _bg_stop.set()
    if _bg_thread:
        _bg_thread.join(timeout=5)

# ---------------------------------------------------------------------------
