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
      width: 'min(640px, 88vw)',
      aspectRatio: '1 / 1',
      animationDelay: '.08s'
    }
  }, STEPS.map((s, i) => {
    var angleDeg = -90 + i * 72;
    var angle = angleDeg * Math.PI / 180;
    var r = 38; // % of container half-side
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
      return 50 + 38 * Math.cos(a) + ',' + (50 + 38 * Math.sin(a));
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
      width: 'min(22%, 168px)',
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBfd2Fsay5jb21waWxlZC5qcyIsIm5hbWVzIjpbIl9SZWFjdCIsIlJlYWN0IiwidXNlU3RhdGUiLCJ1c2VNZW1vIiwiU1RFUFMiLCJrZXkiLCJsYWJlbCIsInN1YiIsImtpbmQiLCJpY29uQ29sb3IiLCJhY2NlbnQiLCJocmVmIiwiQXBwIiwiX3VzZVN0YXRlIiwicHN5IiwibG9jYXRpb24iLCJsYW5ndWFnZSIsInBsdWdpbnMiLCJyZXBhaXIiLCJfdXNlU3RhdGUyIiwiX3NsaWNlZFRvQXJyYXkiLCJkb25lIiwic2V0RG9uZSIsIl91c2VTdGF0ZTMiLCJfdXNlU3RhdGU0Iiwicm91dGUiLCJzZXRSb3V0ZSIsIl91c2VTdGF0ZTUiLCJfdXNlU3RhdGU2IiwibW9kYWwiLCJzZXRNb2RhbCIsIl91c2VTdGF0ZTciLCJnaXZvbmkiLCJyaFByZXNldCIsInJoTG8iLCJyaEhpIiwidExvIiwidEhpIiwidGhlbWUiLCJkYXJrTGV2ZWwiLCJfdXNlU3RhdGU4IiwicHN5Q2ZnIiwic2V0UHN5Q2ZnIiwiX3VzZVN0YXRlOSIsInNpdGVOYW1lIiwiY2l0eSIsImxhdCIsImxvbiIsIl91c2VTdGF0ZTAiLCJsb2NDZmciLCJzZXRMb2NDZmciLCJfdXNlU3RhdGUxIiwidiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJhbGxvd2VkIiwiaW5kZXhPZiIsImxhbmciLCJlIiwiX3VzZVN0YXRlMTAiLCJsYW5nQ2ZnIiwic2V0TGFuZ0NmZyIsIl91c2VTdGF0ZTExIiwiZW5hYmxlZCIsIl91c2VTdGF0ZTEyIiwicGx1Z2luQ2ZnIiwic2V0UGx1Z2luQ2ZnIiwiY29tcGxldGVDb3VudCIsIk9iamVjdCIsInZhbHVlcyIsImZpbHRlciIsIkJvb2xlYW4iLCJsZW5ndGgiLCJmaW5pc2giLCJkIiwiX29iamVjdFNwcmVhZCIsImNyZWF0ZUVsZW1lbnQiLCJQc3lDaGFydFNldHRpbmdQYWdlIiwiY2ZnIiwic2V0Q2ZnIiwib25CYWNrIiwib25TYXZlIiwiY2xhc3NOYW1lIiwib25DbGljayIsInNldEl0ZW0iLCJzdHlsZSIsIndpZHRoIiwiYXNwZWN0UmF0aW8iLCJhbmltYXRpb25EZWxheSIsIm1hcCIsInMiLCJpIiwiYW5nbGVEZWciLCJhbmdsZSIsIk1hdGgiLCJQSSIsInIiLCJ4IiwiY29zIiwieSIsInNpbiIsIkNpcmNsZVRpbGUiLCJzdGVwIiwiaW5kZXgiLCJsZWZ0UGN0IiwidG9wUGN0Iiwid2luZG93Iiwib3BlbiIsInZpZXdCb3giLCJwcmVzZXJ2ZUFzcGVjdFJhdGlvIiwicG9pbnRzIiwiXyIsImEiLCJqb2luIiwiZmlsbCIsInN0cm9rZSIsInN0cm9rZVdpZHRoIiwic3Ryb2tlRGFzaGFycmF5IiwiY29uY2F0IiwiTG9jYXRpb25Nb2RhbCIsIm9uQ2xvc2UiLCJMYW5ndWFnZU1vZGFsIiwiUGx1Z2luc01vZGFsIiwiVGlsZSIsIl9yZWYiLCJiYWNrZ3JvdW5kIiwiYm9yZGVyIiwiVGlsZUljb24iLCJjb2xvciIsIl9yZWYyIiwicmluZ0NvbG9yIiwibGVmdCIsInRvcCIsInRyYW5zZm9ybSIsImJveFNoYWRvdyIsIl9yZWYzIiwic3Ryb2tlTGluZWNhcCIsInN0cm9rZUxpbmVqb2luIiwiX2V4dGVuZHMiLCJoZWlnaHQiLCJjeCIsImN5IiwiX3JlZjQiLCJ1cGRhdGUiLCJrIiwiYyIsInVzZUVmZmVjdCIsInJhdyIsInByZXNldCIsInBhdGNoIiwicCIsIkpTT04iLCJwYXJzZSIsIk51bWJlciIsImlzRmluaXRlIiwibG8iLCJoaSIsIlJIX1BSRVNFVFMiLCJmaW5kIiwiaWQiLCJ0aCIsImRsIiwicGFyc2VGbG9hdCIsInRyUmF3IiwidHIiLCJtaW4iLCJtYXgiLCJrZXlzIiwicGVyc2lzdEFuZFNhdmUiLCJzdHJpbmdpZnkiLCJTdHJpbmciLCJkaXNwYXRjaEV2ZW50IiwiQ3VzdG9tRXZlbnQiLCJkZXRhaWwiLCJjb25zb2xlIiwiaW5mbyIsIndhcm4iLCJQc3lTa2VsZXRvbiIsIlBzeUNvbnRyb2xQYW5lbCIsIm5vdGUiLCJfcmVmNSIsIlciLCJIIiwicGFkIiwicmlnaHQiLCJib3R0b20iLCJncmlkVyIsImdyaWRIIiwiVF9NSU4iLCJUX01BWCIsIldfTUlOIiwiV19NQVgiLCJ0IiwidyIsIl9nZXRXIiwiZ2V0VyIsInJoIiwic2FmZVB0cyIsImFyciIsInRvRml4ZWQiLCJyaDgwIiwicHVzaCIsInJoMTAwIiwicmgyMExpbmUiLCJyaDIwX0NaIiwiQ1oiLCJyaEhpX3RvcCIsInR0IiwicmhMb19ib3QiLCJTV0VFVCIsIk5WIiwiTWFzcyIsIk1DViIsIkVWQVAiLCJ3aW50ZXJSSDgwIiwid2ludGVyUkgyMCIsIldJTlRFUiIsImlzb3BsZXRocyIsImlzTGlnaHQiLCJwYWxldHRlIiwiYmciLCJncmlkIiwidGljayIsImF4aXMiLCJwYW5lbEJnIiwicGFuZWxCb3JkZXIiLCJwaWxsQmciLCJwaWxsRmciLCJtZXRhRmciLCJkaW1GaWx0ZXIiLCJib3JkZXJDb2xvciIsImJvcmRlclJhZGl1cyIsIkFycmF5IiwiZnJvbSIsIngxIiwieTEiLCJ4MiIsInkyIiwiZm9udFNpemUiLCJ0ZXh0QW5jaG9yIiwicHRzIiwid3ciLCJmbG9vciIsImZvbnRXZWlnaHQiLCJvcGFjaXR5IiwiZmlsbE9wYWNpdHkiLCJjbGlwUGF0aFVuaXRzIiwiY2xpcFBhdGgiLCJsZXR0ZXJTcGFjaW5nIiwicGFpbnRPcmRlciIsIl9yZWY2Iiwicm91bmQiLCJ0eXBlIiwidmFsdWUiLCJvbkNoYW5nZSIsInRhcmdldCIsImFjY2VudENvbG9yIiwiX25vcm1hbGl6ZUxvY3MiLCJzZWVuIiwiU2V0Iiwib3V0IiwibCIsIm5hbWUiLCJ0cmltIiwiaGFzIiwiYWRkIiwiX3JlZjciLCJtYXBCb3hSZWYiLCJ1c2VSZWYiLCJtYXBSZWYiLCJtYXJrZXJSZWYiLCJfUmVhY3QkdXNlU3RhdGUiLCJfUmVhY3QkdXNlU3RhdGUyIiwiZ2VvQnVzeSIsInNldEdlb0J1c3kiLCJfUmVhY3QkdXNlU3RhdGUzIiwiaXNBcnJheSIsIl9SZWFjdCR1c2VTdGF0ZTQiLCJzYXZlZExvY3MiLCJzZXRTYXZlZExvY3MiLCJjYW5jZWxsZWQiLCJfYXN5bmNUb0dlbmVyYXRvciIsImZldGNoIiwiY3JlZGVudGlhbHMiLCJjYWNoZSIsIm9rIiwiaiIsImpzb24iLCJzYXZlZCIsIl9SZWFjdCR1c2VTdGF0ZTUiLCJfUmVhY3QkdXNlU3RhdGU2Iiwic2F2ZWRPcGVuIiwic2V0U2F2ZWRPcGVuIiwic2F2ZWRSZWYiLCJvbkRvY0NsaWNrIiwiY3VycmVudCIsImNvbnRhaW5zIiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm9uU2l0ZU5hbWVDaGFuZ2UiLCJuZXdOYW1lIiwiaGl0Iiwic2V0VmlldyIsInBpY2tTYXZlZExvYyIsImxvYyIsIl9SZWFjdCR1c2VTdGF0ZTciLCJfUmVhY3QkdXNlU3RhdGU4Iiwic2VhcmNoUSIsInNldFNlYXJjaFEiLCJfUmVhY3QkdXNlU3RhdGU5IiwiX1JlYWN0JHVzZVN0YXRlMCIsInNlYXJjaEhpdHMiLCJzZXRTZWFyY2hIaXRzIiwiX1JlYWN0JHVzZVN0YXRlMSIsIl9SZWFjdCR1c2VTdGF0ZTEwIiwic2VhcmNoQnVzeSIsInNldFNlYXJjaEJ1c3kiLCJfUmVhY3QkdXNlU3RhdGUxMSIsIl9SZWFjdCR1c2VTdGF0ZTEyIiwic2VhcmNoT3BlbiIsInNldFNlYXJjaE9wZW4iLCJzZWFyY2hEZWJvdW5jZVJlZiIsInJ1blNlYXJjaCIsIl9yZWY5IiwicSIsInVybCIsImVuY29kZVVSSUNvbXBvbmVudCIsImhlYWRlcnMiLCJfeCIsImFwcGx5IiwiYXJndW1lbnRzIiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsInBpY2tTZWFyY2hIaXQiLCJkaXNwbGF5X25hbWUiLCJyZXZlcnNlR2VvY29kZSIsIl9yZWYwIiwiYWRkcmVzcyIsInRvd24iLCJ2aWxsYWdlIiwiaGFtbGV0IiwiY291bnR5IiwicmVnaW9uIiwic3RhdGUiLCJjb3VudHJ5IiwiX3gyIiwiX3gzIiwiTCIsInpvb21Db250cm9sIiwiYXR0cmlidXRpb25Db250cm9sIiwidGlsZUxheWVyIiwibWF4Wm9vbSIsImF0dHJpYnV0aW9uIiwiYWRkVG8iLCJtYXJrZXIiLCJkcmFnZ2FibGUiLCJiaW5kVG9vbHRpcCIsInBlcm1hbmVudCIsImFwcGx5TGF0TG9uIiwibiIsIm9uIiwibGwiLCJnZXRMYXRMbmciLCJsbmciLCJzZXRMYXRMbmciLCJsYXRsbmciLCJpbnZhbGlkYXRlU2l6ZSIsInJlbW92ZSIsInBhblRvIiwiX1JlYWN0JHVzZVN0YXRlMTMiLCJfUmVhY3QkdXNlU3RhdGUxNCIsImdlb1N0YXRlIiwic2V0R2VvU3RhdGUiLCJ1c2VNeUxvY2F0aW9uIiwibmF2aWdhdG9yIiwiZ2VvbG9jYXRpb24iLCJlcnIiLCJnZXRDdXJyZW50UG9zaXRpb24iLCJwb3MiLCJjb29yZHMiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsIm1zZyIsImNvZGUiLCJtZXNzYWdlIiwiZW5hYmxlSGlnaEFjY3VyYWN5IiwidGltZW91dCIsIm1heGltdW1BZ2UiLCJfUmVhY3QkdXNlU3RhdGUxNSIsIl9SZWFjdCR1c2VTdGF0ZTE2Iiwic2F2ZU1zZyIsInNldFNhdmVNc2ciLCJfcmVmMSIsImRlZHVwZWQiLCJuZXh0U2F2ZWQiLCJzbGljZSIsInBlcnNpc3RlZCIsIndhcm5pbmciLCJtZXRob2QiLCJib2R5IiwiYWN0aXZlIiwiZGVmYXVsdCIsIl9sYXN0V2VhdGhlckxvY2F0aW9uU2F2ZSIsIk1vZGFsU2hlbGwiLCJ0aXRsZSIsInN1YnRpdGxlIiwic2l6ZSIsIm1pbkhlaWdodCIsInJlZiIsIm92ZXJmbG93Iiwib25Gb2N1cyIsInBsYWNlaG9sZGVyIiwib3V0bGluZSIsImgiLCJwbGFjZV9pZCIsImNsYXNzIiwidHJhbnNpdGlvbiIsImlzQWN0aXZlIiwiZGlzYWJsZWQiLCJwcm90b2NvbCIsInoiLCJfcmVmMTAiLCJsYW5ncyIsIm5hdGl2ZSIsIkV2ZW50IiwiUExVR0lOX0NPTkZJR19GSUVMRFMiLCJ3ZWF0aGVyIiwib3B0aW9ucyIsImRlZiIsInN3ZWV0X3Nwb3QiLCJnMzYiLCJkaWJ0IiwibGlnaHRpbmciLCJfcmVmMTEiLCJBTEwiLCJkZXNjIiwidmVyIiwidG9nZ2xlIiwiaW5jbHVkZXMiLCJfUmVhY3QkdXNlU3RhdGUxNyIsIl9SZWFjdCR1c2VTdGF0ZTE4IiwiZXhwYW5kZWRJZCIsInNldEV4cGFuZGVkSWQiLCJ1cGRhdGVGaWVsZCIsInBsdWdpbklkIiwiZmllbGRLZXkiLCJmaWVsZHMiLCJmaWVsZFZhbCIsImZpZWxkIiwic3RvcmVkIiwidW5kZWZpbmVkIiwiZXhwYW5kZWQiLCJmIiwibyIsIm5leHQiLCJfcmVmMTIiLCJfcmVmMTIkYWNjZW50IiwiX3JlZjEyJHNpemUiLCJjaGlsZHJlbiIsImNvbG9yTWFwIiwiaW5kaWdvIiwiYW1iZXIiLCJlbWVyYWxkIiwicGluayIsInNpemVNYXAiLCJ3aWRlIiwic3RvcFByb3BhZ2F0aW9uIiwibWF4SGVpZ2h0IiwiUmVhY3RET00iLCJjcmVhdGVSb290IiwiZ2V0RWxlbWVudEJ5SWQiLCJyZW5kZXIiXSwic291cmNlcyI6WyIuLi9zcmMvc2V0dXAtd2Fsay9zZXR1cF93YWxrLmpzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB7IHVzZVN0YXRlLCB1c2VNZW1vIH0gPSBSZWFjdDtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogU1RFUCBERUZJTklUSU9OUyDigJQgdGhlIDQgd2FsayBwYXRocyB0aGUgdXNlciBkZXNjcmliZWRcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmNvbnN0IFNURVBTID0gW1xuICAgIC8qIFdhbGsgb3JkZXIgaXMgdGhlIHBlbnRhZ29uIHRyYXZlcnNhbDogdG9wIOKGkiB1cHBlci1yaWdodCDihpIgbG93ZXItcmlnaHQg4oaSIGxvd2VyLWxlZnQg4oaSIHVwcGVyLWxlZnQgKi9cbiAgICB7IGtleToncHN5JywgICAgICBsYWJlbDonUHN5IENoYXJ0IFNldHRpbmcnLCAgICBzdWI6J0dpdm9uaSDCtyBSSCByYW5nZSDCtyBheGlzJywgIGtpbmQ6J3BhZ2UnLCAgaWNvbkNvbG9yOicjODE4Y2Y4JywgYWNjZW50OidpbmRpZ28nIH0sXG4gICAgeyBrZXk6J2xvY2F0aW9uJywgbGFiZWw6J0xvY2F0aW9uIFNldHRpbmcnLCAgICAgc3ViOidDaXR5IMK3IGxhdCAvIGxvbmcnLCAgICAgICAgIGtpbmQ6J21vZGFsJywgaWNvbkNvbG9yOicjZmJiZjI0JywgYWNjZW50OidhbWJlcicgIH0sXG4gICAgeyBrZXk6J2xhbmd1YWdlJywgbGFiZWw6J0xhbmd1YWdlIFNldHRpbmcnLCAgICAgc3ViOidFTiDCtyBGUiDCtyBFUyDCtyBaSCDCtyDigKYnLCAgICAga2luZDonbW9kYWwnLCBpY29uQ29sb3I6JyMzNGQzOTknLCBhY2NlbnQ6J2VtZXJhbGQnfSxcbiAgICB7IGtleToncGx1Z2lucycsICBsYWJlbDonUGx1Zy1pbiBTZXR0aW5nJywgICAgICBzdWI6J0xpc3QgwrcgdXBsb2FkIMK3IG1vZGlmeScsICAgIGtpbmQ6J21vZGFsJywgaWNvbkNvbG9yOicjZjQ3MmI2JywgYWNjZW50OidwaW5rJyAgIH0sXG4gICAgLyogNXRoIHZlcnRleDogVXBkYXRlIC8gUmVwYWlyIC0tIGp1bXBzIHRvIC91cGRhdGUuaHRtbCAoUmVwYWlyIE1vZGUpIHdoaWNoIGV4aXN0cyBvblxuICAgICAgIGJvdGggVjEuOSBhbmQgVjIuMC4gIE9wZW5zIGluIGEgbmV3IHRhYiBzbyB0aGUgb3BlcmF0b3IgY2FuIGZsYXNoIGEgcGx1Z2luIG9yIGFwcGx5XG4gICAgICAgYW4gT1RBIHdpdGhvdXQgbG9zaW5nIHRoZWlyIFNldHVwIFdhbGsgcHJvZ3Jlc3MuICovXG4gICAgeyBrZXk6J3JlcGFpcicsICAgbGFiZWw6J1VwZGF0ZSAmIFJlcGFpcicsICAgICAgc3ViOidQbHVnLWluIGZsYXNoIMK3IGNvbnRyb2xsZXIgT1RBJywga2luZDonbGluaycsIGljb25Db2xvcjonI2ZiNzE4NScsIGFjY2VudDoncm9zZScsIGhyZWY6Jy91cGRhdGUuaHRtbCcgfSxcbl07XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFJPT1QgQVBQXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5mdW5jdGlvbiBBcHAoKSB7XG4gICAgLyogY29tcGxldGlvbiArIHBlci1zdGVwIGNvbmZpZyAtLSBtb2NrdXAgc3RhdGUsIG5ldmVyIHBlcnNpc3RlZCAqL1xuICAgIGNvbnN0IFtkb25lLCBzZXREb25lXSA9IHVzZVN0YXRlKHsgcHN5OmZhbHNlLCBsb2NhdGlvbjpmYWxzZSwgbGFuZ3VhZ2U6ZmFsc2UsIHBsdWdpbnM6ZmFsc2UsIHJlcGFpcjpmYWxzZSB9KTtcbiAgICBjb25zdCBbcm91dGUsIHNldFJvdXRlXSA9IHVzZVN0YXRlKCdodWInKTsgICAvLyAnaHViJyB8ICdwc3knXG4gICAgY29uc3QgW21vZGFsLCBzZXRNb2RhbF0gPSB1c2VTdGF0ZShudWxsKTsgICAgIC8vICdsb2NhdGlvbicgfCAnbGFuZ3VhZ2UnIHwgJ3BsdWdpbnMnIHwgbnVsbFxuXG4gICAgY29uc3QgW3BzeUNmZywgc2V0UHN5Q2ZnXSAgICAgICAgID0gdXNlU3RhdGUoeyBnaXZvbmk6dHJ1ZSwgcmhQcmVzZXQ6J29mZmljZScsIHJoTG86MzAsIHJoSGk6NjAsIHRMbzotMTUsIHRIaTo1MCwgdGhlbWU6J2RhcmsnLCBkYXJrTGV2ZWw6Mi4wIH0pO1xuICAgIGNvbnN0IFtsb2NDZmcsIHNldExvY0NmZ10gICAgICAgICA9IHVzZVN0YXRlKHsgc2l0ZU5hbWU6J015IEJ1aWxkaW5nJywgY2l0eTonVG9yb250bywgT04nLCBsYXQ6NDMuNjUzMiwgbG9uOi03OS4zODMyIH0pO1xuICAgIGNvbnN0IFtsYW5nQ2ZnLCBzZXRMYW5nQ2ZnXSAgICAgICA9IHVzZVN0YXRlKCgpID0+IHtcbiAgICAgICAgLyogTGF6eSBpbml0IGZyb20gdGhlIHNhbWUgbG9jYWxTdG9yYWdlIGtleSB0aGUgZGFzaGJvYXJkIHJlYWRzLCBzb1xuICAgICAgICAgKiByZW9wZW5pbmcgdGhlIHNldHVwIHdhbGsgc2hvd3MgdGhlIGN1cnJlbnRseS1hY3RpdmUgbGFuZ3VhZ2VcbiAgICAgICAgICogcmF0aGVyIHRoYW4gYWx3YXlzIGRlZmF1bHRpbmcgdG8gRW5nbGlzaC4gKi9cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHYgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnaTE4bl9sYW5nJyk7XG4gICAgICAgICAgICBjb25zdCBhbGxvd2VkID0gWydlbicsJ3poLUNOJywnemgtVFcnLCdqYScsJ2tvJ107XG4gICAgICAgICAgICBpZiAodiAmJiBhbGxvd2VkLmluZGV4T2YodikgIT09IC0xKSByZXR1cm4geyBsYW5nOiB2IH07XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogcHJpdmF0ZSBtb2RlIC0+IGZhbGwgdGhyb3VnaCAqLyB9XG4gICAgICAgIHJldHVybiB7IGxhbmc6J2VuJyB9O1xuICAgIH0pO1xuICAgIGNvbnN0IFtwbHVnaW5DZmcsIHNldFBsdWdpbkNmZ10gICA9IHVzZVN0YXRlKHsgZW5hYmxlZDpbJ3dlYXRoZXInLCdnaXZvbmknLCdzd2VldF9zcG90J10gfSk7XG5cbiAgICBjb25zdCBjb21wbGV0ZUNvdW50ID0gT2JqZWN0LnZhbHVlcyhkb25lKS5maWx0ZXIoQm9vbGVhbikubGVuZ3RoO1xuXG4gICAgY29uc3QgZmluaXNoID0gKGtleSkgPT4ge1xuICAgICAgICBzZXREb25lKGQgPT4gKHsuLi5kLCBba2V5XTp0cnVlfSkpO1xuICAgICAgICBzZXRSb3V0ZSgnaHViJyk7XG4gICAgICAgIHNldE1vZGFsKG51bGwpO1xuICAgIH07XG5cbiAgICAvKiBmdWxsLXBhZ2UgUHN5IENoYXJ0IGVkaXRvciAqL1xuICAgIGlmIChyb3V0ZSA9PT0gJ3BzeScpIHtcbiAgICAgICAgcmV0dXJuIDxQc3lDaGFydFNldHRpbmdQYWdlIGNmZz17cHN5Q2ZnfSBzZXRDZmc9e3NldFBzeUNmZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQmFjaz17KCkgPT4gc2V0Um91dGUoJ2h1YicpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXsoKSA9PiBmaW5pc2goJ3BzeScpfSAvPjtcbiAgICB9XG5cbiAgICAvKiBkZWZhdWx0OiBIVUIgc2NyZWVuICovXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtaW4taC1zY3JlZW4gcHgtNiBweS04XCI+XG4gICAgICAgICAgICB7LyogLS0tLS0tLS0tLS0tLSBoZWFkZXIgLS0tLS0tLS0tLS0tLSAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctNXhsIG14LWF1dG8gZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIG1iLTEwIGZhZGUtdXBcIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwidGV4dC0yeGwgc206dGV4dC0zeGwgZm9udC1ibGFjayBpdGFsaWMgdXBwZXJjYXNlIHRyYWNraW5nLXRpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXJlZC01MDBcIj5SZWQ1PC9zcGFuPiA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlXCI+U3R1ZGlvPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgZm9udC1ub3JtYWwgaXRhbGljXCI+ICZuYnNwOy8mbmJzcDsgc2V0dXAgd2Fsazwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9oMT5cbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgdGV4dC14cyBtdC0xIGZvbnQtbW9ubyB0cmFja2luZy13aWRlXCI+Q29uZmlndXJlIG9uY2UuIFNraXAgYW55IHN0ZXAgeW91IGRvbid0IG5lZWQuPC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTRcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicGlsbCBiZy1zbGF0ZS04MDAgdGV4dC1zbGF0ZS00MDBcIj57Y29tcGxldGVDb3VudH0vNSBET05FPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiL2Rhc2hib2FyZC5odG1sXCJcbiAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4geyB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS5zZXR1cC5kb25lJywnMScpOyB9IGNhdGNoKGUpe30gfX1cbiAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXNsYXRlLTUwMCBob3Zlcjp0ZXh0LXNsYXRlLTMwMCB1bmRlcmxpbmUgdW5kZXJsaW5lLW9mZnNldC00XCI+U2tpcCBhbGwg4oaSPC9hPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiAtLS0tLS0tLS0tLS0tIHBlbnRhZ29uIGxheW91dCAtLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgNSBjaXJjdWxhciB0aWxlcyBhcnJhbmdlZCBhdCB0aGUgY29ybmVycyBvZiBhIHJlZ3VsYXJcbiAgICAgICAgICAgICAgICBwZW50YWdvbi4gIFBvbGFyIG1hdGhzOiBhbmdsZSBzdGFydHMgYXQgLTkwZGVnICh0b3ApIGFuZFxuICAgICAgICAgICAgICAgIHN0ZXBzIGJ5ICs3MmRlZyBjbG9ja3dpc2UuICBUaGUgY29udGFpbmVyIGlzIGhlaWdodC1sb2NrZWRcbiAgICAgICAgICAgICAgICB2aWEgYXNwZWN0IHJhdGlvIHNvIHRoZSBwZW50YWdvbiBzdGF5cyBjaXJjdWxhciBvbiBldmVyeVxuICAgICAgICAgICAgICAgIHZpZXdwb3J0LiAgUmFkaXVzIGlzIDM4ICUgb2YgdGhlIGNvbnRhaW5lciB3aWR0aCAobGVhdmVzXG4gICAgICAgICAgICAgICAgZW5vdWdoIG1hcmdpbiBmb3IgY2lyY2xlcycgb3duIH4yMiAlIHJhZGl1cyArIHNoYWRvdykuICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBteC1hdXRvIGZhZGUtdXBcIlxuICAgICAgICAgICAgICAgICBzdHlsZT17eyB3aWR0aDonbWluKDY0MHB4LCA4OHZ3KScsIGFzcGVjdFJhdGlvOicxIC8gMScsIGFuaW1hdGlvbkRlbGF5OicuMDhzJyB9fT5cbiAgICAgICAgICAgICAgICB7U1RFUFMubWFwKChzLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFuZ2xlRGVnID0gLTkwICsgaSAqIDcyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmdsZSA9IGFuZ2xlRGVnICogTWF0aC5QSSAvIDE4MDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgciA9IDM4OyAgICAgICAgICAgICAgICAgICAgICAgIC8vICUgb2YgY29udGFpbmVyIGhhbGYtc2lkZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4ID0gNTAgKyByICogTWF0aC5jb3MoYW5nbGUpOyAgLy8gJVxuICAgICAgICAgICAgICAgICAgICBjb25zdCB5ID0gNTAgKyByICogTWF0aC5zaW4oYW5nbGUpOyAgLy8gJVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPENpcmNsZVRpbGUga2V5PXtzLmtleX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXA9e3N9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lPXtkb25lW3Mua2V5XX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4PXtpKzF9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0UGN0PXt4fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wUGN0PXt5fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzLmtpbmQgPT09ICdwYWdlJykgICAgICBzZXRSb3V0ZShzLmtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocy5raW5kID09PSAnbGluaycpIHdpbmRvdy5vcGVuKHMuaHJlZiwgJ19ibGFuaycsICdub29wZW5lcicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgICAgICAgICAgICAgICAgICAgICAgICBzZXRNb2RhbChzLmtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSAvPlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIHsvKiBPcHRpb25hbCBmYWludCBwZW50YWdvbi1lZGdlIGNvbm5lY3RvciAocHVyZWx5IGRlY29yYXRpdmUpICovfVxuICAgICAgICAgICAgICAgIDxzdmcgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMCB3LWZ1bGwgaC1mdWxsIHBvaW50ZXItZXZlbnRzLW5vbmVcIlxuICAgICAgICAgICAgICAgICAgICAgdmlld0JveD1cIjAgMCAxMDAgMTAwXCIgcHJlc2VydmVBc3BlY3RSYXRpbz1cIm5vbmVcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICAgICAgICAgICAgICAgICAgPHBvbHlnb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cz17U1RFUFMubWFwKChfLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYSA9ICgtOTAgKyBpICogNzIpICogTWF0aC5QSSAvIDE4MDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDUwICsgMzgqTWF0aC5jb3MoYSkpICsgJywnICsgKDUwICsgMzgqTWF0aC5zaW4oYSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkuam9pbignICcpfVxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwicmdiYSgxNDgsMTYzLDE4NCwwLjEwKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJva2VXaWR0aD1cIjAuMThcIlxuICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlRGFzaGFycmF5PVwiMC44IDAuOFwiIC8+XG4gICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIC0tLS0tLS0tLS0tLS0gZm9vdGVyIENUQSAtLS0tLS0tLS0tLS0tICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXgtdy01eGwgbXgtYXV0byBtdC0xMCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gZmFkZS11cFwiIHN0eWxlPXt7YW5pbWF0aW9uRGVsYXk6Jy4xOHMnfX0+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgdGV4dC14cyBmb250LW1vbm9cIj5cbiAgICAgICAgICAgICAgICAgICAge2NvbXBsZXRlQ291bnQgPT09IDAgJiYgJ+KGkSBQaWNrIGEgc2V0dGluZyB0byBzdGFydCwgb3Igc2tpcCBhbGwgYW5kIGdvIHN0cmFpZ2h0IHRvIHRoZSBkYXNoYm9hcmQuJ31cbiAgICAgICAgICAgICAgICAgICAge2NvbXBsZXRlQ291bnQgPiAwICYmIGNvbXBsZXRlQ291bnQgPCA1ICYmIGDihpEgJHs1IC0gY29tcGxldGVDb3VudH0gc3RlcCR7NSAtIGNvbXBsZXRlQ291bnQgPT09IDEgPyAnJyA6ICdzJ30gcmVtYWluaW5nIChvcHRpb25hbCkuYH1cbiAgICAgICAgICAgICAgICAgICAge2NvbXBsZXRlQ291bnQgPT09IDUgJiYgJ+KckyBBbGwgc3RlcHMgY29uZmlndXJlZC4gIFJlYWR5IHdoZW4geW91IGFyZS4nfVxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiL2Rhc2hib2FyZC5odG1sXCJcbiAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7IHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1LnNldHVwLmRvbmUnLCcxJyk7IH0gY2F0Y2goZSl7fSB9fVxuICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTcgcHktMyByb3VuZGVkLXhsIHRleHQtc20gZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2NvbXBsZXRlQ291bnQgPT09IDVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1lbWVyYWxkLTYwMCBob3ZlcjpiZy1lbWVyYWxkLTUwMCB0ZXh0LXdoaXRlIHNoYWRvdy1sZyBzaGFkb3ctZW1lcmFsZC01MDAvMzAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctaW5kaWdvLTYwMCBob3ZlcjpiZy1pbmRpZ28tNTAwIHRleHQtd2hpdGUgc2hhZG93LWxnIHNoYWRvdy1pbmRpZ28tNTAwLzIwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgT3BlbiBEYXNoYm9hcmQg4oaSXG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiAtLS0tLS0tLS0tLS0tIG1vZGFscyAtLS0tLS0tLS0tLS0tICovfVxuICAgICAgICAgICAge21vZGFsID09PSAnbG9jYXRpb24nICYmIDxMb2NhdGlvbk1vZGFsIGNmZz17bG9jQ2ZnfSBzZXRDZmc9e3NldExvY0NmZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldE1vZGFsKG51bGwpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXsoKSA9PiBmaW5pc2goJ2xvY2F0aW9uJyl9IC8+fVxuICAgICAgICAgICAge21vZGFsID09PSAnbGFuZ3VhZ2UnICYmIDxMYW5ndWFnZU1vZGFsIGNmZz17bGFuZ0NmZ30gc2V0Q2ZnPXtzZXRMYW5nQ2ZnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0TW9kYWwobnVsbCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNhdmU9eygpID0+IGZpbmlzaCgnbGFuZ3VhZ2UnKX0gLz59XG4gICAgICAgICAgICB7bW9kYWwgPT09ICdwbHVnaW5zJyAgJiYgPFBsdWdpbnNNb2RhbCAgY2ZnPXtwbHVnaW5DZmd9IHNldENmZz17c2V0UGx1Z2luQ2ZnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0TW9kYWwobnVsbCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNhdmU9eygpID0+IGZpbmlzaCgncGx1Z2lucycpfSAvPn1cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogVGlsZSAobGFyZ2UgZWFzeS1vbi1leWVzIGJ1dHRvbikgLS0ga2VwdCBmb3IgYmFjay1jb21wYXQsIG5vIGxvbmdlciB1c2VkXG4gKiBieSB0aGUgcGVudGFnb24gaHViLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuZnVuY3Rpb24gVGlsZSh7IHN0ZXAsIGRvbmUsIGluZGV4LCBvbkNsaWNrIH0pIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BzZXR1cC10aWxlLSR7c3RlcC5rZXl9YH1cbiAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtgT3BlbiAke3N0ZXAubGFiZWx9YH1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B0aWxlLWJ0biByZWxhdGl2ZSB0ZXh0LWxlZnQgYmctc2xhdGUtOTAwLzcwIGJvcmRlci0yIGJvcmRlci1zbGF0ZS03MDAvNzBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3VuZGVkLTJ4bCBwLTYgc206cC03ICR7ZG9uZSA/ICdkb25lJyA6ICcnfWB9PlxuICAgICAgICAgICAge2RvbmUgJiYgPHNwYW4gY2xhc3NOYW1lPVwiY2hlY2tcIiBkYXRhLXRlc3RpZD17YHNldHVwLXRpbGUtJHtzdGVwLmtleX0tZG9uZWB9PuKckzwvc3Bhbj59XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC00IG1iLTNcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctMTIgaC0xMiByb3VuZGVkLXhsIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyXCJcbiAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7YmFja2dyb3VuZDpgJHtzdGVwLmljb25Db2xvcn0yMmAsIGJvcmRlcjpgMXB4IHNvbGlkICR7c3RlcC5pY29uQ29sb3J9NTVgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxUaWxlSWNvbiBraW5kPXtzdGVwLmtleX0gY29sb3I9e3N0ZXAuaWNvbkNvbG9yfSAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC0zeGwgZm9udC1ibGFjayB0ZXh0LXNsYXRlLTcwMFwiPjB7aW5kZXh9PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LWxnIHNtOnRleHQteGwgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXIgbWItMVwiXG4gICAgICAgICAgICAgICAgc3R5bGU9e3tjb2xvcjpzdGVwLmljb25Db2xvcn19PntzdGVwLmxhYmVsfTwvaDM+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTQwMCB0ZXh0LXNtIGxlYWRpbmctc251Z1wiPntzdGVwLnN1Yn08L3A+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTQgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgdGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJvbGQgdGV4dC1zbGF0ZS01MDBcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJwaWxsIGJnLXNsYXRlLTgwMCB0ZXh0LXNsYXRlLTQwMFwiPntzdGVwLmtpbmQgPT09ICdwYWdlJyA/ICdGdWxsIHBhZ2UnIDogJ1BvcHVwJ308L3NwYW4+XG4gICAgICAgICAgICAgICAge2RvbmUgJiYgPHNwYW4gY2xhc3NOYW1lPVwicGlsbCBiZy1lbWVyYWxkLTkwMC80MCB0ZXh0LWVtZXJhbGQtNDAwXCI+Q29uZmlndXJlZDwvc3Bhbj59XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ2lyY2xlVGlsZSAtLSBwZW50YWdvbi1jb3JuZXIgcm91bmQgYnV0dG9uLiAgU2l6ZWQgaW4gJSBvZiBpdHMgY29udGFpbmVyXG4gKiBzbyB0aGUgd2hvbGUgbGF5b3V0IHNjYWxlcyB3aXRoIHZpZXdwb3J0LiAgRWFjaCBjaXJjbGUgaXMgYW5jaG9yZWQgYnkgaXRzXG4gKiBjZW50cmUgKHRyYW5zbGF0ZSAtNTAlLy01MCUpIG9uIHRoZSBwb2xhci1jb21wdXRlZCAobGVmdCUsIHRvcCUpLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuZnVuY3Rpb24gQ2lyY2xlVGlsZSh7IHN0ZXAsIGRvbmUsIGluZGV4LCBsZWZ0UGN0LCB0b3BQY3QsIG9uQ2xpY2sgfSkge1xuICAgIC8qIFRoaWNrIGNvbG91cmVkIHJpbmcgcGVyIHRpbGUgLS0gZWFjaCBzdGVwIGtlZXBzIGl0cyBhY2NlbnQgY29sb3VyXG4gICAgICogKGluZGlnby9hbWJlci9lbWVyYWxkL3Bpbmsvcm9zZSksIHJlaW5mb3JjaW5nIHRoZSBjb2xvdXItY29kZWQgU1ZHXG4gICAgICogaWNvbiBhbmQgdGhlIGhlYWRpbmcgdGV4dC4gKi9cbiAgICBjb25zdCByaW5nQ29sb3IgPSBzdGVwLmljb25Db2xvcjtcbiAgICByZXR1cm4gKFxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BzZXR1cC10aWxlLSR7c3RlcC5rZXl9YH1cbiAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtgT3BlbiAke3N0ZXAubGFiZWx9YH1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BjaXJjbGUtdGlsZSBncm91cCBhYnNvbHV0ZSByb3VuZGVkLWZ1bGwgdGV4dC1jZW50ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb24tYWxsIGR1cmF0aW9uLTIwMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7ZG9uZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1zbGF0ZS05MDAvODAgc2hhZG93LVswXzBfMzBweF8tNnB4X3JnYmEoMTYsMTg1LDEyOSwwLjU1KV0nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLXNsYXRlLTkwMC83MCBob3ZlcjpiZy1zbGF0ZS04MDAvOTAnfWB9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgbGVmdDpgJHtsZWZ0UGN0fSVgLCB0b3A6YCR7dG9wUGN0fSVgLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDonbWluKDIyJSwgMTY4cHgpJywgYXNwZWN0UmF0aW86JzEvMScsXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybTondHJhbnNsYXRlKC01MCUsIC01MCUpJyxcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyOmA2cHggc29saWQgJHtyaW5nQ29sb3J9YCxcbiAgICAgICAgICAgICAgICAgICAgYm94U2hhZG93OmAwIDAgMCAxcHggJHtyaW5nQ29sb3J9MzMsIDAgOHB4IDI4cHggLThweCAke3JpbmdDb2xvcn01NWAsXG4gICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICB7ZG9uZSAmJiAoXG4gICAgICAgICAgICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9e2BzZXR1cC10aWxlLSR7c3RlcC5rZXl9LWRvbmVgfVxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIC10b3AtMSAtcmlnaHQtMSB3LTYgaC02IHJvdW5kZWQtZnVsbCBiZy1lbWVyYWxkLTUwMCB0ZXh0LXdoaXRlIHRleHQteHMgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgZm9udC1ib2xkIHNoYWRvd1wiPlxuICAgICAgICAgICAgICAgICAgICDinJNcbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3VuZGVkLXhsIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIG1iLTFcIlxuICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDonMzQlJywgYXNwZWN0UmF0aW86JzEvMScsXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6YCR7c3RlcC5pY29uQ29sb3J9MjJgLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6YDFweCBzb2xpZCAke3N0ZXAuaWNvbkNvbG9yfTU1YCxcbiAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgPFRpbGVJY29uIGtpbmQ9e3N0ZXAua2V5fSBjb2xvcj17c3RlcC5pY29uQ29sb3J9IC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1ibGFjayB0ZXh0LXNsYXRlLTYwMCB0cmFja2luZy13aWRlclwiPjB7aW5kZXh9PC9kaXY+XG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1bMTFweF0gc206dGV4dC1bMTJweF0gZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXIgcHgtMiBsZWFkaW5nLXRpZ2h0IG10LTAuNVwiXG4gICAgICAgICAgICAgICAgc3R5bGU9e3tjb2xvcjpzdGVwLmljb25Db2xvcn19PlxuICAgICAgICAgICAgICAgIHtzdGVwLmxhYmVsfVxuICAgICAgICAgICAgPC9oMz5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNTAwIHRleHQtWzlweF0gc206dGV4dC1bMTBweF0gbGVhZGluZy1zbnVnIHB4LTIgbXQtMC41IGxpbmUtY2xhbXAtMlwiPlxuICAgICAgICAgICAgICAgIHtzdGVwLnN1Yn1cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9idXR0b24+XG4gICAgKTtcbn1cblxuZnVuY3Rpb24gVGlsZUljb24oeyBraW5kLCBjb2xvciB9KSB7XG4gICAgLyogc2ltcGxlIGlubGluZSBTVkdzIHNvIHdlIGtlZXAgdGhlIGZpbGUgc2VsZi1jb250YWluZWQgKi9cbiAgICBjb25zdCBzdHJva2UgPSB7IHN0cm9rZTpjb2xvciwgZmlsbDonbm9uZScsIHN0cm9rZVdpZHRoOjIsIHN0cm9rZUxpbmVjYXA6J3JvdW5kJywgc3Ryb2tlTGluZWpvaW46J3JvdW5kJyB9O1xuICAgIGlmIChraW5kID09PSAncHN5JykgICAgICByZXR1cm4gPHN2ZyB3aWR0aD1cIjIyXCIgaGVpZ2h0PVwiMjJcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgey4uLnN0cm9rZX0+PHBhdGggZD1cIk0zIDN2MThoMThcIi8+PHBhdGggZD1cIk0zIDE3YzQtMSA3LTYgOS05czUtMyA5LTJcIi8+PC9zdmc+O1xuICAgIGlmIChraW5kID09PSAnbG9jYXRpb24nKSByZXR1cm4gPHN2ZyB3aWR0aD1cIjIyXCIgaGVpZ2h0PVwiMjJcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgey4uLnN0cm9rZX0+PHBhdGggZD1cIk0xMiAyMnMtNy02LjQtNy0xMmE3IDcgMCAxIDEgMTQgMGMwIDUuNi03IDEyLTcgMTJ6XCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTBcIiByPVwiMi41XCIvPjwvc3ZnPjtcbiAgICBpZiAoa2luZCA9PT0gJ2xhbmd1YWdlJykgcmV0dXJuIDxzdmcgd2lkdGg9XCIyMlwiIGhlaWdodD1cIjIyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHsuLi5zdHJva2V9PjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiOVwiLz48cGF0aCBkPVwiTTMgMTJoMThNMTIgM2ExNCAxNCAwIDAgMSAwIDE4TTEyIDNhMTQgMTQgMCAwIDAgMCAxOFwiLz48L3N2Zz47XG4gICAgaWYgKGtpbmQgPT09ICdwbHVnaW5zJykgIHJldHVybiA8c3ZnIHdpZHRoPVwiMjJcIiBoZWlnaHQ9XCIyMlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB7Li4uc3Ryb2tlfT48cGF0aCBkPVwiTTkgM3Y2TTE1IDN2NlwiLz48cGF0aCBkPVwiTTUgOWgxNHY2YTQgNCAwIDAgMS00IDRoLTF2M005IDE5djNcIi8+PC9zdmc+O1xuICAgIC8qIFVwZGF0ZSAmIFJlcGFpciAtLSB3cmVuY2ggKyB0aW55IGdlYXIgYnVtcCwgc2lnbmFsbGluZyBcInRvb2xzXCIgKi9cbiAgICBpZiAoa2luZCA9PT0gJ3JlcGFpcicpICAgcmV0dXJuIDxzdmcgd2lkdGg9XCIyMlwiIGhlaWdodD1cIjIyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHsuLi5zdHJva2V9PjxwYXRoIGQ9XCJNMTQuNyA2LjNhNCA0IDAgMCAwLTUuNCA1LjRMMyAxOGwzIDMgNi4zLTYuM2E0IDQgMCAwIDAgNS40LTUuNGwtMi44IDIuOEwxMyAxMWwtMS4xLTEuOSAyLjgtMi44elwiLz48L3N2Zz47XG4gICAgcmV0dXJuIG51bGw7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFBzeSBDaGFydCBTZXR0aW5nIC0tIEZVTEwgUEFHRSwgbGl2ZSBza2VsZXRvbiByZXNwb25kcyB0byBjb250cm9sc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuZnVuY3Rpb24gUHN5Q2hhcnRTZXR0aW5nUGFnZSh7IGNmZywgc2V0Q2ZnLCBvbkJhY2ssIG9uU2F2ZSB9KSB7XG4gICAgY29uc3QgdXBkYXRlID0gKGssIHYpID0+IHNldENmZyhjID0+ICh7Li4uYywgW2tdOnZ9KSk7XG5cbiAgICAvKiBPbiBtb3VudDogaHlkcmF0ZSBmcm9tIHRoZSBTQU1FIGxvY2FsU3RvcmFnZSBrZXkgdGhlIGRhc2hib2FyZCByZWFkc1xuICAgICAqIChgcmVkNV9zd2VldF9zcG90X3JhbmdlYCkgcGx1cyB0aGUgcHJlc2V0IGlkIChgcmVkNV9yaF9wcmVzZXRgKSBzb1xuICAgICAqIHRoZSBkcm9wZG93biBsYWJlbCBzdGF5cyBjb25zaXN0ZW50IHdpdGggdGhlIHNsaWRlciB2YWx1ZXMgYWNyb3NzXG4gICAgICogcmVsb2Fkcy4gIElmIHRoZSBvcGVyYXRvciBoYXMgYWxyZWFkeSB0dW5lZCB0aGUgUkggYmFuZCBvbiB0aGVcbiAgICAgKiBkYXNoYm9hcmQsIHRoZSBzZXR1cCB3YWxrIHN0YXJ0cyBmcm9tIHRob3NlIHZhbHVlcy4gKi9cbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmF3ICAgID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlZDVfc3dlZXRfc3BvdF9yYW5nZScpO1xuICAgICAgICAgICAgY29uc3QgcHJlc2V0ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlZDVfcmhfcHJlc2V0Jyk7XG4gICAgICAgICAgICBjb25zdCBwYXRjaCAgPSB7fTtcbiAgICAgICAgICAgIGlmIChyYXcpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwID0gSlNPTi5wYXJzZShyYXcpO1xuICAgICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUocC5sbykgJiYgTnVtYmVyLmlzRmluaXRlKHAuaGkpICYmIHAubG8gPCBwLmhpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhdGNoLnJoTG8gPSBwLmxvO1xuICAgICAgICAgICAgICAgICAgICBwYXRjaC5yaEhpID0gcC5oaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJlc2V0ICYmIFJIX1BSRVNFVFMuZmluZCh4ID0+IHguaWQgPT09IHByZXNldCkpIHtcbiAgICAgICAgICAgICAgICBwYXRjaC5yaFByZXNldCA9IHByZXNldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIFRoZW1lICsgYnJpZ2h0bmVzcyDigJQgc2FtZSBrZXlzIGFwcC5qcyAoZGFzaGJvYXJkKSByZWFkcy4gKi9cbiAgICAgICAgICAgIGNvbnN0IHRoID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlZDUudGhlbWUnKTtcbiAgICAgICAgICAgIGlmICh0aCA9PT0gJ2xpZ2h0JyB8fCB0aCA9PT0gJ2RhcmsnKSBwYXRjaC50aGVtZSA9IHRoO1xuICAgICAgICAgICAgY29uc3QgZGwgPSBwYXJzZUZsb2F0KGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWQ1LmRhcmtMZXZlbCcpKTtcbiAgICAgICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUoZGwpICYmIGRsID49IDEuNSAmJiBkbCA8PSAzLjApIHBhdGNoLmRhcmtMZXZlbCA9IGRsO1xuICAgICAgICAgICAgLyogVGVtcGVyYXR1cmUgYXhpcyByYW5nZSDigJQgd3JpdHRlbiBieSB0aGlzIHNhbWUgcGFnZSdzIHNhdmVcbiAgICAgICAgICAgICAqIGhhbmRsZXI7IGxvYWQgaXQgaGVyZSBzbyByZW9wZW5pbmcgdGhlIHNldHVwIHdhbGsgc2hvd3MgdGhlXG4gICAgICAgICAgICAgKiBjdXJyZW50IGRhc2hib2FyZCBheGlzIGluc3RlYWQgb2YgYWx3YXlzIGRlZmF1bHRpbmcgdG8gLTE1Li41MC4gKi9cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdHJSYXcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVkNV90ZW1wX3JhbmdlJyk7XG4gICAgICAgICAgICAgICAgaWYgKHRyUmF3KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRyID0gSlNPTi5wYXJzZSh0clJhdyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUodHIubWluKSAmJiBOdW1iZXIuaXNGaW5pdGUodHIubWF4KSAmJiB0ci5taW4gPCB0ci5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGNoLnRMbyA9IHRyLm1pbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGNoLnRIaSA9IHRyLm1heDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogaWdub3JlICovIH1cbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhwYXRjaCkubGVuZ3RoKSBzZXRDZmcoYyA9PiAoey4uLmMsIC4uLnBhdGNofSkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IC8qIGlnbm9yZSAqLyB9XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xuICAgIH0sIFtdKTtcblxuICAgIC8qIE9uIHNhdmU6IHBlcnNpc3QgdGhlIFJIIGJhbmQgdG8gbG9jYWxTdG9yYWdlIHNvIHRoZSBkYXNoYm9hcmQnc1xuICAgICAqIHN3ZWV0LXNwb3QgcG9seWdvbiBwaWNrcyBpdCB1cCBvbiBuZXh0IGxvYWQuICBBbHNvIHBlcnNpc3QgdGhlIHZlbnVlXG4gICAgICogcHJlc2V0IGlkIChmb3IgZnV0dXJlIFwic2hvdyBwcmVzZXQgbmFtZSBvbiBkYXNoYm9hcmRcIiBmZWF0dXJlcykuICovXG4gICAgY29uc3QgcGVyc2lzdEFuZFNhdmUgPSAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNV9zd2VldF9zcG90X3JhbmdlJyxcbiAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh7IGxvOiBjZmcucmhMbywgaGk6IGNmZy5yaEhpIH0pKTtcbiAgICAgICAgICAgIGlmIChjZmcucmhQcmVzZXQpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNV9yaF9wcmVzZXQnLCBjZmcucmhQcmVzZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogVGhlbWUgKyBicmlnaHRuZXNzIOKAlCB3cml0dGVuIHRvIHRoZSBTQU1FIGtleXMgdGhlIGRhc2hib2FyZFxuICAgICAgICAgICAgICogKGFwcC5qcyBsaW5lcyA1Ny01OCBhbmQgODQtOTcpIHJlYWRzIGFzIGl0cyB1c2VTdGF0ZSBsYXp5XG4gICAgICAgICAgICAgKiBpbml0aWFsaXNlciwgc28gdGhlIGNob3NlbiB0aGVtZSB0YWtlcyBlZmZlY3Qgb24gbmV4dCBkYXNoYm9hcmRcbiAgICAgICAgICAgICAqIGxvYWQuICBhcHAuanMgdHJlYXRzIGRhcmtMZXZlbCA+PSAzLjAgYXMgbGlnaHQtbW9kZSB0cmlnZ2VyLiAqL1xuICAgICAgICAgICAgaWYgKGNmZy50aGVtZSA9PT0gJ2xpZ2h0JyB8fCBjZmcudGhlbWUgPT09ICdkYXJrJykge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1LnRoZW1lJywgY2ZnLnRoZW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUoY2ZnLmRhcmtMZXZlbCkpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS5kYXJrTGV2ZWwnLCBTdHJpbmcoY2ZnLmRhcmtMZXZlbCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogVGVtcGVyYXR1cmUgYXhpcyByYW5nZSDigJQgZHJpdmVzIHRoZSBkYXNoYm9hcmQncyBwc3kgY2hhcnRcbiAgICAgICAgICAgICAqIFggYXhpcyAoYHRlbXBSYW5nZS5taW4vbWF4YCBpbiBhcHAuanMpLiAgV2Ugd3JpdGUgdGhlIHNhbWVcbiAgICAgICAgICAgICAqIHNoYXBlIGFwcC5qcyByZWFkcyAoYHttaW4sIG1heH1gKSBzbyBpdHMgbGF6eSB1c2VTdGF0ZSBpbml0XG4gICAgICAgICAgICAgKiBwaWNrcyBpdCB1cCBvbiBuZXh0IGxvYWQsIEFORCBkaXNwYXRjaCBhIGN1c3RvbSBldmVudCBzb1xuICAgICAgICAgICAgICogYW55IG9wZW4gZGFzaGJvYXJkIHRhYiB1cGRhdGVzIGxpdmUgd2l0aG91dCBhIHJlZnJlc2guICovXG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGNmZy50TG8pICYmIE51bWJlci5pc0Zpbml0ZShjZmcudEhpKSAmJiBjZmcudExvIDwgY2ZnLnRIaSkge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1X3RlbXBfcmFuZ2UnLFxuICAgICAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh7IG1pbjogY2ZnLnRMbywgbWF4OiBjZmcudEhpIH0pKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3I1LXRlbXAtcmFuZ2UtY2hhbmdlJywge1xuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHsgbWluOiBjZmcudExvLCBtYXg6IGNmZy50SGkgfVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncjUtcmgtYmFuZC1jaGFuZ2UnLCB7XG4gICAgICAgICAgICAgICAgZGV0YWlsOiB7IGxvOiBjZmcucmhMbywgaGk6IGNmZy5yaEhpIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnW3NldHVwIHdhbGtdIHBzeSBjaGFydCBzYXZlZCAtPiBSSCcsIGNmZy5yaExvLCAnLScsIGNmZy5yaEhpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICclIFQtYXhpcycsIGNmZy50TG8sICcuLicsIGNmZy50SGksICfCsEMgcHJlc2V0PScsIGNmZy5yaFByZXNldCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignW3NldHVwIHdhbGtdIGNvdWxkIG5vdCBwZXJzaXN0IHBzeSBzZXR0aW5nczonLCBlKTtcbiAgICAgICAgfVxuICAgICAgICBvblNhdmUoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtaW4taC1zY3JlZW4gZmxleCBmbGV4LWNvbFwiPlxuICAgICAgICAgICAgey8qIGhlYWRlciAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHB4LTYgcHktNCBib3JkZXItYiBib3JkZXItc2xhdGUtODAwXCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkJhY2t9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTQwMCBob3Zlcjp0ZXh0LXdoaXRlIHRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrXCI+XG4gICAgICAgICAgICAgICAgICAgIOKGkCBCYWNrIHRvIHNldHVwXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cInRleHQtc20gdXBwZXJjYXNlIHRyYWNraW5nLVswLjNlbV0gZm9udC1ibGFjayB0ZXh0LWluZGlnby00MDBcIj5Qc3kgQ2hhcnQgU2V0dGluZzwvaDE+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtwZXJzaXN0QW5kU2F2ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTUgcHktMiByb3VuZGVkLWxnIGJnLWluZGlnby02MDAgaG92ZXI6YmctaW5kaWdvLTUwMCB0ZXh0LXdoaXRlIHRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrXCI+XG4gICAgICAgICAgICAgICAgICAgIFNhdmUgJiByZXR1cm4g4pyTXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIGJvZHkg4oCUIGNoYXJ0IGxlZnQsIGNvbnRyb2xzIHJpZ2h0ICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTEgZ3JpZCBncmlkLWNvbHMtMSBsZzpncmlkLWNvbHMtWzFmcl8zNjBweF0gZ2FwLTQgcC02IG1heC13LTd4bCBteC1hdXRvIHctZnVsbFwiPlxuICAgICAgICAgICAgICAgIDxQc3lTa2VsZXRvbiBjZmc9e2NmZ30gLz5cbiAgICAgICAgICAgICAgICA8UHN5Q29udHJvbFBhbmVsIGNmZz17Y2ZnfSB1cGRhdGU9e3VwZGF0ZX0gc2V0Q2ZnPXtzZXRDZmd9IC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuLyogUkggYmFuZCBwcmVzZXRzIOKAlCByZWNvZ25pc2VkIGluZHVzdHJ5IHN0YW5kYXJkcyBmb3IgZWFjaCB2ZW51ZSB0eXBlLlxuICogU291cmNlczogQVNIUkFFIDU1IChjb21mb3J0KSwgQVNIUkFFIDE3MCAoaGVhbHRoY2FyZSksXG4gKiBBQU0vTlBTL1NtaXRoc29uaWFuIGd1aWRhbmNlIChjb2xsZWN0aW9ucyksIENJQlNFIFRNNDAgKGxpYnJhcmllcykuICovXG5jb25zdCBSSF9QUkVTRVRTID0gW1xuICAgIHsgaWQ6J2N1c3RvbScsICAgICAgICAgIGxhYmVsOidDdXN0b20gKG1hbnVhbCknLCAgICAgICAgICAgICAgICAgbG86bnVsbCwgaGk6bnVsbCwgbm90ZTonJyB9LFxuICAgIHsgaWQ6J29mZmljZScsICAgICAgICAgIGxhYmVsOidPZmZpY2UnLCAgICAgICAgICAgICAgICAgICAgICAgICAgbG86MzAsICAgaGk6NjAsICAgbm90ZTonQVNIUkFFIDU1IGNvbWZvcnQnICAgICAgICAgICAgICAgICAgfSxcbiAgICB7IGlkOidtdXNldW0nLCAgICAgICAgICBsYWJlbDonTXVzZXVtJywgICAgICAgICAgICAgICAgICAgICAgICAgIGxvOjQwLCAgIGhpOjU1LCAgIG5vdGU6J0FBTSBjb2xsZWN0aW9uIHByZXNlcnZhdGlvbicgICAgICAgIH0sXG4gICAgeyBpZDonaG90ZWwnLCAgICAgICAgICAgbGFiZWw6J0hvdGVsIGd1ZXN0IHJvb20nLCAgICAgICAgICAgICAgICBsbzozMCwgICBoaTo2MCwgICBub3RlOidnZW5lcmFsIG9jY3VwYW50IGNvbWZvcnQnICAgICAgICAgICB9LFxuICAgIHsgaWQ6J2xpYnJhcnknLCAgICAgICAgIGxhYmVsOidMaWJyYXJ5IC8gQXJjaGl2ZScsICAgICAgICAgICAgICAgbG86NDAsICAgaGk6NTUsICAgbm90ZToncGFwZXIgJiBiaW5kaW5nIHByZXNlcnZhdGlvbicgICAgICAgfSxcbiAgICB7IGlkOidob3NwaXRhbCcsICAgICAgICBsYWJlbDonSG9zcGl0YWwgKGdlbmVyYWwpJywgICAgICAgICAgICAgIGxvOjMwLCAgIGhpOjYwLCAgIG5vdGU6J0FTSFJBRSAxNzAgcGF0aWVudCBhcmVhcycgICAgICAgICAgIH0sXG4gICAgeyBpZDonbGVjdHVyZScsICAgICAgICAgbGFiZWw6J0xlY3R1cmUgaGFsbCcsICAgICAgICAgICAgICAgICAgICBsbzozMCwgICBoaTo2MCwgICBub3RlOidoaWdoIG9jY3VwYW5jeSBjb21mb3J0JyAgICAgICAgICAgICB9LFxuICAgIHsgaWQ6J2NvbmNlcnQnLCAgICAgICAgIGxhYmVsOidDb25jZXJ0IGhhbGwnLCAgICAgICAgICAgICAgICAgICAgbG86NDAsICAgaGk6NTUsICAgbm90ZTonaW5zdHJ1bWVudCB0dW5pbmcgc3RhYmlsaXR5JyAgICAgICAgfSxcbiAgICB7IGlkOidtZWV0aW5nJywgICAgICAgICBsYWJlbDonTWVldGluZyByb29tJywgICAgICAgICAgICAgICAgICAgIGxvOjMwLCAgIGhpOjYwLCAgIG5vdGU6J3NtYWxsIGdyb3VwIGNvbWZvcnQnICAgICAgICAgICAgICAgIH0sXG4gICAgeyBpZDonZXhoaWJpdGlvbicsICAgICAgbGFiZWw6J0V4aGliaXRpb24gaGFsbCcsICAgICAgICAgICAgICAgICBsbzo0MCwgICBoaTo1NSwgICBub3RlOidtaXhlZCBhcnQgLyBhcnRpZmFjdCBkaXNwbGF5JyAgICAgICB9LFxuXTtcblxuLyogUmVhbCBwc3kgY2hhcnQg4oCUIHVzZXMgdGhlIFNBTUUgZ2V0VyArIEdJVk9OSV9DT0xPUlMgKyBwb2x5Z29uIG1hdGggYXMgdGhlXG4gKiBwcm9kdWN0aW9uIGRhc2hib2FyZC4gIFNvdXJjZSBvZiB0cnV0aDogIGpzL3BzeWNocm9tZXRyaWMuanMgIGFuZCB0aGVcbiAqIHJlbmRlckdpdm9uaU92ZXJsYXkoKSBibG9jayBhdCBhcHAuanM6MTY0MS0xNzIyLlxuICogQW55dGhpbmcgeW91IGNoYW5nZSBpbiB0aG9zZSBmaWxlcyBNVVNUIGJlIG1pcnJvcmVkIGhlcmUuICovXG5mdW5jdGlvbiBQc3lTa2VsZXRvbih7IGNmZyB9KSB7XG4gICAgLyogQ2FudmFzICsgcGFkZGluZyAqL1xuICAgIGNvbnN0IFcgPSA3NjAsIEggPSA0ODA7XG4gICAgY29uc3QgcGFkID0geyBsZWZ0OiA1NiwgcmlnaHQ6IDQwLCB0b3A6IDI4LCBib3R0b206IDU2IH07XG4gICAgY29uc3QgZ3JpZFcgPSBXIC0gcGFkLmxlZnQgLSBwYWQucmlnaHQ7XG4gICAgY29uc3QgZ3JpZEggPSBIIC0gcGFkLnRvcCAgLSBwYWQuYm90dG9tO1xuXG4gICAgY29uc3QgVF9NSU4gPSBjZmcudExvLCBUX01BWCA9IGNmZy50SGk7XG4gICAgY29uc3QgV19NSU4gPSAwLCAgICAgICBXX01BWCA9IDAuMDMwOyAgICAgICAgICAvLyBrZy9rZ1xuXG4gICAgLyogYXhpcyBzY2FsZXMgLS0gbWF0Y2ggdGhlIGxpdmUgZGFzaGJvYXJkICovXG4gICAgY29uc3QgeCAgPSAodCkgPT4gcGFkLmxlZnQgKyAoKHQgLSBUX01JTikgLyAoVF9NQVggLSBUX01JTikpICogZ3JpZFc7XG4gICAgY29uc3QgeSAgPSAodykgPT4gcGFkLnRvcCAgKyAoMSAtICh3IC0gV19NSU4pIC8gKFdfTUFYIC0gV19NSU4pKSAqIGdyaWRIO1xuICAgIGNvbnN0IF9nZXRXID0gKHR5cGVvZiBnZXRXID09PSAnZnVuY3Rpb24nKSA/IGdldFcgOiAoKHQsIHJoKSA9PiAwKTtcblxuICAgIGNvbnN0IHNhZmVQdHMgPSAoYXJyKSA9PiBhcnIubWFwKHAgPT4gYCR7KHgocFswXSl8fDApLnRvRml4ZWQoMil9LCR7KHkocFsxXSl8fDApLnRvRml4ZWQoMil9YCkuam9pbignICcpO1xuXG4gICAgLyogLS0tLSBHaXZvbmkgcG9seWdvbnMgLS0gQ09QSUVEIFZFUkJBVElNIGZyb20gYXBwLmpzOjE2NDMtMTY2OSAtLS0tICovXG4gICAgY29uc3Qgcmg4MCA9IFtdOyBmb3IgKGxldCB0PTIwOyB0PD0yNTsgdCs9MC41KSByaDgwLnB1c2goW3QsIF9nZXRXKHQsIDgwKV0pO1xuICAgIGNvbnN0IHJoMTAwPSBbXTsgZm9yIChsZXQgdD0yMDsgdDw9Mjc7IHQrPTAuNSkgcmgxMDAucHVzaChbdCwgX2dldFcodCwgMTAwKV0pO1xuICAgIGNvbnN0IHJoMjBMaW5lID0gW107IGZvciAobGV0IHQ9MzI7IHQ+PTIwOyB0LT0wLjUpIHJoMjBMaW5lLnB1c2goW3QsIF9nZXRXKHQsIDIwKV0pO1xuICAgIGNvbnN0IHJoMjBfQ1ogID0gW107IGZvciAobGV0IHQ9Mjc7IHQ+PTIwOyB0LT0wLjUpIHJoMjBfQ1oucHVzaChbdCwgX2dldFcodCwgMjApXSk7XG4gICAgY29uc3QgQ1ogICA9IFsuLi5yaDgwLCBbMjcsIF9nZXRXKDI3LCA1MCldLCBbMjcsIF9nZXRXKDI3LCAyMCldLCAuLi5yaDIwX0NaXTtcblxuICAgIGNvbnN0IHJoSGlfdG9wID0gW107IGZvciAobGV0IHR0PTIwOyB0dDw9Mjc7IHR0Kz0wLjUpIHJoSGlfdG9wLnB1c2goW3R0LCBfZ2V0Vyh0dCwgY2ZnLnJoSGkpXSk7XG4gICAgY29uc3QgcmhMb19ib3QgPSBbXTsgZm9yIChsZXQgdHQ9Mjc7IHR0Pj0yMDsgdHQtPTAuNSkgcmhMb19ib3QucHVzaChbdHQsIF9nZXRXKHR0LCBjZmcucmhMbyldKTtcbiAgICBjb25zdCBTV0VFVCA9IFsuLi5yaEhpX3RvcCwgLi4ucmhMb19ib3RdO1xuXG4gICAgY29uc3QgTlYgICA9IFsuLi5yaDEwMCwgWzMyLCAxNS40LzEwMDBdLCBbMzIsIDYuMi8xMDAwXSwgLi4ucmgyMExpbmVdO1xuICAgIGNvbnN0IE1hc3MgPSBbLi4ucmg4MCwgWzMzLCAxNi8xMDAwXSwgWzM3LCBfZ2V0VygzNywgMzApXSwgWzM3LCAzLzEwMDBdLCBbMjAsIF9nZXRXKDIwLCAyMCldXTtcbiAgICBjb25zdCBNQ1YgID0gWy4uLnJoODAsIFs0MCwgMTYvMTAwMF0sIFs0NCwgX2dldFcoNDQsIDIwKV0sIFs0NCwgMy8xMDAwXSwgWzIwLCBfZ2V0VygyMCwgMjApXV07XG4gICAgY29uc3QgRVZBUCA9IFsuLi5yaDgwLCBbMjUsIDE2LzEwMDBdLCBbMzYsIF9nZXRXKDM2LCAzMCldLCBbMzksIF9nZXRXKDM5LCAyMCldLFxuICAgICAgICAgICAgICAgICAgWzQxLCBfZ2V0Vyg0MSwgMTApXSwgWzQxLCAwXSwgWzI3LjIsIDBdLCBbMjAsIF9nZXRXKDIwLCAyMCldXTtcblxuICAgIGNvbnN0IHdpbnRlclJIODAgPSBbXTsgZm9yIChsZXQgdD0xODsgdDw9MTkuNTsgdCs9MC41KSB3aW50ZXJSSDgwLnB1c2goW3QsIF9nZXRXKHQsIDgwKV0pO1xuICAgIGNvbnN0IHdpbnRlclJIMjAgPSBbXTsgZm9yIChsZXQgdD0xOS41OyB0Pj0xODsgdC09MC41KSB3aW50ZXJSSDIwLnB1c2goW3QsIF9nZXRXKHQsIDIwKV0pO1xuICAgIGNvbnN0IFdJTlRFUiA9IFsuLi53aW50ZXJSSDgwLCAuLi53aW50ZXJSSDIwXTtcblxuICAgIC8qIFJIIGlzb3BsZXRoIGN1cnZlcyBmb3IgdGhlIGNoYXJ0IGdyaWQgKi9cbiAgICBjb25zdCBpc29wbGV0aHMgPSBbMjAsIDQwLCA2MCwgODAsIDEwMF07XG5cbiAgICAvKiBUaGVtZSBwYWxldHRlIOKAlCBkcml2ZXMgdGhlIGxpdmUgcHJldmlldyBzbyB0aGUgZGltL2xpZ2h0IGNvbnRyb2xzXG4gICAgICogaGF2ZSB2aXNpYmxlIGZlZWRiYWNrIHJpZ2h0IG9uIHRoZSBjaGFydC4gIEluIGRpbS9kYXJrIG1vZGUgd2UgYWxzb1xuICAgICAqIGFwcGx5IGEgQ1NTIGJyaWdodG5lc3MgZmlsdGVyIG1hcHBlZCBmcm9tIGNmZy5kYXJrTGV2ZWwgKDEuNSAuLiAyLjhcbiAgICAgKiDihpIgMC42IC4uIDEuNCkgc28gdGhlIHVzZXIgY2FuIFNFRSB0aGUgYnJpZ2h0bmVzcyBzbGlkZXIgd29ya2luZy4gKi9cbiAgICBjb25zdCBpc0xpZ2h0ID0gY2ZnLnRoZW1lID09PSAnbGlnaHQnO1xuICAgIGNvbnN0IHBhbGV0dGUgPSBpc0xpZ2h0XG4gICAgICAgID8geyBiZzonI2Y4ZmFmYycsIGdyaWQ6JyNjYmQ1ZTEnLCB0aWNrOicjNDc1NTY5JywgYXhpczonIzFlMjkzYicsXG4gICAgICAgICAgICBwYW5lbEJnOidyZ2JhKDI0OCwyNTAsMjUyLDAuODUpJywgcGFuZWxCb3JkZXI6JyNjYmQ1ZTEnLFxuICAgICAgICAgICAgcGlsbEJnOicjZTJlOGYwJywgcGlsbEZnOicjNDc1NTY5JywgbWV0YUZnOicjNjQ3NDhiJyB9XG4gICAgICAgIDogeyBiZzonIzBiMTIyMCcsIGdyaWQ6JyMxZTI5M2InLCB0aWNrOicjOTRhM2I4JywgYXhpczonI2NiZDVlMScsXG4gICAgICAgICAgICBwYW5lbEJnOidyZ2JhKDE1LDIzLDQyLDAuNiknLCBwYW5lbEJvcmRlcjonIzFlMjkzYicsXG4gICAgICAgICAgICBwaWxsQmc6JyMxZTI5M2InLCBwaWxsRmc6JyM5NGEzYjgnLCBtZXRhRmc6JyM2NDc0OGInIH07XG4gICAgY29uc3QgZGltRmlsdGVyID0gaXNMaWdodFxuICAgICAgICA/ICdub25lJ1xuICAgICAgICA6IGBicmlnaHRuZXNzKCR7KE1hdGgubWF4KDEuNSwgTWF0aC5taW4oMi44LCBjZmcuZGFya0xldmVsIHx8IDIuMCkpIC8gMi4wKS50b0ZpeGVkKDIpfSlgO1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3VuZGVkLTJ4bCBwLTQgYm9yZGVyIHRyYW5zaXRpb24tY29sb3JzIGR1cmF0aW9uLTMwMFwiXG4gICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOiBwYWxldHRlLnBhbmVsQmcsIGJvcmRlckNvbG9yOiBwYWxldHRlLnBhbmVsQm9yZGVyfX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBtYi0zXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicGlsbFwiIHN0eWxlPXt7YmFja2dyb3VuZDpwYWxldHRlLnBpbGxCZywgY29sb3I6cGFsZXR0ZS5waWxsRmd9fT5QU1lDSFJPTUVUUklDIENIQVJUIMK3IGxpdmUgcHJldmlldzwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSBmb250LW1vbm9cIiBzdHlsZT17e2NvbG9yOnBhbGV0dGUubWV0YUZnfX0+e1RfTUlOfcKwQyDihpIge1RfTUFYfcKwQyAgwrcgIHtjZmcucmhMb33igJN7Y2ZnLnJoSGl9JSBSSDwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHN2ZyB2aWV3Qm94PXtgMCAwICR7V30gJHtIfWB9IGNsYXNzTmFtZT1cInctZnVsbCBoLWF1dG8gdHJhbnNpdGlvbi1bZmlsdGVyXSBkdXJhdGlvbi0zMDBcIlxuICAgICAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6IHBhbGV0dGUuYmcsIGJvcmRlclJhZGl1czo4LCBmaWx0ZXI6IGRpbUZpbHRlcn19PlxuICAgICAgICAgICAgICAgIHsvKiAtLS0tIGdyaWQ6IHZlcnRpY2FsIFQgbGluZXMsIGhvcml6b250YWwgVyBsaW5lcyAtLS0tICovfVxuICAgICAgICAgICAgICAgIHtBcnJheS5mcm9tKHtsZW5ndGg6MTF9KS5tYXAoKF8saSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ID0gVF9NSU4gKyAoaS8xMCkgKiAoVF9NQVggLSBUX01JTik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZyBrZXk9eyd2dCcraX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3godCl9IHkxPXtwYWQudG9wfSB4Mj17eCh0KX0geTI9e3BhZC50b3ArZ3JpZEh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPXtwYWxldHRlLmdyaWR9IHN0cm9rZVdpZHRoPVwiMC42XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3godCl9IHk9e3BhZC50b3ArZ3JpZEgrMTZ9IGZvbnRTaXplPVwiOS41XCIgZmlsbD17cGFsZXR0ZS50aWNrfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIj57dC50b0ZpeGVkKDApfTwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICB7QXJyYXkuZnJvbSh7bGVuZ3RoOjd9KS5tYXAoKF8saSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB3ID0gV19NSU4gKyAoaS82KSAqIChXX01BWCAtIFdfTUlOKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxnIGtleT17J2h3JytpfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17cGFkLmxlZnR9IHkxPXt5KHcpfSB4Mj17cGFkLmxlZnQrZ3JpZFd9IHkyPXt5KHcpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT17cGFsZXR0ZS5ncmlkfSBzdHJva2VXaWR0aD1cIjAuNlwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXtwYWQubGVmdC04fSB5PXt5KHcpKzN9IGZvbnRTaXplPVwiOS41XCIgZmlsbD17cGFsZXR0ZS50aWNrfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJlbmRcIj57KHcqMTAwMCkudG9GaXhlZCgwKX08L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgey8qIC0tLS0gUkggaXNvcGxldGhzIChjdXJ2ZXMpIC0tLS0gKi99XG4gICAgICAgICAgICAgICAge2lzb3BsZXRocy5tYXAocmggPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwdHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdCA9IFRfTUlOOyB0IDw9IFRfTUFYOyB0ICs9IDAuNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgd3cgPSBfZ2V0Vyh0LCByaCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod3cgPj0gV19NSU4gJiYgd3cgPD0gV19NQVgpIHB0cy5wdXNoKFt0LCB3d10pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZyBrZXk9eydpc28nK3JofT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cG9seWxpbmUgcG9pbnRzPXtzYWZlUHRzKHB0cyl9IGZpbGw9XCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPXtyaCA9PT0gMTAwID8gJyM2MzY2ZjEnIDogJyNlYzQ4OTk1NSd9IHN0cm9rZVdpZHRoPVwiMC44XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlRGFzaGFycmF5PXtyaCA9PT0gMTAwID8gJycgOiAnMywzJ30vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtwdHMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3gocHRzW01hdGguZmxvb3IocHRzLmxlbmd0aCowLjY1KV1bMF0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5PXt5KHB0c1tNYXRoLmZsb29yKHB0cy5sZW5ndGgqMC42NSldWzFdKSAtIDR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplPVwiOVwiIGZpbGw9XCIjZWM0ODk5OTlcIiBmb250V2VpZ2h0PVwiNzAwXCI+e3JofSU8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cblxuICAgICAgICAgICAgICAgIHsvKiAtLS0tIEdpdm9uaSBvdmVybGF5IChjb3BpZWQgdmVyYmF0aW0gZnJvbSBhcHAuanMgcmVuZGVyIG9yZGVyKSAtLS0tICovfVxuICAgICAgICAgICAgICAgIHtjZmcuZ2l2b25pICYmIChcbiAgICAgICAgICAgICAgICAgICAgPGcgY2xhc3NOYW1lPVwicG9pbnRlci1ldmVudHMtbm9uZVwiIG9wYWNpdHk9XCIwLjlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXt4KDQwKX0geTE9e3koMTYvMTAwMCl9IHgyPXt4KDUwKX0geTI9e3koMTYvMTAwMCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCIjNjM2NmYxXCIgc3Ryb2tlV2lkdGg9XCIxLjVcIiBzdHJva2VEYXNoYXJyYXk9XCI0LDRcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17eCg1MCl9IHkxPXt5KDE2LzEwMDApfSB4Mj17eCg1MCl9IHkyPXt5KDApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiIzYzNjZmMVwiIHN0cm9rZVdpZHRoPVwiMS41XCIgc3Ryb2tlRGFzaGFycmF5PVwiNCw0XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3goNDEpfSB5MT17eSgwKX0geDI9e3goNTApfSB5Mj17eSgwKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cIiM2MzY2ZjFcIiBzdHJva2VXaWR0aD1cIjEuNVwiIHN0cm9rZURhc2hhcnJheT1cIjQsNFwiLz5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKE1DVil9ICBmaWxsPVwiI2VjNDg5OVwiIGZpbGxPcGFjaXR5PVwiMC4wNVwiIHN0cm9rZT1cIiNlYzQ4OTlcIiBzdHJva2VXaWR0aD1cIjFcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoTWFzcyl9IGZpbGw9XCIjOGI1Y2Y2XCIgZmlsbE9wYWNpdHk9XCIwLjA1XCIgc3Ryb2tlPVwiIzhiNWNmNlwiIHN0cm9rZVdpZHRoPVwiMVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhFVkFQKX0gZmlsbD1cIiMwNmI2ZDRcIiBmaWxsT3BhY2l0eT1cIjAuMDhcIiBzdHJva2U9XCIjMDZiNmQ0XCIgc3Ryb2tlV2lkdGg9XCIxXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKE5WKX0gICBmaWxsPVwiI2Y1OWUwYlwiIGZpbGxPcGFjaXR5PVwiMC4wNVwiIHN0cm9rZT1cIiNmNTllMGJcIiBzdHJva2VXaWR0aD1cIjFcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoQ1opfSAgIGZpbGw9XCIjMTBiOTgxXCIgZmlsbE9wYWNpdHk9XCIwLjE1XCIgc3Ryb2tlPVwiIzEwYjk4MVwiIHN0cm9rZVdpZHRoPVwiMS4yXCIvPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICB7LyogU3dlZXQtc3BvdCBiYW5kLCBjbGlwcGVkIHRvIENaICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgPGRlZnM+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNsaXBQYXRoIGlkPVwiY3otY2xpcC13YWxrXCIgY2xpcFBhdGhVbml0cz1cInVzZXJTcGFjZU9uVXNlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhDWil9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2NsaXBQYXRoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kZWZzPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKFNXRUVUKX0gY2xpcFBhdGg9XCJ1cmwoI2N6LWNsaXAtd2FsaylcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbD1cIiMwNTk2NjlcIiBmaWxsT3BhY2l0eT1cIjAuMzJcIiBzdHJva2U9XCIjMDQ3ODU3XCIgc3Ryb2tlV2lkdGg9XCIwLjhcIiBzdHJva2VEYXNoYXJyYXk9XCIzLDJcIi8+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhXSU5URVIpfSBmaWxsPVwiIzNiODJmNlwiIGZpbGxPcGFjaXR5PVwiMC4xNVwiIHN0cm9rZT1cIm5vbmVcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17eCgxOSl9IHkxPXtwYWQudG9wKzE4fSB4Mj17eCgxOSl9IHkyPXtwYWQudG9wK2dyaWRIfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiIzNiODJmNlwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZURhc2hhcnJheT1cIjYsNFwiIG9wYWNpdHk9XCIwLjhcIi8+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBSZWdpb24gbGFiZWxzIOKAlCBzYW1lIGNvbG9ycyAmIHNwaXJpdCBhcyBsaXZlIGNoYXJ0ICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCg1MCktMTB9IHk9e3koOC8xMDAwKX0gZmlsbD1cIiM2MzY2ZjFcIiBmb250U2l6ZT1cIjEwXCIgZm9udFdlaWdodD1cIjkwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgdHJhbnNmb3JtPXtgcm90YXRlKC05MCwgJHt4KDUwKS0xMH0sICR7eSg4LzEwMDApfSlgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZz1cIjJcIj5NRUNIQU5JQ0FMIENPT0xJTkc8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDQ0KS0yfSB5PXt5KDgvMTAwMCl9IGZpbGw9XCIjZWM0ODk5XCIgZm9udFNpemU9XCI5XCIgZm9udFdlaWdodD1cIjkwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgdHJhbnNmb3JtPXtgcm90YXRlKC05MCwgJHt4KDQ0KS0yfSwgJHt5KDgvMTAwMCl9KWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nPVwiMS41XCI+TUFTUyBDT09MSU5HPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCgzNyktMTB9IHk9e3koOC8xMDAwKX0gZmlsbD1cIiM4YjVjZjZcIiBmb250U2l6ZT1cIjlcIiBmb250V2VpZ2h0PVwiOTAwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiB0cmFuc2Zvcm09e2Byb3RhdGUoLTkwLCAke3goMzcpLTEwfSwgJHt5KDgvMTAwMCl9KWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nPVwiMS41XCI+TUFTUyBDT09MSU5HPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCgzNCl9IHk9e3koMC41LzEwMDApLTh9IGZpbGw9XCIjMDZiNmQ0XCIgZm9udFNpemU9XCI5XCIgZm9udFdlaWdodD1cIjkwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgbGV0dGVyU3BhY2luZz1cIjJcIj5FVkFQT1JBVElWRTwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goMjMuNSl9IHk9e3koX2dldFcoMjMuNSwgNDUpKX0gZmlsbD1cIiMxMGI5ODFcIiBmb250U2l6ZT1cIjExXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ9XCI5MDBcIiB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgbGV0dGVyU3BhY2luZz1cIjEuNVwiPkNPTUZPUlQ8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDE4Ljc1KX0geT17eShfZ2V0VygxOC43NSwgNDUpKX0gZmlsbD1cIiMzYjgyZjZcIiBmb250U2l6ZT1cIjExXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ9XCI5MDBcIiB0ZXh0QW5jaG9yPVwibWlkZGxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybT17YHJvdGF0ZSgtOTAsICR7eCgxOC43NSl9LCAke3koX2dldFcoMTguNzUsIDQ1KSl9KWB9PldJTlRFUjwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goMjMuNSl9IHk9e3koX2dldFcoMjMuNSwgKGNmZy5yaExvK2NmZy5yaEhpKS8yKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxsPVwiIzAyMmMyMlwiIGZvbnRTaXplPVwiOFwiIGZvbnRXZWlnaHQ9XCI5MDBcIiB0ZXh0QW5jaG9yPVwibWlkZGxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7cGFpbnRPcmRlcjonc3Ryb2tlJywgc3Ryb2tlOicjYTdmM2QwJywgc3Ryb2tlV2lkdGg6JzIuNXB4Jywgc3Ryb2tlTGluZWpvaW46J3JvdW5kJ319XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nPVwiMS41XCI+e2NmZy5yaExvfS17Y2ZnLnJoSGl9JSBSSDwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgICAgICB7LyogYXhpcyBsYWJlbHMgKi99XG4gICAgICAgICAgICAgICAgPHRleHQgeD17cGFkLmxlZnQgKyBncmlkVy8yfSB5PXtILTEyfSBmb250U2l6ZT1cIjExXCIgZmlsbD17cGFsZXR0ZS5heGlzfVxuICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiBmb250V2VpZ2h0PVwiODAwXCIgbGV0dGVyU3BhY2luZz1cIjJcIj5EUlkgQlVMQiBURU1QICjCsEMpPC90ZXh0PlxuICAgICAgICAgICAgICAgIDx0ZXh0IHg9ezE2fSB5PXtwYWQudG9wICsgZ3JpZEgvMn0gZm9udFNpemU9XCIxMVwiIGZpbGw9e3BhbGV0dGUuYXhpc31cbiAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgZm9udFdlaWdodD1cIjgwMFwiIGxldHRlclNwYWNpbmc9XCIyXCJcbiAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm09e2Byb3RhdGUoLTkwIDE2ICR7cGFkLnRvcCArIGdyaWRILzJ9KWB9PkhVTUlESVRZIFJBVElPIChnL2tnKTwvdGV4dD5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG5mdW5jdGlvbiBQc3lDb250cm9sUGFuZWwoeyBjZmcsIHVwZGF0ZSwgc2V0Q2ZnIH0pIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXNsYXRlLTkwMC82MCBib3JkZXIgYm9yZGVyLXNsYXRlLTgwMCByb3VuZGVkLTJ4bCBwLTUgc3BhY2UteS02XCI+XG4gICAgICAgICAgICB7LyogVGhlbWUgKyBicmlnaHRuZXNzICAtLSByZWxvY2F0ZWQgZnJvbSB0aGUgZGFzaGJvYXJkIHNpZGViYXIgMjAyNi0wNi0yNS5cbiAgICAgICAgICAgICAgICBUd28gY29udHJvbHM6IERhcmsvTGlnaHQgbW9kZSB0b2dnbGUsIGFuZCBCcmlnaHRuZXNzIHNsaWRlciAob25seVxuICAgICAgICAgICAgICAgIG1lYW5pbmdmdWwgaW4gZGFyayBtb2RlKS4gIExpdmUgcHJldmlldyBhcHBsaWVzIHRvIHRoZSBzdXJyb3VuZGluZ1xuICAgICAgICAgICAgICAgIGNvbnRyb2wgcGFuZWwgc28gdGhlIG9wZXJhdG9yIGNhbiBGRUVMIHRoZSBjaGFuZ2UgYmVmb3JlIHNhdmluZy4gKi99XG4gICAgICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwicHN5LWNmZy10aGVtZS1ibG9ja1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMlwiPkRpc3BsYXkgTW9kZTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtMiBtYi0zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJwc3ktY2ZnLXRoZW1lLWRhcmtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldENmZyhjID0+ICh7Li4uYywgdGhlbWU6J2RhcmsnLCBkYXJrTGV2ZWw6TWF0aC5taW4oYy5kYXJrTGV2ZWwgfHwgMi4wLCAyLjYpfSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB5LTIuNSByb3VuZGVkLWxnIHRleHQteHMgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGJvcmRlciB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2NmZy50aGVtZSA9PT0gJ2RhcmsnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1zbGF0ZS04MDAgYm9yZGVyLXllbGxvdy01MDAvNzAgdGV4dC15ZWxsb3ctMzAwIHNoYWRvdy1sZyBzaGFkb3cteWVsbG93LTUwMC8xMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLXNsYXRlLTkwMC8zMCBib3JkZXItc2xhdGUtNzAwIHRleHQtc2xhdGUtNTAwIGhvdmVyOmJnLXNsYXRlLTgwMC82MCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICDwn4yZICBEaW0gLyBEYXJrXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwicHN5LWNmZy10aGVtZS1saWdodFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0Q2ZnKGMgPT4gKHsuLi5jLCB0aGVtZTonbGlnaHQnLCBkYXJrTGV2ZWw6My4wfSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB5LTIuNSByb3VuZGVkLWxnIHRleHQteHMgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGJvcmRlciB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2NmZy50aGVtZSA9PT0gJ2xpZ2h0J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctc2xhdGUtMTAwIGJvcmRlci1za3ktNTAwLzcwIHRleHQtc2t5LTcwMCBzaGFkb3ctbGcgc2hhZG93LXNreS01MDAvMTAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1zbGF0ZS05MDAvMzAgYm9yZGVyLXNsYXRlLTcwMCB0ZXh0LXNsYXRlLTUwMCBob3ZlcjpiZy1zbGF0ZS04MDAvNjAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAg4piAICBMaWdodFxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICB7LyogQnJpZ2h0bmVzcyBzbGlkZXIg4oCUIG9ubHkgbWVhbmluZ2Z1bCB3aGVuIHRoZW1lID09PSAnZGFyaycgKi99XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NmZy50aGVtZSA9PT0gJ2xpZ2h0JyA/ICdvcGFjaXR5LTQwIHBvaW50ZXItZXZlbnRzLW5vbmUnIDogJyd9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBtYi0xXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJvbGQgdGV4dC1zbGF0ZS01MDBcIj5EaW0gYnJpZ2h0bmVzczwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSBmb250LW1vbm8gdGV4dC15ZWxsb3ctMzAwIHRhYnVsYXItbnVtc1wiPntNYXRoLnJvdW5kKChjZmcuZGFya0xldmVsIHx8IDIuMCkgKiAxMDApfSU8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwicHN5LWNmZy1kYXJrLWxldmVsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbj1cIjEuNVwiIG1heD1cIjIuOFwiIHN0ZXA9XCIwLjAyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtjZmcudGhlbWUgPT09ICdsaWdodCcgPyAyLjAgOiAoY2ZnLmRhcmtMZXZlbCB8fCAyLjApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIGRhcmtMZXZlbDogcGFyc2VGbG9hdChlLnRhcmdldC52YWx1ZSksIHRoZW1lOidkYXJrJ30pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLWlucHV0IHctZnVsbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBhY2NlbnRDb2xvcjonI2ZhY2MxNScgfX0vPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTIgaXRhbGljXCI+XG4gICAgICAgICAgICAgICAgICAgIEFwcGxpZWQgdG8gdGhlIHdob2xlIGRhc2hib2FyZC4gIERpbSBpcyByZWNvbW1lbmRlZCBmb3IgY29udHJvbCByb29tczsgTGlnaHQgZm9yIGRheXRpbWUgd2Fsay10aHJvdWdocy5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIEdpdm9uaSB0b2dnbGUgKi99XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMlwiPkdpdm9uaSBFbmdpbmU8L2Rpdj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHVwZGF0ZSgnZ2l2b25pJywgIWNmZy5naXZvbmkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdy1mdWxsIHB5LTMgcm91bmRlZC14bCB0ZXh0LXNtIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjZmcuZ2l2b25pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctaW5kaWdvLTYwMCB0ZXh0LXdoaXRlIHNoYWRvdy1sZyBzaGFkb3ctaW5kaWdvLTUwMC8zMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1zbGF0ZS04MDAgdGV4dC1zbGF0ZS00MDAgYm9yZGVyIGJvcmRlci1zbGF0ZS03MDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICB7Y2ZnLmdpdm9uaSA/ICdHaXZvbmkgT04nIDogJ0dpdm9uaSBPRkYnfVxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTIgbGVhZGluZy1yZWxheGVkXCI+XG4gICAgICAgICAgICAgICAgICAgIE92ZXJsYXlzIHRoZSA0IGNsaW1hdGUtc3RyYXRlZ3kgcmVnaW9ucyAoQ29tZm9ydCwgTmF0IFZlbnQsIEV2YXAsIE1lY2ggQ29vbCkuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBSSCByYW5nZSAqL31cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0yXCI+UkggU3dlZXQtU3BvdCBSYW5nZTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItM1wiPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJvbGQgdGV4dC1zbGF0ZS01MDAgbWItMSBibG9ja1wiPlZlbnVlIHByZXNldDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXQgY3Vyc29yLXBvaW50ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtjZmcucmhQcmVzZXQgfHwgJ2N1c3RvbSd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHAgPSBSSF9QUkVTRVRTLmZpbmQocCA9PiBwLmlkID09PSBlLnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocC5pZCA9PT0gJ2N1c3RvbScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZSgncmhQcmVzZXQnLCAnY3VzdG9tJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIHJoUHJlc2V0OnAuaWQsIHJoTG86cC5sbywgcmhIaTpwLmhpfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7UkhfUFJFU0VUUy5tYXAocCA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBrZXk9e3AuaWR9IHZhbHVlPXtwLmlkfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3AubGFiZWx9e3AubG8gIT0gbnVsbCA/IGAgIMK3ICAke3AubG99LSR7cC5oaX0lIFJIYCA6ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgICAgICB7KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHAgPSBSSF9QUkVTRVRTLmZpbmQoeCA9PiB4LmlkID09PSAoY2ZnLnJoUHJlc2V0IHx8ICdjdXN0b20nKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcCAmJiBwLm5vdGUgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbXQtMS41IGl0YWxpY1wiPntwLm5vdGV9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgKSA6IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH0pKCl9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMyBtYi0yXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1tb25vIHRleHQtc2xhdGUtNDAwIHctMTBcIj57Y2ZnLnJoTG99JTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj1cIjIwXCIgbWF4PXtjZmcucmhIaS01fSB2YWx1ZT17Y2ZnLnJoTG99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldENmZyhjID0+ICh7Li4uYywgcmhMbzorZS50YXJnZXQudmFsdWUsIHJoUHJlc2V0OidjdXN0b20nfSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2UtaW5wdXQgZmxleC0xXCIvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyBmb250LW1vbm8gdGV4dC1zbGF0ZS00MDAgdy0xMFwiPntjZmcucmhIaX0lPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPXtjZmcucmhMbys1fSBtYXg9XCI5MFwiIHZhbHVlPXtjZmcucmhIaX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0Q2ZnKGMgPT4gKHsuLi5jLCByaEhpOitlLnRhcmdldC52YWx1ZSwgcmhQcmVzZXQ6J2N1c3RvbSd9KSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyYW5nZS1pbnB1dCBmbGV4LTFcIi8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIEF4aXMgcmFuZ2UgKi99XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMlwiPlRlbXBlcmF0dXJlIEF4aXMgUmFuZ2U8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zIG1iLTJcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyBmb250LW1vbm8gdGV4dC1zbGF0ZS00MDAgdy0xMFwiPntjZmcudExvfcKwPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPVwiLTQwXCIgbWF4PXtjZmcudEhpLTEwfSB2YWx1ZT17Y2ZnLnRMb31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlKCd0TG8nLCArZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2UtaW5wdXQgZmxleC0xXCIvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyBmb250LW1vbm8gdGV4dC1zbGF0ZS00MDAgdy0xMFwiPntjZmcudEhpfcKwPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPXtjZmcudExvKzEwfSBtYXg9XCI2MFwiIHZhbHVlPXtjZmcudEhpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGUoJ3RIaScsICtlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyYW5nZS1pbnB1dCBmbGV4LTFcIi8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbXQtMiBsZWFkaW5nLXJlbGF4ZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgQ2hhcnQgd2lsbCBiZSByZWRyYXduIHdpdGggdGhpcyBkcnktYnVsYiB0ZW1wZXJhdHVyZSB3aW5kb3cuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyLXQgYm9yZGVyLXNsYXRlLTgwMCBwdC00XCI+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbGVhZGluZy1yZWxheGVkXCI+XG4gICAgICAgICAgICAgICAgICAgIENoYW5nZXMgcHJldmlldyBsaXZlIGluIHRoZSBza2VsZXRvbiBjaGFydCBvbiB0aGUgbGVmdC4gIEhpdFxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWluZGlnby00MDAgZm9udC1ibGFja1wiPiBTYXZlICYgcmV0dXJuIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgaW4gdGhlIGhlYWRlciB3aGVuIHlvdSdyZSBoYXBweS5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTG9jYXRpb24gU2V0dGluZyAtLSBtb2RhbCB3LyBpbnRlcmFjdGl2ZSBMZWFmbGV0IG1hcCArIHJldmVyc2UgZ2VvY29kaW5nXG4gKiBDbGljayBhbnl3aGVyZSBvbiB0aGUgbWFwIChvciBkcmFnIHRoZSBtYXJrZXIpIHRvIHNldCBsYXQvbG9uLlxuICogTWFudWFsIGxhdC9sb24gZWRpdHMgcmUtY2VudHJlIHRoZSBtYXJrZXIuICBDaXR5IG5hbWUgaXMgYXV0by1wb3B1bGF0ZWRcbiAqIHZpYSBPcGVuU3RyZWV0TWFwIE5vbWluYXRpbSAobm8ga2V5IHJlcXVpcmVkLCByYXRlLWxpbWl0ZWQgdG8gfjEgcmVxL3MpLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKiBEZS1kdXAgKyBzYW5pdHktY2hlY2sgYSByYXcgc2F2ZWQtbG9jYXRpb25zIGFycmF5IChmcm9tIHNlcnZlciBvclxuICogbG9jYWxTdG9yYWdlKS4gIERyb3BzIGVudHJpZXMgbWlzc2luZyBhIG5hbWUgb3Igd2l0aCBub24tZmluaXRlIGxhdC9sb24sXG4gKiBrZWVwcyB0aGUgRklSU1Qgb2NjdXJyZW5jZSBvZiBlYWNoIHVuaXF1ZSBuYW1lLiAgVXNlZCBieSBMb2NhdGlvbk1vZGFsJ3NcbiAqIFNpdGUtbmFtZSBkYXRhbGlzdCBiZWxvdy4gKi9cbmZ1bmN0aW9uIF9ub3JtYWxpemVMb2NzKGFycikge1xuICAgIGNvbnN0IHNlZW4gPSBuZXcgU2V0KCk7XG4gICAgY29uc3Qgb3V0ID0gW107XG4gICAgZm9yIChjb25zdCBsIG9mIChhcnIgfHwgW10pKSB7XG4gICAgICAgIGlmICghbCB8fCB0eXBlb2YgbC5uYW1lICE9PSAnc3RyaW5nJykgY29udGludWU7XG4gICAgICAgIGNvbnN0IGxhdCA9ICtsLmxhdCwgbG9uID0gK2wubG9uO1xuICAgICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShsYXQpIHx8ICFOdW1iZXIuaXNGaW5pdGUobG9uKSkgY29udGludWU7XG4gICAgICAgIGNvbnN0IGtleSA9IGwubmFtZS50cmltKCk7XG4gICAgICAgIGlmICgha2V5IHx8IHNlZW4uaGFzKGtleSkpIGNvbnRpbnVlO1xuICAgICAgICBzZWVuLmFkZChrZXkpO1xuICAgICAgICBvdXQucHVzaCh7IG5hbWU6a2V5LCBsYXQsIGxvbiB9KTtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gTG9jYXRpb25Nb2RhbCh7IGNmZywgc2V0Q2ZnLCBvbkNsb3NlLCBvblNhdmUgfSkge1xuICAgIGNvbnN0IG1hcEJveFJlZiA9IFJlYWN0LnVzZVJlZihudWxsKTtcbiAgICBjb25zdCBtYXBSZWYgICAgPSBSZWFjdC51c2VSZWYobnVsbCk7XG4gICAgY29uc3QgbWFya2VyUmVmID0gUmVhY3QudXNlUmVmKG51bGwpO1xuICAgIGNvbnN0IFtnZW9CdXN5LCBzZXRHZW9CdXN5XSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcblxuICAgIC8qIC0tLS0tIHNhdmVkIGxvY2F0aW9ucyAtLSBtaXJyb3Igd2hhdCB0aGUgRGFzaGJvYXJkJ3MgV2VhdGhlciBidXR0b24gc2hvd3MuXG4gICAgICpcbiAgICAgKiBUaGUgZGFzaGJvYXJkIHJlYWRzIHRoZW0gZnJvbSBgJHtBUElfVVJMfS9hcGkvd2VhdGhlci1sb2NhdGlvbmAnc1xuICAgICAqIGBzYXZlZGAgYXJyYXkgYW5kIG1pcnJvcnMgdGhhdCBpbnRvIGxvY2FsU3RvcmFnZVsnc2F2ZWRXZWF0aGVyTG9jYXRpb25zJ11cbiAgICAgKiBvbiBtb3VudCAoc2VlIHB1YmxpYy9qcy9kYXNoYm9hcmQvYXBwLmpzI2h5ZHJhdGVXZWF0aGVyU3RhdGUpLiAgV2UgZG9cbiAgICAgKiB0aGUgU0FNRSB0aGluZyBoZXJlIHNvIHRoZSBTZXR1cCBXYWxrJ3MgU2l0ZS1uYW1lIGRyb3Bkb3duIHN0YXlzXG4gICAgICogYnl0ZS1pZGVudGljYWwgd2l0aCB0aGUgZGFzaGJvYXJkJ3MgbG9jYXRpb24gbGlzdCAtLSBpbmNsdWRpbmcgd2hlbiB0aGVcbiAgICAgKiBvcGVyYXRvciB2aXNpdHMgU2V0dXAgV2FsayBCRUZPUkUgZXZlciBvcGVuaW5nIHRoZSBkYXNoYm9hcmQgKGZyZXNoXG4gICAgICogZGV2aWNlIGNhc2Ugd2hlcmUgbG9jYWxTdG9yYWdlIGlzIGVtcHR5KS5cbiAgICAgKlxuICAgICAqIFN0cmF0ZWd5OlxuICAgICAqICAgMSkgUmVhZCBsb2NhbFN0b3JhZ2UgZmlyc3QgKGluc3RhbnQsIG5vIGZsaWNrZXIgaWYgYWxyZWFkeSBoeWRyYXRlZCkuXG4gICAgICogICAyKSBUaGVuIEdFVCAvYXBpL3dlYXRoZXItbG9jYXRpb24gKGNhbm9uaWNhbCwgY3Jvc3MtZGV2aWNlIHNvdXJjZSkuXG4gICAgICogICAzKSBXaGljaGV2ZXIgaXMgbm9uLWVtcHR5IHdpbnM7IHNlcnZlciB3aW5zIHRpZXMuXG4gICAgICpcbiAgICAgKiBGcmVlLWZvcm0gdHlwaW5nIGluIHRoZSBpbnB1dCBzdGlsbCB3b3JrcyAtLSB0aGUgZGF0YWxpc3QgaXMgc3VnZ2VzdGlvblxuICAgICAqIG9ubHksIHRoZSBpbnB1dCBuZXZlciByZXN0cmljdHMgdGhlIHZhbHVlLiAqL1xuICAgIGNvbnN0IFtzYXZlZExvY3MsIHNldFNhdmVkTG9jc10gPSBSZWFjdC51c2VTdGF0ZSgoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByYXcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2F2ZWRXZWF0aGVyTG9jYXRpb25zJyk7XG4gICAgICAgICAgICBpZiAoIXJhdykgcmV0dXJuIFtdO1xuICAgICAgICAgICAgY29uc3QgYXJyID0gSlNPTi5wYXJzZShyYXcpO1xuICAgICAgICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXJyKSA/IF9ub3JtYWxpemVMb2NzKGFycikgOiBbXTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyByZXR1cm4gW107IH1cbiAgICB9KTtcbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBsZXQgY2FuY2VsbGVkID0gZmFsc2U7XG4gICAgICAgIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCgnL2FwaS93ZWF0aGVyLWxvY2F0aW9uJywgeyBjcmVkZW50aWFsczonaW5jbHVkZScsIGNhY2hlOiduby1zdG9yZScgfSk7XG4gICAgICAgICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm47XG4gICAgICAgICAgICAgICAgY29uc3QgaiA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNhdmVkID0gX25vcm1hbGl6ZUxvY3MoQXJyYXkuaXNBcnJheShqLnNhdmVkKSA/IGouc2F2ZWQgOiBbXSk7XG4gICAgICAgICAgICAgICAgaWYgKGNhbmNlbGxlZCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGlmIChzYXZlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFNhdmVkTG9jcyhzYXZlZCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIE1pcnJvciB0byBsb2NhbFN0b3JhZ2Ugc28gdGhlIGRhc2hib2FyZCBzZWVzIHRoZSBzYW1lIGxpc3RcbiAgICAgICAgICAgICAgICAgICAgLy8gZXZlbiBpZiBpdHMgb3duIGh5ZHJhdGUgaGFzbid0IHJ1biB5ZXQgdGhpcyBzZXNzaW9uLlxuICAgICAgICAgICAgICAgICAgICB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc2F2ZWRXZWF0aGVyTG9jYXRpb25zJywgSlNPTi5zdHJpbmdpZnkoc2F2ZWQpKTsgfSBjYXRjaCAoZSkge31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7IC8qIG9mZmxpbmUgLT4gbG9jYWxTdG9yYWdlIHZhbHVlIGFscmVhZHkgaW4gc3RhdGUgKi8gfVxuICAgICAgICB9KSgpO1xuICAgICAgICByZXR1cm4gKCkgPT4geyBjYW5jZWxsZWQgPSB0cnVlOyB9O1xuICAgIH0sIFtdKTtcblxuICAgIC8qIC0tLS0tIHNhdmVkLWxvY2F0aW9ucyBkcm9wZG93biBvcGVuL2Nsb3NlIHN0YXRlLlxuICAgICAqIE5hdGl2ZSA8ZGF0YWxpc3Q+IGhpZGVzIGl0cyBjaGV2cm9uIGluIG1vc3QgYnJvd3NlcnMgKGVzcGVjaWFsbHkgaW5cbiAgICAgKiBhIGRhcmsgdGhlbWUpLCB3aGljaCBtYWRlIHRoZSBcImRyb3AgZG93blwiIGludmlzaWJsZSB0byBvcGVyYXRvcnNcbiAgICAgKiB3aG8gY2xlYXJseSBoYWQgbXVsdGlwbGUgc2F2ZWQgbG9jYXRpb25zLiAgUmVwbGFjZWQgd2l0aCBhIGN1c3RvbVxuICAgICAqIHBvcGRvd24gcGFuZWwgdGhhdCBoYXMgYW4gQUxXQVlTLVZJU0lCTEUgY2hldnJvbiBidXR0b24gLS0gY2xpY2sgaXRcbiAgICAgKiB0byB0b2dnbGUsIGNsaWNrIG91dHNpZGUgdG8gZGlzbWlzcy4gKi9cbiAgICBjb25zdCBbc2F2ZWRPcGVuLCBzZXRTYXZlZE9wZW5dID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IHNhdmVkUmVmID0gUmVhY3QudXNlUmVmKG51bGwpO1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmICghc2F2ZWRPcGVuKSByZXR1cm47XG4gICAgICAgIGNvbnN0IG9uRG9jQ2xpY2sgPSAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHNhdmVkUmVmLmN1cnJlbnQgJiYgIXNhdmVkUmVmLmN1cnJlbnQuY29udGFpbnMoZS50YXJnZXQpKSBzZXRTYXZlZE9wZW4oZmFsc2UpO1xuICAgICAgICB9O1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKTtcbiAgICAgICAgcmV0dXJuICgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spO1xuICAgIH0sIFtzYXZlZE9wZW5dKTtcblxuICAgIC8qIFdoZW4gdGhlIHVzZXIgcGlja3MgYSBuYW1lIGZyb20gdGhlIGRyb3Bkb3duIE9SIHR5cGVzIG9uZSB0aGF0XG4gICAgICogZXhhY3RseSBtYXRjaGVzIGEgc2F2ZWQgZW50cnksIHB1bGwgaXRzIGxhdC9sb24gYW5kIHJlY2VudHJlIHRoZVxuICAgICAqIG1hcC4gIEZyZWUtZm9ybSB0eXBpbmcgc3RpbGwgd29ya3MgLS0gdGhlIG5hbWUgaXMganVzdCBrZXB0IGFzIHRoZVxuICAgICAqIHNpdGUgbGFiZWwuICBBdm9pZHMgc3VycHJpc2luZyB0aGUgb3BlcmF0b3Igd2hvIHR5cGVzIFwiUGF2aWxpb24gQlwiXG4gICAgICogKGEgbGFiZWwgdGhleSBpbnZlbnRlZCkgYW5kIGV4cGVjdHMgdGhlIG1hcCBOT1QgdG8ganVtcC4gKi9cbiAgICBjb25zdCBvblNpdGVOYW1lQ2hhbmdlID0gKG5ld05hbWUpID0+IHtcbiAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBzaXRlTmFtZTpuZXdOYW1lfSkpO1xuICAgICAgICBjb25zdCBoaXQgPSBzYXZlZExvY3MuZmluZChzID0+IHMubmFtZSA9PT0gbmV3TmFtZSk7XG4gICAgICAgIGlmIChoaXQpIHtcbiAgICAgICAgICAgIGNvbnN0IGxhdCA9IE1hdGgucm91bmQoaGl0LmxhdCAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICAgICAgY29uc3QgbG9uID0gTWF0aC5yb3VuZChoaXQubG9uICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIHNpdGVOYW1lOm5ld05hbWUsIGxhdCwgbG9uLCBjaXR5Om5ld05hbWV9KSk7XG4gICAgICAgICAgICBpZiAobWFwUmVmLmN1cnJlbnQpIG1hcFJlZi5jdXJyZW50LnNldFZpZXcoW2xhdCwgbG9uXSwgMTEpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBwaWNrU2F2ZWRMb2MgPSAobG9jKSA9PiB7XG4gICAgICAgIHNldFNhdmVkT3BlbihmYWxzZSk7XG4gICAgICAgIG9uU2l0ZU5hbWVDaGFuZ2UobG9jLm5hbWUpO1xuICAgIH07XG5cbiAgICAvKiAtLS0tLSBzZWFyY2ggc3RhdGUgLS0tLS0gKi9cbiAgICBjb25zdCBbc2VhcmNoUSwgc2V0U2VhcmNoUV0gICAgICAgICA9IFJlYWN0LnVzZVN0YXRlKCcnKTtcbiAgICBjb25zdCBbc2VhcmNoSGl0cywgc2V0U2VhcmNoSGl0c10gICA9IFJlYWN0LnVzZVN0YXRlKFtdKTtcbiAgICBjb25zdCBbc2VhcmNoQnVzeSwgc2V0U2VhcmNoQnVzeV0gICA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBbc2VhcmNoT3Blbiwgc2V0U2VhcmNoT3Blbl0gICA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBzZWFyY2hEZWJvdW5jZVJlZiAgICAgICAgICAgICA9IFJlYWN0LnVzZVJlZihudWxsKTtcblxuICAgIC8qIEZvcndhcmQtZ2VvY29kZTogcXVlcnkgLT4gW3tsYXQsIGxvbiwgZGlzcGxheV9uYW1lLCB0eXBlLCAuLi59XSAqL1xuICAgIGNvbnN0IHJ1blNlYXJjaCA9IGFzeW5jIChxKSA9PiB7XG4gICAgICAgIGlmICghcSB8fCBxLnRyaW0oKS5sZW5ndGggPCAzKSB7IHNldFNlYXJjaEhpdHMoW10pOyByZXR1cm47IH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNldFNlYXJjaEJ1c3kodHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBgaHR0cHM6Ly9ub21pbmF0aW0ub3BlbnN0cmVldG1hcC5vcmcvc2VhcmNoP2Zvcm1hdD1qc29uJmxpbWl0PTYmcT0ke2VuY29kZVVSSUNvbXBvbmVudChxKX1gO1xuICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwgeyBoZWFkZXJzOnsgJ0FjY2VwdCc6J2FwcGxpY2F0aW9uL2pzb24nIH0gfSk7XG4gICAgICAgICAgICBjb25zdCBqID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgICBzZXRTZWFyY2hIaXRzKEFycmF5LmlzQXJyYXkoaikgPyBqIDogW10pO1xuICAgICAgICAgICAgc2V0U2VhcmNoT3Blbih0cnVlKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBzZXRTZWFyY2hIaXRzKFtdKTsgfVxuICAgICAgICBmaW5hbGx5IHsgc2V0U2VhcmNoQnVzeShmYWxzZSk7IH1cbiAgICB9O1xuXG4gICAgLyogZGVib3VuY2VkIHNlYXJjaC1vbi10eXBlICovXG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKHNlYXJjaERlYm91bmNlUmVmLmN1cnJlbnQpIGNsZWFyVGltZW91dChzZWFyY2hEZWJvdW5jZVJlZi5jdXJyZW50KTtcbiAgICAgICAgc2VhcmNoRGVib3VuY2VSZWYuY3VycmVudCA9IHNldFRpbWVvdXQoKCkgPT4gcnVuU2VhcmNoKHNlYXJjaFEpLCA0MDApO1xuICAgICAgICByZXR1cm4gKCkgPT4gc2VhcmNoRGVib3VuY2VSZWYuY3VycmVudCAmJiBjbGVhclRpbWVvdXQoc2VhcmNoRGVib3VuY2VSZWYuY3VycmVudCk7XG4gICAgfSwgW3NlYXJjaFFdKTtcblxuICAgIGNvbnN0IHBpY2tTZWFyY2hIaXQgPSAoaGl0KSA9PiB7XG4gICAgICAgIGNvbnN0IGxhdCA9IE1hdGgucm91bmQoK2hpdC5sYXQgKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgY29uc3QgbG9uID0gTWF0aC5yb3VuZCgraGl0LmxvbiAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIGxhdCwgbG9uLCBjaXR5OmhpdC5kaXNwbGF5X25hbWV9KSk7XG4gICAgICAgIGlmIChtYXBSZWYuY3VycmVudCkgbWFwUmVmLmN1cnJlbnQuc2V0VmlldyhbbGF0LCBsb25dLCBoaXQudHlwZSA9PT0gJ2NpdHknID8gMTEgOiAxNSk7XG4gICAgICAgIHNldFNlYXJjaE9wZW4oZmFsc2UpO1xuICAgICAgICBzZXRTZWFyY2hRKCcnKTtcbiAgICB9O1xuXG4gICAgLyogUmV2ZXJzZS1nZW9jb2RlIGxhdC9sb24gLT4gY2l0eSAvIGNvdW50cnkgdmlhIE5vbWluYXRpbS4gIE5vIEFQSSBrZXkuICovXG4gICAgY29uc3QgcmV2ZXJzZUdlb2NvZGUgPSBhc3luYyAobGF0LCBsb24pID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNldEdlb0J1c3kodHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBgaHR0cHM6Ly9ub21pbmF0aW0ub3BlbnN0cmVldG1hcC5vcmcvcmV2ZXJzZT9mb3JtYXQ9anNvbiZsYXQ9JHtsYXR9Jmxvbj0ke2xvbn0mem9vbT0xMGA7XG4gICAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7IGhlYWRlcnM6IHsgJ0FjY2VwdCc6J2FwcGxpY2F0aW9uL2pzb24nIH0gfSk7XG4gICAgICAgICAgICBjb25zdCBqID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgICBjb25zdCBhID0gai5hZGRyZXNzIHx8IHt9O1xuICAgICAgICAgICAgY29uc3QgY2l0eSA9IGEuY2l0eSB8fCBhLnRvd24gfHwgYS52aWxsYWdlIHx8IGEuaGFtbGV0IHx8IGEuY291bnR5IHx8ICcnO1xuICAgICAgICAgICAgY29uc3QgcmVnaW9uID0gYS5zdGF0ZSB8fCBhLnJlZ2lvbiB8fCAnJztcbiAgICAgICAgICAgIGNvbnN0IGNvdW50cnkgPSBhLmNvdW50cnkgfHwgJyc7XG4gICAgICAgICAgICBjb25zdCBsYWJlbCA9IFtjaXR5LCByZWdpb24sIGNvdW50cnldLmZpbHRlcihCb29sZWFuKS5qb2luKCcsICcpIHx8IGouZGlzcGxheV9uYW1lIHx8ICcnO1xuICAgICAgICAgICAgaWYgKGxhYmVsKSBzZXRDZmcoYyA9PiAoey4uLmMsIGNpdHk6bGFiZWx9KSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogb2ZmbGluZSBvciByYXRlLWxpbWl0ZWQgLT4ga2VlcCBwcmlvciBuYW1lICovIH1cbiAgICAgICAgZmluYWxseSB7IHNldEdlb0J1c3koZmFsc2UpOyB9XG4gICAgfTtcblxuICAgIC8qIEluaXQgTGVhZmxldCBvbiBmaXJzdCByZW5kZXIgb2YgdGhlIG1vZGFsICovXG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKCFtYXBCb3hSZWYuY3VycmVudCB8fCBtYXBSZWYuY3VycmVudCkgcmV0dXJuO1xuICAgICAgICBjb25zdCBtYXAgPSBMLm1hcChtYXBCb3hSZWYuY3VycmVudCwgeyB6b29tQ29udHJvbDogdHJ1ZSwgYXR0cmlidXRpb25Db250cm9sOiB0cnVlIH0pXG4gICAgICAgICAgICAgICAgICAgICAuc2V0VmlldyhbY2ZnLmxhdCwgY2ZnLmxvbl0sIDYpO1xuICAgICAgICBMLnRpbGVMYXllcignaHR0cHM6Ly97c30udGlsZS5vcGVuc3RyZWV0bWFwLm9yZy97en0ve3h9L3t5fS5wbmcnLCB7XG4gICAgICAgICAgICBtYXhab29tOiAxOCxcbiAgICAgICAgICAgIGF0dHJpYnV0aW9uOiAnJmNvcHk7IE9wZW5TdHJlZXRNYXAgY29udHJpYnV0b3JzJyxcbiAgICAgICAgfSkuYWRkVG8obWFwKTtcblxuICAgICAgICBjb25zdCBtYXJrZXIgPSBMLm1hcmtlcihbY2ZnLmxhdCwgY2ZnLmxvbl0sIHsgZHJhZ2dhYmxlOiB0cnVlIH0pLmFkZFRvKG1hcCk7XG4gICAgICAgIG1hcmtlci5iaW5kVG9vbHRpcCgnRHJhZyBtZSBvciBjbGljayBhbnl3aGVyZSBvbiB0aGUgbWFwJywgeyBwZXJtYW5lbnQ6IGZhbHNlIH0pO1xuXG4gICAgICAgIGNvbnN0IGFwcGx5TGF0TG9uID0gKGxhdCwgbG9uKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByID0gKG4pID0+IE1hdGgucm91bmQobiAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBsYXQ6cihsYXQpLCBsb246cihsb24pfSkpO1xuICAgICAgICAgICAgcmV2ZXJzZUdlb2NvZGUocihsYXQpLCByKGxvbikpO1xuICAgICAgICB9O1xuICAgICAgICBtYXJrZXIub24oJ2RyYWdlbmQnLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsbCA9IG1hcmtlci5nZXRMYXRMbmcoKTtcbiAgICAgICAgICAgIGFwcGx5TGF0TG9uKGxsLmxhdCwgbGwubG5nKTtcbiAgICAgICAgfSk7XG4gICAgICAgIG1hcC5vbignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgbWFya2VyLnNldExhdExuZyhlLmxhdGxuZyk7XG4gICAgICAgICAgICBhcHBseUxhdExvbihlLmxhdGxuZy5sYXQsIGUubGF0bG5nLmxuZyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1hcFJlZi5jdXJyZW50ID0gbWFwO1xuICAgICAgICBtYXJrZXJSZWYuY3VycmVudCA9IG1hcmtlcjtcblxuICAgICAgICAvKiBMZWFmbGV0IHJlbmRlcnMgYmxhbmsgaWYgaXQgYm9vdHMgaW5zaWRlIGEgaGlkZGVuIGVsZW1lbnQg4oCUIGtpY2sgaXRcbiAgICAgICAgICAgb25jZSB0aGUgbW9kYWwgYW5pbWF0aW9uIHNldHRsZXMuICovXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gbWFwLmludmFsaWRhdGVTaXplKCksIDI1MCk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7IG1hcC5yZW1vdmUoKTsgbWFwUmVmLmN1cnJlbnQgPSBudWxsOyBtYXJrZXJSZWYuY3VycmVudCA9IG51bGw7IH07XG4gICAgfSwgW10pO1xuXG4gICAgLyogS2VlcCBtYXJrZXIgaW4gc3luYyB3aGVuIHVzZXIgZWRpdHMgbGF0L2xvbiBmaWVsZHMgbWFudWFsbHkgKi9cbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAobWFwUmVmLmN1cnJlbnQgJiYgbWFya2VyUmVmLmN1cnJlbnQpIHtcbiAgICAgICAgICAgIG1hcmtlclJlZi5jdXJyZW50LnNldExhdExuZyhbY2ZnLmxhdCwgY2ZnLmxvbl0pO1xuICAgICAgICAgICAgbWFwUmVmLmN1cnJlbnQucGFuVG8oW2NmZy5sYXQsIGNmZy5sb25dKTtcbiAgICAgICAgfVxuICAgIH0sIFtjZmcubGF0LCBjZmcubG9uXSk7XG5cbiAgICAvKiBHZW9sb2NhdGlvbjogc2lsZW50bHkgbm8tb3AnZCBiZWZvcmUgLS0gaWYgdGhlIGJyb3dzZXIgYmxvY2tlZCB0aGVcbiAgICAgKiByZXF1ZXN0IChIVFRQIG9yaWdpbiA9IG5vdCBhIHNlY3VyZSBjb250ZXh0IG9uIGZpZWxkIGNvbnRyb2xsZXJzLCBvclxuICAgICAqIHRoZSB1c2VyIGRlbmllZCBwZXJtaXNzaW9uIGVhcmxpZXIpIHRoZSBidXR0b24ganVzdCBzYXQgdGhlcmUuXG4gICAgICogTm93IHdlIHN1cmZhY2UgYSBzdGF0ZSAoYnVzeSAvIGVycikgc28gdGhlIG9wZXJhdG9yIGNhbiBzZWUgV0hZIGl0XG4gICAgICogZmFpbGVkIGFuZCBhY3Qgb24gaXQgKHN3aXRjaCB0byBIVFRQUywgcmUtcHJvbXB0LCBvciB1c2UgdGhlIG1hcCkuICovXG4gICAgY29uc3QgW2dlb1N0YXRlLCBzZXRHZW9TdGF0ZV0gPSBSZWFjdC51c2VTdGF0ZShudWxsKTsgICAvLyBudWxsIHwgJ2J1c3knIHwge2Vycn1cbiAgICBjb25zdCB1c2VNeUxvY2F0aW9uID0gKCkgPT4ge1xuICAgICAgICBzZXRHZW9TdGF0ZSgnYnVzeScpO1xuICAgICAgICAvLyBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24gaXMgYHVuZGVmaW5lZGAgb24gSFRUUCBvcmlnaW5zIChDaHJvbWUgNTArKS5cbiAgICAgICAgaWYgKCFuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pIHtcbiAgICAgICAgICAgIHNldEdlb1N0YXRlKHsgZXJyOidCcm93c2VyIGJsb2NrZWQgbG9jYXRpb24gYWNjZXNzIOKAlCBvcGVuIHRoaXMgcGFnZSB2aWEgSFRUUFMuJyB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKFxuICAgICAgICAgICAgKHBvcykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhdCA9IE1hdGgucm91bmQocG9zLmNvb3Jkcy5sYXRpdHVkZSAgKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgICAgICAgICBjb25zdCBsb24gPSBNYXRoLnJvdW5kKHBvcy5jb29yZHMubG9uZ2l0dWRlICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBsYXQsIGxvbn0pKTtcbiAgICAgICAgICAgICAgICBpZiAobWFwUmVmLmN1cnJlbnQpIG1hcFJlZi5jdXJyZW50LnNldFZpZXcoW2xhdCwgbG9uXSwgMTEpO1xuICAgICAgICAgICAgICAgIHJldmVyc2VHZW9jb2RlKGxhdCwgbG9uKTtcbiAgICAgICAgICAgICAgICBzZXRHZW9TdGF0ZShudWxsKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gZXJyLmNvZGU6IDE9UEVSTUlTU0lPTl9ERU5JRUQsIDI9UE9TSVRJT05fVU5BVkFJTEFCTEUsIDM9VElNRU9VVFxuICAgICAgICAgICAgICAgIGNvbnN0IG1zZyA9IGVyciAmJiBlcnIuY29kZSA9PT0gMVxuICAgICAgICAgICAgICAgICAgICA/ICdMb2NhdGlvbiBwZXJtaXNzaW9uIGRlbmllZCDigJQgY2xpY2sgdGhlIGxvY2sgaWNvbiBpbiB0aGUgYWRkcmVzcyBiYXIgYW5kIGFsbG93IGxvY2F0aW9uLidcbiAgICAgICAgICAgICAgICAgICAgOiBlcnIgJiYgZXJyLmNvZGUgPT09IDJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gJ0xvY2F0aW9uIGN1cnJlbnRseSB1bmF2YWlsYWJsZSDigJQgdGhlIGRldmljZSBoYXMgbm8gR1BTIC8gV2ktRmkgZml4IHlldC4nXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGVyciAmJiBlcnIuY29kZSA9PT0gM1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ0xvY2F0aW9uIHJlcXVlc3QgdGltZWQgb3V0IOKAlCB0cnkgYWdhaW4sIG9yIHVzZSB0aGUgbWFwIC8gc2VhcmNoIGJhci4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAoZXJyICYmIGVyci5tZXNzYWdlKSB8fCAnQ291bGQgbm90IHJlYWQgZGV2aWNlIGxvY2F0aW9uLic7XG4gICAgICAgICAgICAgICAgc2V0R2VvU3RhdGUoeyBlcnI6IG1zZyB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7IGVuYWJsZUhpZ2hBY2N1cmFjeTp0cnVlLCB0aW1lb3V0OjEwMDAwLCBtYXhpbXVtQWdlOjAgfVxuICAgICAgICApO1xuICAgIH07XG5cbiAgICAvKiBXaGVuIHVzZXIgY2xpY2tzIFwiU2F2ZSAmIHJldHVyblwiLCBtaXJyb3IgRVhBQ1RMWSB3aGF0IHRoZSBkYXNoYm9hcmQnc1xuICAgICAqIFdlYXRoZXIgYnV0dG9uIGRvZXMgaW4gd2VhdGhlci1zZXR0aW5ncy1tb2RhbC5qcyNzZWxlY3RMb2NhdGlvbjpcbiAgICAgKiAgIDEuIGxvY2FsU3RvcmFnZVsnd2VhdGhlckxvY2F0aW9uJ10gICAgICAgID0gY2hvc2VuIGxvYyAoY2Fub25pY2FsIGtleVxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBkYXNoYm9hcmQgcmVhZHMgb25cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3VudCwgTk9UICdyZWQ1LndlYXRoZXJfbG9jYXRpb24nKS5cbiAgICAgKiAgIDIuIGxvY2FsU3RvcmFnZVsnc2F2ZWRXZWF0aGVyTG9jYXRpb25zJ10gID0gW2xvYywgLi4ub3RoZXJzXSBkZWR1cGVkXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnkgbGF0L2xvbiwgY2FwcGVkIGF0IDIwLlxuICAgICAqICAgMy4gUE9TVCAvYXBpL3dlYXRoZXItbG9jYXRpb24gd2l0aCBhY3RpdmUrZGVmYXVsdCtzYXZlZCBzbyB0aGUgc2FtZVxuICAgICAqICAgICAgbGlzdCBzdXJ2aXZlcyBjcm9zcy1kZXZpY2Ugc2Vzc2lvbnMgZm9yIHNpZ25lZC1pbiB0ZW5hbnRzLlxuICAgICAqXG4gICAgICogV2l0aG91dCBzdGVwIDEgdGhlIGRhc2hib2FyZCdzIGB3ZWF0aGVyTG9jYXRpb25gIHN0YXRlIHNpbGVudGx5IGtlZXBzXG4gICAgICogaXRzIG9sZCB2YWx1ZSAtLSB3aGljaCBpcyBleGFjdGx5IHRoZSBidWcgb3BlcmF0b3JzIHJlcG9ydGVkIGFmdGVyXG4gICAgICogcGlja2luZyBhIGxvY2F0aW9uIGluIFNldHVwIFdhbGsgYW5kIHNlZWluZyB0aGUgZGFzaGJvYXJkJ3Mgd2VhdGhlclxuICAgICAqIHN0cmlwIHJlZnVzZSB0byB1cGRhdGUuICovXG4gICAgY29uc3QgW3NhdmVNc2csIHNldFNhdmVNc2ddID0gUmVhY3QudXNlU3RhdGUobnVsbCk7XG4gICAgY29uc3QgcGVyc2lzdEFuZFNhdmUgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGxvYyA9IHsgbGF0OiBjZmcubGF0LCBsb246IGNmZy5sb24sIG5hbWU6IGNmZy5zaXRlTmFtZSB8fCBjZmcuY2l0eSB9O1xuXG4gICAgICAgIC8vIERlLWR1cCB0aGUgZXhpc3Rpbmcgc2F2ZWQgbGlzdCBieSBsYXQvbG9uIChzYW1lIGtleSB0aGUgZGFzaGJvYXJkXG4gICAgICAgIC8vIHVzZXMpIGFuZCBwdXQgdGhlIG5ldyBwaWNrIGF0IHRoZSB0b3AuICBDYXAgYXQgMjAgdG8gbWF0Y2ggdGhlXG4gICAgICAgIC8vIGRhc2hib2FyZCdzIGJlaGF2aW91ci5cbiAgICAgICAgY29uc3Qga2V5ID0gbG9jLmxhdC50b0ZpeGVkKDQpICsgJywnICsgbG9jLmxvbi50b0ZpeGVkKDQpO1xuICAgICAgICBjb25zdCBkZWR1cGVkID0gc2F2ZWRMb2NzLmZpbHRlcihsID0+IChsLmxhdC50b0ZpeGVkKDQpICsgJywnICsgbC5sb24udG9GaXhlZCg0KSkgIT09IGtleSk7XG4gICAgICAgIGNvbnN0IG5leHRTYXZlZCA9IFtsb2MsIC4uLmRlZHVwZWRdLnNsaWNlKDAsIDIwKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3dlYXRoZXJMb2NhdGlvbicsIEpTT04uc3RyaW5naWZ5KGxvYykpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3NhdmVkV2VhdGhlckxvY2F0aW9ucycsIEpTT04uc3RyaW5naWZ5KG5leHRTYXZlZCkpO1xuICAgICAgICAgICAgLy8gS2VlcCB0aGUgb2xkIGtleSB0b28gLS0gc29tZSBsZWdhY3kgcGx1Zy1pbnMgc3RpbGwgbG9vayBhdCBpdC5cbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1LndlYXRoZXJfbG9jYXRpb24nLCBKU09OLnN0cmluZ2lmeShsb2MpKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBwcml2YXRlIG1vZGUgLS0gaWdub3JlICovIH1cblxuICAgICAgICBsZXQgcGVyc2lzdGVkID0gZmFsc2UsIHdhcm5pbmcgPSAnJztcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCgnL2FwaS93ZWF0aGVyLWxvY2F0aW9uJywge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzonYXBwbGljYXRpb24vanNvbicgfSxcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGFjdGl2ZTogbG9jLCBkZWZhdWx0OiBsb2MsIHNhdmVkOiBuZXh0U2F2ZWQgfSksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IGogPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgICAgIHdpbmRvdy5fbGFzdFdlYXRoZXJMb2NhdGlvblNhdmUgPSBqO1xuICAgICAgICAgICAgcGVyc2lzdGVkID0gISFqLnBlcnNpc3RlZDtcbiAgICAgICAgICAgIHdhcm5pbmcgICA9IGoud2FybmluZyB8fCAnJztcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnW3NldHVwIHdhbGtdIC9hcGkvd2VhdGhlci1sb2NhdGlvbiA8LScsIGopO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB3YXJuaW5nID0gJ05ldHdvcmsgZXJyb3Ig4oCUIHNhdmVkIGxvY2FsbHkgb25seS4nO1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdbc2V0dXAgd2Fsa10gY291bGQgbm90IHBlcnNpc3QgbG9jYXRpb246JywgZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUZWxsIGFueSBvcGVuIGRhc2hib2FyZCB0YWIgdG8gcmUtaHlkcmF0ZS4gIFRoZSBkYXNoYm9hcmRcbiAgICAgICAgLy8gYWxyZWFkeSBsaXN0ZW5zIGZvciBgc3RvcmFnZWAgZXZlbnRzIHdoZW4gYW5vdGhlciB0YWIgd3JpdGVzIHRvXG4gICAgICAgIC8vIGxvY2FsU3RvcmFnZSwgYnV0IG9uIFYxLjkgc29tZSBicm93c2VycyBET04nVCBmaXJlIGBzdG9yYWdlYCBmb3JcbiAgICAgICAgLy8gc2FtZS1vcmlnaW4gd3JpdGVzIGZyb20gdGhpcyBzYW1lIHRhYi4gIEFuIGV4cGxpY2l0IGN1c3RvbSBldmVudFxuICAgICAgICAvLyBtYWtlcyB0aGUgZGFzaGJvYXJkJ3MgcG9sbGluZyBwaWNrIHRoZSBjaGFuZ2UgdXAgaW1tZWRpYXRlbHkgaWZcbiAgICAgICAgLy8gaXQncyBhbHJlYWR5IG1vdW50ZWQgaW4gYW5vdGhlciB0YWIvd2luZG93LlxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdyZWQ1OndlYXRoZXJMb2NhdGlvbkNoYW5nZWQnLFxuICAgICAgICAgICAgICAgIHsgZGV0YWlsOiB7IGFjdGl2ZTogbG9jLCBzYXZlZDogbmV4dFNhdmVkIH0gfSkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IC8qIElFLWxlc3MgZW52aXJvbm1lbnRzIC0tIG5vLW9wICovIH1cblxuICAgICAgICBpZiAocGVyc2lzdGVkKSB7XG4gICAgICAgICAgICBvblNhdmUoKTsgICAgICAgICAgIC8vIGhhcHB5IHBhdGg6IGNsb3NlICsgbWFyayBzdGVwIGRvbmVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8qIFN1cmZhY2UgdGhlIHdhcm5pbmcsIGhvbGQgdGhlIG1vZGFsIG9wZW4gZm9yIDEuNnMgc28gdGhlXG4gICAgICAgICAgICAgKiBvcGVyYXRvciByZWFkcyBpdCwgdGhlbiBjbG9zZS4gIFRoZSBsb2NhbCBjb3B5IGlzIGFscmVhZHlcbiAgICAgICAgICAgICAqIHdyaXR0ZW4sIHNvIHRoZSBkYXNoYm9hcmQgd2lsbCBzdGlsbCBzZWUgdGhlIG5ldyBsb2NhdGlvblxuICAgICAgICAgICAgICogaW4gdGhpcyBicm93c2VyIHNlc3Npb24uICovXG4gICAgICAgICAgICBzZXRTYXZlTXNnKHdhcm5pbmcgfHwgJ1NhdmVkIGxvY2FsbHkgb25seSDigJQgc2lnbiBpbiB0byBzYXZlIHNlcnZlci1zaWRlLicpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHNldFNhdmVNc2cobnVsbCk7IG9uU2F2ZSgpOyB9LCAxNjAwKTtcbiAgICAgICAgfVxuICAgIH07XG5cblxuICAgIHJldHVybiAoXG4gICAgICAgIDxNb2RhbFNoZWxsIHRpdGxlPVwiTG9jYXRpb24gU2V0dGluZ1wiIHN1YnRpdGxlPVwiQ2xpY2sgdGhlIG1hcCwgZHJhZyB0aGUgcGluLCBvciB1c2UgeW91ciBkZXZpY2VcIiBhY2NlbnQ9XCJhbWJlclwiIG9uQ2xvc2U9e29uQ2xvc2V9IG9uU2F2ZT17cGVyc2lzdEFuZFNhdmV9IHNpemU9XCJtYXhcIj5cbiAgICAgICAgICAgIHtzYXZlTXNnICYmIChcbiAgICAgICAgICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwibG9jLXNhdmUtbXNnXCJcbiAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1iLTMgcHgtNCBweS0yLjUgcm91bmRlZC1sZyBiZy1hbWJlci05MDAvMzAgYm9yZGVyIGJvcmRlci1hbWJlci03MDAvNTAgdGV4dC1hbWJlci0yMDAgdGV4dC14cyBmb250LW1vbm9cIj5cbiAgICAgICAgICAgICAgICAgICAg4pqgICB7c2F2ZU1zZ31cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbGc6Z3JpZC1jb2xzLVsxZnJfMzQwcHhdIGdhcC00IGgtZnVsbFwiIHN0eWxlPXt7bWluSGVpZ2h0Oic1NnZoJ319PlxuICAgICAgICAgICAgICAgIHsvKiBNQVAg4oCUIGZpbGxzIHRoZSBsZWZ0IHNpZGUsIHdpdGggYSBzZWFyY2ggYmFyIGZsb2F0aW5nIG9uIHRvcCAqL31cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlXCIgc3R5bGU9e3ttaW5IZWlnaHQ6JzU2dmgnfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgcmVmPXttYXBCb3hSZWZ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgaGVpZ2h0OicxMDAlJywgbWluSGVpZ2h0Oic1NnZoJywgd2lkdGg6JzEwMCUnLCBib3JkZXJSYWRpdXM6JzEycHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OidoaWRkZW4nLCBib3JkZXI6JzFweCBzb2xpZCAjMzM0MTU1JywgYmFja2dyb3VuZDonIzBiMTIyMCcgfX0vPlxuXG4gICAgICAgICAgICAgICAgICAgIHsvKiBTZWFyY2ggYmFyIG92ZXJsYXkg4oCUIHNpdHMgaW4gdGhlIHRvcC1jZW50cmUgb2YgdGhlIG1hcCAqL31cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSB0b3AtMyBsZWZ0LTEvMiAtdHJhbnNsYXRlLXgtMS8yIHotWzUwMF1cIiBzdHlsZT17e3dpZHRoOidtaW4oNTYwcHgsIGNhbGMoMTAwJSAtIDExMHB4KSknfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3NlYXJjaFF9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0U2VhcmNoUShlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uRm9jdXM9eygpID0+IHNlYXJjaEhpdHMubGVuZ3RoICYmIHNldFNlYXJjaE9wZW4odHJ1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwi8J+UjiAgU2VhcmNoIGJ5IGFkZHJlc3MsIGJ1aWxkaW5nLCBvciBwbGFjZSBuYW1l4oCmXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHB4LTQgcHktMi41IHJvdW5kZWQteGwgYmctc2xhdGUtOTAwLzk1IGJvcmRlciBib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtMTAwIHRleHQtc20gcGxhY2Vob2xkZXItc2xhdGUtNTAwIHNoYWRvdy0yeGwgYmFja2Ryb3AtYmx1clwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7b3V0bGluZTonbm9uZSd9fS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlYXJjaEJ1c3kgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJhYnNvbHV0ZSByaWdodC0zIHRvcC0xLzIgLXRyYW5zbGF0ZS15LTEvMiB0ZXh0LWFtYmVyLTQwMCB0ZXh0LXhzXCI+4oCmPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlYXJjaE9wZW4gJiYgc2VhcmNoSGl0cy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSB0b3AtZnVsbCBsZWZ0LTAgcmlnaHQtMCBtdC0xIGJnLXNsYXRlLTkwMC85NyBib3JkZXIgYm9yZGVyLXNsYXRlLTcwMCByb3VuZGVkLXhsIHNoYWRvdy0yeGwgb3ZlcmZsb3ctaGlkZGVuIG1heC1oLTcyIG92ZXJmbG93LXktYXV0byBiYWNrZHJvcC1ibHVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VhcmNoSGl0cy5tYXAoKGgsIGkpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGtleT17aC5wbGFjZV9pZCB8fCBpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gcGlja1NlYXJjaEhpdChoKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCB0ZXh0LWxlZnQgcHgtNCBweS0yLjUgaG92ZXI6YmctYW1iZXItOTAwLzMwIGJvcmRlci1iIGJvcmRlci1zbGF0ZS04MDAgbGFzdDpib3JkZXItYi0wIHRyYW5zaXRpb24tYWxsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LXNsYXRlLTIwMCB0cnVuY2F0ZVwiPntoLmRpc3BsYXlfbmFtZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IG10LTAuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2gudHlwZSB8fCBoLmNsYXNzfSDCtyB7KCtoLmxhdCkudG9GaXhlZCgzKX0sIHsoK2gubG9uKS50b0ZpeGVkKDMpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWFyY2hPcGVuICYmIHNlYXJjaEhpdHMubGVuZ3RoID09PSAwICYmIHNlYXJjaFEubGVuZ3RoID49IDMgJiYgIXNlYXJjaEJ1c3kgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC1mdWxsIGxlZnQtMCByaWdodC0wIG10LTEgYmctc2xhdGUtOTAwLzk3IGJvcmRlciBib3JkZXItc2xhdGUtNzAwIHJvdW5kZWQteGwgcHgtNCBweS0zIHRleHQteHMgdGV4dC1zbGF0ZS00MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vIHJlc3VsdHMgZm9yIFwie3NlYXJjaFF9XCIuICBUcnkgYSBtb3JlIHNwZWNpZmljIHRlcm0uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICB7LyogU0lERSBQQU5FTCAqL31cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktNCBvdmVyZmxvdy15LWF1dG8gcHItMVwiPlxuICAgICAgICAgICAgICAgICAgICB7LyogU2l0ZSBuYW1lIGNvbWJvLWlucHV0LiAgRnJlZS1mb3JtIHR5cGluZyBmb3IgZnJlc2hcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsczsgYSB2aXNpYmxlIGNoZXZyb24gYnV0dG9uIG9uIHRoZSByaWdodCBvcGVuc1xuICAgICAgICAgICAgICAgICAgICAgICAgYSBjdXN0b20gcG9wZG93biBsaXN0aW5nIGV2ZXJ5IHNhdmVkIGxvY2F0aW9uIHB1bGxlZFxuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAvYXBpL3dlYXRoZXItbG9jYXRpb24gKGkuZS4gdGhlIFNBTUUgbGlzdCB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAgIERhc2hib2FyZCdzIFdlYXRoZXIgYnV0dG9uIHN1cmZhY2VzKS4gIFRoaXMgcmVwbGFjZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBlYXJsaWVyIG5hdGl2ZSA8ZGF0YWxpc3Q+IHdoaWNoIHdhcyB0b28gc3VidGxlXG4gICAgICAgICAgICAgICAgICAgICAgICBpbiBkYXJrIHRoZW1lcyAtLSBvcGVyYXRvcnMgd2l0aCBOPjAgc2F2ZWQgZW50cmllc1xuICAgICAgICAgICAgICAgICAgICAgICAgY291bGQgbm90IHRlbGwgYSBkcm9wZG93biBleGlzdGVkLiAqL31cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMS41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU2l0ZSBuYW1lIChzYXZlZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2F2ZWRMb2NzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtbC0yIHRleHQtYW1iZXItNDAwLzgwIG5vcm1hbC1jYXNlIHRyYWNraW5nLW5vcm1hbCB0ZXh0LVsxMHB4XVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwibG9jLXNhdmVkLWhpbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIOKWviB7c2F2ZWRMb2NzLmxlbmd0aH0gc2F2ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmVcIiByZWY9e3NhdmVkUmVmfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXQgcHItOVwiIHZhbHVlPXtjZmcuc2l0ZU5hbWUgfHwgJyd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwibG9jLXNpdGUtbmFtZS1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtzYXZlZExvY3MubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnUGljayBhIHNhdmVkIGxvY2F0aW9uLCBvciB0eXBlIGEgbmV3IG9uZeKApidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2UuZy4gSFEgVG93ZXIsIE5vcnRoIFdpbmcsIFBhdmlsaW9uIELigKYnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IG9uU2l0ZU5hbWVDaGFuZ2UoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkZvY3VzPXsoKSA9PiBzYXZlZExvY3MubGVuZ3RoID4gMCAmJiBzZXRTYXZlZE9wZW4odHJ1ZSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2F2ZWRMb2NzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwibG9jLXNhdmVkLWNoZXZyb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFNhdmVkT3Blbih2ID0+ICF2KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiT3BlbiBzYXZlZCBsb2NhdGlvbnNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwiUGljayBmcm9tIHNhdmVkIGxvY2F0aW9uc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgcmlnaHQtMSB0b3AtMS8yIC10cmFuc2xhdGUteS0xLzIgdy03IGgtNyByb3VuZGVkLW1kIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGJnLWFtYmVyLTcwMC8zMCBob3ZlcjpiZy1hbWJlci02MDAvNTAgYm9yZGVyIGJvcmRlci1hbWJlci01MDAvNDAgdGV4dC1hbWJlci0yMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIxNFwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyLjRcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3t0cmFuc2Zvcm06IHNhdmVkT3BlbiA/ICdyb3RhdGUoMTgwZGVnKScgOiAnbm9uZScsIHRyYW5zaXRpb246J3RyYW5zZm9ybSAuMTVzJ319PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5bGluZSBwb2ludHM9XCI2IDkgMTIgMTUgMTggOVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzYXZlZE9wZW4gJiYgc2F2ZWRMb2NzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwibG9jLXNhdmVkLWRyb3Bkb3duXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSB6LVs2MDBdIGxlZnQtMCByaWdodC0wIHRvcC1mdWxsIG10LTEgYmctc2xhdGUtOTAwIGJvcmRlciBib3JkZXItc2xhdGUtNjAwIHJvdW5kZWQtbGcgc2hhZG93LTJ4bCBtYXgtaC02NCBvdmVyZmxvdy15LWF1dG9cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzYXZlZExvY3MubWFwKGxvYyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNBY3RpdmUgPSAoY2ZnLnNpdGVOYW1lIHx8ICcnKS50cmltKCkgPT09IGxvYy5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PXtsb2MubmFtZX0gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gcGlja1NhdmVkTG9jKGxvYyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2Bsb2Mtc2F2ZWQtb3B0LSR7bG9jLm5hbWV9YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B3LWZ1bGwgdGV4dC1sZWZ0IHB4LTMgcHktMiBib3JkZXItYiBib3JkZXItc2xhdGUtODAwIGxhc3Q6Ym9yZGVyLWItMCBob3ZlcjpiZy1hbWJlci05MDAvMzAgdHJhbnNpdGlvbi1jb2xvcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtpc0FjdGl2ZSA/ICdiZy1hbWJlci05MDAvNTAnIDogJyd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC1zbGF0ZS0xMDAgdHJ1bmNhdGVcIj57bG9jLm5hbWV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIGZvbnQtbW9ubyBtdC0wLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bG9jLmxhdC50b0ZpeGVkKDIpfSwge2xvYy5sb24udG9GaXhlZCgyKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTEgaXRhbGljXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NhdmVkTG9jcy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ1BpY2sgYSBwcmV2aW91c2x5LXNhdmVkIGxvY2F0aW9uLCBvciB0eXBlIGEgbmV3IGxhYmVsIGZvciB0aGlzIHBsYWNlLidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnWW91ciBsYWJlbCBmb3IgdGhpcyBwbGFjZSDigJQgc2hvd24gb24gdGhlIGRhc2hib2FyZCBoZWFkZXIuJ31cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib3JkZXItdCBib3JkZXItc2xhdGUtODAwIHB0LTNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMS41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVzb2x2ZWQgYWRkcmVzcyAvIGNpdHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Z2VvQnVzeSAmJiA8c3BhbiBjbGFzc05hbWU9XCJtbC0yIHRleHQtYW1iZXItNDAwIG5vcm1hbC1jYXNlIHRyYWNraW5nLW5vcm1hbFwiPuKApiByZXNvbHZpbmc8L3NwYW4+fVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIiB2YWx1ZT17Y2ZnLmNpdHl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKT0+c2V0Q2ZnKHsuLi5jZmcsIGNpdHk6ZS50YXJnZXQudmFsdWV9KX0vPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC0zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMS41XCI+TGF0aXR1ZGU8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIiB0eXBlPVwibnVtYmVyXCIgc3RlcD1cIjAuMDAwMVwiIHZhbHVlPXtjZmcubGF0fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpPT5zZXRDZmcoey4uLmNmZywgbGF0OitlLnRhcmdldC52YWx1ZX0pfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0xLjVcIj5Mb25naXR1ZGU8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIiB0eXBlPVwibnVtYmVyXCIgc3RlcD1cIjAuMDAwMVwiIHZhbHVlPXtjZmcubG9ufVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpPT5zZXRDZmcoey4uLmNmZywgbG9uOitlLnRhcmdldC52YWx1ZX0pfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXt1c2VNeUxvY2F0aW9ufVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtnZW9TdGF0ZSA9PT0gJ2J1c3knfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwibG9jLXVzZS1teS1sb2NhdGlvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdy1mdWxsIHB5LTIuNSByb3VuZGVkLWxnIGJvcmRlciB0ZXh0LXhzIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCB0cmFuc2l0aW9uLWNvbG9yc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2dlb1N0YXRlID09PSAnYnVzeSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLWFtYmVyLTkwMC80MCBib3JkZXItYW1iZXItNzAwLzQwIHRleHQtYW1iZXItMjAwIGN1cnNvci13YWl0J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAoZ2VvU3RhdGUgJiYgZ2VvU3RhdGUuZXJyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctcm9zZS05MDAvNDAgYm9yZGVyLXJvc2UtNTAwLzUwIHRleHQtcm9zZS0xMDAgaG92ZXI6Ymctcm9zZS04MDAvNDAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctYW1iZXItNzAwLzcwIGJvcmRlci1hbWJlci01MDAvNDAgdGV4dC1hbWJlci01MCBob3ZlcjpiZy1hbWJlci02MDAvNzAnKX1gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtnZW9TdGF0ZSA9PT0gJ2J1c3knXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAn4o+zICBSZWFkaW5nIGRldmljZSBsb2NhdGlvbuKApidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICfwn5ONICBVc2UgbXkgZGV2aWNlIGxvY2F0aW9uJ31cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIHtnZW9TdGF0ZSAmJiBnZW9TdGF0ZS5lcnIgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cImxvYy1nZW8tZXJyb3JcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCItbXQtMiBweC0zIHB5LTIgcm91bmRlZC1tZCBiZy1yb3NlLTk1MC81MCBib3JkZXIgYm9yZGVyLXJvc2UtNzAwLzQwIHRleHQtWzExcHhdIGxlYWRpbmctc251ZyB0ZXh0LXJvc2UtMjAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGIgY2xhc3NOYW1lPVwidGV4dC1yb3NlLTEwMFwiPkNvdWxkbid0IHJlYWQgbG9jYXRpb24uPC9iPjxici8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1yb3NlLTIwMC85MFwiPntnZW9TdGF0ZS5lcnJ9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBTcGVjaWZpYyBIVFRQLW9yaWdpbiBjYWxsLW91dDogbW9zdCBsaWtlbHkgY2F1c2Ugb24gYSBWMS45IGNvbnRyb2xsZXIuICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cubG9jYXRpb24gJiYgd2luZG93LmxvY2F0aW9uLnByb3RvY29sID09PSAnaHR0cDonICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC0xLjUgdGV4dC1bMTBweF0gdGV4dC1yb3NlLTMwMC84MCBmb250LW1vbm9cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcDogYnJvd3NlcnMgcmVxdWlyZSBIVFRQUyBmb3IgZ2VvbG9jYXRpb24uICBQaWNrIHRoZSBsb2NhdGlvbiBvbiB0aGUgbWFwIG9yIHNlYXJjaCBiYXIgaW5zdGVhZC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICApfVxuXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyLXQgYm9yZGVyLXNsYXRlLTgwMCBwdC0zIG10LTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMlwiPlF1aWNrIGp1bXBzPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonVG9yb250bywgT04nLCAgIGxhdDo0My42NTMyLCBsb246LTc5LjM4MzIsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidOZXcgWW9yaywgTlknLCAgbGF0OjQwLjcxMjgsIGxvbjotNzQuMDA2MCwgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J0xvbmRvbiwgVUsnLCAgICBsYXQ6NTEuNTA3NCwgbG9uOiAtMC4xMjc4LCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonUGFyaXMsIEZSJywgICAgIGxhdDo0OC44NTY2LCBsb246ICAyLjM1MjIsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidUb2t5bywgSlAnLCAgICAgbGF0OjM1LjY3NjIsIGxvbjoxMzkuNjUwMywgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J1N5ZG5leSwgQVUnLCAgICBsYXQ6LTMzLjg2ODgsbG9uOjE1MS4yMDkzLCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXS5tYXAoaiA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PXtqLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIGxhdDpqLmxhdCwgbG9uOmoubG9uLCBjaXR5OmoubmFtZX0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hcFJlZi5jdXJyZW50KSBtYXBSZWYuY3VycmVudC5zZXRWaWV3KFtqLmxhdCwgai5sb25dLCBqLnopO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1sZWZ0IHB4LTIuNSBweS0xLjUgcm91bmRlZC1tZCBiZy1zbGF0ZS04MDAvNzAgYm9yZGVyIGJvcmRlci1zbGF0ZS03MDAgdGV4dC1bMTFweF0gZm9udC1ib2xkIHRleHQtc2xhdGUtMzAwIGhvdmVyOmJnLXNsYXRlLTcwMCBob3Zlcjpib3JkZXItYW1iZXItNTAwLzQwIHRyYW5zaXRpb24tYWxsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ai5uYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBsZWFkaW5nLXJlbGF4ZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIFRpbGVzOiBPcGVuU3RyZWV0TWFwIMK3IEdlb2NvZGU6IE5vbWluYXRpbSAoZnJlZSwgfjEgcmVxL3MpLlxuICAgICAgICAgICAgICAgICAgICAgICAgVXNlZCBmb3IgT3Blbi1NZXRlbyB3ZWF0aGVyIGZlZWQgYW5kIHN1bnJpc2Uvc3Vuc2V0IGVzdGltYXRpb24uXG4gICAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L01vZGFsU2hlbGw+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTGFuZ3VhZ2UgU2V0dGluZyAtLSBtb2RhbFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuZnVuY3Rpb24gTGFuZ3VhZ2VNb2RhbCh7IGNmZywgc2V0Q2ZnLCBvbkNsb3NlLCBvblNhdmUgfSkge1xuICAgIGNvbnN0IGxhbmdzID0gW1xuICAgICAgICB7IGNvZGU6J2VuJywgICAgbGFiZWw6J0VuZ2xpc2gnLCAgICAgICAgICAgICAgICBuYXRpdmU6J0VuZ2xpc2gnICAgIH0sXG4gICAgICAgIHsgY29kZTonemgtQ04nLCBsYWJlbDonQ2hpbmVzZSAoU2ltcGxpZmllZCknLCAgIG5hdGl2ZTon566A5L2T5Lit5paHJyAgICB9LFxuICAgICAgICB7IGNvZGU6J3poLVRXJywgbGFiZWw6J0NoaW5lc2UgKFRyYWRpdGlvbmFsKScsICBuYXRpdmU6J+e5gemrlOS4reaWhycgICAgfSxcbiAgICAgICAgeyBjb2RlOidqYScsICAgIGxhYmVsOidKYXBhbmVzZScsICAgICAgICAgICAgICAgbmF0aXZlOifml6XmnKzoqp4nICAgICAgfSxcbiAgICAgICAgeyBjb2RlOidrbycsICAgIGxhYmVsOidLb3JlYW4nLCAgICAgICAgICAgICAgICAgbmF0aXZlOiftlZzqta3slrQnICAgICAgfSxcbiAgICBdO1xuXG4gICAgLyogT24gU2F2ZSAmIHJldHVybjogd3JpdGUgdGhlIHBpY2tlZCBsYW5ndWFnZSBjb2RlIHRvIHRoZSBzYW1lXG4gICAgICogbG9jYWxTdG9yYWdlIGtleSB0aGUgZGFzaGJvYXJkJ3MgaTE4bi5qcyByZWFkcyAoYGkxOG5fbGFuZ2ApLCBhbmRcbiAgICAgKiBkaXNwYXRjaCB0aGUgYGxhbmdjaGFuZ2VgIGV2ZW50IHNvIGFueSBvcGVuIGRhc2hib2FyZC9jb25maWcgdGFiXG4gICAgICogcGlja3MgaXQgdXAgbGl2ZS4gIFRoaXMgaXMgd2hhdCBtYWtlcyB0aGUgc2V0dXAgd2FsaydzIGxhbmd1YWdlXG4gICAgICogY2hvaWNlIGFjdHVhbGx5IGRyaXZlIHRoZSBkYXNoYm9hcmQgLyBjb25maWcgLyBtYXBwZXIgVUkgLS0gdGhlXG4gICAgICogc2lkZWJhciBzZWxlY3RvciB0aGF0IHVzZWQgdG8gbGl2ZSBpbiB0aGUgZGFzaGJvYXJkIGhlYWRlciBoYXNcbiAgICAgKiBiZWVuIHJlbW92ZWQgKDIwMjYtMDYtMjYpIGFuZCB0aGUgc2V0dXAgd2FsayBpcyBub3cgdGhlIHNpbmdsZVxuICAgICAqIHNvdXJjZSBvZiB0cnV0aCBmb3IgVUkgbGFuZ3VhZ2UuICovXG4gICAgY29uc3QgcGVyc2lzdEFuZFNhdmUgPSAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnaTE4bl9sYW5nJywgY2ZnLmxhbmcpO1xuICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdsYW5nY2hhbmdlJykpO1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdbc2V0dXAgd2Fsa10gaTE4bl9sYW5nIDwtJywgY2ZnLmxhbmcpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1tzZXR1cCB3YWxrXSBjb3VsZCBub3QgcGVyc2lzdCBsYW5ndWFnZTonLCBlKTtcbiAgICAgICAgfVxuICAgICAgICBvblNhdmUoKTtcbiAgICB9O1xuICAgIHJldHVybiAoXG4gICAgICAgIDxNb2RhbFNoZWxsIHRpdGxlPVwiTGFuZ3VhZ2UgU2V0dGluZ1wiIHN1YnRpdGxlPVwiUGljayB5b3VyIGRlZmF1bHQgaW50ZXJmYWNlIGxhbmd1YWdlXCIgYWNjZW50PVwiZW1lcmFsZFwiIG9uQ2xvc2U9e29uQ2xvc2V9IG9uU2F2ZT17cGVyc2lzdEFuZFNhdmV9PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC0zXCI+XG4gICAgICAgICAgICAgICAge2xhbmdzLm1hcChsID0+IChcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e2wuY29kZX0gb25DbGljaz17KCk9PnNldENmZyh7Li4uY2ZnLCBsYW5nOmwuY29kZX0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHRleHQtbGVmdCBwLTMgcm91bmRlZC14bCBib3JkZXItMiB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2NmZy5sYW5nID09PSBsLmNvZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JvcmRlci1lbWVyYWxkLTUwMCBiZy1lbWVyYWxkLTkwMC8yMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JvcmRlci1zbGF0ZS03MDAgYmctc2xhdGUtODAwLzQwIGhvdmVyOmJnLXNsYXRlLTgwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayB0ZXh0LXNsYXRlLTUwMFwiPntsLmNvZGV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1ibGFjayB0ZXh0LXNsYXRlLTIwMFwiPntsLm5hdGl2ZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTFweF0gdGV4dC1zbGF0ZS01MDBcIj57bC5sYWJlbH08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Nb2RhbFNoZWxsPlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFBsdWctaW4gU2V0dGluZyAtLSBtb2RhbCB3LyBsaXN0ICsgdXBsb2FkIHpvbmVcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbi8qIFBlci1wbHVnLWluIG1vY2sgY29uZmlndXJhdGlvbiBmaWVsZHMuICBLZXlzIG1hcCB0byBwbHVnLWluIGBpZGAuICovXG5jb25zdCBQTFVHSU5fQ09ORklHX0ZJRUxEUyA9IHtcbiAgICB3ZWF0aGVyOiAgICBbXG4gICAgICAgIHsga2V5Oidwcm92aWRlcicsICBsYWJlbDonUHJvdmlkZXInLCAgICAgICAgICB0eXBlOidzZWxlY3QnLCAgb3B0aW9uczpbJ09wZW4tTWV0ZW8nLCdOV1MnLCdFQ01XRiddLCBkZWY6J09wZW4tTWV0ZW8nIH0sXG4gICAgICAgIHsga2V5OidyZWZyZXNoJywgICBsYWJlbDonUmVmcmVzaCBpbnRlcnZhbCcsICB0eXBlOidzZWxlY3QnLCAgb3B0aW9uczpbJzEgbWluJywnNSBtaW4nLCcxNSBtaW4nLCczMCBtaW4nLCcxIGgnXSwgZGVmOicxNSBtaW4nIH0sXG4gICAgICAgIHsga2V5OidjYWNoZScsICAgICBsYWJlbDonQ2FjaGUgVFRMIChtaW4pJywgICB0eXBlOidudW1iZXInLCAgZGVmOjMwIH0sXG4gICAgXSxcbiAgICBnaXZvbmk6ICAgICBbXG4gICAgICAgIHsga2V5OidjbGltYXRlJywgICBsYWJlbDonQ2xpbWF0ZSBtb2RlbCcsICAgICB0eXBlOidzZWxlY3QnLCAgb3B0aW9uczpbJ0dpdm9uaSAxOTkyJywnQVNIUkFFIDU1JywnQWRhcHRpdmUnXSwgZGVmOidHaXZvbmkgMTk5MicgfSxcbiAgICAgICAgeyBrZXk6J21hc3NpdmUnLCAgIGxhYmVsOidIZWF2eXdlaWdodCBjb25zdHJ1Y3Rpb24nLCAgdHlwZTondG9nZ2xlJywgZGVmOmZhbHNlIH0sXG4gICAgXSxcbiAgICBzd2VldF9zcG90OiBbXG4gICAgICAgIHsga2V5Oid0cmFja2luZycsICBsYWJlbDonVHJhY2sgb3V0ZG9vciBSSCcsICB0eXBlOid0b2dnbGUnLCBkZWY6dHJ1ZSB9LFxuICAgICAgICB7IGtleTonaHlzdCcsICAgICAgbGFiZWw6J0h5c3RlcmVzaXMgKCUgUkgpJywgdHlwZTonbnVtYmVyJywgZGVmOjIgfSxcbiAgICBdLFxuICAgIGczNjogICAgICAgIFtcbiAgICAgICAgeyBrZXk6J21vZGUnLCAgICAgIGxhYmVsOidTZXF1ZW5jZSBtb2RlJywgICAgIHR5cGU6J3NlbGVjdCcsICBvcHRpb25zOlsnU2luZ2xlLXpvbmUgVkFWJywnTXVsdGktem9uZSBWQVYnLCdET0FTIHcvIEZDVSddLCBkZWY6J011bHRpLXpvbmUgVkFWJyB9LFxuICAgICAgICB7IGtleTondmVyYm9zZScsICAgbGFiZWw6J1ZlcmJvc2UgbG9nZ2luZycsICAgdHlwZTondG9nZ2xlJywgZGVmOmZhbHNlIH0sXG4gICAgXSxcbiAgICBkaWJ0OiAgICAgICBbXG4gICAgICAgIHsga2V5Oidob3N0JywgICAgICBsYWJlbDonQnJpZGdlIGhvc3QnLCAgICAgICB0eXBlOid0ZXh0JywgICBkZWY6JzE5Mi4xNjguMS4xMDAnIH0sXG4gICAgICAgIHsga2V5Oidwb3J0JywgICAgICBsYWJlbDonVGVsZWdyYW0gcG9ydCcsICAgICB0eXBlOidudW1iZXInLCBkZWY6NDc4MDggfSxcbiAgICAgICAgeyBrZXk6J3BvbGxfbXMnLCAgIGxhYmVsOidQb2xsIGludGVydmFsIChtcyknLHR5cGU6J251bWJlcicsIGRlZjoyMDAwIH0sXG4gICAgXSxcbiAgICBsaWdodGluZzogICBbXG4gICAgICAgIHsga2V5OidnYXRld2F5JywgICBsYWJlbDonTW9kYnVzIGdhdGV3YXkgSVAnLCB0eXBlOid0ZXh0JywgICBkZWY6JzEwLjAuMC41MCcgfSxcbiAgICAgICAgeyBrZXk6J3VuaXRfaWQnLCAgIGxhYmVsOidVbml0IElEJywgICAgICAgICAgIHR5cGU6J251bWJlcicsIGRlZjoxIH0sXG4gICAgICAgIHsga2V5Oid0Y3BfcG9ydCcsICBsYWJlbDonVENQIHBvcnQnLCAgICAgICAgICB0eXBlOidudW1iZXInLCBkZWY6NTAyIH0sXG4gICAgXSxcbn07XG5cbmZ1bmN0aW9uIFBsdWdpbnNNb2RhbCh7IGNmZywgc2V0Q2ZnLCBvbkNsb3NlLCBvblNhdmUgfSkge1xuICAgIGNvbnN0IEFMTCA9IFtcbiAgICAgICAgeyBpZDond2VhdGhlcicsICAgICBuYW1lOidXZWF0aGVyJywgICAgICAgICBkZXNjOidPcGVuLU1ldGVvIE9BIGZlZWQnLCAgICAgICAgICB2ZXI6JzIuMS4wJyB9LFxuICAgICAgICB7IGlkOidnaXZvbmknLCAgICAgIG5hbWU6J0dpdm9uaSBFbmdpbmUnLCAgIGRlc2M6J0NsaW1hdGUtc3RyYXRlZ3kgb3ZlcmxheScsICAgIHZlcjonMS4zLjQnIH0sXG4gICAgICAgIHsgaWQ6J3N3ZWV0X3Nwb3QnLCAgbmFtZTonU3dlZXQtU3BvdCBSSCcsICAgZGVzYzonQWRqdXN0YWJsZSBSSCBiYW5kJywgICAgICAgICAgdmVyOicxLjAuMScgfSxcbiAgICAgICAgeyBpZDonZzM2JywgICAgICAgICBuYW1lOidHMzYgU2VxdWVuY2VzJywgICBkZXNjOidBU0hSQUUgR3VpZGVsaW5lIDM2JywgICAgICAgICB2ZXI6JzAuOS4yJyB9LFxuICAgICAgICB7IGlkOidkaWJ0JywgICAgICAgIG5hbWU6J0RJQlQgQnJpZGdlJywgICAgIGRlc2M6J0RlbHRhIENvbnRyb2xzIChESUJUKSBCQUNuZXQgYnJpZGdlJywgICAgICAgICAgIHZlcjonMC40LjAnIH0sXG4gICAgICAgIHsgaWQ6J2xpZ2h0aW5nJywgICAgbmFtZTonTGlnaHRpbmcgKFJlZDUpJywgZGVzYzonVjMuMCBNb2RidXMgVENQIGNsaWVudCcsICAgICAgdmVyOicwLjEuMC1iZXRhJyB9LFxuICAgIF07XG4gICAgY29uc3QgdG9nZ2xlID0gKGlkKSA9PiBzZXRDZmcoYyA9PiAoe1xuICAgICAgICAuLi5jLFxuICAgICAgICBlbmFibGVkOiBjLmVuYWJsZWQuaW5jbHVkZXMoaWQpID8gYy5lbmFibGVkLmZpbHRlcih4ID0+IHggIT09IGlkKSA6IFsuLi5jLmVuYWJsZWQsIGlkXVxuICAgIH0pKTtcblxuICAgIC8qIGV4cGFuc2lvbiBzdGF0ZSDigJQgd2hpY2ggcGx1Zy1pbidzIFwiQ29uZmlndXJlXCIgcGFuZWwgaXMgb3BlbiAqL1xuICAgIGNvbnN0IFtleHBhbmRlZElkLCBzZXRFeHBhbmRlZElkXSA9IFJlYWN0LnVzZVN0YXRlKG51bGwpO1xuXG4gICAgY29uc3QgdXBkYXRlRmllbGQgPSAocGx1Z2luSWQsIGZpZWxkS2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgICBzZXRDZmcoYyA9PiAoe1xuICAgICAgICAgICAgLi4uYyxcbiAgICAgICAgICAgIGZpZWxkczogeyAuLi4oYy5maWVsZHMgfHwge30pLCBbcGx1Z2luSWRdOiB7IC4uLigoYy5maWVsZHMgfHwge30pW3BsdWdpbklkXSB8fCB7fSksIFtmaWVsZEtleV06IHZhbHVlIH0gfVxuICAgICAgICB9KSk7XG4gICAgfTtcblxuICAgIGNvbnN0IGZpZWxkVmFsID0gKHBsdWdpbklkLCBmaWVsZCkgPT4ge1xuICAgICAgICBjb25zdCBzdG9yZWQgPSBjZmcuZmllbGRzICYmIGNmZy5maWVsZHNbcGx1Z2luSWRdICYmIGNmZy5maWVsZHNbcGx1Z2luSWRdW2ZpZWxkLmtleV07XG4gICAgICAgIHJldHVybiBzdG9yZWQgIT09IHVuZGVmaW5lZCA/IHN0b3JlZCA6IGZpZWxkLmRlZjtcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPE1vZGFsU2hlbGwgdGl0bGU9XCJQbHVnLWluIFNldHRpbmdcIiBzdWJ0aXRsZT1cIkVuYWJsZSwgdXBsb2FkIG9yIG1vZGlmeSBwbHVnLWluc1wiIGFjY2VudD1cInBpbmtcIiBvbkNsb3NlPXtvbkNsb3NlfSBvblNhdmU9e29uU2F2ZX0gc2l6ZT1cIndpZGVcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0zIG1heC1oLVs2MHZoXSBvdmVyZmxvdy15LWF1dG8gcHItMVwiPlxuICAgICAgICAgICAgICAgIHtBTEwubWFwKHAgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvbiA9IGNmZy5lbmFibGVkLmluY2x1ZGVzKHAuaWQpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBleHBhbmRlZCA9IGV4cGFuZGVkSWQgPT09IHAuaWQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkcyA9IFBMVUdJTl9DT05GSUdfRklFTERTW3AuaWRdIHx8IFtdO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e3AuaWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHJvdW5kZWQteGwgYm9yZGVyIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7b24gPyAnYm9yZGVyLXBpbmstNTAwLzQwIGJnLXBpbmstOTAwLzEwJyA6ICdib3JkZXItc2xhdGUtNzAwIGJnLXNsYXRlLTgwMC80MCd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7ZXhwYW5kZWQgPyAncmluZy0xIHJpbmctcGluay01MDAvMzAnIDogJyd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcC0zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1ibGFjayB0ZXh0LXNsYXRlLTEwMFwiPntwLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibWwtMiB0ZXh0LVsxMHB4XSBmb250LW1vbm8gdGV4dC1zbGF0ZS01MDBcIj52e3AudmVyfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtc2xhdGUtNDAwXCI+e3AuZGVzY308L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gdG9nZ2xlKHAuaWQpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17YHBsdWdpbi10b2dnbGUtJHtwLmlkfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTMgcHktMSByb3VuZGVkLW1kIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayBib3JkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7b24gPyAnYm9yZGVyLXBpbmstNTAwLzYwIHRleHQtcGluay0zMDAgYmctcGluay05MDAvMzAnIDogJ2JvcmRlci1zbGF0ZS02MDAgdGV4dC1zbGF0ZS00MDAgYmctc2xhdGUtODAwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7b24gPyAnRW5hYmxlZCcgOiAnRGlzYWJsZWQnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHNldEV4cGFuZGVkSWQoZXhwYW5kZWQgPyBudWxsIDogcC5pZCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgcGx1Z2luLWNvbmZpZy0ke3AuaWR9YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHgtMyBweS0xIHJvdW5kZWQtbWQgdGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIGJvcmRlciB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtleHBhbmRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JvcmRlci1waW5rLTUwMCBiZy1waW5rLTkwMC8zMCB0ZXh0LXBpbmstMjAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JvcmRlci1zbGF0ZS02MDAgdGV4dC1zbGF0ZS00MDAgYmctc2xhdGUtODAwIGhvdmVyOmJnLXNsYXRlLTcwMCBob3Zlcjpib3JkZXItcGluay01MDAvNTAgaG92ZXI6dGV4dC1waW5rLTMwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2V4cGFuZGVkID8gJ0Nsb3NlIOKWtCcgOiAnQ29uZmlndXJlIOKWvid9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2V4cGFuZGVkICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJweC00IHBiLTQgYm9yZGVyLXQgYm9yZGVyLXBpbmstNTAwLzIwIGJnLXNsYXRlLTk1MC80MFwiIGRhdGEtdGVzdGlkPXtgcGx1Z2luLWNvbmZpZy1wYW5lbC0ke3AuaWR9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZmllbGRzLmxlbmd0aCA9PT0gMCA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtc2xhdGUtNTAwIGl0YWxpYyBweS0zXCI+Tm8gY29uZmlndXJhYmxlIG9wdGlvbnMgZm9yIHRoaXMgcGx1Zy1pbiB5ZXQuPC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbWQ6Z3JpZC1jb2xzLTIgZ2FwLTMgcHQtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZmllbGRzLm1hcChmID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHYgPSBmaWVsZFZhbChwLmlkLCBmKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e2Yua2V5fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwIGJsb2NrIG1iLTFcIj57Zi5sYWJlbH08L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi50eXBlID09PSAnc2VsZWN0JyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0IGN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3Z9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlRmllbGQocC5pZCwgZi5rZXksIGUudGFyZ2V0LnZhbHVlKX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2Yub3B0aW9ucy5tYXAobyA9PiA8b3B0aW9uIGtleT17b30gdmFsdWU9e299PntvfTwvb3B0aW9uPil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2YudHlwZSA9PT0gJ251bWJlcicgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJudW1iZXJcIiBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3Z9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGVGaWVsZChwLmlkLCBmLmtleSwgK2UudGFyZ2V0LnZhbHVlKX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi50eXBlID09PSAndGV4dCcgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt2fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlRmllbGQocC5pZCwgZi5rZXksIGUudGFyZ2V0LnZhbHVlKX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi50eXBlID09PSAndG9nZ2xlJyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHVwZGF0ZUZpZWxkKHAuaWQsIGYua2V5LCAhdil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHctZnVsbCBweS0yIHJvdW5kZWQtbGcgdGV4dC14cyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgYm9yZGVyIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3ZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1waW5rLTcwMC80MCBib3JkZXItcGluay01MDAvNjAgdGV4dC1waW5rLTIwMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1zbGF0ZS04MDAgYm9yZGVyLXNsYXRlLTYwMCB0ZXh0LXNsYXRlLTQwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3YgPyAnT04nIDogJ09GRid9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1lbmQgZ2FwLTIgbXQtNCBwdC0zIGJvcmRlci10IGJvcmRlci1zbGF0ZS04MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXNldCB0aGlzIHBsdWctaW4ncyBmaWVsZHMgdG8gZGVmYXVsdHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRDZmcoYyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHQgPSB7IC4uLihjLmZpZWxkcyB8fCB7fSkgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG5leHRbcC5pZF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IC4uLmMsIGZpZWxkczogbmV4dCB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTMgcHktMS41IHJvdW5kZWQtbWQgdGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIGJvcmRlciBib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtNDAwIGhvdmVyOmJnLXNsYXRlLTgwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXNldCBkZWZhdWx0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gc2V0RXhwYW5kZWRJZChudWxsKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTMgcHktMS41IHJvdW5kZWQtbWQgdGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIGJnLXBpbmstNjAwIGhvdmVyOmJnLXBpbmstNTAwIHRleHQtd2hpdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRG9uZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTUgcC00IGJvcmRlci0yIGJvcmRlci1kYXNoZWQgYm9yZGVyLXNsYXRlLTcwMCByb3VuZGVkLXhsIHRleHQtY2VudGVyIGhvdmVyOmJvcmRlci1waW5rLTUwMC80MCB0cmFuc2l0aW9uLWFsbCBjdXJzb3ItcG9pbnRlclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC0zeGwgbWItMVwiPuKktDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LWJsYWNrIHRleHQtc2xhdGUtMzAwXCI+RHJvcCBhIC5weSAvIC56aXAgLyAucmVkNSBwbHVnLWluIGhlcmU8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzExcHhdIHRleHQtc2xhdGUtNTAwIG10LTFcIj5vciBjbGljayB0byBjaG9vc2UgYSBmaWxlIChtb2NrIOKAlCBub3Qgd2lyZWQpPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Nb2RhbFNoZWxsPlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE1vZGFsIFNoZWxsIC0tIHNoYXJlZFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuZnVuY3Rpb24gTW9kYWxTaGVsbCh7IHRpdGxlLCBzdWJ0aXRsZSwgYWNjZW50PSdpbmRpZ28nLCBvbkNsb3NlLCBvblNhdmUsIHNpemU9JycsIGNoaWxkcmVuIH0pIHtcbiAgICBjb25zdCBjb2xvck1hcCA9IHtcbiAgICAgICAgaW5kaWdvOicjODE4Y2Y4JywgYW1iZXI6JyNmYmJmMjQnLCBlbWVyYWxkOicjMzRkMzk5JywgcGluazonI2Y0NzJiNidcbiAgICB9O1xuICAgIGNvbnN0IGMgPSBjb2xvck1hcFthY2NlbnRdIHx8ICcjODE4Y2Y4JztcbiAgICBjb25zdCBzaXplTWFwID0ge1xuICAgICAgICB3aWRlOiAnbWF4LXctMnhsJyxcbiAgICAgICAgbWFwOiAgJ21heC13LTN4bCcsXG4gICAgICAgIG1heDogICdtYXgtdy1bOTZ2d10gdy1bOTZ2d10gaC1bOTJ2aF0nLFxuICAgIH07XG4gICAgY29uc3Qgd2lkdGggPSBzaXplTWFwW3NpemVdIHx8ICdtYXgtdy1tZCc7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaXhlZCBpbnNldC0wIHotNTAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgbW9kYWwtYmFja2Ryb3BcIiBvbkNsaWNrPXtvbkNsb3NlfT5cbiAgICAgICAgICAgIHsvKiBGbGV4LWNvbHVtbiBzaGVsbDogaGVhZGVyIChmaXhlZCkgKyBzY3JvbGxhYmxlIGNvbnRlbnQgKyBzdGlja3kgZm9vdGVyLlxuICAgICAgICAgICAgICAgIENyaXRpY2FsIGZvciBzaXplPVwibWF4XCIgd2hlcmUgY2hpbGRyZW4gYWxvbmUgZXhjZWVkIHRoZSBtb2RhbCBoZWlnaHRcbiAgICAgICAgICAgICAgICBhbmQgd291bGQgb3RoZXJ3aXNlIHB1c2ggdGhlIFNhdmUgJiByZXR1cm4gYnV0dG9uIGJlbG93IHRoZSB2aWV3cG9ydC4gKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YGJnLXNsYXRlLTkwMCBib3JkZXItMiByb3VuZGVkLTJ4bCB3LWZ1bGwgJHt3aWR0aH0gbXgtNCBmYWRlLXVwIGZsZXggZmxleC1jb2xgfVxuICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX1cbiAgICAgICAgICAgICAgICAgc3R5bGU9e3tib3JkZXJDb2xvcjpgJHtjfTY2YCwgbWF4SGVpZ2h0OiAnOTJ2aCd9fT5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtc3RhcnQganVzdGlmeS1iZXR3ZWVuIHAtNiBwYi00IGJvcmRlci1iIGJvcmRlci1zbGF0ZS04MDAvNjAgc2hyaW5rLTBcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LWxnIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdFwiIHN0eWxlPXt7Y29sb3I6Y319Pnt0aXRsZX08L2gzPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXNsYXRlLTUwMCBtdC0xXCI+e3N1YnRpdGxlfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJtb2RhbC1jbG9zZVwiIG9uQ2xpY2s9e29uQ2xvc2V9IGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNTAwIGhvdmVyOnRleHQtd2hpdGUgdGV4dC0yeGwgbGVhZGluZy1ub25lXCI+w5c8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMSBtaW4taC0wIG92ZXJmbG93LXktYXV0byBweC02IHB5LTVcIj5cbiAgICAgICAgICAgICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1lbmQgZ2FwLTMgcHgtNiBweS00IGJvcmRlci10IGJvcmRlci1zbGF0ZS04MDAgc2hyaW5rLTAgYmctc2xhdGUtOTAwIHJvdW5kZWQtYi0yeGxcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cIm1vZGFsLWNhbmNlbFwiIG9uQ2xpY2s9e29uQ2xvc2V9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtNCBweS0yIHJvdW5kZWQtbGcgYmctc2xhdGUtODAwIGJvcmRlciBib3JkZXItc2xhdGUtNzAwIHRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIHRleHQtc2xhdGUtNDAwIGhvdmVyOmJnLXNsYXRlLTcwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgQ2FuY2VsXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwibW9kYWwtc2F2ZVwiIG9uQ2xpY2s9e29uU2F2ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC01IHB5LTIgcm91bmRlZC1sZyB0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayB0ZXh0LXdoaXRlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6YywgYm94U2hhZG93OmAwIDAgMTJweCAke2N9NTVgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICBTYXZlICYgcmV0dXJuIOKck1xuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG4vKiBtb3VudCAqL1xuUmVhY3RET00uY3JlYXRlUm9vdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpKS5yZW5kZXIoPEFwcC8+KTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUFBLE1BQUEsR0FBOEJDLEtBQUs7RUFBM0JDLFFBQVEsR0FBQUYsTUFBQSxDQUFSRSxRQUFRO0VBQUVDLE9BQU8sR0FBQUgsTUFBQSxDQUFQRyxPQUFPOztBQUV6QjtBQUNBO0FBQ0E7QUFDQSxJQUFNQyxLQUFLLEdBQUcsQ0FDVjtBQUNBO0VBQUVDLEdBQUcsRUFBQyxLQUFLO0VBQU9DLEtBQUssRUFBQyxtQkFBbUI7RUFBS0MsR0FBRyxFQUFDLDBCQUEwQjtFQUFHQyxJQUFJLEVBQUMsTUFBTTtFQUFHQyxTQUFTLEVBQUMsU0FBUztFQUFFQyxNQUFNLEVBQUM7QUFBUyxDQUFDLEVBQ3JJO0VBQUVMLEdBQUcsRUFBQyxVQUFVO0VBQUVDLEtBQUssRUFBQyxrQkFBa0I7RUFBTUMsR0FBRyxFQUFDLG1CQUFtQjtFQUFVQyxJQUFJLEVBQUMsT0FBTztFQUFFQyxTQUFTLEVBQUMsU0FBUztFQUFFQyxNQUFNLEVBQUM7QUFBUyxDQUFDLEVBQ3JJO0VBQUVMLEdBQUcsRUFBQyxVQUFVO0VBQUVDLEtBQUssRUFBQyxrQkFBa0I7RUFBTUMsR0FBRyxFQUFDLHVCQUF1QjtFQUFNQyxJQUFJLEVBQUMsT0FBTztFQUFFQyxTQUFTLEVBQUMsU0FBUztFQUFFQyxNQUFNLEVBQUM7QUFBUyxDQUFDLEVBQ3JJO0VBQUVMLEdBQUcsRUFBQyxTQUFTO0VBQUdDLEtBQUssRUFBQyxpQkFBaUI7RUFBT0MsR0FBRyxFQUFDLHdCQUF3QjtFQUFLQyxJQUFJLEVBQUMsT0FBTztFQUFFQyxTQUFTLEVBQUMsU0FBUztFQUFFQyxNQUFNLEVBQUM7QUFBUyxDQUFDO0FBQ3JJO0FBQ0o7QUFDQTtBQUNJO0VBQUVMLEdBQUcs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LENBQUMsR0FBR1IsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFLElBQUksR0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLEdBQUMsSUFBSSxDQUFDLEVBQUUsR0FBR0MsUUFBUSxDQUFDO0VBQ3JFLElBQU1RLElBQUksR0FBRyxDQUFDLEdBQUdYLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUVOLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUVBLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUM3RixJQUFNa0IsR0FBRyxHQUFJLENBQUMsR0FBR1osSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRU4sS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRUEsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0VBQzdGLElBQU1tQixJQUFJLEdBQUcsQ0FBQyxHQUFHYixJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFTixLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUVBLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFDaEUsQ0FBQyxFQUFFLEVBQUVBLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFB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