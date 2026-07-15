#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Red5-ELC BACnet Collector (stub)
================================
enteliWEB-registered object — lives ONLY in /root/scripts/collector.py
(same rules as app.py: manual placement via enteliWEB, never bundle-deployed).

Future role
-----------
Bridge lighting-control metadata between the ELC stack and the
controller's native BACnet environment:

  * Read BACnet points (relay states, dim levels, alarms) → write
    /root/data/configs/elc_telemetry.json for app.py / elc_service.py
  * Write BACnet overrides from operator actions (optional, ACL-gated)
  * Configuration: /root/data/configs/collector_config.json

For now this is a no-op heartbeat so the enteliWEB object slot exists
and operators can register it alongside app.py.

Usage (once implemented):
    python3 collector.py                  # Run with defaults
    python3 collector.py --interval 10    # Override poll interval
    python3 collector.py --mock           # No dibt — write synthetic JSON
    python3 collector.py --once           # Single cycle then exit
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
import traceback

DATA_ROOT = os.environ.get('RED5_DATA_ROOT', '/root/data')
CONFIG_DIR = os.path.join(DATA_ROOT, 'configs')
TELEMETRY_PATH = os.path.join(CONFIG_DIR, 'elc_telemetry.json')
COLLECTOR_CONFIG_PATH = os.path.join(CONFIG_DIR, 'collector_config.json')
COLLECTOR_LOG_PATH = os.path.join(CONFIG_DIR, 'collector_log.json')


def _write_stub_telemetry() -> None:
    """Placeholder payload until BACnet mapping is defined."""
    os.makedirs(CONFIG_DIR, exist_ok=True)
    payload = {
        'provider': 'stub',
        'updated_at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
        'note': 'collector.py stub — BACnet bridge not implemented yet',
        'points': {},
    }
    tmp = TELEMETRY_PATH + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as fh:
        json.dump(payload, fh, indent=2)
    os.replace(tmp, TELEMETRY_PATH)


def run_once(mock: bool = False) -> None:
    del mock  # reserved for future dibt vs mock branch
    _write_stub_telemetry()
    print(f'[elc-collector] stub cycle OK → {TELEMETRY_PATH}', flush=True)


def main() -> int:
    parser = argparse.ArgumentParser(description='Red5-ELC BACnet collector')
    parser.add_argument('--interval', type=float, default=15.0,
                        help='Poll interval in seconds (default 15)')
    parser.add_argument('--mock', action='store_true',
                        help='Force mock mode (no dibt)')
    parser.add_argument('--once', action='store_true',
                        help='Single cycle then exit')
    args = parser.parse_args()

    print('[elc-collector] Red5-ELC BACnet bridge — STUB', flush=True)
    print(f'[elc-collector] telemetry → {TELEMETRY_PATH}', flush=True)

    if args.once:
        try:
            run_once(mock=args.mock)
        except Exception:
            traceback.print_exc()
            return 1
        return 0

    while True:
        try:
            run_once(mock=args.mock)
        except Exception:
            traceback.print_exc()
        time.sleep(max(1.0, args.interval))


if __name__ == '__main__':
    sys.exit(main())
