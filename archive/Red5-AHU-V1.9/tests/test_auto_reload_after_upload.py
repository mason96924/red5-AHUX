"""End-to-end test: a bundle upload that lands a *_service.py in PLUGINS_ROOT
triggers an automatic hot-reload of that module before returning.

Covers:
  - /api/upload-bundle (legacy single-shot) returns reloaded_modules list
  - reload_summary counts match actual results
  - new routes added to weather_service since boot go live immediately
    after upload (no Flask restart, no manual /api/repair/reload-module call)
  - failure path: bundle containing a syntactically-broken plug-in still
    completes extraction, reports per-module error, doesn't take down app
"""
import os, sys, tempfile, io, contextlib, zipfile, json

td = tempfile.mkdtemp(prefix='red5_auto_reload_')
os.makedirs(td + '/scripts', exist_ok=True)
os.makedirs(td + '/data', exist_ok=True)
os.makedirs(td + '/data/pgpy', exist_ok=True)

sys.path.insert(0, '/app/archive/Red5-AHU-V1.9')
os.environ['RED5_DISABLE_BG_THREADS'] = '1'

src = open('/app/archive/Red5-AHU-V1.9/app.py').read()
src = src.replace('/root/data', td + '/data').replace('/root/scripts', td + '/scripts')
src = src.replace('app.run(host=HOST, port=PORT, threaded=True, debug=False)', 'pass')
ns = {'__name__': '__test__', '__file__': '/app/archive/Red5-AHU-V1.9/app.py'}
with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
    exec(compile(src, '/tmp/fakeapp_autoreload.py', 'exec'), ns)
app = ns['app']

PASSED = []; FAILED = []
def t(name, ok, info=''):
    (PASSED if ok else FAILED).append((name, info))
    print(('PASS ' if ok else 'FAIL '), name, '-', info if not ok else '')


def _build_bundle(plugins):
    """Build an unencrypted .zip with each (filename, body) in `plugins`.
    Returns bytes."""
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as zf:
        for fname, body in plugins:
            zf.writestr(fname, body)
    return buf.getvalue()


with app.test_client() as c:
    # --- 1. Inject a NEW route into weather_service.py, ship via bundle ---
    ws_path = sys.modules['weather_service'].__file__
    ws_src  = open(ws_path).read()
    sentinel_route = '/api/_autoreload_test_route'
    sentinel_ep    = '_autoreload_test_handler'
    injection = (
        "    def _autoreload_test_handler():\n"
        "        from flask import jsonify\n"
        "        return jsonify({'ok': True, 'via': 'bundle-auto-reload'})\n"
        "    app.add_url_rule('" + sentinel_route + "', '" + sentinel_ep + "', _autoreload_test_handler, methods=['GET'])\n"
    )
    last_idx = ws_src.rfind('app.add_url_rule(')
    close_paren = ws_src.find(')', ws_src.find('methods=', last_idx))
    end_of_line = ws_src.find('\n', close_paren) + 1
    patched_ws  = ws_src[:end_of_line] + injection + ws_src[end_of_line:]

    # Confirm route does NOT exist yet (sanity).
    r = c.get(sentinel_route)
    t('1a. sentinel route absent BEFORE upload', r.status_code == 404, str(r.status_code))

    # Build a bundle containing only weather_service.py (and a UI file so
    # there's at least one non-plugin entry to prove the loop is selective).
    bundle = _build_bundle([
        ('weather_service.py', patched_ws),
        ('dashboard.html',     '<!DOCTYPE html><html><body>noop</body></html>'),
    ])

    # POST via the legacy single-shot endpoint.
    r = c.post('/api/upload-bundle',
               data={'bundle': (io.BytesIO(bundle), 'red5_bundle.zip'),
                     'password': 'x'},
               content_type='multipart/form-data')
    j = r.get_json() or {}
    t('1b. upload-bundle returns 200', r.status_code == 200, str(r.status_code))
    t('1c. response success=True', j.get('success') is True, str(j)[:200])
    t('1d. reloaded_modules present in response',
      isinstance(j.get('reloaded_modules'), list))
    t('1e. reload_summary present',
      isinstance(j.get('reload_summary'), dict))

    rms = j.get('reloaded_modules') or []
    ws_entry = next((x for x in rms if x.get('module') == 'weather_service'), None)
    t('1f. weather_service auto-reload entry present', ws_entry is not None,
      str(rms))
    if ws_entry:
        t('1g. weather_service reload succeeded', ws_entry.get('success') is True,
          str(ws_entry))
        t('1h. new_endpoints includes injected handler',
          sentinel_ep in (ws_entry.get('new_endpoints') or []),
          str(ws_entry.get('new_endpoints')))

    # Non-plug-in file (dashboard.html) MUST NOT show up in reload list.
    nonpy_in_reload = any(x.get('module', '').endswith('html') for x in rms)
    t('1i. only *_service.py modules reloaded (no .html in list)',
      not nonpy_in_reload)

    # Pre-existing weather endpoints still bound.
    t('1j. weather_service /api/weather-location still bound after auto-reload',
      'get_weather_location' in app.view_functions)

    # The new route is LIVE — no manual reload-module call needed.
    r2 = c.get(sentinel_route)
    t('1k. sentinel route LIVE after bundle upload (auto-reload worked)',
      r2.status_code == 200, str(r2.status_code))
    j2 = r2.get_json() or {}
    t('1l. sentinel route returns expected body',
      j2.get('ok') is True and j2.get('via') == 'bundle-auto-reload',
      str(j2))

    # Self-documenting deploy panel: route_map maps each endpoint to its
    # actual URL rule + HTTP methods.
    if ws_entry:
        rm = ws_entry.get('route_map') or {}
        t('1l-rm-a. route_map is a dict', isinstance(rm, dict))
        t('1l-rm-b. route_map contains entry for injected handler',
          sentinel_ep in rm, 'keys=' + str(list(rm.keys()))[:200])
        if sentinel_ep in rm:
            entries = rm[sentinel_ep]
            t('1l-rm-c. route_map entry is a list', isinstance(entries, list) and len(entries) > 0)
            if entries:
                rt = entries[0]
                t('1l-rm-d. rule field matches injected route',
                  rt.get('rule') == sentinel_route,
                  'rule=' + str(rt.get('rule')))
                t('1l-rm-e. methods is a list (no HEAD/OPTIONS noise)',
                  isinstance(rt.get('methods'), list) and 'HEAD' not in rt['methods']
                  and 'OPTIONS' not in rt['methods'],
                  'methods=' + str(rt.get('methods')))
                t('1l-rm-f. methods includes GET (matches injection)',
                  'GET' in (rt.get('methods') or []))
        # Pre-existing swapped endpoints also get their rules populated.
        gwl = rm.get('get_weather_location') or []
        t('1l-rm-g. pre-existing swapped endpoint has route entries',
          len(gwl) > 0,
          'get_weather_location=' + str(gwl))
        if gwl:
            t('1l-rm-h. pre-existing endpoint rule is /api/weather-location',
              gwl[0].get('rule') == '/api/weather-location',
              str(gwl[0]))

    # Reload summary counts match.
    summary = j.get('reload_summary') or {}
    t('1m. reload_summary.attempted matches list length',
      summary.get('attempted') == len(rms),
      'attempted=' + str(summary.get('attempted')) + ' len(rms)=' + str(len(rms)))
    t('1n. reload_summary.succeeded counts truthy entries',
      summary.get('succeeded') == sum(1 for x in rms if x.get('success')))

    # Restore weather_service to its pre-test state via another bundle.
    bundle_restore = _build_bundle([('weather_service.py', ws_src)])
    c.post('/api/upload-bundle',
           data={'bundle': (io.BytesIO(bundle_restore), 'red5_bundle.zip'),
                 'password': 'x'},
           content_type='multipart/form-data')

    # --- 2. Failure path: broken plug-in (SyntaxError) should be reported
    # per-module without aborting the deploy.  We can't ship a literal
    # SyntaxError as register() (importlib.import_module would fail on the
    # MODULE body), so simulate a register() RAISE instead: replace the
    # weather_service body with one that imports cleanly but raises in
    # register().
    broken_ws = (
        "import os\n"
        "import sys\n"
        "_service_dependencies = ['DATA_ROOT']\n"
        "def register(app, ctx):\n"
        "    raise RuntimeError('deliberate test failure in register')\n"
    )
    bundle_bad = _build_bundle([('weather_service.py', broken_ws)])
    r = c.post('/api/upload-bundle',
               data={'bundle': (io.BytesIO(bundle_bad), 'red5_bundle.zip'),
                     'password': 'x'},
               content_type='multipart/form-data')
    j = r.get_json() or {}
    t('2a. upload still returns 200 even with broken plug-in',
      r.status_code == 200, str(r.status_code))
    t('2b. response overall success=True (extraction succeeded)',
      j.get('success') is True)
    rms = j.get('reloaded_modules') or []
    ws_entry = next((x for x in rms if x.get('module') == 'weather_service'), None)
    t('2c. weather_service entry reports success=False',
      ws_entry is not None and ws_entry.get('success') is False,
      str(ws_entry))
    if ws_entry:
        t('2d. error message mentions register failure',
          'register' in (ws_entry.get('error') or '').lower(),
          str(ws_entry.get('error')))
    summary = j.get('reload_summary') or {}
    t('2e. reload_summary.failed >= 1', summary.get('failed', 0) >= 1,
      str(summary))

    # Restore weather_service once more so subsequent test runs are clean.
    bundle_restore = _build_bundle([('weather_service.py', ws_src)])
    c.post('/api/upload-bundle',
           data={'bundle': (io.BytesIO(bundle_restore), 'red5_bundle.zip'),
                 'password': 'x'},
           content_type='multipart/form-data')

    # --- 3. Bundle with NO plug-ins → reloaded_modules is empty (sanity) ---
    bundle_ui_only = _build_bundle([
        ('dashboard.html', '<!DOCTYPE html><html><body>noop</body></html>'),
    ])
    r = c.post('/api/upload-bundle',
               data={'bundle': (io.BytesIO(bundle_ui_only), 'red5_bundle.zip'),
                     'password': 'x'},
               content_type='multipart/form-data')
    j = r.get_json() or {}
    t('3a. UI-only bundle returns 200', r.status_code == 200)
    t('3b. reloaded_modules empty for UI-only bundle',
      j.get('reloaded_modules') == [])
    t('3c. reload_summary.attempted == 0',
      (j.get('reload_summary') or {}).get('attempted') == 0)

print()
print('SUMMARY:', len(PASSED), 'passed,', len(FAILED), 'failed')
if FAILED:
    sys.exit(1)
import shutil; shutil.rmtree(td, ignore_errors=True)
