"""Sanitize collector.py for the enteliWEB editor:
  Step 1: ASCII-ify (replace em-dash, arrow, multiplication-x, etc.)
  Step 2: If still > 32 KB, drop multi-line comment blocks that explain
          history/rationale.  NEVER touch docstrings or executable code.
"""
import re, os, py_compile

PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'collector.py'))

with open(PATH, encoding='utf-8') as f:
    src = f.read()
orig = len(src)

# --- Step 1: ASCII-ify ---
ASCII_MAP = {
    '\u2014': '--',   # em-dash
    '\u2013': '-',    # en-dash
    '\u2192': '->',   # right arrow
    '\u00d7': 'x',    # multiplication
    '\u00a0': ' ',    # nbsp
    '\u2018': "'", '\u2019': "'",
    '\u201c': '"', '\u201d': '"',
    '\u00b0': 'deg',
    '\u2026': '...',
}
for k, v in ASCII_MAP.items():
    src = src.replace(k, v)

ascii_size = len(src)
remaining = sum(1 for c in src if ord(c) > 127)
print('After ASCII:', ascii_size, 'bytes,', remaining, 'non-ASCII chars left')
assert remaining == 0, 'unmapped non-ASCII chars remain'

# --- Step 2: trim if still over 32 KB ---
# Drop comment LINES whose stripped text starts with these prefixes.  These
# are the rationale narratives that explain WHY a thing exists -- valuable
# in git history but optional in the deployed file.  We KEEP all docstrings
# (triple-quoted), all executable code, and load-bearing single-line
# annotations like '# ===== Section ====='.
DROP_PREFIXES = (
    'NOTE on BACnet writes',
    'This module no longer imports',
    'native BACnet binding',
    'an enteliWEB',
    '`dibt` is preloaded',
    'auto-loaded into Flask',
    'non-ImportError',
    'module to silently 404',
    'Instead, /api/write-point',
    'queue file (`',
    'immediately. `collector.py`',
    'have dibt available',
    'executes the writes via',
    '`write_results.json`',
    'Cache of active-band-id',
    'Different Delta Controls',
    '- Some inject',
    'read/write outcomes',
    '- Newer firmware injects',
    '`dibt` global which does',
    'Calls like `isinstance',
    'AttributeError, the surrounding',
    '"Exception writing CSV1',
    'has no attribute',
    'dibt.Read/Write call',
    'This helper resolves the correct',
    "script doesn't",
    '/api/write-point in',
    'which does NOT have dibt',
    'import the controller',
    'Flask side appends each write',
    '(which IS an enteliWEB',
    'on every poll cycle.',
    'Added 2026-05-08',
    '(On dev hosts',
    '---- dibt is preloaded',
    'in mock_mode (or when dibt',
    'mock_mode, record a',
    "'mock' result without",
    'Idempotent against concurrent',
    'queue file is replaced',
    'are removed before we release',
    'Safe to call every cycle',
)

def maybe_drop(line):
    s = line.lstrip()
    if not s.startswith('#'):
        return False
    body = s[1:].lstrip()
    return any(body.startswith(p) for p in DROP_PREFIXES)

if len(src) > 32000:
    new_lines = [ln for ln in src.split('\n') if not maybe_drop(ln)]
    new = '\n'.join(new_lines)
    new = re.sub(r'\n{3,}', '\n\n', new)
    print('After comment trim:', len(new), 'bytes')
    src = new

with open(PATH, 'w', encoding='ascii') as f:
    f.write(src)

py_compile.compile(PATH, doraise=True)
print('Syntax check: PASS')

assert 'def _dibt_is_error(' in src
assert src.count('_dibt_is_error(') >= 5
assert "VERSION = '1.2'" in src
print('Compat shim + v1.2 marker + 4 call sites: PRESENT')

# Final size summary
final = os.path.getsize(PATH)
print('FINAL: %d bytes (%.1f KB)' % (final, final/1024))
print('Diff from original: %+d bytes' % (final - orig))
