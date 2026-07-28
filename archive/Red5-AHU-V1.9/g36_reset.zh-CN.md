# Red5 `dyn-reset` ↔ ASHRAE Guideline 36 Trim-and-Respond 交叉对照表

> 🤖 **翻译基线说明**: 本简体中文文档为英文原本(`g36_reset.md`)的机器翻译基线。
> 发布或交付外部顾问前，建议由 HVAC 领域专业译者审校。
> 表格、代码、标准引用保留原文。

**目标读者**: 已了解 Red5 `dyn-reset` 旋钮集(参见 `band_guide.md`)、并需将其映射到 ASHRAE Guideline 36 合规运行序列(SOO)的 HVAC 控制工程师与调试人员。通常在业主交付文档中指定 G36 时需要。

**摘要 (TL;DR)**: `dyn-reset` **受 G36 启发**，但开箱即用并 **非完全 G36 合规**。本文准确指出为弥合差距需要添加、变更或记录的内容，并按可直接打印交予第三方调试代理（CxA）进行核查的方式编排。

---

## 1 · 单段背景

ASHRAE Guideline 36 ("High-Performance Sequences of Operation for HVAC Systems"，现行版本: **Guideline 36-2021**)将三十多年的需求控制 VAV 最佳实践编纂为单一的规定性序列库。其核心思想 — **在仍能满足每个区的前提下，以最高的送风温度(SAT)和最低的风管静压(SP)运行 AHU** — 与 Red5 `dyn-reset` 的编写原则相同。差异在 **计数方法**: Red5 对每个区相对设定点偏差的 **幅度(magnitude)** 作出反应；G36 对偏差超过每环路忽略阈值的 **区数(count)** 作出反应("Trim & Respond" 方法，以下简称 T&R)。当单个失常区域出现时，T&R 在数学上更稳定，且是 G36 审计将核对的算法。

---

## 2 · 参数交叉对照

下面是 Red5 `dyn-reset` 旋钮与 G36 T&R 参数的双向映射。每个旋钮都有 G36 等价物，有时一对一，有时附带注意事项。G36 默认值取自 **Guideline 36-2021 Table 5.1.14.3** (制冷 SAT 复位)与 **§5.1.14.4** (风管静压复位)。

### 2.1 送风温度(SAT)制冷复位

| Red5 旋钮 (`band_guide.md`) | G36 T&R 参数 | G36 默认值 | 说明 |
|---|---|---|---|
| `sat_min_c` | **SPmin** (最低 SAT) | 12.8 °C / 55 °F | 含义相同。洁净室 / RH 驱动设计可允许更低。 |
| `sat_max_c` | **SPmax** (最高 SAT) | 18.3 °C / 65 °F | 含义相同。仅在湿球/除湿核查后才上调。 |
| `sat_init_c` | **SP0** (模式变更后初始复位值) | SPmax (18.3 °C) | G36 以宽容(暖 SAT)开始，按需求向下修整。Red5 目前从 `sat_init_c` 开始；为对等，应改名 `sat_initial_c` 并设为 `sat_max_c`。 |
| **— (Red5 暂无等价物)** | **I** (忽略请求数) | 2 | 响应前应忽略的"制冷请求"数。**作为 `sat_ignored_requests` 加入 Red5。** |
| **— (Red5 暂无等价物)** | **T** (时间步长 / 采样周期) | 5 分钟 | T&R 循环周期。Red5 复位循环每 30 秒运行 — 需要单独的较慢聚合器。 |
| **— (Red5 暂无等价物)** | **Td** (启用后初始延迟) | 10 分钟 | "在计数请求前等待 AHU 稳定"。**作为 `sat_initial_delay_s` 加入。** |
| `decay_step_c` | **SPtrim** (每 T&R 周期修整量) | +0.1 °C/周期 | 当无响应到来，将 SAT *修整*(变暖) 此量。**Red5 的衰减是指数型；G36 是线性。** 参见 §2.4。 |
| **— (Red5 暂无等价物)** | **SPres** (每请求响应量) | −0.2 °C/请求 (超过 I 的部分) | 当 `requests > I`，按 `SPres × (requests − I)` *响应*(变冷)，受 SPres-max 限制。**作为 `sat_response_step_c` 与 `sat_response_max_c` 加入。** |
| `hysteresis_c` | **(G36 无直接等价物)** | — | G36 无滞回区间；以 T(5 分钟采样)防止震荡。设 `hysteresis_c = 0`、`T = 5 min` 即为 G36 合规。 |

### 2.2 风管静压(SP)复位 — 结构相同

| Red5 旋钮 | G36 T&R 参数 | G36 默认值 |
|---|---|---|
| `sp_min_pa` | **SPmin** | 75 Pa (0.3 in.w.g.) |
| `sp_max_pa` | **SPmax** | 374 Pa (1.5 in.w.g.) |
| `sp_init_pa` | **SP0** | SPmin (起步低，向上响应) |
| — | **I** (忽略请求) | 2 |
| — | **T** (时间步长) | 2 分钟 |
| — | **Td** (初始延迟) | 10 分钟 |
| `sp_trim_pa` | **SPtrim** | −12.5 Pa/周期 (无请求时下调) |
| — | **SPres** | +37 Pa/请求 (超过 I 的部分) |
| — | **SPres-max** | +93 Pa/周期 (积极响应上限) |

> 注意 **符号翻转**: SAT 向 **上**(更暖、更高效)修整，向 **下**(更冷、满足更多区)响应。SP 向 **下**(低压、少风机功耗)修整，向 **上**(高压、更多风阀开启)响应。修整/响应的 *方向* 正是使两个复位环路成为节能闭环的关键。

### 2.3 新风(OA)复位

G36 §5.1.6 要求独立的 **节能器高限**及 **最低 OA 跟踪**(占用时基于 CO2 的 DCV)。Red5 暂无等价物 — 目前 OA 占比由波段引擎的焓比较计算。为达合规，需添加:

| Red5 参数(需新增) | G36 参考 | 默认值 |
|---|---|---|
| `econ_high_limit_oat_c` | §5.1.6.2 (固定干球温度，气候区相关) | 23.9 °C (Zone 1, 湿热); 22.2 °C (Zone 5–8) |
| `econ_high_limit_enthalpy_kjkg` | §5.1.6.2 (固定焓，双设定选项) | 65 kJ/kg 干空气 |
| `oa_min_cfm_per_person` | §5.1.6.3 | 按 ASHRAE 62.1 Table 6-1 (≈ 4.7 L/s/人 办公；7.6 L/s/人 教室) |
| `dcv_co2_setpoint_ppm` | §5.1.6.3.b | 1000 ppm；区 CO2 > 设定点时响应 |

### 2.4 Trim & Respond 算法 (伪代码)

**只需加入下面这一个函数**，即可让 `dyn-reset` 切换为 G36 T&R。放在 `app.py` 的 `_reset_loop` 旁(V1.9) 或 `band_engine.py` 内(V2.0)。

```python
def trim_and_respond(now_setpoint, requests, params):
    """
    G36-2021 §5.1.14 Trim & Respond.

    Args:
      now_setpoint : 当前 SAT (或 SP) 值, °C (或 Pa)
      requests     : int — 请求更多制冷的区数
                     (SAT 环路: 至少连续 2 个采样冷却环路 > 95% 的区
                     — 参见 G36 §5.16.5)
      params       : dict, 键: sp_min, sp_max, ignored, sp_trim,
                     sp_res, sp_res_max  (符号按上面 §2.1/§2.2)

    Returns:
      钳制到 [sp_min, sp_max] 的下一设定点
    """
    if requests <= params['ignored']:
        # 修整: 朝节能侧回收
        proposed = now_setpoint + params['sp_trim']
    else:
        # 响应: 每个超额请求按 sp_res 拉动设定点,
        # 每周期受 sp_res_max 限制 → 一个失控区无法拖累整台 AHU
        excess = requests - params['ignored']
        delta  = params['sp_res'] * excess
        # 按绝对值限制, 保留 sp_res 符号
        if abs(delta) > abs(params['sp_res_max']):
            delta = params['sp_res_max']
        proposed = now_setpoint + delta
    return max(params['sp_min'], min(params['sp_max'], proposed))
```

每个 T 调用一次(SAT 取 5 分钟、SP 取 2 分钟)，输入来自 VAV 轮询环路的最新请求数。用它分别替换 `_reset_loop` 中 SAT 与 SP 的指数衰减。

### 2.5 "制冷请求"定义 (Red5 需新增代码部分)

当连续两个采样(间隔 ≥ 2 分钟)中 **任一** 条件成立时, 区被计为 **一个制冷请求** (G36 §5.16.5):

1. 区温度 > 区制冷设定点 + 1.7 °C (3 °F) 且 区已 ≥ 2 个采样请求制冷。
2. 区送风风阀全开(≥ 95%) 且 区仍 > 制冷设定点 + 0.6 °C (1 °F)。
3. (仅压力环路) 区风阀 > 95% 开 且 风量 < 设定值的 90%。

Red5 目前在波段引擎中暴露每区偏差但不聚合为离散请求计数。**新增 `compute_cooling_requests(zones, dt)` 函数返回 `int`**, 并喂给 `trim_and_respond()`。

---

## 3 · G36 的 8 个运行模式 (Red5 暂无的显式部分)

Red5 当前以 Givoni 波段引导的连续控制方式运行。G36 将运行划分为带硬性转换条件的 **离散模式**。这是最大的差距。

| # | 模式 | 触发条件 | 典型设定点 |
|---|---|---|---|
| 1 | **占用 (Occupied)** | 排程 + 任一区有占用或温度偏差 | 按区排程设定点 |
| 2 | **预热 (Warm-up)** | OAT < 供热设定点 − 2.8 °C 且 任一区 < 供热设定点 − 0.6 °C，预定启动前 | 仅供热、新风全闭、风机 ON |
| 3 | **预冷 (Cool-down)** | OAT > 制冷设定点 + 2.8 °C 且 任一区 > 制冷设定点 + 0.6 °C，预定启动前 | 仅制冷、新风全闭、风机 ON |
| 4 | **供热回设 (Setback heating)** | 非占用期间任一区 < 供热回设(通常 15.6 °C / 60 °F) | 仅供热, 最低风量 |
| 5 | **制冷回设 (Setup cooling)** | 非占用期间任一区 > 制冷回设(通常 29.4 °C / 85 °F) | 仅制冷, 最低风量 |
| 6 | **非占用 (Unoccupied)** | 排程非占用 且 未触发回设 | 风机 OFF, 风阀关闭 |
| 7 | **防冻 (Freeze-protection)** | OAT < 1.7 °C 且 任一区 < 4.4 °C | 供热维持 4.4 °C, 新风全闭 |
| 8 | **烟感/停机 (Smoke / shutdown)** | 火警输入触发 | 风机 OFF (或按消防序列), 风阀关闭 |

**转换规则** (G36 §5.1.4.4): 进入模式仅当 **所有触发条件** 持续 ≥ 10 分钟；退出仅当 **无任何触发条件** 持续 ≥ 10 分钟。防止启动时在预冷↔占用之间震荡。

Red5 增补路径: 新建 `mode_engine.py` (V2.0) / `_mode_loop` (V1.9) 拥有 8 状态机, 并对现有波段引擎的复位输出加门控。

---

## 4 · G36 强制点位列表

G36 审计会逐项确认下表所有点位的 **读取或写入** 能力。Red5 V1.9 通过 BACnet 已暴露大多数; 调试期间请将 `bacnet_map.json` 与本表对照。

### 4.1 每台 AHU (约 40 个强制点)

| # | 点位 | 方向 | 类型 |
|---|---|---|---|
| 1 | 送风温度 (SAT) | AI | °C |
| 2 | 回风温度 (RAT) | AI | °C |
| 3 | 新风温度 (OAT) | AI | °C |
| 4 | 混合风温度 (MAT) | AI | °C |
| 5 | 送风 RH | AI | % |
| 6 | 回风 RH | AI | % |
| 7 | 新风 RH | AI | % |
| 8 | 送风机转速反馈 | AI | % |
| 9 | 送风机 VFD 指令 | AO | % |
| 10 | 风管静压 | AI | Pa |
| 11 | 风管静压设定点 | AV | Pa |
| 12 | SAT 设定点 (T&R 后) | AV | °C |
| 13 | OA 风阀位置反馈 | AI | % |
| 14 | OA 风阀指令 | AO | % |
| 15 | RA 风阀指令 | AO | % |
| 16 | 加热盘管阀位 | AO | % |
| 17 | 冷却盘管阀位 | AO | % |
| 18 | 过滤器压差 | AI | Pa |
| 19 | 烟感器 | BI | — |
| 20 | 防冻开关 (Freeze-stat) | BI | — |
| 21 | 送风机启停指令 | BO | — |
| 22 | 送风机状态 (电流传感器) | BI | — |
| 23 | 节能器使能 | BO | — |
| 24 | 运行模式 (上述 1–8) | MV | enum |
| 25 | 制冷请求数 (计算值) | AV | count |
| 26 | 供热请求数 (计算值) | AV | count |
| 27 | 压力请求数 (计算值) | AV | count |
| 28 | 报警: SAT 偏差 | BV | — |
| 29 | 报警: SP 偏差 | BV | — |
| 30 | 报警: 过滤器堵塞 | BV | — |
| 31–40 | 盘管状态 / 报警 / 最低 OA 风量跟踪 | 混合 | — |

### 4.2 每个 VAV 箱 (约 20 个强制点)

| # | 点位 | 方向 |
|---|---|---|
| 1 | 区温度 | AI |
| 2 | 区制冷设定点 | AV |
| 3 | 区供热设定点 | AV |
| 4 | 区风量 | AI |
| 5 | 区风量设定点 | AV |
| 6 | 区风阀位置 | AI |
| 7 | 区风阀指令 | AO |
| 8 | 区再热阀 | AO |
| 9 | 区占用传感器 | BI |
| 10 | 区 CO2 传感器 (DCV 配置的箱) | AI |
| 11 | 区制冷环输出 | AV |
| 12 | 区供热环输出 | AV |
| 13 | 制冷请求标志 | BV |
| 14 | 供热请求标志 | BV |
| 15 | 压力请求标志 | BV |
| 16–20 | 区报警 / 最低风量覆盖 / 排程占用 | 混合 |

---

## 5 · 调试趋势 (CT 1–9)

G36 §6.2 要求 **至少 9 条 30 天趋势记录**, 采样间隔 ≤ 1 分钟。这些是审计期间证明序列按书面运行的主要证据。Red5 V1.9 采集器已记录大部分; 与 `collector/config.json` 对照。

| CT # | 趋势 | 用途 |
|---|---|---|
| **CT-1** | SAT、SAT 设定点、所有区温度 | 证明 SAT 复位响应区需求 |
| **CT-2** | SP、SP 设定点、所有风阀位置 | 证明 SP 复位响应风阀需求 |
| **CT-3** | OAT、MAT、RAT、OA 风阀指令+位置 | 证明节能器跟随焓比 |
| **CT-4** | 加热盘管阀位、冷却盘管阀位 | 证明无同时加热与制冷 |
| **CT-5** | 制冷/供热/压力请求数 | 证明 T&R 计数正确 |
| **CT-6** | 运行模式 enum | 证明模式转换稳定 (无震荡) |
| **CT-7** | 各区风量、风量设定点、CO2 (DCV 区) | 证明 DCV 在需要时覆盖最低风量 |
| **CT-8** | 送风机 VFD 指令、状态、电流 | 证明风机跟随指令且不对关闭的风阀施压 |
| **CT-9** | 全部报警 BV | 证明无虚警 |

Red5 采集器已支持 1 分钟分辨率。在 `collector/trends.json` 中启用趋势, 调试窗口期连续运行 30 天。

---

## 6 · 报警等级矩阵 (G36 §5.1.16)

上面点位列表中的所有报警必须按 A / B / C 分类并附响应时间。Red5 已有报警但暂无等级字段 — 在每条报警定义中加入 `alarm_class: 'A'|'B'|'C'`。

| 等级 | 示例 | 通知 | 响应时间 |
|---|---|---|---|
| **A** (生命安全) | 防冻、烟感、送风机故障、防冻模式生效 | 即时派工, 现场可听 | < 10 分钟 |
| **B** (设备) | SAT/SP 偏差 > 30 分钟、过滤器堵塞、阀位强制、传感器故障 | BMS 通知, 自动开工单 | < 4 小时 |
| **C** (信息) | 排程覆盖、手动设定点调整、模式转换 | 仅日志 | < 24 小时 |

---

## 7 · 通往 G36 合规之路 — 差距分析

对你当前的安装运行此清单:

| # | G36 要求 | Red5 状态 | 行动 |
|---|---|---|---|
| 1 | Trim-and-Respond SAT 复位 | **缺口** — Red5 使用幅度型指数衰减 | 实现 §2.4 `trim_and_respond()`; 替换 `_reset_loop` SAT 分支 |
| 2 | Trim-and-Respond SP 复位 | **缺口** — 同上 | 用 SP 参数字典调用同一 `trim_and_respond()` |
| 3 | 制冷/供热/压力请求计数器 | **缺口** — Red5 有区偏差但无聚合 | 按 §2.5 在 VAV 轮询中加入 `compute_*_requests()` |
| 4 | 8 个运行模式 + 转换 | **缺口** — Red5 是连续控制 | 新建 `mode_engine.py` (V2.0) / `_mode_loop` (V1.9); 上面 §3 |
| 5 | 固定干球或焓高限节能器 | **部分** — Red5 用焓比较, 需明确高限 | 按 §2.3 加入 `econ_high_limit_oat_c`、`econ_high_limit_enthalpy_kjkg` |
| 6 | 按 ASHRAE 62.1 的最低 OA / DCV | **缺口** — Red5 有 OA 占比但无人均最低跟踪 | 在 VAV 轮询加入 CO2 输入 + DCV 覆盖逻辑 |
| 7 | 每台 AHU 40 个强制点 | **基本 OK** — Red5 V1.9 通过 BACnet 暴露约 35 个 | 与 §4.1 对照 `bacnet_map.json`; 补齐缺失约 5 个 (多为计算 AV 请求计数) |
| 8 | 每个 VAV 20 个强制点 | **基本 OK** — 同上 | 检查; 加入请求标志 BV |
| 9 | 9 条调试趋势 @ 1 分钟 | **OK** — Red5 采集器已支持 | 在 `collector/trends.json` 启用; 运行 30 天 |
| 10 | 报警 A/B/C 等级标记 | **缺口** — Red5 有报警但未分类 | 按 §6 加入 `alarm_class` 字段 |
| 11 | 防冻自动模式 | **部分** — 防冻开关输入已接但未强制模式 | 与 #4 模式引擎对接 |
| 12 | 无同时加热与制冷 | **OK** — Red5 波段引擎已阻止 | 通过 CT-4 趋势验证 |

**填平 12 项缺口的预计工作量**: V2.0 约 3–4 开发周, 加上代表性季节 1 周的 CT 趋势收集。V1.9 因每个新点位需要控制器烧录, 在 BACnet 点位扩展上再加约 2 周。

---

## 8 · "我只是想在规格表上 *写* G36" 的情况

若目标是营销对等(并非真实合规)，最小可信实现:

1. **§2.4 trim_and_respond()** — 替换衰减式复位 (≈ 1 天)。
2. **§2.5 制冷请求计数器** — 按区聚合 (≈ 1 天)。
3. **§3 模式引擎** — 4 个模式子集(占用 / 非占用 / 预热 / 预冷)即可覆盖 90% 的审计核查 (≈ 3 天)。
4. **§5 CT-1, CT-2, CT-5** — 3 条趋势, 各 30 天 (无需开发, 仅启用)。
5. **§7 第 7 行** — 核对 BACnet 点位列表。

约 1 开发周即可达到 **"G36 觉察 (G36-aware)"** — 足以满足通用规格但未达到 ASHRAE 审计。若业主派遣第三方调试代理(如 Engineering Economics、kW Engineering、P2S 等公司的 CxA)，**他们会** 运行完整的 §3–§7 清单, 部分实现会被点出。

---

## 9 · 参考资料

- ASHRAE Guideline 36-2021, "High-Performance Sequences of Operation for HVAC Systems"
- ANSI/ASHRAE Standard 62.1-2022, "Ventilation for Acceptable Indoor Air Quality"
- ANSI/ASHRAE Standard 90.1-2022, "Energy Standard for Buildings Except Low-Rise Residential Buildings" §6.5.3.1 (DCV)
- Hydeman M., Stein J., et al. (2003), *Advanced Variable Air Volume System Design Guide*, Pacific Gas & Electric — trim-and-respond 算法的原始出处
- LBNL FlexLab G36 参考实现: <https://github.com/lbl-srg/ctrl-flow-dev> (开源 Modelica 参考)
- Red5 `band_guide.md` — 当前 `dyn-reset` 旋钮文档 (本文的姊妹文件)

---

*本文与控制器上的 `band_guide.md` 配对。任何一方更新都应同步到另一方。*
*最后更新: 2026-05-24 — 与仪表盘 `★ 默认位置固定` 功能一同发布的首版 G36 交叉对照表。*
