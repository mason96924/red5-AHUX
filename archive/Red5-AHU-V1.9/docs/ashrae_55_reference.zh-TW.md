# ASHRAE Standard 55 — 參考

> *Thermal Environmental Conditions for Human Occupancy*（人體使用之熱環境條件）
> ANSI/ASHRAE Standard 55（現行版本：55-2023）

---

## TL;DR

ASHRAE 55 是定義**何種室內條件能讓人體達到熱舒適**的國際規範。你在 Red5 Studio
中看到的大多數預設值——21–27 °C 的舒適溫度範圍、40–60 % RH 的「甜蜜區」波段，
以及 Givoni 包絡的角點錨——都源自這份標準。

當操作人員問*「為什麼波段設在那裡？」*，或當新的建築類型（健身房、實驗室、倉庫）
需要刻意覆寫預設值時，掌握這些數字就很有用。

---

## 1. ASHRAE 55 實際規定了什麼

這份標準**並不是**只說*「21–27 °C 很舒適」*。它提供一套方法，根據**六個變數**
計算舒適包絡：

| 變數 | 符號 | Red5 Studio 辦公室預設值 |
|---|---|---|
| 空氣溫度            | T<sub>a</sub>  | 21–27 °C    （T·CLIP 滑桿）        |
| 平均輻射溫度        | T<sub>r</sub>  | 假設 ≈ T<sub>a</sub>              |
| 相對溼度            | RH             | 40–60 %     （RH 波段滑桿）        |
| 風速                | V              | ≤ 0.20 m/s  （靜止空氣假設）       |
| 代謝率              | M (met)        | 1.0–1.3 met （坐姿辦公工作）       |
| 服裝熱阻            | I<sub>cl</sub> (clo) | 0.5 clo 夏季 / 1.0 clo 冬季 |

將這些代入 **Fanger 的 PMV/PPD 模型**（Predicted Mean Vote / Percentage Person
Dissatisfied，預測平均投票值／預測不滿意百分比），標準便會在焓溼空間中回傳一個
多邊形——即「可接受舒適區」。以靜止空氣、搭配季節性服裝的典型辦公室而言，該區域
大致收斂為：

| 季節 | 作業溫度範圍 | RH 範圍 |
|---|---|---|
| 夏季（0.5 clo，輕薄衣著） | **23–27 °C** | 30–60 % |
| 冬季（1.0 clo，毛衣＋長褲） | **20–24 °C** | 30–60 % |
| **全年重疊（兩者皆成立）** | **21–27 °C** | **40–60 %** |

那個全年重疊區，正是 Red5 Studio 用於 **RH 波段滑桿**與 **3D WX T·CLIP 滑桿**
的預設值。

---

## 2. 可接受性分級

ASHRAE 55 / EN 16798 定義了**三個**目標滿意度等級：

| 分級 | 滿意百分比 | 典型用途 |
|---|---|---|
| **A** | 90 % | 高階空間——手術室、主管辦公室、博物館 |
| **B** | 80 % | 一般辦公室、學校教室、旅館客房  ← *Red5 預設* |
| **C** | 65 % | 後勤走廊、輕工業 |

舒適多邊形越窄，滿意度目標就越高。Red5 Studio 的 21–27 °C / 40–60 % 預設值對應
**分級 A**（最嚴格的高階辦公規格）。若你的建築屬於分級 B，你可以透過滑桿安全地
放寬至 20–28 °C / 30–60 %，而不違反該標準。

---

## 3. ASHRAE 55 在 Red5 Studio 中的落點

### 3.1 溫度：T·CLIP 滑桿（側欄，「3D WX · T·CLIP」）

- **預設** 21–27 °C——ASHRAE 55-2023 分級 A 的全年重疊
- **儲存於** `localStorage['red5_t_clip_range']`
- **供** 3D WX 洋紅色板塊幾何（`_buildRhBandSlab`）使用——板塊僅在此 T 窗口內
  繪製，因為此處的室內 RH 控制在物理上可實際執行
- **同時供** `FREE | T·CLIP` 晶片使用——處於 `T·CLIP` 模式時，天氣散點的
  帶內標記（1.6×）除了 RH 檢查外，還受 `T ∈ [T_lo, T_hi]` 的閘控

### 3.2 溼度：RH 波段滑桿（側欄，甜蜜區範圍）

- **預設** 40–60 % RH——ASHRAE 55 §5.2.3「溼度限值」，並結合 WHO 針對
  黏膜健康（RH < 30 %）與黴菌生長門檻（RH > 60 %）的空氣品質指引
- **儲存於** `localStorage['red5_sweet_spot_range']`
- **驅動** 洋紅色板塊剖面、帶內標記高亮，以及將所選 RH 窗口推送至 BACnet
  控制器的波段夾持（band-clamp）邏輯

### 3.3 舒適多邊形：Givoni 包絡（青色線框）

Givoni 包絡出自 Givoni 1969 年的 *Building Climatic Design* 多邊形，它藉由加入
生物氣候策略區域，**延伸**了 ASHRAE 55：

| 區域 | ASHRAE 55 對應 | Givoni 額外新增 |
|---|---|---|
| 舒適核心 | 有——PMV/PPD 舒適區 | — |
| 軟修整波段（B） | 部分——RH 邊界 | 被動加溼/除溼建議 |
| 熱溼（C+） | 在範圍外 | 主動冷卻策略 |
| 冷乾（C–） | 在範圍外 | 主動加熱策略 |
| 被動太陽能 | 在範圍外 | 「免費加熱」策略 |
| 自然通風 | 在範圍外 | 「免費冷卻」策略 |
| 蒸發冷卻 | 在範圍外 | 「乾燥氣候免費冷卻」策略 |

因此，**儀表板中的 Givoni 包絡就是 ASHRAE 55 ＋ 可執行的 HVAC 策略建議**——
既有舒適，又指出如何以低成本達成。

### 3.4 風速假設

Red5 Studio 目前假設 **V ≤ 0.20 m/s**（靜止空氣）——這是 ASHRAE 55 針對久坐
使用狀態的預設值。這點很重要，因為提高風速（例如吊扇）會**使舒適包絡每
0.1 m/s 向上位移約 1.5 °C**——裝設可操作吊扇的建築在 28–29 °C 時仍可能舒適，
遠超出我們的預設 T·CLIP。若你的建築以提高風速作為舒適策略，請手動將 T·CLIP
放寬至 21–29 °C。

---

## 4. 何時應刻意覆寫預設值

21–27 °C / 40–60 % 的預設值是為**受控空間中久坐至輕度活動的使用者**量身調校
的——辦公室、學校、住宅、旅館。ASHRAE 55 明確**不**涵蓋：

| 空間類型 | 建議覆寫值 | 原因 |
|---|---|---|
| 體育館、舞蹈教室 | T·CLIP 16–22 °C，RH 30–60 % | M ≥ 3.0 met——人體快速產熱 |
| 商用廚房 | T·CLIP 18–24 °C，RH 30–55 % | M ≈ 2 met，鄰近有顯熱熱源 |
| 無塵室（半導體） | T·CLIP 20–22 °C，RH 45–55 % | 由製程驅動，而非舒適驅動 |
| 博物館／檔案庫 | T·CLIP 19–22 °C，RH 45–55 % | 文物保存（依館藏而定） |
| 資料中心 | T·CLIP 18–27 °C，RH 20–80 % | ASHRAE TC 9.9 的*設備*包絡，非舒適 |
| 醫院手術室 | T·CLIP 20–24 °C，RH 30–60 % | ASHRAE 170——外科流程 |
| 倉庫、門廳 | 不適用 | ASHRAE 55 不予規範；請採用建築法規 |
| 裝有吊扇的建築（V > 0.2 m/s） | T·CLIP 21–29 °C，RH 不變 | 提高風速的舒適位移 |

覆寫後，**雙擊滑桿的 RESET 按鈕即可回到 ASHRAE 55 分級 A 預設值**。

---

## 5. 合規註記

若你客戶的規格要求 ASHRAE 55-2023 合規文件：

- 儀表板的 **Givoni Engine** 徽章＋ RH 波段滑桿的「applied」晶片，兩者共同
  證明使用中的空間有 ≥ 95 % 的使用時數維持在標準的多邊形內。此指標可從
  *Comfort 3D* 覆蓋率統計取得（3D WX 面板——右下角「Pts / In-band / Sweet-spot %」
  讀數）。
- 就 PMV/PPD 文件而言，ASHRAE 55 § 5.3.4 允許以*作業溫度*舒適法（即 Red5 所用者）
  作為完整 PMV/PPD 報告的替代方案。請提交 T·CLIP 與 RH 波段滑桿設定，
  加上 *Comfort 3D* 圖層的 12 個月覆蓋率圖表。

---

## 6. 本手冊中的交叉參照

| ASHRAE 55 *隱含*被引用之處 | 現已明確於 |
|---|---|
| `control_algorithms.md` § 2「Givoni Comfort Zone Definition」 | 已新增連結 |
| `control_algorithms.md` § 4.4「Humidity Control」——40-60 % RH | 引用為 ASHRAE 55 §5.2.3 |
| `control_strategy_insight.md` | 於討論舒適之處簡要參照 |
| `band_guide.md` § B5「Warm & medium humidity（40-60 % RH）」 | 已引用 |
| `psychrometric_design_workflow.md` § 「40-60 % RH sweet-spot strip」 | 已引用 |

---

## 7. 外部延伸閱讀

- ASHRAE Standard 55-2023，完整 PDF——於 <https://www.ashrae.org/technical-resources/bookstore> 購買
- CBE Thermal Comfort Tool（免費、互動式 PMV/PPD 計算器）：
  <https://comfort.cbe.berkeley.edu/>
- ISO 7730:2005——ASHRAE 55 的國際對應標準，用於歐盟規格
- EN 16798-1:2019——歐洲室內環境標準，定義了 Red5 Studio 所採用的
  分級 A/B/C 滿意度等級

---

*This reference was added to the Red5 Studio manual on 2026-06-20 to make
explicit which values in the controller defaults come directly from ASHRAE 55,
and to give operators a concise crib for when to override them.*
（本參考文件於 2026-06-20 加入 Red5 Studio 手冊，用以明確指出控制器預設值中
哪些數字直接源自 ASHRAE 55，並為操作人員提供一份何時覆寫這些數值的精簡備忘。）
