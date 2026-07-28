"""
Translate control_algorithms.md into ko, ja, zh-CN, zh-TW using Claude via the
Emergent LLM key.  Chunk by H2 sections so each prompt stays well under context
limits and the model has full visibility of each topic block.  HVAC terminology
constraints + verbatim preservation of code/math are enforced via the system
prompt.
"""
import asyncio
import os
import re
import sys
from pathlib import Path

from emergentintegrations.llm.chat import LlmChat, UserMessage

EMERGENT_LLM_KEY = "sk-emergent-f66Ea98955e77D07b8"
SOURCE = Path("/app/frontend/public/control_algorithms.md")

# Output to all three locations (V1.9 archive, V2.0 archive, live frontend)
TARGETS = [
    Path("/app/frontend/public"),
    Path("/app/archive/Red5-AHU-V1.9"),
    Path("/app/archive/Red5-AHU-V2.0"),
]

LANGS = [
    ("ko",    "Korean",              "한국어",   "공조기 = AHU, 변풍량 = VAV, 전열교환기 = ERV, 엔탈피 = enthalpy, 노점 = dew point"),
    ("ja",    "Japanese",            "日本語",   "空調機 = AHU, 変風量装置 = VAV, 全熱交換器 = ERV, エンタルピー = enthalpy, 露点 = dew point"),
    ("zh-CN", "Simplified Chinese",  "简体中文", "空气处理机组 = AHU, 变风量装置 = VAV, 全热交换器 = ERV, 焓 = enthalpy, 露点 = dew point"),
    ("zh-TW", "Traditional Chinese", "繁體中文", "空氣處理機組 = AHU, 變風量裝置 = VAV, 全熱交換器 = ERV, 焓 = enthalpy, 露點 = dew point"),
]

SYSTEM_PROMPT = """You are a senior HVAC engineering translator.  You translate technical
documentation from English into the target Asian language with the following
HARD RULES:

1. PRESERVE EXACTLY (do not translate, do not reformat):
   - All Markdown structure (#, ##, ###, lists, tables, --- dividers, blockquotes)
   - All code blocks (```...```), inline code (`...`), and code variable names
   - All formulas and math notation
   - All units (°C, °F, kW, m³/h, Pa, %RH, g/kg, kJ/kg, etc.)
   - All acronyms (AHU, VAV, ERV, SA, OA, RA, EA, RH, DB, WB, CZ, etc.) -- LEAVE in English
   - All parameter / function / setting names that look like code identifiers
   - All numeric values, ranges, and tolerances

2. TRANSLATE the surrounding prose, headings, comments, and explanatory text
   into the target language using established HVAC industry terminology.

3. TERMINOLOGY GLOSSARY (use these standard renderings):
   {glossary}

4. TONE: technical, formal, engineering-document register.  Match the source
   document's authoritative voice -- this is a control-systems reference,
   not marketing copy.

5. Do NOT add commentary, footnotes, or translator notes WITHIN the body.
   Output ONLY the translated markdown content -- no preamble, no closing
   remarks, no "Here is the translation:" header.

6. If a sentence has both translated prose AND embedded code/units, weave them
   naturally -- e.g. "쉘 명령(예: `systemctl restart`)을 실행합니다." not
   "쉘 명령 ( systemctl restart ) 을 실행합니다."

Target language: {language_full} ({language_native})."""


def split_into_chunks(text: str, max_chars: int = 18000):
    """Split markdown by H2 boundaries, packing chunks up to max_chars."""
    # H2 boundary regex; keep the H2 line WITH the section that follows
    sections = re.split(r"(?m)(?=^## )", text)
    chunks = []
    cur = ""
    for sec in sections:
        if len(cur) + len(sec) > max_chars and cur:
            chunks.append(cur)
            cur = sec
        else:
            cur += sec
    if cur:
        chunks.append(cur)
    return chunks


async def translate_one(language_code: str, language_full: str, language_native: str, glossary: str, source_text: str) -> str:
    chunks = split_into_chunks(source_text)
    print(f"  [{language_code}] {len(chunks)} chunk(s) to translate")
    translated_parts = []
    for idx, chunk in enumerate(chunks, 1):
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"translate-{language_code}-{idx}",
            system_message=SYSTEM_PROMPT.format(
                language_full=language_full,
                language_native=language_native,
                glossary=glossary,
            ),
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")

        msg = UserMessage(text=(
            "Translate the following markdown section into "
            f"{language_full}.  Output ONLY the translated markdown -- "
            "no preamble or extra commentary.\n\n"
            "<<<MARKDOWN_BEGIN>>>\n"
            + chunk
            + "\n<<<MARKDOWN_END>>>"
        ))
        out = await chat.send_message(msg)
        print(f"  [{language_code}] chunk {idx}/{len(chunks)} done ({len(out)} chars)")
        # Strip any accidental sentinel echoes
        out = out.replace("<<<MARKDOWN_BEGIN>>>", "").replace("<<<MARKDOWN_END>>>", "").strip()
        translated_parts.append(out)
    return "\n\n".join(translated_parts)


async def main():
    source_text = SOURCE.read_text(encoding="utf-8")
    print(f"Source: {SOURCE} ({len(source_text)} chars, {len(source_text.splitlines())} lines)")

    for code, full, native, glossary in LANGS:
        print(f"\n=== Translating to {full} ({code}) ===")
        translated = await translate_one(code, full, native, glossary, source_text)

        footer = (
            "\n\n---\n\n"
            f"_Translation: machine-assisted ({full}), pending engineering review._\n"
        )
        body = translated + footer

        out_name = f"control_algorithms.{code}.md"
        for target_dir in TARGETS:
            out_path = target_dir / out_name
            out_path.write_text(body, encoding="utf-8")
            print(f"  -> wrote {out_path} ({len(body)} chars)")


if __name__ == "__main__":
    asyncio.run(main())
