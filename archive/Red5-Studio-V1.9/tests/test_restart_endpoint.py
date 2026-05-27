"""/api/restart-flask endpoint invariant.

Why this test exists:
  This endpoint exists specifically so the operator can refresh /root/scripts/
  app.py without SSH access.  If a future "cleanup" pass deletes it, the only
  way back to a running new app.py is a console session or a reboot.

  It MUST be:
    1. registered on the /api/restart-flask path with POST
    2. gated by MASTER_KEY_CONST (not unauthenticated)
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
V19  = os.path.dirname(HERE)
APP  = os.path.join(V19, 'app.py')


def test_restart_endpoint_registered():
    src = open(APP).read()
    assert re.search(
        r"@app\.route\(['\"]/api/restart-flask['\"][^)]*methods=\[['\"]POST['\"]\]",
        src,
    ), '/api/restart-flask POST route is missing'


def test_restart_endpoint_gated_by_master_key():
    src = open(APP).read()
    # Find the function body and verify MASTER_KEY_CONST is referenced.
    m = re.search(
        r"def restart_flask\([^)]*\):[\s\S]*?(?=\n@app\.route|\ndef\s|\Z)",
        src,
    )
    assert m, 'restart_flask() function body not found'
    body = m.group(0)
    assert 'MASTER_KEY_CONST' in body, (
        'restart_flask() must check the master key.  Regression: an '
        'unauthenticated restart endpoint exposed to Cloudflare-tunneled '
        "controllers is a remote-DoS button anyone on the internet can press."
    )
    assert '401' in body, (
        'restart_flask() must return 401 on wrong key.'
    )
