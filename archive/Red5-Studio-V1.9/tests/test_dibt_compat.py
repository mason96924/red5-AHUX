"""Regression test for the dibt API compat shim in collector.py.

The original `isinstance(outcome, dibt.Error)` check throws AttributeError
when the controller's runtime injects `dibt` as a `BACnetInterface`
instance instead of the original module-with-Error-class.  This swallows
the real outcome of every dibt.Read/Write call and silently breaks
BACnet writes (write_results.json never gets populated).

We can't import collector.py wholesale because main() runs at import.
Instead we extract the _dibt_is_error helper source and exec it inside
a controlled namespace.

Run:  python3 tests/test_dibt_compat.py
"""
import os
import re

HERE = os.path.dirname(__file__)
COLLECTOR_PATH = os.path.abspath(os.path.join(HERE, '..', 'collector.py'))


def _load_helper(fake_dibt):
    """Extract _dibt_is_error from collector.py and exec it bound to ``fake_dibt``.

    The helper is module-scope so we slice it out via regex and run it
    in an isolated namespace where `dibt` resolves to the fake object.
    """
    with open(COLLECTOR_PATH, 'r') as f:
        src = f.read()
    m = re.search(
        r'^def _dibt_is_error\(.*?\n(?=^(?:def |#\s*=====))',
        src, re.MULTILINE | re.DOTALL)
    if not m:
        raise RuntimeError('Could not locate _dibt_is_error in collector.py')
    ns = {'dibt': fake_dibt}
    exec(m.group(0), ns)
    return ns['_dibt_is_error']


def _assert(cond, msg):
    if cond:
        print('  PASS:', msg)
    else:
        raise AssertionError('FAIL: ' + msg)


# ---- Test 1: original API (dibt module exposes Error class) ----
class _FakeError(Exception):
    pass

class _LegacyDibt:
    Error = _FakeError
    def Read(self, r): return 'ok'
    def Write(self, r, **k): return 'ok'

print('Test 1: legacy dibt API (module with .Error class)')
fn = _load_helper(_LegacyDibt())
_assert(fn('ok') is False,                     'plain string outcome  -> not error')
_assert(fn(_FakeError('boom')) is True,        'Error instance        -> error')
_assert(fn(0) is False,                        'numeric 0 outcome     -> not error')
_assert(fn(None) is False,                     'None outcome          -> not error')


# ---- Test 2: BACnetInterface (no .Error attribute) ----
class _BACnetInterface:
    def Read(self, r): return 'ok'
    def Write(self, r, **k): return 'ok'

print('\nTest 2: BACnetInterface (no .Error attribute) - the controller bug case')
fn = _load_helper(_BACnetInterface())
_assert(fn('ok') is False,        'string outcome - must NOT raise AttributeError')
_assert(fn(0) is False,           '0 outcome      - must NOT raise')
_assert(fn(None) is False,        'None outcome   - must NOT raise')
_assert(fn(42) is False,          'int outcome    - must NOT raise')


# ---- Test 3: duck-typed error outcomes ----
print('\nTest 3: duck-typed error outcomes (.is_error / .isError() / .error)')
fn = _load_helper(_BACnetInterface())

class _OutcomeIsErrorTrue:
    is_error = True
class _OutcomeIsErrorFalse:
    is_error = False
class _OutcomeIsErrorMethod:
    def isError(self): return True
class _OutcomeErrorAttr:
    error = 'BACnet write rejected'
class _OutcomeNoError:
    error = None

_assert(fn(_OutcomeIsErrorTrue())   is True,  '.is_error=True   -> error')
_assert(fn(_OutcomeIsErrorFalse())  is False, '.is_error=False  -> not error')
_assert(fn(_OutcomeIsErrorMethod()) is True,  '.isError()=True  -> error')
_assert(fn(_OutcomeErrorAttr())     is True,  '.error=truthy    -> error')
_assert(fn(_OutcomeNoError())       is False, '.error=None      -> not error')


print('\n' + '='*52)
print(' All assertions passed - dibt compat shim ships safely')
print('='*52)
