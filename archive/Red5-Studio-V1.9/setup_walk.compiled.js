"use strict";

function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var _React = React,
  useState = _React.useState,
  useMemo = _React.useMemo;

/* =========================================================================
 * STEP DEFINITIONS — the 4 walk paths the user described
 * ========================================================================= */
var STEPS = [{
  key: 'psy',
  label: 'Psy Chart Setting',
  sub: 'Givoni · RH range · axis range',
  kind: 'page',
  iconColor: '#818cf8',
  accent: 'indigo'
}, {
  key: 'location',
  label: 'Location Setting',
  sub: 'City name & lat / long',
  kind: 'modal',
  iconColor: '#fbbf24',
  accent: 'amber'
}, {
  key: 'language',
  label: 'Language Setting',
  sub: 'EN · FR · ES · ZH · …',
  kind: 'modal',
  iconColor: '#34d399',
  accent: 'emerald'
}, {
  key: 'plugins',
  label: 'Plug-in Setting',
  sub: 'List · upload · modify',
  kind: 'modal',
  iconColor: '#f472b6',
  accent: 'pink'
}];

/* =========================================================================
 * ROOT APP
 * ========================================================================= */
function App() {
  /* completion + per-step config -- mockup state, never persisted */
  var _useState = useState({
      psy: false,
      location: false,
      language: false,
      plugins: false
    }),
    _useState2 = _slicedToArray(_useState, 2),
    done = _useState2[0],
    setDone = _useState2[1];
  var _useState3 = useState('hub'),
    _useState4 = _slicedToArray(_useState3, 2),
    route = _useState4[0],
    setRoute = _useState4[1]; // 'hub' | 'psy'
  var _useState5 = useState(null),
    _useState6 = _slicedToArray(_useState5, 2),
    modal = _useState6[0],
    setModal = _useState6[1]; // 'location' | 'language' | 'plugins' | null

  var _useState7 = useState({
      givoni: true,
      rhPreset: 'office',
      rhLo: 30,
      rhHi: 60,
      tLo: -15,
      tHi: 50,
      theme: 'dark',
      darkLevel: 2.0
    }),
    _useState8 = _slicedToArray(_useState7, 2),
    psyCfg = _useState8[0],
    setPsyCfg = _useState8[1];
  var _useState9 = useState({
      siteName: 'My Building',
      city: 'Toronto, ON',
      lat: 43.6532,
      lon: -79.3832
    }),
    _useState0 = _slicedToArray(_useState9, 2),
    locCfg = _useState0[0],
    setLocCfg = _useState0[1];
  var _useState1 = useState(() => {
      /* Lazy init from the same localStorage key the dashboard reads, so
       * reopening the setup walk shows the currently-active language
       * rather than always defaulting to English. */
      try {
        var v = localStorage.getItem('i18n_lang');
        var allowed = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko'];
        if (v && allowed.indexOf(v) !== -1) return {
          lang: v
        };
      } catch (e) {/* private mode -> fall through */}
      return {
        lang: 'en'
      };
    }),
    _useState10 = _slicedToArray(_useState1, 2),
    langCfg = _useState10[0],
    setLangCfg = _useState10[1];
  var _useState11 = useState({
      enabled: ['weather', 'givoni', 'sweet_spot']
    }),
    _useState12 = _slicedToArray(_useState11, 2),
    pluginCfg = _useState12[0],
    setPluginCfg = _useState12[1];
  var completeCount = Object.values(done).filter(Boolean).length;
  var finish = key => {
    setDone(d => _objectSpread(_objectSpread({}, d), {}, {
      [key]: true
    }));
    setRoute('hub');
    setModal(null);
  };

  /* full-page Psy Chart editor */
  if (route === 'psy') {
    return /*#__PURE__*/React.createElement(PsyChartSettingPage, {
      cfg: psyCfg,
      setCfg: setPsyCfg,
      onBack: () => setRoute('hub'),
      onSave: () => finish('psy')
    });
  }

  /* default: HUB screen */
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen px-6 py-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-5xl mx-auto flex items-center justify-between mb-10 fade-up"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl sm:text-3xl font-black italic uppercase tracking-tight"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-red-500"
  }, "Red5"), " ", /*#__PURE__*/React.createElement("span", {
    className: "text-white"
  }, "Studio"), /*#__PURE__*/React.createElement("span", {
    className: "text-slate-500 font-normal italic"
  }, " \xA0/\xA0 setup walk")), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500 text-xs mt-1 font-mono tracking-wide"
  }, "Configure once. Skip any step you don't need.")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pill bg-slate-800 text-slate-400"
  }, completeCount, "/4 DONE"), /*#__PURE__*/React.createElement("a", {
    href: "/dashboard.html",
    onClick: () => {
      try {
        localStorage.setItem('red5.setup.done', '1');
      } catch (e) {}
    },
    className: "text-xs text-slate-500 hover:text-slate-300 underline underline-offset-4"
  }, "Skip all \u2192"))), /*#__PURE__*/React.createElement("div", {
    className: "max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5 fade-up",
    style: {
      animationDelay: '.08s'
    }
  }, STEPS.map((s, i) => /*#__PURE__*/React.createElement(Tile, {
    key: s.key,
    step: s,
    done: done[s.key],
    index: i + 1,
    onClick: () => s.kind === 'page' ? setRoute(s.key) : setModal(s.key)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "max-w-5xl mx-auto mt-10 flex items-center justify-between fade-up",
    style: {
      animationDelay: '.18s'
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500 text-xs font-mono"
  }, completeCount === 0 && '↑ Pick a setting to start, or skip all and go straight to the dashboard.', completeCount > 0 && completeCount < 4 && "\u2191 ".concat(4 - completeCount, " step").concat(4 - completeCount === 1 ? '' : 's', " remaining (optional)."), completeCount === 4 && '✓ All steps configured.  Ready when you are.'), /*#__PURE__*/React.createElement("a", {
    href: "/dashboard.html",
    onClick: () => {
      try {
        localStorage.setItem('red5.setup.done', '1');
      } catch (e) {}
    },
    className: "px-7 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all\n                              ".concat(completeCount === 4 ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20')
  }, "Open Dashboard \u2192")), modal === 'location' && /*#__PURE__*/React.createElement(LocationModal, {
    cfg: locCfg,
    setCfg: setLocCfg,
    onClose: () => setModal(null),
    onSave: () => finish('location')
  }), modal === 'language' && /*#__PURE__*/React.createElement(LanguageModal, {
    cfg: langCfg,
    setCfg: setLangCfg,
    onClose: () => setModal(null),
    onSave: () => finish('language')
  }), modal === 'plugins' && /*#__PURE__*/React.createElement(PluginsModal, {
    cfg: pluginCfg,
    setCfg: setPluginCfg,
    onClose: () => setModal(null),
    onSave: () => finish('plugins')
  }));
}

/* =========================================================================
 * Tile (large easy-on-eyes button)
 * ========================================================================= */
function Tile(_ref) {
  var step = _ref.step,
    done = _ref.done,
    index = _ref.index,
    onClick = _ref.onClick;
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    "data-testid": "setup-tile-".concat(step.key),
    "aria-label": "Open ".concat(step.label),
    className: "tile-btn relative text-left bg-slate-900/70 border-2 border-slate-700/70\n                            rounded-2xl p-6 sm:p-7 ".concat(done ? 'done' : '')
  }, done && /*#__PURE__*/React.createElement("span", {
    className: "check",
    "data-testid": "setup-tile-".concat(step.key, "-done")
  }, "\u2713"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4 mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 rounded-xl flex items-center justify-center",
    style: {
      background: "".concat(step.iconColor, "22"),
      border: "1px solid ".concat(step.iconColor, "55")
    }
  }, /*#__PURE__*/React.createElement(TileIcon, {
    kind: step.key,
    color: step.iconColor
  })), /*#__PURE__*/React.createElement("div", {
    className: "text-3xl font-black text-slate-700"
  }, "0", index)), /*#__PURE__*/React.createElement("h3", {
    className: "text-lg sm:text-xl font-black uppercase tracking-wider mb-1",
    style: {
      color: step.iconColor
    }
  }, step.label), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-400 text-sm leading-snug"
  }, step.sub), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-slate-500"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pill bg-slate-800 text-slate-400"
  }, step.kind === 'page' ? 'Full page' : 'Popup'), done && /*#__PURE__*/React.createElement("span", {
    className: "pill bg-emerald-900/40 text-emerald-400"
  }, "Configured")));
}
function TileIcon(_ref2) {
  var kind = _ref2.kind,
    color = _ref2.color;
  /* simple inline SVGs so we keep the file self-contained */
  var stroke = {
    stroke: color,
    fill: 'none',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };
  if (kind === 'psy') return /*#__PURE__*/React.createElement("svg", _extends({
    width: "22",
    height: "22",
    viewBox: "0 0 24 24"
  }, stroke), /*#__PURE__*/React.createElement("path", {
    d: "M3 3v18h18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 17c4-1 7-6 9-9s5-3 9-2"
  }));
  if (kind === 'location') return /*#__PURE__*/React.createElement("svg", _extends({
    width: "22",
    height: "22",
    viewBox: "0 0 24 24"
  }, stroke), /*#__PURE__*/React.createElement("path", {
    d: "M12 22s-7-6.4-7-12a7 7 0 1 1 14 0c0 5.6-7 12-7 12z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "10",
    r: "2.5"
  }));
  if (kind === 'language') return /*#__PURE__*/React.createElement("svg", _extends({
    width: "22",
    height: "22",
    viewBox: "0 0 24 24"
  }, stroke), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"
  }));
  if (kind === 'plugins') return /*#__PURE__*/React.createElement("svg", _extends({
    width: "22",
    height: "22",
    viewBox: "0 0 24 24"
  }, stroke), /*#__PURE__*/React.createElement("path", {
    d: "M9 3v6M15 3v6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 9h14v6a4 4 0 0 1-4 4h-1v3M9 19v3"
  }));
  return null;
}

/* =========================================================================
 * Psy Chart Setting -- FULL PAGE, live skeleton responds to controls
 * ========================================================================= */
function PsyChartSettingPage(_ref3) {
  var cfg = _ref3.cfg,
    setCfg = _ref3.setCfg,
    onBack = _ref3.onBack,
    onSave = _ref3.onSave;
  var update = (k, v) => setCfg(c => _objectSpread(_objectSpread({}, c), {}, {
    [k]: v
  }));

  /* On mount: hydrate from the SAME localStorage key the dashboard reads
   * (`red5_sweet_spot_range`) plus the preset id (`red5_rh_preset`) so
   * the dropdown label stays consistent with the slider values across
   * reloads.  If the operator has already tuned the RH band on the
   * dashboard, the setup walk starts from those values. */
  React.useEffect(() => {
    try {
      var raw = localStorage.getItem('red5_sweet_spot_range');
      var preset = localStorage.getItem('red5_rh_preset');
      var patch = {};
      if (raw) {
        var p = JSON.parse(raw);
        if (Number.isFinite(p.lo) && Number.isFinite(p.hi) && p.lo < p.hi) {
          patch.rhLo = p.lo;
          patch.rhHi = p.hi;
        }
      }
      if (preset && RH_PRESETS.find(x => x.id === preset)) {
        patch.rhPreset = preset;
      }
      /* Theme + brightness — same keys app.js (dashboard) reads. */
      var th = localStorage.getItem('red5.theme');
      if (th === 'light' || th === 'dark') patch.theme = th;
      var dl = parseFloat(localStorage.getItem('red5.darkLevel'));
      if (Number.isFinite(dl) && dl >= 1.5 && dl <= 3.0) patch.darkLevel = dl;
      /* Temperature axis range — written by this same page's save
       * handler; load it here so reopening the setup walk shows the
       * current dashboard axis instead of always defaulting to -15..50. */
      try {
        var trRaw = localStorage.getItem('red5_temp_range');
        if (trRaw) {
          var tr = JSON.parse(trRaw);
          if (Number.isFinite(tr.min) && Number.isFinite(tr.max) && tr.min < tr.max) {
            patch.tLo = tr.min;
            patch.tHi = tr.max;
          }
        }
      } catch (e) {/* ignore */}
      if (Object.keys(patch).length) setCfg(c => _objectSpread(_objectSpread({}, c), patch));
    } catch (e) {/* ignore */}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* On save: persist the RH band to localStorage so the dashboard's
   * sweet-spot polygon picks it up on next load.  Also persist the venue
   * preset id (for future "show preset name on dashboard" features). */
  var persistAndSave = () => {
    try {
      localStorage.setItem('red5_sweet_spot_range', JSON.stringify({
        lo: cfg.rhLo,
        hi: cfg.rhHi
      }));
      if (cfg.rhPreset) {
        localStorage.setItem('red5_rh_preset', cfg.rhPreset);
      }
      /* Theme + brightness — written to the SAME keys the dashboard
       * (app.js lines 57-58 and 84-97) reads as its useState lazy
       * initialiser, so the chosen theme takes effect on next dashboard
       * load.  app.js treats darkLevel >= 3.0 as light-mode trigger. */
      if (cfg.theme === 'light' || cfg.theme === 'dark') {
        localStorage.setItem('red5.theme', cfg.theme);
      }
      if (Number.isFinite(cfg.darkLevel)) {
        localStorage.setItem('red5.darkLevel', String(cfg.darkLevel));
      }
      /* Temperature axis range — drives the dashboard's psy chart
       * X axis (`tempRange.min/max` in app.js).  We write the same
       * shape app.js reads (`{min, max}`) so its lazy useState init
       * picks it up on next load, AND dispatch a custom event so
       * any open dashboard tab updates live without a refresh. */
      if (Number.isFinite(cfg.tLo) && Number.isFinite(cfg.tHi) && cfg.tLo < cfg.tHi) {
        localStorage.setItem('red5_temp_range', JSON.stringify({
          min: cfg.tLo,
          max: cfg.tHi
        }));
        window.dispatchEvent(new CustomEvent('r5-temp-range-change', {
          detail: {
            min: cfg.tLo,
            max: cfg.tHi
          }
        }));
      }
      window.dispatchEvent(new CustomEvent('r5-rh-band-change', {
        detail: {
          lo: cfg.rhLo,
          hi: cfg.rhHi
        }
      }));
      console.info('[setup walk] psy chart saved -> RH', cfg.rhLo, '-', cfg.rhHi, '% T-axis', cfg.tLo, '..', cfg.tHi, '°C preset=', cfg.rhPreset);
    } catch (e) {
      console.warn('[setup walk] could not persist psy settings:', e);
    }
    onSave();
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between px-6 py-4 border-b border-slate-800"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    className: "text-slate-400 hover:text-white text-xs uppercase tracking-widest font-black"
  }, "\u2190 Back to setup"), /*#__PURE__*/React.createElement("h1", {
    className: "text-sm uppercase tracking-[0.3em] font-black text-indigo-400"
  }, "Psy Chart Setting"), /*#__PURE__*/React.createElement("button", {
    onClick: persistAndSave,
    className: "px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs uppercase tracking-widest font-black"
  }, "Save & return \u2713")), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 p-6 max-w-7xl mx-auto w-full"
  }, /*#__PURE__*/React.createElement(PsySkeleton, {
    cfg: cfg
  }), /*#__PURE__*/React.createElement(PsyControlPanel, {
    cfg: cfg,
    update: update,
    setCfg: setCfg
  })));
}

/* RH band presets — recognised industry standards for each venue type.
 * Sources: ASHRAE 55 (comfort), ASHRAE 170 (healthcare),
 * AAM/NPS/Smithsonian guidance (collections), CIBSE TM40 (libraries). */
var RH_PRESETS = [{
  id: 'custom',
  label: 'Custom (manual)',
  lo: null,
  hi: null,
  note: ''
}, {
  id: 'office',
  label: 'Office',
  lo: 30,
  hi: 60,
  note: 'ASHRAE 55 comfort'
}, {
  id: 'museum',
  label: 'Museum',
  lo: 40,
  hi: 55,
  note: 'AAM collection preservation'
}, {
  id: 'hotel',
  label: 'Hotel guest room',
  lo: 30,
  hi: 60,
  note: 'general occupant comfort'
}, {
  id: 'library',
  label: 'Library / Archive',
  lo: 40,
  hi: 55,
  note: 'paper & binding preservation'
}, {
  id: 'hospital',
  label: 'Hospital (general)',
  lo: 30,
  hi: 60,
  note: 'ASHRAE 170 patient areas'
}, {
  id: 'lecture',
  label: 'Lecture hall',
  lo: 30,
  hi: 60,
  note: 'high occupancy comfort'
}, {
  id: 'concert',
  label: 'Concert hall',
  lo: 40,
  hi: 55,
  note: 'instrument tuning stability'
}, {
  id: 'meeting',
  label: 'Meeting room',
  lo: 30,
  hi: 60,
  note: 'small group comfort'
}, {
  id: 'exhibition',
  label: 'Exhibition hall',
  lo: 40,
  hi: 55,
  note: 'mixed art / artifact display'
}];

/* Real psy chart — uses the SAME getW + GIVONI_COLORS + polygon math as the
 * production dashboard.  Source of truth:  js/psychrometric.js  and the
 * renderGivoniOverlay() block at app.js:1641-1722.
 * Anything you change in those files MUST be mirrored here. */
function PsySkeleton(_ref4) {
  var cfg = _ref4.cfg;
  /* Canvas + padding */
  var W = 760,
    H = 480;
  var pad = {
    left: 56,
    right: 40,
    top: 28,
    bottom: 56
  };
  var gridW = W - pad.left - pad.right;
  var gridH = H - pad.top - pad.bottom;
  var T_MIN = cfg.tLo,
    T_MAX = cfg.tHi;
  var W_MIN = 0,
    W_MAX = 0.030; // kg/kg

  /* axis scales -- match the live dashboard */
  var x = t => pad.left + (t - T_MIN) / (T_MAX - T_MIN) * gridW;
  var y = w => pad.top + (1 - (w - W_MIN) / (W_MAX - W_MIN)) * gridH;
  var _getW = typeof getW === 'function' ? getW : (t, rh) => 0;
  var safePts = arr => arr.map(p => "".concat((x(p[0]) || 0).toFixed(2), ",").concat((y(p[1]) || 0).toFixed(2))).join(' ');

  /* ---- Givoni polygons -- COPIED VERBATIM from app.js:1643-1669 ---- */
  var rh80 = [];
  for (var t = 20; t <= 25; t += 0.5) rh80.push([t, _getW(t, 80)]);
  var rh100 = [];
  for (var _t = 20; _t <= 27; _t += 0.5) rh100.push([_t, _getW(_t, 100)]);
  var rh20Line = [];
  for (var _t2 = 32; _t2 >= 20; _t2 -= 0.5) rh20Line.push([_t2, _getW(_t2, 20)]);
  var rh20_CZ = [];
  for (var _t3 = 27; _t3 >= 20; _t3 -= 0.5) rh20_CZ.push([_t3, _getW(_t3, 20)]);
  var CZ = [...rh80, [27, _getW(27, 50)], [27, _getW(27, 20)], ...rh20_CZ];
  var rhHi_top = [];
  for (var tt = 20; tt <= 27; tt += 0.5) rhHi_top.push([tt, _getW(tt, cfg.rhHi)]);
  var rhLo_bot = [];
  for (var _tt = 27; _tt >= 20; _tt -= 0.5) rhLo_bot.push([_tt, _getW(_tt, cfg.rhLo)]);
  var SWEET = [...rhHi_top, ...rhLo_bot];
  var NV = [...rh100, [32, 15.4 / 1000], [32, 6.2 / 1000], ...rh20Line];
  var Mass = [...rh80, [33, 16 / 1000], [37, _getW(37, 30)], [37, 3 / 1000], [20, _getW(20, 20)]];
  var MCV = [...rh80, [40, 16 / 1000], [44, _getW(44, 20)], [44, 3 / 1000], [20, _getW(20, 20)]];
  var EVAP = [...rh80, [25, 16 / 1000], [36, _getW(36, 30)], [39, _getW(39, 20)], [41, _getW(41, 10)], [41, 0], [27.2, 0], [20, _getW(20, 20)]];
  var winterRH80 = [];
  for (var _t4 = 18; _t4 <= 19.5; _t4 += 0.5) winterRH80.push([_t4, _getW(_t4, 80)]);
  var winterRH20 = [];
  for (var _t5 = 19.5; _t5 >= 18; _t5 -= 0.5) winterRH20.push([_t5, _getW(_t5, 20)]);
  var WINTER = [...winterRH80, ...winterRH20];

  /* RH isopleth curves for the chart grid */
  var isopleths = [20, 40, 60, 80, 100];

  /* Theme palette — drives the live preview so the dim/light controls
   * have visible feedback right on the chart.  In dim/dark mode we also
   * apply a CSS brightness filter mapped from cfg.darkLevel (1.5 .. 2.8
   * → 0.6 .. 1.4) so the user can SEE the brightness slider working. */
  var isLight = cfg.theme === 'light';
  var palette = isLight ? {
    bg: '#f8fafc',
    grid: '#cbd5e1',
    tick: '#475569',
    axis: '#1e293b',
    panelBg: 'rgba(248,250,252,0.85)',
    panelBorder: '#cbd5e1',
    pillBg: '#e2e8f0',
    pillFg: '#475569',
    metaFg: '#64748b'
  } : {
    bg: '#0b1220',
    grid: '#1e293b',
    tick: '#94a3b8',
    axis: '#cbd5e1',
    panelBg: 'rgba(15,23,42,0.6)',
    panelBorder: '#1e293b',
    pillBg: '#1e293b',
    pillFg: '#94a3b8',
    metaFg: '#64748b'
  };
  var dimFilter = isLight ? 'none' : "brightness(".concat((Math.max(1.5, Math.min(2.8, cfg.darkLevel || 2.0)) / 2.0).toFixed(2), ")");
  return /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl p-4 border transition-colors duration-300",
    style: {
      background: palette.panelBg,
      borderColor: palette.panelBorder
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pill",
    style: {
      background: palette.pillBg,
      color: palette.pillFg
    }
  }, "PSYCHROMETRIC CHART \xB7 live preview"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-mono",
    style: {
      color: palette.metaFg
    }
  }, T_MIN, "\xB0C \u2192 ", T_MAX, "\xB0C  \xB7  ", cfg.rhLo, "\u2013", cfg.rhHi, "% RH")), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 ".concat(W, " ").concat(H),
    className: "w-full h-auto transition-[filter] duration-300",
    style: {
      background: palette.bg,
      borderRadius: 8,
      filter: dimFilter
    }
  }, Array.from({
    length: 11
  }).map((_, i) => {
    var t = T_MIN + i / 10 * (T_MAX - T_MIN);
    return /*#__PURE__*/React.createElement("g", {
      key: 'vt' + i
    }, /*#__PURE__*/React.createElement("line", {
      x1: x(t),
      y1: pad.top,
      x2: x(t),
      y2: pad.top + gridH,
      stroke: palette.grid,
      strokeWidth: "0.6"
    }), /*#__PURE__*/React.createElement("text", {
      x: x(t),
      y: pad.top + gridH + 16,
      fontSize: "9.5",
      fill: palette.tick,
      textAnchor: "middle"
    }, t.toFixed(0)));
  }), Array.from({
    length: 7
  }).map((_, i) => {
    var w = W_MIN + i / 6 * (W_MAX - W_MIN);
    return /*#__PURE__*/React.createElement("g", {
      key: 'hw' + i
    }, /*#__PURE__*/React.createElement("line", {
      x1: pad.left,
      y1: y(w),
      x2: pad.left + gridW,
      y2: y(w),
      stroke: palette.grid,
      strokeWidth: "0.6"
    }), /*#__PURE__*/React.createElement("text", {
      x: pad.left - 8,
      y: y(w) + 3,
      fontSize: "9.5",
      fill: palette.tick,
      textAnchor: "end"
    }, (w * 1000).toFixed(0)));
  }), isopleths.map(rh => {
    var pts = [];
    for (var _t6 = T_MIN; _t6 <= T_MAX; _t6 += 0.5) {
      var ww = _getW(_t6, rh);
      if (ww >= W_MIN && ww <= W_MAX) pts.push([_t6, ww]);
    }
    return /*#__PURE__*/React.createElement("g", {
      key: 'iso' + rh
    }, /*#__PURE__*/React.createElement("polyline", {
      points: safePts(pts),
      fill: "none",
      stroke: rh === 100 ? '#6366f1' : '#ec489955',
      strokeWidth: "0.8",
      strokeDasharray: rh === 100 ? '' : '3,3'
    }), pts.length > 0 && /*#__PURE__*/React.createElement("text", {
      x: x(pts[Math.floor(pts.length * 0.65)][0]),
      y: y(pts[Math.floor(pts.length * 0.65)][1]) - 4,
      fontSize: "9",
      fill: "#ec489999",
      fontWeight: "700"
    }, rh, "%"));
  }), cfg.givoni && /*#__PURE__*/React.createElement("g", {
    className: "pointer-events-none",
    opacity: "0.9"
  }, /*#__PURE__*/React.createElement("line", {
    x1: x(40),
    y1: y(16 / 1000),
    x2: x(50),
    y2: y(16 / 1000),
    stroke: "#6366f1",
    strokeWidth: "1.5",
    strokeDasharray: "4,4"
  }), /*#__PURE__*/React.createElement("line", {
    x1: x(50),
    y1: y(16 / 1000),
    x2: x(50),
    y2: y(0),
    stroke: "#6366f1",
    strokeWidth: "1.5",
    strokeDasharray: "4,4"
  }), /*#__PURE__*/React.createElement("line", {
    x1: x(41),
    y1: y(0),
    x2: x(50),
    y2: y(0),
    stroke: "#6366f1",
    strokeWidth: "1.5",
    strokeDasharray: "4,4"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: safePts(MCV),
    fill: "#ec4899",
    fillOpacity: "0.05",
    stroke: "#ec4899",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: safePts(Mass),
    fill: "#8b5cf6",
    fillOpacity: "0.05",
    stroke: "#8b5cf6",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: safePts(EVAP),
    fill: "#06b6d4",
    fillOpacity: "0.08",
    stroke: "#06b6d4",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: safePts(NV),
    fill: "#f59e0b",
    fillOpacity: "0.05",
    stroke: "#f59e0b",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: safePts(CZ),
    fill: "#10b981",
    fillOpacity: "0.15",
    stroke: "#10b981",
    strokeWidth: "1.2"
  }), /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("clipPath", {
    id: "cz-clip-walk",
    clipPathUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("polygon", {
    points: safePts(CZ)
  }))), /*#__PURE__*/React.createElement("polygon", {
    points: safePts(SWEET),
    clipPath: "url(#cz-clip-walk)",
    fill: "#059669",
    fillOpacity: "0.32",
    stroke: "#047857",
    strokeWidth: "0.8",
    strokeDasharray: "3,2"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: safePts(WINTER),
    fill: "#3b82f6",
    fillOpacity: "0.15",
    stroke: "none"
  }), /*#__PURE__*/React.createElement("line", {
    x1: x(19),
    y1: pad.top + 18,
    x2: x(19),
    y2: pad.top + gridH,
    stroke: "#3b82f6",
    strokeWidth: "2",
    strokeDasharray: "6,4",
    opacity: "0.8"
  }), /*#__PURE__*/React.createElement("text", {
    x: x(50) - 10,
    y: y(8 / 1000),
    fill: "#6366f1",
    fontSize: "10",
    fontWeight: "900",
    textAnchor: "middle",
    transform: "rotate(-90, ".concat(x(50) - 10, ", ").concat(y(8 / 1000), ")"),
    letterSpacing: "2"
  }, "MECHANICAL COOLING"), /*#__PURE__*/React.createElement("text", {
    x: x(44) - 2,
    y: y(8 / 1000),
    fill: "#ec4899",
    fontSize: "9",
    fontWeight: "900",
    textAnchor: "middle",
    transform: "rotate(-90, ".concat(x(44) - 2, ", ").concat(y(8 / 1000), ")"),
    letterSpacing: "1.5"
  }, "MASS COOLING"), /*#__PURE__*/React.createElement("text", {
    x: x(37) - 10,
    y: y(8 / 1000),
    fill: "#8b5cf6",
    fontSize: "9",
    fontWeight: "900",
    textAnchor: "middle",
    transform: "rotate(-90, ".concat(x(37) - 10, ", ").concat(y(8 / 1000), ")"),
    letterSpacing: "1.5"
  }, "MASS COOLING"), /*#__PURE__*/React.createElement("text", {
    x: x(34),
    y: y(0.5 / 1000) - 8,
    fill: "#06b6d4",
    fontSize: "9",
    fontWeight: "900",
    textAnchor: "middle",
    letterSpacing: "2"
  }, "EVAPORATIVE"), /*#__PURE__*/React.createElement("text", {
    x: x(23.5),
    y: y(_getW(23.5, 45)),
    fill: "#10b981",
    fontSize: "11",
    fontWeight: "900",
    textAnchor: "middle",
    letterSpacing: "1.5"
  }, "COMFORT"), /*#__PURE__*/React.createElement("text", {
    x: x(18.75),
    y: y(_getW(18.75, 45)),
    fill: "#3b82f6",
    fontSize: "11",
    fontWeight: "900",
    textAnchor: "middle",
    transform: "rotate(-90, ".concat(x(18.75), ", ").concat(y(_getW(18.75, 45)), ")")
  }, "WINTER"), /*#__PURE__*/React.createElement("text", {
    x: x(23.5),
    y: y(_getW(23.5, (cfg.rhLo + cfg.rhHi) / 2)),
    fill: "#022c22",
    fontSize: "8",
    fontWeight: "900",
    textAnchor: "middle",
    style: {
      paintOrder: 'stroke',
      stroke: '#a7f3d0',
      strokeWidth: '2.5px',
      strokeLinejoin: 'round'
    },
    letterSpacing: "1.5"
  }, cfg.rhLo, "-", cfg.rhHi, "% RH")), /*#__PURE__*/React.createElement("text", {
    x: pad.left + gridW / 2,
    y: H - 12,
    fontSize: "11",
    fill: palette.axis,
    textAnchor: "middle",
    fontWeight: "800",
    letterSpacing: "2"
  }, "DRY BULB TEMP (\xB0C)"), /*#__PURE__*/React.createElement("text", {
    x: 16,
    y: pad.top + gridH / 2,
    fontSize: "11",
    fill: palette.axis,
    textAnchor: "middle",
    fontWeight: "800",
    letterSpacing: "2",
    transform: "rotate(-90 16 ".concat(pad.top + gridH / 2, ")")
  }, "HUMIDITY RATIO (g/kg)")));
}
function PsyControlPanel(_ref5) {
  var cfg = _ref5.cfg,
    update = _ref5.update,
    setCfg = _ref5.setCfg;
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    "data-testid": "psy-cfg-theme-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field-label mb-2"
  }, "Display Mode"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2 mb-3"
  }, /*#__PURE__*/React.createElement("button", {
    "data-testid": "psy-cfg-theme-dark",
    onClick: () => setCfg(c => _objectSpread(_objectSpread({}, c), {}, {
      theme: 'dark',
      darkLevel: Math.min(c.darkLevel || 2.0, 2.6)
    })),
    className: "py-2.5 rounded-lg text-xs font-black uppercase tracking-widest border transition-all\n                                ".concat(cfg.theme === 'dark' ? 'bg-slate-800 border-yellow-500/70 text-yellow-300 shadow-lg shadow-yellow-500/10' : 'bg-slate-900/30 border-slate-700 text-slate-500 hover:bg-slate-800/60')
  }, "\uD83C\uDF19  Dim / Dark"), /*#__PURE__*/React.createElement("button", {
    "data-testid": "psy-cfg-theme-light",
    onClick: () => setCfg(c => _objectSpread(_objectSpread({}, c), {}, {
      theme: 'light',
      darkLevel: 3.0
    })),
    className: "py-2.5 rounded-lg text-xs font-black uppercase tracking-widest border transition-all\n                                ".concat(cfg.theme === 'light' ? 'bg-slate-100 border-sky-500/70 text-sky-700 shadow-lg shadow-sky-500/10' : 'bg-slate-900/30 border-slate-700 text-slate-500 hover:bg-slate-800/60')
  }, "\u2600  Light")), /*#__PURE__*/React.createElement("div", {
    className: cfg.theme === 'light' ? 'opacity-40 pointer-events-none' : ''
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-[10px] uppercase tracking-widest font-bold text-slate-500"
  }, "Dim brightness"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-mono text-yellow-300 tabular-nums"
  }, Math.round((cfg.darkLevel || 2.0) * 100), "%")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    "data-testid": "psy-cfg-dark-level",
    min: "1.5",
    max: "2.8",
    step: "0.02",
    value: cfg.theme === 'light' ? 2.0 : cfg.darkLevel || 2.0,
    onChange: e => setCfg(c => _objectSpread(_objectSpread({}, c), {}, {
      darkLevel: parseFloat(e.target.value),
      theme: 'dark'
    })),
    className: "range-input w-full",
    style: {
      accentColor: '#facc15'
    }
  })), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-500 mt-2 italic"
  }, "Applied to the whole dashboard.  Dim is recommended for control rooms; Light for daytime walk-throughs.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "field-label mb-2"
  }, "Givoni Engine"), /*#__PURE__*/React.createElement("button", {
    onClick: () => update('givoni', !cfg.givoni),
    className: "w-full py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all\n                                    ".concat(cfg.givoni ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700')
  }, cfg.givoni ? 'Givoni ON' : 'Givoni OFF'), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-500 mt-2 leading-relaxed"
  }, "Overlays the 4 climate-strategy regions (Comfort, Nat Vent, Evap, Mech Cool).")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "field-label mb-2"
  }, "RH Sweet-Spot Range"), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1 block"
  }, "Venue preset"), /*#__PURE__*/React.createElement("select", {
    className: "field-input cursor-pointer",
    value: cfg.rhPreset || 'custom',
    onChange: e => {
      var p = RH_PRESETS.find(p => p.id === e.target.value);
      if (!p) return;
      if (p.id === 'custom') {
        update('rhPreset', 'custom');
      } else {
        setCfg(c => _objectSpread(_objectSpread({}, c), {}, {
          rhPreset: p.id,
          rhLo: p.lo,
          rhHi: p.hi
        }));
      }
    }
  }, RH_PRESETS.map(p => /*#__PURE__*/React.createElement("option", {
    key: p.id,
    value: p.id
  }, p.label, p.lo != null ? "  \xB7  ".concat(p.lo, "-").concat(p.hi, "% RH") : ''))), (() => {
    var p = RH_PRESETS.find(x => x.id === (cfg.rhPreset || 'custom'));
    return p && p.note ? /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] text-slate-500 mt-1.5 italic"
    }, p.note) : null;
  })()), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 mb-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-mono text-slate-400 w-10"
  }, cfg.rhLo, "%"), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "20",
    max: cfg.rhHi - 5,
    value: cfg.rhLo,
    onChange: e => setCfg(c => _objectSpread(_objectSpread({}, c), {}, {
      rhLo: +e.target.value,
      rhPreset: 'custom'
    })),
    className: "range-input flex-1"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-mono text-slate-400 w-10"
  }, cfg.rhHi, "%"), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: cfg.rhLo + 5,
    max: "90",
    value: cfg.rhHi,
    onChange: e => setCfg(c => _objectSpread(_objectSpread({}, c), {}, {
      rhHi: +e.target.value,
      rhPreset: 'custom'
    })),
    className: "range-input flex-1"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "field-label mb-2"
  }, "Temperature Axis Range"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 mb-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-mono text-slate-400 w-10"
  }, cfg.tLo, "\xB0"), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "-40",
    max: cfg.tHi - 10,
    value: cfg.tLo,
    onChange: e => update('tLo', +e.target.value),
    className: "range-input flex-1"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-mono text-slate-400 w-10"
  }, cfg.tHi, "\xB0"), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: cfg.tLo + 10,
    max: "60",
    value: cfg.tHi,
    onChange: e => update('tHi', +e.target.value),
    className: "range-input flex-1"
  })), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-500 mt-2 leading-relaxed"
  }, "Chart will be redrawn with this dry-bulb temperature window.")), /*#__PURE__*/React.createElement("div", {
    className: "border-t border-slate-800 pt-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-500 leading-relaxed"
  }, "Changes preview live in the skeleton chart on the left.  Hit", /*#__PURE__*/React.createElement("span", {
    className: "text-indigo-400 font-black"
  }, " Save & return "), "in the header when you're happy.")));
}

/* =========================================================================
 * Location Setting -- modal w/ interactive Leaflet map + reverse geocoding
 * Click anywhere on the map (or drag the marker) to set lat/lon.
 * Manual lat/lon edits re-centre the marker.  City name is auto-populated
 * via OpenStreetMap Nominatim (no key required, rate-limited to ~1 req/s).
 * ========================================================================= */

/* De-dup + sanity-check a raw saved-locations array (from server or
 * localStorage).  Drops entries missing a name or with non-finite lat/lon,
 * keeps the FIRST occurrence of each unique name.  Used by LocationModal's
 * Site-name datalist below. */
function _normalizeLocs(arr) {
  var seen = new Set();
  var out = [];
  for (var l of arr || []) {
    if (!l || typeof l.name !== 'string') continue;
    var lat = +l.lat,
      lon = +l.lon;
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    var key = l.name.trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push({
      name: key,
      lat,
      lon
    });
  }
  return out;
}
function LocationModal(_ref6) {
  var cfg = _ref6.cfg,
    setCfg = _ref6.setCfg,
    onClose = _ref6.onClose,
    onSave = _ref6.onSave;
  var mapBoxRef = React.useRef(null);
  var mapRef = React.useRef(null);
  var markerRef = React.useRef(null);
  var _React$useState = React.useState(false),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    geoBusy = _React$useState2[0],
    setGeoBusy = _React$useState2[1];

  /* ----- saved locations -- mirror what the Dashboard's Weather button shows.
   *
   * The dashboard reads them from `${API_URL}/api/weather-location`'s
   * `saved` array and mirrors that into localStorage['savedWeatherLocations']
   * on mount (see public/js/dashboard/app.js#hydrateWeatherState).  We do
   * the SAME thing here so the Setup Walk's Site-name dropdown stays
   * byte-identical with the dashboard's location list -- including when the
   * operator visits Setup Walk BEFORE ever opening the dashboard (fresh
   * device case where localStorage is empty).
   *
   * Strategy:
   *   1) Read localStorage first (instant, no flicker if already hydrated).
   *   2) Then GET /api/weather-location (canonical, cross-device source).
   *   3) Whichever is non-empty wins; server wins ties.
   *
   * Free-form typing in the input still works -- the datalist is suggestion
   * only, the input never restricts the value. */
  var _React$useState3 = React.useState(() => {
      try {
        var raw = localStorage.getItem('savedWeatherLocations');
        if (!raw) return [];
        var arr = JSON.parse(raw);
        return Array.isArray(arr) ? _normalizeLocs(arr) : [];
      } catch (e) {
        return [];
      }
    }),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    savedLocs = _React$useState4[0],
    setSavedLocs = _React$useState4[1];
  React.useEffect(() => {
    var cancelled = false;
    _asyncToGenerator(function* () {
      try {
        var r = yield fetch('/api/weather-location', {
          credentials: 'include',
          cache: 'no-store'
        });
        if (!r.ok) return;
        var j = yield r.json();
        var saved = _normalizeLocs(Array.isArray(j.saved) ? j.saved : []);
        if (cancelled) return;
        if (saved.length > 0) {
          setSavedLocs(saved);
          // Mirror to localStorage so the dashboard sees the same list
          // even if its own hydrate hasn't run yet this session.
          try {
            localStorage.setItem('savedWeatherLocations', JSON.stringify(saved));
          } catch (e) {}
        }
      } catch (e) {/* offline -> localStorage value already in state */}
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /* When the user picks a name from the datalist (or types one that
   * exactly matches a saved entry), pull its lat/lon and recentre the
   * map.  Free-form typing still works -- the name is just kept as the
   * site label.  Avoids surprising the operator who types "Pavilion B"
   * (a label they invented) and expects the map NOT to jump. */
  var onSiteNameChange = newName => {
    setCfg(c => _objectSpread(_objectSpread({}, c), {}, {
      siteName: newName
    }));
    var hit = savedLocs.find(s => s.name === newName);
    if (hit) {
      var lat = Math.round(hit.lat * 10000) / 10000;
      var lon = Math.round(hit.lon * 10000) / 10000;
      setCfg(c => _objectSpread(_objectSpread({}, c), {}, {
        siteName: newName,
        lat,
        lon,
        city: newName
      }));
      if (mapRef.current) mapRef.current.setView([lat, lon], 11);
    }
  };

  /* ----- search state ----- */
  var _React$useState5 = React.useState(''),
    _React$useState6 = _slicedToArray(_React$useState5, 2),
    searchQ = _React$useState6[0],
    setSearchQ = _React$useState6[1];
  var _React$useState7 = React.useState([]),
    _React$useState8 = _slicedToArray(_React$useState7, 2),
    searchHits = _React$useState8[0],
    setSearchHits = _React$useState8[1];
  var _React$useState9 = React.useState(false),
    _React$useState0 = _slicedToArray(_React$useState9, 2),
    searchBusy = _React$useState0[0],
    setSearchBusy = _React$useState0[1];
  var _React$useState1 = React.useState(false),
    _React$useState10 = _slicedToArray(_React$useState1, 2),
    searchOpen = _React$useState10[0],
    setSearchOpen = _React$useState10[1];
  var searchDebounceRef = React.useRef(null);

  /* Forward-geocode: query -> [{lat, lon, display_name, type, ...}] */
  var runSearch = /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator(function* (q) {
      if (!q || q.trim().length < 3) {
        setSearchHits([]);
        return;
      }
      try {
        setSearchBusy(true);
        var url = "https://nominatim.openstreetmap.org/search?format=json&limit=6&q=".concat(encodeURIComponent(q));
        var r = yield fetch(url, {
          headers: {
            'Accept': 'application/json'
          }
        });
        var j = yield r.json();
        setSearchHits(Array.isArray(j) ? j : []);
        setSearchOpen(true);
      } catch (e) {
        setSearchHits([]);
      } finally {
        setSearchBusy(false);
      }
    });
    return function runSearch(_x) {
      return _ref8.apply(this, arguments);
    };
  }();

  /* debounced search-on-type */
  React.useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => runSearch(searchQ), 400);
    return () => searchDebounceRef.current && clearTimeout(searchDebounceRef.current);
  }, [searchQ]);
  var pickSearchHit = hit => {
    var lat = Math.round(+hit.lat * 10000) / 10000;
    var lon = Math.round(+hit.lon * 10000) / 10000;
    setCfg(c => _objectSpread(_objectSpread({}, c), {}, {
      lat,
      lon,
      city: hit.display_name
    }));
    if (mapRef.current) mapRef.current.setView([lat, lon], hit.type === 'city' ? 11 : 15);
    setSearchOpen(false);
    setSearchQ('');
  };

  /* Reverse-geocode lat/lon -> city / country via Nominatim.  No API key. */
  var reverseGeocode = /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator(function* (lat, lon) {
      try {
        setGeoBusy(true);
        var url = "https://nominatim.openstreetmap.org/reverse?format=json&lat=".concat(lat, "&lon=").concat(lon, "&zoom=10");
        var r = yield fetch(url, {
          headers: {
            'Accept': 'application/json'
          }
        });
        var j = yield r.json();
        var a = j.address || {};
        var city = a.city || a.town || a.village || a.hamlet || a.county || '';
        var region = a.state || a.region || '';
        var country = a.country || '';
        var label = [city, region, country].filter(Boolean).join(', ') || j.display_name || '';
        if (label) setCfg(c => _objectSpread(_objectSpread({}, c), {}, {
          city: label
        }));
      } catch (e) {/* offline or rate-limited -> keep prior name */} finally {
        setGeoBusy(false);
      }
    });
    return function reverseGeocode(_x2, _x3) {
      return _ref9.apply(this, arguments);
    };
  }();

  /* Init Leaflet on first render of the modal */
  React.useEffect(() => {
    if (!mapBoxRef.current || mapRef.current) return;
    var map = L.map(mapBoxRef.current, {
      zoomControl: true,
      attributionControl: true
    }).setView([cfg.lat, cfg.lon], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    var marker = L.marker([cfg.lat, cfg.lon], {
      draggable: true
    }).addTo(map);
    marker.bindTooltip('Drag me or click anywhere on the map', {
      permanent: false
    });
    var applyLatLon = (lat, lon) => {
      var r = n => Math.round(n * 10000) / 10000;
      setCfg(c => _objectSpread(_objectSpread({}, c), {}, {
        lat: r(lat),
        lon: r(lon)
      }));
      reverseGeocode(r(lat), r(lon));
    };
    marker.on('dragend', () => {
      var ll = marker.getLatLng();
      applyLatLon(ll.lat, ll.lng);
    });
    map.on('click', e => {
      marker.setLatLng(e.latlng);
      applyLatLon(e.latlng.lat, e.latlng.lng);
    });
    mapRef.current = map;
    markerRef.current = marker;

    /* Leaflet renders blank if it boots inside a hidden element — kick it
       once the modal animation settles. */
    setTimeout(() => map.invalidateSize(), 250);
    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  /* Keep marker in sync when user edits lat/lon fields manually */
  React.useEffect(() => {
    if (mapRef.current && markerRef.current) {
      markerRef.current.setLatLng([cfg.lat, cfg.lon]);
      mapRef.current.panTo([cfg.lat, cfg.lon]);
    }
  }, [cfg.lat, cfg.lon]);

  /* Geolocation: silently no-op'd before -- if the browser blocked the
   * request (HTTP origin = not a secure context on field controllers, or
   * the user denied permission earlier) the button just sat there.
   * Now we surface a state (busy / err) so the operator can see WHY it
   * failed and act on it (switch to HTTPS, re-prompt, or use the map). */
  var _React$useState11 = React.useState(null),
    _React$useState12 = _slicedToArray(_React$useState11, 2),
    geoState = _React$useState12[0],
    setGeoState = _React$useState12[1]; // null | 'busy' | {err}
  var useMyLocation = () => {
    setGeoState('busy');
    // navigator.geolocation is `undefined` on HTTP origins (Chrome 50+).
    if (!navigator.geolocation) {
      setGeoState({
        err: 'Browser blocked location access — open this page via HTTPS.'
      });
      return;
    }
    navigator.geolocation.getCurrentPosition(pos => {
      var lat = Math.round(pos.coords.latitude * 10000) / 10000;
      var lon = Math.round(pos.coords.longitude * 10000) / 10000;
      setCfg(c => _objectSpread(_objectSpread({}, c), {}, {
        lat,
        lon
      }));
      if (mapRef.current) mapRef.current.setView([lat, lon], 11);
      reverseGeocode(lat, lon);
      setGeoState(null);
    }, err => {
      // err.code: 1=PERMISSION_DENIED, 2=POSITION_UNAVAILABLE, 3=TIMEOUT
      var msg = err && err.code === 1 ? 'Location permission denied — click the lock icon in the address bar and allow location.' : err && err.code === 2 ? 'Location currently unavailable — the device has no GPS / Wi-Fi fix yet.' : err && err.code === 3 ? 'Location request timed out — try again, or use the map / search bar.' : err && err.message || 'Could not read device location.';
      setGeoState({
        err: msg
      });
    }, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });
  };

  /* When user clicks "Save & return", POST the selection to the same
   * /api/weather-location endpoint the dashboard reads.  Setting BOTH
   * `active` and `default` means the weather strip on the dashboard
   * loads this location immediately on next page load (and stays pinned
   * for any future fresh sessions).  Anonymous users get a soft warning
   * back from the server (persisted:false) -- we surface that as a toast
   * so the operator knows they need to sign in to keep the pick across
   * page reloads.  We always also write to localStorage so the SAME
   * tab keeps the chosen location for the current session. */
  var _React$useState13 = React.useState(null),
    _React$useState14 = _slicedToArray(_React$useState13, 2),
    saveMsg = _React$useState14[0],
    setSaveMsg = _React$useState14[1];
  var persistAndSave = /*#__PURE__*/function () {
    var _ref0 = _asyncToGenerator(function* () {
      var loc = {
        lat: cfg.lat,
        lon: cfg.lon,
        name: cfg.siteName || cfg.city
      };
      /* Local fallback — works for anonymous users so the dashboard at
       * least sees the new lat/lon in the same browser. */
      try {
        localStorage.setItem('red5.weather_location', JSON.stringify(loc));
      } catch (e) {/* private mode -- ignore */}
      var persisted = false,
        warning = '';
      try {
        var r = yield fetch('/api/weather-location', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            active: loc,
            default: loc
          })
        });
        var j = yield r.json();
        window._lastWeatherLocationSave = j;
        persisted = !!j.persisted;
        warning = j.warning || '';
        console.info('[setup walk] /api/weather-location <-', j);
      } catch (e) {
        warning = 'Network error — saved locally only.';
        console.warn('[setup walk] could not persist location:', e);
      }
      if (persisted) {
        onSave(); // happy path: close + mark step done
      } else {
        /* Surface the warning, hold the modal open for 1.6s so the
         * operator reads it, then close.  The local copy is already
         * written, so the dashboard will still see the new location
         * in this browser session. */
        setSaveMsg(warning || 'Saved locally only — sign in to save server-side.');
        setTimeout(() => {
          setSaveMsg(null);
          onSave();
        }, 1600);
      }
    });
    return function persistAndSave() {
      return _ref0.apply(this, arguments);
    };
  }();
  return /*#__PURE__*/React.createElement(ModalShell, {
    title: "Location Setting",
    subtitle: "Click the map, drag the pin, or use your device",
    accent: "amber",
    onClose: onClose,
    onSave: persistAndSave,
    size: "max"
  }, saveMsg && /*#__PURE__*/React.createElement("div", {
    "data-testid": "loc-save-msg",
    className: "mb-3 px-4 py-2.5 rounded-lg bg-amber-900/30 border border-amber-700/50 text-amber-200 text-xs font-mono"
  }, "\u26A0  ", saveMsg), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 h-full",
    style: {
      minHeight: '56vh'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative",
    style: {
      minHeight: '56vh'
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: mapBoxRef,
    style: {
      height: '100%',
      minHeight: '56vh',
      width: '100%',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid #334155',
      background: '#0b1220'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute top-3 left-1/2 -translate-x-1/2 z-[500]",
    style: {
      width: 'min(560px, calc(100% - 110px))'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: searchQ,
    onChange: e => setSearchQ(e.target.value),
    onFocus: () => searchHits.length && setSearchOpen(true),
    placeholder: "\uD83D\uDD0E  Search by address, building, or place name\u2026",
    className: "w-full px-4 py-2.5 rounded-xl bg-slate-900/95 border border-slate-600 text-slate-100 text-sm placeholder-slate-500 shadow-2xl backdrop-blur",
    style: {
      outline: 'none'
    }
  }), searchBusy && /*#__PURE__*/React.createElement("span", {
    className: "absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 text-xs"
  }, "\u2026"), searchOpen && searchHits.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "absolute top-full left-0 right-0 mt-1 bg-slate-900/97 border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto backdrop-blur"
  }, searchHits.map((h, i) => /*#__PURE__*/React.createElement("button", {
    key: h.place_id || i,
    onClick: () => pickSearchHit(h),
    className: "w-full text-left px-4 py-2.5 hover:bg-amber-900/30 border-b border-slate-800 last:border-b-0 transition-all"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-slate-200 truncate"
  }, h.display_name), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-slate-500 uppercase tracking-widest mt-0.5"
  }, h.type || h.class, " \xB7 ", (+h.lat).toFixed(3), ", ", (+h.lon).toFixed(3))))), searchOpen && searchHits.length === 0 && searchQ.length >= 3 && !searchBusy && /*#__PURE__*/React.createElement("div", {
    className: "absolute top-full left-0 right-0 mt-1 bg-slate-900/97 border border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-400"
  }, "No results for \"", searchQ, "\".  Try a more specific term.")))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4 overflow-y-auto pr-1"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "field-label mb-1.5"
  }, "Site name (saved)", savedLocs.length > 0 && /*#__PURE__*/React.createElement("span", {
    className: "ml-2 text-amber-400/80 normal-case tracking-normal text-[10px]",
    "data-testid": "loc-saved-hint"
  }, "\u25BE ", savedLocs.length, " saved")), /*#__PURE__*/React.createElement("input", {
    className: "field-input",
    value: cfg.siteName || '',
    list: savedLocs.length > 0 ? 'red5-saved-locations' : undefined,
    "data-testid": "loc-site-name-input",
    placeholder: savedLocs.length > 0 ? 'Pick a saved location, or type a new one…' : 'e.g. HQ Tower, North Wing, Pavilion B…',
    onChange: e => onSiteNameChange(e.target.value)
  }), savedLocs.length > 0 && /*#__PURE__*/React.createElement("datalist", {
    id: "red5-saved-locations"
  }, savedLocs.map(loc => /*#__PURE__*/React.createElement("option", {
    key: loc.name,
    value: loc.name
  }, Number.isFinite(loc.lat) && Number.isFinite(loc.lon) ? "".concat((+loc.lat).toFixed(2), ", ").concat((+loc.lon).toFixed(2)) : ''))), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-500 mt-1 italic"
  }, savedLocs.length > 0 ? 'Pick a previously-saved location, or type a new label for this place.' : 'Your label for this place — shown on the dashboard header.')), /*#__PURE__*/React.createElement("div", {
    className: "border-t border-slate-800 pt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field-label mb-1.5"
  }, "Resolved address / city", geoBusy && /*#__PURE__*/React.createElement("span", {
    className: "ml-2 text-amber-400 normal-case tracking-normal"
  }, "\u2026 resolving")), /*#__PURE__*/React.createElement("input", {
    className: "field-input",
    value: cfg.city,
    onChange: e => setCfg(_objectSpread(_objectSpread({}, cfg), {}, {
      city: e.target.value
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "field-label mb-1.5"
  }, "Latitude"), /*#__PURE__*/React.createElement("input", {
    className: "field-input",
    type: "number",
    step: "0.0001",
    value: cfg.lat,
    onChange: e => setCfg(_objectSpread(_objectSpread({}, cfg), {}, {
      lat: +e.target.value
    }))
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "field-label mb-1.5"
  }, "Longitude"), /*#__PURE__*/React.createElement("input", {
    className: "field-input",
    type: "number",
    step: "0.0001",
    value: cfg.lon,
    onChange: e => setCfg(_objectSpread(_objectSpread({}, cfg), {}, {
      lon: +e.target.value
    }))
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: useMyLocation,
    disabled: geoState === 'busy',
    "data-testid": "loc-use-my-location",
    className: "w-full py-2.5 rounded-lg border text-xs font-black uppercase tracking-widest transition-colors\n                                ".concat(geoState === 'busy' ? 'bg-amber-900/40 border-amber-700/40 text-amber-200 cursor-wait' : geoState && geoState.err ? 'bg-rose-900/40 border-rose-500/50 text-rose-100 hover:bg-rose-800/40' : 'bg-amber-700/70 border-amber-500/40 text-amber-50 hover:bg-amber-600/70')
  }, geoState === 'busy' ? '⏳  Reading device location…' : '📍  Use my device location'), geoState && geoState.err && /*#__PURE__*/React.createElement("div", {
    "data-testid": "loc-geo-error",
    className: "-mt-2 px-3 py-2 rounded-md bg-rose-950/50 border border-rose-700/40 text-[11px] leading-snug text-rose-200"
  }, /*#__PURE__*/React.createElement("b", {
    className: "text-rose-100"
  }, "Couldn't read location."), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "text-rose-200/90"
  }, geoState.err), typeof window !== 'undefined' && window.location && window.location.protocol === 'http:' && /*#__PURE__*/React.createElement("div", {
    className: "mt-1.5 text-[10px] text-rose-300/80 font-mono"
  }, "tip: browsers require HTTPS for geolocation.  Pick the location on the map or search bar instead.")), /*#__PURE__*/React.createElement("div", {
    className: "border-t border-slate-800 pt-3 mt-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field-label mb-2"
  }, "Quick jumps"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-1.5"
  }, [{
    name: 'Toronto, ON',
    lat: 43.6532,
    lon: -79.3832,
    z: 11
  }, {
    name: 'New York, NY',
    lat: 40.7128,
    lon: -74.0060,
    z: 11
  }, {
    name: 'London, UK',
    lat: 51.5074,
    lon: -0.1278,
    z: 11
  }, {
    name: 'Paris, FR',
    lat: 48.8566,
    lon: 2.3522,
    z: 11
  }, {
    name: 'Tokyo, JP',
    lat: 35.6762,
    lon: 139.6503,
    z: 11
  }, {
    name: 'Sydney, AU',
    lat: -33.8688,
    lon: 151.2093,
    z: 11
  }].map(j => /*#__PURE__*/React.createElement("button", {
    key: j.name,
    onClick: () => {
      setCfg(c => _objectSpread(_objectSpread({}, c), {}, {
        lat: j.lat,
        lon: j.lon,
        city: j.name
      }));
      if (mapRef.current) mapRef.current.setView([j.lat, j.lon], j.z);
    },
    className: "text-left px-2.5 py-1.5 rounded-md bg-slate-800/70 border border-slate-700 text-[11px] font-bold text-slate-300 hover:bg-slate-700 hover:border-amber-500/40 transition-all"
  }, j.name)))), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-500 leading-relaxed"
  }, "Tiles: OpenStreetMap \xB7 Geocode: Nominatim (free, ~1 req/s). Used for Open-Meteo weather feed and sunrise/sunset estimation."))));
}

/* =========================================================================
 * Language Setting -- modal
 * ========================================================================= */
function LanguageModal(_ref1) {
  var cfg = _ref1.cfg,
    setCfg = _ref1.setCfg,
    onClose = _ref1.onClose,
    onSave = _ref1.onSave;
  var langs = [{
    code: 'en',
    label: 'English',
    native: 'English'
  }, {
    code: 'zh-CN',
    label: 'Chinese (Simplified)',
    native: '简体中文'
  }, {
    code: 'zh-TW',
    label: 'Chinese (Traditional)',
    native: '繁體中文'
  }, {
    code: 'ja',
    label: 'Japanese',
    native: '日本語'
  }, {
    code: 'ko',
    label: 'Korean',
    native: '한국어'
  }];

  /* On Save & return: write the picked language code to the same
   * localStorage key the dashboard's i18n.js reads (`i18n_lang`), and
   * dispatch the `langchange` event so any open dashboard/config tab
   * picks it up live.  This is what makes the setup walk's language
   * choice actually drive the dashboard / config / mapper UI -- the
   * sidebar selector that used to live in the dashboard header has
   * been removed (2026-06-26) and the setup walk is now the single
   * source of truth for UI language. */
  var persistAndSave = () => {
    try {
      localStorage.setItem('i18n_lang', cfg.lang);
      window.dispatchEvent(new Event('langchange'));
      console.info('[setup walk] i18n_lang <-', cfg.lang);
    } catch (e) {
      console.warn('[setup walk] could not persist language:', e);
    }
    onSave();
  };
  return /*#__PURE__*/React.createElement(ModalShell, {
    title: "Language Setting",
    subtitle: "Pick your default interface language",
    accent: "emerald",
    onClose: onClose,
    onSave: persistAndSave
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, langs.map(l => /*#__PURE__*/React.createElement("button", {
    key: l.code,
    onClick: () => setCfg(_objectSpread(_objectSpread({}, cfg), {}, {
      lang: l.code
    })),
    className: "text-left p-3 rounded-xl border-2 transition-all\n                                ".concat(cfg.lang === l.code ? 'border-emerald-500 bg-emerald-900/20' : 'border-slate-700 bg-slate-800/40 hover:bg-slate-800')
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] uppercase tracking-widest font-black text-slate-500"
  }, l.code), /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-black text-slate-200"
  }, l.native), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-slate-500"
  }, l.label)))));
}

/* =========================================================================
 * Plug-in Setting -- modal w/ list + upload zone
 * ========================================================================= */
/* Per-plug-in mock configuration fields.  Keys map to plug-in `id`. */
var PLUGIN_CONFIG_FIELDS = {
  weather: [{
    key: 'provider',
    label: 'Provider',
    type: 'select',
    options: ['Open-Meteo', 'NWS', 'ECMWF'],
    def: 'Open-Meteo'
  }, {
    key: 'refresh',
    label: 'Refresh interval',
    type: 'select',
    options: ['1 min', '5 min', '15 min', '30 min', '1 h'],
    def: '15 min'
  }, {
    key: 'cache',
    label: 'Cache TTL (min)',
    type: 'number',
    def: 30
  }],
  givoni: [{
    key: 'climate',
    label: 'Climate model',
    type: 'select',
    options: ['Givoni 1992', 'ASHRAE 55', 'Adaptive'],
    def: 'Givoni 1992'
  }, {
    key: 'massive',
    label: 'Heavyweight construction',
    type: 'toggle',
    def: false
  }],
  sweet_spot: [{
    key: 'tracking',
    label: 'Track outdoor RH',
    type: 'toggle',
    def: true
  }, {
    key: 'hyst',
    label: 'Hysteresis (% RH)',
    type: 'number',
    def: 2
  }],
  g36: [{
    key: 'mode',
    label: 'Sequence mode',
    type: 'select',
    options: ['Single-zone VAV', 'Multi-zone VAV', 'DOAS w/ FCU'],
    def: 'Multi-zone VAV'
  }, {
    key: 'verbose',
    label: 'Verbose logging',
    type: 'toggle',
    def: false
  }],
  dibt: [{
    key: 'host',
    label: 'Bridge host',
    type: 'text',
    def: '192.168.1.100'
  }, {
    key: 'port',
    label: 'Telegram port',
    type: 'number',
    def: 47808
  }, {
    key: 'poll_ms',
    label: 'Poll interval (ms)',
    type: 'number',
    def: 2000
  }],
  lighting: [{
    key: 'gateway',
    label: 'Modbus gateway IP',
    type: 'text',
    def: '10.0.0.50'
  }, {
    key: 'unit_id',
    label: 'Unit ID',
    type: 'number',
    def: 1
  }, {
    key: 'tcp_port',
    label: 'TCP port',
    type: 'number',
    def: 502
  }]
};
function PluginsModal(_ref10) {
  var cfg = _ref10.cfg,
    setCfg = _ref10.setCfg,
    onClose = _ref10.onClose,
    onSave = _ref10.onSave;
  var ALL = [{
    id: 'weather',
    name: 'Weather',
    desc: 'Open-Meteo OA feed',
    ver: '2.1.0'
  }, {
    id: 'givoni',
    name: 'Givoni Engine',
    desc: 'Climate-strategy overlay',
    ver: '1.3.4'
  }, {
    id: 'sweet_spot',
    name: 'Sweet-Spot RH',
    desc: 'Adjustable RH band',
    ver: '1.0.1'
  }, {
    id: 'g36',
    name: 'G36 Sequences',
    desc: 'ASHRAE Guideline 36',
    ver: '0.9.2'
  }, {
    id: 'dibt',
    name: 'DIBT Bridge',
    desc: 'Delta Controls (DIBT) BACnet bridge',
    ver: '0.4.0'
  }, {
    id: 'lighting',
    name: 'Lighting (Red5)',
    desc: 'V3.0 Modbus TCP client',
    ver: '0.1.0-beta'
  }];
  var toggle = id => setCfg(c => _objectSpread(_objectSpread({}, c), {}, {
    enabled: c.enabled.includes(id) ? c.enabled.filter(x => x !== id) : [...c.enabled, id]
  }));

  /* expansion state — which plug-in's "Configure" panel is open */
  var _React$useState15 = React.useState(null),
    _React$useState16 = _slicedToArray(_React$useState15, 2),
    expandedId = _React$useState16[0],
    setExpandedId = _React$useState16[1];
  var updateField = (pluginId, fieldKey, value) => {
    setCfg(c => _objectSpread(_objectSpread({}, c), {}, {
      fields: _objectSpread(_objectSpread({}, c.fields || {}), {}, {
        [pluginId]: _objectSpread(_objectSpread({}, (c.fields || {})[pluginId] || {}), {}, {
          [fieldKey]: value
        })
      })
    }));
  };
  var fieldVal = (pluginId, field) => {
    var stored = cfg.fields && cfg.fields[pluginId] && cfg.fields[pluginId][field.key];
    return stored !== undefined ? stored : field.def;
  };
  return /*#__PURE__*/React.createElement(ModalShell, {
    title: "Plug-in Setting",
    subtitle: "Enable, upload or modify plug-ins",
    accent: "pink",
    onClose: onClose,
    onSave: onSave,
    size: "wide"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 max-h-[60vh] overflow-y-auto pr-1"
  }, ALL.map(p => {
    var on = cfg.enabled.includes(p.id);
    var expanded = expandedId === p.id;
    var fields = PLUGIN_CONFIG_FIELDS[p.id] || [];
    return /*#__PURE__*/React.createElement("div", {
      key: p.id,
      className: "rounded-xl border transition-all\n                                ".concat(on ? 'border-pink-500/40 bg-pink-900/10' : 'border-slate-700 bg-slate-800/40', "\n                                ").concat(expanded ? 'ring-1 ring-pink-500/30' : '')
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between p-3"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "text-sm font-black text-slate-100"
    }, p.name, /*#__PURE__*/React.createElement("span", {
      className: "ml-2 text-[10px] font-mono text-slate-500"
    }, "v", p.ver)), /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-slate-400"
    }, p.desc)), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => toggle(p.id),
      "data-testid": "plugin-toggle-".concat(p.id),
      className: "px-3 py-1 rounded-md text-[10px] uppercase tracking-widest font-black border\n                                                ".concat(on ? 'border-pink-500/60 text-pink-300 bg-pink-900/30' : 'border-slate-600 text-slate-400 bg-slate-800')
    }, on ? 'Enabled' : 'Disabled'), /*#__PURE__*/React.createElement("button", {
      onClick: () => setExpandedId(expanded ? null : p.id),
      "data-testid": "plugin-config-".concat(p.id),
      className: "px-3 py-1 rounded-md text-[10px] uppercase tracking-widest font-black border transition-all\n                                                ".concat(expanded ? 'border-pink-500 bg-pink-900/30 text-pink-200' : 'border-slate-600 text-slate-400 bg-slate-800 hover:bg-slate-700 hover:border-pink-500/50 hover:text-pink-300')
    }, expanded ? 'Close ▴' : 'Configure ▾'))), expanded && /*#__PURE__*/React.createElement("div", {
      className: "px-4 pb-4 border-t border-pink-500/20 bg-slate-950/40",
      "data-testid": "plugin-config-panel-".concat(p.id)
    }, fields.length === 0 ? /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-slate-500 italic py-3"
    }, "No configurable options for this plug-in yet.") : /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-1 md:grid-cols-2 gap-3 pt-3"
    }, fields.map(f => {
      var v = fieldVal(p.id, f);
      return /*#__PURE__*/React.createElement("div", {
        key: f.key
      }, /*#__PURE__*/React.createElement("label", {
        className: "text-[10px] uppercase tracking-widest font-bold text-slate-500 block mb-1"
      }, f.label), f.type === 'select' && /*#__PURE__*/React.createElement("select", {
        className: "field-input cursor-pointer",
        value: v,
        onChange: e => updateField(p.id, f.key, e.target.value)
      }, f.options.map(o => /*#__PURE__*/React.createElement("option", {
        key: o,
        value: o
      }, o))), f.type === 'number' && /*#__PURE__*/React.createElement("input", {
        type: "number",
        className: "field-input",
        value: v,
        onChange: e => updateField(p.id, f.key, +e.target.value)
      }), f.type === 'text' && /*#__PURE__*/React.createElement("input", {
        type: "text",
        className: "field-input",
        value: v,
        onChange: e => updateField(p.id, f.key, e.target.value)
      }), f.type === 'toggle' && /*#__PURE__*/React.createElement("button", {
        onClick: () => updateField(p.id, f.key, !v),
        className: "w-full py-2 rounded-lg text-xs font-black uppercase tracking-widest border transition-all\n                                                                        ".concat(v ? 'bg-pink-700/40 border-pink-500/60 text-pink-200' : 'bg-slate-800 border-slate-600 text-slate-400')
      }, v ? 'ON' : 'OFF'));
    })), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-800"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        // reset this plug-in's fields to defaults
        setCfg(c => {
          var next = _objectSpread({}, c.fields || {});
          delete next[p.id];
          return _objectSpread(_objectSpread({}, c), {}, {
            fields: next
          });
        });
      },
      className: "px-3 py-1.5 rounded-md text-[10px] uppercase tracking-widest font-black border border-slate-600 text-slate-400 hover:bg-slate-800"
    }, "Reset defaults"), /*#__PURE__*/React.createElement("button", {
      onClick: () => setExpandedId(null),
      className: "px-3 py-1.5 rounded-md text-[10px] uppercase tracking-widest font-black bg-pink-600 hover:bg-pink-500 text-white"
    }, "Done"))));
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-5 p-4 border-2 border-dashed border-slate-700 rounded-xl text-center hover:border-pink-500/40 transition-all cursor-pointer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-3xl mb-1"
  }, "\u2934"), /*#__PURE__*/React.createElement("div", {
    className: "text-sm font-black text-slate-300"
  }, "Drop a .py / .zip / .red5 plug-in here"), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-slate-500 mt-1"
  }, "or click to choose a file (mock \u2014 not wired)")));
}

/* =========================================================================
 * Modal Shell -- shared
 * ========================================================================= */
function ModalShell(_ref11) {
  var title = _ref11.title,
    subtitle = _ref11.subtitle,
    _ref11$accent = _ref11.accent,
    accent = _ref11$accent === void 0 ? 'indigo' : _ref11$accent,
    onClose = _ref11.onClose,
    onSave = _ref11.onSave,
    _ref11$size = _ref11.size,
    size = _ref11$size === void 0 ? '' : _ref11$size,
    children = _ref11.children;
  var colorMap = {
    indigo: '#818cf8',
    amber: '#fbbf24',
    emerald: '#34d399',
    pink: '#f472b6'
  };
  var c = colorMap[accent] || '#818cf8';
  var sizeMap = {
    wide: 'max-w-2xl',
    map: 'max-w-3xl',
    max: 'max-w-[96vw] w-[96vw] h-[92vh]'
  };
  var width = sizeMap[size] || 'max-w-md';
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center modal-backdrop",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-slate-900 border-2 rounded-2xl w-full ".concat(width, " mx-4 fade-up flex flex-col"),
    onClick: e => e.stopPropagation(),
    style: {
      borderColor: "".concat(c, "66"),
      maxHeight: '92vh'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between p-6 pb-4 border-b border-slate-800/60 shrink-0"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-black uppercase tracking-widest",
    style: {
      color: c
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 mt-1"
  }, subtitle)), /*#__PURE__*/React.createElement("button", {
    "data-testid": "modal-close",
    onClick: onClose,
    className: "text-slate-500 hover:text-white text-2xl leading-none"
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-h-0 overflow-y-auto px-6 py-5"
  }, children), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 shrink-0 bg-slate-900 rounded-b-2xl"
  }, /*#__PURE__*/React.createElement("button", {
    "data-testid": "modal-cancel",
    onClick: onClose,
    className: "px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs uppercase tracking-widest font-black text-slate-400 hover:bg-slate-700"
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    "data-testid": "modal-save",
    onClick: onSave,
    className: "px-5 py-2 rounded-lg text-xs uppercase tracking-widest font-black text-white",
    style: {
      background: c,
      boxShadow: "0 0 12px ".concat(c, "55")
    }
  }, "Save & return \u2713"))));
}

/* mount */
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBfd2Fsay5jb21waWxlZC5qcyIsIm5hbWVzIjpbIl9SZWFjdCIsIlJlYWN0IiwidXNlU3RhdGUiLCJ1c2VNZW1vIiwiU1RFUFMiLCJrZXkiLCJsYWJlbCIsInN1YiIsImtpbmQiLCJpY29uQ29sb3IiLCJhY2NlbnQiLCJBcHAiLCJfdXNlU3RhdGUiLCJwc3kiLCJsb2NhdGlvbiIsImxhbmd1YWdlIiwicGx1Z2lucyIsIl91c2VTdGF0ZTIiLCJfc2xpY2VkVG9BcnJheSIsImRvbmUiLCJzZXREb25lIiwiX3VzZVN0YXRlMyIsIl91c2VTdGF0ZTQiLCJyb3V0ZSIsInNldFJvdXRlIiwiX3VzZVN0YXRlNSIsIl91c2VTdGF0ZTYiLCJtb2RhbCIsInNldE1vZGFsIiwiX3VzZVN0YXRlNyIsImdpdm9uaSIsInJoUHJlc2V0IiwicmhMbyIsInJoSGkiLCJ0TG8iLCJ0SGkiLCJ0aGVtZSIsImRhcmtMZXZlbCIsIl91c2VTdGF0ZTgiLCJwc3lDZmciLCJzZXRQc3lDZmciLCJfdXNlU3RhdGU5Iiwic2l0ZU5hbWUiLCJjaXR5IiwibGF0IiwibG9uIiwiX3VzZVN0YXRlMCIsImxvY0NmZyIsInNldExvY0NmZyIsIl91c2VTdGF0ZTEiLCJ2IiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsImFsbG93ZWQiLCJpbmRleE9mIiwibGFuZyIsImUiLCJfdXNlU3RhdGUxMCIsImxhbmdDZmciLCJzZXRMYW5nQ2ZnIiwiX3VzZVN0YXRlMTEiLCJlbmFibGVkIiwiX3VzZVN0YXRlMTIiLCJwbHVnaW5DZmciLCJzZXRQbHVnaW5DZmciLCJjb21wbGV0ZUNvdW50IiwiT2JqZWN0IiwidmFsdWVzIiwiZmlsdGVyIiwiQm9vbGVhbiIsImxlbmd0aCIsImZpbmlzaCIsImQiLCJfb2JqZWN0U3ByZWFkIiwiY3JlYXRlRWxlbWVudCIsIlBzeUNoYXJ0U2V0dGluZ1BhZ2UiLCJjZmciLCJzZXRDZmciLCJvbkJhY2siLCJvblNhdmUiLCJjbGFzc05hbWUiLCJocmVmIiwib25DbGljayIsInNldEl0ZW0iLCJzdHlsZSIsImFuaW1hdGlvbkRlbGF5IiwibWFwIiwicyIsImkiLCJUaWxlIiwic3RlcCIsImluZGV4IiwiY29uY2F0IiwiTG9jYXRpb25Nb2RhbCIsIm9uQ2xvc2UiLCJMYW5ndWFnZU1vZGFsIiwiUGx1Z2luc01vZGFsIiwiX3JlZiIsImJhY2tncm91bmQiLCJib3JkZXIiLCJUaWxlSWNvbiIsImNvbG9yIiwiX3JlZjIiLCJzdHJva2UiLCJmaWxsIiwic3Ryb2tlV2lkdGgiLCJzdHJva2VMaW5lY2FwIiwic3Ryb2tlTGluZWpvaW4iLCJfZXh0ZW5kcyIsIndpZHRoIiwiaGVpZ2h0Iiwidmlld0JveCIsImN4IiwiY3kiLCJyIiwiX3JlZjMiLCJ1cGRhdGUiLCJrIiwiYyIsInVzZUVmZmVjdCIsInJhdyIsInByZXNldCIsInBhdGNoIiwicCIsIkpTT04iLCJwYXJzZSIsIk51bWJlciIsImlzRmluaXRlIiwibG8iLCJoaSIsIlJIX1BSRVNFVFMiLCJmaW5kIiwieCIsImlkIiwidGgiLCJkbCIsInBhcnNlRmxvYXQiLCJ0clJhdyIsInRyIiwibWluIiwibWF4Iiwia2V5cyIsInBlcnNpc3RBbmRTYXZlIiwic3RyaW5naWZ5IiwiU3RyaW5nIiwid2luZG93IiwiZGlzcGF0Y2hFdmVudCIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwiY29uc29sZSIsImluZm8iLCJ3YXJuIiwiUHN5U2tlbGV0b24iLCJQc3lDb250cm9sUGFuZWwiLCJub3RlIiwiX3JlZjQiLCJXIiwiSCIsInBhZCIsImxlZnQiLCJyaWdodCIsInRvcCIsImJvdHRvbSIsImdyaWRXIiwiZ3JpZEgiLCJUX01JTiIsIlRfTUFYIiwiV19NSU4iLCJXX01BWCIsInQiLCJ5IiwidyIsIl9nZXRXIiwiZ2V0VyIsInJoIiwic2FmZVB0cyIsImFyciIsInRvRml4ZWQiLCJqb2luIiwicmg4MCIsInB1c2giLCJyaDEwMCIsInJoMjBMaW5lIiwicmgyMF9DWiIsIkNaIiwicmhIaV90b3AiLCJ0dCIsInJoTG9fYm90IiwiU1dFRVQiLCJOViIsIk1hc3MiLCJNQ1YiLCJFVkFQIiwid2ludGVyUkg4MCIsIndpbnRlclJIMjAiLCJXSU5URVIiLCJpc29wbGV0aHMiLCJpc0xpZ2h0IiwicGFsZXR0ZSIsImJnIiwiZ3JpZCIsInRpY2siLCJheGlzIiwicGFuZWxCZyIsInBhbmVsQm9yZGVyIiwicGlsbEJnIiwicGlsbEZnIiwibWV0YUZnIiwiZGltRmlsdGVyIiwiTWF0aCIsImJvcmRlckNvbG9yIiwiYm9yZGVyUmFkaXVzIiwiQXJyYXkiLCJmcm9tIiwiXyIsIngxIiwieTEiLCJ4MiIsInkyIiwiZm9udFNpemUiLCJ0ZXh0QW5jaG9yIiwicHRzIiwid3ciLCJwb2ludHMiLCJzdHJva2VEYXNoYXJyYXkiLCJmbG9vciIsImZvbnRXZWlnaHQiLCJvcGFjaXR5IiwiZmlsbE9wYWNpdHkiLCJjbGlwUGF0aFVuaXRzIiwiY2xpcFBhdGgiLCJ0cmFuc2Zvcm0iLCJsZXR0ZXJTcGFjaW5nIiwicGFpbnRPcmRlciIsIl9yZWY1Iiwicm91bmQiLCJ0eXBlIiwidmFsdWUiLCJvbkNoYW5nZSIsInRhcmdldCIsImFjY2VudENvbG9yIiwiX25vcm1hbGl6ZUxvY3MiLCJzZWVuIiwiU2V0Iiwib3V0IiwibCIsIm5hbWUiLCJ0cmltIiwiaGFzIiwiYWRkIiwiX3JlZjYiLCJtYXBCb3hSZWYiLCJ1c2VSZWYiLCJtYXBSZWYiLCJtYXJrZXJSZWYiLCJfUmVhY3QkdXNlU3RhdGUiLCJfUmVhY3QkdXNlU3RhdGUyIiwiZ2VvQnVzeSIsInNldEdlb0J1c3kiLCJfUmVhY3QkdXNlU3RhdGUzIiwiaXNBcnJheSIsIl9SZWFjdCR1c2VTdGF0ZTQiLCJzYXZlZExvY3MiLCJzZXRTYXZlZExvY3MiLCJjYW5jZWxsZWQiLCJfYXN5bmNUb0dlbmVyYXRvciIsImZldGNoIiwiY3JlZGVudGlhbHMiLCJjYWNoZSIsIm9rIiwiaiIsImpzb24iLCJzYXZlZCIsIm9uU2l0ZU5hbWVDaGFuZ2UiLCJuZXdOYW1lIiwiaGl0IiwiY3VycmVudCIsInNldFZpZXciLCJfUmVhY3QkdXNlU3RhdGU1IiwiX1JlYWN0JHVzZVN0YXRlNiIsInNlYXJjaFEiLCJzZXRTZWFyY2hRIiwiX1JlYWN0JHVzZVN0YXRlNyIsIl9SZWFjdCR1c2VTdGF0ZTgiLCJzZWFyY2hIaXRzIiwic2V0U2VhcmNoSGl0cyIsIl9SZWFjdCR1c2VTdGF0ZTkiLCJfUmVhY3QkdXNlU3RhdGUwIiwic2VhcmNoQnVzeSIsInNldFNlYXJjaEJ1c3kiLCJfUmVhY3QkdXNlU3RhdGUxIiwiX1JlYWN0JHVzZVN0YXRlMTAiLCJzZWFyY2hPcGVuIiwic2V0U2VhcmNoT3BlbiIsInNlYXJjaERlYm91bmNlUmVmIiwicnVuU2VhcmNoIiwiX3JlZjgiLCJxIiwidXJsIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiaGVhZGVycyIsIl94IiwiYXBwbHkiLCJhcmd1bWVudHMiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwicGlja1NlYXJjaEhpdCIsImRpc3BsYXlfbmFtZSIsInJldmVyc2VHZW9jb2RlIiwiX3JlZjkiLCJhIiwiYWRkcmVzcyIsInRvd24iLCJ2aWxsYWdlIiwiaGFtbGV0IiwiY291bnR5IiwicmVnaW9uIiwic3RhdGUiLCJjb3VudHJ5IiwiX3gyIiwiX3gzIiwiTCIsInpvb21Db250cm9sIiwiYXR0cmlidXRpb25Db250cm9sIiwidGlsZUxheWVyIiwibWF4Wm9vbSIsImF0dHJpYnV0aW9uIiwiYWRkVG8iLCJtYXJrZXIiLCJkcmFnZ2FibGUiLCJiaW5kVG9vbHRpcCIsInBlcm1hbmVudCIsImFwcGx5TGF0TG9uIiwibiIsIm9uIiwibGwiLCJnZXRMYXRMbmciLCJsbmciLCJzZXRMYXRMbmciLCJsYXRsbmciLCJpbnZhbGlkYXRlU2l6ZSIsInJlbW92ZSIsInBhblRvIiwiX1JlYWN0JHVzZVN0YXRlMTEiLCJfUmVhY3QkdXNlU3RhdGUxMiIsImdlb1N0YXRlIiwic2V0R2VvU3RhdGUiLCJ1c2VNeUxvY2F0aW9uIiwibmF2aWdhdG9yIiwiZ2VvbG9jYXRpb24iLCJlcnIiLCJnZXRDdXJyZW50UG9zaXRpb24iLCJwb3MiLCJjb29yZHMiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsIm1zZyIsImNvZGUiLCJtZXNzYWdlIiwiZW5hYmxlSGlnaEFjY3VyYWN5IiwidGltZW91dCIsIm1heGltdW1BZ2UiLCJfUmVhY3QkdXNlU3RhdGUxMyIsIl9SZWFjdCR1c2VTdGF0ZTE0Iiwic2F2ZU1zZyIsInNldFNhdmVNc2ciLCJfcmVmMCIsImxvYyIsInBlcnNpc3RlZCIsIndhcm5pbmciLCJtZXRob2QiLCJib2R5IiwiYWN0aXZlIiwiZGVmYXVsdCIsIl9sYXN0V2VhdGhlckxvY2F0aW9uU2F2ZSIsIk1vZGFsU2hlbGwiLCJ0aXRsZSIsInN1YnRpdGxlIiwic2l6ZSIsIm1pbkhlaWdodCIsInJlZiIsIm92ZXJmbG93Iiwib25Gb2N1cyIsInBsYWNlaG9sZGVyIiwib3V0bGluZSIsImgiLCJwbGFjZV9pZCIsImNsYXNzIiwibGlzdCIsInVuZGVmaW5lZCIsImRpc2FibGVkIiwicHJvdG9jb2wiLCJ6IiwiX3JlZjEiLCJsYW5ncyIsIm5hdGl2ZSIsIkV2ZW50IiwiUExVR0lOX0NPTkZJR19GSUVMRFMiLCJ3ZWF0aGVyIiwib3B0aW9ucyIsImRlZiIsInN3ZWV0X3Nwb3QiLCJnMzYiLCJkaWJ0IiwibGlnaHRpbmciLCJfcmVmMTAiLCJBTEwiLCJkZXNjIiwidmVyIiwidG9nZ2xlIiwiaW5jbHVkZXMiLCJfUmVhY3QkdXNlU3RhdGUxNSIsIl9SZWFjdCR1c2VTdGF0ZTE2IiwiZXhwYW5kZWRJZCIsInNldEV4cGFuZGVkSWQiLCJ1cGRhdGVGaWVsZCIsInBsdWdpbklkIiwiZmllbGRLZXkiLCJmaWVsZHMiLCJmaWVsZFZhbCIsImZpZWxkIiwic3RvcmVkIiwiZXhwYW5kZWQiLCJmIiwibyIsIm5leHQiLCJfcmVmMTEiLCJfcmVmMTEkYWNjZW50IiwiX3JlZjExJHNpemUiLCJjaGlsZHJlbiIsImNvbG9yTWFwIiwiaW5kaWdvIiwiYW1iZXIiLCJlbWVyYWxkIiwicGluayIsInNpemVNYXAiLCJ3aWRlIiwic3RvcFByb3BhZ2F0aW9uIiwibWF4SGVpZ2h0IiwiYm94U2hhZG93IiwiUmVhY3RET00iLCJjcmVhdGVSb290IiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInJlbmRlciJdLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXR1cC13YWxrL3NldHVwX3dhbGsuanN4Il0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHsgdXNlU3RhdGUsIHVzZU1lbW8gfSA9IFJlYWN0O1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBTVEVQIERFRklOSVRJT05TIOKAlCB0aGUgNCB3YWxrIHBhdGhzIHRoZSB1c2VyIGRlc2NyaWJlZFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuY29uc3QgU1RFUFMgPSBbXG4gICAgeyBrZXk6J3BzeScsICAgICAgbGFiZWw6J1BzeSBDaGFydCBTZXR0aW5nJywgICAgc3ViOidHaXZvbmkgwrcgUkggcmFuZ2UgwrcgYXhpcyByYW5nZScsIGtpbmQ6J3BhZ2UnLCAgaWNvbkNvbG9yOicjODE4Y2Y4JywgYWNjZW50OidpbmRpZ28nIH0sXG4gICAgeyBrZXk6J2xvY2F0aW9uJywgbGFiZWw6J0xvY2F0aW9uIFNldHRpbmcnLCAgICAgc3ViOidDaXR5IG5hbWUgJiBsYXQgLyBsb25nJywgICAgICAgICBraW5kOidtb2RhbCcsIGljb25Db2xvcjonI2ZiYmYyNCcsIGFjY2VudDonYW1iZXInIH0sXG4gICAgeyBrZXk6J2xhbmd1YWdlJywgbGFiZWw6J0xhbmd1YWdlIFNldHRpbmcnLCAgICAgc3ViOidFTiDCtyBGUiDCtyBFUyDCtyBaSCDCtyDigKYnLCAgICAgICAgICBraW5kOidtb2RhbCcsIGljb25Db2xvcjonIzM0ZDM5OScsIGFjY2VudDonZW1lcmFsZCcgfSxcbiAgICB7IGtleToncGx1Z2lucycsICBsYWJlbDonUGx1Zy1pbiBTZXR0aW5nJywgICAgICBzdWI6J0xpc3QgwrcgdXBsb2FkIMK3IG1vZGlmeScsICAgICAgICAga2luZDonbW9kYWwnLCBpY29uQ29sb3I6JyNmNDcyYjYnLCBhY2NlbnQ6J3BpbmsnIH0sXG5dO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBST09UIEFQUFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuZnVuY3Rpb24gQXBwKCkge1xuICAgIC8qIGNvbXBsZXRpb24gKyBwZXItc3RlcCBjb25maWcgLS0gbW9ja3VwIHN0YXRlLCBuZXZlciBwZXJzaXN0ZWQgKi9cbiAgICBjb25zdCBbZG9uZSwgc2V0RG9uZV0gPSB1c2VTdGF0ZSh7IHBzeTpmYWxzZSwgbG9jYXRpb246ZmFsc2UsIGxhbmd1YWdlOmZhbHNlLCBwbHVnaW5zOmZhbHNlIH0pO1xuICAgIGNvbnN0IFtyb3V0ZSwgc2V0Um91dGVdID0gdXNlU3RhdGUoJ2h1YicpOyAgIC8vICdodWInIHwgJ3BzeSdcbiAgICBjb25zdCBbbW9kYWwsIHNldE1vZGFsXSA9IHVzZVN0YXRlKG51bGwpOyAgICAgLy8gJ2xvY2F0aW9uJyB8ICdsYW5ndWFnZScgfCAncGx1Z2lucycgfCBudWxsXG5cbiAgICBjb25zdCBbcHN5Q2ZnLCBzZXRQc3lDZmddICAgICAgICAgPSB1c2VTdGF0ZSh7IGdpdm9uaTp0cnVlLCByaFByZXNldDonb2ZmaWNlJywgcmhMbzozMCwgcmhIaTo2MCwgdExvOi0xNSwgdEhpOjUwLCB0aGVtZTonZGFyaycsIGRhcmtMZXZlbDoyLjAgfSk7XG4gICAgY29uc3QgW2xvY0NmZywgc2V0TG9jQ2ZnXSAgICAgICAgID0gdXNlU3RhdGUoeyBzaXRlTmFtZTonTXkgQnVpbGRpbmcnLCBjaXR5OidUb3JvbnRvLCBPTicsIGxhdDo0My42NTMyLCBsb246LTc5LjM4MzIgfSk7XG4gICAgY29uc3QgW2xhbmdDZmcsIHNldExhbmdDZmddICAgICAgID0gdXNlU3RhdGUoKCkgPT4ge1xuICAgICAgICAvKiBMYXp5IGluaXQgZnJvbSB0aGUgc2FtZSBsb2NhbFN0b3JhZ2Uga2V5IHRoZSBkYXNoYm9hcmQgcmVhZHMsIHNvXG4gICAgICAgICAqIHJlb3BlbmluZyB0aGUgc2V0dXAgd2FsayBzaG93cyB0aGUgY3VycmVudGx5LWFjdGl2ZSBsYW5ndWFnZVxuICAgICAgICAgKiByYXRoZXIgdGhhbiBhbHdheXMgZGVmYXVsdGluZyB0byBFbmdsaXNoLiAqL1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgdiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdpMThuX2xhbmcnKTtcbiAgICAgICAgICAgIGNvbnN0IGFsbG93ZWQgPSBbJ2VuJywnemgtQ04nLCd6aC1UVycsJ2phJywna28nXTtcbiAgICAgICAgICAgIGlmICh2ICYmIGFsbG93ZWQuaW5kZXhPZih2KSAhPT0gLTEpIHJldHVybiB7IGxhbmc6IHYgfTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBwcml2YXRlIG1vZGUgLT4gZmFsbCB0aHJvdWdoICovIH1cbiAgICAgICAgcmV0dXJuIHsgbGFuZzonZW4nIH07XG4gICAgfSk7XG4gICAgY29uc3QgW3BsdWdpbkNmZywgc2V0UGx1Z2luQ2ZnXSAgID0gdXNlU3RhdGUoeyBlbmFibGVkOlsnd2VhdGhlcicsJ2dpdm9uaScsJ3N3ZWV0X3Nwb3QnXSB9KTtcblxuICAgIGNvbnN0IGNvbXBsZXRlQ291bnQgPSBPYmplY3QudmFsdWVzKGRvbmUpLmZpbHRlcihCb29sZWFuKS5sZW5ndGg7XG5cbiAgICBjb25zdCBmaW5pc2ggPSAoa2V5KSA9PiB7XG4gICAgICAgIHNldERvbmUoZCA9PiAoey4uLmQsIFtrZXldOnRydWV9KSk7XG4gICAgICAgIHNldFJvdXRlKCdodWInKTtcbiAgICAgICAgc2V0TW9kYWwobnVsbCk7XG4gICAgfTtcblxuICAgIC8qIGZ1bGwtcGFnZSBQc3kgQ2hhcnQgZWRpdG9yICovXG4gICAgaWYgKHJvdXRlID09PSAncHN5Jykge1xuICAgICAgICByZXR1cm4gPFBzeUNoYXJ0U2V0dGluZ1BhZ2UgY2ZnPXtwc3lDZmd9IHNldENmZz17c2V0UHN5Q2ZnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25CYWNrPXsoKSA9PiBzZXRSb3V0ZSgnaHViJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNhdmU9eygpID0+IGZpbmlzaCgncHN5Jyl9IC8+O1xuICAgIH1cblxuICAgIC8qIGRlZmF1bHQ6IEhVQiBzY3JlZW4gKi9cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1pbi1oLXNjcmVlbiBweC02IHB5LThcIj5cbiAgICAgICAgICAgIHsvKiAtLS0tLS0tLS0tLS0tIGhlYWRlciAtLS0tLS0tLS0tLS0tICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXgtdy01eGwgbXgtYXV0byBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gbWItMTAgZmFkZS11cFwiPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJ0ZXh0LTJ4bCBzbTp0ZXh0LTN4bCBmb250LWJsYWNrIGl0YWxpYyB1cHBlcmNhc2UgdHJhY2tpbmctdGlnaHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtcmVkLTUwMFwiPlJlZDU8L3NwYW4+IDxzcGFuIGNsYXNzTmFtZT1cInRleHQtd2hpdGVcIj5TdHVkaW88L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCBmb250LW5vcm1hbCBpdGFsaWNcIj4gJm5ic3A7LyZuYnNwOyBzZXR1cCB3YWxrPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2gxPlxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCB0ZXh0LXhzIG10LTEgZm9udC1tb25vIHRyYWNraW5nLXdpZGVcIj5Db25maWd1cmUgb25jZS4gU2tpcCBhbnkgc3RlcCB5b3UgZG9uJ3QgbmVlZC48L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtNFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJwaWxsIGJnLXNsYXRlLTgwMCB0ZXh0LXNsYXRlLTQwMFwiPntjb21wbGV0ZUNvdW50fS80IERPTkU8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIvZGFzaGJvYXJkLmh0bWxcIlxuICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7IHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1LnNldHVwLmRvbmUnLCcxJyk7IH0gY2F0Y2goZSl7fSB9fVxuICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtc2xhdGUtNTAwIGhvdmVyOnRleHQtc2xhdGUtMzAwIHVuZGVybGluZSB1bmRlcmxpbmUtb2Zmc2V0LTRcIj5Ta2lwIGFsbCDihpI8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIC0tLS0tLS0tLS0tLS0gdGlsZSBncmlkIC0tLS0tLS0tLS0tLS0gKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1heC13LTV4bCBteC1hdXRvIGdyaWQgZ3JpZC1jb2xzLTEgc206Z3JpZC1jb2xzLTIgZ2FwLTUgZmFkZS11cFwiIHN0eWxlPXt7YW5pbWF0aW9uRGVsYXk6Jy4wOHMnfX0+XG4gICAgICAgICAgICAgICAge1NURVBTLm1hcCgocywgaSkgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8VGlsZSBrZXk9e3Mua2V5fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdGVwPXtzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lPXtkb25lW3Mua2V5XX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg9e2krMX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gcy5raW5kID09PSAncGFnZScgPyBzZXRSb3V0ZShzLmtleSkgOiBzZXRNb2RhbChzLmtleSl9IC8+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIC0tLS0tLS0tLS0tLS0gZm9vdGVyIENUQSAtLS0tLS0tLS0tLS0tICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXgtdy01eGwgbXgtYXV0byBtdC0xMCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gZmFkZS11cFwiIHN0eWxlPXt7YW5pbWF0aW9uRGVsYXk6Jy4xOHMnfX0+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgdGV4dC14cyBmb250LW1vbm9cIj5cbiAgICAgICAgICAgICAgICAgICAge2NvbXBsZXRlQ291bnQgPT09IDAgJiYgJ+KGkSBQaWNrIGEgc2V0dGluZyB0byBzdGFydCwgb3Igc2tpcCBhbGwgYW5kIGdvIHN0cmFpZ2h0IHRvIHRoZSBkYXNoYm9hcmQuJ31cbiAgICAgICAgICAgICAgICAgICAge2NvbXBsZXRlQ291bnQgPiAwICYmIGNvbXBsZXRlQ291bnQgPCA0ICYmIGDihpEgJHs0IC0gY29tcGxldGVDb3VudH0gc3RlcCR7NCAtIGNvbXBsZXRlQ291bnQgPT09IDEgPyAnJyA6ICdzJ30gcmVtYWluaW5nIChvcHRpb25hbCkuYH1cbiAgICAgICAgICAgICAgICAgICAge2NvbXBsZXRlQ291bnQgPT09IDQgJiYgJ+KckyBBbGwgc3RlcHMgY29uZmlndXJlZC4gIFJlYWR5IHdoZW4geW91IGFyZS4nfVxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiL2Rhc2hib2FyZC5odG1sXCJcbiAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7IHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1LnNldHVwLmRvbmUnLCcxJyk7IH0gY2F0Y2goZSl7fSB9fVxuICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTcgcHktMyByb3VuZGVkLXhsIHRleHQtc20gZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2NvbXBsZXRlQ291bnQgPT09IDRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1lbWVyYWxkLTYwMCBob3ZlcjpiZy1lbWVyYWxkLTUwMCB0ZXh0LXdoaXRlIHNoYWRvdy1sZyBzaGFkb3ctZW1lcmFsZC01MDAvMzAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctaW5kaWdvLTYwMCBob3ZlcjpiZy1pbmRpZ28tNTAwIHRleHQtd2hpdGUgc2hhZG93LWxnIHNoYWRvdy1pbmRpZ28tNTAwLzIwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgT3BlbiBEYXNoYm9hcmQg4oaSXG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiAtLS0tLS0tLS0tLS0tIG1vZGFscyAtLS0tLS0tLS0tLS0tICovfVxuICAgICAgICAgICAge21vZGFsID09PSAnbG9jYXRpb24nICYmIDxMb2NhdGlvbk1vZGFsIGNmZz17bG9jQ2ZnfSBzZXRDZmc9e3NldExvY0NmZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldE1vZGFsKG51bGwpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXsoKSA9PiBmaW5pc2goJ2xvY2F0aW9uJyl9IC8+fVxuICAgICAgICAgICAge21vZGFsID09PSAnbGFuZ3VhZ2UnICYmIDxMYW5ndWFnZU1vZGFsIGNmZz17bGFuZ0NmZ30gc2V0Q2ZnPXtzZXRMYW5nQ2ZnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0TW9kYWwobnVsbCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNhdmU9eygpID0+IGZpbmlzaCgnbGFuZ3VhZ2UnKX0gLz59XG4gICAgICAgICAgICB7bW9kYWwgPT09ICdwbHVnaW5zJyAgJiYgPFBsdWdpbnNNb2RhbCAgY2ZnPXtwbHVnaW5DZmd9IHNldENmZz17c2V0UGx1Z2luQ2ZnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0TW9kYWwobnVsbCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNhdmU9eygpID0+IGZpbmlzaCgncGx1Z2lucycpfSAvPn1cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogVGlsZSAobGFyZ2UgZWFzeS1vbi1leWVzIGJ1dHRvbilcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIFRpbGUoeyBzdGVwLCBkb25lLCBpbmRleCwgb25DbGljayB9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgc2V0dXAtdGlsZS0ke3N0ZXAua2V5fWB9XG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17YE9wZW4gJHtzdGVwLmxhYmVsfWB9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdGlsZS1idG4gcmVsYXRpdmUgdGV4dC1sZWZ0IGJnLXNsYXRlLTkwMC83MCBib3JkZXItMiBib3JkZXItc2xhdGUtNzAwLzcwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91bmRlZC0yeGwgcC02IHNtOnAtNyAke2RvbmUgPyAnZG9uZScgOiAnJ31gfT5cbiAgICAgICAgICAgIHtkb25lICYmIDxzcGFuIGNsYXNzTmFtZT1cImNoZWNrXCIgZGF0YS10ZXN0aWQ9e2BzZXR1cC10aWxlLSR7c3RlcC5rZXl9LWRvbmVgfT7inJM8L3NwYW4+fVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtNCBtYi0zXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTEyIGgtMTIgcm91bmRlZC14bCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiXG4gICAgICAgICAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6YCR7c3RlcC5pY29uQ29sb3J9MjJgLCBib3JkZXI6YDFweCBzb2xpZCAke3N0ZXAuaWNvbkNvbG9yfTU1YH19PlxuICAgICAgICAgICAgICAgICAgICA8VGlsZUljb24ga2luZD17c3RlcC5rZXl9IGNvbG9yPXtzdGVwLmljb25Db2xvcn0gLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtM3hsIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS03MDBcIj4we2luZGV4fTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1sZyBzbTp0ZXh0LXhsIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVyIG1iLTFcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7Y29sb3I6c3RlcC5pY29uQ29sb3J9fT57c3RlcC5sYWJlbH08L2gzPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS00MDAgdGV4dC1zbSBsZWFkaW5nLXNudWdcIj57c3RlcC5zdWJ9PC9wPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC00IGZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicGlsbCBiZy1zbGF0ZS04MDAgdGV4dC1zbGF0ZS00MDBcIj57c3RlcC5raW5kID09PSAncGFnZScgPyAnRnVsbCBwYWdlJyA6ICdQb3B1cCd9PC9zcGFuPlxuICAgICAgICAgICAgICAgIHtkb25lICYmIDxzcGFuIGNsYXNzTmFtZT1cInBpbGwgYmctZW1lcmFsZC05MDAvNDAgdGV4dC1lbWVyYWxkLTQwMFwiPkNvbmZpZ3VyZWQ8L3NwYW4+fVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICk7XG59XG5cbmZ1bmN0aW9uIFRpbGVJY29uKHsga2luZCwgY29sb3IgfSkge1xuICAgIC8qIHNpbXBsZSBpbmxpbmUgU1ZHcyBzbyB3ZSBrZWVwIHRoZSBmaWxlIHNlbGYtY29udGFpbmVkICovXG4gICAgY29uc3Qgc3Ryb2tlID0geyBzdHJva2U6Y29sb3IsIGZpbGw6J25vbmUnLCBzdHJva2VXaWR0aDoyLCBzdHJva2VMaW5lY2FwOidyb3VuZCcsIHN0cm9rZUxpbmVqb2luOidyb3VuZCcgfTtcbiAgICBpZiAoa2luZCA9PT0gJ3BzeScpICAgICAgcmV0dXJuIDxzdmcgd2lkdGg9XCIyMlwiIGhlaWdodD1cIjIyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHsuLi5zdHJva2V9PjxwYXRoIGQ9XCJNMyAzdjE4aDE4XCIvPjxwYXRoIGQ9XCJNMyAxN2M0LTEgNy02IDktOXM1LTMgOS0yXCIvPjwvc3ZnPjtcbiAgICBpZiAoa2luZCA9PT0gJ2xvY2F0aW9uJykgcmV0dXJuIDxzdmcgd2lkdGg9XCIyMlwiIGhlaWdodD1cIjIyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHsuLi5zdHJva2V9PjxwYXRoIGQ9XCJNMTIgMjJzLTctNi40LTctMTJhNyA3IDAgMSAxIDE0IDBjMCA1LjYtNyAxMi03IDEyelwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEwXCIgcj1cIjIuNVwiLz48L3N2Zz47XG4gICAgaWYgKGtpbmQgPT09ICdsYW5ndWFnZScpIHJldHVybiA8c3ZnIHdpZHRoPVwiMjJcIiBoZWlnaHQ9XCIyMlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB7Li4uc3Ryb2tlfT48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjlcIi8+PHBhdGggZD1cIk0zIDEyaDE4TTEyIDNhMTQgMTQgMCAwIDEgMCAxOE0xMiAzYTE0IDE0IDAgMCAwIDAgMThcIi8+PC9zdmc+O1xuICAgIGlmIChraW5kID09PSAncGx1Z2lucycpICByZXR1cm4gPHN2ZyB3aWR0aD1cIjIyXCIgaGVpZ2h0PVwiMjJcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgey4uLnN0cm9rZX0+PHBhdGggZD1cIk05IDN2Nk0xNSAzdjZcIi8+PHBhdGggZD1cIk01IDloMTR2NmE0IDQgMCAwIDEtNCA0aC0xdjNNOSAxOXYzXCIvPjwvc3ZnPjtcbiAgICByZXR1cm4gbnVsbDtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogUHN5IENoYXJ0IFNldHRpbmcgLS0gRlVMTCBQQUdFLCBsaXZlIHNrZWxldG9uIHJlc3BvbmRzIHRvIGNvbnRyb2xzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5mdW5jdGlvbiBQc3lDaGFydFNldHRpbmdQYWdlKHsgY2ZnLCBzZXRDZmcsIG9uQmFjaywgb25TYXZlIH0pIHtcbiAgICBjb25zdCB1cGRhdGUgPSAoaywgdikgPT4gc2V0Q2ZnKGMgPT4gKHsuLi5jLCBba106dn0pKTtcblxuICAgIC8qIE9uIG1vdW50OiBoeWRyYXRlIGZyb20gdGhlIFNBTUUgbG9jYWxTdG9yYWdlIGtleSB0aGUgZGFzaGJvYXJkIHJlYWRzXG4gICAgICogKGByZWQ1X3N3ZWV0X3Nwb3RfcmFuZ2VgKSBwbHVzIHRoZSBwcmVzZXQgaWQgKGByZWQ1X3JoX3ByZXNldGApIHNvXG4gICAgICogdGhlIGRyb3Bkb3duIGxhYmVsIHN0YXlzIGNvbnNpc3RlbnQgd2l0aCB0aGUgc2xpZGVyIHZhbHVlcyBhY3Jvc3NcbiAgICAgKiByZWxvYWRzLiAgSWYgdGhlIG9wZXJhdG9yIGhhcyBhbHJlYWR5IHR1bmVkIHRoZSBSSCBiYW5kIG9uIHRoZVxuICAgICAqIGRhc2hib2FyZCwgdGhlIHNldHVwIHdhbGsgc3RhcnRzIGZyb20gdGhvc2UgdmFsdWVzLiAqL1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByYXcgICAgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVkNV9zd2VldF9zcG90X3JhbmdlJyk7XG4gICAgICAgICAgICBjb25zdCBwcmVzZXQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVkNV9yaF9wcmVzZXQnKTtcbiAgICAgICAgICAgIGNvbnN0IHBhdGNoICA9IHt9O1xuICAgICAgICAgICAgaWYgKHJhdykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHAgPSBKU09OLnBhcnNlKHJhdyk7XG4gICAgICAgICAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShwLmxvKSAmJiBOdW1iZXIuaXNGaW5pdGUocC5oaSkgJiYgcC5sbyA8IHAuaGkpIHtcbiAgICAgICAgICAgICAgICAgICAgcGF0Y2gucmhMbyA9IHAubG87XG4gICAgICAgICAgICAgICAgICAgIHBhdGNoLnJoSGkgPSBwLmhpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwcmVzZXQgJiYgUkhfUFJFU0VUUy5maW5kKHggPT4geC5pZCA9PT0gcHJlc2V0KSkge1xuICAgICAgICAgICAgICAgIHBhdGNoLnJoUHJlc2V0ID0gcHJlc2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogVGhlbWUgKyBicmlnaHRuZXNzIOKAlCBzYW1lIGtleXMgYXBwLmpzIChkYXNoYm9hcmQpIHJlYWRzLiAqL1xuICAgICAgICAgICAgY29uc3QgdGggPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVkNS50aGVtZScpO1xuICAgICAgICAgICAgaWYgKHRoID09PSAnbGlnaHQnIHx8IHRoID09PSAnZGFyaycpIHBhdGNoLnRoZW1lID0gdGg7XG4gICAgICAgICAgICBjb25zdCBkbCA9IHBhcnNlRmxvYXQobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlZDUuZGFya0xldmVsJykpO1xuICAgICAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShkbCkgJiYgZGwgPj0gMS41ICYmIGRsIDw9IDMuMCkgcGF0Y2guZGFya0xldmVsID0gZGw7XG4gICAgICAgICAgICAvKiBUZW1wZXJhdHVyZSBheGlzIHJhbmdlIOKAlCB3cml0dGVuIGJ5IHRoaXMgc2FtZSBwYWdlJ3Mgc2F2ZVxuICAgICAgICAgICAgICogaGFuZGxlcjsgbG9hZCBpdCBoZXJlIHNvIHJlb3BlbmluZyB0aGUgc2V0dXAgd2FsayBzaG93cyB0aGVcbiAgICAgICAgICAgICAqIGN1cnJlbnQgZGFzaGJvYXJkIGF4aXMgaW5zdGVhZCBvZiBhbHdheXMgZGVmYXVsdGluZyB0byAtMTUuLjUwLiAqL1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0clJhdyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWQ1X3RlbXBfcmFuZ2UnKTtcbiAgICAgICAgICAgICAgICBpZiAodHJSYXcpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHIgPSBKU09OLnBhcnNlKHRyUmF3KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZSh0ci5taW4pICYmIE51bWJlci5pc0Zpbml0ZSh0ci5tYXgpICYmIHRyLm1pbiA8IHRyLm1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF0Y2gudExvID0gdHIubWluO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF0Y2gudEhpID0gdHIubWF4O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBpZ25vcmUgKi8gfVxuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKHBhdGNoKS5sZW5ndGgpIHNldENmZyhjID0+ICh7Li4uYywgLi4ucGF0Y2h9KSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogaWdub3JlICovIH1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaG9va3MvZXhoYXVzdGl2ZS1kZXBzXG4gICAgfSwgW10pO1xuXG4gICAgLyogT24gc2F2ZTogcGVyc2lzdCB0aGUgUkggYmFuZCB0byBsb2NhbFN0b3JhZ2Ugc28gdGhlIGRhc2hib2FyZCdzXG4gICAgICogc3dlZXQtc3BvdCBwb2x5Z29uIHBpY2tzIGl0IHVwIG9uIG5leHQgbG9hZC4gIEFsc28gcGVyc2lzdCB0aGUgdmVudWVcbiAgICAgKiBwcmVzZXQgaWQgKGZvciBmdXR1cmUgXCJzaG93IHByZXNldCBuYW1lIG9uIGRhc2hib2FyZFwiIGZlYXR1cmVzKS4gKi9cbiAgICBjb25zdCBwZXJzaXN0QW5kU2F2ZSA9ICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1X3N3ZWV0X3Nwb3RfcmFuZ2UnLFxuICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHsgbG86IGNmZy5yaExvLCBoaTogY2ZnLnJoSGkgfSkpO1xuICAgICAgICAgICAgaWYgKGNmZy5yaFByZXNldCkge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1X3JoX3ByZXNldCcsIGNmZy5yaFByZXNldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBUaGVtZSArIGJyaWdodG5lc3Mg4oCUIHdyaXR0ZW4gdG8gdGhlIFNBTUUga2V5cyB0aGUgZGFzaGJvYXJkXG4gICAgICAgICAgICAgKiAoYXBwLmpzIGxpbmVzIDU3LTU4IGFuZCA4NC05NykgcmVhZHMgYXMgaXRzIHVzZVN0YXRlIGxhenlcbiAgICAgICAgICAgICAqIGluaXRpYWxpc2VyLCBzbyB0aGUgY2hvc2VuIHRoZW1lIHRha2VzIGVmZmVjdCBvbiBuZXh0IGRhc2hib2FyZFxuICAgICAgICAgICAgICogbG9hZC4gIGFwcC5qcyB0cmVhdHMgZGFya0xldmVsID49IDMuMCBhcyBsaWdodC1tb2RlIHRyaWdnZXIuICovXG4gICAgICAgICAgICBpZiAoY2ZnLnRoZW1lID09PSAnbGlnaHQnIHx8IGNmZy50aGVtZSA9PT0gJ2RhcmsnKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDUudGhlbWUnLCBjZmcudGhlbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShjZmcuZGFya0xldmVsKSkge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1LmRhcmtMZXZlbCcsIFN0cmluZyhjZmcuZGFya0xldmVsKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBUZW1wZXJhdHVyZSBheGlzIHJhbmdlIOKAlCBkcml2ZXMgdGhlIGRhc2hib2FyZCdzIHBzeSBjaGFydFxuICAgICAgICAgICAgICogWCBheGlzIChgdGVtcFJhbmdlLm1pbi9tYXhgIGluIGFwcC5qcykuICBXZSB3cml0ZSB0aGUgc2FtZVxuICAgICAgICAgICAgICogc2hhcGUgYXBwLmpzIHJlYWRzIChge21pbiwgbWF4fWApIHNvIGl0cyBsYXp5IHVzZVN0YXRlIGluaXRcbiAgICAgICAgICAgICAqIHBpY2tzIGl0IHVwIG9uIG5leHQgbG9hZCwgQU5EIGRpc3BhdGNoIGEgY3VzdG9tIGV2ZW50IHNvXG4gICAgICAgICAgICAgKiBhbnkgb3BlbiBkYXNoYm9hcmQgdGFiIHVwZGF0ZXMgbGl2ZSB3aXRob3V0IGEgcmVmcmVzaC4gKi9cbiAgICAgICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUoY2ZnLnRMbykgJiYgTnVtYmVyLmlzRmluaXRlKGNmZy50SGkpICYmIGNmZy50TG8gPCBjZmcudEhpKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDVfdGVtcF9yYW5nZScsXG4gICAgICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHsgbWluOiBjZmcudExvLCBtYXg6IGNmZy50SGkgfSkpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncjUtdGVtcC1yYW5nZS1jaGFuZ2UnLCB7XG4gICAgICAgICAgICAgICAgICAgIGRldGFpbDogeyBtaW46IGNmZy50TG8sIG1heDogY2ZnLnRIaSB9XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdyNS1yaC1iYW5kLWNoYW5nZScsIHtcbiAgICAgICAgICAgICAgICBkZXRhaWw6IHsgbG86IGNmZy5yaExvLCBoaTogY2ZnLnJoSGkgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdbc2V0dXAgd2Fsa10gcHN5IGNoYXJ0IHNhdmVkIC0+IFJIJywgY2ZnLnJoTG8sICctJywgY2ZnLnJoSGksXG4gICAgICAgICAgICAgICAgICAgICAgICAgJyUgVC1heGlzJywgY2ZnLnRMbywgJy4uJywgY2ZnLnRIaSwgJ8KwQyBwcmVzZXQ9JywgY2ZnLnJoUHJlc2V0KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdbc2V0dXAgd2Fsa10gY291bGQgbm90IHBlcnNpc3QgcHN5IHNldHRpbmdzOicsIGUpO1xuICAgICAgICB9XG4gICAgICAgIG9uU2F2ZSgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1pbi1oLXNjcmVlbiBmbGV4IGZsZXgtY29sXCI+XG4gICAgICAgICAgICB7LyogaGVhZGVyICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcHgtNiBweS00IGJvcmRlci1iIGJvcmRlci1zbGF0ZS04MDBcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQmFja31cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNDAwIGhvdmVyOnRleHQtd2hpdGUgdGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2tcIj5cbiAgICAgICAgICAgICAgICAgICAg4oaQIEJhY2sgdG8gc2V0dXBcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwidGV4dC1zbSB1cHBlcmNhc2UgdHJhY2tpbmctWzAuM2VtXSBmb250LWJsYWNrIHRleHQtaW5kaWdvLTQwMFwiPlBzeSBDaGFydCBTZXR0aW5nPC9oMT5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3BlcnNpc3RBbmRTYXZlfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtNSBweS0yIHJvdW5kZWQtbGcgYmctaW5kaWdvLTYwMCBob3ZlcjpiZy1pbmRpZ28tNTAwIHRleHQtd2hpdGUgdGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2tcIj5cbiAgICAgICAgICAgICAgICAgICAgU2F2ZSAmIHJldHVybiDinJNcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogYm9keSDigJQgY2hhcnQgbGVmdCwgY29udHJvbHMgcmlnaHQgKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMSBncmlkIGdyaWQtY29scy0xIGxnOmdyaWQtY29scy1bMWZyXzM2MHB4XSBnYXAtNCBwLTYgbWF4LXctN3hsIG14LWF1dG8gdy1mdWxsXCI+XG4gICAgICAgICAgICAgICAgPFBzeVNrZWxldG9uIGNmZz17Y2ZnfSAvPlxuICAgICAgICAgICAgICAgIDxQc3lDb250cm9sUGFuZWwgY2ZnPXtjZmd9IHVwZGF0ZT17dXBkYXRlfSBzZXRDZmc9e3NldENmZ30gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG4vKiBSSCBiYW5kIHByZXNldHMg4oCUIHJlY29nbmlzZWQgaW5kdXN0cnkgc3RhbmRhcmRzIGZvciBlYWNoIHZlbnVlIHR5cGUuXG4gKiBTb3VyY2VzOiBBU0hSQUUgNTUgKGNvbWZvcnQpLCBBU0hSQUUgMTcwIChoZWFsdGhjYXJlKSxcbiAqIEFBTS9OUFMvU21pdGhzb25pYW4gZ3VpZGFuY2UgKGNvbGxlY3Rpb25zKSwgQ0lCU0UgVE00MCAobGlicmFyaWVzKS4gKi9cbmNvbnN0IFJIX1BSRVNFVFMgPSBbXG4gICAgeyBpZDonY3VzdG9tJywgICAgICAgICAgbGFiZWw6J0N1c3RvbSAobWFudWFsKScsICAgICAgICAgICAgICAgICBsbzpudWxsLCBoaTpudWxsLCBub3RlOicnIH0sXG4gICAgeyBpZDonb2ZmaWNlJywgICAgICAgICAgbGFiZWw6J09mZmljZScsICAgICAgICAgICAgICAgICAgICAgICAgICBsbzozMCwgICBoaTo2MCwgICBub3RlOidBU0hSQUUgNTUgY29tZm9ydCcgICAgICAgICAgICAgICAgICB9LFxuICAgIHsgaWQ6J211c2V1bScsICAgICAgICAgIGxhYmVsOidNdXNldW0nLCAgICAgICAgICAgICAgICAgICAgICAgICAgbG86NDAsICAgaGk6NTUsICAgbm90ZTonQUFNIGNvbGxlY3Rpb24gcHJlc2VydmF0aW9uJyAgICAgICAgfSxcbiAgICB7IGlkOidob3RlbCcsICAgICAgICAgICBsYWJlbDonSG90ZWwgZ3Vlc3Qgcm9vbScsICAgICAgICAgICAgICAgIGxvOjMwLCAgIGhpOjYwLCAgIG5vdGU6J2dlbmVyYWwgb2NjdXBhbnQgY29tZm9ydCcgICAgICAgICAgIH0sXG4gICAgeyBpZDonbGlicmFyeScsICAgICAgICAgbGFiZWw6J0xpYnJhcnkgLyBBcmNoaXZlJywgICAgICAgICAgICAgICBsbzo0MCwgICBoaTo1NSwgICBub3RlOidwYXBlciAmIGJpbmRpbmcgcHJlc2VydmF0aW9uJyAgICAgICB9LFxuICAgIHsgaWQ6J2hvc3BpdGFsJywgICAgICAgIGxhYmVsOidIb3NwaXRhbCAoZ2VuZXJhbCknLCAgICAgICAgICAgICAgbG86MzAsICAgaGk6NjAsICAgbm90ZTonQVNIUkFFIDE3MCBwYXRpZW50IGFyZWFzJyAgICAgICAgICAgfSxcbiAgICB7IGlkOidsZWN0dXJlJywgICAgICAgICBsYWJlbDonTGVjdHVyZSBoYWxsJywgICAgICAgICAgICAgICAgICAgIGxvOjMwLCAgIGhpOjYwLCAgIG5vdGU6J2hpZ2ggb2NjdXBhbmN5IGNvbWZvcnQnICAgICAgICAgICAgIH0sXG4gICAgeyBpZDonY29uY2VydCcsICAgICAgICAgbGFiZWw6J0NvbmNlcnQgaGFsbCcsICAgICAgICAgICAgICAgICAgICBsbzo0MCwgICBoaTo1NSwgICBub3RlOidpbnN0cnVtZW50IHR1bmluZyBzdGFiaWxpdHknICAgICAgICB9LFxuICAgIHsgaWQ6J21lZXRpbmcnLCAgICAgICAgIGxhYmVsOidNZWV0aW5nIHJvb20nLCAgICAgICAgICAgICAgICAgICAgbG86MzAsICAgaGk6NjAsICAgbm90ZTonc21hbGwgZ3JvdXAgY29tZm9ydCcgICAgICAgICAgICAgICAgfSxcbiAgICB7IGlkOidleGhpYml0aW9uJywgICAgICBsYWJlbDonRXhoaWJpdGlvbiBoYWxsJywgICAgICAgICAgICAgICAgIGxvOjQwLCAgIGhpOjU1LCAgIG5vdGU6J21peGVkIGFydCAvIGFydGlmYWN0IGRpc3BsYXknICAgICAgIH0sXG5dO1xuXG4vKiBSZWFsIHBzeSBjaGFydCDigJQgdXNlcyB0aGUgU0FNRSBnZXRXICsgR0lWT05JX0NPTE9SUyArIHBvbHlnb24gbWF0aCBhcyB0aGVcbiAqIHByb2R1Y3Rpb24gZGFzaGJvYXJkLiAgU291cmNlIG9mIHRydXRoOiAganMvcHN5Y2hyb21ldHJpYy5qcyAgYW5kIHRoZVxuICogcmVuZGVyR2l2b25pT3ZlcmxheSgpIGJsb2NrIGF0IGFwcC5qczoxNjQxLTE3MjIuXG4gKiBBbnl0aGluZyB5b3UgY2hhbmdlIGluIHRob3NlIGZpbGVzIE1VU1QgYmUgbWlycm9yZWQgaGVyZS4gKi9cbmZ1bmN0aW9uIFBzeVNrZWxldG9uKHsgY2ZnIH0pIHtcbiAgICAvKiBDYW52YXMgKyBwYWRkaW5nICovXG4gICAgY29uc3QgVyA9IDc2MCwgSCA9IDQ4MDtcbiAgICBjb25zdCBwYWQgPSB7IGxlZnQ6IDU2LCByaWdodDogNDAsIHRvcDogMjgsIGJvdHRvbTogNTYgfTtcbiAgICBjb25zdCBncmlkVyA9IFcgLSBwYWQubGVmdCAtIHBhZC5yaWdodDtcbiAgICBjb25zdCBncmlkSCA9IEggLSBwYWQudG9wICAtIHBhZC5ib3R0b207XG5cbiAgICBjb25zdCBUX01JTiA9IGNmZy50TG8sIFRfTUFYID0gY2ZnLnRIaTtcbiAgICBjb25zdCBXX01JTiA9IDAsICAgICAgIFdfTUFYID0gMC4wMzA7ICAgICAgICAgIC8vIGtnL2tnXG5cbiAgICAvKiBheGlzIHNjYWxlcyAtLSBtYXRjaCB0aGUgbGl2ZSBkYXNoYm9hcmQgKi9cbiAgICBjb25zdCB4ICA9ICh0KSA9PiBwYWQubGVmdCArICgodCAtIFRfTUlOKSAvIChUX01BWCAtIFRfTUlOKSkgKiBncmlkVztcbiAgICBjb25zdCB5ICA9ICh3KSA9PiBwYWQudG9wICArICgxIC0gKHcgLSBXX01JTikgLyAoV19NQVggLSBXX01JTikpICogZ3JpZEg7XG4gICAgY29uc3QgX2dldFcgPSAodHlwZW9mIGdldFcgPT09ICdmdW5jdGlvbicpID8gZ2V0VyA6ICgodCwgcmgpID0+IDApO1xuXG4gICAgY29uc3Qgc2FmZVB0cyA9IChhcnIpID0+IGFyci5tYXAocCA9PiBgJHsoeChwWzBdKXx8MCkudG9GaXhlZCgyKX0sJHsoeShwWzFdKXx8MCkudG9GaXhlZCgyKX1gKS5qb2luKCcgJyk7XG5cbiAgICAvKiAtLS0tIEdpdm9uaSBwb2x5Z29ucyAtLSBDT1BJRUQgVkVSQkFUSU0gZnJvbSBhcHAuanM6MTY0My0xNjY5IC0tLS0gKi9cbiAgICBjb25zdCByaDgwID0gW107IGZvciAobGV0IHQ9MjA7IHQ8PTI1OyB0Kz0wLjUpIHJoODAucHVzaChbdCwgX2dldFcodCwgODApXSk7XG4gICAgY29uc3QgcmgxMDA9IFtdOyBmb3IgKGxldCB0PTIwOyB0PD0yNzsgdCs9MC41KSByaDEwMC5wdXNoKFt0LCBfZ2V0Vyh0LCAxMDApXSk7XG4gICAgY29uc3QgcmgyMExpbmUgPSBbXTsgZm9yIChsZXQgdD0zMjsgdD49MjA7IHQtPTAuNSkgcmgyMExpbmUucHVzaChbdCwgX2dldFcodCwgMjApXSk7XG4gICAgY29uc3QgcmgyMF9DWiAgPSBbXTsgZm9yIChsZXQgdD0yNzsgdD49MjA7IHQtPTAuNSkgcmgyMF9DWi5wdXNoKFt0LCBfZ2V0Vyh0LCAyMCldKTtcbiAgICBjb25zdCBDWiAgID0gWy4uLnJoODAsIFsyNywgX2dldFcoMjcsIDUwKV0sIFsyNywgX2dldFcoMjcsIDIwKV0sIC4uLnJoMjBfQ1pdO1xuXG4gICAgY29uc3QgcmhIaV90b3AgPSBbXTsgZm9yIChsZXQgdHQ9MjA7IHR0PD0yNzsgdHQrPTAuNSkgcmhIaV90b3AucHVzaChbdHQsIF9nZXRXKHR0LCBjZmcucmhIaSldKTtcbiAgICBjb25zdCByaExvX2JvdCA9IFtdOyBmb3IgKGxldCB0dD0yNzsgdHQ+PTIwOyB0dC09MC41KSByaExvX2JvdC5wdXNoKFt0dCwgX2dldFcodHQsIGNmZy5yaExvKV0pO1xuICAgIGNvbnN0IFNXRUVUID0gWy4uLnJoSGlfdG9wLCAuLi5yaExvX2JvdF07XG5cbiAgICBjb25zdCBOViAgID0gWy4uLnJoMTAwLCBbMzIsIDE1LjQvMTAwMF0sIFszMiwgNi4yLzEwMDBdLCAuLi5yaDIwTGluZV07XG4gICAgY29uc3QgTWFzcyA9IFsuLi5yaDgwLCBbMzMsIDE2LzEwMDBdLCBbMzcsIF9nZXRXKDM3LCAzMCldLCBbMzcsIDMvMTAwMF0sIFsyMCwgX2dldFcoMjAsIDIwKV1dO1xuICAgIGNvbnN0IE1DViAgPSBbLi4ucmg4MCwgWzQwLCAxNi8xMDAwXSwgWzQ0LCBfZ2V0Vyg0NCwgMjApXSwgWzQ0LCAzLzEwMDBdLCBbMjAsIF9nZXRXKDIwLCAyMCldXTtcbiAgICBjb25zdCBFVkFQID0gWy4uLnJoODAsIFsyNSwgMTYvMTAwMF0sIFszNiwgX2dldFcoMzYsIDMwKV0sIFszOSwgX2dldFcoMzksIDIwKV0sXG4gICAgICAgICAgICAgICAgICBbNDEsIF9nZXRXKDQxLCAxMCldLCBbNDEsIDBdLCBbMjcuMiwgMF0sIFsyMCwgX2dldFcoMjAsIDIwKV1dO1xuXG4gICAgY29uc3Qgd2ludGVyUkg4MCA9IFtdOyBmb3IgKGxldCB0PTE4OyB0PD0xOS41OyB0Kz0wLjUpIHdpbnRlclJIODAucHVzaChbdCwgX2dldFcodCwgODApXSk7XG4gICAgY29uc3Qgd2ludGVyUkgyMCA9IFtdOyBmb3IgKGxldCB0PTE5LjU7IHQ+PTE4OyB0LT0wLjUpIHdpbnRlclJIMjAucHVzaChbdCwgX2dldFcodCwgMjApXSk7XG4gICAgY29uc3QgV0lOVEVSID0gWy4uLndpbnRlclJIODAsIC4uLndpbnRlclJIMjBdO1xuXG4gICAgLyogUkggaXNvcGxldGggY3VydmVzIGZvciB0aGUgY2hhcnQgZ3JpZCAqL1xuICAgIGNvbnN0IGlzb3BsZXRocyA9IFsyMCwgNDAsIDYwLCA4MCwgMTAwXTtcblxuICAgIC8qIFRoZW1lIHBhbGV0dGUg4oCUIGRyaXZlcyB0aGUgbGl2ZSBwcmV2aWV3IHNvIHRoZSBkaW0vbGlnaHQgY29udHJvbHNcbiAgICAgKiBoYXZlIHZpc2libGUgZmVlZGJhY2sgcmlnaHQgb24gdGhlIGNoYXJ0LiAgSW4gZGltL2RhcmsgbW9kZSB3ZSBhbHNvXG4gICAgICogYXBwbHkgYSBDU1MgYnJpZ2h0bmVzcyBmaWx0ZXIgbWFwcGVkIGZyb20gY2ZnLmRhcmtMZXZlbCAoMS41IC4uIDIuOFxuICAgICAqIOKGkiAwLjYgLi4gMS40KSBzbyB0aGUgdXNlciBjYW4gU0VFIHRoZSBicmlnaHRuZXNzIHNsaWRlciB3b3JraW5nLiAqL1xuICAgIGNvbnN0IGlzTGlnaHQgPSBjZmcudGhlbWUgPT09ICdsaWdodCc7XG4gICAgY29uc3QgcGFsZXR0ZSA9IGlzTGlnaHRcbiAgICAgICAgPyB7IGJnOicjZjhmYWZjJywgZ3JpZDonI2NiZDVlMScsIHRpY2s6JyM0NzU1NjknLCBheGlzOicjMWUyOTNiJyxcbiAgICAgICAgICAgIHBhbmVsQmc6J3JnYmEoMjQ4LDI1MCwyNTIsMC44NSknLCBwYW5lbEJvcmRlcjonI2NiZDVlMScsXG4gICAgICAgICAgICBwaWxsQmc6JyNlMmU4ZjAnLCBwaWxsRmc6JyM0NzU1NjknLCBtZXRhRmc6JyM2NDc0OGInIH1cbiAgICAgICAgOiB7IGJnOicjMGIxMjIwJywgZ3JpZDonIzFlMjkzYicsIHRpY2s6JyM5NGEzYjgnLCBheGlzOicjY2JkNWUxJyxcbiAgICAgICAgICAgIHBhbmVsQmc6J3JnYmEoMTUsMjMsNDIsMC42KScsIHBhbmVsQm9yZGVyOicjMWUyOTNiJyxcbiAgICAgICAgICAgIHBpbGxCZzonIzFlMjkzYicsIHBpbGxGZzonIzk0YTNiOCcsIG1ldGFGZzonIzY0NzQ4YicgfTtcbiAgICBjb25zdCBkaW1GaWx0ZXIgPSBpc0xpZ2h0XG4gICAgICAgID8gJ25vbmUnXG4gICAgICAgIDogYGJyaWdodG5lc3MoJHsoTWF0aC5tYXgoMS41LCBNYXRoLm1pbigyLjgsIGNmZy5kYXJrTGV2ZWwgfHwgMi4wKSkgLyAyLjApLnRvRml4ZWQoMil9KWA7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdW5kZWQtMnhsIHAtNCBib3JkZXIgdHJhbnNpdGlvbi1jb2xvcnMgZHVyYXRpb24tMzAwXCJcbiAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6IHBhbGV0dGUucGFuZWxCZywgYm9yZGVyQ29sb3I6IHBhbGV0dGUucGFuZWxCb3JkZXJ9fT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIG1iLTNcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJwaWxsXCIgc3R5bGU9e3tiYWNrZ3JvdW5kOnBhbGV0dGUucGlsbEJnLCBjb2xvcjpwYWxldHRlLnBpbGxGZ319PlBTWUNIUk9NRVRSSUMgQ0hBUlQgwrcgbGl2ZSBwcmV2aWV3PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIGZvbnQtbW9ub1wiIHN0eWxlPXt7Y29sb3I6cGFsZXR0ZS5tZXRhRmd9fT57VF9NSU59wrBDIOKGkiB7VF9NQVh9wrBDICDCtyAge2NmZy5yaExvfeKAk3tjZmcucmhIaX0lIFJIPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8c3ZnIHZpZXdCb3g9e2AwIDAgJHtXfSAke0h9YH0gY2xhc3NOYW1lPVwidy1mdWxsIGgtYXV0byB0cmFuc2l0aW9uLVtmaWx0ZXJdIGR1cmF0aW9uLTMwMFwiXG4gICAgICAgICAgICAgICAgIHN0eWxlPXt7YmFja2dyb3VuZDogcGFsZXR0ZS5iZywgYm9yZGVyUmFkaXVzOjgsIGZpbHRlcjogZGltRmlsdGVyfX0+XG4gICAgICAgICAgICAgICAgey8qIC0tLS0gZ3JpZDogdmVydGljYWwgVCBsaW5lcywgaG9yaXpvbnRhbCBXIGxpbmVzIC0tLS0gKi99XG4gICAgICAgICAgICAgICAge0FycmF5LmZyb20oe2xlbmd0aDoxMX0pLm1hcCgoXyxpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBUX01JTiArIChpLzEwKSAqIChUX01BWCAtIFRfTUlOKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxnIGtleT17J3Z0JytpfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17eCh0KX0geTE9e3BhZC50b3B9IHgyPXt4KHQpfSB5Mj17cGFkLnRvcCtncmlkSH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9e3BhbGV0dGUuZ3JpZH0gc3Ryb2tlV2lkdGg9XCIwLjZcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCh0KX0geT17cGFkLnRvcCtncmlkSCsxNn0gZm9udFNpemU9XCI5LjVcIiBmaWxsPXtwYWxldHRlLnRpY2t9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiPnt0LnRvRml4ZWQoMCl9PC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIHtBcnJheS5mcm9tKHtsZW5ndGg6N30pLm1hcCgoXyxpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHcgPSBXX01JTiArIChpLzYpICogKFdfTUFYIC0gV19NSU4pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGcga2V5PXsnaHcnK2l9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXtwYWQubGVmdH0geTE9e3kodyl9IHgyPXtwYWQubGVmdCtncmlkV30geTI9e3kodyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPXtwYWxldHRlLmdyaWR9IHN0cm9rZVdpZHRoPVwiMC42XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3BhZC5sZWZ0LTh9IHk9e3kodykrM30gZm9udFNpemU9XCI5LjVcIiBmaWxsPXtwYWxldHRlLnRpY2t9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cImVuZFwiPnsodyoxMDAwKS50b0ZpeGVkKDApfTwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICB7LyogLS0tLSBSSCBpc29wbGV0aHMgKGN1cnZlcykgLS0tLSAqL31cbiAgICAgICAgICAgICAgICB7aXNvcGxldGhzLm1hcChyaCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHB0cyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB0ID0gVF9NSU47IHQgPD0gVF9NQVg7IHQgKz0gMC41KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB3dyA9IF9nZXRXKHQsIHJoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3dyA+PSBXX01JTiAmJiB3dyA8PSBXX01BWCkgcHRzLnB1c2goW3QsIHd3XSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxnIGtleT17J2lzbycrcmh9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5bGluZSBwb2ludHM9e3NhZmVQdHMocHRzKX0gZmlsbD1cIm5vbmVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9e3JoID09PSAxMDAgPyAnIzYzNjZmMScgOiAnI2VjNDg5OTU1J30gc3Ryb2tlV2lkdGg9XCIwLjhcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2VEYXNoYXJyYXk9e3JoID09PSAxMDAgPyAnJyA6ICczLDMnfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3B0cy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eChwdHNbTWF0aC5mbG9vcihwdHMubGVuZ3RoKjAuNjUpXVswXSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk9e3kocHRzW01hdGguZmxvb3IocHRzLmxlbmd0aCowLjY1KV1bMV0pIC0gNH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU9XCI5XCIgZmlsbD1cIiNlYzQ4OTk5OVwiIGZvbnRXZWlnaHQ9XCI3MDBcIj57cmh9JTwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pfVxuXG4gICAgICAgICAgICAgICAgey8qIC0tLS0gR2l2b25pIG92ZXJsYXkgKGNvcGllZCB2ZXJiYXRpbSBmcm9tIGFwcC5qcyByZW5kZXIgb3JkZXIpIC0tLS0gKi99XG4gICAgICAgICAgICAgICAge2NmZy5naXZvbmkgJiYgKFxuICAgICAgICAgICAgICAgICAgICA8ZyBjbGFzc05hbWU9XCJwb2ludGVyLWV2ZW50cy1ub25lXCIgb3BhY2l0eT1cIjAuOVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3goNDApfSB5MT17eSgxNi8xMDAwKX0geDI9e3goNTApfSB5Mj17eSgxNi8xMDAwKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cIiM2MzY2ZjFcIiBzdHJva2VXaWR0aD1cIjEuNVwiIHN0cm9rZURhc2hhcnJheT1cIjQsNFwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXt4KDUwKX0geTE9e3koMTYvMTAwMCl9IHgyPXt4KDUwKX0geTI9e3koMCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCIjNjM2NmYxXCIgc3Ryb2tlV2lkdGg9XCIxLjVcIiBzdHJva2VEYXNoYXJyYXk9XCI0LDRcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17eCg0MSl9IHkxPXt5KDApfSB4Mj17eCg1MCl9IHkyPXt5KDApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiIzYzNjZmMVwiIHN0cm9rZVdpZHRoPVwiMS41XCIgc3Ryb2tlRGFzaGFycmF5PVwiNCw0XCIvPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoTUNWKX0gIGZpbGw9XCIjZWM0ODk5XCIgZmlsbE9wYWNpdHk9XCIwLjA1XCIgc3Ryb2tlPVwiI2VjNDg5OVwiIHN0cm9rZVdpZHRoPVwiMVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhNYXNzKX0gZmlsbD1cIiM4YjVjZjZcIiBmaWxsT3BhY2l0eT1cIjAuMDVcIiBzdHJva2U9XCIjOGI1Y2Y2XCIgc3Ryb2tlV2lkdGg9XCIxXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKEVWQVApfSBmaWxsPVwiIzA2YjZkNFwiIGZpbGxPcGFjaXR5PVwiMC4wOFwiIHN0cm9rZT1cIiMwNmI2ZDRcIiBzdHJva2VXaWR0aD1cIjFcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoTlYpfSAgIGZpbGw9XCIjZjU5ZTBiXCIgZmlsbE9wYWNpdHk9XCIwLjA1XCIgc3Ryb2tlPVwiI2Y1OWUwYlwiIHN0cm9rZVdpZHRoPVwiMVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhDWil9ICAgZmlsbD1cIiMxMGI5ODFcIiBmaWxsT3BhY2l0eT1cIjAuMTVcIiBzdHJva2U9XCIjMTBiOTgxXCIgc3Ryb2tlV2lkdGg9XCIxLjJcIi8+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBTd2VldC1zcG90IGJhbmQsIGNsaXBwZWQgdG8gQ1ogKi99XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGVmcz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y2xpcFBhdGggaWQ9XCJjei1jbGlwLXdhbGtcIiBjbGlwUGF0aFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKENaKX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvY2xpcFBhdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2RlZnM+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoU1dFRVQpfSBjbGlwUGF0aD1cInVybCgjY3otY2xpcC13YWxrKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxsPVwiIzA1OTY2OVwiIGZpbGxPcGFjaXR5PVwiMC4zMlwiIHN0cm9rZT1cIiMwNDc4NTdcIiBzdHJva2VXaWR0aD1cIjAuOFwiIHN0cm9rZURhc2hhcnJheT1cIjMsMlwiLz5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKFdJTlRFUil9IGZpbGw9XCIjM2I4MmY2XCIgZmlsbE9wYWNpdHk9XCIwLjE1XCIgc3Ryb2tlPVwibm9uZVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXt4KDE5KX0geTE9e3BhZC50b3ArMTh9IHgyPXt4KDE5KX0geTI9e3BhZC50b3ArZ3JpZEh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCIjM2I4MmY2XCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlRGFzaGFycmF5PVwiNiw0XCIgb3BhY2l0eT1cIjAuOFwiLz5cblxuICAgICAgICAgICAgICAgICAgICAgICAgey8qIFJlZ2lvbiBsYWJlbHMg4oCUIHNhbWUgY29sb3JzICYgc3Bpcml0IGFzIGxpdmUgY2hhcnQgKi99XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDUwKS0xMH0geT17eSg4LzEwMDApfSBmaWxsPVwiIzYzNjZmMVwiIGZvbnRTaXplPVwiMTBcIiBmb250V2VpZ2h0PVwiOTAwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiB0cmFuc2Zvcm09e2Byb3RhdGUoLTkwLCAke3goNTApLTEwfSwgJHt5KDgvMTAwMCl9KWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nPVwiMlwiPk1FQ0hBTklDQUwgQ09PTElORzwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goNDQpLTJ9IHk9e3koOC8xMDAwKX0gZmlsbD1cIiNlYzQ4OTlcIiBmb250U2l6ZT1cIjlcIiBmb250V2VpZ2h0PVwiOTAwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiB0cmFuc2Zvcm09e2Byb3RhdGUoLTkwLCAke3goNDQpLTJ9LCAke3koOC8xMDAwKX0pYH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc9XCIxLjVcIj5NQVNTIENPT0xJTkc8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDM3KS0xMH0geT17eSg4LzEwMDApfSBmaWxsPVwiIzhiNWNmNlwiIGZvbnRTaXplPVwiOVwiIGZvbnRXZWlnaHQ9XCI5MDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIHRyYW5zZm9ybT17YHJvdGF0ZSgtOTAsICR7eCgzNyktMTB9LCAke3koOC8xMDAwKX0pYH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc9XCIxLjVcIj5NQVNTIENPT0xJTkc8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDM0KX0geT17eSgwLjUvMTAwMCktOH0gZmlsbD1cIiMwNmI2ZDRcIiBmb250U2l6ZT1cIjlcIiBmb250V2VpZ2h0PVwiOTAwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiBsZXR0ZXJTcGFjaW5nPVwiMlwiPkVWQVBPUkFUSVZFPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCgyMy41KX0geT17eShfZ2V0VygyMy41LCA0NSkpfSBmaWxsPVwiIzEwYjk4MVwiIGZvbnRTaXplPVwiMTFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodD1cIjkwMFwiIHRleHRBbmNob3I9XCJtaWRkbGVcIiBsZXR0ZXJTcGFjaW5nPVwiMS41XCI+Q09NRk9SVDwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goMTguNzUpfSB5PXt5KF9nZXRXKDE4Ljc1LCA0NSkpfSBmaWxsPVwiIzNiODJmNlwiIGZvbnRTaXplPVwiMTFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodD1cIjkwMFwiIHRleHRBbmNob3I9XCJtaWRkbGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtPXtgcm90YXRlKC05MCwgJHt4KDE4Ljc1KX0sICR7eShfZ2V0VygxOC43NSwgNDUpKX0pYH0+V0lOVEVSPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCgyMy41KX0geT17eShfZ2V0VygyMy41LCAoY2ZnLnJoTG8rY2ZnLnJoSGkpLzIpKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw9XCIjMDIyYzIyXCIgZm9udFNpemU9XCI4XCIgZm9udFdlaWdodD1cIjkwMFwiIHRleHRBbmNob3I9XCJtaWRkbGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3twYWludE9yZGVyOidzdHJva2UnLCBzdHJva2U6JyNhN2YzZDAnLCBzdHJva2VXaWR0aDonMi41cHgnLCBzdHJva2VMaW5lam9pbjoncm91bmQnfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc9XCIxLjVcIj57Y2ZnLnJoTG99LXtjZmcucmhIaX0lIFJIPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAgICAgIHsvKiBheGlzIGxhYmVscyAqL31cbiAgICAgICAgICAgICAgICA8dGV4dCB4PXtwYWQubGVmdCArIGdyaWRXLzJ9IHk9e0gtMTJ9IGZvbnRTaXplPVwiMTFcIiBmaWxsPXtwYWxldHRlLmF4aXN9XG4gICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGZvbnRXZWlnaHQ9XCI4MDBcIiBsZXR0ZXJTcGFjaW5nPVwiMlwiPkRSWSBCVUxCIFRFTVAgKMKwQyk8L3RleHQ+XG4gICAgICAgICAgICAgICAgPHRleHQgeD17MTZ9IHk9e3BhZC50b3AgKyBncmlkSC8yfSBmb250U2l6ZT1cIjExXCIgZmlsbD17cGFsZXR0ZS5heGlzfVxuICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiBmb250V2VpZ2h0PVwiODAwXCIgbGV0dGVyU3BhY2luZz1cIjJcIlxuICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybT17YHJvdGF0ZSgtOTAgMTYgJHtwYWQudG9wICsgZ3JpZEgvMn0pYH0+SFVNSURJVFkgUkFUSU8gKGcva2cpPC90ZXh0PlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbmZ1bmN0aW9uIFBzeUNvbnRyb2xQYW5lbCh7IGNmZywgdXBkYXRlLCBzZXRDZmcgfSkge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctc2xhdGUtOTAwLzYwIGJvcmRlciBib3JkZXItc2xhdGUtODAwIHJvdW5kZWQtMnhsIHAtNSBzcGFjZS15LTZcIj5cbiAgICAgICAgICAgIHsvKiBUaGVtZSArIGJyaWdodG5lc3MgIC0tIHJlbG9jYXRlZCBmcm9tIHRoZSBkYXNoYm9hcmQgc2lkZWJhciAyMDI2LTA2LTI1LlxuICAgICAgICAgICAgICAgIFR3byBjb250cm9sczogRGFyay9MaWdodCBtb2RlIHRvZ2dsZSwgYW5kIEJyaWdodG5lc3Mgc2xpZGVyIChvbmx5XG4gICAgICAgICAgICAgICAgbWVhbmluZ2Z1bCBpbiBkYXJrIG1vZGUpLiAgTGl2ZSBwcmV2aWV3IGFwcGxpZXMgdG8gdGhlIHN1cnJvdW5kaW5nXG4gICAgICAgICAgICAgICAgY29udHJvbCBwYW5lbCBzbyB0aGUgb3BlcmF0b3IgY2FuIEZFRUwgdGhlIGNoYW5nZSBiZWZvcmUgc2F2aW5nLiAqL31cbiAgICAgICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJwc3ktY2ZnLXRoZW1lLWJsb2NrXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0yXCI+RGlzcGxheSBNb2RlPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC0yIG1iLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cInBzeS1jZmctdGhlbWUtZGFya1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0Q2ZnKGMgPT4gKHsuLi5jLCB0aGVtZTonZGFyaycsIGRhcmtMZXZlbDpNYXRoLm1pbihjLmRhcmtMZXZlbCB8fCAyLjAsIDIuNil9KSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHktMi41IHJvdW5kZWQtbGcgdGV4dC14cyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgYm9yZGVyIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Y2ZnLnRoZW1lID09PSAnZGFyaydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLXNsYXRlLTgwMCBib3JkZXIteWVsbG93LTUwMC83MCB0ZXh0LXllbGxvdy0zMDAgc2hhZG93LWxnIHNoYWRvdy15ZWxsb3ctNTAwLzEwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctc2xhdGUtOTAwLzMwIGJvcmRlci1zbGF0ZS03MDAgdGV4dC1zbGF0ZS01MDAgaG92ZXI6Ymctc2xhdGUtODAwLzYwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIPCfjJkgIERpbSAvIERhcmtcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJwc3ktY2ZnLXRoZW1lLWxpZ2h0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIHRoZW1lOidsaWdodCcsIGRhcmtMZXZlbDozLjB9KSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHktMi41IHJvdW5kZWQtbGcgdGV4dC14cyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgYm9yZGVyIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Y2ZnLnRoZW1lID09PSAnbGlnaHQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1zbGF0ZS0xMDAgYm9yZGVyLXNreS01MDAvNzAgdGV4dC1za3ktNzAwIHNoYWRvdy1sZyBzaGFkb3ctc2t5LTUwMC8xMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLXNsYXRlLTkwMC8zMCBib3JkZXItc2xhdGUtNzAwIHRleHQtc2xhdGUtNTAwIGhvdmVyOmJnLXNsYXRlLTgwMC82MCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICDimIAgIExpZ2h0XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIHsvKiBCcmlnaHRuZXNzIHNsaWRlciDigJQgb25seSBtZWFuaW5nZnVsIHdoZW4gdGhlbWUgPT09ICdkYXJrJyAqL31cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y2ZnLnRoZW1lID09PSAnbGlnaHQnID8gJ29wYWNpdHktNDAgcG9pbnRlci1ldmVudHMtbm9uZScgOiAnJ30+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIG1iLTFcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTUwMFwiPkRpbSBicmlnaHRuZXNzPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIGZvbnQtbW9ubyB0ZXh0LXllbGxvdy0zMDAgdGFidWxhci1udW1zXCI+e01hdGgucm91bmQoKGNmZy5kYXJrTGV2ZWwgfHwgMi4wKSAqIDEwMCl9JTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJwc3ktY2ZnLWRhcmstbGV2ZWxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluPVwiMS41XCIgbWF4PVwiMi44XCIgc3RlcD1cIjAuMDJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2NmZy50aGVtZSA9PT0gJ2xpZ2h0JyA/IDIuMCA6IChjZmcuZGFya0xldmVsIHx8IDIuMCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldENmZyhjID0+ICh7Li4uYywgZGFya0xldmVsOiBwYXJzZUZsb2F0KGUudGFyZ2V0LnZhbHVlKSwgdGhlbWU6J2RhcmsnfSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2UtaW5wdXQgdy1mdWxsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGFjY2VudENvbG9yOicjZmFjYzE1JyB9fS8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbXQtMiBpdGFsaWNcIj5cbiAgICAgICAgICAgICAgICAgICAgQXBwbGllZCB0byB0aGUgd2hvbGUgZGFzaGJvYXJkLiAgRGltIGlzIHJlY29tbWVuZGVkIGZvciBjb250cm9sIHJvb21zOyBMaWdodCBmb3IgZGF5dGltZSB3YWxrLXRocm91Z2hzLlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogR2l2b25pIHRvZ2dsZSAqL31cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0yXCI+R2l2b25pIEVuZ2luZTwvZGl2PlxuICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gdXBkYXRlKCdnaXZvbmknLCAhY2ZnLmdpdm9uaSl9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B3LWZ1bGwgcHktMyByb3VuZGVkLXhsIHRleHQtc20gZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2NmZy5naXZvbmlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1pbmRpZ28tNjAwIHRleHQtd2hpdGUgc2hhZG93LWxnIHNoYWRvdy1pbmRpZ28tNTAwLzMwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLXNsYXRlLTgwMCB0ZXh0LXNsYXRlLTQwMCBib3JkZXIgYm9yZGVyLXNsYXRlLTcwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgIHtjZmcuZ2l2b25pID8gJ0dpdm9uaSBPTicgOiAnR2l2b25pIE9GRid9XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbXQtMiBsZWFkaW5nLXJlbGF4ZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgT3ZlcmxheXMgdGhlIDQgY2xpbWF0ZS1zdHJhdGVneSByZWdpb25zIChDb21mb3J0LCBOYXQgVmVudCwgRXZhcCwgTWVjaCBDb29sKS5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIFJIIHJhbmdlICovfVxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj5SSCBTd2VldC1TcG90IFJhbmdlPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi0zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTUwMCBtYi0xIGJsb2NrXCI+VmVudWUgcHJlc2V0PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dCBjdXJzb3ItcG9pbnRlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2NmZy5yaFByZXNldCB8fCAnY3VzdG9tJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcCA9IFJIX1BSRVNFVFMuZmluZChwID0+IHAuaWQgPT09IGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFwKSByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwLmlkID09PSAnY3VzdG9tJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlKCdyaFByZXNldCcsICdjdXN0b20nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgcmhQcmVzZXQ6cC5pZCwgcmhMbzpwLmxvLCByaEhpOnAuaGl9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtSSF9QUkVTRVRTLm1hcChwID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIGtleT17cC5pZH0gdmFsdWU9e3AuaWR9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cC5sYWJlbH17cC5sbyAhPSBudWxsID8gYCAgwrcgICR7cC5sb30tJHtwLmhpfSUgUkhgIDogJyd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgICAgIHsoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcCA9IFJIX1BSRVNFVFMuZmluZCh4ID0+IHguaWQgPT09IChjZmcucmhQcmVzZXQgfHwgJ2N1c3RvbScpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwICYmIHAubm90ZSA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0xLjUgaXRhbGljXCI+e3Aubm90ZX08L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICApIDogbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfSkoKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zIG1iLTJcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyBmb250LW1vbm8gdGV4dC1zbGF0ZS00MDAgdy0xMFwiPntjZmcucmhMb30lPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPVwiMjBcIiBtYXg9e2NmZy5yaEhpLTV9IHZhbHVlPXtjZmcucmhMb31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0Q2ZnKGMgPT4gKHsuLi5jLCByaExvOitlLnRhcmdldC52YWx1ZSwgcmhQcmVzZXQ6J2N1c3RvbSd9KSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyYW5nZS1pbnB1dCBmbGV4LTFcIi8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtM1wiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtbW9ubyB0ZXh0LXNsYXRlLTQwMCB3LTEwXCI+e2NmZy5yaEhpfSU8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49e2NmZy5yaExvKzV9IG1heD1cIjkwXCIgdmFsdWU9e2NmZy5yaEhpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIHJoSGk6K2UudGFyZ2V0LnZhbHVlLCByaFByZXNldDonY3VzdG9tJ30pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLWlucHV0IGZsZXgtMVwiLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogQXhpcyByYW5nZSAqL31cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0yXCI+VGVtcGVyYXR1cmUgQXhpcyBSYW5nZTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTMgbWItMlwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtbW9ubyB0ZXh0LXNsYXRlLTQwMCB3LTEwXCI+e2NmZy50TG99wrA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49XCItNDBcIiBtYXg9e2NmZy50SGktMTB9IHZhbHVlPXtjZmcudExvfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGUoJ3RMbycsICtlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyYW5nZS1pbnB1dCBmbGV4LTFcIi8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtM1wiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtbW9ubyB0ZXh0LXNsYXRlLTQwMCB3LTEwXCI+e2NmZy50SGl9wrA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49e2NmZy50TG8rMTB9IG1heD1cIjYwXCIgdmFsdWU9e2NmZy50SGl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZSgndEhpJywgK2UudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLWlucHV0IGZsZXgtMVwiLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0yIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgICAgICBDaGFydCB3aWxsIGJlIHJlZHJhd24gd2l0aCB0aGlzIGRyeS1idWxiIHRlbXBlcmF0dXJlIHdpbmRvdy5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib3JkZXItdCBib3JkZXItc2xhdGUtODAwIHB0LTRcIj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBsZWFkaW5nLXJlbGF4ZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgQ2hhbmdlcyBwcmV2aWV3IGxpdmUgaW4gdGhlIHNrZWxldG9uIGNoYXJ0IG9uIHRoZSBsZWZ0LiAgSGl0XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtaW5kaWdvLTQwMCBmb250LWJsYWNrXCI+IFNhdmUgJiByZXR1cm4gPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICBpbiB0aGUgaGVhZGVyIHdoZW4geW91J3JlIGhhcHB5LlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBMb2NhdGlvbiBTZXR0aW5nIC0tIG1vZGFsIHcvIGludGVyYWN0aXZlIExlYWZsZXQgbWFwICsgcmV2ZXJzZSBnZW9jb2RpbmdcbiAqIENsaWNrIGFueXdoZXJlIG9uIHRoZSBtYXAgKG9yIGRyYWcgdGhlIG1hcmtlcikgdG8gc2V0IGxhdC9sb24uXG4gKiBNYW51YWwgbGF0L2xvbiBlZGl0cyByZS1jZW50cmUgdGhlIG1hcmtlci4gIENpdHkgbmFtZSBpcyBhdXRvLXBvcHVsYXRlZFxuICogdmlhIE9wZW5TdHJlZXRNYXAgTm9taW5hdGltIChubyBrZXkgcmVxdWlyZWQsIHJhdGUtbGltaXRlZCB0byB+MSByZXEvcykuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qIERlLWR1cCArIHNhbml0eS1jaGVjayBhIHJhdyBzYXZlZC1sb2NhdGlvbnMgYXJyYXkgKGZyb20gc2VydmVyIG9yXG4gKiBsb2NhbFN0b3JhZ2UpLiAgRHJvcHMgZW50cmllcyBtaXNzaW5nIGEgbmFtZSBvciB3aXRoIG5vbi1maW5pdGUgbGF0L2xvbixcbiAqIGtlZXBzIHRoZSBGSVJTVCBvY2N1cnJlbmNlIG9mIGVhY2ggdW5pcXVlIG5hbWUuICBVc2VkIGJ5IExvY2F0aW9uTW9kYWwnc1xuICogU2l0ZS1uYW1lIGRhdGFsaXN0IGJlbG93LiAqL1xuZnVuY3Rpb24gX25vcm1hbGl6ZUxvY3MoYXJyKSB7XG4gICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQoKTtcbiAgICBjb25zdCBvdXQgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGwgb2YgKGFyciB8fCBbXSkpIHtcbiAgICAgICAgaWYgKCFsIHx8IHR5cGVvZiBsLm5hbWUgIT09ICdzdHJpbmcnKSBjb250aW51ZTtcbiAgICAgICAgY29uc3QgbGF0ID0gK2wubGF0LCBsb24gPSArbC5sb247XG4gICAgICAgIGlmICghTnVtYmVyLmlzRmluaXRlKGxhdCkgfHwgIU51bWJlci5pc0Zpbml0ZShsb24pKSBjb250aW51ZTtcbiAgICAgICAgY29uc3Qga2V5ID0gbC5uYW1lLnRyaW0oKTtcbiAgICAgICAgaWYgKCFrZXkgfHwgc2Vlbi5oYXMoa2V5KSkgY29udGludWU7XG4gICAgICAgIHNlZW4uYWRkKGtleSk7XG4gICAgICAgIG91dC5wdXNoKHsgbmFtZTprZXksIGxhdCwgbG9uIH0pO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xufVxuXG5mdW5jdGlvbiBMb2NhdGlvbk1vZGFsKHsgY2ZnLCBzZXRDZmcsIG9uQ2xvc2UsIG9uU2F2ZSB9KSB7XG4gICAgY29uc3QgbWFwQm94UmVmID0gUmVhY3QudXNlUmVmKG51bGwpO1xuICAgIGNvbnN0IG1hcFJlZiAgICA9IFJlYWN0LnVzZVJlZihudWxsKTtcbiAgICBjb25zdCBtYXJrZXJSZWYgPSBSZWFjdC51c2VSZWYobnVsbCk7XG4gICAgY29uc3QgW2dlb0J1c3ksIHNldEdlb0J1c3ldID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuXG4gICAgLyogLS0tLS0gc2F2ZWQgbG9jYXRpb25zIC0tIG1pcnJvciB3aGF0IHRoZSBEYXNoYm9hcmQncyBXZWF0aGVyIGJ1dHRvbiBzaG93cy5cbiAgICAgKlxuICAgICAqIFRoZSBkYXNoYm9hcmQgcmVhZHMgdGhlbSBmcm9tIGAke0FQSV9VUkx9L2FwaS93ZWF0aGVyLWxvY2F0aW9uYCdzXG4gICAgICogYHNhdmVkYCBhcnJheSBhbmQgbWlycm9ycyB0aGF0IGludG8gbG9jYWxTdG9yYWdlWydzYXZlZFdlYXRoZXJMb2NhdGlvbnMnXVxuICAgICAqIG9uIG1vdW50IChzZWUgcHVibGljL2pzL2Rhc2hib2FyZC9hcHAuanMjaHlkcmF0ZVdlYXRoZXJTdGF0ZSkuICBXZSBkb1xuICAgICAqIHRoZSBTQU1FIHRoaW5nIGhlcmUgc28gdGhlIFNldHVwIFdhbGsncyBTaXRlLW5hbWUgZHJvcGRvd24gc3RheXNcbiAgICAgKiBieXRlLWlkZW50aWNhbCB3aXRoIHRoZSBkYXNoYm9hcmQncyBsb2NhdGlvbiBsaXN0IC0tIGluY2x1ZGluZyB3aGVuIHRoZVxuICAgICAqIG9wZXJhdG9yIHZpc2l0cyBTZXR1cCBXYWxrIEJFRk9SRSBldmVyIG9wZW5pbmcgdGhlIGRhc2hib2FyZCAoZnJlc2hcbiAgICAgKiBkZXZpY2UgY2FzZSB3aGVyZSBsb2NhbFN0b3JhZ2UgaXMgZW1wdHkpLlxuICAgICAqXG4gICAgICogU3RyYXRlZ3k6XG4gICAgICogICAxKSBSZWFkIGxvY2FsU3RvcmFnZSBmaXJzdCAoaW5zdGFudCwgbm8gZmxpY2tlciBpZiBhbHJlYWR5IGh5ZHJhdGVkKS5cbiAgICAgKiAgIDIpIFRoZW4gR0VUIC9hcGkvd2VhdGhlci1sb2NhdGlvbiAoY2Fub25pY2FsLCBjcm9zcy1kZXZpY2Ugc291cmNlKS5cbiAgICAgKiAgIDMpIFdoaWNoZXZlciBpcyBub24tZW1wdHkgd2luczsgc2VydmVyIHdpbnMgdGllcy5cbiAgICAgKlxuICAgICAqIEZyZWUtZm9ybSB0eXBpbmcgaW4gdGhlIGlucHV0IHN0aWxsIHdvcmtzIC0tIHRoZSBkYXRhbGlzdCBpcyBzdWdnZXN0aW9uXG4gICAgICogb25seSwgdGhlIGlucHV0IG5ldmVyIHJlc3RyaWN0cyB0aGUgdmFsdWUuICovXG4gICAgY29uc3QgW3NhdmVkTG9jcywgc2V0U2F2ZWRMb2NzXSA9IFJlYWN0LnVzZVN0YXRlKCgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJhdyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzYXZlZFdlYXRoZXJMb2NhdGlvbnMnKTtcbiAgICAgICAgICAgIGlmICghcmF3KSByZXR1cm4gW107XG4gICAgICAgICAgICBjb25zdCBhcnIgPSBKU09OLnBhcnNlKHJhdyk7XG4gICAgICAgICAgICByZXR1cm4gQXJyYXkuaXNBcnJheShhcnIpID8gX25vcm1hbGl6ZUxvY3MoYXJyKSA6IFtdO1xuICAgICAgICB9IGNhdGNoIChlKSB7IHJldHVybiBbXTsgfVxuICAgIH0pO1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGxldCBjYW5jZWxsZWQgPSBmYWxzZTtcbiAgICAgICAgKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKCcvYXBpL3dlYXRoZXItbG9jYXRpb24nLCB7IGNyZWRlbnRpYWxzOidpbmNsdWRlJywgY2FjaGU6J25vLXN0b3JlJyB9KTtcbiAgICAgICAgICAgICAgICBpZiAoIXIub2spIHJldHVybjtcbiAgICAgICAgICAgICAgICBjb25zdCBqID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2F2ZWQgPSBfbm9ybWFsaXplTG9jcyhBcnJheS5pc0FycmF5KGouc2F2ZWQpID8gai5zYXZlZCA6IFtdKTtcbiAgICAgICAgICAgICAgICBpZiAoY2FuY2VsbGVkKSByZXR1cm47XG4gICAgICAgICAgICAgICAgaWYgKHNhdmVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0U2F2ZWRMb2NzKHNhdmVkKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gTWlycm9yIHRvIGxvY2FsU3RvcmFnZSBzbyB0aGUgZGFzaGJvYXJkIHNlZXMgdGhlIHNhbWUgbGlzdFxuICAgICAgICAgICAgICAgICAgICAvLyBldmVuIGlmIGl0cyBvd24gaHlkcmF0ZSBoYXNuJ3QgcnVuIHlldCB0aGlzIHNlc3Npb24uXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzYXZlZFdlYXRoZXJMb2NhdGlvbnMnLCBKU09OLnN0cmluZ2lmeShzYXZlZCkpOyB9IGNhdGNoIChlKSB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogb2ZmbGluZSAtPiBsb2NhbFN0b3JhZ2UgdmFsdWUgYWxyZWFkeSBpbiBzdGF0ZSAqLyB9XG4gICAgICAgIH0pKCk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7IGNhbmNlbGxlZCA9IHRydWU7IH07XG4gICAgfSwgW10pO1xuXG4gICAgLyogV2hlbiB0aGUgdXNlciBwaWNrcyBhIG5hbWUgZnJvbSB0aGUgZGF0YWxpc3QgKG9yIHR5cGVzIG9uZSB0aGF0XG4gICAgICogZXhhY3RseSBtYXRjaGVzIGEgc2F2ZWQgZW50cnkpLCBwdWxsIGl0cyBsYXQvbG9uIGFuZCByZWNlbnRyZSB0aGVcbiAgICAgKiBtYXAuICBGcmVlLWZvcm0gdHlwaW5nIHN0aWxsIHdvcmtzIC0tIHRoZSBuYW1lIGlzIGp1c3Qga2VwdCBhcyB0aGVcbiAgICAgKiBzaXRlIGxhYmVsLiAgQXZvaWRzIHN1cnByaXNpbmcgdGhlIG9wZXJhdG9yIHdobyB0eXBlcyBcIlBhdmlsaW9uIEJcIlxuICAgICAqIChhIGxhYmVsIHRoZXkgaW52ZW50ZWQpIGFuZCBleHBlY3RzIHRoZSBtYXAgTk9UIHRvIGp1bXAuICovXG4gICAgY29uc3Qgb25TaXRlTmFtZUNoYW5nZSA9IChuZXdOYW1lKSA9PiB7XG4gICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgc2l0ZU5hbWU6bmV3TmFtZX0pKTtcbiAgICAgICAgY29uc3QgaGl0ID0gc2F2ZWRMb2NzLmZpbmQocyA9PiBzLm5hbWUgPT09IG5ld05hbWUpO1xuICAgICAgICBpZiAoaGl0KSB7XG4gICAgICAgICAgICBjb25zdCBsYXQgPSBNYXRoLnJvdW5kKGhpdC5sYXQgKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgICAgIGNvbnN0IGxvbiA9IE1hdGgucm91bmQoaGl0LmxvbiAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBzaXRlTmFtZTpuZXdOYW1lLCBsYXQsIGxvbiwgY2l0eTpuZXdOYW1lfSkpO1xuICAgICAgICAgICAgaWYgKG1hcFJlZi5jdXJyZW50KSBtYXBSZWYuY3VycmVudC5zZXRWaWV3KFtsYXQsIGxvbl0sIDExKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKiAtLS0tLSBzZWFyY2ggc3RhdGUgLS0tLS0gKi9cbiAgICBjb25zdCBbc2VhcmNoUSwgc2V0U2VhcmNoUV0gICAgICAgICA9IFJlYWN0LnVzZVN0YXRlKCcnKTtcbiAgICBjb25zdCBbc2VhcmNoSGl0cywgc2V0U2VhcmNoSGl0c10gICA9IFJlYWN0LnVzZVN0YXRlKFtdKTtcbiAgICBjb25zdCBbc2VhcmNoQnVzeSwgc2V0U2VhcmNoQnVzeV0gICA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBbc2VhcmNoT3Blbiwgc2V0U2VhcmNoT3Blbl0gICA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBzZWFyY2hEZWJvdW5jZVJlZiAgICAgICAgICAgICA9IFJlYWN0LnVzZVJlZihudWxsKTtcblxuICAgIC8qIEZvcndhcmQtZ2VvY29kZTogcXVlcnkgLT4gW3tsYXQsIGxvbiwgZGlzcGxheV9uYW1lLCB0eXBlLCAuLi59XSAqL1xuICAgIGNvbnN0IHJ1blNlYXJjaCA9IGFzeW5jIChxKSA9PiB7XG4gICAgICAgIGlmICghcSB8fCBxLnRyaW0oKS5sZW5ndGggPCAzKSB7IHNldFNlYXJjaEhpdHMoW10pOyByZXR1cm47IH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNldFNlYXJjaEJ1c3kodHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBgaHR0cHM6Ly9ub21pbmF0aW0ub3BlbnN0cmVldG1hcC5vcmcvc2VhcmNoP2Zvcm1hdD1qc29uJmxpbWl0PTYmcT0ke2VuY29kZVVSSUNvbXBvbmVudChxKX1gO1xuICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwgeyBoZWFkZXJzOnsgJ0FjY2VwdCc6J2FwcGxpY2F0aW9uL2pzb24nIH0gfSk7XG4gICAgICAgICAgICBjb25zdCBqID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgICBzZXRTZWFyY2hIaXRzKEFycmF5LmlzQXJyYXkoaikgPyBqIDogW10pO1xuICAgICAgICAgICAgc2V0U2VhcmNoT3Blbih0cnVlKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBzZXRTZWFyY2hIaXRzKFtdKTsgfVxuICAgICAgICBmaW5hbGx5IHsgc2V0U2VhcmNoQnVzeShmYWxzZSk7IH1cbiAgICB9O1xuXG4gICAgLyogZGVib3VuY2VkIHNlYXJjaC1vbi10eXBlICovXG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKHNlYXJjaERlYm91bmNlUmVmLmN1cnJlbnQpIGNsZWFyVGltZW91dChzZWFyY2hEZWJvdW5jZVJlZi5jdXJyZW50KTtcbiAgICAgICAgc2VhcmNoRGVib3VuY2VSZWYuY3VycmVudCA9IHNldFRpbWVvdXQoKCkgPT4gcnVuU2VhcmNoKHNlYXJjaFEpLCA0MDApO1xuICAgICAgICByZXR1cm4gKCkgPT4gc2VhcmNoRGVib3VuY2VSZWYuY3VycmVudCAmJiBjbGVhclRpbWVvdXQoc2VhcmNoRGVib3VuY2VSZWYuY3VycmVudCk7XG4gICAgfSwgW3NlYXJjaFFdKTtcblxuICAgIGNvbnN0IHBpY2tTZWFyY2hIaXQgPSAoaGl0KSA9PiB7XG4gICAgICAgIGNvbnN0IGxhdCA9IE1hdGgucm91bmQoK2hpdC5sYXQgKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgY29uc3QgbG9uID0gTWF0aC5yb3VuZCgraGl0LmxvbiAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIGxhdCwgbG9uLCBjaXR5OmhpdC5kaXNwbGF5X25hbWV9KSk7XG4gICAgICAgIGlmIChtYXBSZWYuY3VycmVudCkgbWFwUmVmLmN1cnJlbnQuc2V0VmlldyhbbGF0LCBsb25dLCBoaXQudHlwZSA9PT0gJ2NpdHknID8gMTEgOiAxNSk7XG4gICAgICAgIHNldFNlYXJjaE9wZW4oZmFsc2UpO1xuICAgICAgICBzZXRTZWFyY2hRKCcnKTtcbiAgICB9O1xuXG4gICAgLyogUmV2ZXJzZS1nZW9jb2RlIGxhdC9sb24gLT4gY2l0eSAvIGNvdW50cnkgdmlhIE5vbWluYXRpbS4gIE5vIEFQSSBrZXkuICovXG4gICAgY29uc3QgcmV2ZXJzZUdlb2NvZGUgPSBhc3luYyAobGF0LCBsb24pID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNldEdlb0J1c3kodHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBgaHR0cHM6Ly9ub21pbmF0aW0ub3BlbnN0cmVldG1hcC5vcmcvcmV2ZXJzZT9mb3JtYXQ9anNvbiZsYXQ9JHtsYXR9Jmxvbj0ke2xvbn0mem9vbT0xMGA7XG4gICAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7IGhlYWRlcnM6IHsgJ0FjY2VwdCc6J2FwcGxpY2F0aW9uL2pzb24nIH0gfSk7XG4gICAgICAgICAgICBjb25zdCBqID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgICBjb25zdCBhID0gai5hZGRyZXNzIHx8IHt9O1xuICAgICAgICAgICAgY29uc3QgY2l0eSA9IGEuY2l0eSB8fCBhLnRvd24gfHwgYS52aWxsYWdlIHx8IGEuaGFtbGV0IHx8IGEuY291bnR5IHx8ICcnO1xuICAgICAgICAgICAgY29uc3QgcmVnaW9uID0gYS5zdGF0ZSB8fCBhLnJlZ2lvbiB8fCAnJztcbiAgICAgICAgICAgIGNvbnN0IGNvdW50cnkgPSBhLmNvdW50cnkgfHwgJyc7XG4gICAgICAgICAgICBjb25zdCBsYWJlbCA9IFtjaXR5LCByZWdpb24sIGNvdW50cnldLmZpbHRlcihCb29sZWFuKS5qb2luKCcsICcpIHx8IGouZGlzcGxheV9uYW1lIHx8ICcnO1xuICAgICAgICAgICAgaWYgKGxhYmVsKSBzZXRDZmcoYyA9PiAoey4uLmMsIGNpdHk6bGFiZWx9KSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogb2ZmbGluZSBvciByYXRlLWxpbWl0ZWQgLT4ga2VlcCBwcmlvciBuYW1lICovIH1cbiAgICAgICAgZmluYWxseSB7IHNldEdlb0J1c3koZmFsc2UpOyB9XG4gICAgfTtcblxuICAgIC8qIEluaXQgTGVhZmxldCBvbiBmaXJzdCByZW5kZXIgb2YgdGhlIG1vZGFsICovXG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKCFtYXBCb3hSZWYuY3VycmVudCB8fCBtYXBSZWYuY3VycmVudCkgcmV0dXJuO1xuICAgICAgICBjb25zdCBtYXAgPSBMLm1hcChtYXBCb3hSZWYuY3VycmVudCwgeyB6b29tQ29udHJvbDogdHJ1ZSwgYXR0cmlidXRpb25Db250cm9sOiB0cnVlIH0pXG4gICAgICAgICAgICAgICAgICAgICAuc2V0VmlldyhbY2ZnLmxhdCwgY2ZnLmxvbl0sIDYpO1xuICAgICAgICBMLnRpbGVMYXllcignaHR0cHM6Ly97c30udGlsZS5vcGVuc3RyZWV0bWFwLm9yZy97en0ve3h9L3t5fS5wbmcnLCB7XG4gICAgICAgICAgICBtYXhab29tOiAxOCxcbiAgICAgICAgICAgIGF0dHJpYnV0aW9uOiAnJmNvcHk7IE9wZW5TdHJlZXRNYXAgY29udHJpYnV0b3JzJyxcbiAgICAgICAgfSkuYWRkVG8obWFwKTtcblxuICAgICAgICBjb25zdCBtYXJrZXIgPSBMLm1hcmtlcihbY2ZnLmxhdCwgY2ZnLmxvbl0sIHsgZHJhZ2dhYmxlOiB0cnVlIH0pLmFkZFRvKG1hcCk7XG4gICAgICAgIG1hcmtlci5iaW5kVG9vbHRpcCgnRHJhZyBtZSBvciBjbGljayBhbnl3aGVyZSBvbiB0aGUgbWFwJywgeyBwZXJtYW5lbnQ6IGZhbHNlIH0pO1xuXG4gICAgICAgIGNvbnN0IGFwcGx5TGF0TG9uID0gKGxhdCwgbG9uKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByID0gKG4pID0+IE1hdGgucm91bmQobiAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBsYXQ6cihsYXQpLCBsb246cihsb24pfSkpO1xuICAgICAgICAgICAgcmV2ZXJzZUdlb2NvZGUocihsYXQpLCByKGxvbikpO1xuICAgICAgICB9O1xuICAgICAgICBtYXJrZXIub24oJ2RyYWdlbmQnLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsbCA9IG1hcmtlci5nZXRMYXRMbmcoKTtcbiAgICAgICAgICAgIGFwcGx5TGF0TG9uKGxsLmxhdCwgbGwubG5nKTtcbiAgICAgICAgfSk7XG4gICAgICAgIG1hcC5vbignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgbWFya2VyLnNldExhdExuZyhlLmxhdGxuZyk7XG4gICAgICAgICAgICBhcHBseUxhdExvbihlLmxhdGxuZy5sYXQsIGUubGF0bG5nLmxuZyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1hcFJlZi5jdXJyZW50ID0gbWFwO1xuICAgICAgICBtYXJrZXJSZWYuY3VycmVudCA9IG1hcmtlcjtcblxuICAgICAgICAvKiBMZWFmbGV0IHJlbmRlcnMgYmxhbmsgaWYgaXQgYm9vdHMgaW5zaWRlIGEgaGlkZGVuIGVsZW1lbnQg4oCUIGtpY2sgaXRcbiAgICAgICAgICAgb25jZSB0aGUgbW9kYWwgYW5pbWF0aW9uIHNldHRsZXMuICovXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gbWFwLmludmFsaWRhdGVTaXplKCksIDI1MCk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7IG1hcC5yZW1vdmUoKTsgbWFwUmVmLmN1cnJlbnQgPSBudWxsOyBtYXJrZXJSZWYuY3VycmVudCA9IG51bGw7IH07XG4gICAgfSwgW10pO1xuXG4gICAgLyogS2VlcCBtYXJrZXIgaW4gc3luYyB3aGVuIHVzZXIgZWRpdHMgbGF0L2xvbiBmaWVsZHMgbWFudWFsbHkgKi9cbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAobWFwUmVmLmN1cnJlbnQgJiYgbWFya2VyUmVmLmN1cnJlbnQpIHtcbiAgICAgICAgICAgIG1hcmtlclJlZi5jdXJyZW50LnNldExhdExuZyhbY2ZnLmxhdCwgY2ZnLmxvbl0pO1xuICAgICAgICAgICAgbWFwUmVmLmN1cnJlbnQucGFuVG8oW2NmZy5sYXQsIGNmZy5sb25dKTtcbiAgICAgICAgfVxuICAgIH0sIFtjZmcubGF0LCBjZmcubG9uXSk7XG5cbiAgICAvKiBHZW9sb2NhdGlvbjogc2lsZW50bHkgbm8tb3AnZCBiZWZvcmUgLS0gaWYgdGhlIGJyb3dzZXIgYmxvY2tlZCB0aGVcbiAgICAgKiByZXF1ZXN0IChIVFRQIG9yaWdpbiA9IG5vdCBhIHNlY3VyZSBjb250ZXh0IG9uIGZpZWxkIGNvbnRyb2xsZXJzLCBvclxuICAgICAqIHRoZSB1c2VyIGRlbmllZCBwZXJtaXNzaW9uIGVhcmxpZXIpIHRoZSBidXR0b24ganVzdCBzYXQgdGhlcmUuXG4gICAgICogTm93IHdlIHN1cmZhY2UgYSBzdGF0ZSAoYnVzeSAvIGVycikgc28gdGhlIG9wZXJhdG9yIGNhbiBzZWUgV0hZIGl0XG4gICAgICogZmFpbGVkIGFuZCBhY3Qgb24gaXQgKHN3aXRjaCB0byBIVFRQUywgcmUtcHJvbXB0LCBvciB1c2UgdGhlIG1hcCkuICovXG4gICAgY29uc3QgW2dlb1N0YXRlLCBzZXRHZW9TdGF0ZV0gPSBSZWFjdC51c2VTdGF0ZShudWxsKTsgICAvLyBudWxsIHwgJ2J1c3knIHwge2Vycn1cbiAgICBjb25zdCB1c2VNeUxvY2F0aW9uID0gKCkgPT4ge1xuICAgICAgICBzZXRHZW9TdGF0ZSgnYnVzeScpO1xuICAgICAgICAvLyBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24gaXMgYHVuZGVmaW5lZGAgb24gSFRUUCBvcmlnaW5zIChDaHJvbWUgNTArKS5cbiAgICAgICAgaWYgKCFuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pIHtcbiAgICAgICAgICAgIHNldEdlb1N0YXRlKHsgZXJyOidCcm93c2VyIGJsb2NrZWQgbG9jYXRpb24gYWNjZXNzIOKAlCBvcGVuIHRoaXMgcGFnZSB2aWEgSFRUUFMuJyB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKFxuICAgICAgICAgICAgKHBvcykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhdCA9IE1hdGgucm91bmQocG9zLmNvb3Jkcy5sYXRpdHVkZSAgKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgICAgICAgICBjb25zdCBsb24gPSBNYXRoLnJvdW5kKHBvcy5jb29yZHMubG9uZ2l0dWRlICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBsYXQsIGxvbn0pKTtcbiAgICAgICAgICAgICAgICBpZiAobWFwUmVmLmN1cnJlbnQpIG1hcFJlZi5jdXJyZW50LnNldFZpZXcoW2xhdCwgbG9uXSwgMTEpO1xuICAgICAgICAgICAgICAgIHJldmVyc2VHZW9jb2RlKGxhdCwgbG9uKTtcbiAgICAgICAgICAgICAgICBzZXRHZW9TdGF0ZShudWxsKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gZXJyLmNvZGU6IDE9UEVSTUlTU0lPTl9ERU5JRUQsIDI9UE9TSVRJT05fVU5BVkFJTEFCTEUsIDM9VElNRU9VVFxuICAgICAgICAgICAgICAgIGNvbnN0IG1zZyA9IGVyciAmJiBlcnIuY29kZSA9PT0gMVxuICAgICAgICAgICAgICAgICAgICA/ICdMb2NhdGlvbiBwZXJtaXNzaW9uIGRlbmllZCDigJQgY2xpY2sgdGhlIGxvY2sgaWNvbiBpbiB0aGUgYWRkcmVzcyBiYXIgYW5kIGFsbG93IGxvY2F0aW9uLidcbiAgICAgICAgICAgICAgICAgICAgOiBlcnIgJiYgZXJyLmNvZGUgPT09IDJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gJ0xvY2F0aW9uIGN1cnJlbnRseSB1bmF2YWlsYWJsZSDigJQgdGhlIGRldmljZSBoYXMgbm8gR1BTIC8gV2ktRmkgZml4IHlldC4nXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGVyciAmJiBlcnIuY29kZSA9PT0gM1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ0xvY2F0aW9uIHJlcXVlc3QgdGltZWQgb3V0IOKAlCB0cnkgYWdhaW4sIG9yIHVzZSB0aGUgbWFwIC8gc2VhcmNoIGJhci4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAoZXJyICYmIGVyci5tZXNzYWdlKSB8fCAnQ291bGQgbm90IHJlYWQgZGV2aWNlIGxvY2F0aW9uLic7XG4gICAgICAgICAgICAgICAgc2V0R2VvU3RhdGUoeyBlcnI6IG1zZyB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7IGVuYWJsZUhpZ2hBY2N1cmFjeTp0cnVlLCB0aW1lb3V0OjEwMDAwLCBtYXhpbXVtQWdlOjAgfVxuICAgICAgICApO1xuICAgIH07XG5cbiAgICAvKiBXaGVuIHVzZXIgY2xpY2tzIFwiU2F2ZSAmIHJldHVyblwiLCBQT1NUIHRoZSBzZWxlY3Rpb24gdG8gdGhlIHNhbWVcbiAgICAgKiAvYXBpL3dlYXRoZXItbG9jYXRpb24gZW5kcG9pbnQgdGhlIGRhc2hib2FyZCByZWFkcy4gIFNldHRpbmcgQk9USFxuICAgICAqIGBhY3RpdmVgIGFuZCBgZGVmYXVsdGAgbWVhbnMgdGhlIHdlYXRoZXIgc3RyaXAgb24gdGhlIGRhc2hib2FyZFxuICAgICAqIGxvYWRzIHRoaXMgbG9jYXRpb24gaW1tZWRpYXRlbHkgb24gbmV4dCBwYWdlIGxvYWQgKGFuZCBzdGF5cyBwaW5uZWRcbiAgICAgKiBmb3IgYW55IGZ1dHVyZSBmcmVzaCBzZXNzaW9ucykuICBBbm9ueW1vdXMgdXNlcnMgZ2V0IGEgc29mdCB3YXJuaW5nXG4gICAgICogYmFjayBmcm9tIHRoZSBzZXJ2ZXIgKHBlcnNpc3RlZDpmYWxzZSkgLS0gd2Ugc3VyZmFjZSB0aGF0IGFzIGEgdG9hc3RcbiAgICAgKiBzbyB0aGUgb3BlcmF0b3Iga25vd3MgdGhleSBuZWVkIHRvIHNpZ24gaW4gdG8ga2VlcCB0aGUgcGljayBhY3Jvc3NcbiAgICAgKiBwYWdlIHJlbG9hZHMuICBXZSBhbHdheXMgYWxzbyB3cml0ZSB0byBsb2NhbFN0b3JhZ2Ugc28gdGhlIFNBTUVcbiAgICAgKiB0YWIga2VlcHMgdGhlIGNob3NlbiBsb2NhdGlvbiBmb3IgdGhlIGN1cnJlbnQgc2Vzc2lvbi4gKi9cbiAgICBjb25zdCBbc2F2ZU1zZywgc2V0U2F2ZU1zZ10gPSBSZWFjdC51c2VTdGF0ZShudWxsKTtcbiAgICBjb25zdCBwZXJzaXN0QW5kU2F2ZSA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgbG9jID0geyBsYXQ6IGNmZy5sYXQsIGxvbjogY2ZnLmxvbiwgbmFtZTogY2ZnLnNpdGVOYW1lIHx8IGNmZy5jaXR5IH07XG4gICAgICAgIC8qIExvY2FsIGZhbGxiYWNrIOKAlCB3b3JrcyBmb3IgYW5vbnltb3VzIHVzZXJzIHNvIHRoZSBkYXNoYm9hcmQgYXRcbiAgICAgICAgICogbGVhc3Qgc2VlcyB0aGUgbmV3IGxhdC9sb24gaW4gdGhlIHNhbWUgYnJvd3Nlci4gKi9cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1LndlYXRoZXJfbG9jYXRpb24nLCBKU09OLnN0cmluZ2lmeShsb2MpKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBwcml2YXRlIG1vZGUgLS0gaWdub3JlICovIH1cblxuICAgICAgICBsZXQgcGVyc2lzdGVkID0gZmFsc2UsIHdhcm5pbmcgPSAnJztcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCgnL2FwaS93ZWF0aGVyLWxvY2F0aW9uJywge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzonYXBwbGljYXRpb24vanNvbicgfSxcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGFjdGl2ZTogbG9jLCBkZWZhdWx0OiBsb2MgfSksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IGogPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgICAgIHdpbmRvdy5fbGFzdFdlYXRoZXJMb2NhdGlvblNhdmUgPSBqO1xuICAgICAgICAgICAgcGVyc2lzdGVkID0gISFqLnBlcnNpc3RlZDtcbiAgICAgICAgICAgIHdhcm5pbmcgICA9IGoud2FybmluZyB8fCAnJztcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnW3NldHVwIHdhbGtdIC9hcGkvd2VhdGhlci1sb2NhdGlvbiA8LScsIGopO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB3YXJuaW5nID0gJ05ldHdvcmsgZXJyb3Ig4oCUIHNhdmVkIGxvY2FsbHkgb25seS4nO1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdbc2V0dXAgd2Fsa10gY291bGQgbm90IHBlcnNpc3QgbG9jYXRpb246JywgZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGVyc2lzdGVkKSB7XG4gICAgICAgICAgICBvblNhdmUoKTsgICAgICAgICAgIC8vIGhhcHB5IHBhdGg6IGNsb3NlICsgbWFyayBzdGVwIGRvbmVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8qIFN1cmZhY2UgdGhlIHdhcm5pbmcsIGhvbGQgdGhlIG1vZGFsIG9wZW4gZm9yIDEuNnMgc28gdGhlXG4gICAgICAgICAgICAgKiBvcGVyYXRvciByZWFkcyBpdCwgdGhlbiBjbG9zZS4gIFRoZSBsb2NhbCBjb3B5IGlzIGFscmVhZHlcbiAgICAgICAgICAgICAqIHdyaXR0ZW4sIHNvIHRoZSBkYXNoYm9hcmQgd2lsbCBzdGlsbCBzZWUgdGhlIG5ldyBsb2NhdGlvblxuICAgICAgICAgICAgICogaW4gdGhpcyBicm93c2VyIHNlc3Npb24uICovXG4gICAgICAgICAgICBzZXRTYXZlTXNnKHdhcm5pbmcgfHwgJ1NhdmVkIGxvY2FsbHkgb25seSDigJQgc2lnbiBpbiB0byBzYXZlIHNlcnZlci1zaWRlLicpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHNldFNhdmVNc2cobnVsbCk7IG9uU2F2ZSgpOyB9LCAxNjAwKTtcbiAgICAgICAgfVxuICAgIH07XG5cblxuICAgIHJldHVybiAoXG4gICAgICAgIDxNb2RhbFNoZWxsIHRpdGxlPVwiTG9jYXRpb24gU2V0dGluZ1wiIHN1YnRpdGxlPVwiQ2xpY2sgdGhlIG1hcCwgZHJhZyB0aGUgcGluLCBvciB1c2UgeW91ciBkZXZpY2VcIiBhY2NlbnQ9XCJhbWJlclwiIG9uQ2xvc2U9e29uQ2xvc2V9IG9uU2F2ZT17cGVyc2lzdEFuZFNhdmV9IHNpemU9XCJtYXhcIj5cbiAgICAgICAgICAgIHtzYXZlTXNnICYmIChcbiAgICAgICAgICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwibG9jLXNhdmUtbXNnXCJcbiAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1iLTMgcHgtNCBweS0yLjUgcm91bmRlZC1sZyBiZy1hbWJlci05MDAvMzAgYm9yZGVyIGJvcmRlci1hbWJlci03MDAvNTAgdGV4dC1hbWJlci0yMDAgdGV4dC14cyBmb250LW1vbm9cIj5cbiAgICAgICAgICAgICAgICAgICAg4pqgICB7c2F2ZU1zZ31cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbGc6Z3JpZC1jb2xzLVsxZnJfMzQwcHhdIGdhcC00IGgtZnVsbFwiIHN0eWxlPXt7bWluSGVpZ2h0Oic1NnZoJ319PlxuICAgICAgICAgICAgICAgIHsvKiBNQVAg4oCUIGZpbGxzIHRoZSBsZWZ0IHNpZGUsIHdpdGggYSBzZWFyY2ggYmFyIGZsb2F0aW5nIG9uIHRvcCAqL31cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlXCIgc3R5bGU9e3ttaW5IZWlnaHQ6JzU2dmgnfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgcmVmPXttYXBCb3hSZWZ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgaGVpZ2h0OicxMDAlJywgbWluSGVpZ2h0Oic1NnZoJywgd2lkdGg6JzEwMCUnLCBib3JkZXJSYWRpdXM6JzEycHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OidoaWRkZW4nLCBib3JkZXI6JzFweCBzb2xpZCAjMzM0MTU1JywgYmFja2dyb3VuZDonIzBiMTIyMCcgfX0vPlxuXG4gICAgICAgICAgICAgICAgICAgIHsvKiBTZWFyY2ggYmFyIG92ZXJsYXkg4oCUIHNpdHMgaW4gdGhlIHRvcC1jZW50cmUgb2YgdGhlIG1hcCAqL31cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSB0b3AtMyBsZWZ0LTEvMiAtdHJhbnNsYXRlLXgtMS8yIHotWzUwMF1cIiBzdHlsZT17e3dpZHRoOidtaW4oNTYwcHgsIGNhbGMoMTAwJSAtIDExMHB4KSknfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3NlYXJjaFF9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0U2VhcmNoUShlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uRm9jdXM9eygpID0+IHNlYXJjaEhpdHMubGVuZ3RoICYmIHNldFNlYXJjaE9wZW4odHJ1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwi8J+UjiAgU2VhcmNoIGJ5IGFkZHJlc3MsIGJ1aWxkaW5nLCBvciBwbGFjZSBuYW1l4oCmXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHB4LTQgcHktMi41IHJvdW5kZWQteGwgYmctc2xhdGUtOTAwLzk1IGJvcmRlciBib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtMTAwIHRleHQtc20gcGxhY2Vob2xkZXItc2xhdGUtNTAwIHNoYWRvdy0yeGwgYmFja2Ryb3AtYmx1clwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7b3V0bGluZTonbm9uZSd9fS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlYXJjaEJ1c3kgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJhYnNvbHV0ZSByaWdodC0zIHRvcC0xLzIgLXRyYW5zbGF0ZS15LTEvMiB0ZXh0LWFtYmVyLTQwMCB0ZXh0LXhzXCI+4oCmPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlYXJjaE9wZW4gJiYgc2VhcmNoSGl0cy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSB0b3AtZnVsbCBsZWZ0LTAgcmlnaHQtMCBtdC0xIGJnLXNsYXRlLTkwMC85NyBib3JkZXIgYm9yZGVyLXNsYXRlLTcwMCByb3VuZGVkLXhsIHNoYWRvdy0yeGwgb3ZlcmZsb3ctaGlkZGVuIG1heC1oLTcyIG92ZXJmbG93LXktYXV0byBiYWNrZHJvcC1ibHVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VhcmNoSGl0cy5tYXAoKGgsIGkpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGtleT17aC5wbGFjZV9pZCB8fCBpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gcGlja1NlYXJjaEhpdChoKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCB0ZXh0LWxlZnQgcHgtNCBweS0yLjUgaG92ZXI6YmctYW1iZXItOTAwLzMwIGJvcmRlci1iIGJvcmRlci1zbGF0ZS04MDAgbGFzdDpib3JkZXItYi0wIHRyYW5zaXRpb24tYWxsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LXNsYXRlLTIwMCB0cnVuY2F0ZVwiPntoLmRpc3BsYXlfbmFtZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IG10LTAuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2gudHlwZSB8fCBoLmNsYXNzfSDCtyB7KCtoLmxhdCkudG9GaXhlZCgzKX0sIHsoK2gubG9uKS50b0ZpeGVkKDMpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWFyY2hPcGVuICYmIHNlYXJjaEhpdHMubGVuZ3RoID09PSAwICYmIHNlYXJjaFEubGVuZ3RoID49IDMgJiYgIXNlYXJjaEJ1c3kgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC1mdWxsIGxlZnQtMCByaWdodC0wIG10LTEgYmctc2xhdGUtOTAwLzk3IGJvcmRlciBib3JkZXItc2xhdGUtNzAwIHJvdW5kZWQteGwgcHgtNCBweS0zIHRleHQteHMgdGV4dC1zbGF0ZS00MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vIHJlc3VsdHMgZm9yIFwie3NlYXJjaFF9XCIuICBUcnkgYSBtb3JlIHNwZWNpZmljIHRlcm0uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICB7LyogU0lERSBQQU5FTCAqL31cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktNCBvdmVyZmxvdy15LWF1dG8gcHItMVwiPlxuICAgICAgICAgICAgICAgICAgICB7LyogVXNlci1mcmllbmRseSBzaXRlIG5hbWUgKHRoZSBvbmUgdGhlIG9wZXJhdG9yIHVzZXMgdG8gaWRlbnRpZnkgdGhpcyBsb2NhdGlvbikuXG4gICAgICAgICAgICAgICAgICAgICAgICBQaGFzZSBMLjQ0KyA6IHdoZW4gL2FwaS93ZWF0aGVyLWxvY2F0aW9uIHJldHVybnMgb25lIG9yIG1vcmVcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdG9yLWN1cmF0ZWQgZW50cmllcyAoaS5lLiBhbnl0aGluZyBvdXRzaWRlIHRoZSBidW5kbGVkIGRlbW9cbiAgICAgICAgICAgICAgICAgICAgICAgIHNldCksIHN1cmZhY2UgdGhlbSBhcyBhIG5hdGl2ZSA8ZGF0YWxpc3Q+IGRyb3Bkb3duIGluc2lkZSB0aGlzXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC4gIFBpY2tpbmcgb25lIGF1dG8tZmlsbHMgbGF0L2xvbiBhbmQgcmVjZW50cmVzIHRoZSBtYXA7XG4gICAgICAgICAgICAgICAgICAgICAgICBmcmVlLWZvcm0gdHlwaW5nIHN0aWxsIHdvcmtzIGZvciBmcmVzaCBsYWJlbHMuICovfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0xLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTaXRlIG5hbWUgKHNhdmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzYXZlZExvY3MubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1sLTIgdGV4dC1hbWJlci00MDAvODAgbm9ybWFsLWNhc2UgdHJhY2tpbmctbm9ybWFsIHRleHQtWzEwcHhdXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJsb2Mtc2F2ZWQtaGludFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg4pa+IHtzYXZlZExvY3MubGVuZ3RofSBzYXZlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCIgdmFsdWU9e2NmZy5zaXRlTmFtZSB8fCAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0PXtzYXZlZExvY3MubGVuZ3RoID4gMCA/ICdyZWQ1LXNhdmVkLWxvY2F0aW9ucycgOiB1bmRlZmluZWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJsb2Mtc2l0ZS1uYW1lLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17c2F2ZWRMb2NzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnUGljayBhIHNhdmVkIGxvY2F0aW9uLCBvciB0eXBlIGEgbmV3IG9uZeKApidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnZS5nLiBIUSBUb3dlciwgTm9ydGggV2luZywgUGF2aWxpb24gQuKApid9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBvblNpdGVOYW1lQ2hhbmdlKGUudGFyZ2V0LnZhbHVlKX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAge3NhdmVkTG9jcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGF0YWxpc3QgaWQ9XCJyZWQ1LXNhdmVkLWxvY2F0aW9uc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2F2ZWRMb2NzLm1hcChsb2MgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBrZXk9e2xvYy5uYW1lfSB2YWx1ZT17bG9jLm5hbWV9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtOdW1iZXIuaXNGaW5pdGUobG9jLmxhdCkgJiYgTnVtYmVyLmlzRmluaXRlKGxvYy5sb24pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gYCR7KCtsb2MubGF0KS50b0ZpeGVkKDIpfSwgJHsoK2xvYy5sb24pLnRvRml4ZWQoMil9YFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGF0YWxpc3Q+XG4gICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbXQtMSBpdGFsaWNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2F2ZWRMb2NzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnUGljayBhIHByZXZpb3VzbHktc2F2ZWQgbG9jYXRpb24sIG9yIHR5cGUgYSBuZXcgbGFiZWwgZm9yIHRoaXMgcGxhY2UuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdZb3VyIGxhYmVsIGZvciB0aGlzIHBsYWNlIOKAlCBzaG93biBvbiB0aGUgZGFzaGJvYXJkIGhlYWRlci4nfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvcmRlci10IGJvcmRlci1zbGF0ZS04MDAgcHQtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0xLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXNvbHZlZCBhZGRyZXNzIC8gY2l0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtnZW9CdXN5ICYmIDxzcGFuIGNsYXNzTmFtZT1cIm1sLTIgdGV4dC1hbWJlci00MDAgbm9ybWFsLWNhc2UgdHJhY2tpbmctbm9ybWFsXCI+4oCmIHJlc29sdmluZzwvc3Bhbj59XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiIHZhbHVlPXtjZmcuY2l0eX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpPT5zZXRDZmcoey4uLmNmZywgY2l0eTplLnRhcmdldC52YWx1ZX0pfS8+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0xLjVcIj5MYXRpdHVkZTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiIHR5cGU9XCJudW1iZXJcIiBzdGVwPVwiMC4wMDAxXCIgdmFsdWU9e2NmZy5sYXR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSk9PnNldENmZyh7Li4uY2ZnLCBsYXQ6K2UudGFyZ2V0LnZhbHVlfSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTEuNVwiPkxvbmdpdHVkZTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiIHR5cGU9XCJudW1iZXJcIiBzdGVwPVwiMC4wMDAxXCIgdmFsdWU9e2NmZy5sb259XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSk9PnNldENmZyh7Li4uY2ZnLCBsb246K2UudGFyZ2V0LnZhbHVlfSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3VzZU15TG9jYXRpb259XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9e2dlb1N0YXRlID09PSAnYnVzeSd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJsb2MtdXNlLW15LWxvY2F0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B3LWZ1bGwgcHktMi41IHJvdW5kZWQtbGcgYm9yZGVyIHRleHQteHMgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IHRyYW5zaXRpb24tY29sb3JzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Z2VvU3RhdGUgPT09ICdidXN5J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctYW1iZXItOTAwLzQwIGJvcmRlci1hbWJlci03MDAvNDAgdGV4dC1hbWJlci0yMDAgY3Vyc29yLXdhaXQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IChnZW9TdGF0ZSAmJiBnZW9TdGF0ZS5lcnJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1yb3NlLTkwMC80MCBib3JkZXItcm9zZS01MDAvNTAgdGV4dC1yb3NlLTEwMCBob3ZlcjpiZy1yb3NlLTgwMC80MCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1hbWJlci03MDAvNzAgYm9yZGVyLWFtYmVyLTUwMC80MCB0ZXh0LWFtYmVyLTUwIGhvdmVyOmJnLWFtYmVyLTYwMC83MCcpfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAge2dlb1N0YXRlID09PSAnYnVzeSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICfij7MgIFJlYWRpbmcgZGV2aWNlIGxvY2F0aW9u4oCmJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ/Cfk40gIFVzZSBteSBkZXZpY2UgbG9jYXRpb24nfVxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAge2dlb1N0YXRlICYmIGdlb1N0YXRlLmVyciAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwibG9jLWdlby1lcnJvclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIi1tdC0yIHB4LTMgcHktMiByb3VuZGVkLW1kIGJnLXJvc2UtOTUwLzUwIGJvcmRlciBib3JkZXItcm9zZS03MDAvNDAgdGV4dC1bMTFweF0gbGVhZGluZy1zbnVnIHRleHQtcm9zZS0yMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YiBjbGFzc05hbWU9XCJ0ZXh0LXJvc2UtMTAwXCI+Q291bGRuJ3QgcmVhZCBsb2NhdGlvbi48L2I+PGJyLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXJvc2UtMjAwLzkwXCI+e2dlb1N0YXRlLmVycn08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qIFNwZWNpZmljIEhUVFAtb3JpZ2luIGNhbGwtb3V0OiBtb3N0IGxpa2VseSBjYXVzZSBvbiBhIFYxLjkgY29udHJvbGxlci4gKi99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3R5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5sb2NhdGlvbiAmJiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgPT09ICdodHRwOicgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTEuNSB0ZXh0LVsxMHB4XSB0ZXh0LXJvc2UtMzAwLzgwIGZvbnQtbW9ub1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwOiBicm93c2VycyByZXF1aXJlIEhUVFBTIGZvciBnZW9sb2NhdGlvbi4gIFBpY2sgdGhlIGxvY2F0aW9uIG9uIHRoZSBtYXAgb3Igc2VhcmNoIGJhciBpbnN0ZWFkLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib3JkZXItdCBib3JkZXItc2xhdGUtODAwIHB0LTMgbXQtMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0yXCI+UXVpY2sganVtcHM8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtMS41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidUb3JvbnRvLCBPTicsICAgbGF0OjQzLjY1MzIsIGxvbjotNzkuMzgzMiwgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J05ldyBZb3JrLCBOWScsICBsYXQ6NDAuNzEyOCwgbG9uOi03NC4wMDYwLCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonTG9uZG9uLCBVSycsICAgIGxhdDo1MS41MDc0LCBsb246IC0wLjEyNzgsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidQYXJpcywgRlInLCAgICAgbGF0OjQ4Ljg1NjYsIGxvbjogIDIuMzUyMiwgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J1Rva3lvLCBKUCcsICAgICBsYXQ6MzUuNjc2MiwgbG9uOjEzOS42NTAzLCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonU3lkbmV5LCBBVScsICAgIGxhdDotMzMuODY4OCxsb246MTUxLjIwOTMsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLm1hcChqID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e2oubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgbGF0OmoubGF0LCBsb246ai5sb24sIGNpdHk6ai5uYW1lfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFwUmVmLmN1cnJlbnQpIG1hcFJlZi5jdXJyZW50LnNldFZpZXcoW2oubGF0LCBqLmxvbl0sIGoueik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LWxlZnQgcHgtMi41IHB5LTEuNSByb3VuZGVkLW1kIGJnLXNsYXRlLTgwMC83MCBib3JkZXIgYm9yZGVyLXNsYXRlLTcwMCB0ZXh0LVsxMXB4XSBmb250LWJvbGQgdGV4dC1zbGF0ZS0zMDAgaG92ZXI6Ymctc2xhdGUtNzAwIGhvdmVyOmJvcmRlci1hbWJlci01MDAvNDAgdHJhbnNpdGlvbi1hbGxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtqLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgVGlsZXM6IE9wZW5TdHJlZXRNYXAgwrcgR2VvY29kZTogTm9taW5hdGltIChmcmVlLCB+MSByZXEvcykuXG4gICAgICAgICAgICAgICAgICAgICAgICBVc2VkIGZvciBPcGVuLU1ldGVvIHdlYXRoZXIgZmVlZCBhbmQgc3VucmlzZS9zdW5zZXQgZXN0aW1hdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvTW9kYWxTaGVsbD5cbiAgICApO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBMYW5ndWFnZSBTZXR0aW5nIC0tIG1vZGFsXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5mdW5jdGlvbiBMYW5ndWFnZU1vZGFsKHsgY2ZnLCBzZXRDZmcsIG9uQ2xvc2UsIG9uU2F2ZSB9KSB7XG4gICAgY29uc3QgbGFuZ3MgPSBbXG4gICAgICAgIHsgY29kZTonZW4nLCAgICBsYWJlbDonRW5nbGlzaCcsICAgICAgICAgICAgICAgIG5hdGl2ZTonRW5nbGlzaCcgICAgfSxcbiAgICAgICAgeyBjb2RlOid6aC1DTicsIGxhYmVsOidDaGluZXNlIChTaW1wbGlmaWVkKScsICAgbmF0aXZlOifnroDkvZPkuK3mlocnICAgIH0sXG4gICAgICAgIHsgY29kZTonemgtVFcnLCBsYWJlbDonQ2hpbmVzZSAoVHJhZGl0aW9uYWwpJywgIG5hdGl2ZTon57mB6auU5Lit5paHJyAgICB9LFxuICAgICAgICB7IGNvZGU6J2phJywgICAgbGFiZWw6J0phcGFuZXNlJywgICAgICAgICAgICAgICBuYXRpdmU6J+aXpeacrOiqnicgICAgICB9LFxuICAgICAgICB7IGNvZGU6J2tvJywgICAgbGFiZWw6J0tvcmVhbicsICAgICAgICAgICAgICAgICBuYXRpdmU6J+2VnOq1reyWtCcgICAgICB9LFxuICAgIF07XG5cbiAgICAvKiBPbiBTYXZlICYgcmV0dXJuOiB3cml0ZSB0aGUgcGlja2VkIGxhbmd1YWdlIGNvZGUgdG8gdGhlIHNhbWVcbiAgICAgKiBsb2NhbFN0b3JhZ2Uga2V5IHRoZSBkYXNoYm9hcmQncyBpMThuLmpzIHJlYWRzIChgaTE4bl9sYW5nYCksIGFuZFxuICAgICAqIGRpc3BhdGNoIHRoZSBgbGFuZ2NoYW5nZWAgZXZlbnQgc28gYW55IG9wZW4gZGFzaGJvYXJkL2NvbmZpZyB0YWJcbiAgICAgKiBwaWNrcyBpdCB1cCBsaXZlLiAgVGhpcyBpcyB3aGF0IG1ha2VzIHRoZSBzZXR1cCB3YWxrJ3MgbGFuZ3VhZ2VcbiAgICAgKiBjaG9pY2UgYWN0dWFsbHkgZHJpdmUgdGhlIGRhc2hib2FyZCAvIGNvbmZpZyAvIG1hcHBlciBVSSAtLSB0aGVcbiAgICAgKiBzaWRlYmFyIHNlbGVjdG9yIHRoYXQgdXNlZCB0byBsaXZlIGluIHRoZSBkYXNoYm9hcmQgaGVhZGVyIGhhc1xuICAgICAqIGJlZW4gcmVtb3ZlZCAoMjAyNi0wNi0yNikgYW5kIHRoZSBzZXR1cCB3YWxrIGlzIG5vdyB0aGUgc2luZ2xlXG4gICAgICogc291cmNlIG9mIHRydXRoIGZvciBVSSBsYW5ndWFnZS4gKi9cbiAgICBjb25zdCBwZXJzaXN0QW5kU2F2ZSA9ICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdpMThuX2xhbmcnLCBjZmcubGFuZyk7XG4gICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2xhbmdjaGFuZ2UnKSk7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ1tzZXR1cCB3YWxrXSBpMThuX2xhbmcgPC0nLCBjZmcubGFuZyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignW3NldHVwIHdhbGtdIGNvdWxkIG5vdCBwZXJzaXN0IGxhbmd1YWdlOicsIGUpO1xuICAgICAgICB9XG4gICAgICAgIG9uU2F2ZSgpO1xuICAgIH07XG4gICAgcmV0dXJuIChcbiAgICAgICAgPE1vZGFsU2hlbGwgdGl0bGU9XCJMYW5ndWFnZSBTZXR0aW5nXCIgc3VidGl0bGU9XCJQaWNrIHlvdXIgZGVmYXVsdCBpbnRlcmZhY2UgbGFuZ3VhZ2VcIiBhY2NlbnQ9XCJlbWVyYWxkXCIgb25DbG9zZT17b25DbG9zZX0gb25TYXZlPXtwZXJzaXN0QW5kU2F2ZX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTNcIj5cbiAgICAgICAgICAgICAgICB7bGFuZ3MubWFwKGwgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGtleT17bC5jb2RlfSBvbkNsaWNrPXsoKT0+c2V0Q2ZnKHsuLi5jZmcsIGxhbmc6bC5jb2RlfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdGV4dC1sZWZ0IHAtMyByb3VuZGVkLXhsIGJvcmRlci0yIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Y2ZnLmxhbmcgPT09IGwuY29kZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYm9yZGVyLWVtZXJhbGQtNTAwIGJnLWVtZXJhbGQtOTAwLzIwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYm9yZGVyLXNsYXRlLTcwMCBiZy1zbGF0ZS04MDAvNDAgaG92ZXI6Ymctc2xhdGUtODAwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIHRleHQtc2xhdGUtNTAwXCI+e2wuY29kZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LWJsYWNrIHRleHQtc2xhdGUtMjAwXCI+e2wubmF0aXZlfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMXB4XSB0ZXh0LXNsYXRlLTUwMFwiPntsLmxhYmVsfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L01vZGFsU2hlbGw+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogUGx1Zy1pbiBTZXR0aW5nIC0tIG1vZGFsIHcvIGxpc3QgKyB1cGxvYWQgem9uZVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLyogUGVyLXBsdWctaW4gbW9jayBjb25maWd1cmF0aW9uIGZpZWxkcy4gIEtleXMgbWFwIHRvIHBsdWctaW4gYGlkYC4gKi9cbmNvbnN0IFBMVUdJTl9DT05GSUdfRklFTERTID0ge1xuICAgIHdlYXRoZXI6ICAgIFtcbiAgICAgICAgeyBrZXk6J3Byb3ZpZGVyJywgIGxhYmVsOidQcm92aWRlcicsICAgICAgICAgIHR5cGU6J3NlbGVjdCcsICBvcHRpb25zOlsnT3Blbi1NZXRlbycsJ05XUycsJ0VDTVdGJ10sIGRlZjonT3Blbi1NZXRlbycgfSxcbiAgICAgICAgeyBrZXk6J3JlZnJlc2gnLCAgIGxhYmVsOidSZWZyZXNoIGludGVydmFsJywgIHR5cGU6J3NlbGVjdCcsICBvcHRpb25zOlsnMSBtaW4nLCc1IG1pbicsJzE1IG1pbicsJzMwIG1pbicsJzEgaCddLCBkZWY6JzE1IG1pbicgfSxcbiAgICAgICAgeyBrZXk6J2NhY2hlJywgICAgIGxhYmVsOidDYWNoZSBUVEwgKG1pbiknLCAgIHR5cGU6J251bWJlcicsICBkZWY6MzAgfSxcbiAgICBdLFxuICAgIGdpdm9uaTogICAgIFtcbiAgICAgICAgeyBrZXk6J2NsaW1hdGUnLCAgIGxhYmVsOidDbGltYXRlIG1vZGVsJywgICAgIHR5cGU6J3NlbGVjdCcsICBvcHRpb25zOlsnR2l2b25pIDE5OTInLCdBU0hSQUUgNTUnLCdBZGFwdGl2ZSddLCBkZWY6J0dpdm9uaSAxOTkyJyB9LFxuICAgICAgICB7IGtleTonbWFzc2l2ZScsICAgbGFiZWw6J0hlYXZ5d2VpZ2h0IGNvbnN0cnVjdGlvbicsICB0eXBlOid0b2dnbGUnLCBkZWY6ZmFsc2UgfSxcbiAgICBdLFxuICAgIHN3ZWV0X3Nwb3Q6IFtcbiAgICAgICAgeyBrZXk6J3RyYWNraW5nJywgIGxhYmVsOidUcmFjayBvdXRkb29yIFJIJywgIHR5cGU6J3RvZ2dsZScsIGRlZjp0cnVlIH0sXG4gICAgICAgIHsga2V5OidoeXN0JywgICAgICBsYWJlbDonSHlzdGVyZXNpcyAoJSBSSCknLCB0eXBlOidudW1iZXInLCBkZWY6MiB9LFxuICAgIF0sXG4gICAgZzM2OiAgICAgICAgW1xuICAgICAgICB7IGtleTonbW9kZScsICAgICAgbGFiZWw6J1NlcXVlbmNlIG1vZGUnLCAgICAgdHlwZTonc2VsZWN0JywgIG9wdGlvbnM6WydTaW5nbGUtem9uZSBWQVYnLCdNdWx0aS16b25lIFZBVicsJ0RPQVMgdy8gRkNVJ10sIGRlZjonTXVsdGktem9uZSBWQVYnIH0sXG4gICAgICAgIHsga2V5Oid2ZXJib3NlJywgICBsYWJlbDonVmVyYm9zZSBsb2dnaW5nJywgICB0eXBlOid0b2dnbGUnLCBkZWY6ZmFsc2UgfSxcbiAgICBdLFxuICAgIGRpYnQ6ICAgICAgIFtcbiAgICAgICAgeyBrZXk6J2hvc3QnLCAgICAgIGxhYmVsOidCcmlkZ2UgaG9zdCcsICAgICAgIHR5cGU6J3RleHQnLCAgIGRlZjonMTkyLjE2OC4xLjEwMCcgfSxcbiAgICAgICAgeyBrZXk6J3BvcnQnLCAgICAgIGxhYmVsOidUZWxlZ3JhbSBwb3J0JywgICAgIHR5cGU6J251bWJlcicsIGRlZjo0NzgwOCB9LFxuICAgICAgICB7IGtleToncG9sbF9tcycsICAgbGFiZWw6J1BvbGwgaW50ZXJ2YWwgKG1zKScsdHlwZTonbnVtYmVyJywgZGVmOjIwMDAgfSxcbiAgICBdLFxuICAgIGxpZ2h0aW5nOiAgIFtcbiAgICAgICAgeyBrZXk6J2dhdGV3YXknLCAgIGxhYmVsOidNb2RidXMgZ2F0ZXdheSBJUCcsIHR5cGU6J3RleHQnLCAgIGRlZjonMTAuMC4wLjUwJyB9LFxuICAgICAgICB7IGtleTondW5pdF9pZCcsICAgbGFiZWw6J1VuaXQgSUQnLCAgICAgICAgICAgdHlwZTonbnVtYmVyJywgZGVmOjEgfSxcbiAgICAgICAgeyBrZXk6J3RjcF9wb3J0JywgIGxhYmVsOidUQ1AgcG9ydCcsICAgICAgICAgIHR5cGU6J251bWJlcicsIGRlZjo1MDIgfSxcbiAgICBdLFxufTtcblxuZnVuY3Rpb24gUGx1Z2luc01vZGFsKHsgY2ZnLCBzZXRDZmcsIG9uQ2xvc2UsIG9uU2F2ZSB9KSB7XG4gICAgY29uc3QgQUxMID0gW1xuICAgICAgICB7IGlkOid3ZWF0aGVyJywgICAgIG5hbWU6J1dlYXRoZXInLCAgICAgICAgIGRlc2M6J09wZW4tTWV0ZW8gT0EgZmVlZCcsICAgICAgICAgIHZlcjonMi4xLjAnIH0sXG4gICAgICAgIHsgaWQ6J2dpdm9uaScsICAgICAgbmFtZTonR2l2b25pIEVuZ2luZScsICAgZGVzYzonQ2xpbWF0ZS1zdHJhdGVneSBvdmVybGF5JywgICAgdmVyOicxLjMuNCcgfSxcbiAgICAgICAgeyBpZDonc3dlZXRfc3BvdCcsICBuYW1lOidTd2VldC1TcG90IFJIJywgICBkZXNjOidBZGp1c3RhYmxlIFJIIGJhbmQnLCAgICAgICAgICB2ZXI6JzEuMC4xJyB9LFxuICAgICAgICB7IGlkOidnMzYnLCAgICAgICAgIG5hbWU6J0czNiBTZXF1ZW5jZXMnLCAgIGRlc2M6J0FTSFJBRSBHdWlkZWxpbmUgMzYnLCAgICAgICAgIHZlcjonMC45LjInIH0sXG4gICAgICAgIHsgaWQ6J2RpYnQnLCAgICAgICAgbmFtZTonRElCVCBCcmlkZ2UnLCAgICAgZGVzYzonRGVsdGEgQ29udHJvbHMgKERJQlQpIEJBQ25ldCBicmlkZ2UnLCAgICAgICAgICAgdmVyOicwLjQuMCcgfSxcbiAgICAgICAgeyBpZDonbGlnaHRpbmcnLCAgICBuYW1lOidMaWdodGluZyAoUmVkNSknLCBkZXNjOidWMy4wIE1vZGJ1cyBUQ1AgY2xpZW50JywgICAgICB2ZXI6JzAuMS4wLWJldGEnIH0sXG4gICAgXTtcbiAgICBjb25zdCB0b2dnbGUgPSAoaWQpID0+IHNldENmZyhjID0+ICh7XG4gICAgICAgIC4uLmMsXG4gICAgICAgIGVuYWJsZWQ6IGMuZW5hYmxlZC5pbmNsdWRlcyhpZCkgPyBjLmVuYWJsZWQuZmlsdGVyKHggPT4geCAhPT0gaWQpIDogWy4uLmMuZW5hYmxlZCwgaWRdXG4gICAgfSkpO1xuXG4gICAgLyogZXhwYW5zaW9uIHN0YXRlIOKAlCB3aGljaCBwbHVnLWluJ3MgXCJDb25maWd1cmVcIiBwYW5lbCBpcyBvcGVuICovXG4gICAgY29uc3QgW2V4cGFuZGVkSWQsIHNldEV4cGFuZGVkSWRdID0gUmVhY3QudXNlU3RhdGUobnVsbCk7XG5cbiAgICBjb25zdCB1cGRhdGVGaWVsZCA9IChwbHVnaW5JZCwgZmllbGRLZXksIHZhbHVlKSA9PiB7XG4gICAgICAgIHNldENmZyhjID0+ICh7XG4gICAgICAgICAgICAuLi5jLFxuICAgICAgICAgICAgZmllbGRzOiB7IC4uLihjLmZpZWxkcyB8fCB7fSksIFtwbHVnaW5JZF06IHsgLi4uKChjLmZpZWxkcyB8fCB7fSlbcGx1Z2luSWRdIHx8IHt9KSwgW2ZpZWxkS2V5XTogdmFsdWUgfSB9XG4gICAgICAgIH0pKTtcbiAgICB9O1xuXG4gICAgY29uc3QgZmllbGRWYWwgPSAocGx1Z2luSWQsIGZpZWxkKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0b3JlZCA9IGNmZy5maWVsZHMgJiYgY2ZnLmZpZWxkc1twbHVnaW5JZF0gJiYgY2ZnLmZpZWxkc1twbHVnaW5JZF1bZmllbGQua2V5XTtcbiAgICAgICAgcmV0dXJuIHN0b3JlZCAhPT0gdW5kZWZpbmVkID8gc3RvcmVkIDogZmllbGQuZGVmO1xuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8TW9kYWxTaGVsbCB0aXRsZT1cIlBsdWctaW4gU2V0dGluZ1wiIHN1YnRpdGxlPVwiRW5hYmxlLCB1cGxvYWQgb3IgbW9kaWZ5IHBsdWctaW5zXCIgYWNjZW50PVwicGlua1wiIG9uQ2xvc2U9e29uQ2xvc2V9IG9uU2F2ZT17b25TYXZlfSBzaXplPVwid2lkZVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTMgbWF4LWgtWzYwdmhdIG92ZXJmbG93LXktYXV0byBwci0xXCI+XG4gICAgICAgICAgICAgICAge0FMTC5tYXAocCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9uID0gY2ZnLmVuYWJsZWQuaW5jbHVkZXMocC5pZCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4cGFuZGVkID0gZXhwYW5kZWRJZCA9PT0gcC5pZDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmllbGRzID0gUExVR0lOX0NPTkZJR19GSUVMRFNbcC5pZF0gfHwgW107XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17cC5pZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcm91bmRlZC14bCBib3JkZXIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtvbiA/ICdib3JkZXItcGluay01MDAvNDAgYmctcGluay05MDAvMTAnIDogJ2JvcmRlci1zbGF0ZS03MDAgYmctc2xhdGUtODAwLzQwJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtleHBhbmRlZCA/ICdyaW5nLTEgcmluZy1waW5rLTUwMC8zMCcgOiAnJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBwLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LWJsYWNrIHRleHQtc2xhdGUtMTAwXCI+e3AubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtbC0yIHRleHQtWzEwcHhdIGZvbnQtbW9ubyB0ZXh0LXNsYXRlLTUwMFwiPnZ7cC52ZXJ9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS00MDBcIj57cC5kZXNjfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB0b2dnbGUocC5pZCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgcGx1Z2luLXRvZ2dsZS0ke3AuaWR9YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHgtMyBweS0xIHJvdW5kZWQtbWQgdGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIGJvcmRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtvbiA/ICdib3JkZXItcGluay01MDAvNjAgdGV4dC1waW5rLTMwMCBiZy1waW5rLTkwMC8zMCcgOiAnYm9yZGVyLXNsYXRlLTYwMCB0ZXh0LXNsYXRlLTQwMCBiZy1zbGF0ZS04MDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtvbiA/ICdFbmFibGVkJyA6ICdEaXNhYmxlZCd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gc2V0RXhwYW5kZWRJZChleHBhbmRlZCA/IG51bGwgOiBwLmlkKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BwbHVnaW4tY29uZmlnLSR7cC5pZH1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweC0zIHB5LTEgcm91bmRlZC1tZCB0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgYm9yZGVyIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2V4cGFuZGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYm9yZGVyLXBpbmstNTAwIGJnLXBpbmstOTAwLzMwIHRleHQtcGluay0yMDAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYm9yZGVyLXNsYXRlLTYwMCB0ZXh0LXNsYXRlLTQwMCBiZy1zbGF0ZS04MDAgaG92ZXI6Ymctc2xhdGUtNzAwIGhvdmVyOmJvcmRlci1waW5rLTUwMC81MCBob3Zlcjp0ZXh0LXBpbmstMzAwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZXhwYW5kZWQgPyAnQ2xvc2Ug4pa0JyA6ICdDb25maWd1cmUg4pa+J31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZXhwYW5kZWQgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB4LTQgcGItNCBib3JkZXItdCBib3JkZXItcGluay01MDAvMjAgYmctc2xhdGUtOTUwLzQwXCIgZGF0YS10ZXN0aWQ9e2BwbHVnaW4tY29uZmlnLXBhbmVsLSR7cC5pZH1gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmaWVsZHMubGVuZ3RoID09PSAwID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS01MDAgaXRhbGljIHB5LTNcIj5ObyBjb25maWd1cmFibGUgb3B0aW9ucyBmb3IgdGhpcyBwbHVnLWluIHlldC48L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBtZDpncmlkLWNvbHMtMiBnYXAtMyBwdC0zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmaWVsZHMubWFwKGYgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdiA9IGZpZWxkVmFsKHAuaWQsIGYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17Zi5rZXl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJvbGQgdGV4dC1zbGF0ZS01MDAgYmxvY2sgbWItMVwiPntmLmxhYmVsfTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmLnR5cGUgPT09ICdzZWxlY3QnICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXQgY3Vyc29yLXBvaW50ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGVGaWVsZChwLmlkLCBmLmtleSwgZS50YXJnZXQudmFsdWUpfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi5vcHRpb25zLm1hcChvID0+IDxvcHRpb24ga2V5PXtvfSB2YWx1ZT17b30+e299PC9vcHRpb24+KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi50eXBlID09PSAnbnVtYmVyJyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cIm51bWJlclwiIGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZUZpZWxkKHAuaWQsIGYua2V5LCArZS50YXJnZXQudmFsdWUpfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmLnR5cGUgPT09ICd0ZXh0JyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3Z9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGVGaWVsZChwLmlkLCBmLmtleSwgZS50YXJnZXQudmFsdWUpfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmLnR5cGUgPT09ICd0b2dnbGUnICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gdXBkYXRlRmllbGQocC5pZCwgZi5rZXksICF2KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdy1mdWxsIHB5LTIgcm91bmRlZC1sZyB0ZXh0LXhzIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBib3JkZXIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7dlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLXBpbmstNzAwLzQwIGJvcmRlci1waW5rLTUwMC82MCB0ZXh0LXBpbmstMjAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLXNsYXRlLTgwMCBib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtNDAwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7diA/ICdPTicgOiAnT0ZGJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWVuZCBnYXAtMiBtdC00IHB0LTMgYm9yZGVyLXQgYm9yZGVyLXNsYXRlLTgwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlc2V0IHRoaXMgcGx1Zy1pbidzIGZpZWxkcyB0byBkZWZhdWx0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldENmZyhjID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV4dCA9IHsgLi4uKGMuZmllbGRzIHx8IHt9KSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgbmV4dFtwLmlkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgLi4uYywgZmllbGRzOiBuZXh0IH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtMyBweS0xLjUgcm91bmRlZC1tZCB0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgYm9yZGVyIGJvcmRlci1zbGF0ZS02MDAgdGV4dC1zbGF0ZS00MDAgaG92ZXI6Ymctc2xhdGUtODAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlc2V0IGRlZmF1bHRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBzZXRFeHBhbmRlZElkKG51bGwpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtMyBweS0xLjUgcm91bmRlZC1tZCB0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgYmctcGluay02MDAgaG92ZXI6YmctcGluay01MDAgdGV4dC13aGl0ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEb25lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNSBwLTQgYm9yZGVyLTIgYm9yZGVyLWRhc2hlZCBib3JkZXItc2xhdGUtNzAwIHJvdW5kZWQteGwgdGV4dC1jZW50ZXIgaG92ZXI6Ym9yZGVyLXBpbmstNTAwLzQwIHRyYW5zaXRpb24tYWxsIGN1cnNvci1wb2ludGVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LTN4bCBtYi0xXCI+4qS0PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS0zMDBcIj5Ecm9wIGEgLnB5IC8gLnppcCAvIC5yZWQ1IHBsdWctaW4gaGVyZTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTFweF0gdGV4dC1zbGF0ZS01MDAgbXQtMVwiPm9yIGNsaWNrIHRvIGNob29zZSBhIGZpbGUgKG1vY2sg4oCUIG5vdCB3aXJlZCk8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L01vZGFsU2hlbGw+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTW9kYWwgU2hlbGwgLS0gc2hhcmVkXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5mdW5jdGlvbiBNb2RhbFNoZWxsKHsgdGl0bGUsIHN1YnRpdGxlLCBhY2NlbnQ9J2luZGlnbycsIG9uQ2xvc2UsIG9uU2F2ZSwgc2l6ZT0nJywgY2hpbGRyZW4gfSkge1xuICAgIGNvbnN0IGNvbG9yTWFwID0ge1xuICAgICAgICBpbmRpZ286JyM4MThjZjgnLCBhbWJlcjonI2ZiYmYyNCcsIGVtZXJhbGQ6JyMzNGQzOTknLCBwaW5rOicjZjQ3MmI2J1xuICAgIH07XG4gICAgY29uc3QgYyA9IGNvbG9yTWFwW2FjY2VudF0gfHwgJyM4MThjZjgnO1xuICAgIGNvbnN0IHNpemVNYXAgPSB7XG4gICAgICAgIHdpZGU6ICdtYXgtdy0yeGwnLFxuICAgICAgICBtYXA6ICAnbWF4LXctM3hsJyxcbiAgICAgICAgbWF4OiAgJ21heC13LVs5NnZ3XSB3LVs5NnZ3XSBoLVs5MnZoXScsXG4gICAgfTtcbiAgICBjb25zdCB3aWR0aCA9IHNpemVNYXBbc2l6ZV0gfHwgJ21heC13LW1kJztcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpeGVkIGluc2V0LTAgei01MCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBtb2RhbC1iYWNrZHJvcFwiIG9uQ2xpY2s9e29uQ2xvc2V9PlxuICAgICAgICAgICAgey8qIEZsZXgtY29sdW1uIHNoZWxsOiBoZWFkZXIgKGZpeGVkKSArIHNjcm9sbGFibGUgY29udGVudCArIHN0aWNreSBmb290ZXIuXG4gICAgICAgICAgICAgICAgQ3JpdGljYWwgZm9yIHNpemU9XCJtYXhcIiB3aGVyZSBjaGlsZHJlbiBhbG9uZSBleGNlZWQgdGhlIG1vZGFsIGhlaWdodFxuICAgICAgICAgICAgICAgIGFuZCB3b3VsZCBvdGhlcndpc2UgcHVzaCB0aGUgU2F2ZSAmIHJldHVybiBidXR0b24gYmVsb3cgdGhlIHZpZXdwb3J0LiAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgYmctc2xhdGUtOTAwIGJvcmRlci0yIHJvdW5kZWQtMnhsIHctZnVsbCAke3dpZHRofSBteC00IGZhZGUtdXAgZmxleCBmbGV4LWNvbGB9XG4gICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpfVxuICAgICAgICAgICAgICAgICBzdHlsZT17e2JvcmRlckNvbG9yOmAke2N9NjZgLCBtYXhIZWlnaHQ6ICc5MnZoJ319PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1zdGFydCBqdXN0aWZ5LWJldHdlZW4gcC02IHBiLTQgYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTgwMC82MCBzaHJpbmstMFwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtbGcgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0XCIgc3R5bGU9e3tjb2xvcjpjfX0+e3RpdGxlfTwvaDM+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtc2xhdGUtNTAwIG10LTFcIj57c3VidGl0bGV9PC9wPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cIm1vZGFsLWNsb3NlXCIgb25DbGljaz17b25DbG9zZX0gY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgaG92ZXI6dGV4dC13aGl0ZSB0ZXh0LTJ4bCBsZWFkaW5nLW5vbmVcIj7DlzwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xIG1pbi1oLTAgb3ZlcmZsb3cteS1hdXRvIHB4LTYgcHktNVwiPlxuICAgICAgICAgICAgICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWVuZCBnYXAtMyBweC02IHB5LTQgYm9yZGVyLXQgYm9yZGVyLXNsYXRlLTgwMCBzaHJpbmstMCBiZy1zbGF0ZS05MDAgcm91bmRlZC1iLTJ4bFwiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwibW9kYWwtY2FuY2VsXCIgb25DbGljaz17b25DbG9zZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC00IHB5LTIgcm91bmRlZC1sZyBiZy1zbGF0ZS04MDAgYm9yZGVyIGJvcmRlci1zbGF0ZS03MDAgdGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS00MDAgaG92ZXI6Ymctc2xhdGUtNzAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICBDYW5jZWxcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJtb2RhbC1zYXZlXCIgb25DbGljaz17b25TYXZlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTUgcHktMiByb3VuZGVkLWxnIHRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIHRleHQtd2hpdGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7YmFja2dyb3VuZDpjLCBib3hTaGFkb3c6YDAgMCAxMnB4ICR7Y301NWB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIFNhdmUgJiByZXR1cm4g4pyTXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbi8qIG1vdW50ICovXG5SZWFjdERPTS5jcmVhdGVSb290KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290JykpLnJlbmRlcig8QXBwLz4pO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQUEsTUFBQSxHQUE4QkMsS0FBSztFQUEzQkMsUUFBUSxHQUFBRixNQUFBLENBQVJFLFFBQVE7RUFBRUMs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