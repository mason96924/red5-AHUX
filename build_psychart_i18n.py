#!/usr/bin/env python3
"""Build localized Psychart-HVAC-ASHRAE-Overview HTML decks.

Source: Psychart-HVAC-ASHRAE-Overview.html (English)
Outputs:
  Psychart-HVAC-ASHRAE-Overview.ja.html
  Psychart-HVAC-ASHRAE-Overview.ko.html
  Psychart-HVAC-ASHRAE-Overview.zh-CN.html
  Psychart-HVAC-ASHRAE-Overview.zh-TW.html

Run:  python3 build_psychart_i18n.py
"""
from __future__ import annotations

import importlib.util
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "Psychart-HVAC-ASHRAE-Overview.html"

LANGS = {
    "ja": ("psychart_i18n_ja.py", "ja"),
    "ko": ("psychart_i18n_ko.py", "ko"),
    "zh-CN": ("psychart_i18n_zh_CN.py", "zh-CN"),
    "zh-TW": ("psychart_i18n_zh_TW.py", "zh-TW"),
}

CJK_FONT = (
    '-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","PingFang TC",'
    '"Hiragino Sans","Hiragino Kaku Gothic ProN","Noto Sans CJK SC",'
    '"Noto Sans CJK TC","Noto Sans CJK JP","Noto Sans CJK KR","Microsoft YaHei",'
    '"Malgun Gothic",Helvetica,Arial,sans-serif'
)


def load_strings(path: Path) -> dict[str, str]:
    spec = importlib.util.spec_from_file_location(path.stem, path)
    mod = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(mod)
    return dict(mod.STRINGS)


def apply(html: str, strings: dict[str, str]) -> str:
    # Longest keys first so short labels cannot corrupt longer phrases.
    for en in sorted(strings, key=len, reverse=True):
        ja = strings[en]
        if en == ja:
            continue
        if en not in html:
            raise SystemExit(f"Missing key in HTML:\n  {en!r}")
        html = html.replace(en, ja)
    return html


def localize(html: str, lang_attr: str) -> str:
    html = re.sub(r'<html lang="en">', f'<html lang="{lang_attr}">', html, count=1)
    # Prefer CJK-capable font stack for non-English decks.
    html = html.replace(
        'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
        f"font-family:{CJK_FONT}",
        1,
    )
    return html


def residual_english(html: str) -> list[str]:
    """Heuristic leftover English phrases (not exhaustive)."""
    freeze = {
        "ASHRAE", "Guideline", "BMS", "HVAC", "AHU", "AHUs", "ERV", "HRV",
        "DX", "VAV", "NIST", "APAR", "FDD", "SAT", "OA", "RA", "MA", "SA",
        "G36", "PNNL", "Berkeley", "Lab", "Spawn", "EnergyPlus", "New",
        "Buildings", "Institute", "Taylor", "Cheng", "RH", "kJ", "kg", "kW",
        "Chicago", "medium", "office", "large-office", "emulator", "Smart",
        "Energy", "Analytics", "Campaign",
    }
    texts = re.findall(r">([^<]{8,})<", html)
    leftovers = []
    for t in texts:
        t = t.strip()
        if not t or "&nbsp;" in t and len(re.sub(r"[^A-Za-z]", "", t)) < 8:
            continue
        letters = re.findall(r"[A-Za-z]{4,}", t)
        if not letters:
            continue
        # Skip if mostly frozen tokens / SVG labels
        meaningful = [w for w in letters if w not in freeze and w.lower() not in {
            "span", "style", "color", "var", "accent", "amber", "green", "ink",
            "background", "border", "fill", "stroke", "text", "anchor", "middle",
            "weight", "size", "points", "polygon", "polyline", "circle", "line",
        }]
        if meaningful and re.search(r"\b(the|and|with|from|that|this|are|for)\b", t, re.I):
            leftovers.append(t[:140])
    return leftovers[:40]


def main() -> None:
    src = SRC.read_text(encoding="utf-8")
    for code, (mod_name, lang_attr) in LANGS.items():
        strings = load_strings(ROOT / mod_name)
        out_html = localize(apply(src, strings), lang_attr)
        out = ROOT / f"Psychart-HVAC-ASHRAE-Overview.{code}.html"
        out.write_text(out_html, encoding="utf-8")
        left = residual_english(out_html)
        print(f"Wrote {out.name}  ({len(strings)} strings, "
              f"~{len(left)} residual English-ish snippets)")
        for snip in left[:8]:
            print(f"   · {snip}")


if __name__ == "__main__":
    main()
