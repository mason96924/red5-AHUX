"""Sanitize Python comments for the enteliWEB custom tokenizer.

The Delta Controls embedded Python parser stalls when a `#` comment
contains:
  - any non-ASCII byte (em-dash, smart quote, ellipsis, etc.), OR
  - an odd number of apostrophes (it reads the lone `'` as the start of
    an unterminated string and never completes the save).

This script rewrites ONLY content inside comment tokens (`tokenize.COMMENT`)
so that:
  - all non-ASCII characters are replaced with ASCII equivalents, and
  - every contraction-style apostrophe (don't, isn't, ...) is expanded so
    the comment ends up with zero apostrophes (and therefore even parity).

String literals and code are left untouched, so the bytecode is bit-for-bit
identical to the original.

Usage:
    python3 tests/_sanitize_py_comments.py [--dry-run] file1.py [file2.py ...]
"""
from __future__ import annotations

import argparse
import io
import os
import sys
import tokenize


# -- Character substitutions for non-ASCII chars commonly found in comments --
NON_ASCII_MAP = {
    "\u2014": "--",   # em dash
    "\u2013": "-",    # en dash
    "\u2212": "-",    # minus sign
    "\u2018": "'",    # left single quote
    "\u2019": "'",    # right single quote
    "\u201C": '"',    # left double quote
    "\u201D": '"',    # right double quote
    "\u2026": "...",  # ellipsis
    "\u00A0": " ",    # non-breaking space
    "\u00B7": ".",    # middle dot
    "\u2022": "*",    # bullet
    "\u00B0": " deg ",  # degree sign
    "\u00B1": "+/-",  # plus-minus
    "\u00D7": "x",    # multiplication
    "\u2192": "->",   # right arrow
    "\u2190": "<-",   # left arrow
    "\u2194": "<->",  # double arrow
    "\u00B5": "u",    # micro sign
    "\u00BD": "1/2",
    "\u00BC": "1/4",
    "\u00BE": "3/4",
    "\u221E": "inf",
    "\u2248": "~",    # approx equal
    "\u2260": "!=",   # not equal
    "\u2264": "<=",
    "\u2265": ">=",
    "\u2713": "[ok]",
    "\u2717": "[x]",
    "\u2705": "[ok]",
    "\u26A0": "[!]",  # warning sign
    "\u2728": "*",
    "\u2192": "->",
    "\u00E9": "e",    # e-acute (resume, cafe ...)
    "\u00E8": "e",
    "\u00EA": "e",
    "\u00F1": "n",
    "\u00FC": "u",
    "\u00F6": "o",
    "\u00E4": "a",
    "\u00DF": "ss",
}

# -- Contraction expansion. Order matters: longer matches first so          --
# -- "won't" is not partially rewritten by a "n't" rule before the special  --
# -- form is consumed. We match case-insensitively but preserve the casing  --
# -- of the first letter for readability.                                   --
CONTRACTIONS = [
    ("won't",       "will not"),
    ("can't",       "cannot"),
    ("shan't",      "shall not"),
    ("ain't",       "is not"),
    ("aren't",      "are not"),
    ("isn't",       "is not"),
    ("wasn't",      "was not"),
    ("weren't",     "were not"),
    ("haven't",     "have not"),
    ("hasn't",      "has not"),
    ("hadn't",      "had not"),
    ("doesn't",     "does not"),
    ("don't",       "do not"),
    ("didn't",      "did not"),
    ("wouldn't",    "would not"),
    ("shouldn't",   "should not"),
    ("couldn't",    "could not"),
    ("mustn't",     "must not"),
    ("needn't",     "need not"),
    ("mightn't",    "might not"),
    ("oughtn't",    "ought not"),
    ("daren't",     "dare not"),
    ("you'll",      "you will"),
    ("we'll",       "we will"),
    ("they'll",     "they will"),
    ("he'll",       "he will"),
    ("she'll",      "she will"),
    ("it'll",       "it will"),
    ("i'll",        "I will"),
    ("there'll",    "there will"),
    ("you'd",       "you would"),
    ("we'd",        "we would"),
    ("they'd",      "they would"),
    ("i'd",         "I would"),
    ("he'd",        "he would"),
    ("she'd",       "she would"),
    ("you've",      "you have"),
    ("we've",       "we have"),
    ("they've",     "they have"),
    ("i've",        "I have"),
    ("should've",   "should have"),
    ("could've",    "could have"),
    ("would've",    "would have"),
    ("you're",      "you are"),
    ("we're",       "we are"),
    ("they're",     "they are"),
    ("there're",    "there are"),
    ("there's",     "there is"),
    ("here's",      "here is"),
    ("what's",      "what is"),
    ("where's",     "where is"),
    ("when's",      "when is"),
    ("who's",       "who is"),
    ("how's",       "how is"),
    ("that's",      "that is"),
    ("it's",        "it is"),
    ("he's",        "he is"),
    ("she's",       "she is"),
    ("let's",       "let us"),
    ("y'all",       "you all"),
    ("o'clock",     "o clock"),
    ("'em",         "them"),
    ("'tis",        "it is"),
]


def _replace_contraction(comment: str, src: str, dst: str) -> str:
    """Case-insensitive replace that preserves the leading capitalization
    of the matched word when the source starts with an alpha character."""
    out_parts = []
    i = 0
    src_low = src.lower()
    L = len(src_low)
    while i < len(comment):
        if comment[i:i + L].lower() == src_low:
            # Boundary: previous char must not be alphanumeric so we do not
            # eat halves of larger words. Trailing boundary is enforced by
            # the src spelling itself (ends in known non-letter or letter).
            prev = comment[i - 1] if i > 0 else " "
            nxt  = comment[i + L]   if i + L < len(comment) else " "
            # 'em / 'tis start with apostrophe, so prev-letter is allowed
            # to be a space-like char. For everything else, refuse if prev
            # is an alphanumeric so internal substrings ("doesnt'ish") are
            # left alone.
            first = src_low[0]
            if first.isalpha() and prev.isalnum():
                out_parts.append(comment[i])
                i += 1
                continue
            if first.isalpha() and nxt.isalnum():
                out_parts.append(comment[i])
                i += 1
                continue
            # Capitalize replacement if the source started with an uppercase.
            piece = dst
            if comment[i].isupper() and dst and dst[0].isalpha():
                piece = dst[0].upper() + dst[1:]
            out_parts.append(piece)
            i += L
        else:
            out_parts.append(comment[i])
            i += 1
    return "".join(out_parts)


def _strip_nonascii(text: str) -> str:
    out = []
    for ch in text:
        if ord(ch) < 128:
            out.append(ch)
        elif ch in NON_ASCII_MAP:
            out.append(NON_ASCII_MAP[ch])
        else:
            # Unknown non-ASCII: replace with `?` so we never silently leave
            # it in.  Operator can search for `?` if anything looks off.
            out.append("?")
    return "".join(out)


def sanitize_comment(comment: str) -> str:
    """Apply non-ASCII + contraction scrub to a single `#...` comment."""
    if not comment.startswith("#"):
        return comment
    body = comment[1:]
    body = _strip_nonascii(body)
    for src, dst in CONTRACTIONS:
        body = _replace_contraction(body, src, dst)
    # Final safety: if any apostrophes remain (e.g. "team's" -- a possessive
    # not in our contraction table), strip them since they can still trip
    # the tokenizer.
    body = body.replace("'", "")
    return "#" + body


def sanitize_source(source: str) -> str:
    """Tokenize `source`, rewrite every COMMENT token in place, return the
    reassembled source string.  Encoding-declaration comments (the very
    first/second-line `# -*- coding: ... -*-`) are also rewritten -- they
    are pure ASCII so the scrub is a no-op for them.
    """
    tokens = list(tokenize.generate_tokens(io.StringIO(source).readline))
    out_tokens = []
    for tok in tokens:
        if tok.type == tokenize.COMMENT:
            new_string = sanitize_comment(tok.string)
            # untokenize re-renders by string-token concatenation guided by
            # (start_row, start_col) positions, so keep the position tuple.
            out_tokens.append(tokenize.TokenInfo(tok.type, new_string,
                                                 tok.start, tok.end, tok.line))
        else:
            out_tokens.append(tok)
    # tokenize.untokenize loses some whitespace fidelity; the more reliable
    # path is line-by-line: collect (lineno, col, new_string) for COMMENT
    # tokens, then rewrite just those slices in the original source.
    lines = source.splitlines(keepends=True)
    # Map each COMMENT token to a (lineno_0based, col, old, new) tuple.
    rewrites = []
    for tok in tokens:
        if tok.type != tokenize.COMMENT:
            continue
        new_string = sanitize_comment(tok.string)
        if new_string == tok.string:
            continue
        lineno_0 = tok.start[0] - 1
        col = tok.start[1]
        rewrites.append((lineno_0, col, tok.string, new_string))
    # Apply rewrites; multiple comments on one line are processed
    # right-to-left so columns stay valid.
    by_line = {}
    for lineno_0, col, old, new in rewrites:
        by_line.setdefault(lineno_0, []).append((col, old, new))
    for lineno_0, edits in by_line.items():
        line = lines[lineno_0]
        for col, old, new in sorted(edits, key=lambda e: e[0], reverse=True):
            assert line[col:col + len(old)] == old, \
                f"Comment slice mismatch at L{lineno_0 + 1} col {col}"
            line = line[:col] + new + line[col + len(old):]
        lines[lineno_0] = line
    return "".join(lines)


def audit_source(source: str):
    """Return (nonascii_count, odd_apos_lines) for the FINAL post-scrub
    source.  Uses the real Python tokenizer so we only inspect content
    that the enteliWEB parser would also see as a `#` comment -- never
    `#` characters that live inside a string or docstring."""
    nonascii = 0
    odd_apos_lines = []
    try:
        tokens = list(tokenize.generate_tokens(io.StringIO(source).readline))
    except tokenize.TokenizeError:
        return nonascii, odd_apos_lines
    for tok in tokens:
        if tok.type != tokenize.COMMENT:
            continue
        text = tok.string
        for ch in text:
            if ord(ch) >= 128:
                nonascii += 1
        if text.count("'") % 2 == 1:
            odd_apos_lines.append((tok.start[0], text.strip()[:120]))
    return nonascii, odd_apos_lines


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("files", nargs="+")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    total_rewrites = 0
    failures = []
    for path in args.files:
        try:
            with open(path, "r", encoding="utf-8") as f:
                original = f.read()
        except Exception as e:
            failures.append(f"{path}: read error {e}")
            continue
        try:
            new = sanitize_source(original)
        except tokenize.TokenizeError as e:
            failures.append(f"{path}: tokenize error {e}")
            continue
        nonascii_after, odd_after = audit_source(new)
        changed = new != original
        if changed and not args.dry_run:
            with open(path, "w", encoding="utf-8") as f:
                f.write(new)
        flag = "DRY-RUN" if args.dry_run else ("REWROTE" if changed else "clean")
        print(f"{flag:<8} {path}  (post-scrub: {nonascii_after} non-ASCII / "
              f"{len(odd_after)} odd-apostrophe lines)")
        if nonascii_after or odd_after:
            failures.append(f"{path}: still has {nonascii_after} non-ASCII / {len(odd_after)} odd-apos after scrub")
            for ln, line in odd_after[:5]:
                print(f"  STILL_BAD L{ln}: {line}")
        if changed:
            total_rewrites += 1

    if failures:
        print("FAILURES:")
        for fl in failures:
            print(f"  - {fl}")
        sys.exit(1)
    print(f"OK ({total_rewrites} file(s) rewritten)")


if __name__ == "__main__":
    main()
