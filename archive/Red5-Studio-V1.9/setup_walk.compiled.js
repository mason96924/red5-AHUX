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
  href: '/update.html?from=setup'
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
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none overflow-hidden rounded-full",
    "aria-hidden": "true",
    style: {
      width: '78%',
      aspectRatio: '1/1'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "/api/assets/img/psy_silhouette.jpg",
    alt: "",
    className: "absolute inset-0 w-full h-full object-cover",
    style: {
      opacity: 0.78
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0",
    style: {
      background: 'radial-gradient(circle at center, rgba(2,6,23,0.60) 0%, rgba(2,6,23,0.35) 55%, rgba(2,6,23,0.10) 100%)'
    }
  })), STEPS.map((s, i) => {
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
        if (s.kind === 'page') setRoute(s.key);else if (s.kind === 'link') {
          /* Same-tab nav so the return badge on
             update.html can simply window.location
             back here when the operator is done. */
          window.location.href = s.href;
        } else setModal(s.key);
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
    className: "text-[22px] sm:text-[26px] font-black uppercase tracking-tight whitespace-nowrap leading-none\n                                     ".concat(completeCount === 5 ? 'text-emerald-400' : 'text-white'),
    style: {
      textShadow: '0 2px 12px rgba(2,6,23,0.85), 0 0 4px rgba(2,6,23,0.85)'
    }
  }, completeCount, "/5"), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 mt-2",
    style: {
      textShadow: '0 1px 6px rgba(2,6,23,0.85)'
    }
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
    className: "circle-tile group absolute rounded-full text-center\n                            flex flex-col items-center justify-center\n                            transition-all duration-200\n                            ".concat(done ? 'bg-slate-900 shadow-[0_0_30px_-6px_rgba(16,185,129,0.55)]' : 'bg-slate-900 hover:bg-slate-800'),
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
 * localStorage).  Dedup key is `lat.toFixed(4),lon.toFixed(4)` -- the
 * SAME key the dashboard's weather-settings-modal.js uses -- so the
 * Setup Walk dropdown shows the exact same set the operator sees in
 * the dashboard's 3D-Wx Weather button.  Two entries that share a name
 * (e.g. "HOME" at the office and "HOME" at the apartment) but have
 * different coordinates are BOTH kept; only true coord duplicates are
 * collapsed.  Drops entries missing a name or with non-finite lat/lon. */
function _normalizeLocs(arr) {
  var seen = new Set();
  var out = [];
  for (var l of arr || []) {
    if (!l || typeof l.name !== 'string') continue;
    var lat = +l.lat,
      lon = +l.lon;
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    var name = l.name.trim();
    if (!name) continue;
    var key = lat.toFixed(4) + ',' + lon.toFixed(4);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      name,
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
  }, savedLocs.length > 0 ? 'Pick a previously-saved location, or type a new label for this place.' : 'Your label for this place — shown on the dashboard header.'), (() => {
    var typed = (cfg.siteName || '').trim();
    if (!typed) return null;
    var round = n => (Math.round(n * 10000) / 10000).toFixed(4);
    var cur = round(cfg.lat) + ',' + round(cfg.lon);
    var conflict = savedLocs.find(s => s.name === typed && round(s.lat) + ',' + round(s.lon) !== cur);
    if (!conflict) return null;
    return /*#__PURE__*/React.createElement("div", {
      "data-testid": "loc-dup-name-warn",
      className: "mt-2 px-2.5 py-2 rounded-md bg-amber-950/40 border border-amber-700/50 text-[10.5px] text-amber-200 leading-snug"
    }, /*#__PURE__*/React.createElement("b", {
      className: "text-amber-100"
    }, "Same name already saved"), " at", /*#__PURE__*/React.createElement("code", {
      className: "mx-1 font-mono text-amber-100"
    }, conflict.lat.toFixed(2), ", ", conflict.lon.toFixed(2)), ". Saving keeps both; pick from the dropdown above to switch to the existing one instead.");
  })()), /*#__PURE__*/React.createElement("div", {
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBfd2Fsay5jb21waWxlZC5qcyIsIm5hbWVzIjpbIl9SZWFjdCIsIlJlYWN0IiwidXNlU3RhdGUiLCJ1c2VNZW1vIiwiU1RFUFMiLCJrZXkiLCJsYWJlbCIsInN1YiIsImtpbmQiLCJpY29uQ29sb3IiLCJhY2NlbnQiLCJocmVmIiwiQXBwIiwiX3VzZVN0YXRlIiwicHN5IiwibG9jYXRpb24iLCJsYW5ndWFnZSIsInBsdWdpbnMiLCJyZXBhaXIiLCJfdXNlU3RhdGUyIiwiX3NsaWNlZFRvQXJyYXkiLCJkb25lIiwic2V0RG9uZSIsIl91c2VTdGF0ZTMiLCJfdXNlU3RhdGU0Iiwicm91dGUiLCJzZXRSb3V0ZSIsIl91c2VTdGF0ZTUiLCJfdXNlU3RhdGU2IiwibW9kYWwiLCJzZXRNb2RhbCIsIl91c2VTdGF0ZTciLCJnaXZvbmkiLCJyaFByZXNldCIsInJoTG8iLCJyaEhpIiwidExvIiwidEhpIiwidGhlbWUiLCJkYXJrTGV2ZWwiLCJfdXNlU3RhdGU4IiwicHN5Q2ZnIiwic2V0UHN5Q2ZnIiwiX3VzZVN0YXRlOSIsInNpdGVOYW1lIiwiY2l0eSIsImxhdCIsImxvbiIsIl91c2VTdGF0ZTAiLCJsb2NDZmciLCJzZXRMb2NDZmciLCJfdXNlU3RhdGUxIiwidiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJhbGxvd2VkIiwiaW5kZXhPZiIsImxhbmciLCJlIiwiX3VzZVN0YXRlMTAiLCJsYW5nQ2ZnIiwic2V0TGFuZ0NmZyIsIl91c2VTdGF0ZTExIiwiZW5hYmxlZCIsIl91c2VTdGF0ZTEyIiwicGx1Z2luQ2ZnIiwic2V0UGx1Z2luQ2ZnIiwiY29tcGxldGVDb3VudCIsIk9iamVjdCIsInZhbHVlcyIsImZpbHRlciIsIkJvb2xlYW4iLCJsZW5ndGgiLCJmaW5pc2giLCJkIiwiX29iamVjdFNwcmVhZCIsImNyZWF0ZUVsZW1lbnQiLCJQc3lDaGFydFNldHRpbmdQYWdlIiwiY2ZnIiwic2V0Q2ZnIiwib25CYWNrIiwib25TYXZlIiwiY2xhc3NOYW1lIiwib25DbGljayIsInNldEl0ZW0iLCJzdHlsZSIsIndpZHRoIiwiYXNwZWN0UmF0aW8iLCJhbmltYXRpb25EZWxheSIsInNyYyIsImFsdCIsIm9wYWNpdHkiLCJiYWNrZ3JvdW5kIiwibWFwIiwicyIsImkiLCJhbmdsZURlZyIsImFuZ2xlIiwiTWF0aCIsIlBJIiwiciIsIngiLCJjb3MiLCJ5Iiwic2luIiwiQ2lyY2xlVGlsZSIsInN0ZXAiLCJpbmRleCIsImxlZnRQY3QiLCJ0b3BQY3QiLCJ3aW5kb3ciLCJ2aWV3Qm94IiwicHJlc2VydmVBc3BlY3RSYXRpbyIsImlkIiwibWFza1VuaXRzIiwiaGVpZ2h0IiwiZmlsbCIsIl8iLCJhIiwiY3giLCJjeSIsInN0cm9rZSIsInN0cm9rZVdpZHRoIiwibWFzayIsImNvbmNhdCIsInRleHRTaGFkb3ciLCJMb2NhdGlvbk1vZGFsIiwib25DbG9zZSIsIkxhbmd1YWdlTW9kYWwiLCJQbHVnaW5zTW9kYWwiLCJUaWxlIiwiX3JlZiIsImJvcmRlciIsIlRpbGVJY29uIiwiY29sb3IiLCJfcmVmMiIsInJpbmdDb2xvciIsImxlZnQiLCJ0b3AiLCJ0cmFuc2Zvcm0iLCJib3hTaGFkb3ciLCJfcmVmMyIsInN0cm9rZUxpbmVjYXAiLCJzdHJva2VMaW5lam9pbiIsIl9leHRlbmRzIiwiX3JlZjQiLCJ1cGRhdGUiLCJrIiwiYyIsInVzZUVmZmVjdCIsInJhdyIsInByZXNldCIsInBhdGNoIiwicCIsIkpTT04iLCJwYXJzZSIsIk51bWJlciIsImlzRmluaXRlIiwibG8iLCJoaSIsIlJIX1BSRVNFVFMiLCJmaW5kIiwidGgiLCJkbCIsInBhcnNlRmxvYXQiLCJ0clJhdyIsInRyIiwibWluIiwibWF4Iiwia2V5cyIsInBlcnNpc3RBbmRTYXZlIiwic3RyaW5naWZ5IiwiU3RyaW5nIiwiZGlzcGF0Y2hFdmVudCIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwiY29uc29sZSIsImluZm8iLCJ3YXJuIiwiUHN5U2tlbGV0b24iLCJQc3lDb250cm9sUGFuZWwiLCJub3RlIiwiX3JlZjUiLCJXIiwiSCIsInBhZCIsInJpZ2h0IiwiYm90dG9tIiwiZ3JpZFciLCJncmlkSCIsIlRfTUlOIiwiVF9NQVgiLCJXX01JTiIsIldfTUFYIiwidCIsInciLCJfZ2V0VyIsImdldFciLCJyaCIsInNhZmVQdHMiLCJhcnIiLCJ0b0ZpeGVkIiwiam9pbiIsInJoODAiLCJwdXNoIiwicmgxMDAiLCJyaDIwTGluZSIsInJoMjBfQ1oiLCJDWiIsInJoSGlfdG9wIiwidHQiLCJyaExvX2JvdCIsIlNXRUVUIiwiTlYiLCJNYXNzIiwiTUNWIiwiRVZBUCIsIndpbnRlclJIODAiLCJ3aW50ZXJSSDIwIiwiV0lOVEVSIiwiaXNvcGxldGhzIiwiaXNMaWdodCIsInBhbGV0dGUiLCJiZyIsImdyaWQiLCJ0aWNrIiwiYXhpcyIsInBhbmVsQmciLCJwYW5lbEJvcmRlciIsInBpbGxCZyIsInBpbGxGZyIsIm1ldGFGZyIsImRpbUZpbHRlciIsImJvcmRlckNvbG9yIiwiYm9yZGVyUmFkaXVzIiwiQXJyYXkiLCJmcm9tIiwieDEiLCJ5MSIsIngyIiwieTIiLCJmb250U2l6ZSIsInRleHRBbmNob3IiLCJwdHMiLCJ3dyIsInBvaW50cyIsInN0cm9rZURhc2hhcnJheSIsImZsb29yIiwiZm9udFdlaWdodCIsImZpbGxPcGFjaXR5IiwiY2xpcFBhdGhVbml0cyIsImNsaXBQYXRoIiwibGV0dGVyU3BhY2luZyIsInBhaW50T3JkZXIiLCJfcmVmNiIsInJvdW5kIiwidHlwZSIsInZhbHVlIiwib25DaGFuZ2UiLCJ0YXJnZXQiLCJhY2NlbnRDb2xvciIsIl9ub3JtYWxpemVMb2NzIiwic2VlbiIsIlNldCIsIm91dCIsImwiLCJuYW1lIiwidHJpbSIsImhhcyIsImFkZCIsIl9yZWY3IiwibWFwQm94UmVmIiwidXNlUmVmIiwibWFwUmVmIiwibWFya2VyUmVmIiwiX1JlYWN0JHVzZVN0YXRlIiwiX1JlYWN0JHVzZVN0YXRlMiIsImdlb0J1c3kiLCJzZXRHZW9CdXN5IiwiX1JlYWN0JHVzZVN0YXRlMyIsImlzQXJyYXkiLCJfUmVhY3QkdXNlU3RhdGU0Iiwic2F2ZWRMb2NzIiwic2V0U2F2ZWRMb2NzIiwiY2FuY2VsbGVkIiwiX2FzeW5jVG9HZW5lcmF0b3IiLCJmZXRjaCIsImNyZWRlbnRpYWxzIiwiY2FjaGUiLCJvayIsImoiLCJqc29uIiwic2F2ZWQiLCJfUmVhY3QkdXNlU3RhdGU1IiwiX1JlYWN0JHVzZVN0YXRlNiIsInNhdmVkT3BlbiIsInNldFNhdmVkT3BlbiIsInNhdmVkUmVmIiwib25Eb2NDbGljayIsImN1cnJlbnQiLCJjb250YWlucyIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJvblNpdGVOYW1lQ2hhbmdlIiwibmV3TmFtZSIsImhpdCIsInNldFZpZXciLCJwaWNrU2F2ZWRMb2MiLCJsb2MiLCJfUmVhY3QkdXNlU3RhdGU3IiwiX1JlYWN0JHVzZVN0YXRlOCIsInNlYXJjaFEiLCJzZXRTZWFyY2hRIiwiX1JlYWN0JHVzZVN0YXRlOSIsIl9SZWFjdCR1c2VTdGF0ZTAiLCJzZWFyY2hIaXRzIiwic2V0U2VhcmNoSGl0cyIsIl9SZWFjdCR1c2VTdGF0ZTEiLCJfUmVhY3QkdXNlU3RhdGUxMCIsInNlYXJjaEJ1c3kiLCJzZXRTZWFyY2hCdXN5IiwiX1JlYWN0JHVzZVN0YXRlMTEiLCJfUmVhY3QkdXNlU3RhdGUxMiIsInNlYXJjaE9wZW4iLCJzZXRTZWFyY2hPcGVuIiwic2VhcmNoRGVib3VuY2VSZWYiLCJydW5TZWFyY2giLCJfcmVmOSIsInEiLCJ1cmwiLCJlbmNvZGVVUklDb21wb25lbnQiLCJoZWFkZXJzIiwiX3giLCJhcHBseSIsImFyZ3VtZW50cyIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJwaWNrU2VhcmNoSGl0IiwiZGlzcGxheV9uYW1lIiwicmV2ZXJzZUdlb2NvZGUiLCJfcmVmMCIsImFkZHJlc3MiLCJ0b3duIiwidmlsbGFnZSIsImhhbWxldCIsImNvdW50eSIsInJlZ2lvbiIsInN0YXRlIiwiY291bnRyeSIsIl94MiIsIl94MyIsIkwiLCJ6b29tQ29udHJvbCIsImF0dHJpYnV0aW9uQ29udHJvbCIsInRpbGVMYXllciIsIm1heFpvb20iLCJhdHRyaWJ1dGlvbiIsImFkZFRvIiwibWFya2VyIiwiZHJhZ2dhYmxlIiwiYmluZFRvb2x0aXAiLCJwZXJtYW5lbnQiLCJhcHBseUxhdExvbiIsIm4iLCJvbiIsImxsIiwiZ2V0TGF0TG5nIiwibG5nIiwic2V0TGF0TG5nIiwibGF0bG5nIiwiaW52YWxpZGF0ZVNpemUiLCJyZW1vdmUiLCJwYW5UbyIsIl9SZWFjdCR1c2VTdGF0ZTEzIiwiX1JlYWN0JHVzZVN0YXRlMTQiLCJnZW9TdGF0ZSIsInNldEdlb1N0YXRlIiwidXNlTXlMb2NhdGlvbiIsIm5hdmlnYXRvciIsImdlb2xvY2F0aW9uIiwiZXJyIiwiZ2V0Q3VycmVudFBvc2l0aW9uIiwicG9zIiwiY29vcmRzIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJtc2ciLCJjb2RlIiwibWVzc2FnZSIsImVuYWJsZUhpZ2hBY2N1cmFjeSIsInRpbWVvdXQiLCJtYXhpbXVtQWdlIiwiX1JlYWN0JHVzZVN0YXRlMTUiLCJfUmVhY3QkdXNlU3RhdGUxNiIsInNhdmVNc2ciLCJzZXRTYXZlTXNnIiwiX3JlZjEiLCJkZWR1cGVkIiwibmV4dFNhdmVkIiwic2xpY2UiLCJwZXJzaXN0ZWQiLCJ3YXJuaW5nIiwibWV0aG9kIiwiYm9keSIsImFjdGl2ZSIsImRlZmF1bHQiLCJfbGFzdFdlYXRoZXJMb2NhdGlvblNhdmUiLCJNb2RhbFNoZWxsIiwidGl0bGUiLCJzdWJ0aXRsZSIsInNpemUiLCJtaW5IZWlnaHQiLCJyZWYiLCJvdmVyZmxvdyIsIm9uRm9jdXMiLCJwbGFjZWhvbGRlciIsIm91dGxpbmUiLCJoIiwicGxhY2VfaWQiLCJjbGFzcyIsInRyYW5zaXRpb24iLCJpc0FjdGl2ZSIsInR5cGVkIiwiY3VyIiwiY29uZmxpY3QiLCJkaXNhYmxlZCIsInByb3RvY29sIiwieiIsIl9yZWYxMCIsImxhbmdzIiwibmF0aXZlIiwiRXZlbnQiLCJQTFVHSU5fQ09ORklHX0ZJRUxEUyIsIndlYXRoZXIiLCJvcHRpb25zIiwiZGVmIiwic3dlZXRfc3BvdCIsImczNiIsImRpYnQiLCJsaWdodGluZyIsIl9yZWYxMSIsIkFMTCIsImRlc2MiLCJ2ZXIiLCJ0b2dnbGUiLCJpbmNsdWRlcyIsIl9SZWFjdCR1c2VTdGF0ZTE3IiwiX1JlYWN0JHVzZVN0YXRlMTgiLCJleHBhbmRlZElkIiwic2V0RXhwYW5kZWRJZCIsInVwZGF0ZUZpZWxkIiwicGx1Z2luSWQiLCJmaWVsZEtleSIsImZpZWxkcyIsImZpZWxkVmFsIiwiZmllbGQiLCJzdG9yZWQiLCJ1bmRlZmluZWQiLCJleHBhbmRlZCIsImYiLCJvIiwibmV4dCIsIl9yZWYxMiIsIl9yZWYxMiRhY2NlbnQiLCJfcmVmMTIkc2l6ZSIsImNoaWxkcmVuIiwiY29sb3JNYXAiLCJpbmRpZ28iLCJhbWJlciIsImVtZXJhbGQiLCJwaW5rIiwic2l6ZU1hcCIsIndpZGUiLCJzdG9wUHJvcGFnYXRpb24iLCJtYXhIZWlnaHQiLCJSZWFjdERPTSIsImNyZWF0ZVJvb3QiLCJnZXRFbGVtZW50QnlJZCIsInJlbmRlciJdLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXR1cC13YWxrL3NldHVwX3dhbGsuanN4Il0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHsgdXNlU3RhdGUsIHVzZU1lbW8gfSA9IFJlYWN0O1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBTVEVQIERFRklOSVRJT05TIOKAlCB0aGUgNCB3YWxrIHBhdGhzIHRoZSB1c2VyIGRlc2NyaWJlZFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuY29uc3QgU1RFUFMgPSBbXG4gICAgLyogV2FsayBvcmRlciBpcyB0aGUgcGVudGFnb24gdHJhdmVyc2FsOiB0b3Ag4oaSIHVwcGVyLXJpZ2h0IOKGkiBsb3dlci1yaWdodCDihpIgbG93ZXItbGVmdCDihpIgdXBwZXItbGVmdC5cbiAgICAgICBMYWJlbHMgaW50ZW50aW9uYWxseSBkcm9wIHRoZSByZWR1bmRhbnQgXCJTZXR0aW5nXCIgc3VmZml4IHNvIHRoZVxuICAgICAgIG1haW4gaGVhZGluZyBpbnNpZGUgZWFjaCBjaXJjbGUgY2FuIHJlbmRlciBpbiBvbmUgbGluZSBhdCBhIGxhcmdlclxuICAgICAgIGZvbnQgd2VpZ2h0LiAqL1xuICAgIHsga2V5Oidwc3knLCAgICAgIGxhYmVsOidQc3kgQ2hhcnQnLCAgICAgICBzdWI6J0dpdm9uaSDCtyBSSCByYW5nZSDCtyBheGlzJywgICAgICAga2luZDoncGFnZScsICBpY29uQ29sb3I6JyM4MThjZjgnLCBhY2NlbnQ6J2luZGlnbycgfSxcbiAgICB7IGtleTonbG9jYXRpb24nLCBsYWJlbDonTG9jYXRpb24nLCAgICAgICAgc3ViOidDaXR5IMK3IGxhdCAvIGxvbmcnLCAgICAgICAgICAgICAga2luZDonbW9kYWwnLCBpY29uQ29sb3I6JyNmYmJmMjQnLCBhY2NlbnQ6J2FtYmVyJyAgfSxcbiAgICB7IGtleTonbGFuZ3VhZ2UnLCBsYWJlbDonTGFuZ3VhZ2UnLCAgICAgICAgc3ViOidFTiDCtyBDUyDCtyBDVCDCtyBKUCDCtyBLTyDCtyDigKYnLCAgICAga2luZDonbW9kYWwnLCBpY29uQ29sb3I6JyMzNGQzOTknLCBhY2NlbnQ6J2VtZXJhbGQnfSxcbiAgICB7IGtleToncGx1Z2lucycsICBsYWJlbDonUGx1Zy1pbicsICAgICAgICAgc3ViOidMaXN0IMK3IHVwbG9hZCDCtyBtb2RpZnknLCAgICAgICAgIGtpbmQ6J21vZGFsJywgaWNvbkNvbG9yOicjZjQ3MmI2JywgYWNjZW50OidwaW5rJyAgIH0sXG4gICAgeyBrZXk6J3JlcGFpcicsICAgbGFiZWw6J1VwZGF0ZSAmIFJlcGFpcicsIHN1YjonUGx1Zy1pbiBmbGFzaCDCtyBjb250cm9sbGVyIE9UQScsIGtpbmQ6J2xpbmsnLCBpY29uQ29sb3I6JyNmYjcxODUnLCBhY2NlbnQ6J3Jvc2UnLCBocmVmOicvdXBkYXRlLmh0bWw/ZnJvbT1zZXR1cCcgfSxcbl07XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFJPT1QgQVBQXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5mdW5jdGlvbiBBcHAoKSB7XG4gICAgLyogY29tcGxldGlvbiArIHBlci1zdGVwIGNvbmZpZyAtLSBtb2NrdXAgc3RhdGUsIG5ldmVyIHBlcnNpc3RlZCAqL1xuICAgIGNvbnN0IFtkb25lLCBzZXREb25lXSA9IHVzZVN0YXRlKHsgcHN5OmZhbHNlLCBsb2NhdGlvbjpmYWxzZSwgbGFuZ3VhZ2U6ZmFsc2UsIHBsdWdpbnM6ZmFsc2UsIHJlcGFpcjpmYWxzZSB9KTtcbiAgICBjb25zdCBbcm91dGUsIHNldFJvdXRlXSA9IHVzZVN0YXRlKCdodWInKTsgICAvLyAnaHViJyB8ICdwc3knXG4gICAgY29uc3QgW21vZGFsLCBzZXRNb2RhbF0gPSB1c2VTdGF0ZShudWxsKTsgICAgIC8vICdsb2NhdGlvbicgfCAnbGFuZ3VhZ2UnIHwgJ3BsdWdpbnMnIHwgbnVsbFxuXG4gICAgY29uc3QgW3BzeUNmZywgc2V0UHN5Q2ZnXSAgICAgICAgID0gdXNlU3RhdGUoeyBnaXZvbmk6dHJ1ZSwgcmhQcmVzZXQ6J29mZmljZScsIHJoTG86MzAsIHJoSGk6NjAsIHRMbzotMTUsIHRIaTo1MCwgdGhlbWU6J2RhcmsnLCBkYXJrTGV2ZWw6Mi4wIH0pO1xuICAgIGNvbnN0IFtsb2NDZmcsIHNldExvY0NmZ10gICAgICAgICA9IHVzZVN0YXRlKHsgc2l0ZU5hbWU6J015IEJ1aWxkaW5nJywgY2l0eTonVG9yb250bywgT04nLCBsYXQ6NDMuNjUzMiwgbG9uOi03OS4zODMyIH0pO1xuICAgIGNvbnN0IFtsYW5nQ2ZnLCBzZXRMYW5nQ2ZnXSAgICAgICA9IHVzZVN0YXRlKCgpID0+IHtcbiAgICAgICAgLyogTGF6eSBpbml0IGZyb20gdGhlIHNhbWUgbG9jYWxTdG9yYWdlIGtleSB0aGUgZGFzaGJvYXJkIHJlYWRzLCBzb1xuICAgICAgICAgKiByZW9wZW5pbmcgdGhlIHNldHVwIHdhbGsgc2hvd3MgdGhlIGN1cnJlbnRseS1hY3RpdmUgbGFuZ3VhZ2VcbiAgICAgICAgICogcmF0aGVyIHRoYW4gYWx3YXlzIGRlZmF1bHRpbmcgdG8gRW5nbGlzaC4gKi9cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHYgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnaTE4bl9sYW5nJyk7XG4gICAgICAgICAgICBjb25zdCBhbGxvd2VkID0gWydlbicsJ3poLUNOJywnemgtVFcnLCdqYScsJ2tvJ107XG4gICAgICAgICAgICBpZiAodiAmJiBhbGxvd2VkLmluZGV4T2YodikgIT09IC0xKSByZXR1cm4geyBsYW5nOiB2IH07XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogcHJpdmF0ZSBtb2RlIC0+IGZhbGwgdGhyb3VnaCAqLyB9XG4gICAgICAgIHJldHVybiB7IGxhbmc6J2VuJyB9O1xuICAgIH0pO1xuICAgIGNvbnN0IFtwbHVnaW5DZmcsIHNldFBsdWdpbkNmZ10gICA9IHVzZVN0YXRlKHsgZW5hYmxlZDpbJ3dlYXRoZXInLCdnaXZvbmknLCdzd2VldF9zcG90J10gfSk7XG5cbiAgICBjb25zdCBjb21wbGV0ZUNvdW50ID0gT2JqZWN0LnZhbHVlcyhkb25lKS5maWx0ZXIoQm9vbGVhbikubGVuZ3RoO1xuXG4gICAgY29uc3QgZmluaXNoID0gKGtleSkgPT4ge1xuICAgICAgICBzZXREb25lKGQgPT4gKHsuLi5kLCBba2V5XTp0cnVlfSkpO1xuICAgICAgICBzZXRSb3V0ZSgnaHViJyk7XG4gICAgICAgIHNldE1vZGFsKG51bGwpO1xuICAgIH07XG5cbiAgICAvKiBmdWxsLXBhZ2UgUHN5IENoYXJ0IGVkaXRvciAqL1xuICAgIGlmIChyb3V0ZSA9PT0gJ3BzeScpIHtcbiAgICAgICAgcmV0dXJuIDxQc3lDaGFydFNldHRpbmdQYWdlIGNmZz17cHN5Q2ZnfSBzZXRDZmc9e3NldFBzeUNmZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQmFjaz17KCkgPT4gc2V0Um91dGUoJ2h1YicpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXsoKSA9PiBmaW5pc2goJ3BzeScpfSAvPjtcbiAgICB9XG5cbiAgICAvKiBkZWZhdWx0OiBIVUIgc2NyZWVuICovXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtaW4taC1zY3JlZW4gcHgtNiBweS04XCI+XG4gICAgICAgICAgICB7LyogLS0tLS0tLS0tLS0tLSBoZWFkZXIgLS0tLS0tLS0tLS0tLSAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctNXhsIG14LWF1dG8gZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIG1iLTEwIGZhZGUtdXBcIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwidGV4dC0yeGwgc206dGV4dC0zeGwgZm9udC1ibGFjayBpdGFsaWMgdXBwZXJjYXNlIHRyYWNraW5nLXRpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXJlZC01MDBcIj5SZWQ1PC9zcGFuPiA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlXCI+U3R1ZGlvPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgZm9udC1ub3JtYWwgaXRhbGljXCI+ICZuYnNwOy8mbmJzcDsgc2V0dXAgd2Fsazwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9oMT5cbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgdGV4dC14cyBtdC0xIGZvbnQtbW9ubyB0cmFja2luZy13aWRlXCI+Q29uZmlndXJlIG9uY2UuIFNraXAgYW55IHN0ZXAgeW91IGRvbid0IG5lZWQuPC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIi9kYXNoYm9hcmQuaHRtbFwiXG4gICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHsgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDUuc2V0dXAuZG9uZScsJzEnKTsgfSBjYXRjaChlKXt9IH19XG4gICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS01MDAgaG92ZXI6dGV4dC1zbGF0ZS0zMDAgdW5kZXJsaW5lIHVuZGVybGluZS1vZmZzZXQtNFwiPlNraXAgYWxsIOKGkjwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogLS0tLS0tLS0tLS0tLSBwZW50YWdvbiBsYXlvdXQgLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgIDUgY2lyY3VsYXIgdGlsZXMgYXJyYW5nZWQgYXQgdGhlIGNvcm5lcnMgb2YgYSByZWd1bGFyXG4gICAgICAgICAgICAgICAgcGVudGFnb24uICBQb2xhciBtYXRoczogYW5nbGUgc3RhcnRzIGF0IC05MGRlZyAodG9wKSBhbmRcbiAgICAgICAgICAgICAgICBzdGVwcyBieSArNzJkZWcgY2xvY2t3aXNlLiAgVGhlIGNvbnRhaW5lciBpcyBoZWlnaHQtbG9ja2VkXG4gICAgICAgICAgICAgICAgdmlhIGFzcGVjdCByYXRpbyBzbyB0aGUgcGVudGFnb24gc3RheXMgY2lyY3VsYXIgb24gZXZlcnlcbiAgICAgICAgICAgICAgICB2aWV3cG9ydC4gIFJhZGl1cyBpcyA0MCAlIG9mIHRoZSBjb250YWluZXIgaGFsZi1zaWRlLCBjaXJjbGVcbiAgICAgICAgICAgICAgICBkaWFtZXRlciB+MjcgJSBvZiB0aGUgY29udGFpbmVyIHdpZHRoIC0tIGdpdmVzIGEgY2xlYXJseVxuICAgICAgICAgICAgICAgIHZpc2libGUgZ2FwICh+MjggJSBvZiBjb250YWluZXIgd2lkdGgpIGJldHdlZW4gYWRqYWNlbnRcbiAgICAgICAgICAgICAgICBjaXJjbGVzIHJlZ2FyZGxlc3Mgb2Ygc2NyZWVuIHNpemUuICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBteC1hdXRvIGZhZGUtdXBcIlxuICAgICAgICAgICAgICAgICBzdHlsZT17eyB3aWR0aDonbWluKDc2MHB4LCA5MnZ3KScsIGFzcGVjdFJhdGlvOicxIC8gMScsIGFuaW1hdGlvbkRlbGF5OicuMDhzJyB9fT5cblxuICAgICAgICAgICAgICAgIHsvKiBCYWNrZ3JvdW5kIHBzeS1jaGFydCBsYXllciAtLSBzaXplZCB0byBmaWxsIHRoZSBjb25zdGVsbGF0aW9uXG4gICAgICAgICAgICAgICAgICAgIGNpcmNsZSAofjc4ICUgb2YgY29udGFpbmVyID0ganVzdCBpbnNpZGUgdGhlIGNvbnN0ZWxsYXRpb25cbiAgICAgICAgICAgICAgICAgICAgYXJjIHRoYXQgam9pbnMgdGhlIDUgdGlsZSBjZW50cmVzKS4gIFJlbmRlcmVkIEZJUlNUIHNvIHRoZVxuICAgICAgICAgICAgICAgICAgICA1IHRpbGUgY2lyY2xlcyAobmV4dCBpbiBET00pIHNpdCBvbiB0b3AgYW5kIG9ic2N1cmUgdGhlXG4gICAgICAgICAgICAgICAgICAgIHBvcnRpb24gb2YgdGhlIGNoYXJ0IHRoYXQgb3ZlcmxhcHMgdGhlbS4gIFRoYXQgZ2l2ZXMgdGhlXG4gICAgICAgICAgICAgICAgICAgIFwiaW1hZ2UgcmVjZWRlcyBiZWhpbmQgdGhlIDUgY2lyY2xlc1wiIGVmZmVjdC4gKi99XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBsZWZ0LTEvMiB0b3AtMS8yIC10cmFuc2xhdGUteC0xLzIgLXRyYW5zbGF0ZS15LTEvMiBwb2ludGVyLWV2ZW50cy1ub25lIG92ZXJmbG93LWhpZGRlbiByb3VuZGVkLWZ1bGxcIlxuICAgICAgICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7d2lkdGg6Jzc4JScsIGFzcGVjdFJhdGlvOicxLzEnfX0+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiL2FwaS9hc3NldHMvaW1nL3BzeV9zaWxob3VldHRlLmpwZ1wiIGFsdD1cIlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMCB3LWZ1bGwgaC1mdWxsIG9iamVjdC1jb3ZlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tvcGFjaXR5OjAuNzh9fSAvPlxuICAgICAgICAgICAgICAgICAgICB7LyogRGFyayB2aWduZXR0ZSAvIGxlbnMgLS0gcHVsbHMgdGhlIGNlbnRyZSBkb3duIHNvIHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgTi81IERPTkUgY291bnRlciB0aGF0IGxpdmVzIE9OIFRPUCBzdGF5cyByZWFkYWJsZS4gKi99XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOidyYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IGNlbnRlciwgcmdiYSgyLDYsMjMsMC42MCkgMCUsIHJnYmEoMiw2LDIzLDAuMzUpIDU1JSwgcmdiYSgyLDYsMjMsMC4xMCkgMTAwJSknfX0vPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAge1NURVBTLm1hcCgocywgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmdsZURlZyA9IC05MCArIGkgKiA3MjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5nbGUgPSBhbmdsZURlZyAqIE1hdGguUEkgLyAxODA7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHIgPSA0MDsgICAgICAgICAgICAgICAgICAgICAgICAvLyAlIG9mIGNvbnRhaW5lciBoYWxmLXNpZGVcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeCA9IDUwICsgciAqIE1hdGguY29zKGFuZ2xlKTsgIC8vICVcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeSA9IDUwICsgciAqIE1hdGguc2luKGFuZ2xlKTsgIC8vICVcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDaXJjbGVUaWxlIGtleT17cy5rZXl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGVwPXtzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZT17ZG9uZVtzLmtleV19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleD17aSsxfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdFBjdD17eH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcFBjdD17eX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocy5raW5kID09PSAncGFnZScpICAgICAgc2V0Um91dGUocy5rZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHMua2luZCA9PT0gJ2xpbmsnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNhbWUtdGFiIG5hdiBzbyB0aGUgcmV0dXJuIGJhZGdlIG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZS5odG1sIGNhbiBzaW1wbHkgd2luZG93LmxvY2F0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2sgaGVyZSB3aGVuIHRoZSBvcGVyYXRvciBpcyBkb25lLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHMuaHJlZjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgICAgICAgICAgICAgICAgICAgICAgc2V0TW9kYWwocy5rZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICB7LyogRGVjb3JhdGl2ZSByaW5nOiBhIHNpbmdsZSBjaXJjbGUgd2hvc2UgY2VudHJlIGNvaW5jaWRlc1xuICAgICAgICAgICAgICAgICAgICB3aXRoIHRoZSBjZW50cmUgb2YgdGhlIHBlbnRhZ29uIGFuZCB3aG9zZSByYWRpdXMgZXF1YWxzXG4gICAgICAgICAgICAgICAgICAgIHRoZSBwZW50YWdvbiB2ZXJ0ZXggcmFkaXVzIC0tIGl0cyBib3VuZGFyeSBwYXNzZXNcbiAgICAgICAgICAgICAgICAgICAgY2xlYW5seSB0aHJvdWdoIHRoZSBjZW50cmUgb2YgZWFjaCB0aWxlLiAgVGhlIG1hc2tcbiAgICAgICAgICAgICAgICAgICAgY3V0cyBvdXQgdGhlIGRpc2sgb2YgZXZlcnkgdGlsZSBjaXJjbGUgc28gdGhlIHJpbmcgaXNcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJsZSBPTkxZIGluIHRoZSBnYXBzIGJldHdlZW4gdGlsZXMsIG5ldmVyIGNyb3NzaW5nXG4gICAgICAgICAgICAgICAgICAgIGEgdGlsZSBpbnRlcmlvci4gKi99XG4gICAgICAgICAgICAgICAgPHN2ZyBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC0wIHctZnVsbCBoLWZ1bGwgcG9pbnRlci1ldmVudHMtbm9uZVwiXG4gICAgICAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDEwMCAxMDBcIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPVwibm9uZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGVmcz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxtYXNrIGlkPVwicGVudGFnb24tcmluZy1tYXNrXCIgbWFza1VuaXRzPVwidXNlclNwYWNlT25Vc2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeD1cIjBcIiB5PVwiMFwiIHdpZHRoPVwiMTAwXCIgaGVpZ2h0PVwiMTAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3QgeD1cIjBcIiB5PVwiMFwiIHdpZHRoPVwiMTAwXCIgaGVpZ2h0PVwiMTAwXCIgZmlsbD1cIndoaXRlXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7U1RFUFMubWFwKChfLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGEgPSAoLTkwICsgaSAqIDcyKSAqIE1hdGguUEkgLyAxODA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGN4ID0gNTAgKyA0MCAqIE1hdGguY29zKGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjeSA9IDUwICsgNDAgKiBNYXRoLnNpbihhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogMTcuNSAlIHJhZGl1cyA9IHNhbWUgYXMgdGhlIHRpbGUgY2lyY2xlJ3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFsZi13aWR0aCAoMzUgJSBkaWFtZXRlcik7ICswLjUgJSBudWRnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZWVwcyB0aGUgbWFzayBlZGdlIGluc2lkZSB0aGUgY29sb3VyZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmluZyBzbyB0aGUgd2hpdGUgYXJjIGRvZXNuJ3QgQUxNT1NULXRvdWNoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSByaW5nIGJvcmRlciB3aXRoIGFudGktYWxpYXNlZCBmcmluZ2UuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiA8Y2lyY2xlIGtleT17aX0gY3g9e2N4fSBjeT17Y3l9IHI9XCIxOFwiIGZpbGw9XCJibGFja1wiIC8+O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9tYXNrPlxuICAgICAgICAgICAgICAgICAgICA8L2RlZnM+XG4gICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgY3g9XCI1MFwiIGN5PVwiNTBcIiByPVwiNDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCJyZ2JhKDI1NSwyNTUsMjU1LDAuODUpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2VXaWR0aD1cIjAuNTZcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hc2s9XCJ1cmwoI3BlbnRhZ29uLXJpbmctbWFzaylcIiAvPlxuICAgICAgICAgICAgICAgIDwvc3ZnPlxuXG4gICAgICAgICAgICAgICAgey8qIENlbnRyZWQgY29tcGxldGlvbiBjb3VudGVyIC0tIHNpdHMgYXQgdGhlIGNlbnRyb2lkIG9mIHRoZVxuICAgICAgICAgICAgICAgICAgICBwZW50YWdvbiwgZm9udCB3ZWlnaHQgbWF0Y2hlZCB0byB0aGUgcGVyLXRpbGUgaGVhZGluZyBzbyB0aGVcbiAgICAgICAgICAgICAgICAgICAgZXllIHJlYWRzIGl0IGFzIHRoZSBkb21pbmFudCBzdGF0dXMuICBSZW5kZXJlZCBMQVNUIHNvIGl0XG4gICAgICAgICAgICAgICAgICAgIHNpdHMgb24gdG9wIG9mIGJvdGggdGhlIHBzeS1jaGFydCBzaWxob3VldHRlIGFuZCB0aGUgdGlsZVxuICAgICAgICAgICAgICAgICAgICBjaXJjbGVzLiAqL31cbiAgICAgICAgICAgICAgICB7LyogTi81IERPTkUgdGV4dCAtLSBvd24gYWJzb2x1dGUgbGF5ZXIgcmVuZGVyZWQgQUZURVIgdGhlXG4gICAgICAgICAgICAgICAgICAgIHRpbGUgY2lyY2xlcyBzbyBpdCBhbHdheXMgc2l0cyBvbiB0b3AuICovfVxuICAgICAgICAgICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJzZXR1cC1wcm9ncmVzcy1jZW50ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgbGVmdC0xLzIgdG9wLTEvMiAtdHJhbnNsYXRlLXgtMS8yIC10cmFuc2xhdGUteS0xLzIgdGV4dC1jZW50ZXIgcG9pbnRlci1ldmVudHMtbm9uZSBzZWxlY3Qtbm9uZVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YHRleHQtWzIycHhdIHNtOnRleHQtWzI2cHhdIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXRpZ2h0IHdoaXRlc3BhY2Utbm93cmFwIGxlYWRpbmctbm9uZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Y29tcGxldGVDb3VudCA9PT0gNSA/ICd0ZXh0LWVtZXJhbGQtNDAwJyA6ICd0ZXh0LXdoaXRlJ31gfVxuICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7dGV4dFNoYWRvdzonMCAycHggMTJweCByZ2JhKDIsNiwyMywwLjg1KSwgMCAwIDRweCByZ2JhKDIsNiwyMywwLjg1KSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZUNvdW50fS81XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHNtOnRleHQtWzExcHhdIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLVswLjNlbV0gdGV4dC1zbGF0ZS0zMDAgbXQtMlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3t0ZXh0U2hhZG93OicwIDFweCA2cHggcmdiYSgyLDYsMjMsMC44NSknfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICBEb25lXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiAtLS0tLS0tLS0tLS0tIGZvb3RlciBDVEEgLS0tLS0tLS0tLS0tLSAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctNXhsIG14LWF1dG8gbXQtMTAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIGZhZGUtdXBcIiBzdHlsZT17e2FuaW1hdGlvbkRlbGF5OicuMThzJ319PlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNTAwIHRleHQteHMgZm9udC1tb25vXCI+XG4gICAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZUNvdW50ID09PSAwICYmICfihpEgUGljayBhIHNldHRpbmcgdG8gc3RhcnQsIG9yIHNraXAgYWxsIGFuZCBnbyBzdHJhaWdodCB0byB0aGUgZGFzaGJvYXJkLid9XG4gICAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZUNvdW50ID4gMCAmJiBjb21wbGV0ZUNvdW50IDwgNSAmJiBg4oaRICR7NSAtIGNvbXBsZXRlQ291bnR9IHN0ZXAkezUgLSBjb21wbGV0ZUNvdW50ID09PSAxID8gJycgOiAncyd9IHJlbWFpbmluZyAob3B0aW9uYWwpLmB9XG4gICAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZUNvdW50ID09PSA1ICYmICfinJMgQWxsIHN0ZXBzIGNvbmZpZ3VyZWQuICBSZWFkeSB3aGVuIHlvdSBhcmUuJ31cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cIi9kYXNoYm9hcmQuaHRtbFwiXG4gICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4geyB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS5zZXR1cC5kb25lJywnMScpOyB9IGNhdGNoKGUpe30gfX1cbiAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweC03IHB5LTMgcm91bmRlZC14bCB0ZXh0LXNtIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjb21wbGV0ZUNvdW50ID09PSA1XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctZW1lcmFsZC02MDAgaG92ZXI6YmctZW1lcmFsZC01MDAgdGV4dC13aGl0ZSBzaGFkb3ctbGcgc2hhZG93LWVtZXJhbGQtNTAwLzMwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLWluZGlnby02MDAgaG92ZXI6YmctaW5kaWdvLTUwMCB0ZXh0LXdoaXRlIHNoYWRvdy1sZyBzaGFkb3ctaW5kaWdvLTUwMC8yMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgIE9wZW4gRGFzaGJvYXJkIOKGklxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogLS0tLS0tLS0tLS0tLSBtb2RhbHMgLS0tLS0tLS0tLS0tLSAqL31cbiAgICAgICAgICAgIHttb2RhbCA9PT0gJ2xvY2F0aW9uJyAmJiA8TG9jYXRpb25Nb2RhbCBjZmc9e2xvY0NmZ30gc2V0Q2ZnPXtzZXRMb2NDZmd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRNb2RhbChudWxsKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2F2ZT17KCkgPT4gZmluaXNoKCdsb2NhdGlvbicpfSAvPn1cbiAgICAgICAgICAgIHttb2RhbCA9PT0gJ2xhbmd1YWdlJyAmJiA8TGFuZ3VhZ2VNb2RhbCBjZmc9e2xhbmdDZmd9IHNldENmZz17c2V0TGFuZ0NmZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldE1vZGFsKG51bGwpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXsoKSA9PiBmaW5pc2goJ2xhbmd1YWdlJyl9IC8+fVxuICAgICAgICAgICAge21vZGFsID09PSAncGx1Z2lucycgICYmIDxQbHVnaW5zTW9kYWwgIGNmZz17cGx1Z2luQ2ZnfSBzZXRDZmc9e3NldFBsdWdpbkNmZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldE1vZGFsKG51bGwpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXsoKSA9PiBmaW5pc2goJ3BsdWdpbnMnKX0gLz59XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFRpbGUgKGxhcmdlIGVhc3ktb24tZXllcyBidXR0b24pIC0tIGtlcHQgZm9yIGJhY2stY29tcGF0LCBubyBsb25nZXIgdXNlZFxuICogYnkgdGhlIHBlbnRhZ29uIGh1Yi5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIFRpbGUoeyBzdGVwLCBkb25lLCBpbmRleCwgb25DbGljayB9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgc2V0dXAtdGlsZS0ke3N0ZXAua2V5fWB9XG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17YE9wZW4gJHtzdGVwLmxhYmVsfWB9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdGlsZS1idG4gcmVsYXRpdmUgdGV4dC1sZWZ0IGJnLXNsYXRlLTkwMC83MCBib3JkZXItMiBib3JkZXItc2xhdGUtNzAwLzcwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91bmRlZC0yeGwgcC02IHNtOnAtNyAke2RvbmUgPyAnZG9uZScgOiAnJ31gfT5cbiAgICAgICAgICAgIHtkb25lICYmIDxzcGFuIGNsYXNzTmFtZT1cImNoZWNrXCIgZGF0YS10ZXN0aWQ9e2BzZXR1cC10aWxlLSR7c3RlcC5rZXl9LWRvbmVgfT7inJM8L3NwYW4+fVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtNCBtYi0zXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTEyIGgtMTIgcm91bmRlZC14bCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiXG4gICAgICAgICAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6YCR7c3RlcC5pY29uQ29sb3J9MjJgLCBib3JkZXI6YDFweCBzb2xpZCAke3N0ZXAuaWNvbkNvbG9yfTU1YH19PlxuICAgICAgICAgICAgICAgICAgICA8VGlsZUljb24ga2luZD17c3RlcC5rZXl9IGNvbG9yPXtzdGVwLmljb25Db2xvcn0gLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtM3hsIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS03MDBcIj4we2luZGV4fTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1sZyBzbTp0ZXh0LXhsIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVyIG1iLTFcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7Y29sb3I6c3RlcC5pY29uQ29sb3J9fT57c3RlcC5sYWJlbH08L2gzPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS00MDAgdGV4dC1zbSBsZWFkaW5nLXNudWdcIj57c3RlcC5zdWJ9PC9wPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC00IGZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicGlsbCBiZy1zbGF0ZS04MDAgdGV4dC1zbGF0ZS00MDBcIj57c3RlcC5raW5kID09PSAncGFnZScgPyAnRnVsbCBwYWdlJyA6ICdQb3B1cCd9PC9zcGFuPlxuICAgICAgICAgICAgICAgIHtkb25lICYmIDxzcGFuIGNsYXNzTmFtZT1cInBpbGwgYmctZW1lcmFsZC05MDAvNDAgdGV4dC1lbWVyYWxkLTQwMFwiPkNvbmZpZ3VyZWQ8L3NwYW4+fVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENpcmNsZVRpbGUgLS0gcGVudGFnb24tY29ybmVyIHJvdW5kIGJ1dHRvbi4gIFNpemVkIGluICUgb2YgaXRzIGNvbnRhaW5lclxuICogc28gdGhlIHdob2xlIGxheW91dCBzY2FsZXMgd2l0aCB2aWV3cG9ydC4gIEVhY2ggY2lyY2xlIGlzIGFuY2hvcmVkIGJ5IGl0c1xuICogY2VudHJlICh0cmFuc2xhdGUgLTUwJS8tNTAlKSBvbiB0aGUgcG9sYXItY29tcHV0ZWQgKGxlZnQlLCB0b3AlKS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIENpcmNsZVRpbGUoeyBzdGVwLCBkb25lLCBpbmRleCwgbGVmdFBjdCwgdG9wUGN0LCBvbkNsaWNrIH0pIHtcbiAgICAvKiBUaGljayBjb2xvdXJlZCByaW5nIHBlciB0aWxlIC0tIGVhY2ggc3RlcCBrZWVwcyBpdHMgYWNjZW50IGNvbG91clxuICAgICAqIChpbmRpZ28vYW1iZXIvZW1lcmFsZC9waW5rL3Jvc2UpLCByZWluZm9yY2luZyB0aGUgY29sb3VyLWNvZGVkIFNWR1xuICAgICAqIGljb24gYW5kIHRoZSBoZWFkaW5nIHRleHQuICovXG4gICAgY29uc3QgcmluZ0NvbG9yID0gc3RlcC5pY29uQ29sb3I7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgc2V0dXAtdGlsZS0ke3N0ZXAua2V5fWB9XG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17YE9wZW4gJHtzdGVwLmxhYmVsfWB9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgY2lyY2xlLXRpbGUgZ3JvdXAgYWJzb2x1dGUgcm91bmRlZC1mdWxsIHRleHQtY2VudGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi0yMDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2RvbmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctc2xhdGUtOTAwIHNoYWRvdy1bMF8wXzMwcHhfLTZweF9yZ2JhKDE2LDE4NSwxMjksMC41NSldJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1zbGF0ZS05MDAgaG92ZXI6Ymctc2xhdGUtODAwJ31gfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6YCR7bGVmdFBjdH0lYCwgdG9wOmAke3RvcFBjdH0lYCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6J21pbigzNSUsIDI2MHB4KScsIGFzcGVjdFJhdGlvOicxLzEnLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06J3RyYW5zbGF0ZSgtNTAlLCAtNTAlKScsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlcjpgMTBweCBzb2xpZCAke3JpbmdDb2xvcn1gLFxuICAgICAgICAgICAgICAgICAgICBib3hTaGFkb3c6YDAgMCAwIDFweCAke3JpbmdDb2xvcn0zMywgMCA4cHggMjhweCAtOHB4ICR7cmluZ0NvbG9yfTU1YCxcbiAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHtkb25lICYmIChcbiAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLXRlc3RpZD17YHNldHVwLXRpbGUtJHtzdGVwLmtleX0tZG9uZWB9XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgLXRvcC0xIC1yaWdodC0xIHctNiBoLTYgcm91bmRlZC1mdWxsIGJnLWVtZXJhbGQtNTAwIHRleHQtd2hpdGUgdGV4dC14cyBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBmb250LWJvbGQgc2hhZG93XCI+XG4gICAgICAgICAgICAgICAgICAgIOKck1xuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdW5kZWQteGwgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgbWItMVwiXG4gICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiczNCUnLCBhc3BlY3RSYXRpbzonMS8xJyxcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDpgJHtzdGVwLmljb25Db2xvcn0yMmAsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlcjpgMXB4IHNvbGlkICR7c3RlcC5pY29uQ29sb3J9NTVgLFxuICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICA8VGlsZUljb24ga2luZD17c3RlcC5rZXl9IGNvbG9yPXtzdGVwLmljb25Db2xvcn0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSBmb250LWJsYWNrIHRleHQtc2xhdGUtNjAwIHRyYWNraW5nLXdpZGVyXCI+MHtpbmRleH08L2Rpdj5cbiAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LVsyMnB4XSBzbTp0ZXh0LVsyNnB4XSBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy10aWdodCB3aGl0ZXNwYWNlLW5vd3JhcCBsZWFkaW5nLW5vbmUgbXQtMS41XCJcbiAgICAgICAgICAgICAgICBzdHlsZT17e2NvbG9yOnN0ZXAuaWNvbkNvbG9yfX0+XG4gICAgICAgICAgICAgICAge3N0ZXAubGFiZWx9XG4gICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgdGV4dC1bMTBweF0gc206dGV4dC1bMTFweF0gbGVhZGluZy1zbnVnIHB4LTMgbXQtMSBsaW5lLWNsYW1wLTJcIj5cbiAgICAgICAgICAgICAgICB7c3RlcC5zdWJ9XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICk7XG59XG5cbmZ1bmN0aW9uIFRpbGVJY29uKHsga2luZCwgY29sb3IgfSkge1xuICAgIC8qIHNpbXBsZSBpbmxpbmUgU1ZHcyBzbyB3ZSBrZWVwIHRoZSBmaWxlIHNlbGYtY29udGFpbmVkICovXG4gICAgY29uc3Qgc3Ryb2tlID0geyBzdHJva2U6Y29sb3IsIGZpbGw6J25vbmUnLCBzdHJva2VXaWR0aDoyLCBzdHJva2VMaW5lY2FwOidyb3VuZCcsIHN0cm9rZUxpbmVqb2luOidyb3VuZCcgfTtcbiAgICBpZiAoa2luZCA9PT0gJ3BzeScpICAgICAgcmV0dXJuIDxzdmcgd2lkdGg9XCIyMlwiIGhlaWdodD1cIjIyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHsuLi5zdHJva2V9PjxwYXRoIGQ9XCJNMyAzdjE4aDE4XCIvPjxwYXRoIGQ9XCJNMyAxN2M0LTEgNy02IDktOXM1LTMgOS0yXCIvPjwvc3ZnPjtcbiAgICBpZiAoa2luZCA9PT0gJ2xvY2F0aW9uJykgcmV0dXJuIDxzdmcgd2lkdGg9XCIyMlwiIGhlaWdodD1cIjIyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHsuLi5zdHJva2V9PjxwYXRoIGQ9XCJNMTIgMjJzLTctNi40LTctMTJhNyA3IDAgMSAxIDE0IDBjMCA1LjYtNyAxMi03IDEyelwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEwXCIgcj1cIjIuNVwiLz48L3N2Zz47XG4gICAgaWYgKGtpbmQgPT09ICdsYW5ndWFnZScpIHJldHVybiA8c3ZnIHdpZHRoPVwiMjJcIiBoZWlnaHQ9XCIyMlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB7Li4uc3Ryb2tlfT48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjlcIi8+PHBhdGggZD1cIk0zIDEyaDE4TTEyIDNhMTQgMTQgMCAwIDEgMCAxOE0xMiAzYTE0IDE0IDAgMCAwIDAgMThcIi8+PC9zdmc+O1xuICAgIGlmIChraW5kID09PSAncGx1Z2lucycpICByZXR1cm4gPHN2ZyB3aWR0aD1cIjIyXCIgaGVpZ2h0PVwiMjJcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgey4uLnN0cm9rZX0+PHBhdGggZD1cIk05IDN2Nk0xNSAzdjZcIi8+PHBhdGggZD1cIk01IDloMTR2NmE0IDQgMCAwIDEtNCA0aC0xdjNNOSAxOXYzXCIvPjwvc3ZnPjtcbiAgICAvKiBVcGRhdGUgJiBSZXBhaXIgLS0gd3JlbmNoICsgdGlueSBnZWFyIGJ1bXAsIHNpZ25hbGxpbmcgXCJ0b29sc1wiICovXG4gICAgaWYgKGtpbmQgPT09ICdyZXBhaXInKSAgIHJldHVybiA8c3ZnIHdpZHRoPVwiMjJcIiBoZWlnaHQ9XCIyMlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB7Li4uc3Ryb2tlfT48cGF0aCBkPVwiTTE0LjcgNi4zYTQgNCAwIDAgMC01LjQgNS40TDMgMThsMyAzIDYuMy02LjNhNCA0IDAgMCAwIDUuNC01LjRsLTIuOCAyLjhMMTMgMTFsLTEuMS0xLjkgMi44LTIuOHpcIi8+PC9zdmc+O1xuICAgIHJldHVybiBudWxsO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBQc3kgQ2hhcnQgU2V0dGluZyAtLSBGVUxMIFBBR0UsIGxpdmUgc2tlbGV0b24gcmVzcG9uZHMgdG8gY29udHJvbHNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIFBzeUNoYXJ0U2V0dGluZ1BhZ2UoeyBjZmcsIHNldENmZywgb25CYWNrLCBvblNhdmUgfSkge1xuICAgIGNvbnN0IHVwZGF0ZSA9IChrLCB2KSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIFtrXTp2fSkpO1xuXG4gICAgLyogT24gbW91bnQ6IGh5ZHJhdGUgZnJvbSB0aGUgU0FNRSBsb2NhbFN0b3JhZ2Uga2V5IHRoZSBkYXNoYm9hcmQgcmVhZHNcbiAgICAgKiAoYHJlZDVfc3dlZXRfc3BvdF9yYW5nZWApIHBsdXMgdGhlIHByZXNldCBpZCAoYHJlZDVfcmhfcHJlc2V0YCkgc29cbiAgICAgKiB0aGUgZHJvcGRvd24gbGFiZWwgc3RheXMgY29uc2lzdGVudCB3aXRoIHRoZSBzbGlkZXIgdmFsdWVzIGFjcm9zc1xuICAgICAqIHJlbG9hZHMuICBJZiB0aGUgb3BlcmF0b3IgaGFzIGFscmVhZHkgdHVuZWQgdGhlIFJIIGJhbmQgb24gdGhlXG4gICAgICogZGFzaGJvYXJkLCB0aGUgc2V0dXAgd2FsayBzdGFydHMgZnJvbSB0aG9zZSB2YWx1ZXMuICovXG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJhdyAgICA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWQ1X3N3ZWV0X3Nwb3RfcmFuZ2UnKTtcbiAgICAgICAgICAgIGNvbnN0IHByZXNldCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWQ1X3JoX3ByZXNldCcpO1xuICAgICAgICAgICAgY29uc3QgcGF0Y2ggID0ge307XG4gICAgICAgICAgICBpZiAocmF3KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcCA9IEpTT04ucGFyc2UocmF3KTtcbiAgICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHAubG8pICYmIE51bWJlci5pc0Zpbml0ZShwLmhpKSAmJiBwLmxvIDwgcC5oaSkge1xuICAgICAgICAgICAgICAgICAgICBwYXRjaC5yaExvID0gcC5sbztcbiAgICAgICAgICAgICAgICAgICAgcGF0Y2gucmhIaSA9IHAuaGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByZXNldCAmJiBSSF9QUkVTRVRTLmZpbmQoeCA9PiB4LmlkID09PSBwcmVzZXQpKSB7XG4gICAgICAgICAgICAgICAgcGF0Y2gucmhQcmVzZXQgPSBwcmVzZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBUaGVtZSArIGJyaWdodG5lc3Mg4oCUIHNhbWUga2V5cyBhcHAuanMgKGRhc2hib2FyZCkgcmVhZHMuICovXG4gICAgICAgICAgICBjb25zdCB0aCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWQ1LnRoZW1lJyk7XG4gICAgICAgICAgICBpZiAodGggPT09ICdsaWdodCcgfHwgdGggPT09ICdkYXJrJykgcGF0Y2gudGhlbWUgPSB0aDtcbiAgICAgICAgICAgIGNvbnN0IGRsID0gcGFyc2VGbG9hdChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVkNS5kYXJrTGV2ZWwnKSk7XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGRsKSAmJiBkbCA+PSAxLjUgJiYgZGwgPD0gMy4wKSBwYXRjaC5kYXJrTGV2ZWwgPSBkbDtcbiAgICAgICAgICAgIC8qIFRlbXBlcmF0dXJlIGF4aXMgcmFuZ2Ug4oCUIHdyaXR0ZW4gYnkgdGhpcyBzYW1lIHBhZ2UncyBzYXZlXG4gICAgICAgICAgICAgKiBoYW5kbGVyOyBsb2FkIGl0IGhlcmUgc28gcmVvcGVuaW5nIHRoZSBzZXR1cCB3YWxrIHNob3dzIHRoZVxuICAgICAgICAgICAgICogY3VycmVudCBkYXNoYm9hcmQgYXhpcyBpbnN0ZWFkIG9mIGFsd2F5cyBkZWZhdWx0aW5nIHRvIC0xNS4uNTAuICovXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRyUmF3ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlZDVfdGVtcF9yYW5nZScpO1xuICAgICAgICAgICAgICAgIGlmICh0clJhdykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ciA9IEpTT04ucGFyc2UodHJSYXcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHRyLm1pbikgJiYgTnVtYmVyLmlzRmluaXRlKHRyLm1heCkgJiYgdHIubWluIDwgdHIubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRjaC50TG8gPSB0ci5taW47XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRjaC50SGkgPSB0ci5tYXg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7IC8qIGlnbm9yZSAqLyB9XG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMocGF0Y2gpLmxlbmd0aCkgc2V0Q2ZnKGMgPT4gKHsuLi5jLCAuLi5wYXRjaH0pKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBpZ25vcmUgKi8gfVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgICB9LCBbXSk7XG5cbiAgICAvKiBPbiBzYXZlOiBwZXJzaXN0IHRoZSBSSCBiYW5kIHRvIGxvY2FsU3RvcmFnZSBzbyB0aGUgZGFzaGJvYXJkJ3NcbiAgICAgKiBzd2VldC1zcG90IHBvbHlnb24gcGlja3MgaXQgdXAgb24gbmV4dCBsb2FkLiAgQWxzbyBwZXJzaXN0IHRoZSB2ZW51ZVxuICAgICAqIHByZXNldCBpZCAoZm9yIGZ1dHVyZSBcInNob3cgcHJlc2V0IG5hbWUgb24gZGFzaGJvYXJkXCIgZmVhdHVyZXMpLiAqL1xuICAgIGNvbnN0IHBlcnNpc3RBbmRTYXZlID0gKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDVfc3dlZXRfc3BvdF9yYW5nZScsXG4gICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoeyBsbzogY2ZnLnJoTG8sIGhpOiBjZmcucmhIaSB9KSk7XG4gICAgICAgICAgICBpZiAoY2ZnLnJoUHJlc2V0KSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDVfcmhfcHJlc2V0JywgY2ZnLnJoUHJlc2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIFRoZW1lICsgYnJpZ2h0bmVzcyDigJQgd3JpdHRlbiB0byB0aGUgU0FNRSBrZXlzIHRoZSBkYXNoYm9hcmRcbiAgICAgICAgICAgICAqIChhcHAuanMgbGluZXMgNTctNTggYW5kIDg0LTk3KSByZWFkcyBhcyBpdHMgdXNlU3RhdGUgbGF6eVxuICAgICAgICAgICAgICogaW5pdGlhbGlzZXIsIHNvIHRoZSBjaG9zZW4gdGhlbWUgdGFrZXMgZWZmZWN0IG9uIG5leHQgZGFzaGJvYXJkXG4gICAgICAgICAgICAgKiBsb2FkLiAgYXBwLmpzIHRyZWF0cyBkYXJrTGV2ZWwgPj0gMy4wIGFzIGxpZ2h0LW1vZGUgdHJpZ2dlci4gKi9cbiAgICAgICAgICAgIGlmIChjZmcudGhlbWUgPT09ICdsaWdodCcgfHwgY2ZnLnRoZW1lID09PSAnZGFyaycpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS50aGVtZScsIGNmZy50aGVtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGNmZy5kYXJrTGV2ZWwpKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDUuZGFya0xldmVsJywgU3RyaW5nKGNmZy5kYXJrTGV2ZWwpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIFRlbXBlcmF0dXJlIGF4aXMgcmFuZ2Ug4oCUIGRyaXZlcyB0aGUgZGFzaGJvYXJkJ3MgcHN5IGNoYXJ0XG4gICAgICAgICAgICAgKiBYIGF4aXMgKGB0ZW1wUmFuZ2UubWluL21heGAgaW4gYXBwLmpzKS4gIFdlIHdyaXRlIHRoZSBzYW1lXG4gICAgICAgICAgICAgKiBzaGFwZSBhcHAuanMgcmVhZHMgKGB7bWluLCBtYXh9YCkgc28gaXRzIGxhenkgdXNlU3RhdGUgaW5pdFxuICAgICAgICAgICAgICogcGlja3MgaXQgdXAgb24gbmV4dCBsb2FkLCBBTkQgZGlzcGF0Y2ggYSBjdXN0b20gZXZlbnQgc29cbiAgICAgICAgICAgICAqIGFueSBvcGVuIGRhc2hib2FyZCB0YWIgdXBkYXRlcyBsaXZlIHdpdGhvdXQgYSByZWZyZXNoLiAqL1xuICAgICAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShjZmcudExvKSAmJiBOdW1iZXIuaXNGaW5pdGUoY2ZnLnRIaSkgJiYgY2ZnLnRMbyA8IGNmZy50SGkpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNV90ZW1wX3JhbmdlJyxcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoeyBtaW46IGNmZy50TG8sIG1heDogY2ZnLnRIaSB9KSk7XG4gICAgICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdyNS10ZW1wLXJhbmdlLWNoYW5nZScsIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7IG1pbjogY2ZnLnRMbywgbWF4OiBjZmcudEhpIH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3I1LXJoLWJhbmQtY2hhbmdlJywge1xuICAgICAgICAgICAgICAgIGRldGFpbDogeyBsbzogY2ZnLnJoTG8sIGhpOiBjZmcucmhIaSB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ1tzZXR1cCB3YWxrXSBwc3kgY2hhcnQgc2F2ZWQgLT4gUkgnLCBjZmcucmhMbywgJy0nLCBjZmcucmhIaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAnJSBULWF4aXMnLCBjZmcudExvLCAnLi4nLCBjZmcudEhpLCAnwrBDIHByZXNldD0nLCBjZmcucmhQcmVzZXQpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1tzZXR1cCB3YWxrXSBjb3VsZCBub3QgcGVyc2lzdCBwc3kgc2V0dGluZ3M6JywgZSk7XG4gICAgICAgIH1cbiAgICAgICAgb25TYXZlKCk7XG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWluLWgtc2NyZWVuIGZsZXggZmxleC1jb2xcIj5cbiAgICAgICAgICAgIHsvKiBoZWFkZXIgKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBweC02IHB5LTQgYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTgwMFwiPlxuICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17b25CYWNrfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS00MDAgaG92ZXI6dGV4dC13aGl0ZSB0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFja1wiPlxuICAgICAgICAgICAgICAgICAgICDihpAgQmFjayB0byBzZXR1cFxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJ0ZXh0LXNtIHVwcGVyY2FzZSB0cmFja2luZy1bMC4zZW1dIGZvbnQtYmxhY2sgdGV4dC1pbmRpZ28tNDAwXCI+UHN5IENoYXJ0IFNldHRpbmc8L2gxPlxuICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17cGVyc2lzdEFuZFNhdmV9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC01IHB5LTIgcm91bmRlZC1sZyBiZy1pbmRpZ28tNjAwIGhvdmVyOmJnLWluZGlnby01MDAgdGV4dC13aGl0ZSB0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFja1wiPlxuICAgICAgICAgICAgICAgICAgICBTYXZlICYgcmV0dXJuIOKck1xuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBib2R5IOKAlCBjaGFydCBsZWZ0LCBjb250cm9scyByaWdodCAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xIGdyaWQgZ3JpZC1jb2xzLTEgbGc6Z3JpZC1jb2xzLVsxZnJfMzYwcHhdIGdhcC00IHAtNiBtYXgtdy03eGwgbXgtYXV0byB3LWZ1bGxcIj5cbiAgICAgICAgICAgICAgICA8UHN5U2tlbGV0b24gY2ZnPXtjZmd9IC8+XG4gICAgICAgICAgICAgICAgPFBzeUNvbnRyb2xQYW5lbCBjZmc9e2NmZ30gdXBkYXRlPXt1cGRhdGV9IHNldENmZz17c2V0Q2ZnfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbi8qIFJIIGJhbmQgcHJlc2V0cyDigJQgcmVjb2duaXNlZCBpbmR1c3RyeSBzdGFuZGFyZHMgZm9yIGVhY2ggdmVudWUgdHlwZS5cbiAqIFNvdXJjZXM6IEFTSFJBRSA1NSAoY29tZm9ydCksIEFTSFJBRSAxNzAgKGhlYWx0aGNhcmUpLFxuICogQUFNL05QUy9TbWl0aHNvbmlhbiBndWlkYW5jZSAoY29sbGVjdGlvbnMpLCBDSUJTRSBUTTQwIChsaWJyYXJpZXMpLiAqL1xuY29uc3QgUkhfUFJFU0VUUyA9IFtcbiAgICB7IGlkOidjdXN0b20nLCAgICAgICAgICBsYWJlbDonQ3VzdG9tIChtYW51YWwpJywgICAgICAgICAgICAgICAgIGxvOm51bGwsIGhpOm51bGwsIG5vdGU6JycgfSxcbiAgICB7IGlkOidvZmZpY2UnLCAgICAgICAgICBsYWJlbDonT2ZmaWNlJywgICAgICAgICAgICAgICAgICAgICAgICAgIGxvOjMwLCAgIGhpOjYwLCAgIG5vdGU6J0FTSFJBRSA1NSBjb21mb3J0JyAgICAgICAgICAgICAgICAgIH0sXG4gICAgeyBpZDonbXVzZXVtJywgICAgICAgICAgbGFiZWw6J011c2V1bScsICAgICAgICAgICAgICAgICAgICAgICAgICBsbzo0MCwgICBoaTo1NSwgICBub3RlOidBQU0gY29sbGVjdGlvbiBwcmVzZXJ2YXRpb24nICAgICAgICB9LFxuICAgIHsgaWQ6J2hvdGVsJywgICAgICAgICAgIGxhYmVsOidIb3RlbCBndWVzdCByb29tJywgICAgICAgICAgICAgICAgbG86MzAsICAgaGk6NjAsICAgbm90ZTonZ2VuZXJhbCBvY2N1cGFudCBjb21mb3J0JyAgICAgICAgICAgfSxcbiAgICB7IGlkOidsaWJyYXJ5JywgICAgICAgICBsYWJlbDonTGlicmFyeSAvIEFyY2hpdmUnLCAgICAgICAgICAgICAgIGxvOjQwLCAgIGhpOjU1LCAgIG5vdGU6J3BhcGVyICYgYmluZGluZyBwcmVzZXJ2YXRpb24nICAgICAgIH0sXG4gICAgeyBpZDonaG9zcGl0YWwnLCAgICAgICAgbGFiZWw6J0hvc3BpdGFsIChnZW5lcmFsKScsICAgICAgICAgICAgICBsbzozMCwgICBoaTo2MCwgICBub3RlOidBU0hSQUUgMTcwIHBhdGllbnQgYXJlYXMnICAgICAgICAgICB9LFxuICAgIHsgaWQ6J2xlY3R1cmUnLCAgICAgICAgIGxhYmVsOidMZWN0dXJlIGhhbGwnLCAgICAgICAgICAgICAgICAgICAgbG86MzAsICAgaGk6NjAsICAgbm90ZTonaGlnaCBvY2N1cGFuY3kgY29tZm9ydCcgICAgICAgICAgICAgfSxcbiAgICB7IGlkOidjb25jZXJ0JywgICAgICAgICBsYWJlbDonQ29uY2VydCBoYWxsJywgICAgICAgICAgICAgICAgICAgIGxvOjQwLCAgIGhpOjU1LCAgIG5vdGU6J2luc3RydW1lbnQgdHVuaW5nIHN0YWJpbGl0eScgICAgICAgIH0sXG4gICAgeyBpZDonbWVldGluZycsICAgICAgICAgbGFiZWw6J01lZXRpbmcgcm9vbScsICAgICAgICAgICAgICAgICAgICBsbzozMCwgICBoaTo2MCwgICBub3RlOidzbWFsbCBncm91cCBjb21mb3J0JyAgICAgICAgICAgICAgICB9LFxuICAgIHsgaWQ6J2V4aGliaXRpb24nLCAgICAgIGxhYmVsOidFeGhpYml0aW9uIGhhbGwnLCAgICAgICAgICAgICAgICAgbG86NDAsICAgaGk6NTUsICAgbm90ZTonbWl4ZWQgYXJ0IC8gYXJ0aWZhY3QgZGlzcGxheScgICAgICAgfSxcbl07XG5cbi8qIFJlYWwgcHN5IGNoYXJ0IOKAlCB1c2VzIHRoZSBTQU1FIGdldFcgKyBHSVZPTklfQ09MT1JTICsgcG9seWdvbiBtYXRoIGFzIHRoZVxuICogcHJvZHVjdGlvbiBkYXNoYm9hcmQuICBTb3VyY2Ugb2YgdHJ1dGg6ICBqcy9wc3ljaHJvbWV0cmljLmpzICBhbmQgdGhlXG4gKiByZW5kZXJHaXZvbmlPdmVybGF5KCkgYmxvY2sgYXQgYXBwLmpzOjE2NDEtMTcyMi5cbiAqIEFueXRoaW5nIHlvdSBjaGFuZ2UgaW4gdGhvc2UgZmlsZXMgTVVTVCBiZSBtaXJyb3JlZCBoZXJlLiAqL1xuZnVuY3Rpb24gUHN5U2tlbGV0b24oeyBjZmcgfSkge1xuICAgIC8qIENhbnZhcyArIHBhZGRpbmcgKi9cbiAgICBjb25zdCBXID0gNzYwLCBIID0gNDgwO1xuICAgIGNvbnN0IHBhZCA9IHsgbGVmdDogNTYsIHJpZ2h0OiA0MCwgdG9wOiAyOCwgYm90dG9tOiA1NiB9O1xuICAgIGNvbnN0IGdyaWRXID0gVyAtIHBhZC5sZWZ0IC0gcGFkLnJpZ2h0O1xuICAgIGNvbnN0IGdyaWRIID0gSCAtIHBhZC50b3AgIC0gcGFkLmJvdHRvbTtcblxuICAgIGNvbnN0IFRfTUlOID0gY2ZnLnRMbywgVF9NQVggPSBjZmcudEhpO1xuICAgIGNvbnN0IFdfTUlOID0gMCwgICAgICAgV19NQVggPSAwLjAzMDsgICAgICAgICAgLy8ga2cva2dcblxuICAgIC8qIGF4aXMgc2NhbGVzIC0tIG1hdGNoIHRoZSBsaXZlIGRhc2hib2FyZCAqL1xuICAgIGNvbnN0IHggID0gKHQpID0+IHBhZC5sZWZ0ICsgKCh0IC0gVF9NSU4pIC8gKFRfTUFYIC0gVF9NSU4pKSAqIGdyaWRXO1xuICAgIGNvbnN0IHkgID0gKHcpID0+IHBhZC50b3AgICsgKDEgLSAodyAtIFdfTUlOKSAvIChXX01BWCAtIFdfTUlOKSkgKiBncmlkSDtcbiAgICBjb25zdCBfZ2V0VyA9ICh0eXBlb2YgZ2V0VyA9PT0gJ2Z1bmN0aW9uJykgPyBnZXRXIDogKCh0LCByaCkgPT4gMCk7XG5cbiAgICBjb25zdCBzYWZlUHRzID0gKGFycikgPT4gYXJyLm1hcChwID0+IGAkeyh4KHBbMF0pfHwwKS50b0ZpeGVkKDIpfSwkeyh5KHBbMV0pfHwwKS50b0ZpeGVkKDIpfWApLmpvaW4oJyAnKTtcblxuICAgIC8qIC0tLS0gR2l2b25pIHBvbHlnb25zIC0tIENPUElFRCBWRVJCQVRJTSBmcm9tIGFwcC5qczoxNjQzLTE2NjkgLS0tLSAqL1xuICAgIGNvbnN0IHJoODAgPSBbXTsgZm9yIChsZXQgdD0yMDsgdDw9MjU7IHQrPTAuNSkgcmg4MC5wdXNoKFt0LCBfZ2V0Vyh0LCA4MCldKTtcbiAgICBjb25zdCByaDEwMD0gW107IGZvciAobGV0IHQ9MjA7IHQ8PTI3OyB0Kz0wLjUpIHJoMTAwLnB1c2goW3QsIF9nZXRXKHQsIDEwMCldKTtcbiAgICBjb25zdCByaDIwTGluZSA9IFtdOyBmb3IgKGxldCB0PTMyOyB0Pj0yMDsgdC09MC41KSByaDIwTGluZS5wdXNoKFt0LCBfZ2V0Vyh0LCAyMCldKTtcbiAgICBjb25zdCByaDIwX0NaICA9IFtdOyBmb3IgKGxldCB0PTI3OyB0Pj0yMDsgdC09MC41KSByaDIwX0NaLnB1c2goW3QsIF9nZXRXKHQsIDIwKV0pO1xuICAgIGNvbnN0IENaICAgPSBbLi4ucmg4MCwgWzI3LCBfZ2V0VygyNywgNTApXSwgWzI3LCBfZ2V0VygyNywgMjApXSwgLi4ucmgyMF9DWl07XG5cbiAgICBjb25zdCByaEhpX3RvcCA9IFtdOyBmb3IgKGxldCB0dD0yMDsgdHQ8PTI3OyB0dCs9MC41KSByaEhpX3RvcC5wdXNoKFt0dCwgX2dldFcodHQsIGNmZy5yaEhpKV0pO1xuICAgIGNvbnN0IHJoTG9fYm90ID0gW107IGZvciAobGV0IHR0PTI3OyB0dD49MjA7IHR0LT0wLjUpIHJoTG9fYm90LnB1c2goW3R0LCBfZ2V0Vyh0dCwgY2ZnLnJoTG8pXSk7XG4gICAgY29uc3QgU1dFRVQgPSBbLi4ucmhIaV90b3AsIC4uLnJoTG9fYm90XTtcblxuICAgIGNvbnN0IE5WICAgPSBbLi4ucmgxMDAsIFszMiwgMTUuNC8xMDAwXSwgWzMyLCA2LjIvMTAwMF0sIC4uLnJoMjBMaW5lXTtcbiAgICBjb25zdCBNYXNzID0gWy4uLnJoODAsIFszMywgMTYvMTAwMF0sIFszNywgX2dldFcoMzcsIDMwKV0sIFszNywgMy8xMDAwXSwgWzIwLCBfZ2V0VygyMCwgMjApXV07XG4gICAgY29uc3QgTUNWICA9IFsuLi5yaDgwLCBbNDAsIDE2LzEwMDBdLCBbNDQsIF9nZXRXKDQ0LCAyMCldLCBbNDQsIDMvMTAwMF0sIFsyMCwgX2dldFcoMjAsIDIwKV1dO1xuICAgIGNvbnN0IEVWQVAgPSBbLi4ucmg4MCwgWzI1LCAxNi8xMDAwXSwgWzM2LCBfZ2V0VygzNiwgMzApXSwgWzM5LCBfZ2V0VygzOSwgMjApXSxcbiAgICAgICAgICAgICAgICAgIFs0MSwgX2dldFcoNDEsIDEwKV0sIFs0MSwgMF0sIFsyNy4yLCAwXSwgWzIwLCBfZ2V0VygyMCwgMjApXV07XG5cbiAgICBjb25zdCB3aW50ZXJSSDgwID0gW107IGZvciAobGV0IHQ9MTg7IHQ8PTE5LjU7IHQrPTAuNSkgd2ludGVyUkg4MC5wdXNoKFt0LCBfZ2V0Vyh0LCA4MCldKTtcbiAgICBjb25zdCB3aW50ZXJSSDIwID0gW107IGZvciAobGV0IHQ9MTkuNTsgdD49MTg7IHQtPTAuNSkgd2ludGVyUkgyMC5wdXNoKFt0LCBfZ2V0Vyh0LCAyMCldKTtcbiAgICBjb25zdCBXSU5URVIgPSBbLi4ud2ludGVyUkg4MCwgLi4ud2ludGVyUkgyMF07XG5cbiAgICAvKiBSSCBpc29wbGV0aCBjdXJ2ZXMgZm9yIHRoZSBjaGFydCBncmlkICovXG4gICAgY29uc3QgaXNvcGxldGhzID0gWzIwLCA0MCwgNjAsIDgwLCAxMDBdO1xuXG4gICAgLyogVGhlbWUgcGFsZXR0ZSDigJQgZHJpdmVzIHRoZSBsaXZlIHByZXZpZXcgc28gdGhlIGRpbS9saWdodCBjb250cm9sc1xuICAgICAqIGhhdmUgdmlzaWJsZSBmZWVkYmFjayByaWdodCBvbiB0aGUgY2hhcnQuICBJbiBkaW0vZGFyayBtb2RlIHdlIGFsc29cbiAgICAgKiBhcHBseSBhIENTUyBicmlnaHRuZXNzIGZpbHRlciBtYXBwZWQgZnJvbSBjZmcuZGFya0xldmVsICgxLjUgLi4gMi44XG4gICAgICog4oaSIDAuNiAuLiAxLjQpIHNvIHRoZSB1c2VyIGNhbiBTRUUgdGhlIGJyaWdodG5lc3Mgc2xpZGVyIHdvcmtpbmcuICovXG4gICAgY29uc3QgaXNMaWdodCA9IGNmZy50aGVtZSA9PT0gJ2xpZ2h0JztcbiAgICBjb25zdCBwYWxldHRlID0gaXNMaWdodFxuICAgICAgICA/IHsgYmc6JyNmOGZhZmMnLCBncmlkOicjY2JkNWUxJywgdGljazonIzQ3NTU2OScsIGF4aXM6JyMxZTI5M2InLFxuICAgICAgICAgICAgcGFuZWxCZzoncmdiYSgyNDgsMjUwLDI1MiwwLjg1KScsIHBhbmVsQm9yZGVyOicjY2JkNWUxJyxcbiAgICAgICAgICAgIHBpbGxCZzonI2UyZThmMCcsIHBpbGxGZzonIzQ3NTU2OScsIG1ldGFGZzonIzY0NzQ4YicgfVxuICAgICAgICA6IHsgYmc6JyMwYjEyMjAnLCBncmlkOicjMWUyOTNiJywgdGljazonIzk0YTNiOCcsIGF4aXM6JyNjYmQ1ZTEnLFxuICAgICAgICAgICAgcGFuZWxCZzoncmdiYSgxNSwyMyw0MiwwLjYpJywgcGFuZWxCb3JkZXI6JyMxZTI5M2InLFxuICAgICAgICAgICAgcGlsbEJnOicjMWUyOTNiJywgcGlsbEZnOicjOTRhM2I4JywgbWV0YUZnOicjNjQ3NDhiJyB9O1xuICAgIGNvbnN0IGRpbUZpbHRlciA9IGlzTGlnaHRcbiAgICAgICAgPyAnbm9uZSdcbiAgICAgICAgOiBgYnJpZ2h0bmVzcygkeyhNYXRoLm1heCgxLjUsIE1hdGgubWluKDIuOCwgY2ZnLmRhcmtMZXZlbCB8fCAyLjApKSAvIDIuMCkudG9GaXhlZCgyKX0pYDtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm91bmRlZC0yeGwgcC00IGJvcmRlciB0cmFuc2l0aW9uLWNvbG9ycyBkdXJhdGlvbi0zMDBcIlxuICAgICAgICAgICAgIHN0eWxlPXt7YmFja2dyb3VuZDogcGFsZXR0ZS5wYW5lbEJnLCBib3JkZXJDb2xvcjogcGFsZXR0ZS5wYW5lbEJvcmRlcn19PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gbWItM1wiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInBpbGxcIiBzdHlsZT17e2JhY2tncm91bmQ6cGFsZXR0ZS5waWxsQmcsIGNvbG9yOnBhbGV0dGUucGlsbEZnfX0+UFNZQ0hST01FVFJJQyBDSEFSVCDCtyBsaXZlIHByZXZpZXc8L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1tb25vXCIgc3R5bGU9e3tjb2xvcjpwYWxldHRlLm1ldGFGZ319PntUX01JTn3CsEMg4oaSIHtUX01BWH3CsEMgIMK3ICB7Y2ZnLnJoTG994oCTe2NmZy5yaEhpfSUgUkg8L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxzdmcgdmlld0JveD17YDAgMCAke1d9ICR7SH1gfSBjbGFzc05hbWU9XCJ3LWZ1bGwgaC1hdXRvIHRyYW5zaXRpb24tW2ZpbHRlcl0gZHVyYXRpb24tMzAwXCJcbiAgICAgICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOiBwYWxldHRlLmJnLCBib3JkZXJSYWRpdXM6OCwgZmlsdGVyOiBkaW1GaWx0ZXJ9fT5cbiAgICAgICAgICAgICAgICB7LyogLS0tLSBncmlkOiB2ZXJ0aWNhbCBUIGxpbmVzLCBob3Jpem9udGFsIFcgbGluZXMgLS0tLSAqL31cbiAgICAgICAgICAgICAgICB7QXJyYXkuZnJvbSh7bGVuZ3RoOjExfSkubWFwKChfLGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdCA9IFRfTUlOICsgKGkvMTApICogKFRfTUFYIC0gVF9NSU4pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGcga2V5PXsndnQnK2l9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXt4KHQpfSB5MT17cGFkLnRvcH0geDI9e3godCl9IHkyPXtwYWQudG9wK2dyaWRIfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT17cGFsZXR0ZS5ncmlkfSBzdHJva2VXaWR0aD1cIjAuNlwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KHQpfSB5PXtwYWQudG9wK2dyaWRIKzE2fSBmb250U2l6ZT1cIjkuNVwiIGZpbGw9e3BhbGV0dGUudGlja31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCI+e3QudG9GaXhlZCgwKX08L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAge0FycmF5LmZyb20oe2xlbmd0aDo3fSkubWFwKChfLGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdyA9IFdfTUlOICsgKGkvNikgKiAoV19NQVggLSBXX01JTik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZyBrZXk9eydodycraX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3BhZC5sZWZ0fSB5MT17eSh3KX0geDI9e3BhZC5sZWZ0K2dyaWRXfSB5Mj17eSh3KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9e3BhbGV0dGUuZ3JpZH0gc3Ryb2tlV2lkdGg9XCIwLjZcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17cGFkLmxlZnQtOH0geT17eSh3KSszfSBmb250U2l6ZT1cIjkuNVwiIGZpbGw9e3BhbGV0dGUudGlja31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwiZW5kXCI+eyh3KjEwMDApLnRvRml4ZWQoMCl9PC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIHsvKiAtLS0tIFJIIGlzb3BsZXRocyAoY3VydmVzKSAtLS0tICovfVxuICAgICAgICAgICAgICAgIHtpc29wbGV0aHMubWFwKHJoID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHRzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHQgPSBUX01JTjsgdCA8PSBUX01BWDsgdCArPSAwLjUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHd3ID0gX2dldFcodCwgcmgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHd3ID49IFdfTUlOICYmIHd3IDw9IFdfTUFYKSBwdHMucHVzaChbdCwgd3ddKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGcga2V5PXsnaXNvJytyaH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlsaW5lIHBvaW50cz17c2FmZVB0cyhwdHMpfSBmaWxsPVwibm9uZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT17cmggPT09IDEwMCA/ICcjNjM2NmYxJyA6ICcjZWM0ODk5NTUnfSBzdHJva2VXaWR0aD1cIjAuOFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZURhc2hhcnJheT17cmggPT09IDEwMCA/ICcnIDogJzMsMyd9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cHRzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KHB0c1tNYXRoLmZsb29yKHB0cy5sZW5ndGgqMC42NSldWzBdKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeT17eShwdHNbTWF0aC5mbG9vcihwdHMubGVuZ3RoKjAuNjUpXVsxXSkgLSA0fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZT1cIjlcIiBmaWxsPVwiI2VjNDg5OTk5XCIgZm9udFdlaWdodD1cIjcwMFwiPntyaH0lPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG5cbiAgICAgICAgICAgICAgICB7LyogLS0tLSBHaXZvbmkgb3ZlcmxheSAoY29waWVkIHZlcmJhdGltIGZyb20gYXBwLmpzIHJlbmRlciBvcmRlcikgLS0tLSAqL31cbiAgICAgICAgICAgICAgICB7Y2ZnLmdpdm9uaSAmJiAoXG4gICAgICAgICAgICAgICAgICAgIDxnIGNsYXNzTmFtZT1cInBvaW50ZXItZXZlbnRzLW5vbmVcIiBvcGFjaXR5PVwiMC45XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17eCg0MCl9IHkxPXt5KDE2LzEwMDApfSB4Mj17eCg1MCl9IHkyPXt5KDE2LzEwMDApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiIzYzNjZmMVwiIHN0cm9rZVdpZHRoPVwiMS41XCIgc3Ryb2tlRGFzaGFycmF5PVwiNCw0XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3goNTApfSB5MT17eSgxNi8xMDAwKX0geDI9e3goNTApfSB5Mj17eSgwKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cIiM2MzY2ZjFcIiBzdHJva2VXaWR0aD1cIjEuNVwiIHN0cm9rZURhc2hhcnJheT1cIjQsNFwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXt4KDQxKX0geTE9e3koMCl9IHgyPXt4KDUwKX0geTI9e3koMCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCIjNjM2NmYxXCIgc3Ryb2tlV2lkdGg9XCIxLjVcIiBzdHJva2VEYXNoYXJyYXk9XCI0LDRcIi8+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhNQ1YpfSAgZmlsbD1cIiNlYzQ4OTlcIiBmaWxsT3BhY2l0eT1cIjAuMDVcIiBzdHJva2U9XCIjZWM0ODk5XCIgc3Ryb2tlV2lkdGg9XCIxXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKE1hc3MpfSBmaWxsPVwiIzhiNWNmNlwiIGZpbGxPcGFjaXR5PVwiMC4wNVwiIHN0cm9rZT1cIiM4YjVjZjZcIiBzdHJva2VXaWR0aD1cIjFcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoRVZBUCl9IGZpbGw9XCIjMDZiNmQ0XCIgZmlsbE9wYWNpdHk9XCIwLjA4XCIgc3Ryb2tlPVwiIzA2YjZkNFwiIHN0cm9rZVdpZHRoPVwiMVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhOVil9ICAgZmlsbD1cIiNmNTllMGJcIiBmaWxsT3BhY2l0eT1cIjAuMDVcIiBzdHJva2U9XCIjZjU5ZTBiXCIgc3Ryb2tlV2lkdGg9XCIxXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKENaKX0gICBmaWxsPVwiIzEwYjk4MVwiIGZpbGxPcGFjaXR5PVwiMC4xNVwiIHN0cm9rZT1cIiMxMGI5ODFcIiBzdHJva2VXaWR0aD1cIjEuMlwiLz5cblxuICAgICAgICAgICAgICAgICAgICAgICAgey8qIFN3ZWV0LXNwb3QgYmFuZCwgY2xpcHBlZCB0byBDWiAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkZWZzPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjbGlwUGF0aCBpZD1cImN6LWNsaXAtd2Fsa1wiIGNsaXBQYXRoVW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoQ1opfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9jbGlwUGF0aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGVmcz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhTV0VFVCl9IGNsaXBQYXRoPVwidXJsKCNjei1jbGlwLXdhbGspXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw9XCIjMDU5NjY5XCIgZmlsbE9wYWNpdHk9XCIwLjMyXCIgc3Ryb2tlPVwiIzA0Nzg1N1wiIHN0cm9rZVdpZHRoPVwiMC44XCIgc3Ryb2tlRGFzaGFycmF5PVwiMywyXCIvPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoV0lOVEVSKX0gZmlsbD1cIiMzYjgyZjZcIiBmaWxsT3BhY2l0eT1cIjAuMTVcIiBzdHJva2U9XCJub25lXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3goMTkpfSB5MT17cGFkLnRvcCsxOH0geDI9e3goMTkpfSB5Mj17cGFkLnRvcCtncmlkSH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cIiMzYjgyZjZcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VEYXNoYXJyYXk9XCI2LDRcIiBvcGFjaXR5PVwiMC44XCIvPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICB7LyogUmVnaW9uIGxhYmVscyDigJQgc2FtZSBjb2xvcnMgJiBzcGlyaXQgYXMgbGl2ZSBjaGFydCAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goNTApLTEwfSB5PXt5KDgvMTAwMCl9IGZpbGw9XCIjNjM2NmYxXCIgZm9udFNpemU9XCIxMFwiIGZvbnRXZWlnaHQ9XCI5MDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIHRyYW5zZm9ybT17YHJvdGF0ZSgtOTAsICR7eCg1MCktMTB9LCAke3koOC8xMDAwKX0pYH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc9XCIyXCI+TUVDSEFOSUNBTCBDT09MSU5HPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCg0NCktMn0geT17eSg4LzEwMDApfSBmaWxsPVwiI2VjNDg5OVwiIGZvbnRTaXplPVwiOVwiIGZvbnRXZWlnaHQ9XCI5MDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIHRyYW5zZm9ybT17YHJvdGF0ZSgtOTAsICR7eCg0NCktMn0sICR7eSg4LzEwMDApfSlgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZz1cIjEuNVwiPk1BU1MgQ09PTElORzwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goMzcpLTEwfSB5PXt5KDgvMTAwMCl9IGZpbGw9XCIjOGI1Y2Y2XCIgZm9udFNpemU9XCI5XCIgZm9udFdlaWdodD1cIjkwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgdHJhbnNmb3JtPXtgcm90YXRlKC05MCwgJHt4KDM3KS0xMH0sICR7eSg4LzEwMDApfSlgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZz1cIjEuNVwiPk1BU1MgQ09PTElORzwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goMzQpfSB5PXt5KDAuNS8xMDAwKS04fSBmaWxsPVwiIzA2YjZkNFwiIGZvbnRTaXplPVwiOVwiIGZvbnRXZWlnaHQ9XCI5MDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGxldHRlclNwYWNpbmc9XCIyXCI+RVZBUE9SQVRJVkU8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDIzLjUpfSB5PXt5KF9nZXRXKDIzLjUsIDQ1KSl9IGZpbGw9XCIjMTBiOTgxXCIgZm9udFNpemU9XCIxMVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0PVwiOTAwXCIgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGxldHRlclNwYWNpbmc9XCIxLjVcIj5DT01GT1JUPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCgxOC43NSl9IHk9e3koX2dldFcoMTguNzUsIDQ1KSl9IGZpbGw9XCIjM2I4MmY2XCIgZm9udFNpemU9XCIxMVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0PVwiOTAwXCIgdGV4dEFuY2hvcj1cIm1pZGRsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm09e2Byb3RhdGUoLTkwLCAke3goMTguNzUpfSwgJHt5KF9nZXRXKDE4Ljc1LCA0NSkpfSlgfT5XSU5URVI8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDIzLjUpfSB5PXt5KF9nZXRXKDIzLjUsIChjZmcucmhMbytjZmcucmhIaSkvMikpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbD1cIiMwMjJjMjJcIiBmb250U2l6ZT1cIjhcIiBmb250V2VpZ2h0PVwiOTAwXCIgdGV4dEFuY2hvcj1cIm1pZGRsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e3BhaW50T3JkZXI6J3N0cm9rZScsIHN0cm9rZTonI2E3ZjNkMCcsIHN0cm9rZVdpZHRoOicyLjVweCcsIHN0cm9rZUxpbmVqb2luOidyb3VuZCd9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZz1cIjEuNVwiPntjZmcucmhMb30te2NmZy5yaEhpfSUgUkg8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICApfVxuXG4gICAgICAgICAgICAgICAgey8qIGF4aXMgbGFiZWxzICovfVxuICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3BhZC5sZWZ0ICsgZ3JpZFcvMn0geT17SC0xMn0gZm9udFNpemU9XCIxMVwiIGZpbGw9e3BhbGV0dGUuYXhpc31cbiAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgZm9udFdlaWdodD1cIjgwMFwiIGxldHRlclNwYWNpbmc9XCIyXCI+RFJZIEJVTEIgVEVNUCAowrBDKTwvdGV4dD5cbiAgICAgICAgICAgICAgICA8dGV4dCB4PXsxNn0geT17cGFkLnRvcCArIGdyaWRILzJ9IGZvbnRTaXplPVwiMTFcIiBmaWxsPXtwYWxldHRlLmF4aXN9XG4gICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGZvbnRXZWlnaHQ9XCI4MDBcIiBsZXR0ZXJTcGFjaW5nPVwiMlwiXG4gICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtPXtgcm90YXRlKC05MCAxNiAke3BhZC50b3AgKyBncmlkSC8yfSlgfT5IVU1JRElUWSBSQVRJTyAoZy9rZyk8L3RleHQ+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuZnVuY3Rpb24gUHN5Q29udHJvbFBhbmVsKHsgY2ZnLCB1cGRhdGUsIHNldENmZyB9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1zbGF0ZS05MDAvNjAgYm9yZGVyIGJvcmRlci1zbGF0ZS04MDAgcm91bmRlZC0yeGwgcC01IHNwYWNlLXktNlwiPlxuICAgICAgICAgICAgey8qIFRoZW1lICsgYnJpZ2h0bmVzcyAgLS0gcmVsb2NhdGVkIGZyb20gdGhlIGRhc2hib2FyZCBzaWRlYmFyIDIwMjYtMDYtMjUuXG4gICAgICAgICAgICAgICAgVHdvIGNvbnRyb2xzOiBEYXJrL0xpZ2h0IG1vZGUgdG9nZ2xlLCBhbmQgQnJpZ2h0bmVzcyBzbGlkZXIgKG9ubHlcbiAgICAgICAgICAgICAgICBtZWFuaW5nZnVsIGluIGRhcmsgbW9kZSkuICBMaXZlIHByZXZpZXcgYXBwbGllcyB0byB0aGUgc3Vycm91bmRpbmdcbiAgICAgICAgICAgICAgICBjb250cm9sIHBhbmVsIHNvIHRoZSBvcGVyYXRvciBjYW4gRkVFTCB0aGUgY2hhbmdlIGJlZm9yZSBzYXZpbmcuICovfVxuICAgICAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cInBzeS1jZmctdGhlbWUtYmxvY2tcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj5EaXNwbGF5IE1vZGU8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTIgbWItM1wiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwicHN5LWNmZy10aGVtZS1kYXJrXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIHRoZW1lOidkYXJrJywgZGFya0xldmVsOk1hdGgubWluKGMuZGFya0xldmVsIHx8IDIuMCwgMi42KX0pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweS0yLjUgcm91bmRlZC1sZyB0ZXh0LXhzIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBib3JkZXIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjZmcudGhlbWUgPT09ICdkYXJrJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctc2xhdGUtODAwIGJvcmRlci15ZWxsb3ctNTAwLzcwIHRleHQteWVsbG93LTMwMCBzaGFkb3ctbGcgc2hhZG93LXllbGxvdy01MDAvMTAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1zbGF0ZS05MDAvMzAgYm9yZGVyLXNsYXRlLTcwMCB0ZXh0LXNsYXRlLTUwMCBob3ZlcjpiZy1zbGF0ZS04MDAvNjAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAg8J+MmSAgRGltIC8gRGFya1xuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cInBzeS1jZmctdGhlbWUtbGlnaHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldENmZyhjID0+ICh7Li4uYywgdGhlbWU6J2xpZ2h0JywgZGFya0xldmVsOjMuMH0pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweS0yLjUgcm91bmRlZC1sZyB0ZXh0LXhzIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBib3JkZXIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjZmcudGhlbWUgPT09ICdsaWdodCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLXNsYXRlLTEwMCBib3JkZXItc2t5LTUwMC83MCB0ZXh0LXNreS03MDAgc2hhZG93LWxnIHNoYWRvdy1za3ktNTAwLzEwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctc2xhdGUtOTAwLzMwIGJvcmRlci1zbGF0ZS03MDAgdGV4dC1zbGF0ZS01MDAgaG92ZXI6Ymctc2xhdGUtODAwLzYwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIOKYgCAgTGlnaHRcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgey8qIEJyaWdodG5lc3Mgc2xpZGVyIOKAlCBvbmx5IG1lYW5pbmdmdWwgd2hlbiB0aGVtZSA9PT0gJ2RhcmsnICovfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjZmcudGhlbWUgPT09ICdsaWdodCcgPyAnb3BhY2l0eS00MCBwb2ludGVyLWV2ZW50cy1ub25lJyA6ICcnfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gbWItMVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwXCI+RGltIGJyaWdodG5lc3M8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1tb25vIHRleHQteWVsbG93LTMwMCB0YWJ1bGFyLW51bXNcIj57TWF0aC5yb3VuZCgoY2ZnLmRhcmtMZXZlbCB8fCAyLjApICogMTAwKX0lPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cInBzeS1jZmctZGFyay1sZXZlbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBtaW49XCIxLjVcIiBtYXg9XCIyLjhcIiBzdGVwPVwiMC4wMlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Y2ZnLnRoZW1lID09PSAnbGlnaHQnID8gMi4wIDogKGNmZy5kYXJrTGV2ZWwgfHwgMi4wKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0Q2ZnKGMgPT4gKHsuLi5jLCBkYXJrTGV2ZWw6IHBhcnNlRmxvYXQoZS50YXJnZXQudmFsdWUpLCB0aGVtZTonZGFyayd9KSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyYW5nZS1pbnB1dCB3LWZ1bGxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgYWNjZW50Q29sb3I6JyNmYWNjMTUnIH19Lz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0yIGl0YWxpY1wiPlxuICAgICAgICAgICAgICAgICAgICBBcHBsaWVkIHRvIHRoZSB3aG9sZSBkYXNoYm9hcmQuICBEaW0gaXMgcmVjb21tZW5kZWQgZm9yIGNvbnRyb2wgcm9vbXM7IExpZ2h0IGZvciBkYXl0aW1lIHdhbGstdGhyb3VnaHMuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBHaXZvbmkgdG9nZ2xlICovfVxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj5HaXZvbmkgRW5naW5lPC9kaXY+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB1cGRhdGUoJ2dpdm9uaScsICFjZmcuZ2l2b25pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHctZnVsbCBweS0zIHJvdW5kZWQteGwgdGV4dC1zbSBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Y2ZnLmdpdm9uaVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLWluZGlnby02MDAgdGV4dC13aGl0ZSBzaGFkb3ctbGcgc2hhZG93LWluZGlnby01MDAvMzAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctc2xhdGUtODAwIHRleHQtc2xhdGUtNDAwIGJvcmRlciBib3JkZXItc2xhdGUtNzAwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAge2NmZy5naXZvbmkgPyAnR2l2b25pIE9OJyA6ICdHaXZvbmkgT0ZGJ31cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0yIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgICAgICBPdmVybGF5cyB0aGUgNCBjbGltYXRlLXN0cmF0ZWd5IHJlZ2lvbnMgKENvbWZvcnQsIE5hdCBWZW50LCBFdmFwLCBNZWNoIENvb2wpLlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogUkggcmFuZ2UgKi99XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMlwiPlJIIFN3ZWV0LVNwb3QgUmFuZ2U8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwIG1iLTEgYmxvY2tcIj5WZW51ZSBwcmVzZXQ8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0IGN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Y2ZnLnJoUHJlc2V0IHx8ICdjdXN0b20nfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwID0gUkhfUFJFU0VUUy5maW5kKHAgPT4gcC5pZCA9PT0gZS50YXJnZXQudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXApIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHAuaWQgPT09ICdjdXN0b20nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGUoJ3JoUHJlc2V0JywgJ2N1c3RvbScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCByaFByZXNldDpwLmlkLCByaExvOnAubG8sIHJoSGk6cC5oaX0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAge1JIX1BSRVNFVFMubWFwKHAgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtwLmlkfSB2YWx1ZT17cC5pZH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtwLmxhYmVsfXtwLmxvICE9IG51bGwgPyBgICDCtyAgJHtwLmxvfS0ke3AuaGl9JSBSSGAgOiAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgeygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwID0gUkhfUFJFU0VUUy5maW5kKHggPT4geC5pZCA9PT0gKGNmZy5yaFByZXNldCB8fCAnY3VzdG9tJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHAgJiYgcC5ub3RlID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTEuNSBpdGFsaWNcIj57cC5ub3RlfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICkgOiBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9KSgpfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTMgbWItMlwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtbW9ubyB0ZXh0LXNsYXRlLTQwMCB3LTEwXCI+e2NmZy5yaExvfSU8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49XCIyMFwiIG1heD17Y2ZnLnJoSGktNX0gdmFsdWU9e2NmZy5yaExvfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIHJoTG86K2UudGFyZ2V0LnZhbHVlLCByaFByZXNldDonY3VzdG9tJ30pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLWlucHV0IGZsZXgtMVwiLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1tb25vIHRleHQtc2xhdGUtNDAwIHctMTBcIj57Y2ZnLnJoSGl9JTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj17Y2ZnLnJoTG8rNX0gbWF4PVwiOTBcIiB2YWx1ZT17Y2ZnLnJoSGl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldENmZyhjID0+ICh7Li4uYywgcmhIaTorZS50YXJnZXQudmFsdWUsIHJoUHJlc2V0OidjdXN0b20nfSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2UtaW5wdXQgZmxleC0xXCIvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBBeGlzIHJhbmdlICovfVxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj5UZW1wZXJhdHVyZSBBeGlzIFJhbmdlPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMyBtYi0yXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1tb25vIHRleHQtc2xhdGUtNDAwIHctMTBcIj57Y2ZnLnRMb33CsDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj1cIi00MFwiIG1heD17Y2ZnLnRIaS0xMH0gdmFsdWU9e2NmZy50TG99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZSgndExvJywgK2UudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLWlucHV0IGZsZXgtMVwiLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1tb25vIHRleHQtc2xhdGUtNDAwIHctMTBcIj57Y2ZnLnRIaX3CsDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj17Y2ZnLnRMbysxMH0gbWF4PVwiNjBcIiB2YWx1ZT17Y2ZnLnRIaX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlKCd0SGknLCArZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2UtaW5wdXQgZmxleC0xXCIvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTIgbGVhZGluZy1yZWxheGVkXCI+XG4gICAgICAgICAgICAgICAgICAgIENoYXJ0IHdpbGwgYmUgcmVkcmF3biB3aXRoIHRoaXMgZHJ5LWJ1bGIgdGVtcGVyYXR1cmUgd2luZG93LlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvcmRlci10IGJvcmRlci1zbGF0ZS04MDAgcHQtNFwiPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgICAgICBDaGFuZ2VzIHByZXZpZXcgbGl2ZSBpbiB0aGUgc2tlbGV0b24gY2hhcnQgb24gdGhlIGxlZnQuICBIaXRcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1pbmRpZ28tNDAwIGZvbnQtYmxhY2tcIj4gU2F2ZSAmIHJldHVybiA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIGluIHRoZSBoZWFkZXIgd2hlbiB5b3UncmUgaGFwcHkuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIExvY2F0aW9uIFNldHRpbmcgLS0gbW9kYWwgdy8gaW50ZXJhY3RpdmUgTGVhZmxldCBtYXAgKyByZXZlcnNlIGdlb2NvZGluZ1xuICogQ2xpY2sgYW55d2hlcmUgb24gdGhlIG1hcCAob3IgZHJhZyB0aGUgbWFya2VyKSB0byBzZXQgbGF0L2xvbi5cbiAqIE1hbnVhbCBsYXQvbG9uIGVkaXRzIHJlLWNlbnRyZSB0aGUgbWFya2VyLiAgQ2l0eSBuYW1lIGlzIGF1dG8tcG9wdWxhdGVkXG4gKiB2aWEgT3BlblN0cmVldE1hcCBOb21pbmF0aW0gKG5vIGtleSByZXF1aXJlZCwgcmF0ZS1saW1pdGVkIHRvIH4xIHJlcS9zKS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyogRGUtZHVwICsgc2FuaXR5LWNoZWNrIGEgcmF3IHNhdmVkLWxvY2F0aW9ucyBhcnJheSAoZnJvbSBzZXJ2ZXIgb3JcbiAqIGxvY2FsU3RvcmFnZSkuICBEZWR1cCBrZXkgaXMgYGxhdC50b0ZpeGVkKDQpLGxvbi50b0ZpeGVkKDQpYCAtLSB0aGVcbiAqIFNBTUUga2V5IHRoZSBkYXNoYm9hcmQncyB3ZWF0aGVyLXNldHRpbmdzLW1vZGFsLmpzIHVzZXMgLS0gc28gdGhlXG4gKiBTZXR1cCBXYWxrIGRyb3Bkb3duIHNob3dzIHRoZSBleGFjdCBzYW1lIHNldCB0aGUgb3BlcmF0b3Igc2VlcyBpblxuICogdGhlIGRhc2hib2FyZCdzIDNELVd4IFdlYXRoZXIgYnV0dG9uLiAgVHdvIGVudHJpZXMgdGhhdCBzaGFyZSBhIG5hbWVcbiAqIChlLmcuIFwiSE9NRVwiIGF0IHRoZSBvZmZpY2UgYW5kIFwiSE9NRVwiIGF0IHRoZSBhcGFydG1lbnQpIGJ1dCBoYXZlXG4gKiBkaWZmZXJlbnQgY29vcmRpbmF0ZXMgYXJlIEJPVEgga2VwdDsgb25seSB0cnVlIGNvb3JkIGR1cGxpY2F0ZXMgYXJlXG4gKiBjb2xsYXBzZWQuICBEcm9wcyBlbnRyaWVzIG1pc3NpbmcgYSBuYW1lIG9yIHdpdGggbm9uLWZpbml0ZSBsYXQvbG9uLiAqL1xuZnVuY3Rpb24gX25vcm1hbGl6ZUxvY3MoYXJyKSB7XG4gICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQoKTtcbiAgICBjb25zdCBvdXQgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGwgb2YgKGFyciB8fCBbXSkpIHtcbiAgICAgICAgaWYgKCFsIHx8IHR5cGVvZiBsLm5hbWUgIT09ICdzdHJpbmcnKSBjb250aW51ZTtcbiAgICAgICAgY29uc3QgbGF0ID0gK2wubGF0LCBsb24gPSArbC5sb247XG4gICAgICAgIGlmICghTnVtYmVyLmlzRmluaXRlKGxhdCkgfHwgIU51bWJlci5pc0Zpbml0ZShsb24pKSBjb250aW51ZTtcbiAgICAgICAgY29uc3QgbmFtZSA9IGwubmFtZS50cmltKCk7XG4gICAgICAgIGlmICghbmFtZSkgY29udGludWU7XG4gICAgICAgIGNvbnN0IGtleSA9IGxhdC50b0ZpeGVkKDQpICsgJywnICsgbG9uLnRvRml4ZWQoNCk7XG4gICAgICAgIGlmIChzZWVuLmhhcyhrZXkpKSBjb250aW51ZTtcbiAgICAgICAgc2Vlbi5hZGQoa2V5KTtcbiAgICAgICAgb3V0LnB1c2goeyBuYW1lLCBsYXQsIGxvbiB9KTtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gTG9jYXRpb25Nb2RhbCh7IGNmZywgc2V0Q2ZnLCBvbkNsb3NlLCBvblNhdmUgfSkge1xuICAgIGNvbnN0IG1hcEJveFJlZiA9IFJlYWN0LnVzZVJlZihudWxsKTtcbiAgICBjb25zdCBtYXBSZWYgICAgPSBSZWFjdC51c2VSZWYobnVsbCk7XG4gICAgY29uc3QgbWFya2VyUmVmID0gUmVhY3QudXNlUmVmKG51bGwpO1xuICAgIGNvbnN0IFtnZW9CdXN5LCBzZXRHZW9CdXN5XSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcblxuICAgIC8qIC0tLS0tIHNhdmVkIGxvY2F0aW9ucyAtLSBtaXJyb3Igd2hhdCB0aGUgRGFzaGJvYXJkJ3MgV2VhdGhlciBidXR0b24gc2hvd3MuXG4gICAgICpcbiAgICAgKiBUaGUgZGFzaGJvYXJkIHJlYWRzIHRoZW0gZnJvbSBgJHtBUElfVVJMfS9hcGkvd2VhdGhlci1sb2NhdGlvbmAnc1xuICAgICAqIGBzYXZlZGAgYXJyYXkgYW5kIG1pcnJvcnMgdGhhdCBpbnRvIGxvY2FsU3RvcmFnZVsnc2F2ZWRXZWF0aGVyTG9jYXRpb25zJ11cbiAgICAgKiBvbiBtb3VudCAoc2VlIHB1YmxpYy9qcy9kYXNoYm9hcmQvYXBwLmpzI2h5ZHJhdGVXZWF0aGVyU3RhdGUpLiAgV2UgZG9cbiAgICAgKiB0aGUgU0FNRSB0aGluZyBoZXJlIHNvIHRoZSBTZXR1cCBXYWxrJ3MgU2l0ZS1uYW1lIGRyb3Bkb3duIHN0YXlzXG4gICAgICogYnl0ZS1pZGVudGljYWwgd2l0aCB0aGUgZGFzaGJvYXJkJ3MgbG9jYXRpb24gbGlzdCAtLSBpbmNsdWRpbmcgd2hlbiB0aGVcbiAgICAgKiBvcGVyYXRvciB2aXNpdHMgU2V0dXAgV2FsayBCRUZPUkUgZXZlciBvcGVuaW5nIHRoZSBkYXNoYm9hcmQgKGZyZXNoXG4gICAgICogZGV2aWNlIGNhc2Ugd2hlcmUgbG9jYWxTdG9yYWdlIGlzIGVtcHR5KS5cbiAgICAgKlxuICAgICAqIFN0cmF0ZWd5OlxuICAgICAqICAgMSkgUmVhZCBsb2NhbFN0b3JhZ2UgZmlyc3QgKGluc3RhbnQsIG5vIGZsaWNrZXIgaWYgYWxyZWFkeSBoeWRyYXRlZCkuXG4gICAgICogICAyKSBUaGVuIEdFVCAvYXBpL3dlYXRoZXItbG9jYXRpb24gKGNhbm9uaWNhbCwgY3Jvc3MtZGV2aWNlIHNvdXJjZSkuXG4gICAgICogICAzKSBXaGljaGV2ZXIgaXMgbm9uLWVtcHR5IHdpbnM7IHNlcnZlciB3aW5zIHRpZXMuXG4gICAgICpcbiAgICAgKiBGcmVlLWZvcm0gdHlwaW5nIGluIHRoZSBpbnB1dCBzdGlsbCB3b3JrcyAtLSB0aGUgZGF0YWxpc3QgaXMgc3VnZ2VzdGlvblxuICAgICAqIG9ubHksIHRoZSBpbnB1dCBuZXZlciByZXN0cmljdHMgdGhlIHZhbHVlLiAqL1xuICAgIGNvbnN0IFtzYXZlZExvY3MsIHNldFNhdmVkTG9jc10gPSBSZWFjdC51c2VTdGF0ZSgoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByYXcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2F2ZWRXZWF0aGVyTG9jYXRpb25zJyk7XG4gICAgICAgICAgICBpZiAoIXJhdykgcmV0dXJuIFtdO1xuICAgICAgICAgICAgY29uc3QgYXJyID0gSlNPTi5wYXJzZShyYXcpO1xuICAgICAgICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXJyKSA/IF9ub3JtYWxpemVMb2NzKGFycikgOiBbXTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyByZXR1cm4gW107IH1cbiAgICB9KTtcbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBsZXQgY2FuY2VsbGVkID0gZmFsc2U7XG4gICAgICAgIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCgnL2FwaS93ZWF0aGVyLWxvY2F0aW9uJywgeyBjcmVkZW50aWFsczonaW5jbHVkZScsIGNhY2hlOiduby1zdG9yZScgfSk7XG4gICAgICAgICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm47XG4gICAgICAgICAgICAgICAgY29uc3QgaiA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNhdmVkID0gX25vcm1hbGl6ZUxvY3MoQXJyYXkuaXNBcnJheShqLnNhdmVkKSA/IGouc2F2ZWQgOiBbXSk7XG4gICAgICAgICAgICAgICAgaWYgKGNhbmNlbGxlZCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGlmIChzYXZlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFNhdmVkTG9jcyhzYXZlZCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIE1pcnJvciB0byBsb2NhbFN0b3JhZ2Ugc28gdGhlIGRhc2hib2FyZCBzZWVzIHRoZSBzYW1lIGxpc3RcbiAgICAgICAgICAgICAgICAgICAgLy8gZXZlbiBpZiBpdHMgb3duIGh5ZHJhdGUgaGFzbid0IHJ1biB5ZXQgdGhpcyBzZXNzaW9uLlxuICAgICAgICAgICAgICAgICAgICB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc2F2ZWRXZWF0aGVyTG9jYXRpb25zJywgSlNPTi5zdHJpbmdpZnkoc2F2ZWQpKTsgfSBjYXRjaCAoZSkge31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7IC8qIG9mZmxpbmUgLT4gbG9jYWxTdG9yYWdlIHZhbHVlIGFscmVhZHkgaW4gc3RhdGUgKi8gfVxuICAgICAgICB9KSgpO1xuICAgICAgICByZXR1cm4gKCkgPT4geyBjYW5jZWxsZWQgPSB0cnVlOyB9O1xuICAgIH0sIFtdKTtcblxuICAgIC8qIC0tLS0tIHNhdmVkLWxvY2F0aW9ucyBkcm9wZG93biBvcGVuL2Nsb3NlIHN0YXRlLlxuICAgICAqIE5hdGl2ZSA8ZGF0YWxpc3Q+IGhpZGVzIGl0cyBjaGV2cm9uIGluIG1vc3QgYnJvd3NlcnMgKGVzcGVjaWFsbHkgaW5cbiAgICAgKiBhIGRhcmsgdGhlbWUpLCB3aGljaCBtYWRlIHRoZSBcImRyb3AgZG93blwiIGludmlzaWJsZSB0byBvcGVyYXRvcnNcbiAgICAgKiB3aG8gY2xlYXJseSBoYWQgbXVsdGlwbGUgc2F2ZWQgbG9jYXRpb25zLiAgUmVwbGFjZWQgd2l0aCBhIGN1c3RvbVxuICAgICAqIHBvcGRvd24gcGFuZWwgdGhhdCBoYXMgYW4gQUxXQVlTLVZJU0lCTEUgY2hldnJvbiBidXR0b24gLS0gY2xpY2sgaXRcbiAgICAgKiB0byB0b2dnbGUsIGNsaWNrIG91dHNpZGUgdG8gZGlzbWlzcy4gKi9cbiAgICBjb25zdCBbc2F2ZWRPcGVuLCBzZXRTYXZlZE9wZW5dID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IHNhdmVkUmVmID0gUmVhY3QudXNlUmVmKG51bGwpO1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmICghc2F2ZWRPcGVuKSByZXR1cm47XG4gICAgICAgIGNvbnN0IG9uRG9jQ2xpY2sgPSAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHNhdmVkUmVmLmN1cnJlbnQgJiYgIXNhdmVkUmVmLmN1cnJlbnQuY29udGFpbnMoZS50YXJnZXQpKSBzZXRTYXZlZE9wZW4oZmFsc2UpO1xuICAgICAgICB9O1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKTtcbiAgICAgICAgcmV0dXJuICgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spO1xuICAgIH0sIFtzYXZlZE9wZW5dKTtcblxuICAgIC8qIFdoZW4gdGhlIHVzZXIgcGlja3MgYSBuYW1lIGZyb20gdGhlIGRyb3Bkb3duIE9SIHR5cGVzIG9uZSB0aGF0XG4gICAgICogZXhhY3RseSBtYXRjaGVzIGEgc2F2ZWQgZW50cnksIHB1bGwgaXRzIGxhdC9sb24gYW5kIHJlY2VudHJlIHRoZVxuICAgICAqIG1hcC4gIEZyZWUtZm9ybSB0eXBpbmcgc3RpbGwgd29ya3MgLS0gdGhlIG5hbWUgaXMganVzdCBrZXB0IGFzIHRoZVxuICAgICAqIHNpdGUgbGFiZWwuICBBdm9pZHMgc3VycHJpc2luZyB0aGUgb3BlcmF0b3Igd2hvIHR5cGVzIFwiUGF2aWxpb24gQlwiXG4gICAgICogKGEgbGFiZWwgdGhleSBpbnZlbnRlZCkgYW5kIGV4cGVjdHMgdGhlIG1hcCBOT1QgdG8ganVtcC4gKi9cbiAgICBjb25zdCBvblNpdGVOYW1lQ2hhbmdlID0gKG5ld05hbWUpID0+IHtcbiAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBzaXRlTmFtZTpuZXdOYW1lfSkpO1xuICAgICAgICBjb25zdCBoaXQgPSBzYXZlZExvY3MuZmluZChzID0+IHMubmFtZSA9PT0gbmV3TmFtZSk7XG4gICAgICAgIGlmIChoaXQpIHtcbiAgICAgICAgICAgIGNvbnN0IGxhdCA9IE1hdGgucm91bmQoaGl0LmxhdCAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICAgICAgY29uc3QgbG9uID0gTWF0aC5yb3VuZChoaXQubG9uICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIHNpdGVOYW1lOm5ld05hbWUsIGxhdCwgbG9uLCBjaXR5Om5ld05hbWV9KSk7XG4gICAgICAgICAgICBpZiAobWFwUmVmLmN1cnJlbnQpIG1hcFJlZi5jdXJyZW50LnNldFZpZXcoW2xhdCwgbG9uXSwgMTEpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBwaWNrU2F2ZWRMb2MgPSAobG9jKSA9PiB7XG4gICAgICAgIHNldFNhdmVkT3BlbihmYWxzZSk7XG4gICAgICAgIG9uU2l0ZU5hbWVDaGFuZ2UobG9jLm5hbWUpO1xuICAgIH07XG5cbiAgICAvKiAtLS0tLSBzZWFyY2ggc3RhdGUgLS0tLS0gKi9cbiAgICBjb25zdCBbc2VhcmNoUSwgc2V0U2VhcmNoUV0gICAgICAgICA9IFJlYWN0LnVzZVN0YXRlKCcnKTtcbiAgICBjb25zdCBbc2VhcmNoSGl0cywgc2V0U2VhcmNoSGl0c10gICA9IFJlYWN0LnVzZVN0YXRlKFtdKTtcbiAgICBjb25zdCBbc2VhcmNoQnVzeSwgc2V0U2VhcmNoQnVzeV0gICA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBbc2VhcmNoT3Blbiwgc2V0U2VhcmNoT3Blbl0gICA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBzZWFyY2hEZWJvdW5jZVJlZiAgICAgICAgICAgICA9IFJlYWN0LnVzZVJlZihudWxsKTtcblxuICAgIC8qIEZvcndhcmQtZ2VvY29kZTogcXVlcnkgLT4gW3tsYXQsIGxvbiwgZGlzcGxheV9uYW1lLCB0eXBlLCAuLi59XSAqL1xuICAgIGNvbnN0IHJ1blNlYXJjaCA9IGFzeW5jIChxKSA9PiB7XG4gICAgICAgIGlmICghcSB8fCBxLnRyaW0oKS5sZW5ndGggPCAzKSB7IHNldFNlYXJjaEhpdHMoW10pOyByZXR1cm47IH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNldFNlYXJjaEJ1c3kodHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBgaHR0cHM6Ly9ub21pbmF0aW0ub3BlbnN0cmVldG1hcC5vcmcvc2VhcmNoP2Zvcm1hdD1qc29uJmxpbWl0PTYmcT0ke2VuY29kZVVSSUNvbXBvbmVudChxKX1gO1xuICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwgeyBoZWFkZXJzOnsgJ0FjY2VwdCc6J2FwcGxpY2F0aW9uL2pzb24nIH0gfSk7XG4gICAgICAgICAgICBjb25zdCBqID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgICBzZXRTZWFyY2hIaXRzKEFycmF5LmlzQXJyYXkoaikgPyBqIDogW10pO1xuICAgICAgICAgICAgc2V0U2VhcmNoT3Blbih0cnVlKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBzZXRTZWFyY2hIaXRzKFtdKTsgfVxuICAgICAgICBmaW5hbGx5IHsgc2V0U2VhcmNoQnVzeShmYWxzZSk7IH1cbiAgICB9O1xuXG4gICAgLyogZGVib3VuY2VkIHNlYXJjaC1vbi10eXBlICovXG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKHNlYXJjaERlYm91bmNlUmVmLmN1cnJlbnQpIGNsZWFyVGltZW91dChzZWFyY2hEZWJvdW5jZVJlZi5jdXJyZW50KTtcbiAgICAgICAgc2VhcmNoRGVib3VuY2VSZWYuY3VycmVudCA9IHNldFRpbWVvdXQoKCkgPT4gcnVuU2VhcmNoKHNlYXJjaFEpLCA0MDApO1xuICAgICAgICByZXR1cm4gKCkgPT4gc2VhcmNoRGVib3VuY2VSZWYuY3VycmVudCAmJiBjbGVhclRpbWVvdXQoc2VhcmNoRGVib3VuY2VSZWYuY3VycmVudCk7XG4gICAgfSwgW3NlYXJjaFFdKTtcblxuICAgIGNvbnN0IHBpY2tTZWFyY2hIaXQgPSAoaGl0KSA9PiB7XG4gICAgICAgIGNvbnN0IGxhdCA9IE1hdGgucm91bmQoK2hpdC5sYXQgKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgY29uc3QgbG9uID0gTWF0aC5yb3VuZCgraGl0LmxvbiAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIGxhdCwgbG9uLCBjaXR5OmhpdC5kaXNwbGF5X25hbWV9KSk7XG4gICAgICAgIGlmIChtYXBSZWYuY3VycmVudCkgbWFwUmVmLmN1cnJlbnQuc2V0VmlldyhbbGF0LCBsb25dLCBoaXQudHlwZSA9PT0gJ2NpdHknID8gMTEgOiAxNSk7XG4gICAgICAgIHNldFNlYXJjaE9wZW4oZmFsc2UpO1xuICAgICAgICBzZXRTZWFyY2hRKCcnKTtcbiAgICB9O1xuXG4gICAgLyogUmV2ZXJzZS1nZW9jb2RlIGxhdC9sb24gLT4gY2l0eSAvIGNvdW50cnkgdmlhIE5vbWluYXRpbS4gIE5vIEFQSSBrZXkuICovXG4gICAgY29uc3QgcmV2ZXJzZUdlb2NvZGUgPSBhc3luYyAobGF0LCBsb24pID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNldEdlb0J1c3kodHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBgaHR0cHM6Ly9ub21pbmF0aW0ub3BlbnN0cmVldG1hcC5vcmcvcmV2ZXJzZT9mb3JtYXQ9anNvbiZsYXQ9JHtsYXR9Jmxvbj0ke2xvbn0mem9vbT0xMGA7XG4gICAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7IGhlYWRlcnM6IHsgJ0FjY2VwdCc6J2FwcGxpY2F0aW9uL2pzb24nIH0gfSk7XG4gICAgICAgICAgICBjb25zdCBqID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgICBjb25zdCBhID0gai5hZGRyZXNzIHx8IHt9O1xuICAgICAgICAgICAgY29uc3QgY2l0eSA9IGEuY2l0eSB8fCBhLnRvd24gfHwgYS52aWxsYWdlIHx8IGEuaGFtbGV0IHx8IGEuY291bnR5IHx8ICcnO1xuICAgICAgICAgICAgY29uc3QgcmVnaW9uID0gYS5zdGF0ZSB8fCBhLnJlZ2lvbiB8fCAnJztcbiAgICAgICAgICAgIGNvbnN0IGNvdW50cnkgPSBhLmNvdW50cnkgfHwgJyc7XG4gICAgICAgICAgICBjb25zdCBsYWJlbCA9IFtjaXR5LCByZWdpb24sIGNvdW50cnldLmZpbHRlcihCb29sZWFuKS5qb2luKCcsICcpIHx8IGouZGlzcGxheV9uYW1lIHx8ICcnO1xuICAgICAgICAgICAgaWYgKGxhYmVsKSBzZXRDZmcoYyA9PiAoey4uLmMsIGNpdHk6bGFiZWx9KSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogb2ZmbGluZSBvciByYXRlLWxpbWl0ZWQgLT4ga2VlcCBwcmlvciBuYW1lICovIH1cbiAgICAgICAgZmluYWxseSB7IHNldEdlb0J1c3koZmFsc2UpOyB9XG4gICAgfTtcblxuICAgIC8qIEluaXQgTGVhZmxldCBvbiBmaXJzdCByZW5kZXIgb2YgdGhlIG1vZGFsICovXG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKCFtYXBCb3hSZWYuY3VycmVudCB8fCBtYXBSZWYuY3VycmVudCkgcmV0dXJuO1xuICAgICAgICBjb25zdCBtYXAgPSBMLm1hcChtYXBCb3hSZWYuY3VycmVudCwgeyB6b29tQ29udHJvbDogdHJ1ZSwgYXR0cmlidXRpb25Db250cm9sOiB0cnVlIH0pXG4gICAgICAgICAgICAgICAgICAgICAuc2V0VmlldyhbY2ZnLmxhdCwgY2ZnLmxvbl0sIDYpO1xuICAgICAgICBMLnRpbGVMYXllcignaHR0cHM6Ly97c30udGlsZS5vcGVuc3RyZWV0bWFwLm9yZy97en0ve3h9L3t5fS5wbmcnLCB7XG4gICAgICAgICAgICBtYXhab29tOiAxOCxcbiAgICAgICAgICAgIGF0dHJpYnV0aW9uOiAnJmNvcHk7IE9wZW5TdHJlZXRNYXAgY29udHJpYnV0b3JzJyxcbiAgICAgICAgfSkuYWRkVG8obWFwKTtcblxuICAgICAgICBjb25zdCBtYXJrZXIgPSBMLm1hcmtlcihbY2ZnLmxhdCwgY2ZnLmxvbl0sIHsgZHJhZ2dhYmxlOiB0cnVlIH0pLmFkZFRvKG1hcCk7XG4gICAgICAgIG1hcmtlci5iaW5kVG9vbHRpcCgnRHJhZyBtZSBvciBjbGljayBhbnl3aGVyZSBvbiB0aGUgbWFwJywgeyBwZXJtYW5lbnQ6IGZhbHNlIH0pO1xuXG4gICAgICAgIGNvbnN0IGFwcGx5TGF0TG9uID0gKGxhdCwgbG9uKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByID0gKG4pID0+IE1hdGgucm91bmQobiAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBsYXQ6cihsYXQpLCBsb246cihsb24pfSkpO1xuICAgICAgICAgICAgcmV2ZXJzZUdlb2NvZGUocihsYXQpLCByKGxvbikpO1xuICAgICAgICB9O1xuICAgICAgICBtYXJrZXIub24oJ2RyYWdlbmQnLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsbCA9IG1hcmtlci5nZXRMYXRMbmcoKTtcbiAgICAgICAgICAgIGFwcGx5TGF0TG9uKGxsLmxhdCwgbGwubG5nKTtcbiAgICAgICAgfSk7XG4gICAgICAgIG1hcC5vbignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgbWFya2VyLnNldExhdExuZyhlLmxhdGxuZyk7XG4gICAgICAgICAgICBhcHBseUxhdExvbihlLmxhdGxuZy5sYXQsIGUubGF0bG5nLmxuZyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1hcFJlZi5jdXJyZW50ID0gbWFwO1xuICAgICAgICBtYXJrZXJSZWYuY3VycmVudCA9IG1hcmtlcjtcblxuICAgICAgICAvKiBMZWFmbGV0IHJlbmRlcnMgYmxhbmsgaWYgaXQgYm9vdHMgaW5zaWRlIGEgaGlkZGVuIGVsZW1lbnQg4oCUIGtpY2sgaXRcbiAgICAgICAgICAgb25jZSB0aGUgbW9kYWwgYW5pbWF0aW9uIHNldHRsZXMuICovXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gbWFwLmludmFsaWRhdGVTaXplKCksIDI1MCk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7IG1hcC5yZW1vdmUoKTsgbWFwUmVmLmN1cnJlbnQgPSBudWxsOyBtYXJrZXJSZWYuY3VycmVudCA9IG51bGw7IH07XG4gICAgfSwgW10pO1xuXG4gICAgLyogS2VlcCBtYXJrZXIgaW4gc3luYyB3aGVuIHVzZXIgZWRpdHMgbGF0L2xvbiBmaWVsZHMgbWFudWFsbHkgKi9cbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAobWFwUmVmLmN1cnJlbnQgJiYgbWFya2VyUmVmLmN1cnJlbnQpIHtcbiAgICAgICAgICAgIG1hcmtlclJlZi5jdXJyZW50LnNldExhdExuZyhbY2ZnLmxhdCwgY2ZnLmxvbl0pO1xuICAgICAgICAgICAgbWFwUmVmLmN1cnJlbnQucGFuVG8oW2NmZy5sYXQsIGNmZy5sb25dKTtcbiAgICAgICAgfVxuICAgIH0sIFtjZmcubGF0LCBjZmcubG9uXSk7XG5cbiAgICAvKiBHZW9sb2NhdGlvbjogc2lsZW50bHkgbm8tb3AnZCBiZWZvcmUgLS0gaWYgdGhlIGJyb3dzZXIgYmxvY2tlZCB0aGVcbiAgICAgKiByZXF1ZXN0IChIVFRQIG9yaWdpbiA9IG5vdCBhIHNlY3VyZSBjb250ZXh0IG9uIGZpZWxkIGNvbnRyb2xsZXJzLCBvclxuICAgICAqIHRoZSB1c2VyIGRlbmllZCBwZXJtaXNzaW9uIGVhcmxpZXIpIHRoZSBidXR0b24ganVzdCBzYXQgdGhlcmUuXG4gICAgICogTm93IHdlIHN1cmZhY2UgYSBzdGF0ZSAoYnVzeSAvIGVycikgc28gdGhlIG9wZXJhdG9yIGNhbiBzZWUgV0hZIGl0XG4gICAgICogZmFpbGVkIGFuZCBhY3Qgb24gaXQgKHN3aXRjaCB0byBIVFRQUywgcmUtcHJvbXB0LCBvciB1c2UgdGhlIG1hcCkuICovXG4gICAgY29uc3QgW2dlb1N0YXRlLCBzZXRHZW9TdGF0ZV0gPSBSZWFjdC51c2VTdGF0ZShudWxsKTsgICAvLyBudWxsIHwgJ2J1c3knIHwge2Vycn1cbiAgICBjb25zdCB1c2VNeUxvY2F0aW9uID0gKCkgPT4ge1xuICAgICAgICBzZXRHZW9TdGF0ZSgnYnVzeScpO1xuICAgICAgICAvLyBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24gaXMgYHVuZGVmaW5lZGAgb24gSFRUUCBvcmlnaW5zIChDaHJvbWUgNTArKS5cbiAgICAgICAgaWYgKCFuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pIHtcbiAgICAgICAgICAgIHNldEdlb1N0YXRlKHsgZXJyOidCcm93c2VyIGJsb2NrZWQgbG9jYXRpb24gYWNjZXNzIOKAlCBvcGVuIHRoaXMgcGFnZSB2aWEgSFRUUFMuJyB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKFxuICAgICAgICAgICAgKHBvcykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhdCA9IE1hdGgucm91bmQocG9zLmNvb3Jkcy5sYXRpdHVkZSAgKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgICAgICAgICBjb25zdCBsb24gPSBNYXRoLnJvdW5kKHBvcy5jb29yZHMubG9uZ2l0dWRlICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBsYXQsIGxvbn0pKTtcbiAgICAgICAgICAgICAgICBpZiAobWFwUmVmLmN1cnJlbnQpIG1hcFJlZi5jdXJyZW50LnNldFZpZXcoW2xhdCwgbG9uXSwgMTEpO1xuICAgICAgICAgICAgICAgIHJldmVyc2VHZW9jb2RlKGxhdCwgbG9uKTtcbiAgICAgICAgICAgICAgICBzZXRHZW9TdGF0ZShudWxsKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gZXJyLmNvZGU6IDE9UEVSTUlTU0lPTl9ERU5JRUQsIDI9UE9TSVRJT05fVU5BVkFJTEFCTEUsIDM9VElNRU9VVFxuICAgICAgICAgICAgICAgIGNvbnN0IG1zZyA9IGVyciAmJiBlcnIuY29kZSA9PT0gMVxuICAgICAgICAgICAgICAgICAgICA/ICdMb2NhdGlvbiBwZXJtaXNzaW9uIGRlbmllZCDigJQgY2xpY2sgdGhlIGxvY2sgaWNvbiBpbiB0aGUgYWRkcmVzcyBiYXIgYW5kIGFsbG93IGxvY2F0aW9uLidcbiAgICAgICAgICAgICAgICAgICAgOiBlcnIgJiYgZXJyLmNvZGUgPT09IDJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gJ0xvY2F0aW9uIGN1cnJlbnRseSB1bmF2YWlsYWJsZSDigJQgdGhlIGRldmljZSBoYXMgbm8gR1BTIC8gV2ktRmkgZml4IHlldC4nXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGVyciAmJiBlcnIuY29kZSA9PT0gM1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ0xvY2F0aW9uIHJlcXVlc3QgdGltZWQgb3V0IOKAlCB0cnkgYWdhaW4sIG9yIHVzZSB0aGUgbWFwIC8gc2VhcmNoIGJhci4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAoZXJyICYmIGVyci5tZXNzYWdlKSB8fCAnQ291bGQgbm90IHJlYWQgZGV2aWNlIGxvY2F0aW9uLic7XG4gICAgICAgICAgICAgICAgc2V0R2VvU3RhdGUoeyBlcnI6IG1zZyB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7IGVuYWJsZUhpZ2hBY2N1cmFjeTp0cnVlLCB0aW1lb3V0OjEwMDAwLCBtYXhpbXVtQWdlOjAgfVxuICAgICAgICApO1xuICAgIH07XG5cbiAgICAvKiBXaGVuIHVzZXIgY2xpY2tzIFwiU2F2ZSAmIHJldHVyblwiLCBtaXJyb3IgRVhBQ1RMWSB3aGF0IHRoZSBkYXNoYm9hcmQnc1xuICAgICAqIFdlYXRoZXIgYnV0dG9uIGRvZXMgaW4gd2VhdGhlci1zZXR0aW5ncy1tb2RhbC5qcyNzZWxlY3RMb2NhdGlvbjpcbiAgICAgKiAgIDEuIGxvY2FsU3RvcmFnZVsnd2VhdGhlckxvY2F0aW9uJ10gICAgICAgID0gY2hvc2VuIGxvYyAoY2Fub25pY2FsIGtleVxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBkYXNoYm9hcmQgcmVhZHMgb25cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3VudCwgTk9UICdyZWQ1LndlYXRoZXJfbG9jYXRpb24nKS5cbiAgICAgKiAgIDIuIGxvY2FsU3RvcmFnZVsnc2F2ZWRXZWF0aGVyTG9jYXRpb25zJ10gID0gW2xvYywgLi4ub3RoZXJzXSBkZWR1cGVkXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnkgbGF0L2xvbiwgY2FwcGVkIGF0IDIwLlxuICAgICAqICAgMy4gUE9TVCAvYXBpL3dlYXRoZXItbG9jYXRpb24gd2l0aCBhY3RpdmUrZGVmYXVsdCtzYXZlZCBzbyB0aGUgc2FtZVxuICAgICAqICAgICAgbGlzdCBzdXJ2aXZlcyBjcm9zcy1kZXZpY2Ugc2Vzc2lvbnMgZm9yIHNpZ25lZC1pbiB0ZW5hbnRzLlxuICAgICAqXG4gICAgICogV2l0aG91dCBzdGVwIDEgdGhlIGRhc2hib2FyZCdzIGB3ZWF0aGVyTG9jYXRpb25gIHN0YXRlIHNpbGVudGx5IGtlZXBzXG4gICAgICogaXRzIG9sZCB2YWx1ZSAtLSB3aGljaCBpcyBleGFjdGx5IHRoZSBidWcgb3BlcmF0b3JzIHJlcG9ydGVkIGFmdGVyXG4gICAgICogcGlja2luZyBhIGxvY2F0aW9uIGluIFNldHVwIFdhbGsgYW5kIHNlZWluZyB0aGUgZGFzaGJvYXJkJ3Mgd2VhdGhlclxuICAgICAqIHN0cmlwIHJlZnVzZSB0byB1cGRhdGUuICovXG4gICAgY29uc3QgW3NhdmVNc2csIHNldFNhdmVNc2ddID0gUmVhY3QudXNlU3RhdGUobnVsbCk7XG4gICAgY29uc3QgcGVyc2lzdEFuZFNhdmUgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGxvYyA9IHsgbGF0OiBjZmcubGF0LCBsb246IGNmZy5sb24sIG5hbWU6IGNmZy5zaXRlTmFtZSB8fCBjZmcuY2l0eSB9O1xuXG4gICAgICAgIC8vIERlLWR1cCB0aGUgZXhpc3Rpbmcgc2F2ZWQgbGlzdCBieSBsYXQvbG9uIChzYW1lIGtleSB0aGUgZGFzaGJvYXJkXG4gICAgICAgIC8vIHVzZXMpIGFuZCBwdXQgdGhlIG5ldyBwaWNrIGF0IHRoZSB0b3AuICBDYXAgYXQgMjAgdG8gbWF0Y2ggdGhlXG4gICAgICAgIC8vIGRhc2hib2FyZCdzIGJlaGF2aW91ci5cbiAgICAgICAgY29uc3Qga2V5ID0gbG9jLmxhdC50b0ZpeGVkKDQpICsgJywnICsgbG9jLmxvbi50b0ZpeGVkKDQpO1xuICAgICAgICBjb25zdCBkZWR1cGVkID0gc2F2ZWRMb2NzLmZpbHRlcihsID0+IChsLmxhdC50b0ZpeGVkKDQpICsgJywnICsgbC5sb24udG9GaXhlZCg0KSkgIT09IGtleSk7XG4gICAgICAgIGNvbnN0IG5leHRTYXZlZCA9IFtsb2MsIC4uLmRlZHVwZWRdLnNsaWNlKDAsIDIwKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3dlYXRoZXJMb2NhdGlvbicsIEpTT04uc3RyaW5naWZ5KGxvYykpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3NhdmVkV2VhdGhlckxvY2F0aW9ucycsIEpTT04uc3RyaW5naWZ5KG5leHRTYXZlZCkpO1xuICAgICAgICAgICAgLy8gS2VlcCB0aGUgb2xkIGtleSB0b28gLS0gc29tZSBsZWdhY3kgcGx1Zy1pbnMgc3RpbGwgbG9vayBhdCBpdC5cbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1LndlYXRoZXJfbG9jYXRpb24nLCBKU09OLnN0cmluZ2lmeShsb2MpKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBwcml2YXRlIG1vZGUgLS0gaWdub3JlICovIH1cblxuICAgICAgICBsZXQgcGVyc2lzdGVkID0gZmFsc2UsIHdhcm5pbmcgPSAnJztcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCgnL2FwaS93ZWF0aGVyLWxvY2F0aW9uJywge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzonYXBwbGljYXRpb24vanNvbicgfSxcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGFjdGl2ZTogbG9jLCBkZWZhdWx0OiBsb2MsIHNhdmVkOiBuZXh0U2F2ZWQgfSksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IGogPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgICAgIHdpbmRvdy5fbGFzdFdlYXRoZXJMb2NhdGlvblNhdmUgPSBqO1xuICAgICAgICAgICAgcGVyc2lzdGVkID0gISFqLnBlcnNpc3RlZDtcbiAgICAgICAgICAgIHdhcm5pbmcgICA9IGoud2FybmluZyB8fCAnJztcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnW3NldHVwIHdhbGtdIC9hcGkvd2VhdGhlci1sb2NhdGlvbiA8LScsIGopO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB3YXJuaW5nID0gJ05ldHdvcmsgZXJyb3Ig4oCUIHNhdmVkIGxvY2FsbHkgb25seS4nO1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdbc2V0dXAgd2Fsa10gY291bGQgbm90IHBlcnNpc3QgbG9jYXRpb246JywgZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUZWxsIGFueSBvcGVuIGRhc2hib2FyZCB0YWIgdG8gcmUtaHlkcmF0ZS4gIFRoZSBkYXNoYm9hcmRcbiAgICAgICAgLy8gYWxyZWFkeSBsaXN0ZW5zIGZvciBgc3RvcmFnZWAgZXZlbnRzIHdoZW4gYW5vdGhlciB0YWIgd3JpdGVzIHRvXG4gICAgICAgIC8vIGxvY2FsU3RvcmFnZSwgYnV0IG9uIFYxLjkgc29tZSBicm93c2VycyBET04nVCBmaXJlIGBzdG9yYWdlYCBmb3JcbiAgICAgICAgLy8gc2FtZS1vcmlnaW4gd3JpdGVzIGZyb20gdGhpcyBzYW1lIHRhYi4gIEFuIGV4cGxpY2l0IGN1c3RvbSBldmVudFxuICAgICAgICAvLyBtYWtlcyB0aGUgZGFzaGJvYXJkJ3MgcG9sbGluZyBwaWNrIHRoZSBjaGFuZ2UgdXAgaW1tZWRpYXRlbHkgaWZcbiAgICAgICAgLy8gaXQncyBhbHJlYWR5IG1vdW50ZWQgaW4gYW5vdGhlciB0YWIvd2luZG93LlxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdyZWQ1OndlYXRoZXJMb2NhdGlvbkNoYW5nZWQnLFxuICAgICAgICAgICAgICAgIHsgZGV0YWlsOiB7IGFjdGl2ZTogbG9jLCBzYXZlZDogbmV4dFNhdmVkIH0gfSkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IC8qIElFLWxlc3MgZW52aXJvbm1lbnRzIC0tIG5vLW9wICovIH1cblxuICAgICAgICBpZiAocGVyc2lzdGVkKSB7XG4gICAgICAgICAgICBvblNhdmUoKTsgICAgICAgICAgIC8vIGhhcHB5IHBhdGg6IGNsb3NlICsgbWFyayBzdGVwIGRvbmVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8qIFN1cmZhY2UgdGhlIHdhcm5pbmcsIGhvbGQgdGhlIG1vZGFsIG9wZW4gZm9yIDEuNnMgc28gdGhlXG4gICAgICAgICAgICAgKiBvcGVyYXRvciByZWFkcyBpdCwgdGhlbiBjbG9zZS4gIFRoZSBsb2NhbCBjb3B5IGlzIGFscmVhZHlcbiAgICAgICAgICAgICAqIHdyaXR0ZW4sIHNvIHRoZSBkYXNoYm9hcmQgd2lsbCBzdGlsbCBzZWUgdGhlIG5ldyBsb2NhdGlvblxuICAgICAgICAgICAgICogaW4gdGhpcyBicm93c2VyIHNlc3Npb24uICovXG4gICAgICAgICAgICBzZXRTYXZlTXNnKHdhcm5pbmcgfHwgJ1NhdmVkIGxvY2FsbHkgb25seSDigJQgc2lnbiBpbiB0byBzYXZlIHNlcnZlci1zaWRlLicpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHNldFNhdmVNc2cobnVsbCk7IG9uU2F2ZSgpOyB9LCAxNjAwKTtcbiAgICAgICAgfVxuICAgIH07XG5cblxuICAgIHJldHVybiAoXG4gICAgICAgIDxNb2RhbFNoZWxsIHRpdGxlPVwiTG9jYXRpb24gU2V0dGluZ1wiIHN1YnRpdGxlPVwiQ2xpY2sgdGhlIG1hcCwgZHJhZyB0aGUgcGluLCBvciB1c2UgeW91ciBkZXZpY2VcIiBhY2NlbnQ9XCJhbWJlclwiIG9uQ2xvc2U9e29uQ2xvc2V9IG9uU2F2ZT17cGVyc2lzdEFuZFNhdmV9IHNpemU9XCJtYXhcIj5cbiAgICAgICAgICAgIHtzYXZlTXNnICYmIChcbiAgICAgICAgICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwibG9jLXNhdmUtbXNnXCJcbiAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1iLTMgcHgtNCBweS0yLjUgcm91bmRlZC1sZyBiZy1hbWJlci05MDAvMzAgYm9yZGVyIGJvcmRlci1hbWJlci03MDAvNTAgdGV4dC1hbWJlci0yMDAgdGV4dC14cyBmb250LW1vbm9cIj5cbiAgICAgICAgICAgICAgICAgICAg4pqgICB7c2F2ZU1zZ31cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbGc6Z3JpZC1jb2xzLVsxZnJfMzQwcHhdIGdhcC00IGgtZnVsbFwiIHN0eWxlPXt7bWluSGVpZ2h0Oic1NnZoJ319PlxuICAgICAgICAgICAgICAgIHsvKiBNQVAg4oCUIGZpbGxzIHRoZSBsZWZ0IHNpZGUsIHdpdGggYSBzZWFyY2ggYmFyIGZsb2F0aW5nIG9uIHRvcCAqL31cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlXCIgc3R5bGU9e3ttaW5IZWlnaHQ6JzU2dmgnfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgcmVmPXttYXBCb3hSZWZ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgaGVpZ2h0OicxMDAlJywgbWluSGVpZ2h0Oic1NnZoJywgd2lkdGg6JzEwMCUnLCBib3JkZXJSYWRpdXM6JzEycHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OidoaWRkZW4nLCBib3JkZXI6JzFweCBzb2xpZCAjMzM0MTU1JywgYmFja2dyb3VuZDonIzBiMTIyMCcgfX0vPlxuXG4gICAgICAgICAgICAgICAgICAgIHsvKiBTZWFyY2ggYmFyIG92ZXJsYXkg4oCUIHNpdHMgaW4gdGhlIHRvcC1jZW50cmUgb2YgdGhlIG1hcCAqL31cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSB0b3AtMyBsZWZ0LTEvMiAtdHJhbnNsYXRlLXgtMS8yIHotWzUwMF1cIiBzdHlsZT17e3dpZHRoOidtaW4oNTYwcHgsIGNhbGMoMTAwJSAtIDExMHB4KSknfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3NlYXJjaFF9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0U2VhcmNoUShlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uRm9jdXM9eygpID0+IHNlYXJjaEhpdHMubGVuZ3RoICYmIHNldFNlYXJjaE9wZW4odHJ1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwi8J+UjiAgU2VhcmNoIGJ5IGFkZHJlc3MsIGJ1aWxkaW5nLCBvciBwbGFjZSBuYW1l4oCmXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHB4LTQgcHktMi41IHJvdW5kZWQteGwgYmctc2xhdGUtOTAwLzk1IGJvcmRlciBib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtMTAwIHRleHQtc20gcGxhY2Vob2xkZXItc2xhdGUtNTAwIHNoYWRvdy0yeGwgYmFja2Ryb3AtYmx1clwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7b3V0bGluZTonbm9uZSd9fS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlYXJjaEJ1c3kgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJhYnNvbHV0ZSByaWdodC0zIHRvcC0xLzIgLXRyYW5zbGF0ZS15LTEvMiB0ZXh0LWFtYmVyLTQwMCB0ZXh0LXhzXCI+4oCmPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlYXJjaE9wZW4gJiYgc2VhcmNoSGl0cy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSB0b3AtZnVsbCBsZWZ0LTAgcmlnaHQtMCBtdC0xIGJnLXNsYXRlLTkwMC85NyBib3JkZXIgYm9yZGVyLXNsYXRlLTcwMCByb3VuZGVkLXhsIHNoYWRvdy0yeGwgb3ZlcmZsb3ctaGlkZGVuIG1heC1oLTcyIG92ZXJmbG93LXktYXV0byBiYWNrZHJvcC1ibHVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VhcmNoSGl0cy5tYXAoKGgsIGkpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGtleT17aC5wbGFjZV9pZCB8fCBpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gcGlja1NlYXJjaEhpdChoKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCB0ZXh0LWxlZnQgcHgtNCBweS0yLjUgaG92ZXI6YmctYW1iZXItOTAwLzMwIGJvcmRlci1iIGJvcmRlci1zbGF0ZS04MDAgbGFzdDpib3JkZXItYi0wIHRyYW5zaXRpb24tYWxsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LXNsYXRlLTIwMCB0cnVuY2F0ZVwiPntoLmRpc3BsYXlfbmFtZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IG10LTAuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2gudHlwZSB8fCBoLmNsYXNzfSDCtyB7KCtoLmxhdCkudG9GaXhlZCgzKX0sIHsoK2gubG9uKS50b0ZpeGVkKDMpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWFyY2hPcGVuICYmIHNlYXJjaEhpdHMubGVuZ3RoID09PSAwICYmIHNlYXJjaFEubGVuZ3RoID49IDMgJiYgIXNlYXJjaEJ1c3kgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC1mdWxsIGxlZnQtMCByaWdodC0wIG10LTEgYmctc2xhdGUtOTAwLzk3IGJvcmRlciBib3JkZXItc2xhdGUtNzAwIHJvdW5kZWQteGwgcHgtNCBweS0zIHRleHQteHMgdGV4dC1zbGF0ZS00MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vIHJlc3VsdHMgZm9yIFwie3NlYXJjaFF9XCIuICBUcnkgYSBtb3JlIHNwZWNpZmljIHRlcm0uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICB7LyogU0lERSBQQU5FTCAqL31cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktNCBvdmVyZmxvdy15LWF1dG8gcHItMVwiPlxuICAgICAgICAgICAgICAgICAgICB7LyogU2l0ZSBuYW1lIGNvbWJvLWlucHV0LiAgRnJlZS1mb3JtIHR5cGluZyBmb3IgZnJlc2hcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsczsgYSB2aXNpYmxlIGNoZXZyb24gYnV0dG9uIG9uIHRoZSByaWdodCBvcGVuc1xuICAgICAgICAgICAgICAgICAgICAgICAgYSBjdXN0b20gcG9wZG93biBsaXN0aW5nIGV2ZXJ5IHNhdmVkIGxvY2F0aW9uIHB1bGxlZFxuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAvYXBpL3dlYXRoZXItbG9jYXRpb24gKGkuZS4gdGhlIFNBTUUgbGlzdCB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAgIERhc2hib2FyZCdzIFdlYXRoZXIgYnV0dG9uIHN1cmZhY2VzKS4gIFRoaXMgcmVwbGFjZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBlYXJsaWVyIG5hdGl2ZSA8ZGF0YWxpc3Q+IHdoaWNoIHdhcyB0b28gc3VidGxlXG4gICAgICAgICAgICAgICAgICAgICAgICBpbiBkYXJrIHRoZW1lcyAtLSBvcGVyYXRvcnMgd2l0aCBOPjAgc2F2ZWQgZW50cmllc1xuICAgICAgICAgICAgICAgICAgICAgICAgY291bGQgbm90IHRlbGwgYSBkcm9wZG93biBleGlzdGVkLiAqL31cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMS41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU2l0ZSBuYW1lIChzYXZlZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2F2ZWRMb2NzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtbC0yIHRleHQtYW1iZXItNDAwLzgwIG5vcm1hbC1jYXNlIHRyYWNraW5nLW5vcm1hbCB0ZXh0LVsxMHB4XVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwibG9jLXNhdmVkLWhpbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIOKWviB7c2F2ZWRMb2NzLmxlbmd0aH0gc2F2ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmVcIiByZWY9e3NhdmVkUmVmfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXQgcHItOVwiIHZhbHVlPXtjZmcuc2l0ZU5hbWUgfHwgJyd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwibG9jLXNpdGUtbmFtZS1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtzYXZlZExvY3MubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnUGljayBhIHNhdmVkIGxvY2F0aW9uLCBvciB0eXBlIGEgbmV3IG9uZeKApidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2UuZy4gSFEgVG93ZXIsIE5vcnRoIFdpbmcsIFBhdmlsaW9uIELigKYnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IG9uU2l0ZU5hbWVDaGFuZ2UoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkZvY3VzPXsoKSA9PiBzYXZlZExvY3MubGVuZ3RoID4gMCAmJiBzZXRTYXZlZE9wZW4odHJ1ZSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2F2ZWRMb2NzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwibG9jLXNhdmVkLWNoZXZyb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFNhdmVkT3Blbih2ID0+ICF2KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiT3BlbiBzYXZlZCBsb2NhdGlvbnNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwiUGljayBmcm9tIHNhdmVkIGxvY2F0aW9uc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgcmlnaHQtMSB0b3AtMS8yIC10cmFuc2xhdGUteS0xLzIgdy03IGgtNyByb3VuZGVkLW1kIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGJnLWFtYmVyLTcwMC8zMCBob3ZlcjpiZy1hbWJlci02MDAvNTAgYm9yZGVyIGJvcmRlci1hbWJlci01MDAvNDAgdGV4dC1hbWJlci0yMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIxNFwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyLjRcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3t0cmFuc2Zvcm06IHNhdmVkT3BlbiA/ICdyb3RhdGUoMTgwZGVnKScgOiAnbm9uZScsIHRyYW5zaXRpb246J3RyYW5zZm9ybSAuMTVzJ319PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5bGluZSBwb2ludHM9XCI2IDkgMTIgMTUgMTggOVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzYXZlZE9wZW4gJiYgc2F2ZWRMb2NzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwibG9jLXNhdmVkLWRyb3Bkb3duXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSB6LVs2MDBdIGxlZnQtMCByaWdodC0wIHRvcC1mdWxsIG10LTEgYmctc2xhdGUtOTAwIGJvcmRlciBib3JkZXItc2xhdGUtNjAwIHJvdW5kZWQtbGcgc2hhZG93LTJ4bCBtYXgtaC02NCBvdmVyZmxvdy15LWF1dG9cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzYXZlZExvY3MubWFwKGxvYyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNBY3RpdmUgPSAoY2ZnLnNpdGVOYW1lIHx8ICcnKS50cmltKCkgPT09IGxvYy5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PXtsb2MubmFtZX0gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gcGlja1NhdmVkTG9jKGxvYyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2Bsb2Mtc2F2ZWQtb3B0LSR7bG9jLm5hbWV9YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B3LWZ1bGwgdGV4dC1sZWZ0IHB4LTMgcHktMiBib3JkZXItYiBib3JkZXItc2xhdGUtODAwIGxhc3Q6Ym9yZGVyLWItMCBob3ZlcjpiZy1hbWJlci05MDAvMzAgdHJhbnNpdGlvbi1jb2xvcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtpc0FjdGl2ZSA/ICdiZy1hbWJlci05MDAvNTAnIDogJyd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC1zbGF0ZS0xMDAgdHJ1bmNhdGVcIj57bG9jLm5hbWV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIGZvbnQtbW9ubyBtdC0wLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bG9jLmxhdC50b0ZpeGVkKDIpfSwge2xvYy5sb24udG9GaXhlZCgyKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTEgaXRhbGljXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NhdmVkTG9jcy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ1BpY2sgYSBwcmV2aW91c2x5LXNhdmVkIGxvY2F0aW9uLCBvciB0eXBlIGEgbmV3IGxhYmVsIGZvciB0aGlzIHBsYWNlLidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnWW91ciBsYWJlbCBmb3IgdGhpcyBwbGFjZSDigJQgc2hvd24gb24gdGhlIGRhc2hib2FyZCBoZWFkZXIuJ31cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBTb2Z0IGR1cGxpY2F0ZS1uYW1lIHdhcm5pbmcgLS0gaWYgdGhlIG9wZXJhdG9yIHR5cGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYSBuYW1lIHRoYXQgYWxyZWFkeSBleGlzdHMgaW4gdGhlIHNhdmVkIGxpc3QgQVRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBESUZGRVJFTlQgQ09PUkRJTkFURVMsIHN1cmZhY2UgdGhhdCBzbyB0aGV5IGRvbid0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2lsZW50bHkgZW5kIHVwIHdpdGggdHdvIFwiSE9NRVwicyBwb2ludGluZyB0byB0d29cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWZmZXJlbnQgYWRkcmVzc2VzICh0aGUgYnVnIG9wZXJhdG9yLXJlcG9ydGVkIG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMjAyNi0wNi0yODogZGFzaGJvYXJkIGhhZCAyw5cgSE9NRSwgU2V0dXAgV2Fsa1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dlZCBvbmx5IDEpLiAgU2FtZSBjb29yZHMgPSBubyB3YXJuaW5nLCBpdCdzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganVzdCByZS1zZWxlY3RpbmcgYSBrbm93biBzaXRlLiAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgIHsoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHR5cGVkID0gKGNmZy5zaXRlTmFtZSB8fCAnJykudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdHlwZWQpIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvdW5kID0gKG4pID0+IChNYXRoLnJvdW5kKG4gKiAxMDAwMCkgLyAxMDAwMCkudG9GaXhlZCg0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXIgPSByb3VuZChjZmcubGF0KSArICcsJyArIHJvdW5kKGNmZy5sb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbmZsaWN0ID0gc2F2ZWRMb2NzLmZpbmQocyA9PiBzLm5hbWUgPT09IHR5cGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgKHJvdW5kKHMubGF0KSArICcsJyArIHJvdW5kKHMubG9uKSkgIT09IGN1cik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjb25mbGljdCkgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cImxvYy1kdXAtbmFtZS13YXJuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtdC0yIHB4LTIuNSBweS0yIHJvdW5kZWQtbWQgYmctYW1iZXItOTUwLzQwIGJvcmRlciBib3JkZXItYW1iZXItNzAwLzUwIHRleHQtWzEwLjVweF0gdGV4dC1hbWJlci0yMDAgbGVhZGluZy1zbnVnXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YiBjbGFzc05hbWU9XCJ0ZXh0LWFtYmVyLTEwMFwiPlNhbWUgbmFtZSBhbHJlYWR5IHNhdmVkPC9iPiBhdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvZGUgY2xhc3NOYW1lPVwibXgtMSBmb250LW1vbm8gdGV4dC1hbWJlci0xMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Y29uZmxpY3QubGF0LnRvRml4ZWQoMil9LCB7Y29uZmxpY3QubG9uLnRvRml4ZWQoMil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2NvZGU+LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2F2aW5nIGtlZXBzIGJvdGg7IHBpY2sgZnJvbSB0aGUgZHJvcGRvd24gYWJvdmUgdG8gc3dpdGNoIHRvIHRoZSBleGlzdGluZyBvbmUgaW5zdGVhZC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKCl9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyLXQgYm9yZGVyLXNsYXRlLTgwMCBwdC0zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlc29sdmVkIGFkZHJlc3MgLyBjaXR5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2dlb0J1c3kgJiYgPHNwYW4gY2xhc3NOYW1lPVwibWwtMiB0ZXh0LWFtYmVyLTQwMCBub3JtYWwtY2FzZSB0cmFja2luZy1ub3JtYWxcIj7igKYgcmVzb2x2aW5nPC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCIgdmFsdWU9e2NmZy5jaXR5fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSk9PnNldENmZyh7Li4uY2ZnLCBjaXR5OmUudGFyZ2V0LnZhbHVlfSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTEuNVwiPkxhdGl0dWRlPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCIgdHlwZT1cIm51bWJlclwiIHN0ZXA9XCIwLjAwMDFcIiB2YWx1ZT17Y2ZnLmxhdH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKT0+c2V0Q2ZnKHsuLi5jZmcsIGxhdDorZS50YXJnZXQudmFsdWV9KX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMS41XCI+TG9uZ2l0dWRlPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCIgdHlwZT1cIm51bWJlclwiIHN0ZXA9XCIwLjAwMDFcIiB2YWx1ZT17Y2ZnLmxvbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKT0+c2V0Q2ZnKHsuLi5jZmcsIGxvbjorZS50YXJnZXQudmFsdWV9KX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17dXNlTXlMb2NhdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17Z2VvU3RhdGUgPT09ICdidXN5J31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImxvYy11c2UtbXktbG9jYXRpb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHctZnVsbCBweS0yLjUgcm91bmRlZC1sZyBib3JkZXIgdGV4dC14cyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgdHJhbnNpdGlvbi1jb2xvcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtnZW9TdGF0ZSA9PT0gJ2J1c3knXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1hbWJlci05MDAvNDAgYm9yZGVyLWFtYmVyLTcwMC80MCB0ZXh0LWFtYmVyLTIwMCBjdXJzb3Itd2FpdCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogKGdlb1N0YXRlICYmIGdlb1N0YXRlLmVyclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLXJvc2UtOTAwLzQwIGJvcmRlci1yb3NlLTUwMC81MCB0ZXh0LXJvc2UtMTAwIGhvdmVyOmJnLXJvc2UtODAwLzQwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLWFtYmVyLTcwMC83MCBib3JkZXItYW1iZXItNTAwLzQwIHRleHQtYW1iZXItNTAgaG92ZXI6YmctYW1iZXItNjAwLzcwJyl9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7Z2VvU3RhdGUgPT09ICdidXN5J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ+KPsyAgUmVhZGluZyBkZXZpY2UgbG9jYXRpb27igKYnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAn8J+TjSAgVXNlIG15IGRldmljZSBsb2NhdGlvbid9XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICB7Z2VvU3RhdGUgJiYgZ2VvU3RhdGUuZXJyICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJsb2MtZ2VvLWVycm9yXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiLW10LTIgcHgtMyBweS0yIHJvdW5kZWQtbWQgYmctcm9zZS05NTAvNTAgYm9yZGVyIGJvcmRlci1yb3NlLTcwMC80MCB0ZXh0LVsxMXB4XSBsZWFkaW5nLXNudWcgdGV4dC1yb3NlLTIwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxiIGNsYXNzTmFtZT1cInRleHQtcm9zZS0xMDBcIj5Db3VsZG4ndCByZWFkIGxvY2F0aW9uLjwvYj48YnIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtcm9zZS0yMDAvOTBcIj57Z2VvU3RhdGUuZXJyfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogU3BlY2lmaWMgSFRUUC1vcmlnaW4gY2FsbC1vdXQ6IG1vc3QgbGlrZWx5IGNhdXNlIG9uIGEgVjEuOSBjb250cm9sbGVyLiAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmxvY2F0aW9uICYmIHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2h0dHA6JyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtMS41IHRleHQtWzEwcHhdIHRleHQtcm9zZS0zMDAvODAgZm9udC1tb25vXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXA6IGJyb3dzZXJzIHJlcXVpcmUgSFRUUFMgZm9yIGdlb2xvY2F0aW9uLiAgUGljayB0aGUgbG9jYXRpb24gb24gdGhlIG1hcCBvciBzZWFyY2ggYmFyIGluc3RlYWQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvcmRlci10IGJvcmRlci1zbGF0ZS04MDAgcHQtMyBtdC0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj5RdWljayBqdW1wczwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC0xLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7W1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J1Rvcm9udG8sIE9OJywgICBsYXQ6NDMuNjUzMiwgbG9uOi03OS4zODMyLCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonTmV3IFlvcmssIE5ZJywgIGxhdDo0MC43MTI4LCBsb246LTc0LjAwNjAsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidMb25kb24sIFVLJywgICAgbGF0OjUxLjUwNzQsIGxvbjogLTAuMTI3OCwgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J1BhcmlzLCBGUicsICAgICBsYXQ6NDguODU2NiwgbG9uOiAgMi4zNTIyLCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonVG9reW8sIEpQJywgICAgIGxhdDozNS42NzYyLCBsb246MTM5LjY1MDMsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidTeWRuZXksIEFVJywgICAgbGF0Oi0zMy44Njg4LGxvbjoxNTEuMjA5MywgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0ubWFwKGogPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGtleT17ai5uYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBsYXQ6ai5sYXQsIGxvbjpqLmxvbiwgY2l0eTpqLm5hbWV9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXBSZWYuY3VycmVudCkgbWFwUmVmLmN1cnJlbnQuc2V0Vmlldyhbai5sYXQsIGoubG9uXSwgai56KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtbGVmdCBweC0yLjUgcHktMS41IHJvdW5kZWQtbWQgYmctc2xhdGUtODAwLzcwIGJvcmRlciBib3JkZXItc2xhdGUtNzAwIHRleHQtWzExcHhdIGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTMwMCBob3ZlcjpiZy1zbGF0ZS03MDAgaG92ZXI6Ym9yZGVyLWFtYmVyLTUwMC80MCB0cmFuc2l0aW9uLWFsbFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2oubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbGVhZGluZy1yZWxheGVkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICBUaWxlczogT3BlblN0cmVldE1hcCDCtyBHZW9jb2RlOiBOb21pbmF0aW0gKGZyZWUsIH4xIHJlcS9zKS5cbiAgICAgICAgICAgICAgICAgICAgICAgIFVzZWQgZm9yIE9wZW4tTWV0ZW8gd2VhdGhlciBmZWVkIGFuZCBzdW5yaXNlL3N1bnNldCBlc3RpbWF0aW9uLlxuICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Nb2RhbFNoZWxsPlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIExhbmd1YWdlIFNldHRpbmcgLS0gbW9kYWxcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIExhbmd1YWdlTW9kYWwoeyBjZmcsIHNldENmZywgb25DbG9zZSwgb25TYXZlIH0pIHtcbiAgICBjb25zdCBsYW5ncyA9IFtcbiAgICAgICAgeyBjb2RlOidlbicsICAgIGxhYmVsOidFbmdsaXNoJywgICAgICAgICAgICAgICAgbmF0aXZlOidFbmdsaXNoJyAgICB9LFxuICAgICAgICB7IGNvZGU6J3poLUNOJywgbGFiZWw6J0NoaW5lc2UgKFNpbXBsaWZpZWQpJywgICBuYXRpdmU6J+eugOS9k+S4reaWhycgICAgfSxcbiAgICAgICAgeyBjb2RlOid6aC1UVycsIGxhYmVsOidDaGluZXNlIChUcmFkaXRpb25hbCknLCAgbmF0aXZlOifnuYHpq5TkuK3mlocnICAgIH0sXG4gICAgICAgIHsgY29kZTonamEnLCAgICBsYWJlbDonSmFwYW5lc2UnLCAgICAgICAgICAgICAgIG5hdGl2ZTon5pel5pys6KqeJyAgICAgIH0sXG4gICAgICAgIHsgY29kZTona28nLCAgICBsYWJlbDonS29yZWFuJywgICAgICAgICAgICAgICAgIG5hdGl2ZTon7ZWc6rWt7Ja0JyAgICAgIH0sXG4gICAgXTtcblxuICAgIC8qIE9uIFNhdmUgJiByZXR1cm46IHdyaXRlIHRoZSBwaWNrZWQgbGFuZ3VhZ2UgY29kZSB0byB0aGUgc2FtZVxuICAgICAqIGxvY2FsU3RvcmFnZSBrZXkgdGhlIGRhc2hib2FyZCdzIGkxOG4uanMgcmVhZHMgKGBpMThuX2xhbmdgKSwgYW5kXG4gICAgICogZGlzcGF0Y2ggdGhlIGBsYW5nY2hhbmdlYCBldmVudCBzbyBhbnkgb3BlbiBkYXNoYm9hcmQvY29uZmlnIHRhYlxuICAgICAqIHBpY2tzIGl0IHVwIGxpdmUuICBUaGlzIGlzIHdoYXQgbWFrZXMgdGhlIHNldHVwIHdhbGsncyBsYW5ndWFnZVxuICAgICAqIGNob2ljZSBhY3R1YWxseSBkcml2ZSB0aGUgZGFzaGJvYXJkIC8gY29uZmlnIC8gbWFwcGVyIFVJIC0tIHRoZVxuICAgICAqIHNpZGViYXIgc2VsZWN0b3IgdGhhdCB1c2VkIHRvIGxpdmUgaW4gdGhlIGRhc2hib2FyZCBoZWFkZXIgaGFzXG4gICAgICogYmVlbiByZW1vdmVkICgyMDI2LTA2LTI2KSBhbmQgdGhlIHNldHVwIHdhbGsgaXMgbm93IHRoZSBzaW5nbGVcbiAgICAgKiBzb3VyY2Ugb2YgdHJ1dGggZm9yIFVJIGxhbmd1YWdlLiAqL1xuICAgIGNvbnN0IHBlcnNpc3RBbmRTYXZlID0gKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2kxOG5fbGFuZycsIGNmZy5sYW5nKTtcbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnbGFuZ2NoYW5nZScpKTtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnW3NldHVwIHdhbGtdIGkxOG5fbGFuZyA8LScsIGNmZy5sYW5nKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdbc2V0dXAgd2Fsa10gY291bGQgbm90IHBlcnNpc3QgbGFuZ3VhZ2U6JywgZSk7XG4gICAgICAgIH1cbiAgICAgICAgb25TYXZlKCk7XG4gICAgfTtcbiAgICByZXR1cm4gKFxuICAgICAgICA8TW9kYWxTaGVsbCB0aXRsZT1cIkxhbmd1YWdlIFNldHRpbmdcIiBzdWJ0aXRsZT1cIlBpY2sgeW91ciBkZWZhdWx0IGludGVyZmFjZSBsYW5ndWFnZVwiIGFjY2VudD1cImVtZXJhbGRcIiBvbkNsb3NlPXtvbkNsb3NlfSBvblNhdmU9e3BlcnNpc3RBbmRTYXZlfT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtM1wiPlxuICAgICAgICAgICAgICAgIHtsYW5ncy5tYXAobCA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PXtsLmNvZGV9IG9uQ2xpY2s9eygpPT5zZXRDZmcoey4uLmNmZywgbGFuZzpsLmNvZGV9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B0ZXh0LWxlZnQgcC0zIHJvdW5kZWQteGwgYm9yZGVyLTIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjZmcubGFuZyA9PT0gbC5jb2RlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdib3JkZXItZW1lcmFsZC01MDAgYmctZW1lcmFsZC05MDAvMjAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdib3JkZXItc2xhdGUtNzAwIGJnLXNsYXRlLTgwMC80MCBob3ZlcjpiZy1zbGF0ZS04MDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS01MDBcIj57bC5jb2RlfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS0yMDBcIj57bC5uYXRpdmV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzExcHhdIHRleHQtc2xhdGUtNTAwXCI+e2wubGFiZWx9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvTW9kYWxTaGVsbD5cbiAgICApO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBQbHVnLWluIFNldHRpbmcgLS0gbW9kYWwgdy8gbGlzdCArIHVwbG9hZCB6b25lXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4vKiBQZXItcGx1Zy1pbiBtb2NrIGNvbmZpZ3VyYXRpb24gZmllbGRzLiAgS2V5cyBtYXAgdG8gcGx1Zy1pbiBgaWRgLiAqL1xuY29uc3QgUExVR0lOX0NPTkZJR19GSUVMRFMgPSB7XG4gICAgd2VhdGhlcjogICAgW1xuICAgICAgICB7IGtleToncHJvdmlkZXInLCAgbGFiZWw6J1Byb3ZpZGVyJywgICAgICAgICAgdHlwZTonc2VsZWN0JywgIG9wdGlvbnM6WydPcGVuLU1ldGVvJywnTldTJywnRUNNV0YnXSwgZGVmOidPcGVuLU1ldGVvJyB9LFxuICAgICAgICB7IGtleToncmVmcmVzaCcsICAgbGFiZWw6J1JlZnJlc2ggaW50ZXJ2YWwnLCAgdHlwZTonc2VsZWN0JywgIG9wdGlvbnM6WycxIG1pbicsJzUgbWluJywnMTUgbWluJywnMzAgbWluJywnMSBoJ10sIGRlZjonMTUgbWluJyB9LFxuICAgICAgICB7IGtleTonY2FjaGUnLCAgICAgbGFiZWw6J0NhY2hlIFRUTCAobWluKScsICAgdHlwZTonbnVtYmVyJywgIGRlZjozMCB9LFxuICAgIF0sXG4gICAgZ2l2b25pOiAgICAgW1xuICAgICAgICB7IGtleTonY2xpbWF0ZScsICAgbGFiZWw6J0NsaW1hdGUgbW9kZWwnLCAgICAgdHlwZTonc2VsZWN0JywgIG9wdGlvbnM6WydHaXZvbmkgMTk5MicsJ0FTSFJBRSA1NScsJ0FkYXB0aXZlJ10sIGRlZjonR2l2b25pIDE5OTInIH0sXG4gICAgICAgIHsga2V5OidtYXNzaXZlJywgICBsYWJlbDonSGVhdnl3ZWlnaHQgY29uc3RydWN0aW9uJywgIHR5cGU6J3RvZ2dsZScsIGRlZjpmYWxzZSB9LFxuICAgIF0sXG4gICAgc3dlZXRfc3BvdDogW1xuICAgICAgICB7IGtleTondHJhY2tpbmcnLCAgbGFiZWw6J1RyYWNrIG91dGRvb3IgUkgnLCAgdHlwZTondG9nZ2xlJywgZGVmOnRydWUgfSxcbiAgICAgICAgeyBrZXk6J2h5c3QnLCAgICAgIGxhYmVsOidIeXN0ZXJlc2lzICglIFJIKScsIHR5cGU6J251bWJlcicsIGRlZjoyIH0sXG4gICAgXSxcbiAgICBnMzY6ICAgICAgICBbXG4gICAgICAgIHsga2V5Oidtb2RlJywgICAgICBsYWJlbDonU2VxdWVuY2UgbW9kZScsICAgICB0eXBlOidzZWxlY3QnLCAgb3B0aW9uczpbJ1NpbmdsZS16b25lIFZBVicsJ011bHRpLXpvbmUgVkFWJywnRE9BUyB3LyBGQ1UnXSwgZGVmOidNdWx0aS16b25lIFZBVicgfSxcbiAgICAgICAgeyBrZXk6J3ZlcmJvc2UnLCAgIGxhYmVsOidWZXJib3NlIGxvZ2dpbmcnLCAgIHR5cGU6J3RvZ2dsZScsIGRlZjpmYWxzZSB9LFxuICAgIF0sXG4gICAgZGlidDogICAgICAgW1xuICAgICAgICB7IGtleTonaG9zdCcsICAgICAgbGFiZWw6J0JyaWRnZSBob3N0JywgICAgICAgdHlwZTondGV4dCcsICAgZGVmOicxOTIuMTY4LjEuMTAwJyB9LFxuICAgICAgICB7IGtleToncG9ydCcsICAgICAgbGFiZWw6J1RlbGVncmFtIHBvcnQnLCAgICAgdHlwZTonbnVtYmVyJywgZGVmOjQ3ODA4IH0sXG4gICAgICAgIHsga2V5Oidwb2xsX21zJywgICBsYWJlbDonUG9sbCBpbnRlcnZhbCAobXMpJyx0eXBlOidudW1iZXInLCBkZWY6MjAwMCB9LFxuICAgIF0sXG4gICAgbGlnaHRpbmc6ICAgW1xuICAgICAgICB7IGtleTonZ2F0ZXdheScsICAgbGFiZWw6J01vZGJ1cyBnYXRld2F5IElQJywgdHlwZTondGV4dCcsICAgZGVmOicxMC4wLjAuNTAnIH0sXG4gICAgICAgIHsga2V5Oid1bml0X2lkJywgICBsYWJlbDonVW5pdCBJRCcsICAgICAgICAgICB0eXBlOidudW1iZXInLCBkZWY6MSB9LFxuICAgICAgICB7IGtleTondGNwX3BvcnQnLCAgbGFiZWw6J1RDUCBwb3J0JywgICAgICAgICAgdHlwZTonbnVtYmVyJywgZGVmOjUwMiB9LFxuICAgIF0sXG59O1xuXG5mdW5jdGlvbiBQbHVnaW5zTW9kYWwoeyBjZmcsIHNldENmZywgb25DbG9zZSwgb25TYXZlIH0pIHtcbiAgICBjb25zdCBBTEwgPSBbXG4gICAgICAgIHsgaWQ6J3dlYXRoZXInLCAgICAgbmFtZTonV2VhdGhlcicsICAgICAgICAgZGVzYzonT3Blbi1NZXRlbyBPQSBmZWVkJywgICAgICAgICAgdmVyOicyLjEuMCcgfSxcbiAgICAgICAgeyBpZDonZ2l2b25pJywgICAgICBuYW1lOidHaXZvbmkgRW5naW5lJywgICBkZXNjOidDbGltYXRlLXN0cmF0ZWd5IG92ZXJsYXknLCAgICB2ZXI6JzEuMy40JyB9LFxuICAgICAgICB7IGlkOidzd2VldF9zcG90JywgIG5hbWU6J1N3ZWV0LVNwb3QgUkgnLCAgIGRlc2M6J0FkanVzdGFibGUgUkggYmFuZCcsICAgICAgICAgIHZlcjonMS4wLjEnIH0sXG4gICAgICAgIHsgaWQ6J2czNicsICAgICAgICAgbmFtZTonRzM2IFNlcXVlbmNlcycsICAgZGVzYzonQVNIUkFFIEd1aWRlbGluZSAzNicsICAgICAgICAgdmVyOicwLjkuMicgfSxcbiAgICAgICAgeyBpZDonZGlidCcsICAgICAgICBuYW1lOidESUJUIEJyaWRnZScsICAgICBkZXNjOidEZWx0YSBDb250cm9scyAoRElCVCkgQkFDbmV0IGJyaWRnZScsICAgICAgICAgICB2ZXI6JzAuNC4wJyB9LFxuICAgICAgICB7IGlkOidsaWdodGluZycsICAgIG5hbWU6J0xpZ2h0aW5nIChSZWQ1KScsIGRlc2M6J1YzLjAgTW9kYnVzIFRDUCBjbGllbnQnLCAgICAgIHZlcjonMC4xLjAtYmV0YScgfSxcbiAgICBdO1xuICAgIGNvbnN0IHRvZ2dsZSA9IChpZCkgPT4gc2V0Q2ZnKGMgPT4gKHtcbiAgICAgICAgLi4uYyxcbiAgICAgICAgZW5hYmxlZDogYy5lbmFibGVkLmluY2x1ZGVzKGlkKSA/IGMuZW5hYmxlZC5maWx0ZXIoeCA9PiB4ICE9PSBpZCkgOiBbLi4uYy5lbmFibGVkLCBpZF1cbiAgICB9KSk7XG5cbiAgICAvKiBleHBhbnNpb24gc3RhdGUg4oCUIHdoaWNoIHBsdWctaW4ncyBcIkNvbmZpZ3VyZVwiIHBhbmVsIGlzIG9wZW4gKi9cbiAgICBjb25zdCBbZXhwYW5kZWRJZCwgc2V0RXhwYW5kZWRJZF0gPSBSZWFjdC51c2VTdGF0ZShudWxsKTtcblxuICAgIGNvbnN0IHVwZGF0ZUZpZWxkID0gKHBsdWdpbklkLCBmaWVsZEtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgc2V0Q2ZnKGMgPT4gKHtcbiAgICAgICAgICAgIC4uLmMsXG4gICAgICAgICAgICBmaWVsZHM6IHsgLi4uKGMuZmllbGRzIHx8IHt9KSwgW3BsdWdpbklkXTogeyAuLi4oKGMuZmllbGRzIHx8IHt9KVtwbHVnaW5JZF0gfHwge30pLCBbZmllbGRLZXldOiB2YWx1ZSB9IH1cbiAgICAgICAgfSkpO1xuICAgIH07XG5cbiAgICBjb25zdCBmaWVsZFZhbCA9IChwbHVnaW5JZCwgZmllbGQpID0+IHtcbiAgICAgICAgY29uc3Qgc3RvcmVkID0gY2ZnLmZpZWxkcyAmJiBjZmcuZmllbGRzW3BsdWdpbklkXSAmJiBjZmcuZmllbGRzW3BsdWdpbklkXVtmaWVsZC5rZXldO1xuICAgICAgICByZXR1cm4gc3RvcmVkICE9PSB1bmRlZmluZWQgPyBzdG9yZWQgOiBmaWVsZC5kZWY7XG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxNb2RhbFNoZWxsIHRpdGxlPVwiUGx1Zy1pbiBTZXR0aW5nXCIgc3VidGl0bGU9XCJFbmFibGUsIHVwbG9hZCBvciBtb2RpZnkgcGx1Zy1pbnNcIiBhY2NlbnQ9XCJwaW5rXCIgb25DbG9zZT17b25DbG9zZX0gb25TYXZlPXtvblNhdmV9IHNpemU9XCJ3aWRlXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMyBtYXgtaC1bNjB2aF0gb3ZlcmZsb3cteS1hdXRvIHByLTFcIj5cbiAgICAgICAgICAgICAgICB7QUxMLm1hcChwID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb24gPSBjZmcuZW5hYmxlZC5pbmNsdWRlcyhwLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhwYW5kZWQgPSBleHBhbmRlZElkID09PSBwLmlkO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWVsZHMgPSBQTFVHSU5fQ09ORklHX0ZJRUxEU1twLmlkXSB8fCBbXTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtwLmlkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2Byb3VuZGVkLXhsIGJvcmRlciB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke29uID8gJ2JvcmRlci1waW5rLTUwMC80MCBiZy1waW5rLTkwMC8xMCcgOiAnYm9yZGVyLXNsYXRlLTcwMCBiZy1zbGF0ZS04MDAvNDAnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2V4cGFuZGVkID8gJ3JpbmctMSByaW5nLXBpbmstNTAwLzMwJyA6ICcnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHAtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS0xMDBcIj57cC5uYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1sLTIgdGV4dC1bMTBweF0gZm9udC1tb25vIHRleHQtc2xhdGUtNTAwXCI+dntwLnZlcn08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXNsYXRlLTQwMFwiPntwLmRlc2N9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHRvZ2dsZShwLmlkKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BwbHVnaW4tdG9nZ2xlLSR7cC5pZH1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweC0zIHB5LTEgcm91bmRlZC1tZCB0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgYm9yZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke29uID8gJ2JvcmRlci1waW5rLTUwMC82MCB0ZXh0LXBpbmstMzAwIGJnLXBpbmstOTAwLzMwJyA6ICdib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtNDAwIGJnLXNsYXRlLTgwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge29uID8gJ0VuYWJsZWQnIDogJ0Rpc2FibGVkJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBzZXRFeHBhbmRlZElkKGV4cGFuZGVkID8gbnVsbCA6IHAuaWQpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17YHBsdWdpbi1jb25maWctJHtwLmlkfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTMgcHktMSByb3VuZGVkLW1kIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayBib3JkZXIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7ZXhwYW5kZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdib3JkZXItcGluay01MDAgYmctcGluay05MDAvMzAgdGV4dC1waW5rLTIwMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtNDAwIGJnLXNsYXRlLTgwMCBob3ZlcjpiZy1zbGF0ZS03MDAgaG92ZXI6Ym9yZGVyLXBpbmstNTAwLzUwIGhvdmVyOnRleHQtcGluay0zMDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtleHBhbmRlZCA/ICdDbG9zZSDilrQnIDogJ0NvbmZpZ3VyZSDilr4nfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtleHBhbmRlZCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHgtNCBwYi00IGJvcmRlci10IGJvcmRlci1waW5rLTUwMC8yMCBiZy1zbGF0ZS05NTAvNDBcIiBkYXRhLXRlc3RpZD17YHBsdWdpbi1jb25maWctcGFuZWwtJHtwLmlkfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2ZpZWxkcy5sZW5ndGggPT09IDAgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXNsYXRlLTUwMCBpdGFsaWMgcHktM1wiPk5vIGNvbmZpZ3VyYWJsZSBvcHRpb25zIGZvciB0aGlzIHBsdWctaW4geWV0LjwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIG1kOmdyaWQtY29scy0yIGdhcC0zIHB0LTNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2ZpZWxkcy5tYXAoZiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2ID0gZmllbGRWYWwocC5pZCwgZik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtmLmtleX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTUwMCBibG9jayBtYi0xXCI+e2YubGFiZWx9PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2YudHlwZSA9PT0gJ3NlbGVjdCcgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dCBjdXJzb3ItcG9pbnRlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt2fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZUZpZWxkKHAuaWQsIGYua2V5LCBlLnRhcmdldC52YWx1ZSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmLm9wdGlvbnMubWFwKG8gPT4gPG9wdGlvbiBrZXk9e299IHZhbHVlPXtvfT57b308L29wdGlvbj4pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmLnR5cGUgPT09ICdudW1iZXInICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt2fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlRmllbGQocC5pZCwgZi5rZXksICtlLnRhcmdldC52YWx1ZSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2YudHlwZSA9PT0gJ3RleHQnICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZUZpZWxkKHAuaWQsIGYua2V5LCBlLnRhcmdldC52YWx1ZSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2YudHlwZSA9PT0gJ3RvZ2dsZScgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB1cGRhdGVGaWVsZChwLmlkLCBmLmtleSwgIXYpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B3LWZ1bGwgcHktMiByb3VuZGVkLWxnIHRleHQteHMgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGJvcmRlciB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHt2XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctcGluay03MDAvNDAgYm9yZGVyLXBpbmstNTAwLzYwIHRleHQtcGluay0yMDAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctc2xhdGUtODAwIGJvcmRlci1zbGF0ZS02MDAgdGV4dC1zbGF0ZS00MDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt2ID8gJ09OJyA6ICdPRkYnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktZW5kIGdhcC0yIG10LTQgcHQtMyBib3JkZXItdCBib3JkZXItc2xhdGUtODAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVzZXQgdGhpcyBwbHVnLWluJ3MgZmllbGRzIHRvIGRlZmF1bHRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q2ZnKGMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXh0ID0geyAuLi4oYy5maWVsZHMgfHwge30pIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBuZXh0W3AuaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyAuLi5jLCBmaWVsZHM6IG5leHQgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC0zIHB5LTEuNSByb3VuZGVkLW1kIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayBib3JkZXIgYm9yZGVyLXNsYXRlLTYwMCB0ZXh0LXNsYXRlLTQwMCBob3ZlcjpiZy1zbGF0ZS04MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVzZXQgZGVmYXVsdHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHNldEV4cGFuZGVkSWQobnVsbCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC0zIHB5LTEuNSByb3VuZGVkLW1kIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayBiZy1waW5rLTYwMCBob3ZlcjpiZy1waW5rLTUwMCB0ZXh0LXdoaXRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERvbmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC01IHAtNCBib3JkZXItMiBib3JkZXItZGFzaGVkIGJvcmRlci1zbGF0ZS03MDAgcm91bmRlZC14bCB0ZXh0LWNlbnRlciBob3Zlcjpib3JkZXItcGluay01MDAvNDAgdHJhbnNpdGlvbi1hbGwgY3Vyc29yLXBvaW50ZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtM3hsIG1iLTFcIj7ipLQ8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1ibGFjayB0ZXh0LXNsYXRlLTMwMFwiPkRyb3AgYSAucHkgLyAuemlwIC8gLnJlZDUgcGx1Zy1pbiBoZXJlPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMXB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0xXCI+b3IgY2xpY2sgdG8gY2hvb3NlIGEgZmlsZSAobW9jayDigJQgbm90IHdpcmVkKTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvTW9kYWxTaGVsbD5cbiAgICApO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBNb2RhbCBTaGVsbCAtLSBzaGFyZWRcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIE1vZGFsU2hlbGwoeyB0aXRsZSwgc3VidGl0bGUsIGFjY2VudD0naW5kaWdvJywgb25DbG9zZSwgb25TYXZlLCBzaXplPScnLCBjaGlsZHJlbiB9KSB7XG4gICAgY29uc3QgY29sb3JNYXAgPSB7XG4gICAgICAgIGluZGlnbzonIzgxOGNmOCcsIGFtYmVyOicjZmJiZjI0JywgZW1lcmFsZDonIzM0ZDM5OScsIHBpbms6JyNmNDcyYjYnXG4gICAgfTtcbiAgICBjb25zdCBjID0gY29sb3JNYXBbYWNjZW50XSB8fCAnIzgxOGNmOCc7XG4gICAgY29uc3Qgc2l6ZU1hcCA9IHtcbiAgICAgICAgd2lkZTogJ21heC13LTJ4bCcsXG4gICAgICAgIG1hcDogICdtYXgtdy0zeGwnLFxuICAgICAgICBtYXg6ICAnbWF4LXctWzk2dnddIHctWzk2dnddIGgtWzkydmhdJyxcbiAgICB9O1xuICAgIGNvbnN0IHdpZHRoID0gc2l6ZU1hcFtzaXplXSB8fCAnbWF4LXctbWQnO1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZml4ZWQgaW5zZXQtMCB6LTUwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIG1vZGFsLWJhY2tkcm9wXCIgb25DbGljaz17b25DbG9zZX0+XG4gICAgICAgICAgICB7LyogRmxleC1jb2x1bW4gc2hlbGw6IGhlYWRlciAoZml4ZWQpICsgc2Nyb2xsYWJsZSBjb250ZW50ICsgc3RpY2t5IGZvb3Rlci5cbiAgICAgICAgICAgICAgICBDcml0aWNhbCBmb3Igc2l6ZT1cIm1heFwiIHdoZXJlIGNoaWxkcmVuIGFsb25lIGV4Y2VlZCB0aGUgbW9kYWwgaGVpZ2h0XG4gICAgICAgICAgICAgICAgYW5kIHdvdWxkIG90aGVyd2lzZSBwdXNoIHRoZSBTYXZlICYgcmV0dXJuIGJ1dHRvbiBiZWxvdyB0aGUgdmlld3BvcnQuICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BiZy1zbGF0ZS05MDAgYm9yZGVyLTIgcm91bmRlZC0yeGwgdy1mdWxsICR7d2lkdGh9IG14LTQgZmFkZS11cCBmbGV4IGZsZXgtY29sYH1cbiAgICAgICAgICAgICAgICAgb25DbGljaz17KGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCl9XG4gICAgICAgICAgICAgICAgIHN0eWxlPXt7Ym9yZGVyQ29sb3I6YCR7Y302NmAsIG1heEhlaWdodDogJzkydmgnfX0+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLXN0YXJ0IGp1c3RpZnktYmV0d2VlbiBwLTYgcGItNCBib3JkZXItYiBib3JkZXItc2xhdGUtODAwLzYwIHNocmluay0wXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1sZyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3RcIiBzdHlsZT17e2NvbG9yOmN9fT57dGl0bGV9PC9oMz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS01MDAgbXQtMVwiPntzdWJ0aXRsZX08L3A+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwibW9kYWwtY2xvc2VcIiBvbkNsaWNrPXtvbkNsb3NlfSBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCBob3Zlcjp0ZXh0LXdoaXRlIHRleHQtMnhsIGxlYWRpbmctbm9uZVwiPsOXPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTEgbWluLWgtMCBvdmVyZmxvdy15LWF1dG8gcHgtNiBweS01XCI+XG4gICAgICAgICAgICAgICAgICAgIHtjaGlsZHJlbn1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktZW5kIGdhcC0zIHB4LTYgcHktNCBib3JkZXItdCBib3JkZXItc2xhdGUtODAwIHNocmluay0wIGJnLXNsYXRlLTkwMCByb3VuZGVkLWItMnhsXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJtb2RhbC1jYW5jZWxcIiBvbkNsaWNrPXtvbkNsb3NlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTQgcHktMiByb3VuZGVkLWxnIGJnLXNsYXRlLTgwMCBib3JkZXIgYm9yZGVyLXNsYXRlLTcwMCB0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayB0ZXh0LXNsYXRlLTQwMCBob3ZlcjpiZy1zbGF0ZS03MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIENhbmNlbFxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cIm1vZGFsLXNhdmVcIiBvbkNsaWNrPXtvblNhdmV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtNSBweS0yIHJvdW5kZWQtbGcgdGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgdGV4dC13aGl0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOmMsIGJveFNoYWRvdzpgMCAwIDEycHggJHtjfTU1YH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgU2F2ZSAmIHJldHVybiDinJNcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuLyogbW91bnQgKi9cblJlYWN0RE9NLmNyZWF0ZVJvb3QoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKSkucmVuZGVyKDxBcHAvPik7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBQSxNQUFBLEdBQThCQyxLQUFLO0VBQTNCQyxRQUFRLEdBQUFGLE1BQUEsQ0FBUkUsUUFBUTtFQUFFQyxPQUFPLEdBQUFILE1BQUEsQ0FBUEcsT0FBTzs7QUFFekI7QUFDQTtBQUNBO0FBQ0EsSUFBTUMsS0FBSyxHQUFHO0FBQ1Y7QUFDSjtBQUNBO0FBQ0E7QUFDSTtFQUFFQyxHQUFHLEVBQUMsS0FBSztFQUFPQyxLQUFLLEVBQUMsV0FBVztFQUFRQyxHQUFHLEVBQUMsMEJB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LEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxHQUFDLElBQUksQ0FBQyxFQUFFLEdBQUdDLFFBQVEsQ0FBQztFQUNyRSxJQUFNUSxJQUFJLEdBQUcsQ0FBQyxHQUFHWCxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFUCxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFQSxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7RUFDN0YsSUFBTW1CLEdBQUcsR0FBSSxDQUFDLEdBQUdaLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUVQLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUVBLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUM3RixJQUFNb0IsSUFBSSxHQUFHLENBQUMsR0FBR2IsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRVAsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFQSxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQ2hFLENBQUMsRUFBRSxFQUFFQSxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUVBLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FB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