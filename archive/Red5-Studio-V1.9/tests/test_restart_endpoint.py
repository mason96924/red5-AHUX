"""/api/restart-flask endpoint invariants.

Design history (regression-prone):
  - v1: os._exit(0) + 1-s delay.  Assumed enteliWEB auto-respawns app.py
    -- it does NOT.  Killed Flask, controller went dark until manual
    Start in enteliWEB UI.  Brick risk.
  - v2 (current): importlib.reload() of every loaded plug-in module.
    Process stays alive on same PID.  Cannot pick up NEW @app.route
    decorators (URL map is built once) -- those still need manual
    enteliWEB Stop/Start, which the wrapper script warns about.

Invariants:
  1. Route registered with POST
  2. Gated by MASTER_KEY_CONST
  3. Does NOT call os._exit / sys.exit / os.kill (would brick controller)
  4. Uses importlib.reload to refresh modules in-place
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
V19  = os.path.dirname(HERE)
APP  = os.path.join(V19, 'app.py')


def _body():
    src = open(APP).read()
    m = re.search(
        r"def restart_flask\([^)]*\):[\s\S]*?(?=\n@app\.route|\ndef\s|\Z)",
        src,
    )
    assert m, 'restart_flask() function body not found'
    return m.group(0)


def test_restart_endpoint_registered():
    src = open(APP).read()
    assert re.search(
        r"@app\.route\(['\"]/api/restart-flask['\"][^)]*methods=\[['\"]POST['\"]\]",
        src,
    ), '/api/restart-flask POST route is missing'


def test_restart_endpoint_gated_by_master_key():
    body = _body()
    assert 'MASTER_KEY_CONST' in body, (
        'restart_flask() must check the master key.  Regression: an '
        'unauthenticated reload endpoint exposed via Cloudflare lets '
        'anyone trigger arbitrary code re-execution on the controllers.'
    )
    assert '401' in body, 'restart_flask() must return 401 on wrong key.'


def test_restart_endpoint_does_not_kill_process():
    """CRITICAL regression guard.  An earlier version called os._exit(0)
    under the (wrong) assumption that enteliWEB respawns the app.py
    object.  It does not.  If that version is ever re-introduced, this
    test screams."""
    body = _body()
    # Strip out docstring(s) so a `os._exit(0)` reference in the design
    # notes doesn't trigger a false positive.
    code_only = re.sub(r'"""[\s\S]*?"""', '', body)
    code_only = re.sub(r"'''[\s\S]*?'''", '', code_only)

    # Look for function CALLS, not bare references in comments.
    forbidden = [
        (r'\bos\._exit\s*\(',     'Calls os._exit -- kills Flask without respawn'),
        (r'\b_os\._exit\s*\(',    'Calls _os._exit -- kills Flask without respawn'),
        (r'\bsys\.exit\s*\(',     'Calls sys.exit -- terminates the process'),
        (r'\bos\.kill\s*\(',      'Calls os.kill -- terminates the process'),
        (r'\bsignal\.SIG[A-Z]+',  'References a signal constant -- likely sent to terminate'),
    ]
    hits = [msg for pat, msg in forbidden if re.search(pat, code_only)]
    assert not hits, (
        'restart_flask() must NOT kill the Flask process.  enteliWEB does '
        'not auto-respawn, so any exit leaves the controller dark.  '
        'Found banned patterns: ' + '; '.join(hits)
    )


def test_restart_endpoint_uses_importlib_reload():
    body = _body()
    assert 'importlib' in body and 'reload' in body, (
        'restart_flask() must use importlib.reload() to refresh modules '
        'in-place without exiting.'
    )
