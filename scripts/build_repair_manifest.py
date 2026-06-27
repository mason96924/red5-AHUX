#!/usr/bin/env python3
"""
build_repair_manifest.py
========================
Regenerate `archive/Red5-Studio-V1.9/repair_manifest.json` -- the SINGLE
source of truth for which files Repair Mode can flash onto a V1.9
controller, and what their canonical sha256 / byte-count is.

Why this exists:
    The UI rows in update.html, the allow-list in upload_service.py, the
    hot-reload dropdown, and the reload allow-list all USED to live as
    four independent hand-maintained lists.  They drifted (newly-added
    files got into 2-of-4, never reached the operator).  Now the four
    derive their lists from this single JSON.

    The sha256 + byte-count let upload_service.py reject a Repair Mode
    upload whose contents don't match what the dev environment expects
    -- catches the "operator dragged an outdated local file into the
    file picker" failure mode that bit us on controller 192.168.1.208.

Usage:
    python3 scripts/build_repair_manifest.py
"""
import hashlib
import json
import os
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARCHIVE   = os.path.join(REPO_ROOT, 'archive', 'Red5-Studio-V1.9')

# (name, kind, label, desc) -- display order is the order in this list.
ENTRIES = [
    # plug-ins (Python services that register Flask routes)
    ('upload_service.py',           'plugin', 'Upload Service',           'Bundle upload + chunked endpoints + disk-status + Repair Mode'),
    ('weather_service.py',          'plugin', 'Weather Service',          'Open-Meteo + tomorrow forecast routes'),
    ('band_service.py',             'plugin', 'Band Service',             'B1-B10 CSV generator + guide download'),
    ('band_overrides_service.py',   'plugin', 'Band Overrides Service',   'Per-tenant AHU RH band overrides + apply-to-controller'),
    ('telemetry_service.py',        'plugin', 'Telemetry Service',        '/api/data, /api/write-point, collector config'),
    ('_bridges_lib.py',             'plugin', '_bridges_lib.py',          'Shared helpers (telemetry tap, write-queue ACL, status registry)'),
    ('bridges_admin_service.py',    'plugin', 'Bridges Admin',            '/api/bridges/{config,status,test} endpoints'),
    ('webhook_bridge_service.py',   'plugin', 'Webhook Bridge',           'POST telemetry to a URL (stdlib only, no extra deps)'),
    ('mqtt_bridge_service.py',      'plugin', 'MQTT Bridge',              'Publish/subscribe (needs paho-mqtt)'),
    ('modbus_bridge_service.py',    'plugin', 'Modbus TCP Bridge',        'Expose telemetry as holding registers (needs pymodbus)'),
    ('ws_bridge_service.py',        'plugin', 'WebSocket Bridge',         'Push telemetry to live clients (needs websockets)'),
    ('bacnet_diag_service.py',      'plugin', 'BACnet Diagnose Service',  '/api/bacnet/diagnose-config -- detect name-based BACnet targets'),
    ('audit_log_service.py',        'plugin', 'Audit Log Service',        '/api/audit-log -- band-apply / write-point / repair-mode log (100 KB rotating)'),
    # The manifest itself -- listed so the operator can always replace
    # it from the UI.  sha256 is intentionally None (set at the bottom)
    # because a hash that referenced itself would be a fixed-point
    # problem; upload_service.py treats `name == 'repair_manifest.json'`
    # as integrity-check-exempt anyway.
    ('repair_manifest.json',        'ui',     'repair_manifest.json',     'Repair Mode allow-list + sha256 source of truth (this file)'),
    # UI / static files
    ('update.html',                 'ui',     'update.html',              'This page (Repair Mode + Data Bridges UI)'),
    ('dashboard.html',              'ui',     'dashboard.html',           'Main dashboard shell'),
    ('dashboard.compiled.js',       'ui',     'dashboard.compiled.js',    'Compiled React dashboard bundle (loaded by dashboard.html)'),
    ('equipment_mapper.html',       'ui',     'equipment_mapper.html',    'Config Tool'),
    ('landing.html',                'ui',     'landing.html',             'Landing page (password / login screen)'),
    ('setup.html',                  'ui',     'setup.html',               'Setup Walk entry HTML (post-login landing on V1.9)'),
    ('setup_walk.compiled.js',      'ui',     'setup_walk.compiled.js',   'Setup Walk compiled React bundle (loaded by setup.html)'),
    ('data_bridges_guide.md',       'ui',     'data_bridges_guide.md',    'Plain-language Data Bridges setup guide'),
    ('opt_sa_insight.md',           'ui',     'opt_sa_insight.md',        'Opt-SA strategy explainer (6th-grader mode)'),
    ('configs/bridges.json',        'ui',     'bridges.json',             'Bridge config (broker URLs, write_allowlist, etc.)'),
    ('js/audit_log.js',             'ui',     'audit_log.js',             'Audit-log toolbar button + popup (loaded by dashboard.html)'),
]

# Files allow-listed for upload/download but NOT shown in the operator UI.
EXTRA_ALLOWED_NOT_IN_UI = [
    ('psy_3d.html',                 'ui',     'psy_3d.html',              '3D psychrometric chart (niche tool)'),
]

# Subset of plug-ins whose register() functions are safe to hot-reload via
# /api/repair/reload-module without a Flask restart.
HOT_RELOADABLE = {
    'upload_service.py', 'weather_service.py',
    'band_service.py',   'band_overrides_service.py',
    'telemetry_service.py',
    'webhook_bridge_service.py', 'mqtt_bridge_service.py',
    'modbus_bridge_service.py',  'ws_bridge_service.py',
    'bridges_admin_service.py',  'bacnet_diag_service.py',
    'audit_log_service.py',
}


def main():
    manifest = {
        'version': 1,
        'generated_from': 'archive/Red5-Studio-V1.9/',
        'note': 'Single source of truth for the Repair Mode allow-list. '
                'Regenerate with scripts/build_repair_manifest.py.',
        'files': [],
    }
    missing = []
    ui_set = {(e[0], e[1], e[2], e[3]) for e in ENTRIES}
    for name, kind, label, desc in ENTRIES + EXTRA_ALLOWED_NOT_IN_UI:
        path = os.path.join(ARCHIVE, name)
        if not os.path.isfile(path):
            missing.append(name)
            continue
        with open(path, 'rb') as f:
            data = f.read()
        # The manifest cannot embed its OWN sha256 -- that would create a
        # fixed-point problem (the hash changes the moment we write it).
        # Mark it `null` and special-case it in the verifier instead.
        is_self = (name == 'repair_manifest.json')
        manifest['files'].append({
            'name': name,
            'kind': kind,
            'label': label,
            'desc': desc,
            'size': None if is_self else len(data),
            'sha256': None if is_self else hashlib.sha256(data).hexdigest(),
            'show_in_ui': (name, kind, label, desc) in ui_set,
            'hot_reload': name in HOT_RELOADABLE,
        })

    out_path = os.path.join(ARCHIVE, 'repair_manifest.json')
    with open(out_path, 'w') as f:
        json.dump(manifest, f, indent=2)
    print('Wrote {} ({} entries)'.format(out_path, len(manifest['files'])))
    if missing:
        print('WARNING: skipped {} missing file(s):'.format(len(missing)))
        for m in missing:
            print('  - {}'.format(m))
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
