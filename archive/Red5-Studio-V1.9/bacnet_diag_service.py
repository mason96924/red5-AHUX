"""bacnet_diag_service.py
======================
Out-of-band BACnet config diagnosis + remediation.

Why this exists
---------------
BACnet writes via `dibt.Write(<ref>, Value=<v>)` silently no-op when
`<ref>` resolves to an Object NAME ("AHU01_SAT_SP") instead of an Object
ID ("CSV1", "AV23", ...). The firmware accepts the call but the
underlying reference doesn't resolve to a real point, so the write is
dropped without an error code. This led to weeks of "writes look queued,
nothing changes on the AHU" debugging.

This service exposes:

  GET  /api/bacnet/diagnose-config
       → JSON report: per-AHU csv_object kind (ID vs NAME), unknown
         entries, a per-line breakdown of any problems, plus a
         human-readable summary.

  GET  /api/bacnet/diagnose-config/csv
       → A remediated csv_object skeleton operators can paste into
         collector_config.json. Only RENAMES are suggested — never
         applied automatically (writing config from a service plugin
         would be a foot-gun: collector reloads on the next tick).

Out of scope: actually editing /root/data/configs/collector_config.json
on the controller. The operator does that themselves (or via a future
write-config endpoint) so the audit trail stays clear.
"""
import json
import os
import re

from flask import jsonify, request

# Module-scoped refs populated by register().  Same pattern as the other
# plug-ins in this codebase so hot-reload (importlib.reload + endpoint
# swap) rebinds these globals on every reload.
_APP = None
_CTX = None
DATA_ROOT = None
CONFIG_DIR = None

# Same ObjectID regex as collector.py -- kept in sync intentionally; if
# you broaden it here also broaden it in collector.py._is_bacnet_objectid.
_OBJECTID_RE = re.compile(
    r'^(AV|AI|AO|BV|BI|BO|MSV|MSI|MSO|CSV|TL|SCH|FILE|DEV|PROG|LSP|TLP|EE|NC|GRP|CAL)\d+$'
)


def _is_objectid(s):
    return bool(s and isinstance(s, str) and _OBJECTID_RE.match(s))


def _load_collector_config():
    """Read collector_config.json from disk.  Returns (dict, path_used)
    or ({}, '<missing>') if the file is absent."""
    path = os.path.join(CONFIG_DIR, 'collector_config.json')
    if not os.path.isfile(path):
        return {}, '<missing>'
    try:
        with open(path, 'r') as f:
            return json.load(f), path
    except (ValueError, OSError) as ex:
        return {'_parse_error': str(ex)}, path


def _classify_config(cfg):
    """Walk ``cfg`` and return a per-AHU diagnosis dict.

    Output shape::

        {
          'ahus': [
            {'ahu': 'AHU-01', 'csv_object': 'CSV1', 'kind': 'ID',  'ok': True},
            {'ahu': 'AHU-09', 'csv_object': 'AHU09_CMD', 'kind': 'NAME', 'ok': False,
             'suggestion': 'Replace with a CSV/AV/... ObjectID.'},
            ...
          ],
          'totals': {'id': 8, 'name': 1, 'missing': 0},
          'config_version': '1.1',
          'mock_mode': False,
        }
    """
    ahus = []
    counts = {'id': 0, 'name': 0, 'missing': 0}
    for name, info in (cfg.get('ahu_groups') or {}).items():
        csv_obj = (info or {}).get('csv_object')
        if not csv_obj:
            counts['missing'] += 1
            ahus.append({
                'ahu': name, 'csv_object': None, 'kind': 'MISSING', 'ok': False,
                'suggestion': 'No csv_object set; writes will not work for this AHU.'
            })
        elif _is_objectid(csv_obj):
            counts['id'] += 1
            ahus.append({
                'ahu': name, 'csv_object': csv_obj, 'kind': 'ID', 'ok': True,
            })
        else:
            counts['name'] += 1
            ahus.append({
                'ahu': name, 'csv_object': csv_obj, 'kind': 'NAME', 'ok': False,
                'suggestion': (
                    'Replace with a CSV/AV/MSV/etc. ObjectID. '
                    'Lookup the ObjectID in the enteliWEB Network Tree.'
                ),
            })
    ahus.sort(key=lambda a: (a['ok'], a['ahu']))
    return {
        'ahus': ahus,
        'totals': counts,
        'config_version': cfg.get('version'),
        'mock_mode': cfg.get('mock_mode'),
    }


def diagnose_config():
    """GET /api/bacnet/diagnose-config — full JSON report."""
    cfg, path = _load_collector_config()
    if '_parse_error' in cfg:
        return jsonify({
            'success': False,
            'error': 'collector_config.json failed to parse: ' + cfg['_parse_error'],
            'path': path,
        }), 500
    report = _classify_config(cfg)
    total = report['totals']['id'] + report['totals']['name'] + report['totals']['missing']
    bad   = report['totals']['name'] + report['totals']['missing']
    report['success']      = True
    report['config_path']  = path
    report['total_ahus']   = total
    report['healthy']      = bad == 0
    report['bad_count']    = bad
    report['summary']      = (
        '\u2705 All {} AHU(s) use ObjectIDs.'.format(total)
        if bad == 0 else
        '\u26A0 {} of {} AHU(s) have name-based or missing csv_object entries; '
        'BACnet writes will silently fail for those.'.format(bad, total)
    )
    return jsonify(report)


def diagnose_config_csv():
    """GET /api/bacnet/diagnose-config/csv — paste-ready skeleton.

    Returns a plain-text 2-column TSV (AHU<TAB>current<TAB>kind<TAB>fix)
    so the operator can drop it into a spreadsheet, fill in the correct
    ObjectIDs from the enteliWEB Network Tree, and copy back into
    collector_config.json.  Read-only: never mutates the live config.
    """
    cfg, path = _load_collector_config()
    if '_parse_error' in cfg:
        return ('# parse error: ' + cfg['_parse_error'] + '\n'), 500, {'Content-Type': 'text/plain; charset=utf-8'}
    report = _classify_config(cfg)
    lines = ['# Generated by /api/bacnet/diagnose-config/csv',
             '# Replace any kind=NAME entries with a valid BACnet ObjectID.',
             '# Columns: AHU<TAB>csv_object_current<TAB>kind<TAB>fix_note',
             '']
    for a in report['ahus']:
        fix = '' if a['ok'] else a.get('suggestion', '')
        lines.append('\t'.join([a['ahu'], str(a.get('csv_object') or ''), a['kind'], fix]))
    return ('\n'.join(lines) + '\n', 200,
            {'Content-Type': 'text/plain; charset=utf-8',
             'Cache-Control': 'no-store'})


# ----------------------------------------------------------------------
# Plug-in entrypoint -- auto-discovered by app.py at boot via the standard
# `register(app, ctx)` contract.  Also re-invoked when the operator hot-
# reloads this file through /api/repair/reload-module/<this>.py.
# ----------------------------------------------------------------------
def register(app, ctx, **kwargs):
    global _APP, _CTX, DATA_ROOT, CONFIG_DIR
    _APP = app
    _CTX = ctx
    DATA_ROOT  = ctx.get('DATA_ROOT')  if hasattr(ctx, 'get') else getattr(ctx, 'DATA_ROOT', None)
    CONFIG_DIR = ctx.get('CONFIG_DIR') if hasattr(ctx, 'get') else getattr(ctx, 'CONFIG_DIR', None)
    if not CONFIG_DIR and DATA_ROOT:
        CONFIG_DIR = os.path.join(DATA_ROOT, 'configs')

    app.add_url_rule('/api/bacnet/diagnose-config',     'diagnose_config',     diagnose_config,     methods=['GET'])
    app.add_url_rule('/api/bacnet/diagnose-config/csv', 'diagnose_config_csv', diagnose_config_csv, methods=['GET'])
