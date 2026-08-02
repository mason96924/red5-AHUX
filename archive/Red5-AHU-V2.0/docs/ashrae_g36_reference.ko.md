# ASHRAE Guideline 36 — 참조 문서

> *High-Performance Sequences of Operation for HVAC Systems (HVAC 시스템을 위한 고성능 운전 시퀀스)*
> ANSI/ASHRAE Guideline 36 (최신판: G36-2021, 부록 a는 2023 발행)

---

## TL;DR

Guideline 36은 **HVAC 제어 로직의 운영자 매뉴얼**입니다. AHU, VAV, 냉동기, 보일러가 하루 중 매 순간 무엇을 해야 하는지 — 언제 이코노마이저를 열지, 언제 급기 온도 설정점을 재정의할지, 언제 재실 모드를 전환할지, 언제 경보를 낼지 — 를 정확히 알려 줍니다.

대부분의 현대 BAS 시공사(Delta Controls, Trane, Distech, JCI, Honeywell, Siemens)는 "G36 준수" 시퀀스를 기본 출고합니다. Red5 Studio의 역할은 (a) 실제 컨트롤러가 이를 따르고 있는지 알려 주는 것과 (b) 현장 현실이 요구할 때 이를 재정의할 수 있게 하는 것입니다.

대시보드의 G36 타임라인 스트립(`#g36-timeline-strip`)은 최근 4시간／24시간의 실제 텔레메트리를 7개의 G36 모드 상태로 매핑하여 드리프트를 한눈에 볼 수 있게 합니다.

---

## 1. 일곱 가지 G36 운전 모드

G36 §5.1은 모든 AHU가 보고해야 하는 일곱 가지 상호 배타적 모드를 정의합니다.

| # | 모드 | 트리거 | Red5 표시 |
|---|---|---|---|
| 1 | **Occupied(재실)**      | 스케줄 시간대, 재실 센서 ON | 초록 |
| 2 | **Warm-up(예열)**       | 재실 전, 존 T가 아침 세트백 미만 | 주황 |
| 3 | **Cool-down(예냉)**     | 재실 전, 존 T가 저녁 세트백 초과 | 하늘색 |
| 4 | **Setback(세트백)**     | 비재실, T가 협대역 밖 | 회색 |
| 5 | **Setup(셋업)**         | 비재실, T 이탈 없음 | 옅은 회색 |
| 6 | **Unoccupied(비재실)**  | 시간 외, 팬 OFF | 다크 슬레이트 |
| 7 | **Freeze protect(동결 방지)**| 코일 온도 < 4 °C | 빨강 |

이들은 G36 타임라인 스트립 범례에 그대로 대응됩니다. 스케줄이 "UNOCCUPIED"인데 어떤 AHU가 초록색 "OCCUPIED"를 표시한다면, 이는 Red5가 댐퍼 고착／VFD 고장／폭주한 재정의 잠금을 잡아내는 첫 번째 단서입니다.

---

## 2. 설정점 리셋(Trim & Respond — T&R)

G36 §5.1.14는 급기 온도／급기 압력／냉수 온도／온수 온도를 리셋하는 표준 방식으로 **트림 앤드 리스폰드(trim-and-respond)**를 정의합니다. 알고리즘:

```
every Tick (default 2 min):
    if zone_request_count >= I:
        SP += SP_res * (zone_request_count / I)  # respond
    else:
        SP -= SP_trim                            # trim
    clamp(SP, min, max)
```

| 매개변수 | 기본값 | Red5에서의 처리 |
|-----------|---------|--------------|
| `Tick`             | 2 min   | 하드코딩 |
| `I` (importance)   | 2 zones | AHU별 밴드 |
| `SP_res` (respond) | +0.3 °C | 밴드별 |
| `SP_trim` (trim)   | -0.1 °C | 밴드별 |
| `Delay_initial`    | 5 min   | 밴드별 |

대시보드의 밴드 시프트 슬라이더는 존 그룹별로 `SP_res`와 `SP_trim`을 조정합니다 — [band_guide.md](/docs#band) 참조.

---

## 3. 존 리퀘스트(Zone requests)

G36 존은 **현재 몇 개의 리퀘스트를 가지고 있는지** 보고함으로써 설정점 변경에 "투표"합니다.

- **냉방 리퀘스트(Cooling request)**: 존 T > 설정점 + 1 °C → 냉방 리퀘스트 +1
- **압력 리퀘스트(Pressure request)**: 댐퍼 위치 > 95 % 이고 존 환기 부족 → 급기 압력 리퀘스트 +1
- **정압 리퀘스트(Static-pressure request)**: VAV 입구 댐퍼 > 95 % 완전 개방 → 팬 속도 리퀘스트 +1
- **난방 리퀘스트(Heating request)**: 존 T < 설정점 - 1 °C → 난방 리퀘스트 +1(RH 코일)

각 AHU는 Tick마다 모든 VAV 리퀘스트를 수집하고, 그 개수에 따라 트림 또는 리스폰드합니다. Red5의 `/api/data`는 이를 VAV별 `req_cool`, `req_press`, `req_heat`, `req_fan`으로 노출합니다.

---

## 4. AHU 시퀀스(§5.16)

### 5.16.1 급기 온도 리셋

`SAT_min = 12 °C`와 `SAT_max = 18 °C` 사이에서 T&R 리셋하며, 담당하는 모든 존에 걸친 냉방 리퀘스트 개수로 구동됩니다. Red5 출고 기본값:

```
SAT_min: 12.5 °C   (matches dew-point safety margin for CZ 1-3)
SAT_max: 18.0 °C   (lets ERV bypass without freezing)
SP_res:  +0.3 °C
SP_trim: -0.1 °C
```

### 5.16.2 정압 리셋

`SP_min = 50 Pa`와 `SP_max = 750 Pa` 사이에서 T&R 리셋하며, VAV 입구 댐퍼의 정압 리퀘스트 개수로 구동됩니다. 이 알고리즘의 핵심은 급기 팬을 *가장 요구가 높은 댐퍼를 여전히 만족시키는 최저 압력*으로 운전하는 것입니다 — 실제 건물에서 팬 에너지 절감의 30 %+ 가 여기서 나옵니다.

### 5.16.3 이코노마이저

차동 건구 또는 차동 엔탈피(CZ에 따라, 위 90.1 §6.4.3.4 참조). G36은 댐퍼 헌팅을 방지하기 위해 히스테리시스를 엄격히 정의합니다.

```
ECON_ON  when (T_OA + 1) < T_RA
ECON_OFF when (T_OA - 1) > T_RA
```

엔탈피도 동일합니다. Red5의 Givoni 오버레이는 운영자에게 실시간 이코노마이저 상태를 보여 줍니다 — 청록 코너가 게이트되면 ERV가 바이패스되고, 청록 코너 밖에서는 ERV가 작동합니다.

### 5.16.4 최소 외기 풍량

고정 `MIN_OA_CFM` 또는 **CO₂ 기반 DCV**(90.1 §6.4.3.4.5 기준). Red5는 실시간 CO₂ 텔레메트리를 DCV 설정점에 연결하고, OA 비율을 ASHRAE 62.1 존 요건과 대비하여 시각화합니다.

---

## 5. VAV／터미널 유닛 시퀀스(§5.17)

### 5.17.1 냉방 전용 VAV

댐퍼는 냉방 설정점 대비 존 T 편차에 따라 `MIN_FLOW`에서 `MAX_FLOW`로 변조됩니다. 재열 없음.

### 5.17.2 재열 포함 VAV

두 단계:
1. **1단계 — 냉방**: 댐퍼 `MIN_FLOW`에서 `MAX_COOL_FLOW`, 재열 OFF
2. **2단계 — 난방**: 댐퍼 `MIN_HEAT_FLOW`, 재열 밸브 0-100 % 변조

전환은 진동을 막기 위해 속도 제한됩니다(기울기 0.1 °C/min).

Red5의 VAV 설비 모달은 실시간 `DPR`(댐퍼 %) ＋ `HCV`(재열 밸브 %) ＋ `ZT`(존 T) ＋ `ZRH`(존 RH)를 표시하여 두 단계가 존별로 정상 동작하는지 검증할 수 있습니다.

### 5.17.3 직렬 팬 동력 VAV(Series fan-powered VAV)

재실 모드에서 연속 운전하는 소형 인라인 팬을 추가하며, 주 댐퍼는 위와 같이 변조합니다. 주로 난방 요구가 높은 외주부 존에 사용됩니다. Red5는 추가 `series_fan_status` BV를 지원합니다.

---

## 6. 냉수 플랜트(§5.20)

CHWS-T는 T&R로 리셋하며, 전 AHU에 걸친 냉방 리퀘스트 개수로 게이트됩니다. `CHWS_min = 6 °C`, `CHWS_max = 12 °C`.

CHW 펌프 압력 리셋은 밸브 위치 리퀘스트로 구동됩니다 — 가장 요구가 높은 냉수 코일 밸브를 95-100 % 개방으로 유지합니다.

Red5는 냉동기를 직접 구동하지 않지만(그것은 BAS 시공사가 담당하는 BACnet 쓰기입니다), `CHWS_T`, `CHWR_T`, `kW_chiller`, `chiller_efficiency_COP`를 모니터링하고 진단 탭을 통해 드리프트를 표시합니다.

---

## 7. 온수 플랜트(§5.21)

CHW의 거울상이나 난방 리퀘스트 개수로 구동됩니다. `HWS_min = 38 °C`(공급), `HWS_max = 60 °C`.

---

## 8. 경보(§5.5)

G36은 HVAC 시스템이 보고해야 하는 **63가지 특정 경보 조건**을 정의합니다. Red5에서 운영자와 가장 관련 깊은 것:

| 경보 | 트리거 | Red5 표시 |
|---|---|---|
| 급기 저온(상한 컷아웃) | `SAT < 4 °C`가 5 min 지속 | 빨간 점 ＋ 로그 |
| 덕트 고정압 | `SP > SP_max * 1.25`가 10 min 지속 | 빨간 점 |
| 팬 고장 | `cmd ON AND status OFF`가 60 s 지속 | 빨간 배너 |
| 댐퍼 결함 | `cmd != position`이 5 min 지속 | VAV별 배지 |
| 코일 동결 | `mixed_air_T < 4 °C` | 빨간 모드 재정의 |
| 존 온도 예외 | `|ZT - SP| > 2 °C`가 30 min 지속 | 노란 VAV 행 |

G36 타임라인 스트립의 `freeze_protection` 모드는 마지막 두 경보와 연동됩니다 — 운영자가 해제할 때까지 AHU를 모드 7(OA 완전 폐쇄, HC 전 요구, 팬 최소)로 강제합니다.

---

## 9. G36를 효과적으로 읽기

이 표준은 **300쪽 이상의 의사코드**입니다. 실무적 읽기 순서:

1. **§4** — 모드 정의(일곱 가지 재실 모드)
2. **§5.1** — 공통 서브루틴(T&R, 히스테리시스, 리퀘스트 개수)
3. **§5.16 + §5.17** — AHU + VAV 시퀀스(운영자 작업의 90 %)
4. BAS 시공사가 실제로 배선하지 않았다면 냉동기／보일러／플랜트 절은 건너뜀
5. **§5.5** — 경보(무언가 이상해 보일 때 참조하는 곳)

---

## 10. G36 대 실제 건물

운영자의 흔한 불만: *"G36는 X라고 하는데 우리 건물은 Y를 한다."*

그런 일이 생기는 세 가지 이유:

- **레거시 컨트롤러**는 T&R를 실행하지 못합니다 — 고정 설정점의 PI 루프일 뿐입니다. Red5는 설정점이 30 min 동안 움직이지 않음을 감지하면 `g36_mode = "OCCUPIED (no T&R)"`로 표시합니다.
- **현장 고유 재정의**가 BAS 시공사에 의해 G36 위에 얹혀 있음(예: "여름에는 리퀘스트와 무관하게 항상 14 °C SAT"). 이는 자산 메모(Asset Notes) 창에 기록하세요 — 그렇지 않으면 보이지 않게 됩니다.
- **G36가 애초에 설치되지 않음** — 많은 "G36 준수" 프로젝트는 BAS 시퀀스 문서에 모드의 *이름*만 있을 뿐 실제로 알고리즘을 출고하지 않았습니다. Red5의 타임라인 스트립은 모드가 전혀 전환되지 않음을 보여 이를 잡아냅니다.

의심스러울 때는: BAS 운전 시퀀스 PDF를 열어 G36 참조 알고리즘과 나란히 비교하세요. 그 차이가 바로 여러분의 에너지 절감이 숨어 있는 곳입니다.

---

## 11. 실무: 어떤 Red5 기능이 G36를 "실행"하고 어떤 것이 "검증"하는가

| G36 조항 | Red5 동작 |
|---|---|
| §5.1.14 T&R | 검증(BAS에서 SAT_SP 이동을 읽음), 구동은 안 함 |
| §5.16.1 SAT 리셋 | SAT 추세 기울기로 검증 |
| §5.16.2 SP 리셋 | SP 추세로 검증 |
| §5.16.3 이코노마이저 | Givoni 청록 코너로 시각화 |
| §5.16.4 OA 최소／DCV | OA 비율 배지로 검증 |
| §5.17.x VAV 시퀀스 | 존별 DPR + HCV 시각화 |
| §5.5 경보 | 진단 리본의 실시간 경보 롤업 |

Red5는 **G36 관찰자**이지 G36 구현자가 아닙니다. 실제 시퀀스는 BAS 컨트롤러(Delta Controls O3/eBMGR, Distech ECP, Trane SC+, Honeywell N4 등)에서 동작합니다. Red5의 역할은 BAS가 그 운전 시퀀스 문서가 주장하는 대로 동작하는지 알려 주는 것입니다.

---

## 12. 더 읽을거리

- **표준 원문**: [ashrae.org/technical-resources/ashrae-handbook/ashrae-guideline-36](https://www.ashrae.org/technical-resources/ashrae-handbook/ashrae-guideline-36)
- Taylor Engineering(G36 대부분을 집필한 회사)의 **G36 구현 플레이북**: [taylorengineers.com/wp-content/uploads/2020/07/G36-implementation.pdf](https://taylorengineers.com/wp-content/uploads/2020/07/G36-implementation.pdf)(URL 확인 — 때때로 페이월)
- **Red5 내 관련 문서**:
  - [control_algorithms.md](/docs#control-algorithms) 수학적 측면
  - [band_guide.md](/docs#band) 현장 고유 재정의
  - [ashrae_55_reference.md](/docs#ashrae-55) 쾌적 측 수치
  - [ashrae_90_1_reference.md](/docs#ashrae-90-1) 에너지 측 수치
