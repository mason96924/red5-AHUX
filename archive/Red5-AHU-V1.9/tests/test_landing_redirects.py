"""landing.html SKIP-to-dashboard redirect invariant.

Regression history:
  - landing.html and red5_landing.html had `window.location.href = '/dashboard'`
    which 404s on V1.9 controllers (Flask only registered /dashboard via the
    bare route at one point; after the .html-route patch it's fine, but the
    bare /dashboard form is still considered legacy and breaks if the alias
    is ever removed).  Standard form is /dashboard.html.

Invariant:
  Every JS redirect to the dashboard in landing.html / red5_landing.html
  uses /dashboard.html, never a bare /dashboard.
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
V19  = os.path.dirname(HERE)

LANDING_FILES = [
    os.path.join(V19, 'landing.html'),
]


def test_landing_skip_uses_dashboard_html():
    for f in LANDING_FILES:
        if not os.path.exists(f):
            continue
        src = open(f).read()
        # Find every assignment to window.location.href (or .replace/.assign)
        bare = re.findall(
            r"location\.(?:href|replace|assign)\s*=?\s*\(?\s*['\"](/dashboard)['\"]",
            src,
        )
        assert not bare, (
            f'{f}: contains bare /dashboard redirect (must be /dashboard.html). '
            f'Found: {bare}'
        )
