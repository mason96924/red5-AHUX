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
  }, /*#__PURE__*/React.createElement("polygon", {
    points: STEPS.map((_, i) => {
      var a = (-90 + i * 72) * Math.PI / 180;
      return 50 + 40 * Math.cos(a) + ',' + (50 + 40 * Math.sin(a));
    }).join(' '),
    fill: "none",
    stroke: "rgba(148,163,184,0.10)",
    strokeWidth: "0.18",
    strokeDasharray: "0.8 0.8"
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
      border: "6px solid ".concat(ringColor),
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBfd2Fsay5jb21waWxlZC5qcyIsIm5hbWVzIjpbIl9SZWFjdCIsIlJlYWN0IiwidXNlU3RhdGUiLCJ1c2VNZW1vIiwiU1RFUFMiLCJrZXkiLCJsYWJlbCIsInN1YiIsImtpbmQiLCJpY29uQ29sb3IiLCJhY2NlbnQiLCJocmVmIiwiQXBwIiwiX3VzZVN0YXRlIiwicHN5IiwibG9jYXRpb24iLCJsYW5ndWFnZSIsInBsdWdpbnMiLCJyZXBhaXIiLCJfdXNlU3RhdGUyIiwiX3NsaWNlZFRvQXJyYXkiLCJkb25lIiwic2V0RG9uZSIsIl91c2VTdGF0ZTMiLCJfdXNlU3RhdGU0Iiwicm91dGUiLCJzZXRSb3V0ZSIsIl91c2VTdGF0ZTUiLCJfdXNlU3RhdGU2IiwibW9kYWwiLCJzZXRNb2RhbCIsIl91c2VTdGF0ZTciLCJnaXZvbmkiLCJyaFByZXNldCIsInJoTG8iLCJyaEhpIiwidExvIiwidEhpIiwidGhlbWUiLCJkYXJrTGV2ZWwiLCJfdXNlU3RhdGU4IiwicHN5Q2ZnIiwic2V0UHN5Q2ZnIiwiX3VzZVN0YXRlOSIsInNpdGVOYW1lIiwiY2l0eSIsImxhdCIsImxvbiIsIl91c2VTdGF0ZTAiLCJsb2NDZmciLCJzZXRMb2NDZmciLCJfdXNlU3RhdGUxIiwidiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJhbGxvd2VkIiwiaW5kZXhPZiIsImxhbmciLCJlIiwiX3VzZVN0YXRlMTAiLCJsYW5nQ2ZnIiwic2V0TGFuZ0NmZyIsIl91c2VTdGF0ZTExIiwiZW5hYmxlZCIsIl91c2VTdGF0ZTEyIiwicGx1Z2luQ2ZnIiwic2V0UGx1Z2luQ2ZnIiwiY29tcGxldGVDb3VudCIsIk9iamVjdCIsInZhbHVlcyIsImZpbHRlciIsIkJvb2xlYW4iLCJsZW5ndGgiLCJmaW5pc2giLCJkIiwiX29iamVjdFNwcmVhZCIsImNyZWF0ZUVsZW1lbnQiLCJQc3lDaGFydFNldHRpbmdQYWdlIiwiY2ZnIiwic2V0Q2ZnIiwib25CYWNrIiwib25TYXZlIiwiY2xhc3NOYW1lIiwib25DbGljayIsInNldEl0ZW0iLCJzdHlsZSIsIndpZHRoIiwiYXNwZWN0UmF0aW8iLCJhbmltYXRpb25EZWxheSIsIm1hcCIsInMiLCJpIiwiYW5nbGVEZWciLCJhbmdsZSIsIk1hdGgiLCJQSSIsInIiLCJ4IiwiY29zIiwieSIsInNpbiIsIkNpcmNsZVRpbGUiLCJzdGVwIiwiaW5kZXgiLCJsZWZ0UGN0IiwidG9wUGN0Iiwid2luZG93Iiwib3BlbiIsInZpZXdCb3giLCJwcmVzZXJ2ZUFzcGVjdFJhdGlvIiwicG9pbnRzIiwiXyIsImEiLCJqb2luIiwiZmlsbCIsInN0cm9rZSIsInN0cm9rZVdpZHRoIiwic3Ryb2tlRGFzaGFycmF5IiwiY29uY2F0IiwiTG9jYXRpb25Nb2RhbCIsIm9uQ2xvc2UiLCJMYW5ndWFnZU1vZGFsIiwiUGx1Z2luc01vZGFsIiwiVGlsZSIsIl9yZWYiLCJiYWNrZ3JvdW5kIiwiYm9yZGVyIiwiVGlsZUljb24iLCJjb2xvciIsIl9yZWYyIiwicmluZ0NvbG9yIiwibGVmdCIsInRvcCIsInRyYW5zZm9ybSIsImJveFNoYWRvdyIsIl9yZWYzIiwic3Ryb2tlTGluZWNhcCIsInN0cm9rZUxpbmVqb2luIiwiX2V4dGVuZHMiLCJoZWlnaHQiLCJjeCIsImN5IiwiX3JlZjQiLCJ1cGRhdGUiLCJrIiwiYyIsInVzZUVmZmVjdCIsInJhdyIsInByZXNldCIsInBhdGNoIiwicCIsIkpTT04iLCJwYXJzZSIsIk51bWJlciIsImlzRmluaXRlIiwibG8iLCJoaSIsIlJIX1BSRVNFVFMiLCJmaW5kIiwiaWQiLCJ0aCIsImRsIiwicGFyc2VGbG9hdCIsInRyUmF3IiwidHIiLCJtaW4iLCJtYXgiLCJrZXlzIiwicGVyc2lzdEFuZFNhdmUiLCJzdHJpbmdpZnkiLCJTdHJpbmciLCJkaXNwYXRjaEV2ZW50IiwiQ3VzdG9tRXZlbnQiLCJkZXRhaWwiLCJjb25zb2xlIiwiaW5mbyIsIndhcm4iLCJQc3lTa2VsZXRvbiIsIlBzeUNvbnRyb2xQYW5lbCIsIm5vdGUiLCJfcmVmNSIsIlciLCJIIiwicGFkIiwicmlnaHQiLCJib3R0b20iLCJncmlkVyIsImdyaWRIIiwiVF9NSU4iLCJUX01BWCIsIldfTUlOIiwiV19NQVgiLCJ0IiwidyIsIl9nZXRXIiwiZ2V0VyIsInJoIiwic2FmZVB0cyIsImFyciIsInRvRml4ZWQiLCJyaDgwIiwicHVzaCIsInJoMTAwIiwicmgyMExpbmUiLCJyaDIwX0NaIiwiQ1oiLCJyaEhpX3RvcCIsInR0IiwicmhMb19ib3QiLCJTV0VFVCIsIk5WIiwiTWFzcyIsIk1DViIsIkVWQVAiLCJ3aW50ZXJSSDgwIiwid2ludGVyUkgyMCIsIldJTlRFUiIsImlzb3BsZXRocyIsImlzTGlnaHQiLCJwYWxldHRlIiwiYmciLCJncmlkIiwidGljayIsImF4aXMiLCJwYW5lbEJnIiwicGFuZWxCb3JkZXIiLCJwaWxsQmciLCJwaWxsRmciLCJtZXRhRmciLCJkaW1GaWx0ZXIiLCJib3JkZXJDb2xvciIsImJvcmRlclJhZGl1cyIsIkFycmF5IiwiZnJvbSIsIngxIiwieTEiLCJ4MiIsInkyIiwiZm9udFNpemUiLCJ0ZXh0QW5jaG9yIiwicHRzIiwid3ciLCJmbG9vciIsImZvbnRXZWlnaHQiLCJvcGFjaXR5IiwiZmlsbE9wYWNpdHkiLCJjbGlwUGF0aFVuaXRzIiwiY2xpcFBhdGgiLCJsZXR0ZXJTcGFjaW5nIiwicGFpbnRPcmRlciIsIl9yZWY2Iiwicm91bmQiLCJ0eXBlIiwidmFsdWUiLCJvbkNoYW5nZSIsInRhcmdldCIsImFjY2VudENvbG9yIiwiX25vcm1hbGl6ZUxvY3MiLCJzZWVuIiwiU2V0Iiwib3V0IiwibCIsIm5hbWUiLCJ0cmltIiwiaGFzIiwiYWRkIiwiX3JlZjciLCJtYXBCb3hSZWYiLCJ1c2VSZWYiLCJtYXBSZWYiLCJtYXJrZXJSZWYiLCJfUmVhY3QkdXNlU3RhdGUiLCJfUmVhY3QkdXNlU3RhdGUyIiwiZ2VvQnVzeSIsInNldEdlb0J1c3kiLCJfUmVhY3QkdXNlU3RhdGUzIiwiaXNBcnJheSIsIl9SZWFjdCR1c2VTdGF0ZTQiLCJzYXZlZExvY3MiLCJzZXRTYXZlZExvY3MiLCJjYW5jZWxsZWQiLCJfYXN5bmNUb0dlbmVyYXRvciIsImZldGNoIiwiY3JlZGVudGlhbHMiLCJjYWNoZSIsIm9rIiwiaiIsImpzb24iLCJzYXZlZCIsIl9SZWFjdCR1c2VTdGF0ZTUiLCJfUmVhY3QkdXNlU3RhdGU2Iiwic2F2ZWRPcGVuIiwic2V0U2F2ZWRPcGVuIiwic2F2ZWRSZWYiLCJvbkRvY0NsaWNrIiwiY3VycmVudCIsImNvbnRhaW5zIiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm9uU2l0ZU5hbWVDaGFuZ2UiLCJuZXdOYW1lIiwiaGl0Iiwic2V0VmlldyIsInBpY2tTYXZlZExvYyIsImxvYyIsIl9SZWFjdCR1c2VTdGF0ZTciLCJfUmVhY3QkdXNlU3RhdGU4Iiwic2VhcmNoUSIsInNldFNlYXJjaFEiLCJfUmVhY3QkdXNlU3RhdGU5IiwiX1JlYWN0JHVzZVN0YXRlMCIsInNlYXJjaEhpdHMiLCJzZXRTZWFyY2hIaXRzIiwiX1JlYWN0JHVzZVN0YXRlMSIsIl9SZWFjdCR1c2VTdGF0ZTEwIiwic2VhcmNoQnVzeSIsInNldFNlYXJjaEJ1c3kiLCJfUmVhY3QkdXNlU3RhdGUxMSIsIl9SZWFjdCR1c2VTdGF0ZTEyIiwic2VhcmNoT3BlbiIsInNldFNlYXJjaE9wZW4iLCJzZWFyY2hEZWJvdW5jZVJlZiIsInJ1blNlYXJjaCIsIl9yZWY5IiwicSIsInVybCIsImVuY29kZVVSSUNvbXBvbmVudCIsImhlYWRlcnMiLCJfeCIsImFwcGx5IiwiYXJndW1lbnRzIiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsInBpY2tTZWFyY2hIaXQiLCJkaXNwbGF5X25hbWUiLCJyZXZlcnNlR2VvY29kZSIsIl9yZWYwIiwiYWRkcmVzcyIsInRvd24iLCJ2aWxsYWdlIiwiaGFtbGV0IiwiY291bnR5IiwicmVnaW9uIiwic3RhdGUiLCJjb3VudHJ5IiwiX3gyIiwiX3gzIiwiTCIsInpvb21Db250cm9sIiwiYXR0cmlidXRpb25Db250cm9sIiwidGlsZUxheWVyIiwibWF4Wm9vbSIsImF0dHJpYnV0aW9uIiwiYWRkVG8iLCJtYXJrZXIiLCJkcmFnZ2FibGUiLCJiaW5kVG9vbHRpcCIsInBlcm1hbmVudCIsImFwcGx5TGF0TG9uIiwibiIsIm9uIiwibGwiLCJnZXRMYXRMbmciLCJsbmciLCJzZXRMYXRMbmciLCJsYXRsbmciLCJpbnZhbGlkYXRlU2l6ZSIsInJlbW92ZSIsInBhblRvIiwiX1JlYWN0JHVzZVN0YXRlMTMiLCJfUmVhY3QkdXNlU3RhdGUxNCIsImdlb1N0YXRlIiwic2V0R2VvU3RhdGUiLCJ1c2VNeUxvY2F0aW9uIiwibmF2aWdhdG9yIiwiZ2VvbG9jYXRpb24iLCJlcnIiLCJnZXRDdXJyZW50UG9zaXRpb24iLCJwb3MiLCJjb29yZHMiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsIm1zZyIsImNvZGUiLCJtZXNzYWdlIiwiZW5hYmxlSGlnaEFjY3VyYWN5IiwidGltZW91dCIsIm1heGltdW1BZ2UiLCJfUmVhY3QkdXNlU3RhdGUxNSIsIl9SZWFjdCR1c2VTdGF0ZTE2Iiwic2F2ZU1zZyIsInNldFNhdmVNc2ciLCJfcmVmMSIsImRlZHVwZWQiLCJuZXh0U2F2ZWQiLCJzbGljZSIsInBlcnNpc3RlZCIsIndhcm5pbmciLCJtZXRob2QiLCJib2R5IiwiYWN0aXZlIiwiZGVmYXVsdCIsIl9sYXN0V2VhdGhlckxvY2F0aW9uU2F2ZSIsIk1vZGFsU2hlbGwiLCJ0aXRsZSIsInN1YnRpdGxlIiwic2l6ZSIsIm1pbkhlaWdodCIsInJlZiIsIm92ZXJmbG93Iiwib25Gb2N1cyIsInBsYWNlaG9sZGVyIiwib3V0bGluZSIsImgiLCJwbGFjZV9pZCIsImNsYXNzIiwidHJhbnNpdGlvbiIsImlzQWN0aXZlIiwiZGlzYWJsZWQiLCJwcm90b2NvbCIsInoiLCJfcmVmMTAiLCJsYW5ncyIsIm5hdGl2ZSIsIkV2ZW50IiwiUExVR0lOX0NPTkZJR19GSUVMRFMiLCJ3ZWF0aGVyIiwib3B0aW9ucyIsImRlZiIsInN3ZWV0X3Nwb3QiLCJnMzYiLCJkaWJ0IiwibGlnaHRpbmciLCJfcmVmMTEiLCJBTEwiLCJkZXNjIiwidmVyIiwidG9nZ2xlIiwiaW5jbHVkZXMiLCJfUmVhY3QkdXNlU3RhdGUxNyIsIl9SZWFjdCR1c2VTdGF0ZTE4IiwiZXhwYW5kZWRJZCIsInNldEV4cGFuZGVkSWQiLCJ1cGRhdGVGaWVsZCIsInBsdWdpbklkIiwiZmllbGRLZXkiLCJmaWVsZHMiLCJmaWVsZFZhbCIsImZpZWxkIiwic3RvcmVkIiwidW5kZWZpbmVkIiwiZXhwYW5kZWQiLCJmIiwibyIsIm5leHQiLCJfcmVmMTIiLCJfcmVmMTIkYWNjZW50IiwiX3JlZjEyJHNpemUiLCJjaGlsZHJlbiIsImNvbG9yTWFwIiwiaW5kaWdvIiwiYW1iZXIiLCJlbWVyYWxkIiwicGluayIsInNpemVNYXAiLCJ3aWRlIiwic3RvcFByb3BhZ2F0aW9uIiwibWF4SGVpZ2h0IiwiUmVhY3RET00iLCJjcmVhdGVSb290IiwiZ2V0RWxlbWVudEJ5SWQiLCJyZW5kZXIiXSwic291cmNlcyI6WyIuLi9zcmMvc2V0dXAtd2Fsay9zZXR1cF93YWxrLmpzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB7IHVzZVN0YXRlLCB1c2VNZW1vIH0gPSBSZWFjdDtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogU1RFUCBERUZJTklUSU9OUyDigJQgdGhlIDQgd2FsayBwYXRocyB0aGUgdXNlciBkZXNjcmliZWRcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmNvbnN0IFNURVBTID0gW1xuICAgIC8qIFdhbGsgb3JkZXIgaXMgdGhlIHBlbnRhZ29uIHRyYXZlcnNhbDogdG9wIOKGkiB1cHBlci1yaWdodCDihpIgbG93ZXItcmlnaHQg4oaSIGxvd2VyLWxlZnQg4oaSIHVwcGVyLWxlZnQgKi9cbiAgICB7IGtleToncHN5JywgICAgICBsYWJlbDonUHN5IENoYXJ0IFNldHRpbmcnLCAgICBzdWI6J0dpdm9uaSDCtyBSSCByYW5nZSDCtyBheGlzJywgIGtpbmQ6J3BhZ2UnLCAgaWNvbkNvbG9yOicjODE4Y2Y4JywgYWNjZW50OidpbmRpZ28nIH0sXG4gICAgeyBrZXk6J2xvY2F0aW9uJywgbGFiZWw6J0xvY2F0aW9uIFNldHRpbmcnLCAgICAgc3ViOidDaXR5IMK3IGxhdCAvIGxvbmcnLCAgICAgICAgIGtpbmQ6J21vZGFsJywgaWNvbkNvbG9yOicjZmJiZjI0JywgYWNjZW50OidhbWJlcicgIH0sXG4gICAgeyBrZXk6J2xhbmd1YWdlJywgbGFiZWw6J0xhbmd1YWdlIFNldHRpbmcnLCAgICAgc3ViOidFTiDCtyBDUyDCtyBDVCDCtyBKUCDCtyBLTyDCtyDigKYnLCBraW5kOidtb2RhbCcsIGljb25Db2xvcjonIzM0ZDM5OScsIGFjY2VudDonZW1lcmFsZCd9LFxuICAgIHsga2V5OidwbHVnaW5zJywgIGxhYmVsOidQbHVnLWluIFNldHRpbmcnLCAgICAgIHN1YjonTGlzdCDCtyB1cGxvYWQgwrcgbW9kaWZ5JywgICAga2luZDonbW9kYWwnLCBpY29uQ29sb3I6JyNmNDcyYjYnLCBhY2NlbnQ6J3BpbmsnICAgfSxcbiAgICAvKiA1dGggdmVydGV4OiBVcGRhdGUgLyBSZXBhaXIgLS0ganVtcHMgdG8gL3VwZGF0ZS5odG1sIChSZXBhaXIgTW9kZSkgd2hpY2ggZXhpc3RzIG9uXG4gICAgICAgYm90aCBWMS45IGFuZCBWMi4wLiAgT3BlbnMgaW4gYSBuZXcgdGFiIHNvIHRoZSBvcGVyYXRvciBjYW4gZmxhc2ggYSBwbHVnaW4gb3IgYXBwbHlcbiAgICAgICBhbiBPVEEgd2l0aG91dCBsb3NpbmcgdGhlaXIgU2V0dXAgV2FsayBwcm9ncmVzcy4gKi9cbiAgICB7IGtleToncmVwYWlyJywgICBsYWJlbDonVXBkYXRlICYgUmVwYWlyJywgICAgICBzdWI6J1BsdWctaW4gZmxhc2ggwrcgY29udHJvbGxlciBPVEEnLCBraW5kOidsaW5rJywgaWNvbkNvbG9yOicjZmI3MTg1JywgYWNjZW50Oidyb3NlJywgaHJlZjonL3VwZGF0ZS5odG1sJyB9LFxuXTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogUk9PVCBBUFBcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIEFwcCgpIHtcbiAgICAvKiBjb21wbGV0aW9uICsgcGVyLXN0ZXAgY29uZmlnIC0tIG1vY2t1cCBzdGF0ZSwgbmV2ZXIgcGVyc2lzdGVkICovXG4gICAgY29uc3QgW2RvbmUsIHNldERvbmVdID0gdXNlU3RhdGUoeyBwc3k6ZmFsc2UsIGxvY2F0aW9uOmZhbHNlLCBsYW5ndWFnZTpmYWxzZSwgcGx1Z2luczpmYWxzZSwgcmVwYWlyOmZhbHNlIH0pO1xuICAgIGNvbnN0IFtyb3V0ZSwgc2V0Um91dGVdID0gdXNlU3RhdGUoJ2h1YicpOyAgIC8vICdodWInIHwgJ3BzeSdcbiAgICBjb25zdCBbbW9kYWwsIHNldE1vZGFsXSA9IHVzZVN0YXRlKG51bGwpOyAgICAgLy8gJ2xvY2F0aW9uJyB8ICdsYW5ndWFnZScgfCAncGx1Z2lucycgfCBudWxsXG5cbiAgICBjb25zdCBbcHN5Q2ZnLCBzZXRQc3lDZmddICAgICAgICAgPSB1c2VTdGF0ZSh7IGdpdm9uaTp0cnVlLCByaFByZXNldDonb2ZmaWNlJywgcmhMbzozMCwgcmhIaTo2MCwgdExvOi0xNSwgdEhpOjUwLCB0aGVtZTonZGFyaycsIGRhcmtMZXZlbDoyLjAgfSk7XG4gICAgY29uc3QgW2xvY0NmZywgc2V0TG9jQ2ZnXSAgICAgICAgID0gdXNlU3RhdGUoeyBzaXRlTmFtZTonTXkgQnVpbGRpbmcnLCBjaXR5OidUb3JvbnRvLCBPTicsIGxhdDo0My42NTMyLCBsb246LTc5LjM4MzIgfSk7XG4gICAgY29uc3QgW2xhbmdDZmcsIHNldExhbmdDZmddICAgICAgID0gdXNlU3RhdGUoKCkgPT4ge1xuICAgICAgICAvKiBMYXp5IGluaXQgZnJvbSB0aGUgc2FtZSBsb2NhbFN0b3JhZ2Uga2V5IHRoZSBkYXNoYm9hcmQgcmVhZHMsIHNvXG4gICAgICAgICAqIHJlb3BlbmluZyB0aGUgc2V0dXAgd2FsayBzaG93cyB0aGUgY3VycmVudGx5LWFjdGl2ZSBsYW5ndWFnZVxuICAgICAgICAgKiByYXRoZXIgdGhhbiBhbHdheXMgZGVmYXVsdGluZyB0byBFbmdsaXNoLiAqL1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgdiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdpMThuX2xhbmcnKTtcbiAgICAgICAgICAgIGNvbnN0IGFsbG93ZWQgPSBbJ2VuJywnemgtQ04nLCd6aC1UVycsJ2phJywna28nXTtcbiAgICAgICAgICAgIGlmICh2ICYmIGFsbG93ZWQuaW5kZXhPZih2KSAhPT0gLTEpIHJldHVybiB7IGxhbmc6IHYgfTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBwcml2YXRlIG1vZGUgLT4gZmFsbCB0aHJvdWdoICovIH1cbiAgICAgICAgcmV0dXJuIHsgbGFuZzonZW4nIH07XG4gICAgfSk7XG4gICAgY29uc3QgW3BsdWdpbkNmZywgc2V0UGx1Z2luQ2ZnXSAgID0gdXNlU3RhdGUoeyBlbmFibGVkOlsnd2VhdGhlcicsJ2dpdm9uaScsJ3N3ZWV0X3Nwb3QnXSB9KTtcblxuICAgIGNvbnN0IGNvbXBsZXRlQ291bnQgPSBPYmplY3QudmFsdWVzKGRvbmUpLmZpbHRlcihCb29sZWFuKS5sZW5ndGg7XG5cbiAgICBjb25zdCBmaW5pc2ggPSAoa2V5KSA9PiB7XG4gICAgICAgIHNldERvbmUoZCA9PiAoey4uLmQsIFtrZXldOnRydWV9KSk7XG4gICAgICAgIHNldFJvdXRlKCdodWInKTtcbiAgICAgICAgc2V0TW9kYWwobnVsbCk7XG4gICAgfTtcblxuICAgIC8qIGZ1bGwtcGFnZSBQc3kgQ2hhcnQgZWRpdG9yICovXG4gICAgaWYgKHJvdXRlID09PSAncHN5Jykge1xuICAgICAgICByZXR1cm4gPFBzeUNoYXJ0U2V0dGluZ1BhZ2UgY2ZnPXtwc3lDZmd9IHNldENmZz17c2V0UHN5Q2ZnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25CYWNrPXsoKSA9PiBzZXRSb3V0ZSgnaHViJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNhdmU9eygpID0+IGZpbmlzaCgncHN5Jyl9IC8+O1xuICAgIH1cblxuICAgIC8qIGRlZmF1bHQ6IEhVQiBzY3JlZW4gKi9cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1pbi1oLXNjcmVlbiBweC02IHB5LThcIj5cbiAgICAgICAgICAgIHsvKiAtLS0tLS0tLS0tLS0tIGhlYWRlciAtLS0tLS0tLS0tLS0tICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXgtdy01eGwgbXgtYXV0byBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gbWItMTAgZmFkZS11cFwiPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJ0ZXh0LTJ4bCBzbTp0ZXh0LTN4bCBmb250LWJsYWNrIGl0YWxpYyB1cHBlcmNhc2UgdHJhY2tpbmctdGlnaHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtcmVkLTUwMFwiPlJlZDU8L3NwYW4+IDxzcGFuIGNsYXNzTmFtZT1cInRleHQtd2hpdGVcIj5TdHVkaW88L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCBmb250LW5vcm1hbCBpdGFsaWNcIj4gJm5ic3A7LyZuYnNwOyBzZXR1cCB3YWxrPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2gxPlxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCB0ZXh0LXhzIG10LTEgZm9udC1tb25vIHRyYWNraW5nLXdpZGVcIj5Db25maWd1cmUgb25jZS4gU2tpcCBhbnkgc3RlcCB5b3UgZG9uJ3QgbmVlZC48L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtNFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJwaWxsIGJnLXNsYXRlLTgwMCB0ZXh0LXNsYXRlLTQwMFwiPntjb21wbGV0ZUNvdW50fS81IERPTkU8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIvZGFzaGJvYXJkLmh0bWxcIlxuICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7IHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1LnNldHVwLmRvbmUnLCcxJyk7IH0gY2F0Y2goZSl7fSB9fVxuICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtc2xhdGUtNTAwIGhvdmVyOnRleHQtc2xhdGUtMzAwIHVuZGVybGluZSB1bmRlcmxpbmUtb2Zmc2V0LTRcIj5Ta2lwIGFsbCDihpI8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIC0tLS0tLS0tLS0tLS0gcGVudGFnb24gbGF5b3V0IC0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICA1IGNpcmN1bGFyIHRpbGVzIGFycmFuZ2VkIGF0IHRoZSBjb3JuZXJzIG9mIGEgcmVndWxhclxuICAgICAgICAgICAgICAgIHBlbnRhZ29uLiAgUG9sYXIgbWF0aHM6IGFuZ2xlIHN0YXJ0cyBhdCAtOTBkZWcgKHRvcCkgYW5kXG4gICAgICAgICAgICAgICAgc3RlcHMgYnkgKzcyZGVnIGNsb2Nrd2lzZS4gIFRoZSBjb250YWluZXIgaXMgaGVpZ2h0LWxvY2tlZFxuICAgICAgICAgICAgICAgIHZpYSBhc3BlY3QgcmF0aW8gc28gdGhlIHBlbnRhZ29uIHN0YXlzIGNpcmN1bGFyIG9uIGV2ZXJ5XG4gICAgICAgICAgICAgICAgdmlld3BvcnQuICBSYWRpdXMgaXMgNDAgJSBvZiB0aGUgY29udGFpbmVyIGhhbGYtc2lkZSwgY2lyY2xlXG4gICAgICAgICAgICAgICAgZGlhbWV0ZXIgfjI3ICUgb2YgdGhlIGNvbnRhaW5lciB3aWR0aCAtLSBnaXZlcyBhIGNsZWFybHlcbiAgICAgICAgICAgICAgICB2aXNpYmxlIGdhcCAofjI4ICUgb2YgY29udGFpbmVyIHdpZHRoKSBiZXR3ZWVuIGFkamFjZW50XG4gICAgICAgICAgICAgICAgY2lyY2xlcyByZWdhcmRsZXNzIG9mIHNjcmVlbiBzaXplLiAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgbXgtYXV0byBmYWRlLXVwXCJcbiAgICAgICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6J21pbig3NjBweCwgOTJ2dyknLCBhc3BlY3RSYXRpbzonMSAvIDEnLCBhbmltYXRpb25EZWxheTonLjA4cycgfX0+XG4gICAgICAgICAgICAgICAge1NURVBTLm1hcCgocywgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmdsZURlZyA9IC05MCArIGkgKiA3MjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5nbGUgPSBhbmdsZURlZyAqIE1hdGguUEkgLyAxODA7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHIgPSA0MDsgICAgICAgICAgICAgICAgICAgICAgICAvLyAlIG9mIGNvbnRhaW5lciBoYWxmLXNpZGVcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeCA9IDUwICsgciAqIE1hdGguY29zKGFuZ2xlKTsgIC8vICVcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeSA9IDUwICsgciAqIE1hdGguc2luKGFuZ2xlKTsgIC8vICVcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDaXJjbGVUaWxlIGtleT17cy5rZXl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGVwPXtzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZT17ZG9uZVtzLmtleV19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleD17aSsxfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdFBjdD17eH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcFBjdD17eX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocy5raW5kID09PSAncGFnZScpICAgICAgc2V0Um91dGUocy5rZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHMua2luZCA9PT0gJ2xpbmsnKSB3aW5kb3cub3BlbihzLmhyZWYsICdfYmxhbmsnLCAnbm9vcGVuZXInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlICAgICAgICAgICAgICAgICAgICAgICAgc2V0TW9kYWwocy5rZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICB7LyogT3B0aW9uYWwgZmFpbnQgcGVudGFnb24tZWRnZSBjb25uZWN0b3IgKHB1cmVseSBkZWNvcmF0aXZlKSAqL31cbiAgICAgICAgICAgICAgICA8c3ZnIGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgdy1mdWxsIGgtZnVsbCBwb2ludGVyLWV2ZW50cy1ub25lXCJcbiAgICAgICAgICAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMTAwIDEwMFwiIHByZXNlcnZlQXNwZWN0UmF0aW89XCJub25lXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludHM9e1NURVBTLm1hcCgoXywgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGEgPSAoLTkwICsgaSAqIDcyKSAqIE1hdGguUEkgLyAxODA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICg1MCArIDQwKk1hdGguY29zKGEpKSArICcsJyArICg1MCArIDQwKk1hdGguc2luKGEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLmpvaW4oJyAnKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cInJnYmEoMTQ4LDE2MywxODQsMC4xMClcIlxuICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg9XCIwLjE4XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZURhc2hhcnJheT1cIjAuOCAwLjhcIiAvPlxuICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiAtLS0tLS0tLS0tLS0tIGZvb3RlciBDVEEgLS0tLS0tLS0tLS0tLSAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctNXhsIG14LWF1dG8gbXQtMTAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIGZhZGUtdXBcIiBzdHlsZT17e2FuaW1hdGlvbkRlbGF5OicuMThzJ319PlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNTAwIHRleHQteHMgZm9udC1tb25vXCI+XG4gICAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZUNvdW50ID09PSAwICYmICfihpEgUGljayBhIHNldHRpbmcgdG8gc3RhcnQsIG9yIHNraXAgYWxsIGFuZCBnbyBzdHJhaWdodCB0byB0aGUgZGFzaGJvYXJkLid9XG4gICAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZUNvdW50ID4gMCAmJiBjb21wbGV0ZUNvdW50IDwgNSAmJiBg4oaRICR7NSAtIGNvbXBsZXRlQ291bnR9IHN0ZXAkezUgLSBjb21wbGV0ZUNvdW50ID09PSAxID8gJycgOiAncyd9IHJlbWFpbmluZyAob3B0aW9uYWwpLmB9XG4gICAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZUNvdW50ID09PSA1ICYmICfinJMgQWxsIHN0ZXBzIGNvbmZpZ3VyZWQuICBSZWFkeSB3aGVuIHlvdSBhcmUuJ31cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cIi9kYXNoYm9hcmQuaHRtbFwiXG4gICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4geyB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS5zZXR1cC5kb25lJywnMScpOyB9IGNhdGNoKGUpe30gfX1cbiAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweC03IHB5LTMgcm91bmRlZC14bCB0ZXh0LXNtIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjb21wbGV0ZUNvdW50ID09PSA1XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctZW1lcmFsZC02MDAgaG92ZXI6YmctZW1lcmFsZC01MDAgdGV4dC13aGl0ZSBzaGFkb3ctbGcgc2hhZG93LWVtZXJhbGQtNTAwLzMwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLWluZGlnby02MDAgaG92ZXI6YmctaW5kaWdvLTUwMCB0ZXh0LXdoaXRlIHNoYWRvdy1sZyBzaGFkb3ctaW5kaWdvLTUwMC8yMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgIE9wZW4gRGFzaGJvYXJkIOKGklxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogLS0tLS0tLS0tLS0tLSBtb2RhbHMgLS0tLS0tLS0tLS0tLSAqL31cbiAgICAgICAgICAgIHttb2RhbCA9PT0gJ2xvY2F0aW9uJyAmJiA8TG9jYXRpb25Nb2RhbCBjZmc9e2xvY0NmZ30gc2V0Q2ZnPXtzZXRMb2NDZmd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRNb2RhbChudWxsKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2F2ZT17KCkgPT4gZmluaXNoKCdsb2NhdGlvbicpfSAvPn1cbiAgICAgICAgICAgIHttb2RhbCA9PT0gJ2xhbmd1YWdlJyAmJiA8TGFuZ3VhZ2VNb2RhbCBjZmc9e2xhbmdDZmd9IHNldENmZz17c2V0TGFuZ0NmZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldE1vZGFsKG51bGwpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXsoKSA9PiBmaW5pc2goJ2xhbmd1YWdlJyl9IC8+fVxuICAgICAgICAgICAge21vZGFsID09PSAncGx1Z2lucycgICYmIDxQbHVnaW5zTW9kYWwgIGNmZz17cGx1Z2luQ2ZnfSBzZXRDZmc9e3NldFBsdWdpbkNmZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldE1vZGFsKG51bGwpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXsoKSA9PiBmaW5pc2goJ3BsdWdpbnMnKX0gLz59XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFRpbGUgKGxhcmdlIGVhc3ktb24tZXllcyBidXR0b24pIC0tIGtlcHQgZm9yIGJhY2stY29tcGF0LCBubyBsb25nZXIgdXNlZFxuICogYnkgdGhlIHBlbnRhZ29uIGh1Yi5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIFRpbGUoeyBzdGVwLCBkb25lLCBpbmRleCwgb25DbGljayB9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgc2V0dXAtdGlsZS0ke3N0ZXAua2V5fWB9XG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17YE9wZW4gJHtzdGVwLmxhYmVsfWB9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdGlsZS1idG4gcmVsYXRpdmUgdGV4dC1sZWZ0IGJnLXNsYXRlLTkwMC83MCBib3JkZXItMiBib3JkZXItc2xhdGUtNzAwLzcwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91bmRlZC0yeGwgcC02IHNtOnAtNyAke2RvbmUgPyAnZG9uZScgOiAnJ31gfT5cbiAgICAgICAgICAgIHtkb25lICYmIDxzcGFuIGNsYXNzTmFtZT1cImNoZWNrXCIgZGF0YS10ZXN0aWQ9e2BzZXR1cC10aWxlLSR7c3RlcC5rZXl9LWRvbmVgfT7inJM8L3NwYW4+fVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtNCBtYi0zXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTEyIGgtMTIgcm91bmRlZC14bCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiXG4gICAgICAgICAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6YCR7c3RlcC5pY29uQ29sb3J9MjJgLCBib3JkZXI6YDFweCBzb2xpZCAke3N0ZXAuaWNvbkNvbG9yfTU1YH19PlxuICAgICAgICAgICAgICAgICAgICA8VGlsZUljb24ga2luZD17c3RlcC5rZXl9IGNvbG9yPXtzdGVwLmljb25Db2xvcn0gLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtM3hsIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS03MDBcIj4we2luZGV4fTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1sZyBzbTp0ZXh0LXhsIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVyIG1iLTFcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7Y29sb3I6c3RlcC5pY29uQ29sb3J9fT57c3RlcC5sYWJlbH08L2gzPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS00MDAgdGV4dC1zbSBsZWFkaW5nLXNudWdcIj57c3RlcC5zdWJ9PC9wPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC00IGZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicGlsbCBiZy1zbGF0ZS04MDAgdGV4dC1zbGF0ZS00MDBcIj57c3RlcC5raW5kID09PSAncGFnZScgPyAnRnVsbCBwYWdlJyA6ICdQb3B1cCd9PC9zcGFuPlxuICAgICAgICAgICAgICAgIHtkb25lICYmIDxzcGFuIGNsYXNzTmFtZT1cInBpbGwgYmctZW1lcmFsZC05MDAvNDAgdGV4dC1lbWVyYWxkLTQwMFwiPkNvbmZpZ3VyZWQ8L3NwYW4+fVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENpcmNsZVRpbGUgLS0gcGVudGFnb24tY29ybmVyIHJvdW5kIGJ1dHRvbi4gIFNpemVkIGluICUgb2YgaXRzIGNvbnRhaW5lclxuICogc28gdGhlIHdob2xlIGxheW91dCBzY2FsZXMgd2l0aCB2aWV3cG9ydC4gIEVhY2ggY2lyY2xlIGlzIGFuY2hvcmVkIGJ5IGl0c1xuICogY2VudHJlICh0cmFuc2xhdGUgLTUwJS8tNTAlKSBvbiB0aGUgcG9sYXItY29tcHV0ZWQgKGxlZnQlLCB0b3AlKS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIENpcmNsZVRpbGUoeyBzdGVwLCBkb25lLCBpbmRleCwgbGVmdFBjdCwgdG9wUGN0LCBvbkNsaWNrIH0pIHtcbiAgICAvKiBUaGljayBjb2xvdXJlZCByaW5nIHBlciB0aWxlIC0tIGVhY2ggc3RlcCBrZWVwcyBpdHMgYWNjZW50IGNvbG91clxuICAgICAqIChpbmRpZ28vYW1iZXIvZW1lcmFsZC9waW5rL3Jvc2UpLCByZWluZm9yY2luZyB0aGUgY29sb3VyLWNvZGVkIFNWR1xuICAgICAqIGljb24gYW5kIHRoZSBoZWFkaW5nIHRleHQuICovXG4gICAgY29uc3QgcmluZ0NvbG9yID0gc3RlcC5pY29uQ29sb3I7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgc2V0dXAtdGlsZS0ke3N0ZXAua2V5fWB9XG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17YE9wZW4gJHtzdGVwLmxhYmVsfWB9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgY2lyY2xlLXRpbGUgZ3JvdXAgYWJzb2x1dGUgcm91bmRlZC1mdWxsIHRleHQtY2VudGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi0yMDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2RvbmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctc2xhdGUtOTAwLzgwIHNoYWRvdy1bMF8wXzMwcHhfLTZweF9yZ2JhKDE2LDE4NSwxMjksMC41NSldJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1zbGF0ZS05MDAvNzAgaG92ZXI6Ymctc2xhdGUtODAwLzkwJ31gfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6YCR7bGVmdFBjdH0lYCwgdG9wOmAke3RvcFBjdH0lYCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6J21pbigzNSUsIDI2MHB4KScsIGFzcGVjdFJhdGlvOicxLzEnLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06J3RyYW5zbGF0ZSgtNTAlLCAtNTAlKScsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlcjpgNnB4IHNvbGlkICR7cmluZ0NvbG9yfWAsXG4gICAgICAgICAgICAgICAgICAgIGJveFNoYWRvdzpgMCAwIDAgMXB4ICR7cmluZ0NvbG9yfTMzLCAwIDhweCAyOHB4IC04cHggJHtyaW5nQ29sb3J9NTVgLFxuICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAge2RvbmUgJiYgKFxuICAgICAgICAgICAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPXtgc2V0dXAtdGlsZS0ke3N0ZXAua2V5fS1kb25lYH1cbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSAtdG9wLTEgLXJpZ2h0LTEgdy02IGgtNiByb3VuZGVkLWZ1bGwgYmctZW1lcmFsZC01MDAgdGV4dC13aGl0ZSB0ZXh0LXhzIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGZvbnQtYm9sZCBzaGFkb3dcIj5cbiAgICAgICAgICAgICAgICAgICAg4pyTXG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm91bmRlZC14bCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBtYi0xXCJcbiAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6JzM0JScsIGFzcGVjdFJhdGlvOicxLzEnLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOmAke3N0ZXAuaWNvbkNvbG9yfTIyYCxcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyOmAxcHggc29saWQgJHtzdGVwLmljb25Db2xvcn01NWAsXG4gICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgIDxUaWxlSWNvbiBraW5kPXtzdGVwLmtleX0gY29sb3I9e3N0ZXAuaWNvbkNvbG9yfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS02MDAgdHJhY2tpbmctd2lkZXJcIj4we2luZGV4fTwvZGl2PlxuICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtWzExcHhdIHNtOnRleHQtWzEycHhdIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVyIHB4LTIgbGVhZGluZy10aWdodCBtdC0wLjVcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7Y29sb3I6c3RlcC5pY29uQ29sb3J9fT5cbiAgICAgICAgICAgICAgICB7c3RlcC5sYWJlbH1cbiAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCB0ZXh0LVs5cHhdIHNtOnRleHQtWzEwcHhdIGxlYWRpbmctc251ZyBweC0yIG10LTAuNSBsaW5lLWNsYW1wLTJcIj5cbiAgICAgICAgICAgICAgICB7c3RlcC5zdWJ9XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICk7XG59XG5cbmZ1bmN0aW9uIFRpbGVJY29uKHsga2luZCwgY29sb3IgfSkge1xuICAgIC8qIHNpbXBsZSBpbmxpbmUgU1ZHcyBzbyB3ZSBrZWVwIHRoZSBmaWxlIHNlbGYtY29udGFpbmVkICovXG4gICAgY29uc3Qgc3Ryb2tlID0geyBzdHJva2U6Y29sb3IsIGZpbGw6J25vbmUnLCBzdHJva2VXaWR0aDoyLCBzdHJva2VMaW5lY2FwOidyb3VuZCcsIHN0cm9rZUxpbmVqb2luOidyb3VuZCcgfTtcbiAgICBpZiAoa2luZCA9PT0gJ3BzeScpICAgICAgcmV0dXJuIDxzdmcgd2lkdGg9XCIyMlwiIGhlaWdodD1cIjIyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHsuLi5zdHJva2V9PjxwYXRoIGQ9XCJNMyAzdjE4aDE4XCIvPjxwYXRoIGQ9XCJNMyAxN2M0LTEgNy02IDktOXM1LTMgOS0yXCIvPjwvc3ZnPjtcbiAgICBpZiAoa2luZCA9PT0gJ2xvY2F0aW9uJykgcmV0dXJuIDxzdmcgd2lkdGg9XCIyMlwiIGhlaWdodD1cIjIyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHsuLi5zdHJva2V9PjxwYXRoIGQ9XCJNMTIgMjJzLTctNi40LTctMTJhNyA3IDAgMSAxIDE0IDBjMCA1LjYtNyAxMi03IDEyelwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEwXCIgcj1cIjIuNVwiLz48L3N2Zz47XG4gICAgaWYgKGtpbmQgPT09ICdsYW5ndWFnZScpIHJldHVybiA8c3ZnIHdpZHRoPVwiMjJcIiBoZWlnaHQ9XCIyMlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB7Li4uc3Ryb2tlfT48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjlcIi8+PHBhdGggZD1cIk0zIDEyaDE4TTEyIDNhMTQgMTQgMCAwIDEgMCAxOE0xMiAzYTE0IDE0IDAgMCAwIDAgMThcIi8+PC9zdmc+O1xuICAgIGlmIChraW5kID09PSAncGx1Z2lucycpICByZXR1cm4gPHN2ZyB3aWR0aD1cIjIyXCIgaGVpZ2h0PVwiMjJcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgey4uLnN0cm9rZX0+PHBhdGggZD1cIk05IDN2Nk0xNSAzdjZcIi8+PHBhdGggZD1cIk01IDloMTR2NmE0IDQgMCAwIDEtNCA0aC0xdjNNOSAxOXYzXCIvPjwvc3ZnPjtcbiAgICAvKiBVcGRhdGUgJiBSZXBhaXIgLS0gd3JlbmNoICsgdGlueSBnZWFyIGJ1bXAsIHNpZ25hbGxpbmcgXCJ0b29sc1wiICovXG4gICAgaWYgKGtpbmQgPT09ICdyZXBhaXInKSAgIHJldHVybiA8c3ZnIHdpZHRoPVwiMjJcIiBoZWlnaHQ9XCIyMlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB7Li4uc3Ryb2tlfT48cGF0aCBkPVwiTTE0LjcgNi4zYTQgNCAwIDAgMC01LjQgNS40TDMgMThsMyAzIDYuMy02LjNhNCA0IDAgMCAwIDUuNC01LjRsLTIuOCAyLjhMMTMgMTFsLTEuMS0xLjkgMi44LTIuOHpcIi8+PC9zdmc+O1xuICAgIHJldHVybiBudWxsO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBQc3kgQ2hhcnQgU2V0dGluZyAtLSBGVUxMIFBBR0UsIGxpdmUgc2tlbGV0b24gcmVzcG9uZHMgdG8gY29udHJvbHNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIFBzeUNoYXJ0U2V0dGluZ1BhZ2UoeyBjZmcsIHNldENmZywgb25CYWNrLCBvblNhdmUgfSkge1xuICAgIGNvbnN0IHVwZGF0ZSA9IChrLCB2KSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIFtrXTp2fSkpO1xuXG4gICAgLyogT24gbW91bnQ6IGh5ZHJhdGUgZnJvbSB0aGUgU0FNRSBsb2NhbFN0b3JhZ2Uga2V5IHRoZSBkYXNoYm9hcmQgcmVhZHNcbiAgICAgKiAoYHJlZDVfc3dlZXRfc3BvdF9yYW5nZWApIHBsdXMgdGhlIHByZXNldCBpZCAoYHJlZDVfcmhfcHJlc2V0YCkgc29cbiAgICAgKiB0aGUgZHJvcGRvd24gbGFiZWwgc3RheXMgY29uc2lzdGVudCB3aXRoIHRoZSBzbGlkZXIgdmFsdWVzIGFjcm9zc1xuICAgICAqIHJlbG9hZHMuICBJZiB0aGUgb3BlcmF0b3IgaGFzIGFscmVhZHkgdHVuZWQgdGhlIFJIIGJhbmQgb24gdGhlXG4gICAgICogZGFzaGJvYXJkLCB0aGUgc2V0dXAgd2FsayBzdGFydHMgZnJvbSB0aG9zZSB2YWx1ZXMuICovXG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJhdyAgICA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWQ1X3N3ZWV0X3Nwb3RfcmFuZ2UnKTtcbiAgICAgICAgICAgIGNvbnN0IHByZXNldCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWQ1X3JoX3ByZXNldCcpO1xuICAgICAgICAgICAgY29uc3QgcGF0Y2ggID0ge307XG4gICAgICAgICAgICBpZiAocmF3KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcCA9IEpTT04ucGFyc2UocmF3KTtcbiAgICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHAubG8pICYmIE51bWJlci5pc0Zpbml0ZShwLmhpKSAmJiBwLmxvIDwgcC5oaSkge1xuICAgICAgICAgICAgICAgICAgICBwYXRjaC5yaExvID0gcC5sbztcbiAgICAgICAgICAgICAgICAgICAgcGF0Y2gucmhIaSA9IHAuaGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByZXNldCAmJiBSSF9QUkVTRVRTLmZpbmQoeCA9PiB4LmlkID09PSBwcmVzZXQpKSB7XG4gICAgICAgICAgICAgICAgcGF0Y2gucmhQcmVzZXQgPSBwcmVzZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBUaGVtZSArIGJyaWdodG5lc3Mg4oCUIHNhbWUga2V5cyBhcHAuanMgKGRhc2hib2FyZCkgcmVhZHMuICovXG4gICAgICAgICAgICBjb25zdCB0aCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWQ1LnRoZW1lJyk7XG4gICAgICAgICAgICBpZiAodGggPT09ICdsaWdodCcgfHwgdGggPT09ICdkYXJrJykgcGF0Y2gudGhlbWUgPSB0aDtcbiAgICAgICAgICAgIGNvbnN0IGRsID0gcGFyc2VGbG9hdChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVkNS5kYXJrTGV2ZWwnKSk7XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGRsKSAmJiBkbCA+PSAxLjUgJiYgZGwgPD0gMy4wKSBwYXRjaC5kYXJrTGV2ZWwgPSBkbDtcbiAgICAgICAgICAgIC8qIFRlbXBlcmF0dXJlIGF4aXMgcmFuZ2Ug4oCUIHdyaXR0ZW4gYnkgdGhpcyBzYW1lIHBhZ2UncyBzYXZlXG4gICAgICAgICAgICAgKiBoYW5kbGVyOyBsb2FkIGl0IGhlcmUgc28gcmVvcGVuaW5nIHRoZSBzZXR1cCB3YWxrIHNob3dzIHRoZVxuICAgICAgICAgICAgICogY3VycmVudCBkYXNoYm9hcmQgYXhpcyBpbnN0ZWFkIG9mIGFsd2F5cyBkZWZhdWx0aW5nIHRvIC0xNS4uNTAuICovXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRyUmF3ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlZDVfdGVtcF9yYW5nZScpO1xuICAgICAgICAgICAgICAgIGlmICh0clJhdykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ciA9IEpTT04ucGFyc2UodHJSYXcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHRyLm1pbikgJiYgTnVtYmVyLmlzRmluaXRlKHRyLm1heCkgJiYgdHIubWluIDwgdHIubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRjaC50TG8gPSB0ci5taW47XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRjaC50SGkgPSB0ci5tYXg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7IC8qIGlnbm9yZSAqLyB9XG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMocGF0Y2gpLmxlbmd0aCkgc2V0Q2ZnKGMgPT4gKHsuLi5jLCAuLi5wYXRjaH0pKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBpZ25vcmUgKi8gfVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgICB9LCBbXSk7XG5cbiAgICAvKiBPbiBzYXZlOiBwZXJzaXN0IHRoZSBSSCBiYW5kIHRvIGxvY2FsU3RvcmFnZSBzbyB0aGUgZGFzaGJvYXJkJ3NcbiAgICAgKiBzd2VldC1zcG90IHBvbHlnb24gcGlja3MgaXQgdXAgb24gbmV4dCBsb2FkLiAgQWxzbyBwZXJzaXN0IHRoZSB2ZW51ZVxuICAgICAqIHByZXNldCBpZCAoZm9yIGZ1dHVyZSBcInNob3cgcHJlc2V0IG5hbWUgb24gZGFzaGJvYXJkXCIgZmVhdHVyZXMpLiAqL1xuICAgIGNvbnN0IHBlcnNpc3RBbmRTYXZlID0gKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDVfc3dlZXRfc3BvdF9yYW5nZScsXG4gICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoeyBsbzogY2ZnLnJoTG8sIGhpOiBjZmcucmhIaSB9KSk7XG4gICAgICAgICAgICBpZiAoY2ZnLnJoUHJlc2V0KSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDVfcmhfcHJlc2V0JywgY2ZnLnJoUHJlc2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIFRoZW1lICsgYnJpZ2h0bmVzcyDigJQgd3JpdHRlbiB0byB0aGUgU0FNRSBrZXlzIHRoZSBkYXNoYm9hcmRcbiAgICAgICAgICAgICAqIChhcHAuanMgbGluZXMgNTctNTggYW5kIDg0LTk3KSByZWFkcyBhcyBpdHMgdXNlU3RhdGUgbGF6eVxuICAgICAgICAgICAgICogaW5pdGlhbGlzZXIsIHNvIHRoZSBjaG9zZW4gdGhlbWUgdGFrZXMgZWZmZWN0IG9uIG5leHQgZGFzaGJvYXJkXG4gICAgICAgICAgICAgKiBsb2FkLiAgYXBwLmpzIHRyZWF0cyBkYXJrTGV2ZWwgPj0gMy4wIGFzIGxpZ2h0LW1vZGUgdHJpZ2dlci4gKi9cbiAgICAgICAgICAgIGlmIChjZmcudGhlbWUgPT09ICdsaWdodCcgfHwgY2ZnLnRoZW1lID09PSAnZGFyaycpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS50aGVtZScsIGNmZy50aGVtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGNmZy5kYXJrTGV2ZWwpKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDUuZGFya0xldmVsJywgU3RyaW5nKGNmZy5kYXJrTGV2ZWwpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIFRlbXBlcmF0dXJlIGF4aXMgcmFuZ2Ug4oCUIGRyaXZlcyB0aGUgZGFzaGJvYXJkJ3MgcHN5IGNoYXJ0XG4gICAgICAgICAgICAgKiBYIGF4aXMgKGB0ZW1wUmFuZ2UubWluL21heGAgaW4gYXBwLmpzKS4gIFdlIHdyaXRlIHRoZSBzYW1lXG4gICAgICAgICAgICAgKiBzaGFwZSBhcHAuanMgcmVhZHMgKGB7bWluLCBtYXh9YCkgc28gaXRzIGxhenkgdXNlU3RhdGUgaW5pdFxuICAgICAgICAgICAgICogcGlja3MgaXQgdXAgb24gbmV4dCBsb2FkLCBBTkQgZGlzcGF0Y2ggYSBjdXN0b20gZXZlbnQgc29cbiAgICAgICAgICAgICAqIGFueSBvcGVuIGRhc2hib2FyZCB0YWIgdXBkYXRlcyBsaXZlIHdpdGhvdXQgYSByZWZyZXNoLiAqL1xuICAgICAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShjZmcudExvKSAmJiBOdW1iZXIuaXNGaW5pdGUoY2ZnLnRIaSkgJiYgY2ZnLnRMbyA8IGNmZy50SGkpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNV90ZW1wX3JhbmdlJyxcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoeyBtaW46IGNmZy50TG8sIG1heDogY2ZnLnRIaSB9KSk7XG4gICAgICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdyNS10ZW1wLXJhbmdlLWNoYW5nZScsIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7IG1pbjogY2ZnLnRMbywgbWF4OiBjZmcudEhpIH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3I1LXJoLWJhbmQtY2hhbmdlJywge1xuICAgICAgICAgICAgICAgIGRldGFpbDogeyBsbzogY2ZnLnJoTG8sIGhpOiBjZmcucmhIaSB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ1tzZXR1cCB3YWxrXSBwc3kgY2hhcnQgc2F2ZWQgLT4gUkgnLCBjZmcucmhMbywgJy0nLCBjZmcucmhIaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAnJSBULWF4aXMnLCBjZmcudExvLCAnLi4nLCBjZmcudEhpLCAnwrBDIHByZXNldD0nLCBjZmcucmhQcmVzZXQpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1tzZXR1cCB3YWxrXSBjb3VsZCBub3QgcGVyc2lzdCBwc3kgc2V0dGluZ3M6JywgZSk7XG4gICAgICAgIH1cbiAgICAgICAgb25TYXZlKCk7XG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWluLWgtc2NyZWVuIGZsZXggZmxleC1jb2xcIj5cbiAgICAgICAgICAgIHsvKiBoZWFkZXIgKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBweC02IHB5LTQgYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTgwMFwiPlxuICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17b25CYWNrfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS00MDAgaG92ZXI6dGV4dC13aGl0ZSB0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFja1wiPlxuICAgICAgICAgICAgICAgICAgICDihpAgQmFjayB0byBzZXR1cFxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJ0ZXh0LXNtIHVwcGVyY2FzZSB0cmFja2luZy1bMC4zZW1dIGZvbnQtYmxhY2sgdGV4dC1pbmRpZ28tNDAwXCI+UHN5IENoYXJ0IFNldHRpbmc8L2gxPlxuICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17cGVyc2lzdEFuZFNhdmV9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC01IHB5LTIgcm91bmRlZC1sZyBiZy1pbmRpZ28tNjAwIGhvdmVyOmJnLWluZGlnby01MDAgdGV4dC13aGl0ZSB0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFja1wiPlxuICAgICAgICAgICAgICAgICAgICBTYXZlICYgcmV0dXJuIOKck1xuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBib2R5IOKAlCBjaGFydCBsZWZ0LCBjb250cm9scyByaWdodCAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xIGdyaWQgZ3JpZC1jb2xzLTEgbGc6Z3JpZC1jb2xzLVsxZnJfMzYwcHhdIGdhcC00IHAtNiBtYXgtdy03eGwgbXgtYXV0byB3LWZ1bGxcIj5cbiAgICAgICAgICAgICAgICA8UHN5U2tlbGV0b24gY2ZnPXtjZmd9IC8+XG4gICAgICAgICAgICAgICAgPFBzeUNvbnRyb2xQYW5lbCBjZmc9e2NmZ30gdXBkYXRlPXt1cGRhdGV9IHNldENmZz17c2V0Q2ZnfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbi8qIFJIIGJhbmQgcHJlc2V0cyDigJQgcmVjb2duaXNlZCBpbmR1c3RyeSBzdGFuZGFyZHMgZm9yIGVhY2ggdmVudWUgdHlwZS5cbiAqIFNvdXJjZXM6IEFTSFJBRSA1NSAoY29tZm9ydCksIEFTSFJBRSAxNzAgKGhlYWx0aGNhcmUpLFxuICogQUFNL05QUy9TbWl0aHNvbmlhbiBndWlkYW5jZSAoY29sbGVjdGlvbnMpLCBDSUJTRSBUTTQwIChsaWJyYXJpZXMpLiAqL1xuY29uc3QgUkhfUFJFU0VUUyA9IFtcbiAgICB7IGlkOidjdXN0b20nLCAgICAgICAgICBsYWJlbDonQ3VzdG9tIChtYW51YWwpJywgICAgICAgICAgICAgICAgIGxvOm51bGwsIGhpOm51bGwsIG5vdGU6JycgfSxcbiAgICB7IGlkOidvZmZpY2UnLCAgICAgICAgICBsYWJlbDonT2ZmaWNlJywgICAgICAgICAgICAgICAgICAgICAgICAgIGxvOjMwLCAgIGhpOjYwLCAgIG5vdGU6J0FTSFJBRSA1NSBjb21mb3J0JyAgICAgICAgICAgICAgICAgIH0sXG4gICAgeyBpZDonbXVzZXVtJywgICAgICAgICAgbGFiZWw6J011c2V1bScsICAgICAgICAgICAgICAgICAgICAgICAgICBsbzo0MCwgICBoaTo1NSwgICBub3RlOidBQU0gY29sbGVjdGlvbiBwcmVzZXJ2YXRpb24nICAgICAgICB9LFxuICAgIHsgaWQ6J2hvdGVsJywgICAgICAgICAgIGxhYmVsOidIb3RlbCBndWVzdCByb29tJywgICAgICAgICAgICAgICAgbG86MzAsICAgaGk6NjAsICAgbm90ZTonZ2VuZXJhbCBvY2N1cGFudCBjb21mb3J0JyAgICAgICAgICAgfSxcbiAgICB7IGlkOidsaWJyYXJ5JywgICAgICAgICBsYWJlbDonTGlicmFyeSAvIEFyY2hpdmUnLCAgICAgICAgICAgICAgIGxvOjQwLCAgIGhpOjU1LCAgIG5vdGU6J3BhcGVyICYgYmluZGluZyBwcmVzZXJ2YXRpb24nICAgICAgIH0sXG4gICAgeyBpZDonaG9zcGl0YWwnLCAgICAgICAgbGFiZWw6J0hvc3BpdGFsIChnZW5lcmFsKScsICAgICAgICAgICAgICBsbzozMCwgICBoaTo2MCwgICBub3RlOidBU0hSQUUgMTcwIHBhdGllbnQgYXJlYXMnICAgICAgICAgICB9LFxuICAgIHsgaWQ6J2xlY3R1cmUnLCAgICAgICAgIGxhYmVsOidMZWN0dXJlIGhhbGwnLCAgICAgICAgICAgICAgICAgICAgbG86MzAsICAgaGk6NjAsICAgbm90ZTonaGlnaCBvY2N1cGFuY3kgY29tZm9ydCcgICAgICAgICAgICAgfSxcbiAgICB7IGlkOidjb25jZXJ0JywgICAgICAgICBsYWJlbDonQ29uY2VydCBoYWxsJywgICAgICAgICAgICAgICAgICAgIGxvOjQwLCAgIGhpOjU1LCAgIG5vdGU6J2luc3RydW1lbnQgdHVuaW5nIHN0YWJpbGl0eScgICAgICAgIH0sXG4gICAgeyBpZDonbWVldGluZycsICAgICAgICAgbGFiZWw6J01lZXRpbmcgcm9vbScsICAgICAgICAgICAgICAgICAgICBsbzozMCwgICBoaTo2MCwgICBub3RlOidzbWFsbCBncm91cCBjb21mb3J0JyAgICAgICAgICAgICAgICB9LFxuICAgIHsgaWQ6J2V4aGliaXRpb24nLCAgICAgIGxhYmVsOidFeGhpYml0aW9uIGhhbGwnLCAgICAgICAgICAgICAgICAgbG86NDAsICAgaGk6NTUsICAgbm90ZTonbWl4ZWQgYXJ0IC8gYXJ0aWZhY3QgZGlzcGxheScgICAgICAgfSxcbl07XG5cbi8qIFJlYWwgcHN5IGNoYXJ0IOKAlCB1c2VzIHRoZSBTQU1FIGdldFcgKyBHSVZPTklfQ09MT1JTICsgcG9seWdvbiBtYXRoIGFzIHRoZVxuICogcHJvZHVjdGlvbiBkYXNoYm9hcmQuICBTb3VyY2Ugb2YgdHJ1dGg6ICBqcy9wc3ljaHJvbWV0cmljLmpzICBhbmQgdGhlXG4gKiByZW5kZXJHaXZvbmlPdmVybGF5KCkgYmxvY2sgYXQgYXBwLmpzOjE2NDEtMTcyMi5cbiAqIEFueXRoaW5nIHlvdSBjaGFuZ2UgaW4gdGhvc2UgZmlsZXMgTVVTVCBiZSBtaXJyb3JlZCBoZXJlLiAqL1xuZnVuY3Rpb24gUHN5U2tlbGV0b24oeyBjZmcgfSkge1xuICAgIC8qIENhbnZhcyArIHBhZGRpbmcgKi9cbiAgICBjb25zdCBXID0gNzYwLCBIID0gNDgwO1xuICAgIGNvbnN0IHBhZCA9IHsgbGVmdDogNTYsIHJpZ2h0OiA0MCwgdG9wOiAyOCwgYm90dG9tOiA1NiB9O1xuICAgIGNvbnN0IGdyaWRXID0gVyAtIHBhZC5sZWZ0IC0gcGFkLnJpZ2h0O1xuICAgIGNvbnN0IGdyaWRIID0gSCAtIHBhZC50b3AgIC0gcGFkLmJvdHRvbTtcblxuICAgIGNvbnN0IFRfTUlOID0gY2ZnLnRMbywgVF9NQVggPSBjZmcudEhpO1xuICAgIGNvbnN0IFdfTUlOID0gMCwgICAgICAgV19NQVggPSAwLjAzMDsgICAgICAgICAgLy8ga2cva2dcblxuICAgIC8qIGF4aXMgc2NhbGVzIC0tIG1hdGNoIHRoZSBsaXZlIGRhc2hib2FyZCAqL1xuICAgIGNvbnN0IHggID0gKHQpID0+IHBhZC5sZWZ0ICsgKCh0IC0gVF9NSU4pIC8gKFRfTUFYIC0gVF9NSU4pKSAqIGdyaWRXO1xuICAgIGNvbnN0IHkgID0gKHcpID0+IHBhZC50b3AgICsgKDEgLSAodyAtIFdfTUlOKSAvIChXX01BWCAtIFdfTUlOKSkgKiBncmlkSDtcbiAgICBjb25zdCBfZ2V0VyA9ICh0eXBlb2YgZ2V0VyA9PT0gJ2Z1bmN0aW9uJykgPyBnZXRXIDogKCh0LCByaCkgPT4gMCk7XG5cbiAgICBjb25zdCBzYWZlUHRzID0gKGFycikgPT4gYXJyLm1hcChwID0+IGAkeyh4KHBbMF0pfHwwKS50b0ZpeGVkKDIpfSwkeyh5KHBbMV0pfHwwKS50b0ZpeGVkKDIpfWApLmpvaW4oJyAnKTtcblxuICAgIC8qIC0tLS0gR2l2b25pIHBvbHlnb25zIC0tIENPUElFRCBWRVJCQVRJTSBmcm9tIGFwcC5qczoxNjQzLTE2NjkgLS0tLSAqL1xuICAgIGNvbnN0IHJoODAgPSBbXTsgZm9yIChsZXQgdD0yMDsgdDw9MjU7IHQrPTAuNSkgcmg4MC5wdXNoKFt0LCBfZ2V0Vyh0LCA4MCldKTtcbiAgICBjb25zdCByaDEwMD0gW107IGZvciAobGV0IHQ9MjA7IHQ8PTI3OyB0Kz0wLjUpIHJoMTAwLnB1c2goW3QsIF9nZXRXKHQsIDEwMCldKTtcbiAgICBjb25zdCByaDIwTGluZSA9IFtdOyBmb3IgKGxldCB0PTMyOyB0Pj0yMDsgdC09MC41KSByaDIwTGluZS5wdXNoKFt0LCBfZ2V0Vyh0LCAyMCldKTtcbiAgICBjb25zdCByaDIwX0NaICA9IFtdOyBmb3IgKGxldCB0PTI3OyB0Pj0yMDsgdC09MC41KSByaDIwX0NaLnB1c2goW3QsIF9nZXRXKHQsIDIwKV0pO1xuICAgIGNvbnN0IENaICAgPSBbLi4ucmg4MCwgWzI3LCBfZ2V0VygyNywgNTApXSwgWzI3LCBfZ2V0VygyNywgMjApXSwgLi4ucmgyMF9DWl07XG5cbiAgICBjb25zdCByaEhpX3RvcCA9IFtdOyBmb3IgKGxldCB0dD0yMDsgdHQ8PTI3OyB0dCs9MC41KSByaEhpX3RvcC5wdXNoKFt0dCwgX2dldFcodHQsIGNmZy5yaEhpKV0pO1xuICAgIGNvbnN0IHJoTG9fYm90ID0gW107IGZvciAobGV0IHR0PTI3OyB0dD49MjA7IHR0LT0wLjUpIHJoTG9fYm90LnB1c2goW3R0LCBfZ2V0Vyh0dCwgY2ZnLnJoTG8pXSk7XG4gICAgY29uc3QgU1dFRVQgPSBbLi4ucmhIaV90b3AsIC4uLnJoTG9fYm90XTtcblxuICAgIGNvbnN0IE5WICAgPSBbLi4ucmgxMDAsIFszMiwgMTUuNC8xMDAwXSwgWzMyLCA2LjIvMTAwMF0sIC4uLnJoMjBMaW5lXTtcbiAgICBjb25zdCBNYXNzID0gWy4uLnJoODAsIFszMywgMTYvMTAwMF0sIFszNywgX2dldFcoMzcsIDMwKV0sIFszNywgMy8xMDAwXSwgWzIwLCBfZ2V0VygyMCwgMjApXV07XG4gICAgY29uc3QgTUNWICA9IFsuLi5yaDgwLCBbNDAsIDE2LzEwMDBdLCBbNDQsIF9nZXRXKDQ0LCAyMCldLCBbNDQsIDMvMTAwMF0sIFsyMCwgX2dldFcoMjAsIDIwKV1dO1xuICAgIGNvbnN0IEVWQVAgPSBbLi4ucmg4MCwgWzI1LCAxNi8xMDAwXSwgWzM2LCBfZ2V0VygzNiwgMzApXSwgWzM5LCBfZ2V0VygzOSwgMjApXSxcbiAgICAgICAgICAgICAgICAgIFs0MSwgX2dldFcoNDEsIDEwKV0sIFs0MSwgMF0sIFsyNy4yLCAwXSwgWzIwLCBfZ2V0VygyMCwgMjApXV07XG5cbiAgICBjb25zdCB3aW50ZXJSSDgwID0gW107IGZvciAobGV0IHQ9MTg7IHQ8PTE5LjU7IHQrPTAuNSkgd2ludGVyUkg4MC5wdXNoKFt0LCBfZ2V0Vyh0LCA4MCldKTtcbiAgICBjb25zdCB3aW50ZXJSSDIwID0gW107IGZvciAobGV0IHQ9MTkuNTsgdD49MTg7IHQtPTAuNSkgd2ludGVyUkgyMC5wdXNoKFt0LCBfZ2V0Vyh0LCAyMCldKTtcbiAgICBjb25zdCBXSU5URVIgPSBbLi4ud2ludGVyUkg4MCwgLi4ud2ludGVyUkgyMF07XG5cbiAgICAvKiBSSCBpc29wbGV0aCBjdXJ2ZXMgZm9yIHRoZSBjaGFydCBncmlkICovXG4gICAgY29uc3QgaXNvcGxldGhzID0gWzIwLCA0MCwgNjAsIDgwLCAxMDBdO1xuXG4gICAgLyogVGhlbWUgcGFsZXR0ZSDigJQgZHJpdmVzIHRoZSBsaXZlIHByZXZpZXcgc28gdGhlIGRpbS9saWdodCBjb250cm9sc1xuICAgICAqIGhhdmUgdmlzaWJsZSBmZWVkYmFjayByaWdodCBvbiB0aGUgY2hhcnQuICBJbiBkaW0vZGFyayBtb2RlIHdlIGFsc29cbiAgICAgKiBhcHBseSBhIENTUyBicmlnaHRuZXNzIGZpbHRlciBtYXBwZWQgZnJvbSBjZmcuZGFya0xldmVsICgxLjUgLi4gMi44XG4gICAgICog4oaSIDAuNiAuLiAxLjQpIHNvIHRoZSB1c2VyIGNhbiBTRUUgdGhlIGJyaWdodG5lc3Mgc2xpZGVyIHdvcmtpbmcuICovXG4gICAgY29uc3QgaXNMaWdodCA9IGNmZy50aGVtZSA9PT0gJ2xpZ2h0JztcbiAgICBjb25zdCBwYWxldHRlID0gaXNMaWdodFxuICAgICAgICA/IHsgYmc6JyNmOGZhZmMnLCBncmlkOicjY2JkNWUxJywgdGljazonIzQ3NTU2OScsIGF4aXM6JyMxZTI5M2InLFxuICAgICAgICAgICAgcGFuZWxCZzoncmdiYSgyNDgsMjUwLDI1MiwwLjg1KScsIHBhbmVsQm9yZGVyOicjY2JkNWUxJyxcbiAgICAgICAgICAgIHBpbGxCZzonI2UyZThmMCcsIHBpbGxGZzonIzQ3NTU2OScsIG1ldGFGZzonIzY0NzQ4YicgfVxuICAgICAgICA6IHsgYmc6JyMwYjEyMjAnLCBncmlkOicjMWUyOTNiJywgdGljazonIzk0YTNiOCcsIGF4aXM6JyNjYmQ1ZTEnLFxuICAgICAgICAgICAgcGFuZWxCZzoncmdiYSgxNSwyMyw0MiwwLjYpJywgcGFuZWxCb3JkZXI6JyMxZTI5M2InLFxuICAgICAgICAgICAgcGlsbEJnOicjMWUyOTNiJywgcGlsbEZnOicjOTRhM2I4JywgbWV0YUZnOicjNjQ3NDhiJyB9O1xuICAgIGNvbnN0IGRpbUZpbHRlciA9IGlzTGlnaHRcbiAgICAgICAgPyAnbm9uZSdcbiAgICAgICAgOiBgYnJpZ2h0bmVzcygkeyhNYXRoLm1heCgxLjUsIE1hdGgubWluKDIuOCwgY2ZnLmRhcmtMZXZlbCB8fCAyLjApKSAvIDIuMCkudG9GaXhlZCgyKX0pYDtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm91bmRlZC0yeGwgcC00IGJvcmRlciB0cmFuc2l0aW9uLWNvbG9ycyBkdXJhdGlvbi0zMDBcIlxuICAgICAgICAgICAgIHN0eWxlPXt7YmFja2dyb3VuZDogcGFsZXR0ZS5wYW5lbEJnLCBib3JkZXJDb2xvcjogcGFsZXR0ZS5wYW5lbEJvcmRlcn19PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gbWItM1wiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInBpbGxcIiBzdHlsZT17e2JhY2tncm91bmQ6cGFsZXR0ZS5waWxsQmcsIGNvbG9yOnBhbGV0dGUucGlsbEZnfX0+UFNZQ0hST01FVFJJQyBDSEFSVCDCtyBsaXZlIHByZXZpZXc8L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1tb25vXCIgc3R5bGU9e3tjb2xvcjpwYWxldHRlLm1ldGFGZ319PntUX01JTn3CsEMg4oaSIHtUX01BWH3CsEMgIMK3ICB7Y2ZnLnJoTG994oCTe2NmZy5yaEhpfSUgUkg8L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxzdmcgdmlld0JveD17YDAgMCAke1d9ICR7SH1gfSBjbGFzc05hbWU9XCJ3LWZ1bGwgaC1hdXRvIHRyYW5zaXRpb24tW2ZpbHRlcl0gZHVyYXRpb24tMzAwXCJcbiAgICAgICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOiBwYWxldHRlLmJnLCBib3JkZXJSYWRpdXM6OCwgZmlsdGVyOiBkaW1GaWx0ZXJ9fT5cbiAgICAgICAgICAgICAgICB7LyogLS0tLSBncmlkOiB2ZXJ0aWNhbCBUIGxpbmVzLCBob3Jpem9udGFsIFcgbGluZXMgLS0tLSAqL31cbiAgICAgICAgICAgICAgICB7QXJyYXkuZnJvbSh7bGVuZ3RoOjExfSkubWFwKChfLGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdCA9IFRfTUlOICsgKGkvMTApICogKFRfTUFYIC0gVF9NSU4pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGcga2V5PXsndnQnK2l9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXt4KHQpfSB5MT17cGFkLnRvcH0geDI9e3godCl9IHkyPXtwYWQudG9wK2dyaWRIfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT17cGFsZXR0ZS5ncmlkfSBzdHJva2VXaWR0aD1cIjAuNlwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KHQpfSB5PXtwYWQudG9wK2dyaWRIKzE2fSBmb250U2l6ZT1cIjkuNVwiIGZpbGw9e3BhbGV0dGUudGlja31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCI+e3QudG9GaXhlZCgwKX08L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAge0FycmF5LmZyb20oe2xlbmd0aDo3fSkubWFwKChfLGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdyA9IFdfTUlOICsgKGkvNikgKiAoV19NQVggLSBXX01JTik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZyBrZXk9eydodycraX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3BhZC5sZWZ0fSB5MT17eSh3KX0geDI9e3BhZC5sZWZ0K2dyaWRXfSB5Mj17eSh3KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9e3BhbGV0dGUuZ3JpZH0gc3Ryb2tlV2lkdGg9XCIwLjZcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17cGFkLmxlZnQtOH0geT17eSh3KSszfSBmb250U2l6ZT1cIjkuNVwiIGZpbGw9e3BhbGV0dGUudGlja31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwiZW5kXCI+eyh3KjEwMDApLnRvRml4ZWQoMCl9PC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIHsvKiAtLS0tIFJIIGlzb3BsZXRocyAoY3VydmVzKSAtLS0tICovfVxuICAgICAgICAgICAgICAgIHtpc29wbGV0aHMubWFwKHJoID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHRzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHQgPSBUX01JTjsgdCA8PSBUX01BWDsgdCArPSAwLjUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHd3ID0gX2dldFcodCwgcmgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHd3ID49IFdfTUlOICYmIHd3IDw9IFdfTUFYKSBwdHMucHVzaChbdCwgd3ddKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGcga2V5PXsnaXNvJytyaH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlsaW5lIHBvaW50cz17c2FmZVB0cyhwdHMpfSBmaWxsPVwibm9uZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT17cmggPT09IDEwMCA/ICcjNjM2NmYxJyA6ICcjZWM0ODk5NTUnfSBzdHJva2VXaWR0aD1cIjAuOFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZURhc2hhcnJheT17cmggPT09IDEwMCA/ICcnIDogJzMsMyd9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cHRzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KHB0c1tNYXRoLmZsb29yKHB0cy5sZW5ndGgqMC42NSldWzBdKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeT17eShwdHNbTWF0aC5mbG9vcihwdHMubGVuZ3RoKjAuNjUpXVsxXSkgLSA0fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZT1cIjlcIiBmaWxsPVwiI2VjNDg5OTk5XCIgZm9udFdlaWdodD1cIjcwMFwiPntyaH0lPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG5cbiAgICAgICAgICAgICAgICB7LyogLS0tLSBHaXZvbmkgb3ZlcmxheSAoY29waWVkIHZlcmJhdGltIGZyb20gYXBwLmpzIHJlbmRlciBvcmRlcikgLS0tLSAqL31cbiAgICAgICAgICAgICAgICB7Y2ZnLmdpdm9uaSAmJiAoXG4gICAgICAgICAgICAgICAgICAgIDxnIGNsYXNzTmFtZT1cInBvaW50ZXItZXZlbnRzLW5vbmVcIiBvcGFjaXR5PVwiMC45XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17eCg0MCl9IHkxPXt5KDE2LzEwMDApfSB4Mj17eCg1MCl9IHkyPXt5KDE2LzEwMDApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiIzYzNjZmMVwiIHN0cm9rZVdpZHRoPVwiMS41XCIgc3Ryb2tlRGFzaGFycmF5PVwiNCw0XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3goNTApfSB5MT17eSgxNi8xMDAwKX0geDI9e3goNTApfSB5Mj17eSgwKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cIiM2MzY2ZjFcIiBzdHJva2VXaWR0aD1cIjEuNVwiIHN0cm9rZURhc2hhcnJheT1cIjQsNFwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXt4KDQxKX0geTE9e3koMCl9IHgyPXt4KDUwKX0geTI9e3koMCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCIjNjM2NmYxXCIgc3Ryb2tlV2lkdGg9XCIxLjVcIiBzdHJva2VEYXNoYXJyYXk9XCI0LDRcIi8+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhNQ1YpfSAgZmlsbD1cIiNlYzQ4OTlcIiBmaWxsT3BhY2l0eT1cIjAuMDVcIiBzdHJva2U9XCIjZWM0ODk5XCIgc3Ryb2tlV2lkdGg9XCIxXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKE1hc3MpfSBmaWxsPVwiIzhiNWNmNlwiIGZpbGxPcGFjaXR5PVwiMC4wNVwiIHN0cm9rZT1cIiM4YjVjZjZcIiBzdHJva2VXaWR0aD1cIjFcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoRVZBUCl9IGZpbGw9XCIjMDZiNmQ0XCIgZmlsbE9wYWNpdHk9XCIwLjA4XCIgc3Ryb2tlPVwiIzA2YjZkNFwiIHN0cm9rZVdpZHRoPVwiMVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhOVil9ICAgZmlsbD1cIiNmNTllMGJcIiBmaWxsT3BhY2l0eT1cIjAuMDVcIiBzdHJva2U9XCIjZjU5ZTBiXCIgc3Ryb2tlV2lkdGg9XCIxXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKENaKX0gICBmaWxsPVwiIzEwYjk4MVwiIGZpbGxPcGFjaXR5PVwiMC4xNVwiIHN0cm9rZT1cIiMxMGI5ODFcIiBzdHJva2VXaWR0aD1cIjEuMlwiLz5cblxuICAgICAgICAgICAgICAgICAgICAgICAgey8qIFN3ZWV0LXNwb3QgYmFuZCwgY2xpcHBlZCB0byBDWiAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkZWZzPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjbGlwUGF0aCBpZD1cImN6LWNsaXAtd2Fsa1wiIGNsaXBQYXRoVW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoQ1opfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9jbGlwUGF0aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGVmcz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhTV0VFVCl9IGNsaXBQYXRoPVwidXJsKCNjei1jbGlwLXdhbGspXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw9XCIjMDU5NjY5XCIgZmlsbE9wYWNpdHk9XCIwLjMyXCIgc3Ryb2tlPVwiIzA0Nzg1N1wiIHN0cm9rZVdpZHRoPVwiMC44XCIgc3Ryb2tlRGFzaGFycmF5PVwiMywyXCIvPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoV0lOVEVSKX0gZmlsbD1cIiMzYjgyZjZcIiBmaWxsT3BhY2l0eT1cIjAuMTVcIiBzdHJva2U9XCJub25lXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3goMTkpfSB5MT17cGFkLnRvcCsxOH0geDI9e3goMTkpfSB5Mj17cGFkLnRvcCtncmlkSH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cIiMzYjgyZjZcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VEYXNoYXJyYXk9XCI2LDRcIiBvcGFjaXR5PVwiMC44XCIvPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICB7LyogUmVnaW9uIGxhYmVscyDigJQgc2FtZSBjb2xvcnMgJiBzcGlyaXQgYXMgbGl2ZSBjaGFydCAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goNTApLTEwfSB5PXt5KDgvMTAwMCl9IGZpbGw9XCIjNjM2NmYxXCIgZm9udFNpemU9XCIxMFwiIGZvbnRXZWlnaHQ9XCI5MDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIHRyYW5zZm9ybT17YHJvdGF0ZSgtOTAsICR7eCg1MCktMTB9LCAke3koOC8xMDAwKX0pYH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc9XCIyXCI+TUVDSEFOSUNBTCBDT09MSU5HPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCg0NCktMn0geT17eSg4LzEwMDApfSBmaWxsPVwiI2VjNDg5OVwiIGZvbnRTaXplPVwiOVwiIGZvbnRXZWlnaHQ9XCI5MDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIHRyYW5zZm9ybT17YHJvdGF0ZSgtOTAsICR7eCg0NCktMn0sICR7eSg4LzEwMDApfSlgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZz1cIjEuNVwiPk1BU1MgQ09PTElORzwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goMzcpLTEwfSB5PXt5KDgvMTAwMCl9IGZpbGw9XCIjOGI1Y2Y2XCIgZm9udFNpemU9XCI5XCIgZm9udFdlaWdodD1cIjkwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgdHJhbnNmb3JtPXtgcm90YXRlKC05MCwgJHt4KDM3KS0xMH0sICR7eSg4LzEwMDApfSlgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZz1cIjEuNVwiPk1BU1MgQ09PTElORzwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goMzQpfSB5PXt5KDAuNS8xMDAwKS04fSBmaWxsPVwiIzA2YjZkNFwiIGZvbnRTaXplPVwiOVwiIGZvbnRXZWlnaHQ9XCI5MDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGxldHRlclNwYWNpbmc9XCIyXCI+RVZBUE9SQVRJVkU8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDIzLjUpfSB5PXt5KF9nZXRXKDIzLjUsIDQ1KSl9IGZpbGw9XCIjMTBiOTgxXCIgZm9udFNpemU9XCIxMVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0PVwiOTAwXCIgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGxldHRlclNwYWNpbmc9XCIxLjVcIj5DT01GT1JUPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCgxOC43NSl9IHk9e3koX2dldFcoMTguNzUsIDQ1KSl9IGZpbGw9XCIjM2I4MmY2XCIgZm9udFNpemU9XCIxMVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0PVwiOTAwXCIgdGV4dEFuY2hvcj1cIm1pZGRsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm09e2Byb3RhdGUoLTkwLCAke3goMTguNzUpfSwgJHt5KF9nZXRXKDE4Ljc1LCA0NSkpfSlgfT5XSU5URVI8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDIzLjUpfSB5PXt5KF9nZXRXKDIzLjUsIChjZmcucmhMbytjZmcucmhIaSkvMikpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbD1cIiMwMjJjMjJcIiBmb250U2l6ZT1cIjhcIiBmb250V2VpZ2h0PVwiOTAwXCIgdGV4dEFuY2hvcj1cIm1pZGRsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e3BhaW50T3JkZXI6J3N0cm9rZScsIHN0cm9rZTonI2E3ZjNkMCcsIHN0cm9rZVdpZHRoOicyLjVweCcsIHN0cm9rZUxpbmVqb2luOidyb3VuZCd9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZz1cIjEuNVwiPntjZmcucmhMb30te2NmZy5yaEhpfSUgUkg8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICApfVxuXG4gICAgICAgICAgICAgICAgey8qIGF4aXMgbGFiZWxzICovfVxuICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3BhZC5sZWZ0ICsgZ3JpZFcvMn0geT17SC0xMn0gZm9udFNpemU9XCIxMVwiIGZpbGw9e3BhbGV0dGUuYXhpc31cbiAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgZm9udFdlaWdodD1cIjgwMFwiIGxldHRlclNwYWNpbmc9XCIyXCI+RFJZIEJVTEIgVEVNUCAowrBDKTwvdGV4dD5cbiAgICAgICAgICAgICAgICA8dGV4dCB4PXsxNn0geT17cGFkLnRvcCArIGdyaWRILzJ9IGZvbnRTaXplPVwiMTFcIiBmaWxsPXtwYWxldHRlLmF4aXN9XG4gICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGZvbnRXZWlnaHQ9XCI4MDBcIiBsZXR0ZXJTcGFjaW5nPVwiMlwiXG4gICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtPXtgcm90YXRlKC05MCAxNiAke3BhZC50b3AgKyBncmlkSC8yfSlgfT5IVU1JRElUWSBSQVRJTyAoZy9rZyk8L3RleHQ+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuZnVuY3Rpb24gUHN5Q29udHJvbFBhbmVsKHsgY2ZnLCB1cGRhdGUsIHNldENmZyB9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1zbGF0ZS05MDAvNjAgYm9yZGVyIGJvcmRlci1zbGF0ZS04MDAgcm91bmRlZC0yeGwgcC01IHNwYWNlLXktNlwiPlxuICAgICAgICAgICAgey8qIFRoZW1lICsgYnJpZ2h0bmVzcyAgLS0gcmVsb2NhdGVkIGZyb20gdGhlIGRhc2hib2FyZCBzaWRlYmFyIDIwMjYtMDYtMjUuXG4gICAgICAgICAgICAgICAgVHdvIGNvbnRyb2xzOiBEYXJrL0xpZ2h0IG1vZGUgdG9nZ2xlLCBhbmQgQnJpZ2h0bmVzcyBzbGlkZXIgKG9ubHlcbiAgICAgICAgICAgICAgICBtZWFuaW5nZnVsIGluIGRhcmsgbW9kZSkuICBMaXZlIHByZXZpZXcgYXBwbGllcyB0byB0aGUgc3Vycm91bmRpbmdcbiAgICAgICAgICAgICAgICBjb250cm9sIHBhbmVsIHNvIHRoZSBvcGVyYXRvciBjYW4gRkVFTCB0aGUgY2hhbmdlIGJlZm9yZSBzYXZpbmcuICovfVxuICAgICAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cInBzeS1jZmctdGhlbWUtYmxvY2tcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj5EaXNwbGF5IE1vZGU8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTIgbWItM1wiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwicHN5LWNmZy10aGVtZS1kYXJrXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIHRoZW1lOidkYXJrJywgZGFya0xldmVsOk1hdGgubWluKGMuZGFya0xldmVsIHx8IDIuMCwgMi42KX0pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweS0yLjUgcm91bmRlZC1sZyB0ZXh0LXhzIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBib3JkZXIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjZmcudGhlbWUgPT09ICdkYXJrJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctc2xhdGUtODAwIGJvcmRlci15ZWxsb3ctNTAwLzcwIHRleHQteWVsbG93LTMwMCBzaGFkb3ctbGcgc2hhZG93LXllbGxvdy01MDAvMTAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1zbGF0ZS05MDAvMzAgYm9yZGVyLXNsYXRlLTcwMCB0ZXh0LXNsYXRlLTUwMCBob3ZlcjpiZy1zbGF0ZS04MDAvNjAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAg8J+MmSAgRGltIC8gRGFya1xuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cInBzeS1jZmctdGhlbWUtbGlnaHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldENmZyhjID0+ICh7Li4uYywgdGhlbWU6J2xpZ2h0JywgZGFya0xldmVsOjMuMH0pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweS0yLjUgcm91bmRlZC1sZyB0ZXh0LXhzIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBib3JkZXIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjZmcudGhlbWUgPT09ICdsaWdodCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLXNsYXRlLTEwMCBib3JkZXItc2t5LTUwMC83MCB0ZXh0LXNreS03MDAgc2hhZG93LWxnIHNoYWRvdy1za3ktNTAwLzEwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctc2xhdGUtOTAwLzMwIGJvcmRlci1zbGF0ZS03MDAgdGV4dC1zbGF0ZS01MDAgaG92ZXI6Ymctc2xhdGUtODAwLzYwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIOKYgCAgTGlnaHRcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgey8qIEJyaWdodG5lc3Mgc2xpZGVyIOKAlCBvbmx5IG1lYW5pbmdmdWwgd2hlbiB0aGVtZSA9PT0gJ2RhcmsnICovfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjZmcudGhlbWUgPT09ICdsaWdodCcgPyAnb3BhY2l0eS00MCBwb2ludGVyLWV2ZW50cy1ub25lJyA6ICcnfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gbWItMVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwXCI+RGltIGJyaWdodG5lc3M8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1tb25vIHRleHQteWVsbG93LTMwMCB0YWJ1bGFyLW51bXNcIj57TWF0aC5yb3VuZCgoY2ZnLmRhcmtMZXZlbCB8fCAyLjApICogMTAwKX0lPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cInBzeS1jZmctZGFyay1sZXZlbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBtaW49XCIxLjVcIiBtYXg9XCIyLjhcIiBzdGVwPVwiMC4wMlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Y2ZnLnRoZW1lID09PSAnbGlnaHQnID8gMi4wIDogKGNmZy5kYXJrTGV2ZWwgfHwgMi4wKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0Q2ZnKGMgPT4gKHsuLi5jLCBkYXJrTGV2ZWw6IHBhcnNlRmxvYXQoZS50YXJnZXQudmFsdWUpLCB0aGVtZTonZGFyayd9KSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyYW5nZS1pbnB1dCB3LWZ1bGxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgYWNjZW50Q29sb3I6JyNmYWNjMTUnIH19Lz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0yIGl0YWxpY1wiPlxuICAgICAgICAgICAgICAgICAgICBBcHBsaWVkIHRvIHRoZSB3aG9sZSBkYXNoYm9hcmQuICBEaW0gaXMgcmVjb21tZW5kZWQgZm9yIGNvbnRyb2wgcm9vbXM7IExpZ2h0IGZvciBkYXl0aW1lIHdhbGstdGhyb3VnaHMuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBHaXZvbmkgdG9nZ2xlICovfVxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj5HaXZvbmkgRW5naW5lPC9kaXY+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB1cGRhdGUoJ2dpdm9uaScsICFjZmcuZ2l2b25pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHctZnVsbCBweS0zIHJvdW5kZWQteGwgdGV4dC1zbSBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Y2ZnLmdpdm9uaVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLWluZGlnby02MDAgdGV4dC13aGl0ZSBzaGFkb3ctbGcgc2hhZG93LWluZGlnby01MDAvMzAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctc2xhdGUtODAwIHRleHQtc2xhdGUtNDAwIGJvcmRlciBib3JkZXItc2xhdGUtNzAwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAge2NmZy5naXZvbmkgPyAnR2l2b25pIE9OJyA6ICdHaXZvbmkgT0ZGJ31cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0yIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgICAgICBPdmVybGF5cyB0aGUgNCBjbGltYXRlLXN0cmF0ZWd5IHJlZ2lvbnMgKENvbWZvcnQsIE5hdCBWZW50LCBFdmFwLCBNZWNoIENvb2wpLlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogUkggcmFuZ2UgKi99XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMlwiPlJIIFN3ZWV0LVNwb3QgUmFuZ2U8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwIG1iLTEgYmxvY2tcIj5WZW51ZSBwcmVzZXQ8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0IGN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Y2ZnLnJoUHJlc2V0IHx8ICdjdXN0b20nfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwID0gUkhfUFJFU0VUUy5maW5kKHAgPT4gcC5pZCA9PT0gZS50YXJnZXQudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXApIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHAuaWQgPT09ICdjdXN0b20nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGUoJ3JoUHJlc2V0JywgJ2N1c3RvbScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCByaFByZXNldDpwLmlkLCByaExvOnAubG8sIHJoSGk6cC5oaX0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAge1JIX1BSRVNFVFMubWFwKHAgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtwLmlkfSB2YWx1ZT17cC5pZH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtwLmxhYmVsfXtwLmxvICE9IG51bGwgPyBgICDCtyAgJHtwLmxvfS0ke3AuaGl9JSBSSGAgOiAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgeygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwID0gUkhfUFJFU0VUUy5maW5kKHggPT4geC5pZCA9PT0gKGNmZy5yaFByZXNldCB8fCAnY3VzdG9tJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHAgJiYgcC5ub3RlID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTEuNSBpdGFsaWNcIj57cC5ub3RlfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICkgOiBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9KSgpfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTMgbWItMlwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtbW9ubyB0ZXh0LXNsYXRlLTQwMCB3LTEwXCI+e2NmZy5yaExvfSU8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49XCIyMFwiIG1heD17Y2ZnLnJoSGktNX0gdmFsdWU9e2NmZy5yaExvfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIHJoTG86K2UudGFyZ2V0LnZhbHVlLCByaFByZXNldDonY3VzdG9tJ30pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLWlucHV0IGZsZXgtMVwiLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1tb25vIHRleHQtc2xhdGUtNDAwIHctMTBcIj57Y2ZnLnJoSGl9JTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj17Y2ZnLnJoTG8rNX0gbWF4PVwiOTBcIiB2YWx1ZT17Y2ZnLnJoSGl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldENmZyhjID0+ICh7Li4uYywgcmhIaTorZS50YXJnZXQudmFsdWUsIHJoUHJlc2V0OidjdXN0b20nfSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2UtaW5wdXQgZmxleC0xXCIvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBBeGlzIHJhbmdlICovfVxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj5UZW1wZXJhdHVyZSBBeGlzIFJhbmdlPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMyBtYi0yXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1tb25vIHRleHQtc2xhdGUtNDAwIHctMTBcIj57Y2ZnLnRMb33CsDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj1cIi00MFwiIG1heD17Y2ZnLnRIaS0xMH0gdmFsdWU9e2NmZy50TG99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZSgndExvJywgK2UudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLWlucHV0IGZsZXgtMVwiLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1tb25vIHRleHQtc2xhdGUtNDAwIHctMTBcIj57Y2ZnLnRIaX3CsDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj17Y2ZnLnRMbysxMH0gbWF4PVwiNjBcIiB2YWx1ZT17Y2ZnLnRIaX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlKCd0SGknLCArZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2UtaW5wdXQgZmxleC0xXCIvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTIgbGVhZGluZy1yZWxheGVkXCI+XG4gICAgICAgICAgICAgICAgICAgIENoYXJ0IHdpbGwgYmUgcmVkcmF3biB3aXRoIHRoaXMgZHJ5LWJ1bGIgdGVtcGVyYXR1cmUgd2luZG93LlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvcmRlci10IGJvcmRlci1zbGF0ZS04MDAgcHQtNFwiPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgICAgICBDaGFuZ2VzIHByZXZpZXcgbGl2ZSBpbiB0aGUgc2tlbGV0b24gY2hhcnQgb24gdGhlIGxlZnQuICBIaXRcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1pbmRpZ28tNDAwIGZvbnQtYmxhY2tcIj4gU2F2ZSAmIHJldHVybiA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIGluIHRoZSBoZWFkZXIgd2hlbiB5b3UncmUgaGFwcHkuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIExvY2F0aW9uIFNldHRpbmcgLS0gbW9kYWwgdy8gaW50ZXJhY3RpdmUgTGVhZmxldCBtYXAgKyByZXZlcnNlIGdlb2NvZGluZ1xuICogQ2xpY2sgYW55d2hlcmUgb24gdGhlIG1hcCAob3IgZHJhZyB0aGUgbWFya2VyKSB0byBzZXQgbGF0L2xvbi5cbiAqIE1hbnVhbCBsYXQvbG9uIGVkaXRzIHJlLWNlbnRyZSB0aGUgbWFya2VyLiAgQ2l0eSBuYW1lIGlzIGF1dG8tcG9wdWxhdGVkXG4gKiB2aWEgT3BlblN0cmVldE1hcCBOb21pbmF0aW0gKG5vIGtleSByZXF1aXJlZCwgcmF0ZS1saW1pdGVkIHRvIH4xIHJlcS9zKS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyogRGUtZHVwICsgc2FuaXR5LWNoZWNrIGEgcmF3IHNhdmVkLWxvY2F0aW9ucyBhcnJheSAoZnJvbSBzZXJ2ZXIgb3JcbiAqIGxvY2FsU3RvcmFnZSkuICBEcm9wcyBlbnRyaWVzIG1pc3NpbmcgYSBuYW1lIG9yIHdpdGggbm9uLWZpbml0ZSBsYXQvbG9uLFxuICoga2VlcHMgdGhlIEZJUlNUIG9jY3VycmVuY2Ugb2YgZWFjaCB1bmlxdWUgbmFtZS4gIFVzZWQgYnkgTG9jYXRpb25Nb2RhbCdzXG4gKiBTaXRlLW5hbWUgZGF0YWxpc3QgYmVsb3cuICovXG5mdW5jdGlvbiBfbm9ybWFsaXplTG9jcyhhcnIpIHtcbiAgICBjb25zdCBzZWVuID0gbmV3IFNldCgpO1xuICAgIGNvbnN0IG91dCA9IFtdO1xuICAgIGZvciAoY29uc3QgbCBvZiAoYXJyIHx8IFtdKSkge1xuICAgICAgICBpZiAoIWwgfHwgdHlwZW9mIGwubmFtZSAhPT0gJ3N0cmluZycpIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCBsYXQgPSArbC5sYXQsIGxvbiA9ICtsLmxvbjtcbiAgICAgICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUobGF0KSB8fCAhTnVtYmVyLmlzRmluaXRlKGxvbikpIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCBrZXkgPSBsLm5hbWUudHJpbSgpO1xuICAgICAgICBpZiAoIWtleSB8fCBzZWVuLmhhcyhrZXkpKSBjb250aW51ZTtcbiAgICAgICAgc2Vlbi5hZGQoa2V5KTtcbiAgICAgICAgb3V0LnB1c2goeyBuYW1lOmtleSwgbGF0LCBsb24gfSk7XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG59XG5cbmZ1bmN0aW9uIExvY2F0aW9uTW9kYWwoeyBjZmcsIHNldENmZywgb25DbG9zZSwgb25TYXZlIH0pIHtcbiAgICBjb25zdCBtYXBCb3hSZWYgPSBSZWFjdC51c2VSZWYobnVsbCk7XG4gICAgY29uc3QgbWFwUmVmICAgID0gUmVhY3QudXNlUmVmKG51bGwpO1xuICAgIGNvbnN0IG1hcmtlclJlZiA9IFJlYWN0LnVzZVJlZihudWxsKTtcbiAgICBjb25zdCBbZ2VvQnVzeSwgc2V0R2VvQnVzeV0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG5cbiAgICAvKiAtLS0tLSBzYXZlZCBsb2NhdGlvbnMgLS0gbWlycm9yIHdoYXQgdGhlIERhc2hib2FyZCdzIFdlYXRoZXIgYnV0dG9uIHNob3dzLlxuICAgICAqXG4gICAgICogVGhlIGRhc2hib2FyZCByZWFkcyB0aGVtIGZyb20gYCR7QVBJX1VSTH0vYXBpL3dlYXRoZXItbG9jYXRpb25gJ3NcbiAgICAgKiBgc2F2ZWRgIGFycmF5IGFuZCBtaXJyb3JzIHRoYXQgaW50byBsb2NhbFN0b3JhZ2VbJ3NhdmVkV2VhdGhlckxvY2F0aW9ucyddXG4gICAgICogb24gbW91bnQgKHNlZSBwdWJsaWMvanMvZGFzaGJvYXJkL2FwcC5qcyNoeWRyYXRlV2VhdGhlclN0YXRlKS4gIFdlIGRvXG4gICAgICogdGhlIFNBTUUgdGhpbmcgaGVyZSBzbyB0aGUgU2V0dXAgV2FsaydzIFNpdGUtbmFtZSBkcm9wZG93biBzdGF5c1xuICAgICAqIGJ5dGUtaWRlbnRpY2FsIHdpdGggdGhlIGRhc2hib2FyZCdzIGxvY2F0aW9uIGxpc3QgLS0gaW5jbHVkaW5nIHdoZW4gdGhlXG4gICAgICogb3BlcmF0b3IgdmlzaXRzIFNldHVwIFdhbGsgQkVGT1JFIGV2ZXIgb3BlbmluZyB0aGUgZGFzaGJvYXJkIChmcmVzaFxuICAgICAqIGRldmljZSBjYXNlIHdoZXJlIGxvY2FsU3RvcmFnZSBpcyBlbXB0eSkuXG4gICAgICpcbiAgICAgKiBTdHJhdGVneTpcbiAgICAgKiAgIDEpIFJlYWQgbG9jYWxTdG9yYWdlIGZpcnN0IChpbnN0YW50LCBubyBmbGlja2VyIGlmIGFscmVhZHkgaHlkcmF0ZWQpLlxuICAgICAqICAgMikgVGhlbiBHRVQgL2FwaS93ZWF0aGVyLWxvY2F0aW9uIChjYW5vbmljYWwsIGNyb3NzLWRldmljZSBzb3VyY2UpLlxuICAgICAqICAgMykgV2hpY2hldmVyIGlzIG5vbi1lbXB0eSB3aW5zOyBzZXJ2ZXIgd2lucyB0aWVzLlxuICAgICAqXG4gICAgICogRnJlZS1mb3JtIHR5cGluZyBpbiB0aGUgaW5wdXQgc3RpbGwgd29ya3MgLS0gdGhlIGRhdGFsaXN0IGlzIHN1Z2dlc3Rpb25cbiAgICAgKiBvbmx5LCB0aGUgaW5wdXQgbmV2ZXIgcmVzdHJpY3RzIHRoZSB2YWx1ZS4gKi9cbiAgICBjb25zdCBbc2F2ZWRMb2NzLCBzZXRTYXZlZExvY3NdID0gUmVhY3QudXNlU3RhdGUoKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmF3ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NhdmVkV2VhdGhlckxvY2F0aW9ucycpO1xuICAgICAgICAgICAgaWYgKCFyYXcpIHJldHVybiBbXTtcbiAgICAgICAgICAgIGNvbnN0IGFyciA9IEpTT04ucGFyc2UocmF3KTtcbiAgICAgICAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KGFycikgPyBfbm9ybWFsaXplTG9jcyhhcnIpIDogW107XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgcmV0dXJuIFtdOyB9XG4gICAgfSk7XG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgbGV0IGNhbmNlbGxlZCA9IGZhbHNlO1xuICAgICAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goJy9hcGkvd2VhdGhlci1sb2NhdGlvbicsIHsgY3JlZGVudGlhbHM6J2luY2x1ZGUnLCBjYWNoZTonbm8tc3RvcmUnIH0pO1xuICAgICAgICAgICAgICAgIGlmICghci5vaykgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGNvbnN0IGogPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzYXZlZCA9IF9ub3JtYWxpemVMb2NzKEFycmF5LmlzQXJyYXkoai5zYXZlZCkgPyBqLnNhdmVkIDogW10pO1xuICAgICAgICAgICAgICAgIGlmIChjYW5jZWxsZWQpIHJldHVybjtcbiAgICAgICAgICAgICAgICBpZiAoc2F2ZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBzZXRTYXZlZExvY3Moc2F2ZWQpO1xuICAgICAgICAgICAgICAgICAgICAvLyBNaXJyb3IgdG8gbG9jYWxTdG9yYWdlIHNvIHRoZSBkYXNoYm9hcmQgc2VlcyB0aGUgc2FtZSBsaXN0XG4gICAgICAgICAgICAgICAgICAgIC8vIGV2ZW4gaWYgaXRzIG93biBoeWRyYXRlIGhhc24ndCBydW4geWV0IHRoaXMgc2Vzc2lvbi5cbiAgICAgICAgICAgICAgICAgICAgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3NhdmVkV2VhdGhlckxvY2F0aW9ucycsIEpTT04uc3RyaW5naWZ5KHNhdmVkKSk7IH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBvZmZsaW5lIC0+IGxvY2FsU3RvcmFnZSB2YWx1ZSBhbHJlYWR5IGluIHN0YXRlICovIH1cbiAgICAgICAgfSkoKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHsgY2FuY2VsbGVkID0gdHJ1ZTsgfTtcbiAgICB9LCBbXSk7XG5cbiAgICAvKiAtLS0tLSBzYXZlZC1sb2NhdGlvbnMgZHJvcGRvd24gb3Blbi9jbG9zZSBzdGF0ZS5cbiAgICAgKiBOYXRpdmUgPGRhdGFsaXN0PiBoaWRlcyBpdHMgY2hldnJvbiBpbiBtb3N0IGJyb3dzZXJzIChlc3BlY2lhbGx5IGluXG4gICAgICogYSBkYXJrIHRoZW1lKSwgd2hpY2ggbWFkZSB0aGUgXCJkcm9wIGRvd25cIiBpbnZpc2libGUgdG8gb3BlcmF0b3JzXG4gICAgICogd2hvIGNsZWFybHkgaGFkIG11bHRpcGxlIHNhdmVkIGxvY2F0aW9ucy4gIFJlcGxhY2VkIHdpdGggYSBjdXN0b21cbiAgICAgKiBwb3Bkb3duIHBhbmVsIHRoYXQgaGFzIGFuIEFMV0FZUy1WSVNJQkxFIGNoZXZyb24gYnV0dG9uIC0tIGNsaWNrIGl0XG4gICAgICogdG8gdG9nZ2xlLCBjbGljayBvdXRzaWRlIHRvIGRpc21pc3MuICovXG4gICAgY29uc3QgW3NhdmVkT3Blbiwgc2V0U2F2ZWRPcGVuXSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBzYXZlZFJlZiA9IFJlYWN0LnVzZVJlZihudWxsKTtcbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoIXNhdmVkT3BlbikgcmV0dXJuO1xuICAgICAgICBjb25zdCBvbkRvY0NsaWNrID0gKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChzYXZlZFJlZi5jdXJyZW50ICYmICFzYXZlZFJlZi5jdXJyZW50LmNvbnRhaW5zKGUudGFyZ2V0KSkgc2V0U2F2ZWRPcGVuKGZhbHNlKTtcbiAgICAgICAgfTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2NDbGljayk7XG4gICAgICAgIHJldHVybiAoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKTtcbiAgICB9LCBbc2F2ZWRPcGVuXSk7XG5cbiAgICAvKiBXaGVuIHRoZSB1c2VyIHBpY2tzIGEgbmFtZSBmcm9tIHRoZSBkcm9wZG93biBPUiB0eXBlcyBvbmUgdGhhdFxuICAgICAqIGV4YWN0bHkgbWF0Y2hlcyBhIHNhdmVkIGVudHJ5LCBwdWxsIGl0cyBsYXQvbG9uIGFuZCByZWNlbnRyZSB0aGVcbiAgICAgKiBtYXAuICBGcmVlLWZvcm0gdHlwaW5nIHN0aWxsIHdvcmtzIC0tIHRoZSBuYW1lIGlzIGp1c3Qga2VwdCBhcyB0aGVcbiAgICAgKiBzaXRlIGxhYmVsLiAgQXZvaWRzIHN1cnByaXNpbmcgdGhlIG9wZXJhdG9yIHdobyB0eXBlcyBcIlBhdmlsaW9uIEJcIlxuICAgICAqIChhIGxhYmVsIHRoZXkgaW52ZW50ZWQpIGFuZCBleHBlY3RzIHRoZSBtYXAgTk9UIHRvIGp1bXAuICovXG4gICAgY29uc3Qgb25TaXRlTmFtZUNoYW5nZSA9IChuZXdOYW1lKSA9PiB7XG4gICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgc2l0ZU5hbWU6bmV3TmFtZX0pKTtcbiAgICAgICAgY29uc3QgaGl0ID0gc2F2ZWRMb2NzLmZpbmQocyA9PiBzLm5hbWUgPT09IG5ld05hbWUpO1xuICAgICAgICBpZiAoaGl0KSB7XG4gICAgICAgICAgICBjb25zdCBsYXQgPSBNYXRoLnJvdW5kKGhpdC5sYXQgKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgICAgIGNvbnN0IGxvbiA9IE1hdGgucm91bmQoaGl0LmxvbiAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBzaXRlTmFtZTpuZXdOYW1lLCBsYXQsIGxvbiwgY2l0eTpuZXdOYW1lfSkpO1xuICAgICAgICAgICAgaWYgKG1hcFJlZi5jdXJyZW50KSBtYXBSZWYuY3VycmVudC5zZXRWaWV3KFtsYXQsIGxvbl0sIDExKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgcGlja1NhdmVkTG9jID0gKGxvYykgPT4ge1xuICAgICAgICBzZXRTYXZlZE9wZW4oZmFsc2UpO1xuICAgICAgICBvblNpdGVOYW1lQ2hhbmdlKGxvYy5uYW1lKTtcbiAgICB9O1xuXG4gICAgLyogLS0tLS0gc2VhcmNoIHN0YXRlIC0tLS0tICovXG4gICAgY29uc3QgW3NlYXJjaFEsIHNldFNlYXJjaFFdICAgICAgICAgPSBSZWFjdC51c2VTdGF0ZSgnJyk7XG4gICAgY29uc3QgW3NlYXJjaEhpdHMsIHNldFNlYXJjaEhpdHNdICAgPSBSZWFjdC51c2VTdGF0ZShbXSk7XG4gICAgY29uc3QgW3NlYXJjaEJ1c3ksIHNldFNlYXJjaEJ1c3ldICAgPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3QgW3NlYXJjaE9wZW4sIHNldFNlYXJjaE9wZW5dICAgPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3Qgc2VhcmNoRGVib3VuY2VSZWYgICAgICAgICAgICAgPSBSZWFjdC51c2VSZWYobnVsbCk7XG5cbiAgICAvKiBGb3J3YXJkLWdlb2NvZGU6IHF1ZXJ5IC0+IFt7bGF0LCBsb24sIGRpc3BsYXlfbmFtZSwgdHlwZSwgLi4ufV0gKi9cbiAgICBjb25zdCBydW5TZWFyY2ggPSBhc3luYyAocSkgPT4ge1xuICAgICAgICBpZiAoIXEgfHwgcS50cmltKCkubGVuZ3RoIDwgMykgeyBzZXRTZWFyY2hIaXRzKFtdKTsgcmV0dXJuOyB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzZXRTZWFyY2hCdXN5KHRydWUpO1xuICAgICAgICAgICAgY29uc3QgdXJsID0gYGh0dHBzOi8vbm9taW5hdGltLm9wZW5zdHJlZXRtYXAub3JnL3NlYXJjaD9mb3JtYXQ9anNvbiZsaW1pdD02JnE9JHtlbmNvZGVVUklDb21wb25lbnQocSl9YDtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCh1cmwsIHsgaGVhZGVyczp7ICdBY2NlcHQnOidhcHBsaWNhdGlvbi9qc29uJyB9IH0pO1xuICAgICAgICAgICAgY29uc3QgaiA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgICAgICAgc2V0U2VhcmNoSGl0cyhBcnJheS5pc0FycmF5KGopID8gaiA6IFtdKTtcbiAgICAgICAgICAgIHNldFNlYXJjaE9wZW4odHJ1ZSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgc2V0U2VhcmNoSGl0cyhbXSk7IH1cbiAgICAgICAgZmluYWxseSB7IHNldFNlYXJjaEJ1c3koZmFsc2UpOyB9XG4gICAgfTtcblxuICAgIC8qIGRlYm91bmNlZCBzZWFyY2gtb24tdHlwZSAqL1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmIChzZWFyY2hEZWJvdW5jZVJlZi5jdXJyZW50KSBjbGVhclRpbWVvdXQoc2VhcmNoRGVib3VuY2VSZWYuY3VycmVudCk7XG4gICAgICAgIHNlYXJjaERlYm91bmNlUmVmLmN1cnJlbnQgPSBzZXRUaW1lb3V0KCgpID0+IHJ1blNlYXJjaChzZWFyY2hRKSwgNDAwKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHNlYXJjaERlYm91bmNlUmVmLmN1cnJlbnQgJiYgY2xlYXJUaW1lb3V0KHNlYXJjaERlYm91bmNlUmVmLmN1cnJlbnQpO1xuICAgIH0sIFtzZWFyY2hRXSk7XG5cbiAgICBjb25zdCBwaWNrU2VhcmNoSGl0ID0gKGhpdCkgPT4ge1xuICAgICAgICBjb25zdCBsYXQgPSBNYXRoLnJvdW5kKCtoaXQubGF0ICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgIGNvbnN0IGxvbiA9IE1hdGgucm91bmQoK2hpdC5sb24gKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBsYXQsIGxvbiwgY2l0eTpoaXQuZGlzcGxheV9uYW1lfSkpO1xuICAgICAgICBpZiAobWFwUmVmLmN1cnJlbnQpIG1hcFJlZi5jdXJyZW50LnNldFZpZXcoW2xhdCwgbG9uXSwgaGl0LnR5cGUgPT09ICdjaXR5JyA/IDExIDogMTUpO1xuICAgICAgICBzZXRTZWFyY2hPcGVuKGZhbHNlKTtcbiAgICAgICAgc2V0U2VhcmNoUSgnJyk7XG4gICAgfTtcblxuICAgIC8qIFJldmVyc2UtZ2VvY29kZSBsYXQvbG9uIC0+IGNpdHkgLyBjb3VudHJ5IHZpYSBOb21pbmF0aW0uICBObyBBUEkga2V5LiAqL1xuICAgIGNvbnN0IHJldmVyc2VHZW9jb2RlID0gYXN5bmMgKGxhdCwgbG9uKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzZXRHZW9CdXN5KHRydWUpO1xuICAgICAgICAgICAgY29uc3QgdXJsID0gYGh0dHBzOi8vbm9taW5hdGltLm9wZW5zdHJlZXRtYXAub3JnL3JldmVyc2U/Zm9ybWF0PWpzb24mbGF0PSR7bGF0fSZsb249JHtsb259Jnpvb209MTBgO1xuICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwgeyBoZWFkZXJzOiB7ICdBY2NlcHQnOidhcHBsaWNhdGlvbi9qc29uJyB9IH0pO1xuICAgICAgICAgICAgY29uc3QgaiA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgICAgICAgY29uc3QgYSA9IGouYWRkcmVzcyB8fCB7fTtcbiAgICAgICAgICAgIGNvbnN0IGNpdHkgPSBhLmNpdHkgfHwgYS50b3duIHx8IGEudmlsbGFnZSB8fCBhLmhhbWxldCB8fCBhLmNvdW50eSB8fCAnJztcbiAgICAgICAgICAgIGNvbnN0IHJlZ2lvbiA9IGEuc3RhdGUgfHwgYS5yZWdpb24gfHwgJyc7XG4gICAgICAgICAgICBjb25zdCBjb3VudHJ5ID0gYS5jb3VudHJ5IHx8ICcnO1xuICAgICAgICAgICAgY29uc3QgbGFiZWwgPSBbY2l0eSwgcmVnaW9uLCBjb3VudHJ5XS5maWx0ZXIoQm9vbGVhbikuam9pbignLCAnKSB8fCBqLmRpc3BsYXlfbmFtZSB8fCAnJztcbiAgICAgICAgICAgIGlmIChsYWJlbCkgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBjaXR5OmxhYmVsfSkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IC8qIG9mZmxpbmUgb3IgcmF0ZS1saW1pdGVkIC0+IGtlZXAgcHJpb3IgbmFtZSAqLyB9XG4gICAgICAgIGZpbmFsbHkgeyBzZXRHZW9CdXN5KGZhbHNlKTsgfVxuICAgIH07XG5cbiAgICAvKiBJbml0IExlYWZsZXQgb24gZmlyc3QgcmVuZGVyIG9mIHRoZSBtb2RhbCAqL1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmICghbWFwQm94UmVmLmN1cnJlbnQgfHwgbWFwUmVmLmN1cnJlbnQpIHJldHVybjtcbiAgICAgICAgY29uc3QgbWFwID0gTC5tYXAobWFwQm94UmVmLmN1cnJlbnQsIHsgem9vbUNvbnRyb2w6IHRydWUsIGF0dHJpYnV0aW9uQ29udHJvbDogdHJ1ZSB9KVxuICAgICAgICAgICAgICAgICAgICAgLnNldFZpZXcoW2NmZy5sYXQsIGNmZy5sb25dLCA2KTtcbiAgICAgICAgTC50aWxlTGF5ZXIoJ2h0dHBzOi8ve3N9LnRpbGUub3BlbnN0cmVldG1hcC5vcmcve3p9L3t4fS97eX0ucG5nJywge1xuICAgICAgICAgICAgbWF4Wm9vbTogMTgsXG4gICAgICAgICAgICBhdHRyaWJ1dGlvbjogJyZjb3B5OyBPcGVuU3RyZWV0TWFwIGNvbnRyaWJ1dG9ycycsXG4gICAgICAgIH0pLmFkZFRvKG1hcCk7XG5cbiAgICAgICAgY29uc3QgbWFya2VyID0gTC5tYXJrZXIoW2NmZy5sYXQsIGNmZy5sb25dLCB7IGRyYWdnYWJsZTogdHJ1ZSB9KS5hZGRUbyhtYXApO1xuICAgICAgICBtYXJrZXIuYmluZFRvb2x0aXAoJ0RyYWcgbWUgb3IgY2xpY2sgYW55d2hlcmUgb24gdGhlIG1hcCcsIHsgcGVybWFuZW50OiBmYWxzZSB9KTtcblxuICAgICAgICBjb25zdCBhcHBseUxhdExvbiA9IChsYXQsIGxvbikgPT4ge1xuICAgICAgICAgICAgY29uc3QgciA9IChuKSA9PiBNYXRoLnJvdW5kKG4gKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgbGF0OnIobGF0KSwgbG9uOnIobG9uKX0pKTtcbiAgICAgICAgICAgIHJldmVyc2VHZW9jb2RlKHIobGF0KSwgcihsb24pKTtcbiAgICAgICAgfTtcbiAgICAgICAgbWFya2VyLm9uKCdkcmFnZW5kJywgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGwgPSBtYXJrZXIuZ2V0TGF0TG5nKCk7XG4gICAgICAgICAgICBhcHBseUxhdExvbihsbC5sYXQsIGxsLmxuZyk7XG4gICAgICAgIH0pO1xuICAgICAgICBtYXAub24oJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgIG1hcmtlci5zZXRMYXRMbmcoZS5sYXRsbmcpO1xuICAgICAgICAgICAgYXBwbHlMYXRMb24oZS5sYXRsbmcubGF0LCBlLmxhdGxuZy5sbmcpO1xuICAgICAgICB9KTtcblxuICAgICAgICBtYXBSZWYuY3VycmVudCA9IG1hcDtcbiAgICAgICAgbWFya2VyUmVmLmN1cnJlbnQgPSBtYXJrZXI7XG5cbiAgICAgICAgLyogTGVhZmxldCByZW5kZXJzIGJsYW5rIGlmIGl0IGJvb3RzIGluc2lkZSBhIGhpZGRlbiBlbGVtZW50IOKAlCBraWNrIGl0XG4gICAgICAgICAgIG9uY2UgdGhlIG1vZGFsIGFuaW1hdGlvbiBzZXR0bGVzLiAqL1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IG1hcC5pbnZhbGlkYXRlU2l6ZSgpLCAyNTApO1xuICAgICAgICByZXR1cm4gKCkgPT4geyBtYXAucmVtb3ZlKCk7IG1hcFJlZi5jdXJyZW50ID0gbnVsbDsgbWFya2VyUmVmLmN1cnJlbnQgPSBudWxsOyB9O1xuICAgIH0sIFtdKTtcblxuICAgIC8qIEtlZXAgbWFya2VyIGluIHN5bmMgd2hlbiB1c2VyIGVkaXRzIGxhdC9sb24gZmllbGRzIG1hbnVhbGx5ICovXG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKG1hcFJlZi5jdXJyZW50ICYmIG1hcmtlclJlZi5jdXJyZW50KSB7XG4gICAgICAgICAgICBtYXJrZXJSZWYuY3VycmVudC5zZXRMYXRMbmcoW2NmZy5sYXQsIGNmZy5sb25dKTtcbiAgICAgICAgICAgIG1hcFJlZi5jdXJyZW50LnBhblRvKFtjZmcubGF0LCBjZmcubG9uXSk7XG4gICAgICAgIH1cbiAgICB9LCBbY2ZnLmxhdCwgY2ZnLmxvbl0pO1xuXG4gICAgLyogR2VvbG9jYXRpb246IHNpbGVudGx5IG5vLW9wJ2QgYmVmb3JlIC0tIGlmIHRoZSBicm93c2VyIGJsb2NrZWQgdGhlXG4gICAgICogcmVxdWVzdCAoSFRUUCBvcmlnaW4gPSBub3QgYSBzZWN1cmUgY29udGV4dCBvbiBmaWVsZCBjb250cm9sbGVycywgb3JcbiAgICAgKiB0aGUgdXNlciBkZW5pZWQgcGVybWlzc2lvbiBlYXJsaWVyKSB0aGUgYnV0dG9uIGp1c3Qgc2F0IHRoZXJlLlxuICAgICAqIE5vdyB3ZSBzdXJmYWNlIGEgc3RhdGUgKGJ1c3kgLyBlcnIpIHNvIHRoZSBvcGVyYXRvciBjYW4gc2VlIFdIWSBpdFxuICAgICAqIGZhaWxlZCBhbmQgYWN0IG9uIGl0IChzd2l0Y2ggdG8gSFRUUFMsIHJlLXByb21wdCwgb3IgdXNlIHRoZSBtYXApLiAqL1xuICAgIGNvbnN0IFtnZW9TdGF0ZSwgc2V0R2VvU3RhdGVdID0gUmVhY3QudXNlU3RhdGUobnVsbCk7ICAgLy8gbnVsbCB8ICdidXN5JyB8IHtlcnJ9XG4gICAgY29uc3QgdXNlTXlMb2NhdGlvbiA9ICgpID0+IHtcbiAgICAgICAgc2V0R2VvU3RhdGUoJ2J1c3knKTtcbiAgICAgICAgLy8gbmF2aWdhdG9yLmdlb2xvY2F0aW9uIGlzIGB1bmRlZmluZWRgIG9uIEhUVFAgb3JpZ2lucyAoQ2hyb21lIDUwKykuXG4gICAgICAgIGlmICghbmF2aWdhdG9yLmdlb2xvY2F0aW9uKSB7XG4gICAgICAgICAgICBzZXRHZW9TdGF0ZSh7IGVycjonQnJvd3NlciBibG9ja2VkIGxvY2F0aW9uIGFjY2VzcyDigJQgb3BlbiB0aGlzIHBhZ2UgdmlhIEhUVFBTLicgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihcbiAgICAgICAgICAgIChwb3MpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBsYXQgPSBNYXRoLnJvdW5kKHBvcy5jb29yZHMubGF0aXR1ZGUgICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgICAgICAgICAgY29uc3QgbG9uID0gTWF0aC5yb3VuZChwb3MuY29vcmRzLmxvbmdpdHVkZSAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgbGF0LCBsb259KSk7XG4gICAgICAgICAgICAgICAgaWYgKG1hcFJlZi5jdXJyZW50KSBtYXBSZWYuY3VycmVudC5zZXRWaWV3KFtsYXQsIGxvbl0sIDExKTtcbiAgICAgICAgICAgICAgICByZXZlcnNlR2VvY29kZShsYXQsIGxvbik7XG4gICAgICAgICAgICAgICAgc2V0R2VvU3RhdGUobnVsbCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGVyci5jb2RlOiAxPVBFUk1JU1NJT05fREVOSUVELCAyPVBPU0lUSU9OX1VOQVZBSUxBQkxFLCAzPVRJTUVPVVRcbiAgICAgICAgICAgICAgICBjb25zdCBtc2cgPSBlcnIgJiYgZXJyLmNvZGUgPT09IDFcbiAgICAgICAgICAgICAgICAgICAgPyAnTG9jYXRpb24gcGVybWlzc2lvbiBkZW5pZWQg4oCUIGNsaWNrIHRoZSBsb2NrIGljb24gaW4gdGhlIGFkZHJlc3MgYmFyIGFuZCBhbGxvdyBsb2NhdGlvbi4nXG4gICAgICAgICAgICAgICAgICAgIDogZXJyICYmIGVyci5jb2RlID09PSAyXG4gICAgICAgICAgICAgICAgICAgICAgICA/ICdMb2NhdGlvbiBjdXJyZW50bHkgdW5hdmFpbGFibGUg4oCUIHRoZSBkZXZpY2UgaGFzIG5vIEdQUyAvIFdpLUZpIGZpeCB5ZXQuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgOiBlcnIgJiYgZXJyLmNvZGUgPT09IDNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdMb2NhdGlvbiByZXF1ZXN0IHRpbWVkIG91dCDigJQgdHJ5IGFnYWluLCBvciB1c2UgdGhlIG1hcCAvIHNlYXJjaCBiYXIuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogKGVyciAmJiBlcnIubWVzc2FnZSkgfHwgJ0NvdWxkIG5vdCByZWFkIGRldmljZSBsb2NhdGlvbi4nO1xuICAgICAgICAgICAgICAgIHNldEdlb1N0YXRlKHsgZXJyOiBtc2cgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeyBlbmFibGVIaWdoQWNjdXJhY3k6dHJ1ZSwgdGltZW91dDoxMDAwMCwgbWF4aW11bUFnZTowIH1cbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgLyogV2hlbiB1c2VyIGNsaWNrcyBcIlNhdmUgJiByZXR1cm5cIiwgbWlycm9yIEVYQUNUTFkgd2hhdCB0aGUgZGFzaGJvYXJkJ3NcbiAgICAgKiBXZWF0aGVyIGJ1dHRvbiBkb2VzIGluIHdlYXRoZXItc2V0dGluZ3MtbW9kYWwuanMjc2VsZWN0TG9jYXRpb246XG4gICAgICogICAxLiBsb2NhbFN0b3JhZ2VbJ3dlYXRoZXJMb2NhdGlvbiddICAgICAgICA9IGNob3NlbiBsb2MgKGNhbm9uaWNhbCBrZXlcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgZGFzaGJvYXJkIHJlYWRzIG9uXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW91bnQsIE5PVCAncmVkNS53ZWF0aGVyX2xvY2F0aW9uJykuXG4gICAgICogICAyLiBsb2NhbFN0b3JhZ2VbJ3NhdmVkV2VhdGhlckxvY2F0aW9ucyddICA9IFtsb2MsIC4uLm90aGVyc10gZGVkdXBlZFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ5IGxhdC9sb24sIGNhcHBlZCBhdCAyMC5cbiAgICAgKiAgIDMuIFBPU1QgL2FwaS93ZWF0aGVyLWxvY2F0aW9uIHdpdGggYWN0aXZlK2RlZmF1bHQrc2F2ZWQgc28gdGhlIHNhbWVcbiAgICAgKiAgICAgIGxpc3Qgc3Vydml2ZXMgY3Jvc3MtZGV2aWNlIHNlc3Npb25zIGZvciBzaWduZWQtaW4gdGVuYW50cy5cbiAgICAgKlxuICAgICAqIFdpdGhvdXQgc3RlcCAxIHRoZSBkYXNoYm9hcmQncyBgd2VhdGhlckxvY2F0aW9uYCBzdGF0ZSBzaWxlbnRseSBrZWVwc1xuICAgICAqIGl0cyBvbGQgdmFsdWUgLS0gd2hpY2ggaXMgZXhhY3RseSB0aGUgYnVnIG9wZXJhdG9ycyByZXBvcnRlZCBhZnRlclxuICAgICAqIHBpY2tpbmcgYSBsb2NhdGlvbiBpbiBTZXR1cCBXYWxrIGFuZCBzZWVpbmcgdGhlIGRhc2hib2FyZCdzIHdlYXRoZXJcbiAgICAgKiBzdHJpcCByZWZ1c2UgdG8gdXBkYXRlLiAqL1xuICAgIGNvbnN0IFtzYXZlTXNnLCBzZXRTYXZlTXNnXSA9IFJlYWN0LnVzZVN0YXRlKG51bGwpO1xuICAgIGNvbnN0IHBlcnNpc3RBbmRTYXZlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBsb2MgPSB7IGxhdDogY2ZnLmxhdCwgbG9uOiBjZmcubG9uLCBuYW1lOiBjZmcuc2l0ZU5hbWUgfHwgY2ZnLmNpdHkgfTtcblxuICAgICAgICAvLyBEZS1kdXAgdGhlIGV4aXN0aW5nIHNhdmVkIGxpc3QgYnkgbGF0L2xvbiAoc2FtZSBrZXkgdGhlIGRhc2hib2FyZFxuICAgICAgICAvLyB1c2VzKSBhbmQgcHV0IHRoZSBuZXcgcGljayBhdCB0aGUgdG9wLiAgQ2FwIGF0IDIwIHRvIG1hdGNoIHRoZVxuICAgICAgICAvLyBkYXNoYm9hcmQncyBiZWhhdmlvdXIuXG4gICAgICAgIGNvbnN0IGtleSA9IGxvYy5sYXQudG9GaXhlZCg0KSArICcsJyArIGxvYy5sb24udG9GaXhlZCg0KTtcbiAgICAgICAgY29uc3QgZGVkdXBlZCA9IHNhdmVkTG9jcy5maWx0ZXIobCA9PiAobC5sYXQudG9GaXhlZCg0KSArICcsJyArIGwubG9uLnRvRml4ZWQoNCkpICE9PSBrZXkpO1xuICAgICAgICBjb25zdCBuZXh0U2F2ZWQgPSBbbG9jLCAuLi5kZWR1cGVkXS5zbGljZSgwLCAyMCk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd3ZWF0aGVyTG9jYXRpb24nLCBKU09OLnN0cmluZ2lmeShsb2MpKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzYXZlZFdlYXRoZXJMb2NhdGlvbnMnLCBKU09OLnN0cmluZ2lmeShuZXh0U2F2ZWQpKTtcbiAgICAgICAgICAgIC8vIEtlZXAgdGhlIG9sZCBrZXkgdG9vIC0tIHNvbWUgbGVnYWN5IHBsdWctaW5zIHN0aWxsIGxvb2sgYXQgaXQuXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS53ZWF0aGVyX2xvY2F0aW9uJywgSlNPTi5zdHJpbmdpZnkobG9jKSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogcHJpdmF0ZSBtb2RlIC0tIGlnbm9yZSAqLyB9XG5cbiAgICAgICAgbGV0IHBlcnNpc3RlZCA9IGZhbHNlLCB3YXJuaW5nID0gJyc7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goJy9hcGkvd2VhdGhlci1sb2NhdGlvbicsIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICBjcmVkZW50aWFsczogJ2luY2x1ZGUnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6J2FwcGxpY2F0aW9uL2pzb24nIH0sXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBhY3RpdmU6IGxvYywgZGVmYXVsdDogbG9jLCBzYXZlZDogbmV4dFNhdmVkIH0pLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBqID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgICB3aW5kb3cuX2xhc3RXZWF0aGVyTG9jYXRpb25TYXZlID0gajtcbiAgICAgICAgICAgIHBlcnNpc3RlZCA9ICEhai5wZXJzaXN0ZWQ7XG4gICAgICAgICAgICB3YXJuaW5nICAgPSBqLndhcm5pbmcgfHwgJyc7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ1tzZXR1cCB3YWxrXSAvYXBpL3dlYXRoZXItbG9jYXRpb24gPC0nLCBqKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgd2FybmluZyA9ICdOZXR3b3JrIGVycm9yIOKAlCBzYXZlZCBsb2NhbGx5IG9ubHkuJztcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignW3NldHVwIHdhbGtdIGNvdWxkIG5vdCBwZXJzaXN0IGxvY2F0aW9uOicsIGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGVsbCBhbnkgb3BlbiBkYXNoYm9hcmQgdGFiIHRvIHJlLWh5ZHJhdGUuICBUaGUgZGFzaGJvYXJkXG4gICAgICAgIC8vIGFscmVhZHkgbGlzdGVucyBmb3IgYHN0b3JhZ2VgIGV2ZW50cyB3aGVuIGFub3RoZXIgdGFiIHdyaXRlcyB0b1xuICAgICAgICAvLyBsb2NhbFN0b3JhZ2UsIGJ1dCBvbiBWMS45IHNvbWUgYnJvd3NlcnMgRE9OJ1QgZmlyZSBgc3RvcmFnZWAgZm9yXG4gICAgICAgIC8vIHNhbWUtb3JpZ2luIHdyaXRlcyBmcm9tIHRoaXMgc2FtZSB0YWIuICBBbiBleHBsaWNpdCBjdXN0b20gZXZlbnRcbiAgICAgICAgLy8gbWFrZXMgdGhlIGRhc2hib2FyZCdzIHBvbGxpbmcgcGljayB0aGUgY2hhbmdlIHVwIGltbWVkaWF0ZWx5IGlmXG4gICAgICAgIC8vIGl0J3MgYWxyZWFkeSBtb3VudGVkIGluIGFub3RoZXIgdGFiL3dpbmRvdy5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncmVkNTp3ZWF0aGVyTG9jYXRpb25DaGFuZ2VkJyxcbiAgICAgICAgICAgICAgICB7IGRldGFpbDogeyBhY3RpdmU6IGxvYywgc2F2ZWQ6IG5leHRTYXZlZCB9IH0pKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBJRS1sZXNzIGVudmlyb25tZW50cyAtLSBuby1vcCAqLyB9XG5cbiAgICAgICAgaWYgKHBlcnNpc3RlZCkge1xuICAgICAgICAgICAgb25TYXZlKCk7ICAgICAgICAgICAvLyBoYXBweSBwYXRoOiBjbG9zZSArIG1hcmsgc3RlcCBkb25lXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvKiBTdXJmYWNlIHRoZSB3YXJuaW5nLCBob2xkIHRoZSBtb2RhbCBvcGVuIGZvciAxLjZzIHNvIHRoZVxuICAgICAgICAgICAgICogb3BlcmF0b3IgcmVhZHMgaXQsIHRoZW4gY2xvc2UuICBUaGUgbG9jYWwgY29weSBpcyBhbHJlYWR5XG4gICAgICAgICAgICAgKiB3cml0dGVuLCBzbyB0aGUgZGFzaGJvYXJkIHdpbGwgc3RpbGwgc2VlIHRoZSBuZXcgbG9jYXRpb25cbiAgICAgICAgICAgICAqIGluIHRoaXMgYnJvd3NlciBzZXNzaW9uLiAqL1xuICAgICAgICAgICAgc2V0U2F2ZU1zZyh3YXJuaW5nIHx8ICdTYXZlZCBsb2NhbGx5IG9ubHkg4oCUIHNpZ24gaW4gdG8gc2F2ZSBzZXJ2ZXItc2lkZS4nKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyBzZXRTYXZlTXNnKG51bGwpOyBvblNhdmUoKTsgfSwgMTYwMCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8TW9kYWxTaGVsbCB0aXRsZT1cIkxvY2F0aW9uIFNldHRpbmdcIiBzdWJ0aXRsZT1cIkNsaWNrIHRoZSBtYXAsIGRyYWcgdGhlIHBpbiwgb3IgdXNlIHlvdXIgZGV2aWNlXCIgYWNjZW50PVwiYW1iZXJcIiBvbkNsb3NlPXtvbkNsb3NlfSBvblNhdmU9e3BlcnNpc3RBbmRTYXZlfSBzaXplPVwibWF4XCI+XG4gICAgICAgICAgICB7c2F2ZU1zZyAmJiAoXG4gICAgICAgICAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cImxvYy1zYXZlLW1zZ1wiXG4gICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtYi0zIHB4LTQgcHktMi41IHJvdW5kZWQtbGcgYmctYW1iZXItOTAwLzMwIGJvcmRlciBib3JkZXItYW1iZXItNzAwLzUwIHRleHQtYW1iZXItMjAwIHRleHQteHMgZm9udC1tb25vXCI+XG4gICAgICAgICAgICAgICAgICAgIOKaoCAge3NhdmVNc2d9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIGxnOmdyaWQtY29scy1bMWZyXzM0MHB4XSBnYXAtNCBoLWZ1bGxcIiBzdHlsZT17e21pbkhlaWdodDonNTZ2aCd9fT5cbiAgICAgICAgICAgICAgICB7LyogTUFQIOKAlCBmaWxscyB0aGUgbGVmdCBzaWRlLCB3aXRoIGEgc2VhcmNoIGJhciBmbG9hdGluZyBvbiB0b3AgKi99XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZVwiIHN0eWxlPXt7bWluSGVpZ2h0Oic1NnZoJ319PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHJlZj17bWFwQm94UmVmfVxuICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGhlaWdodDonMTAwJScsIG1pbkhlaWdodDonNTZ2aCcsIHdpZHRoOicxMDAlJywgYm9yZGVyUmFkaXVzOicxMnB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzonaGlkZGVuJywgYm9yZGVyOicxcHggc29saWQgIzMzNDE1NScsIGJhY2tncm91bmQ6JyMwYjEyMjAnIH19Lz5cblxuICAgICAgICAgICAgICAgICAgICB7LyogU2VhcmNoIGJhciBvdmVybGF5IOKAlCBzaXRzIGluIHRoZSB0b3AtY2VudHJlIG9mIHRoZSBtYXAgKi99XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgdG9wLTMgbGVmdC0xLzIgLXRyYW5zbGF0ZS14LTEvMiB6LVs1MDBdXCIgc3R5bGU9e3t3aWR0aDonbWluKDU2MHB4LCBjYWxjKDEwMCUgLSAxMTBweCkpJ319PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtzZWFyY2hRfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldFNlYXJjaFEoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkZvY3VzPXsoKSA9PiBzZWFyY2hIaXRzLmxlbmd0aCAmJiBzZXRTZWFyY2hPcGVuKHRydWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIvCflI4gIFNlYXJjaCBieSBhZGRyZXNzLCBidWlsZGluZywgb3IgcGxhY2UgbmFtZeKAplwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBweC00IHB5LTIuNSByb3VuZGVkLXhsIGJnLXNsYXRlLTkwMC85NSBib3JkZXIgYm9yZGVyLXNsYXRlLTYwMCB0ZXh0LXNsYXRlLTEwMCB0ZXh0LXNtIHBsYWNlaG9sZGVyLXNsYXRlLTUwMCBzaGFkb3ctMnhsIGJhY2tkcm9wLWJsdXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e291dGxpbmU6J25vbmUnfX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWFyY2hCdXN5ICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYWJzb2x1dGUgcmlnaHQtMyB0b3AtMS8yIC10cmFuc2xhdGUteS0xLzIgdGV4dC1hbWJlci00MDAgdGV4dC14c1wiPuKApjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWFyY2hPcGVuICYmIHNlYXJjaEhpdHMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgdG9wLWZ1bGwgbGVmdC0wIHJpZ2h0LTAgbXQtMSBiZy1zbGF0ZS05MDAvOTcgYm9yZGVyIGJvcmRlci1zbGF0ZS03MDAgcm91bmRlZC14bCBzaGFkb3ctMnhsIG92ZXJmbG93LWhpZGRlbiBtYXgtaC03MiBvdmVyZmxvdy15LWF1dG8gYmFja2Ryb3AtYmx1clwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlYXJjaEhpdHMubWFwKChoLCBpKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e2gucGxhY2VfaWQgfHwgaX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHBpY2tTZWFyY2hIaXQoaCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgdGV4dC1sZWZ0IHB4LTQgcHktMi41IGhvdmVyOmJnLWFtYmVyLTkwMC8zMCBib3JkZXItYiBib3JkZXItc2xhdGUtODAwIGxhc3Q6Ym9yZGVyLWItMCB0cmFuc2l0aW9uLWFsbFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC1zbGF0ZS0yMDAgdHJ1bmNhdGVcIj57aC5kaXNwbGF5X25hbWV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBtdC0wLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtoLnR5cGUgfHwgaC5jbGFzc30gwrcgeygraC5sYXQpLnRvRml4ZWQoMyl9LCB7KCtoLmxvbikudG9GaXhlZCgzKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VhcmNoT3BlbiAmJiBzZWFyY2hIaXRzLmxlbmd0aCA9PT0gMCAmJiBzZWFyY2hRLmxlbmd0aCA+PSAzICYmICFzZWFyY2hCdXN5ICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSB0b3AtZnVsbCBsZWZ0LTAgcmlnaHQtMCBtdC0xIGJnLXNsYXRlLTkwMC85NyBib3JkZXIgYm9yZGVyLXNsYXRlLTcwMCByb3VuZGVkLXhsIHB4LTQgcHktMyB0ZXh0LXhzIHRleHQtc2xhdGUtNDAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBObyByZXN1bHRzIGZvciBcIntzZWFyY2hRfVwiLiAgVHJ5IGEgbW9yZSBzcGVjaWZpYyB0ZXJtLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgey8qIFNJREUgUEFORUwgKi99XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTQgb3ZlcmZsb3cteS1hdXRvIHByLTFcIj5cbiAgICAgICAgICAgICAgICAgICAgey8qIFNpdGUgbmFtZSBjb21iby1pbnB1dC4gIEZyZWUtZm9ybSB0eXBpbmcgZm9yIGZyZXNoXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbHM7IGEgdmlzaWJsZSBjaGV2cm9uIGJ1dHRvbiBvbiB0aGUgcmlnaHQgb3BlbnNcbiAgICAgICAgICAgICAgICAgICAgICAgIGEgY3VzdG9tIHBvcGRvd24gbGlzdGluZyBldmVyeSBzYXZlZCBsb2NhdGlvbiBwdWxsZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gL2FwaS93ZWF0aGVyLWxvY2F0aW9uIChpLmUuIHRoZSBTQU1FIGxpc3QgdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICBEYXNoYm9hcmQncyBXZWF0aGVyIGJ1dHRvbiBzdXJmYWNlcykuICBUaGlzIHJlcGxhY2VzXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGUgZWFybGllciBuYXRpdmUgPGRhdGFsaXN0PiB3aGljaCB3YXMgdG9vIHN1YnRsZVxuICAgICAgICAgICAgICAgICAgICAgICAgaW4gZGFyayB0aGVtZXMgLS0gb3BlcmF0b3JzIHdpdGggTj4wIHNhdmVkIGVudHJpZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdWxkIG5vdCB0ZWxsIGEgZHJvcGRvd24gZXhpc3RlZC4gKi99XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNpdGUgbmFtZSAoc2F2ZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NhdmVkTG9jcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibWwtMiB0ZXh0LWFtYmVyLTQwMC84MCBub3JtYWwtY2FzZSB0cmFja2luZy1ub3JtYWwgdGV4dC1bMTBweF1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImxvYy1zYXZlZC1oaW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICDilr4ge3NhdmVkTG9jcy5sZW5ndGh9IHNhdmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlXCIgcmVmPXtzYXZlZFJlZn0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0IHByLTlcIiB2YWx1ZT17Y2ZnLnNpdGVOYW1lIHx8ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImxvYy1zaXRlLW5hbWUtaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17c2F2ZWRMb2NzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ1BpY2sgYSBzYXZlZCBsb2NhdGlvbiwgb3IgdHlwZSBhIG5ldyBvbmXigKYnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdlLmcuIEhRIFRvd2VyLCBOb3J0aCBXaW5nLCBQYXZpbGlvbiBC4oCmJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBvblNpdGVOYW1lQ2hhbmdlKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Gb2N1cz17KCkgPT4gc2F2ZWRMb2NzLmxlbmd0aCA+IDAgJiYgc2V0U2F2ZWRPcGVuKHRydWUpfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NhdmVkTG9jcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImxvYy1zYXZlZC1jaGV2cm9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRTYXZlZE9wZW4odiA9PiAhdil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIk9wZW4gc2F2ZWQgbG9jYXRpb25zXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIlBpY2sgZnJvbSBzYXZlZCBsb2NhdGlvbnNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIHJpZ2h0LTEgdG9wLTEvMiAtdHJhbnNsYXRlLXktMS8yIHctNyBoLTcgcm91bmRlZC1tZCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBiZy1hbWJlci03MDAvMzAgaG92ZXI6YmctYW1iZXItNjAwLzUwIGJvcmRlciBib3JkZXItYW1iZXItNTAwLzQwIHRleHQtYW1iZXItMjAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiMTRcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMi40XCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7dHJhbnNmb3JtOiBzYXZlZE9wZW4gPyAncm90YXRlKDE4MGRlZyknIDogJ25vbmUnLCB0cmFuc2l0aW9uOid0cmFuc2Zvcm0gLjE1cyd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cG9seWxpbmUgcG9pbnRzPVwiNiA5IDEyIDE1IDE4IDlcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2F2ZWRPcGVuICYmIHNhdmVkTG9jcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cImxvYy1zYXZlZC1kcm9wZG93blwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgei1bNjAwXSBsZWZ0LTAgcmlnaHQtMCB0b3AtZnVsbCBtdC0xIGJnLXNsYXRlLTkwMCBib3JkZXIgYm9yZGVyLXNsYXRlLTYwMCByb3VuZGVkLWxnIHNoYWRvdy0yeGwgbWF4LWgtNjQgb3ZlcmZsb3cteS1hdXRvXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2F2ZWRMb2NzLm1hcChsb2MgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzQWN0aXZlID0gKGNmZy5zaXRlTmFtZSB8fCAnJykudHJpbSgpID09PSBsb2MubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGtleT17bG9jLm5hbWV9IHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHBpY2tTYXZlZExvYyhsb2MpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgbG9jLXNhdmVkLW9wdC0ke2xvYy5uYW1lfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdy1mdWxsIHRleHQtbGVmdCBweC0zIHB5LTIgYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTgwMCBsYXN0OmJvcmRlci1iLTAgaG92ZXI6YmctYW1iZXItOTAwLzMwIHRyYW5zaXRpb24tY29sb3JzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7aXNBY3RpdmUgPyAnYmctYW1iZXItOTAwLzUwJyA6ICcnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIHRleHQtc2xhdGUtMTAwIHRydW5jYXRlXCI+e2xvYy5uYW1lfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBmb250LW1vbm8gbXQtMC41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2xvYy5sYXQudG9GaXhlZCgyKX0sIHtsb2MubG9uLnRvRml4ZWQoMil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0xIGl0YWxpY1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzYXZlZExvY3MubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdQaWNrIGEgcHJldmlvdXNseS1zYXZlZCBsb2NhdGlvbiwgb3IgdHlwZSBhIG5ldyBsYWJlbCBmb3IgdGhpcyBwbGFjZS4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ1lvdXIgbGFiZWwgZm9yIHRoaXMgcGxhY2Ug4oCUIHNob3duIG9uIHRoZSBkYXNoYm9hcmQgaGVhZGVyLid9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyLXQgYm9yZGVyLXNsYXRlLTgwMCBwdC0zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlc29sdmVkIGFkZHJlc3MgLyBjaXR5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2dlb0J1c3kgJiYgPHNwYW4gY2xhc3NOYW1lPVwibWwtMiB0ZXh0LWFtYmVyLTQwMCBub3JtYWwtY2FzZSB0cmFja2luZy1ub3JtYWxcIj7igKYgcmVzb2x2aW5nPC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCIgdmFsdWU9e2NmZy5jaXR5fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSk9PnNldENmZyh7Li4uY2ZnLCBjaXR5OmUudGFyZ2V0LnZhbHVlfSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTEuNVwiPkxhdGl0dWRlPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCIgdHlwZT1cIm51bWJlclwiIHN0ZXA9XCIwLjAwMDFcIiB2YWx1ZT17Y2ZnLmxhdH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKT0+c2V0Q2ZnKHsuLi5jZmcsIGxhdDorZS50YXJnZXQudmFsdWV9KX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMS41XCI+TG9uZ2l0dWRlPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCIgdHlwZT1cIm51bWJlclwiIHN0ZXA9XCIwLjAwMDFcIiB2YWx1ZT17Y2ZnLmxvbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKT0+c2V0Q2ZnKHsuLi5jZmcsIGxvbjorZS50YXJnZXQudmFsdWV9KX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17dXNlTXlMb2NhdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17Z2VvU3RhdGUgPT09ICdidXN5J31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImxvYy11c2UtbXktbG9jYXRpb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHctZnVsbCBweS0yLjUgcm91bmRlZC1sZyBib3JkZXIgdGV4dC14cyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgdHJhbnNpdGlvbi1jb2xvcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtnZW9TdGF0ZSA9PT0gJ2J1c3knXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1hbWJlci05MDAvNDAgYm9yZGVyLWFtYmVyLTcwMC80MCB0ZXh0LWFtYmVyLTIwMCBjdXJzb3Itd2FpdCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogKGdlb1N0YXRlICYmIGdlb1N0YXRlLmVyclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLXJvc2UtOTAwLzQwIGJvcmRlci1yb3NlLTUwMC81MCB0ZXh0LXJvc2UtMTAwIGhvdmVyOmJnLXJvc2UtODAwLzQwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLWFtYmVyLTcwMC83MCBib3JkZXItYW1iZXItNTAwLzQwIHRleHQtYW1iZXItNTAgaG92ZXI6YmctYW1iZXItNjAwLzcwJyl9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7Z2VvU3RhdGUgPT09ICdidXN5J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ+KPsyAgUmVhZGluZyBkZXZpY2UgbG9jYXRpb27igKYnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAn8J+TjSAgVXNlIG15IGRldmljZSBsb2NhdGlvbid9XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICB7Z2VvU3RhdGUgJiYgZ2VvU3RhdGUuZXJyICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJsb2MtZ2VvLWVycm9yXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiLW10LTIgcHgtMyBweS0yIHJvdW5kZWQtbWQgYmctcm9zZS05NTAvNTAgYm9yZGVyIGJvcmRlci1yb3NlLTcwMC80MCB0ZXh0LVsxMXB4XSBsZWFkaW5nLXNudWcgdGV4dC1yb3NlLTIwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxiIGNsYXNzTmFtZT1cInRleHQtcm9zZS0xMDBcIj5Db3VsZG4ndCByZWFkIGxvY2F0aW9uLjwvYj48YnIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtcm9zZS0yMDAvOTBcIj57Z2VvU3RhdGUuZXJyfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogU3BlY2lmaWMgSFRUUC1vcmlnaW4gY2FsbC1vdXQ6IG1vc3QgbGlrZWx5IGNhdXNlIG9uIGEgVjEuOSBjb250cm9sbGVyLiAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmxvY2F0aW9uICYmIHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2h0dHA6JyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtMS41IHRleHQtWzEwcHhdIHRleHQtcm9zZS0zMDAvODAgZm9udC1tb25vXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXA6IGJyb3dzZXJzIHJlcXVpcmUgSFRUUFMgZm9yIGdlb2xvY2F0aW9uLiAgUGljayB0aGUgbG9jYXRpb24gb24gdGhlIG1hcCBvciBzZWFyY2ggYmFyIGluc3RlYWQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvcmRlci10IGJvcmRlci1zbGF0ZS04MDAgcHQtMyBtdC0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj5RdWljayBqdW1wczwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC0xLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7W1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J1Rvcm9udG8sIE9OJywgICBsYXQ6NDMuNjUzMiwgbG9uOi03OS4zODMyLCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonTmV3IFlvcmssIE5ZJywgIGxhdDo0MC43MTI4LCBsb246LTc0LjAwNjAsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidMb25kb24sIFVLJywgICAgbGF0OjUxLjUwNzQsIGxvbjogLTAuMTI3OCwgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J1BhcmlzLCBGUicsICAgICBsYXQ6NDguODU2NiwgbG9uOiAgMi4zNTIyLCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonVG9reW8sIEpQJywgICAgIGxhdDozNS42NzYyLCBsb246MTM5LjY1MDMsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidTeWRuZXksIEFVJywgICAgbGF0Oi0zMy44Njg4LGxvbjoxNTEuMjA5MywgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0ubWFwKGogPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGtleT17ai5uYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBsYXQ6ai5sYXQsIGxvbjpqLmxvbiwgY2l0eTpqLm5hbWV9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXBSZWYuY3VycmVudCkgbWFwUmVmLmN1cnJlbnQuc2V0Vmlldyhbai5sYXQsIGoubG9uXSwgai56KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtbGVmdCBweC0yLjUgcHktMS41IHJvdW5kZWQtbWQgYmctc2xhdGUtODAwLzcwIGJvcmRlciBib3JkZXItc2xhdGUtNzAwIHRleHQtWzExcHhdIGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTMwMCBob3ZlcjpiZy1zbGF0ZS03MDAgaG92ZXI6Ym9yZGVyLWFtYmVyLTUwMC80MCB0cmFuc2l0aW9uLWFsbFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2oubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbGVhZGluZy1yZWxheGVkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICBUaWxlczogT3BlblN0cmVldE1hcCDCtyBHZW9jb2RlOiBOb21pbmF0aW0gKGZyZWUsIH4xIHJlcS9zKS5cbiAgICAgICAgICAgICAgICAgICAgICAgIFVzZWQgZm9yIE9wZW4tTWV0ZW8gd2VhdGhlciBmZWVkIGFuZCBzdW5yaXNlL3N1bnNldCBlc3RpbWF0aW9uLlxuICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Nb2RhbFNoZWxsPlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIExhbmd1YWdlIFNldHRpbmcgLS0gbW9kYWxcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIExhbmd1YWdlTW9kYWwoeyBjZmcsIHNldENmZywgb25DbG9zZSwgb25TYXZlIH0pIHtcbiAgICBjb25zdCBsYW5ncyA9IFtcbiAgICAgICAgeyBjb2RlOidlbicsICAgIGxhYmVsOidFbmdsaXNoJywgICAgICAgICAgICAgICAgbmF0aXZlOidFbmdsaXNoJyAgICB9LFxuICAgICAgICB7IGNvZGU6J3poLUNOJywgbGFiZWw6J0NoaW5lc2UgKFNpbXBsaWZpZWQpJywgICBuYXRpdmU6J+eugOS9k+S4reaWhycgICAgfSxcbiAgICAgICAgeyBjb2RlOid6aC1UVycsIGxhYmVsOidDaGluZXNlIChUcmFkaXRpb25hbCknLCAgbmF0aXZlOifnuYHpq5TkuK3mlocnICAgIH0sXG4gICAgICAgIHsgY29kZTonamEnLCAgICBsYWJlbDonSmFwYW5lc2UnLCAgICAgICAgICAgICAgIG5hdGl2ZTon5pel5pys6KqeJyAgICAgIH0sXG4gICAgICAgIHsgY29kZTona28nLCAgICBsYWJlbDonS29yZWFuJywgICAgICAgICAgICAgICAgIG5hdGl2ZTon7ZWc6rWt7Ja0JyAgICAgIH0sXG4gICAgXTtcblxuICAgIC8qIE9uIFNhdmUgJiByZXR1cm46IHdyaXRlIHRoZSBwaWNrZWQgbGFuZ3VhZ2UgY29kZSB0byB0aGUgc2FtZVxuICAgICAqIGxvY2FsU3RvcmFnZSBrZXkgdGhlIGRhc2hib2FyZCdzIGkxOG4uanMgcmVhZHMgKGBpMThuX2xhbmdgKSwgYW5kXG4gICAgICogZGlzcGF0Y2ggdGhlIGBsYW5nY2hhbmdlYCBldmVudCBzbyBhbnkgb3BlbiBkYXNoYm9hcmQvY29uZmlnIHRhYlxuICAgICAqIHBpY2tzIGl0IHVwIGxpdmUuICBUaGlzIGlzIHdoYXQgbWFrZXMgdGhlIHNldHVwIHdhbGsncyBsYW5ndWFnZVxuICAgICAqIGNob2ljZSBhY3R1YWxseSBkcml2ZSB0aGUgZGFzaGJvYXJkIC8gY29uZmlnIC8gbWFwcGVyIFVJIC0tIHRoZVxuICAgICAqIHNpZGViYXIgc2VsZWN0b3IgdGhhdCB1c2VkIHRvIGxpdmUgaW4gdGhlIGRhc2hib2FyZCBoZWFkZXIgaGFzXG4gICAgICogYmVlbiByZW1vdmVkICgyMDI2LTA2LTI2KSBhbmQgdGhlIHNldHVwIHdhbGsgaXMgbm93IHRoZSBzaW5nbGVcbiAgICAgKiBzb3VyY2Ugb2YgdHJ1dGggZm9yIFVJIGxhbmd1YWdlLiAqL1xuICAgIGNvbnN0IHBlcnNpc3RBbmRTYXZlID0gKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2kxOG5fbGFuZycsIGNmZy5sYW5nKTtcbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnbGFuZ2NoYW5nZScpKTtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnW3NldHVwIHdhbGtdIGkxOG5fbGFuZyA8LScsIGNmZy5sYW5nKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdbc2V0dXAgd2Fsa10gY291bGQgbm90IHBlcnNpc3QgbGFuZ3VhZ2U6JywgZSk7XG4gICAgICAgIH1cbiAgICAgICAgb25TYXZlKCk7XG4gICAgfTtcbiAgICByZXR1cm4gKFxuICAgICAgICA8TW9kYWxTaGVsbCB0aXRsZT1cIkxhbmd1YWdlIFNldHRpbmdcIiBzdWJ0aXRsZT1cIlBpY2sgeW91ciBkZWZhdWx0IGludGVyZmFjZSBsYW5ndWFnZVwiIGFjY2VudD1cImVtZXJhbGRcIiBvbkNsb3NlPXtvbkNsb3NlfSBvblNhdmU9e3BlcnNpc3RBbmRTYXZlfT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtM1wiPlxuICAgICAgICAgICAgICAgIHtsYW5ncy5tYXAobCA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PXtsLmNvZGV9IG9uQ2xpY2s9eygpPT5zZXRDZmcoey4uLmNmZywgbGFuZzpsLmNvZGV9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B0ZXh0LWxlZnQgcC0zIHJvdW5kZWQteGwgYm9yZGVyLTIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjZmcubGFuZyA9PT0gbC5jb2RlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdib3JkZXItZW1lcmFsZC01MDAgYmctZW1lcmFsZC05MDAvMjAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdib3JkZXItc2xhdGUtNzAwIGJnLXNsYXRlLTgwMC80MCBob3ZlcjpiZy1zbGF0ZS04MDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS01MDBcIj57bC5jb2RlfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS0yMDBcIj57bC5uYXRpdmV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzExcHhdIHRleHQtc2xhdGUtNTAwXCI+e2wubGFiZWx9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvTW9kYWxTaGVsbD5cbiAgICApO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBQbHVnLWluIFNldHRpbmcgLS0gbW9kYWwgdy8gbGlzdCArIHVwbG9hZCB6b25lXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4vKiBQZXItcGx1Zy1pbiBtb2NrIGNvbmZpZ3VyYXRpb24gZmllbGRzLiAgS2V5cyBtYXAgdG8gcGx1Zy1pbiBgaWRgLiAqL1xuY29uc3QgUExVR0lOX0NPTkZJR19GSUVMRFMgPSB7XG4gICAgd2VhdGhlcjogICAgW1xuICAgICAgICB7IGtleToncHJvdmlkZXInLCAgbGFiZWw6J1Byb3ZpZGVyJywgICAgICAgICAgdHlwZTonc2VsZWN0JywgIG9wdGlvbnM6WydPcGVuLU1ldGVvJywnTldTJywnRUNNV0YnXSwgZGVmOidPcGVuLU1ldGVvJyB9LFxuICAgICAgICB7IGtleToncmVmcmVzaCcsICAgbGFiZWw6J1JlZnJlc2ggaW50ZXJ2YWwnLCAgdHlwZTonc2VsZWN0JywgIG9wdGlvbnM6WycxIG1pbicsJzUgbWluJywnMTUgbWluJywnMzAgbWluJywnMSBoJ10sIGRlZjonMTUgbWluJyB9LFxuICAgICAgICB7IGtleTonY2FjaGUnLCAgICAgbGFiZWw6J0NhY2hlIFRUTCAobWluKScsICAgdHlwZTonbnVtYmVyJywgIGRlZjozMCB9LFxuICAgIF0sXG4gICAgZ2l2b25pOiAgICAgW1xuICAgICAgICB7IGtleTonY2xpbWF0ZScsICAgbGFiZWw6J0NsaW1hdGUgbW9kZWwnLCAgICAgdHlwZTonc2VsZWN0JywgIG9wdGlvbnM6WydHaXZvbmkgMTk5MicsJ0FTSFJBRSA1NScsJ0FkYXB0aXZlJ10sIGRlZjonR2l2b25pIDE5OTInIH0sXG4gICAgICAgIHsga2V5OidtYXNzaXZlJywgICBsYWJlbDonSGVhdnl3ZWlnaHQgY29uc3RydWN0aW9uJywgIHR5cGU6J3RvZ2dsZScsIGRlZjpmYWxzZSB9LFxuICAgIF0sXG4gICAgc3dlZXRfc3BvdDogW1xuICAgICAgICB7IGtleTondHJhY2tpbmcnLCAgbGFiZWw6J1RyYWNrIG91dGRvb3IgUkgnLCAgdHlwZTondG9nZ2xlJywgZGVmOnRydWUgfSxcbiAgICAgICAgeyBrZXk6J2h5c3QnLCAgICAgIGxhYmVsOidIeXN0ZXJlc2lzICglIFJIKScsIHR5cGU6J251bWJlcicsIGRlZjoyIH0sXG4gICAgXSxcbiAgICBnMzY6ICAgICAgICBbXG4gICAgICAgIHsga2V5Oidtb2RlJywgICAgICBsYWJlbDonU2VxdWVuY2UgbW9kZScsICAgICB0eXBlOidzZWxlY3QnLCAgb3B0aW9uczpbJ1NpbmdsZS16b25lIFZBVicsJ011bHRpLXpvbmUgVkFWJywnRE9BUyB3LyBGQ1UnXSwgZGVmOidNdWx0aS16b25lIFZBVicgfSxcbiAgICAgICAgeyBrZXk6J3ZlcmJvc2UnLCAgIGxhYmVsOidWZXJib3NlIGxvZ2dpbmcnLCAgIHR5cGU6J3RvZ2dsZScsIGRlZjpmYWxzZSB9LFxuICAgIF0sXG4gICAgZGlidDogICAgICAgW1xuICAgICAgICB7IGtleTonaG9zdCcsICAgICAgbGFiZWw6J0JyaWRnZSBob3N0JywgICAgICAgdHlwZTondGV4dCcsICAgZGVmOicxOTIuMTY4LjEuMTAwJyB9LFxuICAgICAgICB7IGtleToncG9ydCcsICAgICAgbGFiZWw6J1RlbGVncmFtIHBvcnQnLCAgICAgdHlwZTonbnVtYmVyJywgZGVmOjQ3ODA4IH0sXG4gICAgICAgIHsga2V5Oidwb2xsX21zJywgICBsYWJlbDonUG9sbCBpbnRlcnZhbCAobXMpJyx0eXBlOidudW1iZXInLCBkZWY6MjAwMCB9LFxuICAgIF0sXG4gICAgbGlnaHRpbmc6ICAgW1xuICAgICAgICB7IGtleTonZ2F0ZXdheScsICAgbGFiZWw6J01vZGJ1cyBnYXRld2F5IElQJywgdHlwZTondGV4dCcsICAgZGVmOicxMC4wLjAuNTAnIH0sXG4gICAgICAgIHsga2V5Oid1bml0X2lkJywgICBsYWJlbDonVW5pdCBJRCcsICAgICAgICAgICB0eXBlOidudW1iZXInLCBkZWY6MSB9LFxuICAgICAgICB7IGtleTondGNwX3BvcnQnLCAgbGFiZWw6J1RDUCBwb3J0JywgICAgICAgICAgdHlwZTonbnVtYmVyJywgZGVmOjUwMiB9LFxuICAgIF0sXG59O1xuXG5mdW5jdGlvbiBQbHVnaW5zTW9kYWwoeyBjZmcsIHNldENmZywgb25DbG9zZSwgb25TYXZlIH0pIHtcbiAgICBjb25zdCBBTEwgPSBbXG4gICAgICAgIHsgaWQ6J3dlYXRoZXInLCAgICAgbmFtZTonV2VhdGhlcicsICAgICAgICAgZGVzYzonT3Blbi1NZXRlbyBPQSBmZWVkJywgICAgICAgICAgdmVyOicyLjEuMCcgfSxcbiAgICAgICAgeyBpZDonZ2l2b25pJywgICAgICBuYW1lOidHaXZvbmkgRW5naW5lJywgICBkZXNjOidDbGltYXRlLXN0cmF0ZWd5IG92ZXJsYXknLCAgICB2ZXI6JzEuMy40JyB9LFxuICAgICAgICB7IGlkOidzd2VldF9zcG90JywgIG5hbWU6J1N3ZWV0LVNwb3QgUkgnLCAgIGRlc2M6J0FkanVzdGFibGUgUkggYmFuZCcsICAgICAgICAgIHZlcjonMS4wLjEnIH0sXG4gICAgICAgIHsgaWQ6J2czNicsICAgICAgICAgbmFtZTonRzM2IFNlcXVlbmNlcycsICAgZGVzYzonQVNIUkFFIEd1aWRlbGluZSAzNicsICAgICAgICAgdmVyOicwLjkuMicgfSxcbiAgICAgICAgeyBpZDonZGlidCcsICAgICAgICBuYW1lOidESUJUIEJyaWRnZScsICAgICBkZXNjOidEZWx0YSBDb250cm9scyAoRElCVCkgQkFDbmV0IGJyaWRnZScsICAgICAgICAgICB2ZXI6JzAuNC4wJyB9LFxuICAgICAgICB7IGlkOidsaWdodGluZycsICAgIG5hbWU6J0xpZ2h0aW5nIChSZWQ1KScsIGRlc2M6J1YzLjAgTW9kYnVzIFRDUCBjbGllbnQnLCAgICAgIHZlcjonMC4xLjAtYmV0YScgfSxcbiAgICBdO1xuICAgIGNvbnN0IHRvZ2dsZSA9IChpZCkgPT4gc2V0Q2ZnKGMgPT4gKHtcbiAgICAgICAgLi4uYyxcbiAgICAgICAgZW5hYmxlZDogYy5lbmFibGVkLmluY2x1ZGVzKGlkKSA/IGMuZW5hYmxlZC5maWx0ZXIoeCA9PiB4ICE9PSBpZCkgOiBbLi4uYy5lbmFibGVkLCBpZF1cbiAgICB9KSk7XG5cbiAgICAvKiBleHBhbnNpb24gc3RhdGUg4oCUIHdoaWNoIHBsdWctaW4ncyBcIkNvbmZpZ3VyZVwiIHBhbmVsIGlzIG9wZW4gKi9cbiAgICBjb25zdCBbZXhwYW5kZWRJZCwgc2V0RXhwYW5kZWRJZF0gPSBSZWFjdC51c2VTdGF0ZShudWxsKTtcblxuICAgIGNvbnN0IHVwZGF0ZUZpZWxkID0gKHBsdWdpbklkLCBmaWVsZEtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgc2V0Q2ZnKGMgPT4gKHtcbiAgICAgICAgICAgIC4uLmMsXG4gICAgICAgICAgICBmaWVsZHM6IHsgLi4uKGMuZmllbGRzIHx8IHt9KSwgW3BsdWdpbklkXTogeyAuLi4oKGMuZmllbGRzIHx8IHt9KVtwbHVnaW5JZF0gfHwge30pLCBbZmllbGRLZXldOiB2YWx1ZSB9IH1cbiAgICAgICAgfSkpO1xuICAgIH07XG5cbiAgICBjb25zdCBmaWVsZFZhbCA9IChwbHVnaW5JZCwgZmllbGQpID0+IHtcbiAgICAgICAgY29uc3Qgc3RvcmVkID0gY2ZnLmZpZWxkcyAmJiBjZmcuZmllbGRzW3BsdWdpbklkXSAmJiBjZmcuZmllbGRzW3BsdWdpbklkXVtmaWVsZC5rZXldO1xuICAgICAgICByZXR1cm4gc3RvcmVkICE9PSB1bmRlZmluZWQgPyBzdG9yZWQgOiBmaWVsZC5kZWY7XG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxNb2RhbFNoZWxsIHRpdGxlPVwiUGx1Zy1pbiBTZXR0aW5nXCIgc3VidGl0bGU9XCJFbmFibGUsIHVwbG9hZCBvciBtb2RpZnkgcGx1Zy1pbnNcIiBhY2NlbnQ9XCJwaW5rXCIgb25DbG9zZT17b25DbG9zZX0gb25TYXZlPXtvblNhdmV9IHNpemU9XCJ3aWRlXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMyBtYXgtaC1bNjB2aF0gb3ZlcmZsb3cteS1hdXRvIHByLTFcIj5cbiAgICAgICAgICAgICAgICB7QUxMLm1hcChwID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb24gPSBjZmcuZW5hYmxlZC5pbmNsdWRlcyhwLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhwYW5kZWQgPSBleHBhbmRlZElkID09PSBwLmlkO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWVsZHMgPSBQTFVHSU5fQ09ORklHX0ZJRUxEU1twLmlkXSB8fCBbXTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtwLmlkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2Byb3VuZGVkLXhsIGJvcmRlciB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke29uID8gJ2JvcmRlci1waW5rLTUwMC80MCBiZy1waW5rLTkwMC8xMCcgOiAnYm9yZGVyLXNsYXRlLTcwMCBiZy1zbGF0ZS04MDAvNDAnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2V4cGFuZGVkID8gJ3JpbmctMSByaW5nLXBpbmstNTAwLzMwJyA6ICcnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHAtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS0xMDBcIj57cC5uYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1sLTIgdGV4dC1bMTBweF0gZm9udC1tb25vIHRleHQtc2xhdGUtNTAwXCI+dntwLnZlcn08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXNsYXRlLTQwMFwiPntwLmRlc2N9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHRvZ2dsZShwLmlkKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BwbHVnaW4tdG9nZ2xlLSR7cC5pZH1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweC0zIHB5LTEgcm91bmRlZC1tZCB0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgYm9yZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke29uID8gJ2JvcmRlci1waW5rLTUwMC82MCB0ZXh0LXBpbmstMzAwIGJnLXBpbmstOTAwLzMwJyA6ICdib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtNDAwIGJnLXNsYXRlLTgwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge29uID8gJ0VuYWJsZWQnIDogJ0Rpc2FibGVkJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBzZXRFeHBhbmRlZElkKGV4cGFuZGVkID8gbnVsbCA6IHAuaWQpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17YHBsdWdpbi1jb25maWctJHtwLmlkfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTMgcHktMSByb3VuZGVkLW1kIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayBib3JkZXIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7ZXhwYW5kZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdib3JkZXItcGluay01MDAgYmctcGluay05MDAvMzAgdGV4dC1waW5rLTIwMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtNDAwIGJnLXNsYXRlLTgwMCBob3ZlcjpiZy1zbGF0ZS03MDAgaG92ZXI6Ym9yZGVyLXBpbmstNTAwLzUwIGhvdmVyOnRleHQtcGluay0zMDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtleHBhbmRlZCA/ICdDbG9zZSDilrQnIDogJ0NvbmZpZ3VyZSDilr4nfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtleHBhbmRlZCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHgtNCBwYi00IGJvcmRlci10IGJvcmRlci1waW5rLTUwMC8yMCBiZy1zbGF0ZS05NTAvNDBcIiBkYXRhLXRlc3RpZD17YHBsdWdpbi1jb25maWctcGFuZWwtJHtwLmlkfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2ZpZWxkcy5sZW5ndGggPT09IDAgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXNsYXRlLTUwMCBpdGFsaWMgcHktM1wiPk5vIGNvbmZpZ3VyYWJsZSBvcHRpb25zIGZvciB0aGlzIHBsdWctaW4geWV0LjwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIG1kOmdyaWQtY29scy0yIGdhcC0zIHB0LTNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2ZpZWxkcy5tYXAoZiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2ID0gZmllbGRWYWwocC5pZCwgZik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtmLmtleX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTUwMCBibG9jayBtYi0xXCI+e2YubGFiZWx9PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2YudHlwZSA9PT0gJ3NlbGVjdCcgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dCBjdXJzb3ItcG9pbnRlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt2fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZUZpZWxkKHAuaWQsIGYua2V5LCBlLnRhcmdldC52YWx1ZSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmLm9wdGlvbnMubWFwKG8gPT4gPG9wdGlvbiBrZXk9e299IHZhbHVlPXtvfT57b308L29wdGlvbj4pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmLnR5cGUgPT09ICdudW1iZXInICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt2fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlRmllbGQocC5pZCwgZi5rZXksICtlLnRhcmdldC52YWx1ZSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2YudHlwZSA9PT0gJ3RleHQnICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZUZpZWxkKHAuaWQsIGYua2V5LCBlLnRhcmdldC52YWx1ZSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2YudHlwZSA9PT0gJ3RvZ2dsZScgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB1cGRhdGVGaWVsZChwLmlkLCBmLmtleSwgIXYpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B3LWZ1bGwgcHktMiByb3VuZGVkLWxnIHRleHQteHMgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGJvcmRlciB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHt2XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctcGluay03MDAvNDAgYm9yZGVyLXBpbmstNTAwLzYwIHRleHQtcGluay0yMDAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctc2xhdGUtODAwIGJvcmRlci1zbGF0ZS02MDAgdGV4dC1zbGF0ZS00MDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt2ID8gJ09OJyA6ICdPRkYnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktZW5kIGdhcC0yIG10LTQgcHQtMyBib3JkZXItdCBib3JkZXItc2xhdGUtODAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVzZXQgdGhpcyBwbHVnLWluJ3MgZmllbGRzIHRvIGRlZmF1bHRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q2ZnKGMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXh0ID0geyAuLi4oYy5maWVsZHMgfHwge30pIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBuZXh0W3AuaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyAuLi5jLCBmaWVsZHM6IG5leHQgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC0zIHB5LTEuNSByb3VuZGVkLW1kIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayBib3JkZXIgYm9yZGVyLXNsYXRlLTYwMCB0ZXh0LXNsYXRlLTQwMCBob3ZlcjpiZy1zbGF0ZS04MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVzZXQgZGVmYXVsdHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHNldEV4cGFuZGVkSWQobnVsbCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC0zIHB5LTEuNSByb3VuZGVkLW1kIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayBiZy1waW5rLTYwMCBob3ZlcjpiZy1waW5rLTUwMCB0ZXh0LXdoaXRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERvbmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC01IHAtNCBib3JkZXItMiBib3JkZXItZGFzaGVkIGJvcmRlci1zbGF0ZS03MDAgcm91bmRlZC14bCB0ZXh0LWNlbnRlciBob3Zlcjpib3JkZXItcGluay01MDAvNDAgdHJhbnNpdGlvbi1hbGwgY3Vyc29yLXBvaW50ZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtM3hsIG1iLTFcIj7ipLQ8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1ibGFjayB0ZXh0LXNsYXRlLTMwMFwiPkRyb3AgYSAucHkgLyAuemlwIC8gLnJlZDUgcGx1Zy1pbiBoZXJlPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMXB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0xXCI+b3IgY2xpY2sgdG8gY2hvb3NlIGEgZmlsZSAobW9jayDigJQgbm90IHdpcmVkKTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvTW9kYWxTaGVsbD5cbiAgICApO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBNb2RhbCBTaGVsbCAtLSBzaGFyZWRcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIE1vZGFsU2hlbGwoeyB0aXRsZSwgc3VidGl0bGUsIGFjY2VudD0naW5kaWdvJywgb25DbG9zZSwgb25TYXZlLCBzaXplPScnLCBjaGlsZHJlbiB9KSB7XG4gICAgY29uc3QgY29sb3JNYXAgPSB7XG4gICAgICAgIGluZGlnbzonIzgxOGNmOCcsIGFtYmVyOicjZmJiZjI0JywgZW1lcmFsZDonIzM0ZDM5OScsIHBpbms6JyNmNDcyYjYnXG4gICAgfTtcbiAgICBjb25zdCBjID0gY29sb3JNYXBbYWNjZW50XSB8fCAnIzgxOGNmOCc7XG4gICAgY29uc3Qgc2l6ZU1hcCA9IHtcbiAgICAgICAgd2lkZTogJ21heC13LTJ4bCcsXG4gICAgICAgIG1hcDogICdtYXgtdy0zeGwnLFxuICAgICAgICBtYXg6ICAnbWF4LXctWzk2dnddIHctWzk2dnddIGgtWzkydmhdJyxcbiAgICB9O1xuICAgIGNvbnN0IHdpZHRoID0gc2l6ZU1hcFtzaXplXSB8fCAnbWF4LXctbWQnO1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZml4ZWQgaW5zZXQtMCB6LTUwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIG1vZGFsLWJhY2tkcm9wXCIgb25DbGljaz17b25DbG9zZX0+XG4gICAgICAgICAgICB7LyogRmxleC1jb2x1bW4gc2hlbGw6IGhlYWRlciAoZml4ZWQpICsgc2Nyb2xsYWJsZSBjb250ZW50ICsgc3RpY2t5IGZvb3Rlci5cbiAgICAgICAgICAgICAgICBDcml0aWNhbCBmb3Igc2l6ZT1cIm1heFwiIHdoZXJlIGNoaWxkcmVuIGFsb25lIGV4Y2VlZCB0aGUgbW9kYWwgaGVpZ2h0XG4gICAgICAgICAgICAgICAgYW5kIHdvdWxkIG90aGVyd2lzZSBwdXNoIHRoZSBTYXZlICYgcmV0dXJuIGJ1dHRvbiBiZWxvdyB0aGUgdmlld3BvcnQuICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BiZy1zbGF0ZS05MDAgYm9yZGVyLTIgcm91bmRlZC0yeGwgdy1mdWxsICR7d2lkdGh9IG14LTQgZmFkZS11cCBmbGV4IGZsZXgtY29sYH1cbiAgICAgICAgICAgICAgICAgb25DbGljaz17KGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCl9XG4gICAgICAgICAgICAgICAgIHN0eWxlPXt7Ym9yZGVyQ29sb3I6YCR7Y302NmAsIG1heEhlaWdodDogJzkydmgnfX0+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLXN0YXJ0IGp1c3RpZnktYmV0d2VlbiBwLTYgcGItNCBib3JkZXItYiBib3JkZXItc2xhdGUtODAwLzYwIHNocmluay0wXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1sZyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3RcIiBzdHlsZT17e2NvbG9yOmN9fT57dGl0bGV9PC9oMz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS01MDAgbXQtMVwiPntzdWJ0aXRsZX08L3A+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwibW9kYWwtY2xvc2VcIiBvbkNsaWNrPXtvbkNsb3NlfSBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCBob3Zlcjp0ZXh0LXdoaXRlIHRleHQtMnhsIGxlYWRpbmctbm9uZVwiPsOXPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTEgbWluLWgtMCBvdmVyZmxvdy15LWF1dG8gcHgtNiBweS01XCI+XG4gICAgICAgICAgICAgICAgICAgIHtjaGlsZHJlbn1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktZW5kIGdhcC0zIHB4LTYgcHktNCBib3JkZXItdCBib3JkZXItc2xhdGUtODAwIHNocmluay0wIGJnLXNsYXRlLTkwMCByb3VuZGVkLWItMnhsXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJtb2RhbC1jYW5jZWxcIiBvbkNsaWNrPXtvbkNsb3NlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTQgcHktMiByb3VuZGVkLWxnIGJnLXNsYXRlLTgwMCBib3JkZXIgYm9yZGVyLXNsYXRlLTcwMCB0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayB0ZXh0LXNsYXRlLTQwMCBob3ZlcjpiZy1zbGF0ZS03MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIENhbmNlbFxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cIm1vZGFsLXNhdmVcIiBvbkNsaWNrPXtvblNhdmV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtNSBweS0yIHJvdW5kZWQtbGcgdGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgdGV4dC13aGl0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOmMsIGJveFNoYWRvdzpgMCAwIDEycHggJHtjfTU1YH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgU2F2ZSAmIHJldHVybiDinJNcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuLyogbW91bnQgKi9cblJlYWN0RE9NLmNyZWF0ZVJvb3QoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKSkucmVuZGVyKDxBcHAvPik7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBQSxNQUFBLEdBQThCQyxLQUFLO0VBQTNCQyxRQUFRLEdBQUFGLE1BQUEsQ0FBUkUsUUFBUTtFQUFFQyxPQUFPLEdBQUFILE1BQUEsQ0FBUEcsT0FBTzs7QUFFekI7QUFDQTtBQUNBO0FBQ0EsSUFBTUMsS0FBSyxHQUFHLENBQ1Y7QUFDQTtFQUFFQyxHQUFHLEVBQUMsS0FBSztFQUFPQyxLQUFLLEVBQUMsbUJBQW1CO0VBQUtDLEdBQUcsRUFBQywwQkFBMEI7RUFBR0MsSUFBSSxFQUFDLE1BQU07RUFBR0MsU0FBUyxFQUFDLFNBQVM7RUFBRUMsTUFBTSxFQUFDO0FBQVMsQ0FBQyxFQUNySTtFQUFFTCxHQUFHLEVBQUMsVUFBVTtFQUFFQyxLQUFLLEVBQUMsa0JBQWtCO0VBQU1DLEdBQUcsRUFBQyxtQkFBbUI7RUFBVUMsSUFBSSxFQUFDLE9BQU87RUFBRUMsU0FBUyxFQUFDLFNBQVM7RUFBRUMsTUFBTSxFQUFDO0FBQVMsQ0FBQyxFQUNySTtFQUFFTCxHQUFHLEVBQUMsVUFBVTtFQUFFQyxLQUFLLEVBQUMsa0JBQWtCO0VBQU1DLEdBQUcsRUFBQyw0QkFBNEI7RUFBRUMsSUFBSSxFQUFDLE9BQU87RUFBRUMsU0FBUyxFQUFDLFNBQVM7RUFBRUMsTUFBTSxFQUFDO0FBQVMsQ0FBQyxFQUN0STtFQUFFTCxHQUFHLEVBQUMsU0FBUztFQUFHQyxLQUFLLEVB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