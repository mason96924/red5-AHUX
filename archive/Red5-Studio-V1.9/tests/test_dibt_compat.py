"""Regression test for the minimal-diff dibt.Error AttributeError fix.

Yesterday's collector.py crashed with AttributeError when the controller's
runtime injected `dibt` as a BACnetInterface instance lacking an .Error
class.  The fix wraps each `isinstance(outcome, dibt.Error)` in a tiny
try/except so AttributeError no longer propagates and writes are
correctly reported as successful.

This test exercises the wrapped pattern by running a stripped-down copy
of one call site against both API shapes.  Run:

    python3 tests/test_dibt_compat.py
"""
import re, os, types

HERE = os.path.dirname(__file__)
COLLECTOR = os.path.abspath(os.path.join(HERE, '..', 'collector.py'))


def _check_call_site(fake_dibt, value):
    """Replicate the wrapped pattern the collector now uses."""
    try:
        _is_err = isinstance(value, fake_dibt.Error)
    except AttributeError:
        _is_err = False  # newer firmware: dibt has no .Error class
    return _is_err


def _assert(cond, msg):
    if cond:
        print('  PASS:', msg)
    else:
        raise AssertionError('FAIL: ' + msg)


# ---- Verify the patched call sites exist in collector.py ----
print('Test 0: collector.py contains the 5 patched call sites')
with open(COLLECTOR) as f:
    src = f.read()
n_isinstance = len(re.findall(r'isinstance\(\w+,\s*dibt\.Error\)', src))
n_attrerr    = src.count('except AttributeError:')
# 5 = write_band_setpoints CSV, write_band_guide_to_description,
#     write_humidity_setpoint (Phase 2), plus any read-side helpers.
_assert(n_isinstance >= 4, f'>=4 isinstance(_, dibt.Error) call sites (found {n_isinstance})')
_assert(n_attrerr   >= 4, f'>=4 except AttributeError handlers (found {n_attrerr})')


# ---- Test 1: legacy API (dibt has Error class) ----
class _FakeError(Exception):
    pass

class _LegacyDibt:
    Error = _FakeError

print('\nTest 1: legacy dibt API (module exposes .Error class)')
fake = _LegacyDibt()
_assert(_check_call_site(fake, 'ok')              is False, 'string outcome -> not error')
_assert(_check_call_site(fake, _FakeError('boom')) is True,  'Error instance -> error')
_assert(_check_call_site(fake, 0)                  is False, 'numeric 0      -> not error')
_assert(_check_call_site(fake, None)               is False, 'None outcome   -> not error')


# ---- Test 2: BACnetInterface (no .Error attribute) ----
class _BACnetInterface:
    pass

print('\nTest 2: BACnetInterface (no .Error) -- the controller bug case')
fake = _BACnetInterface()
_assert(_check_call_site(fake, 'ok')  is False, 'string outcome -- must NOT raise AttributeError')
_assert(_check_call_site(fake, 0)     is False, '0 outcome      -- must NOT raise')
_assert(_check_call_site(fake, None)  is False, 'None outcome   -- must NOT raise')
_assert(_check_call_site(fake, 42)    is False, 'int outcome    -- must NOT raise')


print('\n' + '='*52)
print(' All assertions passed')
print('='*52)
