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

  /* ----- saved-locations dropdown open/close state.
   * Native <datalist> hides its chevron in most browsers (especially in
   * a dark theme), which made the "drop down" invisible to operators
   * who clearly had multiple saved locations.  Replaced with a custom
   * popdown panel that has an ALWAYS-VISIBLE chevron button -- click it
   * to toggle, click outside to dismiss. */
  var _React$useState5 = React.useState(false),
    _React$useState6 = _slicedToArray(_React$useState5, 2),
    savedOpen = _React$useState6[0],
    setSavedOpen = _React$useState6[1];
  var savedRef = React.useRef(null);
  React.useEffect(() => {
    if (!savedOpen) return;
    var onDocClick = e => {
      if (savedRef.current && !savedRef.current.contains(e.target)) setSavedOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [savedOpen]);

  /* When the user picks a name from the dropdown OR types one that
   * exactly matches a saved entry, pull its lat/lon and recentre the
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
  var pickSavedLoc = loc => {
    setSavedOpen(false);
    onSiteNameChange(loc.name);
  };

  /* ----- search state ----- */
  var _React$useState7 = React.useState(''),
    _React$useState8 = _slicedToArray(_React$useState7, 2),
    searchQ = _React$useState8[0],
    setSearchQ = _React$useState8[1];
  var _React$useState9 = React.useState([]),
    _React$useState0 = _slicedToArray(_React$useState9, 2),
    searchHits = _React$useState0[0],
    setSearchHits = _React$useState0[1];
  var _React$useState1 = React.useState(false),
    _React$useState10 = _slicedToArray(_React$useState1, 2),
    searchBusy = _React$useState10[0],
    setSearchBusy = _React$useState10[1];
  var _React$useState11 = React.useState(false),
    _React$useState12 = _slicedToArray(_React$useState11, 2),
    searchOpen = _React$useState12[0],
    setSearchOpen = _React$useState12[1];
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
  var _React$useState13 = React.useState(null),
    _React$useState14 = _slicedToArray(_React$useState13, 2),
    geoState = _React$useState14[0],
    setGeoState = _React$useState14[1]; // null | 'busy' | {err}
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

  /* When user clicks "Save & return", mirror EXACTLY what the dashboard's
   * Weather button does in weather-settings-modal.js#selectLocation:
   *   1. localStorage['weatherLocation']        = chosen loc (canonical key
   *                                              the dashboard reads on
   *                                              mount, NOT 'red5.weather_location').
   *   2. localStorage['savedWeatherLocations']  = [loc, ...others] deduped
   *                                              by lat/lon, capped at 20.
   *   3. POST /api/weather-location with active+default+saved so the same
   *      list survives cross-device sessions for signed-in tenants.
   *
   * Without step 1 the dashboard's `weatherLocation` state silently keeps
   * its old value -- which is exactly the bug operators reported after
   * picking a location in Setup Walk and seeing the dashboard's weather
   * strip refuse to update. */
  var _React$useState15 = React.useState(null),
    _React$useState16 = _slicedToArray(_React$useState15, 2),
    saveMsg = _React$useState16[0],
    setSaveMsg = _React$useState16[1];
  var persistAndSave = /*#__PURE__*/function () {
    var _ref0 = _asyncToGenerator(function* () {
      var loc = {
        lat: cfg.lat,
        lon: cfg.lon,
        name: cfg.siteName || cfg.city
      };

      // De-dup the existing saved list by lat/lon (same key the dashboard
      // uses) and put the new pick at the top.  Cap at 20 to match the
      // dashboard's behaviour.
      var key = loc.lat.toFixed(4) + ',' + loc.lon.toFixed(4);
      var deduped = savedLocs.filter(l => l.lat.toFixed(4) + ',' + l.lon.toFixed(4) !== key);
      var nextSaved = [loc, ...deduped].slice(0, 20);
      try {
        localStorage.setItem('weatherLocation', JSON.stringify(loc));
        localStorage.setItem('savedWeatherLocations', JSON.stringify(nextSaved));
        // Keep the old key too -- some legacy plug-ins still look at it.
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
            default: loc,
            saved: nextSaved
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

      // Tell any open dashboard tab to re-hydrate.  The dashboard
      // already listens for `storage` events when another tab writes to
      // localStorage, but on V1.9 some browsers DON'T fire `storage` for
      // same-origin writes from this same tab.  An explicit custom event
      // makes the dashboard's polling pick the change up immediately if
      // it's already mounted in another tab/window.
      try {
        window.dispatchEvent(new CustomEvent('red5:weatherLocationChanged', {
          detail: {
            active: loc,
            saved: nextSaved
          }
        }));
      } catch (e) {/* IE-less environments -- no-op */}
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
  }, "\u25BE ", savedLocs.length, " saved")), /*#__PURE__*/React.createElement("div", {
    className: "relative",
    ref: savedRef
  }, /*#__PURE__*/React.createElement("input", {
    className: "field-input pr-9",
    value: cfg.siteName || '',
    "data-testid": "loc-site-name-input",
    placeholder: savedLocs.length > 0 ? 'Pick a saved location, or type a new one…' : 'e.g. HQ Tower, North Wing, Pavilion B…',
    onChange: e => onSiteNameChange(e.target.value),
    onFocus: () => savedLocs.length > 0 && setSavedOpen(true)
  }), savedLocs.length > 0 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "data-testid": "loc-saved-chevron",
    onClick: () => setSavedOpen(v => !v),
    "aria-label": "Open saved locations",
    title: "Pick from saved locations",
    className: "absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md flex items-center justify-center bg-amber-700/30 hover:bg-amber-600/50 border border-amber-500/40 text-amber-200"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    style: {
      transform: savedOpen ? 'rotate(180deg)' : 'none',
      transition: 'transform .15s'
    }
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "6 9 12 15 18 9"
  }))), savedOpen && savedLocs.length > 0 && /*#__PURE__*/React.createElement("div", {
    "data-testid": "loc-saved-dropdown",
    className: "absolute z-[600] left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-600 rounded-lg shadow-2xl max-h-64 overflow-y-auto"
  }, savedLocs.map(loc => {
    var isActive = (cfg.siteName || '').trim() === loc.name;
    return /*#__PURE__*/React.createElement("button", {
      key: loc.name,
      type: "button",
      onClick: () => pickSavedLoc(loc),
      "data-testid": "loc-saved-opt-".concat(loc.name),
      className: "w-full text-left px-3 py-2 border-b border-slate-800 last:border-b-0 hover:bg-amber-900/30 transition-colors\n                                                        ".concat(isActive ? 'bg-amber-900/50' : '')
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-sm text-slate-100 truncate"
    }, loc.name), /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-slate-500 font-mono mt-0.5"
    }, loc.lat.toFixed(2), ", ", loc.lon.toFixed(2)));
  }))), /*#__PURE__*/React.createElement("p", {
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
  var _React$useState17 = React.useState(null),
    _React$useState18 = _slicedToArray(_React$useState17, 2),
    expandedId = _React$useState18[0],
    setExpandedId = _React$useState18[1];
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBfd2Fsay5jb21waWxlZC5qcyIsIm5hbWVzIjpbIl9SZWFjdCIsIlJlYWN0IiwidXNlU3RhdGUiLCJ1c2VNZW1vIiwiU1RFUFMiLCJrZXkiLCJsYWJlbCIsInN1YiIsImtpbmQiLCJpY29uQ29sb3IiLCJhY2NlbnQiLCJBcHAiLCJfdXNlU3RhdGUiLCJwc3kiLCJsb2NhdGlvbiIsImxhbmd1YWdlIiwicGx1Z2lucyIsIl91c2VTdGF0ZTIiLCJfc2xpY2VkVG9BcnJheSIsImRvbmUiLCJzZXREb25lIiwiX3VzZVN0YXRlMyIsIl91c2VTdGF0ZTQiLCJyb3V0ZSIsInNldFJvdXRlIiwiX3VzZVN0YXRlNSIsIl91c2VTdGF0ZTYiLCJtb2RhbCIsInNldE1vZGFsIiwiX3VzZVN0YXRlNyIsImdpdm9uaSIsInJoUHJlc2V0IiwicmhMbyIsInJoSGkiLCJ0TG8iLCJ0SGkiLCJ0aGVtZSIsImRhcmtMZXZlbCIsIl91c2VTdGF0ZTgiLCJwc3lDZmciLCJzZXRQc3lDZmciLCJfdXNlU3RhdGU5Iiwic2l0ZU5hbWUiLCJjaXR5IiwibGF0IiwibG9uIiwiX3VzZVN0YXRlMCIsImxvY0NmZyIsInNldExvY0NmZyIsIl91c2VTdGF0ZTEiLCJ2IiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsImFsbG93ZWQiLCJpbmRleE9mIiwibGFuZyIsImUiLCJfdXNlU3RhdGUxMCIsImxhbmdDZmciLCJzZXRMYW5nQ2ZnIiwiX3VzZVN0YXRlMTEiLCJlbmFibGVkIiwiX3VzZVN0YXRlMTIiLCJwbHVnaW5DZmciLCJzZXRQbHVnaW5DZmciLCJjb21wbGV0ZUNvdW50IiwiT2JqZWN0IiwidmFsdWVzIiwiZmlsdGVyIiwiQm9vbGVhbiIsImxlbmd0aCIsImZpbmlzaCIsImQiLCJfb2JqZWN0U3ByZWFkIiwiY3JlYXRlRWxlbWVudCIsIlBzeUNoYXJ0U2V0dGluZ1BhZ2UiLCJjZmciLCJzZXRDZmciLCJvbkJhY2siLCJvblNhdmUiLCJjbGFzc05hbWUiLCJocmVmIiwib25DbGljayIsInNldEl0ZW0iLCJzdHlsZSIsImFuaW1hdGlvbkRlbGF5IiwibWFwIiwicyIsImkiLCJUaWxlIiwic3RlcCIsImluZGV4IiwiY29uY2F0IiwiTG9jYXRpb25Nb2RhbCIsIm9uQ2xvc2UiLCJMYW5ndWFnZU1vZGFsIiwiUGx1Z2luc01vZGFsIiwiX3JlZiIsImJhY2tncm91bmQiLCJib3JkZXIiLCJUaWxlSWNvbiIsImNvbG9yIiwiX3JlZjIiLCJzdHJva2UiLCJmaWxsIiwic3Ryb2tlV2lkdGgiLCJzdHJva2VMaW5lY2FwIiwic3Ryb2tlTGluZWpvaW4iLCJfZXh0ZW5kcyIsIndpZHRoIiwiaGVpZ2h0Iiwidmlld0JveCIsImN4IiwiY3kiLCJyIiwiX3JlZjMiLCJ1cGRhdGUiLCJrIiwiYyIsInVzZUVmZmVjdCIsInJhdyIsInByZXNldCIsInBhdGNoIiwicCIsIkpTT04iLCJwYXJzZSIsIk51bWJlciIsImlzRmluaXRlIiwibG8iLCJoaSIsIlJIX1BSRVNFVFMiLCJmaW5kIiwieCIsImlkIiwidGgiLCJkbCIsInBhcnNlRmxvYXQiLCJ0clJhdyIsInRyIiwibWluIiwibWF4Iiwia2V5cyIsInBlcnNpc3RBbmRTYXZlIiwic3RyaW5naWZ5IiwiU3RyaW5nIiwid2luZG93IiwiZGlzcGF0Y2hFdmVudCIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwiY29uc29sZSIsImluZm8iLCJ3YXJuIiwiUHN5U2tlbGV0b24iLCJQc3lDb250cm9sUGFuZWwiLCJub3RlIiwiX3JlZjQiLCJXIiwiSCIsInBhZCIsImxlZnQiLCJyaWdodCIsInRvcCIsImJvdHRvbSIsImdyaWRXIiwiZ3JpZEgiLCJUX01JTiIsIlRfTUFYIiwiV19NSU4iLCJXX01BWCIsInQiLCJ5IiwidyIsIl9nZXRXIiwiZ2V0VyIsInJoIiwic2FmZVB0cyIsImFyciIsInRvRml4ZWQiLCJqb2luIiwicmg4MCIsInB1c2giLCJyaDEwMCIsInJoMjBMaW5lIiwicmgyMF9DWiIsIkNaIiwicmhIaV90b3AiLCJ0dCIsInJoTG9fYm90IiwiU1dFRVQiLCJOViIsIk1hc3MiLCJNQ1YiLCJFVkFQIiwid2ludGVyUkg4MCIsIndpbnRlclJIMjAiLCJXSU5URVIiLCJpc29wbGV0aHMiLCJpc0xpZ2h0IiwicGFsZXR0ZSIsImJnIiwiZ3JpZCIsInRpY2siLCJheGlzIiwicGFuZWxCZyIsInBhbmVsQm9yZGVyIiwicGlsbEJnIiwicGlsbEZnIiwibWV0YUZnIiwiZGltRmlsdGVyIiwiTWF0aCIsImJvcmRlckNvbG9yIiwiYm9yZGVyUmFkaXVzIiwiQXJyYXkiLCJmcm9tIiwiXyIsIngxIiwieTEiLCJ4MiIsInkyIiwiZm9udFNpemUiLCJ0ZXh0QW5jaG9yIiwicHRzIiwid3ciLCJwb2ludHMiLCJzdHJva2VEYXNoYXJyYXkiLCJmbG9vciIsImZvbnRXZWlnaHQiLCJvcGFjaXR5IiwiZmlsbE9wYWNpdHkiLCJjbGlwUGF0aFVuaXRzIiwiY2xpcFBhdGgiLCJ0cmFuc2Zvcm0iLCJsZXR0ZXJTcGFjaW5nIiwicGFpbnRPcmRlciIsIl9yZWY1Iiwicm91bmQiLCJ0eXBlIiwidmFsdWUiLCJvbkNoYW5nZSIsInRhcmdldCIsImFjY2VudENvbG9yIiwiX25vcm1hbGl6ZUxvY3MiLCJzZWVuIiwiU2V0Iiwib3V0IiwibCIsIm5hbWUiLCJ0cmltIiwiaGFzIiwiYWRkIiwiX3JlZjYiLCJtYXBCb3hSZWYiLCJ1c2VSZWYiLCJtYXBSZWYiLCJtYXJrZXJSZWYiLCJfUmVhY3QkdXNlU3RhdGUiLCJfUmVhY3QkdXNlU3RhdGUyIiwiZ2VvQnVzeSIsInNldEdlb0J1c3kiLCJfUmVhY3QkdXNlU3RhdGUzIiwiaXNBcnJheSIsIl9SZWFjdCR1c2VTdGF0ZTQiLCJzYXZlZExvY3MiLCJzZXRTYXZlZExvY3MiLCJjYW5jZWxsZWQiLCJfYXN5bmNUb0dlbmVyYXRvciIsImZldGNoIiwiY3JlZGVudGlhbHMiLCJjYWNoZSIsIm9rIiwiaiIsImpzb24iLCJzYXZlZCIsIl9SZWFjdCR1c2VTdGF0ZTUiLCJfUmVhY3QkdXNlU3RhdGU2Iiwic2F2ZWRPcGVuIiwic2V0U2F2ZWRPcGVuIiwic2F2ZWRSZWYiLCJvbkRvY0NsaWNrIiwiY3VycmVudCIsImNvbnRhaW5zIiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm9uU2l0ZU5hbWVDaGFuZ2UiLCJuZXdOYW1lIiwiaGl0Iiwic2V0VmlldyIsInBpY2tTYXZlZExvYyIsImxvYyIsIl9SZWFjdCR1c2VTdGF0ZTciLCJfUmVhY3QkdXNlU3RhdGU4Iiwic2VhcmNoUSIsInNldFNlYXJjaFEiLCJfUmVhY3QkdXNlU3RhdGU5IiwiX1JlYWN0JHVzZVN0YXRlMCIsInNlYXJjaEhpdHMiLCJzZXRTZWFyY2hIaXRzIiwiX1JlYWN0JHVzZVN0YXRlMSIsIl9SZWFjdCR1c2VTdGF0ZTEwIiwic2VhcmNoQnVzeSIsInNldFNlYXJjaEJ1c3kiLCJfUmVhY3QkdXNlU3RhdGUxMSIsIl9SZWFjdCR1c2VTdGF0ZTEyIiwic2VhcmNoT3BlbiIsInNldFNlYXJjaE9wZW4iLCJzZWFyY2hEZWJvdW5jZVJlZiIsInJ1blNlYXJjaCIsIl9yZWY4IiwicSIsInVybCIsImVuY29kZVVSSUNvbXBvbmVudCIsImhlYWRlcnMiLCJfeCIsImFwcGx5IiwiYXJndW1lbnRzIiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsInBpY2tTZWFyY2hIaXQiLCJkaXNwbGF5X25hbWUiLCJyZXZlcnNlR2VvY29kZSIsIl9yZWY5IiwiYSIsImFkZHJlc3MiLCJ0b3duIiwidmlsbGFnZSIsImhhbWxldCIsImNvdW50eSIsInJlZ2lvbiIsInN0YXRlIiwiY291bnRyeSIsIl94MiIsIl94MyIsIkwiLCJ6b29tQ29udHJvbCIsImF0dHJpYnV0aW9uQ29udHJvbCIsInRpbGVMYXllciIsIm1heFpvb20iLCJhdHRyaWJ1dGlvbiIsImFkZFRvIiwibWFya2VyIiwiZHJhZ2dhYmxlIiwiYmluZFRvb2x0aXAiLCJwZXJtYW5lbnQiLCJhcHBseUxhdExvbiIsIm4iLCJvbiIsImxsIiwiZ2V0TGF0TG5nIiwibG5nIiwic2V0TGF0TG5nIiwibGF0bG5nIiwiaW52YWxpZGF0ZVNpemUiLCJyZW1vdmUiLCJwYW5UbyIsIl9SZWFjdCR1c2VTdGF0ZTEzIiwiX1JlYWN0JHVzZVN0YXRlMTQiLCJnZW9TdGF0ZSIsInNldEdlb1N0YXRlIiwidXNlTXlMb2NhdGlvbiIsIm5hdmlnYXRvciIsImdlb2xvY2F0aW9uIiwiZXJyIiwiZ2V0Q3VycmVudFBvc2l0aW9uIiwicG9zIiwiY29vcmRzIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJtc2ciLCJjb2RlIiwibWVzc2FnZSIsImVuYWJsZUhpZ2hBY2N1cmFjeSIsInRpbWVvdXQiLCJtYXhpbXVtQWdlIiwiX1JlYWN0JHVzZVN0YXRlMTUiLCJfUmVhY3QkdXNlU3RhdGUxNiIsInNhdmVNc2ciLCJzZXRTYXZlTXNnIiwiX3JlZjAiLCJkZWR1cGVkIiwibmV4dFNhdmVkIiwic2xpY2UiLCJwZXJzaXN0ZWQiLCJ3YXJuaW5nIiwibWV0aG9kIiwiYm9keSIsImFjdGl2ZSIsImRlZmF1bHQiLCJfbGFzdFdlYXRoZXJMb2NhdGlvblNhdmUiLCJNb2RhbFNoZWxsIiwidGl0bGUiLCJzdWJ0aXRsZSIsInNpemUiLCJtaW5IZWlnaHQiLCJyZWYiLCJvdmVyZmxvdyIsIm9uRm9jdXMiLCJwbGFjZWhvbGRlciIsIm91dGxpbmUiLCJoIiwicGxhY2VfaWQiLCJjbGFzcyIsInRyYW5zaXRpb24iLCJpc0FjdGl2ZSIsImRpc2FibGVkIiwicHJvdG9jb2wiLCJ6IiwiX3JlZjEiLCJsYW5ncyIsIm5hdGl2ZSIsIkV2ZW50IiwiUExVR0lOX0NPTkZJR19GSUVMRFMiLCJ3ZWF0aGVyIiwib3B0aW9ucyIsImRlZiIsInN3ZWV0X3Nwb3QiLCJnMzYiLCJkaWJ0IiwibGlnaHRpbmciLCJfcmVmMTAiLCJBTEwiLCJkZXNjIiwidmVyIiwidG9nZ2xlIiwiaW5jbHVkZXMiLCJfUmVhY3QkdXNlU3RhdGUxNyIsIl9SZWFjdCR1c2VTdGF0ZTE4IiwiZXhwYW5kZWRJZCIsInNldEV4cGFuZGVkSWQiLCJ1cGRhdGVGaWVsZCIsInBsdWdpbklkIiwiZmllbGRLZXkiLCJmaWVsZHMiLCJmaWVsZFZhbCIsImZpZWxkIiwic3RvcmVkIiwidW5kZWZpbmVkIiwiZXhwYW5kZWQiLCJmIiwibyIsIm5leHQiLCJfcmVmMTEiLCJfcmVmMTEkYWNjZW50IiwiX3JlZjExJHNpemUiLCJjaGlsZHJlbiIsImNvbG9yTWFwIiwiaW5kaWdvIiwiYW1iZXIiLCJlbWVyYWxkIiwicGluayIsInNpemVNYXAiLCJ3aWRlIiwic3RvcFByb3BhZ2F0aW9uIiwibWF4SGVpZ2h0IiwiYm94U2hhZG93IiwiUmVhY3RET00iLCJjcmVhdGVSb290IiwiZ2V0RWxlbWVudEJ5SWQiLCJyZW5kZXIiXSwic291cmNlcyI6WyIuLi9zcmMvc2V0dXAtd2Fsay9zZXR1cF93YWxrLmpzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB7IHVzZVN0YXRlLCB1c2VNZW1vIH0gPSBSZWFjdDtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogU1RFUCBERUZJTklUSU9OUyDigJQgdGhlIDQgd2FsayBwYXRocyB0aGUgdXNlciBkZXNjcmliZWRcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmNvbnN0IFNURVBTID0gW1xuICAgIHsga2V5Oidwc3knLCAgICAgIGxhYmVsOidQc3kgQ2hhcnQgU2V0dGluZycsICAgIHN1YjonR2l2b25pIMK3IFJIIHJhbmdlIMK3IGF4aXMgcmFuZ2UnLCBraW5kOidwYWdlJywgIGljb25Db2xvcjonIzgxOGNmOCcsIGFjY2VudDonaW5kaWdvJyB9LFxuICAgIHsga2V5Oidsb2NhdGlvbicsIGxhYmVsOidMb2NhdGlvbiBTZXR0aW5nJywgICAgIHN1YjonQ2l0eSBuYW1lICYgbGF0IC8gbG9uZycsICAgICAgICAga2luZDonbW9kYWwnLCBpY29uQ29sb3I6JyNmYmJmMjQnLCBhY2NlbnQ6J2FtYmVyJyB9LFxuICAgIHsga2V5OidsYW5ndWFnZScsIGxhYmVsOidMYW5ndWFnZSBTZXR0aW5nJywgICAgIHN1YjonRU4gwrcgRlIgwrcgRVMgwrcgWkggwrcg4oCmJywgICAgICAgICAga2luZDonbW9kYWwnLCBpY29uQ29sb3I6JyMzNGQzOTknLCBhY2NlbnQ6J2VtZXJhbGQnIH0sXG4gICAgeyBrZXk6J3BsdWdpbnMnLCAgbGFiZWw6J1BsdWctaW4gU2V0dGluZycsICAgICAgc3ViOidMaXN0IMK3IHVwbG9hZCDCtyBtb2RpZnknLCAgICAgICAgIGtpbmQ6J21vZGFsJywgaWNvbkNvbG9yOicjZjQ3MmI2JywgYWNjZW50OidwaW5rJyB9LFxuXTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogUk9PVCBBUFBcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIEFwcCgpIHtcbiAgICAvKiBjb21wbGV0aW9uICsgcGVyLXN0ZXAgY29uZmlnIC0tIG1vY2t1cCBzdGF0ZSwgbmV2ZXIgcGVyc2lzdGVkICovXG4gICAgY29uc3QgW2RvbmUsIHNldERvbmVdID0gdXNlU3RhdGUoeyBwc3k6ZmFsc2UsIGxvY2F0aW9uOmZhbHNlLCBsYW5ndWFnZTpmYWxzZSwgcGx1Z2luczpmYWxzZSB9KTtcbiAgICBjb25zdCBbcm91dGUsIHNldFJvdXRlXSA9IHVzZVN0YXRlKCdodWInKTsgICAvLyAnaHViJyB8ICdwc3knXG4gICAgY29uc3QgW21vZGFsLCBzZXRNb2RhbF0gPSB1c2VTdGF0ZShudWxsKTsgICAgIC8vICdsb2NhdGlvbicgfCAnbGFuZ3VhZ2UnIHwgJ3BsdWdpbnMnIHwgbnVsbFxuXG4gICAgY29uc3QgW3BzeUNmZywgc2V0UHN5Q2ZnXSAgICAgICAgID0gdXNlU3RhdGUoeyBnaXZvbmk6dHJ1ZSwgcmhQcmVzZXQ6J29mZmljZScsIHJoTG86MzAsIHJoSGk6NjAsIHRMbzotMTUsIHRIaTo1MCwgdGhlbWU6J2RhcmsnLCBkYXJrTGV2ZWw6Mi4wIH0pO1xuICAgIGNvbnN0IFtsb2NDZmcsIHNldExvY0NmZ10gICAgICAgICA9IHVzZVN0YXRlKHsgc2l0ZU5hbWU6J015IEJ1aWxkaW5nJywgY2l0eTonVG9yb250bywgT04nLCBsYXQ6NDMuNjUzMiwgbG9uOi03OS4zODMyIH0pO1xuICAgIGNvbnN0IFtsYW5nQ2ZnLCBzZXRMYW5nQ2ZnXSAgICAgICA9IHVzZVN0YXRlKCgpID0+IHtcbiAgICAgICAgLyogTGF6eSBpbml0IGZyb20gdGhlIHNhbWUgbG9jYWxTdG9yYWdlIGtleSB0aGUgZGFzaGJvYXJkIHJlYWRzLCBzb1xuICAgICAgICAgKiByZW9wZW5pbmcgdGhlIHNldHVwIHdhbGsgc2hvd3MgdGhlIGN1cnJlbnRseS1hY3RpdmUgbGFuZ3VhZ2VcbiAgICAgICAgICogcmF0aGVyIHRoYW4gYWx3YXlzIGRlZmF1bHRpbmcgdG8gRW5nbGlzaC4gKi9cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHYgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnaTE4bl9sYW5nJyk7XG4gICAgICAgICAgICBjb25zdCBhbGxvd2VkID0gWydlbicsJ3poLUNOJywnemgtVFcnLCdqYScsJ2tvJ107XG4gICAgICAgICAgICBpZiAodiAmJiBhbGxvd2VkLmluZGV4T2YodikgIT09IC0xKSByZXR1cm4geyBsYW5nOiB2IH07XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogcHJpdmF0ZSBtb2RlIC0+IGZhbGwgdGhyb3VnaCAqLyB9XG4gICAgICAgIHJldHVybiB7IGxhbmc6J2VuJyB9O1xuICAgIH0pO1xuICAgIGNvbnN0IFtwbHVnaW5DZmcsIHNldFBsdWdpbkNmZ10gICA9IHVzZVN0YXRlKHsgZW5hYmxlZDpbJ3dlYXRoZXInLCdnaXZvbmknLCdzd2VldF9zcG90J10gfSk7XG5cbiAgICBjb25zdCBjb21wbGV0ZUNvdW50ID0gT2JqZWN0LnZhbHVlcyhkb25lKS5maWx0ZXIoQm9vbGVhbikubGVuZ3RoO1xuXG4gICAgY29uc3QgZmluaXNoID0gKGtleSkgPT4ge1xuICAgICAgICBzZXREb25lKGQgPT4gKHsuLi5kLCBba2V5XTp0cnVlfSkpO1xuICAgICAgICBzZXRSb3V0ZSgnaHViJyk7XG4gICAgICAgIHNldE1vZGFsKG51bGwpO1xuICAgIH07XG5cbiAgICAvKiBmdWxsLXBhZ2UgUHN5IENoYXJ0IGVkaXRvciAqL1xuICAgIGlmIChyb3V0ZSA9PT0gJ3BzeScpIHtcbiAgICAgICAgcmV0dXJuIDxQc3lDaGFydFNldHRpbmdQYWdlIGNmZz17cHN5Q2ZnfSBzZXRDZmc9e3NldFBzeUNmZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQmFjaz17KCkgPT4gc2V0Um91dGUoJ2h1YicpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXsoKSA9PiBmaW5pc2goJ3BzeScpfSAvPjtcbiAgICB9XG5cbiAgICAvKiBkZWZhdWx0OiBIVUIgc2NyZWVuICovXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtaW4taC1zY3JlZW4gcHgtNiBweS04XCI+XG4gICAgICAgICAgICB7LyogLS0tLS0tLS0tLS0tLSBoZWFkZXIgLS0tLS0tLS0tLS0tLSAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctNXhsIG14LWF1dG8gZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIG1iLTEwIGZhZGUtdXBcIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwidGV4dC0yeGwgc206dGV4dC0zeGwgZm9udC1ibGFjayBpdGFsaWMgdXBwZXJjYXNlIHRyYWNraW5nLXRpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXJlZC01MDBcIj5SZWQ1PC9zcGFuPiA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlXCI+U3R1ZGlvPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgZm9udC1ub3JtYWwgaXRhbGljXCI+ICZuYnNwOy8mbmJzcDsgc2V0dXAgd2Fsazwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9oMT5cbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgdGV4dC14cyBtdC0xIGZvbnQtbW9ubyB0cmFja2luZy13aWRlXCI+Q29uZmlndXJlIG9uY2UuIFNraXAgYW55IHN0ZXAgeW91IGRvbid0IG5lZWQuPC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTRcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicGlsbCBiZy1zbGF0ZS04MDAgdGV4dC1zbGF0ZS00MDBcIj57Y29tcGxldGVDb3VudH0vNCBET05FPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiL2Rhc2hib2FyZC5odG1sXCJcbiAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4geyB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS5zZXR1cC5kb25lJywnMScpOyB9IGNhdGNoKGUpe30gfX1cbiAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXNsYXRlLTUwMCBob3Zlcjp0ZXh0LXNsYXRlLTMwMCB1bmRlcmxpbmUgdW5kZXJsaW5lLW9mZnNldC00XCI+U2tpcCBhbGwg4oaSPC9hPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiAtLS0tLS0tLS0tLS0tIHRpbGUgZ3JpZCAtLS0tLS0tLS0tLS0tICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXgtdy01eGwgbXgtYXV0byBncmlkIGdyaWQtY29scy0xIHNtOmdyaWQtY29scy0yIGdhcC01IGZhZGUtdXBcIiBzdHlsZT17e2FuaW1hdGlvbkRlbGF5OicuMDhzJ319PlxuICAgICAgICAgICAgICAgIHtTVEVQUy5tYXAoKHMsIGkpID0+IChcbiAgICAgICAgICAgICAgICAgICAgPFRpbGUga2V5PXtzLmtleX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3RlcD17c31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZT17ZG9uZVtzLmtleV19XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4PXtpKzF9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHMua2luZCA9PT0gJ3BhZ2UnID8gc2V0Um91dGUocy5rZXkpIDogc2V0TW9kYWwocy5rZXkpfSAvPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiAtLS0tLS0tLS0tLS0tIGZvb3RlciBDVEEgLS0tLS0tLS0tLS0tLSAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctNXhsIG14LWF1dG8gbXQtMTAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIGZhZGUtdXBcIiBzdHlsZT17e2FuaW1hdGlvbkRlbGF5OicuMThzJ319PlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNTAwIHRleHQteHMgZm9udC1tb25vXCI+XG4gICAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZUNvdW50ID09PSAwICYmICfihpEgUGljayBhIHNldHRpbmcgdG8gc3RhcnQsIG9yIHNraXAgYWxsIGFuZCBnbyBzdHJhaWdodCB0byB0aGUgZGFzaGJvYXJkLid9XG4gICAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZUNvdW50ID4gMCAmJiBjb21wbGV0ZUNvdW50IDwgNCAmJiBg4oaRICR7NCAtIGNvbXBsZXRlQ291bnR9IHN0ZXAkezQgLSBjb21wbGV0ZUNvdW50ID09PSAxID8gJycgOiAncyd9IHJlbWFpbmluZyAob3B0aW9uYWwpLmB9XG4gICAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZUNvdW50ID09PSA0ICYmICfinJMgQWxsIHN0ZXBzIGNvbmZpZ3VyZWQuICBSZWFkeSB3aGVuIHlvdSBhcmUuJ31cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cIi9kYXNoYm9hcmQuaHRtbFwiXG4gICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4geyB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS5zZXR1cC5kb25lJywnMScpOyB9IGNhdGNoKGUpe30gfX1cbiAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweC03IHB5LTMgcm91bmRlZC14bCB0ZXh0LXNtIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjb21wbGV0ZUNvdW50ID09PSA0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctZW1lcmFsZC02MDAgaG92ZXI6YmctZW1lcmFsZC01MDAgdGV4dC13aGl0ZSBzaGFkb3ctbGcgc2hhZG93LWVtZXJhbGQtNTAwLzMwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLWluZGlnby02MDAgaG92ZXI6YmctaW5kaWdvLTUwMCB0ZXh0LXdoaXRlIHNoYWRvdy1sZyBzaGFkb3ctaW5kaWdvLTUwMC8yMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgIE9wZW4gRGFzaGJvYXJkIOKGklxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogLS0tLS0tLS0tLS0tLSBtb2RhbHMgLS0tLS0tLS0tLS0tLSAqL31cbiAgICAgICAgICAgIHttb2RhbCA9PT0gJ2xvY2F0aW9uJyAmJiA8TG9jYXRpb25Nb2RhbCBjZmc9e2xvY0NmZ30gc2V0Q2ZnPXtzZXRMb2NDZmd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRNb2RhbChudWxsKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2F2ZT17KCkgPT4gZmluaXNoKCdsb2NhdGlvbicpfSAvPn1cbiAgICAgICAgICAgIHttb2RhbCA9PT0gJ2xhbmd1YWdlJyAmJiA8TGFuZ3VhZ2VNb2RhbCBjZmc9e2xhbmdDZmd9IHNldENmZz17c2V0TGFuZ0NmZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldE1vZGFsKG51bGwpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXsoKSA9PiBmaW5pc2goJ2xhbmd1YWdlJyl9IC8+fVxuICAgICAgICAgICAge21vZGFsID09PSAncGx1Z2lucycgICYmIDxQbHVnaW5zTW9kYWwgIGNmZz17cGx1Z2luQ2ZnfSBzZXRDZmc9e3NldFBsdWdpbkNmZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldE1vZGFsKG51bGwpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXsoKSA9PiBmaW5pc2goJ3BsdWdpbnMnKX0gLz59XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFRpbGUgKGxhcmdlIGVhc3ktb24tZXllcyBidXR0b24pXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5mdW5jdGlvbiBUaWxlKHsgc3RlcCwgZG9uZSwgaW5kZXgsIG9uQ2xpY2sgfSkge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxidXR0b24gb25DbGljaz17b25DbGlja31cbiAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17YHNldHVwLXRpbGUtJHtzdGVwLmtleX1gfVxuICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2BPcGVuICR7c3RlcC5sYWJlbH1gfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHRpbGUtYnRuIHJlbGF0aXZlIHRleHQtbGVmdCBiZy1zbGF0ZS05MDAvNzAgYm9yZGVyLTIgYm9yZGVyLXNsYXRlLTcwMC83MFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdW5kZWQtMnhsIHAtNiBzbTpwLTcgJHtkb25lID8gJ2RvbmUnIDogJyd9YH0+XG4gICAgICAgICAgICB7ZG9uZSAmJiA8c3BhbiBjbGFzc05hbWU9XCJjaGVja1wiIGRhdGEtdGVzdGlkPXtgc2V0dXAtdGlsZS0ke3N0ZXAua2V5fS1kb25lYH0+4pyTPC9zcGFuPn1cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTQgbWItM1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy0xMiBoLTEyIHJvdW5kZWQteGwgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOmAke3N0ZXAuaWNvbkNvbG9yfTIyYCwgYm9yZGVyOmAxcHggc29saWQgJHtzdGVwLmljb25Db2xvcn01NWB9fT5cbiAgICAgICAgICAgICAgICAgICAgPFRpbGVJY29uIGtpbmQ9e3N0ZXAua2V5fSBjb2xvcj17c3RlcC5pY29uQ29sb3J9IC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LTN4bCBmb250LWJsYWNrIHRleHQtc2xhdGUtNzAwXCI+MHtpbmRleH08L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtbGcgc206dGV4dC14bCBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlciBtYi0xXCJcbiAgICAgICAgICAgICAgICBzdHlsZT17e2NvbG9yOnN0ZXAuaWNvbkNvbG9yfX0+e3N0ZXAubGFiZWx9PC9oMz5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNDAwIHRleHQtc20gbGVhZGluZy1zbnVnXCI+e3N0ZXAuc3VifTwvcD5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNCBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiB0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTUwMFwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInBpbGwgYmctc2xhdGUtODAwIHRleHQtc2xhdGUtNDAwXCI+e3N0ZXAua2luZCA9PT0gJ3BhZ2UnID8gJ0Z1bGwgcGFnZScgOiAnUG9wdXAnfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICB7ZG9uZSAmJiA8c3BhbiBjbGFzc05hbWU9XCJwaWxsIGJnLWVtZXJhbGQtOTAwLzQwIHRleHQtZW1lcmFsZC00MDBcIj5Db25maWd1cmVkPC9zcGFuPn1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2J1dHRvbj5cbiAgICApO1xufVxuXG5mdW5jdGlvbiBUaWxlSWNvbih7IGtpbmQsIGNvbG9yIH0pIHtcbiAgICAvKiBzaW1wbGUgaW5saW5lIFNWR3Mgc28gd2Uga2VlcCB0aGUgZmlsZSBzZWxmLWNvbnRhaW5lZCAqL1xuICAgIGNvbnN0IHN0cm9rZSA9IHsgc3Ryb2tlOmNvbG9yLCBmaWxsOidub25lJywgc3Ryb2tlV2lkdGg6Miwgc3Ryb2tlTGluZWNhcDoncm91bmQnLCBzdHJva2VMaW5lam9pbjoncm91bmQnIH07XG4gICAgaWYgKGtpbmQgPT09ICdwc3knKSAgICAgIHJldHVybiA8c3ZnIHdpZHRoPVwiMjJcIiBoZWlnaHQ9XCIyMlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB7Li4uc3Ryb2tlfT48cGF0aCBkPVwiTTMgM3YxOGgxOFwiLz48cGF0aCBkPVwiTTMgMTdjNC0xIDctNiA5LTlzNS0zIDktMlwiLz48L3N2Zz47XG4gICAgaWYgKGtpbmQgPT09ICdsb2NhdGlvbicpIHJldHVybiA8c3ZnIHdpZHRoPVwiMjJcIiBoZWlnaHQ9XCIyMlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB7Li4uc3Ryb2tlfT48cGF0aCBkPVwiTTEyIDIycy03LTYuNC03LTEyYTcgNyAwIDEgMSAxNCAwYzAgNS42LTcgMTItNyAxMnpcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMFwiIHI9XCIyLjVcIi8+PC9zdmc+O1xuICAgIGlmIChraW5kID09PSAnbGFuZ3VhZ2UnKSByZXR1cm4gPHN2ZyB3aWR0aD1cIjIyXCIgaGVpZ2h0PVwiMjJcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgey4uLnN0cm9rZX0+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI5XCIvPjxwYXRoIGQ9XCJNMyAxMmgxOE0xMiAzYTE0IDE0IDAgMCAxIDAgMThNMTIgM2ExNCAxNCAwIDAgMCAwIDE4XCIvPjwvc3ZnPjtcbiAgICBpZiAoa2luZCA9PT0gJ3BsdWdpbnMnKSAgcmV0dXJuIDxzdmcgd2lkdGg9XCIyMlwiIGhlaWdodD1cIjIyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHsuLi5zdHJva2V9PjxwYXRoIGQ9XCJNOSAzdjZNMTUgM3Y2XCIvPjxwYXRoIGQ9XCJNNSA5aDE0djZhNCA0IDAgMCAxLTQgNGgtMXYzTTkgMTl2M1wiLz48L3N2Zz47XG4gICAgcmV0dXJuIG51bGw7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFBzeSBDaGFydCBTZXR0aW5nIC0tIEZVTEwgUEFHRSwgbGl2ZSBza2VsZXRvbiByZXNwb25kcyB0byBjb250cm9sc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuZnVuY3Rpb24gUHN5Q2hhcnRTZXR0aW5nUGFnZSh7IGNmZywgc2V0Q2ZnLCBvbkJhY2ssIG9uU2F2ZSB9KSB7XG4gICAgY29uc3QgdXBkYXRlID0gKGssIHYpID0+IHNldENmZyhjID0+ICh7Li4uYywgW2tdOnZ9KSk7XG5cbiAgICAvKiBPbiBtb3VudDogaHlkcmF0ZSBmcm9tIHRoZSBTQU1FIGxvY2FsU3RvcmFnZSBrZXkgdGhlIGRhc2hib2FyZCByZWFkc1xuICAgICAqIChgcmVkNV9zd2VldF9zcG90X3JhbmdlYCkgcGx1cyB0aGUgcHJlc2V0IGlkIChgcmVkNV9yaF9wcmVzZXRgKSBzb1xuICAgICAqIHRoZSBkcm9wZG93biBsYWJlbCBzdGF5cyBjb25zaXN0ZW50IHdpdGggdGhlIHNsaWRlciB2YWx1ZXMgYWNyb3NzXG4gICAgICogcmVsb2Fkcy4gIElmIHRoZSBvcGVyYXRvciBoYXMgYWxyZWFkeSB0dW5lZCB0aGUgUkggYmFuZCBvbiB0aGVcbiAgICAgKiBkYXNoYm9hcmQsIHRoZSBzZXR1cCB3YWxrIHN0YXJ0cyBmcm9tIHRob3NlIHZhbHVlcy4gKi9cbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmF3ICAgID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlZDVfc3dlZXRfc3BvdF9yYW5nZScpO1xuICAgICAgICAgICAgY29uc3QgcHJlc2V0ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlZDVfcmhfcHJlc2V0Jyk7XG4gICAgICAgICAgICBjb25zdCBwYXRjaCAgPSB7fTtcbiAgICAgICAgICAgIGlmIChyYXcpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwID0gSlNPTi5wYXJzZShyYXcpO1xuICAgICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUocC5sbykgJiYgTnVtYmVyLmlzRmluaXRlKHAuaGkpICYmIHAubG8gPCBwLmhpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhdGNoLnJoTG8gPSBwLmxvO1xuICAgICAgICAgICAgICAgICAgICBwYXRjaC5yaEhpID0gcC5oaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJlc2V0ICYmIFJIX1BSRVNFVFMuZmluZCh4ID0+IHguaWQgPT09IHByZXNldCkpIHtcbiAgICAgICAgICAgICAgICBwYXRjaC5yaFByZXNldCA9IHByZXNldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIFRoZW1lICsgYnJpZ2h0bmVzcyDigJQgc2FtZSBrZXlzIGFwcC5qcyAoZGFzaGJvYXJkKSByZWFkcy4gKi9cbiAgICAgICAgICAgIGNvbnN0IHRoID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlZDUudGhlbWUnKTtcbiAgICAgICAgICAgIGlmICh0aCA9PT0gJ2xpZ2h0JyB8fCB0aCA9PT0gJ2RhcmsnKSBwYXRjaC50aGVtZSA9IHRoO1xuICAgICAgICAgICAgY29uc3QgZGwgPSBwYXJzZUZsb2F0KGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWQ1LmRhcmtMZXZlbCcpKTtcbiAgICAgICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUoZGwpICYmIGRsID49IDEuNSAmJiBkbCA8PSAzLjApIHBhdGNoLmRhcmtMZXZlbCA9IGRsO1xuICAgICAgICAgICAgLyogVGVtcGVyYXR1cmUgYXhpcyByYW5nZSDigJQgd3JpdHRlbiBieSB0aGlzIHNhbWUgcGFnZSdzIHNhdmVcbiAgICAgICAgICAgICAqIGhhbmRsZXI7IGxvYWQgaXQgaGVyZSBzbyByZW9wZW5pbmcgdGhlIHNldHVwIHdhbGsgc2hvd3MgdGhlXG4gICAgICAgICAgICAgKiBjdXJyZW50IGRhc2hib2FyZCBheGlzIGluc3RlYWQgb2YgYWx3YXlzIGRlZmF1bHRpbmcgdG8gLTE1Li41MC4gKi9cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdHJSYXcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVkNV90ZW1wX3JhbmdlJyk7XG4gICAgICAgICAgICAgICAgaWYgKHRyUmF3KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRyID0gSlNPTi5wYXJzZSh0clJhdyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUodHIubWluKSAmJiBOdW1iZXIuaXNGaW5pdGUodHIubWF4KSAmJiB0ci5taW4gPCB0ci5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGNoLnRMbyA9IHRyLm1pbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGNoLnRIaSA9IHRyLm1heDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogaWdub3JlICovIH1cbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhwYXRjaCkubGVuZ3RoKSBzZXRDZmcoYyA9PiAoey4uLmMsIC4uLnBhdGNofSkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IC8qIGlnbm9yZSAqLyB9XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xuICAgIH0sIFtdKTtcblxuICAgIC8qIE9uIHNhdmU6IHBlcnNpc3QgdGhlIFJIIGJhbmQgdG8gbG9jYWxTdG9yYWdlIHNvIHRoZSBkYXNoYm9hcmQnc1xuICAgICAqIHN3ZWV0LXNwb3QgcG9seWdvbiBwaWNrcyBpdCB1cCBvbiBuZXh0IGxvYWQuICBBbHNvIHBlcnNpc3QgdGhlIHZlbnVlXG4gICAgICogcHJlc2V0IGlkIChmb3IgZnV0dXJlIFwic2hvdyBwcmVzZXQgbmFtZSBvbiBkYXNoYm9hcmRcIiBmZWF0dXJlcykuICovXG4gICAgY29uc3QgcGVyc2lzdEFuZFNhdmUgPSAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNV9zd2VldF9zcG90X3JhbmdlJyxcbiAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh7IGxvOiBjZmcucmhMbywgaGk6IGNmZy5yaEhpIH0pKTtcbiAgICAgICAgICAgIGlmIChjZmcucmhQcmVzZXQpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNV9yaF9wcmVzZXQnLCBjZmcucmhQcmVzZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogVGhlbWUgKyBicmlnaHRuZXNzIOKAlCB3cml0dGVuIHRvIHRoZSBTQU1FIGtleXMgdGhlIGRhc2hib2FyZFxuICAgICAgICAgICAgICogKGFwcC5qcyBsaW5lcyA1Ny01OCBhbmQgODQtOTcpIHJlYWRzIGFzIGl0cyB1c2VTdGF0ZSBsYXp5XG4gICAgICAgICAgICAgKiBpbml0aWFsaXNlciwgc28gdGhlIGNob3NlbiB0aGVtZSB0YWtlcyBlZmZlY3Qgb24gbmV4dCBkYXNoYm9hcmRcbiAgICAgICAgICAgICAqIGxvYWQuICBhcHAuanMgdHJlYXRzIGRhcmtMZXZlbCA+PSAzLjAgYXMgbGlnaHQtbW9kZSB0cmlnZ2VyLiAqL1xuICAgICAgICAgICAgaWYgKGNmZy50aGVtZSA9PT0gJ2xpZ2h0JyB8fCBjZmcudGhlbWUgPT09ICdkYXJrJykge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1LnRoZW1lJywgY2ZnLnRoZW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUoY2ZnLmRhcmtMZXZlbCkpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS5kYXJrTGV2ZWwnLCBTdHJpbmcoY2ZnLmRhcmtMZXZlbCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogVGVtcGVyYXR1cmUgYXhpcyByYW5nZSDigJQgZHJpdmVzIHRoZSBkYXNoYm9hcmQncyBwc3kgY2hhcnRcbiAgICAgICAgICAgICAqIFggYXhpcyAoYHRlbXBSYW5nZS5taW4vbWF4YCBpbiBhcHAuanMpLiAgV2Ugd3JpdGUgdGhlIHNhbWVcbiAgICAgICAgICAgICAqIHNoYXBlIGFwcC5qcyByZWFkcyAoYHttaW4sIG1heH1gKSBzbyBpdHMgbGF6eSB1c2VTdGF0ZSBpbml0XG4gICAgICAgICAgICAgKiBwaWNrcyBpdCB1cCBvbiBuZXh0IGxvYWQsIEFORCBkaXNwYXRjaCBhIGN1c3RvbSBldmVudCBzb1xuICAgICAgICAgICAgICogYW55IG9wZW4gZGFzaGJvYXJkIHRhYiB1cGRhdGVzIGxpdmUgd2l0aG91dCBhIHJlZnJlc2guICovXG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGNmZy50TG8pICYmIE51bWJlci5pc0Zpbml0ZShjZmcudEhpKSAmJiBjZmcudExvIDwgY2ZnLnRIaSkge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1X3RlbXBfcmFuZ2UnLFxuICAgICAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh7IG1pbjogY2ZnLnRMbywgbWF4OiBjZmcudEhpIH0pKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3I1LXRlbXAtcmFuZ2UtY2hhbmdlJywge1xuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHsgbWluOiBjZmcudExvLCBtYXg6IGNmZy50SGkgfVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncjUtcmgtYmFuZC1jaGFuZ2UnLCB7XG4gICAgICAgICAgICAgICAgZGV0YWlsOiB7IGxvOiBjZmcucmhMbywgaGk6IGNmZy5yaEhpIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnW3NldHVwIHdhbGtdIHBzeSBjaGFydCBzYXZlZCAtPiBSSCcsIGNmZy5yaExvLCAnLScsIGNmZy5yaEhpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICclIFQtYXhpcycsIGNmZy50TG8sICcuLicsIGNmZy50SGksICfCsEMgcHJlc2V0PScsIGNmZy5yaFByZXNldCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignW3NldHVwIHdhbGtdIGNvdWxkIG5vdCBwZXJzaXN0IHBzeSBzZXR0aW5nczonLCBlKTtcbiAgICAgICAgfVxuICAgICAgICBvblNhdmUoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtaW4taC1zY3JlZW4gZmxleCBmbGV4LWNvbFwiPlxuICAgICAgICAgICAgey8qIGhlYWRlciAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHB4LTYgcHktNCBib3JkZXItYiBib3JkZXItc2xhdGUtODAwXCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkJhY2t9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTQwMCBob3Zlcjp0ZXh0LXdoaXRlIHRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrXCI+XG4gICAgICAgICAgICAgICAgICAgIOKGkCBCYWNrIHRvIHNldHVwXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cInRleHQtc20gdXBwZXJjYXNlIHRyYWNraW5nLVswLjNlbV0gZm9udC1ibGFjayB0ZXh0LWluZGlnby00MDBcIj5Qc3kgQ2hhcnQgU2V0dGluZzwvaDE+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtwZXJzaXN0QW5kU2F2ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTUgcHktMiByb3VuZGVkLWxnIGJnLWluZGlnby02MDAgaG92ZXI6YmctaW5kaWdvLTUwMCB0ZXh0LXdoaXRlIHRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrXCI+XG4gICAgICAgICAgICAgICAgICAgIFNhdmUgJiByZXR1cm4g4pyTXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIGJvZHkg4oCUIGNoYXJ0IGxlZnQsIGNvbnRyb2xzIHJpZ2h0ICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTEgZ3JpZCBncmlkLWNvbHMtMSBsZzpncmlkLWNvbHMtWzFmcl8zNjBweF0gZ2FwLTQgcC02IG1heC13LTd4bCBteC1hdXRvIHctZnVsbFwiPlxuICAgICAgICAgICAgICAgIDxQc3lTa2VsZXRvbiBjZmc9e2NmZ30gLz5cbiAgICAgICAgICAgICAgICA8UHN5Q29udHJvbFBhbmVsIGNmZz17Y2ZnfSB1cGRhdGU9e3VwZGF0ZX0gc2V0Q2ZnPXtzZXRDZmd9IC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuLyogUkggYmFuZCBwcmVzZXRzIOKAlCByZWNvZ25pc2VkIGluZHVzdHJ5IHN0YW5kYXJkcyBmb3IgZWFjaCB2ZW51ZSB0eXBlLlxuICogU291cmNlczogQVNIUkFFIDU1IChjb21mb3J0KSwgQVNIUkFFIDE3MCAoaGVhbHRoY2FyZSksXG4gKiBBQU0vTlBTL1NtaXRoc29uaWFuIGd1aWRhbmNlIChjb2xsZWN0aW9ucyksIENJQlNFIFRNNDAgKGxpYnJhcmllcykuICovXG5jb25zdCBSSF9QUkVTRVRTID0gW1xuICAgIHsgaWQ6J2N1c3RvbScsICAgICAgICAgIGxhYmVsOidDdXN0b20gKG1hbnVhbCknLCAgICAgICAgICAgICAgICAgbG86bnVsbCwgaGk6bnVsbCwgbm90ZTonJyB9LFxuICAgIHsgaWQ6J29mZmljZScsICAgICAgICAgIGxhYmVsOidPZmZpY2UnLCAgICAgICAgICAgICAgICAgICAgICAgICAgbG86MzAsICAgaGk6NjAsICAgbm90ZTonQVNIUkFFIDU1IGNvbWZvcnQnICAgICAgICAgICAgICAgICAgfSxcbiAgICB7IGlkOidtdXNldW0nLCAgICAgICAgICBsYWJlbDonTXVzZXVtJywgICAgICAgICAgICAgICAgICAgICAgICAgIGxvOjQwLCAgIGhpOjU1LCAgIG5vdGU6J0FBTSBjb2xsZWN0aW9uIHByZXNlcnZhdGlvbicgICAgICAgIH0sXG4gICAgeyBpZDonaG90ZWwnLCAgICAgICAgICAgbGFiZWw6J0hvdGVsIGd1ZXN0IHJvb20nLCAgICAgICAgICAgICAgICBsbzozMCwgICBoaTo2MCwgICBub3RlOidnZW5lcmFsIG9jY3VwYW50IGNvbWZvcnQnICAgICAgICAgICB9LFxuICAgIHsgaWQ6J2xpYnJhcnknLCAgICAgICAgIGxhYmVsOidMaWJyYXJ5IC8gQXJjaGl2ZScsICAgICAgICAgICAgICAgbG86NDAsICAgaGk6NTUsICAgbm90ZToncGFwZXIgJiBiaW5kaW5nIHByZXNlcnZhdGlvbicgICAgICAgfSxcbiAgICB7IGlkOidob3NwaXRhbCcsICAgICAgICBsYWJlbDonSG9zcGl0YWwgKGdlbmVyYWwpJywgICAgICAgICAgICAgIGxvOjMwLCAgIGhpOjYwLCAgIG5vdGU6J0FTSFJBRSAxNzAgcGF0aWVudCBhcmVhcycgICAgICAgICAgIH0sXG4gICAgeyBpZDonbGVjdHVyZScsICAgICAgICAgbGFiZWw6J0xlY3R1cmUgaGFsbCcsICAgICAgICAgICAgICAgICAgICBsbzozMCwgICBoaTo2MCwgICBub3RlOidoaWdoIG9jY3VwYW5jeSBjb21mb3J0JyAgICAgICAgICAgICB9LFxuICAgIHsgaWQ6J2NvbmNlcnQnLCAgICAgICAgIGxhYmVsOidDb25jZXJ0IGhhbGwnLCAgICAgICAgICAgICAgICAgICAgbG86NDAsICAgaGk6NTUsICAgbm90ZTonaW5zdHJ1bWVudCB0dW5pbmcgc3RhYmlsaXR5JyAgICAgICAgfSxcbiAgICB7IGlkOidtZWV0aW5nJywgICAgICAgICBsYWJlbDonTWVldGluZyByb29tJywgICAgICAgICAgICAgICAgICAgIGxvOjMwLCAgIGhpOjYwLCAgIG5vdGU6J3NtYWxsIGdyb3VwIGNvbWZvcnQnICAgICAgICAgICAgICAgIH0sXG4gICAgeyBpZDonZXhoaWJpdGlvbicsICAgICAgbGFiZWw6J0V4aGliaXRpb24gaGFsbCcsICAgICAgICAgICAgICAgICBsbzo0MCwgICBoaTo1NSwgICBub3RlOidtaXhlZCBhcnQgLyBhcnRpZmFjdCBkaXNwbGF5JyAgICAgICB9LFxuXTtcblxuLyogUmVhbCBwc3kgY2hhcnQg4oCUIHVzZXMgdGhlIFNBTUUgZ2V0VyArIEdJVk9OSV9DT0xPUlMgKyBwb2x5Z29uIG1hdGggYXMgdGhlXG4gKiBwcm9kdWN0aW9uIGRhc2hib2FyZC4gIFNvdXJjZSBvZiB0cnV0aDogIGpzL3BzeWNocm9tZXRyaWMuanMgIGFuZCB0aGVcbiAqIHJlbmRlckdpdm9uaU92ZXJsYXkoKSBibG9jayBhdCBhcHAuanM6MTY0MS0xNzIyLlxuICogQW55dGhpbmcgeW91IGNoYW5nZSBpbiB0aG9zZSBmaWxlcyBNVVNUIGJlIG1pcnJvcmVkIGhlcmUuICovXG5mdW5jdGlvbiBQc3lTa2VsZXRvbih7IGNmZyB9KSB7XG4gICAgLyogQ2FudmFzICsgcGFkZGluZyAqL1xuICAgIGNvbnN0IFcgPSA3NjAsIEggPSA0ODA7XG4gICAgY29uc3QgcGFkID0geyBsZWZ0OiA1NiwgcmlnaHQ6IDQwLCB0b3A6IDI4LCBib3R0b206IDU2IH07XG4gICAgY29uc3QgZ3JpZFcgPSBXIC0gcGFkLmxlZnQgLSBwYWQucmlnaHQ7XG4gICAgY29uc3QgZ3JpZEggPSBIIC0gcGFkLnRvcCAgLSBwYWQuYm90dG9tO1xuXG4gICAgY29uc3QgVF9NSU4gPSBjZmcudExvLCBUX01BWCA9IGNmZy50SGk7XG4gICAgY29uc3QgV19NSU4gPSAwLCAgICAgICBXX01BWCA9IDAuMDMwOyAgICAgICAgICAvLyBrZy9rZ1xuXG4gICAgLyogYXhpcyBzY2FsZXMgLS0gbWF0Y2ggdGhlIGxpdmUgZGFzaGJvYXJkICovXG4gICAgY29uc3QgeCAgPSAodCkgPT4gcGFkLmxlZnQgKyAoKHQgLSBUX01JTikgLyAoVF9NQVggLSBUX01JTikpICogZ3JpZFc7XG4gICAgY29uc3QgeSAgPSAodykgPT4gcGFkLnRvcCAgKyAoMSAtICh3IC0gV19NSU4pIC8gKFdfTUFYIC0gV19NSU4pKSAqIGdyaWRIO1xuICAgIGNvbnN0IF9nZXRXID0gKHR5cGVvZiBnZXRXID09PSAnZnVuY3Rpb24nKSA/IGdldFcgOiAoKHQsIHJoKSA9PiAwKTtcblxuICAgIGNvbnN0IHNhZmVQdHMgPSAoYXJyKSA9PiBhcnIubWFwKHAgPT4gYCR7KHgocFswXSl8fDApLnRvRml4ZWQoMil9LCR7KHkocFsxXSl8fDApLnRvRml4ZWQoMil9YCkuam9pbignICcpO1xuXG4gICAgLyogLS0tLSBHaXZvbmkgcG9seWdvbnMgLS0gQ09QSUVEIFZFUkJBVElNIGZyb20gYXBwLmpzOjE2NDMtMTY2OSAtLS0tICovXG4gICAgY29uc3Qgcmg4MCA9IFtdOyBmb3IgKGxldCB0PTIwOyB0PD0yNTsgdCs9MC41KSByaDgwLnB1c2goW3QsIF9nZXRXKHQsIDgwKV0pO1xuICAgIGNvbnN0IHJoMTAwPSBbXTsgZm9yIChsZXQgdD0yMDsgdDw9Mjc7IHQrPTAuNSkgcmgxMDAucHVzaChbdCwgX2dldFcodCwgMTAwKV0pO1xuICAgIGNvbnN0IHJoMjBMaW5lID0gW107IGZvciAobGV0IHQ9MzI7IHQ+PTIwOyB0LT0wLjUpIHJoMjBMaW5lLnB1c2goW3QsIF9nZXRXKHQsIDIwKV0pO1xuICAgIGNvbnN0IHJoMjBfQ1ogID0gW107IGZvciAobGV0IHQ9Mjc7IHQ+PTIwOyB0LT0wLjUpIHJoMjBfQ1oucHVzaChbdCwgX2dldFcodCwgMjApXSk7XG4gICAgY29uc3QgQ1ogICA9IFsuLi5yaDgwLCBbMjcsIF9nZXRXKDI3LCA1MCldLCBbMjcsIF9nZXRXKDI3LCAyMCldLCAuLi5yaDIwX0NaXTtcblxuICAgIGNvbnN0IHJoSGlfdG9wID0gW107IGZvciAobGV0IHR0PTIwOyB0dDw9Mjc7IHR0Kz0wLjUpIHJoSGlfdG9wLnB1c2goW3R0LCBfZ2V0Vyh0dCwgY2ZnLnJoSGkpXSk7XG4gICAgY29uc3QgcmhMb19ib3QgPSBbXTsgZm9yIChsZXQgdHQ9Mjc7IHR0Pj0yMDsgdHQtPTAuNSkgcmhMb19ib3QucHVzaChbdHQsIF9nZXRXKHR0LCBjZmcucmhMbyldKTtcbiAgICBjb25zdCBTV0VFVCA9IFsuLi5yaEhpX3RvcCwgLi4ucmhMb19ib3RdO1xuXG4gICAgY29uc3QgTlYgICA9IFsuLi5yaDEwMCwgWzMyLCAxNS40LzEwMDBdLCBbMzIsIDYuMi8xMDAwXSwgLi4ucmgyMExpbmVdO1xuICAgIGNvbnN0IE1hc3MgPSBbLi4ucmg4MCwgWzMzLCAxNi8xMDAwXSwgWzM3LCBfZ2V0VygzNywgMzApXSwgWzM3LCAzLzEwMDBdLCBbMjAsIF9nZXRXKDIwLCAyMCldXTtcbiAgICBjb25zdCBNQ1YgID0gWy4uLnJoODAsIFs0MCwgMTYvMTAwMF0sIFs0NCwgX2dldFcoNDQsIDIwKV0sIFs0NCwgMy8xMDAwXSwgWzIwLCBfZ2V0VygyMCwgMjApXV07XG4gICAgY29uc3QgRVZBUCA9IFsuLi5yaDgwLCBbMjUsIDE2LzEwMDBdLCBbMzYsIF9nZXRXKDM2LCAzMCldLCBbMzksIF9nZXRXKDM5LCAyMCldLFxuICAgICAgICAgICAgICAgICAgWzQxLCBfZ2V0Vyg0MSwgMTApXSwgWzQxLCAwXSwgWzI3LjIsIDBdLCBbMjAsIF9nZXRXKDIwLCAyMCldXTtcblxuICAgIGNvbnN0IHdpbnRlclJIODAgPSBbXTsgZm9yIChsZXQgdD0xODsgdDw9MTkuNTsgdCs9MC41KSB3aW50ZXJSSDgwLnB1c2goW3QsIF9nZXRXKHQsIDgwKV0pO1xuICAgIGNvbnN0IHdpbnRlclJIMjAgPSBbXTsgZm9yIChsZXQgdD0xOS41OyB0Pj0xODsgdC09MC41KSB3aW50ZXJSSDIwLnB1c2goW3QsIF9nZXRXKHQsIDIwKV0pO1xuICAgIGNvbnN0IFdJTlRFUiA9IFsuLi53aW50ZXJSSDgwLCAuLi53aW50ZXJSSDIwXTtcblxuICAgIC8qIFJIIGlzb3BsZXRoIGN1cnZlcyBmb3IgdGhlIGNoYXJ0IGdyaWQgKi9cbiAgICBjb25zdCBpc29wbGV0aHMgPSBbMjAsIDQwLCA2MCwgODAsIDEwMF07XG5cbiAgICAvKiBUaGVtZSBwYWxldHRlIOKAlCBkcml2ZXMgdGhlIGxpdmUgcHJldmlldyBzbyB0aGUgZGltL2xpZ2h0IGNvbnRyb2xzXG4gICAgICogaGF2ZSB2aXNpYmxlIGZlZWRiYWNrIHJpZ2h0IG9uIHRoZSBjaGFydC4gIEluIGRpbS9kYXJrIG1vZGUgd2UgYWxzb1xuICAgICAqIGFwcGx5IGEgQ1NTIGJyaWdodG5lc3MgZmlsdGVyIG1hcHBlZCBmcm9tIGNmZy5kYXJrTGV2ZWwgKDEuNSAuLiAyLjhcbiAgICAgKiDihpIgMC42IC4uIDEuNCkgc28gdGhlIHVzZXIgY2FuIFNFRSB0aGUgYnJpZ2h0bmVzcyBzbGlkZXIgd29ya2luZy4gKi9cbiAgICBjb25zdCBpc0xpZ2h0ID0gY2ZnLnRoZW1lID09PSAnbGlnaHQnO1xuICAgIGNvbnN0IHBhbGV0dGUgPSBpc0xpZ2h0XG4gICAgICAgID8geyBiZzonI2Y4ZmFmYycsIGdyaWQ6JyNjYmQ1ZTEnLCB0aWNrOicjNDc1NTY5JywgYXhpczonIzFlMjkzYicsXG4gICAgICAgICAgICBwYW5lbEJnOidyZ2JhKDI0OCwyNTAsMjUyLDAuODUpJywgcGFuZWxCb3JkZXI6JyNjYmQ1ZTEnLFxuICAgICAgICAgICAgcGlsbEJnOicjZTJlOGYwJywgcGlsbEZnOicjNDc1NTY5JywgbWV0YUZnOicjNjQ3NDhiJyB9XG4gICAgICAgIDogeyBiZzonIzBiMTIyMCcsIGdyaWQ6JyMxZTI5M2InLCB0aWNrOicjOTRhM2I4JywgYXhpczonI2NiZDVlMScsXG4gICAgICAgICAgICBwYW5lbEJnOidyZ2JhKDE1LDIzLDQyLDAuNiknLCBwYW5lbEJvcmRlcjonIzFlMjkzYicsXG4gICAgICAgICAgICBwaWxsQmc6JyMxZTI5M2InLCBwaWxsRmc6JyM5NGEzYjgnLCBtZXRhRmc6JyM2NDc0OGInIH07XG4gICAgY29uc3QgZGltRmlsdGVyID0gaXNMaWdodFxuICAgICAgICA/ICdub25lJ1xuICAgICAgICA6IGBicmlnaHRuZXNzKCR7KE1hdGgubWF4KDEuNSwgTWF0aC5taW4oMi44LCBjZmcuZGFya0xldmVsIHx8IDIuMCkpIC8gMi4wKS50b0ZpeGVkKDIpfSlgO1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3VuZGVkLTJ4bCBwLTQgYm9yZGVyIHRyYW5zaXRpb24tY29sb3JzIGR1cmF0aW9uLTMwMFwiXG4gICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOiBwYWxldHRlLnBhbmVsQmcsIGJvcmRlckNvbG9yOiBwYWxldHRlLnBhbmVsQm9yZGVyfX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBtYi0zXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicGlsbFwiIHN0eWxlPXt7YmFja2dyb3VuZDpwYWxldHRlLnBpbGxCZywgY29sb3I6cGFsZXR0ZS5waWxsRmd9fT5QU1lDSFJPTUVUUklDIENIQVJUIMK3IGxpdmUgcHJldmlldzwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSBmb250LW1vbm9cIiBzdHlsZT17e2NvbG9yOnBhbGV0dGUubWV0YUZnfX0+e1RfTUlOfcKwQyDihpIge1RfTUFYfcKwQyAgwrcgIHtjZmcucmhMb33igJN7Y2ZnLnJoSGl9JSBSSDwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHN2ZyB2aWV3Qm94PXtgMCAwICR7V30gJHtIfWB9IGNsYXNzTmFtZT1cInctZnVsbCBoLWF1dG8gdHJhbnNpdGlvbi1bZmlsdGVyXSBkdXJhdGlvbi0zMDBcIlxuICAgICAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6IHBhbGV0dGUuYmcsIGJvcmRlclJhZGl1czo4LCBmaWx0ZXI6IGRpbUZpbHRlcn19PlxuICAgICAgICAgICAgICAgIHsvKiAtLS0tIGdyaWQ6IHZlcnRpY2FsIFQgbGluZXMsIGhvcml6b250YWwgVyBsaW5lcyAtLS0tICovfVxuICAgICAgICAgICAgICAgIHtBcnJheS5mcm9tKHtsZW5ndGg6MTF9KS5tYXAoKF8saSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ID0gVF9NSU4gKyAoaS8xMCkgKiAoVF9NQVggLSBUX01JTik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZyBrZXk9eyd2dCcraX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3godCl9IHkxPXtwYWQudG9wfSB4Mj17eCh0KX0geTI9e3BhZC50b3ArZ3JpZEh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPXtwYWxldHRlLmdyaWR9IHN0cm9rZVdpZHRoPVwiMC42XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3godCl9IHk9e3BhZC50b3ArZ3JpZEgrMTZ9IGZvbnRTaXplPVwiOS41XCIgZmlsbD17cGFsZXR0ZS50aWNrfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIj57dC50b0ZpeGVkKDApfTwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICB7QXJyYXkuZnJvbSh7bGVuZ3RoOjd9KS5tYXAoKF8saSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB3ID0gV19NSU4gKyAoaS82KSAqIChXX01BWCAtIFdfTUlOKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxnIGtleT17J2h3JytpfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17cGFkLmxlZnR9IHkxPXt5KHcpfSB4Mj17cGFkLmxlZnQrZ3JpZFd9IHkyPXt5KHcpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT17cGFsZXR0ZS5ncmlkfSBzdHJva2VXaWR0aD1cIjAuNlwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXtwYWQubGVmdC04fSB5PXt5KHcpKzN9IGZvbnRTaXplPVwiOS41XCIgZmlsbD17cGFsZXR0ZS50aWNrfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJlbmRcIj57KHcqMTAwMCkudG9GaXhlZCgwKX08L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgey8qIC0tLS0gUkggaXNvcGxldGhzIChjdXJ2ZXMpIC0tLS0gKi99XG4gICAgICAgICAgICAgICAge2lzb3BsZXRocy5tYXAocmggPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwdHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdCA9IFRfTUlOOyB0IDw9IFRfTUFYOyB0ICs9IDAuNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgd3cgPSBfZ2V0Vyh0LCByaCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod3cgPj0gV19NSU4gJiYgd3cgPD0gV19NQVgpIHB0cy5wdXNoKFt0LCB3d10pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZyBrZXk9eydpc28nK3JofT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cG9seWxpbmUgcG9pbnRzPXtzYWZlUHRzKHB0cyl9IGZpbGw9XCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPXtyaCA9PT0gMTAwID8gJyM2MzY2ZjEnIDogJyNlYzQ4OTk1NSd9IHN0cm9rZVdpZHRoPVwiMC44XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlRGFzaGFycmF5PXtyaCA9PT0gMTAwID8gJycgOiAnMywzJ30vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtwdHMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3gocHRzW01hdGguZmxvb3IocHRzLmxlbmd0aCowLjY1KV1bMF0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5PXt5KHB0c1tNYXRoLmZsb29yKHB0cy5sZW5ndGgqMC42NSldWzFdKSAtIDR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplPVwiOVwiIGZpbGw9XCIjZWM0ODk5OTlcIiBmb250V2VpZ2h0PVwiNzAwXCI+e3JofSU8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cblxuICAgICAgICAgICAgICAgIHsvKiAtLS0tIEdpdm9uaSBvdmVybGF5IChjb3BpZWQgdmVyYmF0aW0gZnJvbSBhcHAuanMgcmVuZGVyIG9yZGVyKSAtLS0tICovfVxuICAgICAgICAgICAgICAgIHtjZmcuZ2l2b25pICYmIChcbiAgICAgICAgICAgICAgICAgICAgPGcgY2xhc3NOYW1lPVwicG9pbnRlci1ldmVudHMtbm9uZVwiIG9wYWNpdHk9XCIwLjlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXt4KDQwKX0geTE9e3koMTYvMTAwMCl9IHgyPXt4KDUwKX0geTI9e3koMTYvMTAwMCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCIjNjM2NmYxXCIgc3Ryb2tlV2lkdGg9XCIxLjVcIiBzdHJva2VEYXNoYXJyYXk9XCI0LDRcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17eCg1MCl9IHkxPXt5KDE2LzEwMDApfSB4Mj17eCg1MCl9IHkyPXt5KDApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiIzYzNjZmMVwiIHN0cm9rZVdpZHRoPVwiMS41XCIgc3Ryb2tlRGFzaGFycmF5PVwiNCw0XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3goNDEpfSB5MT17eSgwKX0geDI9e3goNTApfSB5Mj17eSgwKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cIiM2MzY2ZjFcIiBzdHJva2VXaWR0aD1cIjEuNVwiIHN0cm9rZURhc2hhcnJheT1cIjQsNFwiLz5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKE1DVil9ICBmaWxsPVwiI2VjNDg5OVwiIGZpbGxPcGFjaXR5PVwiMC4wNVwiIHN0cm9rZT1cIiNlYzQ4OTlcIiBzdHJva2VXaWR0aD1cIjFcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoTWFzcyl9IGZpbGw9XCIjOGI1Y2Y2XCIgZmlsbE9wYWNpdHk9XCIwLjA1XCIgc3Ryb2tlPVwiIzhiNWNmNlwiIHN0cm9rZVdpZHRoPVwiMVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhFVkFQKX0gZmlsbD1cIiMwNmI2ZDRcIiBmaWxsT3BhY2l0eT1cIjAuMDhcIiBzdHJva2U9XCIjMDZiNmQ0XCIgc3Ryb2tlV2lkdGg9XCIxXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKE5WKX0gICBmaWxsPVwiI2Y1OWUwYlwiIGZpbGxPcGFjaXR5PVwiMC4wNVwiIHN0cm9rZT1cIiNmNTllMGJcIiBzdHJva2VXaWR0aD1cIjFcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoQ1opfSAgIGZpbGw9XCIjMTBiOTgxXCIgZmlsbE9wYWNpdHk9XCIwLjE1XCIgc3Ryb2tlPVwiIzEwYjk4MVwiIHN0cm9rZVdpZHRoPVwiMS4yXCIvPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICB7LyogU3dlZXQtc3BvdCBiYW5kLCBjbGlwcGVkIHRvIENaICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgPGRlZnM+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNsaXBQYXRoIGlkPVwiY3otY2xpcC13YWxrXCIgY2xpcFBhdGhVbml0cz1cInVzZXJTcGFjZU9uVXNlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhDWil9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2NsaXBQYXRoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kZWZzPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKFNXRUVUKX0gY2xpcFBhdGg9XCJ1cmwoI2N6LWNsaXAtd2FsaylcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbD1cIiMwNTk2NjlcIiBmaWxsT3BhY2l0eT1cIjAuMzJcIiBzdHJva2U9XCIjMDQ3ODU3XCIgc3Ryb2tlV2lkdGg9XCIwLjhcIiBzdHJva2VEYXNoYXJyYXk9XCIzLDJcIi8+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhXSU5URVIpfSBmaWxsPVwiIzNiODJmNlwiIGZpbGxPcGFjaXR5PVwiMC4xNVwiIHN0cm9rZT1cIm5vbmVcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17eCgxOSl9IHkxPXtwYWQudG9wKzE4fSB4Mj17eCgxOSl9IHkyPXtwYWQudG9wK2dyaWRIfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiIzNiODJmNlwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZURhc2hhcnJheT1cIjYsNFwiIG9wYWNpdHk9XCIwLjhcIi8+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBSZWdpb24gbGFiZWxzIOKAlCBzYW1lIGNvbG9ycyAmIHNwaXJpdCBhcyBsaXZlIGNoYXJ0ICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCg1MCktMTB9IHk9e3koOC8xMDAwKX0gZmlsbD1cIiM2MzY2ZjFcIiBmb250U2l6ZT1cIjEwXCIgZm9udFdlaWdodD1cIjkwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgdHJhbnNmb3JtPXtgcm90YXRlKC05MCwgJHt4KDUwKS0xMH0sICR7eSg4LzEwMDApfSlgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZz1cIjJcIj5NRUNIQU5JQ0FMIENPT0xJTkc8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDQ0KS0yfSB5PXt5KDgvMTAwMCl9IGZpbGw9XCIjZWM0ODk5XCIgZm9udFNpemU9XCI5XCIgZm9udFdlaWdodD1cIjkwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgdHJhbnNmb3JtPXtgcm90YXRlKC05MCwgJHt4KDQ0KS0yfSwgJHt5KDgvMTAwMCl9KWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nPVwiMS41XCI+TUFTUyBDT09MSU5HPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCgzNyktMTB9IHk9e3koOC8xMDAwKX0gZmlsbD1cIiM4YjVjZjZcIiBmb250U2l6ZT1cIjlcIiBmb250V2VpZ2h0PVwiOTAwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiB0cmFuc2Zvcm09e2Byb3RhdGUoLTkwLCAke3goMzcpLTEwfSwgJHt5KDgvMTAwMCl9KWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nPVwiMS41XCI+TUFTUyBDT09MSU5HPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCgzNCl9IHk9e3koMC41LzEwMDApLTh9IGZpbGw9XCIjMDZiNmQ0XCIgZm9udFNpemU9XCI5XCIgZm9udFdlaWdodD1cIjkwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgbGV0dGVyU3BhY2luZz1cIjJcIj5FVkFQT1JBVElWRTwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goMjMuNSl9IHk9e3koX2dldFcoMjMuNSwgNDUpKX0gZmlsbD1cIiMxMGI5ODFcIiBmb250U2l6ZT1cIjExXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ9XCI5MDBcIiB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgbGV0dGVyU3BhY2luZz1cIjEuNVwiPkNPTUZPUlQ8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDE4Ljc1KX0geT17eShfZ2V0VygxOC43NSwgNDUpKX0gZmlsbD1cIiMzYjgyZjZcIiBmb250U2l6ZT1cIjExXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ9XCI5MDBcIiB0ZXh0QW5jaG9yPVwibWlkZGxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybT17YHJvdGF0ZSgtOTAsICR7eCgxOC43NSl9LCAke3koX2dldFcoMTguNzUsIDQ1KSl9KWB9PldJTlRFUjwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goMjMuNSl9IHk9e3koX2dldFcoMjMuNSwgKGNmZy5yaExvK2NmZy5yaEhpKS8yKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxsPVwiIzAyMmMyMlwiIGZvbnRTaXplPVwiOFwiIGZvbnRXZWlnaHQ9XCI5MDBcIiB0ZXh0QW5jaG9yPVwibWlkZGxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7cGFpbnRPcmRlcjonc3Ryb2tlJywgc3Ryb2tlOicjYTdmM2QwJywgc3Ryb2tlV2lkdGg6JzIuNXB4Jywgc3Ryb2tlTGluZWpvaW46J3JvdW5kJ319XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nPVwiMS41XCI+e2NmZy5yaExvfS17Y2ZnLnJoSGl9JSBSSDwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgICAgICB7LyogYXhpcyBsYWJlbHMgKi99XG4gICAgICAgICAgICAgICAgPHRleHQgeD17cGFkLmxlZnQgKyBncmlkVy8yfSB5PXtILTEyfSBmb250U2l6ZT1cIjExXCIgZmlsbD17cGFsZXR0ZS5heGlzfVxuICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiBmb250V2VpZ2h0PVwiODAwXCIgbGV0dGVyU3BhY2luZz1cIjJcIj5EUlkgQlVMQiBURU1QICjCsEMpPC90ZXh0PlxuICAgICAgICAgICAgICAgIDx0ZXh0IHg9ezE2fSB5PXtwYWQudG9wICsgZ3JpZEgvMn0gZm9udFNpemU9XCIxMVwiIGZpbGw9e3BhbGV0dGUuYXhpc31cbiAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgZm9udFdlaWdodD1cIjgwMFwiIGxldHRlclNwYWNpbmc9XCIyXCJcbiAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm09e2Byb3RhdGUoLTkwIDE2ICR7cGFkLnRvcCArIGdyaWRILzJ9KWB9PkhVTUlESVRZIFJBVElPIChnL2tnKTwvdGV4dD5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG5mdW5jdGlvbiBQc3lDb250cm9sUGFuZWwoeyBjZmcsIHVwZGF0ZSwgc2V0Q2ZnIH0pIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXNsYXRlLTkwMC82MCBib3JkZXIgYm9yZGVyLXNsYXRlLTgwMCByb3VuZGVkLTJ4bCBwLTUgc3BhY2UteS02XCI+XG4gICAgICAgICAgICB7LyogVGhlbWUgKyBicmlnaHRuZXNzICAtLSByZWxvY2F0ZWQgZnJvbSB0aGUgZGFzaGJvYXJkIHNpZGViYXIgMjAyNi0wNi0yNS5cbiAgICAgICAgICAgICAgICBUd28gY29udHJvbHM6IERhcmsvTGlnaHQgbW9kZSB0b2dnbGUsIGFuZCBCcmlnaHRuZXNzIHNsaWRlciAob25seVxuICAgICAgICAgICAgICAgIG1lYW5pbmdmdWwgaW4gZGFyayBtb2RlKS4gIExpdmUgcHJldmlldyBhcHBsaWVzIHRvIHRoZSBzdXJyb3VuZGluZ1xuICAgICAgICAgICAgICAgIGNvbnRyb2wgcGFuZWwgc28gdGhlIG9wZXJhdG9yIGNhbiBGRUVMIHRoZSBjaGFuZ2UgYmVmb3JlIHNhdmluZy4gKi99XG4gICAgICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwicHN5LWNmZy10aGVtZS1ibG9ja1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMlwiPkRpc3BsYXkgTW9kZTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtMiBtYi0zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJwc3ktY2ZnLXRoZW1lLWRhcmtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldENmZyhjID0+ICh7Li4uYywgdGhlbWU6J2RhcmsnLCBkYXJrTGV2ZWw6TWF0aC5taW4oYy5kYXJrTGV2ZWwgfHwgMi4wLCAyLjYpfSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB5LTIuNSByb3VuZGVkLWxnIHRleHQteHMgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGJvcmRlciB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2NmZy50aGVtZSA9PT0gJ2RhcmsnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1zbGF0ZS04MDAgYm9yZGVyLXllbGxvdy01MDAvNzAgdGV4dC15ZWxsb3ctMzAwIHNoYWRvdy1sZyBzaGFkb3cteWVsbG93LTUwMC8xMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLXNsYXRlLTkwMC8zMCBib3JkZXItc2xhdGUtNzAwIHRleHQtc2xhdGUtNTAwIGhvdmVyOmJnLXNsYXRlLTgwMC82MCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICDwn4yZICBEaW0gLyBEYXJrXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwicHN5LWNmZy10aGVtZS1saWdodFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0Q2ZnKGMgPT4gKHsuLi5jLCB0aGVtZTonbGlnaHQnLCBkYXJrTGV2ZWw6My4wfSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB5LTIuNSByb3VuZGVkLWxnIHRleHQteHMgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGJvcmRlciB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2NmZy50aGVtZSA9PT0gJ2xpZ2h0J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctc2xhdGUtMTAwIGJvcmRlci1za3ktNTAwLzcwIHRleHQtc2t5LTcwMCBzaGFkb3ctbGcgc2hhZG93LXNreS01MDAvMTAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1zbGF0ZS05MDAvMzAgYm9yZGVyLXNsYXRlLTcwMCB0ZXh0LXNsYXRlLTUwMCBob3ZlcjpiZy1zbGF0ZS04MDAvNjAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAg4piAICBMaWdodFxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICB7LyogQnJpZ2h0bmVzcyBzbGlkZXIg4oCUIG9ubHkgbWVhbmluZ2Z1bCB3aGVuIHRoZW1lID09PSAnZGFyaycgKi99XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NmZy50aGVtZSA9PT0gJ2xpZ2h0JyA/ICdvcGFjaXR5LTQwIHBvaW50ZXItZXZlbnRzLW5vbmUnIDogJyd9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBtYi0xXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJvbGQgdGV4dC1zbGF0ZS01MDBcIj5EaW0gYnJpZ2h0bmVzczwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSBmb250LW1vbm8gdGV4dC15ZWxsb3ctMzAwIHRhYnVsYXItbnVtc1wiPntNYXRoLnJvdW5kKChjZmcuZGFya0xldmVsIHx8IDIuMCkgKiAxMDApfSU8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwicHN5LWNmZy1kYXJrLWxldmVsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbj1cIjEuNVwiIG1heD1cIjIuOFwiIHN0ZXA9XCIwLjAyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtjZmcudGhlbWUgPT09ICdsaWdodCcgPyAyLjAgOiAoY2ZnLmRhcmtMZXZlbCB8fCAyLjApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIGRhcmtMZXZlbDogcGFyc2VGbG9hdChlLnRhcmdldC52YWx1ZSksIHRoZW1lOidkYXJrJ30pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLWlucHV0IHctZnVsbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBhY2NlbnRDb2xvcjonI2ZhY2MxNScgfX0vPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTIgaXRhbGljXCI+XG4gICAgICAgICAgICAgICAgICAgIEFwcGxpZWQgdG8gdGhlIHdob2xlIGRhc2hib2FyZC4gIERpbSBpcyByZWNvbW1lbmRlZCBmb3IgY29udHJvbCByb29tczsgTGlnaHQgZm9yIGRheXRpbWUgd2Fsay10aHJvdWdocy5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIEdpdm9uaSB0b2dnbGUgKi99XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMlwiPkdpdm9uaSBFbmdpbmU8L2Rpdj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHVwZGF0ZSgnZ2l2b25pJywgIWNmZy5naXZvbmkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdy1mdWxsIHB5LTMgcm91bmRlZC14bCB0ZXh0LXNtIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjZmcuZ2l2b25pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctaW5kaWdvLTYwMCB0ZXh0LXdoaXRlIHNoYWRvdy1sZyBzaGFkb3ctaW5kaWdvLTUwMC8zMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1zbGF0ZS04MDAgdGV4dC1zbGF0ZS00MDAgYm9yZGVyIGJvcmRlci1zbGF0ZS03MDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICB7Y2ZnLmdpdm9uaSA/ICdHaXZvbmkgT04nIDogJ0dpdm9uaSBPRkYnfVxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTIgbGVhZGluZy1yZWxheGVkXCI+XG4gICAgICAgICAgICAgICAgICAgIE92ZXJsYXlzIHRoZSA0IGNsaW1hdGUtc3RyYXRlZ3kgcmVnaW9ucyAoQ29tZm9ydCwgTmF0IFZlbnQsIEV2YXAsIE1lY2ggQ29vbCkuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBSSCByYW5nZSAqL31cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0yXCI+UkggU3dlZXQtU3BvdCBSYW5nZTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItM1wiPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJvbGQgdGV4dC1zbGF0ZS01MDAgbWItMSBibG9ja1wiPlZlbnVlIHByZXNldDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXQgY3Vyc29yLXBvaW50ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtjZmcucmhQcmVzZXQgfHwgJ2N1c3RvbSd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHAgPSBSSF9QUkVTRVRTLmZpbmQocCA9PiBwLmlkID09PSBlLnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocC5pZCA9PT0gJ2N1c3RvbScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZSgncmhQcmVzZXQnLCAnY3VzdG9tJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIHJoUHJlc2V0OnAuaWQsIHJoTG86cC5sbywgcmhIaTpwLmhpfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7UkhfUFJFU0VUUy5tYXAocCA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBrZXk9e3AuaWR9IHZhbHVlPXtwLmlkfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3AubGFiZWx9e3AubG8gIT0gbnVsbCA/IGAgIMK3ICAke3AubG99LSR7cC5oaX0lIFJIYCA6ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgICAgICB7KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHAgPSBSSF9QUkVTRVRTLmZpbmQoeCA9PiB4LmlkID09PSAoY2ZnLnJoUHJlc2V0IHx8ICdjdXN0b20nKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcCAmJiBwLm5vdGUgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbXQtMS41IGl0YWxpY1wiPntwLm5vdGV9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgKSA6IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH0pKCl9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMyBtYi0yXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1tb25vIHRleHQtc2xhdGUtNDAwIHctMTBcIj57Y2ZnLnJoTG99JTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj1cIjIwXCIgbWF4PXtjZmcucmhIaS01fSB2YWx1ZT17Y2ZnLnJoTG99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldENmZyhjID0+ICh7Li4uYywgcmhMbzorZS50YXJnZXQudmFsdWUsIHJoUHJlc2V0OidjdXN0b20nfSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2UtaW5wdXQgZmxleC0xXCIvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyBmb250LW1vbm8gdGV4dC1zbGF0ZS00MDAgdy0xMFwiPntjZmcucmhIaX0lPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPXtjZmcucmhMbys1fSBtYXg9XCI5MFwiIHZhbHVlPXtjZmcucmhIaX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0Q2ZnKGMgPT4gKHsuLi5jLCByaEhpOitlLnRhcmdldC52YWx1ZSwgcmhQcmVzZXQ6J2N1c3RvbSd9KSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyYW5nZS1pbnB1dCBmbGV4LTFcIi8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIEF4aXMgcmFuZ2UgKi99XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMlwiPlRlbXBlcmF0dXJlIEF4aXMgUmFuZ2U8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zIG1iLTJcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyBmb250LW1vbm8gdGV4dC1zbGF0ZS00MDAgdy0xMFwiPntjZmcudExvfcKwPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPVwiLTQwXCIgbWF4PXtjZmcudEhpLTEwfSB2YWx1ZT17Y2ZnLnRMb31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlKCd0TG8nLCArZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2UtaW5wdXQgZmxleC0xXCIvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyBmb250LW1vbm8gdGV4dC1zbGF0ZS00MDAgdy0xMFwiPntjZmcudEhpfcKwPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPXtjZmcudExvKzEwfSBtYXg9XCI2MFwiIHZhbHVlPXtjZmcudEhpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGUoJ3RIaScsICtlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyYW5nZS1pbnB1dCBmbGV4LTFcIi8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbXQtMiBsZWFkaW5nLXJlbGF4ZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgQ2hhcnQgd2lsbCBiZSByZWRyYXduIHdpdGggdGhpcyBkcnktYnVsYiB0ZW1wZXJhdHVyZSB3aW5kb3cuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyLXQgYm9yZGVyLXNsYXRlLTgwMCBwdC00XCI+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbGVhZGluZy1yZWxheGVkXCI+XG4gICAgICAgICAgICAgICAgICAgIENoYW5nZXMgcHJldmlldyBsaXZlIGluIHRoZSBza2VsZXRvbiBjaGFydCBvbiB0aGUgbGVmdC4gIEhpdFxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWluZGlnby00MDAgZm9udC1ibGFja1wiPiBTYXZlICYgcmV0dXJuIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgaW4gdGhlIGhlYWRlciB3aGVuIHlvdSdyZSBoYXBweS5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTG9jYXRpb24gU2V0dGluZyAtLSBtb2RhbCB3LyBpbnRlcmFjdGl2ZSBMZWFmbGV0IG1hcCArIHJldmVyc2UgZ2VvY29kaW5nXG4gKiBDbGljayBhbnl3aGVyZSBvbiB0aGUgbWFwIChvciBkcmFnIHRoZSBtYXJrZXIpIHRvIHNldCBsYXQvbG9uLlxuICogTWFudWFsIGxhdC9sb24gZWRpdHMgcmUtY2VudHJlIHRoZSBtYXJrZXIuICBDaXR5IG5hbWUgaXMgYXV0by1wb3B1bGF0ZWRcbiAqIHZpYSBPcGVuU3RyZWV0TWFwIE5vbWluYXRpbSAobm8ga2V5IHJlcXVpcmVkLCByYXRlLWxpbWl0ZWQgdG8gfjEgcmVxL3MpLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKiBEZS1kdXAgKyBzYW5pdHktY2hlY2sgYSByYXcgc2F2ZWQtbG9jYXRpb25zIGFycmF5IChmcm9tIHNlcnZlciBvclxuICogbG9jYWxTdG9yYWdlKS4gIERyb3BzIGVudHJpZXMgbWlzc2luZyBhIG5hbWUgb3Igd2l0aCBub24tZmluaXRlIGxhdC9sb24sXG4gKiBrZWVwcyB0aGUgRklSU1Qgb2NjdXJyZW5jZSBvZiBlYWNoIHVuaXF1ZSBuYW1lLiAgVXNlZCBieSBMb2NhdGlvbk1vZGFsJ3NcbiAqIFNpdGUtbmFtZSBkYXRhbGlzdCBiZWxvdy4gKi9cbmZ1bmN0aW9uIF9ub3JtYWxpemVMb2NzKGFycikge1xuICAgIGNvbnN0IHNlZW4gPSBuZXcgU2V0KCk7XG4gICAgY29uc3Qgb3V0ID0gW107XG4gICAgZm9yIChjb25zdCBsIG9mIChhcnIgfHwgW10pKSB7XG4gICAgICAgIGlmICghbCB8fCB0eXBlb2YgbC5uYW1lICE9PSAnc3RyaW5nJykgY29udGludWU7XG4gICAgICAgIGNvbnN0IGxhdCA9ICtsLmxhdCwgbG9uID0gK2wubG9uO1xuICAgICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShsYXQpIHx8ICFOdW1iZXIuaXNGaW5pdGUobG9uKSkgY29udGludWU7XG4gICAgICAgIGNvbnN0IGtleSA9IGwubmFtZS50cmltKCk7XG4gICAgICAgIGlmICgha2V5IHx8IHNlZW4uaGFzKGtleSkpIGNvbnRpbnVlO1xuICAgICAgICBzZWVuLmFkZChrZXkpO1xuICAgICAgICBvdXQucHVzaCh7IG5hbWU6a2V5LCBsYXQsIGxvbiB9KTtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gTG9jYXRpb25Nb2RhbCh7IGNmZywgc2V0Q2ZnLCBvbkNsb3NlLCBvblNhdmUgfSkge1xuICAgIGNvbnN0IG1hcEJveFJlZiA9IFJlYWN0LnVzZVJlZihudWxsKTtcbiAgICBjb25zdCBtYXBSZWYgICAgPSBSZWFjdC51c2VSZWYobnVsbCk7XG4gICAgY29uc3QgbWFya2VyUmVmID0gUmVhY3QudXNlUmVmKG51bGwpO1xuICAgIGNvbnN0IFtnZW9CdXN5LCBzZXRHZW9CdXN5XSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcblxuICAgIC8qIC0tLS0tIHNhdmVkIGxvY2F0aW9ucyAtLSBtaXJyb3Igd2hhdCB0aGUgRGFzaGJvYXJkJ3MgV2VhdGhlciBidXR0b24gc2hvd3MuXG4gICAgICpcbiAgICAgKiBUaGUgZGFzaGJvYXJkIHJlYWRzIHRoZW0gZnJvbSBgJHtBUElfVVJMfS9hcGkvd2VhdGhlci1sb2NhdGlvbmAnc1xuICAgICAqIGBzYXZlZGAgYXJyYXkgYW5kIG1pcnJvcnMgdGhhdCBpbnRvIGxvY2FsU3RvcmFnZVsnc2F2ZWRXZWF0aGVyTG9jYXRpb25zJ11cbiAgICAgKiBvbiBtb3VudCAoc2VlIHB1YmxpYy9qcy9kYXNoYm9hcmQvYXBwLmpzI2h5ZHJhdGVXZWF0aGVyU3RhdGUpLiAgV2UgZG9cbiAgICAgKiB0aGUgU0FNRSB0aGluZyBoZXJlIHNvIHRoZSBTZXR1cCBXYWxrJ3MgU2l0ZS1uYW1lIGRyb3Bkb3duIHN0YXlzXG4gICAgICogYnl0ZS1pZGVudGljYWwgd2l0aCB0aGUgZGFzaGJvYXJkJ3MgbG9jYXRpb24gbGlzdCAtLSBpbmNsdWRpbmcgd2hlbiB0aGVcbiAgICAgKiBvcGVyYXRvciB2aXNpdHMgU2V0dXAgV2FsayBCRUZPUkUgZXZlciBvcGVuaW5nIHRoZSBkYXNoYm9hcmQgKGZyZXNoXG4gICAgICogZGV2aWNlIGNhc2Ugd2hlcmUgbG9jYWxTdG9yYWdlIGlzIGVtcHR5KS5cbiAgICAgKlxuICAgICAqIFN0cmF0ZWd5OlxuICAgICAqICAgMSkgUmVhZCBsb2NhbFN0b3JhZ2UgZmlyc3QgKGluc3RhbnQsIG5vIGZsaWNrZXIgaWYgYWxyZWFkeSBoeWRyYXRlZCkuXG4gICAgICogICAyKSBUaGVuIEdFVCAvYXBpL3dlYXRoZXItbG9jYXRpb24gKGNhbm9uaWNhbCwgY3Jvc3MtZGV2aWNlIHNvdXJjZSkuXG4gICAgICogICAzKSBXaGljaGV2ZXIgaXMgbm9uLWVtcHR5IHdpbnM7IHNlcnZlciB3aW5zIHRpZXMuXG4gICAgICpcbiAgICAgKiBGcmVlLWZvcm0gdHlwaW5nIGluIHRoZSBpbnB1dCBzdGlsbCB3b3JrcyAtLSB0aGUgZGF0YWxpc3QgaXMgc3VnZ2VzdGlvblxuICAgICAqIG9ubHksIHRoZSBpbnB1dCBuZXZlciByZXN0cmljdHMgdGhlIHZhbHVlLiAqL1xuICAgIGNvbnN0IFtzYXZlZExvY3MsIHNldFNhdmVkTG9jc10gPSBSZWFjdC51c2VTdGF0ZSgoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByYXcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2F2ZWRXZWF0aGVyTG9jYXRpb25zJyk7XG4gICAgICAgICAgICBpZiAoIXJhdykgcmV0dXJuIFtdO1xuICAgICAgICAgICAgY29uc3QgYXJyID0gSlNPTi5wYXJzZShyYXcpO1xuICAgICAgICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXJyKSA/IF9ub3JtYWxpemVMb2NzKGFycikgOiBbXTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyByZXR1cm4gW107IH1cbiAgICB9KTtcbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBsZXQgY2FuY2VsbGVkID0gZmFsc2U7XG4gICAgICAgIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCgnL2FwaS93ZWF0aGVyLWxvY2F0aW9uJywgeyBjcmVkZW50aWFsczonaW5jbHVkZScsIGNhY2hlOiduby1zdG9yZScgfSk7XG4gICAgICAgICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm47XG4gICAgICAgICAgICAgICAgY29uc3QgaiA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNhdmVkID0gX25vcm1hbGl6ZUxvY3MoQXJyYXkuaXNBcnJheShqLnNhdmVkKSA/IGouc2F2ZWQgOiBbXSk7XG4gICAgICAgICAgICAgICAgaWYgKGNhbmNlbGxlZCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGlmIChzYXZlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFNhdmVkTG9jcyhzYXZlZCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIE1pcnJvciB0byBsb2NhbFN0b3JhZ2Ugc28gdGhlIGRhc2hib2FyZCBzZWVzIHRoZSBzYW1lIGxpc3RcbiAgICAgICAgICAgICAgICAgICAgLy8gZXZlbiBpZiBpdHMgb3duIGh5ZHJhdGUgaGFzbid0IHJ1biB5ZXQgdGhpcyBzZXNzaW9uLlxuICAgICAgICAgICAgICAgICAgICB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc2F2ZWRXZWF0aGVyTG9jYXRpb25zJywgSlNPTi5zdHJpbmdpZnkoc2F2ZWQpKTsgfSBjYXRjaCAoZSkge31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7IC8qIG9mZmxpbmUgLT4gbG9jYWxTdG9yYWdlIHZhbHVlIGFscmVhZHkgaW4gc3RhdGUgKi8gfVxuICAgICAgICB9KSgpO1xuICAgICAgICByZXR1cm4gKCkgPT4geyBjYW5jZWxsZWQgPSB0cnVlOyB9O1xuICAgIH0sIFtdKTtcblxuICAgIC8qIC0tLS0tIHNhdmVkLWxvY2F0aW9ucyBkcm9wZG93biBvcGVuL2Nsb3NlIHN0YXRlLlxuICAgICAqIE5hdGl2ZSA8ZGF0YWxpc3Q+IGhpZGVzIGl0cyBjaGV2cm9uIGluIG1vc3QgYnJvd3NlcnMgKGVzcGVjaWFsbHkgaW5cbiAgICAgKiBhIGRhcmsgdGhlbWUpLCB3aGljaCBtYWRlIHRoZSBcImRyb3AgZG93blwiIGludmlzaWJsZSB0byBvcGVyYXRvcnNcbiAgICAgKiB3aG8gY2xlYXJseSBoYWQgbXVsdGlwbGUgc2F2ZWQgbG9jYXRpb25zLiAgUmVwbGFjZWQgd2l0aCBhIGN1c3RvbVxuICAgICAqIHBvcGRvd24gcGFuZWwgdGhhdCBoYXMgYW4gQUxXQVlTLVZJU0lCTEUgY2hldnJvbiBidXR0b24gLS0gY2xpY2sgaXRcbiAgICAgKiB0byB0b2dnbGUsIGNsaWNrIG91dHNpZGUgdG8gZGlzbWlzcy4gKi9cbiAgICBjb25zdCBbc2F2ZWRPcGVuLCBzZXRTYXZlZE9wZW5dID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IHNhdmVkUmVmID0gUmVhY3QudXNlUmVmKG51bGwpO1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmICghc2F2ZWRPcGVuKSByZXR1cm47XG4gICAgICAgIGNvbnN0IG9uRG9jQ2xpY2sgPSAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHNhdmVkUmVmLmN1cnJlbnQgJiYgIXNhdmVkUmVmLmN1cnJlbnQuY29udGFpbnMoZS50YXJnZXQpKSBzZXRTYXZlZE9wZW4oZmFsc2UpO1xuICAgICAgICB9O1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKTtcbiAgICAgICAgcmV0dXJuICgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spO1xuICAgIH0sIFtzYXZlZE9wZW5dKTtcblxuICAgIC8qIFdoZW4gdGhlIHVzZXIgcGlja3MgYSBuYW1lIGZyb20gdGhlIGRyb3Bkb3duIE9SIHR5cGVzIG9uZSB0aGF0XG4gICAgICogZXhhY3RseSBtYXRjaGVzIGEgc2F2ZWQgZW50cnksIHB1bGwgaXRzIGxhdC9sb24gYW5kIHJlY2VudHJlIHRoZVxuICAgICAqIG1hcC4gIEZyZWUtZm9ybSB0eXBpbmcgc3RpbGwgd29ya3MgLS0gdGhlIG5hbWUgaXMganVzdCBrZXB0IGFzIHRoZVxuICAgICAqIHNpdGUgbGFiZWwuICBBdm9pZHMgc3VycHJpc2luZyB0aGUgb3BlcmF0b3Igd2hvIHR5cGVzIFwiUGF2aWxpb24gQlwiXG4gICAgICogKGEgbGFiZWwgdGhleSBpbnZlbnRlZCkgYW5kIGV4cGVjdHMgdGhlIG1hcCBOT1QgdG8ganVtcC4gKi9cbiAgICBjb25zdCBvblNpdGVOYW1lQ2hhbmdlID0gKG5ld05hbWUpID0+IHtcbiAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBzaXRlTmFtZTpuZXdOYW1lfSkpO1xuICAgICAgICBjb25zdCBoaXQgPSBzYXZlZExvY3MuZmluZChzID0+IHMubmFtZSA9PT0gbmV3TmFtZSk7XG4gICAgICAgIGlmIChoaXQpIHtcbiAgICAgICAgICAgIGNvbnN0IGxhdCA9IE1hdGgucm91bmQoaGl0LmxhdCAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICAgICAgY29uc3QgbG9uID0gTWF0aC5yb3VuZChoaXQubG9uICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIHNpdGVOYW1lOm5ld05hbWUsIGxhdCwgbG9uLCBjaXR5Om5ld05hbWV9KSk7XG4gICAgICAgICAgICBpZiAobWFwUmVmLmN1cnJlbnQpIG1hcFJlZi5jdXJyZW50LnNldFZpZXcoW2xhdCwgbG9uXSwgMTEpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBwaWNrU2F2ZWRMb2MgPSAobG9jKSA9PiB7XG4gICAgICAgIHNldFNhdmVkT3BlbihmYWxzZSk7XG4gICAgICAgIG9uU2l0ZU5hbWVDaGFuZ2UobG9jLm5hbWUpO1xuICAgIH07XG5cbiAgICAvKiAtLS0tLSBzZWFyY2ggc3RhdGUgLS0tLS0gKi9cbiAgICBjb25zdCBbc2VhcmNoUSwgc2V0U2VhcmNoUV0gICAgICAgICA9IFJlYWN0LnVzZVN0YXRlKCcnKTtcbiAgICBjb25zdCBbc2VhcmNoSGl0cywgc2V0U2VhcmNoSGl0c10gICA9IFJlYWN0LnVzZVN0YXRlKFtdKTtcbiAgICBjb25zdCBbc2VhcmNoQnVzeSwgc2V0U2VhcmNoQnVzeV0gICA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBbc2VhcmNoT3Blbiwgc2V0U2VhcmNoT3Blbl0gICA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBzZWFyY2hEZWJvdW5jZVJlZiAgICAgICAgICAgICA9IFJlYWN0LnVzZVJlZihudWxsKTtcblxuICAgIC8qIEZvcndhcmQtZ2VvY29kZTogcXVlcnkgLT4gW3tsYXQsIGxvbiwgZGlzcGxheV9uYW1lLCB0eXBlLCAuLi59XSAqL1xuICAgIGNvbnN0IHJ1blNlYXJjaCA9IGFzeW5jIChxKSA9PiB7XG4gICAgICAgIGlmICghcSB8fCBxLnRyaW0oKS5sZW5ndGggPCAzKSB7IHNldFNlYXJjaEhpdHMoW10pOyByZXR1cm47IH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNldFNlYXJjaEJ1c3kodHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBgaHR0cHM6Ly9ub21pbmF0aW0ub3BlbnN0cmVldG1hcC5vcmcvc2VhcmNoP2Zvcm1hdD1qc29uJmxpbWl0PTYmcT0ke2VuY29kZVVSSUNvbXBvbmVudChxKX1gO1xuICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwgeyBoZWFkZXJzOnsgJ0FjY2VwdCc6J2FwcGxpY2F0aW9uL2pzb24nIH0gfSk7XG4gICAgICAgICAgICBjb25zdCBqID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgICBzZXRTZWFyY2hIaXRzKEFycmF5LmlzQXJyYXkoaikgPyBqIDogW10pO1xuICAgICAgICAgICAgc2V0U2VhcmNoT3Blbih0cnVlKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBzZXRTZWFyY2hIaXRzKFtdKTsgfVxuICAgICAgICBmaW5hbGx5IHsgc2V0U2VhcmNoQnVzeShmYWxzZSk7IH1cbiAgICB9O1xuXG4gICAgLyogZGVib3VuY2VkIHNlYXJjaC1vbi10eXBlICovXG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKHNlYXJjaERlYm91bmNlUmVmLmN1cnJlbnQpIGNsZWFyVGltZW91dChzZWFyY2hEZWJvdW5jZVJlZi5jdXJyZW50KTtcbiAgICAgICAgc2VhcmNoRGVib3VuY2VSZWYuY3VycmVudCA9IHNldFRpbWVvdXQoKCkgPT4gcnVuU2VhcmNoKHNlYXJjaFEpLCA0MDApO1xuICAgICAgICByZXR1cm4gKCkgPT4gc2VhcmNoRGVib3VuY2VSZWYuY3VycmVudCAmJiBjbGVhclRpbWVvdXQoc2VhcmNoRGVib3VuY2VSZWYuY3VycmVudCk7XG4gICAgfSwgW3NlYXJjaFFdKTtcblxuICAgIGNvbnN0IHBpY2tTZWFyY2hIaXQgPSAoaGl0KSA9PiB7XG4gICAgICAgIGNvbnN0IGxhdCA9IE1hdGgucm91bmQoK2hpdC5sYXQgKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgY29uc3QgbG9uID0gTWF0aC5yb3VuZCgraGl0LmxvbiAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIGxhdCwgbG9uLCBjaXR5OmhpdC5kaXNwbGF5X25hbWV9KSk7XG4gICAgICAgIGlmIChtYXBSZWYuY3VycmVudCkgbWFwUmVmLmN1cnJlbnQuc2V0VmlldyhbbGF0LCBsb25dLCBoaXQudHlwZSA9PT0gJ2NpdHknID8gMTEgOiAxNSk7XG4gICAgICAgIHNldFNlYXJjaE9wZW4oZmFsc2UpO1xuICAgICAgICBzZXRTZWFyY2hRKCcnKTtcbiAgICB9O1xuXG4gICAgLyogUmV2ZXJzZS1nZW9jb2RlIGxhdC9sb24gLT4gY2l0eSAvIGNvdW50cnkgdmlhIE5vbWluYXRpbS4gIE5vIEFQSSBrZXkuICovXG4gICAgY29uc3QgcmV2ZXJzZUdlb2NvZGUgPSBhc3luYyAobGF0LCBsb24pID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNldEdlb0J1c3kodHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBgaHR0cHM6Ly9ub21pbmF0aW0ub3BlbnN0cmVldG1hcC5vcmcvcmV2ZXJzZT9mb3JtYXQ9anNvbiZsYXQ9JHtsYXR9Jmxvbj0ke2xvbn0mem9vbT0xMGA7XG4gICAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7IGhlYWRlcnM6IHsgJ0FjY2VwdCc6J2FwcGxpY2F0aW9uL2pzb24nIH0gfSk7XG4gICAgICAgICAgICBjb25zdCBqID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgICBjb25zdCBhID0gai5hZGRyZXNzIHx8IHt9O1xuICAgICAgICAgICAgY29uc3QgY2l0eSA9IGEuY2l0eSB8fCBhLnRvd24gfHwgYS52aWxsYWdlIHx8IGEuaGFtbGV0IHx8IGEuY291bnR5IHx8ICcnO1xuICAgICAgICAgICAgY29uc3QgcmVnaW9uID0gYS5zdGF0ZSB8fCBhLnJlZ2lvbiB8fCAnJztcbiAgICAgICAgICAgIGNvbnN0IGNvdW50cnkgPSBhLmNvdW50cnkgfHwgJyc7XG4gICAgICAgICAgICBjb25zdCBsYWJlbCA9IFtjaXR5LCByZWdpb24sIGNvdW50cnldLmZpbHRlcihCb29sZWFuKS5qb2luKCcsICcpIHx8IGouZGlzcGxheV9uYW1lIHx8ICcnO1xuICAgICAgICAgICAgaWYgKGxhYmVsKSBzZXRDZmcoYyA9PiAoey4uLmMsIGNpdHk6bGFiZWx9KSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogb2ZmbGluZSBvciByYXRlLWxpbWl0ZWQgLT4ga2VlcCBwcmlvciBuYW1lICovIH1cbiAgICAgICAgZmluYWxseSB7IHNldEdlb0J1c3koZmFsc2UpOyB9XG4gICAgfTtcblxuICAgIC8qIEluaXQgTGVhZmxldCBvbiBmaXJzdCByZW5kZXIgb2YgdGhlIG1vZGFsICovXG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKCFtYXBCb3hSZWYuY3VycmVudCB8fCBtYXBSZWYuY3VycmVudCkgcmV0dXJuO1xuICAgICAgICBjb25zdCBtYXAgPSBMLm1hcChtYXBCb3hSZWYuY3VycmVudCwgeyB6b29tQ29udHJvbDogdHJ1ZSwgYXR0cmlidXRpb25Db250cm9sOiB0cnVlIH0pXG4gICAgICAgICAgICAgICAgICAgICAuc2V0VmlldyhbY2ZnLmxhdCwgY2ZnLmxvbl0sIDYpO1xuICAgICAgICBMLnRpbGVMYXllcignaHR0cHM6Ly97c30udGlsZS5vcGVuc3RyZWV0bWFwLm9yZy97en0ve3h9L3t5fS5wbmcnLCB7XG4gICAgICAgICAgICBtYXhab29tOiAxOCxcbiAgICAgICAgICAgIGF0dHJpYnV0aW9uOiAnJmNvcHk7IE9wZW5TdHJlZXRNYXAgY29udHJpYnV0b3JzJyxcbiAgICAgICAgfSkuYWRkVG8obWFwKTtcblxuICAgICAgICBjb25zdCBtYXJrZXIgPSBMLm1hcmtlcihbY2ZnLmxhdCwgY2ZnLmxvbl0sIHsgZHJhZ2dhYmxlOiB0cnVlIH0pLmFkZFRvKG1hcCk7XG4gICAgICAgIG1hcmtlci5iaW5kVG9vbHRpcCgnRHJhZyBtZSBvciBjbGljayBhbnl3aGVyZSBvbiB0aGUgbWFwJywgeyBwZXJtYW5lbnQ6IGZhbHNlIH0pO1xuXG4gICAgICAgIGNvbnN0IGFwcGx5TGF0TG9uID0gKGxhdCwgbG9uKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByID0gKG4pID0+IE1hdGgucm91bmQobiAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBsYXQ6cihsYXQpLCBsb246cihsb24pfSkpO1xuICAgICAgICAgICAgcmV2ZXJzZUdlb2NvZGUocihsYXQpLCByKGxvbikpO1xuICAgICAgICB9O1xuICAgICAgICBtYXJrZXIub24oJ2RyYWdlbmQnLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsbCA9IG1hcmtlci5nZXRMYXRMbmcoKTtcbiAgICAgICAgICAgIGFwcGx5TGF0TG9uKGxsLmxhdCwgbGwubG5nKTtcbiAgICAgICAgfSk7XG4gICAgICAgIG1hcC5vbignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgbWFya2VyLnNldExhdExuZyhlLmxhdGxuZyk7XG4gICAgICAgICAgICBhcHBseUxhdExvbihlLmxhdGxuZy5sYXQsIGUubGF0bG5nLmxuZyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1hcFJlZi5jdXJyZW50ID0gbWFwO1xuICAgICAgICBtYXJrZXJSZWYuY3VycmVudCA9IG1hcmtlcjtcblxuICAgICAgICAvKiBMZWFmbGV0IHJlbmRlcnMgYmxhbmsgaWYgaXQgYm9vdHMgaW5zaWRlIGEgaGlkZGVuIGVsZW1lbnQg4oCUIGtpY2sgaXRcbiAgICAgICAgICAgb25jZSB0aGUgbW9kYWwgYW5pbWF0aW9uIHNldHRsZXMuICovXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gbWFwLmludmFsaWRhdGVTaXplKCksIDI1MCk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7IG1hcC5yZW1vdmUoKTsgbWFwUmVmLmN1cnJlbnQgPSBudWxsOyBtYXJrZXJSZWYuY3VycmVudCA9IG51bGw7IH07XG4gICAgfSwgW10pO1xuXG4gICAgLyogS2VlcCBtYXJrZXIgaW4gc3luYyB3aGVuIHVzZXIgZWRpdHMgbGF0L2xvbiBmaWVsZHMgbWFudWFsbHkgKi9cbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAobWFwUmVmLmN1cnJlbnQgJiYgbWFya2VyUmVmLmN1cnJlbnQpIHtcbiAgICAgICAgICAgIG1hcmtlclJlZi5jdXJyZW50LnNldExhdExuZyhbY2ZnLmxhdCwgY2ZnLmxvbl0pO1xuICAgICAgICAgICAgbWFwUmVmLmN1cnJlbnQucGFuVG8oW2NmZy5sYXQsIGNmZy5sb25dKTtcbiAgICAgICAgfVxuICAgIH0sIFtjZmcubGF0LCBjZmcubG9uXSk7XG5cbiAgICAvKiBHZW9sb2NhdGlvbjogc2lsZW50bHkgbm8tb3AnZCBiZWZvcmUgLS0gaWYgdGhlIGJyb3dzZXIgYmxvY2tlZCB0aGVcbiAgICAgKiByZXF1ZXN0IChIVFRQIG9yaWdpbiA9IG5vdCBhIHNlY3VyZSBjb250ZXh0IG9uIGZpZWxkIGNvbnRyb2xsZXJzLCBvclxuICAgICAqIHRoZSB1c2VyIGRlbmllZCBwZXJtaXNzaW9uIGVhcmxpZXIpIHRoZSBidXR0b24ganVzdCBzYXQgdGhlcmUuXG4gICAgICogTm93IHdlIHN1cmZhY2UgYSBzdGF0ZSAoYnVzeSAvIGVycikgc28gdGhlIG9wZXJhdG9yIGNhbiBzZWUgV0hZIGl0XG4gICAgICogZmFpbGVkIGFuZCBhY3Qgb24gaXQgKHN3aXRjaCB0byBIVFRQUywgcmUtcHJvbXB0LCBvciB1c2UgdGhlIG1hcCkuICovXG4gICAgY29uc3QgW2dlb1N0YXRlLCBzZXRHZW9TdGF0ZV0gPSBSZWFjdC51c2VTdGF0ZShudWxsKTsgICAvLyBudWxsIHwgJ2J1c3knIHwge2Vycn1cbiAgICBjb25zdCB1c2VNeUxvY2F0aW9uID0gKCkgPT4ge1xuICAgICAgICBzZXRHZW9TdGF0ZSgnYnVzeScpO1xuICAgICAgICAvLyBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24gaXMgYHVuZGVmaW5lZGAgb24gSFRUUCBvcmlnaW5zIChDaHJvbWUgNTArKS5cbiAgICAgICAgaWYgKCFuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pIHtcbiAgICAgICAgICAgIHNldEdlb1N0YXRlKHsgZXJyOidCcm93c2VyIGJsb2NrZWQgbG9jYXRpb24gYWNjZXNzIOKAlCBvcGVuIHRoaXMgcGFnZSB2aWEgSFRUUFMuJyB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKFxuICAgICAgICAgICAgKHBvcykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhdCA9IE1hdGgucm91bmQocG9zLmNvb3Jkcy5sYXRpdHVkZSAgKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgICAgICAgICBjb25zdCBsb24gPSBNYXRoLnJvdW5kKHBvcy5jb29yZHMubG9uZ2l0dWRlICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBsYXQsIGxvbn0pKTtcbiAgICAgICAgICAgICAgICBpZiAobWFwUmVmLmN1cnJlbnQpIG1hcFJlZi5jdXJyZW50LnNldFZpZXcoW2xhdCwgbG9uXSwgMTEpO1xuICAgICAgICAgICAgICAgIHJldmVyc2VHZW9jb2RlKGxhdCwgbG9uKTtcbiAgICAgICAgICAgICAgICBzZXRHZW9TdGF0ZShudWxsKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gZXJyLmNvZGU6IDE9UEVSTUlTU0lPTl9ERU5JRUQsIDI9UE9TSVRJT05fVU5BVkFJTEFCTEUsIDM9VElNRU9VVFxuICAgICAgICAgICAgICAgIGNvbnN0IG1zZyA9IGVyciAmJiBlcnIuY29kZSA9PT0gMVxuICAgICAgICAgICAgICAgICAgICA/ICdMb2NhdGlvbiBwZXJtaXNzaW9uIGRlbmllZCDigJQgY2xpY2sgdGhlIGxvY2sgaWNvbiBpbiB0aGUgYWRkcmVzcyBiYXIgYW5kIGFsbG93IGxvY2F0aW9uLidcbiAgICAgICAgICAgICAgICAgICAgOiBlcnIgJiYgZXJyLmNvZGUgPT09IDJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gJ0xvY2F0aW9uIGN1cnJlbnRseSB1bmF2YWlsYWJsZSDigJQgdGhlIGRldmljZSBoYXMgbm8gR1BTIC8gV2ktRmkgZml4IHlldC4nXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGVyciAmJiBlcnIuY29kZSA9PT0gM1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ0xvY2F0aW9uIHJlcXVlc3QgdGltZWQgb3V0IOKAlCB0cnkgYWdhaW4sIG9yIHVzZSB0aGUgbWFwIC8gc2VhcmNoIGJhci4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAoZXJyICYmIGVyci5tZXNzYWdlKSB8fCAnQ291bGQgbm90IHJlYWQgZGV2aWNlIGxvY2F0aW9uLic7XG4gICAgICAgICAgICAgICAgc2V0R2VvU3RhdGUoeyBlcnI6IG1zZyB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7IGVuYWJsZUhpZ2hBY2N1cmFjeTp0cnVlLCB0aW1lb3V0OjEwMDAwLCBtYXhpbXVtQWdlOjAgfVxuICAgICAgICApO1xuICAgIH07XG5cbiAgICAvKiBXaGVuIHVzZXIgY2xpY2tzIFwiU2F2ZSAmIHJldHVyblwiLCBtaXJyb3IgRVhBQ1RMWSB3aGF0IHRoZSBkYXNoYm9hcmQnc1xuICAgICAqIFdlYXRoZXIgYnV0dG9uIGRvZXMgaW4gd2VhdGhlci1zZXR0aW5ncy1tb2RhbC5qcyNzZWxlY3RMb2NhdGlvbjpcbiAgICAgKiAgIDEuIGxvY2FsU3RvcmFnZVsnd2VhdGhlckxvY2F0aW9uJ10gICAgICAgID0gY2hvc2VuIGxvYyAoY2Fub25pY2FsIGtleVxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBkYXNoYm9hcmQgcmVhZHMgb25cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3VudCwgTk9UICdyZWQ1LndlYXRoZXJfbG9jYXRpb24nKS5cbiAgICAgKiAgIDIuIGxvY2FsU3RvcmFnZVsnc2F2ZWRXZWF0aGVyTG9jYXRpb25zJ10gID0gW2xvYywgLi4ub3RoZXJzXSBkZWR1cGVkXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnkgbGF0L2xvbiwgY2FwcGVkIGF0IDIwLlxuICAgICAqICAgMy4gUE9TVCAvYXBpL3dlYXRoZXItbG9jYXRpb24gd2l0aCBhY3RpdmUrZGVmYXVsdCtzYXZlZCBzbyB0aGUgc2FtZVxuICAgICAqICAgICAgbGlzdCBzdXJ2aXZlcyBjcm9zcy1kZXZpY2Ugc2Vzc2lvbnMgZm9yIHNpZ25lZC1pbiB0ZW5hbnRzLlxuICAgICAqXG4gICAgICogV2l0aG91dCBzdGVwIDEgdGhlIGRhc2hib2FyZCdzIGB3ZWF0aGVyTG9jYXRpb25gIHN0YXRlIHNpbGVudGx5IGtlZXBzXG4gICAgICogaXRzIG9sZCB2YWx1ZSAtLSB3aGljaCBpcyBleGFjdGx5IHRoZSBidWcgb3BlcmF0b3JzIHJlcG9ydGVkIGFmdGVyXG4gICAgICogcGlja2luZyBhIGxvY2F0aW9uIGluIFNldHVwIFdhbGsgYW5kIHNlZWluZyB0aGUgZGFzaGJvYXJkJ3Mgd2VhdGhlclxuICAgICAqIHN0cmlwIHJlZnVzZSB0byB1cGRhdGUuICovXG4gICAgY29uc3QgW3NhdmVNc2csIHNldFNhdmVNc2ddID0gUmVhY3QudXNlU3RhdGUobnVsbCk7XG4gICAgY29uc3QgcGVyc2lzdEFuZFNhdmUgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGxvYyA9IHsgbGF0OiBjZmcubGF0LCBsb246IGNmZy5sb24sIG5hbWU6IGNmZy5zaXRlTmFtZSB8fCBjZmcuY2l0eSB9O1xuXG4gICAgICAgIC8vIERlLWR1cCB0aGUgZXhpc3Rpbmcgc2F2ZWQgbGlzdCBieSBsYXQvbG9uIChzYW1lIGtleSB0aGUgZGFzaGJvYXJkXG4gICAgICAgIC8vIHVzZXMpIGFuZCBwdXQgdGhlIG5ldyBwaWNrIGF0IHRoZSB0b3AuICBDYXAgYXQgMjAgdG8gbWF0Y2ggdGhlXG4gICAgICAgIC8vIGRhc2hib2FyZCdzIGJlaGF2aW91ci5cbiAgICAgICAgY29uc3Qga2V5ID0gbG9jLmxhdC50b0ZpeGVkKDQpICsgJywnICsgbG9jLmxvbi50b0ZpeGVkKDQpO1xuICAgICAgICBjb25zdCBkZWR1cGVkID0gc2F2ZWRMb2NzLmZpbHRlcihsID0+IChsLmxhdC50b0ZpeGVkKDQpICsgJywnICsgbC5sb24udG9GaXhlZCg0KSkgIT09IGtleSk7XG4gICAgICAgIGNvbnN0IG5leHRTYXZlZCA9IFtsb2MsIC4uLmRlZHVwZWRdLnNsaWNlKDAsIDIwKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3dlYXRoZXJMb2NhdGlvbicsIEpTT04uc3RyaW5naWZ5KGxvYykpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3NhdmVkV2VhdGhlckxvY2F0aW9ucycsIEpTT04uc3RyaW5naWZ5KG5leHRTYXZlZCkpO1xuICAgICAgICAgICAgLy8gS2VlcCB0aGUgb2xkIGtleSB0b28gLS0gc29tZSBsZWdhY3kgcGx1Zy1pbnMgc3RpbGwgbG9vayBhdCBpdC5cbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1LndlYXRoZXJfbG9jYXRpb24nLCBKU09OLnN0cmluZ2lmeShsb2MpKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBwcml2YXRlIG1vZGUgLS0gaWdub3JlICovIH1cblxuICAgICAgICBsZXQgcGVyc2lzdGVkID0gZmFsc2UsIHdhcm5pbmcgPSAnJztcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCgnL2FwaS93ZWF0aGVyLWxvY2F0aW9uJywge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzonYXBwbGljYXRpb24vanNvbicgfSxcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGFjdGl2ZTogbG9jLCBkZWZhdWx0OiBsb2MsIHNhdmVkOiBuZXh0U2F2ZWQgfSksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IGogPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgICAgIHdpbmRvdy5fbGFzdFdlYXRoZXJMb2NhdGlvblNhdmUgPSBqO1xuICAgICAgICAgICAgcGVyc2lzdGVkID0gISFqLnBlcnNpc3RlZDtcbiAgICAgICAgICAgIHdhcm5pbmcgICA9IGoud2FybmluZyB8fCAnJztcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnW3NldHVwIHdhbGtdIC9hcGkvd2VhdGhlci1sb2NhdGlvbiA8LScsIGopO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB3YXJuaW5nID0gJ05ldHdvcmsgZXJyb3Ig4oCUIHNhdmVkIGxvY2FsbHkgb25seS4nO1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdbc2V0dXAgd2Fsa10gY291bGQgbm90IHBlcnNpc3QgbG9jYXRpb246JywgZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUZWxsIGFueSBvcGVuIGRhc2hib2FyZCB0YWIgdG8gcmUtaHlkcmF0ZS4gIFRoZSBkYXNoYm9hcmRcbiAgICAgICAgLy8gYWxyZWFkeSBsaXN0ZW5zIGZvciBgc3RvcmFnZWAgZXZlbnRzIHdoZW4gYW5vdGhlciB0YWIgd3JpdGVzIHRvXG4gICAgICAgIC8vIGxvY2FsU3RvcmFnZSwgYnV0IG9uIFYxLjkgc29tZSBicm93c2VycyBET04nVCBmaXJlIGBzdG9yYWdlYCBmb3JcbiAgICAgICAgLy8gc2FtZS1vcmlnaW4gd3JpdGVzIGZyb20gdGhpcyBzYW1lIHRhYi4gIEFuIGV4cGxpY2l0IGN1c3RvbSBldmVudFxuICAgICAgICAvLyBtYWtlcyB0aGUgZGFzaGJvYXJkJ3MgcG9sbGluZyBwaWNrIHRoZSBjaGFuZ2UgdXAgaW1tZWRpYXRlbHkgaWZcbiAgICAgICAgLy8gaXQncyBhbHJlYWR5IG1vdW50ZWQgaW4gYW5vdGhlciB0YWIvd2luZG93LlxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdyZWQ1OndlYXRoZXJMb2NhdGlvbkNoYW5nZWQnLFxuICAgICAgICAgICAgICAgIHsgZGV0YWlsOiB7IGFjdGl2ZTogbG9jLCBzYXZlZDogbmV4dFNhdmVkIH0gfSkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IC8qIElFLWxlc3MgZW52aXJvbm1lbnRzIC0tIG5vLW9wICovIH1cblxuICAgICAgICBpZiAocGVyc2lzdGVkKSB7XG4gICAgICAgICAgICBvblNhdmUoKTsgICAgICAgICAgIC8vIGhhcHB5IHBhdGg6IGNsb3NlICsgbWFyayBzdGVwIGRvbmVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8qIFN1cmZhY2UgdGhlIHdhcm5pbmcsIGhvbGQgdGhlIG1vZGFsIG9wZW4gZm9yIDEuNnMgc28gdGhlXG4gICAgICAgICAgICAgKiBvcGVyYXRvciByZWFkcyBpdCwgdGhlbiBjbG9zZS4gIFRoZSBsb2NhbCBjb3B5IGlzIGFscmVhZHlcbiAgICAgICAgICAgICAqIHdyaXR0ZW4sIHNvIHRoZSBkYXNoYm9hcmQgd2lsbCBzdGlsbCBzZWUgdGhlIG5ldyBsb2NhdGlvblxuICAgICAgICAgICAgICogaW4gdGhpcyBicm93c2VyIHNlc3Npb24uICovXG4gICAgICAgICAgICBzZXRTYXZlTXNnKHdhcm5pbmcgfHwgJ1NhdmVkIGxvY2FsbHkgb25seSDigJQgc2lnbiBpbiB0byBzYXZlIHNlcnZlci1zaWRlLicpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHNldFNhdmVNc2cobnVsbCk7IG9uU2F2ZSgpOyB9LCAxNjAwKTtcbiAgICAgICAgfVxuICAgIH07XG5cblxuICAgIHJldHVybiAoXG4gICAgICAgIDxNb2RhbFNoZWxsIHRpdGxlPVwiTG9jYXRpb24gU2V0dGluZ1wiIHN1YnRpdGxlPVwiQ2xpY2sgdGhlIG1hcCwgZHJhZyB0aGUgcGluLCBvciB1c2UgeW91ciBkZXZpY2VcIiBhY2NlbnQ9XCJhbWJlclwiIG9uQ2xvc2U9e29uQ2xvc2V9IG9uU2F2ZT17cGVyc2lzdEFuZFNhdmV9IHNpemU9XCJtYXhcIj5cbiAgICAgICAgICAgIHtzYXZlTXNnICYmIChcbiAgICAgICAgICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwibG9jLXNhdmUtbXNnXCJcbiAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1iLTMgcHgtNCBweS0yLjUgcm91bmRlZC1sZyBiZy1hbWJlci05MDAvMzAgYm9yZGVyIGJvcmRlci1hbWJlci03MDAvNTAgdGV4dC1hbWJlci0yMDAgdGV4dC14cyBmb250LW1vbm9cIj5cbiAgICAgICAgICAgICAgICAgICAg4pqgICB7c2F2ZU1zZ31cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbGc6Z3JpZC1jb2xzLVsxZnJfMzQwcHhdIGdhcC00IGgtZnVsbFwiIHN0eWxlPXt7bWluSGVpZ2h0Oic1NnZoJ319PlxuICAgICAgICAgICAgICAgIHsvKiBNQVAg4oCUIGZpbGxzIHRoZSBsZWZ0IHNpZGUsIHdpdGggYSBzZWFyY2ggYmFyIGZsb2F0aW5nIG9uIHRvcCAqL31cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlXCIgc3R5bGU9e3ttaW5IZWlnaHQ6JzU2dmgnfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgcmVmPXttYXBCb3hSZWZ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgaGVpZ2h0OicxMDAlJywgbWluSGVpZ2h0Oic1NnZoJywgd2lkdGg6JzEwMCUnLCBib3JkZXJSYWRpdXM6JzEycHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OidoaWRkZW4nLCBib3JkZXI6JzFweCBzb2xpZCAjMzM0MTU1JywgYmFja2dyb3VuZDonIzBiMTIyMCcgfX0vPlxuXG4gICAgICAgICAgICAgICAgICAgIHsvKiBTZWFyY2ggYmFyIG92ZXJsYXkg4oCUIHNpdHMgaW4gdGhlIHRvcC1jZW50cmUgb2YgdGhlIG1hcCAqL31cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSB0b3AtMyBsZWZ0LTEvMiAtdHJhbnNsYXRlLXgtMS8yIHotWzUwMF1cIiBzdHlsZT17e3dpZHRoOidtaW4oNTYwcHgsIGNhbGMoMTAwJSAtIDExMHB4KSknfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3NlYXJjaFF9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0U2VhcmNoUShlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uRm9jdXM9eygpID0+IHNlYXJjaEhpdHMubGVuZ3RoICYmIHNldFNlYXJjaE9wZW4odHJ1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwi8J+UjiAgU2VhcmNoIGJ5IGFkZHJlc3MsIGJ1aWxkaW5nLCBvciBwbGFjZSBuYW1l4oCmXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHB4LTQgcHktMi41IHJvdW5kZWQteGwgYmctc2xhdGUtOTAwLzk1IGJvcmRlciBib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtMTAwIHRleHQtc20gcGxhY2Vob2xkZXItc2xhdGUtNTAwIHNoYWRvdy0yeGwgYmFja2Ryb3AtYmx1clwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7b3V0bGluZTonbm9uZSd9fS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlYXJjaEJ1c3kgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJhYnNvbHV0ZSByaWdodC0zIHRvcC0xLzIgLXRyYW5zbGF0ZS15LTEvMiB0ZXh0LWFtYmVyLTQwMCB0ZXh0LXhzXCI+4oCmPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlYXJjaE9wZW4gJiYgc2VhcmNoSGl0cy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSB0b3AtZnVsbCBsZWZ0LTAgcmlnaHQtMCBtdC0xIGJnLXNsYXRlLTkwMC85NyBib3JkZXIgYm9yZGVyLXNsYXRlLTcwMCByb3VuZGVkLXhsIHNoYWRvdy0yeGwgb3ZlcmZsb3ctaGlkZGVuIG1heC1oLTcyIG92ZXJmbG93LXktYXV0byBiYWNrZHJvcC1ibHVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VhcmNoSGl0cy5tYXAoKGgsIGkpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGtleT17aC5wbGFjZV9pZCB8fCBpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gcGlja1NlYXJjaEhpdChoKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCB0ZXh0LWxlZnQgcHgtNCBweS0yLjUgaG92ZXI6YmctYW1iZXItOTAwLzMwIGJvcmRlci1iIGJvcmRlci1zbGF0ZS04MDAgbGFzdDpib3JkZXItYi0wIHRyYW5zaXRpb24tYWxsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LXNsYXRlLTIwMCB0cnVuY2F0ZVwiPntoLmRpc3BsYXlfbmFtZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IG10LTAuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2gudHlwZSB8fCBoLmNsYXNzfSDCtyB7KCtoLmxhdCkudG9GaXhlZCgzKX0sIHsoK2gubG9uKS50b0ZpeGVkKDMpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWFyY2hPcGVuICYmIHNlYXJjaEhpdHMubGVuZ3RoID09PSAwICYmIHNlYXJjaFEubGVuZ3RoID49IDMgJiYgIXNlYXJjaEJ1c3kgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC1mdWxsIGxlZnQtMCByaWdodC0wIG10LTEgYmctc2xhdGUtOTAwLzk3IGJvcmRlciBib3JkZXItc2xhdGUtNzAwIHJvdW5kZWQteGwgcHgtNCBweS0zIHRleHQteHMgdGV4dC1zbGF0ZS00MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vIHJlc3VsdHMgZm9yIFwie3NlYXJjaFF9XCIuICBUcnkgYSBtb3JlIHNwZWNpZmljIHRlcm0uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICB7LyogU0lERSBQQU5FTCAqL31cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktNCBvdmVyZmxvdy15LWF1dG8gcHItMVwiPlxuICAgICAgICAgICAgICAgICAgICB7LyogU2l0ZSBuYW1lIGNvbWJvLWlucHV0LiAgRnJlZS1mb3JtIHR5cGluZyBmb3IgZnJlc2hcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsczsgYSB2aXNpYmxlIGNoZXZyb24gYnV0dG9uIG9uIHRoZSByaWdodCBvcGVuc1xuICAgICAgICAgICAgICAgICAgICAgICAgYSBjdXN0b20gcG9wZG93biBsaXN0aW5nIGV2ZXJ5IHNhdmVkIGxvY2F0aW9uIHB1bGxlZFxuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAvYXBpL3dlYXRoZXItbG9jYXRpb24gKGkuZS4gdGhlIFNBTUUgbGlzdCB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAgIERhc2hib2FyZCdzIFdlYXRoZXIgYnV0dG9uIHN1cmZhY2VzKS4gIFRoaXMgcmVwbGFjZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBlYXJsaWVyIG5hdGl2ZSA8ZGF0YWxpc3Q+IHdoaWNoIHdhcyB0b28gc3VidGxlXG4gICAgICAgICAgICAgICAgICAgICAgICBpbiBkYXJrIHRoZW1lcyAtLSBvcGVyYXRvcnMgd2l0aCBOPjAgc2F2ZWQgZW50cmllc1xuICAgICAgICAgICAgICAgICAgICAgICAgY291bGQgbm90IHRlbGwgYSBkcm9wZG93biBleGlzdGVkLiAqL31cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMS41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU2l0ZSBuYW1lIChzYXZlZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2F2ZWRMb2NzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtbC0yIHRleHQtYW1iZXItNDAwLzgwIG5vcm1hbC1jYXNlIHRyYWNraW5nLW5vcm1hbCB0ZXh0LVsxMHB4XVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwibG9jLXNhdmVkLWhpbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIOKWviB7c2F2ZWRMb2NzLmxlbmd0aH0gc2F2ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmVcIiByZWY9e3NhdmVkUmVmfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXQgcHItOVwiIHZhbHVlPXtjZmcuc2l0ZU5hbWUgfHwgJyd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwibG9jLXNpdGUtbmFtZS1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtzYXZlZExvY3MubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnUGljayBhIHNhdmVkIGxvY2F0aW9uLCBvciB0eXBlIGEgbmV3IG9uZeKApidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2UuZy4gSFEgVG93ZXIsIE5vcnRoIFdpbmcsIFBhdmlsaW9uIELigKYnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IG9uU2l0ZU5hbWVDaGFuZ2UoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkZvY3VzPXsoKSA9PiBzYXZlZExvY3MubGVuZ3RoID4gMCAmJiBzZXRTYXZlZE9wZW4odHJ1ZSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2F2ZWRMb2NzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwibG9jLXNhdmVkLWNoZXZyb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFNhdmVkT3Blbih2ID0+ICF2KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiT3BlbiBzYXZlZCBsb2NhdGlvbnNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwiUGljayBmcm9tIHNhdmVkIGxvY2F0aW9uc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgcmlnaHQtMSB0b3AtMS8yIC10cmFuc2xhdGUteS0xLzIgdy03IGgtNyByb3VuZGVkLW1kIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGJnLWFtYmVyLTcwMC8zMCBob3ZlcjpiZy1hbWJlci02MDAvNTAgYm9yZGVyIGJvcmRlci1hbWJlci01MDAvNDAgdGV4dC1hbWJlci0yMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIxNFwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyLjRcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3t0cmFuc2Zvcm06IHNhdmVkT3BlbiA/ICdyb3RhdGUoMTgwZGVnKScgOiAnbm9uZScsIHRyYW5zaXRpb246J3RyYW5zZm9ybSAuMTVzJ319PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5bGluZSBwb2ludHM9XCI2IDkgMTIgMTUgMTggOVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzYXZlZE9wZW4gJiYgc2F2ZWRMb2NzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwibG9jLXNhdmVkLWRyb3Bkb3duXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSB6LVs2MDBdIGxlZnQtMCByaWdodC0wIHRvcC1mdWxsIG10LTEgYmctc2xhdGUtOTAwIGJvcmRlciBib3JkZXItc2xhdGUtNjAwIHJvdW5kZWQtbGcgc2hhZG93LTJ4bCBtYXgtaC02NCBvdmVyZmxvdy15LWF1dG9cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzYXZlZExvY3MubWFwKGxvYyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNBY3RpdmUgPSAoY2ZnLnNpdGVOYW1lIHx8ICcnKS50cmltKCkgPT09IGxvYy5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PXtsb2MubmFtZX0gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gcGlja1NhdmVkTG9jKGxvYyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2Bsb2Mtc2F2ZWQtb3B0LSR7bG9jLm5hbWV9YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B3LWZ1bGwgdGV4dC1sZWZ0IHB4LTMgcHktMiBib3JkZXItYiBib3JkZXItc2xhdGUtODAwIGxhc3Q6Ym9yZGVyLWItMCBob3ZlcjpiZy1hbWJlci05MDAvMzAgdHJhbnNpdGlvbi1jb2xvcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtpc0FjdGl2ZSA/ICdiZy1hbWJlci05MDAvNTAnIDogJyd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC1zbGF0ZS0xMDAgdHJ1bmNhdGVcIj57bG9jLm5hbWV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIGZvbnQtbW9ubyBtdC0wLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bG9jLmxhdC50b0ZpeGVkKDIpfSwge2xvYy5sb24udG9GaXhlZCgyKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTEgaXRhbGljXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NhdmVkTG9jcy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ1BpY2sgYSBwcmV2aW91c2x5LXNhdmVkIGxvY2F0aW9uLCBvciB0eXBlIGEgbmV3IGxhYmVsIGZvciB0aGlzIHBsYWNlLidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnWW91ciBsYWJlbCBmb3IgdGhpcyBwbGFjZSDigJQgc2hvd24gb24gdGhlIGRhc2hib2FyZCBoZWFkZXIuJ31cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib3JkZXItdCBib3JkZXItc2xhdGUtODAwIHB0LTNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMS41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVzb2x2ZWQgYWRkcmVzcyAvIGNpdHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Z2VvQnVzeSAmJiA8c3BhbiBjbGFzc05hbWU9XCJtbC0yIHRleHQtYW1iZXItNDAwIG5vcm1hbC1jYXNlIHRyYWNraW5nLW5vcm1hbFwiPuKApiByZXNvbHZpbmc8L3NwYW4+fVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIiB2YWx1ZT17Y2ZnLmNpdHl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKT0+c2V0Q2ZnKHsuLi5jZmcsIGNpdHk6ZS50YXJnZXQudmFsdWV9KX0vPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC0zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMS41XCI+TGF0aXR1ZGU8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIiB0eXBlPVwibnVtYmVyXCIgc3RlcD1cIjAuMDAwMVwiIHZhbHVlPXtjZmcubGF0fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpPT5zZXRDZmcoey4uLmNmZywgbGF0OitlLnRhcmdldC52YWx1ZX0pfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0xLjVcIj5Mb25naXR1ZGU8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIiB0eXBlPVwibnVtYmVyXCIgc3RlcD1cIjAuMDAwMVwiIHZhbHVlPXtjZmcubG9ufVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpPT5zZXRDZmcoey4uLmNmZywgbG9uOitlLnRhcmdldC52YWx1ZX0pfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXt1c2VNeUxvY2F0aW9ufVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtnZW9TdGF0ZSA9PT0gJ2J1c3knfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwibG9jLXVzZS1teS1sb2NhdGlvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdy1mdWxsIHB5LTIuNSByb3VuZGVkLWxnIGJvcmRlciB0ZXh0LXhzIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCB0cmFuc2l0aW9uLWNvbG9yc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2dlb1N0YXRlID09PSAnYnVzeSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLWFtYmVyLTkwMC80MCBib3JkZXItYW1iZXItNzAwLzQwIHRleHQtYW1iZXItMjAwIGN1cnNvci13YWl0J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAoZ2VvU3RhdGUgJiYgZ2VvU3RhdGUuZXJyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctcm9zZS05MDAvNDAgYm9yZGVyLXJvc2UtNTAwLzUwIHRleHQtcm9zZS0xMDAgaG92ZXI6Ymctcm9zZS04MDAvNDAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctYW1iZXItNzAwLzcwIGJvcmRlci1hbWJlci01MDAvNDAgdGV4dC1hbWJlci01MCBob3ZlcjpiZy1hbWJlci02MDAvNzAnKX1gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtnZW9TdGF0ZSA9PT0gJ2J1c3knXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAn4o+zICBSZWFkaW5nIGRldmljZSBsb2NhdGlvbuKApidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICfwn5ONICBVc2UgbXkgZGV2aWNlIGxvY2F0aW9uJ31cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIHtnZW9TdGF0ZSAmJiBnZW9TdGF0ZS5lcnIgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cImxvYy1nZW8tZXJyb3JcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCItbXQtMiBweC0zIHB5LTIgcm91bmRlZC1tZCBiZy1yb3NlLTk1MC81MCBib3JkZXIgYm9yZGVyLXJvc2UtNzAwLzQwIHRleHQtWzExcHhdIGxlYWRpbmctc251ZyB0ZXh0LXJvc2UtMjAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGIgY2xhc3NOYW1lPVwidGV4dC1yb3NlLTEwMFwiPkNvdWxkbid0IHJlYWQgbG9jYXRpb24uPC9iPjxici8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1yb3NlLTIwMC85MFwiPntnZW9TdGF0ZS5lcnJ9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBTcGVjaWZpYyBIVFRQLW9yaWdpbiBjYWxsLW91dDogbW9zdCBsaWtlbHkgY2F1c2Ugb24gYSBWMS45IGNvbnRyb2xsZXIuICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cubG9jYXRpb24gJiYgd2luZG93LmxvY2F0aW9uLnByb3RvY29sID09PSAnaHR0cDonICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC0xLjUgdGV4dC1bMTBweF0gdGV4dC1yb3NlLTMwMC84MCBmb250LW1vbm9cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcDogYnJvd3NlcnMgcmVxdWlyZSBIVFRQUyBmb3IgZ2VvbG9jYXRpb24uICBQaWNrIHRoZSBsb2NhdGlvbiBvbiB0aGUgbWFwIG9yIHNlYXJjaCBiYXIgaW5zdGVhZC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICApfVxuXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyLXQgYm9yZGVyLXNsYXRlLTgwMCBwdC0zIG10LTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMlwiPlF1aWNrIGp1bXBzPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonVG9yb250bywgT04nLCAgIGxhdDo0My42NTMyLCBsb246LTc5LjM4MzIsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidOZXcgWW9yaywgTlknLCAgbGF0OjQwLjcxMjgsIGxvbjotNzQuMDA2MCwgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J0xvbmRvbiwgVUsnLCAgICBsYXQ6NTEuNTA3NCwgbG9uOiAtMC4xMjc4LCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonUGFyaXMsIEZSJywgICAgIGxhdDo0OC44NTY2LCBsb246ICAyLjM1MjIsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidUb2t5bywgSlAnLCAgICAgbGF0OjM1LjY3NjIsIGxvbjoxMzkuNjUwMywgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J1N5ZG5leSwgQVUnLCAgICBsYXQ6LTMzLjg2ODgsbG9uOjE1MS4yMDkzLCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXS5tYXAoaiA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PXtqLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIGxhdDpqLmxhdCwgbG9uOmoubG9uLCBjaXR5OmoubmFtZX0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hcFJlZi5jdXJyZW50KSBtYXBSZWYuY3VycmVudC5zZXRWaWV3KFtqLmxhdCwgai5sb25dLCBqLnopO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1sZWZ0IHB4LTIuNSBweS0xLjUgcm91bmRlZC1tZCBiZy1zbGF0ZS04MDAvNzAgYm9yZGVyIGJvcmRlci1zbGF0ZS03MDAgdGV4dC1bMTFweF0gZm9udC1ib2xkIHRleHQtc2xhdGUtMzAwIGhvdmVyOmJnLXNsYXRlLTcwMCBob3Zlcjpib3JkZXItYW1iZXItNTAwLzQwIHRyYW5zaXRpb24tYWxsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ai5uYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBsZWFkaW5nLXJlbGF4ZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIFRpbGVzOiBPcGVuU3RyZWV0TWFwIMK3IEdlb2NvZGU6IE5vbWluYXRpbSAoZnJlZSwgfjEgcmVxL3MpLlxuICAgICAgICAgICAgICAgICAgICAgICAgVXNlZCBmb3IgT3Blbi1NZXRlbyB3ZWF0aGVyIGZlZWQgYW5kIHN1bnJpc2Uvc3Vuc2V0IGVzdGltYXRpb24uXG4gICAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L01vZGFsU2hlbGw+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTGFuZ3VhZ2UgU2V0dGluZyAtLSBtb2RhbFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuZnVuY3Rpb24gTGFuZ3VhZ2VNb2RhbCh7IGNmZywgc2V0Q2ZnLCBvbkNsb3NlLCBvblNhdmUgfSkge1xuICAgIGNvbnN0IGxhbmdzID0gW1xuICAgICAgICB7IGNvZGU6J2VuJywgICAgbGFiZWw6J0VuZ2xpc2gnLCAgICAgICAgICAgICAgICBuYXRpdmU6J0VuZ2xpc2gnICAgIH0sXG4gICAgICAgIHsgY29kZTonemgtQ04nLCBsYWJlbDonQ2hpbmVzZSAoU2ltcGxpZmllZCknLCAgIG5hdGl2ZTon566A5L2T5Lit5paHJyAgICB9LFxuICAgICAgICB7IGNvZGU6J3poLVRXJywgbGFiZWw6J0NoaW5lc2UgKFRyYWRpdGlvbmFsKScsICBuYXRpdmU6J+e5gemrlOS4reaWhycgICAgfSxcbiAgICAgICAgeyBjb2RlOidqYScsICAgIGxhYmVsOidKYXBhbmVzZScsICAgICAgICAgICAgICAgbmF0aXZlOifml6XmnKzoqp4nICAgICAgfSxcbiAgICAgICAgeyBjb2RlOidrbycsICAgIGxhYmVsOidLb3JlYW4nLCAgICAgICAgICAgICAgICAgbmF0aXZlOiftlZzqta3slrQnICAgICAgfSxcbiAgICBdO1xuXG4gICAgLyogT24gU2F2ZSAmIHJldHVybjogd3JpdGUgdGhlIHBpY2tlZCBsYW5ndWFnZSBjb2RlIHRvIHRoZSBzYW1lXG4gICAgICogbG9jYWxTdG9yYWdlIGtleSB0aGUgZGFzaGJvYXJkJ3MgaTE4bi5qcyByZWFkcyAoYGkxOG5fbGFuZ2ApLCBhbmRcbiAgICAgKiBkaXNwYXRjaCB0aGUgYGxhbmdjaGFuZ2VgIGV2ZW50IHNvIGFueSBvcGVuIGRhc2hib2FyZC9jb25maWcgdGFiXG4gICAgICogcGlja3MgaXQgdXAgbGl2ZS4gIFRoaXMgaXMgd2hhdCBtYWtlcyB0aGUgc2V0dXAgd2FsaydzIGxhbmd1YWdlXG4gICAgICogY2hvaWNlIGFjdHVhbGx5IGRyaXZlIHRoZSBkYXNoYm9hcmQgLyBjb25maWcgLyBtYXBwZXIgVUkgLS0gdGhlXG4gICAgICogc2lkZWJhciBzZWxlY3RvciB0aGF0IHVzZWQgdG8gbGl2ZSBpbiB0aGUgZGFzaGJvYXJkIGhlYWRlciBoYXNcbiAgICAgKiBiZWVuIHJlbW92ZWQgKDIwMjYtMDYtMjYpIGFuZCB0aGUgc2V0dXAgd2FsayBpcyBub3cgdGhlIHNpbmdsZVxuICAgICAqIHNvdXJjZSBvZiB0cnV0aCBmb3IgVUkgbGFuZ3VhZ2UuICovXG4gICAgY29uc3QgcGVyc2lzdEFuZFNhdmUgPSAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnaTE4bl9sYW5nJywgY2ZnLmxhbmcpO1xuICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdsYW5nY2hhbmdlJykpO1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdbc2V0dXAgd2Fsa10gaTE4bl9sYW5nIDwtJywgY2ZnLmxhbmcpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1tzZXR1cCB3YWxrXSBjb3VsZCBub3QgcGVyc2lzdCBsYW5ndWFnZTonLCBlKTtcbiAgICAgICAgfVxuICAgICAgICBvblNhdmUoKTtcbiAgICB9O1xuICAgIHJldHVybiAoXG4gICAgICAgIDxNb2RhbFNoZWxsIHRpdGxlPVwiTGFuZ3VhZ2UgU2V0dGluZ1wiIHN1YnRpdGxlPVwiUGljayB5b3VyIGRlZmF1bHQgaW50ZXJmYWNlIGxhbmd1YWdlXCIgYWNjZW50PVwiZW1lcmFsZFwiIG9uQ2xvc2U9e29uQ2xvc2V9IG9uU2F2ZT17cGVyc2lzdEFuZFNhdmV9PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC0zXCI+XG4gICAgICAgICAgICAgICAge2xhbmdzLm1hcChsID0+IChcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e2wuY29kZX0gb25DbGljaz17KCk9PnNldENmZyh7Li4uY2ZnLCBsYW5nOmwuY29kZX0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHRleHQtbGVmdCBwLTMgcm91bmRlZC14bCBib3JkZXItMiB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2NmZy5sYW5nID09PSBsLmNvZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JvcmRlci1lbWVyYWxkLTUwMCBiZy1lbWVyYWxkLTkwMC8yMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JvcmRlci1zbGF0ZS03MDAgYmctc2xhdGUtODAwLzQwIGhvdmVyOmJnLXNsYXRlLTgwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayB0ZXh0LXNsYXRlLTUwMFwiPntsLmNvZGV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1ibGFjayB0ZXh0LXNsYXRlLTIwMFwiPntsLm5hdGl2ZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTFweF0gdGV4dC1zbGF0ZS01MDBcIj57bC5sYWJlbH08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Nb2RhbFNoZWxsPlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFBsdWctaW4gU2V0dGluZyAtLSBtb2RhbCB3LyBsaXN0ICsgdXBsb2FkIHpvbmVcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbi8qIFBlci1wbHVnLWluIG1vY2sgY29uZmlndXJhdGlvbiBmaWVsZHMuICBLZXlzIG1hcCB0byBwbHVnLWluIGBpZGAuICovXG5jb25zdCBQTFVHSU5fQ09ORklHX0ZJRUxEUyA9IHtcbiAgICB3ZWF0aGVyOiAgICBbXG4gICAgICAgIHsga2V5Oidwcm92aWRlcicsICBsYWJlbDonUHJvdmlkZXInLCAgICAgICAgICB0eXBlOidzZWxlY3QnLCAgb3B0aW9uczpbJ09wZW4tTWV0ZW8nLCdOV1MnLCdFQ01XRiddLCBkZWY6J09wZW4tTWV0ZW8nIH0sXG4gICAgICAgIHsga2V5OidyZWZyZXNoJywgICBsYWJlbDonUmVmcmVzaCBpbnRlcnZhbCcsICB0eXBlOidzZWxlY3QnLCAgb3B0aW9uczpbJzEgbWluJywnNSBtaW4nLCcxNSBtaW4nLCczMCBtaW4nLCcxIGgnXSwgZGVmOicxNSBtaW4nIH0sXG4gICAgICAgIHsga2V5OidjYWNoZScsICAgICBsYWJlbDonQ2FjaGUgVFRMIChtaW4pJywgICB0eXBlOidudW1iZXInLCAgZGVmOjMwIH0sXG4gICAgXSxcbiAgICBnaXZvbmk6ICAgICBbXG4gICAgICAgIHsga2V5OidjbGltYXRlJywgICBsYWJlbDonQ2xpbWF0ZSBtb2RlbCcsICAgICB0eXBlOidzZWxlY3QnLCAgb3B0aW9uczpbJ0dpdm9uaSAxOTkyJywnQVNIUkFFIDU1JywnQWRhcHRpdmUnXSwgZGVmOidHaXZvbmkgMTk5MicgfSxcbiAgICAgICAgeyBrZXk6J21hc3NpdmUnLCAgIGxhYmVsOidIZWF2eXdlaWdodCBjb25zdHJ1Y3Rpb24nLCAgdHlwZTondG9nZ2xlJywgZGVmOmZhbHNlIH0sXG4gICAgXSxcbiAgICBzd2VldF9zcG90OiBbXG4gICAgICAgIHsga2V5Oid0cmFja2luZycsICBsYWJlbDonVHJhY2sgb3V0ZG9vciBSSCcsICB0eXBlOid0b2dnbGUnLCBkZWY6dHJ1ZSB9LFxuICAgICAgICB7IGtleTonaHlzdCcsICAgICAgbGFiZWw6J0h5c3RlcmVzaXMgKCUgUkgpJywgdHlwZTonbnVtYmVyJywgZGVmOjIgfSxcbiAgICBdLFxuICAgIGczNjogICAgICAgIFtcbiAgICAgICAgeyBrZXk6J21vZGUnLCAgICAgIGxhYmVsOidTZXF1ZW5jZSBtb2RlJywgICAgIHR5cGU6J3NlbGVjdCcsICBvcHRpb25zOlsnU2luZ2xlLXpvbmUgVkFWJywnTXVsdGktem9uZSBWQVYnLCdET0FTIHcvIEZDVSddLCBkZWY6J011bHRpLXpvbmUgVkFWJyB9LFxuICAgICAgICB7IGtleTondmVyYm9zZScsICAgbGFiZWw6J1ZlcmJvc2UgbG9nZ2luZycsICAgdHlwZTondG9nZ2xlJywgZGVmOmZhbHNlIH0sXG4gICAgXSxcbiAgICBkaWJ0OiAgICAgICBbXG4gICAgICAgIHsga2V5Oidob3N0JywgICAgICBsYWJlbDonQnJpZGdlIGhvc3QnLCAgICAgICB0eXBlOid0ZXh0JywgICBkZWY6JzE5Mi4xNjguMS4xMDAnIH0sXG4gICAgICAgIHsga2V5Oidwb3J0JywgICAgICBsYWJlbDonVGVsZWdyYW0gcG9ydCcsICAgICB0eXBlOidudW1iZXInLCBkZWY6NDc4MDggfSxcbiAgICAgICAgeyBrZXk6J3BvbGxfbXMnLCAgIGxhYmVsOidQb2xsIGludGVydmFsIChtcyknLHR5cGU6J251bWJlcicsIGRlZjoyMDAwIH0sXG4gICAgXSxcbiAgICBsaWdodGluZzogICBbXG4gICAgICAgIHsga2V5OidnYXRld2F5JywgICBsYWJlbDonTW9kYnVzIGdhdGV3YXkgSVAnLCB0eXBlOid0ZXh0JywgICBkZWY6JzEwLjAuMC41MCcgfSxcbiAgICAgICAgeyBrZXk6J3VuaXRfaWQnLCAgIGxhYmVsOidVbml0IElEJywgICAgICAgICAgIHR5cGU6J251bWJlcicsIGRlZjoxIH0sXG4gICAgICAgIHsga2V5Oid0Y3BfcG9ydCcsICBsYWJlbDonVENQIHBvcnQnLCAgICAgICAgICB0eXBlOidudW1iZXInLCBkZWY6NTAyIH0sXG4gICAgXSxcbn07XG5cbmZ1bmN0aW9uIFBsdWdpbnNNb2RhbCh7IGNmZywgc2V0Q2ZnLCBvbkNsb3NlLCBvblNhdmUgfSkge1xuICAgIGNvbnN0IEFMTCA9IFtcbiAgICAgICAgeyBpZDond2VhdGhlcicsICAgICBuYW1lOidXZWF0aGVyJywgICAgICAgICBkZXNjOidPcGVuLU1ldGVvIE9BIGZlZWQnLCAgICAgICAgICB2ZXI6JzIuMS4wJyB9LFxuICAgICAgICB7IGlkOidnaXZvbmknLCAgICAgIG5hbWU6J0dpdm9uaSBFbmdpbmUnLCAgIGRlc2M6J0NsaW1hdGUtc3RyYXRlZ3kgb3ZlcmxheScsICAgIHZlcjonMS4zLjQnIH0sXG4gICAgICAgIHsgaWQ6J3N3ZWV0X3Nwb3QnLCAgbmFtZTonU3dlZXQtU3BvdCBSSCcsICAgZGVzYzonQWRqdXN0YWJsZSBSSCBiYW5kJywgICAgICAgICAgdmVyOicxLjAuMScgfSxcbiAgICAgICAgeyBpZDonZzM2JywgICAgICAgICBuYW1lOidHMzYgU2VxdWVuY2VzJywgICBkZXNjOidBU0hSQUUgR3VpZGVsaW5lIDM2JywgICAgICAgICB2ZXI6JzAuOS4yJyB9LFxuICAgICAgICB7IGlkOidkaWJ0JywgICAgICAgIG5hbWU6J0RJQlQgQnJpZGdlJywgICAgIGRlc2M6J0RlbHRhIENvbnRyb2xzIChESUJUKSBCQUNuZXQgYnJpZGdlJywgICAgICAgICAgIHZlcjonMC40LjAnIH0sXG4gICAgICAgIHsgaWQ6J2xpZ2h0aW5nJywgICAgbmFtZTonTGlnaHRpbmcgKFJlZDUpJywgZGVzYzonVjMuMCBNb2RidXMgVENQIGNsaWVudCcsICAgICAgdmVyOicwLjEuMC1iZXRhJyB9LFxuICAgIF07XG4gICAgY29uc3QgdG9nZ2xlID0gKGlkKSA9PiBzZXRDZmcoYyA9PiAoe1xuICAgICAgICAuLi5jLFxuICAgICAgICBlbmFibGVkOiBjLmVuYWJsZWQuaW5jbHVkZXMoaWQpID8gYy5lbmFibGVkLmZpbHRlcih4ID0+IHggIT09IGlkKSA6IFsuLi5jLmVuYWJsZWQsIGlkXVxuICAgIH0pKTtcblxuICAgIC8qIGV4cGFuc2lvbiBzdGF0ZSDigJQgd2hpY2ggcGx1Zy1pbidzIFwiQ29uZmlndXJlXCIgcGFuZWwgaXMgb3BlbiAqL1xuICAgIGNvbnN0IFtleHBhbmRlZElkLCBzZXRFeHBhbmRlZElkXSA9IFJlYWN0LnVzZVN0YXRlKG51bGwpO1xuXG4gICAgY29uc3QgdXBkYXRlRmllbGQgPSAocGx1Z2luSWQsIGZpZWxkS2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgICBzZXRDZmcoYyA9PiAoe1xuICAgICAgICAgICAgLi4uYyxcbiAgICAgICAgICAgIGZpZWxkczogeyAuLi4oYy5maWVsZHMgfHwge30pLCBbcGx1Z2luSWRdOiB7IC4uLigoYy5maWVsZHMgfHwge30pW3BsdWdpbklkXSB8fCB7fSksIFtmaWVsZEtleV06IHZhbHVlIH0gfVxuICAgICAgICB9KSk7XG4gICAgfTtcblxuICAgIGNvbnN0IGZpZWxkVmFsID0gKHBsdWdpbklkLCBmaWVsZCkgPT4ge1xuICAgICAgICBjb25zdCBzdG9yZWQgPSBjZmcuZmllbGRzICYmIGNmZy5maWVsZHNbcGx1Z2luSWRdICYmIGNmZy5maWVsZHNbcGx1Z2luSWRdW2ZpZWxkLmtleV07XG4gICAgICAgIHJldHVybiBzdG9yZWQgIT09IHVuZGVmaW5lZCA/IHN0b3JlZCA6IGZpZWxkLmRlZjtcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPE1vZGFsU2hlbGwgdGl0bGU9XCJQbHVnLWluIFNldHRpbmdcIiBzdWJ0aXRsZT1cIkVuYWJsZSwgdXBsb2FkIG9yIG1vZGlmeSBwbHVnLWluc1wiIGFjY2VudD1cInBpbmtcIiBvbkNsb3NlPXtvbkNsb3NlfSBvblNhdmU9e29uU2F2ZX0gc2l6ZT1cIndpZGVcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0zIG1heC1oLVs2MHZoXSBvdmVyZmxvdy15LWF1dG8gcHItMVwiPlxuICAgICAgICAgICAgICAgIHtBTEwubWFwKHAgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvbiA9IGNmZy5lbmFibGVkLmluY2x1ZGVzKHAuaWQpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBleHBhbmRlZCA9IGV4cGFuZGVkSWQgPT09IHAuaWQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkcyA9IFBMVUdJTl9DT05GSUdfRklFTERTW3AuaWRdIHx8IFtdO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e3AuaWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHJvdW5kZWQteGwgYm9yZGVyIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7b24gPyAnYm9yZGVyLXBpbmstNTAwLzQwIGJnLXBpbmstOTAwLzEwJyA6ICdib3JkZXItc2xhdGUtNzAwIGJnLXNsYXRlLTgwMC80MCd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7ZXhwYW5kZWQgPyAncmluZy0xIHJpbmctcGluay01MDAvMzAnIDogJyd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcC0zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1ibGFjayB0ZXh0LXNsYXRlLTEwMFwiPntwLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibWwtMiB0ZXh0LVsxMHB4XSBmb250LW1vbm8gdGV4dC1zbGF0ZS01MDBcIj52e3AudmVyfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtc2xhdGUtNDAwXCI+e3AuZGVzY308L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gdG9nZ2xlKHAuaWQpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17YHBsdWdpbi10b2dnbGUtJHtwLmlkfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTMgcHktMSByb3VuZGVkLW1kIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayBib3JkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7b24gPyAnYm9yZGVyLXBpbmstNTAwLzYwIHRleHQtcGluay0zMDAgYmctcGluay05MDAvMzAnIDogJ2JvcmRlci1zbGF0ZS02MDAgdGV4dC1zbGF0ZS00MDAgYmctc2xhdGUtODAwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7b24gPyAnRW5hYmxlZCcgOiAnRGlzYWJsZWQnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHNldEV4cGFuZGVkSWQoZXhwYW5kZWQgPyBudWxsIDogcC5pZCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgcGx1Z2luLWNvbmZpZy0ke3AuaWR9YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHgtMyBweS0xIHJvdW5kZWQtbWQgdGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIGJvcmRlciB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtleHBhbmRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JvcmRlci1waW5rLTUwMCBiZy1waW5rLTkwMC8zMCB0ZXh0LXBpbmstMjAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JvcmRlci1zbGF0ZS02MDAgdGV4dC1zbGF0ZS00MDAgYmctc2xhdGUtODAwIGhvdmVyOmJnLXNsYXRlLTcwMCBob3Zlcjpib3JkZXItcGluay01MDAvNTAgaG92ZXI6dGV4dC1waW5rLTMwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2V4cGFuZGVkID8gJ0Nsb3NlIOKWtCcgOiAnQ29uZmlndXJlIOKWvid9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2V4cGFuZGVkICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJweC00IHBiLTQgYm9yZGVyLXQgYm9yZGVyLXBpbmstNTAwLzIwIGJnLXNsYXRlLTk1MC80MFwiIGRhdGEtdGVzdGlkPXtgcGx1Z2luLWNvbmZpZy1wYW5lbC0ke3AuaWR9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZmllbGRzLmxlbmd0aCA9PT0gMCA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtc2xhdGUtNTAwIGl0YWxpYyBweS0zXCI+Tm8gY29uZmlndXJhYmxlIG9wdGlvbnMgZm9yIHRoaXMgcGx1Zy1pbiB5ZXQuPC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbWQ6Z3JpZC1jb2xzLTIgZ2FwLTMgcHQtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZmllbGRzLm1hcChmID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHYgPSBmaWVsZFZhbChwLmlkLCBmKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e2Yua2V5fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwIGJsb2NrIG1iLTFcIj57Zi5sYWJlbH08L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi50eXBlID09PSAnc2VsZWN0JyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0IGN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3Z9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlRmllbGQocC5pZCwgZi5rZXksIGUudGFyZ2V0LnZhbHVlKX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2Yub3B0aW9ucy5tYXAobyA9PiA8b3B0aW9uIGtleT17b30gdmFsdWU9e299PntvfTwvb3B0aW9uPil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2YudHlwZSA9PT0gJ251bWJlcicgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJudW1iZXJcIiBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3Z9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGVGaWVsZChwLmlkLCBmLmtleSwgK2UudGFyZ2V0LnZhbHVlKX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi50eXBlID09PSAndGV4dCcgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt2fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlRmllbGQocC5pZCwgZi5rZXksIGUudGFyZ2V0LnZhbHVlKX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi50eXBlID09PSAndG9nZ2xlJyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHVwZGF0ZUZpZWxkKHAuaWQsIGYua2V5LCAhdil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHctZnVsbCBweS0yIHJvdW5kZWQtbGcgdGV4dC14cyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgYm9yZGVyIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3ZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1waW5rLTcwMC80MCBib3JkZXItcGluay01MDAvNjAgdGV4dC1waW5rLTIwMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1zbGF0ZS04MDAgYm9yZGVyLXNsYXRlLTYwMCB0ZXh0LXNsYXRlLTQwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3YgPyAnT04nIDogJ09GRid9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1lbmQgZ2FwLTIgbXQtNCBwdC0zIGJvcmRlci10IGJvcmRlci1zbGF0ZS04MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXNldCB0aGlzIHBsdWctaW4ncyBmaWVsZHMgdG8gZGVmYXVsdHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRDZmcoYyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHQgPSB7IC4uLihjLmZpZWxkcyB8fCB7fSkgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG5leHRbcC5pZF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IC4uLmMsIGZpZWxkczogbmV4dCB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTMgcHktMS41IHJvdW5kZWQtbWQgdGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIGJvcmRlciBib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtNDAwIGhvdmVyOmJnLXNsYXRlLTgwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXNldCBkZWZhdWx0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gc2V0RXhwYW5kZWRJZChudWxsKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTMgcHktMS41IHJvdW5kZWQtbWQgdGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIGJnLXBpbmstNjAwIGhvdmVyOmJnLXBpbmstNTAwIHRleHQtd2hpdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRG9uZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTUgcC00IGJvcmRlci0yIGJvcmRlci1kYXNoZWQgYm9yZGVyLXNsYXRlLTcwMCByb3VuZGVkLXhsIHRleHQtY2VudGVyIGhvdmVyOmJvcmRlci1waW5rLTUwMC80MCB0cmFuc2l0aW9uLWFsbCBjdXJzb3ItcG9pbnRlclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC0zeGwgbWItMVwiPuKktDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LWJsYWNrIHRleHQtc2xhdGUtMzAwXCI+RHJvcCBhIC5weSAvIC56aXAgLyAucmVkNSBwbHVnLWluIGhlcmU8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzExcHhdIHRleHQtc2xhdGUtNTAwIG10LTFcIj5vciBjbGljayB0byBjaG9vc2UgYSBmaWxlIChtb2NrIOKAlCBub3Qgd2lyZWQpPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Nb2RhbFNoZWxsPlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE1vZGFsIFNoZWxsIC0tIHNoYXJlZFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuZnVuY3Rpb24gTW9kYWxTaGVsbCh7IHRpdGxlLCBzdWJ0aXRsZSwgYWNjZW50PSdpbmRpZ28nLCBvbkNsb3NlLCBvblNhdmUsIHNpemU9JycsIGNoaWxkcmVuIH0pIHtcbiAgICBjb25zdCBjb2xvck1hcCA9IHtcbiAgICAgICAgaW5kaWdvOicjODE4Y2Y4JywgYW1iZXI6JyNmYmJmMjQnLCBlbWVyYWxkOicjMzRkMzk5JywgcGluazonI2Y0NzJiNidcbiAgICB9O1xuICAgIGNvbnN0IGMgPSBjb2xvck1hcFthY2NlbnRdIHx8ICcjODE4Y2Y4JztcbiAgICBjb25zdCBzaXplTWFwID0ge1xuICAgICAgICB3aWRlOiAnbWF4LXctMnhsJyxcbiAgICAgICAgbWFwOiAgJ21heC13LTN4bCcsXG4gICAgICAgIG1heDogICdtYXgtdy1bOTZ2d10gdy1bOTZ2d10gaC1bOTJ2aF0nLFxuICAgIH07XG4gICAgY29uc3Qgd2lkdGggPSBzaXplTWFwW3NpemVdIHx8ICdtYXgtdy1tZCc7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaXhlZCBpbnNldC0wIHotNTAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgbW9kYWwtYmFja2Ryb3BcIiBvbkNsaWNrPXtvbkNsb3NlfT5cbiAgICAgICAgICAgIHsvKiBGbGV4LWNvbHVtbiBzaGVsbDogaGVhZGVyIChmaXhlZCkgKyBzY3JvbGxhYmxlIGNvbnRlbnQgKyBzdGlja3kgZm9vdGVyLlxuICAgICAgICAgICAgICAgIENyaXRpY2FsIGZvciBzaXplPVwibWF4XCIgd2hlcmUgY2hpbGRyZW4gYWxvbmUgZXhjZWVkIHRoZSBtb2RhbCBoZWlnaHRcbiAgICAgICAgICAgICAgICBhbmQgd291bGQgb3RoZXJ3aXNlIHB1c2ggdGhlIFNhdmUgJiByZXR1cm4gYnV0dG9uIGJlbG93IHRoZSB2aWV3cG9ydC4gKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YGJnLXNsYXRlLTkwMCBib3JkZXItMiByb3VuZGVkLTJ4bCB3LWZ1bGwgJHt3aWR0aH0gbXgtNCBmYWRlLXVwIGZsZXggZmxleC1jb2xgfVxuICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX1cbiAgICAgICAgICAgICAgICAgc3R5bGU9e3tib3JkZXJDb2xvcjpgJHtjfTY2YCwgbWF4SGVpZ2h0OiAnOTJ2aCd9fT5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtc3RhcnQganVzdGlmeS1iZXR3ZWVuIHAtNiBwYi00IGJvcmRlci1iIGJvcmRlci1zbGF0ZS04MDAvNjAgc2hyaW5rLTBcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LWxnIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdFwiIHN0eWxlPXt7Y29sb3I6Y319Pnt0aXRsZX08L2gzPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXNsYXRlLTUwMCBtdC0xXCI+e3N1YnRpdGxlfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJtb2RhbC1jbG9zZVwiIG9uQ2xpY2s9e29uQ2xvc2V9IGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNTAwIGhvdmVyOnRleHQtd2hpdGUgdGV4dC0yeGwgbGVhZGluZy1ub25lXCI+w5c8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMSBtaW4taC0wIG92ZXJmbG93LXktYXV0byBweC02IHB5LTVcIj5cbiAgICAgICAgICAgICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1lbmQgZ2FwLTMgcHgtNiBweS00IGJvcmRlci10IGJvcmRlci1zbGF0ZS04MDAgc2hyaW5rLTAgYmctc2xhdGUtOTAwIHJvdW5kZWQtYi0yeGxcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cIm1vZGFsLWNhbmNlbFwiIG9uQ2xpY2s9e29uQ2xvc2V9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtNCBweS0yIHJvdW5kZWQtbGcgYmctc2xhdGUtODAwIGJvcmRlciBib3JkZXItc2xhdGUtNzAwIHRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIHRleHQtc2xhdGUtNDAwIGhvdmVyOmJnLXNsYXRlLTcwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgQ2FuY2VsXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwibW9kYWwtc2F2ZVwiIG9uQ2xpY2s9e29uU2F2ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC01IHB5LTIgcm91bmRlZC1sZyB0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayB0ZXh0LXdoaXRlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6YywgYm94U2hhZG93OmAwIDAgMTJweCAke2N9NTVgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICBTYXZlICYgcmV0dXJuIOKck1xuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG4vKiBtb3VudCAqL1xuUmVhY3RET00uY3JlYXRlUm9vdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpKS5yZW5kZXIoPEFwcC8+KTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUFBLE1BQUEsR0FBOEJDLEtBQUs7RUFBM0JDLFFBQVEsR0FBQUYsTUFBQSxDQUFSRSxRQUFRO0VBQUVDLE9BQU8sR0FBQUgsTUFBQSxDQUFQRyxPQUFPOztBQUV6QjtBQUNBO0FBQ0E7QUFDQSxJQUFNQyxLQUFLLEdBQUcsQ0FDVjtFQUFFQyxHQUFHLEVBQUMsS0FBSztFQUFPQyxLQUFLLEVBQUMsbUJBQW1CO0VBQUtDLEdBQUcsRUFBQyxnQ0FBZ0M7RUFBRUMsSUFBSSxFQUFDLE1BQU07RUFBR0MsU0FBUyxFQUFDLFNBQVM7RUFBRUMsTUFBTSxFQUFDO0FBQVMsQ0FBQyxFQUMxSTtFQUFFTCxHQUFHLEVBQUMsVUFBVTtFQUFFQyxLQUFLLEVBQUMsa0JBQWtCO0VBQU1DLEdBQUcsRUFBQyx3QkFBd0I7RUFBVUMs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QUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRVAsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRUEsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0VBQzdGLElBQU1tQixHQUFHLEdBQUksQ0FBQyxHQUFHWixJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFUCxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFQSxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7RUFDN0YsSUFBTW9CLElBQUksR0FBRyxDQUFDLEdBQUdiLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUVQLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRUEsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUNoRSxDQUFDLEVBQUUsRUFBRUEsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFQSxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7RUFFM0UsSUFBTXFCLFVBQVUsR0FBRyxFQUFFO0VBQUUsS0FBSyxJQUFJeEIsR0FBQyxHQUFDLEVBQUUsRUFBRUEsR0FBQyxJQUFFLElBQUksRUFBRUEsR0FBQyxJQUFFLEdB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