"""
elc_flask_config.py — Flask-native groups / schedules / settings CRUD.

Mirrors pgpy/elc/config/routes.py for editor.html without uvicorn.
"""
from __future__ import annotations

import logging
import os
import sys
from datetime import datetime, timezone
from typing import Any

from flask import Response, jsonify, request

log = logging.getLogger('elc_flask_config')

_no_cache = None
_DB_PATH: str | None = None

_PHASE_CONFIG_ROUTES = (
    'GET /api/elc/groups',
    'GET /api/elc/groups/<gid>',
    'POST /api/elc/groups',
    'PATCH /api/elc/groups/<gid>',
    'DELETE /api/elc/groups/<gid>',
    'POST /api/elc/groups/<gid>/members',
    'DELETE /api/elc/groups/<gid>/members/<path:did>',
    'GET /api/elc/schedules',
    'GET /api/elc/schedules/<sid>',
    'POST /api/elc/schedules',
    'PATCH /api/elc/schedules/<sid>',
    'DELETE /api/elc/schedules/<sid>',
    'POST /api/elc/schedules/<sid>/preview',
    'POST /api/elc/groups/<gid>/schedules',
    'DELETE /api/elc/groups/<gid>/schedules/<sid>',
    'GET /api/elc/devices/<path:did>/schedules',
    'GET /api/elc/settings',
    'PATCH /api/elc/settings',
    'GET /api/elc/calendar',
    'POST /api/elc/calendar',
    'DELETE /api/elc/calendar/<entry_id>',
    'POST /api/elc/calendar/suggest-holidays',
    'POST /api/elc/calendar/bulk',
)


def phase_config_routes() -> tuple[str, ...]:
    return _PHASE_CONFIG_ROUTES


def _map_exc(exc: Exception):
    from elc.config import store
    from elc.scheduling import evaluator
    from elc.scheduling.astro import BadLocation
    status = {
        store.BadInput: 400,
        store.NotFound: 404,
        store.Conflict: 409,
        evaluator.RuleError: 400,
        BadLocation: 400,
    }.get(type(exc))
    if status is None:
        raise exc
    return _no_cache(jsonify({'detail': str(exc)})), status


def _body() -> dict[str, Any] | None:
    data = request.get_json(silent=True)
    return data if isinstance(data, dict) else None


def _truthy(v: Any) -> bool:
    return str(v).lower() in ('1', 'true', 'yes', 'on')


def register(app, data_root: str, plugins_root: str, no_cache) -> None:
    """Register groups/schedules/settings routes on the Flask app."""
    global _no_cache, _DB_PATH
    _no_cache = no_cache

    if plugins_root not in sys.path:
        sys.path.insert(0, plugins_root)

    import elc_flask_api
    if elc_flask_api._PROJECT_PATH is None:
        elc_flask_api._wire_paths(data_root)
    _DB_PATH = os.environ.get('ELC_CONFIG_DB_PATH')

    from elc.config import store
    from elc.scheduling import evaluator
    from elc.scheduling.astro import BadLocation, Location

    db_path = _DB_PATH

    # ---- Groups ----------------------------------------------------------
    def list_groups():
        return _no_cache(jsonify({'groups': store.list_groups(db_path=db_path)}))

    def get_group(gid: str):
        try:
            return _no_cache(jsonify(store.get_group(gid, db_path=db_path)))
        except Exception as exc:
            return _map_exc(exc)

    def create_group():
        body = _body()
        if body is None:
            return _no_cache(jsonify({'detail': 'JSON body required'})), 400
        try:
            out = store.create_group(
                name=body.get('name'), color=body.get('color'), db_path=db_path,
            )
            return _no_cache(jsonify(out)), 201
        except Exception as exc:
            return _map_exc(exc)

    def update_group(gid: str):
        body = _body()
        if body is None:
            return _no_cache(jsonify({'detail': 'JSON body required'})), 400
        try:
            return _no_cache(jsonify(store.update_group(
                gid, name=body.get('name'), color=body.get('color'), db_path=db_path,
            )))
        except Exception as exc:
            return _map_exc(exc)

    def delete_group(gid: str):
        try:
            store.delete_group(gid, db_path=db_path)
            return _no_cache(jsonify({'ok': True}))
        except Exception as exc:
            return _map_exc(exc)

    def add_member(gid: str):
        body = _body()
        if body is None:
            return _no_cache(jsonify({'detail': 'JSON body required'})), 400
        try:
            store.add_group_member(gid, body.get('device_id'), db_path=db_path)
            return _no_cache(jsonify({'ok': True})), 201
        except Exception as exc:
            return _map_exc(exc)

    def remove_member(gid: str, did: str):
        try:
            store.remove_group_member(gid, did, db_path=db_path)
            return _no_cache(jsonify({'ok': True}))
        except Exception as exc:
            return _map_exc(exc)

    # ---- Schedules -------------------------------------------------------
    def list_schedules():
        return _no_cache(jsonify({'schedules': store.list_schedules(db_path=db_path)}))

    def get_schedule(sid: str):
        try:
            return _no_cache(jsonify(store.get_schedule(sid, db_path=db_path)))
        except Exception as exc:
            return _map_exc(exc)

    def create_schedule():
        body = _body()
        if body is None:
            return _no_cache(jsonify({'detail': 'JSON body required'})), 400
        if 'rules' not in body:
            return _no_cache(jsonify({'detail': 'rules field is required (may be null)'})), 400
        if body['rules'] is not None:
            try:
                evaluator.validate(body['rules'])
            except evaluator.RuleError as exc:
                return _map_exc(exc)
        try:
            out = store.create_schedule(
                name=body.get('name'),
                color=body.get('color'),
                rules=body['rules'],
                enabled=bool(body.get('enabled', True)),
                db_path=db_path,
            )
            return _no_cache(jsonify(out)), 201
        except Exception as exc:
            return _map_exc(exc)

    def update_schedule(sid: str):
        body = _body()
        if body is None:
            return _no_cache(jsonify({'detail': 'JSON body required'})), 400
        kwargs: dict[str, Any] = {}
        for k in ('name', 'color'):
            if k in body:
                kwargs[k] = body[k]
        if 'rules' in body:
            if body['rules'] is not None:
                try:
                    evaluator.validate(body['rules'])
                except evaluator.RuleError as exc:
                    return _map_exc(exc)
            kwargs['rules'] = body['rules']
        if 'enabled' in body:
            kwargs['enabled'] = bool(body['enabled'])
        try:
            return _no_cache(jsonify(store.update_schedule(sid, db_path=db_path, **kwargs)))
        except Exception as exc:
            return _map_exc(exc)

    def delete_schedule(sid: str):
        try:
            store.delete_schedule(sid, db_path=db_path)
            return _no_cache(jsonify({'ok': True}))
        except Exception as exc:
            return _map_exc(exc)

    def preview_schedule(sid: str):
        body = _body() or {}
        try:
            sched = store.get_schedule(sid, db_path=db_path)
        except Exception as exc:
            return _map_exc(exc)
        rules = sched.get('rules')
        if rules is None:
            return _no_cache(jsonify({
                'schedule_id': sid, 'firings': [],
                'notice': 'schedule has no rules configured',
            }))
        settings = store.get_settings(db_path=db_path)
        lat = float(body.get('latitude', settings['latitude']))
        lon = float(body.get('longitude', settings['longitude']))
        tz = body.get('timezone', settings['timezone'])
        weather_enabled = _truthy(body.get('weather_enabled', settings['weather_enabled']))
        count = int(body.get('count', 5))
        try:
            loc = Location(latitude=lat, longitude=lon, timezone=tz)
            cal_rows = store.list_calendar_days(db_path=db_path)
            holiday_dates = frozenset(r['date'] for r in cal_rows if r['kind'] == 'holiday')
            event_dates = frozenset(r['date'] for r in cal_rows if r['kind'] == 'event')
            ctx = evaluator.EvalContext(
                location=loc,
                weather_enabled=weather_enabled,
                holiday_dates=holiday_dates,
                event_dates=event_dates,
            )
            evaluator.validate(rules)
            now = datetime.now(timezone.utc)
            firings = evaluator.next_fire_times(rules, now, ctx, count=count)
        except Exception as exc:
            return _map_exc(exc)
        return _no_cache(jsonify({
            'schedule_id': sid,
            'location': {'latitude': lat, 'longitude': lon, 'timezone': tz},
            'weather_enabled': weather_enabled,
            'firings': [
                {
                    'at': f.at.isoformat(),
                    'at_local': f.at.astimezone(loc.tzinfo).isoformat(),
                    'action': f.action,
                    'reason': f.reason,
                }
                for f in firings
            ],
        }))

    def assign_schedule(gid: str):
        body = _body()
        if body is None:
            return _no_cache(jsonify({'detail': 'JSON body required'})), 400
        sid = body.get('schedule_id')
        if not sid:
            return _no_cache(jsonify({'detail': 'schedule_id is required'})), 400
        try:
            store.assign_schedule(
                gid, sid, priority=int(body.get('priority', 0) or 0), db_path=db_path,
            )
            return _no_cache(jsonify({'ok': True})), 201
        except Exception as exc:
            return _map_exc(exc)

    def unassign_schedule(gid: str, sid: str):
        try:
            store.unassign_schedule(gid, sid, db_path=db_path)
            return _no_cache(jsonify({'ok': True}))
        except Exception as exc:
            return _map_exc(exc)

    def schedules_for_device(did: str):
        return _no_cache(jsonify({
            'device_id': did,
            'schedules': store.schedules_for_device(did, db_path=db_path),
        }))

    # ---- Settings --------------------------------------------------------
    def get_settings():
        return _no_cache(jsonify({'settings': store.get_settings(db_path=db_path)}))

    def update_settings():
        body = _body()
        if body is None:
            return _no_cache(jsonify({'detail': 'JSON body required'})), 400
        try:
            return _no_cache(jsonify({'settings': store.update_settings(body, db_path=db_path)}))
        except Exception as exc:
            return _map_exc(exc)

    # ---- Calendar --------------------------------------------------------
    def list_calendar():
        kind = request.args.get('kind')
        try:
            return _no_cache(jsonify({'days': store.list_calendar_days(kind, db_path=db_path)}))
        except Exception as exc:
            return _map_exc(exc)

    def add_calendar():
        body = _body()
        if body is None:
            return _no_cache(jsonify({'detail': 'JSON body required'})), 400
        try:
            out = store.add_calendar_day(
                body.get('date'), body.get('label'), body.get('kind', 'holiday'),
                db_path=db_path,
            )
            return _no_cache(jsonify(out)), 201
        except Exception as exc:
            return _map_exc(exc)

    def delete_calendar(entry_id: str):
        try:
            store.remove_calendar_day(entry_id, db_path=db_path)
            return Response(status=204)
        except Exception as exc:
            return _map_exc(exc)

    def suggest_holidays():
        body = _body()
        if body is None:
            return _no_cache(jsonify({'detail': 'JSON body required'})), 400
        try:
            import holidays as _holidays_lib
        except ImportError:
            return _no_cache(jsonify({'detail': 'holidays library not installed'})), 500
        country = (body.get('country') or '').upper().strip()
        year = int(body.get('year', 0))
        if len(country) != 2 or not country.isalpha():
            return _no_cache(jsonify({'detail': 'country must be a 2-letter ISO code'})), 400
        if not (1970 <= year <= 2100):
            return _no_cache(jsonify({'detail': 'year must be 1970..2100'})), 400
        try:
            cal = _holidays_lib.country_holidays(country, years=[year])
        except (KeyError, NotImplementedError):
            return _no_cache(jsonify({'detail': f'unknown country code {country!r}'})), 400
        entries = sorted(
            [{'date': d.isoformat(), 'label': name} for d, name in cal.items()],
            key=lambda e: e['date'],
        )
        return _no_cache(jsonify({'country': country, 'year': year, 'holidays': entries}))

    def bulk_add_calendar():
        body = _body()
        if body is None:
            return _no_cache(jsonify({'detail': 'JSON body required'})), 400
        entries = body.get('entries') or []
        if not isinstance(entries, list):
            return _no_cache(jsonify({'detail': 'entries must be an array'})), 400
        try:
            inserted = store.bulk_add_calendar_days(entries, db_path=db_path)
        except Exception as exc:
            return _map_exc(exc)
        return _no_cache(jsonify({
            'inserted': inserted,
            'skipped': len(entries) - inserted,
        })), 201

    # ---- Route table (specific paths before catch-alls) ------------------
    app.add_url_rule('/api/elc/groups', 'elc_list_groups',
                     list_groups, methods=['GET'])
    app.add_url_rule('/api/elc/groups', 'elc_create_group',
                     create_group, methods=['POST'])
    app.add_url_rule('/api/elc/groups/<gid>', 'elc_get_group',
                     get_group, methods=['GET'])
    app.add_url_rule('/api/elc/groups/<gid>', 'elc_update_group',
                     update_group, methods=['PATCH'])
    app.add_url_rule('/api/elc/groups/<gid>', 'elc_delete_group',
                     delete_group, methods=['DELETE'])
    app.add_url_rule('/api/elc/groups/<gid>/members', 'elc_add_member',
                     add_member, methods=['POST'])
    app.add_url_rule('/api/elc/groups/<gid>/members/<path:did>', 'elc_remove_member',
                     remove_member, methods=['DELETE'])
    app.add_url_rule('/api/elc/groups/<gid>/schedules', 'elc_assign_schedule',
                     assign_schedule, methods=['POST'])
    app.add_url_rule('/api/elc/groups/<gid>/schedules/<sid>', 'elc_unassign_schedule',
                     unassign_schedule, methods=['DELETE'])

    app.add_url_rule('/api/elc/schedules', 'elc_list_schedules',
                     list_schedules, methods=['GET'])
    app.add_url_rule('/api/elc/schedules', 'elc_create_schedule',
                     create_schedule, methods=['POST'])
    app.add_url_rule('/api/elc/schedules/<sid>', 'elc_get_schedule',
                     get_schedule, methods=['GET'])
    app.add_url_rule('/api/elc/schedules/<sid>', 'elc_update_schedule',
                     update_schedule, methods=['PATCH'])
    app.add_url_rule('/api/elc/schedules/<sid>', 'elc_delete_schedule',
                     delete_schedule, methods=['DELETE'])
    app.add_url_rule('/api/elc/schedules/<sid>/preview', 'elc_preview_schedule',
                     preview_schedule, methods=['POST'])

    app.add_url_rule('/api/elc/devices/<path:did>/schedules', 'elc_device_schedules',
                     schedules_for_device, methods=['GET'])

    app.add_url_rule('/api/elc/settings', 'elc_get_settings',
                     get_settings, methods=['GET'])
    app.add_url_rule('/api/elc/settings', 'elc_update_settings',
                     update_settings, methods=['PATCH'])

    app.add_url_rule('/api/elc/calendar', 'elc_list_calendar',
                     list_calendar, methods=['GET'])
    app.add_url_rule('/api/elc/calendar', 'elc_add_calendar',
                     add_calendar, methods=['POST'])
    app.add_url_rule('/api/elc/calendar/<entry_id>', 'elc_delete_calendar',
                     delete_calendar, methods=['DELETE'])
    app.add_url_rule('/api/elc/calendar/suggest-holidays', 'elc_suggest_holidays',
                     suggest_holidays, methods=['POST'])
    app.add_url_rule('/api/elc/calendar/bulk', 'elc_bulk_calendar',
                     bulk_add_calendar, methods=['POST'])

    log.info('Flask config API registered (%d routes)', len(_PHASE_CONFIG_ROUTES))
