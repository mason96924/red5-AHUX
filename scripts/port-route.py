#!/usr/bin/env python3
"""
port-route.py -- scaffold the V1.9 side of a V2.0-only /api/* route.

Reads the V2.0 source under /app/backend/routes/, finds the FastAPI handler
that owns the given route, maps the URL prefix to the right V1.9 service
file, and:

  1) prints the V2.0 source location (file:line, plus the function body
     verbatim so the operator can copy/paste-adapt it),
  2) appends a TODO stub function + ``app.add_url_rule(...)`` line to the
     V1.9 service file (idempotent -- never duplicates an existing route),
  3) writes a *.before back-up so a botched scaffold is one ``mv`` away.

Mapping (URL prefix -> V1.9 service file, in priority order):

  /api/band-overrides/*  -> band_overrides_service.py
  /api/band-csv/*        -> band_service.py             (closest match)
  /api/band*             -> band_service.py
  /api/bacnet/*          -> bacnet_diag_service.py
  /api/bridges/*         -> bridges_admin_service.py
  /api/modbus*           -> modbus_bridge_service.py
  /api/mqtt*             -> mqtt_bridge_service.py
  /api/webhook*          -> webhook_bridge_service.py
  /api/ws*               -> ws_bridge_service.py
  /api/g36*              -> g36_service.py
  /api/weather*          -> weather_service.py
  /api/upload*           -> upload_service.py
  /api/ahu*, /api/data,  -> telemetry_service.py
  /api/trend-history
  /api/*                 -> app.py                       (catch-all)

Usage:
    python3 /app/scripts/port-route.py /api/band-overrides/ahu-rh-bands
    python3 /app/scripts/port-route.py /api/band-overrides/ahu-rh-bands --diff
    python3 /app/scripts/port-route.py /api/band-overrides/ahu-rh-bands --edit

Exit codes:
    0   stub written (or already present -- idempotent)
    2   route does not exist in V2.0
    3   V1.9 target file not found (mapping miss)
"""
from __future__ import annotations

import argparse
import os
import re
import shutil
import subprocess
import sys

REPO_ROOT      = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V20_ROUTES_DIR = os.path.join(REPO_ROOT, "backend", "routes")
V19_ROOT       = os.path.join(REPO_ROOT, "archive", "Red5-AHU-V1.9")

# Ordered list -- first prefix that matches wins.  Tested from longest
# prefix to shortest so /api/band-overrides/ beats /api/band*.
MAPPING = [
    ("/api/band-overrides/", "band_overrides_service.py"),
    ("/api/band-csv/",       "band_service.py"),
    ("/api/band",            "band_service.py"),
    ("/api/bacnet/",         "bacnet_diag_service.py"),
    ("/api/bridges/",        "bridges_admin_service.py"),
    ("/api/modbus",          "modbus_bridge_service.py"),
    ("/api/mqtt",            "mqtt_bridge_service.py"),
    ("/api/webhook",         "webhook_bridge_service.py"),
    ("/api/ws",              "ws_bridge_service.py"),
    ("/api/g36",             "g36_service.py"),
    ("/api/weather",         "weather_service.py"),
    ("/api/upload",          "upload_service.py"),
    ("/api/ahu",             "telemetry_service.py"),
    ("/api/data",            "telemetry_service.py"),
    ("/api/trend-history",   "telemetry_service.py"),
    ("/api/",                "app.py"),  # catch-all
]


def find_v20_handler(route: str):
    """Locate the V2.0 file + line + function body that handles ``route``.

    Returns ``(path, line, verb, func_name, body)`` or ``None``."""
    # Match @router.verb("/api/...") or @app.verb("/api/...")
    decorator = re.compile(
        r"""@\s*(?:router|app)\s*\.\s*(get|post|put|delete|patch)\s*\(\s*["']([^"']+)["']""",
        re.IGNORECASE,
    )
    canon_route = _canon(route)
    for dirpath, _dirs, files in os.walk(V20_ROUTES_DIR):
        for fname in files:
            if not fname.endswith(".py"):
                continue
            fpath = os.path.join(dirpath, fname)
            with open(fpath, encoding="utf-8") as fh:
                lines = fh.read().splitlines()
            for i, line in enumerate(lines):
                m = decorator.search(line)
                if not m:
                    continue
                if _canon(m.group(2)) != canon_route:
                    continue
                verb = m.group(1).upper()
                # Body = decorator + every following line until the next
                # top-level def/decorator/class or EOF.
                body = [line]
                j = i + 1
                while j < len(lines):
                    nxt = lines[j]
                    if re.match(r"^\s*(?:@\w|def\s|class\s|async def\s)", nxt) and not nxt.startswith(" "):
                        # Next top-level item -- stop.
                        break
                    body.append(nxt)
                    j += 1
                # Strip trailing blanks
                while body and not body[-1].strip():
                    body.pop()
                # The function name comes from the line right after the @decorator
                func_name = "TODO_func_name"
                if i + 1 < len(lines):
                    fm = re.match(r"\s*(?:async\s+)?def\s+([A-Za-z_][A-Za-z0-9_]*)", lines[i + 1])
                    if fm:
                        func_name = fm.group(1)
                return fpath, i + 1, verb, func_name, "\n".join(body)
    return None


def pick_v19_file(route: str) -> str | None:
    for prefix, fname in MAPPING:
        if route.startswith(prefix):
            full = os.path.join(V19_ROOT, fname)
            if os.path.isfile(full):
                return full
    return None


def _canon(url: str) -> str:
    url = re.sub(r"<[^>]+>", "{*}", url)
    url = re.sub(r"\{[^}]+\}", "{*}", url)
    if len(url) > len("/api/") and url.endswith("/"):
        url = url[:-1]
    return url


def already_registered(v19_path: str, route: str) -> bool:
    """True if ``route`` (canonicalised) already appears in the V1.9 file."""
    with open(v19_path, encoding="utf-8") as fh:
        body = fh.read()
    canon = _canon(route)
    # Find every ``add_url_rule('/api/...')`` and every ``@app.route('/api/...')``
    for m in re.finditer(r"""add_url_rule\s*\(\s*["']([^"']+)["']""", body):
        if _canon(m.group(1)) == canon:
            return True
    for m in re.finditer(r"""@app\.route\s*\(\s*["']([^"']+)["']""", body):
        if _canon(m.group(1)) == canon:
            return True
    return False


def _flask_route(route: str) -> str:
    """Convert FastAPI ``{ahu_id}`` placeholders to Flask ``<ahu_id>`` ones."""
    return re.sub(r"\{([A-Za-z_][A-Za-z0-9_]*)(?::[a-z]+)?\}", r"<\1>", route)


def write_stub(v19_path: str, route: str, verb: str, func_name: str,
               v20_path: str, v20_line: int) -> str:
    """Append the stub.  Returns the snippet that was written."""
    # Convert FastAPI placeholders to Flask path syntax:
    #   {foo:path} -> <path:foo>     (must run first, more specific)
    #   {foo}      -> <foo>
    flask_route = re.sub(r"\{([A-Za-z_][A-Za-z0-9_]*):path\}", r"<path:\1>", route)
    flask_route = re.sub(r"\{([A-Za-z_][A-Za-z0-9_]*)\}",      r"<\1>",      flask_route)

    # Path params from the Flask-flavoured route (<foo>, <path:foo>)
    params = re.findall(r"<(?:[a-z]+:)?([A-Za-z_][A-Za-z0-9_]*)>", flask_route)
    py_args = ", ".join(params) if params else ""

    v19_endpoint = func_name if func_name and func_name != "TODO_func_name" \
                   else route.strip("/").replace("/", "_").replace("-", "_").replace("{*}", "x")

    # Collision guard: if the function name is already defined in the V1.9
    # file, suffix it with the route's leaf segment so we don't shadow the
    # existing def.  Example: V1.9 already has get_band_guide for
    # /api/band-csv/guide; scaffolding /api/band-guide reuses that name and
    # would overwrite it.  Suffix -> get_band_guide_band_guide is ugly but
    # safe; the operator will rename it before committing.
    with open(v19_path, encoding="utf-8") as fh:
        existing_body = fh.read()
    if re.search(rf"^def\s+{re.escape(v19_endpoint)}\s*\(", existing_body, re.MULTILINE):
        leaf = re.sub(r"[^A-Za-z0-9]", "_", route.strip("/").split("/", 1)[-1]).strip("_")
        v19_endpoint = v19_endpoint + "_" + leaf
        print(f"    [!] name collision -- using {v19_endpoint} instead", file=sys.stderr)

    rel_v20 = os.path.relpath(v20_path, REPO_ROOT)

    snippet = f'''

# ---------------------------------------------------------------------------
# {route}    ({verb})
# Ported from V2.0  {rel_v20}:{v20_line}
# TODO  fill in the body so the response shape mirrors V2.0 byte-for-byte.
#       Use the V1.9 helpers from ``ctx`` (get_h, safe_load_json, etc.) --
#       do not introduce new dependencies.  Delete this banner once done.
# ---------------------------------------------------------------------------
def {v19_endpoint}({py_args}):
    """Flask handler for {verb} {route}.  See {rel_v20}:{v20_line} for the V2.0 reference."""
    from flask import jsonify
    return jsonify({{
        "_todo": "port {route} from {rel_v20}",
        "method": "{verb.lower()}",
    }})
'''.lstrip("\n")

    register_line = (
        f"    # Auto-scaffolded by port-route.py -- TODO move next to its siblings\n"
        f"    app.add_url_rule('{flask_route}', '{v19_endpoint}',\n"
        f"                     {v19_endpoint}, methods=['{verb}'])\n"
    )

    # Back-up
    shutil.copy(v19_path, v19_path + ".before")

    with open(v19_path, encoding="utf-8") as fh:
        original = fh.read()

    # Append the stub at the end of the module.
    new_body = original.rstrip("\n") + "\n\n" + snippet

    # Try to inject the register line inside ``def register(app, ctx):``.
    # Find the last add_url_rule call inside register() and append right after it.
    reg_match = re.search(r"def\s+register\s*\(\s*app\s*,\s*ctx\s*\)\s*:", new_body)
    injected = False
    if reg_match:
        tail = new_body[reg_match.end():]
        last_add = None
        for m in re.finditer(r"app\.add_url_rule\([^)]+\)[^\n]*\n", tail):
            last_add = m
        if last_add:
            insert_at = reg_match.end() + last_add.end()
            new_body = new_body[:insert_at] + register_line + new_body[insert_at:]
            injected = True
    if not injected:
        new_body += "\n# TODO add to register(app, ctx):\n# " + register_line.replace("\n", "\n# ")

    with open(v19_path, "w", encoding="utf-8") as fh:
        fh.write(new_body)

    return snippet + "\n--- register() line ---\n" + register_line


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="Scaffold the V1.9 side of a V2.0-only /api/* route.")
    ap.add_argument("route", help="e.g. /api/band-overrides/ahu-rh-bands")
    ap.add_argument("--diff", action="store_true", help="print V2.0 source after scaffolding")
    ap.add_argument("--edit", action="store_true", help="open $EDITOR -O on V2.0 source + V1.9 target")
    args = ap.parse_args(argv)

    if not args.route.startswith("/api/"):
        print("error: route must start with /api/", file=sys.stderr)
        return 2

    found = find_v20_handler(args.route)
    if not found:
        print(f"error: {args.route} not found in {V20_ROUTES_DIR}", file=sys.stderr)
        return 2
    v20_path, v20_line, verb, func_name, body = found
    print(f"V2.0 source  : {os.path.relpath(v20_path, REPO_ROOT)}:{v20_line}  ({verb}  {func_name})")

    v19_path = pick_v19_file(args.route)
    if not v19_path:
        print(f"error: no V1.9 file matches {args.route} (mapping miss)", file=sys.stderr)
        return 3
    print(f"V1.9 target  : {os.path.relpath(v19_path, REPO_ROOT)}")

    if already_registered(v19_path, args.route):
        print(f"\n[OK] {args.route} is already registered in {os.path.basename(v19_path)} -- nothing to do.")
        return 0

    snippet = write_stub(v19_path, args.route, verb, func_name, v20_path, v20_line)
    print(f"\n[+] appended stub to {os.path.relpath(v19_path, REPO_ROOT)}")
    print(f"    backup saved as {os.path.relpath(v19_path + '.before', REPO_ROOT)}")
    print()
    print("scaffolded snippet:")
    print("-" * 70)
    print(snippet.rstrip())
    print("-" * 70)

    if args.diff:
        print("\nV2.0 source (reference) -- copy/paste-adapt into the stub:")
        print("-" * 70)
        print(body)
        print("-" * 70)

    if args.edit:
        editor = os.environ.get("EDITOR", "vi")
        # vim/nvim/vi support -O for vertical split; other editors will just open both.
        try:
            subprocess.call([editor, "-O", v20_path, v19_path])
        except FileNotFoundError:
            subprocess.call([editor, v20_path, v19_path])

    print()
    print("Next steps:")
    print(f"  1) edit {os.path.relpath(v19_path, REPO_ROOT)} -- replace the TODO body with the real port")
    print(f"  2) python3 scripts/check_v19_v20_parity.py  # should now report ok=true")
    print(f"  3) git add -p && git commit                # pre-commit hook will rubber-stamp it")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
