"""Pytest configuration for V1.9 tests.

The tests/ directory contains a mix of:
  - Pytest-compatible test files (test_*.py with `def test_*`)
  - Standalone scripts that call sys.exit() at module level (legacy)
  - JS test files (test_*.js) executed by node

Pytest's default collection tries to import the standalone scripts,
which calls sys.exit() and blows up the whole run.  This conftest
filters those out.

Standalone scripts ARE still runnable directly:  `python3 tests/<file>.py`
"""
import os

# Files that call sys.exit() at module level -- exclude from pytest collection.
# Run them manually: `python3 tests/<filename>.py`
_STANDALONE_SCRIPTS = {
    'dryrun_clone_bundle.py',
    'test_api_services_endpoint.py',
    'test_assets_json_no_cache.py',
    'test_auto_reload_after_upload.py',
    'test_bacnet_diag.py',
    'test_band_service.py',
    'test_bootloader_protection.py',
    'test_bridges.py',
    'test_core_file_routes.py',
    'test_headroom_math.py',
    'test_plugins_root_routing.py',
    'test_reload_module.py',
    'test_repair_mode.py',
    'test_self_heal_services.py',
    'test_streaming_upload.py',
    'test_telemetry_service.py',
    'test_weather_service.py',
    'test_write_queue.py',
    'test_zip_files.py',
    # Note: test_band_overrides_service.py and test_band_sa_rh_clamp.py are
    # legitimate pytest files (no module-level sys.exit) -- collect them.
}


def pytest_ignore_collect(collection_path, config):
    name = os.path.basename(str(collection_path))
    if name.endswith('.js'):
        return True
    return name in _STANDALONE_SCRIPTS
