# Red5 `dyn-reset` ↔ ASHRAE Guideline 36 Trim-and-Respond 交叉對照表

> 🤖 **翻譯基線說明**: 本繁體中文檔案為英文原本(`g36_reset.md`)的機器翻譯基線。
> 釋出或交付外部顧問前，建議由 HVAC 領域專業譯者審校。
> 表格、程式碼、標準引用保留原文。

**目標讀者**: 已瞭解 Red5 `dyn-reset` 旋鈕集(參見 `band_guide.md`)、並需將其對映到 ASHRAE Guideline 36 合規執行序列(SOO)的 HVAC 控制工程師與除錯人員。通常在業主交付文件中指定 G36 時需要。

**摘要 (TL;DR)**: `dyn-reset` **受 G36 啟發**，但開箱即用並 **非完全 G36 合規**。本文準確指出為彌合差距需要新增、變更或記錄的內容，並按可直接列印交予第三方除錯代理（CxA）進行核查的方式編排。

---

## 1 · 單段背景

ASHRAE Guideline 36 ("High-Performance Sequences of Operation for HVAC Systems"，現行版本: **Guideline 36-2021**)將三十多年的需求控制 VAV 最佳實踐編纂為單一的規定性序列庫。其核心思想 — **在仍能滿足每個區的前提下，以最高的送風溫度(SAT)和最低的風管靜壓(SP)執行 AHU** — 與 Red5 `dyn-reset` 的編寫原則相同。差異在 **計數方法**: Red5 對每個區相對設定點偏差的 **幅度(magnitude)** 作出反應；G36 對偏差超過每環路忽略閾值的 **區數(count)** 作出反應("Trim & Respond" 方法，以下簡稱 T&R)。當單個失常區域出現時，T&R 在數學上更穩定，且是 G36 審計將核對的演算法。

---

## 2 · 引數交叉對照

下面是 Red5 `dyn-reset` 旋鈕與 G36 T&R 引數的雙向對映。每個旋鈕都有 G36 等價物，有時一對一，有時附帶注意事項。G36 預設值取自 **Guideline 36-2021 Table 5.1.14.3** (製冷 SAT 復位)與 **§5.1.14.4** (風管靜壓復位)。

### 2.1 送風溫度(SAT)製冷復位

| Red5 旋鈕 (`band_guide.md`) | G36 T&R 引數 | G36 預設值 | 說明 |
|---|---|---|---|
| `sat_min_c` | **SPmin** (最低 SAT) | 12.8 °C / 55 °F | 含義相同。潔淨室 / RH 驅動設計可允許更低。 |
| `sat_max_c` | **SPmax** (最高 SAT) | 18.3 °C / 65 °F | 含義相同。僅在溼球/除溼核查後才上調。 |
| `sat_init_c` | **SP0** (模式變更後初始復位值) | SPmax (18.3 °C) | G36 以寬容(暖 SAT)開始，按需求向下修整。Red5 目前從 `sat_init_c` 開始；為對等，應改名 `sat_initial_c` 並設為 `sat_max_c`。 |
| **— (Red5 暫無等價物)** | **I** (忽略請求數) | 2 | 響應前應忽略的"製冷請求"數。**作為 `sat_ignored_requests` 加入 Red5。** |
| **— (Red5 暫無等價物)** | **T** (時間步長 / 取樣週期) | 5 分鐘 | T&R 迴圈週期。Red5 復位迴圈每 30 秒執行 — 需要單獨的較慢聚合器。 |
| **— (Red5 暫無等價物)** | **Td** (啟用後初始延遲) | 10 分鐘 | "在計數請求前等待 AHU 穩定"。**作為 `sat_initial_delay_s` 加入。** |
| `decay_step_c` | **SPtrim** (每 T&R 週期修整量) | +0.1 °C/週期 | 當無響應到來，將 SAT *修整*(變暖) 此量。**Red5 的衰減是指數型；G36 是線性。** 參見 §2.4。 |
| **— (Red5 暫無等價物)** | **SPres** (每請求響應量) | −0.2 °C/請求 (超過 I 的部分) | 當 `requests > I`，按 `SPres × (requests − I)` *響應*(變冷)，受 SPres-max 限制。**作為 `sat_response_step_c` 與 `sat_response_max_c` 加入。** |
| `hysteresis_c` | **(G36 無直接等價物)** | — | G36 無滯回區間；以 T(5 分鐘取樣)防止震盪。設 `hysteresis_c = 0`、`T = 5 min` 即為 G36 合規。 |

### 2.2 風管靜壓(SP)復位 — 結構相同

| Red5 旋鈕 | G36 T&R 引數 | G36 預設值 |
|---|---|---|
| `sp_min_pa` | **SPmin** | 75 Pa (0.3 in.w.g.) |
| `sp_max_pa` | **SPmax** | 374 Pa (1.5 in.w.g.) |
| `sp_init_pa` | **SP0** | SPmin (起步低，向上響應) |
| — | **I** (忽略請求) | 2 |
| — | **T** (時間步長) | 2 分鐘 |
| — | **Td** (初始延遲) | 10 分鐘 |
| `sp_trim_pa` | **SPtrim** | −12.5 Pa/週期 (無請求時下調) |
| — | **SPres** | +37 Pa/請求 (超過 I 的部分) |
| — | **SPres-max** | +93 Pa/週期 (積極響應上限) |

> 注意 **符號翻轉**: SAT 向 **上**(更暖、更高效)修整，向 **下**(更冷、滿足更多區)響應。SP 向 **下**(低壓、少風機功耗)修整，向 **上**(高壓、更多風閥開啟)響應。修整/響應的 *方向* 正是使兩個復位環路成為節能閉環的關鍵。

### 2.3 新風(OA)復位

G36 §5.1.6 要求獨立的 **節能器高限**及 **最低 OA 跟蹤**(佔用時基於 CO2 的 DCV)。Red5 暫無等價物 — 目前 OA 佔比由波段引擎的焓比較計算。為達合規，需新增:

| Red5 引數(需新增) | G36 參考 | 預設值 |
|---|---|---|
| `econ_high_limit_oat_c` | §5.1.6.2 (固定乾球溫度，氣候區相關) | 23.9 °C (Zone 1, 溼熱); 22.2 °C (Zone 5–8) |
| `econ_high_limit_enthalpy_kjkg` | §5.1.6.2 (固定焓，雙設定選項) | 65 kJ/kg 幹空氣 |
| `oa_min_cfm_per_person` | §5.1.6.3 | 按 ASHRAE 62.1 Table 6-1 (≈ 4.7 L/s/人 辦公；7.6 L/s/人 教室) |
| `dcv_co2_setpoint_ppm` | §5.1.6.3.b | 1000 ppm；區 CO2 > 設定點時響應 |

### 2.4 Trim & Respond 演算法 (虛擬碼)

**只需加入下面這一個函式**，即可讓 `dyn-reset` 切換為 G36 T&R。放在 `app.py` 的 `_reset_loop` 旁(V1.9) 或 `band_engine.py` 內(V2.0)。

```python
def trim_and_respond(now_setpoint, requests, params):
    """
    G36-2021 §5.1.14 Trim & Respond.

    Args:
      now_setpoint : 當前 SAT (或 SP) 值, °C (或 Pa)
      requests     : int — 請求更多製冷的區數
                     (SAT 環路: 至少連續 2 個取樣冷卻環路 > 95% 的區
                     — 參見 G36 §5.16.5)
      params       : dict, 鍵: sp_min, sp_max, ignored, sp_trim,
                     sp_res, sp_res_max  (符號按上面 §2.1/§2.2)

    Returns:
      鉗制到 [sp_min, sp_max] 的下一設定點
    """
    if requests <= params['ignored']:
        # 修整: 朝節能側回收
        proposed = now_setpoint + params['sp_trim']
    else:
        # 響應: 每個超額請求按 sp_res 拉動設定點,
        # 每週期受 sp_res_max 限制 → 一個失控區無法拖累整臺 AHU
        excess = requests - params['ignored']
        delta  = params['sp_res'] * excess
        # 按絕對值限制, 保留 sp_res 符號
        if abs(delta) > abs(params['sp_res_max']):
            delta = params['sp_res_max']
        proposed = now_setpoint + delta
    return max(params['sp_min'], min(params['sp_max'], proposed))
```

每個 T 呼叫一次(SAT 取 5 分鐘、SP 取 2 分鐘)，輸入來自 VAV 輪詢環路的最新請求數。用它分別替換 `_reset_loop` 中 SAT 與 SP 的指數衰減。

### 2.5 "製冷請求"定義 (Red5 需新增程式碼部分)

當連續兩個取樣(間隔 ≥ 2 分鐘)中 **任一** 條件成立時, 區被計為 **一個製冷請求** (G36 §5.16.5):

1. 區溫度 > 區製冷設定點 + 1.7 °C (3 °F) 且 區已 ≥ 2 個取樣請求製冷。
2. 區送風風閥全開(≥ 95%) 且 區仍 > 製冷設定點 + 0.6 °C (1 °F)。
3. (僅壓力環路) 區風閥 > 95% 開 且 風量 < 設定值的 90%。

Red5 目前在波段引擎中暴露每區偏差但不聚合為離散請求計數。**新增 `compute_cooling_requests(zones, dt)` 函式返回 `int`**, 並餵給 `trim_and_respond()`。

---

## 3 · G36 的 8 個執行模式 (Red5 暫無的顯式部分)

Red5 當前以 Givoni 波段引導的連續控制方式執行。G36 將執行劃分為帶硬性轉換條件的 **離散模式**。這是最大的差距。

| # | 模式 | 觸發條件 | 典型設定點 |
|---|---|---|---|
| 1 | **佔用 (Occupied)** | 排程 + 任一區有佔用或溫度偏差 | 按區排程設定點 |
| 2 | **預熱 (Warm-up)** | OAT < 供熱設定點 − 2.8 °C 且 任一區 < 供熱設定點 − 0.6 °C，預定啟動前 | 僅供熱、新風全閉、風機 ON |
| 3 | **預冷 (Cool-down)** | OAT > 製冷設定點 + 2.8 °C 且 任一區 > 製冷設定點 + 0.6 °C，預定啟動前 | 僅製冷、新風全閉、風機 ON |
| 4 | **供熱回設 (Setback heating)** | 非佔用期間任一區 < 供熱回設(通常 15.6 °C / 60 °F) | 僅供熱, 最低風量 |
| 5 | **製冷回設 (Setup cooling)** | 非佔用期間任一區 > 製冷回設(通常 29.4 °C / 85 °F) | 僅製冷, 最低風量 |
| 6 | **非佔用 (Unoccupied)** | 排程非佔用 且 未觸發回設 | 風機 OFF, 風閥關閉 |
| 7 | **防凍 (Freeze-protection)** | OAT < 1.7 °C 且 任一區 < 4.4 °C | 供熱維持 4.4 °C, 新風全閉 |
| 8 | **煙感/停機 (Smoke / shutdown)** | 火警輸入觸發 | 風機 OFF (或按消防序列), 風閥關閉 |

**轉換規則** (G36 §5.1.4.4): 進入模式僅當 **所有觸發條件** 持續 ≥ 10 分鐘；退出僅當 **無任何觸發條件** 持續 ≥ 10 分鐘。防止啟動時在預冷↔佔用之間震盪。

Red5 增補路徑: 新建 `mode_engine.py` (V2.0) / `_mode_loop` (V1.9) 擁有 8 狀態機, 並對現有波段引擎的復位輸出加門控。

---

## 4 · G36 強制點位列表

G36 審計會逐項確認下表所有點位的 **讀取或寫入** 能力。Red5 V1.9 透過 BACnet 已暴露大多數; 除錯期間請將 `bacnet_map.json` 與本表對照。

### 4.1 每臺 AHU (約 40 個強制點)

| # | 點位 | 方向 | 型別 |
|---|---|---|---|
| 1 | 送風溫度 (SAT) | AI | °C |
| 2 | 迴風溫度 (RAT) | AI | °C |
| 3 | 新風溫度 (OAT) | AI | °C |
| 4 | 混合風溫度 (MAT) | AI | °C |
| 5 | 送風 RH | AI | % |
| 6 | 迴風 RH | AI | % |
| 7 | 新風 RH | AI | % |
| 8 | 送風機轉速反饋 | AI | % |
| 9 | 送風機 VFD 指令 | AO | % |
| 10 | 風管靜壓 | AI | Pa |
| 11 | 風管靜壓設定點 | AV | Pa |
| 12 | SAT 設定點 (T&R 後) | AV | °C |
| 13 | OA 風閥位置反饋 | AI | % |
| 14 | OA 風閥指令 | AO | % |
| 15 | RA 風閥指令 | AO | % |
| 16 | 加熱盤管閥位 | AO | % |
| 17 | 冷卻盤管閥位 | AO | % |
| 18 | 過濾器壓差 | AI | Pa |
| 19 | 煙感器 | BI | — |
| 20 | 防凍開關 (Freeze-stat) | BI | — |
| 21 | 送風機啟停指令 | BO | — |
| 22 | 送風機狀態 (電流感測器) | BI | — |
| 23 | 節能器使能 | BO | — |
| 24 | 執行模式 (上述 1–8) | MV | enum |
| 25 | 製冷請求數 (計算值) | AV | count |
| 26 | 供熱請求數 (計算值) | AV | count |
| 27 | 壓力請求數 (計算值) | AV | count |
| 28 | 報警: SAT 偏差 | BV | — |
| 29 | 報警: SP 偏差 | BV | — |
| 30 | 報警: 過濾器堵塞 | BV | — |
| 31–40 | 盤管狀態 / 報警 / 最低 OA 風量跟蹤 | 混合 | — |

### 4.2 每個 VAV 箱 (約 20 個強制點)

| # | 點位 | 方向 |
|---|---|---|
| 1 | 區溫度 | AI |
| 2 | 區製冷設定點 | AV |
| 3 | 區供熱設定點 | AV |
| 4 | 區風量 | AI |
| 5 | 區風量設定點 | AV |
| 6 | 區風閥位置 | AI |
| 7 | 區風閥指令 | AO |
| 8 | 區再熱閥 | AO |
| 9 | 區佔用感測器 | BI |
| 10 | 區 CO2 感測器 (DCV 配置的箱) | AI |
| 11 | 區製冷環輸出 | AV |
| 12 | 區供熱環輸出 | AV |
| 13 | 製冷請求標誌 | BV |
| 14 | 供熱請求標誌 | BV |
| 15 | 壓力請求標誌 | BV |
| 16–20 | 區報警 / 最低風量覆蓋 / 排程佔用 | 混合 |

---

## 5 · 除錯趨勢 (CT 1–9)

G36 §6.2 要求 **至少 9 條 30 天趨勢記錄**, 取樣間隔 ≤ 1 分鐘。這些是審計期間證明序列按書面執行的主要證據。Red5 V1.9 採集器已記錄大部分; 與 `collector/config.json` 對照。

| CT # | 趨勢 | 用途 |
|---|---|---|
| **CT-1** | SAT、SAT 設定點、所有區溫度 | 證明 SAT 復位響應區需求 |
| **CT-2** | SP、SP 設定點、所有風閥位置 | 證明 SP 復位響應風閥需求 |
| **CT-3** | OAT、MAT、RAT、OA 風閥指令+位置 | 證明節能器跟隨焓比 |
| **CT-4** | 加熱盤管閥位、冷卻盤管閥位 | 證明無同時加熱與製冷 |
| **CT-5** | 製冷/供熱/壓力請求數 | 證明 T&R 計數正確 |
| **CT-6** | 執行模式 enum | 證明模式轉換穩定 (無震盪) |
| **CT-7** | 各區風量、風量設定點、CO2 (DCV 區) | 證明 DCV 在需要時覆蓋最低風量 |
| **CT-8** | 送風機 VFD 指令、狀態、電流 | 證明風機跟隨指令且不對關閉的風閥施壓 |
| **CT-9** | 全部報警 BV | 證明無虛警 |

Red5 採集器已支援 1 分鐘解析度。在 `collector/trends.json` 中啟用趨勢, 除錯視窗期連續執行 30 天。

---

## 6 · 報警等級矩陣 (G36 §5.1.16)

上面點位列表中的所有報警必須按 A / B / C 分類並附響應時間。Red5 已有報警但暫無等級欄位 — 在每條報警定義中加入 `alarm_class: 'A'|'B'|'C'`。

| 等級 | 示例 | 通知 | 響應時間 |
|---|---|---|---|
| **A** (生命安全) | 防凍、煙感、送風機故障、防凍模式生效 | 即時派工, 現場可聽 | < 10 分鐘 |
| **B** (裝置) | SAT/SP 偏差 > 30 分鐘、過濾器堵塞、閥位強制、感測器故障 | BMS 通知, 自動開工單 | < 4 小時 |
| **C** (資訊) | 排程覆蓋、手動設定點調整、模式轉換 | 僅日誌 | < 24 小時 |

---

## 7 · 通往 G36 合規之路 — 差距分析

對你當前的安裝執行此清單:

| # | G36 要求 | Red5 狀態 | 行動 |
|---|---|---|---|
| 1 | Trim-and-Respond SAT 復位 | **缺口** — Red5 使用幅度型指數衰減 | 實現 §2.4 `trim_and_respond()`; 替換 `_reset_loop` SAT 分支 |
| 2 | Trim-and-Respond SP 復位 | **缺口** — 同上 | 用 SP 引數字典呼叫同一 `trim_and_respond()` |
| 3 | 製冷/供熱/壓力請求計數器 | **缺口** — Red5 有區偏差但無聚合 | 按 §2.5 在 VAV 輪詢中加入 `compute_*_requests()` |
| 4 | 8 個執行模式 + 轉換 | **缺口** — Red5 是連續控制 | 新建 `mode_engine.py` (V2.0) / `_mode_loop` (V1.9); 上面 §3 |
| 5 | 固定幹球或焓高限節能器 | **部分** — Red5 用焓比較, 需明確高限 | 按 §2.3 加入 `econ_high_limit_oat_c`、`econ_high_limit_enthalpy_kjkg` |
| 6 | 按 ASHRAE 62.1 的最低 OA / DCV | **缺口** — Red5 有 OA 佔比但無人均最低跟蹤 | 在 VAV 輪詢加入 CO2 輸入 + DCV 覆蓋邏輯 |
| 7 | 每臺 AHU 40 個強制點 | **基本 OK** — Red5 V1.9 透過 BACnet 暴露約 35 個 | 與 §4.1 對照 `bacnet_map.json`; 補齊缺失約 5 個 (多為計算 AV 請求計數) |
| 8 | 每個 VAV 20 個強制點 | **基本 OK** — 同上 | 檢查; 加入請求標誌 BV |
| 9 | 9 條除錯趨勢 @ 1 分鐘 | **OK** — Red5 採集器已支援 | 在 `collector/trends.json` 啟用; 執行 30 天 |
| 10 | 報警 A/B/C 等級標記 | **缺口** — Red5 有報警但未分類 | 按 §6 加入 `alarm_class` 欄位 |
| 11 | 防凍自動模式 | **部分** — 防凍開關輸入已接但未強制模式 | 與 #4 模式引擎對接 |
| 12 | 無同時加熱與製冷 | **OK** — Red5 波段引擎已阻止 | 透過 CT-4 趨勢驗證 |

**填平 12 項缺口的預計工作量**: V2.0 約 3–4 開發周, 加上代表性季節 1 周的 CT 趨勢收集。V1.9 因每個新點位需要控制器燒錄, 在 BACnet 點位擴充套件上再加約 2 周。

---

## 8 · "我只是想在規格表上 *寫* G36" 的情況

若目標是營銷對等(並非真實合規)，最小可信實現:

1. **§2.4 trim_and_respond()** — 替換衰減式復位 (≈ 1 天)。
2. **§2.5 製冷請求計數器** — 按區聚合 (≈ 1 天)。
3. **§3 模式引擎** — 4 個模式子集(佔用 / 非佔用 / 預熱 / 預冷)即可覆蓋 90% 的審計核查 (≈ 3 天)。
4. **§5 CT-1, CT-2, CT-5** — 3 條趨勢, 各 30 天 (無需開發, 僅啟用)。
5. **§7 第 7 行** — 核對 BACnet 點位列表。

約 1 開發周即可達到 **"G36 覺察 (G36-aware)"** — 足以滿足通用規格但未達到 ASHRAE 審計。若業主派遣第三方除錯代理(如 Engineering Economics、kW Engineering、P2S 等公司的 CxA)，**他們會** 執行完整的 §3–§7 清單, 部分實現會被點出。

---

## 9 · 參考資料

- ASHRAE Guideline 36-2021, "High-Performance Sequences of Operation for HVAC Systems"
- ANSI/ASHRAE Standard 62.1-2022, "Ventilation for Acceptable Indoor Air Quality"
- ANSI/ASHRAE Standard 90.1-2022, "Energy Standard for Buildings Except Low-Rise Residential Buildings" §6.5.3.1 (DCV)
- Hydeman M., Stein J., et al. (2003), *Advanced Variable Air Volume System Design Guide*, Pacific Gas & Electric — trim-and-respond 演算法的原始出處
- LBNL FlexLab G36 參考實現: <https://github.com/lbl-srg/ctrl-flow-dev> (開源 Modelica 參考)
- Red5 `band_guide.md` — 當前 `dyn-reset` 旋鈕文件 (本文的姊妹檔案)

---

*本文與控制器上的 `band_guide.md` 配對。任何一方更新都應同步到另一方。*
*最後更新: 2026-05-24 — 與儀表盤 `★ 預設位置固定` 功能一同釋出的首版 G36 交叉對照表。*
