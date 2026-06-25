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
  var _useState1 = useState({
      lang: 'en'
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
    className: "tile-btn relative text-left bg-slate-900/70 border-2 border-slate-700/70\n                            rounded-2xl p-6 sm:p-7 ".concat(done ? 'done' : '')
  }, done && /*#__PURE__*/React.createElement("span", {
    className: "check"
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
      window.dispatchEvent(new CustomEvent('r5-rh-band-change', {
        detail: {
          lo: cfg.rhLo,
          hi: cfg.rhHi
        }
      }));
      console.info('[setup walk] psy chart saved -> RH', cfg.rhLo, '-', cfg.rhHi, '%  preset=', cfg.rhPreset);
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
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-slate-900/60 border border-slate-800 rounded-2xl p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pill bg-slate-800 text-slate-400"
  }, "PSYCHROMETRIC CHART \xB7 live preview"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-500 font-mono"
  }, T_MIN, "\xB0C \u2192 ", T_MAX, "\xB0C  \xB7  ", cfg.rhLo, "\u2013", cfg.rhHi, "% RH")), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 ".concat(W, " ").concat(H),
    className: "w-full h-auto",
    style: {
      background: '#0b1220',
      borderRadius: 8
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
      stroke: "#1e293b",
      strokeWidth: "0.6"
    }), /*#__PURE__*/React.createElement("text", {
      x: x(t),
      y: pad.top + gridH + 16,
      fontSize: "9.5",
      fill: "#94a3b8",
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
      stroke: "#1e293b",
      strokeWidth: "0.6"
    }), /*#__PURE__*/React.createElement("text", {
      x: pad.left - 8,
      y: y(w) + 3,
      fontSize: "9.5",
      fill: "#94a3b8",
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
    fill: "#cbd5e1",
    textAnchor: "middle",
    fontWeight: "800",
    letterSpacing: "2"
  }, "DRY BULB TEMP (\xB0C)"), /*#__PURE__*/React.createElement("text", {
    x: 16,
    y: pad.top + gridH / 2,
    fontSize: "11",
    fill: "#cbd5e1",
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

  /* ----- search state ----- */
  var _React$useState3 = React.useState(''),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    searchQ = _React$useState4[0],
    setSearchQ = _React$useState4[1];
  var _React$useState5 = React.useState([]),
    _React$useState6 = _slicedToArray(_React$useState5, 2),
    searchHits = _React$useState6[0],
    setSearchHits = _React$useState6[1];
  var _React$useState7 = React.useState(false),
    _React$useState8 = _slicedToArray(_React$useState7, 2),
    searchBusy = _React$useState8[0],
    setSearchBusy = _React$useState8[1];
  var _React$useState9 = React.useState(false),
    _React$useState0 = _slicedToArray(_React$useState9, 2),
    searchOpen = _React$useState0[0],
    setSearchOpen = _React$useState0[1];
  var searchDebounceRef = React.useRef(null);

  /* Forward-geocode: query -> [{lat, lon, display_name, type, ...}] */
  var runSearch = /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator(function* (q) {
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
      return _ref7.apply(this, arguments);
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
    var _ref8 = _asyncToGenerator(function* (lat, lon) {
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
      return _ref8.apply(this, arguments);
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
  var useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(pos => {
      var lat = Math.round(pos.coords.latitude * 10000) / 10000;
      var lon = Math.round(pos.coords.longitude * 10000) / 10000;
      setCfg(c => _objectSpread(_objectSpread({}, c), {}, {
        lat,
        lon
      }));
      if (mapRef.current) mapRef.current.setView([lat, lon], 11);
      reverseGeocode(lat, lon);
    }, err => {/* user denied or unavailable -> no-op */});
  };

  /* When user clicks "Save & return", POST the selection to the same
   * /api/weather-location endpoint the dashboard reads.  Setting BOTH
   * `active` and `default` means the weather strip on the dashboard
   * loads this location immediately on next page load (and stays pinned
   * for any future fresh sessions).  Anonymous users get a soft warning
   * back from the server -- we still call onSave() either way. */
  var persistAndSave = /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator(function* () {
      var loc = {
        lat: cfg.lat,
        lon: cfg.lon,
        name: cfg.siteName || cfg.city
      };
      try {
        var r = yield fetch('/api/weather-location', {
          method: 'POST',
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
        console.info('[setup walk] /api/weather-location <-', j);
      } catch (e) {
        console.warn('[setup walk] could not persist location:', e);
      }
      onSave();
    });
    return function persistAndSave() {
      return _ref9.apply(this, arguments);
    };
  }();
  return /*#__PURE__*/React.createElement(ModalShell, {
    title: "Location Setting",
    subtitle: "Click the map, drag the pin, or use your device",
    accent: "amber",
    onClose: onClose,
    onSave: persistAndSave,
    size: "max"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 h-full",
    style: {
      minHeight: '70vh'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("div", {
    ref: mapBoxRef,
    style: {
      height: '100%',
      minHeight: '70vh',
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
  }, "Site name (saved)"), /*#__PURE__*/React.createElement("input", {
    className: "field-input",
    value: cfg.siteName || '',
    placeholder: "e.g. HQ Tower, North Wing, Pavilion B\u2026",
    onChange: e => setCfg(_objectSpread(_objectSpread({}, cfg), {}, {
      siteName: e.target.value
    }))
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-500 mt-1 italic"
  }, "Your label for this place \u2014 shown on the dashboard header.")), /*#__PURE__*/React.createElement("div", {
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
    className: "w-full py-2.5 rounded-lg bg-amber-700/70 border border-amber-500/40 text-xs font-black uppercase tracking-widest text-amber-50 hover:bg-amber-600/70"
  }, "\uD83D\uDCCD  Use my device location"), /*#__PURE__*/React.createElement("div", {
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
function LanguageModal(_ref0) {
  var cfg = _ref0.cfg,
    setCfg = _ref0.setCfg,
    onClose = _ref0.onClose,
    onSave = _ref0.onSave;
  var langs = [{
    code: 'en',
    label: 'English',
    native: 'English'
  }, {
    code: 'fr',
    label: 'French',
    native: 'Français'
  }, {
    code: 'es',
    label: 'Spanish',
    native: 'Español'
  }, {
    code: 'zh',
    label: 'Chinese',
    native: '中文'
  }, {
    code: 'ja',
    label: 'Japanese',
    native: '日本語'
  }, {
    code: 'de',
    label: 'German',
    native: 'Deutsch'
  }];
  return /*#__PURE__*/React.createElement(ModalShell, {
    title: "Language Setting",
    subtitle: "Pick your default interface language",
    accent: "emerald",
    onClose: onClose,
    onSave: onSave
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
function PluginsModal(_ref1) {
  var cfg = _ref1.cfg,
    setCfg = _ref1.setCfg,
    onClose = _ref1.onClose,
    onSave = _ref1.onSave;
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
  var _React$useState1 = React.useState(null),
    _React$useState10 = _slicedToArray(_React$useState1, 2),
    expandedId = _React$useState10[0],
    setExpandedId = _React$useState10[1];
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
function ModalShell(_ref10) {
  var title = _ref10.title,
    subtitle = _ref10.subtitle,
    _ref10$accent = _ref10.accent,
    accent = _ref10$accent === void 0 ? 'indigo' : _ref10$accent,
    onClose = _ref10.onClose,
    onSave = _ref10.onSave,
    _ref10$size = _ref10.size,
    size = _ref10$size === void 0 ? '' : _ref10$size,
    children = _ref10.children;
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
    className: "bg-slate-900 border-2 rounded-2xl w-full ".concat(width, " mx-4 p-6 fade-up"),
    onClick: e => e.stopPropagation(),
    style: {
      borderColor: "".concat(c, "66")
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between mb-5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-black uppercase tracking-widest",
    style: {
      color: c
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 mt-1"
  }, subtitle)), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "text-slate-500 hover:text-white text-2xl leading-none"
  }, "\xD7")), children, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs uppercase tracking-widest font-black text-slate-400 hover:bg-slate-700"
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBfd2Fsay5jb21waWxlZC5qcyIsIm5hbWVzIjpbIl9SZWFjdCIsIlJlYWN0IiwidXNlU3RhdGUiLCJ1c2VNZW1vIiwiU1RFUFMiLCJrZXkiLCJsYWJlbCIsInN1YiIsImtpbmQiLCJpY29uQ29sb3IiLCJhY2NlbnQiLCJBcHAiLCJfdXNlU3RhdGUiLCJwc3kiLCJsb2NhdGlvbiIsImxhbmd1YWdlIiwicGx1Z2lucyIsIl91c2VTdGF0ZTIiLCJfc2xpY2VkVG9BcnJheSIsImRvbmUiLCJzZXREb25lIiwiX3VzZVN0YXRlMyIsIl91c2VTdGF0ZTQiLCJyb3V0ZSIsInNldFJvdXRlIiwiX3VzZVN0YXRlNSIsIl91c2VTdGF0ZTYiLCJtb2RhbCIsInNldE1vZGFsIiwiX3VzZVN0YXRlNyIsImdpdm9uaSIsInJoUHJlc2V0IiwicmhMbyIsInJoSGkiLCJ0TG8iLCJ0SGkiLCJ0aGVtZSIsImRhcmtMZXZlbCIsIl91c2VTdGF0ZTgiLCJwc3lDZmciLCJzZXRQc3lDZmciLCJfdXNlU3RhdGU5Iiwic2l0ZU5hbWUiLCJjaXR5IiwibGF0IiwibG9uIiwiX3VzZVN0YXRlMCIsImxvY0NmZyIsInNldExvY0NmZyIsIl91c2VTdGF0ZTEiLCJsYW5nIiwiX3VzZVN0YXRlMTAiLCJsYW5nQ2ZnIiwic2V0TGFuZ0NmZyIsIl91c2VTdGF0ZTExIiwiZW5hYmxlZCIsIl91c2VTdGF0ZTEyIiwicGx1Z2luQ2ZnIiwic2V0UGx1Z2luQ2ZnIiwiY29tcGxldGVDb3VudCIsIk9iamVjdCIsInZhbHVlcyIsImZpbHRlciIsIkJvb2xlYW4iLCJsZW5ndGgiLCJmaW5pc2giLCJkIiwiX29iamVjdFNwcmVhZCIsImNyZWF0ZUVsZW1lbnQiLCJQc3lDaGFydFNldHRpbmdQYWdlIiwiY2ZnIiwic2V0Q2ZnIiwib25CYWNrIiwib25TYXZlIiwiY2xhc3NOYW1lIiwiaHJlZiIsIm9uQ2xpY2siLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiZSIsInN0eWxlIiwiYW5pbWF0aW9uRGVsYXkiLCJtYXAiLCJzIiwiaSIsIlRpbGUiLCJzdGVwIiwiaW5kZXgiLCJjb25jYXQiLCJMb2NhdGlvbk1vZGFsIiwib25DbG9zZSIsIkxhbmd1YWdlTW9kYWwiLCJQbHVnaW5zTW9kYWwiLCJfcmVmIiwiYmFja2dyb3VuZCIsImJvcmRlciIsIlRpbGVJY29uIiwiY29sb3IiLCJfcmVmMiIsInN0cm9rZSIsImZpbGwiLCJzdHJva2VXaWR0aCIsInN0cm9rZUxpbmVjYXAiLCJzdHJva2VMaW5lam9pbiIsIl9leHRlbmRzIiwid2lkdGgiLCJoZWlnaHQiLCJ2aWV3Qm94IiwiY3giLCJjeSIsInIiLCJfcmVmMyIsInVwZGF0ZSIsImsiLCJ2IiwiYyIsInVzZUVmZmVjdCIsInJhdyIsImdldEl0ZW0iLCJwcmVzZXQiLCJwYXRjaCIsInAiLCJKU09OIiwicGFyc2UiLCJOdW1iZXIiLCJpc0Zpbml0ZSIsImxvIiwiaGkiLCJSSF9QUkVTRVRTIiwiZmluZCIsIngiLCJpZCIsInRoIiwiZGwiLCJwYXJzZUZsb2F0Iiwia2V5cyIsInBlcnNpc3RBbmRTYXZlIiwic3RyaW5naWZ5IiwiU3RyaW5nIiwid2luZG93IiwiZGlzcGF0Y2hFdmVudCIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwiY29uc29sZSIsImluZm8iLCJ3YXJuIiwiUHN5U2tlbGV0b24iLCJQc3lDb250cm9sUGFuZWwiLCJub3RlIiwiX3JlZjQiLCJXIiwiSCIsInBhZCIsImxlZnQiLCJyaWdodCIsInRvcCIsImJvdHRvbSIsImdyaWRXIiwiZ3JpZEgiLCJUX01JTiIsIlRfTUFYIiwiV19NSU4iLCJXX01BWCIsInQiLCJ5IiwidyIsIl9nZXRXIiwiZ2V0VyIsInJoIiwic2FmZVB0cyIsImFyciIsInRvRml4ZWQiLCJqb2luIiwicmg4MCIsInB1c2giLCJyaDEwMCIsInJoMjBMaW5lIiwicmgyMF9DWiIsIkNaIiwicmhIaV90b3AiLCJ0dCIsInJoTG9fYm90IiwiU1dFRVQiLCJOViIsIk1hc3MiLCJNQ1YiLCJFVkFQIiwid2ludGVyUkg4MCIsIndpbnRlclJIMjAiLCJXSU5URVIiLCJpc29wbGV0aHMiLCJib3JkZXJSYWRpdXMiLCJBcnJheSIsImZyb20iLCJfIiwieDEiLCJ5MSIsIngyIiwieTIiLCJmb250U2l6ZSIsInRleHRBbmNob3IiLCJwdHMiLCJ3dyIsInBvaW50cyIsInN0cm9rZURhc2hhcnJheSIsIk1hdGgiLCJmbG9vciIsImZvbnRXZWlnaHQiLCJvcGFjaXR5IiwiZmlsbE9wYWNpdHkiLCJjbGlwUGF0aFVuaXRzIiwiY2xpcFBhdGgiLCJ0cmFuc2Zvcm0iLCJsZXR0ZXJTcGFjaW5nIiwicGFpbnRPcmRlciIsIl9yZWY1IiwibWluIiwicm91bmQiLCJ0eXBlIiwibWF4IiwidmFsdWUiLCJvbkNoYW5nZSIsInRhcmdldCIsImFjY2VudENvbG9yIiwiX3JlZjYiLCJtYXBCb3hSZWYiLCJ1c2VSZWYiLCJtYXBSZWYiLCJtYXJrZXJSZWYiLCJfUmVhY3QkdXNlU3RhdGUiLCJfUmVhY3QkdXNlU3RhdGUyIiwiZ2VvQnVzeSIsInNldEdlb0J1c3kiLCJfUmVhY3QkdXNlU3RhdGUzIiwiX1JlYWN0JHVzZVN0YXRlNCIsInNlYXJjaFEiLCJzZXRTZWFyY2hRIiwiX1JlYWN0JHVzZVN0YXRlNSIsIl9SZWFjdCR1c2VTdGF0ZTYiLCJzZWFyY2hIaXRzIiwic2V0U2VhcmNoSGl0cyIsIl9SZWFjdCR1c2VTdGF0ZTciLCJfUmVhY3QkdXNlU3RhdGU4Iiwic2VhcmNoQnVzeSIsInNldFNlYXJjaEJ1c3kiLCJfUmVhY3QkdXNlU3RhdGU5IiwiX1JlYWN0JHVzZVN0YXRlMCIsInNlYXJjaE9wZW4iLCJzZXRTZWFyY2hPcGVuIiwic2VhcmNoRGVib3VuY2VSZWYiLCJydW5TZWFyY2giLCJfcmVmNyIsIl9hc3luY1RvR2VuZXJhdG9yIiwicSIsInRyaW0iLCJ1cmwiLCJlbmNvZGVVUklDb21wb25lbnQiLCJmZXRjaCIsImhlYWRlcnMiLCJqIiwianNvbiIsImlzQXJyYXkiLCJfeCIsImFwcGx5IiwiYXJndW1lbnRzIiwiY3VycmVudCIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJwaWNrU2VhcmNoSGl0IiwiaGl0IiwiZGlzcGxheV9uYW1lIiwic2V0VmlldyIsInJldmVyc2VHZW9jb2RlIiwiX3JlZjgiLCJhIiwiYWRkcmVzcyIsInRvd24iLCJ2aWxsYWdlIiwiaGFtbGV0IiwiY291bnR5IiwicmVnaW9uIiwic3RhdGUiLCJjb3VudHJ5IiwiX3gyIiwiX3gzIiwiTCIsInpvb21Db250cm9sIiwiYXR0cmlidXRpb25Db250cm9sIiwidGlsZUxheWVyIiwibWF4Wm9vbSIsImF0dHJpYnV0aW9uIiwiYWRkVG8iLCJtYXJrZXIiLCJkcmFnZ2FibGUiLCJiaW5kVG9vbHRpcCIsInBlcm1hbmVudCIsImFwcGx5TGF0TG9uIiwibiIsIm9uIiwibGwiLCJnZXRMYXRMbmciLCJsbmciLCJzZXRMYXRMbmciLCJsYXRsbmciLCJpbnZhbGlkYXRlU2l6ZSIsInJlbW92ZSIsInBhblRvIiwidXNlTXlMb2NhdGlvbiIsIm5hdmlnYXRvciIsImdlb2xvY2F0aW9uIiwiZ2V0Q3VycmVudFBvc2l0aW9uIiwicG9zIiwiY29vcmRzIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJlcnIiLCJfcmVmOSIsImxvYyIsIm5hbWUiLCJtZXRob2QiLCJib2R5IiwiYWN0aXZlIiwiZGVmYXVsdCIsIl9sYXN0V2VhdGhlckxvY2F0aW9uU2F2ZSIsIk1vZGFsU2hlbGwiLCJ0aXRsZSIsInN1YnRpdGxlIiwic2l6ZSIsIm1pbkhlaWdodCIsInJlZiIsIm92ZXJmbG93Iiwib25Gb2N1cyIsInBsYWNlaG9sZGVyIiwib3V0bGluZSIsImgiLCJwbGFjZV9pZCIsImNsYXNzIiwieiIsIl9yZWYwIiwibGFuZ3MiLCJjb2RlIiwibmF0aXZlIiwibCIsIlBMVUdJTl9DT05GSUdfRklFTERTIiwid2VhdGhlciIsIm9wdGlvbnMiLCJkZWYiLCJzd2VldF9zcG90IiwiZzM2IiwiZGlidCIsImxpZ2h0aW5nIiwiX3JlZjEiLCJBTEwiLCJkZXNjIiwidmVyIiwidG9nZ2xlIiwiaW5jbHVkZXMiLCJfUmVhY3QkdXNlU3RhdGUxIiwiX1JlYWN0JHVzZVN0YXRlMTAiLCJleHBhbmRlZElkIiwic2V0RXhwYW5kZWRJZCIsInVwZGF0ZUZpZWxkIiwicGx1Z2luSWQiLCJmaWVsZEtleSIsImZpZWxkcyIsImZpZWxkVmFsIiwiZmllbGQiLCJzdG9yZWQiLCJ1bmRlZmluZWQiLCJleHBhbmRlZCIsImYiLCJvIiwibmV4dCIsIl9yZWYxMCIsIl9yZWYxMCRhY2NlbnQiLCJfcmVmMTAkc2l6ZSIsImNoaWxkcmVuIiwiY29sb3JNYXAiLCJpbmRpZ28iLCJhbWJlciIsImVtZXJhbGQiLCJwaW5rIiwic2l6ZU1hcCIsIndpZGUiLCJzdG9wUHJvcGFnYXRpb24iLCJib3JkZXJDb2xvciIsImJveFNoYWRvdyIsIlJlYWN0RE9NIiwiY3JlYXRlUm9vdCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJyZW5kZXIiXSwic291cmNlcyI6WyIuLi9zcmMvc2V0dXAtd2Fsay9zZXR1cF93YWxrLmpzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB7IHVzZVN0YXRlLCB1c2VNZW1vIH0gPSBSZWFjdDtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogU1RFUCBERUZJTklUSU9OUyDigJQgdGhlIDQgd2FsayBwYXRocyB0aGUgdXNlciBkZXNjcmliZWRcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmNvbnN0IFNURVBTID0gW1xuICAgIHsga2V5Oidwc3knLCAgICAgIGxhYmVsOidQc3kgQ2hhcnQgU2V0dGluZycsICAgIHN1YjonR2l2b25pIMK3IFJIIHJhbmdlIMK3IGF4aXMgcmFuZ2UnLCBraW5kOidwYWdlJywgIGljb25Db2xvcjonIzgxOGNmOCcsIGFjY2VudDonaW5kaWdvJyB9LFxuICAgIHsga2V5Oidsb2NhdGlvbicsIGxhYmVsOidMb2NhdGlvbiBTZXR0aW5nJywgICAgIHN1YjonQ2l0eSBuYW1lICYgbGF0IC8gbG9uZycsICAgICAgICAga2luZDonbW9kYWwnLCBpY29uQ29sb3I6JyNmYmJmMjQnLCBhY2NlbnQ6J2FtYmVyJyB9LFxuICAgIHsga2V5OidsYW5ndWFnZScsIGxhYmVsOidMYW5ndWFnZSBTZXR0aW5nJywgICAgIHN1YjonRU4gwrcgRlIgwrcgRVMgwrcgWkggwrcg4oCmJywgICAgICAgICAga2luZDonbW9kYWwnLCBpY29uQ29sb3I6JyMzNGQzOTknLCBhY2NlbnQ6J2VtZXJhbGQnIH0sXG4gICAgeyBrZXk6J3BsdWdpbnMnLCAgbGFiZWw6J1BsdWctaW4gU2V0dGluZycsICAgICAgc3ViOidMaXN0IMK3IHVwbG9hZCDCtyBtb2RpZnknLCAgICAgICAgIGtpbmQ6J21vZGFsJywgaWNvbkNvbG9yOicjZjQ3MmI2JywgYWNjZW50OidwaW5rJyB9LFxuXTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogUk9PVCBBUFBcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIEFwcCgpIHtcbiAgICAvKiBjb21wbGV0aW9uICsgcGVyLXN0ZXAgY29uZmlnIC0tIG1vY2t1cCBzdGF0ZSwgbmV2ZXIgcGVyc2lzdGVkICovXG4gICAgY29uc3QgW2RvbmUsIHNldERvbmVdID0gdXNlU3RhdGUoeyBwc3k6ZmFsc2UsIGxvY2F0aW9uOmZhbHNlLCBsYW5ndWFnZTpmYWxzZSwgcGx1Z2luczpmYWxzZSB9KTtcbiAgICBjb25zdCBbcm91dGUsIHNldFJvdXRlXSA9IHVzZVN0YXRlKCdodWInKTsgICAvLyAnaHViJyB8ICdwc3knXG4gICAgY29uc3QgW21vZGFsLCBzZXRNb2RhbF0gPSB1c2VTdGF0ZShudWxsKTsgICAgIC8vICdsb2NhdGlvbicgfCAnbGFuZ3VhZ2UnIHwgJ3BsdWdpbnMnIHwgbnVsbFxuXG4gICAgY29uc3QgW3BzeUNmZywgc2V0UHN5Q2ZnXSAgICAgICAgID0gdXNlU3RhdGUoeyBnaXZvbmk6dHJ1ZSwgcmhQcmVzZXQ6J29mZmljZScsIHJoTG86MzAsIHJoSGk6NjAsIHRMbzotMTUsIHRIaTo1MCwgdGhlbWU6J2RhcmsnLCBkYXJrTGV2ZWw6Mi4wIH0pO1xuICAgIGNvbnN0IFtsb2NDZmcsIHNldExvY0NmZ10gICAgICAgICA9IHVzZVN0YXRlKHsgc2l0ZU5hbWU6J015IEJ1aWxkaW5nJywgY2l0eTonVG9yb250bywgT04nLCBsYXQ6NDMuNjUzMiwgbG9uOi03OS4zODMyIH0pO1xuICAgIGNvbnN0IFtsYW5nQ2ZnLCBzZXRMYW5nQ2ZnXSAgICAgICA9IHVzZVN0YXRlKHsgbGFuZzonZW4nIH0pO1xuICAgIGNvbnN0IFtwbHVnaW5DZmcsIHNldFBsdWdpbkNmZ10gICA9IHVzZVN0YXRlKHsgZW5hYmxlZDpbJ3dlYXRoZXInLCdnaXZvbmknLCdzd2VldF9zcG90J10gfSk7XG5cbiAgICBjb25zdCBjb21wbGV0ZUNvdW50ID0gT2JqZWN0LnZhbHVlcyhkb25lKS5maWx0ZXIoQm9vbGVhbikubGVuZ3RoO1xuXG4gICAgY29uc3QgZmluaXNoID0gKGtleSkgPT4ge1xuICAgICAgICBzZXREb25lKGQgPT4gKHsuLi5kLCBba2V5XTp0cnVlfSkpO1xuICAgICAgICBzZXRSb3V0ZSgnaHViJyk7XG4gICAgICAgIHNldE1vZGFsKG51bGwpO1xuICAgIH07XG5cbiAgICAvKiBmdWxsLXBhZ2UgUHN5IENoYXJ0IGVkaXRvciAqL1xuICAgIGlmIChyb3V0ZSA9PT0gJ3BzeScpIHtcbiAgICAgICAgcmV0dXJuIDxQc3lDaGFydFNldHRpbmdQYWdlIGNmZz17cHN5Q2ZnfSBzZXRDZmc9e3NldFBzeUNmZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQmFjaz17KCkgPT4gc2V0Um91dGUoJ2h1YicpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXsoKSA9PiBmaW5pc2goJ3BzeScpfSAvPjtcbiAgICB9XG5cbiAgICAvKiBkZWZhdWx0OiBIVUIgc2NyZWVuICovXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtaW4taC1zY3JlZW4gcHgtNiBweS04XCI+XG4gICAgICAgICAgICB7LyogLS0tLS0tLS0tLS0tLSBoZWFkZXIgLS0tLS0tLS0tLS0tLSAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctNXhsIG14LWF1dG8gZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIG1iLTEwIGZhZGUtdXBcIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwidGV4dC0yeGwgc206dGV4dC0zeGwgZm9udC1ibGFjayBpdGFsaWMgdXBwZXJjYXNlIHRyYWNraW5nLXRpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXJlZC01MDBcIj5SZWQ1PC9zcGFuPiA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlXCI+U3R1ZGlvPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgZm9udC1ub3JtYWwgaXRhbGljXCI+ICZuYnNwOy8mbmJzcDsgc2V0dXAgd2Fsazwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9oMT5cbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgdGV4dC14cyBtdC0xIGZvbnQtbW9ubyB0cmFja2luZy13aWRlXCI+Q29uZmlndXJlIG9uY2UuIFNraXAgYW55IHN0ZXAgeW91IGRvbid0IG5lZWQuPC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTRcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicGlsbCBiZy1zbGF0ZS04MDAgdGV4dC1zbGF0ZS00MDBcIj57Y29tcGxldGVDb3VudH0vNCBET05FPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiL2Rhc2hib2FyZC5odG1sXCJcbiAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4geyB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS5zZXR1cC5kb25lJywnMScpOyB9IGNhdGNoKGUpe30gfX1cbiAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXNsYXRlLTUwMCBob3Zlcjp0ZXh0LXNsYXRlLTMwMCB1bmRlcmxpbmUgdW5kZXJsaW5lLW9mZnNldC00XCI+U2tpcCBhbGwg4oaSPC9hPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiAtLS0tLS0tLS0tLS0tIHRpbGUgZ3JpZCAtLS0tLS0tLS0tLS0tICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXgtdy01eGwgbXgtYXV0byBncmlkIGdyaWQtY29scy0xIHNtOmdyaWQtY29scy0yIGdhcC01IGZhZGUtdXBcIiBzdHlsZT17e2FuaW1hdGlvbkRlbGF5OicuMDhzJ319PlxuICAgICAgICAgICAgICAgIHtTVEVQUy5tYXAoKHMsIGkpID0+IChcbiAgICAgICAgICAgICAgICAgICAgPFRpbGUga2V5PXtzLmtleX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3RlcD17c31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZT17ZG9uZVtzLmtleV19XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4PXtpKzF9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHMua2luZCA9PT0gJ3BhZ2UnID8gc2V0Um91dGUocy5rZXkpIDogc2V0TW9kYWwocy5rZXkpfSAvPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiAtLS0tLS0tLS0tLS0tIGZvb3RlciBDVEEgLS0tLS0tLS0tLS0tLSAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctNXhsIG14LWF1dG8gbXQtMTAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIGZhZGUtdXBcIiBzdHlsZT17e2FuaW1hdGlvbkRlbGF5OicuMThzJ319PlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNTAwIHRleHQteHMgZm9udC1tb25vXCI+XG4gICAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZUNvdW50ID09PSAwICYmICfihpEgUGljayBhIHNldHRpbmcgdG8gc3RhcnQsIG9yIHNraXAgYWxsIGFuZCBnbyBzdHJhaWdodCB0byB0aGUgZGFzaGJvYXJkLid9XG4gICAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZUNvdW50ID4gMCAmJiBjb21wbGV0ZUNvdW50IDwgNCAmJiBg4oaRICR7NCAtIGNvbXBsZXRlQ291bnR9IHN0ZXAkezQgLSBjb21wbGV0ZUNvdW50ID09PSAxID8gJycgOiAncyd9IHJlbWFpbmluZyAob3B0aW9uYWwpLmB9XG4gICAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZUNvdW50ID09PSA0ICYmICfinJMgQWxsIHN0ZXBzIGNvbmZpZ3VyZWQuICBSZWFkeSB3aGVuIHlvdSBhcmUuJ31cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cIi9kYXNoYm9hcmQuaHRtbFwiXG4gICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4geyB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS5zZXR1cC5kb25lJywnMScpOyB9IGNhdGNoKGUpe30gfX1cbiAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweC03IHB5LTMgcm91bmRlZC14bCB0ZXh0LXNtIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjb21wbGV0ZUNvdW50ID09PSA0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctZW1lcmFsZC02MDAgaG92ZXI6YmctZW1lcmFsZC01MDAgdGV4dC13aGl0ZSBzaGFkb3ctbGcgc2hhZG93LWVtZXJhbGQtNTAwLzMwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLWluZGlnby02MDAgaG92ZXI6YmctaW5kaWdvLTUwMCB0ZXh0LXdoaXRlIHNoYWRvdy1sZyBzaGFkb3ctaW5kaWdvLTUwMC8yMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgIE9wZW4gRGFzaGJvYXJkIOKGklxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogLS0tLS0tLS0tLS0tLSBtb2RhbHMgLS0tLS0tLS0tLS0tLSAqL31cbiAgICAgICAgICAgIHttb2RhbCA9PT0gJ2xvY2F0aW9uJyAmJiA8TG9jYXRpb25Nb2RhbCBjZmc9e2xvY0NmZ30gc2V0Q2ZnPXtzZXRMb2NDZmd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRNb2RhbChudWxsKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2F2ZT17KCkgPT4gZmluaXNoKCdsb2NhdGlvbicpfSAvPn1cbiAgICAgICAgICAgIHttb2RhbCA9PT0gJ2xhbmd1YWdlJyAmJiA8TGFuZ3VhZ2VNb2RhbCBjZmc9e2xhbmdDZmd9IHNldENmZz17c2V0TGFuZ0NmZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldE1vZGFsKG51bGwpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXsoKSA9PiBmaW5pc2goJ2xhbmd1YWdlJyl9IC8+fVxuICAgICAgICAgICAge21vZGFsID09PSAncGx1Z2lucycgICYmIDxQbHVnaW5zTW9kYWwgIGNmZz17cGx1Z2luQ2ZnfSBzZXRDZmc9e3NldFBsdWdpbkNmZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldE1vZGFsKG51bGwpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXsoKSA9PiBmaW5pc2goJ3BsdWdpbnMnKX0gLz59XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFRpbGUgKGxhcmdlIGVhc3ktb24tZXllcyBidXR0b24pXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5mdW5jdGlvbiBUaWxlKHsgc3RlcCwgZG9uZSwgaW5kZXgsIG9uQ2xpY2sgfSkge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxidXR0b24gb25DbGljaz17b25DbGlja31cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B0aWxlLWJ0biByZWxhdGl2ZSB0ZXh0LWxlZnQgYmctc2xhdGUtOTAwLzcwIGJvcmRlci0yIGJvcmRlci1zbGF0ZS03MDAvNzBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3VuZGVkLTJ4bCBwLTYgc206cC03ICR7ZG9uZSA/ICdkb25lJyA6ICcnfWB9PlxuICAgICAgICAgICAge2RvbmUgJiYgPHNwYW4gY2xhc3NOYW1lPVwiY2hlY2tcIj7inJM8L3NwYW4+fVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtNCBtYi0zXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTEyIGgtMTIgcm91bmRlZC14bCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiXG4gICAgICAgICAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6YCR7c3RlcC5pY29uQ29sb3J9MjJgLCBib3JkZXI6YDFweCBzb2xpZCAke3N0ZXAuaWNvbkNvbG9yfTU1YH19PlxuICAgICAgICAgICAgICAgICAgICA8VGlsZUljb24ga2luZD17c3RlcC5rZXl9IGNvbG9yPXtzdGVwLmljb25Db2xvcn0gLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtM3hsIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS03MDBcIj4we2luZGV4fTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1sZyBzbTp0ZXh0LXhsIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVyIG1iLTFcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7Y29sb3I6c3RlcC5pY29uQ29sb3J9fT57c3RlcC5sYWJlbH08L2gzPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS00MDAgdGV4dC1zbSBsZWFkaW5nLXNudWdcIj57c3RlcC5zdWJ9PC9wPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC00IGZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicGlsbCBiZy1zbGF0ZS04MDAgdGV4dC1zbGF0ZS00MDBcIj57c3RlcC5raW5kID09PSAncGFnZScgPyAnRnVsbCBwYWdlJyA6ICdQb3B1cCd9PC9zcGFuPlxuICAgICAgICAgICAgICAgIHtkb25lICYmIDxzcGFuIGNsYXNzTmFtZT1cInBpbGwgYmctZW1lcmFsZC05MDAvNDAgdGV4dC1lbWVyYWxkLTQwMFwiPkNvbmZpZ3VyZWQ8L3NwYW4+fVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICk7XG59XG5cbmZ1bmN0aW9uIFRpbGVJY29uKHsga2luZCwgY29sb3IgfSkge1xuICAgIC8qIHNpbXBsZSBpbmxpbmUgU1ZHcyBzbyB3ZSBrZWVwIHRoZSBmaWxlIHNlbGYtY29udGFpbmVkICovXG4gICAgY29uc3Qgc3Ryb2tlID0geyBzdHJva2U6Y29sb3IsIGZpbGw6J25vbmUnLCBzdHJva2VXaWR0aDoyLCBzdHJva2VMaW5lY2FwOidyb3VuZCcsIHN0cm9rZUxpbmVqb2luOidyb3VuZCcgfTtcbiAgICBpZiAoa2luZCA9PT0gJ3BzeScpICAgICAgcmV0dXJuIDxzdmcgd2lkdGg9XCIyMlwiIGhlaWdodD1cIjIyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHsuLi5zdHJva2V9PjxwYXRoIGQ9XCJNMyAzdjE4aDE4XCIvPjxwYXRoIGQ9XCJNMyAxN2M0LTEgNy02IDktOXM1LTMgOS0yXCIvPjwvc3ZnPjtcbiAgICBpZiAoa2luZCA9PT0gJ2xvY2F0aW9uJykgcmV0dXJuIDxzdmcgd2lkdGg9XCIyMlwiIGhlaWdodD1cIjIyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHsuLi5zdHJva2V9PjxwYXRoIGQ9XCJNMTIgMjJzLTctNi40LTctMTJhNyA3IDAgMSAxIDE0IDBjMCA1LjYtNyAxMi03IDEyelwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEwXCIgcj1cIjIuNVwiLz48L3N2Zz47XG4gICAgaWYgKGtpbmQgPT09ICdsYW5ndWFnZScpIHJldHVybiA8c3ZnIHdpZHRoPVwiMjJcIiBoZWlnaHQ9XCIyMlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB7Li4uc3Ryb2tlfT48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjlcIi8+PHBhdGggZD1cIk0zIDEyaDE4TTEyIDNhMTQgMTQgMCAwIDEgMCAxOE0xMiAzYTE0IDE0IDAgMCAwIDAgMThcIi8+PC9zdmc+O1xuICAgIGlmIChraW5kID09PSAncGx1Z2lucycpICByZXR1cm4gPHN2ZyB3aWR0aD1cIjIyXCIgaGVpZ2h0PVwiMjJcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgey4uLnN0cm9rZX0+PHBhdGggZD1cIk05IDN2Nk0xNSAzdjZcIi8+PHBhdGggZD1cIk01IDloMTR2NmE0IDQgMCAwIDEtNCA0aC0xdjNNOSAxOXYzXCIvPjwvc3ZnPjtcbiAgICByZXR1cm4gbnVsbDtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogUHN5IENoYXJ0IFNldHRpbmcgLS0gRlVMTCBQQUdFLCBsaXZlIHNrZWxldG9uIHJlc3BvbmRzIHRvIGNvbnRyb2xzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5mdW5jdGlvbiBQc3lDaGFydFNldHRpbmdQYWdlKHsgY2ZnLCBzZXRDZmcsIG9uQmFjaywgb25TYXZlIH0pIHtcbiAgICBjb25zdCB1cGRhdGUgPSAoaywgdikgPT4gc2V0Q2ZnKGMgPT4gKHsuLi5jLCBba106dn0pKTtcblxuICAgIC8qIE9uIG1vdW50OiBoeWRyYXRlIGZyb20gdGhlIFNBTUUgbG9jYWxTdG9yYWdlIGtleSB0aGUgZGFzaGJvYXJkIHJlYWRzXG4gICAgICogKGByZWQ1X3N3ZWV0X3Nwb3RfcmFuZ2VgKSBwbHVzIHRoZSBwcmVzZXQgaWQgKGByZWQ1X3JoX3ByZXNldGApIHNvXG4gICAgICogdGhlIGRyb3Bkb3duIGxhYmVsIHN0YXlzIGNvbnNpc3RlbnQgd2l0aCB0aGUgc2xpZGVyIHZhbHVlcyBhY3Jvc3NcbiAgICAgKiByZWxvYWRzLiAgSWYgdGhlIG9wZXJhdG9yIGhhcyBhbHJlYWR5IHR1bmVkIHRoZSBSSCBiYW5kIG9uIHRoZVxuICAgICAqIGRhc2hib2FyZCwgdGhlIHNldHVwIHdhbGsgc3RhcnRzIGZyb20gdGhvc2UgdmFsdWVzLiAqL1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByYXcgICAgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVkNV9zd2VldF9zcG90X3JhbmdlJyk7XG4gICAgICAgICAgICBjb25zdCBwcmVzZXQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVkNV9yaF9wcmVzZXQnKTtcbiAgICAgICAgICAgIGNvbnN0IHBhdGNoICA9IHt9O1xuICAgICAgICAgICAgaWYgKHJhdykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHAgPSBKU09OLnBhcnNlKHJhdyk7XG4gICAgICAgICAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShwLmxvKSAmJiBOdW1iZXIuaXNGaW5pdGUocC5oaSkgJiYgcC5sbyA8IHAuaGkpIHtcbiAgICAgICAgICAgICAgICAgICAgcGF0Y2gucmhMbyA9IHAubG87XG4gICAgICAgICAgICAgICAgICAgIHBhdGNoLnJoSGkgPSBwLmhpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwcmVzZXQgJiYgUkhfUFJFU0VUUy5maW5kKHggPT4geC5pZCA9PT0gcHJlc2V0KSkge1xuICAgICAgICAgICAgICAgIHBhdGNoLnJoUHJlc2V0ID0gcHJlc2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogVGhlbWUgKyBicmlnaHRuZXNzIOKAlCBzYW1lIGtleXMgYXBwLmpzIChkYXNoYm9hcmQpIHJlYWRzLiAqL1xuICAgICAgICAgICAgY29uc3QgdGggPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVkNS50aGVtZScpO1xuICAgICAgICAgICAgaWYgKHRoID09PSAnbGlnaHQnIHx8IHRoID09PSAnZGFyaycpIHBhdGNoLnRoZW1lID0gdGg7XG4gICAgICAgICAgICBjb25zdCBkbCA9IHBhcnNlRmxvYXQobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlZDUuZGFya0xldmVsJykpO1xuICAgICAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShkbCkgJiYgZGwgPj0gMS41ICYmIGRsIDw9IDMuMCkgcGF0Y2guZGFya0xldmVsID0gZGw7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMocGF0Y2gpLmxlbmd0aCkgc2V0Q2ZnKGMgPT4gKHsuLi5jLCAuLi5wYXRjaH0pKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBpZ25vcmUgKi8gfVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgICB9LCBbXSk7XG5cbiAgICAvKiBPbiBzYXZlOiBwZXJzaXN0IHRoZSBSSCBiYW5kIHRvIGxvY2FsU3RvcmFnZSBzbyB0aGUgZGFzaGJvYXJkJ3NcbiAgICAgKiBzd2VldC1zcG90IHBvbHlnb24gcGlja3MgaXQgdXAgb24gbmV4dCBsb2FkLiAgQWxzbyBwZXJzaXN0IHRoZSB2ZW51ZVxuICAgICAqIHByZXNldCBpZCAoZm9yIGZ1dHVyZSBcInNob3cgcHJlc2V0IG5hbWUgb24gZGFzaGJvYXJkXCIgZmVhdHVyZXMpLiAqL1xuICAgIGNvbnN0IHBlcnNpc3RBbmRTYXZlID0gKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDVfc3dlZXRfc3BvdF9yYW5nZScsXG4gICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoeyBsbzogY2ZnLnJoTG8sIGhpOiBjZmcucmhIaSB9KSk7XG4gICAgICAgICAgICBpZiAoY2ZnLnJoUHJlc2V0KSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDVfcmhfcHJlc2V0JywgY2ZnLnJoUHJlc2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIFRoZW1lICsgYnJpZ2h0bmVzcyDigJQgd3JpdHRlbiB0byB0aGUgU0FNRSBrZXlzIHRoZSBkYXNoYm9hcmRcbiAgICAgICAgICAgICAqIChhcHAuanMgbGluZXMgNTctNTggYW5kIDg0LTk3KSByZWFkcyBhcyBpdHMgdXNlU3RhdGUgbGF6eVxuICAgICAgICAgICAgICogaW5pdGlhbGlzZXIsIHNvIHRoZSBjaG9zZW4gdGhlbWUgdGFrZXMgZWZmZWN0IG9uIG5leHQgZGFzaGJvYXJkXG4gICAgICAgICAgICAgKiBsb2FkLiAgYXBwLmpzIHRyZWF0cyBkYXJrTGV2ZWwgPj0gMy4wIGFzIGxpZ2h0LW1vZGUgdHJpZ2dlci4gKi9cbiAgICAgICAgICAgIGlmIChjZmcudGhlbWUgPT09ICdsaWdodCcgfHwgY2ZnLnRoZW1lID09PSAnZGFyaycpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS50aGVtZScsIGNmZy50aGVtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGNmZy5kYXJrTGV2ZWwpKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDUuZGFya0xldmVsJywgU3RyaW5nKGNmZy5kYXJrTGV2ZWwpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncjUtcmgtYmFuZC1jaGFuZ2UnLCB7XG4gICAgICAgICAgICAgICAgZGV0YWlsOiB7IGxvOiBjZmcucmhMbywgaGk6IGNmZy5yaEhpIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnW3NldHVwIHdhbGtdIHBzeSBjaGFydCBzYXZlZCAtPiBSSCcsIGNmZy5yaExvLCAnLScsIGNmZy5yaEhpLCAnJSAgcHJlc2V0PScsIGNmZy5yaFByZXNldCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignW3NldHVwIHdhbGtdIGNvdWxkIG5vdCBwZXJzaXN0IHBzeSBzZXR0aW5nczonLCBlKTtcbiAgICAgICAgfVxuICAgICAgICBvblNhdmUoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtaW4taC1zY3JlZW4gZmxleCBmbGV4LWNvbFwiPlxuICAgICAgICAgICAgey8qIGhlYWRlciAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHB4LTYgcHktNCBib3JkZXItYiBib3JkZXItc2xhdGUtODAwXCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkJhY2t9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTQwMCBob3Zlcjp0ZXh0LXdoaXRlIHRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrXCI+XG4gICAgICAgICAgICAgICAgICAgIOKGkCBCYWNrIHRvIHNldHVwXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cInRleHQtc20gdXBwZXJjYXNlIHRyYWNraW5nLVswLjNlbV0gZm9udC1ibGFjayB0ZXh0LWluZGlnby00MDBcIj5Qc3kgQ2hhcnQgU2V0dGluZzwvaDE+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtwZXJzaXN0QW5kU2F2ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTUgcHktMiByb3VuZGVkLWxnIGJnLWluZGlnby02MDAgaG92ZXI6YmctaW5kaWdvLTUwMCB0ZXh0LXdoaXRlIHRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrXCI+XG4gICAgICAgICAgICAgICAgICAgIFNhdmUgJiByZXR1cm4g4pyTXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIGJvZHkg4oCUIGNoYXJ0IGxlZnQsIGNvbnRyb2xzIHJpZ2h0ICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTEgZ3JpZCBncmlkLWNvbHMtMSBsZzpncmlkLWNvbHMtWzFmcl8zNjBweF0gZ2FwLTQgcC02IG1heC13LTd4bCBteC1hdXRvIHctZnVsbFwiPlxuICAgICAgICAgICAgICAgIDxQc3lTa2VsZXRvbiBjZmc9e2NmZ30gLz5cbiAgICAgICAgICAgICAgICA8UHN5Q29udHJvbFBhbmVsIGNmZz17Y2ZnfSB1cGRhdGU9e3VwZGF0ZX0gc2V0Q2ZnPXtzZXRDZmd9IC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuLyogUkggYmFuZCBwcmVzZXRzIOKAlCByZWNvZ25pc2VkIGluZHVzdHJ5IHN0YW5kYXJkcyBmb3IgZWFjaCB2ZW51ZSB0eXBlLlxuICogU291cmNlczogQVNIUkFFIDU1IChjb21mb3J0KSwgQVNIUkFFIDE3MCAoaGVhbHRoY2FyZSksXG4gKiBBQU0vTlBTL1NtaXRoc29uaWFuIGd1aWRhbmNlIChjb2xsZWN0aW9ucyksIENJQlNFIFRNNDAgKGxpYnJhcmllcykuICovXG5jb25zdCBSSF9QUkVTRVRTID0gW1xuICAgIHsgaWQ6J2N1c3RvbScsICAgICAgICAgIGxhYmVsOidDdXN0b20gKG1hbnVhbCknLCAgICAgICAgICAgICAgICAgbG86bnVsbCwgaGk6bnVsbCwgbm90ZTonJyB9LFxuICAgIHsgaWQ6J29mZmljZScsICAgICAgICAgIGxhYmVsOidPZmZpY2UnLCAgICAgICAgICAgICAgICAgICAgICAgICAgbG86MzAsICAgaGk6NjAsICAgbm90ZTonQVNIUkFFIDU1IGNvbWZvcnQnICAgICAgICAgICAgICAgICAgfSxcbiAgICB7IGlkOidtdXNldW0nLCAgICAgICAgICBsYWJlbDonTXVzZXVtJywgICAgICAgICAgICAgICAgICAgICAgICAgIGxvOjQwLCAgIGhpOjU1LCAgIG5vdGU6J0FBTSBjb2xsZWN0aW9uIHByZXNlcnZhdGlvbicgICAgICAgIH0sXG4gICAgeyBpZDonaG90ZWwnLCAgICAgICAgICAgbGFiZWw6J0hvdGVsIGd1ZXN0IHJvb20nLCAgICAgICAgICAgICAgICBsbzozMCwgICBoaTo2MCwgICBub3RlOidnZW5lcmFsIG9jY3VwYW50IGNvbWZvcnQnICAgICAgICAgICB9LFxuICAgIHsgaWQ6J2xpYnJhcnknLCAgICAgICAgIGxhYmVsOidMaWJyYXJ5IC8gQXJjaGl2ZScsICAgICAgICAgICAgICAgbG86NDAsICAgaGk6NTUsICAgbm90ZToncGFwZXIgJiBiaW5kaW5nIHByZXNlcnZhdGlvbicgICAgICAgfSxcbiAgICB7IGlkOidob3NwaXRhbCcsICAgICAgICBsYWJlbDonSG9zcGl0YWwgKGdlbmVyYWwpJywgICAgICAgICAgICAgIGxvOjMwLCAgIGhpOjYwLCAgIG5vdGU6J0FTSFJBRSAxNzAgcGF0aWVudCBhcmVhcycgICAgICAgICAgIH0sXG4gICAgeyBpZDonbGVjdHVyZScsICAgICAgICAgbGFiZWw6J0xlY3R1cmUgaGFsbCcsICAgICAgICAgICAgICAgICAgICBsbzozMCwgICBoaTo2MCwgICBub3RlOidoaWdoIG9jY3VwYW5jeSBjb21mb3J0JyAgICAgICAgICAgICB9LFxuICAgIHsgaWQ6J2NvbmNlcnQnLCAgICAgICAgIGxhYmVsOidDb25jZXJ0IGhhbGwnLCAgICAgICAgICAgICAgICAgICAgbG86NDAsICAgaGk6NTUsICAgbm90ZTonaW5zdHJ1bWVudCB0dW5pbmcgc3RhYmlsaXR5JyAgICAgICAgfSxcbiAgICB7IGlkOidtZWV0aW5nJywgICAgICAgICBsYWJlbDonTWVldGluZyByb29tJywgICAgICAgICAgICAgICAgICAgIGxvOjMwLCAgIGhpOjYwLCAgIG5vdGU6J3NtYWxsIGdyb3VwIGNvbWZvcnQnICAgICAgICAgICAgICAgIH0sXG4gICAgeyBpZDonZXhoaWJpdGlvbicsICAgICAgbGFiZWw6J0V4aGliaXRpb24gaGFsbCcsICAgICAgICAgICAgICAgICBsbzo0MCwgICBoaTo1NSwgICBub3RlOidtaXhlZCBhcnQgLyBhcnRpZmFjdCBkaXNwbGF5JyAgICAgICB9LFxuXTtcblxuLyogUmVhbCBwc3kgY2hhcnQg4oCUIHVzZXMgdGhlIFNBTUUgZ2V0VyArIEdJVk9OSV9DT0xPUlMgKyBwb2x5Z29uIG1hdGggYXMgdGhlXG4gKiBwcm9kdWN0aW9uIGRhc2hib2FyZC4gIFNvdXJjZSBvZiB0cnV0aDogIGpzL3BzeWNocm9tZXRyaWMuanMgIGFuZCB0aGVcbiAqIHJlbmRlckdpdm9uaU92ZXJsYXkoKSBibG9jayBhdCBhcHAuanM6MTY0MS0xNzIyLlxuICogQW55dGhpbmcgeW91IGNoYW5nZSBpbiB0aG9zZSBmaWxlcyBNVVNUIGJlIG1pcnJvcmVkIGhlcmUuICovXG5mdW5jdGlvbiBQc3lTa2VsZXRvbih7IGNmZyB9KSB7XG4gICAgLyogQ2FudmFzICsgcGFkZGluZyAqL1xuICAgIGNvbnN0IFcgPSA3NjAsIEggPSA0ODA7XG4gICAgY29uc3QgcGFkID0geyBsZWZ0OiA1NiwgcmlnaHQ6IDQwLCB0b3A6IDI4LCBib3R0b206IDU2IH07XG4gICAgY29uc3QgZ3JpZFcgPSBXIC0gcGFkLmxlZnQgLSBwYWQucmlnaHQ7XG4gICAgY29uc3QgZ3JpZEggPSBIIC0gcGFkLnRvcCAgLSBwYWQuYm90dG9tO1xuXG4gICAgY29uc3QgVF9NSU4gPSBjZmcudExvLCBUX01BWCA9IGNmZy50SGk7XG4gICAgY29uc3QgV19NSU4gPSAwLCAgICAgICBXX01BWCA9IDAuMDMwOyAgICAgICAgICAvLyBrZy9rZ1xuXG4gICAgLyogYXhpcyBzY2FsZXMgLS0gbWF0Y2ggdGhlIGxpdmUgZGFzaGJvYXJkICovXG4gICAgY29uc3QgeCAgPSAodCkgPT4gcGFkLmxlZnQgKyAoKHQgLSBUX01JTikgLyAoVF9NQVggLSBUX01JTikpICogZ3JpZFc7XG4gICAgY29uc3QgeSAgPSAodykgPT4gcGFkLnRvcCAgKyAoMSAtICh3IC0gV19NSU4pIC8gKFdfTUFYIC0gV19NSU4pKSAqIGdyaWRIO1xuICAgIGNvbnN0IF9nZXRXID0gKHR5cGVvZiBnZXRXID09PSAnZnVuY3Rpb24nKSA/IGdldFcgOiAoKHQsIHJoKSA9PiAwKTtcblxuICAgIGNvbnN0IHNhZmVQdHMgPSAoYXJyKSA9PiBhcnIubWFwKHAgPT4gYCR7KHgocFswXSl8fDApLnRvRml4ZWQoMil9LCR7KHkocFsxXSl8fDApLnRvRml4ZWQoMil9YCkuam9pbignICcpO1xuXG4gICAgLyogLS0tLSBHaXZvbmkgcG9seWdvbnMgLS0gQ09QSUVEIFZFUkJBVElNIGZyb20gYXBwLmpzOjE2NDMtMTY2OSAtLS0tICovXG4gICAgY29uc3Qgcmg4MCA9IFtdOyBmb3IgKGxldCB0PTIwOyB0PD0yNTsgdCs9MC41KSByaDgwLnB1c2goW3QsIF9nZXRXKHQsIDgwKV0pO1xuICAgIGNvbnN0IHJoMTAwPSBbXTsgZm9yIChsZXQgdD0yMDsgdDw9Mjc7IHQrPTAuNSkgcmgxMDAucHVzaChbdCwgX2dldFcodCwgMTAwKV0pO1xuICAgIGNvbnN0IHJoMjBMaW5lID0gW107IGZvciAobGV0IHQ9MzI7IHQ+PTIwOyB0LT0wLjUpIHJoMjBMaW5lLnB1c2goW3QsIF9nZXRXKHQsIDIwKV0pO1xuICAgIGNvbnN0IHJoMjBfQ1ogID0gW107IGZvciAobGV0IHQ9Mjc7IHQ+PTIwOyB0LT0wLjUpIHJoMjBfQ1oucHVzaChbdCwgX2dldFcodCwgMjApXSk7XG4gICAgY29uc3QgQ1ogICA9IFsuLi5yaDgwLCBbMjcsIF9nZXRXKDI3LCA1MCldLCBbMjcsIF9nZXRXKDI3LCAyMCldLCAuLi5yaDIwX0NaXTtcblxuICAgIGNvbnN0IHJoSGlfdG9wID0gW107IGZvciAobGV0IHR0PTIwOyB0dDw9Mjc7IHR0Kz0wLjUpIHJoSGlfdG9wLnB1c2goW3R0LCBfZ2V0Vyh0dCwgY2ZnLnJoSGkpXSk7XG4gICAgY29uc3QgcmhMb19ib3QgPSBbXTsgZm9yIChsZXQgdHQ9Mjc7IHR0Pj0yMDsgdHQtPTAuNSkgcmhMb19ib3QucHVzaChbdHQsIF9nZXRXKHR0LCBjZmcucmhMbyldKTtcbiAgICBjb25zdCBTV0VFVCA9IFsuLi5yaEhpX3RvcCwgLi4ucmhMb19ib3RdO1xuXG4gICAgY29uc3QgTlYgICA9IFsuLi5yaDEwMCwgWzMyLCAxNS40LzEwMDBdLCBbMzIsIDYuMi8xMDAwXSwgLi4ucmgyMExpbmVdO1xuICAgIGNvbnN0IE1hc3MgPSBbLi4ucmg4MCwgWzMzLCAxNi8xMDAwXSwgWzM3LCBfZ2V0VygzNywgMzApXSwgWzM3LCAzLzEwMDBdLCBbMjAsIF9nZXRXKDIwLCAyMCldXTtcbiAgICBjb25zdCBNQ1YgID0gWy4uLnJoODAsIFs0MCwgMTYvMTAwMF0sIFs0NCwgX2dldFcoNDQsIDIwKV0sIFs0NCwgMy8xMDAwXSwgWzIwLCBfZ2V0VygyMCwgMjApXV07XG4gICAgY29uc3QgRVZBUCA9IFsuLi5yaDgwLCBbMjUsIDE2LzEwMDBdLCBbMzYsIF9nZXRXKDM2LCAzMCldLCBbMzksIF9nZXRXKDM5LCAyMCldLFxuICAgICAgICAgICAgICAgICAgWzQxLCBfZ2V0Vyg0MSwgMTApXSwgWzQxLCAwXSwgWzI3LjIsIDBdLCBbMjAsIF9nZXRXKDIwLCAyMCldXTtcblxuICAgIGNvbnN0IHdpbnRlclJIODAgPSBbXTsgZm9yIChsZXQgdD0xODsgdDw9MTkuNTsgdCs9MC41KSB3aW50ZXJSSDgwLnB1c2goW3QsIF9nZXRXKHQsIDgwKV0pO1xuICAgIGNvbnN0IHdpbnRlclJIMjAgPSBbXTsgZm9yIChsZXQgdD0xOS41OyB0Pj0xODsgdC09MC41KSB3aW50ZXJSSDIwLnB1c2goW3QsIF9nZXRXKHQsIDIwKV0pO1xuICAgIGNvbnN0IFdJTlRFUiA9IFsuLi53aW50ZXJSSDgwLCAuLi53aW50ZXJSSDIwXTtcblxuICAgIC8qIFJIIGlzb3BsZXRoIGN1cnZlcyBmb3IgdGhlIGNoYXJ0IGdyaWQgKi9cbiAgICBjb25zdCBpc29wbGV0aHMgPSBbMjAsIDQwLCA2MCwgODAsIDEwMF07XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXNsYXRlLTkwMC82MCBib3JkZXIgYm9yZGVyLXNsYXRlLTgwMCByb3VuZGVkLTJ4bCBwLTRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIG1iLTNcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJwaWxsIGJnLXNsYXRlLTgwMCB0ZXh0LXNsYXRlLTQwMFwiPlBTWUNIUk9NRVRSSUMgQ0hBUlQgwrcgbGl2ZSBwcmV2aWV3PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIGZvbnQtbW9ub1wiPntUX01JTn3CsEMg4oaSIHtUX01BWH3CsEMgIMK3ICB7Y2ZnLnJoTG994oCTe2NmZy5yaEhpfSUgUkg8L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxzdmcgdmlld0JveD17YDAgMCAke1d9ICR7SH1gfSBjbGFzc05hbWU9XCJ3LWZ1bGwgaC1hdXRvXCIgc3R5bGU9e3tiYWNrZ3JvdW5kOicjMGIxMjIwJywgYm9yZGVyUmFkaXVzOjh9fT5cbiAgICAgICAgICAgICAgICB7LyogLS0tLSBncmlkOiB2ZXJ0aWNhbCBUIGxpbmVzLCBob3Jpem9udGFsIFcgbGluZXMgLS0tLSAqL31cbiAgICAgICAgICAgICAgICB7QXJyYXkuZnJvbSh7bGVuZ3RoOjExfSkubWFwKChfLGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdCA9IFRfTUlOICsgKGkvMTApICogKFRfTUFYIC0gVF9NSU4pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGcga2V5PXsndnQnK2l9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXt4KHQpfSB5MT17cGFkLnRvcH0geDI9e3godCl9IHkyPXtwYWQudG9wK2dyaWRIfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cIiMxZTI5M2JcIiBzdHJva2VXaWR0aD1cIjAuNlwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KHQpfSB5PXtwYWQudG9wK2dyaWRIKzE2fSBmb250U2l6ZT1cIjkuNVwiIGZpbGw9XCIjOTRhM2I4XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCI+e3QudG9GaXhlZCgwKX08L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAge0FycmF5LmZyb20oe2xlbmd0aDo3fSkubWFwKChfLGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdyA9IFdfTUlOICsgKGkvNikgKiAoV19NQVggLSBXX01JTik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZyBrZXk9eydodycraX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3BhZC5sZWZ0fSB5MT17eSh3KX0geDI9e3BhZC5sZWZ0K2dyaWRXfSB5Mj17eSh3KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCIjMWUyOTNiXCIgc3Ryb2tlV2lkdGg9XCIwLjZcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17cGFkLmxlZnQtOH0geT17eSh3KSszfSBmb250U2l6ZT1cIjkuNVwiIGZpbGw9XCIjOTRhM2I4XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwiZW5kXCI+eyh3KjEwMDApLnRvRml4ZWQoMCl9PC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIHsvKiAtLS0tIFJIIGlzb3BsZXRocyAoY3VydmVzKSAtLS0tICovfVxuICAgICAgICAgICAgICAgIHtpc29wbGV0aHMubWFwKHJoID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHRzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHQgPSBUX01JTjsgdCA8PSBUX01BWDsgdCArPSAwLjUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHd3ID0gX2dldFcodCwgcmgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHd3ID49IFdfTUlOICYmIHd3IDw9IFdfTUFYKSBwdHMucHVzaChbdCwgd3ddKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGcga2V5PXsnaXNvJytyaH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlsaW5lIHBvaW50cz17c2FmZVB0cyhwdHMpfSBmaWxsPVwibm9uZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT17cmggPT09IDEwMCA/ICcjNjM2NmYxJyA6ICcjZWM0ODk5NTUnfSBzdHJva2VXaWR0aD1cIjAuOFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZURhc2hhcnJheT17cmggPT09IDEwMCA/ICcnIDogJzMsMyd9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cHRzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KHB0c1tNYXRoLmZsb29yKHB0cy5sZW5ndGgqMC42NSldWzBdKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeT17eShwdHNbTWF0aC5mbG9vcihwdHMubGVuZ3RoKjAuNjUpXVsxXSkgLSA0fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZT1cIjlcIiBmaWxsPVwiI2VjNDg5OTk5XCIgZm9udFdlaWdodD1cIjcwMFwiPntyaH0lPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG5cbiAgICAgICAgICAgICAgICB7LyogLS0tLSBHaXZvbmkgb3ZlcmxheSAoY29waWVkIHZlcmJhdGltIGZyb20gYXBwLmpzIHJlbmRlciBvcmRlcikgLS0tLSAqL31cbiAgICAgICAgICAgICAgICB7Y2ZnLmdpdm9uaSAmJiAoXG4gICAgICAgICAgICAgICAgICAgIDxnIGNsYXNzTmFtZT1cInBvaW50ZXItZXZlbnRzLW5vbmVcIiBvcGFjaXR5PVwiMC45XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17eCg0MCl9IHkxPXt5KDE2LzEwMDApfSB4Mj17eCg1MCl9IHkyPXt5KDE2LzEwMDApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiIzYzNjZmMVwiIHN0cm9rZVdpZHRoPVwiMS41XCIgc3Ryb2tlRGFzaGFycmF5PVwiNCw0XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3goNTApfSB5MT17eSgxNi8xMDAwKX0geDI9e3goNTApfSB5Mj17eSgwKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cIiM2MzY2ZjFcIiBzdHJva2VXaWR0aD1cIjEuNVwiIHN0cm9rZURhc2hhcnJheT1cIjQsNFwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXt4KDQxKX0geTE9e3koMCl9IHgyPXt4KDUwKX0geTI9e3koMCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCIjNjM2NmYxXCIgc3Ryb2tlV2lkdGg9XCIxLjVcIiBzdHJva2VEYXNoYXJyYXk9XCI0LDRcIi8+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhNQ1YpfSAgZmlsbD1cIiNlYzQ4OTlcIiBmaWxsT3BhY2l0eT1cIjAuMDVcIiBzdHJva2U9XCIjZWM0ODk5XCIgc3Ryb2tlV2lkdGg9XCIxXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKE1hc3MpfSBmaWxsPVwiIzhiNWNmNlwiIGZpbGxPcGFjaXR5PVwiMC4wNVwiIHN0cm9rZT1cIiM4YjVjZjZcIiBzdHJva2VXaWR0aD1cIjFcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoRVZBUCl9IGZpbGw9XCIjMDZiNmQ0XCIgZmlsbE9wYWNpdHk9XCIwLjA4XCIgc3Ryb2tlPVwiIzA2YjZkNFwiIHN0cm9rZVdpZHRoPVwiMVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhOVil9ICAgZmlsbD1cIiNmNTllMGJcIiBmaWxsT3BhY2l0eT1cIjAuMDVcIiBzdHJva2U9XCIjZjU5ZTBiXCIgc3Ryb2tlV2lkdGg9XCIxXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKENaKX0gICBmaWxsPVwiIzEwYjk4MVwiIGZpbGxPcGFjaXR5PVwiMC4xNVwiIHN0cm9rZT1cIiMxMGI5ODFcIiBzdHJva2VXaWR0aD1cIjEuMlwiLz5cblxuICAgICAgICAgICAgICAgICAgICAgICAgey8qIFN3ZWV0LXNwb3QgYmFuZCwgY2xpcHBlZCB0byBDWiAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkZWZzPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjbGlwUGF0aCBpZD1cImN6LWNsaXAtd2Fsa1wiIGNsaXBQYXRoVW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoQ1opfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9jbGlwUGF0aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGVmcz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhTV0VFVCl9IGNsaXBQYXRoPVwidXJsKCNjei1jbGlwLXdhbGspXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw9XCIjMDU5NjY5XCIgZmlsbE9wYWNpdHk9XCIwLjMyXCIgc3Ryb2tlPVwiIzA0Nzg1N1wiIHN0cm9rZVdpZHRoPVwiMC44XCIgc3Ryb2tlRGFzaGFycmF5PVwiMywyXCIvPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoV0lOVEVSKX0gZmlsbD1cIiMzYjgyZjZcIiBmaWxsT3BhY2l0eT1cIjAuMTVcIiBzdHJva2U9XCJub25lXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3goMTkpfSB5MT17cGFkLnRvcCsxOH0geDI9e3goMTkpfSB5Mj17cGFkLnRvcCtncmlkSH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cIiMzYjgyZjZcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VEYXNoYXJyYXk9XCI2LDRcIiBvcGFjaXR5PVwiMC44XCIvPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICB7LyogUmVnaW9uIGxhYmVscyDigJQgc2FtZSBjb2xvcnMgJiBzcGlyaXQgYXMgbGl2ZSBjaGFydCAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goNTApLTEwfSB5PXt5KDgvMTAwMCl9IGZpbGw9XCIjNjM2NmYxXCIgZm9udFNpemU9XCIxMFwiIGZvbnRXZWlnaHQ9XCI5MDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIHRyYW5zZm9ybT17YHJvdGF0ZSgtOTAsICR7eCg1MCktMTB9LCAke3koOC8xMDAwKX0pYH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc9XCIyXCI+TUVDSEFOSUNBTCBDT09MSU5HPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCg0NCktMn0geT17eSg4LzEwMDApfSBmaWxsPVwiI2VjNDg5OVwiIGZvbnRTaXplPVwiOVwiIGZvbnRXZWlnaHQ9XCI5MDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIHRyYW5zZm9ybT17YHJvdGF0ZSgtOTAsICR7eCg0NCktMn0sICR7eSg4LzEwMDApfSlgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZz1cIjEuNVwiPk1BU1MgQ09PTElORzwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goMzcpLTEwfSB5PXt5KDgvMTAwMCl9IGZpbGw9XCIjOGI1Y2Y2XCIgZm9udFNpemU9XCI5XCIgZm9udFdlaWdodD1cIjkwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgdHJhbnNmb3JtPXtgcm90YXRlKC05MCwgJHt4KDM3KS0xMH0sICR7eSg4LzEwMDApfSlgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZz1cIjEuNVwiPk1BU1MgQ09PTElORzwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goMzQpfSB5PXt5KDAuNS8xMDAwKS04fSBmaWxsPVwiIzA2YjZkNFwiIGZvbnRTaXplPVwiOVwiIGZvbnRXZWlnaHQ9XCI5MDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGxldHRlclNwYWNpbmc9XCIyXCI+RVZBUE9SQVRJVkU8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDIzLjUpfSB5PXt5KF9nZXRXKDIzLjUsIDQ1KSl9IGZpbGw9XCIjMTBiOTgxXCIgZm9udFNpemU9XCIxMVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0PVwiOTAwXCIgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGxldHRlclNwYWNpbmc9XCIxLjVcIj5DT01GT1JUPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCgxOC43NSl9IHk9e3koX2dldFcoMTguNzUsIDQ1KSl9IGZpbGw9XCIjM2I4MmY2XCIgZm9udFNpemU9XCIxMVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0PVwiOTAwXCIgdGV4dEFuY2hvcj1cIm1pZGRsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm09e2Byb3RhdGUoLTkwLCAke3goMTguNzUpfSwgJHt5KF9nZXRXKDE4Ljc1LCA0NSkpfSlgfT5XSU5URVI8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDIzLjUpfSB5PXt5KF9nZXRXKDIzLjUsIChjZmcucmhMbytjZmcucmhIaSkvMikpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbD1cIiMwMjJjMjJcIiBmb250U2l6ZT1cIjhcIiBmb250V2VpZ2h0PVwiOTAwXCIgdGV4dEFuY2hvcj1cIm1pZGRsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e3BhaW50T3JkZXI6J3N0cm9rZScsIHN0cm9rZTonI2E3ZjNkMCcsIHN0cm9rZVdpZHRoOicyLjVweCcsIHN0cm9rZUxpbmVqb2luOidyb3VuZCd9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZz1cIjEuNVwiPntjZmcucmhMb30te2NmZy5yaEhpfSUgUkg8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICApfVxuXG4gICAgICAgICAgICAgICAgey8qIGF4aXMgbGFiZWxzICovfVxuICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3BhZC5sZWZ0ICsgZ3JpZFcvMn0geT17SC0xMn0gZm9udFNpemU9XCIxMVwiIGZpbGw9XCIjY2JkNWUxXCJcbiAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgZm9udFdlaWdodD1cIjgwMFwiIGxldHRlclNwYWNpbmc9XCIyXCI+RFJZIEJVTEIgVEVNUCAowrBDKTwvdGV4dD5cbiAgICAgICAgICAgICAgICA8dGV4dCB4PXsxNn0geT17cGFkLnRvcCArIGdyaWRILzJ9IGZvbnRTaXplPVwiMTFcIiBmaWxsPVwiI2NiZDVlMVwiXG4gICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGZvbnRXZWlnaHQ9XCI4MDBcIiBsZXR0ZXJTcGFjaW5nPVwiMlwiXG4gICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtPXtgcm90YXRlKC05MCAxNiAke3BhZC50b3AgKyBncmlkSC8yfSlgfT5IVU1JRElUWSBSQVRJTyAoZy9rZyk8L3RleHQ+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuZnVuY3Rpb24gUHN5Q29udHJvbFBhbmVsKHsgY2ZnLCB1cGRhdGUsIHNldENmZyB9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1zbGF0ZS05MDAvNjAgYm9yZGVyIGJvcmRlci1zbGF0ZS04MDAgcm91bmRlZC0yeGwgcC01IHNwYWNlLXktNlwiPlxuICAgICAgICAgICAgey8qIFRoZW1lICsgYnJpZ2h0bmVzcyAgLS0gcmVsb2NhdGVkIGZyb20gdGhlIGRhc2hib2FyZCBzaWRlYmFyIDIwMjYtMDYtMjUuXG4gICAgICAgICAgICAgICAgVHdvIGNvbnRyb2xzOiBEYXJrL0xpZ2h0IG1vZGUgdG9nZ2xlLCBhbmQgQnJpZ2h0bmVzcyBzbGlkZXIgKG9ubHlcbiAgICAgICAgICAgICAgICBtZWFuaW5nZnVsIGluIGRhcmsgbW9kZSkuICBMaXZlIHByZXZpZXcgYXBwbGllcyB0byB0aGUgc3Vycm91bmRpbmdcbiAgICAgICAgICAgICAgICBjb250cm9sIHBhbmVsIHNvIHRoZSBvcGVyYXRvciBjYW4gRkVFTCB0aGUgY2hhbmdlIGJlZm9yZSBzYXZpbmcuICovfVxuICAgICAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cInBzeS1jZmctdGhlbWUtYmxvY2tcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj5EaXNwbGF5IE1vZGU8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTIgbWItM1wiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwicHN5LWNmZy10aGVtZS1kYXJrXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIHRoZW1lOidkYXJrJywgZGFya0xldmVsOk1hdGgubWluKGMuZGFya0xldmVsIHx8IDIuMCwgMi42KX0pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweS0yLjUgcm91bmRlZC1sZyB0ZXh0LXhzIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBib3JkZXIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjZmcudGhlbWUgPT09ICdkYXJrJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctc2xhdGUtODAwIGJvcmRlci15ZWxsb3ctNTAwLzcwIHRleHQteWVsbG93LTMwMCBzaGFkb3ctbGcgc2hhZG93LXllbGxvdy01MDAvMTAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1zbGF0ZS05MDAvMzAgYm9yZGVyLXNsYXRlLTcwMCB0ZXh0LXNsYXRlLTUwMCBob3ZlcjpiZy1zbGF0ZS04MDAvNjAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAg8J+MmSAgRGltIC8gRGFya1xuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cInBzeS1jZmctdGhlbWUtbGlnaHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldENmZyhjID0+ICh7Li4uYywgdGhlbWU6J2xpZ2h0JywgZGFya0xldmVsOjMuMH0pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweS0yLjUgcm91bmRlZC1sZyB0ZXh0LXhzIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBib3JkZXIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjZmcudGhlbWUgPT09ICdsaWdodCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLXNsYXRlLTEwMCBib3JkZXItc2t5LTUwMC83MCB0ZXh0LXNreS03MDAgc2hhZG93LWxnIHNoYWRvdy1za3ktNTAwLzEwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctc2xhdGUtOTAwLzMwIGJvcmRlci1zbGF0ZS03MDAgdGV4dC1zbGF0ZS01MDAgaG92ZXI6Ymctc2xhdGUtODAwLzYwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIOKYgCAgTGlnaHRcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgey8qIEJyaWdodG5lc3Mgc2xpZGVyIOKAlCBvbmx5IG1lYW5pbmdmdWwgd2hlbiB0aGVtZSA9PT0gJ2RhcmsnICovfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjZmcudGhlbWUgPT09ICdsaWdodCcgPyAnb3BhY2l0eS00MCBwb2ludGVyLWV2ZW50cy1ub25lJyA6ICcnfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gbWItMVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwXCI+RGltIGJyaWdodG5lc3M8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1tb25vIHRleHQteWVsbG93LTMwMCB0YWJ1bGFyLW51bXNcIj57TWF0aC5yb3VuZCgoY2ZnLmRhcmtMZXZlbCB8fCAyLjApICogMTAwKX0lPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cInBzeS1jZmctZGFyay1sZXZlbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBtaW49XCIxLjVcIiBtYXg9XCIyLjhcIiBzdGVwPVwiMC4wMlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Y2ZnLnRoZW1lID09PSAnbGlnaHQnID8gMi4wIDogKGNmZy5kYXJrTGV2ZWwgfHwgMi4wKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0Q2ZnKGMgPT4gKHsuLi5jLCBkYXJrTGV2ZWw6IHBhcnNlRmxvYXQoZS50YXJnZXQudmFsdWUpLCB0aGVtZTonZGFyayd9KSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyYW5nZS1pbnB1dCB3LWZ1bGxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgYWNjZW50Q29sb3I6JyNmYWNjMTUnIH19Lz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0yIGl0YWxpY1wiPlxuICAgICAgICAgICAgICAgICAgICBBcHBsaWVkIHRvIHRoZSB3aG9sZSBkYXNoYm9hcmQuICBEaW0gaXMgcmVjb21tZW5kZWQgZm9yIGNvbnRyb2wgcm9vbXM7IExpZ2h0IGZvciBkYXl0aW1lIHdhbGstdGhyb3VnaHMuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBHaXZvbmkgdG9nZ2xlICovfVxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj5HaXZvbmkgRW5naW5lPC9kaXY+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB1cGRhdGUoJ2dpdm9uaScsICFjZmcuZ2l2b25pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHctZnVsbCBweS0zIHJvdW5kZWQteGwgdGV4dC1zbSBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Y2ZnLmdpdm9uaVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLWluZGlnby02MDAgdGV4dC13aGl0ZSBzaGFkb3ctbGcgc2hhZG93LWluZGlnby01MDAvMzAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctc2xhdGUtODAwIHRleHQtc2xhdGUtNDAwIGJvcmRlciBib3JkZXItc2xhdGUtNzAwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAge2NmZy5naXZvbmkgPyAnR2l2b25pIE9OJyA6ICdHaXZvbmkgT0ZGJ31cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0yIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgICAgICBPdmVybGF5cyB0aGUgNCBjbGltYXRlLXN0cmF0ZWd5IHJlZ2lvbnMgKENvbWZvcnQsIE5hdCBWZW50LCBFdmFwLCBNZWNoIENvb2wpLlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogUkggcmFuZ2UgKi99XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMlwiPlJIIFN3ZWV0LVNwb3QgUmFuZ2U8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwIG1iLTEgYmxvY2tcIj5WZW51ZSBwcmVzZXQ8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0IGN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Y2ZnLnJoUHJlc2V0IHx8ICdjdXN0b20nfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwID0gUkhfUFJFU0VUUy5maW5kKHAgPT4gcC5pZCA9PT0gZS50YXJnZXQudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXApIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHAuaWQgPT09ICdjdXN0b20nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGUoJ3JoUHJlc2V0JywgJ2N1c3RvbScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCByaFByZXNldDpwLmlkLCByaExvOnAubG8sIHJoSGk6cC5oaX0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAge1JIX1BSRVNFVFMubWFwKHAgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtwLmlkfSB2YWx1ZT17cC5pZH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtwLmxhYmVsfXtwLmxvICE9IG51bGwgPyBgICDCtyAgJHtwLmxvfS0ke3AuaGl9JSBSSGAgOiAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgeygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwID0gUkhfUFJFU0VUUy5maW5kKHggPT4geC5pZCA9PT0gKGNmZy5yaFByZXNldCB8fCAnY3VzdG9tJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHAgJiYgcC5ub3RlID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTEuNSBpdGFsaWNcIj57cC5ub3RlfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICkgOiBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9KSgpfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTMgbWItMlwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtbW9ubyB0ZXh0LXNsYXRlLTQwMCB3LTEwXCI+e2NmZy5yaExvfSU8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49XCIyMFwiIG1heD17Y2ZnLnJoSGktNX0gdmFsdWU9e2NmZy5yaExvfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIHJoTG86K2UudGFyZ2V0LnZhbHVlLCByaFByZXNldDonY3VzdG9tJ30pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLWlucHV0IGZsZXgtMVwiLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1tb25vIHRleHQtc2xhdGUtNDAwIHctMTBcIj57Y2ZnLnJoSGl9JTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj17Y2ZnLnJoTG8rNX0gbWF4PVwiOTBcIiB2YWx1ZT17Y2ZnLnJoSGl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldENmZyhjID0+ICh7Li4uYywgcmhIaTorZS50YXJnZXQudmFsdWUsIHJoUHJlc2V0OidjdXN0b20nfSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2UtaW5wdXQgZmxleC0xXCIvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBBeGlzIHJhbmdlICovfVxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj5UZW1wZXJhdHVyZSBBeGlzIFJhbmdlPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMyBtYi0yXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1tb25vIHRleHQtc2xhdGUtNDAwIHctMTBcIj57Y2ZnLnRMb33CsDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj1cIi00MFwiIG1heD17Y2ZnLnRIaS0xMH0gdmFsdWU9e2NmZy50TG99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZSgndExvJywgK2UudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLWlucHV0IGZsZXgtMVwiLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1tb25vIHRleHQtc2xhdGUtNDAwIHctMTBcIj57Y2ZnLnRIaX3CsDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj17Y2ZnLnRMbysxMH0gbWF4PVwiNjBcIiB2YWx1ZT17Y2ZnLnRIaX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlKCd0SGknLCArZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2UtaW5wdXQgZmxleC0xXCIvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTIgbGVhZGluZy1yZWxheGVkXCI+XG4gICAgICAgICAgICAgICAgICAgIENoYXJ0IHdpbGwgYmUgcmVkcmF3biB3aXRoIHRoaXMgZHJ5LWJ1bGIgdGVtcGVyYXR1cmUgd2luZG93LlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvcmRlci10IGJvcmRlci1zbGF0ZS04MDAgcHQtNFwiPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgICAgICBDaGFuZ2VzIHByZXZpZXcgbGl2ZSBpbiB0aGUgc2tlbGV0b24gY2hhcnQgb24gdGhlIGxlZnQuICBIaXRcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1pbmRpZ28tNDAwIGZvbnQtYmxhY2tcIj4gU2F2ZSAmIHJldHVybiA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIGluIHRoZSBoZWFkZXIgd2hlbiB5b3UncmUgaGFwcHkuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIExvY2F0aW9uIFNldHRpbmcgLS0gbW9kYWwgdy8gaW50ZXJhY3RpdmUgTGVhZmxldCBtYXAgKyByZXZlcnNlIGdlb2NvZGluZ1xuICogQ2xpY2sgYW55d2hlcmUgb24gdGhlIG1hcCAob3IgZHJhZyB0aGUgbWFya2VyKSB0byBzZXQgbGF0L2xvbi5cbiAqIE1hbnVhbCBsYXQvbG9uIGVkaXRzIHJlLWNlbnRyZSB0aGUgbWFya2VyLiAgQ2l0eSBuYW1lIGlzIGF1dG8tcG9wdWxhdGVkXG4gKiB2aWEgT3BlblN0cmVldE1hcCBOb21pbmF0aW0gKG5vIGtleSByZXF1aXJlZCwgcmF0ZS1saW1pdGVkIHRvIH4xIHJlcS9zKS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIExvY2F0aW9uTW9kYWwoeyBjZmcsIHNldENmZywgb25DbG9zZSwgb25TYXZlIH0pIHtcbiAgICBjb25zdCBtYXBCb3hSZWYgPSBSZWFjdC51c2VSZWYobnVsbCk7XG4gICAgY29uc3QgbWFwUmVmICAgID0gUmVhY3QudXNlUmVmKG51bGwpO1xuICAgIGNvbnN0IG1hcmtlclJlZiA9IFJlYWN0LnVzZVJlZihudWxsKTtcbiAgICBjb25zdCBbZ2VvQnVzeSwgc2V0R2VvQnVzeV0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG5cbiAgICAvKiAtLS0tLSBzZWFyY2ggc3RhdGUgLS0tLS0gKi9cbiAgICBjb25zdCBbc2VhcmNoUSwgc2V0U2VhcmNoUV0gICAgICAgICA9IFJlYWN0LnVzZVN0YXRlKCcnKTtcbiAgICBjb25zdCBbc2VhcmNoSGl0cywgc2V0U2VhcmNoSGl0c10gICA9IFJlYWN0LnVzZVN0YXRlKFtdKTtcbiAgICBjb25zdCBbc2VhcmNoQnVzeSwgc2V0U2VhcmNoQnVzeV0gICA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBbc2VhcmNoT3Blbiwgc2V0U2VhcmNoT3Blbl0gICA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBzZWFyY2hEZWJvdW5jZVJlZiAgICAgICAgICAgICA9IFJlYWN0LnVzZVJlZihudWxsKTtcblxuICAgIC8qIEZvcndhcmQtZ2VvY29kZTogcXVlcnkgLT4gW3tsYXQsIGxvbiwgZGlzcGxheV9uYW1lLCB0eXBlLCAuLi59XSAqL1xuICAgIGNvbnN0IHJ1blNlYXJjaCA9IGFzeW5jIChxKSA9PiB7XG4gICAgICAgIGlmICghcSB8fCBxLnRyaW0oKS5sZW5ndGggPCAzKSB7IHNldFNlYXJjaEhpdHMoW10pOyByZXR1cm47IH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNldFNlYXJjaEJ1c3kodHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBgaHR0cHM6Ly9ub21pbmF0aW0ub3BlbnN0cmVldG1hcC5vcmcvc2VhcmNoP2Zvcm1hdD1qc29uJmxpbWl0PTYmcT0ke2VuY29kZVVSSUNvbXBvbmVudChxKX1gO1xuICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwgeyBoZWFkZXJzOnsgJ0FjY2VwdCc6J2FwcGxpY2F0aW9uL2pzb24nIH0gfSk7XG4gICAgICAgICAgICBjb25zdCBqID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgICBzZXRTZWFyY2hIaXRzKEFycmF5LmlzQXJyYXkoaikgPyBqIDogW10pO1xuICAgICAgICAgICAgc2V0U2VhcmNoT3Blbih0cnVlKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBzZXRTZWFyY2hIaXRzKFtdKTsgfVxuICAgICAgICBmaW5hbGx5IHsgc2V0U2VhcmNoQnVzeShmYWxzZSk7IH1cbiAgICB9O1xuXG4gICAgLyogZGVib3VuY2VkIHNlYXJjaC1vbi10eXBlICovXG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKHNlYXJjaERlYm91bmNlUmVmLmN1cnJlbnQpIGNsZWFyVGltZW91dChzZWFyY2hEZWJvdW5jZVJlZi5jdXJyZW50KTtcbiAgICAgICAgc2VhcmNoRGVib3VuY2VSZWYuY3VycmVudCA9IHNldFRpbWVvdXQoKCkgPT4gcnVuU2VhcmNoKHNlYXJjaFEpLCA0MDApO1xuICAgICAgICByZXR1cm4gKCkgPT4gc2VhcmNoRGVib3VuY2VSZWYuY3VycmVudCAmJiBjbGVhclRpbWVvdXQoc2VhcmNoRGVib3VuY2VSZWYuY3VycmVudCk7XG4gICAgfSwgW3NlYXJjaFFdKTtcblxuICAgIGNvbnN0IHBpY2tTZWFyY2hIaXQgPSAoaGl0KSA9PiB7XG4gICAgICAgIGNvbnN0IGxhdCA9IE1hdGgucm91bmQoK2hpdC5sYXQgKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgY29uc3QgbG9uID0gTWF0aC5yb3VuZCgraGl0LmxvbiAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIGxhdCwgbG9uLCBjaXR5OmhpdC5kaXNwbGF5X25hbWV9KSk7XG4gICAgICAgIGlmIChtYXBSZWYuY3VycmVudCkgbWFwUmVmLmN1cnJlbnQuc2V0VmlldyhbbGF0LCBsb25dLCBoaXQudHlwZSA9PT0gJ2NpdHknID8gMTEgOiAxNSk7XG4gICAgICAgIHNldFNlYXJjaE9wZW4oZmFsc2UpO1xuICAgICAgICBzZXRTZWFyY2hRKCcnKTtcbiAgICB9O1xuXG4gICAgLyogUmV2ZXJzZS1nZW9jb2RlIGxhdC9sb24gLT4gY2l0eSAvIGNvdW50cnkgdmlhIE5vbWluYXRpbS4gIE5vIEFQSSBrZXkuICovXG4gICAgY29uc3QgcmV2ZXJzZUdlb2NvZGUgPSBhc3luYyAobGF0LCBsb24pID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNldEdlb0J1c3kodHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBgaHR0cHM6Ly9ub21pbmF0aW0ub3BlbnN0cmVldG1hcC5vcmcvcmV2ZXJzZT9mb3JtYXQ9anNvbiZsYXQ9JHtsYXR9Jmxvbj0ke2xvbn0mem9vbT0xMGA7XG4gICAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7IGhlYWRlcnM6IHsgJ0FjY2VwdCc6J2FwcGxpY2F0aW9uL2pzb24nIH0gfSk7XG4gICAgICAgICAgICBjb25zdCBqID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgICBjb25zdCBhID0gai5hZGRyZXNzIHx8IHt9O1xuICAgICAgICAgICAgY29uc3QgY2l0eSA9IGEuY2l0eSB8fCBhLnRvd24gfHwgYS52aWxsYWdlIHx8IGEuaGFtbGV0IHx8IGEuY291bnR5IHx8ICcnO1xuICAgICAgICAgICAgY29uc3QgcmVnaW9uID0gYS5zdGF0ZSB8fCBhLnJlZ2lvbiB8fCAnJztcbiAgICAgICAgICAgIGNvbnN0IGNvdW50cnkgPSBhLmNvdW50cnkgfHwgJyc7XG4gICAgICAgICAgICBjb25zdCBsYWJlbCA9IFtjaXR5LCByZWdpb24sIGNvdW50cnldLmZpbHRlcihCb29sZWFuKS5qb2luKCcsICcpIHx8IGouZGlzcGxheV9uYW1lIHx8ICcnO1xuICAgICAgICAgICAgaWYgKGxhYmVsKSBzZXRDZmcoYyA9PiAoey4uLmMsIGNpdHk6bGFiZWx9KSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogb2ZmbGluZSBvciByYXRlLWxpbWl0ZWQgLT4ga2VlcCBwcmlvciBuYW1lICovIH1cbiAgICAgICAgZmluYWxseSB7IHNldEdlb0J1c3koZmFsc2UpOyB9XG4gICAgfTtcblxuICAgIC8qIEluaXQgTGVhZmxldCBvbiBmaXJzdCByZW5kZXIgb2YgdGhlIG1vZGFsICovXG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKCFtYXBCb3hSZWYuY3VycmVudCB8fCBtYXBSZWYuY3VycmVudCkgcmV0dXJuO1xuICAgICAgICBjb25zdCBtYXAgPSBMLm1hcChtYXBCb3hSZWYuY3VycmVudCwgeyB6b29tQ29udHJvbDogdHJ1ZSwgYXR0cmlidXRpb25Db250cm9sOiB0cnVlIH0pXG4gICAgICAgICAgICAgICAgICAgICAuc2V0VmlldyhbY2ZnLmxhdCwgY2ZnLmxvbl0sIDYpO1xuICAgICAgICBMLnRpbGVMYXllcignaHR0cHM6Ly97c30udGlsZS5vcGVuc3RyZWV0bWFwLm9yZy97en0ve3h9L3t5fS5wbmcnLCB7XG4gICAgICAgICAgICBtYXhab29tOiAxOCxcbiAgICAgICAgICAgIGF0dHJpYnV0aW9uOiAnJmNvcHk7IE9wZW5TdHJlZXRNYXAgY29udHJpYnV0b3JzJyxcbiAgICAgICAgfSkuYWRkVG8obWFwKTtcblxuICAgICAgICBjb25zdCBtYXJrZXIgPSBMLm1hcmtlcihbY2ZnLmxhdCwgY2ZnLmxvbl0sIHsgZHJhZ2dhYmxlOiB0cnVlIH0pLmFkZFRvKG1hcCk7XG4gICAgICAgIG1hcmtlci5iaW5kVG9vbHRpcCgnRHJhZyBtZSBvciBjbGljayBhbnl3aGVyZSBvbiB0aGUgbWFwJywgeyBwZXJtYW5lbnQ6IGZhbHNlIH0pO1xuXG4gICAgICAgIGNvbnN0IGFwcGx5TGF0TG9uID0gKGxhdCwgbG9uKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByID0gKG4pID0+IE1hdGgucm91bmQobiAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBsYXQ6cihsYXQpLCBsb246cihsb24pfSkpO1xuICAgICAgICAgICAgcmV2ZXJzZUdlb2NvZGUocihsYXQpLCByKGxvbikpO1xuICAgICAgICB9O1xuICAgICAgICBtYXJrZXIub24oJ2RyYWdlbmQnLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsbCA9IG1hcmtlci5nZXRMYXRMbmcoKTtcbiAgICAgICAgICAgIGFwcGx5TGF0TG9uKGxsLmxhdCwgbGwubG5nKTtcbiAgICAgICAgfSk7XG4gICAgICAgIG1hcC5vbignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgbWFya2VyLnNldExhdExuZyhlLmxhdGxuZyk7XG4gICAgICAgICAgICBhcHBseUxhdExvbihlLmxhdGxuZy5sYXQsIGUubGF0bG5nLmxuZyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1hcFJlZi5jdXJyZW50ID0gbWFwO1xuICAgICAgICBtYXJrZXJSZWYuY3VycmVudCA9IG1hcmtlcjtcblxuICAgICAgICAvKiBMZWFmbGV0IHJlbmRlcnMgYmxhbmsgaWYgaXQgYm9vdHMgaW5zaWRlIGEgaGlkZGVuIGVsZW1lbnQg4oCUIGtpY2sgaXRcbiAgICAgICAgICAgb25jZSB0aGUgbW9kYWwgYW5pbWF0aW9uIHNldHRsZXMuICovXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gbWFwLmludmFsaWRhdGVTaXplKCksIDI1MCk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7IG1hcC5yZW1vdmUoKTsgbWFwUmVmLmN1cnJlbnQgPSBudWxsOyBtYXJrZXJSZWYuY3VycmVudCA9IG51bGw7IH07XG4gICAgfSwgW10pO1xuXG4gICAgLyogS2VlcCBtYXJrZXIgaW4gc3luYyB3aGVuIHVzZXIgZWRpdHMgbGF0L2xvbiBmaWVsZHMgbWFudWFsbHkgKi9cbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAobWFwUmVmLmN1cnJlbnQgJiYgbWFya2VyUmVmLmN1cnJlbnQpIHtcbiAgICAgICAgICAgIG1hcmtlclJlZi5jdXJyZW50LnNldExhdExuZyhbY2ZnLmxhdCwgY2ZnLmxvbl0pO1xuICAgICAgICAgICAgbWFwUmVmLmN1cnJlbnQucGFuVG8oW2NmZy5sYXQsIGNmZy5sb25dKTtcbiAgICAgICAgfVxuICAgIH0sIFtjZmcubGF0LCBjZmcubG9uXSk7XG5cbiAgICBjb25zdCB1c2VNeUxvY2F0aW9uID0gKCkgPT4ge1xuICAgICAgICBpZiAoIW5hdmlnYXRvci5nZW9sb2NhdGlvbikgcmV0dXJuO1xuICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKFxuICAgICAgICAgICAgKHBvcykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhdCA9IE1hdGgucm91bmQocG9zLmNvb3Jkcy5sYXRpdHVkZSAgKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgICAgICAgICBjb25zdCBsb24gPSBNYXRoLnJvdW5kKHBvcy5jb29yZHMubG9uZ2l0dWRlICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBsYXQsIGxvbn0pKTtcbiAgICAgICAgICAgICAgICBpZiAobWFwUmVmLmN1cnJlbnQpIG1hcFJlZi5jdXJyZW50LnNldFZpZXcoW2xhdCwgbG9uXSwgMTEpO1xuICAgICAgICAgICAgICAgIHJldmVyc2VHZW9jb2RlKGxhdCwgbG9uKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoZXJyKSA9PiB7IC8qIHVzZXIgZGVuaWVkIG9yIHVuYXZhaWxhYmxlIC0+IG5vLW9wICovIH1cbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgLyogV2hlbiB1c2VyIGNsaWNrcyBcIlNhdmUgJiByZXR1cm5cIiwgUE9TVCB0aGUgc2VsZWN0aW9uIHRvIHRoZSBzYW1lXG4gICAgICogL2FwaS93ZWF0aGVyLWxvY2F0aW9uIGVuZHBvaW50IHRoZSBkYXNoYm9hcmQgcmVhZHMuICBTZXR0aW5nIEJPVEhcbiAgICAgKiBgYWN0aXZlYCBhbmQgYGRlZmF1bHRgIG1lYW5zIHRoZSB3ZWF0aGVyIHN0cmlwIG9uIHRoZSBkYXNoYm9hcmRcbiAgICAgKiBsb2FkcyB0aGlzIGxvY2F0aW9uIGltbWVkaWF0ZWx5IG9uIG5leHQgcGFnZSBsb2FkIChhbmQgc3RheXMgcGlubmVkXG4gICAgICogZm9yIGFueSBmdXR1cmUgZnJlc2ggc2Vzc2lvbnMpLiAgQW5vbnltb3VzIHVzZXJzIGdldCBhIHNvZnQgd2FybmluZ1xuICAgICAqIGJhY2sgZnJvbSB0aGUgc2VydmVyIC0tIHdlIHN0aWxsIGNhbGwgb25TYXZlKCkgZWl0aGVyIHdheS4gKi9cbiAgICBjb25zdCBwZXJzaXN0QW5kU2F2ZSA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgbG9jID0geyBsYXQ6IGNmZy5sYXQsIGxvbjogY2ZnLmxvbiwgbmFtZTogY2ZnLnNpdGVOYW1lIHx8IGNmZy5jaXR5IH07XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goJy9hcGkvd2VhdGhlci1sb2NhdGlvbicsIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOidhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgYWN0aXZlOiBsb2MsIGRlZmF1bHQ6IGxvYyB9KSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgaiA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgICAgICAgd2luZG93Ll9sYXN0V2VhdGhlckxvY2F0aW9uU2F2ZSA9IGo7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ1tzZXR1cCB3YWxrXSAvYXBpL3dlYXRoZXItbG9jYXRpb24gPC0nLCBqKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdbc2V0dXAgd2Fsa10gY291bGQgbm90IHBlcnNpc3QgbG9jYXRpb246JywgZSk7XG4gICAgICAgIH1cbiAgICAgICAgb25TYXZlKCk7XG4gICAgfTtcblxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPE1vZGFsU2hlbGwgdGl0bGU9XCJMb2NhdGlvbiBTZXR0aW5nXCIgc3VidGl0bGU9XCJDbGljayB0aGUgbWFwLCBkcmFnIHRoZSBwaW4sIG9yIHVzZSB5b3VyIGRldmljZVwiIGFjY2VudD1cImFtYmVyXCIgb25DbG9zZT17b25DbG9zZX0gb25TYXZlPXtwZXJzaXN0QW5kU2F2ZX0gc2l6ZT1cIm1heFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIGxnOmdyaWQtY29scy1bMWZyXzM0MHB4XSBnYXAtNCBoLWZ1bGxcIiBzdHlsZT17e21pbkhlaWdodDonNzB2aCd9fT5cbiAgICAgICAgICAgICAgICB7LyogTUFQIOKAlCBmaWxscyB0aGUgbGVmdCBzaWRlLCB3aXRoIGEgc2VhcmNoIGJhciBmbG9hdGluZyBvbiB0b3AgKi99XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHJlZj17bWFwQm94UmVmfVxuICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGhlaWdodDonMTAwJScsIG1pbkhlaWdodDonNzB2aCcsIHdpZHRoOicxMDAlJywgYm9yZGVyUmFkaXVzOicxMnB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzonaGlkZGVuJywgYm9yZGVyOicxcHggc29saWQgIzMzNDE1NScsIGJhY2tncm91bmQ6JyMwYjEyMjAnIH19Lz5cblxuICAgICAgICAgICAgICAgICAgICB7LyogU2VhcmNoIGJhciBvdmVybGF5IOKAlCBzaXRzIGluIHRoZSB0b3AtY2VudHJlIG9mIHRoZSBtYXAgKi99XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgdG9wLTMgbGVmdC0xLzIgLXRyYW5zbGF0ZS14LTEvMiB6LVs1MDBdXCIgc3R5bGU9e3t3aWR0aDonbWluKDU2MHB4LCBjYWxjKDEwMCUgLSAxMTBweCkpJ319PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtzZWFyY2hRfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldFNlYXJjaFEoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkZvY3VzPXsoKSA9PiBzZWFyY2hIaXRzLmxlbmd0aCAmJiBzZXRTZWFyY2hPcGVuKHRydWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIvCflI4gIFNlYXJjaCBieSBhZGRyZXNzLCBidWlsZGluZywgb3IgcGxhY2UgbmFtZeKAplwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBweC00IHB5LTIuNSByb3VuZGVkLXhsIGJnLXNsYXRlLTkwMC85NSBib3JkZXIgYm9yZGVyLXNsYXRlLTYwMCB0ZXh0LXNsYXRlLTEwMCB0ZXh0LXNtIHBsYWNlaG9sZGVyLXNsYXRlLTUwMCBzaGFkb3ctMnhsIGJhY2tkcm9wLWJsdXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e291dGxpbmU6J25vbmUnfX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWFyY2hCdXN5ICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYWJzb2x1dGUgcmlnaHQtMyB0b3AtMS8yIC10cmFuc2xhdGUteS0xLzIgdGV4dC1hbWJlci00MDAgdGV4dC14c1wiPuKApjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWFyY2hPcGVuICYmIHNlYXJjaEhpdHMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgdG9wLWZ1bGwgbGVmdC0wIHJpZ2h0LTAgbXQtMSBiZy1zbGF0ZS05MDAvOTcgYm9yZGVyIGJvcmRlci1zbGF0ZS03MDAgcm91bmRlZC14bCBzaGFkb3ctMnhsIG92ZXJmbG93LWhpZGRlbiBtYXgtaC03MiBvdmVyZmxvdy15LWF1dG8gYmFja2Ryb3AtYmx1clwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlYXJjaEhpdHMubWFwKChoLCBpKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e2gucGxhY2VfaWQgfHwgaX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHBpY2tTZWFyY2hIaXQoaCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgdGV4dC1sZWZ0IHB4LTQgcHktMi41IGhvdmVyOmJnLWFtYmVyLTkwMC8zMCBib3JkZXItYiBib3JkZXItc2xhdGUtODAwIGxhc3Q6Ym9yZGVyLWItMCB0cmFuc2l0aW9uLWFsbFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC1zbGF0ZS0yMDAgdHJ1bmNhdGVcIj57aC5kaXNwbGF5X25hbWV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBtdC0wLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtoLnR5cGUgfHwgaC5jbGFzc30gwrcgeygraC5sYXQpLnRvRml4ZWQoMyl9LCB7KCtoLmxvbikudG9GaXhlZCgzKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VhcmNoT3BlbiAmJiBzZWFyY2hIaXRzLmxlbmd0aCA9PT0gMCAmJiBzZWFyY2hRLmxlbmd0aCA+PSAzICYmICFzZWFyY2hCdXN5ICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSB0b3AtZnVsbCBsZWZ0LTAgcmlnaHQtMCBtdC0xIGJnLXNsYXRlLTkwMC85NyBib3JkZXIgYm9yZGVyLXNsYXRlLTcwMCByb3VuZGVkLXhsIHB4LTQgcHktMyB0ZXh0LXhzIHRleHQtc2xhdGUtNDAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBObyByZXN1bHRzIGZvciBcIntzZWFyY2hRfVwiLiAgVHJ5IGEgbW9yZSBzcGVjaWZpYyB0ZXJtLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgey8qIFNJREUgUEFORUwgKi99XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTQgb3ZlcmZsb3cteS1hdXRvIHByLTFcIj5cbiAgICAgICAgICAgICAgICAgICAgey8qIFVzZXItZnJpZW5kbHkgc2l0ZSBuYW1lICh0aGUgb25lIHRoZSBvcGVyYXRvciB1c2VzIHRvIGlkZW50aWZ5IHRoaXMgbG9jYXRpb24pICovfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0xLjVcIj5TaXRlIG5hbWUgKHNhdmVkKTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCIgdmFsdWU9e2NmZy5zaXRlTmFtZSB8fCAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImUuZy4gSFEgVG93ZXIsIE5vcnRoIFdpbmcsIFBhdmlsaW9uIELigKZcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0Q2ZnKHsuLi5jZmcsIHNpdGVOYW1lOmUudGFyZ2V0LnZhbHVlfSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTEgaXRhbGljXCI+WW91ciBsYWJlbCBmb3IgdGhpcyBwbGFjZSDigJQgc2hvd24gb24gdGhlIGRhc2hib2FyZCBoZWFkZXIuPC9wPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvcmRlci10IGJvcmRlci1zbGF0ZS04MDAgcHQtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0xLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXNvbHZlZCBhZGRyZXNzIC8gY2l0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtnZW9CdXN5ICYmIDxzcGFuIGNsYXNzTmFtZT1cIm1sLTIgdGV4dC1hbWJlci00MDAgbm9ybWFsLWNhc2UgdHJhY2tpbmctbm9ybWFsXCI+4oCmIHJlc29sdmluZzwvc3Bhbj59XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiIHZhbHVlPXtjZmcuY2l0eX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpPT5zZXRDZmcoey4uLmNmZywgY2l0eTplLnRhcmdldC52YWx1ZX0pfS8+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0xLjVcIj5MYXRpdHVkZTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiIHR5cGU9XCJudW1iZXJcIiBzdGVwPVwiMC4wMDAxXCIgdmFsdWU9e2NmZy5sYXR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSk9PnNldENmZyh7Li4uY2ZnLCBsYXQ6K2UudGFyZ2V0LnZhbHVlfSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTEuNVwiPkxvbmdpdHVkZTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiIHR5cGU9XCJudW1iZXJcIiBzdGVwPVwiMC4wMDAxXCIgdmFsdWU9e2NmZy5sb259XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSk9PnNldENmZyh7Li4uY2ZnLCBsb246K2UudGFyZ2V0LnZhbHVlfSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3VzZU15TG9jYXRpb259XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHB5LTIuNSByb3VuZGVkLWxnIGJnLWFtYmVyLTcwMC83MCBib3JkZXIgYm9yZGVyLWFtYmVyLTUwMC80MCB0ZXh0LXhzIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCB0ZXh0LWFtYmVyLTUwIGhvdmVyOmJnLWFtYmVyLTYwMC83MFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAg8J+TjSAgVXNlIG15IGRldmljZSBsb2NhdGlvblxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvcmRlci10IGJvcmRlci1zbGF0ZS04MDAgcHQtMyBtdC0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj5RdWljayBqdW1wczwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC0xLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7W1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J1Rvcm9udG8sIE9OJywgICBsYXQ6NDMuNjUzMiwgbG9uOi03OS4zODMyLCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonTmV3IFlvcmssIE5ZJywgIGxhdDo0MC43MTI4LCBsb246LTc0LjAwNjAsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidMb25kb24sIFVLJywgICAgbGF0OjUxLjUwNzQsIGxvbjogLTAuMTI3OCwgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J1BhcmlzLCBGUicsICAgICBsYXQ6NDguODU2NiwgbG9uOiAgMi4zNTIyLCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonVG9reW8sIEpQJywgICAgIGxhdDozNS42NzYyLCBsb246MTM5LjY1MDMsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidTeWRuZXksIEFVJywgICAgbGF0Oi0zMy44Njg4LGxvbjoxNTEuMjA5MywgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0ubWFwKGogPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGtleT17ai5uYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBsYXQ6ai5sYXQsIGxvbjpqLmxvbiwgY2l0eTpqLm5hbWV9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXBSZWYuY3VycmVudCkgbWFwUmVmLmN1cnJlbnQuc2V0Vmlldyhbai5sYXQsIGoubG9uXSwgai56KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtbGVmdCBweC0yLjUgcHktMS41IHJvdW5kZWQtbWQgYmctc2xhdGUtODAwLzcwIGJvcmRlciBib3JkZXItc2xhdGUtNzAwIHRleHQtWzExcHhdIGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTMwMCBob3ZlcjpiZy1zbGF0ZS03MDAgaG92ZXI6Ym9yZGVyLWFtYmVyLTUwMC80MCB0cmFuc2l0aW9uLWFsbFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2oubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbGVhZGluZy1yZWxheGVkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICBUaWxlczogT3BlblN0cmVldE1hcCDCtyBHZW9jb2RlOiBOb21pbmF0aW0gKGZyZWUsIH4xIHJlcS9zKS5cbiAgICAgICAgICAgICAgICAgICAgICAgIFVzZWQgZm9yIE9wZW4tTWV0ZW8gd2VhdGhlciBmZWVkIGFuZCBzdW5yaXNlL3N1bnNldCBlc3RpbWF0aW9uLlxuICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Nb2RhbFNoZWxsPlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIExhbmd1YWdlIFNldHRpbmcgLS0gbW9kYWxcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIExhbmd1YWdlTW9kYWwoeyBjZmcsIHNldENmZywgb25DbG9zZSwgb25TYXZlIH0pIHtcbiAgICBjb25zdCBsYW5ncyA9IFtcbiAgICAgICAgeyBjb2RlOidlbicsIGxhYmVsOidFbmdsaXNoJywgICAgbmF0aXZlOidFbmdsaXNoJyAgfSxcbiAgICAgICAgeyBjb2RlOidmcicsIGxhYmVsOidGcmVuY2gnLCAgICAgbmF0aXZlOidGcmFuw6dhaXMnIH0sXG4gICAgICAgIHsgY29kZTonZXMnLCBsYWJlbDonU3BhbmlzaCcsICAgIG5hdGl2ZTonRXNwYcOxb2wnICB9LFxuICAgICAgICB7IGNvZGU6J3poJywgbGFiZWw6J0NoaW5lc2UnLCAgICBuYXRpdmU6J+S4reaWhycgICAgICB9LFxuICAgICAgICB7IGNvZGU6J2phJywgbGFiZWw6J0phcGFuZXNlJywgICBuYXRpdmU6J+aXpeacrOiqnicgICAgfSxcbiAgICAgICAgeyBjb2RlOidkZScsIGxhYmVsOidHZXJtYW4nLCAgICAgbmF0aXZlOidEZXV0c2NoJyAgfSxcbiAgICBdO1xuICAgIHJldHVybiAoXG4gICAgICAgIDxNb2RhbFNoZWxsIHRpdGxlPVwiTGFuZ3VhZ2UgU2V0dGluZ1wiIHN1YnRpdGxlPVwiUGljayB5b3VyIGRlZmF1bHQgaW50ZXJmYWNlIGxhbmd1YWdlXCIgYWNjZW50PVwiZW1lcmFsZFwiIG9uQ2xvc2U9e29uQ2xvc2V9IG9uU2F2ZT17b25TYXZlfT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtM1wiPlxuICAgICAgICAgICAgICAgIHtsYW5ncy5tYXAobCA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PXtsLmNvZGV9IG9uQ2xpY2s9eygpPT5zZXRDZmcoey4uLmNmZywgbGFuZzpsLmNvZGV9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B0ZXh0LWxlZnQgcC0zIHJvdW5kZWQteGwgYm9yZGVyLTIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjZmcubGFuZyA9PT0gbC5jb2RlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdib3JkZXItZW1lcmFsZC01MDAgYmctZW1lcmFsZC05MDAvMjAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdib3JkZXItc2xhdGUtNzAwIGJnLXNsYXRlLTgwMC80MCBob3ZlcjpiZy1zbGF0ZS04MDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS01MDBcIj57bC5jb2RlfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS0yMDBcIj57bC5uYXRpdmV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzExcHhdIHRleHQtc2xhdGUtNTAwXCI+e2wubGFiZWx9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvTW9kYWxTaGVsbD5cbiAgICApO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBQbHVnLWluIFNldHRpbmcgLS0gbW9kYWwgdy8gbGlzdCArIHVwbG9hZCB6b25lXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4vKiBQZXItcGx1Zy1pbiBtb2NrIGNvbmZpZ3VyYXRpb24gZmllbGRzLiAgS2V5cyBtYXAgdG8gcGx1Zy1pbiBgaWRgLiAqL1xuY29uc3QgUExVR0lOX0NPTkZJR19GSUVMRFMgPSB7XG4gICAgd2VhdGhlcjogICAgW1xuICAgICAgICB7IGtleToncHJvdmlkZXInLCAgbGFiZWw6J1Byb3ZpZGVyJywgICAgICAgICAgdHlwZTonc2VsZWN0JywgIG9wdGlvbnM6WydPcGVuLU1ldGVvJywnTldTJywnRUNNV0YnXSwgZGVmOidPcGVuLU1ldGVvJyB9LFxuICAgICAgICB7IGtleToncmVmcmVzaCcsICAgbGFiZWw6J1JlZnJlc2ggaW50ZXJ2YWwnLCAgdHlwZTonc2VsZWN0JywgIG9wdGlvbnM6WycxIG1pbicsJzUgbWluJywnMTUgbWluJywnMzAgbWluJywnMSBoJ10sIGRlZjonMTUgbWluJyB9LFxuICAgICAgICB7IGtleTonY2FjaGUnLCAgICAgbGFiZWw6J0NhY2hlIFRUTCAobWluKScsICAgdHlwZTonbnVtYmVyJywgIGRlZjozMCB9LFxuICAgIF0sXG4gICAgZ2l2b25pOiAgICAgW1xuICAgICAgICB7IGtleTonY2xpbWF0ZScsICAgbGFiZWw6J0NsaW1hdGUgbW9kZWwnLCAgICAgdHlwZTonc2VsZWN0JywgIG9wdGlvbnM6WydHaXZvbmkgMTk5MicsJ0FTSFJBRSA1NScsJ0FkYXB0aXZlJ10sIGRlZjonR2l2b25pIDE5OTInIH0sXG4gICAgICAgIHsga2V5OidtYXNzaXZlJywgICBsYWJlbDonSGVhdnl3ZWlnaHQgY29uc3RydWN0aW9uJywgIHR5cGU6J3RvZ2dsZScsIGRlZjpmYWxzZSB9LFxuICAgIF0sXG4gICAgc3dlZXRfc3BvdDogW1xuICAgICAgICB7IGtleTondHJhY2tpbmcnLCAgbGFiZWw6J1RyYWNrIG91dGRvb3IgUkgnLCAgdHlwZTondG9nZ2xlJywgZGVmOnRydWUgfSxcbiAgICAgICAgeyBrZXk6J2h5c3QnLCAgICAgIGxhYmVsOidIeXN0ZXJlc2lzICglIFJIKScsIHR5cGU6J251bWJlcicsIGRlZjoyIH0sXG4gICAgXSxcbiAgICBnMzY6ICAgICAgICBbXG4gICAgICAgIHsga2V5Oidtb2RlJywgICAgICBsYWJlbDonU2VxdWVuY2UgbW9kZScsICAgICB0eXBlOidzZWxlY3QnLCAgb3B0aW9uczpbJ1NpbmdsZS16b25lIFZBVicsJ011bHRpLXpvbmUgVkFWJywnRE9BUyB3LyBGQ1UnXSwgZGVmOidNdWx0aS16b25lIFZBVicgfSxcbiAgICAgICAgeyBrZXk6J3ZlcmJvc2UnLCAgIGxhYmVsOidWZXJib3NlIGxvZ2dpbmcnLCAgIHR5cGU6J3RvZ2dsZScsIGRlZjpmYWxzZSB9LFxuICAgIF0sXG4gICAgZGlidDogICAgICAgW1xuICAgICAgICB7IGtleTonaG9zdCcsICAgICAgbGFiZWw6J0JyaWRnZSBob3N0JywgICAgICAgdHlwZTondGV4dCcsICAgZGVmOicxOTIuMTY4LjEuMTAwJyB9LFxuICAgICAgICB7IGtleToncG9ydCcsICAgICAgbGFiZWw6J1RlbGVncmFtIHBvcnQnLCAgICAgdHlwZTonbnVtYmVyJywgZGVmOjQ3ODA4IH0sXG4gICAgICAgIHsga2V5Oidwb2xsX21zJywgICBsYWJlbDonUG9sbCBpbnRlcnZhbCAobXMpJyx0eXBlOidudW1iZXInLCBkZWY6MjAwMCB9LFxuICAgIF0sXG4gICAgbGlnaHRpbmc6ICAgW1xuICAgICAgICB7IGtleTonZ2F0ZXdheScsICAgbGFiZWw6J01vZGJ1cyBnYXRld2F5IElQJywgdHlwZTondGV4dCcsICAgZGVmOicxMC4wLjAuNTAnIH0sXG4gICAgICAgIHsga2V5Oid1bml0X2lkJywgICBsYWJlbDonVW5pdCBJRCcsICAgICAgICAgICB0eXBlOidudW1iZXInLCBkZWY6MSB9LFxuICAgICAgICB7IGtleTondGNwX3BvcnQnLCAgbGFiZWw6J1RDUCBwb3J0JywgICAgICAgICAgdHlwZTonbnVtYmVyJywgZGVmOjUwMiB9LFxuICAgIF0sXG59O1xuXG5mdW5jdGlvbiBQbHVnaW5zTW9kYWwoeyBjZmcsIHNldENmZywgb25DbG9zZSwgb25TYXZlIH0pIHtcbiAgICBjb25zdCBBTEwgPSBbXG4gICAgICAgIHsgaWQ6J3dlYXRoZXInLCAgICAgbmFtZTonV2VhdGhlcicsICAgICAgICAgZGVzYzonT3Blbi1NZXRlbyBPQSBmZWVkJywgICAgICAgICAgdmVyOicyLjEuMCcgfSxcbiAgICAgICAgeyBpZDonZ2l2b25pJywgICAgICBuYW1lOidHaXZvbmkgRW5naW5lJywgICBkZXNjOidDbGltYXRlLXN0cmF0ZWd5IG92ZXJsYXknLCAgICB2ZXI6JzEuMy40JyB9LFxuICAgICAgICB7IGlkOidzd2VldF9zcG90JywgIG5hbWU6J1N3ZWV0LVNwb3QgUkgnLCAgIGRlc2M6J0FkanVzdGFibGUgUkggYmFuZCcsICAgICAgICAgIHZlcjonMS4wLjEnIH0sXG4gICAgICAgIHsgaWQ6J2czNicsICAgICAgICAgbmFtZTonRzM2IFNlcXVlbmNlcycsICAgZGVzYzonQVNIUkFFIEd1aWRlbGluZSAzNicsICAgICAgICAgdmVyOicwLjkuMicgfSxcbiAgICAgICAgeyBpZDonZGlidCcsICAgICAgICBuYW1lOidESUJUIEJyaWRnZScsICAgICBkZXNjOidEZWx0YSBDb250cm9scyAoRElCVCkgQkFDbmV0IGJyaWRnZScsICAgICAgICAgICB2ZXI6JzAuNC4wJyB9LFxuICAgICAgICB7IGlkOidsaWdodGluZycsICAgIG5hbWU6J0xpZ2h0aW5nIChSZWQ1KScsIGRlc2M6J1YzLjAgTW9kYnVzIFRDUCBjbGllbnQnLCAgICAgIHZlcjonMC4xLjAtYmV0YScgfSxcbiAgICBdO1xuICAgIGNvbnN0IHRvZ2dsZSA9IChpZCkgPT4gc2V0Q2ZnKGMgPT4gKHtcbiAgICAgICAgLi4uYyxcbiAgICAgICAgZW5hYmxlZDogYy5lbmFibGVkLmluY2x1ZGVzKGlkKSA/IGMuZW5hYmxlZC5maWx0ZXIoeCA9PiB4ICE9PSBpZCkgOiBbLi4uYy5lbmFibGVkLCBpZF1cbiAgICB9KSk7XG5cbiAgICAvKiBleHBhbnNpb24gc3RhdGUg4oCUIHdoaWNoIHBsdWctaW4ncyBcIkNvbmZpZ3VyZVwiIHBhbmVsIGlzIG9wZW4gKi9cbiAgICBjb25zdCBbZXhwYW5kZWRJZCwgc2V0RXhwYW5kZWRJZF0gPSBSZWFjdC51c2VTdGF0ZShudWxsKTtcblxuICAgIGNvbnN0IHVwZGF0ZUZpZWxkID0gKHBsdWdpbklkLCBmaWVsZEtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgc2V0Q2ZnKGMgPT4gKHtcbiAgICAgICAgICAgIC4uLmMsXG4gICAgICAgICAgICBmaWVsZHM6IHsgLi4uKGMuZmllbGRzIHx8IHt9KSwgW3BsdWdpbklkXTogeyAuLi4oKGMuZmllbGRzIHx8IHt9KVtwbHVnaW5JZF0gfHwge30pLCBbZmllbGRLZXldOiB2YWx1ZSB9IH1cbiAgICAgICAgfSkpO1xuICAgIH07XG5cbiAgICBjb25zdCBmaWVsZFZhbCA9IChwbHVnaW5JZCwgZmllbGQpID0+IHtcbiAgICAgICAgY29uc3Qgc3RvcmVkID0gY2ZnLmZpZWxkcyAmJiBjZmcuZmllbGRzW3BsdWdpbklkXSAmJiBjZmcuZmllbGRzW3BsdWdpbklkXVtmaWVsZC5rZXldO1xuICAgICAgICByZXR1cm4gc3RvcmVkICE9PSB1bmRlZmluZWQgPyBzdG9yZWQgOiBmaWVsZC5kZWY7XG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxNb2RhbFNoZWxsIHRpdGxlPVwiUGx1Zy1pbiBTZXR0aW5nXCIgc3VidGl0bGU9XCJFbmFibGUsIHVwbG9hZCBvciBtb2RpZnkgcGx1Zy1pbnNcIiBhY2NlbnQ9XCJwaW5rXCIgb25DbG9zZT17b25DbG9zZX0gb25TYXZlPXtvblNhdmV9IHNpemU9XCJ3aWRlXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMyBtYXgtaC1bNjB2aF0gb3ZlcmZsb3cteS1hdXRvIHByLTFcIj5cbiAgICAgICAgICAgICAgICB7QUxMLm1hcChwID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb24gPSBjZmcuZW5hYmxlZC5pbmNsdWRlcyhwLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhwYW5kZWQgPSBleHBhbmRlZElkID09PSBwLmlkO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWVsZHMgPSBQTFVHSU5fQ09ORklHX0ZJRUxEU1twLmlkXSB8fCBbXTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtwLmlkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2Byb3VuZGVkLXhsIGJvcmRlciB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke29uID8gJ2JvcmRlci1waW5rLTUwMC80MCBiZy1waW5rLTkwMC8xMCcgOiAnYm9yZGVyLXNsYXRlLTcwMCBiZy1zbGF0ZS04MDAvNDAnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2V4cGFuZGVkID8gJ3JpbmctMSByaW5nLXBpbmstNTAwLzMwJyA6ICcnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHAtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS0xMDBcIj57cC5uYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1sLTIgdGV4dC1bMTBweF0gZm9udC1tb25vIHRleHQtc2xhdGUtNTAwXCI+dntwLnZlcn08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXNsYXRlLTQwMFwiPntwLmRlc2N9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHRvZ2dsZShwLmlkKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BwbHVnaW4tdG9nZ2xlLSR7cC5pZH1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweC0zIHB5LTEgcm91bmRlZC1tZCB0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgYm9yZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke29uID8gJ2JvcmRlci1waW5rLTUwMC82MCB0ZXh0LXBpbmstMzAwIGJnLXBpbmstOTAwLzMwJyA6ICdib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtNDAwIGJnLXNsYXRlLTgwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge29uID8gJ0VuYWJsZWQnIDogJ0Rpc2FibGVkJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBzZXRFeHBhbmRlZElkKGV4cGFuZGVkID8gbnVsbCA6IHAuaWQpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17YHBsdWdpbi1jb25maWctJHtwLmlkfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTMgcHktMSByb3VuZGVkLW1kIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayBib3JkZXIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7ZXhwYW5kZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdib3JkZXItcGluay01MDAgYmctcGluay05MDAvMzAgdGV4dC1waW5rLTIwMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtNDAwIGJnLXNsYXRlLTgwMCBob3ZlcjpiZy1zbGF0ZS03MDAgaG92ZXI6Ym9yZGVyLXBpbmstNTAwLzUwIGhvdmVyOnRleHQtcGluay0zMDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtleHBhbmRlZCA/ICdDbG9zZSDilrQnIDogJ0NvbmZpZ3VyZSDilr4nfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtleHBhbmRlZCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHgtNCBwYi00IGJvcmRlci10IGJvcmRlci1waW5rLTUwMC8yMCBiZy1zbGF0ZS05NTAvNDBcIiBkYXRhLXRlc3RpZD17YHBsdWdpbi1jb25maWctcGFuZWwtJHtwLmlkfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2ZpZWxkcy5sZW5ndGggPT09IDAgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXNsYXRlLTUwMCBpdGFsaWMgcHktM1wiPk5vIGNvbmZpZ3VyYWJsZSBvcHRpb25zIGZvciB0aGlzIHBsdWctaW4geWV0LjwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIG1kOmdyaWQtY29scy0yIGdhcC0zIHB0LTNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2ZpZWxkcy5tYXAoZiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2ID0gZmllbGRWYWwocC5pZCwgZik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtmLmtleX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTUwMCBibG9jayBtYi0xXCI+e2YubGFiZWx9PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2YudHlwZSA9PT0gJ3NlbGVjdCcgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dCBjdXJzb3ItcG9pbnRlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt2fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZUZpZWxkKHAuaWQsIGYua2V5LCBlLnRhcmdldC52YWx1ZSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmLm9wdGlvbnMubWFwKG8gPT4gPG9wdGlvbiBrZXk9e299IHZhbHVlPXtvfT57b308L29wdGlvbj4pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmLnR5cGUgPT09ICdudW1iZXInICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt2fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlRmllbGQocC5pZCwgZi5rZXksICtlLnRhcmdldC52YWx1ZSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2YudHlwZSA9PT0gJ3RleHQnICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZUZpZWxkKHAuaWQsIGYua2V5LCBlLnRhcmdldC52YWx1ZSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2YudHlwZSA9PT0gJ3RvZ2dsZScgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB1cGRhdGVGaWVsZChwLmlkLCBmLmtleSwgIXYpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B3LWZ1bGwgcHktMiByb3VuZGVkLWxnIHRleHQteHMgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGJvcmRlciB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHt2XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctcGluay03MDAvNDAgYm9yZGVyLXBpbmstNTAwLzYwIHRleHQtcGluay0yMDAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctc2xhdGUtODAwIGJvcmRlci1zbGF0ZS02MDAgdGV4dC1zbGF0ZS00MDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt2ID8gJ09OJyA6ICdPRkYnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktZW5kIGdhcC0yIG10LTQgcHQtMyBib3JkZXItdCBib3JkZXItc2xhdGUtODAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVzZXQgdGhpcyBwbHVnLWluJ3MgZmllbGRzIHRvIGRlZmF1bHRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q2ZnKGMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXh0ID0geyAuLi4oYy5maWVsZHMgfHwge30pIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBuZXh0W3AuaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyAuLi5jLCBmaWVsZHM6IG5leHQgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC0zIHB5LTEuNSByb3VuZGVkLW1kIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayBib3JkZXIgYm9yZGVyLXNsYXRlLTYwMCB0ZXh0LXNsYXRlLTQwMCBob3ZlcjpiZy1zbGF0ZS04MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVzZXQgZGVmYXVsdHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHNldEV4cGFuZGVkSWQobnVsbCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC0zIHB5LTEuNSByb3VuZGVkLW1kIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayBiZy1waW5rLTYwMCBob3ZlcjpiZy1waW5rLTUwMCB0ZXh0LXdoaXRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERvbmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC01IHAtNCBib3JkZXItMiBib3JkZXItZGFzaGVkIGJvcmRlci1zbGF0ZS03MDAgcm91bmRlZC14bCB0ZXh0LWNlbnRlciBob3Zlcjpib3JkZXItcGluay01MDAvNDAgdHJhbnNpdGlvbi1hbGwgY3Vyc29yLXBvaW50ZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtM3hsIG1iLTFcIj7ipLQ8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1ibGFjayB0ZXh0LXNsYXRlLTMwMFwiPkRyb3AgYSAucHkgLyAuemlwIC8gLnJlZDUgcGx1Zy1pbiBoZXJlPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMXB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0xXCI+b3IgY2xpY2sgdG8gY2hvb3NlIGEgZmlsZSAobW9jayDigJQgbm90IHdpcmVkKTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvTW9kYWxTaGVsbD5cbiAgICApO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBNb2RhbCBTaGVsbCAtLSBzaGFyZWRcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIE1vZGFsU2hlbGwoeyB0aXRsZSwgc3VidGl0bGUsIGFjY2VudD0naW5kaWdvJywgb25DbG9zZSwgb25TYXZlLCBzaXplPScnLCBjaGlsZHJlbiB9KSB7XG4gICAgY29uc3QgY29sb3JNYXAgPSB7XG4gICAgICAgIGluZGlnbzonIzgxOGNmOCcsIGFtYmVyOicjZmJiZjI0JywgZW1lcmFsZDonIzM0ZDM5OScsIHBpbms6JyNmNDcyYjYnXG4gICAgfTtcbiAgICBjb25zdCBjID0gY29sb3JNYXBbYWNjZW50XSB8fCAnIzgxOGNmOCc7XG4gICAgY29uc3Qgc2l6ZU1hcCA9IHtcbiAgICAgICAgd2lkZTogJ21heC13LTJ4bCcsXG4gICAgICAgIG1hcDogICdtYXgtdy0zeGwnLFxuICAgICAgICBtYXg6ICAnbWF4LXctWzk2dnddIHctWzk2dnddIGgtWzkydmhdJyxcbiAgICB9O1xuICAgIGNvbnN0IHdpZHRoID0gc2l6ZU1hcFtzaXplXSB8fCAnbWF4LXctbWQnO1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZml4ZWQgaW5zZXQtMCB6LTUwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIG1vZGFsLWJhY2tkcm9wXCIgb25DbGljaz17b25DbG9zZX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YGJnLXNsYXRlLTkwMCBib3JkZXItMiByb3VuZGVkLTJ4bCB3LWZ1bGwgJHt3aWR0aH0gbXgtNCBwLTYgZmFkZS11cGB9XG4gICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpfVxuICAgICAgICAgICAgICAgICBzdHlsZT17e2JvcmRlckNvbG9yOmAke2N9NjZgfX0+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLXN0YXJ0IGp1c3RpZnktYmV0d2VlbiBtYi01XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1sZyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3RcIiBzdHlsZT17e2NvbG9yOmN9fT57dGl0bGV9PC9oMz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS01MDAgbXQtMVwiPntzdWJ0aXRsZX08L3A+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQ2xvc2V9IGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNTAwIGhvdmVyOnRleHQtd2hpdGUgdGV4dC0yeGwgbGVhZGluZy1ub25lXCI+w5c8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWVuZCBnYXAtMyBtdC02IHB0LTQgYm9yZGVyLXQgYm9yZGVyLXNsYXRlLTgwMFwiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQ2xvc2V9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtNCBweS0yIHJvdW5kZWQtbGcgYmctc2xhdGUtODAwIGJvcmRlciBib3JkZXItc2xhdGUtNzAwIHRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIHRleHQtc2xhdGUtNDAwIGhvdmVyOmJnLXNsYXRlLTcwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgQ2FuY2VsXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uU2F2ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC01IHB5LTIgcm91bmRlZC1sZyB0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayB0ZXh0LXdoaXRlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6YywgYm94U2hhZG93OmAwIDAgMTJweCAke2N9NTVgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICBTYXZlICYgcmV0dXJuIOKck1xuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG4vKiBtb3VudCAqL1xuUmVhY3RET00uY3JlYXRlUm9vdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpKS5yZW5kZXIoPEFwcC8+KTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUFB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QUksQ0FBQyxJQUFJLFVBQVU7RUFDekMsb0JBQ0l0VSxLQUFBLENBQUFtRSxhQUFBO0lBQUtNLFNBQVMsRUFBQyxvRUFBb0U7SUFBQ0UsT0FBTyxFQUFFYztFQUFRLGdCQUNqR3pGLEtBQUEsQ0FBQW1FLGFBQUE7SUFBS00sU0FBUyw4Q0FBQWMsTUFBQSxDQUE4Q2lCLEtBQUssc0JBQW9CO0lBQ2hGN0IsT0FBTyxFQUFHRyxDQUFDLElBQUtBLENBQUMsQ0FBQ2lULGVBQWUsQ0FBQyxDQUFFO0lBQ3BDaFQsS0FBSyxFQUFFO01BQUNpVCxXQUFXLEtBQUF6UyxNQUFBLENBQUkyQixDQUFDO0lBQUk7RUFBRSxnQkFDL0JsSCxLQUFBLENBQUFtRSxhQUFBO0lBQUtNLFNBQVMsRUFBQztFQUF1QyxnQkFDbER6RSxLQUFBLENBQUFtRSxhQUFBLDJCQUNJbkUsS0FBQSxDQUFBbUUsYUFBQTtJQUFJTSxTQUFTLEVBQUMsOENBQThDO0lBQUNNLEtBQUssRUFBRTtNQUFDaUIsS0FBSyxFQUFDa0I7SUFBQztFQUFFLEdBQUVrTixLQUFVLENBQUMsZUFDM0ZwVSxLQUFBLENBQUFtRSxhQUFBO0lBQUdNLFNBQVMsRUFBQztFQUE2QixHQUFFNFAsUUFBWSxDQUN2RCxDQUFDLGVBQ05yVSxLQUFBLENBQUFtRSxhQUFBO0lBQVFRLE9BQU8sRUFBRWMsT0FBUTtJQUFDaEIsU0FBUyxFQUFDO0VBQXVELEdBQUMsTUFBUyxDQUNwRyxDQUFDLEVBQ0w4UyxRQUFRLGVBQ1R2WCxLQUFBLENBQUFtRSxhQUFBO0lBQUtNLFNBQVMsRUFBQztFQUF5RSxnQkFDcEZ6RSxLQUFBLENBQUFtRSxhQUFBO0lBQVFRLE9BQU8sRUFBRWMsT0FBUTtJQUNqQmhCLFNBQVMsRUFBQztFQUEwSSxHQUFDLFFBRXJKLENBQUMsZUFDVHpFLEtBQUEsQ0FBQW1FLGFBQUE7SUFBUVEsT0FBTyxFQUFFSCxNQUFPO0lBQ2hCQyxTQUFTLEVBQUMsOEVBQThFO0lBQ3hGTSxLQUFLLEVBQUU7TUFBQ2MsVUFBVSxFQUFDcUIsQ0FBQztNQUFFK1EsU0FBUyxjQUFBMVMsTUFBQSxDQUFhMkIsQ0FBQztJQUFJO0VBQUUsR0FBQyxzQkFFcEQsQ0FDUCxDQUNKLENBQ0osQ0FBQztBQUVkOztBQUVBO0FBQ0FnUixRQUFRLENBQUNDLFVBQVUsQ0FBQ0MsUUFBUSxDQUFDQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQ0MsTUFBTSxjQUFDdFksS0FBQSxDQUFBbUUsYUFBQSxDQUFDekQsR0FBRyxNQUFDLENBQUMsQ0FBQyIsImlnbm9yZUxpc3QiOltdfQ==