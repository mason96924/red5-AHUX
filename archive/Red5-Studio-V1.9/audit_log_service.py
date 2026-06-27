"""
audit_log_service.py
====================
V1.9 audit-log plug-in -- mirrors the GET /api/audit-log endpoints that
V2.0 exposes so the existing js/audit_log.js popup works against V1.9
unchanged.

What it logs (decision matrix d/a/a from operator, 2026-06-27):
  * band_apply        -- whenever band_overrides_service pushes an
                         RH-band to a controller AHU
  * write_point       -- every /api/write-point override
  * repair_upload     -- every /api/repair/upload-plugin call
  * repair_reload     -- every /api/repair/reload-module call

Storage:
  /root/data/audit.jsonl  -- newline-delimited JSON, append-only.
  Cap = 100 KB.  When exceeded the current file is rotated to
  audit.jsonl.1 (overwriting any previous .1) and a fresh empty file
  starts.  This gives ~1000 entries before the oldest are dropped --
  per operator's "100 KB" budget pick for V1.9's tight 2 MB disk.

Access:
  No admin gate on V1.9 -- the controller is already password-gated at
  /landing, and there is only one role.  All entries record
  user_email='<anon>' to be honest about the lack of per-user identity.

API parity with V2.0:
  GET /api/audit-log           -> {"events": [...]}
  GET /api/audit-log/summary   -> {"window_24h":{...}, "window_7d":{...},
                                   "total": N, "ttl_days": null}
  POST /api/audit-log          -> record one entry (internal, for
                                  callers without a Python import)

Public helper:
  audit_log_service.record(action, resource, before=None, after=None,
                           user_email='<anon>', extra=None)
  -- callable from any other plug-in.
"""

from __future__ import annotations

import json
import os
import threading
import time
from datetime import datetime, timezone, timedelta

from flask import jsonify, request

# Will be populated by register(app, **ctx) at startup.
DATA_ROOT = None  # type: ignore

# Single mutex for serialising appends + rotation so a flurry of
# write_points doesn't corrupt the file.
_LOCK = threading.Lock()

# Cap = 100 KB.  Operator-chosen for V1.9's ~2 MB disk budget.
MAX_BYTES = 100 * 1024


def _audit_path():
    if DATA_ROOT is None:
        return None
    return os.path.join(DATA_ROOT, 'audit.jsonl')


def _audit_rotated_path():
    if DATA_ROOT is None:
        return None
    return os.path.join(DATA_ROOT, 'audit.jsonl.1')


def _rotate_if_needed_locked(path):
    """Caller must already hold _LOCK.  Rotates the current file to
    .jsonl.1 if it has grown past MAX_BYTES."""
    try:
        sz = os.path.getsize(path)
    except OSError:
        return  # missing; nothing to rotate
    if sz < MAX_BYTES:
        return
    rot = _audit_rotated_path()
    if rot is None:
        return
    try:
        # os.replace is atomic on POSIX -- old .1 (if any) is silently
        # discarded.  Concurrent readers see either the old or the new
        # file; never a half-state.
        os.replace(path, rot)
    except OSError:
        # If rotation fails (disk full, permissions), drop the current
        # file rather than let it grow unbounded.
        try:
            os.unlink(path)
        except OSError:
            pass


def _now_iso():
    return datetime.now(timezone.utc).isoformat(timespec='seconds')


def record(action,
           resource,
           before=None,
           after=None,
           user_email='<anon>',
           extra=None):
    """Append one audit entry.  Safe to call from any thread / plug-in.

    Arguments
    ---------
    action     : str  -- short verb, e.g. 'band_apply', 'write_point'
    resource   : str  -- the thing acted on, e.g. 'AHU-01-E' or
                         '/root/data/dashboard.compiled.js'
    before / after : any JSON-serialisable value (or None)
    user_email : str  -- '<anon>' on V1.9
    extra      : dict -- optional additional fields merged into the entry

    Failures are swallowed: audit logging must NEVER break the calling
    request path.  The worst case is one missing audit line.
    """
    try:
        path = _audit_path()
        if path is None:
            return False
        entry = {
            'ts': _now_iso(),
            'action': str(action)[:64],
            'resource': str(resource)[:200] if resource is not None else '',
            'user_email': str(user_email)[:120] if user_email else '<anon>',
        }
        if before is not None:
            entry['before'] = before
        if after is not None:
            entry['after'] = after
        if isinstance(extra, dict):
            for k, v in extra.items():
                if k not in entry:
                    entry[k] = v
        line = json.dumps(entry, separators=(',', ':'),
                          ensure_ascii=False, default=str) + '\n'
        # Cap per-entry size hard so a runaway caller can't write a 1 MB
        # blob and trip the rotation in one shot.
        if len(line.encode('utf-8')) > 8 * 1024:
            line = json.dumps({**entry,
                               'before': '<truncated>',
                               'after': '<truncated>'}) + '\n'
        with _LOCK:
            os.makedirs(os.path.dirname(path), exist_ok=True)
            # Rotate BEFORE writing the new line so the cap is enforced
            # tightly (we never exceed MAX_BYTES + one full line).
            _rotate_if_needed_locked(path)
            with open(path, 'a', encoding='utf-8') as f:
                f.write(line)
        return True
    except Exception:
        return False


# --------------------------------------------------------------------------
# Read paths -- iterate both files in time order (oldest first via .1, then
# current) and parse JSONL.  Bad lines are skipped silently.
# --------------------------------------------------------------------------

def _iter_entries():
    paths = [_audit_rotated_path(), _audit_path()]
    for p in paths:
        if not p or not os.path.isfile(p):
            continue
        try:
            with open(p, 'r', encoding='utf-8', errors='replace') as f:
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        yield json.loads(line)
                    except ValueError:
                        continue
        except OSError:
            continue


# --------------------------------------------------------------------------
# Flask endpoints.
# --------------------------------------------------------------------------

def get_audit_log():
    """GET /api/audit-log[?action=<str>&limit=<int>]
    Returns most-recent-first (matches V2.0 ordering)."""
    try:
        limit = int(request.args.get('limit', '100'))
    except (TypeError, ValueError):
        limit = 100
    limit = max(1, min(limit, 1000))
    action_filter = (request.args.get('action') or '').strip().lower()

    all_events = list(_iter_entries())
    if action_filter:
        all_events = [e for e in all_events
                      if action_filter in str(e.get('action', '')).lower()]
    all_events.reverse()  # newest first
    events = all_events[:limit]
    return jsonify({
        'events': events,
        'count': len(events),
        'truncated': len(all_events) > limit,
    })


def get_audit_log_summary():
    """GET /api/audit-log/summary -- counts by action over 24h / 7d."""
    now = datetime.now(timezone.utc)
    win24 = now - timedelta(hours=24)
    win7d = now - timedelta(days=7)
    c24, c7d = {}, {}
    total = 0
    for e in _iter_entries():
        total += 1
        try:
            ts = datetime.fromisoformat(str(e.get('ts')).replace('Z', '+00:00'))
        except Exception:
            continue
        act = str(e.get('action') or '?')
        if ts >= win24:
            c24[act] = c24.get(act, 0) + 1
        if ts >= win7d:
            c7d[act] = c7d.get(act, 0) + 1
    return jsonify({
        'window_24h': c24,
        'window_7d':  c7d,
        'total':      total,
        'ttl_days':   None,  # V1.9 rotates by size, not by age
    })


def post_audit_log():
    """POST /api/audit-log -- record one entry from JSON body.
    Used by plug-ins that can't import audit_log_service directly."""
    try:
        body = request.get_json(silent=True) or {}
        ok = record(
            action     = body.get('action', '?'),
            resource   = body.get('resource', ''),
            before     = body.get('before'),
            after      = body.get('after'),
            user_email = body.get('user_email', '<anon>'),
            extra      = body.get('extra') if isinstance(body.get('extra'), dict) else None,
        )
        return jsonify({'success': bool(ok)}), (200 if ok else 500)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# --------------------------------------------------------------------------
# Registration -- called by app.py at startup.
# --------------------------------------------------------------------------

def register(app, ctx=None):
    """Attach the audit-log endpoints to the Flask `app`.
    Called by V1.9's plug-in loader as `register(app, SERVICE_CTX)`."""
    global DATA_ROOT
    ctx = ctx or {}
    DATA_ROOT = ctx.get('DATA_ROOT') or os.environ.get('RED5_DATA_ROOT') or '/root/data'

    app.add_url_rule('/api/audit-log',         'audit_log_get',
                     get_audit_log,         methods=['GET'])
    app.add_url_rule('/api/audit-log/summary', 'audit_log_summary',
                     get_audit_log_summary, methods=['GET'])
    app.add_url_rule('/api/audit-log',         'audit_log_post',
                     post_audit_log,        methods=['POST'])
