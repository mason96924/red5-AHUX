"""Flask route invariants.

Regression history:
  - The HOME button in equipment_mapper.html linked to /dashboard.html, but
    app.py only registered /dashboard (no .html).  Result: 404 on every
    HOME click.  Fixed by adding .html-suffixed route aliases.
  - Future "simplification" passes that remove the duplicate-looking
    decorator stack would silently re-break the HOME button.

Invariant:
  User-facing HTML routes must be registered somewhere under V1.9/*.py.
  Most live in app.py; short URLs (/access.html, /setup.html) and root →
  access are in pages_service.py so app.py stays under the enteliWEB
  size budget.
"""
import glob
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
V19  = os.path.dirname(HERE)

REQUIRED_HTML_ROUTES = [
    '/dashboard.html',
    '/equipment_mapper.html',
    '/landing.html',
    '/access.html',
    '/setup.html',
    '/ahu.html',
]

# Routes intentionally moved out of app.py (plug-in only).
PLUGIN_ONLY_ROUTES = {'/access.html', '/setup.html'}


def _v19_py_sources():
    paths = [os.path.join(V19, 'app.py')]
    paths.extend(sorted(glob.glob(os.path.join(V19, '*_service.py'))))
    return paths


def test_html_routes_registered():
    combined = ''
    for path in _v19_py_sources():
        combined += open(path).read() + '\n'
    missing = []
    for route in REQUIRED_HTML_ROUTES:
        pat = r"@app\.route\(['\"]" + re.escape(route) + r"['\"]"
        if not re.search(pat, combined):
            missing.append(route)
    assert not missing, (
        f'V1.9 is missing Flask routes for: {missing}.  Regression: '
        f'the HOME button in equipment_mapper.html links to /dashboard.html '
        f'-- if that route is gone, HOME returns 404.'
    )


def test_plugin_only_routes_not_in_app_py():
    """Keep enteliWEB-sized app.py — short URLs live in pages_service.py."""
    src = open(os.path.join(V19, 'app.py')).read()
    for route in PLUGIN_ONLY_ROUTES:
        pat = r"@app\.route\(['\"]" + re.escape(route) + r"['\"]"
        assert not re.search(pat, src), (
            f'{route} was added back to app.py.  Register it in '
            f'pages_service.py instead to avoid the enteliWEB save limit.'
        )


def test_legacy_bare_routes_still_present():
    """Don't remove the bare /dashboard and /mapper aliases either --
    direct entries from older bookmarks rely on them."""
    src = open(os.path.join(V19, 'app.py')).read()
    for route in ('/dashboard', '/mapper'):
        pat = r"@app\.route\(['\"]" + re.escape(route) + r"['\"]"
        assert re.search(pat, src), (
            f'Legacy route {route} was removed.  Keep it for back-compat '
            f'with older bookmarks and the /landing redirect chain.'
        )
