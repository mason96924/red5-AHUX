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
      tHi: 50
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
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBfd2Fsay5jb21waWxlZC5qcyIsIm5hbWVzIjpbIl9SZWFjdCIsIlJlYWN0IiwidXNlU3RhdGUiLCJ1c2VNZW1vIiwiU1RFUFMiLCJrZXkiLCJsYWJlbCIsInN1YiIsImtpbmQiLCJpY29uQ29sb3IiLCJhY2NlbnQiLCJBcHAiLCJfdXNlU3RhdGUiLCJwc3kiLCJsb2NhdGlvbiIsImxhbmd1YWdlIiwicGx1Z2lucyIsIl91c2VTdGF0ZTIiLCJfc2xpY2VkVG9BcnJheSIsImRvbmUiLCJzZXREb25lIiwiX3VzZVN0YXRlMyIsIl91c2VTdGF0ZTQiLCJyb3V0ZSIsInNldFJvdXRlIiwiX3VzZVN0YXRlNSIsIl91c2VTdGF0ZTYiLCJtb2RhbCIsInNldE1vZGFsIiwiX3VzZVN0YXRlNyIsImdpdm9uaSIsInJoUHJlc2V0IiwicmhMbyIsInJoSGkiLCJ0TG8iLCJ0SGkiLCJfdXNlU3RhdGU4IiwicHN5Q2ZnIiwic2V0UHN5Q2ZnIiwiX3VzZVN0YXRlOSIsInNpdGVOYW1lIiwiY2l0eSIsImxhdCIsImxvbiIsIl91c2VTdGF0ZTAiLCJsb2NDZmciLCJzZXRMb2NDZmciLCJfdXNlU3RhdGUxIiwibGFuZyIsIl91c2VTdGF0ZTEwIiwibGFuZ0NmZyIsInNldExhbmdDZmciLCJfdXNlU3RhdGUxMSIsImVuYWJsZWQiLCJfdXNlU3RhdGUxMiIsInBsdWdpbkNmZyIsInNldFBsdWdpbkNmZyIsImNvbXBsZXRlQ291bnQiLCJPYmplY3QiLCJ2YWx1ZXMiLCJmaWx0ZXIiLCJCb29sZWFuIiwibGVuZ3RoIiwiZmluaXNoIiwiZCIsIl9vYmplY3RTcHJlYWQiLCJjcmVhdGVFbGVtZW50IiwiUHN5Q2hhcnRTZXR0aW5nUGFnZSIsImNmZyIsInNldENmZyIsIm9uQmFjayIsIm9uU2F2ZSIsImNsYXNzTmFtZSIsImhyZWYiLCJvbkNsaWNrIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsImUiLCJzdHlsZSIsImFuaW1hdGlvbkRlbGF5IiwibWFwIiwicyIsImkiLCJUaWxlIiwic3RlcCIsImluZGV4IiwiY29uY2F0IiwiTG9jYXRpb25Nb2RhbCIsIm9uQ2xvc2UiLCJMYW5ndWFnZU1vZGFsIiwiUGx1Z2luc01vZGFsIiwiX3JlZiIsImJhY2tncm91bmQiLCJib3JkZXIiLCJUaWxlSWNvbiIsImNvbG9yIiwiX3JlZjIiLCJzdHJva2UiLCJmaWxsIiwic3Ryb2tlV2lkdGgiLCJzdHJva2VMaW5lY2FwIiwic3Ryb2tlTGluZWpvaW4iLCJfZXh0ZW5kcyIsIndpZHRoIiwiaGVpZ2h0Iiwidmlld0JveCIsImN4IiwiY3kiLCJyIiwiX3JlZjMiLCJ1cGRhdGUiLCJrIiwidiIsImMiLCJ1c2VFZmZlY3QiLCJyYXciLCJnZXRJdGVtIiwicHJlc2V0IiwicGF0Y2giLCJwIiwiSlNPTiIsInBhcnNlIiwiTnVtYmVyIiwiaXNGaW5pdGUiLCJsbyIsImhpIiwiUkhfUFJFU0VUUyIsImZpbmQiLCJ4IiwiaWQiLCJrZXlzIiwicGVyc2lzdEFuZFNhdmUiLCJzdHJpbmdpZnkiLCJ3aW5kb3ciLCJkaXNwYXRjaEV2ZW50IiwiQ3VzdG9tRXZlbnQiLCJkZXRhaWwiLCJjb25zb2xlIiwiaW5mbyIsIndhcm4iLCJQc3lTa2VsZXRvbiIsIlBzeUNvbnRyb2xQYW5lbCIsIm5vdGUiLCJfcmVmNCIsIlciLCJIIiwicGFkIiwibGVmdCIsInJpZ2h0IiwidG9wIiwiYm90dG9tIiwiZ3JpZFciLCJncmlkSCIsIlRfTUlOIiwiVF9NQVgiLCJXX01JTiIsIldfTUFYIiwidCIsInkiLCJ3IiwiX2dldFciLCJnZXRXIiwicmgiLCJzYWZlUHRzIiwiYXJyIiwidG9GaXhlZCIsImpvaW4iLCJyaDgwIiwicHVzaCIsInJoMTAwIiwicmgyMExpbmUiLCJyaDIwX0NaIiwiQ1oiLCJyaEhpX3RvcCIsInR0IiwicmhMb19ib3QiLCJTV0VFVCIsIk5WIiwiTWFzcyIsIk1DViIsIkVWQVAiLCJ3aW50ZXJSSDgwIiwid2ludGVyUkgyMCIsIldJTlRFUiIsImlzb3BsZXRocyIsImJvcmRlclJhZGl1cyIsIkFycmF5IiwiZnJvbSIsIl8iLCJ4MSIsInkxIiwieDIiLCJ5MiIsImZvbnRTaXplIiwidGV4dEFuY2hvciIsInB0cyIsInd3IiwicG9pbnRzIiwic3Ryb2tlRGFzaGFycmF5IiwiTWF0aCIsImZsb29yIiwiZm9udFdlaWdodCIsIm9wYWNpdHkiLCJmaWxsT3BhY2l0eSIsImNsaXBQYXRoVW5pdHMiLCJjbGlwUGF0aCIsInRyYW5zZm9ybSIsImxldHRlclNwYWNpbmciLCJwYWludE9yZGVyIiwiX3JlZjUiLCJ2YWx1ZSIsIm9uQ2hhbmdlIiwidGFyZ2V0IiwidHlwZSIsIm1pbiIsIm1heCIsIl9yZWY2IiwibWFwQm94UmVmIiwidXNlUmVmIiwibWFwUmVmIiwibWFya2VyUmVmIiwiX1JlYWN0JHVzZVN0YXRlIiwiX1JlYWN0JHVzZVN0YXRlMiIsImdlb0J1c3kiLCJzZXRHZW9CdXN5IiwiX1JlYWN0JHVzZVN0YXRlMyIsIl9SZWFjdCR1c2VTdGF0ZTQiLCJzZWFyY2hRIiwic2V0U2VhcmNoUSIsIl9SZWFjdCR1c2VTdGF0ZTUiLCJfUmVhY3QkdXNlU3RhdGU2Iiwic2VhcmNoSGl0cyIsInNldFNlYXJjaEhpdHMiLCJfUmVhY3QkdXNlU3RhdGU3IiwiX1JlYWN0JHVzZVN0YXRlOCIsInNlYXJjaEJ1c3kiLCJzZXRTZWFyY2hCdXN5IiwiX1JlYWN0JHVzZVN0YXRlOSIsIl9SZWFjdCR1c2VTdGF0ZTAiLCJzZWFyY2hPcGVuIiwic2V0U2VhcmNoT3BlbiIsInNlYXJjaERlYm91bmNlUmVmIiwicnVuU2VhcmNoIiwiX3JlZjciLCJfYXN5bmNUb0dlbmVyYXRvciIsInEiLCJ0cmltIiwidXJsIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiZmV0Y2giLCJoZWFkZXJzIiwiaiIsImpzb24iLCJpc0FycmF5IiwiX3giLCJhcHBseSIsImFyZ3VtZW50cyIsImN1cnJlbnQiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwicGlja1NlYXJjaEhpdCIsImhpdCIsInJvdW5kIiwiZGlzcGxheV9uYW1lIiwic2V0VmlldyIsInJldmVyc2VHZW9jb2RlIiwiX3JlZjgiLCJhIiwiYWRkcmVzcyIsInRvd24iLCJ2aWxsYWdlIiwiaGFtbGV0IiwiY291bnR5IiwicmVnaW9uIiwic3RhdGUiLCJjb3VudHJ5IiwiX3gyIiwiX3gzIiwiTCIsInpvb21Db250cm9sIiwiYXR0cmlidXRpb25Db250cm9sIiwidGlsZUxheWVyIiwibWF4Wm9vbSIsImF0dHJpYnV0aW9uIiwiYWRkVG8iLCJtYXJrZXIiLCJkcmFnZ2FibGUiLCJiaW5kVG9vbHRpcCIsInBlcm1hbmVudCIsImFwcGx5TGF0TG9uIiwibiIsIm9uIiwibGwiLCJnZXRMYXRMbmciLCJsbmciLCJzZXRMYXRMbmciLCJsYXRsbmciLCJpbnZhbGlkYXRlU2l6ZSIsInJlbW92ZSIsInBhblRvIiwidXNlTXlMb2NhdGlvbiIsIm5hdmlnYXRvciIsImdlb2xvY2F0aW9uIiwiZ2V0Q3VycmVudFBvc2l0aW9uIiwicG9zIiwiY29vcmRzIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJlcnIiLCJfcmVmOSIsImxvYyIsIm5hbWUiLCJtZXRob2QiLCJib2R5IiwiYWN0aXZlIiwiZGVmYXVsdCIsIl9sYXN0V2VhdGhlckxvY2F0aW9uU2F2ZSIsIk1vZGFsU2hlbGwiLCJ0aXRsZSIsInN1YnRpdGxlIiwic2l6ZSIsIm1pbkhlaWdodCIsInJlZiIsIm92ZXJmbG93Iiwib25Gb2N1cyIsInBsYWNlaG9sZGVyIiwib3V0bGluZSIsImgiLCJwbGFjZV9pZCIsImNsYXNzIiwieiIsIl9yZWYwIiwibGFuZ3MiLCJjb2RlIiwibmF0aXZlIiwibCIsIlBMVUdJTl9DT05GSUdfRklFTERTIiwid2VhdGhlciIsIm9wdGlvbnMiLCJkZWYiLCJzd2VldF9zcG90IiwiZzM2IiwiZGlidCIsImxpZ2h0aW5nIiwiX3JlZjEiLCJBTEwiLCJkZXNjIiwidmVyIiwidG9nZ2xlIiwiaW5jbHVkZXMiLCJfUmVhY3QkdXNlU3RhdGUxIiwiX1JlYWN0JHVzZVN0YXRlMTAiLCJleHBhbmRlZElkIiwic2V0RXhwYW5kZWRJZCIsInVwZGF0ZUZpZWxkIiwicGx1Z2luSWQiLCJmaWVsZEtleSIsImZpZWxkcyIsImZpZWxkVmFsIiwiZmllbGQiLCJzdG9yZWQiLCJ1bmRlZmluZWQiLCJleHBhbmRlZCIsImYiLCJvIiwibmV4dCIsIl9yZWYxMCIsIl9yZWYxMCRhY2NlbnQiLCJfcmVmMTAkc2l6ZSIsImNoaWxkcmVuIiwiY29sb3JNYXAiLCJpbmRpZ28iLCJhbWJlciIsImVtZXJhbGQiLCJwaW5rIiwic2l6ZU1hcCIsIndpZGUiLCJzdG9wUHJvcGFnYXRpb24iLCJib3JkZXJDb2xvciIsImJveFNoYWRvdyIsIlJlYWN0RE9NIiwiY3JlYXRlUm9vdCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJyZW5kZXIiXSwic291cmNlcyI6WyIuLi9zcmMvc2V0dXAtd2Fsay9zZXR1cF93YWxrLmpzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB7IHVzZVN0YXRlLCB1c2VNZW1vIH0gPSBSZWFjdDtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogU1RFUCBERUZJTklUSU9OUyDigJQgdGhlIDQgd2FsayBwYXRocyB0aGUgdXNlciBkZXNjcmliZWRcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmNvbnN0IFNURVBTID0gW1xuICAgIHsga2V5Oidwc3knLCAgICAgIGxhYmVsOidQc3kgQ2hhcnQgU2V0dGluZycsICAgIHN1YjonR2l2b25pIMK3IFJIIHJhbmdlIMK3IGF4aXMgcmFuZ2UnLCBraW5kOidwYWdlJywgIGljb25Db2xvcjonIzgxOGNmOCcsIGFjY2VudDonaW5kaWdvJyB9LFxuICAgIHsga2V5Oidsb2NhdGlvbicsIGxhYmVsOidMb2NhdGlvbiBTZXR0aW5nJywgICAgIHN1YjonQ2l0eSBuYW1lICYgbGF0IC8gbG9uZycsICAgICAgICAga2luZDonbW9kYWwnLCBpY29uQ29sb3I6JyNmYmJmMjQnLCBhY2NlbnQ6J2FtYmVyJyB9LFxuICAgIHsga2V5OidsYW5ndWFnZScsIGxhYmVsOidMYW5ndWFnZSBTZXR0aW5nJywgICAgIHN1YjonRU4gwrcgRlIgwrcgRVMgwrcgWkggwrcg4oCmJywgICAgICAgICAga2luZDonbW9kYWwnLCBpY29uQ29sb3I6JyMzNGQzOTknLCBhY2NlbnQ6J2VtZXJhbGQnIH0sXG4gICAgeyBrZXk6J3BsdWdpbnMnLCAgbGFiZWw6J1BsdWctaW4gU2V0dGluZycsICAgICAgc3ViOidMaXN0IMK3IHVwbG9hZCDCtyBtb2RpZnknLCAgICAgICAgIGtpbmQ6J21vZGFsJywgaWNvbkNvbG9yOicjZjQ3MmI2JywgYWNjZW50OidwaW5rJyB9LFxuXTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogUk9PVCBBUFBcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIEFwcCgpIHtcbiAgICAvKiBjb21wbGV0aW9uICsgcGVyLXN0ZXAgY29uZmlnIC0tIG1vY2t1cCBzdGF0ZSwgbmV2ZXIgcGVyc2lzdGVkICovXG4gICAgY29uc3QgW2RvbmUsIHNldERvbmVdID0gdXNlU3RhdGUoeyBwc3k6ZmFsc2UsIGxvY2F0aW9uOmZhbHNlLCBsYW5ndWFnZTpmYWxzZSwgcGx1Z2luczpmYWxzZSB9KTtcbiAgICBjb25zdCBbcm91dGUsIHNldFJvdXRlXSA9IHVzZVN0YXRlKCdodWInKTsgICAvLyAnaHViJyB8ICdwc3knXG4gICAgY29uc3QgW21vZGFsLCBzZXRNb2RhbF0gPSB1c2VTdGF0ZShudWxsKTsgICAgIC8vICdsb2NhdGlvbicgfCAnbGFuZ3VhZ2UnIHwgJ3BsdWdpbnMnIHwgbnVsbFxuXG4gICAgY29uc3QgW3BzeUNmZywgc2V0UHN5Q2ZnXSAgICAgICAgID0gdXNlU3RhdGUoeyBnaXZvbmk6dHJ1ZSwgcmhQcmVzZXQ6J29mZmljZScsIHJoTG86MzAsIHJoSGk6NjAsIHRMbzotMTUsIHRIaTo1MCB9KTtcbiAgICBjb25zdCBbbG9jQ2ZnLCBzZXRMb2NDZmddICAgICAgICAgPSB1c2VTdGF0ZSh7IHNpdGVOYW1lOidNeSBCdWlsZGluZycsIGNpdHk6J1Rvcm9udG8sIE9OJywgbGF0OjQzLjY1MzIsIGxvbjotNzkuMzgzMiB9KTtcbiAgICBjb25zdCBbbGFuZ0NmZywgc2V0TGFuZ0NmZ10gICAgICAgPSB1c2VTdGF0ZSh7IGxhbmc6J2VuJyB9KTtcbiAgICBjb25zdCBbcGx1Z2luQ2ZnLCBzZXRQbHVnaW5DZmddICAgPSB1c2VTdGF0ZSh7IGVuYWJsZWQ6Wyd3ZWF0aGVyJywnZ2l2b25pJywnc3dlZXRfc3BvdCddIH0pO1xuXG4gICAgY29uc3QgY29tcGxldGVDb3VudCA9IE9iamVjdC52YWx1ZXMoZG9uZSkuZmlsdGVyKEJvb2xlYW4pLmxlbmd0aDtcblxuICAgIGNvbnN0IGZpbmlzaCA9IChrZXkpID0+IHtcbiAgICAgICAgc2V0RG9uZShkID0+ICh7Li4uZCwgW2tleV06dHJ1ZX0pKTtcbiAgICAgICAgc2V0Um91dGUoJ2h1YicpO1xuICAgICAgICBzZXRNb2RhbChudWxsKTtcbiAgICB9O1xuXG4gICAgLyogZnVsbC1wYWdlIFBzeSBDaGFydCBlZGl0b3IgKi9cbiAgICBpZiAocm91dGUgPT09ICdwc3knKSB7XG4gICAgICAgIHJldHVybiA8UHN5Q2hhcnRTZXR0aW5nUGFnZSBjZmc9e3BzeUNmZ30gc2V0Q2ZnPXtzZXRQc3lDZmd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkJhY2s9eygpID0+IHNldFJvdXRlKCdodWInKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2F2ZT17KCkgPT4gZmluaXNoKCdwc3knKX0gLz47XG4gICAgfVxuXG4gICAgLyogZGVmYXVsdDogSFVCIHNjcmVlbiAqL1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWluLWgtc2NyZWVuIHB4LTYgcHktOFwiPlxuICAgICAgICAgICAgey8qIC0tLS0tLS0tLS0tLS0gaGVhZGVyIC0tLS0tLS0tLS0tLS0gKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1heC13LTV4bCBteC1hdXRvIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBtYi0xMCBmYWRlLXVwXCI+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cInRleHQtMnhsIHNtOnRleHQtM3hsIGZvbnQtYmxhY2sgaXRhbGljIHVwcGVyY2FzZSB0cmFja2luZy10aWdodFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1yZWQtNTAwXCI+UmVkNTwvc3Bhbj4gPHNwYW4gY2xhc3NOYW1lPVwidGV4dC13aGl0ZVwiPlN0dWRpbzwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNTAwIGZvbnQtbm9ybWFsIGl0YWxpY1wiPiAmbmJzcDsvJm5ic3A7IHNldHVwIHdhbGs8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvaDE+XG4gICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNTAwIHRleHQteHMgbXQtMSBmb250LW1vbm8gdHJhY2tpbmctd2lkZVwiPkNvbmZpZ3VyZSBvbmNlLiBTa2lwIGFueSBzdGVwIHlvdSBkb24ndCBuZWVkLjwvcD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC00XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInBpbGwgYmctc2xhdGUtODAwIHRleHQtc2xhdGUtNDAwXCI+e2NvbXBsZXRlQ291bnR9LzQgRE9ORTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIi9kYXNoYm9hcmQuaHRtbFwiXG4gICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHsgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDUuc2V0dXAuZG9uZScsJzEnKTsgfSBjYXRjaChlKXt9IH19XG4gICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS01MDAgaG92ZXI6dGV4dC1zbGF0ZS0zMDAgdW5kZXJsaW5lIHVuZGVybGluZS1vZmZzZXQtNFwiPlNraXAgYWxsIOKGkjwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogLS0tLS0tLS0tLS0tLSB0aWxlIGdyaWQgLS0tLS0tLS0tLS0tLSAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctNXhsIG14LWF1dG8gZ3JpZCBncmlkLWNvbHMtMSBzbTpncmlkLWNvbHMtMiBnYXAtNSBmYWRlLXVwXCIgc3R5bGU9e3thbmltYXRpb25EZWxheTonLjA4cyd9fT5cbiAgICAgICAgICAgICAgICB7U1RFUFMubWFwKChzLCBpKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDxUaWxlIGtleT17cy5rZXl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXA9e3N9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmU9e2RvbmVbcy5rZXldfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleD17aSsxfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzLmtpbmQgPT09ICdwYWdlJyA/IHNldFJvdXRlKHMua2V5KSA6IHNldE1vZGFsKHMua2V5KX0gLz5cbiAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogLS0tLS0tLS0tLS0tLSBmb290ZXIgQ1RBIC0tLS0tLS0tLS0tLS0gKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1heC13LTV4bCBteC1hdXRvIG10LTEwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBmYWRlLXVwXCIgc3R5bGU9e3thbmltYXRpb25EZWxheTonLjE4cyd9fT5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCB0ZXh0LXhzIGZvbnQtbW9ub1wiPlxuICAgICAgICAgICAgICAgICAgICB7Y29tcGxldGVDb3VudCA9PT0gMCAmJiAn4oaRIFBpY2sgYSBzZXR0aW5nIHRvIHN0YXJ0LCBvciBza2lwIGFsbCBhbmQgZ28gc3RyYWlnaHQgdG8gdGhlIGRhc2hib2FyZC4nfVxuICAgICAgICAgICAgICAgICAgICB7Y29tcGxldGVDb3VudCA+IDAgJiYgY29tcGxldGVDb3VudCA8IDQgJiYgYOKGkSAkezQgLSBjb21wbGV0ZUNvdW50fSBzdGVwJHs0IC0gY29tcGxldGVDb3VudCA9PT0gMSA/ICcnIDogJ3MnfSByZW1haW5pbmcgKG9wdGlvbmFsKS5gfVxuICAgICAgICAgICAgICAgICAgICB7Y29tcGxldGVDb3VudCA9PT0gNCAmJiAn4pyTIEFsbCBzdGVwcyBjb25maWd1cmVkLiAgUmVhZHkgd2hlbiB5b3UgYXJlLid9XG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIvZGFzaGJvYXJkLmh0bWxcIlxuICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHsgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDUuc2V0dXAuZG9uZScsJzEnKTsgfSBjYXRjaChlKXt9IH19XG4gICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHgtNyBweS0zIHJvdW5kZWQteGwgdGV4dC1zbSBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Y29tcGxldGVDb3VudCA9PT0gNFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLWVtZXJhbGQtNjAwIGhvdmVyOmJnLWVtZXJhbGQtNTAwIHRleHQtd2hpdGUgc2hhZG93LWxnIHNoYWRvdy1lbWVyYWxkLTUwMC8zMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1pbmRpZ28tNjAwIGhvdmVyOmJnLWluZGlnby01MDAgdGV4dC13aGl0ZSBzaGFkb3ctbGcgc2hhZG93LWluZGlnby01MDAvMjAnfWB9PlxuICAgICAgICAgICAgICAgICAgICBPcGVuIERhc2hib2FyZCDihpJcbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIC0tLS0tLS0tLS0tLS0gbW9kYWxzIC0tLS0tLS0tLS0tLS0gKi99XG4gICAgICAgICAgICB7bW9kYWwgPT09ICdsb2NhdGlvbicgJiYgPExvY2F0aW9uTW9kYWwgY2ZnPXtsb2NDZmd9IHNldENmZz17c2V0TG9jQ2ZnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0TW9kYWwobnVsbCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNhdmU9eygpID0+IGZpbmlzaCgnbG9jYXRpb24nKX0gLz59XG4gICAgICAgICAgICB7bW9kYWwgPT09ICdsYW5ndWFnZScgJiYgPExhbmd1YWdlTW9kYWwgY2ZnPXtsYW5nQ2ZnfSBzZXRDZmc9e3NldExhbmdDZmd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRNb2RhbChudWxsKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2F2ZT17KCkgPT4gZmluaXNoKCdsYW5ndWFnZScpfSAvPn1cbiAgICAgICAgICAgIHttb2RhbCA9PT0gJ3BsdWdpbnMnICAmJiA8UGx1Z2luc01vZGFsICBjZmc9e3BsdWdpbkNmZ30gc2V0Q2ZnPXtzZXRQbHVnaW5DZmd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRNb2RhbChudWxsKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2F2ZT17KCkgPT4gZmluaXNoKCdwbHVnaW5zJyl9IC8+fVxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBUaWxlIChsYXJnZSBlYXN5LW9uLWV5ZXMgYnV0dG9uKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuZnVuY3Rpb24gVGlsZSh7IHN0ZXAsIGRvbmUsIGluZGV4LCBvbkNsaWNrIH0pIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdGlsZS1idG4gcmVsYXRpdmUgdGV4dC1sZWZ0IGJnLXNsYXRlLTkwMC83MCBib3JkZXItMiBib3JkZXItc2xhdGUtNzAwLzcwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91bmRlZC0yeGwgcC02IHNtOnAtNyAke2RvbmUgPyAnZG9uZScgOiAnJ31gfT5cbiAgICAgICAgICAgIHtkb25lICYmIDxzcGFuIGNsYXNzTmFtZT1cImNoZWNrXCI+4pyTPC9zcGFuPn1cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTQgbWItM1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy0xMiBoLTEyIHJvdW5kZWQteGwgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOmAke3N0ZXAuaWNvbkNvbG9yfTIyYCwgYm9yZGVyOmAxcHggc29saWQgJHtzdGVwLmljb25Db2xvcn01NWB9fT5cbiAgICAgICAgICAgICAgICAgICAgPFRpbGVJY29uIGtpbmQ9e3N0ZXAua2V5fSBjb2xvcj17c3RlcC5pY29uQ29sb3J9IC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LTN4bCBmb250LWJsYWNrIHRleHQtc2xhdGUtNzAwXCI+MHtpbmRleH08L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtbGcgc206dGV4dC14bCBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlciBtYi0xXCJcbiAgICAgICAgICAgICAgICBzdHlsZT17e2NvbG9yOnN0ZXAuaWNvbkNvbG9yfX0+e3N0ZXAubGFiZWx9PC9oMz5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNDAwIHRleHQtc20gbGVhZGluZy1zbnVnXCI+e3N0ZXAuc3VifTwvcD5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNCBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiB0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTUwMFwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInBpbGwgYmctc2xhdGUtODAwIHRleHQtc2xhdGUtNDAwXCI+e3N0ZXAua2luZCA9PT0gJ3BhZ2UnID8gJ0Z1bGwgcGFnZScgOiAnUG9wdXAnfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICB7ZG9uZSAmJiA8c3BhbiBjbGFzc05hbWU9XCJwaWxsIGJnLWVtZXJhbGQtOTAwLzQwIHRleHQtZW1lcmFsZC00MDBcIj5Db25maWd1cmVkPC9zcGFuPn1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2J1dHRvbj5cbiAgICApO1xufVxuXG5mdW5jdGlvbiBUaWxlSWNvbih7IGtpbmQsIGNvbG9yIH0pIHtcbiAgICAvKiBzaW1wbGUgaW5saW5lIFNWR3Mgc28gd2Uga2VlcCB0aGUgZmlsZSBzZWxmLWNvbnRhaW5lZCAqL1xuICAgIGNvbnN0IHN0cm9rZSA9IHsgc3Ryb2tlOmNvbG9yLCBmaWxsOidub25lJywgc3Ryb2tlV2lkdGg6Miwgc3Ryb2tlTGluZWNhcDoncm91bmQnLCBzdHJva2VMaW5lam9pbjoncm91bmQnIH07XG4gICAgaWYgKGtpbmQgPT09ICdwc3knKSAgICAgIHJldHVybiA8c3ZnIHdpZHRoPVwiMjJcIiBoZWlnaHQ9XCIyMlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB7Li4uc3Ryb2tlfT48cGF0aCBkPVwiTTMgM3YxOGgxOFwiLz48cGF0aCBkPVwiTTMgMTdjNC0xIDctNiA5LTlzNS0zIDktMlwiLz48L3N2Zz47XG4gICAgaWYgKGtpbmQgPT09ICdsb2NhdGlvbicpIHJldHVybiA8c3ZnIHdpZHRoPVwiMjJcIiBoZWlnaHQ9XCIyMlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB7Li4uc3Ryb2tlfT48cGF0aCBkPVwiTTEyIDIycy03LTYuNC03LTEyYTcgNyAwIDEgMSAxNCAwYzAgNS42LTcgMTItNyAxMnpcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMFwiIHI9XCIyLjVcIi8+PC9zdmc+O1xuICAgIGlmIChraW5kID09PSAnbGFuZ3VhZ2UnKSByZXR1cm4gPHN2ZyB3aWR0aD1cIjIyXCIgaGVpZ2h0PVwiMjJcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgey4uLnN0cm9rZX0+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI5XCIvPjxwYXRoIGQ9XCJNMyAxMmgxOE0xMiAzYTE0IDE0IDAgMCAxIDAgMThNMTIgM2ExNCAxNCAwIDAgMCAwIDE4XCIvPjwvc3ZnPjtcbiAgICBpZiAoa2luZCA9PT0gJ3BsdWdpbnMnKSAgcmV0dXJuIDxzdmcgd2lkdGg9XCIyMlwiIGhlaWdodD1cIjIyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHsuLi5zdHJva2V9PjxwYXRoIGQ9XCJNOSAzdjZNMTUgM3Y2XCIvPjxwYXRoIGQ9XCJNNSA5aDE0djZhNCA0IDAgMCAxLTQgNGgtMXYzTTkgMTl2M1wiLz48L3N2Zz47XG4gICAgcmV0dXJuIG51bGw7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFBzeSBDaGFydCBTZXR0aW5nIC0tIEZVTEwgUEFHRSwgbGl2ZSBza2VsZXRvbiByZXNwb25kcyB0byBjb250cm9sc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuZnVuY3Rpb24gUHN5Q2hhcnRTZXR0aW5nUGFnZSh7IGNmZywgc2V0Q2ZnLCBvbkJhY2ssIG9uU2F2ZSB9KSB7XG4gICAgY29uc3QgdXBkYXRlID0gKGssIHYpID0+IHNldENmZyhjID0+ICh7Li4uYywgW2tdOnZ9KSk7XG5cbiAgICAvKiBPbiBtb3VudDogaHlkcmF0ZSBmcm9tIHRoZSBTQU1FIGxvY2FsU3RvcmFnZSBrZXkgdGhlIGRhc2hib2FyZCByZWFkc1xuICAgICAqIChgcmVkNV9zd2VldF9zcG90X3JhbmdlYCkgcGx1cyB0aGUgcHJlc2V0IGlkIChgcmVkNV9yaF9wcmVzZXRgKSBzb1xuICAgICAqIHRoZSBkcm9wZG93biBsYWJlbCBzdGF5cyBjb25zaXN0ZW50IHdpdGggdGhlIHNsaWRlciB2YWx1ZXMgYWNyb3NzXG4gICAgICogcmVsb2Fkcy4gIElmIHRoZSBvcGVyYXRvciBoYXMgYWxyZWFkeSB0dW5lZCB0aGUgUkggYmFuZCBvbiB0aGVcbiAgICAgKiBkYXNoYm9hcmQsIHRoZSBzZXR1cCB3YWxrIHN0YXJ0cyBmcm9tIHRob3NlIHZhbHVlcy4gKi9cbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmF3ICAgID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlZDVfc3dlZXRfc3BvdF9yYW5nZScpO1xuICAgICAgICAgICAgY29uc3QgcHJlc2V0ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlZDVfcmhfcHJlc2V0Jyk7XG4gICAgICAgICAgICBjb25zdCBwYXRjaCAgPSB7fTtcbiAgICAgICAgICAgIGlmIChyYXcpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwID0gSlNPTi5wYXJzZShyYXcpO1xuICAgICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUocC5sbykgJiYgTnVtYmVyLmlzRmluaXRlKHAuaGkpICYmIHAubG8gPCBwLmhpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhdGNoLnJoTG8gPSBwLmxvO1xuICAgICAgICAgICAgICAgICAgICBwYXRjaC5yaEhpID0gcC5oaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJlc2V0ICYmIFJIX1BSRVNFVFMuZmluZCh4ID0+IHguaWQgPT09IHByZXNldCkpIHtcbiAgICAgICAgICAgICAgICBwYXRjaC5yaFByZXNldCA9IHByZXNldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhwYXRjaCkubGVuZ3RoKSBzZXRDZmcoYyA9PiAoey4uLmMsIC4uLnBhdGNofSkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IC8qIGlnbm9yZSAqLyB9XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xuICAgIH0sIFtdKTtcblxuICAgIC8qIE9uIHNhdmU6IHBlcnNpc3QgdGhlIFJIIGJhbmQgdG8gbG9jYWxTdG9yYWdlIHNvIHRoZSBkYXNoYm9hcmQnc1xuICAgICAqIHN3ZWV0LXNwb3QgcG9seWdvbiBwaWNrcyBpdCB1cCBvbiBuZXh0IGxvYWQuICBBbHNvIHBlcnNpc3QgdGhlIHZlbnVlXG4gICAgICogcHJlc2V0IGlkIChmb3IgZnV0dXJlIFwic2hvdyBwcmVzZXQgbmFtZSBvbiBkYXNoYm9hcmRcIiBmZWF0dXJlcykuICovXG4gICAgY29uc3QgcGVyc2lzdEFuZFNhdmUgPSAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNV9zd2VldF9zcG90X3JhbmdlJyxcbiAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh7IGxvOiBjZmcucmhMbywgaGk6IGNmZy5yaEhpIH0pKTtcbiAgICAgICAgICAgIGlmIChjZmcucmhQcmVzZXQpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNV9yaF9wcmVzZXQnLCBjZmcucmhQcmVzZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdyNS1yaC1iYW5kLWNoYW5nZScsIHtcbiAgICAgICAgICAgICAgICBkZXRhaWw6IHsgbG86IGNmZy5yaExvLCBoaTogY2ZnLnJoSGkgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdbc2V0dXAgd2Fsa10gcHN5IGNoYXJ0IHNhdmVkIC0+IFJIJywgY2ZnLnJoTG8sICctJywgY2ZnLnJoSGksICclICBwcmVzZXQ9JywgY2ZnLnJoUHJlc2V0KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdbc2V0dXAgd2Fsa10gY291bGQgbm90IHBlcnNpc3QgcHN5IHNldHRpbmdzOicsIGUpO1xuICAgICAgICB9XG4gICAgICAgIG9uU2F2ZSgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1pbi1oLXNjcmVlbiBmbGV4IGZsZXgtY29sXCI+XG4gICAgICAgICAgICB7LyogaGVhZGVyICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcHgtNiBweS00IGJvcmRlci1iIGJvcmRlci1zbGF0ZS04MDBcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQmFja31cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNDAwIGhvdmVyOnRleHQtd2hpdGUgdGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2tcIj5cbiAgICAgICAgICAgICAgICAgICAg4oaQIEJhY2sgdG8gc2V0dXBcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwidGV4dC1zbSB1cHBlcmNhc2UgdHJhY2tpbmctWzAuM2VtXSBmb250LWJsYWNrIHRleHQtaW5kaWdvLTQwMFwiPlBzeSBDaGFydCBTZXR0aW5nPC9oMT5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3BlcnNpc3RBbmRTYXZlfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtNSBweS0yIHJvdW5kZWQtbGcgYmctaW5kaWdvLTYwMCBob3ZlcjpiZy1pbmRpZ28tNTAwIHRleHQtd2hpdGUgdGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2tcIj5cbiAgICAgICAgICAgICAgICAgICAgU2F2ZSAmIHJldHVybiDinJNcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogYm9keSDigJQgY2hhcnQgbGVmdCwgY29udHJvbHMgcmlnaHQgKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMSBncmlkIGdyaWQtY29scy0xIGxnOmdyaWQtY29scy1bMWZyXzM2MHB4XSBnYXAtNCBwLTYgbWF4LXctN3hsIG14LWF1dG8gdy1mdWxsXCI+XG4gICAgICAgICAgICAgICAgPFBzeVNrZWxldG9uIGNmZz17Y2ZnfSAvPlxuICAgICAgICAgICAgICAgIDxQc3lDb250cm9sUGFuZWwgY2ZnPXtjZmd9IHVwZGF0ZT17dXBkYXRlfSBzZXRDZmc9e3NldENmZ30gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG4vKiBSSCBiYW5kIHByZXNldHMg4oCUIHJlY29nbmlzZWQgaW5kdXN0cnkgc3RhbmRhcmRzIGZvciBlYWNoIHZlbnVlIHR5cGUuXG4gKiBTb3VyY2VzOiBBU0hSQUUgNTUgKGNvbWZvcnQpLCBBU0hSQUUgMTcwIChoZWFsdGhjYXJlKSxcbiAqIEFBTS9OUFMvU21pdGhzb25pYW4gZ3VpZGFuY2UgKGNvbGxlY3Rpb25zKSwgQ0lCU0UgVE00MCAobGlicmFyaWVzKS4gKi9cbmNvbnN0IFJIX1BSRVNFVFMgPSBbXG4gICAgeyBpZDonY3VzdG9tJywgICAgICAgICAgbGFiZWw6J0N1c3RvbSAobWFudWFsKScsICAgICAgICAgICAgICAgICBsbzpudWxsLCBoaTpudWxsLCBub3RlOicnIH0sXG4gICAgeyBpZDonb2ZmaWNlJywgICAgICAgICAgbGFiZWw6J09mZmljZScsICAgICAgICAgICAgICAgICAgICAgICAgICBsbzozMCwgICBoaTo2MCwgICBub3RlOidBU0hSQUUgNTUgY29tZm9ydCcgICAgICAgICAgICAgICAgICB9LFxuICAgIHsgaWQ6J211c2V1bScsICAgICAgICAgIGxhYmVsOidNdXNldW0nLCAgICAgICAgICAgICAgICAgICAgICAgICAgbG86NDAsICAgaGk6NTUsICAgbm90ZTonQUFNIGNvbGxlY3Rpb24gcHJlc2VydmF0aW9uJyAgICAgICAgfSxcbiAgICB7IGlkOidob3RlbCcsICAgICAgICAgICBsYWJlbDonSG90ZWwgZ3Vlc3Qgcm9vbScsICAgICAgICAgICAgICAgIGxvOjMwLCAgIGhpOjYwLCAgIG5vdGU6J2dlbmVyYWwgb2NjdXBhbnQgY29tZm9ydCcgICAgICAgICAgIH0sXG4gICAgeyBpZDonbGlicmFyeScsICAgICAgICAgbGFiZWw6J0xpYnJhcnkgLyBBcmNoaXZlJywgICAgICAgICAgICAgICBsbzo0MCwgICBoaTo1NSwgICBub3RlOidwYXBlciAmIGJpbmRpbmcgcHJlc2VydmF0aW9uJyAgICAgICB9LFxuICAgIHsgaWQ6J2hvc3BpdGFsJywgICAgICAgIGxhYmVsOidIb3NwaXRhbCAoZ2VuZXJhbCknLCAgICAgICAgICAgICAgbG86MzAsICAgaGk6NjAsICAgbm90ZTonQVNIUkFFIDE3MCBwYXRpZW50IGFyZWFzJyAgICAgICAgICAgfSxcbiAgICB7IGlkOidsZWN0dXJlJywgICAgICAgICBsYWJlbDonTGVjdHVyZSBoYWxsJywgICAgICAgICAgICAgICAgICAgIGxvOjMwLCAgIGhpOjYwLCAgIG5vdGU6J2hpZ2ggb2NjdXBhbmN5IGNvbWZvcnQnICAgICAgICAgICAgIH0sXG4gICAgeyBpZDonY29uY2VydCcsICAgICAgICAgbGFiZWw6J0NvbmNlcnQgaGFsbCcsICAgICAgICAgICAgICAgICAgICBsbzo0MCwgICBoaTo1NSwgICBub3RlOidpbnN0cnVtZW50IHR1bmluZyBzdGFiaWxpdHknICAgICAgICB9LFxuICAgIHsgaWQ6J21lZXRpbmcnLCAgICAgICAgIGxhYmVsOidNZWV0aW5nIHJvb20nLCAgICAgICAgICAgICAgICAgICAgbG86MzAsICAgaGk6NjAsICAgbm90ZTonc21hbGwgZ3JvdXAgY29tZm9ydCcgICAgICAgICAgICAgICAgfSxcbiAgICB7IGlkOidleGhpYml0aW9uJywgICAgICBsYWJlbDonRXhoaWJpdGlvbiBoYWxsJywgICAgICAgICAgICAgICAgIGxvOjQwLCAgIGhpOjU1LCAgIG5vdGU6J21peGVkIGFydCAvIGFydGlmYWN0IGRpc3BsYXknICAgICAgIH0sXG5dO1xuXG4vKiBSZWFsIHBzeSBjaGFydCDigJQgdXNlcyB0aGUgU0FNRSBnZXRXICsgR0lWT05JX0NPTE9SUyArIHBvbHlnb24gbWF0aCBhcyB0aGVcbiAqIHByb2R1Y3Rpb24gZGFzaGJvYXJkLiAgU291cmNlIG9mIHRydXRoOiAganMvcHN5Y2hyb21ldHJpYy5qcyAgYW5kIHRoZVxuICogcmVuZGVyR2l2b25pT3ZlcmxheSgpIGJsb2NrIGF0IGFwcC5qczoxNjQxLTE3MjIuXG4gKiBBbnl0aGluZyB5b3UgY2hhbmdlIGluIHRob3NlIGZpbGVzIE1VU1QgYmUgbWlycm9yZWQgaGVyZS4gKi9cbmZ1bmN0aW9uIFBzeVNrZWxldG9uKHsgY2ZnIH0pIHtcbiAgICAvKiBDYW52YXMgKyBwYWRkaW5nICovXG4gICAgY29uc3QgVyA9IDc2MCwgSCA9IDQ4MDtcbiAgICBjb25zdCBwYWQgPSB7IGxlZnQ6IDU2LCByaWdodDogNDAsIHRvcDogMjgsIGJvdHRvbTogNTYgfTtcbiAgICBjb25zdCBncmlkVyA9IFcgLSBwYWQubGVmdCAtIHBhZC5yaWdodDtcbiAgICBjb25zdCBncmlkSCA9IEggLSBwYWQudG9wICAtIHBhZC5ib3R0b207XG5cbiAgICBjb25zdCBUX01JTiA9IGNmZy50TG8sIFRfTUFYID0gY2ZnLnRIaTtcbiAgICBjb25zdCBXX01JTiA9IDAsICAgICAgIFdfTUFYID0gMC4wMzA7ICAgICAgICAgIC8vIGtnL2tnXG5cbiAgICAvKiBheGlzIHNjYWxlcyAtLSBtYXRjaCB0aGUgbGl2ZSBkYXNoYm9hcmQgKi9cbiAgICBjb25zdCB4ICA9ICh0KSA9PiBwYWQubGVmdCArICgodCAtIFRfTUlOKSAvIChUX01BWCAtIFRfTUlOKSkgKiBncmlkVztcbiAgICBjb25zdCB5ICA9ICh3KSA9PiBwYWQudG9wICArICgxIC0gKHcgLSBXX01JTikgLyAoV19NQVggLSBXX01JTikpICogZ3JpZEg7XG4gICAgY29uc3QgX2dldFcgPSAodHlwZW9mIGdldFcgPT09ICdmdW5jdGlvbicpID8gZ2V0VyA6ICgodCwgcmgpID0+IDApO1xuXG4gICAgY29uc3Qgc2FmZVB0cyA9IChhcnIpID0+IGFyci5tYXAocCA9PiBgJHsoeChwWzBdKXx8MCkudG9GaXhlZCgyKX0sJHsoeShwWzFdKXx8MCkudG9GaXhlZCgyKX1gKS5qb2luKCcgJyk7XG5cbiAgICAvKiAtLS0tIEdpdm9uaSBwb2x5Z29ucyAtLSBDT1BJRUQgVkVSQkFUSU0gZnJvbSBhcHAuanM6MTY0My0xNjY5IC0tLS0gKi9cbiAgICBjb25zdCByaDgwID0gW107IGZvciAobGV0IHQ9MjA7IHQ8PTI1OyB0Kz0wLjUpIHJoODAucHVzaChbdCwgX2dldFcodCwgODApXSk7XG4gICAgY29uc3QgcmgxMDA9IFtdOyBmb3IgKGxldCB0PTIwOyB0PD0yNzsgdCs9MC41KSByaDEwMC5wdXNoKFt0LCBfZ2V0Vyh0LCAxMDApXSk7XG4gICAgY29uc3QgcmgyMExpbmUgPSBbXTsgZm9yIChsZXQgdD0zMjsgdD49MjA7IHQtPTAuNSkgcmgyMExpbmUucHVzaChbdCwgX2dldFcodCwgMjApXSk7XG4gICAgY29uc3QgcmgyMF9DWiAgPSBbXTsgZm9yIChsZXQgdD0yNzsgdD49MjA7IHQtPTAuNSkgcmgyMF9DWi5wdXNoKFt0LCBfZ2V0Vyh0LCAyMCldKTtcbiAgICBjb25zdCBDWiAgID0gWy4uLnJoODAsIFsyNywgX2dldFcoMjcsIDUwKV0sIFsyNywgX2dldFcoMjcsIDIwKV0sIC4uLnJoMjBfQ1pdO1xuXG4gICAgY29uc3QgcmhIaV90b3AgPSBbXTsgZm9yIChsZXQgdHQ9MjA7IHR0PD0yNzsgdHQrPTAuNSkgcmhIaV90b3AucHVzaChbdHQsIF9nZXRXKHR0LCBjZmcucmhIaSldKTtcbiAgICBjb25zdCByaExvX2JvdCA9IFtdOyBmb3IgKGxldCB0dD0yNzsgdHQ+PTIwOyB0dC09MC41KSByaExvX2JvdC5wdXNoKFt0dCwgX2dldFcodHQsIGNmZy5yaExvKV0pO1xuICAgIGNvbnN0IFNXRUVUID0gWy4uLnJoSGlfdG9wLCAuLi5yaExvX2JvdF07XG5cbiAgICBjb25zdCBOViAgID0gWy4uLnJoMTAwLCBbMzIsIDE1LjQvMTAwMF0sIFszMiwgNi4yLzEwMDBdLCAuLi5yaDIwTGluZV07XG4gICAgY29uc3QgTWFzcyA9IFsuLi5yaDgwLCBbMzMsIDE2LzEwMDBdLCBbMzcsIF9nZXRXKDM3LCAzMCldLCBbMzcsIDMvMTAwMF0sIFsyMCwgX2dldFcoMjAsIDIwKV1dO1xuICAgIGNvbnN0IE1DViAgPSBbLi4ucmg4MCwgWzQwLCAxNi8xMDAwXSwgWzQ0LCBfZ2V0Vyg0NCwgMjApXSwgWzQ0LCAzLzEwMDBdLCBbMjAsIF9nZXRXKDIwLCAyMCldXTtcbiAgICBjb25zdCBFVkFQID0gWy4uLnJoODAsIFsyNSwgMTYvMTAwMF0sIFszNiwgX2dldFcoMzYsIDMwKV0sIFszOSwgX2dldFcoMzksIDIwKV0sXG4gICAgICAgICAgICAgICAgICBbNDEsIF9nZXRXKDQxLCAxMCldLCBbNDEsIDBdLCBbMjcuMiwgMF0sIFsyMCwgX2dldFcoMjAsIDIwKV1dO1xuXG4gICAgY29uc3Qgd2ludGVyUkg4MCA9IFtdOyBmb3IgKGxldCB0PTE4OyB0PD0xOS41OyB0Kz0wLjUpIHdpbnRlclJIODAucHVzaChbdCwgX2dldFcodCwgODApXSk7XG4gICAgY29uc3Qgd2ludGVyUkgyMCA9IFtdOyBmb3IgKGxldCB0PTE5LjU7IHQ+PTE4OyB0LT0wLjUpIHdpbnRlclJIMjAucHVzaChbdCwgX2dldFcodCwgMjApXSk7XG4gICAgY29uc3QgV0lOVEVSID0gWy4uLndpbnRlclJIODAsIC4uLndpbnRlclJIMjBdO1xuXG4gICAgLyogUkggaXNvcGxldGggY3VydmVzIGZvciB0aGUgY2hhcnQgZ3JpZCAqL1xuICAgIGNvbnN0IGlzb3BsZXRocyA9IFsyMCwgNDAsIDYwLCA4MCwgMTAwXTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctc2xhdGUtOTAwLzYwIGJvcmRlciBib3JkZXItc2xhdGUtODAwIHJvdW5kZWQtMnhsIHAtNFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gbWItM1wiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInBpbGwgYmctc2xhdGUtODAwIHRleHQtc2xhdGUtNDAwXCI+UFNZQ0hST01FVFJJQyBDSEFSVCDCtyBsaXZlIHByZXZpZXc8L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgZm9udC1tb25vXCI+e1RfTUlOfcKwQyDihpIge1RfTUFYfcKwQyAgwrcgIHtjZmcucmhMb33igJN7Y2ZnLnJoSGl9JSBSSDwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHN2ZyB2aWV3Qm94PXtgMCAwICR7V30gJHtIfWB9IGNsYXNzTmFtZT1cInctZnVsbCBoLWF1dG9cIiBzdHlsZT17e2JhY2tncm91bmQ6JyMwYjEyMjAnLCBib3JkZXJSYWRpdXM6OH19PlxuICAgICAgICAgICAgICAgIHsvKiAtLS0tIGdyaWQ6IHZlcnRpY2FsIFQgbGluZXMsIGhvcml6b250YWwgVyBsaW5lcyAtLS0tICovfVxuICAgICAgICAgICAgICAgIHtBcnJheS5mcm9tKHtsZW5ndGg6MTF9KS5tYXAoKF8saSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ID0gVF9NSU4gKyAoaS8xMCkgKiAoVF9NQVggLSBUX01JTik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZyBrZXk9eyd2dCcraX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3godCl9IHkxPXtwYWQudG9wfSB4Mj17eCh0KX0geTI9e3BhZC50b3ArZ3JpZEh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiIzFlMjkzYlwiIHN0cm9rZVdpZHRoPVwiMC42XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3godCl9IHk9e3BhZC50b3ArZ3JpZEgrMTZ9IGZvbnRTaXplPVwiOS41XCIgZmlsbD1cIiM5NGEzYjhcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIj57dC50b0ZpeGVkKDApfTwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICB7QXJyYXkuZnJvbSh7bGVuZ3RoOjd9KS5tYXAoKF8saSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB3ID0gV19NSU4gKyAoaS82KSAqIChXX01BWCAtIFdfTUlOKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxnIGtleT17J2h3JytpfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17cGFkLmxlZnR9IHkxPXt5KHcpfSB4Mj17cGFkLmxlZnQrZ3JpZFd9IHkyPXt5KHcpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cIiMxZTI5M2JcIiBzdHJva2VXaWR0aD1cIjAuNlwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXtwYWQubGVmdC04fSB5PXt5KHcpKzN9IGZvbnRTaXplPVwiOS41XCIgZmlsbD1cIiM5NGEzYjhcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJlbmRcIj57KHcqMTAwMCkudG9GaXhlZCgwKX08L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgey8qIC0tLS0gUkggaXNvcGxldGhzIChjdXJ2ZXMpIC0tLS0gKi99XG4gICAgICAgICAgICAgICAge2lzb3BsZXRocy5tYXAocmggPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwdHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdCA9IFRfTUlOOyB0IDw9IFRfTUFYOyB0ICs9IDAuNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgd3cgPSBfZ2V0Vyh0LCByaCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod3cgPj0gV19NSU4gJiYgd3cgPD0gV19NQVgpIHB0cy5wdXNoKFt0LCB3d10pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZyBrZXk9eydpc28nK3JofT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cG9seWxpbmUgcG9pbnRzPXtzYWZlUHRzKHB0cyl9IGZpbGw9XCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPXtyaCA9PT0gMTAwID8gJyM2MzY2ZjEnIDogJyNlYzQ4OTk1NSd9IHN0cm9rZVdpZHRoPVwiMC44XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlRGFzaGFycmF5PXtyaCA9PT0gMTAwID8gJycgOiAnMywzJ30vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtwdHMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3gocHRzW01hdGguZmxvb3IocHRzLmxlbmd0aCowLjY1KV1bMF0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5PXt5KHB0c1tNYXRoLmZsb29yKHB0cy5sZW5ndGgqMC42NSldWzFdKSAtIDR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplPVwiOVwiIGZpbGw9XCIjZWM0ODk5OTlcIiBmb250V2VpZ2h0PVwiNzAwXCI+e3JofSU8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cblxuICAgICAgICAgICAgICAgIHsvKiAtLS0tIEdpdm9uaSBvdmVybGF5IChjb3BpZWQgdmVyYmF0aW0gZnJvbSBhcHAuanMgcmVuZGVyIG9yZGVyKSAtLS0tICovfVxuICAgICAgICAgICAgICAgIHtjZmcuZ2l2b25pICYmIChcbiAgICAgICAgICAgICAgICAgICAgPGcgY2xhc3NOYW1lPVwicG9pbnRlci1ldmVudHMtbm9uZVwiIG9wYWNpdHk9XCIwLjlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXt4KDQwKX0geTE9e3koMTYvMTAwMCl9IHgyPXt4KDUwKX0geTI9e3koMTYvMTAwMCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCIjNjM2NmYxXCIgc3Ryb2tlV2lkdGg9XCIxLjVcIiBzdHJva2VEYXNoYXJyYXk9XCI0LDRcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17eCg1MCl9IHkxPXt5KDE2LzEwMDApfSB4Mj17eCg1MCl9IHkyPXt5KDApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiIzYzNjZmMVwiIHN0cm9rZVdpZHRoPVwiMS41XCIgc3Ryb2tlRGFzaGFycmF5PVwiNCw0XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3goNDEpfSB5MT17eSgwKX0geDI9e3goNTApfSB5Mj17eSgwKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cIiM2MzY2ZjFcIiBzdHJva2VXaWR0aD1cIjEuNVwiIHN0cm9rZURhc2hhcnJheT1cIjQsNFwiLz5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKE1DVil9ICBmaWxsPVwiI2VjNDg5OVwiIGZpbGxPcGFjaXR5PVwiMC4wNVwiIHN0cm9rZT1cIiNlYzQ4OTlcIiBzdHJva2VXaWR0aD1cIjFcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoTWFzcyl9IGZpbGw9XCIjOGI1Y2Y2XCIgZmlsbE9wYWNpdHk9XCIwLjA1XCIgc3Ryb2tlPVwiIzhiNWNmNlwiIHN0cm9rZVdpZHRoPVwiMVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhFVkFQKX0gZmlsbD1cIiMwNmI2ZDRcIiBmaWxsT3BhY2l0eT1cIjAuMDhcIiBzdHJva2U9XCIjMDZiNmQ0XCIgc3Ryb2tlV2lkdGg9XCIxXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKE5WKX0gICBmaWxsPVwiI2Y1OWUwYlwiIGZpbGxPcGFjaXR5PVwiMC4wNVwiIHN0cm9rZT1cIiNmNTllMGJcIiBzdHJva2VXaWR0aD1cIjFcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoQ1opfSAgIGZpbGw9XCIjMTBiOTgxXCIgZmlsbE9wYWNpdHk9XCIwLjE1XCIgc3Ryb2tlPVwiIzEwYjk4MVwiIHN0cm9rZVdpZHRoPVwiMS4yXCIvPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICB7LyogU3dlZXQtc3BvdCBiYW5kLCBjbGlwcGVkIHRvIENaICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgPGRlZnM+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNsaXBQYXRoIGlkPVwiY3otY2xpcC13YWxrXCIgY2xpcFBhdGhVbml0cz1cInVzZXJTcGFjZU9uVXNlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhDWil9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2NsaXBQYXRoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kZWZzPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKFNXRUVUKX0gY2xpcFBhdGg9XCJ1cmwoI2N6LWNsaXAtd2FsaylcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbD1cIiMwNTk2NjlcIiBmaWxsT3BhY2l0eT1cIjAuMzJcIiBzdHJva2U9XCIjMDQ3ODU3XCIgc3Ryb2tlV2lkdGg9XCIwLjhcIiBzdHJva2VEYXNoYXJyYXk9XCIzLDJcIi8+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhXSU5URVIpfSBmaWxsPVwiIzNiODJmNlwiIGZpbGxPcGFjaXR5PVwiMC4xNVwiIHN0cm9rZT1cIm5vbmVcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17eCgxOSl9IHkxPXtwYWQudG9wKzE4fSB4Mj17eCgxOSl9IHkyPXtwYWQudG9wK2dyaWRIfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiIzNiODJmNlwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZURhc2hhcnJheT1cIjYsNFwiIG9wYWNpdHk9XCIwLjhcIi8+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBSZWdpb24gbGFiZWxzIOKAlCBzYW1lIGNvbG9ycyAmIHNwaXJpdCBhcyBsaXZlIGNoYXJ0ICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCg1MCktMTB9IHk9e3koOC8xMDAwKX0gZmlsbD1cIiM2MzY2ZjFcIiBmb250U2l6ZT1cIjEwXCIgZm9udFdlaWdodD1cIjkwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgdHJhbnNmb3JtPXtgcm90YXRlKC05MCwgJHt4KDUwKS0xMH0sICR7eSg4LzEwMDApfSlgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZz1cIjJcIj5NRUNIQU5JQ0FMIENPT0xJTkc8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDQ0KS0yfSB5PXt5KDgvMTAwMCl9IGZpbGw9XCIjZWM0ODk5XCIgZm9udFNpemU9XCI5XCIgZm9udFdlaWdodD1cIjkwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgdHJhbnNmb3JtPXtgcm90YXRlKC05MCwgJHt4KDQ0KS0yfSwgJHt5KDgvMTAwMCl9KWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nPVwiMS41XCI+TUFTUyBDT09MSU5HPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCgzNyktMTB9IHk9e3koOC8xMDAwKX0gZmlsbD1cIiM4YjVjZjZcIiBmb250U2l6ZT1cIjlcIiBmb250V2VpZ2h0PVwiOTAwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiB0cmFuc2Zvcm09e2Byb3RhdGUoLTkwLCAke3goMzcpLTEwfSwgJHt5KDgvMTAwMCl9KWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nPVwiMS41XCI+TUFTUyBDT09MSU5HPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCgzNCl9IHk9e3koMC41LzEwMDApLTh9IGZpbGw9XCIjMDZiNmQ0XCIgZm9udFNpemU9XCI5XCIgZm9udFdlaWdodD1cIjkwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgbGV0dGVyU3BhY2luZz1cIjJcIj5FVkFQT1JBVElWRTwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goMjMuNSl9IHk9e3koX2dldFcoMjMuNSwgNDUpKX0gZmlsbD1cIiMxMGI5ODFcIiBmb250U2l6ZT1cIjExXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ9XCI5MDBcIiB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgbGV0dGVyU3BhY2luZz1cIjEuNVwiPkNPTUZPUlQ8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDE4Ljc1KX0geT17eShfZ2V0VygxOC43NSwgNDUpKX0gZmlsbD1cIiMzYjgyZjZcIiBmb250U2l6ZT1cIjExXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ9XCI5MDBcIiB0ZXh0QW5jaG9yPVwibWlkZGxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybT17YHJvdGF0ZSgtOTAsICR7eCgxOC43NSl9LCAke3koX2dldFcoMTguNzUsIDQ1KSl9KWB9PldJTlRFUjwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goMjMuNSl9IHk9e3koX2dldFcoMjMuNSwgKGNmZy5yaExvK2NmZy5yaEhpKS8yKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxsPVwiIzAyMmMyMlwiIGZvbnRTaXplPVwiOFwiIGZvbnRXZWlnaHQ9XCI5MDBcIiB0ZXh0QW5jaG9yPVwibWlkZGxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7cGFpbnRPcmRlcjonc3Ryb2tlJywgc3Ryb2tlOicjYTdmM2QwJywgc3Ryb2tlV2lkdGg6JzIuNXB4Jywgc3Ryb2tlTGluZWpvaW46J3JvdW5kJ319XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nPVwiMS41XCI+e2NmZy5yaExvfS17Y2ZnLnJoSGl9JSBSSDwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgICAgICB7LyogYXhpcyBsYWJlbHMgKi99XG4gICAgICAgICAgICAgICAgPHRleHQgeD17cGFkLmxlZnQgKyBncmlkVy8yfSB5PXtILTEyfSBmb250U2l6ZT1cIjExXCIgZmlsbD1cIiNjYmQ1ZTFcIlxuICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiBmb250V2VpZ2h0PVwiODAwXCIgbGV0dGVyU3BhY2luZz1cIjJcIj5EUlkgQlVMQiBURU1QICjCsEMpPC90ZXh0PlxuICAgICAgICAgICAgICAgIDx0ZXh0IHg9ezE2fSB5PXtwYWQudG9wICsgZ3JpZEgvMn0gZm9udFNpemU9XCIxMVwiIGZpbGw9XCIjY2JkNWUxXCJcbiAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgZm9udFdlaWdodD1cIjgwMFwiIGxldHRlclNwYWNpbmc9XCIyXCJcbiAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm09e2Byb3RhdGUoLTkwIDE2ICR7cGFkLnRvcCArIGdyaWRILzJ9KWB9PkhVTUlESVRZIFJBVElPIChnL2tnKTwvdGV4dD5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG5mdW5jdGlvbiBQc3lDb250cm9sUGFuZWwoeyBjZmcsIHVwZGF0ZSwgc2V0Q2ZnIH0pIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXNsYXRlLTkwMC82MCBib3JkZXIgYm9yZGVyLXNsYXRlLTgwMCByb3VuZGVkLTJ4bCBwLTUgc3BhY2UteS02XCI+XG4gICAgICAgICAgICB7LyogR2l2b25pIHRvZ2dsZSAqL31cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0yXCI+R2l2b25pIEVuZ2luZTwvZGl2PlxuICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gdXBkYXRlKCdnaXZvbmknLCAhY2ZnLmdpdm9uaSl9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B3LWZ1bGwgcHktMyByb3VuZGVkLXhsIHRleHQtc20gZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2NmZy5naXZvbmlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1pbmRpZ28tNjAwIHRleHQtd2hpdGUgc2hhZG93LWxnIHNoYWRvdy1pbmRpZ28tNTAwLzMwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLXNsYXRlLTgwMCB0ZXh0LXNsYXRlLTQwMCBib3JkZXIgYm9yZGVyLXNsYXRlLTcwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgIHtjZmcuZ2l2b25pID8gJ0dpdm9uaSBPTicgOiAnR2l2b25pIE9GRid9XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbXQtMiBsZWFkaW5nLXJlbGF4ZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgT3ZlcmxheXMgdGhlIDQgY2xpbWF0ZS1zdHJhdGVneSByZWdpb25zIChDb21mb3J0LCBOYXQgVmVudCwgRXZhcCwgTWVjaCBDb29sKS5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIFJIIHJhbmdlICovfVxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj5SSCBTd2VldC1TcG90IFJhbmdlPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi0zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTUwMCBtYi0xIGJsb2NrXCI+VmVudWUgcHJlc2V0PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dCBjdXJzb3ItcG9pbnRlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2NmZy5yaFByZXNldCB8fCAnY3VzdG9tJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcCA9IFJIX1BSRVNFVFMuZmluZChwID0+IHAuaWQgPT09IGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFwKSByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwLmlkID09PSAnY3VzdG9tJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlKCdyaFByZXNldCcsICdjdXN0b20nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgcmhQcmVzZXQ6cC5pZCwgcmhMbzpwLmxvLCByaEhpOnAuaGl9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtSSF9QUkVTRVRTLm1hcChwID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIGtleT17cC5pZH0gdmFsdWU9e3AuaWR9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cC5sYWJlbH17cC5sbyAhPSBudWxsID8gYCAgwrcgICR7cC5sb30tJHtwLmhpfSUgUkhgIDogJyd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgICAgIHsoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcCA9IFJIX1BSRVNFVFMuZmluZCh4ID0+IHguaWQgPT09IChjZmcucmhQcmVzZXQgfHwgJ2N1c3RvbScpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwICYmIHAubm90ZSA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0xLjUgaXRhbGljXCI+e3Aubm90ZX08L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICApIDogbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfSkoKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zIG1iLTJcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyBmb250LW1vbm8gdGV4dC1zbGF0ZS00MDAgdy0xMFwiPntjZmcucmhMb30lPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPVwiMjBcIiBtYXg9e2NmZy5yaEhpLTV9IHZhbHVlPXtjZmcucmhMb31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0Q2ZnKGMgPT4gKHsuLi5jLCByaExvOitlLnRhcmdldC52YWx1ZSwgcmhQcmVzZXQ6J2N1c3RvbSd9KSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyYW5nZS1pbnB1dCBmbGV4LTFcIi8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtM1wiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtbW9ubyB0ZXh0LXNsYXRlLTQwMCB3LTEwXCI+e2NmZy5yaEhpfSU8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49e2NmZy5yaExvKzV9IG1heD1cIjkwXCIgdmFsdWU9e2NmZy5yaEhpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIHJoSGk6K2UudGFyZ2V0LnZhbHVlLCByaFByZXNldDonY3VzdG9tJ30pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLWlucHV0IGZsZXgtMVwiLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogQXhpcyByYW5nZSAqL31cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0yXCI+VGVtcGVyYXR1cmUgQXhpcyBSYW5nZTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTMgbWItMlwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtbW9ubyB0ZXh0LXNsYXRlLTQwMCB3LTEwXCI+e2NmZy50TG99wrA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49XCItNDBcIiBtYXg9e2NmZy50SGktMTB9IHZhbHVlPXtjZmcudExvfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGUoJ3RMbycsICtlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyYW5nZS1pbnB1dCBmbGV4LTFcIi8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtM1wiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtbW9ubyB0ZXh0LXNsYXRlLTQwMCB3LTEwXCI+e2NmZy50SGl9wrA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49e2NmZy50TG8rMTB9IG1heD1cIjYwXCIgdmFsdWU9e2NmZy50SGl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZSgndEhpJywgK2UudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLWlucHV0IGZsZXgtMVwiLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0yIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgICAgICBDaGFydCB3aWxsIGJlIHJlZHJhd24gd2l0aCB0aGlzIGRyeS1idWxiIHRlbXBlcmF0dXJlIHdpbmRvdy5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib3JkZXItdCBib3JkZXItc2xhdGUtODAwIHB0LTRcIj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBsZWFkaW5nLXJlbGF4ZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgQ2hhbmdlcyBwcmV2aWV3IGxpdmUgaW4gdGhlIHNrZWxldG9uIGNoYXJ0IG9uIHRoZSBsZWZ0LiAgSGl0XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtaW5kaWdvLTQwMCBmb250LWJsYWNrXCI+IFNhdmUgJiByZXR1cm4gPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICBpbiB0aGUgaGVhZGVyIHdoZW4geW91J3JlIGhhcHB5LlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBMb2NhdGlvbiBTZXR0aW5nIC0tIG1vZGFsIHcvIGludGVyYWN0aXZlIExlYWZsZXQgbWFwICsgcmV2ZXJzZSBnZW9jb2RpbmdcbiAqIENsaWNrIGFueXdoZXJlIG9uIHRoZSBtYXAgKG9yIGRyYWcgdGhlIG1hcmtlcikgdG8gc2V0IGxhdC9sb24uXG4gKiBNYW51YWwgbGF0L2xvbiBlZGl0cyByZS1jZW50cmUgdGhlIG1hcmtlci4gIENpdHkgbmFtZSBpcyBhdXRvLXBvcHVsYXRlZFxuICogdmlhIE9wZW5TdHJlZXRNYXAgTm9taW5hdGltIChubyBrZXkgcmVxdWlyZWQsIHJhdGUtbGltaXRlZCB0byB+MSByZXEvcykuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5mdW5jdGlvbiBMb2NhdGlvbk1vZGFsKHsgY2ZnLCBzZXRDZmcsIG9uQ2xvc2UsIG9uU2F2ZSB9KSB7XG4gICAgY29uc3QgbWFwQm94UmVmID0gUmVhY3QudXNlUmVmKG51bGwpO1xuICAgIGNvbnN0IG1hcFJlZiAgICA9IFJlYWN0LnVzZVJlZihudWxsKTtcbiAgICBjb25zdCBtYXJrZXJSZWYgPSBSZWFjdC51c2VSZWYobnVsbCk7XG4gICAgY29uc3QgW2dlb0J1c3ksIHNldEdlb0J1c3ldID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuXG4gICAgLyogLS0tLS0gc2VhcmNoIHN0YXRlIC0tLS0tICovXG4gICAgY29uc3QgW3NlYXJjaFEsIHNldFNlYXJjaFFdICAgICAgICAgPSBSZWFjdC51c2VTdGF0ZSgnJyk7XG4gICAgY29uc3QgW3NlYXJjaEhpdHMsIHNldFNlYXJjaEhpdHNdICAgPSBSZWFjdC51c2VTdGF0ZShbXSk7XG4gICAgY29uc3QgW3NlYXJjaEJ1c3ksIHNldFNlYXJjaEJ1c3ldICAgPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3QgW3NlYXJjaE9wZW4sIHNldFNlYXJjaE9wZW5dICAgPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3Qgc2VhcmNoRGVib3VuY2VSZWYgICAgICAgICAgICAgPSBSZWFjdC51c2VSZWYobnVsbCk7XG5cbiAgICAvKiBGb3J3YXJkLWdlb2NvZGU6IHF1ZXJ5IC0+IFt7bGF0LCBsb24sIGRpc3BsYXlfbmFtZSwgdHlwZSwgLi4ufV0gKi9cbiAgICBjb25zdCBydW5TZWFyY2ggPSBhc3luYyAocSkgPT4ge1xuICAgICAgICBpZiAoIXEgfHwgcS50cmltKCkubGVuZ3RoIDwgMykgeyBzZXRTZWFyY2hIaXRzKFtdKTsgcmV0dXJuOyB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzZXRTZWFyY2hCdXN5KHRydWUpO1xuICAgICAgICAgICAgY29uc3QgdXJsID0gYGh0dHBzOi8vbm9taW5hdGltLm9wZW5zdHJlZXRtYXAub3JnL3NlYXJjaD9mb3JtYXQ9anNvbiZsaW1pdD02JnE9JHtlbmNvZGVVUklDb21wb25lbnQocSl9YDtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCh1cmwsIHsgaGVhZGVyczp7ICdBY2NlcHQnOidhcHBsaWNhdGlvbi9qc29uJyB9IH0pO1xuICAgICAgICAgICAgY29uc3QgaiA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgICAgICAgc2V0U2VhcmNoSGl0cyhBcnJheS5pc0FycmF5KGopID8gaiA6IFtdKTtcbiAgICAgICAgICAgIHNldFNlYXJjaE9wZW4odHJ1ZSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgc2V0U2VhcmNoSGl0cyhbXSk7IH1cbiAgICAgICAgZmluYWxseSB7IHNldFNlYXJjaEJ1c3koZmFsc2UpOyB9XG4gICAgfTtcblxuICAgIC8qIGRlYm91bmNlZCBzZWFyY2gtb24tdHlwZSAqL1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmIChzZWFyY2hEZWJvdW5jZVJlZi5jdXJyZW50KSBjbGVhclRpbWVvdXQoc2VhcmNoRGVib3VuY2VSZWYuY3VycmVudCk7XG4gICAgICAgIHNlYXJjaERlYm91bmNlUmVmLmN1cnJlbnQgPSBzZXRUaW1lb3V0KCgpID0+IHJ1blNlYXJjaChzZWFyY2hRKSwgNDAwKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHNlYXJjaERlYm91bmNlUmVmLmN1cnJlbnQgJiYgY2xlYXJUaW1lb3V0KHNlYXJjaERlYm91bmNlUmVmLmN1cnJlbnQpO1xuICAgIH0sIFtzZWFyY2hRXSk7XG5cbiAgICBjb25zdCBwaWNrU2VhcmNoSGl0ID0gKGhpdCkgPT4ge1xuICAgICAgICBjb25zdCBsYXQgPSBNYXRoLnJvdW5kKCtoaXQubGF0ICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgIGNvbnN0IGxvbiA9IE1hdGgucm91bmQoK2hpdC5sb24gKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBsYXQsIGxvbiwgY2l0eTpoaXQuZGlzcGxheV9uYW1lfSkpO1xuICAgICAgICBpZiAobWFwUmVmLmN1cnJlbnQpIG1hcFJlZi5jdXJyZW50LnNldFZpZXcoW2xhdCwgbG9uXSwgaGl0LnR5cGUgPT09ICdjaXR5JyA/IDExIDogMTUpO1xuICAgICAgICBzZXRTZWFyY2hPcGVuKGZhbHNlKTtcbiAgICAgICAgc2V0U2VhcmNoUSgnJyk7XG4gICAgfTtcblxuICAgIC8qIFJldmVyc2UtZ2VvY29kZSBsYXQvbG9uIC0+IGNpdHkgLyBjb3VudHJ5IHZpYSBOb21pbmF0aW0uICBObyBBUEkga2V5LiAqL1xuICAgIGNvbnN0IHJldmVyc2VHZW9jb2RlID0gYXN5bmMgKGxhdCwgbG9uKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzZXRHZW9CdXN5KHRydWUpO1xuICAgICAgICAgICAgY29uc3QgdXJsID0gYGh0dHBzOi8vbm9taW5hdGltLm9wZW5zdHJlZXRtYXAub3JnL3JldmVyc2U/Zm9ybWF0PWpzb24mbGF0PSR7bGF0fSZsb249JHtsb259Jnpvb209MTBgO1xuICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwgeyBoZWFkZXJzOiB7ICdBY2NlcHQnOidhcHBsaWNhdGlvbi9qc29uJyB9IH0pO1xuICAgICAgICAgICAgY29uc3QgaiA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgICAgICAgY29uc3QgYSA9IGouYWRkcmVzcyB8fCB7fTtcbiAgICAgICAgICAgIGNvbnN0IGNpdHkgPSBhLmNpdHkgfHwgYS50b3duIHx8IGEudmlsbGFnZSB8fCBhLmhhbWxldCB8fCBhLmNvdW50eSB8fCAnJztcbiAgICAgICAgICAgIGNvbnN0IHJlZ2lvbiA9IGEuc3RhdGUgfHwgYS5yZWdpb24gfHwgJyc7XG4gICAgICAgICAgICBjb25zdCBjb3VudHJ5ID0gYS5jb3VudHJ5IHx8ICcnO1xuICAgICAgICAgICAgY29uc3QgbGFiZWwgPSBbY2l0eSwgcmVnaW9uLCBjb3VudHJ5XS5maWx0ZXIoQm9vbGVhbikuam9pbignLCAnKSB8fCBqLmRpc3BsYXlfbmFtZSB8fCAnJztcbiAgICAgICAgICAgIGlmIChsYWJlbCkgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBjaXR5OmxhYmVsfSkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IC8qIG9mZmxpbmUgb3IgcmF0ZS1saW1pdGVkIC0+IGtlZXAgcHJpb3IgbmFtZSAqLyB9XG4gICAgICAgIGZpbmFsbHkgeyBzZXRHZW9CdXN5KGZhbHNlKTsgfVxuICAgIH07XG5cbiAgICAvKiBJbml0IExlYWZsZXQgb24gZmlyc3QgcmVuZGVyIG9mIHRoZSBtb2RhbCAqL1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmICghbWFwQm94UmVmLmN1cnJlbnQgfHwgbWFwUmVmLmN1cnJlbnQpIHJldHVybjtcbiAgICAgICAgY29uc3QgbWFwID0gTC5tYXAobWFwQm94UmVmLmN1cnJlbnQsIHsgem9vbUNvbnRyb2w6IHRydWUsIGF0dHJpYnV0aW9uQ29udHJvbDogdHJ1ZSB9KVxuICAgICAgICAgICAgICAgICAgICAgLnNldFZpZXcoW2NmZy5sYXQsIGNmZy5sb25dLCA2KTtcbiAgICAgICAgTC50aWxlTGF5ZXIoJ2h0dHBzOi8ve3N9LnRpbGUub3BlbnN0cmVldG1hcC5vcmcve3p9L3t4fS97eX0ucG5nJywge1xuICAgICAgICAgICAgbWF4Wm9vbTogMTgsXG4gICAgICAgICAgICBhdHRyaWJ1dGlvbjogJyZjb3B5OyBPcGVuU3RyZWV0TWFwIGNvbnRyaWJ1dG9ycycsXG4gICAgICAgIH0pLmFkZFRvKG1hcCk7XG5cbiAgICAgICAgY29uc3QgbWFya2VyID0gTC5tYXJrZXIoW2NmZy5sYXQsIGNmZy5sb25dLCB7IGRyYWdnYWJsZTogdHJ1ZSB9KS5hZGRUbyhtYXApO1xuICAgICAgICBtYXJrZXIuYmluZFRvb2x0aXAoJ0RyYWcgbWUgb3IgY2xpY2sgYW55d2hlcmUgb24gdGhlIG1hcCcsIHsgcGVybWFuZW50OiBmYWxzZSB9KTtcblxuICAgICAgICBjb25zdCBhcHBseUxhdExvbiA9IChsYXQsIGxvbikgPT4ge1xuICAgICAgICAgICAgY29uc3QgciA9IChuKSA9PiBNYXRoLnJvdW5kKG4gKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgbGF0OnIobGF0KSwgbG9uOnIobG9uKX0pKTtcbiAgICAgICAgICAgIHJldmVyc2VHZW9jb2RlKHIobGF0KSwgcihsb24pKTtcbiAgICAgICAgfTtcbiAgICAgICAgbWFya2VyLm9uKCdkcmFnZW5kJywgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGwgPSBtYXJrZXIuZ2V0TGF0TG5nKCk7XG4gICAgICAgICAgICBhcHBseUxhdExvbihsbC5sYXQsIGxsLmxuZyk7XG4gICAgICAgIH0pO1xuICAgICAgICBtYXAub24oJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgIG1hcmtlci5zZXRMYXRMbmcoZS5sYXRsbmcpO1xuICAgICAgICAgICAgYXBwbHlMYXRMb24oZS5sYXRsbmcubGF0LCBlLmxhdGxuZy5sbmcpO1xuICAgICAgICB9KTtcblxuICAgICAgICBtYXBSZWYuY3VycmVudCA9IG1hcDtcbiAgICAgICAgbWFya2VyUmVmLmN1cnJlbnQgPSBtYXJrZXI7XG5cbiAgICAgICAgLyogTGVhZmxldCByZW5kZXJzIGJsYW5rIGlmIGl0IGJvb3RzIGluc2lkZSBhIGhpZGRlbiBlbGVtZW50IOKAlCBraWNrIGl0XG4gICAgICAgICAgIG9uY2UgdGhlIG1vZGFsIGFuaW1hdGlvbiBzZXR0bGVzLiAqL1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IG1hcC5pbnZhbGlkYXRlU2l6ZSgpLCAyNTApO1xuICAgICAgICByZXR1cm4gKCkgPT4geyBtYXAucmVtb3ZlKCk7IG1hcFJlZi5jdXJyZW50ID0gbnVsbDsgbWFya2VyUmVmLmN1cnJlbnQgPSBudWxsOyB9O1xuICAgIH0sIFtdKTtcblxuICAgIC8qIEtlZXAgbWFya2VyIGluIHN5bmMgd2hlbiB1c2VyIGVkaXRzIGxhdC9sb24gZmllbGRzIG1hbnVhbGx5ICovXG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKG1hcFJlZi5jdXJyZW50ICYmIG1hcmtlclJlZi5jdXJyZW50KSB7XG4gICAgICAgICAgICBtYXJrZXJSZWYuY3VycmVudC5zZXRMYXRMbmcoW2NmZy5sYXQsIGNmZy5sb25dKTtcbiAgICAgICAgICAgIG1hcFJlZi5jdXJyZW50LnBhblRvKFtjZmcubGF0LCBjZmcubG9uXSk7XG4gICAgICAgIH1cbiAgICB9LCBbY2ZnLmxhdCwgY2ZnLmxvbl0pO1xuXG4gICAgY29uc3QgdXNlTXlMb2NhdGlvbiA9ICgpID0+IHtcbiAgICAgICAgaWYgKCFuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pIHJldHVybjtcbiAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihcbiAgICAgICAgICAgIChwb3MpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBsYXQgPSBNYXRoLnJvdW5kKHBvcy5jb29yZHMubGF0aXR1ZGUgICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgICAgICAgICAgY29uc3QgbG9uID0gTWF0aC5yb3VuZChwb3MuY29vcmRzLmxvbmdpdHVkZSAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgbGF0LCBsb259KSk7XG4gICAgICAgICAgICAgICAgaWYgKG1hcFJlZi5jdXJyZW50KSBtYXBSZWYuY3VycmVudC5zZXRWaWV3KFtsYXQsIGxvbl0sIDExKTtcbiAgICAgICAgICAgICAgICByZXZlcnNlR2VvY29kZShsYXQsIGxvbik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKGVycikgPT4geyAvKiB1c2VyIGRlbmllZCBvciB1bmF2YWlsYWJsZSAtPiBuby1vcCAqLyB9XG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIC8qIFdoZW4gdXNlciBjbGlja3MgXCJTYXZlICYgcmV0dXJuXCIsIFBPU1QgdGhlIHNlbGVjdGlvbiB0byB0aGUgc2FtZVxuICAgICAqIC9hcGkvd2VhdGhlci1sb2NhdGlvbiBlbmRwb2ludCB0aGUgZGFzaGJvYXJkIHJlYWRzLiAgU2V0dGluZyBCT1RIXG4gICAgICogYGFjdGl2ZWAgYW5kIGBkZWZhdWx0YCBtZWFucyB0aGUgd2VhdGhlciBzdHJpcCBvbiB0aGUgZGFzaGJvYXJkXG4gICAgICogbG9hZHMgdGhpcyBsb2NhdGlvbiBpbW1lZGlhdGVseSBvbiBuZXh0IHBhZ2UgbG9hZCAoYW5kIHN0YXlzIHBpbm5lZFxuICAgICAqIGZvciBhbnkgZnV0dXJlIGZyZXNoIHNlc3Npb25zKS4gIEFub255bW91cyB1c2VycyBnZXQgYSBzb2Z0IHdhcm5pbmdcbiAgICAgKiBiYWNrIGZyb20gdGhlIHNlcnZlciAtLSB3ZSBzdGlsbCBjYWxsIG9uU2F2ZSgpIGVpdGhlciB3YXkuICovXG4gICAgY29uc3QgcGVyc2lzdEFuZFNhdmUgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGxvYyA9IHsgbGF0OiBjZmcubGF0LCBsb246IGNmZy5sb24sIG5hbWU6IGNmZy5zaXRlTmFtZSB8fCBjZmcuY2l0eSB9O1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKCcvYXBpL3dlYXRoZXItbG9jYXRpb24nLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzonYXBwbGljYXRpb24vanNvbicgfSxcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGFjdGl2ZTogbG9jLCBkZWZhdWx0OiBsb2MgfSksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IGogPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgICAgIHdpbmRvdy5fbGFzdFdlYXRoZXJMb2NhdGlvblNhdmUgPSBqO1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdbc2V0dXAgd2Fsa10gL2FwaS93ZWF0aGVyLWxvY2F0aW9uIDwtJywgaik7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignW3NldHVwIHdhbGtdIGNvdWxkIG5vdCBwZXJzaXN0IGxvY2F0aW9uOicsIGUpO1xuICAgICAgICB9XG4gICAgICAgIG9uU2F2ZSgpO1xuICAgIH07XG5cblxuICAgIHJldHVybiAoXG4gICAgICAgIDxNb2RhbFNoZWxsIHRpdGxlPVwiTG9jYXRpb24gU2V0dGluZ1wiIHN1YnRpdGxlPVwiQ2xpY2sgdGhlIG1hcCwgZHJhZyB0aGUgcGluLCBvciB1c2UgeW91ciBkZXZpY2VcIiBhY2NlbnQ9XCJhbWJlclwiIG9uQ2xvc2U9e29uQ2xvc2V9IG9uU2F2ZT17cGVyc2lzdEFuZFNhdmV9IHNpemU9XCJtYXhcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBsZzpncmlkLWNvbHMtWzFmcl8zNDBweF0gZ2FwLTQgaC1mdWxsXCIgc3R5bGU9e3ttaW5IZWlnaHQ6JzcwdmgnfX0+XG4gICAgICAgICAgICAgICAgey8qIE1BUCDigJQgZmlsbHMgdGhlIGxlZnQgc2lkZSwgd2l0aCBhIHNlYXJjaCBiYXIgZmxvYXRpbmcgb24gdG9wICovfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiByZWY9e21hcEJveFJlZn1cbiAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBoZWlnaHQ6JzEwMCUnLCBtaW5IZWlnaHQ6JzcwdmgnLCB3aWR0aDonMTAwJScsIGJvcmRlclJhZGl1czonMTJweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6J2hpZGRlbicsIGJvcmRlcjonMXB4IHNvbGlkICMzMzQxNTUnLCBiYWNrZ3JvdW5kOicjMGIxMjIwJyB9fS8+XG5cbiAgICAgICAgICAgICAgICAgICAgey8qIFNlYXJjaCBiYXIgb3ZlcmxheSDigJQgc2l0cyBpbiB0aGUgdG9wLWNlbnRyZSBvZiB0aGUgbWFwICovfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC0zIGxlZnQtMS8yIC10cmFuc2xhdGUteC0xLzIgei1bNTAwXVwiIHN0eWxlPXt7d2lkdGg6J21pbig1NjBweCwgY2FsYygxMDAlIC0gMTEwcHgpKSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17c2VhcmNoUX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRTZWFyY2hRKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Gb2N1cz17KCkgPT4gc2VhcmNoSGl0cy5sZW5ndGggJiYgc2V0U2VhcmNoT3Blbih0cnVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCLwn5SOICBTZWFyY2ggYnkgYWRkcmVzcywgYnVpbGRpbmcsIG9yIHBsYWNlIG5hbWXigKZcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgcHgtNCBweS0yLjUgcm91bmRlZC14bCBiZy1zbGF0ZS05MDAvOTUgYm9yZGVyIGJvcmRlci1zbGF0ZS02MDAgdGV4dC1zbGF0ZS0xMDAgdGV4dC1zbSBwbGFjZWhvbGRlci1zbGF0ZS01MDAgc2hhZG93LTJ4bCBiYWNrZHJvcC1ibHVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tvdXRsaW5lOidub25lJ319Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VhcmNoQnVzeSAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImFic29sdXRlIHJpZ2h0LTMgdG9wLTEvMiAtdHJhbnNsYXRlLXktMS8yIHRleHQtYW1iZXItNDAwIHRleHQteHNcIj7igKY8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VhcmNoT3BlbiAmJiBzZWFyY2hIaXRzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC1mdWxsIGxlZnQtMCByaWdodC0wIG10LTEgYmctc2xhdGUtOTAwLzk3IGJvcmRlciBib3JkZXItc2xhdGUtNzAwIHJvdW5kZWQteGwgc2hhZG93LTJ4bCBvdmVyZmxvdy1oaWRkZW4gbWF4LWgtNzIgb3ZlcmZsb3cteS1hdXRvIGJhY2tkcm9wLWJsdXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWFyY2hIaXRzLm1hcCgoaCwgaSkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PXtoLnBsYWNlX2lkIHx8IGl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBwaWNrU2VhcmNoSGl0KGgpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHRleHQtbGVmdCBweC00IHB5LTIuNSBob3ZlcjpiZy1hbWJlci05MDAvMzAgYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTgwMCBsYXN0OmJvcmRlci1iLTAgdHJhbnNpdGlvbi1hbGxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIHRleHQtc2xhdGUtMjAwIHRydW5jYXRlXCI+e2guZGlzcGxheV9uYW1lfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgbXQtMC41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7aC50eXBlIHx8IGguY2xhc3N9IMK3IHsoK2gubGF0KS50b0ZpeGVkKDMpfSwgeygraC5sb24pLnRvRml4ZWQoMyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlYXJjaE9wZW4gJiYgc2VhcmNoSGl0cy5sZW5ndGggPT09IDAgJiYgc2VhcmNoUS5sZW5ndGggPj0gMyAmJiAhc2VhcmNoQnVzeSAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgdG9wLWZ1bGwgbGVmdC0wIHJpZ2h0LTAgbXQtMSBiZy1zbGF0ZS05MDAvOTcgYm9yZGVyIGJvcmRlci1zbGF0ZS03MDAgcm91bmRlZC14bCBweC00IHB5LTMgdGV4dC14cyB0ZXh0LXNsYXRlLTQwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTm8gcmVzdWx0cyBmb3IgXCJ7c2VhcmNoUX1cIi4gIFRyeSBhIG1vcmUgc3BlY2lmaWMgdGVybS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgIHsvKiBTSURFIFBBTkVMICovfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS00IG92ZXJmbG93LXktYXV0byBwci0xXCI+XG4gICAgICAgICAgICAgICAgICAgIHsvKiBVc2VyLWZyaWVuZGx5IHNpdGUgbmFtZSAodGhlIG9uZSB0aGUgb3BlcmF0b3IgdXNlcyB0byBpZGVudGlmeSB0aGlzIGxvY2F0aW9uKSAqL31cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMS41XCI+U2l0ZSBuYW1lIChzYXZlZCk8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiIHZhbHVlPXtjZmcuc2l0ZU5hbWUgfHwgJyd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJlLmcuIEhRIFRvd2VyLCBOb3J0aCBXaW5nLCBQYXZpbGlvbiBC4oCmXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldENmZyh7Li4uY2ZnLCBzaXRlTmFtZTplLnRhcmdldC52YWx1ZX0pfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0xIGl0YWxpY1wiPllvdXIgbGFiZWwgZm9yIHRoaXMgcGxhY2Ug4oCUIHNob3duIG9uIHRoZSBkYXNoYm9hcmQgaGVhZGVyLjwvcD5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib3JkZXItdCBib3JkZXItc2xhdGUtODAwIHB0LTNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMS41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVzb2x2ZWQgYWRkcmVzcyAvIGNpdHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Z2VvQnVzeSAmJiA8c3BhbiBjbGFzc05hbWU9XCJtbC0yIHRleHQtYW1iZXItNDAwIG5vcm1hbC1jYXNlIHRyYWNraW5nLW5vcm1hbFwiPuKApiByZXNvbHZpbmc8L3NwYW4+fVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIiB2YWx1ZT17Y2ZnLmNpdHl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKT0+c2V0Q2ZnKHsuLi5jZmcsIGNpdHk6ZS50YXJnZXQudmFsdWV9KX0vPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC0zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMS41XCI+TGF0aXR1ZGU8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIiB0eXBlPVwibnVtYmVyXCIgc3RlcD1cIjAuMDAwMVwiIHZhbHVlPXtjZmcubGF0fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpPT5zZXRDZmcoey4uLmNmZywgbGF0OitlLnRhcmdldC52YWx1ZX0pfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0xLjVcIj5Mb25naXR1ZGU8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIiB0eXBlPVwibnVtYmVyXCIgc3RlcD1cIjAuMDAwMVwiIHZhbHVlPXtjZmcubG9ufVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpPT5zZXRDZmcoey4uLmNmZywgbG9uOitlLnRhcmdldC52YWx1ZX0pfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXt1c2VNeUxvY2F0aW9ufVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBweS0yLjUgcm91bmRlZC1sZyBiZy1hbWJlci03MDAvNzAgYm9yZGVyIGJvcmRlci1hbWJlci01MDAvNDAgdGV4dC14cyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgdGV4dC1hbWJlci01MCBob3ZlcjpiZy1hbWJlci02MDAvNzBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIPCfk40gIFVzZSBteSBkZXZpY2UgbG9jYXRpb25cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib3JkZXItdCBib3JkZXItc2xhdGUtODAwIHB0LTMgbXQtMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0yXCI+UXVpY2sganVtcHM8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtMS41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidUb3JvbnRvLCBPTicsICAgbGF0OjQzLjY1MzIsIGxvbjotNzkuMzgzMiwgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J05ldyBZb3JrLCBOWScsICBsYXQ6NDAuNzEyOCwgbG9uOi03NC4wMDYwLCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonTG9uZG9uLCBVSycsICAgIGxhdDo1MS41MDc0LCBsb246IC0wLjEyNzgsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidQYXJpcywgRlInLCAgICAgbGF0OjQ4Ljg1NjYsIGxvbjogIDIuMzUyMiwgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J1Rva3lvLCBKUCcsICAgICBsYXQ6MzUuNjc2MiwgbG9uOjEzOS42NTAzLCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonU3lkbmV5LCBBVScsICAgIGxhdDotMzMuODY4OCxsb246MTUxLjIwOTMsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLm1hcChqID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e2oubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgbGF0OmoubGF0LCBsb246ai5sb24sIGNpdHk6ai5uYW1lfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFwUmVmLmN1cnJlbnQpIG1hcFJlZi5jdXJyZW50LnNldFZpZXcoW2oubGF0LCBqLmxvbl0sIGoueik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LWxlZnQgcHgtMi41IHB5LTEuNSByb3VuZGVkLW1kIGJnLXNsYXRlLTgwMC83MCBib3JkZXIgYm9yZGVyLXNsYXRlLTcwMCB0ZXh0LVsxMXB4XSBmb250LWJvbGQgdGV4dC1zbGF0ZS0zMDAgaG92ZXI6Ymctc2xhdGUtNzAwIGhvdmVyOmJvcmRlci1hbWJlci01MDAvNDAgdHJhbnNpdGlvbi1hbGxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtqLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgVGlsZXM6IE9wZW5TdHJlZXRNYXAgwrcgR2VvY29kZTogTm9taW5hdGltIChmcmVlLCB+MSByZXEvcykuXG4gICAgICAgICAgICAgICAgICAgICAgICBVc2VkIGZvciBPcGVuLU1ldGVvIHdlYXRoZXIgZmVlZCBhbmQgc3VucmlzZS9zdW5zZXQgZXN0aW1hdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvTW9kYWxTaGVsbD5cbiAgICApO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBMYW5ndWFnZSBTZXR0aW5nIC0tIG1vZGFsXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5mdW5jdGlvbiBMYW5ndWFnZU1vZGFsKHsgY2ZnLCBzZXRDZmcsIG9uQ2xvc2UsIG9uU2F2ZSB9KSB7XG4gICAgY29uc3QgbGFuZ3MgPSBbXG4gICAgICAgIHsgY29kZTonZW4nLCBsYWJlbDonRW5nbGlzaCcsICAgIG5hdGl2ZTonRW5nbGlzaCcgIH0sXG4gICAgICAgIHsgY29kZTonZnInLCBsYWJlbDonRnJlbmNoJywgICAgIG5hdGl2ZTonRnJhbsOnYWlzJyB9LFxuICAgICAgICB7IGNvZGU6J2VzJywgbGFiZWw6J1NwYW5pc2gnLCAgICBuYXRpdmU6J0VzcGHDsW9sJyAgfSxcbiAgICAgICAgeyBjb2RlOid6aCcsIGxhYmVsOidDaGluZXNlJywgICAgbmF0aXZlOifkuK3mlocnICAgICAgfSxcbiAgICAgICAgeyBjb2RlOidqYScsIGxhYmVsOidKYXBhbmVzZScsICAgbmF0aXZlOifml6XmnKzoqp4nICAgIH0sXG4gICAgICAgIHsgY29kZTonZGUnLCBsYWJlbDonR2VybWFuJywgICAgIG5hdGl2ZTonRGV1dHNjaCcgIH0sXG4gICAgXTtcbiAgICByZXR1cm4gKFxuICAgICAgICA8TW9kYWxTaGVsbCB0aXRsZT1cIkxhbmd1YWdlIFNldHRpbmdcIiBzdWJ0aXRsZT1cIlBpY2sgeW91ciBkZWZhdWx0IGludGVyZmFjZSBsYW5ndWFnZVwiIGFjY2VudD1cImVtZXJhbGRcIiBvbkNsb3NlPXtvbkNsb3NlfSBvblNhdmU9e29uU2F2ZX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTNcIj5cbiAgICAgICAgICAgICAgICB7bGFuZ3MubWFwKGwgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGtleT17bC5jb2RlfSBvbkNsaWNrPXsoKT0+c2V0Q2ZnKHsuLi5jZmcsIGxhbmc6bC5jb2RlfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdGV4dC1sZWZ0IHAtMyByb3VuZGVkLXhsIGJvcmRlci0yIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Y2ZnLmxhbmcgPT09IGwuY29kZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYm9yZGVyLWVtZXJhbGQtNTAwIGJnLWVtZXJhbGQtOTAwLzIwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYm9yZGVyLXNsYXRlLTcwMCBiZy1zbGF0ZS04MDAvNDAgaG92ZXI6Ymctc2xhdGUtODAwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIHRleHQtc2xhdGUtNTAwXCI+e2wuY29kZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LWJsYWNrIHRleHQtc2xhdGUtMjAwXCI+e2wubmF0aXZlfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMXB4XSB0ZXh0LXNsYXRlLTUwMFwiPntsLmxhYmVsfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L01vZGFsU2hlbGw+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogUGx1Zy1pbiBTZXR0aW5nIC0tIG1vZGFsIHcvIGxpc3QgKyB1cGxvYWQgem9uZVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLyogUGVyLXBsdWctaW4gbW9jayBjb25maWd1cmF0aW9uIGZpZWxkcy4gIEtleXMgbWFwIHRvIHBsdWctaW4gYGlkYC4gKi9cbmNvbnN0IFBMVUdJTl9DT05GSUdfRklFTERTID0ge1xuICAgIHdlYXRoZXI6ICAgIFtcbiAgICAgICAgeyBrZXk6J3Byb3ZpZGVyJywgIGxhYmVsOidQcm92aWRlcicsICAgICAgICAgIHR5cGU6J3NlbGVjdCcsICBvcHRpb25zOlsnT3Blbi1NZXRlbycsJ05XUycsJ0VDTVdGJ10sIGRlZjonT3Blbi1NZXRlbycgfSxcbiAgICAgICAgeyBrZXk6J3JlZnJlc2gnLCAgIGxhYmVsOidSZWZyZXNoIGludGVydmFsJywgIHR5cGU6J3NlbGVjdCcsICBvcHRpb25zOlsnMSBtaW4nLCc1IG1pbicsJzE1IG1pbicsJzMwIG1pbicsJzEgaCddLCBkZWY6JzE1IG1pbicgfSxcbiAgICAgICAgeyBrZXk6J2NhY2hlJywgICAgIGxhYmVsOidDYWNoZSBUVEwgKG1pbiknLCAgIHR5cGU6J251bWJlcicsICBkZWY6MzAgfSxcbiAgICBdLFxuICAgIGdpdm9uaTogICAgIFtcbiAgICAgICAgeyBrZXk6J2NsaW1hdGUnLCAgIGxhYmVsOidDbGltYXRlIG1vZGVsJywgICAgIHR5cGU6J3NlbGVjdCcsICBvcHRpb25zOlsnR2l2b25pIDE5OTInLCdBU0hSQUUgNTUnLCdBZGFwdGl2ZSddLCBkZWY6J0dpdm9uaSAxOTkyJyB9LFxuICAgICAgICB7IGtleTonbWFzc2l2ZScsICAgbGFiZWw6J0hlYXZ5d2VpZ2h0IGNvbnN0cnVjdGlvbicsICB0eXBlOid0b2dnbGUnLCBkZWY6ZmFsc2UgfSxcbiAgICBdLFxuICAgIHN3ZWV0X3Nwb3Q6IFtcbiAgICAgICAgeyBrZXk6J3RyYWNraW5nJywgIGxhYmVsOidUcmFjayBvdXRkb29yIFJIJywgIHR5cGU6J3RvZ2dsZScsIGRlZjp0cnVlIH0sXG4gICAgICAgIHsga2V5OidoeXN0JywgICAgICBsYWJlbDonSHlzdGVyZXNpcyAoJSBSSCknLCB0eXBlOidudW1iZXInLCBkZWY6MiB9LFxuICAgIF0sXG4gICAgZzM2OiAgICAgICAgW1xuICAgICAgICB7IGtleTonbW9kZScsICAgICAgbGFiZWw6J1NlcXVlbmNlIG1vZGUnLCAgICAgdHlwZTonc2VsZWN0JywgIG9wdGlvbnM6WydTaW5nbGUtem9uZSBWQVYnLCdNdWx0aS16b25lIFZBVicsJ0RPQVMgdy8gRkNVJ10sIGRlZjonTXVsdGktem9uZSBWQVYnIH0sXG4gICAgICAgIHsga2V5Oid2ZXJib3NlJywgICBsYWJlbDonVmVyYm9zZSBsb2dnaW5nJywgICB0eXBlOid0b2dnbGUnLCBkZWY6ZmFsc2UgfSxcbiAgICBdLFxuICAgIGRpYnQ6ICAgICAgIFtcbiAgICAgICAgeyBrZXk6J2hvc3QnLCAgICAgIGxhYmVsOidCcmlkZ2UgaG9zdCcsICAgICAgIHR5cGU6J3RleHQnLCAgIGRlZjonMTkyLjE2OC4xLjEwMCcgfSxcbiAgICAgICAgeyBrZXk6J3BvcnQnLCAgICAgIGxhYmVsOidUZWxlZ3JhbSBwb3J0JywgICAgIHR5cGU6J251bWJlcicsIGRlZjo0NzgwOCB9LFxuICAgICAgICB7IGtleToncG9sbF9tcycsICAgbGFiZWw6J1BvbGwgaW50ZXJ2YWwgKG1zKScsdHlwZTonbnVtYmVyJywgZGVmOjIwMDAgfSxcbiAgICBdLFxuICAgIGxpZ2h0aW5nOiAgIFtcbiAgICAgICAgeyBrZXk6J2dhdGV3YXknLCAgIGxhYmVsOidNb2RidXMgZ2F0ZXdheSBJUCcsIHR5cGU6J3RleHQnLCAgIGRlZjonMTAuMC4wLjUwJyB9LFxuICAgICAgICB7IGtleTondW5pdF9pZCcsICAgbGFiZWw6J1VuaXQgSUQnLCAgICAgICAgICAgdHlwZTonbnVtYmVyJywgZGVmOjEgfSxcbiAgICAgICAgeyBrZXk6J3RjcF9wb3J0JywgIGxhYmVsOidUQ1AgcG9ydCcsICAgICAgICAgIHR5cGU6J251bWJlcicsIGRlZjo1MDIgfSxcbiAgICBdLFxufTtcblxuZnVuY3Rpb24gUGx1Z2luc01vZGFsKHsgY2ZnLCBzZXRDZmcsIG9uQ2xvc2UsIG9uU2F2ZSB9KSB7XG4gICAgY29uc3QgQUxMID0gW1xuICAgICAgICB7IGlkOid3ZWF0aGVyJywgICAgIG5hbWU6J1dlYXRoZXInLCAgICAgICAgIGRlc2M6J09wZW4tTWV0ZW8gT0EgZmVlZCcsICAgICAgICAgIHZlcjonMi4xLjAnIH0sXG4gICAgICAgIHsgaWQ6J2dpdm9uaScsICAgICAgbmFtZTonR2l2b25pIEVuZ2luZScsICAgZGVzYzonQ2xpbWF0ZS1zdHJhdGVneSBvdmVybGF5JywgICAgdmVyOicxLjMuNCcgfSxcbiAgICAgICAgeyBpZDonc3dlZXRfc3BvdCcsICBuYW1lOidTd2VldC1TcG90IFJIJywgICBkZXNjOidBZGp1c3RhYmxlIFJIIGJhbmQnLCAgICAgICAgICB2ZXI6JzEuMC4xJyB9LFxuICAgICAgICB7IGlkOidnMzYnLCAgICAgICAgIG5hbWU6J0czNiBTZXF1ZW5jZXMnLCAgIGRlc2M6J0FTSFJBRSBHdWlkZWxpbmUgMzYnLCAgICAgICAgIHZlcjonMC45LjInIH0sXG4gICAgICAgIHsgaWQ6J2RpYnQnLCAgICAgICAgbmFtZTonRElCVCBCcmlkZ2UnLCAgICAgZGVzYzonRGVsdGEgQ29udHJvbHMgKERJQlQpIEJBQ25ldCBicmlkZ2UnLCAgICAgICAgICAgdmVyOicwLjQuMCcgfSxcbiAgICAgICAgeyBpZDonbGlnaHRpbmcnLCAgICBuYW1lOidMaWdodGluZyAoUmVkNSknLCBkZXNjOidWMy4wIE1vZGJ1cyBUQ1AgY2xpZW50JywgICAgICB2ZXI6JzAuMS4wLWJldGEnIH0sXG4gICAgXTtcbiAgICBjb25zdCB0b2dnbGUgPSAoaWQpID0+IHNldENmZyhjID0+ICh7XG4gICAgICAgIC4uLmMsXG4gICAgICAgIGVuYWJsZWQ6IGMuZW5hYmxlZC5pbmNsdWRlcyhpZCkgPyBjLmVuYWJsZWQuZmlsdGVyKHggPT4geCAhPT0gaWQpIDogWy4uLmMuZW5hYmxlZCwgaWRdXG4gICAgfSkpO1xuXG4gICAgLyogZXhwYW5zaW9uIHN0YXRlIOKAlCB3aGljaCBwbHVnLWluJ3MgXCJDb25maWd1cmVcIiBwYW5lbCBpcyBvcGVuICovXG4gICAgY29uc3QgW2V4cGFuZGVkSWQsIHNldEV4cGFuZGVkSWRdID0gUmVhY3QudXNlU3RhdGUobnVsbCk7XG5cbiAgICBjb25zdCB1cGRhdGVGaWVsZCA9IChwbHVnaW5JZCwgZmllbGRLZXksIHZhbHVlKSA9PiB7XG4gICAgICAgIHNldENmZyhjID0+ICh7XG4gICAgICAgICAgICAuLi5jLFxuICAgICAgICAgICAgZmllbGRzOiB7IC4uLihjLmZpZWxkcyB8fCB7fSksIFtwbHVnaW5JZF06IHsgLi4uKChjLmZpZWxkcyB8fCB7fSlbcGx1Z2luSWRdIHx8IHt9KSwgW2ZpZWxkS2V5XTogdmFsdWUgfSB9XG4gICAgICAgIH0pKTtcbiAgICB9O1xuXG4gICAgY29uc3QgZmllbGRWYWwgPSAocGx1Z2luSWQsIGZpZWxkKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0b3JlZCA9IGNmZy5maWVsZHMgJiYgY2ZnLmZpZWxkc1twbHVnaW5JZF0gJiYgY2ZnLmZpZWxkc1twbHVnaW5JZF1bZmllbGQua2V5XTtcbiAgICAgICAgcmV0dXJuIHN0b3JlZCAhPT0gdW5kZWZpbmVkID8gc3RvcmVkIDogZmllbGQuZGVmO1xuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8TW9kYWxTaGVsbCB0aXRsZT1cIlBsdWctaW4gU2V0dGluZ1wiIHN1YnRpdGxlPVwiRW5hYmxlLCB1cGxvYWQgb3IgbW9kaWZ5IHBsdWctaW5zXCIgYWNjZW50PVwicGlua1wiIG9uQ2xvc2U9e29uQ2xvc2V9IG9uU2F2ZT17b25TYXZlfSBzaXplPVwid2lkZVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTMgbWF4LWgtWzYwdmhdIG92ZXJmbG93LXktYXV0byBwci0xXCI+XG4gICAgICAgICAgICAgICAge0FMTC5tYXAocCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9uID0gY2ZnLmVuYWJsZWQuaW5jbHVkZXMocC5pZCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4cGFuZGVkID0gZXhwYW5kZWRJZCA9PT0gcC5pZDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmllbGRzID0gUExVR0lOX0NPTkZJR19GSUVMRFNbcC5pZF0gfHwgW107XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17cC5pZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcm91bmRlZC14bCBib3JkZXIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtvbiA/ICdib3JkZXItcGluay01MDAvNDAgYmctcGluay05MDAvMTAnIDogJ2JvcmRlci1zbGF0ZS03MDAgYmctc2xhdGUtODAwLzQwJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtleHBhbmRlZCA/ICdyaW5nLTEgcmluZy1waW5rLTUwMC8zMCcgOiAnJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBwLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LWJsYWNrIHRleHQtc2xhdGUtMTAwXCI+e3AubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtbC0yIHRleHQtWzEwcHhdIGZvbnQtbW9ubyB0ZXh0LXNsYXRlLTUwMFwiPnZ7cC52ZXJ9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS00MDBcIj57cC5kZXNjfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB0b2dnbGUocC5pZCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgcGx1Z2luLXRvZ2dsZS0ke3AuaWR9YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHgtMyBweS0xIHJvdW5kZWQtbWQgdGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIGJvcmRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtvbiA/ICdib3JkZXItcGluay01MDAvNjAgdGV4dC1waW5rLTMwMCBiZy1waW5rLTkwMC8zMCcgOiAnYm9yZGVyLXNsYXRlLTYwMCB0ZXh0LXNsYXRlLTQwMCBiZy1zbGF0ZS04MDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtvbiA/ICdFbmFibGVkJyA6ICdEaXNhYmxlZCd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gc2V0RXhwYW5kZWRJZChleHBhbmRlZCA/IG51bGwgOiBwLmlkKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BwbHVnaW4tY29uZmlnLSR7cC5pZH1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweC0zIHB5LTEgcm91bmRlZC1tZCB0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgYm9yZGVyIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2V4cGFuZGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYm9yZGVyLXBpbmstNTAwIGJnLXBpbmstOTAwLzMwIHRleHQtcGluay0yMDAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYm9yZGVyLXNsYXRlLTYwMCB0ZXh0LXNsYXRlLTQwMCBiZy1zbGF0ZS04MDAgaG92ZXI6Ymctc2xhdGUtNzAwIGhvdmVyOmJvcmRlci1waW5rLTUwMC81MCBob3Zlcjp0ZXh0LXBpbmstMzAwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZXhwYW5kZWQgPyAnQ2xvc2Ug4pa0JyA6ICdDb25maWd1cmUg4pa+J31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZXhwYW5kZWQgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB4LTQgcGItNCBib3JkZXItdCBib3JkZXItcGluay01MDAvMjAgYmctc2xhdGUtOTUwLzQwXCIgZGF0YS10ZXN0aWQ9e2BwbHVnaW4tY29uZmlnLXBhbmVsLSR7cC5pZH1gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmaWVsZHMubGVuZ3RoID09PSAwID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS01MDAgaXRhbGljIHB5LTNcIj5ObyBjb25maWd1cmFibGUgb3B0aW9ucyBmb3IgdGhpcyBwbHVnLWluIHlldC48L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBtZDpncmlkLWNvbHMtMiBnYXAtMyBwdC0zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmaWVsZHMubWFwKGYgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdiA9IGZpZWxkVmFsKHAuaWQsIGYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17Zi5rZXl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJvbGQgdGV4dC1zbGF0ZS01MDAgYmxvY2sgbWItMVwiPntmLmxhYmVsfTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmLnR5cGUgPT09ICdzZWxlY3QnICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXQgY3Vyc29yLXBvaW50ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGVGaWVsZChwLmlkLCBmLmtleSwgZS50YXJnZXQudmFsdWUpfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi5vcHRpb25zLm1hcChvID0+IDxvcHRpb24ga2V5PXtvfSB2YWx1ZT17b30+e299PC9vcHRpb24+KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi50eXBlID09PSAnbnVtYmVyJyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cIm51bWJlclwiIGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZUZpZWxkKHAuaWQsIGYua2V5LCArZS50YXJnZXQudmFsdWUpfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmLnR5cGUgPT09ICd0ZXh0JyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3Z9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGVGaWVsZChwLmlkLCBmLmtleSwgZS50YXJnZXQudmFsdWUpfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmLnR5cGUgPT09ICd0b2dnbGUnICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gdXBkYXRlRmllbGQocC5pZCwgZi5rZXksICF2KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdy1mdWxsIHB5LTIgcm91bmRlZC1sZyB0ZXh0LXhzIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBib3JkZXIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7dlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLXBpbmstNzAwLzQwIGJvcmRlci1waW5rLTUwMC82MCB0ZXh0LXBpbmstMjAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLXNsYXRlLTgwMCBib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtNDAwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7diA/ICdPTicgOiAnT0ZGJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWVuZCBnYXAtMiBtdC00IHB0LTMgYm9yZGVyLXQgYm9yZGVyLXNsYXRlLTgwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlc2V0IHRoaXMgcGx1Zy1pbidzIGZpZWxkcyB0byBkZWZhdWx0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldENmZyhjID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV4dCA9IHsgLi4uKGMuZmllbGRzIHx8IHt9KSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgbmV4dFtwLmlkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgLi4uYywgZmllbGRzOiBuZXh0IH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtMyBweS0xLjUgcm91bmRlZC1tZCB0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgYm9yZGVyIGJvcmRlci1zbGF0ZS02MDAgdGV4dC1zbGF0ZS00MDAgaG92ZXI6Ymctc2xhdGUtODAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlc2V0IGRlZmF1bHRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBzZXRFeHBhbmRlZElkKG51bGwpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtMyBweS0xLjUgcm91bmRlZC1tZCB0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgYmctcGluay02MDAgaG92ZXI6YmctcGluay01MDAgdGV4dC13aGl0ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEb25lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNSBwLTQgYm9yZGVyLTIgYm9yZGVyLWRhc2hlZCBib3JkZXItc2xhdGUtNzAwIHJvdW5kZWQteGwgdGV4dC1jZW50ZXIgaG92ZXI6Ym9yZGVyLXBpbmstNTAwLzQwIHRyYW5zaXRpb24tYWxsIGN1cnNvci1wb2ludGVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LTN4bCBtYi0xXCI+4qS0PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS0zMDBcIj5Ecm9wIGEgLnB5IC8gLnppcCAvIC5yZWQ1IHBsdWctaW4gaGVyZTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTFweF0gdGV4dC1zbGF0ZS01MDAgbXQtMVwiPm9yIGNsaWNrIHRvIGNob29zZSBhIGZpbGUgKG1vY2sg4oCUIG5vdCB3aXJlZCk8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L01vZGFsU2hlbGw+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTW9kYWwgU2hlbGwgLS0gc2hhcmVkXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5mdW5jdGlvbiBNb2RhbFNoZWxsKHsgdGl0bGUsIHN1YnRpdGxlLCBhY2NlbnQ9J2luZGlnbycsIG9uQ2xvc2UsIG9uU2F2ZSwgc2l6ZT0nJywgY2hpbGRyZW4gfSkge1xuICAgIGNvbnN0IGNvbG9yTWFwID0ge1xuICAgICAgICBpbmRpZ286JyM4MThjZjgnLCBhbWJlcjonI2ZiYmYyNCcsIGVtZXJhbGQ6JyMzNGQzOTknLCBwaW5rOicjZjQ3MmI2J1xuICAgIH07XG4gICAgY29uc3QgYyA9IGNvbG9yTWFwW2FjY2VudF0gfHwgJyM4MThjZjgnO1xuICAgIGNvbnN0IHNpemVNYXAgPSB7XG4gICAgICAgIHdpZGU6ICdtYXgtdy0yeGwnLFxuICAgICAgICBtYXA6ICAnbWF4LXctM3hsJyxcbiAgICAgICAgbWF4OiAgJ21heC13LVs5NnZ3XSB3LVs5NnZ3XSBoLVs5MnZoXScsXG4gICAgfTtcbiAgICBjb25zdCB3aWR0aCA9IHNpemVNYXBbc2l6ZV0gfHwgJ21heC13LW1kJztcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpeGVkIGluc2V0LTAgei01MCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBtb2RhbC1iYWNrZHJvcFwiIG9uQ2xpY2s9e29uQ2xvc2V9PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BiZy1zbGF0ZS05MDAgYm9yZGVyLTIgcm91bmRlZC0yeGwgdy1mdWxsICR7d2lkdGh9IG14LTQgcC02IGZhZGUtdXBgfVxuICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX1cbiAgICAgICAgICAgICAgICAgc3R5bGU9e3tib3JkZXJDb2xvcjpgJHtjfTY2YH19PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1zdGFydCBqdXN0aWZ5LWJldHdlZW4gbWItNVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtbGcgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0XCIgc3R5bGU9e3tjb2xvcjpjfX0+e3RpdGxlfTwvaDM+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtc2xhdGUtNTAwIG10LTFcIj57c3VidGl0bGV9PC9wPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkNsb3NlfSBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCBob3Zlcjp0ZXh0LXdoaXRlIHRleHQtMnhsIGxlYWRpbmctbm9uZVwiPsOXPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1lbmQgZ2FwLTMgbXQtNiBwdC00IGJvcmRlci10IGJvcmRlci1zbGF0ZS04MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkNsb3NlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTQgcHktMiByb3VuZGVkLWxnIGJnLXNsYXRlLTgwMCBib3JkZXIgYm9yZGVyLXNsYXRlLTcwMCB0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayB0ZXh0LXNsYXRlLTQwMCBob3ZlcjpiZy1zbGF0ZS03MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIENhbmNlbFxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvblNhdmV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtNSBweS0yIHJvdW5kZWQtbGcgdGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgdGV4dC13aGl0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOmMsIGJveFNoYWRvdzpgMCAwIDEycHggJHtjfTU1YH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgU2F2ZSAmIHJldHVybiDinJNcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuLyogbW91bnQgKi9cblJlYWN0RE9NLmNyZWF0ZVJvb3QoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKSkucmVuZGVyKDxBcHAvPik7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBQSxNQUFBLEdBQThCQyxLQUFLO0VBQTNCQyxRQUFRLEdBQUFGLE1BQUEsQ0FBUkUsUUFBUTtFQUFFQyxPQUFPLEdBQUFILE1BQUEsQ0FBUEcsT0FBTzs7QUFFekI7QUFDQTtBQUNBO0FBQ0EsSUFBTUMsS0FBSyxHQUFHLENBQ1Y7RUFBRUMsR0FBRyxFQUFDLEtBQUs7RUFBT0MsS0FBSyxFQUFDLG1CQUFtQjtFQUFLQyxHQUFHLEVBQUMsZ0NBQWdDO0VBQUVDLElBQUksRUFBQyxNQUFNO0VBQUdDLFNBQVMsRUFBQyxTQUFTO0VBQUVDLE1BQU0sRUFBQztBQUFTLENBQUMsRUFDMUk7RUFBRUwsR0FBRyxFQUFDLFVBQVU7RUFBRUMsS0FBSyxFQUFDLGtCQUFrQjtFQUFNQyxHQUFHLEVBQUMsd0JBQXdCO0VBQVVDLElBQUksRUFBQyxPQUFPO0VBQUVDLFNBQVMsRUFBQyxTQUFTO0VBQUVDLE1BQU0sRUFBQztBQUFRLENBQUMsRUFDekk7RUFBRUwsR0FBRyxFQUFDLFVBQVU7RUFBRUMsS0FBSyxFQUFDLGtCQUFrQjtFQUFNQyxHQUFHLEVBQUMsdUJBQXVCO0VBQVdDLElBQUksRUFBQyxPQUFPO0VBQUVDLFNBQVMsRUFBQyxTQUFTO0VBQUVDLE1BQU0sRUFBQztBQUFVLENBQUMsRUFDM0k7RUFBRUwsR0FBRyxFQUFDLFNBQVM7RUFBR0MsS0FBSyxFQUFDLGlCQUFpQjtFQUFPQyxHQUFHLEVBQUMsd0JBQXdCO0VBQVVDLElBQUksRUFBQyxPQUFPO0VBQUVDLFNBQVMsRUFBQyxTQUFTO0VBQUVDLE1BQU0sRUFBQztBQUFPLENBQUMsQ0FD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QUFDLEVBQUUsRUFBRSxJQUFJLEdBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxHQUFDLElBQUksQ0FBQyxFQUFFLEdBQUdDLFFBQVEsQ0FBQztFQUNyRSxJQUFNUSxJQUFJLEdBQUcsQ0FBQyxHQUFHWCxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFUCxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFQSxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7RUFDN0YsSUFBTW1CLEdBQUcsR0FBSSxDQUFDLEdBQUdaLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUVQLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUVBLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUM3RixJQUFNb0IsSUFBSSxHQUFHLENBQUMsR0FBR2IsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRVAsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFQSxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQ2hFLENBQUMsRUFBRSxFQUFFQSxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUVBLEtBQUss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