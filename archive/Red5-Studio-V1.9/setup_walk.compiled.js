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
   * back from the server (persisted:false) -- we surface that as a toast
   * so the operator knows they need to sign in to keep the pick across
   * page reloads.  We always also write to localStorage so the SAME
   * tab keeps the chosen location for the current session. */
  var _React$useState1 = React.useState(null),
    _React$useState10 = _slicedToArray(_React$useState1, 2),
    saveMsg = _React$useState10[0],
    setSaveMsg = _React$useState10[1];
  var persistAndSave = /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator(function* () {
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
  var _React$useState11 = React.useState(null),
    _React$useState12 = _slicedToArray(_React$useState11, 2),
    expandedId = _React$useState12[0],
    setExpandedId = _React$useState12[1];
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBfd2Fsay5jb21waWxlZC5qcyIsIm5hbWVzIjpbIl9SZWFjdCIsIlJlYWN0IiwidXNlU3RhdGUiLCJ1c2VNZW1vIiwiU1RFUFMiLCJrZXkiLCJsYWJlbCIsInN1YiIsImtpbmQiLCJpY29uQ29sb3IiLCJhY2NlbnQiLCJBcHAiLCJfdXNlU3RhdGUiLCJwc3kiLCJsb2NhdGlvbiIsImxhbmd1YWdlIiwicGx1Z2lucyIsIl91c2VTdGF0ZTIiLCJfc2xpY2VkVG9BcnJheSIsImRvbmUiLCJzZXREb25lIiwiX3VzZVN0YXRlMyIsIl91c2VTdGF0ZTQiLCJyb3V0ZSIsInNldFJvdXRlIiwiX3VzZVN0YXRlNSIsIl91c2VTdGF0ZTYiLCJtb2RhbCIsInNldE1vZGFsIiwiX3VzZVN0YXRlNyIsImdpdm9uaSIsInJoUHJlc2V0IiwicmhMbyIsInJoSGkiLCJ0TG8iLCJ0SGkiLCJ0aGVtZSIsImRhcmtMZXZlbCIsIl91c2VTdGF0ZTgiLCJwc3lDZmciLCJzZXRQc3lDZmciLCJfdXNlU3RhdGU5Iiwic2l0ZU5hbWUiLCJjaXR5IiwibGF0IiwibG9uIiwiX3VzZVN0YXRlMCIsImxvY0NmZyIsInNldExvY0NmZyIsIl91c2VTdGF0ZTEiLCJsYW5nIiwiX3VzZVN0YXRlMTAiLCJsYW5nQ2ZnIiwic2V0TGFuZ0NmZyIsIl91c2VTdGF0ZTExIiwiZW5hYmxlZCIsIl91c2VTdGF0ZTEyIiwicGx1Z2luQ2ZnIiwic2V0UGx1Z2luQ2ZnIiwiY29tcGxldGVDb3VudCIsIk9iamVjdCIsInZhbHVlcyIsImZpbHRlciIsIkJvb2xlYW4iLCJsZW5ndGgiLCJmaW5pc2giLCJkIiwiX29iamVjdFNwcmVhZCIsImNyZWF0ZUVsZW1lbnQiLCJQc3lDaGFydFNldHRpbmdQYWdlIiwiY2ZnIiwic2V0Q2ZnIiwib25CYWNrIiwib25TYXZlIiwiY2xhc3NOYW1lIiwiaHJlZiIsIm9uQ2xpY2siLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiZSIsInN0eWxlIiwiYW5pbWF0aW9uRGVsYXkiLCJtYXAiLCJzIiwiaSIsIlRpbGUiLCJzdGVwIiwiaW5kZXgiLCJjb25jYXQiLCJMb2NhdGlvbk1vZGFsIiwib25DbG9zZSIsIkxhbmd1YWdlTW9kYWwiLCJQbHVnaW5zTW9kYWwiLCJfcmVmIiwiYmFja2dyb3VuZCIsImJvcmRlciIsIlRpbGVJY29uIiwiY29sb3IiLCJfcmVmMiIsInN0cm9rZSIsImZpbGwiLCJzdHJva2VXaWR0aCIsInN0cm9rZUxpbmVjYXAiLCJzdHJva2VMaW5lam9pbiIsIl9leHRlbmRzIiwid2lkdGgiLCJoZWlnaHQiLCJ2aWV3Qm94IiwiY3giLCJjeSIsInIiLCJfcmVmMyIsInVwZGF0ZSIsImsiLCJ2IiwiYyIsInVzZUVmZmVjdCIsInJhdyIsImdldEl0ZW0iLCJwcmVzZXQiLCJwYXRjaCIsInAiLCJKU09OIiwicGFyc2UiLCJOdW1iZXIiLCJpc0Zpbml0ZSIsImxvIiwiaGkiLCJSSF9QUkVTRVRTIiwiZmluZCIsIngiLCJpZCIsInRoIiwiZGwiLCJwYXJzZUZsb2F0Iiwia2V5cyIsInBlcnNpc3RBbmRTYXZlIiwic3RyaW5naWZ5IiwiU3RyaW5nIiwid2luZG93IiwiZGlzcGF0Y2hFdmVudCIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwiY29uc29sZSIsImluZm8iLCJ3YXJuIiwiUHN5U2tlbGV0b24iLCJQc3lDb250cm9sUGFuZWwiLCJub3RlIiwiX3JlZjQiLCJXIiwiSCIsInBhZCIsImxlZnQiLCJyaWdodCIsInRvcCIsImJvdHRvbSIsImdyaWRXIiwiZ3JpZEgiLCJUX01JTiIsIlRfTUFYIiwiV19NSU4iLCJXX01BWCIsInQiLCJ5IiwidyIsIl9nZXRXIiwiZ2V0VyIsInJoIiwic2FmZVB0cyIsImFyciIsInRvRml4ZWQiLCJqb2luIiwicmg4MCIsInB1c2giLCJyaDEwMCIsInJoMjBMaW5lIiwicmgyMF9DWiIsIkNaIiwicmhIaV90b3AiLCJ0dCIsInJoTG9fYm90IiwiU1dFRVQiLCJOViIsIk1hc3MiLCJNQ1YiLCJFVkFQIiwid2ludGVyUkg4MCIsIndpbnRlclJIMjAiLCJXSU5URVIiLCJpc29wbGV0aHMiLCJpc0xpZ2h0IiwicGFsZXR0ZSIsImJnIiwiZ3JpZCIsInRpY2siLCJheGlzIiwicGFuZWxCZyIsInBhbmVsQm9yZGVyIiwicGlsbEJnIiwicGlsbEZnIiwibWV0YUZnIiwiZGltRmlsdGVyIiwiTWF0aCIsIm1heCIsIm1pbiIsImJvcmRlckNvbG9yIiwiYm9yZGVyUmFkaXVzIiwiQXJyYXkiLCJmcm9tIiwiXyIsIngxIiwieTEiLCJ4MiIsInkyIiwiZm9udFNpemUiLCJ0ZXh0QW5jaG9yIiwicHRzIiwid3ciLCJwb2ludHMiLCJzdHJva2VEYXNoYXJyYXkiLCJmbG9vciIsImZvbnRXZWlnaHQiLCJvcGFjaXR5IiwiZmlsbE9wYWNpdHkiLCJjbGlwUGF0aFVuaXRzIiwiY2xpcFBhdGgiLCJ0cmFuc2Zvcm0iLCJsZXR0ZXJTcGFjaW5nIiwicGFpbnRPcmRlciIsIl9yZWY1Iiwicm91bmQiLCJ0eXBlIiwidmFsdWUiLCJvbkNoYW5nZSIsInRhcmdldCIsImFjY2VudENvbG9yIiwiX3JlZjYiLCJtYXBCb3hSZWYiLCJ1c2VSZWYiLCJtYXBSZWYiLCJtYXJrZXJSZWYiLCJfUmVhY3QkdXNlU3RhdGUiLCJfUmVhY3QkdXNlU3RhdGUyIiwiZ2VvQnVzeSIsInNldEdlb0J1c3kiLCJfUmVhY3QkdXNlU3RhdGUzIiwiX1JlYWN0JHVzZVN0YXRlNCIsInNlYXJjaFEiLCJzZXRTZWFyY2hRIiwiX1JlYWN0JHVzZVN0YXRlNSIsIl9SZWFjdCR1c2VTdGF0ZTYiLCJzZWFyY2hIaXRzIiwic2V0U2VhcmNoSGl0cyIsIl9SZWFjdCR1c2VTdGF0ZTciLCJfUmVhY3QkdXNlU3RhdGU4Iiwic2VhcmNoQnVzeSIsInNldFNlYXJjaEJ1c3kiLCJfUmVhY3QkdXNlU3RhdGU5IiwiX1JlYWN0JHVzZVN0YXRlMCIsInNlYXJjaE9wZW4iLCJzZXRTZWFyY2hPcGVuIiwic2VhcmNoRGVib3VuY2VSZWYiLCJydW5TZWFyY2giLCJfcmVmNyIsIl9hc3luY1RvR2VuZXJhdG9yIiwicSIsInRyaW0iLCJ1cmwiLCJlbmNvZGVVUklDb21wb25lbnQiLCJmZXRjaCIsImhlYWRlcnMiLCJqIiwianNvbiIsImlzQXJyYXkiLCJfeCIsImFwcGx5IiwiYXJndW1lbnRzIiwiY3VycmVudCIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJwaWNrU2VhcmNoSGl0IiwiaGl0IiwiZGlzcGxheV9uYW1lIiwic2V0VmlldyIsInJldmVyc2VHZW9jb2RlIiwiX3JlZjgiLCJhIiwiYWRkcmVzcyIsInRvd24iLCJ2aWxsYWdlIiwiaGFtbGV0IiwiY291bnR5IiwicmVnaW9uIiwic3RhdGUiLCJjb3VudHJ5IiwiX3gyIiwiX3gzIiwiTCIsInpvb21Db250cm9sIiwiYXR0cmlidXRpb25Db250cm9sIiwidGlsZUxheWVyIiwibWF4Wm9vbSIsImF0dHJpYnV0aW9uIiwiYWRkVG8iLCJtYXJrZXIiLCJkcmFnZ2FibGUiLCJiaW5kVG9vbHRpcCIsInBlcm1hbmVudCIsImFwcGx5TGF0TG9uIiwibiIsIm9uIiwibGwiLCJnZXRMYXRMbmciLCJsbmciLCJzZXRMYXRMbmciLCJsYXRsbmciLCJpbnZhbGlkYXRlU2l6ZSIsInJlbW92ZSIsInBhblRvIiwidXNlTXlMb2NhdGlvbiIsIm5hdmlnYXRvciIsImdlb2xvY2F0aW9uIiwiZ2V0Q3VycmVudFBvc2l0aW9uIiwicG9zIiwiY29vcmRzIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJlcnIiLCJfUmVhY3QkdXNlU3RhdGUxIiwiX1JlYWN0JHVzZVN0YXRlMTAiLCJzYXZlTXNnIiwic2V0U2F2ZU1zZyIsIl9yZWY5IiwibG9jIiwibmFtZSIsInBlcnNpc3RlZCIsIndhcm5pbmciLCJtZXRob2QiLCJjcmVkZW50aWFscyIsImJvZHkiLCJhY3RpdmUiLCJkZWZhdWx0IiwiX2xhc3RXZWF0aGVyTG9jYXRpb25TYXZlIiwiTW9kYWxTaGVsbCIsInRpdGxlIiwic3VidGl0bGUiLCJzaXplIiwibWluSGVpZ2h0IiwicmVmIiwib3ZlcmZsb3ciLCJvbkZvY3VzIiwicGxhY2Vob2xkZXIiLCJvdXRsaW5lIiwiaCIsInBsYWNlX2lkIiwiY2xhc3MiLCJ6IiwiX3JlZjAiLCJsYW5ncyIsImNvZGUiLCJuYXRpdmUiLCJsIiwiUExVR0lOX0NPTkZJR19GSUVMRFMiLCJ3ZWF0aGVyIiwib3B0aW9ucyIsImRlZiIsInN3ZWV0X3Nwb3QiLCJnMzYiLCJkaWJ0IiwibGlnaHRpbmciLCJfcmVmMSIsIkFMTCIsImRlc2MiLCJ2ZXIiLCJ0b2dnbGUiLCJpbmNsdWRlcyIsIl9SZWFjdCR1c2VTdGF0ZTExIiwiX1JlYWN0JHVzZVN0YXRlMTIiLCJleHBhbmRlZElkIiwic2V0RXhwYW5kZWRJZCIsInVwZGF0ZUZpZWxkIiwicGx1Z2luSWQiLCJmaWVsZEtleSIsImZpZWxkcyIsImZpZWxkVmFsIiwiZmllbGQiLCJzdG9yZWQiLCJ1bmRlZmluZWQiLCJleHBhbmRlZCIsImYiLCJvIiwibmV4dCIsIl9yZWYxMCIsIl9yZWYxMCRhY2NlbnQiLCJfcmVmMTAkc2l6ZSIsImNoaWxkcmVuIiwiY29sb3JNYXAiLCJpbmRpZ28iLCJhbWJlciIsImVtZXJhbGQiLCJwaW5rIiwic2l6ZU1hcCIsIndpZGUiLCJzdG9wUHJvcGFnYXRpb24iLCJtYXhIZWlnaHQiLCJib3hTaGFkb3ciLCJSZWFjdERPTSIsImNyZWF0ZVJvb3QiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwicmVuZGVyIl0sInNvdXJjZXMiOlsiLi4vc3JjL3NldHVwLXdhbGsvc2V0dXBfd2Fsay5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgeyB1c2VTdGF0ZSwgdXNlTWVtbyB9ID0gUmVhY3Q7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFNURVAgREVGSU5JVElPTlMg4oCUIHRoZSA0IHdhbGsgcGF0aHMgdGhlIHVzZXIgZGVzY3JpYmVkXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5jb25zdCBTVEVQUyA9IFtcbiAgICB7IGtleToncHN5JywgICAgICBsYWJlbDonUHN5IENoYXJ0IFNldHRpbmcnLCAgICBzdWI6J0dpdm9uaSDCtyBSSCByYW5nZSDCtyBheGlzIHJhbmdlJywga2luZDoncGFnZScsICBpY29uQ29sb3I6JyM4MThjZjgnLCBhY2NlbnQ6J2luZGlnbycgfSxcbiAgICB7IGtleTonbG9jYXRpb24nLCBsYWJlbDonTG9jYXRpb24gU2V0dGluZycsICAgICBzdWI6J0NpdHkgbmFtZSAmIGxhdCAvIGxvbmcnLCAgICAgICAgIGtpbmQ6J21vZGFsJywgaWNvbkNvbG9yOicjZmJiZjI0JywgYWNjZW50OidhbWJlcicgfSxcbiAgICB7IGtleTonbGFuZ3VhZ2UnLCBsYWJlbDonTGFuZ3VhZ2UgU2V0dGluZycsICAgICBzdWI6J0VOIMK3IEZSIMK3IEVTIMK3IFpIIMK3IOKApicsICAgICAgICAgIGtpbmQ6J21vZGFsJywgaWNvbkNvbG9yOicjMzRkMzk5JywgYWNjZW50OidlbWVyYWxkJyB9LFxuICAgIHsga2V5OidwbHVnaW5zJywgIGxhYmVsOidQbHVnLWluIFNldHRpbmcnLCAgICAgIHN1YjonTGlzdCDCtyB1cGxvYWQgwrcgbW9kaWZ5JywgICAgICAgICBraW5kOidtb2RhbCcsIGljb25Db2xvcjonI2Y0NzJiNicsIGFjY2VudDoncGluaycgfSxcbl07XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFJPT1QgQVBQXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5mdW5jdGlvbiBBcHAoKSB7XG4gICAgLyogY29tcGxldGlvbiArIHBlci1zdGVwIGNvbmZpZyAtLSBtb2NrdXAgc3RhdGUsIG5ldmVyIHBlcnNpc3RlZCAqL1xuICAgIGNvbnN0IFtkb25lLCBzZXREb25lXSA9IHVzZVN0YXRlKHsgcHN5OmZhbHNlLCBsb2NhdGlvbjpmYWxzZSwgbGFuZ3VhZ2U6ZmFsc2UsIHBsdWdpbnM6ZmFsc2UgfSk7XG4gICAgY29uc3QgW3JvdXRlLCBzZXRSb3V0ZV0gPSB1c2VTdGF0ZSgnaHViJyk7ICAgLy8gJ2h1YicgfCAncHN5J1xuICAgIGNvbnN0IFttb2RhbCwgc2V0TW9kYWxdID0gdXNlU3RhdGUobnVsbCk7ICAgICAvLyAnbG9jYXRpb24nIHwgJ2xhbmd1YWdlJyB8ICdwbHVnaW5zJyB8IG51bGxcblxuICAgIGNvbnN0IFtwc3lDZmcsIHNldFBzeUNmZ10gICAgICAgICA9IHVzZVN0YXRlKHsgZ2l2b25pOnRydWUsIHJoUHJlc2V0OidvZmZpY2UnLCByaExvOjMwLCByaEhpOjYwLCB0TG86LTE1LCB0SGk6NTAsIHRoZW1lOidkYXJrJywgZGFya0xldmVsOjIuMCB9KTtcbiAgICBjb25zdCBbbG9jQ2ZnLCBzZXRMb2NDZmddICAgICAgICAgPSB1c2VTdGF0ZSh7IHNpdGVOYW1lOidNeSBCdWlsZGluZycsIGNpdHk6J1Rvcm9udG8sIE9OJywgbGF0OjQzLjY1MzIsIGxvbjotNzkuMzgzMiB9KTtcbiAgICBjb25zdCBbbGFuZ0NmZywgc2V0TGFuZ0NmZ10gICAgICAgPSB1c2VTdGF0ZSh7IGxhbmc6J2VuJyB9KTtcbiAgICBjb25zdCBbcGx1Z2luQ2ZnLCBzZXRQbHVnaW5DZmddICAgPSB1c2VTdGF0ZSh7IGVuYWJsZWQ6Wyd3ZWF0aGVyJywnZ2l2b25pJywnc3dlZXRfc3BvdCddIH0pO1xuXG4gICAgY29uc3QgY29tcGxldGVDb3VudCA9IE9iamVjdC52YWx1ZXMoZG9uZSkuZmlsdGVyKEJvb2xlYW4pLmxlbmd0aDtcblxuICAgIGNvbnN0IGZpbmlzaCA9IChrZXkpID0+IHtcbiAgICAgICAgc2V0RG9uZShkID0+ICh7Li4uZCwgW2tleV06dHJ1ZX0pKTtcbiAgICAgICAgc2V0Um91dGUoJ2h1YicpO1xuICAgICAgICBzZXRNb2RhbChudWxsKTtcbiAgICB9O1xuXG4gICAgLyogZnVsbC1wYWdlIFBzeSBDaGFydCBlZGl0b3IgKi9cbiAgICBpZiAocm91dGUgPT09ICdwc3knKSB7XG4gICAgICAgIHJldHVybiA8UHN5Q2hhcnRTZXR0aW5nUGFnZSBjZmc9e3BzeUNmZ30gc2V0Q2ZnPXtzZXRQc3lDZmd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkJhY2s9eygpID0+IHNldFJvdXRlKCdodWInKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2F2ZT17KCkgPT4gZmluaXNoKCdwc3knKX0gLz47XG4gICAgfVxuXG4gICAgLyogZGVmYXVsdDogSFVCIHNjcmVlbiAqL1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWluLWgtc2NyZWVuIHB4LTYgcHktOFwiPlxuICAgICAgICAgICAgey8qIC0tLS0tLS0tLS0tLS0gaGVhZGVyIC0tLS0tLS0tLS0tLS0gKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1heC13LTV4bCBteC1hdXRvIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBtYi0xMCBmYWRlLXVwXCI+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cInRleHQtMnhsIHNtOnRleHQtM3hsIGZvbnQtYmxhY2sgaXRhbGljIHVwcGVyY2FzZSB0cmFja2luZy10aWdodFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1yZWQtNTAwXCI+UmVkNTwvc3Bhbj4gPHNwYW4gY2xhc3NOYW1lPVwidGV4dC13aGl0ZVwiPlN0dWRpbzwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNTAwIGZvbnQtbm9ybWFsIGl0YWxpY1wiPiAmbmJzcDsvJm5ic3A7IHNldHVwIHdhbGs8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvaDE+XG4gICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNTAwIHRleHQteHMgbXQtMSBmb250LW1vbm8gdHJhY2tpbmctd2lkZVwiPkNvbmZpZ3VyZSBvbmNlLiBTa2lwIGFueSBzdGVwIHlvdSBkb24ndCBuZWVkLjwvcD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC00XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInBpbGwgYmctc2xhdGUtODAwIHRleHQtc2xhdGUtNDAwXCI+e2NvbXBsZXRlQ291bnR9LzQgRE9ORTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIi9kYXNoYm9hcmQuaHRtbFwiXG4gICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHsgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDUuc2V0dXAuZG9uZScsJzEnKTsgfSBjYXRjaChlKXt9IH19XG4gICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS01MDAgaG92ZXI6dGV4dC1zbGF0ZS0zMDAgdW5kZXJsaW5lIHVuZGVybGluZS1vZmZzZXQtNFwiPlNraXAgYWxsIOKGkjwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogLS0tLS0tLS0tLS0tLSB0aWxlIGdyaWQgLS0tLS0tLS0tLS0tLSAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctNXhsIG14LWF1dG8gZ3JpZCBncmlkLWNvbHMtMSBzbTpncmlkLWNvbHMtMiBnYXAtNSBmYWRlLXVwXCIgc3R5bGU9e3thbmltYXRpb25EZWxheTonLjA4cyd9fT5cbiAgICAgICAgICAgICAgICB7U1RFUFMubWFwKChzLCBpKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDxUaWxlIGtleT17cy5rZXl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXA9e3N9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmU9e2RvbmVbcy5rZXldfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleD17aSsxfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzLmtpbmQgPT09ICdwYWdlJyA/IHNldFJvdXRlKHMua2V5KSA6IHNldE1vZGFsKHMua2V5KX0gLz5cbiAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogLS0tLS0tLS0tLS0tLSBmb290ZXIgQ1RBIC0tLS0tLS0tLS0tLS0gKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1heC13LTV4bCBteC1hdXRvIG10LTEwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBmYWRlLXVwXCIgc3R5bGU9e3thbmltYXRpb25EZWxheTonLjE4cyd9fT5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCB0ZXh0LXhzIGZvbnQtbW9ub1wiPlxuICAgICAgICAgICAgICAgICAgICB7Y29tcGxldGVDb3VudCA9PT0gMCAmJiAn4oaRIFBpY2sgYSBzZXR0aW5nIHRvIHN0YXJ0LCBvciBza2lwIGFsbCBhbmQgZ28gc3RyYWlnaHQgdG8gdGhlIGRhc2hib2FyZC4nfVxuICAgICAgICAgICAgICAgICAgICB7Y29tcGxldGVDb3VudCA+IDAgJiYgY29tcGxldGVDb3VudCA8IDQgJiYgYOKGkSAkezQgLSBjb21wbGV0ZUNvdW50fSBzdGVwJHs0IC0gY29tcGxldGVDb3VudCA9PT0gMSA/ICcnIDogJ3MnfSByZW1haW5pbmcgKG9wdGlvbmFsKS5gfVxuICAgICAgICAgICAgICAgICAgICB7Y29tcGxldGVDb3VudCA9PT0gNCAmJiAn4pyTIEFsbCBzdGVwcyBjb25maWd1cmVkLiAgUmVhZHkgd2hlbiB5b3UgYXJlLid9XG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIvZGFzaGJvYXJkLmh0bWxcIlxuICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHsgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDUuc2V0dXAuZG9uZScsJzEnKTsgfSBjYXRjaChlKXt9IH19XG4gICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHgtNyBweS0zIHJvdW5kZWQteGwgdGV4dC1zbSBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Y29tcGxldGVDb3VudCA9PT0gNFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLWVtZXJhbGQtNjAwIGhvdmVyOmJnLWVtZXJhbGQtNTAwIHRleHQtd2hpdGUgc2hhZG93LWxnIHNoYWRvdy1lbWVyYWxkLTUwMC8zMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1pbmRpZ28tNjAwIGhvdmVyOmJnLWluZGlnby01MDAgdGV4dC13aGl0ZSBzaGFkb3ctbGcgc2hhZG93LWluZGlnby01MDAvMjAnfWB9PlxuICAgICAgICAgICAgICAgICAgICBPcGVuIERhc2hib2FyZCDihpJcbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIC0tLS0tLS0tLS0tLS0gbW9kYWxzIC0tLS0tLS0tLS0tLS0gKi99XG4gICAgICAgICAgICB7bW9kYWwgPT09ICdsb2NhdGlvbicgJiYgPExvY2F0aW9uTW9kYWwgY2ZnPXtsb2NDZmd9IHNldENmZz17c2V0TG9jQ2ZnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0TW9kYWwobnVsbCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNhdmU9eygpID0+IGZpbmlzaCgnbG9jYXRpb24nKX0gLz59XG4gICAgICAgICAgICB7bW9kYWwgPT09ICdsYW5ndWFnZScgJiYgPExhbmd1YWdlTW9kYWwgY2ZnPXtsYW5nQ2ZnfSBzZXRDZmc9e3NldExhbmdDZmd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRNb2RhbChudWxsKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2F2ZT17KCkgPT4gZmluaXNoKCdsYW5ndWFnZScpfSAvPn1cbiAgICAgICAgICAgIHttb2RhbCA9PT0gJ3BsdWdpbnMnICAmJiA8UGx1Z2luc01vZGFsICBjZmc9e3BsdWdpbkNmZ30gc2V0Q2ZnPXtzZXRQbHVnaW5DZmd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRNb2RhbChudWxsKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2F2ZT17KCkgPT4gZmluaXNoKCdwbHVnaW5zJyl9IC8+fVxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBUaWxlIChsYXJnZSBlYXN5LW9uLWV5ZXMgYnV0dG9uKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuZnVuY3Rpb24gVGlsZSh7IHN0ZXAsIGRvbmUsIGluZGV4LCBvbkNsaWNrIH0pIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BzZXR1cC10aWxlLSR7c3RlcC5rZXl9YH1cbiAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtgT3BlbiAke3N0ZXAubGFiZWx9YH1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B0aWxlLWJ0biByZWxhdGl2ZSB0ZXh0LWxlZnQgYmctc2xhdGUtOTAwLzcwIGJvcmRlci0yIGJvcmRlci1zbGF0ZS03MDAvNzBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3VuZGVkLTJ4bCBwLTYgc206cC03ICR7ZG9uZSA/ICdkb25lJyA6ICcnfWB9PlxuICAgICAgICAgICAge2RvbmUgJiYgPHNwYW4gY2xhc3NOYW1lPVwiY2hlY2tcIiBkYXRhLXRlc3RpZD17YHNldHVwLXRpbGUtJHtzdGVwLmtleX0tZG9uZWB9PuKckzwvc3Bhbj59XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC00IG1iLTNcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctMTIgaC0xMiByb3VuZGVkLXhsIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyXCJcbiAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7YmFja2dyb3VuZDpgJHtzdGVwLmljb25Db2xvcn0yMmAsIGJvcmRlcjpgMXB4IHNvbGlkICR7c3RlcC5pY29uQ29sb3J9NTVgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxUaWxlSWNvbiBraW5kPXtzdGVwLmtleX0gY29sb3I9e3N0ZXAuaWNvbkNvbG9yfSAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC0zeGwgZm9udC1ibGFjayB0ZXh0LXNsYXRlLTcwMFwiPjB7aW5kZXh9PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LWxnIHNtOnRleHQteGwgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXIgbWItMVwiXG4gICAgICAgICAgICAgICAgc3R5bGU9e3tjb2xvcjpzdGVwLmljb25Db2xvcn19PntzdGVwLmxhYmVsfTwvaDM+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTQwMCB0ZXh0LXNtIGxlYWRpbmctc251Z1wiPntzdGVwLnN1Yn08L3A+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTQgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgdGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJvbGQgdGV4dC1zbGF0ZS01MDBcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJwaWxsIGJnLXNsYXRlLTgwMCB0ZXh0LXNsYXRlLTQwMFwiPntzdGVwLmtpbmQgPT09ICdwYWdlJyA/ICdGdWxsIHBhZ2UnIDogJ1BvcHVwJ308L3NwYW4+XG4gICAgICAgICAgICAgICAge2RvbmUgJiYgPHNwYW4gY2xhc3NOYW1lPVwicGlsbCBiZy1lbWVyYWxkLTkwMC80MCB0ZXh0LWVtZXJhbGQtNDAwXCI+Q29uZmlndXJlZDwvc3Bhbj59XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgKTtcbn1cblxuZnVuY3Rpb24gVGlsZUljb24oeyBraW5kLCBjb2xvciB9KSB7XG4gICAgLyogc2ltcGxlIGlubGluZSBTVkdzIHNvIHdlIGtlZXAgdGhlIGZpbGUgc2VsZi1jb250YWluZWQgKi9cbiAgICBjb25zdCBzdHJva2UgPSB7IHN0cm9rZTpjb2xvciwgZmlsbDonbm9uZScsIHN0cm9rZVdpZHRoOjIsIHN0cm9rZUxpbmVjYXA6J3JvdW5kJywgc3Ryb2tlTGluZWpvaW46J3JvdW5kJyB9O1xuICAgIGlmIChraW5kID09PSAncHN5JykgICAgICByZXR1cm4gPHN2ZyB3aWR0aD1cIjIyXCIgaGVpZ2h0PVwiMjJcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgey4uLnN0cm9rZX0+PHBhdGggZD1cIk0zIDN2MThoMThcIi8+PHBhdGggZD1cIk0zIDE3YzQtMSA3LTYgOS05czUtMyA5LTJcIi8+PC9zdmc+O1xuICAgIGlmIChraW5kID09PSAnbG9jYXRpb24nKSByZXR1cm4gPHN2ZyB3aWR0aD1cIjIyXCIgaGVpZ2h0PVwiMjJcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgey4uLnN0cm9rZX0+PHBhdGggZD1cIk0xMiAyMnMtNy02LjQtNy0xMmE3IDcgMCAxIDEgMTQgMGMwIDUuNi03IDEyLTcgMTJ6XCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTBcIiByPVwiMi41XCIvPjwvc3ZnPjtcbiAgICBpZiAoa2luZCA9PT0gJ2xhbmd1YWdlJykgcmV0dXJuIDxzdmcgd2lkdGg9XCIyMlwiIGhlaWdodD1cIjIyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHsuLi5zdHJva2V9PjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiOVwiLz48cGF0aCBkPVwiTTMgMTJoMThNMTIgM2ExNCAxNCAwIDAgMSAwIDE4TTEyIDNhMTQgMTQgMCAwIDAgMCAxOFwiLz48L3N2Zz47XG4gICAgaWYgKGtpbmQgPT09ICdwbHVnaW5zJykgIHJldHVybiA8c3ZnIHdpZHRoPVwiMjJcIiBoZWlnaHQ9XCIyMlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB7Li4uc3Ryb2tlfT48cGF0aCBkPVwiTTkgM3Y2TTE1IDN2NlwiLz48cGF0aCBkPVwiTTUgOWgxNHY2YTQgNCAwIDAgMS00IDRoLTF2M005IDE5djNcIi8+PC9zdmc+O1xuICAgIHJldHVybiBudWxsO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBQc3kgQ2hhcnQgU2V0dGluZyAtLSBGVUxMIFBBR0UsIGxpdmUgc2tlbGV0b24gcmVzcG9uZHMgdG8gY29udHJvbHNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIFBzeUNoYXJ0U2V0dGluZ1BhZ2UoeyBjZmcsIHNldENmZywgb25CYWNrLCBvblNhdmUgfSkge1xuICAgIGNvbnN0IHVwZGF0ZSA9IChrLCB2KSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIFtrXTp2fSkpO1xuXG4gICAgLyogT24gbW91bnQ6IGh5ZHJhdGUgZnJvbSB0aGUgU0FNRSBsb2NhbFN0b3JhZ2Uga2V5IHRoZSBkYXNoYm9hcmQgcmVhZHNcbiAgICAgKiAoYHJlZDVfc3dlZXRfc3BvdF9yYW5nZWApIHBsdXMgdGhlIHByZXNldCBpZCAoYHJlZDVfcmhfcHJlc2V0YCkgc29cbiAgICAgKiB0aGUgZHJvcGRvd24gbGFiZWwgc3RheXMgY29uc2lzdGVudCB3aXRoIHRoZSBzbGlkZXIgdmFsdWVzIGFjcm9zc1xuICAgICAqIHJlbG9hZHMuICBJZiB0aGUgb3BlcmF0b3IgaGFzIGFscmVhZHkgdHVuZWQgdGhlIFJIIGJhbmQgb24gdGhlXG4gICAgICogZGFzaGJvYXJkLCB0aGUgc2V0dXAgd2FsayBzdGFydHMgZnJvbSB0aG9zZSB2YWx1ZXMuICovXG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJhdyAgICA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWQ1X3N3ZWV0X3Nwb3RfcmFuZ2UnKTtcbiAgICAgICAgICAgIGNvbnN0IHByZXNldCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWQ1X3JoX3ByZXNldCcpO1xuICAgICAgICAgICAgY29uc3QgcGF0Y2ggID0ge307XG4gICAgICAgICAgICBpZiAocmF3KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcCA9IEpTT04ucGFyc2UocmF3KTtcbiAgICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHAubG8pICYmIE51bWJlci5pc0Zpbml0ZShwLmhpKSAmJiBwLmxvIDwgcC5oaSkge1xuICAgICAgICAgICAgICAgICAgICBwYXRjaC5yaExvID0gcC5sbztcbiAgICAgICAgICAgICAgICAgICAgcGF0Y2gucmhIaSA9IHAuaGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByZXNldCAmJiBSSF9QUkVTRVRTLmZpbmQoeCA9PiB4LmlkID09PSBwcmVzZXQpKSB7XG4gICAgICAgICAgICAgICAgcGF0Y2gucmhQcmVzZXQgPSBwcmVzZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBUaGVtZSArIGJyaWdodG5lc3Mg4oCUIHNhbWUga2V5cyBhcHAuanMgKGRhc2hib2FyZCkgcmVhZHMuICovXG4gICAgICAgICAgICBjb25zdCB0aCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWQ1LnRoZW1lJyk7XG4gICAgICAgICAgICBpZiAodGggPT09ICdsaWdodCcgfHwgdGggPT09ICdkYXJrJykgcGF0Y2gudGhlbWUgPSB0aDtcbiAgICAgICAgICAgIGNvbnN0IGRsID0gcGFyc2VGbG9hdChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVkNS5kYXJrTGV2ZWwnKSk7XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGRsKSAmJiBkbCA+PSAxLjUgJiYgZGwgPD0gMy4wKSBwYXRjaC5kYXJrTGV2ZWwgPSBkbDtcbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhwYXRjaCkubGVuZ3RoKSBzZXRDZmcoYyA9PiAoey4uLmMsIC4uLnBhdGNofSkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IC8qIGlnbm9yZSAqLyB9XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xuICAgIH0sIFtdKTtcblxuICAgIC8qIE9uIHNhdmU6IHBlcnNpc3QgdGhlIFJIIGJhbmQgdG8gbG9jYWxTdG9yYWdlIHNvIHRoZSBkYXNoYm9hcmQnc1xuICAgICAqIHN3ZWV0LXNwb3QgcG9seWdvbiBwaWNrcyBpdCB1cCBvbiBuZXh0IGxvYWQuICBBbHNvIHBlcnNpc3QgdGhlIHZlbnVlXG4gICAgICogcHJlc2V0IGlkIChmb3IgZnV0dXJlIFwic2hvdyBwcmVzZXQgbmFtZSBvbiBkYXNoYm9hcmRcIiBmZWF0dXJlcykuICovXG4gICAgY29uc3QgcGVyc2lzdEFuZFNhdmUgPSAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNV9zd2VldF9zcG90X3JhbmdlJyxcbiAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh7IGxvOiBjZmcucmhMbywgaGk6IGNmZy5yaEhpIH0pKTtcbiAgICAgICAgICAgIGlmIChjZmcucmhQcmVzZXQpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNV9yaF9wcmVzZXQnLCBjZmcucmhQcmVzZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogVGhlbWUgKyBicmlnaHRuZXNzIOKAlCB3cml0dGVuIHRvIHRoZSBTQU1FIGtleXMgdGhlIGRhc2hib2FyZFxuICAgICAgICAgICAgICogKGFwcC5qcyBsaW5lcyA1Ny01OCBhbmQgODQtOTcpIHJlYWRzIGFzIGl0cyB1c2VTdGF0ZSBsYXp5XG4gICAgICAgICAgICAgKiBpbml0aWFsaXNlciwgc28gdGhlIGNob3NlbiB0aGVtZSB0YWtlcyBlZmZlY3Qgb24gbmV4dCBkYXNoYm9hcmRcbiAgICAgICAgICAgICAqIGxvYWQuICBhcHAuanMgdHJlYXRzIGRhcmtMZXZlbCA+PSAzLjAgYXMgbGlnaHQtbW9kZSB0cmlnZ2VyLiAqL1xuICAgICAgICAgICAgaWYgKGNmZy50aGVtZSA9PT0gJ2xpZ2h0JyB8fCBjZmcudGhlbWUgPT09ICdkYXJrJykge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1LnRoZW1lJywgY2ZnLnRoZW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUoY2ZnLmRhcmtMZXZlbCkpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS5kYXJrTGV2ZWwnLCBTdHJpbmcoY2ZnLmRhcmtMZXZlbCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdyNS1yaC1iYW5kLWNoYW5nZScsIHtcbiAgICAgICAgICAgICAgICBkZXRhaWw6IHsgbG86IGNmZy5yaExvLCBoaTogY2ZnLnJoSGkgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdbc2V0dXAgd2Fsa10gcHN5IGNoYXJ0IHNhdmVkIC0+IFJIJywgY2ZnLnJoTG8sICctJywgY2ZnLnJoSGksICclICBwcmVzZXQ9JywgY2ZnLnJoUHJlc2V0KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdbc2V0dXAgd2Fsa10gY291bGQgbm90IHBlcnNpc3QgcHN5IHNldHRpbmdzOicsIGUpO1xuICAgICAgICB9XG4gICAgICAgIG9uU2F2ZSgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1pbi1oLXNjcmVlbiBmbGV4IGZsZXgtY29sXCI+XG4gICAgICAgICAgICB7LyogaGVhZGVyICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcHgtNiBweS00IGJvcmRlci1iIGJvcmRlci1zbGF0ZS04MDBcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQmFja31cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNDAwIGhvdmVyOnRleHQtd2hpdGUgdGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2tcIj5cbiAgICAgICAgICAgICAgICAgICAg4oaQIEJhY2sgdG8gc2V0dXBcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwidGV4dC1zbSB1cHBlcmNhc2UgdHJhY2tpbmctWzAuM2VtXSBmb250LWJsYWNrIHRleHQtaW5kaWdvLTQwMFwiPlBzeSBDaGFydCBTZXR0aW5nPC9oMT5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3BlcnNpc3RBbmRTYXZlfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtNSBweS0yIHJvdW5kZWQtbGcgYmctaW5kaWdvLTYwMCBob3ZlcjpiZy1pbmRpZ28tNTAwIHRleHQtd2hpdGUgdGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2tcIj5cbiAgICAgICAgICAgICAgICAgICAgU2F2ZSAmIHJldHVybiDinJNcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogYm9keSDigJQgY2hhcnQgbGVmdCwgY29udHJvbHMgcmlnaHQgKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMSBncmlkIGdyaWQtY29scy0xIGxnOmdyaWQtY29scy1bMWZyXzM2MHB4XSBnYXAtNCBwLTYgbWF4LXctN3hsIG14LWF1dG8gdy1mdWxsXCI+XG4gICAgICAgICAgICAgICAgPFBzeVNrZWxldG9uIGNmZz17Y2ZnfSAvPlxuICAgICAgICAgICAgICAgIDxQc3lDb250cm9sUGFuZWwgY2ZnPXtjZmd9IHVwZGF0ZT17dXBkYXRlfSBzZXRDZmc9e3NldENmZ30gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG4vKiBSSCBiYW5kIHByZXNldHMg4oCUIHJlY29nbmlzZWQgaW5kdXN0cnkgc3RhbmRhcmRzIGZvciBlYWNoIHZlbnVlIHR5cGUuXG4gKiBTb3VyY2VzOiBBU0hSQUUgNTUgKGNvbWZvcnQpLCBBU0hSQUUgMTcwIChoZWFsdGhjYXJlKSxcbiAqIEFBTS9OUFMvU21pdGhzb25pYW4gZ3VpZGFuY2UgKGNvbGxlY3Rpb25zKSwgQ0lCU0UgVE00MCAobGlicmFyaWVzKS4gKi9cbmNvbnN0IFJIX1BSRVNFVFMgPSBbXG4gICAgeyBpZDonY3VzdG9tJywgICAgICAgICAgbGFiZWw6J0N1c3RvbSAobWFudWFsKScsICAgICAgICAgICAgICAgICBsbzpudWxsLCBoaTpudWxsLCBub3RlOicnIH0sXG4gICAgeyBpZDonb2ZmaWNlJywgICAgICAgICAgbGFiZWw6J09mZmljZScsICAgICAgICAgICAgICAgICAgICAgICAgICBsbzozMCwgICBoaTo2MCwgICBub3RlOidBU0hSQUUgNTUgY29tZm9ydCcgICAgICAgICAgICAgICAgICB9LFxuICAgIHsgaWQ6J211c2V1bScsICAgICAgICAgIGxhYmVsOidNdXNldW0nLCAgICAgICAgICAgICAgICAgICAgICAgICAgbG86NDAsICAgaGk6NTUsICAgbm90ZTonQUFNIGNvbGxlY3Rpb24gcHJlc2VydmF0aW9uJyAgICAgICAgfSxcbiAgICB7IGlkOidob3RlbCcsICAgICAgICAgICBsYWJlbDonSG90ZWwgZ3Vlc3Qgcm9vbScsICAgICAgICAgICAgICAgIGxvOjMwLCAgIGhpOjYwLCAgIG5vdGU6J2dlbmVyYWwgb2NjdXBhbnQgY29tZm9ydCcgICAgICAgICAgIH0sXG4gICAgeyBpZDonbGlicmFyeScsICAgICAgICAgbGFiZWw6J0xpYnJhcnkgLyBBcmNoaXZlJywgICAgICAgICAgICAgICBsbzo0MCwgICBoaTo1NSwgICBub3RlOidwYXBlciAmIGJpbmRpbmcgcHJlc2VydmF0aW9uJyAgICAgICB9LFxuICAgIHsgaWQ6J2hvc3BpdGFsJywgICAgICAgIGxhYmVsOidIb3NwaXRhbCAoZ2VuZXJhbCknLCAgICAgICAgICAgICAgbG86MzAsICAgaGk6NjAsICAgbm90ZTonQVNIUkFFIDE3MCBwYXRpZW50IGFyZWFzJyAgICAgICAgICAgfSxcbiAgICB7IGlkOidsZWN0dXJlJywgICAgICAgICBsYWJlbDonTGVjdHVyZSBoYWxsJywgICAgICAgICAgICAgICAgICAgIGxvOjMwLCAgIGhpOjYwLCAgIG5vdGU6J2hpZ2ggb2NjdXBhbmN5IGNvbWZvcnQnICAgICAgICAgICAgIH0sXG4gICAgeyBpZDonY29uY2VydCcsICAgICAgICAgbGFiZWw6J0NvbmNlcnQgaGFsbCcsICAgICAgICAgICAgICAgICAgICBsbzo0MCwgICBoaTo1NSwgICBub3RlOidpbnN0cnVtZW50IHR1bmluZyBzdGFiaWxpdHknICAgICAgICB9LFxuICAgIHsgaWQ6J21lZXRpbmcnLCAgICAgICAgIGxhYmVsOidNZWV0aW5nIHJvb20nLCAgICAgICAgICAgICAgICAgICAgbG86MzAsICAgaGk6NjAsICAgbm90ZTonc21hbGwgZ3JvdXAgY29tZm9ydCcgICAgICAgICAgICAgICAgfSxcbiAgICB7IGlkOidleGhpYml0aW9uJywgICAgICBsYWJlbDonRXhoaWJpdGlvbiBoYWxsJywgICAgICAgICAgICAgICAgIGxvOjQwLCAgIGhpOjU1LCAgIG5vdGU6J21peGVkIGFydCAvIGFydGlmYWN0IGRpc3BsYXknICAgICAgIH0sXG5dO1xuXG4vKiBSZWFsIHBzeSBjaGFydCDigJQgdXNlcyB0aGUgU0FNRSBnZXRXICsgR0lWT05JX0NPTE9SUyArIHBvbHlnb24gbWF0aCBhcyB0aGVcbiAqIHByb2R1Y3Rpb24gZGFzaGJvYXJkLiAgU291cmNlIG9mIHRydXRoOiAganMvcHN5Y2hyb21ldHJpYy5qcyAgYW5kIHRoZVxuICogcmVuZGVyR2l2b25pT3ZlcmxheSgpIGJsb2NrIGF0IGFwcC5qczoxNjQxLTE3MjIuXG4gKiBBbnl0aGluZyB5b3UgY2hhbmdlIGluIHRob3NlIGZpbGVzIE1VU1QgYmUgbWlycm9yZWQgaGVyZS4gKi9cbmZ1bmN0aW9uIFBzeVNrZWxldG9uKHsgY2ZnIH0pIHtcbiAgICAvKiBDYW52YXMgKyBwYWRkaW5nICovXG4gICAgY29uc3QgVyA9IDc2MCwgSCA9IDQ4MDtcbiAgICBjb25zdCBwYWQgPSB7IGxlZnQ6IDU2LCByaWdodDogNDAsIHRvcDogMjgsIGJvdHRvbTogNTYgfTtcbiAgICBjb25zdCBncmlkVyA9IFcgLSBwYWQubGVmdCAtIHBhZC5yaWdodDtcbiAgICBjb25zdCBncmlkSCA9IEggLSBwYWQudG9wICAtIHBhZC5ib3R0b207XG5cbiAgICBjb25zdCBUX01JTiA9IGNmZy50TG8sIFRfTUFYID0gY2ZnLnRIaTtcbiAgICBjb25zdCBXX01JTiA9IDAsICAgICAgIFdfTUFYID0gMC4wMzA7ICAgICAgICAgIC8vIGtnL2tnXG5cbiAgICAvKiBheGlzIHNjYWxlcyAtLSBtYXRjaCB0aGUgbGl2ZSBkYXNoYm9hcmQgKi9cbiAgICBjb25zdCB4ICA9ICh0KSA9PiBwYWQubGVmdCArICgodCAtIFRfTUlOKSAvIChUX01BWCAtIFRfTUlOKSkgKiBncmlkVztcbiAgICBjb25zdCB5ICA9ICh3KSA9PiBwYWQudG9wICArICgxIC0gKHcgLSBXX01JTikgLyAoV19NQVggLSBXX01JTikpICogZ3JpZEg7XG4gICAgY29uc3QgX2dldFcgPSAodHlwZW9mIGdldFcgPT09ICdmdW5jdGlvbicpID8gZ2V0VyA6ICgodCwgcmgpID0+IDApO1xuXG4gICAgY29uc3Qgc2FmZVB0cyA9IChhcnIpID0+IGFyci5tYXAocCA9PiBgJHsoeChwWzBdKXx8MCkudG9GaXhlZCgyKX0sJHsoeShwWzFdKXx8MCkudG9GaXhlZCgyKX1gKS5qb2luKCcgJyk7XG5cbiAgICAvKiAtLS0tIEdpdm9uaSBwb2x5Z29ucyAtLSBDT1BJRUQgVkVSQkFUSU0gZnJvbSBhcHAuanM6MTY0My0xNjY5IC0tLS0gKi9cbiAgICBjb25zdCByaDgwID0gW107IGZvciAobGV0IHQ9MjA7IHQ8PTI1OyB0Kz0wLjUpIHJoODAucHVzaChbdCwgX2dldFcodCwgODApXSk7XG4gICAgY29uc3QgcmgxMDA9IFtdOyBmb3IgKGxldCB0PTIwOyB0PD0yNzsgdCs9MC41KSByaDEwMC5wdXNoKFt0LCBfZ2V0Vyh0LCAxMDApXSk7XG4gICAgY29uc3QgcmgyMExpbmUgPSBbXTsgZm9yIChsZXQgdD0zMjsgdD49MjA7IHQtPTAuNSkgcmgyMExpbmUucHVzaChbdCwgX2dldFcodCwgMjApXSk7XG4gICAgY29uc3QgcmgyMF9DWiAgPSBbXTsgZm9yIChsZXQgdD0yNzsgdD49MjA7IHQtPTAuNSkgcmgyMF9DWi5wdXNoKFt0LCBfZ2V0Vyh0LCAyMCldKTtcbiAgICBjb25zdCBDWiAgID0gWy4uLnJoODAsIFsyNywgX2dldFcoMjcsIDUwKV0sIFsyNywgX2dldFcoMjcsIDIwKV0sIC4uLnJoMjBfQ1pdO1xuXG4gICAgY29uc3QgcmhIaV90b3AgPSBbXTsgZm9yIChsZXQgdHQ9MjA7IHR0PD0yNzsgdHQrPTAuNSkgcmhIaV90b3AucHVzaChbdHQsIF9nZXRXKHR0LCBjZmcucmhIaSldKTtcbiAgICBjb25zdCByaExvX2JvdCA9IFtdOyBmb3IgKGxldCB0dD0yNzsgdHQ+PTIwOyB0dC09MC41KSByaExvX2JvdC5wdXNoKFt0dCwgX2dldFcodHQsIGNmZy5yaExvKV0pO1xuICAgIGNvbnN0IFNXRUVUID0gWy4uLnJoSGlfdG9wLCAuLi5yaExvX2JvdF07XG5cbiAgICBjb25zdCBOViAgID0gWy4uLnJoMTAwLCBbMzIsIDE1LjQvMTAwMF0sIFszMiwgNi4yLzEwMDBdLCAuLi5yaDIwTGluZV07XG4gICAgY29uc3QgTWFzcyA9IFsuLi5yaDgwLCBbMzMsIDE2LzEwMDBdLCBbMzcsIF9nZXRXKDM3LCAzMCldLCBbMzcsIDMvMTAwMF0sIFsyMCwgX2dldFcoMjAsIDIwKV1dO1xuICAgIGNvbnN0IE1DViAgPSBbLi4ucmg4MCwgWzQwLCAxNi8xMDAwXSwgWzQ0LCBfZ2V0Vyg0NCwgMjApXSwgWzQ0LCAzLzEwMDBdLCBbMjAsIF9nZXRXKDIwLCAyMCldXTtcbiAgICBjb25zdCBFVkFQID0gWy4uLnJoODAsIFsyNSwgMTYvMTAwMF0sIFszNiwgX2dldFcoMzYsIDMwKV0sIFszOSwgX2dldFcoMzksIDIwKV0sXG4gICAgICAgICAgICAgICAgICBbNDEsIF9nZXRXKDQxLCAxMCldLCBbNDEsIDBdLCBbMjcuMiwgMF0sIFsyMCwgX2dldFcoMjAsIDIwKV1dO1xuXG4gICAgY29uc3Qgd2ludGVyUkg4MCA9IFtdOyBmb3IgKGxldCB0PTE4OyB0PD0xOS41OyB0Kz0wLjUpIHdpbnRlclJIODAucHVzaChbdCwgX2dldFcodCwgODApXSk7XG4gICAgY29uc3Qgd2ludGVyUkgyMCA9IFtdOyBmb3IgKGxldCB0PTE5LjU7IHQ+PTE4OyB0LT0wLjUpIHdpbnRlclJIMjAucHVzaChbdCwgX2dldFcodCwgMjApXSk7XG4gICAgY29uc3QgV0lOVEVSID0gWy4uLndpbnRlclJIODAsIC4uLndpbnRlclJIMjBdO1xuXG4gICAgLyogUkggaXNvcGxldGggY3VydmVzIGZvciB0aGUgY2hhcnQgZ3JpZCAqL1xuICAgIGNvbnN0IGlzb3BsZXRocyA9IFsyMCwgNDAsIDYwLCA4MCwgMTAwXTtcblxuICAgIC8qIFRoZW1lIHBhbGV0dGUg4oCUIGRyaXZlcyB0aGUgbGl2ZSBwcmV2aWV3IHNvIHRoZSBkaW0vbGlnaHQgY29udHJvbHNcbiAgICAgKiBoYXZlIHZpc2libGUgZmVlZGJhY2sgcmlnaHQgb24gdGhlIGNoYXJ0LiAgSW4gZGltL2RhcmsgbW9kZSB3ZSBhbHNvXG4gICAgICogYXBwbHkgYSBDU1MgYnJpZ2h0bmVzcyBmaWx0ZXIgbWFwcGVkIGZyb20gY2ZnLmRhcmtMZXZlbCAoMS41IC4uIDIuOFxuICAgICAqIOKGkiAwLjYgLi4gMS40KSBzbyB0aGUgdXNlciBjYW4gU0VFIHRoZSBicmlnaHRuZXNzIHNsaWRlciB3b3JraW5nLiAqL1xuICAgIGNvbnN0IGlzTGlnaHQgPSBjZmcudGhlbWUgPT09ICdsaWdodCc7XG4gICAgY29uc3QgcGFsZXR0ZSA9IGlzTGlnaHRcbiAgICAgICAgPyB7IGJnOicjZjhmYWZjJywgZ3JpZDonI2NiZDVlMScsIHRpY2s6JyM0NzU1NjknLCBheGlzOicjMWUyOTNiJyxcbiAgICAgICAgICAgIHBhbmVsQmc6J3JnYmEoMjQ4LDI1MCwyNTIsMC44NSknLCBwYW5lbEJvcmRlcjonI2NiZDVlMScsXG4gICAgICAgICAgICBwaWxsQmc6JyNlMmU4ZjAnLCBwaWxsRmc6JyM0NzU1NjknLCBtZXRhRmc6JyM2NDc0OGInIH1cbiAgICAgICAgOiB7IGJnOicjMGIxMjIwJywgZ3JpZDonIzFlMjkzYicsIHRpY2s6JyM5NGEzYjgnLCBheGlzOicjY2JkNWUxJyxcbiAgICAgICAgICAgIHBhbmVsQmc6J3JnYmEoMTUsMjMsNDIsMC42KScsIHBhbmVsQm9yZGVyOicjMWUyOTNiJyxcbiAgICAgICAgICAgIHBpbGxCZzonIzFlMjkzYicsIHBpbGxGZzonIzk0YTNiOCcsIG1ldGFGZzonIzY0NzQ4YicgfTtcbiAgICBjb25zdCBkaW1GaWx0ZXIgPSBpc0xpZ2h0XG4gICAgICAgID8gJ25vbmUnXG4gICAgICAgIDogYGJyaWdodG5lc3MoJHsoTWF0aC5tYXgoMS41LCBNYXRoLm1pbigyLjgsIGNmZy5kYXJrTGV2ZWwgfHwgMi4wKSkgLyAyLjApLnRvRml4ZWQoMil9KWA7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdW5kZWQtMnhsIHAtNCBib3JkZXIgdHJhbnNpdGlvbi1jb2xvcnMgZHVyYXRpb24tMzAwXCJcbiAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6IHBhbGV0dGUucGFuZWxCZywgYm9yZGVyQ29sb3I6IHBhbGV0dGUucGFuZWxCb3JkZXJ9fT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIG1iLTNcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJwaWxsXCIgc3R5bGU9e3tiYWNrZ3JvdW5kOnBhbGV0dGUucGlsbEJnLCBjb2xvcjpwYWxldHRlLnBpbGxGZ319PlBTWUNIUk9NRVRSSUMgQ0hBUlQgwrcgbGl2ZSBwcmV2aWV3PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIGZvbnQtbW9ub1wiIHN0eWxlPXt7Y29sb3I6cGFsZXR0ZS5tZXRhRmd9fT57VF9NSU59wrBDIOKGkiB7VF9NQVh9wrBDICDCtyAge2NmZy5yaExvfeKAk3tjZmcucmhIaX0lIFJIPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8c3ZnIHZpZXdCb3g9e2AwIDAgJHtXfSAke0h9YH0gY2xhc3NOYW1lPVwidy1mdWxsIGgtYXV0byB0cmFuc2l0aW9uLVtmaWx0ZXJdIGR1cmF0aW9uLTMwMFwiXG4gICAgICAgICAgICAgICAgIHN0eWxlPXt7YmFja2dyb3VuZDogcGFsZXR0ZS5iZywgYm9yZGVyUmFkaXVzOjgsIGZpbHRlcjogZGltRmlsdGVyfX0+XG4gICAgICAgICAgICAgICAgey8qIC0tLS0gZ3JpZDogdmVydGljYWwgVCBsaW5lcywgaG9yaXpvbnRhbCBXIGxpbmVzIC0tLS0gKi99XG4gICAgICAgICAgICAgICAge0FycmF5LmZyb20oe2xlbmd0aDoxMX0pLm1hcCgoXyxpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBUX01JTiArIChpLzEwKSAqIChUX01BWCAtIFRfTUlOKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxnIGtleT17J3Z0JytpfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17eCh0KX0geTE9e3BhZC50b3B9IHgyPXt4KHQpfSB5Mj17cGFkLnRvcCtncmlkSH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9e3BhbGV0dGUuZ3JpZH0gc3Ryb2tlV2lkdGg9XCIwLjZcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCh0KX0geT17cGFkLnRvcCtncmlkSCsxNn0gZm9udFNpemU9XCI5LjVcIiBmaWxsPXtwYWxldHRlLnRpY2t9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiPnt0LnRvRml4ZWQoMCl9PC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIHtBcnJheS5mcm9tKHtsZW5ndGg6N30pLm1hcCgoXyxpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHcgPSBXX01JTiArIChpLzYpICogKFdfTUFYIC0gV19NSU4pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGcga2V5PXsnaHcnK2l9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXtwYWQubGVmdH0geTE9e3kodyl9IHgyPXtwYWQubGVmdCtncmlkV30geTI9e3kodyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPXtwYWxldHRlLmdyaWR9IHN0cm9rZVdpZHRoPVwiMC42XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3BhZC5sZWZ0LTh9IHk9e3kodykrM30gZm9udFNpemU9XCI5LjVcIiBmaWxsPXtwYWxldHRlLnRpY2t9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cImVuZFwiPnsodyoxMDAwKS50b0ZpeGVkKDApfTwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICB7LyogLS0tLSBSSCBpc29wbGV0aHMgKGN1cnZlcykgLS0tLSAqL31cbiAgICAgICAgICAgICAgICB7aXNvcGxldGhzLm1hcChyaCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHB0cyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB0ID0gVF9NSU47IHQgPD0gVF9NQVg7IHQgKz0gMC41KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB3dyA9IF9nZXRXKHQsIHJoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3dyA+PSBXX01JTiAmJiB3dyA8PSBXX01BWCkgcHRzLnB1c2goW3QsIHd3XSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxnIGtleT17J2lzbycrcmh9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5bGluZSBwb2ludHM9e3NhZmVQdHMocHRzKX0gZmlsbD1cIm5vbmVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9e3JoID09PSAxMDAgPyAnIzYzNjZmMScgOiAnI2VjNDg5OTU1J30gc3Ryb2tlV2lkdGg9XCIwLjhcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2VEYXNoYXJyYXk9e3JoID09PSAxMDAgPyAnJyA6ICczLDMnfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3B0cy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eChwdHNbTWF0aC5mbG9vcihwdHMubGVuZ3RoKjAuNjUpXVswXSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk9e3kocHRzW01hdGguZmxvb3IocHRzLmxlbmd0aCowLjY1KV1bMV0pIC0gNH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU9XCI5XCIgZmlsbD1cIiNlYzQ4OTk5OVwiIGZvbnRXZWlnaHQ9XCI3MDBcIj57cmh9JTwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pfVxuXG4gICAgICAgICAgICAgICAgey8qIC0tLS0gR2l2b25pIG92ZXJsYXkgKGNvcGllZCB2ZXJiYXRpbSBmcm9tIGFwcC5qcyByZW5kZXIgb3JkZXIpIC0tLS0gKi99XG4gICAgICAgICAgICAgICAge2NmZy5naXZvbmkgJiYgKFxuICAgICAgICAgICAgICAgICAgICA8ZyBjbGFzc05hbWU9XCJwb2ludGVyLWV2ZW50cy1ub25lXCIgb3BhY2l0eT1cIjAuOVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3goNDApfSB5MT17eSgxNi8xMDAwKX0geDI9e3goNTApfSB5Mj17eSgxNi8xMDAwKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cIiM2MzY2ZjFcIiBzdHJva2VXaWR0aD1cIjEuNVwiIHN0cm9rZURhc2hhcnJheT1cIjQsNFwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXt4KDUwKX0geTE9e3koMTYvMTAwMCl9IHgyPXt4KDUwKX0geTI9e3koMCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCIjNjM2NmYxXCIgc3Ryb2tlV2lkdGg9XCIxLjVcIiBzdHJva2VEYXNoYXJyYXk9XCI0LDRcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17eCg0MSl9IHkxPXt5KDApfSB4Mj17eCg1MCl9IHkyPXt5KDApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiIzYzNjZmMVwiIHN0cm9rZVdpZHRoPVwiMS41XCIgc3Ryb2tlRGFzaGFycmF5PVwiNCw0XCIvPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoTUNWKX0gIGZpbGw9XCIjZWM0ODk5XCIgZmlsbE9wYWNpdHk9XCIwLjA1XCIgc3Ryb2tlPVwiI2VjNDg5OVwiIHN0cm9rZVdpZHRoPVwiMVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhNYXNzKX0gZmlsbD1cIiM4YjVjZjZcIiBmaWxsT3BhY2l0eT1cIjAuMDVcIiBzdHJva2U9XCIjOGI1Y2Y2XCIgc3Ryb2tlV2lkdGg9XCIxXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKEVWQVApfSBmaWxsPVwiIzA2YjZkNFwiIGZpbGxPcGFjaXR5PVwiMC4wOFwiIHN0cm9rZT1cIiMwNmI2ZDRcIiBzdHJva2VXaWR0aD1cIjFcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoTlYpfSAgIGZpbGw9XCIjZjU5ZTBiXCIgZmlsbE9wYWNpdHk9XCIwLjA1XCIgc3Ryb2tlPVwiI2Y1OWUwYlwiIHN0cm9rZVdpZHRoPVwiMVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhDWil9ICAgZmlsbD1cIiMxMGI5ODFcIiBmaWxsT3BhY2l0eT1cIjAuMTVcIiBzdHJva2U9XCIjMTBiOTgxXCIgc3Ryb2tlV2lkdGg9XCIxLjJcIi8+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBTd2VldC1zcG90IGJhbmQsIGNsaXBwZWQgdG8gQ1ogKi99XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGVmcz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y2xpcFBhdGggaWQ9XCJjei1jbGlwLXdhbGtcIiBjbGlwUGF0aFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKENaKX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvY2xpcFBhdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2RlZnM+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoU1dFRVQpfSBjbGlwUGF0aD1cInVybCgjY3otY2xpcC13YWxrKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxsPVwiIzA1OTY2OVwiIGZpbGxPcGFjaXR5PVwiMC4zMlwiIHN0cm9rZT1cIiMwNDc4NTdcIiBzdHJva2VXaWR0aD1cIjAuOFwiIHN0cm9rZURhc2hhcnJheT1cIjMsMlwiLz5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKFdJTlRFUil9IGZpbGw9XCIjM2I4MmY2XCIgZmlsbE9wYWNpdHk9XCIwLjE1XCIgc3Ryb2tlPVwibm9uZVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXt4KDE5KX0geTE9e3BhZC50b3ArMTh9IHgyPXt4KDE5KX0geTI9e3BhZC50b3ArZ3JpZEh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCIjM2I4MmY2XCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlRGFzaGFycmF5PVwiNiw0XCIgb3BhY2l0eT1cIjAuOFwiLz5cblxuICAgICAgICAgICAgICAgICAgICAgICAgey8qIFJlZ2lvbiBsYWJlbHMg4oCUIHNhbWUgY29sb3JzICYgc3Bpcml0IGFzIGxpdmUgY2hhcnQgKi99XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDUwKS0xMH0geT17eSg4LzEwMDApfSBmaWxsPVwiIzYzNjZmMVwiIGZvbnRTaXplPVwiMTBcIiBmb250V2VpZ2h0PVwiOTAwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiB0cmFuc2Zvcm09e2Byb3RhdGUoLTkwLCAke3goNTApLTEwfSwgJHt5KDgvMTAwMCl9KWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nPVwiMlwiPk1FQ0hBTklDQUwgQ09PTElORzwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goNDQpLTJ9IHk9e3koOC8xMDAwKX0gZmlsbD1cIiNlYzQ4OTlcIiBmb250U2l6ZT1cIjlcIiBmb250V2VpZ2h0PVwiOTAwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiB0cmFuc2Zvcm09e2Byb3RhdGUoLTkwLCAke3goNDQpLTJ9LCAke3koOC8xMDAwKX0pYH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc9XCIxLjVcIj5NQVNTIENPT0xJTkc8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDM3KS0xMH0geT17eSg4LzEwMDApfSBmaWxsPVwiIzhiNWNmNlwiIGZvbnRTaXplPVwiOVwiIGZvbnRXZWlnaHQ9XCI5MDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIHRyYW5zZm9ybT17YHJvdGF0ZSgtOTAsICR7eCgzNyktMTB9LCAke3koOC8xMDAwKX0pYH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc9XCIxLjVcIj5NQVNTIENPT0xJTkc8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDM0KX0geT17eSgwLjUvMTAwMCktOH0gZmlsbD1cIiMwNmI2ZDRcIiBmb250U2l6ZT1cIjlcIiBmb250V2VpZ2h0PVwiOTAwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiBsZXR0ZXJTcGFjaW5nPVwiMlwiPkVWQVBPUkFUSVZFPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCgyMy41KX0geT17eShfZ2V0VygyMy41LCA0NSkpfSBmaWxsPVwiIzEwYjk4MVwiIGZvbnRTaXplPVwiMTFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodD1cIjkwMFwiIHRleHRBbmNob3I9XCJtaWRkbGVcIiBsZXR0ZXJTcGFjaW5nPVwiMS41XCI+Q09NRk9SVDwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goMTguNzUpfSB5PXt5KF9nZXRXKDE4Ljc1LCA0NSkpfSBmaWxsPVwiIzNiODJmNlwiIGZvbnRTaXplPVwiMTFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodD1cIjkwMFwiIHRleHRBbmNob3I9XCJtaWRkbGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtPXtgcm90YXRlKC05MCwgJHt4KDE4Ljc1KX0sICR7eShfZ2V0VygxOC43NSwgNDUpKX0pYH0+V0lOVEVSPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCgyMy41KX0geT17eShfZ2V0VygyMy41LCAoY2ZnLnJoTG8rY2ZnLnJoSGkpLzIpKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw9XCIjMDIyYzIyXCIgZm9udFNpemU9XCI4XCIgZm9udFdlaWdodD1cIjkwMFwiIHRleHRBbmNob3I9XCJtaWRkbGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3twYWludE9yZGVyOidzdHJva2UnLCBzdHJva2U6JyNhN2YzZDAnLCBzdHJva2VXaWR0aDonMi41cHgnLCBzdHJva2VMaW5lam9pbjoncm91bmQnfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc9XCIxLjVcIj57Y2ZnLnJoTG99LXtjZmcucmhIaX0lIFJIPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAgICAgIHsvKiBheGlzIGxhYmVscyAqL31cbiAgICAgICAgICAgICAgICA8dGV4dCB4PXtwYWQubGVmdCArIGdyaWRXLzJ9IHk9e0gtMTJ9IGZvbnRTaXplPVwiMTFcIiBmaWxsPXtwYWxldHRlLmF4aXN9XG4gICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGZvbnRXZWlnaHQ9XCI4MDBcIiBsZXR0ZXJTcGFjaW5nPVwiMlwiPkRSWSBCVUxCIFRFTVAgKMKwQyk8L3RleHQ+XG4gICAgICAgICAgICAgICAgPHRleHQgeD17MTZ9IHk9e3BhZC50b3AgKyBncmlkSC8yfSBmb250U2l6ZT1cIjExXCIgZmlsbD17cGFsZXR0ZS5heGlzfVxuICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiBmb250V2VpZ2h0PVwiODAwXCIgbGV0dGVyU3BhY2luZz1cIjJcIlxuICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybT17YHJvdGF0ZSgtOTAgMTYgJHtwYWQudG9wICsgZ3JpZEgvMn0pYH0+SFVNSURJVFkgUkFUSU8gKGcva2cpPC90ZXh0PlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbmZ1bmN0aW9uIFBzeUNvbnRyb2xQYW5lbCh7IGNmZywgdXBkYXRlLCBzZXRDZmcgfSkge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctc2xhdGUtOTAwLzYwIGJvcmRlciBib3JkZXItc2xhdGUtODAwIHJvdW5kZWQtMnhsIHAtNSBzcGFjZS15LTZcIj5cbiAgICAgICAgICAgIHsvKiBUaGVtZSArIGJyaWdodG5lc3MgIC0tIHJlbG9jYXRlZCBmcm9tIHRoZSBkYXNoYm9hcmQgc2lkZWJhciAyMDI2LTA2LTI1LlxuICAgICAgICAgICAgICAgIFR3byBjb250cm9sczogRGFyay9MaWdodCBtb2RlIHRvZ2dsZSwgYW5kIEJyaWdodG5lc3Mgc2xpZGVyIChvbmx5XG4gICAgICAgICAgICAgICAgbWVhbmluZ2Z1bCBpbiBkYXJrIG1vZGUpLiAgTGl2ZSBwcmV2aWV3IGFwcGxpZXMgdG8gdGhlIHN1cnJvdW5kaW5nXG4gICAgICAgICAgICAgICAgY29udHJvbCBwYW5lbCBzbyB0aGUgb3BlcmF0b3IgY2FuIEZFRUwgdGhlIGNoYW5nZSBiZWZvcmUgc2F2aW5nLiAqL31cbiAgICAgICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJwc3ktY2ZnLXRoZW1lLWJsb2NrXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0yXCI+RGlzcGxheSBNb2RlPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC0yIG1iLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cInBzeS1jZmctdGhlbWUtZGFya1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0Q2ZnKGMgPT4gKHsuLi5jLCB0aGVtZTonZGFyaycsIGRhcmtMZXZlbDpNYXRoLm1pbihjLmRhcmtMZXZlbCB8fCAyLjAsIDIuNil9KSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHktMi41IHJvdW5kZWQtbGcgdGV4dC14cyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgYm9yZGVyIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Y2ZnLnRoZW1lID09PSAnZGFyaydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLXNsYXRlLTgwMCBib3JkZXIteWVsbG93LTUwMC83MCB0ZXh0LXllbGxvdy0zMDAgc2hhZG93LWxnIHNoYWRvdy15ZWxsb3ctNTAwLzEwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctc2xhdGUtOTAwLzMwIGJvcmRlci1zbGF0ZS03MDAgdGV4dC1zbGF0ZS01MDAgaG92ZXI6Ymctc2xhdGUtODAwLzYwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIPCfjJkgIERpbSAvIERhcmtcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJwc3ktY2ZnLXRoZW1lLWxpZ2h0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIHRoZW1lOidsaWdodCcsIGRhcmtMZXZlbDozLjB9KSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHktMi41IHJvdW5kZWQtbGcgdGV4dC14cyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgYm9yZGVyIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Y2ZnLnRoZW1lID09PSAnbGlnaHQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1zbGF0ZS0xMDAgYm9yZGVyLXNreS01MDAvNzAgdGV4dC1za3ktNzAwIHNoYWRvdy1sZyBzaGFkb3ctc2t5LTUwMC8xMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLXNsYXRlLTkwMC8zMCBib3JkZXItc2xhdGUtNzAwIHRleHQtc2xhdGUtNTAwIGhvdmVyOmJnLXNsYXRlLTgwMC82MCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICDimIAgIExpZ2h0XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIHsvKiBCcmlnaHRuZXNzIHNsaWRlciDigJQgb25seSBtZWFuaW5nZnVsIHdoZW4gdGhlbWUgPT09ICdkYXJrJyAqL31cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y2ZnLnRoZW1lID09PSAnbGlnaHQnID8gJ29wYWNpdHktNDAgcG9pbnRlci1ldmVudHMtbm9uZScgOiAnJ30+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIG1iLTFcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTUwMFwiPkRpbSBicmlnaHRuZXNzPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIGZvbnQtbW9ubyB0ZXh0LXllbGxvdy0zMDAgdGFidWxhci1udW1zXCI+e01hdGgucm91bmQoKGNmZy5kYXJrTGV2ZWwgfHwgMi4wKSAqIDEwMCl9JTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJwc3ktY2ZnLWRhcmstbGV2ZWxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluPVwiMS41XCIgbWF4PVwiMi44XCIgc3RlcD1cIjAuMDJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2NmZy50aGVtZSA9PT0gJ2xpZ2h0JyA/IDIuMCA6IChjZmcuZGFya0xldmVsIHx8IDIuMCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldENmZyhjID0+ICh7Li4uYywgZGFya0xldmVsOiBwYXJzZUZsb2F0KGUudGFyZ2V0LnZhbHVlKSwgdGhlbWU6J2RhcmsnfSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2UtaW5wdXQgdy1mdWxsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGFjY2VudENvbG9yOicjZmFjYzE1JyB9fS8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbXQtMiBpdGFsaWNcIj5cbiAgICAgICAgICAgICAgICAgICAgQXBwbGllZCB0byB0aGUgd2hvbGUgZGFzaGJvYXJkLiAgRGltIGlzIHJlY29tbWVuZGVkIGZvciBjb250cm9sIHJvb21zOyBMaWdodCBmb3IgZGF5dGltZSB3YWxrLXRocm91Z2hzLlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogR2l2b25pIHRvZ2dsZSAqL31cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0yXCI+R2l2b25pIEVuZ2luZTwvZGl2PlxuICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gdXBkYXRlKCdnaXZvbmknLCAhY2ZnLmdpdm9uaSl9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B3LWZ1bGwgcHktMyByb3VuZGVkLXhsIHRleHQtc20gZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2NmZy5naXZvbmlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1pbmRpZ28tNjAwIHRleHQtd2hpdGUgc2hhZG93LWxnIHNoYWRvdy1pbmRpZ28tNTAwLzMwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLXNsYXRlLTgwMCB0ZXh0LXNsYXRlLTQwMCBib3JkZXIgYm9yZGVyLXNsYXRlLTcwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgIHtjZmcuZ2l2b25pID8gJ0dpdm9uaSBPTicgOiAnR2l2b25pIE9GRid9XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbXQtMiBsZWFkaW5nLXJlbGF4ZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgT3ZlcmxheXMgdGhlIDQgY2xpbWF0ZS1zdHJhdGVneSByZWdpb25zIChDb21mb3J0LCBOYXQgVmVudCwgRXZhcCwgTWVjaCBDb29sKS5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIFJIIHJhbmdlICovfVxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj5SSCBTd2VldC1TcG90IFJhbmdlPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi0zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTUwMCBtYi0xIGJsb2NrXCI+VmVudWUgcHJlc2V0PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dCBjdXJzb3ItcG9pbnRlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2NmZy5yaFByZXNldCB8fCAnY3VzdG9tJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcCA9IFJIX1BSRVNFVFMuZmluZChwID0+IHAuaWQgPT09IGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFwKSByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwLmlkID09PSAnY3VzdG9tJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlKCdyaFByZXNldCcsICdjdXN0b20nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgcmhQcmVzZXQ6cC5pZCwgcmhMbzpwLmxvLCByaEhpOnAuaGl9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtSSF9QUkVTRVRTLm1hcChwID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIGtleT17cC5pZH0gdmFsdWU9e3AuaWR9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cC5sYWJlbH17cC5sbyAhPSBudWxsID8gYCAgwrcgICR7cC5sb30tJHtwLmhpfSUgUkhgIDogJyd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgICAgIHsoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcCA9IFJIX1BSRVNFVFMuZmluZCh4ID0+IHguaWQgPT09IChjZmcucmhQcmVzZXQgfHwgJ2N1c3RvbScpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwICYmIHAubm90ZSA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0xLjUgaXRhbGljXCI+e3Aubm90ZX08L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICApIDogbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfSkoKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zIG1iLTJcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyBmb250LW1vbm8gdGV4dC1zbGF0ZS00MDAgdy0xMFwiPntjZmcucmhMb30lPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPVwiMjBcIiBtYXg9e2NmZy5yaEhpLTV9IHZhbHVlPXtjZmcucmhMb31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0Q2ZnKGMgPT4gKHsuLi5jLCByaExvOitlLnRhcmdldC52YWx1ZSwgcmhQcmVzZXQ6J2N1c3RvbSd9KSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyYW5nZS1pbnB1dCBmbGV4LTFcIi8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtM1wiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtbW9ubyB0ZXh0LXNsYXRlLTQwMCB3LTEwXCI+e2NmZy5yaEhpfSU8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49e2NmZy5yaExvKzV9IG1heD1cIjkwXCIgdmFsdWU9e2NmZy5yaEhpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIHJoSGk6K2UudGFyZ2V0LnZhbHVlLCByaFByZXNldDonY3VzdG9tJ30pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLWlucHV0IGZsZXgtMVwiLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogQXhpcyByYW5nZSAqL31cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0yXCI+VGVtcGVyYXR1cmUgQXhpcyBSYW5nZTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTMgbWItMlwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtbW9ubyB0ZXh0LXNsYXRlLTQwMCB3LTEwXCI+e2NmZy50TG99wrA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49XCItNDBcIiBtYXg9e2NmZy50SGktMTB9IHZhbHVlPXtjZmcudExvfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGUoJ3RMbycsICtlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyYW5nZS1pbnB1dCBmbGV4LTFcIi8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtM1wiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtbW9ubyB0ZXh0LXNsYXRlLTQwMCB3LTEwXCI+e2NmZy50SGl9wrA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49e2NmZy50TG8rMTB9IG1heD1cIjYwXCIgdmFsdWU9e2NmZy50SGl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZSgndEhpJywgK2UudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLWlucHV0IGZsZXgtMVwiLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0yIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgICAgICBDaGFydCB3aWxsIGJlIHJlZHJhd24gd2l0aCB0aGlzIGRyeS1idWxiIHRlbXBlcmF0dXJlIHdpbmRvdy5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib3JkZXItdCBib3JkZXItc2xhdGUtODAwIHB0LTRcIj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBsZWFkaW5nLXJlbGF4ZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgQ2hhbmdlcyBwcmV2aWV3IGxpdmUgaW4gdGhlIHNrZWxldG9uIGNoYXJ0IG9uIHRoZSBsZWZ0LiAgSGl0XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtaW5kaWdvLTQwMCBmb250LWJsYWNrXCI+IFNhdmUgJiByZXR1cm4gPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICBpbiB0aGUgaGVhZGVyIHdoZW4geW91J3JlIGhhcHB5LlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBMb2NhdGlvbiBTZXR0aW5nIC0tIG1vZGFsIHcvIGludGVyYWN0aXZlIExlYWZsZXQgbWFwICsgcmV2ZXJzZSBnZW9jb2RpbmdcbiAqIENsaWNrIGFueXdoZXJlIG9uIHRoZSBtYXAgKG9yIGRyYWcgdGhlIG1hcmtlcikgdG8gc2V0IGxhdC9sb24uXG4gKiBNYW51YWwgbGF0L2xvbiBlZGl0cyByZS1jZW50cmUgdGhlIG1hcmtlci4gIENpdHkgbmFtZSBpcyBhdXRvLXBvcHVsYXRlZFxuICogdmlhIE9wZW5TdHJlZXRNYXAgTm9taW5hdGltIChubyBrZXkgcmVxdWlyZWQsIHJhdGUtbGltaXRlZCB0byB+MSByZXEvcykuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5mdW5jdGlvbiBMb2NhdGlvbk1vZGFsKHsgY2ZnLCBzZXRDZmcsIG9uQ2xvc2UsIG9uU2F2ZSB9KSB7XG4gICAgY29uc3QgbWFwQm94UmVmID0gUmVhY3QudXNlUmVmKG51bGwpO1xuICAgIGNvbnN0IG1hcFJlZiAgICA9IFJlYWN0LnVzZVJlZihudWxsKTtcbiAgICBjb25zdCBtYXJrZXJSZWYgPSBSZWFjdC51c2VSZWYobnVsbCk7XG4gICAgY29uc3QgW2dlb0J1c3ksIHNldEdlb0J1c3ldID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuXG4gICAgLyogLS0tLS0gc2VhcmNoIHN0YXRlIC0tLS0tICovXG4gICAgY29uc3QgW3NlYXJjaFEsIHNldFNlYXJjaFFdICAgICAgICAgPSBSZWFjdC51c2VTdGF0ZSgnJyk7XG4gICAgY29uc3QgW3NlYXJjaEhpdHMsIHNldFNlYXJjaEhpdHNdICAgPSBSZWFjdC51c2VTdGF0ZShbXSk7XG4gICAgY29uc3QgW3NlYXJjaEJ1c3ksIHNldFNlYXJjaEJ1c3ldICAgPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3QgW3NlYXJjaE9wZW4sIHNldFNlYXJjaE9wZW5dICAgPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3Qgc2VhcmNoRGVib3VuY2VSZWYgICAgICAgICAgICAgPSBSZWFjdC51c2VSZWYobnVsbCk7XG5cbiAgICAvKiBGb3J3YXJkLWdlb2NvZGU6IHF1ZXJ5IC0+IFt7bGF0LCBsb24sIGRpc3BsYXlfbmFtZSwgdHlwZSwgLi4ufV0gKi9cbiAgICBjb25zdCBydW5TZWFyY2ggPSBhc3luYyAocSkgPT4ge1xuICAgICAgICBpZiAoIXEgfHwgcS50cmltKCkubGVuZ3RoIDwgMykgeyBzZXRTZWFyY2hIaXRzKFtdKTsgcmV0dXJuOyB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzZXRTZWFyY2hCdXN5KHRydWUpO1xuICAgICAgICAgICAgY29uc3QgdXJsID0gYGh0dHBzOi8vbm9taW5hdGltLm9wZW5zdHJlZXRtYXAub3JnL3NlYXJjaD9mb3JtYXQ9anNvbiZsaW1pdD02JnE9JHtlbmNvZGVVUklDb21wb25lbnQocSl9YDtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCh1cmwsIHsgaGVhZGVyczp7ICdBY2NlcHQnOidhcHBsaWNhdGlvbi9qc29uJyB9IH0pO1xuICAgICAgICAgICAgY29uc3QgaiA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgICAgICAgc2V0U2VhcmNoSGl0cyhBcnJheS5pc0FycmF5KGopID8gaiA6IFtdKTtcbiAgICAgICAgICAgIHNldFNlYXJjaE9wZW4odHJ1ZSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgc2V0U2VhcmNoSGl0cyhbXSk7IH1cbiAgICAgICAgZmluYWxseSB7IHNldFNlYXJjaEJ1c3koZmFsc2UpOyB9XG4gICAgfTtcblxuICAgIC8qIGRlYm91bmNlZCBzZWFyY2gtb24tdHlwZSAqL1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmIChzZWFyY2hEZWJvdW5jZVJlZi5jdXJyZW50KSBjbGVhclRpbWVvdXQoc2VhcmNoRGVib3VuY2VSZWYuY3VycmVudCk7XG4gICAgICAgIHNlYXJjaERlYm91bmNlUmVmLmN1cnJlbnQgPSBzZXRUaW1lb3V0KCgpID0+IHJ1blNlYXJjaChzZWFyY2hRKSwgNDAwKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHNlYXJjaERlYm91bmNlUmVmLmN1cnJlbnQgJiYgY2xlYXJUaW1lb3V0KHNlYXJjaERlYm91bmNlUmVmLmN1cnJlbnQpO1xuICAgIH0sIFtzZWFyY2hRXSk7XG5cbiAgICBjb25zdCBwaWNrU2VhcmNoSGl0ID0gKGhpdCkgPT4ge1xuICAgICAgICBjb25zdCBsYXQgPSBNYXRoLnJvdW5kKCtoaXQubGF0ICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgIGNvbnN0IGxvbiA9IE1hdGgucm91bmQoK2hpdC5sb24gKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBsYXQsIGxvbiwgY2l0eTpoaXQuZGlzcGxheV9uYW1lfSkpO1xuICAgICAgICBpZiAobWFwUmVmLmN1cnJlbnQpIG1hcFJlZi5jdXJyZW50LnNldFZpZXcoW2xhdCwgbG9uXSwgaGl0LnR5cGUgPT09ICdjaXR5JyA/IDExIDogMTUpO1xuICAgICAgICBzZXRTZWFyY2hPcGVuKGZhbHNlKTtcbiAgICAgICAgc2V0U2VhcmNoUSgnJyk7XG4gICAgfTtcblxuICAgIC8qIFJldmVyc2UtZ2VvY29kZSBsYXQvbG9uIC0+IGNpdHkgLyBjb3VudHJ5IHZpYSBOb21pbmF0aW0uICBObyBBUEkga2V5LiAqL1xuICAgIGNvbnN0IHJldmVyc2VHZW9jb2RlID0gYXN5bmMgKGxhdCwgbG9uKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzZXRHZW9CdXN5KHRydWUpO1xuICAgICAgICAgICAgY29uc3QgdXJsID0gYGh0dHBzOi8vbm9taW5hdGltLm9wZW5zdHJlZXRtYXAub3JnL3JldmVyc2U/Zm9ybWF0PWpzb24mbGF0PSR7bGF0fSZsb249JHtsb259Jnpvb209MTBgO1xuICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwgeyBoZWFkZXJzOiB7ICdBY2NlcHQnOidhcHBsaWNhdGlvbi9qc29uJyB9IH0pO1xuICAgICAgICAgICAgY29uc3QgaiA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgICAgICAgY29uc3QgYSA9IGouYWRkcmVzcyB8fCB7fTtcbiAgICAgICAgICAgIGNvbnN0IGNpdHkgPSBhLmNpdHkgfHwgYS50b3duIHx8IGEudmlsbGFnZSB8fCBhLmhhbWxldCB8fCBhLmNvdW50eSB8fCAnJztcbiAgICAgICAgICAgIGNvbnN0IHJlZ2lvbiA9IGEuc3RhdGUgfHwgYS5yZWdpb24gfHwgJyc7XG4gICAgICAgICAgICBjb25zdCBjb3VudHJ5ID0gYS5jb3VudHJ5IHx8ICcnO1xuICAgICAgICAgICAgY29uc3QgbGFiZWwgPSBbY2l0eSwgcmVnaW9uLCBjb3VudHJ5XS5maWx0ZXIoQm9vbGVhbikuam9pbignLCAnKSB8fCBqLmRpc3BsYXlfbmFtZSB8fCAnJztcbiAgICAgICAgICAgIGlmIChsYWJlbCkgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBjaXR5OmxhYmVsfSkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IC8qIG9mZmxpbmUgb3IgcmF0ZS1saW1pdGVkIC0+IGtlZXAgcHJpb3IgbmFtZSAqLyB9XG4gICAgICAgIGZpbmFsbHkgeyBzZXRHZW9CdXN5KGZhbHNlKTsgfVxuICAgIH07XG5cbiAgICAvKiBJbml0IExlYWZsZXQgb24gZmlyc3QgcmVuZGVyIG9mIHRoZSBtb2RhbCAqL1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmICghbWFwQm94UmVmLmN1cnJlbnQgfHwgbWFwUmVmLmN1cnJlbnQpIHJldHVybjtcbiAgICAgICAgY29uc3QgbWFwID0gTC5tYXAobWFwQm94UmVmLmN1cnJlbnQsIHsgem9vbUNvbnRyb2w6IHRydWUsIGF0dHJpYnV0aW9uQ29udHJvbDogdHJ1ZSB9KVxuICAgICAgICAgICAgICAgICAgICAgLnNldFZpZXcoW2NmZy5sYXQsIGNmZy5sb25dLCA2KTtcbiAgICAgICAgTC50aWxlTGF5ZXIoJ2h0dHBzOi8ve3N9LnRpbGUub3BlbnN0cmVldG1hcC5vcmcve3p9L3t4fS97eX0ucG5nJywge1xuICAgICAgICAgICAgbWF4Wm9vbTogMTgsXG4gICAgICAgICAgICBhdHRyaWJ1dGlvbjogJyZjb3B5OyBPcGVuU3RyZWV0TWFwIGNvbnRyaWJ1dG9ycycsXG4gICAgICAgIH0pLmFkZFRvKG1hcCk7XG5cbiAgICAgICAgY29uc3QgbWFya2VyID0gTC5tYXJrZXIoW2NmZy5sYXQsIGNmZy5sb25dLCB7IGRyYWdnYWJsZTogdHJ1ZSB9KS5hZGRUbyhtYXApO1xuICAgICAgICBtYXJrZXIuYmluZFRvb2x0aXAoJ0RyYWcgbWUgb3IgY2xpY2sgYW55d2hlcmUgb24gdGhlIG1hcCcsIHsgcGVybWFuZW50OiBmYWxzZSB9KTtcblxuICAgICAgICBjb25zdCBhcHBseUxhdExvbiA9IChsYXQsIGxvbikgPT4ge1xuICAgICAgICAgICAgY29uc3QgciA9IChuKSA9PiBNYXRoLnJvdW5kKG4gKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgbGF0OnIobGF0KSwgbG9uOnIobG9uKX0pKTtcbiAgICAgICAgICAgIHJldmVyc2VHZW9jb2RlKHIobGF0KSwgcihsb24pKTtcbiAgICAgICAgfTtcbiAgICAgICAgbWFya2VyLm9uKCdkcmFnZW5kJywgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGwgPSBtYXJrZXIuZ2V0TGF0TG5nKCk7XG4gICAgICAgICAgICBhcHBseUxhdExvbihsbC5sYXQsIGxsLmxuZyk7XG4gICAgICAgIH0pO1xuICAgICAgICBtYXAub24oJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgIG1hcmtlci5zZXRMYXRMbmcoZS5sYXRsbmcpO1xuICAgICAgICAgICAgYXBwbHlMYXRMb24oZS5sYXRsbmcubGF0LCBlLmxhdGxuZy5sbmcpO1xuICAgICAgICB9KTtcblxuICAgICAgICBtYXBSZWYuY3VycmVudCA9IG1hcDtcbiAgICAgICAgbWFya2VyUmVmLmN1cnJlbnQgPSBtYXJrZXI7XG5cbiAgICAgICAgLyogTGVhZmxldCByZW5kZXJzIGJsYW5rIGlmIGl0IGJvb3RzIGluc2lkZSBhIGhpZGRlbiBlbGVtZW50IOKAlCBraWNrIGl0XG4gICAgICAgICAgIG9uY2UgdGhlIG1vZGFsIGFuaW1hdGlvbiBzZXR0bGVzLiAqL1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IG1hcC5pbnZhbGlkYXRlU2l6ZSgpLCAyNTApO1xuICAgICAgICByZXR1cm4gKCkgPT4geyBtYXAucmVtb3ZlKCk7IG1hcFJlZi5jdXJyZW50ID0gbnVsbDsgbWFya2VyUmVmLmN1cnJlbnQgPSBudWxsOyB9O1xuICAgIH0sIFtdKTtcblxuICAgIC8qIEtlZXAgbWFya2VyIGluIHN5bmMgd2hlbiB1c2VyIGVkaXRzIGxhdC9sb24gZmllbGRzIG1hbnVhbGx5ICovXG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKG1hcFJlZi5jdXJyZW50ICYmIG1hcmtlclJlZi5jdXJyZW50KSB7XG4gICAgICAgICAgICBtYXJrZXJSZWYuY3VycmVudC5zZXRMYXRMbmcoW2NmZy5sYXQsIGNmZy5sb25dKTtcbiAgICAgICAgICAgIG1hcFJlZi5jdXJyZW50LnBhblRvKFtjZmcubGF0LCBjZmcubG9uXSk7XG4gICAgICAgIH1cbiAgICB9LCBbY2ZnLmxhdCwgY2ZnLmxvbl0pO1xuXG4gICAgY29uc3QgdXNlTXlMb2NhdGlvbiA9ICgpID0+IHtcbiAgICAgICAgaWYgKCFuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pIHJldHVybjtcbiAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihcbiAgICAgICAgICAgIChwb3MpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBsYXQgPSBNYXRoLnJvdW5kKHBvcy5jb29yZHMubGF0aXR1ZGUgICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgICAgICAgICAgY29uc3QgbG9uID0gTWF0aC5yb3VuZChwb3MuY29vcmRzLmxvbmdpdHVkZSAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgbGF0LCBsb259KSk7XG4gICAgICAgICAgICAgICAgaWYgKG1hcFJlZi5jdXJyZW50KSBtYXBSZWYuY3VycmVudC5zZXRWaWV3KFtsYXQsIGxvbl0sIDExKTtcbiAgICAgICAgICAgICAgICByZXZlcnNlR2VvY29kZShsYXQsIGxvbik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKGVycikgPT4geyAvKiB1c2VyIGRlbmllZCBvciB1bmF2YWlsYWJsZSAtPiBuby1vcCAqLyB9XG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIC8qIFdoZW4gdXNlciBjbGlja3MgXCJTYXZlICYgcmV0dXJuXCIsIFBPU1QgdGhlIHNlbGVjdGlvbiB0byB0aGUgc2FtZVxuICAgICAqIC9hcGkvd2VhdGhlci1sb2NhdGlvbiBlbmRwb2ludCB0aGUgZGFzaGJvYXJkIHJlYWRzLiAgU2V0dGluZyBCT1RIXG4gICAgICogYGFjdGl2ZWAgYW5kIGBkZWZhdWx0YCBtZWFucyB0aGUgd2VhdGhlciBzdHJpcCBvbiB0aGUgZGFzaGJvYXJkXG4gICAgICogbG9hZHMgdGhpcyBsb2NhdGlvbiBpbW1lZGlhdGVseSBvbiBuZXh0IHBhZ2UgbG9hZCAoYW5kIHN0YXlzIHBpbm5lZFxuICAgICAqIGZvciBhbnkgZnV0dXJlIGZyZXNoIHNlc3Npb25zKS4gIEFub255bW91cyB1c2VycyBnZXQgYSBzb2Z0IHdhcm5pbmdcbiAgICAgKiBiYWNrIGZyb20gdGhlIHNlcnZlciAocGVyc2lzdGVkOmZhbHNlKSAtLSB3ZSBzdXJmYWNlIHRoYXQgYXMgYSB0b2FzdFxuICAgICAqIHNvIHRoZSBvcGVyYXRvciBrbm93cyB0aGV5IG5lZWQgdG8gc2lnbiBpbiB0byBrZWVwIHRoZSBwaWNrIGFjcm9zc1xuICAgICAqIHBhZ2UgcmVsb2Fkcy4gIFdlIGFsd2F5cyBhbHNvIHdyaXRlIHRvIGxvY2FsU3RvcmFnZSBzbyB0aGUgU0FNRVxuICAgICAqIHRhYiBrZWVwcyB0aGUgY2hvc2VuIGxvY2F0aW9uIGZvciB0aGUgY3VycmVudCBzZXNzaW9uLiAqL1xuICAgIGNvbnN0IFtzYXZlTXNnLCBzZXRTYXZlTXNnXSA9IFJlYWN0LnVzZVN0YXRlKG51bGwpO1xuICAgIGNvbnN0IHBlcnNpc3RBbmRTYXZlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBsb2MgPSB7IGxhdDogY2ZnLmxhdCwgbG9uOiBjZmcubG9uLCBuYW1lOiBjZmcuc2l0ZU5hbWUgfHwgY2ZnLmNpdHkgfTtcbiAgICAgICAgLyogTG9jYWwgZmFsbGJhY2sg4oCUIHdvcmtzIGZvciBhbm9ueW1vdXMgdXNlcnMgc28gdGhlIGRhc2hib2FyZCBhdFxuICAgICAgICAgKiBsZWFzdCBzZWVzIHRoZSBuZXcgbGF0L2xvbiBpbiB0aGUgc2FtZSBicm93c2VyLiAqL1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDUud2VhdGhlcl9sb2NhdGlvbicsIEpTT04uc3RyaW5naWZ5KGxvYykpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IC8qIHByaXZhdGUgbW9kZSAtLSBpZ25vcmUgKi8gfVxuXG4gICAgICAgIGxldCBwZXJzaXN0ZWQgPSBmYWxzZSwgd2FybmluZyA9ICcnO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKCcvYXBpL3dlYXRoZXItbG9jYXRpb24nLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOidhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgYWN0aXZlOiBsb2MsIGRlZmF1bHQ6IGxvYyB9KSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgaiA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgICAgICAgd2luZG93Ll9sYXN0V2VhdGhlckxvY2F0aW9uU2F2ZSA9IGo7XG4gICAgICAgICAgICBwZXJzaXN0ZWQgPSAhIWoucGVyc2lzdGVkO1xuICAgICAgICAgICAgd2FybmluZyAgID0gai53YXJuaW5nIHx8ICcnO1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdbc2V0dXAgd2Fsa10gL2FwaS93ZWF0aGVyLWxvY2F0aW9uIDwtJywgaik7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHdhcm5pbmcgPSAnTmV0d29yayBlcnJvciDigJQgc2F2ZWQgbG9jYWxseSBvbmx5Lic7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1tzZXR1cCB3YWxrXSBjb3VsZCBub3QgcGVyc2lzdCBsb2NhdGlvbjonLCBlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwZXJzaXN0ZWQpIHtcbiAgICAgICAgICAgIG9uU2F2ZSgpOyAgICAgICAgICAgLy8gaGFwcHkgcGF0aDogY2xvc2UgKyBtYXJrIHN0ZXAgZG9uZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLyogU3VyZmFjZSB0aGUgd2FybmluZywgaG9sZCB0aGUgbW9kYWwgb3BlbiBmb3IgMS42cyBzbyB0aGVcbiAgICAgICAgICAgICAqIG9wZXJhdG9yIHJlYWRzIGl0LCB0aGVuIGNsb3NlLiAgVGhlIGxvY2FsIGNvcHkgaXMgYWxyZWFkeVxuICAgICAgICAgICAgICogd3JpdHRlbiwgc28gdGhlIGRhc2hib2FyZCB3aWxsIHN0aWxsIHNlZSB0aGUgbmV3IGxvY2F0aW9uXG4gICAgICAgICAgICAgKiBpbiB0aGlzIGJyb3dzZXIgc2Vzc2lvbi4gKi9cbiAgICAgICAgICAgIHNldFNhdmVNc2cod2FybmluZyB8fCAnU2F2ZWQgbG9jYWxseSBvbmx5IOKAlCBzaWduIGluIHRvIHNhdmUgc2VydmVyLXNpZGUuJyk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgc2V0U2F2ZU1zZyhudWxsKTsgb25TYXZlKCk7IH0sIDE2MDApO1xuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPE1vZGFsU2hlbGwgdGl0bGU9XCJMb2NhdGlvbiBTZXR0aW5nXCIgc3VidGl0bGU9XCJDbGljayB0aGUgbWFwLCBkcmFnIHRoZSBwaW4sIG9yIHVzZSB5b3VyIGRldmljZVwiIGFjY2VudD1cImFtYmVyXCIgb25DbG9zZT17b25DbG9zZX0gb25TYXZlPXtwZXJzaXN0QW5kU2F2ZX0gc2l6ZT1cIm1heFwiPlxuICAgICAgICAgICAge3NhdmVNc2cgJiYgKFxuICAgICAgICAgICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJsb2Mtc2F2ZS1tc2dcIlxuICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibWItMyBweC00IHB5LTIuNSByb3VuZGVkLWxnIGJnLWFtYmVyLTkwMC8zMCBib3JkZXIgYm9yZGVyLWFtYmVyLTcwMC81MCB0ZXh0LWFtYmVyLTIwMCB0ZXh0LXhzIGZvbnQtbW9ub1wiPlxuICAgICAgICAgICAgICAgICAgICDimqAgIHtzYXZlTXNnfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBsZzpncmlkLWNvbHMtWzFmcl8zNDBweF0gZ2FwLTQgaC1mdWxsXCIgc3R5bGU9e3ttaW5IZWlnaHQ6JzU2dmgnfX0+XG4gICAgICAgICAgICAgICAgey8qIE1BUCDigJQgZmlsbHMgdGhlIGxlZnQgc2lkZSwgd2l0aCBhIHNlYXJjaCBiYXIgZmxvYXRpbmcgb24gdG9wICovfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmVcIiBzdHlsZT17e21pbkhlaWdodDonNTZ2aCd9fT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiByZWY9e21hcEJveFJlZn1cbiAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBoZWlnaHQ6JzEwMCUnLCBtaW5IZWlnaHQ6JzU2dmgnLCB3aWR0aDonMTAwJScsIGJvcmRlclJhZGl1czonMTJweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6J2hpZGRlbicsIGJvcmRlcjonMXB4IHNvbGlkICMzMzQxNTUnLCBiYWNrZ3JvdW5kOicjMGIxMjIwJyB9fS8+XG5cbiAgICAgICAgICAgICAgICAgICAgey8qIFNlYXJjaCBiYXIgb3ZlcmxheSDigJQgc2l0cyBpbiB0aGUgdG9wLWNlbnRyZSBvZiB0aGUgbWFwICovfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC0zIGxlZnQtMS8yIC10cmFuc2xhdGUteC0xLzIgei1bNTAwXVwiIHN0eWxlPXt7d2lkdGg6J21pbig1NjBweCwgY2FsYygxMDAlIC0gMTEwcHgpKSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17c2VhcmNoUX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRTZWFyY2hRKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Gb2N1cz17KCkgPT4gc2VhcmNoSGl0cy5sZW5ndGggJiYgc2V0U2VhcmNoT3Blbih0cnVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCLwn5SOICBTZWFyY2ggYnkgYWRkcmVzcywgYnVpbGRpbmcsIG9yIHBsYWNlIG5hbWXigKZcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgcHgtNCBweS0yLjUgcm91bmRlZC14bCBiZy1zbGF0ZS05MDAvOTUgYm9yZGVyIGJvcmRlci1zbGF0ZS02MDAgdGV4dC1zbGF0ZS0xMDAgdGV4dC1zbSBwbGFjZWhvbGRlci1zbGF0ZS01MDAgc2hhZG93LTJ4bCBiYWNrZHJvcC1ibHVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tvdXRsaW5lOidub25lJ319Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VhcmNoQnVzeSAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImFic29sdXRlIHJpZ2h0LTMgdG9wLTEvMiAtdHJhbnNsYXRlLXktMS8yIHRleHQtYW1iZXItNDAwIHRleHQteHNcIj7igKY8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VhcmNoT3BlbiAmJiBzZWFyY2hIaXRzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC1mdWxsIGxlZnQtMCByaWdodC0wIG10LTEgYmctc2xhdGUtOTAwLzk3IGJvcmRlciBib3JkZXItc2xhdGUtNzAwIHJvdW5kZWQteGwgc2hhZG93LTJ4bCBvdmVyZmxvdy1oaWRkZW4gbWF4LWgtNzIgb3ZlcmZsb3cteS1hdXRvIGJhY2tkcm9wLWJsdXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWFyY2hIaXRzLm1hcCgoaCwgaSkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PXtoLnBsYWNlX2lkIHx8IGl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBwaWNrU2VhcmNoSGl0KGgpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHRleHQtbGVmdCBweC00IHB5LTIuNSBob3ZlcjpiZy1hbWJlci05MDAvMzAgYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTgwMCBsYXN0OmJvcmRlci1iLTAgdHJhbnNpdGlvbi1hbGxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIHRleHQtc2xhdGUtMjAwIHRydW5jYXRlXCI+e2guZGlzcGxheV9uYW1lfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgbXQtMC41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7aC50eXBlIHx8IGguY2xhc3N9IMK3IHsoK2gubGF0KS50b0ZpeGVkKDMpfSwgeygraC5sb24pLnRvRml4ZWQoMyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlYXJjaE9wZW4gJiYgc2VhcmNoSGl0cy5sZW5ndGggPT09IDAgJiYgc2VhcmNoUS5sZW5ndGggPj0gMyAmJiAhc2VhcmNoQnVzeSAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgdG9wLWZ1bGwgbGVmdC0wIHJpZ2h0LTAgbXQtMSBiZy1zbGF0ZS05MDAvOTcgYm9yZGVyIGJvcmRlci1zbGF0ZS03MDAgcm91bmRlZC14bCBweC00IHB5LTMgdGV4dC14cyB0ZXh0LXNsYXRlLTQwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTm8gcmVzdWx0cyBmb3IgXCJ7c2VhcmNoUX1cIi4gIFRyeSBhIG1vcmUgc3BlY2lmaWMgdGVybS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgIHsvKiBTSURFIFBBTkVMICovfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS00IG92ZXJmbG93LXktYXV0byBwci0xXCI+XG4gICAgICAgICAgICAgICAgICAgIHsvKiBVc2VyLWZyaWVuZGx5IHNpdGUgbmFtZSAodGhlIG9uZSB0aGUgb3BlcmF0b3IgdXNlcyB0byBpZGVudGlmeSB0aGlzIGxvY2F0aW9uKSAqL31cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMS41XCI+U2l0ZSBuYW1lIChzYXZlZCk8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiIHZhbHVlPXtjZmcuc2l0ZU5hbWUgfHwgJyd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJlLmcuIEhRIFRvd2VyLCBOb3J0aCBXaW5nLCBQYXZpbGlvbiBC4oCmXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldENmZyh7Li4uY2ZnLCBzaXRlTmFtZTplLnRhcmdldC52YWx1ZX0pfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0xIGl0YWxpY1wiPllvdXIgbGFiZWwgZm9yIHRoaXMgcGxhY2Ug4oCUIHNob3duIG9uIHRoZSBkYXNoYm9hcmQgaGVhZGVyLjwvcD5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib3JkZXItdCBib3JkZXItc2xhdGUtODAwIHB0LTNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMS41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVzb2x2ZWQgYWRkcmVzcyAvIGNpdHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Z2VvQnVzeSAmJiA8c3BhbiBjbGFzc05hbWU9XCJtbC0yIHRleHQtYW1iZXItNDAwIG5vcm1hbC1jYXNlIHRyYWNraW5nLW5vcm1hbFwiPuKApiByZXNvbHZpbmc8L3NwYW4+fVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIiB2YWx1ZT17Y2ZnLmNpdHl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKT0+c2V0Q2ZnKHsuLi5jZmcsIGNpdHk6ZS50YXJnZXQudmFsdWV9KX0vPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC0zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMS41XCI+TGF0aXR1ZGU8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIiB0eXBlPVwibnVtYmVyXCIgc3RlcD1cIjAuMDAwMVwiIHZhbHVlPXtjZmcubGF0fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpPT5zZXRDZmcoey4uLmNmZywgbGF0OitlLnRhcmdldC52YWx1ZX0pfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0xLjVcIj5Mb25naXR1ZGU8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIiB0eXBlPVwibnVtYmVyXCIgc3RlcD1cIjAuMDAwMVwiIHZhbHVlPXtjZmcubG9ufVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpPT5zZXRDZmcoey4uLmNmZywgbG9uOitlLnRhcmdldC52YWx1ZX0pfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXt1c2VNeUxvY2F0aW9ufVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBweS0yLjUgcm91bmRlZC1sZyBiZy1hbWJlci03MDAvNzAgYm9yZGVyIGJvcmRlci1hbWJlci01MDAvNDAgdGV4dC14cyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgdGV4dC1hbWJlci01MCBob3ZlcjpiZy1hbWJlci02MDAvNzBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIPCfk40gIFVzZSBteSBkZXZpY2UgbG9jYXRpb25cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib3JkZXItdCBib3JkZXItc2xhdGUtODAwIHB0LTMgbXQtMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0yXCI+UXVpY2sganVtcHM8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtMS41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidUb3JvbnRvLCBPTicsICAgbGF0OjQzLjY1MzIsIGxvbjotNzkuMzgzMiwgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J05ldyBZb3JrLCBOWScsICBsYXQ6NDAuNzEyOCwgbG9uOi03NC4wMDYwLCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonTG9uZG9uLCBVSycsICAgIGxhdDo1MS41MDc0LCBsb246IC0wLjEyNzgsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidQYXJpcywgRlInLCAgICAgbGF0OjQ4Ljg1NjYsIGxvbjogIDIuMzUyMiwgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J1Rva3lvLCBKUCcsICAgICBsYXQ6MzUuNjc2MiwgbG9uOjEzOS42NTAzLCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonU3lkbmV5LCBBVScsICAgIGxhdDotMzMuODY4OCxsb246MTUxLjIwOTMsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLm1hcChqID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e2oubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgbGF0OmoubGF0LCBsb246ai5sb24sIGNpdHk6ai5uYW1lfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFwUmVmLmN1cnJlbnQpIG1hcFJlZi5jdXJyZW50LnNldFZpZXcoW2oubGF0LCBqLmxvbl0sIGoueik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LWxlZnQgcHgtMi41IHB5LTEuNSByb3VuZGVkLW1kIGJnLXNsYXRlLTgwMC83MCBib3JkZXIgYm9yZGVyLXNsYXRlLTcwMCB0ZXh0LVsxMXB4XSBmb250LWJvbGQgdGV4dC1zbGF0ZS0zMDAgaG92ZXI6Ymctc2xhdGUtNzAwIGhvdmVyOmJvcmRlci1hbWJlci01MDAvNDAgdHJhbnNpdGlvbi1hbGxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtqLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgVGlsZXM6IE9wZW5TdHJlZXRNYXAgwrcgR2VvY29kZTogTm9taW5hdGltIChmcmVlLCB+MSByZXEvcykuXG4gICAgICAgICAgICAgICAgICAgICAgICBVc2VkIGZvciBPcGVuLU1ldGVvIHdlYXRoZXIgZmVlZCBhbmQgc3VucmlzZS9zdW5zZXQgZXN0aW1hdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvTW9kYWxTaGVsbD5cbiAgICApO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBMYW5ndWFnZSBTZXR0aW5nIC0tIG1vZGFsXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5mdW5jdGlvbiBMYW5ndWFnZU1vZGFsKHsgY2ZnLCBzZXRDZmcsIG9uQ2xvc2UsIG9uU2F2ZSB9KSB7XG4gICAgY29uc3QgbGFuZ3MgPSBbXG4gICAgICAgIHsgY29kZTonZW4nLCAgICBsYWJlbDonRW5nbGlzaCcsICAgICAgICAgICAgICAgIG5hdGl2ZTonRW5nbGlzaCcgICAgfSxcbiAgICAgICAgeyBjb2RlOid6aC1DTicsIGxhYmVsOidDaGluZXNlIChTaW1wbGlmaWVkKScsICAgbmF0aXZlOifnroDkvZPkuK3mlocnICAgIH0sXG4gICAgICAgIHsgY29kZTonemgtVFcnLCBsYWJlbDonQ2hpbmVzZSAoVHJhZGl0aW9uYWwpJywgIG5hdGl2ZTon57mB6auU5Lit5paHJyAgICB9LFxuICAgICAgICB7IGNvZGU6J2phJywgICAgbGFiZWw6J0phcGFuZXNlJywgICAgICAgICAgICAgICBuYXRpdmU6J+aXpeacrOiqnicgICAgICB9LFxuICAgICAgICB7IGNvZGU6J2tvJywgICAgbGFiZWw6J0tvcmVhbicsICAgICAgICAgICAgICAgICBuYXRpdmU6J+2VnOq1reyWtCcgICAgICB9LFxuICAgIF07XG4gICAgcmV0dXJuIChcbiAgICAgICAgPE1vZGFsU2hlbGwgdGl0bGU9XCJMYW5ndWFnZSBTZXR0aW5nXCIgc3VidGl0bGU9XCJQaWNrIHlvdXIgZGVmYXVsdCBpbnRlcmZhY2UgbGFuZ3VhZ2VcIiBhY2NlbnQ9XCJlbWVyYWxkXCIgb25DbG9zZT17b25DbG9zZX0gb25TYXZlPXtvblNhdmV9PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC0zXCI+XG4gICAgICAgICAgICAgICAge2xhbmdzLm1hcChsID0+IChcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e2wuY29kZX0gb25DbGljaz17KCk9PnNldENmZyh7Li4uY2ZnLCBsYW5nOmwuY29kZX0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHRleHQtbGVmdCBwLTMgcm91bmRlZC14bCBib3JkZXItMiB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2NmZy5sYW5nID09PSBsLmNvZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JvcmRlci1lbWVyYWxkLTUwMCBiZy1lbWVyYWxkLTkwMC8yMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JvcmRlci1zbGF0ZS03MDAgYmctc2xhdGUtODAwLzQwIGhvdmVyOmJnLXNsYXRlLTgwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayB0ZXh0LXNsYXRlLTUwMFwiPntsLmNvZGV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1ibGFjayB0ZXh0LXNsYXRlLTIwMFwiPntsLm5hdGl2ZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTFweF0gdGV4dC1zbGF0ZS01MDBcIj57bC5sYWJlbH08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Nb2RhbFNoZWxsPlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFBsdWctaW4gU2V0dGluZyAtLSBtb2RhbCB3LyBsaXN0ICsgdXBsb2FkIHpvbmVcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbi8qIFBlci1wbHVnLWluIG1vY2sgY29uZmlndXJhdGlvbiBmaWVsZHMuICBLZXlzIG1hcCB0byBwbHVnLWluIGBpZGAuICovXG5jb25zdCBQTFVHSU5fQ09ORklHX0ZJRUxEUyA9IHtcbiAgICB3ZWF0aGVyOiAgICBbXG4gICAgICAgIHsga2V5Oidwcm92aWRlcicsICBsYWJlbDonUHJvdmlkZXInLCAgICAgICAgICB0eXBlOidzZWxlY3QnLCAgb3B0aW9uczpbJ09wZW4tTWV0ZW8nLCdOV1MnLCdFQ01XRiddLCBkZWY6J09wZW4tTWV0ZW8nIH0sXG4gICAgICAgIHsga2V5OidyZWZyZXNoJywgICBsYWJlbDonUmVmcmVzaCBpbnRlcnZhbCcsICB0eXBlOidzZWxlY3QnLCAgb3B0aW9uczpbJzEgbWluJywnNSBtaW4nLCcxNSBtaW4nLCczMCBtaW4nLCcxIGgnXSwgZGVmOicxNSBtaW4nIH0sXG4gICAgICAgIHsga2V5OidjYWNoZScsICAgICBsYWJlbDonQ2FjaGUgVFRMIChtaW4pJywgICB0eXBlOidudW1iZXInLCAgZGVmOjMwIH0sXG4gICAgXSxcbiAgICBnaXZvbmk6ICAgICBbXG4gICAgICAgIHsga2V5OidjbGltYXRlJywgICBsYWJlbDonQ2xpbWF0ZSBtb2RlbCcsICAgICB0eXBlOidzZWxlY3QnLCAgb3B0aW9uczpbJ0dpdm9uaSAxOTkyJywnQVNIUkFFIDU1JywnQWRhcHRpdmUnXSwgZGVmOidHaXZvbmkgMTk5MicgfSxcbiAgICAgICAgeyBrZXk6J21hc3NpdmUnLCAgIGxhYmVsOidIZWF2eXdlaWdodCBjb25zdHJ1Y3Rpb24nLCAgdHlwZTondG9nZ2xlJywgZGVmOmZhbHNlIH0sXG4gICAgXSxcbiAgICBzd2VldF9zcG90OiBbXG4gICAgICAgIHsga2V5Oid0cmFja2luZycsICBsYWJlbDonVHJhY2sgb3V0ZG9vciBSSCcsICB0eXBlOid0b2dnbGUnLCBkZWY6dHJ1ZSB9LFxuICAgICAgICB7IGtleTonaHlzdCcsICAgICAgbGFiZWw6J0h5c3RlcmVzaXMgKCUgUkgpJywgdHlwZTonbnVtYmVyJywgZGVmOjIgfSxcbiAgICBdLFxuICAgIGczNjogICAgICAgIFtcbiAgICAgICAgeyBrZXk6J21vZGUnLCAgICAgIGxhYmVsOidTZXF1ZW5jZSBtb2RlJywgICAgIHR5cGU6J3NlbGVjdCcsICBvcHRpb25zOlsnU2luZ2xlLXpvbmUgVkFWJywnTXVsdGktem9uZSBWQVYnLCdET0FTIHcvIEZDVSddLCBkZWY6J011bHRpLXpvbmUgVkFWJyB9LFxuICAgICAgICB7IGtleTondmVyYm9zZScsICAgbGFiZWw6J1ZlcmJvc2UgbG9nZ2luZycsICAgdHlwZTondG9nZ2xlJywgZGVmOmZhbHNlIH0sXG4gICAgXSxcbiAgICBkaWJ0OiAgICAgICBbXG4gICAgICAgIHsga2V5Oidob3N0JywgICAgICBsYWJlbDonQnJpZGdlIGhvc3QnLCAgICAgICB0eXBlOid0ZXh0JywgICBkZWY6JzE5Mi4xNjguMS4xMDAnIH0sXG4gICAgICAgIHsga2V5Oidwb3J0JywgICAgICBsYWJlbDonVGVsZWdyYW0gcG9ydCcsICAgICB0eXBlOidudW1iZXInLCBkZWY6NDc4MDggfSxcbiAgICAgICAgeyBrZXk6J3BvbGxfbXMnLCAgIGxhYmVsOidQb2xsIGludGVydmFsIChtcyknLHR5cGU6J251bWJlcicsIGRlZjoyMDAwIH0sXG4gICAgXSxcbiAgICBsaWdodGluZzogICBbXG4gICAgICAgIHsga2V5OidnYXRld2F5JywgICBsYWJlbDonTW9kYnVzIGdhdGV3YXkgSVAnLCB0eXBlOid0ZXh0JywgICBkZWY6JzEwLjAuMC41MCcgfSxcbiAgICAgICAgeyBrZXk6J3VuaXRfaWQnLCAgIGxhYmVsOidVbml0IElEJywgICAgICAgICAgIHR5cGU6J251bWJlcicsIGRlZjoxIH0sXG4gICAgICAgIHsga2V5Oid0Y3BfcG9ydCcsICBsYWJlbDonVENQIHBvcnQnLCAgICAgICAgICB0eXBlOidudW1iZXInLCBkZWY6NTAyIH0sXG4gICAgXSxcbn07XG5cbmZ1bmN0aW9uIFBsdWdpbnNNb2RhbCh7IGNmZywgc2V0Q2ZnLCBvbkNsb3NlLCBvblNhdmUgfSkge1xuICAgIGNvbnN0IEFMTCA9IFtcbiAgICAgICAgeyBpZDond2VhdGhlcicsICAgICBuYW1lOidXZWF0aGVyJywgICAgICAgICBkZXNjOidPcGVuLU1ldGVvIE9BIGZlZWQnLCAgICAgICAgICB2ZXI6JzIuMS4wJyB9LFxuICAgICAgICB7IGlkOidnaXZvbmknLCAgICAgIG5hbWU6J0dpdm9uaSBFbmdpbmUnLCAgIGRlc2M6J0NsaW1hdGUtc3RyYXRlZ3kgb3ZlcmxheScsICAgIHZlcjonMS4zLjQnIH0sXG4gICAgICAgIHsgaWQ6J3N3ZWV0X3Nwb3QnLCAgbmFtZTonU3dlZXQtU3BvdCBSSCcsICAgZGVzYzonQWRqdXN0YWJsZSBSSCBiYW5kJywgICAgICAgICAgdmVyOicxLjAuMScgfSxcbiAgICAgICAgeyBpZDonZzM2JywgICAgICAgICBuYW1lOidHMzYgU2VxdWVuY2VzJywgICBkZXNjOidBU0hSQUUgR3VpZGVsaW5lIDM2JywgICAgICAgICB2ZXI6JzAuOS4yJyB9LFxuICAgICAgICB7IGlkOidkaWJ0JywgICAgICAgIG5hbWU6J0RJQlQgQnJpZGdlJywgICAgIGRlc2M6J0RlbHRhIENvbnRyb2xzIChESUJUKSBCQUNuZXQgYnJpZGdlJywgICAgICAgICAgIHZlcjonMC40LjAnIH0sXG4gICAgICAgIHsgaWQ6J2xpZ2h0aW5nJywgICAgbmFtZTonTGlnaHRpbmcgKFJlZDUpJywgZGVzYzonVjMuMCBNb2RidXMgVENQIGNsaWVudCcsICAgICAgdmVyOicwLjEuMC1iZXRhJyB9LFxuICAgIF07XG4gICAgY29uc3QgdG9nZ2xlID0gKGlkKSA9PiBzZXRDZmcoYyA9PiAoe1xuICAgICAgICAuLi5jLFxuICAgICAgICBlbmFibGVkOiBjLmVuYWJsZWQuaW5jbHVkZXMoaWQpID8gYy5lbmFibGVkLmZpbHRlcih4ID0+IHggIT09IGlkKSA6IFsuLi5jLmVuYWJsZWQsIGlkXVxuICAgIH0pKTtcblxuICAgIC8qIGV4cGFuc2lvbiBzdGF0ZSDigJQgd2hpY2ggcGx1Zy1pbidzIFwiQ29uZmlndXJlXCIgcGFuZWwgaXMgb3BlbiAqL1xuICAgIGNvbnN0IFtleHBhbmRlZElkLCBzZXRFeHBhbmRlZElkXSA9IFJlYWN0LnVzZVN0YXRlKG51bGwpO1xuXG4gICAgY29uc3QgdXBkYXRlRmllbGQgPSAocGx1Z2luSWQsIGZpZWxkS2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgICBzZXRDZmcoYyA9PiAoe1xuICAgICAgICAgICAgLi4uYyxcbiAgICAgICAgICAgIGZpZWxkczogeyAuLi4oYy5maWVsZHMgfHwge30pLCBbcGx1Z2luSWRdOiB7IC4uLigoYy5maWVsZHMgfHwge30pW3BsdWdpbklkXSB8fCB7fSksIFtmaWVsZEtleV06IHZhbHVlIH0gfVxuICAgICAgICB9KSk7XG4gICAgfTtcblxuICAgIGNvbnN0IGZpZWxkVmFsID0gKHBsdWdpbklkLCBmaWVsZCkgPT4ge1xuICAgICAgICBjb25zdCBzdG9yZWQgPSBjZmcuZmllbGRzICYmIGNmZy5maWVsZHNbcGx1Z2luSWRdICYmIGNmZy5maWVsZHNbcGx1Z2luSWRdW2ZpZWxkLmtleV07XG4gICAgICAgIHJldHVybiBzdG9yZWQgIT09IHVuZGVmaW5lZCA/IHN0b3JlZCA6IGZpZWxkLmRlZjtcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPE1vZGFsU2hlbGwgdGl0bGU9XCJQbHVnLWluIFNldHRpbmdcIiBzdWJ0aXRsZT1cIkVuYWJsZSwgdXBsb2FkIG9yIG1vZGlmeSBwbHVnLWluc1wiIGFjY2VudD1cInBpbmtcIiBvbkNsb3NlPXtvbkNsb3NlfSBvblNhdmU9e29uU2F2ZX0gc2l6ZT1cIndpZGVcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0zIG1heC1oLVs2MHZoXSBvdmVyZmxvdy15LWF1dG8gcHItMVwiPlxuICAgICAgICAgICAgICAgIHtBTEwubWFwKHAgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvbiA9IGNmZy5lbmFibGVkLmluY2x1ZGVzKHAuaWQpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBleHBhbmRlZCA9IGV4cGFuZGVkSWQgPT09IHAuaWQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkcyA9IFBMVUdJTl9DT05GSUdfRklFTERTW3AuaWRdIHx8IFtdO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e3AuaWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHJvdW5kZWQteGwgYm9yZGVyIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7b24gPyAnYm9yZGVyLXBpbmstNTAwLzQwIGJnLXBpbmstOTAwLzEwJyA6ICdib3JkZXItc2xhdGUtNzAwIGJnLXNsYXRlLTgwMC80MCd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7ZXhwYW5kZWQgPyAncmluZy0xIHJpbmctcGluay01MDAvMzAnIDogJyd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcC0zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1ibGFjayB0ZXh0LXNsYXRlLTEwMFwiPntwLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibWwtMiB0ZXh0LVsxMHB4XSBmb250LW1vbm8gdGV4dC1zbGF0ZS01MDBcIj52e3AudmVyfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtc2xhdGUtNDAwXCI+e3AuZGVzY308L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gdG9nZ2xlKHAuaWQpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17YHBsdWdpbi10b2dnbGUtJHtwLmlkfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTMgcHktMSByb3VuZGVkLW1kIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayBib3JkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7b24gPyAnYm9yZGVyLXBpbmstNTAwLzYwIHRleHQtcGluay0zMDAgYmctcGluay05MDAvMzAnIDogJ2JvcmRlci1zbGF0ZS02MDAgdGV4dC1zbGF0ZS00MDAgYmctc2xhdGUtODAwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7b24gPyAnRW5hYmxlZCcgOiAnRGlzYWJsZWQnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHNldEV4cGFuZGVkSWQoZXhwYW5kZWQgPyBudWxsIDogcC5pZCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgcGx1Z2luLWNvbmZpZy0ke3AuaWR9YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHgtMyBweS0xIHJvdW5kZWQtbWQgdGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIGJvcmRlciB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtleHBhbmRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JvcmRlci1waW5rLTUwMCBiZy1waW5rLTkwMC8zMCB0ZXh0LXBpbmstMjAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JvcmRlci1zbGF0ZS02MDAgdGV4dC1zbGF0ZS00MDAgYmctc2xhdGUtODAwIGhvdmVyOmJnLXNsYXRlLTcwMCBob3Zlcjpib3JkZXItcGluay01MDAvNTAgaG92ZXI6dGV4dC1waW5rLTMwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2V4cGFuZGVkID8gJ0Nsb3NlIOKWtCcgOiAnQ29uZmlndXJlIOKWvid9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2V4cGFuZGVkICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJweC00IHBiLTQgYm9yZGVyLXQgYm9yZGVyLXBpbmstNTAwLzIwIGJnLXNsYXRlLTk1MC80MFwiIGRhdGEtdGVzdGlkPXtgcGx1Z2luLWNvbmZpZy1wYW5lbC0ke3AuaWR9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZmllbGRzLmxlbmd0aCA9PT0gMCA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtc2xhdGUtNTAwIGl0YWxpYyBweS0zXCI+Tm8gY29uZmlndXJhYmxlIG9wdGlvbnMgZm9yIHRoaXMgcGx1Zy1pbiB5ZXQuPC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbWQ6Z3JpZC1jb2xzLTIgZ2FwLTMgcHQtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZmllbGRzLm1hcChmID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHYgPSBmaWVsZFZhbChwLmlkLCBmKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e2Yua2V5fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwIGJsb2NrIG1iLTFcIj57Zi5sYWJlbH08L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi50eXBlID09PSAnc2VsZWN0JyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0IGN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3Z9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlRmllbGQocC5pZCwgZi5rZXksIGUudGFyZ2V0LnZhbHVlKX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2Yub3B0aW9ucy5tYXAobyA9PiA8b3B0aW9uIGtleT17b30gdmFsdWU9e299PntvfTwvb3B0aW9uPil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2YudHlwZSA9PT0gJ251bWJlcicgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJudW1iZXJcIiBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3Z9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGVGaWVsZChwLmlkLCBmLmtleSwgK2UudGFyZ2V0LnZhbHVlKX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi50eXBlID09PSAndGV4dCcgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt2fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlRmllbGQocC5pZCwgZi5rZXksIGUudGFyZ2V0LnZhbHVlKX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi50eXBlID09PSAndG9nZ2xlJyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHVwZGF0ZUZpZWxkKHAuaWQsIGYua2V5LCAhdil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHctZnVsbCBweS0yIHJvdW5kZWQtbGcgdGV4dC14cyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgYm9yZGVyIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3ZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1waW5rLTcwMC80MCBib3JkZXItcGluay01MDAvNjAgdGV4dC1waW5rLTIwMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1zbGF0ZS04MDAgYm9yZGVyLXNsYXRlLTYwMCB0ZXh0LXNsYXRlLTQwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3YgPyAnT04nIDogJ09GRid9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1lbmQgZ2FwLTIgbXQtNCBwdC0zIGJvcmRlci10IGJvcmRlci1zbGF0ZS04MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXNldCB0aGlzIHBsdWctaW4ncyBmaWVsZHMgdG8gZGVmYXVsdHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRDZmcoYyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHQgPSB7IC4uLihjLmZpZWxkcyB8fCB7fSkgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG5leHRbcC5pZF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IC4uLmMsIGZpZWxkczogbmV4dCB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTMgcHktMS41IHJvdW5kZWQtbWQgdGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIGJvcmRlciBib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtNDAwIGhvdmVyOmJnLXNsYXRlLTgwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXNldCBkZWZhdWx0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gc2V0RXhwYW5kZWRJZChudWxsKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTMgcHktMS41IHJvdW5kZWQtbWQgdGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIGJnLXBpbmstNjAwIGhvdmVyOmJnLXBpbmstNTAwIHRleHQtd2hpdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRG9uZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTUgcC00IGJvcmRlci0yIGJvcmRlci1kYXNoZWQgYm9yZGVyLXNsYXRlLTcwMCByb3VuZGVkLXhsIHRleHQtY2VudGVyIGhvdmVyOmJvcmRlci1waW5rLTUwMC80MCB0cmFuc2l0aW9uLWFsbCBjdXJzb3ItcG9pbnRlclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC0zeGwgbWItMVwiPuKktDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LWJsYWNrIHRleHQtc2xhdGUtMzAwXCI+RHJvcCBhIC5weSAvIC56aXAgLyAucmVkNSBwbHVnLWluIGhlcmU8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzExcHhdIHRleHQtc2xhdGUtNTAwIG10LTFcIj5vciBjbGljayB0byBjaG9vc2UgYSBmaWxlIChtb2NrIOKAlCBub3Qgd2lyZWQpPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Nb2RhbFNoZWxsPlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE1vZGFsIFNoZWxsIC0tIHNoYXJlZFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuZnVuY3Rpb24gTW9kYWxTaGVsbCh7IHRpdGxlLCBzdWJ0aXRsZSwgYWNjZW50PSdpbmRpZ28nLCBvbkNsb3NlLCBvblNhdmUsIHNpemU9JycsIGNoaWxkcmVuIH0pIHtcbiAgICBjb25zdCBjb2xvck1hcCA9IHtcbiAgICAgICAgaW5kaWdvOicjODE4Y2Y4JywgYW1iZXI6JyNmYmJmMjQnLCBlbWVyYWxkOicjMzRkMzk5JywgcGluazonI2Y0NzJiNidcbiAgICB9O1xuICAgIGNvbnN0IGMgPSBjb2xvck1hcFthY2NlbnRdIHx8ICcjODE4Y2Y4JztcbiAgICBjb25zdCBzaXplTWFwID0ge1xuICAgICAgICB3aWRlOiAnbWF4LXctMnhsJyxcbiAgICAgICAgbWFwOiAgJ21heC13LTN4bCcsXG4gICAgICAgIG1heDogICdtYXgtdy1bOTZ2d10gdy1bOTZ2d10gaC1bOTJ2aF0nLFxuICAgIH07XG4gICAgY29uc3Qgd2lkdGggPSBzaXplTWFwW3NpemVdIHx8ICdtYXgtdy1tZCc7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaXhlZCBpbnNldC0wIHotNTAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgbW9kYWwtYmFja2Ryb3BcIiBvbkNsaWNrPXtvbkNsb3NlfT5cbiAgICAgICAgICAgIHsvKiBGbGV4LWNvbHVtbiBzaGVsbDogaGVhZGVyIChmaXhlZCkgKyBzY3JvbGxhYmxlIGNvbnRlbnQgKyBzdGlja3kgZm9vdGVyLlxuICAgICAgICAgICAgICAgIENyaXRpY2FsIGZvciBzaXplPVwibWF4XCIgd2hlcmUgY2hpbGRyZW4gYWxvbmUgZXhjZWVkIHRoZSBtb2RhbCBoZWlnaHRcbiAgICAgICAgICAgICAgICBhbmQgd291bGQgb3RoZXJ3aXNlIHB1c2ggdGhlIFNhdmUgJiByZXR1cm4gYnV0dG9uIGJlbG93IHRoZSB2aWV3cG9ydC4gKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YGJnLXNsYXRlLTkwMCBib3JkZXItMiByb3VuZGVkLTJ4bCB3LWZ1bGwgJHt3aWR0aH0gbXgtNCBmYWRlLXVwIGZsZXggZmxleC1jb2xgfVxuICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX1cbiAgICAgICAgICAgICAgICAgc3R5bGU9e3tib3JkZXJDb2xvcjpgJHtjfTY2YCwgbWF4SGVpZ2h0OiAnOTJ2aCd9fT5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtc3RhcnQganVzdGlmeS1iZXR3ZWVuIHAtNiBwYi00IGJvcmRlci1iIGJvcmRlci1zbGF0ZS04MDAvNjAgc2hyaW5rLTBcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LWxnIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdFwiIHN0eWxlPXt7Y29sb3I6Y319Pnt0aXRsZX08L2gzPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXNsYXRlLTUwMCBtdC0xXCI+e3N1YnRpdGxlfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJtb2RhbC1jbG9zZVwiIG9uQ2xpY2s9e29uQ2xvc2V9IGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNTAwIGhvdmVyOnRleHQtd2hpdGUgdGV4dC0yeGwgbGVhZGluZy1ub25lXCI+w5c8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMSBtaW4taC0wIG92ZXJmbG93LXktYXV0byBweC02IHB5LTVcIj5cbiAgICAgICAgICAgICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1lbmQgZ2FwLTMgcHgtNiBweS00IGJvcmRlci10IGJvcmRlci1zbGF0ZS04MDAgc2hyaW5rLTAgYmctc2xhdGUtOTAwIHJvdW5kZWQtYi0yeGxcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cIm1vZGFsLWNhbmNlbFwiIG9uQ2xpY2s9e29uQ2xvc2V9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtNCBweS0yIHJvdW5kZWQtbGcgYmctc2xhdGUtODAwIGJvcmRlciBib3JkZXItc2xhdGUtNzAwIHRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIHRleHQtc2xhdGUtNDAwIGhvdmVyOmJnLXNsYXRlLTcwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgQ2FuY2VsXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwibW9kYWwtc2F2ZVwiIG9uQ2xpY2s9e29uU2F2ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC01IHB5LTIgcm91bmRlZC1sZyB0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayB0ZXh0LXdoaXRlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6YywgYm94U2hhZG93OmAwIDAgMTJweCAke2N9NTVgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICBTYXZlICYgcmV0dXJuIOKck1xuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG4vKiBtb3VudCAqL1xuUmVhY3RET00uY3JlYXRlUm9vdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpKS5yZW5kZXIoPEFwcC8+KTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUFBLE1BQUEsR0FBOEJDLEtBQUs7RUFBM0JDLFFBQVEsR0FBQUYsTUFBQSxDQUFSRSxRQUFRO0VBQUVDLE9BQU8sR0FBQUgsTUFBQSxDQUFQRyxPQUFPOztBQUV6QjtBQUNBO0FBQ0E7QUFDQSxJQUFNQyxLQUFLLEdBQUcsQ0FDVjtFQUFFQyxHQUFHLEVBQUMsS0FBSztFQUFPQyxLQUFLLEVBQUMsbUJBQW1CO0VBQUtDLEdBQUcsRUFBQyxnQ0FBZ0M7RUFBRUMsSUFBSSxFQUFDLE1BQU07RUFBR0MsU0FBUyxFQUFDLFNBQVM7RUFBRUMsTUFBTSxFQUFDO0FBQVMsQ0FBQyxFQUMxSTtFQUFFTCxHQUFHLEVBQUMsVUFBVTtFQUFFQyxLQUFLLEVBQUMsa0JBQWtCO0VBQU1DLEdBQUcsRUFBQyx3QkFBd0I7RUFBVUMsSUFBSSxFQUFDLE9BQU87RUFBRUMsU0FBUyxFQUFDLFNBQVM7RUFBRUMsTUFBTSxFQUFDO0FBQVEsQ0FBQyxFQUN6STtFQUFFTCxHQUFHLEVBQUMsVUFBVTtFQUFFQyxLQUFLLEVBQUMsa0JBQWtCO0VBQU1DLEdBQUcsRUFBQyx1QkFBdUI7RUFBV0MsSUFBSSxFQUFDLE9BQU87RUFBRUMsU0FBUyxFQUFDLFNBQVM7RUFBRUMsTUFBTSxFQUFDO0FBQVUsQ0FBQyxFQUMzSTtFQUFFTCxHQUFHLEVBQUMsU0FBUztFQUFHQyxLQUFLLEVBQUMsaUJBQWlCO0VBQU9DLEdBQUcsRUFBQyx3QkFBd0I7RUFBVUMsSUFBSSxFQUFDLE9BQU87RUFBRUMsU0FBUyxFQUFDLFNBQVM7RUFBRUMsTUFBTSxFQUFDO0FBQU8sQ0FBQyxDQUMzSTs7QUFFRDtBQUNB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QUFJLENBQUMsRUFBRSxHQUFHQyxRQUFRLENBQUM7RUFDckUsSUFBTVEsSUFBSSxHQUFHLENBQUMsR0FBR1gsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRVAsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRUEsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0VBQzdGLElBQU1tQixHQUFHLEdBQUksQ0FBQyxHQUFHWixJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFUCxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFQSxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7RUFDN0YsSUFBTW9CLElBQUksR0FBRyxDQUFDLEdBQUdiLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUVQLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRUEsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUNoRSxDQUFDLEVBQUUsRUFBRUEsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFQSxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7RUFFM0UsSUFBTXFCLFVBQVUsR0FBRyxFQUFFO0VB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