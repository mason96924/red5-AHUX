# -*- coding: utf-8 -*-
# Korean (ko) strings for Psychart-HVAC-ASHRAE-Overview
STRINGS = {
  # --- Document title ---
  "The Psychrometric Chart — HVAC's master diagram and the missing BMS tool":
    "습공기선도 — HVAC의 핵심 선도이자 대부분의 BMS에 빠진 도구",

  # --- Slide 1: Title ---
  '<div class="t-brand">The Psychrometric Chart</div>': '<div class="t-brand">습공기선도</div>',
  "HVAC's master diagram — and the missing tool in most Building Management Systems":
    "HVAC의 핵심 선도 — 그리고 대부분의 건물관리시스템(BMS)에 빠진 도구",
  "Why equipment designers cannot work without it, why traditional BMS never adopted it, and how this one chart answers ASHRAE 55, 62.1, 90.1 and Guideline 36 at the same time.":
    "설비 설계자가 이것 없이는 일할 수 없는 이유, 전통적인 BMS가 채택하지 못한 이유, 그리고 이 하나의 선도가 ASHRAE 55, 62.1, 90.1과 Guideline 36을 동시에 어떻게 답하는지.",
  "Moist-air states": "습공기 상태",
  "Design tool": "설계 도구",
  "ASHRAE-aligned": "ASHRAE 정합",
  "Live controls": "실시간 제어",

  # --- Slide 2: Who uses it ---
  "Start here": "여기서 시작",
  "Who uses this chart — and on what equipment": "누가 이 선도를 쓰는가 — 그리고 어떤 설비에",
  "Long before a building is controlled, someone has to choose the machines that condition its air. Those people live on the psychrometric chart.":
    "건물이 제어되기 훨씬 전에, 누군가 그 공기를 조절할 기계를 선택해야 합니다. 그 사람들은 습공기선도 위에서 일합니다.",
  "Who they are": "그들은 누구인가",
  "\"HVAC equipment designers\" are the mechanical engineers who select and size air-conditioning equipment:":
    "\"HVAC 설비 설계자\"는 공조 설비를 선정하고 용량을 산정하는 기계 엔지니어입니다:",
  "• manufacturers' application engineers<br>• consulting / design engineers<br>• commissioning engineers who prove it works":
    "• 제조사 응용 엔지니어<br>• 컨설팅 / 설계 엔지니어<br>• 성능을 입증하는 시운전 엔지니어",
  "What \"HVAC equipment\" means": "\"HVAC 설비\"가 의미하는 것",
  "The machines that actually change the air:": "실제로 공기를 변화시키는 기계:",
  "• air-handling units (AHUs) and their heating / cooling coils<br>• mixing &amp; economizer dampers<br>• humidifiers and dehumidifiers<br>• energy-recovery wheels (ERV / HRV)<br>• chillers and DX systems, fans, VAV terminals":
    "• 공조기(AHUs)와 그 가열 / 냉각 코일<br>• 혼합 &amp; 이코노마이저 댐퍼<br>• 가습기와 제습기<br>• 열회수 휠(ERV / HRV)<br>• 칠러와 DX 시스템, 팬, VAV 터미널",
  "What they must decide": "그들이 결정해야 할 것",
  "• How much cooling or heating is needed<br>• How much of that cooling removes <b>moisture</b> rather than heat<br>• How big the coil must be<br>• How much outside air to mix in<br>• Whether condensation or coil freezing will occur":
    "• 얼마나 많은 냉각 또는 난방이 필요한가<br>• 그 냉각 중 열이 아니라 <b>수분</b>을 제거하는 양은 얼마인가<br>• 코일은 얼마나 커야 하는가<br>• 외기를 얼마나 혼합할 것인가<br>• 응축 또는 코일 동결이 발생할 것인가",
  "Every one of those decisions is a point or a line on the psychrometric chart. That is why the chart — not the equipment catalogue — is where air-conditioning design actually happens.":
    "그 결정 하나하나가 습공기선도 위의 점이나 선입니다. 그래서 설비 카탈로그가 아니라 이 선도 위에서 공조 설계가 실제로 이루어집니다.",

  # --- Slide 3: Why designers rely on it ---
  "Why it exists": "왜 존재하는가",
  "Why designers cannot work without it": "설계자가 이것 없이는 일할 수 없는 이유",
  "Air conditioning is not simply \"making air colder\". It is moving <b>moist air</b> from one state to another — and the psychrometric chart is the map of every state air can be in.":
    "공조는 단순히 \"공기를 차갑게 만드는 것\"이 아닙니다. <b>습공기</b>를 한 상태에서 다른 상태로 옮기는 것이며 — 습공기선도는 공기가 있을 수 있는 모든 상태의 지도입니다.",
  "Every process is a line": "모든 과정은 선이다",
  "Cooling, heating, humidifying, dehumidifying and mixing each move the air in a characteristic direction. Draw the line and you have described the process.":
    "냉각, 가열, 가습, 제습, 혼합은 각각 고유한 방향으로 공기를 이동합니다. 선을 그리면 그 과정을 설명한 것입니다.",
  "Capacity comes from the chart": "용량은 선도에서 나온다",
  "The energy content (enthalpy) at each end of the line, multiplied by airflow, is the kW the coil must deliver. That is how equipment gets sized.":
    "선 양 끝의 에너지 함량(엔탈피)에 풍량을 곱하면 코일이 공급해야 할 kW가 됩니다. 이렇게 설비 용량을 산정합니다.",
  "Sensible vs latent": "현열 대 잠열",
  "The chart separates cooling that lowers temperature from cooling that removes water. The two behave differently and must be sized separately.":
    "선도는 온도를 낮추는 냉각과 수분을 제거하는 냉각을 구분합니다. 둘은 다르게 거동하므로 각각 별도로 용량을 산정해야 합니다.",
  "Physical limits are visible": "물리적 한계가 보인다",
  "The curved boundary is 100% humidity — air cannot go beyond it. It shows where condensation begins and where a coil would freeze.":
    "곡선 경계는 100% 습도입니다 — 공기는 그 너머로 갈 수 없습니다. 응축이 시작되는 곳과 코일이 동결되는 곳을 보여줍니다.",

  # --- Slide 4: How to read it ---
  "How to read it": "읽는 방법",
  "One dot is the state of the air": "하나의 점이 공기의 상태다",
  "equal energy (enthalpy)": "등에너지 (엔탈피)",
  "(saturation)": "(포화)",
  "Comfort zone (ASHRAE 55)": "쾌적 영역 (ASHRAE 55)",
  "Dry-bulb temperature  →": "건구온도  →",
  "Moisture in the air  →": "공기 중 수분  →",
  "<b>OA</b> outside air &nbsp;·&nbsp; <b>RA</b> return air &nbsp;·&nbsp; <b>MA</b> the mixture entering the coil &nbsp;·&nbsp; <b>SA</b> supply air delivered to the rooms. Dashed green = mixing; solid blue = the cooling coil. The <b style=\"color:#7c3aed\">violet diagonals</b> are lines of equal total energy: outside air here holds 79 kJ/kg against return air's 48, so it sits well above RA's line and costs more to condition — no free cooling today.":
    "<b>OA</b> 외기 &nbsp;·&nbsp; <b>RA</b> 환기 &nbsp;·&nbsp; <b>MA</b> 코일로 들어가는 혼합공기 &nbsp;·&nbsp; <b>SA</b> 실내로 공급되는 급기. 녹색 점선 = 혼합; 파란 실선 = 냉각 코일. <b style=\"color:#7c3aed\">보라 대각선</b>은 등총에너지 선: 여기서 외기는 79 kJ/kg로 환기의 48보다 높아 RA 선 위에 있고 조화 비용이 더 듭니다 — 오늘은 프리쿨링 없음.",
  "Two axes fix everything": "두 축이 모든 것을 고정한다",
  "Across is temperature; up is the actual weight of water the air carries. Pin both and the air's state is pinned — relative humidity, dew point, wet-bulb and energy content all follow from that single dot.":
    "가로축은 온도, 세로축은 공기가 운반하는 실제 수분량입니다. 둘을 고정하면 공기 상태가 고정됩니다 — 상대습도, 노점, 습구, 에너지 함량이 모두 그 한 점에서 따라옵니다.",
  "The curve is a hard limit": "곡선은 절대 한계다",
  "It marks 100% humidity — air can never sit above it. Drive the dot onto the curve and water comes out: that is the dew point, a wet coil, a fogged window.":
    "100% 습도를 표시합니다 — 공기는 그 위에 있을 수 없습니다. 점을 곡선까지 밀어 올리면 물이 나옵니다: 그것이 노점, 젖은 코일, 김 서린 창입니다.",
  "Mixing is a straight line": "혼합은 직선이다",
  "Outside and return air blend to a point that must land on the line joining them. How far along it sits gives the proportion: a third of the way from RA means a third outside air.":
    "외기와 환기는 둘을 잇는 선 위의 한 점으로 섞입니다. 그 위치의 거리가 비율입니다: RA에서 1/3 지점이면 외기 1/3입니다.",
  "A coil pulls down and left": "코일은 왼쪽 아래로 당긴다",
  "Left removes temperature (sensible heat); down removes water (latent heat). The slope of MA→SA is the split between them — and that split is what sizing a coil actually means.":
    "왼쪽은 온도(현열)를, 아래는 수분(잠열)을 제거합니다. MA→SA의 기울기가 그 분할이며 — 그 분할이 곧 코일 용량 산정의 의미입니다.",
  "Comfort is an area": "쾌적은 영역이다",
  "The acceptable range of temperature and humidity is drawn straight onto the chart. Supply air has to be chosen so the room lands inside that box — not merely at the right temperature.":
    "허용 가능한 온·습도 범위가 선도 위에 바로 그려집니다. 급기는 실내가 그 상자 안에 들어오도록 선택되어야 합니다 — 단지 올바른 온도만이 아닙니다.",
  "Faults show up as bad geometry": "고장은 잘못된 기하로 드러난다",
  "If the mixed-air dot does not sit on the line between outside and return air, something is lying — a stuck damper or a drifting sensor. The picture catches what alarm limits miss.":
    "혼합공기 점이 외기와 환기 사이 선 위에 있지 않으면, 무언가가 거짓입니다 — 고착된 댐퍼나 드리프트된 센서. 그림이 경보 한계가 놓치는 것을 잡아냅니다.",

  # --- Slide 5: Free-cooling decision ---
  "Worked example": "계산 예제",
  "When is outside air free?": "외기는 언제 공짜인가?",
  "FREE COOLING": "프리쿨링",
  "both methods agree": "두 방법 모두 동의",
  "hot &amp; humid —": "고온 다습 —",
  "minimum OA": "최소 OA",
  "equal energy as RA": "RA와 등에너지",
  "dry-bulb only": "건구온도만",
  "Numbers are total energy in kJ/kg. <b>RA</b> 24 °C / 50% RH = 48 &nbsp;·&nbsp; <b>A</b> 22 °C / 90% RH = 60 &nbsp;·&nbsp; <b>B</b> 28 °C / 10% RH = 34 &nbsp;·&nbsp; <b>OA</b> 33 °C / 18 g/kg = 79 (the outside air from the previous slide).":
    "숫자는 총에너지(kJ/kg)입니다. <b>RA</b> 24 °C / 50% RH = 48 &nbsp;·&nbsp; <b>A</b> 22 °C / 90% RH = 60 &nbsp;·&nbsp; <b>B</b> 28 °C / 10% RH = 34 &nbsp;·&nbsp; <b>OA</b> 33 °C / 18 g/kg = 79 (이전 슬라이드의 외기).",
  "Two lines, four outcomes": "두 선, 네 가지 결과",
  "<b>Below-left of the violet line</b> — outside air holds less energy than the air coming back. Open the economizer and let mechanical cooling back off.":
    "<b>보라선 왼쪽 아래</b> — 외기가 환기보다 에너지가 적습니다. 이코노마이저를 열고 기계 냉각을 줄이십시오.",
  "<b>Above-right</b> — outside air is a load, not a resource. Close to the minimum ventilation rate 62.1 demands and let the coil do the work.":
    "<b>오른쪽 위</b> — 외기는 자원이 아니라 부하입니다. 62.1이 요구하는 최소 환기량까지 닫고 코일에 일을 맡기십시오.",
  "<b>Cool but muggy.</b> At 22 °C it is 2° cooler than the return, so a dry-bulb economizer opens — yet it carries 60 kJ/kg against 48. You have just imported latent load for the coil to wring back out.":
    "<b>시원하지만 후텁지근.</b> 22 °C로 환기보다 2° 낮아 건구 이코노마이저는 열리지만 — 에너지는 48 대비 60 kJ/kg입니다. 코일이 다시 짜내야 할 잠열 부하를 들여온 것입니다.",
  "<b>Warm but dry.</b> At 28 °C dry-bulb keeps it shut, yet 34 kJ/kg is far below the return. Energy says use it — though a dry-bulb high limit still guards this corner when the load is mostly sensible.":
    "<b>따뜻하지만 건조.</b> 28 °C 건구는 닫아 두지만, 34 kJ/kg는 환기보다 훨씬 낮습니다. 에너지는 쓰라고 합니다 — 다만 부하가 대부분 현열일 때 건구 상한은 이 코너를 여전히 지킵니다.",
  "<b>On the line</b> the two streams are energy-neutral, so the choice falls to humidity and fan power. Sequences add a deadband here so the dampers do not hunt.":
    "<b>선 위</b>에서는 두 기류가 에너지 중립이므로, 선택은 습도와 팬 동력으로 넘어갑니다. 시퀀스는 댐퍼 헌팅을 막기 위해 여기에 데드밴드를 둡니다.",
  "A dry-bulb sensor can only draw the <b>vertical</b> line; the chart draws the <b>diagonal</b>. The two shaded wedges are precisely where they disagree — and where energy is quietly lost.":
    "건구 센서는 <b>수직</b>선만 그릴 수 있고, 선도는 <b>대각선</b>을 그립니다. 두 음영 쐐기가 바로 둘이 어긋나는 곳 — 그리고 에너지가 조용히 낭비되는 곳입니다.",

  # --- Slide 6: Why traditional BMS doesn't use it ---
  "The gap": "간극",
  "Why traditional BMS never adopted the chart": "전통적인 BMS가 선도를 채택하지 못한 이유",
  "Controls think in single numbers": "제어는 단일 숫자로 생각한다",
  "A BMS is assembled from loops that each watch <b>one</b> value — a temperature, a pressure. A state point needs two readings judged together; classic controls had no concept of a two-dimensional air state.":
    "BMS는 각각 <b>하나</b>의 값 — 온도, 압력 — 을 감시하는 루프로 조립됩니다. 상태점은 두 측정값을 함께 판단해야 하는데, 고전 제어에는 2차원 공기 상태 개념이 없었습니다.",
  "The sensors often aren't there": "센서가 없는 경우가 많다",
  "You need temperature <b>and</b> humidity at the same place. Many units measure only dry-bulb on outside, mixed and return air — extra humidity sensors mean extra cost, wiring and calibration drift.":
    "같은 위치에서 온도와 습도가 <b>모두</b> 필요합니다. 많은 유닛은 외기·혼합·환기에서 건구만 측정합니다 — 추가 습도 센서는 비용, 배선, 교정 드리프트를 더합니다.",
  "The maths was too expensive": "수학이 너무 비쌌다",
  "Moisture content and energy content are non-linear and depend on barometric pressure. Older controllers had very little memory and no floating-point maths, so psychrometrics were simply left out.":
    "수분량과 에너지량은 비선형이며 기압에 의존합니다. 구형 컨트롤러는 메모리가 거의 없고 부동소수점 연산이 없어, 습공기 계산은 그냥 빠졌습니다.",
  "Graphics couldn't draw it": "그래픽이 그릴 수 없었다",
  "Early front-ends drew simple equipment schematics and time-series trends. A live chart with curves and overlays needs real rendering — so the chart stayed a static page in the design binder.":
    "초기 프론트엔드는 단순 설비 계통도와 시계열 트렌드만 그렸습니다. 곡선과 오버레이가 있는 실시간 선도는 실제 렌더링이 필요해 — 선도는 설계 바인더의 정적 페이지로 남았습니다.",
  "Design and operations are separate worlds": "설계와 운영은 별개의 세계다",
  "The chart is used once, offline, to select equipment. What is handed to the controls contractor is a list of setpoints — not the physics behind them. The reasoning is lost at handover.":
    "선도는 설비 선정을 위해 오프라인으로 한 번 쓰입니다. 제어 시공사에 넘겨지는 것은 설정값 목록이지 — 그 뒤의 물리가 아닙니다. 논리는 인수인계에서 사라집니다.",
  "The simpler option was allowed": "더 단순한 선택이 허용되었다",
  "Codes permit dry-bulb-only economizer switching, so designs avoided humidity sensing that was historically unreliable. The easier, compliant path quietly became the default.":
    "코드가 건구만으로 이코노마이저 전환을 허용하므로, 설계는 역사적으로 신뢰성이 낮았던 습도 감지를 피했습니다. 쉽고 적합한 경로가 조용히 기본값이 되었습니다.",
  "The consequence": "그 결과",
  "Operators end up diagnosing a <b>two-dimensional</b> problem — heat <i>and</i> moisture — by staring at separate one-dimensional trend lines. The information is there; the picture is not.":
    "운영자는 결국 <b>2차원</b> 문제 — 열 <i>그리고</i> 수분 — 를 서로 떨어진 1차원 트렌드 선을 보며 진단하게 됩니다. 정보는 있지만, 그림은 없습니다.",

  # --- Slide 7: Rulebooks ---
  "The rulebooks": "규칙집",
  "Four ASHRAE standards, in one line each": "네 가지 ASHRAE 표준, 각 한 줄로",
  ">Comfort</div>": ">쾌적</div>",
  "Will people feel comfortable?": "사람들이 쾌적하게 느낄까?",
  ">Fresh air</div>": ">신선 외기</div>",
  "Is there enough outside air to stay healthy?": "건강을 유지할 외기가 충분한가?",
  ">Energy</div>": ">에너지</div>",
  "Are we doing it without wasting energy?": "에너지를 낭비하지 않고 하고 있는가?",
  ">The referee</div>": ">중재자</div>",
  "How should the equipment be run to hit all three?": "세 가지를 모두 맞추려면 설비를 어떻게 운전해야 하는가?",
  "Comfort and fresh air push toward <b>more</b> conditioning; energy pushes toward <b>less</b>. Guideline 36 is the rulebook that settles the argument.":
    "쾌적과 신선 외기는 <b>더 많은</b> 조화를, 에너지는 <b>더 적은</b> 조화를 밀고 갑니다. Guideline 36이 그 논쟁을 정리하는 규칙집입니다.",

  # --- Slide 8: One sheet, four overlays ---
  "The big idea": "핵심 아이디어",
  "One sheet — every rulebook draws on it": "한 장의 용지 — 모든 규칙집이 그 위에 그린다",
  "<h3>The psychrometric chart</h3>": "<h3>습공기선도</h3>",
  "temperature × moisture — the only two axes": "온도 × 수분 — 단 두 축",
  "Every requirement around it becomes a shape on <b>these same axes</b>.":
    "주변의 모든 요구사항이 <b>이 같은 축</b> 위의 도형이 됩니다.",
  "ASHRAE 55 draws an AREA": "ASHRAE 55는 영역을 그린다",
  "The comfort zone: the band of temperature and humidity occupants accept. The whole air-side of the standard becomes a region you must land the room inside.":
    "쾌적 영역: 재실자가 수용하는 온·습도 대역. 표준의 공기측 전체가 실내를 그 안에 안착시켜야 할 영역이 됩니다.",
  "ASHRAE 62.1 draws a POINT ON A LINE": "ASHRAE 62.1은 선 위의 점을 그린다",
  "The required outside-air fraction fixes exactly where the mixed-air dot must sit along the line between return and outside air.":
    "요구 외기 비율이 혼합공기 점이 환기와 외기 사이 선 어디에 있어야 하는지를 정확히 고정합니다.",
  "ASHRAE 90.1 draws a DIRECTION": "ASHRAE 90.1은 방향을 그린다",
  "The violet diagonals are equal-energy lines. Which side of them outside air falls on decides whether it is the cheaper source, and how far the dot may be pushed before energy is wasted.":
    "보라 대각선은 등에너지 선입니다. 외기가 어느 쪽에 떨어지느냐가 더 싼 공급원인지, 그리고 에너지가 낭비되기 전에 점을 얼마나 밀 수 있는지를 결정합니다.",
  "<i>Air-side only — fan power and chiller efficiency sit outside the chart.</i>":
    "<i>공기측만 — 팬 동력과 칠러 효율은 선도 밖에 있습니다.</i>",
  "Guideline 36 draws the PATH": "Guideline 36은 경로를 그린다",
  "The sequences are the route the dot travels through the day — economizer, coil, setpoint reset — from outside air all the way to the room.":
    "시퀀스는 점이 하루 동안 이동하는 경로입니다 — 이코노마이저, 코일, 설정값 리셋 — 외기에서 실내까지.",
  "Read this the right way round": "올바른 방향으로 읽으십시오",
  "The chart is not the small overlap left over where four standards happen to agree. It is the <b>common sheet</b> they are all drawn on — an area, a line, a direction and a path, sharing one pair of axes. Satisfy all four and the shapes simply fit together.":
    "선도는 네 표준이 우연히 일치하는 작은 겹침이 아닙니다. 모두가 그려지는 <b>공통 용지</b>입니다 — 영역, 선, 방향, 경로가 한 쌍의 축을 공유합니다. 넷을 모두 만족하면 도형들이 그냥 맞아떨어집니다.",

  # --- Slide 9: One dot answers all four ---
  "How it satisfies each": "각각을 어떻게 만족하는가",
  "One dot on the chart answers every question": "선도 위 한 점이 모든 질문에 답한다",
  "55 — Comfort": "55 — 쾌적",
  "The comfort zone is drawn straight onto the chart. Is the room dot inside the acceptable temperature/humidity band — and if not, which way is it off?":
    "쾌적 영역이 선도 위에 바로 그려집니다. 실내 점이 허용 온·습도 대역 안에 있는가 — 아니면 어느 쪽으로 벗어났는가?",
  "62.1 — Fresh air": "62.1 — 신선 외기",
  "The mixed-air dot must sit on the line between return and outside air. Its position along that line <i>is</i> the outside-air proportion.":
    "혼합공기 점은 환기와 외기 사이 선 위에 있어야 합니다. 그 선 위의 위치가 곧 외기 비율입니다.",
  "90.1 — Energy": "90.1 — 에너지",
  "Equal-energy lines reveal free cooling: when outside air holds less energy than return air, the economizer can meet the load with no mechanical cooling.":
    "등에너지 선이 프리쿨링을 드러냅니다: 외기가 환기보다 에너지가 적으면, 이코노마이저가 기계 냉각 없이 부하를 감당할 수 있습니다.",
  "G36 — Sequences": "G36 — 시퀀스",
  "Visible proof the sequences land the dot inside the comfort zone, on the correct fresh-air line, along the lowest-energy path.":
    "시퀀스가 점을 쾌적 영역 안, 올바른 외기 선 위, 최저 에너지 경로로 안착시킨다는 가시적 증거.",
  "In one sentence: plot where the air IS, see where it MUST be, how it gets there, and whether it does so at least energy.":
    "한 문장으로: 공기가 어디에 있는지 그리고, 어디에 있어야 하는지, 어떻게 가는지, 최소 에너지로 가는지를 보십시오.",

  # --- Slide 10: Comparison ---
  '<div class="kick">The difference</div>': '<div class="kick">차이점</div>',
  "Trend-based BMS vs a psychrometric-aware BMS": "트렌드 기반 BMS 대 습공기 인식 BMS",
  "Question being asked": "묻는 질문",
  "Trend-based BMS (today)": "트렌드 기반 BMS (현재)",
  "Psychrometric-aware BMS": "습공기 인식 BMS",
  "What the operator sees": "운영자가 보는 것",
  "Several separate trend lines, read one at a time": "서로 떨어진 여러 트렌드 선, 하나씩 읽음",
  "One picture showing the air's actual state": "공기의 실제 상태를 보여주는 한 장의 그림",
  "Is the outside-air mix right?": "외기 혼합이 올바른가?",
  "Inferred from the damper command": "댐퍼 지령에서 추론",
  "The mixed-air dot must fall on the outside–return line": "혼합공기 점은 외기–환기 선 위에 있어야 함",
  "Can we free-cool right now?": "지금 프리쿨링할 수 있는가?",
  "Usually temperature-only, so humid-but-cool and dry-but-warm hours are misjudged":
    "보통 온도만으로, 습하고 시원한 시간과 건조하고 따뜻한 시간을 오판",
  "Decided on true energy content of the air": "공기의 실제 에너지 함량으로 결정",
  "Humidity control": "습도 제어",
  "A separate loop, often fighting the cooling loop": "별도 루프, 종종 냉각 루프와 충돌",
  "Heat and moisture handled as one state": "열과 수분을 하나의 상태로 처리",
  "Finding faults": "고장 탐지",
  "Alarm limits on individual points": "개별 점에 대한 경보 한계",
  "The shape of the process line exposes coil, damper and sensor faults":
    "과정 선의 형태가 코일·댐퍼·센서 고장을 드러냄",
  "Proving the standards": "표준 입증",
  "Checked manually, usually after the fact": "수동 확인, 보통 사후",
  "Comfort, ventilation and energy judged together, live": "쾌적·환기·에너지를 실시간으로 함께 판단",
  "None of this needs new field equipment beyond humidity sensing on the air streams. The difference is what the software does with readings the building is already taking.":
    "기류에 습도 감지 이상을 넘는 새 현장 설비는 필요 없습니다. 차이는 건물이 이미 수집하는 측정값으로 소프트웨어가 무엇을 하느냐입니다.",

  # --- Slide 11: What is it worth ---
  "Published evidence": "공개된 근거",
  "What is it worth — and whose credit is it?": "얼마나 가치가 있는가 — 그리고 누구의 공인가?",
  "What good air-side control is worth": "좋은 공기측 제어의 가치",
  "The prize, and it belongs to the sequences. The chart does not produce these savings — it makes them verifiable.":
    "그 성과는 시퀀스의 몫입니다. 선도가 이 절감을 만들어내는 것이 아니라 — 검증 가능하게 만듭니다.",
  "What the chart itself contributes": "선도 자체가 기여하는 것",
  "Visibility: the missed hours and the broken parts that a temperature trend hides.":
    "가시성: 온도 트렌드가 숨기는 놓친 시간과 고장 부위.",
  "average HVAC saving from Guideline 36 sequences, against existing practice":
    "기존 관행 대비 Guideline 36 시퀀스의 평균 HVAC 절감",
  "Berkeley Lab, Spawn of EnergyPlus, medium office, 2022":
    "Berkeley Lab, Spawn of EnergyPlus, 중형 오피스, 2022",
  "Mostly static-pressure reset, zone minimum airflow and scheduling. Only the economizer and SAT logic land on the chart.":
    "대부분 정압 리셋, 존 최소 풍량, 스케줄링. 선도에 해당하는 것은 이코노마이저와 SAT 로직뿐입니다.",
  "<span>heating</span>": "<span>난방</span>",
  "<span>cooling</span>": "<span>냉각</span>",
  "<span>shoulder</span>": "<span>중간기</span>",
  "seasonal saving from supervisory setpoint resets": "상위 설정값 리셋에 의한 계절별 절감",
  "PNNL large-office emulator, Chicago, 2024":
    "PNNL 대형 오피스 에뮬레이터, Chicago, 2024",
  "Airside and plant-side combined — the chilled- and hot-water resets sit off the chart entirely.":
    "공기측과 플랜트측 합산 — 냉수·온수 리셋은 선도 완전히 밖에 있습니다.",
  "median whole-building saving from fault detection, range 1–28%":
    "고장 탐지에 의한 건물 전체 중앙값 절감, 범위 1–28%",
  "Berkeley Lab Smart Energy Analytics Campaign, 6,500 buildings":
    "Berkeley Lab Smart Energy Analytics Campaign, 6,500개 건물",
  "The standard AHU rule set (NIST <b>APAR</b>, 28 mass- and energy-balance tests) is this chart's geometry in algebra. Covers all FDD, so read it as an upper bound.":
    "표준 AHU 규칙 세트(NIST <b>APAR</b>, 질량·에너지 수지 시험 28개)는 이 선도의 기하를 대수로 옮긴 것입니다. 모든 FDD를 포함하므로 상한으로 읽으십시오.",
  "not a saving": "절감이 아님",
  "of economizers found faulty in the field": "현장에서 고장으로 발견된 이코노마이저 비율",
  "New Buildings Institute; wider surveys average 58%":
    "New Buildings Institute; 더 넓은 조사 평균 58%",
  "Opportunity size, not a return: how often the free-cooling asset is already broken. The chart is how you notice.":
    "기회 규모이지 수익이 아님: 프리쿨링 자산이 이미 고장난 빈도. 선도가 알아차리는 방법입니다.",
  "Where the saving actually comes from": "절감이 실제로 나오는 곳",
  "• Free-cooling hours <b>taken</b> rather than missed, because the decision is made on energy rather than temperature alone.":
    "• 온도만이 아니라 에너지로 결정하기 때문에, 놓치지 않고 <b>취한</b> 프리쿨링 시간.",
  "• Outside air delivered at the rate 62.1 requires — not quietly at double it.":
    "• 62.1이 요구하는 비율로 공급되는 외기 — 조용히 두 배가 아님.",
  "• Supply air reset to follow the load instead of one fixed setpoint all year.":
    "• 연중 고정 설정값 대신 부하를 따르는 급기 리셋.",
  "• Coil, damper and sensor faults caught in days rather than at the next seasonal complaint.":
    "• 다음 계절 민원 때가 아니라 며칠 안에 잡히는 코일·댐퍼·센서 고장.",
  "Read these numbers honestly": "이 숫자를 정직하게 읽으십시오",
  "• Measure-level results from simulation and field studies — not a guarantee for any one building.":
    "• 시뮬레이션과 현장 연구의 조치 수준 결과 — 개별 건물에 대한 보장이 아님.",
  "• They overlap and are not additive; the left pair and the right pair count much of the same energy twice.":
    "• 겹치며 합산할 수 없음; 왼쪽 쌍과 오른쪽 쌍이 같은 에너지의 상당 부분을 두 번 셉니다.",
  "• The largest savings come from the worst starting points.":
    "• 가장 큰 절감은 최악의 출발점에서 나옵니다.",
  "• Enthalpy switching is <b>not</b> automatically better — Taylor &amp; Cheng (2010) found fixed dry-bulb often wins once humidity sensors drift, hence 90.1-2013's accuracy limits.":
    "• 엔탈피 전환이 자동으로 더 나은 것은 <b>아님</b> — Taylor &amp; Cheng (2010)은 습도 센서가 드리프트하면 고정 건구가 종종 이긴다고 밝혔고, 그래서 90.1-2013의 정확도 제한이 있습니다.",
  "The chart itself saves nothing. It makes the opportunity visible and the fault obvious — the saving is booked by the sequence that acts on it.":
    "선도 자체는 아무것도 절감하지 않습니다. 기회를 보이게 하고 고장을 분명하게 할 뿐입니다 — 절감은 그에 따라 동작하는 시퀀스가 기록합니다.",

  # --- Slide 12: Closing ---
  "One chart. Four rulebooks.": "하나의 선도. 네 권의 규칙집.",
  "The psychrometric chart is not a design-only artifact. Bringing it into the building's controls turns anonymous setpoints back into visible physics — and puts comfort, air quality and energy into a single picture an operator can read at a glance.":
    "습공기선도는 설계 전용 산출물이 아닙니다. 건물 제어에 넣으면 익명의 설정값이 다시 보이는 물리로 바뀌고 — 쾌적, 공기질, 에너지를 운영자가 한눈에 읽을 수 있는 한 장의 그림으로 만듭니다.",
  "The computing power to draw it live has been ordinary for years. What has kept the chart out of the control room is habit and missing humidity sensors — not physics, and no longer technology.":
    "실시간으로 그릴 컴퓨팅 능력은 수년째 평범한 수준입니다. 선도를 제어실 밖으로 둔 것은 습관과 빠진 습도 센서입니다 — 물리가 아니고, 더 이상 기술도 아닙니다.",
}
