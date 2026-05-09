/* ============================================================
   i18n.js — Internationalization for Red5 Studio
   Languages: EN, 简体, 繁體, 日本語, 한국어
   HVAC terms fully translated in all languages.
   ============================================================ */
(function(){
  'use strict';
  var LANGS = [
    { code:'en',    name:'English',  flag:'EN' },
    { code:'zh-CN', name:'简体中文', flag:'简' },
    { code:'zh-TW', name:'繁體中文', flag:'繁' },
    { code:'ja',    name:'日本語',   flag:'JA' },
    { code:'ko',    name:'한국어',   flag:'KO' }
  ];

  var D = {
    /* ── Common / Shared ── */
    dashboard:        ['Dashboard','仪表盘','儀表板','ダッシュボード','대시보드'],
    configuration:    ['Configuration','配置工具','配置工具','設定ツール','구성 도구'],
    save:             ['Save','保存','儲存','保存','저장'],
    cancel:           ['Cancel','取消','取消','キャンセル','취소'],
    delete_:          ['Delete','删除','刪除','削除','삭제'],
    upload:           ['Upload','上传','上傳','アップロード','업로드'],
    download:         ['Download','下载','下載','ダウンロード','다운로드'],
    export_:          ['Export','导出','匯出','エクスポート','내보내기'],
    import_:          ['Import','导入','匯入','インポート','가져오기'],
    settings:         ['Settings','设置','設定','設定','설정'],
    loading:          ['Loading...','加载中...','載入中...','読み込み中...','로딩 중...'],
    search:           ['Search','搜索','搜尋','検索','검색'],
    close:            ['Close','关闭','關閉','閉じる','닫기'],
    confirm:          ['Confirm','确认','確認','確認','확인'],
    reload:           ['Reload','重新加载','重新載入','再読み込み','새로고침'],
    or_:              ['or','或','或','または','또는'],
    yes:              ['Yes','是','是','はい','예'],
    no_:              ['No','否','否','いいえ','아니요'],
    back:             ['Back','返回','返回','戻る','뒤로'],
    next:             ['Next','下一步','下一步','次へ','다음'],
    config:           ['Config','设置','設定','設定','설정'],

    /* ── HVAC Core Terms ── */
    ahu_diagnostic_hub:    ['AHU Diagnostic Hub','空调机组诊断中心','空調機組診斷中心','空調機診断ハブ','공조기 진단 허브'],
    by_delta_controls:     ['by Delta Controls','by Delta Controls','by Delta Controls','by Delta Controls','by Delta Controls'],
    oa:                    ['OA','新风','外氣','外気','외기'],
    sa:                    ['SA','送风','送風','給気','급기'],
    ra:                    ['RA','回风','回風','還気','환기'],
    comfort:               ['Comfort','舒适区','舒適區','快適域','적정구역'],
    comfort_zone:          ['Comfort Zone','舒适区','舒適區','快適域','적정구역'],

    /* ── Psychrometric / Chart Terms ── */
    psych_tab:             ['Psych','空气线图','空氣線圖','空気線図','공기선도'],
    psychrometric_chart:   ['Psychrometric Chart','空气线图','空氣線圖','空気線図','공기선도'],
    psy_weather_strip:     ['Psychrometric Weather Strip','空气线图天气数据','空氣線圖天氣資料','空気線図気象データ','공기선도 날씨 데이터'],
    dry_bulb_temp:         ['Dry Bulb Temp','干球温度','乾球溫度','乾球温度','건구 온도'],
    humidity_ratio:        ['Humidity Ratio','含湿量','含濕量','絶対湿度','절대 습도'],
    dew_point:             ['Dew Point','露点','露點','露点','노점'],
    saturation:            ['Saturation','饱和凝结','飽和凝結','飽和凝結','포화응축'],
    saturation_line:       ['Saturation Line','饱和线','飽和線','飽和線','포화선'],
    saturation_point:      ['Saturation Point','饱和点','飽和點','飽和点','포화점'],
    enthalpy:              ['Enthalpy','焓值','焓值','エンタルピー','엔탈피'],
    latent:                ['Latent','潜热','潛熱','潜熱','잠열'],
    sensible:              ['Sensible','显热','顯熱','顕熱','현열'],
    natural_ventilation:   ['Natural Ventilation','自然通风','自然通風','自然換気','자연 환기'],

    /* ── Setpoints ── */
    t_setpoint:            ['T Setpoint','温度设定点','溫度設定點','温度設定値','온도 설정점'],
    w_setpoint:            ['W Setpoint','含湿量设定点','含濕量設定點','絶対湿度設定値','절대습도 설정점'],
    rh_setpoint:           ['RH Setpoint','相对湿度设定点','相對濕度設定點','相対湿度設定値','비교습도 설정점'],

    /* ── Seasons ── */
    spring:                ['Spring','春季','春季','春','봄'],
    summer:                ['Summer','夏季','夏季','夏','여름'],
    autumn:                ['Autumn','秋季','秋季','秋','가을'],
    winter:                ['Winter','冬季','冬季','冬','겨울'],
    seasonal:              ['Seasonal','季节','季節','季節','계절'],

    /* ── Landing Page ── */
    building_diag_cmd_center: ['Building Diagnostic Command Center','建筑诊断指挥中心','建築診斷指揮中心','ビル診断コマンドセンター','빌딩 진단 커맨드 센터'],
    dashboard_desc:           ['AHU Diagnostic HUB with real-time psychrometric chart, VAV terminals, and floor plan mapping','空调机组诊断中心，含实时空气线图、VAV 终端和平面图映射','空調機組診斷中心，含即時空氣線圖、VAV 終端和平面圖映射','空調機診断ハブ：リアルタイム空気線図、VAVターミナル、フロアプランマッピング','공조기 진단 허브: 실시간 공기선도, VAV 터미널, 평면도 매핑'],
    config_desc:              ['Equipment Schema Mapper, Points Editor, Floor Plan Alignment, and 3D asset management','设备模式映射器、点位编辑器、平面图对齐和 3D 资产管理','設備模式映射器、點位編輯器、平面圖對齊和 3D 資產管理','機器スキーママッパー、ポイントエディタ、フロアプラン配置、3D アセット管理','장비 스키마 매퍼, 포인트 편집기, 평면도 정렬, 3D 자산 관리'],
    set_pw_prompt:            ['Set a password to access configuration tools','设置密码以访问配置工具','設定密碼以存取配置工具','設定ツールにアクセスするためのパスワードを設定','구성 도구 접근을 위한 비밀번호 설정'],
    enter_pw_prompt:          ['Enter password for full access','输入密码以完全访问','輸入密碼以完全存取','フルアクセスのためのパスワードを入力','전체 접근을 위한 비밀번호 입력'],
    set_your_password:        ['Set your password','设置密码','設定密碼','パスワードを設定','비밀번호 설정'],
    enter_password:           ['Enter password','输入密码','輸入密碼','パスワードを入力','비밀번호 입력'],
    incorrect_password:       ['Incorrect password','密码错误','密碼錯誤','パスワードが正しくありません','비밀번호가 올바르지 않습니다'],
    set_password_enter:       ['Set Password & Enter','设置密码并进入','設定密碼並進入','パスワード設定して入場','비밀번호 설정 후 입장'],
    unlock:                   ['Unlock','解锁','解鎖','ロック解除','잠금 해제'],
    skip_to_dashboard:        ['Skip to Dashboard','跳至仪表盘','跳至儀表板','ダッシュボードへ','대시보드로 이동'],

    /* ── Dashboard ── */
    diagnostics_console:  ['Diagnostics Console','诊断控制台','診斷控制台','診断コンソール','진단 콘솔'],
    diag:                 ['Diag','诊断','診斷','診断','진단'],
    dynam_tab:            ['Dynam','动态','動態','動態','동적'],
    dynamics_animation:   ['Dynamics Animation','动态动画','動態動畫','動態アニメーション','동적 애니메이션'],
    weather_3d:           ['3D Weather Strip','3D 天气条','3D 天氣條','3D 気象ストリップ','3D 날씨 스트립'],
    weather_3d_short:     ['3D Wx','3D 天气','3D 天氣','3D 気象','3D 날씨'],
    axis_settings:        ['Axis Settings','坐标轴设置','座標軸設定','軸設定','축 설정'],
    min_temp:             ['Min Temp','最低温度','最低溫度','最低温度','최저 온도'],
    max_temp:             ['Max Temp','最高温度','最高溫度','最高温度','최고 온도'],
    weather:              ['Weather','天气','天氣','天気','날씨'],
    set_location:         ['Set Location','设置位置','設定位置','位置を設定','위치 설정'],
    location_name:        ['Location Name','位置名称','位置名稱','地点名','장소 이름'],
    fetch_weather_data:   ['Fetch Weather Data','获取天气数据','獲取天氣資料','気象データ取得','실데이터 가져오기'],
    tomorrow:             ['Tomorrow','明天','明天','明日','내일'],
    diagnostic:           ['Diagnostic','诊断','診斷','診断','진단'],
    vav_terminal_hub:     ['VAV Terminal HUB','VAV 终端中心','VAV 終端中心','VAV ターミナルハブ','VAV 터미널 허브'],
    trends:               ['Trends','趋势','趨勢','トレンド','트렌드'],
    trends_select_ahu:    ['Trends (select AHU)','趋势（选择 AHU）','趨勢（選擇 AHU）','トレンド（AHU を選択）','트렌드 (AHU 선택)'],
    floor_plan:           ['Floor Plan','平面图','平面圖','フロアプラン','평면도'],
    click_map_vavs:       ['Click to map VAVs on Floor Plan','点击在平面图上映射 VAV','點擊在平面圖上映射 VAV','フロアプランで VAV をマッピング','평면도에서 VAV 매핑 클릭'],
    latitude:             ['Latitude','纬度','緯度','緯度','위도'],
    longitude:            ['Longitude','经度','經度','経度','경도'],
    telemetry_status:     ['Telemetry Status','遥测状态','遙測狀態','テレメトリ状態','텔레메트리 상태'],
    no_data:              ['No data','无数据','無資料','データなし','데이터 없음'],
    live:                 ['Live','实时','即時','ライブ','실시간'],
    offline:              ['Offline','离线','離線','オフライン','오프라인'],
    asset_search:         ['Asset Search','资产搜索','資產搜尋','資産検索','자산 검색'],
    toggle_givoni:        ['Toggle Givoni Engine','切换 Givoni 引擎','切換 Givoni 引擎','Givoni エンジン切替','Givoni 엔진 전환'],

    /* ── Equipment Mapper ── */
    equipment_config_tool:  ['Equipment Configuration Tool','设备配置工具','設備配置工具','機器設定ツール','장비 구성 도구'],
    sensors:                ['Sensors','传感器','感測器','センサー','센서'],
    aligners:               ['Aligners','对齐器','對齊器','アライナー','얼라이너'],
    points_editor:          ['Points Editor','点位编辑器','點位編輯器','ポイントエディタ','포인트 편집기'],
    equipment_category:     ['Equipment Category','设备类别','設備類別','機器カテゴリ','장비 카테고리'],
    add_point:              ['Add Point','添加点位','新增點位','ポイント追加','포인트 추가'],
    add_row:                ['Add Row','添加行','新增行','行を追加','행 추가'],
    delete_row:             ['Delete Row','删除行','刪除行','行を削除','행 삭제'],
    duplicate:              ['Duplicate','复制','複製','複製','복제'],
    new_aligner:            ['New Aligner','新建对齐器','新增對齊器','新規アライナー','새 얼라이너'],
    save_json:              ['Save JSON','保存 JSON','儲存 JSON','JSON 保存','JSON 저장'],
    load_json:              ['Load JSON','加载 JSON','載入 JSON','JSON 読込','JSON 불러오기'],
    save_to_controller:     ['Save to Controller','保存到控制器','儲存至控制器','コントローラに保存','컨트롤러에 저장'],
    download_to_browser:    ['Download to Browser','下载到浏览器','下載到瀏覽器','ブラウザにDL','브라우저에 다운로드'],
    upload_image:           ['Upload Image','上传图片','上傳圖片','画像アップロード','이미지 업로드'],
    change_image:           ['Change Image','更换图片','更換圖片','画像を変更','이미지 변경'],
    file_browser:           ['File Browser','文件浏览器','檔案瀏覽器','ファイルブラウザ','파일 브라우저'],
    json_editor:            ['JSON Editor Mode','JSON 编辑模式','JSON 編輯模式','JSON エディタモード','JSON 편집기 모드'],
    table_view:             ['Table View Mode','表格视图模式','表格檢視模式','テーブル表示モード','테이블 뷰 모드'],
    import_csv:             ['Import CSV','导入 CSV','匯入 CSV','CSV インポート','CSV 가져오기'],
    export_csv:             ['Export CSV','导出 CSV','匯出 CSV','CSV エクスポート','CSV 내보내기'],
    reload_system:          ['Reload System','重载系统','重新載入系統','システム再読込','시스템 새로고침'],
    system_crash_prevented: ['System Render Crash Prevented','系统渲染崩溃已阻止','系統渲染崩潰已阻止','システムレンダリングクラッシュを防止','시스템 렌더 크래시 방지됨'],
    save_clean_template:    ['Save Clean Template','保存干净模板','儲存乾淨範本','クリーンテンプレート保存','클린 템플릿 저장'],
    export_clean_json:      ['Export Clean JSON','导出干净 JSON','匯出乾淨 JSON','クリーン JSON エクスポート','클린 JSON 내보내기'],
    save_working_file:      ['Save Working File','保存工作文件','儲存工作檔案','作業ファイル保存','작업 파일 저장'],
    download_current:       ['Download Current','下载当前文件','下載目前檔案','現在のファイルをDL','현재 파일 다운로드'],
    add_floor:              ['Add Floor','添加楼层','新增樓層','フロア追加','층 추가'],
    delete_floor:           ['Delete Floor','删除楼层','刪除樓層','フロア削除','층 삭제'],
    add_marker:             ['Add Marker','添加标记','新增標記','マーカー追加','마커 추가'],
    delete_marker:          ['Delete Marker','删除标记','刪除標記','マーカー削除','마커 삭제'],
    equipment_types:        ['Equipment Types','设备类型','設備類型','機器タイプ','장비 유형'],
    simulator:              ['Simulator','模拟器','模擬器','シミュレータ','시뮬레이터'],

    /* ── Psy Dynamics ── */
    control_algorithm:        ['Control Algorithm','控制算法','控制演算法','制御アルゴリズム','제어 알고리즘'],
    seasonal_weather_anim:    ['Seasonal Weather Animation','季节性天气动画','季節性天氣動畫','季節天気アニメーション','계절별 날씨 애니메이션'],
    heating:                  ['Heating','加热','加熱','暖房','난방'],
    cooling:                  ['Cooling','冷却','冷卻','冷房','냉방'],
    cool_dehumid:             ['Cool + Dehumid','冷却+除湿','冷卻+除濕','冷房+除湿','냉방+제습'],
    heat_humid:               ['Heat + Humid','加热+加湿','加熱+加濕','暖房+加湿','난방+가습'],
    dehumid:                  ['Dehumid','除湿','除濕','除湿','제습'],
    humidify:                 ['Humidify','加湿','加濕','加湿','가습'],
    economizer:               ['Economizer','经济器','經濟器','エコノマイザ','이코노마이저'],
    steady:                   ['Steady','稳态','穩態','定常','안정'],
    occupants:                ['Occupants','在室人员','在室人員','在室人数','재실 인원수'],
    pause:                    ['Pause','暂停','暫停','一時停止','일시정지'],
    play:                     ['Play','播放','播放','再生','재생'],
    light_theme:              ['Light','浅色','淺色','ライト','라이트'],
    dark_theme:               ['Dark','深色','深色','ダーク','다크'],
    controller:               ['Controller','控制器','控制器','コントローラ','컨트롤러'],

    /* ── Chart common (T×Time + Monthly × Sites) ── */
    cumulative_energy_time:    ['Cumulative Energy × Time  +  OA Tracking','累计能量 × 时间  +  外气追踪','累計能量 × 時間  +  外氣追蹤','累積エネルギー × 時間  +  外気追跡','누적 에너지 × 시간  +  외기 추적'],
    monthly_energy_sites:      ['Monthly Air-Side Energy × Sites','月度空气侧能量 × 站点','月度空氣側能量 × 站點','月別エアサイドエネルギー × サイト','월별 공기측 에너지 × 사이트'],
    humidity_time_scatter:     ['Humidity × Time (scatter)','湿度 × 时间 (散点图)','濕度 × 時間 (散點圖)','湿度 × 時間 (散布図)','습도 × 시간 (산점도)'],
    no_weather_data:           ['No weather data — click FETCH WEATHER DATA to load','无天气数据 — 点击 FETCH WEATHER DATA 加载','無天氣資料 — 點擊 FETCH WEATHER DATA 載入','気象データなし — FETCH WEATHER DATA をクリックして読み込み','날씨 데이터 없음 — FETCH WEATHER DATA 클릭하여 로드'],
    no_weather_loaded:         ['No weather data loaded','未加载天气数据','未載入天氣資料','気象データ未読込','날씨 데이터 미로드'],
    oa_temp_axis:              ['OA Temperature (°C)','外气温度 (°C)','外氣溫度 (°C)','外気温度 (°C)','외기온도 (°C)'],
    cum_dh_axis:               ['Cumulative Δh (kJ/kg)','累计 Δh (kJ/kg)','累計 Δh (kJ/kg)','累積 Δh (kJ/kg)','누적 Δh (kJ/kg)'],
    humidity_ratio_axis:       ['Humidity ratio (g/kg)','含湿量 (g/kg)','含濕量 (g/kg)','絶対湿度 (g/kg)','절대습도 (g/kg)'],
    time_season_axis:          ['Time (Season)','时间 (季节)','時間 (季節)','時間 (季節)','시간 (계절)'],
    fetch_weather_data:        ['Fetch weather data','获取天气数据','獲取天氣資料','気象データ取得','날씨 데이터 가져오기'],
    fetching_dots:             ['Fetching...','获取中...','獲取中...','取得中...','가져오는 중...'],
    invalid_coords:            ['Invalid coords','坐标无效','座標無效','座標が無効','잘못된 좌표'],
    set_dates:                 ['Set dates','请设置日期','請設定日期','日付を設定','날짜 설정'],
    from_gt_to:                ['From > To','起始 > 结束','起始 > 結束','開始 > 終了','시작 > 종료'],

    /* ── Strategy labels (kept terse so legend stays compact) ── */
    fixed_sa_band_damper:      ['Fixed-SA + band damper','固定送风 + 段位风阀','固定送風 + 段位風閥','固定SA + バンドダンパ','고정 SA + 밴드 댐퍼'],
    dyn_reset:                 ['Dyn-Reset','动态复位','動態復位','動的リセット','동적 리셋'],
    band_b1_b10:               ['B1-B10','B1-B10','B1-B10','B1-B10','B1-B10'],
    band_b1_b10_dyn:           ['B1-B10 + Dyn-Reset','B1-B10 + 动态复位','B1-B10 + 動態復位','B1-B10 + 動的リセット','B1-B10 + 동적 리셋'],
    opt_sa:                    ['Opt-SA','最优送风','最優送風','最適SA','최적 SA'],
    opt_sa_cum:                ['Opt-SA cum','最优送风 累计','最優送風 累計','最適SA 累積','최적 SA 누적'],
    oa_intake_band_damper:     ['OA Intake (band damper)','外气引入 (段位风阀)','外氣引入 (段位風閥)','外気導入 (バンドダンパ)','외기 도입 (밴드 댐퍼)'],
    saved:                     ['SAVED','已保存','已儲存','保存済み','저장됨'],

    /* ── Legend Mode buttons + summary banner ── */
    legend_mode:               ['Legend mode:','图例模式:','圖例模式:','凡例モード:','범례 모드:'],
    mode_a_comfort:            ['A: Comfort hours','A: 舒适时数','A: 舒適時數','A: 快適時間','A: 쾌적 시간'],
    mode_b_sens_lat:           ['B: Sens / Lat','B: 显热/潜热','B: 顯熱/潛熱','B: 顕熱/潜熱','B: 현열/잠열'],
    mode_c_tradeoff:           ['C: Trade-off','C: 权衡','C: 權衡','C: トレードオフ','C: 트레이드오프'],
    mode_d_cost:               ['$: Cost / yr','$: 年成本','$: 年成本','$: 年間コスト','$: 연간 비용'],
    mode_label_prefix:         ['MODE','模式','模式','モード','모드'],

    /* ── Mode banner labels ── */
    mode_a_full:               ['A: COMFORT HOURS','A: 舒适时数','A: 舒適時數','A: 快適時間','A: 쾌적 시간'],
    mode_b_full:               ['B: SENS / LAT','B: 显热/潜热','B: 顯熱/潛熱','B: 顕熱/潜熱','B: 현열/잠열'],
    mode_c_full:               ['C: TRADE-OFF','C: 权衡','C: 權衡','C: トレードオフ','C: 트레이드오프'],
    mode_d_full:               ['$ : COST / yr','$ : 年成本','$ : 年成本','$ : 年間コスト','$ : 연간 비용'],

    /* ── Cost model panel ── */
    cost_model_title:          ['Cost Model -- plug your numbers','成本模型 -- 输入您的数据','成本模型 -- 輸入您的數據','コストモデル -- 数値を入力','비용 모델 -- 숫자 입력'],
    cost_airflow:              ['Airflow','风量','風量','風量','풍량'],
    cost_utility_rate:         ['Utility rate','电费率','電費率','電気料金','전기 요금'],
    cost_cooling_cop:          ['Cooling COP','制冷 COP','製冷 COP','冷房 COP','냉방 COP'],
    cost_heating_eff:          ['Heating eff.','制热效率','製熱效率','暖房効率','난방 효율'],
    cost_violation_rate:       ['Violation rate','违反成本','違反成本','違反コスト','위반 비용'],

    /* ── OA / Comfort caveat ── */
    no_humidity_caveat:        ['NO humidity (latent) control -- may meet kJ/kg target while violating zone RH / comfort.  NOT RECOMMENDED FOR DEPLOYMENT.','无湿度（潜热）控制 -- 可能达到 kJ/kg 目标但违反区域湿度/舒适性。不建议部署。','無濕度（潛熱）控制 -- 可能達到 kJ/kg 目標但違反區域濕度/舒適性。不建議部署。','湿度（潜熱）制御なし -- kJ/kg 目標を達成してもゾーン RH / 快適性違反の可能性。展開非推奨。','습도(잠열) 제어 없음 -- kJ/kg 목표는 충족해도 구역 RH/쾌적성 위반 가능. 배포 권장하지 않음.'],
    no_latent_short:           ['NO latent (RH) control -- not for deployment','无潜热（RH）控制 -- 不可部署','無潛熱（RH）控制 -- 不可部署','潜熱（RH）制御なし -- 展開不可','잠열(RH) 제어 없음 -- 배포 불가'],
    oa_damper:                 ['OA damper','外气风阀','外氣風閥','外気ダンパ','외기 댐퍼'],
    oa_intake_short:           ['OA Intake','外气引入','外氣引入','外気導入','외기 도입'],
    avg_oa_label:              ['Avg OA','平均外气','平均外氣','平均外気','평균 외기'],

    /* ── T×Time annotations ── */
    sa_setpoint_legend:        ['SA T','送风温度','送風溫度','給気温度','급기 온도'],
    heating:                   ['Heating','加热','加熱','暖房','난방'],
    cooling:                   ['Cooling','制冷','製冷','冷房','냉방'],
    total_label:               ['Total','合计','合計','合計','합계'],
    oa_temp_legend:            ['OA temp','外气温度','外氣溫度','外気温度','외기온도'],
    vav_zones_in_cz:           ['VAV ZONES IN CZ','VAV 区域在舒适区','VAV 區域在舒適區','VAVゾーンが快適域内','VAV 구역 적정구역 내']
  };

  /* ── Build fast lookup: key -> { en, 'zh-CN', 'zh-TW', ja, ko } ── */
  var codes = LANGS.map(function(l){ return l.code; });
  var DICT = {};
  Object.keys(D).forEach(function(k){
    var arr = D[k]; var entry = {};
    for(var i=0;i<codes.length;i++) entry[codes[i]] = arr[i] || arr[0];
    DICT[k] = entry;
  });

  var currentLang = localStorage.getItem('i18n_lang') || 'en';

  /* ── Public API ── */
  window.t = function(key){
    var entry = DICT[key];
    if(!entry) return key;
    return entry[currentLang] || entry['en'] || key;
  };

  window.getLang = function(){ return currentLang; };

  window.setLang = function(code){
    currentLang = code;
    localStorage.setItem('i18n_lang', code);
    document.documentElement.lang = code;
    window.dispatchEvent(new Event('langchange'));
  };

  window.I18N_LANGS = LANGS;

  /* ── React hook: useLang() ── */
  window.useLang = function(){
    var _s = React.useState(0);
    React.useEffect(function(){
      var h = function(){ _s[1](function(v){ return v+1; }); };
      window.addEventListener('langchange', h);
      return function(){ window.removeEventListener('langchange', h); };
    }, []);
    return currentLang;
  };

  /* ── Language Selector React Component ── */
  window.LangSelector = function(props){
    var lang = window.useLang();
    var _o = React.useState(false);
    var open = _o[0], setOpen = _o[1];
    var btnRef = React.useRef(null);
    var _p = React.useState({top:0,left:0});
    var pos = _p[0], setPos = _p[1];
    var cur = LANGS.find(function(l){ return l.code === lang; }) || LANGS[0];
    var style = props && props.style || {};

    React.useEffect(function(){
      if (!open) return;
      var close = function(){ setOpen(false); };
      document.addEventListener('click', close);
      return function(){ document.removeEventListener('click', close); };
    }, [open]);

    return React.createElement('div', {
      style: Object.assign({ position:'relative', zIndex:9999, fontFamily:'inherit' }, style)
    },
      React.createElement('button', {
        ref: btnRef,
        onClick: function(e){
          e.stopPropagation();
          if (!open && btnRef.current) {
            var r = btnRef.current.getBoundingClientRect();
            setPos({ top: r.bottom + 4, left: r.left });
          }
          setOpen(!open);
        },
        style: {
          background:'rgba(15,23,42,.92)', border:'1px solid rgba(148,163,184,.3)',
          color:'#94a3b8', padding:'4px 10px', borderRadius:'6px', cursor:'pointer',
          fontSize:'10px', fontWeight:'900', letterSpacing:'.08em', textTransform:'uppercase',
          fontFamily:'inherit', backdropFilter:'blur(14px)', whiteSpace:'nowrap',
          display:'flex', alignItems:'center', gap:'4px'
        }
      }, cur.flag, ' \u25BE'),
      open && React.createElement('div', {
        onClick: function(e){ e.stopPropagation(); },
        style: {
          position:'fixed', top: pos.top + 'px', left: pos.left + 'px',
          background:'rgba(15,23,42,.97)', border:'1px solid rgba(148,163,184,.25)',
          borderRadius:'8px', overflow:'hidden', minWidth:'130px',
          boxShadow:'0 12px 40px rgba(0,0,0,.5)', backdropFilter:'blur(14px)',
          zIndex:99999
        }
      }, LANGS.map(function(l){
        var isCur = l.code === lang;
        return React.createElement('button', {
          key: l.code,
          onClick: function(e){ e.stopPropagation(); setLang(l.code); setOpen(false); },
          style: {
            display:'block', width:'100%', textAlign:'left', border:'none',
            background: isCur ? 'rgba(99,102,241,.25)' : 'transparent',
            color: isCur ? '#a5b4fc' : '#94a3b8',
            padding:'8px 14px', fontSize:'11px', fontWeight:'700', cursor:'pointer',
            fontFamily:'inherit', letterSpacing:'.04em', transition:'background .15s'
          },
          onMouseEnter: function(e){ if(!isCur) e.target.style.background='rgba(148,163,184,.1)'; },
          onMouseLeave: function(e){ if(!isCur) e.target.style.background='transparent'; }
        }, l.flag + '  ' + l.name);
      }))
    );
  };

  /* ── Vanilla JS language selector (for non-React pages) ── */
  window.createLangSelector = function(parent, opts){
    opts = opts || {};
    var container = document.createElement('div');
    container.style.cssText = 'position:relative;z-index:9999;display:inline-block;font-family:inherit;' + (opts.css || '');
    var btn = document.createElement('button');
    btn.style.cssText = 'background:rgba(15,23,42,.92);border:1px solid rgba(148,163,184,.3);color:#94a3b8;padding:4px 10px;border-radius:6px;cursor:pointer;font-size:10px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;font-family:inherit;backdrop-filter:blur(14px);white-space:nowrap';
    var dropdown = document.createElement('div');
    dropdown.style.cssText = 'display:none;position:absolute;top:100%;right:0;margin-top:4px;background:rgba(15,23,42,.97);border:1px solid rgba(148,163,184,.25);border-radius:8px;overflow:hidden;min-width:130px;box-shadow:0 12px 40px rgba(0,0,0,.5);backdrop-filter:blur(14px)';

    function updateBtn(){
      var cur = LANGS.find(function(l){ return l.code === getLang(); }) || LANGS[0];
      btn.textContent = cur.flag + ' \u25BE';
    }

    LANGS.forEach(function(l){
      var item = document.createElement('button');
      item.style.cssText = 'display:block;width:100%;text-align:left;border:none;background:transparent;color:#94a3b8;padding:8px 14px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;letter-spacing:.04em;transition:background .15s';
      item.textContent = l.flag + '  ' + l.name;
      item.onmouseenter = function(){ item.style.background = 'rgba(148,163,184,.1)'; };
      item.onmouseleave = function(){ item.style.background = l.code===getLang()?'rgba(99,102,241,.25)':'transparent'; };
      item.onclick = function(e){ e.stopPropagation(); setLang(l.code); dropdown.style.display='none'; updateBtn(); };
      dropdown.appendChild(item);
    });

    btn.onclick = function(e){ e.stopPropagation(); dropdown.style.display = dropdown.style.display==='none'?'block':'none'; };
    document.addEventListener('click', function(){ dropdown.style.display='none'; });

    updateBtn();
    container.appendChild(btn);
    container.appendChild(dropdown);
    parent.appendChild(container);
    return container;
  };

  /* ── Set initial html lang ── */
  document.documentElement.lang = currentLang;
})();
