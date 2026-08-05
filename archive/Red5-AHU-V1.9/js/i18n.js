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
    by_delta_controls:     ['By DIBT','By DIBT','By DIBT','By DIBT','By DIBT'],
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
    evaporative:           ['Evaporative','蒸发冷却','蒸發冷卻','蒸発冷却','증발 냉각'],
    rh_sweet_spot:         ['40-60% RH','40-60% 相对湿度','40-60% 相對濕度','40-60% 相対湿度','40-60% 상대습도'],
    /* ── Mixed air (MA) + mixing-box cross-checks ── */
    mixed_air:             ['Mixed Air','混合空气','混合空氣','混合空気','혼합 공기'],
    oa_fraction:           ['OA fraction','新风比例','新風比例','外気混合率','외기 비율'],
    oa_damper:             ['OA damper','新风风阀','新風風閥','外気ダンパ','외기 댐퍼'],
    off_line:              ['Off mixing line','偏离混合线','偏離混合線','混合線からの偏差','혼합선 이탈'],
    ma_basis_measured:     ['measured (MAT + MAH)','实测 (MAT + MAH)','實測 (MAT + MAH)','実測 (MAT + MAH)','실측 (MAT + MAH)'],
    ma_basis_mat:          ['derived from MAT','由 MAT 推算','由 MAT 推算','MAT から推算','MAT 기반 추정'],
    ma_basis_mat_damper:   ['MAT + damper (OA≈RA)','MAT + 风阀 (OA≈RA)','MAT + 風閥 (OA≈RA)','MAT + ダンパ (OA≈RA)','MAT + 댐퍼 (OA≈RA)'],
    ma_basis_damper:       ['damper only — computed, not measured','仅风阀 — 计算值，非实测','僅風閥 — 計算值，非實測','ダンパのみ — 計算値、実測ではない','댐퍼만 — 계산값, 실측 아님'],
    ma_flag_mat_outside_oa_ra: ['MAT outside OA–RA range — sensor or stratification','MAT 超出 OA–RA 范围 — 传感器或气流分层','MAT 超出 OA–RA 範圍 — 感測器或氣流分層','MAT が OA–RA 範囲外 — センサまたは層状化','MAT가 OA–RA 범위 밖 — 센서 또는 성층화'],
    ma_flag_damper_mismatch:   ['Damper disagrees with measured mix','风阀指令与实测混合不一致','風閥指令與實測混合不一致','ダンパ指令と実測混合が不一致','댐퍼 지령과 실측 혼합 불일치'],
    ma_flag_off_mixing_line:   ['MA off the mixing line','MA 偏离混合线','MA 偏離混合線','MA が混合線から外れている','MA가 혼합선에서 벗어남'],
    ma_flag_oa_ra_temp_too_close: ['OA≈RA — fraction taken from damper','OA≈RA — 比例取自风阀','OA≈RA — 比例取自風閥','OA≈RA — 比率はダンパから','OA≈RA — 비율은 댐퍼 기준'],

    /* ── Sidebar enthalpy pills.  Named for the leg each one measures so
       the tooltip says which device the number belongs to. ── */
    pill_mixing:           ['Mixing (OA→MA)','混合 (OA→MA)','混合 (OA→MA)','混合 (OA→MA)','혼합 (OA→MA)'],
    pill_coil:             ['Coil (MA→SA)','盘管 (MA→SA)','盤管 (MA→SA)','コイル (MA→SA)','코일 (MA→SA)'],
    pill_exchange:         ['Exchange (OA→SA)','焓变 (OA→SA)','焓變 (OA→SA)','エンタルピ変化 (OA→SA)','엔탈피 변화 (OA→SA)'],
    pill_absorption:       ['Absorption (SA→RA)','吸热 (SA→RA)','吸熱 (SA→RA)','吸熱 (SA→RA)','흡수 (SA→RA)'],
    pill_free_dilution:    ['free dilution by the dampers','风阀带来的免费稀释','風閥帶來的免費稀釋','ダンパによる無償の希釈','댐퍼에 의한 무상 희석'],
    pill_coil_duty:        ['what the coil actually paid for','盘管实际承担的负荷','盤管實際承擔的負荷','コイルが実際に負担した熱量','코일이 실제로 부담한 열량'],
    pill_room_load:        ['load the room added back','房间回加的负荷','房間回加的負荷','室が加えた負荷','실내가 더한 부하'],
    pill_mix_plus_coil:    ['mixing + coil','混合 + 盘管','混合 + 盤管','混合 + コイル','혼합 + 코일'],
    pill_coil_derived:     ['MA derived from MAT — latent split assumes the damper','MA 由 MAT 推算 — 潜热拆分依赖风阀','MA 由 MAT 推算 — 潛熱拆分依賴風閥','MA は MAT から推算 — 潜熱の内訳はダンパ前提','MA는 MAT 기반 추정 — 잠열 분리는 댐퍼 가정'],

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
    toggle_givoni:        ['Givoni Engine','Givoni 引擎','Givoni 引擎','Givoni エンジン','Givoni 엔진'],

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
    save_to_controller:     ['Save to Virtual Controller','保存到虚拟控制器','儲存至虛擬控制器','仮想コントローラに保存','가상 컨트롤러에 저장'],
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
    vav_zones_in_cz:           ['VAV ZONES IN CZ','VAV 区域在舒适区','VAV 區域在舒適區','VAVゾーンが快適域内','VAV 구역 적정구역 내'],

    /* ── Dashboard DOM (added 2026-02-10) — translated strings for the
       non-chart React UI: cards, modals, button labels, placeholders,
       tooltips.  Keep keys lowercase + snake_case; one line each so a
       quick scan shows what's still missing in any language. ── */
    ahu_diagnostic_hub_v:      ['AHU Diagnostic HUB','空调机组诊断中心','空調機組診斷中心','空調機診断ハブ','공조기 진단 허브'],
    real_time_diag_hub:        ['Real-time Diagnostic Hub','实时诊断中心','即時診斷中心','リアルタイム診断ハブ','실시간 진단 허브'],
    mechanical_cooling:        ['Mechanical Cooling','机械制冷','機械製冷','機械冷房','기계 냉방'],
    mass_cooling:              ['Mass Cooling','质量制冷','質量製冷','蓄熱冷房','대량 냉방'],
    reload_now:                ['Reload Now','立即重新加载','立即重新載入','今すぐ再読み込み','지금 새로고침'],
    drag_to_resize:            ['Drag to resize','拖动以调整大小','拖動以調整大小','ドラッグでサイズ変更','드래그하여 크기 조정'],
    collector_configuration:   ['Collector Configuration','采集器配置','採集器配置','コレクター設定','콜렉터 구성'],
    click_to_map_vavs:         ['Click to map VAVs on Floor Plan','点击在平面图上映射 VAV','點擊在平面圖上映射 VAV','フロアプランで VAV をマップ','평면도에서 VAV 매핑하려면 클릭'],
    view_diagram:              ['View Diagram','查看示意图','查看示意圖','図面表示','다이어그램 보기'],
    yearly_weather_dist:       ['Yearly Weather Distribution','年度气候分布','年度氣候分佈','年間気象分布','연간 기후 분포'],
    no_data_for_period:        ['No data for this period','此时段无数据','此時段無資料','期間データなし','이 기간 데이터 없음'],
    reset_zoom:                ['RESET ZOOM','重置缩放','重置縮放','ズームをリセット','확대/축소 재설정'],
    no_weather_loaded:         ['No weather data loaded','未加载天气数据','未載入天氣資料','気象データ未読込','날씨 데이터 미적재'],
    weather_location:          ['Weather Location','天气位置','天氣位置','気象位置','날씨 위치'],
    current_location:          ['Current Location','当前位置','當前位置','現在地','현재 위치'],
    no_saved_locations:        ['No saved locations','无已保存位置','無已儲存位置','保存済み位置なし','저장된 위치 없음'],
    location_name_ph:          ['Location name','位置名称','位置名稱','位置名','위치 이름'],
    vav_image_missing:         ['VAV IMAGE MISSING','VAV 图像缺失','VAV 影像缺失','VAV画像なし','VAV 이미지 누락'],
    ahu_image_missing:         ['AHU IMAGE MISSING','AHU 图像缺失','AHU 影像缺失','AHU画像なし','AHU 이미지 누락'],
    loading_configuration:     ['Loading configuration...','加载配置中...','載入配置中...','設定読み込み中...','구성 로딩 중...'],
    no_vavs_assigned:          ['No VAVs assigned','未分配 VAV','未指派 VAV','VAV 未割当','VAV 미할당'],
    add_vav_name_ph:           ['Add VAV name','添加 VAV 名称','新增 VAV 名稱','VAV 名追加','VAV 이름 추가'],
    csv_object_label:          ['CSV Object:','CSV 对象:','CSV 物件:','CSV オブジェクト:','CSV 객체:'],
    add_new_ahu_group:         ['Add New AHU Group','添加新 AHU 组','新增 AHU 群組','新規 AHU グループ追加','새 AHU 그룹 추가'],
    ahu_name_ph:               ['AHU name (e.g. AHU-03-W)','AHU 名称 (例: AHU-03-W)','AHU 名稱 (例: AHU-03-W)','AHU 名 (例: AHU-03-W)','AHU 이름 (예: AHU-03-W)'],
    csv_object_ph:             ['CSV object','CSV 对象','CSV 物件','CSV オブジェクト','CSV 객체'],
    loading_equip_types:       ['Loading equipment types...','加载设备类型中...','載入設備類型中...','機器タイプ読み込み中...','장비 유형 로딩 중...'],
    data_source_mode:          ['Data Source Mode','数据源模式','資料來源模式','データソースモード','데이터 소스 모드'],
    dashboard_point_map:       ['Dashboard Point Map','仪表盘点位映射','儀表板點位映射','ダッシュボード点マップ','대시보드 포인트 맵'],
    config_password:           ['Config Password','配置密码','配置密碼','設定パスワード','구성 비밀번호'],
    enter_password_ph:         ['Enter password','输入密码','輸入密碼','パスワード入力','비밀번호 입력'],
    react_crash_prevented:     ['React Rendering Crash Prevented','已阻止 React 渲染崩溃','已阻止 React 渲染崩潰','React レンダリング クラッシュを防止','React 렌더링 충돌 방지됨'],
    react_crash_msg:           ['System caught the following error instead of a black screen:','系统捕获以下错误而非黑屏:','系統捕獲以下錯誤而非黑屏:','黒画面の代わりに以下のエラーを捕捉:','검은 화면 대신 다음 오류를 포착:'],

    /* ── AHU detail page (ahu.html) ── */
    fleet:                     ['FLEET','机组列表','機組列表','設備一覧','설비 목록'],
    connecting_ellipsis:       ['connecting…','连接中…','連線中…','接続中…','연결 중…'],
    per_ahu_performance:       ['Per-AHU Performance','单机组性能','單機組性能','空調機別性能','공조기별 성능'],
    g36_mode:                  ['G36 Mode','G36 模式','G36 模式','G36 モード','G36 모드'],
    cooling_requests:          ['Cooling Requests','制冷请求','製冷請求','冷房要求','냉방 요청'],
    heating_requests:          ['Heating Requests','制热请求','製熱請求','暖房要求','난방 요청'],
    pressure_requests:         ['Pressure Requests','压力请求','壓力請求','圧力要求','압력 요청'],
    from_vav_zones:            ['from VAV zones','来自 VAV 区域','來自 VAV 區域','VAV ゾーンから','VAV 구역에서'],
    duct_static:               ['duct static','风管静压','風管靜壓','ダクト静圧','덕트 정압'],
    uptime_24h:                ['Uptime · 24h','运行时间 · 24h','運行時間 · 24h','稼働時間 · 24h','가동 시간 · 24h'],
    non_fault_mode_time:       ['non-fault mode time','非故障模式时间','非故障模式時間','非故障モード時間','비고장 모드 시간'],
    mode_hours_today:          ['Mode Hours · Today','模式时长 · 今日','模式時長 · 今日','モード時間 · 本日','모드 시간 · 오늘'],
    cz_compliance:             ['CZ Compliance','舒适区达标','舒適區達標','快適域適合','쾌적역 준수'],
    zones_inside_range:        ['zones inside 21–24 °C','21–24 °C 内区域','21–24 °C 內區域','21–24 °C 内のゾーン','21–24 °C 이내 구역'],
    zones_online:              ['Zones Online','在线区域','在線區域','オンライン区域','온라인 구역'],
    supply_air_temp:           ['Supply Air Temp','送风温度','送風溫度','給気温度','급기 온도'],
    supply_air_rh:             ['Supply Air RH','送风湿度','送風濕度','給気湿度','급기 습도'],
    sat_reset_tr:              ['SAT Reset (Trim&Respond)','送风温度重置(增减响应)','送風溫度重置(增減響應)','給気温度リセット(トリム&レスポンス)','급기온도 재설정(트림&리스폰드)'],
    dsp_reset_tr:              ['DSP Reset (Trim&Respond)','静压重置(增减响应)','靜壓重置(增減響應)','静圧リセット(トリム&レスポンス)','정압 재설정(트림&리스폰드)'],
    deg_c_target:              ['°C target','°C 目标','°C 目標','°C 目標','°C 목표'],
    pa_target:                 ['Pa target','Pa 目标','Pa 目標','Pa 目標','Pa 목표'],
    time_range:                ['Time Range','时间范围','時間範圍','期間','시간 범위'],
    custom_label:              ['Custom:','自定义:','自訂:','カスタム:','사용자 지정:'],
    apply_btn:                 ['APPLY','应用','套用','適用','적용'],
    minutes_ph:                ['minutes','分钟','分鐘','分','분'],
    chart_sa_temp:             ['Supply Air Temperature (°C)','送风温度 (°C)','送風溫度 (°C)','給気温度 (°C)','급기 온도 (°C)'],
    chart_sa_rh:               ['Supply Air Relative Humidity (%)','送风相对湿度 (%)','送風相對濕度 (%)','給気相対湿度 (%)','급기 상대습도 (%)'],
    chart_airflow:             ['Airflow (% of design)','风量 (设计百分比)','風量 (設計百分比)','風量 (設計比 %)','풍량 (설계 %)'],
    chart_ra_temp:             ['Return Air Temperature (°C)','回风温度 (°C)','回風溫度 (°C)','還気温度 (°C)','환기 온도 (°C)'],
    operating_mode_timeline:   ['Operating Mode Timeline · 24h','运行模式时间轴 · 24h','運行模式時間軸 · 24h','運転モードタイムライン · 24h','운전 모드 타임라인 · 24h'],
    occupied:                  ['Occupied','占用','佔用','在室','재실'],
    warmup_cooldown:           ['Warmup/Cooldown','预热/预冷','預熱/預冷','暖機/冷却','예열/예냉'],
    setback_unoccupied:        ['Setback/Unoccupied','回退/无人','回退/無人','セットバック/不在','셋백/비재실'],
    freeze_protect:            ['Freeze-Protect','防冻保护','防凍保護','凍結防止','동결 방지'],
    fault:                     ['Fault','故障','故障','故障','고장'],
    vav_zones:                 ['VAV Zones','VAV 区域','VAV 區域','VAV ゾーン','VAV 구역'],
    served_by_this_ahu:        ['Served by this AHU','由此空调机组服务','由此空調機組服務','この空調機が担当','이 공조기가 담당'],
    zone:                      ['Zone','区域','區域','ゾーン','구역'],
    temp:                      ['Temp','温度','溫度','温度','온도'],
    rh:                        ['RH','湿度','濕度','湿度','습도'],
    setpoint:                  ['Setpoint','设定点','設定點','設定値','설정값'],
    damper:                    ['Damper','风阀','風閥','ダンパー','댐퍼'],
    sup_temp:                  ['Sup Temp','送风温度','送風溫度','給気温度','급기 온도'],
    airflow:                   ['Airflow','风量','風量','風量','풍량'],
    state:                     ['State','状态','狀態','状態','상태'],
    loading_ellipsis:          ['Loading…','加载中…','載入中…','読み込み中…','로딩 중…'],
    band_matrix_title:         ['10-Band Strategy Matrix · Current Band','10 段策略矩阵 · 当前段','10 段策略矩陣 · 當前段','10 バンド戦略マトリクス · 現在バンド','10 밴드 전략 매트릭스 · 현재 밴드'],
    band:                      ['Band','段','段','バンド','밴드'],
    name:                      ['Name','名称','名稱','名称','이름'],
    oa_temp:                   ['OA Temp','新风温度','外氣溫度','外気温度','외기 온도'],
    oa_rh:                     ['OA RH','新风湿度','外氣濕度','外気湿度','외기 습도'],
    sa_t_deliv:                ['SA T Deliv','送风送出温度','送風送出溫度','給気供給温度','급기 공급온도'],
    sa_rh:                     ['SA RH','送风湿度','送風濕度','給気湿度','급기 습도'],
    sa_w_gkg:                  ['SA W g/kg','送风含湿量 g/kg','送風含濕量 g/kg','給気絶対湿度 g/kg','급기 절대습도 g/kg'],
    oa_damper:                 ['OA Damper','新风阀','外氣風閥','外気ダンパー','외기 댐퍼'],
    cc_coil:                   ['CC','冷盘','冷盤','冷却コイル','냉각코일'],
    hc_coil:                   ['HC','热盘','熱盤','加熱コイル','가열코일'],
    hum_short:                 ['HUM','加湿','加濕','加湿','가습'],
    control_tag:               ['Control Tag','控制标签','控制標籤','制御タグ','제어 태그'],
    energy:                    ['Energy','能耗','能耗','エネルギー','에너지'],
    loading_bands:             ['Loading bands…','加载段中…','載入段中…','バンド読み込み中…','밴드 로딩 중…'],
    audit_log_title:           ['Audit Log · Setpoint & Control Changes','审计日志 · 设定点与控制变更','稽核日誌 · 設定點與控制變更','監査ログ · 設定値と制御変更','감사 로그 · 설정값 및 제어 변경'],
    when:                      ['When','时间','時間','日時','시각'],
    action:                    ['Action','操作','操作','操作','작업'],
    user:                      ['User','用户','使用者','ユーザー','사용자'],
    before_after:              ['Before → After','变更前 → 变更后','變更前 → 變更後','変更前 → 変更後','변경 전 → 변경 후'],
    floor_plan_placement:      ['Floor-Plan Placement','平面图布置','平面圖佈置','フロアプラン配置','평면도 배치'],
    no_vav_zones_reported:     ['No VAV zones reported for this AHU','此空调机组无 VAV 区域','此空調機組無 VAV 區域','この空調機に VAV ゾーンなし','이 공조기에 VAV 구역 없음'],
    no_data_since_midnight:    ['No data since midnight','午夜以来无数据','午夜以來無資料','深夜以降データなし','자정 이후 데이터 없음'],
    no_history_yet:            ['No history yet','暂无历史记录','暫無歷史記錄','履歴なし','기록 없음'],
    ahu_not_found:             ['AHU not found','未找到空调机组','未找到空調機組','空調機が見つかりません','공조기를 찾을 수 없음'],
    admin_signin_required:     ['admin sign-in required','需要管理员登录','需要管理員登入','管理者ログインが必要','관리자 로그인 필요'],

    /* ── Setup Walk (setup.html / setup_walk.jsx) ── */
    sw_subtitle:               ['Configure once. Skip any step you don\u2019t need.','一次配置完成。可跳过不需要的步骤。','一次設定完成。可跳過不需要的步驟。','一度設定すれば完了。不要な手順はスキップ可。','한 번만 설정하세요. 필요 없는 단계는 건너뛰세요.'],
    sw_skip_all:               ['Skip all \u2192','全部跳过 \u2192','全部跳過 \u2192','すべてスキップ \u2192','모두 건너뛰기 \u2192'],
    sw_done:                   ['Done','完成','完成','完了','완료'],
    sw_open_dashboard:         ['Open Dashboard \u2192','打开仪表盘 \u2192','開啟儀表板 \u2192','ダッシュボードを開く \u2192','대시보드 열기 \u2192'],
    sw_foot_start:             ['\u2191 Pick a setting to start, or skip all and go straight to the dashboard.','\u2191 选择一项设置开始，或全部跳过直接进入仪表盘。','\u2191 選擇一項設定開始，或全部跳過直接進入儀表板。','\u2191 設定を選んで開始、またはすべてスキップしてダッシュボードへ。','\u2191 설정을 선택해 시작하거나 모두 건너뛰고 대시보드로 이동하세요.'],
    sw_foot_all_done:          ['\u2713 All steps configured.  Ready when you are.','\u2713 所有步骤已配置完成，随时可开始。','\u2713 所有步驟已設定完成，隨時可開始。','\u2713 すべての手順が完了しました。準備OKです。','\u2713 모든 단계가 설정되었습니다. 준비 완료.'],
    sw_steps_remaining:        ['step(s) remaining (optional).','个步骤待完成（可选）。','個步驟待完成（可選）。','手順が残っています（任意）。','단계 남음 (선택 사항).'],
    sw_step_psy:               ['Psy Chart','空气线图','空氣線圖','空気線図','공기선도'],
    sw_step_psy_sub:           ['Givoni \u00b7 RH range \u00b7 axis','吉沃尼 \u00b7 湿度范围 \u00b7 坐标轴','吉沃尼 \u00b7 濕度範圍 \u00b7 座標軸','ギボーニ \u00b7 RH範囲 \u00b7 軸','기보니 \u00b7 습도 범위 \u00b7 축'],
    sw_step_location:          ['Location','位置','位置','位置','위치'],
    sw_step_location_sub:      ['City \u00b7 lat / long','城市 \u00b7 纬度 / 经度','城市 \u00b7 緯度 / 經度','都市 \u00b7 緯度 / 経度','도시 \u00b7 위도 / 경도'],
    sw_step_language:          ['Language','语言','語言','言語','언어'],
    sw_step_language_sub:      ['EN \u00b7 CS \u00b7 CT \u00b7 JP \u00b7 KO \u00b7 \u2026','EN \u00b7 CS \u00b7 CT \u00b7 JP \u00b7 KO \u00b7 \u2026','EN \u00b7 CS \u00b7 CT \u00b7 JP \u00b7 KO \u00b7 \u2026','EN \u00b7 CS \u00b7 CT \u00b7 JP \u00b7 KO \u00b7 \u2026','EN \u00b7 CS \u00b7 CT \u00b7 JP \u00b7 KO \u00b7 \u2026'],
    sw_step_plugin:            ['Plug-in','插件','外掛','プラグイン','플러그인'],
    sw_step_plugin_sub:        ['List \u00b7 upload \u00b7 modify','列表 \u00b7 上传 \u00b7 修改','列表 \u00b7 上傳 \u00b7 修改','一覧 \u00b7 アップロード \u00b7 変更','목록 \u00b7 업로드 \u00b7 수정'],
    sw_step_repair:            ['Update & Repair','更新与修复','更新與修復','更新と修復','업데이트 및 복구'],
    sw_step_repair_sub:        ['Plug-in flash \u00b7 controller OTA','插件刷写 \u00b7 控制器 OTA','外掛燒錄 \u00b7 控制器 OTA','プラグイン書込 \u00b7 コントローラOTA','플러그인 플래시 \u00b7 컨트롤러 OTA'],
    sw_full_page:              ['Full page','整页','整頁','全画面','전체 페이지'],
    sw_popup:                  ['Popup','弹窗','彈窗','ポップアップ','팝업'],
    sw_configured:             ['Configured','已配置','已設定','設定済み','설정됨'],
    sw_back_to_setup:          ['\u2190 Back to setup','\u2190 返回设置','\u2190 返回設定','\u2190 設定に戻る','\u2190 설정으로 돌아가기'],
    sw_save_return:            ['Save & return \u2713','保存并返回 \u2713','儲存並返回 \u2713','保存して戻る \u2713','저장 후 돌아가기 \u2713'],
    sw_psy_chart_setting:      ['Psy Chart Setting','空气线图设置','空氣線圖設定','空気線図設定','공기선도 설정'],
    sw_display_mode:           ['Display Mode','显示模式','顯示模式','表示モード','표시 모드'],
    sw_dim_dark:               ['\ud83c\udf19  Dim / Dark','\ud83c\udf19  暗色','\ud83c\udf19  暗色','\ud83c\udf19  ダーク','\ud83c\udf19  어둡게'],
    sw_light_mode:             ['\u2600  Light','\u2600  亮色','\u2600  亮色','\u2600  ライト','\u2600  밝게'],
    sw_dim_brightness:         ['Dim brightness','暗色亮度','暗色亮度','暗さの明るさ','어둡기 밝기'],
    sw_givoni_engine:          ['Givoni Engine','吉沃尼引擎','吉沃尼引擎','ギボーニエンジン','기보니 엔진'],
    sw_givoni_on:              ['Givoni ON','吉沃尼 开','吉沃尼 開','ギボーニ ON','기보니 켜짐'],
    sw_givoni_off:             ['Givoni OFF','吉沃尼 关','吉沃尼 關','ギボーニ OFF','기보니 꺼짐'],
    sw_rh_sweet_spot:          ['RH Sweet-Spot Range','湿度舒适区范围','濕度舒適區範圍','RH快適範囲','습도 최적 범위'],
    sw_venue_preset:           ['Venue preset','场所预设','場所預設','施設プリセット','장소 프리셋'],
    sw_temp_axis_range:        ['Temperature Axis Range','温度坐标轴范围','溫度座標軸範圍','温度軸範囲','온도 축 범위'],
    sw_language_setting:       ['Language Setting','语言设置','語言設定','言語設定','언어 설정'],
    sw_language_sub:           ['Pick your default interface language','选择默认界面语言','選擇預設介面語言','既定の表示言語を選択','기본 인터페이스 언어 선택'],
    sw_location_setting:       ['Location Setting','位置设置','位置設定','位置設定','위치 설정'],
    sw_location_sub:           ['Click the map, drag the pin, or use your device','点击地图、拖动图钉或使用设备定位','點擊地圖、拖動圖釘或使用裝置定位','地図クリック、ピンをドラッグ、または端末を使用','지도 클릭, 핀 드래그 또는 기기 위치 사용'],
    sw_plugin_setting:         ['Plug-in Setting','插件设置','外掛設定','プラグイン設定','플러그인 설정'],
    sw_plugin_sub:             ['Enable, upload or modify plug-ins','启用、上传或修改插件','啟用、上傳或修改外掛','プラグインの有効化・アップロード・変更','플러그인 활성화, 업로드 또는 수정'],
    sw_enabled:                ['Enabled','已启用','已啟用','有効','활성화'],
    sw_disabled:               ['Disabled','已禁用','已停用','無効','비활성화'],
    sw_configure_dd:           ['Configure \u25be','配置 \u25be','設定 \u25be','設定 \u25be','구성 \u25be'],
    sw_close_up:               ['Close \u25b4','收起 \u25b4','收起 \u25b4','閉じる \u25b4','닫기 \u25b4'],
    sw_reset_defaults:         ['Reset defaults','恢复默认','還原預設','既定値に戻す','기본값 복원'],
    sw_latitude:               ['Latitude','纬度','緯度','緯度','위도'],
    sw_longitude:              ['Longitude','经度','經度','経度','경도'],
    sw_quick_jumps:            ['Quick jumps','快速跳转','快速跳轉','クイックジャンプ','빠른 이동']
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

  /* ── Declarative applier for vanilla (non-React) pages ──
     Tag markup with:
       data-i18n="key"        → sets textContent
       data-i18n-ph="key"     → sets placeholder attribute
       data-i18n-title="key"  → sets title attribute
       data-i18n-aria="key"   → sets aria-label attribute
     applyI18n() runs automatically on DOMContentLoaded and on every
     langchange, and can be called manually after injecting new DOM.
     No-op on pages that use none of these attributes, so it is safe to
     load alongside the React dashboard. */
  window.applyI18n = function(root){
    var scope = root || document;
    var set = function(sel, fn){
      var nodes = scope.querySelectorAll(sel);
      for (var i=0;i<nodes.length;i++){
        var el = nodes[i];
        var key = el.getAttribute(sel.replace(/[\[\]]/g,''));
        var v = window.t(key);
        if (v && v !== key) fn(el, v);
      }
    };
    set('[data-i18n]',       function(el,v){ el.textContent = v; });
    set('[data-i18n-ph]',    function(el,v){ el.setAttribute('placeholder', v); });
    set('[data-i18n-title]', function(el,v){ el.setAttribute('title', v); });
    set('[data-i18n-aria]',  function(el,v){ el.setAttribute('aria-label', v); });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ window.applyI18n(); });
  } else {
    window.applyI18n();
  }
  window.addEventListener('langchange', function(){ window.applyI18n(); });

  /* ── Set initial html lang ── */
  document.documentElement.lang = currentLang;
})();
