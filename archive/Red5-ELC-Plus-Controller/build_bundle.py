"""build_bundle.py — assemble red5_elc_plus_bundle.zip for controller deploy."""
from __future__ import annotations

import os
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'red5_elc_plus_bundle.zip')

ROOT_FILES = [
    'app.py',
    'collector.py',
    'upload_service.py',
    'elc_service.py',
    'pages_service.py',
    'update.html',
    'floor.html',
    'editor.html',
    'settings.html',
    'index.html',
    'stress.html',
    'repair_manifest.json',
]

OPTIONAL_ROOT_FILES = ['master_key.txt']

SUBDIR_TREES = ['js', 'img', 'configs', 'docs', 'graphics', 'pgpy']

SKIP_PATTERNS = (
    '__pycache__',
    '.pyc',
    'tests/',
    'test_',
    'conftest.py',
    '_mock_scu_source.py',
)


def should_skip(rel_path: str) -> bool:
    return any(pat in rel_path for pat in SKIP_PATTERNS)


def main() -> None:
    if os.path.exists(OUT):
        os.unlink(OUT)
    added, missing = [], []
    with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        for name in ROOT_FILES:
            src = os.path.join(HERE, name)
            if not os.path.isfile(src):
                missing.append(name)
                continue
            zf.write(src, arcname=name)
            added.append(name)
        for name in OPTIONAL_ROOT_FILES:
            src = os.path.join(HERE, name)
            if os.path.isfile(src):
                zf.write(src, arcname=name)
                added.append(name)
        for sub in SUBDIR_TREES:
            base = os.path.join(HERE, sub)
            if not os.path.isdir(base):
                missing.append(sub + '/')
                continue
            for root, dirs, files in os.walk(base):
                dirs[:] = [d for d in dirs if d not in ('__pycache__', '.git')]
                for fn in files:
                    full = os.path.join(root, fn)
                    rel = os.path.relpath(full, HERE).replace(os.sep, '/')
                    if should_skip(rel):
                        continue
                    zf.write(full, arcname=rel)
                    added.append(rel)
    print(f'Wrote {OUT} ({len(added)} files)')
    if missing:
        print('Missing (non-fatal):', ', '.join(missing))


if __name__ == '__main__':
    main()
