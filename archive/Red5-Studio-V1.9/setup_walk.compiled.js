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
var STEPS = [
/* Walk order is the pentagon traversal: top → upper-right → lower-right → lower-left → upper-left.
   Labels intentionally drop the redundant "Setting" suffix so the
   main heading inside each circle can render in one line at a larger
   font weight. */
{
  key: 'psy',
  label: 'Psy Chart',
  sub: 'Givoni · RH range · axis',
  kind: 'page',
  iconColor: '#818cf8',
  accent: 'indigo'
}, {
  key: 'location',
  label: 'Location',
  sub: 'City · lat / long',
  kind: 'modal',
  iconColor: '#fbbf24',
  accent: 'amber'
}, {
  key: 'language',
  label: 'Language',
  sub: 'EN · CS · CT · JP · KO · …',
  kind: 'modal',
  iconColor: '#34d399',
  accent: 'emerald'
}, {
  key: 'plugins',
  label: 'Plug-in',
  sub: 'List · upload · modify',
  kind: 'modal',
  iconColor: '#f472b6',
  accent: 'pink'
}, {
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
  }, /*#__PURE__*/React.createElement("a", {
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
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("mask", {
    id: "pentagon-ring-mask",
    maskUnits: "userSpaceOnUse",
    x: "0",
    y: "0",
    width: "100",
    height: "100"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "0",
    width: "100",
    height: "100",
    fill: "white"
  }), STEPS.map((_, i) => {
    var a = (-90 + i * 72) * Math.PI / 180;
    var cx = 50 + 40 * Math.cos(a);
    var cy = 50 + 40 * Math.sin(a);
    /* 17.5 % radius = same as the tile circle's
       half-width (35 % diameter); +0.5 % nudge
       keeps the mask edge inside the coloured
       ring so the white arc doesn't ALMOST-touch
       the ring border with anti-aliased fringe. */
    return /*#__PURE__*/React.createElement("circle", {
      key: i,
      cx: cx,
      cy: cy,
      r: "18",
      fill: "black"
    });
  }))), /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: "40",
    fill: "none",
    stroke: "rgba(255,255,255,0.85)",
    strokeWidth: "0.56",
    mask: "url(#pentagon-ring-mask)"
  })), /*#__PURE__*/React.createElement("div", {
    "data-testid": "setup-progress-center",
    className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none select-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[22px] sm:text-[26px] font-black uppercase tracking-tight whitespace-nowrap leading-none\n                                     ".concat(completeCount === 5 ? 'text-emerald-400' : 'text-slate-300')
  }, completeCount, "/5"), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mt-2"
  }, "Done"))), /*#__PURE__*/React.createElement("div", {
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
    className: "text-[22px] sm:text-[26px] font-black uppercase tracking-tight whitespace-nowrap leading-none mt-1.5",
    style: {
      color: step.iconColor
    }
  }, step.label), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500 text-[10px] sm:text-[11px] leading-snug px-3 mt-1 line-clamp-2"
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBfd2Fsay5jb21waWxlZC5qcyIsIm5hbWVzIjpbIl9SZWFjdCIsIlJlYWN0IiwidXNlU3RhdGUiLCJ1c2VNZW1vIiwiU1RFUFMiLCJrZXkiLCJsYWJlbCIsInN1YiIsImtpbmQiLCJpY29uQ29sb3IiLCJhY2NlbnQiLCJocmVmIiwiQXBwIiwiX3VzZVN0YXRlIiwicHN5IiwibG9jYXRpb24iLCJsYW5ndWFnZSIsInBsdWdpbnMiLCJyZXBhaXIiLCJfdXNlU3RhdGUyIiwiX3NsaWNlZFRvQXJyYXkiLCJkb25lIiwic2V0RG9uZSIsIl91c2VTdGF0ZTMiLCJfdXNlU3RhdGU0Iiwicm91dGUiLCJzZXRSb3V0ZSIsIl91c2VTdGF0ZTUiLCJfdXNlU3RhdGU2IiwibW9kYWwiLCJzZXRNb2RhbCIsIl91c2VTdGF0ZTciLCJnaXZvbmkiLCJyaFByZXNldCIsInJoTG8iLCJyaEhpIiwidExvIiwidEhpIiwidGhlbWUiLCJkYXJrTGV2ZWwiLCJfdXNlU3RhdGU4IiwicHN5Q2ZnIiwic2V0UHN5Q2ZnIiwiX3VzZVN0YXRlOSIsInNpdGVOYW1lIiwiY2l0eSIsImxhdCIsImxvbiIsIl91c2VTdGF0ZTAiLCJsb2NDZmciLCJzZXRMb2NDZmciLCJfdXNlU3RhdGUxIiwidiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJhbGxvd2VkIiwiaW5kZXhPZiIsImxhbmciLCJlIiwiX3VzZVN0YXRlMTAiLCJsYW5nQ2ZnIiwic2V0TGFuZ0NmZyIsIl91c2VTdGF0ZTExIiwiZW5hYmxlZCIsIl91c2VTdGF0ZTEyIiwicGx1Z2luQ2ZnIiwic2V0UGx1Z2luQ2ZnIiwiY29tcGxldGVDb3VudCIsIk9iamVjdCIsInZhbHVlcyIsImZpbHRlciIsIkJvb2xlYW4iLCJsZW5ndGgiLCJmaW5pc2giLCJkIiwiX29iamVjdFNwcmVhZCIsImNyZWF0ZUVsZW1lbnQiLCJQc3lDaGFydFNldHRpbmdQYWdlIiwiY2ZnIiwic2V0Q2ZnIiwib25CYWNrIiwib25TYXZlIiwiY2xhc3NOYW1lIiwib25DbGljayIsInNldEl0ZW0iLCJzdHlsZSIsIndpZHRoIiwiYXNwZWN0UmF0aW8iLCJhbmltYXRpb25EZWxheSIsIm1hcCIsInMiLCJpIiwiYW5nbGVEZWciLCJhbmdsZSIsIk1hdGgiLCJQSSIsInIiLCJ4IiwiY29zIiwieSIsInNpbiIsIkNpcmNsZVRpbGUiLCJzdGVwIiwiaW5kZXgiLCJsZWZ0UGN0IiwidG9wUGN0Iiwid2luZG93Iiwib3BlbiIsInZpZXdCb3giLCJwcmVzZXJ2ZUFzcGVjdFJhdGlvIiwiaWQiLCJtYXNrVW5pdHMiLCJoZWlnaHQiLCJmaWxsIiwiXyIsImEiLCJjeCIsImN5Iiwic3Ryb2tlIiwic3Ryb2tlV2lkdGgiLCJtYXNrIiwiY29uY2F0IiwiTG9jYXRpb25Nb2RhbCIsIm9uQ2xvc2UiLCJMYW5ndWFnZU1vZGFsIiwiUGx1Z2luc01vZGFsIiwiVGlsZSIsIl9yZWYiLCJiYWNrZ3JvdW5kIiwiYm9yZGVyIiwiVGlsZUljb24iLCJjb2xvciIsIl9yZWYyIiwicmluZ0NvbG9yIiwibGVmdCIsInRvcCIsInRyYW5zZm9ybSIsImJveFNoYWRvdyIsIl9yZWYzIiwic3Ryb2tlTGluZWNhcCIsInN0cm9rZUxpbmVqb2luIiwiX2V4dGVuZHMiLCJfcmVmNCIsInVwZGF0ZSIsImsiLCJjIiwidXNlRWZmZWN0IiwicmF3IiwicHJlc2V0IiwicGF0Y2giLCJwIiwiSlNPTiIsInBhcnNlIiwiTnVtYmVyIiwiaXNGaW5pdGUiLCJsbyIsImhpIiwiUkhfUFJFU0VUUyIsImZpbmQiLCJ0aCIsImRsIiwicGFyc2VGbG9hdCIsInRyUmF3IiwidHIiLCJtaW4iLCJtYXgiLCJrZXlzIiwicGVyc2lzdEFuZFNhdmUiLCJzdHJpbmdpZnkiLCJTdHJpbmciLCJkaXNwYXRjaEV2ZW50IiwiQ3VzdG9tRXZlbnQiLCJkZXRhaWwiLCJjb25zb2xlIiwiaW5mbyIsIndhcm4iLCJQc3lTa2VsZXRvbiIsIlBzeUNvbnRyb2xQYW5lbCIsIm5vdGUiLCJfcmVmNSIsIlciLCJIIiwicGFkIiwicmlnaHQiLCJib3R0b20iLCJncmlkVyIsImdyaWRIIiwiVF9NSU4iLCJUX01BWCIsIldfTUlOIiwiV19NQVgiLCJ0IiwidyIsIl9nZXRXIiwiZ2V0VyIsInJoIiwic2FmZVB0cyIsImFyciIsInRvRml4ZWQiLCJqb2luIiwicmg4MCIsInB1c2giLCJyaDEwMCIsInJoMjBMaW5lIiwicmgyMF9DWiIsIkNaIiwicmhIaV90b3AiLCJ0dCIsInJoTG9fYm90IiwiU1dFRVQiLCJOViIsIk1hc3MiLCJNQ1YiLCJFVkFQIiwid2ludGVyUkg4MCIsIndpbnRlclJIMjAiLCJXSU5URVIiLCJpc29wbGV0aHMiLCJpc0xpZ2h0IiwicGFsZXR0ZSIsImJnIiwiZ3JpZCIsInRpY2siLCJheGlzIiwicGFuZWxCZyIsInBhbmVsQm9yZGVyIiwicGlsbEJnIiwicGlsbEZnIiwibWV0YUZnIiwiZGltRmlsdGVyIiwiYm9yZGVyQ29sb3IiLCJib3JkZXJSYWRpdXMiLCJBcnJheSIsImZyb20iLCJ4MSIsInkxIiwieDIiLCJ5MiIsImZvbnRTaXplIiwidGV4dEFuY2hvciIsInB0cyIsInd3IiwicG9pbnRzIiwic3Ryb2tlRGFzaGFycmF5IiwiZmxvb3IiLCJmb250V2VpZ2h0Iiwib3BhY2l0eSIsImZpbGxPcGFjaXR5IiwiY2xpcFBhdGhVbml0cyIsImNsaXBQYXRoIiwibGV0dGVyU3BhY2luZyIsInBhaW50T3JkZXIiLCJfcmVmNiIsInJvdW5kIiwidHlwZSIsInZhbHVlIiwib25DaGFuZ2UiLCJ0YXJnZXQiLCJhY2NlbnRDb2xvciIsIl9ub3JtYWxpemVMb2NzIiwic2VlbiIsIlNldCIsIm91dCIsImwiLCJuYW1lIiwidHJpbSIsImhhcyIsImFkZCIsIl9yZWY3IiwibWFwQm94UmVmIiwidXNlUmVmIiwibWFwUmVmIiwibWFya2VyUmVmIiwiX1JlYWN0JHVzZVN0YXRlIiwiX1JlYWN0JHVzZVN0YXRlMiIsImdlb0J1c3kiLCJzZXRHZW9CdXN5IiwiX1JlYWN0JHVzZVN0YXRlMyIsImlzQXJyYXkiLCJfUmVhY3QkdXNlU3RhdGU0Iiwic2F2ZWRMb2NzIiwic2V0U2F2ZWRMb2NzIiwiY2FuY2VsbGVkIiwiX2FzeW5jVG9HZW5lcmF0b3IiLCJmZXRjaCIsImNyZWRlbnRpYWxzIiwiY2FjaGUiLCJvayIsImoiLCJqc29uIiwic2F2ZWQiLCJfUmVhY3QkdXNlU3RhdGU1IiwiX1JlYWN0JHVzZVN0YXRlNiIsInNhdmVkT3BlbiIsInNldFNhdmVkT3BlbiIsInNhdmVkUmVmIiwib25Eb2NDbGljayIsImN1cnJlbnQiLCJjb250YWlucyIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJvblNpdGVOYW1lQ2hhbmdlIiwibmV3TmFtZSIsImhpdCIsInNldFZpZXciLCJwaWNrU2F2ZWRMb2MiLCJsb2MiLCJfUmVhY3QkdXNlU3RhdGU3IiwiX1JlYWN0JHVzZVN0YXRlOCIsInNlYXJjaFEiLCJzZXRTZWFyY2hRIiwiX1JlYWN0JHVzZVN0YXRlOSIsIl9SZWFjdCR1c2VTdGF0ZTAiLCJzZWFyY2hIaXRzIiwic2V0U2VhcmNoSGl0cyIsIl9SZWFjdCR1c2VTdGF0ZTEiLCJfUmVhY3QkdXNlU3RhdGUxMCIsInNlYXJjaEJ1c3kiLCJzZXRTZWFyY2hCdXN5IiwiX1JlYWN0JHVzZVN0YXRlMTEiLCJfUmVhY3QkdXNlU3RhdGUxMiIsInNlYXJjaE9wZW4iLCJzZXRTZWFyY2hPcGVuIiwic2VhcmNoRGVib3VuY2VSZWYiLCJydW5TZWFyY2giLCJfcmVmOSIsInEiLCJ1cmwiLCJlbmNvZGVVUklDb21wb25lbnQiLCJoZWFkZXJzIiwiX3giLCJhcHBseSIsImFyZ3VtZW50cyIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJwaWNrU2VhcmNoSGl0IiwiZGlzcGxheV9uYW1lIiwicmV2ZXJzZUdlb2NvZGUiLCJfcmVmMCIsImFkZHJlc3MiLCJ0b3duIiwidmlsbGFnZSIsImhhbWxldCIsImNvdW50eSIsInJlZ2lvbiIsInN0YXRlIiwiY291bnRyeSIsIl94MiIsIl94MyIsIkwiLCJ6b29tQ29udHJvbCIsImF0dHJpYnV0aW9uQ29udHJvbCIsInRpbGVMYXllciIsIm1heFpvb20iLCJhdHRyaWJ1dGlvbiIsImFkZFRvIiwibWFya2VyIiwiZHJhZ2dhYmxlIiwiYmluZFRvb2x0aXAiLCJwZXJtYW5lbnQiLCJhcHBseUxhdExvbiIsIm4iLCJvbiIsImxsIiwiZ2V0TGF0TG5nIiwibG5nIiwic2V0TGF0TG5nIiwibGF0bG5nIiwiaW52YWxpZGF0ZVNpemUiLCJyZW1vdmUiLCJwYW5UbyIsIl9SZWFjdCR1c2VTdGF0ZTEzIiwiX1JlYWN0JHVzZVN0YXRlMTQiLCJnZW9TdGF0ZSIsInNldEdlb1N0YXRlIiwidXNlTXlMb2NhdGlvbiIsIm5hdmlnYXRvciIsImdlb2xvY2F0aW9uIiwiZXJyIiwiZ2V0Q3VycmVudFBvc2l0aW9uIiwicG9zIiwiY29vcmRzIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJtc2ciLCJjb2RlIiwibWVzc2FnZSIsImVuYWJsZUhpZ2hBY2N1cmFjeSIsInRpbWVvdXQiLCJtYXhpbXVtQWdlIiwiX1JlYWN0JHVzZVN0YXRlMTUiLCJfUmVhY3QkdXNlU3RhdGUxNiIsInNhdmVNc2ciLCJzZXRTYXZlTXNnIiwiX3JlZjEiLCJkZWR1cGVkIiwibmV4dFNhdmVkIiwic2xpY2UiLCJwZXJzaXN0ZWQiLCJ3YXJuaW5nIiwibWV0aG9kIiwiYm9keSIsImFjdGl2ZSIsImRlZmF1bHQiLCJfbGFzdFdlYXRoZXJMb2NhdGlvblNhdmUiLCJNb2RhbFNoZWxsIiwidGl0bGUiLCJzdWJ0aXRsZSIsInNpemUiLCJtaW5IZWlnaHQiLCJyZWYiLCJvdmVyZmxvdyIsIm9uRm9jdXMiLCJwbGFjZWhvbGRlciIsIm91dGxpbmUiLCJoIiwicGxhY2VfaWQiLCJjbGFzcyIsInRyYW5zaXRpb24iLCJpc0FjdGl2ZSIsImRpc2FibGVkIiwicHJvdG9jb2wiLCJ6IiwiX3JlZjEwIiwibGFuZ3MiLCJuYXRpdmUiLCJFdmVudCIsIlBMVUdJTl9DT05GSUdfRklFTERTIiwid2VhdGhlciIsIm9wdGlvbnMiLCJkZWYiLCJzd2VldF9zcG90IiwiZzM2IiwiZGlidCIsImxpZ2h0aW5nIiwiX3JlZjExIiwiQUxMIiwiZGVzYyIsInZlciIsInRvZ2dsZSIsImluY2x1ZGVzIiwiX1JlYWN0JHVzZVN0YXRlMTciLCJfUmVhY3QkdXNlU3RhdGUxOCIsImV4cGFuZGVkSWQiLCJzZXRFeHBhbmRlZElkIiwidXBkYXRlRmllbGQiLCJwbHVnaW5JZCIsImZpZWxkS2V5IiwiZmllbGRzIiwiZmllbGRWYWwiLCJmaWVsZCIsInN0b3JlZCIsInVuZGVmaW5lZCIsImV4cGFuZGVkIiwiZiIsIm8iLCJuZXh0IiwiX3JlZjEyIiwiX3JlZjEyJGFjY2VudCIsIl9yZWYxMiRzaXplIiwiY2hpbGRyZW4iLCJjb2xvck1hcCIsImluZGlnbyIsImFtYmVyIiwiZW1lcmFsZCIsInBpbmsiLCJzaXplTWFwIiwid2lkZSIsInN0b3BQcm9wYWdhdGlvbiIsIm1heEhlaWdodCIsIlJlYWN0RE9NIiwiY3JlYXRlUm9vdCIsImdldEVsZW1lbnRCeUlkIiwicmVuZGVyIl0sInNvdXJjZXMiOlsiLi4vc3JjL3NldHVwLXdhbGsvc2V0dXBfd2Fsay5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgeyB1c2VTdGF0ZSwgdXNlTWVtbyB9ID0gUmVhY3Q7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFNURVAgREVGSU5JVElPTlMg4oCUIHRoZSA0IHdhbGsgcGF0aHMgdGhlIHVzZXIgZGVzY3JpYmVkXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5jb25zdCBTVEVQUyA9IFtcbiAgICAvKiBXYWxrIG9yZGVyIGlzIHRoZSBwZW50YWdvbiB0cmF2ZXJzYWw6IHRvcCDihpIgdXBwZXItcmlnaHQg4oaSIGxvd2VyLXJpZ2h0IOKGkiBsb3dlci1sZWZ0IOKGkiB1cHBlci1sZWZ0LlxuICAgICAgIExhYmVscyBpbnRlbnRpb25hbGx5IGRyb3AgdGhlIHJlZHVuZGFudCBcIlNldHRpbmdcIiBzdWZmaXggc28gdGhlXG4gICAgICAgbWFpbiBoZWFkaW5nIGluc2lkZSBlYWNoIGNpcmNsZSBjYW4gcmVuZGVyIGluIG9uZSBsaW5lIGF0IGEgbGFyZ2VyXG4gICAgICAgZm9udCB3ZWlnaHQuICovXG4gICAgeyBrZXk6J3BzeScsICAgICAgbGFiZWw6J1BzeSBDaGFydCcsICAgICAgIHN1YjonR2l2b25pIMK3IFJIIHJhbmdlIMK3IGF4aXMnLCAgICAgICBraW5kOidwYWdlJywgIGljb25Db2xvcjonIzgxOGNmOCcsIGFjY2VudDonaW5kaWdvJyB9LFxuICAgIHsga2V5Oidsb2NhdGlvbicsIGxhYmVsOidMb2NhdGlvbicsICAgICAgICBzdWI6J0NpdHkgwrcgbGF0IC8gbG9uZycsICAgICAgICAgICAgICBraW5kOidtb2RhbCcsIGljb25Db2xvcjonI2ZiYmYyNCcsIGFjY2VudDonYW1iZXInICB9LFxuICAgIHsga2V5OidsYW5ndWFnZScsIGxhYmVsOidMYW5ndWFnZScsICAgICAgICBzdWI6J0VOIMK3IENTIMK3IENUIMK3IEpQIMK3IEtPIMK3IOKApicsICAgICBraW5kOidtb2RhbCcsIGljb25Db2xvcjonIzM0ZDM5OScsIGFjY2VudDonZW1lcmFsZCd9LFxuICAgIHsga2V5OidwbHVnaW5zJywgIGxhYmVsOidQbHVnLWluJywgICAgICAgICBzdWI6J0xpc3QgwrcgdXBsb2FkIMK3IG1vZGlmeScsICAgICAgICAga2luZDonbW9kYWwnLCBpY29uQ29sb3I6JyNmNDcyYjYnLCBhY2NlbnQ6J3BpbmsnICAgfSxcbiAgICB7IGtleToncmVwYWlyJywgICBsYWJlbDonVXBkYXRlICYgUmVwYWlyJywgc3ViOidQbHVnLWluIGZsYXNoIMK3IGNvbnRyb2xsZXIgT1RBJywga2luZDonbGluaycsIGljb25Db2xvcjonI2ZiNzE4NScsIGFjY2VudDoncm9zZScsIGhyZWY6Jy91cGRhdGUuaHRtbCcgfSxcbl07XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFJPT1QgQVBQXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5mdW5jdGlvbiBBcHAoKSB7XG4gICAgLyogY29tcGxldGlvbiArIHBlci1zdGVwIGNvbmZpZyAtLSBtb2NrdXAgc3RhdGUsIG5ldmVyIHBlcnNpc3RlZCAqL1xuICAgIGNvbnN0IFtkb25lLCBzZXREb25lXSA9IHVzZVN0YXRlKHsgcHN5OmZhbHNlLCBsb2NhdGlvbjpmYWxzZSwgbGFuZ3VhZ2U6ZmFsc2UsIHBsdWdpbnM6ZmFsc2UsIHJlcGFpcjpmYWxzZSB9KTtcbiAgICBjb25zdCBbcm91dGUsIHNldFJvdXRlXSA9IHVzZVN0YXRlKCdodWInKTsgICAvLyAnaHViJyB8ICdwc3knXG4gICAgY29uc3QgW21vZGFsLCBzZXRNb2RhbF0gPSB1c2VTdGF0ZShudWxsKTsgICAgIC8vICdsb2NhdGlvbicgfCAnbGFuZ3VhZ2UnIHwgJ3BsdWdpbnMnIHwgbnVsbFxuXG4gICAgY29uc3QgW3BzeUNmZywgc2V0UHN5Q2ZnXSAgICAgICAgID0gdXNlU3RhdGUoeyBnaXZvbmk6dHJ1ZSwgcmhQcmVzZXQ6J29mZmljZScsIHJoTG86MzAsIHJoSGk6NjAsIHRMbzotMTUsIHRIaTo1MCwgdGhlbWU6J2RhcmsnLCBkYXJrTGV2ZWw6Mi4wIH0pO1xuICAgIGNvbnN0IFtsb2NDZmcsIHNldExvY0NmZ10gICAgICAgICA9IHVzZVN0YXRlKHsgc2l0ZU5hbWU6J015IEJ1aWxkaW5nJywgY2l0eTonVG9yb250bywgT04nLCBsYXQ6NDMuNjUzMiwgbG9uOi03OS4zODMyIH0pO1xuICAgIGNvbnN0IFtsYW5nQ2ZnLCBzZXRMYW5nQ2ZnXSAgICAgICA9IHVzZVN0YXRlKCgpID0+IHtcbiAgICAgICAgLyogTGF6eSBpbml0IGZyb20gdGhlIHNhbWUgbG9jYWxTdG9yYWdlIGtleSB0aGUgZGFzaGJvYXJkIHJlYWRzLCBzb1xuICAgICAgICAgKiByZW9wZW5pbmcgdGhlIHNldHVwIHdhbGsgc2hvd3MgdGhlIGN1cnJlbnRseS1hY3RpdmUgbGFuZ3VhZ2VcbiAgICAgICAgICogcmF0aGVyIHRoYW4gYWx3YXlzIGRlZmF1bHRpbmcgdG8gRW5nbGlzaC4gKi9cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHYgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnaTE4bl9sYW5nJyk7XG4gICAgICAgICAgICBjb25zdCBhbGxvd2VkID0gWydlbicsJ3poLUNOJywnemgtVFcnLCdqYScsJ2tvJ107XG4gICAgICAgICAgICBpZiAodiAmJiBhbGxvd2VkLmluZGV4T2YodikgIT09IC0xKSByZXR1cm4geyBsYW5nOiB2IH07XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogcHJpdmF0ZSBtb2RlIC0+IGZhbGwgdGhyb3VnaCAqLyB9XG4gICAgICAgIHJldHVybiB7IGxhbmc6J2VuJyB9O1xuICAgIH0pO1xuICAgIGNvbnN0IFtwbHVnaW5DZmcsIHNldFBsdWdpbkNmZ10gICA9IHVzZVN0YXRlKHsgZW5hYmxlZDpbJ3dlYXRoZXInLCdnaXZvbmknLCdzd2VldF9zcG90J10gfSk7XG5cbiAgICBjb25zdCBjb21wbGV0ZUNvdW50ID0gT2JqZWN0LnZhbHVlcyhkb25lKS5maWx0ZXIoQm9vbGVhbikubGVuZ3RoO1xuXG4gICAgY29uc3QgZmluaXNoID0gKGtleSkgPT4ge1xuICAgICAgICBzZXREb25lKGQgPT4gKHsuLi5kLCBba2V5XTp0cnVlfSkpO1xuICAgICAgICBzZXRSb3V0ZSgnaHViJyk7XG4gICAgICAgIHNldE1vZGFsKG51bGwpO1xuICAgIH07XG5cbiAgICAvKiBmdWxsLXBhZ2UgUHN5IENoYXJ0IGVkaXRvciAqL1xuICAgIGlmIChyb3V0ZSA9PT0gJ3BzeScpIHtcbiAgICAgICAgcmV0dXJuIDxQc3lDaGFydFNldHRpbmdQYWdlIGNmZz17cHN5Q2ZnfSBzZXRDZmc9e3NldFBzeUNmZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQmFjaz17KCkgPT4gc2V0Um91dGUoJ2h1YicpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXsoKSA9PiBmaW5pc2goJ3BzeScpfSAvPjtcbiAgICB9XG5cbiAgICAvKiBkZWZhdWx0OiBIVUIgc2NyZWVuICovXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtaW4taC1zY3JlZW4gcHgtNiBweS04XCI+XG4gICAgICAgICAgICB7LyogLS0tLS0tLS0tLS0tLSBoZWFkZXIgLS0tLS0tLS0tLS0tLSAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctNXhsIG14LWF1dG8gZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIG1iLTEwIGZhZGUtdXBcIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwidGV4dC0yeGwgc206dGV4dC0zeGwgZm9udC1ibGFjayBpdGFsaWMgdXBwZXJjYXNlIHRyYWNraW5nLXRpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXJlZC01MDBcIj5SZWQ1PC9zcGFuPiA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlXCI+U3R1ZGlvPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgZm9udC1ub3JtYWwgaXRhbGljXCI+ICZuYnNwOy8mbmJzcDsgc2V0dXAgd2Fsazwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9oMT5cbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgdGV4dC14cyBtdC0xIGZvbnQtbW9ubyB0cmFja2luZy13aWRlXCI+Q29uZmlndXJlIG9uY2UuIFNraXAgYW55IHN0ZXAgeW91IGRvbid0IG5lZWQuPC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIi9kYXNoYm9hcmQuaHRtbFwiXG4gICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHsgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDUuc2V0dXAuZG9uZScsJzEnKTsgfSBjYXRjaChlKXt9IH19XG4gICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS01MDAgaG92ZXI6dGV4dC1zbGF0ZS0zMDAgdW5kZXJsaW5lIHVuZGVybGluZS1vZmZzZXQtNFwiPlNraXAgYWxsIOKGkjwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogLS0tLS0tLS0tLS0tLSBwZW50YWdvbiBsYXlvdXQgLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgIDUgY2lyY3VsYXIgdGlsZXMgYXJyYW5nZWQgYXQgdGhlIGNvcm5lcnMgb2YgYSByZWd1bGFyXG4gICAgICAgICAgICAgICAgcGVudGFnb24uICBQb2xhciBtYXRoczogYW5nbGUgc3RhcnRzIGF0IC05MGRlZyAodG9wKSBhbmRcbiAgICAgICAgICAgICAgICBzdGVwcyBieSArNzJkZWcgY2xvY2t3aXNlLiAgVGhlIGNvbnRhaW5lciBpcyBoZWlnaHQtbG9ja2VkXG4gICAgICAgICAgICAgICAgdmlhIGFzcGVjdCByYXRpbyBzbyB0aGUgcGVudGFnb24gc3RheXMgY2lyY3VsYXIgb24gZXZlcnlcbiAgICAgICAgICAgICAgICB2aWV3cG9ydC4gIFJhZGl1cyBpcyA0MCAlIG9mIHRoZSBjb250YWluZXIgaGFsZi1zaWRlLCBjaXJjbGVcbiAgICAgICAgICAgICAgICBkaWFtZXRlciB+MjcgJSBvZiB0aGUgY29udGFpbmVyIHdpZHRoIC0tIGdpdmVzIGEgY2xlYXJseVxuICAgICAgICAgICAgICAgIHZpc2libGUgZ2FwICh+MjggJSBvZiBjb250YWluZXIgd2lkdGgpIGJldHdlZW4gYWRqYWNlbnRcbiAgICAgICAgICAgICAgICBjaXJjbGVzIHJlZ2FyZGxlc3Mgb2Ygc2NyZWVuIHNpemUuICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBteC1hdXRvIGZhZGUtdXBcIlxuICAgICAgICAgICAgICAgICBzdHlsZT17eyB3aWR0aDonbWluKDc2MHB4LCA5MnZ3KScsIGFzcGVjdFJhdGlvOicxIC8gMScsIGFuaW1hdGlvbkRlbGF5OicuMDhzJyB9fT5cbiAgICAgICAgICAgICAgICB7U1RFUFMubWFwKChzLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFuZ2xlRGVnID0gLTkwICsgaSAqIDcyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmdsZSA9IGFuZ2xlRGVnICogTWF0aC5QSSAvIDE4MDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgciA9IDQwOyAgICAgICAgICAgICAgICAgICAgICAgIC8vICUgb2YgY29udGFpbmVyIGhhbGYtc2lkZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4ID0gNTAgKyByICogTWF0aC5jb3MoYW5nbGUpOyAgLy8gJVxuICAgICAgICAgICAgICAgICAgICBjb25zdCB5ID0gNTAgKyByICogTWF0aC5zaW4oYW5nbGUpOyAgLy8gJVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPENpcmNsZVRpbGUga2V5PXtzLmtleX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXA9e3N9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lPXtkb25lW3Mua2V5XX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4PXtpKzF9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0UGN0PXt4fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wUGN0PXt5fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzLmtpbmQgPT09ICdwYWdlJykgICAgICBzZXRSb3V0ZShzLmtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocy5raW5kID09PSAnbGluaycpIHdpbmRvdy5vcGVuKHMuaHJlZiwgJ19ibGFuaycsICdub29wZW5lcicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgICAgICAgICAgICAgICAgICAgICAgICBzZXRNb2RhbChzLmtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSAvPlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIHsvKiBEZWNvcmF0aXZlIHJpbmc6IGEgc2luZ2xlIGNpcmNsZSB3aG9zZSBjZW50cmUgY29pbmNpZGVzXG4gICAgICAgICAgICAgICAgICAgIHdpdGggdGhlIGNlbnRyZSBvZiB0aGUgcGVudGFnb24gYW5kIHdob3NlIHJhZGl1cyBlcXVhbHNcbiAgICAgICAgICAgICAgICAgICAgdGhlIHBlbnRhZ29uIHZlcnRleCByYWRpdXMgLS0gaXRzIGJvdW5kYXJ5IHBhc3Nlc1xuICAgICAgICAgICAgICAgICAgICBjbGVhbmx5IHRocm91Z2ggdGhlIGNlbnRyZSBvZiBlYWNoIHRpbGUuICBUaGUgbWFza1xuICAgICAgICAgICAgICAgICAgICBjdXRzIG91dCB0aGUgZGlzayBvZiBldmVyeSB0aWxlIGNpcmNsZSBzbyB0aGUgcmluZyBpc1xuICAgICAgICAgICAgICAgICAgICB2aXNpYmxlIE9OTFkgaW4gdGhlIGdhcHMgYmV0d2VlbiB0aWxlcywgbmV2ZXIgY3Jvc3NpbmdcbiAgICAgICAgICAgICAgICAgICAgYSB0aWxlIGludGVyaW9yLiAqL31cbiAgICAgICAgICAgICAgICA8c3ZnIGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgdy1mdWxsIGgtZnVsbCBwb2ludGVyLWV2ZW50cy1ub25lXCJcbiAgICAgICAgICAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMTAwIDEwMFwiIHByZXNlcnZlQXNwZWN0UmF0aW89XCJub25lXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkZWZzPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG1hc2sgaWQ9XCJwZW50YWdvbi1yaW5nLW1hc2tcIiBtYXNrVW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4PVwiMFwiIHk9XCIwXCIgd2lkdGg9XCIxMDBcIiBoZWlnaHQ9XCIxMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCB4PVwiMFwiIHk9XCIwXCIgd2lkdGg9XCIxMDBcIiBoZWlnaHQ9XCIxMDBcIiBmaWxsPVwid2hpdGVcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtTVEVQUy5tYXAoKF8sIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYSA9ICgtOTAgKyBpICogNzIpICogTWF0aC5QSSAvIDE4MDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY3ggPSA1MCArIDQwICogTWF0aC5jb3MoYSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGN5ID0gNTAgKyA0MCAqIE1hdGguc2luKGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiAxNy41ICUgcmFkaXVzID0gc2FtZSBhcyB0aGUgdGlsZSBjaXJjbGUnc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYWxmLXdpZHRoICgzNSAlIGRpYW1ldGVyKTsgKzAuNSAlIG51ZGdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtlZXBzIHRoZSBtYXNrIGVkZ2UgaW5zaWRlIHRoZSBjb2xvdXJlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByaW5nIHNvIHRoZSB3aGl0ZSBhcmMgZG9lc24ndCBBTE1PU1QtdG91Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIHJpbmcgYm9yZGVyIHdpdGggYW50aS1hbGlhc2VkIGZyaW5nZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDxjaXJjbGUga2V5PXtpfSBjeD17Y3h9IGN5PXtjeX0gcj1cIjE4XCIgZmlsbD1cImJsYWNrXCIgLz47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L21hc2s+XG4gICAgICAgICAgICAgICAgICAgIDwvZGVmcz5cbiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBjeD1cIjUwXCIgY3k9XCI1MFwiIHI9XCI0MFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cInJnYmEoMjU1LDI1NSwyNTUsMC44NSlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoPVwiMC41NlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFzaz1cInVybCgjcGVudGFnb24tcmluZy1tYXNrKVwiIC8+XG4gICAgICAgICAgICAgICAgPC9zdmc+XG5cbiAgICAgICAgICAgICAgICB7LyogQ2VudHJlZCBjb21wbGV0aW9uIGNvdW50ZXIgLS0gc2l0cyBhdCB0aGUgY2VudHJvaWQgb2ZcbiAgICAgICAgICAgICAgICAgICAgdGhlIGNvbnN0ZWxsYXRpb24sIGZvbnQgd2VpZ2h0IG1hdGNoZWQgdG8gdGhlIHBlci10aWxlXG4gICAgICAgICAgICAgICAgICAgIGhlYWRpbmcgc28gdGhlIGV5ZSByZWFkcyBpdCBhcyB0aGUgZG9taW5hbnQgc3RhdHVzLiAqL31cbiAgICAgICAgICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwic2V0dXAtcHJvZ3Jlc3MtY2VudGVyXCJcbiAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIGxlZnQtMS8yIHRvcC0xLzIgLXRyYW5zbGF0ZS14LTEvMiAtdHJhbnNsYXRlLXktMS8yIHRleHQtY2VudGVyIHBvaW50ZXItZXZlbnRzLW5vbmUgc2VsZWN0LW5vbmVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2B0ZXh0LVsyMnB4XSBzbTp0ZXh0LVsyNnB4XSBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy10aWdodCB3aGl0ZXNwYWNlLW5vd3JhcCBsZWFkaW5nLW5vbmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2NvbXBsZXRlQ291bnQgPT09IDUgPyAndGV4dC1lbWVyYWxkLTQwMCcgOiAndGV4dC1zbGF0ZS0zMDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAge2NvbXBsZXRlQ291bnR9LzVcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gc206dGV4dC1bMTFweF0gZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctWzAuM2VtXSB0ZXh0LXNsYXRlLTUwMCBtdC0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICBEb25lXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiAtLS0tLS0tLS0tLS0tIGZvb3RlciBDVEEgLS0tLS0tLS0tLS0tLSAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctNXhsIG14LWF1dG8gbXQtMTAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIGZhZGUtdXBcIiBzdHlsZT17e2FuaW1hdGlvbkRlbGF5OicuMThzJ319PlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNTAwIHRleHQteHMgZm9udC1tb25vXCI+XG4gICAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZUNvdW50ID09PSAwICYmICfihpEgUGljayBhIHNldHRpbmcgdG8gc3RhcnQsIG9yIHNraXAgYWxsIGFuZCBnbyBzdHJhaWdodCB0byB0aGUgZGFzaGJvYXJkLid9XG4gICAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZUNvdW50ID4gMCAmJiBjb21wbGV0ZUNvdW50IDwgNSAmJiBg4oaRICR7NSAtIGNvbXBsZXRlQ291bnR9IHN0ZXAkezUgLSBjb21wbGV0ZUNvdW50ID09PSAxID8gJycgOiAncyd9IHJlbWFpbmluZyAob3B0aW9uYWwpLmB9XG4gICAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZUNvdW50ID09PSA1ICYmICfinJMgQWxsIHN0ZXBzIGNvbmZpZ3VyZWQuICBSZWFkeSB3aGVuIHlvdSBhcmUuJ31cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cIi9kYXNoYm9hcmQuaHRtbFwiXG4gICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4geyB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS5zZXR1cC5kb25lJywnMScpOyB9IGNhdGNoKGUpe30gfX1cbiAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweC03IHB5LTMgcm91bmRlZC14bCB0ZXh0LXNtIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjb21wbGV0ZUNvdW50ID09PSA1XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctZW1lcmFsZC02MDAgaG92ZXI6YmctZW1lcmFsZC01MDAgdGV4dC13aGl0ZSBzaGFkb3ctbGcgc2hhZG93LWVtZXJhbGQtNTAwLzMwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLWluZGlnby02MDAgaG92ZXI6YmctaW5kaWdvLTUwMCB0ZXh0LXdoaXRlIHNoYWRvdy1sZyBzaGFkb3ctaW5kaWdvLTUwMC8yMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgIE9wZW4gRGFzaGJvYXJkIOKGklxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogLS0tLS0tLS0tLS0tLSBtb2RhbHMgLS0tLS0tLS0tLS0tLSAqL31cbiAgICAgICAgICAgIHttb2RhbCA9PT0gJ2xvY2F0aW9uJyAmJiA8TG9jYXRpb25Nb2RhbCBjZmc9e2xvY0NmZ30gc2V0Q2ZnPXtzZXRMb2NDZmd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRNb2RhbChudWxsKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2F2ZT17KCkgPT4gZmluaXNoKCdsb2NhdGlvbicpfSAvPn1cbiAgICAgICAgICAgIHttb2RhbCA9PT0gJ2xhbmd1YWdlJyAmJiA8TGFuZ3VhZ2VNb2RhbCBjZmc9e2xhbmdDZmd9IHNldENmZz17c2V0TGFuZ0NmZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldE1vZGFsKG51bGwpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXsoKSA9PiBmaW5pc2goJ2xhbmd1YWdlJyl9IC8+fVxuICAgICAgICAgICAge21vZGFsID09PSAncGx1Z2lucycgICYmIDxQbHVnaW5zTW9kYWwgIGNmZz17cGx1Z2luQ2ZnfSBzZXRDZmc9e3NldFBsdWdpbkNmZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldE1vZGFsKG51bGwpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXsoKSA9PiBmaW5pc2goJ3BsdWdpbnMnKX0gLz59XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFRpbGUgKGxhcmdlIGVhc3ktb24tZXllcyBidXR0b24pIC0tIGtlcHQgZm9yIGJhY2stY29tcGF0LCBubyBsb25nZXIgdXNlZFxuICogYnkgdGhlIHBlbnRhZ29uIGh1Yi5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIFRpbGUoeyBzdGVwLCBkb25lLCBpbmRleCwgb25DbGljayB9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgc2V0dXAtdGlsZS0ke3N0ZXAua2V5fWB9XG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17YE9wZW4gJHtzdGVwLmxhYmVsfWB9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdGlsZS1idG4gcmVsYXRpdmUgdGV4dC1sZWZ0IGJnLXNsYXRlLTkwMC83MCBib3JkZXItMiBib3JkZXItc2xhdGUtNzAwLzcwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91bmRlZC0yeGwgcC02IHNtOnAtNyAke2RvbmUgPyAnZG9uZScgOiAnJ31gfT5cbiAgICAgICAgICAgIHtkb25lICYmIDxzcGFuIGNsYXNzTmFtZT1cImNoZWNrXCIgZGF0YS10ZXN0aWQ9e2BzZXR1cC10aWxlLSR7c3RlcC5rZXl9LWRvbmVgfT7inJM8L3NwYW4+fVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtNCBtYi0zXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTEyIGgtMTIgcm91bmRlZC14bCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiXG4gICAgICAgICAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6YCR7c3RlcC5pY29uQ29sb3J9MjJgLCBib3JkZXI6YDFweCBzb2xpZCAke3N0ZXAuaWNvbkNvbG9yfTU1YH19PlxuICAgICAgICAgICAgICAgICAgICA8VGlsZUljb24ga2luZD17c3RlcC5rZXl9IGNvbG9yPXtzdGVwLmljb25Db2xvcn0gLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtM3hsIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS03MDBcIj4we2luZGV4fTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1sZyBzbTp0ZXh0LXhsIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVyIG1iLTFcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7Y29sb3I6c3RlcC5pY29uQ29sb3J9fT57c3RlcC5sYWJlbH08L2gzPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS00MDAgdGV4dC1zbSBsZWFkaW5nLXNudWdcIj57c3RlcC5zdWJ9PC9wPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC00IGZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicGlsbCBiZy1zbGF0ZS04MDAgdGV4dC1zbGF0ZS00MDBcIj57c3RlcC5raW5kID09PSAncGFnZScgPyAnRnVsbCBwYWdlJyA6ICdQb3B1cCd9PC9zcGFuPlxuICAgICAgICAgICAgICAgIHtkb25lICYmIDxzcGFuIGNsYXNzTmFtZT1cInBpbGwgYmctZW1lcmFsZC05MDAvNDAgdGV4dC1lbWVyYWxkLTQwMFwiPkNvbmZpZ3VyZWQ8L3NwYW4+fVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENpcmNsZVRpbGUgLS0gcGVudGFnb24tY29ybmVyIHJvdW5kIGJ1dHRvbi4gIFNpemVkIGluICUgb2YgaXRzIGNvbnRhaW5lclxuICogc28gdGhlIHdob2xlIGxheW91dCBzY2FsZXMgd2l0aCB2aWV3cG9ydC4gIEVhY2ggY2lyY2xlIGlzIGFuY2hvcmVkIGJ5IGl0c1xuICogY2VudHJlICh0cmFuc2xhdGUgLTUwJS8tNTAlKSBvbiB0aGUgcG9sYXItY29tcHV0ZWQgKGxlZnQlLCB0b3AlKS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIENpcmNsZVRpbGUoeyBzdGVwLCBkb25lLCBpbmRleCwgbGVmdFBjdCwgdG9wUGN0LCBvbkNsaWNrIH0pIHtcbiAgICAvKiBUaGljayBjb2xvdXJlZCByaW5nIHBlciB0aWxlIC0tIGVhY2ggc3RlcCBrZWVwcyBpdHMgYWNjZW50IGNvbG91clxuICAgICAqIChpbmRpZ28vYW1iZXIvZW1lcmFsZC9waW5rL3Jvc2UpLCByZWluZm9yY2luZyB0aGUgY29sb3VyLWNvZGVkIFNWR1xuICAgICAqIGljb24gYW5kIHRoZSBoZWFkaW5nIHRleHQuICovXG4gICAgY29uc3QgcmluZ0NvbG9yID0gc3RlcC5pY29uQ29sb3I7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgc2V0dXAtdGlsZS0ke3N0ZXAua2V5fWB9XG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17YE9wZW4gJHtzdGVwLmxhYmVsfWB9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgY2lyY2xlLXRpbGUgZ3JvdXAgYWJzb2x1dGUgcm91bmRlZC1mdWxsIHRleHQtY2VudGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi0yMDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2RvbmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctc2xhdGUtOTAwLzgwIHNoYWRvdy1bMF8wXzMwcHhfLTZweF9yZ2JhKDE2LDE4NSwxMjksMC41NSldJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1zbGF0ZS05MDAvNzAgaG92ZXI6Ymctc2xhdGUtODAwLzkwJ31gfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6YCR7bGVmdFBjdH0lYCwgdG9wOmAke3RvcFBjdH0lYCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6J21pbigzNSUsIDI2MHB4KScsIGFzcGVjdFJhdGlvOicxLzEnLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06J3RyYW5zbGF0ZSgtNTAlLCAtNTAlKScsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlcjpgMTBweCBzb2xpZCAke3JpbmdDb2xvcn1gLFxuICAgICAgICAgICAgICAgICAgICBib3hTaGFkb3c6YDAgMCAwIDFweCAke3JpbmdDb2xvcn0zMywgMCA4cHggMjhweCAtOHB4ICR7cmluZ0NvbG9yfTU1YCxcbiAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHtkb25lICYmIChcbiAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLXRlc3RpZD17YHNldHVwLXRpbGUtJHtzdGVwLmtleX0tZG9uZWB9XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgLXRvcC0xIC1yaWdodC0xIHctNiBoLTYgcm91bmRlZC1mdWxsIGJnLWVtZXJhbGQtNTAwIHRleHQtd2hpdGUgdGV4dC14cyBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBmb250LWJvbGQgc2hhZG93XCI+XG4gICAgICAgICAgICAgICAgICAgIOKck1xuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdW5kZWQteGwgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgbWItMVwiXG4gICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiczNCUnLCBhc3BlY3RSYXRpbzonMS8xJyxcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDpgJHtzdGVwLmljb25Db2xvcn0yMmAsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlcjpgMXB4IHNvbGlkICR7c3RlcC5pY29uQ29sb3J9NTVgLFxuICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICA8VGlsZUljb24ga2luZD17c3RlcC5rZXl9IGNvbG9yPXtzdGVwLmljb25Db2xvcn0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSBmb250LWJsYWNrIHRleHQtc2xhdGUtNjAwIHRyYWNraW5nLXdpZGVyXCI+MHtpbmRleH08L2Rpdj5cbiAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LVsyMnB4XSBzbTp0ZXh0LVsyNnB4XSBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy10aWdodCB3aGl0ZXNwYWNlLW5vd3JhcCBsZWFkaW5nLW5vbmUgbXQtMS41XCJcbiAgICAgICAgICAgICAgICBzdHlsZT17e2NvbG9yOnN0ZXAuaWNvbkNvbG9yfX0+XG4gICAgICAgICAgICAgICAge3N0ZXAubGFiZWx9XG4gICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgdGV4dC1bMTBweF0gc206dGV4dC1bMTFweF0gbGVhZGluZy1zbnVnIHB4LTMgbXQtMSBsaW5lLWNsYW1wLTJcIj5cbiAgICAgICAgICAgICAgICB7c3RlcC5zdWJ9XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICk7XG59XG5cbmZ1bmN0aW9uIFRpbGVJY29uKHsga2luZCwgY29sb3IgfSkge1xuICAgIC8qIHNpbXBsZSBpbmxpbmUgU1ZHcyBzbyB3ZSBrZWVwIHRoZSBmaWxlIHNlbGYtY29udGFpbmVkICovXG4gICAgY29uc3Qgc3Ryb2tlID0geyBzdHJva2U6Y29sb3IsIGZpbGw6J25vbmUnLCBzdHJva2VXaWR0aDoyLCBzdHJva2VMaW5lY2FwOidyb3VuZCcsIHN0cm9rZUxpbmVqb2luOidyb3VuZCcgfTtcbiAgICBpZiAoa2luZCA9PT0gJ3BzeScpICAgICAgcmV0dXJuIDxzdmcgd2lkdGg9XCIyMlwiIGhlaWdodD1cIjIyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHsuLi5zdHJva2V9PjxwYXRoIGQ9XCJNMyAzdjE4aDE4XCIvPjxwYXRoIGQ9XCJNMyAxN2M0LTEgNy02IDktOXM1LTMgOS0yXCIvPjwvc3ZnPjtcbiAgICBpZiAoa2luZCA9PT0gJ2xvY2F0aW9uJykgcmV0dXJuIDxzdmcgd2lkdGg9XCIyMlwiIGhlaWdodD1cIjIyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHsuLi5zdHJva2V9PjxwYXRoIGQ9XCJNMTIgMjJzLTctNi40LTctMTJhNyA3IDAgMSAxIDE0IDBjMCA1LjYtNyAxMi03IDEyelwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEwXCIgcj1cIjIuNVwiLz48L3N2Zz47XG4gICAgaWYgKGtpbmQgPT09ICdsYW5ndWFnZScpIHJldHVybiA8c3ZnIHdpZHRoPVwiMjJcIiBoZWlnaHQ9XCIyMlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB7Li4uc3Ryb2tlfT48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjlcIi8+PHBhdGggZD1cIk0zIDEyaDE4TTEyIDNhMTQgMTQgMCAwIDEgMCAxOE0xMiAzYTE0IDE0IDAgMCAwIDAgMThcIi8+PC9zdmc+O1xuICAgIGlmIChraW5kID09PSAncGx1Z2lucycpICByZXR1cm4gPHN2ZyB3aWR0aD1cIjIyXCIgaGVpZ2h0PVwiMjJcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgey4uLnN0cm9rZX0+PHBhdGggZD1cIk05IDN2Nk0xNSAzdjZcIi8+PHBhdGggZD1cIk01IDloMTR2NmE0IDQgMCAwIDEtNCA0aC0xdjNNOSAxOXYzXCIvPjwvc3ZnPjtcbiAgICAvKiBVcGRhdGUgJiBSZXBhaXIgLS0gd3JlbmNoICsgdGlueSBnZWFyIGJ1bXAsIHNpZ25hbGxpbmcgXCJ0b29sc1wiICovXG4gICAgaWYgKGtpbmQgPT09ICdyZXBhaXInKSAgIHJldHVybiA8c3ZnIHdpZHRoPVwiMjJcIiBoZWlnaHQ9XCIyMlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB7Li4uc3Ryb2tlfT48cGF0aCBkPVwiTTE0LjcgNi4zYTQgNCAwIDAgMC01LjQgNS40TDMgMThsMyAzIDYuMy02LjNhNCA0IDAgMCAwIDUuNC01LjRsLTIuOCAyLjhMMTMgMTFsLTEuMS0xLjkgMi44LTIuOHpcIi8+PC9zdmc+O1xuICAgIHJldHVybiBudWxsO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBQc3kgQ2hhcnQgU2V0dGluZyAtLSBGVUxMIFBBR0UsIGxpdmUgc2tlbGV0b24gcmVzcG9uZHMgdG8gY29udHJvbHNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIFBzeUNoYXJ0U2V0dGluZ1BhZ2UoeyBjZmcsIHNldENmZywgb25CYWNrLCBvblNhdmUgfSkge1xuICAgIGNvbnN0IHVwZGF0ZSA9IChrLCB2KSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIFtrXTp2fSkpO1xuXG4gICAgLyogT24gbW91bnQ6IGh5ZHJhdGUgZnJvbSB0aGUgU0FNRSBsb2NhbFN0b3JhZ2Uga2V5IHRoZSBkYXNoYm9hcmQgcmVhZHNcbiAgICAgKiAoYHJlZDVfc3dlZXRfc3BvdF9yYW5nZWApIHBsdXMgdGhlIHByZXNldCBpZCAoYHJlZDVfcmhfcHJlc2V0YCkgc29cbiAgICAgKiB0aGUgZHJvcGRvd24gbGFiZWwgc3RheXMgY29uc2lzdGVudCB3aXRoIHRoZSBzbGlkZXIgdmFsdWVzIGFjcm9zc1xuICAgICAqIHJlbG9hZHMuICBJZiB0aGUgb3BlcmF0b3IgaGFzIGFscmVhZHkgdHVuZWQgdGhlIFJIIGJhbmQgb24gdGhlXG4gICAgICogZGFzaGJvYXJkLCB0aGUgc2V0dXAgd2FsayBzdGFydHMgZnJvbSB0aG9zZSB2YWx1ZXMuICovXG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJhdyAgICA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWQ1X3N3ZWV0X3Nwb3RfcmFuZ2UnKTtcbiAgICAgICAgICAgIGNvbnN0IHByZXNldCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWQ1X3JoX3ByZXNldCcpO1xuICAgICAgICAgICAgY29uc3QgcGF0Y2ggID0ge307XG4gICAgICAgICAgICBpZiAocmF3KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcCA9IEpTT04ucGFyc2UocmF3KTtcbiAgICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHAubG8pICYmIE51bWJlci5pc0Zpbml0ZShwLmhpKSAmJiBwLmxvIDwgcC5oaSkge1xuICAgICAgICAgICAgICAgICAgICBwYXRjaC5yaExvID0gcC5sbztcbiAgICAgICAgICAgICAgICAgICAgcGF0Y2gucmhIaSA9IHAuaGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByZXNldCAmJiBSSF9QUkVTRVRTLmZpbmQoeCA9PiB4LmlkID09PSBwcmVzZXQpKSB7XG4gICAgICAgICAgICAgICAgcGF0Y2gucmhQcmVzZXQgPSBwcmVzZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBUaGVtZSArIGJyaWdodG5lc3Mg4oCUIHNhbWUga2V5cyBhcHAuanMgKGRhc2hib2FyZCkgcmVhZHMuICovXG4gICAgICAgICAgICBjb25zdCB0aCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWQ1LnRoZW1lJyk7XG4gICAgICAgICAgICBpZiAodGggPT09ICdsaWdodCcgfHwgdGggPT09ICdkYXJrJykgcGF0Y2gudGhlbWUgPSB0aDtcbiAgICAgICAgICAgIGNvbnN0IGRsID0gcGFyc2VGbG9hdChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVkNS5kYXJrTGV2ZWwnKSk7XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGRsKSAmJiBkbCA+PSAxLjUgJiYgZGwgPD0gMy4wKSBwYXRjaC5kYXJrTGV2ZWwgPSBkbDtcbiAgICAgICAgICAgIC8qIFRlbXBlcmF0dXJlIGF4aXMgcmFuZ2Ug4oCUIHdyaXR0ZW4gYnkgdGhpcyBzYW1lIHBhZ2UncyBzYXZlXG4gICAgICAgICAgICAgKiBoYW5kbGVyOyBsb2FkIGl0IGhlcmUgc28gcmVvcGVuaW5nIHRoZSBzZXR1cCB3YWxrIHNob3dzIHRoZVxuICAgICAgICAgICAgICogY3VycmVudCBkYXNoYm9hcmQgYXhpcyBpbnN0ZWFkIG9mIGFsd2F5cyBkZWZhdWx0aW5nIHRvIC0xNS4uNTAuICovXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRyUmF3ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlZDVfdGVtcF9yYW5nZScpO1xuICAgICAgICAgICAgICAgIGlmICh0clJhdykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ciA9IEpTT04ucGFyc2UodHJSYXcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHRyLm1pbikgJiYgTnVtYmVyLmlzRmluaXRlKHRyLm1heCkgJiYgdHIubWluIDwgdHIubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRjaC50TG8gPSB0ci5taW47XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRjaC50SGkgPSB0ci5tYXg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7IC8qIGlnbm9yZSAqLyB9XG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMocGF0Y2gpLmxlbmd0aCkgc2V0Q2ZnKGMgPT4gKHsuLi5jLCAuLi5wYXRjaH0pKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBpZ25vcmUgKi8gfVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgICB9LCBbXSk7XG5cbiAgICAvKiBPbiBzYXZlOiBwZXJzaXN0IHRoZSBSSCBiYW5kIHRvIGxvY2FsU3RvcmFnZSBzbyB0aGUgZGFzaGJvYXJkJ3NcbiAgICAgKiBzd2VldC1zcG90IHBvbHlnb24gcGlja3MgaXQgdXAgb24gbmV4dCBsb2FkLiAgQWxzbyBwZXJzaXN0IHRoZSB2ZW51ZVxuICAgICAqIHByZXNldCBpZCAoZm9yIGZ1dHVyZSBcInNob3cgcHJlc2V0IG5hbWUgb24gZGFzaGJvYXJkXCIgZmVhdHVyZXMpLiAqL1xuICAgIGNvbnN0IHBlcnNpc3RBbmRTYXZlID0gKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDVfc3dlZXRfc3BvdF9yYW5nZScsXG4gICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoeyBsbzogY2ZnLnJoTG8sIGhpOiBjZmcucmhIaSB9KSk7XG4gICAgICAgICAgICBpZiAoY2ZnLnJoUHJlc2V0KSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDVfcmhfcHJlc2V0JywgY2ZnLnJoUHJlc2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIFRoZW1lICsgYnJpZ2h0bmVzcyDigJQgd3JpdHRlbiB0byB0aGUgU0FNRSBrZXlzIHRoZSBkYXNoYm9hcmRcbiAgICAgICAgICAgICAqIChhcHAuanMgbGluZXMgNTctNTggYW5kIDg0LTk3KSByZWFkcyBhcyBpdHMgdXNlU3RhdGUgbGF6eVxuICAgICAgICAgICAgICogaW5pdGlhbGlzZXIsIHNvIHRoZSBjaG9zZW4gdGhlbWUgdGFrZXMgZWZmZWN0IG9uIG5leHQgZGFzaGJvYXJkXG4gICAgICAgICAgICAgKiBsb2FkLiAgYXBwLmpzIHRyZWF0cyBkYXJrTGV2ZWwgPj0gMy4wIGFzIGxpZ2h0LW1vZGUgdHJpZ2dlci4gKi9cbiAgICAgICAgICAgIGlmIChjZmcudGhlbWUgPT09ICdsaWdodCcgfHwgY2ZnLnRoZW1lID09PSAnZGFyaycpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS50aGVtZScsIGNmZy50aGVtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGNmZy5kYXJrTGV2ZWwpKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDUuZGFya0xldmVsJywgU3RyaW5nKGNmZy5kYXJrTGV2ZWwpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIFRlbXBlcmF0dXJlIGF4aXMgcmFuZ2Ug4oCUIGRyaXZlcyB0aGUgZGFzaGJvYXJkJ3MgcHN5IGNoYXJ0XG4gICAgICAgICAgICAgKiBYIGF4aXMgKGB0ZW1wUmFuZ2UubWluL21heGAgaW4gYXBwLmpzKS4gIFdlIHdyaXRlIHRoZSBzYW1lXG4gICAgICAgICAgICAgKiBzaGFwZSBhcHAuanMgcmVhZHMgKGB7bWluLCBtYXh9YCkgc28gaXRzIGxhenkgdXNlU3RhdGUgaW5pdFxuICAgICAgICAgICAgICogcGlja3MgaXQgdXAgb24gbmV4dCBsb2FkLCBBTkQgZGlzcGF0Y2ggYSBjdXN0b20gZXZlbnQgc29cbiAgICAgICAgICAgICAqIGFueSBvcGVuIGRhc2hib2FyZCB0YWIgdXBkYXRlcyBsaXZlIHdpdGhvdXQgYSByZWZyZXNoLiAqL1xuICAgICAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShjZmcudExvKSAmJiBOdW1iZXIuaXNGaW5pdGUoY2ZnLnRIaSkgJiYgY2ZnLnRMbyA8IGNmZy50SGkpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNV90ZW1wX3JhbmdlJyxcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoeyBtaW46IGNmZy50TG8sIG1heDogY2ZnLnRIaSB9KSk7XG4gICAgICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdyNS10ZW1wLXJhbmdlLWNoYW5nZScsIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7IG1pbjogY2ZnLnRMbywgbWF4OiBjZmcudEhpIH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3I1LXJoLWJhbmQtY2hhbmdlJywge1xuICAgICAgICAgICAgICAgIGRldGFpbDogeyBsbzogY2ZnLnJoTG8sIGhpOiBjZmcucmhIaSB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ1tzZXR1cCB3YWxrXSBwc3kgY2hhcnQgc2F2ZWQgLT4gUkgnLCBjZmcucmhMbywgJy0nLCBjZmcucmhIaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAnJSBULWF4aXMnLCBjZmcudExvLCAnLi4nLCBjZmcudEhpLCAnwrBDIHByZXNldD0nLCBjZmcucmhQcmVzZXQpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1tzZXR1cCB3YWxrXSBjb3VsZCBub3QgcGVyc2lzdCBwc3kgc2V0dGluZ3M6JywgZSk7XG4gICAgICAgIH1cbiAgICAgICAgb25TYXZlKCk7XG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWluLWgtc2NyZWVuIGZsZXggZmxleC1jb2xcIj5cbiAgICAgICAgICAgIHsvKiBoZWFkZXIgKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBweC02IHB5LTQgYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTgwMFwiPlxuICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17b25CYWNrfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS00MDAgaG92ZXI6dGV4dC13aGl0ZSB0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFja1wiPlxuICAgICAgICAgICAgICAgICAgICDihpAgQmFjayB0byBzZXR1cFxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJ0ZXh0LXNtIHVwcGVyY2FzZSB0cmFja2luZy1bMC4zZW1dIGZvbnQtYmxhY2sgdGV4dC1pbmRpZ28tNDAwXCI+UHN5IENoYXJ0IFNldHRpbmc8L2gxPlxuICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17cGVyc2lzdEFuZFNhdmV9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC01IHB5LTIgcm91bmRlZC1sZyBiZy1pbmRpZ28tNjAwIGhvdmVyOmJnLWluZGlnby01MDAgdGV4dC13aGl0ZSB0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFja1wiPlxuICAgICAgICAgICAgICAgICAgICBTYXZlICYgcmV0dXJuIOKck1xuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBib2R5IOKAlCBjaGFydCBsZWZ0LCBjb250cm9scyByaWdodCAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xIGdyaWQgZ3JpZC1jb2xzLTEgbGc6Z3JpZC1jb2xzLVsxZnJfMzYwcHhdIGdhcC00IHAtNiBtYXgtdy03eGwgbXgtYXV0byB3LWZ1bGxcIj5cbiAgICAgICAgICAgICAgICA8UHN5U2tlbGV0b24gY2ZnPXtjZmd9IC8+XG4gICAgICAgICAgICAgICAgPFBzeUNvbnRyb2xQYW5lbCBjZmc9e2NmZ30gdXBkYXRlPXt1cGRhdGV9IHNldENmZz17c2V0Q2ZnfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbi8qIFJIIGJhbmQgcHJlc2V0cyDigJQgcmVjb2duaXNlZCBpbmR1c3RyeSBzdGFuZGFyZHMgZm9yIGVhY2ggdmVudWUgdHlwZS5cbiAqIFNvdXJjZXM6IEFTSFJBRSA1NSAoY29tZm9ydCksIEFTSFJBRSAxNzAgKGhlYWx0aGNhcmUpLFxuICogQUFNL05QUy9TbWl0aHNvbmlhbiBndWlkYW5jZSAoY29sbGVjdGlvbnMpLCBDSUJTRSBUTTQwIChsaWJyYXJpZXMpLiAqL1xuY29uc3QgUkhfUFJFU0VUUyA9IFtcbiAgICB7IGlkOidjdXN0b20nLCAgICAgICAgICBsYWJlbDonQ3VzdG9tIChtYW51YWwpJywgICAgICAgICAgICAgICAgIGxvOm51bGwsIGhpOm51bGwsIG5vdGU6JycgfSxcbiAgICB7IGlkOidvZmZpY2UnLCAgICAgICAgICBsYWJlbDonT2ZmaWNlJywgICAgICAgICAgICAgICAgICAgICAgICAgIGxvOjMwLCAgIGhpOjYwLCAgIG5vdGU6J0FTSFJBRSA1NSBjb21mb3J0JyAgICAgICAgICAgICAgICAgIH0sXG4gICAgeyBpZDonbXVzZXVtJywgICAgICAgICAgbGFiZWw6J011c2V1bScsICAgICAgICAgICAgICAgICAgICAgICAgICBsbzo0MCwgICBoaTo1NSwgICBub3RlOidBQU0gY29sbGVjdGlvbiBwcmVzZXJ2YXRpb24nICAgICAgICB9LFxuICAgIHsgaWQ6J2hvdGVsJywgICAgICAgICAgIGxhYmVsOidIb3RlbCBndWVzdCByb29tJywgICAgICAgICAgICAgICAgbG86MzAsICAgaGk6NjAsICAgbm90ZTonZ2VuZXJhbCBvY2N1cGFudCBjb21mb3J0JyAgICAgICAgICAgfSxcbiAgICB7IGlkOidsaWJyYXJ5JywgICAgICAgICBsYWJlbDonTGlicmFyeSAvIEFyY2hpdmUnLCAgICAgICAgICAgICAgIGxvOjQwLCAgIGhpOjU1LCAgIG5vdGU6J3BhcGVyICYgYmluZGluZyBwcmVzZXJ2YXRpb24nICAgICAgIH0sXG4gICAgeyBpZDonaG9zcGl0YWwnLCAgICAgICAgbGFiZWw6J0hvc3BpdGFsIChnZW5lcmFsKScsICAgICAgICAgICAgICBsbzozMCwgICBoaTo2MCwgICBub3RlOidBU0hSQUUgMTcwIHBhdGllbnQgYXJlYXMnICAgICAgICAgICB9LFxuICAgIHsgaWQ6J2xlY3R1cmUnLCAgICAgICAgIGxhYmVsOidMZWN0dXJlIGhhbGwnLCAgICAgICAgICAgICAgICAgICAgbG86MzAsICAgaGk6NjAsICAgbm90ZTonaGlnaCBvY2N1cGFuY3kgY29tZm9ydCcgICAgICAgICAgICAgfSxcbiAgICB7IGlkOidjb25jZXJ0JywgICAgICAgICBsYWJlbDonQ29uY2VydCBoYWxsJywgICAgICAgICAgICAgICAgICAgIGxvOjQwLCAgIGhpOjU1LCAgIG5vdGU6J2luc3RydW1lbnQgdHVuaW5nIHN0YWJpbGl0eScgICAgICAgIH0sXG4gICAgeyBpZDonbWVldGluZycsICAgICAgICAgbGFiZWw6J01lZXRpbmcgcm9vbScsICAgICAgICAgICAgICAgICAgICBsbzozMCwgICBoaTo2MCwgICBub3RlOidzbWFsbCBncm91cCBjb21mb3J0JyAgICAgICAgICAgICAgICB9LFxuICAgIHsgaWQ6J2V4aGliaXRpb24nLCAgICAgIGxhYmVsOidFeGhpYml0aW9uIGhhbGwnLCAgICAgICAgICAgICAgICAgbG86NDAsICAgaGk6NTUsICAgbm90ZTonbWl4ZWQgYXJ0IC8gYXJ0aWZhY3QgZGlzcGxheScgICAgICAgfSxcbl07XG5cbi8qIFJlYWwgcHN5IGNoYXJ0IOKAlCB1c2VzIHRoZSBTQU1FIGdldFcgKyBHSVZPTklfQ09MT1JTICsgcG9seWdvbiBtYXRoIGFzIHRoZVxuICogcHJvZHVjdGlvbiBkYXNoYm9hcmQuICBTb3VyY2Ugb2YgdHJ1dGg6ICBqcy9wc3ljaHJvbWV0cmljLmpzICBhbmQgdGhlXG4gKiByZW5kZXJHaXZvbmlPdmVybGF5KCkgYmxvY2sgYXQgYXBwLmpzOjE2NDEtMTcyMi5cbiAqIEFueXRoaW5nIHlvdSBjaGFuZ2UgaW4gdGhvc2UgZmlsZXMgTVVTVCBiZSBtaXJyb3JlZCBoZXJlLiAqL1xuZnVuY3Rpb24gUHN5U2tlbGV0b24oeyBjZmcgfSkge1xuICAgIC8qIENhbnZhcyArIHBhZGRpbmcgKi9cbiAgICBjb25zdCBXID0gNzYwLCBIID0gNDgwO1xuICAgIGNvbnN0IHBhZCA9IHsgbGVmdDogNTYsIHJpZ2h0OiA0MCwgdG9wOiAyOCwgYm90dG9tOiA1NiB9O1xuICAgIGNvbnN0IGdyaWRXID0gVyAtIHBhZC5sZWZ0IC0gcGFkLnJpZ2h0O1xuICAgIGNvbnN0IGdyaWRIID0gSCAtIHBhZC50b3AgIC0gcGFkLmJvdHRvbTtcblxuICAgIGNvbnN0IFRfTUlOID0gY2ZnLnRMbywgVF9NQVggPSBjZmcudEhpO1xuICAgIGNvbnN0IFdfTUlOID0gMCwgICAgICAgV19NQVggPSAwLjAzMDsgICAgICAgICAgLy8ga2cva2dcblxuICAgIC8qIGF4aXMgc2NhbGVzIC0tIG1hdGNoIHRoZSBsaXZlIGRhc2hib2FyZCAqL1xuICAgIGNvbnN0IHggID0gKHQpID0+IHBhZC5sZWZ0ICsgKCh0IC0gVF9NSU4pIC8gKFRfTUFYIC0gVF9NSU4pKSAqIGdyaWRXO1xuICAgIGNvbnN0IHkgID0gKHcpID0+IHBhZC50b3AgICsgKDEgLSAodyAtIFdfTUlOKSAvIChXX01BWCAtIFdfTUlOKSkgKiBncmlkSDtcbiAgICBjb25zdCBfZ2V0VyA9ICh0eXBlb2YgZ2V0VyA9PT0gJ2Z1bmN0aW9uJykgPyBnZXRXIDogKCh0LCByaCkgPT4gMCk7XG5cbiAgICBjb25zdCBzYWZlUHRzID0gKGFycikgPT4gYXJyLm1hcChwID0+IGAkeyh4KHBbMF0pfHwwKS50b0ZpeGVkKDIpfSwkeyh5KHBbMV0pfHwwKS50b0ZpeGVkKDIpfWApLmpvaW4oJyAnKTtcblxuICAgIC8qIC0tLS0gR2l2b25pIHBvbHlnb25zIC0tIENPUElFRCBWRVJCQVRJTSBmcm9tIGFwcC5qczoxNjQzLTE2NjkgLS0tLSAqL1xuICAgIGNvbnN0IHJoODAgPSBbXTsgZm9yIChsZXQgdD0yMDsgdDw9MjU7IHQrPTAuNSkgcmg4MC5wdXNoKFt0LCBfZ2V0Vyh0LCA4MCldKTtcbiAgICBjb25zdCByaDEwMD0gW107IGZvciAobGV0IHQ9MjA7IHQ8PTI3OyB0Kz0wLjUpIHJoMTAwLnB1c2goW3QsIF9nZXRXKHQsIDEwMCldKTtcbiAgICBjb25zdCByaDIwTGluZSA9IFtdOyBmb3IgKGxldCB0PTMyOyB0Pj0yMDsgdC09MC41KSByaDIwTGluZS5wdXNoKFt0LCBfZ2V0Vyh0LCAyMCldKTtcbiAgICBjb25zdCByaDIwX0NaICA9IFtdOyBmb3IgKGxldCB0PTI3OyB0Pj0yMDsgdC09MC41KSByaDIwX0NaLnB1c2goW3QsIF9nZXRXKHQsIDIwKV0pO1xuICAgIGNvbnN0IENaICAgPSBbLi4ucmg4MCwgWzI3LCBfZ2V0VygyNywgNTApXSwgWzI3LCBfZ2V0VygyNywgMjApXSwgLi4ucmgyMF9DWl07XG5cbiAgICBjb25zdCByaEhpX3RvcCA9IFtdOyBmb3IgKGxldCB0dD0yMDsgdHQ8PTI3OyB0dCs9MC41KSByaEhpX3RvcC5wdXNoKFt0dCwgX2dldFcodHQsIGNmZy5yaEhpKV0pO1xuICAgIGNvbnN0IHJoTG9fYm90ID0gW107IGZvciAobGV0IHR0PTI3OyB0dD49MjA7IHR0LT0wLjUpIHJoTG9fYm90LnB1c2goW3R0LCBfZ2V0Vyh0dCwgY2ZnLnJoTG8pXSk7XG4gICAgY29uc3QgU1dFRVQgPSBbLi4ucmhIaV90b3AsIC4uLnJoTG9fYm90XTtcblxuICAgIGNvbnN0IE5WICAgPSBbLi4ucmgxMDAsIFszMiwgMTUuNC8xMDAwXSwgWzMyLCA2LjIvMTAwMF0sIC4uLnJoMjBMaW5lXTtcbiAgICBjb25zdCBNYXNzID0gWy4uLnJoODAsIFszMywgMTYvMTAwMF0sIFszNywgX2dldFcoMzcsIDMwKV0sIFszNywgMy8xMDAwXSwgWzIwLCBfZ2V0VygyMCwgMjApXV07XG4gICAgY29uc3QgTUNWICA9IFsuLi5yaDgwLCBbNDAsIDE2LzEwMDBdLCBbNDQsIF9nZXRXKDQ0LCAyMCldLCBbNDQsIDMvMTAwMF0sIFsyMCwgX2dldFcoMjAsIDIwKV1dO1xuICAgIGNvbnN0IEVWQVAgPSBbLi4ucmg4MCwgWzI1LCAxNi8xMDAwXSwgWzM2LCBfZ2V0VygzNiwgMzApXSwgWzM5LCBfZ2V0VygzOSwgMjApXSxcbiAgICAgICAgICAgICAgICAgIFs0MSwgX2dldFcoNDEsIDEwKV0sIFs0MSwgMF0sIFsyNy4yLCAwXSwgWzIwLCBfZ2V0VygyMCwgMjApXV07XG5cbiAgICBjb25zdCB3aW50ZXJSSDgwID0gW107IGZvciAobGV0IHQ9MTg7IHQ8PTE5LjU7IHQrPTAuNSkgd2ludGVyUkg4MC5wdXNoKFt0LCBfZ2V0Vyh0LCA4MCldKTtcbiAgICBjb25zdCB3aW50ZXJSSDIwID0gW107IGZvciAobGV0IHQ9MTkuNTsgdD49MTg7IHQtPTAuNSkgd2ludGVyUkgyMC5wdXNoKFt0LCBfZ2V0Vyh0LCAyMCldKTtcbiAgICBjb25zdCBXSU5URVIgPSBbLi4ud2ludGVyUkg4MCwgLi4ud2ludGVyUkgyMF07XG5cbiAgICAvKiBSSCBpc29wbGV0aCBjdXJ2ZXMgZm9yIHRoZSBjaGFydCBncmlkICovXG4gICAgY29uc3QgaXNvcGxldGhzID0gWzIwLCA0MCwgNjAsIDgwLCAxMDBdO1xuXG4gICAgLyogVGhlbWUgcGFsZXR0ZSDigJQgZHJpdmVzIHRoZSBsaXZlIHByZXZpZXcgc28gdGhlIGRpbS9saWdodCBjb250cm9sc1xuICAgICAqIGhhdmUgdmlzaWJsZSBmZWVkYmFjayByaWdodCBvbiB0aGUgY2hhcnQuICBJbiBkaW0vZGFyayBtb2RlIHdlIGFsc29cbiAgICAgKiBhcHBseSBhIENTUyBicmlnaHRuZXNzIGZpbHRlciBtYXBwZWQgZnJvbSBjZmcuZGFya0xldmVsICgxLjUgLi4gMi44XG4gICAgICog4oaSIDAuNiAuLiAxLjQpIHNvIHRoZSB1c2VyIGNhbiBTRUUgdGhlIGJyaWdodG5lc3Mgc2xpZGVyIHdvcmtpbmcuICovXG4gICAgY29uc3QgaXNMaWdodCA9IGNmZy50aGVtZSA9PT0gJ2xpZ2h0JztcbiAgICBjb25zdCBwYWxldHRlID0gaXNMaWdodFxuICAgICAgICA/IHsgYmc6JyNmOGZhZmMnLCBncmlkOicjY2JkNWUxJywgdGljazonIzQ3NTU2OScsIGF4aXM6JyMxZTI5M2InLFxuICAgICAgICAgICAgcGFuZWxCZzoncmdiYSgyNDgsMjUwLDI1MiwwLjg1KScsIHBhbmVsQm9yZGVyOicjY2JkNWUxJyxcbiAgICAgICAgICAgIHBpbGxCZzonI2UyZThmMCcsIHBpbGxGZzonIzQ3NTU2OScsIG1ldGFGZzonIzY0NzQ4YicgfVxuICAgICAgICA6IHsgYmc6JyMwYjEyMjAnLCBncmlkOicjMWUyOTNiJywgdGljazonIzk0YTNiOCcsIGF4aXM6JyNjYmQ1ZTEnLFxuICAgICAgICAgICAgcGFuZWxCZzoncmdiYSgxNSwyMyw0MiwwLjYpJywgcGFuZWxCb3JkZXI6JyMxZTI5M2InLFxuICAgICAgICAgICAgcGlsbEJnOicjMWUyOTNiJywgcGlsbEZnOicjOTRhM2I4JywgbWV0YUZnOicjNjQ3NDhiJyB9O1xuICAgIGNvbnN0IGRpbUZpbHRlciA9IGlzTGlnaHRcbiAgICAgICAgPyAnbm9uZSdcbiAgICAgICAgOiBgYnJpZ2h0bmVzcygkeyhNYXRoLm1heCgxLjUsIE1hdGgubWluKDIuOCwgY2ZnLmRhcmtMZXZlbCB8fCAyLjApKSAvIDIuMCkudG9GaXhlZCgyKX0pYDtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm91bmRlZC0yeGwgcC00IGJvcmRlciB0cmFuc2l0aW9uLWNvbG9ycyBkdXJhdGlvbi0zMDBcIlxuICAgICAgICAgICAgIHN0eWxlPXt7YmFja2dyb3VuZDogcGFsZXR0ZS5wYW5lbEJnLCBib3JkZXJDb2xvcjogcGFsZXR0ZS5wYW5lbEJvcmRlcn19PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gbWItM1wiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInBpbGxcIiBzdHlsZT17e2JhY2tncm91bmQ6cGFsZXR0ZS5waWxsQmcsIGNvbG9yOnBhbGV0dGUucGlsbEZnfX0+UFNZQ0hST01FVFJJQyBDSEFSVCDCtyBsaXZlIHByZXZpZXc8L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1tb25vXCIgc3R5bGU9e3tjb2xvcjpwYWxldHRlLm1ldGFGZ319PntUX01JTn3CsEMg4oaSIHtUX01BWH3CsEMgIMK3ICB7Y2ZnLnJoTG994oCTe2NmZy5yaEhpfSUgUkg8L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxzdmcgdmlld0JveD17YDAgMCAke1d9ICR7SH1gfSBjbGFzc05hbWU9XCJ3LWZ1bGwgaC1hdXRvIHRyYW5zaXRpb24tW2ZpbHRlcl0gZHVyYXRpb24tMzAwXCJcbiAgICAgICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOiBwYWxldHRlLmJnLCBib3JkZXJSYWRpdXM6OCwgZmlsdGVyOiBkaW1GaWx0ZXJ9fT5cbiAgICAgICAgICAgICAgICB7LyogLS0tLSBncmlkOiB2ZXJ0aWNhbCBUIGxpbmVzLCBob3Jpem9udGFsIFcgbGluZXMgLS0tLSAqL31cbiAgICAgICAgICAgICAgICB7QXJyYXkuZnJvbSh7bGVuZ3RoOjExfSkubWFwKChfLGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdCA9IFRfTUlOICsgKGkvMTApICogKFRfTUFYIC0gVF9NSU4pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGcga2V5PXsndnQnK2l9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXt4KHQpfSB5MT17cGFkLnRvcH0geDI9e3godCl9IHkyPXtwYWQudG9wK2dyaWRIfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT17cGFsZXR0ZS5ncmlkfSBzdHJva2VXaWR0aD1cIjAuNlwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KHQpfSB5PXtwYWQudG9wK2dyaWRIKzE2fSBmb250U2l6ZT1cIjkuNVwiIGZpbGw9e3BhbGV0dGUudGlja31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCI+e3QudG9GaXhlZCgwKX08L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAge0FycmF5LmZyb20oe2xlbmd0aDo3fSkubWFwKChfLGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdyA9IFdfTUlOICsgKGkvNikgKiAoV19NQVggLSBXX01JTik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZyBrZXk9eydodycraX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3BhZC5sZWZ0fSB5MT17eSh3KX0geDI9e3BhZC5sZWZ0K2dyaWRXfSB5Mj17eSh3KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9e3BhbGV0dGUuZ3JpZH0gc3Ryb2tlV2lkdGg9XCIwLjZcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17cGFkLmxlZnQtOH0geT17eSh3KSszfSBmb250U2l6ZT1cIjkuNVwiIGZpbGw9e3BhbGV0dGUudGlja31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwiZW5kXCI+eyh3KjEwMDApLnRvRml4ZWQoMCl9PC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIHsvKiAtLS0tIFJIIGlzb3BsZXRocyAoY3VydmVzKSAtLS0tICovfVxuICAgICAgICAgICAgICAgIHtpc29wbGV0aHMubWFwKHJoID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHRzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHQgPSBUX01JTjsgdCA8PSBUX01BWDsgdCArPSAwLjUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHd3ID0gX2dldFcodCwgcmgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHd3ID49IFdfTUlOICYmIHd3IDw9IFdfTUFYKSBwdHMucHVzaChbdCwgd3ddKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGcga2V5PXsnaXNvJytyaH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlsaW5lIHBvaW50cz17c2FmZVB0cyhwdHMpfSBmaWxsPVwibm9uZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT17cmggPT09IDEwMCA/ICcjNjM2NmYxJyA6ICcjZWM0ODk5NTUnfSBzdHJva2VXaWR0aD1cIjAuOFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZURhc2hhcnJheT17cmggPT09IDEwMCA/ICcnIDogJzMsMyd9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cHRzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KHB0c1tNYXRoLmZsb29yKHB0cy5sZW5ndGgqMC42NSldWzBdKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeT17eShwdHNbTWF0aC5mbG9vcihwdHMubGVuZ3RoKjAuNjUpXVsxXSkgLSA0fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZT1cIjlcIiBmaWxsPVwiI2VjNDg5OTk5XCIgZm9udFdlaWdodD1cIjcwMFwiPntyaH0lPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG5cbiAgICAgICAgICAgICAgICB7LyogLS0tLSBHaXZvbmkgb3ZlcmxheSAoY29waWVkIHZlcmJhdGltIGZyb20gYXBwLmpzIHJlbmRlciBvcmRlcikgLS0tLSAqL31cbiAgICAgICAgICAgICAgICB7Y2ZnLmdpdm9uaSAmJiAoXG4gICAgICAgICAgICAgICAgICAgIDxnIGNsYXNzTmFtZT1cInBvaW50ZXItZXZlbnRzLW5vbmVcIiBvcGFjaXR5PVwiMC45XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17eCg0MCl9IHkxPXt5KDE2LzEwMDApfSB4Mj17eCg1MCl9IHkyPXt5KDE2LzEwMDApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiIzYzNjZmMVwiIHN0cm9rZVdpZHRoPVwiMS41XCIgc3Ryb2tlRGFzaGFycmF5PVwiNCw0XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3goNTApfSB5MT17eSgxNi8xMDAwKX0geDI9e3goNTApfSB5Mj17eSgwKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cIiM2MzY2ZjFcIiBzdHJva2VXaWR0aD1cIjEuNVwiIHN0cm9rZURhc2hhcnJheT1cIjQsNFwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXt4KDQxKX0geTE9e3koMCl9IHgyPXt4KDUwKX0geTI9e3koMCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCIjNjM2NmYxXCIgc3Ryb2tlV2lkdGg9XCIxLjVcIiBzdHJva2VEYXNoYXJyYXk9XCI0LDRcIi8+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhNQ1YpfSAgZmlsbD1cIiNlYzQ4OTlcIiBmaWxsT3BhY2l0eT1cIjAuMDVcIiBzdHJva2U9XCIjZWM0ODk5XCIgc3Ryb2tlV2lkdGg9XCIxXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKE1hc3MpfSBmaWxsPVwiIzhiNWNmNlwiIGZpbGxPcGFjaXR5PVwiMC4wNVwiIHN0cm9rZT1cIiM4YjVjZjZcIiBzdHJva2VXaWR0aD1cIjFcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoRVZBUCl9IGZpbGw9XCIjMDZiNmQ0XCIgZmlsbE9wYWNpdHk9XCIwLjA4XCIgc3Ryb2tlPVwiIzA2YjZkNFwiIHN0cm9rZVdpZHRoPVwiMVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhOVil9ICAgZmlsbD1cIiNmNTllMGJcIiBmaWxsT3BhY2l0eT1cIjAuMDVcIiBzdHJva2U9XCIjZjU5ZTBiXCIgc3Ryb2tlV2lkdGg9XCIxXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKENaKX0gICBmaWxsPVwiIzEwYjk4MVwiIGZpbGxPcGFjaXR5PVwiMC4xNVwiIHN0cm9rZT1cIiMxMGI5ODFcIiBzdHJva2VXaWR0aD1cIjEuMlwiLz5cblxuICAgICAgICAgICAgICAgICAgICAgICAgey8qIFN3ZWV0LXNwb3QgYmFuZCwgY2xpcHBlZCB0byBDWiAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkZWZzPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjbGlwUGF0aCBpZD1cImN6LWNsaXAtd2Fsa1wiIGNsaXBQYXRoVW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoQ1opfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9jbGlwUGF0aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGVmcz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhTV0VFVCl9IGNsaXBQYXRoPVwidXJsKCNjei1jbGlwLXdhbGspXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw9XCIjMDU5NjY5XCIgZmlsbE9wYWNpdHk9XCIwLjMyXCIgc3Ryb2tlPVwiIzA0Nzg1N1wiIHN0cm9rZVdpZHRoPVwiMC44XCIgc3Ryb2tlRGFzaGFycmF5PVwiMywyXCIvPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoV0lOVEVSKX0gZmlsbD1cIiMzYjgyZjZcIiBmaWxsT3BhY2l0eT1cIjAuMTVcIiBzdHJva2U9XCJub25lXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3goMTkpfSB5MT17cGFkLnRvcCsxOH0geDI9e3goMTkpfSB5Mj17cGFkLnRvcCtncmlkSH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cIiMzYjgyZjZcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VEYXNoYXJyYXk9XCI2LDRcIiBvcGFjaXR5PVwiMC44XCIvPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICB7LyogUmVnaW9uIGxhYmVscyDigJQgc2FtZSBjb2xvcnMgJiBzcGlyaXQgYXMgbGl2ZSBjaGFydCAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goNTApLTEwfSB5PXt5KDgvMTAwMCl9IGZpbGw9XCIjNjM2NmYxXCIgZm9udFNpemU9XCIxMFwiIGZvbnRXZWlnaHQ9XCI5MDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIHRyYW5zZm9ybT17YHJvdGF0ZSgtOTAsICR7eCg1MCktMTB9LCAke3koOC8xMDAwKX0pYH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc9XCIyXCI+TUVDSEFOSUNBTCBDT09MSU5HPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCg0NCktMn0geT17eSg4LzEwMDApfSBmaWxsPVwiI2VjNDg5OVwiIGZvbnRTaXplPVwiOVwiIGZvbnRXZWlnaHQ9XCI5MDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIHRyYW5zZm9ybT17YHJvdGF0ZSgtOTAsICR7eCg0NCktMn0sICR7eSg4LzEwMDApfSlgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZz1cIjEuNVwiPk1BU1MgQ09PTElORzwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goMzcpLTEwfSB5PXt5KDgvMTAwMCl9IGZpbGw9XCIjOGI1Y2Y2XCIgZm9udFNpemU9XCI5XCIgZm9udFdlaWdodD1cIjkwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgdHJhbnNmb3JtPXtgcm90YXRlKC05MCwgJHt4KDM3KS0xMH0sICR7eSg4LzEwMDApfSlgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZz1cIjEuNVwiPk1BU1MgQ09PTElORzwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goMzQpfSB5PXt5KDAuNS8xMDAwKS04fSBmaWxsPVwiIzA2YjZkNFwiIGZvbnRTaXplPVwiOVwiIGZvbnRXZWlnaHQ9XCI5MDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGxldHRlclNwYWNpbmc9XCIyXCI+RVZBUE9SQVRJVkU8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDIzLjUpfSB5PXt5KF9nZXRXKDIzLjUsIDQ1KSl9IGZpbGw9XCIjMTBiOTgxXCIgZm9udFNpemU9XCIxMVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0PVwiOTAwXCIgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGxldHRlclNwYWNpbmc9XCIxLjVcIj5DT01GT1JUPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCgxOC43NSl9IHk9e3koX2dldFcoMTguNzUsIDQ1KSl9IGZpbGw9XCIjM2I4MmY2XCIgZm9udFNpemU9XCIxMVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0PVwiOTAwXCIgdGV4dEFuY2hvcj1cIm1pZGRsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm09e2Byb3RhdGUoLTkwLCAke3goMTguNzUpfSwgJHt5KF9nZXRXKDE4Ljc1LCA0NSkpfSlgfT5XSU5URVI8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDIzLjUpfSB5PXt5KF9nZXRXKDIzLjUsIChjZmcucmhMbytjZmcucmhIaSkvMikpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbD1cIiMwMjJjMjJcIiBmb250U2l6ZT1cIjhcIiBmb250V2VpZ2h0PVwiOTAwXCIgdGV4dEFuY2hvcj1cIm1pZGRsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e3BhaW50T3JkZXI6J3N0cm9rZScsIHN0cm9rZTonI2E3ZjNkMCcsIHN0cm9rZVdpZHRoOicyLjVweCcsIHN0cm9rZUxpbmVqb2luOidyb3VuZCd9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZz1cIjEuNVwiPntjZmcucmhMb30te2NmZy5yaEhpfSUgUkg8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICApfVxuXG4gICAgICAgICAgICAgICAgey8qIGF4aXMgbGFiZWxzICovfVxuICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3BhZC5sZWZ0ICsgZ3JpZFcvMn0geT17SC0xMn0gZm9udFNpemU9XCIxMVwiIGZpbGw9e3BhbGV0dGUuYXhpc31cbiAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgZm9udFdlaWdodD1cIjgwMFwiIGxldHRlclNwYWNpbmc9XCIyXCI+RFJZIEJVTEIgVEVNUCAowrBDKTwvdGV4dD5cbiAgICAgICAgICAgICAgICA8dGV4dCB4PXsxNn0geT17cGFkLnRvcCArIGdyaWRILzJ9IGZvbnRTaXplPVwiMTFcIiBmaWxsPXtwYWxldHRlLmF4aXN9XG4gICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGZvbnRXZWlnaHQ9XCI4MDBcIiBsZXR0ZXJTcGFjaW5nPVwiMlwiXG4gICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtPXtgcm90YXRlKC05MCAxNiAke3BhZC50b3AgKyBncmlkSC8yfSlgfT5IVU1JRElUWSBSQVRJTyAoZy9rZyk8L3RleHQ+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuZnVuY3Rpb24gUHN5Q29udHJvbFBhbmVsKHsgY2ZnLCB1cGRhdGUsIHNldENmZyB9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1zbGF0ZS05MDAvNjAgYm9yZGVyIGJvcmRlci1zbGF0ZS04MDAgcm91bmRlZC0yeGwgcC01IHNwYWNlLXktNlwiPlxuICAgICAgICAgICAgey8qIFRoZW1lICsgYnJpZ2h0bmVzcyAgLS0gcmVsb2NhdGVkIGZyb20gdGhlIGRhc2hib2FyZCBzaWRlYmFyIDIwMjYtMDYtMjUuXG4gICAgICAgICAgICAgICAgVHdvIGNvbnRyb2xzOiBEYXJrL0xpZ2h0IG1vZGUgdG9nZ2xlLCBhbmQgQnJpZ2h0bmVzcyBzbGlkZXIgKG9ubHlcbiAgICAgICAgICAgICAgICBtZWFuaW5nZnVsIGluIGRhcmsgbW9kZSkuICBMaXZlIHByZXZpZXcgYXBwbGllcyB0byB0aGUgc3Vycm91bmRpbmdcbiAgICAgICAgICAgICAgICBjb250cm9sIHBhbmVsIHNvIHRoZSBvcGVyYXRvciBjYW4gRkVFTCB0aGUgY2hhbmdlIGJlZm9yZSBzYXZpbmcuICovfVxuICAgICAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cInBzeS1jZmctdGhlbWUtYmxvY2tcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj5EaXNwbGF5IE1vZGU8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTIgbWItM1wiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwicHN5LWNmZy10aGVtZS1kYXJrXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIHRoZW1lOidkYXJrJywgZGFya0xldmVsOk1hdGgubWluKGMuZGFya0xldmVsIHx8IDIuMCwgMi42KX0pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweS0yLjUgcm91bmRlZC1sZyB0ZXh0LXhzIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBib3JkZXIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjZmcudGhlbWUgPT09ICdkYXJrJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctc2xhdGUtODAwIGJvcmRlci15ZWxsb3ctNTAwLzcwIHRleHQteWVsbG93LTMwMCBzaGFkb3ctbGcgc2hhZG93LXllbGxvdy01MDAvMTAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1zbGF0ZS05MDAvMzAgYm9yZGVyLXNsYXRlLTcwMCB0ZXh0LXNsYXRlLTUwMCBob3ZlcjpiZy1zbGF0ZS04MDAvNjAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAg8J+MmSAgRGltIC8gRGFya1xuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cInBzeS1jZmctdGhlbWUtbGlnaHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldENmZyhjID0+ICh7Li4uYywgdGhlbWU6J2xpZ2h0JywgZGFya0xldmVsOjMuMH0pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweS0yLjUgcm91bmRlZC1sZyB0ZXh0LXhzIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBib3JkZXIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjZmcudGhlbWUgPT09ICdsaWdodCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLXNsYXRlLTEwMCBib3JkZXItc2t5LTUwMC83MCB0ZXh0LXNreS03MDAgc2hhZG93LWxnIHNoYWRvdy1za3ktNTAwLzEwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctc2xhdGUtOTAwLzMwIGJvcmRlci1zbGF0ZS03MDAgdGV4dC1zbGF0ZS01MDAgaG92ZXI6Ymctc2xhdGUtODAwLzYwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIOKYgCAgTGlnaHRcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgey8qIEJyaWdodG5lc3Mgc2xpZGVyIOKAlCBvbmx5IG1lYW5pbmdmdWwgd2hlbiB0aGVtZSA9PT0gJ2RhcmsnICovfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjZmcudGhlbWUgPT09ICdsaWdodCcgPyAnb3BhY2l0eS00MCBwb2ludGVyLWV2ZW50cy1ub25lJyA6ICcnfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gbWItMVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwXCI+RGltIGJyaWdodG5lc3M8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1tb25vIHRleHQteWVsbG93LTMwMCB0YWJ1bGFyLW51bXNcIj57TWF0aC5yb3VuZCgoY2ZnLmRhcmtMZXZlbCB8fCAyLjApICogMTAwKX0lPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cInBzeS1jZmctZGFyay1sZXZlbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBtaW49XCIxLjVcIiBtYXg9XCIyLjhcIiBzdGVwPVwiMC4wMlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Y2ZnLnRoZW1lID09PSAnbGlnaHQnID8gMi4wIDogKGNmZy5kYXJrTGV2ZWwgfHwgMi4wKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0Q2ZnKGMgPT4gKHsuLi5jLCBkYXJrTGV2ZWw6IHBhcnNlRmxvYXQoZS50YXJnZXQudmFsdWUpLCB0aGVtZTonZGFyayd9KSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyYW5nZS1pbnB1dCB3LWZ1bGxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgYWNjZW50Q29sb3I6JyNmYWNjMTUnIH19Lz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0yIGl0YWxpY1wiPlxuICAgICAgICAgICAgICAgICAgICBBcHBsaWVkIHRvIHRoZSB3aG9sZSBkYXNoYm9hcmQuICBEaW0gaXMgcmVjb21tZW5kZWQgZm9yIGNvbnRyb2wgcm9vbXM7IExpZ2h0IGZvciBkYXl0aW1lIHdhbGstdGhyb3VnaHMuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBHaXZvbmkgdG9nZ2xlICovfVxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj5HaXZvbmkgRW5naW5lPC9kaXY+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB1cGRhdGUoJ2dpdm9uaScsICFjZmcuZ2l2b25pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHctZnVsbCBweS0zIHJvdW5kZWQteGwgdGV4dC1zbSBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Y2ZnLmdpdm9uaVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLWluZGlnby02MDAgdGV4dC13aGl0ZSBzaGFkb3ctbGcgc2hhZG93LWluZGlnby01MDAvMzAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctc2xhdGUtODAwIHRleHQtc2xhdGUtNDAwIGJvcmRlciBib3JkZXItc2xhdGUtNzAwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAge2NmZy5naXZvbmkgPyAnR2l2b25pIE9OJyA6ICdHaXZvbmkgT0ZGJ31cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0yIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgICAgICBPdmVybGF5cyB0aGUgNCBjbGltYXRlLXN0cmF0ZWd5IHJlZ2lvbnMgKENvbWZvcnQsIE5hdCBWZW50LCBFdmFwLCBNZWNoIENvb2wpLlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogUkggcmFuZ2UgKi99XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMlwiPlJIIFN3ZWV0LVNwb3QgUmFuZ2U8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwIG1iLTEgYmxvY2tcIj5WZW51ZSBwcmVzZXQ8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0IGN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Y2ZnLnJoUHJlc2V0IHx8ICdjdXN0b20nfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwID0gUkhfUFJFU0VUUy5maW5kKHAgPT4gcC5pZCA9PT0gZS50YXJnZXQudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXApIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHAuaWQgPT09ICdjdXN0b20nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGUoJ3JoUHJlc2V0JywgJ2N1c3RvbScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCByaFByZXNldDpwLmlkLCByaExvOnAubG8sIHJoSGk6cC5oaX0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAge1JIX1BSRVNFVFMubWFwKHAgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtwLmlkfSB2YWx1ZT17cC5pZH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtwLmxhYmVsfXtwLmxvICE9IG51bGwgPyBgICDCtyAgJHtwLmxvfS0ke3AuaGl9JSBSSGAgOiAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgeygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwID0gUkhfUFJFU0VUUy5maW5kKHggPT4geC5pZCA9PT0gKGNmZy5yaFByZXNldCB8fCAnY3VzdG9tJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHAgJiYgcC5ub3RlID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTEuNSBpdGFsaWNcIj57cC5ub3RlfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICkgOiBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9KSgpfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTMgbWItMlwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtbW9ubyB0ZXh0LXNsYXRlLTQwMCB3LTEwXCI+e2NmZy5yaExvfSU8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49XCIyMFwiIG1heD17Y2ZnLnJoSGktNX0gdmFsdWU9e2NmZy5yaExvfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIHJoTG86K2UudGFyZ2V0LnZhbHVlLCByaFByZXNldDonY3VzdG9tJ30pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLWlucHV0IGZsZXgtMVwiLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1tb25vIHRleHQtc2xhdGUtNDAwIHctMTBcIj57Y2ZnLnJoSGl9JTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj17Y2ZnLnJoTG8rNX0gbWF4PVwiOTBcIiB2YWx1ZT17Y2ZnLnJoSGl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldENmZyhjID0+ICh7Li4uYywgcmhIaTorZS50YXJnZXQudmFsdWUsIHJoUHJlc2V0OidjdXN0b20nfSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2UtaW5wdXQgZmxleC0xXCIvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBBeGlzIHJhbmdlICovfVxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj5UZW1wZXJhdHVyZSBBeGlzIFJhbmdlPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMyBtYi0yXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1tb25vIHRleHQtc2xhdGUtNDAwIHctMTBcIj57Y2ZnLnRMb33CsDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj1cIi00MFwiIG1heD17Y2ZnLnRIaS0xMH0gdmFsdWU9e2NmZy50TG99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZSgndExvJywgK2UudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLWlucHV0IGZsZXgtMVwiLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1tb25vIHRleHQtc2xhdGUtNDAwIHctMTBcIj57Y2ZnLnRIaX3CsDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj17Y2ZnLnRMbysxMH0gbWF4PVwiNjBcIiB2YWx1ZT17Y2ZnLnRIaX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlKCd0SGknLCArZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2UtaW5wdXQgZmxleC0xXCIvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTIgbGVhZGluZy1yZWxheGVkXCI+XG4gICAgICAgICAgICAgICAgICAgIENoYXJ0IHdpbGwgYmUgcmVkcmF3biB3aXRoIHRoaXMgZHJ5LWJ1bGIgdGVtcGVyYXR1cmUgd2luZG93LlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvcmRlci10IGJvcmRlci1zbGF0ZS04MDAgcHQtNFwiPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgICAgICBDaGFuZ2VzIHByZXZpZXcgbGl2ZSBpbiB0aGUgc2tlbGV0b24gY2hhcnQgb24gdGhlIGxlZnQuICBIaXRcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1pbmRpZ28tNDAwIGZvbnQtYmxhY2tcIj4gU2F2ZSAmIHJldHVybiA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIGluIHRoZSBoZWFkZXIgd2hlbiB5b3UncmUgaGFwcHkuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIExvY2F0aW9uIFNldHRpbmcgLS0gbW9kYWwgdy8gaW50ZXJhY3RpdmUgTGVhZmxldCBtYXAgKyByZXZlcnNlIGdlb2NvZGluZ1xuICogQ2xpY2sgYW55d2hlcmUgb24gdGhlIG1hcCAob3IgZHJhZyB0aGUgbWFya2VyKSB0byBzZXQgbGF0L2xvbi5cbiAqIE1hbnVhbCBsYXQvbG9uIGVkaXRzIHJlLWNlbnRyZSB0aGUgbWFya2VyLiAgQ2l0eSBuYW1lIGlzIGF1dG8tcG9wdWxhdGVkXG4gKiB2aWEgT3BlblN0cmVldE1hcCBOb21pbmF0aW0gKG5vIGtleSByZXF1aXJlZCwgcmF0ZS1saW1pdGVkIHRvIH4xIHJlcS9zKS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyogRGUtZHVwICsgc2FuaXR5LWNoZWNrIGEgcmF3IHNhdmVkLWxvY2F0aW9ucyBhcnJheSAoZnJvbSBzZXJ2ZXIgb3JcbiAqIGxvY2FsU3RvcmFnZSkuICBEcm9wcyBlbnRyaWVzIG1pc3NpbmcgYSBuYW1lIG9yIHdpdGggbm9uLWZpbml0ZSBsYXQvbG9uLFxuICoga2VlcHMgdGhlIEZJUlNUIG9jY3VycmVuY2Ugb2YgZWFjaCB1bmlxdWUgbmFtZS4gIFVzZWQgYnkgTG9jYXRpb25Nb2RhbCdzXG4gKiBTaXRlLW5hbWUgZGF0YWxpc3QgYmVsb3cuICovXG5mdW5jdGlvbiBfbm9ybWFsaXplTG9jcyhhcnIpIHtcbiAgICBjb25zdCBzZWVuID0gbmV3IFNldCgpO1xuICAgIGNvbnN0IG91dCA9IFtdO1xuICAgIGZvciAoY29uc3QgbCBvZiAoYXJyIHx8IFtdKSkge1xuICAgICAgICBpZiAoIWwgfHwgdHlwZW9mIGwubmFtZSAhPT0gJ3N0cmluZycpIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCBsYXQgPSArbC5sYXQsIGxvbiA9ICtsLmxvbjtcbiAgICAgICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUobGF0KSB8fCAhTnVtYmVyLmlzRmluaXRlKGxvbikpIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCBrZXkgPSBsLm5hbWUudHJpbSgpO1xuICAgICAgICBpZiAoIWtleSB8fCBzZWVuLmhhcyhrZXkpKSBjb250aW51ZTtcbiAgICAgICAgc2Vlbi5hZGQoa2V5KTtcbiAgICAgICAgb3V0LnB1c2goeyBuYW1lOmtleSwgbGF0LCBsb24gfSk7XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG59XG5cbmZ1bmN0aW9uIExvY2F0aW9uTW9kYWwoeyBjZmcsIHNldENmZywgb25DbG9zZSwgb25TYXZlIH0pIHtcbiAgICBjb25zdCBtYXBCb3hSZWYgPSBSZWFjdC51c2VSZWYobnVsbCk7XG4gICAgY29uc3QgbWFwUmVmICAgID0gUmVhY3QudXNlUmVmKG51bGwpO1xuICAgIGNvbnN0IG1hcmtlclJlZiA9IFJlYWN0LnVzZVJlZihudWxsKTtcbiAgICBjb25zdCBbZ2VvQnVzeSwgc2V0R2VvQnVzeV0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG5cbiAgICAvKiAtLS0tLSBzYXZlZCBsb2NhdGlvbnMgLS0gbWlycm9yIHdoYXQgdGhlIERhc2hib2FyZCdzIFdlYXRoZXIgYnV0dG9uIHNob3dzLlxuICAgICAqXG4gICAgICogVGhlIGRhc2hib2FyZCByZWFkcyB0aGVtIGZyb20gYCR7QVBJX1VSTH0vYXBpL3dlYXRoZXItbG9jYXRpb25gJ3NcbiAgICAgKiBgc2F2ZWRgIGFycmF5IGFuZCBtaXJyb3JzIHRoYXQgaW50byBsb2NhbFN0b3JhZ2VbJ3NhdmVkV2VhdGhlckxvY2F0aW9ucyddXG4gICAgICogb24gbW91bnQgKHNlZSBwdWJsaWMvanMvZGFzaGJvYXJkL2FwcC5qcyNoeWRyYXRlV2VhdGhlclN0YXRlKS4gIFdlIGRvXG4gICAgICogdGhlIFNBTUUgdGhpbmcgaGVyZSBzbyB0aGUgU2V0dXAgV2FsaydzIFNpdGUtbmFtZSBkcm9wZG93biBzdGF5c1xuICAgICAqIGJ5dGUtaWRlbnRpY2FsIHdpdGggdGhlIGRhc2hib2FyZCdzIGxvY2F0aW9uIGxpc3QgLS0gaW5jbHVkaW5nIHdoZW4gdGhlXG4gICAgICogb3BlcmF0b3IgdmlzaXRzIFNldHVwIFdhbGsgQkVGT1JFIGV2ZXIgb3BlbmluZyB0aGUgZGFzaGJvYXJkIChmcmVzaFxuICAgICAqIGRldmljZSBjYXNlIHdoZXJlIGxvY2FsU3RvcmFnZSBpcyBlbXB0eSkuXG4gICAgICpcbiAgICAgKiBTdHJhdGVneTpcbiAgICAgKiAgIDEpIFJlYWQgbG9jYWxTdG9yYWdlIGZpcnN0IChpbnN0YW50LCBubyBmbGlja2VyIGlmIGFscmVhZHkgaHlkcmF0ZWQpLlxuICAgICAqICAgMikgVGhlbiBHRVQgL2FwaS93ZWF0aGVyLWxvY2F0aW9uIChjYW5vbmljYWwsIGNyb3NzLWRldmljZSBzb3VyY2UpLlxuICAgICAqICAgMykgV2hpY2hldmVyIGlzIG5vbi1lbXB0eSB3aW5zOyBzZXJ2ZXIgd2lucyB0aWVzLlxuICAgICAqXG4gICAgICogRnJlZS1mb3JtIHR5cGluZyBpbiB0aGUgaW5wdXQgc3RpbGwgd29ya3MgLS0gdGhlIGRhdGFsaXN0IGlzIHN1Z2dlc3Rpb25cbiAgICAgKiBvbmx5LCB0aGUgaW5wdXQgbmV2ZXIgcmVzdHJpY3RzIHRoZSB2YWx1ZS4gKi9cbiAgICBjb25zdCBbc2F2ZWRMb2NzLCBzZXRTYXZlZExvY3NdID0gUmVhY3QudXNlU3RhdGUoKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmF3ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NhdmVkV2VhdGhlckxvY2F0aW9ucycpO1xuICAgICAgICAgICAgaWYgKCFyYXcpIHJldHVybiBbXTtcbiAgICAgICAgICAgIGNvbnN0IGFyciA9IEpTT04ucGFyc2UocmF3KTtcbiAgICAgICAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KGFycikgPyBfbm9ybWFsaXplTG9jcyhhcnIpIDogW107XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgcmV0dXJuIFtdOyB9XG4gICAgfSk7XG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgbGV0IGNhbmNlbGxlZCA9IGZhbHNlO1xuICAgICAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goJy9hcGkvd2VhdGhlci1sb2NhdGlvbicsIHsgY3JlZGVudGlhbHM6J2luY2x1ZGUnLCBjYWNoZTonbm8tc3RvcmUnIH0pO1xuICAgICAgICAgICAgICAgIGlmICghci5vaykgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGNvbnN0IGogPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzYXZlZCA9IF9ub3JtYWxpemVMb2NzKEFycmF5LmlzQXJyYXkoai5zYXZlZCkgPyBqLnNhdmVkIDogW10pO1xuICAgICAgICAgICAgICAgIGlmIChjYW5jZWxsZWQpIHJldHVybjtcbiAgICAgICAgICAgICAgICBpZiAoc2F2ZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBzZXRTYXZlZExvY3Moc2F2ZWQpO1xuICAgICAgICAgICAgICAgICAgICAvLyBNaXJyb3IgdG8gbG9jYWxTdG9yYWdlIHNvIHRoZSBkYXNoYm9hcmQgc2VlcyB0aGUgc2FtZSBsaXN0XG4gICAgICAgICAgICAgICAgICAgIC8vIGV2ZW4gaWYgaXRzIG93biBoeWRyYXRlIGhhc24ndCBydW4geWV0IHRoaXMgc2Vzc2lvbi5cbiAgICAgICAgICAgICAgICAgICAgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3NhdmVkV2VhdGhlckxvY2F0aW9ucycsIEpTT04uc3RyaW5naWZ5KHNhdmVkKSk7IH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBvZmZsaW5lIC0+IGxvY2FsU3RvcmFnZSB2YWx1ZSBhbHJlYWR5IGluIHN0YXRlICovIH1cbiAgICAgICAgfSkoKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHsgY2FuY2VsbGVkID0gdHJ1ZTsgfTtcbiAgICB9LCBbXSk7XG5cbiAgICAvKiAtLS0tLSBzYXZlZC1sb2NhdGlvbnMgZHJvcGRvd24gb3Blbi9jbG9zZSBzdGF0ZS5cbiAgICAgKiBOYXRpdmUgPGRhdGFsaXN0PiBoaWRlcyBpdHMgY2hldnJvbiBpbiBtb3N0IGJyb3dzZXJzIChlc3BlY2lhbGx5IGluXG4gICAgICogYSBkYXJrIHRoZW1lKSwgd2hpY2ggbWFkZSB0aGUgXCJkcm9wIGRvd25cIiBpbnZpc2libGUgdG8gb3BlcmF0b3JzXG4gICAgICogd2hvIGNsZWFybHkgaGFkIG11bHRpcGxlIHNhdmVkIGxvY2F0aW9ucy4gIFJlcGxhY2VkIHdpdGggYSBjdXN0b21cbiAgICAgKiBwb3Bkb3duIHBhbmVsIHRoYXQgaGFzIGFuIEFMV0FZUy1WSVNJQkxFIGNoZXZyb24gYnV0dG9uIC0tIGNsaWNrIGl0XG4gICAgICogdG8gdG9nZ2xlLCBjbGljayBvdXRzaWRlIHRvIGRpc21pc3MuICovXG4gICAgY29uc3QgW3NhdmVkT3Blbiwgc2V0U2F2ZWRPcGVuXSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBzYXZlZFJlZiA9IFJlYWN0LnVzZVJlZihudWxsKTtcbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoIXNhdmVkT3BlbikgcmV0dXJuO1xuICAgICAgICBjb25zdCBvbkRvY0NsaWNrID0gKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChzYXZlZFJlZi5jdXJyZW50ICYmICFzYXZlZFJlZi5jdXJyZW50LmNvbnRhaW5zKGUudGFyZ2V0KSkgc2V0U2F2ZWRPcGVuKGZhbHNlKTtcbiAgICAgICAgfTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2NDbGljayk7XG4gICAgICAgIHJldHVybiAoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKTtcbiAgICB9LCBbc2F2ZWRPcGVuXSk7XG5cbiAgICAvKiBXaGVuIHRoZSB1c2VyIHBpY2tzIGEgbmFtZSBmcm9tIHRoZSBkcm9wZG93biBPUiB0eXBlcyBvbmUgdGhhdFxuICAgICAqIGV4YWN0bHkgbWF0Y2hlcyBhIHNhdmVkIGVudHJ5LCBwdWxsIGl0cyBsYXQvbG9uIGFuZCByZWNlbnRyZSB0aGVcbiAgICAgKiBtYXAuICBGcmVlLWZvcm0gdHlwaW5nIHN0aWxsIHdvcmtzIC0tIHRoZSBuYW1lIGlzIGp1c3Qga2VwdCBhcyB0aGVcbiAgICAgKiBzaXRlIGxhYmVsLiAgQXZvaWRzIHN1cnByaXNpbmcgdGhlIG9wZXJhdG9yIHdobyB0eXBlcyBcIlBhdmlsaW9uIEJcIlxuICAgICAqIChhIGxhYmVsIHRoZXkgaW52ZW50ZWQpIGFuZCBleHBlY3RzIHRoZSBtYXAgTk9UIHRvIGp1bXAuICovXG4gICAgY29uc3Qgb25TaXRlTmFtZUNoYW5nZSA9IChuZXdOYW1lKSA9PiB7XG4gICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgc2l0ZU5hbWU6bmV3TmFtZX0pKTtcbiAgICAgICAgY29uc3QgaGl0ID0gc2F2ZWRMb2NzLmZpbmQocyA9PiBzLm5hbWUgPT09IG5ld05hbWUpO1xuICAgICAgICBpZiAoaGl0KSB7XG4gICAgICAgICAgICBjb25zdCBsYXQgPSBNYXRoLnJvdW5kKGhpdC5sYXQgKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgICAgIGNvbnN0IGxvbiA9IE1hdGgucm91bmQoaGl0LmxvbiAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBzaXRlTmFtZTpuZXdOYW1lLCBsYXQsIGxvbiwgY2l0eTpuZXdOYW1lfSkpO1xuICAgICAgICAgICAgaWYgKG1hcFJlZi5jdXJyZW50KSBtYXBSZWYuY3VycmVudC5zZXRWaWV3KFtsYXQsIGxvbl0sIDExKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgcGlja1NhdmVkTG9jID0gKGxvYykgPT4ge1xuICAgICAgICBzZXRTYXZlZE9wZW4oZmFsc2UpO1xuICAgICAgICBvblNpdGVOYW1lQ2hhbmdlKGxvYy5uYW1lKTtcbiAgICB9O1xuXG4gICAgLyogLS0tLS0gc2VhcmNoIHN0YXRlIC0tLS0tICovXG4gICAgY29uc3QgW3NlYXJjaFEsIHNldFNlYXJjaFFdICAgICAgICAgPSBSZWFjdC51c2VTdGF0ZSgnJyk7XG4gICAgY29uc3QgW3NlYXJjaEhpdHMsIHNldFNlYXJjaEhpdHNdICAgPSBSZWFjdC51c2VTdGF0ZShbXSk7XG4gICAgY29uc3QgW3NlYXJjaEJ1c3ksIHNldFNlYXJjaEJ1c3ldICAgPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3QgW3NlYXJjaE9wZW4sIHNldFNlYXJjaE9wZW5dICAgPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3Qgc2VhcmNoRGVib3VuY2VSZWYgICAgICAgICAgICAgPSBSZWFjdC51c2VSZWYobnVsbCk7XG5cbiAgICAvKiBGb3J3YXJkLWdlb2NvZGU6IHF1ZXJ5IC0+IFt7bGF0LCBsb24sIGRpc3BsYXlfbmFtZSwgdHlwZSwgLi4ufV0gKi9cbiAgICBjb25zdCBydW5TZWFyY2ggPSBhc3luYyAocSkgPT4ge1xuICAgICAgICBpZiAoIXEgfHwgcS50cmltKCkubGVuZ3RoIDwgMykgeyBzZXRTZWFyY2hIaXRzKFtdKTsgcmV0dXJuOyB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzZXRTZWFyY2hCdXN5KHRydWUpO1xuICAgICAgICAgICAgY29uc3QgdXJsID0gYGh0dHBzOi8vbm9taW5hdGltLm9wZW5zdHJlZXRtYXAub3JnL3NlYXJjaD9mb3JtYXQ9anNvbiZsaW1pdD02JnE9JHtlbmNvZGVVUklDb21wb25lbnQocSl9YDtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCh1cmwsIHsgaGVhZGVyczp7ICdBY2NlcHQnOidhcHBsaWNhdGlvbi9qc29uJyB9IH0pO1xuICAgICAgICAgICAgY29uc3QgaiA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgICAgICAgc2V0U2VhcmNoSGl0cyhBcnJheS5pc0FycmF5KGopID8gaiA6IFtdKTtcbiAgICAgICAgICAgIHNldFNlYXJjaE9wZW4odHJ1ZSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgc2V0U2VhcmNoSGl0cyhbXSk7IH1cbiAgICAgICAgZmluYWxseSB7IHNldFNlYXJjaEJ1c3koZmFsc2UpOyB9XG4gICAgfTtcblxuICAgIC8qIGRlYm91bmNlZCBzZWFyY2gtb24tdHlwZSAqL1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmIChzZWFyY2hEZWJvdW5jZVJlZi5jdXJyZW50KSBjbGVhclRpbWVvdXQoc2VhcmNoRGVib3VuY2VSZWYuY3VycmVudCk7XG4gICAgICAgIHNlYXJjaERlYm91bmNlUmVmLmN1cnJlbnQgPSBzZXRUaW1lb3V0KCgpID0+IHJ1blNlYXJjaChzZWFyY2hRKSwgNDAwKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHNlYXJjaERlYm91bmNlUmVmLmN1cnJlbnQgJiYgY2xlYXJUaW1lb3V0KHNlYXJjaERlYm91bmNlUmVmLmN1cnJlbnQpO1xuICAgIH0sIFtzZWFyY2hRXSk7XG5cbiAgICBjb25zdCBwaWNrU2VhcmNoSGl0ID0gKGhpdCkgPT4ge1xuICAgICAgICBjb25zdCBsYXQgPSBNYXRoLnJvdW5kKCtoaXQubGF0ICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgIGNvbnN0IGxvbiA9IE1hdGgucm91bmQoK2hpdC5sb24gKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBsYXQsIGxvbiwgY2l0eTpoaXQuZGlzcGxheV9uYW1lfSkpO1xuICAgICAgICBpZiAobWFwUmVmLmN1cnJlbnQpIG1hcFJlZi5jdXJyZW50LnNldFZpZXcoW2xhdCwgbG9uXSwgaGl0LnR5cGUgPT09ICdjaXR5JyA/IDExIDogMTUpO1xuICAgICAgICBzZXRTZWFyY2hPcGVuKGZhbHNlKTtcbiAgICAgICAgc2V0U2VhcmNoUSgnJyk7XG4gICAgfTtcblxuICAgIC8qIFJldmVyc2UtZ2VvY29kZSBsYXQvbG9uIC0+IGNpdHkgLyBjb3VudHJ5IHZpYSBOb21pbmF0aW0uICBObyBBUEkga2V5LiAqL1xuICAgIGNvbnN0IHJldmVyc2VHZW9jb2RlID0gYXN5bmMgKGxhdCwgbG9uKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzZXRHZW9CdXN5KHRydWUpO1xuICAgICAgICAgICAgY29uc3QgdXJsID0gYGh0dHBzOi8vbm9taW5hdGltLm9wZW5zdHJlZXRtYXAub3JnL3JldmVyc2U/Zm9ybWF0PWpzb24mbGF0PSR7bGF0fSZsb249JHtsb259Jnpvb209MTBgO1xuICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwgeyBoZWFkZXJzOiB7ICdBY2NlcHQnOidhcHBsaWNhdGlvbi9qc29uJyB9IH0pO1xuICAgICAgICAgICAgY29uc3QgaiA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgICAgICAgY29uc3QgYSA9IGouYWRkcmVzcyB8fCB7fTtcbiAgICAgICAgICAgIGNvbnN0IGNpdHkgPSBhLmNpdHkgfHwgYS50b3duIHx8IGEudmlsbGFnZSB8fCBhLmhhbWxldCB8fCBhLmNvdW50eSB8fCAnJztcbiAgICAgICAgICAgIGNvbnN0IHJlZ2lvbiA9IGEuc3RhdGUgfHwgYS5yZWdpb24gfHwgJyc7XG4gICAgICAgICAgICBjb25zdCBjb3VudHJ5ID0gYS5jb3VudHJ5IHx8ICcnO1xuICAgICAgICAgICAgY29uc3QgbGFiZWwgPSBbY2l0eSwgcmVnaW9uLCBjb3VudHJ5XS5maWx0ZXIoQm9vbGVhbikuam9pbignLCAnKSB8fCBqLmRpc3BsYXlfbmFtZSB8fCAnJztcbiAgICAgICAgICAgIGlmIChsYWJlbCkgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBjaXR5OmxhYmVsfSkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IC8qIG9mZmxpbmUgb3IgcmF0ZS1saW1pdGVkIC0+IGtlZXAgcHJpb3IgbmFtZSAqLyB9XG4gICAgICAgIGZpbmFsbHkgeyBzZXRHZW9CdXN5KGZhbHNlKTsgfVxuICAgIH07XG5cbiAgICAvKiBJbml0IExlYWZsZXQgb24gZmlyc3QgcmVuZGVyIG9mIHRoZSBtb2RhbCAqL1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmICghbWFwQm94UmVmLmN1cnJlbnQgfHwgbWFwUmVmLmN1cnJlbnQpIHJldHVybjtcbiAgICAgICAgY29uc3QgbWFwID0gTC5tYXAobWFwQm94UmVmLmN1cnJlbnQsIHsgem9vbUNvbnRyb2w6IHRydWUsIGF0dHJpYnV0aW9uQ29udHJvbDogdHJ1ZSB9KVxuICAgICAgICAgICAgICAgICAgICAgLnNldFZpZXcoW2NmZy5sYXQsIGNmZy5sb25dLCA2KTtcbiAgICAgICAgTC50aWxlTGF5ZXIoJ2h0dHBzOi8ve3N9LnRpbGUub3BlbnN0cmVldG1hcC5vcmcve3p9L3t4fS97eX0ucG5nJywge1xuICAgICAgICAgICAgbWF4Wm9vbTogMTgsXG4gICAgICAgICAgICBhdHRyaWJ1dGlvbjogJyZjb3B5OyBPcGVuU3RyZWV0TWFwIGNvbnRyaWJ1dG9ycycsXG4gICAgICAgIH0pLmFkZFRvKG1hcCk7XG5cbiAgICAgICAgY29uc3QgbWFya2VyID0gTC5tYXJrZXIoW2NmZy5sYXQsIGNmZy5sb25dLCB7IGRyYWdnYWJsZTogdHJ1ZSB9KS5hZGRUbyhtYXApO1xuICAgICAgICBtYXJrZXIuYmluZFRvb2x0aXAoJ0RyYWcgbWUgb3IgY2xpY2sgYW55d2hlcmUgb24gdGhlIG1hcCcsIHsgcGVybWFuZW50OiBmYWxzZSB9KTtcblxuICAgICAgICBjb25zdCBhcHBseUxhdExvbiA9IChsYXQsIGxvbikgPT4ge1xuICAgICAgICAgICAgY29uc3QgciA9IChuKSA9PiBNYXRoLnJvdW5kKG4gKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgbGF0OnIobGF0KSwgbG9uOnIobG9uKX0pKTtcbiAgICAgICAgICAgIHJldmVyc2VHZW9jb2RlKHIobGF0KSwgcihsb24pKTtcbiAgICAgICAgfTtcbiAgICAgICAgbWFya2VyLm9uKCdkcmFnZW5kJywgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGwgPSBtYXJrZXIuZ2V0TGF0TG5nKCk7XG4gICAgICAgICAgICBhcHBseUxhdExvbihsbC5sYXQsIGxsLmxuZyk7XG4gICAgICAgIH0pO1xuICAgICAgICBtYXAub24oJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgIG1hcmtlci5zZXRMYXRMbmcoZS5sYXRsbmcpO1xuICAgICAgICAgICAgYXBwbHlMYXRMb24oZS5sYXRsbmcubGF0LCBlLmxhdGxuZy5sbmcpO1xuICAgICAgICB9KTtcblxuICAgICAgICBtYXBSZWYuY3VycmVudCA9IG1hcDtcbiAgICAgICAgbWFya2VyUmVmLmN1cnJlbnQgPSBtYXJrZXI7XG5cbiAgICAgICAgLyogTGVhZmxldCByZW5kZXJzIGJsYW5rIGlmIGl0IGJvb3RzIGluc2lkZSBhIGhpZGRlbiBlbGVtZW50IOKAlCBraWNrIGl0XG4gICAgICAgICAgIG9uY2UgdGhlIG1vZGFsIGFuaW1hdGlvbiBzZXR0bGVzLiAqL1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IG1hcC5pbnZhbGlkYXRlU2l6ZSgpLCAyNTApO1xuICAgICAgICByZXR1cm4gKCkgPT4geyBtYXAucmVtb3ZlKCk7IG1hcFJlZi5jdXJyZW50ID0gbnVsbDsgbWFya2VyUmVmLmN1cnJlbnQgPSBudWxsOyB9O1xuICAgIH0sIFtdKTtcblxuICAgIC8qIEtlZXAgbWFya2VyIGluIHN5bmMgd2hlbiB1c2VyIGVkaXRzIGxhdC9sb24gZmllbGRzIG1hbnVhbGx5ICovXG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKG1hcFJlZi5jdXJyZW50ICYmIG1hcmtlclJlZi5jdXJyZW50KSB7XG4gICAgICAgICAgICBtYXJrZXJSZWYuY3VycmVudC5zZXRMYXRMbmcoW2NmZy5sYXQsIGNmZy5sb25dKTtcbiAgICAgICAgICAgIG1hcFJlZi5jdXJyZW50LnBhblRvKFtjZmcubGF0LCBjZmcubG9uXSk7XG4gICAgICAgIH1cbiAgICB9LCBbY2ZnLmxhdCwgY2ZnLmxvbl0pO1xuXG4gICAgLyogR2VvbG9jYXRpb246IHNpbGVudGx5IG5vLW9wJ2QgYmVmb3JlIC0tIGlmIHRoZSBicm93c2VyIGJsb2NrZWQgdGhlXG4gICAgICogcmVxdWVzdCAoSFRUUCBvcmlnaW4gPSBub3QgYSBzZWN1cmUgY29udGV4dCBvbiBmaWVsZCBjb250cm9sbGVycywgb3JcbiAgICAgKiB0aGUgdXNlciBkZW5pZWQgcGVybWlzc2lvbiBlYXJsaWVyKSB0aGUgYnV0dG9uIGp1c3Qgc2F0IHRoZXJlLlxuICAgICAqIE5vdyB3ZSBzdXJmYWNlIGEgc3RhdGUgKGJ1c3kgLyBlcnIpIHNvIHRoZSBvcGVyYXRvciBjYW4gc2VlIFdIWSBpdFxuICAgICAqIGZhaWxlZCBhbmQgYWN0IG9uIGl0IChzd2l0Y2ggdG8gSFRUUFMsIHJlLXByb21wdCwgb3IgdXNlIHRoZSBtYXApLiAqL1xuICAgIGNvbnN0IFtnZW9TdGF0ZSwgc2V0R2VvU3RhdGVdID0gUmVhY3QudXNlU3RhdGUobnVsbCk7ICAgLy8gbnVsbCB8ICdidXN5JyB8IHtlcnJ9XG4gICAgY29uc3QgdXNlTXlMb2NhdGlvbiA9ICgpID0+IHtcbiAgICAgICAgc2V0R2VvU3RhdGUoJ2J1c3knKTtcbiAgICAgICAgLy8gbmF2aWdhdG9yLmdlb2xvY2F0aW9uIGlzIGB1bmRlZmluZWRgIG9uIEhUVFAgb3JpZ2lucyAoQ2hyb21lIDUwKykuXG4gICAgICAgIGlmICghbmF2aWdhdG9yLmdlb2xvY2F0aW9uKSB7XG4gICAgICAgICAgICBzZXRHZW9TdGF0ZSh7IGVycjonQnJvd3NlciBibG9ja2VkIGxvY2F0aW9uIGFjY2VzcyDigJQgb3BlbiB0aGlzIHBhZ2UgdmlhIEhUVFBTLicgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihcbiAgICAgICAgICAgIChwb3MpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBsYXQgPSBNYXRoLnJvdW5kKHBvcy5jb29yZHMubGF0aXR1ZGUgICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgICAgICAgICAgY29uc3QgbG9uID0gTWF0aC5yb3VuZChwb3MuY29vcmRzLmxvbmdpdHVkZSAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgbGF0LCBsb259KSk7XG4gICAgICAgICAgICAgICAgaWYgKG1hcFJlZi5jdXJyZW50KSBtYXBSZWYuY3VycmVudC5zZXRWaWV3KFtsYXQsIGxvbl0sIDExKTtcbiAgICAgICAgICAgICAgICByZXZlcnNlR2VvY29kZShsYXQsIGxvbik7XG4gICAgICAgICAgICAgICAgc2V0R2VvU3RhdGUobnVsbCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGVyci5jb2RlOiAxPVBFUk1JU1NJT05fREVOSUVELCAyPVBPU0lUSU9OX1VOQVZBSUxBQkxFLCAzPVRJTUVPVVRcbiAgICAgICAgICAgICAgICBjb25zdCBtc2cgPSBlcnIgJiYgZXJyLmNvZGUgPT09IDFcbiAgICAgICAgICAgICAgICAgICAgPyAnTG9jYXRpb24gcGVybWlzc2lvbiBkZW5pZWQg4oCUIGNsaWNrIHRoZSBsb2NrIGljb24gaW4gdGhlIGFkZHJlc3MgYmFyIGFuZCBhbGxvdyBsb2NhdGlvbi4nXG4gICAgICAgICAgICAgICAgICAgIDogZXJyICYmIGVyci5jb2RlID09PSAyXG4gICAgICAgICAgICAgICAgICAgICAgICA/ICdMb2NhdGlvbiBjdXJyZW50bHkgdW5hdmFpbGFibGUg4oCUIHRoZSBkZXZpY2UgaGFzIG5vIEdQUyAvIFdpLUZpIGZpeCB5ZXQuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgOiBlcnIgJiYgZXJyLmNvZGUgPT09IDNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdMb2NhdGlvbiByZXF1ZXN0IHRpbWVkIG91dCDigJQgdHJ5IGFnYWluLCBvciB1c2UgdGhlIG1hcCAvIHNlYXJjaCBiYXIuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogKGVyciAmJiBlcnIubWVzc2FnZSkgfHwgJ0NvdWxkIG5vdCByZWFkIGRldmljZSBsb2NhdGlvbi4nO1xuICAgICAgICAgICAgICAgIHNldEdlb1N0YXRlKHsgZXJyOiBtc2cgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeyBlbmFibGVIaWdoQWNjdXJhY3k6dHJ1ZSwgdGltZW91dDoxMDAwMCwgbWF4aW11bUFnZTowIH1cbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgLyogV2hlbiB1c2VyIGNsaWNrcyBcIlNhdmUgJiByZXR1cm5cIiwgbWlycm9yIEVYQUNUTFkgd2hhdCB0aGUgZGFzaGJvYXJkJ3NcbiAgICAgKiBXZWF0aGVyIGJ1dHRvbiBkb2VzIGluIHdlYXRoZXItc2V0dGluZ3MtbW9kYWwuanMjc2VsZWN0TG9jYXRpb246XG4gICAgICogICAxLiBsb2NhbFN0b3JhZ2VbJ3dlYXRoZXJMb2NhdGlvbiddICAgICAgICA9IGNob3NlbiBsb2MgKGNhbm9uaWNhbCBrZXlcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgZGFzaGJvYXJkIHJlYWRzIG9uXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW91bnQsIE5PVCAncmVkNS53ZWF0aGVyX2xvY2F0aW9uJykuXG4gICAgICogICAyLiBsb2NhbFN0b3JhZ2VbJ3NhdmVkV2VhdGhlckxvY2F0aW9ucyddICA9IFtsb2MsIC4uLm90aGVyc10gZGVkdXBlZFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ5IGxhdC9sb24sIGNhcHBlZCBhdCAyMC5cbiAgICAgKiAgIDMuIFBPU1QgL2FwaS93ZWF0aGVyLWxvY2F0aW9uIHdpdGggYWN0aXZlK2RlZmF1bHQrc2F2ZWQgc28gdGhlIHNhbWVcbiAgICAgKiAgICAgIGxpc3Qgc3Vydml2ZXMgY3Jvc3MtZGV2aWNlIHNlc3Npb25zIGZvciBzaWduZWQtaW4gdGVuYW50cy5cbiAgICAgKlxuICAgICAqIFdpdGhvdXQgc3RlcCAxIHRoZSBkYXNoYm9hcmQncyBgd2VhdGhlckxvY2F0aW9uYCBzdGF0ZSBzaWxlbnRseSBrZWVwc1xuICAgICAqIGl0cyBvbGQgdmFsdWUgLS0gd2hpY2ggaXMgZXhhY3RseSB0aGUgYnVnIG9wZXJhdG9ycyByZXBvcnRlZCBhZnRlclxuICAgICAqIHBpY2tpbmcgYSBsb2NhdGlvbiBpbiBTZXR1cCBXYWxrIGFuZCBzZWVpbmcgdGhlIGRhc2hib2FyZCdzIHdlYXRoZXJcbiAgICAgKiBzdHJpcCByZWZ1c2UgdG8gdXBkYXRlLiAqL1xuICAgIGNvbnN0IFtzYXZlTXNnLCBzZXRTYXZlTXNnXSA9IFJlYWN0LnVzZVN0YXRlKG51bGwpO1xuICAgIGNvbnN0IHBlcnNpc3RBbmRTYXZlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBsb2MgPSB7IGxhdDogY2ZnLmxhdCwgbG9uOiBjZmcubG9uLCBuYW1lOiBjZmcuc2l0ZU5hbWUgfHwgY2ZnLmNpdHkgfTtcblxuICAgICAgICAvLyBEZS1kdXAgdGhlIGV4aXN0aW5nIHNhdmVkIGxpc3QgYnkgbGF0L2xvbiAoc2FtZSBrZXkgdGhlIGRhc2hib2FyZFxuICAgICAgICAvLyB1c2VzKSBhbmQgcHV0IHRoZSBuZXcgcGljayBhdCB0aGUgdG9wLiAgQ2FwIGF0IDIwIHRvIG1hdGNoIHRoZVxuICAgICAgICAvLyBkYXNoYm9hcmQncyBiZWhhdmlvdXIuXG4gICAgICAgIGNvbnN0IGtleSA9IGxvYy5sYXQudG9GaXhlZCg0KSArICcsJyArIGxvYy5sb24udG9GaXhlZCg0KTtcbiAgICAgICAgY29uc3QgZGVkdXBlZCA9IHNhdmVkTG9jcy5maWx0ZXIobCA9PiAobC5sYXQudG9GaXhlZCg0KSArICcsJyArIGwubG9uLnRvRml4ZWQoNCkpICE9PSBrZXkpO1xuICAgICAgICBjb25zdCBuZXh0U2F2ZWQgPSBbbG9jLCAuLi5kZWR1cGVkXS5zbGljZSgwLCAyMCk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd3ZWF0aGVyTG9jYXRpb24nLCBKU09OLnN0cmluZ2lmeShsb2MpKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzYXZlZFdlYXRoZXJMb2NhdGlvbnMnLCBKU09OLnN0cmluZ2lmeShuZXh0U2F2ZWQpKTtcbiAgICAgICAgICAgIC8vIEtlZXAgdGhlIG9sZCBrZXkgdG9vIC0tIHNvbWUgbGVnYWN5IHBsdWctaW5zIHN0aWxsIGxvb2sgYXQgaXQuXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS53ZWF0aGVyX2xvY2F0aW9uJywgSlNPTi5zdHJpbmdpZnkobG9jKSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogcHJpdmF0ZSBtb2RlIC0tIGlnbm9yZSAqLyB9XG5cbiAgICAgICAgbGV0IHBlcnNpc3RlZCA9IGZhbHNlLCB3YXJuaW5nID0gJyc7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goJy9hcGkvd2VhdGhlci1sb2NhdGlvbicsIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICBjcmVkZW50aWFsczogJ2luY2x1ZGUnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6J2FwcGxpY2F0aW9uL2pzb24nIH0sXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBhY3RpdmU6IGxvYywgZGVmYXVsdDogbG9jLCBzYXZlZDogbmV4dFNhdmVkIH0pLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBqID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgICB3aW5kb3cuX2xhc3RXZWF0aGVyTG9jYXRpb25TYXZlID0gajtcbiAgICAgICAgICAgIHBlcnNpc3RlZCA9ICEhai5wZXJzaXN0ZWQ7XG4gICAgICAgICAgICB3YXJuaW5nICAgPSBqLndhcm5pbmcgfHwgJyc7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ1tzZXR1cCB3YWxrXSAvYXBpL3dlYXRoZXItbG9jYXRpb24gPC0nLCBqKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgd2FybmluZyA9ICdOZXR3b3JrIGVycm9yIOKAlCBzYXZlZCBsb2NhbGx5IG9ubHkuJztcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignW3NldHVwIHdhbGtdIGNvdWxkIG5vdCBwZXJzaXN0IGxvY2F0aW9uOicsIGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGVsbCBhbnkgb3BlbiBkYXNoYm9hcmQgdGFiIHRvIHJlLWh5ZHJhdGUuICBUaGUgZGFzaGJvYXJkXG4gICAgICAgIC8vIGFscmVhZHkgbGlzdGVucyBmb3IgYHN0b3JhZ2VgIGV2ZW50cyB3aGVuIGFub3RoZXIgdGFiIHdyaXRlcyB0b1xuICAgICAgICAvLyBsb2NhbFN0b3JhZ2UsIGJ1dCBvbiBWMS45IHNvbWUgYnJvd3NlcnMgRE9OJ1QgZmlyZSBgc3RvcmFnZWAgZm9yXG4gICAgICAgIC8vIHNhbWUtb3JpZ2luIHdyaXRlcyBmcm9tIHRoaXMgc2FtZSB0YWIuICBBbiBleHBsaWNpdCBjdXN0b20gZXZlbnRcbiAgICAgICAgLy8gbWFrZXMgdGhlIGRhc2hib2FyZCdzIHBvbGxpbmcgcGljayB0aGUgY2hhbmdlIHVwIGltbWVkaWF0ZWx5IGlmXG4gICAgICAgIC8vIGl0J3MgYWxyZWFkeSBtb3VudGVkIGluIGFub3RoZXIgdGFiL3dpbmRvdy5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncmVkNTp3ZWF0aGVyTG9jYXRpb25DaGFuZ2VkJyxcbiAgICAgICAgICAgICAgICB7IGRldGFpbDogeyBhY3RpdmU6IGxvYywgc2F2ZWQ6IG5leHRTYXZlZCB9IH0pKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBJRS1sZXNzIGVudmlyb25tZW50cyAtLSBuby1vcCAqLyB9XG5cbiAgICAgICAgaWYgKHBlcnNpc3RlZCkge1xuICAgICAgICAgICAgb25TYXZlKCk7ICAgICAgICAgICAvLyBoYXBweSBwYXRoOiBjbG9zZSArIG1hcmsgc3RlcCBkb25lXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvKiBTdXJmYWNlIHRoZSB3YXJuaW5nLCBob2xkIHRoZSBtb2RhbCBvcGVuIGZvciAxLjZzIHNvIHRoZVxuICAgICAgICAgICAgICogb3BlcmF0b3IgcmVhZHMgaXQsIHRoZW4gY2xvc2UuICBUaGUgbG9jYWwgY29weSBpcyBhbHJlYWR5XG4gICAgICAgICAgICAgKiB3cml0dGVuLCBzbyB0aGUgZGFzaGJvYXJkIHdpbGwgc3RpbGwgc2VlIHRoZSBuZXcgbG9jYXRpb25cbiAgICAgICAgICAgICAqIGluIHRoaXMgYnJvd3NlciBzZXNzaW9uLiAqL1xuICAgICAgICAgICAgc2V0U2F2ZU1zZyh3YXJuaW5nIHx8ICdTYXZlZCBsb2NhbGx5IG9ubHkg4oCUIHNpZ24gaW4gdG8gc2F2ZSBzZXJ2ZXItc2lkZS4nKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyBzZXRTYXZlTXNnKG51bGwpOyBvblNhdmUoKTsgfSwgMTYwMCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8TW9kYWxTaGVsbCB0aXRsZT1cIkxvY2F0aW9uIFNldHRpbmdcIiBzdWJ0aXRsZT1cIkNsaWNrIHRoZSBtYXAsIGRyYWcgdGhlIHBpbiwgb3IgdXNlIHlvdXIgZGV2aWNlXCIgYWNjZW50PVwiYW1iZXJcIiBvbkNsb3NlPXtvbkNsb3NlfSBvblNhdmU9e3BlcnNpc3RBbmRTYXZlfSBzaXplPVwibWF4XCI+XG4gICAgICAgICAgICB7c2F2ZU1zZyAmJiAoXG4gICAgICAgICAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cImxvYy1zYXZlLW1zZ1wiXG4gICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtYi0zIHB4LTQgcHktMi41IHJvdW5kZWQtbGcgYmctYW1iZXItOTAwLzMwIGJvcmRlciBib3JkZXItYW1iZXItNzAwLzUwIHRleHQtYW1iZXItMjAwIHRleHQteHMgZm9udC1tb25vXCI+XG4gICAgICAgICAgICAgICAgICAgIOKaoCAge3NhdmVNc2d9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIGxnOmdyaWQtY29scy1bMWZyXzM0MHB4XSBnYXAtNCBoLWZ1bGxcIiBzdHlsZT17e21pbkhlaWdodDonNTZ2aCd9fT5cbiAgICAgICAgICAgICAgICB7LyogTUFQIOKAlCBmaWxscyB0aGUgbGVmdCBzaWRlLCB3aXRoIGEgc2VhcmNoIGJhciBmbG9hdGluZyBvbiB0b3AgKi99XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZVwiIHN0eWxlPXt7bWluSGVpZ2h0Oic1NnZoJ319PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHJlZj17bWFwQm94UmVmfVxuICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGhlaWdodDonMTAwJScsIG1pbkhlaWdodDonNTZ2aCcsIHdpZHRoOicxMDAlJywgYm9yZGVyUmFkaXVzOicxMnB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzonaGlkZGVuJywgYm9yZGVyOicxcHggc29saWQgIzMzNDE1NScsIGJhY2tncm91bmQ6JyMwYjEyMjAnIH19Lz5cblxuICAgICAgICAgICAgICAgICAgICB7LyogU2VhcmNoIGJhciBvdmVybGF5IOKAlCBzaXRzIGluIHRoZSB0b3AtY2VudHJlIG9mIHRoZSBtYXAgKi99XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgdG9wLTMgbGVmdC0xLzIgLXRyYW5zbGF0ZS14LTEvMiB6LVs1MDBdXCIgc3R5bGU9e3t3aWR0aDonbWluKDU2MHB4LCBjYWxjKDEwMCUgLSAxMTBweCkpJ319PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtzZWFyY2hRfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldFNlYXJjaFEoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkZvY3VzPXsoKSA9PiBzZWFyY2hIaXRzLmxlbmd0aCAmJiBzZXRTZWFyY2hPcGVuKHRydWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIvCflI4gIFNlYXJjaCBieSBhZGRyZXNzLCBidWlsZGluZywgb3IgcGxhY2UgbmFtZeKAplwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBweC00IHB5LTIuNSByb3VuZGVkLXhsIGJnLXNsYXRlLTkwMC85NSBib3JkZXIgYm9yZGVyLXNsYXRlLTYwMCB0ZXh0LXNsYXRlLTEwMCB0ZXh0LXNtIHBsYWNlaG9sZGVyLXNsYXRlLTUwMCBzaGFkb3ctMnhsIGJhY2tkcm9wLWJsdXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e291dGxpbmU6J25vbmUnfX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWFyY2hCdXN5ICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYWJzb2x1dGUgcmlnaHQtMyB0b3AtMS8yIC10cmFuc2xhdGUteS0xLzIgdGV4dC1hbWJlci00MDAgdGV4dC14c1wiPuKApjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWFyY2hPcGVuICYmIHNlYXJjaEhpdHMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgdG9wLWZ1bGwgbGVmdC0wIHJpZ2h0LTAgbXQtMSBiZy1zbGF0ZS05MDAvOTcgYm9yZGVyIGJvcmRlci1zbGF0ZS03MDAgcm91bmRlZC14bCBzaGFkb3ctMnhsIG92ZXJmbG93LWhpZGRlbiBtYXgtaC03MiBvdmVyZmxvdy15LWF1dG8gYmFja2Ryb3AtYmx1clwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlYXJjaEhpdHMubWFwKChoLCBpKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e2gucGxhY2VfaWQgfHwgaX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHBpY2tTZWFyY2hIaXQoaCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgdGV4dC1sZWZ0IHB4LTQgcHktMi41IGhvdmVyOmJnLWFtYmVyLTkwMC8zMCBib3JkZXItYiBib3JkZXItc2xhdGUtODAwIGxhc3Q6Ym9yZGVyLWItMCB0cmFuc2l0aW9uLWFsbFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC1zbGF0ZS0yMDAgdHJ1bmNhdGVcIj57aC5kaXNwbGF5X25hbWV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBtdC0wLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtoLnR5cGUgfHwgaC5jbGFzc30gwrcgeygraC5sYXQpLnRvRml4ZWQoMyl9LCB7KCtoLmxvbikudG9GaXhlZCgzKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VhcmNoT3BlbiAmJiBzZWFyY2hIaXRzLmxlbmd0aCA9PT0gMCAmJiBzZWFyY2hRLmxlbmd0aCA+PSAzICYmICFzZWFyY2hCdXN5ICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSB0b3AtZnVsbCBsZWZ0LTAgcmlnaHQtMCBtdC0xIGJnLXNsYXRlLTkwMC85NyBib3JkZXIgYm9yZGVyLXNsYXRlLTcwMCByb3VuZGVkLXhsIHB4LTQgcHktMyB0ZXh0LXhzIHRleHQtc2xhdGUtNDAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBObyByZXN1bHRzIGZvciBcIntzZWFyY2hRfVwiLiAgVHJ5IGEgbW9yZSBzcGVjaWZpYyB0ZXJtLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgey8qIFNJREUgUEFORUwgKi99XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTQgb3ZlcmZsb3cteS1hdXRvIHByLTFcIj5cbiAgICAgICAgICAgICAgICAgICAgey8qIFNpdGUgbmFtZSBjb21iby1pbnB1dC4gIEZyZWUtZm9ybSB0eXBpbmcgZm9yIGZyZXNoXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbHM7IGEgdmlzaWJsZSBjaGV2cm9uIGJ1dHRvbiBvbiB0aGUgcmlnaHQgb3BlbnNcbiAgICAgICAgICAgICAgICAgICAgICAgIGEgY3VzdG9tIHBvcGRvd24gbGlzdGluZyBldmVyeSBzYXZlZCBsb2NhdGlvbiBwdWxsZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gL2FwaS93ZWF0aGVyLWxvY2F0aW9uIChpLmUuIHRoZSBTQU1FIGxpc3QgdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICBEYXNoYm9hcmQncyBXZWF0aGVyIGJ1dHRvbiBzdXJmYWNlcykuICBUaGlzIHJlcGxhY2VzXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGUgZWFybGllciBuYXRpdmUgPGRhdGFsaXN0PiB3aGljaCB3YXMgdG9vIHN1YnRsZVxuICAgICAgICAgICAgICAgICAgICAgICAgaW4gZGFyayB0aGVtZXMgLS0gb3BlcmF0b3JzIHdpdGggTj4wIHNhdmVkIGVudHJpZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdWxkIG5vdCB0ZWxsIGEgZHJvcGRvd24gZXhpc3RlZC4gKi99XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNpdGUgbmFtZSAoc2F2ZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NhdmVkTG9jcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibWwtMiB0ZXh0LWFtYmVyLTQwMC84MCBub3JtYWwtY2FzZSB0cmFja2luZy1ub3JtYWwgdGV4dC1bMTBweF1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImxvYy1zYXZlZC1oaW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICDilr4ge3NhdmVkTG9jcy5sZW5ndGh9IHNhdmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlXCIgcmVmPXtzYXZlZFJlZn0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0IHByLTlcIiB2YWx1ZT17Y2ZnLnNpdGVOYW1lIHx8ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImxvYy1zaXRlLW5hbWUtaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17c2F2ZWRMb2NzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ1BpY2sgYSBzYXZlZCBsb2NhdGlvbiwgb3IgdHlwZSBhIG5ldyBvbmXigKYnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdlLmcuIEhRIFRvd2VyLCBOb3J0aCBXaW5nLCBQYXZpbGlvbiBC4oCmJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBvblNpdGVOYW1lQ2hhbmdlKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Gb2N1cz17KCkgPT4gc2F2ZWRMb2NzLmxlbmd0aCA+IDAgJiYgc2V0U2F2ZWRPcGVuKHRydWUpfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NhdmVkTG9jcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImxvYy1zYXZlZC1jaGV2cm9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRTYXZlZE9wZW4odiA9PiAhdil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIk9wZW4gc2F2ZWQgbG9jYXRpb25zXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIlBpY2sgZnJvbSBzYXZlZCBsb2NhdGlvbnNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIHJpZ2h0LTEgdG9wLTEvMiAtdHJhbnNsYXRlLXktMS8yIHctNyBoLTcgcm91bmRlZC1tZCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBiZy1hbWJlci03MDAvMzAgaG92ZXI6YmctYW1iZXItNjAwLzUwIGJvcmRlciBib3JkZXItYW1iZXItNTAwLzQwIHRleHQtYW1iZXItMjAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiMTRcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMi40XCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7dHJhbnNmb3JtOiBzYXZlZE9wZW4gPyAncm90YXRlKDE4MGRlZyknIDogJ25vbmUnLCB0cmFuc2l0aW9uOid0cmFuc2Zvcm0gLjE1cyd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cG9seWxpbmUgcG9pbnRzPVwiNiA5IDEyIDE1IDE4IDlcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2F2ZWRPcGVuICYmIHNhdmVkTG9jcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cImxvYy1zYXZlZC1kcm9wZG93blwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgei1bNjAwXSBsZWZ0LTAgcmlnaHQtMCB0b3AtZnVsbCBtdC0xIGJnLXNsYXRlLTkwMCBib3JkZXIgYm9yZGVyLXNsYXRlLTYwMCByb3VuZGVkLWxnIHNoYWRvdy0yeGwgbWF4LWgtNjQgb3ZlcmZsb3cteS1hdXRvXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2F2ZWRMb2NzLm1hcChsb2MgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzQWN0aXZlID0gKGNmZy5zaXRlTmFtZSB8fCAnJykudHJpbSgpID09PSBsb2MubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGtleT17bG9jLm5hbWV9IHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHBpY2tTYXZlZExvYyhsb2MpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgbG9jLXNhdmVkLW9wdC0ke2xvYy5uYW1lfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdy1mdWxsIHRleHQtbGVmdCBweC0zIHB5LTIgYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTgwMCBsYXN0OmJvcmRlci1iLTAgaG92ZXI6YmctYW1iZXItOTAwLzMwIHRyYW5zaXRpb24tY29sb3JzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7aXNBY3RpdmUgPyAnYmctYW1iZXItOTAwLzUwJyA6ICcnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIHRleHQtc2xhdGUtMTAwIHRydW5jYXRlXCI+e2xvYy5uYW1lfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBmb250LW1vbm8gbXQtMC41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2xvYy5sYXQudG9GaXhlZCgyKX0sIHtsb2MubG9uLnRvRml4ZWQoMil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0xIGl0YWxpY1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzYXZlZExvY3MubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdQaWNrIGEgcHJldmlvdXNseS1zYXZlZCBsb2NhdGlvbiwgb3IgdHlwZSBhIG5ldyBsYWJlbCBmb3IgdGhpcyBwbGFjZS4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ1lvdXIgbGFiZWwgZm9yIHRoaXMgcGxhY2Ug4oCUIHNob3duIG9uIHRoZSBkYXNoYm9hcmQgaGVhZGVyLid9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyLXQgYm9yZGVyLXNsYXRlLTgwMCBwdC0zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlc29sdmVkIGFkZHJlc3MgLyBjaXR5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2dlb0J1c3kgJiYgPHNwYW4gY2xhc3NOYW1lPVwibWwtMiB0ZXh0LWFtYmVyLTQwMCBub3JtYWwtY2FzZSB0cmFja2luZy1ub3JtYWxcIj7igKYgcmVzb2x2aW5nPC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCIgdmFsdWU9e2NmZy5jaXR5fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSk9PnNldENmZyh7Li4uY2ZnLCBjaXR5OmUudGFyZ2V0LnZhbHVlfSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTEuNVwiPkxhdGl0dWRlPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCIgdHlwZT1cIm51bWJlclwiIHN0ZXA9XCIwLjAwMDFcIiB2YWx1ZT17Y2ZnLmxhdH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKT0+c2V0Q2ZnKHsuLi5jZmcsIGxhdDorZS50YXJnZXQudmFsdWV9KX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMS41XCI+TG9uZ2l0dWRlPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCIgdHlwZT1cIm51bWJlclwiIHN0ZXA9XCIwLjAwMDFcIiB2YWx1ZT17Y2ZnLmxvbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKT0+c2V0Q2ZnKHsuLi5jZmcsIGxvbjorZS50YXJnZXQudmFsdWV9KX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17dXNlTXlMb2NhdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17Z2VvU3RhdGUgPT09ICdidXN5J31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImxvYy11c2UtbXktbG9jYXRpb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHctZnVsbCBweS0yLjUgcm91bmRlZC1sZyBib3JkZXIgdGV4dC14cyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgdHJhbnNpdGlvbi1jb2xvcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtnZW9TdGF0ZSA9PT0gJ2J1c3knXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1hbWJlci05MDAvNDAgYm9yZGVyLWFtYmVyLTcwMC80MCB0ZXh0LWFtYmVyLTIwMCBjdXJzb3Itd2FpdCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogKGdlb1N0YXRlICYmIGdlb1N0YXRlLmVyclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLXJvc2UtOTAwLzQwIGJvcmRlci1yb3NlLTUwMC81MCB0ZXh0LXJvc2UtMTAwIGhvdmVyOmJnLXJvc2UtODAwLzQwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLWFtYmVyLTcwMC83MCBib3JkZXItYW1iZXItNTAwLzQwIHRleHQtYW1iZXItNTAgaG92ZXI6YmctYW1iZXItNjAwLzcwJyl9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7Z2VvU3RhdGUgPT09ICdidXN5J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ+KPsyAgUmVhZGluZyBkZXZpY2UgbG9jYXRpb27igKYnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAn8J+TjSAgVXNlIG15IGRldmljZSBsb2NhdGlvbid9XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICB7Z2VvU3RhdGUgJiYgZ2VvU3RhdGUuZXJyICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJsb2MtZ2VvLWVycm9yXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiLW10LTIgcHgtMyBweS0yIHJvdW5kZWQtbWQgYmctcm9zZS05NTAvNTAgYm9yZGVyIGJvcmRlci1yb3NlLTcwMC80MCB0ZXh0LVsxMXB4XSBsZWFkaW5nLXNudWcgdGV4dC1yb3NlLTIwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxiIGNsYXNzTmFtZT1cInRleHQtcm9zZS0xMDBcIj5Db3VsZG4ndCByZWFkIGxvY2F0aW9uLjwvYj48YnIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtcm9zZS0yMDAvOTBcIj57Z2VvU3RhdGUuZXJyfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogU3BlY2lmaWMgSFRUUC1vcmlnaW4gY2FsbC1vdXQ6IG1vc3QgbGlrZWx5IGNhdXNlIG9uIGEgVjEuOSBjb250cm9sbGVyLiAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmxvY2F0aW9uICYmIHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2h0dHA6JyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtMS41IHRleHQtWzEwcHhdIHRleHQtcm9zZS0zMDAvODAgZm9udC1tb25vXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXA6IGJyb3dzZXJzIHJlcXVpcmUgSFRUUFMgZm9yIGdlb2xvY2F0aW9uLiAgUGljayB0aGUgbG9jYXRpb24gb24gdGhlIG1hcCBvciBzZWFyY2ggYmFyIGluc3RlYWQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvcmRlci10IGJvcmRlci1zbGF0ZS04MDAgcHQtMyBtdC0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj5RdWljayBqdW1wczwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC0xLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7W1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J1Rvcm9udG8sIE9OJywgICBsYXQ6NDMuNjUzMiwgbG9uOi03OS4zODMyLCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonTmV3IFlvcmssIE5ZJywgIGxhdDo0MC43MTI4LCBsb246LTc0LjAwNjAsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidMb25kb24sIFVLJywgICAgbGF0OjUxLjUwNzQsIGxvbjogLTAuMTI3OCwgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J1BhcmlzLCBGUicsICAgICBsYXQ6NDguODU2NiwgbG9uOiAgMi4zNTIyLCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonVG9reW8sIEpQJywgICAgIGxhdDozNS42NzYyLCBsb246MTM5LjY1MDMsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidTeWRuZXksIEFVJywgICAgbGF0Oi0zMy44Njg4LGxvbjoxNTEuMjA5MywgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0ubWFwKGogPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGtleT17ai5uYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBsYXQ6ai5sYXQsIGxvbjpqLmxvbiwgY2l0eTpqLm5hbWV9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXBSZWYuY3VycmVudCkgbWFwUmVmLmN1cnJlbnQuc2V0Vmlldyhbai5sYXQsIGoubG9uXSwgai56KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtbGVmdCBweC0yLjUgcHktMS41IHJvdW5kZWQtbWQgYmctc2xhdGUtODAwLzcwIGJvcmRlciBib3JkZXItc2xhdGUtNzAwIHRleHQtWzExcHhdIGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTMwMCBob3ZlcjpiZy1zbGF0ZS03MDAgaG92ZXI6Ym9yZGVyLWFtYmVyLTUwMC80MCB0cmFuc2l0aW9uLWFsbFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2oubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbGVhZGluZy1yZWxheGVkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICBUaWxlczogT3BlblN0cmVldE1hcCDCtyBHZW9jb2RlOiBOb21pbmF0aW0gKGZyZWUsIH4xIHJlcS9zKS5cbiAgICAgICAgICAgICAgICAgICAgICAgIFVzZWQgZm9yIE9wZW4tTWV0ZW8gd2VhdGhlciBmZWVkIGFuZCBzdW5yaXNlL3N1bnNldCBlc3RpbWF0aW9uLlxuICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Nb2RhbFNoZWxsPlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIExhbmd1YWdlIFNldHRpbmcgLS0gbW9kYWxcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIExhbmd1YWdlTW9kYWwoeyBjZmcsIHNldENmZywgb25DbG9zZSwgb25TYXZlIH0pIHtcbiAgICBjb25zdCBsYW5ncyA9IFtcbiAgICAgICAgeyBjb2RlOidlbicsICAgIGxhYmVsOidFbmdsaXNoJywgICAgICAgICAgICAgICAgbmF0aXZlOidFbmdsaXNoJyAgICB9LFxuICAgICAgICB7IGNvZGU6J3poLUNOJywgbGFiZWw6J0NoaW5lc2UgKFNpbXBsaWZpZWQpJywgICBuYXRpdmU6J+eugOS9k+S4reaWhycgICAgfSxcbiAgICAgICAgeyBjb2RlOid6aC1UVycsIGxhYmVsOidDaGluZXNlIChUcmFkaXRpb25hbCknLCAgbmF0aXZlOifnuYHpq5TkuK3mlocnICAgIH0sXG4gICAgICAgIHsgY29kZTonamEnLCAgICBsYWJlbDonSmFwYW5lc2UnLCAgICAgICAgICAgICAgIG5hdGl2ZTon5pel5pys6KqeJyAgICAgIH0sXG4gICAgICAgIHsgY29kZTona28nLCAgICBsYWJlbDonS29yZWFuJywgICAgICAgICAgICAgICAgIG5hdGl2ZTon7ZWc6rWt7Ja0JyAgICAgIH0sXG4gICAgXTtcblxuICAgIC8qIE9uIFNhdmUgJiByZXR1cm46IHdyaXRlIHRoZSBwaWNrZWQgbGFuZ3VhZ2UgY29kZSB0byB0aGUgc2FtZVxuICAgICAqIGxvY2FsU3RvcmFnZSBrZXkgdGhlIGRhc2hib2FyZCdzIGkxOG4uanMgcmVhZHMgKGBpMThuX2xhbmdgKSwgYW5kXG4gICAgICogZGlzcGF0Y2ggdGhlIGBsYW5nY2hhbmdlYCBldmVudCBzbyBhbnkgb3BlbiBkYXNoYm9hcmQvY29uZmlnIHRhYlxuICAgICAqIHBpY2tzIGl0IHVwIGxpdmUuICBUaGlzIGlzIHdoYXQgbWFrZXMgdGhlIHNldHVwIHdhbGsncyBsYW5ndWFnZVxuICAgICAqIGNob2ljZSBhY3R1YWxseSBkcml2ZSB0aGUgZGFzaGJvYXJkIC8gY29uZmlnIC8gbWFwcGVyIFVJIC0tIHRoZVxuICAgICAqIHNpZGViYXIgc2VsZWN0b3IgdGhhdCB1c2VkIHRvIGxpdmUgaW4gdGhlIGRhc2hib2FyZCBoZWFkZXIgaGFzXG4gICAgICogYmVlbiByZW1vdmVkICgyMDI2LTA2LTI2KSBhbmQgdGhlIHNldHVwIHdhbGsgaXMgbm93IHRoZSBzaW5nbGVcbiAgICAgKiBzb3VyY2Ugb2YgdHJ1dGggZm9yIFVJIGxhbmd1YWdlLiAqL1xuICAgIGNvbnN0IHBlcnNpc3RBbmRTYXZlID0gKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2kxOG5fbGFuZycsIGNmZy5sYW5nKTtcbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnbGFuZ2NoYW5nZScpKTtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnW3NldHVwIHdhbGtdIGkxOG5fbGFuZyA8LScsIGNmZy5sYW5nKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdbc2V0dXAgd2Fsa10gY291bGQgbm90IHBlcnNpc3QgbGFuZ3VhZ2U6JywgZSk7XG4gICAgICAgIH1cbiAgICAgICAgb25TYXZlKCk7XG4gICAgfTtcbiAgICByZXR1cm4gKFxuICAgICAgICA8TW9kYWxTaGVsbCB0aXRsZT1cIkxhbmd1YWdlIFNldHRpbmdcIiBzdWJ0aXRsZT1cIlBpY2sgeW91ciBkZWZhdWx0IGludGVyZmFjZSBsYW5ndWFnZVwiIGFjY2VudD1cImVtZXJhbGRcIiBvbkNsb3NlPXtvbkNsb3NlfSBvblNhdmU9e3BlcnNpc3RBbmRTYXZlfT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtM1wiPlxuICAgICAgICAgICAgICAgIHtsYW5ncy5tYXAobCA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PXtsLmNvZGV9IG9uQ2xpY2s9eygpPT5zZXRDZmcoey4uLmNmZywgbGFuZzpsLmNvZGV9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B0ZXh0LWxlZnQgcC0zIHJvdW5kZWQteGwgYm9yZGVyLTIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjZmcubGFuZyA9PT0gbC5jb2RlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdib3JkZXItZW1lcmFsZC01MDAgYmctZW1lcmFsZC05MDAvMjAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdib3JkZXItc2xhdGUtNzAwIGJnLXNsYXRlLTgwMC80MCBob3ZlcjpiZy1zbGF0ZS04MDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS01MDBcIj57bC5jb2RlfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS0yMDBcIj57bC5uYXRpdmV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzExcHhdIHRleHQtc2xhdGUtNTAwXCI+e2wubGFiZWx9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvTW9kYWxTaGVsbD5cbiAgICApO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBQbHVnLWluIFNldHRpbmcgLS0gbW9kYWwgdy8gbGlzdCArIHVwbG9hZCB6b25lXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4vKiBQZXItcGx1Zy1pbiBtb2NrIGNvbmZpZ3VyYXRpb24gZmllbGRzLiAgS2V5cyBtYXAgdG8gcGx1Zy1pbiBgaWRgLiAqL1xuY29uc3QgUExVR0lOX0NPTkZJR19GSUVMRFMgPSB7XG4gICAgd2VhdGhlcjogICAgW1xuICAgICAgICB7IGtleToncHJvdmlkZXInLCAgbGFiZWw6J1Byb3ZpZGVyJywgICAgICAgICAgdHlwZTonc2VsZWN0JywgIG9wdGlvbnM6WydPcGVuLU1ldGVvJywnTldTJywnRUNNV0YnXSwgZGVmOidPcGVuLU1ldGVvJyB9LFxuICAgICAgICB7IGtleToncmVmcmVzaCcsICAgbGFiZWw6J1JlZnJlc2ggaW50ZXJ2YWwnLCAgdHlwZTonc2VsZWN0JywgIG9wdGlvbnM6WycxIG1pbicsJzUgbWluJywnMTUgbWluJywnMzAgbWluJywnMSBoJ10sIGRlZjonMTUgbWluJyB9LFxuICAgICAgICB7IGtleTonY2FjaGUnLCAgICAgbGFiZWw6J0NhY2hlIFRUTCAobWluKScsICAgdHlwZTonbnVtYmVyJywgIGRlZjozMCB9LFxuICAgIF0sXG4gICAgZ2l2b25pOiAgICAgW1xuICAgICAgICB7IGtleTonY2xpbWF0ZScsICAgbGFiZWw6J0NsaW1hdGUgbW9kZWwnLCAgICAgdHlwZTonc2VsZWN0JywgIG9wdGlvbnM6WydHaXZvbmkgMTk5MicsJ0FTSFJBRSA1NScsJ0FkYXB0aXZlJ10sIGRlZjonR2l2b25pIDE5OTInIH0sXG4gICAgICAgIHsga2V5OidtYXNzaXZlJywgICBsYWJlbDonSGVhdnl3ZWlnaHQgY29uc3RydWN0aW9uJywgIHR5cGU6J3RvZ2dsZScsIGRlZjpmYWxzZSB9LFxuICAgIF0sXG4gICAgc3dlZXRfc3BvdDogW1xuICAgICAgICB7IGtleTondHJhY2tpbmcnLCAgbGFiZWw6J1RyYWNrIG91dGRvb3IgUkgnLCAgdHlwZTondG9nZ2xlJywgZGVmOnRydWUgfSxcbiAgICAgICAgeyBrZXk6J2h5c3QnLCAgICAgIGxhYmVsOidIeXN0ZXJlc2lzICglIFJIKScsIHR5cGU6J251bWJlcicsIGRlZjoyIH0sXG4gICAgXSxcbiAgICBnMzY6ICAgICAgICBbXG4gICAgICAgIHsga2V5Oidtb2RlJywgICAgICBsYWJlbDonU2VxdWVuY2UgbW9kZScsICAgICB0eXBlOidzZWxlY3QnLCAgb3B0aW9uczpbJ1NpbmdsZS16b25lIFZBVicsJ011bHRpLXpvbmUgVkFWJywnRE9BUyB3LyBGQ1UnXSwgZGVmOidNdWx0aS16b25lIFZBVicgfSxcbiAgICAgICAgeyBrZXk6J3ZlcmJvc2UnLCAgIGxhYmVsOidWZXJib3NlIGxvZ2dpbmcnLCAgIHR5cGU6J3RvZ2dsZScsIGRlZjpmYWxzZSB9LFxuICAgIF0sXG4gICAgZGlidDogICAgICAgW1xuICAgICAgICB7IGtleTonaG9zdCcsICAgICAgbGFiZWw6J0JyaWRnZSBob3N0JywgICAgICAgdHlwZTondGV4dCcsICAgZGVmOicxOTIuMTY4LjEuMTAwJyB9LFxuICAgICAgICB7IGtleToncG9ydCcsICAgICAgbGFiZWw6J1RlbGVncmFtIHBvcnQnLCAgICAgdHlwZTonbnVtYmVyJywgZGVmOjQ3ODA4IH0sXG4gICAgICAgIHsga2V5Oidwb2xsX21zJywgICBsYWJlbDonUG9sbCBpbnRlcnZhbCAobXMpJyx0eXBlOidudW1iZXInLCBkZWY6MjAwMCB9LFxuICAgIF0sXG4gICAgbGlnaHRpbmc6ICAgW1xuICAgICAgICB7IGtleTonZ2F0ZXdheScsICAgbGFiZWw6J01vZGJ1cyBnYXRld2F5IElQJywgdHlwZTondGV4dCcsICAgZGVmOicxMC4wLjAuNTAnIH0sXG4gICAgICAgIHsga2V5Oid1bml0X2lkJywgICBsYWJlbDonVW5pdCBJRCcsICAgICAgICAgICB0eXBlOidudW1iZXInLCBkZWY6MSB9LFxuICAgICAgICB7IGtleTondGNwX3BvcnQnLCAgbGFiZWw6J1RDUCBwb3J0JywgICAgICAgICAgdHlwZTonbnVtYmVyJywgZGVmOjUwMiB9LFxuICAgIF0sXG59O1xuXG5mdW5jdGlvbiBQbHVnaW5zTW9kYWwoeyBjZmcsIHNldENmZywgb25DbG9zZSwgb25TYXZlIH0pIHtcbiAgICBjb25zdCBBTEwgPSBbXG4gICAgICAgIHsgaWQ6J3dlYXRoZXInLCAgICAgbmFtZTonV2VhdGhlcicsICAgICAgICAgZGVzYzonT3Blbi1NZXRlbyBPQSBmZWVkJywgICAgICAgICAgdmVyOicyLjEuMCcgfSxcbiAgICAgICAgeyBpZDonZ2l2b25pJywgICAgICBuYW1lOidHaXZvbmkgRW5naW5lJywgICBkZXNjOidDbGltYXRlLXN0cmF0ZWd5IG92ZXJsYXknLCAgICB2ZXI6JzEuMy40JyB9LFxuICAgICAgICB7IGlkOidzd2VldF9zcG90JywgIG5hbWU6J1N3ZWV0LVNwb3QgUkgnLCAgIGRlc2M6J0FkanVzdGFibGUgUkggYmFuZCcsICAgICAgICAgIHZlcjonMS4wLjEnIH0sXG4gICAgICAgIHsgaWQ6J2czNicsICAgICAgICAgbmFtZTonRzM2IFNlcXVlbmNlcycsICAgZGVzYzonQVNIUkFFIEd1aWRlbGluZSAzNicsICAgICAgICAgdmVyOicwLjkuMicgfSxcbiAgICAgICAgeyBpZDonZGlidCcsICAgICAgICBuYW1lOidESUJUIEJyaWRnZScsICAgICBkZXNjOidEZWx0YSBDb250cm9scyAoRElCVCkgQkFDbmV0IGJyaWRnZScsICAgICAgICAgICB2ZXI6JzAuNC4wJyB9LFxuICAgICAgICB7IGlkOidsaWdodGluZycsICAgIG5hbWU6J0xpZ2h0aW5nIChSZWQ1KScsIGRlc2M6J1YzLjAgTW9kYnVzIFRDUCBjbGllbnQnLCAgICAgIHZlcjonMC4xLjAtYmV0YScgfSxcbiAgICBdO1xuICAgIGNvbnN0IHRvZ2dsZSA9IChpZCkgPT4gc2V0Q2ZnKGMgPT4gKHtcbiAgICAgICAgLi4uYyxcbiAgICAgICAgZW5hYmxlZDogYy5lbmFibGVkLmluY2x1ZGVzKGlkKSA/IGMuZW5hYmxlZC5maWx0ZXIoeCA9PiB4ICE9PSBpZCkgOiBbLi4uYy5lbmFibGVkLCBpZF1cbiAgICB9KSk7XG5cbiAgICAvKiBleHBhbnNpb24gc3RhdGUg4oCUIHdoaWNoIHBsdWctaW4ncyBcIkNvbmZpZ3VyZVwiIHBhbmVsIGlzIG9wZW4gKi9cbiAgICBjb25zdCBbZXhwYW5kZWRJZCwgc2V0RXhwYW5kZWRJZF0gPSBSZWFjdC51c2VTdGF0ZShudWxsKTtcblxuICAgIGNvbnN0IHVwZGF0ZUZpZWxkID0gKHBsdWdpbklkLCBmaWVsZEtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgc2V0Q2ZnKGMgPT4gKHtcbiAgICAgICAgICAgIC4uLmMsXG4gICAgICAgICAgICBmaWVsZHM6IHsgLi4uKGMuZmllbGRzIHx8IHt9KSwgW3BsdWdpbklkXTogeyAuLi4oKGMuZmllbGRzIHx8IHt9KVtwbHVnaW5JZF0gfHwge30pLCBbZmllbGRLZXldOiB2YWx1ZSB9IH1cbiAgICAgICAgfSkpO1xuICAgIH07XG5cbiAgICBjb25zdCBmaWVsZFZhbCA9IChwbHVnaW5JZCwgZmllbGQpID0+IHtcbiAgICAgICAgY29uc3Qgc3RvcmVkID0gY2ZnLmZpZWxkcyAmJiBjZmcuZmllbGRzW3BsdWdpbklkXSAmJiBjZmcuZmllbGRzW3BsdWdpbklkXVtmaWVsZC5rZXldO1xuICAgICAgICByZXR1cm4gc3RvcmVkICE9PSB1bmRlZmluZWQgPyBzdG9yZWQgOiBmaWVsZC5kZWY7XG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxNb2RhbFNoZWxsIHRpdGxlPVwiUGx1Zy1pbiBTZXR0aW5nXCIgc3VidGl0bGU9XCJFbmFibGUsIHVwbG9hZCBvciBtb2RpZnkgcGx1Zy1pbnNcIiBhY2NlbnQ9XCJwaW5rXCIgb25DbG9zZT17b25DbG9zZX0gb25TYXZlPXtvblNhdmV9IHNpemU9XCJ3aWRlXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMyBtYXgtaC1bNjB2aF0gb3ZlcmZsb3cteS1hdXRvIHByLTFcIj5cbiAgICAgICAgICAgICAgICB7QUxMLm1hcChwID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb24gPSBjZmcuZW5hYmxlZC5pbmNsdWRlcyhwLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhwYW5kZWQgPSBleHBhbmRlZElkID09PSBwLmlkO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWVsZHMgPSBQTFVHSU5fQ09ORklHX0ZJRUxEU1twLmlkXSB8fCBbXTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtwLmlkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2Byb3VuZGVkLXhsIGJvcmRlciB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke29uID8gJ2JvcmRlci1waW5rLTUwMC80MCBiZy1waW5rLTkwMC8xMCcgOiAnYm9yZGVyLXNsYXRlLTcwMCBiZy1zbGF0ZS04MDAvNDAnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2V4cGFuZGVkID8gJ3JpbmctMSByaW5nLXBpbmstNTAwLzMwJyA6ICcnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHAtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS0xMDBcIj57cC5uYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1sLTIgdGV4dC1bMTBweF0gZm9udC1tb25vIHRleHQtc2xhdGUtNTAwXCI+dntwLnZlcn08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXNsYXRlLTQwMFwiPntwLmRlc2N9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHRvZ2dsZShwLmlkKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BwbHVnaW4tdG9nZ2xlLSR7cC5pZH1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweC0zIHB5LTEgcm91bmRlZC1tZCB0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgYm9yZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke29uID8gJ2JvcmRlci1waW5rLTUwMC82MCB0ZXh0LXBpbmstMzAwIGJnLXBpbmstOTAwLzMwJyA6ICdib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtNDAwIGJnLXNsYXRlLTgwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge29uID8gJ0VuYWJsZWQnIDogJ0Rpc2FibGVkJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBzZXRFeHBhbmRlZElkKGV4cGFuZGVkID8gbnVsbCA6IHAuaWQpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17YHBsdWdpbi1jb25maWctJHtwLmlkfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTMgcHktMSByb3VuZGVkLW1kIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayBib3JkZXIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7ZXhwYW5kZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdib3JkZXItcGluay01MDAgYmctcGluay05MDAvMzAgdGV4dC1waW5rLTIwMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtNDAwIGJnLXNsYXRlLTgwMCBob3ZlcjpiZy1zbGF0ZS03MDAgaG92ZXI6Ym9yZGVyLXBpbmstNTAwLzUwIGhvdmVyOnRleHQtcGluay0zMDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtleHBhbmRlZCA/ICdDbG9zZSDilrQnIDogJ0NvbmZpZ3VyZSDilr4nfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtleHBhbmRlZCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHgtNCBwYi00IGJvcmRlci10IGJvcmRlci1waW5rLTUwMC8yMCBiZy1zbGF0ZS05NTAvNDBcIiBkYXRhLXRlc3RpZD17YHBsdWdpbi1jb25maWctcGFuZWwtJHtwLmlkfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2ZpZWxkcy5sZW5ndGggPT09IDAgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXNsYXRlLTUwMCBpdGFsaWMgcHktM1wiPk5vIGNvbmZpZ3VyYWJsZSBvcHRpb25zIGZvciB0aGlzIHBsdWctaW4geWV0LjwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIG1kOmdyaWQtY29scy0yIGdhcC0zIHB0LTNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2ZpZWxkcy5tYXAoZiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2ID0gZmllbGRWYWwocC5pZCwgZik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtmLmtleX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTUwMCBibG9jayBtYi0xXCI+e2YubGFiZWx9PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2YudHlwZSA9PT0gJ3NlbGVjdCcgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dCBjdXJzb3ItcG9pbnRlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt2fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZUZpZWxkKHAuaWQsIGYua2V5LCBlLnRhcmdldC52YWx1ZSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmLm9wdGlvbnMubWFwKG8gPT4gPG9wdGlvbiBrZXk9e299IHZhbHVlPXtvfT57b308L29wdGlvbj4pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmLnR5cGUgPT09ICdudW1iZXInICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt2fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlRmllbGQocC5pZCwgZi5rZXksICtlLnRhcmdldC52YWx1ZSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2YudHlwZSA9PT0gJ3RleHQnICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZUZpZWxkKHAuaWQsIGYua2V5LCBlLnRhcmdldC52YWx1ZSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2YudHlwZSA9PT0gJ3RvZ2dsZScgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB1cGRhdGVGaWVsZChwLmlkLCBmLmtleSwgIXYpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B3LWZ1bGwgcHktMiByb3VuZGVkLWxnIHRleHQteHMgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGJvcmRlciB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHt2XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctcGluay03MDAvNDAgYm9yZGVyLXBpbmstNTAwLzYwIHRleHQtcGluay0yMDAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctc2xhdGUtODAwIGJvcmRlci1zbGF0ZS02MDAgdGV4dC1zbGF0ZS00MDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt2ID8gJ09OJyA6ICdPRkYnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktZW5kIGdhcC0yIG10LTQgcHQtMyBib3JkZXItdCBib3JkZXItc2xhdGUtODAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVzZXQgdGhpcyBwbHVnLWluJ3MgZmllbGRzIHRvIGRlZmF1bHRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q2ZnKGMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXh0ID0geyAuLi4oYy5maWVsZHMgfHwge30pIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBuZXh0W3AuaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyAuLi5jLCBmaWVsZHM6IG5leHQgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC0zIHB5LTEuNSByb3VuZGVkLW1kIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayBib3JkZXIgYm9yZGVyLXNsYXRlLTYwMCB0ZXh0LXNsYXRlLTQwMCBob3ZlcjpiZy1zbGF0ZS04MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVzZXQgZGVmYXVsdHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHNldEV4cGFuZGVkSWQobnVsbCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC0zIHB5LTEuNSByb3VuZGVkLW1kIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayBiZy1waW5rLTYwMCBob3ZlcjpiZy1waW5rLTUwMCB0ZXh0LXdoaXRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERvbmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC01IHAtNCBib3JkZXItMiBib3JkZXItZGFzaGVkIGJvcmRlci1zbGF0ZS03MDAgcm91bmRlZC14bCB0ZXh0LWNlbnRlciBob3Zlcjpib3JkZXItcGluay01MDAvNDAgdHJhbnNpdGlvbi1hbGwgY3Vyc29yLXBvaW50ZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtM3hsIG1iLTFcIj7ipLQ8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1ibGFjayB0ZXh0LXNsYXRlLTMwMFwiPkRyb3AgYSAucHkgLyAuemlwIC8gLnJlZDUgcGx1Zy1pbiBoZXJlPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMXB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0xXCI+b3IgY2xpY2sgdG8gY2hvb3NlIGEgZmlsZSAobW9jayDigJQgbm90IHdpcmVkKTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvTW9kYWxTaGVsbD5cbiAgICApO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBNb2RhbCBTaGVsbCAtLSBzaGFyZWRcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIE1vZGFsU2hlbGwoeyB0aXRsZSwgc3VidGl0bGUsIGFjY2VudD0naW5kaWdvJywgb25DbG9zZSwgb25TYXZlLCBzaXplPScnLCBjaGlsZHJlbiB9KSB7XG4gICAgY29uc3QgY29sb3JNYXAgPSB7XG4gICAgICAgIGluZGlnbzonIzgxOGNmOCcsIGFtYmVyOicjZmJiZjI0JywgZW1lcmFsZDonIzM0ZDM5OScsIHBpbms6JyNmNDcyYjYnXG4gICAgfTtcbiAgICBjb25zdCBjID0gY29sb3JNYXBbYWNjZW50XSB8fCAnIzgxOGNmOCc7XG4gICAgY29uc3Qgc2l6ZU1hcCA9IHtcbiAgICAgICAgd2lkZTogJ21heC13LTJ4bCcsXG4gICAgICAgIG1hcDogICdtYXgtdy0zeGwnLFxuICAgICAgICBtYXg6ICAnbWF4LXctWzk2dnddIHctWzk2dnddIGgtWzkydmhdJyxcbiAgICB9O1xuICAgIGNvbnN0IHdpZHRoID0gc2l6ZU1hcFtzaXplXSB8fCAnbWF4LXctbWQnO1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZml4ZWQgaW5zZXQtMCB6LTUwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIG1vZGFsLWJhY2tkcm9wXCIgb25DbGljaz17b25DbG9zZX0+XG4gICAgICAgICAgICB7LyogRmxleC1jb2x1bW4gc2hlbGw6IGhlYWRlciAoZml4ZWQpICsgc2Nyb2xsYWJsZSBjb250ZW50ICsgc3RpY2t5IGZvb3Rlci5cbiAgICAgICAgICAgICAgICBDcml0aWNhbCBmb3Igc2l6ZT1cIm1heFwiIHdoZXJlIGNoaWxkcmVuIGFsb25lIGV4Y2VlZCB0aGUgbW9kYWwgaGVpZ2h0XG4gICAgICAgICAgICAgICAgYW5kIHdvdWxkIG90aGVyd2lzZSBwdXNoIHRoZSBTYXZlICYgcmV0dXJuIGJ1dHRvbiBiZWxvdyB0aGUgdmlld3BvcnQuICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BiZy1zbGF0ZS05MDAgYm9yZGVyLTIgcm91bmRlZC0yeGwgdy1mdWxsICR7d2lkdGh9IG14LTQgZmFkZS11cCBmbGV4IGZsZXgtY29sYH1cbiAgICAgICAgICAgICAgICAgb25DbGljaz17KGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCl9XG4gICAgICAgICAgICAgICAgIHN0eWxlPXt7Ym9yZGVyQ29sb3I6YCR7Y302NmAsIG1heEhlaWdodDogJzkydmgnfX0+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLXN0YXJ0IGp1c3RpZnktYmV0d2VlbiBwLTYgcGItNCBib3JkZXItYiBib3JkZXItc2xhdGUtODAwLzYwIHNocmluay0wXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1sZyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3RcIiBzdHlsZT17e2NvbG9yOmN9fT57dGl0bGV9PC9oMz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS01MDAgbXQtMVwiPntzdWJ0aXRsZX08L3A+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwibW9kYWwtY2xvc2VcIiBvbkNsaWNrPXtvbkNsb3NlfSBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCBob3Zlcjp0ZXh0LXdoaXRlIHRleHQtMnhsIGxlYWRpbmctbm9uZVwiPsOXPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTEgbWluLWgtMCBvdmVyZmxvdy15LWF1dG8gcHgtNiBweS01XCI+XG4gICAgICAgICAgICAgICAgICAgIHtjaGlsZHJlbn1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktZW5kIGdhcC0zIHB4LTYgcHktNCBib3JkZXItdCBib3JkZXItc2xhdGUtODAwIHNocmluay0wIGJnLXNsYXRlLTkwMCByb3VuZGVkLWItMnhsXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJtb2RhbC1jYW5jZWxcIiBvbkNsaWNrPXtvbkNsb3NlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTQgcHktMiByb3VuZGVkLWxnIGJnLXNsYXRlLTgwMCBib3JkZXIgYm9yZGVyLXNsYXRlLTcwMCB0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayB0ZXh0LXNsYXRlLTQwMCBob3ZlcjpiZy1zbGF0ZS03MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIENhbmNlbFxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cIm1vZGFsLXNhdmVcIiBvbkNsaWNrPXtvblNhdmV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtNSBweS0yIHJvdW5kZWQtbGcgdGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgdGV4dC13aGl0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOmMsIGJveFNoYWRvdzpgMCAwIDEycHggJHtjfTU1YH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgU2F2ZSAmIHJldHVybiDinJNcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuLyogbW91bnQgKi9cblJlYWN0RE9NLmNyZWF0ZVJvb3QoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKSkucmVuZGVyKDxBcHAvPik7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBQSxNQUFBLEdBQThCQyxLQUFLO0VBQTNCQyxRQUFRLEdBQUFGLE1BQUEsQ0FBUkUsUUFBUTtFQUFFQyxPQUFPLEdBQUFILE1BQUEsQ0FBUEcsT0FBTzs7QUFFekI7QUFDQTtBQUNBO0FBQ0EsSUFBTUMsS0FBSyxHQUFHO0FBQ1Y7QUFDSjtBQUNBO0FBQ0E7QUFDSTtFQUFFQyxHQUFHLEVBQUMsS0FBSztFQUFPQyxLQUFLLEVBQUMsV0FBVztFQUFRQyxHQUFHLEVBQUMsMEJBQTBCO0VBQVFDLElBQUksRUFBQyxNQUFNO0VBQUdDLFNBQVMsRUFBQyxTQUFTO0VB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