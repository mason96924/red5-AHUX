(function(global){
'use strict';

/* ================================================================
   initPsy3D(container, opts)
   Mounts the 3D psychrometric weather strip into any DOM element.
   opts.weatherLocation = {lat,lon,name} (optional, from dashboard localStorage)
   ================================================================ */
global.initPsy3D = function(container, opts){
  opts = opts || {};

  /* ---------- BUILD MARKER (so the user can verify deployment) ----- */
  var BUILD_TAG = 'V1.9-2026-05-02-d';
  try { console.info('[psy3d] init build=' + BUILD_TAG); } catch(e){}

  /* ---------- HARD GUARD AGAINST DOUBLE-INIT ----------------------
     Browsers cap WebGL contexts per page (Mac Safari ~8, Chrome ~16).
     If anything (StrictMode double-invoke, hot reload, accidental
     re-mount, third-party script triggering React, etc.) calls
     initPsy3D twice on the same container we'd burn another context
     and trip the cap.  Stamp the container with `data-psy3d-built`
     and refuse to re-init.  This is intentionally INSIDE the engine
     (not just in the React caller) so the protection survives any
     callsite refactor. */
  if (!container) {
    try { console.warn('[psy3d] init aborted: no container'); } catch(e){}
    return { dispose: function(){} };
  }
  if (container.getAttribute('data-psy3d-built') === '1') {
    try { console.warn('[psy3d] init aborted: container already initialized (build=' + BUILD_TAG + ')'); } catch(e){}
    return container.__psy3dHandle || { dispose: function(){} };
  }
  /* PAGE-WIDE one-context guard \u2014 even if the host accidentally calls
     initPsy3D() with a DIFFERENT container, we still refuse a second
     init within the same document because both calls would try to
     allocate their own THREE.WebGLRenderer.  Allowed only if the prior
     handle's dispose() has run.                                       */
  if (window.__psy3dActive) {
    try { console.warn('[psy3d] init aborted: another psy3d engine is already active in this document'); } catch(e){}
    return { dispose: function(){} };
  }
  container.setAttribute('data-psy3d-built', '1');
  window.__psy3dActive = true;

  /* ---------- LIFECYCLE STATE (must be declared FIRST) ----------
     These back the engine's dispose() pathway.  Theme-poll setInterval,
     window/document listeners, and the ResizeObserver registered
     during init push their cleanup closures into _cleanupTasks, so the
     array has to be initialized BEFORE any of them run \u2014 otherwise
     `var` hoisting leaves it `undefined` at first use and we get
     `Cannot read properties of undefined (reading 'push')`.  Keep these
     five lines at the very top of initPsy3D.                          */
  var _rafId = 0;             /* id returned by requestAnimationFrame so the
                                 render loop can be cancelled on dispose */
  var _running = false;       /* loop guard; set false in dispose() so any
                                 in-flight tick() returns without requesting
                                 another frame */
  var _disposed = false;      /* hard gate \u2014 every public entry point
                                 (fetch handlers, ResizeObserver, event
                                 listeners) bails if this flips */
  var _cleanupTasks = [];     /* LIFO list: setup pushes teardown fns here;
                                 dispose() pops + calls each so listeners,
                                 timers, and observers are all released */

  /* Opt-SA envelope defaults — declared at the very top of initPsy3D
     because loadScripts() may invoke its callback synchronously when
     THREE is already cached, which lets setupControls() run before
     the lower-down `var _optMinH = 25;` initialisation, leaving the
     value `undefined` and `.toFixed()` crashes the engine.  Keep the
     authoritative initialisation here. */
  var _optMinH = 25; // kJ/kg dry air
  var _optMaxH = 50; // kJ/kg dry air

  /* ---------- theme helpers (synced with dashboard via localStorage.red5.theme) ---------- */
  function _p3Theme(){ try { return localStorage.getItem('red5.theme') || 'dark'; } catch(e){ return 'dark'; } }
  var P3_DARK_BG = 0x0f172a, P3_LIGHT_BG = 0xc5cbd2;
  function _p3ApplyThemeToDOM(t){
    var r = document.getElementById('p3-root');
    if (r) r.setAttribute('data-p3theme', t);
    var btn = document.getElementById('p3-theme-btn');
    if (btn) btn.textContent = t === 'dark' ? '\u263C' : '\u263E'; /* sun-with-rays / moon */
  }
  function _p3SetTheme(t){
    try { localStorage.setItem('red5.theme', t); } catch(e){}
    /* storage event doesn't fire in the same tab; drive the listener manually */
    if (typeof _p3ThemeListener === 'function') _p3ThemeListener({key:'red5.theme'});
  }

  /* ---------- scoped styles ---------- */
  if(!document.getElementById('psy3d-css')){
    var st=document.createElement('style');st.id='psy3d-css';
    st.textContent='\
#p3-root{position:absolute;inset:0;background:#0f172a;overflow:hidden;font-family:"SF Mono","Fira Code","Consolas",monospace;color:#e2e8f0;font-size:10px}\
#p3-root *{box-sizing:border-box}\
#p3-root canvas{display:block}\
#p3-hud{position:absolute;top:8px;right:60px;z-index:10;pointer-events:none;text-align:right;max-width:calc(100% - 280px)}\
#p3-hud h1{font-size:12px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:#60a5fa;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\
#p3-loc{font-size:9px;color:#f472b6;font-weight:900;letter-spacing:.08em;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\
#p3-panel{position:absolute;top:8px;left:8px;z-index:12;width:240px;max-width:calc(100% - 16px);max-height:calc(100% - 60px);background:rgba(15,23,42,.94);border:1px solid #334155;border-radius:7px;backdrop-filter:blur(14px);font-size:9px;overflow-y:auto;overflow-x:hidden}\
#p3-panel-hdr{padding:6px 10px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;user-select:none}\
#p3-panel-hdr span{font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:#60a5fa;font-size:9px}\
#p3-panel-body{padding:0 10px 8px}\
.p3-row{margin-bottom:5px}\
.p3-lbl{font-size:7px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#94a3b8;margin-bottom:2px}\
.p3-inp{width:100%;background:#1e293b;border:1px solid #334155;border-radius:4px;padding:3px 7px;color:#e2e8f0;font-family:inherit;font-size:9px;outline:none}\
.p3-inp:focus{border-color:#60a5fa}\
.p3-dur{display:flex;gap:3px}\
.p3-dur button{flex:1;padding:2px 0;border:1px solid #334155;border-radius:3px;background:transparent;color:#94a3b8;font-family:inherit;font-size:7px;font-weight:800;cursor:pointer;text-transform:uppercase;transition:all .2s}\
.p3-dur button:hover{border-color:#60a5fa;color:#60a5fa}\
.p3-dur button.p3act{border-color:#60a5fa;background:rgba(96,165,250,.15);color:#60a5fa}\
#p3-fetch{width:100%;padding:5px;border:1.5px solid #10b981;border-radius:5px;background:rgba(16,185,129,.1);color:#34d399;font-family:inherit;font-size:8px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;margin-top:3px}\
#p3-fetch:hover{background:rgba(16,185,129,.25)}\
#p3-fetch:disabled{opacity:.4;cursor:wait}\
#p3-status{font-size:7px;color:#64748b;margin-top:3px}\
.p3-presets{display:flex;gap:2px;flex-wrap:wrap;margin-bottom:4px}\
.p3-presets button{padding:1px 5px;border:1px solid #475569;border-radius:3px;background:transparent;color:#94a3b8;font-family:inherit;font-size:7px;font-weight:700;cursor:pointer}\
.p3-presets button:hover{border-color:#f472b6;color:#f472b6}\
#p3-axes{position:absolute;top:8px;right:50px;z-index:10;background:rgba(15,23,42,.92);border:1px solid #334155;border-radius:7px;padding:7px 10px;font-size:8px;line-height:1.8;backdrop-filter:blur(14px);pointer-events:none}\
.p3-arow{display:flex;align-items:center;gap:5px}\
.p3-atg{font-weight:900;font-size:7px;padding:1px 4px;border-radius:2px;letter-spacing:.08em}\
#p3-tbar{position:absolute;right:10px;top:50%;transform:translateY(-50%);z-index:10;pointer-events:none;display:flex;flex-direction:column;align-items:center;gap:1px}\
.p3-tblbl{font-size:6px;font-weight:700;color:#94a3b8}\
#p3-ctrls{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);z-index:10;display:flex;gap:4px}\
#p3-ctrls button{background:rgba(15,23,42,.92);border:1px solid #334155;color:#e2e8f0;padding:3px 10px;border-radius:4px;font-size:7px;font-weight:900;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;font-family:inherit;backdrop-filter:blur(14px);transition:all .2s}\
#p3-ctrls button:hover{border-color:#60a5fa;color:#60a5fa}\
#p3-ctrls button.p3act{border-color:#60a5fa;background:rgba(96,165,250,.15);color:#60a5fa}\
#p3-toggles{position:absolute;bottom:42px;left:8px;z-index:10;display:flex;flex-direction:column;gap:3px}\
.p3-tgl{display:flex;align-items:center;gap:5px;background:rgba(15,23,42,.92);border:1px solid #334155;border-radius:4px;padding:2px 8px;cursor:pointer;font-size:7px;font-weight:700;text-transform:uppercase;user-select:none;transition:all .2s;backdrop-filter:blur(14px)}\
.p3-tgl:hover{border-color:#60a5fa}\
.p3-tgl.p3off{opacity:.3}\
.p3-tgl .p3td{width:6px;height:6px;border-radius:50%;flex-shrink:0}\
#p3-tip{position:absolute;display:none;z-index:20;background:rgba(15,23,42,.95);border:1px solid #475569;border-radius:5px;padding:5px 9px;font-size:8px;line-height:1.7;pointer-events:none;backdrop-filter:blur(14px);white-space:nowrap}\
#p3-tip b{font-weight:900}\
#p3-stats{position:absolute;bottom:8px;right:8px;z-index:10;background:rgba(15,23,42,.92);border:1px solid #334155;border-radius:5px;padding:5px 8px;font-size:7px;line-height:1.8;backdrop-filter:blur(14px);pointer-events:none;display:none}\
#p3-stats .p3sv{font-weight:900;color:#60a5fa}\
#p3-overlay2d{position:absolute;inset:0;z-index:50;background:#020617;display:none}\
#p3-overlay2d canvas{position:absolute;inset:0;width:100%;height:100%}\
/* Float the Weather Strip config panel above the 2D time-series overlay so the\
   user can edit SA setpoint, location, duration and FETCH while looking at the\
   T\u00d7Time / W\u00d7Time chart. Activated by adding "p3-2d-cfg" to #p3-root. */\
#p3-root.p3-2d-cfg #p3-panel{z-index:55}\
/* When B1\u2013B10 strategy is on, the user\u2019s SA slider stops driving the\
   green curve.  Visually grey out the range inputs and disable interaction\
   so the user reads "this slider is for the baseline only".  A small note\
   below the sliders explains.  Also adds the same treatment to the value\
   bubble next to each label. */\
#p3-root.p3-band-strategy #p3-sa-t,\
#p3-root.p3-band-strategy #p3-sa-rh{opacity:.45;pointer-events:none;filter:grayscale(.7)}\
#p3-root.p3-band-strategy #p3-sa-t-val,\
#p3-root.p3-band-strategy #p3-sa-rh-val{color:#64748b !important}\
#p3-btn-back3d{position:absolute;top:10px;right:10px;z-index:51;background:rgba(15,23,42,.92);border:1px solid #f472b6;color:#f472b6;padding:5px 14px;border-radius:5px;font-size:9px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;font-family:inherit;backdrop-filter:blur(14px)}\
#p3-tip2d{position:absolute;display:none;z-index:52;background:rgba(15,23,42,.95);border:1px solid #475569;border-radius:5px;padding:6px 10px;font-size:9px;line-height:1.7;pointer-events:none;backdrop-filter:blur(14px);white-space:nowrap}\
/* === LIGHT MODE === */\
#p3-root[data-p3theme="light"]{background:#c5cbd2;color:#1e293b}\
#p3-root[data-p3theme="light"] #p3-panel{background:rgba(230,234,240,.94);border-color:#94a3b8}\
#p3-root[data-p3theme="light"] #p3-axes{background:rgba(230,234,240,.92);border-color:#94a3b8}\
#p3-root[data-p3theme="light"] #p3-stats{background:rgba(230,234,240,.92);border-color:#94a3b8;color:#1e293b}\
#p3-root[data-p3theme="light"] #p3-ctrls button{background:rgba(230,234,240,.92);border-color:#94a3b8;color:#1e293b}\
#p3-root[data-p3theme="light"] .p3-tgl{background:rgba(230,234,240,.92);border-color:#94a3b8;color:#1e293b}\
#p3-root[data-p3theme="light"] .p3-inp{background:#eef2f6;border-color:#94a3b8;color:#1e293b}\
#p3-root[data-p3theme="light"] .p3-lbl{color:#475569}\
#p3-root[data-p3theme="light"] #p3-status{color:#64748b}\
#p3-root[data-p3theme="light"] .p3-dur button{border-color:#94a3b8;color:#475569}\
#p3-root[data-p3theme="light"] .p3-presets button{border-color:#94a3b8;color:#475569}\
#p3-root[data-p3theme="light"] #p3-tip{background:rgba(230,234,240,.95);border-color:#94a3b8;color:#1e293b}\
#p3-root[data-p3theme="light"] #p3-overlay2d{background:#d0d6dd}\
#p3-theme-btn{position:absolute;top:8px;right:8px;z-index:13;width:30px;height:30px;border-radius:50%;background:rgba(15,23,42,.92);border:1px solid #334155;color:#e2e8f0;cursor:pointer;font-size:14px;backdrop-filter:blur(14px);display:flex;align-items:center;justify-content:center;transition:all .2s;font-family:inherit;padding:0}\
#p3-theme-btn:hover{border-color:#60a5fa;color:#60a5fa;transform:scale(1.08)}\
#p3-root[data-p3theme="light"] #p3-theme-btn{background:rgba(230,234,240,.92);border-color:#94a3b8;color:#1e293b}\
#p3-root[data-p3theme="light"] #p3-theme-btn:hover{border-color:#1d4ed8;color:#1d4ed8}\
';
    document.head.appendChild(st);
  }

  /* ---------- DOM structure ---------- */
  container.style.position='relative';
  container.innerHTML='\
<div id="p3-root">\
<button id="p3-theme-btn" title="Toggle Dark/Light Mode">\u263C</button>\
<div id="p3-hud"><h1>3D Psychrometric Weather Strip</h1><div id="p3-loc"></div></div>\
<div id="p3-panel">\
  <div id="p3-panel-hdr"><span id="p3-panel-title">Weather Strip</span><span id="p3-ptgl">\u25BC</span></div>\
  <div id="p3-panel-body">\
    <div class="p3-row"><div class="p3-lbl" id="p3-lbl-loc">Location Name</div><input class="p3-inp" id="p3-name" value="New York"></div>\
    <div class="p3-row" style="display:flex;gap:5px">\
      <div style="flex:1"><div class="p3-lbl">Latitude</div><input class="p3-inp" id="p3-lat" type="number" step="0.01" value="40.71"></div>\
      <div style="flex:1"><div class="p3-lbl">Longitude</div><input class="p3-inp" id="p3-lon" type="number" step="0.01" value="-74.01"></div>\
    </div>\
    <div class="p3-row"><div class="p3-lbl">Presets</div>\
      <div class="p3-presets" id="p3-loc-presets"></div></div>\
    <div class="p3-row"><div class="p3-lbl">Duration</div><div class="p3-dur" id="p3-dur-btns"></div></div>\
    <div class="p3-row" style="display:flex;gap:5px">\
      <div style="flex:1"><div class="p3-lbl">From</div><input class="p3-inp" id="p3-from" type="date" value="2025-01-01"></div>\
      <div style="flex:1"><div class="p3-lbl">To</div><input class="p3-inp" id="p3-to" type="date" value="2025-12-31"></div>\
    </div>\
    <div class="p3-row"><div class="p3-lbl">Quick</div><div class="p3-presets" id="p3-quick"></div></div>\
    <button id="p3-fetch">Fetch Weather Data</button>\
    <div id="p3-status">Ready</div>\
    <div style="border-top:1px solid #334155;margin-top:8px;padding-top:8px">\
      <div class="p3-lbl" style="color:#f59e0b">\u0394H SETTINGS (SA Reference)</div>\
      <div class="p3-row"><div class="p3-lbl">SA Temp: <span id="p3-sa-t-val" style="color:#60a5fa">13</span>\u00b0C</div>\
        <input id="p3-sa-t" type="range" min="5" max="25" step="0.5" value="13" style="width:100%;accent-color:#f59e0b;cursor:pointer"></div>\
      <div class="p3-row"><div class="p3-lbl">SA RH: <span id="p3-sa-rh-val" style="color:#60a5fa">95</span>%</div>\
        <input id="p3-sa-rh" type="range" min="40" max="100" step="1" value="95" style="width:100%;accent-color:#f59e0b;cursor:pointer"></div>\
      <div id="p3-sa-locknote" class="p3-lbl" style="display:none;color:#64748b;line-height:1.3;text-transform:none;letter-spacing:0;margin:-2px 0 4px 0">SA slider only affects the Total/Heating/Cooling baseline. B1\u2013B10 uses each band\u2019s own SA target.</div>\
      <div class="p3-row"><div class="p3-lbl">Occupants</div><input class="p3-inp" id="p3-occ" type="number" value="20" step="1" min="0"></div>\
    </div>\
  </div>\
</div>\
<div id="p3-axes">\
  <div class="p3-arow"><span class="p3-atg" style="background:#334155;color:#e2e8f0">X</span> Dry-Bulb Temp (\u00b0C)</div>\
  <div class="p3-arow"><span class="p3-atg" style="background:#334155;color:#e2e8f0">Y</span> Humidity Ratio (g/kg)</div>\
  <div class="p3-arow"><span class="p3-atg" style="background:#334155;color:#e2e8f0">Z</span> Time (Season axis)</div>\
  <div class="p3-arow"><span class="p3-atg" style="background:rgba(239,68,68,.2);color:#f87171">Color</span> Temperature spectrum</div>\
</div>\
<div id="p3-tbar"><div class="p3-tblbl">50\u00b0C</div><canvas id="p3-tbcv" width="10" height="150"></canvas><div class="p3-tblbl">-15\u00b0C</div></div>\
<div id="p3-toggles"></div>\
<div id="p3-ctrls"></div>\
<div id="p3-stats"><div>Pts: <span class="p3sv" id="p3-st-pts">0</span></div><div>T: <span class="p3sv" id="p3-st-t"></span></div><div>RH: <span class="p3sv" id="p3-st-rh"></span></div><div>Period: <span class="p3sv" id="p3-st-per"></span></div></div>\
<div id="p3-overlay2d"><canvas id="p3-cv2d"></canvas><button id="p3-btn-back3d">Back to 3D</button><button id="p3-btn-proj-mode">Mode: OA\u2192SA Lines</button><button id="p3-btn-band-strategy">Show B1-B10 Strategy</button><button id="p3-btn-monthly-sites">Monthly \u00d7 Sites</button><button id="p3-btn-ms-fixed">+ Fixed-SA</button><button id="p3-btn-ms-dyn">+ Dyn-Reset</button><button id="p3-btn-ms-band">+ B1-B10</button><button id="p3-btn-ms-banddyn">+ B1-B10 &amp; Dyn-Reset</button><div id="p3-tip2d"></div></div>\
<div id="p3-tip"></div>\
</div>';

  var root=container.querySelector('#p3-root');
  var $ = function(sel){return root.querySelector(sel);};

  /* apply initial theme to DOM + listen for dashboard toggles via storage event */
  _p3ApplyThemeToDOM(_p3Theme());
  var _p3ThemeListener = function(e){
    if (e && e.key && e.key !== 'red5.theme') return;
    var t = _p3Theme();
    _p3ApplyThemeToDOM(t);
    if (scene && scene.background) scene.background = new THREE.Color(t === 'dark' ? P3_DARK_BG : P3_LIGHT_BG);
    // Redraw psy-chart canvas texture
    if (typeof _p3RedrawPsyTex === 'function') _p3RedrawPsyTex();
  };
  window.addEventListener('storage', _p3ThemeListener);
  // Wire the in-view theme toggle button
  var _p3Btn = container.querySelector('#p3-theme-btn');
  if (_p3Btn) {
    _p3Btn.addEventListener('click', function(ev){
      ev.stopPropagation();
      _p3SetTheme(_p3Theme() === 'dark' ? 'light' : 'dark');
    });
  }
  // Also poll every 500ms — 'storage' event does NOT fire in the tab that made the change,
  // so when the dashboard toggles in this same tab we need a tick to notice.
  var _p3LastTheme = _p3Theme();
  var _p3PollTimer = setInterval(function(){
    if (_disposed) return;
    var t = _p3Theme();
    if (t !== _p3LastTheme) { _p3LastTheme = t; _p3ThemeListener({key:'red5.theme'}); }
  }, 500);
  _cleanupTasks.push(function(){
    window.removeEventListener('storage', _p3ThemeListener);
    if (_p3PollTimer) { clearInterval(_p3PollTimer); _p3PollTimer = 0; }
  });

  /* ---------- i18n LABEL UPDATE ---------- */
  var _t = window.t || function(k){return k;};
  function updateLabels(){
    _t = window.t || function(k){return k;};
    var m=$('#p3-panel-title');if(m)m.textContent=_t('psy_weather_strip');
    var loc=$('#p3-lbl-loc');if(loc)loc.textContent=_t('location_name');
    var fb=$('#p3-fetch');if(fb)fb.textContent=_t('fetch_weather_data');
  }
  updateLabels();
  window.addEventListener('langchange',updateLabels);
  _cleanupTasks.push(function(){
    window.removeEventListener('langchange', updateLabels);
  });

  /* ---------- PSYCHROMETRIC MATH ---------- */
  var Pa=101.325;
  function psat(t){var c=t<0?[-5674.5359,6.3925247,-9.677e-3,6.2215e-7,2.0747e-9,-9.484e-13,4.1635]:[-5800.2206,1.3914993,-.04860239,4.1764768e-5,-1.4452093e-8,0,6.5459673];var k=t+273.15;if(k<173)return 1e-4;return Math.exp(c[0]/k+c[1]+c[2]*k+c[3]*k*k+c[4]*k*k*k+c[5]*k*k*k*k+c[6]*Math.log(k))/1e3;}
  function getW(t,rh){var ps=psat(t),pw=Math.max(0,rh)/100*ps;return .621945*pw/(Pa-pw);}

  /* ---------- CONSTANTS ---------- */
  var T_MIN=-15,T_MAX=50,W_MAX=30;
  var SX=260,SY=200,SZ=150;
  function t2sx(t){return(t-T_MIN)/(T_MAX-T_MIN)*SX;}
  function w2sz(wkg){return Math.max(0,Math.min(SZ,SZ-(wkg*1000/W_MAX)*SZ));}
  function frac2sy(f){return f*SY;}

  /* enthalpy helper */
  function enthalpy(T,W){return 1.006*T+W*(2501+1.86*T);}

  /* Givoni-style band table — must mirror collector.py BANDS verbatim.
     Module-scoped so renderTimeSeries2D and buildDeltaH share the same logic. */
  var BANDS=[
    {id:'B1', oa_t:[-50,5], oa_rh:[0,30],   sa_t:21.0, sa_rh:40, oa_damper:15},
    {id:'B2', oa_t:[5,15],  oa_rh:[30,60],  sa_t:19.5, sa_rh:35, oa_damper:15},
    {id:'B3', oa_t:[15,20], oa_rh:[0,30],   sa_t:19.0, sa_rh:45, oa_damper:30},
    {id:'B4', oa_t:[18,22], oa_rh:[30,50],  sa_t:20.0, sa_rh:40, oa_damper:100},
    {id:'B5', oa_t:[22,25], oa_rh:[40,60],  sa_t:23.5, sa_rh:50, oa_damper:100},
    {id:'B6', oa_t:[25,27], oa_rh:[50,70],  sa_t:25.0, sa_rh:55, oa_damper:50},
    {id:'B10',oa_t:[30,50], oa_rh:[85,100], sa_t:11.0, sa_rh:95, oa_damper:15},
    {id:'B7', oa_t:[27,32], oa_rh:[60,80],  sa_t:12.0, sa_rh:95, oa_damper:15},
    {id:'B8', oa_t:[32,38], oa_rh:[70,100], sa_t:13.0, sa_rh:95, oa_damper:15},
    {id:'B9', oa_t:[35,50], oa_rh:[0,30],   sa_t:15.0, sa_rh:40, oa_damper:15}
  ];
  /* Cold-blue → hot-orange ramp ordered by band thermal severity.  Module-
     scoped so the boxed legend, transition markers, and (future) tooltip
     swatches all share the same palette. */
  var BAND_COLOR = {
    B1:'#1e40af', B2:'#2563eb', B3:'#0ea5e9', B4:'#06b6d4', B5:'#10b981',
    B6:'#84cc16', B7:'#facc15', B8:'#fb923c', B9:'#f97316', B10:'#ea580c'
  };
  /* Band ids ordered for the ramp legend (visual climate severity, NOT the
     numeric BANDS table order — B9 is hot-dry, B10 is hot-humid). */
  var BAND_ORDER = ['B1','B2','B3','B4','B5','B6','B7','B8','B9','B10'];

  /* ===== Season palettes =====
     Each climate type has a 12-month array of season-labels + a color map.
     Drawn as a thin strip under each panel's plot area in the Monthly \u00d7 Sites
     chart so the user can read seasonal patterns at a glance. */
  var SEASON_COLOR = {
    // Temperate 4-season (N / S)
    winter:'#60a5fa', spring:'#84cc16', summer:'#f97316', fall:'#a16207',
    // Tropical (Singapore: monsoon pattern)
    ne_monsoon:'#3b82f6', inter1:'#a78bfa', sw_monsoon:'#fb923c', inter2:'#facc15',
    // Arid subtropical (Dubai, Riyadh)
    cool_season:'#60a5fa', transition:'#a78bfa', hot_season:'#dc2626'
  };
  // 12-month calendars (0=Jan \u2026 11=Dec)
  var SEASON_CAL = {
    north_4s:  ['winter','winter','spring','spring','spring','summer','summer','summer','fall','fall','fall','winter'],
    south_4s:  ['summer','summer','fall','fall','fall','winter','winter','winter','spring','spring','spring','summer'],
    tropical:  ['ne_monsoon','ne_monsoon','inter1','inter1','inter1','sw_monsoon','sw_monsoon','sw_monsoon','inter2','inter2','inter2','ne_monsoon'],
    arid:      ['cool_season','cool_season','cool_season','transition','hot_season','hot_season','hot_season','hot_season','hot_season','transition','cool_season','cool_season']
  };
  /* Climate classifier. Picks one of the 4 calendars using latitude (and a
     crude longitude check for the MENA-style arid belt).  Not a rigorous
     K\u00f6ppen classification \u2014 just enough to colour seasons sensibly. */
  function _climateTypeFor(lat,lon){
    var aLat=Math.abs(lat);
    if(aLat<15) return 'tropical';
    // Arid subtropical band: rough MENA / Arabian Peninsula box.
    // Lon 20\u201360\u00b0 E covers Morocco to Oman; lat 15\u201335\u00b0 N is the Saharo-Arabian belt.
    if(aLat<35 && aLat>=20 && lon>=20 && lon<=60 && lat>0) return 'arid';
    return lat>0 ? 'north_4s' : 'south_4s';
  }
  function _seasonCalFor(lat,lon){return SEASON_CAL[_climateTypeFor(lat,lon)];}
  /* Human-readable title per season key (used in the legend under the chart). */
  var SEASON_LABEL = {
    winter:'Winter', spring:'Spring', summer:'Summer', fall:'Autumn',
    ne_monsoon:'NE Monsoon', inter1:'Inter-Monsoon 1', sw_monsoon:'SW Monsoon', inter2:'Inter-Monsoon 2',
    cool_season:'Cool', transition:'Transition', hot_season:'Hot'
  };
  function classifyBand(oa_t,oa_rh){
    for(var k=0;k<BANDS.length;k++){
      var b=BANDS[k];
      if(b.oa_t[0]<=oa_t&&oa_t<=b.oa_t[1]&&b.oa_rh[0]<=oa_rh&&oa_rh<=b.oa_rh[1]) return b;
    }
    var best=BANDS[4],bd=Infinity;
    for(var j=0;j<BANDS.length;j++){
      var b2=BANDS[j];
      var tm=(b2.oa_t[0]+b2.oa_t[1])/2, rm=(b2.oa_rh[0]+b2.oa_rh[1])/2;
      var d=(oa_t-tm)*(oa_t-tm)+(oa_rh-rm)*(oa_rh-rm);
      if(d<bd){bd=d;best=b2;}
    }
    return best;
  }
  var DH_MAX=80;

  /* ---------- TEMP COLOR ---------- */
  function t2rgb(t){
    var n=Math.max(0,Math.min(1,(t-T_MIN)/(T_MAX-T_MIN)));
    var r,g,b;
    if(n<.18){var f=n/.18;r=0;g=0;b=.25+.75*f;}
    else if(n<.35){var f=(n-.18)/.17;r=0;g=.7*f;b=1;}
    else if(n<.48){var f=(n-.35)/.13;r=0;g=.7+.3*f;b=1-f;}
    else if(n<.62){var f=(n-.48)/.14;r=f;g=1;b=0;}
    else if(n<.78){var f=(n-.62)/.16;r=1;g=1-.45*f;b=0;}
    else{var f=(n-.78)/.22;r=1;g=.55-.55*f;b=0;}
    return[r,g,b];
  }
  /* legend bar */
  (function(){var cv=$('#p3-tbcv'),cx=cv.getContext('2d');for(var y=0;y<150;y++){var t=T_MAX-(y/150)*(T_MAX-T_MIN);var c=t2rgb(t);cx.fillStyle='rgb('+Math.round(c[0]*255)+','+Math.round(c[1]*255)+','+Math.round(c[2]*255)+')';cx.fillRect(0,y,10,1);}})();

  /* ---------- PSY CHART CANVAS (texture) ---------- */
  function drawPsyCanvas(){
    var W=2048,H=Math.round(W*(W_MAX/(T_MAX-T_MIN))*(SZ/SX));
    var cv=document.createElement('canvas');cv.width=W;cv.height=H;
    var ctx=cv.getContext('2d');
    function tx(t){return(t-T_MIN)/(T_MAX-T_MIN)*W;}
    function wy(w){return H-(w/W_MAX)*H;}
    var _lt = _p3Theme() === 'light';
    ctx.fillStyle = _lt ? '#c5cbd2' : '#020617';
    ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='rgba(71,85,105,.35)';ctx.lineWidth=1;
    for(var t=T_MIN;t<=T_MAX;t+=5){var x=tx(t);ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(var w=0;w<=W_MAX;w+=5){var y=wy(w);ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    for(var rh=10;rh<=100;rh+=10){
      ctx.beginPath();ctx.strokeStyle=rh===100?'rgba(96,165,250,.9)':'rgba(96,165,250,.2)';ctx.lineWidth=rh===100?3:1;
      var started=false;
      for(var t=T_MIN;t<=T_MAX;t+=.3){var wv=getW(t,rh)*1000;if(wv>W_MAX)break;var x=tx(t),y=wy(wv);started?ctx.lineTo(x,y):ctx.moveTo(x,y);started=true;}
      ctx.stroke();
      if(rh<100&&rh%20===0){var lt=T_MAX-5;var lw=getW(lt,rh)*1000;if(lw<W_MAX&&lw>0){ctx.fillStyle='rgba(148,163,184,.5)';ctx.font='bold 22px monospace';ctx.fillText(rh+'%',tx(lt)+4,wy(lw)-4);}}
    }
    ctx.strokeStyle='rgba(148,163,184,.12)';ctx.lineWidth=1;
    for(var h=0;h<=140;h+=10){ctx.beginPath();var s2=false;for(var t=T_MIN;t<=T_MAX;t+=.5){var w2=(h-1.006*t)/(2501+1.86*t);var wg=w2*1000;if(wg<0||wg>W_MAX)continue;var x=tx(t),y=wy(wg);s2?ctx.lineTo(x,y):ctx.moveTo(x,y);s2=true;}ctx.stroke();}
    var czPts=[];for(var t=20;t<=25;t+=.5)czPts.push([t,getW(t,80)*1000]);czPts.push([27,getW(27,50)*1000]);czPts.push([27,getW(27,20)*1000]);for(var t=27;t>=20;t-=.5)czPts.push([t,getW(t,20)*1000]);
    ctx.beginPath();czPts.forEach(function(p,i){var x=tx(p[0]),y=wy(p[1]);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();
    ctx.fillStyle='rgba(16,185,129,.1)';ctx.fill();ctx.strokeStyle='rgba(52,211,153,.6)';ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle='rgba(52,211,153,.45)';ctx.font='bold 26px monospace';ctx.fillText('Comfort',tx(22),wy(getW(23,50)*1000));
    ctx.fillStyle='rgba(148,163,184,.6)';ctx.font='bold 20px monospace';
    for(var t=T_MIN;t<=T_MAX;t+=5)ctx.fillText(t+'\u00b0',tx(t)-10,H-4);
    for(var w=5;w<=W_MAX;w+=5)ctx.fillText(w,W-40,wy(w)+6);
    return cv;
  }

  /* ---------- LOAD THREE.JS THEN BUILD SCENE ---------- */
  function loadScripts(cb){
    if(window.THREE && window.THREE.OrbitControls){cb();return;}
    if(window.THREE){
      var s2=document.createElement('script');s2.src='https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
      s2.onload=cb;document.head.appendChild(s2);return;
    }
    var s1=document.createElement('script');
    s1.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    s1.onload=function(){
      var s2=document.createElement('script');s2.src='https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
      s2.onload=cb;document.head.appendChild(s2);
    };
    document.head.appendChild(s1);
  }

  loadScripts(function(){
    /* Retry until container has non-zero dimensions (handles display:none → block transition) */
    var retries = 0;
    function tryBuild(){
      if(root.clientWidth > 10 && root.clientHeight > 10){ buildScene(); return; }
      if(++retries < 30) setTimeout(tryBuild, 100); /* retry up to 3s */
    }
    tryBuild();
  });

  /* ---------- SCENE ---------- */
  var scene,cam,ren,orb,basePlane,pathGroup,projGroup,czGroup,dhFloorGroup,vavGroup;
  var _p3RedrawPsyTex = null; /* populated by buildScene so theme listener can redraw floor chart */
  var weatherData=[],timeLabels=[],vavData=[];
  var projMode='lines'; /* 'lines' | 'dots' | 'vav' — shared between setupControls and render2DChart */
  var chart2DMode='psy'; /* 'psy' | 'tt' | 'wt' — drives the 2D overlay layout */
  /* Whether the green B1-B10 cumulative curve, its transition markers, its
     endpoint label, and the band-ramp legend are rendered.  Off by default so
     the user opts into the band-strategy view via the dedicated button. */
  var _p3ShowBandStrategy = false;
  /* Cached during T×Time render so the mousemove handler can build per-point
     tooltips that include the active control band, its SA setpoint and the
     OA damper % without re-running classifyBand on every mouse event. */
  var _ttCache = null;
  /* Per-site monthly B1-B10 vs baseline cache.  Populated on first click of
     the "Monthly \u00d7 Sites" button.  Keyed by preset code (NYC/LON/\u2026) so
     we only hit Open-Meteo once per session per site. */
  var _monthlyCache = {};
  var _monthlyFetching = false;
  /* Order in which panels should be drawn \u2014 saved user locations first, then
     presets.  Populated by _fetchMonthlyAllSites after it queries
     /api/weather-location. */
  var _monthlySiteOrder = [];
  /* Layout rects of the per-site panels cached on each render so a click
     handler can find which panel the user clicked (used to retry failed
     fetches without re-fetching all 10 sites). */
  var _monthlyPanelRects = {};
  /* Click rects for the selectable site-chip ribbon at the top of the
     Monthly × Sites canvas.  {code: {x,y,w,h}}.  Repopulated on every
     render so a click handler can map (px,py) → site code → toggle.   */
  var _monthlyChipRects = {};
  /* Set of selected site codes that should actually render as panels.
     Initialized on the first open of the Monthly × Sites view to ONLY
     the site that matches the dashboard\u2019s current weather-strip lat/lon
     (so the chart starts narrow and explicit, then the user opts in to
     additional comparison sites by clicking chips).                    */
  var _monthlySelected = null;
  /* Toggle state for the Monthly \u00d7 Sites strategy overlays.  Fixed-SA
     starts ON (it's the natural baseline reference); the other 3 start OFF
     so a fresh user sees an unambiguous Fixed-SA-only chart and reveals
     each comparison strategy on demand.  All 4 are independently toggleable
     so an analyst can isolate, say, B1-B10 vs Dyn-Reset alone. */
  var _msShowFixed = true;
  var _msShowDyn = false;
  var _msShowBand = false;
  var _msShowBandDyn = false;
  /* Opt-SA cumulative — theoretical floor.  Redefined 2026-02 as a true
     thermodynamic floor: h_sa_opt(t) = clamp(h_oa(t), optMinH, optMaxH).
     The system only conditions air whose enthalpy falls outside the
     [optMinH, optMaxH] comfort envelope; inside the envelope the OA can
     be supplied as-is (zero conditioning energy).  This is unrealizable
     in practice (requires perfect foresight + perfectly modulating coils)
     but represents the lowest-possible air-side conditioning load any
     SA-reset strategy could ever achieve.  Bounds default to 25–50 kJ/kg
     (≈ 12 °C @ 50 % RH … 22 °C @ 60 % RH) and are user-adjustable via
     the two sliders rendered next to the Opt-SA toggle button. */
  var _msShowOpt = false;
  /* Visualisation toggle — show OA-damper line + monthly strip on each
     panel.  ON by default since the user explicitly asked for an OA
     intake indication on the chart. */
  var _msShowOA = true;
  var spinning=false,panelOpen=true;
  /* Set by buildScene() to refresh the Sites checkbox dropdown trigger
     label and panel content from inside renderMonthlySitesChart so the
     trigger reflects late-arriving Open-Meteo fetches. */
  var _refreshSitesDD = null;
  var W3,H3;

  function buildScene(){
    var THREE=window.THREE;
    W3=root.clientWidth;H3=root.clientHeight;
    scene=new THREE.Scene();scene.background=new THREE.Color(_p3Theme() === 'light' ? P3_LIGHT_BG : P3_DARK_BG);
    cam=new THREE.PerspectiveCamera(45,W3/H3,.1,3000);cam.position.set(320,220,300);
    /* Guard the WebGLRenderer ctor — if the browser has somehow run out
       of contexts (other tabs, hardware accel disabled, GPU process
       crashed, etc.) the THREE constructor throws "Error creating
       WebGL context" which used to bubble up and trip the React error
       boundary, producing the "React Rendering Crash Prevented"
       black-screen the user reported.  Catch it locally, paint a
       human-readable fallback into the container, and bail without
       killing the rest of the dashboard. */
    try {
      ren = new THREE.WebGLRenderer({antialias:true, powerPreference:'high-performance'});
    } catch(glErr) {
      try { console.error('[psy3d] WebGL context unavailable:', glErr); } catch(e){}
      try {
        var fb = document.createElement('div');
        fb.style.cssText = 'padding:24px;color:#94a3b8;background:#0f172a;font-family:system-ui,sans-serif;line-height:1.55;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center';
        fb.innerHTML = '<div style="font-size:14px;font-weight:700;color:#fbbf24;letter-spacing:.05em;text-transform:uppercase;margin-bottom:12px">3D weather strip unavailable</div>'+
          '<div style="font-size:12px;max-width:520px">The browser refused a WebGL context.  Common causes:</div>'+
          '<ul style="font-size:11px;text-align:left;margin-top:12px;max-width:520px"><li>Other browser tabs holding too many contexts \u2014 close them and click Retry</li>'+
          '<li>Hardware acceleration disabled in browser settings</li>'+
          '<li>GPU process crashed \u2014 restart the browser</li></ul>'+
          '<button id="p3-wgl-retry" style="margin-top:16px;padding:8px 20px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;background:#1e293b;color:#60a5fa;border:1px solid #60a5fa;border-radius:6px;cursor:pointer;font-family:inherit">Retry</button>'+
          '<div style="font-size:9px;color:#64748b;margin-top:10px">Auto-retries when you switch back to this tab.</div>'+
          '<div style="font-size:10px;color:#64748b;margin-top:14px">Build: ' + BUILD_TAG + '</div>';
        root.appendChild(fb);
        // Clean up page-wide flag so retry can actually create a fresh
        // init without being blocked by the one-context guard.
        var doRetry = function(){
          try {
            window.__psy3dActive = false;
            if (container) { container.removeAttribute('data-psy3d-built'); container.__psy3dHandle = null; }
            // Remove fallback UI + call initPsy3D again.
            if (fb.parentNode) fb.parentNode.removeChild(fb);
            document.removeEventListener('visibilitychange', visHandler);
            window.initPsy3D(container, opts);
          } catch(e) { console.warn('[psy3d] retry failed:', e); }
        };
        var visHandler = function(){
          if (!document.hidden) {
            // Small delay so other tabs' contexts actually drop.
            setTimeout(doRetry, 250);
          }
        };
        document.addEventListener('visibilitychange', visHandler);
        var btn = fb.querySelector('#p3-wgl-retry');
        if (btn) btn.onclick = doRetry;
      } catch(_){}
      _disposed = true; _running = false;
      window.__psy3dActive = false;
      if (container) { container.removeAttribute('data-psy3d-built'); container.__psy3dHandle = null; }
      return;
    }
    ren.setSize(W3,H3);ren.setPixelRatio(Math.min(devicePixelRatio,2));
    root.appendChild(ren.domElement);
    orb=new THREE.OrbitControls(cam,ren.domElement);orb.enableDamping=true;orb.dampingFactor=.08;orb.target.set(SX/2,SY/3,SZ/2);

    scene.add(new THREE.AmbientLight(0xb0bec5,.5));
    var dl1=new THREE.DirectionalLight(0xffffff,.5);dl1.position.set(200,300,100);scene.add(dl1);
    var dl2=new THREE.DirectionalLight(0x60a5fa,.15);dl2.position.set(-100,200,-100);scene.add(dl2);

    /* base plane */
    var psyCv=drawPsyCanvas();
    var psyTex=new THREE.CanvasTexture(psyCv);psyTex.minFilter=THREE.LinearFilter;
    basePlane=new THREE.Mesh(new THREE.PlaneGeometry(SX,SZ),new THREE.MeshBasicMaterial({map:psyTex,transparent:true,opacity:.75,side:THREE.DoubleSide}));
    basePlane.rotation.x=-Math.PI/2;basePlane.position.set(SX/2,0,SZ/2);scene.add(basePlane);
    // Expose a redraw hook so theme toggle can refresh the floor-plane chart
    _p3RedrawPsyTex = function(){
        try {
            var cv2 = drawPsyCanvas();
            var dctx = psyCv.getContext('2d');
            psyCv.width = cv2.width; psyCv.height = cv2.height;
            dctx.drawImage(cv2, 0, 0);
            psyTex.needsUpdate = true;
        } catch(e){}
    };

    /* grids */
    var gP=[];for(var i=0;i<=10;i++){var x=i/10*SX;gP.push(new THREE.Vector3(x,-.1,0),new THREE.Vector3(x,-.1,SZ));}
    for(var j=0;j<=6;j++){var z=j/6*SZ;gP.push(new THREE.Vector3(0,-.1,z),new THREE.Vector3(SX,-.1,z));}
    scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(gP),new THREE.LineBasicMaterial({color:0x1e293b,transparent:true,opacity:.3})));
    var bP=[];for(var i=0;i<=10;i++){var x=i/10*SX;bP.push(new THREE.Vector3(x,0,0),new THREE.Vector3(x,SY,0));}
    for(var j=0;j<=8;j++){var y=j/8*SY;bP.push(new THREE.Vector3(0,y,0),new THREE.Vector3(SX,y,0));}
    scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(bP),new THREE.LineBasicMaterial({color:0x1e293b,transparent:true,opacity:.2})));
    var sP=[];for(var i=0;i<=8;i++){var y=i/8*SY;sP.push(new THREE.Vector3(0,y,0),new THREE.Vector3(0,y,SZ));}
    for(var j=0;j<=6;j++){var z=j/6*SZ;sP.push(new THREE.Vector3(0,0,z),new THREE.Vector3(0,SY,z));}
    scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(sP),new THREE.LineBasicMaterial({color:0x1e293b,transparent:true,opacity:.2})));
    scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0),new THREE.Vector3(SX+6,0,0),new THREE.Vector3(0,0,0),new THREE.Vector3(0,SY+6,0),new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,SZ+6)]),new THREE.LineBasicMaterial({color:0x64748b})));

    /* labels */
    function mkT(text,col,sz){var c=document.createElement('canvas'),x=c.getContext('2d');c.width=512;c.height=64;x.font='bold 30px monospace';x.fillStyle=col||'#94a3b8';x.textAlign='center';x.textBaseline='middle';x.fillText(text,256,32);var t=new THREE.CanvasTexture(c);var s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false}));s.scale.set(sz||28,(sz||28)*.125,1);return s;}
    var xt=mkT(_t('dry_bulb_temp')+' (\u00b0C)','#60a5fa',26);xt.position.set(SX/2,-14,-10);scene.add(xt);
    var zt=mkT(_t('humidity_ratio')+' (g/kg)','#60a5fa',24);zt.position.set(-18,-8,SZ/2);scene.add(zt);
    var yt=mkT('TIME','#60a5fa',22);yt.position.set(-14,SY/2,-8);scene.add(yt);
    for(var t=T_MIN;t<=T_MAX;t+=10){var s=mkT(t+'\u00b0','#94a3b8',18);s.position.set(t2sx(t),-8,-6);scene.add(s);}
    for(var w=5;w<=W_MAX;w+=5){var s=mkT(w+'','#94a3b8',16);s.position.set(-10,-6,w2sz(w/1000));scene.add(s);}

    /* comfort zone 3D volume */
    czGroup=new THREE.Group();
    var czPoly=[];for(var t=20;t<=25;t+=1)czPoly.push({t:t,w:getW(t,80)});czPoly.push({t:27,w:getW(27,50)});czPoly.push({t:27,w:getW(27,20)});for(var t=27;t>=20;t-=1)czPoly.push({t:t,w:getW(t,20)});
    [0,SY].forEach(function(y){var pts=czPoly.map(function(p){return new THREE.Vector3(t2sx(p.t),y,w2sz(p.w));});pts.push(pts[0].clone());czGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0x10b981,transparent:true,opacity:.5})));});
    czPoly.forEach(function(p,i){var x=t2sx(p.t),z=w2sz(p.w);czGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x,0,z),new THREE.Vector3(x,SY,z)]),new THREE.LineBasicMaterial({color:0x10b981,transparent:true,opacity:.25})));});
    var sideVerts=[];for(var i=0;i<czPoly.length;i++){var j=(i+1)%czPoly.length;var x0=t2sx(czPoly[i].t),z0=w2sz(czPoly[i].w);var x1=t2sx(czPoly[j].t),z1=w2sz(czPoly[j].w);sideVerts.push(x0,0,z0,x1,0,z1,x1,SY,z1);sideVerts.push(x0,0,z0,x1,SY,z1,x0,SY,z0);}
    var sideGeo=new THREE.BufferGeometry();sideGeo.setAttribute('position',new THREE.Float32BufferAttribute(sideVerts,3));sideGeo.computeVertexNormals();
    czGroup.add(new THREE.Mesh(sideGeo,new THREE.MeshBasicMaterial({color:0x10b981,transparent:true,opacity:.06,side:THREE.DoubleSide,depthWrite:false})));
    var capShape=new THREE.Shape();czPoly.forEach(function(p,i){var x=t2sx(p.t),z=w2sz(p.w);i===0?capShape.moveTo(x,z):capShape.lineTo(x,z);});
    var capGeo=new THREE.ShapeGeometry(capShape);var capMat=new THREE.MeshBasicMaterial({color:0x10b981,transparent:true,opacity:.08,side:THREE.DoubleSide,depthWrite:false});
    var botCap=new THREE.Mesh(capGeo,capMat);botCap.rotation.x=-Math.PI/2;botCap.position.y=0;czGroup.add(botCap);
    var topCap=new THREE.Mesh(capGeo.clone(),capMat.clone());topCap.rotation.x=-Math.PI/2;topCap.position.y=SY;czGroup.add(topCap);
    scene.add(czGroup);

    pathGroup=new THREE.Group();scene.add(pathGroup);
    projGroup=new THREE.Group();scene.add(projGroup);
    dhFloorGroup=new THREE.Group();scene.add(dhFloorGroup);
    vavGroup=new THREE.Group();scene.add(vavGroup);

    setupControls(mkT);
    startRender();

    /* auto-load from localStorage or defaults */
    try{
      var stored=JSON.parse(localStorage.getItem('weatherLocation'));
      if(stored&&stored.lat&&stored.lon){
        $('#p3-lat').value=stored.lat;$('#p3-lon').value=stored.lon;
        $('#p3-name').value=stored.name||'Dashboard Location';
      }
    }catch(e){}
    if(opts.weatherLocation){
      var wl=opts.weatherLocation;
      if(wl.lat)$('#p3-lat').value=wl.lat;
      if(wl.lon)$('#p3-lon').value=wl.lon;
      if(wl.name)$('#p3-name').value=wl.name;
    }
    setTimeout(doFetch,300);
  }

  /* ---------- CONTROLS WIRING ---------- */
  function setupControls(mkT){
    var THREE=window.THREE;

    /* panel toggle */
    $('#p3-panel-hdr').onclick=function(){panelOpen=!panelOpen;$('#p3-panel-body').style.display=panelOpen?'block':'none';$('#p3-ptgl').textContent=panelOpen?'\u25BC':'\u25B6';};

    /* location presets */
    var locs=[['NYC',40.71,-74.01,'New York'],['LON',51.51,-0.13,'London'],['SIN',1.35,103.82,'Singapore'],['TYO',35.68,139.69,'Tokyo'],['DXB',25.20,55.27,'Dubai'],['SYD',-33.87,151.21,'Sydney']];
    var lpEl=$('#p3-loc-presets');
    locs.forEach(function(l){var b=document.createElement('button');b.textContent=l[0];b.onclick=function(){$('#p3-lat').value=l[1];$('#p3-lon').value=l[2];$('#p3-name').value=l[3];};lpEl.appendChild(b);});

    /* duration buttons */
    var durEl=$('#p3-dur-btns');
    ['year','month','week'].forEach(function(d){var b=document.createElement('button');b.textContent=d.toUpperCase();b.id='p3-d-'+d;if(d==='year')b.className='p3act';b.onclick=function(){durEl.querySelectorAll('button').forEach(function(x){x.className='';});b.className='p3act';};durEl.appendChild(b);});

    /* quick presets */
    var qEl=$('#p3-quick');
    var quicks=[['2025','2025-01-01','2025-12-31'],['2026 YTD','2026-01-01','today'],['Last Mo','lastmonth','today'],['Last Wk','lastweek','today']];
    quicks.forEach(function(q){var b=document.createElement('button');b.textContent=q[0];b.onclick=function(){
      var now=new Date();var toStr=q[2]==='today'?now.toISOString().slice(0,10):q[2];
      var fromStr=q[1];
      if(q[1]==='lastmonth'){var d=new Date(now);d.setMonth(d.getMonth()-1);fromStr=d.toISOString().slice(0,10);}
      if(q[1]==='lastweek'){var d=new Date(now);d.setDate(d.getDate()-7);fromStr=d.toISOString().slice(0,10);}
      $('#p3-from').value=fromStr;$('#p3-to').value=toStr;
    };qEl.appendChild(b);});

    /* fetch button */
    $('#p3-fetch').onclick=doFetch;

    /* Update ΔH on slider change. Re-render the 2D overlay too if it is
       visible so T×Time / W×Time / X-Y Detail respond live to SA setpoint
       and Occupants edits made from the floating Weather Strip panel. */
    function refresh2DIfVisible(){
      if($('#p3-overlay2d').style.display!=='none'){render2DChart();}
    }
    $('#p3-sa-t').oninput=function(){$('#p3-sa-t-val').textContent=this.value;if(weatherData.length>0){buildDeltaH();buildVAVScatter();}refresh2DIfVisible();};
    $('#p3-sa-rh').oninput=function(){$('#p3-sa-rh-val').textContent=this.value;if(weatherData.length>0){buildDeltaH();buildVAVScatter();}refresh2DIfVisible();};
    $('#p3-occ').onchange=function(){if(weatherData.length>0){buildDeltaH();buildVAVScatter();}refresh2DIfVisible();};

    /* toggles */
    var tgEl=$('#p3-toggles');
    var layers={chart:basePlane,path:pathGroup,proj:projGroup,comfort:czGroup,dhFloor:dhFloorGroup,vav:vavGroup};
    [['chart','#60a5fa','Psy Chart'],['path','#f472b6','Weather Path'],['proj','#fbbf24','Base Proj'],['comfort','#10b981','Comfort 3D'],['dhFloor','#f59e0b','\u0394H Strip'],['vav','#a78bfa','VAV CZ']].forEach(function(t){
      var div=document.createElement('div');div.className='p3-tgl';div.id='p3-tgl-'+t[0];
      div.innerHTML='<span class="p3td" style="background:'+t[1]+'"></span>'+t[2];
      div.onclick=function(){var o=layers[t[0]];if(!o)return;o.visible=!o.visible;div.classList.toggle('p3off',!o.visible);};
      tgEl.appendChild(div);
    });

    /* camera presets */
    var ctrlEl=$('#p3-ctrls');
    [['iso','Isometric'],['top','Psy \u2193'],['front','T\u00d7Time'],['side','W\u00d7Time'],['spin','Spin'],['dh','\u0394H\u00d7Time'],['vav','VAV CZ']].forEach(function(c,i){
      var b=document.createElement('button');b.textContent=c[1];b.id='p3-c-'+c[0];if(i===0)b.className='p3act';
      if(c[0]==='dh'){b.style.borderColor='#f59e0b';b.style.color='#f59e0b';}
      if(c[0]==='vav'){b.style.borderColor='#a78bfa';b.style.color='#a78bfa';}
      b.onclick=function(){
        if(c[0]==='spin'){spinning=!spinning;b.classList.toggle('p3act',spinning);return;}
        // T×Time and W×Time now render as flat 2D charts (time on X axis,
        // temp or humidity on Y) via the same 2D overlay infrastructure used
        // by the X-Y Detail button. Much more legible than rotating the 3D
        // scene because the depth cues stop competing with the data lines.
        if(c[0]==='front'||c[0]==='side'){
          chart2DMode = (c[0]==='front') ? 'tt' : 'wt';
          $('#p3-overlay2d').style.display='block';
          // Float the Weather Strip config panel above the 2D overlay so the
          // user can edit SA setpoint / location / duration without going back
          // to the 3D view. Toggled off again in the Back-to-3D handler.
          root.classList.add('p3-2d-cfg');
          // Hide the projection-mode toggle in time-series modes — it's
          // psychrometric-chart specific (OA→SA lines, Landing Zones, VAV).
          var pmBtn=$('#p3-btn-proj-mode'); if(pmBtn) pmBtn.style.display='none';
          // Band-strategy toggle is only meaningful in T×Time (the green
          // cumulative curve + its band markers + ramp legend).
          var bsBtn=$('#p3-btn-band-strategy'); if(bsBtn) bsBtn.style.display = (c[0]==='front') ? 'block' : 'none';
          // Monthly \u00d7 Sites multi-city comparison only in T\u00d7Time.
          var msBtn=$('#p3-btn-monthly-sites'); if(msBtn) msBtn.style.display = (c[0]==='front') ? 'block' : 'none';
          // Strategy-overlay toggles only valid inside Monthly \u00d7 Sites mode.
          ['p3-btn-ms-fixed','p3-btn-ms-dyn','p3-btn-ms-band','p3-btn-ms-banddyn','p3-btn-ms-opt','p3-btn-ms-oa','p3-btn-sites-dd','p3-ms-optcfg'].forEach(function(id){
            var el=$('#'+id); if(el) el.style.display='none';
          });
          var sddP=$('#p3-sites-dd-panel'); if(sddP) sddP.style.display='none';
          render2DChart();
          ctrlEl.querySelectorAll('button').forEach(function(x){if(x.id!=='p3-c-spin')x.classList.remove('p3act');});
          b.classList.add('p3act');
          return;
        }
        var tgt=new THREE.Vector3(SX/2,SY/3,SZ/2);
        if(c[0]==='iso')cam.position.set(320,220,300);
        else if(c[0]==='top'){cam.position.set(SX/2,480,SZ/2);tgt.set(SX/2,0,SZ/2);}
        else if(c[0]==='dh'){cam.position.set(SX/2,SY/2,340);tgt.set(SX/2,SY/2,0);}
        else if(c[0]==='vav'){cam.position.set(-200,SY/2,SZ/2);tgt.set(0,SY/2,SZ/2);}
        orb.target.copy(tgt);orb.update();
        ctrlEl.querySelectorAll('button').forEach(function(x){if(x.id!=='p3-c-spin')x.classList.remove('p3act');});
        b.classList.add('p3act');
      };
      ctrlEl.appendChild(b);
    });

    /* X-Y Detail (2D) button */
    var b2d=document.createElement('button');b2d.textContent='X-Y Detail';b2d.style.borderColor='#f472b6';b2d.style.color='#f472b6';
    b2d.onclick=function(){
      chart2DMode='psy';
      var pmBtn=$('#p3-btn-proj-mode'); if(pmBtn) pmBtn.style.display='block';
      var bsBtn=$('#p3-btn-band-strategy'); if(bsBtn) bsBtn.style.display='none';
      var msBtn=$('#p3-btn-monthly-sites'); if(msBtn) msBtn.style.display='none';
      ['p3-btn-ms-fixed','p3-btn-ms-dyn','p3-btn-ms-band','p3-btn-ms-banddyn','p3-btn-ms-opt','p3-btn-ms-oa','p3-btn-sites-dd','p3-ms-optcfg'].forEach(function(id){
        var el=$('#'+id); if(el) el.style.display='none';
      });
      var sddP=$('#p3-sites-dd-panel'); if(sddP) sddP.style.display='none';
      $('#p3-overlay2d').style.display='block';
      root.classList.remove('p3-2d-cfg');
      render2DChart();
    };
    ctrlEl.appendChild(b2d);

    /* Back to 3D button */
    $('#p3-btn-back3d').onclick=function(){
      $('#p3-overlay2d').style.display='none';$('#p3-tip2d').style.display='none';
      chart2DMode='psy';
      root.classList.remove('p3-2d-cfg');
      var pmBtn=$('#p3-btn-proj-mode'); if(pmBtn) pmBtn.style.display='block';
      var bsBtn=$('#p3-btn-band-strategy'); if(bsBtn) bsBtn.style.display='none';
      var msBtn=$('#p3-btn-monthly-sites'); if(msBtn) msBtn.style.display='none';
      ['p3-btn-ms-fixed','p3-btn-ms-dyn','p3-btn-ms-band','p3-btn-ms-banddyn','p3-btn-ms-opt','p3-btn-ms-oa','p3-btn-sites-dd','p3-ms-optcfg'].forEach(function(id){
        var el=$('#'+id); if(el) el.style.display='none';
      });
      var sddP=$('#p3-sites-dd-panel'); if(sddP) sddP.style.display='none';
    };

    /* Projection mode toggle */
    var pmBtn=$('#p3-btn-proj-mode');
    pmBtn.style.cssText='position:absolute;top:12px;right:140px;z-index:51;background:rgba(15,23,42,.92);border:1px solid #f59e0b;color:#f59e0b;padding:6px 16px;border-radius:6px;font-size:10px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;font-family:inherit;backdrop-filter:blur(14px)';
    pmBtn.onclick=function(){
      var modes=['lines','dots','vav'];
      var idx=(modes.indexOf(projMode)+1)%modes.length;
      projMode=modes[idx];
      var labels={'lines':'OA\u2192SA Lines','dots':'SA Landing Zones','vav':'VAV Zone Delivery'};
      pmBtn.textContent='Mode: '+labels[projMode];
      render2DChart();
    };

    /* B1-B10 strategy toggle — only meaningful in T×Time mode.  Hidden when
       in W×Time / X-Y Detail / 3D.  Drives whether the green B1-B10 cumulative
       curve, its transition markers, the endpoint label, and the band-ramp
       legend (top-middle) are rendered. */
    var bsBtn=$('#p3-btn-band-strategy');
    bsBtn.style.cssText='position:absolute;top:12px;right:140px;z-index:51;background:rgba(15,23,42,.92);border:1px solid #10b981;color:#10b981;padding:6px 16px;border-radius:6px;font-size:10px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;font-family:inherit;backdrop-filter:blur(14px);display:none';
    function _refreshBandBtnLabel(){
      bsBtn.textContent = _p3ShowBandStrategy ? 'Hide B1-B10 Strategy' : 'Show B1-B10 Strategy';
      bsBtn.style.borderColor = _p3ShowBandStrategy ? '#10b981' : '#64748b';
      bsBtn.style.color       = _p3ShowBandStrategy ? '#10b981' : '#94a3b8';
      // Grey out / re-enable the SA slider section + its explanatory note.
      // The slider doesn't drive the B1\u2013B10 green curve (each band has its
      // own SA target in the BANDS table), so we make that explicit when the
      // strategy is on.
      if(_p3ShowBandStrategy){
        root.classList.add('p3-band-strategy');
        var note=$('#p3-sa-locknote'); if(note) note.style.display='block';
        var sat=$('#p3-sa-t'); if(sat) sat.title='Disabled: B1-B10 uses each band\u2019s own SA target';
        var sar=$('#p3-sa-rh'); if(sar) sar.title='Disabled: B1-B10 uses each band\u2019s own SA target';
      } else {
        root.classList.remove('p3-band-strategy');
        var note2=$('#p3-sa-locknote'); if(note2) note2.style.display='none';
        var sat2=$('#p3-sa-t'); if(sat2) sat2.title='';
        var sar2=$('#p3-sa-rh'); if(sar2) sar2.title='';
        // Hide any visible T×Time hover tooltip — it's gated on the
        // strategy view and shouldn't linger after the user toggles off.
        var tip=$('#p3-tip2d'); if(tip) tip.style.display='none';
      }
    }
    _refreshBandBtnLabel();
    bsBtn.onclick=function(){
      _p3ShowBandStrategy = !_p3ShowBandStrategy;
      _refreshBandBtnLabel();
      render2DChart();
    };

    /* Monthly \u00d7 Sites button \u2014 opens a multi-city monthly energy comparison
       for all preset weather locations.  Only shown in T\u00d7Time mode. */
    // Monthly \u00d7 Sites multi-city comparison only in T\u00d7Time.  Move a bit
    // further left than other buttons so the longer text ("BACK TO T\u00d7TIME"
    // when active) doesn't touch the Show/Hide B1-B10 Strategy button.
    var msBtn=$('#p3-btn-monthly-sites');
    msBtn.style.cssText='position:absolute;top:12px;right:360px;z-index:51;background:rgba(15,23,42,.92);border:1px solid #60a5fa;color:#60a5fa;padding:6px 16px;border-radius:6px;font-size:10px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;font-family:inherit;backdrop-filter:blur(14px);display:none';
    msBtn.onclick=function(){
      chart2DMode = (chart2DMode==='monthly-sites') ? 'tt' : 'monthly-sites';
      if(chart2DMode==='monthly-sites' && !Object.keys(_monthlyCache).length && !_monthlyFetching){
        _fetchMonthlyAllSites();
      }
      msBtn.style.borderColor = (chart2DMode==='monthly-sites') ? '#60a5fa' : '#475569';
      msBtn.style.color       = (chart2DMode==='monthly-sites') ? '#60a5fa' : '#94a3b8';
      msBtn.textContent       = (chart2DMode==='monthly-sites') ? 'Back to T\u00d7Time' : 'Monthly \u00d7 Sites';
      // Show/hide the 3 strategy-overlay toggle buttons + hide the T\u00d7Time
      // band-strategy toggle while in Monthly \u00d7 Sites mode (it doesn't apply
      // to the multi-city panel grid).
      var inMs = (chart2DMode==='monthly-sites');
      ['p3-btn-ms-fixed','p3-btn-ms-dyn','p3-btn-ms-band','p3-btn-ms-banddyn','p3-btn-ms-opt','p3-btn-ms-oa'].forEach(function(id){
        var el=$('#'+id); if(el) el.style.display = inMs ? 'block' : 'none';
      });
      // Opt-SA bound sliders only relevant when the Opt-SA curve is on.
      var ocfg = $('#p3-ms-optcfg');
      if (ocfg) ocfg.style.display = (inMs && _msShowOpt) ? 'block' : 'none';
      // Sites dropdown trigger follows the strategy toggles' visibility.
      var sdd = $('#p3-btn-sites-dd'); if (sdd) sdd.style.display = inMs ? 'block' : 'none';
      var sddP = $('#p3-sites-dd-panel'); if (sddP && !inMs) sddP.style.display = 'none';
      if (inMs && typeof _refreshSitesDD === 'function') _refreshSitesDD();
      var bs2=$('#p3-btn-band-strategy'); if(bs2) bs2.style.display = inMs ? 'none' : 'block';
      render2DChart();
    };

    /* Strategy-overlay toggles for Monthly \u00d7 Sites.  Fixed-SA is the always-on
       baseline; these 3 buttons toggle the comparison overlays (matching the
       cumulative-curve / monthly-bar palette) so the user can layer them on as
       needed instead of being shown all 4 strategies at once.  Positioned to
       the LEFT of the "Monthly \u00d7 Sites" / "Back to T\u00d7Time" button. */
    function _styleMsToggle(btn, color, leftFromMsBtn, label){
      var rightPx = 360 + leftFromMsBtn;
      btn.style.cssText='position:absolute;top:12px;right:'+rightPx+'px;z-index:51;background:rgba(15,23,42,.92);border:1px solid '+color+';color:'+color+';padding:6px 14px;border-radius:6px;font-size:10px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;font-family:inherit;backdrop-filter:blur(14px);display:none';
      btn.dataset.color = color;
      btn.dataset.label = label;
    }
    /* Same as _styleMsToggle but anchors the button to the LEFT side of the
       overlay instead of the right.  Used for "B1-B10 + Dyn-Reset" so the
       longest toggle label doesn't overlap the centered chart heading. */
    function _styleMsToggleLeft(btn, color, leftPx, label){
      btn.style.cssText='position:absolute;top:12px;left:'+leftPx+'px;z-index:51;background:rgba(15,23,42,.92);border:1px solid '+color+';color:'+color+';padding:6px 14px;border-radius:6px;font-size:10px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;font-family:inherit;backdrop-filter:blur(14px);display:none';
      btn.dataset.color = color;
      btn.dataset.label = label;
    }
    function _refreshMsBtn(btn, on){
      var color = btn.dataset.color;
      var label = btn.dataset.label;
      btn.style.borderColor = on ? color : '#475569';
      btn.style.color       = on ? color : '#94a3b8';
      btn.textContent       = (on ? '\u2713 ' : '+ ') + label;
    }
    var msDynBtn=$('#p3-btn-ms-dyn');
    var msBandBtn=$('#p3-btn-ms-band');
    var msBandDynBtn=$('#p3-btn-ms-banddyn');
    var msFixedBtn=$('#p3-btn-ms-fixed');
    /* Opt-SA toggle — created dynamically (the original overlay HTML
       hard-coded the original 4 strategies).  Sits just to the right of
       the "+ B1-B10" toggle so the row reads Fixed → Dyn → Band →
       Band+Dyn → Opt left-to-right at the top of the canvas. */
    var msOptBtn = $('#p3-btn-ms-opt');
    if (!msOptBtn) {
        msOptBtn = document.createElement('button');
        msOptBtn.id = 'p3-btn-ms-opt';
        msOptBtn.type = 'button';
        msOptBtn.textContent = '+ Opt-SA';
        $('#p3-overlay2d').appendChild(msOptBtn);
    }
    _styleMsToggle(msFixedBtn,  '#a855f7', 170, 'Fixed-SA');
    _styleMsToggle(msDynBtn,    '#d8b4fe', 320, 'Dyn-Reset');
    _styleMsToggle(msBandBtn,   '#10b981', 470, 'B1-B10');
    /* B1-B10 + Dyn-Reset has the longest label, so we anchor it on the LEFT
       side of the overlay (just past the floating Weather Strip config panel
       at canvas-x \u2248 270) where it cannot collide with the centered
       "MONTHLY AIR-SIDE ENERGY \u00d7 SITES" heading. */
    _styleMsToggleLeft(msBandDynBtn,'#22d3ee', 280, 'B1-B10 + Dyn-Reset');
    _styleMsToggle(msOptBtn,    '#c084fc', 595, 'Opt-SA');
    /* Two-layer hybrid: B1-B10 (climate-driven, every 5 min) sets the SA
       envelope; Dyn-Reset (zone-driven, every 1 min) trims SA \u00b12 \u00b0C inside
       that envelope.  Falls back to pure B1-B10 on zone-telemetry loss.
       NOTE on chart math (2026-05-08): all 5 strategies share the same
       band-derived OA damper schedule so the visible gap is purely
       setpoint-reset quality (operators never run 100% OA in practice). */
    msBandDynBtn.title = 'Two-layer hybrid (band damper applied):\n  Layer 1 (every 5 min): B1-B10 picks band from OA T/RH \u2192 sets SA envelope\n  Layer 2 (every 1 min): Dyn-Reset trims SA \u00b12\u00b0C inside the envelope from zone demand\nFailsafe: zone-telemetry loss \u2192 falls back to pure B1-B10.\nINCLUDES latent (humidity) control via the band SA target.';
    msBandBtn.title    = 'Climate-driven only (band damper applied): classifies (OA T, OA RH) into B1\u2013B10 every 5 min, applies that band\u2019s SA target. No zone feedback.\nINCLUDES latent (humidity) control via the band SA target.';
    msDynBtn.title     = '\u26A0 NOT recommended for deployment.\nZone-driven only (Trim & Respond, band damper applied): SA tracks 24-h trailing mean of OA enthalpy. Aggregate model of "raise SA when zones are cold, lower when hot". No band SA logic but uses band damper schedule for fair comparison.\nLACKS latent (humidity) control \u2014 may hit the kJ/kg target while violating zone RH / comfort.';
    msFixedBtn.title   = '\u26A0 NOT recommended for deployment.\nFixed setpoint with band-derived OA damper schedule: SA held at the slider-set (T, RH) all year. Same OA modulation as the others, only the SA reset strategy differs.\nLACKS latent (humidity) control \u2014 will overcool/undercool zones in shoulder seasons and humid summer days.';
    msOptBtn.title     = 'Optimal SA (theoretical floor, band damper applied): SA tracks the comfort envelope clamp(h_oa, optMin, optMax). Same OA damper schedule as the others. Practically unrealizable (requires perfect foresight + perfectly modulating coils) but the lowest-possible energy curve any setpoint-reset strategy could achieve.';
    _refreshMsBtn(msFixedBtn,   _msShowFixed);
    _refreshMsBtn(msDynBtn,     _msShowDyn);
    _refreshMsBtn(msBandBtn,    _msShowBand);
    _refreshMsBtn(msBandDynBtn, _msShowBandDyn);
    _refreshMsBtn(msOptBtn,     _msShowOpt);
    msFixedBtn.onclick  = function(){ _msShowFixed   = !_msShowFixed;   _refreshMsBtn(msFixedBtn,   _msShowFixed);   render2DChart(); };
    msDynBtn.onclick    = function(){ _msShowDyn     = !_msShowDyn;     _refreshMsBtn(msDynBtn,     _msShowDyn);     render2DChart(); };
    msBandBtn.onclick   = function(){ _msShowBand    = !_msShowBand;    _refreshMsBtn(msBandBtn,    _msShowBand);    render2DChart(); };
    msBandDynBtn.onclick= function(){ _msShowBandDyn = !_msShowBandDyn; _refreshMsBtn(msBandDynBtn, _msShowBandDyn); render2DChart(); };
    msOptBtn.onclick    = function(){ _msShowOpt     = !_msShowOpt;     _refreshMsBtn(msOptBtn,     _msShowOpt);
                                       _refreshOptCfg();                render2DChart(); };

    /* OA-intake visualisation toggle.  Controls the OA-damper line on
       each panel + the monthly damper strip below the X axis + the
       header annotation ("Avg OA: 35%").  Defaults ON because the
       operator explicitly asked the chart to show OA intake.  Sits
       just past the Opt-SA toggle (left:595 ends ~720 → start at 730). */
    var msOaBtn = $('#p3-btn-ms-oa');
    if (!msOaBtn) {
      msOaBtn = document.createElement('button');
      msOaBtn.id = 'p3-btn-ms-oa';
      msOaBtn.type = 'button';
      msOaBtn.textContent = '+ OA Intake';
      $('#p3-overlay2d').appendChild(msOaBtn);
    }
    _styleMsToggle(msOaBtn, '#fbbf24', 730, 'OA Intake');
    msOaBtn.title = 'Show OA-damper utilisation:\n  • Header annotation: site-wide annual mean damper %\n  • Translucent yellow line: per-month OA-damper % (right axis remapped 0–100%)\n  • Strip below X axis: 12 monthly cells, opacity scales with damper %';
    _refreshMsBtn(msOaBtn, _msShowOA);
    msOaBtn.onclick = function(){ _msShowOA = !_msShowOA; _refreshMsBtn(msOaBtn, _msShowOA); render2DChart(); };

    /* Opt-SA enthalpy-bound sliders.  Two range inputs sitting just
       under the Opt-SA toggle button so the user can dial the
       theoretical comfort envelope live and watch the Opt-SA curve
       float up/down accordingly.  Hidden until the Opt-SA toggle is
       on (otherwise they'd just be dead chrome). */
    var optCfg = $('#p3-ms-optcfg');
    if (!optCfg) {
      optCfg = document.createElement('div');
      optCfg.id = 'p3-ms-optcfg';
      optCfg.style.cssText = 'position:absolute;top:42px;left:595px;z-index:51;'+
        'background:rgba(15,23,42,.92);border:1px solid #c084fc;border-radius:6px;'+
        'padding:6px 10px;font-size:9px;color:#e2e8f0;font-family:inherit;'+
        'backdrop-filter:blur(14px);display:none;min-width:170px;'+
        'box-shadow:0 6px 18px rgba(0,0,0,.45)';
      optCfg.innerHTML =
        '<div style="font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:#c084fc;margin-bottom:6px">Opt-SA envelope (kJ/kg)</div>'+
        '<label style="display:flex;align-items:center;gap:6px;margin-bottom:4px">'+
          '<span style="width:28px;color:#c084fc;font-weight:700">min</span>'+
          '<input id="p3-opt-min" type="range" min="10" max="50" step="0.5" value="'+_optMinH+'" style="flex:1;accent-color:#c084fc">'+
          '<span id="p3-opt-min-v" style="width:32px;text-align:right;font-variant-numeric:tabular-nums">'+_optMinH.toFixed(1)+'</span>'+
        '</label>'+
        '<label style="display:flex;align-items:center;gap:6px">'+
          '<span style="width:28px;color:#c084fc;font-weight:700">max</span>'+
          '<input id="p3-opt-max" type="range" min="20" max="80" step="0.5" value="'+_optMaxH+'" style="flex:1;accent-color:#c084fc">'+
          '<span id="p3-opt-max-v" style="width:32px;text-align:right;font-variant-numeric:tabular-nums">'+_optMaxH.toFixed(1)+'</span>'+
        '</label>';
      $('#p3-overlay2d').appendChild(optCfg);
      var minInp = optCfg.querySelector('#p3-opt-min');
      var maxInp = optCfg.querySelector('#p3-opt-max');
      var minV   = optCfg.querySelector('#p3-opt-min-v');
      var maxV   = optCfg.querySelector('#p3-opt-max-v');
      minInp.addEventListener('input', function(){
        _optMinH = parseFloat(this.value);
        if (_optMinH > _optMaxH - 1) { _optMinH = _optMaxH - 1; this.value = _optMinH; }
        minV.textContent = _optMinH.toFixed(1);
        render2DChart();
      });
      maxInp.addEventListener('input', function(){
        _optMaxH = parseFloat(this.value);
        if (_optMaxH < _optMinH + 1) { _optMaxH = _optMinH + 1; this.value = _optMaxH; }
        maxV.textContent = _optMaxH.toFixed(1);
        render2DChart();
      });
    }
    function _refreshOptCfg(){
      optCfg.style.display = _msShowOpt ? 'block' : 'none';
    }
    _refreshOptCfg();

    /* Sites dropdown (replaces the in-canvas chip ribbon).  Opens a
       checkbox menu listing every loaded site so users can scope the
       Monthly × Sites comparison without the chips occupying chart real
       estate.  Hidden outside Monthly × Sites mode.  Position: just past
       the "B1-B10 + Dyn-Reset" toggle (left:280, ends ≈470) → start at
       left:485 so the dropdown stays inside chartAreaL=480..vw-940. */
    var sitesDdBtn = document.createElement('button');
    sitesDdBtn.id = 'p3-btn-sites-dd';
    sitesDdBtn.type = 'button';
    sitesDdBtn.style.cssText = 'position:absolute;top:12px;left:485px;z-index:51;background:rgba(15,23,42,.92);border:1px solid #60a5fa;color:#60a5fa;padding:6px 14px;border-radius:6px;font-size:10px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;font-family:inherit;backdrop-filter:blur(14px);display:none;min-width:150px;text-align:left';
    sitesDdBtn.textContent = 'Sites \u25BE';
    $('#p3-overlay2d').appendChild(sitesDdBtn);

    var sitesDdPanel = document.createElement('div');
    sitesDdPanel.id = 'p3-sites-dd-panel';
    sitesDdPanel.style.cssText = 'position:absolute;top:42px;left:485px;z-index:60;background:rgba(15,23,42,.96);border:1px solid #60a5fa;border-radius:6px;padding:0;font-size:10px;color:#e2e8f0;font-family:inherit;backdrop-filter:blur(14px);display:none;min-width:260px;max-height:360px;overflow-y:auto;box-shadow:0 10px 28px rgba(0,0,0,.55)';
    $('#p3-overlay2d').appendChild(sitesDdPanel);

    function _refreshSitesDropdown(){
      var siteOrder = (_monthlySiteOrder && _monthlySiteOrder.length) ? _monthlySiteOrder : Object.keys(_monthlyCache);
      var loaded = siteOrder.filter(function(k){return _monthlyCache[k];});
      var sel = _monthlySelected || {};
      var nSel = loaded.filter(function(k){return !!sel[k];}).length;
      sitesDdBtn.textContent = 'Sites: ' + nSel + '/' + loaded.length + ' \u25BE';
      var html = '';
      if(loaded.length === 0){
        html = '<div style="padding:10px 14px;color:#94a3b8">' + (_monthlyFetching?'Loading sites\u2026':'No sites loaded yet.') + '</div>';
      } else {
        html += '<div style="display:flex;gap:6px;padding:6px 8px;border-bottom:1px solid #334155;background:rgba(2,6,23,.4);position:sticky;top:0">'+
          '<button data-action="all" style="flex:1;background:rgba(16,185,129,.15);border:1px solid #10b981;color:#10b981;padding:4px 6px;border-radius:4px;font-size:9px;font-weight:900;letter-spacing:.05em;cursor:pointer;font-family:inherit;text-transform:uppercase">All</button>'+
          '<button data-action="none" style="flex:1;background:rgba(15,23,42,.6);border:1px solid #475569;color:#94a3b8;padding:4px 6px;border-radius:4px;font-size:9px;font-weight:900;letter-spacing:.05em;cursor:pointer;font-family:inherit;text-transform:uppercase">None</button>'+
          '</div>';
        loaded.forEach(function(k){
          var d=_monthlyCache[k]; if(!d || !d.site) return;
          var on = !!sel[k];
          var nameEsc = (d.site.name||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
          var src = d.site.source==='saved'
            ? '<span style="color:#10b981;font-size:8px;margin-left:6px;font-weight:900;letter-spacing:.05em">SAVED</span>'
            : '<span style="color:#64748b;font-size:8px;margin-left:6px;font-weight:700;letter-spacing:.05em">PRESET</span>';
          var err = d.error ? '<span style="color:#f87171;font-size:8px;margin-left:6px">ERR</span>' : '';
          html += '<label data-code="'+k+'" style="display:flex;align-items:center;padding:6px 12px;cursor:pointer;border-bottom:1px solid rgba(51,65,85,.4);' + (on?'background:rgba(16,185,129,.10)':'') + '">'+
            '<input type="checkbox" '+(on?'checked':'')+' style="margin-right:8px;accent-color:#10b981;cursor:pointer;width:13px;height:13px">'+
            '<span style="flex:1;color:'+(on?'#e2e8f0':'#cbd5e1')+'"><b>'+k+'</b> <span style="color:#94a3b8">\u2014 '+nameEsc+'</span></span>'+
            src + err +
          '</label>';
        });
      }
      sitesDdPanel.innerHTML = html;
      Array.prototype.forEach.call(sitesDdPanel.querySelectorAll('label[data-code]'), function(lbl){
        lbl.addEventListener('click', function(e){
          var cb = lbl.querySelector('input[type=checkbox]');
          // Click on the input itself: browser already toggled cb.checked to NEW state.
          // Click anywhere else inside <label>: browser will toggle on the label's default action.
          // Defer to next tick so cb.checked reflects the post-click state regardless.
          setTimeout(function(){
            if(!_monthlySelected) _monthlySelected = {};
            _monthlySelected[lbl.dataset.code] = !!cb.checked;
            render2DChart();
            _refreshSitesDropdown();
          }, 0);
        });
      });
      Array.prototype.forEach.call(sitesDdPanel.querySelectorAll('button[data-action]'), function(btn){
        btn.onclick = function(e){
          e.stopPropagation();
          if(!_monthlySelected) _monthlySelected = {};
          var act = btn.dataset.action;
          loaded.forEach(function(kk){ _monthlySelected[kk] = (act==='all'); });
          render2DChart();
          _refreshSitesDropdown();
        };
      });
    }

    sitesDdBtn.onclick = function(e){
      e.stopPropagation();
      var open = sitesDdPanel.style.display === 'block';
      if (open) { sitesDdPanel.style.display = 'none'; return; }
      _refreshSitesDropdown();
      sitesDdPanel.style.display = 'block';
    };
    // Close on outside click.
    var _ddOutsideHandler = function(e){
      if (_disposed || !sitesDdPanel || sitesDdPanel.style.display !== 'block') return;
      if (sitesDdPanel.contains(e.target) || sitesDdBtn.contains(e.target)) return;
      sitesDdPanel.style.display = 'none';
    };
    document.addEventListener('click', _ddOutsideHandler);
    _cleanupTasks.push(function(){ document.removeEventListener('click', _ddOutsideHandler); });
    // Expose for the renderer to refresh the trigger label live (e.g. when
    // late-arriving Open-Meteo fetches expand the loaded site list).
    _refreshSitesDD = _refreshSitesDropdown;

    /* 2D hover tooltip */
    (function(){
      var overlay=$('#p3-overlay2d');
      var tip2d=$('#p3-tip2d');
      var lastIdx=-1;
      overlay.addEventListener('mousemove',function(e){
        if(weatherData.length===0){tip2d.style.display='none';return;}
        var rect=overlay.getBoundingClientRect();
        var mx=e.clientX-rect.left,my=e.clientY-rect.top;
        var vw=rect.width,vh=rect.height;

        // ---- T×Time mode: index → band-aware tooltip ----
        // (X-Y Detail / W×Time fall through to the original psychrometric
        //  logic below.)  Gated on the Show B1-B10 Strategy toggle since
        //  the tooltip is fundamentally a B1-B10 narrative — it shows the
        //  active band, that band's SA setpoint, damper %, and per-curve
        //  cumulative readings.  When strategy is off, T×Time hover stays
        //  silent.
        if(chart2DMode==='tt' && _p3ShowBandStrategy && _ttCache){
          var c=_ttCache;
          if(mx<c.pad.left||mx>c.pad.left+c.pw||my<c.pad.top||my>c.pad.top+c.ph){
            tip2d.style.display='none';lastIdx=-1;return;
          }
          var idx=Math.round((mx-c.pad.left)/c.pw*(c.n-1));
          if(idx<0)idx=0; if(idx>=c.n)idx=c.n-1;
          // Proximity gate: only show the tooltip when the cursor is near
          // the green B1-B10 cumulative curve at this x-position.  Anywhere
          // else in the plot area → no tooltip.  Threshold is generous so
          // grabbing a B# tick marker still lands on the curve even at
          // dense year-long data scales.
          var curveYpx = c.pad.top + c.ph - (c.cumB[idx]/c.yMax)*c.ph;
          var dy = Math.abs(my - curveYpx);
          if(dy > 14){
            tip2d.style.display='none';lastIdx=-1;return;
          }
          if(idx===lastIdx)return; lastIdx=idx;
          var p=weatherData[idx];
          var d=new Date(p.ts||p.time);
          var mNames=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          var dateStr=mNames[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear();
          var timeStr=d.getHours().toString().padStart(2,'0')+':'+d.getMinutes().toString().padStart(2,'0');
          var bId=c.bandSeq[idx];
          // Look up band record so we can show its SA setpoint + OA-damper %.
          var bRec=null;
          for(var bi=0;bi<c.BANDS.length;bi++){if(c.BANDS[bi].id===bId){bRec=c.BANDS[bi];break;}}
          // Was this point a band transition?
          var transition = (idx>0 && c.bandSeq[idx]!==c.bandSeq[idx-1]);
          // Per-curve cumulative values at this index (formatted compactly).
          function fmt(v){return v>=1000?(v/1000).toFixed(1)+'k':Math.round(v);}

          var html='<div style="color:#60a5fa;font-weight:900;margin-bottom:2px">'+dateStr+' '+timeStr+'</div>'+
            '<div style="color:#94a3b8;font-size:8px;margin-bottom:4px">OA condition</div>'+
            '<div><span style="color:#f59e0b">T</span> <b style="color:#e2e8f0">'+p.t.toFixed(1)+' \u00b0C</b>'+
            '  <span style="color:#22d3ee">RH</span> <b style="color:#e2e8f0">'+(p.rh!=null?p.rh.toFixed(0):'?')+' %</b>'+
            '  <span style="color:#a78bfa">W</span> <b style="color:#e2e8f0">'+(p.w*1000).toFixed(1)+' g/kg</b></div>';
          if(bRec){
            html += '<div style="border-top:1px solid #334155;margin-top:5px;padding-top:4px">'+
              '<span style="color:#10b981;font-weight:900">'+bId+'</span>'+
              (transition?'  <span style="color:#f472b6;font-size:8px;font-weight:900">\u2190 SWITCH</span>':'')+
              '</div>'+
              '<div style="color:#94a3b8;font-size:8px;margin-top:1px">Band SA setpoint</div>'+
              '<div><b style="color:#34d399">'+bRec.sa_t.toFixed(1)+' \u00b0C / '+bRec.sa_rh+' %</b>'+
              '   <span style="color:#94a3b8">damper</span> <b style="color:#fbbf24">'+bRec.oa_damper+'%</b></div>';
          }
          html += '<div style="border-top:1px solid #334155;margin-top:5px;padding-top:4px;color:#94a3b8;font-size:8px">Cumulative \u0394h to date</div>'+
            '<div style="font-size:8px"><span style="color:#ef4444">H</span> '+fmt(c.cumHeat[idx])+
            '  <span style="color:#3b82f6">C</span> '+fmt(c.cumCool[idx])+
            '  <span style="color:#a855f7">T</span> '+fmt(c.cumTotal[idx])+
            '  <span style="color:#10b981">B</span> '+fmt(c.cumB[idx])+'</div>';

          tip2d.innerHTML=html;
          // Position past the cursor; flip to the left if too close to right edge.
          var offX = (mx+220>vw)?-230:14;
          var offY = (my-110<0)?14:-110;
          tip2d.style.left=(mx+offX)+'px';
          tip2d.style.top=(my+offY)+'px';
          tip2d.style.display='block';
          return;
        }
        // T×Time without B1-B10 Strategy → no hover tooltip (the rest of the
        // handler is a psychrometric-grid lookup for X-Y Detail and W×Time
        // and would produce wrong results here).
        if(chart2DMode==='tt'){
          tip2d.style.display='none';lastIdx=-1;return;
        }
        if(chart2DMode==='wt'){
          tip2d.style.display='none';lastIdx=-1;return;
        }
        if(chart2DMode==='monthly-sites'){
          tip2d.style.display='none';lastIdx=-1;return;
        }

        // ---- X-Y Detail (psychrometric) hover — original logic ----
        var pad={left:65,right:55,top:40,bottom:50};
        var pw=vw-pad.left-pad.right,ph=vh-pad.top-pad.bottom;
        var mT=T_MIN+(mx-pad.left)/pw*(T_MAX-T_MIN);
        var mW=W_MAX-(my-pad.top)/ph*W_MAX;
        if(mx<pad.left||mx>pad.left+pw||my<pad.top||my>pad.top+ph){tip2d.style.display='none';lastIdx=-1;return;}
        var best=-1,bestD=Infinity;
        for(var i=0;i<weatherData.length;i++){
          var p=weatherData[i],wg=p.w*1000;
          var dt=(p.t-mT)/(T_MAX-T_MIN),dw=(wg-mW)/W_MAX;
          var d2=dt*dt+dw*dw;
          if(d2<bestD){bestD=d2;best=i;}
        }
        if(best<0||bestD>0.001){tip2d.style.display='none';lastIdx=-1;return;}
        if(best===lastIdx)return;lastIdx=best;
        var p=weatherData[best];
        var d=new Date(p.ts);
        var mNames=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        var dateStr=days[d.getDay()]+', '+mNames[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear();
        var timeStr=d.getHours().toString().padStart(2,'0')+':'+d.getMinutes().toString().padStart(2,'0');
        tip2d.innerHTML='<div style="color:#60a5fa;font-weight:900;margin-bottom:2px">'+dateStr+'</div>'+
          '<div style="color:#94a3b8">'+timeStr+'</div>'+
          '<div style="margin-top:3px"><span style="color:#f59e0b">T</span> <span style="color:#e2e8f0;font-weight:700">'+p.t.toFixed(1)+' \u00b0C</span></div>'+
          '<div><span style="color:#22d3ee">RH</span> <span style="color:#e2e8f0;font-weight:700">'+p.rh.toFixed(0)+' %</span></div>'+
          '<div><span style="color:#a78bfa">W</span> <span style="color:#e2e8f0;font-weight:700">'+(p.w*1000).toFixed(1)+' g/kg</span></div>';
        var px=pad.left+(p.t-T_MIN)/(T_MAX-T_MIN)*pw;
        var py=pad.top+ph-(p.w*1000/W_MAX)*ph;
        var offX=px+140>vw?-140:12,offY=py-80<0?12:-80;
        tip2d.style.left=(px+offX)+'px';tip2d.style.top=(py+offY)+'px';
        tip2d.style.display='block';
      });
      overlay.addEventListener('mouseleave',function(){tip2d.style.display='none';lastIdx=-1;});

      /* Click handler for Monthly \u00d7 Sites mode \u2014 clicks on an error panel
         retry that single site's fetch without re-fetching the others.
         Clicks on a site chip in the top ribbon toggle that site in/out
         of the comparison panels. */
      overlay.addEventListener('click', function(e){
        if(chart2DMode!=='monthly-sites') return;
        var rect=overlay.getBoundingClientRect();
        var mx=e.clientX-rect.left, my=e.clientY-rect.top;
        // Convert to canvas coords
        var cv=$('#p3-cv2d');
        var sx=cv.width/rect.width, sy=cv.height/rect.height;
        var cx=mx*sx, cy=my*sy;
        // (Site selection is now an HTML dropdown — see #p3-btn-sites-dd /
        //  #p3-sites-dd-panel.  Canvas chip hit-testing was removed.)
        for(var code in _monthlyPanelRects){
          var r=_monthlyPanelRects[code];
          var d=_monthlyCache[code];
          if(!d || !d.error) continue;
          if(cx>=r.x && cx<=r.x+r.w && cy>=r.y && cy<=r.y+r.h){
            // Retry this one site: mark it as "fetching" again, re-request.
            var site=d.site;
            delete _monthlyCache[code];
            render2DChart();
            var y=new Date().getFullYear()-1;
            var fromD=y+'-01-01', toD=y+'-12-31';
            fetch('https://archive-api.open-meteo.com/v1/archive?latitude='+site.lat+'&longitude='+site.lon+
              '&start_date='+fromD+'&end_date='+toD+
              '&hourly=temperature_2m,relative_humidity_2m&timezone=auto')
              .then(function(r){if(!r.ok) throw new Error('HTTP '+r.status); return r.json();})
              .then(function(j){
                if(!j || !j.hourly || !j.hourly.time || !j.hourly.time.length) throw new Error('empty payload');
                var t=j.hourly.temperature_2m, rh=j.hourly.relative_humidity_2m, tm=j.hourly.time;
                _monthlyCache[code]={site:site, raw:{t:t, rh:rh, tm:tm}};
                render2DChart();
              })
              .catch(function(e){
                _monthlyCache[code]={site:site, band:null, base:null,
                                      error:((e && e.message)||'fetch failed')};
                render2DChart();
              });
            return;
          }
        }
      });
    })();

    /* hover tooltip */
    var rc=new THREE.Raycaster();rc.params.Points.threshold=3;
    var mv=new THREE.Vector2();var tipEl=$('#p3-tip');
    ren.domElement.addEventListener('mousemove',function(e){
      if(!weatherData.length){tipEl.style.display='none';return;}
      var rect=ren.domElement.getBoundingClientRect();
      mv.x=((e.clientX-rect.left)/rect.width)*2-1;mv.y=-((e.clientY-rect.top)/rect.height)*2+1;
      rc.setFromCamera(mv,cam);
      var pts=pathGroup.children[0];
      var vavPts=(vavGroup&&vavGroup.children.length>0&&vavGroup.children[0].isPoints)?vavGroup.children[0]:null;
      var targets=[];
      if(pts&&pts.isPoints)targets.push(pts);
      if(vavPts)targets.push(vavPts);
      if(!targets.length){tipEl.style.display='none';return;}
      var hits=rc.intersectObjects(targets);
      if(hits.length>0&&hits[0].index!==undefined){
        var hitObj=hits[0].object,idx=hits[0].index,html='';
        if(hitObj===vavPts&&idx<vavData.length){
          var vi=vavData[idx],p=weatherData[vi.idx],d=new Date(p.ts);
          var sLbl=vi.status==='left'?'COLD (Left of CZ)':vi.status==='in'?'IN COMFORT ZONE':'HOT (Right of CZ)';
          var sCol=vi.status==='left'?'#3b82f6':vi.status==='in'?'#10b981':'#ef4444';
          html='<div style="color:'+sCol+';font-weight:900;margin-bottom:2px">'+sLbl+'</div><div style="color:#f472b6;margin-bottom:1px"><b>'+d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})+' '+d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:false})+'</b></div><div>T = <b style="color:#60a5fa">'+p.t.toFixed(1)+' \u00b0C</b></div><div>RH = <b style="color:#34d399">'+p.rh.toFixed(0)+'%</b></div><div>W = <b style="color:#fbbf24">'+(p.w*1000).toFixed(1)+' g/kg</b></div>';
        }else if(hitObj===pts&&idx<weatherData.length){
          var p=weatherData[idx];var d=new Date(p.ts);
          html='<div style="color:#f472b6;margin-bottom:1px"><b>'+d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})+' '+d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:false})+'</b></div><div>T = <b style="color:#60a5fa">'+p.t.toFixed(1)+' \u00b0C</b></div><div>RH = <b style="color:#34d399">'+p.rh.toFixed(0)+'%</b></div><div>W = <b style="color:#fbbf24">'+(p.w*1000).toFixed(1)+' g/kg</b></div>';
        }
        if(html){tipEl.innerHTML=html;tipEl.style.display='block';tipEl.style.left=(e.clientX-root.getBoundingClientRect().left+14)+'px';tipEl.style.top=(e.clientY-root.getBoundingClientRect().top-16)+'px';}
        else{tipEl.style.display='none';}
      }else{tipEl.style.display='none';}
    });

    /* resize */
    var ro=new ResizeObserver(function(){
      if (_disposed || !ren) return;
      W3=root.clientWidth;H3=root.clientHeight;
      if(W3>0&&H3>0){cam.aspect=W3/H3;cam.updateProjectionMatrix();ren.setSize(W3,H3);}
    });
    ro.observe(root);
    _cleanupTasks.push(function(){ try { ro.disconnect(); } catch(e){} });
  }

  /* ---------- FETCH DATA ---------- */
  function doFetch(){
    var lat=parseFloat($('#p3-lat').value),lon=parseFloat($('#p3-lon').value);
    var locName=$('#p3-name').value||'Location';
    var fromD=$('#p3-from').value,toD=$('#p3-to').value;
    if(isNaN(lat)||isNaN(lon)){$('#p3-status').textContent='Invalid coords';return;}
    if(!fromD||!toD){$('#p3-status').textContent='Set dates';return;}
    var yesterday=new Date();yesterday.setDate(yesterday.getDate()-2);
    var yStr=yesterday.toISOString().slice(0,10);
    if(toD>yStr)toD=yStr;if(fromD>toD){$('#p3-status').textContent='From>To';return;}
    $('#p3-fetch').disabled=true;$('#p3-status').textContent='Fetching...';

    fetch('https://archive-api.open-meteo.com/v1/archive?latitude='+lat+'&longitude='+lon+'&start_date='+fromD+'&end_date='+toD+'&hourly=temperature_2m,relative_humidity_2m&timezone=auto')
    .then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json();})
    .then(function(json){
      if(json.error)throw new Error(json.reason||json.error);
      var times=json.hourly.time,temps=json.hourly.temperature_2m;
      var rhs=json.hourly.relative_humidity_2m||json.hourly.relativehumidity_2m;
      if(!times||!temps||!rhs)throw new Error('Missing data');
      weatherData=[];
      var t0=new Date(times[0]).getTime(),tN=new Date(times[times.length-1]).getTime(),span=tN-t0||1;
      for(var i=0;i<times.length;i++){if(temps[i]===null||rhs[i]===null)continue;weatherData.push({t:temps[i],rh:rhs[i],w:getW(temps[i],rhs[i]),ts:times[i],frac:(new Date(times[i]).getTime()-t0)/span});}
      if(weatherData.length>4000){var step=Math.ceil(weatherData.length/4000);var ds=[];for(var i=0;i<weatherData.length;i+=step)ds.push(weatherData[i]);weatherData=ds;}
      $('#p3-status').textContent=weatherData.length+' pts loaded';
      buildWeatherVis(locName,fromD,toD);
    })
    .catch(function(e){$('#p3-status').textContent='Error: '+e.message;})
    .finally(function(){$('#p3-fetch').disabled=false;});
  }

  /* ---------- BUILD WEATHER VIS ---------- */
  function buildWeatherVis(locName,fromD,toD){
    var THREE=window.THREE;
    while(pathGroup.children.length)pathGroup.remove(pathGroup.children[0]);
    while(projGroup.children.length)projGroup.remove(projGroup.children[0]);
    timeLabels.forEach(function(s){scene.remove(s);});timeLabels=[];
    if(!weatherData.length)return;

    $('#p3-loc').textContent=locName+' ('+fromD+' \u2192 '+toD+')';
    var tMin=Infinity,tMax=-Infinity,rhMin=Infinity,rhMax=-Infinity;
    weatherData.forEach(function(p){if(p.t<tMin)tMin=p.t;if(p.t>tMax)tMax=p.t;if(p.rh<rhMin)rhMin=p.rh;if(p.rh>rhMax)rhMax=p.rh;});
    $('#p3-st-pts').textContent=weatherData.length;
    $('#p3-st-t').textContent=tMin.toFixed(1)+'\u2192'+tMax.toFixed(1)+'\u00b0C';
    $('#p3-st-rh').textContent=rhMin.toFixed(0)+'\u2192'+rhMax.toFixed(0)+'%';
    $('#p3-st-per').textContent=fromD+'\u2192'+toD;
    $('#p3-stats').style.display='block';

    var pV=[],pC=[],prV=[],prC=[];
    weatherData.forEach(function(p){var x=t2sx(p.t),z=w2sz(p.w),y=frac2sy(p.frac);pV.push(x,y,z);var c=t2rgb(p.t);pC.push(c[0],c[1],c[2]);prV.push(x,.2,z);prC.push(c[0]*.5,c[1]*.5,c[2]*.5);});

    var ptGeo=new THREE.BufferGeometry();ptGeo.setAttribute('position',new THREE.Float32BufferAttribute(pV,3));ptGeo.setAttribute('color',new THREE.Float32BufferAttribute(pC,3));
    pathGroup.add(new THREE.Points(ptGeo,new THREE.PointsMaterial({size:2.2,vertexColors:true,transparent:true,opacity:.85,sizeAttenuation:true,depthWrite:false})));
    var lnGeo=new THREE.BufferGeometry();lnGeo.setAttribute('position',new THREE.Float32BufferAttribute(pV,3));lnGeo.setAttribute('color',new THREE.Float32BufferAttribute(pC,3));
    pathGroup.add(new THREE.Line(lnGeo,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.35})));
    var prGeo=new THREE.BufferGeometry();prGeo.setAttribute('position',new THREE.Float32BufferAttribute(prV,3));prGeo.setAttribute('color',new THREE.Float32BufferAttribute(prC,3));
    projGroup.add(new THREE.Points(prGeo,new THREE.PointsMaterial({size:1.5,vertexColors:true,transparent:true,opacity:.4,sizeAttenuation:true,depthWrite:false})));

    /* time labels */
    function mkTl(text,col,sz){var c=document.createElement('canvas'),x=c.getContext('2d');c.width=512;c.height=64;x.font='bold 30px monospace';x.fillStyle=col||'#94a3b8';x.textAlign='center';x.textBaseline='middle';x.fillText(text,256,32);var t=new THREE.CanvasTexture(c);var s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false}));s.scale.set(sz||28,(sz||28)*.125,1);return s;}
    var d0=new Date(weatherData[0].ts),dN=new Date(weatherData[weatherData.length-1].ts);
    var spanDays=(dN-d0)/864e5;var seen={};var mNames=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    weatherData.forEach(function(p){
      var d=new Date(p.ts);var key=spanDays>180?d.getFullYear()+'-'+d.getMonth():d.toISOString().slice(0,10);
      if(!seen[key]){seen[key]=true;if(Object.keys(seen).length%(spanDays>180?1:spanDays>28?7:3)!==0)return;
        var lbl=spanDays>180?mNames[d.getMonth()]:(d.getMonth()+1)+'/'+d.getDate();
        var s=mkTl(lbl,'#e2e8f0',16);s.position.set(-12,frac2sy(p.frac),-6);scene.add(s);timeLabels.push(s);}
    });
    buildDeltaH();
    buildVAVScatter();
    /* Auto-refresh 2D overlay if it's currently visible */
    if($('#p3-overlay2d').style.display!=='none'){render2DChart();}
  }

  /* ---------- DELTA-H VISUALIZATION (vertical wall at Z=0) ---------- */
  function buildDeltaH(){
    var THREE=window.THREE;
    while(dhFloorGroup.children.length)dhFloorGroup.remove(dhFloorGroup.children[0]);
    if(weatherData.length<2)return;

    var T_sa=parseFloat($('#p3-sa-t').value)||13;
    var RH_sa=parseFloat($('#p3-sa-rh').value)||95;
    var occ=parseInt($('#p3-occ').value)||20;
    var W_sa=getW(T_sa,RH_sa);
    var T_sa_eff=T_sa-occ*0.08;
    var W_sa_eff=W_sa+occ*0.00002;
    var h_sa=enthalpy(T_sa_eff,W_sa_eff);

    var dhArr=[];var dhMin=Infinity,dhMax=-Infinity;
    weatherData.forEach(function(p){
      var dh=enthalpy(p.t,p.w)-h_sa;dhArr.push(dh);
      if(dh<dhMin)dhMin=dh;if(dh>dhMax)dhMax=dh;
    });
    var dhScale=Math.max(Math.abs(dhMin),Math.abs(dhMax),1);

    // Color polarity follows the HVAC control convention:
    //   +ΔH (OA hotter/wetter than SA setpoint) → needs COOLING → BLUE
    //   −ΔH (OA colder/drier than SA setpoint)  → needs HEATING → RED
    function dh2rgb(dh){var n=dh/dhScale;if(n>0)return[.1*(1-n),.3*(1-n),.3+n*.7];else{var a=-n;return[.3+a*.7,.3*(1-a),.1*(1-a)];}}
    /* ΔH → Y mapping: center (zero) at SY/2, positive goes up, negative goes down */
    function dh2y(dh){return SY/2+dh/dhScale*(SY/2*.85);}

    function mkTl(text,col,sz){var c=document.createElement('canvas'),x=c.getContext('2d');c.width=512;c.height=64;x.font='bold 30px monospace';x.fillStyle=col||'#94a3b8';x.textAlign='center';x.textBaseline='middle';x.fillText(text,256,32);var t=new THREE.CanvasTexture(c);var s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false}));s.scale.set(sz||28,(sz||28)*.125,1);return s;}

    var wallZ=0;/* back wall */

    /* colored line: X=time, Y=ΔH, Z=0 */
    var fV=[],fC=[];
    weatherData.forEach(function(p,i){var x=p.frac*SX,y=dh2y(dhArr[i]);fV.push(x,y,wallZ);var c=dh2rgb(dhArr[i]);fC.push(c[0],c[1],c[2]);});
    var flGeo=new THREE.BufferGeometry();flGeo.setAttribute('position',new THREE.Float32BufferAttribute(fV,3));flGeo.setAttribute('color',new THREE.Float32BufferAttribute(fC,3));
    dhFloorGroup.add(new THREE.Line(flGeo,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.8,linewidth:2})));
    /* data points */
    var fpGeo=new THREE.BufferGeometry();fpGeo.setAttribute('position',new THREE.Float32BufferAttribute(fV,3));fpGeo.setAttribute('color',new THREE.Float32BufferAttribute(fC,3));
    dhFloorGroup.add(new THREE.Points(fpGeo,new THREE.PointsMaterial({size:1.8,vertexColors:true,transparent:true,opacity:.6,sizeAttenuation:true})));

    /* zero reference line */
    var zeroY=dh2y(0);
    dhFloorGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,zeroY,wallZ),new THREE.Vector3(SX,zeroY,wallZ)]),new THREE.LineBasicMaterial({color:0x10b981,transparent:true,opacity:.5})));

    /* filled area between ΔH curve and zero line */
    var fillVerts=[],fillCols=[];
    for(var i=0;i<weatherData.length-1;i++){
      var x0=weatherData[i].frac*SX,x1=weatherData[i+1].frac*SX;
      var y0=dh2y(dhArr[i]),y1=dh2y(dhArr[i+1]);
      var c0=dh2rgb(dhArr[i]),c1=dh2rgb(dhArr[i+1]);
      fillVerts.push(x0,zeroY,wallZ, x0,y0,wallZ, x1,y1,wallZ);
      fillVerts.push(x0,zeroY,wallZ, x1,y1,wallZ, x1,zeroY,wallZ);
      fillCols.push(c0[0],c0[1],c0[2], c0[0],c0[1],c0[2], c1[0],c1[1],c1[2]);
      fillCols.push(c0[0],c0[1],c0[2], c1[0],c1[1],c1[2], c1[0],c1[1],c1[2]);
    }
    var fillGeo=new THREE.BufferGeometry();fillGeo.setAttribute('position',new THREE.Float32BufferAttribute(fillVerts,3));fillGeo.setAttribute('color',new THREE.Float32BufferAttribute(fillCols,3));
    dhFloorGroup.add(new THREE.Mesh(fillGeo,new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.15,side:THREE.DoubleSide,depthWrite:false})));

    /* border frame */
    dhFloorGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0,0,wallZ),new THREE.Vector3(SX,0,wallZ),new THREE.Vector3(SX,SY,wallZ),new THREE.Vector3(0,SY,wallZ),new THREE.Vector3(0,0,wallZ)
    ]),new THREE.LineBasicMaterial({color:0x334155,transparent:true,opacity:.3})));

    /* labels (color matches the control convention: cooling=blue, heating=red) */
    var lCool=mkTl('COOLING (+\u0394H)','#3b82f6',14);lCool.position.set(-18,dh2y(dhScale*.6),wallZ);dhFloorGroup.add(lCool);
    var lHeat=mkTl('HEATING (-\u0394H)','#ef4444',14);lHeat.position.set(-18,dh2y(-dhScale*.6),wallZ);dhFloorGroup.add(lHeat);
    var lZero=mkTl('0 kJ/kg','#10b981',10);lZero.position.set(-18,zeroY,wallZ);dhFloorGroup.add(lZero);
    var lTime=mkTl('TIME \u2192','#94a3b8',12);lTime.position.set(SX/2,-10,wallZ);dhFloorGroup.add(lTime);
    /* SA reference label */
    var lSA=mkTl('SA: '+T_sa.toFixed(0)+'\u00b0C / '+RH_sa.toFixed(0)+'% / '+occ+' occ','#f59e0b',12);lSA.position.set(SX/2,SY+8,wallZ);dhFloorGroup.add(lSA);
    /* scale markers */
    [-60,-40,-20,0,20,40,60].forEach(function(v){
      if(Math.abs(v)>dhScale*1.1)return;var y=dh2y(v);
      dhFloorGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-4,y,wallZ),new THREE.Vector3(4,y,wallZ)]),new THREE.LineBasicMaterial({color:0x64748b,transparent:true,opacity:.3})));
      var lb=mkTl(v+'','#64748b',8);lb.position.set(-10,y,wallZ);dhFloorGroup.add(lb);
    });

    /* ---- CUMULATIVE HEATING vs COOLING CURVES ---- */
    var cumHeat=[],cumCool=[],cH=0,cC=0;
    dhArr.forEach(function(dh){
      if(dh>0)cC+=dh; else cH+=Math.abs(dh);
      cumHeat.push(cH);cumCool.push(cC);
    });

    /* ---- CURVE 3: cumulative TOTAL energy demand if controlling literally to (T_sa, RH_sa). ---- */
    /* Sum of heating + cooling magnitudes — what the system would need to do
       at every step if no smart band logic is applied. */
    var cumTotal=[]; for(var i=0;i<cumHeat.length;i++) cumTotal.push(cumHeat[i]+cumCool[i]);
    var cT=cumTotal.length?cumTotal[cumTotal.length-1]:0;

    // NOTE: B1-B10 cumulative curve was previously rendered here on the 3D
    // T×Time wall, but it conveyed the wrong story — the green line stayed
    // the same height as the user moved the SA slider (since each band uses
    // its own SA target from the BANDS table) which made it look like the
    // strategy was "ignoring" their input.  The B1-B10 narrative now lives
    // exclusively on the 2D T×Time chart (Show B1-B10 Strategy button), with
    // the SA slider greyed out so the role separation is unambiguous.

    var cumMax=Math.max(cH,cC,cT,1);
    function cum2y(c){return c/cumMax*SY*0.9+SY*0.03;}

    /* Heating cumulative — RED (matches control convention) */
    var hV=[];weatherData.forEach(function(p,i){hV.push(p.frac*SX,cum2y(cumHeat[i]),wallZ-0.5);});
    var hGeo=new THREE.BufferGeometry();hGeo.setAttribute('position',new THREE.Float32BufferAttribute(hV,3));
    dhFloorGroup.add(new THREE.Line(hGeo,new THREE.LineBasicMaterial({color:0xef4444,transparent:true,opacity:.8})));

    /* Cooling cumulative — BLUE (matches control convention) */
    var cV=[];weatherData.forEach(function(p,i){cV.push(p.frac*SX,cum2y(cumCool[i]),wallZ-0.5);});
    var cGeo=new THREE.BufferGeometry();cGeo.setAttribute('position',new THREE.Float32BufferAttribute(cV,3));
    dhFloorGroup.add(new THREE.Line(cGeo,new THREE.LineBasicMaterial({color:0x3b82f6,transparent:true,opacity:.8})));

    /* Curve 3 — cumulative TOTAL (heat + cool) at (T_sa, RH_sa). PURPLE, dashed. */
    var tV=[];weatherData.forEach(function(p,i){tV.push(p.frac*SX,cum2y(cumTotal[i]),wallZ-0.5);});
    var tGeo=new THREE.BufferGeometry();tGeo.setAttribute('position',new THREE.Float32BufferAttribute(tV,3));
    var tLine=new THREE.Line(tGeo,new THREE.LineDashedMaterial({color:0xa855f7,transparent:true,opacity:.85,dashSize:3,gapSize:2}));
    tLine.computeLineDistances();
    dhFloorGroup.add(tLine);

    /* right-side scale */
    [0,.25,.5,.75,1].forEach(function(f){
      var val=Math.round(cumMax*f);var y=cum2y(val);
      dhFloorGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(SX-4,y,wallZ),new THREE.Vector3(SX+4,y,wallZ)]),new THREE.LineBasicMaterial({color:0x94a3b8,transparent:true,opacity:.2})));
      var lb=mkTl(val>=1000?(val/1000).toFixed(0)+'k':val+'','#94a3b8',7);lb.position.set(SX+14,y,wallZ);dhFloorGroup.add(lb);
    });

    /* endpoint totals — color matches their respective cumulative lines */
    var lHtot=mkTl('Heat: '+(cH>=1000?(cH/1000).toFixed(1)+'k':Math.round(cH))+' kJ/kg','#ef4444',10);lHtot.position.set(SX+14,cum2y(cH),wallZ);dhFloorGroup.add(lHtot);
    var lCtot=mkTl('Cool: '+(cC>=1000?(cC/1000).toFixed(1)+'k':Math.round(cC))+' kJ/kg','#3b82f6',10);lCtot.position.set(SX+14,cum2y(cC),wallZ);dhFloorGroup.add(lCtot);
    var lTtot=mkTl('Total: '+(cT>=1000?(cT/1000).toFixed(1)+'k':Math.round(cT))+' kJ/kg','#a855f7',10);lTtot.position.set(SX+14,cum2y(cT),wallZ);dhFloorGroup.add(lTtot);
  }

  /* ---------- VAV CZ SCATTER (left wall at X=0, SA-referenced) ---------- */
  function buildVAVScatter(){
    var THREE=window.THREE;
    while(vavGroup.children.length)vavGroup.remove(vavGroup.children[0]);
    vavData=[];
    if(weatherData.length<2)return;

    function mkTl(text,col,sz){var c=document.createElement('canvas'),x=c.getContext('2d');c.width=512;c.height=64;x.font='bold 30px monospace';x.fillStyle=col||'#94a3b8';x.textAlign='center';x.textBaseline='middle';x.fillText(text,256,32);var t=new THREE.CanvasTexture(c);var s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false}));s.scale.set(sz||28,(sz||28)*.125,1);return s;}

    var wallX=0;

    /* SA reference — same logic as buildDeltaH */
    var T_sa=parseFloat($('#p3-sa-t').value)||13;
    var RH_sa=parseFloat($('#p3-sa-rh').value)||95;
    var occ=parseInt($('#p3-occ').value)||20;
    var W_sa=getW(T_sa,RH_sa);
    var T_sa_eff=T_sa-occ*0.08;
    var W_sa_eff=W_sa+occ*0.00002;
    var h_sa=enthalpy(T_sa_eff,W_sa_eff);

    var COMFORT_DH=5;/* kJ/kg half-band for "in CZ" */

    /* compute dH per point and find range */
    var dhArr=[],dhAbsMax=0;
    weatherData.forEach(function(p){
      var dh=enthalpy(p.t,p.w)-h_sa;dhArr.push(dh);
      if(Math.abs(dh)>dhAbsMax)dhAbsMax=Math.abs(dh);
    });
    var span=Math.max(dhAbsMax,COMFORT_DH+1);

    var pV=[],pC=[];
    var nL=0,nC=0,nR=0;

    weatherData.forEach(function(p,i){
      var status,z,r,g,b;
      var dh=dhArr[i];
      var jit=(Math.sin(i*137.508)*0.5+0.5);

      if(Math.abs(dh)<=COMFORT_DH){
        status='in'; nC++;
        z=SZ*0.37+jit*SZ*0.26;
        r=0.063;g=0.725;b=0.506;
      }else if(dh<-COMFORT_DH){
        status='left'; nL++;
        var dist=Math.min((-dh-COMFORT_DH)/(span-COMFORT_DH),1);
        z=SZ*0.70+dist*SZ*0.27+jit*SZ*0.04-SZ*0.02;
        z=Math.max(SZ*0.68,Math.min(SZ*0.98,z));
        // Heating-needed (OA cooler than SA setpoint) → RED per HVAC convention.
        var a=0.4+dist*0.6;
        r=0.3+a*0.7;g=0.15*(1-a);b=0.1*(1-a);
      }else{
        status='right'; nR++;
        var dist2=Math.min((dh-COMFORT_DH)/(span-COMFORT_DH),1);
        z=SZ*0.03+(1-dist2)*SZ*0.27+jit*SZ*0.04-SZ*0.02;
        z=Math.max(SZ*0.02,Math.min(SZ*0.32,z));
        // Cooling-needed (OA hotter than SA setpoint) → BLUE per HVAC convention.
        var a2=0.4+dist2*0.6;
        r=0.15*(1-a2);g=0.3*(1-a2);b=0.3+a2*0.7;
      }

      pV.push(wallX,frac2sy(p.frac),z);
      pC.push(r,g,b);
      vavData.push({idx:i,status:status});
    });

    /* scatter points */
    var ptGeo=new THREE.BufferGeometry();
    ptGeo.setAttribute('position',new THREE.Float32BufferAttribute(pV,3));
    ptGeo.setAttribute('color',new THREE.Float32BufferAttribute(pC,3));
    vavGroup.add(new THREE.Points(ptGeo,new THREE.PointsMaterial({size:2.5,vertexColors:true,transparent:true,opacity:.85,sizeAttenuation:true,depthWrite:false})));

    /* border frame */
    vavGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(wallX,0,0),new THREE.Vector3(wallX,0,SZ),new THREE.Vector3(wallX,SY,SZ),new THREE.Vector3(wallX,SY,0),new THREE.Vector3(wallX,0,0)
    ]),new THREE.LineBasicMaterial({color:0x334155,transparent:true,opacity:.4})));

    /* grid lines */
    for(var gi=0;gi<=8;gi++){var gy=gi/8*SY;vavGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(wallX,gy,0),new THREE.Vector3(wallX,gy,SZ)]),new THREE.LineBasicMaterial({color:0x1e293b,transparent:true,opacity:.25})));}
    /* band separators */
    [SZ*0.335,SZ*0.665].forEach(function(bz){vavGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(wallX,0,bz),new THREE.Vector3(wallX,SY,bz)]),new THREE.LineBasicMaterial({color:0x475569,transparent:true,opacity:.35})));});

    /* CZ comfort band (green translucent) */
    var bV=[wallX,0,SZ*0.335, wallX,0,SZ*0.665, wallX,SY,SZ*0.665, wallX,0,SZ*0.335, wallX,SY,SZ*0.665, wallX,SY,SZ*0.335];
    var bGeo=new THREE.BufferGeometry();bGeo.setAttribute('position',new THREE.Float32BufferAttribute(bV,3));
    vavGroup.add(new THREE.Mesh(bGeo,new THREE.MeshBasicMaterial({color:0x10b981,transparent:true,opacity:.06,side:THREE.DoubleSide,depthWrite:false})));

    /* HEATING-needed band (red translucent) — OA below SA setpoint */
    var bLV=[wallX,0,SZ*0.665, wallX,0,SZ, wallX,SY,SZ, wallX,0,SZ*0.665, wallX,SY,SZ, wallX,SY,SZ*0.665];
    var bLGeo=new THREE.BufferGeometry();bLGeo.setAttribute('position',new THREE.Float32BufferAttribute(bLV,3));
    vavGroup.add(new THREE.Mesh(bLGeo,new THREE.MeshBasicMaterial({color:0xef4444,transparent:true,opacity:.04,side:THREE.DoubleSide,depthWrite:false})));

    /* COOLING-needed band (blue translucent) — OA above SA setpoint */
    var bRV=[wallX,0,0, wallX,0,SZ*0.335, wallX,SY,SZ*0.335, wallX,0,0, wallX,SY,SZ*0.335, wallX,SY,0];
    var bRGeo=new THREE.BufferGeometry();bRGeo.setAttribute('position',new THREE.Float32BufferAttribute(bRV,3));
    vavGroup.add(new THREE.Mesh(bRGeo,new THREE.MeshBasicMaterial({color:0x3b82f6,transparent:true,opacity:.04,side:THREE.DoubleSide,depthWrite:false})));

    /* labels — colors match each band's required action */
    var lTitle=mkTl('VAV CZ STATUS','#a78bfa',14);lTitle.position.set(wallX-2,SY+14,SZ/2);vavGroup.add(lTitle);
    var lL=mkTl('COLD (HEAT)','#ef4444',11);lL.position.set(wallX-2,SY+4,SZ*0.83);vavGroup.add(lL);
    var lIn=mkTl('IN CZ','#10b981',11);lIn.position.set(wallX-2,SY+4,SZ*0.5);vavGroup.add(lIn);
    var lR=mkTl('HOT (COOL)','#3b82f6',11);lR.position.set(wallX-2,SY+4,SZ*0.17);vavGroup.add(lR);

    /* SA reference label */
    var lSA=mkTl('SA: '+T_sa.toFixed(0)+'\u00b0C / '+RH_sa.toFixed(0)+'% / '+occ+' occ','#f59e0b',10);
    lSA.position.set(wallX-2,SY+6,SZ/2);vavGroup.add(lSA);

    /* stats summary */
    var total=weatherData.length;
    var lStats=mkTl(nL+' cold ('+Math.round(nL/total*100)+'%) | '+nC+' comfort ('+Math.round(nC/total*100)+'%) | '+nR+' hot ('+Math.round(nR/total*100)+'%)','#94a3b8',9);
    lStats.position.set(wallX-2,-8,SZ/2);vavGroup.add(lStats);

    /* time axis label */
    var lTime=mkTl('TIME \u2191','#94a3b8',10);lTime.position.set(wallX-8,SY/2,-6);vavGroup.add(lTime);
  }

  /* ---------- 2D FULL-DETAIL PSYCHROMETRIC CHART ---------- */
  /* ---- 2D Time-Series chart renderer (T×Time = 4 cumulative curves, W×Time = scatter) ---- */
  function renderTimeSeries2D(ctx,vw,vh,mode){
    var pad={left:70,right:140,top:50,bottom:55};
    var pw=vw-pad.left-pad.right, ph=vh-pad.top-pad.bottom;
    // Light/dark theme palette synced with the rest of the dashboard via
    // localStorage.red5.theme.
    var isLight = _p3Theme() === 'light';
    var P = isLight ? {
      bg:'#d0d6dd', text:'#1e293b', textDim:'#475569', textMuted:'#64748b',
      grid:'rgba(71,85,105,.22)', frame:'rgba(71,85,105,.55)',
      legendBg:'rgba(255,255,255,.7)',
      coolFillStrong:'rgba(59,130,246,.30)', heatFillStrong:'rgba(239,68,68,.30)',
      coolFillSoft:'rgba(59,130,246,.22)',   heatFillSoft:'rgba(239,68,68,.22)',
      saLine:'#b45309', oaLine:'#b45309',
      cool:'#2563eb', heat:'#dc2626', total:'#7c3aed', band:'#059669',
      optSa:'#a855f7', dynRst:'#a855f7',
      // Scatter
      scatterCool:'rgba(37,99,235,.7)', scatterHeat:'rgba(220,38,38,.7)', scatterIn:'rgba(5,150,105,.65)',
      scatterDotCool:'#2563eb', scatterDotHeat:'#dc2626', scatterDotIn:'#059669'
    } : {
      bg:'#020617', text:'#cbd5e1', textDim:'#94a3b8', textMuted:'#64748b',
      grid:'rgba(71,85,105,.25)', frame:'rgba(148,163,184,.65)',
      legendBg:'rgba(15,23,42,.85)',
      coolFillStrong:'rgba(59,130,246,.18)', heatFillStrong:'rgba(239,68,68,.18)',
      coolFillSoft:'rgba(96,165,250,.18)',   heatFillSoft:'rgba(239,68,68,.18)',
      saLine:'#f59e0b', oaLine:'#f59e0b',
      cool:'#3b82f6', heat:'#ef4444', total:'#a855f7', band:'#10b981',
      optSa:'#c084fc', dynRst:'#d8b4fe',
      scatterCool:'rgba(96,165,250,.7)', scatterHeat:'rgba(248,113,113,.7)', scatterIn:'rgba(52,211,153,.65)',
      scatterDotCool:'#60a5fa', scatterDotHeat:'#f87171', scatterDotIn:'#34d399'
    };

    if(weatherData.length===0){
      ctx.fillStyle=P.bg;ctx.fillRect(0,0,vw,vh);
      ctx.fillStyle=P.textDim;ctx.font='bold 14px monospace';ctx.textAlign='center';
      ctx.fillText('No weather data — click FETCH WEATHER DATA to load',vw/2,vh/2);
      return;
    }
    var n=weatherData.length;

    // Background
    ctx.fillStyle=P.bg;ctx.fillRect(0,0,vw,vh);

    // Common X-axis: time
    function tx(i){return pad.left+(i/(n-1))*pw;}
    // Month grid
    ctx.strokeStyle=P.grid;ctx.lineWidth=.5;
    for(var k=0;k<=12;k++){var x=pad.left+(k/12)*pw;ctx.beginPath();ctx.moveTo(x,pad.top);ctx.lineTo(x,pad.top+ph);ctx.stroke();}
    // Month labels
    var firstTs=weatherData[0].time, lastTs=weatherData[n-1].time;
    if(firstTs && lastTs){
      var monthNames=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      ctx.fillStyle=P.textDim;ctx.font='10px monospace';ctx.textAlign='center';
      var lastMonth=-1;
      for(var i=0;i<n;i+=Math.max(1,Math.floor(n/180))){
        var d=new Date(weatherData[i].time);
        if(d.getMonth()!==lastMonth){
          lastMonth=d.getMonth();
          ctx.fillText(monthNames[lastMonth],tx(i),pad.top+ph+18);
        }
      }
      var d0=new Date(firstTs);
      ctx.font='9px monospace';ctx.fillStyle=P.textMuted;
      ctx.fillText(d0.getFullYear()+(d0.getFullYear()!==new Date(lastTs).getFullYear()?' → '+new Date(lastTs).getFullYear():''),vw/2,pad.top+ph+38);
    }

    // SA setpoint from panel (used by both modes)
    var saT=parseFloat(($('#p3-sa-t')||{}).value)||13;
    var saRh=parseFloat(($('#p3-sa-rh')||{}).value)||95;
    var W_sa=getW(saT,saRh);
    var h_sa=enthalpy(saT,W_sa);

    if(mode==='tt'){
      // === Compute the 4 cumulative curves ===
      var cumHeat=[],cumCool=[],cH=0,cC=0;
      var cumB=[],cBe=0;
      // Per-point band id ('B1'..'B10') so we can later draw transition
      // tick-markers along the green B1-B10 cumulative curve.
      var bandSeq=[];
      // Per-point dh (h_oa - h_sa). Captured here so the shading pass below
      // can color each segment by enthalpy polarity (matches the curves) —
      // not by temperature polarity, which can disagree when SA is humid
      // (e.g. 13 °C / 95 % RH → h_sa is high → warm-but-dry OA still has
      //  h_oa < h_sa and is therefore HEATING, not cooling).
      var dhSeq=[];
      var tMin=Infinity,tMax=-Infinity;
      for(var i=0;i<n;i++){
        var p=weatherData[i];
        if(p.t<tMin)tMin=p.t;if(p.t>tMax)tMax=p.t;
        var h_oa=enthalpy(p.t,p.w);
        var dh=h_oa-h_sa; // + needs cooling, - needs heating
        dhSeq.push(dh);
        if(dh>0)cC+=dh; else cH+=Math.abs(dh);
        cumHeat.push(cH);cumCool.push(cC);
        var oa_rh=p.rh!=null?p.rh:50;
        var b=classifyBand(p.t,oa_rh);
        bandSeq.push(b.id);
        var W_sa_b=getW(b.sa_t,b.sa_rh);
        var h_sa_b=enthalpy(b.sa_t,W_sa_b);
        cBe+=Math.abs((b.oa_damper/100)*(h_oa-h_sa_b));
        cumB.push(cBe);
      }
      var cT=cH+cC;
      var yMax=Math.max(cT,cBe,1)*1.05;
      function vy(v){return pad.top+ph-(v/yMax)*ph;}

      // Left Y axis: OA temperature scale (°C). Pad ±2°C around the data range,
      // round to nearest 5°C, then clamp into a sensible window.
      var tLo=Math.floor((tMin-2)/5)*5, tHi=Math.ceil((tMax+2)/5)*5;
      if(tHi-tLo<10){tHi=tLo+10;}
      function vyT(t){return pad.top+ph-((t-tLo)/(tHi-tLo))*ph;}

      // Y-axis ticks: cumulative energy on RIGHT, temperature on LEFT
      ctx.strokeStyle=P.grid;ctx.lineWidth=.5;
      ctx.font='10px monospace';
      // Right Y axis (energy) — labels and matching grid
      ctx.fillStyle=P.textDim;ctx.textAlign='left';
      for(var s=0;s<=5;s++){
        var v=yMax*s/5, y=vy(v);
        ctx.beginPath();ctx.moveTo(pad.left,y);ctx.lineTo(pad.left+pw,y);ctx.stroke();
        var lbl=v>=1000?(v/1000).toFixed(1)+'k':Math.round(v);
        ctx.fillText(lbl,pad.left+pw+4,y+3);
      }
      // Left Y axis (temperature) — temperature labels in theme accent
      ctx.fillStyle=P.oaLine;ctx.textAlign='right';
      var tStep=(tHi-tLo)<=20?5:10;
      for(var t=tLo;t<=tHi;t+=tStep){
        var ty=vyT(t);
        ctx.fillText(t+'°C',pad.left-6,ty+3);
      }

      // Shaded SA-vs-OA delta area (drawn UNDER the cumulative curves so the
      // curves remain the primary reading).  Color is driven by ENTHALPY
      // polarity per segment (dh = h_oa - h_sa), NOT temperature polarity, so
      // the shaded blue area integrates to cumCool and the red area to
      // cumHeat — the curves and shading now agree.  When dh changes sign
      // between two consecutive points we linearly interpolate the crossing
      // and split the segment into two trapezoids.
      ctx.save();ctx.beginPath();ctx.rect(pad.left,pad.top,pw,ph);ctx.clip();
      var saY=vyT(saT);
      for(var i=0;i<n-1;i++){
        var dh1=dhSeq[i], dh2=dhSeq[i+1];
        var x1=tx(i), x2=tx(i+1);
        var y1=vyT(weatherData[i].t), y2=vyT(weatherData[i+1].t);
        if((dh1>=0)===(dh2>=0)){
          ctx.fillStyle = (dh1+dh2>=0) ? P.coolFillStrong : P.heatFillStrong;
          ctx.beginPath();
          ctx.moveTo(x1,saY);ctx.lineTo(x1,y1);ctx.lineTo(x2,y2);ctx.lineTo(x2,saY);
          ctx.closePath();ctx.fill();
        } else {
          var ad1=Math.abs(dh1), ad2=Math.abs(dh2);
          var frac = ad1/(ad1+ad2 || 1);
          var xc = x1 + (x2-x1)*frac;
          var yc = y1 + (y2-y1)*frac;
          ctx.fillStyle = dh1>=0 ? P.coolFillStrong : P.heatFillStrong;
          ctx.beginPath();
          ctx.moveTo(x1,saY);ctx.lineTo(x1,y1);ctx.lineTo(xc,yc);ctx.lineTo(xc,saY);
          ctx.closePath();ctx.fill();
          ctx.fillStyle = dh2>=0 ? P.coolFillStrong : P.heatFillStrong;
          ctx.beginPath();
          ctx.moveTo(xc,saY);ctx.lineTo(xc,yc);ctx.lineTo(x2,y2);ctx.lineTo(x2,saY);
          ctx.closePath();ctx.fill();
        }
      }
      // OA temperature tracking line on top of the area fill.
      ctx.strokeStyle=P.oaLine;ctx.lineWidth=1.4;
      ctx.beginPath();
      for(var i=0;i<n;i++){var x=tx(i),y=vyT(weatherData[i].t);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
      ctx.stroke();
      // SA setpoint horizontal dashed line — TEMPERATURE reference only.
      // (The shading boundary is now Δh=0, not this line, since SA RH > 0
      //  pushes h_sa above cp·T_sa.)
      ctx.strokeStyle=P.saLine;ctx.lineWidth=1.5;ctx.setLineDash([6,4]);
      ctx.beginPath();ctx.moveTo(pad.left,saY);ctx.lineTo(pad.left+pw,saY);ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
      ctx.fillStyle=P.saLine;ctx.font='bold 10px monospace';ctx.textAlign='left';
      ctx.fillText('SA T '+saT.toFixed(1)+'°C  (h_sa '+h_sa.toFixed(1)+' kJ/kg)',pad.left+4,saY-3);

      // Frame
      ctx.strokeStyle=P.frame;ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(pad.left,pad.top);ctx.lineTo(pad.left,pad.top+ph);
      ctx.lineTo(pad.left+pw,pad.top+ph);ctx.lineTo(pad.left+pw,pad.top);ctx.closePath();ctx.stroke();

      // Curve drawer helper
      function drawCurve(arr,color,lw,dash){
        ctx.save();ctx.beginPath();ctx.rect(pad.left,pad.top,pw,ph);ctx.clip();
        ctx.strokeStyle=color;ctx.lineWidth=lw;
        if(dash)ctx.setLineDash(dash); else ctx.setLineDash([]);
        ctx.beginPath();
        for(var i=0;i<n;i++){var x=tx(i),y=vy(arr[i]);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
        ctx.stroke();ctx.setLineDash([]);
        ctx.restore();
      }
      drawCurve(cumHeat,P.heat,2);                              // Heating
      drawCurve(cumCool,P.cool,2);                              // Cooling
      var cumTotal=[];for(var i=0;i<n;i++)cumTotal.push(cumHeat[i]+cumCool[i]);
      drawCurve(cumTotal,P.total,2,[6,4]);                      // Total \u2014 purple dashed
      if(_p3ShowBandStrategy){
        drawCurve(cumB,P.band,4);                               // B1-B10 \u2014 green thick (gated)
      }

      // ===================================================================
      //  Opt-SA \u2014 true thermodynamic floor of any setpoint-reset strategy
      //  (T\u00d7Time chart).  Redefined 2026-02 to match the Monthly \u00d7 Sites
      //  chart: SA target = clamp(h_oa, optMinH, optMaxH).  When OA itself
      //  sits inside the comfort envelope the conditioning load drops to
      //  zero, so cOpt is the lowest achievable cumulative |\u0394h| under
      //  perfect foresight.  Previously this used mean(h_oa) which was
      //  L2-optimal but physically meaningless and produced the bug where
      //  Dyn-Rst could undercut Opt-SA whenever the dataset was bimodal
      //  (e.g. cold-then-hot annual cycle).  Drawn as a dotted purple line.
      // ===================================================================
      var hOaArr=new Float64Array(n);
      for(var hi=0;hi<n;hi++){
        hOaArr[hi]=enthalpy(weatherData[hi].t, weatherData[hi].w);
      }
      // Read live envelope sliders so the curve responds instantly when
      // the user drags them on the Monthly \u00d7 Sites toolbar (shared state).
      var ttOptMin = _optMinH, ttOptMax = _optMaxH;
      if (ttOptMax < ttOptMin) { var _tmp = ttOptMin; ttOptMin = ttOptMax; ttOptMax = _tmp; }
      // Build cumulative |h_oa - clamp(h_oa, optMin, optMax)|
      var cumOpt=[], cOpt=0;
      for(var oi=0;oi<n;oi++){
        var hSaOpt = Math.max(ttOptMin, Math.min(ttOptMax, hOaArr[oi]));
        cOpt += Math.abs(hOaArr[oi] - hSaOpt);
        cumOpt.push(cOpt);
      }
      drawCurve(cumOpt, P.optSa || '#c084fc', 1.5, [2,3]);      // dotted purple

      // ===================================================================
      //  Dynamic Reset (ASHRAE Guideline 36 \u2014 estimated)
      //  Real Trim & Respond logic re-aims SA toward whatever the zones are
      //  actually demanding.  In aggregate the SA setpoint tracks recent-OA
      //  enthalpy on a slow time constant (\u224824 h).  We model this with a
      //  trailing-24h moving average of h_oa and integrate residuals.
      //  Renders as a SOLID purple line, sitting between the dashed Total
      //  (worst-case naked fixed-SA) and the dotted Opt-SA (theoretical
      //  floor).  Saving vs naked fixed-SA is shown in the boxed legend.
      // ===================================================================
      var cumDyn=[], cDyn=0;
      // Window length scaled to data resolution: assume hourly samples; 24
      // points = 24 h.  If the dataset is sparser we cap at 1/4 of n.
      var win=Math.min(24, Math.max(2, Math.floor(n/4)));
      var rollSum=0;
      for(var di=0;di<n;di++){
        rollSum += hOaArr[di];
        if(di>=win){ rollSum -= hOaArr[di-win]; }
        var hSaDynRaw = rollSum / Math.min(di+1, win);
        // Same physical-envelope clamp as Monthly \u00d7 Sites: real ASHRAE
        // G36 Trim & Respond loops cap the SA target to a min/max range
        // (typically 55\u201365 \u00b0F).  Without this the unconstrained 24-h
        // mean drifts to extremes (e.g. 5 kJ/kg in winter) and lets
        // Dyn-Rst undercut Opt-SA \u2014 physically impossible (you cannot
        // deliver \u22125 \u00b0C SA without freezing the coil).  Clamping to the
        // same comfort envelope Opt-SA uses guarantees Opt-SA \u2264 Dyn-Rst.
        var hSaDyn = Math.max(ttOptMin, Math.min(ttOptMax, hSaDynRaw));
        cDyn += Math.abs(hOaArr[di] - hSaDyn);
        cumDyn.push(cDyn);
      }
      drawCurve(cumDyn, P.dynRst || '#c084fc', 2);              // solid purple

      // _optInfo: T\u00d7Time-renderer cache for legend label, hover tooltip,
      // and inline curve labels.  Carries the envelope bounds and totals
      // so the boxed legend can show "(25\u201350 kJ/kg envelope)" instead of
      // a back-solved single setpoint (which no longer applies after the
      // 2026-02 redefinition of Opt-SA as a clamp envelope rather than a
      // single mean-anchor target).
      var _optInfo = {
        optMinH: ttOptMin, optMaxH: ttOptMax,
        total: cOpt, dynTotal: cDyn
      };

      // ======================================================================
      //  Inline curve labels at the right edge — the user sees which color is
      //  which without consulting the boxed legend (which can be obscured by
      //  the floating Weather Strip config panel).  Labels are placed past
      //  the right-axis numeric ticks so they don't collide with energy values
      //  like "35.2k".  When two endpoints land within 12px of each other the
      //  lower one is nudged down so the text doesn't overlap.  The B1-B10
      //  endpoint is only included when the Show B1-B10 Strategy toggle is on.
      // ======================================================================
      var labelOffsetX = 42;  // clears "100.0k"-width axis ticks
      var endpts=[
        {y:vy(cumHeat[n-1]),  c:P.heat,  t:'Heating'},
        {y:vy(cumCool[n-1]),  c:P.cool,  t:'Cooling'},
        {y:vy(cumTotal[n-1]), c:P.total, t:'Total'},
        {y:vy(_optInfo.dynTotal), c:P.dynRst, t:'Dyn-Rst'},
        {y:vy(_optInfo.total),c:P.optSa, t:'Opt-SA'}
      ];
      if(_p3ShowBandStrategy){
        endpts.push({y:vy(cumB[n-1]), c:P.band, t:'B1-B10'});
      }
      endpts.sort(function(a,b){return a.y-b.y;});
      for(var k=1;k<endpts.length;k++){
        if(endpts[k].y - endpts[k-1].y < 12) endpts[k].y = endpts[k-1].y + 12;
      }
      var arrs=_p3ShowBandStrategy ? [cumHeat,cumCool,cumTotal,cumDyn,cumOpt,cumB]
                                   : [cumHeat,cumCool,cumTotal,cumDyn,cumOpt];
      var colors=_p3ShowBandStrategy ? [P.heat,P.cool,P.total,P.dynRst,P.optSa,P.band]
                                     : [P.heat,P.cool,P.total,P.dynRst,P.optSa];
      var xEnd=tx(n-1);
      // Dot at the actual curve endpoint (true y), regardless of label nudge.
      arrs.forEach(function(arr,idx){
        var yReal=vy(arr[n-1]);
        ctx.fillStyle=colors[idx];
        ctx.beginPath();ctx.arc(xEnd,yReal,2.5,0,Math.PI*2);ctx.fill();
      });
      // Leader line from real endpoint to label position when nudged
      ctx.font='bold 10px monospace';ctx.textAlign='left';
      endpts.forEach(function(e){
        var origY = (e.t==='Heating') ? vy(cumHeat[n-1])
                  : (e.t==='Cooling') ? vy(cumCool[n-1])
                  : (e.t==='Total')   ? vy(cumTotal[n-1])
                  : (e.t==='Dyn-Rst') ? vy(_optInfo.dynTotal)
                  : (e.t==='Opt-SA')  ? vy(_optInfo.total)
                                      : vy(cumB[n-1]);
        if(Math.abs(origY - e.y) > 1){
          ctx.strokeStyle=e.c;ctx.lineWidth=.8;ctx.setLineDash([2,2]);
          ctx.beginPath();ctx.moveTo(xEnd+3,origY);ctx.lineTo(xEnd+labelOffsetX-2,e.y);ctx.stroke();
          ctx.setLineDash([]);
        }
        ctx.fillStyle=e.c;
        ctx.fillText(e.t,xEnd+labelOffsetX,e.y+3);
      });

      // ======================================================================
      //  B1-B10 transition markers along the green cumulative curve.
      //  Each tick = a moment in the year where the active control band
      //  changed.  Tick + dot + first-occurrence label use the module-scoped
      //  BAND_COLOR cold-blue → hot-orange ramp so the eye can quickly read
      //  the thermal regime of the prevailing OA condition (B1 cold-dry,
      //  B10 hot-humid).  The pill background uses P.legendBg for legibility
      //  on either theme.  Gated behind the Show B1-B10 Strategy toggle.
      // ======================================================================
      function bandColor(id){return BAND_COLOR[id]||P.band;}

      var seen={};   // tracked outside the gated block — also used by ramp legend
      if(_p3ShowBandStrategy){
      ctx.save();ctx.beginPath();ctx.rect(pad.left,pad.top-14,pw,ph+14);ctx.clip();
      var lastLabelX=-9999;
      ctx.font='bold 9px monospace';ctx.textAlign='center';
      for(var i=1;i<n;i++){
        if(bandSeq[i]===bandSeq[i-1]) continue;          // no transition
        var x=tx(i), y=vy(cumB[i]);
        var bcol=bandColor(bandSeq[i]);
        // tick mark perpendicular to the curve — short vertical line
        ctx.strokeStyle=bcol;ctx.lineWidth=2;
        ctx.beginPath();ctx.moveTo(x,y-5);ctx.lineTo(x,y+5);ctx.stroke();
        // dot for emphasis
        ctx.fillStyle=bcol;
        ctx.beginPath();ctx.arc(x,y,2.5,0,Math.PI*2);ctx.fill();
        // first time we see this band — emit a text label
        var id=bandSeq[i];
        if(!seen[id] && (x-lastLabelX)>22){
          seen[id]=true; lastLabelX=x;
          var label=id;
          var tw=ctx.measureText(label).width;
          ctx.fillStyle=P.legendBg;
          ctx.fillRect(x-tw/2-3, y-18, tw+6, 11);
          ctx.fillStyle=bcol;
          ctx.fillText(label,x,y-9);
        }
      }
      ctx.restore();

      // Always label the very first band on the green curve too (its
      // transition tick is the start point, which the loop above skips).
      if(bandSeq.length>0){
        var x0=tx(0), y0=vy(cumB[0]);
        var bcol0=bandColor(bandSeq[0]);
        ctx.fillStyle=bcol0;
        ctx.beginPath();ctx.arc(x0,y0+1,2.5,0,Math.PI*2);ctx.fill();
        ctx.font='bold 9px monospace';ctx.textAlign='left';
        var id0=bandSeq[0];
        if(!seen[id0]){
          seen[id0]=true;
          var tw0=ctx.measureText(id0).width;
          ctx.fillStyle=P.legendBg;
          ctx.fillRect(x0+2, y0-9, tw0+4, 11);
          ctx.fillStyle=bcol0;
          ctx.fillText(id0, x0+4, y0);
        }
      }
      } /* end if(_p3ShowBandStrategy) */

      // Title + axis labels
      ctx.fillStyle=P.text;ctx.font='bold 13px monospace';ctx.textAlign='left';
      ctx.fillText('CUMULATIVE ENERGY × TIME  +  OA TRACKING',pad.left,24);
      ctx.fillStyle=P.oaLine;ctx.font='10px monospace';
      ctx.save();ctx.translate(15,pad.top+ph/2);ctx.rotate(-Math.PI/2);ctx.textAlign='center';
      ctx.fillText('OA Temperature (°C)',0,0);ctx.restore();
      ctx.fillStyle=P.total;
      ctx.save();ctx.translate(vw-12,pad.top+ph/2);ctx.rotate(Math.PI/2);ctx.textAlign='center';
      ctx.fillText('Cumulative Δh (kJ/kg)',0,0);ctx.restore();
      ctx.fillStyle=P.textMuted;ctx.textAlign='center';ctx.fillText('Time (Season)',pad.left+pw/2,vh-12);

      // Compact legend in the top-left of the plot area (above the curves).
      // Boxed background so it stays legible on either theme even when the
      // floating Weather Strip panel is collapsed and the legend is exposed.
      // Box height accommodates 6 rows + footnote when band-strategy is OFF,
      // 7 rows + footnote when ON.  Now includes Dyn-Rst (G36 estimate).
      var lgX=pad.left+10, lgY=pad.top+10;
      var lgW=240, lgH=_p3ShowBandStrategy ? 124 : 110;
      ctx.fillStyle=P.legendBg;ctx.fillRect(lgX-6,lgY-10,lgW,lgH);
      ctx.strokeStyle=P.frame;ctx.lineWidth=.5;ctx.strokeRect(lgX-6,lgY-10,lgW,lgH);
      ctx.font='bold 9px monospace';ctx.textAlign='left';
      function legendItem(color,label,total,extra,dash){
        ctx.strokeStyle=color;ctx.lineWidth=3;
        if(dash){ctx.setLineDash(dash);} else {ctx.setLineDash([]);}
        ctx.beginPath();ctx.moveTo(lgX,lgY);ctx.lineTo(lgX+18,lgY);ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle=color;ctx.fillText(label,lgX+22,lgY+3);
        ctx.fillStyle=P.text;
        var tt=total>=1000?(total/1000).toFixed(1)+'k':Math.round(total);
        ctx.fillText(tt+' kJ/kg'+(extra||''),lgX+72,lgY+3);
        lgY+=14;
      }
      // OA tracking key (no total — it's a state line, not an integral)
      ctx.strokeStyle=P.oaLine;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(lgX,lgY);ctx.lineTo(lgX+18,lgY);ctx.stroke();
      ctx.fillStyle=P.oaLine;ctx.fillText('OA temp',lgX+22,lgY+3);lgY+=14;
      legendItem(P.heat,'Heating',cH);
      legendItem(P.cool,'Cooling',cC);
      legendItem(P.total,'Total \u26A0',cT,'',[6,4]);
      // Dynamic Reset (ASHRAE G36 estimate) \u2014 SA tracks 24h trailing mean
      // of OA enthalpy, modelling Trim & Respond aggregate behaviour.
      var dynPctVsTotal = cT>0 ? Math.max(0,Math.round((1-cDyn/cT)*100)) : 0;
      legendItem(P.dynRst,'Dyn-Rst \u26A0',cDyn, dynPctVsTotal>0?'  -'+dynPctVsTotal+'% \u2020':' \u2020');
      // Optimal-SA reference \u2014 envelope-clamped thermodynamic floor.
      // Suffix shows the active envelope so the user knows which bounds
      // produced this curve (live-driven by the Monthly \u00d7 Sites toolbar
      // sliders).  Suffixed "*" \u2192 footnoted as "theoretical only".
      var optSuffix = '  ('+_optInfo.optMinH.toFixed(0)+'\u2013'+_optInfo.optMaxH.toFixed(0)+' kJ/kg env) *';
      legendItem(P.optSa,'Opt-SA',_optInfo.total,optSuffix,[2,3]);
      var savePct=cT>0?Math.max(0,Math.round((1-cBe/cT)*100)):0;
      if(_p3ShowBandStrategy){
        legendItem(P.band,'B1-B10',cBe,savePct>0?'  -'+savePct+'%':'');
      }
      // Footnotes inside the boxed legend:
      //   *  Opt-SA = theoretical floor (impossible without foresight)
      //   \u2020 Dyn-Rst = ASHRAE G36 estimate (24h trailing-mean SA model)
      //   \u26A0 Total / Dyn-Rst lack humidity (latent) control \u2014 NOT for deployment.
      ctx.fillStyle=P.textMuted; ctx.font='7px monospace'; ctx.textAlign='left';
      ctx.fillText('* clamp(h_oa, env) floor   \u2020 G36 estimate', lgX, lgY+2);
      lgY += 9;
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('\u26A0 no latent (RH) control \u2014 not for deployment', lgX, lgY+2);

      // ---- B1 → B10 cold→hot color ramp at the TOP-MIDDLE of the chart ----
      // Only rendered when Show B1-B10 Strategy is on.  Tally hours per band
      // across the full series so each swatch shows the % of the season
      // operating in that thermal regime.
      if(_p3ShowBandStrategy){
        var bandHrs = {};
        for(var bk=0;bk<bandSeq.length;bk++){bandHrs[bandSeq[bk]]=(bandHrs[bandSeq[bk]]||0)+1;}
        // Layout: centered horizontally above the plot area.
        var swW = 26, swH = 11, swGap = 2;
        var ramW = BAND_ORDER.length*(swW+swGap) - swGap;
        var ramX = pad.left + pw/2 - ramW/2;
        var ramY = 6;                          // sits inside the top margin
        var pillH = swH + 26;                  // swatches + 2 text rows
        var pillW = ramW + 28;
        var pillX = ramX - 14;
        var pillY = ramY - 2;
        // Pill backdrop
        ctx.fillStyle=P.legendBg;
        ctx.fillRect(pillX, pillY, pillW, pillH);
        ctx.strokeStyle=P.frame;ctx.lineWidth=.5;
        ctx.strokeRect(pillX, pillY, pillW, pillH);
        // Title
        ctx.fillStyle=P.textDim;ctx.font='7px monospace';ctx.textAlign='center';
        ctx.fillText('B1\u2013B10 BAND CONTROL REGIME (cold \u25B8 hot)', pillX+pillW/2, pillY+8);
        // Swatch row
        for(var bi=0;bi<BAND_ORDER.length;bi++){
          var bid = BAND_ORDER[bi];
          var sx = ramX + bi*(swW+swGap);
          ctx.fillStyle = BAND_COLOR[bid];
          ctx.fillRect(sx, ramY+10, swW, swH);
          if(bandHrs[bid]){
            ctx.strokeStyle=P.text; ctx.lineWidth=.4;
            ctx.strokeRect(sx, ramY+10, swW, swH);
          }
        }
        // Labels: id + % under each swatch
        ctx.font='bold 8px monospace'; ctx.textAlign='center';
        for(var bi2=0;bi2<BAND_ORDER.length;bi2++){
          var bid2 = BAND_ORDER[bi2];
          var cx = ramX + bi2*(swW+swGap) + swW/2;
          ctx.fillStyle = bandHrs[bid2] ? P.text : P.textMuted;
          ctx.fillText(bid2, cx, ramY+swH+22);
          if(bandHrs[bid2]){
            var pct = Math.round(100*bandHrs[bid2]/bandSeq.length);
            ctx.font='7px monospace';
            ctx.fillStyle = P.textDim;
            ctx.fillText(pct+'%', cx, ramY+swH+32);
            ctx.font='bold 8px monospace';
          }
        }
        ctx.textAlign='left';
      }

      // Cache per-point series + plot geometry so the mousemove handler can
      // resolve cursor → data index and build a band-aware tooltip without
      // recomputing.  Refreshed on every T×Time render.
      _ttCache = {
        n:n, pad:pad, pw:pw, ph:ph, vw:vw, vh:vh,
        bandSeq:bandSeq, cumHeat:cumHeat, cumCool:cumCool, cumTotal:cumTotal, cumB:cumB,
        yMax:yMax,
        BANDS:BANDS, saT:saT, saRh:saRh
      };

    } else {
      // === W×Time SCATTER mode ===
      // Y axis: humidity ratio (g/kg) so it visually matches the 3D engine.
      // Each dot is colored by the SAME ΔH polarity convention used everywhere
      // else: cooling-needed = blue, heating-needed = red, in CZ = green.
      _ttCache = null; // disable T×Time tooltip in W×Time mode
      var COMFORT_DH=4;
      var wMax=0;
      for(var i=0;i<n;i++){if(weatherData[i].w>wMax)wMax=weatherData[i].w;}
      var yTop=Math.max(.025, Math.ceil(wMax*1000/5)*5/1000); // round up to nearest 5 g/kg
      function vy2(w){return pad.top+ph-(w/yTop)*ph;}
      // Y ticks
      ctx.strokeStyle=P.grid;ctx.lineWidth=.5;
      ctx.fillStyle=P.textDim;ctx.font='10px monospace';ctx.textAlign='right';
      for(var g=0;g<=yTop*1000;g+=5){
        var w=g/1000, y=vy2(w);
        ctx.beginPath();ctx.moveTo(pad.left,y);ctx.lineTo(pad.left+pw,y);ctx.stroke();
        ctx.fillText(g+' g/kg',pad.left-6,y+3);
      }
      // Frame
      ctx.strokeStyle=P.frame;ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(pad.left,pad.top);ctx.lineTo(pad.left,pad.top+ph);
      ctx.lineTo(pad.left+pw,pad.top+ph);ctx.stroke();

      // Scatter
      ctx.save();ctx.beginPath();ctx.rect(pad.left,pad.top,pw,ph);ctx.clip();
      var nC=0,nH=0,nIn=0;
      for(var i=0;i<n;i++){
        var p=weatherData[i];
        var dh=enthalpy(p.t,p.w)-h_sa;
        var col;
        if(dh>COMFORT_DH){col=P.scatterCool;nC++;}        // cool needed = blue
        else if(dh<-COMFORT_DH){col=P.scatterHeat;nH++;}  // heat needed = red
        else{col=P.scatterIn;nIn++;}                      // in comfort = green
        ctx.fillStyle=col;
        ctx.beginPath();ctx.arc(tx(i),vy2(p.w),1.6,0,Math.PI*2);ctx.fill();
      }
      ctx.restore();

      // Title + axis labels
      ctx.fillStyle=P.text;ctx.font='bold 13px monospace';ctx.textAlign='left';
      ctx.fillText('HUMIDITY × TIME (scatter)',pad.left,24);
      ctx.fillStyle=P.textMuted;ctx.font='10px monospace';
      ctx.save();ctx.translate(15,pad.top+ph/2);ctx.rotate(-Math.PI/2);ctx.textAlign='center';
      ctx.fillText('Humidity ratio (g/kg)',0,0);ctx.restore();
      ctx.textAlign='center';ctx.fillText('Time (Season)',pad.left+pw/2,vh-12);

      // Legend
      var lx2=pad.left+pw+10, ly2=pad.top+10;
      ctx.font='bold 10px monospace';ctx.textAlign='left';
      function dotItem(color,label,count){
        ctx.fillStyle=color;ctx.beginPath();ctx.arc(lx2+5,ly2,4,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=P.text;ctx.fillText(label,lx2+15,ly2+3);
        ctx.font='9px monospace';ctx.fillStyle=P.textDim;
        var pctOf=n>0?Math.round(count/n*100):0;
        ctx.fillText(count+' pts ('+pctOf+'%)',lx2,ly2+15);
        ctx.font='bold 10px monospace';
        ly2+=30;
      }
      dotItem(P.scatterDotCool,'Cooling',nC);
      dotItem(P.scatterDotHeat,'Heating',nH);
      dotItem(P.scatterDotIn,'In CZ',nIn);
    }
  }


  /* ====================================================================
   *  Monthly \u00d7 Sites visualization
   *
   *  Fetches a full year of hourly OA data for each preset weather location
   *  in parallel, classifies each hour into a B1\u2013B10 band, and integrates
   *  monthly |OAD/100 \u00d7 (h_oa - h_sa_band)| \u2014 the same air-side load metric
   *  used by the single-site T\u00d7Time B1-B10 cumulative curve.  Renders as a
   *  per-site grouped bar chart (fixed-SA baseline vs B1-B10) on the 2D
   *  overlay canvas.  Cached per session so repeat clicks don't re-fetch.
   * ==================================================================== */
  function _fetchMonthlyAllSites(){
    // Preset site list \u2014 kept in sync with the #p3-loc-presets buttons.
    var presets=[
      {code:'NYC', lat:40.71, lon:-74.01, name:'New York',  source:'preset'},
      {code:'LON', lat:51.51, lon:-0.13,  name:'London',    source:'preset'},
      {code:'SIN', lat:1.35,  lon:103.82, name:'Singapore', source:'preset'},
      {code:'TYO', lat:35.68, lon:139.69, name:'Tokyo',     source:'preset'},
      {code:'DXB', lat:25.20, lon:55.27,  name:'Dubai',     source:'preset'},
      {code:'SYD', lat:-33.87,lon:151.21, name:'Sydney',    source:'preset'}
    ];
    _monthlyFetching=true;
    render2DChart(); // loading placeholder

    /* ---- localStorage cache for Open-Meteo archives ----
       Open-Meteo historical hourly data is static: last year's weather
       doesn't change.  But every re-mount of the Monthly \u00d7 Sites view
       was re-fetching all 7+ sites over the WAN, which the user
       experienced as a "very long time" even though the controller
       already had the bundle.  Cache each (lat,lon,year) payload in
       localStorage so subsequent opens are instant.
       Key format: mxs_v1|<lat2dp>|<lon2dp>|<YYYY>
       Entry (compact): { y, t0 (ISO), t [rounded 1dp], rh [rounded 1dp], savedAt, lastUsed }
         * `t0` + index*3600s reconstructs `tm` at read time — saves
           ~140 KB per site vs storing ISO strings for every hour.
         * Rounding to 1 decimal halves the per-number footprint and
           matches Open-Meteo's own precision anyway.
       Full cold load ~7 sites fits comfortably under 2 MB total
       (localStorage quota is 5\u201310 MB per origin).  LRU-evict when we
       exceed _CACHE_MAX entries so a multi-year walk doesn\u2019t blow up. */
    var _CACHE_PREFIX = 'mxs_v1|';
    var _CACHE_MAX    = 16;
    function _cacheKey(lat, lon, year){
      return _CACHE_PREFIX + lat.toFixed(2) + '|' + lon.toFixed(2) + '|' + year;
    }
    function _round1(arr){
      var out = new Array(arr.length);
      for (var i = 0; i < arr.length; i++){
        var v = arr[i];
        out[i] = (v == null) ? null : Math.round(v * 10) / 10;
      }
      return out;
    }
    function _rebuildTimes(t0ISO, n){
      // t0ISO comes in as "YYYY-MM-DDTHH:MM" (Open-Meteo format, local
      // timezone).  Rebuild hourly cadence without using Date objects so
      // we avoid timezone drift \u2014 Open-Meteo guarantees consecutive
      // hourly entries in local time.
      var m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(t0ISO || '');
      if (!m) return null;
      var y=+m[1], mo=+m[2], d=+m[3], h=+m[4];
      var days=[31, (y%4===0 && (y%100!==0 || y%400===0))?29:28, 31,30,31,30,31,31,30,31,30,31];
      var out = new Array(n);
      for (var i = 0; i < n; i++){
        out[i] = y + '-' + (mo<10?'0':'') + mo + '-' + (d<10?'0':'') + d + 'T' + (h<10?'0':'') + h + ':00';
        h++;
        if (h >= 24){ h = 0; d++; if (d > days[mo-1]){ d = 1; mo++; if (mo > 12){ mo = 1; y++; } } }
      }
      return out;
    }
    function _cacheGet(key){
      try {
        var raw = localStorage.getItem(key);
        if (!raw) return null;
        var p = JSON.parse(raw);
        if (!p || !p.t || !p.rh) return null;
        // Rebuild tm array from t0 + length (cache stores t0 only to save
        // ~140 KB per site).  Legacy entries that still have tm inline
        // continue to work via the `p.tm || _rebuildTimes(...)` fallback.
        var tm = p.tm || _rebuildTimes(p.t0, p.t.length);
        if (!tm) return null;
        // Touch lastUsed so this key bubbles to the top of LRU.  Wrap in
        // try so a quota error here doesn't poison the read path.
        try {
          p.lastUsed = Date.now();
          localStorage.setItem(key, JSON.stringify(p));
        } catch(e){}
        return { t: p.t, rh: p.rh, tm: tm };
      } catch(e){ return null; }
    }
    function _cacheSet(key, payload){
      try {
        var tm = payload.tm || [];
        var compact = {
          t:  _round1(payload.t),
          rh: _round1(payload.rh),
          t0: tm.length ? tm[0] : null,   // skip storing full tm array
          savedAt: new Date().toISOString(),
          lastUsed: Date.now(),
        };
        localStorage.setItem(key, JSON.stringify(compact));
        // LRU evict: if we have >CACHE_MAX entries, drop the oldest.
        var keys = [];
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (k && k.indexOf(_CACHE_PREFIX) === 0) keys.push(k);
        }
        if (keys.length > _CACHE_MAX) {
          var items = keys.map(function(k){
            try { return {k:k, t: (JSON.parse(localStorage.getItem(k)) || {}).lastUsed || 0}; }
            catch(e){ return {k:k, t:0}; }
          }).sort(function(a,b){ return a.t - b.t; });
          var drop = items.length - _CACHE_MAX;
          for (var j = 0; j < drop; j++) {
            try { localStorage.removeItem(items[j].k); } catch(e){}
          }
        }
      } catch(e){
        // Quota exceeded or SecurityError \u2014 if quota, drop the oldest
        // half of our entries and retry once so the most-recent site
        // still gets a cache slot instead of silent loss.
        if (e && (e.name === 'QuotaExceededError' || /quota/i.test(e.message||''))) {
          try {
            var all = [];
            for (var i = 0; i < localStorage.length; i++) {
              var k = localStorage.key(i);
              if (k && k.indexOf(_CACHE_PREFIX) === 0) all.push(k);
            }
            all.sort(function(a,b){
              try { return ((JSON.parse(localStorage.getItem(a))||{}).lastUsed||0) - ((JSON.parse(localStorage.getItem(b))||{}).lastUsed||0); }
              catch(_){ return 0; }
            });
            for (var j = 0; j < Math.ceil(all.length/2); j++){
              try { localStorage.removeItem(all[j]); } catch(_){}
            }
            // Retry once \u2014 if still fails, just give up silently.
            try { localStorage.setItem(key, JSON.stringify(payload)); } catch(_){}
          } catch(_){}
        }
      }
    }

    // First pull saved user locations from the controller API so we can
    // include the user\u2019s own hospitals (NRAH, Perth Children\u2019s, Hanyang,
    // \ub450\ube48\ub17c\uc778\ubcd1\uc6d0\u2026) alongside the 6 presets.  Saved locations appear FIRST
    // in the grid so the user sees their own sites before the reference
    // presets.  We dedupe by (lat 2dp, lon 2dp) so a saved location that
    // coincides with a preset doesn\u2019t render twice.
    fetch('/api/weather-location')
      .then(function(r){return r.ok ? r.json() : {saved:[]};})
      .catch(function(){return {saved:[]};})
      .then(function(state){
        if (_disposed) return;
        var saved=(state && Array.isArray(state.saved)) ? state.saved : [];
        var sites=[];
        var seen={};
        // First: saved (user) locations, keeping the order they were saved.
        saved.forEach(function(loc,i){
          if(!loc || typeof loc.lat!=='number' || typeof loc.lon!=='number')return;
          var k=loc.lat.toFixed(2)+','+loc.lon.toFixed(2);
          if(seen[k])return; seen[k]=true;
          var name=(loc.name||'').trim();
          // Short code: first word capitalized, up to 3 chars.
          var firstWord=(name.split(/\s+/)[0]||('U'+(i+1)));
          var code=firstWord.toUpperCase().replace(/[^A-Z0-9\uAC00-\uD7AF]/g,'').slice(0,3) || ('U'+(i+1));
          sites.push({code:code, lat:loc.lat, lon:loc.lon, name:name||('Saved #'+(i+1)), source:'saved'});
        });
        // Then: presets not already covered by a saved location.
        presets.forEach(function(p){
          var k=p.lat.toFixed(2)+','+p.lon.toFixed(2);
          if(seen[k])return; seen[k]=true;
          sites.push(p);
        });

        // Remember the display order globally so the renderer follows it.
        _monthlySiteOrder = sites.map(function(s){return s.code;});

        /* Seed the user-selection set on first open: pick the SINGLE site
           closest to the dashboard\u2019s current weather-strip (lat/lon read
           from #p3-lat / #p3-lon).  This makes the default view "the
           location I\u2019m already looking at" rather than "all 6+ sites at
           once".  The user toggles additional sites in via chips.       */
        if (_monthlySelected === null) {
          var curLat = parseFloat(($('#p3-lat')||{}).value);
          var curLon = parseFloat(($('#p3-lon')||{}).value);
          _monthlySelected = {};
          if (!isNaN(curLat) && !isNaN(curLon) && sites.length){
            var best = sites[0], bestD = Infinity;
            sites.forEach(function(s){
              var d = (s.lat-curLat)*(s.lat-curLat) + (s.lon-curLon)*(s.lon-curLon);
              if (d < bestD){ bestD = d; best = s; }
            });
            _monthlySelected[best.code] = true;
          } else if (sites.length) {
            _monthlySelected[sites[0].code] = true;
          }
        }

        // Fetch each site\u2019s previous full calendar year of hourly data.
        var y=new Date().getFullYear()-1;
        var fromD=y+'-01-01', toD=y+'-12-31';
        if(sites.length===0){
          _monthlyFetching=false;
          render2DChart();
          return;
        }

        // Hydrate from localStorage cache first \u2014 each hit paints
        // immediately and counts toward the "all done" total below.  If
        // ALL sites are cached, no Open-Meteo hit at all.
        var pendingNetwork = [];
        sites.forEach(function(s){
          var cached = _cacheGet(_cacheKey(s.lat, s.lon, y));
          if (cached) {
            _monthlyCache[s.code] = {site:s, raw:{t:cached.t, rh:cached.rh, tm:cached.tm}, fromCache:true};
          } else {
            pendingNetwork.push(s);
          }
        });
        if (pendingNetwork.length === 0) {
          _monthlyFetching=false;
          if (!_disposed) render2DChart();
          return;
        }
        // First paint with whatever we already have so the user sees
        // cached sites immediately while the missing ones load.
        if (!_disposed && Object.keys(_monthlyCache).length) render2DChart();

        // Per-site fetch: race the CONTROLLER against direct Open-Meteo
        // and keep the first valid payload.
        //
        //   - Controller route (`/api/weather-history`) has a persistent
        //     on-disk cache under `/root/data/configs/`.  When warm,
        //     it's the fastest path — <50 ms over LAN.  But on a COLD
        //     cache it has to make its OWN outbound Open-Meteo call,
        //     which can take 10\u201330 s per site and Open-Meteo rate-limits
        //     by IP (one controller \u2192 7 sites serialized \u2192 >1 min).
        //
        //   - Direct browser-to-Open-Meteo is typically 2\u20135 s per site
        //     but burns the user's bandwidth every page load.
        //
        //   - RACE: fire both in parallel; whichever returns valid JSON
        //     first wins.  On a warm controller, the controller always
        //     wins and the browser's Open-Meteo fetch is a wasted
        //     background request (still fast, still fine).  On a cold
        //     controller, Open-Meteo wins and the controller's slow
        //     write-through response is discarded.  Net effect: users
        //     see the best of both paths without worst-case tail
        //     latency from either one.
        function _fetchJSONWithTimeout(url, timeoutMs){
          return new Promise(function(resolve, reject){
            var timedOut = false;
            var timer = setTimeout(function(){ timedOut = true; reject(new Error('timeout')); }, timeoutMs);
            fetch(url).then(function(r){
              if (timedOut) return;
              var ct = (r.headers.get('content-type')||'').toLowerCase();
              if (!r.ok || ct.indexOf('application/json') === -1){
                clearTimeout(timer);
                reject(new Error('status ' + r.status));
                return;
              }
              r.json().then(function(j){
                clearTimeout(timer);
                if (!timedOut) resolve(j);
              }, function(e){ clearTimeout(timer); if (!timedOut) reject(e); });
            }).catch(function(e){
              clearTimeout(timer);
              if (!timedOut) reject(e);
            });
          });
        }
        function _doFetchController(s){
          // 30 s timeout: the controller's /api/weather-history endpoint
          // hits Open-Meteo and writes to /root/data/configs/ on a cold
          // cache miss (can take 5-15 s for Tokyo's full hourly year).
          // Once cached, response is <50 ms.  Generous timeout means the
          // first ever load primes the cache for every subsequent visit.
          return _fetchJSONWithTimeout('/api/weather-history?lat='+s.lat+'&lon='+s.lon+'&year='+y, 30000)
            .then(function(j){
              // The controller emits a different shape than Open-Meteo:
              //   { success:true, hourly: [{time, temp, rh, h}, ...] }
              // versus Open-Meteo's
              //   { hourly: {time:[], temperature_2m:[], relative_humidity_2m:[]} }
              // The renderer (and our cache layer) reads the Open-Meteo
              // shape so we MUST transpose the array-of-objects back to
              // parallel arrays.  Skipping this step is what made every
              // "controller-first" round-trip fall through to direct
              // Open-Meteo \u2014 the controller cache was effectively dead.
              if (j && Array.isArray(j.hourly) && j.hourly.length){
                var n = j.hourly.length;
                var time = new Array(n);
                var temp = new Array(n);
                var rh   = new Array(n);
                for (var i = 0; i < n; i++){
                  var row = j.hourly[i] || {};
                  time[i] = row.time;
                  temp[i] = (row.temp != null) ? row.temp : (row.temperature_2m != null ? row.temperature_2m : null);
                  rh[i]   = (row.rh   != null) ? row.rh   : (row.relative_humidity_2m != null ? row.relative_humidity_2m : null);
                }
                return { hourly: { time: time, temperature_2m: temp, relative_humidity_2m: rh } };
              }
              if (!j || !j.hourly || !j.hourly.time || !j.hourly.time.length){
                throw new Error('controller payload empty');
              }
              return j;
            });
        }
        function _doFetchOpenMeteo(s){
          return fetch('https://archive-api.open-meteo.com/v1/archive?latitude='+s.lat+'&longitude='+s.lon+
            '&start_date='+fromD+'&end_date='+toD+
            '&hourly=temperature_2m,relative_humidity_2m&timezone=auto')
            .then(function(r){ if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); })
            .then(function(j){
              if(!j || !j.hourly || !j.hourly.time || !j.hourly.time.length){
                throw new Error('empty payload');
              }
              return j;
            });
        }
        function _doFetch(s, attempt){
          // CONTROLLER-FIRST policy.  Open-Meteo aggressively rate-limits
          // (HTTP 429) when 7 sites + occasional refreshes hit them in
          // short succession from the same IP.  The controller's
          // /api/weather-history endpoint has a persistent on-disk cache
          // under /root/data/configs/ \u2014 once a year is cached for a
          // (lat,lon) pair it stays cached, so we should hit that path
          // every time and only fall through to Open-Meteo when the
          // controller genuinely lacks the data.
          //
          // Old policy: race controller and Open-Meteo with Promise.any.
          // That was wrong because (a) Open-Meteo often won the race on
          // a warm controller, defeating the cache, and (b) every
          // refresh DID still call Open-Meteo, accumulating toward 429.
          return _doFetchController(s).catch(function(){
            // Controller unreachable / route missing / cold cache that
            // failed to write \u2014 only NOW do we burn an Open-Meteo quota.
            return _doFetchOpenMeteo(s);
          });
        }
        pendingNetwork.forEach(function(s){
          _doFetch(s, 1)
            .catch(function(e){
              // On first failure, wait 600 ms and retry once.
              return new Promise(function(res,rej){
                setTimeout(function(){ _doFetch(s, 2).then(res).catch(rej); }, 600);
              });
            })
            .then(function(j){
              if (_disposed) return;
              var t=j.hourly.temperature_2m, rh=j.hourly.relative_humidity_2m, tm=j.hourly.time;
              // Persist to localStorage so re-opens are instant.
              _cacheSet(_cacheKey(s.lat, s.lon, y), {t:t, rh:rh, tm:tm});
              // Store raw hourly arrays \u2014 base and band integrals are
              // recomputed inside the renderer on every draw so the chart
              // responds live to the SA Temp / SA RH sliders without
              // re-fetching Open-Meteo.
              _monthlyCache[s.code]={site:s, raw:{t:t, rh:rh, tm:tm}};
              if(Object.keys(_monthlyCache).length>=sites.length){_monthlyFetching=false;}
              render2DChart();
            })
            .catch(function(e){
              if (_disposed) return;
              _monthlyCache[s.code]={site:s, band:null, base:null, error:((e && e.message)||'fetch failed')};
              if(Object.keys(_monthlyCache).length>=sites.length){_monthlyFetching=false;}
              render2DChart();
            });
        });
      });
  }
  function _sumArr(a){var s=0;for(var i=0;i<a.length;i++)s+=a[i];return s;}

  function renderMonthlySitesChart(ctx,vw,vh){
    _monthlyPanelRects = {};
    /* Re-derive per-month base/band totals from each site's cached raw
       hourly arrays using the CURRENT SA Temp / SA RH slider values.  This
       runs on every render so the user sees totals update live as they
       drag the sliders \u2014 no Open-Meteo refetch.  classifyBand() output is
       slider-invariant so band totals stay constant; the baseline is what
       moves. */
    var _saT=parseFloat(($('#p3-sa-t')||{}).value)||13;
    var _saRh=parseFloat(($('#p3-sa-rh')||{}).value)||50;
    var _h_sa_u=enthalpy(_saT, getW(_saT, _saRh));
    /* Trim & Respond envelope half-width for the B1-B10 + Dyn-Reset
       hybrid: Dyn-Reset can only push the SA target ±_TR_DH kJ/kg
       above/below the band's own SA enthalpy h_sa_b.  Outside that
       envelope the layered controller falls back to h_sa_b (= pure
       B1-B10) — without this clamp, bandDyn collapses to plain dyn
       because the rolling 24-h h_oa mean is allowed to wander
       arbitrarily far from the band setpoint.  ±2 °C @ 50 %RH ≈
       ±4 kJ/kg dry air. */
    var _TR_DH = 4;
    /* Re-derive 5 strategy arrays per site, all expressed as monthly Σ|Δh|:
         base    = Fixed SA-T/RH    (slider setpoint, no damper modulation)
         dyn     = Dyn-Reset (G36)  (SA tracks 24-h trailing mean of h_oa)
         band    = B1-B10           (band-driven SA target × OA-damper fraction)
         bandDyn = B1-B10 + Dyn-Reset (h_sa_b ± _TR_DH-clamped dyn target)
         opt     = Opt-SA           (h_sa_opt(t) = clamp(h_oa, optMinH, optMaxH))
       Open-Meteo data is hourly so the 24-sample trailing window equals 24 h.
       Sparser datasets fall back to ¼ of the array length (same logic as the
       T×Time Dyn-Rst curve, kept consistent so cross-chart numbers reconcile).
    */
    Object.keys(_monthlyCache).forEach(function(code){
      var d=_monthlyCache[code];
      if(!d || d.error || !d.raw) return;
      var t=d.raw.t, rh=d.raw.rh, tm=d.raw.tm;
      var n=t.length;
      var base=new Float64Array(12), dyn=new Float64Array(12),
          band=new Float64Array(12), bandDyn=new Float64Array(12),
          opt=new Float64Array(12);
      // OA-damper utilisation tracker (visualisation only — does not
      // feed back into the strategy math).  oaSum/oaCnt → monthly mean
      // damper % per panel; oaAnnSum/oaAnnCnt → site-wide annual mean
      // for the panel header annotation.
      var oaSum=new Float64Array(12), oaCnt=new Uint32Array(12);
      var oaAnnSum=0, oaAnnCnt=0;
      var bandCounts={};
      // 24-h trailing-mean of h_oa, scaled to data resolution.
      var win=Math.min(24, Math.max(2, Math.floor(n/4)));
      var rollSum=0;
      // Pre-compute h_oa once; we walk twice (once for the rolling window).
      var hOa=new Float64Array(n);
      for(var i=0;i<n;i++){
        var T=t[i], R=rh[i];
        if(T==null||R==null){ hOa[i]=NaN; continue; }
        hOa[i]=enthalpy(T, getW(T,R));
      }
      // Read live Opt-SA bounds at render-time so the curve responds
      // instantly when the user drags the new toolbar sliders.
      var optMinH = _optMinH, optMaxH = _optMaxH;
      if (optMaxH < optMinH) { var _tmp = optMinH; optMinH = optMaxH; optMaxH = _tmp; }
      for(var i=0;i<n;i++){
        var T=t[i], R=rh[i]; if(T==null||R==null) continue;
        var h_oa=hOa[i];
        // Rolling-mean h_sa for Dyn-Reset (skip NaN samples in the window).
        rollSum += h_oa;
        if(i>=win){
          var prev=hOa[i-win]; if(!isNaN(prev)) rollSum -= prev;
        }
        var h_sa_dyn_raw = rollSum / Math.min(i+1, win);
        // Physical-envelope clamp on Dyn-Reset.  Real ASHRAE G36 Trim &
        // Respond loops cap the SA target between a min and max (e.g.
        // 55 \u00b0F \u2013 65 \u00b0F).  Without this clamp, the unconstrained
        // 24-h rolling mean can drift to e.g. 5 kJ/kg in Seoul winter or
        // 60 kJ/kg in summer, which makes |h_oa \u2212 rm| collapse to zero
        // and lets Dyn-Reset undercut Opt-SA \u2014 physically impossible
        // (you cannot deliver \u22125 \u00b0C SA without freezing the coil).  Clamp
        // it to the same comfort envelope Opt-SA uses so Opt-SA is
        // provably the lowest curve.
        var h_sa_dyn = Math.max(optMinH, Math.min(optMaxH, h_sa_dyn_raw));
        var m=parseInt(tm[i].slice(5,7),10)-1;
        var b=classifyBand(T,R);
        var h_sa_b=enthalpy(b.sa_t, getW(b.sa_t,b.sa_rh));
        // B1-B10 + Dyn-Reset hybrid: Trim & Respond clamps the dyn-reset
        // target to \u00b1_TR_DH kJ/kg around h_sa_b.  When h_sa_dyn drifts
        // outside the envelope (e.g. 24-h mean lags a heat wave) the
        // controller falls back to the B1-B10 setpoint.  Without this
        // clamp `bandDyn` is mathematically identical to `dyn` and the
        // hybrid line collapses on top of Dyn-Reset.  Built on the
        // already-envelope-clamped h_sa_dyn so band+dyn is also
        // provably \u2265 Opt-SA.
        var h_sa_bd = Math.max(h_sa_b - _TR_DH,
                               Math.min(h_sa_b + _TR_DH, h_sa_dyn));
        // Opt-SA \u2014 true thermodynamic floor.  SA is whatever value
        // inside the [optMinH, optMaxH] envelope is closest to h_oa.
        var h_sa_opt = Math.max(optMinH, Math.min(optMaxH, h_oa));
        // Apples-to-apples damper assumption (request 2026-05-08 from
        // operator): real-world buildings minimize OA based on outdoor
        // conditions — they NEVER run 100% OA naively.  All five
        // strategies therefore share the same band-derived damper
        // schedule `damp`, so the visible gap between curves reflects
        // ONLY the quality of the SA setpoint-reset strategy.  Without
        // this normalization, B1-B10 strategies got a free 70-80% boost
        // from the damper alone, which made the "energy reduction"
        // numbers misleading.
        var damp = b.oa_damper/100;
        base[m]    += Math.abs(damp*(h_oa - _h_sa_u));      // Fixed-SA   + band damper
        dyn[m]     += Math.abs(damp*(h_oa - h_sa_dyn));     // Dyn-Reset  + band damper
        band[m]    += Math.abs(damp*(h_oa - h_sa_b));       // B1-B10
        bandDyn[m] += Math.abs(damp*(h_oa - h_sa_bd));      // B1-B10 + Dyn (TR-clamped)
        opt[m]     += Math.abs(damp*(h_oa - h_sa_opt));     // Opt-SA (clamped floor)
        oaSum[m]   += b.oa_damper; oaCnt[m]++;              // damper utilisation
        oaAnnSum   += b.oa_damper; oaAnnCnt++;
        bandCounts[b.id]=(bandCounts[b.id]||0)+1;
      }
      // Monthly mean OA damper % (0 when the month has no samples).
      var oaPct=new Float64Array(12);
      for(var mi=0;mi<12;mi++) oaPct[mi] = oaCnt[mi] ? (oaSum[mi]/oaCnt[mi]) : 0;
      d.base=base; d.dyn=dyn; d.band=band; d.bandDyn=bandDyn; d.opt=opt;
      d.oaPct=oaPct;
      d.oaAnnPct = oaAnnCnt ? (oaAnnSum/oaAnnCnt) : 0;
      d.optBounds = {min:optMinH, max:optMaxH};
      d.bandCounts=bandCounts;
      d.baseTotal=_sumArr(base); d.dynTotal=_sumArr(dyn);
      d.bandTotal=_sumArr(band); d.bandDynTotal=_sumArr(bandDyn);
      d.optTotal=_sumArr(opt);
    });
    var isLight=_p3Theme()==='light';
    var P = isLight
      ? {bg:'#e2e8f0', panel:'#f1f5f9', text:'#1e293b', textDim:'#475569', textMuted:'#64748b',
         frame:'#94a3b8', grid:'rgba(100,116,139,.25)',
         baseline:'#7c3aed', baselineEdge:'#4c1d95', savingTxt:'#64748b',
         /* 5-curve cumulative palette (monthly × sites). Picked so the two
            "fixed" strategies stay purple-family while the two band-driven
            strategies stay green→cyan; dashes disambiguate within family.
            Opt-SA shares purple family (theoretical floor of fixed family)
            with a lighter shade + dotted line. */
         cFixed:'#7c3aed', cDyn:'#a855f7', cBand:'#059669', cBandDyn:'#0891b2', cOpt:'#c084fc'}
      : {bg:'#020617', panel:'#0f172a', text:'#e2e8f0', textDim:'#cbd5e1', textMuted:'#94a3b8',
         frame:'#334155', grid:'rgba(148,163,184,.18)',
         baseline:'#a855f7', baselineEdge:'#7c3aed', savingTxt:'#94a3b8',
         cFixed:'#a855f7', cDyn:'#d8b4fe', cBand:'#10b981', cBandDyn:'#22d3ee', cOpt:'#f0abfc'};
    ctx.fillStyle=P.bg; ctx.fillRect(0,0,vw,vh);

    // Header \u2014 single-line compact title, centered over the chart area that's
    // visible when the config panel is open (panel occupies 0\u2013260 canvas px).
    // The longer caption (SA setpoint, data source) lives in the bottom legend
    // strip so the title never clips under the top-right button cluster
    // regardless of viewport width.
    // Header — the title used to live at the top of the canvas but the
    // Sites dropdown + 4 strategy toggles + Back buttons squeezed it out
    // of any safe centered band.  Title now prefixes the bottom legend
    // strip (rendered below) where it has breathing room and doesn't
    // collide with any control.  Nothing is drawn at the top.
    ctx.fillStyle=P.text;
    // Read SA slider so the bottom strip can label the baseline's SA values.
    var saT=parseFloat(($('#p3-sa-t')||{}).value)||13;
    var saRh=parseFloat(($('#p3-sa-rh')||{}).value)||50;

    // Loading / empty state
    var siteOrder = (_monthlySiteOrder && _monthlySiteOrder.length) ? _monthlySiteOrder : Object.keys(_monthlyCache);
    var allLoadedKeys=siteOrder.filter(function(k){return _monthlyCache[k];});
    /* Filter to only the user-selected sites for actual panel rendering.
       The chip ribbon at the top lets users add/remove sites from the
       comparison live; unselected sites still get their data fetched
       (so toggling them on is instant — no network round-trip). */
    var selSet = _monthlySelected || {};
    var keys = allLoadedKeys.filter(function(k){ return !!selSet[k]; });
    if(siteOrder.length===0){
      ctx.fillStyle=P.textDim; ctx.font='bold 14px monospace'; ctx.textAlign='center';
      ctx.fillText(_monthlyFetching?'Loading weather locations\u2026':'Click \u201cMonthly \u00d7 Sites\u201d to load data.',vw/2,vh/2);
      return;
    }

    /* ---- Sites checkbox dropdown ----
       Replaces the legacy in-canvas chip ribbon.  The renderer just keeps
       the trigger label / panel checkbox state in sync with the loaded set
       and current _monthlySelected map; the actual dropdown UI is HTML so
       it can scroll, support type-to-search, and not eat panel real estate. */
    _monthlyChipRects = {};
    if (typeof _refreshSitesDD === 'function') _refreshSitesDD();

    // If the user deselected everything, remind them.
    if (keys.length === 0) {
      ctx.fillStyle=P.textDim; ctx.font='bold 13px monospace'; ctx.textAlign='center';
      ctx.fillText('Open the Sites \u25BE menu above to pick one or more locations',vw/2,vh/2);
      return;
    }

    // Dynamic grid: scale columns/rows to fit the number of SELECTED sites.
    var nSites=keys.length;
    var cols, rows;
    if(nSites<=3){cols=nSites; rows=1;}
    else if(nSites<=6){cols=3; rows=2;}
    else if(nSites<=9){cols=3; rows=3;}
    else if(nSites<=12){cols=4; rows=3;}
    else {cols=4; rows=Math.ceil(nSites/4);}
    var gutter=12;
    /* Top padding clears the strategy toggle row at top:12.  No chip
       ribbon or canvas title to reserve space for anymore (title moved
       into the bottom legend strip). */
    var pLeft=18, pTop=40, pRight=10, pBottom=28;
    var cellW=(vw-pLeft-pRight-gutter*(cols-1))/cols;
    var cellH=(vh-pTop-pBottom-gutter*(rows-1))/rows;
    var months=['J','F','M','A','M','J','J','A','S','O','N','D'];

    /* Uniform Y axes across all visible panels so users can do honest
       cross-city comparison.  The frame of reference is the LARGEST value
       across the currently-visible sites + visible strategies, padded to
       a "nice" round number with a small headroom buffer so the tallest
       bar/curve never touches the panel top edge or the chip ribbon. */
    function _niceCeil(v){
      if (v<=0) return 1;
      var pow = Math.pow(10, Math.floor(Math.log10(v)));
      var n = v / pow;
      var step = n<=1.5 ? 1.5 : n<=2 ? 2 : n<=2.5 ? 2.5 : n<=5 ? 5 : 10;
      return step * pow;
    }
    var monthlyMax=0, cumMax=0;
    keys.forEach(function(k){
      var d=_monthlyCache[k]; if(!d||!d.base)return;
      for(var i=0;i<12;i++){
        if(_msShowFixed   && d.base[i]   >monthlyMax)monthlyMax=d.base[i];
        if(_msShowDyn     && d.dyn[i]    >monthlyMax)monthlyMax=d.dyn[i];
        if(_msShowBand    && d.band[i]   >monthlyMax)monthlyMax=d.band[i];
        if(_msShowBandDyn && d.bandDyn[i]>monthlyMax)monthlyMax=d.bandDyn[i];
        if(_msShowOpt     && d.opt && d.opt[i]>monthlyMax)monthlyMax=d.opt[i];
      }
      if(_msShowFixed   && d.baseTotal   >cumMax)cumMax=d.baseTotal;
      if(_msShowDyn     && d.dynTotal    >cumMax)cumMax=d.dynTotal;
      if(_msShowBand    && d.bandTotal   >cumMax)cumMax=d.bandTotal;
      if(_msShowBandDyn && d.bandDynTotal>cumMax)cumMax=d.bandDynTotal;
      if(_msShowOpt     && d.optTotal    >cumMax)cumMax=d.optTotal;
    });
    // Pad to nice round numbers + 8% headroom so tallest values clear panel edges.
    monthlyMax = _niceCeil(monthlyMax * 1.08);
    cumMax     = _niceCeil(cumMax     * 1.08);
    if(monthlyMax<1)monthlyMax=1;
    if(cumMax<1)cumMax=1;

    /* Iterate ONLY the visible (selected) sites — preserves declared
       site order (for stable layout) but hides everything the user
       hasn\u2019t toggled on. */
    keys.forEach(function(code,idx){
      var d=_monthlyCache[code];
      var col=idx%cols, row=Math.floor(idx/cols);
      var x0=pLeft+col*(cellW+gutter), y0=pTop+row*(cellH+gutter);
      // Cache rect so the overlay's click handler can resolve clicks\u2192code.
      _monthlyPanelRects[code] = {x:x0, y:y0, w:cellW, h:cellH};
      // panel
      ctx.fillStyle=P.panel; ctx.fillRect(x0,y0,cellW,cellH);
      // Saved-location panels get a subtle green accent border so the user
      // can tell their own hospitals apart from the preset reference sites.
      var isSaved = d && d.site && d.site.source==='saved';
      ctx.strokeStyle = isSaved ? '#10b981' : P.frame;
      ctx.lineWidth = isSaved ? 1.2 : .5;
      ctx.strokeRect(x0,y0,cellW,cellH);

      // Title
      ctx.fillStyle=P.text; ctx.font='bold 11px monospace'; ctx.textAlign='left';
      var nm = d ? (d.site.name+' ('+code+')') : code;
      // Build the annual OA-intake suffix when the OA toggle is on so
      // operators can see at a glance how much of each site's air is
      // outdoor-derived.  Lives inside the title row to avoid eating
      // plot real estate.
      var oaTitleSuffix = (_msShowOA && d && typeof d.oaAnnPct==='number')
        ? '   \u2022 Avg OA: '+d.oaAnnPct.toFixed(0)+'%'
        : '';
      if(isSaved){
        // tiny SAVED tag before the name
        ctx.fillStyle='#10b981'; ctx.font='bold 8px monospace';
        ctx.fillText('\u25C6 SAVED',x0+8,y0+15);
        ctx.fillStyle=P.text; ctx.font='bold 11px monospace';
        ctx.fillText(nm,x0+68,y0+15);
        if(oaTitleSuffix){
          ctx.fillStyle='#fbbf24'; ctx.font='bold 9px monospace';
          ctx.fillText(oaTitleSuffix, x0+68+ctx.measureText(nm).width, y0+15);
        }
      } else {
        ctx.fillText(nm,x0+8,y0+15);
        if(oaTitleSuffix){
          ctx.fillStyle='#fbbf24'; ctx.font='bold 9px monospace';
          ctx.fillText(oaTitleSuffix, x0+8+ctx.measureText(nm).width, y0+15);
        }
      }

      if(!d){
        ctx.fillStyle=P.textMuted; ctx.font='10px monospace'; ctx.textAlign='center';
        ctx.fillText('fetching\u2026',x0+cellW/2,y0+cellH/2);
        return;
      }
      if(d.error){
        ctx.fillStyle='#ef4444'; ctx.font='bold 10px monospace'; ctx.textAlign='center';
        ctx.fillText('\u26a0 '+d.error,x0+cellW/2,y0+cellH/2-8);
        ctx.fillStyle='#94a3b8'; ctx.font='9px monospace';
        ctx.fillText('(click panel to retry)',x0+cellW/2,y0+cellH/2+8);
        return;
      }

      // Plot area within cell — extra right margin so the cumulative axis
      // labels (e.g. "340k") have room outside the bar/curve plot region.
      var plotX=x0+44, plotY=y0+26;
      var plotW=cellW-92, plotH=cellH-56;

      // Dual gridlines: LEFT axis = monthly Σ|Δh| (kJ/kg/month) for the bars,
      // RIGHT axis = cumulative annual Σ|Δh| (kJ/kg) for the curves.  Five
      // grid steps so values divide cleanly.
      ctx.strokeStyle=P.grid; ctx.lineWidth=.5;
      for(var g=0;g<=4;g++){
        var gy=plotY+plotH-(g/4)*plotH;
        ctx.beginPath();ctx.moveTo(plotX,gy);ctx.lineTo(plotX+plotW,gy);ctx.stroke();
        // Left axis: monthly scale (purple-ish, matches bars)
        ctx.fillStyle=P.cFixed; ctx.font='9px monospace'; ctx.textAlign='right';
        ctx.fillText((monthlyMax*g/4/1000).toFixed(0)+'k', plotX-4, gy+3);
        // Right axis: cumulative scale (cyan-ish, matches curves)
        ctx.fillStyle=P.cBandDyn; ctx.textAlign='left';
        ctx.fillText((cumMax*g/4/1000).toFixed(0)+'k', plotX+plotW+4, gy+3);
      }
      // Tiny axis-unit captions
      ctx.fillStyle=P.cFixed; ctx.font='bold 7px monospace'; ctx.textAlign='right';
      ctx.fillText('mo', plotX-4, plotY-3);
      ctx.fillStyle=P.cBandDyn; ctx.textAlign='left';
      ctx.fillText('cum', plotX+plotW+4, plotY-3);

      // Build monthly arrays + cumulative arrays in lock-step.
      var cumBase=new Float64Array(13), cumDyn=new Float64Array(13),
          cumBand=new Float64Array(13), cumBandDyn=new Float64Array(13),
          cumOpt=new Float64Array(13);
      for(var mi=0;mi<12;mi++){
        cumBase[mi+1]    = cumBase[mi]    + d.base[mi];
        cumDyn[mi+1]     = cumDyn[mi]     + d.dyn[mi];
        cumBand[mi+1]    = cumBand[mi]    + d.band[mi];
        cumBandDyn[mi+1] = cumBandDyn[mi] + d.bandDyn[mi];
        cumOpt[mi+1]     = cumOpt[mi]     + (d.opt ? d.opt[mi] : 0);
      }

      // ----- Grouped monthly bars per month (left-axis scale) -----
      // 12 month columns, each split into N visible thin sub-bars where
      // N = number of strategy toggles currently ON (Fixed-SA always counts).
      // Bars share the cumulative-curve color palette so the user can map
      // bar colour → matching curve at a glance.
      var colW = plotW / 12;
      var groupW = colW * 0.78;        // total width consumed by the visible bars
      var groupL = colW * 0.11;        // left padding inside each month cell
      function _yBarTop(v){ return plotY + plotH - (v/monthlyMax)*plotH; }
      var SERIES = [
        {arr:d.base,    c:P.cFixed,    on:_msShowFixed  },
        {arr:d.dyn,     c:P.cDyn,      on:_msShowDyn    },
        {arr:d.band,    c:P.cBand,     on:_msShowBand   },
        {arr:d.bandDyn, c:P.cBandDyn,  on:_msShowBandDyn},
        {arr:d.opt,     c:P.cOpt,      on:_msShowOpt && !!d.opt}
      ];
      // Only allocate visible-bar slots.  When fewer strategies are toggled
      // on, the remaining bars get more horizontal real estate so each is
      // legible on its own.
      var nVis = SERIES.reduce(function(a,s){return a+(s.on?1:0);},0);
      var subW = (groupW - Math.max(0,nVis-1)) / Math.max(1,nVis);
      for(var m=0;m<12;m++){
        var bx0 = plotX + m*colW + groupL;
        var slot = 0;
        for(var s=0;s<SERIES.length;s++){
          if(!SERIES[s].on) continue;
          var v = SERIES[s].arr[m];
          var bx = bx0 + slot*(subW+1);
          var by = _yBarTop(v);
          ctx.fillStyle = SERIES[s].c;
          ctx.fillRect(bx, by, subW, (plotY+plotH)-by);
          slot++;
        }
      }

      // ----- 4 cumulative curves (right-axis scale) overlaid on the bars -----
      function _xAt(mIdx){ return plotX + (mIdx/12)*plotW; }
      function _yCum(v){   return plotY + plotH - (v/cumMax)*plotH; }
      function _drawCum(arr, color, lineW, dash){
        ctx.save();ctx.beginPath();ctx.rect(plotX,plotY,plotW,plotH);ctx.clip();
        ctx.strokeStyle=color; ctx.lineWidth=lineW;
        if(dash){ctx.setLineDash(dash);} else {ctx.setLineDash([]);}
        ctx.beginPath();
        for(var k=0;k<13;k++){
          var x=_xAt(k), y=_yCum(arr[k]);
          k?ctx.lineTo(x,y):ctx.moveTo(x,y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }
      // Order: worst→best so the best visible curve is on top.  Each curve
      // is independently gated on its toggle.
      if(_msShowFixed)   _drawCum(cumBase,    P.cFixed,   1.4, [5,3]);  // Fixed-SA (purple dashed)
      if(_msShowDyn)     _drawCum(cumDyn,     P.cDyn,     1.4, [2,3]);  // Dyn-Reset (lavender dotted)
      if(_msShowBand)    _drawCum(cumBand,    P.cBand,    1.6);         // B1-B10 (green solid)
      if(_msShowBandDyn) _drawCum(cumBandDyn, P.cBandDyn, 1.8);         // B1-B10 + Dyn-Reset (cyan thick)
      // Opt-SA (theoretical floor) drawn LAST so it sits on top, with a
      // distinct fine-dotted pattern + light purple to read clearly even
      // when overlapping the Dyn-Reset trace.
      if(_msShowOpt && d.opt) _drawCum(cumOpt, P.cOpt, 1.6, [1,2]);

      // X-axis month labels — centered under each month's bar group.
      ctx.fillStyle=P.textMuted; ctx.font='8px monospace'; ctx.textAlign='center';
      for(var m2=0;m2<12;m2++){
        var cx2=plotX+m2*colW+colW/2;
        ctx.fillText(months[m2],cx2,plotY+plotH+12);
      }

      // Season strip: a thin 5px colored band immediately below the X labels.
      // Adjacent identical seasons are drawn as a merged block so the eye
      // reads "one winter", "one spring"\u2026 rather than four separate wedges.
      var cal = _seasonCalFor(d.site.lat, d.site.lon);
      var stripY = plotY + plotH + 16;
      var stripH = 5;
      var runStart = 0;
      for(var m3=1;m3<=12;m3++){
        if(m3===12 || cal[m3]!==cal[m3-1]){
          var runCol = SEASON_COLOR[cal[m3-1]] || '#475569';
          var sx = plotX + runStart*colW;
          var sw = (m3 - runStart)*colW;
          ctx.fillStyle = runCol;
          ctx.fillRect(sx, stripY, sw, stripH);
          runStart = m3;
        }
      }
      // Subtle outline so the strip is legible on both themes
      ctx.strokeStyle = P.frame; ctx.lineWidth = .3;
      ctx.strokeRect(plotX, stripY, colW*12, stripH);

      /* ---- OA-intake visualisations (toggle: _msShowOA) ----
         Three coordinated cues so the operator can read OA-damper
         utilisation alongside the SA-strategy comparison:
           1. Translucent yellow line on the plot (right axis remapped
              0–100% damper) — shows monthly OA modulation curve.
           2. Below the season strip: a 12-cell band whose opacity
              scales with each month's mean damper %.
           3. Header annotation appended to the panel title:
              "Avg OA: 35%" (site-wide annual mean).
      */
      if (_msShowOA && d.oaPct){
        // (1) per-month damper line, clipped to plot rect.
        // Catmull-Rom smoothing through the 12 monthly midpoints so the
        // user reads it as a continuous "OA modulation rhythm" rather
        // than a 12-segment polyline.  Tension 0.5 keeps it close to
        // the data points without overshooting.  Duplicate first/last
        // points as control anchors so the spline meets month 1 and
        // month 12 cleanly.
        var oaPts = [];
        for (var oi=0; oi<12; oi++){
          oaPts.push({x: plotX + (oi + 0.5) * colW,
                      y: plotY + plotH - (d.oaPct[oi]/100) * plotH});
        }
        ctx.save();
        ctx.beginPath(); ctx.rect(plotX, plotY, plotW, plotH); ctx.clip();
        ctx.strokeStyle = 'rgba(251,191,36,.85)'; // amber-400 @ 85%
        ctx.lineWidth = 1.6;
        ctx.setLineDash([5,3]);
        ctx.beginPath();
        ctx.moveTo(oaPts[0].x, oaPts[0].y);
        for (var ci=0; ci<oaPts.length-1; ci++){
          var p0 = oaPts[Math.max(0, ci-1)];
          var p1 = oaPts[ci];
          var p2 = oaPts[ci+1];
          var p3 = oaPts[Math.min(oaPts.length-1, ci+2)];
          // Centripetal Catmull-Rom \u2192 cubic Bezier conversion.
          var cp1x = p1.x + (p2.x - p0.x) / 6;
          var cp1y = p1.y + (p2.y - p0.y) / 6;
          var cp2x = p2.x - (p3.x - p1.x) / 6;
          var cp2y = p2.y - (p3.y - p1.y) / 6;
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        // small dot markers per month so each datum is locatable on the
        // smoothed curve (Catmull-Rom passes through every control point
        // by construction, but the markers make it explicit).
        for (var oj=0; oj<12; oj++){
          ctx.fillStyle = 'rgba(251,191,36,.95)';
          ctx.beginPath(); ctx.arc(oaPts[oj].x, oaPts[oj].y, 1.6, 0, 6.283); ctx.fill();
        }
        ctx.restore();
        // (2) damper opacity strip directly below the season strip.
        var oaStripY = stripY + stripH + 1;
        var oaStripH = 4;
        for (var ok=0; ok<12; ok++){
          var op = Math.max(0.08, Math.min(1, d.oaPct[ok]/100));
          ctx.fillStyle = 'rgba(251,191,36,'+op.toFixed(2)+')';
          ctx.fillRect(plotX + ok*colW, oaStripY, colW, oaStripH);
        }
        ctx.strokeStyle = P.frame; ctx.lineWidth = .3;
        ctx.strokeRect(plotX, oaStripY, colW*12, oaStripH);
        // tiny "OA%" caption left of the strip
        ctx.fillStyle = 'rgba(251,191,36,.95)'; ctx.font='bold 7px monospace';
        ctx.textAlign='right';
        ctx.fillText('OA%', plotX-4, oaStripY+oaStripH-0.5);
        // (3) right-axis 0–100% caption (only when OA toggle on so the
        //     "100" doesn't crowd the cumulative axis labels).
        ctx.fillStyle='rgba(251,191,36,.85)'; ctx.font='bold 7px monospace';
        ctx.textAlign='left';
        ctx.fillText('OA% (0\u2013100)', plotX+plotW+4, plotY+plotH+10);
      }
      // Annual totals — the headline depends on what's currently visible:
      //   * Fixed-SA hidden → show the SMALLEST visible strategy's total.
      //   * Fixed-SA visible alone → just print "Fixed-SA Xk / yr".
      //   * Fixed-SA visible + at least one overlay → show best-visible vs
      //     Fixed-SA as a saving %.  Priority: band+dyn > band > dyn.
      //   * Nothing visible → empty headline.
      var bestTotal=null, bestLbl='';
      if(_msShowBandDyn)     { bestTotal=d.bandDynTotal; bestLbl='B1-B10+Dyn'; }
      else if(_msShowBand)   { bestTotal=d.bandTotal;    bestLbl='B1-B10';     }
      else if(_msShowDyn)    { bestTotal=d.dynTotal;     bestLbl='Dyn-Reset';  }
      ctx.fillStyle=P.text; ctx.font='bold 9px monospace'; ctx.textAlign='right';
      if(_msShowFixed && bestTotal!=null){
        var annPct=Math.max(0,Math.round((1-bestTotal/d.baseTotal)*100));
        ctx.fillText(
          bestLbl+' '+(bestTotal/1000).toFixed(1)+'k vs '+(d.baseTotal/1000).toFixed(1)+'k \u2192 -'+annPct+'%',
          x0+cellW-8, y0+15);
      } else if(_msShowFixed){
        ctx.fillText('Fixed-SA '+(d.baseTotal/1000).toFixed(1)+'k / yr', x0+cellW-8, y0+15);
      } else if(bestTotal!=null){
        ctx.fillText(bestLbl+' '+(bestTotal/1000).toFixed(1)+'k / yr', x0+cellW-8, y0+15);
      }
    });

    // Season palette legend + baseline/B1-B10/saved key \u2014 consolidated into
    // a single bottom row so nothing collides with the top-right action
    // buttons (Back to 3D, Show B1-B10 Strategy, Back to T\u00d7Time).
    var typesPresent={};
    siteOrder.forEach(function(code){
      var d=_monthlyCache[code]; if(!d||!d.site)return;
      typesPresent[_climateTypeFor(d.site.lat,d.site.lon)]=true;
    });
    var TYPE_LABEL = {north_4s:'Temperate N', south_4s:'Temperate S', tropical:'Tropical', arid:'Arid'};
    var TYPE_SEQ = {
      north_4s:  ['winter','spring','summer','fall'],
      south_4s:  ['summer','fall','winter','spring'],
      tropical:  ['ne_monsoon','inter1','sw_monsoon','inter2'],
      arid:      ['cool_season','transition','hot_season']
    };
    var klY = vh - 10;
    var klX = 20;
    /* Comfort-control caveat row.  When Fixed-SA or Dyn-Reset is visible
       (both lack any explicit humidity / latent control loop), drop a
       small amber caveat line above the bottom strip so operators don't
       interpret a low energy number as "best to deploy".  Real comfort
       requires latent control \u2014 missing in both flagged strategies. */
    if (_msShowFixed || _msShowDyn) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'left';
      var caveatLbls = [];
      if (_msShowFixed) caveatLbls.push('Fixed-SA');
      if (_msShowDyn)   caveatLbls.push('Dyn-Reset');
      var caveatTxt = '\u26A0 ' + caveatLbls.join(' + ') +
        ': no humidity (latent) control \u2014 may meet kJ/kg target ' +
        'while violating zone RH / comfort. NOT recommended for deployment.';
      ctx.fillText(caveatTxt, 20, klY - 14);
    }
    // Context preamble: title + SA baseline + data source (the title used
    // to be a separate top header but was squeezed out by the control
    // cluster; moved here where it has room).
    ctx.fillStyle=P.text; ctx.font='bold 10px monospace'; ctx.textAlign='left';
    var titleTxt='MONTHLY AIR-SIDE ENERGY \u00d7 SITES';
    ctx.fillText(titleTxt, klX, klY);
    klX += ctx.measureText(titleTxt).width + 10;
    ctx.fillStyle=P.textMuted; ctx.fillText('\u2502',klX,klY); klX += 8;
    ctx.fillStyle=P.textDim; ctx.font='9px monospace'; ctx.textAlign='left';
    var ctxNote='Baseline SA '+saT.toFixed(1)+'\u00b0C / '+saRh+'% \u2022 Open-Meteo, prev yr  \u2502';
    ctx.fillText(ctxNote, klX, klY);
    klX += ctx.measureText(ctxNote).width + 10;
    // 4-strategy key — one swatch + label per cumulative curve drawn in each
    // panel.  Uses the same colors and dash patterns the panels use so the
    // user can map legend → chart line at a glance.  Optional `capPct`
    // appends "(N% of Opt-SA captured)" — fraction of the Fixed-SA → Opt-SA
    // gap that this strategy actually realised.  Aggregated across all
    // currently-visible sites so the headline matches the panel grid.
    function _strategyKey(color, label, dash, capPct){
      ctx.strokeStyle=color; ctx.lineWidth=2.2;
      if(dash){ctx.setLineDash(dash);} else {ctx.setLineDash([]);}
      ctx.beginPath();ctx.moveTo(klX,klY-3);ctx.lineTo(klX+18,klY-3);ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle=P.text; ctx.font='bold 9px monospace'; ctx.textAlign='left';
      ctx.fillText(label, klX+22, klY);
      klX += 22 + ctx.measureText(label).width;
      if (capPct != null && isFinite(capPct)) {
        var capTxt = ' ('+Math.max(0,Math.min(100,Math.round(capPct)))+'% of Opt-SA captured)';
        ctx.fillStyle = P.textMuted; ctx.font='9px monospace';
        ctx.fillText(capTxt, klX, klY);
        klX += ctx.measureText(capTxt).width;
      }
      klX += 12;
    }
    // Aggregate totals across the currently-visible sites so the
    // "% of Opt-SA captured" denominator uses the same population as the
    // panel grid.
    var aggBase=0, aggDyn=0, aggBand=0, aggBandDyn=0, aggOpt=0;
    keys.forEach(function(code){
      var dd=_monthlyCache[code]; if(!dd||!dd.base)return;
      aggBase    += dd.baseTotal||0;
      aggDyn     += dd.dynTotal||0;
      aggBand    += dd.bandTotal||0;
      aggBandDyn += dd.bandDynTotal||0;
      aggOpt     += dd.optTotal||0;
    });
    function _capPct(stratTotal){
      var denom = aggBase - aggOpt;
      if (denom <= 0) return null;
      return ((aggBase - stratTotal) / denom) * 100;
    }
    if(_msShowFixed)   _strategyKey(P.cFixed,   'Fixed-SA + band damper \u26A0', [5,3], _msShowOpt ? _capPct(aggBase)    : null);
    if(_msShowDyn)     _strategyKey(P.cDyn,     'Dyn-Reset \u26A0',              [2,3], _msShowOpt ? _capPct(aggDyn)     : null);
    if(_msShowBand)    _strategyKey(P.cBand,    'B1-B10',                       null,  _msShowOpt ? _capPct(aggBand)    : null);
    if(_msShowBandDyn) _strategyKey(P.cBandDyn, 'B1-B10 + Dyn-Reset',           null,  _msShowOpt ? _capPct(aggBandDyn) : null);
    if(_msShowOpt)     _strategyKey(P.cOpt,     'Opt-SA cum',                   [1,2], _capPct(aggOpt));
    if(_msShowOA){
      // Yellow dashed line key matches the per-panel OA-damper line.
      ctx.strokeStyle='rgba(251,191,36,.95)'; ctx.lineWidth=2.2;
      ctx.setLineDash([4,2]);
      ctx.beginPath();ctx.moveTo(klX,klY-3);ctx.lineTo(klX+18,klY-3);ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle=P.text; ctx.font='bold 9px monospace';
      var oaLbl='OA Intake (band damper)';
      ctx.fillText(oaLbl, klX+22, klY);
      klX += 22 + ctx.measureText(oaLbl).width + 12;
    }
    ctx.fillStyle='#10b981'; ctx.font='bold 9px monospace';
    ctx.fillText('\u25C6=saved',klX,klY);
    klX += ctx.measureText('\u25C6=saved').width + 16;
    // divider pip
    ctx.fillStyle=P.textMuted; ctx.fillText('\u2502',klX,klY); klX += 8;
    Object.keys(TYPE_LABEL).forEach(function(t){
      if(!typesPresent[t])return;
      ctx.fillStyle = P.textDim; ctx.font='bold 9px monospace';
      ctx.fillText(TYPE_LABEL[t]+':', klX, klY);
      klX += ctx.measureText(TYPE_LABEL[t]+':').width + 6;
      TYPE_SEQ[t].forEach(function(k){
        ctx.fillStyle = SEASON_COLOR[k];
        ctx.fillRect(klX, klY-7, 9, 8);
        ctx.fillStyle = P.textDim; ctx.font='9px monospace';
        ctx.fillText(SEASON_LABEL[k], klX+12, klY);
        klX += 12 + ctx.measureText(SEASON_LABEL[k]).width + 6;
      });
      klX += 8;
    });
  }

  function render2DChart(){
    var overlay=$('#p3-overlay2d');
    var cv=$('#p3-cv2d');
    var dpr=Math.min(devicePixelRatio,2);
    cv.width=overlay.clientWidth*dpr;cv.height=overlay.clientHeight*dpr;
    var W=cv.width,H=cv.height;
    var ctx=cv.getContext('2d');ctx.scale(dpr,dpr);
    var vw=overlay.clientWidth,vh=overlay.clientHeight;

    // Time-series modes (T×Time, W×Time) render their own dedicated 2D layout
    // and exit early — they do not share the psychrometric grid.
    if(chart2DMode==='tt' || chart2DMode==='wt'){
      renderTimeSeries2D(ctx,vw,vh,chart2DMode);
      return;
    }
    if(chart2DMode==='monthly-sites'){
      renderMonthlySitesChart(ctx,vw,vh);
      return;
    }

    var pad={left:65,right:55,top:40,bottom:50};
    var pw=vw-pad.left-pad.right,ph=vh-pad.top-pad.bottom;
    function tx(t){return pad.left+(t-T_MIN)/(T_MAX-T_MIN)*pw;}
    function wy(w){return pad.top+ph-(w/W_MAX)*ph;}

    ctx.fillStyle='#020617';ctx.fillRect(0,0,vw,vh);

    ctx.save();ctx.beginPath();ctx.rect(pad.left,pad.top,pw,ph);ctx.clip();

    /* grid */
    ctx.strokeStyle='rgba(71,85,105,.3)';ctx.lineWidth=.5;
    for(var t=T_MIN;t<=T_MAX;t+=5){var x=tx(t);ctx.beginPath();ctx.moveTo(x,pad.top);ctx.lineTo(x,pad.top+ph);ctx.stroke();}
    for(var w=0;w<=W_MAX;w+=2){var y=wy(w);ctx.beginPath();ctx.moveTo(pad.left,y);ctx.lineTo(pad.left+pw,y);ctx.stroke();}

    /* enthalpy lines */
    ctx.strokeStyle='rgba(148,163,184,.1)';ctx.lineWidth=.6;
    for(var h=0;h<=140;h+=10){
      ctx.beginPath();var s=false;
      for(var t=T_MIN;t<=T_MAX;t+=.5){var wv=(h-1.006*t)/(2501+1.86*t);var wg=wv*1000;if(wg<0||wg>W_MAX)continue;s?ctx.lineTo(tx(t),wy(wg)):ctx.moveTo(tx(t),wy(wg));s=true;}
      ctx.stroke();
      var lt=T_MIN+2;var lw=(h-1.006*lt)/(2501+1.86*lt)*1000;
      if(lw>1&&lw<W_MAX-1){ctx.fillStyle='rgba(148,163,184,.25)';ctx.font='bold 8px monospace';ctx.save();ctx.translate(tx(lt),wy(lw));ctx.rotate(-Math.PI/4);ctx.fillText(h+' kJ/kg',0,0);ctx.restore();}
    }

    /* RH curves */
    for(var rh=10;rh<=100;rh+=10){
      ctx.beginPath();ctx.strokeStyle=rh===100?'rgba(96,165,250,.95)':'rgba(96,165,250,.25)';ctx.lineWidth=rh===100?2:0.8;
      var s=false;
      for(var t=T_MIN;t<=T_MAX;t+=.2){var wv=getW(t,rh)*1000;if(wv>W_MAX)break;s?ctx.lineTo(tx(t),wy(wv)):ctx.moveTo(tx(t),wy(wv));s=true;}
      ctx.stroke();
      var lt2=T_MAX-1;var lw2=getW(lt2,rh)*1000;
      if(lw2>0&&lw2<W_MAX-0.5){ctx.fillStyle=rh===100?'rgba(96,165,250,.8)':'rgba(96,165,250,.4)';ctx.font='bold 9px monospace';ctx.fillText(rh+'%',tx(lt2)+3,wy(lw2)+3);}
    }

    /* ---- OA Control Band Overlay (Section 10) ---- */
    function drawBand(tLo,tHi,rhLo,rhHi,fill,stroke,label,outputs){
      tLo=Math.max(tLo,T_MIN);tHi=Math.min(tHi,T_MAX);if(tLo>=tHi)return;
      ctx.beginPath();
      var step=0.5,first=true,t,w;
      /* bottom edge: follow rhLo from tLo to tHi */
      if(rhLo<=0){ctx.moveTo(tx(tLo),wy(0));ctx.lineTo(tx(tHi),wy(0));}
      else{for(t=tLo;t<=tHi;t+=step){w=Math.min(getW(t,rhLo)*1000,W_MAX);first?ctx.moveTo(tx(t),wy(w)):ctx.lineTo(tx(t),wy(w));first=false;}w=Math.min(getW(tHi,rhLo)*1000,W_MAX);ctx.lineTo(tx(tHi),wy(w));}
      /* right edge up to rhHi */
      ctx.lineTo(tx(tHi),wy(Math.min(getW(tHi,Math.min(rhHi,100))*1000,W_MAX)));
      /* top edge: follow rhHi from tHi back to tLo */
      var rTop=Math.min(rhHi,100);
      for(t=tHi;t>=tLo;t-=step){w=Math.min(getW(t,rTop)*1000,W_MAX);ctx.lineTo(tx(t),wy(w));}
      ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle='rgba(255,255,255,.45)';ctx.lineWidth=1.2;ctx.stroke();
      /* label + outputs */
      if(label){var mt=(tLo+tHi)/2,mr=(rhLo+rhHi)/2,mw=Math.min(getW(mt,mr)*1000,W_MAX-1);var lx=tx(mt),ly=wy(mw);ctx.fillStyle='rgba(255,255,255,.85)';ctx.font='900 14px monospace';ctx.textAlign='center';ctx.fillText(label,lx,ly+2);if(outputs){ctx.fillStyle='rgba(255,230,0,.95)';ctx.font='900 11px monospace';for(var oi=0;oi<outputs.length;oi++){ctx.fillText(outputs[oi],lx,ly+16+oi*13);}}ctx.textAlign='left';}
    }
    var bands=[
      [T_MIN,5,  0, 30, 'rgba(59,130,246,.12)', 'rgba(59,130,246,.4)',  'B1 COLD-DRY',    ['SA:20-22\u00b0C Damp:MIN','HC:ON  HUM:ON']],
      [5,    15, 30,60, 'rgba(6,182,212,.12)',  'rgba(6,182,212,.4)',   'B2 COLD-MOD',     ['SA:18-21\u00b0C Damp:MIN','HC:ON  HUM:cond']],
      [15,   20, 0, 30, 'rgba(20,184,166,.12)', 'rgba(20,184,166,.4)',  'B3 COOL-DRY',     ['SA:OA+1\u00b0C Damp:25%','HC:low HUM:ON']],
      [18,   22, 30,50, 'rgba(34,197,94,.12)',  'rgba(34,197,94,.4)',   'B4 ECON',          ['SA=OA  Damp:100%','ALL VALVES OFF']],
      [22,   25, 40,60, 'rgba(16,185,129,.15)', 'rgba(16,185,129,.5)',  'B5 COMFORT',       ['SA=OA  Damp:100%','PASS-THROUGH']],
      [25,   27, 50,70, 'rgba(234,179,8,.12)',  'rgba(234,179,8,.4)',   'B6 EDGE-HI',      ['SA:OA-1\u00b0C Damp:70\u2192MIN','CC:low OA-REDUCE']],
      [27,   32, 60,80, 'rgba(249,115,22,.12)', 'rgba(249,115,22,.4)',  'B7 WARM-HUM',     ['SA:12-24\u00b0C Damp:MIN','CC:subcool HC:reheat']],
      [32,   38, 70,100,'rgba(239,68,68,.12)',  'rgba(239,68,68,.4)',   'B8 HOT-HUM',      ['SA:13\u00b0C Damp:MIN','MAX CC + REHEAT']],
      [35,T_MAX, 0, 30, 'rgba(245,158,11,.12)', 'rgba(245,158,11,.4)', 'B9 HOT-DRY',      ['SA:15\u00b0C Damp:MIN','CC:ON  HC:OFF']],
      [30,T_MAX, 85,100,'rgba(168,85,247,.12)', 'rgba(168,85,247,.4)', 'B10 EXT-HUM',     ['SA:11\u00b0C Damp:MIN','DEEP SUBCOOL+RHT']]
    ];
    bands.forEach(function(b){drawBand(b[0],b[1],b[2],b[3],b[4],b[5],b[6],b[7]);});

    /* ---- Comfort Zone Overlay ---- */
    function drawZone(pts,fill,stroke,lw,label,lx,ly){
      ctx.beginPath();pts.forEach(function(p,i){i?ctx.lineTo(tx(p[0]),wy(p[1])):ctx.moveTo(tx(p[0]),wy(p[1]));});ctx.closePath();
      ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=stroke;ctx.lineWidth=lw||1;ctx.stroke();
      if(label){ctx.fillStyle=stroke;ctx.font='bold 9px monospace';ctx.fillText(label,tx(lx),wy(ly));}
    }
    function rhBnd(rh,tFrom,tTo,step){
      var a=[];step=step||0.5;
      if(tFrom<=tTo){for(var t=tFrom;t<=tTo;t+=step)a.push([t,getW(t,rh)*1000]);}
      else{for(var t=tFrom;t>=tTo;t-=step)a.push([t,getW(t,rh)*1000]);}
      return a;
    }
    var gCZ=rhBnd(80,20,25);gCZ.push([27,getW(27,50)*1000],[27,getW(27,20)*1000]);gCZ=gCZ.concat(rhBnd(20,27,20));
    drawZone(gCZ,'rgba(16,185,129,.10)','rgba(52,211,153,.6)',1.5,'ASHRAE Comfort Zone',21,getW(23,50)*1000+1);

    /* OA → SA projection (per-band strategy) — supports Lines (A), Landing Zones (B), VAV Delivery (C) */
    if(weatherData.length===0){
      /* Show prompt when no weather data loaded */
      ctx.fillStyle='rgba(251,191,36,.8)';ctx.font='bold 16px monospace';ctx.textAlign='center';
      ctx.fillText('No weather data loaded',vw/2,vh/2-10);
      ctx.fillStyle='rgba(148,163,184,.6)';ctx.font='bold 11px monospace';
      ctx.fillText('Click "Back to 3D" \u2192 "'+_t('fetch_weather_data')+'" to load',vw/2,vh/2+10);
    }
    if(weatherData.length>0){
      function computeSA(t,rh,w){
        var st,sw;
        if(t<5&&rh<30){st=Math.min(22,Math.max(20,20+(5-t)*.15));sw=getW(st,40);}
        else if(t>=5&&t<15&&rh>=30&&rh<=60){st=Math.min(21,Math.max(18,18+(15-t)*.3));sw=w<.004?getW(st,35):w;}
        else if(t>=15&&t<20&&rh<30){st=Math.min(21,Math.max(18.5,t+1));sw=getW(st,45);}
        else if(t>=18&&t<22&&rh>=30&&rh<=50){st=t;sw=w;}
        else if(t>=22&&t<=25&&rh>=40&&rh<=60){st=t;sw=w;}
        else if(t>25&&t<=27&&rh>=50&&rh<=70){st=Math.min(26,Math.max(23.5,t-1));sw=rh>65?getW(st,55):w;}
        else if(t>27&&t<=32&&rh>60&&rh<=80){st=12;sw=getW(12,95);}
        else if(t>32&&t<=38&&rh>70){st=13;sw=getW(13,95);}
        else if(t>35&&rh<30){st=15;sw=w<.004?getW(15,40):w;}
        else if(t>30&&rh>85){st=11;sw=getW(11,95);}
        else{var h=1.006*t+w*(2501+1.86*t);if(h<30){st=19;sw=getW(19,35);}else if(h<50){st=t;sw=w;}else if(h<65){st=Math.max(23.5,t-1);sw=getW(st,55);}else{st=13;sw=getW(13,95);}}
        /* saturation cap — SA humidity ratio cannot exceed saturation at SA temp */
        var wSat=getW(st,100);if(sw>wSat)sw=wSat*0.98;
        return{t:st,w:sw};
      }
      function bandCol(t,rh,alpha){
        var a=alpha||.35;
        if(t<5&&rh<30)return'rgba(59,130,246,'+a+')';
        if(t>=5&&t<15&&rh>=30&&rh<=60)return'rgba(6,182,212,'+a+')';
        if(t>=15&&t<20&&rh<30)return'rgba(20,184,166,'+a+')';
        if(t>=18&&t<22&&rh>=30&&rh<=50)return'rgba(34,197,94,'+a+')';
        if(t>=22&&t<=25&&rh>=40&&rh<=60)return'rgba(16,185,129,'+a+')';
        if(t>25&&t<=27&&rh>=50&&rh<=70)return'rgba(234,179,8,'+a+')';
        if(t>27&&t<=32&&rh>60&&rh<=80)return'rgba(249,115,22,'+a+')';
        if(t>32&&t<=38&&rh>70)return'rgba(239,68,68,'+a+')';
        if(t>35&&rh<30)return'rgba(245,158,11,'+a+')';
        if(t>30&&rh>85)return'rgba(168,85,247,'+a+')';
        return'rgba(148,163,184,'+(.15)+')';
      }
      function bandLabel(t,rh){
        if(t<5&&rh<30)return'B1';if(t>=5&&t<15&&rh>=30&&rh<=60)return'B2';
        if(t>=15&&t<20&&rh<30)return'B3';if(t>=18&&t<22&&rh>=30&&rh<=50)return'B4';
        if(t>=22&&t<=25&&rh>=40&&rh<=60)return'B5';if(t>25&&t<=27&&rh>=50&&rh<=70)return'B6';
        if(t>27&&t<=32&&rh>60&&rh<=80)return'B7';if(t>32&&t<=38&&rh>70)return'B8';
        if(t>35&&rh<30)return'B9';if(t>30&&rh>85)return'B10';return'?';
      }

      if(projMode==='vav'){
        /* Option C: VAV Zone Delivery — project SA through 6 VAV zones */
        var NUM_VAV=6;
        var vavHG=[],vavMG=[];
        for(var vi=0;vi<NUM_VAV;vi++){vavHG.push(2.5+(vi-2.5)*0.4);vavMG.push(0.0008+(vi-2.5)*0.0001);}
        var vavClusters={};var czIn=0,czOut=0;
        weatherData.forEach(function(p){
          var wg=p.w*1000;if(wg>W_MAX)return;
          var sa=computeSA(p.t,p.rh,p.w);
          if(Math.abs(sa.t-p.t)<0.5&&Math.abs(sa.w-p.w)<0.0003)return;
          var bl=bandLabel(p.t,p.rh);
          if(!vavClusters[bl])vavClusters[bl]={pts:[],col:bandCol(p.t,p.rh,.6),colSolid:bandCol(p.t,p.rh,.9),inCZ:0,outCZ:0};
          for(var vi=0;vi<NUM_VAV;vi++){
            var zt=sa.t+vavHG[vi], zw=sa.w+vavMG[vi];
            var zwg=zw*1000;if(zwg>W_MAX)zwg=W_MAX;
            var inCZ=(zt>=20&&zt<=27&&zw>=getW(zt,20)&&zw<=getW(zt,80));
            if(inCZ){vavClusters[bl].inCZ++;czIn++;}else{vavClusters[bl].outCZ++;czOut++;}
            vavClusters[bl].pts.push({t:zt,w:zwg,inCZ:inCZ});
          }
        });
        /* draw CZ boundary prominently */
        ctx.save();ctx.strokeStyle='rgba(52,211,153,.8)';ctx.lineWidth=2;ctx.setLineDash([6,3]);
        ctx.beginPath();
        var czStep=0.5;
        for(var ct=20;ct<=27;ct+=czStep){var cw=getW(ct,80)*1000;ct===20?ctx.moveTo(tx(ct),wy(cw)):ctx.lineTo(tx(ct),wy(cw));}
        ctx.lineTo(tx(27),wy(getW(27,20)*1000));
        for(var ct=27;ct>=20;ct-=czStep){ctx.lineTo(tx(ct),wy(getW(ct,20)*1000));}
        ctx.closePath();ctx.stroke();ctx.setLineDash([]);ctx.restore();
        /* draw VAV zone delivery dots */
        Object.keys(vavClusters).forEach(function(bl){
          var cl=vavClusters[bl];
          cl.pts.forEach(function(pt){
            ctx.fillStyle=pt.inCZ?cl.colSolid:'rgba(239,68,68,.5)';
            ctx.beginPath();ctx.arc(tx(pt.t),wy(pt.w),pt.inCZ?2.2:1.5,0,Math.PI*2);ctx.fill();
          });
        });
        /* cluster labels with CZ stats */
        ctx.font='900 9px monospace';ctx.textAlign='center';
        Object.keys(vavClusters).forEach(function(bl){
          var cl=vavClusters[bl],sumT=0,sumW=0,n=cl.pts.length;
          if(n===0)return;
          cl.pts.forEach(function(pt){sumT+=pt.t;sumW+=pt.w;});
          var lx=tx(sumT/n),ly=wy(sumW/n);
          ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(lx-22,ly-20,44,18);
          ctx.fillStyle=cl.colSolid;ctx.fillText(bl,lx,ly-12);
          var pct=n>0?Math.round(cl.inCZ/n*100):0;
          ctx.fillStyle=pct>70?'rgba(52,211,153,.9)':'rgba(239,68,68,.9)';
          ctx.fillText(pct+'% CZ',lx,ly-4);
        });
        /* totals label */
        ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(pad.left+4,pad.top+4,180,18);
        ctx.fillStyle='#a78bfa';ctx.font='900 10px monospace';ctx.textAlign='left';
        var totalPct=(czIn+czOut)>0?Math.round(czIn/(czIn+czOut)*100):0;
        ctx.fillText('VAV ZONES: '+totalPct+'% IN CZ ('+czIn+'/'+(czIn+czOut)+')',pad.left+8,pad.top+16);

      } else if(projMode==='dots'){
        /* Option B: SA Landing Zone scatter */
        var saClusters={};
        weatherData.forEach(function(p){
          var wg=p.w*1000;if(wg>W_MAX)return;
          var sa=computeSA(p.t,p.rh,p.w);var swg=Math.min(sa.w*1000,W_MAX);
          if(Math.abs(sa.t-p.t)<0.5&&Math.abs(swg-wg)<0.3)return;
          var bl=bandLabel(p.t,p.rh);
          if(!saClusters[bl])saClusters[bl]={pts:[],col:bandCol(p.t,p.rh,.7),colSolid:bandCol(p.t,p.rh,.95)};
          saClusters[bl].pts.push({t:sa.t,w:swg});
        });
        Object.keys(saClusters).forEach(function(bl){
          var cl=saClusters[bl];
          ctx.fillStyle=cl.col;
          cl.pts.forEach(function(pt){ctx.beginPath();ctx.arc(tx(pt.t),wy(pt.w),4,0,Math.PI*2);ctx.fill();});
          ctx.fillStyle=cl.colSolid;
          cl.pts.forEach(function(pt){ctx.beginPath();ctx.arc(tx(pt.t),wy(pt.w),2,0,Math.PI*2);ctx.fill();});
        });
        ctx.font='900 10px monospace';ctx.textAlign='center';
        Object.keys(saClusters).forEach(function(bl){
          var cl=saClusters[bl],sumT=0,sumW=0,n=cl.pts.length;
          cl.pts.forEach(function(pt){sumT+=pt.t;sumW+=pt.w;});
          var cx=tx(sumT/n),cy=wy(sumW/n);
          ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(cx-14,cy-18,28,14);
          ctx.fillStyle=cl.colSolid;ctx.fillText(bl+' ('+n+')',cx,cy-8);
        });
      } else {
        /* Option A: OA → SA projection lines */
        ctx.lineWidth=0.6;
        weatherData.forEach(function(p){
          var wg=p.w*1000;if(wg>W_MAX)return;
          var sa=computeSA(p.t,p.rh,p.w);var swg=Math.min(sa.w*1000,W_MAX);
          if(Math.abs(sa.t-p.t)<0.5&&Math.abs(swg-wg)<0.3)return;
          ctx.strokeStyle=bandCol(p.t,p.rh);
          ctx.beginPath();ctx.moveTo(tx(p.t),wy(wg));ctx.lineTo(tx(sa.t),wy(swg));ctx.stroke();
        });
      }
    }

    /* weather data points */
    if(weatherData.length>0){
      ctx.globalAlpha=.7;
      weatherData.forEach(function(p){
        var wg=p.w*1000;if(wg>W_MAX)return;
        var c=t2rgb(p.t);
        ctx.fillStyle='rgb('+Math.round(c[0]*255)+','+Math.round(c[1]*255)+','+Math.round(c[2]*255)+')';
        ctx.beginPath();ctx.arc(tx(p.t),wy(wg),1.8,0,Math.PI*2);ctx.fill();
      });
      ctx.globalAlpha=1;
    }

    ctx.restore();

    /* axes */
    ctx.strokeStyle='#64748b';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(pad.left,pad.top);ctx.lineTo(pad.left,pad.top+ph);ctx.lineTo(pad.left+pw,pad.top+ph);ctx.stroke();
    ctx.beginPath();ctx.moveTo(pad.left+pw,pad.top);ctx.lineTo(pad.left+pw,pad.top+ph);ctx.stroke();

    /* T labels */
    ctx.fillStyle='#94a3b8';ctx.font='bold 10px monospace';ctx.textAlign='center';
    for(var t=T_MIN;t<=T_MAX;t+=5){ctx.fillText(t+'\u00b0C',tx(t),pad.top+ph+14);}
    /* W labels */
    ctx.textAlign='left';
    for(var w=0;w<=W_MAX;w+=2){ctx.fillText(w,pad.left+pw+6,wy(w)+3);}

    /* axis titles */
    ctx.fillStyle='#60a5fa';ctx.font='bold 11px monospace';ctx.textAlign='center';
    ctx.fillText(_t('dry_bulb_temp').toUpperCase()+' (\u00b0C)',pad.left+pw/2,pad.top+ph+35);
    ctx.save();ctx.translate(pad.left+pw+42,pad.top+ph/2);ctx.rotate(-Math.PI/2);ctx.fillText(_t('humidity_ratio').toUpperCase()+' (g/kg)',0,0);ctx.restore();

    /* title + location */
    ctx.fillStyle='#60a5fa';ctx.font='bold 13px monospace';ctx.textAlign='left';
    ctx.fillText(_t('psychrometric_chart').toUpperCase()+' \u2014 WEATHER STRIP',pad.left,pad.top-18);
    var locName=$('#p3-name').value||'';
    var fromD=$('#p3-from').value||'';
    var toD=$('#p3-to').value||'';
    ctx.fillStyle='#f472b6';ctx.font='bold 10px monospace';
    ctx.fillText(locName+' ('+fromD+' \u2192 '+toD+') \u2014 '+weatherData.length+' points',pad.left,pad.top-6);

    /* temperature legend bar */
    var bx=pad.left+pw-180,by=pad.top+10,bw=150,bh=10;
    for(var i=0;i<bw;i++){var tn=T_MIN+(i/bw)*(T_MAX-T_MIN);var c=t2rgb(tn);ctx.fillStyle='rgb('+Math.round(c[0]*255)+','+Math.round(c[1]*255)+','+Math.round(c[2]*255)+')';ctx.fillRect(bx+i,by,1,bh);}
    ctx.strokeStyle='#334155';ctx.strokeRect(bx,by,bw,bh);
    ctx.fillStyle='#94a3b8';ctx.font='bold 8px monospace';ctx.textAlign='left';ctx.fillText(T_MIN+'\u00b0',bx,by+bh+10);ctx.textAlign='right';ctx.fillText(T_MAX+'\u00b0',bx+bw,by+bh+10);ctx.textAlign='center';ctx.fillText('TEMP SCALE',bx+bw/2,by-3);
  }

  /* ---------- RENDER LOOP ---------- */
  function startRender(){
    if (_running) return; // idempotent — avoid double-loops after a hot edit
    _running = true;
    (function tick(){
      if (!_running || _disposed) return;
      _rafId = requestAnimationFrame(tick);
      // Skip the heavy render+orbit work when the engine's container is
      // display:none (e.g., user switched to another dashboard tab).  We
      // keep the rAF loop alive so the engine resumes cleanly on return,
      // but avoid burning GPU/CPU on a frame nobody can see.  offsetParent
      // is null whenever any ancestor (or the element itself) has
      // display:none — cheap, no layout flush.
      var rootEl = document.getElementById('p3-root');
      if (rootEl && rootEl.offsetParent === null) return;
      if(spinning){var t=Date.now()*.00025;cam.position.x=SX/2+300*Math.cos(t);cam.position.z=SZ/2+300*Math.sin(t);cam.position.y=200;orb.target.set(SX/2,SY/3,SZ/2);}
      orb.update();ren.render(scene,cam);
    })();
  }

  /* ---------- DISPOSE -----------------------------------------------
     MUST be called by the host component when the 3D engine is
     unmounted (e.g. React useEffect cleanup when the 3D WX tab is
     hidden).  Without this every re-mount leaks a WebGL context; Mac
     Safari caps at ~8 and Chrome at ~16, so after a handful of tab
     switches new contexts fail with "Error creating WebGL context" and
     the whole React tree crashes.                                     */
  function _disposeEngine(){
    if (_disposed) return;
    _disposed = true;
    _running  = false;
    if (_rafId) { try { cancelAnimationFrame(_rafId); } catch(e){} _rafId = 0; }
    // Release the page-wide one-context guard so a future initPsy3D() call
    // (e.g. host explicitly tearing down + recreating) is allowed.
    try {
      window.__psy3dActive = false;
      if (container) { container.removeAttribute('data-psy3d-built'); container.__psy3dHandle = null; }
    } catch(e){}
    // User-registered cleanup tasks (event listeners, observers, timers).
    while (_cleanupTasks.length) {
      var fn = _cleanupTasks.pop();
      try { fn(); } catch(e){}
    }
    // Dispose every geometry / material / texture in the scene graph so
    // GPU memory is reclaimed immediately (don't wait for GC).
    if (scene) {
      try {
        scene.traverse(function(obj){
          if (obj.geometry && typeof obj.geometry.dispose === 'function') obj.geometry.dispose();
          if (obj.material) {
            var mats = Array.isArray(obj.material) ? obj.material : [obj.material];
            mats.forEach(function(m){
              if (!m) return;
              ['map','normalMap','emissiveMap','specularMap','envMap','alphaMap'].forEach(function(k){
                if (m[k] && typeof m[k].dispose === 'function') { try { m[k].dispose(); } catch(e){} }
              });
              if (typeof m.dispose === 'function') { try { m.dispose(); } catch(e){} }
            });
          }
        });
      } catch(e){}
    }
    // Free the WebGL context + drop the canvas from DOM.  forceContextLoss()
    // tells the browser "release this context NOW" so the next initPsy3D
    // call doesn't trip the per-page context cap.
    if (ren) {
      try { if (ren.forceContextLoss) ren.forceContextLoss(); } catch(e){}
      try { ren.dispose(); } catch(e){}
      try {
        if (ren.domElement && ren.domElement.parentNode) {
          ren.domElement.parentNode.removeChild(ren.domElement);
        }
      } catch(e){}
    }
    // Drop big top-level globals so GC can reclaim the scene graph.
    scene = cam = ren = orb = basePlane = null;
    pathGroup = projGroup = czGroup = dhFloorGroup = vavGroup = null;
    // Detach any overlay we appended directly into #p3-root (e.g. the
    // chart overlay is created inline via innerHTML=...; drop it along
    // with the control cluster so a re-mount starts clean).
    try {
      var root = document.getElementById('p3-root');
      if (root && root.parentNode) root.parentNode.removeChild(root);
    } catch(e){}
  }

  // Expose dispose to the caller (host component's cleanup).  Also
  // stash on the container so the double-init guard at the top can
  // return the same handle on a second call instead of throwing.
  var _handle = { dispose: _disposeEngine, build: BUILD_TAG };
  container.__psy3dHandle = _handle;
  return _handle;

};
})(window);
