"""Regression: every controller .py file must be safe for the enteliWEB
custom Python tokenizer.

The Delta Controls embedded parser hangs on:
  - any non-ASCII byte inside a `#` comment (em-dash, smart quote, ...);
  - an odd number of `'` apostrophes inside a `#` comment (it reads the
    lone quote as an unterminated string and never completes the save).

This caused two production incidents in this codebase:
  - collector.py crashed at parse time after a routine edit added a comment
    with a contraction (cannot recurse into the apostrophe-mid-comment
    branch of the tokenizer).
  - app.py would not save through the enteliWEB script editor -- the save
    spinner span forever because the parser stalled on em-dashes the
    operator's editor had left in.

Sanitizer: tests/_sanitize_py_comments.py rewrites COMMENT tokens only
(AST-identical, non-comment-token-identical).  Run it on the controller
deploy set whenever a Python file is touched in this repo.

This test fails fast in CI if any deploy-target .py drifts back into a
state the enteliWEB parser would reject.

Run from /app/archive/Red5-Studio-V1.9:
    python3 tests/test_enteliweb_parser_safe.py
"""
import io
import os
import sys
import tokenize

THIS_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_DIR = os.path.dirname(THIS_DIR)

# All .py files deployed to the controller.  Update this set if a new
# plug-in is added under /app/archive/Red5-Studio-V1.9/ at the top level.
DEPLOY_FILES = [
    "_bridges_lib.py",
    "_service_template.py",
    "app.py",
    "bacnet_diag_service.py",
    "band_csv_generator.py",
    "band_overrides_service.py",
    "band_service.py",
    "bridges_admin_service.py",
    "build_bundle.py",
    "collector.py",
    "modbus_bridge_service.py",
    "mqtt_bridge_service.py",
    "simulator.py",
    "telemetry_service.py",
    "upload_service.py",
    "weather_service.py",
    "webhook_bridge_service.py",
    "ws_bridge_service.py",
]


def audit(path):
    """Return (nonascii_count, odd_apos_lines) for COMMENT tokens only."""
    with open(path, "r", encoding="utf-8") as f:
        src = f.read()
    nonascii = 0
    odd_apos = []
    for tok in tokenize.generate_tokens(io.StringIO(src).readline):
        if tok.type != tokenize.COMMENT:
            continue
        text = tok.string
        for ch in text:
            if ord(ch) >= 128:
                nonascii += 1
        if text.count("'") % 2 == 1:
            odd_apos.append((tok.start[0], text.strip()[:120]))
    return nonascii, odd_apos


def main():
    failures = []
    passed = 0
    for name in DEPLOY_FILES:
        path = os.path.join(REPO_DIR, name)
        if not os.path.exists(path):
            failures.append("%s: file missing from deploy set" % name)
            continue
        nonascii, odd_apos = audit(path)
        if nonascii or odd_apos:
            msg = "%s: %d non-ASCII byte(s) in comments, %d odd-apostrophe comment line(s)" % (
                name, nonascii, len(odd_apos))
            for ln, line in odd_apos[:3]:
                msg += "\n    L%d: %s" % (ln, line)
            failures.append(msg)
        else:
            passed += 1

    total = len(DEPLOY_FILES)
    print("enteliWEB parser safety: %d/%d clean." % (passed, total))
    if failures:
        print("FAILURES (run: python3 tests/_sanitize_py_comments.py *.py to fix):")
        for f in failures:
            print("  - " + f)
        sys.exit(1)
    sys.exit(0)


if __name__ == "__main__":
    main()
