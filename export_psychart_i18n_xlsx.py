#!/usr/bin/env python3
"""Export / import Psychart deck translations as Excel.

Export (default):
  python3 export_psychart_i18n_xlsx.py
  → docs/exports/psychart-hvac-ashrae-overview-i18n.xlsx

Import after editing the workbook:
  python3 export_psychart_i18n_xlsx.py --import docs/exports/psychart-hvac-ashrae-overview-i18n.xlsx
  python3 build_psychart_i18n.py
"""
from __future__ import annotations

import argparse
import importlib.util
import re
import zipfile
from collections import Counter
from pathlib import Path
from xml.etree import ElementTree as ET

import xlsxwriter

ROOT = Path(__file__).resolve().parent
EN_HTML = ROOT / "Psychart-HVAC-ASHRAE-Overview.html"
OUT_DEFAULT = ROOT / "docs" / "exports" / "psychart-hvac-ashrae-overview-i18n.xlsx"

LANG_FILES = {
    "ko": ROOT / "psychart_i18n_ko.py",
    "ja": ROOT / "psychart_i18n_ja.py",
    "zh_CN": ROOT / "psychart_i18n_zh_CN.py",
    "zh_TW": ROOT / "psychart_i18n_zh_TW.py",
}
LANG_LABELS = {
    "ko": "Korean (ko)",
    "ja": "Japanese (ja)",
    "zh_CN": "Simplified Chinese (zh-CN)",
    "zh_TW": "Traditional Chinese (zh-TW)",
}
# Sheet name → internal code
SHEET_LANG = {
    "ko": "ko",
    "ja": "ja",
    "zh-CN": "zh_CN",
    "zh-TW": "zh_TW",
}


def load_strings(path: Path) -> dict[str, str]:
    spec = importlib.util.spec_from_file_location(path.stem, path)
    mod = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(mod)
    return dict(mod.STRINGS)


def _unescape_py_string(s: str) -> str:
    return (
        s.replace("\\\\", "\0")
        .replace("\\n", "\n")
        .replace("\\t", "\t")
        .replace('\\"', '"')
        .replace("\\'", "'")
        .replace("\0", "\\")
    )


def load_section_map(path: Path) -> dict[str, str]:
    """Map English key → nearest preceding section comment."""
    text = path.read_text(encoding="utf-8")
    section = "(unsectioned)"
    mapping: dict[str, str] = {}
    lines = text.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        sm = re.match(r"\s*#\s*(?:---+|——+)\s*(.+?)\s*(?:---+|——+)?\s*$", line)
        if sm:
            section = sm.group(1).strip(" -—")
            i += 1
            continue
        if not re.match(r"\s*[\"']", line):
            i += 1
            continue
        j = i
        key = None
        while j < len(lines) and j <= i + 30:
            s = "\n".join(lines[i : j + 1])
            qi = next((k for k, c in enumerate(s) if c in "\"'"), None)
            if qi is None:
                break
            q = s[qi]
            k = qi + 1
            esc = False
            while k < len(s):
                c = s[k]
                if esc:
                    esc = False
                    k += 1
                    continue
                if c == "\\":
                    esc = True
                    k += 1
                    continue
                if c == q:
                    key = _unescape_py_string(s[qi + 1 : k])
                    break
                k += 1
            if key is not None:
                mapping[key] = section
                break
            j += 1
        i = (j + 1) if key is not None else i + 1
    return mapping


def collect_rows() -> list[dict]:
    langs = {code: load_strings(p) for code, p in LANG_FILES.items()}
    section_map: dict[str, str] = {}
    for p in LANG_FILES.values():
        for k, sec in load_section_map(p).items():
            section_map.setdefault(k, sec)

    en_html = EN_HTML.read_text(encoding="utf-8")
    all_keys: set[str] = set()
    for d in langs.values():
        all_keys |= set(d.keys())

    def key_pos(k: str) -> tuple:
        idx = en_html.find(k)
        return (10**9 if idx < 0 else idx, k)

    ordered = sorted(all_keys, key=key_pos)
    rows = []
    for n, en in enumerate(ordered, 1):
        ko = langs["ko"].get(en, "")
        ja = langs["ja"].get(en, "")
        zh_cn = langs["zh_CN"].get(en, "")
        zh_tw = langs["zh_TW"].get(en, "")
        missing = [
            code
            for code, val in (
                ("ko", ko),
                ("ja", ja),
                ("zh-CN", zh_cn),
                ("zh-TW", zh_tw),
            )
            if not val
        ]
        rows.append(
            {
                "id": f"P{n:03d}",
                "section": section_map.get(en, "(unsectioned)"),
                "english": en,
                "ko": ko,
                "ja": ja,
                "zh_CN": zh_cn,
                "zh_TW": zh_tw,
                "has_html": "yes" if re.search(r"<[^>]+>", en) else "",
                "in_en_html": "yes" if en in en_html else "NO — key not in EN HTML",
                "missing": ",".join(missing),
                "char_en": len(en),
                "notes": "",
            }
        )
    return rows


def export_xlsx(path: Path) -> None:
    rows = collect_rows()
    path.parent.mkdir(parents=True, exist_ok=True)

    wb = xlsxwriter.Workbook(str(path))
    hdr = wb.add_format(
        {
            "bold": True,
            "bg_color": "#1e293b",
            "font_color": "#f8fafc",
            "text_wrap": True,
            "valign": "top",
        }
    )
    wrap = wb.add_format({"text_wrap": True, "valign": "top"})
    wrap_en = wb.add_format(
        {"text_wrap": True, "valign": "top", "bg_color": "#f1f5f9"}
    )
    warn = wb.add_format(
        {"text_wrap": True, "valign": "top", "bg_color": "#fef3c7"}
    )
    miss = wb.add_format(
        {"text_wrap": True, "valign": "top", "bg_color": "#fee2e2"}
    )
    ok = wb.add_format({"text_wrap": True, "valign": "top"})

    ws = wb.add_worksheet("README")
    ws.set_column(0, 0, 100)
    readme = [
        "Psychart HVAC ASHRAE Overview — translation workbook",
        "",
        "Source English: Psychart-HVAC-ASHRAE-Overview.html",
        "Current strings: psychart_i18n_{ko,ja,zh_CN,zh_TW}.py",
        "Rebuild HTML after import: python3 build_psychart_i18n.py",
        "",
        "HOW TO TRANSLATE",
        "1. Edit language columns (ko / ja / zh_CN / zh_TW) or the per-language sheets.",
        "2. Do NOT change column english — it is the lookup key for the build script.",
        "3. Preserve HTML markup exactly: <b>...</b>, <br>, &amp;, &nbsp;, style=…",
        "4. Keep conventional tokens: ASHRAE, BMS, HVAC, AHU, VAV, ERV, HRV, OA/RA/MA/SA, Guideline 36.",
        "5. Prefer natural presentation phrasing over literal word-for-word.",
        "6. Use the notes column for ambiguous terms.",
        "7. Yellow cells = missing translation.",
        "",
        "SHEETS",
        "• translations — all languages side-by-side (primary)",
        "• ko / ja / zh-CN / zh-TW — single-language focus",
        "• import_long — long form (id, lang, english, text)",
        "",
        "RE-IMPORT",
        "  python3 export_psychart_i18n_xlsx.py --import docs/exports/psychart-hvac-ashrae-overview-i18n.xlsx",
        "  python3 build_psychart_i18n.py",
        "",
        f"Exported {len(rows)} string keys.",
        "Missing at least one language: "
        f"{sum(1 for r in rows if r['missing'])}.",
    ]
    for i, line in enumerate(readme):
        ws.write(i, 0, line)

    cols = [
        "id",
        "section",
        "english",
        "ko",
        "ja",
        "zh_CN",
        "zh_TW",
        "has_html",
        "in_en_html",
        "missing",
        "char_en",
        "notes",
    ]
    widths = [8, 28, 55, 45, 45, 45, 45, 10, 14, 16, 8, 30]
    ws = wb.add_worksheet("translations")
    for c, (name, w) in enumerate(zip(cols, widths)):
        ws.write(0, c, name, hdr)
        ws.set_column(c, c, w)
    ws.freeze_panes(1, 3)
    ws.autofilter(0, 0, len(rows), len(cols) - 1)

    for r, row in enumerate(rows, 1):
        for c, name in enumerate(cols):
            val = row[name]
            fmt = wrap
            if name == "english":
                fmt = wrap_en
            elif name in ("ko", "ja", "zh_CN", "zh_TW"):
                tag = {"ko": "ko", "ja": "ja", "zh_CN": "zh-CN", "zh_TW": "zh-TW"}[
                    name
                ]
                fmt = (
                    warn
                    if (not val)
                    or (row["missing"] and tag in row["missing"].split(","))
                    else ok
                )
            elif name == "in_en_html" and val != "yes":
                fmt = miss
            ws.write(r, c, val, fmt)
        ws.set_row(r, min(120, 18 + row["char_en"] // 40 * 12))

    for sheet_name, key in (
        ("ko", "ko"),
        ("ja", "ja"),
        ("zh-CN", "zh_CN"),
        ("zh-TW", "zh_TW"),
    ):
        ws = wb.add_worksheet(sheet_name)
        headers = ["id", "section", "english", sheet_name, "has_html", "notes"]
        for c, (name, w) in enumerate(zip(headers, [8, 28, 60, 60, 10, 30])):
            ws.write(0, c, name, hdr)
            ws.set_column(c, c, w)
        ws.freeze_panes(1, 3)
        for r, row in enumerate(rows, 1):
            vals = [
                row["id"],
                row["section"],
                row["english"],
                row[key],
                row["has_html"],
                "",
            ]
            for c, val in enumerate(vals):
                fmt = (
                    wrap_en
                    if c == 2
                    else (warn if c == 3 and not val else wrap)
                )
                ws.write(r, c, val, fmt)
            ws.set_row(r, min(120, 18 + row["char_en"] // 40 * 12))

    ws = wb.add_worksheet("import_long")
    for c, (name, w) in enumerate(
        zip(["id", "lang", "english", "text"], [8, 10, 60, 60])
    ):
        ws.write(0, c, name, hdr)
        ws.set_column(c, c, w)
    r = 1
    for row in rows:
        for lang, key in (
            ("ko", "ko"),
            ("ja", "ja"),
            ("zh-CN", "zh_CN"),
            ("zh-TW", "zh_TW"),
        ):
            ws.write(r, 0, row["id"], wrap)
            ws.write(r, 1, lang, wrap)
            ws.write(r, 2, row["english"], wrap_en)
            ws.write(r, 3, row[key], warn if not row[key] else wrap)
            r += 1

    wb.close()
    print(f"Wrote {path}  ({len(rows)} keys, {path.stat().st_size} bytes)")
    print("Sections:", Counter(r["section"] for r in rows).most_common(8))


# ---- Import (stdlib-only xlsx reader for sharedStrings + sheet XML) ----

NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}


def _col_row(cell_ref: str) -> tuple[int, int]:
    m = re.match(r"([A-Z]+)(\d+)$", cell_ref)
    if not m:
        raise ValueError(cell_ref)
    col = 0
    for ch in m.group(1):
        col = col * 26 + (ord(ch) - 64)
    return col - 1, int(m.group(2)) - 1


def _read_sheet(zf: zipfile.ZipFile, shared: list[str], sheet_path: str) -> list[list[str]]:
    root = ET.fromstring(zf.read(sheet_path))
    grid: dict[tuple[int, int], str] = {}
    max_r = max_c = 0
    for c in root.findall(".//m:sheetData/m:row/m:c", NS):
        ref = c.get("r")
        if not ref:
            continue
        col, row = _col_row(ref)
        max_r = max(max_r, row)
        max_c = max(max_c, col)
        t = c.get("t")
        v = c.find("m:v", NS)
        is_el = c.find("m:is/m:t", NS)
        if t == "s" and v is not None and v.text is not None:
            val = shared[int(v.text)]
        elif t == "inlineStr" and is_el is not None:
            val = "".join(is_el.itertext())
        elif v is not None and v.text is not None:
            val = v.text
        else:
            val = ""
        grid[(row, col)] = val
    table = []
    for r in range(max_r + 1):
        table.append([grid.get((r, c), "") for c in range(max_c + 1)])
    return table


def _load_workbook_tables(path: Path) -> dict[str, list[list[str]]]:
    with zipfile.ZipFile(path) as zf:
        shared: list[str] = []
        if "xl/sharedStrings.xml" in zf.namelist():
            sroot = ET.fromstring(zf.read("xl/sharedStrings.xml"))
            for si in sroot.findall("m:si", NS):
                shared.append("".join(si.itertext()))
        wb = ET.fromstring(zf.read("xl/workbook.xml"))
        rels = ET.fromstring(zf.read("xl/_rels/workbook.xml.rels"))
        rid_to_target = {
            rel.get("Id"): rel.get("Target")
            for rel in rels
        }
        tables: dict[str, list[list[str]]] = {}
        for sh in wb.findall("m:sheets/m:sheet", NS):
            name = sh.get("name")
            rid = sh.get(
                "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"
            )
            target = rid_to_target[rid]
            if not target.startswith("xl/"):
                target = "xl/" + target.lstrip("/")
            tables[name] = _read_sheet(zf, shared, target)
        return tables


def _py_quote(s: str) -> str:
    """Emit a double-quoted Python string literal."""
    out = (
        s.replace("\\", "\\\\")
        .replace('"', '\\"')
        .replace("\n", "\\n")
        .replace("\t", "\\t")
    )
    return f'"{out}"'


def write_strings_py(code: str, mapping: dict[str, str], section_of: dict[str, str]) -> None:
    path = LANG_FILES[code]
    # Preserve key order: section groups, then HTML appearance
    en_html = EN_HTML.read_text(encoding="utf-8")

    def sort_key(en: str) -> tuple:
        sec = section_of.get(en, "(unsectioned)")
        idx = en_html.find(en)
        return (sec, 10**9 if idx < 0 else idx, en)

    keys = sorted(mapping.keys(), key=sort_key)
    lines = [
        "# -*- coding: utf-8 -*-",
        f"# {LANG_LABELS[code]} strings for Psychart-HVAC-ASHRAE-Overview",
        "# Regenerated by export_psychart_i18n_xlsx.py — edit via the Excel workbook.",
        "STRINGS = {",
    ]
    prev_sec = None
    for en in keys:
        sec = section_of.get(en, "(unsectioned)")
        if sec != prev_sec:
            lines.append(f"  # --- {sec} ---")
            prev_sec = sec
        val = mapping[en]
        lines.append(f"  {_py_quote(en)}:")
        lines.append(f"    {_py_quote(val)},")
        lines.append("")
    lines.append("}")
    lines.append("")
    path.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {path.name}  ({len(mapping)} strings)")


def import_xlsx(path: Path) -> None:
    tables = _load_workbook_tables(path)
    if "translations" not in tables:
        raise SystemExit("Workbook missing 'translations' sheet")

    sheet = tables["translations"]
    header = [h.strip() for h in sheet[0]]
    need = ["english", "ko", "ja", "zh_CN", "zh_TW"]
    for col in need:
        if col not in header:
            raise SystemExit(f"translations sheet missing column {col!r}")
    idx = {name: header.index(name) for name in header}

    section_of: dict[str, str] = {}
    by_lang: dict[str, dict[str, str]] = {
        "ko": {},
        "ja": {},
        "zh_CN": {},
        "zh_TW": {},
    }

    for row in sheet[1:]:
        if not row or len(row) <= idx["english"]:
            continue
        en = row[idx["english"]].strip("\n")
        if not en:
            continue
        if "section" in idx and idx["section"] < len(row):
            section_of[en] = row[idx["section"]] or "(unsectioned)"
        for code, col in (
            ("ko", "ko"),
            ("ja", "ja"),
            ("zh_CN", "zh_CN"),
            ("zh_TW", "zh_TW"),
        ):
            if idx[col] < len(row):
                text = row[idx[col]]
                if text is not None and str(text).strip() != "":
                    by_lang[code][en] = str(text)

    # Overlay per-language sheets if they have newer notes-free text
    for sheet_name, code in SHEET_LANG.items():
        if sheet_name not in tables:
            continue
        t = tables[sheet_name]
        if not t:
            continue
        hdr = [h.strip() for h in t[0]]
        if "english" not in hdr or sheet_name not in hdr:
            continue
        ei, ti = hdr.index("english"), hdr.index(sheet_name)
        si = hdr.index("section") if "section" in hdr else None
        for row in t[1:]:
            if len(row) <= max(ei, ti):
                continue
            en = row[ei]
            text = row[ti]
            if not en:
                continue
            if si is not None and si < len(row) and row[si]:
                section_of.setdefault(en, row[si])
            if text is not None and str(text).strip() != "":
                by_lang[code][en] = str(text)

    for code, mapping in by_lang.items():
        if not mapping:
            print(f"WARN: no strings for {code}, skipping write")
            continue
        write_strings_py(code, mapping, section_of)

    print("Import done. Next: python3 build_psychart_i18n.py")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument(
        "--import",
        dest="import_path",
        metavar="XLSX",
        help="Import workbook back into psychart_i18n_*.py",
    )
    ap.add_argument(
        "-o",
        "--output",
        type=Path,
        default=OUT_DEFAULT,
        help=f"Export path (default: {OUT_DEFAULT})",
    )
    args = ap.parse_args()
    if args.import_path:
        import_xlsx(Path(args.import_path))
    else:
        export_xlsx(args.output)


if __name__ == "__main__":
    main()
