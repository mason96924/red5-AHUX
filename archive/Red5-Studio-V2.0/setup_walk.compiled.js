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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBfd2Fsay5jb21waWxlZC5qcyIsIm5hbWVzIjpbIl9SZWFjdCIsIlJlYWN0IiwidXNlU3RhdGUiLCJ1c2VNZW1vIiwiU1RFUFMiLCJrZXkiLCJsYWJlbCIsInN1YiIsImtpbmQiLCJpY29uQ29sb3IiLCJhY2NlbnQiLCJBcHAiLCJfdXNlU3RhdGUiLCJwc3kiLCJsb2NhdGlvbiIsImxhbmd1YWdlIiwicGx1Z2lucyIsIl91c2VTdGF0ZTIiLCJfc2xpY2VkVG9BcnJheSIsImRvbmUiLCJzZXREb25lIiwiX3VzZVN0YXRlMyIsIl91c2VTdGF0ZTQiLCJyb3V0ZSIsInNldFJvdXRlIiwiX3VzZVN0YXRlNSIsIl91c2VTdGF0ZTYiLCJtb2RhbCIsInNldE1vZGFsIiwiX3VzZVN0YXRlNyIsImdpdm9uaSIsInJoUHJlc2V0IiwicmhMbyIsInJoSGkiLCJ0TG8iLCJ0SGkiLCJ0aGVtZSIsImRhcmtMZXZlbCIsIl91c2VTdGF0ZTgiLCJwc3lDZmciLCJzZXRQc3lDZmciLCJfdXNlU3RhdGU5Iiwic2l0ZU5hbWUiLCJjaXR5IiwibGF0IiwibG9uIiwiX3VzZVN0YXRlMCIsImxvY0NmZyIsInNldExvY0NmZyIsIl91c2VTdGF0ZTEiLCJ2IiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsImFsbG93ZWQiLCJpbmRleE9mIiwibGFuZyIsImUiLCJfdXNlU3RhdGUxMCIsImxhbmdDZmciLCJzZXRMYW5nQ2ZnIiwiX3VzZVN0YXRlMTEiLCJlbmFibGVkIiwiX3VzZVN0YXRlMTIiLCJwbHVnaW5DZmciLCJzZXRQbHVnaW5DZmciLCJjb21wbGV0ZUNvdW50IiwiT2JqZWN0IiwidmFsdWVzIiwiZmlsdGVyIiwiQm9vbGVhbiIsImxlbmd0aCIsImZpbmlzaCIsImQiLCJfb2JqZWN0U3ByZWFkIiwiY3JlYXRlRWxlbWVudCIsIlBzeUNoYXJ0U2V0dGluZ1BhZ2UiLCJjZmciLCJzZXRDZmciLCJvbkJhY2siLCJvblNhdmUiLCJjbGFzc05hbWUiLCJocmVmIiwib25DbGljayIsInNldEl0ZW0iLCJzdHlsZSIsImFuaW1hdGlvbkRlbGF5IiwibWFwIiwicyIsImkiLCJUaWxlIiwic3RlcCIsImluZGV4IiwiY29uY2F0IiwiTG9jYXRpb25Nb2RhbCIsIm9uQ2xvc2UiLCJMYW5ndWFnZU1vZGFsIiwiUGx1Z2luc01vZGFsIiwiX3JlZiIsImJhY2tncm91bmQiLCJib3JkZXIiLCJUaWxlSWNvbiIsImNvbG9yIiwiX3JlZjIiLCJzdHJva2UiLCJmaWxsIiwic3Ryb2tlV2lkdGgiLCJzdHJva2VMaW5lY2FwIiwic3Ryb2tlTGluZWpvaW4iLCJfZXh0ZW5kcyIsIndpZHRoIiwiaGVpZ2h0Iiwidmlld0JveCIsImN4IiwiY3kiLCJyIiwiX3JlZjMiLCJ1cGRhdGUiLCJrIiwiYyIsInVzZUVmZmVjdCIsInJhdyIsInByZXNldCIsInBhdGNoIiwicCIsIkpTT04iLCJwYXJzZSIsIk51bWJlciIsImlzRmluaXRlIiwibG8iLCJoaSIsIlJIX1BSRVNFVFMiLCJmaW5kIiwieCIsImlkIiwidGgiLCJkbCIsInBhcnNlRmxvYXQiLCJrZXlzIiwicGVyc2lzdEFuZFNhdmUiLCJzdHJpbmdpZnkiLCJTdHJpbmciLCJ3aW5kb3ciLCJkaXNwYXRjaEV2ZW50IiwiQ3VzdG9tRXZlbnQiLCJkZXRhaWwiLCJjb25zb2xlIiwiaW5mbyIsIndhcm4iLCJQc3lTa2VsZXRvbiIsIlBzeUNvbnRyb2xQYW5lbCIsIm5vdGUiLCJfcmVmNCIsIlciLCJIIiwicGFkIiwibGVmdCIsInJpZ2h0IiwidG9wIiwiYm90dG9tIiwiZ3JpZFciLCJncmlkSCIsIlRfTUlOIiwiVF9NQVgiLCJXX01JTiIsIldfTUFYIiwidCIsInkiLCJ3IiwiX2dldFciLCJnZXRXIiwicmgiLCJzYWZlUHRzIiwiYXJyIiwidG9GaXhlZCIsImpvaW4iLCJyaDgwIiwicHVzaCIsInJoMTAwIiwicmgyMExpbmUiLCJyaDIwX0NaIiwiQ1oiLCJyaEhpX3RvcCIsInR0IiwicmhMb19ib3QiLCJTV0VFVCIsIk5WIiwiTWFzcyIsIk1DViIsIkVWQVAiLCJ3aW50ZXJSSDgwIiwid2ludGVyUkgyMCIsIldJTlRFUiIsImlzb3BsZXRocyIsImlzTGlnaHQiLCJwYWxldHRlIiwiYmciLCJncmlkIiwidGljayIsImF4aXMiLCJwYW5lbEJnIiwicGFuZWxCb3JkZXIiLCJwaWxsQmciLCJwaWxsRmciLCJtZXRhRmciLCJkaW1GaWx0ZXIiLCJNYXRoIiwibWF4IiwibWluIiwiYm9yZGVyQ29sb3IiLCJib3JkZXJSYWRpdXMiLCJBcnJheSIsImZyb20iLCJfIiwieDEiLCJ5MSIsIngyIiwieTIiLCJmb250U2l6ZSIsInRleHRBbmNob3IiLCJwdHMiLCJ3dyIsInBvaW50cyIsInN0cm9rZURhc2hhcnJheSIsImZsb29yIiwiZm9udFdlaWdodCIsIm9wYWNpdHkiLCJmaWxsT3BhY2l0eSIsImNsaXBQYXRoVW5pdHMiLCJjbGlwUGF0aCIsInRyYW5zZm9ybSIsImxldHRlclNwYWNpbmciLCJwYWludE9yZGVyIiwiX3JlZjUiLCJyb3VuZCIsInR5cGUiLCJ2YWx1ZSIsIm9uQ2hhbmdlIiwidGFyZ2V0IiwiYWNjZW50Q29sb3IiLCJfcmVmNiIsIm1hcEJveFJlZiIsInVzZVJlZiIsIm1hcFJlZiIsIm1hcmtlclJlZiIsIl9SZWFjdCR1c2VTdGF0ZSIsIl9SZWFjdCR1c2VTdGF0ZTIiLCJnZW9CdXN5Iiwic2V0R2VvQnVzeSIsIl9SZWFjdCR1c2VTdGF0ZTMiLCJfUmVhY3QkdXNlU3RhdGU0Iiwic2VhcmNoUSIsInNldFNlYXJjaFEiLCJfUmVhY3QkdXNlU3RhdGU1IiwiX1JlYWN0JHVzZVN0YXRlNiIsInNlYXJjaEhpdHMiLCJzZXRTZWFyY2hIaXRzIiwiX1JlYWN0JHVzZVN0YXRlNyIsIl9SZWFjdCR1c2VTdGF0ZTgiLCJzZWFyY2hCdXN5Iiwic2V0U2VhcmNoQnVzeSIsIl9SZWFjdCR1c2VTdGF0ZTkiLCJfUmVhY3QkdXNlU3RhdGUwIiwic2VhcmNoT3BlbiIsInNldFNlYXJjaE9wZW4iLCJzZWFyY2hEZWJvdW5jZVJlZiIsInJ1blNlYXJjaCIsIl9yZWY3IiwiX2FzeW5jVG9HZW5lcmF0b3IiLCJxIiwidHJpbSIsInVybCIsImVuY29kZVVSSUNvbXBvbmVudCIsImZldGNoIiwiaGVhZGVycyIsImoiLCJqc29uIiwiaXNBcnJheSIsIl94IiwiYXBwbHkiLCJhcmd1bWVudHMiLCJjdXJyZW50IiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsInBpY2tTZWFyY2hIaXQiLCJoaXQiLCJkaXNwbGF5X25hbWUiLCJzZXRWaWV3IiwicmV2ZXJzZUdlb2NvZGUiLCJfcmVmOCIsImEiLCJhZGRyZXNzIiwidG93biIsInZpbGxhZ2UiLCJoYW1sZXQiLCJjb3VudHkiLCJyZWdpb24iLCJzdGF0ZSIsImNvdW50cnkiLCJfeDIiLCJfeDMiLCJMIiwiem9vbUNvbnRyb2wiLCJhdHRyaWJ1dGlvbkNvbnRyb2wiLCJ0aWxlTGF5ZXIiLCJtYXhab29tIiwiYXR0cmlidXRpb24iLCJhZGRUbyIsIm1hcmtlciIsImRyYWdnYWJsZSIsImJpbmRUb29sdGlwIiwicGVybWFuZW50IiwiYXBwbHlMYXRMb24iLCJuIiwib24iLCJsbCIsImdldExhdExuZyIsImxuZyIsInNldExhdExuZyIsImxhdGxuZyIsImludmFsaWRhdGVTaXplIiwicmVtb3ZlIiwicGFuVG8iLCJ1c2VNeUxvY2F0aW9uIiwibmF2aWdhdG9yIiwiZ2VvbG9jYXRpb24iLCJnZXRDdXJyZW50UG9zaXRpb24iLCJwb3MiLCJjb29yZHMiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsImVyciIsIl9SZWFjdCR1c2VTdGF0ZTEiLCJfUmVhY3QkdXNlU3RhdGUxMCIsInNhdmVNc2ciLCJzZXRTYXZlTXNnIiwiX3JlZjkiLCJsb2MiLCJuYW1lIiwicGVyc2lzdGVkIiwid2FybmluZyIsIm1ldGhvZCIsImNyZWRlbnRpYWxzIiwiYm9keSIsImFjdGl2ZSIsImRlZmF1bHQiLCJfbGFzdFdlYXRoZXJMb2NhdGlvblNhdmUiLCJNb2RhbFNoZWxsIiwidGl0bGUiLCJzdWJ0aXRsZSIsInNpemUiLCJtaW5IZWlnaHQiLCJyZWYiLCJvdmVyZmxvdyIsIm9uRm9jdXMiLCJwbGFjZWhvbGRlciIsIm91dGxpbmUiLCJoIiwicGxhY2VfaWQiLCJjbGFzcyIsInoiLCJfcmVmMCIsImxhbmdzIiwiY29kZSIsIm5hdGl2ZSIsIkV2ZW50IiwibCIsIlBMVUdJTl9DT05GSUdfRklFTERTIiwid2VhdGhlciIsIm9wdGlvbnMiLCJkZWYiLCJzd2VldF9zcG90IiwiZzM2IiwiZGlidCIsImxpZ2h0aW5nIiwiX3JlZjEiLCJBTEwiLCJkZXNjIiwidmVyIiwidG9nZ2xlIiwiaW5jbHVkZXMiLCJfUmVhY3QkdXNlU3RhdGUxMSIsIl9SZWFjdCR1c2VTdGF0ZTEyIiwiZXhwYW5kZWRJZCIsInNldEV4cGFuZGVkSWQiLCJ1cGRhdGVGaWVsZCIsInBsdWdpbklkIiwiZmllbGRLZXkiLCJmaWVsZHMiLCJmaWVsZFZhbCIsImZpZWxkIiwic3RvcmVkIiwidW5kZWZpbmVkIiwiZXhwYW5kZWQiLCJmIiwibyIsIm5leHQiLCJfcmVmMTAiLCJfcmVmMTAkYWNjZW50IiwiX3JlZjEwJHNpemUiLCJjaGlsZHJlbiIsImNvbG9yTWFwIiwiaW5kaWdvIiwiYW1iZXIiLCJlbWVyYWxkIiwicGluayIsInNpemVNYXAiLCJ3aWRlIiwic3RvcFByb3BhZ2F0aW9uIiwibWF4SGVpZ2h0IiwiYm94U2hhZG93IiwiUmVhY3RET00iLCJjcmVhdGVSb290IiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInJlbmRlciJdLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXR1cC13YWxrL3NldHVwX3dhbGsuanN4Il0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHsgdXNlU3RhdGUsIHVzZU1lbW8gfSA9IFJlYWN0O1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBTVEVQIERFRklOSVRJT05TIOKAlCB0aGUgNCB3YWxrIHBhdGhzIHRoZSB1c2VyIGRlc2NyaWJlZFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuY29uc3QgU1RFUFMgPSBbXG4gICAgeyBrZXk6J3BzeScsICAgICAgbGFiZWw6J1BzeSBDaGFydCBTZXR0aW5nJywgICAgc3ViOidHaXZvbmkgwrcgUkggcmFuZ2UgwrcgYXhpcyByYW5nZScsIGtpbmQ6J3BhZ2UnLCAgaWNvbkNvbG9yOicjODE4Y2Y4JywgYWNjZW50OidpbmRpZ28nIH0sXG4gICAgeyBrZXk6J2xvY2F0aW9uJywgbGFiZWw6J0xvY2F0aW9uIFNldHRpbmcnLCAgICAgc3ViOidDaXR5IG5hbWUgJiBsYXQgLyBsb25nJywgICAgICAgICBraW5kOidtb2RhbCcsIGljb25Db2xvcjonI2ZiYmYyNCcsIGFjY2VudDonYW1iZXInIH0sXG4gICAgeyBrZXk6J2xhbmd1YWdlJywgbGFiZWw6J0xhbmd1YWdlIFNldHRpbmcnLCAgICAgc3ViOidFTiDCtyBGUiDCtyBFUyDCtyBaSCDCtyDigKYnLCAgICAgICAgICBraW5kOidtb2RhbCcsIGljb25Db2xvcjonIzM0ZDM5OScsIGFjY2VudDonZW1lcmFsZCcgfSxcbiAgICB7IGtleToncGx1Z2lucycsICBsYWJlbDonUGx1Zy1pbiBTZXR0aW5nJywgICAgICBzdWI6J0xpc3QgwrcgdXBsb2FkIMK3IG1vZGlmeScsICAgICAgICAga2luZDonbW9kYWwnLCBpY29uQ29sb3I6JyNmNDcyYjYnLCBhY2NlbnQ6J3BpbmsnIH0sXG5dO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBST09UIEFQUFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuZnVuY3Rpb24gQXBwKCkge1xuICAgIC8qIGNvbXBsZXRpb24gKyBwZXItc3RlcCBjb25maWcgLS0gbW9ja3VwIHN0YXRlLCBuZXZlciBwZXJzaXN0ZWQgKi9cbiAgICBjb25zdCBbZG9uZSwgc2V0RG9uZV0gPSB1c2VTdGF0ZSh7IHBzeTpmYWxzZSwgbG9jYXRpb246ZmFsc2UsIGxhbmd1YWdlOmZhbHNlLCBwbHVnaW5zOmZhbHNlIH0pO1xuICAgIGNvbnN0IFtyb3V0ZSwgc2V0Um91dGVdID0gdXNlU3RhdGUoJ2h1YicpOyAgIC8vICdodWInIHwgJ3BzeSdcbiAgICBjb25zdCBbbW9kYWwsIHNldE1vZGFsXSA9IHVzZVN0YXRlKG51bGwpOyAgICAgLy8gJ2xvY2F0aW9uJyB8ICdsYW5ndWFnZScgfCAncGx1Z2lucycgfCBudWxsXG5cbiAgICBjb25zdCBbcHN5Q2ZnLCBzZXRQc3lDZmddICAgICAgICAgPSB1c2VTdGF0ZSh7IGdpdm9uaTp0cnVlLCByaFByZXNldDonb2ZmaWNlJywgcmhMbzozMCwgcmhIaTo2MCwgdExvOi0xNSwgdEhpOjUwLCB0aGVtZTonZGFyaycsIGRhcmtMZXZlbDoyLjAgfSk7XG4gICAgY29uc3QgW2xvY0NmZywgc2V0TG9jQ2ZnXSAgICAgICAgID0gdXNlU3RhdGUoeyBzaXRlTmFtZTonTXkgQnVpbGRpbmcnLCBjaXR5OidUb3JvbnRvLCBPTicsIGxhdDo0My42NTMyLCBsb246LTc5LjM4MzIgfSk7XG4gICAgY29uc3QgW2xhbmdDZmcsIHNldExhbmdDZmddICAgICAgID0gdXNlU3RhdGUoKCkgPT4ge1xuICAgICAgICAvKiBMYXp5IGluaXQgZnJvbSB0aGUgc2FtZSBsb2NhbFN0b3JhZ2Uga2V5IHRoZSBkYXNoYm9hcmQgcmVhZHMsIHNvXG4gICAgICAgICAqIHJlb3BlbmluZyB0aGUgc2V0dXAgd2FsayBzaG93cyB0aGUgY3VycmVudGx5LWFjdGl2ZSBsYW5ndWFnZVxuICAgICAgICAgKiByYXRoZXIgdGhhbiBhbHdheXMgZGVmYXVsdGluZyB0byBFbmdsaXNoLiAqL1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgdiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdpMThuX2xhbmcnKTtcbiAgICAgICAgICAgIGNvbnN0IGFsbG93ZWQgPSBbJ2VuJywnemgtQ04nLCd6aC1UVycsJ2phJywna28nXTtcbiAgICAgICAgICAgIGlmICh2ICYmIGFsbG93ZWQuaW5kZXhPZih2KSAhPT0gLTEpIHJldHVybiB7IGxhbmc6IHYgfTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBwcml2YXRlIG1vZGUgLT4gZmFsbCB0aHJvdWdoICovIH1cbiAgICAgICAgcmV0dXJuIHsgbGFuZzonZW4nIH07XG4gICAgfSk7XG4gICAgY29uc3QgW3BsdWdpbkNmZywgc2V0UGx1Z2luQ2ZnXSAgID0gdXNlU3RhdGUoeyBlbmFibGVkOlsnd2VhdGhlcicsJ2dpdm9uaScsJ3N3ZWV0X3Nwb3QnXSB9KTtcblxuICAgIGNvbnN0IGNvbXBsZXRlQ291bnQgPSBPYmplY3QudmFsdWVzKGRvbmUpLmZpbHRlcihCb29sZWFuKS5sZW5ndGg7XG5cbiAgICBjb25zdCBmaW5pc2ggPSAoa2V5KSA9PiB7XG4gICAgICAgIHNldERvbmUoZCA9PiAoey4uLmQsIFtrZXldOnRydWV9KSk7XG4gICAgICAgIHNldFJvdXRlKCdodWInKTtcbiAgICAgICAgc2V0TW9kYWwobnVsbCk7XG4gICAgfTtcblxuICAgIC8qIGZ1bGwtcGFnZSBQc3kgQ2hhcnQgZWRpdG9yICovXG4gICAgaWYgKHJvdXRlID09PSAncHN5Jykge1xuICAgICAgICByZXR1cm4gPFBzeUNoYXJ0U2V0dGluZ1BhZ2UgY2ZnPXtwc3lDZmd9IHNldENmZz17c2V0UHN5Q2ZnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25CYWNrPXsoKSA9PiBzZXRSb3V0ZSgnaHViJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNhdmU9eygpID0+IGZpbmlzaCgncHN5Jyl9IC8+O1xuICAgIH1cblxuICAgIC8qIGRlZmF1bHQ6IEhVQiBzY3JlZW4gKi9cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1pbi1oLXNjcmVlbiBweC02IHB5LThcIj5cbiAgICAgICAgICAgIHsvKiAtLS0tLS0tLS0tLS0tIGhlYWRlciAtLS0tLS0tLS0tLS0tICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXgtdy01eGwgbXgtYXV0byBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gbWItMTAgZmFkZS11cFwiPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJ0ZXh0LTJ4bCBzbTp0ZXh0LTN4bCBmb250LWJsYWNrIGl0YWxpYyB1cHBlcmNhc2UgdHJhY2tpbmctdGlnaHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtcmVkLTUwMFwiPlJlZDU8L3NwYW4+IDxzcGFuIGNsYXNzTmFtZT1cInRleHQtd2hpdGVcIj5TdHVkaW88L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCBmb250LW5vcm1hbCBpdGFsaWNcIj4gJm5ic3A7LyZuYnNwOyBzZXR1cCB3YWxrPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2gxPlxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCB0ZXh0LXhzIG10LTEgZm9udC1tb25vIHRyYWNraW5nLXdpZGVcIj5Db25maWd1cmUgb25jZS4gU2tpcCBhbnkgc3RlcCB5b3UgZG9uJ3QgbmVlZC48L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtNFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJwaWxsIGJnLXNsYXRlLTgwMCB0ZXh0LXNsYXRlLTQwMFwiPntjb21wbGV0ZUNvdW50fS80IERPTkU8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIvZGFzaGJvYXJkLmh0bWxcIlxuICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7IHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1LnNldHVwLmRvbmUnLCcxJyk7IH0gY2F0Y2goZSl7fSB9fVxuICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtc2xhdGUtNTAwIGhvdmVyOnRleHQtc2xhdGUtMzAwIHVuZGVybGluZSB1bmRlcmxpbmUtb2Zmc2V0LTRcIj5Ta2lwIGFsbCDihpI8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIC0tLS0tLS0tLS0tLS0gdGlsZSBncmlkIC0tLS0tLS0tLS0tLS0gKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1heC13LTV4bCBteC1hdXRvIGdyaWQgZ3JpZC1jb2xzLTEgc206Z3JpZC1jb2xzLTIgZ2FwLTUgZmFkZS11cFwiIHN0eWxlPXt7YW5pbWF0aW9uRGVsYXk6Jy4wOHMnfX0+XG4gICAgICAgICAgICAgICAge1NURVBTLm1hcCgocywgaSkgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8VGlsZSBrZXk9e3Mua2V5fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdGVwPXtzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lPXtkb25lW3Mua2V5XX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg9e2krMX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gcy5raW5kID09PSAncGFnZScgPyBzZXRSb3V0ZShzLmtleSkgOiBzZXRNb2RhbChzLmtleSl9IC8+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIC0tLS0tLS0tLS0tLS0gZm9vdGVyIENUQSAtLS0tLS0tLS0tLS0tICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXgtdy01eGwgbXgtYXV0byBtdC0xMCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gZmFkZS11cFwiIHN0eWxlPXt7YW5pbWF0aW9uRGVsYXk6Jy4xOHMnfX0+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgdGV4dC14cyBmb250LW1vbm9cIj5cbiAgICAgICAgICAgICAgICAgICAge2NvbXBsZXRlQ291bnQgPT09IDAgJiYgJ+KGkSBQaWNrIGEgc2V0dGluZyB0byBzdGFydCwgb3Igc2tpcCBhbGwgYW5kIGdvIHN0cmFpZ2h0IHRvIHRoZSBkYXNoYm9hcmQuJ31cbiAgICAgICAgICAgICAgICAgICAge2NvbXBsZXRlQ291bnQgPiAwICYmIGNvbXBsZXRlQ291bnQgPCA0ICYmIGDihpEgJHs0IC0gY29tcGxldGVDb3VudH0gc3RlcCR7NCAtIGNvbXBsZXRlQ291bnQgPT09IDEgPyAnJyA6ICdzJ30gcmVtYWluaW5nIChvcHRpb25hbCkuYH1cbiAgICAgICAgICAgICAgICAgICAge2NvbXBsZXRlQ291bnQgPT09IDQgJiYgJ+KckyBBbGwgc3RlcHMgY29uZmlndXJlZC4gIFJlYWR5IHdoZW4geW91IGFyZS4nfVxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiL2Rhc2hib2FyZC5odG1sXCJcbiAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7IHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1LnNldHVwLmRvbmUnLCcxJyk7IH0gY2F0Y2goZSl7fSB9fVxuICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTcgcHktMyByb3VuZGVkLXhsIHRleHQtc20gZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2NvbXBsZXRlQ291bnQgPT09IDRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1lbWVyYWxkLTYwMCBob3ZlcjpiZy1lbWVyYWxkLTUwMCB0ZXh0LXdoaXRlIHNoYWRvdy1sZyBzaGFkb3ctZW1lcmFsZC01MDAvMzAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctaW5kaWdvLTYwMCBob3ZlcjpiZy1pbmRpZ28tNTAwIHRleHQtd2hpdGUgc2hhZG93LWxnIHNoYWRvdy1pbmRpZ28tNTAwLzIwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgT3BlbiBEYXNoYm9hcmQg4oaSXG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiAtLS0tLS0tLS0tLS0tIG1vZGFscyAtLS0tLS0tLS0tLS0tICovfVxuICAgICAgICAgICAge21vZGFsID09PSAnbG9jYXRpb24nICYmIDxMb2NhdGlvbk1vZGFsIGNmZz17bG9jQ2ZnfSBzZXRDZmc9e3NldExvY0NmZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldE1vZGFsKG51bGwpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXsoKSA9PiBmaW5pc2goJ2xvY2F0aW9uJyl9IC8+fVxuICAgICAgICAgICAge21vZGFsID09PSAnbGFuZ3VhZ2UnICYmIDxMYW5ndWFnZU1vZGFsIGNmZz17bGFuZ0NmZ30gc2V0Q2ZnPXtzZXRMYW5nQ2ZnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0TW9kYWwobnVsbCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNhdmU9eygpID0+IGZpbmlzaCgnbGFuZ3VhZ2UnKX0gLz59XG4gICAgICAgICAgICB7bW9kYWwgPT09ICdwbHVnaW5zJyAgJiYgPFBsdWdpbnNNb2RhbCAgY2ZnPXtwbHVnaW5DZmd9IHNldENmZz17c2V0UGx1Z2luQ2ZnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0TW9kYWwobnVsbCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNhdmU9eygpID0+IGZpbmlzaCgncGx1Z2lucycpfSAvPn1cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogVGlsZSAobGFyZ2UgZWFzeS1vbi1leWVzIGJ1dHRvbilcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIFRpbGUoeyBzdGVwLCBkb25lLCBpbmRleCwgb25DbGljayB9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgc2V0dXAtdGlsZS0ke3N0ZXAua2V5fWB9XG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17YE9wZW4gJHtzdGVwLmxhYmVsfWB9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdGlsZS1idG4gcmVsYXRpdmUgdGV4dC1sZWZ0IGJnLXNsYXRlLTkwMC83MCBib3JkZXItMiBib3JkZXItc2xhdGUtNzAwLzcwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91bmRlZC0yeGwgcC02IHNtOnAtNyAke2RvbmUgPyAnZG9uZScgOiAnJ31gfT5cbiAgICAgICAgICAgIHtkb25lICYmIDxzcGFuIGNsYXNzTmFtZT1cImNoZWNrXCIgZGF0YS10ZXN0aWQ9e2BzZXR1cC10aWxlLSR7c3RlcC5rZXl9LWRvbmVgfT7inJM8L3NwYW4+fVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtNCBtYi0zXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTEyIGgtMTIgcm91bmRlZC14bCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiXG4gICAgICAgICAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6YCR7c3RlcC5pY29uQ29sb3J9MjJgLCBib3JkZXI6YDFweCBzb2xpZCAke3N0ZXAuaWNvbkNvbG9yfTU1YH19PlxuICAgICAgICAgICAgICAgICAgICA8VGlsZUljb24ga2luZD17c3RlcC5rZXl9IGNvbG9yPXtzdGVwLmljb25Db2xvcn0gLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtM3hsIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS03MDBcIj4we2luZGV4fTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1sZyBzbTp0ZXh0LXhsIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVyIG1iLTFcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7Y29sb3I6c3RlcC5pY29uQ29sb3J9fT57c3RlcC5sYWJlbH08L2gzPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS00MDAgdGV4dC1zbSBsZWFkaW5nLXNudWdcIj57c3RlcC5zdWJ9PC9wPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC00IGZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicGlsbCBiZy1zbGF0ZS04MDAgdGV4dC1zbGF0ZS00MDBcIj57c3RlcC5raW5kID09PSAncGFnZScgPyAnRnVsbCBwYWdlJyA6ICdQb3B1cCd9PC9zcGFuPlxuICAgICAgICAgICAgICAgIHtkb25lICYmIDxzcGFuIGNsYXNzTmFtZT1cInBpbGwgYmctZW1lcmFsZC05MDAvNDAgdGV4dC1lbWVyYWxkLTQwMFwiPkNvbmZpZ3VyZWQ8L3NwYW4+fVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICk7XG59XG5cbmZ1bmN0aW9uIFRpbGVJY29uKHsga2luZCwgY29sb3IgfSkge1xuICAgIC8qIHNpbXBsZSBpbmxpbmUgU1ZHcyBzbyB3ZSBrZWVwIHRoZSBmaWxlIHNlbGYtY29udGFpbmVkICovXG4gICAgY29uc3Qgc3Ryb2tlID0geyBzdHJva2U6Y29sb3IsIGZpbGw6J25vbmUnLCBzdHJva2VXaWR0aDoyLCBzdHJva2VMaW5lY2FwOidyb3VuZCcsIHN0cm9rZUxpbmVqb2luOidyb3VuZCcgfTtcbiAgICBpZiAoa2luZCA9PT0gJ3BzeScpICAgICAgcmV0dXJuIDxzdmcgd2lkdGg9XCIyMlwiIGhlaWdodD1cIjIyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHsuLi5zdHJva2V9PjxwYXRoIGQ9XCJNMyAzdjE4aDE4XCIvPjxwYXRoIGQ9XCJNMyAxN2M0LTEgNy02IDktOXM1LTMgOS0yXCIvPjwvc3ZnPjtcbiAgICBpZiAoa2luZCA9PT0gJ2xvY2F0aW9uJykgcmV0dXJuIDxzdmcgd2lkdGg9XCIyMlwiIGhlaWdodD1cIjIyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHsuLi5zdHJva2V9PjxwYXRoIGQ9XCJNMTIgMjJzLTctNi40LTctMTJhNyA3IDAgMSAxIDE0IDBjMCA1LjYtNyAxMi03IDEyelwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEwXCIgcj1cIjIuNVwiLz48L3N2Zz47XG4gICAgaWYgKGtpbmQgPT09ICdsYW5ndWFnZScpIHJldHVybiA8c3ZnIHdpZHRoPVwiMjJcIiBoZWlnaHQ9XCIyMlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB7Li4uc3Ryb2tlfT48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjlcIi8+PHBhdGggZD1cIk0zIDEyaDE4TTEyIDNhMTQgMTQgMCAwIDEgMCAxOE0xMiAzYTE0IDE0IDAgMCAwIDAgMThcIi8+PC9zdmc+O1xuICAgIGlmIChraW5kID09PSAncGx1Z2lucycpICByZXR1cm4gPHN2ZyB3aWR0aD1cIjIyXCIgaGVpZ2h0PVwiMjJcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgey4uLnN0cm9rZX0+PHBhdGggZD1cIk05IDN2Nk0xNSAzdjZcIi8+PHBhdGggZD1cIk01IDloMTR2NmE0IDQgMCAwIDEtNCA0aC0xdjNNOSAxOXYzXCIvPjwvc3ZnPjtcbiAgICByZXR1cm4gbnVsbDtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogUHN5IENoYXJ0IFNldHRpbmcgLS0gRlVMTCBQQUdFLCBsaXZlIHNrZWxldG9uIHJlc3BvbmRzIHRvIGNvbnRyb2xzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5mdW5jdGlvbiBQc3lDaGFydFNldHRpbmdQYWdlKHsgY2ZnLCBzZXRDZmcsIG9uQmFjaywgb25TYXZlIH0pIHtcbiAgICBjb25zdCB1cGRhdGUgPSAoaywgdikgPT4gc2V0Q2ZnKGMgPT4gKHsuLi5jLCBba106dn0pKTtcblxuICAgIC8qIE9uIG1vdW50OiBoeWRyYXRlIGZyb20gdGhlIFNBTUUgbG9jYWxTdG9yYWdlIGtleSB0aGUgZGFzaGJvYXJkIHJlYWRzXG4gICAgICogKGByZWQ1X3N3ZWV0X3Nwb3RfcmFuZ2VgKSBwbHVzIHRoZSBwcmVzZXQgaWQgKGByZWQ1X3JoX3ByZXNldGApIHNvXG4gICAgICogdGhlIGRyb3Bkb3duIGxhYmVsIHN0YXlzIGNvbnNpc3RlbnQgd2l0aCB0aGUgc2xpZGVyIHZhbHVlcyBhY3Jvc3NcbiAgICAgKiByZWxvYWRzLiAgSWYgdGhlIG9wZXJhdG9yIGhhcyBhbHJlYWR5IHR1bmVkIHRoZSBSSCBiYW5kIG9uIHRoZVxuICAgICAqIGRhc2hib2FyZCwgdGhlIHNldHVwIHdhbGsgc3RhcnRzIGZyb20gdGhvc2UgdmFsdWVzLiAqL1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByYXcgICAgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVkNV9zd2VldF9zcG90X3JhbmdlJyk7XG4gICAgICAgICAgICBjb25zdCBwcmVzZXQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVkNV9yaF9wcmVzZXQnKTtcbiAgICAgICAgICAgIGNvbnN0IHBhdGNoICA9IHt9O1xuICAgICAgICAgICAgaWYgKHJhdykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHAgPSBKU09OLnBhcnNlKHJhdyk7XG4gICAgICAgICAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShwLmxvKSAmJiBOdW1iZXIuaXNGaW5pdGUocC5oaSkgJiYgcC5sbyA8IHAuaGkpIHtcbiAgICAgICAgICAgICAgICAgICAgcGF0Y2gucmhMbyA9IHAubG87XG4gICAgICAgICAgICAgICAgICAgIHBhdGNoLnJoSGkgPSBwLmhpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwcmVzZXQgJiYgUkhfUFJFU0VUUy5maW5kKHggPT4geC5pZCA9PT0gcHJlc2V0KSkge1xuICAgICAgICAgICAgICAgIHBhdGNoLnJoUHJlc2V0ID0gcHJlc2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogVGhlbWUgKyBicmlnaHRuZXNzIOKAlCBzYW1lIGtleXMgYXBwLmpzIChkYXNoYm9hcmQpIHJlYWRzLiAqL1xuICAgICAgICAgICAgY29uc3QgdGggPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVkNS50aGVtZScpO1xuICAgICAgICAgICAgaWYgKHRoID09PSAnbGlnaHQnIHx8IHRoID09PSAnZGFyaycpIHBhdGNoLnRoZW1lID0gdGg7XG4gICAgICAgICAgICBjb25zdCBkbCA9IHBhcnNlRmxvYXQobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlZDUuZGFya0xldmVsJykpO1xuICAgICAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShkbCkgJiYgZGwgPj0gMS41ICYmIGRsIDw9IDMuMCkgcGF0Y2guZGFya0xldmVsID0gZGw7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMocGF0Y2gpLmxlbmd0aCkgc2V0Q2ZnKGMgPT4gKHsuLi5jLCAuLi5wYXRjaH0pKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBpZ25vcmUgKi8gfVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgICB9LCBbXSk7XG5cbiAgICAvKiBPbiBzYXZlOiBwZXJzaXN0IHRoZSBSSCBiYW5kIHRvIGxvY2FsU3RvcmFnZSBzbyB0aGUgZGFzaGJvYXJkJ3NcbiAgICAgKiBzd2VldC1zcG90IHBvbHlnb24gcGlja3MgaXQgdXAgb24gbmV4dCBsb2FkLiAgQWxzbyBwZXJzaXN0IHRoZSB2ZW51ZVxuICAgICAqIHByZXNldCBpZCAoZm9yIGZ1dHVyZSBcInNob3cgcHJlc2V0IG5hbWUgb24gZGFzaGJvYXJkXCIgZmVhdHVyZXMpLiAqL1xuICAgIGNvbnN0IHBlcnNpc3RBbmRTYXZlID0gKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDVfc3dlZXRfc3BvdF9yYW5nZScsXG4gICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoeyBsbzogY2ZnLnJoTG8sIGhpOiBjZmcucmhIaSB9KSk7XG4gICAgICAgICAgICBpZiAoY2ZnLnJoUHJlc2V0KSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDVfcmhfcHJlc2V0JywgY2ZnLnJoUHJlc2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIFRoZW1lICsgYnJpZ2h0bmVzcyDigJQgd3JpdHRlbiB0byB0aGUgU0FNRSBrZXlzIHRoZSBkYXNoYm9hcmRcbiAgICAgICAgICAgICAqIChhcHAuanMgbGluZXMgNTctNTggYW5kIDg0LTk3KSByZWFkcyBhcyBpdHMgdXNlU3RhdGUgbGF6eVxuICAgICAgICAgICAgICogaW5pdGlhbGlzZXIsIHNvIHRoZSBjaG9zZW4gdGhlbWUgdGFrZXMgZWZmZWN0IG9uIG5leHQgZGFzaGJvYXJkXG4gICAgICAgICAgICAgKiBsb2FkLiAgYXBwLmpzIHRyZWF0cyBkYXJrTGV2ZWwgPj0gMy4wIGFzIGxpZ2h0LW1vZGUgdHJpZ2dlci4gKi9cbiAgICAgICAgICAgIGlmIChjZmcudGhlbWUgPT09ICdsaWdodCcgfHwgY2ZnLnRoZW1lID09PSAnZGFyaycpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS50aGVtZScsIGNmZy50aGVtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGNmZy5kYXJrTGV2ZWwpKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDUuZGFya0xldmVsJywgU3RyaW5nKGNmZy5kYXJrTGV2ZWwpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncjUtcmgtYmFuZC1jaGFuZ2UnLCB7XG4gICAgICAgICAgICAgICAgZGV0YWlsOiB7IGxvOiBjZmcucmhMbywgaGk6IGNmZy5yaEhpIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnW3NldHVwIHdhbGtdIHBzeSBjaGFydCBzYXZlZCAtPiBSSCcsIGNmZy5yaExvLCAnLScsIGNmZy5yaEhpLCAnJSAgcHJlc2V0PScsIGNmZy5yaFByZXNldCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignW3NldHVwIHdhbGtdIGNvdWxkIG5vdCBwZXJzaXN0IHBzeSBzZXR0aW5nczonLCBlKTtcbiAgICAgICAgfVxuICAgICAgICBvblNhdmUoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtaW4taC1zY3JlZW4gZmxleCBmbGV4LWNvbFwiPlxuICAgICAgICAgICAgey8qIGhlYWRlciAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHB4LTYgcHktNCBib3JkZXItYiBib3JkZXItc2xhdGUtODAwXCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkJhY2t9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTQwMCBob3Zlcjp0ZXh0LXdoaXRlIHRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrXCI+XG4gICAgICAgICAgICAgICAgICAgIOKGkCBCYWNrIHRvIHNldHVwXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cInRleHQtc20gdXBwZXJjYXNlIHRyYWNraW5nLVswLjNlbV0gZm9udC1ibGFjayB0ZXh0LWluZGlnby00MDBcIj5Qc3kgQ2hhcnQgU2V0dGluZzwvaDE+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtwZXJzaXN0QW5kU2F2ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTUgcHktMiByb3VuZGVkLWxnIGJnLWluZGlnby02MDAgaG92ZXI6YmctaW5kaWdvLTUwMCB0ZXh0LXdoaXRlIHRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrXCI+XG4gICAgICAgICAgICAgICAgICAgIFNhdmUgJiByZXR1cm4g4pyTXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIGJvZHkg4oCUIGNoYXJ0IGxlZnQsIGNvbnRyb2xzIHJpZ2h0ICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTEgZ3JpZCBncmlkLWNvbHMtMSBsZzpncmlkLWNvbHMtWzFmcl8zNjBweF0gZ2FwLTQgcC02IG1heC13LTd4bCBteC1hdXRvIHctZnVsbFwiPlxuICAgICAgICAgICAgICAgIDxQc3lTa2VsZXRvbiBjZmc9e2NmZ30gLz5cbiAgICAgICAgICAgICAgICA8UHN5Q29udHJvbFBhbmVsIGNmZz17Y2ZnfSB1cGRhdGU9e3VwZGF0ZX0gc2V0Q2ZnPXtzZXRDZmd9IC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuLyogUkggYmFuZCBwcmVzZXRzIOKAlCByZWNvZ25pc2VkIGluZHVzdHJ5IHN0YW5kYXJkcyBmb3IgZWFjaCB2ZW51ZSB0eXBlLlxuICogU291cmNlczogQVNIUkFFIDU1IChjb21mb3J0KSwgQVNIUkFFIDE3MCAoaGVhbHRoY2FyZSksXG4gKiBBQU0vTlBTL1NtaXRoc29uaWFuIGd1aWRhbmNlIChjb2xsZWN0aW9ucyksIENJQlNFIFRNNDAgKGxpYnJhcmllcykuICovXG5jb25zdCBSSF9QUkVTRVRTID0gW1xuICAgIHsgaWQ6J2N1c3RvbScsICAgICAgICAgIGxhYmVsOidDdXN0b20gKG1hbnVhbCknLCAgICAgICAgICAgICAgICAgbG86bnVsbCwgaGk6bnVsbCwgbm90ZTonJyB9LFxuICAgIHsgaWQ6J29mZmljZScsICAgICAgICAgIGxhYmVsOidPZmZpY2UnLCAgICAgICAgICAgICAgICAgICAgICAgICAgbG86MzAsICAgaGk6NjAsICAgbm90ZTonQVNIUkFFIDU1IGNvbWZvcnQnICAgICAgICAgICAgICAgICAgfSxcbiAgICB7IGlkOidtdXNldW0nLCAgICAgICAgICBsYWJlbDonTXVzZXVtJywgICAgICAgICAgICAgICAgICAgICAgICAgIGxvOjQwLCAgIGhpOjU1LCAgIG5vdGU6J0FBTSBjb2xsZWN0aW9uIHByZXNlcnZhdGlvbicgICAgICAgIH0sXG4gICAgeyBpZDonaG90ZWwnLCAgICAgICAgICAgbGFiZWw6J0hvdGVsIGd1ZXN0IHJvb20nLCAgICAgICAgICAgICAgICBsbzozMCwgICBoaTo2MCwgICBub3RlOidnZW5lcmFsIG9jY3VwYW50IGNvbWZvcnQnICAgICAgICAgICB9LFxuICAgIHsgaWQ6J2xpYnJhcnknLCAgICAgICAgIGxhYmVsOidMaWJyYXJ5IC8gQXJjaGl2ZScsICAgICAgICAgICAgICAgbG86NDAsICAgaGk6NTUsICAgbm90ZToncGFwZXIgJiBiaW5kaW5nIHByZXNlcnZhdGlvbicgICAgICAgfSxcbiAgICB7IGlkOidob3NwaXRhbCcsICAgICAgICBsYWJlbDonSG9zcGl0YWwgKGdlbmVyYWwpJywgICAgICAgICAgICAgIGxvOjMwLCAgIGhpOjYwLCAgIG5vdGU6J0FTSFJBRSAxNzAgcGF0aWVudCBhcmVhcycgICAgICAgICAgIH0sXG4gICAgeyBpZDonbGVjdHVyZScsICAgICAgICAgbGFiZWw6J0xlY3R1cmUgaGFsbCcsICAgICAgICAgICAgICAgICAgICBsbzozMCwgICBoaTo2MCwgICBub3RlOidoaWdoIG9jY3VwYW5jeSBjb21mb3J0JyAgICAgICAgICAgICB9LFxuICAgIHsgaWQ6J2NvbmNlcnQnLCAgICAgICAgIGxhYmVsOidDb25jZXJ0IGhhbGwnLCAgICAgICAgICAgICAgICAgICAgbG86NDAsICAgaGk6NTUsICAgbm90ZTonaW5zdHJ1bWVudCB0dW5pbmcgc3RhYmlsaXR5JyAgICAgICAgfSxcbiAgICB7IGlkOidtZWV0aW5nJywgICAgICAgICBsYWJlbDonTWVldGluZyByb29tJywgICAgICAgICAgICAgICAgICAgIGxvOjMwLCAgIGhpOjYwLCAgIG5vdGU6J3NtYWxsIGdyb3VwIGNvbWZvcnQnICAgICAgICAgICAgICAgIH0sXG4gICAgeyBpZDonZXhoaWJpdGlvbicsICAgICAgbGFiZWw6J0V4aGliaXRpb24gaGFsbCcsICAgICAgICAgICAgICAgICBsbzo0MCwgICBoaTo1NSwgICBub3RlOidtaXhlZCBhcnQgLyBhcnRpZmFjdCBkaXNwbGF5JyAgICAgICB9LFxuXTtcblxuLyogUmVhbCBwc3kgY2hhcnQg4oCUIHVzZXMgdGhlIFNBTUUgZ2V0VyArIEdJVk9OSV9DT0xPUlMgKyBwb2x5Z29uIG1hdGggYXMgdGhlXG4gKiBwcm9kdWN0aW9uIGRhc2hib2FyZC4gIFNvdXJjZSBvZiB0cnV0aDogIGpzL3BzeWNocm9tZXRyaWMuanMgIGFuZCB0aGVcbiAqIHJlbmRlckdpdm9uaU92ZXJsYXkoKSBibG9jayBhdCBhcHAuanM6MTY0MS0xNzIyLlxuICogQW55dGhpbmcgeW91IGNoYW5nZSBpbiB0aG9zZSBmaWxlcyBNVVNUIGJlIG1pcnJvcmVkIGhlcmUuICovXG5mdW5jdGlvbiBQc3lTa2VsZXRvbih7IGNmZyB9KSB7XG4gICAgLyogQ2FudmFzICsgcGFkZGluZyAqL1xuICAgIGNvbnN0IFcgPSA3NjAsIEggPSA0ODA7XG4gICAgY29uc3QgcGFkID0geyBsZWZ0OiA1NiwgcmlnaHQ6IDQwLCB0b3A6IDI4LCBib3R0b206IDU2IH07XG4gICAgY29uc3QgZ3JpZFcgPSBXIC0gcGFkLmxlZnQgLSBwYWQucmlnaHQ7XG4gICAgY29uc3QgZ3JpZEggPSBIIC0gcGFkLnRvcCAgLSBwYWQuYm90dG9tO1xuXG4gICAgY29uc3QgVF9NSU4gPSBjZmcudExvLCBUX01BWCA9IGNmZy50SGk7XG4gICAgY29uc3QgV19NSU4gPSAwLCAgICAgICBXX01BWCA9IDAuMDMwOyAgICAgICAgICAvLyBrZy9rZ1xuXG4gICAgLyogYXhpcyBzY2FsZXMgLS0gbWF0Y2ggdGhlIGxpdmUgZGFzaGJvYXJkICovXG4gICAgY29uc3QgeCAgPSAodCkgPT4gcGFkLmxlZnQgKyAoKHQgLSBUX01JTikgLyAoVF9NQVggLSBUX01JTikpICogZ3JpZFc7XG4gICAgY29uc3QgeSAgPSAodykgPT4gcGFkLnRvcCAgKyAoMSAtICh3IC0gV19NSU4pIC8gKFdfTUFYIC0gV19NSU4pKSAqIGdyaWRIO1xuICAgIGNvbnN0IF9nZXRXID0gKHR5cGVvZiBnZXRXID09PSAnZnVuY3Rpb24nKSA/IGdldFcgOiAoKHQsIHJoKSA9PiAwKTtcblxuICAgIGNvbnN0IHNhZmVQdHMgPSAoYXJyKSA9PiBhcnIubWFwKHAgPT4gYCR7KHgocFswXSl8fDApLnRvRml4ZWQoMil9LCR7KHkocFsxXSl8fDApLnRvRml4ZWQoMil9YCkuam9pbignICcpO1xuXG4gICAgLyogLS0tLSBHaXZvbmkgcG9seWdvbnMgLS0gQ09QSUVEIFZFUkJBVElNIGZyb20gYXBwLmpzOjE2NDMtMTY2OSAtLS0tICovXG4gICAgY29uc3Qgcmg4MCA9IFtdOyBmb3IgKGxldCB0PTIwOyB0PD0yNTsgdCs9MC41KSByaDgwLnB1c2goW3QsIF9nZXRXKHQsIDgwKV0pO1xuICAgIGNvbnN0IHJoMTAwPSBbXTsgZm9yIChsZXQgdD0yMDsgdDw9Mjc7IHQrPTAuNSkgcmgxMDAucHVzaChbdCwgX2dldFcodCwgMTAwKV0pO1xuICAgIGNvbnN0IHJoMjBMaW5lID0gW107IGZvciAobGV0IHQ9MzI7IHQ+PTIwOyB0LT0wLjUpIHJoMjBMaW5lLnB1c2goW3QsIF9nZXRXKHQsIDIwKV0pO1xuICAgIGNvbnN0IHJoMjBfQ1ogID0gW107IGZvciAobGV0IHQ9Mjc7IHQ+PTIwOyB0LT0wLjUpIHJoMjBfQ1oucHVzaChbdCwgX2dldFcodCwgMjApXSk7XG4gICAgY29uc3QgQ1ogICA9IFsuLi5yaDgwLCBbMjcsIF9nZXRXKDI3LCA1MCldLCBbMjcsIF9nZXRXKDI3LCAyMCldLCAuLi5yaDIwX0NaXTtcblxuICAgIGNvbnN0IHJoSGlfdG9wID0gW107IGZvciAobGV0IHR0PTIwOyB0dDw9Mjc7IHR0Kz0wLjUpIHJoSGlfdG9wLnB1c2goW3R0LCBfZ2V0Vyh0dCwgY2ZnLnJoSGkpXSk7XG4gICAgY29uc3QgcmhMb19ib3QgPSBbXTsgZm9yIChsZXQgdHQ9Mjc7IHR0Pj0yMDsgdHQtPTAuNSkgcmhMb19ib3QucHVzaChbdHQsIF9nZXRXKHR0LCBjZmcucmhMbyldKTtcbiAgICBjb25zdCBTV0VFVCA9IFsuLi5yaEhpX3RvcCwgLi4ucmhMb19ib3RdO1xuXG4gICAgY29uc3QgTlYgICA9IFsuLi5yaDEwMCwgWzMyLCAxNS40LzEwMDBdLCBbMzIsIDYuMi8xMDAwXSwgLi4ucmgyMExpbmVdO1xuICAgIGNvbnN0IE1hc3MgPSBbLi4ucmg4MCwgWzMzLCAxNi8xMDAwXSwgWzM3LCBfZ2V0VygzNywgMzApXSwgWzM3LCAzLzEwMDBdLCBbMjAsIF9nZXRXKDIwLCAyMCldXTtcbiAgICBjb25zdCBNQ1YgID0gWy4uLnJoODAsIFs0MCwgMTYvMTAwMF0sIFs0NCwgX2dldFcoNDQsIDIwKV0sIFs0NCwgMy8xMDAwXSwgWzIwLCBfZ2V0VygyMCwgMjApXV07XG4gICAgY29uc3QgRVZBUCA9IFsuLi5yaDgwLCBbMjUsIDE2LzEwMDBdLCBbMzYsIF9nZXRXKDM2LCAzMCldLCBbMzksIF9nZXRXKDM5LCAyMCldLFxuICAgICAgICAgICAgICAgICAgWzQxLCBfZ2V0Vyg0MSwgMTApXSwgWzQxLCAwXSwgWzI3LjIsIDBdLCBbMjAsIF9nZXRXKDIwLCAyMCldXTtcblxuICAgIGNvbnN0IHdpbnRlclJIODAgPSBbXTsgZm9yIChsZXQgdD0xODsgdDw9MTkuNTsgdCs9MC41KSB3aW50ZXJSSDgwLnB1c2goW3QsIF9nZXRXKHQsIDgwKV0pO1xuICAgIGNvbnN0IHdpbnRlclJIMjAgPSBbXTsgZm9yIChsZXQgdD0xOS41OyB0Pj0xODsgdC09MC41KSB3aW50ZXJSSDIwLnB1c2goW3QsIF9nZXRXKHQsIDIwKV0pO1xuICAgIGNvbnN0IFdJTlRFUiA9IFsuLi53aW50ZXJSSDgwLCAuLi53aW50ZXJSSDIwXTtcblxuICAgIC8qIFJIIGlzb3BsZXRoIGN1cnZlcyBmb3IgdGhlIGNoYXJ0IGdyaWQgKi9cbiAgICBjb25zdCBpc29wbGV0aHMgPSBbMjAsIDQwLCA2MCwgODAsIDEwMF07XG5cbiAgICAvKiBUaGVtZSBwYWxldHRlIOKAlCBkcml2ZXMgdGhlIGxpdmUgcHJldmlldyBzbyB0aGUgZGltL2xpZ2h0IGNvbnRyb2xzXG4gICAgICogaGF2ZSB2aXNpYmxlIGZlZWRiYWNrIHJpZ2h0IG9uIHRoZSBjaGFydC4gIEluIGRpbS9kYXJrIG1vZGUgd2UgYWxzb1xuICAgICAqIGFwcGx5IGEgQ1NTIGJyaWdodG5lc3MgZmlsdGVyIG1hcHBlZCBmcm9tIGNmZy5kYXJrTGV2ZWwgKDEuNSAuLiAyLjhcbiAgICAgKiDihpIgMC42IC4uIDEuNCkgc28gdGhlIHVzZXIgY2FuIFNFRSB0aGUgYnJpZ2h0bmVzcyBzbGlkZXIgd29ya2luZy4gKi9cbiAgICBjb25zdCBpc0xpZ2h0ID0gY2ZnLnRoZW1lID09PSAnbGlnaHQnO1xuICAgIGNvbnN0IHBhbGV0dGUgPSBpc0xpZ2h0XG4gICAgICAgID8geyBiZzonI2Y4ZmFmYycsIGdyaWQ6JyNjYmQ1ZTEnLCB0aWNrOicjNDc1NTY5JywgYXhpczonIzFlMjkzYicsXG4gICAgICAgICAgICBwYW5lbEJnOidyZ2JhKDI0OCwyNTAsMjUyLDAuODUpJywgcGFuZWxCb3JkZXI6JyNjYmQ1ZTEnLFxuICAgICAgICAgICAgcGlsbEJnOicjZTJlOGYwJywgcGlsbEZnOicjNDc1NTY5JywgbWV0YUZnOicjNjQ3NDhiJyB9XG4gICAgICAgIDogeyBiZzonIzBiMTIyMCcsIGdyaWQ6JyMxZTI5M2InLCB0aWNrOicjOTRhM2I4JywgYXhpczonI2NiZDVlMScsXG4gICAgICAgICAgICBwYW5lbEJnOidyZ2JhKDE1LDIzLDQyLDAuNiknLCBwYW5lbEJvcmRlcjonIzFlMjkzYicsXG4gICAgICAgICAgICBwaWxsQmc6JyMxZTI5M2InLCBwaWxsRmc6JyM5NGEzYjgnLCBtZXRhRmc6JyM2NDc0OGInIH07XG4gICAgY29uc3QgZGltRmlsdGVyID0gaXNMaWdodFxuICAgICAgICA/ICdub25lJ1xuICAgICAgICA6IGBicmlnaHRuZXNzKCR7KE1hdGgubWF4KDEuNSwgTWF0aC5taW4oMi44LCBjZmcuZGFya0xldmVsIHx8IDIuMCkpIC8gMi4wKS50b0ZpeGVkKDIpfSlgO1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3VuZGVkLTJ4bCBwLTQgYm9yZGVyIHRyYW5zaXRpb24tY29sb3JzIGR1cmF0aW9uLTMwMFwiXG4gICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOiBwYWxldHRlLnBhbmVsQmcsIGJvcmRlckNvbG9yOiBwYWxldHRlLnBhbmVsQm9yZGVyfX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBtYi0zXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicGlsbFwiIHN0eWxlPXt7YmFja2dyb3VuZDpwYWxldHRlLnBpbGxCZywgY29sb3I6cGFsZXR0ZS5waWxsRmd9fT5QU1lDSFJPTUVUUklDIENIQVJUIMK3IGxpdmUgcHJldmlldzwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSBmb250LW1vbm9cIiBzdHlsZT17e2NvbG9yOnBhbGV0dGUubWV0YUZnfX0+e1RfTUlOfcKwQyDihpIge1RfTUFYfcKwQyAgwrcgIHtjZmcucmhMb33igJN7Y2ZnLnJoSGl9JSBSSDwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHN2ZyB2aWV3Qm94PXtgMCAwICR7V30gJHtIfWB9IGNsYXNzTmFtZT1cInctZnVsbCBoLWF1dG8gdHJhbnNpdGlvbi1bZmlsdGVyXSBkdXJhdGlvbi0zMDBcIlxuICAgICAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6IHBhbGV0dGUuYmcsIGJvcmRlclJhZGl1czo4LCBmaWx0ZXI6IGRpbUZpbHRlcn19PlxuICAgICAgICAgICAgICAgIHsvKiAtLS0tIGdyaWQ6IHZlcnRpY2FsIFQgbGluZXMsIGhvcml6b250YWwgVyBsaW5lcyAtLS0tICovfVxuICAgICAgICAgICAgICAgIHtBcnJheS5mcm9tKHtsZW5ndGg6MTF9KS5tYXAoKF8saSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ID0gVF9NSU4gKyAoaS8xMCkgKiAoVF9NQVggLSBUX01JTik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZyBrZXk9eyd2dCcraX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3godCl9IHkxPXtwYWQudG9wfSB4Mj17eCh0KX0geTI9e3BhZC50b3ArZ3JpZEh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPXtwYWxldHRlLmdyaWR9IHN0cm9rZVdpZHRoPVwiMC42XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3godCl9IHk9e3BhZC50b3ArZ3JpZEgrMTZ9IGZvbnRTaXplPVwiOS41XCIgZmlsbD17cGFsZXR0ZS50aWNrfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIj57dC50b0ZpeGVkKDApfTwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICB7QXJyYXkuZnJvbSh7bGVuZ3RoOjd9KS5tYXAoKF8saSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB3ID0gV19NSU4gKyAoaS82KSAqIChXX01BWCAtIFdfTUlOKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxnIGtleT17J2h3JytpfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17cGFkLmxlZnR9IHkxPXt5KHcpfSB4Mj17cGFkLmxlZnQrZ3JpZFd9IHkyPXt5KHcpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT17cGFsZXR0ZS5ncmlkfSBzdHJva2VXaWR0aD1cIjAuNlwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXtwYWQubGVmdC04fSB5PXt5KHcpKzN9IGZvbnRTaXplPVwiOS41XCIgZmlsbD17cGFsZXR0ZS50aWNrfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJlbmRcIj57KHcqMTAwMCkudG9GaXhlZCgwKX08L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgey8qIC0tLS0gUkggaXNvcGxldGhzIChjdXJ2ZXMpIC0tLS0gKi99XG4gICAgICAgICAgICAgICAge2lzb3BsZXRocy5tYXAocmggPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwdHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdCA9IFRfTUlOOyB0IDw9IFRfTUFYOyB0ICs9IDAuNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgd3cgPSBfZ2V0Vyh0LCByaCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod3cgPj0gV19NSU4gJiYgd3cgPD0gV19NQVgpIHB0cy5wdXNoKFt0LCB3d10pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZyBrZXk9eydpc28nK3JofT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cG9seWxpbmUgcG9pbnRzPXtzYWZlUHRzKHB0cyl9IGZpbGw9XCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPXtyaCA9PT0gMTAwID8gJyM2MzY2ZjEnIDogJyNlYzQ4OTk1NSd9IHN0cm9rZVdpZHRoPVwiMC44XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlRGFzaGFycmF5PXtyaCA9PT0gMTAwID8gJycgOiAnMywzJ30vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtwdHMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3gocHRzW01hdGguZmxvb3IocHRzLmxlbmd0aCowLjY1KV1bMF0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5PXt5KHB0c1tNYXRoLmZsb29yKHB0cy5sZW5ndGgqMC42NSldWzFdKSAtIDR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplPVwiOVwiIGZpbGw9XCIjZWM0ODk5OTlcIiBmb250V2VpZ2h0PVwiNzAwXCI+e3JofSU8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cblxuICAgICAgICAgICAgICAgIHsvKiAtLS0tIEdpdm9uaSBvdmVybGF5IChjb3BpZWQgdmVyYmF0aW0gZnJvbSBhcHAuanMgcmVuZGVyIG9yZGVyKSAtLS0tICovfVxuICAgICAgICAgICAgICAgIHtjZmcuZ2l2b25pICYmIChcbiAgICAgICAgICAgICAgICAgICAgPGcgY2xhc3NOYW1lPVwicG9pbnRlci1ldmVudHMtbm9uZVwiIG9wYWNpdHk9XCIwLjlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXt4KDQwKX0geTE9e3koMTYvMTAwMCl9IHgyPXt4KDUwKX0geTI9e3koMTYvMTAwMCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCIjNjM2NmYxXCIgc3Ryb2tlV2lkdGg9XCIxLjVcIiBzdHJva2VEYXNoYXJyYXk9XCI0LDRcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17eCg1MCl9IHkxPXt5KDE2LzEwMDApfSB4Mj17eCg1MCl9IHkyPXt5KDApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiIzYzNjZmMVwiIHN0cm9rZVdpZHRoPVwiMS41XCIgc3Ryb2tlRGFzaGFycmF5PVwiNCw0XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3goNDEpfSB5MT17eSgwKX0geDI9e3goNTApfSB5Mj17eSgwKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cIiM2MzY2ZjFcIiBzdHJva2VXaWR0aD1cIjEuNVwiIHN0cm9rZURhc2hhcnJheT1cIjQsNFwiLz5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKE1DVil9ICBmaWxsPVwiI2VjNDg5OVwiIGZpbGxPcGFjaXR5PVwiMC4wNVwiIHN0cm9rZT1cIiNlYzQ4OTlcIiBzdHJva2VXaWR0aD1cIjFcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoTWFzcyl9IGZpbGw9XCIjOGI1Y2Y2XCIgZmlsbE9wYWNpdHk9XCIwLjA1XCIgc3Ryb2tlPVwiIzhiNWNmNlwiIHN0cm9rZVdpZHRoPVwiMVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhFVkFQKX0gZmlsbD1cIiMwNmI2ZDRcIiBmaWxsT3BhY2l0eT1cIjAuMDhcIiBzdHJva2U9XCIjMDZiNmQ0XCIgc3Ryb2tlV2lkdGg9XCIxXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKE5WKX0gICBmaWxsPVwiI2Y1OWUwYlwiIGZpbGxPcGFjaXR5PVwiMC4wNVwiIHN0cm9rZT1cIiNmNTllMGJcIiBzdHJva2VXaWR0aD1cIjFcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoQ1opfSAgIGZpbGw9XCIjMTBiOTgxXCIgZmlsbE9wYWNpdHk9XCIwLjE1XCIgc3Ryb2tlPVwiIzEwYjk4MVwiIHN0cm9rZVdpZHRoPVwiMS4yXCIvPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICB7LyogU3dlZXQtc3BvdCBiYW5kLCBjbGlwcGVkIHRvIENaICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgPGRlZnM+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNsaXBQYXRoIGlkPVwiY3otY2xpcC13YWxrXCIgY2xpcFBhdGhVbml0cz1cInVzZXJTcGFjZU9uVXNlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhDWil9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2NsaXBQYXRoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kZWZzPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKFNXRUVUKX0gY2xpcFBhdGg9XCJ1cmwoI2N6LWNsaXAtd2FsaylcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbD1cIiMwNTk2NjlcIiBmaWxsT3BhY2l0eT1cIjAuMzJcIiBzdHJva2U9XCIjMDQ3ODU3XCIgc3Ryb2tlV2lkdGg9XCIwLjhcIiBzdHJva2VEYXNoYXJyYXk9XCIzLDJcIi8+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhXSU5URVIpfSBmaWxsPVwiIzNiODJmNlwiIGZpbGxPcGFjaXR5PVwiMC4xNVwiIHN0cm9rZT1cIm5vbmVcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17eCgxOSl9IHkxPXtwYWQudG9wKzE4fSB4Mj17eCgxOSl9IHkyPXtwYWQudG9wK2dyaWRIfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiIzNiODJmNlwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZURhc2hhcnJheT1cIjYsNFwiIG9wYWNpdHk9XCIwLjhcIi8+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBSZWdpb24gbGFiZWxzIOKAlCBzYW1lIGNvbG9ycyAmIHNwaXJpdCBhcyBsaXZlIGNoYXJ0ICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCg1MCktMTB9IHk9e3koOC8xMDAwKX0gZmlsbD1cIiM2MzY2ZjFcIiBmb250U2l6ZT1cIjEwXCIgZm9udFdlaWdodD1cIjkwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgdHJhbnNmb3JtPXtgcm90YXRlKC05MCwgJHt4KDUwKS0xMH0sICR7eSg4LzEwMDApfSlgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZz1cIjJcIj5NRUNIQU5JQ0FMIENPT0xJTkc8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDQ0KS0yfSB5PXt5KDgvMTAwMCl9IGZpbGw9XCIjZWM0ODk5XCIgZm9udFNpemU9XCI5XCIgZm9udFdlaWdodD1cIjkwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgdHJhbnNmb3JtPXtgcm90YXRlKC05MCwgJHt4KDQ0KS0yfSwgJHt5KDgvMTAwMCl9KWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nPVwiMS41XCI+TUFTUyBDT09MSU5HPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCgzNyktMTB9IHk9e3koOC8xMDAwKX0gZmlsbD1cIiM4YjVjZjZcIiBmb250U2l6ZT1cIjlcIiBmb250V2VpZ2h0PVwiOTAwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiB0cmFuc2Zvcm09e2Byb3RhdGUoLTkwLCAke3goMzcpLTEwfSwgJHt5KDgvMTAwMCl9KWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nPVwiMS41XCI+TUFTUyBDT09MSU5HPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCgzNCl9IHk9e3koMC41LzEwMDApLTh9IGZpbGw9XCIjMDZiNmQ0XCIgZm9udFNpemU9XCI5XCIgZm9udFdlaWdodD1cIjkwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgbGV0dGVyU3BhY2luZz1cIjJcIj5FVkFQT1JBVElWRTwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goMjMuNSl9IHk9e3koX2dldFcoMjMuNSwgNDUpKX0gZmlsbD1cIiMxMGI5ODFcIiBmb250U2l6ZT1cIjExXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ9XCI5MDBcIiB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgbGV0dGVyU3BhY2luZz1cIjEuNVwiPkNPTUZPUlQ8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDE4Ljc1KX0geT17eShfZ2V0VygxOC43NSwgNDUpKX0gZmlsbD1cIiMzYjgyZjZcIiBmb250U2l6ZT1cIjExXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ9XCI5MDBcIiB0ZXh0QW5jaG9yPVwibWlkZGxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybT17YHJvdGF0ZSgtOTAsICR7eCgxOC43NSl9LCAke3koX2dldFcoMTguNzUsIDQ1KSl9KWB9PldJTlRFUjwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goMjMuNSl9IHk9e3koX2dldFcoMjMuNSwgKGNmZy5yaExvK2NmZy5yaEhpKS8yKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxsPVwiIzAyMmMyMlwiIGZvbnRTaXplPVwiOFwiIGZvbnRXZWlnaHQ9XCI5MDBcIiB0ZXh0QW5jaG9yPVwibWlkZGxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7cGFpbnRPcmRlcjonc3Ryb2tlJywgc3Ryb2tlOicjYTdmM2QwJywgc3Ryb2tlV2lkdGg6JzIuNXB4Jywgc3Ryb2tlTGluZWpvaW46J3JvdW5kJ319XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nPVwiMS41XCI+e2NmZy5yaExvfS17Y2ZnLnJoSGl9JSBSSDwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgICAgICB7LyogYXhpcyBsYWJlbHMgKi99XG4gICAgICAgICAgICAgICAgPHRleHQgeD17cGFkLmxlZnQgKyBncmlkVy8yfSB5PXtILTEyfSBmb250U2l6ZT1cIjExXCIgZmlsbD17cGFsZXR0ZS5heGlzfVxuICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiBmb250V2VpZ2h0PVwiODAwXCIgbGV0dGVyU3BhY2luZz1cIjJcIj5EUlkgQlVMQiBURU1QICjCsEMpPC90ZXh0PlxuICAgICAgICAgICAgICAgIDx0ZXh0IHg9ezE2fSB5PXtwYWQudG9wICsgZ3JpZEgvMn0gZm9udFNpemU9XCIxMVwiIGZpbGw9e3BhbGV0dGUuYXhpc31cbiAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgZm9udFdlaWdodD1cIjgwMFwiIGxldHRlclNwYWNpbmc9XCIyXCJcbiAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm09e2Byb3RhdGUoLTkwIDE2ICR7cGFkLnRvcCArIGdyaWRILzJ9KWB9PkhVTUlESVRZIFJBVElPIChnL2tnKTwvdGV4dD5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG5mdW5jdGlvbiBQc3lDb250cm9sUGFuZWwoeyBjZmcsIHVwZGF0ZSwgc2V0Q2ZnIH0pIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXNsYXRlLTkwMC82MCBib3JkZXIgYm9yZGVyLXNsYXRlLTgwMCByb3VuZGVkLTJ4bCBwLTUgc3BhY2UteS02XCI+XG4gICAgICAgICAgICB7LyogVGhlbWUgKyBicmlnaHRuZXNzICAtLSByZWxvY2F0ZWQgZnJvbSB0aGUgZGFzaGJvYXJkIHNpZGViYXIgMjAyNi0wNi0yNS5cbiAgICAgICAgICAgICAgICBUd28gY29udHJvbHM6IERhcmsvTGlnaHQgbW9kZSB0b2dnbGUsIGFuZCBCcmlnaHRuZXNzIHNsaWRlciAob25seVxuICAgICAgICAgICAgICAgIG1lYW5pbmdmdWwgaW4gZGFyayBtb2RlKS4gIExpdmUgcHJldmlldyBhcHBsaWVzIHRvIHRoZSBzdXJyb3VuZGluZ1xuICAgICAgICAgICAgICAgIGNvbnRyb2wgcGFuZWwgc28gdGhlIG9wZXJhdG9yIGNhbiBGRUVMIHRoZSBjaGFuZ2UgYmVmb3JlIHNhdmluZy4gKi99XG4gICAgICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwicHN5LWNmZy10aGVtZS1ibG9ja1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMlwiPkRpc3BsYXkgTW9kZTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtMiBtYi0zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJwc3ktY2ZnLXRoZW1lLWRhcmtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldENmZyhjID0+ICh7Li4uYywgdGhlbWU6J2RhcmsnLCBkYXJrTGV2ZWw6TWF0aC5taW4oYy5kYXJrTGV2ZWwgfHwgMi4wLCAyLjYpfSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB5LTIuNSByb3VuZGVkLWxnIHRleHQteHMgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGJvcmRlciB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2NmZy50aGVtZSA9PT0gJ2RhcmsnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1zbGF0ZS04MDAgYm9yZGVyLXllbGxvdy01MDAvNzAgdGV4dC15ZWxsb3ctMzAwIHNoYWRvdy1sZyBzaGFkb3cteWVsbG93LTUwMC8xMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLXNsYXRlLTkwMC8zMCBib3JkZXItc2xhdGUtNzAwIHRleHQtc2xhdGUtNTAwIGhvdmVyOmJnLXNsYXRlLTgwMC82MCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICDwn4yZICBEaW0gLyBEYXJrXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwicHN5LWNmZy10aGVtZS1saWdodFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0Q2ZnKGMgPT4gKHsuLi5jLCB0aGVtZTonbGlnaHQnLCBkYXJrTGV2ZWw6My4wfSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB5LTIuNSByb3VuZGVkLWxnIHRleHQteHMgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGJvcmRlciB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2NmZy50aGVtZSA9PT0gJ2xpZ2h0J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctc2xhdGUtMTAwIGJvcmRlci1za3ktNTAwLzcwIHRleHQtc2t5LTcwMCBzaGFkb3ctbGcgc2hhZG93LXNreS01MDAvMTAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1zbGF0ZS05MDAvMzAgYm9yZGVyLXNsYXRlLTcwMCB0ZXh0LXNsYXRlLTUwMCBob3ZlcjpiZy1zbGF0ZS04MDAvNjAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAg4piAICBMaWdodFxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICB7LyogQnJpZ2h0bmVzcyBzbGlkZXIg4oCUIG9ubHkgbWVhbmluZ2Z1bCB3aGVuIHRoZW1lID09PSAnZGFyaycgKi99XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NmZy50aGVtZSA9PT0gJ2xpZ2h0JyA/ICdvcGFjaXR5LTQwIHBvaW50ZXItZXZlbnRzLW5vbmUnIDogJyd9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBtYi0xXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJvbGQgdGV4dC1zbGF0ZS01MDBcIj5EaW0gYnJpZ2h0bmVzczwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSBmb250LW1vbm8gdGV4dC15ZWxsb3ctMzAwIHRhYnVsYXItbnVtc1wiPntNYXRoLnJvdW5kKChjZmcuZGFya0xldmVsIHx8IDIuMCkgKiAxMDApfSU8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwicHN5LWNmZy1kYXJrLWxldmVsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbj1cIjEuNVwiIG1heD1cIjIuOFwiIHN0ZXA9XCIwLjAyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtjZmcudGhlbWUgPT09ICdsaWdodCcgPyAyLjAgOiAoY2ZnLmRhcmtMZXZlbCB8fCAyLjApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIGRhcmtMZXZlbDogcGFyc2VGbG9hdChlLnRhcmdldC52YWx1ZSksIHRoZW1lOidkYXJrJ30pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLWlucHV0IHctZnVsbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBhY2NlbnRDb2xvcjonI2ZhY2MxNScgfX0vPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTIgaXRhbGljXCI+XG4gICAgICAgICAgICAgICAgICAgIEFwcGxpZWQgdG8gdGhlIHdob2xlIGRhc2hib2FyZC4gIERpbSBpcyByZWNvbW1lbmRlZCBmb3IgY29udHJvbCByb29tczsgTGlnaHQgZm9yIGRheXRpbWUgd2Fsay10aHJvdWdocy5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIEdpdm9uaSB0b2dnbGUgKi99XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMlwiPkdpdm9uaSBFbmdpbmU8L2Rpdj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHVwZGF0ZSgnZ2l2b25pJywgIWNmZy5naXZvbmkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdy1mdWxsIHB5LTMgcm91bmRlZC14bCB0ZXh0LXNtIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjZmcuZ2l2b25pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctaW5kaWdvLTYwMCB0ZXh0LXdoaXRlIHNoYWRvdy1sZyBzaGFkb3ctaW5kaWdvLTUwMC8zMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1zbGF0ZS04MDAgdGV4dC1zbGF0ZS00MDAgYm9yZGVyIGJvcmRlci1zbGF0ZS03MDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICB7Y2ZnLmdpdm9uaSA/ICdHaXZvbmkgT04nIDogJ0dpdm9uaSBPRkYnfVxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTIgbGVhZGluZy1yZWxheGVkXCI+XG4gICAgICAgICAgICAgICAgICAgIE92ZXJsYXlzIHRoZSA0IGNsaW1hdGUtc3RyYXRlZ3kgcmVnaW9ucyAoQ29tZm9ydCwgTmF0IFZlbnQsIEV2YXAsIE1lY2ggQ29vbCkuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBSSCByYW5nZSAqL31cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0yXCI+UkggU3dlZXQtU3BvdCBSYW5nZTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItM1wiPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJvbGQgdGV4dC1zbGF0ZS01MDAgbWItMSBibG9ja1wiPlZlbnVlIHByZXNldDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXQgY3Vyc29yLXBvaW50ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtjZmcucmhQcmVzZXQgfHwgJ2N1c3RvbSd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHAgPSBSSF9QUkVTRVRTLmZpbmQocCA9PiBwLmlkID09PSBlLnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocC5pZCA9PT0gJ2N1c3RvbScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZSgncmhQcmVzZXQnLCAnY3VzdG9tJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIHJoUHJlc2V0OnAuaWQsIHJoTG86cC5sbywgcmhIaTpwLmhpfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7UkhfUFJFU0VUUy5tYXAocCA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBrZXk9e3AuaWR9IHZhbHVlPXtwLmlkfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3AubGFiZWx9e3AubG8gIT0gbnVsbCA/IGAgIMK3ICAke3AubG99LSR7cC5oaX0lIFJIYCA6ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgICAgICB7KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHAgPSBSSF9QUkVTRVRTLmZpbmQoeCA9PiB4LmlkID09PSAoY2ZnLnJoUHJlc2V0IHx8ICdjdXN0b20nKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcCAmJiBwLm5vdGUgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbXQtMS41IGl0YWxpY1wiPntwLm5vdGV9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgKSA6IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH0pKCl9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMyBtYi0yXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1tb25vIHRleHQtc2xhdGUtNDAwIHctMTBcIj57Y2ZnLnJoTG99JTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj1cIjIwXCIgbWF4PXtjZmcucmhIaS01fSB2YWx1ZT17Y2ZnLnJoTG99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldENmZyhjID0+ICh7Li4uYywgcmhMbzorZS50YXJnZXQudmFsdWUsIHJoUHJlc2V0OidjdXN0b20nfSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2UtaW5wdXQgZmxleC0xXCIvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyBmb250LW1vbm8gdGV4dC1zbGF0ZS00MDAgdy0xMFwiPntjZmcucmhIaX0lPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPXtjZmcucmhMbys1fSBtYXg9XCI5MFwiIHZhbHVlPXtjZmcucmhIaX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0Q2ZnKGMgPT4gKHsuLi5jLCByaEhpOitlLnRhcmdldC52YWx1ZSwgcmhQcmVzZXQ6J2N1c3RvbSd9KSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyYW5nZS1pbnB1dCBmbGV4LTFcIi8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIEF4aXMgcmFuZ2UgKi99XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMlwiPlRlbXBlcmF0dXJlIEF4aXMgUmFuZ2U8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zIG1iLTJcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyBmb250LW1vbm8gdGV4dC1zbGF0ZS00MDAgdy0xMFwiPntjZmcudExvfcKwPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPVwiLTQwXCIgbWF4PXtjZmcudEhpLTEwfSB2YWx1ZT17Y2ZnLnRMb31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlKCd0TG8nLCArZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2UtaW5wdXQgZmxleC0xXCIvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyBmb250LW1vbm8gdGV4dC1zbGF0ZS00MDAgdy0xMFwiPntjZmcudEhpfcKwPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPXtjZmcudExvKzEwfSBtYXg9XCI2MFwiIHZhbHVlPXtjZmcudEhpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGUoJ3RIaScsICtlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyYW5nZS1pbnB1dCBmbGV4LTFcIi8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbXQtMiBsZWFkaW5nLXJlbGF4ZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgQ2hhcnQgd2lsbCBiZSByZWRyYXduIHdpdGggdGhpcyBkcnktYnVsYiB0ZW1wZXJhdHVyZSB3aW5kb3cuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyLXQgYm9yZGVyLXNsYXRlLTgwMCBwdC00XCI+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbGVhZGluZy1yZWxheGVkXCI+XG4gICAgICAgICAgICAgICAgICAgIENoYW5nZXMgcHJldmlldyBsaXZlIGluIHRoZSBza2VsZXRvbiBjaGFydCBvbiB0aGUgbGVmdC4gIEhpdFxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWluZGlnby00MDAgZm9udC1ibGFja1wiPiBTYXZlICYgcmV0dXJuIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgaW4gdGhlIGhlYWRlciB3aGVuIHlvdSdyZSBoYXBweS5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTG9jYXRpb24gU2V0dGluZyAtLSBtb2RhbCB3LyBpbnRlcmFjdGl2ZSBMZWFmbGV0IG1hcCArIHJldmVyc2UgZ2VvY29kaW5nXG4gKiBDbGljayBhbnl3aGVyZSBvbiB0aGUgbWFwIChvciBkcmFnIHRoZSBtYXJrZXIpIHRvIHNldCBsYXQvbG9uLlxuICogTWFudWFsIGxhdC9sb24gZWRpdHMgcmUtY2VudHJlIHRoZSBtYXJrZXIuICBDaXR5IG5hbWUgaXMgYXV0by1wb3B1bGF0ZWRcbiAqIHZpYSBPcGVuU3RyZWV0TWFwIE5vbWluYXRpbSAobm8ga2V5IHJlcXVpcmVkLCByYXRlLWxpbWl0ZWQgdG8gfjEgcmVxL3MpLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuZnVuY3Rpb24gTG9jYXRpb25Nb2RhbCh7IGNmZywgc2V0Q2ZnLCBvbkNsb3NlLCBvblNhdmUgfSkge1xuICAgIGNvbnN0IG1hcEJveFJlZiA9IFJlYWN0LnVzZVJlZihudWxsKTtcbiAgICBjb25zdCBtYXBSZWYgICAgPSBSZWFjdC51c2VSZWYobnVsbCk7XG4gICAgY29uc3QgbWFya2VyUmVmID0gUmVhY3QudXNlUmVmKG51bGwpO1xuICAgIGNvbnN0IFtnZW9CdXN5LCBzZXRHZW9CdXN5XSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcblxuICAgIC8qIC0tLS0tIHNlYXJjaCBzdGF0ZSAtLS0tLSAqL1xuICAgIGNvbnN0IFtzZWFyY2hRLCBzZXRTZWFyY2hRXSAgICAgICAgID0gUmVhY3QudXNlU3RhdGUoJycpO1xuICAgIGNvbnN0IFtzZWFyY2hIaXRzLCBzZXRTZWFyY2hIaXRzXSAgID0gUmVhY3QudXNlU3RhdGUoW10pO1xuICAgIGNvbnN0IFtzZWFyY2hCdXN5LCBzZXRTZWFyY2hCdXN5XSAgID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IFtzZWFyY2hPcGVuLCBzZXRTZWFyY2hPcGVuXSAgID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IHNlYXJjaERlYm91bmNlUmVmICAgICAgICAgICAgID0gUmVhY3QudXNlUmVmKG51bGwpO1xuXG4gICAgLyogRm9yd2FyZC1nZW9jb2RlOiBxdWVyeSAtPiBbe2xhdCwgbG9uLCBkaXNwbGF5X25hbWUsIHR5cGUsIC4uLn1dICovXG4gICAgY29uc3QgcnVuU2VhcmNoID0gYXN5bmMgKHEpID0+IHtcbiAgICAgICAgaWYgKCFxIHx8IHEudHJpbSgpLmxlbmd0aCA8IDMpIHsgc2V0U2VhcmNoSGl0cyhbXSk7IHJldHVybjsgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2V0U2VhcmNoQnVzeSh0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGBodHRwczovL25vbWluYXRpbS5vcGVuc3RyZWV0bWFwLm9yZy9zZWFyY2g/Zm9ybWF0PWpzb24mbGltaXQ9NiZxPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHEpfWA7XG4gICAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7IGhlYWRlcnM6eyAnQWNjZXB0JzonYXBwbGljYXRpb24vanNvbicgfSB9KTtcbiAgICAgICAgICAgIGNvbnN0IGogPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgICAgIHNldFNlYXJjaEhpdHMoQXJyYXkuaXNBcnJheShqKSA/IGogOiBbXSk7XG4gICAgICAgICAgICBzZXRTZWFyY2hPcGVuKHRydWUpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IHNldFNlYXJjaEhpdHMoW10pOyB9XG4gICAgICAgIGZpbmFsbHkgeyBzZXRTZWFyY2hCdXN5KGZhbHNlKTsgfVxuICAgIH07XG5cbiAgICAvKiBkZWJvdW5jZWQgc2VhcmNoLW9uLXR5cGUgKi9cbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoc2VhcmNoRGVib3VuY2VSZWYuY3VycmVudCkgY2xlYXJUaW1lb3V0KHNlYXJjaERlYm91bmNlUmVmLmN1cnJlbnQpO1xuICAgICAgICBzZWFyY2hEZWJvdW5jZVJlZi5jdXJyZW50ID0gc2V0VGltZW91dCgoKSA9PiBydW5TZWFyY2goc2VhcmNoUSksIDQwMCk7XG4gICAgICAgIHJldHVybiAoKSA9PiBzZWFyY2hEZWJvdW5jZVJlZi5jdXJyZW50ICYmIGNsZWFyVGltZW91dChzZWFyY2hEZWJvdW5jZVJlZi5jdXJyZW50KTtcbiAgICB9LCBbc2VhcmNoUV0pO1xuXG4gICAgY29uc3QgcGlja1NlYXJjaEhpdCA9IChoaXQpID0+IHtcbiAgICAgICAgY29uc3QgbGF0ID0gTWF0aC5yb3VuZCgraGl0LmxhdCAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICBjb25zdCBsb24gPSBNYXRoLnJvdW5kKCtoaXQubG9uICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgbGF0LCBsb24sIGNpdHk6aGl0LmRpc3BsYXlfbmFtZX0pKTtcbiAgICAgICAgaWYgKG1hcFJlZi5jdXJyZW50KSBtYXBSZWYuY3VycmVudC5zZXRWaWV3KFtsYXQsIGxvbl0sIGhpdC50eXBlID09PSAnY2l0eScgPyAxMSA6IDE1KTtcbiAgICAgICAgc2V0U2VhcmNoT3BlbihmYWxzZSk7XG4gICAgICAgIHNldFNlYXJjaFEoJycpO1xuICAgIH07XG5cbiAgICAvKiBSZXZlcnNlLWdlb2NvZGUgbGF0L2xvbiAtPiBjaXR5IC8gY291bnRyeSB2aWEgTm9taW5hdGltLiAgTm8gQVBJIGtleS4gKi9cbiAgICBjb25zdCByZXZlcnNlR2VvY29kZSA9IGFzeW5jIChsYXQsIGxvbikgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2V0R2VvQnVzeSh0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGBodHRwczovL25vbWluYXRpbS5vcGVuc3RyZWV0bWFwLm9yZy9yZXZlcnNlP2Zvcm1hdD1qc29uJmxhdD0ke2xhdH0mbG9uPSR7bG9ufSZ6b29tPTEwYDtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCh1cmwsIHsgaGVhZGVyczogeyAnQWNjZXB0JzonYXBwbGljYXRpb24vanNvbicgfSB9KTtcbiAgICAgICAgICAgIGNvbnN0IGogPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgICAgIGNvbnN0IGEgPSBqLmFkZHJlc3MgfHwge307XG4gICAgICAgICAgICBjb25zdCBjaXR5ID0gYS5jaXR5IHx8IGEudG93biB8fCBhLnZpbGxhZ2UgfHwgYS5oYW1sZXQgfHwgYS5jb3VudHkgfHwgJyc7XG4gICAgICAgICAgICBjb25zdCByZWdpb24gPSBhLnN0YXRlIHx8IGEucmVnaW9uIHx8ICcnO1xuICAgICAgICAgICAgY29uc3QgY291bnRyeSA9IGEuY291bnRyeSB8fCAnJztcbiAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gW2NpdHksIHJlZ2lvbiwgY291bnRyeV0uZmlsdGVyKEJvb2xlYW4pLmpvaW4oJywgJykgfHwgai5kaXNwbGF5X25hbWUgfHwgJyc7XG4gICAgICAgICAgICBpZiAobGFiZWwpIHNldENmZyhjID0+ICh7Li4uYywgY2l0eTpsYWJlbH0pKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBvZmZsaW5lIG9yIHJhdGUtbGltaXRlZCAtPiBrZWVwIHByaW9yIG5hbWUgKi8gfVxuICAgICAgICBmaW5hbGx5IHsgc2V0R2VvQnVzeShmYWxzZSk7IH1cbiAgICB9O1xuXG4gICAgLyogSW5pdCBMZWFmbGV0IG9uIGZpcnN0IHJlbmRlciBvZiB0aGUgbW9kYWwgKi9cbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoIW1hcEJveFJlZi5jdXJyZW50IHx8IG1hcFJlZi5jdXJyZW50KSByZXR1cm47XG4gICAgICAgIGNvbnN0IG1hcCA9IEwubWFwKG1hcEJveFJlZi5jdXJyZW50LCB7IHpvb21Db250cm9sOiB0cnVlLCBhdHRyaWJ1dGlvbkNvbnRyb2w6IHRydWUgfSlcbiAgICAgICAgICAgICAgICAgICAgIC5zZXRWaWV3KFtjZmcubGF0LCBjZmcubG9uXSwgNik7XG4gICAgICAgIEwudGlsZUxheWVyKCdodHRwczovL3tzfS50aWxlLm9wZW5zdHJlZXRtYXAub3JnL3t6fS97eH0ve3l9LnBuZycsIHtcbiAgICAgICAgICAgIG1heFpvb206IDE4LFxuICAgICAgICAgICAgYXR0cmlidXRpb246ICcmY29weTsgT3BlblN0cmVldE1hcCBjb250cmlidXRvcnMnLFxuICAgICAgICB9KS5hZGRUbyhtYXApO1xuXG4gICAgICAgIGNvbnN0IG1hcmtlciA9IEwubWFya2VyKFtjZmcubGF0LCBjZmcubG9uXSwgeyBkcmFnZ2FibGU6IHRydWUgfSkuYWRkVG8obWFwKTtcbiAgICAgICAgbWFya2VyLmJpbmRUb29sdGlwKCdEcmFnIG1lIG9yIGNsaWNrIGFueXdoZXJlIG9uIHRoZSBtYXAnLCB7IHBlcm1hbmVudDogZmFsc2UgfSk7XG5cbiAgICAgICAgY29uc3QgYXBwbHlMYXRMb24gPSAobGF0LCBsb24pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHIgPSAobikgPT4gTWF0aC5yb3VuZChuICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIGxhdDpyKGxhdCksIGxvbjpyKGxvbil9KSk7XG4gICAgICAgICAgICByZXZlcnNlR2VvY29kZShyKGxhdCksIHIobG9uKSk7XG4gICAgICAgIH07XG4gICAgICAgIG1hcmtlci5vbignZHJhZ2VuZCcsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxsID0gbWFya2VyLmdldExhdExuZygpO1xuICAgICAgICAgICAgYXBwbHlMYXRMb24obGwubGF0LCBsbC5sbmcpO1xuICAgICAgICB9KTtcbiAgICAgICAgbWFwLm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICBtYXJrZXIuc2V0TGF0TG5nKGUubGF0bG5nKTtcbiAgICAgICAgICAgIGFwcGx5TGF0TG9uKGUubGF0bG5nLmxhdCwgZS5sYXRsbmcubG5nKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbWFwUmVmLmN1cnJlbnQgPSBtYXA7XG4gICAgICAgIG1hcmtlclJlZi5jdXJyZW50ID0gbWFya2VyO1xuXG4gICAgICAgIC8qIExlYWZsZXQgcmVuZGVycyBibGFuayBpZiBpdCBib290cyBpbnNpZGUgYSBoaWRkZW4gZWxlbWVudCDigJQga2ljayBpdFxuICAgICAgICAgICBvbmNlIHRoZSBtb2RhbCBhbmltYXRpb24gc2V0dGxlcy4gKi9cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiBtYXAuaW52YWxpZGF0ZVNpemUoKSwgMjUwKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHsgbWFwLnJlbW92ZSgpOyBtYXBSZWYuY3VycmVudCA9IG51bGw7IG1hcmtlclJlZi5jdXJyZW50ID0gbnVsbDsgfTtcbiAgICB9LCBbXSk7XG5cbiAgICAvKiBLZWVwIG1hcmtlciBpbiBzeW5jIHdoZW4gdXNlciBlZGl0cyBsYXQvbG9uIGZpZWxkcyBtYW51YWxseSAqL1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmIChtYXBSZWYuY3VycmVudCAmJiBtYXJrZXJSZWYuY3VycmVudCkge1xuICAgICAgICAgICAgbWFya2VyUmVmLmN1cnJlbnQuc2V0TGF0TG5nKFtjZmcubGF0LCBjZmcubG9uXSk7XG4gICAgICAgICAgICBtYXBSZWYuY3VycmVudC5wYW5UbyhbY2ZnLmxhdCwgY2ZnLmxvbl0pO1xuICAgICAgICB9XG4gICAgfSwgW2NmZy5sYXQsIGNmZy5sb25dKTtcblxuICAgIGNvbnN0IHVzZU15TG9jYXRpb24gPSAoKSA9PiB7XG4gICAgICAgIGlmICghbmF2aWdhdG9yLmdlb2xvY2F0aW9uKSByZXR1cm47XG4gICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oXG4gICAgICAgICAgICAocG9zKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGF0ID0gTWF0aC5yb3VuZChwb3MuY29vcmRzLmxhdGl0dWRlICAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxvbiA9IE1hdGgucm91bmQocG9zLmNvb3Jkcy5sb25naXR1ZGUgKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIGxhdCwgbG9ufSkpO1xuICAgICAgICAgICAgICAgIGlmIChtYXBSZWYuY3VycmVudCkgbWFwUmVmLmN1cnJlbnQuc2V0VmlldyhbbGF0LCBsb25dLCAxMSk7XG4gICAgICAgICAgICAgICAgcmV2ZXJzZUdlb2NvZGUobGF0LCBsb24pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIChlcnIpID0+IHsgLyogdXNlciBkZW5pZWQgb3IgdW5hdmFpbGFibGUgLT4gbm8tb3AgKi8gfVxuICAgICAgICApO1xuICAgIH07XG5cbiAgICAvKiBXaGVuIHVzZXIgY2xpY2tzIFwiU2F2ZSAmIHJldHVyblwiLCBQT1NUIHRoZSBzZWxlY3Rpb24gdG8gdGhlIHNhbWVcbiAgICAgKiAvYXBpL3dlYXRoZXItbG9jYXRpb24gZW5kcG9pbnQgdGhlIGRhc2hib2FyZCByZWFkcy4gIFNldHRpbmcgQk9USFxuICAgICAqIGBhY3RpdmVgIGFuZCBgZGVmYXVsdGAgbWVhbnMgdGhlIHdlYXRoZXIgc3RyaXAgb24gdGhlIGRhc2hib2FyZFxuICAgICAqIGxvYWRzIHRoaXMgbG9jYXRpb24gaW1tZWRpYXRlbHkgb24gbmV4dCBwYWdlIGxvYWQgKGFuZCBzdGF5cyBwaW5uZWRcbiAgICAgKiBmb3IgYW55IGZ1dHVyZSBmcmVzaCBzZXNzaW9ucykuICBBbm9ueW1vdXMgdXNlcnMgZ2V0IGEgc29mdCB3YXJuaW5nXG4gICAgICogYmFjayBmcm9tIHRoZSBzZXJ2ZXIgKHBlcnNpc3RlZDpmYWxzZSkgLS0gd2Ugc3VyZmFjZSB0aGF0IGFzIGEgdG9hc3RcbiAgICAgKiBzbyB0aGUgb3BlcmF0b3Iga25vd3MgdGhleSBuZWVkIHRvIHNpZ24gaW4gdG8ga2VlcCB0aGUgcGljayBhY3Jvc3NcbiAgICAgKiBwYWdlIHJlbG9hZHMuICBXZSBhbHdheXMgYWxzbyB3cml0ZSB0byBsb2NhbFN0b3JhZ2Ugc28gdGhlIFNBTUVcbiAgICAgKiB0YWIga2VlcHMgdGhlIGNob3NlbiBsb2NhdGlvbiBmb3IgdGhlIGN1cnJlbnQgc2Vzc2lvbi4gKi9cbiAgICBjb25zdCBbc2F2ZU1zZywgc2V0U2F2ZU1zZ10gPSBSZWFjdC51c2VTdGF0ZShudWxsKTtcbiAgICBjb25zdCBwZXJzaXN0QW5kU2F2ZSA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgbG9jID0geyBsYXQ6IGNmZy5sYXQsIGxvbjogY2ZnLmxvbiwgbmFtZTogY2ZnLnNpdGVOYW1lIHx8IGNmZy5jaXR5IH07XG4gICAgICAgIC8qIExvY2FsIGZhbGxiYWNrIOKAlCB3b3JrcyBmb3IgYW5vbnltb3VzIHVzZXJzIHNvIHRoZSBkYXNoYm9hcmQgYXRcbiAgICAgICAgICogbGVhc3Qgc2VlcyB0aGUgbmV3IGxhdC9sb24gaW4gdGhlIHNhbWUgYnJvd3Nlci4gKi9cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1LndlYXRoZXJfbG9jYXRpb24nLCBKU09OLnN0cmluZ2lmeShsb2MpKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBwcml2YXRlIG1vZGUgLS0gaWdub3JlICovIH1cblxuICAgICAgICBsZXQgcGVyc2lzdGVkID0gZmFsc2UsIHdhcm5pbmcgPSAnJztcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCgnL2FwaS93ZWF0aGVyLWxvY2F0aW9uJywge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzonYXBwbGljYXRpb24vanNvbicgfSxcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGFjdGl2ZTogbG9jLCBkZWZhdWx0OiBsb2MgfSksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IGogPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgICAgIHdpbmRvdy5fbGFzdFdlYXRoZXJMb2NhdGlvblNhdmUgPSBqO1xuICAgICAgICAgICAgcGVyc2lzdGVkID0gISFqLnBlcnNpc3RlZDtcbiAgICAgICAgICAgIHdhcm5pbmcgICA9IGoud2FybmluZyB8fCAnJztcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnW3NldHVwIHdhbGtdIC9hcGkvd2VhdGhlci1sb2NhdGlvbiA8LScsIGopO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB3YXJuaW5nID0gJ05ldHdvcmsgZXJyb3Ig4oCUIHNhdmVkIGxvY2FsbHkgb25seS4nO1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdbc2V0dXAgd2Fsa10gY291bGQgbm90IHBlcnNpc3QgbG9jYXRpb246JywgZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGVyc2lzdGVkKSB7XG4gICAgICAgICAgICBvblNhdmUoKTsgICAgICAgICAgIC8vIGhhcHB5IHBhdGg6IGNsb3NlICsgbWFyayBzdGVwIGRvbmVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8qIFN1cmZhY2UgdGhlIHdhcm5pbmcsIGhvbGQgdGhlIG1vZGFsIG9wZW4gZm9yIDEuNnMgc28gdGhlXG4gICAgICAgICAgICAgKiBvcGVyYXRvciByZWFkcyBpdCwgdGhlbiBjbG9zZS4gIFRoZSBsb2NhbCBjb3B5IGlzIGFscmVhZHlcbiAgICAgICAgICAgICAqIHdyaXR0ZW4sIHNvIHRoZSBkYXNoYm9hcmQgd2lsbCBzdGlsbCBzZWUgdGhlIG5ldyBsb2NhdGlvblxuICAgICAgICAgICAgICogaW4gdGhpcyBicm93c2VyIHNlc3Npb24uICovXG4gICAgICAgICAgICBzZXRTYXZlTXNnKHdhcm5pbmcgfHwgJ1NhdmVkIGxvY2FsbHkgb25seSDigJQgc2lnbiBpbiB0byBzYXZlIHNlcnZlci1zaWRlLicpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHNldFNhdmVNc2cobnVsbCk7IG9uU2F2ZSgpOyB9LCAxNjAwKTtcbiAgICAgICAgfVxuICAgIH07XG5cblxuICAgIHJldHVybiAoXG4gICAgICAgIDxNb2RhbFNoZWxsIHRpdGxlPVwiTG9jYXRpb24gU2V0dGluZ1wiIHN1YnRpdGxlPVwiQ2xpY2sgdGhlIG1hcCwgZHJhZyB0aGUgcGluLCBvciB1c2UgeW91ciBkZXZpY2VcIiBhY2NlbnQ9XCJhbWJlclwiIG9uQ2xvc2U9e29uQ2xvc2V9IG9uU2F2ZT17cGVyc2lzdEFuZFNhdmV9IHNpemU9XCJtYXhcIj5cbiAgICAgICAgICAgIHtzYXZlTXNnICYmIChcbiAgICAgICAgICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwibG9jLXNhdmUtbXNnXCJcbiAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1iLTMgcHgtNCBweS0yLjUgcm91bmRlZC1sZyBiZy1hbWJlci05MDAvMzAgYm9yZGVyIGJvcmRlci1hbWJlci03MDAvNTAgdGV4dC1hbWJlci0yMDAgdGV4dC14cyBmb250LW1vbm9cIj5cbiAgICAgICAgICAgICAgICAgICAg4pqgICB7c2F2ZU1zZ31cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbGc6Z3JpZC1jb2xzLVsxZnJfMzQwcHhdIGdhcC00IGgtZnVsbFwiIHN0eWxlPXt7bWluSGVpZ2h0Oic1NnZoJ319PlxuICAgICAgICAgICAgICAgIHsvKiBNQVAg4oCUIGZpbGxzIHRoZSBsZWZ0IHNpZGUsIHdpdGggYSBzZWFyY2ggYmFyIGZsb2F0aW5nIG9uIHRvcCAqL31cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlXCIgc3R5bGU9e3ttaW5IZWlnaHQ6JzU2dmgnfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgcmVmPXttYXBCb3hSZWZ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgaGVpZ2h0OicxMDAlJywgbWluSGVpZ2h0Oic1NnZoJywgd2lkdGg6JzEwMCUnLCBib3JkZXJSYWRpdXM6JzEycHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OidoaWRkZW4nLCBib3JkZXI6JzFweCBzb2xpZCAjMzM0MTU1JywgYmFja2dyb3VuZDonIzBiMTIyMCcgfX0vPlxuXG4gICAgICAgICAgICAgICAgICAgIHsvKiBTZWFyY2ggYmFyIG92ZXJsYXkg4oCUIHNpdHMgaW4gdGhlIHRvcC1jZW50cmUgb2YgdGhlIG1hcCAqL31cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSB0b3AtMyBsZWZ0LTEvMiAtdHJhbnNsYXRlLXgtMS8yIHotWzUwMF1cIiBzdHlsZT17e3dpZHRoOidtaW4oNTYwcHgsIGNhbGMoMTAwJSAtIDExMHB4KSknfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3NlYXJjaFF9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0U2VhcmNoUShlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uRm9jdXM9eygpID0+IHNlYXJjaEhpdHMubGVuZ3RoICYmIHNldFNlYXJjaE9wZW4odHJ1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwi8J+UjiAgU2VhcmNoIGJ5IGFkZHJlc3MsIGJ1aWxkaW5nLCBvciBwbGFjZSBuYW1l4oCmXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHB4LTQgcHktMi41IHJvdW5kZWQteGwgYmctc2xhdGUtOTAwLzk1IGJvcmRlciBib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtMTAwIHRleHQtc20gcGxhY2Vob2xkZXItc2xhdGUtNTAwIHNoYWRvdy0yeGwgYmFja2Ryb3AtYmx1clwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7b3V0bGluZTonbm9uZSd9fS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlYXJjaEJ1c3kgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJhYnNvbHV0ZSByaWdodC0zIHRvcC0xLzIgLXRyYW5zbGF0ZS15LTEvMiB0ZXh0LWFtYmVyLTQwMCB0ZXh0LXhzXCI+4oCmPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlYXJjaE9wZW4gJiYgc2VhcmNoSGl0cy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSB0b3AtZnVsbCBsZWZ0LTAgcmlnaHQtMCBtdC0xIGJnLXNsYXRlLTkwMC85NyBib3JkZXIgYm9yZGVyLXNsYXRlLTcwMCByb3VuZGVkLXhsIHNoYWRvdy0yeGwgb3ZlcmZsb3ctaGlkZGVuIG1heC1oLTcyIG92ZXJmbG93LXktYXV0byBiYWNrZHJvcC1ibHVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VhcmNoSGl0cy5tYXAoKGgsIGkpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGtleT17aC5wbGFjZV9pZCB8fCBpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gcGlja1NlYXJjaEhpdChoKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCB0ZXh0LWxlZnQgcHgtNCBweS0yLjUgaG92ZXI6YmctYW1iZXItOTAwLzMwIGJvcmRlci1iIGJvcmRlci1zbGF0ZS04MDAgbGFzdDpib3JkZXItYi0wIHRyYW5zaXRpb24tYWxsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LXNsYXRlLTIwMCB0cnVuY2F0ZVwiPntoLmRpc3BsYXlfbmFtZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IG10LTAuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2gudHlwZSB8fCBoLmNsYXNzfSDCtyB7KCtoLmxhdCkudG9GaXhlZCgzKX0sIHsoK2gubG9uKS50b0ZpeGVkKDMpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWFyY2hPcGVuICYmIHNlYXJjaEhpdHMubGVuZ3RoID09PSAwICYmIHNlYXJjaFEubGVuZ3RoID49IDMgJiYgIXNlYXJjaEJ1c3kgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC1mdWxsIGxlZnQtMCByaWdodC0wIG10LTEgYmctc2xhdGUtOTAwLzk3IGJvcmRlciBib3JkZXItc2xhdGUtNzAwIHJvdW5kZWQteGwgcHgtNCBweS0zIHRleHQteHMgdGV4dC1zbGF0ZS00MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vIHJlc3VsdHMgZm9yIFwie3NlYXJjaFF9XCIuICBUcnkgYSBtb3JlIHNwZWNpZmljIHRlcm0uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICB7LyogU0lERSBQQU5FTCAqL31cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktNCBvdmVyZmxvdy15LWF1dG8gcHItMVwiPlxuICAgICAgICAgICAgICAgICAgICB7LyogVXNlci1mcmllbmRseSBzaXRlIG5hbWUgKHRoZSBvbmUgdGhlIG9wZXJhdG9yIHVzZXMgdG8gaWRlbnRpZnkgdGhpcyBsb2NhdGlvbikgKi99XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTEuNVwiPlNpdGUgbmFtZSAoc2F2ZWQpPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIiB2YWx1ZT17Y2ZnLnNpdGVOYW1lIHx8ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiZS5nLiBIUSBUb3dlciwgTm9ydGggV2luZywgUGF2aWxpb24gQuKAplwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRDZmcoey4uLmNmZywgc2l0ZU5hbWU6ZS50YXJnZXQudmFsdWV9KX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbXQtMSBpdGFsaWNcIj5Zb3VyIGxhYmVsIGZvciB0aGlzIHBsYWNlIOKAlCBzaG93biBvbiB0aGUgZGFzaGJvYXJkIGhlYWRlci48L3A+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyLXQgYm9yZGVyLXNsYXRlLTgwMCBwdC0zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlc29sdmVkIGFkZHJlc3MgLyBjaXR5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2dlb0J1c3kgJiYgPHNwYW4gY2xhc3NOYW1lPVwibWwtMiB0ZXh0LWFtYmVyLTQwMCBub3JtYWwtY2FzZSB0cmFja2luZy1ub3JtYWxcIj7igKYgcmVzb2x2aW5nPC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCIgdmFsdWU9e2NmZy5jaXR5fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSk9PnNldENmZyh7Li4uY2ZnLCBjaXR5OmUudGFyZ2V0LnZhbHVlfSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTEuNVwiPkxhdGl0dWRlPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCIgdHlwZT1cIm51bWJlclwiIHN0ZXA9XCIwLjAwMDFcIiB2YWx1ZT17Y2ZnLmxhdH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKT0+c2V0Q2ZnKHsuLi5jZmcsIGxhdDorZS50YXJnZXQudmFsdWV9KX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMS41XCI+TG9uZ2l0dWRlPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCIgdHlwZT1cIm51bWJlclwiIHN0ZXA9XCIwLjAwMDFcIiB2YWx1ZT17Y2ZnLmxvbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKT0+c2V0Q2ZnKHsuLi5jZmcsIGxvbjorZS50YXJnZXQudmFsdWV9KX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17dXNlTXlMb2NhdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgcHktMi41IHJvdW5kZWQtbGcgYmctYW1iZXItNzAwLzcwIGJvcmRlciBib3JkZXItYW1iZXItNTAwLzQwIHRleHQteHMgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IHRleHQtYW1iZXItNTAgaG92ZXI6YmctYW1iZXItNjAwLzcwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICDwn5ONICBVc2UgbXkgZGV2aWNlIGxvY2F0aW9uXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyLXQgYm9yZGVyLXNsYXRlLTgwMCBwdC0zIG10LTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMlwiPlF1aWNrIGp1bXBzPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonVG9yb250bywgT04nLCAgIGxhdDo0My42NTMyLCBsb246LTc5LjM4MzIsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidOZXcgWW9yaywgTlknLCAgbGF0OjQwLjcxMjgsIGxvbjotNzQuMDA2MCwgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J0xvbmRvbiwgVUsnLCAgICBsYXQ6NTEuNTA3NCwgbG9uOiAtMC4xMjc4LCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonUGFyaXMsIEZSJywgICAgIGxhdDo0OC44NTY2LCBsb246ICAyLjM1MjIsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidUb2t5bywgSlAnLCAgICAgbGF0OjM1LjY3NjIsIGxvbjoxMzkuNjUwMywgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J1N5ZG5leSwgQVUnLCAgICBsYXQ6LTMzLjg2ODgsbG9uOjE1MS4yMDkzLCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXS5tYXAoaiA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PXtqLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIGxhdDpqLmxhdCwgbG9uOmoubG9uLCBjaXR5OmoubmFtZX0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hcFJlZi5jdXJyZW50KSBtYXBSZWYuY3VycmVudC5zZXRWaWV3KFtqLmxhdCwgai5sb25dLCBqLnopO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1sZWZ0IHB4LTIuNSBweS0xLjUgcm91bmRlZC1tZCBiZy1zbGF0ZS04MDAvNzAgYm9yZGVyIGJvcmRlci1zbGF0ZS03MDAgdGV4dC1bMTFweF0gZm9udC1ib2xkIHRleHQtc2xhdGUtMzAwIGhvdmVyOmJnLXNsYXRlLTcwMCBob3Zlcjpib3JkZXItYW1iZXItNTAwLzQwIHRyYW5zaXRpb24tYWxsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ai5uYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBsZWFkaW5nLXJlbGF4ZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIFRpbGVzOiBPcGVuU3RyZWV0TWFwIMK3IEdlb2NvZGU6IE5vbWluYXRpbSAoZnJlZSwgfjEgcmVxL3MpLlxuICAgICAgICAgICAgICAgICAgICAgICAgVXNlZCBmb3IgT3Blbi1NZXRlbyB3ZWF0aGVyIGZlZWQgYW5kIHN1bnJpc2Uvc3Vuc2V0IGVzdGltYXRpb24uXG4gICAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L01vZGFsU2hlbGw+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTGFuZ3VhZ2UgU2V0dGluZyAtLSBtb2RhbFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuZnVuY3Rpb24gTGFuZ3VhZ2VNb2RhbCh7IGNmZywgc2V0Q2ZnLCBvbkNsb3NlLCBvblNhdmUgfSkge1xuICAgIGNvbnN0IGxhbmdzID0gW1xuICAgICAgICB7IGNvZGU6J2VuJywgICAgbGFiZWw6J0VuZ2xpc2gnLCAgICAgICAgICAgICAgICBuYXRpdmU6J0VuZ2xpc2gnICAgIH0sXG4gICAgICAgIHsgY29kZTonemgtQ04nLCBsYWJlbDonQ2hpbmVzZSAoU2ltcGxpZmllZCknLCAgIG5hdGl2ZTon566A5L2T5Lit5paHJyAgICB9LFxuICAgICAgICB7IGNvZGU6J3poLVRXJywgbGFiZWw6J0NoaW5lc2UgKFRyYWRpdGlvbmFsKScsICBuYXRpdmU6J+e5gemrlOS4reaWhycgICAgfSxcbiAgICAgICAgeyBjb2RlOidqYScsICAgIGxhYmVsOidKYXBhbmVzZScsICAgICAgICAgICAgICAgbmF0aXZlOifml6XmnKzoqp4nICAgICAgfSxcbiAgICAgICAgeyBjb2RlOidrbycsICAgIGxhYmVsOidLb3JlYW4nLCAgICAgICAgICAgICAgICAgbmF0aXZlOiftlZzqta3slrQnICAgICAgfSxcbiAgICBdO1xuXG4gICAgLyogT24gU2F2ZSAmIHJldHVybjogd3JpdGUgdGhlIHBpY2tlZCBsYW5ndWFnZSBjb2RlIHRvIHRoZSBzYW1lXG4gICAgICogbG9jYWxTdG9yYWdlIGtleSB0aGUgZGFzaGJvYXJkJ3MgaTE4bi5qcyByZWFkcyAoYGkxOG5fbGFuZ2ApLCBhbmRcbiAgICAgKiBkaXNwYXRjaCB0aGUgYGxhbmdjaGFuZ2VgIGV2ZW50IHNvIGFueSBvcGVuIGRhc2hib2FyZC9jb25maWcgdGFiXG4gICAgICogcGlja3MgaXQgdXAgbGl2ZS4gIFRoaXMgaXMgd2hhdCBtYWtlcyB0aGUgc2V0dXAgd2FsaydzIGxhbmd1YWdlXG4gICAgICogY2hvaWNlIGFjdHVhbGx5IGRyaXZlIHRoZSBkYXNoYm9hcmQgLyBjb25maWcgLyBtYXBwZXIgVUkgLS0gdGhlXG4gICAgICogc2lkZWJhciBzZWxlY3RvciB0aGF0IHVzZWQgdG8gbGl2ZSBpbiB0aGUgZGFzaGJvYXJkIGhlYWRlciBoYXNcbiAgICAgKiBiZWVuIHJlbW92ZWQgKDIwMjYtMDYtMjYpIGFuZCB0aGUgc2V0dXAgd2FsayBpcyBub3cgdGhlIHNpbmdsZVxuICAgICAqIHNvdXJjZSBvZiB0cnV0aCBmb3IgVUkgbGFuZ3VhZ2UuICovXG4gICAgY29uc3QgcGVyc2lzdEFuZFNhdmUgPSAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnaTE4bl9sYW5nJywgY2ZnLmxhbmcpO1xuICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdsYW5nY2hhbmdlJykpO1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdbc2V0dXAgd2Fsa10gaTE4bl9sYW5nIDwtJywgY2ZnLmxhbmcpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1tzZXR1cCB3YWxrXSBjb3VsZCBub3QgcGVyc2lzdCBsYW5ndWFnZTonLCBlKTtcbiAgICAgICAgfVxuICAgICAgICBvblNhdmUoKTtcbiAgICB9O1xuICAgIHJldHVybiAoXG4gICAgICAgIDxNb2RhbFNoZWxsIHRpdGxlPVwiTGFuZ3VhZ2UgU2V0dGluZ1wiIHN1YnRpdGxlPVwiUGljayB5b3VyIGRlZmF1bHQgaW50ZXJmYWNlIGxhbmd1YWdlXCIgYWNjZW50PVwiZW1lcmFsZFwiIG9uQ2xvc2U9e29uQ2xvc2V9IG9uU2F2ZT17cGVyc2lzdEFuZFNhdmV9PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC0zXCI+XG4gICAgICAgICAgICAgICAge2xhbmdzLm1hcChsID0+IChcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e2wuY29kZX0gb25DbGljaz17KCk9PnNldENmZyh7Li4uY2ZnLCBsYW5nOmwuY29kZX0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHRleHQtbGVmdCBwLTMgcm91bmRlZC14bCBib3JkZXItMiB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2NmZy5sYW5nID09PSBsLmNvZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JvcmRlci1lbWVyYWxkLTUwMCBiZy1lbWVyYWxkLTkwMC8yMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JvcmRlci1zbGF0ZS03MDAgYmctc2xhdGUtODAwLzQwIGhvdmVyOmJnLXNsYXRlLTgwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayB0ZXh0LXNsYXRlLTUwMFwiPntsLmNvZGV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1ibGFjayB0ZXh0LXNsYXRlLTIwMFwiPntsLm5hdGl2ZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTFweF0gdGV4dC1zbGF0ZS01MDBcIj57bC5sYWJlbH08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Nb2RhbFNoZWxsPlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFBsdWctaW4gU2V0dGluZyAtLSBtb2RhbCB3LyBsaXN0ICsgdXBsb2FkIHpvbmVcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbi8qIFBlci1wbHVnLWluIG1vY2sgY29uZmlndXJhdGlvbiBmaWVsZHMuICBLZXlzIG1hcCB0byBwbHVnLWluIGBpZGAuICovXG5jb25zdCBQTFVHSU5fQ09ORklHX0ZJRUxEUyA9IHtcbiAgICB3ZWF0aGVyOiAgICBbXG4gICAgICAgIHsga2V5Oidwcm92aWRlcicsICBsYWJlbDonUHJvdmlkZXInLCAgICAgICAgICB0eXBlOidzZWxlY3QnLCAgb3B0aW9uczpbJ09wZW4tTWV0ZW8nLCdOV1MnLCdFQ01XRiddLCBkZWY6J09wZW4tTWV0ZW8nIH0sXG4gICAgICAgIHsga2V5OidyZWZyZXNoJywgICBsYWJlbDonUmVmcmVzaCBpbnRlcnZhbCcsICB0eXBlOidzZWxlY3QnLCAgb3B0aW9uczpbJzEgbWluJywnNSBtaW4nLCcxNSBtaW4nLCczMCBtaW4nLCcxIGgnXSwgZGVmOicxNSBtaW4nIH0sXG4gICAgICAgIHsga2V5OidjYWNoZScsICAgICBsYWJlbDonQ2FjaGUgVFRMIChtaW4pJywgICB0eXBlOidudW1iZXInLCAgZGVmOjMwIH0sXG4gICAgXSxcbiAgICBnaXZvbmk6ICAgICBbXG4gICAgICAgIHsga2V5OidjbGltYXRlJywgICBsYWJlbDonQ2xpbWF0ZSBtb2RlbCcsICAgICB0eXBlOidzZWxlY3QnLCAgb3B0aW9uczpbJ0dpdm9uaSAxOTkyJywnQVNIUkFFIDU1JywnQWRhcHRpdmUnXSwgZGVmOidHaXZvbmkgMTk5MicgfSxcbiAgICAgICAgeyBrZXk6J21hc3NpdmUnLCAgIGxhYmVsOidIZWF2eXdlaWdodCBjb25zdHJ1Y3Rpb24nLCAgdHlwZTondG9nZ2xlJywgZGVmOmZhbHNlIH0sXG4gICAgXSxcbiAgICBzd2VldF9zcG90OiBbXG4gICAgICAgIHsga2V5Oid0cmFja2luZycsICBsYWJlbDonVHJhY2sgb3V0ZG9vciBSSCcsICB0eXBlOid0b2dnbGUnLCBkZWY6dHJ1ZSB9LFxuICAgICAgICB7IGtleTonaHlzdCcsICAgICAgbGFiZWw6J0h5c3RlcmVzaXMgKCUgUkgpJywgdHlwZTonbnVtYmVyJywgZGVmOjIgfSxcbiAgICBdLFxuICAgIGczNjogICAgICAgIFtcbiAgICAgICAgeyBrZXk6J21vZGUnLCAgICAgIGxhYmVsOidTZXF1ZW5jZSBtb2RlJywgICAgIHR5cGU6J3NlbGVjdCcsICBvcHRpb25zOlsnU2luZ2xlLXpvbmUgVkFWJywnTXVsdGktem9uZSBWQVYnLCdET0FTIHcvIEZDVSddLCBkZWY6J011bHRpLXpvbmUgVkFWJyB9LFxuICAgICAgICB7IGtleTondmVyYm9zZScsICAgbGFiZWw6J1ZlcmJvc2UgbG9nZ2luZycsICAgdHlwZTondG9nZ2xlJywgZGVmOmZhbHNlIH0sXG4gICAgXSxcbiAgICBkaWJ0OiAgICAgICBbXG4gICAgICAgIHsga2V5Oidob3N0JywgICAgICBsYWJlbDonQnJpZGdlIGhvc3QnLCAgICAgICB0eXBlOid0ZXh0JywgICBkZWY6JzE5Mi4xNjguMS4xMDAnIH0sXG4gICAgICAgIHsga2V5Oidwb3J0JywgICAgICBsYWJlbDonVGVsZWdyYW0gcG9ydCcsICAgICB0eXBlOidudW1iZXInLCBkZWY6NDc4MDggfSxcbiAgICAgICAgeyBrZXk6J3BvbGxfbXMnLCAgIGxhYmVsOidQb2xsIGludGVydmFsIChtcyknLHR5cGU6J251bWJlcicsIGRlZjoyMDAwIH0sXG4gICAgXSxcbiAgICBsaWdodGluZzogICBbXG4gICAgICAgIHsga2V5OidnYXRld2F5JywgICBsYWJlbDonTW9kYnVzIGdhdGV3YXkgSVAnLCB0eXBlOid0ZXh0JywgICBkZWY6JzEwLjAuMC41MCcgfSxcbiAgICAgICAgeyBrZXk6J3VuaXRfaWQnLCAgIGxhYmVsOidVbml0IElEJywgICAgICAgICAgIHR5cGU6J251bWJlcicsIGRlZjoxIH0sXG4gICAgICAgIHsga2V5Oid0Y3BfcG9ydCcsICBsYWJlbDonVENQIHBvcnQnLCAgICAgICAgICB0eXBlOidudW1iZXInLCBkZWY6NTAyIH0sXG4gICAgXSxcbn07XG5cbmZ1bmN0aW9uIFBsdWdpbnNNb2RhbCh7IGNmZywgc2V0Q2ZnLCBvbkNsb3NlLCBvblNhdmUgfSkge1xuICAgIGNvbnN0IEFMTCA9IFtcbiAgICAgICAgeyBpZDond2VhdGhlcicsICAgICBuYW1lOidXZWF0aGVyJywgICAgICAgICBkZXNjOidPcGVuLU1ldGVvIE9BIGZlZWQnLCAgICAgICAgICB2ZXI6JzIuMS4wJyB9LFxuICAgICAgICB7IGlkOidnaXZvbmknLCAgICAgIG5hbWU6J0dpdm9uaSBFbmdpbmUnLCAgIGRlc2M6J0NsaW1hdGUtc3RyYXRlZ3kgb3ZlcmxheScsICAgIHZlcjonMS4zLjQnIH0sXG4gICAgICAgIHsgaWQ6J3N3ZWV0X3Nwb3QnLCAgbmFtZTonU3dlZXQtU3BvdCBSSCcsICAgZGVzYzonQWRqdXN0YWJsZSBSSCBiYW5kJywgICAgICAgICAgdmVyOicxLjAuMScgfSxcbiAgICAgICAgeyBpZDonZzM2JywgICAgICAgICBuYW1lOidHMzYgU2VxdWVuY2VzJywgICBkZXNjOidBU0hSQUUgR3VpZGVsaW5lIDM2JywgICAgICAgICB2ZXI6JzAuOS4yJyB9LFxuICAgICAgICB7IGlkOidkaWJ0JywgICAgICAgIG5hbWU6J0RJQlQgQnJpZGdlJywgICAgIGRlc2M6J0RlbHRhIENvbnRyb2xzIChESUJUKSBCQUNuZXQgYnJpZGdlJywgICAgICAgICAgIHZlcjonMC40LjAnIH0sXG4gICAgICAgIHsgaWQ6J2xpZ2h0aW5nJywgICAgbmFtZTonTGlnaHRpbmcgKFJlZDUpJywgZGVzYzonVjMuMCBNb2RidXMgVENQIGNsaWVudCcsICAgICAgdmVyOicwLjEuMC1iZXRhJyB9LFxuICAgIF07XG4gICAgY29uc3QgdG9nZ2xlID0gKGlkKSA9PiBzZXRDZmcoYyA9PiAoe1xuICAgICAgICAuLi5jLFxuICAgICAgICBlbmFibGVkOiBjLmVuYWJsZWQuaW5jbHVkZXMoaWQpID8gYy5lbmFibGVkLmZpbHRlcih4ID0+IHggIT09IGlkKSA6IFsuLi5jLmVuYWJsZWQsIGlkXVxuICAgIH0pKTtcblxuICAgIC8qIGV4cGFuc2lvbiBzdGF0ZSDigJQgd2hpY2ggcGx1Zy1pbidzIFwiQ29uZmlndXJlXCIgcGFuZWwgaXMgb3BlbiAqL1xuICAgIGNvbnN0IFtleHBhbmRlZElkLCBzZXRFeHBhbmRlZElkXSA9IFJlYWN0LnVzZVN0YXRlKG51bGwpO1xuXG4gICAgY29uc3QgdXBkYXRlRmllbGQgPSAocGx1Z2luSWQsIGZpZWxkS2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgICBzZXRDZmcoYyA9PiAoe1xuICAgICAgICAgICAgLi4uYyxcbiAgICAgICAgICAgIGZpZWxkczogeyAuLi4oYy5maWVsZHMgfHwge30pLCBbcGx1Z2luSWRdOiB7IC4uLigoYy5maWVsZHMgfHwge30pW3BsdWdpbklkXSB8fCB7fSksIFtmaWVsZEtleV06IHZhbHVlIH0gfVxuICAgICAgICB9KSk7XG4gICAgfTtcblxuICAgIGNvbnN0IGZpZWxkVmFsID0gKHBsdWdpbklkLCBmaWVsZCkgPT4ge1xuICAgICAgICBjb25zdCBzdG9yZWQgPSBjZmcuZmllbGRzICYmIGNmZy5maWVsZHNbcGx1Z2luSWRdICYmIGNmZy5maWVsZHNbcGx1Z2luSWRdW2ZpZWxkLmtleV07XG4gICAgICAgIHJldHVybiBzdG9yZWQgIT09IHVuZGVmaW5lZCA/IHN0b3JlZCA6IGZpZWxkLmRlZjtcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPE1vZGFsU2hlbGwgdGl0bGU9XCJQbHVnLWluIFNldHRpbmdcIiBzdWJ0aXRsZT1cIkVuYWJsZSwgdXBsb2FkIG9yIG1vZGlmeSBwbHVnLWluc1wiIGFjY2VudD1cInBpbmtcIiBvbkNsb3NlPXtvbkNsb3NlfSBvblNhdmU9e29uU2F2ZX0gc2l6ZT1cIndpZGVcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0zIG1heC1oLVs2MHZoXSBvdmVyZmxvdy15LWF1dG8gcHItMVwiPlxuICAgICAgICAgICAgICAgIHtBTEwubWFwKHAgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvbiA9IGNmZy5lbmFibGVkLmluY2x1ZGVzKHAuaWQpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBleHBhbmRlZCA9IGV4cGFuZGVkSWQgPT09IHAuaWQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkcyA9IFBMVUdJTl9DT05GSUdfRklFTERTW3AuaWRdIHx8IFtdO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e3AuaWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHJvdW5kZWQteGwgYm9yZGVyIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7b24gPyAnYm9yZGVyLXBpbmstNTAwLzQwIGJnLXBpbmstOTAwLzEwJyA6ICdib3JkZXItc2xhdGUtNzAwIGJnLXNsYXRlLTgwMC80MCd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7ZXhwYW5kZWQgPyAncmluZy0xIHJpbmctcGluay01MDAvMzAnIDogJyd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcC0zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1ibGFjayB0ZXh0LXNsYXRlLTEwMFwiPntwLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibWwtMiB0ZXh0LVsxMHB4XSBmb250LW1vbm8gdGV4dC1zbGF0ZS01MDBcIj52e3AudmVyfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtc2xhdGUtNDAwXCI+e3AuZGVzY308L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gdG9nZ2xlKHAuaWQpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17YHBsdWdpbi10b2dnbGUtJHtwLmlkfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTMgcHktMSByb3VuZGVkLW1kIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayBib3JkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7b24gPyAnYm9yZGVyLXBpbmstNTAwLzYwIHRleHQtcGluay0zMDAgYmctcGluay05MDAvMzAnIDogJ2JvcmRlci1zbGF0ZS02MDAgdGV4dC1zbGF0ZS00MDAgYmctc2xhdGUtODAwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7b24gPyAnRW5hYmxlZCcgOiAnRGlzYWJsZWQnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHNldEV4cGFuZGVkSWQoZXhwYW5kZWQgPyBudWxsIDogcC5pZCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgcGx1Z2luLWNvbmZpZy0ke3AuaWR9YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHgtMyBweS0xIHJvdW5kZWQtbWQgdGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIGJvcmRlciB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtleHBhbmRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JvcmRlci1waW5rLTUwMCBiZy1waW5rLTkwMC8zMCB0ZXh0LXBpbmstMjAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JvcmRlci1zbGF0ZS02MDAgdGV4dC1zbGF0ZS00MDAgYmctc2xhdGUtODAwIGhvdmVyOmJnLXNsYXRlLTcwMCBob3Zlcjpib3JkZXItcGluay01MDAvNTAgaG92ZXI6dGV4dC1waW5rLTMwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2V4cGFuZGVkID8gJ0Nsb3NlIOKWtCcgOiAnQ29uZmlndXJlIOKWvid9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2V4cGFuZGVkICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJweC00IHBiLTQgYm9yZGVyLXQgYm9yZGVyLXBpbmstNTAwLzIwIGJnLXNsYXRlLTk1MC80MFwiIGRhdGEtdGVzdGlkPXtgcGx1Z2luLWNvbmZpZy1wYW5lbC0ke3AuaWR9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZmllbGRzLmxlbmd0aCA9PT0gMCA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtc2xhdGUtNTAwIGl0YWxpYyBweS0zXCI+Tm8gY29uZmlndXJhYmxlIG9wdGlvbnMgZm9yIHRoaXMgcGx1Zy1pbiB5ZXQuPC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbWQ6Z3JpZC1jb2xzLTIgZ2FwLTMgcHQtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZmllbGRzLm1hcChmID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHYgPSBmaWVsZFZhbChwLmlkLCBmKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e2Yua2V5fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwIGJsb2NrIG1iLTFcIj57Zi5sYWJlbH08L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi50eXBlID09PSAnc2VsZWN0JyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0IGN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3Z9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlRmllbGQocC5pZCwgZi5rZXksIGUudGFyZ2V0LnZhbHVlKX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2Yub3B0aW9ucy5tYXAobyA9PiA8b3B0aW9uIGtleT17b30gdmFsdWU9e299PntvfTwvb3B0aW9uPil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2YudHlwZSA9PT0gJ251bWJlcicgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJudW1iZXJcIiBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3Z9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGVGaWVsZChwLmlkLCBmLmtleSwgK2UudGFyZ2V0LnZhbHVlKX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi50eXBlID09PSAndGV4dCcgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt2fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlRmllbGQocC5pZCwgZi5rZXksIGUudGFyZ2V0LnZhbHVlKX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi50eXBlID09PSAndG9nZ2xlJyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHVwZGF0ZUZpZWxkKHAuaWQsIGYua2V5LCAhdil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHctZnVsbCBweS0yIHJvdW5kZWQtbGcgdGV4dC14cyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgYm9yZGVyIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3ZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1waW5rLTcwMC80MCBib3JkZXItcGluay01MDAvNjAgdGV4dC1waW5rLTIwMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1zbGF0ZS04MDAgYm9yZGVyLXNsYXRlLTYwMCB0ZXh0LXNsYXRlLTQwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3YgPyAnT04nIDogJ09GRid9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1lbmQgZ2FwLTIgbXQtNCBwdC0zIGJvcmRlci10IGJvcmRlci1zbGF0ZS04MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXNldCB0aGlzIHBsdWctaW4ncyBmaWVsZHMgdG8gZGVmYXVsdHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRDZmcoYyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHQgPSB7IC4uLihjLmZpZWxkcyB8fCB7fSkgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG5leHRbcC5pZF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IC4uLmMsIGZpZWxkczogbmV4dCB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTMgcHktMS41IHJvdW5kZWQtbWQgdGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIGJvcmRlciBib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtNDAwIGhvdmVyOmJnLXNsYXRlLTgwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXNldCBkZWZhdWx0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gc2V0RXhwYW5kZWRJZChudWxsKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTMgcHktMS41IHJvdW5kZWQtbWQgdGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIGJnLXBpbmstNjAwIGhvdmVyOmJnLXBpbmstNTAwIHRleHQtd2hpdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRG9uZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTUgcC00IGJvcmRlci0yIGJvcmRlci1kYXNoZWQgYm9yZGVyLXNsYXRlLTcwMCByb3VuZGVkLXhsIHRleHQtY2VudGVyIGhvdmVyOmJvcmRlci1waW5rLTUwMC80MCB0cmFuc2l0aW9uLWFsbCBjdXJzb3ItcG9pbnRlclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC0zeGwgbWItMVwiPuKktDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LWJsYWNrIHRleHQtc2xhdGUtMzAwXCI+RHJvcCBhIC5weSAvIC56aXAgLyAucmVkNSBwbHVnLWluIGhlcmU8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzExcHhdIHRleHQtc2xhdGUtNTAwIG10LTFcIj5vciBjbGljayB0byBjaG9vc2UgYSBmaWxlIChtb2NrIOKAlCBub3Qgd2lyZWQpPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Nb2RhbFNoZWxsPlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE1vZGFsIFNoZWxsIC0tIHNoYXJlZFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuZnVuY3Rpb24gTW9kYWxTaGVsbCh7IHRpdGxlLCBzdWJ0aXRsZSwgYWNjZW50PSdpbmRpZ28nLCBvbkNsb3NlLCBvblNhdmUsIHNpemU9JycsIGNoaWxkcmVuIH0pIHtcbiAgICBjb25zdCBjb2xvck1hcCA9IHtcbiAgICAgICAgaW5kaWdvOicjODE4Y2Y4JywgYW1iZXI6JyNmYmJmMjQnLCBlbWVyYWxkOicjMzRkMzk5JywgcGluazonI2Y0NzJiNidcbiAgICB9O1xuICAgIGNvbnN0IGMgPSBjb2xvck1hcFthY2NlbnRdIHx8ICcjODE4Y2Y4JztcbiAgICBjb25zdCBzaXplTWFwID0ge1xuICAgICAgICB3aWRlOiAnbWF4LXctMnhsJyxcbiAgICAgICAgbWFwOiAgJ21heC13LTN4bCcsXG4gICAgICAgIG1heDogICdtYXgtdy1bOTZ2d10gdy1bOTZ2d10gaC1bOTJ2aF0nLFxuICAgIH07XG4gICAgY29uc3Qgd2lkdGggPSBzaXplTWFwW3NpemVdIHx8ICdtYXgtdy1tZCc7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaXhlZCBpbnNldC0wIHotNTAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgbW9kYWwtYmFja2Ryb3BcIiBvbkNsaWNrPXtvbkNsb3NlfT5cbiAgICAgICAgICAgIHsvKiBGbGV4LWNvbHVtbiBzaGVsbDogaGVhZGVyIChmaXhlZCkgKyBzY3JvbGxhYmxlIGNvbnRlbnQgKyBzdGlja3kgZm9vdGVyLlxuICAgICAgICAgICAgICAgIENyaXRpY2FsIGZvciBzaXplPVwibWF4XCIgd2hlcmUgY2hpbGRyZW4gYWxvbmUgZXhjZWVkIHRoZSBtb2RhbCBoZWlnaHRcbiAgICAgICAgICAgICAgICBhbmQgd291bGQgb3RoZXJ3aXNlIHB1c2ggdGhlIFNhdmUgJiByZXR1cm4gYnV0dG9uIGJlbG93IHRoZSB2aWV3cG9ydC4gKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YGJnLXNsYXRlLTkwMCBib3JkZXItMiByb3VuZGVkLTJ4bCB3LWZ1bGwgJHt3aWR0aH0gbXgtNCBmYWRlLXVwIGZsZXggZmxleC1jb2xgfVxuICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX1cbiAgICAgICAgICAgICAgICAgc3R5bGU9e3tib3JkZXJDb2xvcjpgJHtjfTY2YCwgbWF4SGVpZ2h0OiAnOTJ2aCd9fT5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtc3RhcnQganVzdGlmeS1iZXR3ZWVuIHAtNiBwYi00IGJvcmRlci1iIGJvcmRlci1zbGF0ZS04MDAvNjAgc2hyaW5rLTBcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LWxnIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdFwiIHN0eWxlPXt7Y29sb3I6Y319Pnt0aXRsZX08L2gzPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXNsYXRlLTUwMCBtdC0xXCI+e3N1YnRpdGxlfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJtb2RhbC1jbG9zZVwiIG9uQ2xpY2s9e29uQ2xvc2V9IGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNTAwIGhvdmVyOnRleHQtd2hpdGUgdGV4dC0yeGwgbGVhZGluZy1ub25lXCI+w5c8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMSBtaW4taC0wIG92ZXJmbG93LXktYXV0byBweC02IHB5LTVcIj5cbiAgICAgICAgICAgICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1lbmQgZ2FwLTMgcHgtNiBweS00IGJvcmRlci10IGJvcmRlci1zbGF0ZS04MDAgc2hyaW5rLTAgYmctc2xhdGUtOTAwIHJvdW5kZWQtYi0yeGxcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cIm1vZGFsLWNhbmNlbFwiIG9uQ2xpY2s9e29uQ2xvc2V9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtNCBweS0yIHJvdW5kZWQtbGcgYmctc2xhdGUtODAwIGJvcmRlciBib3JkZXItc2xhdGUtNzAwIHRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIHRleHQtc2xhdGUtNDAwIGhvdmVyOmJnLXNsYXRlLTcwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgQ2FuY2VsXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwibW9kYWwtc2F2ZVwiIG9uQ2xpY2s9e29uU2F2ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC01IHB5LTIgcm91bmRlZC1sZyB0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayB0ZXh0LXdoaXRlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6YywgYm94U2hhZG93OmAwIDAgMTJweCAke2N9NTVgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICBTYXZlICYgcmV0dXJuIOKck1xuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG4vKiBtb3VudCAqL1xuUmVhY3RET00uY3JlYXRlUm9vdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpKS5yZW5kZXIoPEFwcC8+KTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUFBLE1BQUEsR0FBOEJDLEtBQUs7RUFBM0JDLFFBQVEsR0FBQUYsTUFBQSxDQUFSRSxRQUFRO0VBQUVDLE9BQU8sR0FBQUgsTUFBQSxDQUFQRyxPQUFPOztBQUV6QjtBQUNBO0FBQ0E7QUFDQSxJQUFNQyxLQUFLLEdBQUcsQ0FDVjtFQUFFQyxHQUFHLEVBQUMs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QyxFQUFFLEdBQUdDLFFBQVEsQ0FBQztFQUNyRSxJQUFNUSxJQUFJLEdBQUcsQ0FBQyxHQUFHWCxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFUCxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFQSxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7RUFDN0YsSUFBTW1CLEdBQUcsR0FBSSxDQUFDLEdBQUdaLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUVQLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUVBLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUM3RixJQUFNb0IsSUFBSSxHQUFHLENBQUMsR0FBR2IsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRVAsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFQSxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQ2hFLENBQUMsRUFBRSxFQUFFQSxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUVBLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUUzRSxJQUFNcUIsVUFBVSxHQUFHLEVBQUU7RUFBRSxLQUFL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O0lBQUtNLFNBQVMsOENBQUFZLE1BQUEsQ0FBOENpQixLQUFLLGdDQUE4QjtJQUMxRjNCLE9BQU8sRUFBRzFCLENBQUMsSUFBS0EsQ0FBQyxDQUFDK1YsZUFBZSxDQUFDLENBQUU7SUFDcENuVSxLQUFLLEVBQUU7TUFBQzRILFdBQVcsS0FBQXBILE1BQUEsQ0FBSTBCLENBQUMsT0FBSTtNQUFFa1MsU0FBUyxFQUFFO0lBQU07RUFBRSxnQkFDbER2WixLQUFBLENBQUF5RSxhQUFBO0lBQUtNLFNBQVMsRUFBQztFQUFpRixnQkFDNUYvRSxLQUFBLENBQUF5RSxhQUFBLDJCQUNJekUsS0FBQSxDQUFBeUUsYUFBQTtJQUFJTSxTQUFTLEVBQUMsOENBQThDO0lBQUNJLEtBQUssRUFBRTtNQUFDaUIsS0FBSyxFQUFDaUI7SUFBQztFQUFFLEdBQUVxTyxLQUFVLENBQUMsZUFDM0YxVixLQUFBLENBQUF5RSxhQUFBO0lBQUdNLFNBQVMsRUFBQztFQUE2QixHQUFFNFEsUUFBWSxDQUN2RCxDQUFDLGVBQ04zVixLQUFBLENBQUF5RSxhQUFBO0lBQVEsZUFBWSxhQUFhO0lBQUNRLE9BQU8sRUFBRVksT0FBUTtJQUFDZCxTQUFTLEVBQUM7RUFBdUQsR0FBQyxNQUFTLENBQzlILENBQUMsZUFDTi9FLEtBQUEsQ0FBQXlFLGFBQUE7SUFBS00sU0FBUyxFQUFDO0VBQTBDLEdBQ3BEK1QsUUFDQSxDQUFDLGVBQ045WSxLQUFBLENBQUF5RSxhQUFBO0lBQUtNLFNBQVMsRUFBQztFQUE2RyxnQkFDeEgvRSxLQUFBLENBQUF5RSxhQUFBO0lBQVEsZUFBWSxjQUFjO0lBQUNRLE9BQU8sRUFBRVksT0FBUTtJQUM1Q2QsU0FBUyxFQUFDO0VBQTBJLEdBQUMsUUFFckosQ0FBQyxlQUNUL0UsS0FBQSxDQUFBeUUsYUFBQTtJQUFRLGVBQVksWUFBWTtJQUFDUSxPQUFPLEVBQUVILE1BQU87SUFDekNDLFNBQVMsRUFBQyw4RUFBOEU7SUFDeEZJLEtBQUssRUFBRTtNQUFDYyxVQUFVLEVBQUNvQixDQUFDO01BQUVtUyxTQUFTLGNBQUE3VCxNQUFBLENBQWEwQixDQUFDO0lBQUk7RUFBRSxHQUFDLHNCQUVwRCxDQUNQLENBQ0osQ0FDSixDQUFDO0FBRWQ7O0FBRUE7QUFDQW9TLFFBQVEsQ0FBQ0MsVUFBVSxDQUFDQyxRQUFRLENBQUNDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDQyxNQUFNLGNBQUM3WixLQUFBLENBQUF5RSxhQUFBLENBQUMvRCxHQUFHLE1BQUMsQ0FBQyxDQUFDIiwiaWdub3JlTGlzdCI6W119