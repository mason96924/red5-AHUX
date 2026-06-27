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
var STEPS = [/* Walk order is the pentagon traversal: top → upper-right → lower-right → lower-left → upper-left */
{
  key: 'psy',
  label: 'Psy Chart Setting',
  sub: 'Givoni · RH range · axis',
  kind: 'page',
  iconColor: '#818cf8',
  accent: 'indigo'
}, {
  key: 'location',
  label: 'Location Setting',
  sub: 'City · lat / long',
  kind: 'modal',
  iconColor: '#fbbf24',
  accent: 'amber'
}, {
  key: 'language',
  label: 'Language Setting',
  sub: 'EN · CS · CT · JP · KO · …',
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
},
/* 5th vertex: Update / Repair -- jumps to /update.html (Repair Mode) which exists on
   both V1.9 and V2.0.  Opens in a new tab so the operator can flash a plugin or apply
   an OTA without losing their Setup Walk progress. */
{
  key: 'repair',
  label: 'Update & Repair',
  sub: 'Plug-in flash · controller OTA',
  kind: 'link',
  iconColor: '#fb7185',
  accent: 'rose',
  href: '/update.html'
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
      plugins: false,
      repair: false
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
  }, completeCount, "/5 DONE"), /*#__PURE__*/React.createElement("a", {
    href: "/dashboard.html",
    onClick: () => {
      try {
        localStorage.setItem('red5.setup.done', '1');
      } catch (e) {}
    },
    className: "text-xs text-slate-500 hover:text-slate-300 underline underline-offset-4"
  }, "Skip all \u2192"))), /*#__PURE__*/React.createElement("div", {
    className: "relative mx-auto fade-up",
    style: {
      width: 'min(760px, 92vw)',
      aspectRatio: '1 / 1',
      animationDelay: '.08s'
    }
  }, STEPS.map((s, i) => {
    var angleDeg = -90 + i * 72;
    var angle = angleDeg * Math.PI / 180;
    var r = 40; // % of container half-side
    var x = 50 + r * Math.cos(angle); // %
    var y = 50 + r * Math.sin(angle); // %
    return /*#__PURE__*/React.createElement(CircleTile, {
      key: s.key,
      step: s,
      done: done[s.key],
      index: i + 1,
      leftPct: x,
      topPct: y,
      onClick: () => {
        if (s.kind === 'page') setRoute(s.key);else if (s.kind === 'link') window.open(s.href, '_blank', 'noopener');else setModal(s.key);
      }
    });
  }), /*#__PURE__*/React.createElement("svg", {
    className: "absolute inset-0 w-full h-full pointer-events-none",
    viewBox: "0 0 100 100",
    preserveAspectRatio: "none",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: "40",
    fill: "none",
    stroke: "rgba(148,163,184,0.22)",
    strokeWidth: "0.56",
    strokeDasharray: "1.4 1.4"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "max-w-5xl mx-auto mt-10 flex items-center justify-between fade-up",
    style: {
      animationDelay: '.18s'
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500 text-xs font-mono"
  }, completeCount === 0 && '↑ Pick a setting to start, or skip all and go straight to the dashboard.', completeCount > 0 && completeCount < 5 && "\u2191 ".concat(5 - completeCount, " step").concat(5 - completeCount === 1 ? '' : 's', " remaining (optional)."), completeCount === 5 && '✓ All steps configured.  Ready when you are.'), /*#__PURE__*/React.createElement("a", {
    href: "/dashboard.html",
    onClick: () => {
      try {
        localStorage.setItem('red5.setup.done', '1');
      } catch (e) {}
    },
    className: "px-7 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all\n                              ".concat(completeCount === 5 ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20')
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
 * Tile (large easy-on-eyes button) -- kept for back-compat, no longer used
 * by the pentagon hub.
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

/* =========================================================================
 * CircleTile -- pentagon-corner round button.  Sized in % of its container
 * so the whole layout scales with viewport.  Each circle is anchored by its
 * centre (translate -50%/-50%) on the polar-computed (left%, top%).
 * ========================================================================= */
function CircleTile(_ref2) {
  var step = _ref2.step,
    done = _ref2.done,
    index = _ref2.index,
    leftPct = _ref2.leftPct,
    topPct = _ref2.topPct,
    onClick = _ref2.onClick;
  /* Thick coloured ring per tile -- each step keeps its accent colour
   * (indigo/amber/emerald/pink/rose), reinforcing the colour-coded SVG
   * icon and the heading text. */
  var ringColor = step.iconColor;
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    "data-testid": "setup-tile-".concat(step.key),
    "aria-label": "Open ".concat(step.label),
    className: "circle-tile group absolute rounded-full text-center\n                            flex flex-col items-center justify-center\n                            transition-all duration-200\n                            ".concat(done ? 'bg-slate-900/80 shadow-[0_0_30px_-6px_rgba(16,185,129,0.55)]' : 'bg-slate-900/70 hover:bg-slate-800/90'),
    style: {
      left: "".concat(leftPct, "%"),
      top: "".concat(topPct, "%"),
      width: 'min(35%, 260px)',
      aspectRatio: '1/1',
      transform: 'translate(-50%, -50%)',
      border: "10px solid ".concat(ringColor),
      boxShadow: "0 0 0 1px ".concat(ringColor, "33, 0 8px 28px -8px ").concat(ringColor, "55")
    }
  }, done && /*#__PURE__*/React.createElement("span", {
    "data-testid": "setup-tile-".concat(step.key, "-done"),
    className: "absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center font-bold shadow"
  }, "\u2713"), /*#__PURE__*/React.createElement("div", {
    className: "rounded-xl flex items-center justify-center mb-1",
    style: {
      width: '34%',
      aspectRatio: '1/1',
      background: "".concat(step.iconColor, "22"),
      border: "1px solid ".concat(step.iconColor, "55")
    }
  }, /*#__PURE__*/React.createElement(TileIcon, {
    kind: step.key,
    color: step.iconColor
  })), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] font-black text-slate-600 tracking-wider"
  }, "0", index), /*#__PURE__*/React.createElement("h3", {
    className: "text-[11px] sm:text-[12px] font-black uppercase tracking-wider px-2 leading-tight mt-0.5",
    style: {
      color: step.iconColor
    }
  }, step.label), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500 text-[9px] sm:text-[10px] leading-snug px-2 mt-0.5 line-clamp-2"
  }, step.sub));
}
function TileIcon(_ref3) {
  var kind = _ref3.kind,
    color = _ref3.color;
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
  /* Update & Repair -- wrench + tiny gear bump, signalling "tools" */
  if (kind === 'repair') return /*#__PURE__*/React.createElement("svg", _extends({
    width: "22",
    height: "22",
    viewBox: "0 0 24 24"
  }, stroke), /*#__PURE__*/React.createElement("path", {
    d: "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.8 2.8L13 11l-1.1-1.9 2.8-2.8z"
  }));
  return null;
}

/* =========================================================================
 * Psy Chart Setting -- FULL PAGE, live skeleton responds to controls
 * ========================================================================= */
function PsyChartSettingPage(_ref4) {
  var cfg = _ref4.cfg,
    setCfg = _ref4.setCfg,
    onBack = _ref4.onBack,
    onSave = _ref4.onSave;
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
function PsySkeleton(_ref5) {
  var cfg = _ref5.cfg;
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
function PsyControlPanel(_ref6) {
  var cfg = _ref6.cfg,
    update = _ref6.update,
    setCfg = _ref6.setCfg;
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
function LocationModal(_ref7) {
  var cfg = _ref7.cfg,
    setCfg = _ref7.setCfg,
    onClose = _ref7.onClose,
    onSave = _ref7.onSave;
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
    var _ref9 = _asyncToGenerator(function* (q) {
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
      return _ref9.apply(this, arguments);
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
    var _ref0 = _asyncToGenerator(function* (lat, lon) {
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
      return _ref0.apply(this, arguments);
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
    var _ref1 = _asyncToGenerator(function* () {
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
      return _ref1.apply(this, arguments);
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
function LanguageModal(_ref10) {
  var cfg = _ref10.cfg,
    setCfg = _ref10.setCfg,
    onClose = _ref10.onClose,
    onSave = _ref10.onSave;
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
function PluginsModal(_ref11) {
  var cfg = _ref11.cfg,
    setCfg = _ref11.setCfg,
    onClose = _ref11.onClose,
    onSave = _ref11.onSave;
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
function ModalShell(_ref12) {
  var title = _ref12.title,
    subtitle = _ref12.subtitle,
    _ref12$accent = _ref12.accent,
    accent = _ref12$accent === void 0 ? 'indigo' : _ref12$accent,
    onClose = _ref12.onClose,
    onSave = _ref12.onSave,
    _ref12$size = _ref12.size,
    size = _ref12$size === void 0 ? '' : _ref12$size,
    children = _ref12.children;
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBfd2Fsay5jb21waWxlZC5qcyIsIm5hbWVzIjpbIl9SZWFjdCIsIlJlYWN0IiwidXNlU3RhdGUiLCJ1c2VNZW1vIiwiU1RFUFMiLCJrZXkiLCJsYWJlbCIsInN1YiIsImtpbmQiLCJpY29uQ29sb3IiLCJhY2NlbnQiLCJocmVmIiwiQXBwIiwiX3VzZVN0YXRlIiwicHN5IiwibG9jYXRpb24iLCJsYW5ndWFnZSIsInBsdWdpbnMiLCJyZXBhaXIiLCJfdXNlU3RhdGUyIiwiX3NsaWNlZFRvQXJyYXkiLCJkb25lIiwic2V0RG9uZSIsIl91c2VTdGF0ZTMiLCJfdXNlU3RhdGU0Iiwicm91dGUiLCJzZXRSb3V0ZSIsIl91c2VTdGF0ZTUiLCJfdXNlU3RhdGU2IiwibW9kYWwiLCJzZXRNb2RhbCIsIl91c2VTdGF0ZTciLCJnaXZvbmkiLCJyaFByZXNldCIsInJoTG8iLCJyaEhpIiwidExvIiwidEhpIiwidGhlbWUiLCJkYXJrTGV2ZWwiLCJfdXNlU3RhdGU4IiwicHN5Q2ZnIiwic2V0UHN5Q2ZnIiwiX3VzZVN0YXRlOSIsInNpdGVOYW1lIiwiY2l0eSIsImxhdCIsImxvbiIsIl91c2VTdGF0ZTAiLCJsb2NDZmciLCJzZXRMb2NDZmciLCJfdXNlU3RhdGUxIiwidiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJhbGxvd2VkIiwiaW5kZXhPZiIsImxhbmciLCJlIiwiX3VzZVN0YXRlMTAiLCJsYW5nQ2ZnIiwic2V0TGFuZ0NmZyIsIl91c2VTdGF0ZTExIiwiZW5hYmxlZCIsIl91c2VTdGF0ZTEyIiwicGx1Z2luQ2ZnIiwic2V0UGx1Z2luQ2ZnIiwiY29tcGxldGVDb3VudCIsIk9iamVjdCIsInZhbHVlcyIsImZpbHRlciIsIkJvb2xlYW4iLCJsZW5ndGgiLCJmaW5pc2giLCJkIiwiX29iamVjdFNwcmVhZCIsImNyZWF0ZUVsZW1lbnQiLCJQc3lDaGFydFNldHRpbmdQYWdlIiwiY2ZnIiwic2V0Q2ZnIiwib25CYWNrIiwib25TYXZlIiwiY2xhc3NOYW1lIiwib25DbGljayIsInNldEl0ZW0iLCJzdHlsZSIsIndpZHRoIiwiYXNwZWN0UmF0aW8iLCJhbmltYXRpb25EZWxheSIsIm1hcCIsInMiLCJpIiwiYW5nbGVEZWciLCJhbmdsZSIsIk1hdGgiLCJQSSIsInIiLCJ4IiwiY29zIiwieSIsInNpbiIsIkNpcmNsZVRpbGUiLCJzdGVwIiwiaW5kZXgiLCJsZWZ0UGN0IiwidG9wUGN0Iiwid2luZG93Iiwib3BlbiIsInZpZXdCb3giLCJwcmVzZXJ2ZUFzcGVjdFJhdGlvIiwiY3giLCJjeSIsImZpbGwiLCJzdHJva2UiLCJzdHJva2VXaWR0aCIsInN0cm9rZURhc2hhcnJheSIsImNvbmNhdCIsIkxvY2F0aW9uTW9kYWwiLCJvbkNsb3NlIiwiTGFuZ3VhZ2VNb2RhbCIsIlBsdWdpbnNNb2RhbCIsIlRpbGUiLCJfcmVmIiwiYmFja2dyb3VuZCIsImJvcmRlciIsIlRpbGVJY29uIiwiY29sb3IiLCJfcmVmMiIsInJpbmdDb2xvciIsImxlZnQiLCJ0b3AiLCJ0cmFuc2Zvcm0iLCJib3hTaGFkb3ciLCJfcmVmMyIsInN0cm9rZUxpbmVjYXAiLCJzdHJva2VMaW5lam9pbiIsIl9leHRlbmRzIiwiaGVpZ2h0IiwiX3JlZjQiLCJ1cGRhdGUiLCJrIiwiYyIsInVzZUVmZmVjdCIsInJhdyIsInByZXNldCIsInBhdGNoIiwicCIsIkpTT04iLCJwYXJzZSIsIk51bWJlciIsImlzRmluaXRlIiwibG8iLCJoaSIsIlJIX1BSRVNFVFMiLCJmaW5kIiwiaWQiLCJ0aCIsImRsIiwicGFyc2VGbG9hdCIsInRyUmF3IiwidHIiLCJtaW4iLCJtYXgiLCJrZXlzIiwicGVyc2lzdEFuZFNhdmUiLCJzdHJpbmdpZnkiLCJTdHJpbmciLCJkaXNwYXRjaEV2ZW50IiwiQ3VzdG9tRXZlbnQiLCJkZXRhaWwiLCJjb25zb2xlIiwiaW5mbyIsIndhcm4iLCJQc3lTa2VsZXRvbiIsIlBzeUNvbnRyb2xQYW5lbCIsIm5vdGUiLCJfcmVmNSIsIlciLCJIIiwicGFkIiwicmlnaHQiLCJib3R0b20iLCJncmlkVyIsImdyaWRIIiwiVF9NSU4iLCJUX01BWCIsIldfTUlOIiwiV19NQVgiLCJ0IiwidyIsIl9nZXRXIiwiZ2V0VyIsInJoIiwic2FmZVB0cyIsImFyciIsInRvRml4ZWQiLCJqb2luIiwicmg4MCIsInB1c2giLCJyaDEwMCIsInJoMjBMaW5lIiwicmgyMF9DWiIsIkNaIiwicmhIaV90b3AiLCJ0dCIsInJoTG9fYm90IiwiU1dFRVQiLCJOViIsIk1hc3MiLCJNQ1YiLCJFVkFQIiwid2ludGVyUkg4MCIsIndpbnRlclJIMjAiLCJXSU5URVIiLCJpc29wbGV0aHMiLCJpc0xpZ2h0IiwicGFsZXR0ZSIsImJnIiwiZ3JpZCIsInRpY2siLCJheGlzIiwicGFuZWxCZyIsInBhbmVsQm9yZGVyIiwicGlsbEJnIiwicGlsbEZnIiwibWV0YUZnIiwiZGltRmlsdGVyIiwiYm9yZGVyQ29sb3IiLCJib3JkZXJSYWRpdXMiLCJBcnJheSIsImZyb20iLCJfIiwieDEiLCJ5MSIsIngyIiwieTIiLCJmb250U2l6ZSIsInRleHRBbmNob3IiLCJwdHMiLCJ3dyIsInBvaW50cyIsImZsb29yIiwiZm9udFdlaWdodCIsIm9wYWNpdHkiLCJmaWxsT3BhY2l0eSIsImNsaXBQYXRoVW5pdHMiLCJjbGlwUGF0aCIsImxldHRlclNwYWNpbmciLCJwYWludE9yZGVyIiwiX3JlZjYiLCJyb3VuZCIsInR5cGUiLCJ2YWx1ZSIsIm9uQ2hhbmdlIiwidGFyZ2V0IiwiYWNjZW50Q29sb3IiLCJfbm9ybWFsaXplTG9jcyIsInNlZW4iLCJTZXQiLCJvdXQiLCJsIiwibmFtZSIsInRyaW0iLCJoYXMiLCJhZGQiLCJfcmVmNyIsIm1hcEJveFJlZiIsInVzZVJlZiIsIm1hcFJlZiIsIm1hcmtlclJlZiIsIl9SZWFjdCR1c2VTdGF0ZSIsIl9SZWFjdCR1c2VTdGF0ZTIiLCJnZW9CdXN5Iiwic2V0R2VvQnVzeSIsIl9SZWFjdCR1c2VTdGF0ZTMiLCJpc0FycmF5IiwiX1JlYWN0JHVzZVN0YXRlNCIsInNhdmVkTG9jcyIsInNldFNhdmVkTG9jcyIsImNhbmNlbGxlZCIsIl9hc3luY1RvR2VuZXJhdG9yIiwiZmV0Y2giLCJjcmVkZW50aWFscyIsImNhY2hlIiwib2siLCJqIiwianNvbiIsInNhdmVkIiwiX1JlYWN0JHVzZVN0YXRlNSIsIl9SZWFjdCR1c2VTdGF0ZTYiLCJzYXZlZE9wZW4iLCJzZXRTYXZlZE9wZW4iLCJzYXZlZFJlZiIsIm9uRG9jQ2xpY2siLCJjdXJyZW50IiwiY29udGFpbnMiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwib25TaXRlTmFtZUNoYW5nZSIsIm5ld05hbWUiLCJoaXQiLCJzZXRWaWV3IiwicGlja1NhdmVkTG9jIiwibG9jIiwiX1JlYWN0JHVzZVN0YXRlNyIsIl9SZWFjdCR1c2VTdGF0ZTgiLCJzZWFyY2hRIiwic2V0U2VhcmNoUSIsIl9SZWFjdCR1c2VTdGF0ZTkiLCJfUmVhY3QkdXNlU3RhdGUwIiwic2VhcmNoSGl0cyIsInNldFNlYXJjaEhpdHMiLCJfUmVhY3QkdXNlU3RhdGUxIiwiX1JlYWN0JHVzZVN0YXRlMTAiLCJzZWFyY2hCdXN5Iiwic2V0U2VhcmNoQnVzeSIsIl9SZWFjdCR1c2VTdGF0ZTExIiwiX1JlYWN0JHVzZVN0YXRlMTIiLCJzZWFyY2hPcGVuIiwic2V0U2VhcmNoT3BlbiIsInNlYXJjaERlYm91bmNlUmVmIiwicnVuU2VhcmNoIiwiX3JlZjkiLCJxIiwidXJsIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiaGVhZGVycyIsIl94IiwiYXBwbHkiLCJhcmd1bWVudHMiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwicGlja1NlYXJjaEhpdCIsImRpc3BsYXlfbmFtZSIsInJldmVyc2VHZW9jb2RlIiwiX3JlZjAiLCJhIiwiYWRkcmVzcyIsInRvd24iLCJ2aWxsYWdlIiwiaGFtbGV0IiwiY291bnR5IiwicmVnaW9uIiwic3RhdGUiLCJjb3VudHJ5IiwiX3gyIiwiX3gzIiwiTCIsInpvb21Db250cm9sIiwiYXR0cmlidXRpb25Db250cm9sIiwidGlsZUxheWVyIiwibWF4Wm9vbSIsImF0dHJpYnV0aW9uIiwiYWRkVG8iLCJtYXJrZXIiLCJkcmFnZ2FibGUiLCJiaW5kVG9vbHRpcCIsInBlcm1hbmVudCIsImFwcGx5TGF0TG9uIiwibiIsIm9uIiwibGwiLCJnZXRMYXRMbmciLCJsbmciLCJzZXRMYXRMbmciLCJsYXRsbmciLCJpbnZhbGlkYXRlU2l6ZSIsInJlbW92ZSIsInBhblRvIiwiX1JlYWN0JHVzZVN0YXRlMTMiLCJfUmVhY3QkdXNlU3RhdGUxNCIsImdlb1N0YXRlIiwic2V0R2VvU3RhdGUiLCJ1c2VNeUxvY2F0aW9uIiwibmF2aWdhdG9yIiwiZ2VvbG9jYXRpb24iLCJlcnIiLCJnZXRDdXJyZW50UG9zaXRpb24iLCJwb3MiLCJjb29yZHMiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsIm1zZyIsImNvZGUiLCJtZXNzYWdlIiwiZW5hYmxlSGlnaEFjY3VyYWN5IiwidGltZW91dCIsIm1heGltdW1BZ2UiLCJfUmVhY3QkdXNlU3RhdGUxNSIsIl9SZWFjdCR1c2VTdGF0ZTE2Iiwic2F2ZU1zZyIsInNldFNhdmVNc2ciLCJfcmVmMSIsImRlZHVwZWQiLCJuZXh0U2F2ZWQiLCJzbGljZSIsInBlcnNpc3RlZCIsIndhcm5pbmciLCJtZXRob2QiLCJib2R5IiwiYWN0aXZlIiwiZGVmYXVsdCIsIl9sYXN0V2VhdGhlckxvY2F0aW9uU2F2ZSIsIk1vZGFsU2hlbGwiLCJ0aXRsZSIsInN1YnRpdGxlIiwic2l6ZSIsIm1pbkhlaWdodCIsInJlZiIsIm92ZXJmbG93Iiwib25Gb2N1cyIsInBsYWNlaG9sZGVyIiwib3V0bGluZSIsImgiLCJwbGFjZV9pZCIsImNsYXNzIiwidHJhbnNpdGlvbiIsImlzQWN0aXZlIiwiZGlzYWJsZWQiLCJwcm90b2NvbCIsInoiLCJfcmVmMTAiLCJsYW5ncyIsIm5hdGl2ZSIsIkV2ZW50IiwiUExVR0lOX0NPTkZJR19GSUVMRFMiLCJ3ZWF0aGVyIiwib3B0aW9ucyIsImRlZiIsInN3ZWV0X3Nwb3QiLCJnMzYiLCJkaWJ0IiwibGlnaHRpbmciLCJfcmVmMTEiLCJBTEwiLCJkZXNjIiwidmVyIiwidG9nZ2xlIiwiaW5jbHVkZXMiLCJfUmVhY3QkdXNlU3RhdGUxNyIsIl9SZWFjdCR1c2VTdGF0ZTE4IiwiZXhwYW5kZWRJZCIsInNldEV4cGFuZGVkSWQiLCJ1cGRhdGVGaWVsZCIsInBsdWdpbklkIiwiZmllbGRLZXkiLCJmaWVsZHMiLCJmaWVsZFZhbCIsImZpZWxkIiwic3RvcmVkIiwidW5kZWZpbmVkIiwiZXhwYW5kZWQiLCJmIiwibyIsIm5leHQiLCJfcmVmMTIiLCJfcmVmMTIkYWNjZW50IiwiX3JlZjEyJHNpemUiLCJjaGlsZHJlbiIsImNvbG9yTWFwIiwiaW5kaWdvIiwiYW1iZXIiLCJlbWVyYWxkIiwicGluayIsInNpemVNYXAiLCJ3aWRlIiwic3RvcFByb3BhZ2F0aW9uIiwibWF4SGVpZ2h0IiwiUmVhY3RET00iLCJjcmVhdGVSb290IiwiZ2V0RWxlbWVudEJ5SWQiLCJyZW5kZXIiXSwic291cmNlcyI6WyIuLi9zcmMvc2V0dXAtd2Fsay9zZXR1cF93YWxrLmpzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB7IHVzZVN0YXRlLCB1c2VNZW1vIH0gPSBSZWFjdDtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogU1RFUCBERUZJTklUSU9OUyDigJQgdGhlIDQgd2FsayBwYXRocyB0aGUgdXNlciBkZXNjcmliZWRcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmNvbnN0IFNURVBTID0gW1xuICAgIC8qIFdhbGsgb3JkZXIgaXMgdGhlIHBlbnRhZ29uIHRyYXZlcnNhbDogdG9wIOKGkiB1cHBlci1yaWdodCDihpIgbG93ZXItcmlnaHQg4oaSIGxvd2VyLWxlZnQg4oaSIHVwcGVyLWxlZnQgKi9cbiAgICB7IGtleToncHN5JywgICAgICBsYWJlbDonUHN5IENoYXJ0IFNldHRpbmcnLCAgICBzdWI6J0dpdm9uaSDCtyBSSCByYW5nZSDCtyBheGlzJywgIGtpbmQ6J3BhZ2UnLCAgaWNvbkNvbG9yOicjODE4Y2Y4JywgYWNjZW50OidpbmRpZ28nIH0sXG4gICAgeyBrZXk6J2xvY2F0aW9uJywgbGFiZWw6J0xvY2F0aW9uIFNldHRpbmcnLCAgICAgc3ViOidDaXR5IMK3IGxhdCAvIGxvbmcnLCAgICAgICAgIGtpbmQ6J21vZGFsJywgaWNvbkNvbG9yOicjZmJiZjI0JywgYWNjZW50OidhbWJlcicgIH0sXG4gICAgeyBrZXk6J2xhbmd1YWdlJywgbGFiZWw6J0xhbmd1YWdlIFNldHRpbmcnLCAgICAgc3ViOidFTiDCtyBDUyDCtyBDVCDCtyBKUCDCtyBLTyDCtyDigKYnLCBraW5kOidtb2RhbCcsIGljb25Db2xvcjonIzM0ZDM5OScsIGFjY2VudDonZW1lcmFsZCd9LFxuICAgIHsga2V5OidwbHVnaW5zJywgIGxhYmVsOidQbHVnLWluIFNldHRpbmcnLCAgICAgIHN1YjonTGlzdCDCtyB1cGxvYWQgwrcgbW9kaWZ5JywgICAga2luZDonbW9kYWwnLCBpY29uQ29sb3I6JyNmNDcyYjYnLCBhY2NlbnQ6J3BpbmsnICAgfSxcbiAgICAvKiA1dGggdmVydGV4OiBVcGRhdGUgLyBSZXBhaXIgLS0ganVtcHMgdG8gL3VwZGF0ZS5odG1sIChSZXBhaXIgTW9kZSkgd2hpY2ggZXhpc3RzIG9uXG4gICAgICAgYm90aCBWMS45IGFuZCBWMi4wLiAgT3BlbnMgaW4gYSBuZXcgdGFiIHNvIHRoZSBvcGVyYXRvciBjYW4gZmxhc2ggYSBwbHVnaW4gb3IgYXBwbHlcbiAgICAgICBhbiBPVEEgd2l0aG91dCBsb3NpbmcgdGhlaXIgU2V0dXAgV2FsayBwcm9ncmVzcy4gKi9cbiAgICB7IGtleToncmVwYWlyJywgICBsYWJlbDonVXBkYXRlICYgUmVwYWlyJywgICAgICBzdWI6J1BsdWctaW4gZmxhc2ggwrcgY29udHJvbGxlciBPVEEnLCBraW5kOidsaW5rJywgaWNvbkNvbG9yOicjZmI3MTg1JywgYWNjZW50Oidyb3NlJywgaHJlZjonL3VwZGF0ZS5odG1sJyB9LFxuXTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogUk9PVCBBUFBcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIEFwcCgpIHtcbiAgICAvKiBjb21wbGV0aW9uICsgcGVyLXN0ZXAgY29uZmlnIC0tIG1vY2t1cCBzdGF0ZSwgbmV2ZXIgcGVyc2lzdGVkICovXG4gICAgY29uc3QgW2RvbmUsIHNldERvbmVdID0gdXNlU3RhdGUoeyBwc3k6ZmFsc2UsIGxvY2F0aW9uOmZhbHNlLCBsYW5ndWFnZTpmYWxzZSwgcGx1Z2luczpmYWxzZSwgcmVwYWlyOmZhbHNlIH0pO1xuICAgIGNvbnN0IFtyb3V0ZSwgc2V0Um91dGVdID0gdXNlU3RhdGUoJ2h1YicpOyAgIC8vICdodWInIHwgJ3BzeSdcbiAgICBjb25zdCBbbW9kYWwsIHNldE1vZGFsXSA9IHVzZVN0YXRlKG51bGwpOyAgICAgLy8gJ2xvY2F0aW9uJyB8ICdsYW5ndWFnZScgfCAncGx1Z2lucycgfCBudWxsXG5cbiAgICBjb25zdCBbcHN5Q2ZnLCBzZXRQc3lDZmddICAgICAgICAgPSB1c2VTdGF0ZSh7IGdpdm9uaTp0cnVlLCByaFByZXNldDonb2ZmaWNlJywgcmhMbzozMCwgcmhIaTo2MCwgdExvOi0xNSwgdEhpOjUwLCB0aGVtZTonZGFyaycsIGRhcmtMZXZlbDoyLjAgfSk7XG4gICAgY29uc3QgW2xvY0NmZywgc2V0TG9jQ2ZnXSAgICAgICAgID0gdXNlU3RhdGUoeyBzaXRlTmFtZTonTXkgQnVpbGRpbmcnLCBjaXR5OidUb3JvbnRvLCBPTicsIGxhdDo0My42NTMyLCBsb246LTc5LjM4MzIgfSk7XG4gICAgY29uc3QgW2xhbmdDZmcsIHNldExhbmdDZmddICAgICAgID0gdXNlU3RhdGUoKCkgPT4ge1xuICAgICAgICAvKiBMYXp5IGluaXQgZnJvbSB0aGUgc2FtZSBsb2NhbFN0b3JhZ2Uga2V5IHRoZSBkYXNoYm9hcmQgcmVhZHMsIHNvXG4gICAgICAgICAqIHJlb3BlbmluZyB0aGUgc2V0dXAgd2FsayBzaG93cyB0aGUgY3VycmVudGx5LWFjdGl2ZSBsYW5ndWFnZVxuICAgICAgICAgKiByYXRoZXIgdGhhbiBhbHdheXMgZGVmYXVsdGluZyB0byBFbmdsaXNoLiAqL1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgdiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdpMThuX2xhbmcnKTtcbiAgICAgICAgICAgIGNvbnN0IGFsbG93ZWQgPSBbJ2VuJywnemgtQ04nLCd6aC1UVycsJ2phJywna28nXTtcbiAgICAgICAgICAgIGlmICh2ICYmIGFsbG93ZWQuaW5kZXhPZih2KSAhPT0gLTEpIHJldHVybiB7IGxhbmc6IHYgfTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBwcml2YXRlIG1vZGUgLT4gZmFsbCB0aHJvdWdoICovIH1cbiAgICAgICAgcmV0dXJuIHsgbGFuZzonZW4nIH07XG4gICAgfSk7XG4gICAgY29uc3QgW3BsdWdpbkNmZywgc2V0UGx1Z2luQ2ZnXSAgID0gdXNlU3RhdGUoeyBlbmFibGVkOlsnd2VhdGhlcicsJ2dpdm9uaScsJ3N3ZWV0X3Nwb3QnXSB9KTtcblxuICAgIGNvbnN0IGNvbXBsZXRlQ291bnQgPSBPYmplY3QudmFsdWVzKGRvbmUpLmZpbHRlcihCb29sZWFuKS5sZW5ndGg7XG5cbiAgICBjb25zdCBmaW5pc2ggPSAoa2V5KSA9PiB7XG4gICAgICAgIHNldERvbmUoZCA9PiAoey4uLmQsIFtrZXldOnRydWV9KSk7XG4gICAgICAgIHNldFJvdXRlKCdodWInKTtcbiAgICAgICAgc2V0TW9kYWwobnVsbCk7XG4gICAgfTtcblxuICAgIC8qIGZ1bGwtcGFnZSBQc3kgQ2hhcnQgZWRpdG9yICovXG4gICAgaWYgKHJvdXRlID09PSAncHN5Jykge1xuICAgICAgICByZXR1cm4gPFBzeUNoYXJ0U2V0dGluZ1BhZ2UgY2ZnPXtwc3lDZmd9IHNldENmZz17c2V0UHN5Q2ZnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25CYWNrPXsoKSA9PiBzZXRSb3V0ZSgnaHViJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNhdmU9eygpID0+IGZpbmlzaCgncHN5Jyl9IC8+O1xuICAgIH1cblxuICAgIC8qIGRlZmF1bHQ6IEhVQiBzY3JlZW4gKi9cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1pbi1oLXNjcmVlbiBweC02IHB5LThcIj5cbiAgICAgICAgICAgIHsvKiAtLS0tLS0tLS0tLS0tIGhlYWRlciAtLS0tLS0tLS0tLS0tICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXgtdy01eGwgbXgtYXV0byBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gbWItMTAgZmFkZS11cFwiPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJ0ZXh0LTJ4bCBzbTp0ZXh0LTN4bCBmb250LWJsYWNrIGl0YWxpYyB1cHBlcmNhc2UgdHJhY2tpbmctdGlnaHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtcmVkLTUwMFwiPlJlZDU8L3NwYW4+IDxzcGFuIGNsYXNzTmFtZT1cInRleHQtd2hpdGVcIj5TdHVkaW88L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCBmb250LW5vcm1hbCBpdGFsaWNcIj4gJm5ic3A7LyZuYnNwOyBzZXR1cCB3YWxrPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2gxPlxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCB0ZXh0LXhzIG10LTEgZm9udC1tb25vIHRyYWNraW5nLXdpZGVcIj5Db25maWd1cmUgb25jZS4gU2tpcCBhbnkgc3RlcCB5b3UgZG9uJ3QgbmVlZC48L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtNFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJwaWxsIGJnLXNsYXRlLTgwMCB0ZXh0LXNsYXRlLTQwMFwiPntjb21wbGV0ZUNvdW50fS81IERPTkU8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIvZGFzaGJvYXJkLmh0bWxcIlxuICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7IHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1LnNldHVwLmRvbmUnLCcxJyk7IH0gY2F0Y2goZSl7fSB9fVxuICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtc2xhdGUtNTAwIGhvdmVyOnRleHQtc2xhdGUtMzAwIHVuZGVybGluZSB1bmRlcmxpbmUtb2Zmc2V0LTRcIj5Ta2lwIGFsbCDihpI8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIC0tLS0tLS0tLS0tLS0gcGVudGFnb24gbGF5b3V0IC0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICA1IGNpcmN1bGFyIHRpbGVzIGFycmFuZ2VkIGF0IHRoZSBjb3JuZXJzIG9mIGEgcmVndWxhclxuICAgICAgICAgICAgICAgIHBlbnRhZ29uLiAgUG9sYXIgbWF0aHM6IGFuZ2xlIHN0YXJ0cyBhdCAtOTBkZWcgKHRvcCkgYW5kXG4gICAgICAgICAgICAgICAgc3RlcHMgYnkgKzcyZGVnIGNsb2Nrd2lzZS4gIFRoZSBjb250YWluZXIgaXMgaGVpZ2h0LWxvY2tlZFxuICAgICAgICAgICAgICAgIHZpYSBhc3BlY3QgcmF0aW8gc28gdGhlIHBlbnRhZ29uIHN0YXlzIGNpcmN1bGFyIG9uIGV2ZXJ5XG4gICAgICAgICAgICAgICAgdmlld3BvcnQuICBSYWRpdXMgaXMgNDAgJSBvZiB0aGUgY29udGFpbmVyIGhhbGYtc2lkZSwgY2lyY2xlXG4gICAgICAgICAgICAgICAgZGlhbWV0ZXIgfjI3ICUgb2YgdGhlIGNvbnRhaW5lciB3aWR0aCAtLSBnaXZlcyBhIGNsZWFybHlcbiAgICAgICAgICAgICAgICB2aXNpYmxlIGdhcCAofjI4ICUgb2YgY29udGFpbmVyIHdpZHRoKSBiZXR3ZWVuIGFkamFjZW50XG4gICAgICAgICAgICAgICAgY2lyY2xlcyByZWdhcmRsZXNzIG9mIHNjcmVlbiBzaXplLiAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgbXgtYXV0byBmYWRlLXVwXCJcbiAgICAgICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6J21pbig3NjBweCwgOTJ2dyknLCBhc3BlY3RSYXRpbzonMSAvIDEnLCBhbmltYXRpb25EZWxheTonLjA4cycgfX0+XG4gICAgICAgICAgICAgICAge1NURVBTLm1hcCgocywgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmdsZURlZyA9IC05MCArIGkgKiA3MjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5nbGUgPSBhbmdsZURlZyAqIE1hdGguUEkgLyAxODA7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHIgPSA0MDsgICAgICAgICAgICAgICAgICAgICAgICAvLyAlIG9mIGNvbnRhaW5lciBoYWxmLXNpZGVcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeCA9IDUwICsgciAqIE1hdGguY29zKGFuZ2xlKTsgIC8vICVcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeSA9IDUwICsgciAqIE1hdGguc2luKGFuZ2xlKTsgIC8vICVcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDaXJjbGVUaWxlIGtleT17cy5rZXl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGVwPXtzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZT17ZG9uZVtzLmtleV19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleD17aSsxfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdFBjdD17eH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcFBjdD17eX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocy5raW5kID09PSAncGFnZScpICAgICAgc2V0Um91dGUocy5rZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHMua2luZCA9PT0gJ2xpbmsnKSB3aW5kb3cub3BlbihzLmhyZWYsICdfYmxhbmsnLCAnbm9vcGVuZXInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlICAgICAgICAgICAgICAgICAgICAgICAgc2V0TW9kYWwocy5rZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICB7LyogRGVjb3JhdGl2ZSByaW5nOiBhIHNpbmdsZSBjaXJjbGUgd2hvc2UgY2VudHJlIGNvaW5jaWRlc1xuICAgICAgICAgICAgICAgICAgICB3aXRoIHRoZSBjZW50cmUgb2YgdGhlIHBlbnRhZ29uIGFuZCB3aG9zZSByYWRpdXMgZXF1YWxzXG4gICAgICAgICAgICAgICAgICAgIHRoZSBwZW50YWdvbiB2ZXJ0ZXggcmFkaXVzIC0tIHNvIGl0cyBib3VuZGFyeSBwYXNzZXNcbiAgICAgICAgICAgICAgICAgICAgY2xlYW5seSB0aHJvdWdoIHRoZSBjZW50cmUgb2YgZWFjaCB0aWxlLCB2aXN1YWxseVxuICAgICAgICAgICAgICAgICAgICBcImpvaW5pbmdcIiB0aGUgZml2ZSBjaXJjbGVzIGludG8gYSBjb25zdGVsbGF0aW9uLiAqL31cbiAgICAgICAgICAgICAgICA8c3ZnIGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgdy1mdWxsIGgtZnVsbCBwb2ludGVyLWV2ZW50cy1ub25lXCJcbiAgICAgICAgICAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMTAwIDEwMFwiIHByZXNlcnZlQXNwZWN0UmF0aW89XCJub25lXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgY3g9XCI1MFwiIGN5PVwiNTBcIiByPVwiNDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCJyZ2JhKDE0OCwxNjMsMTg0LDAuMjIpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2VXaWR0aD1cIjAuNTZcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZURhc2hhcnJheT1cIjEuNCAxLjRcIiAvPlxuICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiAtLS0tLS0tLS0tLS0tIGZvb3RlciBDVEEgLS0tLS0tLS0tLS0tLSAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctNXhsIG14LWF1dG8gbXQtMTAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIGZhZGUtdXBcIiBzdHlsZT17e2FuaW1hdGlvbkRlbGF5OicuMThzJ319PlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNTAwIHRleHQteHMgZm9udC1tb25vXCI+XG4gICAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZUNvdW50ID09PSAwICYmICfihpEgUGljayBhIHNldHRpbmcgdG8gc3RhcnQsIG9yIHNraXAgYWxsIGFuZCBnbyBzdHJhaWdodCB0byB0aGUgZGFzaGJvYXJkLid9XG4gICAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZUNvdW50ID4gMCAmJiBjb21wbGV0ZUNvdW50IDwgNSAmJiBg4oaRICR7NSAtIGNvbXBsZXRlQ291bnR9IHN0ZXAkezUgLSBjb21wbGV0ZUNvdW50ID09PSAxID8gJycgOiAncyd9IHJlbWFpbmluZyAob3B0aW9uYWwpLmB9XG4gICAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZUNvdW50ID09PSA1ICYmICfinJMgQWxsIHN0ZXBzIGNvbmZpZ3VyZWQuICBSZWFkeSB3aGVuIHlvdSBhcmUuJ31cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cIi9kYXNoYm9hcmQuaHRtbFwiXG4gICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4geyB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS5zZXR1cC5kb25lJywnMScpOyB9IGNhdGNoKGUpe30gfX1cbiAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweC03IHB5LTMgcm91bmRlZC14bCB0ZXh0LXNtIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjb21wbGV0ZUNvdW50ID09PSA1XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctZW1lcmFsZC02MDAgaG92ZXI6YmctZW1lcmFsZC01MDAgdGV4dC13aGl0ZSBzaGFkb3ctbGcgc2hhZG93LWVtZXJhbGQtNTAwLzMwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLWluZGlnby02MDAgaG92ZXI6YmctaW5kaWdvLTUwMCB0ZXh0LXdoaXRlIHNoYWRvdy1sZyBzaGFkb3ctaW5kaWdvLTUwMC8yMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgIE9wZW4gRGFzaGJvYXJkIOKGklxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogLS0tLS0tLS0tLS0tLSBtb2RhbHMgLS0tLS0tLS0tLS0tLSAqL31cbiAgICAgICAgICAgIHttb2RhbCA9PT0gJ2xvY2F0aW9uJyAmJiA8TG9jYXRpb25Nb2RhbCBjZmc9e2xvY0NmZ30gc2V0Q2ZnPXtzZXRMb2NDZmd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRNb2RhbChudWxsKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2F2ZT17KCkgPT4gZmluaXNoKCdsb2NhdGlvbicpfSAvPn1cbiAgICAgICAgICAgIHttb2RhbCA9PT0gJ2xhbmd1YWdlJyAmJiA8TGFuZ3VhZ2VNb2RhbCBjZmc9e2xhbmdDZmd9IHNldENmZz17c2V0TGFuZ0NmZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldE1vZGFsKG51bGwpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXsoKSA9PiBmaW5pc2goJ2xhbmd1YWdlJyl9IC8+fVxuICAgICAgICAgICAge21vZGFsID09PSAncGx1Z2lucycgICYmIDxQbHVnaW5zTW9kYWwgIGNmZz17cGx1Z2luQ2ZnfSBzZXRDZmc9e3NldFBsdWdpbkNmZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldE1vZGFsKG51bGwpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXsoKSA9PiBmaW5pc2goJ3BsdWdpbnMnKX0gLz59XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFRpbGUgKGxhcmdlIGVhc3ktb24tZXllcyBidXR0b24pIC0tIGtlcHQgZm9yIGJhY2stY29tcGF0LCBubyBsb25nZXIgdXNlZFxuICogYnkgdGhlIHBlbnRhZ29uIGh1Yi5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIFRpbGUoeyBzdGVwLCBkb25lLCBpbmRleCwgb25DbGljayB9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgc2V0dXAtdGlsZS0ke3N0ZXAua2V5fWB9XG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17YE9wZW4gJHtzdGVwLmxhYmVsfWB9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdGlsZS1idG4gcmVsYXRpdmUgdGV4dC1sZWZ0IGJnLXNsYXRlLTkwMC83MCBib3JkZXItMiBib3JkZXItc2xhdGUtNzAwLzcwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91bmRlZC0yeGwgcC02IHNtOnAtNyAke2RvbmUgPyAnZG9uZScgOiAnJ31gfT5cbiAgICAgICAgICAgIHtkb25lICYmIDxzcGFuIGNsYXNzTmFtZT1cImNoZWNrXCIgZGF0YS10ZXN0aWQ9e2BzZXR1cC10aWxlLSR7c3RlcC5rZXl9LWRvbmVgfT7inJM8L3NwYW4+fVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtNCBtYi0zXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTEyIGgtMTIgcm91bmRlZC14bCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiXG4gICAgICAgICAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6YCR7c3RlcC5pY29uQ29sb3J9MjJgLCBib3JkZXI6YDFweCBzb2xpZCAke3N0ZXAuaWNvbkNvbG9yfTU1YH19PlxuICAgICAgICAgICAgICAgICAgICA8VGlsZUljb24ga2luZD17c3RlcC5rZXl9IGNvbG9yPXtzdGVwLmljb25Db2xvcn0gLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtM3hsIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS03MDBcIj4we2luZGV4fTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1sZyBzbTp0ZXh0LXhsIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVyIG1iLTFcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7Y29sb3I6c3RlcC5pY29uQ29sb3J9fT57c3RlcC5sYWJlbH08L2gzPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS00MDAgdGV4dC1zbSBsZWFkaW5nLXNudWdcIj57c3RlcC5zdWJ9PC9wPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC00IGZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicGlsbCBiZy1zbGF0ZS04MDAgdGV4dC1zbGF0ZS00MDBcIj57c3RlcC5raW5kID09PSAncGFnZScgPyAnRnVsbCBwYWdlJyA6ICdQb3B1cCd9PC9zcGFuPlxuICAgICAgICAgICAgICAgIHtkb25lICYmIDxzcGFuIGNsYXNzTmFtZT1cInBpbGwgYmctZW1lcmFsZC05MDAvNDAgdGV4dC1lbWVyYWxkLTQwMFwiPkNvbmZpZ3VyZWQ8L3NwYW4+fVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENpcmNsZVRpbGUgLS0gcGVudGFnb24tY29ybmVyIHJvdW5kIGJ1dHRvbi4gIFNpemVkIGluICUgb2YgaXRzIGNvbnRhaW5lclxuICogc28gdGhlIHdob2xlIGxheW91dCBzY2FsZXMgd2l0aCB2aWV3cG9ydC4gIEVhY2ggY2lyY2xlIGlzIGFuY2hvcmVkIGJ5IGl0c1xuICogY2VudHJlICh0cmFuc2xhdGUgLTUwJS8tNTAlKSBvbiB0aGUgcG9sYXItY29tcHV0ZWQgKGxlZnQlLCB0b3AlKS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIENpcmNsZVRpbGUoeyBzdGVwLCBkb25lLCBpbmRleCwgbGVmdFBjdCwgdG9wUGN0LCBvbkNsaWNrIH0pIHtcbiAgICAvKiBUaGljayBjb2xvdXJlZCByaW5nIHBlciB0aWxlIC0tIGVhY2ggc3RlcCBrZWVwcyBpdHMgYWNjZW50IGNvbG91clxuICAgICAqIChpbmRpZ28vYW1iZXIvZW1lcmFsZC9waW5rL3Jvc2UpLCByZWluZm9yY2luZyB0aGUgY29sb3VyLWNvZGVkIFNWR1xuICAgICAqIGljb24gYW5kIHRoZSBoZWFkaW5nIHRleHQuICovXG4gICAgY29uc3QgcmluZ0NvbG9yID0gc3RlcC5pY29uQ29sb3I7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgc2V0dXAtdGlsZS0ke3N0ZXAua2V5fWB9XG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17YE9wZW4gJHtzdGVwLmxhYmVsfWB9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgY2lyY2xlLXRpbGUgZ3JvdXAgYWJzb2x1dGUgcm91bmRlZC1mdWxsIHRleHQtY2VudGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi0yMDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2RvbmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctc2xhdGUtOTAwLzgwIHNoYWRvdy1bMF8wXzMwcHhfLTZweF9yZ2JhKDE2LDE4NSwxMjksMC41NSldJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1zbGF0ZS05MDAvNzAgaG92ZXI6Ymctc2xhdGUtODAwLzkwJ31gfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6YCR7bGVmdFBjdH0lYCwgdG9wOmAke3RvcFBjdH0lYCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6J21pbigzNSUsIDI2MHB4KScsIGFzcGVjdFJhdGlvOicxLzEnLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06J3RyYW5zbGF0ZSgtNTAlLCAtNTAlKScsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlcjpgMTBweCBzb2xpZCAke3JpbmdDb2xvcn1gLFxuICAgICAgICAgICAgICAgICAgICBib3hTaGFkb3c6YDAgMCAwIDFweCAke3JpbmdDb2xvcn0zMywgMCA4cHggMjhweCAtOHB4ICR7cmluZ0NvbG9yfTU1YCxcbiAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHtkb25lICYmIChcbiAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLXRlc3RpZD17YHNldHVwLXRpbGUtJHtzdGVwLmtleX0tZG9uZWB9XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgLXRvcC0xIC1yaWdodC0xIHctNiBoLTYgcm91bmRlZC1mdWxsIGJnLWVtZXJhbGQtNTAwIHRleHQtd2hpdGUgdGV4dC14cyBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBmb250LWJvbGQgc2hhZG93XCI+XG4gICAgICAgICAgICAgICAgICAgIOKck1xuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdW5kZWQteGwgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgbWItMVwiXG4gICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiczNCUnLCBhc3BlY3RSYXRpbzonMS8xJyxcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDpgJHtzdGVwLmljb25Db2xvcn0yMmAsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlcjpgMXB4IHNvbGlkICR7c3RlcC5pY29uQ29sb3J9NTVgLFxuICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICA8VGlsZUljb24ga2luZD17c3RlcC5rZXl9IGNvbG9yPXtzdGVwLmljb25Db2xvcn0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSBmb250LWJsYWNrIHRleHQtc2xhdGUtNjAwIHRyYWNraW5nLXdpZGVyXCI+MHtpbmRleH08L2Rpdj5cbiAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LVsxMXB4XSBzbTp0ZXh0LVsxMnB4XSBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlciBweC0yIGxlYWRpbmctdGlnaHQgbXQtMC41XCJcbiAgICAgICAgICAgICAgICBzdHlsZT17e2NvbG9yOnN0ZXAuaWNvbkNvbG9yfX0+XG4gICAgICAgICAgICAgICAge3N0ZXAubGFiZWx9XG4gICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgdGV4dC1bOXB4XSBzbTp0ZXh0LVsxMHB4XSBsZWFkaW5nLXNudWcgcHgtMiBtdC0wLjUgbGluZS1jbGFtcC0yXCI+XG4gICAgICAgICAgICAgICAge3N0ZXAuc3VifVxuICAgICAgICAgICAgPC9wPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICApO1xufVxuXG5mdW5jdGlvbiBUaWxlSWNvbih7IGtpbmQsIGNvbG9yIH0pIHtcbiAgICAvKiBzaW1wbGUgaW5saW5lIFNWR3Mgc28gd2Uga2VlcCB0aGUgZmlsZSBzZWxmLWNvbnRhaW5lZCAqL1xuICAgIGNvbnN0IHN0cm9rZSA9IHsgc3Ryb2tlOmNvbG9yLCBmaWxsOidub25lJywgc3Ryb2tlV2lkdGg6Miwgc3Ryb2tlTGluZWNhcDoncm91bmQnLCBzdHJva2VMaW5lam9pbjoncm91bmQnIH07XG4gICAgaWYgKGtpbmQgPT09ICdwc3knKSAgICAgIHJldHVybiA8c3ZnIHdpZHRoPVwiMjJcIiBoZWlnaHQ9XCIyMlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB7Li4uc3Ryb2tlfT48cGF0aCBkPVwiTTMgM3YxOGgxOFwiLz48cGF0aCBkPVwiTTMgMTdjNC0xIDctNiA5LTlzNS0zIDktMlwiLz48L3N2Zz47XG4gICAgaWYgKGtpbmQgPT09ICdsb2NhdGlvbicpIHJldHVybiA8c3ZnIHdpZHRoPVwiMjJcIiBoZWlnaHQ9XCIyMlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB7Li4uc3Ryb2tlfT48cGF0aCBkPVwiTTEyIDIycy03LTYuNC03LTEyYTcgNyAwIDEgMSAxNCAwYzAgNS42LTcgMTItNyAxMnpcIi8+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMFwiIHI9XCIyLjVcIi8+PC9zdmc+O1xuICAgIGlmIChraW5kID09PSAnbGFuZ3VhZ2UnKSByZXR1cm4gPHN2ZyB3aWR0aD1cIjIyXCIgaGVpZ2h0PVwiMjJcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgey4uLnN0cm9rZX0+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCI5XCIvPjxwYXRoIGQ9XCJNMyAxMmgxOE0xMiAzYTE0IDE0IDAgMCAxIDAgMThNMTIgM2ExNCAxNCAwIDAgMCAwIDE4XCIvPjwvc3ZnPjtcbiAgICBpZiAoa2luZCA9PT0gJ3BsdWdpbnMnKSAgcmV0dXJuIDxzdmcgd2lkdGg9XCIyMlwiIGhlaWdodD1cIjIyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHsuLi5zdHJva2V9PjxwYXRoIGQ9XCJNOSAzdjZNMTUgM3Y2XCIvPjxwYXRoIGQ9XCJNNSA5aDE0djZhNCA0IDAgMCAxLTQgNGgtMXYzTTkgMTl2M1wiLz48L3N2Zz47XG4gICAgLyogVXBkYXRlICYgUmVwYWlyIC0tIHdyZW5jaCArIHRpbnkgZ2VhciBidW1wLCBzaWduYWxsaW5nIFwidG9vbHNcIiAqL1xuICAgIGlmIChraW5kID09PSAncmVwYWlyJykgICByZXR1cm4gPHN2ZyB3aWR0aD1cIjIyXCIgaGVpZ2h0PVwiMjJcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgey4uLnN0cm9rZX0+PHBhdGggZD1cIk0xNC43IDYuM2E0IDQgMCAwIDAtNS40IDUuNEwzIDE4bDMgMyA2LjMtNi4zYTQgNCAwIDAgMCA1LjQtNS40bC0yLjggMi44TDEzIDExbC0xLjEtMS45IDIuOC0yLjh6XCIvPjwvc3ZnPjtcbiAgICByZXR1cm4gbnVsbDtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogUHN5IENoYXJ0IFNldHRpbmcgLS0gRlVMTCBQQUdFLCBsaXZlIHNrZWxldG9uIHJlc3BvbmRzIHRvIGNvbnRyb2xzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5mdW5jdGlvbiBQc3lDaGFydFNldHRpbmdQYWdlKHsgY2ZnLCBzZXRDZmcsIG9uQmFjaywgb25TYXZlIH0pIHtcbiAgICBjb25zdCB1cGRhdGUgPSAoaywgdikgPT4gc2V0Q2ZnKGMgPT4gKHsuLi5jLCBba106dn0pKTtcblxuICAgIC8qIE9uIG1vdW50OiBoeWRyYXRlIGZyb20gdGhlIFNBTUUgbG9jYWxTdG9yYWdlIGtleSB0aGUgZGFzaGJvYXJkIHJlYWRzXG4gICAgICogKGByZWQ1X3N3ZWV0X3Nwb3RfcmFuZ2VgKSBwbHVzIHRoZSBwcmVzZXQgaWQgKGByZWQ1X3JoX3ByZXNldGApIHNvXG4gICAgICogdGhlIGRyb3Bkb3duIGxhYmVsIHN0YXlzIGNvbnNpc3RlbnQgd2l0aCB0aGUgc2xpZGVyIHZhbHVlcyBhY3Jvc3NcbiAgICAgKiByZWxvYWRzLiAgSWYgdGhlIG9wZXJhdG9yIGhhcyBhbHJlYWR5IHR1bmVkIHRoZSBSSCBiYW5kIG9uIHRoZVxuICAgICAqIGRhc2hib2FyZCwgdGhlIHNldHVwIHdhbGsgc3RhcnRzIGZyb20gdGhvc2UgdmFsdWVzLiAqL1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByYXcgICAgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVkNV9zd2VldF9zcG90X3JhbmdlJyk7XG4gICAgICAgICAgICBjb25zdCBwcmVzZXQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVkNV9yaF9wcmVzZXQnKTtcbiAgICAgICAgICAgIGNvbnN0IHBhdGNoICA9IHt9O1xuICAgICAgICAgICAgaWYgKHJhdykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHAgPSBKU09OLnBhcnNlKHJhdyk7XG4gICAgICAgICAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShwLmxvKSAmJiBOdW1iZXIuaXNGaW5pdGUocC5oaSkgJiYgcC5sbyA8IHAuaGkpIHtcbiAgICAgICAgICAgICAgICAgICAgcGF0Y2gucmhMbyA9IHAubG87XG4gICAgICAgICAgICAgICAgICAgIHBhdGNoLnJoSGkgPSBwLmhpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwcmVzZXQgJiYgUkhfUFJFU0VUUy5maW5kKHggPT4geC5pZCA9PT0gcHJlc2V0KSkge1xuICAgICAgICAgICAgICAgIHBhdGNoLnJoUHJlc2V0ID0gcHJlc2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogVGhlbWUgKyBicmlnaHRuZXNzIOKAlCBzYW1lIGtleXMgYXBwLmpzIChkYXNoYm9hcmQpIHJlYWRzLiAqL1xuICAgICAgICAgICAgY29uc3QgdGggPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVkNS50aGVtZScpO1xuICAgICAgICAgICAgaWYgKHRoID09PSAnbGlnaHQnIHx8IHRoID09PSAnZGFyaycpIHBhdGNoLnRoZW1lID0gdGg7XG4gICAgICAgICAgICBjb25zdCBkbCA9IHBhcnNlRmxvYXQobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlZDUuZGFya0xldmVsJykpO1xuICAgICAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShkbCkgJiYgZGwgPj0gMS41ICYmIGRsIDw9IDMuMCkgcGF0Y2guZGFya0xldmVsID0gZGw7XG4gICAgICAgICAgICAvKiBUZW1wZXJhdHVyZSBheGlzIHJhbmdlIOKAlCB3cml0dGVuIGJ5IHRoaXMgc2FtZSBwYWdlJ3Mgc2F2ZVxuICAgICAgICAgICAgICogaGFuZGxlcjsgbG9hZCBpdCBoZXJlIHNvIHJlb3BlbmluZyB0aGUgc2V0dXAgd2FsayBzaG93cyB0aGVcbiAgICAgICAgICAgICAqIGN1cnJlbnQgZGFzaGJvYXJkIGF4aXMgaW5zdGVhZCBvZiBhbHdheXMgZGVmYXVsdGluZyB0byAtMTUuLjUwLiAqL1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0clJhdyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWQ1X3RlbXBfcmFuZ2UnKTtcbiAgICAgICAgICAgICAgICBpZiAodHJSYXcpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHIgPSBKU09OLnBhcnNlKHRyUmF3KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZSh0ci5taW4pICYmIE51bWJlci5pc0Zpbml0ZSh0ci5tYXgpICYmIHRyLm1pbiA8IHRyLm1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF0Y2gudExvID0gdHIubWluO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF0Y2gudEhpID0gdHIubWF4O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBpZ25vcmUgKi8gfVxuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKHBhdGNoKS5sZW5ndGgpIHNldENmZyhjID0+ICh7Li4uYywgLi4ucGF0Y2h9KSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogaWdub3JlICovIH1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaG9va3MvZXhoYXVzdGl2ZS1kZXBzXG4gICAgfSwgW10pO1xuXG4gICAgLyogT24gc2F2ZTogcGVyc2lzdCB0aGUgUkggYmFuZCB0byBsb2NhbFN0b3JhZ2Ugc28gdGhlIGRhc2hib2FyZCdzXG4gICAgICogc3dlZXQtc3BvdCBwb2x5Z29uIHBpY2tzIGl0IHVwIG9uIG5leHQgbG9hZC4gIEFsc28gcGVyc2lzdCB0aGUgdmVudWVcbiAgICAgKiBwcmVzZXQgaWQgKGZvciBmdXR1cmUgXCJzaG93IHByZXNldCBuYW1lIG9uIGRhc2hib2FyZFwiIGZlYXR1cmVzKS4gKi9cbiAgICBjb25zdCBwZXJzaXN0QW5kU2F2ZSA9ICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1X3N3ZWV0X3Nwb3RfcmFuZ2UnLFxuICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHsgbG86IGNmZy5yaExvLCBoaTogY2ZnLnJoSGkgfSkpO1xuICAgICAgICAgICAgaWYgKGNmZy5yaFByZXNldCkge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1X3JoX3ByZXNldCcsIGNmZy5yaFByZXNldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBUaGVtZSArIGJyaWdodG5lc3Mg4oCUIHdyaXR0ZW4gdG8gdGhlIFNBTUUga2V5cyB0aGUgZGFzaGJvYXJkXG4gICAgICAgICAgICAgKiAoYXBwLmpzIGxpbmVzIDU3LTU4IGFuZCA4NC05NykgcmVhZHMgYXMgaXRzIHVzZVN0YXRlIGxhenlcbiAgICAgICAgICAgICAqIGluaXRpYWxpc2VyLCBzbyB0aGUgY2hvc2VuIHRoZW1lIHRha2VzIGVmZmVjdCBvbiBuZXh0IGRhc2hib2FyZFxuICAgICAgICAgICAgICogbG9hZC4gIGFwcC5qcyB0cmVhdHMgZGFya0xldmVsID49IDMuMCBhcyBsaWdodC1tb2RlIHRyaWdnZXIuICovXG4gICAgICAgICAgICBpZiAoY2ZnLnRoZW1lID09PSAnbGlnaHQnIHx8IGNmZy50aGVtZSA9PT0gJ2RhcmsnKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDUudGhlbWUnLCBjZmcudGhlbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShjZmcuZGFya0xldmVsKSkge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1LmRhcmtMZXZlbCcsIFN0cmluZyhjZmcuZGFya0xldmVsKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBUZW1wZXJhdHVyZSBheGlzIHJhbmdlIOKAlCBkcml2ZXMgdGhlIGRhc2hib2FyZCdzIHBzeSBjaGFydFxuICAgICAgICAgICAgICogWCBheGlzIChgdGVtcFJhbmdlLm1pbi9tYXhgIGluIGFwcC5qcykuICBXZSB3cml0ZSB0aGUgc2FtZVxuICAgICAgICAgICAgICogc2hhcGUgYXBwLmpzIHJlYWRzIChge21pbiwgbWF4fWApIHNvIGl0cyBsYXp5IHVzZVN0YXRlIGluaXRcbiAgICAgICAgICAgICAqIHBpY2tzIGl0IHVwIG9uIG5leHQgbG9hZCwgQU5EIGRpc3BhdGNoIGEgY3VzdG9tIGV2ZW50IHNvXG4gICAgICAgICAgICAgKiBhbnkgb3BlbiBkYXNoYm9hcmQgdGFiIHVwZGF0ZXMgbGl2ZSB3aXRob3V0IGEgcmVmcmVzaC4gKi9cbiAgICAgICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUoY2ZnLnRMbykgJiYgTnVtYmVyLmlzRmluaXRlKGNmZy50SGkpICYmIGNmZy50TG8gPCBjZmcudEhpKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDVfdGVtcF9yYW5nZScsXG4gICAgICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHsgbWluOiBjZmcudExvLCBtYXg6IGNmZy50SGkgfSkpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncjUtdGVtcC1yYW5nZS1jaGFuZ2UnLCB7XG4gICAgICAgICAgICAgICAgICAgIGRldGFpbDogeyBtaW46IGNmZy50TG8sIG1heDogY2ZnLnRIaSB9XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdyNS1yaC1iYW5kLWNoYW5nZScsIHtcbiAgICAgICAgICAgICAgICBkZXRhaWw6IHsgbG86IGNmZy5yaExvLCBoaTogY2ZnLnJoSGkgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdbc2V0dXAgd2Fsa10gcHN5IGNoYXJ0IHNhdmVkIC0+IFJIJywgY2ZnLnJoTG8sICctJywgY2ZnLnJoSGksXG4gICAgICAgICAgICAgICAgICAgICAgICAgJyUgVC1heGlzJywgY2ZnLnRMbywgJy4uJywgY2ZnLnRIaSwgJ8KwQyBwcmVzZXQ9JywgY2ZnLnJoUHJlc2V0KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdbc2V0dXAgd2Fsa10gY291bGQgbm90IHBlcnNpc3QgcHN5IHNldHRpbmdzOicsIGUpO1xuICAgICAgICB9XG4gICAgICAgIG9uU2F2ZSgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1pbi1oLXNjcmVlbiBmbGV4IGZsZXgtY29sXCI+XG4gICAgICAgICAgICB7LyogaGVhZGVyICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcHgtNiBweS00IGJvcmRlci1iIGJvcmRlci1zbGF0ZS04MDBcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQmFja31cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNDAwIGhvdmVyOnRleHQtd2hpdGUgdGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2tcIj5cbiAgICAgICAgICAgICAgICAgICAg4oaQIEJhY2sgdG8gc2V0dXBcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwidGV4dC1zbSB1cHBlcmNhc2UgdHJhY2tpbmctWzAuM2VtXSBmb250LWJsYWNrIHRleHQtaW5kaWdvLTQwMFwiPlBzeSBDaGFydCBTZXR0aW5nPC9oMT5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3BlcnNpc3RBbmRTYXZlfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtNSBweS0yIHJvdW5kZWQtbGcgYmctaW5kaWdvLTYwMCBob3ZlcjpiZy1pbmRpZ28tNTAwIHRleHQtd2hpdGUgdGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2tcIj5cbiAgICAgICAgICAgICAgICAgICAgU2F2ZSAmIHJldHVybiDinJNcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogYm9keSDigJQgY2hhcnQgbGVmdCwgY29udHJvbHMgcmlnaHQgKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMSBncmlkIGdyaWQtY29scy0xIGxnOmdyaWQtY29scy1bMWZyXzM2MHB4XSBnYXAtNCBwLTYgbWF4LXctN3hsIG14LWF1dG8gdy1mdWxsXCI+XG4gICAgICAgICAgICAgICAgPFBzeVNrZWxldG9uIGNmZz17Y2ZnfSAvPlxuICAgICAgICAgICAgICAgIDxQc3lDb250cm9sUGFuZWwgY2ZnPXtjZmd9IHVwZGF0ZT17dXBkYXRlfSBzZXRDZmc9e3NldENmZ30gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG4vKiBSSCBiYW5kIHByZXNldHMg4oCUIHJlY29nbmlzZWQgaW5kdXN0cnkgc3RhbmRhcmRzIGZvciBlYWNoIHZlbnVlIHR5cGUuXG4gKiBTb3VyY2VzOiBBU0hSQUUgNTUgKGNvbWZvcnQpLCBBU0hSQUUgMTcwIChoZWFsdGhjYXJlKSxcbiAqIEFBTS9OUFMvU21pdGhzb25pYW4gZ3VpZGFuY2UgKGNvbGxlY3Rpb25zKSwgQ0lCU0UgVE00MCAobGlicmFyaWVzKS4gKi9cbmNvbnN0IFJIX1BSRVNFVFMgPSBbXG4gICAgeyBpZDonY3VzdG9tJywgICAgICAgICAgbGFiZWw6J0N1c3RvbSAobWFudWFsKScsICAgICAgICAgICAgICAgICBsbzpudWxsLCBoaTpudWxsLCBub3RlOicnIH0sXG4gICAgeyBpZDonb2ZmaWNlJywgICAgICAgICAgbGFiZWw6J09mZmljZScsICAgICAgICAgICAgICAgICAgICAgICAgICBsbzozMCwgICBoaTo2MCwgICBub3RlOidBU0hSQUUgNTUgY29tZm9ydCcgICAgICAgICAgICAgICAgICB9LFxuICAgIHsgaWQ6J211c2V1bScsICAgICAgICAgIGxhYmVsOidNdXNldW0nLCAgICAgICAgICAgICAgICAgICAgICAgICAgbG86NDAsICAgaGk6NTUsICAgbm90ZTonQUFNIGNvbGxlY3Rpb24gcHJlc2VydmF0aW9uJyAgICAgICAgfSxcbiAgICB7IGlkOidob3RlbCcsICAgICAgICAgICBsYWJlbDonSG90ZWwgZ3Vlc3Qgcm9vbScsICAgICAgICAgICAgICAgIGxvOjMwLCAgIGhpOjYwLCAgIG5vdGU6J2dlbmVyYWwgb2NjdXBhbnQgY29tZm9ydCcgICAgICAgICAgIH0sXG4gICAgeyBpZDonbGlicmFyeScsICAgICAgICAgbGFiZWw6J0xpYnJhcnkgLyBBcmNoaXZlJywgICAgICAgICAgICAgICBsbzo0MCwgICBoaTo1NSwgICBub3RlOidwYXBlciAmIGJpbmRpbmcgcHJlc2VydmF0aW9uJyAgICAgICB9LFxuICAgIHsgaWQ6J2hvc3BpdGFsJywgICAgICAgIGxhYmVsOidIb3NwaXRhbCAoZ2VuZXJhbCknLCAgICAgICAgICAgICAgbG86MzAsICAgaGk6NjAsICAgbm90ZTonQVNIUkFFIDE3MCBwYXRpZW50IGFyZWFzJyAgICAgICAgICAgfSxcbiAgICB7IGlkOidsZWN0dXJlJywgICAgICAgICBsYWJlbDonTGVjdHVyZSBoYWxsJywgICAgICAgICAgICAgICAgICAgIGxvOjMwLCAgIGhpOjYwLCAgIG5vdGU6J2hpZ2ggb2NjdXBhbmN5IGNvbWZvcnQnICAgICAgICAgICAgIH0sXG4gICAgeyBpZDonY29uY2VydCcsICAgICAgICAgbGFiZWw6J0NvbmNlcnQgaGFsbCcsICAgICAgICAgICAgICAgICAgICBsbzo0MCwgICBoaTo1NSwgICBub3RlOidpbnN0cnVtZW50IHR1bmluZyBzdGFiaWxpdHknICAgICAgICB9LFxuICAgIHsgaWQ6J21lZXRpbmcnLCAgICAgICAgIGxhYmVsOidNZWV0aW5nIHJvb20nLCAgICAgICAgICAgICAgICAgICAgbG86MzAsICAgaGk6NjAsICAgbm90ZTonc21hbGwgZ3JvdXAgY29tZm9ydCcgICAgICAgICAgICAgICAgfSxcbiAgICB7IGlkOidleGhpYml0aW9uJywgICAgICBsYWJlbDonRXhoaWJpdGlvbiBoYWxsJywgICAgICAgICAgICAgICAgIGxvOjQwLCAgIGhpOjU1LCAgIG5vdGU6J21peGVkIGFydCAvIGFydGlmYWN0IGRpc3BsYXknICAgICAgIH0sXG5dO1xuXG4vKiBSZWFsIHBzeSBjaGFydCDigJQgdXNlcyB0aGUgU0FNRSBnZXRXICsgR0lWT05JX0NPTE9SUyArIHBvbHlnb24gbWF0aCBhcyB0aGVcbiAqIHByb2R1Y3Rpb24gZGFzaGJvYXJkLiAgU291cmNlIG9mIHRydXRoOiAganMvcHN5Y2hyb21ldHJpYy5qcyAgYW5kIHRoZVxuICogcmVuZGVyR2l2b25pT3ZlcmxheSgpIGJsb2NrIGF0IGFwcC5qczoxNjQxLTE3MjIuXG4gKiBBbnl0aGluZyB5b3UgY2hhbmdlIGluIHRob3NlIGZpbGVzIE1VU1QgYmUgbWlycm9yZWQgaGVyZS4gKi9cbmZ1bmN0aW9uIFBzeVNrZWxldG9uKHsgY2ZnIH0pIHtcbiAgICAvKiBDYW52YXMgKyBwYWRkaW5nICovXG4gICAgY29uc3QgVyA9IDc2MCwgSCA9IDQ4MDtcbiAgICBjb25zdCBwYWQgPSB7IGxlZnQ6IDU2LCByaWdodDogNDAsIHRvcDogMjgsIGJvdHRvbTogNTYgfTtcbiAgICBjb25zdCBncmlkVyA9IFcgLSBwYWQubGVmdCAtIHBhZC5yaWdodDtcbiAgICBjb25zdCBncmlkSCA9IEggLSBwYWQudG9wICAtIHBhZC5ib3R0b207XG5cbiAgICBjb25zdCBUX01JTiA9IGNmZy50TG8sIFRfTUFYID0gY2ZnLnRIaTtcbiAgICBjb25zdCBXX01JTiA9IDAsICAgICAgIFdfTUFYID0gMC4wMzA7ICAgICAgICAgIC8vIGtnL2tnXG5cbiAgICAvKiBheGlzIHNjYWxlcyAtLSBtYXRjaCB0aGUgbGl2ZSBkYXNoYm9hcmQgKi9cbiAgICBjb25zdCB4ICA9ICh0KSA9PiBwYWQubGVmdCArICgodCAtIFRfTUlOKSAvIChUX01BWCAtIFRfTUlOKSkgKiBncmlkVztcbiAgICBjb25zdCB5ICA9ICh3KSA9PiBwYWQudG9wICArICgxIC0gKHcgLSBXX01JTikgLyAoV19NQVggLSBXX01JTikpICogZ3JpZEg7XG4gICAgY29uc3QgX2dldFcgPSAodHlwZW9mIGdldFcgPT09ICdmdW5jdGlvbicpID8gZ2V0VyA6ICgodCwgcmgpID0+IDApO1xuXG4gICAgY29uc3Qgc2FmZVB0cyA9IChhcnIpID0+IGFyci5tYXAocCA9PiBgJHsoeChwWzBdKXx8MCkudG9GaXhlZCgyKX0sJHsoeShwWzFdKXx8MCkudG9GaXhlZCgyKX1gKS5qb2luKCcgJyk7XG5cbiAgICAvKiAtLS0tIEdpdm9uaSBwb2x5Z29ucyAtLSBDT1BJRUQgVkVSQkFUSU0gZnJvbSBhcHAuanM6MTY0My0xNjY5IC0tLS0gKi9cbiAgICBjb25zdCByaDgwID0gW107IGZvciAobGV0IHQ9MjA7IHQ8PTI1OyB0Kz0wLjUpIHJoODAucHVzaChbdCwgX2dldFcodCwgODApXSk7XG4gICAgY29uc3QgcmgxMDA9IFtdOyBmb3IgKGxldCB0PTIwOyB0PD0yNzsgdCs9MC41KSByaDEwMC5wdXNoKFt0LCBfZ2V0Vyh0LCAxMDApXSk7XG4gICAgY29uc3QgcmgyMExpbmUgPSBbXTsgZm9yIChsZXQgdD0zMjsgdD49MjA7IHQtPTAuNSkgcmgyMExpbmUucHVzaChbdCwgX2dldFcodCwgMjApXSk7XG4gICAgY29uc3QgcmgyMF9DWiAgPSBbXTsgZm9yIChsZXQgdD0yNzsgdD49MjA7IHQtPTAuNSkgcmgyMF9DWi5wdXNoKFt0LCBfZ2V0Vyh0LCAyMCldKTtcbiAgICBjb25zdCBDWiAgID0gWy4uLnJoODAsIFsyNywgX2dldFcoMjcsIDUwKV0sIFsyNywgX2dldFcoMjcsIDIwKV0sIC4uLnJoMjBfQ1pdO1xuXG4gICAgY29uc3QgcmhIaV90b3AgPSBbXTsgZm9yIChsZXQgdHQ9MjA7IHR0PD0yNzsgdHQrPTAuNSkgcmhIaV90b3AucHVzaChbdHQsIF9nZXRXKHR0LCBjZmcucmhIaSldKTtcbiAgICBjb25zdCByaExvX2JvdCA9IFtdOyBmb3IgKGxldCB0dD0yNzsgdHQ+PTIwOyB0dC09MC41KSByaExvX2JvdC5wdXNoKFt0dCwgX2dldFcodHQsIGNmZy5yaExvKV0pO1xuICAgIGNvbnN0IFNXRUVUID0gWy4uLnJoSGlfdG9wLCAuLi5yaExvX2JvdF07XG5cbiAgICBjb25zdCBOViAgID0gWy4uLnJoMTAwLCBbMzIsIDE1LjQvMTAwMF0sIFszMiwgNi4yLzEwMDBdLCAuLi5yaDIwTGluZV07XG4gICAgY29uc3QgTWFzcyA9IFsuLi5yaDgwLCBbMzMsIDE2LzEwMDBdLCBbMzcsIF9nZXRXKDM3LCAzMCldLCBbMzcsIDMvMTAwMF0sIFsyMCwgX2dldFcoMjAsIDIwKV1dO1xuICAgIGNvbnN0IE1DViAgPSBbLi4ucmg4MCwgWzQwLCAxNi8xMDAwXSwgWzQ0LCBfZ2V0Vyg0NCwgMjApXSwgWzQ0LCAzLzEwMDBdLCBbMjAsIF9nZXRXKDIwLCAyMCldXTtcbiAgICBjb25zdCBFVkFQID0gWy4uLnJoODAsIFsyNSwgMTYvMTAwMF0sIFszNiwgX2dldFcoMzYsIDMwKV0sIFszOSwgX2dldFcoMzksIDIwKV0sXG4gICAgICAgICAgICAgICAgICBbNDEsIF9nZXRXKDQxLCAxMCldLCBbNDEsIDBdLCBbMjcuMiwgMF0sIFsyMCwgX2dldFcoMjAsIDIwKV1dO1xuXG4gICAgY29uc3Qgd2ludGVyUkg4MCA9IFtdOyBmb3IgKGxldCB0PTE4OyB0PD0xOS41OyB0Kz0wLjUpIHdpbnRlclJIODAucHVzaChbdCwgX2dldFcodCwgODApXSk7XG4gICAgY29uc3Qgd2ludGVyUkgyMCA9IFtdOyBmb3IgKGxldCB0PTE5LjU7IHQ+PTE4OyB0LT0wLjUpIHdpbnRlclJIMjAucHVzaChbdCwgX2dldFcodCwgMjApXSk7XG4gICAgY29uc3QgV0lOVEVSID0gWy4uLndpbnRlclJIODAsIC4uLndpbnRlclJIMjBdO1xuXG4gICAgLyogUkggaXNvcGxldGggY3VydmVzIGZvciB0aGUgY2hhcnQgZ3JpZCAqL1xuICAgIGNvbnN0IGlzb3BsZXRocyA9IFsyMCwgNDAsIDYwLCA4MCwgMTAwXTtcblxuICAgIC8qIFRoZW1lIHBhbGV0dGUg4oCUIGRyaXZlcyB0aGUgbGl2ZSBwcmV2aWV3IHNvIHRoZSBkaW0vbGlnaHQgY29udHJvbHNcbiAgICAgKiBoYXZlIHZpc2libGUgZmVlZGJhY2sgcmlnaHQgb24gdGhlIGNoYXJ0LiAgSW4gZGltL2RhcmsgbW9kZSB3ZSBhbHNvXG4gICAgICogYXBwbHkgYSBDU1MgYnJpZ2h0bmVzcyBmaWx0ZXIgbWFwcGVkIGZyb20gY2ZnLmRhcmtMZXZlbCAoMS41IC4uIDIuOFxuICAgICAqIOKGkiAwLjYgLi4gMS40KSBzbyB0aGUgdXNlciBjYW4gU0VFIHRoZSBicmlnaHRuZXNzIHNsaWRlciB3b3JraW5nLiAqL1xuICAgIGNvbnN0IGlzTGlnaHQgPSBjZmcudGhlbWUgPT09ICdsaWdodCc7XG4gICAgY29uc3QgcGFsZXR0ZSA9IGlzTGlnaHRcbiAgICAgICAgPyB7IGJnOicjZjhmYWZjJywgZ3JpZDonI2NiZDVlMScsIHRpY2s6JyM0NzU1NjknLCBheGlzOicjMWUyOTNiJyxcbiAgICAgICAgICAgIHBhbmVsQmc6J3JnYmEoMjQ4LDI1MCwyNTIsMC44NSknLCBwYW5lbEJvcmRlcjonI2NiZDVlMScsXG4gICAgICAgICAgICBwaWxsQmc6JyNlMmU4ZjAnLCBwaWxsRmc6JyM0NzU1NjknLCBtZXRhRmc6JyM2NDc0OGInIH1cbiAgICAgICAgOiB7IGJnOicjMGIxMjIwJywgZ3JpZDonIzFlMjkzYicsIHRpY2s6JyM5NGEzYjgnLCBheGlzOicjY2JkNWUxJyxcbiAgICAgICAgICAgIHBhbmVsQmc6J3JnYmEoMTUsMjMsNDIsMC42KScsIHBhbmVsQm9yZGVyOicjMWUyOTNiJyxcbiAgICAgICAgICAgIHBpbGxCZzonIzFlMjkzYicsIHBpbGxGZzonIzk0YTNiOCcsIG1ldGFGZzonIzY0NzQ4YicgfTtcbiAgICBjb25zdCBkaW1GaWx0ZXIgPSBpc0xpZ2h0XG4gICAgICAgID8gJ25vbmUnXG4gICAgICAgIDogYGJyaWdodG5lc3MoJHsoTWF0aC5tYXgoMS41LCBNYXRoLm1pbigyLjgsIGNmZy5kYXJrTGV2ZWwgfHwgMi4wKSkgLyAyLjApLnRvRml4ZWQoMil9KWA7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdW5kZWQtMnhsIHAtNCBib3JkZXIgdHJhbnNpdGlvbi1jb2xvcnMgZHVyYXRpb24tMzAwXCJcbiAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6IHBhbGV0dGUucGFuZWxCZywgYm9yZGVyQ29sb3I6IHBhbGV0dGUucGFuZWxCb3JkZXJ9fT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIG1iLTNcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJwaWxsXCIgc3R5bGU9e3tiYWNrZ3JvdW5kOnBhbGV0dGUucGlsbEJnLCBjb2xvcjpwYWxldHRlLnBpbGxGZ319PlBTWUNIUk9NRVRSSUMgQ0hBUlQgwrcgbGl2ZSBwcmV2aWV3PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIGZvbnQtbW9ub1wiIHN0eWxlPXt7Y29sb3I6cGFsZXR0ZS5tZXRhRmd9fT57VF9NSU59wrBDIOKGkiB7VF9NQVh9wrBDICDCtyAge2NmZy5yaExvfeKAk3tjZmcucmhIaX0lIFJIPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8c3ZnIHZpZXdCb3g9e2AwIDAgJHtXfSAke0h9YH0gY2xhc3NOYW1lPVwidy1mdWxsIGgtYXV0byB0cmFuc2l0aW9uLVtmaWx0ZXJdIGR1cmF0aW9uLTMwMFwiXG4gICAgICAgICAgICAgICAgIHN0eWxlPXt7YmFja2dyb3VuZDogcGFsZXR0ZS5iZywgYm9yZGVyUmFkaXVzOjgsIGZpbHRlcjogZGltRmlsdGVyfX0+XG4gICAgICAgICAgICAgICAgey8qIC0tLS0gZ3JpZDogdmVydGljYWwgVCBsaW5lcywgaG9yaXpvbnRhbCBXIGxpbmVzIC0tLS0gKi99XG4gICAgICAgICAgICAgICAge0FycmF5LmZyb20oe2xlbmd0aDoxMX0pLm1hcCgoXyxpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBUX01JTiArIChpLzEwKSAqIChUX01BWCAtIFRfTUlOKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxnIGtleT17J3Z0JytpfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17eCh0KX0geTE9e3BhZC50b3B9IHgyPXt4KHQpfSB5Mj17cGFkLnRvcCtncmlkSH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9e3BhbGV0dGUuZ3JpZH0gc3Ryb2tlV2lkdGg9XCIwLjZcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCh0KX0geT17cGFkLnRvcCtncmlkSCsxNn0gZm9udFNpemU9XCI5LjVcIiBmaWxsPXtwYWxldHRlLnRpY2t9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiPnt0LnRvRml4ZWQoMCl9PC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIHtBcnJheS5mcm9tKHtsZW5ndGg6N30pLm1hcCgoXyxpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHcgPSBXX01JTiArIChpLzYpICogKFdfTUFYIC0gV19NSU4pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGcga2V5PXsnaHcnK2l9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXtwYWQubGVmdH0geTE9e3kodyl9IHgyPXtwYWQubGVmdCtncmlkV30geTI9e3kodyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPXtwYWxldHRlLmdyaWR9IHN0cm9rZVdpZHRoPVwiMC42XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3BhZC5sZWZ0LTh9IHk9e3kodykrM30gZm9udFNpemU9XCI5LjVcIiBmaWxsPXtwYWxldHRlLnRpY2t9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cImVuZFwiPnsodyoxMDAwKS50b0ZpeGVkKDApfTwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICB7LyogLS0tLSBSSCBpc29wbGV0aHMgKGN1cnZlcykgLS0tLSAqL31cbiAgICAgICAgICAgICAgICB7aXNvcGxldGhzLm1hcChyaCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHB0cyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB0ID0gVF9NSU47IHQgPD0gVF9NQVg7IHQgKz0gMC41KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB3dyA9IF9nZXRXKHQsIHJoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3dyA+PSBXX01JTiAmJiB3dyA8PSBXX01BWCkgcHRzLnB1c2goW3QsIHd3XSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxnIGtleT17J2lzbycrcmh9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5bGluZSBwb2ludHM9e3NhZmVQdHMocHRzKX0gZmlsbD1cIm5vbmVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9e3JoID09PSAxMDAgPyAnIzYzNjZmMScgOiAnI2VjNDg5OTU1J30gc3Ryb2tlV2lkdGg9XCIwLjhcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2VEYXNoYXJyYXk9e3JoID09PSAxMDAgPyAnJyA6ICczLDMnfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3B0cy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eChwdHNbTWF0aC5mbG9vcihwdHMubGVuZ3RoKjAuNjUpXVswXSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk9e3kocHRzW01hdGguZmxvb3IocHRzLmxlbmd0aCowLjY1KV1bMV0pIC0gNH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU9XCI5XCIgZmlsbD1cIiNlYzQ4OTk5OVwiIGZvbnRXZWlnaHQ9XCI3MDBcIj57cmh9JTwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pfVxuXG4gICAgICAgICAgICAgICAgey8qIC0tLS0gR2l2b25pIG92ZXJsYXkgKGNvcGllZCB2ZXJiYXRpbSBmcm9tIGFwcC5qcyByZW5kZXIgb3JkZXIpIC0tLS0gKi99XG4gICAgICAgICAgICAgICAge2NmZy5naXZvbmkgJiYgKFxuICAgICAgICAgICAgICAgICAgICA8ZyBjbGFzc05hbWU9XCJwb2ludGVyLWV2ZW50cy1ub25lXCIgb3BhY2l0eT1cIjAuOVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3goNDApfSB5MT17eSgxNi8xMDAwKX0geDI9e3goNTApfSB5Mj17eSgxNi8xMDAwKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cIiM2MzY2ZjFcIiBzdHJva2VXaWR0aD1cIjEuNVwiIHN0cm9rZURhc2hhcnJheT1cIjQsNFwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXt4KDUwKX0geTE9e3koMTYvMTAwMCl9IHgyPXt4KDUwKX0geTI9e3koMCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCIjNjM2NmYxXCIgc3Ryb2tlV2lkdGg9XCIxLjVcIiBzdHJva2VEYXNoYXJyYXk9XCI0LDRcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17eCg0MSl9IHkxPXt5KDApfSB4Mj17eCg1MCl9IHkyPXt5KDApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiIzYzNjZmMVwiIHN0cm9rZVdpZHRoPVwiMS41XCIgc3Ryb2tlRGFzaGFycmF5PVwiNCw0XCIvPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoTUNWKX0gIGZpbGw9XCIjZWM0ODk5XCIgZmlsbE9wYWNpdHk9XCIwLjA1XCIgc3Ryb2tlPVwiI2VjNDg5OVwiIHN0cm9rZVdpZHRoPVwiMVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhNYXNzKX0gZmlsbD1cIiM4YjVjZjZcIiBmaWxsT3BhY2l0eT1cIjAuMDVcIiBzdHJva2U9XCIjOGI1Y2Y2XCIgc3Ryb2tlV2lkdGg9XCIxXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKEVWQVApfSBmaWxsPVwiIzA2YjZkNFwiIGZpbGxPcGFjaXR5PVwiMC4wOFwiIHN0cm9rZT1cIiMwNmI2ZDRcIiBzdHJva2VXaWR0aD1cIjFcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoTlYpfSAgIGZpbGw9XCIjZjU5ZTBiXCIgZmlsbE9wYWNpdHk9XCIwLjA1XCIgc3Ryb2tlPVwiI2Y1OWUwYlwiIHN0cm9rZVdpZHRoPVwiMVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhDWil9ICAgZmlsbD1cIiMxMGI5ODFcIiBmaWxsT3BhY2l0eT1cIjAuMTVcIiBzdHJva2U9XCIjMTBiOTgxXCIgc3Ryb2tlV2lkdGg9XCIxLjJcIi8+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBTd2VldC1zcG90IGJhbmQsIGNsaXBwZWQgdG8gQ1ogKi99XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGVmcz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y2xpcFBhdGggaWQ9XCJjei1jbGlwLXdhbGtcIiBjbGlwUGF0aFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKENaKX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvY2xpcFBhdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2RlZnM+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoU1dFRVQpfSBjbGlwUGF0aD1cInVybCgjY3otY2xpcC13YWxrKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxsPVwiIzA1OTY2OVwiIGZpbGxPcGFjaXR5PVwiMC4zMlwiIHN0cm9rZT1cIiMwNDc4NTdcIiBzdHJva2VXaWR0aD1cIjAuOFwiIHN0cm9rZURhc2hhcnJheT1cIjMsMlwiLz5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKFdJTlRFUil9IGZpbGw9XCIjM2I4MmY2XCIgZmlsbE9wYWNpdHk9XCIwLjE1XCIgc3Ryb2tlPVwibm9uZVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXt4KDE5KX0geTE9e3BhZC50b3ArMTh9IHgyPXt4KDE5KX0geTI9e3BhZC50b3ArZ3JpZEh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCIjM2I4MmY2XCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlRGFzaGFycmF5PVwiNiw0XCIgb3BhY2l0eT1cIjAuOFwiLz5cblxuICAgICAgICAgICAgICAgICAgICAgICAgey8qIFJlZ2lvbiBsYWJlbHMg4oCUIHNhbWUgY29sb3JzICYgc3Bpcml0IGFzIGxpdmUgY2hhcnQgKi99XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDUwKS0xMH0geT17eSg4LzEwMDApfSBmaWxsPVwiIzYzNjZmMVwiIGZvbnRTaXplPVwiMTBcIiBmb250V2VpZ2h0PVwiOTAwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiB0cmFuc2Zvcm09e2Byb3RhdGUoLTkwLCAke3goNTApLTEwfSwgJHt5KDgvMTAwMCl9KWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nPVwiMlwiPk1FQ0hBTklDQUwgQ09PTElORzwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goNDQpLTJ9IHk9e3koOC8xMDAwKX0gZmlsbD1cIiNlYzQ4OTlcIiBmb250U2l6ZT1cIjlcIiBmb250V2VpZ2h0PVwiOTAwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiB0cmFuc2Zvcm09e2Byb3RhdGUoLTkwLCAke3goNDQpLTJ9LCAke3koOC8xMDAwKX0pYH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc9XCIxLjVcIj5NQVNTIENPT0xJTkc8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDM3KS0xMH0geT17eSg4LzEwMDApfSBmaWxsPVwiIzhiNWNmNlwiIGZvbnRTaXplPVwiOVwiIGZvbnRXZWlnaHQ9XCI5MDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIHRyYW5zZm9ybT17YHJvdGF0ZSgtOTAsICR7eCgzNyktMTB9LCAke3koOC8xMDAwKX0pYH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc9XCIxLjVcIj5NQVNTIENPT0xJTkc8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDM0KX0geT17eSgwLjUvMTAwMCktOH0gZmlsbD1cIiMwNmI2ZDRcIiBmb250U2l6ZT1cIjlcIiBmb250V2VpZ2h0PVwiOTAwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiBsZXR0ZXJTcGFjaW5nPVwiMlwiPkVWQVBPUkFUSVZFPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCgyMy41KX0geT17eShfZ2V0VygyMy41LCA0NSkpfSBmaWxsPVwiIzEwYjk4MVwiIGZvbnRTaXplPVwiMTFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodD1cIjkwMFwiIHRleHRBbmNob3I9XCJtaWRkbGVcIiBsZXR0ZXJTcGFjaW5nPVwiMS41XCI+Q09NRk9SVDwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goMTguNzUpfSB5PXt5KF9nZXRXKDE4Ljc1LCA0NSkpfSBmaWxsPVwiIzNiODJmNlwiIGZvbnRTaXplPVwiMTFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodD1cIjkwMFwiIHRleHRBbmNob3I9XCJtaWRkbGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtPXtgcm90YXRlKC05MCwgJHt4KDE4Ljc1KX0sICR7eShfZ2V0VygxOC43NSwgNDUpKX0pYH0+V0lOVEVSPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCgyMy41KX0geT17eShfZ2V0VygyMy41LCAoY2ZnLnJoTG8rY2ZnLnJoSGkpLzIpKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw9XCIjMDIyYzIyXCIgZm9udFNpemU9XCI4XCIgZm9udFdlaWdodD1cIjkwMFwiIHRleHRBbmNob3I9XCJtaWRkbGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3twYWludE9yZGVyOidzdHJva2UnLCBzdHJva2U6JyNhN2YzZDAnLCBzdHJva2VXaWR0aDonMi41cHgnLCBzdHJva2VMaW5lam9pbjoncm91bmQnfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc9XCIxLjVcIj57Y2ZnLnJoTG99LXtjZmcucmhIaX0lIFJIPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAgICAgIHsvKiBheGlzIGxhYmVscyAqL31cbiAgICAgICAgICAgICAgICA8dGV4dCB4PXtwYWQubGVmdCArIGdyaWRXLzJ9IHk9e0gtMTJ9IGZvbnRTaXplPVwiMTFcIiBmaWxsPXtwYWxldHRlLmF4aXN9XG4gICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGZvbnRXZWlnaHQ9XCI4MDBcIiBsZXR0ZXJTcGFjaW5nPVwiMlwiPkRSWSBCVUxCIFRFTVAgKMKwQyk8L3RleHQ+XG4gICAgICAgICAgICAgICAgPHRleHQgeD17MTZ9IHk9e3BhZC50b3AgKyBncmlkSC8yfSBmb250U2l6ZT1cIjExXCIgZmlsbD17cGFsZXR0ZS5heGlzfVxuICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiBmb250V2VpZ2h0PVwiODAwXCIgbGV0dGVyU3BhY2luZz1cIjJcIlxuICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybT17YHJvdGF0ZSgtOTAgMTYgJHtwYWQudG9wICsgZ3JpZEgvMn0pYH0+SFVNSURJVFkgUkFUSU8gKGcva2cpPC90ZXh0PlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbmZ1bmN0aW9uIFBzeUNvbnRyb2xQYW5lbCh7IGNmZywgdXBkYXRlLCBzZXRDZmcgfSkge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctc2xhdGUtOTAwLzYwIGJvcmRlciBib3JkZXItc2xhdGUtODAwIHJvdW5kZWQtMnhsIHAtNSBzcGFjZS15LTZcIj5cbiAgICAgICAgICAgIHsvKiBUaGVtZSArIGJyaWdodG5lc3MgIC0tIHJlbG9jYXRlZCBmcm9tIHRoZSBkYXNoYm9hcmQgc2lkZWJhciAyMDI2LTA2LTI1LlxuICAgICAgICAgICAgICAgIFR3byBjb250cm9sczogRGFyay9MaWdodCBtb2RlIHRvZ2dsZSwgYW5kIEJyaWdodG5lc3Mgc2xpZGVyIChvbmx5XG4gICAgICAgICAgICAgICAgbWVhbmluZ2Z1bCBpbiBkYXJrIG1vZGUpLiAgTGl2ZSBwcmV2aWV3IGFwcGxpZXMgdG8gdGhlIHN1cnJvdW5kaW5nXG4gICAgICAgICAgICAgICAgY29udHJvbCBwYW5lbCBzbyB0aGUgb3BlcmF0b3IgY2FuIEZFRUwgdGhlIGNoYW5nZSBiZWZvcmUgc2F2aW5nLiAqL31cbiAgICAgICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJwc3ktY2ZnLXRoZW1lLWJsb2NrXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0yXCI+RGlzcGxheSBNb2RlPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC0yIG1iLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cInBzeS1jZmctdGhlbWUtZGFya1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0Q2ZnKGMgPT4gKHsuLi5jLCB0aGVtZTonZGFyaycsIGRhcmtMZXZlbDpNYXRoLm1pbihjLmRhcmtMZXZlbCB8fCAyLjAsIDIuNil9KSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHktMi41IHJvdW5kZWQtbGcgdGV4dC14cyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgYm9yZGVyIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Y2ZnLnRoZW1lID09PSAnZGFyaydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLXNsYXRlLTgwMCBib3JkZXIteWVsbG93LTUwMC83MCB0ZXh0LXllbGxvdy0zMDAgc2hhZG93LWxnIHNoYWRvdy15ZWxsb3ctNTAwLzEwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctc2xhdGUtOTAwLzMwIGJvcmRlci1zbGF0ZS03MDAgdGV4dC1zbGF0ZS01MDAgaG92ZXI6Ymctc2xhdGUtODAwLzYwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIPCfjJkgIERpbSAvIERhcmtcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJwc3ktY2ZnLXRoZW1lLWxpZ2h0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIHRoZW1lOidsaWdodCcsIGRhcmtMZXZlbDozLjB9KSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHktMi41IHJvdW5kZWQtbGcgdGV4dC14cyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgYm9yZGVyIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Y2ZnLnRoZW1lID09PSAnbGlnaHQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1zbGF0ZS0xMDAgYm9yZGVyLXNreS01MDAvNzAgdGV4dC1za3ktNzAwIHNoYWRvdy1sZyBzaGFkb3ctc2t5LTUwMC8xMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLXNsYXRlLTkwMC8zMCBib3JkZXItc2xhdGUtNzAwIHRleHQtc2xhdGUtNTAwIGhvdmVyOmJnLXNsYXRlLTgwMC82MCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICDimIAgIExpZ2h0XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIHsvKiBCcmlnaHRuZXNzIHNsaWRlciDigJQgb25seSBtZWFuaW5nZnVsIHdoZW4gdGhlbWUgPT09ICdkYXJrJyAqL31cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y2ZnLnRoZW1lID09PSAnbGlnaHQnID8gJ29wYWNpdHktNDAgcG9pbnRlci1ldmVudHMtbm9uZScgOiAnJ30+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIG1iLTFcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTUwMFwiPkRpbSBicmlnaHRuZXNzPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIGZvbnQtbW9ubyB0ZXh0LXllbGxvdy0zMDAgdGFidWxhci1udW1zXCI+e01hdGgucm91bmQoKGNmZy5kYXJrTGV2ZWwgfHwgMi4wKSAqIDEwMCl9JTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJwc3ktY2ZnLWRhcmstbGV2ZWxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluPVwiMS41XCIgbWF4PVwiMi44XCIgc3RlcD1cIjAuMDJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2NmZy50aGVtZSA9PT0gJ2xpZ2h0JyA/IDIuMCA6IChjZmcuZGFya0xldmVsIHx8IDIuMCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldENmZyhjID0+ICh7Li4uYywgZGFya0xldmVsOiBwYXJzZUZsb2F0KGUudGFyZ2V0LnZhbHVlKSwgdGhlbWU6J2RhcmsnfSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2UtaW5wdXQgdy1mdWxsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGFjY2VudENvbG9yOicjZmFjYzE1JyB9fS8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbXQtMiBpdGFsaWNcIj5cbiAgICAgICAgICAgICAgICAgICAgQXBwbGllZCB0byB0aGUgd2hvbGUgZGFzaGJvYXJkLiAgRGltIGlzIHJlY29tbWVuZGVkIGZvciBjb250cm9sIHJvb21zOyBMaWdodCBmb3IgZGF5dGltZSB3YWxrLXRocm91Z2hzLlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogR2l2b25pIHRvZ2dsZSAqL31cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0yXCI+R2l2b25pIEVuZ2luZTwvZGl2PlxuICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gdXBkYXRlKCdnaXZvbmknLCAhY2ZnLmdpdm9uaSl9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B3LWZ1bGwgcHktMyByb3VuZGVkLXhsIHRleHQtc20gZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2NmZy5naXZvbmlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1pbmRpZ28tNjAwIHRleHQtd2hpdGUgc2hhZG93LWxnIHNoYWRvdy1pbmRpZ28tNTAwLzMwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLXNsYXRlLTgwMCB0ZXh0LXNsYXRlLTQwMCBib3JkZXIgYm9yZGVyLXNsYXRlLTcwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgIHtjZmcuZ2l2b25pID8gJ0dpdm9uaSBPTicgOiAnR2l2b25pIE9GRid9XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbXQtMiBsZWFkaW5nLXJlbGF4ZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgT3ZlcmxheXMgdGhlIDQgY2xpbWF0ZS1zdHJhdGVneSByZWdpb25zIChDb21mb3J0LCBOYXQgVmVudCwgRXZhcCwgTWVjaCBDb29sKS5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIFJIIHJhbmdlICovfVxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj5SSCBTd2VldC1TcG90IFJhbmdlPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi0zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTUwMCBtYi0xIGJsb2NrXCI+VmVudWUgcHJlc2V0PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dCBjdXJzb3ItcG9pbnRlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2NmZy5yaFByZXNldCB8fCAnY3VzdG9tJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcCA9IFJIX1BSRVNFVFMuZmluZChwID0+IHAuaWQgPT09IGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFwKSByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwLmlkID09PSAnY3VzdG9tJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlKCdyaFByZXNldCcsICdjdXN0b20nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgcmhQcmVzZXQ6cC5pZCwgcmhMbzpwLmxvLCByaEhpOnAuaGl9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtSSF9QUkVTRVRTLm1hcChwID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIGtleT17cC5pZH0gdmFsdWU9e3AuaWR9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cC5sYWJlbH17cC5sbyAhPSBudWxsID8gYCAgwrcgICR7cC5sb30tJHtwLmhpfSUgUkhgIDogJyd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgICAgIHsoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcCA9IFJIX1BSRVNFVFMuZmluZCh4ID0+IHguaWQgPT09IChjZmcucmhQcmVzZXQgfHwgJ2N1c3RvbScpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwICYmIHAubm90ZSA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0xLjUgaXRhbGljXCI+e3Aubm90ZX08L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICApIDogbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfSkoKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zIG1iLTJcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyBmb250LW1vbm8gdGV4dC1zbGF0ZS00MDAgdy0xMFwiPntjZmcucmhMb30lPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPVwiMjBcIiBtYXg9e2NmZy5yaEhpLTV9IHZhbHVlPXtjZmcucmhMb31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0Q2ZnKGMgPT4gKHsuLi5jLCByaExvOitlLnRhcmdldC52YWx1ZSwgcmhQcmVzZXQ6J2N1c3RvbSd9KSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyYW5nZS1pbnB1dCBmbGV4LTFcIi8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtM1wiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtbW9ubyB0ZXh0LXNsYXRlLTQwMCB3LTEwXCI+e2NmZy5yaEhpfSU8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49e2NmZy5yaExvKzV9IG1heD1cIjkwXCIgdmFsdWU9e2NmZy5yaEhpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIHJoSGk6K2UudGFyZ2V0LnZhbHVlLCByaFByZXNldDonY3VzdG9tJ30pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLWlucHV0IGZsZXgtMVwiLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogQXhpcyByYW5nZSAqL31cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0yXCI+VGVtcGVyYXR1cmUgQXhpcyBSYW5nZTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTMgbWItMlwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtbW9ubyB0ZXh0LXNsYXRlLTQwMCB3LTEwXCI+e2NmZy50TG99wrA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49XCItNDBcIiBtYXg9e2NmZy50SGktMTB9IHZhbHVlPXtjZmcudExvfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGUoJ3RMbycsICtlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyYW5nZS1pbnB1dCBmbGV4LTFcIi8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtM1wiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtbW9ubyB0ZXh0LXNsYXRlLTQwMCB3LTEwXCI+e2NmZy50SGl9wrA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49e2NmZy50TG8rMTB9IG1heD1cIjYwXCIgdmFsdWU9e2NmZy50SGl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZSgndEhpJywgK2UudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLWlucHV0IGZsZXgtMVwiLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0yIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgICAgICBDaGFydCB3aWxsIGJlIHJlZHJhd24gd2l0aCB0aGlzIGRyeS1idWxiIHRlbXBlcmF0dXJlIHdpbmRvdy5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib3JkZXItdCBib3JkZXItc2xhdGUtODAwIHB0LTRcIj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBsZWFkaW5nLXJlbGF4ZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgQ2hhbmdlcyBwcmV2aWV3IGxpdmUgaW4gdGhlIHNrZWxldG9uIGNoYXJ0IG9uIHRoZSBsZWZ0LiAgSGl0XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtaW5kaWdvLTQwMCBmb250LWJsYWNrXCI+IFNhdmUgJiByZXR1cm4gPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICBpbiB0aGUgaGVhZGVyIHdoZW4geW91J3JlIGhhcHB5LlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBMb2NhdGlvbiBTZXR0aW5nIC0tIG1vZGFsIHcvIGludGVyYWN0aXZlIExlYWZsZXQgbWFwICsgcmV2ZXJzZSBnZW9jb2RpbmdcbiAqIENsaWNrIGFueXdoZXJlIG9uIHRoZSBtYXAgKG9yIGRyYWcgdGhlIG1hcmtlcikgdG8gc2V0IGxhdC9sb24uXG4gKiBNYW51YWwgbGF0L2xvbiBlZGl0cyByZS1jZW50cmUgdGhlIG1hcmtlci4gIENpdHkgbmFtZSBpcyBhdXRvLXBvcHVsYXRlZFxuICogdmlhIE9wZW5TdHJlZXRNYXAgTm9taW5hdGltIChubyBrZXkgcmVxdWlyZWQsIHJhdGUtbGltaXRlZCB0byB+MSByZXEvcykuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qIERlLWR1cCArIHNhbml0eS1jaGVjayBhIHJhdyBzYXZlZC1sb2NhdGlvbnMgYXJyYXkgKGZyb20gc2VydmVyIG9yXG4gKiBsb2NhbFN0b3JhZ2UpLiAgRHJvcHMgZW50cmllcyBtaXNzaW5nIGEgbmFtZSBvciB3aXRoIG5vbi1maW5pdGUgbGF0L2xvbixcbiAqIGtlZXBzIHRoZSBGSVJTVCBvY2N1cnJlbmNlIG9mIGVhY2ggdW5pcXVlIG5hbWUuICBVc2VkIGJ5IExvY2F0aW9uTW9kYWwnc1xuICogU2l0ZS1uYW1lIGRhdGFsaXN0IGJlbG93LiAqL1xuZnVuY3Rpb24gX25vcm1hbGl6ZUxvY3MoYXJyKSB7XG4gICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQoKTtcbiAgICBjb25zdCBvdXQgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGwgb2YgKGFyciB8fCBbXSkpIHtcbiAgICAgICAgaWYgKCFsIHx8IHR5cGVvZiBsLm5hbWUgIT09ICdzdHJpbmcnKSBjb250aW51ZTtcbiAgICAgICAgY29uc3QgbGF0ID0gK2wubGF0LCBsb24gPSArbC5sb247XG4gICAgICAgIGlmICghTnVtYmVyLmlzRmluaXRlKGxhdCkgfHwgIU51bWJlci5pc0Zpbml0ZShsb24pKSBjb250aW51ZTtcbiAgICAgICAgY29uc3Qga2V5ID0gbC5uYW1lLnRyaW0oKTtcbiAgICAgICAgaWYgKCFrZXkgfHwgc2Vlbi5oYXMoa2V5KSkgY29udGludWU7XG4gICAgICAgIHNlZW4uYWRkKGtleSk7XG4gICAgICAgIG91dC5wdXNoKHsgbmFtZTprZXksIGxhdCwgbG9uIH0pO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xufVxuXG5mdW5jdGlvbiBMb2NhdGlvbk1vZGFsKHsgY2ZnLCBzZXRDZmcsIG9uQ2xvc2UsIG9uU2F2ZSB9KSB7XG4gICAgY29uc3QgbWFwQm94UmVmID0gUmVhY3QudXNlUmVmKG51bGwpO1xuICAgIGNvbnN0IG1hcFJlZiAgICA9IFJlYWN0LnVzZVJlZihudWxsKTtcbiAgICBjb25zdCBtYXJrZXJSZWYgPSBSZWFjdC51c2VSZWYobnVsbCk7XG4gICAgY29uc3QgW2dlb0J1c3ksIHNldEdlb0J1c3ldID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuXG4gICAgLyogLS0tLS0gc2F2ZWQgbG9jYXRpb25zIC0tIG1pcnJvciB3aGF0IHRoZSBEYXNoYm9hcmQncyBXZWF0aGVyIGJ1dHRvbiBzaG93cy5cbiAgICAgKlxuICAgICAqIFRoZSBkYXNoYm9hcmQgcmVhZHMgdGhlbSBmcm9tIGAke0FQSV9VUkx9L2FwaS93ZWF0aGVyLWxvY2F0aW9uYCdzXG4gICAgICogYHNhdmVkYCBhcnJheSBhbmQgbWlycm9ycyB0aGF0IGludG8gbG9jYWxTdG9yYWdlWydzYXZlZFdlYXRoZXJMb2NhdGlvbnMnXVxuICAgICAqIG9uIG1vdW50IChzZWUgcHVibGljL2pzL2Rhc2hib2FyZC9hcHAuanMjaHlkcmF0ZVdlYXRoZXJTdGF0ZSkuICBXZSBkb1xuICAgICAqIHRoZSBTQU1FIHRoaW5nIGhlcmUgc28gdGhlIFNldHVwIFdhbGsncyBTaXRlLW5hbWUgZHJvcGRvd24gc3RheXNcbiAgICAgKiBieXRlLWlkZW50aWNhbCB3aXRoIHRoZSBkYXNoYm9hcmQncyBsb2NhdGlvbiBsaXN0IC0tIGluY2x1ZGluZyB3aGVuIHRoZVxuICAgICAqIG9wZXJhdG9yIHZpc2l0cyBTZXR1cCBXYWxrIEJFRk9SRSBldmVyIG9wZW5pbmcgdGhlIGRhc2hib2FyZCAoZnJlc2hcbiAgICAgKiBkZXZpY2UgY2FzZSB3aGVyZSBsb2NhbFN0b3JhZ2UgaXMgZW1wdHkpLlxuICAgICAqXG4gICAgICogU3RyYXRlZ3k6XG4gICAgICogICAxKSBSZWFkIGxvY2FsU3RvcmFnZSBmaXJzdCAoaW5zdGFudCwgbm8gZmxpY2tlciBpZiBhbHJlYWR5IGh5ZHJhdGVkKS5cbiAgICAgKiAgIDIpIFRoZW4gR0VUIC9hcGkvd2VhdGhlci1sb2NhdGlvbiAoY2Fub25pY2FsLCBjcm9zcy1kZXZpY2Ugc291cmNlKS5cbiAgICAgKiAgIDMpIFdoaWNoZXZlciBpcyBub24tZW1wdHkgd2luczsgc2VydmVyIHdpbnMgdGllcy5cbiAgICAgKlxuICAgICAqIEZyZWUtZm9ybSB0eXBpbmcgaW4gdGhlIGlucHV0IHN0aWxsIHdvcmtzIC0tIHRoZSBkYXRhbGlzdCBpcyBzdWdnZXN0aW9uXG4gICAgICogb25seSwgdGhlIGlucHV0IG5ldmVyIHJlc3RyaWN0cyB0aGUgdmFsdWUuICovXG4gICAgY29uc3QgW3NhdmVkTG9jcywgc2V0U2F2ZWRMb2NzXSA9IFJlYWN0LnVzZVN0YXRlKCgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJhdyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzYXZlZFdlYXRoZXJMb2NhdGlvbnMnKTtcbiAgICAgICAgICAgIGlmICghcmF3KSByZXR1cm4gW107XG4gICAgICAgICAgICBjb25zdCBhcnIgPSBKU09OLnBhcnNlKHJhdyk7XG4gICAgICAgICAgICByZXR1cm4gQXJyYXkuaXNBcnJheShhcnIpID8gX25vcm1hbGl6ZUxvY3MoYXJyKSA6IFtdO1xuICAgICAgICB9IGNhdGNoIChlKSB7IHJldHVybiBbXTsgfVxuICAgIH0pO1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGxldCBjYW5jZWxsZWQgPSBmYWxzZTtcbiAgICAgICAgKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKCcvYXBpL3dlYXRoZXItbG9jYXRpb24nLCB7IGNyZWRlbnRpYWxzOidpbmNsdWRlJywgY2FjaGU6J25vLXN0b3JlJyB9KTtcbiAgICAgICAgICAgICAgICBpZiAoIXIub2spIHJldHVybjtcbiAgICAgICAgICAgICAgICBjb25zdCBqID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2F2ZWQgPSBfbm9ybWFsaXplTG9jcyhBcnJheS5pc0FycmF5KGouc2F2ZWQpID8gai5zYXZlZCA6IFtdKTtcbiAgICAgICAgICAgICAgICBpZiAoY2FuY2VsbGVkKSByZXR1cm47XG4gICAgICAgICAgICAgICAgaWYgKHNhdmVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0U2F2ZWRMb2NzKHNhdmVkKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gTWlycm9yIHRvIGxvY2FsU3RvcmFnZSBzbyB0aGUgZGFzaGJvYXJkIHNlZXMgdGhlIHNhbWUgbGlzdFxuICAgICAgICAgICAgICAgICAgICAvLyBldmVuIGlmIGl0cyBvd24gaHlkcmF0ZSBoYXNuJ3QgcnVuIHlldCB0aGlzIHNlc3Npb24uXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzYXZlZFdlYXRoZXJMb2NhdGlvbnMnLCBKU09OLnN0cmluZ2lmeShzYXZlZCkpOyB9IGNhdGNoIChlKSB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogb2ZmbGluZSAtPiBsb2NhbFN0b3JhZ2UgdmFsdWUgYWxyZWFkeSBpbiBzdGF0ZSAqLyB9XG4gICAgICAgIH0pKCk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7IGNhbmNlbGxlZCA9IHRydWU7IH07XG4gICAgfSwgW10pO1xuXG4gICAgLyogLS0tLS0gc2F2ZWQtbG9jYXRpb25zIGRyb3Bkb3duIG9wZW4vY2xvc2Ugc3RhdGUuXG4gICAgICogTmF0aXZlIDxkYXRhbGlzdD4gaGlkZXMgaXRzIGNoZXZyb24gaW4gbW9zdCBicm93c2VycyAoZXNwZWNpYWxseSBpblxuICAgICAqIGEgZGFyayB0aGVtZSksIHdoaWNoIG1hZGUgdGhlIFwiZHJvcCBkb3duXCIgaW52aXNpYmxlIHRvIG9wZXJhdG9yc1xuICAgICAqIHdobyBjbGVhcmx5IGhhZCBtdWx0aXBsZSBzYXZlZCBsb2NhdGlvbnMuICBSZXBsYWNlZCB3aXRoIGEgY3VzdG9tXG4gICAgICogcG9wZG93biBwYW5lbCB0aGF0IGhhcyBhbiBBTFdBWVMtVklTSUJMRSBjaGV2cm9uIGJ1dHRvbiAtLSBjbGljayBpdFxuICAgICAqIHRvIHRvZ2dsZSwgY2xpY2sgb3V0c2lkZSB0byBkaXNtaXNzLiAqL1xuICAgIGNvbnN0IFtzYXZlZE9wZW4sIHNldFNhdmVkT3Blbl0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3Qgc2F2ZWRSZWYgPSBSZWFjdC51c2VSZWYobnVsbCk7XG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKCFzYXZlZE9wZW4pIHJldHVybjtcbiAgICAgICAgY29uc3Qgb25Eb2NDbGljayA9IChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoc2F2ZWRSZWYuY3VycmVudCAmJiAhc2F2ZWRSZWYuY3VycmVudC5jb250YWlucyhlLnRhcmdldCkpIHNldFNhdmVkT3BlbihmYWxzZSk7XG4gICAgICAgIH07XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spO1xuICAgICAgICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2NDbGljayk7XG4gICAgfSwgW3NhdmVkT3Blbl0pO1xuXG4gICAgLyogV2hlbiB0aGUgdXNlciBwaWNrcyBhIG5hbWUgZnJvbSB0aGUgZHJvcGRvd24gT1IgdHlwZXMgb25lIHRoYXRcbiAgICAgKiBleGFjdGx5IG1hdGNoZXMgYSBzYXZlZCBlbnRyeSwgcHVsbCBpdHMgbGF0L2xvbiBhbmQgcmVjZW50cmUgdGhlXG4gICAgICogbWFwLiAgRnJlZS1mb3JtIHR5cGluZyBzdGlsbCB3b3JrcyAtLSB0aGUgbmFtZSBpcyBqdXN0IGtlcHQgYXMgdGhlXG4gICAgICogc2l0ZSBsYWJlbC4gIEF2b2lkcyBzdXJwcmlzaW5nIHRoZSBvcGVyYXRvciB3aG8gdHlwZXMgXCJQYXZpbGlvbiBCXCJcbiAgICAgKiAoYSBsYWJlbCB0aGV5IGludmVudGVkKSBhbmQgZXhwZWN0cyB0aGUgbWFwIE5PVCB0byBqdW1wLiAqL1xuICAgIGNvbnN0IG9uU2l0ZU5hbWVDaGFuZ2UgPSAobmV3TmFtZSkgPT4ge1xuICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIHNpdGVOYW1lOm5ld05hbWV9KSk7XG4gICAgICAgIGNvbnN0IGhpdCA9IHNhdmVkTG9jcy5maW5kKHMgPT4gcy5uYW1lID09PSBuZXdOYW1lKTtcbiAgICAgICAgaWYgKGhpdCkge1xuICAgICAgICAgICAgY29uc3QgbGF0ID0gTWF0aC5yb3VuZChoaXQubGF0ICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgICAgICBjb25zdCBsb24gPSBNYXRoLnJvdW5kKGhpdC5sb24gKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgc2l0ZU5hbWU6bmV3TmFtZSwgbGF0LCBsb24sIGNpdHk6bmV3TmFtZX0pKTtcbiAgICAgICAgICAgIGlmIChtYXBSZWYuY3VycmVudCkgbWFwUmVmLmN1cnJlbnQuc2V0VmlldyhbbGF0LCBsb25dLCAxMSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IHBpY2tTYXZlZExvYyA9IChsb2MpID0+IHtcbiAgICAgICAgc2V0U2F2ZWRPcGVuKGZhbHNlKTtcbiAgICAgICAgb25TaXRlTmFtZUNoYW5nZShsb2MubmFtZSk7XG4gICAgfTtcblxuICAgIC8qIC0tLS0tIHNlYXJjaCBzdGF0ZSAtLS0tLSAqL1xuICAgIGNvbnN0IFtzZWFyY2hRLCBzZXRTZWFyY2hRXSAgICAgICAgID0gUmVhY3QudXNlU3RhdGUoJycpO1xuICAgIGNvbnN0IFtzZWFyY2hIaXRzLCBzZXRTZWFyY2hIaXRzXSAgID0gUmVhY3QudXNlU3RhdGUoW10pO1xuICAgIGNvbnN0IFtzZWFyY2hCdXN5LCBzZXRTZWFyY2hCdXN5XSAgID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IFtzZWFyY2hPcGVuLCBzZXRTZWFyY2hPcGVuXSAgID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IHNlYXJjaERlYm91bmNlUmVmICAgICAgICAgICAgID0gUmVhY3QudXNlUmVmKG51bGwpO1xuXG4gICAgLyogRm9yd2FyZC1nZW9jb2RlOiBxdWVyeSAtPiBbe2xhdCwgbG9uLCBkaXNwbGF5X25hbWUsIHR5cGUsIC4uLn1dICovXG4gICAgY29uc3QgcnVuU2VhcmNoID0gYXN5bmMgKHEpID0+IHtcbiAgICAgICAgaWYgKCFxIHx8IHEudHJpbSgpLmxlbmd0aCA8IDMpIHsgc2V0U2VhcmNoSGl0cyhbXSk7IHJldHVybjsgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2V0U2VhcmNoQnVzeSh0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGBodHRwczovL25vbWluYXRpbS5vcGVuc3RyZWV0bWFwLm9yZy9zZWFyY2g/Zm9ybWF0PWpzb24mbGltaXQ9NiZxPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHEpfWA7XG4gICAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7IGhlYWRlcnM6eyAnQWNjZXB0JzonYXBwbGljYXRpb24vanNvbicgfSB9KTtcbiAgICAgICAgICAgIGNvbnN0IGogPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgICAgIHNldFNlYXJjaEhpdHMoQXJyYXkuaXNBcnJheShqKSA/IGogOiBbXSk7XG4gICAgICAgICAgICBzZXRTZWFyY2hPcGVuKHRydWUpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IHNldFNlYXJjaEhpdHMoW10pOyB9XG4gICAgICAgIGZpbmFsbHkgeyBzZXRTZWFyY2hCdXN5KGZhbHNlKTsgfVxuICAgIH07XG5cbiAgICAvKiBkZWJvdW5jZWQgc2VhcmNoLW9uLXR5cGUgKi9cbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoc2VhcmNoRGVib3VuY2VSZWYuY3VycmVudCkgY2xlYXJUaW1lb3V0KHNlYXJjaERlYm91bmNlUmVmLmN1cnJlbnQpO1xuICAgICAgICBzZWFyY2hEZWJvdW5jZVJlZi5jdXJyZW50ID0gc2V0VGltZW91dCgoKSA9PiBydW5TZWFyY2goc2VhcmNoUSksIDQwMCk7XG4gICAgICAgIHJldHVybiAoKSA9PiBzZWFyY2hEZWJvdW5jZVJlZi5jdXJyZW50ICYmIGNsZWFyVGltZW91dChzZWFyY2hEZWJvdW5jZVJlZi5jdXJyZW50KTtcbiAgICB9LCBbc2VhcmNoUV0pO1xuXG4gICAgY29uc3QgcGlja1NlYXJjaEhpdCA9IChoaXQpID0+IHtcbiAgICAgICAgY29uc3QgbGF0ID0gTWF0aC5yb3VuZCgraGl0LmxhdCAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICBjb25zdCBsb24gPSBNYXRoLnJvdW5kKCtoaXQubG9uICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgbGF0LCBsb24sIGNpdHk6aGl0LmRpc3BsYXlfbmFtZX0pKTtcbiAgICAgICAgaWYgKG1hcFJlZi5jdXJyZW50KSBtYXBSZWYuY3VycmVudC5zZXRWaWV3KFtsYXQsIGxvbl0sIGhpdC50eXBlID09PSAnY2l0eScgPyAxMSA6IDE1KTtcbiAgICAgICAgc2V0U2VhcmNoT3BlbihmYWxzZSk7XG4gICAgICAgIHNldFNlYXJjaFEoJycpO1xuICAgIH07XG5cbiAgICAvKiBSZXZlcnNlLWdlb2NvZGUgbGF0L2xvbiAtPiBjaXR5IC8gY291bnRyeSB2aWEgTm9taW5hdGltLiAgTm8gQVBJIGtleS4gKi9cbiAgICBjb25zdCByZXZlcnNlR2VvY29kZSA9IGFzeW5jIChsYXQsIGxvbikgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2V0R2VvQnVzeSh0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGBodHRwczovL25vbWluYXRpbS5vcGVuc3RyZWV0bWFwLm9yZy9yZXZlcnNlP2Zvcm1hdD1qc29uJmxhdD0ke2xhdH0mbG9uPSR7bG9ufSZ6b29tPTEwYDtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCh1cmwsIHsgaGVhZGVyczogeyAnQWNjZXB0JzonYXBwbGljYXRpb24vanNvbicgfSB9KTtcbiAgICAgICAgICAgIGNvbnN0IGogPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgICAgIGNvbnN0IGEgPSBqLmFkZHJlc3MgfHwge307XG4gICAgICAgICAgICBjb25zdCBjaXR5ID0gYS5jaXR5IHx8IGEudG93biB8fCBhLnZpbGxhZ2UgfHwgYS5oYW1sZXQgfHwgYS5jb3VudHkgfHwgJyc7XG4gICAgICAgICAgICBjb25zdCByZWdpb24gPSBhLnN0YXRlIHx8IGEucmVnaW9uIHx8ICcnO1xuICAgICAgICAgICAgY29uc3QgY291bnRyeSA9IGEuY291bnRyeSB8fCAnJztcbiAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gW2NpdHksIHJlZ2lvbiwgY291bnRyeV0uZmlsdGVyKEJvb2xlYW4pLmpvaW4oJywgJykgfHwgai5kaXNwbGF5X25hbWUgfHwgJyc7XG4gICAgICAgICAgICBpZiAobGFiZWwpIHNldENmZyhjID0+ICh7Li4uYywgY2l0eTpsYWJlbH0pKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBvZmZsaW5lIG9yIHJhdGUtbGltaXRlZCAtPiBrZWVwIHByaW9yIG5hbWUgKi8gfVxuICAgICAgICBmaW5hbGx5IHsgc2V0R2VvQnVzeShmYWxzZSk7IH1cbiAgICB9O1xuXG4gICAgLyogSW5pdCBMZWFmbGV0IG9uIGZpcnN0IHJlbmRlciBvZiB0aGUgbW9kYWwgKi9cbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoIW1hcEJveFJlZi5jdXJyZW50IHx8IG1hcFJlZi5jdXJyZW50KSByZXR1cm47XG4gICAgICAgIGNvbnN0IG1hcCA9IEwubWFwKG1hcEJveFJlZi5jdXJyZW50LCB7IHpvb21Db250cm9sOiB0cnVlLCBhdHRyaWJ1dGlvbkNvbnRyb2w6IHRydWUgfSlcbiAgICAgICAgICAgICAgICAgICAgIC5zZXRWaWV3KFtjZmcubGF0LCBjZmcubG9uXSwgNik7XG4gICAgICAgIEwudGlsZUxheWVyKCdodHRwczovL3tzfS50aWxlLm9wZW5zdHJlZXRtYXAub3JnL3t6fS97eH0ve3l9LnBuZycsIHtcbiAgICAgICAgICAgIG1heFpvb206IDE4LFxuICAgICAgICAgICAgYXR0cmlidXRpb246ICcmY29weTsgT3BlblN0cmVldE1hcCBjb250cmlidXRvcnMnLFxuICAgICAgICB9KS5hZGRUbyhtYXApO1xuXG4gICAgICAgIGNvbnN0IG1hcmtlciA9IEwubWFya2VyKFtjZmcubGF0LCBjZmcubG9uXSwgeyBkcmFnZ2FibGU6IHRydWUgfSkuYWRkVG8obWFwKTtcbiAgICAgICAgbWFya2VyLmJpbmRUb29sdGlwKCdEcmFnIG1lIG9yIGNsaWNrIGFueXdoZXJlIG9uIHRoZSBtYXAnLCB7IHBlcm1hbmVudDogZmFsc2UgfSk7XG5cbiAgICAgICAgY29uc3QgYXBwbHlMYXRMb24gPSAobGF0LCBsb24pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHIgPSAobikgPT4gTWF0aC5yb3VuZChuICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIGxhdDpyKGxhdCksIGxvbjpyKGxvbil9KSk7XG4gICAgICAgICAgICByZXZlcnNlR2VvY29kZShyKGxhdCksIHIobG9uKSk7XG4gICAgICAgIH07XG4gICAgICAgIG1hcmtlci5vbignZHJhZ2VuZCcsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxsID0gbWFya2VyLmdldExhdExuZygpO1xuICAgICAgICAgICAgYXBwbHlMYXRMb24obGwubGF0LCBsbC5sbmcpO1xuICAgICAgICB9KTtcbiAgICAgICAgbWFwLm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICBtYXJrZXIuc2V0TGF0TG5nKGUubGF0bG5nKTtcbiAgICAgICAgICAgIGFwcGx5TGF0TG9uKGUubGF0bG5nLmxhdCwgZS5sYXRsbmcubG5nKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbWFwUmVmLmN1cnJlbnQgPSBtYXA7XG4gICAgICAgIG1hcmtlclJlZi5jdXJyZW50ID0gbWFya2VyO1xuXG4gICAgICAgIC8qIExlYWZsZXQgcmVuZGVycyBibGFuayBpZiBpdCBib290cyBpbnNpZGUgYSBoaWRkZW4gZWxlbWVudCDigJQga2ljayBpdFxuICAgICAgICAgICBvbmNlIHRoZSBtb2RhbCBhbmltYXRpb24gc2V0dGxlcy4gKi9cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiBtYXAuaW52YWxpZGF0ZVNpemUoKSwgMjUwKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHsgbWFwLnJlbW92ZSgpOyBtYXBSZWYuY3VycmVudCA9IG51bGw7IG1hcmtlclJlZi5jdXJyZW50ID0gbnVsbDsgfTtcbiAgICB9LCBbXSk7XG5cbiAgICAvKiBLZWVwIG1hcmtlciBpbiBzeW5jIHdoZW4gdXNlciBlZGl0cyBsYXQvbG9uIGZpZWxkcyBtYW51YWxseSAqL1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmIChtYXBSZWYuY3VycmVudCAmJiBtYXJrZXJSZWYuY3VycmVudCkge1xuICAgICAgICAgICAgbWFya2VyUmVmLmN1cnJlbnQuc2V0TGF0TG5nKFtjZmcubGF0LCBjZmcubG9uXSk7XG4gICAgICAgICAgICBtYXBSZWYuY3VycmVudC5wYW5UbyhbY2ZnLmxhdCwgY2ZnLmxvbl0pO1xuICAgICAgICB9XG4gICAgfSwgW2NmZy5sYXQsIGNmZy5sb25dKTtcblxuICAgIC8qIEdlb2xvY2F0aW9uOiBzaWxlbnRseSBuby1vcCdkIGJlZm9yZSAtLSBpZiB0aGUgYnJvd3NlciBibG9ja2VkIHRoZVxuICAgICAqIHJlcXVlc3QgKEhUVFAgb3JpZ2luID0gbm90IGEgc2VjdXJlIGNvbnRleHQgb24gZmllbGQgY29udHJvbGxlcnMsIG9yXG4gICAgICogdGhlIHVzZXIgZGVuaWVkIHBlcm1pc3Npb24gZWFybGllcikgdGhlIGJ1dHRvbiBqdXN0IHNhdCB0aGVyZS5cbiAgICAgKiBOb3cgd2Ugc3VyZmFjZSBhIHN0YXRlIChidXN5IC8gZXJyKSBzbyB0aGUgb3BlcmF0b3IgY2FuIHNlZSBXSFkgaXRcbiAgICAgKiBmYWlsZWQgYW5kIGFjdCBvbiBpdCAoc3dpdGNoIHRvIEhUVFBTLCByZS1wcm9tcHQsIG9yIHVzZSB0aGUgbWFwKS4gKi9cbiAgICBjb25zdCBbZ2VvU3RhdGUsIHNldEdlb1N0YXRlXSA9IFJlYWN0LnVzZVN0YXRlKG51bGwpOyAgIC8vIG51bGwgfCAnYnVzeScgfCB7ZXJyfVxuICAgIGNvbnN0IHVzZU15TG9jYXRpb24gPSAoKSA9PiB7XG4gICAgICAgIHNldEdlb1N0YXRlKCdidXN5Jyk7XG4gICAgICAgIC8vIG5hdmlnYXRvci5nZW9sb2NhdGlvbiBpcyBgdW5kZWZpbmVkYCBvbiBIVFRQIG9yaWdpbnMgKENocm9tZSA1MCspLlxuICAgICAgICBpZiAoIW5hdmlnYXRvci5nZW9sb2NhdGlvbikge1xuICAgICAgICAgICAgc2V0R2VvU3RhdGUoeyBlcnI6J0Jyb3dzZXIgYmxvY2tlZCBsb2NhdGlvbiBhY2Nlc3Mg4oCUIG9wZW4gdGhpcyBwYWdlIHZpYSBIVFRQUy4nIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oXG4gICAgICAgICAgICAocG9zKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGF0ID0gTWF0aC5yb3VuZChwb3MuY29vcmRzLmxhdGl0dWRlICAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxvbiA9IE1hdGgucm91bmQocG9zLmNvb3Jkcy5sb25naXR1ZGUgKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIGxhdCwgbG9ufSkpO1xuICAgICAgICAgICAgICAgIGlmIChtYXBSZWYuY3VycmVudCkgbWFwUmVmLmN1cnJlbnQuc2V0VmlldyhbbGF0LCBsb25dLCAxMSk7XG4gICAgICAgICAgICAgICAgcmV2ZXJzZUdlb2NvZGUobGF0LCBsb24pO1xuICAgICAgICAgICAgICAgIHNldEdlb1N0YXRlKG51bGwpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBlcnIuY29kZTogMT1QRVJNSVNTSU9OX0RFTklFRCwgMj1QT1NJVElPTl9VTkFWQUlMQUJMRSwgMz1USU1FT1VUXG4gICAgICAgICAgICAgICAgY29uc3QgbXNnID0gZXJyICYmIGVyci5jb2RlID09PSAxXG4gICAgICAgICAgICAgICAgICAgID8gJ0xvY2F0aW9uIHBlcm1pc3Npb24gZGVuaWVkIOKAlCBjbGljayB0aGUgbG9jayBpY29uIGluIHRoZSBhZGRyZXNzIGJhciBhbmQgYWxsb3cgbG9jYXRpb24uJ1xuICAgICAgICAgICAgICAgICAgICA6IGVyciAmJiBlcnIuY29kZSA9PT0gMlxuICAgICAgICAgICAgICAgICAgICAgICAgPyAnTG9jYXRpb24gY3VycmVudGx5IHVuYXZhaWxhYmxlIOKAlCB0aGUgZGV2aWNlIGhhcyBubyBHUFMgLyBXaS1GaSBmaXggeWV0LidcbiAgICAgICAgICAgICAgICAgICAgICAgIDogZXJyICYmIGVyci5jb2RlID09PSAzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnTG9jYXRpb24gcmVxdWVzdCB0aW1lZCBvdXQg4oCUIHRyeSBhZ2Fpbiwgb3IgdXNlIHRoZSBtYXAgLyBzZWFyY2ggYmFyLidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IChlcnIgJiYgZXJyLm1lc3NhZ2UpIHx8ICdDb3VsZCBub3QgcmVhZCBkZXZpY2UgbG9jYXRpb24uJztcbiAgICAgICAgICAgICAgICBzZXRHZW9TdGF0ZSh7IGVycjogbXNnIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgZW5hYmxlSGlnaEFjY3VyYWN5OnRydWUsIHRpbWVvdXQ6MTAwMDAsIG1heGltdW1BZ2U6MCB9XG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIC8qIFdoZW4gdXNlciBjbGlja3MgXCJTYXZlICYgcmV0dXJuXCIsIG1pcnJvciBFWEFDVExZIHdoYXQgdGhlIGRhc2hib2FyZCdzXG4gICAgICogV2VhdGhlciBidXR0b24gZG9lcyBpbiB3ZWF0aGVyLXNldHRpbmdzLW1vZGFsLmpzI3NlbGVjdExvY2F0aW9uOlxuICAgICAqICAgMS4gbG9jYWxTdG9yYWdlWyd3ZWF0aGVyTG9jYXRpb24nXSAgICAgICAgPSBjaG9zZW4gbG9jIChjYW5vbmljYWwga2V5XG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGRhc2hib2FyZCByZWFkcyBvblxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vdW50LCBOT1QgJ3JlZDUud2VhdGhlcl9sb2NhdGlvbicpLlxuICAgICAqICAgMi4gbG9jYWxTdG9yYWdlWydzYXZlZFdlYXRoZXJMb2NhdGlvbnMnXSAgPSBbbG9jLCAuLi5vdGhlcnNdIGRlZHVwZWRcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBieSBsYXQvbG9uLCBjYXBwZWQgYXQgMjAuXG4gICAgICogICAzLiBQT1NUIC9hcGkvd2VhdGhlci1sb2NhdGlvbiB3aXRoIGFjdGl2ZStkZWZhdWx0K3NhdmVkIHNvIHRoZSBzYW1lXG4gICAgICogICAgICBsaXN0IHN1cnZpdmVzIGNyb3NzLWRldmljZSBzZXNzaW9ucyBmb3Igc2lnbmVkLWluIHRlbmFudHMuXG4gICAgICpcbiAgICAgKiBXaXRob3V0IHN0ZXAgMSB0aGUgZGFzaGJvYXJkJ3MgYHdlYXRoZXJMb2NhdGlvbmAgc3RhdGUgc2lsZW50bHkga2VlcHNcbiAgICAgKiBpdHMgb2xkIHZhbHVlIC0tIHdoaWNoIGlzIGV4YWN0bHkgdGhlIGJ1ZyBvcGVyYXRvcnMgcmVwb3J0ZWQgYWZ0ZXJcbiAgICAgKiBwaWNraW5nIGEgbG9jYXRpb24gaW4gU2V0dXAgV2FsayBhbmQgc2VlaW5nIHRoZSBkYXNoYm9hcmQncyB3ZWF0aGVyXG4gICAgICogc3RyaXAgcmVmdXNlIHRvIHVwZGF0ZS4gKi9cbiAgICBjb25zdCBbc2F2ZU1zZywgc2V0U2F2ZU1zZ10gPSBSZWFjdC51c2VTdGF0ZShudWxsKTtcbiAgICBjb25zdCBwZXJzaXN0QW5kU2F2ZSA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgbG9jID0geyBsYXQ6IGNmZy5sYXQsIGxvbjogY2ZnLmxvbiwgbmFtZTogY2ZnLnNpdGVOYW1lIHx8IGNmZy5jaXR5IH07XG5cbiAgICAgICAgLy8gRGUtZHVwIHRoZSBleGlzdGluZyBzYXZlZCBsaXN0IGJ5IGxhdC9sb24gKHNhbWUga2V5IHRoZSBkYXNoYm9hcmRcbiAgICAgICAgLy8gdXNlcykgYW5kIHB1dCB0aGUgbmV3IHBpY2sgYXQgdGhlIHRvcC4gIENhcCBhdCAyMCB0byBtYXRjaCB0aGVcbiAgICAgICAgLy8gZGFzaGJvYXJkJ3MgYmVoYXZpb3VyLlxuICAgICAgICBjb25zdCBrZXkgPSBsb2MubGF0LnRvRml4ZWQoNCkgKyAnLCcgKyBsb2MubG9uLnRvRml4ZWQoNCk7XG4gICAgICAgIGNvbnN0IGRlZHVwZWQgPSBzYXZlZExvY3MuZmlsdGVyKGwgPT4gKGwubGF0LnRvRml4ZWQoNCkgKyAnLCcgKyBsLmxvbi50b0ZpeGVkKDQpKSAhPT0ga2V5KTtcbiAgICAgICAgY29uc3QgbmV4dFNhdmVkID0gW2xvYywgLi4uZGVkdXBlZF0uc2xpY2UoMCwgMjApO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnd2VhdGhlckxvY2F0aW9uJywgSlNPTi5zdHJpbmdpZnkobG9jKSk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc2F2ZWRXZWF0aGVyTG9jYXRpb25zJywgSlNPTi5zdHJpbmdpZnkobmV4dFNhdmVkKSk7XG4gICAgICAgICAgICAvLyBLZWVwIHRoZSBvbGQga2V5IHRvbyAtLSBzb21lIGxlZ2FjeSBwbHVnLWlucyBzdGlsbCBsb29rIGF0IGl0LlxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDUud2VhdGhlcl9sb2NhdGlvbicsIEpTT04uc3RyaW5naWZ5KGxvYykpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IC8qIHByaXZhdGUgbW9kZSAtLSBpZ25vcmUgKi8gfVxuXG4gICAgICAgIGxldCBwZXJzaXN0ZWQgPSBmYWxzZSwgd2FybmluZyA9ICcnO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKCcvYXBpL3dlYXRoZXItbG9jYXRpb24nLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOidhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgYWN0aXZlOiBsb2MsIGRlZmF1bHQ6IGxvYywgc2F2ZWQ6IG5leHRTYXZlZCB9KSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgaiA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgICAgICAgd2luZG93Ll9sYXN0V2VhdGhlckxvY2F0aW9uU2F2ZSA9IGo7XG4gICAgICAgICAgICBwZXJzaXN0ZWQgPSAhIWoucGVyc2lzdGVkO1xuICAgICAgICAgICAgd2FybmluZyAgID0gai53YXJuaW5nIHx8ICcnO1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdbc2V0dXAgd2Fsa10gL2FwaS93ZWF0aGVyLWxvY2F0aW9uIDwtJywgaik7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHdhcm5pbmcgPSAnTmV0d29yayBlcnJvciDigJQgc2F2ZWQgbG9jYWxseSBvbmx5Lic7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1tzZXR1cCB3YWxrXSBjb3VsZCBub3QgcGVyc2lzdCBsb2NhdGlvbjonLCBlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRlbGwgYW55IG9wZW4gZGFzaGJvYXJkIHRhYiB0byByZS1oeWRyYXRlLiAgVGhlIGRhc2hib2FyZFxuICAgICAgICAvLyBhbHJlYWR5IGxpc3RlbnMgZm9yIGBzdG9yYWdlYCBldmVudHMgd2hlbiBhbm90aGVyIHRhYiB3cml0ZXMgdG9cbiAgICAgICAgLy8gbG9jYWxTdG9yYWdlLCBidXQgb24gVjEuOSBzb21lIGJyb3dzZXJzIERPTidUIGZpcmUgYHN0b3JhZ2VgIGZvclxuICAgICAgICAvLyBzYW1lLW9yaWdpbiB3cml0ZXMgZnJvbSB0aGlzIHNhbWUgdGFiLiAgQW4gZXhwbGljaXQgY3VzdG9tIGV2ZW50XG4gICAgICAgIC8vIG1ha2VzIHRoZSBkYXNoYm9hcmQncyBwb2xsaW5nIHBpY2sgdGhlIGNoYW5nZSB1cCBpbW1lZGlhdGVseSBpZlxuICAgICAgICAvLyBpdCdzIGFscmVhZHkgbW91bnRlZCBpbiBhbm90aGVyIHRhYi93aW5kb3cuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3JlZDU6d2VhdGhlckxvY2F0aW9uQ2hhbmdlZCcsXG4gICAgICAgICAgICAgICAgeyBkZXRhaWw6IHsgYWN0aXZlOiBsb2MsIHNhdmVkOiBuZXh0U2F2ZWQgfSB9KSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogSUUtbGVzcyBlbnZpcm9ubWVudHMgLS0gbm8tb3AgKi8gfVxuXG4gICAgICAgIGlmIChwZXJzaXN0ZWQpIHtcbiAgICAgICAgICAgIG9uU2F2ZSgpOyAgICAgICAgICAgLy8gaGFwcHkgcGF0aDogY2xvc2UgKyBtYXJrIHN0ZXAgZG9uZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLyogU3VyZmFjZSB0aGUgd2FybmluZywgaG9sZCB0aGUgbW9kYWwgb3BlbiBmb3IgMS42cyBzbyB0aGVcbiAgICAgICAgICAgICAqIG9wZXJhdG9yIHJlYWRzIGl0LCB0aGVuIGNsb3NlLiAgVGhlIGxvY2FsIGNvcHkgaXMgYWxyZWFkeVxuICAgICAgICAgICAgICogd3JpdHRlbiwgc28gdGhlIGRhc2hib2FyZCB3aWxsIHN0aWxsIHNlZSB0aGUgbmV3IGxvY2F0aW9uXG4gICAgICAgICAgICAgKiBpbiB0aGlzIGJyb3dzZXIgc2Vzc2lvbi4gKi9cbiAgICAgICAgICAgIHNldFNhdmVNc2cod2FybmluZyB8fCAnU2F2ZWQgbG9jYWxseSBvbmx5IOKAlCBzaWduIGluIHRvIHNhdmUgc2VydmVyLXNpZGUuJyk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgc2V0U2F2ZU1zZyhudWxsKTsgb25TYXZlKCk7IH0sIDE2MDApO1xuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPE1vZGFsU2hlbGwgdGl0bGU9XCJMb2NhdGlvbiBTZXR0aW5nXCIgc3VidGl0bGU9XCJDbGljayB0aGUgbWFwLCBkcmFnIHRoZSBwaW4sIG9yIHVzZSB5b3VyIGRldmljZVwiIGFjY2VudD1cImFtYmVyXCIgb25DbG9zZT17b25DbG9zZX0gb25TYXZlPXtwZXJzaXN0QW5kU2F2ZX0gc2l6ZT1cIm1heFwiPlxuICAgICAgICAgICAge3NhdmVNc2cgJiYgKFxuICAgICAgICAgICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJsb2Mtc2F2ZS1tc2dcIlxuICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibWItMyBweC00IHB5LTIuNSByb3VuZGVkLWxnIGJnLWFtYmVyLTkwMC8zMCBib3JkZXIgYm9yZGVyLWFtYmVyLTcwMC81MCB0ZXh0LWFtYmVyLTIwMCB0ZXh0LXhzIGZvbnQtbW9ub1wiPlxuICAgICAgICAgICAgICAgICAgICDimqAgIHtzYXZlTXNnfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBsZzpncmlkLWNvbHMtWzFmcl8zNDBweF0gZ2FwLTQgaC1mdWxsXCIgc3R5bGU9e3ttaW5IZWlnaHQ6JzU2dmgnfX0+XG4gICAgICAgICAgICAgICAgey8qIE1BUCDigJQgZmlsbHMgdGhlIGxlZnQgc2lkZSwgd2l0aCBhIHNlYXJjaCBiYXIgZmxvYXRpbmcgb24gdG9wICovfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmVcIiBzdHlsZT17e21pbkhlaWdodDonNTZ2aCd9fT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiByZWY9e21hcEJveFJlZn1cbiAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBoZWlnaHQ6JzEwMCUnLCBtaW5IZWlnaHQ6JzU2dmgnLCB3aWR0aDonMTAwJScsIGJvcmRlclJhZGl1czonMTJweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6J2hpZGRlbicsIGJvcmRlcjonMXB4IHNvbGlkICMzMzQxNTUnLCBiYWNrZ3JvdW5kOicjMGIxMjIwJyB9fS8+XG5cbiAgICAgICAgICAgICAgICAgICAgey8qIFNlYXJjaCBiYXIgb3ZlcmxheSDigJQgc2l0cyBpbiB0aGUgdG9wLWNlbnRyZSBvZiB0aGUgbWFwICovfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC0zIGxlZnQtMS8yIC10cmFuc2xhdGUteC0xLzIgei1bNTAwXVwiIHN0eWxlPXt7d2lkdGg6J21pbig1NjBweCwgY2FsYygxMDAlIC0gMTEwcHgpKSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17c2VhcmNoUX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRTZWFyY2hRKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Gb2N1cz17KCkgPT4gc2VhcmNoSGl0cy5sZW5ndGggJiYgc2V0U2VhcmNoT3Blbih0cnVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCLwn5SOICBTZWFyY2ggYnkgYWRkcmVzcywgYnVpbGRpbmcsIG9yIHBsYWNlIG5hbWXigKZcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgcHgtNCBweS0yLjUgcm91bmRlZC14bCBiZy1zbGF0ZS05MDAvOTUgYm9yZGVyIGJvcmRlci1zbGF0ZS02MDAgdGV4dC1zbGF0ZS0xMDAgdGV4dC1zbSBwbGFjZWhvbGRlci1zbGF0ZS01MDAgc2hhZG93LTJ4bCBiYWNrZHJvcC1ibHVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tvdXRsaW5lOidub25lJ319Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VhcmNoQnVzeSAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImFic29sdXRlIHJpZ2h0LTMgdG9wLTEvMiAtdHJhbnNsYXRlLXktMS8yIHRleHQtYW1iZXItNDAwIHRleHQteHNcIj7igKY8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VhcmNoT3BlbiAmJiBzZWFyY2hIaXRzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC1mdWxsIGxlZnQtMCByaWdodC0wIG10LTEgYmctc2xhdGUtOTAwLzk3IGJvcmRlciBib3JkZXItc2xhdGUtNzAwIHJvdW5kZWQteGwgc2hhZG93LTJ4bCBvdmVyZmxvdy1oaWRkZW4gbWF4LWgtNzIgb3ZlcmZsb3cteS1hdXRvIGJhY2tkcm9wLWJsdXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWFyY2hIaXRzLm1hcCgoaCwgaSkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PXtoLnBsYWNlX2lkIHx8IGl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBwaWNrU2VhcmNoSGl0KGgpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHRleHQtbGVmdCBweC00IHB5LTIuNSBob3ZlcjpiZy1hbWJlci05MDAvMzAgYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTgwMCBsYXN0OmJvcmRlci1iLTAgdHJhbnNpdGlvbi1hbGxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIHRleHQtc2xhdGUtMjAwIHRydW5jYXRlXCI+e2guZGlzcGxheV9uYW1lfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgbXQtMC41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7aC50eXBlIHx8IGguY2xhc3N9IMK3IHsoK2gubGF0KS50b0ZpeGVkKDMpfSwgeygraC5sb24pLnRvRml4ZWQoMyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlYXJjaE9wZW4gJiYgc2VhcmNoSGl0cy5sZW5ndGggPT09IDAgJiYgc2VhcmNoUS5sZW5ndGggPj0gMyAmJiAhc2VhcmNoQnVzeSAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgdG9wLWZ1bGwgbGVmdC0wIHJpZ2h0LTAgbXQtMSBiZy1zbGF0ZS05MDAvOTcgYm9yZGVyIGJvcmRlci1zbGF0ZS03MDAgcm91bmRlZC14bCBweC00IHB5LTMgdGV4dC14cyB0ZXh0LXNsYXRlLTQwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTm8gcmVzdWx0cyBmb3IgXCJ7c2VhcmNoUX1cIi4gIFRyeSBhIG1vcmUgc3BlY2lmaWMgdGVybS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgIHsvKiBTSURFIFBBTkVMICovfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS00IG92ZXJmbG93LXktYXV0byBwci0xXCI+XG4gICAgICAgICAgICAgICAgICAgIHsvKiBTaXRlIG5hbWUgY29tYm8taW5wdXQuICBGcmVlLWZvcm0gdHlwaW5nIGZvciBmcmVzaFxuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxzOyBhIHZpc2libGUgY2hldnJvbiBidXR0b24gb24gdGhlIHJpZ2h0IG9wZW5zXG4gICAgICAgICAgICAgICAgICAgICAgICBhIGN1c3RvbSBwb3Bkb3duIGxpc3RpbmcgZXZlcnkgc2F2ZWQgbG9jYXRpb24gcHVsbGVkXG4gICAgICAgICAgICAgICAgICAgICAgICBmcm9tIC9hcGkvd2VhdGhlci1sb2NhdGlvbiAoaS5lLiB0aGUgU0FNRSBsaXN0IHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgRGFzaGJvYXJkJ3MgV2VhdGhlciBidXR0b24gc3VyZmFjZXMpLiAgVGhpcyByZXBsYWNlc1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGVhcmxpZXIgbmF0aXZlIDxkYXRhbGlzdD4gd2hpY2ggd2FzIHRvbyBzdWJ0bGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGluIGRhcmsgdGhlbWVzIC0tIG9wZXJhdG9ycyB3aXRoIE4+MCBzYXZlZCBlbnRyaWVzXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VsZCBub3QgdGVsbCBhIGRyb3Bkb3duIGV4aXN0ZWQuICovfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0xLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTaXRlIG5hbWUgKHNhdmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzYXZlZExvY3MubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1sLTIgdGV4dC1hbWJlci00MDAvODAgbm9ybWFsLWNhc2UgdHJhY2tpbmctbm9ybWFsIHRleHQtWzEwcHhdXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJsb2Mtc2F2ZWQtaGludFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg4pa+IHtzYXZlZExvY3MubGVuZ3RofSBzYXZlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZVwiIHJlZj17c2F2ZWRSZWZ9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dCBwci05XCIgdmFsdWU9e2NmZy5zaXRlTmFtZSB8fCAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJsb2Mtc2l0ZS1uYW1lLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3NhdmVkTG9jcy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdQaWNrIGEgc2F2ZWQgbG9jYXRpb24sIG9yIHR5cGUgYSBuZXcgb25l4oCmJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnZS5nLiBIUSBUb3dlciwgTm9ydGggV2luZywgUGF2aWxpb24gQuKApid9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gb25TaXRlTmFtZUNoYW5nZShlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uRm9jdXM9eygpID0+IHNhdmVkTG9jcy5sZW5ndGggPiAwICYmIHNldFNhdmVkT3Blbih0cnVlKX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzYXZlZExvY3MubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJsb2Mtc2F2ZWQtY2hldnJvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0U2F2ZWRPcGVuKHYgPT4gIXYpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJPcGVuIHNhdmVkIGxvY2F0aW9uc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJQaWNrIGZyb20gc2F2ZWQgbG9jYXRpb25zXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSByaWdodC0xIHRvcC0xLzIgLXRyYW5zbGF0ZS15LTEvMiB3LTcgaC03IHJvdW5kZWQtbWQgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgYmctYW1iZXItNzAwLzMwIGhvdmVyOmJnLWFtYmVyLTYwMC81MCBib3JkZXIgYm9yZGVyLWFtYmVyLTUwMC80MCB0ZXh0LWFtYmVyLTIwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjE0XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjIuNFwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIiBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e3RyYW5zZm9ybTogc2F2ZWRPcGVuID8gJ3JvdGF0ZSgxODBkZWcpJyA6ICdub25lJywgdHJhbnNpdGlvbjondHJhbnNmb3JtIC4xNXMnfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlsaW5lIHBvaW50cz1cIjYgOSAxMiAxNSAxOCA5XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NhdmVkT3BlbiAmJiBzYXZlZExvY3MubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJsb2Mtc2F2ZWQtZHJvcGRvd25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIHotWzYwMF0gbGVmdC0wIHJpZ2h0LTAgdG9wLWZ1bGwgbXQtMSBiZy1zbGF0ZS05MDAgYm9yZGVyIGJvcmRlci1zbGF0ZS02MDAgcm91bmRlZC1sZyBzaGFkb3ctMnhsIG1heC1oLTY0IG92ZXJmbG93LXktYXV0b1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3NhdmVkTG9jcy5tYXAobG9jID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0FjdGl2ZSA9IChjZmcuc2l0ZU5hbWUgfHwgJycpLnRyaW0oKSA9PT0gbG9jLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e2xvYy5uYW1lfSB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBwaWNrU2F2ZWRMb2MobG9jKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17YGxvYy1zYXZlZC1vcHQtJHtsb2MubmFtZX1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHctZnVsbCB0ZXh0LWxlZnQgcHgtMyBweS0yIGJvcmRlci1iIGJvcmRlci1zbGF0ZS04MDAgbGFzdDpib3JkZXItYi0wIGhvdmVyOmJnLWFtYmVyLTkwMC8zMCB0cmFuc2l0aW9uLWNvbG9yc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2lzQWN0aXZlID8gJ2JnLWFtYmVyLTkwMC81MCcgOiAnJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LXNsYXRlLTEwMCB0cnVuY2F0ZVwiPntsb2MubmFtZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgZm9udC1tb25vIG10LTAuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtsb2MubGF0LnRvRml4ZWQoMil9LCB7bG9jLmxvbi50b0ZpeGVkKDIpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbXQtMSBpdGFsaWNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2F2ZWRMb2NzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnUGljayBhIHByZXZpb3VzbHktc2F2ZWQgbG9jYXRpb24sIG9yIHR5cGUgYSBuZXcgbGFiZWwgZm9yIHRoaXMgcGxhY2UuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdZb3VyIGxhYmVsIGZvciB0aGlzIHBsYWNlIOKAlCBzaG93biBvbiB0aGUgZGFzaGJvYXJkIGhlYWRlci4nfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvcmRlci10IGJvcmRlci1zbGF0ZS04MDAgcHQtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0xLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXNvbHZlZCBhZGRyZXNzIC8gY2l0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtnZW9CdXN5ICYmIDxzcGFuIGNsYXNzTmFtZT1cIm1sLTIgdGV4dC1hbWJlci00MDAgbm9ybWFsLWNhc2UgdHJhY2tpbmctbm9ybWFsXCI+4oCmIHJlc29sdmluZzwvc3Bhbj59XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiIHZhbHVlPXtjZmcuY2l0eX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpPT5zZXRDZmcoey4uLmNmZywgY2l0eTplLnRhcmdldC52YWx1ZX0pfS8+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0xLjVcIj5MYXRpdHVkZTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiIHR5cGU9XCJudW1iZXJcIiBzdGVwPVwiMC4wMDAxXCIgdmFsdWU9e2NmZy5sYXR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSk9PnNldENmZyh7Li4uY2ZnLCBsYXQ6K2UudGFyZ2V0LnZhbHVlfSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTEuNVwiPkxvbmdpdHVkZTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiIHR5cGU9XCJudW1iZXJcIiBzdGVwPVwiMC4wMDAxXCIgdmFsdWU9e2NmZy5sb259XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSk9PnNldENmZyh7Li4uY2ZnLCBsb246K2UudGFyZ2V0LnZhbHVlfSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3VzZU15TG9jYXRpb259XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9e2dlb1N0YXRlID09PSAnYnVzeSd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJsb2MtdXNlLW15LWxvY2F0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B3LWZ1bGwgcHktMi41IHJvdW5kZWQtbGcgYm9yZGVyIHRleHQteHMgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IHRyYW5zaXRpb24tY29sb3JzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Z2VvU3RhdGUgPT09ICdidXN5J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctYW1iZXItOTAwLzQwIGJvcmRlci1hbWJlci03MDAvNDAgdGV4dC1hbWJlci0yMDAgY3Vyc29yLXdhaXQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IChnZW9TdGF0ZSAmJiBnZW9TdGF0ZS5lcnJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1yb3NlLTkwMC80MCBib3JkZXItcm9zZS01MDAvNTAgdGV4dC1yb3NlLTEwMCBob3ZlcjpiZy1yb3NlLTgwMC80MCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1hbWJlci03MDAvNzAgYm9yZGVyLWFtYmVyLTUwMC80MCB0ZXh0LWFtYmVyLTUwIGhvdmVyOmJnLWFtYmVyLTYwMC83MCcpfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAge2dlb1N0YXRlID09PSAnYnVzeSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICfij7MgIFJlYWRpbmcgZGV2aWNlIGxvY2F0aW9u4oCmJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ/Cfk40gIFVzZSBteSBkZXZpY2UgbG9jYXRpb24nfVxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAge2dlb1N0YXRlICYmIGdlb1N0YXRlLmVyciAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwibG9jLWdlby1lcnJvclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIi1tdC0yIHB4LTMgcHktMiByb3VuZGVkLW1kIGJnLXJvc2UtOTUwLzUwIGJvcmRlciBib3JkZXItcm9zZS03MDAvNDAgdGV4dC1bMTFweF0gbGVhZGluZy1zbnVnIHRleHQtcm9zZS0yMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YiBjbGFzc05hbWU9XCJ0ZXh0LXJvc2UtMTAwXCI+Q291bGRuJ3QgcmVhZCBsb2NhdGlvbi48L2I+PGJyLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXJvc2UtMjAwLzkwXCI+e2dlb1N0YXRlLmVycn08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qIFNwZWNpZmljIEhUVFAtb3JpZ2luIGNhbGwtb3V0OiBtb3N0IGxpa2VseSBjYXVzZSBvbiBhIFYxLjkgY29udHJvbGxlci4gKi99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3R5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5sb2NhdGlvbiAmJiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgPT09ICdodHRwOicgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTEuNSB0ZXh0LVsxMHB4XSB0ZXh0LXJvc2UtMzAwLzgwIGZvbnQtbW9ub1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwOiBicm93c2VycyByZXF1aXJlIEhUVFBTIGZvciBnZW9sb2NhdGlvbi4gIFBpY2sgdGhlIGxvY2F0aW9uIG9uIHRoZSBtYXAgb3Igc2VhcmNoIGJhciBpbnN0ZWFkLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib3JkZXItdCBib3JkZXItc2xhdGUtODAwIHB0LTMgbXQtMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0yXCI+UXVpY2sganVtcHM8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtMS41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidUb3JvbnRvLCBPTicsICAgbGF0OjQzLjY1MzIsIGxvbjotNzkuMzgzMiwgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J05ldyBZb3JrLCBOWScsICBsYXQ6NDAuNzEyOCwgbG9uOi03NC4wMDYwLCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonTG9uZG9uLCBVSycsICAgIGxhdDo1MS41MDc0LCBsb246IC0wLjEyNzgsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidQYXJpcywgRlInLCAgICAgbGF0OjQ4Ljg1NjYsIGxvbjogIDIuMzUyMiwgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J1Rva3lvLCBKUCcsICAgICBsYXQ6MzUuNjc2MiwgbG9uOjEzOS42NTAzLCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonU3lkbmV5LCBBVScsICAgIGxhdDotMzMuODY4OCxsb246MTUxLjIwOTMsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLm1hcChqID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e2oubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgbGF0OmoubGF0LCBsb246ai5sb24sIGNpdHk6ai5uYW1lfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFwUmVmLmN1cnJlbnQpIG1hcFJlZi5jdXJyZW50LnNldFZpZXcoW2oubGF0LCBqLmxvbl0sIGoueik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LWxlZnQgcHgtMi41IHB5LTEuNSByb3VuZGVkLW1kIGJnLXNsYXRlLTgwMC83MCBib3JkZXIgYm9yZGVyLXNsYXRlLTcwMCB0ZXh0LVsxMXB4XSBmb250LWJvbGQgdGV4dC1zbGF0ZS0zMDAgaG92ZXI6Ymctc2xhdGUtNzAwIGhvdmVyOmJvcmRlci1hbWJlci01MDAvNDAgdHJhbnNpdGlvbi1hbGxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtqLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgVGlsZXM6IE9wZW5TdHJlZXRNYXAgwrcgR2VvY29kZTogTm9taW5hdGltIChmcmVlLCB+MSByZXEvcykuXG4gICAgICAgICAgICAgICAgICAgICAgICBVc2VkIGZvciBPcGVuLU1ldGVvIHdlYXRoZXIgZmVlZCBhbmQgc3VucmlzZS9zdW5zZXQgZXN0aW1hdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvTW9kYWxTaGVsbD5cbiAgICApO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBMYW5ndWFnZSBTZXR0aW5nIC0tIG1vZGFsXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5mdW5jdGlvbiBMYW5ndWFnZU1vZGFsKHsgY2ZnLCBzZXRDZmcsIG9uQ2xvc2UsIG9uU2F2ZSB9KSB7XG4gICAgY29uc3QgbGFuZ3MgPSBbXG4gICAgICAgIHsgY29kZTonZW4nLCAgICBsYWJlbDonRW5nbGlzaCcsICAgICAgICAgICAgICAgIG5hdGl2ZTonRW5nbGlzaCcgICAgfSxcbiAgICAgICAgeyBjb2RlOid6aC1DTicsIGxhYmVsOidDaGluZXNlIChTaW1wbGlmaWVkKScsICAgbmF0aXZlOifnroDkvZPkuK3mlocnICAgIH0sXG4gICAgICAgIHsgY29kZTonemgtVFcnLCBsYWJlbDonQ2hpbmVzZSAoVHJhZGl0aW9uYWwpJywgIG5hdGl2ZTon57mB6auU5Lit5paHJyAgICB9LFxuICAgICAgICB7IGNvZGU6J2phJywgICAgbGFiZWw6J0phcGFuZXNlJywgICAgICAgICAgICAgICBuYXRpdmU6J+aXpeacrOiqnicgICAgICB9LFxuICAgICAgICB7IGNvZGU6J2tvJywgICAgbGFiZWw6J0tvcmVhbicsICAgICAgICAgICAgICAgICBuYXRpdmU6J+2VnOq1reyWtCcgICAgICB9LFxuICAgIF07XG5cbiAgICAvKiBPbiBTYXZlICYgcmV0dXJuOiB3cml0ZSB0aGUgcGlja2VkIGxhbmd1YWdlIGNvZGUgdG8gdGhlIHNhbWVcbiAgICAgKiBsb2NhbFN0b3JhZ2Uga2V5IHRoZSBkYXNoYm9hcmQncyBpMThuLmpzIHJlYWRzIChgaTE4bl9sYW5nYCksIGFuZFxuICAgICAqIGRpc3BhdGNoIHRoZSBgbGFuZ2NoYW5nZWAgZXZlbnQgc28gYW55IG9wZW4gZGFzaGJvYXJkL2NvbmZpZyB0YWJcbiAgICAgKiBwaWNrcyBpdCB1cCBsaXZlLiAgVGhpcyBpcyB3aGF0IG1ha2VzIHRoZSBzZXR1cCB3YWxrJ3MgbGFuZ3VhZ2VcbiAgICAgKiBjaG9pY2UgYWN0dWFsbHkgZHJpdmUgdGhlIGRhc2hib2FyZCAvIGNvbmZpZyAvIG1hcHBlciBVSSAtLSB0aGVcbiAgICAgKiBzaWRlYmFyIHNlbGVjdG9yIHRoYXQgdXNlZCB0byBsaXZlIGluIHRoZSBkYXNoYm9hcmQgaGVhZGVyIGhhc1xuICAgICAqIGJlZW4gcmVtb3ZlZCAoMjAyNi0wNi0yNikgYW5kIHRoZSBzZXR1cCB3YWxrIGlzIG5vdyB0aGUgc2luZ2xlXG4gICAgICogc291cmNlIG9mIHRydXRoIGZvciBVSSBsYW5ndWFnZS4gKi9cbiAgICBjb25zdCBwZXJzaXN0QW5kU2F2ZSA9ICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdpMThuX2xhbmcnLCBjZmcubGFuZyk7XG4gICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2xhbmdjaGFuZ2UnKSk7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ1tzZXR1cCB3YWxrXSBpMThuX2xhbmcgPC0nLCBjZmcubGFuZyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignW3NldHVwIHdhbGtdIGNvdWxkIG5vdCBwZXJzaXN0IGxhbmd1YWdlOicsIGUpO1xuICAgICAgICB9XG4gICAgICAgIG9uU2F2ZSgpO1xuICAgIH07XG4gICAgcmV0dXJuIChcbiAgICAgICAgPE1vZGFsU2hlbGwgdGl0bGU9XCJMYW5ndWFnZSBTZXR0aW5nXCIgc3VidGl0bGU9XCJQaWNrIHlvdXIgZGVmYXVsdCBpbnRlcmZhY2UgbGFuZ3VhZ2VcIiBhY2NlbnQ9XCJlbWVyYWxkXCIgb25DbG9zZT17b25DbG9zZX0gb25TYXZlPXtwZXJzaXN0QW5kU2F2ZX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTNcIj5cbiAgICAgICAgICAgICAgICB7bGFuZ3MubWFwKGwgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGtleT17bC5jb2RlfSBvbkNsaWNrPXsoKT0+c2V0Q2ZnKHsuLi5jZmcsIGxhbmc6bC5jb2RlfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdGV4dC1sZWZ0IHAtMyByb3VuZGVkLXhsIGJvcmRlci0yIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Y2ZnLmxhbmcgPT09IGwuY29kZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYm9yZGVyLWVtZXJhbGQtNTAwIGJnLWVtZXJhbGQtOTAwLzIwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYm9yZGVyLXNsYXRlLTcwMCBiZy1zbGF0ZS04MDAvNDAgaG92ZXI6Ymctc2xhdGUtODAwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIHRleHQtc2xhdGUtNTAwXCI+e2wuY29kZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LWJsYWNrIHRleHQtc2xhdGUtMjAwXCI+e2wubmF0aXZlfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMXB4XSB0ZXh0LXNsYXRlLTUwMFwiPntsLmxhYmVsfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L01vZGFsU2hlbGw+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogUGx1Zy1pbiBTZXR0aW5nIC0tIG1vZGFsIHcvIGxpc3QgKyB1cGxvYWQgem9uZVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLyogUGVyLXBsdWctaW4gbW9jayBjb25maWd1cmF0aW9uIGZpZWxkcy4gIEtleXMgbWFwIHRvIHBsdWctaW4gYGlkYC4gKi9cbmNvbnN0IFBMVUdJTl9DT05GSUdfRklFTERTID0ge1xuICAgIHdlYXRoZXI6ICAgIFtcbiAgICAgICAgeyBrZXk6J3Byb3ZpZGVyJywgIGxhYmVsOidQcm92aWRlcicsICAgICAgICAgIHR5cGU6J3NlbGVjdCcsICBvcHRpb25zOlsnT3Blbi1NZXRlbycsJ05XUycsJ0VDTVdGJ10sIGRlZjonT3Blbi1NZXRlbycgfSxcbiAgICAgICAgeyBrZXk6J3JlZnJlc2gnLCAgIGxhYmVsOidSZWZyZXNoIGludGVydmFsJywgIHR5cGU6J3NlbGVjdCcsICBvcHRpb25zOlsnMSBtaW4nLCc1IG1pbicsJzE1IG1pbicsJzMwIG1pbicsJzEgaCddLCBkZWY6JzE1IG1pbicgfSxcbiAgICAgICAgeyBrZXk6J2NhY2hlJywgICAgIGxhYmVsOidDYWNoZSBUVEwgKG1pbiknLCAgIHR5cGU6J251bWJlcicsICBkZWY6MzAgfSxcbiAgICBdLFxuICAgIGdpdm9uaTogICAgIFtcbiAgICAgICAgeyBrZXk6J2NsaW1hdGUnLCAgIGxhYmVsOidDbGltYXRlIG1vZGVsJywgICAgIHR5cGU6J3NlbGVjdCcsICBvcHRpb25zOlsnR2l2b25pIDE5OTInLCdBU0hSQUUgNTUnLCdBZGFwdGl2ZSddLCBkZWY6J0dpdm9uaSAxOTkyJyB9LFxuICAgICAgICB7IGtleTonbWFzc2l2ZScsICAgbGFiZWw6J0hlYXZ5d2VpZ2h0IGNvbnN0cnVjdGlvbicsICB0eXBlOid0b2dnbGUnLCBkZWY6ZmFsc2UgfSxcbiAgICBdLFxuICAgIHN3ZWV0X3Nwb3Q6IFtcbiAgICAgICAgeyBrZXk6J3RyYWNraW5nJywgIGxhYmVsOidUcmFjayBvdXRkb29yIFJIJywgIHR5cGU6J3RvZ2dsZScsIGRlZjp0cnVlIH0sXG4gICAgICAgIHsga2V5OidoeXN0JywgICAgICBsYWJlbDonSHlzdGVyZXNpcyAoJSBSSCknLCB0eXBlOidudW1iZXInLCBkZWY6MiB9LFxuICAgIF0sXG4gICAgZzM2OiAgICAgICAgW1xuICAgICAgICB7IGtleTonbW9kZScsICAgICAgbGFiZWw6J1NlcXVlbmNlIG1vZGUnLCAgICAgdHlwZTonc2VsZWN0JywgIG9wdGlvbnM6WydTaW5nbGUtem9uZSBWQVYnLCdNdWx0aS16b25lIFZBVicsJ0RPQVMgdy8gRkNVJ10sIGRlZjonTXVsdGktem9uZSBWQVYnIH0sXG4gICAgICAgIHsga2V5Oid2ZXJib3NlJywgICBsYWJlbDonVmVyYm9zZSBsb2dnaW5nJywgICB0eXBlOid0b2dnbGUnLCBkZWY6ZmFsc2UgfSxcbiAgICBdLFxuICAgIGRpYnQ6ICAgICAgIFtcbiAgICAgICAgeyBrZXk6J2hvc3QnLCAgICAgIGxhYmVsOidCcmlkZ2UgaG9zdCcsICAgICAgIHR5cGU6J3RleHQnLCAgIGRlZjonMTkyLjE2OC4xLjEwMCcgfSxcbiAgICAgICAgeyBrZXk6J3BvcnQnLCAgICAgIGxhYmVsOidUZWxlZ3JhbSBwb3J0JywgICAgIHR5cGU6J251bWJlcicsIGRlZjo0NzgwOCB9LFxuICAgICAgICB7IGtleToncG9sbF9tcycsICAgbGFiZWw6J1BvbGwgaW50ZXJ2YWwgKG1zKScsdHlwZTonbnVtYmVyJywgZGVmOjIwMDAgfSxcbiAgICBdLFxuICAgIGxpZ2h0aW5nOiAgIFtcbiAgICAgICAgeyBrZXk6J2dhdGV3YXknLCAgIGxhYmVsOidNb2RidXMgZ2F0ZXdheSBJUCcsIHR5cGU6J3RleHQnLCAgIGRlZjonMTAuMC4wLjUwJyB9LFxuICAgICAgICB7IGtleTondW5pdF9pZCcsICAgbGFiZWw6J1VuaXQgSUQnLCAgICAgICAgICAgdHlwZTonbnVtYmVyJywgZGVmOjEgfSxcbiAgICAgICAgeyBrZXk6J3RjcF9wb3J0JywgIGxhYmVsOidUQ1AgcG9ydCcsICAgICAgICAgIHR5cGU6J251bWJlcicsIGRlZjo1MDIgfSxcbiAgICBdLFxufTtcblxuZnVuY3Rpb24gUGx1Z2luc01vZGFsKHsgY2ZnLCBzZXRDZmcsIG9uQ2xvc2UsIG9uU2F2ZSB9KSB7XG4gICAgY29uc3QgQUxMID0gW1xuICAgICAgICB7IGlkOid3ZWF0aGVyJywgICAgIG5hbWU6J1dlYXRoZXInLCAgICAgICAgIGRlc2M6J09wZW4tTWV0ZW8gT0EgZmVlZCcsICAgICAgICAgIHZlcjonMi4xLjAnIH0sXG4gICAgICAgIHsgaWQ6J2dpdm9uaScsICAgICAgbmFtZTonR2l2b25pIEVuZ2luZScsICAgZGVzYzonQ2xpbWF0ZS1zdHJhdGVneSBvdmVybGF5JywgICAgdmVyOicxLjMuNCcgfSxcbiAgICAgICAgeyBpZDonc3dlZXRfc3BvdCcsICBuYW1lOidTd2VldC1TcG90IFJIJywgICBkZXNjOidBZGp1c3RhYmxlIFJIIGJhbmQnLCAgICAgICAgICB2ZXI6JzEuMC4xJyB9LFxuICAgICAgICB7IGlkOidnMzYnLCAgICAgICAgIG5hbWU6J0czNiBTZXF1ZW5jZXMnLCAgIGRlc2M6J0FTSFJBRSBHdWlkZWxpbmUgMzYnLCAgICAgICAgIHZlcjonMC45LjInIH0sXG4gICAgICAgIHsgaWQ6J2RpYnQnLCAgICAgICAgbmFtZTonRElCVCBCcmlkZ2UnLCAgICAgZGVzYzonRGVsdGEgQ29udHJvbHMgKERJQlQpIEJBQ25ldCBicmlkZ2UnLCAgICAgICAgICAgdmVyOicwLjQuMCcgfSxcbiAgICAgICAgeyBpZDonbGlnaHRpbmcnLCAgICBuYW1lOidMaWdodGluZyAoUmVkNSknLCBkZXNjOidWMy4wIE1vZGJ1cyBUQ1AgY2xpZW50JywgICAgICB2ZXI6JzAuMS4wLWJldGEnIH0sXG4gICAgXTtcbiAgICBjb25zdCB0b2dnbGUgPSAoaWQpID0+IHNldENmZyhjID0+ICh7XG4gICAgICAgIC4uLmMsXG4gICAgICAgIGVuYWJsZWQ6IGMuZW5hYmxlZC5pbmNsdWRlcyhpZCkgPyBjLmVuYWJsZWQuZmlsdGVyKHggPT4geCAhPT0gaWQpIDogWy4uLmMuZW5hYmxlZCwgaWRdXG4gICAgfSkpO1xuXG4gICAgLyogZXhwYW5zaW9uIHN0YXRlIOKAlCB3aGljaCBwbHVnLWluJ3MgXCJDb25maWd1cmVcIiBwYW5lbCBpcyBvcGVuICovXG4gICAgY29uc3QgW2V4cGFuZGVkSWQsIHNldEV4cGFuZGVkSWRdID0gUmVhY3QudXNlU3RhdGUobnVsbCk7XG5cbiAgICBjb25zdCB1cGRhdGVGaWVsZCA9IChwbHVnaW5JZCwgZmllbGRLZXksIHZhbHVlKSA9PiB7XG4gICAgICAgIHNldENmZyhjID0+ICh7XG4gICAgICAgICAgICAuLi5jLFxuICAgICAgICAgICAgZmllbGRzOiB7IC4uLihjLmZpZWxkcyB8fCB7fSksIFtwbHVnaW5JZF06IHsgLi4uKChjLmZpZWxkcyB8fCB7fSlbcGx1Z2luSWRdIHx8IHt9KSwgW2ZpZWxkS2V5XTogdmFsdWUgfSB9XG4gICAgICAgIH0pKTtcbiAgICB9O1xuXG4gICAgY29uc3QgZmllbGRWYWwgPSAocGx1Z2luSWQsIGZpZWxkKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0b3JlZCA9IGNmZy5maWVsZHMgJiYgY2ZnLmZpZWxkc1twbHVnaW5JZF0gJiYgY2ZnLmZpZWxkc1twbHVnaW5JZF1bZmllbGQua2V5XTtcbiAgICAgICAgcmV0dXJuIHN0b3JlZCAhPT0gdW5kZWZpbmVkID8gc3RvcmVkIDogZmllbGQuZGVmO1xuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8TW9kYWxTaGVsbCB0aXRsZT1cIlBsdWctaW4gU2V0dGluZ1wiIHN1YnRpdGxlPVwiRW5hYmxlLCB1cGxvYWQgb3IgbW9kaWZ5IHBsdWctaW5zXCIgYWNjZW50PVwicGlua1wiIG9uQ2xvc2U9e29uQ2xvc2V9IG9uU2F2ZT17b25TYXZlfSBzaXplPVwid2lkZVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTMgbWF4LWgtWzYwdmhdIG92ZXJmbG93LXktYXV0byBwci0xXCI+XG4gICAgICAgICAgICAgICAge0FMTC5tYXAocCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9uID0gY2ZnLmVuYWJsZWQuaW5jbHVkZXMocC5pZCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4cGFuZGVkID0gZXhwYW5kZWRJZCA9PT0gcC5pZDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmllbGRzID0gUExVR0lOX0NPTkZJR19GSUVMRFNbcC5pZF0gfHwgW107XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17cC5pZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcm91bmRlZC14bCBib3JkZXIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtvbiA/ICdib3JkZXItcGluay01MDAvNDAgYmctcGluay05MDAvMTAnIDogJ2JvcmRlci1zbGF0ZS03MDAgYmctc2xhdGUtODAwLzQwJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtleHBhbmRlZCA/ICdyaW5nLTEgcmluZy1waW5rLTUwMC8zMCcgOiAnJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBwLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LWJsYWNrIHRleHQtc2xhdGUtMTAwXCI+e3AubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtbC0yIHRleHQtWzEwcHhdIGZvbnQtbW9ubyB0ZXh0LXNsYXRlLTUwMFwiPnZ7cC52ZXJ9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS00MDBcIj57cC5kZXNjfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB0b2dnbGUocC5pZCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgcGx1Z2luLXRvZ2dsZS0ke3AuaWR9YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHgtMyBweS0xIHJvdW5kZWQtbWQgdGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIGJvcmRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtvbiA/ICdib3JkZXItcGluay01MDAvNjAgdGV4dC1waW5rLTMwMCBiZy1waW5rLTkwMC8zMCcgOiAnYm9yZGVyLXNsYXRlLTYwMCB0ZXh0LXNsYXRlLTQwMCBiZy1zbGF0ZS04MDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtvbiA/ICdFbmFibGVkJyA6ICdEaXNhYmxlZCd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gc2V0RXhwYW5kZWRJZChleHBhbmRlZCA/IG51bGwgOiBwLmlkKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BwbHVnaW4tY29uZmlnLSR7cC5pZH1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweC0zIHB5LTEgcm91bmRlZC1tZCB0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgYm9yZGVyIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2V4cGFuZGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYm9yZGVyLXBpbmstNTAwIGJnLXBpbmstOTAwLzMwIHRleHQtcGluay0yMDAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYm9yZGVyLXNsYXRlLTYwMCB0ZXh0LXNsYXRlLTQwMCBiZy1zbGF0ZS04MDAgaG92ZXI6Ymctc2xhdGUtNzAwIGhvdmVyOmJvcmRlci1waW5rLTUwMC81MCBob3Zlcjp0ZXh0LXBpbmstMzAwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZXhwYW5kZWQgPyAnQ2xvc2Ug4pa0JyA6ICdDb25maWd1cmUg4pa+J31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZXhwYW5kZWQgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB4LTQgcGItNCBib3JkZXItdCBib3JkZXItcGluay01MDAvMjAgYmctc2xhdGUtOTUwLzQwXCIgZGF0YS10ZXN0aWQ9e2BwbHVnaW4tY29uZmlnLXBhbmVsLSR7cC5pZH1gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmaWVsZHMubGVuZ3RoID09PSAwID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS01MDAgaXRhbGljIHB5LTNcIj5ObyBjb25maWd1cmFibGUgb3B0aW9ucyBmb3IgdGhpcyBwbHVnLWluIHlldC48L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBtZDpncmlkLWNvbHMtMiBnYXAtMyBwdC0zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmaWVsZHMubWFwKGYgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdiA9IGZpZWxkVmFsKHAuaWQsIGYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17Zi5rZXl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJvbGQgdGV4dC1zbGF0ZS01MDAgYmxvY2sgbWItMVwiPntmLmxhYmVsfTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmLnR5cGUgPT09ICdzZWxlY3QnICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXQgY3Vyc29yLXBvaW50ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGVGaWVsZChwLmlkLCBmLmtleSwgZS50YXJnZXQudmFsdWUpfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi5vcHRpb25zLm1hcChvID0+IDxvcHRpb24ga2V5PXtvfSB2YWx1ZT17b30+e299PC9vcHRpb24+KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi50eXBlID09PSAnbnVtYmVyJyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cIm51bWJlclwiIGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZUZpZWxkKHAuaWQsIGYua2V5LCArZS50YXJnZXQudmFsdWUpfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmLnR5cGUgPT09ICd0ZXh0JyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3Z9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGVGaWVsZChwLmlkLCBmLmtleSwgZS50YXJnZXQudmFsdWUpfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmLnR5cGUgPT09ICd0b2dnbGUnICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gdXBkYXRlRmllbGQocC5pZCwgZi5rZXksICF2KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdy1mdWxsIHB5LTIgcm91bmRlZC1sZyB0ZXh0LXhzIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBib3JkZXIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7dlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLXBpbmstNzAwLzQwIGJvcmRlci1waW5rLTUwMC82MCB0ZXh0LXBpbmstMjAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLXNsYXRlLTgwMCBib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtNDAwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7diA/ICdPTicgOiAnT0ZGJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWVuZCBnYXAtMiBtdC00IHB0LTMgYm9yZGVyLXQgYm9yZGVyLXNsYXRlLTgwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlc2V0IHRoaXMgcGx1Zy1pbidzIGZpZWxkcyB0byBkZWZhdWx0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldENmZyhjID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV4dCA9IHsgLi4uKGMuZmllbGRzIHx8IHt9KSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgbmV4dFtwLmlkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgLi4uYywgZmllbGRzOiBuZXh0IH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtMyBweS0xLjUgcm91bmRlZC1tZCB0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgYm9yZGVyIGJvcmRlci1zbGF0ZS02MDAgdGV4dC1zbGF0ZS00MDAgaG92ZXI6Ymctc2xhdGUtODAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlc2V0IGRlZmF1bHRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBzZXRFeHBhbmRlZElkKG51bGwpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtMyBweS0xLjUgcm91bmRlZC1tZCB0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgYmctcGluay02MDAgaG92ZXI6YmctcGluay01MDAgdGV4dC13aGl0ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEb25lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNSBwLTQgYm9yZGVyLTIgYm9yZGVyLWRhc2hlZCBib3JkZXItc2xhdGUtNzAwIHJvdW5kZWQteGwgdGV4dC1jZW50ZXIgaG92ZXI6Ym9yZGVyLXBpbmstNTAwLzQwIHRyYW5zaXRpb24tYWxsIGN1cnNvci1wb2ludGVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LTN4bCBtYi0xXCI+4qS0PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS0zMDBcIj5Ecm9wIGEgLnB5IC8gLnppcCAvIC5yZWQ1IHBsdWctaW4gaGVyZTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTFweF0gdGV4dC1zbGF0ZS01MDAgbXQtMVwiPm9yIGNsaWNrIHRvIGNob29zZSBhIGZpbGUgKG1vY2sg4oCUIG5vdCB3aXJlZCk8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L01vZGFsU2hlbGw+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTW9kYWwgU2hlbGwgLS0gc2hhcmVkXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5mdW5jdGlvbiBNb2RhbFNoZWxsKHsgdGl0bGUsIHN1YnRpdGxlLCBhY2NlbnQ9J2luZGlnbycsIG9uQ2xvc2UsIG9uU2F2ZSwgc2l6ZT0nJywgY2hpbGRyZW4gfSkge1xuICAgIGNvbnN0IGNvbG9yTWFwID0ge1xuICAgICAgICBpbmRpZ286JyM4MThjZjgnLCBhbWJlcjonI2ZiYmYyNCcsIGVtZXJhbGQ6JyMzNGQzOTknLCBwaW5rOicjZjQ3MmI2J1xuICAgIH07XG4gICAgY29uc3QgYyA9IGNvbG9yTWFwW2FjY2VudF0gfHwgJyM4MThjZjgnO1xuICAgIGNvbnN0IHNpemVNYXAgPSB7XG4gICAgICAgIHdpZGU6ICdtYXgtdy0yeGwnLFxuICAgICAgICBtYXA6ICAnbWF4LXctM3hsJyxcbiAgICAgICAgbWF4OiAgJ21heC13LVs5NnZ3XSB3LVs5NnZ3XSBoLVs5MnZoXScsXG4gICAgfTtcbiAgICBjb25zdCB3aWR0aCA9IHNpemVNYXBbc2l6ZV0gfHwgJ21heC13LW1kJztcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpeGVkIGluc2V0LTAgei01MCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBtb2RhbC1iYWNrZHJvcFwiIG9uQ2xpY2s9e29uQ2xvc2V9PlxuICAgICAgICAgICAgey8qIEZsZXgtY29sdW1uIHNoZWxsOiBoZWFkZXIgKGZpeGVkKSArIHNjcm9sbGFibGUgY29udGVudCArIHN0aWNreSBmb290ZXIuXG4gICAgICAgICAgICAgICAgQ3JpdGljYWwgZm9yIHNpemU9XCJtYXhcIiB3aGVyZSBjaGlsZHJlbiBhbG9uZSBleGNlZWQgdGhlIG1vZGFsIGhlaWdodFxuICAgICAgICAgICAgICAgIGFuZCB3b3VsZCBvdGhlcndpc2UgcHVzaCB0aGUgU2F2ZSAmIHJldHVybiBidXR0b24gYmVsb3cgdGhlIHZpZXdwb3J0LiAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgYmctc2xhdGUtOTAwIGJvcmRlci0yIHJvdW5kZWQtMnhsIHctZnVsbCAke3dpZHRofSBteC00IGZhZGUtdXAgZmxleCBmbGV4LWNvbGB9XG4gICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpfVxuICAgICAgICAgICAgICAgICBzdHlsZT17e2JvcmRlckNvbG9yOmAke2N9NjZgLCBtYXhIZWlnaHQ6ICc5MnZoJ319PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1zdGFydCBqdXN0aWZ5LWJldHdlZW4gcC02IHBiLTQgYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTgwMC82MCBzaHJpbmstMFwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtbGcgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0XCIgc3R5bGU9e3tjb2xvcjpjfX0+e3RpdGxlfTwvaDM+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtc2xhdGUtNTAwIG10LTFcIj57c3VidGl0bGV9PC9wPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cIm1vZGFsLWNsb3NlXCIgb25DbGljaz17b25DbG9zZX0gY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgaG92ZXI6dGV4dC13aGl0ZSB0ZXh0LTJ4bCBsZWFkaW5nLW5vbmVcIj7DlzwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xIG1pbi1oLTAgb3ZlcmZsb3cteS1hdXRvIHB4LTYgcHktNVwiPlxuICAgICAgICAgICAgICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWVuZCBnYXAtMyBweC02IHB5LTQgYm9yZGVyLXQgYm9yZGVyLXNsYXRlLTgwMCBzaHJpbmstMCBiZy1zbGF0ZS05MDAgcm91bmRlZC1iLTJ4bFwiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwibW9kYWwtY2FuY2VsXCIgb25DbGljaz17b25DbG9zZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC00IHB5LTIgcm91bmRlZC1sZyBiZy1zbGF0ZS04MDAgYm9yZGVyIGJvcmRlci1zbGF0ZS03MDAgdGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS00MDAgaG92ZXI6Ymctc2xhdGUtNzAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICBDYW5jZWxcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJtb2RhbC1zYXZlXCIgb25DbGljaz17b25TYXZlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTUgcHktMiByb3VuZGVkLWxnIHRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIHRleHQtd2hpdGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7YmFja2dyb3VuZDpjLCBib3hTaGFkb3c6YDAgMCAxMnB4ICR7Y301NWB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIFNhdmUgJiByZXR1cm4g4pyTXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbi8qIG1vdW50ICovXG5SZWFjdERPTS5jcmVhdGVSb290KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290JykpLnJlbmRlcig8QXBwLz4pO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQUEsTUFBQSxHQUE4QkMsS0FBSztFQUEzQkMsUUFBUSxHQUFBRixNQUFBLENBQVJFLFFBQVE7RUFBRUMsT0FBTyxHQUFBSCxNQUFBLENBQVBHLE9BQU87O0FBRXpCO0FBQ0E7QUFDQTtBQUNBLElBQU1DLEtBQUssR0FBRyxDQUNWO0FBQ0E7RUFBRUMsR0FBRyxFQUFDLEtBQUs7RUFBT0MsS0FBSyxFQUFDLG1CQUFtQjtFQUFLQyxHQUFHLEVBQUMsMEJBQTBCO0VBQUdDLElBQUksRUFBQyxNQUFNO0VBQUdDLFNBQVMsRUFBQyxTQUFTO0VBQUVDLE1BQU0sRUFBQztBQUFTLENBQUMsRUFDckk7RUFBRUwsR0FBRyxFQUFDLFVBQVU7RUFBRUMsS0FBSyxFQUFDLGtCQUFrQjtFQUFNQyxHQUFHLEVBQUMsbUJBQW1CO0VBQVVDLElBQUksRUFBQyxPQUFPO0VBQUVDLFNBQVMsRUFBQyxTQUFTO0VBQUVDLE1BQU0sRUFBQztBQUFTLENBQUMsRUFDckk7RUFBRUwsR0FBRyxFQUFDLFVBQVU7RUFBRUMsS0FBSyxFQUFDLGtCQUFrQjtFQUFNQyxHQUFHLEVBQUMsNEJBQTRCO0VBQUVDLElBQUksRUFBQyxPQUFPO0VBQUVDLFNBQVMsRUFBQyxTQUFTO0VBQUVDLE1BQU0sRUFBQztBQUFTLENBQUMsRUFDdEk7RUFBRUwsR0FBRyxFQUFDLFNBQVM7RUFBR0MsS0FBSyxFQUFDLGlCQUFpQjtFQUFPQyxHQUFHLEVBQUMsd0JBQXdCO0VBQUtDLElBQUksRUFBQyxPQUFPO0VBQUVDLFNBQVMsRUFBQyxTQUFTO0VBQUVDLE1BQU0sRUFBQztBQUFTLENBQUM7QUFDckk7QUFDSjtBQUNBO0FBQ0k7RUFBRUwsR0FBRyxFQUFDLFFBQVE7RUFBSUMsS0FBSyxFQUFDLGlCQUFpQjtFQUFPQyxHQUFHLEVBQUMsZ0NBQWdDO0VBQUVDLElBQUksRUFBQyxNQUFNO0VBQUVDLFNBQVMsRUFBQyxTQUFTO0VBQUVDLE1BQU0sRUFBQyxNQUFNO0VBQUVDLElBQUksRUFBQztBQUFlLENBQUMsQ0FDL0o7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsU0FBU0MsR0FBR0EsQ0FBQSxFQUFHO0VBQ1g7RUFDQSxJQUFBQyxTQUFBLEdBQXdCWCxRQUFRLENBQUM7TUFBRVksR0FBRyxFQUFDLEtBQUs7TUFBRUMsUUFBUSxFQUFDLEtBQUs7TUFBRUMsUUFBUSxFQUFDLEtBQUs7TUFBRUMsT0FBTyxFQUFDLEtBQUs7TUFBRUMsTUFBTSxFQUFDO0lBQU0sQ0FBQyxDQUFDO0lBQUFDLFVBQUEsR0FBQUMsY0FBQSxDQUFBUCxTQUFBO0lBQXJHUSxJQUFJLEdBQUFGLFVBQUE7SUFBRUcsT0FBTyxHQUFBSCxVQUFBO0VBQ3BCLElBQUFJLFVBQUEsR0FBMEJyQixRQUFRLENBQUMsS0FBSyxDQUFDO0lBQUFzQixVQUFBLEdBQUFKLGNBQUEsQ0FBQUcsVUFBQTtJQUFsQ0UsS0FBSyxHQUFBRCxVQUFBO0lBQUVFLFFBQVEsR0FBQUYsVUFBQSxJQUFvQixDQUFHO0VBQzdDLElBQUFHLFVBQUEsR0FBMEJ6QixRQUFRLENBQUMsSUFBSSxDQUFDO0lBQUEwQixVQUFBLEdBQUFSLGNBQUEsQ0FBQU8sVUFBQTtJQUFqQ0UsS0FBSyxHQUFBRCxVQUFBO0lBQUVFLFFBQVEsR0FBQUYsVUFBQSxJQUFtQixDQUFLOztFQUU5QyxJQUFBRyxVQUFBLEdBQW9DN0IsUUFBUSxDQUFDO01BQUU4QixNQUFNLEVBQUMsSUFBSTtNQUFFQyxRQUFRLEVBQUMsUUFBUTtNQUFFQyxJQUFJLEVBQUMsRUFBRTtNQUFFQyxJQUFJLEVBQUMsRUFBRTtNQUFFQyxHQUFHLEVBQUMsQ0FBQyxFQUFFO01BQUVDLEdBQUcsRUFBQyxFQUFFO01BQUVDLEtBQUssRUFBQyxNQUFNO01BQUVDLFNBQVMsRUFBQztJQUFJLENBQUMsQ0FBQztJQUFBQyxVQUFBLEdBQUFwQixjQUFBLENBQUFXLFVBQUE7SUFBeklVLE1BQU0sR0FBQUQsVUFBQTtJQUFFRSxTQUFTLEdBQUFGLFVBQUE7RUFDeEIsSUFBQUcsVUFBQSxHQUFvQ3pDLFFBQVEsQ0FBQztNQUFFMEMsUUFBUSxFQUFDLGFBQWE7TUFBRUMsSUFBSSxFQUFDLGFBQWE7TUFBRUMsR0FBRyxFQUFDLE9BQU87TUFBRUMsR0FBRyxFQUFDLENBQUM7SUFBUSxDQUFDLENBQUM7SUFBQUMsVUFBQSxHQUFBNUIsY0FBQSxDQUFBdUIsVUFBQTtJQUFoSE0sTUFBTSxHQUFBRCxVQUFBO0lBQUVFLFNBQVMsR0FBQUYsVUFBQTtFQUN4QixJQUFBRyxVQUFBLEdBQW9DakQsUUFBUSxDQUFDLE1BQU07TUFDL0M7QUFDUjtBQUNBO01BQ1EsSUFBSTtRQUNBLElBQU1rRCxDQUFDLEdBQUdDLFlBQVksQ0FBQ0MsT0FBTyxDQUFDLFdBQVcsQ0FBQztRQUMzQyxJQUFNQyxPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUMsT0FBTyxFQUFDLE9BQU8sRUFBQyxJQUFJLEVBQUMsSUFBSSxDQUFDO1FBQ2hELElBQUlILENBQUMsSUFBSUcsT0FBTyxDQUFDQyxPQUFPLENBQUNKLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLE9BQU87VUFBRUssSUFBSSxFQUFFTDtRQUFFLENBQUM7TUFDMUQsQ0FBQyxDQUFDLE9BQU9NLENBQUMsRUFBRSxDQUFFO01BQ2QsT0FBTztRQUFFRCxJQUFJLEVBQUM7TUFBSyxDQUFDO0lBQ3hCLENBQUMsQ0FBQztJQUFBRSxXQUFBLEdBQUF2QyxjQUFBLENBQUErQixVQUFBO0lBVktTLE9BQU8sR0FBQUQsV0FBQTtJQUFFRSxVQUFVLEdBQUFGLFdBQUE7RUFXMUIsSUFBQUcsV0FBQSxHQUFvQzVELFFBQVEsQ0FBQztNQUFFNkQsT0FBTyxFQUFDLENBQUMsU0FBUyxFQUFDLFFBQVEsRUFBQyxZQUFZO0lBQUUsQ0FBQyxDQUFDO0lBQUFDLFdBQUEsR0FBQTVDLGNBQUEsQ0FBQTBDLFdBQUE7SUFBcEZHLFNBQVMsR0FBQUQsV0FBQTtJQUFFRSxZQUFZLEdBQUFGLFdBQUE7RUFFOUIsSUFBTUcsYUFBYSxHQUFHQyxNQUFNLENBQUNDLE1BQU0sQ0FBQ2hELElBQUksQ0FBQyxDQUFDaUQsTUFBTSxDQUFDQyxPQUFPLENBQUMsQ0FBQ0MsTUFBTTtFQUVoRSxJQUFNQyxNQUFNLEdBQUlwRSxHQUFHLElBQUs7SUFDcEJpQixPQUFPLENBQUNvRCxDQUFDLElBQUFDLGFBQUEsQ0FBQUEsYUFBQSxLQUFTRCxDQUFDO01BQUUsQ0FBQ3JFLEdBQUcsR0FBRTtJQUFJLEVBQUUsQ0FBQztJQUNsQ3FCLFFBQVEsQ0FBQyxLQUFLLENBQUM7SUFDZkksUUFBUSxDQUFDLElBQUksQ0FBQztFQUNsQixDQUFDOztFQUVEO0VBQ0EsSUFBSUwsS0FBSyxLQUFLLEtBQUssRUFBRTtJQUNqQixvQkFBT3hCLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQ0MsbUJBQW1CO01BQUNDLEdBQUcsRUFBRXJDLE1BQU87TUFBQ3NDLE1BQU0sRUFBRXJDLFNBQVU7TUFDL0JzQyxNQUFNLEVBQUVBLENBQUEsS0FBTXRELFFBQVEsQ0FBQyxLQUFLLENBQUU7TUFDOUJ1RCxNQUFNLEVBQUVBLENBQUEsS0FBTVIsTUFBTSxDQUFDLEtBQUs7SUFBRSxDQUFFLENBQUM7RUFDL0Q7O0VBRUE7RUFDQSxvQkFDSXhFLEtBQUEsQ0FBQTJFLGFBQUE7SUFBS00sU0FBUyxFQUFDO0VBQXdCLGdCQUVuQ2pGLEtBQUEsQ0FBQTJFLGFBQUE7SUFBS00sU0FBUyxFQUFDO0VBQW1FLGdCQUM5RWpGLEtBQUEsQ0FBQTJFLGFBQUEsMkJBQ0kzRSxLQUFBLENBQUEyRSxhQUFBO0lBQUlNLFNBQVMsRUFBQztFQUFpRSxnQkFDM0VqRixLQUFBLENBQUEyRSxhQUFBO0lBQU1NLFNBQVMsRUFBQztFQUFjLEdBQUMsTUFBVSxDQUFDLEtBQUMsZUFBQWpGLEtBQUEsQ0FBQTJFLGFBQUE7SUFBTU0sU0FBUyxFQUFDO0VBQVksR0FBQyxRQUFZLENBQUMsZUFDckZqRixLQUFBLENBQUEyRSxhQUFBO0lBQU1NLFNBQVMsRUFBQztFQUFtQyxHQUFDLHVCQUErQixDQUNuRixDQUFDLGVBQ0xqRixLQUFBLENBQUEyRSxhQUFBO0lBQUdNLFNBQVMsRUFBQztFQUFxRCxHQUFDLCtDQUFnRCxDQUNsSCxDQUFDLGVBQ05qRixLQUFBLENBQUEyRSxhQUFBO0lBQUtNLFNBQVMsRUFBQztFQUF5QixnQkFDcENqRixLQUFBLENBQUEyRSxhQUFBO0lBQU1NLFNBQVMsRUFBQztFQUFrQyxHQUFFZixhQUFhLEVBQUMsU0FBYSxDQUFDLGVBQ2hGbEUsS0FBQSxDQUFBMkUsYUFBQTtJQUFHakUsSUFBSSxFQUFDLGlCQUFpQjtJQUN0QndFLE9BQU8sRUFBRUEsQ0FBQSxLQUFNO01BQUUsSUFBSTtRQUFFOUIsWUFBWSxDQUFDK0IsT0FBTyxDQUFDLGlCQUFpQixFQUFDLEdBQUcsQ0FBQztNQUFFLENBQUMsQ0FBQyxPQUFNMUIsQ0FBQyxFQUFDLENBQUM7SUFBRSxDQUFFO0lBQ25Gd0IsU0FBUyxFQUFDO0VBQTBFLEdBQUMsaUJBQWEsQ0FDcEcsQ0FDSixDQUFDLGVBV05qRixLQUFBLENBQUEyRSxhQUFBO0lBQUtNLFNBQVMsRUFBQywwQkFBMEI7SUFDcENHLEtBQUssRUFBRTtNQUFFQyxLQUFLLEVBQUMsa0JBQWtCO01BQUVDLFdBQVcsRUFBQyxPQUFPO01BQUVDLGNBQWMsRUFBQztJQUFPO0VBQUUsR0FDaEZwRixLQUFLLENBQUNxRixHQUFHLENBQUMsQ0FBQ0MsQ0FBQyxFQUFFQyxDQUFDLEtBQUs7SUFDakIsSUFBTUMsUUFBUSxHQUFHLENBQUMsRUFBRSxHQUFHRCxDQUFDLEdBQUcsRUFBRTtJQUM3QixJQUFNRSxLQUFLLEdBQUdELFFBQVEsR0FBR0UsSUFBSSxDQUFDQyxFQUFFLEdBQUcsR0FBRztJQUN0QyxJQUFNQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQXdCO0lBQ3JDLElBQU1DLENBQUMsR0FBRyxFQUFFLEdBQUdELENBQUMsR0FBR0YsSUFBSSxDQUFDSSxHQUFHLENBQUNMLEtBQUssQ0FBQyxDQUFDLENBQUU7SUFDckMsSUFBTU0sQ0FBQyxHQUFHLEVBQUUsR0FBR0gsQ0FBQyxHQUFHRixJQUFJLENBQUNNLEdBQUcsQ0FBQ1AsS0FBSyxDQUFDLENBQUMsQ0FBRTtJQUNyQyxvQkFDSTVGLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQ3lCLFVBQVU7TUFBQ2hHLEdBQUcsRUFBRXFGLENBQUMsQ0FBQ3JGLEdBQUk7TUFDWGlHLElBQUksRUFBRVosQ0FBRTtNQUNSckUsSUFBSSxFQUFFQSxJQUFJLENBQUNxRSxDQUFDLENBQUNyRixHQUFHLENBQUU7TUFDbEJrRyxLQUFLLEVBQUVaLENBQUMsR0FBQyxDQUFFO01BQ1hhLE9BQU8sRUFBRVAsQ0FBRTtNQUNYUSxNQUFNLEVBQUVOLENBQUU7TUFDVmhCLE9BQU8sRUFBRUEsQ0FBQSxLQUFNO1FBQ1gsSUFBSU8sQ0FBQyxDQUFDbEYsSUFBSSxLQUFLLE1BQU0sRUFBT2tCLFFBQVEsQ0FBQ2dFLENBQUMsQ0FBQ3JGLEdBQUcsQ0FBQyxDQUFDLEtBQ3ZDLElBQUlxRixDQUFDLENBQUNsRixJQUFJLEtBQUssTUFBTSxFQUFFa0csTUFBTSxDQUFDQyxJQUFJLENBQUNqQixDQUFDLENBQUMvRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDLEtBQzFDbUIsUUFBUSxDQUFDNEQsQ0FBQyxDQUFDckYsR0FBRyxDQUFDO01BQy9DO0lBQUUsQ0FBRSxDQUFDO0VBRXpCLENBQUMsQ0FBQyxlQU1GSixLQUFBLENBQUEyRSxhQUFBO0lBQUtNLFNBQVMsRUFBQyxvREFBb0Q7SUFDOUQwQixPQUFPLEVBQUMsYUFBYTtJQUFDQyxtQkFBbUIsRUFBQyxNQUFNO0lBQUMsZUFBWTtFQUFNLGdCQUNwRTVHLEtBQUEsQ0FBQTJFLGFBQUE7SUFBUWtDLEVBQUUsRUFBQyxJQUFJO0lBQUNDLEVBQUUsRUFBQyxJQUFJO0lBQUNmLENBQUMsRUFBQyxJQUFJO0lBQ3RCZ0IsSUFBSSxFQUFDLE1BQU07SUFDWEMsTUFBTSxFQUFDLHdCQUF3QjtJQUMvQkMsV0FBVyxFQUFDLE1BQU07SUFDbEJDLGVBQWUsRUFBQztFQUFTLENBQUUsQ0FDbEMsQ0FDSixDQUFDLGVBR05sSCxLQUFBLENBQUEyRSxhQUFBO0lBQUtNLFNBQVMsRUFBQyxtRUFBbUU7SUFBQ0csS0FBSyxFQUFFO01BQUNHLGNBQWMsRUFBQztJQUFNO0VBQUUsZ0JBQzlHdkYsS0FBQSxDQUFBMkUsYUFBQTtJQUFHTSxTQUFTLEVBQUM7RUFBa0MsR0FDMUNmLGFBQWEsS0FBSyxDQUFDLElBQUksMEVBQTBFLEVBQ2pHQSxhQUFhLEdBQUcsQ0FBQyxJQUFJQSxhQUFhLEdBQUcsQ0FBQyxjQUFBaUQsTUFBQSxDQUFTLENBQUMsR0FBR2pELGFBQWEsV0FBQWlELE1BQUEsQ0FBUSxDQUFDLEdBQUdqRCxhQUFhLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLDJCQUF3QixFQUNsSUEsYUFBYSxLQUFLLENBQUMsSUFBSSw4Q0FDekIsQ0FBQyxlQUNKbEUsS0FBQSxDQUFBMkUsYUFBQTtJQUFHakUsSUFBSSxFQUFDLGlCQUFpQjtJQUN0QndFLE9BQU8sRUFBRUEsQ0FBQSxLQUFNO01BQUUsSUFBSTtRQUFFOUIsWUFBWSxDQUFDK0IsT0FBTyxDQUFDLGlCQUFpQixFQUFDLEdBQUcsQ0FBQztNQUFFLENBQUMsQ0FBQyxPQUFNMUIsQ0FBQyxFQUFDLENBQUM7SUFBRSxDQUFFO0lBQ25Gd0IsU0FBUyxxSEFBQWtDLE1BQUEsQ0FDSWpELGFBQWEsS0FBSyxDQUFDLEdBQ2YsZ0ZBQWdGLEdBQ2hGLDZFQUE2RTtFQUFHLEdBQUMsdUJBRWxHLENBQ0YsQ0FBQyxFQUdMdEMsS0FBSyxLQUFLLFVBQVUsaUJBQUk1QixLQUFBLENBQUEyRSxhQUFBLENBQUN5QyxhQUFhO0lBQUN2QyxHQUFHLEVBQUU3QixNQUFPO0lBQUM4QixNQUFNLEVBQUU3QixTQUFVO0lBQ2hDb0UsT0FBTyxFQUFFQSxDQUFBLEtBQU14RixRQUFRLENBQUMsSUFBSSxDQUFFO0lBQzlCbUQsTUFBTSxFQUFFQSxDQUFBLEtBQU1SLE1BQU0sQ0FBQyxVQUFVO0VBQUUsQ0FBRSxDQUFDLEVBQzFFNUMsS0FBSyxLQUFLLFVBQVUsaUJBQUk1QixLQUFBLENBQUEyRSxhQUFBLENBQUMyQyxhQUFhO0lBQUN6QyxHQUFHLEVBQUVsQixPQUFRO0lBQUNtQixNQUFNLEVBQUVsQixVQUFXO0lBQ2xDeUQsT0FBTyxFQUFFQSxDQUFBLEtBQU14RixRQUFRLENBQUMsSUFBSSxDQUFFO0lBQzlCbUQsTUFBTSxFQUFFQSxDQUFBLEtBQU1SLE1BQU0sQ0FBQyxVQUFVO0VBQUUsQ0FBRSxDQUFDLEVBQzFFNUMsS0FBSyxLQUFLLFNBQVMsaUJBQUs1QixLQUFBLENBQUEyRSxhQUFBLENBQUM0QyxZQUFZO0lBQUUxQyxHQUFHLEVBQUViLFNBQVU7SUFBQ2MsTUFBTSxFQUFFYixZQUFhO0lBQ3RDb0QsT0FBTyxFQUFFQSxDQUFBLEtBQU14RixRQUFRLENBQUMsSUFBSSxDQUFFO0lBQzlCbUQsTUFBTSxFQUFFQSxDQUFBLEtBQU1SLE1BQU0sQ0FBQyxTQUFTO0VBQUUsQ0FBRSxDQUN4RSxDQUFDO0FBRWQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTZ0QsSUFBSUEsQ0FBQUMsSUFBQSxFQUFpQztFQUFBLElBQTlCcEIsSUFBSSxHQUFBb0IsSUFBQSxDQUFKcEIsSUFBSTtJQUFFakYsSUFBSSxHQUFBcUcsSUFBQSxDQUFKckcsSUFBSTtJQUFFa0YsS0FBSyxHQUFBbUIsSUFBQSxDQUFMbkIsS0FBSztJQUFFcEIsT0FBTyxHQUFBdUMsSUFBQSxDQUFQdkMsT0FBTztFQUN0QyxvQkFDSWxGLEtBQUEsQ0FBQTJFLGFBQUE7SUFBUU8sT0FBTyxFQUFFQSxPQUFRO0lBQ2pCLDZCQUFBaUMsTUFBQSxDQUEyQmQsSUFBSSxDQUFDakcsR0FBRyxDQUFHO0lBQ3RDLHNCQUFBK0csTUFBQSxDQUFvQmQsSUFBSSxDQUFDaEcsS0FBSyxDQUFHO0lBQ2pDNEUsU0FBUyxrSUFBQWtDLE1BQUEsQ0FDNEIvRixJQUFJLEdBQUcsTUFBTSxHQUFHLEVBQUU7RUFBRyxHQUM3REEsSUFBSSxpQkFBSXBCLEtBQUEsQ0FBQTJFLGFBQUE7SUFBTU0sU0FBUyxFQUFDLE9BQU87SUFBQyw2QkFBQWtDLE1BQUEsQ0FBMkJkLElBQUksQ0FBQ2pHLEdBQUc7RUFBUSxHQUFDLFFBQU8sQ0FBQyxlQUNyRkosS0FBQSxDQUFBMkUsYUFBQTtJQUFLTSxTQUFTLEVBQUM7RUFBOEIsZ0JBQ3pDakYsS0FBQSxDQUFBMkUsYUFBQTtJQUFLTSxTQUFTLEVBQUMsdURBQXVEO0lBQ2pFRyxLQUFLLEVBQUU7TUFBQ3NDLFVBQVUsS0FBQVAsTUFBQSxDQUFJZCxJQUFJLENBQUM3RixTQUFTLE9BQUk7TUFBRW1ILE1BQU0sZUFBQVIsTUFBQSxDQUFjZCxJQUFJLENBQUM3RixTQUFTO0lBQUk7RUFBRSxnQkFDbkZSLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQ2lELFFBQVE7SUFBQ3JILElBQUksRUFBRThGLElBQUksQ0FBQ2pHLEdBQUk7SUFBQ3lILEtBQUssRUFBRXhCLElBQUksQ0FBQzdGO0VBQVUsQ0FBRSxDQUNqRCxDQUFDLGVBQ05SLEtBQUEsQ0FBQTJFLGFBQUE7SUFBS00sU0FBUyxFQUFDO0VBQW9DLEdBQUMsR0FBQyxFQUFDcUIsS0FBVyxDQUNoRSxDQUFDLGVBQ050RyxLQUFBLENBQUEyRSxhQUFBO0lBQUlNLFNBQVMsRUFBQyw2REFBNkQ7SUFDdkVHLEtBQUssRUFBRTtNQUFDeUMsS0FBSyxFQUFDeEIsSUFBSSxDQUFDN0Y7SUFBUztFQUFFLEdBQUU2RixJQUFJLENBQUNoRyxLQUFVLENBQUMsZUFDcERMLEtBQUEsQ0FBQTJFLGFBQUE7SUFBR00sU0FBUyxFQUFDO0VBQXFDLEdBQUVvQixJQUFJLENBQUMvRixHQUFPLENBQUMsZUFDakVOLEtBQUEsQ0FBQTJFLGFBQUE7SUFBS00sU0FBUyxFQUFDO0VBQTZGLGdCQUN4R2pGLEtBQUEsQ0FBQTJFLGFBQUE7SUFBTU0sU0FBUyxFQUFDO0VBQWtDLEdBQUVvQixJQUFJLENBQUM5RixJQUFJLEtBQUssTUFBTSxHQUFHLFdBQVcsR0FBRyxPQUFjLENBQUMsRUFDdkdhLElBQUksaUJBQUlwQixLQUFBLENBQUEyRSxhQUFBO0lBQU1NLFNBQVMsRUFBQztFQUF5QyxHQUFDLFlBQWdCLENBQ2xGLENBQ0QsQ0FBQztBQUVqQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBU21CLFVBQVVBLENBQUEwQixLQUFBLEVBQWtEO0VBQUEsSUFBL0N6QixJQUFJLEdBQUF5QixLQUFBLENBQUp6QixJQUFJO0lBQUVqRixJQUFJLEdBQUEwRyxLQUFBLENBQUoxRyxJQUFJO0lBQUVrRixLQUFLLEdBQUF3QixLQUFBLENBQUx4QixLQUFLO0lBQUVDLE9BQU8sR0FBQXVCLEtBQUEsQ0FBUHZCLE9BQU87SUFBRUMsTUFBTSxHQUFBc0IsS0FBQSxDQUFOdEIsTUFBTTtJQUFFdEIsT0FBTyxHQUFBNEMsS0FBQSxDQUFQNUMsT0FBTztFQUM3RDtBQUNKO0FBQ0E7RUFDSSxJQUFNNkMsU0FBUyxHQUFHMUIsSUFBSSxDQUFDN0YsU0FBUztFQUNoQyxvQkFDSVIsS0FBQSxDQUFBMkUsYUFBQTtJQUFRTyxPQUFPLEVBQUVBLE9BQVE7SUFDakIsNkJBQUFpQyxNQUFBLENBQTJCZCxJQUFJLENBQUNqRyxHQUFHLENBQUc7SUFDdEMsc0JBQUErRyxNQUFBLENBQW9CZCxJQUFJLENBQUNoRyxLQUFLLENBQUc7SUFDakM0RSxTQUFTLHNOQUFBa0MsTUFBQSxDQUdLL0YsSUFBSSxHQUNBLDhEQUE4RCxHQUM5RCx1Q0FBdUMsQ0FBRztJQUM1RGdFLEtBQUssRUFBRTtNQUNINEMsSUFBSSxLQUFBYixNQUFBLENBQUlaLE9BQU8sTUFBRztNQUFFMEIsR0FBRyxLQUFBZCxNQUFBLENBQUlYLE1BQU0sTUFBRztNQUNwQ25CLEtBQUssRUFBQyxpQkFBaUI7TUFBRUMsV0FBVyxFQUFDLEtBQUs7TUFDMUM0QyxTQUFTLEVBQUMsdUJBQXVCO01BQ2pDUCxNQUFNLGdCQUFBUixNQUFBLENBQWVZLFNBQVMsQ0FBRTtNQUNoQ0ksU0FBUyxlQUFBaEIsTUFBQSxDQUFjWSxTQUFTLDBCQUFBWixNQUFBLENBQXVCWSxTQUFTO0lBQ3BFO0VBQUUsR0FDTDNHLElBQUksaUJBQ0RwQixLQUFBLENBQUEyRSxhQUFBO0lBQU0sNkJBQUF3QyxNQUFBLENBQTJCZCxJQUFJLENBQUNqRyxHQUFHLFVBQVE7SUFDM0M2RSxTQUFTLEVBQUM7RUFBbUksR0FBQyxRQUU5SSxDQUNULGVBQ0RqRixLQUFBLENBQUEyRSxhQUFBO0lBQUtNLFNBQVMsRUFBQyxrREFBa0Q7SUFDNURHLEtBQUssRUFBRTtNQUNKQyxLQUFLLEVBQUMsS0FBSztNQUFFQyxXQUFXLEVBQUMsS0FBSztNQUM5Qm9DLFVBQVUsS0FBQVAsTUFBQSxDQUFJZCxJQUFJLENBQUM3RixTQUFTLE9BQUk7TUFDaENtSCxNQUFNLGVBQUFSLE1BQUEsQ0FBY2QsSUFBSSxDQUFDN0YsU0FBUztJQUNyQztFQUFFLGdCQUNIUixLQUFBLENBQUEyRSxhQUFBLENBQUNpRCxRQUFRO0lBQUNySCxJQUFJLEVBQUU4RixJQUFJLENBQUNqRyxHQUFJO0lBQUN5SCxLQUFLLEVBQUV4QixJQUFJLENBQUM3RjtFQUFVLENBQUUsQ0FDakQsQ0FBQyxlQUNOUixLQUFBLENBQUEyRSxhQUFBO0lBQUtNLFNBQVMsRUFBQztFQUFzRCxHQUFDLEdBQUMsRUFBQ3FCLEtBQVcsQ0FBQyxlQUNwRnRHLEtBQUEsQ0FBQTJFLGFBQUE7SUFBSU0sU0FBUyxFQUFDLDBGQUEwRjtJQUNwR0csS0FBSyxFQUFFO01BQUN5QyxLQUFLLEVBQUN4QixJQUFJLENBQUM3RjtJQUFTO0VBQUUsR0FDN0I2RixJQUFJLENBQUNoRyxLQUNOLENBQUMsZUFDTEwsS0FBQSxDQUFBMkUsYUFBQTtJQUFHTSxTQUFTLEVBQUM7RUFBZ0YsR0FDeEZvQixJQUFJLENBQUMvRixHQUNQLENBQ0MsQ0FBQztBQUVqQjtBQUVBLFNBQVNzSCxRQUFRQSxDQUFBUSxLQUFBLEVBQWtCO0VBQUEsSUFBZjdILElBQUksR0FBQTZILEtBQUEsQ0FBSjdILElBQUk7SUFBRXNILEtBQUssR0FBQU8sS0FBQSxDQUFMUCxLQUFLO0VBQzNCO0VBQ0EsSUFBTWIsTUFBTSxHQUFHO0lBQUVBLE1BQU0sRUFBQ2EsS0FBSztJQUFFZCxJQUFJLEVBQUMsTUFBTTtJQUFFRSxXQUFXLEVBQUMsQ0FBQztJQUFFb0IsYUFBYSxFQUFDLE9BQU87SUFBRUMsY0FBYyxFQUFDO0VBQVEsQ0FBQztFQUMxRyxJQUFJL0gsSUFBSSxLQUFLLEtBQUssRUFBTyxvQkFBT1AsS0FBQSxDQUFBMkUsYUFBQSxRQUFBNEQsUUFBQTtJQUFLbEQsS0FBSyxFQUFDLElBQUk7SUFBQ21ELE1BQU0sRUFBQyxJQUFJO0lBQUM3QixPQUFPLEVBQUM7RUFBVyxHQUFLSyxNQUFNLGdCQUFFaEgsS0FBQSxDQUFBMkUsYUFBQTtJQUFNRixDQUFDLEVBQUM7RUFBWSxDQUFDLENBQUMsZUFBQXpFLEtBQUEsQ0FBQTJFLGFBQUE7SUFBTUYsQ0FBQyxFQUFDO0VBQTJCLENBQUMsQ0FBTSxDQUFDO0VBQzdKLElBQUlsRSxJQUFJLEtBQUssVUFBVSxFQUFFLG9CQUFPUCxLQUFBLENBQUEyRSxhQUFBLFFBQUE0RCxRQUFBO0lBQUtsRCxLQUFLLEVBQUMsSUFBSTtJQUFDbUQsTUFBTSxFQUFDLElBQUk7SUFBQzdCLE9BQU8sRUFBQztFQUFXLEdBQUtLLE1BQU0sZ0JBQUVoSCxLQUFBLENBQUEyRSxhQUFBO0lBQU1GLENBQUMsRUFBQztFQUFvRCxDQUFDLENBQUMsZUFBQXpFLEtBQUEsQ0FBQTJFLGFBQUE7SUFBUWtDLEVBQUUsRUFBQyxJQUFJO0lBQUNDLEVBQUUsRUFBQyxJQUFJO0lBQUNmLENBQUMsRUFBQztFQUFLLENBQUMsQ0FBTSxDQUFDO0VBQ2pNLElBQUl4RixJQUFJLEtBQUssVUFBVSxFQUFFLG9CQUFPUCxLQUFBLENBQUEyRSxhQUFBLFFBQUE0RCxRQUFBO0lBQUtsRCxLQUFLLEVBQUMsSUFBSTtJQUFDbUQsTUFBTSxFQUFDLElBQUk7SUFBQzdCLE9BQU8sRUFBQztFQUFXLEdBQUtLLE1BQU0sZ0JBQUVoSCxLQUFBLENBQUEyRSxhQUFBO0lBQVFrQyxFQUFFLEVBQUMsSUFBSTtJQUFDQyxFQUFFLEVBQUMsSUFBSTtJQUFDZixDQUFDLEVBQUM7RUFBRyxDQUFDLENBQUMsZUFBQS9GLEtBQUEsQ0FBQTJFLGFBQUE7SUFBTUYsQ0FBQyxFQUFDO0VBQXNELENBQUMsQ0FBTSxDQUFDO0VBQ2pNLElBQUlsRSxJQUFJLEtBQUssU0FBUyxFQUFHLG9CQUFPUCxLQUFBLENBQUEyRSxhQUFBLFFBQUE0RCxRQUFBO0lBQUtsRCxLQUFLLEVBQUMsSUFBSTtJQUFDbUQsTUFBTSxFQUFDLElBQUk7SUFBQzdCLE9BQU8sRUFBQztFQUFXLEdBQUtLLE1BQU0sZ0JBQUVoSCxLQUFBLENBQUEyRSxhQUFBO0lBQU1GLENBQUMsRUFBQztFQUFlLENBQUMsQ0FBQyxlQUFBekUsS0FBQSxDQUFBMkUsYUFBQTtJQUFNRixDQUFDLEVBQUM7RUFBcUMsQ0FBQyxDQUFNLENBQUM7RUFDMUs7RUFDQSxJQUFJbEUsSUFBSSxLQUFLLFFBQVEsRUFBSSxvQkFBT1AsS0FBQSxDQUFBMkUsYUFBQSxRQUFBNEQsUUFBQTtJQUFLbEQsS0FBSyxFQUFDLElBQUk7SUFBQ21ELE1BQU0sRUFBQyxJQUFJO0lBQUM3QixPQUFPLEVBQUM7RUFBVyxHQUFLSyxNQUFNLGdCQUFFaEgsS0FBQSxDQUFBMkUsYUFBQTtJQUFNRixDQUFDLEVBQUM7RUFBaUcsQ0FBQyxDQUFNLENBQUM7RUFDN00sT0FBTyxJQUFJO0FBQ2Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBU0csbUJBQW1CQSxDQUFBNkQsS0FBQSxFQUFrQztFQUFBLElBQS9CNUQsR0FBRyxHQUFBNEQsS0FBQSxDQUFINUQsR0FBRztJQUFFQyxNQUFNLEdBQUEyRCxLQUFBLENBQU4zRCxNQUFNO0lBQUVDLE1BQU0sR0FBQTBELEtBQUEsQ0FBTjFELE1BQU07SUFBRUMsTUFBTSxHQUFBeUQsS0FBQSxDQUFOekQsTUFBTTtFQUN0RCxJQUFNMEQsTUFBTSxHQUFHQSxDQUFDQyxDQUFDLEVBQUV4RixDQUFDLEtBQUsyQixNQUFNLENBQUM4RCxDQUFDLElBQUFsRSxhQUFBLENBQUFBLGFBQUEsS0FBU2tFLENBQUM7SUFBRSxDQUFDRCxDQUFDLEdBQUV4RjtFQUFDLEVBQUUsQ0FBQzs7RUFFckQ7QUFDSjtBQUNBO0FBQ0E7QUFDQTtFQUNJbkQsS0FBSyxDQUFDNkksU0FBUyxDQUFDLE1BQU07SUFDbEIsSUFBSTtNQUNBLElBQU1DLEdBQUcsR0FBTTFGLFlBQVksQ0FBQ0MsT0FBTyxDQUFDLHVCQUF1QixDQUFDO01BQzVELElBQU0wRixNQUFNLEdBQUczRixZQUFZLENBQUNDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztNQUNyRCxJQUFNMkYsS0FBSyxHQUFJLENBQUMsQ0FBQztNQUNqQixJQUFJRixHQUFHLEVBQUU7UUFDTCxJQUFNRyxDQUFDLEdBQUdDLElBQUksQ0FBQ0MsS0FBSyxDQUFDTCxHQUFHLENBQUM7UUFDekIsSUFBSU0sTUFBTSxDQUFDQyxRQUFRLENBQUNKLENBQUMsQ0FBQ0ssRUFBRSxDQUFDLElBQUlGLE1BQU0sQ0FBQ0MsUUFBUSxDQUFDSixDQUFDLENBQUNNLEVBQUUsQ0FBQyxJQUFJTixDQUFDLENBQUNLLEVBQUUsR0FBR0wsQ0FBQyxDQUFDTSxFQUFFLEVBQUU7VUFDL0RQLEtBQUssQ0FBQy9HLElBQUksR0FBR2dILENBQUMsQ0FBQ0ssRUFBRTtVQUNqQk4sS0FBSyxDQUFDOUcsSUFBSSxHQUFHK0csQ0FBQyxDQUFDTSxFQUFFO1FBQ3JCO01BQ0o7TUFDQSxJQUFJUixNQUFNLElBQUlTLFVBQVUsQ0FBQ0MsSUFBSSxDQUFDekQsQ0FBQyxJQUFJQSxDQUFDLENBQUMwRCxFQUFFLEtBQUtYLE1BQU0sQ0FBQyxFQUFFO1FBQ2pEQyxLQUFLLENBQUNoSCxRQUFRLEdBQUcrRyxNQUFNO01BQzNCO01BQ0E7TUFDQSxJQUFNWSxFQUFFLEdBQUd2RyxZQUFZLENBQUNDLE9BQU8sQ0FBQyxZQUFZLENBQUM7TUFDN0MsSUFBSXNHLEVBQUUsS0FBSyxPQUFPLElBQUlBLEVBQUUsS0FBSyxNQUFNLEVBQUVYLEtBQUssQ0FBQzNHLEtBQUssR0FBR3NILEVBQUU7TUFDckQsSUFBTUMsRUFBRSxHQUFHQyxVQUFVLENBQUN6RyxZQUFZLENBQUNDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO01BQzdELElBQUkrRixNQUFNLENBQUNDLFFBQVEsQ0FBQ08sRUFBRSxDQUFDLElBQUlBLEVBQUUsSUFBSSxHQUFHLElBQUlBLEVBQUUsSUFBSSxHQUFHLEVBQUVaLEtBQUssQ0FBQzFHLFNBQVMsR0FBR3NILEVBQUU7TUFDdkU7QUFDWjtBQUNBO01BQ1ksSUFBSTtRQUNBLElBQU1FLEtBQUssR0FBRzFHLFlBQVksQ0FBQ0MsT0FBTyxDQUFDLGlCQUFpQixDQUFDO1FBQ3JELElBQUl5RyxLQUFLLEVBQUU7VUFDUCxJQUFNQyxFQUFFLEdBQUdiLElBQUksQ0FBQ0MsS0FBSyxDQUFDVyxLQUFLLENBQUM7VUFDNUIsSUFBSVYsTUFBTSxDQUFDQyxRQUFRLENBQUNVLEVBQUUsQ0FBQ0MsR0FBRyxDQUFDLElBQUlaLE1BQU0sQ0FBQ0MsUUFBUSxDQUFDVSxFQUFFLENBQUNFLEdBQUcsQ0FBQyxJQUFJRixFQUFFLENBQUNDLEdBQUcsR0FBR0QsRUFBRSxDQUFDRSxHQUFHLEVBQUU7WUFDdkVqQixLQUFLLENBQUM3RyxHQUFHLEdBQUc0SCxFQUFFLENBQUNDLEdBQUc7WUFDbEJoQixLQUFLLENBQUM1RyxHQUFHLEdBQUcySCxFQUFFLENBQUNFLEdBQUc7VUFDdEI7UUFDSjtNQUNKLENBQUMsQ0FBQyxPQUFPeEcsQ0FBQyxFQUFFLENBQUU7TUFDZCxJQUFJVSxNQUFNLENBQUMrRixJQUFJLENBQUNsQixLQUFLLENBQUMsQ0FBQ3pFLE1BQU0sRUFBRU8sTUFBTSxDQUFDOEQsQ0FBQyxJQUFBbEUsYUFBQSxDQUFBQSxhQUFBLEtBQVNrRSxDQUFDLEdBQUtJLEtBQUssQ0FBRSxDQUFDO0lBQ2xFLENBQUMsQ0FBQyxPQUFPdkYsQ0FBQyxFQUFFLENBQUU7SUFDbEI7RUFDQSxDQUFDLEVBQUUsRUFBRSxDQUFDOztFQUVOO0FBQ0o7QUFDQTtFQUNJLElBQU0wRyxjQUFjLEdBQUdBLENBQUEsS0FBTTtJQUN6QixJQUFJO01BQ0EvRyxZQUFZLENBQUMrQixPQUFPLENBQUMsdUJBQXVCLEVBQ3hDK0QsSUFBSSxDQUFDa0IsU0FBUyxDQUFDO1FBQUVkLEVBQUUsRUFBRXpFLEdBQUcsQ0FBQzVDLElBQUk7UUFBRXNILEVBQUUsRUFBRTFFLEdBQUcsQ0FBQzNDO01BQUssQ0FBQyxDQUFDLENBQUM7TUFDbkQsSUFBSTJDLEdBQUcsQ0FBQzdDLFFBQVEsRUFBRTtRQUNkb0IsWUFBWSxDQUFDK0IsT0FBTyxDQUFDLGdCQUFnQixFQUFFTixHQUFHLENBQUM3QyxRQUFRLENBQUM7TUFDeEQ7TUFDQTtBQUNaO0FBQ0E7QUFDQTtNQUNZLElBQUk2QyxHQUFHLENBQUN4QyxLQUFLLEtBQUssT0FBTyxJQUFJd0MsR0FBRyxDQUFDeEMsS0FBSyxLQUFLLE1BQU0sRUFBRTtRQUMvQ2UsWUFBWSxDQUFDK0IsT0FBTyxDQUFDLFlBQVksRUFBRU4sR0FBRyxDQUFDeEMsS0FBSyxDQUFDO01BQ2pEO01BQ0EsSUFBSStHLE1BQU0sQ0FBQ0MsUUFBUSxDQUFDeEUsR0FBRyxDQUFDdkMsU0FBUyxDQUFDLEVBQUU7UUFDaENjLFlBQVksQ0FBQytCLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRWtGLE1BQU0sQ0FBQ3hGLEdBQUcsQ0FBQ3ZDLFNBQVMsQ0FBQyxDQUFDO01BQ2pFO01BQ0E7QUFDWjtBQUNBO0FBQ0E7QUFDQTtNQUNZLElBQUk4RyxNQUFNLENBQUNDLFFBQVEsQ0FBQ3hFLEdBQUcsQ0FBQzFDLEdBQUcsQ0FBQyxJQUFJaUgsTUFBTSxDQUFDQyxRQUFRLENBQUN4RSxHQUFHLENBQUN6QyxHQUFHLENBQUMsSUFBSXlDLEdBQUcsQ0FBQzFDLEdBQUcsR0FBRzBDLEdBQUcsQ0FBQ3pDLEdBQUcsRUFBRTtRQUMzRWdCLFlBQVksQ0FBQytCLE9BQU8sQ0FBQyxpQkFBaUIsRUFDbEMrRCxJQUFJLENBQUNrQixTQUFTLENBQUM7VUFBRUosR0FBRyxFQUFFbkYsR0FBRyxDQUFDMUMsR0FBRztVQUFFOEgsR0FBRyxFQUFFcEYsR0FBRyxDQUFDekM7UUFBSSxDQUFDLENBQUMsQ0FBQztRQUNuRHFFLE1BQU0sQ0FBQzZELGFBQWEsQ0FBQyxJQUFJQyxXQUFXLENBQUMsc0JBQXNCLEVBQUU7VUFDekRDLE1BQU0sRUFBRTtZQUFFUixHQUFHLEVBQUVuRixHQUFHLENBQUMxQyxHQUFHO1lBQUU4SCxHQUFHLEVBQUVwRixHQUFHLENBQUN6QztVQUFJO1FBQ3pDLENBQUMsQ0FBQyxDQUFDO01BQ1A7TUFDQXFFLE1BQU0sQ0FBQzZELGFBQWEsQ0FBQyxJQUFJQyxXQUFXLENBQUMsbUJBQW1CLEVBQUU7UUFDdERDLE1BQU0sRUFBRTtVQUFFbEIsRUFBRSxFQUFFekUsR0FBRyxDQUFDNUMsSUFBSTtVQUFFc0gsRUFBRSxFQUFFMUUsR0FBRyxDQUFDM0M7UUFBSztNQUN6QyxDQUFDLENBQUMsQ0FBQztNQUNIdUksT0FBTyxDQUFDQyxJQUFJLENBQUMsb0NBQW9DLEVBQUU3RixHQUFHLENBQUM1QyxJQUFJLEVBQUUsR0FBRyxFQUFFNEMsR0FBRyxDQUFDM0MsSUFBSSxFQUM3RCxVQUFVLEVBQUUyQyxHQUFHLENBQUMxQyxHQUFHLEVBQUUsSUFBSSxFQUFFMEMsR0FBRyxDQUFDekMsR0FBRyxFQUFFLFlBQVksRUFBRXlDLEdBQUcsQ0FBQzdDLFFBQVEsQ0FBQztJQUNoRixDQUFDLENBQUMsT0FBT3lCLENBQUMsRUFBRTtNQUNSZ0gsT0FBTyxDQUFDRSxJQUFJLENBQUMsOENBQThDLEVBQUVsSCxDQUFDLENBQUM7SUFDbkU7SUFDQXVCLE1BQU0sQ0FBQyxDQUFDO0VBQ1osQ0FBQztFQUVELG9CQUNJaEYsS0FBQSxDQUFBMkUsYUFBQTtJQUFLTSxTQUFTLEVBQUM7RUFBNEIsZ0JBRXZDakYsS0FBQSxDQUFBMkUsYUFBQTtJQUFLTSxTQUFTLEVBQUM7RUFBdUUsZ0JBQ2xGakYsS0FBQSxDQUFBMkUsYUFBQTtJQUFRTyxPQUFPLEVBQUVILE1BQU87SUFDaEJFLFNBQVMsRUFBQztFQUE4RSxHQUFDLHNCQUV6RixDQUFDLGVBQ1RqRixLQUFBLENBQUEyRSxhQUFBO0lBQUlNLFNBQVMsRUFBQztFQUErRCxHQUFDLG1CQUFxQixDQUFDLGVBQ3BHakYsS0FBQSxDQUFBMkUsYUFBQTtJQUFRTyxPQUFPLEVBQUVpRixjQUFlO0lBQ3hCbEYsU0FBUyxFQUFDO0VBQWdILEdBQUMsc0JBRTNILENBQ1AsQ0FBQyxlQUdOakYsS0FBQSxDQUFBMkUsYUFBQTtJQUFLTSxTQUFTLEVBQUM7RUFBcUYsZ0JBQ2hHakYsS0FBQSxDQUFBMkUsYUFBQSxDQUFDaUcsV0FBVztJQUFDL0YsR0FBRyxFQUFFQTtFQUFJLENBQUUsQ0FBQyxlQUN6QjdFLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQ2tHLGVBQWU7SUFBQ2hHLEdBQUcsRUFBRUEsR0FBSTtJQUFDNkQsTUFBTSxFQUFFQSxNQUFPO0lBQUM1RCxNQUFNLEVBQUVBO0VBQU8sQ0FBRSxDQUMzRCxDQUNKLENBQUM7QUFFZDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFNMEUsVUFBVSxHQUFHLENBQ2Y7RUFBRUUsRUFBRSxFQUFDLFFBQVE7RUFBV3JKLEtBQUssRUFBQyxpQkFBaUI7RUFBa0JpSixFQUFFLEVBQUMsSUFBSTtFQUFFQyxFQUFFLEVBQUMsSUFBSTtFQUFFdUIsSUFBSSxFQUFDO0FBQUcsQ0FBQyxFQUM1RjtFQUFFcEIsRUFBRSxFQUFDLFFBQVE7RUFBV3JKLEtBQUssRUFBQyxRQUFRO0VBQTJCaUosRUFBRSxFQUFDLEVBQUU7RUFBSUMsRUFBRSxFQUFDLEVBQUU7RUFBSXVCLElBQUksRUFBQztBQUFxQyxDQUFDLEVBQzlIO0VBQUVwQixFQUFFLEVBQUMsUUFBUTtFQUFXckosS0FBSyxFQUFDLFFBQVE7RUFBMkJpSixFQUFFLEVBQUMsRUFBRTtFQUFJQyxFQUFFLEVBQUMsRUFBRTtFQUFJdUIsSUFBSSxFQUFDO0FBQXFDLENBQUMsRUFDOUg7RUFBRXBCLEVBQUUsRUFBQyxPQUFPO0VBQVlySixLQUFLLEVBQUMsa0JBQWtCO0VBQWlCaUosRUFBRSxFQUFDLEVBQUU7RUFBSUMsRUFBRSxFQUFDLEVBQUU7RUFBSXVCLElBQUksRUFBQztBQUFxQyxDQUFDLEVBQzlIO0VBQUVwQixFQUFFLEVBQUMsU0FBUztFQUFVckosS0FBSyxFQUFDLG1CQUFtQjtFQUFnQmlKLEVBQUUsRUFBQyxFQUFFO0VBQUlDLEVBQUUsRUFBQyxFQUFFO0VBQUl1QixJQUFJLEVBQUM7QUFBcUMsQ0FBQyxFQUM5SDtFQUFFcEIsRUFBRSxFQUFDLFVBQVU7RUFBU3JKLEtBQUssRUFBQyxvQkFBb0I7RUFBZWlKLEVBQUUsRUFBQyxFQUFFO0VBQUlDLEVBQUUsRUFBQyxFQUFFO0VBQUl1QixJQUFJLEVBQUM7QUFBcUMsQ0FBQyxFQUM5SDtFQUFFcEIsRUFBRSxFQUFDLFNBQVM7RUFBVXJKLEtBQUssRUFBQyxjQUFjO0VBQXFCaUosRUFBRSxFQUFDLEVBQUU7RUFBSUMsRUFBRSxFQUFDLEVBQUU7RUFBSXVCLElBQUksRUFBQztBQUFxQyxDQUFDLEVBQzlIO0VBQUVwQixFQUFFLEVBQUMsU0FBUztFQUFVckosS0FBSyxFQUFDLGNBQWM7RUFBcUJpSixFQUFFLEVBQUMsRUFBRTtFQUFJQyxFQUFFLEVBQUMsRUFBRTtFQUFJdUIsSUFBSSxFQUFDO0FBQXFDLENBQUMsRUFDOUg7RUFBRXBCLEVBQUUsRUFBQyxTQUFTO0VBQVVySixLQUFLLEVBQUMsY0FBYztFQUFxQmlKLEVBQUUsRUFBQyxFQUFFO0VBQUlDLEVBQUUsRUFBQyxFQUFFO0VBQUl1QixJQUFJLEVBQUM7QUFBcUMsQ0FBQyxFQUM5SDtFQUFFcEIsRUFBRSxFQUFDLFlBQVk7RUFBT3JKLEtBQUssRUFBQyxpQkFBaUI7RUFBa0JpSixFQUFFLEVBQUMsRUFBRTtFQUFJQyxFQUFFLEVBQUMsRUFBRTtFQUFJdUIsSUFBSSxFQUFDO0FBQXFDLENBQUMsQ0FDakk7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTRixXQUFXQSxDQUFBRyxLQUFBLEVBQVU7RUFBQSxJQUFQbEcsR0FBRyxHQUFBa0csS0FBQSxDQUFIbEcsR0FBRztFQUN0QjtFQUNBLElBQU1tRyxDQUFDLEdBQUcsR0FBRztJQUFFQyxDQUFDLEdBQUcsR0FBRztFQUN0QixJQUFNQyxHQUFHLEdBQUc7SUFBRWxELElBQUksRUFBRSxFQUFFO0lBQUVtRCxLQUFLLEVBQUUsRUFBRTtJQUFFbEQsR0FBRyxFQUFFLEVBQUU7SUFBRW1ELE1BQU0sRUFBRTtFQUFHLENBQUM7RUFDeEQsSUFBTUMsS0FBSyxHQUFHTCxDQUFDLEdBQUdFLEdBQUcsQ0FBQ2xELElBQUksR0FBR2tELEdBQUcsQ0FBQ0MsS0FBSztFQUN0QyxJQUFNRyxLQUFLLEdBQUdMLENBQUMsR0FBR0MsR0FBRyxDQUFDakQsR0FBRyxHQUFJaUQsR0FBRyxDQUFDRSxNQUFNO0VBRXZDLElBQU1HLEtBQUssR0FBRzFHLEdBQUcsQ0FBQzFDLEdBQUc7SUFBRXFKLEtBQUssR0FBRzNHLEdBQUcsQ0FBQ3pDLEdBQUc7RUFDdEMsSUFBTXFKLEtBQUssR0FBRyxDQUFDO0lBQVFDLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBVTs7RUFFL0M7RUFDQSxJQUFNMUYsQ0FBQyxHQUFLMkYsQ0FBQyxJQUFLVCxHQUFHLENBQUNsRCxJQUFJLEdBQUksQ0FBQzJELENBQUMsR0FBR0osS0FBSyxLQUFLQyxLQUFLLEdBQUdELEtBQUssQ0FBQyxHQUFJRixLQUFLO0VBQ3BFLElBQU1uRixDQUFDLEdBQUswRixDQUFDLElBQUtWLEdBQUcsQ0FBQ2pELEdBQUcsR0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDMkQsQ0FBQyxHQUFHSCxLQUFLLEtBQUtDLEtBQUssR0FBR0QsS0FBSyxDQUFDLElBQUlILEtBQUs7RUFDeEUsSUFBTU8sS0FBSyxHQUFJLE9BQU9DLElBQUksS0FBSyxVQUFVLEdBQUlBLElBQUksR0FBSSxDQUFDSCxDQUFDLEVBQUVJLEVBQUUsS0FBSyxDQUFFO0VBRWxFLElBQU1DLE9BQU8sR0FBSUMsR0FBRyxJQUFLQSxHQUFHLENBQUN6RyxHQUFHLENBQUN5RCxDQUFDLE9BQUE5QixNQUFBLENBQU8sQ0FBQ25CLENBQUMsQ0FBQ2lELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFFLENBQUMsRUFBRWlELE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBQS9FLE1BQUEsQ0FBSSxDQUFDakIsQ0FBQyxDQUFDK0MsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUUsQ0FBQyxFQUFFaUQsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFFLENBQUMsQ0FBQ0MsSUFBSSxDQUFDLEdBQUcsQ0FBQzs7RUFFeEc7RUFDQSxJQUFNQyxJQUFJLEdBQUcsRUFBRTtFQUFFLEtBQUssSUFBSVQsQ0FBQyxHQUFDLEVBQUUsRUFBRUEsQ0FBQyxJQUFFLEVBQUUsRUFBRUEsQ0FBQyxJQUFFLEdBQUcsRUFBRVMsSUFBSSxDQUFDQyxJQUFJLENBQUMsQ0FBQ1YsQ0FBQyxFQUFFRSxLQUFLLENBQUNGLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0VBQzNFLElBQU1XLEtBQUssR0FBRSxFQUFFO0VBQUUsS0FBSyxJQUFJWCxFQUFDLEdBQUMsRUFBRSxFQUFFQSxFQUFDLElBQUUsRUFBRSxFQUFFQSxFQUFDLElBQUUsR0FBRyxFQUFFVyxLQUFLLENBQUNELElBQUksQ0FBQyxDQUFDVixFQUFDLEVBQUVFLEtBQUssQ0FBQ0YsRUFBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7RUFDN0UsSUFBTVksUUFBUSxHQUFHLEVBQUU7RUFBRSxLQUFLLElBQUlaLEdBQUMsR0FBQyxFQUFFLEVBQUVBLEdBQUMsSUFBRSxFQUFFLEVBQUVBLEdBQUMsSUFBRSxHQUFHLEVBQUVZLFFBQVEsQ0FBQ0YsSUFBSSxDQUFDLENBQUNWLEdBQUMsRUFBRUUsS0FBSyxDQUFDRixHQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUNuRixJQUFNYSxPQUFPLEdBQUksRUFBRTtFQUFFLEtBQUssSUFBSWIsR0FBQyxHQUFDLEVBQUUsRUFBRUEsR0FBQyxJQUFFLEVBQUUsRUFBRUEsR0FBQyxJQUFFLEdBQUcsRUFBRWEsT0FBTyxDQUFDSCxJQUFJLENBQUMsQ0FBQ1YsR0FBQyxFQUFFRSxLQUFLLENBQUNGLEdBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0VBQ2xGLElBQU1jLEVBQUUsR0FBSyxDQUFDLEdBQUdMLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRVAsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFQSxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBR1csT0FBTyxDQUFDO0VBRTVFLElBQU1FLFFBQVEsR0FBRyxFQUFFO0VBQUUsS0FBSyxJQUFJQyxFQUFFLEdBQUMsRUFBRSxFQUFFQSxFQUFFLElBQUUsRUFBRSxFQUFFQSxFQUFFLElBQUUsR0FBRyxFQUFFRCxRQUFRLENBQUNMLElBQUksQ0FBQyxDQUFDTSxFQUFFLEVBQUVkLEtBQUssQ0FBQ2MsRUFBRSxFQUFFOUgsR0FBRyxDQUFDM0MsSUFBSSxDQUFDLENBQUMsQ0FBQztFQUM5RixJQUFNMEssUUFBUSxHQUFHLEVBQUU7RUFBRSxLQUFLLElBQUlELEdBQUUsR0FBQyxFQUFFLEVBQUVBLEdBQUUsSUFBRSxFQUFFLEVBQUVBLEdBQUUsSUFBRSxHQUFHLEVBQUVDLFFBQVEsQ0FBQ1AsSUFBSSxDQUFDLENBQUNNLEdBQUUsRUFBRWQsS0FBSyxDQUFDYyxHQUFFLEVBQUU5SCxHQUFHLENBQUM1QyxJQUFJLENBQUMsQ0FBQyxDQUFDO0VBQzlGLElBQU00SyxLQUFLLEdBQUcsQ0FBQyxHQUFHSCxRQUFRLEVBQUUsR0FBR0UsUUFBUSxDQUFDO0VBRXhDLElBQU1FLEVBQUUsR0FBSyxDQUFDLEdBQUdSLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRSxJQUFJLEdBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxHQUFDLElBQUksQ0FBQyxFQUFFLEdBQUdDLFFBQVEsQ0FBQztFQUNyRSxJQUFNUSxJQUFJLEdBQUcsQ0FBQyxHQUFHWCxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFUCxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFQSxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7RUFDN0YsSUFBTW1CLEdBQUcsR0FBSSxDQUFDLEdBQUdaLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUVQLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUVBLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUM3RixJQUFNb0IsSUFBSSxHQUFHLENBQUMsR0FBR2IsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRVAsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFQSxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQ2hFLENBQUMsRUFBRSxFQUFFQSxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUVBLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUUzRSxJQUFNcUIsVUFB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