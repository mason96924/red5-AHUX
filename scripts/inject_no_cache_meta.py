"""
inject_no_cache_meta.py
========================
Idempotently inject the no-cache <meta> block into every *.html file
under the three mirrors:

    /app/frontend/public/
    /app/archive/Red5-Studio-V2.0/
    /app/archive/Red5-Studio-V1.9/

Why: PROD users were seeing stale HTML after deploys because the
existing ?v=<hash> cache-busting only buckets compiled JS/CSS, not
the host HTML pages themselves.  Adding a no-cache meta tag inside
<head> forces browsers to re-fetch the HTML on every navigation.

Idempotent: skips files that already contain the sentinel
``data-cache-policy="no-cache"``.

Run:  python3 scripts/inject_no_cache_meta.py
Exit 0 = success, prints counts.
"""
from __future__ import annotations

import os
import re
import sys

ROOTS = [
    "/app/frontend/public",
    "/app/archive/Red5-Studio-V2.0",
    "/app/archive/Red5-Studio-V1.9",
]

SENTINEL = 'data-cache-policy="no-cache"'

# Inserted immediately after <head> (or after <head ...>) on its own indented line.
BLOCK = (
    '\n'
    '<!-- Cache-control: psy_3d.html and friends have no compiled bundle '
    'to ?v=-stamp, so the HTML itself must opt-out of browser caching. '
    'Without this, PROD users see stale UI after every deploy until '
    'they hard-refresh.  Sentinel data-cache-policy attribute is used '
    'by scripts/inject_no_cache_meta.py and deploy.sh preflight to '
    'detect missing tags.  Do NOT remove. -->\n'
    '<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" '
    f'{SENTINEL}>\n'
    '<meta http-equiv="Pragma" content="no-cache">\n'
    '<meta http-equiv="Expires" content="0">'
)

HEAD_OPEN_RE = re.compile(r'(<head\b[^>]*>)', re.IGNORECASE)


def patch_file(path: str) -> str:
    """Return one of 'patched', 'skipped-already-has-sentinel', 'skipped-no-head'."""
    with open(path, encoding="utf-8") as fh:
        src = fh.read()
    if SENTINEL in src:
        return "skipped-already-has-sentinel"
    m = HEAD_OPEN_RE.search(src)
    if not m:
        return "skipped-no-head"
    insert_at = m.end()
    new_src = src[:insert_at] + BLOCK + src[insert_at:]
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(new_src)
    return "patched"


def main() -> int:
    counts = {"patched": 0, "skipped-already-has-sentinel": 0, "skipped-no-head": 0}
    for root in ROOTS:
        if not os.path.isdir(root):
            print(f"  (skipping missing root: {root})")
            continue
        for entry in sorted(os.listdir(root)):
            if not entry.endswith(".html"):
                continue
            path = os.path.join(root, entry)
            if not os.path.isfile(path):
                continue
            status = patch_file(path)
            counts[status] += 1
            tag = {"patched": "+", "skipped-already-has-sentinel": "=",
                   "skipped-no-head": "?"}[status]
            print(f"  {tag} {path}")
    print()
    print(f"  patched: {counts['patched']}   "
          f"already-tagged: {counts['skipped-already-has-sentinel']}   "
          f"no-<head>: {counts['skipped-no-head']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
