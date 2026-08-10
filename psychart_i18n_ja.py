# -*- coding: utf-8 -*-
# Japanese (ja) strings for Psychart-HVAC-ASHRAE-Overview
# Keys are EXACT English source strings (as they appear in the HTML, including HTML entities like &amp; and markup like <b>...</b> where present).
# Values are Japanese translations.

STRINGS = {
  # ── <title> ──
  "The Psychrometric Chart — HVAC's master diagram and the missing BMS tool":
    "湿り空気線図 — HVACの基本図表であり、BMSに欠けているツール",

  # ── Slide 1: Title ──
  "The Psychrometric Chart":
    "湿り空気線図",
  "HVAC's master diagram — and the missing tool in most Building Management Systems":
    "HVACの基本図表 — そして大半のBMSに欠けているツール",
  "Why equipment designers cannot work without it, why traditional BMS never adopted it, and how this one chart answers ASHRAE 55, 62.1, 90.1 and Guideline 36 at the same time.":
    "機器設計者がこれなしでは仕事ができない理由、従来のBMSが採用してこなかった理由、そしてこの一枚の線図がASHRAE 55、62.1、90.1およびGuideline 36に同時に答える仕組み。",
  "Moist-air states":
    "湿り空気の状態",
  "Design tool":
    "設計ツール",
  "ASHRAE-aligned":
    "ASHRAE準拠",
  "Live controls":
    "リアルタイム制御",

  # ── Slide 2: Who uses it ──
  "Start here":
    "はじめに",
  "Who uses this chart — and on what equipment":
    "誰が・どの機器でこの線図を使うのか",
  "Long before a building is controlled, someone has to choose the machines that condition its air. Those people live on the psychrometric chart.":
    "建物が制御されるはるか前に、誰かが空気を調える機器を選定しなければなりません。その人たちは湿り空気線図の上で仕事をしています。",
  "Who they are":
    "彼らは誰か",
  '"HVAC equipment designers" are the mechanical engineers who select and size air-conditioning equipment:':
    "「HVAC機器設計者」とは、空調機器を選定・容量計算する機械技術者です：",
  "• manufacturers' application engineers<br>• consulting / design engineers<br>• commissioning engineers who prove it works":
    "• メーカーのアプリケーションエンジニア<br>• コンサルティング／設計エンジニア<br>• 動作を実証するコミッショニングエンジニア",
  'What "HVAC equipment" means':
    "「HVAC機器」とは何か",
  "The machines that actually change the air:":
    "実際に空気の状態を変える機器：",
  "• air-handling units (AHUs) and their heating / cooling coils<br>• mixing &amp; economizer dampers<br>• humidifiers and dehumidifiers<br>• energy-recovery wheels (ERV / HRV)<br>• chillers and DX systems, fans, VAV terminals":
    "• エアハンドリングユニット（AHUs）とその加熱／冷却コイル<br>• 混合＆外気冷房ダンパ<br>• 加湿器と除湿器<br>• エネルギー回収ホイール（ERV / HRV）<br>• チラーおよびDXシステム、ファン、VAV端末",
  "What they must decide":
    "彼らが決めなければならないこと",
  "• How much cooling or heating is needed<br>":
    "• どれだけの冷房または暖房が必要か<br>",
  "• How much of that cooling removes <b>moisture</b> rather than heat":
    "• その冷房のうち、熱ではなくどれだけが<b>水分</b>を除去しているか",
  "• How big the coil must be<br>":
    "• コイルはどれだけの大きさでなければならないか<br>",
  "• How much outside air to mix in<br>":
    "• 外気をどれだけ混合するか<br>",
  "• Whether condensation or coil freezing will occur":
    "• 結露やコイル凍結が発生するか",
  "Every one of those decisions is a point or a line on the psychrometric chart. That is why the chart — not the equipment catalogue — is where air-conditioning design actually happens.":
    "それらの判断はすべて、湿り空気線図上の点または線です。だからこそ、機器カタログではなく線図こそが、空調設計が実際に行われる場所なのです。",

  # ── Slide 3: Why designers rely on it ──
  "Why it exists":
    "なぜ存在するのか",
  "Why designers cannot work without it":
    "なぜ設計者がこれなしでは仕事ができないのか",
  'Air conditioning is not simply "making air colder". It is moving <b>moist air</b> from one state to another — and the psychrometric chart is the map of every state air can be in.':
    "空調は単に「空気を冷たくする」ことではありません。<b>湿り空気</b>をある状態から別の状態へ移すことであり — 湿り空気線図は、空気が取りうるあらゆる状態の地図です。",
  "Every process is a line":
    "あらゆるプロセスは線である",
  "Cooling, heating, humidifying, dehumidifying and mixing each move the air in a characteristic direction. Draw the line and you have described the process.":
    "冷却、加熱、加湿、除湿、混合は、それぞれ特徴的な方向に空気を動かします。線を引けば、そのプロセスを記述したことになります。",
  "Capacity comes from the chart":
    "容量は線図から得られる",
  "The energy content (enthalpy) at each end of the line, multiplied by airflow, is the kW the coil must deliver. That is how equipment gets sized.":
    "線の両端におけるエネルギー含有量（エンタルピー）に風量を掛けると、コイルが供給すべきkWになります。機器の容量はこの方法で決まります。",
  "Sensible vs latent":
    "顕熱と潜熱",
  "The chart separates cooling that lowers temperature from cooling that removes water. The two behave differently and must be sized separately.":
    "線図は、温度を下げる冷却と水分を除去する冷却を区別します。両者の挙動は異なり、別々に容量を算定しなければなりません。",
  "Physical limits are visible":
    "物理的な限界が一目でわかる",
  "The curved boundary is 100% humidity — air cannot go beyond it. It shows where condensation begins and where a coil would freeze.":
    "曲線の境界は100%湿度 — 空気はそれを超えることはできません。結露が始まる位置と、コイルが凍結する位置を示します。",

  # ── Slide 4: How to read it ──
  "How to read it":
    "読み方",
  "One dot is the state of the air":
    "一つの点が空気の状態である",
  "equal energy (enthalpy)":
    "等エネルギー（エンタルピー）",
  "100% RH":
    "100% RH",
  "(saturation)":
    "（飽和）",
  "Comfort zone (ASHRAE 55)":
    "快適域 (ASHRAE 55)",
  "Dry-bulb temperature  →":
    "乾球温度  →",
  "Moisture in the air  →":
    "空気中の水分  →",
  "<b>OA</b> outside air &nbsp;·&nbsp; <b>RA</b> return air &nbsp;·&nbsp; <b>MA</b> the mixture entering the coil &nbsp;·&nbsp; <b>SA</b> supply air delivered to the rooms. Dashed green = mixing; solid blue = the cooling coil. The <b style=\"color:#7c3aed\">violet diagonals</b> are lines of equal total energy: outside air here holds 79 kJ/kg against return air's 48, so it sits well above RA's line and costs more to condition — no free cooling today.":
    "<b>OA</b> 外気 &nbsp;·&nbsp; <b>RA</b> 還気 &nbsp;·&nbsp; <b>MA</b> コイルに入る混合空気 &nbsp;·&nbsp; <b>SA</b> 室へ供給される給気。破線の緑＝混合；実線の青＝冷却コイル。<b style=\"color:#7c3aed\">紫の対角線</b>は全エネルギー等値線：ここでの外気は還気の48に対して79 kJ/kgを持つため、RAの線よりかなり上にあり、処理コストが高い — 今日はフリークーリング不可。",
  "Two axes fix everything":
    "二つの軸ですべてが決まる",
  "Across is temperature; up is the actual weight of water the air carries. Pin both and the air's state is pinned — relative humidity, dew point, wet-bulb and energy content all follow from that single dot.":
    "横軸は温度、縦軸は空気が運ぶ水の実際の質量です。両方を固定すれば空気の状態が固定され — 相対湿度、露点、湿球、エネルギー含有量はすべて、その一点から導かれます。",
  "The curve is a hard limit":
    "曲線は越えられない限界である",
  "It marks 100% humidity — air can never sit above it. Drive the dot onto the curve and water comes out: that is the dew point, a wet coil, a fogged window.":
    "100%湿度を示します — 空気がその上に来ることはありません。点を曲線上まで持っていくと水分が出ます：それが露点であり、濡れたコイルであり、曇った窓です。",
  "Mixing is a straight line":
    "混合は直線である",
  "Outside and return air blend to a point that must land on the line joining them. How far along it sits gives the proportion: a third of the way from RA means a third outside air.":
    "外気と還気は、それらを結ぶ線上に必ず乗る点に混ざります。線上の位置が比率を示します：RAから三分の一の位置なら、外気が三分の一です。",
  "A coil pulls down and left":
    "コイルは左下へ引く",
  "Left removes temperature (sensible heat); down removes water (latent heat). The slope of MA→SA is the split between them — and that split is what sizing a coil actually means.":
    "左へは温度（顕熱）を除去し、下へは水分（潜熱）を除去します。MA→SAの傾きが両者の配分であり — その配分こそがコイル容量算定の本質です。",
  "Comfort is an area":
    "快適は領域である",
  "The acceptable range of temperature and humidity is drawn straight onto the chart. Supply air has to be chosen so the room lands inside that box — not merely at the right temperature.":
    "許容される温度と湿度の範囲が線図上に直接描かれます。給気は、部屋がその枠内に収まるように選ばなければなりません — 単に温度が合っているだけでは不十分です。",
  "Faults show up as bad geometry":
    "故障は歪んだ幾何として現れる",
  "If the mixed-air dot does not sit on the line between outside and return air, something is lying — a stuck damper or a drifting sensor. The picture catches what alarm limits miss.":
    "混合空気の点が外気と還気を結ぶ線上に乗っていなければ、何かが嘘をついています — 固着したダンパか、ドリフトしたセンサです。警報の上下限が見逃すものを、この図が捉えます。",

  # ── Slide 5: Worked example ──
  "Worked example":
    "計算例",
  "When is outside air free?":
    "外気はいつ無料になるのか？",
  "FREE COOLING":
    "フリークーリング",
  "both methods agree":
    "両手法が一致",
  "hot &amp; humid —":
    "高温多湿 —",
  "minimum OA":
    "最小OA",
  "equal energy as RA":
    "RAと等エネルギー",
  "dry-bulb only":
    "乾球のみ",
  "Numbers are total energy in kJ/kg. <b>RA</b> 24 °C / 50% RH = 48 &nbsp;·&nbsp; <b>A</b> 22 °C / 90% RH = 60 &nbsp;·&nbsp; <b>B</b> 28 °C / 10% RH = 34 &nbsp;·&nbsp; <b>OA</b> 33 °C / 18 g/kg = 79 (the outside air from the previous slide).":
    "数値は全エネルギー（kJ/kg）。<b>RA</b> 24 °C / 50% RH = 48 &nbsp;·&nbsp; <b>A</b> 22 °C / 90% RH = 60 &nbsp;·&nbsp; <b>B</b> 28 °C / 10% RH = 34 &nbsp;·&nbsp; <b>OA</b> 33 °C / 18 g/kg = 79（前のスライドの外気）。",
  "Two lines, four outcomes":
    "二本の線、四つの結果",
  "<b>Below-left of the violet line</b> — outside air holds less energy than the air coming back. Open the economizer and let mechanical cooling back off.":
    "<b>紫線の左下</b> — 外気は還気よりエネルギーが低い。外気冷房ダンパを開き、機械冷房を控えさせます。",
  "<b>Above-right</b> — outside air is a load, not a resource. Close to the minimum ventilation rate 62.1 demands and let the coil do the work.":
    "<b>右上</b> — 外気は資源ではなく負荷です。62.1が求める最小換気量まで閉じ、コイルに仕事をさせます。",
  "<b>Cool but muggy.</b> At 22 °C it is 2° cooler than the return, so a dry-bulb economizer opens — yet it carries 60 kJ/kg against 48. You have just imported latent load for the coil to wring back out.":
    "<b>涼しいが蒸し暑い。</b> 22 °Cは還気より2°低いので乾球外気冷房は開きます — しかしエネルギーは48に対して60 kJ/kg。コイルが再び絞り出さねばならない潜熱負荷を取り込んだことになります。",
  "<b>Warm but dry.</b> At 28 °C dry-bulb keeps it shut, yet 34 kJ/kg is far below the return. Energy says use it — though a dry-bulb high limit still guards this corner when the load is mostly sensible.":
    "<b>暖かいが乾燥している。</b> 28 °Cの乾球では閉じたままですが、34 kJ/kgは還気を大きく下回ります。エネルギーから見れば使うべき — ただし負荷がほぼ顕熱のとき、この領域は乾球上限がなおガードします。",
  "<b>On the line</b> the two streams are energy-neutral, so the choice falls to humidity and fan power. Sequences add a deadband here so the dampers do not hunt.":
    "<b>線上</b>では二つの気流はエネルギー的に中立なので、判断は湿度とファン動力に委ねられます。シーケンスはここに不感帯を設け、ダンパのハンチングを防ぎます。",
  "A dry-bulb sensor can only draw the <b>vertical</b> line; the chart draws the <b>diagonal</b>. The two shaded wedges are precisely where they disagree — and where energy is quietly lost.":
    "乾球センサが描けるのは<b>垂直</b>線だけです；線図は<b>対角</b>線を描きます。二つの陰影くさびは、まさに両者が食い違う場所 — そしてエネルギーが静かに失われる場所です。",

  # ── Slide 6: Why traditional BMS doesn't use it ──
  "The gap":
    "ギャップ",
  "Why traditional BMS never adopted the chart":
    "なぜ従来のBMSは線図を採用してこなかったのか",
  "Controls think in single numbers":
    "制御は単一の数値で考える",
  "A BMS is assembled from loops that each watch <b>one</b> value — a temperature, a pressure. A state point needs two readings judged together; classic controls had no concept of a two-dimensional air state.":
    "BMSは、それぞれが<b>一つの</b>値 — 温度や圧力 — を監視するループから組み立てられます。状態点には二つの計測値を合わせて判断する必要があり、従来の制御には二次元の空気状態という概念がありませんでした。",
  "The sensors often aren't there":
    "センサがそもそも無いことが多い",
  "You need temperature <b>and</b> humidity at the same place. Many units measure only dry-bulb on outside, mixed and return air — extra humidity sensors mean extra cost, wiring and calibration drift.":
    "同じ場所で温度<b>と</b>湿度の両方が必要です。多くのユニットは外気・混合気・還気で乾球だけを測っています — 湿度センサの追加は、コスト・配線・校正ドリフトの追加を意味します。",
  "The maths was too expensive":
    "計算コストが高すぎた",
  "Moisture content and energy content are non-linear and depend on barometric pressure. Older controllers had very little memory and no floating-point maths, so psychrometrics were simply left out.":
    "含湿量とエネルギー含有量は非線形で、気圧にも依存します。古いコントローラはメモリがごく少なく浮動小数点演算もなく、そのため湿り空気計算は単に省略されました。",
  "Graphics couldn't draw it":
    "グラフィックが描けなかった",
  "Early front-ends drew simple equipment schematics and time-series trends. A live chart with curves and overlays needs real rendering — so the chart stayed a static page in the design binder.":
    "初期のフロントエンドは単純な機器系統図と時系列トレンドだけを描いていました。曲線とオーバーレイ付きのライブ線図には本格的な描画が必要で — 線図は設計バインダーの中の静的なページのままでした。",
  "Design and operations are separate worlds":
    "設計と運用は別世界である",
  "The chart is used once, offline, to select equipment. What is handed to the controls contractor is a list of setpoints — not the physics behind them. The reasoning is lost at handover.":
    "線図は機器選定のため、オフラインで一度使われます。制御業者に渡されるのは設定値のリストであり — その背後にある物理ではありません。引き渡しで根拠が失われます。",
  "The simpler option was allowed":
    "より単純な選択肢が許されていた",
  "Codes permit dry-bulb-only economizer switching, so designs avoided humidity sensing that was historically unreliable. The easier, compliant path quietly became the default.":
    "規格は乾球のみの外気冷房切替を認めており、歴史的に信頼性の低かった湿度センシングを設計は避けてきました。より簡単で適合する道が、静かに既定となりました。",
  "The consequence":
    "その結果",
  "Operators end up diagnosing a <b>two-dimensional</b> problem — heat <i>and</i> moisture — by staring at separate one-dimensional trend lines. The information is there; the picture is not.":
    "オペレータは結局、<b>二次元</b>の問題 — 熱 <i>と</i> 水分 — を、別々の一次元トレンド線を見つめて診断することになります。情報はある；絵がないのです。",

  # ── Slide 7: Rulebooks ──
  "The rulebooks":
    "規則書",
  "Four ASHRAE standards, in one line each":
    "四つのASHRAE規格を、それぞれ一行で",
  "Will people feel comfortable?":
    "人は快適に感じるか？",
  "Is there enough outside air to stay healthy?":
    "健康を保てるだけの外気があるか？",
  "Are we doing it without wasting energy?":
    "エネルギーを無駄にせずに行えているか？",
  "How should the equipment be run to hit all three?":
    "三つすべてを達成するには、機器をどう運転すべきか？",
  ">The referee</div>":
    ">審判役</div>",
  ">Fresh air</div>":
    ">新鮮外気</div>",
  "<h3>The psychrometric chart</h3>":
    "<h3>湿り空気線図</h3>",
  '<div class="kick">The difference</div>':
    '<div class="kick">違い</div>',
  "Comfort and fresh air push toward <b>more</b> conditioning; energy pushes toward <b>less</b>. Guideline 36 is the rulebook that settles the argument.":
    "快適と新鮮外気は<b>より多くの</b>空調へ押し、エネルギーは<b>より少なく</b>へ押します。Guideline 36はその論争を決着させる規則書です。",

  # ── Slide 8: One sheet, four overlays ──
  "The big idea":
    "核心の考え",
  "One sheet — every rulebook draws on it":
    "一枚の紙 — すべての規則書がこの上に描く",
  "temperature × moisture — the only two axes":
    "温度 × 水分 — 必要な軸はこの二つだけ",
  "Every requirement around it becomes a shape on <b>these same axes</b>.":
    "周囲のあらゆる要求は、<b>この同じ軸</b>上の形になります。",
  "ASHRAE 55 draws an AREA":
    "ASHRAE 55 は領域を描く",
  "The comfort zone: the band of temperature and humidity occupants accept. The whole air-side of the standard becomes a region you must land the room inside.":
    "快適域：在室者が受け入れる温度と湿度の帯。規格の空気側全体が、部屋をその中に収めなければならない領域になります。",
  "ASHRAE 62.1 draws a POINT ON A LINE":
    "ASHRAE 62.1 は線上の点を描く",
  "The required outside-air fraction fixes exactly where the mixed-air dot must sit along the line between return and outside air.":
    "要求される外気比率が、混合空気の点が還気と外気を結ぶ線上のどこに乗らなければならないかを正確に決めます。",
  "ASHRAE 90.1 draws a DIRECTION":
    "ASHRAE 90.1 は方向を描く",
  "The violet diagonals are equal-energy lines. Which side of them outside air falls on decides whether it is the cheaper source, and how far the dot may be pushed before energy is wasted.":
    "紫の対角線は等エネルギー線です。外気がそのどちら側にあるかで、より安い熱源かどうか、そしてエネルギーを無駄にする前に点をどこまで押し出せるかが決まります。",
  "<i>Air-side only — fan power and chiller efficiency sit outside the chart.</i>":
    "<i>空気側のみ — ファン動力とチラー効率は線図の外側にあります。</i>",
  "Guideline 36 draws the PATH":
    "Guideline 36 は経路を描く",
  "The sequences are the route the dot travels through the day — economizer, coil, setpoint reset — from outside air all the way to the room.":
    "シーケンスは、点が一日を通じてたどる経路です — 外気冷房、コイル、設定値リセット — 外気から室まで。",
  "Read this the right way round":
    "正しい向きで読む",
  "The chart is not the small overlap left over where four standards happen to agree. It is the <b>common sheet</b> they are all drawn on — an area, a line, a direction and a path, sharing one pair of axes. Satisfy all four and the shapes simply fit together.":
    "線図は、四つの規格がたまたま一致する小さな重なりではありません。すべてが描かれる<b>共通の紙</b>です — 領域、線、方向、経路が、一対の軸を共有しています。四つすべてを満たせば、形は自然に収まります。",

  # ── Slide 9: One dot answers all four ──
  "How it satisfies each":
    "それぞれをどう満たすか",
  "One dot on the chart answers every question":
    "線図上の一点がすべての問いに答える",
  "55 — Comfort":
    "55 — 快適",
  "The comfort zone is drawn straight onto the chart. Is the room dot inside the acceptable temperature/humidity band — and if not, which way is it off?":
    "快適域は線図上に直接描かれます。室の点は許容温度／湿度帯の内側にあるか — そしてそうでなければ、どちらへ外れているか？",
  "62.1 — Fresh air":
    "62.1 — 新鮮外気",
  "The mixed-air dot must sit on the line between return and outside air. Its position along that line <i>is</i> the outside-air proportion.":
    "混合空気の点は還気と外気を結ぶ線上に乗らなければなりません。その線上の位置こそが外気比率です。",
  "90.1 — Energy":
    "90.1 — エネルギー",
  "Equal-energy lines reveal free cooling: when outside air holds less energy than return air, the economizer can meet the load with no mechanical cooling.":
    "等エネルギー線がフリークーリングを明らかにします：外気が還気よりエネルギーが低いとき、外気冷房は機械冷房なしで負荷を賄えます。",
  "G36 — Sequences":
    "G36 — シーケンス",
  "Visible proof the sequences land the dot inside the comfort zone, on the correct fresh-air line, along the lowest-energy path.":
    "シーケンスが点を快適域の内側、正しい新鮮外気線上、最低エネルギー経路に沿って着地させていることの可視化された証明。",
  "In one sentence: plot where the air IS, see where it MUST be, how it gets there, and whether it does so at least energy.":
    "一文で言えば：空気が「今どこにいるか」をプロットし、「どこにいなければならないか」、どうそこへ至るか、そして最低エネルギーでそうしているかを見る。",

  # ── Slide 10: Comparison ──
  "Trend-based BMS vs a psychrometric-aware BMS":
    "トレンドベースBMSと湿り空気対応BMS",
  "Question being asked":
    "問われていること",
  "Trend-based BMS (today)":
    "トレンドベースBMS（現状）",
  "Psychrometric-aware BMS":
    "湿り空気対応BMS",
  "What the operator sees":
    "オペレータが見るもの",
  "Several separate trend lines, read one at a time":
    "別々のトレンド線を、一つずつ読む",
  "One picture showing the air's actual state":
    "空気の実際の状態を示す一枚の絵",
  "Is the outside-air mix right?":
    "外気混合は正しいか？",
  "Inferred from the damper command":
    "ダンパ指令から推測する",
  "The mixed-air dot must fall on the outside–return line":
    "混合空気の点は外気–還気線上に乗らなければならない",
  "Can we free-cool right now?":
    "今すぐフリークーリングできるか？",
  "Usually temperature-only, so humid-but-cool and dry-but-warm hours are misjudged":
    "通常は温度のみなので、多湿だが涼しい時間帯と乾燥しているが暖かい時間帯を誤判定する",
  "Decided on true energy content of the air":
    "空気の真のエネルギー含有量で判断する",
  "Humidity control":
    "湿度制御",
  "A separate loop, often fighting the cooling loop":
    "別ループで、しばしば冷却ループと喧嘩する",
  "Heat and moisture handled as one state":
    "熱と水分を一つの状態として扱う",
  "Finding faults":
    "故障の発見",
  "Alarm limits on individual points":
    "個々のポイントの警報上限下限",
  "The shape of the process line exposes coil, damper and sensor faults":
    "プロセス線の形がコイル・ダンパ・センサの故障を露わにする",
  "Proving the standards":
    "規格への適合証明",
  "Checked manually, usually after the fact":
    "手動で確認、たいていは事後",
  "Comfort, ventilation and energy judged together, live":
    "快適・換気・エネルギーをリアルタイムに一体で判定",
  "None of this needs new field equipment beyond humidity sensing on the air streams. The difference is what the software does with readings the building is already taking.":
    "気流への湿度センシング以外に新しい現場機器は不要です。違いは、建物がすでに取っている計測値をソフトウェアがどう使うかにあります。",

  # ── Slide 11: What is it worth ──
  "Published evidence":
    "公表エビデンス",
  "What is it worth — and whose credit is it?":
    "どれだけの価値か — そして誰の功績か？",
  "What good air-side control is worth":
    "優れた空気側制御の価値",
  "The prize, and it belongs to the sequences. The chart does not produce these savings — it makes them verifiable.":
    "それが本丸であり、功績はシーケンスにあります。線図がこれらの削減を生むのではなく — 検証可能にするのです。",
  "What the chart itself contributes":
    "線図そのものが寄与すること",
  "Visibility: the missed hours and the broken parts that a temperature trend hides.":
    "可視化：温度トレンドが隠す、取り逃がした時間と壊れた部品。",
  "average HVAC saving from Guideline 36 sequences, against existing practice":
    "Guideline 36シーケンスによる平均HVAC削減率（既存運用比）",
  "Berkeley Lab, Spawn of EnergyPlus, medium office, 2022":
    "Berkeley Lab, Spawn of EnergyPlus, 中規模事務所, 2022",
  "Mostly static-pressure reset, zone minimum airflow and scheduling. Only the economizer and SAT logic land on the chart.":
    "主に静圧リセット、ゾーン最小風量、スケジュール。線図に乗るのは外気冷房とSATロジックだけ。",
  "<span>heating</span>":
    "<span>暖房</span>",
  "<span>cooling</span>":
    "<span>冷房</span>",
  "<span>shoulder</span>":
    "<span>中間期</span>",
  "seasonal saving from supervisory setpoint resets":
    "上位設定値リセットによる季節別削減",
  "PNNL large-office emulator, Chicago, 2024":
    "PNNL大規模事務所エミュレータ, Chicago, 2024",
  "Airside and plant-side combined — the chilled- and hot-water resets sit off the chart entirely.":
    "空気側とプラント側の合算 — 冷水・温水リセットは線図のまったく外側。",
  "median whole-building saving from fault detection, range 1–28%":
    "故障検知による全館削減の中央値、範囲1–28%",
  "Berkeley Lab Smart Energy Analytics Campaign, 6,500 buildings":
    "Berkeley Lab Smart Energy Analytics Campaign, 6,500棟",
  "The standard AHU rule set (NIST <b>APAR</b>, 28 mass- and energy-balance tests) is this chart's geometry in algebra. Covers all FDD, so read it as an upper bound.":
    "標準AHUルールセット（NIST <b>APAR</b>、28の質量・エネルギー収支試験）は、この線図の幾何を代数にしたものです。すべてのFDDを含むため、上限として読んでください。",
  "not a saving":
    "削減ではない",
  "of economizers found faulty in the field":
    "の外気冷房が現場で故障と判明",
  "New Buildings Institute; wider surveys average 58%":
    "New Buildings Institute；より広い調査では平均58%",
  "Opportunity size, not a return: how often the free-cooling asset is already broken. The chart is how you notice.":
    "機会の大きさであり、リターンではない：フリークーリング資産がすでに壊れている頻度。気づく手段が線図です。",
  "Where the saving actually comes from":
    "削減が実際にどこから来るか",
  "• Free-cooling hours <b>taken</b> rather than missed, because the decision is made on energy rather than temperature alone.":
    "• 温度だけでなくエネルギーで判断するため、フリークーリング時間を取り逃がさず<b>活用</b>する。",
  "• Outside air delivered at the rate 62.1 requires — not quietly at double it.":
    "• 外気を62.1が要求する量で供給する — 気づかぬうちに倍量ではない。",
  "• Supply air reset to follow the load instead of one fixed setpoint all year.":
    "• 通年固定の設定値ではなく、負荷に追従する給気リセット。",
  "• Coil, damper and sensor faults caught in days rather than at the next seasonal complaint.":
    "• コイル・ダンパ・センサ故障を、次の季節クレームまで待たず数日で捕捉。",
  "Read these numbers honestly":
    "これらの数字を正直に読む",
  "• Measure-level results from simulation and field studies — not a guarantee for any one building.":
    "• シミュレーションとフィールド研究の対策レベルの結果 — 特定の一棟への保証ではない。",
  "• They overlap and are not additive; the left pair and the right pair count much of the same energy twice.":
    "• 重複しており加算できない；左の組と右の組は同じエネルギーのかなりの部分を二重に数えている。",
  "• The largest savings come from the worst starting points.":
    "• 最大の削減は、最悪の出発点から来る。",
  "• Enthalpy switching is <b>not</b> automatically better — Taylor &amp; Cheng (2010) found fixed dry-bulb often wins once humidity sensors drift, hence 90.1-2013's accuracy limits.":
    "• エンタルピー切替が自動的に優れているわけでは<b>ない</b> — Taylor &amp; Cheng (2010)は、湿度センサがドリフトすると固定乾球の方がしばしば勝つことを示し、それが90.1-2013の精度制限につながった。",
  "The chart itself saves nothing. It makes the opportunity visible and the fault obvious — the saving is booked by the sequence that acts on it.":
    "線図そのものは何も削減しません。機会を可視化し故障を明白にする — 削減を計上するのは、それに基づいて動くシーケンスです。",

  # ── Slide 12: Closing ──
  "One chart. Four rulebooks.":
    "一枚の線図。四つの規則書。",
  "The psychrometric chart is not a design-only artifact. Bringing it into the building's controls turns anonymous setpoints back into visible physics — and puts comfort, air quality and energy into a single picture an operator can read at a glance.":
    "湿り空気線図は設計だけの遺物ではありません。建物の制御に取り込むことで、匿名の設定値が再び可視化された物理になり — 快適、空気質、エネルギーを、オペレータが一目で読める一枚の絵にまとめます。",
  "The computing power to draw it live has been ordinary for years. What has kept the chart out of the control room is habit and missing humidity sensors — not physics, and no longer technology.":
    "ライブで描く計算能力は、何年も前からありふれたものになっています。線図を制御室から遠ざけてきたのは習慣と欠落した湿度センサであり — 物理ではなく、もはや技術でもありません。",

  # ── Short nick labels (HTML-anchored to avoid substring collisions e.g. EnergyPlus / comfortable) ──
  'style="color:var(--amber)">Comfort</div>':
    'style="color:var(--amber)">快適</div>',
  'style="color:var(--accent)">Energy</div>':
    'style="color:var(--accent)">エネルギー</div>',
}
