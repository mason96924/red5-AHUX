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

  /* Remove a saved location from the list.  Dedup-keyed by lat/lon so two
   * entries that share a name (e.g. "HOME" at the office vs the apartment)
   * are addressed individually -- removing one keeps the other.  Mirrors
   * the change to localStorage AND the server so the dashboard's Weather
   * button sees the deletion on its next read. */
  var removeSavedLoc = loc => {
    var key = loc.lat.toFixed(4) + ',' + loc.lon.toFixed(4);
    var next = savedLocs.filter(s => s.lat.toFixed(4) + ',' + s.lon.toFixed(4) !== key);
    setSavedLocs(next);
    try {
      localStorage.setItem('savedWeatherLocations', JSON.stringify(next));
    } catch (e) {/* private mode */}
    try {
      window.dispatchEvent(new CustomEvent('red5:weatherLocationChanged', {
        detail: {
          saved: next
        }
      }));
    } catch (e) {}
    /* Best-effort server sync.  Anonymous users get persisted:false back,
     * which is fine -- the local copy already reflects the removal. */
    fetch('/api/weather-location', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        saved: next
      })
    }).catch(() => {/* offline -- localStorage already updated */});
    /* If the operator just deleted the entry currently in the input,
     * blank the input so a stale selection isn't accidentally saved. */
    if ((cfg.siteName || '').trim() === loc.name) {
      setCfg(c => _objectSpread(_objectSpread({}, c), {}, {
        siteName: ''
      }));
    }
    if (next.length === 0) setSavedOpen(false);
  };

  /* Inline rename: typing into a row's name input updates the in-memory
   * `savedLocs` list (NOT persisted until "Save & Return").  Keyed by the
   * row's lat/lon so two same-named entries at different coordinates can
   * be renamed independently.  Trim is delayed until persist so the
   * operator can keep typing without the field "snapping" mid-edit. */
  var renameSavedLoc = (origLoc, newName) => {
    var key = origLoc.lat.toFixed(4) + ',' + origLoc.lon.toFixed(4);
    setSavedLocs(prev => prev.map(s => s.lat.toFixed(4) + ',' + s.lon.toFixed(4) === key ? _objectSpread(_objectSpread({}, s), {}, {
      name: newName
    }) : s));
    /* If the operator is renaming the entry that is currently the
     * "active" pick (siteName matches), keep the picker in sync. */
    var stillSelected = (cfg.siteName || '').trim() === origLoc.name && Math.abs(cfg.lat - origLoc.lat) < 1e-4 && Math.abs(cfg.lon - origLoc.lon) < 1e-4;
    if (stillSelected) {
      setCfg(c => _objectSpread(_objectSpread({}, c), {}, {
        siteName: newName,
        city: newName
      }));
    }
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
    var isActive = (cfg.siteName || '').trim() === loc.name && Math.abs(cfg.lat - loc.lat) < 1e-4 && Math.abs(cfg.lon - loc.lon) < 1e-4;
    /* Row is a <div role="button"> instead of <button>
       so the in-row trash <button> isn't nested
       inside another interactive element. */
    var rowKey = "".concat(loc.lat.toFixed(4), ",").concat(loc.lon.toFixed(4));
    return /*#__PURE__*/React.createElement("div", {
      key: rowKey,
      role: "button",
      tabIndex: 0,
      onClick: e => {
        /* Pick the row only when the operator clicks the
           coord/whitespace area, not the rename input or
           the trash button (those stopPropagation). */
        pickSavedLoc(loc);
      },
      onKeyDown: e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pickSavedLoc(loc);
        }
      },
      "data-testid": "loc-saved-opt-".concat(loc.name),
      className: "group flex items-center gap-2 px-3 py-2 border-b border-slate-800 last:border-b-0 hover:bg-amber-900/30 transition-colors cursor-pointer\n                                                            ".concat(isActive ? 'bg-amber-900/50' : '')
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex-1 min-w-0"
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      "data-testid": "loc-saved-rename-".concat(rowKey),
      value: loc.name,
      onChange: e => renameSavedLoc(loc, e.target.value),
      onClick: e => e.stopPropagation(),
      onKeyDown: e => {
        /* Enter while editing keeps the dropdown
           open -- finalising rename happens at
           Save & Return, not on Enter. */
        if (e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      "aria-label": "Rename saved location ".concat(loc.name),
      className: "w-full bg-transparent border-0 outline-none text-sm text-slate-100 font-medium px-0 py-0 focus:bg-slate-800/60 focus:px-1 focus:rounded hover:bg-slate-800/40 hover:px-1 hover:rounded transition-all"
    }), /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-slate-500 font-mono mt-0.5"
    }, loc.lat.toFixed(2), ", ", loc.lon.toFixed(2))), /*#__PURE__*/React.createElement("button", {
      type: "button",
      "data-testid": "loc-saved-remove-".concat(loc.name),
      "aria-label": "Remove ".concat(loc.name),
      title: "Remove ".concat(loc.name, " from saved locations"),
      onClick: e => {
        e.stopPropagation();
        removeSavedLoc(loc);
      },
      className: "shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-slate-500 hover:text-rose-300 hover:bg-rose-900/30 opacity-40 group-hover:opacity-100 transition-opacity"
    }, /*#__PURE__*/React.createElement("svg", {
      width: "14",
      height: "14",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2.2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M3 6h18"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M19 6l-1.5 13.2a2 2 0 0 1-2 1.8H8.5a2 2 0 0 1-2-1.8L5 6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 11v6M14 11v6"
    }))));
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBfd2Fsay5jb21waWxlZC5qcyIsIm5hbWVzIjpbIl9SZWFjdCIsIlJlYWN0IiwidXNlU3RhdGUiLCJ1c2VNZW1vIiwiU1RFUFMiLCJrZXkiLCJsYWJlbCIsInN1YiIsImtpbmQiLCJpY29uQ29sb3IiLCJhY2NlbnQiLCJocmVmIiwiQXBwIiwiX3VzZVN0YXRlIiwicHN5IiwibG9jYXRpb24iLCJsYW5ndWFnZSIsInBsdWdpbnMiLCJyZXBhaXIiLCJfdXNlU3RhdGUyIiwiX3NsaWNlZFRvQXJyYXkiLCJkb25lIiwic2V0RG9uZSIsIl91c2VTdGF0ZTMiLCJfdXNlU3RhdGU0Iiwicm91dGUiLCJzZXRSb3V0ZSIsIl91c2VTdGF0ZTUiLCJfdXNlU3RhdGU2IiwibW9kYWwiLCJzZXRNb2RhbCIsIl91c2VTdGF0ZTciLCJnaXZvbmkiLCJyaFByZXNldCIsInJoTG8iLCJyaEhpIiwidExvIiwidEhpIiwidGhlbWUiLCJkYXJrTGV2ZWwiLCJfdXNlU3RhdGU4IiwicHN5Q2ZnIiwic2V0UHN5Q2ZnIiwiX3VzZVN0YXRlOSIsInNpdGVOYW1lIiwiY2l0eSIsImxhdCIsImxvbiIsIl91c2VTdGF0ZTAiLCJsb2NDZmciLCJzZXRMb2NDZmciLCJfdXNlU3RhdGUxIiwidiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJhbGxvd2VkIiwiaW5kZXhPZiIsImxhbmciLCJlIiwiX3VzZVN0YXRlMTAiLCJsYW5nQ2ZnIiwic2V0TGFuZ0NmZyIsIl91c2VTdGF0ZTExIiwiZW5hYmxlZCIsIl91c2VTdGF0ZTEyIiwicGx1Z2luQ2ZnIiwic2V0UGx1Z2luQ2ZnIiwiY29tcGxldGVDb3VudCIsIk9iamVjdCIsInZhbHVlcyIsImZpbHRlciIsIkJvb2xlYW4iLCJsZW5ndGgiLCJmaW5pc2giLCJkIiwiX29iamVjdFNwcmVhZCIsImNyZWF0ZUVsZW1lbnQiLCJQc3lDaGFydFNldHRpbmdQYWdlIiwiY2ZnIiwic2V0Q2ZnIiwib25CYWNrIiwib25TYXZlIiwiY2xhc3NOYW1lIiwib25DbGljayIsInNldEl0ZW0iLCJzdHlsZSIsIndpZHRoIiwiYXNwZWN0UmF0aW8iLCJhbmltYXRpb25EZWxheSIsInNyYyIsImFsdCIsIm9wYWNpdHkiLCJiYWNrZ3JvdW5kIiwibWFwIiwicyIsImkiLCJhbmdsZURlZyIsImFuZ2xlIiwiTWF0aCIsIlBJIiwiciIsIngiLCJjb3MiLCJ5Iiwic2luIiwiQ2lyY2xlVGlsZSIsInN0ZXAiLCJpbmRleCIsImxlZnRQY3QiLCJ0b3BQY3QiLCJ3aW5kb3ciLCJ2aWV3Qm94IiwicHJlc2VydmVBc3BlY3RSYXRpbyIsImlkIiwibWFza1VuaXRzIiwiaGVpZ2h0IiwiZmlsbCIsIl8iLCJhIiwiY3giLCJjeSIsInN0cm9rZSIsInN0cm9rZVdpZHRoIiwibWFzayIsImNvbmNhdCIsInRleHRTaGFkb3ciLCJMb2NhdGlvbk1vZGFsIiwib25DbG9zZSIsIkxhbmd1YWdlTW9kYWwiLCJQbHVnaW5zTW9kYWwiLCJUaWxlIiwiX3JlZiIsImJvcmRlciIsIlRpbGVJY29uIiwiY29sb3IiLCJfcmVmMiIsInJpbmdDb2xvciIsImxlZnQiLCJ0b3AiLCJ0cmFuc2Zvcm0iLCJib3hTaGFkb3ciLCJfcmVmMyIsInN0cm9rZUxpbmVjYXAiLCJzdHJva2VMaW5lam9pbiIsIl9leHRlbmRzIiwiX3JlZjQiLCJ1cGRhdGUiLCJrIiwiYyIsInVzZUVmZmVjdCIsInJhdyIsInByZXNldCIsInBhdGNoIiwicCIsIkpTT04iLCJwYXJzZSIsIk51bWJlciIsImlzRmluaXRlIiwibG8iLCJoaSIsIlJIX1BSRVNFVFMiLCJmaW5kIiwidGgiLCJkbCIsInBhcnNlRmxvYXQiLCJ0clJhdyIsInRyIiwibWluIiwibWF4Iiwia2V5cyIsInBlcnNpc3RBbmRTYXZlIiwic3RyaW5naWZ5IiwiU3RyaW5nIiwiZGlzcGF0Y2hFdmVudCIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwiY29uc29sZSIsImluZm8iLCJ3YXJuIiwiUHN5U2tlbGV0b24iLCJQc3lDb250cm9sUGFuZWwiLCJub3RlIiwiX3JlZjUiLCJXIiwiSCIsInBhZCIsInJpZ2h0IiwiYm90dG9tIiwiZ3JpZFciLCJncmlkSCIsIlRfTUlOIiwiVF9NQVgiLCJXX01JTiIsIldfTUFYIiwidCIsInciLCJfZ2V0VyIsImdldFciLCJyaCIsInNhZmVQdHMiLCJhcnIiLCJ0b0ZpeGVkIiwiam9pbiIsInJoODAiLCJwdXNoIiwicmgxMDAiLCJyaDIwTGluZSIsInJoMjBfQ1oiLCJDWiIsInJoSGlfdG9wIiwidHQiLCJyaExvX2JvdCIsIlNXRUVUIiwiTlYiLCJNYXNzIiwiTUNWIiwiRVZBUCIsIndpbnRlclJIODAiLCJ3aW50ZXJSSDIwIiwiV0lOVEVSIiwiaXNvcGxldGhzIiwiaXNMaWdodCIsInBhbGV0dGUiLCJiZyIsImdyaWQiLCJ0aWNrIiwiYXhpcyIsInBhbmVsQmciLCJwYW5lbEJvcmRlciIsInBpbGxCZyIsInBpbGxGZyIsIm1ldGFGZyIsImRpbUZpbHRlciIsImJvcmRlckNvbG9yIiwiYm9yZGVyUmFkaXVzIiwiQXJyYXkiLCJmcm9tIiwieDEiLCJ5MSIsIngyIiwieTIiLCJmb250U2l6ZSIsInRleHRBbmNob3IiLCJwdHMiLCJ3dyIsInBvaW50cyIsInN0cm9rZURhc2hhcnJheSIsImZsb29yIiwiZm9udFdlaWdodCIsImZpbGxPcGFjaXR5IiwiY2xpcFBhdGhVbml0cyIsImNsaXBQYXRoIiwibGV0dGVyU3BhY2luZyIsInBhaW50T3JkZXIiLCJfcmVmNiIsInJvdW5kIiwidHlwZSIsInZhbHVlIiwib25DaGFuZ2UiLCJ0YXJnZXQiLCJhY2NlbnRDb2xvciIsIl9ub3JtYWxpemVMb2NzIiwic2VlbiIsIlNldCIsIm91dCIsImwiLCJuYW1lIiwidHJpbSIsImhhcyIsImFkZCIsIl9yZWY3IiwibWFwQm94UmVmIiwidXNlUmVmIiwibWFwUmVmIiwibWFya2VyUmVmIiwiX1JlYWN0JHVzZVN0YXRlIiwiX1JlYWN0JHVzZVN0YXRlMiIsImdlb0J1c3kiLCJzZXRHZW9CdXN5IiwiX1JlYWN0JHVzZVN0YXRlMyIsImlzQXJyYXkiLCJfUmVhY3QkdXNlU3RhdGU0Iiwic2F2ZWRMb2NzIiwic2V0U2F2ZWRMb2NzIiwiY2FuY2VsbGVkIiwiX2FzeW5jVG9HZW5lcmF0b3IiLCJmZXRjaCIsImNyZWRlbnRpYWxzIiwiY2FjaGUiLCJvayIsImoiLCJqc29uIiwic2F2ZWQiLCJfUmVhY3QkdXNlU3RhdGU1IiwiX1JlYWN0JHVzZVN0YXRlNiIsInNhdmVkT3BlbiIsInNldFNhdmVkT3BlbiIsInNhdmVkUmVmIiwib25Eb2NDbGljayIsImN1cnJlbnQiLCJjb250YWlucyIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJvblNpdGVOYW1lQ2hhbmdlIiwibmV3TmFtZSIsImhpdCIsInNldFZpZXciLCJwaWNrU2F2ZWRMb2MiLCJsb2MiLCJyZW1vdmVTYXZlZExvYyIsIm5leHQiLCJtZXRob2QiLCJoZWFkZXJzIiwiYm9keSIsImNhdGNoIiwicmVuYW1lU2F2ZWRMb2MiLCJvcmlnTG9jIiwicHJldiIsInN0aWxsU2VsZWN0ZWQiLCJhYnMiLCJfUmVhY3QkdXNlU3RhdGU3IiwiX1JlYWN0JHVzZVN0YXRlOCIsInNlYXJjaFEiLCJzZXRTZWFyY2hRIiwiX1JlYWN0JHVzZVN0YXRlOSIsIl9SZWFjdCR1c2VTdGF0ZTAiLCJzZWFyY2hIaXRzIiwic2V0U2VhcmNoSGl0cyIsIl9SZWFjdCR1c2VTdGF0ZTEiLCJfUmVhY3QkdXNlU3RhdGUxMCIsInNlYXJjaEJ1c3kiLCJzZXRTZWFyY2hCdXN5IiwiX1JlYWN0JHVzZVN0YXRlMTEiLCJfUmVhY3QkdXNlU3RhdGUxMiIsInNlYXJjaE9wZW4iLCJzZXRTZWFyY2hPcGVuIiwic2VhcmNoRGVib3VuY2VSZWYiLCJydW5TZWFyY2giLCJfcmVmOSIsInEiLCJ1cmwiLCJlbmNvZGVVUklDb21wb25lbnQiLCJfeCIsImFwcGx5IiwiYXJndW1lbnRzIiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsInBpY2tTZWFyY2hIaXQiLCJkaXNwbGF5X25hbWUiLCJyZXZlcnNlR2VvY29kZSIsIl9yZWYwIiwiYWRkcmVzcyIsInRvd24iLCJ2aWxsYWdlIiwiaGFtbGV0IiwiY291bnR5IiwicmVnaW9uIiwic3RhdGUiLCJjb3VudHJ5IiwiX3gyIiwiX3gzIiwiTCIsInpvb21Db250cm9sIiwiYXR0cmlidXRpb25Db250cm9sIiwidGlsZUxheWVyIiwibWF4Wm9vbSIsImF0dHJpYnV0aW9uIiwiYWRkVG8iLCJtYXJrZXIiLCJkcmFnZ2FibGUiLCJiaW5kVG9vbHRpcCIsInBlcm1hbmVudCIsImFwcGx5TGF0TG9uIiwibiIsIm9uIiwibGwiLCJnZXRMYXRMbmciLCJsbmciLCJzZXRMYXRMbmciLCJsYXRsbmciLCJpbnZhbGlkYXRlU2l6ZSIsInJlbW92ZSIsInBhblRvIiwiX1JlYWN0JHVzZVN0YXRlMTMiLCJfUmVhY3QkdXNlU3RhdGUxNCIsImdlb1N0YXRlIiwic2V0R2VvU3RhdGUiLCJ1c2VNeUxvY2F0aW9uIiwibmF2aWdhdG9yIiwiZ2VvbG9jYXRpb24iLCJlcnIiLCJnZXRDdXJyZW50UG9zaXRpb24iLCJwb3MiLCJjb29yZHMiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsIm1zZyIsImNvZGUiLCJtZXNzYWdlIiwiZW5hYmxlSGlnaEFjY3VyYWN5IiwidGltZW91dCIsIm1heGltdW1BZ2UiLCJfUmVhY3QkdXNlU3RhdGUxNSIsIl9SZWFjdCR1c2VTdGF0ZTE2Iiwic2F2ZU1zZyIsInNldFNhdmVNc2ciLCJfcmVmMSIsImRlZHVwZWQiLCJuZXh0U2F2ZWQiLCJzbGljZSIsInBlcnNpc3RlZCIsIndhcm5pbmciLCJhY3RpdmUiLCJkZWZhdWx0IiwiX2xhc3RXZWF0aGVyTG9jYXRpb25TYXZlIiwiTW9kYWxTaGVsbCIsInRpdGxlIiwic3VidGl0bGUiLCJzaXplIiwibWluSGVpZ2h0IiwicmVmIiwib3ZlcmZsb3ciLCJvbkZvY3VzIiwicGxhY2Vob2xkZXIiLCJvdXRsaW5lIiwiaCIsInBsYWNlX2lkIiwiY2xhc3MiLCJ0cmFuc2l0aW9uIiwiaXNBY3RpdmUiLCJyb3dLZXkiLCJyb2xlIiwidGFiSW5kZXgiLCJvbktleURvd24iLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsInR5cGVkIiwiY3VyIiwiY29uZmxpY3QiLCJkaXNhYmxlZCIsInByb3RvY29sIiwieiIsIl9yZWYxMCIsImxhbmdzIiwibmF0aXZlIiwiRXZlbnQiLCJQTFVHSU5fQ09ORklHX0ZJRUxEUyIsIndlYXRoZXIiLCJvcHRpb25zIiwiZGVmIiwic3dlZXRfc3BvdCIsImczNiIsImRpYnQiLCJsaWdodGluZyIsIl9yZWYxMSIsIkFMTCIsImRlc2MiLCJ2ZXIiLCJ0b2dnbGUiLCJpbmNsdWRlcyIsIl9SZWFjdCR1c2VTdGF0ZTE3IiwiX1JlYWN0JHVzZVN0YXRlMTgiLCJleHBhbmRlZElkIiwic2V0RXhwYW5kZWRJZCIsInVwZGF0ZUZpZWxkIiwicGx1Z2luSWQiLCJmaWVsZEtleSIsImZpZWxkcyIsImZpZWxkVmFsIiwiZmllbGQiLCJzdG9yZWQiLCJ1bmRlZmluZWQiLCJleHBhbmRlZCIsImYiLCJvIiwiX3JlZjEyIiwiX3JlZjEyJGFjY2VudCIsIl9yZWYxMiRzaXplIiwiY2hpbGRyZW4iLCJjb2xvck1hcCIsImluZGlnbyIsImFtYmVyIiwiZW1lcmFsZCIsInBpbmsiLCJzaXplTWFwIiwid2lkZSIsIm1heEhlaWdodCIsIlJlYWN0RE9NIiwiY3JlYXRlUm9vdCIsImdldEVsZW1lbnRCeUlkIiwicmVuZGVyIl0sInNvdXJjZXMiOlsiLi4vc3JjL3NldHVwLXdhbGsvc2V0dXBfd2Fsay5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgeyB1c2VTdGF0ZSwgdXNlTWVtbyB9ID0gUmVhY3Q7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFNURVAgREVGSU5JVElPTlMg4oCUIHRoZSA0IHdhbGsgcGF0aHMgdGhlIHVzZXIgZGVzY3JpYmVkXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5jb25zdCBTVEVQUyA9IFtcbiAgICAvKiBXYWxrIG9yZGVyIGlzIHRoZSBwZW50YWdvbiB0cmF2ZXJzYWw6IHRvcCDihpIgdXBwZXItcmlnaHQg4oaSIGxvd2VyLXJpZ2h0IOKGkiBsb3dlci1sZWZ0IOKGkiB1cHBlci1sZWZ0LlxuICAgICAgIExhYmVscyBpbnRlbnRpb25hbGx5IGRyb3AgdGhlIHJlZHVuZGFudCBcIlNldHRpbmdcIiBzdWZmaXggc28gdGhlXG4gICAgICAgbWFpbiBoZWFkaW5nIGluc2lkZSBlYWNoIGNpcmNsZSBjYW4gcmVuZGVyIGluIG9uZSBsaW5lIGF0IGEgbGFyZ2VyXG4gICAgICAgZm9udCB3ZWlnaHQuICovXG4gICAgeyBrZXk6J3BzeScsICAgICAgbGFiZWw6J1BzeSBDaGFydCcsICAgICAgIHN1YjonR2l2b25pIMK3IFJIIHJhbmdlIMK3IGF4aXMnLCAgICAgICBraW5kOidwYWdlJywgIGljb25Db2xvcjonIzgxOGNmOCcsIGFjY2VudDonaW5kaWdvJyB9LFxuICAgIHsga2V5Oidsb2NhdGlvbicsIGxhYmVsOidMb2NhdGlvbicsICAgICAgICBzdWI6J0NpdHkgwrcgbGF0IC8gbG9uZycsICAgICAgICAgICAgICBraW5kOidtb2RhbCcsIGljb25Db2xvcjonI2ZiYmYyNCcsIGFjY2VudDonYW1iZXInICB9LFxuICAgIHsga2V5OidsYW5ndWFnZScsIGxhYmVsOidMYW5ndWFnZScsICAgICAgICBzdWI6J0VOIMK3IENTIMK3IENUIMK3IEpQIMK3IEtPIMK3IOKApicsICAgICBraW5kOidtb2RhbCcsIGljb25Db2xvcjonIzM0ZDM5OScsIGFjY2VudDonZW1lcmFsZCd9LFxuICAgIHsga2V5OidwbHVnaW5zJywgIGxhYmVsOidQbHVnLWluJywgICAgICAgICBzdWI6J0xpc3QgwrcgdXBsb2FkIMK3IG1vZGlmeScsICAgICAgICAga2luZDonbW9kYWwnLCBpY29uQ29sb3I6JyNmNDcyYjYnLCBhY2NlbnQ6J3BpbmsnICAgfSxcbiAgICB7IGtleToncmVwYWlyJywgICBsYWJlbDonVXBkYXRlICYgUmVwYWlyJywgc3ViOidQbHVnLWluIGZsYXNoIMK3IGNvbnRyb2xsZXIgT1RBJywga2luZDonbGluaycsIGljb25Db2xvcjonI2ZiNzE4NScsIGFjY2VudDoncm9zZScsIGhyZWY6Jy91cGRhdGUuaHRtbD9mcm9tPXNldHVwJyB9LFxuXTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogUk9PVCBBUFBcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIEFwcCgpIHtcbiAgICAvKiBjb21wbGV0aW9uICsgcGVyLXN0ZXAgY29uZmlnIC0tIG1vY2t1cCBzdGF0ZSwgbmV2ZXIgcGVyc2lzdGVkICovXG4gICAgY29uc3QgW2RvbmUsIHNldERvbmVdID0gdXNlU3RhdGUoeyBwc3k6ZmFsc2UsIGxvY2F0aW9uOmZhbHNlLCBsYW5ndWFnZTpmYWxzZSwgcGx1Z2luczpmYWxzZSwgcmVwYWlyOmZhbHNlIH0pO1xuICAgIGNvbnN0IFtyb3V0ZSwgc2V0Um91dGVdID0gdXNlU3RhdGUoJ2h1YicpOyAgIC8vICdodWInIHwgJ3BzeSdcbiAgICBjb25zdCBbbW9kYWwsIHNldE1vZGFsXSA9IHVzZVN0YXRlKG51bGwpOyAgICAgLy8gJ2xvY2F0aW9uJyB8ICdsYW5ndWFnZScgfCAncGx1Z2lucycgfCBudWxsXG5cbiAgICBjb25zdCBbcHN5Q2ZnLCBzZXRQc3lDZmddICAgICAgICAgPSB1c2VTdGF0ZSh7IGdpdm9uaTp0cnVlLCByaFByZXNldDonb2ZmaWNlJywgcmhMbzozMCwgcmhIaTo2MCwgdExvOi0xNSwgdEhpOjUwLCB0aGVtZTonZGFyaycsIGRhcmtMZXZlbDoyLjAgfSk7XG4gICAgY29uc3QgW2xvY0NmZywgc2V0TG9jQ2ZnXSAgICAgICAgID0gdXNlU3RhdGUoeyBzaXRlTmFtZTonTXkgQnVpbGRpbmcnLCBjaXR5OidUb3JvbnRvLCBPTicsIGxhdDo0My42NTMyLCBsb246LTc5LjM4MzIgfSk7XG4gICAgY29uc3QgW2xhbmdDZmcsIHNldExhbmdDZmddICAgICAgID0gdXNlU3RhdGUoKCkgPT4ge1xuICAgICAgICAvKiBMYXp5IGluaXQgZnJvbSB0aGUgc2FtZSBsb2NhbFN0b3JhZ2Uga2V5IHRoZSBkYXNoYm9hcmQgcmVhZHMsIHNvXG4gICAgICAgICAqIHJlb3BlbmluZyB0aGUgc2V0dXAgd2FsayBzaG93cyB0aGUgY3VycmVudGx5LWFjdGl2ZSBsYW5ndWFnZVxuICAgICAgICAgKiByYXRoZXIgdGhhbiBhbHdheXMgZGVmYXVsdGluZyB0byBFbmdsaXNoLiAqL1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgdiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdpMThuX2xhbmcnKTtcbiAgICAgICAgICAgIGNvbnN0IGFsbG93ZWQgPSBbJ2VuJywnemgtQ04nLCd6aC1UVycsJ2phJywna28nXTtcbiAgICAgICAgICAgIGlmICh2ICYmIGFsbG93ZWQuaW5kZXhPZih2KSAhPT0gLTEpIHJldHVybiB7IGxhbmc6IHYgfTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBwcml2YXRlIG1vZGUgLT4gZmFsbCB0aHJvdWdoICovIH1cbiAgICAgICAgcmV0dXJuIHsgbGFuZzonZW4nIH07XG4gICAgfSk7XG4gICAgY29uc3QgW3BsdWdpbkNmZywgc2V0UGx1Z2luQ2ZnXSAgID0gdXNlU3RhdGUoeyBlbmFibGVkOlsnd2VhdGhlcicsJ2dpdm9uaScsJ3N3ZWV0X3Nwb3QnXSB9KTtcblxuICAgIGNvbnN0IGNvbXBsZXRlQ291bnQgPSBPYmplY3QudmFsdWVzKGRvbmUpLmZpbHRlcihCb29sZWFuKS5sZW5ndGg7XG5cbiAgICBjb25zdCBmaW5pc2ggPSAoa2V5KSA9PiB7XG4gICAgICAgIHNldERvbmUoZCA9PiAoey4uLmQsIFtrZXldOnRydWV9KSk7XG4gICAgICAgIHNldFJvdXRlKCdodWInKTtcbiAgICAgICAgc2V0TW9kYWwobnVsbCk7XG4gICAgfTtcblxuICAgIC8qIGZ1bGwtcGFnZSBQc3kgQ2hhcnQgZWRpdG9yICovXG4gICAgaWYgKHJvdXRlID09PSAncHN5Jykge1xuICAgICAgICByZXR1cm4gPFBzeUNoYXJ0U2V0dGluZ1BhZ2UgY2ZnPXtwc3lDZmd9IHNldENmZz17c2V0UHN5Q2ZnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25CYWNrPXsoKSA9PiBzZXRSb3V0ZSgnaHViJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNhdmU9eygpID0+IGZpbmlzaCgncHN5Jyl9IC8+O1xuICAgIH1cblxuICAgIC8qIGRlZmF1bHQ6IEhVQiBzY3JlZW4gKi9cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1pbi1oLXNjcmVlbiBweC02IHB5LThcIj5cbiAgICAgICAgICAgIHsvKiAtLS0tLS0tLS0tLS0tIGhlYWRlciAtLS0tLS0tLS0tLS0tICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXgtdy01eGwgbXgtYXV0byBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gbWItMTAgZmFkZS11cFwiPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJ0ZXh0LTJ4bCBzbTp0ZXh0LTN4bCBmb250LWJsYWNrIGl0YWxpYyB1cHBlcmNhc2UgdHJhY2tpbmctdGlnaHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtcmVkLTUwMFwiPlJlZDU8L3NwYW4+IDxzcGFuIGNsYXNzTmFtZT1cInRleHQtd2hpdGVcIj5TdHVkaW88L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCBmb250LW5vcm1hbCBpdGFsaWNcIj4gJm5ic3A7LyZuYnNwOyBzZXR1cCB3YWxrPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2gxPlxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCB0ZXh0LXhzIG10LTEgZm9udC1tb25vIHRyYWNraW5nLXdpZGVcIj5Db25maWd1cmUgb25jZS4gU2tpcCBhbnkgc3RlcCB5b3UgZG9uJ3QgbmVlZC48L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtNFwiPlxuICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiL2Rhc2hib2FyZC5odG1sXCJcbiAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4geyB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS5zZXR1cC5kb25lJywnMScpOyB9IGNhdGNoKGUpe30gfX1cbiAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXNsYXRlLTUwMCBob3Zlcjp0ZXh0LXNsYXRlLTMwMCB1bmRlcmxpbmUgdW5kZXJsaW5lLW9mZnNldC00XCI+U2tpcCBhbGwg4oaSPC9hPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiAtLS0tLS0tLS0tLS0tIHBlbnRhZ29uIGxheW91dCAtLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgNSBjaXJjdWxhciB0aWxlcyBhcnJhbmdlZCBhdCB0aGUgY29ybmVycyBvZiBhIHJlZ3VsYXJcbiAgICAgICAgICAgICAgICBwZW50YWdvbi4gIFBvbGFyIG1hdGhzOiBhbmdsZSBzdGFydHMgYXQgLTkwZGVnICh0b3ApIGFuZFxuICAgICAgICAgICAgICAgIHN0ZXBzIGJ5ICs3MmRlZyBjbG9ja3dpc2UuICBUaGUgY29udGFpbmVyIGlzIGhlaWdodC1sb2NrZWRcbiAgICAgICAgICAgICAgICB2aWEgYXNwZWN0IHJhdGlvIHNvIHRoZSBwZW50YWdvbiBzdGF5cyBjaXJjdWxhciBvbiBldmVyeVxuICAgICAgICAgICAgICAgIHZpZXdwb3J0LiAgUmFkaXVzIGlzIDQwICUgb2YgdGhlIGNvbnRhaW5lciBoYWxmLXNpZGUsIGNpcmNsZVxuICAgICAgICAgICAgICAgIGRpYW1ldGVyIH4yNyAlIG9mIHRoZSBjb250YWluZXIgd2lkdGggLS0gZ2l2ZXMgYSBjbGVhcmx5XG4gICAgICAgICAgICAgICAgdmlzaWJsZSBnYXAgKH4yOCAlIG9mIGNvbnRhaW5lciB3aWR0aCkgYmV0d2VlbiBhZGphY2VudFxuICAgICAgICAgICAgICAgIGNpcmNsZXMgcmVnYXJkbGVzcyBvZiBzY3JlZW4gc2l6ZS4gKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlIG14LWF1dG8gZmFkZS11cFwiXG4gICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOidtaW4oNzYwcHgsIDkydncpJywgYXNwZWN0UmF0aW86JzEgLyAxJywgYW5pbWF0aW9uRGVsYXk6Jy4wOHMnIH19PlxuXG4gICAgICAgICAgICAgICAgey8qIEJhY2tncm91bmQgcHN5LWNoYXJ0IGxheWVyIC0tIHNpemVkIHRvIGZpbGwgdGhlIGNvbnN0ZWxsYXRpb25cbiAgICAgICAgICAgICAgICAgICAgY2lyY2xlICh+NzggJSBvZiBjb250YWluZXIgPSBqdXN0IGluc2lkZSB0aGUgY29uc3RlbGxhdGlvblxuICAgICAgICAgICAgICAgICAgICBhcmMgdGhhdCBqb2lucyB0aGUgNSB0aWxlIGNlbnRyZXMpLiAgUmVuZGVyZWQgRklSU1Qgc28gdGhlXG4gICAgICAgICAgICAgICAgICAgIDUgdGlsZSBjaXJjbGVzIChuZXh0IGluIERPTSkgc2l0IG9uIHRvcCBhbmQgb2JzY3VyZSB0aGVcbiAgICAgICAgICAgICAgICAgICAgcG9ydGlvbiBvZiB0aGUgY2hhcnQgdGhhdCBvdmVybGFwcyB0aGVtLiAgVGhhdCBnaXZlcyB0aGVcbiAgICAgICAgICAgICAgICAgICAgXCJpbWFnZSByZWNlZGVzIGJlaGluZCB0aGUgNSBjaXJjbGVzXCIgZWZmZWN0LiAqL31cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGxlZnQtMS8yIHRvcC0xLzIgLXRyYW5zbGF0ZS14LTEvMiAtdHJhbnNsYXRlLXktMS8yIHBvaW50ZXItZXZlbnRzLW5vbmUgb3ZlcmZsb3ctaGlkZGVuIHJvdW5kZWQtZnVsbFwiXG4gICAgICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3t3aWR0aDonNzglJywgYXNwZWN0UmF0aW86JzEvMSd9fT5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCIvYXBpL2Fzc2V0cy9pbWcvcHN5X3NpbGhvdWV0dGUuanBnXCIgYWx0PVwiXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC0wIHctZnVsbCBoLWZ1bGwgb2JqZWN0LWNvdmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e29wYWNpdHk6MC43OH19IC8+XG4gICAgICAgICAgICAgICAgICAgIHsvKiBEYXJrIHZpZ25ldHRlIC8gbGVucyAtLSBwdWxscyB0aGUgY2VudHJlIGRvd24gc28gdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICBOLzUgRE9ORSBjb3VudGVyIHRoYXQgbGl2ZXMgT04gVE9QIHN0YXlzIHJlYWRhYmxlLiAqL31cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC0wXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6J3JhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgY2VudGVyLCByZ2JhKDIsNiwyMywwLjYwKSAwJSwgcmdiYSgyLDYsMjMsMC4zNSkgNTUlLCByZ2JhKDIsNiwyMywwLjEwKSAxMDAlKSd9fS8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICB7U1RFUFMubWFwKChzLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFuZ2xlRGVnID0gLTkwICsgaSAqIDcyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmdsZSA9IGFuZ2xlRGVnICogTWF0aC5QSSAvIDE4MDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgciA9IDQwOyAgICAgICAgICAgICAgICAgICAgICAgIC8vICUgb2YgY29udGFpbmVyIGhhbGYtc2lkZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4ID0gNTAgKyByICogTWF0aC5jb3MoYW5nbGUpOyAgLy8gJVxuICAgICAgICAgICAgICAgICAgICBjb25zdCB5ID0gNTAgKyByICogTWF0aC5zaW4oYW5nbGUpOyAgLy8gJVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPENpcmNsZVRpbGUga2V5PXtzLmtleX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXA9e3N9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lPXtkb25lW3Mua2V5XX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4PXtpKzF9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0UGN0PXt4fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wUGN0PXt5fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzLmtpbmQgPT09ICdwYWdlJykgICAgICBzZXRSb3V0ZShzLmtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocy5raW5kID09PSAnbGluaycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU2FtZS10YWIgbmF2IHNvIHRoZSByZXR1cm4gYmFkZ2Ugb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlLmh0bWwgY2FuIHNpbXBseSB3aW5kb3cubG9jYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFjayBoZXJlIHdoZW4gdGhlIG9wZXJhdG9yIGlzIGRvbmUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcy5ocmVmO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSAgICAgICAgICAgICAgICAgICAgICBzZXRNb2RhbChzLmtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSAvPlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIHsvKiBEZWNvcmF0aXZlIHJpbmc6IGEgc2luZ2xlIGNpcmNsZSB3aG9zZSBjZW50cmUgY29pbmNpZGVzXG4gICAgICAgICAgICAgICAgICAgIHdpdGggdGhlIGNlbnRyZSBvZiB0aGUgcGVudGFnb24gYW5kIHdob3NlIHJhZGl1cyBlcXVhbHNcbiAgICAgICAgICAgICAgICAgICAgdGhlIHBlbnRhZ29uIHZlcnRleCByYWRpdXMgLS0gaXRzIGJvdW5kYXJ5IHBhc3Nlc1xuICAgICAgICAgICAgICAgICAgICBjbGVhbmx5IHRocm91Z2ggdGhlIGNlbnRyZSBvZiBlYWNoIHRpbGUuICBUaGUgbWFza1xuICAgICAgICAgICAgICAgICAgICBjdXRzIG91dCB0aGUgZGlzayBvZiBldmVyeSB0aWxlIGNpcmNsZSBzbyB0aGUgcmluZyBpc1xuICAgICAgICAgICAgICAgICAgICB2aXNpYmxlIE9OTFkgaW4gdGhlIGdhcHMgYmV0d2VlbiB0aWxlcywgbmV2ZXIgY3Jvc3NpbmdcbiAgICAgICAgICAgICAgICAgICAgYSB0aWxlIGludGVyaW9yLiAqL31cbiAgICAgICAgICAgICAgICA8c3ZnIGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgdy1mdWxsIGgtZnVsbCBwb2ludGVyLWV2ZW50cy1ub25lXCJcbiAgICAgICAgICAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMTAwIDEwMFwiIHByZXNlcnZlQXNwZWN0UmF0aW89XCJub25lXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkZWZzPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG1hc2sgaWQ9XCJwZW50YWdvbi1yaW5nLW1hc2tcIiBtYXNrVW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4PVwiMFwiIHk9XCIwXCIgd2lkdGg9XCIxMDBcIiBoZWlnaHQ9XCIxMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCB4PVwiMFwiIHk9XCIwXCIgd2lkdGg9XCIxMDBcIiBoZWlnaHQ9XCIxMDBcIiBmaWxsPVwid2hpdGVcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtTVEVQUy5tYXAoKF8sIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYSA9ICgtOTAgKyBpICogNzIpICogTWF0aC5QSSAvIDE4MDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY3ggPSA1MCArIDQwICogTWF0aC5jb3MoYSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGN5ID0gNTAgKyA0MCAqIE1hdGguc2luKGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiAxNy41ICUgcmFkaXVzID0gc2FtZSBhcyB0aGUgdGlsZSBjaXJjbGUnc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYWxmLXdpZHRoICgzNSAlIGRpYW1ldGVyKTsgKzAuNSAlIG51ZGdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtlZXBzIHRoZSBtYXNrIGVkZ2UgaW5zaWRlIHRoZSBjb2xvdXJlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByaW5nIHNvIHRoZSB3aGl0ZSBhcmMgZG9lc24ndCBBTE1PU1QtdG91Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIHJpbmcgYm9yZGVyIHdpdGggYW50aS1hbGlhc2VkIGZyaW5nZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDxjaXJjbGUga2V5PXtpfSBjeD17Y3h9IGN5PXtjeX0gcj1cIjE4XCIgZmlsbD1cImJsYWNrXCIgLz47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L21hc2s+XG4gICAgICAgICAgICAgICAgICAgIDwvZGVmcz5cbiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBjeD1cIjUwXCIgY3k9XCI1MFwiIHI9XCI0MFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cInJnYmEoMjU1LDI1NSwyNTUsMC44NSlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoPVwiMC41NlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFzaz1cInVybCgjcGVudGFnb24tcmluZy1tYXNrKVwiIC8+XG4gICAgICAgICAgICAgICAgPC9zdmc+XG5cbiAgICAgICAgICAgICAgICB7LyogQ2VudHJlZCBjb21wbGV0aW9uIGNvdW50ZXIgLS0gc2l0cyBhdCB0aGUgY2VudHJvaWQgb2YgdGhlXG4gICAgICAgICAgICAgICAgICAgIHBlbnRhZ29uLCBmb250IHdlaWdodCBtYXRjaGVkIHRvIHRoZSBwZXItdGlsZSBoZWFkaW5nIHNvIHRoZVxuICAgICAgICAgICAgICAgICAgICBleWUgcmVhZHMgaXQgYXMgdGhlIGRvbWluYW50IHN0YXR1cy4gIFJlbmRlcmVkIExBU1Qgc28gaXRcbiAgICAgICAgICAgICAgICAgICAgc2l0cyBvbiB0b3Agb2YgYm90aCB0aGUgcHN5LWNoYXJ0IHNpbGhvdWV0dGUgYW5kIHRoZSB0aWxlXG4gICAgICAgICAgICAgICAgICAgIGNpcmNsZXMuICovfVxuICAgICAgICAgICAgICAgIHsvKiBOLzUgRE9ORSB0ZXh0IC0tIG93biBhYnNvbHV0ZSBsYXllciByZW5kZXJlZCBBRlRFUiB0aGVcbiAgICAgICAgICAgICAgICAgICAgdGlsZSBjaXJjbGVzIHNvIGl0IGFsd2F5cyBzaXRzIG9uIHRvcC4gKi99XG4gICAgICAgICAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cInNldHVwLXByb2dyZXNzLWNlbnRlclwiXG4gICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSBsZWZ0LTEvMiB0b3AtMS8yIC10cmFuc2xhdGUteC0xLzIgLXRyYW5zbGF0ZS15LTEvMiB0ZXh0LWNlbnRlciBwb2ludGVyLWV2ZW50cy1ub25lIHNlbGVjdC1ub25lXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgdGV4dC1bMjJweF0gc206dGV4dC1bMjZweF0gZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctdGlnaHQgd2hpdGVzcGFjZS1ub3dyYXAgbGVhZGluZy1ub25lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjb21wbGV0ZUNvdW50ID09PSA1ID8gJ3RleHQtZW1lcmFsZC00MDAnIDogJ3RleHQtd2hpdGUnfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3t0ZXh0U2hhZG93OicwIDJweCAxMnB4IHJnYmEoMiw2LDIzLDAuODUpLCAwIDAgNHB4IHJnYmEoMiw2LDIzLDAuODUpJ319PlxuICAgICAgICAgICAgICAgICAgICAgICAge2NvbXBsZXRlQ291bnR9LzVcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gc206dGV4dC1bMTFweF0gZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctWzAuM2VtXSB0ZXh0LXNsYXRlLTMwMCBtdC0yXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e3RleHRTaGFkb3c6JzAgMXB4IDZweCByZ2JhKDIsNiwyMywwLjg1KSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIERvbmVcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIC0tLS0tLS0tLS0tLS0gZm9vdGVyIENUQSAtLS0tLS0tLS0tLS0tICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXgtdy01eGwgbXgtYXV0byBtdC0xMCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gZmFkZS11cFwiIHN0eWxlPXt7YW5pbWF0aW9uRGVsYXk6Jy4xOHMnfX0+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgdGV4dC14cyBmb250LW1vbm9cIj5cbiAgICAgICAgICAgICAgICAgICAge2NvbXBsZXRlQ291bnQgPT09IDAgJiYgJ+KGkSBQaWNrIGEgc2V0dGluZyB0byBzdGFydCwgb3Igc2tpcCBhbGwgYW5kIGdvIHN0cmFpZ2h0IHRvIHRoZSBkYXNoYm9hcmQuJ31cbiAgICAgICAgICAgICAgICAgICAge2NvbXBsZXRlQ291bnQgPiAwICYmIGNvbXBsZXRlQ291bnQgPCA1ICYmIGDihpEgJHs1IC0gY29tcGxldGVDb3VudH0gc3RlcCR7NSAtIGNvbXBsZXRlQ291bnQgPT09IDEgPyAnJyA6ICdzJ30gcmVtYWluaW5nIChvcHRpb25hbCkuYH1cbiAgICAgICAgICAgICAgICAgICAge2NvbXBsZXRlQ291bnQgPT09IDUgJiYgJ+KckyBBbGwgc3RlcHMgY29uZmlndXJlZC4gIFJlYWR5IHdoZW4geW91IGFyZS4nfVxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiL2Rhc2hib2FyZC5odG1sXCJcbiAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7IHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1LnNldHVwLmRvbmUnLCcxJyk7IH0gY2F0Y2goZSl7fSB9fVxuICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTcgcHktMyByb3VuZGVkLXhsIHRleHQtc20gZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2NvbXBsZXRlQ291bnQgPT09IDVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1lbWVyYWxkLTYwMCBob3ZlcjpiZy1lbWVyYWxkLTUwMCB0ZXh0LXdoaXRlIHNoYWRvdy1sZyBzaGFkb3ctZW1lcmFsZC01MDAvMzAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctaW5kaWdvLTYwMCBob3ZlcjpiZy1pbmRpZ28tNTAwIHRleHQtd2hpdGUgc2hhZG93LWxnIHNoYWRvdy1pbmRpZ28tNTAwLzIwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgT3BlbiBEYXNoYm9hcmQg4oaSXG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiAtLS0tLS0tLS0tLS0tIG1vZGFscyAtLS0tLS0tLS0tLS0tICovfVxuICAgICAgICAgICAge21vZGFsID09PSAnbG9jYXRpb24nICYmIDxMb2NhdGlvbk1vZGFsIGNmZz17bG9jQ2ZnfSBzZXRDZmc9e3NldExvY0NmZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldE1vZGFsKG51bGwpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXsoKSA9PiBmaW5pc2goJ2xvY2F0aW9uJyl9IC8+fVxuICAgICAgICAgICAge21vZGFsID09PSAnbGFuZ3VhZ2UnICYmIDxMYW5ndWFnZU1vZGFsIGNmZz17bGFuZ0NmZ30gc2V0Q2ZnPXtzZXRMYW5nQ2ZnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0TW9kYWwobnVsbCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNhdmU9eygpID0+IGZpbmlzaCgnbGFuZ3VhZ2UnKX0gLz59XG4gICAgICAgICAgICB7bW9kYWwgPT09ICdwbHVnaW5zJyAgJiYgPFBsdWdpbnNNb2RhbCAgY2ZnPXtwbHVnaW5DZmd9IHNldENmZz17c2V0UGx1Z2luQ2ZnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0TW9kYWwobnVsbCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNhdmU9eygpID0+IGZpbmlzaCgncGx1Z2lucycpfSAvPn1cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogVGlsZSAobGFyZ2UgZWFzeS1vbi1leWVzIGJ1dHRvbikgLS0ga2VwdCBmb3IgYmFjay1jb21wYXQsIG5vIGxvbmdlciB1c2VkXG4gKiBieSB0aGUgcGVudGFnb24gaHViLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuZnVuY3Rpb24gVGlsZSh7IHN0ZXAsIGRvbmUsIGluZGV4LCBvbkNsaWNrIH0pIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BzZXR1cC10aWxlLSR7c3RlcC5rZXl9YH1cbiAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtgT3BlbiAke3N0ZXAubGFiZWx9YH1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B0aWxlLWJ0biByZWxhdGl2ZSB0ZXh0LWxlZnQgYmctc2xhdGUtOTAwLzcwIGJvcmRlci0yIGJvcmRlci1zbGF0ZS03MDAvNzBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3VuZGVkLTJ4bCBwLTYgc206cC03ICR7ZG9uZSA/ICdkb25lJyA6ICcnfWB9PlxuICAgICAgICAgICAge2RvbmUgJiYgPHNwYW4gY2xhc3NOYW1lPVwiY2hlY2tcIiBkYXRhLXRlc3RpZD17YHNldHVwLXRpbGUtJHtzdGVwLmtleX0tZG9uZWB9PuKckzwvc3Bhbj59XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC00IG1iLTNcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctMTIgaC0xMiByb3VuZGVkLXhsIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyXCJcbiAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7YmFja2dyb3VuZDpgJHtzdGVwLmljb25Db2xvcn0yMmAsIGJvcmRlcjpgMXB4IHNvbGlkICR7c3RlcC5pY29uQ29sb3J9NTVgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxUaWxlSWNvbiBraW5kPXtzdGVwLmtleX0gY29sb3I9e3N0ZXAuaWNvbkNvbG9yfSAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC0zeGwgZm9udC1ibGFjayB0ZXh0LXNsYXRlLTcwMFwiPjB7aW5kZXh9PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LWxnIHNtOnRleHQteGwgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXIgbWItMVwiXG4gICAgICAgICAgICAgICAgc3R5bGU9e3tjb2xvcjpzdGVwLmljb25Db2xvcn19PntzdGVwLmxhYmVsfTwvaDM+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTQwMCB0ZXh0LXNtIGxlYWRpbmctc251Z1wiPntzdGVwLnN1Yn08L3A+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTQgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgdGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJvbGQgdGV4dC1zbGF0ZS01MDBcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJwaWxsIGJnLXNsYXRlLTgwMCB0ZXh0LXNsYXRlLTQwMFwiPntzdGVwLmtpbmQgPT09ICdwYWdlJyA/ICdGdWxsIHBhZ2UnIDogJ1BvcHVwJ308L3NwYW4+XG4gICAgICAgICAgICAgICAge2RvbmUgJiYgPHNwYW4gY2xhc3NOYW1lPVwicGlsbCBiZy1lbWVyYWxkLTkwMC80MCB0ZXh0LWVtZXJhbGQtNDAwXCI+Q29uZmlndXJlZDwvc3Bhbj59XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ2lyY2xlVGlsZSAtLSBwZW50YWdvbi1jb3JuZXIgcm91bmQgYnV0dG9uLiAgU2l6ZWQgaW4gJSBvZiBpdHMgY29udGFpbmVyXG4gKiBzbyB0aGUgd2hvbGUgbGF5b3V0IHNjYWxlcyB3aXRoIHZpZXdwb3J0LiAgRWFjaCBjaXJjbGUgaXMgYW5jaG9yZWQgYnkgaXRzXG4gKiBjZW50cmUgKHRyYW5zbGF0ZSAtNTAlLy01MCUpIG9uIHRoZSBwb2xhci1jb21wdXRlZCAobGVmdCUsIHRvcCUpLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuZnVuY3Rpb24gQ2lyY2xlVGlsZSh7IHN0ZXAsIGRvbmUsIGluZGV4LCBsZWZ0UGN0LCB0b3BQY3QsIG9uQ2xpY2sgfSkge1xuICAgIC8qIFRoaWNrIGNvbG91cmVkIHJpbmcgcGVyIHRpbGUgLS0gZWFjaCBzdGVwIGtlZXBzIGl0cyBhY2NlbnQgY29sb3VyXG4gICAgICogKGluZGlnby9hbWJlci9lbWVyYWxkL3Bpbmsvcm9zZSksIHJlaW5mb3JjaW5nIHRoZSBjb2xvdXItY29kZWQgU1ZHXG4gICAgICogaWNvbiBhbmQgdGhlIGhlYWRpbmcgdGV4dC4gKi9cbiAgICBjb25zdCByaW5nQ29sb3IgPSBzdGVwLmljb25Db2xvcjtcbiAgICByZXR1cm4gKFxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BzZXR1cC10aWxlLSR7c3RlcC5rZXl9YH1cbiAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtgT3BlbiAke3N0ZXAubGFiZWx9YH1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BjaXJjbGUtdGlsZSBncm91cCBhYnNvbHV0ZSByb3VuZGVkLWZ1bGwgdGV4dC1jZW50ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb24tYWxsIGR1cmF0aW9uLTIwMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7ZG9uZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1zbGF0ZS05MDAgc2hhZG93LVswXzBfMzBweF8tNnB4X3JnYmEoMTYsMTg1LDEyOSwwLjU1KV0nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLXNsYXRlLTkwMCBob3ZlcjpiZy1zbGF0ZS04MDAnfWB9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgbGVmdDpgJHtsZWZ0UGN0fSVgLCB0b3A6YCR7dG9wUGN0fSVgLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDonbWluKDM1JSwgMjYwcHgpJywgYXNwZWN0UmF0aW86JzEvMScsXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybTondHJhbnNsYXRlKC01MCUsIC01MCUpJyxcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyOmAxMHB4IHNvbGlkICR7cmluZ0NvbG9yfWAsXG4gICAgICAgICAgICAgICAgICAgIGJveFNoYWRvdzpgMCAwIDAgMXB4ICR7cmluZ0NvbG9yfTMzLCAwIDhweCAyOHB4IC04cHggJHtyaW5nQ29sb3J9NTVgLFxuICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAge2RvbmUgJiYgKFxuICAgICAgICAgICAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPXtgc2V0dXAtdGlsZS0ke3N0ZXAua2V5fS1kb25lYH1cbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSAtdG9wLTEgLXJpZ2h0LTEgdy02IGgtNiByb3VuZGVkLWZ1bGwgYmctZW1lcmFsZC01MDAgdGV4dC13aGl0ZSB0ZXh0LXhzIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGZvbnQtYm9sZCBzaGFkb3dcIj5cbiAgICAgICAgICAgICAgICAgICAg4pyTXG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm91bmRlZC14bCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBtYi0xXCJcbiAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6JzM0JScsIGFzcGVjdFJhdGlvOicxLzEnLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOmAke3N0ZXAuaWNvbkNvbG9yfTIyYCxcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyOmAxcHggc29saWQgJHtzdGVwLmljb25Db2xvcn01NWAsXG4gICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgIDxUaWxlSWNvbiBraW5kPXtzdGVwLmtleX0gY29sb3I9e3N0ZXAuaWNvbkNvbG9yfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS02MDAgdHJhY2tpbmctd2lkZXJcIj4we2luZGV4fTwvZGl2PlxuICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtWzIycHhdIHNtOnRleHQtWzI2cHhdIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXRpZ2h0IHdoaXRlc3BhY2Utbm93cmFwIGxlYWRpbmctbm9uZSBtdC0xLjVcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7Y29sb3I6c3RlcC5pY29uQ29sb3J9fT5cbiAgICAgICAgICAgICAgICB7c3RlcC5sYWJlbH1cbiAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCB0ZXh0LVsxMHB4XSBzbTp0ZXh0LVsxMXB4XSBsZWFkaW5nLXNudWcgcHgtMyBtdC0xIGxpbmUtY2xhbXAtMlwiPlxuICAgICAgICAgICAgICAgIHtzdGVwLnN1Yn1cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9idXR0b24+XG4gICAgKTtcbn1cblxuZnVuY3Rpb24gVGlsZUljb24oeyBraW5kLCBjb2xvciB9KSB7XG4gICAgLyogc2ltcGxlIGlubGluZSBTVkdzIHNvIHdlIGtlZXAgdGhlIGZpbGUgc2VsZi1jb250YWluZWQgKi9cbiAgICBjb25zdCBzdHJva2UgPSB7IHN0cm9rZTpjb2xvciwgZmlsbDonbm9uZScsIHN0cm9rZVdpZHRoOjIsIHN0cm9rZUxpbmVjYXA6J3JvdW5kJywgc3Ryb2tlTGluZWpvaW46J3JvdW5kJyB9O1xuICAgIGlmIChraW5kID09PSAncHN5JykgICAgICByZXR1cm4gPHN2ZyB3aWR0aD1cIjIyXCIgaGVpZ2h0PVwiMjJcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgey4uLnN0cm9rZX0+PHBhdGggZD1cIk0zIDN2MThoMThcIi8+PHBhdGggZD1cIk0zIDE3YzQtMSA3LTYgOS05czUtMyA5LTJcIi8+PC9zdmc+O1xuICAgIGlmIChraW5kID09PSAnbG9jYXRpb24nKSByZXR1cm4gPHN2ZyB3aWR0aD1cIjIyXCIgaGVpZ2h0PVwiMjJcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgey4uLnN0cm9rZX0+PHBhdGggZD1cIk0xMiAyMnMtNy02LjQtNy0xMmE3IDcgMCAxIDEgMTQgMGMwIDUuNi03IDEyLTcgMTJ6XCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTBcIiByPVwiMi41XCIvPjwvc3ZnPjtcbiAgICBpZiAoa2luZCA9PT0gJ2xhbmd1YWdlJykgcmV0dXJuIDxzdmcgd2lkdGg9XCIyMlwiIGhlaWdodD1cIjIyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHsuLi5zdHJva2V9PjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiOVwiLz48cGF0aCBkPVwiTTMgMTJoMThNMTIgM2ExNCAxNCAwIDAgMSAwIDE4TTEyIDNhMTQgMTQgMCAwIDAgMCAxOFwiLz48L3N2Zz47XG4gICAgaWYgKGtpbmQgPT09ICdwbHVnaW5zJykgIHJldHVybiA8c3ZnIHdpZHRoPVwiMjJcIiBoZWlnaHQ9XCIyMlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB7Li4uc3Ryb2tlfT48cGF0aCBkPVwiTTkgM3Y2TTE1IDN2NlwiLz48cGF0aCBkPVwiTTUgOWgxNHY2YTQgNCAwIDAgMS00IDRoLTF2M005IDE5djNcIi8+PC9zdmc+O1xuICAgIC8qIFVwZGF0ZSAmIFJlcGFpciAtLSB3cmVuY2ggKyB0aW55IGdlYXIgYnVtcCwgc2lnbmFsbGluZyBcInRvb2xzXCIgKi9cbiAgICBpZiAoa2luZCA9PT0gJ3JlcGFpcicpICAgcmV0dXJuIDxzdmcgd2lkdGg9XCIyMlwiIGhlaWdodD1cIjIyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHsuLi5zdHJva2V9PjxwYXRoIGQ9XCJNMTQuNyA2LjNhNCA0IDAgMCAwLTUuNCA1LjRMMyAxOGwzIDMgNi4zLTYuM2E0IDQgMCAwIDAgNS40LTUuNGwtMi44IDIuOEwxMyAxMWwtMS4xLTEuOSAyLjgtMi44elwiLz48L3N2Zz47XG4gICAgcmV0dXJuIG51bGw7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFBzeSBDaGFydCBTZXR0aW5nIC0tIEZVTEwgUEFHRSwgbGl2ZSBza2VsZXRvbiByZXNwb25kcyB0byBjb250cm9sc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuZnVuY3Rpb24gUHN5Q2hhcnRTZXR0aW5nUGFnZSh7IGNmZywgc2V0Q2ZnLCBvbkJhY2ssIG9uU2F2ZSB9KSB7XG4gICAgY29uc3QgdXBkYXRlID0gKGssIHYpID0+IHNldENmZyhjID0+ICh7Li4uYywgW2tdOnZ9KSk7XG5cbiAgICAvKiBPbiBtb3VudDogaHlkcmF0ZSBmcm9tIHRoZSBTQU1FIGxvY2FsU3RvcmFnZSBrZXkgdGhlIGRhc2hib2FyZCByZWFkc1xuICAgICAqIChgcmVkNV9zd2VldF9zcG90X3JhbmdlYCkgcGx1cyB0aGUgcHJlc2V0IGlkIChgcmVkNV9yaF9wcmVzZXRgKSBzb1xuICAgICAqIHRoZSBkcm9wZG93biBsYWJlbCBzdGF5cyBjb25zaXN0ZW50IHdpdGggdGhlIHNsaWRlciB2YWx1ZXMgYWNyb3NzXG4gICAgICogcmVsb2Fkcy4gIElmIHRoZSBvcGVyYXRvciBoYXMgYWxyZWFkeSB0dW5lZCB0aGUgUkggYmFuZCBvbiB0aGVcbiAgICAgKiBkYXNoYm9hcmQsIHRoZSBzZXR1cCB3YWxrIHN0YXJ0cyBmcm9tIHRob3NlIHZhbHVlcy4gKi9cbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmF3ICAgID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlZDVfc3dlZXRfc3BvdF9yYW5nZScpO1xuICAgICAgICAgICAgY29uc3QgcHJlc2V0ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlZDVfcmhfcHJlc2V0Jyk7XG4gICAgICAgICAgICBjb25zdCBwYXRjaCAgPSB7fTtcbiAgICAgICAgICAgIGlmIChyYXcpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwID0gSlNPTi5wYXJzZShyYXcpO1xuICAgICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUocC5sbykgJiYgTnVtYmVyLmlzRmluaXRlKHAuaGkpICYmIHAubG8gPCBwLmhpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhdGNoLnJoTG8gPSBwLmxvO1xuICAgICAgICAgICAgICAgICAgICBwYXRjaC5yaEhpID0gcC5oaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJlc2V0ICYmIFJIX1BSRVNFVFMuZmluZCh4ID0+IHguaWQgPT09IHByZXNldCkpIHtcbiAgICAgICAgICAgICAgICBwYXRjaC5yaFByZXNldCA9IHByZXNldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIFRoZW1lICsgYnJpZ2h0bmVzcyDigJQgc2FtZSBrZXlzIGFwcC5qcyAoZGFzaGJvYXJkKSByZWFkcy4gKi9cbiAgICAgICAgICAgIGNvbnN0IHRoID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlZDUudGhlbWUnKTtcbiAgICAgICAgICAgIGlmICh0aCA9PT0gJ2xpZ2h0JyB8fCB0aCA9PT0gJ2RhcmsnKSBwYXRjaC50aGVtZSA9IHRoO1xuICAgICAgICAgICAgY29uc3QgZGwgPSBwYXJzZUZsb2F0KGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWQ1LmRhcmtMZXZlbCcpKTtcbiAgICAgICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUoZGwpICYmIGRsID49IDEuNSAmJiBkbCA8PSAzLjApIHBhdGNoLmRhcmtMZXZlbCA9IGRsO1xuICAgICAgICAgICAgLyogVGVtcGVyYXR1cmUgYXhpcyByYW5nZSDigJQgd3JpdHRlbiBieSB0aGlzIHNhbWUgcGFnZSdzIHNhdmVcbiAgICAgICAgICAgICAqIGhhbmRsZXI7IGxvYWQgaXQgaGVyZSBzbyByZW9wZW5pbmcgdGhlIHNldHVwIHdhbGsgc2hvd3MgdGhlXG4gICAgICAgICAgICAgKiBjdXJyZW50IGRhc2hib2FyZCBheGlzIGluc3RlYWQgb2YgYWx3YXlzIGRlZmF1bHRpbmcgdG8gLTE1Li41MC4gKi9cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdHJSYXcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVkNV90ZW1wX3JhbmdlJyk7XG4gICAgICAgICAgICAgICAgaWYgKHRyUmF3KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRyID0gSlNPTi5wYXJzZSh0clJhdyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUodHIubWluKSAmJiBOdW1iZXIuaXNGaW5pdGUodHIubWF4KSAmJiB0ci5taW4gPCB0ci5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGNoLnRMbyA9IHRyLm1pbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGNoLnRIaSA9IHRyLm1heDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogaWdub3JlICovIH1cbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhwYXRjaCkubGVuZ3RoKSBzZXRDZmcoYyA9PiAoey4uLmMsIC4uLnBhdGNofSkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IC8qIGlnbm9yZSAqLyB9XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xuICAgIH0sIFtdKTtcblxuICAgIC8qIE9uIHNhdmU6IHBlcnNpc3QgdGhlIFJIIGJhbmQgdG8gbG9jYWxTdG9yYWdlIHNvIHRoZSBkYXNoYm9hcmQnc1xuICAgICAqIHN3ZWV0LXNwb3QgcG9seWdvbiBwaWNrcyBpdCB1cCBvbiBuZXh0IGxvYWQuICBBbHNvIHBlcnNpc3QgdGhlIHZlbnVlXG4gICAgICogcHJlc2V0IGlkIChmb3IgZnV0dXJlIFwic2hvdyBwcmVzZXQgbmFtZSBvbiBkYXNoYm9hcmRcIiBmZWF0dXJlcykuICovXG4gICAgY29uc3QgcGVyc2lzdEFuZFNhdmUgPSAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNV9zd2VldF9zcG90X3JhbmdlJyxcbiAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh7IGxvOiBjZmcucmhMbywgaGk6IGNmZy5yaEhpIH0pKTtcbiAgICAgICAgICAgIGlmIChjZmcucmhQcmVzZXQpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNV9yaF9wcmVzZXQnLCBjZmcucmhQcmVzZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogVGhlbWUgKyBicmlnaHRuZXNzIOKAlCB3cml0dGVuIHRvIHRoZSBTQU1FIGtleXMgdGhlIGRhc2hib2FyZFxuICAgICAgICAgICAgICogKGFwcC5qcyBsaW5lcyA1Ny01OCBhbmQgODQtOTcpIHJlYWRzIGFzIGl0cyB1c2VTdGF0ZSBsYXp5XG4gICAgICAgICAgICAgKiBpbml0aWFsaXNlciwgc28gdGhlIGNob3NlbiB0aGVtZSB0YWtlcyBlZmZlY3Qgb24gbmV4dCBkYXNoYm9hcmRcbiAgICAgICAgICAgICAqIGxvYWQuICBhcHAuanMgdHJlYXRzIGRhcmtMZXZlbCA+PSAzLjAgYXMgbGlnaHQtbW9kZSB0cmlnZ2VyLiAqL1xuICAgICAgICAgICAgaWYgKGNmZy50aGVtZSA9PT0gJ2xpZ2h0JyB8fCBjZmcudGhlbWUgPT09ICdkYXJrJykge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1LnRoZW1lJywgY2ZnLnRoZW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUoY2ZnLmRhcmtMZXZlbCkpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS5kYXJrTGV2ZWwnLCBTdHJpbmcoY2ZnLmRhcmtMZXZlbCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogVGVtcGVyYXR1cmUgYXhpcyByYW5nZSDigJQgZHJpdmVzIHRoZSBkYXNoYm9hcmQncyBwc3kgY2hhcnRcbiAgICAgICAgICAgICAqIFggYXhpcyAoYHRlbXBSYW5nZS5taW4vbWF4YCBpbiBhcHAuanMpLiAgV2Ugd3JpdGUgdGhlIHNhbWVcbiAgICAgICAgICAgICAqIHNoYXBlIGFwcC5qcyByZWFkcyAoYHttaW4sIG1heH1gKSBzbyBpdHMgbGF6eSB1c2VTdGF0ZSBpbml0XG4gICAgICAgICAgICAgKiBwaWNrcyBpdCB1cCBvbiBuZXh0IGxvYWQsIEFORCBkaXNwYXRjaCBhIGN1c3RvbSBldmVudCBzb1xuICAgICAgICAgICAgICogYW55IG9wZW4gZGFzaGJvYXJkIHRhYiB1cGRhdGVzIGxpdmUgd2l0aG91dCBhIHJlZnJlc2guICovXG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGNmZy50TG8pICYmIE51bWJlci5pc0Zpbml0ZShjZmcudEhpKSAmJiBjZmcudExvIDwgY2ZnLnRIaSkge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1X3RlbXBfcmFuZ2UnLFxuICAgICAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh7IG1pbjogY2ZnLnRMbywgbWF4OiBjZmcudEhpIH0pKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3I1LXRlbXAtcmFuZ2UtY2hhbmdlJywge1xuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHsgbWluOiBjZmcudExvLCBtYXg6IGNmZy50SGkgfVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncjUtcmgtYmFuZC1jaGFuZ2UnLCB7XG4gICAgICAgICAgICAgICAgZGV0YWlsOiB7IGxvOiBjZmcucmhMbywgaGk6IGNmZy5yaEhpIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnW3NldHVwIHdhbGtdIHBzeSBjaGFydCBzYXZlZCAtPiBSSCcsIGNmZy5yaExvLCAnLScsIGNmZy5yaEhpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICclIFQtYXhpcycsIGNmZy50TG8sICcuLicsIGNmZy50SGksICfCsEMgcHJlc2V0PScsIGNmZy5yaFByZXNldCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignW3NldHVwIHdhbGtdIGNvdWxkIG5vdCBwZXJzaXN0IHBzeSBzZXR0aW5nczonLCBlKTtcbiAgICAgICAgfVxuICAgICAgICBvblNhdmUoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtaW4taC1zY3JlZW4gZmxleCBmbGV4LWNvbFwiPlxuICAgICAgICAgICAgey8qIGhlYWRlciAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHB4LTYgcHktNCBib3JkZXItYiBib3JkZXItc2xhdGUtODAwXCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkJhY2t9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTQwMCBob3Zlcjp0ZXh0LXdoaXRlIHRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrXCI+XG4gICAgICAgICAgICAgICAgICAgIOKGkCBCYWNrIHRvIHNldHVwXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cInRleHQtc20gdXBwZXJjYXNlIHRyYWNraW5nLVswLjNlbV0gZm9udC1ibGFjayB0ZXh0LWluZGlnby00MDBcIj5Qc3kgQ2hhcnQgU2V0dGluZzwvaDE+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtwZXJzaXN0QW5kU2F2ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTUgcHktMiByb3VuZGVkLWxnIGJnLWluZGlnby02MDAgaG92ZXI6YmctaW5kaWdvLTUwMCB0ZXh0LXdoaXRlIHRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrXCI+XG4gICAgICAgICAgICAgICAgICAgIFNhdmUgJiByZXR1cm4g4pyTXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIGJvZHkg4oCUIGNoYXJ0IGxlZnQsIGNvbnRyb2xzIHJpZ2h0ICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTEgZ3JpZCBncmlkLWNvbHMtMSBsZzpncmlkLWNvbHMtWzFmcl8zNjBweF0gZ2FwLTQgcC02IG1heC13LTd4bCBteC1hdXRvIHctZnVsbFwiPlxuICAgICAgICAgICAgICAgIDxQc3lTa2VsZXRvbiBjZmc9e2NmZ30gLz5cbiAgICAgICAgICAgICAgICA8UHN5Q29udHJvbFBhbmVsIGNmZz17Y2ZnfSB1cGRhdGU9e3VwZGF0ZX0gc2V0Q2ZnPXtzZXRDZmd9IC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuLyogUkggYmFuZCBwcmVzZXRzIOKAlCByZWNvZ25pc2VkIGluZHVzdHJ5IHN0YW5kYXJkcyBmb3IgZWFjaCB2ZW51ZSB0eXBlLlxuICogU291cmNlczogQVNIUkFFIDU1IChjb21mb3J0KSwgQVNIUkFFIDE3MCAoaGVhbHRoY2FyZSksXG4gKiBBQU0vTlBTL1NtaXRoc29uaWFuIGd1aWRhbmNlIChjb2xsZWN0aW9ucyksIENJQlNFIFRNNDAgKGxpYnJhcmllcykuICovXG5jb25zdCBSSF9QUkVTRVRTID0gW1xuICAgIHsgaWQ6J2N1c3RvbScsICAgICAgICAgIGxhYmVsOidDdXN0b20gKG1hbnVhbCknLCAgICAgICAgICAgICAgICAgbG86bnVsbCwgaGk6bnVsbCwgbm90ZTonJyB9LFxuICAgIHsgaWQ6J29mZmljZScsICAgICAgICAgIGxhYmVsOidPZmZpY2UnLCAgICAgICAgICAgICAgICAgICAgICAgICAgbG86MzAsICAgaGk6NjAsICAgbm90ZTonQVNIUkFFIDU1IGNvbWZvcnQnICAgICAgICAgICAgICAgICAgfSxcbiAgICB7IGlkOidtdXNldW0nLCAgICAgICAgICBsYWJlbDonTXVzZXVtJywgICAgICAgICAgICAgICAgICAgICAgICAgIGxvOjQwLCAgIGhpOjU1LCAgIG5vdGU6J0FBTSBjb2xsZWN0aW9uIHByZXNlcnZhdGlvbicgICAgICAgIH0sXG4gICAgeyBpZDonaG90ZWwnLCAgICAgICAgICAgbGFiZWw6J0hvdGVsIGd1ZXN0IHJvb20nLCAgICAgICAgICAgICAgICBsbzozMCwgICBoaTo2MCwgICBub3RlOidnZW5lcmFsIG9jY3VwYW50IGNvbWZvcnQnICAgICAgICAgICB9LFxuICAgIHsgaWQ6J2xpYnJhcnknLCAgICAgICAgIGxhYmVsOidMaWJyYXJ5IC8gQXJjaGl2ZScsICAgICAgICAgICAgICAgbG86NDAsICAgaGk6NTUsICAgbm90ZToncGFwZXIgJiBiaW5kaW5nIHByZXNlcnZhdGlvbicgICAgICAgfSxcbiAgICB7IGlkOidob3NwaXRhbCcsICAgICAgICBsYWJlbDonSG9zcGl0YWwgKGdlbmVyYWwpJywgICAgICAgICAgICAgIGxvOjMwLCAgIGhpOjYwLCAgIG5vdGU6J0FTSFJBRSAxNzAgcGF0aWVudCBhcmVhcycgICAgICAgICAgIH0sXG4gICAgeyBpZDonbGVjdHVyZScsICAgICAgICAgbGFiZWw6J0xlY3R1cmUgaGFsbCcsICAgICAgICAgICAgICAgICAgICBsbzozMCwgICBoaTo2MCwgICBub3RlOidoaWdoIG9jY3VwYW5jeSBjb21mb3J0JyAgICAgICAgICAgICB9LFxuICAgIHsgaWQ6J2NvbmNlcnQnLCAgICAgICAgIGxhYmVsOidDb25jZXJ0IGhhbGwnLCAgICAgICAgICAgICAgICAgICAgbG86NDAsICAgaGk6NTUsICAgbm90ZTonaW5zdHJ1bWVudCB0dW5pbmcgc3RhYmlsaXR5JyAgICAgICAgfSxcbiAgICB7IGlkOidtZWV0aW5nJywgICAgICAgICBsYWJlbDonTWVldGluZyByb29tJywgICAgICAgICAgICAgICAgICAgIGxvOjMwLCAgIGhpOjYwLCAgIG5vdGU6J3NtYWxsIGdyb3VwIGNvbWZvcnQnICAgICAgICAgICAgICAgIH0sXG4gICAgeyBpZDonZXhoaWJpdGlvbicsICAgICAgbGFiZWw6J0V4aGliaXRpb24gaGFsbCcsICAgICAgICAgICAgICAgICBsbzo0MCwgICBoaTo1NSwgICBub3RlOidtaXhlZCBhcnQgLyBhcnRpZmFjdCBkaXNwbGF5JyAgICAgICB9LFxuXTtcblxuLyogUmVhbCBwc3kgY2hhcnQg4oCUIHVzZXMgdGhlIFNBTUUgZ2V0VyArIEdJVk9OSV9DT0xPUlMgKyBwb2x5Z29uIG1hdGggYXMgdGhlXG4gKiBwcm9kdWN0aW9uIGRhc2hib2FyZC4gIFNvdXJjZSBvZiB0cnV0aDogIGpzL3BzeWNocm9tZXRyaWMuanMgIGFuZCB0aGVcbiAqIHJlbmRlckdpdm9uaU92ZXJsYXkoKSBibG9jayBhdCBhcHAuanM6MTY0MS0xNzIyLlxuICogQW55dGhpbmcgeW91IGNoYW5nZSBpbiB0aG9zZSBmaWxlcyBNVVNUIGJlIG1pcnJvcmVkIGhlcmUuICovXG5mdW5jdGlvbiBQc3lTa2VsZXRvbih7IGNmZyB9KSB7XG4gICAgLyogQ2FudmFzICsgcGFkZGluZyAqL1xuICAgIGNvbnN0IFcgPSA3NjAsIEggPSA0ODA7XG4gICAgY29uc3QgcGFkID0geyBsZWZ0OiA1NiwgcmlnaHQ6IDQwLCB0b3A6IDI4LCBib3R0b206IDU2IH07XG4gICAgY29uc3QgZ3JpZFcgPSBXIC0gcGFkLmxlZnQgLSBwYWQucmlnaHQ7XG4gICAgY29uc3QgZ3JpZEggPSBIIC0gcGFkLnRvcCAgLSBwYWQuYm90dG9tO1xuXG4gICAgY29uc3QgVF9NSU4gPSBjZmcudExvLCBUX01BWCA9IGNmZy50SGk7XG4gICAgY29uc3QgV19NSU4gPSAwLCAgICAgICBXX01BWCA9IDAuMDMwOyAgICAgICAgICAvLyBrZy9rZ1xuXG4gICAgLyogYXhpcyBzY2FsZXMgLS0gbWF0Y2ggdGhlIGxpdmUgZGFzaGJvYXJkICovXG4gICAgY29uc3QgeCAgPSAodCkgPT4gcGFkLmxlZnQgKyAoKHQgLSBUX01JTikgLyAoVF9NQVggLSBUX01JTikpICogZ3JpZFc7XG4gICAgY29uc3QgeSAgPSAodykgPT4gcGFkLnRvcCAgKyAoMSAtICh3IC0gV19NSU4pIC8gKFdfTUFYIC0gV19NSU4pKSAqIGdyaWRIO1xuICAgIGNvbnN0IF9nZXRXID0gKHR5cGVvZiBnZXRXID09PSAnZnVuY3Rpb24nKSA/IGdldFcgOiAoKHQsIHJoKSA9PiAwKTtcblxuICAgIGNvbnN0IHNhZmVQdHMgPSAoYXJyKSA9PiBhcnIubWFwKHAgPT4gYCR7KHgocFswXSl8fDApLnRvRml4ZWQoMil9LCR7KHkocFsxXSl8fDApLnRvRml4ZWQoMil9YCkuam9pbignICcpO1xuXG4gICAgLyogLS0tLSBHaXZvbmkgcG9seWdvbnMgLS0gQ09QSUVEIFZFUkJBVElNIGZyb20gYXBwLmpzOjE2NDMtMTY2OSAtLS0tICovXG4gICAgY29uc3Qgcmg4MCA9IFtdOyBmb3IgKGxldCB0PTIwOyB0PD0yNTsgdCs9MC41KSByaDgwLnB1c2goW3QsIF9nZXRXKHQsIDgwKV0pO1xuICAgIGNvbnN0IHJoMTAwPSBbXTsgZm9yIChsZXQgdD0yMDsgdDw9Mjc7IHQrPTAuNSkgcmgxMDAucHVzaChbdCwgX2dldFcodCwgMTAwKV0pO1xuICAgIGNvbnN0IHJoMjBMaW5lID0gW107IGZvciAobGV0IHQ9MzI7IHQ+PTIwOyB0LT0wLjUpIHJoMjBMaW5lLnB1c2goW3QsIF9nZXRXKHQsIDIwKV0pO1xuICAgIGNvbnN0IHJoMjBfQ1ogID0gW107IGZvciAobGV0IHQ9Mjc7IHQ+PTIwOyB0LT0wLjUpIHJoMjBfQ1oucHVzaChbdCwgX2dldFcodCwgMjApXSk7XG4gICAgY29uc3QgQ1ogICA9IFsuLi5yaDgwLCBbMjcsIF9nZXRXKDI3LCA1MCldLCBbMjcsIF9nZXRXKDI3LCAyMCldLCAuLi5yaDIwX0NaXTtcblxuICAgIGNvbnN0IHJoSGlfdG9wID0gW107IGZvciAobGV0IHR0PTIwOyB0dDw9Mjc7IHR0Kz0wLjUpIHJoSGlfdG9wLnB1c2goW3R0LCBfZ2V0Vyh0dCwgY2ZnLnJoSGkpXSk7XG4gICAgY29uc3QgcmhMb19ib3QgPSBbXTsgZm9yIChsZXQgdHQ9Mjc7IHR0Pj0yMDsgdHQtPTAuNSkgcmhMb19ib3QucHVzaChbdHQsIF9nZXRXKHR0LCBjZmcucmhMbyldKTtcbiAgICBjb25zdCBTV0VFVCA9IFsuLi5yaEhpX3RvcCwgLi4ucmhMb19ib3RdO1xuXG4gICAgY29uc3QgTlYgICA9IFsuLi5yaDEwMCwgWzMyLCAxNS40LzEwMDBdLCBbMzIsIDYuMi8xMDAwXSwgLi4ucmgyMExpbmVdO1xuICAgIGNvbnN0IE1hc3MgPSBbLi4ucmg4MCwgWzMzLCAxNi8xMDAwXSwgWzM3LCBfZ2V0VygzNywgMzApXSwgWzM3LCAzLzEwMDBdLCBbMjAsIF9nZXRXKDIwLCAyMCldXTtcbiAgICBjb25zdCBNQ1YgID0gWy4uLnJoODAsIFs0MCwgMTYvMTAwMF0sIFs0NCwgX2dldFcoNDQsIDIwKV0sIFs0NCwgMy8xMDAwXSwgWzIwLCBfZ2V0VygyMCwgMjApXV07XG4gICAgY29uc3QgRVZBUCA9IFsuLi5yaDgwLCBbMjUsIDE2LzEwMDBdLCBbMzYsIF9nZXRXKDM2LCAzMCldLCBbMzksIF9nZXRXKDM5LCAyMCldLFxuICAgICAgICAgICAgICAgICAgWzQxLCBfZ2V0Vyg0MSwgMTApXSwgWzQxLCAwXSwgWzI3LjIsIDBdLCBbMjAsIF9nZXRXKDIwLCAyMCldXTtcblxuICAgIGNvbnN0IHdpbnRlclJIODAgPSBbXTsgZm9yIChsZXQgdD0xODsgdDw9MTkuNTsgdCs9MC41KSB3aW50ZXJSSDgwLnB1c2goW3QsIF9nZXRXKHQsIDgwKV0pO1xuICAgIGNvbnN0IHdpbnRlclJIMjAgPSBbXTsgZm9yIChsZXQgdD0xOS41OyB0Pj0xODsgdC09MC41KSB3aW50ZXJSSDIwLnB1c2goW3QsIF9nZXRXKHQsIDIwKV0pO1xuICAgIGNvbnN0IFdJTlRFUiA9IFsuLi53aW50ZXJSSDgwLCAuLi53aW50ZXJSSDIwXTtcblxuICAgIC8qIFJIIGlzb3BsZXRoIGN1cnZlcyBmb3IgdGhlIGNoYXJ0IGdyaWQgKi9cbiAgICBjb25zdCBpc29wbGV0aHMgPSBbMjAsIDQwLCA2MCwgODAsIDEwMF07XG5cbiAgICAvKiBUaGVtZSBwYWxldHRlIOKAlCBkcml2ZXMgdGhlIGxpdmUgcHJldmlldyBzbyB0aGUgZGltL2xpZ2h0IGNvbnRyb2xzXG4gICAgICogaGF2ZSB2aXNpYmxlIGZlZWRiYWNrIHJpZ2h0IG9uIHRoZSBjaGFydC4gIEluIGRpbS9kYXJrIG1vZGUgd2UgYWxzb1xuICAgICAqIGFwcGx5IGEgQ1NTIGJyaWdodG5lc3MgZmlsdGVyIG1hcHBlZCBmcm9tIGNmZy5kYXJrTGV2ZWwgKDEuNSAuLiAyLjhcbiAgICAgKiDihpIgMC42IC4uIDEuNCkgc28gdGhlIHVzZXIgY2FuIFNFRSB0aGUgYnJpZ2h0bmVzcyBzbGlkZXIgd29ya2luZy4gKi9cbiAgICBjb25zdCBpc0xpZ2h0ID0gY2ZnLnRoZW1lID09PSAnbGlnaHQnO1xuICAgIGNvbnN0IHBhbGV0dGUgPSBpc0xpZ2h0XG4gICAgICAgID8geyBiZzonI2Y4ZmFmYycsIGdyaWQ6JyNjYmQ1ZTEnLCB0aWNrOicjNDc1NTY5JywgYXhpczonIzFlMjkzYicsXG4gICAgICAgICAgICBwYW5lbEJnOidyZ2JhKDI0OCwyNTAsMjUyLDAuODUpJywgcGFuZWxCb3JkZXI6JyNjYmQ1ZTEnLFxuICAgICAgICAgICAgcGlsbEJnOicjZTJlOGYwJywgcGlsbEZnOicjNDc1NTY5JywgbWV0YUZnOicjNjQ3NDhiJyB9XG4gICAgICAgIDogeyBiZzonIzBiMTIyMCcsIGdyaWQ6JyMxZTI5M2InLCB0aWNrOicjOTRhM2I4JywgYXhpczonI2NiZDVlMScsXG4gICAgICAgICAgICBwYW5lbEJnOidyZ2JhKDE1LDIzLDQyLDAuNiknLCBwYW5lbEJvcmRlcjonIzFlMjkzYicsXG4gICAgICAgICAgICBwaWxsQmc6JyMxZTI5M2InLCBwaWxsRmc6JyM5NGEzYjgnLCBtZXRhRmc6JyM2NDc0OGInIH07XG4gICAgY29uc3QgZGltRmlsdGVyID0gaXNMaWdodFxuICAgICAgICA/ICdub25lJ1xuICAgICAgICA6IGBicmlnaHRuZXNzKCR7KE1hdGgubWF4KDEuNSwgTWF0aC5taW4oMi44LCBjZmcuZGFya0xldmVsIHx8IDIuMCkpIC8gMi4wKS50b0ZpeGVkKDIpfSlgO1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3VuZGVkLTJ4bCBwLTQgYm9yZGVyIHRyYW5zaXRpb24tY29sb3JzIGR1cmF0aW9uLTMwMFwiXG4gICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOiBwYWxldHRlLnBhbmVsQmcsIGJvcmRlckNvbG9yOiBwYWxldHRlLnBhbmVsQm9yZGVyfX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBtYi0zXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicGlsbFwiIHN0eWxlPXt7YmFja2dyb3VuZDpwYWxldHRlLnBpbGxCZywgY29sb3I6cGFsZXR0ZS5waWxsRmd9fT5QU1lDSFJPTUVUUklDIENIQVJUIMK3IGxpdmUgcHJldmlldzwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSBmb250LW1vbm9cIiBzdHlsZT17e2NvbG9yOnBhbGV0dGUubWV0YUZnfX0+e1RfTUlOfcKwQyDihpIge1RfTUFYfcKwQyAgwrcgIHtjZmcucmhMb33igJN7Y2ZnLnJoSGl9JSBSSDwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHN2ZyB2aWV3Qm94PXtgMCAwICR7V30gJHtIfWB9IGNsYXNzTmFtZT1cInctZnVsbCBoLWF1dG8gdHJhbnNpdGlvbi1bZmlsdGVyXSBkdXJhdGlvbi0zMDBcIlxuICAgICAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6IHBhbGV0dGUuYmcsIGJvcmRlclJhZGl1czo4LCBmaWx0ZXI6IGRpbUZpbHRlcn19PlxuICAgICAgICAgICAgICAgIHsvKiAtLS0tIGdyaWQ6IHZlcnRpY2FsIFQgbGluZXMsIGhvcml6b250YWwgVyBsaW5lcyAtLS0tICovfVxuICAgICAgICAgICAgICAgIHtBcnJheS5mcm9tKHtsZW5ndGg6MTF9KS5tYXAoKF8saSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ID0gVF9NSU4gKyAoaS8xMCkgKiAoVF9NQVggLSBUX01JTik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZyBrZXk9eyd2dCcraX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3godCl9IHkxPXtwYWQudG9wfSB4Mj17eCh0KX0geTI9e3BhZC50b3ArZ3JpZEh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPXtwYWxldHRlLmdyaWR9IHN0cm9rZVdpZHRoPVwiMC42XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3godCl9IHk9e3BhZC50b3ArZ3JpZEgrMTZ9IGZvbnRTaXplPVwiOS41XCIgZmlsbD17cGFsZXR0ZS50aWNrfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIj57dC50b0ZpeGVkKDApfTwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICB7QXJyYXkuZnJvbSh7bGVuZ3RoOjd9KS5tYXAoKF8saSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB3ID0gV19NSU4gKyAoaS82KSAqIChXX01BWCAtIFdfTUlOKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxnIGtleT17J2h3JytpfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17cGFkLmxlZnR9IHkxPXt5KHcpfSB4Mj17cGFkLmxlZnQrZ3JpZFd9IHkyPXt5KHcpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT17cGFsZXR0ZS5ncmlkfSBzdHJva2VXaWR0aD1cIjAuNlwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXtwYWQubGVmdC04fSB5PXt5KHcpKzN9IGZvbnRTaXplPVwiOS41XCIgZmlsbD17cGFsZXR0ZS50aWNrfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJlbmRcIj57KHcqMTAwMCkudG9GaXhlZCgwKX08L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgey8qIC0tLS0gUkggaXNvcGxldGhzIChjdXJ2ZXMpIC0tLS0gKi99XG4gICAgICAgICAgICAgICAge2lzb3BsZXRocy5tYXAocmggPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwdHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdCA9IFRfTUlOOyB0IDw9IFRfTUFYOyB0ICs9IDAuNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgd3cgPSBfZ2V0Vyh0LCByaCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod3cgPj0gV19NSU4gJiYgd3cgPD0gV19NQVgpIHB0cy5wdXNoKFt0LCB3d10pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZyBrZXk9eydpc28nK3JofT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cG9seWxpbmUgcG9pbnRzPXtzYWZlUHRzKHB0cyl9IGZpbGw9XCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPXtyaCA9PT0gMTAwID8gJyM2MzY2ZjEnIDogJyNlYzQ4OTk1NSd9IHN0cm9rZVdpZHRoPVwiMC44XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlRGFzaGFycmF5PXtyaCA9PT0gMTAwID8gJycgOiAnMywzJ30vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtwdHMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3gocHRzW01hdGguZmxvb3IocHRzLmxlbmd0aCowLjY1KV1bMF0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5PXt5KHB0c1tNYXRoLmZsb29yKHB0cy5sZW5ndGgqMC42NSldWzFdKSAtIDR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplPVwiOVwiIGZpbGw9XCIjZWM0ODk5OTlcIiBmb250V2VpZ2h0PVwiNzAwXCI+e3JofSU8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cblxuICAgICAgICAgICAgICAgIHsvKiAtLS0tIEdpdm9uaSBvdmVybGF5IChjb3BpZWQgdmVyYmF0aW0gZnJvbSBhcHAuanMgcmVuZGVyIG9yZGVyKSAtLS0tICovfVxuICAgICAgICAgICAgICAgIHtjZmcuZ2l2b25pICYmIChcbiAgICAgICAgICAgICAgICAgICAgPGcgY2xhc3NOYW1lPVwicG9pbnRlci1ldmVudHMtbm9uZVwiIG9wYWNpdHk9XCIwLjlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXt4KDQwKX0geTE9e3koMTYvMTAwMCl9IHgyPXt4KDUwKX0geTI9e3koMTYvMTAwMCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCIjNjM2NmYxXCIgc3Ryb2tlV2lkdGg9XCIxLjVcIiBzdHJva2VEYXNoYXJyYXk9XCI0LDRcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17eCg1MCl9IHkxPXt5KDE2LzEwMDApfSB4Mj17eCg1MCl9IHkyPXt5KDApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiIzYzNjZmMVwiIHN0cm9rZVdpZHRoPVwiMS41XCIgc3Ryb2tlRGFzaGFycmF5PVwiNCw0XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3goNDEpfSB5MT17eSgwKX0geDI9e3goNTApfSB5Mj17eSgwKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cIiM2MzY2ZjFcIiBzdHJva2VXaWR0aD1cIjEuNVwiIHN0cm9rZURhc2hhcnJheT1cIjQsNFwiLz5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKE1DVil9ICBmaWxsPVwiI2VjNDg5OVwiIGZpbGxPcGFjaXR5PVwiMC4wNVwiIHN0cm9rZT1cIiNlYzQ4OTlcIiBzdHJva2VXaWR0aD1cIjFcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoTWFzcyl9IGZpbGw9XCIjOGI1Y2Y2XCIgZmlsbE9wYWNpdHk9XCIwLjA1XCIgc3Ryb2tlPVwiIzhiNWNmNlwiIHN0cm9rZVdpZHRoPVwiMVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhFVkFQKX0gZmlsbD1cIiMwNmI2ZDRcIiBmaWxsT3BhY2l0eT1cIjAuMDhcIiBzdHJva2U9XCIjMDZiNmQ0XCIgc3Ryb2tlV2lkdGg9XCIxXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKE5WKX0gICBmaWxsPVwiI2Y1OWUwYlwiIGZpbGxPcGFjaXR5PVwiMC4wNVwiIHN0cm9rZT1cIiNmNTllMGJcIiBzdHJva2VXaWR0aD1cIjFcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoQ1opfSAgIGZpbGw9XCIjMTBiOTgxXCIgZmlsbE9wYWNpdHk9XCIwLjE1XCIgc3Ryb2tlPVwiIzEwYjk4MVwiIHN0cm9rZVdpZHRoPVwiMS4yXCIvPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICB7LyogU3dlZXQtc3BvdCBiYW5kLCBjbGlwcGVkIHRvIENaICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgPGRlZnM+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNsaXBQYXRoIGlkPVwiY3otY2xpcC13YWxrXCIgY2xpcFBhdGhVbml0cz1cInVzZXJTcGFjZU9uVXNlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhDWil9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2NsaXBQYXRoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kZWZzPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKFNXRUVUKX0gY2xpcFBhdGg9XCJ1cmwoI2N6LWNsaXAtd2FsaylcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbD1cIiMwNTk2NjlcIiBmaWxsT3BhY2l0eT1cIjAuMzJcIiBzdHJva2U9XCIjMDQ3ODU3XCIgc3Ryb2tlV2lkdGg9XCIwLjhcIiBzdHJva2VEYXNoYXJyYXk9XCIzLDJcIi8+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhXSU5URVIpfSBmaWxsPVwiIzNiODJmNlwiIGZpbGxPcGFjaXR5PVwiMC4xNVwiIHN0cm9rZT1cIm5vbmVcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17eCgxOSl9IHkxPXtwYWQudG9wKzE4fSB4Mj17eCgxOSl9IHkyPXtwYWQudG9wK2dyaWRIfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiIzNiODJmNlwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZURhc2hhcnJheT1cIjYsNFwiIG9wYWNpdHk9XCIwLjhcIi8+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBSZWdpb24gbGFiZWxzIOKAlCBzYW1lIGNvbG9ycyAmIHNwaXJpdCBhcyBsaXZlIGNoYXJ0ICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCg1MCktMTB9IHk9e3koOC8xMDAwKX0gZmlsbD1cIiM2MzY2ZjFcIiBmb250U2l6ZT1cIjEwXCIgZm9udFdlaWdodD1cIjkwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgdHJhbnNmb3JtPXtgcm90YXRlKC05MCwgJHt4KDUwKS0xMH0sICR7eSg4LzEwMDApfSlgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZz1cIjJcIj5NRUNIQU5JQ0FMIENPT0xJTkc8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDQ0KS0yfSB5PXt5KDgvMTAwMCl9IGZpbGw9XCIjZWM0ODk5XCIgZm9udFNpemU9XCI5XCIgZm9udFdlaWdodD1cIjkwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgdHJhbnNmb3JtPXtgcm90YXRlKC05MCwgJHt4KDQ0KS0yfSwgJHt5KDgvMTAwMCl9KWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nPVwiMS41XCI+TUFTUyBDT09MSU5HPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCgzNyktMTB9IHk9e3koOC8xMDAwKX0gZmlsbD1cIiM4YjVjZjZcIiBmb250U2l6ZT1cIjlcIiBmb250V2VpZ2h0PVwiOTAwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiB0cmFuc2Zvcm09e2Byb3RhdGUoLTkwLCAke3goMzcpLTEwfSwgJHt5KDgvMTAwMCl9KWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nPVwiMS41XCI+TUFTUyBDT09MSU5HPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCgzNCl9IHk9e3koMC41LzEwMDApLTh9IGZpbGw9XCIjMDZiNmQ0XCIgZm9udFNpemU9XCI5XCIgZm9udFdlaWdodD1cIjkwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgbGV0dGVyU3BhY2luZz1cIjJcIj5FVkFQT1JBVElWRTwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goMjMuNSl9IHk9e3koX2dldFcoMjMuNSwgNDUpKX0gZmlsbD1cIiMxMGI5ODFcIiBmb250U2l6ZT1cIjExXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ9XCI5MDBcIiB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgbGV0dGVyU3BhY2luZz1cIjEuNVwiPkNPTUZPUlQ8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDE4Ljc1KX0geT17eShfZ2V0VygxOC43NSwgNDUpKX0gZmlsbD1cIiMzYjgyZjZcIiBmb250U2l6ZT1cIjExXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ9XCI5MDBcIiB0ZXh0QW5jaG9yPVwibWlkZGxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybT17YHJvdGF0ZSgtOTAsICR7eCgxOC43NSl9LCAke3koX2dldFcoMTguNzUsIDQ1KSl9KWB9PldJTlRFUjwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goMjMuNSl9IHk9e3koX2dldFcoMjMuNSwgKGNmZy5yaExvK2NmZy5yaEhpKS8yKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxsPVwiIzAyMmMyMlwiIGZvbnRTaXplPVwiOFwiIGZvbnRXZWlnaHQ9XCI5MDBcIiB0ZXh0QW5jaG9yPVwibWlkZGxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7cGFpbnRPcmRlcjonc3Ryb2tlJywgc3Ryb2tlOicjYTdmM2QwJywgc3Ryb2tlV2lkdGg6JzIuNXB4Jywgc3Ryb2tlTGluZWpvaW46J3JvdW5kJ319XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nPVwiMS41XCI+e2NmZy5yaExvfS17Y2ZnLnJoSGl9JSBSSDwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgICAgICB7LyogYXhpcyBsYWJlbHMgKi99XG4gICAgICAgICAgICAgICAgPHRleHQgeD17cGFkLmxlZnQgKyBncmlkVy8yfSB5PXtILTEyfSBmb250U2l6ZT1cIjExXCIgZmlsbD17cGFsZXR0ZS5heGlzfVxuICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiBmb250V2VpZ2h0PVwiODAwXCIgbGV0dGVyU3BhY2luZz1cIjJcIj5EUlkgQlVMQiBURU1QICjCsEMpPC90ZXh0PlxuICAgICAgICAgICAgICAgIDx0ZXh0IHg9ezE2fSB5PXtwYWQudG9wICsgZ3JpZEgvMn0gZm9udFNpemU9XCIxMVwiIGZpbGw9e3BhbGV0dGUuYXhpc31cbiAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgZm9udFdlaWdodD1cIjgwMFwiIGxldHRlclNwYWNpbmc9XCIyXCJcbiAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm09e2Byb3RhdGUoLTkwIDE2ICR7cGFkLnRvcCArIGdyaWRILzJ9KWB9PkhVTUlESVRZIFJBVElPIChnL2tnKTwvdGV4dD5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG5mdW5jdGlvbiBQc3lDb250cm9sUGFuZWwoeyBjZmcsIHVwZGF0ZSwgc2V0Q2ZnIH0pIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXNsYXRlLTkwMC82MCBib3JkZXIgYm9yZGVyLXNsYXRlLTgwMCByb3VuZGVkLTJ4bCBwLTUgc3BhY2UteS02XCI+XG4gICAgICAgICAgICB7LyogVGhlbWUgKyBicmlnaHRuZXNzICAtLSByZWxvY2F0ZWQgZnJvbSB0aGUgZGFzaGJvYXJkIHNpZGViYXIgMjAyNi0wNi0yNS5cbiAgICAgICAgICAgICAgICBUd28gY29udHJvbHM6IERhcmsvTGlnaHQgbW9kZSB0b2dnbGUsIGFuZCBCcmlnaHRuZXNzIHNsaWRlciAob25seVxuICAgICAgICAgICAgICAgIG1lYW5pbmdmdWwgaW4gZGFyayBtb2RlKS4gIExpdmUgcHJldmlldyBhcHBsaWVzIHRvIHRoZSBzdXJyb3VuZGluZ1xuICAgICAgICAgICAgICAgIGNvbnRyb2wgcGFuZWwgc28gdGhlIG9wZXJhdG9yIGNhbiBGRUVMIHRoZSBjaGFuZ2UgYmVmb3JlIHNhdmluZy4gKi99XG4gICAgICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwicHN5LWNmZy10aGVtZS1ibG9ja1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMlwiPkRpc3BsYXkgTW9kZTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtMiBtYi0zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJwc3ktY2ZnLXRoZW1lLWRhcmtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldENmZyhjID0+ICh7Li4uYywgdGhlbWU6J2RhcmsnLCBkYXJrTGV2ZWw6TWF0aC5taW4oYy5kYXJrTGV2ZWwgfHwgMi4wLCAyLjYpfSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB5LTIuNSByb3VuZGVkLWxnIHRleHQteHMgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGJvcmRlciB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2NmZy50aGVtZSA9PT0gJ2RhcmsnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1zbGF0ZS04MDAgYm9yZGVyLXllbGxvdy01MDAvNzAgdGV4dC15ZWxsb3ctMzAwIHNoYWRvdy1sZyBzaGFkb3cteWVsbG93LTUwMC8xMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLXNsYXRlLTkwMC8zMCBib3JkZXItc2xhdGUtNzAwIHRleHQtc2xhdGUtNTAwIGhvdmVyOmJnLXNsYXRlLTgwMC82MCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICDwn4yZICBEaW0gLyBEYXJrXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwicHN5LWNmZy10aGVtZS1saWdodFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0Q2ZnKGMgPT4gKHsuLi5jLCB0aGVtZTonbGlnaHQnLCBkYXJrTGV2ZWw6My4wfSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB5LTIuNSByb3VuZGVkLWxnIHRleHQteHMgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGJvcmRlciB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2NmZy50aGVtZSA9PT0gJ2xpZ2h0J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctc2xhdGUtMTAwIGJvcmRlci1za3ktNTAwLzcwIHRleHQtc2t5LTcwMCBzaGFkb3ctbGcgc2hhZG93LXNreS01MDAvMTAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1zbGF0ZS05MDAvMzAgYm9yZGVyLXNsYXRlLTcwMCB0ZXh0LXNsYXRlLTUwMCBob3ZlcjpiZy1zbGF0ZS04MDAvNjAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAg4piAICBMaWdodFxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICB7LyogQnJpZ2h0bmVzcyBzbGlkZXIg4oCUIG9ubHkgbWVhbmluZ2Z1bCB3aGVuIHRoZW1lID09PSAnZGFyaycgKi99XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NmZy50aGVtZSA9PT0gJ2xpZ2h0JyA/ICdvcGFjaXR5LTQwIHBvaW50ZXItZXZlbnRzLW5vbmUnIDogJyd9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBtYi0xXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJvbGQgdGV4dC1zbGF0ZS01MDBcIj5EaW0gYnJpZ2h0bmVzczwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSBmb250LW1vbm8gdGV4dC15ZWxsb3ctMzAwIHRhYnVsYXItbnVtc1wiPntNYXRoLnJvdW5kKChjZmcuZGFya0xldmVsIHx8IDIuMCkgKiAxMDApfSU8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwicHN5LWNmZy1kYXJrLWxldmVsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbj1cIjEuNVwiIG1heD1cIjIuOFwiIHN0ZXA9XCIwLjAyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtjZmcudGhlbWUgPT09ICdsaWdodCcgPyAyLjAgOiAoY2ZnLmRhcmtMZXZlbCB8fCAyLjApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIGRhcmtMZXZlbDogcGFyc2VGbG9hdChlLnRhcmdldC52YWx1ZSksIHRoZW1lOidkYXJrJ30pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLWlucHV0IHctZnVsbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBhY2NlbnRDb2xvcjonI2ZhY2MxNScgfX0vPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTIgaXRhbGljXCI+XG4gICAgICAgICAgICAgICAgICAgIEFwcGxpZWQgdG8gdGhlIHdob2xlIGRhc2hib2FyZC4gIERpbSBpcyByZWNvbW1lbmRlZCBmb3IgY29udHJvbCByb29tczsgTGlnaHQgZm9yIGRheXRpbWUgd2Fsay10aHJvdWdocy5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIEdpdm9uaSB0b2dnbGUgKi99XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMlwiPkdpdm9uaSBFbmdpbmU8L2Rpdj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHVwZGF0ZSgnZ2l2b25pJywgIWNmZy5naXZvbmkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdy1mdWxsIHB5LTMgcm91bmRlZC14bCB0ZXh0LXNtIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjZmcuZ2l2b25pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctaW5kaWdvLTYwMCB0ZXh0LXdoaXRlIHNoYWRvdy1sZyBzaGFkb3ctaW5kaWdvLTUwMC8zMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1zbGF0ZS04MDAgdGV4dC1zbGF0ZS00MDAgYm9yZGVyIGJvcmRlci1zbGF0ZS03MDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICB7Y2ZnLmdpdm9uaSA/ICdHaXZvbmkgT04nIDogJ0dpdm9uaSBPRkYnfVxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTIgbGVhZGluZy1yZWxheGVkXCI+XG4gICAgICAgICAgICAgICAgICAgIE92ZXJsYXlzIHRoZSA0IGNsaW1hdGUtc3RyYXRlZ3kgcmVnaW9ucyAoQ29tZm9ydCwgTmF0IFZlbnQsIEV2YXAsIE1lY2ggQ29vbCkuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBSSCByYW5nZSAqL31cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0yXCI+UkggU3dlZXQtU3BvdCBSYW5nZTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItM1wiPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJvbGQgdGV4dC1zbGF0ZS01MDAgbWItMSBibG9ja1wiPlZlbnVlIHByZXNldDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXQgY3Vyc29yLXBvaW50ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtjZmcucmhQcmVzZXQgfHwgJ2N1c3RvbSd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHAgPSBSSF9QUkVTRVRTLmZpbmQocCA9PiBwLmlkID09PSBlLnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocC5pZCA9PT0gJ2N1c3RvbScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZSgncmhQcmVzZXQnLCAnY3VzdG9tJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIHJoUHJlc2V0OnAuaWQsIHJoTG86cC5sbywgcmhIaTpwLmhpfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7UkhfUFJFU0VUUy5tYXAocCA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBrZXk9e3AuaWR9IHZhbHVlPXtwLmlkfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3AubGFiZWx9e3AubG8gIT0gbnVsbCA/IGAgIMK3ICAke3AubG99LSR7cC5oaX0lIFJIYCA6ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgICAgICB7KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHAgPSBSSF9QUkVTRVRTLmZpbmQoeCA9PiB4LmlkID09PSAoY2ZnLnJoUHJlc2V0IHx8ICdjdXN0b20nKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcCAmJiBwLm5vdGUgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbXQtMS41IGl0YWxpY1wiPntwLm5vdGV9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgKSA6IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH0pKCl9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMyBtYi0yXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1tb25vIHRleHQtc2xhdGUtNDAwIHctMTBcIj57Y2ZnLnJoTG99JTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj1cIjIwXCIgbWF4PXtjZmcucmhIaS01fSB2YWx1ZT17Y2ZnLnJoTG99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldENmZyhjID0+ICh7Li4uYywgcmhMbzorZS50YXJnZXQudmFsdWUsIHJoUHJlc2V0OidjdXN0b20nfSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2UtaW5wdXQgZmxleC0xXCIvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyBmb250LW1vbm8gdGV4dC1zbGF0ZS00MDAgdy0xMFwiPntjZmcucmhIaX0lPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPXtjZmcucmhMbys1fSBtYXg9XCI5MFwiIHZhbHVlPXtjZmcucmhIaX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0Q2ZnKGMgPT4gKHsuLi5jLCByaEhpOitlLnRhcmdldC52YWx1ZSwgcmhQcmVzZXQ6J2N1c3RvbSd9KSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyYW5nZS1pbnB1dCBmbGV4LTFcIi8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIEF4aXMgcmFuZ2UgKi99XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMlwiPlRlbXBlcmF0dXJlIEF4aXMgUmFuZ2U8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zIG1iLTJcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyBmb250LW1vbm8gdGV4dC1zbGF0ZS00MDAgdy0xMFwiPntjZmcudExvfcKwPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPVwiLTQwXCIgbWF4PXtjZmcudEhpLTEwfSB2YWx1ZT17Y2ZnLnRMb31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlKCd0TG8nLCArZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2UtaW5wdXQgZmxleC0xXCIvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyBmb250LW1vbm8gdGV4dC1zbGF0ZS00MDAgdy0xMFwiPntjZmcudEhpfcKwPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPXtjZmcudExvKzEwfSBtYXg9XCI2MFwiIHZhbHVlPXtjZmcudEhpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGUoJ3RIaScsICtlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyYW5nZS1pbnB1dCBmbGV4LTFcIi8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbXQtMiBsZWFkaW5nLXJlbGF4ZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgQ2hhcnQgd2lsbCBiZSByZWRyYXduIHdpdGggdGhpcyBkcnktYnVsYiB0ZW1wZXJhdHVyZSB3aW5kb3cuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyLXQgYm9yZGVyLXNsYXRlLTgwMCBwdC00XCI+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbGVhZGluZy1yZWxheGVkXCI+XG4gICAgICAgICAgICAgICAgICAgIENoYW5nZXMgcHJldmlldyBsaXZlIGluIHRoZSBza2VsZXRvbiBjaGFydCBvbiB0aGUgbGVmdC4gIEhpdFxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWluZGlnby00MDAgZm9udC1ibGFja1wiPiBTYXZlICYgcmV0dXJuIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgaW4gdGhlIGhlYWRlciB3aGVuIHlvdSdyZSBoYXBweS5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTG9jYXRpb24gU2V0dGluZyAtLSBtb2RhbCB3LyBpbnRlcmFjdGl2ZSBMZWFmbGV0IG1hcCArIHJldmVyc2UgZ2VvY29kaW5nXG4gKiBDbGljayBhbnl3aGVyZSBvbiB0aGUgbWFwIChvciBkcmFnIHRoZSBtYXJrZXIpIHRvIHNldCBsYXQvbG9uLlxuICogTWFudWFsIGxhdC9sb24gZWRpdHMgcmUtY2VudHJlIHRoZSBtYXJrZXIuICBDaXR5IG5hbWUgaXMgYXV0by1wb3B1bGF0ZWRcbiAqIHZpYSBPcGVuU3RyZWV0TWFwIE5vbWluYXRpbSAobm8ga2V5IHJlcXVpcmVkLCByYXRlLWxpbWl0ZWQgdG8gfjEgcmVxL3MpLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKiBEZS1kdXAgKyBzYW5pdHktY2hlY2sgYSByYXcgc2F2ZWQtbG9jYXRpb25zIGFycmF5IChmcm9tIHNlcnZlciBvclxuICogbG9jYWxTdG9yYWdlKS4gIERlZHVwIGtleSBpcyBgbGF0LnRvRml4ZWQoNCksbG9uLnRvRml4ZWQoNClgIC0tIHRoZVxuICogU0FNRSBrZXkgdGhlIGRhc2hib2FyZCdzIHdlYXRoZXItc2V0dGluZ3MtbW9kYWwuanMgdXNlcyAtLSBzbyB0aGVcbiAqIFNldHVwIFdhbGsgZHJvcGRvd24gc2hvd3MgdGhlIGV4YWN0IHNhbWUgc2V0IHRoZSBvcGVyYXRvciBzZWVzIGluXG4gKiB0aGUgZGFzaGJvYXJkJ3MgM0QtV3ggV2VhdGhlciBidXR0b24uICBUd28gZW50cmllcyB0aGF0IHNoYXJlIGEgbmFtZVxuICogKGUuZy4gXCJIT01FXCIgYXQgdGhlIG9mZmljZSBhbmQgXCJIT01FXCIgYXQgdGhlIGFwYXJ0bWVudCkgYnV0IGhhdmVcbiAqIGRpZmZlcmVudCBjb29yZGluYXRlcyBhcmUgQk9USCBrZXB0OyBvbmx5IHRydWUgY29vcmQgZHVwbGljYXRlcyBhcmVcbiAqIGNvbGxhcHNlZC4gIERyb3BzIGVudHJpZXMgbWlzc2luZyBhIG5hbWUgb3Igd2l0aCBub24tZmluaXRlIGxhdC9sb24uICovXG5mdW5jdGlvbiBfbm9ybWFsaXplTG9jcyhhcnIpIHtcbiAgICBjb25zdCBzZWVuID0gbmV3IFNldCgpO1xuICAgIGNvbnN0IG91dCA9IFtdO1xuICAgIGZvciAoY29uc3QgbCBvZiAoYXJyIHx8IFtdKSkge1xuICAgICAgICBpZiAoIWwgfHwgdHlwZW9mIGwubmFtZSAhPT0gJ3N0cmluZycpIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCBsYXQgPSArbC5sYXQsIGxvbiA9ICtsLmxvbjtcbiAgICAgICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUobGF0KSB8fCAhTnVtYmVyLmlzRmluaXRlKGxvbikpIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCBuYW1lID0gbC5uYW1lLnRyaW0oKTtcbiAgICAgICAgaWYgKCFuYW1lKSBjb250aW51ZTtcbiAgICAgICAgY29uc3Qga2V5ID0gbGF0LnRvRml4ZWQoNCkgKyAnLCcgKyBsb24udG9GaXhlZCg0KTtcbiAgICAgICAgaWYgKHNlZW4uaGFzKGtleSkpIGNvbnRpbnVlO1xuICAgICAgICBzZWVuLmFkZChrZXkpO1xuICAgICAgICBvdXQucHVzaCh7IG5hbWUsIGxhdCwgbG9uIH0pO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xufVxuXG5mdW5jdGlvbiBMb2NhdGlvbk1vZGFsKHsgY2ZnLCBzZXRDZmcsIG9uQ2xvc2UsIG9uU2F2ZSB9KSB7XG4gICAgY29uc3QgbWFwQm94UmVmID0gUmVhY3QudXNlUmVmKG51bGwpO1xuICAgIGNvbnN0IG1hcFJlZiAgICA9IFJlYWN0LnVzZVJlZihudWxsKTtcbiAgICBjb25zdCBtYXJrZXJSZWYgPSBSZWFjdC51c2VSZWYobnVsbCk7XG4gICAgY29uc3QgW2dlb0J1c3ksIHNldEdlb0J1c3ldID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuXG4gICAgLyogLS0tLS0gc2F2ZWQgbG9jYXRpb25zIC0tIG1pcnJvciB3aGF0IHRoZSBEYXNoYm9hcmQncyBXZWF0aGVyIGJ1dHRvbiBzaG93cy5cbiAgICAgKlxuICAgICAqIFRoZSBkYXNoYm9hcmQgcmVhZHMgdGhlbSBmcm9tIGAke0FQSV9VUkx9L2FwaS93ZWF0aGVyLWxvY2F0aW9uYCdzXG4gICAgICogYHNhdmVkYCBhcnJheSBhbmQgbWlycm9ycyB0aGF0IGludG8gbG9jYWxTdG9yYWdlWydzYXZlZFdlYXRoZXJMb2NhdGlvbnMnXVxuICAgICAqIG9uIG1vdW50IChzZWUgcHVibGljL2pzL2Rhc2hib2FyZC9hcHAuanMjaHlkcmF0ZVdlYXRoZXJTdGF0ZSkuICBXZSBkb1xuICAgICAqIHRoZSBTQU1FIHRoaW5nIGhlcmUgc28gdGhlIFNldHVwIFdhbGsncyBTaXRlLW5hbWUgZHJvcGRvd24gc3RheXNcbiAgICAgKiBieXRlLWlkZW50aWNhbCB3aXRoIHRoZSBkYXNoYm9hcmQncyBsb2NhdGlvbiBsaXN0IC0tIGluY2x1ZGluZyB3aGVuIHRoZVxuICAgICAqIG9wZXJhdG9yIHZpc2l0cyBTZXR1cCBXYWxrIEJFRk9SRSBldmVyIG9wZW5pbmcgdGhlIGRhc2hib2FyZCAoZnJlc2hcbiAgICAgKiBkZXZpY2UgY2FzZSB3aGVyZSBsb2NhbFN0b3JhZ2UgaXMgZW1wdHkpLlxuICAgICAqXG4gICAgICogU3RyYXRlZ3k6XG4gICAgICogICAxKSBSZWFkIGxvY2FsU3RvcmFnZSBmaXJzdCAoaW5zdGFudCwgbm8gZmxpY2tlciBpZiBhbHJlYWR5IGh5ZHJhdGVkKS5cbiAgICAgKiAgIDIpIFRoZW4gR0VUIC9hcGkvd2VhdGhlci1sb2NhdGlvbiAoY2Fub25pY2FsLCBjcm9zcy1kZXZpY2Ugc291cmNlKS5cbiAgICAgKiAgIDMpIFdoaWNoZXZlciBpcyBub24tZW1wdHkgd2luczsgc2VydmVyIHdpbnMgdGllcy5cbiAgICAgKlxuICAgICAqIEZyZWUtZm9ybSB0eXBpbmcgaW4gdGhlIGlucHV0IHN0aWxsIHdvcmtzIC0tIHRoZSBkYXRhbGlzdCBpcyBzdWdnZXN0aW9uXG4gICAgICogb25seSwgdGhlIGlucHV0IG5ldmVyIHJlc3RyaWN0cyB0aGUgdmFsdWUuICovXG4gICAgY29uc3QgW3NhdmVkTG9jcywgc2V0U2F2ZWRMb2NzXSA9IFJlYWN0LnVzZVN0YXRlKCgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJhdyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzYXZlZFdlYXRoZXJMb2NhdGlvbnMnKTtcbiAgICAgICAgICAgIGlmICghcmF3KSByZXR1cm4gW107XG4gICAgICAgICAgICBjb25zdCBhcnIgPSBKU09OLnBhcnNlKHJhdyk7XG4gICAgICAgICAgICByZXR1cm4gQXJyYXkuaXNBcnJheShhcnIpID8gX25vcm1hbGl6ZUxvY3MoYXJyKSA6IFtdO1xuICAgICAgICB9IGNhdGNoIChlKSB7IHJldHVybiBbXTsgfVxuICAgIH0pO1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGxldCBjYW5jZWxsZWQgPSBmYWxzZTtcbiAgICAgICAgKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKCcvYXBpL3dlYXRoZXItbG9jYXRpb24nLCB7IGNyZWRlbnRpYWxzOidpbmNsdWRlJywgY2FjaGU6J25vLXN0b3JlJyB9KTtcbiAgICAgICAgICAgICAgICBpZiAoIXIub2spIHJldHVybjtcbiAgICAgICAgICAgICAgICBjb25zdCBqID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2F2ZWQgPSBfbm9ybWFsaXplTG9jcyhBcnJheS5pc0FycmF5KGouc2F2ZWQpID8gai5zYXZlZCA6IFtdKTtcbiAgICAgICAgICAgICAgICBpZiAoY2FuY2VsbGVkKSByZXR1cm47XG4gICAgICAgICAgICAgICAgaWYgKHNhdmVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0U2F2ZWRMb2NzKHNhdmVkKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gTWlycm9yIHRvIGxvY2FsU3RvcmFnZSBzbyB0aGUgZGFzaGJvYXJkIHNlZXMgdGhlIHNhbWUgbGlzdFxuICAgICAgICAgICAgICAgICAgICAvLyBldmVuIGlmIGl0cyBvd24gaHlkcmF0ZSBoYXNuJ3QgcnVuIHlldCB0aGlzIHNlc3Npb24uXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzYXZlZFdlYXRoZXJMb2NhdGlvbnMnLCBKU09OLnN0cmluZ2lmeShzYXZlZCkpOyB9IGNhdGNoIChlKSB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogb2ZmbGluZSAtPiBsb2NhbFN0b3JhZ2UgdmFsdWUgYWxyZWFkeSBpbiBzdGF0ZSAqLyB9XG4gICAgICAgIH0pKCk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7IGNhbmNlbGxlZCA9IHRydWU7IH07XG4gICAgfSwgW10pO1xuXG4gICAgLyogLS0tLS0gc2F2ZWQtbG9jYXRpb25zIGRyb3Bkb3duIG9wZW4vY2xvc2Ugc3RhdGUuXG4gICAgICogTmF0aXZlIDxkYXRhbGlzdD4gaGlkZXMgaXRzIGNoZXZyb24gaW4gbW9zdCBicm93c2VycyAoZXNwZWNpYWxseSBpblxuICAgICAqIGEgZGFyayB0aGVtZSksIHdoaWNoIG1hZGUgdGhlIFwiZHJvcCBkb3duXCIgaW52aXNpYmxlIHRvIG9wZXJhdG9yc1xuICAgICAqIHdobyBjbGVhcmx5IGhhZCBtdWx0aXBsZSBzYXZlZCBsb2NhdGlvbnMuICBSZXBsYWNlZCB3aXRoIGEgY3VzdG9tXG4gICAgICogcG9wZG93biBwYW5lbCB0aGF0IGhhcyBhbiBBTFdBWVMtVklTSUJMRSBjaGV2cm9uIGJ1dHRvbiAtLSBjbGljayBpdFxuICAgICAqIHRvIHRvZ2dsZSwgY2xpY2sgb3V0c2lkZSB0byBkaXNtaXNzLiAqL1xuICAgIGNvbnN0IFtzYXZlZE9wZW4sIHNldFNhdmVkT3Blbl0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3Qgc2F2ZWRSZWYgPSBSZWFjdC51c2VSZWYobnVsbCk7XG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKCFzYXZlZE9wZW4pIHJldHVybjtcbiAgICAgICAgY29uc3Qgb25Eb2NDbGljayA9IChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoc2F2ZWRSZWYuY3VycmVudCAmJiAhc2F2ZWRSZWYuY3VycmVudC5jb250YWlucyhlLnRhcmdldCkpIHNldFNhdmVkT3BlbihmYWxzZSk7XG4gICAgICAgIH07XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spO1xuICAgICAgICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2NDbGljayk7XG4gICAgfSwgW3NhdmVkT3Blbl0pO1xuXG4gICAgLyogV2hlbiB0aGUgdXNlciBwaWNrcyBhIG5hbWUgZnJvbSB0aGUgZHJvcGRvd24gT1IgdHlwZXMgb25lIHRoYXRcbiAgICAgKiBleGFjdGx5IG1hdGNoZXMgYSBzYXZlZCBlbnRyeSwgcHVsbCBpdHMgbGF0L2xvbiBhbmQgcmVjZW50cmUgdGhlXG4gICAgICogbWFwLiAgRnJlZS1mb3JtIHR5cGluZyBzdGlsbCB3b3JrcyAtLSB0aGUgbmFtZSBpcyBqdXN0IGtlcHQgYXMgdGhlXG4gICAgICogc2l0ZSBsYWJlbC4gIEF2b2lkcyBzdXJwcmlzaW5nIHRoZSBvcGVyYXRvciB3aG8gdHlwZXMgXCJQYXZpbGlvbiBCXCJcbiAgICAgKiAoYSBsYWJlbCB0aGV5IGludmVudGVkKSBhbmQgZXhwZWN0cyB0aGUgbWFwIE5PVCB0byBqdW1wLiAqL1xuICAgIGNvbnN0IG9uU2l0ZU5hbWVDaGFuZ2UgPSAobmV3TmFtZSkgPT4ge1xuICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIHNpdGVOYW1lOm5ld05hbWV9KSk7XG4gICAgICAgIGNvbnN0IGhpdCA9IHNhdmVkTG9jcy5maW5kKHMgPT4gcy5uYW1lID09PSBuZXdOYW1lKTtcbiAgICAgICAgaWYgKGhpdCkge1xuICAgICAgICAgICAgY29uc3QgbGF0ID0gTWF0aC5yb3VuZChoaXQubGF0ICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgICAgICBjb25zdCBsb24gPSBNYXRoLnJvdW5kKGhpdC5sb24gKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgc2l0ZU5hbWU6bmV3TmFtZSwgbGF0LCBsb24sIGNpdHk6bmV3TmFtZX0pKTtcbiAgICAgICAgICAgIGlmIChtYXBSZWYuY3VycmVudCkgbWFwUmVmLmN1cnJlbnQuc2V0VmlldyhbbGF0LCBsb25dLCAxMSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IHBpY2tTYXZlZExvYyA9IChsb2MpID0+IHtcbiAgICAgICAgc2V0U2F2ZWRPcGVuKGZhbHNlKTtcbiAgICAgICAgb25TaXRlTmFtZUNoYW5nZShsb2MubmFtZSk7XG4gICAgfTtcblxuICAgIC8qIFJlbW92ZSBhIHNhdmVkIGxvY2F0aW9uIGZyb20gdGhlIGxpc3QuICBEZWR1cC1rZXllZCBieSBsYXQvbG9uIHNvIHR3b1xuICAgICAqIGVudHJpZXMgdGhhdCBzaGFyZSBhIG5hbWUgKGUuZy4gXCJIT01FXCIgYXQgdGhlIG9mZmljZSB2cyB0aGUgYXBhcnRtZW50KVxuICAgICAqIGFyZSBhZGRyZXNzZWQgaW5kaXZpZHVhbGx5IC0tIHJlbW92aW5nIG9uZSBrZWVwcyB0aGUgb3RoZXIuICBNaXJyb3JzXG4gICAgICogdGhlIGNoYW5nZSB0byBsb2NhbFN0b3JhZ2UgQU5EIHRoZSBzZXJ2ZXIgc28gdGhlIGRhc2hib2FyZCdzIFdlYXRoZXJcbiAgICAgKiBidXR0b24gc2VlcyB0aGUgZGVsZXRpb24gb24gaXRzIG5leHQgcmVhZC4gKi9cbiAgICBjb25zdCByZW1vdmVTYXZlZExvYyA9IChsb2MpID0+IHtcbiAgICAgICAgY29uc3Qga2V5ID0gbG9jLmxhdC50b0ZpeGVkKDQpICsgJywnICsgbG9jLmxvbi50b0ZpeGVkKDQpO1xuICAgICAgICBjb25zdCBuZXh0ID0gc2F2ZWRMb2NzLmZpbHRlcihzID0+IChzLmxhdC50b0ZpeGVkKDQpICsgJywnICsgcy5sb24udG9GaXhlZCg0KSkgIT09IGtleSk7XG4gICAgICAgIHNldFNhdmVkTG9jcyhuZXh0KTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzYXZlZFdlYXRoZXJMb2NhdGlvbnMnLCBKU09OLnN0cmluZ2lmeShuZXh0KSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogcHJpdmF0ZSBtb2RlICovIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncmVkNTp3ZWF0aGVyTG9jYXRpb25DaGFuZ2VkJyxcbiAgICAgICAgICAgICAgICB7IGRldGFpbDogeyBzYXZlZDogbmV4dCB9IH0pKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgICAgLyogQmVzdC1lZmZvcnQgc2VydmVyIHN5bmMuICBBbm9ueW1vdXMgdXNlcnMgZ2V0IHBlcnNpc3RlZDpmYWxzZSBiYWNrLFxuICAgICAgICAgKiB3aGljaCBpcyBmaW5lIC0tIHRoZSBsb2NhbCBjb3B5IGFscmVhZHkgcmVmbGVjdHMgdGhlIHJlbW92YWwuICovXG4gICAgICAgIGZldGNoKCcvYXBpL3dlYXRoZXItbG9jYXRpb24nLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXG4gICAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOidhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBzYXZlZDogbmV4dCB9KSxcbiAgICAgICAgfSkuY2F0Y2goKCkgPT4geyAvKiBvZmZsaW5lIC0tIGxvY2FsU3RvcmFnZSBhbHJlYWR5IHVwZGF0ZWQgKi8gfSk7XG4gICAgICAgIC8qIElmIHRoZSBvcGVyYXRvciBqdXN0IGRlbGV0ZWQgdGhlIGVudHJ5IGN1cnJlbnRseSBpbiB0aGUgaW5wdXQsXG4gICAgICAgICAqIGJsYW5rIHRoZSBpbnB1dCBzbyBhIHN0YWxlIHNlbGVjdGlvbiBpc24ndCBhY2NpZGVudGFsbHkgc2F2ZWQuICovXG4gICAgICAgIGlmICgoY2ZnLnNpdGVOYW1lIHx8ICcnKS50cmltKCkgPT09IGxvYy5uYW1lKSB7XG4gICAgICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIHNpdGVOYW1lOicnfSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuZXh0Lmxlbmd0aCA9PT0gMCkgc2V0U2F2ZWRPcGVuKGZhbHNlKTtcbiAgICB9O1xuXG4gICAgLyogSW5saW5lIHJlbmFtZTogdHlwaW5nIGludG8gYSByb3cncyBuYW1lIGlucHV0IHVwZGF0ZXMgdGhlIGluLW1lbW9yeVxuICAgICAqIGBzYXZlZExvY3NgIGxpc3QgKE5PVCBwZXJzaXN0ZWQgdW50aWwgXCJTYXZlICYgUmV0dXJuXCIpLiAgS2V5ZWQgYnkgdGhlXG4gICAgICogcm93J3MgbGF0L2xvbiBzbyB0d28gc2FtZS1uYW1lZCBlbnRyaWVzIGF0IGRpZmZlcmVudCBjb29yZGluYXRlcyBjYW5cbiAgICAgKiBiZSByZW5hbWVkIGluZGVwZW5kZW50bHkuICBUcmltIGlzIGRlbGF5ZWQgdW50aWwgcGVyc2lzdCBzbyB0aGVcbiAgICAgKiBvcGVyYXRvciBjYW4ga2VlcCB0eXBpbmcgd2l0aG91dCB0aGUgZmllbGQgXCJzbmFwcGluZ1wiIG1pZC1lZGl0LiAqL1xuICAgIGNvbnN0IHJlbmFtZVNhdmVkTG9jID0gKG9yaWdMb2MsIG5ld05hbWUpID0+IHtcbiAgICAgICAgY29uc3Qga2V5ID0gb3JpZ0xvYy5sYXQudG9GaXhlZCg0KSArICcsJyArIG9yaWdMb2MubG9uLnRvRml4ZWQoNCk7XG4gICAgICAgIHNldFNhdmVkTG9jcyhwcmV2ID0+IHByZXYubWFwKHMgPT5cbiAgICAgICAgICAgIChzLmxhdC50b0ZpeGVkKDQpICsgJywnICsgcy5sb24udG9GaXhlZCg0KSkgPT09IGtleVxuICAgICAgICAgICAgICAgID8geyAuLi5zLCBuYW1lOiBuZXdOYW1lIH1cbiAgICAgICAgICAgICAgICA6IHNcbiAgICAgICAgKSk7XG4gICAgICAgIC8qIElmIHRoZSBvcGVyYXRvciBpcyByZW5hbWluZyB0aGUgZW50cnkgdGhhdCBpcyBjdXJyZW50bHkgdGhlXG4gICAgICAgICAqIFwiYWN0aXZlXCIgcGljayAoc2l0ZU5hbWUgbWF0Y2hlcyksIGtlZXAgdGhlIHBpY2tlciBpbiBzeW5jLiAqL1xuICAgICAgICBjb25zdCBzdGlsbFNlbGVjdGVkID0gKGNmZy5zaXRlTmFtZSB8fCAnJykudHJpbSgpID09PSBvcmlnTG9jLm5hbWVcbiAgICAgICAgICAgICYmIE1hdGguYWJzKGNmZy5sYXQgLSBvcmlnTG9jLmxhdCkgPCAxZS00XG4gICAgICAgICAgICAmJiBNYXRoLmFicyhjZmcubG9uIC0gb3JpZ0xvYy5sb24pIDwgMWUtNDtcbiAgICAgICAgaWYgKHN0aWxsU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgc2l0ZU5hbWU6bmV3TmFtZSwgY2l0eTpuZXdOYW1lfSkpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qIC0tLS0tIHNlYXJjaCBzdGF0ZSAtLS0tLSAqL1xuICAgIGNvbnN0IFtzZWFyY2hRLCBzZXRTZWFyY2hRXSAgICAgICAgID0gUmVhY3QudXNlU3RhdGUoJycpO1xuICAgIGNvbnN0IFtzZWFyY2hIaXRzLCBzZXRTZWFyY2hIaXRzXSAgID0gUmVhY3QudXNlU3RhdGUoW10pO1xuICAgIGNvbnN0IFtzZWFyY2hCdXN5LCBzZXRTZWFyY2hCdXN5XSAgID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IFtzZWFyY2hPcGVuLCBzZXRTZWFyY2hPcGVuXSAgID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IHNlYXJjaERlYm91bmNlUmVmICAgICAgICAgICAgID0gUmVhY3QudXNlUmVmKG51bGwpO1xuXG4gICAgLyogRm9yd2FyZC1nZW9jb2RlOiBxdWVyeSAtPiBbe2xhdCwgbG9uLCBkaXNwbGF5X25hbWUsIHR5cGUsIC4uLn1dICovXG4gICAgY29uc3QgcnVuU2VhcmNoID0gYXN5bmMgKHEpID0+IHtcbiAgICAgICAgaWYgKCFxIHx8IHEudHJpbSgpLmxlbmd0aCA8IDMpIHsgc2V0U2VhcmNoSGl0cyhbXSk7IHJldHVybjsgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2V0U2VhcmNoQnVzeSh0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGBodHRwczovL25vbWluYXRpbS5vcGVuc3RyZWV0bWFwLm9yZy9zZWFyY2g/Zm9ybWF0PWpzb24mbGltaXQ9NiZxPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHEpfWA7XG4gICAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7IGhlYWRlcnM6eyAnQWNjZXB0JzonYXBwbGljYXRpb24vanNvbicgfSB9KTtcbiAgICAgICAgICAgIGNvbnN0IGogPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgICAgIHNldFNlYXJjaEhpdHMoQXJyYXkuaXNBcnJheShqKSA/IGogOiBbXSk7XG4gICAgICAgICAgICBzZXRTZWFyY2hPcGVuKHRydWUpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IHNldFNlYXJjaEhpdHMoW10pOyB9XG4gICAgICAgIGZpbmFsbHkgeyBzZXRTZWFyY2hCdXN5KGZhbHNlKTsgfVxuICAgIH07XG5cbiAgICAvKiBkZWJvdW5jZWQgc2VhcmNoLW9uLXR5cGUgKi9cbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoc2VhcmNoRGVib3VuY2VSZWYuY3VycmVudCkgY2xlYXJUaW1lb3V0KHNlYXJjaERlYm91bmNlUmVmLmN1cnJlbnQpO1xuICAgICAgICBzZWFyY2hEZWJvdW5jZVJlZi5jdXJyZW50ID0gc2V0VGltZW91dCgoKSA9PiBydW5TZWFyY2goc2VhcmNoUSksIDQwMCk7XG4gICAgICAgIHJldHVybiAoKSA9PiBzZWFyY2hEZWJvdW5jZVJlZi5jdXJyZW50ICYmIGNsZWFyVGltZW91dChzZWFyY2hEZWJvdW5jZVJlZi5jdXJyZW50KTtcbiAgICB9LCBbc2VhcmNoUV0pO1xuXG4gICAgY29uc3QgcGlja1NlYXJjaEhpdCA9IChoaXQpID0+IHtcbiAgICAgICAgY29uc3QgbGF0ID0gTWF0aC5yb3VuZCgraGl0LmxhdCAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICBjb25zdCBsb24gPSBNYXRoLnJvdW5kKCtoaXQubG9uICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgbGF0LCBsb24sIGNpdHk6aGl0LmRpc3BsYXlfbmFtZX0pKTtcbiAgICAgICAgaWYgKG1hcFJlZi5jdXJyZW50KSBtYXBSZWYuY3VycmVudC5zZXRWaWV3KFtsYXQsIGxvbl0sIGhpdC50eXBlID09PSAnY2l0eScgPyAxMSA6IDE1KTtcbiAgICAgICAgc2V0U2VhcmNoT3BlbihmYWxzZSk7XG4gICAgICAgIHNldFNlYXJjaFEoJycpO1xuICAgIH07XG5cbiAgICAvKiBSZXZlcnNlLWdlb2NvZGUgbGF0L2xvbiAtPiBjaXR5IC8gY291bnRyeSB2aWEgTm9taW5hdGltLiAgTm8gQVBJIGtleS4gKi9cbiAgICBjb25zdCByZXZlcnNlR2VvY29kZSA9IGFzeW5jIChsYXQsIGxvbikgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2V0R2VvQnVzeSh0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGBodHRwczovL25vbWluYXRpbS5vcGVuc3RyZWV0bWFwLm9yZy9yZXZlcnNlP2Zvcm1hdD1qc29uJmxhdD0ke2xhdH0mbG9uPSR7bG9ufSZ6b29tPTEwYDtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCh1cmwsIHsgaGVhZGVyczogeyAnQWNjZXB0JzonYXBwbGljYXRpb24vanNvbicgfSB9KTtcbiAgICAgICAgICAgIGNvbnN0IGogPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgICAgIGNvbnN0IGEgPSBqLmFkZHJlc3MgfHwge307XG4gICAgICAgICAgICBjb25zdCBjaXR5ID0gYS5jaXR5IHx8IGEudG93biB8fCBhLnZpbGxhZ2UgfHwgYS5oYW1sZXQgfHwgYS5jb3VudHkgfHwgJyc7XG4gICAgICAgICAgICBjb25zdCByZWdpb24gPSBhLnN0YXRlIHx8IGEucmVnaW9uIHx8ICcnO1xuICAgICAgICAgICAgY29uc3QgY291bnRyeSA9IGEuY291bnRyeSB8fCAnJztcbiAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gW2NpdHksIHJlZ2lvbiwgY291bnRyeV0uZmlsdGVyKEJvb2xlYW4pLmpvaW4oJywgJykgfHwgai5kaXNwbGF5X25hbWUgfHwgJyc7XG4gICAgICAgICAgICBpZiAobGFiZWwpIHNldENmZyhjID0+ICh7Li4uYywgY2l0eTpsYWJlbH0pKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBvZmZsaW5lIG9yIHJhdGUtbGltaXRlZCAtPiBrZWVwIHByaW9yIG5hbWUgKi8gfVxuICAgICAgICBmaW5hbGx5IHsgc2V0R2VvQnVzeShmYWxzZSk7IH1cbiAgICB9O1xuXG4gICAgLyogSW5pdCBMZWFmbGV0IG9uIGZpcnN0IHJlbmRlciBvZiB0aGUgbW9kYWwgKi9cbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoIW1hcEJveFJlZi5jdXJyZW50IHx8IG1hcFJlZi5jdXJyZW50KSByZXR1cm47XG4gICAgICAgIGNvbnN0IG1hcCA9IEwubWFwKG1hcEJveFJlZi5jdXJyZW50LCB7IHpvb21Db250cm9sOiB0cnVlLCBhdHRyaWJ1dGlvbkNvbnRyb2w6IHRydWUgfSlcbiAgICAgICAgICAgICAgICAgICAgIC5zZXRWaWV3KFtjZmcubGF0LCBjZmcubG9uXSwgNik7XG4gICAgICAgIEwudGlsZUxheWVyKCdodHRwczovL3tzfS50aWxlLm9wZW5zdHJlZXRtYXAub3JnL3t6fS97eH0ve3l9LnBuZycsIHtcbiAgICAgICAgICAgIG1heFpvb206IDE4LFxuICAgICAgICAgICAgYXR0cmlidXRpb246ICcmY29weTsgT3BlblN0cmVldE1hcCBjb250cmlidXRvcnMnLFxuICAgICAgICB9KS5hZGRUbyhtYXApO1xuXG4gICAgICAgIGNvbnN0IG1hcmtlciA9IEwubWFya2VyKFtjZmcubGF0LCBjZmcubG9uXSwgeyBkcmFnZ2FibGU6IHRydWUgfSkuYWRkVG8obWFwKTtcbiAgICAgICAgbWFya2VyLmJpbmRUb29sdGlwKCdEcmFnIG1lIG9yIGNsaWNrIGFueXdoZXJlIG9uIHRoZSBtYXAnLCB7IHBlcm1hbmVudDogZmFsc2UgfSk7XG5cbiAgICAgICAgY29uc3QgYXBwbHlMYXRMb24gPSAobGF0LCBsb24pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHIgPSAobikgPT4gTWF0aC5yb3VuZChuICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIGxhdDpyKGxhdCksIGxvbjpyKGxvbil9KSk7XG4gICAgICAgICAgICByZXZlcnNlR2VvY29kZShyKGxhdCksIHIobG9uKSk7XG4gICAgICAgIH07XG4gICAgICAgIG1hcmtlci5vbignZHJhZ2VuZCcsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxsID0gbWFya2VyLmdldExhdExuZygpO1xuICAgICAgICAgICAgYXBwbHlMYXRMb24obGwubGF0LCBsbC5sbmcpO1xuICAgICAgICB9KTtcbiAgICAgICAgbWFwLm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICBtYXJrZXIuc2V0TGF0TG5nKGUubGF0bG5nKTtcbiAgICAgICAgICAgIGFwcGx5TGF0TG9uKGUubGF0bG5nLmxhdCwgZS5sYXRsbmcubG5nKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbWFwUmVmLmN1cnJlbnQgPSBtYXA7XG4gICAgICAgIG1hcmtlclJlZi5jdXJyZW50ID0gbWFya2VyO1xuXG4gICAgICAgIC8qIExlYWZsZXQgcmVuZGVycyBibGFuayBpZiBpdCBib290cyBpbnNpZGUgYSBoaWRkZW4gZWxlbWVudCDigJQga2ljayBpdFxuICAgICAgICAgICBvbmNlIHRoZSBtb2RhbCBhbmltYXRpb24gc2V0dGxlcy4gKi9cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiBtYXAuaW52YWxpZGF0ZVNpemUoKSwgMjUwKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHsgbWFwLnJlbW92ZSgpOyBtYXBSZWYuY3VycmVudCA9IG51bGw7IG1hcmtlclJlZi5jdXJyZW50ID0gbnVsbDsgfTtcbiAgICB9LCBbXSk7XG5cbiAgICAvKiBLZWVwIG1hcmtlciBpbiBzeW5jIHdoZW4gdXNlciBlZGl0cyBsYXQvbG9uIGZpZWxkcyBtYW51YWxseSAqL1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmIChtYXBSZWYuY3VycmVudCAmJiBtYXJrZXJSZWYuY3VycmVudCkge1xuICAgICAgICAgICAgbWFya2VyUmVmLmN1cnJlbnQuc2V0TGF0TG5nKFtjZmcubGF0LCBjZmcubG9uXSk7XG4gICAgICAgICAgICBtYXBSZWYuY3VycmVudC5wYW5UbyhbY2ZnLmxhdCwgY2ZnLmxvbl0pO1xuICAgICAgICB9XG4gICAgfSwgW2NmZy5sYXQsIGNmZy5sb25dKTtcblxuICAgIC8qIEdlb2xvY2F0aW9uOiBzaWxlbnRseSBuby1vcCdkIGJlZm9yZSAtLSBpZiB0aGUgYnJvd3NlciBibG9ja2VkIHRoZVxuICAgICAqIHJlcXVlc3QgKEhUVFAgb3JpZ2luID0gbm90IGEgc2VjdXJlIGNvbnRleHQgb24gZmllbGQgY29udHJvbGxlcnMsIG9yXG4gICAgICogdGhlIHVzZXIgZGVuaWVkIHBlcm1pc3Npb24gZWFybGllcikgdGhlIGJ1dHRvbiBqdXN0IHNhdCB0aGVyZS5cbiAgICAgKiBOb3cgd2Ugc3VyZmFjZSBhIHN0YXRlIChidXN5IC8gZXJyKSBzbyB0aGUgb3BlcmF0b3IgY2FuIHNlZSBXSFkgaXRcbiAgICAgKiBmYWlsZWQgYW5kIGFjdCBvbiBpdCAoc3dpdGNoIHRvIEhUVFBTLCByZS1wcm9tcHQsIG9yIHVzZSB0aGUgbWFwKS4gKi9cbiAgICBjb25zdCBbZ2VvU3RhdGUsIHNldEdlb1N0YXRlXSA9IFJlYWN0LnVzZVN0YXRlKG51bGwpOyAgIC8vIG51bGwgfCAnYnVzeScgfCB7ZXJyfVxuICAgIGNvbnN0IHVzZU15TG9jYXRpb24gPSAoKSA9PiB7XG4gICAgICAgIHNldEdlb1N0YXRlKCdidXN5Jyk7XG4gICAgICAgIC8vIG5hdmlnYXRvci5nZW9sb2NhdGlvbiBpcyBgdW5kZWZpbmVkYCBvbiBIVFRQIG9yaWdpbnMgKENocm9tZSA1MCspLlxuICAgICAgICBpZiAoIW5hdmlnYXRvci5nZW9sb2NhdGlvbikge1xuICAgICAgICAgICAgc2V0R2VvU3RhdGUoeyBlcnI6J0Jyb3dzZXIgYmxvY2tlZCBsb2NhdGlvbiBhY2Nlc3Mg4oCUIG9wZW4gdGhpcyBwYWdlIHZpYSBIVFRQUy4nIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oXG4gICAgICAgICAgICAocG9zKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGF0ID0gTWF0aC5yb3VuZChwb3MuY29vcmRzLmxhdGl0dWRlICAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxvbiA9IE1hdGgucm91bmQocG9zLmNvb3Jkcy5sb25naXR1ZGUgKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIGxhdCwgbG9ufSkpO1xuICAgICAgICAgICAgICAgIGlmIChtYXBSZWYuY3VycmVudCkgbWFwUmVmLmN1cnJlbnQuc2V0VmlldyhbbGF0LCBsb25dLCAxMSk7XG4gICAgICAgICAgICAgICAgcmV2ZXJzZUdlb2NvZGUobGF0LCBsb24pO1xuICAgICAgICAgICAgICAgIHNldEdlb1N0YXRlKG51bGwpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBlcnIuY29kZTogMT1QRVJNSVNTSU9OX0RFTklFRCwgMj1QT1NJVElPTl9VTkFWQUlMQUJMRSwgMz1USU1FT1VUXG4gICAgICAgICAgICAgICAgY29uc3QgbXNnID0gZXJyICYmIGVyci5jb2RlID09PSAxXG4gICAgICAgICAgICAgICAgICAgID8gJ0xvY2F0aW9uIHBlcm1pc3Npb24gZGVuaWVkIOKAlCBjbGljayB0aGUgbG9jayBpY29uIGluIHRoZSBhZGRyZXNzIGJhciBhbmQgYWxsb3cgbG9jYXRpb24uJ1xuICAgICAgICAgICAgICAgICAgICA6IGVyciAmJiBlcnIuY29kZSA9PT0gMlxuICAgICAgICAgICAgICAgICAgICAgICAgPyAnTG9jYXRpb24gY3VycmVudGx5IHVuYXZhaWxhYmxlIOKAlCB0aGUgZGV2aWNlIGhhcyBubyBHUFMgLyBXaS1GaSBmaXggeWV0LidcbiAgICAgICAgICAgICAgICAgICAgICAgIDogZXJyICYmIGVyci5jb2RlID09PSAzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnTG9jYXRpb24gcmVxdWVzdCB0aW1lZCBvdXQg4oCUIHRyeSBhZ2Fpbiwgb3IgdXNlIHRoZSBtYXAgLyBzZWFyY2ggYmFyLidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IChlcnIgJiYgZXJyLm1lc3NhZ2UpIHx8ICdDb3VsZCBub3QgcmVhZCBkZXZpY2UgbG9jYXRpb24uJztcbiAgICAgICAgICAgICAgICBzZXRHZW9TdGF0ZSh7IGVycjogbXNnIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgZW5hYmxlSGlnaEFjY3VyYWN5OnRydWUsIHRpbWVvdXQ6MTAwMDAsIG1heGltdW1BZ2U6MCB9XG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIC8qIFdoZW4gdXNlciBjbGlja3MgXCJTYXZlICYgcmV0dXJuXCIsIG1pcnJvciBFWEFDVExZIHdoYXQgdGhlIGRhc2hib2FyZCdzXG4gICAgICogV2VhdGhlciBidXR0b24gZG9lcyBpbiB3ZWF0aGVyLXNldHRpbmdzLW1vZGFsLmpzI3NlbGVjdExvY2F0aW9uOlxuICAgICAqICAgMS4gbG9jYWxTdG9yYWdlWyd3ZWF0aGVyTG9jYXRpb24nXSAgICAgICAgPSBjaG9zZW4gbG9jIChjYW5vbmljYWwga2V5XG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGRhc2hib2FyZCByZWFkcyBvblxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vdW50LCBOT1QgJ3JlZDUud2VhdGhlcl9sb2NhdGlvbicpLlxuICAgICAqICAgMi4gbG9jYWxTdG9yYWdlWydzYXZlZFdlYXRoZXJMb2NhdGlvbnMnXSAgPSBbbG9jLCAuLi5vdGhlcnNdIGRlZHVwZWRcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBieSBsYXQvbG9uLCBjYXBwZWQgYXQgMjAuXG4gICAgICogICAzLiBQT1NUIC9hcGkvd2VhdGhlci1sb2NhdGlvbiB3aXRoIGFjdGl2ZStkZWZhdWx0K3NhdmVkIHNvIHRoZSBzYW1lXG4gICAgICogICAgICBsaXN0IHN1cnZpdmVzIGNyb3NzLWRldmljZSBzZXNzaW9ucyBmb3Igc2lnbmVkLWluIHRlbmFudHMuXG4gICAgICpcbiAgICAgKiBXaXRob3V0IHN0ZXAgMSB0aGUgZGFzaGJvYXJkJ3MgYHdlYXRoZXJMb2NhdGlvbmAgc3RhdGUgc2lsZW50bHkga2VlcHNcbiAgICAgKiBpdHMgb2xkIHZhbHVlIC0tIHdoaWNoIGlzIGV4YWN0bHkgdGhlIGJ1ZyBvcGVyYXRvcnMgcmVwb3J0ZWQgYWZ0ZXJcbiAgICAgKiBwaWNraW5nIGEgbG9jYXRpb24gaW4gU2V0dXAgV2FsayBhbmQgc2VlaW5nIHRoZSBkYXNoYm9hcmQncyB3ZWF0aGVyXG4gICAgICogc3RyaXAgcmVmdXNlIHRvIHVwZGF0ZS4gKi9cbiAgICBjb25zdCBbc2F2ZU1zZywgc2V0U2F2ZU1zZ10gPSBSZWFjdC51c2VTdGF0ZShudWxsKTtcbiAgICBjb25zdCBwZXJzaXN0QW5kU2F2ZSA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgbG9jID0geyBsYXQ6IGNmZy5sYXQsIGxvbjogY2ZnLmxvbiwgbmFtZTogY2ZnLnNpdGVOYW1lIHx8IGNmZy5jaXR5IH07XG5cbiAgICAgICAgLy8gRGUtZHVwIHRoZSBleGlzdGluZyBzYXZlZCBsaXN0IGJ5IGxhdC9sb24gKHNhbWUga2V5IHRoZSBkYXNoYm9hcmRcbiAgICAgICAgLy8gdXNlcykgYW5kIHB1dCB0aGUgbmV3IHBpY2sgYXQgdGhlIHRvcC4gIENhcCBhdCAyMCB0byBtYXRjaCB0aGVcbiAgICAgICAgLy8gZGFzaGJvYXJkJ3MgYmVoYXZpb3VyLlxuICAgICAgICBjb25zdCBrZXkgPSBsb2MubGF0LnRvRml4ZWQoNCkgKyAnLCcgKyBsb2MubG9uLnRvRml4ZWQoNCk7XG4gICAgICAgIGNvbnN0IGRlZHVwZWQgPSBzYXZlZExvY3MuZmlsdGVyKGwgPT4gKGwubGF0LnRvRml4ZWQoNCkgKyAnLCcgKyBsLmxvbi50b0ZpeGVkKDQpKSAhPT0ga2V5KTtcbiAgICAgICAgY29uc3QgbmV4dFNhdmVkID0gW2xvYywgLi4uZGVkdXBlZF0uc2xpY2UoMCwgMjApO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnd2VhdGhlckxvY2F0aW9uJywgSlNPTi5zdHJpbmdpZnkobG9jKSk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc2F2ZWRXZWF0aGVyTG9jYXRpb25zJywgSlNPTi5zdHJpbmdpZnkobmV4dFNhdmVkKSk7XG4gICAgICAgICAgICAvLyBLZWVwIHRoZSBvbGQga2V5IHRvbyAtLSBzb21lIGxlZ2FjeSBwbHVnLWlucyBzdGlsbCBsb29rIGF0IGl0LlxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDUud2VhdGhlcl9sb2NhdGlvbicsIEpTT04uc3RyaW5naWZ5KGxvYykpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IC8qIHByaXZhdGUgbW9kZSAtLSBpZ25vcmUgKi8gfVxuXG4gICAgICAgIGxldCBwZXJzaXN0ZWQgPSBmYWxzZSwgd2FybmluZyA9ICcnO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKCcvYXBpL3dlYXRoZXItbG9jYXRpb24nLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOidhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgYWN0aXZlOiBsb2MsIGRlZmF1bHQ6IGxvYywgc2F2ZWQ6IG5leHRTYXZlZCB9KSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgaiA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgICAgICAgd2luZG93Ll9sYXN0V2VhdGhlckxvY2F0aW9uU2F2ZSA9IGo7XG4gICAgICAgICAgICBwZXJzaXN0ZWQgPSAhIWoucGVyc2lzdGVkO1xuICAgICAgICAgICAgd2FybmluZyAgID0gai53YXJuaW5nIHx8ICcnO1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdbc2V0dXAgd2Fsa10gL2FwaS93ZWF0aGVyLWxvY2F0aW9uIDwtJywgaik7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHdhcm5pbmcgPSAnTmV0d29yayBlcnJvciDigJQgc2F2ZWQgbG9jYWxseSBvbmx5Lic7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1tzZXR1cCB3YWxrXSBjb3VsZCBub3QgcGVyc2lzdCBsb2NhdGlvbjonLCBlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRlbGwgYW55IG9wZW4gZGFzaGJvYXJkIHRhYiB0byByZS1oeWRyYXRlLiAgVGhlIGRhc2hib2FyZFxuICAgICAgICAvLyBhbHJlYWR5IGxpc3RlbnMgZm9yIGBzdG9yYWdlYCBldmVudHMgd2hlbiBhbm90aGVyIHRhYiB3cml0ZXMgdG9cbiAgICAgICAgLy8gbG9jYWxTdG9yYWdlLCBidXQgb24gVjEuOSBzb21lIGJyb3dzZXJzIERPTidUIGZpcmUgYHN0b3JhZ2VgIGZvclxuICAgICAgICAvLyBzYW1lLW9yaWdpbiB3cml0ZXMgZnJvbSB0aGlzIHNhbWUgdGFiLiAgQW4gZXhwbGljaXQgY3VzdG9tIGV2ZW50XG4gICAgICAgIC8vIG1ha2VzIHRoZSBkYXNoYm9hcmQncyBwb2xsaW5nIHBpY2sgdGhlIGNoYW5nZSB1cCBpbW1lZGlhdGVseSBpZlxuICAgICAgICAvLyBpdCdzIGFscmVhZHkgbW91bnRlZCBpbiBhbm90aGVyIHRhYi93aW5kb3cuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3JlZDU6d2VhdGhlckxvY2F0aW9uQ2hhbmdlZCcsXG4gICAgICAgICAgICAgICAgeyBkZXRhaWw6IHsgYWN0aXZlOiBsb2MsIHNhdmVkOiBuZXh0U2F2ZWQgfSB9KSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogSUUtbGVzcyBlbnZpcm9ubWVudHMgLS0gbm8tb3AgKi8gfVxuXG4gICAgICAgIGlmIChwZXJzaXN0ZWQpIHtcbiAgICAgICAgICAgIG9uU2F2ZSgpOyAgICAgICAgICAgLy8gaGFwcHkgcGF0aDogY2xvc2UgKyBtYXJrIHN0ZXAgZG9uZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLyogU3VyZmFjZSB0aGUgd2FybmluZywgaG9sZCB0aGUgbW9kYWwgb3BlbiBmb3IgMS42cyBzbyB0aGVcbiAgICAgICAgICAgICAqIG9wZXJhdG9yIHJlYWRzIGl0LCB0aGVuIGNsb3NlLiAgVGhlIGxvY2FsIGNvcHkgaXMgYWxyZWFkeVxuICAgICAgICAgICAgICogd3JpdHRlbiwgc28gdGhlIGRhc2hib2FyZCB3aWxsIHN0aWxsIHNlZSB0aGUgbmV3IGxvY2F0aW9uXG4gICAgICAgICAgICAgKiBpbiB0aGlzIGJyb3dzZXIgc2Vzc2lvbi4gKi9cbiAgICAgICAgICAgIHNldFNhdmVNc2cod2FybmluZyB8fCAnU2F2ZWQgbG9jYWxseSBvbmx5IOKAlCBzaWduIGluIHRvIHNhdmUgc2VydmVyLXNpZGUuJyk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgc2V0U2F2ZU1zZyhudWxsKTsgb25TYXZlKCk7IH0sIDE2MDApO1xuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPE1vZGFsU2hlbGwgdGl0bGU9XCJMb2NhdGlvbiBTZXR0aW5nXCIgc3VidGl0bGU9XCJDbGljayB0aGUgbWFwLCBkcmFnIHRoZSBwaW4sIG9yIHVzZSB5b3VyIGRldmljZVwiIGFjY2VudD1cImFtYmVyXCIgb25DbG9zZT17b25DbG9zZX0gb25TYXZlPXtwZXJzaXN0QW5kU2F2ZX0gc2l6ZT1cIm1heFwiPlxuICAgICAgICAgICAge3NhdmVNc2cgJiYgKFxuICAgICAgICAgICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJsb2Mtc2F2ZS1tc2dcIlxuICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibWItMyBweC00IHB5LTIuNSByb3VuZGVkLWxnIGJnLWFtYmVyLTkwMC8zMCBib3JkZXIgYm9yZGVyLWFtYmVyLTcwMC81MCB0ZXh0LWFtYmVyLTIwMCB0ZXh0LXhzIGZvbnQtbW9ub1wiPlxuICAgICAgICAgICAgICAgICAgICDimqAgIHtzYXZlTXNnfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBsZzpncmlkLWNvbHMtWzFmcl8zNDBweF0gZ2FwLTQgaC1mdWxsXCIgc3R5bGU9e3ttaW5IZWlnaHQ6JzU2dmgnfX0+XG4gICAgICAgICAgICAgICAgey8qIE1BUCDigJQgZmlsbHMgdGhlIGxlZnQgc2lkZSwgd2l0aCBhIHNlYXJjaCBiYXIgZmxvYXRpbmcgb24gdG9wICovfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmVcIiBzdHlsZT17e21pbkhlaWdodDonNTZ2aCd9fT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiByZWY9e21hcEJveFJlZn1cbiAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBoZWlnaHQ6JzEwMCUnLCBtaW5IZWlnaHQ6JzU2dmgnLCB3aWR0aDonMTAwJScsIGJvcmRlclJhZGl1czonMTJweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6J2hpZGRlbicsIGJvcmRlcjonMXB4IHNvbGlkICMzMzQxNTUnLCBiYWNrZ3JvdW5kOicjMGIxMjIwJyB9fS8+XG5cbiAgICAgICAgICAgICAgICAgICAgey8qIFNlYXJjaCBiYXIgb3ZlcmxheSDigJQgc2l0cyBpbiB0aGUgdG9wLWNlbnRyZSBvZiB0aGUgbWFwICovfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC0zIGxlZnQtMS8yIC10cmFuc2xhdGUteC0xLzIgei1bNTAwXVwiIHN0eWxlPXt7d2lkdGg6J21pbig1NjBweCwgY2FsYygxMDAlIC0gMTEwcHgpKSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17c2VhcmNoUX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRTZWFyY2hRKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Gb2N1cz17KCkgPT4gc2VhcmNoSGl0cy5sZW5ndGggJiYgc2V0U2VhcmNoT3Blbih0cnVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCLwn5SOICBTZWFyY2ggYnkgYWRkcmVzcywgYnVpbGRpbmcsIG9yIHBsYWNlIG5hbWXigKZcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgcHgtNCBweS0yLjUgcm91bmRlZC14bCBiZy1zbGF0ZS05MDAvOTUgYm9yZGVyIGJvcmRlci1zbGF0ZS02MDAgdGV4dC1zbGF0ZS0xMDAgdGV4dC1zbSBwbGFjZWhvbGRlci1zbGF0ZS01MDAgc2hhZG93LTJ4bCBiYWNrZHJvcC1ibHVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tvdXRsaW5lOidub25lJ319Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VhcmNoQnVzeSAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImFic29sdXRlIHJpZ2h0LTMgdG9wLTEvMiAtdHJhbnNsYXRlLXktMS8yIHRleHQtYW1iZXItNDAwIHRleHQteHNcIj7igKY8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VhcmNoT3BlbiAmJiBzZWFyY2hIaXRzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC1mdWxsIGxlZnQtMCByaWdodC0wIG10LTEgYmctc2xhdGUtOTAwLzk3IGJvcmRlciBib3JkZXItc2xhdGUtNzAwIHJvdW5kZWQteGwgc2hhZG93LTJ4bCBvdmVyZmxvdy1oaWRkZW4gbWF4LWgtNzIgb3ZlcmZsb3cteS1hdXRvIGJhY2tkcm9wLWJsdXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWFyY2hIaXRzLm1hcCgoaCwgaSkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PXtoLnBsYWNlX2lkIHx8IGl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBwaWNrU2VhcmNoSGl0KGgpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHRleHQtbGVmdCBweC00IHB5LTIuNSBob3ZlcjpiZy1hbWJlci05MDAvMzAgYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTgwMCBsYXN0OmJvcmRlci1iLTAgdHJhbnNpdGlvbi1hbGxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIHRleHQtc2xhdGUtMjAwIHRydW5jYXRlXCI+e2guZGlzcGxheV9uYW1lfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgbXQtMC41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7aC50eXBlIHx8IGguY2xhc3N9IMK3IHsoK2gubGF0KS50b0ZpeGVkKDMpfSwgeygraC5sb24pLnRvRml4ZWQoMyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlYXJjaE9wZW4gJiYgc2VhcmNoSGl0cy5sZW5ndGggPT09IDAgJiYgc2VhcmNoUS5sZW5ndGggPj0gMyAmJiAhc2VhcmNoQnVzeSAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgdG9wLWZ1bGwgbGVmdC0wIHJpZ2h0LTAgbXQtMSBiZy1zbGF0ZS05MDAvOTcgYm9yZGVyIGJvcmRlci1zbGF0ZS03MDAgcm91bmRlZC14bCBweC00IHB5LTMgdGV4dC14cyB0ZXh0LXNsYXRlLTQwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTm8gcmVzdWx0cyBmb3IgXCJ7c2VhcmNoUX1cIi4gIFRyeSBhIG1vcmUgc3BlY2lmaWMgdGVybS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgIHsvKiBTSURFIFBBTkVMICovfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS00IG92ZXJmbG93LXktYXV0byBwci0xXCI+XG4gICAgICAgICAgICAgICAgICAgIHsvKiBTaXRlIG5hbWUgY29tYm8taW5wdXQuICBGcmVlLWZvcm0gdHlwaW5nIGZvciBmcmVzaFxuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxzOyBhIHZpc2libGUgY2hldnJvbiBidXR0b24gb24gdGhlIHJpZ2h0IG9wZW5zXG4gICAgICAgICAgICAgICAgICAgICAgICBhIGN1c3RvbSBwb3Bkb3duIGxpc3RpbmcgZXZlcnkgc2F2ZWQgbG9jYXRpb24gcHVsbGVkXG4gICAgICAgICAgICAgICAgICAgICAgICBmcm9tIC9hcGkvd2VhdGhlci1sb2NhdGlvbiAoaS5lLiB0aGUgU0FNRSBsaXN0IHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgRGFzaGJvYXJkJ3MgV2VhdGhlciBidXR0b24gc3VyZmFjZXMpLiAgVGhpcyByZXBsYWNlc1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGVhcmxpZXIgbmF0aXZlIDxkYXRhbGlzdD4gd2hpY2ggd2FzIHRvbyBzdWJ0bGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGluIGRhcmsgdGhlbWVzIC0tIG9wZXJhdG9ycyB3aXRoIE4+MCBzYXZlZCBlbnRyaWVzXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VsZCBub3QgdGVsbCBhIGRyb3Bkb3duIGV4aXN0ZWQuICovfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0xLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTaXRlIG5hbWUgKHNhdmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzYXZlZExvY3MubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1sLTIgdGV4dC1hbWJlci00MDAvODAgbm9ybWFsLWNhc2UgdHJhY2tpbmctbm9ybWFsIHRleHQtWzEwcHhdXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJsb2Mtc2F2ZWQtaGludFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg4pa+IHtzYXZlZExvY3MubGVuZ3RofSBzYXZlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZVwiIHJlZj17c2F2ZWRSZWZ9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dCBwci05XCIgdmFsdWU9e2NmZy5zaXRlTmFtZSB8fCAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJsb2Mtc2l0ZS1uYW1lLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3NhdmVkTG9jcy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdQaWNrIGEgc2F2ZWQgbG9jYXRpb24sIG9yIHR5cGUgYSBuZXcgb25l4oCmJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnZS5nLiBIUSBUb3dlciwgTm9ydGggV2luZywgUGF2aWxpb24gQuKApid9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gb25TaXRlTmFtZUNoYW5nZShlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uRm9jdXM9eygpID0+IHNhdmVkTG9jcy5sZW5ndGggPiAwICYmIHNldFNhdmVkT3Blbih0cnVlKX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzYXZlZExvY3MubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJsb2Mtc2F2ZWQtY2hldnJvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0U2F2ZWRPcGVuKHYgPT4gIXYpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJPcGVuIHNhdmVkIGxvY2F0aW9uc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJQaWNrIGZyb20gc2F2ZWQgbG9jYXRpb25zXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSByaWdodC0xIHRvcC0xLzIgLXRyYW5zbGF0ZS15LTEvMiB3LTcgaC03IHJvdW5kZWQtbWQgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgYmctYW1iZXItNzAwLzMwIGhvdmVyOmJnLWFtYmVyLTYwMC81MCBib3JkZXIgYm9yZGVyLWFtYmVyLTUwMC80MCB0ZXh0LWFtYmVyLTIwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjE0XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjIuNFwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIiBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e3RyYW5zZm9ybTogc2F2ZWRPcGVuID8gJ3JvdGF0ZSgxODBkZWcpJyA6ICdub25lJywgdHJhbnNpdGlvbjondHJhbnNmb3JtIC4xNXMnfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlsaW5lIHBvaW50cz1cIjYgOSAxMiAxNSAxOCA5XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NhdmVkT3BlbiAmJiBzYXZlZExvY3MubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJsb2Mtc2F2ZWQtZHJvcGRvd25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIHotWzYwMF0gbGVmdC0wIHJpZ2h0LTAgdG9wLWZ1bGwgbXQtMSBiZy1zbGF0ZS05MDAgYm9yZGVyIGJvcmRlci1zbGF0ZS02MDAgcm91bmRlZC1sZyBzaGFkb3ctMnhsIG1heC1oLTY0IG92ZXJmbG93LXktYXV0b1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3NhdmVkTG9jcy5tYXAobG9jID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0FjdGl2ZSA9IChjZmcuc2l0ZU5hbWUgfHwgJycpLnRyaW0oKSA9PT0gbG9jLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgTWF0aC5hYnMoY2ZnLmxhdCAtIGxvYy5sYXQpIDwgMWUtNFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBNYXRoLmFicyhjZmcubG9uIC0gbG9jLmxvbikgPCAxZS00O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFJvdyBpcyBhIDxkaXYgcm9sZT1cImJ1dHRvblwiPiBpbnN0ZWFkIG9mIDxidXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc28gdGhlIGluLXJvdyB0cmFzaCA8YnV0dG9uPiBpc24ndCBuZXN0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNpZGUgYW5vdGhlciBpbnRlcmFjdGl2ZSBlbGVtZW50LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvd0tleSA9IGAke2xvYy5sYXQudG9GaXhlZCg0KX0sJHtsb2MubG9uLnRvRml4ZWQoNCl9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtyb3dLZXl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9sZT1cImJ1dHRvblwiIHRhYkluZGV4PXswfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFBpY2sgdGhlIHJvdyBvbmx5IHdoZW4gdGhlIG9wZXJhdG9yIGNsaWNrcyB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29vcmQvd2hpdGVzcGFjZSBhcmVhLCBub3QgdGhlIHJlbmFtZSBpbnB1dCBvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgdHJhc2ggYnV0dG9uICh0aG9zZSBzdG9wUHJvcGFnYXRpb24pLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWNrU2F2ZWRMb2MobG9jKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uS2V5RG93bj17KGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnICcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpY2tTYXZlZExvYyhsb2MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17YGxvYy1zYXZlZC1vcHQtJHtsb2MubmFtZX1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YGdyb3VwIGZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHB4LTMgcHktMiBib3JkZXItYiBib3JkZXItc2xhdGUtODAwIGxhc3Q6Ym9yZGVyLWItMCBob3ZlcjpiZy1hbWJlci05MDAvMzAgdHJhbnNpdGlvbi1jb2xvcnMgY3Vyc29yLXBvaW50ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7aXNBY3RpdmUgPyAnYmctYW1iZXItOTAwLzUwJyA6ICcnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTEgbWluLXctMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBJbmxpbmUgcmVuYW1lIGlucHV0IC0tIHR5cGluZyBoZXJlIHVwZGF0ZXMgdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluLW1lbW9yeSBzYXZlZExvY3MgZW50cnk7IGNsaWNraW5nIFNhdmUgJiBSZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVyc2lzdHMgdGhlIHdob2xlIGxpc3QgdG8gbG9jYWxTdG9yYWdlIEFORCB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmVyLiAgc3RvcFByb3BhZ2F0aW9uIGtlZXBzIGEgY2xpY2sgb24gdGhlIGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gdHJpZ2dlcmluZyB0aGUgcm93J3MgcGljayBoYW5kbGVyLiAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17YGxvYy1zYXZlZC1yZW5hbWUtJHtyb3dLZXl9YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2xvYy5uYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHJlbmFtZVNhdmVkTG9jKGxvYywgZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25LZXlEb3duPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRW50ZXIgd2hpbGUgZWRpdGluZyBrZWVwcyB0aGUgZHJvcGRvd25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW4gLS0gZmluYWxpc2luZyByZW5hbWUgaGFwcGVucyBhdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2F2ZSAmIFJldHVybiwgbm90IG9uIEVudGVyLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUua2V5ID09PSAnRW50ZXInKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2BSZW5hbWUgc2F2ZWQgbG9jYXRpb24gJHtsb2MubmFtZX1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYmctdHJhbnNwYXJlbnQgYm9yZGVyLTAgb3V0bGluZS1ub25lIHRleHQtc20gdGV4dC1zbGF0ZS0xMDAgZm9udC1tZWRpdW0gcHgtMCBweS0wXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9jdXM6Ymctc2xhdGUtODAwLzYwIGZvY3VzOnB4LTEgZm9jdXM6cm91bmRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvdmVyOmJnLXNsYXRlLTgwMC80MCBob3ZlcjpweC0xIGhvdmVyOnJvdW5kZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uLWFsbFwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIGZvbnQtbW9ubyBtdC0wLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2xvYy5sYXQudG9GaXhlZCgyKX0sIHtsb2MubG9uLnRvRml4ZWQoMil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBUcmFzaCBidXR0b24gLS0gYWx3YXlzIHJlbmRlcmVkLCBmYWRlZCB1bnRpbCByb3ctaG92ZXIgc28gaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2Vzbid0IGNsdXR0ZXIgdGhlIHJlc3Rpbmcgc3RhdGUuICBzdG9wUHJvcGFnYXRpb24gcHJldmVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgcm93J3MgcGljayBoYW5kbGVyIGZyb20gZmlyaW5nLiAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgbG9jLXNhdmVkLXJlbW92ZS0ke2xvYy5uYW1lfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2BSZW1vdmUgJHtsb2MubmFtZX1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT17YFJlbW92ZSAke2xvYy5uYW1lfSBmcm9tIHNhdmVkIGxvY2F0aW9uc2B9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHJlbW92ZVNhdmVkTG9jKGxvYyk7IH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInNocmluay0wIHctNyBoLTcgcm91bmRlZC1tZCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQtc2xhdGUtNTAwIGhvdmVyOnRleHQtcm9zZS0zMDAgaG92ZXI6Ymctcm9zZS05MDAvMzBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5LTQwIGdyb3VwLWhvdmVyOm9wYWNpdHktMTAwIHRyYW5zaXRpb24tb3BhY2l0eVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIxNFwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyLjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMyA2aDE4XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTggNlY0YTIgMiAwIDAgMSAyLTJoNGEyIDIgMCAwIDEgMiAydjJcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTkgNmwtMS41IDEzLjJhMiAyIDAgMCAxLTIgMS44SDguNWEyIDIgMCAwIDEtMi0xLjhMNSA2XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTEwIDExdjZNMTQgMTF2NlwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTEgaXRhbGljXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NhdmVkTG9jcy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ1BpY2sgYSBwcmV2aW91c2x5LXNhdmVkIGxvY2F0aW9uLCBvciB0eXBlIGEgbmV3IGxhYmVsIGZvciB0aGlzIHBsYWNlLidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnWW91ciBsYWJlbCBmb3IgdGhpcyBwbGFjZSDigJQgc2hvd24gb24gdGhlIGRhc2hib2FyZCBoZWFkZXIuJ31cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBTb2Z0IGR1cGxpY2F0ZS1uYW1lIHdhcm5pbmcgLS0gaWYgdGhlIG9wZXJhdG9yIHR5cGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYSBuYW1lIHRoYXQgYWxyZWFkeSBleGlzdHMgaW4gdGhlIHNhdmVkIGxpc3QgQVRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBESUZGRVJFTlQgQ09PUkRJTkFURVMsIHN1cmZhY2UgdGhhdCBzbyB0aGV5IGRvbid0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2lsZW50bHkgZW5kIHVwIHdpdGggdHdvIFwiSE9NRVwicyBwb2ludGluZyB0byB0d29cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWZmZXJlbnQgYWRkcmVzc2VzICh0aGUgYnVnIG9wZXJhdG9yLXJlcG9ydGVkIG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMjAyNi0wNi0yODogZGFzaGJvYXJkIGhhZCAyw5cgSE9NRSwgU2V0dXAgV2Fsa1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dlZCBvbmx5IDEpLiAgU2FtZSBjb29yZHMgPSBubyB3YXJuaW5nLCBpdCdzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganVzdCByZS1zZWxlY3RpbmcgYSBrbm93biBzaXRlLiAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgIHsoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHR5cGVkID0gKGNmZy5zaXRlTmFtZSB8fCAnJykudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdHlwZWQpIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvdW5kID0gKG4pID0+IChNYXRoLnJvdW5kKG4gKiAxMDAwMCkgLyAxMDAwMCkudG9GaXhlZCg0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXIgPSByb3VuZChjZmcubGF0KSArICcsJyArIHJvdW5kKGNmZy5sb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbmZsaWN0ID0gc2F2ZWRMb2NzLmZpbmQocyA9PiBzLm5hbWUgPT09IHR5cGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgKHJvdW5kKHMubGF0KSArICcsJyArIHJvdW5kKHMubG9uKSkgIT09IGN1cik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjb25mbGljdCkgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cImxvYy1kdXAtbmFtZS13YXJuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtdC0yIHB4LTIuNSBweS0yIHJvdW5kZWQtbWQgYmctYW1iZXItOTUwLzQwIGJvcmRlciBib3JkZXItYW1iZXItNzAwLzUwIHRleHQtWzEwLjVweF0gdGV4dC1hbWJlci0yMDAgbGVhZGluZy1zbnVnXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YiBjbGFzc05hbWU9XCJ0ZXh0LWFtYmVyLTEwMFwiPlNhbWUgbmFtZSBhbHJlYWR5IHNhdmVkPC9iPiBhdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvZGUgY2xhc3NOYW1lPVwibXgtMSBmb250LW1vbm8gdGV4dC1hbWJlci0xMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Y29uZmxpY3QubGF0LnRvRml4ZWQoMil9LCB7Y29uZmxpY3QubG9uLnRvRml4ZWQoMil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2NvZGU+LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2F2aW5nIGtlZXBzIGJvdGg7IHBpY2sgZnJvbSB0aGUgZHJvcGRvd24gYWJvdmUgdG8gc3dpdGNoIHRvIHRoZSBleGlzdGluZyBvbmUgaW5zdGVhZC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKCl9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyLXQgYm9yZGVyLXNsYXRlLTgwMCBwdC0zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlc29sdmVkIGFkZHJlc3MgLyBjaXR5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2dlb0J1c3kgJiYgPHNwYW4gY2xhc3NOYW1lPVwibWwtMiB0ZXh0LWFtYmVyLTQwMCBub3JtYWwtY2FzZSB0cmFja2luZy1ub3JtYWxcIj7igKYgcmVzb2x2aW5nPC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCIgdmFsdWU9e2NmZy5jaXR5fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSk9PnNldENmZyh7Li4uY2ZnLCBjaXR5OmUudGFyZ2V0LnZhbHVlfSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTEuNVwiPkxhdGl0dWRlPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCIgdHlwZT1cIm51bWJlclwiIHN0ZXA9XCIwLjAwMDFcIiB2YWx1ZT17Y2ZnLmxhdH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKT0+c2V0Q2ZnKHsuLi5jZmcsIGxhdDorZS50YXJnZXQudmFsdWV9KX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMS41XCI+TG9uZ2l0dWRlPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCIgdHlwZT1cIm51bWJlclwiIHN0ZXA9XCIwLjAwMDFcIiB2YWx1ZT17Y2ZnLmxvbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKT0+c2V0Q2ZnKHsuLi5jZmcsIGxvbjorZS50YXJnZXQudmFsdWV9KX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17dXNlTXlMb2NhdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17Z2VvU3RhdGUgPT09ICdidXN5J31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImxvYy11c2UtbXktbG9jYXRpb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHctZnVsbCBweS0yLjUgcm91bmRlZC1sZyBib3JkZXIgdGV4dC14cyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgdHJhbnNpdGlvbi1jb2xvcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtnZW9TdGF0ZSA9PT0gJ2J1c3knXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1hbWJlci05MDAvNDAgYm9yZGVyLWFtYmVyLTcwMC80MCB0ZXh0LWFtYmVyLTIwMCBjdXJzb3Itd2FpdCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogKGdlb1N0YXRlICYmIGdlb1N0YXRlLmVyclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLXJvc2UtOTAwLzQwIGJvcmRlci1yb3NlLTUwMC81MCB0ZXh0LXJvc2UtMTAwIGhvdmVyOmJnLXJvc2UtODAwLzQwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLWFtYmVyLTcwMC83MCBib3JkZXItYW1iZXItNTAwLzQwIHRleHQtYW1iZXItNTAgaG92ZXI6YmctYW1iZXItNjAwLzcwJyl9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7Z2VvU3RhdGUgPT09ICdidXN5J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ+KPsyAgUmVhZGluZyBkZXZpY2UgbG9jYXRpb27igKYnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAn8J+TjSAgVXNlIG15IGRldmljZSBsb2NhdGlvbid9XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICB7Z2VvU3RhdGUgJiYgZ2VvU3RhdGUuZXJyICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJsb2MtZ2VvLWVycm9yXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiLW10LTIgcHgtMyBweS0yIHJvdW5kZWQtbWQgYmctcm9zZS05NTAvNTAgYm9yZGVyIGJvcmRlci1yb3NlLTcwMC80MCB0ZXh0LVsxMXB4XSBsZWFkaW5nLXNudWcgdGV4dC1yb3NlLTIwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxiIGNsYXNzTmFtZT1cInRleHQtcm9zZS0xMDBcIj5Db3VsZG4ndCByZWFkIGxvY2F0aW9uLjwvYj48YnIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtcm9zZS0yMDAvOTBcIj57Z2VvU3RhdGUuZXJyfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogU3BlY2lmaWMgSFRUUC1vcmlnaW4gY2FsbC1vdXQ6IG1vc3QgbGlrZWx5IGNhdXNlIG9uIGEgVjEuOSBjb250cm9sbGVyLiAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmxvY2F0aW9uICYmIHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2h0dHA6JyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtMS41IHRleHQtWzEwcHhdIHRleHQtcm9zZS0zMDAvODAgZm9udC1tb25vXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXA6IGJyb3dzZXJzIHJlcXVpcmUgSFRUUFMgZm9yIGdlb2xvY2F0aW9uLiAgUGljayB0aGUgbG9jYXRpb24gb24gdGhlIG1hcCBvciBzZWFyY2ggYmFyIGluc3RlYWQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvcmRlci10IGJvcmRlci1zbGF0ZS04MDAgcHQtMyBtdC0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj5RdWljayBqdW1wczwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC0xLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7W1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J1Rvcm9udG8sIE9OJywgICBsYXQ6NDMuNjUzMiwgbG9uOi03OS4zODMyLCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonTmV3IFlvcmssIE5ZJywgIGxhdDo0MC43MTI4LCBsb246LTc0LjAwNjAsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidMb25kb24sIFVLJywgICAgbGF0OjUxLjUwNzQsIGxvbjogLTAuMTI3OCwgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J1BhcmlzLCBGUicsICAgICBsYXQ6NDguODU2NiwgbG9uOiAgMi4zNTIyLCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonVG9reW8sIEpQJywgICAgIGxhdDozNS42NzYyLCBsb246MTM5LjY1MDMsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidTeWRuZXksIEFVJywgICAgbGF0Oi0zMy44Njg4LGxvbjoxNTEuMjA5MywgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0ubWFwKGogPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGtleT17ai5uYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBsYXQ6ai5sYXQsIGxvbjpqLmxvbiwgY2l0eTpqLm5hbWV9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXBSZWYuY3VycmVudCkgbWFwUmVmLmN1cnJlbnQuc2V0Vmlldyhbai5sYXQsIGoubG9uXSwgai56KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtbGVmdCBweC0yLjUgcHktMS41IHJvdW5kZWQtbWQgYmctc2xhdGUtODAwLzcwIGJvcmRlciBib3JkZXItc2xhdGUtNzAwIHRleHQtWzExcHhdIGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTMwMCBob3ZlcjpiZy1zbGF0ZS03MDAgaG92ZXI6Ym9yZGVyLWFtYmVyLTUwMC80MCB0cmFuc2l0aW9uLWFsbFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2oubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbGVhZGluZy1yZWxheGVkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICBUaWxlczogT3BlblN0cmVldE1hcCDCtyBHZW9jb2RlOiBOb21pbmF0aW0gKGZyZWUsIH4xIHJlcS9zKS5cbiAgICAgICAgICAgICAgICAgICAgICAgIFVzZWQgZm9yIE9wZW4tTWV0ZW8gd2VhdGhlciBmZWVkIGFuZCBzdW5yaXNlL3N1bnNldCBlc3RpbWF0aW9uLlxuICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Nb2RhbFNoZWxsPlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIExhbmd1YWdlIFNldHRpbmcgLS0gbW9kYWxcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIExhbmd1YWdlTW9kYWwoeyBjZmcsIHNldENmZywgb25DbG9zZSwgb25TYXZlIH0pIHtcbiAgICBjb25zdCBsYW5ncyA9IFtcbiAgICAgICAgeyBjb2RlOidlbicsICAgIGxhYmVsOidFbmdsaXNoJywgICAgICAgICAgICAgICAgbmF0aXZlOidFbmdsaXNoJyAgICB9LFxuICAgICAgICB7IGNvZGU6J3poLUNOJywgbGFiZWw6J0NoaW5lc2UgKFNpbXBsaWZpZWQpJywgICBuYXRpdmU6J+eugOS9k+S4reaWhycgICAgfSxcbiAgICAgICAgeyBjb2RlOid6aC1UVycsIGxhYmVsOidDaGluZXNlIChUcmFkaXRpb25hbCknLCAgbmF0aXZlOifnuYHpq5TkuK3mlocnICAgIH0sXG4gICAgICAgIHsgY29kZTonamEnLCAgICBsYWJlbDonSmFwYW5lc2UnLCAgICAgICAgICAgICAgIG5hdGl2ZTon5pel5pys6KqeJyAgICAgIH0sXG4gICAgICAgIHsgY29kZTona28nLCAgICBsYWJlbDonS29yZWFuJywgICAgICAgICAgICAgICAgIG5hdGl2ZTon7ZWc6rWt7Ja0JyAgICAgIH0sXG4gICAgXTtcblxuICAgIC8qIE9uIFNhdmUgJiByZXR1cm46IHdyaXRlIHRoZSBwaWNrZWQgbGFuZ3VhZ2UgY29kZSB0byB0aGUgc2FtZVxuICAgICAqIGxvY2FsU3RvcmFnZSBrZXkgdGhlIGRhc2hib2FyZCdzIGkxOG4uanMgcmVhZHMgKGBpMThuX2xhbmdgKSwgYW5kXG4gICAgICogZGlzcGF0Y2ggdGhlIGBsYW5nY2hhbmdlYCBldmVudCBzbyBhbnkgb3BlbiBkYXNoYm9hcmQvY29uZmlnIHRhYlxuICAgICAqIHBpY2tzIGl0IHVwIGxpdmUuICBUaGlzIGlzIHdoYXQgbWFrZXMgdGhlIHNldHVwIHdhbGsncyBsYW5ndWFnZVxuICAgICAqIGNob2ljZSBhY3R1YWxseSBkcml2ZSB0aGUgZGFzaGJvYXJkIC8gY29uZmlnIC8gbWFwcGVyIFVJIC0tIHRoZVxuICAgICAqIHNpZGViYXIgc2VsZWN0b3IgdGhhdCB1c2VkIHRvIGxpdmUgaW4gdGhlIGRhc2hib2FyZCBoZWFkZXIgaGFzXG4gICAgICogYmVlbiByZW1vdmVkICgyMDI2LTA2LTI2KSBhbmQgdGhlIHNldHVwIHdhbGsgaXMgbm93IHRoZSBzaW5nbGVcbiAgICAgKiBzb3VyY2Ugb2YgdHJ1dGggZm9yIFVJIGxhbmd1YWdlLiAqL1xuICAgIGNvbnN0IHBlcnNpc3RBbmRTYXZlID0gKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2kxOG5fbGFuZycsIGNmZy5sYW5nKTtcbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnbGFuZ2NoYW5nZScpKTtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnW3NldHVwIHdhbGtdIGkxOG5fbGFuZyA8LScsIGNmZy5sYW5nKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdbc2V0dXAgd2Fsa10gY291bGQgbm90IHBlcnNpc3QgbGFuZ3VhZ2U6JywgZSk7XG4gICAgICAgIH1cbiAgICAgICAgb25TYXZlKCk7XG4gICAgfTtcbiAgICByZXR1cm4gKFxuICAgICAgICA8TW9kYWxTaGVsbCB0aXRsZT1cIkxhbmd1YWdlIFNldHRpbmdcIiBzdWJ0aXRsZT1cIlBpY2sgeW91ciBkZWZhdWx0IGludGVyZmFjZSBsYW5ndWFnZVwiIGFjY2VudD1cImVtZXJhbGRcIiBvbkNsb3NlPXtvbkNsb3NlfSBvblNhdmU9e3BlcnNpc3RBbmRTYXZlfT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtM1wiPlxuICAgICAgICAgICAgICAgIHtsYW5ncy5tYXAobCA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PXtsLmNvZGV9IG9uQ2xpY2s9eygpPT5zZXRDZmcoey4uLmNmZywgbGFuZzpsLmNvZGV9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B0ZXh0LWxlZnQgcC0zIHJvdW5kZWQteGwgYm9yZGVyLTIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjZmcubGFuZyA9PT0gbC5jb2RlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdib3JkZXItZW1lcmFsZC01MDAgYmctZW1lcmFsZC05MDAvMjAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdib3JkZXItc2xhdGUtNzAwIGJnLXNsYXRlLTgwMC80MCBob3ZlcjpiZy1zbGF0ZS04MDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS01MDBcIj57bC5jb2RlfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS0yMDBcIj57bC5uYXRpdmV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzExcHhdIHRleHQtc2xhdGUtNTAwXCI+e2wubGFiZWx9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvTW9kYWxTaGVsbD5cbiAgICApO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBQbHVnLWluIFNldHRpbmcgLS0gbW9kYWwgdy8gbGlzdCArIHVwbG9hZCB6b25lXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4vKiBQZXItcGx1Zy1pbiBtb2NrIGNvbmZpZ3VyYXRpb24gZmllbGRzLiAgS2V5cyBtYXAgdG8gcGx1Zy1pbiBgaWRgLiAqL1xuY29uc3QgUExVR0lOX0NPTkZJR19GSUVMRFMgPSB7XG4gICAgd2VhdGhlcjogICAgW1xuICAgICAgICB7IGtleToncHJvdmlkZXInLCAgbGFiZWw6J1Byb3ZpZGVyJywgICAgICAgICAgdHlwZTonc2VsZWN0JywgIG9wdGlvbnM6WydPcGVuLU1ldGVvJywnTldTJywnRUNNV0YnXSwgZGVmOidPcGVuLU1ldGVvJyB9LFxuICAgICAgICB7IGtleToncmVmcmVzaCcsICAgbGFiZWw6J1JlZnJlc2ggaW50ZXJ2YWwnLCAgdHlwZTonc2VsZWN0JywgIG9wdGlvbnM6WycxIG1pbicsJzUgbWluJywnMTUgbWluJywnMzAgbWluJywnMSBoJ10sIGRlZjonMTUgbWluJyB9LFxuICAgICAgICB7IGtleTonY2FjaGUnLCAgICAgbGFiZWw6J0NhY2hlIFRUTCAobWluKScsICAgdHlwZTonbnVtYmVyJywgIGRlZjozMCB9LFxuICAgIF0sXG4gICAgZ2l2b25pOiAgICAgW1xuICAgICAgICB7IGtleTonY2xpbWF0ZScsICAgbGFiZWw6J0NsaW1hdGUgbW9kZWwnLCAgICAgdHlwZTonc2VsZWN0JywgIG9wdGlvbnM6WydHaXZvbmkgMTk5MicsJ0FTSFJBRSA1NScsJ0FkYXB0aXZlJ10sIGRlZjonR2l2b25pIDE5OTInIH0sXG4gICAgICAgIHsga2V5OidtYXNzaXZlJywgICBsYWJlbDonSGVhdnl3ZWlnaHQgY29uc3RydWN0aW9uJywgIHR5cGU6J3RvZ2dsZScsIGRlZjpmYWxzZSB9LFxuICAgIF0sXG4gICAgc3dlZXRfc3BvdDogW1xuICAgICAgICB7IGtleTondHJhY2tpbmcnLCAgbGFiZWw6J1RyYWNrIG91dGRvb3IgUkgnLCAgdHlwZTondG9nZ2xlJywgZGVmOnRydWUgfSxcbiAgICAgICAgeyBrZXk6J2h5c3QnLCAgICAgIGxhYmVsOidIeXN0ZXJlc2lzICglIFJIKScsIHR5cGU6J251bWJlcicsIGRlZjoyIH0sXG4gICAgXSxcbiAgICBnMzY6ICAgICAgICBbXG4gICAgICAgIHsga2V5Oidtb2RlJywgICAgICBsYWJlbDonU2VxdWVuY2UgbW9kZScsICAgICB0eXBlOidzZWxlY3QnLCAgb3B0aW9uczpbJ1NpbmdsZS16b25lIFZBVicsJ011bHRpLXpvbmUgVkFWJywnRE9BUyB3LyBGQ1UnXSwgZGVmOidNdWx0aS16b25lIFZBVicgfSxcbiAgICAgICAgeyBrZXk6J3ZlcmJvc2UnLCAgIGxhYmVsOidWZXJib3NlIGxvZ2dpbmcnLCAgIHR5cGU6J3RvZ2dsZScsIGRlZjpmYWxzZSB9LFxuICAgIF0sXG4gICAgZGlidDogICAgICAgW1xuICAgICAgICB7IGtleTonaG9zdCcsICAgICAgbGFiZWw6J0JyaWRnZSBob3N0JywgICAgICAgdHlwZTondGV4dCcsICAgZGVmOicxOTIuMTY4LjEuMTAwJyB9LFxuICAgICAgICB7IGtleToncG9ydCcsICAgICAgbGFiZWw6J1RlbGVncmFtIHBvcnQnLCAgICAgdHlwZTonbnVtYmVyJywgZGVmOjQ3ODA4IH0sXG4gICAgICAgIHsga2V5Oidwb2xsX21zJywgICBsYWJlbDonUG9sbCBpbnRlcnZhbCAobXMpJyx0eXBlOidudW1iZXInLCBkZWY6MjAwMCB9LFxuICAgIF0sXG4gICAgbGlnaHRpbmc6ICAgW1xuICAgICAgICB7IGtleTonZ2F0ZXdheScsICAgbGFiZWw6J01vZGJ1cyBnYXRld2F5IElQJywgdHlwZTondGV4dCcsICAgZGVmOicxMC4wLjAuNTAnIH0sXG4gICAgICAgIHsga2V5Oid1bml0X2lkJywgICBsYWJlbDonVW5pdCBJRCcsICAgICAgICAgICB0eXBlOidudW1iZXInLCBkZWY6MSB9LFxuICAgICAgICB7IGtleTondGNwX3BvcnQnLCAgbGFiZWw6J1RDUCBwb3J0JywgICAgICAgICAgdHlwZTonbnVtYmVyJywgZGVmOjUwMiB9LFxuICAgIF0sXG59O1xuXG5mdW5jdGlvbiBQbHVnaW5zTW9kYWwoeyBjZmcsIHNldENmZywgb25DbG9zZSwgb25TYXZlIH0pIHtcbiAgICBjb25zdCBBTEwgPSBbXG4gICAgICAgIHsgaWQ6J3dlYXRoZXInLCAgICAgbmFtZTonV2VhdGhlcicsICAgICAgICAgZGVzYzonT3Blbi1NZXRlbyBPQSBmZWVkJywgICAgICAgICAgdmVyOicyLjEuMCcgfSxcbiAgICAgICAgeyBpZDonZ2l2b25pJywgICAgICBuYW1lOidHaXZvbmkgRW5naW5lJywgICBkZXNjOidDbGltYXRlLXN0cmF0ZWd5IG92ZXJsYXknLCAgICB2ZXI6JzEuMy40JyB9LFxuICAgICAgICB7IGlkOidzd2VldF9zcG90JywgIG5hbWU6J1N3ZWV0LVNwb3QgUkgnLCAgIGRlc2M6J0FkanVzdGFibGUgUkggYmFuZCcsICAgICAgICAgIHZlcjonMS4wLjEnIH0sXG4gICAgICAgIHsgaWQ6J2czNicsICAgICAgICAgbmFtZTonRzM2IFNlcXVlbmNlcycsICAgZGVzYzonQVNIUkFFIEd1aWRlbGluZSAzNicsICAgICAgICAgdmVyOicwLjkuMicgfSxcbiAgICAgICAgeyBpZDonZGlidCcsICAgICAgICBuYW1lOidESUJUIEJyaWRnZScsICAgICBkZXNjOidEZWx0YSBDb250cm9scyAoRElCVCkgQkFDbmV0IGJyaWRnZScsICAgICAgICAgICB2ZXI6JzAuNC4wJyB9LFxuICAgICAgICB7IGlkOidsaWdodGluZycsICAgIG5hbWU6J0xpZ2h0aW5nIChSZWQ1KScsIGRlc2M6J1YzLjAgTW9kYnVzIFRDUCBjbGllbnQnLCAgICAgIHZlcjonMC4xLjAtYmV0YScgfSxcbiAgICBdO1xuICAgIGNvbnN0IHRvZ2dsZSA9IChpZCkgPT4gc2V0Q2ZnKGMgPT4gKHtcbiAgICAgICAgLi4uYyxcbiAgICAgICAgZW5hYmxlZDogYy5lbmFibGVkLmluY2x1ZGVzKGlkKSA/IGMuZW5hYmxlZC5maWx0ZXIoeCA9PiB4ICE9PSBpZCkgOiBbLi4uYy5lbmFibGVkLCBpZF1cbiAgICB9KSk7XG5cbiAgICAvKiBleHBhbnNpb24gc3RhdGUg4oCUIHdoaWNoIHBsdWctaW4ncyBcIkNvbmZpZ3VyZVwiIHBhbmVsIGlzIG9wZW4gKi9cbiAgICBjb25zdCBbZXhwYW5kZWRJZCwgc2V0RXhwYW5kZWRJZF0gPSBSZWFjdC51c2VTdGF0ZShudWxsKTtcblxuICAgIGNvbnN0IHVwZGF0ZUZpZWxkID0gKHBsdWdpbklkLCBmaWVsZEtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgc2V0Q2ZnKGMgPT4gKHtcbiAgICAgICAgICAgIC4uLmMsXG4gICAgICAgICAgICBmaWVsZHM6IHsgLi4uKGMuZmllbGRzIHx8IHt9KSwgW3BsdWdpbklkXTogeyAuLi4oKGMuZmllbGRzIHx8IHt9KVtwbHVnaW5JZF0gfHwge30pLCBbZmllbGRLZXldOiB2YWx1ZSB9IH1cbiAgICAgICAgfSkpO1xuICAgIH07XG5cbiAgICBjb25zdCBmaWVsZFZhbCA9IChwbHVnaW5JZCwgZmllbGQpID0+IHtcbiAgICAgICAgY29uc3Qgc3RvcmVkID0gY2ZnLmZpZWxkcyAmJiBjZmcuZmllbGRzW3BsdWdpbklkXSAmJiBjZmcuZmllbGRzW3BsdWdpbklkXVtmaWVsZC5rZXldO1xuICAgICAgICByZXR1cm4gc3RvcmVkICE9PSB1bmRlZmluZWQgPyBzdG9yZWQgOiBmaWVsZC5kZWY7XG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxNb2RhbFNoZWxsIHRpdGxlPVwiUGx1Zy1pbiBTZXR0aW5nXCIgc3VidGl0bGU9XCJFbmFibGUsIHVwbG9hZCBvciBtb2RpZnkgcGx1Zy1pbnNcIiBhY2NlbnQ9XCJwaW5rXCIgb25DbG9zZT17b25DbG9zZX0gb25TYXZlPXtvblNhdmV9IHNpemU9XCJ3aWRlXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMyBtYXgtaC1bNjB2aF0gb3ZlcmZsb3cteS1hdXRvIHByLTFcIj5cbiAgICAgICAgICAgICAgICB7QUxMLm1hcChwID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb24gPSBjZmcuZW5hYmxlZC5pbmNsdWRlcyhwLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhwYW5kZWQgPSBleHBhbmRlZElkID09PSBwLmlkO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWVsZHMgPSBQTFVHSU5fQ09ORklHX0ZJRUxEU1twLmlkXSB8fCBbXTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtwLmlkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2Byb3VuZGVkLXhsIGJvcmRlciB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke29uID8gJ2JvcmRlci1waW5rLTUwMC80MCBiZy1waW5rLTkwMC8xMCcgOiAnYm9yZGVyLXNsYXRlLTcwMCBiZy1zbGF0ZS04MDAvNDAnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2V4cGFuZGVkID8gJ3JpbmctMSByaW5nLXBpbmstNTAwLzMwJyA6ICcnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHAtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS0xMDBcIj57cC5uYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1sLTIgdGV4dC1bMTBweF0gZm9udC1tb25vIHRleHQtc2xhdGUtNTAwXCI+dntwLnZlcn08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXNsYXRlLTQwMFwiPntwLmRlc2N9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHRvZ2dsZShwLmlkKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BwbHVnaW4tdG9nZ2xlLSR7cC5pZH1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweC0zIHB5LTEgcm91bmRlZC1tZCB0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgYm9yZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke29uID8gJ2JvcmRlci1waW5rLTUwMC82MCB0ZXh0LXBpbmstMzAwIGJnLXBpbmstOTAwLzMwJyA6ICdib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtNDAwIGJnLXNsYXRlLTgwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge29uID8gJ0VuYWJsZWQnIDogJ0Rpc2FibGVkJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBzZXRFeHBhbmRlZElkKGV4cGFuZGVkID8gbnVsbCA6IHAuaWQpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17YHBsdWdpbi1jb25maWctJHtwLmlkfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTMgcHktMSByb3VuZGVkLW1kIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayBib3JkZXIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7ZXhwYW5kZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdib3JkZXItcGluay01MDAgYmctcGluay05MDAvMzAgdGV4dC1waW5rLTIwMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtNDAwIGJnLXNsYXRlLTgwMCBob3ZlcjpiZy1zbGF0ZS03MDAgaG92ZXI6Ym9yZGVyLXBpbmstNTAwLzUwIGhvdmVyOnRleHQtcGluay0zMDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtleHBhbmRlZCA/ICdDbG9zZSDilrQnIDogJ0NvbmZpZ3VyZSDilr4nfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtleHBhbmRlZCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHgtNCBwYi00IGJvcmRlci10IGJvcmRlci1waW5rLTUwMC8yMCBiZy1zbGF0ZS05NTAvNDBcIiBkYXRhLXRlc3RpZD17YHBsdWdpbi1jb25maWctcGFuZWwtJHtwLmlkfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2ZpZWxkcy5sZW5ndGggPT09IDAgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXNsYXRlLTUwMCBpdGFsaWMgcHktM1wiPk5vIGNvbmZpZ3VyYWJsZSBvcHRpb25zIGZvciB0aGlzIHBsdWctaW4geWV0LjwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIG1kOmdyaWQtY29scy0yIGdhcC0zIHB0LTNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2ZpZWxkcy5tYXAoZiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2ID0gZmllbGRWYWwocC5pZCwgZik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtmLmtleX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTUwMCBibG9jayBtYi0xXCI+e2YubGFiZWx9PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2YudHlwZSA9PT0gJ3NlbGVjdCcgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dCBjdXJzb3ItcG9pbnRlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt2fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZUZpZWxkKHAuaWQsIGYua2V5LCBlLnRhcmdldC52YWx1ZSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmLm9wdGlvbnMubWFwKG8gPT4gPG9wdGlvbiBrZXk9e299IHZhbHVlPXtvfT57b308L29wdGlvbj4pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmLnR5cGUgPT09ICdudW1iZXInICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt2fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlRmllbGQocC5pZCwgZi5rZXksICtlLnRhcmdldC52YWx1ZSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2YudHlwZSA9PT0gJ3RleHQnICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZUZpZWxkKHAuaWQsIGYua2V5LCBlLnRhcmdldC52YWx1ZSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2YudHlwZSA9PT0gJ3RvZ2dsZScgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB1cGRhdGVGaWVsZChwLmlkLCBmLmtleSwgIXYpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B3LWZ1bGwgcHktMiByb3VuZGVkLWxnIHRleHQteHMgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGJvcmRlciB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHt2XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctcGluay03MDAvNDAgYm9yZGVyLXBpbmstNTAwLzYwIHRleHQtcGluay0yMDAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctc2xhdGUtODAwIGJvcmRlci1zbGF0ZS02MDAgdGV4dC1zbGF0ZS00MDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt2ID8gJ09OJyA6ICdPRkYnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktZW5kIGdhcC0yIG10LTQgcHQtMyBib3JkZXItdCBib3JkZXItc2xhdGUtODAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVzZXQgdGhpcyBwbHVnLWluJ3MgZmllbGRzIHRvIGRlZmF1bHRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q2ZnKGMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXh0ID0geyAuLi4oYy5maWVsZHMgfHwge30pIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBuZXh0W3AuaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyAuLi5jLCBmaWVsZHM6IG5leHQgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC0zIHB5LTEuNSByb3VuZGVkLW1kIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayBib3JkZXIgYm9yZGVyLXNsYXRlLTYwMCB0ZXh0LXNsYXRlLTQwMCBob3ZlcjpiZy1zbGF0ZS04MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVzZXQgZGVmYXVsdHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHNldEV4cGFuZGVkSWQobnVsbCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC0zIHB5LTEuNSByb3VuZGVkLW1kIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayBiZy1waW5rLTYwMCBob3ZlcjpiZy1waW5rLTUwMCB0ZXh0LXdoaXRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERvbmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC01IHAtNCBib3JkZXItMiBib3JkZXItZGFzaGVkIGJvcmRlci1zbGF0ZS03MDAgcm91bmRlZC14bCB0ZXh0LWNlbnRlciBob3Zlcjpib3JkZXItcGluay01MDAvNDAgdHJhbnNpdGlvbi1hbGwgY3Vyc29yLXBvaW50ZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtM3hsIG1iLTFcIj7ipLQ8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1ibGFjayB0ZXh0LXNsYXRlLTMwMFwiPkRyb3AgYSAucHkgLyAuemlwIC8gLnJlZDUgcGx1Zy1pbiBoZXJlPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMXB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0xXCI+b3IgY2xpY2sgdG8gY2hvb3NlIGEgZmlsZSAobW9jayDigJQgbm90IHdpcmVkKTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvTW9kYWxTaGVsbD5cbiAgICApO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBNb2RhbCBTaGVsbCAtLSBzaGFyZWRcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIE1vZGFsU2hlbGwoeyB0aXRsZSwgc3VidGl0bGUsIGFjY2VudD0naW5kaWdvJywgb25DbG9zZSwgb25TYXZlLCBzaXplPScnLCBjaGlsZHJlbiB9KSB7XG4gICAgY29uc3QgY29sb3JNYXAgPSB7XG4gICAgICAgIGluZGlnbzonIzgxOGNmOCcsIGFtYmVyOicjZmJiZjI0JywgZW1lcmFsZDonIzM0ZDM5OScsIHBpbms6JyNmNDcyYjYnXG4gICAgfTtcbiAgICBjb25zdCBjID0gY29sb3JNYXBbYWNjZW50XSB8fCAnIzgxOGNmOCc7XG4gICAgY29uc3Qgc2l6ZU1hcCA9IHtcbiAgICAgICAgd2lkZTogJ21heC13LTJ4bCcsXG4gICAgICAgIG1hcDogICdtYXgtdy0zeGwnLFxuICAgICAgICBtYXg6ICAnbWF4LXctWzk2dnddIHctWzk2dnddIGgtWzkydmhdJyxcbiAgICB9O1xuICAgIGNvbnN0IHdpZHRoID0gc2l6ZU1hcFtzaXplXSB8fCAnbWF4LXctbWQnO1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZml4ZWQgaW5zZXQtMCB6LTUwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIG1vZGFsLWJhY2tkcm9wXCIgb25DbGljaz17b25DbG9zZX0+XG4gICAgICAgICAgICB7LyogRmxleC1jb2x1bW4gc2hlbGw6IGhlYWRlciAoZml4ZWQpICsgc2Nyb2xsYWJsZSBjb250ZW50ICsgc3RpY2t5IGZvb3Rlci5cbiAgICAgICAgICAgICAgICBDcml0aWNhbCBmb3Igc2l6ZT1cIm1heFwiIHdoZXJlIGNoaWxkcmVuIGFsb25lIGV4Y2VlZCB0aGUgbW9kYWwgaGVpZ2h0XG4gICAgICAgICAgICAgICAgYW5kIHdvdWxkIG90aGVyd2lzZSBwdXNoIHRoZSBTYXZlICYgcmV0dXJuIGJ1dHRvbiBiZWxvdyB0aGUgdmlld3BvcnQuICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BiZy1zbGF0ZS05MDAgYm9yZGVyLTIgcm91bmRlZC0yeGwgdy1mdWxsICR7d2lkdGh9IG14LTQgZmFkZS11cCBmbGV4IGZsZXgtY29sYH1cbiAgICAgICAgICAgICAgICAgb25DbGljaz17KGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCl9XG4gICAgICAgICAgICAgICAgIHN0eWxlPXt7Ym9yZGVyQ29sb3I6YCR7Y302NmAsIG1heEhlaWdodDogJzkydmgnfX0+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLXN0YXJ0IGp1c3RpZnktYmV0d2VlbiBwLTYgcGItNCBib3JkZXItYiBib3JkZXItc2xhdGUtODAwLzYwIHNocmluay0wXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1sZyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3RcIiBzdHlsZT17e2NvbG9yOmN9fT57dGl0bGV9PC9oMz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS01MDAgbXQtMVwiPntzdWJ0aXRsZX08L3A+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwibW9kYWwtY2xvc2VcIiBvbkNsaWNrPXtvbkNsb3NlfSBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCBob3Zlcjp0ZXh0LXdoaXRlIHRleHQtMnhsIGxlYWRpbmctbm9uZVwiPsOXPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTEgbWluLWgtMCBvdmVyZmxvdy15LWF1dG8gcHgtNiBweS01XCI+XG4gICAgICAgICAgICAgICAgICAgIHtjaGlsZHJlbn1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktZW5kIGdhcC0zIHB4LTYgcHktNCBib3JkZXItdCBib3JkZXItc2xhdGUtODAwIHNocmluay0wIGJnLXNsYXRlLTkwMCByb3VuZGVkLWItMnhsXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJtb2RhbC1jYW5jZWxcIiBvbkNsaWNrPXtvbkNsb3NlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTQgcHktMiByb3VuZGVkLWxnIGJnLXNsYXRlLTgwMCBib3JkZXIgYm9yZGVyLXNsYXRlLTcwMCB0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayB0ZXh0LXNsYXRlLTQwMCBob3ZlcjpiZy1zbGF0ZS03MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIENhbmNlbFxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cIm1vZGFsLXNhdmVcIiBvbkNsaWNrPXtvblNhdmV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtNSBweS0yIHJvdW5kZWQtbGcgdGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgdGV4dC13aGl0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOmMsIGJveFNoYWRvdzpgMCAwIDEycHggJHtjfTU1YH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgU2F2ZSAmIHJldHVybiDinJNcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuLyogbW91bnQgKi9cblJlYWN0RE9NLmNyZWF0ZVJvb3QoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKSkucmVuZGVyKDxBcHAvPik7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBQSxNQUFBLEdBQThCQyxLQUFLO0VBQTNCQyxRQUFRLEdBQUFGLE1BQUEsQ0FBUkUsUUFBUTtFQUFFQyxPQUFPLEdBQUFILE1BQUEsQ0FBUEcsT0FBTzs7QUFFekI7QUFDQTtBQUNBO0FBQ0EsSUFBTUMsS0FBSyxHQUFHO0FBQ1Y7QUFDSjtBQUNBO0FBQ0E7QUFDSTtFQUFFQyxHQUFHLEVBQUMsS0FBSztFQUFPQyxLQUFLLEVBQUMsV0FBVztFQUFRQyxHQUFHLEVBQUMsMEJBQTBCO0VBQVFDLElBQUksRUFBQyxNQUFNO0VBQUdDLFNBQVMsRUFBQyxTQUFTO0VBQUVDLE1BQU0sRUFBQztBQUFTLENBQUMsRUFDckk7RUFBRUwsR0FBRyxFQUFDLFVBQVU7RUFBRUMsS0FBSyxFQUFDLFVBQVU7RUFBU0MsR0FBRyxFQUFDLG1CQUFtQjtFQUFlQyxJQUFJLEVBQUMsT0FBTztFQUFFQyxTQUFTLEVBQUMsU0FBUztFQUFFQyxNQUFNLEVBQUM7QUFBUyxDQUFDLEVB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