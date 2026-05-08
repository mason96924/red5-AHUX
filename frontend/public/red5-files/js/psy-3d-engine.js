(function(global){
'use strict';

/* ================================================================
   initPsy3D(container, opts)
   Mounts the 3D psychrometric weather strip into any DOM element.
   opts.weatherLocation = {lat,lon,name} (optional, from dashboard localStorage)
   ================================================================ */
global.initPsy3D = function(container, opts){
  opts = opts || {};

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
#p3-hud{position:absolute;top:10px;left:220px;z-index:10;pointer-events:none}\
#p3-hud h1{font-size:12px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:#60a5fa}\
#p3-loc{font-size:9px;color:#f472b6;font-weight:900;letter-spacing:.08em;margin-top:2px}\
#p3-panel{position:absolute;top:8px;left:8px;z-index:12;width:200px;background:rgba(15,23,42,.94);border:1px solid #334155;border-radius:7px;backdrop-filter:blur(14px);font-size:9px;overflow:hidden}\
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
<div id="p3-overlay2d"><canvas id="p3-cv2d"></canvas><button id="p3-btn-back3d">Back to 3D</button><button id="p3-btn-proj-mode">Mode: OA\u2192SA Lines</button><div id="p3-tip2d"></div></div>\
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
    var t = _p3Theme();
    if (t !== _p3LastTheme) { _p3LastTheme = t; _p3ThemeListener({key:'red5.theme'}); }
  }, 500);

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
  var spinning=false,panelOpen=true;
  var W3,H3;

  function buildScene(){
    var THREE=window.THREE;
    W3=root.clientWidth;H3=root.clientHeight;
    scene=new THREE.Scene();scene.background=new THREE.Color(_p3Theme() === 'light' ? P3_LIGHT_BG : P3_DARK_BG);
    cam=new THREE.PerspectiveCamera(45,W3/H3,.1,3000);cam.position.set(320,220,300);
    ren=new THREE.WebGLRenderer({antialias:true});ren.setSize(W3,H3);ren.setPixelRatio(Math.min(devicePixelRatio,2));
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

    /* Update ΔH on slider change */
    $('#p3-sa-t').oninput=function(){$('#p3-sa-t-val').textContent=this.value;if(weatherData.length>0){buildDeltaH();buildVAVScatter();}};
    $('#p3-sa-rh').oninput=function(){$('#p3-sa-rh-val').textContent=this.value;if(weatherData.length>0){buildDeltaH();buildVAVScatter();}};
    $('#p3-occ').onchange=function(){if(weatherData.length>0){buildDeltaH();buildVAVScatter();}};

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
        var tgt=new THREE.Vector3(SX/2,SY/3,SZ/2);
        if(c[0]==='iso')cam.position.set(320,220,300);
        else if(c[0]==='top'){cam.position.set(SX/2,480,SZ/2);tgt.set(SX/2,0,SZ/2);}
        else if(c[0]==='front'){cam.position.set(SX/2,SY/2,360);tgt.set(SX/2,SY/2,0);}
        else if(c[0]==='side'){cam.position.set(380,SY/2,SZ/2);tgt.set(0,SY/2,SZ/2);}
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
      $('#p3-overlay2d').style.display='block';
      render2DChart();
    };
    ctrlEl.appendChild(b2d);

    /* Back to 3D button */
    $('#p3-btn-back3d').onclick=function(){$('#p3-overlay2d').style.display='none';$('#p3-tip2d').style.display='none';};

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
    var ro=new ResizeObserver(function(){W3=root.clientWidth;H3=root.clientHeight;if(W3>0&&H3>0){cam.aspect=W3/H3;cam.updateProjectionMatrix();ren.setSize(W3,H3);}});
    ro.observe(root);
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

    function dh2rgb(dh){var n=dh/dhScale;if(n>0)return[.3+n*.7,.3*(1-n),.1*(1-n)];else{var a=-n;return[.1*(1-a),.3*(1-a),.3+a*.7];}}
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

    /* labels */
    var lCool=mkTl('COOLING (+\u0394H)','#ef4444',14);lCool.position.set(-18,dh2y(dhScale*.6),wallZ);dhFloorGroup.add(lCool);
    var lHeat=mkTl('HEATING (-\u0394H)','#3b82f6',14);lHeat.position.set(-18,dh2y(-dhScale*.6),wallZ);dhFloorGroup.add(lHeat);
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
    var cumMax=Math.max(cH,cC,1);
    function cum2y(c){return c/cumMax*SY*0.9+SY*0.03;}

    /* Heating cumulative (blue) */
    var hV=[];weatherData.forEach(function(p,i){hV.push(p.frac*SX,cum2y(cumHeat[i]),wallZ-0.5);});
    var hGeo=new THREE.BufferGeometry();hGeo.setAttribute('position',new THREE.Float32BufferAttribute(hV,3));
    dhFloorGroup.add(new THREE.Line(hGeo,new THREE.LineBasicMaterial({color:0x3b82f6,transparent:true,opacity:.8})));

    /* Cooling cumulative (red) */
    var cV=[];weatherData.forEach(function(p,i){cV.push(p.frac*SX,cum2y(cumCool[i]),wallZ-0.5);});
    var cGeo=new THREE.BufferGeometry();cGeo.setAttribute('position',new THREE.Float32BufferAttribute(cV,3));
    dhFloorGroup.add(new THREE.Line(cGeo,new THREE.LineBasicMaterial({color:0xef4444,transparent:true,opacity:.8})));

    /* right-side scale */
    [0,.25,.5,.75,1].forEach(function(f){
      var val=Math.round(cumMax*f);var y=cum2y(val);
      dhFloorGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(SX-4,y,wallZ),new THREE.Vector3(SX+4,y,wallZ)]),new THREE.LineBasicMaterial({color:0x94a3b8,transparent:true,opacity:.2})));
      var lb=mkTl(val>=1000?(val/1000).toFixed(0)+'k':val+'','#94a3b8',7);lb.position.set(SX+14,y,wallZ);dhFloorGroup.add(lb);
    });

    /* endpoint totals */
    var lHtot=mkTl('Heat: '+(cH>=1000?(cH/1000).toFixed(1)+'k':Math.round(cH))+' kJ/kg','#3b82f6',10);lHtot.position.set(SX+14,cum2y(cH),wallZ);dhFloorGroup.add(lHtot);
    var lCtot=mkTl('Cool: '+(cC>=1000?(cC/1000).toFixed(1)+'k':Math.round(cC))+' kJ/kg','#ef4444',10);lCtot.position.set(SX+14,cum2y(cC),wallZ);dhFloorGroup.add(lCtot);
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
        var a=0.4+dist*0.6;
        r=0.15*(1-a);g=0.3*(1-a);b=0.3+a*0.7;
      }else{
        status='right'; nR++;
        var dist2=Math.min((dh-COMFORT_DH)/(span-COMFORT_DH),1);
        z=SZ*0.03+(1-dist2)*SZ*0.27+jit*SZ*0.04-SZ*0.02;
        z=Math.max(SZ*0.02,Math.min(SZ*0.32,z));
        var a2=0.4+dist2*0.6;
        r=0.3+a2*0.7;g=0.15*(1-a2);b=0.1*(1-a2);
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

    /* cold band (blue translucent) */
    var bLV=[wallX,0,SZ*0.665, wallX,0,SZ, wallX,SY,SZ, wallX,0,SZ*0.665, wallX,SY,SZ, wallX,SY,SZ*0.665];
    var bLGeo=new THREE.BufferGeometry();bLGeo.setAttribute('position',new THREE.Float32BufferAttribute(bLV,3));
    vavGroup.add(new THREE.Mesh(bLGeo,new THREE.MeshBasicMaterial({color:0x3b82f6,transparent:true,opacity:.04,side:THREE.DoubleSide,depthWrite:false})));

    /* hot band (red translucent) */
    var bRV=[wallX,0,0, wallX,0,SZ*0.335, wallX,SY,SZ*0.335, wallX,0,0, wallX,SY,SZ*0.335, wallX,SY,0];
    var bRGeo=new THREE.BufferGeometry();bRGeo.setAttribute('position',new THREE.Float32BufferAttribute(bRV,3));
    vavGroup.add(new THREE.Mesh(bRGeo,new THREE.MeshBasicMaterial({color:0xef4444,transparent:true,opacity:.04,side:THREE.DoubleSide,depthWrite:false})));

    /* labels */
    var lTitle=mkTl('VAV CZ STATUS','#a78bfa',14);lTitle.position.set(wallX-2,SY+14,SZ/2);vavGroup.add(lTitle);
    var lL=mkTl('COLD','#3b82f6',11);lL.position.set(wallX-2,SY+4,SZ*0.83);vavGroup.add(lL);
    var lIn=mkTl('IN CZ','#10b981',11);lIn.position.set(wallX-2,SY+4,SZ*0.5);vavGroup.add(lIn);
    var lR=mkTl('HOT','#ef4444',11);lR.position.set(wallX-2,SY+4,SZ*0.17);vavGroup.add(lR);

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
  function render2DChart(){
    var overlay=$('#p3-overlay2d');
    var cv=$('#p3-cv2d');
    var dpr=Math.min(devicePixelRatio,2);
    cv.width=overlay.clientWidth*dpr;cv.height=overlay.clientHeight*dpr;
    var W=cv.width,H=cv.height;
    var ctx=cv.getContext('2d');ctx.scale(dpr,dpr);
    var vw=overlay.clientWidth,vh=overlay.clientHeight;

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
    (function tick(){
      requestAnimationFrame(tick);
      if(spinning){var t=Date.now()*.00025;cam.position.x=SX/2+300*Math.cos(t);cam.position.z=SZ/2+300*Math.sin(t);cam.position.y=200;orb.target.set(SX/2,SY/3,SZ/2);}
      orb.update();ren.render(scene,cam);
    })();
  }

};
})(window);
