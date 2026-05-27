"""Flask route invariants.

Regression history:
  - The HOME button in equipment_mapper.html linked to /dashboard.html, but
    app.py only registered /dashboard (no .html).  Result: 404 on every
    HOME click.  Fixed by adding .html-suffixed route aliases.
  - Future "simplification" passes that remove the duplicate-looking
    decorator stack would silently re-break the HOME button.

Invariant:
  app.py must register Flask routes for the .html-suffixed forms of
  the user-facing HTML pages.
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
V19  = os.path.dirname(HERE)
APP  = os.path.join(V19, 'app.py')

REQUIRED_HTML_ROUTES = [
    '/dashboard.html',
    '/equipment_mapper.html',
    '/landing.html',
    '/ahu.html',
]


def test_html_routes_registered():
    src = open(APP).read()
    missing = []
    for route in REQUIRED_HTML_ROUTES:
        pat = r"@app\.route\(['\"]" + re.escape(route) + r"['\"]"
        if not re.search(pat, src):
            missing.append(route)
    assert not missing, (
        f'app.py is missing Flask routes for: {missing}.  Regression: '
        f'the HOME button in equipment_mapper.html links to /dashboard.html '
        f'-- if that route is gone, HOME returns 404.'
    )


def test_legacy_bare_routes_still_present():
    """Don't remove the bare /dashboard and /mapper aliases either --
    direct entries from older bookmarks rely on them."""
    src = open(APP).read()
    for route in ('/dashboard', '/mapper'):
        pat = r"@app\.route\(['\"]" + re.escape(route) + r"['\"]"
        assert re.search(pat, src), (
            f'Legacy route {route} was removed.  Keep it for back-compat '
            f'with older bookmarks and the /landing redirect chain.'
        )
