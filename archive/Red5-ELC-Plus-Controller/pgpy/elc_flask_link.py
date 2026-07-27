"""
elc_flask_link.py — background ScuLink for Phase 3+ Flask mode.

Runs asyncio ScuLink + SrmDriver + Replica on a daemon thread so
/api/elc/link reflects real TCP state and relay commands reach hardware
when project.json has an SCU host configured.

Uses a minimal stack (no FastAPI / floors / ezdxf) so the link thread
does not require numpy on the controller.
"""
from __future__ import annotations

import asyncio
import logging
import os
import threading
from dataclasses import dataclass
from pathlib import Path
from typing import Any

log = logging.getLogger('elc_flask_link')


@dataclass
class _LinkStack:
    link: Any
    driver: Any
    replica: Any


_STACK: _LinkStack | None = None
_LOOP: asyncio.AbstractEventLoop | None = None
_THREAD: threading.Thread | None = None
_START_ERROR: str | None = None
_LOCK = threading.Lock()


def _bridge_sse(event: dict[str, Any]) -> None:
    try:
        import elc_flask_sse
        elc_flask_sse.publish(event)
    except Exception:
        log.exception('replica → SSE bridge failed')


async def _run_stack(host: str, port: int) -> None:
    global _STACK
    from elc.domain.replica import Replica
    from elc.drivers.srm import SrmDriver
    from elc.transport import ScuLink

    link = ScuLink(
        host=host,
        port=port,
        name='elc-controller',
        wire_version='v38',
    )
    driver = SrmDriver(link)
    replica = Replica()
    replica.attach(driver)
    _STACK = _LinkStack(link=link, driver=driver, replica=replica)
    replica.events.subscribe(_bridge_sse)
    await link.start()
    log.info('ScuLink supervisor started for %s:%s', host, port)
    try:
        while True:
            await asyncio.sleep(3600)
    finally:
        await link.stop()


def _thread_main(host: str, port: int) -> None:
    global _LOOP, _START_ERROR
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    _LOOP = loop
    try:
        loop.run_until_complete(_run_stack(host, port))
    except Exception as exc:
        _START_ERROR = type(exc).__name__ + ': ' + str(exc)
        log.exception('SCU link thread exited')
    finally:
        try:
            loop.close()
        except Exception:
            pass
        _LOOP = None


def start(project_path: Path, db_path: str) -> bool:
    """Start the SCU link thread when project.json lists a host."""
    global _THREAD, _START_ERROR, _STACK
    from elc.config.project import load_project

    del db_path  # reserved for future scheduler wiring

    with _LOCK:
        if _THREAD and _THREAD.is_alive():
            return _STACK is not None

        cfg = load_project(project_path)
        host = ''
        port = 9760
        if cfg and cfg.scus:
            host = (cfg.scus[0].host or '').strip()
            port = int(cfg.scus[0].port or 9760)
        host = host or os.environ.get('ELC_SCU_HOST', '').strip()
        if host:
            port = int(os.environ.get('ELC_SCU_PORT', port))
        if not host:
            log.info('SCU link not started — no host in project.json')
            return False

        _START_ERROR = None
        _STACK = None
        _THREAD = threading.Thread(
            target=_thread_main,
            args=(host, port),
            name='elc-scu-link',
            daemon=True,
        )
        _THREAD.start()
        log.info('SCU link thread launched (%s:%s)', host, port)
        return True


def stop() -> None:
    """Request link shutdown (idempotent)."""
    global _THREAD, _STACK, _LOOP
    with _LOCK:
        loop = _LOOP
        stack = _STACK
        if loop is not None and stack is not None:
            try:
                fut = asyncio.run_coroutine_threadsafe(stack.link.stop(), loop)
                fut.result(timeout=5)
            except Exception:
                log.exception('SCU link stop failed')
        _STACK = None
        _THREAD = None


def start_error() -> str | None:
    return _START_ERROR


def thread_alive() -> bool:
    return bool(_THREAD and _THREAD.is_alive())


def is_connected() -> bool:
    stack = _STACK
    if stack is None:
        return False
    return stack.link.state.value == 'connected'


def link_snapshot() -> dict[str, Any]:
    """Shape matches GET /api/elc/link."""
    from elc.config.project import load_project

    project_path = Path(os.environ.get('ELC_PROJECT_JSON', ''))
    cfg = load_project(project_path) if project_path else None
    host = ''
    port = 0
    if cfg and cfg.scus:
        host = cfg.scus[0].host or ''
        port = cfg.scus[0].port or 0

    stack = _STACK
    if stack is None:
        state = 'down'
        if not host:
            state = 'unconfigured'
        elif thread_alive():
            state = 'connecting'
        elif _START_ERROR:
            state = 'down'
        return {
            'name': 'SCU',
            'host': host,
            'port': port,
            'state': state,
            'connect_attempts': 0,
            'start_error': _START_ERROR,
            'thread_alive': thread_alive(),
        }

    link = stack.link
    return {
        'name': link.name,
        'host': link.host,
        'port': link.port,
        'state': link.state.value,
        'connect_attempts': link.connect_attempts,
        'start_error': _START_ERROR,
        'thread_alive': thread_alive(),
    }


def get_replica():
    return _STACK.replica if _STACK is not None else None


def get_driver():
    return _STACK.driver if _STACK is not None else None


def run_async(coro, *, timeout: float = 15.0):
    loop = _LOOP
    if loop is None:
        raise RuntimeError('SCU link event loop not running')
    fut = asyncio.run_coroutine_threadsafe(coro, loop)
    return fut.result(timeout=timeout)
