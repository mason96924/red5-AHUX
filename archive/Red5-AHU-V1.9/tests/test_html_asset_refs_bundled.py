"""Asset reference invariant.

Regression history (2026-05-19 → 2026-06-08):
  - A previous session introduced `js/toast.js` and converted
    `alert(...)` calls in equipment_mapper.html to `toast(...)`.
    `toast.js` was created in frontend/public/js/ but NEVER synced to
    the V1.9 archive AND NEVER referenced in build_bundle.py.  The
    bundle shipped without it for 10 days.  Result: when the mapper
    loaded on a controller, `<script src="js/toast.js">` 404'd
    silently, `window.toast` was undefined, and the upload-completion
    notification (and many other toasts) silently no-op'd while the
    underlying actions still succeeded.

This test catches the WHOLE CLASS of "HTML/JS references an asset
that isn't bundled" bugs, not just the toast.js case.

Invariant:
  Every `<script src="...">` and `<link href="...">` (with relative
  paths) in any user-facing HTML must point at a file that:
    1. Exists in the V1.9 archive at the corresponding path, AND
    2. Ends up in the generated red5_bundle.zip.
"""
import os
import re
import subprocess
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
V19  = os.path.dirname(HERE)

# HTML files that ship to the controller and are loaded by browsers.
USER_HTML = [
    'dashboard.html',
    'equipment_mapper.html',
    'landing.html',
    'access.html',
    'setup.html',
    'ahu.html',
    'sun_preview.html',
]

# Regexes for asset references with RELATIVE paths.
# Absolute URLs (http://, /api/, etc.) are out of scope.
SCRIPT_SRC = re.compile(r'<script\s+[^>]*src=["\']([^"\']+)["\']', re.IGNORECASE)
LINK_HREF  = re.compile(r'<link\s+[^>]*href=["\']([^"\']+)["\']', re.IGNORECASE)


def _collect_asset_refs():
    """Return list of (html_file, asset_path) tuples for every relative
    script/link reference in user-facing HTML."""
    refs = []
    for html in USER_HTML:
        path = os.path.join(V19, html)
        if not os.path.exists(path):
            continue
        src = open(path).read()
        for rx in (SCRIPT_SRC, LINK_HREF):
            for m in rx.finditer(src):
                asset = m.group(1).strip()
                # Skip absolute URLs and data URIs
                if asset.startswith(('http://', 'https://', '//', 'data:')):
                    continue
                # Skip API endpoints and Babel/React CDN-served files that
                # happen to start with '/'.  We only check repo-relative.
                if asset.startswith('/api/') or asset.startswith('/static/'):
                    continue
                # Strip leading slash and query string
                clean = asset.lstrip('/').split('?', 1)[0].split('#', 1)[0]
                refs.append((html, clean))
    return refs


def test_html_asset_refs_exist_in_archive():
    """Every <script src="..."> / <link href="..."> must point to a real
    file in the V1.9 archive."""
    missing = []
    for html, asset in _collect_asset_refs():
        candidate = os.path.join(V19, asset)
        if not os.path.exists(candidate):
            missing.append(f'{html} -> {asset}')
    assert not missing, (
        'HTML files reference asset files that are MISSING from the V1.9 '
        'archive.  This is exactly the bug class that left toast.js '
        'unbundled for 10 days while the upload-success toast silently '
        'disappeared.  Either add the file to the archive or remove the '
        'reference from the HTML:\n  ' + '\n  '.join(missing)
    )


def test_html_asset_refs_end_up_in_bundle():
    """Build the bundle and verify every referenced asset is actually
    inside the zip."""
    # Rebuild so we test the current state, not a stale zip
    result = subprocess.run(
        ['python3', 'build_bundle.py'],
        cwd=V19, capture_output=True, text=True,
    )
    assert result.returncode == 0, f'build_bundle.py failed:\n{result.stderr}'

    zip_path = os.path.join(V19, 'red5_bundle.zip')
    with zipfile.ZipFile(zip_path) as zf:
        bundled = set(zf.namelist())

    not_bundled = []
    for html, asset in _collect_asset_refs():
        # Asset in repo at V19/<asset>, in zip at <asset> (no V19/ prefix)
        if asset not in bundled:
            # Some assets might be deployed to /root/data/ directly; check
            # alternative locations the controller's serve_asset would try.
            alt_paths = [asset, asset.lstrip('/'), os.path.basename(asset)]
            if not any(p in bundled for p in alt_paths):
                not_bundled.append(f'{html} -> {asset}')
    assert not not_bundled, (
        'HTML files reference asset files that are NOT in the bundle.  '
        'Add the file to build_bundle.py ROOT_FILES (or the appropriate '
        'SUBDIR_TREE) so it ships:\n  ' + '\n  '.join(not_bundled)
    )
