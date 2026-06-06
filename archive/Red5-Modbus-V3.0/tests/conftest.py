"""Pytest configuration for Red5-Modbus V3.0 tests."""
import pytest

# Enable asyncio support without requiring pytest-asyncio's @pytest.mark.asyncio
# decorator on every test (we use it for documentation, but this enforces
# auto-mode in case the marker is missing).
# Requires pytest-asyncio >= 0.21.
pytest_plugins = []


def pytest_collection_modifyitems(config, items):
    """Mark every async function as `asyncio` automatically."""
    for item in items:
        if hasattr(item, "obj") and \
           asyncio_is_coroutine_function(item.obj) and \
           "asyncio" not in {m.name for m in item.iter_markers()}:
            item.add_marker(pytest.mark.asyncio)


def asyncio_is_coroutine_function(fn):
    import asyncio
    import inspect
    return asyncio.iscoroutinefunction(fn) or inspect.iscoroutinefunction(fn)
