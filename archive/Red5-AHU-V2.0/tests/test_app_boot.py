"""Guarded enteliWEB bootloader -- archive/Red5-AHU-V1.9/app_boot.py.

The one-line loader could not provision a blank controller.  exec() of a
missing /root/data/pgpy/app_main.py raised before Flask was built, so nothing
bound :5001, so /update -- the only way to upload the bundle that creates
app_main.py -- never existed.  The documented way out was to fetch the
bootloader over HTTP from a controller that already worked, which is no help
at a first site.

These tests pin the three boot paths (present / absent / broken), the zip
routing the bootstrap extractor shares with upload_service, and the paste
size, which is the one property the controller enforces silently.
"""
from __future__ import annotations

import ast
import importlib.util
import io
import json
import os
import socket
import threading
import time
import urllib.error
import urllib.request
import zipfile
from pathlib import Path

import pytest

# Lives with the other bootloader tests (test_bootloader_protection.py), but
# the file under test ships from V1.9 -- that is the tree build_bundle.py packs.
V19 = Path(__file__).resolve().parents[2] / 'Red5-AHU-V1.9'
BOOT_PY = V19 / 'app_boot.py'

_counter = [0]


def load_boot(tmp_path: Path, port: int | None = None):
    """Import app_boot.py against a throwaway /root, without running main()."""
    data_root = tmp_path / 'data'
    scripts_root = tmp_path / 'scripts'
    auth_root = tmp_path / 'auth'
    (data_root / 'pgpy').mkdir(parents=True)
    scripts_root.mkdir()
    os.environ['RED5_BOOT_IMPORT_ONLY'] = '1'
    os.environ['RED5_DATA_ROOT'] = str(data_root)
    os.environ['RED5_SCRIPTS_ROOT'] = str(scripts_root)
    os.environ['RED5_AUTH_ROOT'] = str(auth_root)
    os.environ['RED5_HOST'] = '127.0.0.1'
    os.environ['RED5_PORT'] = str(port or 5001)
    _counter[0] += 1
    spec = importlib.util.spec_from_file_location(
        'ahu_app_boot_{0}'.format(_counter[0]), BOOT_PY)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod, data_root, scripts_root, auth_root


def write_bootloader(data_root: Path, body: str) -> Path:
    path = data_root / 'pgpy' / 'app_main.py'
    path.write_text(body)
    return path


def marker_source(marker: Path, text: str) -> str:
    """Bootloader body whose only job is to prove it ran.

    The handle is closed explicitly: an unclosed one raises a ResourceWarning
    that a strict pytest config turns into a failure.
    """
    return 'with open({0!r}, "w") as fh:\n    fh.write({1!r})\n'.format(
        str(marker), text)


# ---------------------------------------------------------------------
# Boot path 1 -- app_main.py on disk: behave exactly like the one-liner.
# ---------------------------------------------------------------------

def test_execs_bootloader_when_present(tmp_path):
    boot, data_root, _, _ = load_boot(tmp_path)
    marker = tmp_path / 'ran.txt'
    write_bootloader(data_root, marker_source(marker, 'started'))

    boot.main()

    assert marker.read_text() == 'started'


def test_empty_bootloader_is_not_treated_as_present(tmp_path):
    """A truncated HTTP stage leaves a 0-byte file; that is not 'ready'."""
    boot, data_root, _, _ = load_boot(tmp_path)
    write_bootloader(data_root, '')

    assert boot.bootloader_path() is None


# ---------------------------------------------------------------------
# Boot path 2 -- nothing on disk: serve the bootstrap page and take a bundle.
# ---------------------------------------------------------------------

def test_bootstrap_page_is_served_and_says_why(tmp_path):
    boot, _, _, _ = load_boot(tmp_path)
    app, _state = boot.bootstrap_app('app_main.py is not on disk yet',
                                     'Looked for: /nowhere/app_main.py')
    client = app.test_client()

    for url in ('/', '/update', '/update.html'):
        resp = client.get(url)
        assert resp.status_code == 200, url
        body = resp.get_data(as_text=True)
        assert 'BOOTSTRAP MODE' in body
        assert 'red5_bundle.zip' in body
        assert 'app_main.py is not on disk yet' in body


def make_bundle() -> bytes:
    """A stand-in for red5_bundle.zip covering every routing rule."""
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w') as zf:
        zf.writestr('app_main.py', 'print("boot")\n')
        zf.writestr('upload_service.py', 'def register(app, ctx): pass\n')
        zf.writestr('collector.py', 'pass\n')
        zf.writestr('dashboard.html', '<html></html>')
        zf.writestr('js/heat-auto.js', 'var x = 1;')
        zf.writestr('configs/band_defaults.json', '{}')
        zf.writestr('repair_manifest.json', '{"files": []}')
        zf.writestr('loose_config.json', '{}')
        zf.writestr('docs/runbook.md', '# runbook')
        zf.writestr('red5_auth/users.json', '{}')
        zf.writestr('red5_auth/evil.json', '{}')
        # Must never land: the pasted bootloader, tests, caches.
        zf.writestr('app.py', 'raise SystemExit("must not deploy")')
        zf.writestr('tests/test_thing.py', 'def test_x(): pass')
        zf.writestr('__pycache__/x.cpython-311.pyc', b'\x00\x01')
        # What Finder's Compress adds to a re-zipped bundle.
        zf.writestr('__MACOSX/._dashboard.html', b'\x00\x05\x16\x07')
        zf.writestr('__MACOSX/._band_service.py', b'\x00\x05\x16\x07')
        zf.writestr('.DS_Store', b'\x00\x01')
        zf.writestr('js/.eslintrc.json', '{}')
    return buf.getvalue()


def test_upload_routes_every_file_like_upload_service(tmp_path):
    boot, data_root, scripts_root, auth_root = load_boot(tmp_path)
    app, state = boot.bootstrap_app('missing', 'detail')

    payload = app.test_client().post(
        '/api/bootstrap-upload',
        data={'bundle': (io.BytesIO(make_bundle()), 'red5_bundle.zip')},
        content_type='multipart/form-data',
    ).get_json()

    assert payload['success'] is True
    assert payload['promoting'] is True

    pgpy = data_root / 'pgpy'
    # Every .py flattens into pgpy/ -- the firmware wipes /root/scripts.
    assert (pgpy / 'app_main.py').exists()
    assert (pgpy / 'upload_service.py').exists()
    assert (pgpy / 'collector.py').exists()
    # UI and docs keep their path under DATA_ROOT.
    assert (data_root / 'dashboard.html').exists()
    assert (data_root / 'js' / 'heat-auto.js').exists()
    assert (data_root / 'docs' / 'runbook.md').exists()
    # Loose json is filed under configs/; the manifest stays where the
    # manifest reader looks for it.
    assert (data_root / 'configs' / 'band_defaults.json').exists()
    assert (data_root / 'configs' / 'loose_config.json').exists()
    assert (data_root / 'repair_manifest.json').exists()
    # Auth state lands in its own root, and only the three known leaves.
    assert (auth_root / 'users.json').exists()
    assert not (auth_root / 'evil.json').exists()
    # Refused: the pasted bootloader, tests, bytecode.
    assert not (data_root / 'app.py').exists()
    assert not (pgpy / 'app.py').exists()
    assert not (pgpy / 'test_thing.py').exists()
    assert not list(data_root.glob('**/*.pyc'))
    # Refused: anything with a dot-leading path component.  The AppleDouble
    # sidecars are the dangerous ones -- ._dashboard.html passes the extension
    # allow-list, and ._band_service.py would match the plug-in glob.
    assert not (data_root / '__MACOSX').exists()
    assert not (pgpy / '._band_service.py').exists()
    assert not list(pgpy.glob('._*'))
    assert not (data_root / '.DS_Store').exists()
    assert not (data_root / 'configs' / '.eslintrc.json').exists()
    assert not (data_root / 'js' / '.eslintrc.json').exists()
    assert not list(scripts_root.iterdir())
    assert state['promote'] == str(pgpy / 'app_main.py')


def test_site_configs_are_not_clobbered_by_a_recovery_upload(tmp_path):
    """Recovering a live AHU must not reset its equipment schema."""
    boot, data_root, _, _ = load_boot(tmp_path)
    (data_root / 'configs').mkdir()
    (data_root / 'configs' / 'equipment_types.json').write_text('{"mine": 1}')
    app, _state = boot.bootstrap_app('missing', 'detail')
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w') as zf:
        zf.writestr('app_main.py', 'pass\n')
        zf.writestr('configs/equipment_types.json', '{"factory": 1}')
        zf.writestr('configs/map_config.json', '{"factory": 1}')

    app.test_client().post(
        '/api/bootstrap-upload',
        data={'bundle': (io.BytesIO(buf.getvalue()), 'b.zip')},
        content_type='multipart/form-data',
    )

    # Present on disk -> preserved.  Absent -> the bundled default lands.
    assert json.loads(
        (data_root / 'configs' / 'equipment_types.json').read_text()) == {'mine': 1}
    assert json.loads(
        (data_root / 'configs' / 'map_config.json').read_text()) == {'factory': 1}


@pytest.mark.parametrize('magic', [b'RED5ENC1', b'RED5ENC2'])
def test_encrypted_bundle_is_refused_with_a_reason(tmp_path, magic):
    boot, _, _, _ = load_boot(tmp_path)
    app, _state = boot.bootstrap_app('missing', 'detail')

    resp = app.test_client().post(
        '/api/bootstrap-upload',
        data={'bundle': (io.BytesIO(magic + b'\x00' * 300), 'bundle.red5')},
        content_type='multipart/form-data',
    )

    assert resp.status_code == 400
    assert 'plain' in resp.get_json()['error']


# ---------------------------------------------------------------------
# Boot path 3 -- app_main.py present but broken: keep the port alive.
# ---------------------------------------------------------------------

def test_broken_bootloader_falls_back_to_bootstrap(tmp_path):
    boot, data_root, _, _ = load_boot(tmp_path)
    write_bootloader(data_root, 'raise RuntimeError("half-staged bootloader")\n')
    seen = {}

    boot.serve_bootstrap = lambda reason, detail: seen.update(
        reason=reason, detail=detail) or None
    boot.main()

    assert seen['reason'] == 'app_main.py failed to run'
    assert 'half-staged bootloader' in seen['detail']


def test_truncated_bootloader_falls_back(tmp_path):
    """What a short urlretrieve or a NO_SPACE save actually leaves behind."""
    boot, data_root, _, _ = load_boot(tmp_path)
    write_bootloader(data_root, 'def half_a_function(:\n')
    seen = {}

    boot.serve_bootstrap = lambda reason, detail: seen.update(
        reason=reason, detail=detail) or None
    boot.main()

    assert 'SyntaxError' in seen['detail']


def test_promotion_execs_the_bundle_it_just_installed(tmp_path):
    """The whole point: one paste, one upload, no enteliWEB Stop/Start."""
    boot, data_root, _, _ = load_boot(tmp_path)
    marker = tmp_path / 'promoted.txt'
    calls = []

    def fake_serve(reason, detail):
        calls.append(reason)
        return str(write_bootloader(data_root, marker_source(marker, 'promoted')))

    boot.serve_bootstrap = fake_serve
    boot.main()

    assert calls == ['app_main.py is not on disk yet']
    assert marker.read_text() == 'promoted'


def test_port_already_in_use_exits_instead_of_spinning(tmp_path):
    boot, _, _, _ = load_boot(tmp_path)

    def fake_serve(reason, detail):
        raise OSError(48, 'Address already in use')

    boot.serve_bootstrap = fake_serve
    boot.main()   # must return, not raise, not loop


# ---------------------------------------------------------------------
# The handoff, over a real socket.
# ---------------------------------------------------------------------

def free_port() -> int:
    with socket.socket() as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]


def post_bundle(port: int, blob: bytes) -> dict:
    boundary = 'b0undary'
    body = (
        ('--{0}\r\nContent-Disposition: form-data; name="bundle"; '
         'filename="bundle.zip"\r\nContent-Type: application/zip\r\n\r\n'
         ).format(boundary).encode() + blob
        + '\r\n--{0}--\r\n'.format(boundary).encode()
    )
    req = urllib.request.Request(
        'http://127.0.0.1:{0}/api/bootstrap-upload'.format(port), data=body,
        headers={'Content-Type': 'multipart/form-data; boundary=' + boundary})
    return json.loads(urllib.request.urlopen(req, timeout=10).read().decode())


def wait_for(fn, timeout=10.0):
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            got = fn()
            if got:
                return got
        except (urllib.error.URLError, OSError):
            pass
        time.sleep(0.1)
    return None


def test_upload_over_a_real_socket_promotes_to_the_full_stack(tmp_path):
    port = free_port()
    boot, data_root, _, _ = load_boot(tmp_path, port=port)
    marker = tmp_path / 'stack_started.txt'
    # Stand-in for the real bootloader: prove it ran, then hold the port the
    # way app.run() would, so a premature release would show up as a failure.
    body = (
        'with open({0!r}, "w") as fh:\n    fh.write("stack up")\n'
        'import socket, time\n'
        's = socket.socket()\n'
        's.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)\n'
        's.bind(("127.0.0.1", {1}))\n'
        's.listen(1)\n'
        'time.sleep(2)\n'
        's.close()\n'
    ).format(str(marker), port)
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w') as zf:
        zf.writestr('app_main.py', body)
        zf.writestr('dashboard.html', '<html></html>')

    thread = threading.Thread(target=boot.main, daemon=True)
    thread.start()
    try:
        health = wait_for(lambda: json.loads(urllib.request.urlopen(
            'http://127.0.0.1:{0}/api/health'.format(port), timeout=2).read()))
        assert health is not None, 'bootstrap server never came up'
        assert health['mode'] == 'bootstrap'

        assert post_bundle(port, buf.getvalue())['promoting'] is True

        assert wait_for(lambda: marker.exists()), 'bootloader was never exec-ed'
        assert (data_root / 'dashboard.html').exists()
    finally:
        thread.join(timeout=8)
    assert not thread.is_alive(), 'boot thread did not exit'


# ---------------------------------------------------------------------
# The stripped paste copy the bundle generates.
# ---------------------------------------------------------------------

def test_stripped_paste_copy_is_the_same_program(tmp_path):
    spec = importlib.util.spec_from_file_location(
        'ahu_build_bundle', V19 / 'build_bundle.py')
    build = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(build)
    stripped = build.paste_copy('app_boot.py').decode()
    assert len(stripped) < BOOT_PY.stat().st_size, 'stripping saved nothing'

    copy = tmp_path / 'app_boot_min.py'
    copy.write_text(stripped)
    original, data_root, _, _ = load_boot(tmp_path / 'orig')
    os.environ['RED5_DATA_ROOT'] = str(data_root)
    spec = importlib.util.spec_from_file_location('ahu_app_boot_min', copy)
    minified = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(minified)

    for entry in ('app_main.py', 'app.py', 'dashboard.html', 'loose.json',
                  'repair_manifest.json', 'tests/test_x.py', 'js/x.js',
                  'red5_auth/users.json', 'red5_auth/evil.json',
                  'scripts/thing.py', '__MACOSX/x'):
        assert minified.zip_dest(entry) == original.zip_dest(entry), entry
    assert 'BOOTSTRAP MODE' in minified.page('why', 'detail')

    marker = tmp_path / 'min_ran.txt'
    write_bootloader(data_root, marker_source(marker, 'ok'))
    minified.main()
    assert marker.read_text() == 'ok'


# ---------------------------------------------------------------------
# The three extractors have to agree, or a bundle deploys differently
# depending on which of them received it.  app_canonical_c2.py is the file
# the bundle installs as pgpy/app_main.py.
# ---------------------------------------------------------------------

EXTRACTORS = ('app_boot.py', 'app_canonical_c2.py', 'upload_service.py')


def hidden_member_body(path: Path) -> str | None:
    """Source of the file's is_hidden_member(), docstring excluded."""
    for node in ast.walk(ast.parse(path.read_text())):
        if (isinstance(node, ast.FunctionDef)
                and node.name.lstrip('_') == 'is_hidden_member'):
            body = [n for n in node.body
                    if not (isinstance(n, ast.Expr)
                            and isinstance(n.value, ast.Constant))]
            return ast.unparse(body)
    return None


def runtime_strings(path: Path) -> set:
    """Every string literal the module evaluates, docstrings excluded."""
    tree = ast.parse(path.read_text())
    docstrings = set()
    for node in ast.walk(tree):
        if isinstance(node, (ast.Module, ast.FunctionDef, ast.AsyncFunctionDef,
                             ast.ClassDef)) and node.body:
            first = node.body[0]
            if isinstance(first, ast.Expr) and isinstance(first.value, ast.Constant):
                docstrings.add(id(first.value))
    return {n.value for n in ast.walk(tree)
            if isinstance(n, ast.Constant) and isinstance(n.value, str)
            and id(n) not in docstrings}


@pytest.mark.parametrize('name', EXTRACTORS)
def test_no_extractor_matches_on_the_macos_folder_name(name):
    """__MACOSX was never the thing to look for.  The sidecars inside it keep
    the original suffix, so ._dashboard.html passed the extension allow-list
    and ._x_service.py matched the plug-in glob; meanwhile js/.eslintrc.json
    got through because the path did not *start* with a dot.  A dot-leading
    component covers all of it without naming somebody's zip tool."""
    assert '__MACOSX' not in runtime_strings(V19 / name)


def test_hidden_member_rule_is_identical_in_every_extractor():
    bodies = {name: hidden_member_body(V19 / name) for name in EXTRACTORS}
    missing = [n for n, b in bodies.items() if b is None]
    assert not missing, 'is_hidden_member() missing from {0}'.format(missing)
    assert len(set(bodies.values())) == 1, bodies


# ---------------------------------------------------------------------
# The property the controller enforces silently.
# ---------------------------------------------------------------------

def test_paste_stays_small():
    """A PG object save that exceeds the program-text limit fails with
    QERR_CLASS_OS::QERR_CODE_NO_SPACE, or worse, keeps only the first part of
    the script -- which looks like a successful save until runtime.  The
    ceiling is not documented; ~90 KB always fails.  Hold the line well under
    it and ship the stripped copy for controllers that still refuse."""
    assert BOOT_PY.stat().st_size < 16 * 1024
