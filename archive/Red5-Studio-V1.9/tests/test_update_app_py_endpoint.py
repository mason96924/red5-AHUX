"""/api/update-app-py endpoint invariants.

Why this test exists:
  This endpoint exists so the operator can replace /root/scripts/app.py
  without SSH access -- specifically to bypass the bootloader-protection
  guard in the bundle extractor.  Because the endpoint writes to the
  bootloader path, regressing this code is high-risk: a bug could brick
  a controller until a console session is available.

  This test enforces:
    1. The route is registered with POST
    2. It is gated by MASTER_KEY_CONST (never unauthenticated)
    3. It ast-parses the uploaded content before writing
    4. It writes atomically (tempfile + os.rename / os.replace)
    5. It backs up the existing file to app.py.bak first
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
V19  = os.path.dirname(HERE)
APP  = os.path.join(V19, 'app.py')


def _body():
    src = open(APP).read()
    m = re.search(
        r"def update_app_py\([^)]*\):[\s\S]*?(?=\n@app\.route|\ndef\s|\Z)",
        src,
    )
    assert m, 'update_app_py() function body not found'
    return m.group(0)


def test_update_app_py_route_registered():
    src = open(APP).read()
    assert re.search(
        r"@app\.route\(['\"]/api/update-app-py['\"][^)]*methods=\[['\"]POST['\"]\]",
        src,
    ), '/api/update-app-py POST route is missing'


def test_update_app_py_gated_by_master_key():
    body = _body()
    assert 'MASTER_KEY_CONST' in body, (
        'update_app_py() must check the master key.  Without this check, '
        'anyone reaching the Cloudflare tunnel could overwrite the '
        'bootloader and brick the controller.'
    )
    assert '401' in body, 'update_app_py() must return 401 on wrong key.'


def test_update_app_py_validates_python_syntax():
    body = _body()
    assert 'ast.parse' in body, (
        'update_app_py() must ast.parse() the uploaded content before '
        'writing it.  Refusing syntactically-broken input is the only '
        'thing that prevents a typo from bricking the controller.'
    )


def test_update_app_py_writes_atomically():
    body = _body()
    # Either os.replace or os.rename + tempfile
    has_atomic = ('os.replace' in body or '_os.replace' in body)
    has_tmp    = ('tempfile' in body or 'mkstemp' in body)
    assert has_atomic and has_tmp, (
        'update_app_py() must write via tempfile + os.replace to avoid '
        'leaving a truncated file at /root/scripts/app.py if the write '
        'is interrupted mid-flight.'
    )


def test_update_app_py_backs_up_existing():
    body = _body()
    assert 'app.py.bak' in body or '.bak' in body, (
        'update_app_py() must back up the existing /root/scripts/app.py '
        "to .bak so the operator can recover via console if the new file "
        "fails to import at runtime."
    )
