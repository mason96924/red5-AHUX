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
    ('auth_service.py',             'plugin', 'Auth Service',             'Stage B login, tokens, user management, config-gate enforcement'),
    ('pages_service.py',            'plugin', 'Pages Service',            'GET / → access.html, /access.html, /setup.html, POST /api/config/unlock'),
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
    ('dashboard.tailwind.css',      'ui',     'dashboard.tailwind.css',   'Pre-extracted Tailwind CSS (replaces cdn.tailwindcss.com runtime)'),
    ('img/psy_silhouette.jpg',      'ui',     'img/psy_silhouette.jpg',   '3D psy-chart snapshot used as Setup Walk centre piece'),
    ('equipment_mapper.html',       'ui',     'equipment_mapper.html',    'Config Tool'),
    ('landing.html',                'ui',     'landing.html',             'Landing page (password / login screen)'),
    ('access.html',                 'ui',     'access.html',              'Admin user-management page (master-key gate)'),
    ('setup.html',                  'ui',     'setup.html',               'Setup Walk entry HTML (post-login landing on V1.9)'),
    ('setup_walk.compiled.js',      'ui',     'setup_walk.compiled.js',   'Setup Walk compiled React bundle (loaded by setup.html)'),
    ('data_bridges_guide.md',       'ui',     'data_bridges_guide.md',    'Plain-language Data Bridges setup guide'),
    ('opt_sa_insight.md',           'ui',     'opt_sa_insight.md',        'Opt-SA strategy explainer (6th-grader mode)'),
    ('configs/bridges.json',        'ui',     'bridges.json',             'Bridge config (broker URLs, write_allowlist, etc.)'),
    ('js/audit_log.js',             'ui',     'audit_log.js',             'Audit-log toolbar button + popup (loaded by dashboard.html)'),
    ('js/i18n.js',                  'ui',     'i18n.js',                  'i18n translation table (loaded by landing.html and dashboard)'),
]

# Files allow-listed for upload/download but NOT shown in the operator UI.
EXTRA_ALLOWED_NOT_IN_UI = [
    ('psy_3d.html',                 'ui',     'psy_3d.html',              '3D psychrometric chart (niche tool)'),
    ('js/psy-3d-engine.js',         'ui',     'psy-3d-engine.js',         '3D psychrometric engine (loaded by dashboard.html 3D-WX tab + psy_3d.html)'),
    ('js/qrcode.min.js',            'ui',     'qrcode.min.js',            'QR generator (AHU/VAV graphic Phone-Preview button in dashboard.html)'),
    ('js/toast.js',                 'ui',     'toast.js',                 'Toast notification helper (loaded by dashboard.html)'),
    ('js/docs_index.js',            'ui',     'docs_index.js',            'In-app docs search index (loaded by dashboard.html)'),
    ('js/g36_timeline.js',          'ui',     'g36_timeline.js',          'G36 mode-timeline bars (loaded by dashboard.html)'),
    ('js/psychrometric.js',         'ui',     'psychrometric.js',         'Psychrometric helpers (loaded by setup.html)'),
    ('equipment_mapper.css',        'ui',     'equipment_mapper.css',     'Stylesheet for equipment_mapper.html'),
    ('landing.css',                 'ui',     'landing.css',              'Stylesheet for landing.html'),
    ('mobile_mockup.html',          'ui',     'mobile_mockup.html',       'Mobile-phone view (QR code target from AHU/VAV phone-preview button)'),
    ('learn.html',                  'ui',     'learn.html',               'Educational landing page (referenced by dashboard.html back-to-learn link)'),
    ('ahu.html',                    'ui',     'ahu.html',                 'AHU equipment graphic (linked from dashboard.compiled.js)'),
    ('deepdive.html',               'ui',     'deepdive.html',            'Deep-dive analysis page (linked from psy_3d.html)'),
    ('sun_preview.html',            'ui',     'sun_preview.html',         'Solar exposure preview (linked from app.py & build_bundle.py)'),
    ('js/dynamics-animation.js',    'ui',     'dynamics-animation.js',    'Psy chart dynamics animation (loaded by dashboard.html)'),
    ('js/preview-components.js',    'ui',     'preview-components.js',    'Equipment-mapper preview components (loaded via app.py)'),
    ('js/schema-config.js',         'ui',     'schema-config.js',         'Equipment-type schema config (loaded via app.py)'),
    # IMPORTANT -- deployment-ordering rule.
    # These docs/configs SHOULD be tagged 'doc' / 'config' (their natural
    # kinds, which the refactored upload_service.py now accepts via
    # _manifest_static_allow_set()).  But `bootstrap_controllers.sh --ui-only`
    # deliberately skips pushing the new upload_service.py -- so until every
    # controller has had ONE full (non --ui-only) bootstrap run, the on-box
    # upload_service.py is still the OLD code that only recognises 'ui' /
    # 'plugin'.  Tagging these as 'ui' below works with BOTH the old and
    # the new upload_service.py.
    #
    # Migration plan: once the whole fleet has been bootstrapped at least
    # once with the new upload_service.py in place, flip the kinds below
    # to 'doc' / 'config' to stop misusing 'ui' as a catch-all.
    ('band_guide.md',               'ui',     'band_guide.md',            'Band guide docs (served via band_service.py & update.html)'),
    ('control_strategy_insight.md', 'ui',     'control_strategy_insight.md',    'Strategy insight docs (EN, served via app.py & update.html)'),
    ('control_strategy_insight.ko.md','ui',   'control_strategy_insight.ko.md', 'Strategy insight docs (KO localisation)'),
    ('configs/collector_config.json','ui',    'collector_config.json',    'Default collector config schema (read by app.py)'),
    ('configs/equipment_types.json', 'ui',    'equipment_types.json',     'Equipment-type catalog (read by app.py & equipment_mapper.html)'),
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
    'audit_log_service.py',      'auth_service.py',
}


def _audit_html_asset_refs(manifest_names: set) -> list:
    """COMPREHENSIVE orphan audit (rebuilt 2026-02 after the
    mobile_mockup.html QR-target bug).

    Walks every *.html, *.js, *.py under ARCHIVE and finds every
    reference to a local asset (HTML, JS, CSS, MD, JSON, image).
    A reference counts when:
      1. It looks like a path with one of the watched extensions, AND
      2. The resolved file actually exists on disk under ARCHIVE.
    Both conditions together avoid two failure modes:
      * False negatives -- a string the developer added but the file
        isn't shipped, would 404 on controllers.
      * False positives -- arbitrary string literals that just happen
        to match a path regex (URLs, log lines, etc.) -- ignored
        because they don't resolve to a real file.

    The shipped V2.0 deploy.sh gate calls this with exit code 2, so the
    pipeline refuses to build a manifest that would let a referenced
    asset silently 404 on V1.9 controllers.

    Returns a list of (source_file_rel, asset_path) tuples.
    Empty list => OK.
    """
    import re

    orphaned: list = []
    seen:    set  = set()

    # All the patterns covered.  Order matters only for performance.
    patterns = [
        re.compile(r'<script\s+[^>]*\bsrc="([^"]+\.[a-z]{2,5})(?:\?v=[^"]*)?"',           re.I),
        re.compile(r'<link\s+[^>]*\bhref="([^"]+\.[a-z]{2,5})(?:\?v=[^"]*)?"',            re.I),
        re.compile(r'<(?:a|iframe|img|audio|video|source)\s+[^>]*\b(?:href|src)="'
                   r'([^"]+\.[a-z]{2,5})(?:[?#][^"]*)?"',                                 re.I),
        re.compile(r'[\'"](?:/)?((?:[\w\-./]+/)?[\w\-]+\.'
                   r'(?:html|css|js|png|jpg|jpeg|svg|gif|json|md))[\'"]',                 re.I),
    ]
    SKIP_DIRS = {'.git', 'node_modules', '__pycache__', 'tests', 'mockups', 'docs'}
    SCAN_EXT  = ('.html', '.js', '.py')

    for root, dirs, files in os.walk(ARCHIVE):
        dirs[:] = [d for d in dirs if not d.startswith('.') and d not in SKIP_DIRS]
        for entry in sorted(files):
            if not entry.endswith(SCAN_EXT):
                continue
            path = os.path.join(root, entry)
            rel  = os.path.relpath(path, ARCHIVE)
            try:
                src = open(path, encoding='utf-8', errors='ignore').read()
            except OSError:
                continue

            for pat in patterns:
                for m in pat.findall(src):
                    asset = m.lstrip('/').split('?', 1)[0].split('#', 1)[0]
                    if not asset or asset.startswith(('http', '//', 'api/')):
                        continue
                    # Only flag if it resolves to a real file we'd otherwise
                    # need to ship (avoids hits on stdlib imports, regexes,
                    # data:/-URLs, etc.).
                    if not os.path.isfile(os.path.join(ARCHIVE, asset)):
                        continue
                    if asset in manifest_names:
                        continue
                    key = (rel, asset)
                    if key in seen:
                        continue
                    seen.add(key)
                    orphaned.append(key)

    return orphaned


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

    # Regression gate: every *.js / *.css referenced by any V1.9 HTML
    # MUST be in the manifest, else it silently 404s on controllers.
    manifest_names = {f['name'] for f in manifest['files']}
    orphaned = _audit_html_asset_refs(manifest_names)
    if orphaned:
        print('')
        print('ERROR: {} HTML asset reference(s) NOT in manifest -- they will'.format(len(orphaned)))
        print('       silently 404 on V1.9 controllers (same bug class as the')
        print('       2026-06-29 qrcode.min.js QR-library-failed-to-load issue).')
        print('       Add each path to EXTRA_ALLOWED_NOT_IN_UI in this script:')
        print('')
        for html_file, path in orphaned:
            print('       - {:40s}  referenced by {}'.format(path, html_file))
        print('')
        return 2
    return 0


if __name__ == '__main__':
    sys.exit(main())
