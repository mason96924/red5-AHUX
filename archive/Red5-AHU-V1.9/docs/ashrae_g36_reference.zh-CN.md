# ASHRAE Guideline 36 — 参考

> *HVAC 系统高性能运行序列*
> ANSI/ASHRAE Guideline 36（现行版本：G36-2021，附录 a 于 2023 发布）

---

## TL;DR

Guideline 36 是 **HVAC 控制逻辑的操作员手册**。它精确地告诉你 AHU、VAV、冷水机组和锅炉在一天中的每一刻应该做什么——何时打开节能器、何时覆盖送风温度设定点、何时切换入住模式、何时报警。

大多数现代 BAS 承包商（Delta Controls、Trane、Distech、JCI、Honeywell、Siemens）都开箱即带"G36 合规"序列。Red5 Studio 的工作是：(a) 告诉你现实中的控制器是否在遵循这些序列，以及 (b) 在现场实际情况需要时让你覆盖它们。

仪表盘中的 G36 时间轴条（`#g36-timeline-strip`）将你最近 4 h / 24 h 的真实遥测映射到七个 G36 模式状态，让你一眼看出偏移。

---

## 1. 七种 G36 运行模式

G36 §5.1 定义了每台 AHU 必须报告的七种互斥模式：

| # | 模式 | 触发条件 | Red5 显示 |
|---|---|---|---|
| 1 | **Occupied（使用中）**      | 计划时段，人员感应器开启 | 绿色 |
| 2 | **Warm-up（预热）**       | 使用前，区域温度低于早晨回落值 | 橙色 |
| 3 | **Cool-down（预冷）**     | 使用前，区域温度高于傍晚回落值 | 浅蓝 |
| 4 | **Setback（温度回落）**       | 无人使用，温度超出窄带 | 灰色 |
| 5 | **Setup（温度上抬）**         | 无人使用，无温度越限 | 淡灰 |
| 6 | **Unoccupied（无人使用）**    | 非工作时段，风机关闭 | 深石板灰 |
| 7 | **Freeze protect（防冻保护）**| 盘管温度 < 4 °C | 红色 |

这些直接对应 G36 时间轴条中的图例。当计划显示"UNOCCUPIED"时某台 AHU 却显示"OCCUPIED"绿色，这是 Red5 捕捉卡死风阀 / 故障 VFD / 失控覆盖锁的头号方式。

---

## 2. 设定点重置（Trim & Respond —— T&R）

G36 §5.1.14 将**修整与响应（trim-and-respond）**定义为重置 SA 温度 / SA 压力 / 冷冻水温度 / 热水温度的规范方法。算法：

```
every Tick (default 2 min):
    if zone_request_count >= I:
        SP += SP_res * (zone_request_count / I)  # respond
    else:
        SP -= SP_trim                            # trim
    clamp(SP, min, max)
```

| 参数 | 默认值 | Red5 呈现位置 |
|-----------|---------|--------------|
| `Tick`             | 2 min   | 硬编码 |
| `I`（重要度）   | 2 个区域 | 每台 AHU 波段 |
| `SP_res`（响应） | +0.3 °C | 每波段 |
| `SP_trim`（修整）   | -0.1 °C | 每波段 |
| `Delay_initial`    | 5 min   | 每波段 |

仪表盘中的波段偏移滑块按区域组调整 `SP_res` 和 `SP_trim`——参见 [band_guide.md](/docs#band)。

---

## 3. 区域请求

G36 区域通过报告它当前拥有**多少个请求**来为设定点变更"投票"：

- **制冷请求**：区域温度 > 设定点 + 1 °C  → +1 制冷请求
- **压力请求**：风阀位置 > 95 % 且区域通风不足 → +1 SA 压力请求
- **静压请求**：VAV 进风风阀 > 95 % 全开 → +1 风机转速请求
- **制热请求**：区域温度 < 设定点 - 1 °C → +1 制热请求（RH 盘管）

每台 AHU 在每个 Tick 收集所有 VAV 请求，并根据计数进行修整或响应。Red5 的 `/api/data` 将这些以每个 VAV 的 `req_cool`、`req_press`、`req_heat`、`req_fan` 形式暴露。

---

## 4. AHU 序列（§5.16）

### 5.16.1 送风温度重置

在 `SAT_min = 12 °C` 与 `SAT_max = 18 °C` 之间进行 T&R 重置，由所有所服务区域累加的制冷请求计数驱动。Red5 提供的默认值：

```
SAT_min: 12.5 °C   (matches dew-point safety margin for CZ 1-3)
SAT_max: 18.0 °C   (lets ERV bypass without freezing)
SP_res:  +0.3 °C
SP_trim: -0.1 °C
```

### 5.16.2 静压重置

在 `SP_min = 50 Pa` 与 `SP_max = 750 Pa` 之间进行 T&R 重置，由来自 VAV 进风风阀的静压请求计数驱动。该算法的要点是让送风机运行在*仍能满足需求最高风阀的最低压力*下——这正是真实建筑中 30 %+ 风机节能的来源。

### 5.16.3 节能器

差分干球或差分焓（依 CZ 而定，参见上文 90.1 §6.4.3.4）。G36 严格定义了滞环以防止风阀振荡：

```
ECON_ON  when (T_OA + 1) < T_RA
ECON_OFF when (T_OA - 1) > T_RA
```

焓的情况相同。Red5 的 Givoni 叠加向操作员显示实时节能器状态——当青色角门控时，ERV 旁通；在青色角之外时，ERV 激活。

### 5.16.4 最小新风量

或采用固定的 `MIN_OA_CFM`，或采用**基于 CO₂ 的 DCV**（依 90.1 §6.4.3.4.5）。Red5 将实时 CO₂ 遥测接入 DCV 设定点，并将 OA 比例与 ASHRAE 62.1 区域要求进行对比可视化。

---

## 5. VAV / 末端装置序列（§5.17）

### 5.17.1 仅制冷 VAV

风阀根据区域温度相对制冷设定点的偏差，从 `MIN_FLOW` 调节到 `MAX_FLOW`。无再热。

### 5.17.2 带再热 VAV

两个阶段：
1. **阶段 1 —— 制冷**：风阀从 `MIN_FLOW` 到 `MAX_COOL_FLOW`，再热关闭
2. **阶段 2 —— 制热**：风阀处于 `MIN_HEAT_FLOW`，再热阀在 0-100 % 之间调节

过渡受速率限制（斜率 0.1 °C/min）以防止振荡。

Red5 的 VAV 设备弹窗显示实时 `DPR`（风阀 %）+ `HCV`（再热阀 %）+ `ZT`（区域温度）+ `ZRH`（区域 RH），使你可以按区域验证两个阶段的行为是否正常。

### 5.17.3 串联式风机动力 VAV

增加一个在使用模式下持续运行的小型串联风机；主风阀按上述方式调节。多用于制热需求高的周边区域。Red5 支持额外的 `series_fan_status` BV。

---

## 6. 冷冻水系统（§5.20）

CHWS-T 通过 T&R 重置，由所有 AHU 的制冷请求计数门控。`CHWS_min = 6 °C`，`CHWS_max = 12 °C`。

CHW 泵压重置由阀位请求驱动——保持需求最高的冷冻水盘管阀处于 95-100 % 开度。

Red5 不直接驱动冷水机组（那是由 BAS 承包商负责的 BACnet 写入），但它监测 `CHWS_T`、`CHWR_T`、`kW_chiller` 和 `chiller_efficiency_COP`，并通过诊断选项卡呈现偏移。

---

## 7. 热水系统（§5.21）

CHW 的镜像，但由制热请求计数驱动。`HWS_min = 38 °C`（供水），`HWS_max = 60 °C`。

---

## 8. 报警（§5.5）

G36 定义了 HVAC 系统必须报告的**63 种具体报警条件**。与 Red5 操作员最相关的：

| 报警 | 触发条件 | Red5 呈现 |
|---|---|---|
| SA 低温（高限切断） | `SAT < 4 °C` 持续 5 min | 红点 + 日志 |
| 风管静压过高 | `SP > SP_max * 1.25` 持续 10 min | 红点 |
| 风机故障 | `cmd ON AND status OFF` 持续 60 s | 红色横幅 |
| 风阀故障 | `cmd != position` 持续 5 min | 每 VAV 徽章 |
| 盘管冻结 | `mixed_air_T < 4 °C` | 红色模式覆盖 |
| 区域温度异常 | `|ZT - SP| > 2 °C` 持续 30 min | 黄色 VAV 行 |

G36 时间轴条中的 `freeze_protection` 模式与最后两个报警关联——它会强制 AHU 进入模式 7（OA 全关、HC 全需求、风机最低），直到操作员清除。

---

## 9. 高效阅读 G36

该标准是**300+ 页的伪代码**。实用的阅读顺序：

1. **§4** —— 模式定义（七种入住模式）
2. **§5.1** —— 通用子程序（T&R、滞环、请求计数）
3. **§5.16 + §5.17** —— AHU + VAV 序列（操作员 90 % 的工作）
4. 除非你的 BAS 承包商确实接线了，否则跳过冷水机组 / 锅炉 / 机房章节
5. **§5.5** —— 报警（当有异常时，这是查询处）

---

## 10. G36 与你的真实建筑

操作员常见的困扰：*"G36 说 X，但我的建筑却做 Y。"*

发生这种情况有三个原因：

- **老旧控制器**无法运行 T&R——它们只是带固定设定点的 PI 回路。如果 Red5 检测到设定点在 30 min 内没有移动，就会将其呈现为 `g36_mode = "OCCUPIED (no T&R)"`。
- **场地特定覆盖**由 BAS 承包商叠加在 G36 之上（例如"夏季无论请求如何始终 14 °C SAT"）。请在资产备注窗格中记录这些——否则它们会变得不可见。
- **G36 从未安装**——许多"G36 合规"项目只是在 BAS 序列文档中有这些模式的*名称*，却从未真正交付算法。Red5 的时间轴条通过显示模式从不切换来捕捉这一点。

如有疑问：调出 BAS 运行序列 PDF，并与 G36 参考算法并排对比。差异之处正是你的节能潜力藏身之地。

---

## 11. 实务：哪些 Red5 功能运行 G36，哪些验证 G36

| G36 条款 | Red5 行为 |
|---|---|
| §5.1.14 T&R | 验证（从 BAS 读取 SAT_SP 的移动），不驱动 |
| §5.16.1 SAT 重置 | 通过 SAT 趋势斜率验证 |
| §5.16.2 SP 重置 | 通过 SP 趋势验证 |
| §5.16.3 节能器 | 通过 Givoni 青色角可视化 |
| §5.16.4 OA 最小 / DCV | 通过 OA 比例徽章验证 |
| §5.17.x VAV 序列 | 按区域的 DPR + HCV 可视化 |
| §5.5 报警 | 诊断功能区中的实时报警汇总 |

Red5 是 **G36 的观察者**，而非 G36 的实现者。实际序列运行在 BAS 控制器上（Delta Controls O3/eBMGR、Distech ECP、Trane SC+、Honeywell N4 等）。Red5 的工作是告诉你 BAS 是否在做其运行序列文档所声称的事情。

---

## 12. 延伸阅读

- **标准原文**：[ashrae.org/technical-resources/ashrae-handbook/ashrae-guideline-36](https://www.ashrae.org/technical-resources/ashrae-handbook/ashrae-guideline-36)
- **G36 实施手册**，由 Taylor Engineering 编写（该公司撰写了 G36 的
  大部分内容）：[taylorengineers.com/wp-content/uploads/2020/07/G36-implementation.pdf](https://taylorengineers.com/wp-content/uploads/2020/07/G36-implementation.pdf) （请核实 URL——有时会遇到付费墙）
- **Red5 中的配套文档**：
  - [control_algorithms.md](/docs#control-algorithms) —— 数学部分
  - [band_guide.md](/docs#band) —— 场地特定覆盖
  - [ashrae_55_reference.md](/docs#ashrae-55) —— 舒适侧数字
  - [ashrae_90_1_reference.md](/docs#ashrae-90-1) —— 能源侧数字
