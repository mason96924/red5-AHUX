"""Upload endpoints must auto-create parent directories.

Regression history:
  - /api/upload-file at one point had a strict guard:
      if not os.path.isdir(parent):
          return jsonify({'success': False, 'error': 'Directory does not
                          exist: ...'}), 400
    This broke the workflow where the operator wipes /root/data/graphics/
    and re-uploads from scratch via the file-browser Asset button.
  - /api/save-image always did the right thing (os.makedirs ... exist_ok).
  - The two endpoints must behave consistently.

Invariant:
  Both upload-file and save-image must contain `os.makedirs(parent,
  exist_ok=True)` (or equivalent) before writing the file, and must NOT
  reject the request when the parent directory is missing.
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
V19  = os.path.dirname(HERE)
APP  = os.path.join(V19, 'app.py')


def _extract_route(src, route):
    """Return the source block of the Flask view function for `route`."""
    pat = (
        r"@app\.route\(['\"]" + re.escape(route) + r"['\"][^\n]*\)"
        r"[\s\S]*?def\s+\w+\([^)]*\):(?P<body>[\s\S]*?)\n(?=@app\.route|\nclass\s|\ndef\s|\Z)"
    )
    m = re.search(pat, src)
    assert m, f'Could not locate route {route} in app.py'
    return m.group('body')


def test_upload_file_auto_creates_parent():
    src = open(APP).read()
    body = _extract_route(src, '/api/upload-file')
    assert 'makedirs' in body and 'exist_ok=True' in body, (
        '/api/upload-file must call os.makedirs(..., exist_ok=True) on the '
        'parent dir.  Regression: an earlier version returned 400 with '
        '"Directory does not exist" instead.'
    )
    # Belt-and-braces: must NOT have the regression check that rejects
    # missing directories.
    assert 'Directory does not exist' not in body, (
        '/api/upload-file regressed: contains the "Directory does not exist" '
        'rejection that prevents re-uploading after a tree wipe.'
    )


def test_save_image_auto_creates_parent():
    src = open(APP).read()
    body = _extract_route(src, '/api/save-image')
    assert 'makedirs' in body and 'exist_ok=True' in body, (
        '/api/save-image must call os.makedirs(..., exist_ok=True) on the '
        'parent dir.'
    )


def test_save_floor_plan_auto_creates_parent():
    src = open(APP).read()
    body = _extract_route(src, '/api/save-floor-plan')
    assert 'makedirs' in body and 'exist_ok=True' in body, (
        '/api/save-floor-plan must call os.makedirs(..., exist_ok=True).'
    )
