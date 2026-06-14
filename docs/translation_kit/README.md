# Red5 Studio — Translation Kit (v1, 2026-06-12)

> Goal: produce **19 missing translation files** across **4 target
> languages** (ja, ko, zh-CN, zh-TW) for the V1.9 / V2.0 / frontend
> documentation set, without spending LLM credits.
>
> Reader: a professional translator (human or paid service) who is
> comfortable with technical Markdown but needs guard-rails so the
> output round-trips cleanly into the product.

---

## 0. Files to translate

The 19 outputs needed, by source document:

| Source (`.md`) | Languages still missing | Size |
|---|---|---|
| `control_algorithms` | ja, ko, zh-CN, zh-TW | 52 KB |
| `control_strategy_insight` | ja, zh-CN, zh-TW *(ko already done — use as reference)* | 12 KB |
| `data_bridges_guide` | ja, ko, zh-CN, zh-TW | 7.1 KB |
| `data_exchange_diagram` | ja, ko, zh-CN, zh-TW | 8.6 KB |
| `opt_sa_insight` | ja, ko, zh-CN, zh-TW | 10 KB |

Sources live in **all three** of these folders (identical content,
keep all three in sync):

```
/app/archive/Red5-Studio-V1.9/docs/
/app/archive/Red5-Studio-V2.0/docs/
/app/frontend/public/docs/          (flat, no docs/ subfolder)
```

Naming convention is strict: `<doc>.<lang>.md`, e.g.
`control_algorithms.ja.md`. Do NOT include a region tag for
Japanese/Korean. Use the full `zh-CN` / `zh-TW` tag for Chinese
variants (Simplified / Traditional respectively).

---

## 1. Workflow for the translator

```
For each source document (e.g. control_algorithms.md):
  1. Copy the English file as a starting skeleton:
       cp control_algorithms.md  control_algorithms.<lang>.md
  2. Open the copy in your editor.
  3. Translate body prose in place.
  4. DO NOT touch anything listed in §3 "Frozen strings" below.
  5. Look up technical vocabulary in §2 "Glossary" — use the locked
     equivalent for that language, never invent your own.
  6. Run the validation checklist in §4 before declaring done.
  7. Commit only the new `<doc>.<lang>.md` file(s).  Do not modify
     the English source.
```

You can also use the helper script:

```
python3 /app/docs/translation_kit/make_skeleton.py \
    --doc control_algorithms --lang ja
# writes control_algorithms.ja.md to all three target folders
# (V1.9/docs, V2.0/docs, frontend/public/docs) seeded with the EN body
# and TRANSLATE-ME / FROZEN markers around every protected span.
```

---

## 2. Glossary (locked terminology)

These technical terms MUST be translated using the exact equivalents
below for consistency across all docs. If a term is not in this
list, use the most common professional HVAC/BMS terminology for your
target language.

| English | ja (日本語) | ko (한국어) | zh-CN (简体) | zh-TW (繁體) |
|---|---|---|---|---|
| AHU (Air Handling Unit) | エアハンドリングユニット (AHU) | 공조기 (AHU) | 空气处理机组 (AHU) | 空調機 (AHU) |
| VAV (Variable Air Volume) | 可変風量 (VAV) | 가변풍량 (VAV) | 变风量 (VAV) | 變風量 (VAV) |
| BMS (Building Management System) | ビル管理システム (BMS) | 빌딩관리시스템 (BMS) | 建筑管理系统 (BMS) | 建築管理系統 (BMS) |
| BACnet | BACnet | BACnet | BACnet | BACnet |
| Modbus | Modbus | Modbus | Modbus | Modbus |
| Setpoint / SP | 設定値 / SP | 설정값 / SP | 设定值 / SP | 設定值 / SP |
| Supply Air (SA) | 給気 (SA) | 급기 (SA) | 送风 (SA) | 送風 (SA) |
| Return Air (RA) | 還気 (RA) | 환기 (RA) | 回风 (RA) | 回風 (RA) |
| Outside Air (OA) | 外気 (OA) | 외기 (OA) | 新风 (OA) | 新風 (OA) |
| Exhaust Air (EA) | 排気 (EA) | 배기 (EA) | 排风 (EA) | 排風 (EA) |
| Mixed Air (MA) | 混合気 (MA) | 혼합기 (MA) | 混合风 (MA) | 混合風 (MA) |
| Comfort Zone | コンフォートゾーン | 쾌적영역 | 舒适区 | 舒適區 |
| Dewpoint | 露点 | 노점 | 露点 | 露點 |
| Humidity Ratio (W) | 絶対湿度 (W) | 절대습도 (W) | 含湿量 (W) | 含濕量 (W) |
| Relative Humidity (RH) | 相対湿度 (RH) | 상대습도 (RH) | 相对湿度 (RH) | 相對濕度 (RH) |
| Enthalpy (h) | エンタルピー (h) | 엔탈피 (h) | 焓 (h) | 焓 (h) |
| Damper | ダンパー | 댐퍼 | 风阀 | 風閥 |
| Coil (cooling/heating) | コイル | 코일 | 盘管 | 盤管 |
| Valve | バルブ | 밸브 | 阀门 | 閥門 |
| Sensor | センサー | 센서 | 传感器 | 感測器 |
| Actuator | アクチュエータ | 액추에이터 | 执行器 | 致動器 |
| PI / PID controller | PI / PID 制御 | PI / PID 제어 | PI / PID 控制 | PI / PID 控制 |
| Band (control band) | バンド | 밴드 | 控制带 | 控制帶 |
| Reset (control reset) | リセット | 리셋 | 复位 | 復位 |
| Optimal SA | 最適 SA | 최적 SA | 最优 SA | 最佳 SA |
| Diagnostic / Diagnosis | 診断 | 진단 | 诊断 | 診斷 |
| Telemetry | テレメトリ | 텔레메트리 | 遥测 | 遙測 |
| Dashboard | ダッシュボード | 대시보드 | 仪表板 | 儀表板 |
| Plug-in (software) | プラグイン | 플러그인 | 插件 | 外掛 |
| Webhook | Webhook | 웹훅 (Webhook) | Webhook | Webhook |
| Bridge (data bridge) | ブリッジ | 브리지 | 桥接 | 橋接 |
| Polling interval | ポーリング間隔 | 폴링 주기 | 轮询间隔 | 輪詢間隔 |
| Read / Write | 読出し / 書込み | 읽기 / 쓰기 | 读取 / 写入 | 讀取 / 寫入 |
| Allowlist / Denylist | 許可リスト / 拒否リスト | 허용목록 / 차단목록 | 白名单 / 黑名单 | 白名單 / 黑名單 |
| Heartbeat | ハートビート | 하트비트 | 心跳 | 心跳 |
| Object ID | オブジェクト ID | 객체 ID | 对象 ID | 物件 ID |
| Object Name | オブジェクト名 | 객체명 | 对象名 | 物件名稱 |
| CSV object (BACnet CharacterString) | CSV オブジェクト | CSV 객체 | CSV 对象 | CSV 物件 |
| ASHRAE G36 | ASHRAE G36 | ASHRAE G36 | ASHRAE G36 | ASHRAE G36 |
| ERV (Energy Recovery Ventilator) | 全熱交換器 (ERV) | 전열교환기 (ERV) | 全热交换器 (ERV) | 全熱交換器 (ERV) |
| Psychrometric (chart) | 空気線図 | 습공기 선도 | 焓湿图 | 焓濕圖 |
| Humidify / Dehumidify | 加湿 / 除湿 | 가습 / 제습 | 加湿 / 除湿 | 加濕 / 除濕 |
| Heating / Cooling demand | 暖房要求 / 冷房要求 | 난방요구 / 냉방요구 | 制热需求 / 制冷需求 | 制熱需求 / 製冷需求 |
| Lockout / Interlock | ロックアウト / インタロック | 락아웃 / 인터록 | 锁定 / 联锁 | 鎖定 / 連鎖 |
| Mode (control mode) | モード | 모드 | 模式 | 模式 |
| Schedule | スケジュール | 스케줄 | 时间表 | 時程表 |
| Alarm | アラーム | 알람 | 报警 | 警報 |
| Fault | 障害 | 고장 | 故障 | 故障 |

---

## 3. Frozen strings — NEVER translate these

The product reads these strings at runtime or as part of source-code
references. Translating them silently breaks the docs.

### 3.1 BACnet / point names (always uppercase, often with underscores)

Examples — leave these EXACTLY as in English:

```
SA   OA   RA   EA   MA   RH   W   T   h
SA_T   SA_T_SP   SA_W_SP   SA_RH   SA_F
OA_T   OA_RH   OA_W   OA_DAMPER   OA_DAMPER_SP   MIN_OA_POS
ZONE_TEMP   ZONE_W   ZONE_RH
CZ   IN_CZ   COMFORT
HCV_COOL   HCV_HEAT   HUM_VALVE   CC_VALVE   HEATING_VALVE
DAMPER_POS   HUM_MODE   HEATING_DEMAND   COOLING_DEMAND
SAFM   SAFP   AHUM   AHUSS   HCM   HM
BAND   BANDS   CONTROL_TAG
```

Rule of thumb: **any token that is ALL-CAPS, or CamelCase, or written
in `inline code`, is frozen.** Untranslate it on sight.

### 3.2 Pseudo-code keywords (uppercase English control flow)

These appear in algorithmic snippets — leave as-is:

```
IF   ELSE   AND   OR   NOT   RETURN   THEN
```

### 3.3 File paths, code blocks, links

- Any path beginning with `/` (e.g. `/root/data/configs/telemetry.json`)
- Any path containing `.py`, `.js`, `.html`, `.md`, `.json`
- Anything inside a fenced code block (```... ```) — translate ONLY
  the comments (`# ...` in Python, `// ...` in JS); leave code intact
- Anything inside `inline code`
- Markdown link targets: in `[label](url)`, translate only the
  `label`, never the `url`
- Image alt text: translate; image filename: do not

### 3.4 Numerical constants and units

- `0xCAFE`, `1883`, `5001`, `8001` etc. — frozen
- Units: `°C`, `°F`, `%RH`, `Pa`, `kPa`, `kW`, `m³/h`, `cfm`, `kJ/kg`,
  `g/kg`, `ppm` — frozen (do not localise to e.g. `킬로파스칼` —
  symbol stays in Latin)
- Math symbols: `≈`, `≥`, `≤`, `Σ`, `Δ`, `∂` — frozen

### 3.5 Brand and product names

- `Red5`, `Red5 Studio`, `Red5-Modbus`, `Emergent`, `Delta Controls`,
  `Daekyung`, `ELC`, `SCU`, `enteliWEB`, `DIBT`, `dibt`,
  `ASHRAE`, `BACnet`, `Modbus`, `MQTT`, `OPC UA`, `KNX`, `DALI`,
  `Casambi`, `BAC0`, `bacpypes` → all frozen, keep Latin spelling

---

## 4. Validation checklist (run BEFORE submitting)

For each translated file, verify:

```
[ ] File name matches  <doc>.<lang>.md  exactly
[ ] First-line heading is preserved (only the heading TEXT is
    translated; the leading `#` count stays the same)
[ ] Heading count matches the English source:
       grep -c '^#' control_algorithms.md
       grep -c '^#' control_algorithms.ja.md
    (Counts MUST be identical.)
[ ] Code-block count matches the English source:
       grep -c '^```' control_algorithms.md
       grep -c '^```' control_algorithms.ja.md
    (Counts MUST be identical, and they MUST be even.)
[ ] No frozen identifier from §3.1 was translated
       (Spot-check 5–10 random ALL-CAPS tokens.)
[ ] No file path, no URL, no link target was changed
[ ] No glossary term was translated differently from §2
[ ] File ends with a single trailing newline (no extra blank lines)
[ ] UTF-8, no BOM
```

A pass-all-checks file can be dropped into all three target folders.

---

## 5. After translation: where to put the file

Three identical copies must end up in:

```
/app/archive/Red5-Studio-V1.9/docs/<doc>.<lang>.md
/app/archive/Red5-Studio-V2.0/docs/<doc>.<lang>.md
/app/frontend/public/docs/<doc>.<lang>.md
```

Or use the helper:

```
python3 /app/docs/translation_kit/install_translation.py \
    /path/to/control_algorithms.ja.md
# → copies to all three locations and md5-verifies.
```

Then:

```
cd /app/archive/Red5-Studio-V1.9
python3 -m pytest tests/  -q
# Should remain at 97 passed (or however many we end with).
# The bundle integrity test will fail if a translation accidentally
# breaks markdown.
```

---

## 6. Contact / questions

If the translator hits an ambiguous term that's not in §2:

- Ja/Ko/zh-CN/zh-TW HVAC professional terminology (JEMA / KSHA / GB
  national standards) takes precedence over machine translation.
- For BMS jargon specifically: Delta Controls' enteliWEB Korean and
  Chinese UI string tables are a useful reference.
- When in doubt, transliterate in parentheses with the English term
  retained, e.g. `バンド (Band)` — better to be redundant than wrong.

---

*Last updated: 2026-06-12*
