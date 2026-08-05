(function(global){
'use strict';

/* ----------------------------------------------------------------
   Weather URL helper.  On some Korean home networks the browser can
   no longer reach archive-api.open-meteo.com directly (HTTPS reset
   by ISP middlebox), but the Flask/FastAPI backend on the same LAN
   can still reach it via Python urllib / httpx.  When the page is
   served by the controller, we route the fetch through
   /api/weather-proxy which also adds NASA POWER as a final fallback.
   On static-hosted pages (no backend), `useProxy` is false and the
   call goes direct to open-meteo as before. */
var __psy3d_useProxy = (function(){
  try {
    var loc = (typeof global !== 'undefined' && global.location) ? global.location : null;
    if (!loc) return false;
    // Only use the proxy when the page is served from a real HTTP origin
    // (not file://, not chrome-extension://, etc.).
    return loc.protocol === 'http:' || loc.protocol === 'https:';
  } catch(e) { return false; }
})();
function __psy3d_archiveUrl(lat, lon, fromD, toD) {
  var params = 'latitude=' + lat + '&longitude=' + lon +
               '&start_date=' + fromD + '&end_date=' + toD +
               '&hourly=temperature_2m,relative_humidity_2m&timezone=auto';
  if (__psy3d_useProxy) return '/api/weather-proxy?' + params;
  return 'https://archive-api.open-meteo.com/v1/archive?' + params;
}

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

  /* ---------- DESIGNER MODE (MEP equipment-sizing overlay) ----------
     Persisted-state inputs for the Designer-Mode psychrometric overlay,
     hoisted to module scope so render2DChart can reach them without going
     through closures.  Defaults are realistic Korean-climate summer-design
     numbers a junior MEP engineer would pull off Ch. 14 of the ASHRAE
     Fundamentals handbook before doing any selection work. */
  var _designerMode    = false;
  var _designerCFM     = 10000;   /* SA volumetric flow, ft^3/min */
  var _designerOAFrac  = 0.20;    /* fraction of OA in mixed air (0..1) */
  var _designerOA_T    = 35.0;    /* OA dry-bulb, degC (typical 1% summer) */
  var _designerOA_RH   = 50.0;    /* OA relative humidity, % */
  var _designerRA_T    = 24.0;    /* RA dry-bulb, degC (occupied setpoint) */
  var _designerRA_RH   = 50.0;    /* RA relative humidity, % */
  var _designerSA_T    = 13.0;    /* SA dry-bulb, degC (cooling coil leaving) */
  var _designerSA_RH   = 95.0;    /* SA relative humidity, % (near saturation) */
  /* ERV (Energy Recovery Ventilator) — desiccant wheel or membrane-plate
     heat-and-moisture exchanger between OA intake and EA exhaust.  When
     ON, draws OA' (pre-conditioned OA) on the OA->RA line at fractional
     distance epsilon from OA toward RA, and re-runs the coil-sizing
     numbers off the OA' -> MA' -> SA polygon instead of OA -> MA -> SA.
     Typical good-wheel epsilon = 0.75..0.85; budget plate ERV = 0.55..0.65. */
  var _designerERVOn   = false;
  var _designerERVEps  = 0.80;    /* enthalpy effectiveness, 0..1 */

  /* ----------------------------------------------------------------------
     ERV ROLLOUT — annual rollup, monthly sparkline, ROI calculator,
     climate-zone tariff presets, savings-threshold slider, A/B ghost
     cloud, peak-hour annotations, CSV export.
     All state persisted under localStorage.red5ErvRolloutState.
     Computations are derived on-demand from the same weatherData +
     _designerCFM + _designerRA_T/RH + _designerERVEps used by the
     Drops cloud, so there is exactly ONE source of truth. */
  var _ervClimateZones = [
    /* $/kWh retail commercial tariff (rough public-data 2024-2025 averages). */
    {id:'KR-Seoul', name:'Korea (Seoul)',     kwh:0.094, currency:'$'},
    {id:'US-NY',    name:'US Northeast',      kwh:0.21,  currency:'$'},
    {id:'US-CA',    name:'US California',     kwh:0.28,  currency:'$'},
    {id:'SG',       name:'Singapore',         kwh:0.20,  currency:'$'},
    {id:'JP-TOK',   name:'Japan (Tokyo)',     kwh:0.24,  currency:'$'},
    {id:'EU-DE',    name:'EU (Germany)',      kwh:0.40,  currency:'$'},
    {id:'CN-SH',    name:'China (Shanghai)',  kwh:0.092, currency:'$'},
    {id:'AE-DXB',   name:'UAE (Dubai)',       kwh:0.083, currency:'$'},
    {id:'AU-SYD',   name:'Australia (SYD)',   kwh:0.27,  currency:'$'},
    {id:'CUSTOM',   name:'Custom rate',       kwh:null,  currency:'$'}
  ];
  var _ervClimateZone     = 'KR-Seoul';
  var _ervTariffKwh       = 0.094;       /* $/kWh */
  var _ervInstallCost     = 12000;       /* $ install + commissioning */
  var _ervMaintAnnual     = 200;         /* $/yr maintenance (filters, belts) */
  var _ervRoiOpen         = false;       /* ROI drawer expanded */
  var _ervMinKJkg         = 0;           /* hide hours where |dh_saved| < this */
  var _ervGhostEps        = 0;           /* 0 = off; >0 = second ε for A/B */
  var _ervShowPeaks       = true;        /* annotate top-3 peak-savings hours */
  var _ervRolloutClosed   = false;       /* user clicked ✕ — keep hidden until revive */
  var _ervRolloutPos      = null;        /* {x, y} bottom-left offset; null = default */
  var _ervRolloutSize     = null;        /* {w, h}; null = auto/min */
  /* Band-source toggle: when true AND ERV is on, B1-B10 band lookups
     (color + SA target) bucket the hour by OA' (post-wheel) instead of
     raw OA.  Models a wheel-aware controller that intentionally picks
     less-aggressive SA targets when the wheel has already softened the
     incoming air.  Persisted under red5BandSourceOaP. */
  var _bandSourceOaP      = false;       /* false = OA (default), true = OA' */
  try {
    var _bs = localStorage.getItem('red5BandSourceOaP');
    if (_bs === '1' || _bs === 'true') _bandSourceOaP = true;
  } catch(_) {}
  /* Effective band-input helper: returns {T, RH, W} -- raw OA when the
     toggle is OFF or when ERV is off, post-wheel OA' otherwise.  Used by
     _bandRGB / _saReset call sites so the band selection follows the
     toggle without leaking the conditional into every call site. */
  function _bandInputFor(p){
    if (!_saDropERVOn || !_bandSourceOaP) return { T: p.t, RH: p.rh, W: p.w };
    var raT = _designerRA_T, raW = getW(_designerRA_T, _designerRA_RH);
    var eps = Math.max(0, Math.min(1, _designerERVEps));
    var T = p.t + eps * (raT - p.t);
    var W = p.w + eps * (raW - p.w);
    /* Recover RH from (T, W) for band lookup (bands key on T and RH). */
    var ps = psat(T);
    var pw = W * (101.325) / (0.621945 + W);  /* invert getW: pw = w*Pa / (0.622+w) */
    var RH = Math.max(0, Math.min(100, (pw / ps) * 100));
    return { T: T, RH: RH, W: W };
  }
  /* Module-scoped mirror of the render2DChart-local bandLabel.  Used by
     the per-band hour-count delta strip so we can compute the histogram
     without duplicating the rules inside a render path. */
  function _bandLabelOf(t, rh){
    // Kept in lockstep with `dashboard-helpers.js::bandLabelOf` and
    // `ahu.html::_resolveBand`.  All three surfaces use the same
    // CSV-derived closed intervals + B5 fallback (fixed 2026-07-01
    // after operators saw sidebar chips showing '?' while the
    // per-AHU detail page showed a band for the same OA sample).
    if (!isFinite(t) || !isFinite(rh))                    return '?';
    if (t >= -50 && t <=  5 && rh >=  0 && rh <=  30)     return 'B1';
    if (t >=   5 && t <= 15 && rh >= 30 && rh <=  60)     return 'B2';
    if (t >=  15 && t <= 20 && rh >=  0 && rh <=  30)     return 'B3';
    if (t >=  18 && t <= 22 && rh >= 30 && rh <=  50)     return 'B4';
    if (t >=  22 && t <= 25 && rh >= 40 && rh <=  60)     return 'B5';
    if (t >=  25 && t <= 27 && rh >= 50 && rh <=  70)     return 'B6';
    if (t >=  27 && t <= 32 && rh >= 60 && rh <=  80)     return 'B7';
    if (t >=  32 && t <= 38 && rh >= 70 && rh <= 100)     return 'B8';
    if (t >=  35 && t <= 50 && rh >=  0 && rh <=  30)     return 'B9';
    if (t >=  30 && t <= 50 && rh >= 85 && rh <= 100)     return 'B10';
    return 'B5';
  }
  /* Walk weatherData twice -- once with raw OA, once with OA' -- to build
     a {Bn: {oa, oap}} map of hour-counts per band.  Cheap (O(N) twice,
     N ~ 2900 for a full year) and not memoized because epsilon + RA can
     live-edit and we always want WYSIWYG.  Returns null if ERV is off
     (caller renders nothing). */
  function _bandHourDelta(){
    if (!_saDropERVOn || !weatherData || !weatherData.length) return null;
    var raT = _designerRA_T, raW = getW(_designerRA_T, _designerRA_RH);
    var eps = Math.max(0, Math.min(1, _designerERVEps));
    var out = {}; var labels = ['B1','B2','B3','B4','B5','B6','B7','B8','B9','B10','?'];
    labels.forEach(function(b){ out[b] = {oa:0, oap:0}; });
    var total = 0;
    weatherData.forEach(function(p){
      total++;
      var bOa = _bandLabelOf(p.t, p.rh);
      out[bOa].oa++;
      var T = p.t + eps * (raT - p.t);
      var W = p.w + eps * (raW - p.w);
      var ps = psat(T);
      var pw = W * 101.325 / (0.621945 + W);
      var RH = Math.max(0, Math.min(100, (pw / ps) * 100));
      var bOap = _bandLabelOf(T, RH);
      out[bOap].oap++;
    });
    out._total = total;
    return out;
  }

  /* HISTORICAL COMPARISON (year-over-year climate drift).
     _bandHistoryMode: 'off' | '1y' | '5y'  -- cycle via the strip button.
     _bandHistoryHist: cached {Bn:{oa,oap}} averaged across the historical
                       window(s), or null if not loaded / loading.
     _bandHistoryKey:  memo key combining location + date span + mode so
                       we don't re-fetch when the user toggles back and
                       forth.  Also persisted to localStorage so the
                       comparison survives a page reload. */
  var _bandHistoryMode = 'off';
  var _bandHistoryHist = null;
  var _bandHistoryKey  = null;
  var _bandHistoryLoading = false;
  try {
    var _hm = localStorage.getItem('red5BandHistoryMode');
    if (_hm === '1y' || _hm === '5y' || _hm === 'off') _bandHistoryMode = _hm;
  } catch(_) {}

  /* Compute histogram from a raw weather-data array (same point shape
     as weatherData: {t, rh, w}).  Same RA + eps as the live histogram. */
  function _histogramFromPts(pts){
    var raT = _designerRA_T, raW = getW(_designerRA_T, _designerRA_RH);
    var eps = Math.max(0, Math.min(1, _designerERVEps));
    var out = {}; ['B1','B2','B3','B4','B5','B6','B7','B8','B9','B10','?'].forEach(function(b){ out[b]={oa:0,oap:0}; });
    pts.forEach(function(p){
      out[_bandLabelOf(p.t, p.rh)].oa++;
      var T = p.t + eps * (raT - p.t);
      var W = p.w + eps * (raW - p.w);
      var ps = psat(T);
      var pw = W * 101.325 / (0.621945 + W);
      var RH = Math.max(0, Math.min(100, (pw / ps) * 100));
      out[_bandLabelOf(T, RH)].oap++;
    });
    return out;
  }

  /* Shift an ISO 'YYYY-MM-DD' date back N years, preserving M-D.  Handles
     Feb 29 by clamping to Feb 28 in non-leap years. */
  function _shiftYearISO(iso, yearsBack){
    var d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    var y = d.getUTCFullYear() - yearsBack;
    var m = d.getUTCMonth();
    var dd = d.getUTCDate();
    if (m === 1 && dd === 29) {
      var ly = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
      if (!ly) dd = 28;
    }
    return y + '-' + String(m+1).padStart(2,'0') + '-' + String(dd).padStart(2,'0');
  }

  function _loadBandHistory(mode, cb){
    /* Fetches archive-api hourly data for the same M-D range as the
       currently loaded weatherData, but yearsBack=1 (mode '1y') or
       averaged across yearsBack=1..5 (mode '5y').  cb() is invoked
       after _bandHistoryHist is populated (or set to null on error). */
    if (mode === 'off' || !weatherData.length) {
      _bandHistoryHist = null;
      _bandHistoryKey  = null;
      return cb && cb();
    }
    var lat = parseFloat($('#p3-lat').value);
    var lon = parseFloat($('#p3-lon').value);
    var fromD = $('#p3-from').value, toD = $('#p3-to').value;
    if (isNaN(lat) || isNaN(lon) || !fromD || !toD) return cb && cb();
    var key = lat.toFixed(3) + ',' + lon.toFixed(3) + ',' + fromD + '..' + toD + ',' + mode;
    if (_bandHistoryKey === key && _bandHistoryHist) return cb && cb();  /* memo hit */
    if (_bandHistoryLoading) return;
    _bandHistoryLoading = true;
    _refreshBandDelta();  /* show "loading..." state */
    var years = (mode === '5y') ? [1,2,3,4,5] : [1];
    Promise.all(years.map(function(yb){
      var f = _shiftYearISO(fromD, yb);
      var t = _shiftYearISO(toD,   yb);
      return fetch(__psy3d_archiveUrl(lat, lon, f, t))
        .then(function(r){return r.ok ? r.json() : Promise.reject(r.status);})
        .then(function(j){
          if (j.error) throw new Error(j.reason||j.error);
          var times=j.hourly.time, temps=j.hourly.temperature_2m;
          var rhs=j.hourly.relative_humidity_2m||j.hourly.relativehumidity_2m;
          if (!times||!temps||!rhs) throw new Error('Missing data');
          var pts=[];
          for(var i=0;i<times.length;i++){
            if (temps[i]==null || rhs[i]==null) continue;
            pts.push({t:temps[i], rh:rhs[i], w:getW(temps[i],rhs[i])});
          }
          return _histogramFromPts(pts);
        });
    })).then(function(hs){
      /* Average the per-year histograms.  Same band keys exist in each. */
      var avg = {}; ['B1','B2','B3','B4','B5','B6','B7','B8','B9','B10','?'].forEach(function(b){ avg[b]={oa:0,oap:0}; });
      hs.forEach(function(h){ Object.keys(avg).forEach(function(b){ avg[b].oa += h[b].oa; avg[b].oap += h[b].oap; }); });
      var n = hs.length || 1;
      Object.keys(avg).forEach(function(b){ avg[b].oa = Math.round(avg[b].oa / n); avg[b].oap = Math.round(avg[b].oap / n); });
      _bandHistoryHist = avg;
      _bandHistoryKey  = key;
      _bandHistoryLoading = false;
      _refreshBandDelta();
      if (cb) cb();
    }).catch(function(){
      _bandHistoryHist = null;
      _bandHistoryLoading = false;
      _refreshBandDelta();
      if (cb) cb();
    });
  }
  /* Module-scoped placeholder so _loadBandHistory (above) can call the
     real implementation that gets assigned inside setupControls.  Using
     a var assignment (not a function declaration) avoids hoisting
     shadowing the inner version. */
  var _refreshBandDelta = function(){};
  function _ervRolloutLoad(){
    try {
      var s = JSON.parse(localStorage.getItem('red5ErvRolloutState') || '{}');
      if (typeof s.zone     === 'string')  _ervClimateZone = s.zone;
      if (typeof s.tariff   === 'number')  _ervTariffKwh   = s.tariff;
      if (typeof s.install  === 'number')  _ervInstallCost = s.install;
      if (typeof s.maint    === 'number')  _ervMaintAnnual = s.maint;
      if (typeof s.roiOpen  === 'boolean') _ervRoiOpen     = s.roiOpen;
      if (typeof s.minKJ    === 'number')  _ervMinKJkg     = s.minKJ;
      if (typeof s.ghostEps === 'number')  _ervGhostEps    = s.ghostEps;
      if (typeof s.showPeaks=== 'boolean') _ervShowPeaks   = s.showPeaks;
      if (typeof s.closed   === 'boolean') _ervRolloutClosed = s.closed;
      if (s.pos && typeof s.pos.x === 'number') _ervRolloutPos = s.pos;
      if (s.size && typeof s.size.w === 'number') _ervRolloutSize = s.size;
    } catch(_) {}
  }
  function _ervRolloutSave(){
    try {
      localStorage.setItem('red5ErvRolloutState', JSON.stringify({
        zone:_ervClimateZone, tariff:_ervTariffKwh,
        install:_ervInstallCost, maint:_ervMaintAnnual,
        roiOpen:_ervRoiOpen, minKJ:_ervMinKJkg,
        ghostEps:_ervGhostEps, showPeaks:_ervShowPeaks,
        closed:_ervRolloutClosed, pos:_ervRolloutPos, size:_ervRolloutSize
      }));
    } catch(_) {}
  }
  _ervRolloutLoad();

  /* Compute the per-hour savings series given an epsilon.  Returns an
     array of {idx, ts, dh_kJkg (signed, +cooling/-heating), abs_dh,
     rtH (RT*h per hour at current Designer CFM), kWh}.  Uses Designer
     Mode's RA state as the wheel's other inlet — single source of
     truth across the 2D overlay, the 3D cloud, and this rollout. */
  function _ervSavingsSeries(eps){
    var out = [];
    if (!weatherData || !weatherData.length) return out;
    var raT = _designerRA_T;
    var raW = getW(_designerRA_T, _designerRA_RH); /* kg/kg, same units as p.w */
    var cfm = _designerCFM;
    /* RT*h conversion per kJ/kg at given CFM (from the existing Designer
       Mode formula): (CFM * 4.5 * (dh_kJkg / 0.4299)) / 12000 RT for one
       hour duration = RT*h.  1 RT = 3.517 kW so kWh = RT*h * 3.517. */
    var rt_per_kJkg = (cfm * 4.5 / 0.4299) / 12000;
    for (var i = 0; i < weatherData.length; i++) {
      var p   = weatherData[i];
      var inT = p.t + eps * (raT - p.t);
      var inW = p.w + eps * (raW - p.w);
      var h_oa  = enthalpy(p.t, p.w);
      var h_oap = enthalpy(inT, inW);
      var dh    = h_oa - h_oap; /* +ve: wheel pre-cooled OA (summer); -ve: pre-warmed (winter) */
      var abs_dh = Math.abs(dh);
      var rtH   = abs_dh * rt_per_kJkg;
      out.push({ idx:i, ts:p.ts, dh_kJkg:dh, abs_dh:abs_dh, rtH:rtH, kWh:rtH * 3.517 });
    }
    return out;
  }

  /* Aggregate a per-hour series into the rollup totals + per-month
     buckets used by the panel renderer.  Returns:
       { totalRtH, totalKWh, totalUSD, peaks:[3 top entries by abs_dh],
         monthly:[12 entries with {kJkg_sum, kWh, usd}] }
     Computed lazily on render; not memoized because Designer CFM / RA /
     epsilon all live-edit and we want WYSIWYG. */
  function _ervAggregate(series){
    var monthly = [];
    for (var m = 0; m < 12; m++) monthly.push({kJkg:0, kWh:0, usd:0, hours:0});
    var totRt = 0, totKWh = 0;
    var topN = [];
    for (var i = 0; i < series.length; i++) {
      var s = series[i];
      if (s.abs_dh < _ervMinKJkg) continue;
      totRt  += s.rtH;
      totKWh += s.kWh;
      var d = new Date(s.ts);
      var m = d.getMonth();
      monthly[m].kJkg  += s.abs_dh;
      monthly[m].kWh   += s.kWh;
      monthly[m].usd   += s.kWh * _ervTariffKwh;
      monthly[m].hours += 1;
      /* maintain top-3 by abs_dh */
      if (topN.length < 3) { topN.push(s); topN.sort(function(a,b){return b.abs_dh - a.abs_dh;}); }
      else if (s.abs_dh > topN[2].abs_dh) {
        topN[2] = s;
        topN.sort(function(a,b){return b.abs_dh - a.abs_dh;});
      }
    }
    return {
      totalRtH: totRt,
      totalKWh: totKWh,
      totalUSD: totKWh * _ervTariffKwh,
      peaks: topN,
      monthly: monthly
    };
  }

  /* Compute simple-payback + 10-yr NPV at 5% discount.
     payback = install / (annualSavingsUSD - maintenance).
     NPV uses constant annual cash-flow over 10 years. */
  function _ervROI(annualUSD){
    var net = annualUSD - _ervMaintAnnual;
    var payback = (net > 0.0001) ? (_ervInstallCost / net) : Infinity;
    var r = 0.05, npv = -_ervInstallCost;
    for (var y = 1; y <= 10; y++) npv += net / Math.pow(1 + r, y);
    return { payback:payback, npv:npv, net:net };
  }
  function _ervFmtMoney(v){
    if (!isFinite(v))            return '\u2014';
    var abs = Math.abs(v);
    var sign = v < 0 ? '\u2212' : '';
    if (abs >= 1e6) return sign + '$' + (abs/1e6).toFixed(2) + 'M';
    if (abs >= 1e3) return sign + '$' + (abs/1e3).toFixed(1) + 'k';
    return sign + '$' + abs.toFixed(0);
  }
  function _ervFmtRtH(v){
    if (!isFinite(v)) return '\u2014';
    if (v >= 1e6) return (v/1e6).toFixed(2) + 'M RT\u00b7h';
    if (v >= 1e3) return (v/1e3).toFixed(1) + 'k RT\u00b7h';
    return v.toFixed(0) + ' RT\u00b7h';
  }

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
    <div class="p3-row"><div class="p3-lbl">Location</div>\
      <div style="display:flex;gap:4px;align-items:center">\
        <select class="p3-inp" id="p3-loc-select" data-testid="psy3d-location-select" style="cursor:pointer;flex:1"></select>\
        <button id="p3-loc-pin" type="button" data-testid="psy3d-location-pin"\
          title="Pin as default \u2014 auto-load this on every fresh session"\
          style="background:transparent;border:1px solid #475569;color:#64748b;border-radius:4px;width:28px;height:24px;cursor:pointer;font-size:14px;line-height:1;padding:0;flex-shrink:0;transition:all .15s">\u2606</button>\
      </div></div>\
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
    <div style="border-top:1px solid #334155;margin-top:8px;padding-top:8px">\
      <div class="p3-lbl" style="color:#22d3ee">SA PATH (Measured Telemetry)</div>\
      <div class="p3-row"><div class="p3-lbl">AHU</div>\
        <select class="p3-inp" id="p3-sa-ahu" data-testid="psy3d-sa-ahu-select" style="cursor:pointer"><option value="">\u2014 select \u2014</option></select></div>\
      <div class="p3-row"><div class="p3-lbl">Source</div>\
        <select class="p3-inp" id="p3-sa-source" data-testid="psy3d-sa-source-select" style="cursor:pointer">\
          <option value="modeled">Modeled (controller logic)</option>\
          <option value="measured">Measured (telemetry)</option>\
          <option value="both">Both (model vs reality)</option>\
        </select></div>\
      <div class="p3-row" id="p3-sa-ribbon-row" style="display:none">\
        <label style="display:flex;gap:6px;align-items:center;cursor:pointer;font-size:9px;text-transform:uppercase;letter-spacing:.05em;color:#94a3b8">\
          <input type="checkbox" id="p3-sa-ribbon" data-testid="psy3d-sa-ribbon-toggle"> Show drift ribbon</label></div>\
      <div id="p3-sa-status" class="p3-lbl" style="color:#64748b;text-transform:none;letter-spacing:0;line-height:1.3;margin-top:3px"></div>\
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
<div id="p3-overlay2d"><canvas id="p3-cv2d"></canvas><button id="p3-btn-back3d">Back to 3D</button><button id="p3-btn-proj-mode">Mode: OA\u2192SA Lines</button><button id="p3-btn-band-strategy">Show B1-B10 Strategy</button><button id="p3-btn-monthly-sites">Monthly \u00d7 Sites Comparison</button><button id="p3-btn-ms-fixed">+ Fixed-SA</button><button id="p3-btn-ms-dyn">+ Dyn-Reset</button><button id="p3-btn-ms-band">+ B1-B10</button><button id="p3-btn-ms-banddyn">+ B1-B10 &amp; Dyn-Reset</button><div id="p3-tip2d"></div></div>\
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
  /* RH-band T-clip — the band slab only renders inside this dry-bulb
     range.  Defaults to ASHRAE 55 Cat A indoor envelope (21..27 °C)
     so the magenta volume sits exactly where indoor RH control is
     actionable, instead of sprawling across the whole chart from
     winter outdoor air to summer outdoor air.  Now operator-tunable
     via the sidebar's "3D WX · T·CLIP" dual-handle slider; React
     dispatches `r5-t-clip-change` on every drag, the engine rebuilds
     the slab + reclassifies the scatter live. */
  var RH_BAND_T_CLIP_LO = 21;
  var RH_BAND_T_CLIP_HI = 27;
  (function _hydrateTClipFromStorage(){
    try {
      var raw = localStorage.getItem('red5_t_clip_range');
      if (raw) {
        var p = JSON.parse(raw);
        var lo = +p.lo, hi = +p.hi;
        if (Number.isFinite(lo) && Number.isFinite(hi) && lo < hi) {
          RH_BAND_T_CLIP_LO = lo;
          RH_BAND_T_CLIP_HI = hi;
        }
      }
    } catch (e) {}
  })();
  var SX=260,SY=200,SZ=150;
  function t2sx(t){return(t-T_MIN)/(T_MAX-T_MIN)*SX;}
  function w2sz(wkg){return Math.max(0,Math.min(SZ,SZ-(wkg*1000/W_MAX)*SZ));}
  function frac2sy(f){return f*SY;}

  /* enthalpy helper */
  function enthalpy(T,W){return 1.006*T+W*(2501+1.86*T);}

  /* ---------- DESIGNER MODE drawing helper ----------
     Draws the OA -> MA -> SA process polygon on the 2D psych chart and
     renders the four sizing numbers an MEP engineer pulls off the chart
     during equipment selection:
       - Coil dh           (kJ/kg dry air)         total enthalpy delta
       - Coil tons         (= CFM*4.5*dh_btulb/12000)
       - Coil BF           bypass factor = (SA - ADP) / (MA - ADP) on T axis
       - ADP               apparatus dew point - intersection of the MA->SA
                           process line extended to the saturation curve
       - Room sensible     (kBTU/h)  = CFM * 1.08 * (RA_T - SA_T)
     The chart is the same Carrier / ASHRAE chart designers learned in
     school, just plotted at 1:1 with the live psych chart so the picture
     reads identically.  Decoupled from live telemetry -- this is a
     design-phase schematic tool.

     Args:
       ctx   - 2D canvas context, scaled by dpr already by caller
       tx,wy - coordinate transforms (T degC -> px, W g/kg -> px)
       pad   - {left,right,top,bottom} chart padding in px
       pw,ph - inner plot width, height in px
  */
  function _drawDesignerOverlay(ctx, tx, wy, pad, pw, ph){
    if (!_designerMode) return;
    /* 1. Compute the four state points.  W stored in g/kg dry air. */
    var oa_T = _designerOA_T, oa_W = getW(_designerOA_T, _designerOA_RH) * 1000;
    var ra_T = _designerRA_T, ra_W = getW(_designerRA_T, _designerRA_RH) * 1000;
    var sa_T = _designerSA_T, sa_W = getW(_designerSA_T, _designerSA_RH) * 1000;
    /* ERV pre-treatment: if the wheel is on, the air entering the mixing
       box is no longer OA -- it's OA', which sits on the OA->RA line
       at fractional distance epsilon from OA toward RA.  Geometrically
       linear-interpolating T and W along OA->RA approximates moving
       along the enthalpy axis within <0.5% across the comfort range.
       Effective enthalpy effectiveness: (h_OA - h_OA')/(h_OA - h_RA)
       collapses to epsilon under that linear interpolation. */
    var oap_T = oa_T, oap_W = oa_W;
    if (_designerERVOn) {
        var eps = _designerERVEps;
        oap_T = oa_T + eps * (ra_T - oa_T);
        oap_W = oa_W + eps * (ra_W - oa_W);
    }
    /* MA = OAfrac * OA(or OA') + (1 - OAfrac) * RA  on dry-bulb T and W
       (linear mixing is accurate to <0.5% over comfort range; full
       enthalpy mixing would require iterating because W = f(T, RH) is
       nonlinear, but that's classroom over-engineering for a screen
       readout). */
    var f = _designerOAFrac;
    var mix_T = _designerERVOn ? oap_T : oa_T;
    var mix_W = _designerERVOn ? oap_W : oa_W;
    var ma_T = f * mix_T + (1 - f) * ra_T;
    var ma_W = f * mix_W + (1 - f) * ra_W;

    /* 2. Find ADP: extend the MA -> SA line until it intersects the
       saturation curve (W = W_sat(T)).  Walk T downward from SA in 0.1
       degC steps along the (MA->SA) direction.  Stop when W_line >=
       W_sat(T_line) or when we run off the chart. */
    var dT = sa_T - ma_T, dW = sa_W - ma_W;   /* both negative for cooling */
    var lineW = function(t){ if (Math.abs(dT) < 1e-6) return sa_W; return ma_W + dW * (t - ma_T) / dT; };
    var adp_T = sa_T, adp_W = sa_W;
    for (var step = 0; step < 200; step++){
        var tt = sa_T - step * 0.1;
        if (tt < T_MIN + 0.5) break;
        var wsat = getW(tt, 100) * 1000;
        var wline = lineW(tt);
        if (wline >= wsat) { adp_T = tt; adp_W = wsat; break; }
    }

    /* 3. Coil sizing numbers. */
    var h_oa = enthalpy(oa_T, oa_W / 1000);
    var h_ra = enthalpy(ra_T, ra_W / 1000);
    var h_oap = enthalpy(oap_T, oap_W / 1000);   /* equals h_oa when ERV off */
    var h_ma = enthalpy(ma_T, ma_W / 1000);    /* kJ/kg dry air */
    var h_sa = enthalpy(sa_T, sa_W / 1000);
    var dh_kj = h_ma - h_sa;                   /* coil total dh (cooling) */
    var dh_btulb = dh_kj * 0.4299;             /* kJ/kg -> Btu/lb */
    var tons = (_designerCFM * 4.5 * dh_btulb) / 12000;
    /* ERV savings: how many tons did the wheel shave off relative to the
       same system without the wheel?  Compute baseline tons by re-running
       the math with mix_T/W = OA (no wheel) and compare. */
    var ervSavedTons = 0, ervSavedPct = 0;
    if (_designerERVOn && Math.abs(h_oa - h_ra) > 0.01) {
        var ma_baseT = f * oa_T + (1 - f) * ra_T;
        var ma_baseW = f * oa_W + (1 - f) * ra_W;
        var dh_base = enthalpy(ma_baseT, ma_baseW / 1000) - h_sa;
        var tons_base = (_designerCFM * 4.5 * (dh_base * 0.4299)) / 12000;
        ervSavedTons = tons_base - tons;
        ervSavedPct  = (tons_base > 0) ? (ervSavedTons / tons_base) * 100 : 0;
    }
    /* Bypass factor: BF = (SA - ADP) / (MA - ADP).  Defined on T axis
       (most common form).  BF approaching 0 = denser coil; ~0.05 for
       8-row, ~0.15 for 4-row.  We display whichever has non-zero
       denominator. */
    var bf = (Math.abs(ma_T - adp_T) > 0.01)
              ? (sa_T - adp_T) / (ma_T - adp_T)
              : 0.0;
    bf = Math.max(0, Math.min(1, bf));
    /* Room sensible: classic 1.08 multiplier for CFM-degF.  Convert
       (RA_T - SA_T) from degC to degF: dF = dC * 1.8.  */
    var dTF = (ra_T - sa_T) * 1.8;
    var kbtu_sens = (_designerCFM * 1.08 * dTF) / 1000;

    /* 4. Draw process polygon: OA -> MA -> SA -> ADP, with thin amber
       lines + larger labeled dots at each anchor point. */
    var dot = function(t, w, color, label){
        var X = tx(t), Y = wy(w);
        ctx.beginPath(); ctx.arc(X, Y, 5.5, 0, Math.PI * 2);
        ctx.fillStyle = color; ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 1.2; ctx.stroke();
        if (label){
            ctx.fillStyle = color; ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'left';
            ctx.fillText(label, X + 8, Y - 6);
        }
    };
    /* OA -> RA mixing line (dashed, slate) so the OA fraction is
       visually obvious */
    ctx.save();
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = 'rgba(148,163,184,.55)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(tx(oa_T), wy(oa_W));
    ctx.lineTo(tx(ra_T), wy(ra_W));
    ctx.stroke();
    ctx.restore();
    /* ERV recovery arrow: cyan dashed OA -> OA' showing where the wheel
       moves the entering air along the OA-RA line. */
    if (_designerERVOn) {
        ctx.save();
        ctx.setLineDash([2, 3]);
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(tx(oa_T), wy(oa_W));
        ctx.lineTo(tx(oap_T), wy(oap_W));
        ctx.stroke();
        ctx.restore();
        /* Tiny arrowhead on the recovery line so direction is unambiguous. */
        var ahX = tx(oap_T), ahY = wy(oap_W);
        var dx0 = tx(oap_T) - tx(oa_T), dy0 = wy(oap_W) - wy(oa_W);
        var len0 = Math.sqrt(dx0 * dx0 + dy0 * dy0) || 1;
        var ux = dx0 / len0, uy = dy0 / len0;
        var perp = function(s){ return [-uy * s, ux * s]; };
        ctx.fillStyle = '#22d3ee';
        ctx.beginPath();
        ctx.moveTo(ahX, ahY);
        var p1 = perp(4); ctx.lineTo(ahX - ux * 8 + p1[0], ahY - uy * 8 + p1[1]);
        var p2 = perp(-4); ctx.lineTo(ahX - ux * 8 + p2[0], ahY - uy * 8 + p2[1]);
        ctx.closePath(); ctx.fill();
    }
    /* MA -> SA process line (solid amber, thicker) */
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(tx(ma_T), wy(ma_W));
    ctx.lineTo(tx(sa_T), wy(sa_W));
    ctx.stroke();
    /* SA -> ADP extension (thinner amber dashed) to show where the
       process line lands on the saturation curve */
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(245,158,11,.55)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(tx(sa_T), wy(sa_W));
    ctx.lineTo(tx(adp_T), wy(adp_W));
    ctx.stroke();
    ctx.restore();
    /* Plot dots in z-order (back to front: ADP, OA, RA, MA, SA so SA is
       on top because it's the smallest space).  SA gets its temp inline
       so when SA and ADP nearly overlap (typical: SA=13, ADP=12) the
       operator can still read both.  Labels offset symmetrically to
       avoid stacking. */
    dot(adp_T, adp_W, '#67e8f9', 'ADP ' + adp_T.toFixed(1) + '\u00b0C');
    dot(oa_T,  oa_W,  '#fb7185', 'OA ' + oa_T.toFixed(1) + '\u00b0C ' + Math.round(_designerOA_RH) + '%');
    /* OA' (post-recovery) only when ERV is on, in cyan to match the arrow. */
    if (_designerERVOn) {
        dot(oap_T, oap_W, '#22d3ee', "OA' " + oap_T.toFixed(1) + '\u00b0C \u03b5=' + _designerERVEps.toFixed(2));
    }
    dot(ra_T,  ra_W,  '#a3e635', 'RA ' + ra_T.toFixed(1) + '\u00b0C ' + Math.round(_designerRA_RH) + '%');
    dot(ma_T,  ma_W,  '#fbbf24', 'MA ' + ma_T.toFixed(1) + '\u00b0C');
    /* SA label placed ABOVE the dot (negative y offset) instead of the
       default to avoid colliding with the ADP label (which sits to the
       right of ADP) when SA-ADP \u0394T is small. */
    var saX = tx(sa_T), saY = wy(sa_W);
    ctx.beginPath(); ctx.arc(saX, saY, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = '#22d3ee'; ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.fillStyle = '#22d3ee'; ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('SA ' + sa_T.toFixed(1) + '\u00b0C ' + Math.round(_designerSA_RH) + '%', saX + 8, saY + 16);

    /* 5. Read-out card: pinned bottom-left of the chart inside the clip
       region.  Compact digital display, 5 rows by default; +1 row when
       ERV is on (savings) and +1 more row when ERV is doing harm (the
       wheel is making the coil bigger -- a real-world commissioning
       failure mode in shoulder/winter conditions when OA is cooler or
       drier than RA; the tool flags it with an amber pulse line). */
    var hasERVRow  = _designerERVOn;
    var ervIsHarmful = _designerERVOn && ervSavedTons < -0.05;
    /* Bypass-factor warning: BF > 0.18 means the coil is essentially
       under-sized -- a real coil with this BF won't actually pull SA down
       to the requested leaving temperature.  Surface a one-line caption
       so the operator knows what the red number is telling them and what
       to change. */
    var bfIsHigh = (bf > 0.18);
    var cardX = pad.left + 12;
    var cardW = 220;
    var cardH = 110 + (hasERVRow ? 16 : 0) + (ervIsHarmful ? 22 : 0) + (bfIsHigh ? 14 : 0);
    var cardY = pad.top + ph - cardH - 12;
    ctx.fillStyle = 'rgba(2,6,23,.92)';
    ctx.strokeStyle = ervIsHarmful ? '#f59e0b' : '#b45309';
    ctx.lineWidth = ervIsHarmful ? 1.5 : 1;
    ctx.beginPath();
    ctx.rect(cardX, cardY, cardW, cardH);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'left';
    var hdr = 'DESIGNER  CFM ' + _designerCFM.toLocaleString() + '   OA ' + Math.round(f * 100) + '%';
    if (_designerERVOn) hdr += '   +ERV';
    ctx.fillText(hdr, cardX + 8, cardY + 14);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    var row = function(y, label, value, color){
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(label, cardX + 8, cardY + y);
        ctx.fillStyle = color || '#fbbf24';
        ctx.textAlign = 'right';
        ctx.fillText(value, cardX + cardW - 8, cardY + y);
        ctx.textAlign = 'left';
    };
    row(32, 'Coil \u0394h',    dh_kj.toFixed(1) + ' kJ/kg', '#fb923c');
    row(48, 'Cooling tons', tons.toFixed(1) + ' RT',     '#fb923c');
    row(64, 'ADP',          adp_T.toFixed(1) + ' \u00b0C',     '#67e8f9');
    row(80, 'Bypass BF',    bf.toFixed(2),                bf < 0.08 ? '#22c55e' : (bf < 0.18 ? '#fbbf24' : '#ef4444'));
    /* Y offset for everything below the BF row -- depends on whether the
       BF caption is being shown.  Keeps Room sens. + ERV rows aligned. */
    var bfCaptionDY = 0;
    if (bfIsHigh) {
        ctx.save();
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('\u25B8 add coil rows or lower SA RH', cardX + 8, cardY + 94);
        ctx.restore();
        bfCaptionDY = 14;
    }
    row(96  + bfCaptionDY, 'Room sens.',   kbtu_sens.toFixed(1) + ' kBTU/h', '#a3e635');
    if (_designerERVOn) {
        /* ERV savings row: cyan when positive (wheel helps), amber-pulse
           when negative (wheel hurts -- engineer should add a bypass
           damper).  Pulse uses Date.now() so the row visibly flickers
           every render tick, drawing the operator's eye. */
        var ervColor;
        if (ervIsHarmful) {
            var pulse = 0.6 + 0.4 * Math.sin(Date.now() / 240);
            /* lerp #f59e0b -> #fef08a using `pulse` so it breathes amber */
            var r = Math.round(245 + (254 - 245) * pulse);
            var g = Math.round(158 + (240 - 158) * pulse);
            var b = Math.round( 11 + (138 -  11) * pulse);
            ervColor = 'rgb(' + r + ',' + g + ',' + b + ')';
            /* Trigger a re-render every ~120ms so the pulse stays alive
               without burning CPU when Designer Mode is off. */
            if (!_drawDesignerOverlay._pulseTimer){
                _drawDesignerOverlay._pulseTimer = setInterval(function(){
                    if (_designerMode && _designerERVOn) {
                        try { render2DChart(); } catch(_) {}
                    } else if (_drawDesignerOverlay._pulseTimer) {
                        clearInterval(_drawDesignerOverlay._pulseTimer);
                        _drawDesignerOverlay._pulseTimer = null;
                    }
                }, 120);
            }
        } else {
            ervColor = '#22d3ee';
            if (_drawDesignerOverlay._pulseTimer){
                clearInterval(_drawDesignerOverlay._pulseTimer);
                _drawDesignerOverlay._pulseTimer = null;
            }
        }
        row(112 + bfCaptionDY,
            'ERV saved',
            ervSavedTons.toFixed(1) + ' RT (' + ervSavedPct.toFixed(0) + '%)',
            ervColor);
        if (ervIsHarmful) {
            /* Two-line caption explaining WHY savings are negative and
               what an engineer should do.  Smaller font, centred across
               the card width, amber to match the pulse.  Without this
               operators unfamiliar with the OA-vs-RA enthalpy geometry
               can mistake the negative number for a bug. */
            ctx.save();
            ctx.fillStyle = ervColor;
            ctx.font = 'bold 9px monospace';
            ctx.textAlign = 'left';
            ctx.fillText('\u26A0 OA cooler/drier than RA',  cardX + 8, cardY + 128 + bfCaptionDY);
            ctx.font = '9px monospace';
            ctx.fillStyle = '#cbd5e1';
            ctx.fillText('bypass ERV \u2014 free pre-cooling', cardX + 8, cardY + 140 + bfCaptionDY);
            ctx.restore();
        }
    }
  }

  /* i18n shim -- safely calls window.t() if i18n.js is loaded, otherwise
     falls back to the English default passed in.  Lets every chart string
     be wrapped without ordering or load-race concerns.                  */
  function _t(key, fallback){
    if (typeof window !== 'undefined' && typeof window.t === 'function') {
      var v = window.t(key);
      if (v && v !== key) return v;
    }
    return fallback != null ? fallback : key;
  }

  /* Inverse psychrometric helper: given enthalpy h (kJ/kg dry air) and a
     target relative humidity (%), back-solve the dry-bulb T.  Used by
     the new A/B/C/$ display modes to decompose strategy energies into
     sensible vs latent components: strategies like Dyn-Reset and
     Opt-SA target an h_sa with no explicit RH, so we assume 50 % RH
     at the implied T to get a defensible W_sa for the latent term.
     Newton iteration usually converges in 4-6 steps; bail at 20.
     We deliberately return T inside the [-15, 50] climate envelope so
     a degenerate h doesn't blow up subsequent arithmetic.            */
  function _T_from_h(h_target, rh_pct){
    var T = 13;  // start at typical AHU SA temperature
    for (var k=0; k<20; k++){
      var W   = getW(T, rh_pct);
      var hT  = enthalpy(T, W);
      if (Math.abs(hT - h_target) < 0.05) break;
      // numerical derivative dh/dT at fixed RH
      var W2  = getW(T + 0.5, rh_pct);
      var hT2 = enthalpy(T + 0.5, W2);
      var dh  = (hT2 - hT) / 0.5;
      if (Math.abs(dh) < 1e-6) break;
      T -= (hT - h_target) / dh;
      if (T < -15) T = -15;
      if (T >  50) T =  50;
    }
    return T;
  }

  /* Rounded-rectangle helper used by chart legends / chips.  Browser
     ctx.roundRect() is not universally available on the embedded WebView
     versions some controllers ship with, so do it manually with arc
     fillets and let the caller invoke fill() / stroke() as needed.    */
  function _roundRect(ctx, x, y, w, h, r){
    if (r > w/2) r = w/2;
    if (r > h/2) r = h/2;
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.arcTo(x+w, y,   x+w, y+r,   r);
    ctx.lineTo(x+w, y+h-r);
    ctx.arcTo(x+w, y+h, x+w-r, y+h, r);
    ctx.lineTo(x+r, y+h);
    ctx.arcTo(x,   y+h, x,   y+h-r, r);
    ctx.lineTo(x, y+r);
    ctx.arcTo(x,   y,   x+r, y,     r);
    ctx.closePath();
  }

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
  var scene,cam,ren,orb,basePlane,pathGroup,projGroup,czGroup,dhFloorGroup,vavGroup,saDropGroup,saPathGroup,rhBandGroup,maSplitGroup;

  /* SA-overlay selection state.  These MUST be declared at engine scope --
     the same scope as the builders further down -- and not inside
     setupControls().  They were inside it, and since every read went
     through a `typeof x !== 'undefined'` guard the scope miss could not
     throw: it degraded silently to mode='modeled', ribbon=false,
     measured=null, so the cyan measured path, the drift ribbon and the
     apples-to-apples modelled path never drew even though the fetch
     succeeded and the status line reported the sample count.  The builders
     now read these directly, so a future scope mistake fails loudly
     instead of blanking a layer. */
  var _saSourceMode = 'modeled',
      _saAhuId      = null,
      _saRibbonOn   = false,
      _saMeasured   = null;
  var _p3RedrawPsyTex = null; /* populated by buildScene so theme listener can redraw floor chart */
  var weatherData=[],timeLabels=[],vavData=[];

  /* ---- RH-band overlay state -------------------------------------------
     Driven by the sidebar's "sweet-spot" slider (default 40-60% RH).  The
     React state lives at `sweetSpotRange = {lo, hi}` and is mirrored to
     localStorage on every change; we read it on engine init for the
     initial geometry, and live-update via a custom window event so
     dragging the slider in the sidebar redraws the slab + reclassifies
     the in-band scatter without any round-trip refetch. */
  function _readRhBandRange() {
    try {
      var raw = localStorage.getItem('red5_sweet_spot_range');
      if (raw) {
        var p = JSON.parse(raw);
        var lo = Math.max(1, Math.min(99, +p.lo));
        var hi = Math.max(1, Math.min(99, +p.hi));
        if (lo < hi) return { lo: lo, hi: hi };
      }
    } catch (e) {}
    return { lo: 40, hi: 60 };
  }
  var _rhBandRange = _readRhBandRange();
  var _lastWeatherCtx = null; /* {locName, fromD, toD} — for rebuilding scatter on RH-band change */

  /* `_rhBandTight` ties the in-band scatter highlight to the slab's
     T-clip range.  OFF (default) = original behaviour: any sample with
     `p.rh ∈ [lo,hi]` gets the 1.6× marker, regardless of T — useful for
     "how often does this climate visit my RH window across the year".
     ON = strict: only samples that also fall inside the slab's T-clip
     ([21,27 °C] by default) get the highlight, so the markers track
     the volume the operator can actually influence.  Persisted via
     localStorage so the choice survives reloads. */
  function _readRhBandTight() {
    try { return localStorage.getItem('red5_rh_band_tight') === '1'; } catch (e) { return false; }
  }
  var _rhBandTight = _readRhBandTight();

  /* ---- RH-band slab builder --------------------------------------------
     Constructs a mesh + outline ribbons spanning the volume between the
     two RH curves (RH_lo, RH_hi) over the chart's T range.  Each "slice"
     at temperature T has cross-section endpoints
       low  = (t2sx(T), *, w2sz(getW(T, RH_lo)))
       high = (t2sx(T), *, w2sz(getW(T, RH_hi)))
     extruded along Y from 0 (= start of time window) to SY (= end).
     The slab curves upward exponentially with T because W = f(T, RH)
     grows along the saturation envelope.  Magenta (0xec4899) matches
     the operator's pick from the mockup and reads cleanly against
     both the blue cold scatter and the yellow/red warm scatter. */
  function _buildRhBandSlab(rhLo, rhHi) {
    if (!rhBandGroup) return;
    var THREE = window.THREE;
    while (rhBandGroup.children.length) rhBandGroup.remove(rhBandGroup.children[0]);
    var nT = 60;
    var loPts = [], hiPts = [];
    /* Walk only over the T-clip range (default 21..27 °C) — the slab
       used to span T_MIN..T_MAX which produced a magenta curtain that
       buried most of the cold-cluster scatter.  Clipping focuses the
       eye on the band exactly where RH control is meaningful. */
    var Tlo = RH_BAND_T_CLIP_LO, Thi = RH_BAND_T_CLIP_HI;
    for (var i = 0; i <= nT; i++) {
      var T = Tlo + (Thi - Tlo) * (i / nT);
      loPts.push({ t: T, w: getW(T, rhLo) });
      hiPts.push({ t: T, w: getW(T, rhHi) });
    }
    /* Build the 4-face extruded mesh: 4 verts per T-slice
       (front-lo, front-hi, back-lo, back-hi).  Triangles weave the
       top cap, bottom cap, low-RH wall and high-RH wall.  Front =
       y=SY (most-recent end of time axis), back = y=0. */
    var verts = [], idx = [];
    for (var i = 0; i <= nT; i++) {
      var xL = t2sx(loPts[i].t), zL = w2sz(loPts[i].w);
      var xH = t2sx(hiPts[i].t), zH = w2sz(hiPts[i].w);
      verts.push(xL, SY, zL,  xH, SY, zH,  xL, 0, zL,  xH, 0, zH);
    }
    for (var i = 0; i < nT; i++) {
      var b = i * 4, n = b + 4;
      idx.push(b+0, b+1, n+1,   b+0, n+1, n+0);     // top  (y=SY)
      idx.push(b+2, n+2, n+3,   b+2, n+3, b+3);     // bot  (y=0)
      idx.push(b+0, n+0, n+2,   b+0, n+2, b+2);     // low-RH wall
      idx.push(b+1, b+3, n+3,   b+1, n+3, n+1);     // hi-RH wall
    }
    var slabGeo = new THREE.BufferGeometry();
    slabGeo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    slabGeo.setIndex(idx);
    slabGeo.computeVertexNormals();
    rhBandGroup.add(new THREE.Mesh(slabGeo, new THREE.MeshBasicMaterial({
      color: 0xec4899, transparent: true, opacity: 0.10,
      side: THREE.DoubleSide, depthWrite: false
    })));
    /* Outline ribbons on the front (y=SY) and back (y=0) faces — front
       at 0.65 opacity, back at 0.30 to imply depth.  These trace the
       two RH curves so the slab is legible even when viewed edge-on. */
    [{ y: SY, op: 0.65 }, { y: 0, op: 0.30 }].forEach(function(face){
      var lo = [], hi = [];
      for (var i = 0; i <= nT; i++) {
        lo.push(new THREE.Vector3(t2sx(loPts[i].t), face.y, w2sz(loPts[i].w)));
        hi.push(new THREE.Vector3(t2sx(hiPts[i].t), face.y, w2sz(hiPts[i].w)));
      }
      var mat = new THREE.LineBasicMaterial({ color: 0xec4899, transparent: true, opacity: face.op });
      rhBandGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(lo), mat));
      rhBandGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(hi), mat));
    });
  }

  /* Listen for the sidebar's RH-band slider to dispatch updates.  The
     React layer fires `r5-rh-band-change` with {lo,hi} whenever the
     sweetSpotRange state changes; we rebuild the slab geometry and
     re-classify the scatter (which lives inside pathGroup) so the
     1.6× in-band markers track the slider live. */
  window.addEventListener('r5-rh-band-change', function(e) {
    if (!e || !e.detail) return;
    var lo = +e.detail.lo, hi = +e.detail.hi;
    if (!(lo > 0 && hi > 0 && lo < hi)) return;
    _rhBandRange = { lo: lo, hi: hi };
    _buildRhBandSlab(lo, hi);
    if (weatherData.length > 0 && _lastWeatherCtx) {
      buildWeatherVis(_lastWeatherCtx.locName, _lastWeatherCtx.fromD, _lastWeatherCtx.toD);
    }
  });

  /* T-clip event — sidebar's "3D WX · T·CLIP" slider fires this on
     every drag.  Reset the global constants, rebuild the slab so it
     reshapes to the new T window, and (if `_rhBandTight` is on)
     reclassify the scatter so the 1.6× markers also retighten. */
  window.addEventListener('r5-t-clip-change', function(e) {
    if (!e || !e.detail) return;
    var lo = +e.detail.lo, hi = +e.detail.hi;
    if (!(Number.isFinite(lo) && Number.isFinite(hi) && lo < hi)) return;
    RH_BAND_T_CLIP_LO = lo;
    RH_BAND_T_CLIP_HI = hi;
    _buildRhBandSlab(_rhBandRange.lo, _rhBandRange.hi);
    if (weatherData.length > 0 && _lastWeatherCtx) {
      buildWeatherVis(_lastWeatherCtx.locName, _lastWeatherCtx.fromD, _lastWeatherCtx.toD);
    }
    // Refresh the tooltip on the FREE | T·CLIP sub-chip so it reflects the new range.
    var tc = document.getElementById('p3-rhBand-tclip');
    if (tc) tc.title = 'In-band highlight mode\n  FREE   = any sample with RH \u2208 [lo,hi] gets the 1.6\u00D7 marker (across the whole year)\n  T-CLIP = strict: also require T \u2208 [' + RH_BAND_T_CLIP_LO + ',' + RH_BAND_T_CLIP_HI + ' \u00B0C], so the highlight matches the slab volume';
  });

  var projMode='lines'; /* 'lines' | 'dots' | 'vav' — shared between setupControls and render2DChart */
  var chart2DMode='psy'; /* 'psy' | 'tt' | 'wt' — drives the 2D overlay layout */

  /* ---- Shared SA-reset model ----------------------------------------------
     Module-level (was previously closed over inside render2DChart).  Used by
     both the 2D OA→SA Lines/Landing Zones/VAV projections AND the new 3D
     "OA→SA Drops" rain-on-floor visualization, so the two views show
     IDENTICAL setpoint targets (single source of truth, no math drift).
     Returns {t, w} = (SA dry-bulb °C, SA humidity ratio kg/kg) given an OA
     sample (t °C, rh %, w kg/kg).  Comments inline document each band's
     control intent so this stays an unbiased model.
     ----------------------------------------------------------------------- */
  function _saReset(t, rh, w){
    var st, sw;
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
    var wSat=getW(st,100);if(sw>wSat)sw=wSat*0.98;
    return {t:st, w:sw};
  }

  /* SA-reset band → fixed RGB triplet (0–1).  Mirrors the bandCol() palette
     used by the 2D OA→SA Lines projection so colors stay coherent across
     2D and 3D views.  Returned as Float32-friendly [r,g,b] for direct
     pushing into a THREE.BufferAttribute color buffer. */
  function _bandRGB(t, rh){
    if(t<5&&rh<30)                       return [0.231, 0.510, 0.965]; // B1  cold-dry         #3b82f6
    if(t>=5&&t<15&&rh>=30&&rh<=60)       return [0.024, 0.714, 0.831]; // B2  cool-mid         #06b6d4
    if(t>=15&&t<20&&rh<30)               return [0.078, 0.722, 0.651]; // B3  cool-dry         #14b8a6
    if(t>=18&&t<22&&rh>=30&&rh<=50)      return [0.133, 0.773, 0.369]; // B4  econ             #22c55e
    if(t>=22&&t<=25&&rh>=40&&rh<=60)     return [0.063, 0.725, 0.506]; // B5  comfort          #10b981
    if(t>25&&t<=27&&rh>=50&&rh<=70)      return [0.918, 0.702, 0.031]; // B6  edge-hi          #eab308
    if(t>27&&t<=32&&rh>60&&rh<=80)       return [0.976, 0.451, 0.086]; // B7  warm-hum         #f97316
    if(t>32&&t<=38&&rh>70)               return [0.937, 0.267, 0.267]; // B8  hot-hum          #ef4444
    if(t>35&&rh<30)                      return [0.961, 0.620, 0.043]; // B9  hot-dry          #f59e0b
    if(t>30&&rh>85)                      return [0.659, 0.333, 0.969]; // B10 ext-hum          #a855f7
    return [0.580, 0.639, 0.722];                                       // unclassified gray   #94a3b8
  }

  /* Whether the green B1-B10 cumulative curve, its transition markers, its
     endpoint label, and the band-ramp legend are rendered.  Off by default so
     the user opts into the band-strategy view via the dedicated button. */
  var _p3ShowBandStrategy = false;
  /* Color mode for the OA→SA Drops 3D layer.  't' = OA temperature spectrum
     (blue-cold → red-hot, matches the existing weather-cloud coloring).
     'band' = fixed B1-B10 SA-reset band palette (matches bandCol() in the
     2D layer, so a B7 hot-humid hour is the same orange in both views).
     Toggled via the chip next to the OA→SA Drops layer toggle. */
  var _saDropColorMode = 't';
  /* Whether the OA→SA Drops layer should pre-treat each OA point through an
     ERV wheel before drawing the drop.  When ON, every OA point is shifted
     toward the user's RA design state by the Designer-Mode epsilon
     (_designerERVEps), so the drop lines start at OA' instead of OA -- the
     same geometric trick the Designer-Mode panel uses.  Visualises the
     entire year of OA hours AFTER ERV pre-treatment so engineers can see
     how much the wheel "moves" the cloud toward the comfort zone before the
     coil ever fires.  Persisted to localStorage so the toggle survives a
     page reload. */
  var _saDropERVOn = false;
  try {
    var _sd = localStorage.getItem('red5SaDropERV');
    if (_sd === '1' || _sd === 'true') _saDropERVOn = true;
  } catch (e) { /* private-mode / quota - ignore */ }
  /* Cached during T×Time render so the mousemove handler can build per-point
     tooltips that include the active control band, its SA setpoint and the
     OA damper % without re-running classifyBand on every mouse event. */
  var _ttCache = null;
  /* Per-site monthly B1-B10 vs baseline cache.  Populated on first click of
     the "Monthly \u00d7 Sites" button.  Keyed by preset code (NYC/LON/\u2026) so
     we only hit Open-Meteo once per session per site. */
  var _monthlyCache = {};
  var _monthlyFetching = false;
  /* Signature of the {saved + presets} site list at the time _monthlyCache
     was last populated.  Used by _fetchMonthlyAllSites() to detect when the
     user has added or removed a saved location on the dashboard since the
     last open of the Monthly x Sites view, so we can invalidate the band-
     result cache and re-fetch instead of silently showing a stale set.
     Format: sorted "lat2dp,lon2dp|lat2dp,lon2dp|..." string. */
  var _monthlySitesSig = '';
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
  // Monthly x Sites legend display mode.  Selectable A/B/C/$.
  //   'A' Comfort hours met per strategy (ASHRAE latent coverage proxy)
  //   'B' Sensible vs Latent decomposition (mini stacked bar per strategy)
  //   'C' Trade-off chip [Energy / Comfort / Compliance / Failsafe]
  //   '$' Total cost of ownership = Energy_cost + Comfort_violation_cost
  // Defaults to 'C' so first impression is the holistic fact sheet, not
  // the reductive single-axis number that confused the audience earlier.
  var _msMode = 'C';
  // Cost-model defaults (user 2026-05-09 inputs).  All editable in the
  // toolbar when '$' mode is on.  Defaults chosen to match a 1,000 sqm
  // office AHU with electric chiller + gas furnace; user can plug their
  // own utility rate / COP / violation cost so audience can sanity-check.
  var _costAirM3h    = 18000;  // m3/h, ~6 ACH @ 3 m ceiling for 1000 sqm
  var _costRate      = 0.15;   // USD per kWh
  var _costCopCool   = 3.5;    // typical electric chiller
  var _costEffHeat   = 0.95;   // typical gas furnace
  var _costViolRate  = 15;     // USD per humid-hour-uncovered (mid-realistic)
  // Hover-hitbox cache for OA-curve tooltips.  Cleared and repopulated on
  // every Monthly \u00d7 Sites render; consumed by the canvas mousemove
  // handler attached in setupControls() below.
  var _msOaHits = [];
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
    /* OA→SA "rain drops": OA points float at their time-Y position, drop
       lines descend to each point's computed SA on the basePlane (Y=0).
       Hidden by default so existing scenes stay uncluttered. */
    saDropGroup=new THREE.Group();saDropGroup.visible=false;scene.add(saDropGroup);
    saPathGroup=new THREE.Group();saPathGroup.visible=false;scene.add(saPathGroup);
    maSplitGroup=new THREE.Group();maSplitGroup.visible=false;scene.add(maSplitGroup);

    /* ---- RH-BAND SLAB --------------------------------------------------
       Translucent magenta volume bounded by the two RH curves
       W = f(T, RH_lo) and W = f(T, RH_hi) sampled along the X (T) axis
       and extruded along the Y (time) axis.  Default ON so operators
       immediately see the new feature; chip in the legend can toggle it.
       Same depth-write/two-sided treatment as the comfort-zone volume
       so it never clips the scatter dots behind it. */
    rhBandGroup = new THREE.Group();
    scene.add(rhBandGroup);
    /* `_rhBandRange` is normally initialised at module top (var
       declared at line ~1215), but if THREE.js is already cached the
       `loadScripts` callback runs SYNCHRONOUSLY, so buildScene fires
       before the `var ... = _readRhBandRange()` assignment line is
       reached.  Read from localStorage as a fallback to keep the
       initial render safe; the live state is hydrated immediately
       after when execution continues past the var declarations. */
    var _rb = _rhBandRange || _readRhBandRange();
    _buildRhBandSlab(_rb.lo, _rb.hi);

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
    /* 2026-05-25: aligned with backend SAVED_LOCATIONS starter list so the
       "City presets" optgroup in the unified dropdown matches the same 11
       cities the dashboard's weather strip surfaces.  Single source of
       truth across the dashboard + 3D WX modal. */
    var locs=[
        ['ULN', 47.92,  106.92, 'Ulaanbaatar'],
        ['NYC', 40.71,  -74.01, 'New York'],
        ['LON', 51.51,   -0.13, 'London'],
        ['BER', 52.52,   13.40, 'Berlin'],
        ['YVR', 49.28, -123.12, 'Vancouver'],
        ['TYO', 35.68,  139.69, 'Tokyo'],
        ['PEK', 39.91,  116.40, 'Beijing'],
        ['TPE', 25.03,  121.57, 'Taipei'],
        ['HKG', 22.32,  114.17, 'Hong Kong'],
        ['SIN',  1.35,  103.82, 'Singapore'],
        ['SYD',-33.87,  151.21, 'Sydney'],
    ];
    /* 2026-05-26: restored the legacy preset BUTTON row (regression fix).
       Even though the same cities appear in the "City presets" optgroup
       of the dropdown, the button row gives operators one-click access
       to all 11 starter cities without opening the dropdown -- the user
       relies on that quick-launch behavior, especially when comparing
       weather across sites side-by-side.  Wrapping is handled by the
       .p3-presets CSS (flex-wrap:wrap) so 11 buttons reflow cleanly. */
    var lpEl=$('#p3-loc-presets');
    if (lpEl){
      lpEl.style.display = '';
      lpEl.innerHTML = '';
      locs.forEach(function(l){
        var b=document.createElement('button');
        b.type='button';
        b.textContent=l[0];
        b.title=l[3];
        b.onclick=function(){applyLocation({lat:l[1],lon:l[2],name:l[3]},{persist:true,fetch:true});};
        lpEl.appendChild(b);
      });
    }

    /* ---------- Unified location dropdown ----------
       Combines the operator's saved locations (POST /api/weather-location)
       with the 6 hardcoded presets so the user can switch from inside the
       3D WX panel without bouncing back to the dashboard.  Selection is
       bidirectional: changing it here POSTs to /api/weather-location AND
       fires `r5-location-change` so the dashboard's React state stays in
       sync with the new active location (one source of truth across the
       psy-chart strip and the 3D WX scatter cloud). */
    function _buildLocSelect(saved){
      var sel = $('#p3-loc-select');
      if (!sel) return;
      var seen = {};
      sel.innerHTML = '';
      // Group 1 — operator's own saved locations (first so user sees their sites first).
      if (Array.isArray(saved) && saved.length){
        var og1 = document.createElement('optgroup');
        og1.label = 'Saved locations';
        saved.forEach(function(loc){
          if (!loc || typeof loc.lat !== 'number' || typeof loc.lon !== 'number') return;
          var k = loc.lat.toFixed(4)+','+loc.lon.toFixed(4);
          if (seen[k]) return; seen[k] = true;
          var opt = document.createElement('option');
          opt.value = k;
          opt.dataset.lat = loc.lat;
          opt.dataset.lon = loc.lon;
          opt.dataset.name = loc.name || (loc.lat+','+loc.lon);
          opt.textContent = loc.name || (loc.lat+', '+loc.lon);
          og1.appendChild(opt);
        });
        if (og1.children.length) sel.appendChild(og1);
      }
      // Group 2 — 6 city presets, skipping any already covered by a saved row.
      var og2 = document.createElement('optgroup');
      og2.label = 'City presets';
      locs.forEach(function(l){
        var k = l[1].toFixed(4)+','+l[2].toFixed(4);
        if (seen[k]) return; seen[k] = true;
        var opt = document.createElement('option');
        opt.value = k;
        opt.dataset.lat = l[1];
        opt.dataset.lon = l[2];
        opt.dataset.name = l[3];
        opt.textContent = l[3] + ' ('+l[0]+')';
        og2.appendChild(opt);
      });
      sel.appendChild(og2);
      // Pre-select whatever the lat/lon inputs are currently showing.
      _syncLocSelectToInputs();
    }
    function _syncLocSelectToInputs(){
      var sel = $('#p3-loc-select');
      if (!sel) return;
      var la = parseFloat($('#p3-lat').value), lo = parseFloat($('#p3-lon').value);
      if (isNaN(la) || isNaN(lo)) return;
      var k = la.toFixed(4)+','+lo.toFixed(4);
      for (var i=0;i<sel.options.length;i++){
        if (sel.options[i].value === k){ sel.selectedIndex = i; return; }
      }
      // No match — leave dropdown on its existing value (custom lat/lon typed manually).
    }

    /* applyLocation({lat, lon, name}, {persist, fetch})
       Single funnel for every location change inside the engine.  Whether
       the trigger is a dropdown pick, a preset button, a public API call,
       or a dashboard sync, we always go through this so the inputs, the
       dropdown selection, the HUD label, the server, and the dashboard
       all see the same final state. */
    function applyLocation(loc, flags){
      if (!loc || typeof loc.lat !== 'number' || typeof loc.lon !== 'number') return;
      flags = flags || {};
      $('#p3-lat').value  = loc.lat;
      $('#p3-lon').value  = loc.lon;
      $('#p3-name').value = loc.name || ('Lat '+loc.lat+' / Lon '+loc.lon);
      _syncLocSelectToInputs();
      // Refresh pin star (★ if this location is the pinned default, ☆ otherwise).
      try { _refreshPinButtonState(); } catch(e){}
      if (flags.persist){
        // Fire-and-forget POST so the dashboard's weather-strip picks the
        // same active location on its next poll.  Anonymous requests get
        // a {persisted:false} response which we silently ignore.
        try {
          fetch('/api/weather-location', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            credentials: 'include',
            body: JSON.stringify({ active: {lat: loc.lat, lon: loc.lon, name: loc.name||''} })
          }).catch(function(){});
        } catch(e){}
        // Also broadcast to the dashboard's React state so the bottom
        // weather-strip flips instantly (without waiting for the POST
        // round-trip or the next /api/weather-location GET).
        try {
          window.dispatchEvent(new CustomEvent('r5-location-change', {
            detail: { lat: loc.lat, lon: loc.lon, name: loc.name || '' }
          }));
        } catch(e){}
        try { localStorage.setItem('weatherLocation', JSON.stringify({lat:loc.lat,lon:loc.lon,name:loc.name||''})); } catch(e){}
      }
      if (flags.fetch && typeof doFetch === 'function') doFetch();
    }

    /* Public API used by dashboard.html so a location change on the
       psy-chart's weather strip immediately re-fetches the 3D scatter
       cloud for the new lat/lon.  Avoids the stale-state bug where the
       3D WX tab kept showing the previous city's data until the user
       manually clicked Fetch Weather Data. */
    window.setPsy3DLocation = function(loc){
      if (!loc) return;
      // persist=false because the dashboard is the one telling us, so
      // posting back would echo into a feedback loop.
      applyLocation({lat:loc.lat, lon:loc.lon, name:loc.name}, {persist:false, fetch:true});
    };

    /* Dropdown change handler — push the picked location everywhere. */
    $('#p3-loc-select').onchange = function(){
      var opt = this.options[this.selectedIndex];
      if (!opt) return;
      applyLocation({
        lat:  parseFloat(opt.dataset.lat),
        lon:  parseFloat(opt.dataset.lon),
        name: opt.dataset.name || opt.textContent
      }, {persist:true, fetch:true});
    };

    /* ---------------------------------------------------------------
       SA PATH — measured-telemetry overlay state + wiring.
       _saSourceMode:  'modeled' | 'measured' | 'both'
       _saAhuId:       AHU id selected in the dropdown (or null)
       _saRibbonOn:    drift-ribbon sub-toggle (Both mode only)
       _saMeasured:    cached samples [{ts, sa_t, sa_rh, sa_w, oa_t, oa_rh, oa_w}]
                       indexed by ts in ms; null until first fetch succeeds.
       --------------------------------------------------------------- */
    /* Assignments, not declarations -- these live at engine scope so the
       geometry builders can see them (see the note there).  Re-running
       initPsy3D still resets them here. */
    _saSourceMode = 'modeled';
    _saAhuId      = null;
    _saRibbonOn   = false;
    _saMeasured   = null;
    /* Populate the AHU dropdown from /api/data once on init.  We don't
       block the rest of the engine on this -- if the call fails the
       dropdown stays empty and the user can still use Modeled mode. */
    (function _populateSaAhuDropdown(){
      var sel = document.getElementById('p3-sa-ahu');
      if (!sel) return;
      fetch('/api/data').then(function(r){return r.ok ? r.json() : [];}).then(function(arr){
        if (!Array.isArray(arr)) return;
        arr.forEach(function(a){
          if (!a || !a.id) return;
          var opt = document.createElement('option');
          opt.value = a.id;
          opt.textContent = a.id;
          sel.appendChild(opt);
        });
      }).catch(function(){ /* leave dropdown empty on failure */ });
    })();
    /* Fetch SA measured timeseries for the current AHU + weatherData
       window.  Returns a Promise resolving to the samples array (may
       be empty); rejects on transport / 4xx errors. */
    function _fetchSaTimeseries(){
      if (!_saAhuId || !weatherData || !weatherData.length) {
        return Promise.resolve([]);
      }
      var fromTs = Math.floor(new Date(weatherData[0].ts).getTime() / 1000);
      var toTs   = Math.floor(new Date(weatherData[weatherData.length-1].ts).getTime() / 1000) + 3600;
      var step   = 900;  /* 15-min cadence — coarse enough for a year, dense enough for 24h */
      var url = '/api/ahu/' + encodeURIComponent(_saAhuId) +
                '/sa-timeseries?from_ts=' + fromTs +
                '&to_ts=' + toTs + '&step_s=' + step;
      _saSetStatus('Fetching ' + _saAhuId + '\u2026', '#94a3b8');
      return fetch(url).then(function(r){
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      }).then(function(d){
        var samples = (d && d.samples) || [];
        _saSetStatus(samples.length + ' samples (' + Math.round((toTs-fromTs)/86400) + 'd window, ' + step + 's step)', '#22d3ee');
        return samples;
      }).catch(function(e){
        _saSetStatus('error: ' + e.message, '#ef4444');
        return [];
      });
    }
    /* Refresh handler: pulls measured data (if needed) then rebuilds
       the SA Path geometry layer.  Idempotent. */
    function _refreshSaPath(forceRefetch){
      /* The Mix / Coil layer needs the same measured samples, so its
         visibility counts as a reason to fetch even in Modeled mode. */
      var needsMeasured = (_saSourceMode === 'measured' || _saSourceMode === 'both'
                           || !!(maSplitGroup && maSplitGroup.visible));
      var promise;
      if (needsMeasured && _saAhuId && (forceRefetch || !_saMeasured || !_saMeasured.length)) {
        promise = _fetchSaTimeseries().then(function(arr){ _saMeasured = arr; });
      } else {
        if (!needsMeasured) _saSetStatus('Modeled (controller logic, no telemetry fetch)', '#94a3b8');
        promise = Promise.resolve();
      }
      promise.then(function(){
        if (typeof _buildSaPathGeometry === 'function') _buildSaPathGeometry();
        if (typeof _buildMaSplitGeometry === 'function') _buildMaSplitGeometry();
      });
    }
    /* Wire the three controls.  AHU / Source changes refetch; ribbon
       toggle only restyles. */
    document.getElementById('p3-sa-ahu').onchange = function(){
      _saAhuId = this.value || null;
      _saMeasured = null;
      _refreshSaPath(true);
    };
    document.getElementById('p3-sa-source').onchange = function(){
      _saSourceMode = this.value;
      var ribbonRow = document.getElementById('p3-sa-ribbon-row');
      if (ribbonRow) ribbonRow.style.display = (_saSourceMode === 'both') ? '' : 'none';
      _refreshSaPath(false);
    };
    document.getElementById('p3-sa-ribbon').onchange = function(){
      _saRibbonOn = !!this.checked;
      if (typeof _buildSaPathGeometry === 'function') _buildSaPathGeometry();
    };
    /* Selecting a different AHU invalidates MA too -- same samples. */
    /* Expose the refresh hook for buildWeatherVis so the SA layer
       auto-refetches whenever a new OA window is loaded. */
    window.__psy3dRefreshSaPath = _refreshSaPath;

    /* Initial population — fetch /api/weather-location once, then rebuild
       the dropdown.  Refreshing the saved list later (after the operator
       adds a new city in the dashboard modal) happens automatically on
       the next visit. */
    var _pinnedKey = '';  // "lat.toFixed(4),lon.toFixed(4)" of the pinned default
    function _refreshPinButtonState(){
      var btn = $('#p3-loc-pin'); if (!btn) return;
      var la = parseFloat($('#p3-lat').value), lo = parseFloat($('#p3-lon').value);
      var key = (isNaN(la)||isNaN(lo)) ? '' : la.toFixed(4)+','+lo.toFixed(4);
      var isPinned = key && key === _pinnedKey;
      btn.textContent = isPinned ? '\u2605' : '\u2606';   // ★ vs ☆
      btn.style.color       = isPinned ? '#fbbf24' : '#64748b';
      btn.style.borderColor = isPinned ? '#fbbf24' : '#475569';
      btn.title = isPinned
        ? 'Pinned as default \u2014 click to unpin'
        : 'Pin as default \u2014 auto-load this on every fresh session';
    }
    $('#p3-loc-pin').onclick = function(){
      var la = parseFloat($('#p3-lat').value), lo = parseFloat($('#p3-lon').value);
      if (isNaN(la) || isNaN(lo)) return;
      var key = la.toFixed(4)+','+lo.toFixed(4);
      var nowPinned = (key !== _pinnedKey);
      var body = nowPinned
        ? { default: { lat: la, lon: lo, name: $('#p3-name').value || '' } }
        : { default: null };
      _pinnedKey = nowPinned ? key : '';
      _refreshPinButtonState();
      try {
        fetch('/api/weather-location', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          credentials: 'include',
          body: JSON.stringify(body)
        }).catch(function(){});
      } catch(e){}
      // Mirror to localStorage so the dashboard sees the pin without a refetch.
      try {
        if (nowPinned) localStorage.setItem('defaultWeatherLocation', JSON.stringify(body.default));
        else localStorage.removeItem('defaultWeatherLocation');
      } catch(e){}
    };

    fetch('/api/weather-location', { credentials:'include' })
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(j){
        if (j) _buildLocSelect(j.saved || []);
        if (j && j.default && typeof j.default.lat === 'number'){
          _pinnedKey = j.default.lat.toFixed(4)+','+j.default.lon.toFixed(4);
        }
        _refreshPinButtonState();
      })
      .catch(function(){ _buildLocSelect([]); _refreshPinButtonState(); });

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
    var layers={chart:basePlane,path:pathGroup,proj:projGroup,comfort:czGroup,dhFloor:dhFloorGroup,vav:vavGroup,saDrop:saDropGroup,saPath:saPathGroup,rhBand:rhBandGroup,maSplit:maSplitGroup};
    [['chart','#60a5fa','Psy Chart'],['path','#f472b6','Weather Path'],['proj','#fbbf24','Base Proj'],['comfort','#10b981','Comfort 3D'],['rhBand','#ec4899','RH Band'],['dhFloor','#f59e0b','\u0394H Strip'],['vav','#a78bfa','VAV CZ'],['saDrop','#22d3ee','OA\u2192SA Drops'],['saPath','#f59e0b','SA Path'],['maSplit','#8b5cf6',_t('layer_mix_coil','Mix / Coil')]].forEach(function(t){
      var div=document.createElement('div');div.className='p3-tgl';div.id='p3-tgl-'+t[0];
      div.innerHTML='<span class="p3td" style="background:'+t[1]+'"></span>'+t[2];
      // Sync initial off-state for layers that start hidden (saDropGroup).
      if (layers[t[0]] && layers[t[0]].visible === false) div.classList.add('p3off');
      div.onclick=function(){var o=layers[t[0]];if(!o)return;o.visible=!o.visible;div.classList.toggle('p3off',!o.visible);
        // Keep the OA→SA Drops color-mode chip in sync with its parent visibility.
        if (t[0]==='saDrop') {
          var chip=document.getElementById('p3-saDrop-color');
          if (chip) chip.style.display = o.visible ? 'inline-flex' : 'none';
          var ervChip=document.getElementById('p3-saDrop-erv');
          if (ervChip) ervChip.style.display = o.visible ? 'inline-flex' : 'none';
        }
        // Toggling RH BAND on/off also flips the scatter between
        // split (in-band 1.6× + out-band 1×) and unified (uniform
        // markers).  Rebuilding the weather vis is a single pass —
        // no refetch, no perceptible lag at the 720..8760-point
        // typical sizes. */
        /* This layer is the only one that needs a fetch to have anything
           to draw: MA comes from the selected AHU's timeseries, not from
           Open-Meteo.  Ask for a refresh on the way on; _refreshSaPath
           now treats this layer's visibility as a reason to fetch. */
        if (t[0]==='maSplit' && o.visible) {
          if (typeof window.__psy3dRefreshSaPath === 'function') window.__psy3dRefreshSaPath(false);
        }
        if (t[0]==='rhBand') {
          var tchip = document.getElementById('p3-rhBand-tclip');
          if (tchip) tchip.style.display = o.visible ? 'inline-flex' : 'none';
          if (weatherData.length > 0 && _lastWeatherCtx) {
            buildWeatherVis(_lastWeatherCtx.locName, _lastWeatherCtx.fromD, _lastWeatherCtx.toD);
          }
        }
      };
      tgEl.appendChild(div);
      // T-clip sub-chip beside the RH BAND row.  Operators flip between
      //   FREE  = highlight any sample whose RH ∈ [lo,hi], regardless of T
      //   T-CLIP = strict: also require T ∈ [21,27 °C] (the slab volume)
      // Default FREE.  Persisted in localStorage so it survives reloads.
      if (t[0]==='rhBand') {
        var tcChip = document.createElement('div');
        tcChip.id = 'p3-rhBand-tclip';
        tcChip.style.cssText = 'display:none;align-items:center;gap:0;background:rgba(15,23,42,.92);border:1px solid #334155;border-radius:4px;padding:0 0;cursor:pointer;font-size:7px;font-weight:900;letter-spacing:.05em;text-transform:uppercase;user-select:none;backdrop-filter:blur(14px);overflow:hidden';
        tcChip.title = 'In-band highlight mode\n  FREE   = any sample with RH \u2208 [lo,hi] gets the 1.6\u00D7 marker (across the whole year)\n  T-CLIP = strict: also require T \u2208 [' + RH_BAND_T_CLIP_LO + ',' + RH_BAND_T_CLIP_HI + ' \u00B0C], so the highlight matches the slab volume';
        function _renderTcChip() {
          var on = !!_rhBandTight;
          tcChip.innerHTML =
            '<span data-tc="off" style="padding:3px 7px;color:'+(!on?'#ec4899':'#94a3b8')+';background:'+(!on?'rgba(236,72,153,.15)':'transparent')+'">FREE</span>'+
            '<span style="color:#475569">|</span>'+
            '<span data-tc="on"  style="padding:3px 7px;color:'+( on?'#ec4899':'#94a3b8')+';background:'+( on?'rgba(236,72,153,.15)':'transparent')+'">T\u00B7CLIP</span>';
          tcChip.style.borderColor = on ? '#ec4899' : '#334155';
        }
        _renderTcChip();
        tcChip.addEventListener('click', function(e){
          var s = e.target.closest('[data-tc]');
          if (!s) return;
          var on = s.getAttribute('data-tc') === 'on';
          if (on === !!_rhBandTight) return;
          _rhBandTight = on;
          try { localStorage.setItem('red5_rh_band_tight', on ? '1' : '0'); } catch(err){}
          _renderTcChip();
          if (weatherData.length > 0 && _lastWeatherCtx) {
            buildWeatherVis(_lastWeatherCtx.locName, _lastWeatherCtx.fromD, _lastWeatherCtx.toD);
          }
        });
        // Initial visibility tracks the rhBand layer (default ON for rhBand → chip shows on init).
        if (rhBandGroup && rhBandGroup.visible) tcChip.style.display = 'inline-flex';
        tgEl.appendChild(tcChip);
      }
      // Append the small `T | B` color-mode chip next to the OA→SA Drops row.
      // Re-uses the same .p3-tgl styling but renders two clickable spans, with
      // the active mode highlighted in the layer's accent color (cyan).
      if (t[0]==='saDrop'){
        var chip=document.createElement('div');
        chip.id='p3-saDrop-color';
        chip.style.cssText='display:none;align-items:center;gap:0;background:rgba(15,23,42,.92);border:1px solid #334155;border-radius:4px;padding:0 0;cursor:pointer;font-size:7px;font-weight:900;letter-spacing:.05em;text-transform:uppercase;user-select:none;backdrop-filter:blur(14px);overflow:hidden';
        chip.title='Drop color mode\n  T    = OA temperature spectrum (blue-cold → red-hot)\n  Band = SA-reset band palette (B1-B10, matches 2D OA→SA Lines view)';
        function _renderChip(){
          // Self-heal: if anything else clobbered the closure variable to a
          // non-string before first render, fall back to 't' (the default).
          if (_saDropColorMode !== 'band') _saDropColorMode = 't';
          var on = (_saDropColorMode === 't');
          chip.innerHTML =
            '<span data-mode="t"    style="padding:3px 7px;color:'    +(on?'#22d3ee':'#94a3b8')+';background:'+(on?'rgba(34,211,238,.15)':'transparent')+'">T</span>'+
            '<span style="color:#475569">|</span>'+
            '<span data-mode="band" style="padding:3px 7px;color:'    +(!on?'#22d3ee':'#94a3b8')+';background:'+(!on?'rgba(34,211,238,.15)':'transparent')+'">B</span>';
        }
        _renderChip();
        chip.addEventListener('click', function(e){
          var s = e.target.closest('[data-mode]');
          if (!s) return;
          var m = s.getAttribute('data-mode');
          if (m === _saDropColorMode) return;
          _saDropColorMode = m;
          _renderChip();
          _buildSaDropGeometry();   // recolor in place — no weather refetch
        });
        // Initial visibility tracks the layer (default: hidden until user enables it).
        if (saDropGroup && saDropGroup.visible) chip.style.display = 'inline-flex';
        tgEl.appendChild(chip);

        /* ERV pre-treatment chip -- second toggle next to the T|B chip.
           Off by default; when ON, the Drops layer re-routes every OA
           point through OA' (using Designer Mode's epsilon + RA inputs)
           so the post-wheel cloud is what you see drop to the SA floor.
           Pulses with a cyan highlight when active so the modal nature
           of the layer is unmistakable. */
        var ervChip=document.createElement('div');
        ervChip.id='p3-saDrop-erv';
        ervChip.style.cssText='display:none;align-items:center;gap:0;background:rgba(15,23,42,.92);border:1px solid #334155;border-radius:4px;padding:0 0;cursor:pointer;font-size:7px;font-weight:900;letter-spacing:.05em;text-transform:uppercase;user-select:none;backdrop-filter:blur(14px);overflow:hidden';
        ervChip.title='Pre-treat OA through an ERV wheel before drawing the drop. Uses Designer Mode\'s epsilon + RA inputs. When ON, the cloud shows POST-wheel conditions -- the actual air the coil sees.';
        function _renderErvChip(){
          var on = !!_saDropERVOn;
          ervChip.innerHTML =
            '<span data-erv="off" style="padding:3px 7px;color:'+(!on?'#22d3ee':'#94a3b8')+';background:'+(!on?'rgba(34,211,238,.15)':'transparent')+'">ERV</span>'+
            '<span style="color:#475569">|</span>'+
            '<span data-erv="on"  style="padding:3px 7px;color:'+( on?'#22d3ee':'#94a3b8')+';background:'+( on?'rgba(34,211,238,.15)':'transparent')+'">\u00B7</span>';
          ervChip.style.borderColor = on ? '#22d3ee' : '#334155';
        }
        _renderErvChip();
        ervChip.addEventListener('click', function(e){
          var s = e.target.closest('[data-erv]');
          if (!s) return;
          var want = (s.getAttribute('data-erv') === 'on');
          if (want === _saDropERVOn) return;
          _saDropERVOn = want;
          try { localStorage.setItem('red5SaDropERV', want ? '1' : '0'); } catch(_) {}
          _renderErvChip();
          _buildSaDropGeometry();
        });
        if (saDropGroup && saDropGroup.visible) ervChip.style.display = 'inline-flex';
        tgEl.appendChild(ervChip);

        /* ERV legend chip -- two-swatch readout that auto-appears whenever
           BOTH the Drops layer is visible AND the ERV toggle is ON. Tells
           new operators what the two colors in the cloud mean without
           making them hunt through tooltips:
             [cyan bar]  ERV SAVED   -- horizontal ribbons at cloud top
             [T-spec  ]  COIL WORK   -- vertical drops to the SA floor
           Background and border match the chips above for visual unity. */
        var ervLegend=document.createElement('div');
        ervLegend.id='p3-saDrop-erv-legend';
        ervLegend.style.cssText='display:none;align-items:center;gap:6px;background:rgba(15,23,42,.92);border:1px solid #22d3ee;border-radius:4px;padding:3px 7px;font-size:7px;font-weight:900;letter-spacing:.05em;text-transform:uppercase;user-select:none;backdrop-filter:blur(14px)';
        ervLegend.title='Color legend: cyan = energy the ERV wheel saved per hour; temperature-spectrum drop = the remaining coil work after pre-treatment.';
        // Temperature-spectrum gradient swatch (blue → cyan → green → yellow → red)
        // mirrors what t2rgb() produces across the OA temperature range.
        ervLegend.innerHTML =
          '<span style="display:inline-block;width:14px;height:5px;background:#22d3ee;border-radius:1px"></span>'+
          '<span style="color:#22d3ee">ERV saved</span>'+
          '<span style="color:#475569;padding:0 2px">|</span>'+
          '<span style="display:inline-block;width:18px;height:5px;background:linear-gradient(to right,#2563eb,#22d3ee,#84cc16,#fbbf24,#ef4444);border-radius:1px"></span>'+
          '<span style="color:#94a3b8">coil work</span>';
        function _refreshErvLegend(){
          var on = !!_saDropERVOn && !!(saDropGroup && saDropGroup.visible);
          ervLegend.style.display = on ? 'inline-flex' : 'none';
        }
        // Hook into existing event surfaces:
        //   1. ERV chip click already calls _renderErvChip + _buildSaDropGeometry;
        //      wrap its listener to also refresh us.
        //   2. Drops layer toggle click already adjusts the chip displays;
        //      we ride along by patching the same path.
        // Cheapest: poll-on-event style via a microtask after each click.
        ervChip.addEventListener('click', function(){ setTimeout(_refreshErvLegend, 0); });
        // tgEl click bubbles up from the Drops row too; refresh after any
        // toggle inside the panel to catch the parent-layer hide path.
        tgEl.addEventListener('click', function(){ setTimeout(_refreshErvLegend, 0); });
        _refreshErvLegend();
        tgEl.appendChild(ervLegend);

        /* ----------------------------------------------------------------
           ERV ROLLOUT PANEL — appended at the document level (not inside
           tgEl) and absolutely positioned at the bottom-left corner of
           the 3D root so it never crowds the toggle list.  Auto-shows
           only when BOTH the Drops layer is visible AND ERV is ON, same
           gate as the legend.  Renders annual rollup + sparkline + ROI
           drawer + climate-zone preset + threshold + ghost ε + CSV. */
        var rollout = document.createElement('div');
        rollout.id = 'p3-erv-rollout';
        rollout.style.cssText =
          'position:absolute;left:14px;bottom:14px;z-index:18;display:none;'+
          'min-width:320px;max-width:480px;background:rgba(15,23,42,.92);'+
          'border:1px solid #22d3ee;border-radius:6px;padding:9px 11px 14px;'+
          'font-family:\'Courier New\',monospace;font-size:9px;line-height:1.6;'+
          'color:#cbd5e1;backdrop-filter:blur(14px);user-select:none';
        /* Revival chip — shown only when the user has explicitly closed the
           full panel via the ✕ button.  Reads the latest aggregate snapshot
           so the dollar number stays current even while collapsed. */
        var revive = document.createElement('div');
        revive.id = 'p3-erv-revive';
        revive.style.cssText =
          'position:absolute;left:14px;bottom:14px;z-index:18;display:none;'+
          'background:rgba(15,23,42,.92);border:1px solid #22d3ee;border-radius:4px;'+
          'padding:5px 9px;cursor:pointer;font-family:\'Courier New\',monospace;'+
          'font-size:9px;font-weight:900;color:#22d3ee;letter-spacing:.05em;'+
          'text-transform:uppercase;backdrop-filter:blur(14px);user-select:none';
        revive.title = 'Reopen ERV Rollout panel';
        revive.addEventListener('click', function(){
          _ervRolloutClosed = false;
          _ervRolloutSave();
          _renderRollout();
        });
        function _applyRolloutGeometry(){
          /* If user has dragged the panel, switch from bottom/left anchoring
             to top/left coordinates so the drag math stays in one frame.
             Same coordinate flip is applied to the revival chip. */
          var els = [rollout, revive];
          els.forEach(function(el){
            if (_ervRolloutPos && typeof _ervRolloutPos.x === 'number'){
              el.style.left   = _ervRolloutPos.x + 'px';
              el.style.top    = _ervRolloutPos.y + 'px';
              el.style.right  = 'auto';
              el.style.bottom = 'auto';
            } else {
              el.style.left   = '14px';
              el.style.bottom = '14px';
              el.style.top    = 'auto';
              el.style.right  = 'auto';
            }
          });
          if (_ervRolloutSize) {
            if (typeof _ervRolloutSize.w === 'number') rollout.style.width  = _ervRolloutSize.w + 'px';
            if (typeof _ervRolloutSize.h === 'number') rollout.style.height = _ervRolloutSize.h + 'px';
          }
        }
        function _wireDragHandle(handle){
          handle.style.cursor = 'move';
          handle.addEventListener('mousedown', function(e){
            /* Ignore drags that started on buttons/inputs inside the header
               (e.g., the ✕ button or the CSV/ROI/PEAKS toggle row). */
            if (e.target.closest('button, input, select, [data-erv-input], [data-erv-btn]')) return;
            e.preventDefault();
            var startX = e.clientX, startY = e.clientY;
            var rect = rollout.getBoundingClientRect();
            var rootRect = root.getBoundingClientRect();
            var origX = rect.left - rootRect.left;
            var origY = rect.top  - rootRect.top;
            function onMove(ev){
              var nx = Math.max(0, Math.min(rootRect.width  - 50, origX + (ev.clientX - startX)));
              var ny = Math.max(0, Math.min(rootRect.height - 30, origY + (ev.clientY - startY)));
              _ervRolloutPos = { x: nx, y: ny };
              _applyRolloutGeometry();
            }
            function onUp(){
              window.removeEventListener('mousemove', onMove);
              window.removeEventListener('mouseup',   onUp);
              _ervRolloutSave();
            }
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup',   onUp);
          });
        }
        /* Resize grip — bottom-right corner handle */
        var grip = document.createElement('div');
        grip.id = 'p3-erv-grip';
        grip.style.cssText =
          'position:absolute;right:2px;bottom:2px;width:12px;height:12px;'+
          'cursor:nwse-resize;opacity:.6;z-index:1;'+
          'background:linear-gradient(135deg,transparent 0%,transparent 40%,#22d3ee 40%,#22d3ee 45%,transparent 45%,transparent 55%,#22d3ee 55%,#22d3ee 60%,transparent 60%)';
        grip.title = 'Drag to resize';
        grip.addEventListener('mousedown', function(e){
          e.preventDefault(); e.stopPropagation();
          var startX = e.clientX, startY = e.clientY;
          var rect = rollout.getBoundingClientRect();
          var startW = rect.width, startH = rect.height;
          function onMove(ev){
            var nw = Math.max(260, Math.min(800, startW + (ev.clientX - startX)));
            var nh = Math.max(120, Math.min(700, startH + (ev.clientY - startY)));
            _ervRolloutSize = { w: nw, h: nh };
            rollout.style.width  = nw + 'px';
            rollout.style.height = nh + 'px';
          }
          function onUp(){
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup',   onUp);
            _ervRolloutSave();
          }
          window.addEventListener('mousemove', onMove);
          window.addEventListener('mouseup',   onUp);
        });
        function _ervCurrencyOpt(){
          var z = _ervClimateZones.find(function(c){return c.id===_ervClimateZone;}) || _ervClimateZones[0];
          return z.currency || '$';
        }
        function _ervPresetOptions(){
          return _ervClimateZones.map(function(c){
            var rate = (c.kwh==null) ? '' : (' \u2014 ' + (c.currency||'$') + c.kwh.toFixed(3) + '/kWh');
            return '<option value="'+c.id+'"'+(c.id===_ervClimateZone?' selected':'')+'>'+c.name+rate+'</option>';
          }).join('');
        }
        function _ervMonthlySpark(monthly, maxKWh){
          /* Bars are pure CSS divs; cyan height-mapped.  No SVG needed. */
          var names = ['J','F','M','A','M','J','J','A','S','O','N','D'];
          var max = maxKWh > 0.001 ? maxKWh : 1;
          var bars = '';
          for (var m=0;m<12;m++){
            var h = monthly[m].kWh > 0 ? Math.max(2, Math.round(28 * monthly[m].kWh / max)) : 1;
            var col = monthly[m].kWh > 0 ? '#22d3ee' : '#1e293b';
            var ttl = names[m]+': '+monthly[m].kWh.toFixed(0)+' kWh, '+monthly[m].hours+' h';
            bars += '<div title="'+ttl+'" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px">'+
              '<div style="width:100%;height:'+h+'px;background:'+col+';opacity:.9;border-radius:1px 1px 0 0"></div>'+
              '<div style="font-size:7px;color:#64748b">'+names[m]+'</div>'+
              '</div>';
          }
          return '<div style="display:flex;align-items:flex-end;gap:2px;height:34px;margin:4px 0 2px">'+bars+'</div>';
        }
        function _renderRollout(){
          var on = !!_saDropERVOn && !!(saDropGroup && saDropGroup.visible);
          /* When ERV gets toggled OFF, automatically clear the closed
             flag so the next time the user enables ERV the full panel
             pops back open instead of just the chip.  This means the
             close button is "session-scoped" within a single ERV-on
             session — predictable behaviour without surprise. */
          if (!on && _ervRolloutClosed) {
            _ervRolloutClosed = false;
            _ervRolloutSave();
          }
          rollout.style.display = (on && !_ervRolloutClosed) ? 'block' : 'none';
          revive.style.display  = (on &&  _ervRolloutClosed) ? 'inline-block' : 'none';
          if (!on) {
            /* Clear the dashboard badge by publishing a disabled snapshot. */
            try {
              var snapOff = { enabled:false, ts:Date.now() };
              window.red5ErvSnapshot = snapOff;
              localStorage.setItem('red5ErvSnapshot', JSON.stringify(snapOff));
              window.dispatchEvent(new CustomEvent('red5-erv-rollout-update', {detail: snapOff}));
            } catch(_) {}
            return;
          }
          if (!weatherData || !weatherData.length) {
            rollout.innerHTML = '<div id="p3-erv-header" style="display:flex;justify-content:space-between;align-items:center;cursor:move">'+
              '<div style="color:#fbbf24;font-weight:900;text-transform:uppercase;letter-spacing:.08em">ERV Rollout</div>'+
              '<button data-erv-btn="close" title="Close" style="background:transparent;border:1px solid #475569;color:#fb7185;padding:0 5px;font:inherit;font-size:9px;cursor:pointer;border-radius:2px">\u2715</button>'+
              '</div>'+
              '<div style="color:#94a3b8;margin-top:6px">Fetch weather data first to see annual savings.</div>';
            rollout.querySelector('[data-erv-btn=close]').addEventListener('click', function(){ _ervRolloutClosed = true; _ervRolloutSave(); _renderRollout(); });
            _wireDragHandle(rollout.querySelector('#p3-erv-header'));
            _applyRolloutGeometry();
            return;
          }
          var series = _ervSavingsSeries(_designerERVEps);
          var agg    = _ervAggregate(series);
          var roi    = _ervROI(agg.totalUSD);
          /* Publish snapshot for the dashboard's PSYCH-tab AHU sidebar
             badge (and any other consumer).  Written to BOTH the global
             window object AND localStorage so a fresh dashboard page-load
             can hydrate the badge before the 3D engine has mounted, and a
             CustomEvent fires for in-page listeners. */
          try {
            var snap = {
              enabled: true,
              totalUSD: agg.totalUSD,
              totalRtH: agg.totalRtH,
              totalKWh: agg.totalKWh,
              payback:  roi.payback,
              npv:      roi.npv,
              tariffKwh: _ervTariffKwh,
              zone:     _ervClimateZone,
              eps:      _designerERVEps,
              ts:       Date.now()
            };
            window.red5ErvSnapshot = snap;
            localStorage.setItem('red5ErvSnapshot', JSON.stringify(snap));
            window.dispatchEvent(new CustomEvent('red5-erv-rollout-update', {detail: snap}));
          } catch(_) {}
          var ghostAgg = null;
          if (_ervGhostEps > 0 && Math.abs(_ervGhostEps - _designerERVEps) > 0.005) {
            var gS = _ervSavingsSeries(_ervGhostEps);
            ghostAgg = _ervAggregate(gS);
          }
          var maxMonth = 0;
          for (var m=0;m<12;m++) if (agg.monthly[m].kWh > maxMonth) maxMonth = agg.monthly[m].kWh;
          var cur = _ervCurrencyOpt();

          var paybackStr = isFinite(roi.payback)
            ? (roi.payback < 99 ? roi.payback.toFixed(1)+' yr' : '\u003e 99 yr')
            : 'never';
          var npvStr = _ervFmtMoney(roi.npv);
          var npvCol = roi.npv > 0 ? '#22d3ee' : '#fb7185';

          var ghostHtml = '';
          if (ghostAgg) {
            var delta = ghostAgg.totalUSD - agg.totalUSD;
            ghostHtml = '<div style="margin-top:5px;padding:4px 6px;background:rgba(168,85,247,.10);border-left:2px solid #a855f7;border-radius:2px;font-size:8px">'+
              '<b style="color:#c084fc;letter-spacing:.05em">A/B \u03b5='+_ervGhostEps.toFixed(2)+':</b> '+
              _ervFmtMoney(ghostAgg.totalUSD)+'/yr '+
              '<span style="color:'+(delta>=0?'#22d3ee':'#fb7185')+'">('+(delta>=0?'+':'')+_ervFmtMoney(delta)+' vs \u03b5='+_designerERVEps.toFixed(2)+')</span>'+
              '</div>';
          }

          var roiBody = '';
          if (_ervRoiOpen) {
            roiBody =
              '<div style="margin-top:6px;padding-top:5px;border-top:1px dashed #334155">'+
                '<div style="display:flex;gap:6px;align-items:center;margin-bottom:4px">'+
                  '<label style="flex:1;color:#94a3b8">Install '+cur+'</label>'+
                  '<input data-erv-input="install" type="number" value="'+_ervInstallCost+'" style="width:80px;background:#020617;border:1px solid #334155;color:#e2e8f0;padding:1px 4px;font:inherit;border-radius:2px"/>'+
                '</div>'+
                '<div style="display:flex;gap:6px;align-items:center;margin-bottom:4px">'+
                  '<label style="flex:1;color:#94a3b8">Maint/yr '+cur+'</label>'+
                  '<input data-erv-input="maint" type="number" value="'+_ervMaintAnnual+'" style="width:80px;background:#020617;border:1px solid #334155;color:#e2e8f0;padding:1px 4px;font:inherit;border-radius:2px"/>'+
                '</div>'+
                '<div style="display:flex;gap:6px;align-items:center;margin-bottom:4px">'+
                  '<label style="flex:1;color:#94a3b8">Tariff '+cur+'/kWh</label>'+
                  '<input data-erv-input="tariff" type="number" step="0.001" value="'+_ervTariffKwh.toFixed(3)+'" style="width:80px;background:#020617;border:1px solid #334155;color:#e2e8f0;padding:1px 4px;font:inherit;border-radius:2px"/>'+
                '</div>'+
                '<div style="display:flex;gap:10px;margin-top:5px;font-size:9px">'+
                  '<div>Payback <b style="color:#fbbf24">'+paybackStr+'</b></div>'+
                  '<div>10-yr NPV <b style="color:'+npvCol+'">'+npvStr+'</b></div>'+
                '</div>'+
              '</div>';
          }

          rollout.innerHTML =
            '<div id="p3-erv-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;cursor:move">'+
              '<div style="color:#22d3ee;font-weight:900;text-transform:uppercase;letter-spacing:.10em;font-size:9px">ERV Rollout</div>'+
              '<div style="display:flex;gap:4px">'+
                '<button data-erv-btn="csv"     style="background:transparent;border:1px solid #475569;color:#94a3b8;padding:1px 5px;font:inherit;font-size:7px;cursor:pointer;border-radius:2px" title="Download hourly CSV">CSV</button>'+
                '<button data-erv-btn="roi"     style="background:transparent;border:1px solid '+(_ervRoiOpen?'#fbbf24':'#475569')+';color:'+(_ervRoiOpen?'#fbbf24':'#94a3b8')+';padding:1px 5px;font:inherit;font-size:7px;cursor:pointer;border-radius:2px" title="ROI inputs">ROI '+(_ervRoiOpen?'\u25BC':'\u25B6')+'</button>'+
                '<button data-erv-btn="peaks"   style="background:transparent;border:1px solid '+(_ervShowPeaks?'#22d3ee':'#475569')+';color:'+(_ervShowPeaks?'#22d3ee':'#94a3b8')+';padding:1px 5px;font:inherit;font-size:7px;cursor:pointer;border-radius:2px" title="Highlight top-3 peak hours">PEAKS</button>'+
                '<button data-erv-btn="close"   style="background:transparent;border:1px solid #475569;color:#fb7185;padding:1px 5px;font:inherit;font-size:9px;cursor:pointer;border-radius:2px" title="Close panel (toggle ERV off-then-on to reopen)">\u2715</button>'+
              '</div>'+
            '</div>'+
            /* Climate-zone preset */
            '<div style="display:flex;gap:5px;align-items:center;font-size:8px;margin-bottom:3px">'+
              '<span style="color:#64748b">Region</span>'+
              '<select data-erv-input="zone" style="flex:1;background:#020617;border:1px solid #334155;color:#cbd5e1;font:inherit;padding:1px 3px;border-radius:2px">'+
                _ervPresetOptions()+
              '</select>'+
            '</div>'+
            /* Main rollup */
            '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:3px">'+
              '<div><b style="color:#22d3ee;font-size:13px">'+_ervFmtMoney(agg.totalUSD)+'</b><span style="color:#94a3b8"> /yr saved</span></div>'+
              '<div style="color:#94a3b8;font-size:8px">'+_ervFmtRtH(agg.totalRtH)+' &middot; '+agg.totalKWh.toFixed(0)+' kWh</div>'+
            '</div>'+
            ghostHtml+
            /* Monthly sparkline */
            _ervMonthlySpark(agg.monthly, maxMonth)+
            /* Threshold + ghost epsilon */
            '<div style="display:flex;gap:8px;align-items:center;margin-top:3px;font-size:8px">'+
              '<span style="color:#64748b">Min kJ/kg</span>'+
              '<input data-erv-input="minKJ" type="range" min="0" max="20" step="0.5" value="'+_ervMinKJkg+'" style="flex:1;accent-color:#22d3ee"/>'+
              '<span style="color:#cbd5e1;min-width:24px;text-align:right" data-erv-display="minKJ">'+_ervMinKJkg.toFixed(1)+'</span>'+
            '</div>'+
            '<div style="display:flex;gap:8px;align-items:center;font-size:8px">'+
              '<span style="color:#64748b">A/B ghost \u03b5</span>'+
              '<input data-erv-input="ghostEps" type="number" min="0" max="0.95" step="0.05" value="'+_ervGhostEps.toFixed(2)+'" style="width:50px;background:#020617;border:1px solid #334155;color:#e2e8f0;padding:1px 4px;font:inherit;border-radius:2px"/>'+
              '<span style="color:#64748b;font-size:7px">(0 = off)</span>'+
            '</div>'+
            roiBody;

          /* Wire input handlers */
          rollout.querySelectorAll('[data-erv-input]').forEach(function(el){
            var key = el.getAttribute('data-erv-input');
            var handler = function(){
              var v = el.value;
              if (key === 'zone') {
                _ervClimateZone = v;
                var z = _ervClimateZones.find(function(c){return c.id===v;});
                if (z && z.kwh != null) _ervTariffKwh = z.kwh;
              } else if (key === 'tariff') {
                _ervTariffKwh = parseFloat(v) || 0;
                _ervClimateZone = 'CUSTOM';
              } else if (key === 'install')  _ervInstallCost = parseFloat(v) || 0;
              else if (key === 'maint')      _ervMaintAnnual = parseFloat(v) || 0;
              else if (key === 'minKJ')      { _ervMinKJkg = parseFloat(v) || 0;
                                                var disp = rollout.querySelector('[data-erv-display=minKJ]');
                                                if (disp) disp.textContent = _ervMinKJkg.toFixed(1);
                                                _buildSaDropGeometry(); }
              else if (key === 'ghostEps')   { _ervGhostEps = Math.max(0, Math.min(0.95, parseFloat(v) || 0));
                                                _buildSaDropGeometry(); }
              _ervRolloutSave();
              if (key === 'minKJ') return; /* avoid full re-render on drag */
              _renderRollout();
            };
            el.addEventListener('change', handler);
            if (el.tagName === 'INPUT' && el.type === 'range') el.addEventListener('input', handler);
          });
          /* Wire buttons */
          rollout.querySelectorAll('[data-erv-btn]').forEach(function(b){
            var k = b.getAttribute('data-erv-btn');
            b.addEventListener('click', function(){
              if (k === 'roi')   { _ervRoiOpen = !_ervRoiOpen; _ervRolloutSave(); _renderRollout(); }
              else if (k === 'peaks') { _ervShowPeaks = !_ervShowPeaks; _ervRolloutSave(); _buildSaDropGeometry(); _renderRollout(); }
              else if (k === 'csv')   { _ervExportCsv(); }
              else if (k === 'close') { _ervRolloutClosed = true; _ervRolloutSave(); _renderRollout(); }
            });
          });
          /* Drag + resize.  Attach AFTER innerHTML rewrite (handle nodes
             are freshly created on each render).  Position/size persist
             across renders + page-loads via _ervRolloutSave. */
          var hdr = rollout.querySelector('#p3-erv-header');
          if (hdr) _wireDragHandle(hdr);
          /* Re-append the grip after every innerHTML refresh wipes it. */
          if (!rollout.querySelector('#p3-erv-grip')) rollout.appendChild(grip);
          _applyRolloutGeometry();
          /* Update revive chip text with the current savings number. */
          revive.innerHTML = '<span style="opacity:.6;margin-right:5px">\u21BB</span>ERV '+
            _ervFmtMoney(agg.totalUSD).replace('$','$ ') + '/yr';
        }
        /* CSV export: hourly rows for the current epsilon. */
        function _ervExportCsv(){
          var series = _ervSavingsSeries(_designerERVEps);
          if (!series.length) return;
          var raT = _designerRA_T, raW = getW(_designerRA_T, _designerRA_RH);
          var rows = ['date_iso,OA_T_C,OA_RH_pct,OA_W_gkg,OA_prime_T_C,OA_prime_W_gkg,h_OA_kJkg,h_OAprime_kJkg,dh_saved_kJkg,RTh_saved,kWh_saved,USD_saved'];
          var eps = _designerERVEps;
          for (var i=0;i<series.length;i++){
            var s = series[i], p = weatherData[s.idx];
            var inT = p.t + eps * (raT - p.t);
            var inW = p.w + eps * (raW - p.w);
            var h_oa  = enthalpy(p.t, p.w);
            var h_oap = enthalpy(inT, inW);
            rows.push([
              p.ts, p.t.toFixed(2), p.rh.toFixed(1), (p.w*1000).toFixed(3),
              inT.toFixed(2), (inW*1000).toFixed(3),
              h_oa.toFixed(2), h_oap.toFixed(2), s.dh_kJkg.toFixed(3),
              s.rtH.toFixed(3), s.kWh.toFixed(3), (s.kWh*_ervTariffKwh).toFixed(3)
            ].join(','));
          }
          var blob = new Blob([rows.join('\n')], {type:'text/csv'});
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'erv_savings_eps' + _designerERVEps.toFixed(2) + '.csv';
          document.body.appendChild(a); a.click();
          setTimeout(function(){ try { document.body.removeChild(a); URL.revokeObjectURL(a.href); } catch(_){} }, 200);
        }
        /* Re-render the rollout whenever the legend would refresh. */
        var _origRefreshLegend = _refreshErvLegend;
        _refreshErvLegend = function(){ _origRefreshLegend(); _renderRollout(); };
        root.appendChild(rollout);
        root.appendChild(revive);
        /* Hook re-render to weather refresh + designer-mode edits.  Both
           events already exist for the [USE LIVE OA] button. */
        window.addEventListener('red5-weather-loaded', function(){ if (rollout.style.display !== 'none') _renderRollout(); });
        _renderRollout();
      }
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
          var ddBtnHide=$('#p3-btn-deepdive'); if(ddBtnHide) ddBtnHide.style.display='none';
          // Band-strategy toggle is only meaningful in T×Time (the green
          // cumulative curve + its band markers + ramp legend).
          var bsBtn=$('#p3-btn-band-strategy'); if(bsBtn) bsBtn.style.display = (c[0]==='front') ? 'block' : 'none';
          // Monthly \u00d7 Sites multi-city comparison only in T\u00d7Time.
          var msBtn=$('#p3-btn-monthly-sites'); if(msBtn) msBtn.style.display = (c[0]==='front') ? 'block' : 'none';
          // Designer Mode is psychrometric-chart specific (OA->MA->SA on the
          // T-vs-W canvas), hide it in time-series modes.
          var dmBtnHide=$('#p3-btn-designer'); if(dmBtnHide) dmBtnHide.style.display='none';
          var dCfgHide =$('#p3-designer-cfg'); if(dCfgHide)  dCfgHide.style.display='none';
          /* X-Y-only buttons: band-source toggle + band-shift strip +
             both insight popups.  Hide them in time-series modes since
             they overlap with the BACK TO 3D button at the right side
             of the header.  Re-shown in the X-Y Detail handler. */
          ['p3-btn-band-src','p3-band-help','p3-design-help','p3-band-delta'].forEach(function(id){
            var el=$('#'+id); if(el) el.style.display='none';
          });
          // Strategy-overlay toggles only valid inside Monthly \u00d7 Sites mode.
          ['p3-btn-strat-dd','p3-strat-dd-panel','p3-btn-ms-oa','p3-btn-sites-dd','p3-ms-optcfg','p3-ms-modes','p3-ms-costcfg'].forEach(function(id){
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
      var ddBtnSh=$('#p3-btn-deepdive'); if(ddBtnSh) ddBtnSh.style.display='block';
      var bsBtn=$('#p3-btn-band-strategy'); if(bsBtn) bsBtn.style.display='none';
      var msBtn=$('#p3-btn-monthly-sites'); if(msBtn) msBtn.style.display='none';
      var dmBtnSh=$('#p3-btn-designer'); if(dmBtnSh) dmBtnSh.style.display='block';
      var dCfgSh=$('#p3-designer-cfg'); if(dCfgSh) dCfgSh.style.display = _designerMode ? 'block' : 'none';
      /* Re-show X-Y-only buttons; band-src + band-delta only visible when
         ERV is on (their own toggles handle that), so we set display:'block'
         and let their internal refresh handlers gate visibility. */
      var bsSrcSh = $('#p3-btn-band-src'); if (bsSrcSh) bsSrcSh.style.display = 'block';
      var bhSh    = $('#p3-band-help');    if (bhSh)    bhSh.style.display    = 'block';
      var dhSh    = $('#p3-design-help');  if (dhSh)    dhSh.style.display    = 'block';
      var bdSh    = $('#p3-band-delta');   if (bdSh)    bdSh.style.display    = _saDropERVOn ? 'flex' : 'none';
      ['p3-btn-strat-dd','p3-strat-dd-panel','p3-btn-ms-oa','p3-btn-sites-dd','p3-ms-optcfg','p3-ms-modes','p3-ms-costcfg'].forEach(function(id){
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
      var ddBtnB=$('#p3-btn-deepdive'); if(ddBtnB) ddBtnB.style.display='none';
      var bsBtn=$('#p3-btn-band-strategy'); if(bsBtn) bsBtn.style.display='none';
      var msBtn=$('#p3-btn-monthly-sites'); if(msBtn) msBtn.style.display='none';
      var dmBtnSh=$('#p3-btn-designer'); if(dmBtnSh) dmBtnSh.style.display='none';
      var dCfgSh=$('#p3-designer-cfg'); if(dCfgSh) dCfgSh.style.display='none';
      /* Also hide X-Y-only auxiliary buttons in 3D view. */
      ['p3-btn-band-src','p3-band-help','p3-design-help','p3-band-delta'].forEach(function(id){
        var el=$('#'+id); if(el) el.style.display='none';
      });
      ['p3-btn-strat-dd','p3-strat-dd-panel','p3-btn-ms-oa','p3-btn-sites-dd','p3-ms-optcfg','p3-ms-modes','p3-ms-costcfg'].forEach(function(id){
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

    /* Deep Dive launcher — opens the standalone B1-B10 control-band ×
       building-type matrix in a new tab.  Sits to the left of the Mode
       button in the X-Y Detail overlay header. Implemented as a real
       <a target="_blank"> so it bypasses popup-blockers, supports
       middle-click / right-click, and never falls into the "no entry"
       cursor state some browsers show for headless window.open buttons. */
    var ddBtn=root.querySelector('#p3-btn-deepdive');
    if(!ddBtn){
      ddBtn=document.createElement('a');
      ddBtn.id='p3-btn-deepdive';
      ddBtn.setAttribute('data-testid','psy3d-xy-deepdive-btn');
      ddBtn.href='deepdive.html';
      ddBtn.target='_blank';
      ddBtn.rel='noopener';
      ddBtn.innerHTML='Deep Dive \u2197';
      ddBtn.title='B1\u2013B10 control bands \u00d7 building types';
      var ov2=$('#p3-overlay2d'); if(ov2) ov2.appendChild(ddBtn);
    }
    ddBtn.style.cssText='position:absolute;top:12px;right:312px;z-index:60;background:rgba(15,23,42,.92);border:1px solid #22d3ee;color:#22d3ee;padding:6px 16px;border-radius:6px;font-size:10px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;font-family:inherit;backdrop-filter:blur(14px);text-decoration:none;display:none;box-sizing:border-box;line-height:16px';

    /* Band-source toggle chip — sits next to the Mode button.  Toggles
       whether B1-B10 bucketing uses raw OA (default) or post-wheel OA'
       (wheel-aware controller).  Only visible/clickable when ERV is on,
       otherwise the toggle is a no-op (greyed). */
    var bsBtn = document.createElement('button');
    bsBtn.id = 'p3-btn-band-src';
    function _refreshBandSrcBtn(){
      var ervOn = !!_saDropERVOn;
      var oap = !!_bandSourceOaP;
      bsBtn.textContent = 'Band src: ' + (ervOn && oap ? "OA'" : 'OA');
      var col = !ervOn ? '#475569' : (oap ? '#22d3ee' : '#94a3b8');
      bsBtn.style.cssText =
        'position:absolute;top:12px;right:300px;z-index:51;background:rgba(15,23,42,.92);'+
        'border:1px solid '+col+';color:'+col+';padding:6px 14px;border-radius:6px;'+
        'font-size:10px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;'+
        'cursor:'+(ervOn?'pointer':'not-allowed')+';font-family:inherit;backdrop-filter:blur(14px);'+
        'opacity:'+(ervOn?'1':'.45');
      bsBtn.title = ervOn
        ? "Bucket each hour into a B1-B10 band by RAW outdoor air (OA, default) OR by post-wheel OA' (wheel-aware controller picks less-aggressive SA targets that the wheel makes possible)."
        : 'Enable ERV in the 3D Drops layer to compare OA vs OA\u2032 band bucketing.';
    }
    _refreshBandSrcBtn();
    bsBtn.onclick = function(){
      if (!_saDropERVOn) return;
      _bandSourceOaP = !_bandSourceOaP;
      try { localStorage.setItem('red5BandSourceOaP', _bandSourceOaP ? '1' : '0'); } catch(_) {}
      _refreshBandSrcBtn();
      _refreshBandDelta();
      render2DChart();
      _buildSaDropGeometry();   /* reflect band-source change in 3D drops too */
    };
    /* Track ERV state changes so the chip enables/disables itself in
       real time -- piggy-back on the existing red5-erv-rollout-update
       event the rollout panel already dispatches. */
    window.addEventListener('red5-erv-rollout-update', function(){ _refreshBandSrcBtn(); _refreshBandDelta(); });
    var overlayEl = $('#p3-overlay2d');
    if (overlayEl) overlayEl.appendChild(bsBtn);

    /* Per-band hour-count delta strip.  10 cells laid out horizontally
       below the Mode/Band-src chip row, one per band.  Each cell shows:
         - Band id label (color-coded)
         - Two side-by-side bars: OA hours (faded) vs OA' hours (full color)
         - Δ count below the bars (green if gained hours, amber if lost)
       Visible only when ERV is on -- without the wheel there is no Δ. */
    var deltaStrip = document.createElement('div');
    deltaStrip.id = 'p3-band-delta';
    deltaStrip.style.cssText =
      'position:absolute;top:48px;right:8px;z-index:51;display:none;'+
      'background:rgba(15,23,42,.92);border:1px solid #334155;border-radius:6px;'+
      'padding:6px 8px;font-family:\'Courier New\',monospace;color:#cbd5e1;'+
      'backdrop-filter:blur(14px);user-select:none';
    deltaStrip.title = 'B1-B10 hour-count: raw OA bucketing vs OA\u2032 (post-wheel) bucketing.\n\u0394 = how many hours move into/out of each band when the wheel is on.\n\nNote: negative \u0394 is not a loss -- hours are re-routed, not subtracted.\nB1-B4 losses = winter hours pre-heated into B5 (right-size your boiler).\nB7-B10 losses = summer hours pre-cooled into B5 (right-size your chiller).\nB5 gain = your building now operates in "comfort" most of the year (tune PI loops for B5).\n\nSee erv_band_shift_insight.md for the full walkthrough.';
    _refreshBandDelta = function(){
      var on = !!_saDropERVOn;
      deltaStrip.style.display = on ? 'flex' : 'none';
      if (!on) return;
      var hist = _bandHourDelta();
      if (!hist) { deltaStrip.innerHTML = '<span style="color:#94a3b8;font-size:8px">Fetch weather to see band shifts.</span>'; return; }
      var BANDS = ['B1','B2','B3','B4','B5','B6','B7','B8','B9','B10'];
      var COLOR = {B1:'#1e40af',B2:'#2563eb',B3:'#0ea5e9',B4:'#06b6d4',B5:'#10b981',
                   B6:'#84cc16',B7:'#facc15',B8:'#fb923c',B9:'#f97316',B10:'#ea580c'};
      /* Find max count across both columns to scale the bar heights. */
      var maxH = 1;
      BANDS.forEach(function(b){ maxH = Math.max(maxH, hist[b].oa, hist[b].oap); });
      /* Include history extremes in maxH so ghost outlines aren't clipped. */
      if (_bandHistoryHist) BANDS.forEach(function(b){ maxH = Math.max(maxH, _bandHistoryHist[b].oa, _bandHistoryHist[b].oap); });
      /* Climate-drift headline: when comparison mode is on, compute the
         top movers (current year minus historical baseline, by raw OA
         hour-count) and surface the 3 biggest absolute changes in a
         single tooltip-able line above the per-band cells.  Lets the
         operator answer "did my climate actually change?" without
         eyeballing 10 ghost-outline bars.  Sign convention:
           delta > 0  -> current year has MORE hours in this band
                         (climate moving INTO the band) -> up arrow + green
           delta < 0  -> current year has FEWER hours
                         (climate moving OUT of the band) -> down arrow + amber
      */
      var headlineHtml = '';
      if (_bandHistoryHist && _bandHistoryMode !== 'off' && !_bandHistoryLoading) {
        var drifts = BANDS.map(function(b){
          var d = (hist[b].oa || 0) - (_bandHistoryHist[b].oa || 0);
          return { band: b, drift: d, abs: Math.abs(d) };
        }).filter(function(x){ return x.abs >= 2; });
        drifts.sort(function(a,b){ return b.abs - a.abs; });
        var top = drifts.slice(0, 3);
        if (top.length) {
          var basisLabel = _bandHistoryMode === '1y' ? 'vs prior year' : 'vs 5\u2011year avg';
          var fullTooltip = 'Climate drift ' + basisLabel + ': '
            + drifts.map(function(t){
                var sign = t.drift > 0 ? '+' : '';
                return t.band + ' ' + sign + t.drift + 'h';
              }).join(', ')
            + '. Positive = current year has more hours in that band than the historical baseline.';
          var pillsHtml = top.map(function(t){
            var up = t.drift > 0;
            var arrow = up ? '\u2191' : '\u2193';
            var dCol  = up ? '#a3e635' : '#fb7185';
            var sign  = up ? '+' : '';
            return '<span style="display:inline-flex;align-items:center;gap:2px;padding:1px 4px;border-radius:3px;background:rgba(168,85,247,0.08);border:1px solid rgba(168,85,247,0.25)">'
              + '<span style="color:'+COLOR[t.band]+';font-weight:900">'+t.band+'</span>'
              + '<span style="color:'+dCol+';font-weight:900">'+arrow+sign+t.drift+'h</span>'
              + '</span>';
          }).join(' ');
          headlineHtml =
            '<div data-erv-headline="climate-drift" title="' + fullTooltip.replace(/"/g, '&quot;') + '" '
              + 'style="display:flex;align-items:center;gap:6px;padding:3px 4px 4px 4px;margin:-2px -4px 2px -4px;'
              + 'border-bottom:1px dashed rgba(168,85,247,0.35);font-size:8px;line-height:1.1">'
              + '<span style="color:#a855f7;font-weight:900;letter-spacing:0.08em;text-transform:uppercase;font-size:7px;white-space:nowrap">Climate drift</span>'
              + '<span style="display:flex;gap:3px;flex-wrap:wrap">' + pillsHtml + '</span>'
              + '<span style="color:#64748b;font-size:7px;margin-left:auto;white-space:nowrap;font-style:italic">' + basisLabel + '</span>'
            + '</div>';
        }
      }
      /* Switch the strip to a column layout so the headline can sit on
         top and the existing bands row stays as a flex row underneath. */
      deltaStrip.style.flexDirection = 'column';
      deltaStrip.style.gap = '0';
      deltaStrip.style.alignItems = 'stretch';
      /* Comparison-mode toggle button: cycles off -> 1y -> 5y -> off. */
      var histLabel = (_bandHistoryMode === 'off')
        ? 'vs prior'
        : (_bandHistoryMode === '1y' ? 'vs 1y' : 'vs 5y\u2009avg');
      var histBorder = (_bandHistoryMode === 'off') ? '#475569' : '#a855f7';
      var histColor  = (_bandHistoryMode === 'off') ? '#94a3b8' : '#c084fc';
      if (_bandHistoryLoading) { histLabel = 'loading\u2026'; histColor = '#fbbf24'; histBorder = '#fbbf24'; }
      var html =
        '<div style="display:flex;flex-direction:column;align-items:stretch;gap:3px;align-self:stretch;justify-content:space-between">'+
          '<div style="font-size:7px;color:#64748b;letter-spacing:.1em;text-transform:uppercase;font-weight:900;text-align:center">B-shift</div>'+
          '<button data-erv-btn="band-history" title="Cycle: off \u2192 vs prior year \u2192 vs 5-year average. Compares this year\u2019s wheel impact to historical climate." style="background:transparent;border:1px solid '+histBorder+';color:'+histColor+';padding:1px 4px;font:inherit;font-size:7px;font-weight:900;cursor:pointer;border-radius:2px;letter-spacing:.03em">'+histLabel+'</button>'+
        '</div>';
      BANDS.forEach(function(b){
        var oa  = hist[b].oa;
        var oap = hist[b].oap;
        var dH  = oap - oa;
        var hOa  = oa  > 0 ? Math.max(2, Math.round(34 * oa  / maxH)) : 1;
        var hOap = oap > 0 ? Math.max(2, Math.round(34 * oap / maxH)) : 1;
        var col = COLOR[b];
        var dCol = dH > 0 ? '#a3e635' : (dH < 0 ? '#fb7185' : '#64748b');
        var dSign = dH > 0 ? '+' : '';
        var ttl = b + ': OA ' + oa + 'h \u2192 OA\u2032 ' + oap + 'h  (\u0394 ' + dSign + dH + 'h)';
        /* If history loaded, overlay ghost outline bars showing the
           historical OA count.  Single thin purple-bordered outline
           anchored at the same baseline so the operator sees how many
           hours used to fall in this band historically vs this year. */
        var ghost = '';
        if (_bandHistoryHist && _bandHistoryMode !== 'off') {
          var hh = _bandHistoryHist[b];
          var ghOa  = hh.oa  > 0 ? Math.max(2, Math.round(34 * hh.oa  / maxH)) : 1;
          var ghOap = hh.oap > 0 ? Math.max(2, Math.round(34 * hh.oap / maxH)) : 1;
          ghost = '<div style="position:absolute;left:0;bottom:0;display:flex;gap:1px;align-items:flex-end;height:36px;pointer-events:none">'+
            '<div style="width:6px;height:'+ghOa +'px;border:1px dashed #a855f7;border-bottom:none;box-sizing:border-box;opacity:.85"></div>'+
            '<div style="width:8px;height:'+ghOap+'px;border:1px dashed #a855f7;border-bottom:none;box-sizing:border-box;opacity:.85"></div>'+
          '</div>';
          var driftOa = hh.oa  - oa;
          var driftSign = driftOa > 0 ? '+' : '';
          ttl += '  | historical OA '+hh.oa+'h (drift '+driftSign+driftOa+'h)';
        }
        html += '<div title="'+ttl+'" style="display:flex;flex-direction:column;align-items:center;gap:1px;min-width:34px">'+
          '<div style="position:relative;display:flex;gap:1px;align-items:flex-end;height:36px">'+
            ghost+
            '<div style="width:6px;height:'+hOa +'px;background:'+col+';opacity:.35;border-radius:1px 0 0 0"></div>'+
            '<div style="width:8px;height:'+hOap+'px;background:'+col+';opacity:.95;border-radius:0 1px 0 0"></div>'+
          '</div>'+
          '<div style="font-size:7px;font-weight:900;color:'+col+';letter-spacing:.02em">'+b+'</div>'+
          '<div style="font-size:7px;color:'+dCol+';font-weight:900;line-height:1">'+dSign+dH+'</div>'+
        '</div>';
      });
      /* Show '?' bucket if any hours fell out of all bands. */
      if (hist['?'].oa || hist['?'].oap) {
        html += '<div title="Hours not classified by any band (rare edges)" style="display:flex;flex-direction:column;align-items:center;gap:1px;min-width:30px">'+
          '<div style="display:flex;gap:1px;align-items:flex-end;height:36px">'+
            '<div style="width:6px;height:'+(hist['?'].oa  > 0 ? Math.max(2, Math.round(34*hist['?'].oa /maxH)) : 1)+'px;background:#475569;opacity:.35"></div>'+
            '<div style="width:8px;height:'+(hist['?'].oap > 0 ? Math.max(2, Math.round(34*hist['?'].oap/maxH)) : 1)+'px;background:#475569;opacity:.95"></div>'+
          '</div>'+
          '<div style="font-size:7px;font-weight:900;color:#64748b">?</div>'+
          '<div style="font-size:7px;color:#64748b;line-height:1">'+(hist['?'].oap-hist['?'].oa)+'</div>'+
        '</div>';
      }
      deltaStrip.innerHTML =
        headlineHtml +
        '<div data-erv-row="bands" style="display:flex;gap:4px;align-items:flex-end">' + html + '</div>';
      /* Wire the history toggle button. */
      var hBtn = deltaStrip.querySelector('[data-erv-btn=band-history]');
      if (hBtn) hBtn.addEventListener('click', function(){
        var order = ['off','1y','5y'];
        _bandHistoryMode = order[(order.indexOf(_bandHistoryMode)+1) % order.length];
        try { localStorage.setItem('red5BandHistoryMode', _bandHistoryMode); } catch(_) {}
        _loadBandHistory(_bandHistoryMode, function(){ _refreshBandDelta(); });
      });
    };
    /* If a non-default history mode was persisted, kick off the fetch
       on init so the ghost bars appear after first weather load. */
    if (_bandHistoryMode !== 'off') {
      window.addEventListener('red5-weather-loaded', function(){
        _loadBandHistory(_bandHistoryMode, function(){ _refreshBandDelta(); });
      });
    }
    _refreshBandDelta();
    if (overlayEl) overlayEl.appendChild(deltaStrip);
    /* Refresh on weather load (more hours = new histogram). */
    window.addEventListener('red5-weather-loaded', _refreshBandDelta);

    /* ----------------------------------------------------------------
       B-SHIFT INSIGHT POPUP — `?` button on the strip opens a draggable
       overlay with the full erv_band_shift_insight.md walkthrough so the
       explanation is one click away during owner walkthroughs instead
       of buried in the archive folder.  Position + closed state
       persisted under red5BandInsightState.

       Implemented as a generic factory _createInsightPopup(opts) so the
       same draggable + EN/한국어 toggle + markdown renderer can host
       multiple in-app docs (band-shift insight, psych-design workflow,
       future additions) without code duplication. */
    function _createInsightPopup(opts){
      /* opts: {
           btnId, btnTitle, btnStyle, popupId,
           docEN, docKO,            (legacy: kept for backwards compat with
                                     band-help / design-help below.  When
                                     docBase is supplied, it wins.)
           docBase,                 (new: '/assets/foo' — engine appends
                                     '.<lang>.md' for non-en, '.md' for en.
                                     Single-file convention matches the
                                     docs popup so the same EN-fallback
                                     resolution works everywhere.)
           titleEN, titleKO,        (legacy)
           titles,                  (new: {en,ko,ja,zh-CN,zh-TW} map; EN
                                     fallback if missing.  Used in the
                                     popup's title bar AND PDF print title.)
           storageKey  (for pos+closed),
           storageLang (for explicit language),
           anchorEl    (where to attach the ? button; defaults to overlayEl)
         } */
      /* ---- supported languages (mirrors docs_index.js so both popups
              feel identical to the operator) ---- */
      var LANGS = [
        { code: 'en',    native: 'English'         },
        { code: 'ko',    native: '\ud55c\uad6d\uc5b4' },
        { code: 'ja',    native: '\u65e5\u672c\u8a9e' },
        { code: 'zh-CN', native: '\u7b80\u4f53\u4e2d\u6587' },
        { code: 'zh-TW', native: '\u7e41\u9ad4\u4e2d\u6587' }
      ];
      function _isValidLang(c){ return LANGS.some(function(L){ return L.code === c; }); }
      function _titleFor(lang){
        if (opts.titles && opts.titles[lang]) return opts.titles[lang];
        if (opts.titles && opts.titles.en)    return opts.titles.en;
        return (lang === 'ko' && opts.titleKO) ? opts.titleKO : opts.titleEN;
      }
      function _urlFor(lang){
        if (opts.docBase) {
          return (lang === 'en') ? (opts.docBase + '.md')
                                 : (opts.docBase + '.' + lang + '.md');
        }
        /* Legacy fallback for callers still using docEN/docKO. */
        if (lang === 'ko' && opts.docKO) return opts.docKO;
        return opts.docEN;
      }
      function _enUrl(){
        if (opts.docBase) return opts.docBase + '.md';
        return opts.docEN;
      }
      function _fallbackBanner(){
        var bag = {
          en:      '(English fallback \u2014 translation pending)',
          ko:      '(\uc601\uc5b4\ub85c \ud45c\uc2dc \u2014 \ubc88\uc5ed \uc900\ube44 \uc911)',
          ja:      '(\u82f1\u8a9e\u3067\u8868\u793a\u2014\u7ffb\u8a33\u6e96\u5099\u4e2d)',
          'zh-CN': '(\u663e\u793a\u82f1\u6587\u2014\u7ffb\u8bd1\u51c6\u5907\u4e2d)',
          'zh-TW': '(\u986f\u793a\u82f1\u6587\u2014\u7ffb\u8b6f\u6e96\u5099\u4e2d)'
        };
        return bag[_lang] || bag.en;
      }
      var anchor = opts.anchorEl || overlayEl;
      if (!anchor) return { button: null, popup: null, show: function(){} };
      var _pos = null, _closed = true;
      try {
        var _s = JSON.parse(localStorage.getItem(opts.storageKey) || '{}');
        if (_s && _s.pos && typeof _s.pos.x === 'number') _pos = _s.pos;
      } catch(_) {}
      var _loaded = {};   /* {<lang>: markdown, <lang>__fallback: true} */
      var _lang = (function(){
        try { var l = window.getLang ? window.getLang() : 'en'; return _isValidLang(l) ? l : 'en'; } catch(_) { return 'en'; }
      })();
      try {
        var _il = localStorage.getItem(opts.storageLang);
        if (_isValidLang(_il)) _lang = _il;
      } catch(_) {}

      var btn = document.createElement('button');
      btn.id = opts.btnId;
      btn.textContent = '?';
      btn.title = opts.btnTitle;
      btn.style.cssText = opts.btnStyle;

      var popup = document.createElement('div');
      popup.id = opts.popupId;
      popup.style.cssText =
        'position:absolute;left:80px;top:60px;width:560px;height:480px;z-index:80;display:none;'+
        'background:rgba(15,23,42,.96);border:1px solid #60a5fa;border-radius:8px;'+
        'box-shadow:0 8px 32px rgba(0,0,0,.5);backdrop-filter:blur(16px);'+
        'font-family:\'Courier New\',monospace;color:#cbd5e1;overflow:hidden;'+
        'flex-direction:column';

      function show(){
        popup.style.display = 'flex';
        if (_pos) { popup.style.left = _pos.x+'px'; popup.style.top = _pos.y+'px'; }
        try { localStorage.setItem(opts.storageKey, JSON.stringify({pos:_pos, closed:false})); } catch(_) {}
        _fetch();
      }
      function paint(){
        var md = _loaded[_lang];
        var fellBack = _loaded[_lang + '__fallback'];
        var loadingBag = { en: 'Loading\u2026', ko: '\ub85c\ub529 \uc911\u2026', ja: '\u8aad\u307f\u8fbc\u307f\u4e2d\u2026', 'zh-CN': '\u52a0\u8f7d\u4e2d\u2026', 'zh-TW': '\u8f09\u5165\u4e2d\u2026' };
        var loadingLabel = loadingBag[_lang] || loadingBag.en;
        var titleLabel   = _titleFor(_lang);
        var fallbackBanner = fellBack
          ? '<div style="background:rgba(251,191,36,.10);border:1px dashed #fbbf24;color:#fbbf24;padding:6px 10px;margin:0 0 8px;font-size:9px;border-radius:3px">\u26a0\ufe0f '+_fallbackBanner()+'</div>'
          : '';
        var body = md
          ? (fallbackBanner + _renderMd(md))
          : '<div style="color:#94a3b8;padding:14px;font-size:10px">'+loadingLabel+'</div>';
        /* Same 5-language <select> as docs_index.js so both popups have
           identical chrome.  Avoids the operator wondering why some
           help popups expose more languages than others. */
        var langOpts = LANGS.map(function(L){
          var sel = (L.code === _lang) ? ' selected' : '';
          return '<option value="'+L.code+'"'+sel+'>'+L.native+'</option>';
        }).join('');
        var langChip =
          '<select data-lang-select="1" title="Document language" '+
                  'style="background:#1e293b;border:1px solid #475569;border-radius:3px;'+
                         'color:#cbd5e1;font:900 9px Courier New;letter-spacing:.05em;'+
                         'padding:2px 4px;cursor:pointer;outline:none">'+langOpts+'</select>';
        popup.innerHTML =
          '<div data-hdr="1" style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 12px;background:rgba(96,165,250,.10);border-bottom:1px solid #1e3a8a;cursor:move;flex-shrink:0">'+
            '<div style="display:flex;align-items:center;gap:10px">'+
              '<div style="color:#60a5fa;font-weight:900;font-size:10px;letter-spacing:.08em;text-transform:uppercase">'+titleLabel+'</div>'+
              langChip+
            '</div>'+
            '<button data-close="1" title="Close" style="background:transparent;border:1px solid #475569;color:#fb7185;padding:0 6px;font:900 11px Courier New;cursor:pointer;border-radius:2px">\u2715</button>'+
          '</div>'+
          '<div style="flex:1;overflow-y:auto;padding:8px 14px;color:#cbd5e1">'+body+'</div>';
        var hdr = popup.querySelector('[data-hdr]');
        if (hdr) hdr.addEventListener('mousedown', function(e){
          if (e.target.closest('button, select, [data-lang-select]')) return;
          e.preventDefault();
          var startX = e.clientX, startY = e.clientY;
          var rect = popup.getBoundingClientRect();
          var rootRect = root.getBoundingClientRect();
          var origX = rect.left - rootRect.left;
          var origY = rect.top  - rootRect.top;
          function onMove(ev){
            var nx = Math.max(0, Math.min(rootRect.width - 80, origX + (ev.clientX - startX)));
            var ny = Math.max(0, Math.min(rootRect.height - 40, origY + (ev.clientY - startY)));
            _pos = {x:nx, y:ny};
            popup.style.left = nx+'px';
            popup.style.top  = ny+'px';
          }
          function onUp(){
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup',   onUp);
            try { localStorage.setItem(opts.storageKey, JSON.stringify({pos:_pos, closed:false})); } catch(_) {}
          }
          window.addEventListener('mousemove', onMove);
          window.addEventListener('mouseup',   onUp);
        });
        var closeBtn = popup.querySelector('[data-close]');
        if (closeBtn) closeBtn.addEventListener('click', function(){
          popup.style.display = 'none';
          try { localStorage.setItem(opts.storageKey, JSON.stringify({pos:_pos, closed:true})); } catch(_) {}
        });
        var langSel = popup.querySelector('[data-lang-select]');
        if (langSel) langSel.addEventListener('change', function(){
          var lang = langSel.value;
          if (!_isValidLang(lang) || lang === _lang) return;
          _lang = lang;
          try { localStorage.setItem(opts.storageLang, lang); } catch(_) {}
          _fetch();
        });
      }
      function _fetch(){
        if (_loaded[_lang]) { paint(); return; }
        paint(); /* loading state */
        /* Same EN-fallback chain as docs_index.js: try requested lang
           first, fall back to English on 404 with a banner.  Keeps the
           ? popups feeling identical to the Standards popup. */
        var primaryUrl = _urlFor(_lang);
        var enUrl      = _enUrl();
        var cb = (primaryUrl.indexOf('?') >= 0 ? '&' : '?') + 'ts=' + Date.now();
        fetch(primaryUrl + cb, {cache:'no-store'})
          .then(function(r){
            if (r.ok) return r.text().then(function(txt){
              _loaded[_lang] = txt;
              delete _loaded[_lang + '__fallback'];
              paint();
            });
            if (primaryUrl === enUrl) return Promise.reject(r.status);
            return fetch(enUrl + (enUrl.indexOf('?') >= 0 ? '&' : '?') + 'ts=' + Date.now(), {cache:'no-store'})
              .then(function(r2){
                if (!r2.ok) return Promise.reject(r2.status);
                return r2.text();
              })
              .then(function(txt){
                _loaded[_lang] = txt;
                _loaded[_lang + '__fallback'] = true;
                paint();
              });
          })
          .catch(function(err){
            var msg = '# Unable to load doc\n\nFile fetch failed (' + err + ').\n\n*Reopen the popup or hard-refresh the page (Ctrl+Shift+R) to retry.*';
            var bodyEl = popup.querySelector('div[style*="overflow-y:auto"]');
            if (bodyEl) bodyEl.innerHTML = _renderMd(msg);
          });
      }
      btn.addEventListener('click', show);
      window.addEventListener('langchange', function(){
        try {
          var newLang = window.getLang ? window.getLang() : 'en';
          if (!_isValidLang(newLang)) newLang = 'en';
          var explicit = localStorage.getItem(opts.storageLang);
          if (explicit) return;
          if (newLang === _lang) return;
          _lang = newLang;
          if (popup.style.display !== 'none') show();
        } catch(_) {}
      });
      anchor.appendChild(btn);
      anchor.appendChild(popup);
      return { button: btn, popup: popup, show: show };
    }

    /* Band-shift insight `?` button (top-right of overlay, near B-shift strip).
       Uses docBase so all 5 languages (EN/KO/JA/ZH-CN/ZH-TW) resolve via the
       same naming convention as the Standards popup. */
    _createInsightPopup({
      btnId:       'p3-band-help',
      btnTitle:    'Open the B-shift insight walkthrough (explains what "losing hours" means).',
      btnStyle:    'position:absolute;top:22px;right:8px;z-index:53;background:rgba(15,23,42,.92);border:1px solid #60a5fa;color:#60a5fa;width:22px;height:22px;border-radius:50%;font:900 12px Courier New;cursor:pointer;backdrop-filter:blur(14px);padding:0;line-height:18px',
      popupId:     'p3-band-help-popup',
      docBase:     '/assets/erv_band_shift_insight',
      titles: {
        en:      'B-Shift Insight',
        ko:      'B-\uc2dc\ud504\ud2b8 \ud1b5\ucc30',
        ja:      'B-\u30b7\u30d5\u30c8\u306e\u6d1e\u5bdf',
        'zh-CN': 'B-\u5e26\u79fb\u6d1e\u5bdf',
        'zh-TW': 'B-\u5e36\u79fb\u6d1e\u5bdf'
      },
      storageKey:  'red5BandInsightState',
      storageLang: 'red5BandInsightLang'
    });
    /* Psych-design-workflow `?` button — anchored next to the
       `+ Designer Mode` button (top:46 left:435).  Visibility is driven
       by the front/side/X-Y/Back-to-3D handlers higher in setupControls,
       not by a polling interval (cheaper + race-free). */
    var designHelp = _createInsightPopup({
      btnId:       'p3-design-help',
      btnTitle:    'Open the psychrometric-design workflow walkthrough.',
      btnStyle:    'position:absolute;top:46px;left:435px;z-index:53;background:rgba(15,23,42,.92);border:1px solid #f59e0b;color:#f59e0b;width:22px;height:22px;border-radius:50%;font:900 12px Courier New;cursor:pointer;backdrop-filter:blur(14px);padding:0;line-height:18px;display:none',
      popupId:     'p3-design-help-popup',
      docBase:     '/assets/psychrometric_design_workflow',
      titles: {
        en:      'Psych Design Workflow',
        ko:      '\uc2b5\uacf5\uae30\uc120\ub3c4 \uc124\uacc4 \uc6cc\ud06c\ud50c\ub85c',
        ja:      '\u6e7f\u308a\u7a7a\u6c17\u7dda\u56f3 \u8a2d\u8a08\u30ef\u30fc\u30af\u30d5\u30ed\u30fc',
        'zh-CN': '\u7115\u6e7f\u56fe \u8bbe\u8ba1\u5de5\u4f5c\u6d41',
        'zh-TW': '\u7124\u6fd5\u5716 \u8a2d\u8a08\u5de5\u4f5c\u6d41'
      },
      storageKey:  'red5DesignInsightState',
      storageLang: 'red5DesignInsightLang'
    });

    /* Minimal markdown -> HTML renderer.  Supports the subset our doc
       actually uses: H1/H2/H3, blockquote, ordered/unordered lists,
       tables, **bold**, *italic*, `code`, fenced ``` blocks.  Avoids
       pulling in a full md library to keep the controller lean. */
    function _renderMd(md){
      function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
      var lines = md.split('\n');
      var out = [];
      var i = 0;
      while (i < lines.length) {
        var L = lines[i];
        if (/^```/.test(L)) {
          var code = [];
          i++;
          while (i < lines.length && !/^```/.test(lines[i])) { code.push(esc(lines[i])); i++; }
          out.push('<pre style="background:#020617;border:1px solid #334155;border-radius:4px;padding:8px;overflow-x:auto;font-size:9px;line-height:1.5;color:#94a3b8">'+code.join('\n')+'</pre>');
          i++; continue;
        }
        /* Tables: detect a header row followed by a separator like |---|---| */
        if (/^\s*\|.*\|\s*$/.test(L) && i+1<lines.length && /^\s*\|[\s\-:|]+\|\s*$/.test(lines[i+1])) {
          var rows = [L];
          i += 2;
          while (i<lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) { rows.push(lines[i]); i++; }
          var parsed = rows.map(function(r){
            return r.replace(/^\s*\|/,'').replace(/\|\s*$/,'').split('|').map(function(c){return c.trim();});
          });
          var head = parsed.shift();
          out.push('<table style="border-collapse:collapse;width:100%;font-size:9px;margin:6px 0"><thead><tr>'+
            head.map(function(h){return '<th style="border:1px solid #334155;padding:4px 6px;text-align:left;background:#1e293b;color:#e2e8f0">'+_inline(h)+'</th>';}).join('')+
            '</tr></thead><tbody>'+
            parsed.map(function(r){return '<tr>'+r.map(function(c){return '<td style="border:1px solid #334155;padding:4px 6px">'+_inline(c)+'</td>';}).join('')+'</tr>';}).join('')+
            '</tbody></table>');
          continue;
        }
        if (/^# /.test(L))      { out.push('<h2 style="color:#60a5fa;font-size:13px;font-weight:900;margin:8px 0 4px;border-bottom:1px solid #1e293b;padding-bottom:3px">'+_inline(L.slice(2))+'</h2>'); i++; continue; }
        if (/^## /.test(L))     { out.push('<h3 style="color:#22d3ee;font-size:11px;font-weight:900;margin:8px 0 3px;letter-spacing:.05em;text-transform:uppercase">'+_inline(L.slice(3))+'</h3>'); i++; continue; }
        if (/^### /.test(L))    { out.push('<h4 style="color:#fbbf24;font-size:10px;font-weight:900;margin:6px 0 2px">'+_inline(L.slice(4))+'</h4>'); i++; continue; }
        if (/^> /.test(L))      { out.push('<blockquote style="border-left:3px solid #60a5fa;padding:2px 8px;margin:4px 0;background:rgba(96,165,250,.05);color:#cbd5e1;font-style:italic;font-size:10px">'+_inline(L.slice(2))+'</blockquote>'); i++; continue; }
        if (/^---+$/.test(L))   { out.push('<hr style="border:none;border-top:1px dashed #334155;margin:8px 0"/>'); i++; continue; }
        if (/^\s*-\s+/.test(L)) {
          var items = [];
          while (i<lines.length && /^\s*-\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*-\s+/,'')); i++; }
          out.push('<ul style="margin:4px 0 4px 14px;padding:0;font-size:10px;line-height:1.55">'+items.map(function(it){return '<li style="margin:2px 0">'+_inline(it)+'</li>';}).join('')+'</ul>');
          continue;
        }
        if (/^\s*\d+\.\s+/.test(L)) {
          var items2 = [];
          while (i<lines.length && /^\s*\d+\.\s+/.test(lines[i])) { items2.push(lines[i].replace(/^\s*\d+\.\s+/,'')); i++; }
          out.push('<ol style="margin:4px 0 4px 16px;padding:0;font-size:10px;line-height:1.55">'+items2.map(function(it){return '<li style="margin:2px 0">'+_inline(it)+'</li>';}).join('')+'</ol>');
          continue;
        }
        if (/^\s*$/.test(L)) { out.push(''); i++; continue; }
        out.push('<p style="margin:3px 0;font-size:10px;line-height:1.55">'+_inline(L)+'</p>');
        i++;
      }
      function _inline(s){
        s = esc(s);
        s = s.replace(/`([^`]+)`/g, '<code style="background:#020617;border:1px solid #334155;border-radius:2px;padding:0 3px;font-size:9px;color:#fbbf24">$1</code>');
        s = s.replace(/\*\*([^*]+)\*\*/g, '<b style="color:#e2e8f0">$1</b>');
        s = s.replace(/\*([^*]+)\*/g, '<i>$1</i>');
        return s;
      }
      return out.join('\n');
    }

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
      if(chart2DMode==='monthly-sites' && !_monthlyFetching){
        _fetchMonthlyAllSites();
      }
      msBtn.style.borderColor = (chart2DMode==='monthly-sites') ? '#60a5fa' : '#475569';
      msBtn.style.color       = (chart2DMode==='monthly-sites') ? '#60a5fa' : '#94a3b8';
      msBtn.textContent       = (chart2DMode==='monthly-sites') ? 'Back to T\u00d7Time' : 'Monthly \u00d7 Sites Comparison';
      // Show/hide the 3 strategy-overlay toggle buttons + hide the T\u00d7Time
      // band-strategy toggle while in Monthly \u00d7 Sites mode (it doesn't apply
      // to the multi-city panel grid).
      var inMs = (chart2DMode==='monthly-sites');
      ['p3-btn-strat-dd','p3-btn-ms-oa'].forEach(function(id){
        var el=$('#'+id); if(el) el.style.display = inMs ? 'block' : 'none';
      });
      // Strategy dropdown panel: close it whenever we leave MS mode.
      var sdp = $('#p3-strat-dd-panel'); if (sdp && !inMs) sdp.style.display = 'none';
      // Opt-SA bound sliders only relevant when the Opt-SA curve is on.
      var ocfg = $('#p3-ms-optcfg');
      if (ocfg) ocfg.style.display = (inMs && _msShowOpt) ? 'block' : 'none';
      // Sites dropdown trigger follows the strategy toggles' visibility.
      var sdd = $('#p3-btn-sites-dd'); if (sdd) sdd.style.display = inMs ? 'block' : 'none';
      var sddP = $('#p3-sites-dd-panel'); if (sddP && !inMs) sddP.style.display = 'none';
      if (inMs && typeof _refreshSitesDD === 'function') _refreshSitesDD();
      // Mode selector + cost-config follow Monthly x Sites visibility.
      var mr = $('#p3-ms-modes');   if (mr) mr.style.display   = inMs ? 'block' : 'none';
      var cc = $('#p3-ms-costcfg'); if (cc) cc.style.display = (inMs && _msMode === '$') ? 'block' : 'none';
      var bs2=$('#p3-btn-band-strategy'); if(bs2) bs2.style.display = inMs ? 'none' : 'block';
      // Designer Mode toggle + inputs panel only meaningful in 'psy' mode,
      // hide them in monthly-sites or any other non-psych-chart layout.
      var dmBtn2=$('#p3-btn-designer'); if(dmBtn2) dmBtn2.style.display = (chart2DMode==='psy') ? 'block' : 'none';
      var dCfg2 =$('#p3-designer-cfg'); if(dCfg2)  dCfg2.style.display  = (chart2DMode==='psy' && _designerMode) ? 'block' : 'none';
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

    /* ---------- Designer Mode toggle + inputs panel ----------
       A standalone MEP equipment-sizing overlay on the 2D psychrometric
       chart.  When toggled on, plots the OA -> MA -> SA process line plus
       extension to saturation curve (ADP), and renders a numeric readout
       (coil tons, dh, BF, ADP, room sensible) so an engineer can read
       sizing numbers straight off the chart without leaving the dashboard.
       Decoupled from live telemetry on purpose - this is a design-phase
       schematic tool, fed by user-input design conditions, not live BACnet
       data.  (The live telemetry already drives the dot-cloud + dynamics
       animation; Designer Mode is the parallel "what coil do I need?"
       view.) */
    var dmBtn = $('#p3-btn-designer');
    if (!dmBtn) {
        dmBtn = document.createElement('button');
        dmBtn.id = 'p3-btn-designer';
        dmBtn.type = 'button';
        dmBtn.textContent = '+ Designer Mode';
        $('#p3-overlay2d').appendChild(dmBtn);
    }
    /* Anchor on the LEFT side at x=470, ABOVE the "B1-B10 + Dyn-Reset"
       button to avoid collisions.  Visible only when the 2D chart is in
       'psy' mode (not T-Time, W-Time, monthly-sites). */
    dmBtn.style.cssText = 'position:absolute;top:46px;left:280px;z-index:51;'+
        'background:rgba(15,23,42,.92);border:1px solid #f59e0b;color:#f59e0b;'+
        'padding:6px 14px;border-radius:6px;font-size:10px;font-weight:900;'+
        'letter-spacing:.08em;text-transform:uppercase;cursor:pointer;'+
        'font-family:inherit;backdrop-filter:blur(14px);display:none';
    dmBtn.title = 'MEP equipment-sizing overlay: plots OA -> MA -> SA process line on the psych chart and shows coil tons / dh / BF / ADP / room-sensible readouts. Design-phase tool (user-input conditions), separate from live telemetry.';

    var _refreshDesignerBtn = function(){
      dmBtn.style.borderColor = _designerMode ? '#f59e0b' : '#475569';
      dmBtn.style.color       = _designerMode ? '#f59e0b' : '#94a3b8';
      dmBtn.textContent       = (_designerMode ? '\u2713 ' : '+ ') + 'Designer Mode';
    };
    _refreshDesignerBtn();

    /* Inputs panel - 5 number inputs + 2 dropdowns sit in a small floating
       card.  Hidden unless _designerMode === true.  Sliders/inputs are
       intentionally compact (digital readout aesthetic) to match the rest
       of the dashboard. */
    var dCfg = $('#p3-designer-cfg');
    if (!dCfg) {
        dCfg = document.createElement('div');
        dCfg.id = 'p3-designer-cfg';
        dCfg.style.cssText = 'position:absolute;top:78px;left:280px;z-index:51;'+
            'background:rgba(15,23,42,.95);border:1px solid #b45309;border-radius:6px;'+
            "padding:10px 12px;font-family:'Courier New',monospace;font-size:10px;"+
            'color:#e2e8f0;backdrop-filter:blur(14px);width:300px;display:none';
        dCfg.innerHTML =
            '<div style="font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#f59e0b;margin-bottom:8px;font-weight:900">Design Inputs</div>'+
            '<div style="display:grid;grid-template-columns:auto 1fr auto;gap:4px 8px;align-items:center">'+
              '<label>CFM</label>'+
                '<input type="number" id="p3-d-cfm" min="500" max="200000" step="500" style="background:#020617;color:#fbbf24;border:1px solid #334155;padding:3px 6px;font-family:inherit;font-size:10px;width:100%">'+
                '<span style="color:#64748b">ft\u00b3/min</span>'+
              '<label>OA frac</label>'+
                '<input type="number" id="p3-d-oafrac" min="0" max="1" step="0.05" style="background:#020617;color:#fbbf24;border:1px solid #334155;padding:3px 6px;font-family:inherit;font-size:10px;width:100%">'+
                '<span style="color:#64748b">0\u20131</span>'+
              '<label>OA T</label>'+
                '<input type="number" id="p3-d-oat" min="-30" max="50" step="0.5" style="background:#020617;color:#fbbf24;border:1px solid #334155;padding:3px 6px;font-family:inherit;font-size:10px;width:100%">'+
                '<span style="color:#64748b">\u00b0C</span>'+
              '<label>OA RH</label>'+
                '<input type="number" id="p3-d-oarh" min="0" max="100" step="1" style="background:#020617;color:#fbbf24;border:1px solid #334155;padding:3px 6px;font-family:inherit;font-size:10px;width:100%">'+
                '<span style="color:#64748b">%</span>'+
              '<span></span>'+
                '<button type="button" id="p3-d-uselive" title="Copy the most recent weatherData point\'s T and RH into the OA inputs above." style="background:#020617;color:#fb7185;border:1px solid #fb7185;padding:4px 8px;font-family:inherit;font-size:9px;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;border-radius:3px;font-weight:900">\u00b7 use live OA \u00b7</button>'+
                '<span></span>'+
              '<label>RA T</label>'+
                '<input type="number" id="p3-d-rat" min="15" max="30" step="0.5" style="background:#020617;color:#fbbf24;border:1px solid #334155;padding:3px 6px;font-family:inherit;font-size:10px;width:100%">'+
                '<span style="color:#64748b">\u00b0C</span>'+
              '<label>RA RH</label>'+
                '<input type="number" id="p3-d-rarh" min="30" max="70" step="1" style="background:#020617;color:#fbbf24;border:1px solid #334155;padding:3px 6px;font-family:inherit;font-size:10px;width:100%">'+
                '<span style="color:#64748b">%</span>'+
              '<label>SA T</label>'+
                '<input type="number" id="p3-d-sat" min="5" max="35" step="0.5" style="background:#020617;color:#fbbf24;border:1px solid #334155;padding:3px 6px;font-family:inherit;font-size:10px;width:100%">'+
                '<span style="color:#64748b">\u00b0C</span>'+
              '<label>SA RH</label>'+
                '<input type="number" id="p3-d-sarh" min="50" max="100" step="1" style="background:#020617;color:#fbbf24;border:1px solid #334155;padding:3px 6px;font-family:inherit;font-size:10px;width:100%">'+
                '<span style="color:#64748b">%</span>'+
            '</div>'+
            '<div style="margin-top:8px;font-size:9px;color:#64748b">MA = OA frac \u00d7 OA + (1 \u2013 OA frac) \u00d7 RA</div>'+
            /* ERV toggle row -- visually distinct (separator + cyan accent)
               so operators can see at a glance that toggling it changes
               where the coil starts its work.  When the checkbox is on,
               draw OA' on the OA->RA line and re-run the sizing numbers
               from OA' instead of OA. */
            '<div style="margin-top:10px;padding-top:8px;border-top:1px dashed #334155">'+
              '<label style="display:flex;align-items:center;gap:8px;cursor:pointer">'+
                '<input type="checkbox" id="p3-d-ervon" style="accent-color:#22d3ee">'+
                '<span style="color:#22d3ee;font-weight:900;letter-spacing:.05em">+ ERV</span>'+
                '<span style="color:#64748b;font-size:9px">energy-recovery wheel</span>'+
              '</label>'+
              '<div style="display:grid;grid-template-columns:auto 1fr auto;gap:4px 8px;align-items:center;margin-top:6px">'+
                '<label style="color:#94a3b8">\u03b5 (effectiveness)</label>'+
                  '<input type="number" id="p3-d-erveps" min="0" max="1" step="0.05" style="background:#020617;color:#22d3ee;border:1px solid #334155;padding:3px 6px;font-family:inherit;font-size:10px;width:100%">'+
                  '<span style="color:#64748b">0\u20131</span>'+
              '</div>'+
              '<div style="margin-top:4px;font-size:9px;color:#64748b">OA\' = OA + \u03b5 \u00d7 (RA \u2013 OA) along enthalpy</div>'+
            '</div>';
        $('#p3-overlay2d').appendChild(dCfg);
    }
    /* Populate inputs from persisted state (localStorage) + wire change handlers. */
    var _LS_KEY_D = 'red5DesignerState';
    try {
        var saved = JSON.parse(localStorage.getItem(_LS_KEY_D) || '{}');
        if (typeof saved.cfm    === 'number') _designerCFM    = saved.cfm;
        if (typeof saved.oafrac === 'number') _designerOAFrac = saved.oafrac;
        if (typeof saved.oat    === 'number') _designerOA_T   = saved.oat;
        if (typeof saved.oarh   === 'number') _designerOA_RH  = saved.oarh;
        if (typeof saved.rat    === 'number') _designerRA_T   = saved.rat;
        if (typeof saved.rarh   === 'number') _designerRA_RH  = saved.rarh;
        if (typeof saved.sat    === 'number') _designerSA_T   = saved.sat;
        if (typeof saved.sarh   === 'number') _designerSA_RH  = saved.sarh;
        if (typeof saved.on     === 'boolean') _designerMode  = saved.on;
        if (typeof saved.ervon  === 'boolean') _designerERVOn = saved.ervon;
        if (typeof saved.erveps === 'number')  _designerERVEps = saved.erveps;
    } catch(e) { /* ignore */ }
    var _setD = function(id, val){ var el = dCfg.querySelector('#'+id); if (el) el.value = val; };
    _setD('p3-d-cfm',    _designerCFM);
    _setD('p3-d-oafrac', _designerOAFrac);
    _setD('p3-d-oat',    _designerOA_T);
    _setD('p3-d-oarh',   _designerOA_RH);
    _setD('p3-d-rat',    _designerRA_T);
    _setD('p3-d-rarh',   _designerRA_RH);
    _setD('p3-d-sat',    _designerSA_T);
    _setD('p3-d-sarh',   _designerSA_RH);
    /* ERV checkbox + epsilon */
    var _ervCheck = dCfg.querySelector('#p3-d-ervon');
    if (_ervCheck) _ervCheck.checked = !!_designerERVOn;
    _setD('p3-d-erveps', _designerERVEps);
    _refreshDesignerBtn();
    dCfg.style.display = _designerMode ? 'block' : 'none';

    var _persistDesignerState = function(){
        try {
            localStorage.setItem(_LS_KEY_D, JSON.stringify({
                cfm: _designerCFM, oafrac: _designerOAFrac,
                oat: _designerOA_T, oarh: _designerOA_RH,
                rat: _designerRA_T, rarh: _designerRA_RH,
                sat: _designerSA_T, sarh: _designerSA_RH,
                on: _designerMode,
                ervon: _designerERVOn,
                erveps: _designerERVEps,
            }));
        } catch(e) { /* quota / private-mode - ignore */ }
    };
    var _wireInput = function(id, setter, parser){
        var el = dCfg.querySelector('#'+id);
        if (!el) return;
        el.oninput = function(){
            var v = parser ? parser(el.value) : parseFloat(el.value);
            if (!isFinite(v)) return;
            setter(v);
            _persistDesignerState();
            render2DChart();
        };
    };
    _wireInput('p3-d-cfm',    function(v){ _designerCFM    = Math.max(500, v); });
    _wireInput('p3-d-oafrac', function(v){ _designerOAFrac = Math.max(0, Math.min(1, v)); });
    _wireInput('p3-d-oat',    function(v){ _designerOA_T   = v; });
    _wireInput('p3-d-oarh',   function(v){ _designerOA_RH  = Math.max(0, Math.min(100, v)); });
    _wireInput('p3-d-rat',    function(v){ _designerRA_T   = v; _saDropMaybeRefresh(); });
    _wireInput('p3-d-rarh',   function(v){ _designerRA_RH  = Math.max(0, Math.min(100, v)); _saDropMaybeRefresh(); });
    _wireInput('p3-d-sat',    function(v){ _designerSA_T   = v; });
    _wireInput('p3-d-sarh',   function(v){ _designerSA_RH  = Math.max(0, Math.min(100, v)); });
    _wireInput('p3-d-erveps', function(v){ _designerERVEps = Math.max(0, Math.min(1, v)); _saDropMaybeRefresh(); });
    /* ERV on/off checkbox -- separate handler because it's a checkbox not
       a number input. */
    if (_ervCheck) {
        _ervCheck.onchange = function(){
            _designerERVOn = !!_ervCheck.checked;
            _persistDesignerState();
            render2DChart();
        };
    }
    /* [USE LIVE OA] button: copies the most recent weatherData point into
       the OA T + OA RH inputs.  Disabled (grey, dimmed) when no weather
       data has loaded yet so users don't get a silently-stuck click.
       Toggling a fresh weather strip via the location/from/to controls
       re-fills weatherData -- a subsequent click then picks up the new
       last point. */
    var _liveBtn = dCfg.querySelector('#p3-d-uselive');
    var _refreshLiveBtn = function(){
        if (!_liveBtn) return;
        var has = (typeof weatherData !== 'undefined') && weatherData && weatherData.length > 0;
        _liveBtn.disabled = !has;
        _liveBtn.style.opacity = has ? '1' : '0.45';
        _liveBtn.style.cursor  = has ? 'pointer' : 'not-allowed';
        if (has) {
            var p = weatherData[weatherData.length - 1];
            _liveBtn.title = 'Click to copy live OA = ' + p.t.toFixed(1) + '\u00b0C / ' + p.rh.toFixed(0) +
                             '% (latest point in current Weather Strip) into the OA inputs above.';
        } else {
            _liveBtn.title = 'No weather data loaded yet. Load a Weather Strip first, then click here to pull the latest OA reading.';
        }
    };
    _refreshLiveBtn();
    if (_liveBtn) {
        _liveBtn.onclick = function(){
            if (typeof weatherData === 'undefined' || !weatherData || !weatherData.length) {
                /* Soft feedback rather than alert() -- flash the button red
                   for 600ms so the operator notices but isn't interrupted. */
                _liveBtn.style.color = '#ef4444'; _liveBtn.style.borderColor = '#ef4444';
                _liveBtn.textContent = '\u2716 no data yet';
                setTimeout(function(){
                    _liveBtn.style.color = '#fb7185'; _liveBtn.style.borderColor = '#fb7185';
                    _liveBtn.textContent = '\u00b7 use live OA \u00b7';
                }, 800);
                return;
            }
            var p = weatherData[weatherData.length - 1];
            _designerOA_T  = p.t;
            _designerOA_RH = p.rh;
            _setD('p3-d-oat',  +_designerOA_T.toFixed(1));
            _setD('p3-d-oarh', Math.round(_designerOA_RH));
            _persistDesignerState();
            /* Brief green confirmation pulse so the operator sees the action
               registered. */
            _liveBtn.style.color = '#22c55e'; _liveBtn.style.borderColor = '#22c55e';
            _liveBtn.textContent = '\u2713 ' + p.t.toFixed(1) + '\u00b0C / ' + p.rh.toFixed(0) + '%';
            setTimeout(function(){
                _liveBtn.style.color = '#fb7185'; _liveBtn.style.borderColor = '#fb7185';
                _liveBtn.textContent = '\u00b7 use live OA \u00b7';
            }, 1100);
            render2DChart();
        };
    }
    /* Refresh the button's enabled-state whenever a Weather Strip finishes
       loading.  weatherData mutates inside the existing fetch path; hook
       the same DOM event the chart already listens to. */
    window.addEventListener('red5-weather-loaded', _refreshLiveBtn);

    dmBtn.onclick = function(){
        _designerMode = !_designerMode;
        _refreshDesignerBtn();
        dCfg.style.display = _designerMode ? 'block' : 'none';
        _persistDesignerState();
        render2DChart();
    };

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
      optCfg.style.cssText = 'position:absolute;top:42px;left:660px;z-index:51;'+
        'background:rgba(15,23,42,.92);border:1px solid #c084fc;border-radius:6px;'+
        'padding:6px 10px;font-size:9px;color:#e2e8f0;font-family:inherit;'+
        'backdrop-filter:blur(14px);display:none;min-width:170px;'+
        'box-shadow:0 6px 18px rgba(0,0,0,.45)';
      // Compute B1-B10's SA-enthalpy range once.  Opt-SA stays a true
      // theoretical floor only when the envelope [optMin, optMax] FULLY
      // ENCLOSES this range — otherwise the clamp can force Opt-SA to do
      // more work than B1-B10 in some bands and the "floor" claim breaks.
      var _bandHsaRange = (function(){
        var lo = Infinity, hi = -Infinity;
        for (var i = 0; i < BANDS.length; i++){
          var b = BANDS[i];
          var h = enthalpy(b.sa_t, getW(b.sa_t, b.sa_rh));
          if (h < lo) lo = h;
          if (h > hi) hi = h;
        }
        return {lo: lo, hi: hi};
      })();
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
        '</label>'+
        '<div id="p3-opt-warn" data-testid="opt-sa-floor-warn" style="display:none;margin-top:6px;padding:4px 7px;'+
          'background:rgba(120,53,15,.55);border:1px solid #f59e0b;border-radius:4px;'+
          'color:#fcd34d;font-size:8.5px;line-height:1.45;letter-spacing:.02em;cursor:help" '+
          'title="Opt-SA stays a true energy floor only when [min, max] fully encloses B1-B10\u2019s SA-enthalpy range ('+
          _bandHsaRange.lo.toFixed(1)+'\u2013'+_bandHsaRange.hi.toFixed(1)+' kJ/kg). Inside that range, the clamp can force Opt-SA to do MORE work than B1-B10 in some bands.">'+
          '<span style="font-weight:900">\u26A0 NOT A TRUE FLOOR</span> '+
          '<span id="p3-opt-warn-detail"></span>'+
        '</div>';
      $('#p3-overlay2d').appendChild(optCfg);
      var minInp = optCfg.querySelector('#p3-opt-min');
      var maxInp = optCfg.querySelector('#p3-opt-max');
      var minV   = optCfg.querySelector('#p3-opt-min-v');
      var maxV   = optCfg.querySelector('#p3-opt-max-v');
      var warnEl = optCfg.querySelector('#p3-opt-warn');
      var warnDt = optCfg.querySelector('#p3-opt-warn-detail');
      function _updateOptWarn(){
        // True floor requires optMin <= bandHsaRange.lo AND optMax >= bandHsaRange.hi.
        var minOk = _optMinH <= _bandHsaRange.lo + 0.01;
        var maxOk = _optMaxH >= _bandHsaRange.hi - 0.01;
        if (minOk && maxOk) {
          warnEl.style.display = 'none';
          return;
        }
        var bits = [];
        if (!minOk) bits.push('min &gt; '+_bandHsaRange.lo.toFixed(1));
        if (!maxOk) bits.push('max &lt; '+_bandHsaRange.hi.toFixed(1));
        warnDt.innerHTML = '\u2014 envelope inside B1\u2013B10 range ('+bits.join(', ')+'). Opt-SA may exceed B1\u2013B10 in some bands.';
        warnEl.style.display = 'block';
      }
      _updateOptWarn();
      minInp.addEventListener('input', function(){
        _optMinH = parseFloat(this.value);
        if (_optMinH > _optMaxH - 1) { _optMinH = _optMaxH - 1; this.value = _optMinH; }
        minV.textContent = _optMinH.toFixed(1);
        _updateOptWarn();
        render2DChart();
      });
      maxInp.addEventListener('input', function(){
        _optMaxH = parseFloat(this.value);
        if (_optMaxH < _optMinH + 1) { _optMaxH = _optMinH + 1; this.value = _optMaxH; }
        maxV.textContent = _optMaxH.toFixed(1);
        _updateOptWarn();
        render2DChart();
      });
    }
    function _refreshOptCfg(){
      optCfg.style.display = _msShowOpt ? 'block' : 'none';
    }
    _refreshOptCfg();

    /* ========================================================================
       Monthly x Sites legend display-mode selector (A/B/C/$).
       Four buttons in a tight row sitting at the bottom of the overlay so
       they don't crowd the strategy toggles up top.  Each updates _msMode
       and triggers a re-render.  '$' toggle also reveals the cost-config
       panel for editing airflow / utility rate / COP / violation cost.
       ======================================================================== */
    var modeRow = $('#p3-ms-modes');
    if (!modeRow) {
      modeRow = document.createElement('div');
      modeRow.id = 'p3-ms-modes';
      modeRow.style.cssText = 'position:absolute;right:20px;top:48px;z-index:51;'+
        'display:none;font-family:inherit;font-size:9px;color:#1e293b;'+
        'background:rgba(241,245,249,.96);backdrop-filter:blur(10px);'+
        'border:1px solid #94a3b8;border-radius:6px;padding:6px 10px;'+
        'box-shadow:0 4px 12px rgba(0,0,0,.25)';
      var modeDefs = [
        {key:'A', lbl:_t('mode_a_comfort','A: Comfort hours'), tip:'Latent-load coverage per strategy: how many of the year\u2019s humid hours each strategy can actually dehumidify.\nPure facts; no assumptions.'},
        {key:'B', lbl:_t('mode_b_sens_lat','B: Sens / Lat'),    tip:'Sensible vs latent decomposition of each strategy\u2019s annual load.  Shows WHY B1-B10 \u201cspends more energy\u201d \u2014 it\u2019s doing latent work the others skip.'},
        {key:'C', lbl:_t('mode_c_tradeoff','C: Trade-off'),     tip:'Architectural fact-sheet per strategy:\n  E   = energy axis (lower is better)\n  C   = comfort / latent control\n  Code= maps to ASHRAE/Title-24/etc.\n  FS  = failsafe behaviour on sensor faults'},
        {key:'$', lbl:_t('mode_d_cost','$: Cost / yr'),         tip:'Total cost of ownership = (energy x utility rate) + (uncovered humid hours x violation cost).\nALL inputs user-editable; defaults are documented and conservative.'}
      ];
      modeRow.innerHTML =
        '<span style="color:#475569;font-weight:900;letter-spacing:.08em;text-transform:uppercase;margin-right:8px">'+_t('legend_mode','Legend mode:')+'</span>' +
        modeDefs.map(function(m){
          return '<button type="button" data-mode="'+m.key+'" title="'+m.tip+'"'+
            ' style="background:#ffffff;border:1px solid #94a3b8;color:#1e293b;'+
            'padding:3px 8px;border-radius:4px;margin-right:4px;cursor:pointer;'+
            'font-family:inherit;font-size:9px;font-weight:900">'+m.lbl+'</button>';
        }).join('');
      $('#p3-overlay2d').appendChild(modeRow);
      // Bind clicks
      Array.prototype.forEach.call(modeRow.querySelectorAll('button'), function(b){
        b.addEventListener('click', function(){
          _msMode = b.getAttribute('data-mode');
          _refreshModeRow();
          _refreshCostCfg();
          render2DChart();
        });
      });
    }
    function _refreshModeRow(){
      Array.prototype.forEach.call(modeRow.querySelectorAll('button'), function(b){
        var on = (b.getAttribute('data-mode') === _msMode);
        b.style.background = on ? '#7c3aed' : '#ffffff';
        b.style.color      = on ? '#ffffff' : '#1e293b';
        b.style.borderColor= on ? '#7c3aed' : '#94a3b8';
      });
    }
    _refreshModeRow();

    /* Cost-config panel: sliders/inputs for airflow, utility rate, COPs,
       and comfort-violation rate.  Only shown when '$' mode is active so
       it doesn't clutter the chart in A/B/C modes.  Every input is
       documented with a minimal tooltip explaining the assumption. */
    var costCfg = $('#p3-ms-costcfg');
    if (!costCfg) {
      costCfg = document.createElement('div');
      costCfg.id = 'p3-ms-costcfg';
      costCfg.style.cssText = 'position:absolute;right:20px;top:82px;z-index:52;'+
        'display:none;font-family:inherit;font-size:9px;color:#1e293b;'+
        'background:rgba(241,245,249,.97);backdrop-filter:blur(14px);'+
        'border:1px solid #10b981;border-radius:6px;padding:8px 12px;'+
        'min-width:380px;box-shadow:0 6px 18px rgba(0,0,0,.25)';
      function _row(id, label, value, unit, min, max, step, tip){
        return '<label style="display:flex;align-items:center;gap:6px;margin-bottom:4px" title="'+tip+'">'+
          '<span style="width:140px;color:#047857;font-weight:700">'+label+'</span>'+
          '<input id="'+id+'" type="number" value="'+value+'" min="'+min+'" max="'+max+'" step="'+step+'"'+
          ' style="width:80px;background:#ffffff;border:1px solid #94a3b8;color:#1e293b;'+
          'padding:2px 6px;border-radius:3px;font-family:inherit;font-size:9px">'+
          '<span style="color:#64748b;font-size:8px">'+unit+'</span>'+
        '</label>';
      }
      costCfg.innerHTML =
        '<div style="font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:#047857;margin-bottom:6px">'+_t('cost_model_title','Cost Model -- plug your numbers')+'</div>'+
        _row('p3-cost-air',  _t('cost_airflow','Airflow'),         _costAirM3h,    'm\u00b3/h, 6 ACH @ 3m for 1000 sqm',  500,  100000, 100,  'AHU supply airflow.  Default = 18,000 m\u00b3/h (6 ACH at 3m ceiling for 1000 sqm). Replace with your AHU\u2019s actual CFM x 1.7 for m\u00b3/h.') +
        _row('p3-cost-rate', _t('cost_utility_rate','Utility rate'),    _costRate,      'USD / kWh',                    0.05, 1.0,    0.01, 'Blended electric rate (or oil/gas equivalent). Default 0.15. US average ~0.16; check your utility bill.') +
        _row('p3-cost-cop',  _t('cost_cooling_cop','Cooling COP'),     _costCopCool,   'electric chiller, typical 3.0-4.5', 1.0,  6.0,    0.1,  'Coefficient of Performance for cooling. 3.5 = typical electric chiller; 5.0 = high-efficiency VRF; 1.0 = window AC.') +
        _row('p3-cost-eff',  _t('cost_heating_eff','Heating eff.'),    _costEffHeat,   '0.95 gas / 3.0 heat pump',     0.5,  4.0,    0.05, 'Heating efficiency. 0.95 = condensing gas furnace; 3.0 = heat pump COP. Mind the units.') +
        _row('p3-cost-viol', _t('cost_violation_rate','Violation rate'),  _costViolRate,  'USD / humid-hour uncovered',   0,    200,    1,    'Cost per hour of unmet humidity control. 5 = complaint handling only; 15 = + productivity loss; 50+ = regulated environments.') +
        '<div style="font-size:8px;color:#475569;margin-top:6px;line-height:1.4">'+
          'Annual cost = (cool_kJ + heat_kJ) x mass_flow / 3600 / efficiency x rate'+
          '<br>+ uncovered_humid_hours x violation_rate.  All five strategies use the same inputs; only their own energy and coverage differ.'+
        '</div>';
      $('#p3-overlay2d').appendChild(costCfg);
      // Bind input listeners
      var bind = function(id, key, parser){
        $('#'+id).addEventListener('input', function(){
          var v = parser(this.value);
          if (isFinite(v)) { window['_'+key] = v; render2DChart(); }
        });
      };
      // Direct-state binding
      var inpAir  = costCfg.querySelector('#p3-cost-air');
      var inpRate = costCfg.querySelector('#p3-cost-rate');
      var inpCop  = costCfg.querySelector('#p3-cost-cop');
      var inpEff  = costCfg.querySelector('#p3-cost-eff');
      var inpViol = costCfg.querySelector('#p3-cost-viol');
      inpAir.addEventListener('input',  function(){ var v=parseFloat(this.value); if(isFinite(v))_costAirM3h  =v; render2DChart(); });
      inpRate.addEventListener('input', function(){ var v=parseFloat(this.value); if(isFinite(v))_costRate    =v; render2DChart(); });
      inpCop.addEventListener('input',  function(){ var v=parseFloat(this.value); if(isFinite(v))_costCopCool =v; render2DChart(); });
      inpEff.addEventListener('input',  function(){ var v=parseFloat(this.value); if(isFinite(v))_costEffHeat =v; render2DChart(); });
      inpViol.addEventListener('input', function(){ var v=parseFloat(this.value); if(isFinite(v))_costViolRate=v; render2DChart(); });
    }
    function _refreshCostCfg(){
      costCfg.style.display = (_msMode === '$') ? 'block' : 'none';
    }
    _refreshCostCfg();

    /* Re-renders DOM-based labels (mode-row buttons + cost-config inputs)
       in the current language.  Called by the langchange listener wired
       up at the bottom of init().                                       */
    function _refreshI18nDomLabels(){
      var lblSpan = modeRow.querySelector('span');
      if (lblSpan) lblSpan.textContent = _t('legend_mode','Legend mode:');
      var modeMap = {
        A: _t('mode_a_comfort','A: Comfort hours'),
        B: _t('mode_b_sens_lat','B: Sens / Lat'),
        C: _t('mode_c_tradeoff','C: Trade-off'),
        '$': _t('mode_d_cost','$: Cost / yr')
      };
      Array.prototype.forEach.call(modeRow.querySelectorAll('button'), function(b){
        var k = b.getAttribute('data-mode');
        if (modeMap[k]) b.textContent = modeMap[k];
      });
      var labels = costCfg.querySelectorAll('label > span:first-child');
      var keys = ['cost_airflow','cost_utility_rate','cost_cooling_cop',
                  'cost_heating_eff','cost_violation_rate'];
      var fbs  = ['Airflow','Utility rate','Cooling COP','Heating eff.','Violation rate'];
      for (var i = 0; i < labels.length && i < keys.length; i++){
        labels[i].textContent = _t(keys[i], fbs[i]);
      }
      var titleDiv = costCfg.querySelector('div:first-child');
      if (titleDiv) titleDiv.textContent = _t('cost_model_title','Cost Model -- plug your numbers');
    }
    // Expose to the langchange listener installed at the bottom of init().
    root._refreshI18nDomLabels = _refreshI18nDomLabels;

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

    /* ------------------------------------------------------------------------
       Strategy dropdown (replaces the 5 individual + Fixed/+Dyn-Reset/+B1-B10/
       +B1-B10 & Dyn-Reset/+Opt-SA toggle buttons).  Same UX pattern as the
       Sites dropdown above.  Each row is a checkbox that toggles the matching
       _msShow* state var via .click() on the (now permanently hidden) legacy
       button — keeps all the existing render math untouched.
       Position: just past the Sites dropdown (left:485 ends ≈635) so the row
       reads HEADER → SITES → STRATEGIES → OA, matching the operator's
       requested layout.
       ----------------------------------------------------------------------- */
    var stratDdBtn = document.createElement('button');
    stratDdBtn.id = 'p3-btn-strat-dd';
    stratDdBtn.type = 'button';
    stratDdBtn.style.cssText = 'position:absolute;top:12px;left:660px;z-index:51;background:rgba(15,23,42,.92);border:1px solid #c084fc;color:#c084fc;padding:6px 14px;border-radius:6px;font-size:10px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;font-family:inherit;backdrop-filter:blur(14px);display:none;min-width:170px;text-align:left';
    stratDdBtn.textContent = 'Strategies \u25BE';
    $('#p3-overlay2d').appendChild(stratDdBtn);

    var stratDdPanel = document.createElement('div');
    stratDdPanel.id = 'p3-strat-dd-panel';
    stratDdPanel.style.cssText = 'position:absolute;top:42px;left:660px;z-index:60;background:rgba(15,23,42,.96);border:1px solid #c084fc;border-radius:6px;padding:0;font-size:10px;color:#e2e8f0;font-family:inherit;backdrop-filter:blur(14px);display:none;min-width:240px;max-height:360px;overflow-y:auto;box-shadow:0 10px 28px rgba(0,0,0,.55)';
    $('#p3-overlay2d').appendChild(stratDdPanel);

    /* Each entry binds a state-var getter to a hidden legacy button so we can
       fire the existing onclick (which toggles the var, refreshes the legacy
       button cosmetics, and calls render2DChart()) instead of duplicating
       any render math here. */
    function _stratDefs(){
      return [
        {key:'fixed',   id:'p3-btn-ms-fixed',   color:'#a855f7', label:'Fixed-SA',
         on:function(){return _msShowFixed;}},
        {key:'dyn',     id:'p3-btn-ms-dyn',     color:'#d8b4fe', label:'Dyn-Reset',
         on:function(){return _msShowDyn;}},
        {key:'band',    id:'p3-btn-ms-band',    color:'#10b981', label:'B1-B10',
         on:function(){return _msShowBand;}},
        {key:'banddyn', id:'p3-btn-ms-banddyn', color:'#22d3ee', label:'B1-B10 + Dyn-Reset',
         on:function(){return _msShowBandDyn;}},
        {key:'opt',     id:'p3-btn-ms-opt',     color:'#c084fc', label:'Opt-SA',
         on:function(){return _msShowOpt;}}
      ];
    }

    function _refreshStratDropdown(){
      var defs = _stratDefs();
      var nOn = defs.filter(function(d){return d.on();}).length;
      stratDdBtn.textContent = 'Strategies: ' + nOn + '/' + defs.length + ' \u25BE';
      var html = '';
      // All / None convenience row matches the Sites dropdown styling.
      html += '<div style="display:flex;gap:6px;padding:6px 8px;border-bottom:1px solid #334155;background:rgba(2,6,23,.4);position:sticky;top:0">'+
        '<button data-stract="all"  style="flex:1;background:rgba(192,132,252,.15);border:1px solid #c084fc;color:#c084fc;padding:4px 6px;border-radius:4px;font-size:9px;font-weight:900;letter-spacing:.05em;cursor:pointer;font-family:inherit;text-transform:uppercase">All</button>'+
        '<button data-stract="none" style="flex:1;background:rgba(15,23,42,.6);border:1px solid #475569;color:#94a3b8;padding:4px 6px;border-radius:4px;font-size:9px;font-weight:900;letter-spacing:.05em;cursor:pointer;font-family:inherit;text-transform:uppercase">None</button>'+
        '</div>';
      defs.forEach(function(d){
        var isOn = d.on();
        var labelEsc = d.label.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        // Inline color swatch matches the chart curve color so operators can
        // map checkbox → curve at a glance without reading the legend.
        html += '<label data-strat="'+d.key+'" style="display:flex;align-items:center;padding:6px 12px;cursor:pointer;border-bottom:1px solid rgba(51,65,85,.4);' + (isOn?'background:rgba(192,132,252,.10)':'') + '">'+
          '<input type="checkbox" '+(isOn?'checked':'')+' style="margin-right:8px;accent-color:'+d.color+';cursor:pointer;width:13px;height:13px">'+
          '<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:'+d.color+';margin-right:8px;flex-shrink:0"></span>'+
          '<span style="flex:1;color:'+(isOn?'#e2e8f0':'#cbd5e1')+';font-weight:'+(isOn?'900':'700')+'">'+labelEsc+'</span>'+
        '</label>';
      });
      stratDdPanel.innerHTML = html;
      // Bind row clicks → fire the legacy button's onclick (which toggles the
      // state var, refreshes the hidden button cosmetics, and re-renders).
      Array.prototype.forEach.call(stratDdPanel.querySelectorAll('label[data-strat]'), function(lbl){
        lbl.addEventListener('click', function(e){
          // Browser is mid-toggling cb.checked. Defer so we read post-click state.
          setTimeout(function(){
            var key = lbl.dataset.strat;
            var def = _stratDefs().find(function(d){return d.key === key;});
            if (!def) return;
            var legacyBtn = $('#'+def.id);
            if (!legacyBtn) return;
            // Only fire .click() if the desired state differs from current.
            // (Without this, clicking the input AND the label would fire twice.)
            var wantOn = lbl.querySelector('input[type=checkbox]').checked;
            if (def.on() !== wantOn) {
              legacyBtn.click();
            }
            _refreshStratDropdown();
          }, 0);
        });
      });
      Array.prototype.forEach.call(stratDdPanel.querySelectorAll('button[data-stract]'), function(btn){
        btn.onclick = function(e){
          e.stopPropagation();
          var act = btn.dataset.stract;
          var defs = _stratDefs();
          defs.forEach(function(d){
            var legacyBtn = $('#'+d.id);
            if (!legacyBtn) return;
            var want = (act === 'all');
            if (d.on() !== want) legacyBtn.click();
          });
          _refreshStratDropdown();
        };
      });
    }

    stratDdBtn.onclick = function(e){
      e.stopPropagation();
      var open = stratDdPanel.style.display === 'block';
      if (open) { stratDdPanel.style.display = 'none'; return; }
      _refreshStratDropdown();
      stratDdPanel.style.display = 'block';
    };
    var _stratDdOutsideHandler = function(e){
      if (_disposed || !stratDdPanel || stratDdPanel.style.display !== 'block') return;
      if (stratDdPanel.contains(e.target) || stratDdBtn.contains(e.target)) return;
      stratDdPanel.style.display = 'none';
    };
    document.addEventListener('click', _stratDdOutsideHandler);
    _cleanupTasks.push(function(){ document.removeEventListener('click', _stratDdOutsideHandler); });
    // Initial label render (so the trigger reads "Strategies: 5/5 ▾" not "Strategies ▾").
    _refreshStratDropdown();

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

        // ---- Monthly \u00d7 Sites mode: OA-curve hover tooltip ----
        // Walks the cached OA hitboxes (one per site \u00d7 month dot) and
        // shows the nearest match within 12 px.  Tooltip surfaces the
        // panel name, month name, and exact damper % so audiences can
        // verify the band-coverage math without taking my word for it.
        // Gated on _msShowOA so when OA visualisation is hidden, hover
        // doesn't accidentally pop tooltips for invisible data.
        if(chart2DMode==='monthly-sites' && _msShowOA && _msOaHits.length){
          var bestHit = null, bestD2 = 144; // 12px squared
          for(var hi=0; hi<_msOaHits.length; hi++){
            var h = _msOaHits[hi];
            var d2 = (h.x-mx)*(h.x-mx) + (h.y-my)*(h.y-my);
            if(d2 < bestD2){ bestD2 = d2; bestHit = h; }
          }
          if(bestHit){
            var monthNames=['January','February','March','April','May','June',
                            'July','August','September','October','November','December'];
            var html='<div style="color:#fbbf24;font-weight:900;margin-bottom:2px">OA Damper</div>'+
              '<div style="color:#e2e8f0;margin-bottom:3px"><b>'+bestHit.siteName+'</b> ('+bestHit.panel+')</div>'+
              '<div style="color:#94a3b8;font-size:9px;margin-bottom:4px">'+monthNames[bestHit.month]+' monthly mean</div>'+
              '<div style="color:#fbbf24;font-size:14px;font-weight:900">'+bestHit.val.toFixed(1)+'%</div>'+
              '<div style="color:#64748b;font-size:8px;margin-top:4px;max-width:180px;line-height:1.3">'+
                'Mean of band-prescribed OA damper over all hours in this month.  See B1\u2013B10 table for the lookup.'+
              '</div>';
            tip2d.innerHTML = html;
            tip2d.style.display='block';
            tip2d.style.left = Math.min(rect.width-200, mx+12)+'px';
            tip2d.style.top  = Math.max(8, my-12)+'px';
            return;
          }
          tip2d.style.display='none';
          // fall through so X-Y / Psy hover doesn't accidentally fire below
          return;
        }

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
            fetch(__psy3d_archiveUrl(site.lat, site.lon, fromD, toD))
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
      /* Collect every Points mesh under pathGroup.  Earlier the tooltip
         grabbed `pathGroup.children[0]` assuming a single scatter mesh,
         but the RH-band split adds a chronological Line at index 0 plus
         up to two Points (in-band + out-of-band).  Walking the children
         array makes the hit-test robust to the layer order. */
      var wxPts = [];
      if (pathGroup) {
        for (var ci = 0; ci < pathGroup.children.length; ci++) {
          var ch = pathGroup.children[ci];
          if (ch && ch.isPoints) wxPts.push(ch);
        }
      }
      var vavPts=(vavGroup&&vavGroup.children.length>0&&vavGroup.children[0].isPoints)?vavGroup.children[0]:null;
      var targets=wxPts.slice();
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
        }else if(hitObj.isPoints && hitObj.userData && hitObj.userData.kind === 'wx'){
          /* Out-band / in-band scatter point.  Local `idx` is into the
             split mesh's geometry; resolve back to the original
             weatherData index via the userData.idxMap stashed at build
             time.  Falls back to direct indexing if the map is missing
             (older cached version of the engine). */
          var map = hitObj.userData.idxMap;
          var wIdx = (map && idx < map.length) ? map[idx] : idx;
          if (wIdx < weatherData.length) {
            var p=weatherData[wIdx];var d=new Date(p.ts);
            html='<div style="color:#f472b6;margin-bottom:1px"><b>'+d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})+' '+d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:false})+'</b></div><div>T = <b style="color:#60a5fa">'+p.t.toFixed(1)+' \u00b0C</b></div><div>RH = <b style="color:#34d399">'+p.rh.toFixed(0)+'%</b></div><div>W = <b style="color:#fbbf24">'+(p.w*1000).toFixed(1)+' g/kg</b></div>';
            /* When ERV is ON, append a savings block: OA' state + per-hour
               enthalpy delta in kJ/kg + dollar value at current tariff. */
            if (_saDropERVOn && saDropGroup && saDropGroup.visible) {
              var hEps = Math.max(0, Math.min(1, _designerERVEps));
              var hRaT = _designerRA_T, hRaW = getW(_designerRA_T, _designerRA_RH);
              var hOaT = p.t + hEps * (hRaT - p.t);
              var hOaW = p.w + hEps * (hRaW - p.w);
              var hDh  = enthalpy(p.t, p.w) - enthalpy(hOaT, hOaW);
              var hRtH = Math.abs(hDh) * (_designerCFM * 4.5 / 0.4299) / 12000;
              var hKWh = hRtH * 3.517;
              var hUSD = hKWh * _ervTariffKwh;
              html += '<div style="margin-top:3px;padding-top:3px;border-top:1px dashed #475569"></div>'+
                '<div style="color:#22d3ee">OA\u2032 = <b>'+hOaT.toFixed(1)+' \u00b0C / '+(hOaW*1000).toFixed(1)+' g/kg</b></div>'+
                '<div style="color:#22d3ee">\u0394h<sub>saved</sub> = <b>'+hDh.toFixed(1)+' kJ/kg</b></div>'+
                '<div style="color:#22d3ee">'+hRtH.toFixed(2)+' RT\u00b7h \u00b7 '+_ervFmtMoney(hUSD)+' saved</div>';
            }
          }
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

    /* Language change: redraw the 2D overlay (chart titles, axis labels,
       legend strings) and refresh any DOM elements whose textContent was
       set with t() at construction time.  3D scene uses no localized
       strings so it doesn't need a re-render here. */
    var _onLangChange = function(){
      // Refresh DOM-based labels rebuilt from t():
      try {
        if (root && typeof root._refreshI18nDomLabels === 'function') {
          root._refreshI18nDomLabels();
        }
      } catch(e) {}
      // Redraw 2D chart so canvas-drawn text picks up the new language.
      try { render2DChart && render2DChart(); } catch(e) {}
    };
    window.addEventListener('langchange', _onLangChange);
    _cleanupTasks.push(function(){
      window.removeEventListener('langchange', _onLangChange);
    });
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

    fetch(__psy3d_archiveUrl(lat, lon, fromD, toD))
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
      /* Fire a window-level event so other UI bits (Designer Mode's
         [USE LIVE OA] button) can refresh their enabled state. */
      try { window.dispatchEvent(new CustomEvent('red5-weather-loaded', {detail:{count:weatherData.length}})); } catch(_){}
    })
    .catch(function(e){$('#p3-status').textContent='Error: '+e.message;})
    .finally(function(){$('#p3-fetch').disabled=false;});
  }

  /* ---------- BUILD WEATHER VIS ---------- */
  /* Helper: rebuilds the saDropGroup (SA floor scatter + drop lines) using
     the current `_saDropColorMode`.  Called from buildWeatherVis on every
     weather refresh AND directly from the color-mode chip click handler so
     a recolor doesn't require re-fetching weather data. */
  function _buildSaDropGeometry(){
    var THREE = window.THREE;
    if (!saDropGroup || !weatherData || !weatherData.length) return;
    while (saDropGroup.children.length) saDropGroup.remove(saDropGroup.children[0]);
    var saV=[], saC=[], dV=[], dC=[];
    var bandMode = (_saDropColorMode === 'band');
    /* If ERV pre-treatment is active, pre-compute the RA reference point
       once (don't recalc psat() inside the per-point loop).  RA conditions
       come from the Designer Mode panel so a user dialling RA from 24
       to 22 propagates through to the Drops cloud without leaving the
       psych chart.  Epsilon clamped to [0,1] defensively. */
    var ervOn = _saDropERVOn;
    var rawW2gkg = 1000; /* getW returns kg/kg, multiply to g/kg */
    var ra_T = _designerRA_T;
    var ra_W = getW(_designerRA_T, _designerRA_RH);  /* kg/kg (same units as p.w) */
    var eps = Math.max(0, Math.min(1, _designerERVEps));
    /* For the savings-threshold filter + peak-hour annotations: walk the
       series once to find the top-3 hours by |dh_saved|.  Skipped when
       ERV is off (no savings to rank). */
    var peakIdxs = [];
    if (ervOn && _ervShowPeaks) {
      var rank = [];
      for (var pi = 0; pi < weatherData.length; pi++) {
        var pp = weatherData[pi];
        var ppT = pp.t + eps * (ra_T - pp.t);
        var ppW = pp.w + eps * (ra_W - pp.w);
        var dh = Math.abs(enthalpy(pp.t, pp.w) - enthalpy(ppT, ppW));
        rank.push({i:pi, dh:dh});
      }
      rank.sort(function(a,b){return b.dh - a.dh;});
      for (var rk = 0; rk < Math.min(3, rank.length); rk++) peakIdxs.push(rank[rk].i);
    }
    weatherData.forEach(function(p, _i){
      /* Compute the entering-air state the coil ACTUALLY sees -- OA when
         the wheel is bypassed, OA' (linearly interpolated OA->RA at eps)
         when the wheel is on.  The SA-reset target is left untouched
         because the control strategy decides on raw OA, not post-wheel
         OA -- the wheel is a thermodynamic upstream pre-treatment, not a
         control input.  This matches the Designer Mode geometry. */
      var inT = p.t, inW = p.w;
      if (ervOn) {
        inT = p.t + eps * (ra_T - p.t);
        inW = p.w + eps * (ra_W - p.w);
        /* Savings-threshold filter (g): drop hours where the wheel barely
           did anything so the cloud focuses on the heavy-lifting season. */
        if (_ervMinKJkg > 0) {
          var dh_abs = Math.abs(enthalpy(p.t, p.w) - enthalpy(inT, inW));
          if (dh_abs < _ervMinKJkg) return;
        }
      }
      /* SA target via _saReset.  When the band-source toggle is on AND
         ERV is on, _bandInputFor returns OA' so the band picker sees
         post-wheel conditions and may pick a less-aggressive SA setpoint
         (wheel-aware controller).  Otherwise this is the raw-OA baseline. */
      var bi = _bandInputFor(p);
      var sa = _saReset(bi.T, bi.RH, bi.W);
      // Cull no-action samples (zero-length drops would clutter the floor).
      // After ERV pre-treatment, "no action" is computed against the
      // entering-air state (inT/inW), not raw OA, so already-tempered
      // hours where the coil barely works are correctly hidden.
      if (Math.abs(sa.t-inT)<0.5 && Math.abs(sa.w-inW)<0.0003) return;
      var oaX = t2sx(inT), oaY = frac2sy(p.frac), oaZ = w2sz(inW);
      var saX = t2sx(sa.t),                      saZ = w2sz(sa.w);
      // Color: temperature-spectrum OR band palette.  Band palette uses
      // the same effective input (raw OA or OA') as the SA picker so
      // colors stay coherent with the SA target choice.
      var c = bandMode ? _bandRGB(bi.T, bi.RH) : t2rgb(ervOn ? inT : p.t);
      // SA dot on floor (full color).
      saV.push(saX, 0.3, saZ);
      saC.push(c[0], c[1], c[2]);
      /* ERV "savings ribbon" -- a cyan segment from the RAW OA point
         (where the air would have been with no wheel) to OA' (where the
         wheel ACTUALLY delivered it).  Drawn at the same time-Y so it
         shows up as a near-horizontal cyan trail at the cloud's top.
         Communicates per-hour wheel work alongside the per-hour coil
         work (the existing OA'->SA drop below).  Colour faded at the
         "raw OA" end (low opacity) and brightens toward OA' so the
         direction of energy recovery is unambiguous. */
      if (ervOn) {
        var rawOaX = t2sx(p.t), rawOaZ = w2sz(p.w);
        // Cyan #22d3ee = rgb(34, 211, 238) -> /255 = (.133, .827, .933)
        dV.push(rawOaX, oaY, rawOaZ,  oaX, oaY, oaZ);
        dC.push(.07, .42, .47,        .13, .83, .93);
      }
      // Coil drop line: top vertex (OA or OA') = full color; bottom vertex
      // (SA on floor) = 35% color so the line fades as it descends.
      dV.push(oaX, oaY, oaZ,  saX, 0, saZ);
      dC.push(c[0], c[1], c[2],  c[0]*0.35, c[1]*0.35, c[2]*0.35);
    });

    /* A/B GHOST CLOUD (h): if _ervGhostEps is set and different from the
       active epsilon, render a translucent second cloud using the same
       drop layout but in purple so the comparison is visually distinct
       from the active cyan/spectrum cloud.  No SA-floor dots for the
       ghost — only the OA'->SA drop lines — to keep the floor uncluttered. */
    var ghostV = null, ghostC = null;
    if (ervOn && _ervGhostEps > 0 && Math.abs(_ervGhostEps - eps) > 0.005) {
      ghostV = [];
      ghostC = [];
      var gEps = Math.max(0, Math.min(0.95, _ervGhostEps));
      weatherData.forEach(function(p){
        var gT = p.t + gEps * (ra_T - p.t);
        var gW = p.w + gEps * (ra_W - p.w);
        if (_ervMinKJkg > 0) {
          var dh = Math.abs(enthalpy(p.t, p.w) - enthalpy(gT, gW));
          if (dh < _ervMinKJkg) return;
        }
        var sa = _saReset(p.t, p.rh, p.w);
        if (Math.abs(sa.t-gT)<0.5 && Math.abs(sa.w-gW)<0.0003) return;
        var oaX = t2sx(gT), oaY = frac2sy(p.frac), oaZ = w2sz(gW);
        var saX = t2sx(sa.t),                      saZ = w2sz(sa.w);
        /* Purple #a855f7 for ghost -- contrasts with cyan/spectrum live cloud. */
        ghostV.push(oaX, oaY, oaZ, saX, 0, saZ);
        ghostC.push(.66, .33, .97,  .23, .12, .34);
      });
    }
    if (!saV.length) return;
    var saGeo = new THREE.BufferGeometry();
    saGeo.setAttribute('position', new THREE.Float32BufferAttribute(saV, 3));
    saGeo.setAttribute('color',    new THREE.Float32BufferAttribute(saC, 3));
    saDropGroup.add(new THREE.Points(saGeo, new THREE.PointsMaterial({
      size:2.6, vertexColors:true, transparent:true, opacity:.95,
      sizeAttenuation:true, depthWrite:false
    })));
    var dropGeo = new THREE.BufferGeometry();
    dropGeo.setAttribute('position', new THREE.Float32BufferAttribute(dV, 3));
    dropGeo.setAttribute('color',    new THREE.Float32BufferAttribute(dC, 3));
    saDropGroup.add(new THREE.LineSegments(dropGeo, new THREE.LineBasicMaterial({
      vertexColors:true, transparent:true, opacity:.45, depthWrite:false
    })));
    if (ghostV && ghostV.length) {
      var gGeo = new THREE.BufferGeometry();
      gGeo.setAttribute('position', new THREE.Float32BufferAttribute(ghostV, 3));
      gGeo.setAttribute('color',    new THREE.Float32BufferAttribute(ghostC, 3));
      saDropGroup.add(new THREE.LineSegments(gGeo, new THREE.LineBasicMaterial({
        vertexColors:true, transparent:true, opacity:.32, depthWrite:false
      })));
    }

    /* PEAK-HOUR ANNOTATIONS (f): render small floating sprite labels at
       the OA'-side of the top-3 cyan ribbons.  Sprite size in world units
       picked so the label is legible at the default camera distance. */
    if (peakIdxs.length) {
      peakIdxs.forEach(function(pIdx, rank){
        var p = weatherData[pIdx];
        var pT = p.t + eps * (ra_T - p.t);
        var pW = p.w + eps * (ra_W - p.w);
        var dhP = Math.abs(enthalpy(p.t, p.w) - enthalpy(pT, pW));
        var d = new Date(p.ts);
        var stamp = (d.getMonth()+1) + '/' + d.getDate() + ' ' + d.getHours() + 'h';
        var txt = '#' + (rank+1) + '  ' + stamp + '  ' + dhP.toFixed(1) + ' kJ/kg';
        var cv = document.createElement('canvas');
        cv.width = 256; cv.height = 48;
        var ctx2 = cv.getContext('2d');
        ctx2.fillStyle = 'rgba(15,23,42,.92)';
        ctx2.fillRect(0,0,cv.width,cv.height);
        ctx2.strokeStyle = '#fbbf24';
        ctx2.lineWidth = 3;
        ctx2.strokeRect(0,0,cv.width,cv.height);
        ctx2.fillStyle = '#fbbf24';
        ctx2.font = '900 22px Courier New';
        ctx2.fillText(txt, 10, 32);
        var tex = new THREE.CanvasTexture(cv);
        var spr = new THREE.Sprite(new THREE.SpriteMaterial({map:tex, transparent:true, depthWrite:false}));
        spr.position.set(t2sx(pT), frac2sy(p.frac) + 2.5, w2sz(pW));
        spr.scale.set(10, 1.9, 1);
        saDropGroup.add(spr);
      });
    }
  }

  /* Tiny adapter called whenever a Designer-Mode input that the Drops
     layer depends on (RA T/RH, ERV epsilon) changes.  Rebuilds the Drops
     geometry ONLY if both the layer is enabled AND ERV pre-treatment is
     on -- otherwise it's a pointless no-op.  Keeps the live-edit feel
     of the Designer panel without forcing a full weather refetch. */
  function _saDropMaybeRefresh(){
    if (!saDropGroup || !saDropGroup.visible) return;
    if (!_saDropERVOn) return;
    _buildSaDropGeometry();
  }

  /* ---------- SA PATH (Supply Air timeline) -------------------------------
     Modes (controlled by `_saSourceMode` and friends, defined alongside
     the panel wiring above):
       'modeled'  — current behavior: amber polyline of _saReset() per OA
                    timestamp (controller logic from Open-Meteo OA).
       'measured' — cyan polyline of measured SA from /api/ahu/{id}/sa-
                    timeseries.  Mapped onto the Time axis by matching
                    the sample's `ts` against the weatherData window.
       'both'     — both polylines, plus an optional translucent drift
                    ribbon (_saRibbonOn) connecting paired timestamps so
                    controller-drift becomes visually scannable.
     Companion to OA→SA Drops (prescriptive setpoints).
     ------------------------------------------------------------------ */
  /* Status line under the SA panel.  Engine scope, not setupControls scope:
     the geometry builders report through it, and they live out here. */
  function _saSetStatus(txt, color){
    var el = document.getElementById('p3-sa-status');
    if (!el) return;
    el.textContent = txt || '';
    el.style.color = color || '#64748b';
  }

  /* Time-axis mapping shared by every per-timestamp layer (SA Path, Mix /
     Coil).  weatherData samples carry their own .frac; telemetry arrives as
     unix seconds and has to be projected onto the same Y or two layers
     describing the same hour would sit at different heights. */
  function _tsToY(ts_unix_s){
    if (!weatherData || !weatherData.length) return 0;
    var t0_ms = new Date(weatherData[0].ts).getTime();
    var tN_ms = new Date(weatherData[weatherData.length-1].ts).getTime();
    var span_ms = Math.max(1, tN_ms - t0_ms);
    var frac = (ts_unix_s * 1000 - t0_ms) / span_ms;
    if (frac < 0) frac = 0; else if (frac > 1) frac = 1;
    return frac2sy(frac);
  }

  /* ---------- MIX / COIL SPLIT --------------------------------------------
     One two-segment hook per measured sample, at that sample's own time-Y:

         OA --violet--> MA --blue--> SA

     Violet is the mixing box: enthalpy the dampers moved for the price of
     fan power alone.  Blue is the coil: enthalpy somebody paid for.  The two
     sum to the OA->SA total the single exchange pill used to report, which is
     the point of splitting it -- the total tells you how much work the hour
     needed, and the split tells you who did it.

     Read it by proportion, not by leg length alone.  At a 15 percent minimum
     damper the violet leg is long because recirculated return air is doing
     most of the conditioning; in the economizer window violet collapses
     toward zero, not because nothing is free but because the air is already
     near target and the whole hook is short.  Short hook = good hour.

     Unlike the Drops layer this is not weather-driven: OA, MA and SA all come
     from one telemetry sample, so nothing here is a model of a model.
     Samples with no locatable MA carry no ma_* keys and are skipped, so an
     AHU without mixed-air instrumentation draws nothing rather than something
     invented, and a damper-basis MA is dimmed because its position is
     inferred from a commanded percentage rather than measured. */
  function _buildMaSplitGeometry(){
    var THREE = window.THREE;
    if (!maSplitGroup) return;
    while (maSplitGroup.children.length) maSplitGroup.remove(maSplitGroup.children[0]);
    if (!maSplitGroup.visible || !weatherData || !weatherData.length) return;
    /* Every way this layer can come up empty used to look identical from the
       outside -- an unselected AHU, an empty window and a payload with no
       mixed-air channels all just drew nothing.  Name the case instead. */
    if (!_saAhuId) {
      _saSetStatus('Mix / Coil: choose an AHU above \u2014 MA comes from '
                   + 'telemetry, not weather', '#f59e0b');
      return;
    }
    var measured = _saMeasured;
    if (!measured || !measured.length) {
      _saSetStatus('Mix / Coil: no telemetry samples in this window', '#f59e0b');
      return;
    }

    var violet = [0.545, 0.361, 0.965];   /* #8b5cf6 -- the mixing pill */
    var blue   = [0.231, 0.510, 0.965];   /* #3b82f6 -- the coil pill   */
    var amber  = [0.961, 0.620, 0.043];   /* #f59e0b -- MA on the 2D chart */
    var v = [], c = [], mv = [], mc = [], n = 0;
    measured.forEach(function(s){
      if (!s || s.ma_t == null || s.ma_w == null) return;
      if (s.oa_t == null || s.sa_t == null) return;
      var dim = (s.ma_basis === 'damper') ? 0.55 : 1.0;
      var y   = _tsToY(s.ts);
      var oaX = t2sx(s.oa_t), oaZ = w2sz(s.oa_w);
      var maX = t2sx(s.ma_t), maZ = w2sz(s.ma_w);
      var saX = t2sx(s.sa_t), saZ = w2sz(s.sa_w);
      v.push(oaX, y, oaZ,  maX, y, maZ);
      c.push(violet[0]*dim, violet[1]*dim, violet[2]*dim,
             violet[0]*dim, violet[1]*dim, violet[2]*dim);
      v.push(maX, y, maZ,  saX, y, saZ);
      c.push(blue[0]*dim, blue[1]*dim, blue[2]*dim,
             blue[0]*dim, blue[1]*dim, blue[2]*dim);
      mv.push(maX, y, maZ);
      mc.push(amber[0]*dim, amber[1]*dim, amber[2]*dim);
      n++;
    });
    if (!n) {
      /* Samples arrived but none carry ma_*: either this unit has no MAT and
         no damper feedback mapped, or the backend predates the mixed-air
         fields and was not restarted. */
      _saSetStatus('Mix / Coil: ' + measured.length + ' samples, none carry '
                   + 'mixed air (no MAT or damper mapped, or backend not '
                   + 'restarted)', '#f59e0b');
      return;
    }
    var bases = {};
    measured.forEach(function(s){ if (s && s.ma_basis) bases[s.ma_basis] = 1; });
    _saSetStatus('Mix / Coil: ' + n + ' hooks, basis '
                 + Object.keys(bases).join(' + '), '#8b5cf6');
    var segGeo = new THREE.BufferGeometry();
    segGeo.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
    segGeo.setAttribute('color',    new THREE.Float32BufferAttribute(c, 3));
    maSplitGroup.add(new THREE.LineSegments(segGeo, new THREE.LineBasicMaterial({
      vertexColors:true, transparent:true, opacity:.6, depthWrite:false
    })));
    var dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(mv, 3));
    dotGeo.setAttribute('color',    new THREE.Float32BufferAttribute(mc, 3));
    maSplitGroup.add(new THREE.Points(dotGeo, new THREE.PointsMaterial({
      size:2.2, vertexColors:true, transparent:true, opacity:.9,
      sizeAttenuation:true, depthWrite:false
    })));
  }

  function _buildSaPathGeometry(){
    var THREE = window.THREE;
    if (!saPathGroup || !weatherData || !weatherData.length) return;
    while (saPathGroup.children.length) saPathGroup.remove(saPathGroup.children[0]);

    var mode = _saSourceMode, ribbon = _saRibbonOn, measured = _saMeasured;
    /* Amber #f59e0b (modeled), Cyan #22d3ee (measured) */
    var amber = [0.961, 0.620, 0.043];
    var cyan  = [0.133, 0.827, 0.933];


    /* --- Modeled path (amber) ---------------------------------
       Apples-to-apples ribbon (2026-02): when measured telemetry is
       available, build the modeled path on the SAME timestamps as the
       measured samples AND use the AHU's own OA sensor (oa_t/oa_rh)
       as the band input.  That removes microclimate / sensor-calibration
       drift between Open-Meteo and the AHU's OA from the ribbon, so the
       residual gap is pure controller error.

       Fallback (Modeled-only mode, or Both mode before measured data
       arrives): iterate weatherData and use Open-Meteo OA -- the wider
       trajectory is still useful for design review even though it can't
       be ribboned. */
    var modeledPts = null;
    if (mode === 'modeled' || mode === 'both') {
      modeledPts = [];
      var mV = [], mC = [];
      var useMeasuredOa = (mode !== 'modeled' && measured && measured.length);
      if (useMeasuredOa) {
        measured.forEach(function(s){
          /* Synthesise a "p-shaped" object for _bandInputFor.  _saReset
             is the same band model; feeding it the AHU's OA -> apples-
             to-apples comparison against this same sample's measured SA. */
          var bi = _bandInputFor({t:s.oa_t, rh:s.oa_rh, w:s.oa_w});
          var sa = _saReset(bi.T, bi.RH, bi.W);
          var x = t2sx(sa.t), y = _tsToY(s.ts), z = w2sz(sa.w);
          mV.push(x, y, z);
          mC.push(amber[0], amber[1], amber[2]);
          modeledPts.push({x:x, y:y, z:z, ts:s.ts});
        });
      } else {
        weatherData.forEach(function(p){
          var bi = _bandInputFor(p);
          var sa = _saReset(bi.T, bi.RH, bi.W);
          var x = t2sx(sa.t), y = frac2sy(p.frac), z = w2sz(sa.w);
          mV.push(x, y, z);
          mC.push(amber[0], amber[1], amber[2]);
          modeledPts.push({x:x, y:y, z:z, ts:new Date(p.ts).getTime()/1000});
        });
      }
      var pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.Float32BufferAttribute(mV, 3));
      pGeo.setAttribute('color',    new THREE.Float32BufferAttribute(mC, 3));
      saPathGroup.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
        size:2.4, vertexColors:true, transparent:true, opacity:.9,
        sizeAttenuation:true, depthWrite:false
      })));
      var lGeo = new THREE.BufferGeometry();
      lGeo.setAttribute('position', new THREE.Float32BufferAttribute(mV, 3));
      lGeo.setAttribute('color',    new THREE.Float32BufferAttribute(mC, 3));
      saPathGroup.add(new THREE.Line(lGeo, new THREE.LineBasicMaterial({
        vertexColors:true, transparent:true, opacity:.85
      })));
    }

    /* --- Measured path (cyan) ---------------------------------
       Only renders when we actually got telemetry back from the
       backend AND the AHU selection is non-empty. */
    var measuredPts = null;
    if ((mode === 'measured' || mode === 'both') && measured && measured.length) {
      measuredPts = [];
      var sV = [], sC = [];
      measured.forEach(function(s){
        var x = t2sx(s.sa_t), y = _tsToY(s.ts), z = w2sz(s.sa_w);
        sV.push(x, y, z);
        sC.push(cyan[0], cyan[1], cyan[2]);
        measuredPts.push({x:x, y:y, z:z, ts:s.ts});
      });
      var pGeo2 = new THREE.BufferGeometry();
      pGeo2.setAttribute('position', new THREE.Float32BufferAttribute(sV, 3));
      pGeo2.setAttribute('color',    new THREE.Float32BufferAttribute(sC, 3));
      saPathGroup.add(new THREE.Points(pGeo2, new THREE.PointsMaterial({
        size:2.4, vertexColors:true, transparent:true, opacity:.9,
        sizeAttenuation:true, depthWrite:false
      })));
      var lGeo2 = new THREE.BufferGeometry();
      lGeo2.setAttribute('position', new THREE.Float32BufferAttribute(sV, 3));
      lGeo2.setAttribute('color',    new THREE.Float32BufferAttribute(sC, 3));
      saPathGroup.add(new THREE.Line(lGeo2, new THREE.LineBasicMaterial({
        vertexColors:true, transparent:true, opacity:.85
      })));
    }

    /* --- Drift ribbon (Both + sub-toggle) ---------------------
       For each weatherData timestamp, find the nearest measured
       sample (within 30 min) and emit a triangle strip connecting
       (modeled) to (measured) at the same Y as the modeled point.
       Translucent fade between amber and cyan visualises drift. */
    if (mode === 'both' && ribbon && modeledPts && measuredPts && measuredPts.length) {
      /* Pre-sort measured by ts for a linear-merge walk. */
      var mSorted = measuredPts.slice().sort(function(a,b){return a.ts - b.ts;});
      var mIdx = 0;
      var rV = [], rC = [];
      for (var i = 0; i < modeledPts.length - 1; i++) {
        var a0 = modeledPts[i], a1 = modeledPts[i+1];
        /* advance mIdx to bracket a0.ts */
        while (mIdx < mSorted.length - 1 && mSorted[mIdx+1].ts <= a0.ts) mIdx++;
        var b0 = mSorted[mIdx];
        if (!b0 || Math.abs(b0.ts - a0.ts) > 1800) continue;
        var b1 = mSorted[Math.min(mIdx+1, mSorted.length-1)];
        if (!b1 || Math.abs(b1.ts - a1.ts) > 1800) b1 = b0;
        /* Quad (a0,a1,b1) + (a0,b1,b0) — colors fade amber→cyan */
        rV.push(a0.x,a0.y,a0.z,  a1.x,a1.y,a1.z,  b1.x,b1.y,b1.z);
        rV.push(a0.x,a0.y,a0.z,  b1.x,b1.y,b1.z,  b0.x,b0.y,b0.z);
        rC.push(amber[0],amber[1],amber[2],  amber[0],amber[1],amber[2],  cyan[0],cyan[1],cyan[2]);
        rC.push(amber[0],amber[1],amber[2],  cyan[0],cyan[1],cyan[2],  cyan[0],cyan[1],cyan[2]);
      }
      if (rV.length) {
        var rGeo = new THREE.BufferGeometry();
        rGeo.setAttribute('position', new THREE.Float32BufferAttribute(rV, 3));
        rGeo.setAttribute('color',    new THREE.Float32BufferAttribute(rC, 3));
        saPathGroup.add(new THREE.Mesh(rGeo, new THREE.MeshBasicMaterial({
          vertexColors:true, transparent:true, opacity:.18,
          side:THREE.DoubleSide, depthWrite:false
        })));
      }
    }
  }

  function buildWeatherVis(locName,fromD,toD){
    var THREE=window.THREE;
    while(pathGroup.children.length)pathGroup.remove(pathGroup.children[0]);
    while(projGroup.children.length)projGroup.remove(projGroup.children[0]);
    if(saDropGroup) while(saDropGroup.children.length)saDropGroup.remove(saDropGroup.children[0]);
    if(saPathGroup) while(saPathGroup.children.length)saPathGroup.remove(saPathGroup.children[0]);
    if(maSplitGroup) while(maSplitGroup.children.length)maSplitGroup.remove(maSplitGroup.children[0]);
    timeLabels.forEach(function(s){scene.remove(s);});timeLabels=[];
    if(!weatherData.length)return;
    /* Stash the args so the RH-band slider listener can rebuild the
       scatter (which re-classifies in-band vs out-of-band) without a
       full weather refetch. */
    _lastWeatherCtx = { locName: locName, fromD: fromD, toD: toD };

    $('#p3-loc').textContent=locName+' ('+fromD+' \u2192 '+toD+')';
    var tMin=Infinity,tMax=-Infinity,rhMin=Infinity,rhMax=-Infinity;
    weatherData.forEach(function(p){if(p.t<tMin)tMin=p.t;if(p.t>tMax)tMax=p.t;if(p.rh<rhMin)rhMin=p.rh;if(p.rh>rhMax)rhMax=p.rh;});
    $('#p3-st-pts').textContent=weatherData.length;
    $('#p3-st-t').textContent=tMin.toFixed(1)+'\u2192'+tMax.toFixed(1)+'\u00b0C';
    $('#p3-st-rh').textContent=rhMin.toFixed(0)+'\u2192'+rhMax.toFixed(0)+'%';
    $('#p3-st-per').textContent=fromD+'\u2192'+toD;
    $('#p3-stats').style.display='block';

    /* Build the chronological position arrays + per-sample in-band flag.
       The line geometry uses the FULL chronological pV so the path
       remains continuous; only the scatter Points are split.  The
       in-band predicate optionally honours the slab's T-clip when
       `_rhBandTight` is on, so the 1.6× highlight tracks exactly
       what the magenta volume covers. */
    var pV=[],pC=[],prV=[],prC=[],inFlag=[];
    var rbActive = rhBandGroup && rhBandGroup.visible;
    var rbLo = _rhBandRange.lo, rbHi = _rhBandRange.hi;
    var rbTight = !!_rhBandTight;
    var tcLo = RH_BAND_T_CLIP_LO, tcHi = RH_BAND_T_CLIP_HI;
    weatherData.forEach(function(p){
      var x=t2sx(p.t),z=w2sz(p.w),y=frac2sy(p.frac);
      pV.push(x,y,z);
      var c=t2rgb(p.t);pC.push(c[0],c[1],c[2]);
      prV.push(x,.2,z);prC.push(c[0]*.5,c[1]*.5,c[2]*.5);
      var rhMatch = rbActive && p.rh >= rbLo && p.rh <= rbHi;
      var tMatch  = !rbTight || (p.t >= tcLo && p.t <= tcHi);
      inFlag.push(rhMatch && tMatch);
    });

    /* Chronological weather-path line (unchanged contract). */
    var lnGeo=new THREE.BufferGeometry();
    lnGeo.setAttribute('position',new THREE.Float32BufferAttribute(pV,3));
    lnGeo.setAttribute('color',new THREE.Float32BufferAttribute(pC,3));
    pathGroup.add(new THREE.Line(lnGeo,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.35})));

    /* Split scatter into out-band (default size 2.2) and in-band (1.6×
       = 3.52).  When the RH band layer is hidden, every sample lands
       in the out-band bucket and the marker size is uniform — keeping
       the legacy appearance for operators who toggle RH BAND off.
       `idxOut` / `idxIn` map each split-mesh's local point index back
       to the original weatherData index so the hover tooltip can
       resolve `hits[0].index` to a sample. */
    var pV1=[],pC1=[],pV2=[],pC2=[],idxIn=[],idxOut=[];
    for (var i = 0; i < weatherData.length; i++) {
      var i3 = i * 3;
      var vx=pV[i3], vy=pV[i3+1], vz=pV[i3+2];
      var cr=pC[i3], cg=pC[i3+1], cb=pC[i3+2];
      if (inFlag[i]) { pV1.push(vx,vy,vz); pC1.push(cr,cg,cb); idxIn.push(i); }
      else           { pV2.push(vx,vy,vz); pC2.push(cr,cg,cb); idxOut.push(i); }
    }
    if (pV2.length) {
      var outGeo = new THREE.BufferGeometry();
      outGeo.setAttribute('position', new THREE.Float32BufferAttribute(pV2,3));
      outGeo.setAttribute('color',    new THREE.Float32BufferAttribute(pC2,3));
      var outPts = new THREE.Points(outGeo, new THREE.PointsMaterial({
        size:2.2, vertexColors:true, transparent:true, opacity:.85,
        sizeAttenuation:true, depthWrite:false
      }));
      outPts.userData.idxMap = idxOut;
      outPts.userData.kind   = 'wx';
      pathGroup.add(outPts);
    }
    if (pV1.length) {
      var inGeo = new THREE.BufferGeometry();
      inGeo.setAttribute('position', new THREE.Float32BufferAttribute(pV1,3));
      inGeo.setAttribute('color',    new THREE.Float32BufferAttribute(pC1,3));
      var inPts = new THREE.Points(inGeo, new THREE.PointsMaterial({
        size:3.52, vertexColors:true, transparent:true, opacity:.95,
        sizeAttenuation:true, depthWrite:false
      }));
      inPts.userData.idxMap = idxIn;
      inPts.userData.kind   = 'wx';
      pathGroup.add(inPts);
    }
    var prGeo=new THREE.BufferGeometry();prGeo.setAttribute('position',new THREE.Float32BufferAttribute(prV,3));prGeo.setAttribute('color',new THREE.Float32BufferAttribute(prC,3));
    projGroup.add(new THREE.Points(prGeo,new THREE.PointsMaterial({size:1.5,vertexColors:true,transparent:true,opacity:.4,sizeAttenuation:true,depthWrite:false})));

    /* ---------- OA→SA "Rain-on-Floor" 3D Drops -----------------------------
       For each weather sample at (T, W, time-Y):
         1. Compute the controller's chosen SA via _saReset (same model used
            by the 2D OA→SA Lines projection — single source of truth).
         2. Drop a vertical-ish line from OA at its time-Y down to SA on the
            basePlane (Y=0).  Line vertex colors fade from full at top → 30%
            at floor so it visually reads as "raindrops landing".
         3. Place an SA dot at the floor.
       Color mode (`_saDropColorMode`):
         't'    — OA temperature spectrum (blue-cold → red-hot).
         'band' — fixed B1-B10 palette (each band = same color across views).
       Hidden by default (saDropGroup.visible=false at scene init); the user
       enables it via the "OA→SA Drops" toggle in the layer panel.
       ----------------------------------------------------------------------- */
    _buildSaDropGeometry();
    /* _refreshSaPath() does the right thing for every mode:
         - Modeled: returns immediately, then rebuilds geometry.
         - Measured/Both: refetches /api/ahu/{id}/sa-timeseries for the
           new OA window, then rebuilds with the fresh sample buffer.
       Falls back to _buildSaPathGeometry() if the wiring hasn't run
       yet (defensive — shouldn't happen in normal flow). */
    if (typeof window.__psy3dRefreshSaPath === 'function') {
      window.__psy3dRefreshSaPath(true);
    } else {
      _buildSaPathGeometry();
    }

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
      ctx.fillText(_t('no_weather_data','No weather data \u2014 click FETCH WEATHER DATA to load'),vw/2,vh/2);
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
      // === Compute the 5 cumulative curves ===
      // Apples-to-apples OA-damper assumption: every strategy is integrated
      // against the SAME band-derived OA damper schedule.  This mirrors
      // the Monthly x Sites chart -- without it, B1-B10 silently inherits
      // a 70-80% damper-modulation advantage no other strategy gets,
      // making it look ~3x better than reality.  See dampSeq below.
      var cumHeat=[],cumCool=[],cH=0,cC=0;
      var cumB=[],cBe=0;
      // Per-point band id ('B1'..'B10') so we can later draw transition
      // tick-markers along the green B1-B10 cumulative curve.
      var bandSeq=[];
      // Per-point band-derived damper fraction (0..1) cached so the
      // Dyn-Rst and Opt-SA loops further down apply the same schedule
      // without re-running classifyBand.  This is the load-bearing
      // line that makes the 5-curve comparison fair.
      var dampSeq=[];
      // Per-point dh (h_oa - h_sa). Captured here so the shading pass below
      // can color each segment by enthalpy polarity (matches the curves) --
      // not by temperature polarity, which can disagree when SA is humid
      // (e.g. 13 deg C / 95 % RH -> h_sa is high -> warm-but-dry OA still has
      //  h_oa < h_sa and is therefore HEATING, not cooling).
      var dhSeq=[];
      var tMin=Infinity,tMax=-Infinity;
      for(var i=0;i<n;i++){
        var p=weatherData[i];
        if(p.t<tMin)tMin=p.t;if(p.t>tMax)tMax=p.t;
        var h_oa=enthalpy(p.t,p.w);
        var oa_rh=p.rh!=null?p.rh:50;
        var b=classifyBand(p.t,oa_rh);
        bandSeq.push(b.id);
        var damp = b.oa_damper/100;
        dampSeq.push(damp);
        var dh=h_oa-h_sa; // + needs cooling, - needs heating
        // Heating/Cooling/Total now scaled by the band's damper -- matches
        // Monthly x Sites, removes the 100%-OA bias for these curves.
        var dh_d = damp * dh;
        dhSeq.push(dh_d);
        if(dh_d>0)cC+=dh_d; else cH+=Math.abs(dh_d);
        cumHeat.push(cH);cumCool.push(cC);
        var W_sa_b=getW(b.sa_t,b.sa_rh);
        var h_sa_b=enthalpy(b.sa_t,W_sa_b);
        cBe+=Math.abs(damp*(h_oa-h_sa_b));
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
      // Build cumulative |h_oa - clamp(h_oa, optMin, optMax)| scaled by
      // the SAME band-derived damper schedule the other curves use,
      // so all 5 strategies are benchmarked under identical OA modulation.
      var cumOpt=[], cOpt=0;
      for(var oi=0;oi<n;oi++){
        var hSaOpt = Math.max(ttOptMin, Math.min(ttOptMax, hOaArr[oi]));
        cOpt += Math.abs(dampSeq[oi] * (hOaArr[oi] - hSaOpt));
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
        cDyn += Math.abs(dampSeq[di] * (hOaArr[di] - hSaDyn));
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
      ctx.fillText(_t('cumulative_energy_time','CUMULATIVE ENERGY \u00d7 TIME  +  OA TRACKING'),pad.left,24);
      ctx.fillStyle=P.oaLine;ctx.font='10px monospace';
      ctx.save();ctx.translate(15,pad.top+ph/2);ctx.rotate(-Math.PI/2);ctx.textAlign='center';
      ctx.fillText(_t('oa_temp_axis','OA Temperature (\u00b0C)'),0,0);ctx.restore();
      ctx.fillStyle=P.total;
      ctx.save();ctx.translate(vw-12,pad.top+ph/2);ctx.rotate(Math.PI/2);ctx.textAlign='center';
      ctx.fillText(_t('cum_dh_axis','Cumulative \u0394h (kJ/kg)'),0,0);ctx.restore();
      ctx.fillStyle=P.textMuted;ctx.textAlign='center';ctx.fillText(_t('time_season_axis','Time (Season)'),pad.left+pw/2,vh-12);

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
      ctx.fillStyle=P.oaLine;ctx.fillText(_t('oa_temp_legend','OA temp'),lgX+22,lgY+3);lgY+=14;
      legendItem(P.heat,_t('heating','Heating'),cH);
      legendItem(P.cool,_t('cooling','Cooling'),cC);
      legendItem(P.total,_t('fixed_sa_band_damper','Fixed-SA + band damper')+' \u26A0',cT,'',[6,4]);
      // Dynamic Reset (ASHRAE G36 estimate) \u2014 SA tracks 24h trailing mean
      // of OA enthalpy, modelling Trim & Respond aggregate behaviour.
      var dynPctVsTotal = cT>0 ? Math.max(0,Math.round((1-cDyn/cT)*100)) : 0;
      legendItem(P.dynRst,_t('dyn_reset','Dyn-Rst')+' \u26A0',cDyn, dynPctVsTotal>0?'  -'+dynPctVsTotal+'% \u2020':' \u2020');
      // Optimal-SA reference \u2014 envelope-clamped thermodynamic floor.
      // Suffix shows the active envelope so the user knows which bounds
      // produced this curve (live-driven by the Monthly \u00d7 Sites toolbar
      // sliders).  Suffixed "*" \u2192 footnoted as "theoretical only".
      var optSuffix = '  ('+_optInfo.optMinH.toFixed(0)+'\u2013'+_optInfo.optMaxH.toFixed(0)+' kJ/kg env) *';
      legendItem(P.optSa,_t('opt_sa','Opt-SA'),_optInfo.total,optSuffix,[2,3]);
      var savePct=cT>0?Math.max(0,Math.round((1-cBe/cT)*100)):0;
      if(_p3ShowBandStrategy){
        legendItem(P.band,_t('band_b1_b10','B1-B10'),cBe,savePct>0?'  -'+savePct+'%':'');
      }
      // Footnotes inside the boxed legend:
      //   *  Opt-SA = theoretical floor (impossible without foresight)
      //   \u2020 Dyn-Rst = ASHRAE G36 estimate (24h trailing-mean SA model)
      //   \u26A0 Total / Dyn-Rst lack humidity (latent) control \u2014 NOT for deployment.
      ctx.fillStyle=P.textMuted; ctx.font='7px monospace'; ctx.textAlign='left';
      ctx.fillText('* clamp(h_oa, env) floor   \u2020 G36 estimate', lgX, lgY+2);
      lgY += 10;
      // Amber chip drawing the same NO-LATENT warning the Monthly \u00d7 Sites
      // chart uses, sized to fit inside the boxed legend.
      var warnTxt = '\u26A0  '+_t('no_latent_short','NO latent (RH) control -- not for deployment');
      ctx.font = 'bold 8px monospace';
      var warnW = ctx.measureText(warnTxt).width + 14;
      var warnH = 14;
      ctx.fillStyle = '#fbbf24';
      _roundRect(ctx, lgX-2, lgY-1, warnW, warnH, 3); ctx.fill();
      ctx.strokeStyle = '#b45309'; ctx.lineWidth = 0.8;
      _roundRect(ctx, lgX-2, lgY-1, warnW, warnH, 3); ctx.stroke();
      ctx.fillStyle = '#1c1917';
      ctx.fillText(warnTxt, lgX+5, lgY+9);

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
      ctx.fillText(_t('humidity_time_scatter','HUMIDITY \u00d7 TIME (scatter)'),pad.left,24);
      ctx.fillStyle=P.textMuted;ctx.font='10px monospace';
      ctx.save();ctx.translate(15,pad.top+ph/2);ctx.rotate(-Math.PI/2);ctx.textAlign='center';
      ctx.fillText(_t('humidity_ratio_axis','Humidity ratio (g/kg)'),0,0);ctx.restore();
      ctx.textAlign='center';ctx.fillText(_t('time_season_axis','Time (Season)'),pad.left+pw/2,vh-12);

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
    // Preset site list -- kept in sync with the #p3-loc-presets buttons
    // and the backend SAVED_LOCATIONS starter list (11 cities).  Single
    // source of truth across the dashboard strip, the 3D WX dropdown,
    // and this Monthly x Sites comparison chart.
    var presets=[
      {code:'ULN', lat: 47.92, lon: 106.92, name:'Ulaanbaatar', source:'preset'},
      {code:'NYC', lat: 40.71, lon: -74.01, name:'New York',    source:'preset'},
      {code:'LON', lat: 51.51, lon:  -0.13, name:'London',      source:'preset'},
      {code:'BER', lat: 52.52, lon:  13.40, name:'Berlin',      source:'preset'},
      {code:'YVR', lat: 49.28, lon:-123.12, name:'Vancouver',   source:'preset'},
      {code:'TYO', lat: 35.68, lon: 139.69, name:'Tokyo',       source:'preset'},
      {code:'PEK', lat: 39.91, lon: 116.40, name:'Beijing',     source:'preset'},
      {code:'TPE', lat: 25.03, lon: 121.57, name:'Taipei',      source:'preset'},
      {code:'HKG', lat: 22.32, lon: 114.17, name:'Hong Kong',   source:'preset'},
      {code:'SIN', lat:  1.35, lon: 103.82, name:'Singapore',   source:'preset'},
      {code:'SYD', lat:-33.87, lon: 151.21, name:'Sydney',      source:'preset'}
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
          return fetch(__psy3d_archiveUrl(s.lat, s.lon, fromD, toD))
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

  /* Compute aggregate metrics across the currently-visible Monthly x Sites
     panels for use by the A/B/C/$ legend modes.  Returns an object with
     totals per strategy { b: Fixed-SA, d: Dyn-Reset, band: B1-B10,
     bd: B1-B10+Dyn, opt: Opt-SA }, expressed in:
       energy   (kJ/kg, sum of monthly arrays)
       cool/heat split (kJ/kg)
       sens/lat split  (kJ/kg)
       latentMet hours / humidHours
     Plus dollar conversions when costMode is on.  ALL inputs are user-
     editable so the audience can plug their own numbers; defaults are
     transparent and surface in the chart subtitle.                       */
  function _aggregateMs(keys){
    var agg = {
      b:  {energy:0, cool:0, heat:0, sens:0, lat:0, latMet:0},
      d:  {energy:0, cool:0, heat:0, sens:0, lat:0, latMet:0},
      band:{energy:0, cool:0, heat:0, sens:0, lat:0, latMet:0},
      bd: {energy:0, cool:0, heat:0, sens:0, lat:0, latMet:0},
      opt:{energy:0, cool:0, heat:0, sens:0, lat:0, latMet:0},
      humidHours: 0
    };
    keys.forEach(function(code){
      var d = _monthlyCache[code];
      if (!d || !d.base) return;
      agg.b.energy   += d.baseTotal||0;
      agg.d.energy   += d.dynTotal||0;
      agg.band.energy+= d.bandTotal||0;
      agg.bd.energy  += d.bandDynTotal||0;
      agg.opt.energy += d.optTotal||0;
      ['b','d','band','bd','opt'].forEach(function(k){
        agg[k].cool   += (d.cool   && d.cool[k])   || 0;
        agg[k].heat   += (d.heat   && d.heat[k])   || 0;
        agg[k].sens   += (d.sens   && d.sens[k])   || 0;
        agg[k].lat    += (d.lat    && d.lat[k])    || 0;
        agg[k].latMet += (d.latMet && d.latMet[k]) || 0;
      });
      agg.humidHours += d.humidHours || 0;
    });
    return agg;
  }

  /* Convert a strategy's (cool_kJperKg, heat_kJperKg) pair into annual
     electric/fuel cost given user-set airflow + utility rate + COP.
     mass_flow [kg/h] = airflow [m3/h] * 1.2 [kg/m3].
     Each cumulative kJ/kg already integrates over all hourly samples;
     multiply by mass_flow once to get total kJ.
     Total kWh = total_kJ / 3600.  Apply COP (cooling) or 1/eff (heating).*/
  function _strategyDollars(coolKjPerKg, heatKjPerKg){
    var massPerH = _costAirM3h * 1.2;   // kg/h
    var coolKwh  = (coolKjPerKg * massPerH / 3600) / _costCopCool;
    var heatKwh  = (heatKjPerKg * massPerH / 3600) / _costEffHeat;
    return (coolKwh + heatKwh) * _costRate;
  }

  function renderMonthlySitesChart(ctx,vw,vh){
    _monthlyPanelRects = {};
    // Reset OA hover hitboxes so stale hits from the previous render
    // can't poison tooltips after the user toggles strategies / scrolls.
    _msOaHits.length = 0;
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
      // Per-strategy cooling vs heating split (kJ/kg, damper-scaled).
      // Needed for the dollar model: cooling and heating use different
      // efficiencies (cooling COP ~3.5 vs heating eff ~0.95 for gas).
      // Without this split, "$" mode would average them and over- or
      // under-state cost depending on climate.
      var cool_b=0,heat_b=0,  cool_d=0,heat_d=0,  cool_bd=0,heat_bd=0,
          cool_bn=0,heat_bn=0,cool_o=0,heat_o=0;
      // Sensible vs latent decomposition.  Standard psychrometric split:
      //   sensible Q_s = cp_dry * (T_oa - T_sa) per kg dry air
      //   latent   Q_l = h_fg  * (W_oa - W_sa) per kg dry air
      //   total    Q_t = sensible + latent ~= Δh
      // Used by Mode B (sensible/latent stacked bars).
      var sens_b=0,lat_b=0,  sens_d=0,lat_d=0,  sens_bd=0,lat_bd=0,
          sens_bn=0,lat_bn=0,sens_o=0,lat_o=0;
      // Latent-load coverage tracker.  We define a "humid hour" as an
      // hour where OA needs active dehumidification (OA dewpoint > 12 \u00b0C,
      // which is the standard dehumid coil leaving-air target).  Each
      // strategy gets credit for handling that hour iff its SA is at a
      // lower W (drier) than OA.  Fixed-SA fixed user setting drives
      // this; Dyn-Reset has no W target so we infer SA W from h_sa_dyn
      // assuming the AHU cools to saturation when needed.
      var humid_hours = 0;
      var latMet_b=0, latMet_d=0, latMet_bd=0, latMet_bn=0, latMet_o=0;
      // Standardized comfort thresholds used across all strategies.
      var W_DEHUMID_TARGET = 0.0089;  // ~12 \u00b0C dewpoint, ASHRAE common target
      var H_OA_HUMID_THRESH = 50;     // kJ/kg; OA enthalpy above which dehumid is needed
      var CP_DRY = 1.006;             // kJ/(kg\u00b7K), dry-air specific heat
      var H_FG = 2501;                // kJ/kg, water latent heat at ~25 \u00b0C
      // 24-h trailing-mean of h_oa, scaled to data resolution.
      var win=Math.min(24, Math.max(2, Math.floor(n/4)));
      var rollSum=0;
      // Pre-compute h_oa (and h_oa-decomposition) once.
      var hOa=new Float64Array(n);
      var WOa=new Float64Array(n);
      for(var i=0;i<n;i++){
        var T=t[i], R=rh[i];
        if(T==null||R==null){ hOa[i]=NaN; WOa[i]=NaN; continue; }
        var W = getW(T,R);
        WOa[i] = W;
        hOa[i]=enthalpy(T, W);
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
        // ---- per-strategy energy accumulators (existing) ----
        var d_b  = damp*(h_oa - _h_sa_u);  // Fixed-SA
        var d_d  = damp*(h_oa - h_sa_dyn); // Dyn-Reset
        var d_bn = damp*(h_oa - h_sa_b);   // B1-B10
        var d_bd = damp*(h_oa - h_sa_bd);  // B1-B10 + Dyn
        var d_o  = damp*(h_oa - h_sa_opt); // Opt-SA
        base[m]    += Math.abs(d_b);
        dyn[m]     += Math.abs(d_d);
        band[m]    += Math.abs(d_bn);
        bandDyn[m] += Math.abs(d_bd);
        opt[m]     += Math.abs(d_o);
        // ---- cooling vs heating split (sign of dh determines which) ----
        // Positive dh = h_oa > h_sa = AHU is COOLING the OA stream.
        // Negative dh = h_oa < h_sa = AHU is HEATING the OA stream.
        if(d_b  > 0) cool_b  += d_b;  else heat_b  -= d_b;
        if(d_d  > 0) cool_d  += d_d;  else heat_d  -= d_d;
        if(d_bn > 0) cool_bn += d_bn; else heat_bn -= d_bn;
        if(d_bd > 0) cool_bd += d_bd; else heat_bd -= d_bd;
        if(d_o  > 0) cool_o  += d_o;  else heat_o  -= d_o;
        // ---- sensible vs latent decomposition (per-strategy SA target) ----
        // For each strategy compute the SA's W (humidity ratio), then split
        // |dh| into sensible (T diff) and latent (W diff) components.
        // Strategies without an explicit RH target (Dyn-Reset, Opt-SA)
        // are assumed to track 50 % RH at the SA temperature implied by
        // their h_sa -- a transparent assumption documented in the chart.
        var W_sa_u = getW(_saT, _saRh);                          // Fixed-SA: user-set
        var W_sa_b = getW(b.sa_t, b.sa_rh);                      // B1-B10: per-band
        // Dyn-Reset and Opt-SA: no explicit RH target -> assume 50 % RH
        // at the SA temperature implied by the strategy's h_sa.
        var T_sa_dyn = _T_from_h(h_sa_dyn, 50);
        var T_sa_bd  = _T_from_h(h_sa_bd, 50);
        var T_sa_opt = _T_from_h(h_sa_opt, 50);
        var W_sa_dyn = getW(T_sa_dyn, 50);
        var W_sa_bd  = getW(T_sa_bd , 50);
        var W_sa_opt = getW(T_sa_opt, 50);
        // Note: declared via expression (not 'function name(){}') because
        // function declarations inside for-loop blocks are not allowed
        // in strict-mode script contexts (Babel compiles to strict mode).
        var _split = function(dh_signed, T_sa, W_sa){
          var sens = damp * CP_DRY * (T - T_sa);                 // signed
          // Latent counts ONLY during dehumidification (W_oa > W_sa).
          // Real AHUs don't typically humidify (humidifier is a separate
          // device, often absent in commercial systems); when OA is drier
          // than the SA target, the coil doesn't add water -- the air
          // simply arrives drier than commanded.  Earlier abs() over-
          // counted humidification work that doesn't physically happen.
          var lat  = (WOa[i] > W_sa) ? damp * H_FG * (WOa[i] - W_sa) : 0;
          return [Math.abs(sens), lat];
        };
        var s = _split(d_b , _saT,    W_sa_u);  sens_b  += s[0]; lat_b  += s[1];
            s = _split(d_d , T_sa_dyn,W_sa_dyn);sens_d  += s[0]; lat_d  += s[1];
            s = _split(d_bn, b.sa_t,  W_sa_b ); sens_bn += s[0]; lat_bn += s[1];
            s = _split(d_bd, T_sa_bd, W_sa_bd); sens_bd += s[0]; lat_bd += s[1];
            s = _split(d_o , T_sa_opt,W_sa_opt);sens_o  += s[0]; lat_o  += s[1];
        // ---- latent-load coverage (architectural, not coincidental) ----
        // Humid hour = OA enthalpy > threshold AND OA W requires drying.
        // Credit only goes to strategies whose MECHANISM is OA-RH aware:
        // Fixed-SA, Dyn-Reset, and Opt-SA all have SA targets that don't
        // adapt to OA humidity (Fixed = constant; Dyn = h_oa trend;
        // Opt = clamp(h_oa)) -- so even if their SA happens to be humid
        // by coincidence (e.g. user picks 95 % RH Fixed-SA), they earn
        // zero credit here.  Earlier metric "W_sa <= dehumid_target"
        // gave Fixed-SA a misleading 100 % when set to 95 % RH because
        // the SA happened to be just below the target by 0.0001 kg/kg.
        // B1-B10 / B1-B10+Dyn earn credit when the classifier picks a
        // band whose SA is >= 90 % RH (the explicit dehumid bands
        // B7/B8/B10: "subcool + reheat" / "max cool + dehumid").
        if (h_oa > H_OA_HUMID_THRESH && WOa[i] > W_DEHUMID_TARGET) {
          humid_hours++;
          if (b.sa_rh >= 90) { latMet_bn++; latMet_bd++; }
        }
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
      // Decomposition + comfort metrics for the new A/B/C/$ display modes.
      d.cool   = {b:cool_b, d:cool_d, band:cool_bn, bd:cool_bd, opt:cool_o};
      d.heat   = {b:heat_b, d:heat_d, band:heat_bn, bd:heat_bd, opt:heat_o};
      d.sens   = {b:sens_b, d:sens_d, band:sens_bn, bd:sens_bd, opt:sens_o};
      d.lat    = {b:lat_b , d:lat_d , band:lat_bn , bd:lat_bd , opt:lat_o };
      d.humidHours = humid_hours;
      d.latMet = {b:latMet_b, d:latMet_d, band:latMet_bn, bd:latMet_bd, opt:latMet_o};
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
    /* Top padding clears the strategy toggle row at top:12, plus the new
       mode-selector row at top:48 (~26 px tall) and a Mode Summary banner
       drawn on canvas at ~top:84.  Total reserved height ~110 px. */
    var pLeft=18, pTop=120, pRight=10, pBottom=28;
    var cellW=(vw-pLeft-pRight-gutter*(cols-1))/cols;
    var cellH=(vh-pTop-pBottom-gutter*(rows-1))/rows;
    var months=['J','F','M','A','M','J','J','A','S','O','N','D'];

    /* Aggregate metrics needed by the Mode Summary banner (drawn next).
       Computed BEFORE the panel grid so the banner can reference per-
       strategy headline numbers; legend rendering below reuses the same
       cached object. */
    var _msAgg = _aggregateMs(keys);

    /* ===== Mode Summary banner =====
       Drawn on canvas (above the panel grid) so the active legend mode is
       impossible to miss.  Each mode prints the same headline numbers per
       strategy that show in the bottom legend, but in larger text + with
       a left-pinned "MODE: X" prefix so a glance at the chart immediately
       tells you which lens the audience is looking through.            */
    (function _drawModeBanner(){
      var bnY = 84;             // sits between mode-selector row and panel grid
      var bnH = 28;
      // Background panel (subtle so the canvas-drawn banner lives in the
      // same visual layer as the panel grid below).
      ctx.fillStyle = isLight ? 'rgba(241,245,249,.85)' : 'rgba(15,23,42,.85)';
      ctx.fillRect(pLeft, bnY, vw - pLeft - pRight, bnH);
      ctx.strokeStyle = '#7c3aed';
      ctx.lineWidth = 1;
      ctx.strokeRect(pLeft, bnY, vw - pLeft - pRight, bnH);
      // Mode label pill on the left
      var modeLbls = {
        A: _t('mode_a_full','A: COMFORT HOURS'),
        B: _t('mode_b_full','B: SENS / LAT'),
        C: _t('mode_c_full','C: TRADE-OFF'),
        '$': _t('mode_d_full','$ : COST / yr')
      };
      ctx.fillStyle = '#7c3aed';
      ctx.fillRect(pLeft, bnY, 130, bnH);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(_t('mode_label_prefix','MODE')+'   '+(modeLbls[_msMode]||_msMode), pLeft + 65, bnY + 18);
      // Per-strategy headline numbers in a single row.
      var agg = _msAgg || {b:{},d:{},band:{},bd:{},opt:{},humidHours:0};
      var strats = [
        {key:'b',    name:'Fixed-SA',                                  col:P.cFixed},
        {key:'d',    name:_t('dyn_reset','Dyn-Reset'),                 col:P.cDyn},
        {key:'band', name:_t('band_b1_b10','B1-B10'),                  col:P.cBand},
        {key:'bd',   name:_t('band_b1_b10_dyn','B1-B10+Dyn'),          col:P.cBandDyn},
        {key:'opt',  name:_t('opt_sa','Opt-SA'),                       col:P.cOpt}
      ];
      // Compute per-strategy display value based on mode.
      var disp = strats.map(function(s){
        var m = agg[s.key] || {};
        if (_msMode === 'A') {
          if (agg.humidHours <= 0) return '--';
          return Math.round((m.latMet/agg.humidHours)*100)+'% covered';
        }
        if (_msMode === 'B') {
          var tot = (m.sens||0) + (m.lat||0);
          if (tot <= 0) return '--';
          var rhAware = (s.key === 'band' || s.key === 'bd');
          var pct = Math.round((m.lat/tot)*100);
          // Trailing 'a' (adaptive) or 'i' (incidental) so the banner
          // chip doesn't lie about what the latent number means.
          return pct + '% lat ' + (rhAware ? '(a)' : '(i)');
        }
        if (_msMode === 'C') {
          var c = {b:'E= C\u2717',  d:'E\u2193 C\u2717',  band:'E\u2191 C\u2713',
                   bd:'E\u2191 C\u2713', opt:'E\u2193\u2193 C*'};
          return c[s.key] || '';
        }
        if (_msMode === '$') {
          var energyD = _strategyDollars(m.cool||0, m.heat||0);
          var uncov   = Math.max(0, agg.humidHours - (m.latMet||0));
          var totalD  = energyD + uncov * _costViolRate;
          if (totalD < 1000) return '$'+Math.round(totalD);
          if (totalD < 1e6)  return '$'+(totalD/1000).toFixed(1)+'k';
          return '$'+(totalD/1e6).toFixed(2)+'M';
        }
        return '';
      });
      // Render strategy chips evenly spread across the rest of the banner.
      // Skip the [pLeft+140..580] region because the floating Weather-Strip
      // config panel docks there and would visually overlay the chips.
      // Effective area starts past the panel; if the canvas is narrower than
      // the panel, fall back to right after the mode pill.
      var WX_PANEL_RIGHT = 580;
      var cellX0 = Math.max(pLeft + 140, WX_PANEL_RIGHT + 20);
      var cellW0 = (vw - pRight - cellX0) / strats.length;
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'left';
      for (var i=0; i<strats.length; i++){
        var cx = cellX0 + i * cellW0;
        // strategy color swatch
        ctx.fillStyle = strats[i].col;
        ctx.fillRect(cx + 4, bnY + 9, 10, 10);
        // strategy short name
        ctx.fillStyle = P.text;
        ctx.font = 'bold 9px monospace';
        ctx.fillText(strats[i].name, cx + 18, bnY + 12);
        // headline value
        ctx.fillStyle = strats[i].col;
        ctx.font = 'bold 11px monospace';
        ctx.fillText(disp[i], cx + 18, bnY + 24);
      }
    })();


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
        ? '   \u2022 '+_t('avg_oa_label','Avg OA')+': '+d.oaAnnPct.toFixed(0)+'%'
        : '';
      if(isSaved){
        // tiny SAVED tag before the name
        ctx.fillStyle='#10b981'; ctx.font='bold 8px monospace';
        ctx.fillText('\u25C6 '+_t('saved','SAVED'),x0+8,y0+15);
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
          var cp1x = p1.x + (p2.x - p0.x) / 6;
          var cp1y = p1.y + (p2.y - p0.y) / 6;
          var cp2x = p2.x - (p3.x - p1.x) / 6;
          var cp2y = p2.y - (p3.y - p1.y) / 6;
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        // dot markers + per-month numeric labels.  Labels make the value
        // unmistakable at-a-glance (no hover required) so audiences can
        // verify the band-coverage math directly without taking my word.
        ctx.font = 'bold 7px monospace'; ctx.textAlign = 'center';
        for (var oj=0; oj<12; oj++){
          ctx.fillStyle = 'rgba(251,191,36,.95)';
          ctx.beginPath(); ctx.arc(oaPts[oj].x, oaPts[oj].y, 1.8, 0, 6.283); ctx.fill();
          // Push hover hitbox so the canvas mousemove handler can find
          // this datum and pop a tooltip with month name + damper %.
          _msOaHits.push({x: oaPts[oj].x, y: oaPts[oj].y,
                          panel: code, month: oj, val: d.oaPct[oj],
                          siteName: d.site.name});
          // Static numeric label above each dot — readable from across
          // the room, no interaction required.
          var lblY = oaPts[oj].y - 5;
          // If the dot is too close to the top edge, drop the label below
          // the dot instead so it doesn't get clipped.
          if (lblY - 6 < plotY) lblY = oaPts[oj].y + 11;
          ctx.fillStyle = 'rgba(251,191,36,.95)';
          ctx.fillText(Math.round(d.oaPct[oj])+'', oaPts[oj].x, lblY);
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
        // (3) Right-side Y-axis dedicated to the OA% scale.  Mirror tick
        //     marks at 0/25/50/75/100% so audiences can read the line's
        //     value off the axis without guessing or hovering.  Drawn in
        //     amber to stay visually paired with the OA curve and not
        //     compete with the cumulative-energy left axis.
        ctx.fillStyle   = 'rgba(251,191,36,.85)';
        ctx.strokeStyle = 'rgba(251,191,36,.55)';
        ctx.lineWidth   = 0.7;
        ctx.font        = 'bold 7px monospace';
        ctx.textAlign   = 'left';
        var oaTicks = [0, 25, 50, 75, 100];
        for (var ti=0; ti<oaTicks.length; ti++){
          var pct = oaTicks[ti];
          var ty = plotY + plotH - (pct/100) * plotH;
          ctx.beginPath();
          ctx.moveTo(plotX + plotW,     ty);
          ctx.lineTo(plotX + plotW + 3, ty);
          ctx.stroke();
          ctx.fillText(pct+'%', plotX + plotW + 5, ty + 2.5);
        }
        // Axis caption under the tick column.
        ctx.fillText(_t('oa_damper','OA damper'), plotX + plotW + 5, plotY + plotH + 11);
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
       prominent amber CHIP above the bottom strip so operators don't
       interpret a low energy number as "best to deploy".  Real comfort
       requires latent control \u2014 missing in both flagged strategies.
       Rendered as a filled rounded rect with dark text so it punches
       against the dark chart background. */
    if (_msShowFixed || _msShowDyn) {
      // Translate just the caveat sentence body; the strategy-name prefix
      // stays in technical English (Fixed-SA, Dyn-Reset are jargon).
      var caveatLbls = [];
      if (_msShowFixed) caveatLbls.push('Fixed-SA');
      if (_msShowDyn)   caveatLbls.push('Dyn-Reset');
      var caveatTxt = '\u26A0  ' + caveatLbls.join(' + ') + ': ' +
        _t('no_humidity_caveat','NO humidity (latent) control -- may meet kJ/kg target while violating zone RH / comfort.  NOT RECOMMENDED FOR DEPLOYMENT.');
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'left';
      var cw = ctx.measureText(caveatTxt).width + 22;
      var ch = 22;
      var cxp = 20, cyp = klY - 30;
      // Soft drop-shadow first so the chip floats off the panel.
      ctx.fillStyle = 'rgba(0,0,0,.45)';
      _roundRect(ctx, cxp+1, cyp+2, cw, ch, 5); ctx.fill();
      // Filled amber chip (high-contrast).
      ctx.fillStyle = '#fbbf24';
      _roundRect(ctx, cxp, cyp, cw, ch, 5); ctx.fill();
      // Subtle darker amber border for definition.
      ctx.strokeStyle = '#b45309'; ctx.lineWidth = 1;
      _roundRect(ctx, cxp, cyp, cw, ch, 5); ctx.stroke();
      // Dark slate text — picked for AA contrast against #fbbf24.
      ctx.fillStyle = '#1c1917';
      ctx.fillText(caveatTxt, cxp + 11, cyp + 14);
    }
    // Context preamble: title + SA baseline + data source (the title used
    // to be a separate top header but was squeezed out by the control
    // cluster; moved here where it has room).
    ctx.fillStyle=P.text; ctx.font='bold 10px monospace'; ctx.textAlign='left';
    var titleTxt=_t('monthly_energy_sites','MONTHLY AIR-SIDE ENERGY \u00d7 SITES').toUpperCase();
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
    function _strategyKey(color, label, dash, capPct, modeSuffix){
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
      // Mode-specific suffix (A: comfort hours, B: sens/lat split, C: chip,
      // $: dollars).  Drawn in a slightly muted colour and same font so
      // the legend stays readable but the mode-specific data is clearly
      // metadata not the primary label.
      if (modeSuffix) {
        ctx.fillStyle = P.textDim || P.textMuted;
        ctx.font = '9px monospace';
        ctx.fillText(modeSuffix, klX, klY);
        klX += ctx.measureText(modeSuffix).width;
      }
      klX += 12;
    }
    // Aggregate totals across the currently-visible sites so the headline
    // metrics use the same population as the panel grid.  Uses the
    // _msAgg already computed by the Mode Summary banner above.
    var aggBase     = _msAgg.b.energy;
    var aggDyn      = _msAgg.d.energy;
    var aggBand     = _msAgg.band.energy;
    var aggBandDyn  = _msAgg.bd.energy;
    var aggOpt      = _msAgg.opt.energy;
    function _capPct(stratTotal){
      var denom = aggBase - aggOpt;
      if (denom <= 0) return null;
      return ((aggBase - stratTotal) / denom) * 100;
    }
    /* Mode-aware suffix builder.  Each mode answers a different audience
       question; chosen via the toolbar A/B/C/$ radio.  Returns the suffix
       string that gets appended to the strategy's name in the legend.   */
    function _suffixFor(stratKey){
      var m = _msAgg[stratKey];
      if (!m) return '';
      // Mode A: comfort hours met (latent coverage) ----------------------
      if (_msMode === 'A') {
        if (_msAgg.humidHours <= 0) return '  (no humid hours in dataset)';
        var pct = (m.latMet / _msAgg.humidHours) * 100;
        return '  -- '+m.latMet+'/'+_msAgg.humidHours+' humid hrs covered ('+
               pct.toFixed(0)+'%)';
      }
      // Mode B: sensible vs latent decomposition (compact text bar) ------
      if (_msMode === 'B') {
        var tot = m.sens + m.lat;
        if (tot <= 0) return '';
        var sPct = (m.sens/tot)*100, lPct = (m.lat/tot)*100;
        // Mark the latent column as adaptive vs incidental so the
        // audience can't mistake non-RH-aware strategies' thermodynamic
        // latent byproduct for designed humidity control.
        var rhAware = (stratKey === 'band' || stratKey === 'bd');
        var marker = rhAware ? 'adaptive' : 'incidental';
        return '  -- '+sPct.toFixed(0)+'% sensible / '+lPct.toFixed(0)+'% latent ('+marker+')';
      }
      // Mode C: trade-off chip (Energy / Comfort / Compliance / Failsafe)
      if (_msMode === 'C') {
        // Static facts about each strategy.  These come from the strategy
        // definitions themselves, not from the simulation -- they are
        // architectural properties.  Brutally honest: B1-B10 is the only
        // strategy that hits all 4 axes.
        var facts = {
          b:   {energy:'mid',  comfort:'no',     compliance:'no',     failsafe:'no'},
          d:   {energy:'low',  comfort:'no',     compliance:'partial',failsafe:'no'},
          band:{energy:'high', comfort:'yes',    compliance:'yes',    failsafe:'yes'},
          bd:  {energy:'high', comfort:'yes',    compliance:'yes',    failsafe:'yes'},
          opt: {energy:'min',  comfort:'theory', compliance:'no',     failsafe:'no'}
        };
        var f = facts[stratKey];
        if (!f) return '';
        var glyph = function(v){
          if (v==='yes')     return '\u2713';     // check
          if (v==='no')      return '\u2717';     // cross
          if (v==='partial') return '~';
          if (v==='theory')  return '*';
          if (v==='min')     return '\u2193\u2193';
          if (v==='low')     return '\u2193';
          if (v==='mid')     return '=';
          if (v==='high')    return '\u2191';
          return '?';
        };
        return '  [E:'+glyph(f.energy)+
               ' C:'+glyph(f.comfort)+
               ' Code:'+glyph(f.compliance)+
               ' FS:'+glyph(f.failsafe)+']';
      }
      // Mode $: total cost of ownership ---------------------------------
      if (_msMode === '$') {
        var energyD = _strategyDollars(m.cool, m.heat);
        var uncoveredHumid = Math.max(0, _msAgg.humidHours - m.latMet);
        var violD = uncoveredHumid * _costViolRate;
        var totalD = energyD + violD;
        // Format like $12,345
        var fmt = function(v){
          return '$'+Math.round(v).toLocaleString();
        };
        return '  -- E:'+fmt(energyD)+' + V:'+fmt(violD)+' = '+fmt(totalD)+'/yr';
      }
      return '';
    }
    if(_msShowFixed)   _strategyKey(P.cFixed,   _t('fixed_sa_band_damper','Fixed-SA + band damper')+' \u26A0', [5,3], _msShowOpt ? _capPct(aggBase)    : null, _suffixFor('b'));
    if(_msShowDyn)     _strategyKey(P.cDyn,     _t('dyn_reset','Dyn-Reset')+' \u26A0',              [2,3], _msShowOpt ? _capPct(aggDyn)     : null, _suffixFor('d'));
    if(_msShowBand)    _strategyKey(P.cBand,    _t('band_b1_b10','B1-B10'),                       null,  _msShowOpt ? _capPct(aggBand)    : null, _suffixFor('band'));
    if(_msShowBandDyn) _strategyKey(P.cBandDyn, _t('band_b1_b10_dyn','B1-B10 + Dyn-Reset'),       null,  _msShowOpt ? _capPct(aggBandDyn) : null, _suffixFor('bd'));
    if(_msShowOpt)     _strategyKey(P.cOpt,     _t('opt_sa_cum','Opt-SA cum'),                    [1,2], _capPct(aggOpt), _suffixFor('opt'));
    if(_msShowOA){
      // Yellow dashed line key matches the per-panel OA-damper line.
      ctx.strokeStyle='rgba(251,191,36,.95)'; ctx.lineWidth=2.2;
      ctx.setLineDash([4,2]);
      ctx.beginPath();ctx.moveTo(klX,klY-3);ctx.lineTo(klX+18,klY-3);ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle=P.text; ctx.font='bold 9px monospace';
      var oaLbl=_t('oa_intake_band_damper','OA Intake (band damper)');
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
      ctx.fillText(_t('no_weather_loaded','No weather data loaded'),vw/2,vh/2-10);
      ctx.fillStyle='rgba(148,163,184,.6)';ctx.font='bold 11px monospace';
      ctx.fillText('Click "Back to 3D" \u2192 "'+_t('fetch_weather_data')+'" to load',vw/2,vh/2+10);
    }
    if(weatherData.length>0){
      function computeSA(t,rh,w){ return _saReset(t,rh,w); }
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
          var bi=_bandInputFor(p);
          var sa=computeSA(bi.T,bi.RH,bi.W);
          if(Math.abs(sa.t-p.t)<0.5&&Math.abs(sa.w-p.w)<0.0003)return;
          var bl=bandLabel(bi.T,bi.RH);
          if(!vavClusters[bl])vavClusters[bl]={pts:[],col:bandCol(bi.T,bi.RH,.6),colSolid:bandCol(bi.T,bi.RH,.9),inCZ:0,outCZ:0};
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
          var bi=_bandInputFor(p);
          var sa=computeSA(bi.T,bi.RH,bi.W);var swg=Math.min(sa.w*1000,W_MAX);
          if(Math.abs(sa.t-p.t)<0.5&&Math.abs(swg-wg)<0.3)return;
          var bl=bandLabel(bi.T,bi.RH);
          if(!saClusters[bl])saClusters[bl]={pts:[],col:bandCol(bi.T,bi.RH,.7),colSolid:bandCol(bi.T,bi.RH,.95)};
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
          var bi=_bandInputFor(p);
          var sa=computeSA(bi.T,bi.RH,bi.W);var swg=Math.min(sa.w*1000,W_MAX);
          if(Math.abs(sa.t-p.t)<0.5&&Math.abs(swg-wg)<0.3)return;
          ctx.strokeStyle=bandCol(bi.T,bi.RH);
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

    /* Designer Mode overlay: drawn AFTER ctx.restore() so it sits above
       the clipped chart contents but draws into the same pad/tx/wy
       coordinate space.  Internally guarded by _designerMode -- no-op
       when toggle is off so the regular weather-strip view is untouched. */
    _drawDesignerOverlay(ctx, tx, wy, pad, pw, ph);

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
