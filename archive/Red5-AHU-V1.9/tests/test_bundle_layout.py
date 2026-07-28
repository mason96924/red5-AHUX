"""Bundle layout regression test.

Regression history:
  - commit 60fc9f1 re-introduced all .md guides into ROOT_FILES, causing
    the controller extractor to unpack them flat in /root/data/<file>.md
    instead of /root/data/docs/<file>.md.
  - serve_asset() in app.py falls back to /root/data/docs/, so the
    intended layout is docs/-only.  Flat .md files at root are dead.

Invariants this test enforces:
  1. build_bundle.py ROOT_FILES contains zero entries ending in .md
  2. The generated red5_bundle.zip has zero .md files at the root level
  3. Every .md file in the zip lives under docs/
"""
import os
import re
import subprocess
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
V19  = os.path.dirname(HERE)


def test_root_files_has_no_markdown():
    """build_bundle.py ROOT_FILES must not contain any .md entries."""
    bb = os.path.join(V19, 'build_bundle.py')
    src = open(bb).read()
    # Extract everything between `ROOT_FILES = [` and the closing `]`
    m = re.search(r'ROOT_FILES\s*=\s*\[(.*?)\n\]', src, re.DOTALL)
    assert m, 'Could not locate ROOT_FILES literal in build_bundle.py'
    block = m.group(1)
    md_entries = re.findall(r"['\"]([^'\"]+\.md)['\"]", block)
    assert md_entries == [], (
        f'build_bundle.py ROOT_FILES must not list any .md files (they '
        f'belong under docs/). Found: {md_entries}'
    )


def test_bundle_zip_layout():
    """Build the bundle and verify every .md lives under docs/."""
    # Build fresh
    result = subprocess.run(
        ['python3', 'build_bundle.py'],
        cwd=V19, capture_output=True, text=True,
    )
    assert result.returncode == 0, f'build_bundle.py failed:\n{result.stdout}\n{result.stderr}'

    zip_path = os.path.join(V19, 'red5_bundle.zip')
    assert os.path.exists(zip_path), 'red5_bundle.zip was not produced'

    with zipfile.ZipFile(zip_path) as zf:
        names = zf.namelist()

    md_at_root = [n for n in names if n.endswith('.md') and '/' not in n]
    assert md_at_root == [], (
        f'Found .md files at zip root (will unpack flat to /root/data/): '
        f'{md_at_root}'
    )

    md_files = [n for n in names if n.endswith('.md')]
    assert len(md_files) > 0, 'Expected at least one .md file in docs/'
    for n in md_files:
        assert n.startswith('docs/'), f'.md file outside docs/: {n}'
