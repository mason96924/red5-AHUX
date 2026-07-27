"""
elc_flask_api.py — Phase 2 Flask-native /api/elc/* routes for the controller.

Wires V3.0 project + sun-times logic directly into Flask (V1.9 style) without
starting uvicorn.  Settings MVP routes match scripts/demo.py response shapes.

Uses add_url_rule (not @app.route) so upload_service hot-reload can attach
new endpoints after Flask has served its first request.
"""
from __future__ import annotations

import logging
import os
import sys
from datetime import date as date_cls
from pathlib import Path

from flask import jsonify, request

log = logging.getLogger('elc_flask_api')

_PROJECT_PATH: Path | None = None
_no_cache = None

_PHASE2_ROUTES = (
    'GET /api/elc/project',
    'POST /api/elc/project',
    'POST /api/elc/project/expand-devices',
    'GET /api/elc/sun-times',
)


def phase2_routes() -> tuple[str, ...]:
    return _PHASE2_ROUTES


def _wire_paths(data_root: str) -> Path:
    """Point project.json + SQLite at the controller data root."""
    config_dir = os.path.join(data_root, 'configs')
    os.makedirs(config_dir, exist_ok=True)
    project_path = Path(config_dir) / 'project.json'
    db_path = os.path.join(config_dir, 'elc_config.db')

    os.environ['RED5_DATA_ROOT'] = data_root
    os.environ['ELC_PROJECT_JSON'] = str(project_path)
    os.environ['ELC_CONFIG_DB_PATH'] = db_path

    import elc.config.store as config_store

    config_store.DEFAULT_DB_PATH = db_path
    config_store.init(db_path)
    return project_path


def register(app, data_root: str, plugins_root: str, no_cache) -> None:
    """Register Phase 2 settings MVP routes on the Flask app."""
    global _PROJECT_PATH, _no_cache
    _no_cache = no_cache

    if plugins_root not in sys.path:
        sys.path.insert(0, plugins_root)

    _PROJECT_PATH = _wire_paths(data_root)

    from elc.config.project import (
        ProjectConfig,
        is_configured,
        load_project,
        save_project,
        _dump_model,
        _parse_model,
    )

    def get_project():
        cfg = load_project(_PROJECT_PATH)
        body = {
            'configured': is_configured(_PROJECT_PATH),
            'path': str(_PROJECT_PATH),
            'project': _dump_model(cfg) if cfg else None,
        }
        return _no_cache(jsonify(body))

    def post_project():
        body = request.get_json(silent=True)
        if not isinstance(body, dict):
            return _no_cache(jsonify({'detail': 'JSON body required'})), 400
        try:
            cfg = _parse_model(ProjectConfig, body)
        except Exception as exc:
            return _no_cache(jsonify({
                'detail': f'invalid project.json: {exc}',
            })), 400
        try:
            save_project(cfg, _PROJECT_PATH)
            from elc.floors.store import get_or_create_floor_by_strand

            created: list[str] = []
            for label in cfg.strand_labels():
                row = get_or_create_floor_by_strand(label)
                if row.get('created_at') == row.get('updated_at'):
                    created.append(label)
        except Exception as exc:
            log.exception('POST /api/elc/project failed')
            return _no_cache(jsonify({'detail': str(exc)})), 500
        try:
            import elc_flask_link
            elc_flask_link.stop()
            db_path = os.environ.get('ELC_CONFIG_DB_PATH', '')
            elc_flask_link.start(_PROJECT_PATH, db_path)
        except Exception as exc:
            log.warning('SCU link restart after project save: %s', exc)
        return _no_cache(jsonify({
            'ok': True,
            'path': str(_PROJECT_PATH),
            'floors_created': created,
        }))

    def expand_devices():
        cfg = load_project(_PROJECT_PATH)
        if cfg is None:
            return _no_cache(jsonify({'detail': 'no project.json yet'})), 404
        return _no_cache(jsonify({
            'devices': cfg.to_devices_json(),
            'scus': len(cfg.scus),
        }))

    def sun_times():
        date_iso = (request.args.get('date_iso') or '').strip()
        cfg = load_project(_PROJECT_PATH)
        prof = cfg.project if cfg else None
        on = None
        if date_iso:
            try:
                on = date_cls.fromisoformat(date_iso)
            except ValueError as exc:
                return _no_cache(jsonify({'detail': f'bad date_iso: {exc}'})), 400
        try:
            from elc.util.astro import sun_times_for
        except ImportError as exc:
            return _no_cache(jsonify({
                'detail': f'sun-times unavailable (astral not installed): {exc}',
            })), 503
        try:
            payload = sun_times_for(
                latitude=prof.latitude if prof else 0.0,
                longitude=prof.longitude if prof else 0.0,
                tz_name=prof.timezone if prof else 'UTC',
                on=on,
                sunrise_offset_min=prof.sunrise_offset_min if prof else 0,
                sunset_offset_min=prof.sunset_offset_min if prof else 0,
            )
        except Exception as exc:
            return _no_cache(jsonify({'detail': f'sun-times: {exc}'})), 400
        return _no_cache(jsonify(payload))

    app.add_url_rule('/api/elc/project', 'elc_get_project',
                     get_project, methods=['GET'])
    app.add_url_rule('/api/elc/project', 'elc_post_project',
                     post_project, methods=['POST'])
    app.add_url_rule('/api/elc/project/expand-devices', 'elc_expand_devices',
                     expand_devices, methods=['POST'])
    app.add_url_rule('/api/elc/sun-times', 'elc_sun_times',
                     sun_times, methods=['GET'])

    log.info('Phase 2 Flask API registered (%d routes)', len(_PHASE2_ROUTES))
