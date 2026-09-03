"""build_bundle.py — assembles red5_bundle.zip from the current source tree.

Mirrors the structure of the historical bundle: most files at the zip root
(controller's upload_service.py routes .py to PLUGINS_ROOT regardless,
.json under configs/ to /root/data/configs/, etc.).

If ``master_key.txt`` exists next to this script it is packaged too (optional,
gitignored) so a Mac-built bundle can sync the admin password to the controller.

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
    # Core services (loaded by /root/scripts/app.py).
    # The bootloader is deliberately NOT shipped as `app.py`: both
    # extractors refuse a bundled copy ("Bootloader (app.py) not
    # auto-deployed"), so it was always inert payload -- and the repo
    # copy is the variant that hangs the enteliWEB editor on save.  The
    # paste-ready text ships via RENAMED_ROOT_FILES instead.
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
    'bacnet_diag_service.py',
    'band_csv_generator.py',
    'mixed_air.py',

    # Stage B — auth + audit (2026-07).  *.py land in pgpy/ on bundle upload.
    'auth_service.py',
    'audit_log_service.py',
    'band_overrides_service.py',
    'pages_service.py',          # /, /access.html, /setup.html, /api/config/unlock

    # UI / static.
    'dashboard.html',
    'update.html',
    'equipment_mapper.html',
    'landing.html',
    'access.html',               # 2026-07: admin user-management page
    'setup.html',                # 2026-06-25: pre-compiled setup walk (one-time onboarding gate)
    'setup_walk.compiled.js',    # 2026-06-25: compiled JSX bundle for setup.html (built offline)
    'dashboard.compiled.js',     # 2026-06-25: compiled JSX bundle for dashboard.html (built offline)
    'dashboard.tailwind.css',    # 2026-06-27: pre-extracted Tailwind (replaces CDN runtime)
    'psy_3d.html',
    'sun_preview.html',
    'deepdive.html',
    'ahu.html',                 # 2026-05-27: per-AHU performance detail page
    'learn.html',
    'mobile_mockup.html',
    'repair_manifest.json',      # Repair Mode allow-list (sha256 source of truth)
    # NOTE: command-center.html (4-controller fleet view via iframes to
    # cN.geniusmason.com) is V2.0-only -- it embeds external subdomains
    # that the controllers themselves don't need to host.  Excluded.

    # Top-level stylesheets referenced by the HTML files above.
    # Regression history (2026-06-08): equipment_mapper.css and
    # landing.css existed in frontend/public/ but were never synced to
    # this archive nor added here, so the bundle shipped without them.
    # Caught by tests/test_html_asset_refs_bundled.py.
    'equipment_mapper.css',
    'landing.css',

    # NOTE: All .md guides are packaged via the docs/ subdir tree ONLY
    # (see SUBDIR_TREES below).  They MUST NOT be listed here -- when
    # they were at root, the controller extractor unpacked them flat into
    # /root/data/<file>.md instead of /root/data/docs/<file>.md, which
    # broke the lookup chain used by serve_asset().  Regression history:
    # commit 60fc9f1 re-introduced them at root; this comment is here
    # so future agents don't repeat the mistake.

    # G36 service module (ported from V2.0).
    'g36_service.py',
]

# Optional root files — included when present locally (e.g. master_key.txt is
# gitignored and may be absent on CI).  On deploy, master_key.txt lands in
# /root/data/ so the controller's admin/bundle password matches the Mac copy.
OPTIONAL_ROOT_FILES = [
    'master_key.txt',
]

# Root files shipped into the zip under a different name.
# app_canonical_c2.py is the text an operator pastes into the enteliWEB
# app.py object.  The `.txt` suffix matters: the extractor routes any `.py`
# to /root/data/pgpy/, which is on sys.path, and this file runs app.run()
# at module level.  As `.txt` it lands in /root/data/ (readable via
# /assets/) and can never be imported.
RENAMED_ROOT_FILES = {
    'app_canonical_c2.py': 'app_canonical_c2.py.txt',
}

# Subdir trees to include verbatim.
SUBDIR_TREES = [
    'js',
    'img',                       # floor plans, equipment photos (site-specific but ship with clone)
    'configs',
    'docs',                     # 2026-05-27: docs/ now mirrored from V2.0 (inline-help md, runbooks)
]

# Everything in this skip-list (relative to archive root) is excluded even if
# it lives inside one of SUBDIR_TREES.
SKIP_PATTERNS = (
    '__pycache__',
    '.pyc',
    'tests/',
    'test_',
    'conftest.py',
)

# Site-authored / runtime configs: extract already PRESERVES these when present
# on the controller, but shipping them still inflates the spool + the old
# finalize headroom check (largest uncompressed member).  A ~1.7 MB
# equipment_types.json made ~4.5 MB-free controllers refuse a 2.6 MB upload
# after the spool landed.  Fresh controllers get schema via Setup / Load
# Schema / Controller button — not via every SP* zip.
SKIP_EXACT = {
    'configs/equipment_types.json',
    'configs/map_config.json',
    'configs/collector_config.json',
    'configs/image_files_manifest.json',
    'equipment_types.json',
}


def should_skip(rel_path):
    rel = rel_path.replace('\\', '/')
    if rel in SKIP_EXACT:
        return True
    # Weather year caches (e.g. configs/weather_47.60_-122.30_2020.json)
    base = os.path.basename(rel)
    if base.startswith('weather_') and base.endswith('.json'):
        return True
    for pat in SKIP_PATTERNS:
        if pat in rel:
            return True
    return False


def main():
    if os.path.exists(OUT):
        os.unlink(OUT)

    added = []
    skipped = []
    missing = []
    optional_missing = []
    with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        # 1. Root files
        for name in ROOT_FILES:
            src = os.path.join(HERE, name)
            if not os.path.isfile(src):
                missing.append(name)
                continue
            zf.write(src, arcname=name)
            added.append(name)

        # 1b. Optional root files (skip quietly when absent)
        for name in OPTIONAL_ROOT_FILES:
            src = os.path.join(HERE, name)
            if not os.path.isfile(src):
                optional_missing.append(name)
                continue
            zf.write(src, arcname=name)
            added.append(name)

        # 1c. Root files renamed on the way into the zip
        for name, arc in RENAMED_ROOT_FILES.items():
            src = os.path.join(HERE, name)
            if not os.path.isfile(src):
                missing.append(name)
                continue
            zf.write(src, arcname=arc)
            added.append(arc)

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
    if optional_missing:
        print('  OPTIONAL (skipped — not in source tree):')
        for m in optional_missing:
            print('    - ' + m)
    if missing:
        print('  MISSING (source-tree gaps):')
        for m in missing:
            print('    - ' + m)
    print('=' * 60)
    return 0 if not missing else 1


if __name__ == '__main__':
    sys.exit(main())
