"""One-shot data fix: normalise AHU_TYPE / VAV_TYPE filename padding in
the tenant_assets virtual filesystem and the tenant_equipment_types
visual_assets references.

Why: V1.8 schemas stored `AHU_TYPE_1.jpg` (single-digit), V1.9 settled on
`AHU_TYPE_01.jpg` (two-digit, sort-friendly).  Operators who uploaded an
asset under one spelling and a schema under the other end up with broken
"No preview" tiles.  Rather than keep papering over this with runtime
fallbacks (which we ALSO ship, as a belt-and-braces measure), this
script makes the data canonical.

Run mode:
    --dry-run     show what WOULD change.  Default.
    --apply       actually rewrite documents.
    --target STR  canonical padding: ``pad`` (default, V1.9 style:
                  _1 -> _01) or ``unpad`` (V1.8 style: _01 -> _1).
    --tenant ID   restrict to one tenant (default: all).

Idempotent: re-running after --apply is a no-op.
"""
from __future__ import annotations

import argparse
import os
import re
import sys
from typing import Optional

from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env"))

from pymongo import MongoClient

# Same regex / direction logic as the runtime helper in server.py.
_PAD_RE = re.compile(r"_(\d{1,2})(\.[A-Za-z0-9]+)$")


def _canonicalise(name: str, *, target: str) -> Optional[str]:
    """Return canonical spelling of `name`, or None if unchanged.

    target='pad'   ->  _1.jpg becomes _01.jpg (V1.9 canonical).
    target='unpad' ->  _01.jpg becomes _1.jpg (V1.8 canonical, rare).
    """
    head, _, tail = name.rpartition("/")
    m = _PAD_RE.search(tail)
    if not m:
        return None
    digits, ext = m.group(1), m.group(2)
    n = int(digits)
    if target == "pad" and len(digits) == 1:
        new_tail = _PAD_RE.sub(f"_{n:02d}{ext}", tail)
    elif target == "unpad" and len(digits) == 2 and n < 10:
        new_tail = _PAD_RE.sub(f"_{n}{ext}", tail)
    else:
        return None
    return f"{head}/{new_tail}" if head else new_tail


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--apply", action="store_true",
                    help="Actually write changes (default: dry-run).")
    ap.add_argument("--target", choices=("pad", "unpad"), default="pad",
                    help="Canonical padding direction (default: pad).")
    ap.add_argument("--tenant", default=None,
                    help="Restrict to one tenant_id (default: all).")
    args = ap.parse_args()

    mongo_url = os.environ.get("MONGO_URL")
    db_name = os.environ.get("DB_NAME")
    if not mongo_url or not db_name:
        print("MONGO_URL/DB_NAME missing from environment.", file=sys.stderr)
        return 2

    client = MongoClient(mongo_url)
    db = client[db_name]

    mode = "APPLY" if args.apply else "DRY-RUN"
    print(f"[{mode}] target={args.target}  tenant={args.tenant or '<all>'}  db={db_name}")

    # 1. tenant_assets: rename `filename` field where there's a padding mismatch
    #    AND no collision with a doc that already owns the canonical name.
    asset_filter = {} if args.tenant is None else {"tenant_id": args.tenant}
    asset_renames = 0
    asset_skips = 0
    for doc in db.tenant_assets.find(asset_filter):
        fname = doc.get("filename")
        if not isinstance(fname, str):
            continue
        canon = _canonicalise(fname, target=args.target)
        if canon is None or canon == fname:
            continue
        # Collision guard: don't overwrite an existing canonical doc for
        # the same tenant -- prefer to leave both and let the operator
        # inspect.  (This only matters if BOTH _1 and _01 already exist.)
        collision = db.tenant_assets.find_one({
            "tenant_id": doc.get("tenant_id"),
            "filename": canon,
        })
        if collision is not None:
            print(f"  SKIP collision tenant={doc.get('tenant_id')} {fname!r} -> {canon!r} already exists")
            asset_skips += 1
            continue
        print(f"  asset tenant={doc.get('tenant_id')} {fname!r} -> {canon!r}")
        if args.apply:
            db.tenant_assets.update_one({"_id": doc["_id"]}, {"$set": {"filename": canon}})
        asset_renames += 1

    # 2. tenant_equipment_types: rewrite visual_assets.base_graphic refs.
    eqp_filter = {} if args.tenant is None else {"tenant_id": args.tenant}
    schema_rewrites = 0
    for doc in db.tenant_equipment_types.find(eqp_filter):
        changed = False
        for cat_key in ("ahu_types", "vav_types", "lighting_types"):
            cat = doc.get(cat_key) or {}
            if not isinstance(cat, dict):
                continue
            for type_id, t in cat.items():
                if not isinstance(t, dict):
                    continue
                va = t.get("visual_assets") or {}
                bg = va.get("base_graphic") if isinstance(va, dict) else None
                if not isinstance(bg, str):
                    continue
                canon = _canonicalise(bg, target=args.target)
                if canon is None or canon == bg:
                    continue
                print(f"  schema tenant={doc.get('tenant_id')} {cat_key}.{type_id} {bg!r} -> {canon!r}")
                va["base_graphic"] = canon
                changed = True
        if changed and args.apply:
            db.tenant_equipment_types.update_one(
                {"_id": doc["_id"]},
                {"$set": {
                    "ahu_types":      doc.get("ahu_types"),
                    "vav_types":      doc.get("vav_types"),
                    "lighting_types": doc.get("lighting_types"),
                }},
            )
        if changed:
            schema_rewrites += 1

    print()
    print(f"asset renames:    {asset_renames}  (skipped due to collisions: {asset_skips})")
    print(f"schema rewrites:  {schema_rewrites}")
    if not args.apply:
        print()
        print("This was a dry run.  Re-run with --apply to commit the changes.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
