"""Sidebar popout slider regression test.

Regression history (2026-06-08):
  - The RH (sweet-spot) and Axis (temperature range) sliders in the
    dashboard left sidebar stopped responding to mouse drag when the
    sidebar was popped out to its own browser window.  Root cause: the
    slider's mousedown handler attached `mousemove`/`mouseup` listeners
    to `window` -- which in the closure was the PARENT window.  The
    slider DOM lived in the popout's document, so events fired there
    never reached the parent-attached listeners.
  - Same pattern would bite ANY future slider added inside the sidebar.

Invariant this test enforces:
  Every slider's startDrag handler in dashboard.html uses an `ownerWin`
  (derived from `e.view` or `e.target.ownerDocument.defaultView`) when
  attaching mousemove/mouseup -- never a bare `window.addEventListener`
  inside a startDrag closure that sits inside the sidebar.
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
V19  = os.path.dirname(HERE)
DASH = os.path.join(V19, 'dashboard.html')


def _slider_dragstarts():
    """Find every `const startDrag = (e, handle) => {...}` block."""
    src = open(DASH).read()
    # Match the startDrag function body
    pattern = re.compile(
        r'const\s+startDrag\s*=\s*\(\s*e\s*,\s*handle\s*\)\s*=>\s*\{'
        r'([\s\S]*?)\n\s{32}\}\s*;',  # body until matching closing
        re.MULTILINE,
    )
    return [m.group(1) for m in pattern.finditer(src)]


def test_slider_drag_handlers_use_owner_window():
    bodies = _slider_dragstarts()
    assert len(bodies) >= 2, (
        f'Expected at least 2 slider startDrag handlers in dashboard.html '
        f'(RH range + axis range), found {len(bodies)}.  If sliders were '
        f'restructured, update this test.'
    )
    bad = []
    for i, body in enumerate(bodies):
        # Each handler MUST derive an ownerWin
        if 'ownerWin' not in body:
            bad.append(f'slider #{i+1}: no ownerWin derived')
            continue
        # And MUST NOT attach mousemove/mouseup directly to bare `window`
        # (must use ownerWin instead)
        bare_attaches = re.findall(
            r'\bwindow\.addEventListener\(\s*[\'"]mouse(?:move|up)',
            body,
        )
        if bare_attaches:
            bad.append(
                f'slider #{i+1}: attaches mouse listeners to bare `window` '
                f'({len(bare_attaches)} occurrence(s)).  Popout fix '
                f'requires ownerWin.addEventListener.'
            )
    assert not bad, (
        'Slider drag-handler popout fix regressed.  Sliders inside the '
        'sidebar must attach to the slider\'s own window so events fire '
        'when the sidebar is popped to a separate browser window.\n  ' +
        '\n  '.join(bad)
    )
