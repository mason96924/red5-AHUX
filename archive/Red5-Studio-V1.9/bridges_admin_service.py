"""Admin endpoints for AHU data bridges.  Operator-facing surface:

    GET  /api/bridges/status   → live status of each registered bridge
    GET  /api/bridges/config   → current bridges.json contents
    POST /api/bridges/config   → replace bridges.json (atomic, validated)

The actual bridge logic lives in webhook_bridge_service.py / mqtt_/ modbus_/
ws_bridge_service.py.  This module is purely an inspection + config UI.
"""
from flask import jsonify, request

from _bridges_lib import (
    load_bridges_config, save_bridges_config, all_bridge_status,
)


def get_bridges_status():
    return jsonify({'success': True, 'bridges': all_bridge_status()})


def get_bridges_config():
    return jsonify({'success': True, 'config': load_bridges_config()})


def post_bridges_config():
    try:
        data = request.get_json(force=True, silent=True)
        if not isinstance(data, dict):
            return jsonify({'success': False, 'error': 'JSON body must be a dict'}), 400
        cleaned = save_bridges_config(data)
        return jsonify({'success': True, 'config': cleaned,
                        'note': 'Saved. Hot-reload bridge plug-ins via /api/repair/reload-module/<bridge>_bridge_service for the new settings to take effect.'})
    except ValueError as e:
        return jsonify({'success': False, 'error': str(e)}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


def register(app, ctx):
    app.add_url_rule('/api/bridges/status', 'get_bridges_status',
                     get_bridges_status, methods=['GET'])
    app.add_url_rule('/api/bridges/config', 'get_bridges_config',
                     get_bridges_config, methods=['GET'])
    app.add_url_rule('/api/bridges/config', 'post_bridges_config',
                     post_bridges_config, methods=['POST'])
