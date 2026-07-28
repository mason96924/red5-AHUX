"""
check_v19_v20_parity.py
========================
Static V1.9 / V2.0 endpoint-parity audit.

The dashboard's frontend bundle is shared by both backends.  V2.0 (FastAPI,
``/app/backend/``) is the canonical implementation; V1.9 (Flask,
``/app/archive/Red5-AHU-V1.9/``) is the legacy PROD app that must mirror
every public ``/api/*`` route V2.0 exposes -- otherwise PROD users see
features silently disappear (the most recent example: ``/api/ahu-rolling-
avgs`` was added to V2.0 but never ported to V1.9, so the pill Delta-arrows
and the 1h-vs-24h sparkline vanished on www.dcred5-studio.com).

This module performs a STATIC scan -- no app instantiation, no Flask
``url_map`` introspection at runtime -- so it can also be wired into
V1.9 boot (and CI / deploy.sh) without paying the cost of importing
FastAPI on a controller that doesn't have it.

Usage:
    python3 /app/scripts/check_v19_v20_parity.py             # human-readable report
    python3 /app/scripts/check_v19_v20_parity.py --json      # machine-readable
    python3 /app/scripts/check_v19_v20_parity.py --log PATH  # also append a
                                                              one-line warning to PATH

Exit codes:
    0  parity OK (no V2.0-only routes)
    2  parity drift detected (V2.0 has routes V1.9 doesn't)
    3  scan error (missing source tree)
"""
from __future__ import annotations

import argparse
import datetime as _dt
import json
import os
import re
import sys
from typing import Set


# Anchored at the repo root so the script runs the same way from a cwd of
# /app, /app/scripts, /app/archive/Red5-AHU-V1.9 (boot-time), etc.
REPO_ROOT      = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V20_ROUTES_DIR = os.path.join(REPO_ROOT, "backend", "routes")
V19_ROOT       = os.path.join(REPO_ROOT, "archive", "Red5-AHU-V1.9")


# ---------------------------------------------------------------------------
# Intentional V2.0-only routes (do NOT trigger parity drift).
#
# V1.9 controllers are field-deployed embedded devices with strict disk
# limits, no FastAPI runtime, and no V3.0 ELC protocol stack.  A handful
# of /api/* endpoints exist in V2.0 *by design* and must NEVER be ported
# back to V1.9.  Each entry below MUST carry a one-line justification.
#
# Add a new entry here when (and only when) you ship a V2.0-only route
# that you have explicitly decided not to support on the embedded fleet.
# ---------------------------------------------------------------------------
V20_ONLY_ALLOWLIST: dict[str, str] = {
    "/api/elc-demo":         "V3.0 ELC dev demo console (server.py mount) -- not a PROD feature",
    "/api/elc-demo/stress":  "V3.0 100-relay stress test (server.py mount) -- not a PROD feature",
}


# V2.0 FastAPI decorator pattern:  @router.get("/api/foo")  or  @app.get("/api/foo")
# captures the HTTP verb + path.  Multiline tolerant (DOTALL not needed because
# decorators are on a single line in this codebase).
_V20_RE = re.compile(
    r"""@\s*(?:router|app)\s*\.\s*(get|post|put|delete|patch)\s*\(\s*["']([^"']+)["']""",
    re.IGNORECASE,
)

# V1.9 Flask register patterns -- two of them:
#   @app.route('/api/foo', methods=[...])
#   app.add_url_rule('/api/foo', 'endpoint_name', view_fn, methods=[...])
_V19_DECORATOR_RE = re.compile(
    r"""@\s*app\s*\.\s*route\s*\(\s*["']([^"']+)["']""",
    re.IGNORECASE,
)
_V19_ADD_URL_RE = re.compile(
    r"""app\s*\.\s*add_url_rule\s*\(\s*["']([^"']+)["']""",
    re.IGNORECASE,
)


def _scan(paths: list, patterns: list) -> Set[str]:
    """Return the set of route paths matched by any of ``patterns`` across
    every .py file under any of ``paths``.  Tuples-of-groups handled
    transparently (we take the *last* group of each match, which is the
    URL in both V1.9 and V2.0 regexes)."""
    found: Set[str] = set()
    for root in paths:
        if not os.path.isdir(root):
            continue
        for dirpath, _dirs, files in os.walk(root):
            # Skip caches / archives within archives.
            if "__pycache__" in dirpath or "/node_modules/" in dirpath:
                continue
            for fname in files:
                if not fname.endswith(".py"):
                    continue
                try:
                    with open(os.path.join(dirpath, fname), "r", encoding="utf-8") as fh:
                        body = fh.read()
                except OSError:
                    continue
                for pat in patterns:
                    for m in pat.finditer(body):
                        # The URL is always the LAST capture group.
                        url = m.group(m.lastindex)
                        if url.startswith("/api/"):
                            found.add(_canon(url))
    return found


def _canon(url: str) -> str:
    """Canonicalize a route path so FastAPI and Flask path templates compare
    equal.  Both ecosystems use distinct placeholder syntaxes:

        FastAPI:  /api/ahu/{ahu_id}/rolling-avg          or  /api/assets/{path:path}
        Flask:    /api/ahu/<ahu_id>/rolling-avg          or  /api/assets/<path:filename>

    Because parameter NAMES often differ between the two stacks (e.g. Flask
    uses ``filename`` where FastAPI uses ``path``) we collapse every
    placeholder -- regardless of type qualifier or name -- to a single
    ``{*}`` wildcard so the comparison is structural, not name-sensitive."""
    # Flask <foo>, <int:foo>, <path:foo>     ->  {*}
    url = re.sub(r"<[^>]+>", "{*}", url)
    # FastAPI {foo}, {foo:path}, {foo:int}   ->  {*}
    url = re.sub(r"\{[^}]+\}", "{*}", url)
    # Trailing-slash insensitive
    if len(url) > len("/api/") and url.endswith("/"):
        url = url[:-1]
    return url


def audit() -> dict:
    v20 = _scan([V20_ROUTES_DIR, os.path.join(REPO_ROOT, "backend")], [_V20_RE])
    v19 = _scan([V19_ROOT],                                            [_V19_DECORATOR_RE, _V19_ADD_URL_RE])

    if not v20:
        return {"ok": False, "error": "no V2.0 routes found -- check REPO_ROOT", "v20_dir": V20_ROUTES_DIR}
    if not v19:
        return {"ok": False, "error": "no V1.9 routes found -- check REPO_ROOT", "v19_dir": V19_ROOT}

    # Drop intentional V2.0-only routes BEFORE diffing -- they would
    # otherwise look like drift forever.  Keep a copy so we can show
    # them in the report under a separate "allowlisted" section.
    allowlist_keys = set(V20_ONLY_ALLOWLIST.keys())
    intentional_v20_only = sorted(v20 & allowlist_keys)
    v20 = v20 - allowlist_keys

    v20_only = sorted(v20 - v19)
    v19_only = sorted(v19 - v20)
    shared   = sorted(v20 & v19)

    return {
        "ok":               len(v20_only) == 0,
        "checked_at":       _dt.datetime.now(_dt.timezone.utc).isoformat(),
        "v20_route_count":  len(v20),
        "v19_route_count":  len(v19),
        "shared_count":     len(shared),
        "v20_only":         v20_only,   # routes PROD (V1.9) is missing -- the real bugs
        "v19_only":         v19_only,   # routes V2.0 doesn't have (less critical)
        "v20_only_allowlisted": intentional_v20_only,  # by-design V2.0-only routes
    }


def _format_report(result: dict) -> str:
    lines = []
    lines.append("=" * 68)
    lines.append("V1.9 / V2.0 endpoint-parity audit  (" + result.get("checked_at", "?") + ")")
    lines.append("=" * 68)
    if "error" in result:
        lines.append("ERROR: " + result["error"])
        return "\n".join(lines)
    lines.append(f"V2.0 routes:  {result['v20_route_count']:>3}    "
                 f"V1.9 routes:  {result['v19_route_count']:>3}    "
                 f"shared:  {result['shared_count']:>3}")
    lines.append("")
    if result["v20_only"]:
        lines.append(f"[!] V1.9 IS MISSING {len(result['v20_only'])} V2.0 ROUTE(S) -- PROD will 404 on these:")
        for r in result["v20_only"]:
            lines.append("    - " + r)
    else:
        lines.append("[OK] V1.9 implements every V2.0 /api/* route.")
    lines.append("")
    if result["v19_only"]:
        lines.append(f"[info] {len(result['v19_only'])} legacy V1.9-only route(s) (low priority):")
        for r in result["v19_only"][:12]:
            lines.append("    - " + r)
        if len(result["v19_only"]) > 12:
            lines.append("    ... +" + str(len(result["v19_only"]) - 12) + " more")
    allow = result.get("v20_only_allowlisted") or []
    if allow:
        lines.append("")
        lines.append(f"[info] {len(allow)} intentional V2.0-only route(s) exempt from parity:")
        for r in allow:
            why = V20_ONLY_ALLOWLIST.get(r, "(no justification)")
            lines.append(f"    - {r}    -- {why}")
    return "\n".join(lines)


def _append_log(path: str, result: dict) -> None:
    """Append a one-line WARN to ``path`` when parity is broken.  Best-effort:
    if the directory can't be created or the file isn't writable we silently
    skip (this is called from V1.9 boot and must NEVER block startup)."""
    try:
        if "error" in result:
            return
        if result["ok"]:
            return
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "a", encoding="utf-8") as fh:
            ts = result.get("checked_at", "?")
            missing = ",".join(result["v20_only"])
            fh.write(f"{ts}  WARN  parity-drift  v20_only=[{missing}]\n")
    except Exception:  # noqa: BLE001 -- never block boot
        pass


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.strip().splitlines()[0])
    ap.add_argument("--json", action="store_true", help="emit machine-readable JSON instead of the human report")
    ap.add_argument("--log",  metavar="PATH", help="append a one-line WARN to PATH on parity drift")
    args = ap.parse_args(argv)

    result = audit()
    if args.log:
        _append_log(args.log, result)
    if args.json:
        sys.stdout.write(json.dumps(result, indent=2) + "\n")
    else:
        sys.stdout.write(_format_report(result) + "\n")

    if "error" in result:
        return 3
    return 0 if result["ok"] else 2


if __name__ == "__main__":
    raise SystemExit(main())
