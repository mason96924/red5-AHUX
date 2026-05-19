"""Regression: /assets/<path>.json must serve with no-cache headers.

The equipment_mapper.html UI saves edits to equipment_types.json via
/api/save-equipment-schema (writes /root/data/configs/equipment_types.json).
On page reload, the mapper re-fetches that same file via /assets/configs/
equipment_types.json.  Before this fix, the Flask /assets/ route sent
Cache-Control: public, max-age=3600 for .json files (the catch-all branch
intended for static graphics).  Operators reported that their edits
appeared to disappear on reload because the browser served the pre-save
cache for up to an hour, even though the on-disk file was correctly
written by the API.

Guard:
  - .json now joins .js / .html / .css / .md in the no-store branch.
  - Static graphics (.png / .jpg / .svg ...) still cache aggressively.

Run from /app/archive/Red5-Studio-V1.9:
    python3 tests/test_assets_json_no_cache.py
"""
import os
import re
import sys

THIS_DIR = os.path.dirname(os.path.abspath(__file__))
APP_PY = os.path.join(THIS_DIR, '..', 'app.py')

with open(APP_PY, 'r') as f:
    src = f.read()

failures = []


def check(name, ok, info=''):
    if not ok:
        failures.append(name + ('  ' + info if info else ''))


# -----------------------------------------------------------------------
# The /assets/ route must explicitly include .json in the no-cache branch.
# -----------------------------------------------------------------------
m = re.search(
    r"def serve_asset\(filename\):[\s\S]{0,1200}"
    r"if lower\.endswith\('\.js'\)[^\n]*\.endswith\('\.json'\)",
    src,
)
check('serve_asset: .json appended to no-cache extension list', m is not None,
      'expected lower.endswith(.js)|..|.endswith(.json) in conditional')

# Reverse guard: there must NOT be a leftover branch that puts .json into
# the aggressive-cache `else` (e.g. via a separate elif chain).  The only
# Cache-Control: public ... line must remain inside the `else:` block.
public_cache = re.findall(r"Cache-Control['\"]\s*]?\s*=\s*['\"]public,\s*max-age=3600", src)
check('serve_asset: only ONE aggressive-cache branch remains', len(public_cache) == 1,
      'found %d public,max-age=3600 lines' % len(public_cache))

# -----------------------------------------------------------------------
# Sanity: the save endpoint still writes to /root/data/configs/.
# Catches accidental refactors that drop CONFIG_DIR or change the filename.
# -----------------------------------------------------------------------
m = re.search(
    r"def save_equipment_schema\([^)]*\):[\s\S]{0,800}"
    r"os\.path\.join\(CONFIG_DIR,\s*['\"]equipment_types\.json['\"]\)",
    src,
)
check('save_equipment_schema: writes CONFIG_DIR/equipment_types.json', m is not None)

# -----------------------------------------------------------------------
# Defense-in-depth check on the mapper: cache-buster on the load fetch.
# -----------------------------------------------------------------------
mapper_path = os.path.join(THIS_DIR, '..', 'equipment_mapper.html')
with open(mapper_path, 'r') as f:
    mapper = f.read()

check('mapper: cache-buster (?ts=Date.now()) attached to equipment_types.json fetches',
      re.search(r"/assets/configs/equipment_types\.json'\s*\+\s*bust", mapper) is not None
      and re.search(r"const bust\s*=\s*'\?ts='\s*\+\s*Date\.now\(\)", mapper) is not None)

# ---- Summary ----
total = 4
passed = total - len(failures)
print('assets .json no-cache regression: %d pass, %d fail.' % (passed, len(failures)))
if failures:
    print('FAILURES:')
    for f in failures:
        print('  - ' + f)
    sys.exit(1)
sys.exit(0)
