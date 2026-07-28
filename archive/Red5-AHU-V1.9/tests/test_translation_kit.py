"""Regression: translation kit must keep working.

Covers the two scripts in /app/docs/translation_kit/:
* make_skeleton.py  -- generates the per-language stub with FROZEN markers.
* install_translation.py -- validates + installs a finished translation.

If a future agent touches either script and breaks behaviour, these
tests fail.
"""
from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

import pytest

KIT = Path("/app/docs/translation_kit")
EN_DOC = Path("/app/archive/Red5-AHU-V1.9/docs/opt_sa_insight.md")


def _load(mod_name: str, file_name: str):
    """Import a kit script by path (kit isn't a package)."""
    spec = importlib.util.spec_from_file_location(mod_name, KIT / file_name)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[mod_name] = mod
    spec.loader.exec_module(mod)
    return mod


@pytest.fixture(scope="module")
def make_skel():
    return _load("kit_make_skeleton", "make_skeleton.py")


@pytest.fixture(scope="module")
def install():
    return _load("kit_install_translation", "install_translation.py")


# ---------------------------------------------------------------------------
# annotate() guards -- the single-pass span-merge must not nest markers
# ---------------------------------------------------------------------------

def test_annotate_no_nested_markers(make_skel):
    """Regression for the 2026-06-12 double-wrap bug.

    The old multi-pass annotate() re-matched 'FROZEN' inside markers it
    had just added, producing junk like
    ``<!--<!--FROZEN-->FROZEN<!--/FROZEN-->-->``.  The fix is a single
    span-merge pass.  This test locks that fix in.
    """
    out = make_skel.annotate("The Red5 dashboard reads SA_T from BACnet.")
    assert "<!--<!--FROZEN" not in out, f"nested marker leaked: {out!r}"
    # And the three protected tokens are each wrapped exactly once.
    assert out.count("<!--FROZEN-->Red5<!--/FROZEN-->")   == 1, out
    assert out.count("<!--FROZEN-->SA_T<!--/FROZEN-->")   == 1, out
    assert out.count("<!--FROZEN-->BACnet<!--/FROZEN-->") == 1, out


def test_annotate_skips_pseudo_keywords(make_skel):
    """ALL-CAPS pseudo-code keywords (IF, ELSE, ...) are not wrapped."""
    out = make_skel.annotate("IF temp > setpoint THEN open damper ELSE close")
    assert "<!--FROZEN-->IF<!--/FROZEN-->" not in out
    assert "<!--FROZEN-->THEN<!--/FROZEN-->" not in out
    assert "<!--FROZEN-->ELSE<!--/FROZEN-->" not in out


def test_annotate_wraps_inline_code(make_skel):
    out = make_skel.annotate("Use `h_oa = h_sa_user` as the bound.")
    assert "<!--FROZEN-->`h_oa = h_sa_user`<!--/FROZEN-->" in out


def test_annotate_wraps_paths(make_skel):
    out = make_skel.annotate("Edit /root/data/configs/telemetry.json and reload.")
    assert "<!--FROZEN-->/root/data/configs/telemetry.json<!--/FROZEN-->" in out


def test_annotate_brand_longest_wins(make_skel):
    """When 'Red5 Studio' could match as either 'Red5' or 'Red5 Studio',
    the longer literal wins (single-pass span priority)."""
    out = make_skel.annotate("Welcome to Red5 Studio.")
    assert "<!--FROZEN-->Red5 Studio<!--/FROZEN-->" in out
    assert "<!--FROZEN-->Red5<!--/FROZEN--> Studio" not in out


def test_annotate_idempotent_inside_code_fence(make_skel):
    """The fence-tracking lives in build_skeleton(), not annotate().
    Verify annotate() on a plain line does not over-touch normal text."""
    line = "Just plain prose with no technical tokens at all."
    assert make_skel.annotate(line) == line


# ---------------------------------------------------------------------------
# build_skeleton() end-to-end smoke test
# ---------------------------------------------------------------------------

def test_build_skeleton_preserves_headings_and_fences(make_skel):
    """A skeleton must keep the same heading count and code-fence
    parity as the source so install_translation's validator passes
    on a freshly-stubbed but-untouched file."""
    skel = make_skel.build_skeleton(EN_DOC, "ja")
    en_txt = EN_DOC.read_text(encoding="utf-8")

    skel_heads = sum(1 for ln in skel.splitlines()   if ln.lstrip().startswith("#"))
    en_heads   = sum(1 for ln in en_txt.splitlines() if ln.lstrip().startswith("#"))
    # The skeleton adds an HTML-comment instruction block above the
    # body, but no new '#' headings.
    assert skel_heads == en_heads, f"heading drift en={en_heads} skel={skel_heads}"

    skel_fences = sum(1 for ln in skel.splitlines()   if ln.lstrip().startswith("```"))
    en_fences   = sum(1 for ln in en_txt.splitlines() if ln.lstrip().startswith("```"))
    assert skel_fences == en_fences, f"fence drift en={en_fences} skel={skel_fences}"
    assert skel_fences % 2 == 0


# ---------------------------------------------------------------------------
# install_translation.validate() guards
# ---------------------------------------------------------------------------

def test_validate_rejects_bad_filename(install, tmp_path):
    bad = tmp_path / "control_algorithms.fr.md"  # 'fr' not in valid langs
    bad.write_text("# x\n", encoding="utf-8")
    errs = install.validate(bad)
    assert any("does not match" in e for e in errs), errs


def test_validate_rejects_leftover_frozen_markers(install, tmp_path):
    f = tmp_path / "opt_sa_insight.ja.md"
    f.write_text("# 日本語\n\n<!--FROZEN-->SA<!--/FROZEN--> はテスト。\n", encoding="utf-8")
    errs = install.validate(f)
    assert any("FROZEN" in e for e in errs), errs


def test_validate_rejects_heading_drift(install, tmp_path):
    f = tmp_path / "opt_sa_insight.ja.md"
    f.write_text("# only one heading\n\nbody\n", encoding="utf-8")
    errs = install.validate(f)
    assert any("heading count" in e for e in errs), errs


def test_validate_rejects_odd_code_fences(install, tmp_path):
    f = tmp_path / "opt_sa_insight.ja.md"
    f.write_text("# x\n\n```\nopen but never closed\n", encoding="utf-8")
    errs = install.validate(f)
    # Either or both of these triggers is fine; we just need one fence-related error.
    assert any("fence" in e.lower() for e in errs), errs


def test_validate_accepts_perfect_copy(install, tmp_path):
    """A byte-identical copy of the EN source (renamed) passes every
    structural check.  It's not a useful translation, but it proves
    the validator does not over-reject."""
    f = tmp_path / "opt_sa_insight.ja.md"
    f.write_text(EN_DOC.read_text(encoding="utf-8"), encoding="utf-8")
    errs = install.validate(f)
    assert errs == [], f"unexpected validation errors: {errs}"
