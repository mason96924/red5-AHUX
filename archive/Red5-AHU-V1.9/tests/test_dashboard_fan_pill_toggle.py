"""Regression: dashboard centrifugal-fan pill toggle must reflect write target.

Bug (2026-06-12)
----------------
The M|R toggle pill above a centrifugal_fan animation in dashboard.html
WROTE to the manual-mode point (SAFM by default) but its toggle-switch
visual was bound to ``fanOn = isRunning && !isAlarm`` -- which is
derived from the supply-air-fan PRESSURE feedback (SAFP), not the
manual flag.  Result for the operator: clicking the pill flipped the
SA-panel SAFM toggle (proving the write fired) but the pill itself
showed zero visual change, and the spinning-fan animation also did
not respond.  Indistinguishable from a dead control.

Fix
---
Toggle-switch position now reads the write target's own value
(``ap[writeTarget]``), mirroring the bool-point renderer at
``renderValueControl()``.  The R/S badge stays bound to ``fanOn`` --
those are two distinct pieces of info ("manual mode engaged" vs
"fan is actually spinning") and merging them was the original
confusion.

Guards
------
1. All three dashboard.html parity copies (V1.9, V2.0, frontend/public)
   contain the ``manualOn`` binding and use it in the toggle classes.
2. The toggle is no longer driven by ``fanOn`` -- if a future agent
   re-binds it, this test fails immediately.
3. ``data-testid="ahu-fan-pill"`` survives, so the existing UI tests
   keep finding the element.
"""
from __future__ import annotations

import re
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parents[1]
PARITY_COPIES = [
    REPO / "dashboard.html",
    REPO.parents[0] / "Red5-AHU-V2.0" / "dashboard.html",
    REPO.parents[1] / "frontend" / "public" / "dashboard.html",
]


def _pill_block(src: str) -> str:
    """Extract the centrifugal-fan pill IIFE for targeted assertions.

    The block is bounded by the ``hasFanPill`` guard and the
    immediately following close of the React fragment.  Pulling it out
    keeps the matchers below from being fooled by unrelated ``fanOn``
    or ``manualOn`` references elsewhere in the 5k-line page.
    """
    start = src.index("{hasFanPill && (() => {")
    end_marker = "})()}"
    end = src.index(end_marker, start) + len(end_marker)
    return src[start:end]


@pytest.mark.parametrize("path", PARITY_COPIES, ids=lambda p: p.parts[-3])
def test_pill_toggle_reads_write_target(path: Path) -> None:
    assert path.exists(), f"missing parity copy: {path}"
    src = path.read_text(encoding="utf-8")
    block = _pill_block(src)

    # 1) manualOn is computed from ap[writeTarget].
    assert "var rawWrite = ap[writeTarget];" in block, (
        f"{path}: pill no longer reads ap[writeTarget] -- toggle visual "
        "cannot reflect the manual flag anymore."
    )
    assert "var manualOn = rawWrite === 1 || rawWrite === true || rawWrite === '1';" in block, (
        f"{path}: manualOn boolean coercion missing/changed -- check "
        "regression for the 2026-06-12 fix."
    )

    # 2) Toggle-switch classes are driven by manualOn (NOT fanOn).
    #    Pattern: `${manualOn ? 'bg-emerald-500' : ...}` and translate-x.
    toggle_bind_count = len(re.findall(r"\bmanualOn\s*\?\s*'bg-emerald-500'", block))
    assert toggle_bind_count >= 1, (
        f"{path}: toggle-switch background not bound to manualOn -- "
        "the pill cannot show write-target state."
    )
    translate_bind_count = len(re.findall(r"\bmanualOn\s*\?\s*'translate-x-4'", block))
    assert translate_bind_count >= 1, (
        f"{path}: toggle-switch knob position not bound to manualOn."
    )

    # 3) R/S badge stays bound to fanOn (separate concept; intentional).
    assert "fanOn ? 'R' : 'S'" in block, (
        f"{path}: R/S badge lost its fanOn binding -- it should still "
        "track actual fan-running state, only the toggle switch was "
        "supposed to change."
    )

    # 4) testid intact so e2e tests still find the element.
    assert 'data-testid="ahu-fan-pill"' in block, (
        f"{path}: ahu-fan-pill testid lost."
    )


@pytest.mark.parametrize("path", PARITY_COPIES, ids=lambda p: p.parts[-3])
def test_pill_toggle_no_longer_uses_fanon_for_switch(path: Path) -> None:
    """Hard guard: the toggle-switch bg colour MUST NOT key on fanOn.

    If a future agent merges the two concepts back together this test
    fires.  We check the specific class-pattern (``fanOn ?
    'bg-emerald-500'``) within the pill block only.
    """
    src = path.read_text(encoding="utf-8")
    block = _pill_block(src)
    bad = re.findall(r"\bfanOn\s*\?\s*'bg-emerald-500'", block)
    assert not bad, (
        f"{path}: toggle-switch bg is keyed on fanOn again -- this is "
        "exactly the 2026-06-12 regression.  Use manualOn instead."
    )


# ----------------------------------------------------------------------
# JSON-only behavioural check: simulate the JS expression in Python
# ----------------------------------------------------------------------

def _manual_on(ap: dict, key: str) -> bool:
    """Python mirror of the JS ``manualOn`` derivation."""
    raw = ap.get(key)
    return raw == 1 or raw is True or raw == "1"


@pytest.mark.parametrize(
    "ap,key,expected",
    [
        ({"SAFM": 1},     "SAFM", True),
        ({"SAFM": 0},     "SAFM", False),
        ({"SAFM": True},  "SAFM", True),
        ({"SAFM": False}, "SAFM", False),
        ({"SAFM": "1"},   "SAFM", True),
        ({"SAFM": "0"},   "SAFM", False),
        ({"SAFM": None},  "SAFM", False),
        ({},              "SAFM", False),
        # Custom write target via a.pill_write_target
        ({"HM": 1},       "HM",   True),
        ({"HM": 0},       "HM",   False),
    ],
)
def test_manual_on_truth_table(ap, key, expected) -> None:
    assert _manual_on(ap, key) is expected
