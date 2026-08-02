# ASHRAE Guideline 36 — 參考

> *High-Performance Sequences of Operation for HVAC Systems*（HVAC 系統之高性能運轉序列）
> ANSI/ASHRAE Guideline 36（現行版本：G36-2021，附錄 a 於 2023 發布）

---

## TL;DR

Guideline 36 是**HVAC 控制邏輯的操作手冊**。它明確告訴你 AHU、VAV、冰水機與鍋爐在一天中的每一刻應該做什麼——何時開啟節能器、何時覆寫送風溫度設定點、何時切換占用模式、何時發出警報。

大多數現代 BAS 承包商（Delta Controls、Trane、Distech、JCI、Honeywell、Siemens）出廠即提供「符合 G36」的序列。Red5 Studio 的工作是：(a) 告訴你真實世界的控制器是否確實遵循這些序列，以及 (b) 在現場實況需要時讓你覆寫它們。

儀表板中的 G36 時間軸條（`#g36-timeline-strip`）會將你最近 4 小時／24 小時的真實遙測對映到七個 G36 模式狀態，讓你一眼看出偏移。

---

## 1. 七種 G36 運轉模式

G36 §5.1 定義了每一台 AHU 都必須回報的七種互斥模式：

| # | 模式 | 觸發條件 | Red5 的顯示 |
|---|---|---|---|
| 1 | **Occupied（占用）**      | 排程時段內、占用感測器開啟 | 綠色 |
| 2 | **Warm-up（暖機）**       | 占用前，分區 T 低於晨間回設 | 橙色 |
| 3 | **Cool-down（降溫）**     | 占用前，分區 T 高於夜間回設 | 淺藍 |
| 4 | **Setback（回設）**       | 非占用，T 超出窄帶 | 灰色 |
| 5 | **Setup（回升）**         | 非占用，T 無偏離 | 淡灰 |
| 6 | **Unoccupied（非占用）**  | 非時段、風機關閉 | 深石板色 |
| 7 | **Freeze protect（防凍）**| 盤管溫度 < 4 °C | 紅色 |

這些直接對映到 G36 時間軸條的圖例。當排程顯示「UNOCCUPIED」但某台 AHU 卻顯示綠色「OCCUPIED」，正是 Red5 抓出風門卡死／VFD 故障／覆寫鎖失控的第一大線索。

---

## 2. 設定點重置（Trim & Respond — T&R）

G36 §5.1.14 將**修整與回應（trim-and-respond）**定義為重置送風溫度／送風壓力／冰水溫度／熱水溫度的標準做法。演算法：

```
every Tick (default 2 min):
    if zone_request_count >= I:
        SP += SP_res * (zone_request_count / I)  # respond
    else:
        SP -= SP_trim                            # trim
    clamp(SP, min, max)
```

| 參數 | 預設值 | Red5 呈現 |
|-----------|---------|--------------|
| `Tick`             | 2 min   | 硬編碼 |
| `I` (importance)   | 2 zones | 各 AHU 波段 |
| `SP_res` (respond) | +0.3 °C | 各波段 |
| `SP_trim` (trim)   | -0.1 °C | 各波段 |
| `Delay_initial`    | 5 min   | 各波段 |

儀表板中的波段調整滑桿會針對各分區群調整 `SP_res` 與 `SP_trim`——參見 [band_guide.md](/docs#band)。

---

## 3. 分區請求（Zone requests）

G36 分區透過回報其**目前有多少個請求**來為設定點變更「投票」：

- **冷卻請求（Cooling request）**：分區 T > 設定點 + 1 °C → +1 冷卻請求
- **壓力請求（Pressure request）**：風門位置 > 95 % 且分區通風不足 → +1 送風壓力請求
- **靜壓請求（Static-pressure request）**：VAV 入口風門 > 95 % 全開 → +1 風機轉速請求
- **加熱請求（Heating request）**：分區 T < 設定點 - 1 °C → +1 加熱請求（RH 盤管）

每台 AHU 於每個 Tick 收集所有 VAV 請求，並依計數進行修整或回應。Red5 的 `/api/data` 將這些以每 VAV 的 `req_cool`、`req_press`、`req_heat`、`req_fan` 形式公開。

---

## 4. AHU 序列（§5.16）

### 5.16.1 送風溫度重置

在 `SAT_min = 12 °C` 與 `SAT_max = 18 °C` 之間進行 T&R 重置，由所有服務分區加總的冷卻請求計數驅動。Red5 出廠預設：

```
SAT_min: 12.5 °C   (matches dew-point safety margin for CZ 1-3)
SAT_max: 18.0 °C   (lets ERV bypass without freezing)
SP_res:  +0.3 °C
SP_trim: -0.1 °C
```

### 5.16.2 靜壓重置

在 `SP_min = 50 Pa` 與 `SP_max = 750 Pa` 之間進行 T&R 重置，由 VAV 入口風門的靜壓請求計數驅動。此演算法的重點在於：讓送風機以*仍能滿足最需求風門的最低壓力*運轉——這正是真實建築中 30 %+ 風機能源節省的來源。

### 5.16.3 節能器

差式乾球或差式焓值（依 CZ，參見上文 90.1 §6.4.3.4）。G36 嚴格定義了遲滯以防止風門追獵（hunting）：

```
ECON_ON  when (T_OA + 1) < T_RA
ECON_OFF when (T_OA - 1) > T_RA
```

焓值亦同。Red5 的 Givoni 疊圖向操作人員顯示即時的節能器狀態——當青色角點閘斷時，ERV 被旁通；在青色角點之外，ERV 為啟動。

### 5.16.4 最小室外風量

採固定 `MIN_OA_CFM` 或**基於 CO₂ 的 DCV**（依 90.1 §6.4.3.4.5）。Red5 將即時 CO₂ 遙測接入 DCV 設定點，並將 OA 比例對照 ASHRAE 62.1 分區需求進行視覺化。

---

## 5. VAV／末端裝置序列（§5.17）

### 5.17.1 僅冷卻 VAV

風門依分區 T 相對冷卻設定點的偏差，從 `MIN_FLOW` 調變至 `MAX_FLOW`。無再熱。

### 5.17.2 帶再熱 VAV

兩階段：
1. **階段 1 — 冷卻**：風門從 `MIN_FLOW` 至 `MAX_COOL_FLOW`，再熱關閉
2. **階段 2 — 加熱**：風門位於 `MIN_HEAT_FLOW`，再熱閥調變 0-100 %

轉換以速率限制（斜率 0.1 °C/min）以防止振盪。

Red5 的 VAV 設備彈窗顯示即時 `DPR`（風門 %）＋ `HCV`（再熱閥 %）＋ `ZT`（分區 T）＋ `ZRH`（分區 RH），讓你可以逐分區驗證兩個階段的行為是否正常。

### 5.17.3 串聯式風機動力 VAV

加裝一台小型串聯風機，在占用模式下持續運轉；主風門依上述方式調變。多用於加熱需求高的周邊分區。Red5 支援額外的 `series_fan_status` BV。

---

## 6. 冰水機組（§5.20）

CHWS-T 透過 T&R 重置，由所有 AHU 的冷卻請求計數閘控。`CHWS_min = 6 °C`、`CHWS_max = 12 °C`。

CHW 泵壓重置由閥位請求驅動——讓最需求的冰水盤管閥維持在 95-100 % 開度。

Red5 不直接驅動冰水機（那是 BAS 承包商負責的 BACnet 寫入），但它監控 `CHWS_T`、`CHWR_T`、`kW_chiller` 與 `chiller_efficiency_COP`，並透過診斷分頁呈現偏移。

---

## 7. 熱水機組（§5.21）

CHW 的鏡像，但由加熱請求計數驅動。`HWS_min = 38 °C`（供水）、`HWS_max = 60 °C`。

---

## 8. 警報（§5.5）

G36 定義了 HVAC 系統必須回報的**63 種特定警報條件**。對 Red5 而言最切合操作人員需求者：

| 警報 | 觸發條件 | Red5 呈現 |
|---|---|---|
| 送風低溫（高限切斷） | `SAT < 4 °C` 持續 5 min | 紅點＋記錄 |
| 風管高靜壓 | `SP > SP_max * 1.25` 持續 10 min | 紅點 |
| 風機故障 | `cmd ON AND status OFF` 持續 60 s | 紅色橫幅 |
| 風門故障 | `cmd != position` 持續 5 min | 各 VAV 徽章 |
| 盤管結凍 | `mixed_air_T < 4 °C` | 紅色模式覆寫 |
| 分區溫度異常 | `|ZT - SP| > 2 °C` 持續 30 min | 黃色 VAV 列 |

G36 時間軸條中的 `freeze_protection` 模式與最後兩項警報連動——它會強制 AHU 進入模式 7（完全關閉 OA、加熱盤管全需求、風機於最低），直到操作人員解除。

---

## 9. 有效閱讀 G36

該標準是**300+ 頁的偽碼**。實務閱讀順序：

1. **§4** — 模式定義（七種占用模式）
2. **§5.1** — 共用子程序（T&R、遲滯、請求計數）
3. **§5.16 + §5.17** — AHU + VAV 序列（占操作人員工作的 90 %）
4. 略過冰水機／鍋爐／機組章節，除非你的 BAS 承包商真的有接線
5. **§5.5** — 警報（當有東西看起來不對時，這是查詢處）

---

## 10. G36 對比你的真實建築

操作人員常見的挫折：*「G36 說是 X，但我的建築做的是 Y。」*

發生的三個原因：

- **舊型控制器**無法執行 T&R——它們只是帶固定設定點的 PI 迴路。若 Red5 偵測到設定點在 30 min 內未移動，會以 `g36_mode = "OCCUPIED (no T&R)"` 呈現。
- **現場特定覆寫**由 BAS 承包商疊加在 G36 之上（例如「夏季無論請求為何一律 14 °C SAT」）。請將這些記錄在資產備註（Asset Notes）窗格中——否則它們將無從得知。
- **G36 從未安裝**——許多「符合 G36」的專案只是在 BAS 序列文件中有這些模式的*名稱*，卻從未真正出貨該演算法。Red5 的時間軸條會透過顯示模式從不轉換來抓出這種情況。

存疑時：調出 BAS 運轉序列 PDF，與 G36 參考演算法並排比較。差異之處，正是你的能源節省藏身之地。

---

## 11. 實務：哪些 Red5 功能是「執行 G36」還是「驗證 G36」

| G36 條款 | Red5 行為 |
|---|---|
| §5.1.14 T&R | 驗證（從 BAS 讀取 SAT_SP 移動），不驅動 |
| §5.16.1 SAT 重置 | 透過 SAT 趨勢斜率驗證 |
| §5.16.2 SP 重置 | 透過 SP 趨勢驗證 |
| §5.16.3 節能器 | 透過 Givoni 青色角點視覺化 |
| §5.16.4 OA 最小／DCV | 透過 OA 比例徽章驗證 |
| §5.17.x VAV 序列 | 逐分區 DPR + HCV 視覺化 |
| §5.5 警報 | 診斷帶中的即時警報彙整 |

Red5 是 **G36 觀察者**，而非 G36 實作者。實際序列在 BAS 控制器（Delta Controls O3/eBMGR、Distech ECP、Trane SC+、Honeywell N4 等）上執行。Red5 的工作是告訴你 BAS 是否確實在做它的運轉序列文件所宣稱之事。

---

## 12. 延伸閱讀

- **標準原文**：[ashrae.org/technical-resources/ashrae-handbook/ashrae-guideline-36](https://www.ashrae.org/technical-resources/ashrae-handbook/ashrae-guideline-36)
- **G36 導入手冊**，由 Taylor Engineering 編寫（撰寫 G36 大部分內容的公司）：[taylorengineers.com/wp-content/uploads/2020/07/G36-implementation.pdf](https://taylorengineers.com/wp-content/uploads/2020/07/G36-implementation.pdf)（請核對 URL——有時需付費）
- **Red5 中的配套文件**：
  - [control_algorithms.md](/docs#control-algorithms) 關於數學
  - [band_guide.md](/docs#band) 關於現場特定覆寫
  - [ashrae_55_reference.md](/docs#ashrae-55) 關於舒適側數據
  - [ashrae_90_1_reference.md](/docs#ashrae-90-1) 關於能源側數據
