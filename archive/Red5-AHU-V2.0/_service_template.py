"""
_service_template.py — Red5 plug-in skeleton
============================================
Copy this file, rename to `<name>_service.py` (note the trailing
`_service.py` — that's how the auto-discovery loop in app.py finds it),
fill in the four marked spots, drop it into the next bundle upload, and
restart Flask.  app.py picks it up automatically — no edit to the core
needed.

The naming convention `_service_template.py` (template suffix, not
`_service` suffix) is deliberate: this template DOES NOT match the
`*_service.py` glob, so it never gets loaded as a real service even if
deployed to /root/scripts/ alongside the others.

----- The 4 things you fill in -----
    1. The `_service_dependencies` list
    2. Your route handler functions
    3. The `register()` body (what routes you add)
    4. (Optional) module-level constants / background threads

----- The contract -----
    * Module name MUST end with `_service.py`
    * Module MUST define a `register(app, ctx)` function
    * Module SHOULD define `_service_dependencies = [...]` with the
      SERVICE_CTX keys you actually use — the loader validates these
      BEFORE calling register() and SKIPS your module with a clear log
      line if any are missing (instead of crashing mid-register).
    * Any failure inside register() is caught by app.py and reported as
      `[<your_name>] FAILED to register: <error>` — boot continues.

----- SERVICE_CTX keys available -----
    DATA_ROOT          str  — '/root/data' on the controller
    SCRIPTS_ROOT       str  — '/root/scripts'
    ALLOWED_EXTENSIONS set  — extensions the bundle uploader accepts
    MASTER_KEY_CONST   str  — bundle master key (treat as a secret)
    _derive_key        func — PBKDF2 password→key helper
    _no_cache          func — wraps a Response with no-cache headers
    get_psat           func — psychrometric saturation pressure
    get_w              func — psychrometric humidity ratio
    get_h              func — psychrometric enthalpy
    ahu_records        dict — mock seed AHU data (mutable)

    Optional flags (set in app.py via env-vars):
        start_forecast_thread, start_band_thread — booleans for
        suppressing background daemons during testing.
"""
from flask import jsonify, request


# 1) Declare what you need from SERVICE_CTX.  The loader will SKIP this
#    module (with a clear log line) if any of these keys are missing —
#    so an old app.py + a new service module won't cause a 500 cascade.
_service_dependencies = ['DATA_ROOT']


# Module-level state filled in by register().  Keep these as None until
# register() runs, so importing this module before app.py is safe.
DATA_ROOT = None


# 2) Your route handlers — plain Flask views.  They have access to the
#    module-level globals you populate in register().  Keep them small;
#    move heavy logic into helper functions defined below.

def _hello_handler():
    """GET /api/<name>/hello — example."""
    return jsonify({
        'service': 'template',
        'data_root': DATA_ROOT,
        'message': 'Hello from the plug-in template.',
    })


def _echo_handler():
    """POST /api/<name>/echo — example with JSON body."""
    body = request.get_json(silent=True) or {}
    return jsonify({'echoed': body})


# 3) The mandatory entry point.  app.py calls this once at boot.
#    Use app.add_url_rule() (NOT @app.route) so this module stays
#    importable without a Flask app context.
def register(app, ctx):
    """Attach this plug-in's routes to ``app``.

    ``ctx`` is the SERVICE_CTX dict assembled by app.py.  Pull only the
    keys you declared in _service_dependencies above.
    """
    global DATA_ROOT
    DATA_ROOT = ctx['DATA_ROOT']

    app.add_url_rule('/api/template/hello', 'template_hello',
                     _hello_handler, methods=['GET'])
    app.add_url_rule('/api/template/echo',  'template_echo',
                     _echo_handler,  methods=['POST'])

    # 4) (Optional) start a background thread, do some warm-up, etc.
    # NB: gate any daemons behind a ctx flag so tests can suppress them:
    #
    #     if ctx.get('start_my_thread', True):
    #         import threading
    #         threading.Thread(target=_my_loop, daemon=True,
    #                          name='my-service-loop').start()
