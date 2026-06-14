#!/usr/bin/env python3
"""install_translation.py — drop a finished translation into all three target trees.

Usage:
    python3 install_translation.py /path/to/control_algorithms.ja.md

What it does:
  1. Validates the filename matches the expected pattern
     <doc>.<lang>.md where lang in (ja, ko, zh-CN, zh-TW).
  2. Validates the file passes the structural checks from README §4
     (heading count, code-fence parity, no leftover FROZEN markers).
  3. Copies it byte-identically to all three target trees:
        /app/archive/Red5-Studio-V1.9/docs/
        /app/archive/Red5-Studio-V2.0/docs/
        /app/frontend/public/docs/
  4. Reports md5 sums for each copy so the operator can confirm parity.

Stdlib-only.  Refuses to overwrite identical files (idempotent).
"""
from __future__ import annotations

import argparse
import hashlib
import re
import shutil
import sys
from pathlib import Path

DOCS_DIR_V19 = Path("/app/archive/Red5-Studio-V1.9/docs")
DOCS_DIR_V20 = Path("/app/archive/Red5-Studio-V2.0/docs")
DOCS_DIR_PUB = Path("/app/frontend/public/docs")
TARGETS = (DOCS_DIR_V19, DOCS_DIR_V20, DOCS_DIR_PUB)

NAME_RE = re.compile(r"^(?P<doc>[a-z0-9_]+)\.(?P<lang>ja|ko|zh-CN|zh-TW)\.md$")


def validate(src: Path) -> list[str]:
    """Return a list of validation errors (empty list = OK)."""
    errs: list[str] = []
    m = NAME_RE.match(src.name)
    if not m:
        errs.append(
            f"filename {src.name!r} does not match <doc>.<lang>.md "
            "with lang in (ja, ko, zh-CN, zh-TW)"
        )
        return errs  # can't do further checks without knowing the source doc

    en = DOCS_DIR_V19 / f"{m['doc']}.md"
    if not en.exists():
        errs.append(f"no English source found at {en}")
        return errs

    src_txt = src.read_text(encoding="utf-8")
    en_txt  = en.read_text(encoding="utf-8")

    # FROZEN markers must be stripped before install -- if they remain,
    # the translator forgot step 2 of the README header.
    if "<!--FROZEN-->" in src_txt or "<!--/FROZEN-->" in src_txt:
        errs.append(
            "file still contains <!--FROZEN--> markers -- remove them "
            "after confirming the spans inside stayed in English"
        )

    # Heading count parity (counts `#` at line starts).
    src_h = sum(1 for ln in src_txt.splitlines() if ln.lstrip().startswith("#"))
    en_h  = sum(1 for ln in en_txt.splitlines()  if ln.lstrip().startswith("#"))
    if src_h != en_h:
        errs.append(f"heading count mismatch: en={en_h}, {m['lang']}={src_h}")

    # Code-fence parity (open/close).
    src_f = sum(1 for ln in src_txt.splitlines() if ln.lstrip().startswith("```"))
    en_f  = sum(1 for ln in en_txt.splitlines()  if ln.lstrip().startswith("```"))
    if src_f != en_f:
        errs.append(f"code-fence count mismatch: en={en_f}, {m['lang']}={src_f}")
    if src_f % 2 != 0:
        errs.append(f"odd number of code fences ({src_f}) -- unclosed block")

    # Trailing newline + no extra trailing blank lines.
    if not src_txt.endswith("\n"):
        errs.append("missing trailing newline")
    elif src_txt.endswith("\n\n\n"):
        errs.append("extra trailing blank lines -- keep just one")

    return errs


def install(src: Path) -> int:
    src = src.expanduser().resolve()
    if not src.is_file():
        print(f"ERROR: source not found: {src}", file=sys.stderr)
        return 2

    errs = validate(src)
    if errs:
        print(f"VALIDATION FAILED for {src.name}:", file=sys.stderr)
        for e in errs:
            print(f"  - {e}", file=sys.stderr)
        return 3

    md5 = hashlib.md5(src.read_bytes()).hexdigest()
    print(f"source: {src}   md5={md5}\n")

    skipped = installed = 0
    for d in TARGETS:
        out = d / src.name
        if out.exists() and hashlib.md5(out.read_bytes()).hexdigest() == md5:
            print(f"  SKIP   identical: {out}")
            skipped += 1
            continue
        d.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, out)
        out_md5 = hashlib.md5(out.read_bytes()).hexdigest()
        ok = "OK" if out_md5 == md5 else "PARITY-FAIL"
        print(f"  WROTE  {out}   md5={out_md5}   {ok}")
        installed += 1

    print(f"\nDone. installed={installed}, skipped(identical)={skipped}")
    return 0


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument("source", help="Path to finished <doc>.<lang>.md")
    args = p.parse_args()
    return install(Path(args.source))


if __name__ == "__main__":
    raise SystemExit(main())
