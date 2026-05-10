"""build_bundle.py — assembles red5_bundle.zip from the current source tree.

Mirrors the structure of the historical bundle: most files at the zip root
(controller's upload_service.py routes .py to PLUGINS_ROOT regardless,
.json under configs/ to /root/data/configs/, etc.).

Usage:
    python build_bundle.py
"""
import os
import sys
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
OUT  = os.path.join(HERE, 'red5_bundle.zip')

# Files at zip ROOT (everything that lives next to app.py in source).
ROOT_FILES = [
    # Bootloader + core services (loaded by /root/scripts/app.py).
    # NOTE: app.py is included for completeness, but the controller's
    # upload pipeline filters it out with reason "Bootloader (app.py)
    # not auto-deployed".  Keeping it in the zip lets operators inspect
    # the canonical version.
    'app.py',
    'collector.py',
    'simulator.py',

    # Plug-in service modules (auto-routed to PLUGINS_ROOT by extractor).
    'upload_service.py',
    'weather_service.py',
    'band_service.py',
    'telemetry_service.py',
    'bridges_admin_service.py',
    'webhook_bridge_service.py',
    'mqtt_bridge_service.py',
    'modbus_bridge_service.py',
    'ws_bridge_service.py',
    '_bridges_lib.py',
    'band_csv_generator.py',

    # UI / static.
    'dashboard.html',
    'update.html',
    'equipment_mapper.html',
    'landing.html',
    'psy_3d.html',
    'sun_preview.html',

    # Markdown guides.
    'band_guide.md',
    'data_bridges_guide.md',
    'control_algorithms.md',
    'control_strategy_insight.md',
    'control_strategy_insight.ko.md',
]

# Subdir trees to include verbatim.
SUBDIR_TREES = [
    'js',
    'configs',
]

# Everything in this skip-list (relative to repo root) is excluded even if
# it lives inside one of SUBDIR_TREES.
SKIP_PATTERNS = (
    '__pycache__',
    '.pyc',
    'tests/',
    'test_',
    'conftest.py',
)


def should_skip(rel_path):
    for pat in SKIP_PATTERNS:
        if pat in rel_path:
            return True
    return False


def main():
    if os.path.exists(OUT):
        os.unlink(OUT)

    added = []
    skipped = []
    missing = []
    with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        # 1. Root files
        for name in ROOT_FILES:
            src = os.path.join(HERE, name)
            if not os.path.isfile(src):
                missing.append(name)
                continue
            zf.write(src, arcname=name)
            added.append(name)

        # 2. Subdirectory trees
        for sub in SUBDIR_TREES:
            base = os.path.join(HERE, sub)
            if not os.path.isdir(base):
                missing.append(sub + '/')
                continue
            for root, dirs, files in os.walk(base):
                # prune hidden + cache dirs
                dirs[:] = [d for d in dirs
                           if not d.startswith('.')
                           and d != '__pycache__']
                for fn in sorted(files):
                    full = os.path.join(root, fn)
                    rel  = os.path.relpath(full, HERE)
                    if should_skip(rel):
                        skipped.append(rel)
                        continue
                    zf.write(full, arcname=rel)
                    added.append(rel)

    size = os.path.getsize(OUT)
    print('=' * 60)
    print('Built ' + OUT)
    print('  size:    {:.1f} KB'.format(size / 1024.0))
    print('  files:   {}'.format(len(added)))
    print('  skipped: {}'.format(len(skipped)))
    if missing:
        print('  MISSING (source-tree gaps):')
        for m in missing:
            print('    - ' + m)
    print('=' * 60)
    return 0 if not missing else 1


if __name__ == '__main__':
    sys.exit(main())
