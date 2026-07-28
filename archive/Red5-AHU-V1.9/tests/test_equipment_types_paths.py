"""equipment_types.json schema invariants.

Regression history:
  - VAV `base_graphic` values were stored as bare filenames ("vav_graphic.jpg")
    instead of full relative paths ("graphics/equipments/VAVs/vav_graphic.jpg").
    The dashboard requested /api/assets/vav_graphic.jpg, which 404'd because
    the file is actually at /root/data/graphics/equipments/VAVs/.
  - AHU `base_graphic` values were correct (full paths), so AHU images
    worked while VAV images broke -- an asymmetric regression that's
    easy to miss without an explicit test.

Invariant:
  Every non-null `visual_assets.base_graphic` in equipment_types.json
  contains a '/' (i.e., it's a relative PATH, not a bare filename).
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
V19  = os.path.dirname(HERE)
CONFIG = os.path.join(V19, 'configs', 'equipment_types.json')


def _iter_base_graphics():
    with open(CONFIG) as f:
        data = json.load(f)
    for category in ('ahu_types', 'vav_types', 'vfd_types',
                     'diff_pr_types', 'chiller_types', 'ct_types'):
        for tid, tdef in (data.get(category) or {}).items():
            va = (tdef or {}).get('visual_assets') or {}
            yield category, tid, va.get('base_graphic')


def test_base_graphics_are_paths_not_bare_filenames():
    bad = []
    for category, tid, bg in _iter_base_graphics():
        if not bg:
            continue  # null/empty is allowed (no graphic yet defined)
        if bg.startswith('data:image'):
            continue  # legacy inline base64 -- also allowed
        if '/' not in bg:
            bad.append(f'{category}.{tid}: {bg!r}')
    assert not bad, (
        'base_graphic must be a full relative path under graphics/, '
        'not a bare filename.  Regression: dashboard fetches '
        '/api/assets/<base_graphic> which 404s when the value is just '
        'a filename.  Bad entries:\n  ' + '\n  '.join(bad)
    )


def test_base_graphics_use_graphics_prefix_when_set():
    """Defence-in-depth: paths should start with 'graphics/' so they land
    under the controller's standard asset tree.  Allows legacy data: URIs
    and explicit null."""
    weird = []
    for category, tid, bg in _iter_base_graphics():
        if not bg or bg.startswith('data:image'):
            continue
        if not bg.startswith('graphics/'):
            weird.append(f'{category}.{tid}: {bg!r}')
    # Soft-fail with informative message -- this is a style guard, not
    # a correctness one.  Comment out the assert if a future schema
    # legitimately needs another root.
    assert not weird, (
        'base_graphic values are expected to start with "graphics/" so '
        "they land under the controller's standard asset tree.  "
        'Non-conforming entries:\n  ' + '\n  '.join(weird)
    )
