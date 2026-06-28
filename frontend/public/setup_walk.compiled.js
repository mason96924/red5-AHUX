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
    var rowKey = "".concat(loc.name, "__").concat(loc.lat.toFixed(4), ",").concat(loc.lon.toFixed(4));
    return /*#__PURE__*/React.createElement("div", {
      key: rowKey,
      role: "button",
      tabIndex: 0,
      onClick: () => pickSavedLoc(loc),
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
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-sm text-slate-100 truncate"
    }, loc.name), /*#__PURE__*/React.createElement("div", {
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBfd2Fsay5jb21waWxlZC5qcyIsIm5hbWVzIjpbIl9SZWFjdCIsIlJlYWN0IiwidXNlU3RhdGUiLCJ1c2VNZW1vIiwiU1RFUFMiLCJrZXkiLCJsYWJlbCIsInN1YiIsImtpbmQiLCJpY29uQ29sb3IiLCJhY2NlbnQiLCJocmVmIiwiQXBwIiwiX3VzZVN0YXRlIiwicHN5IiwibG9jYXRpb24iLCJsYW5ndWFnZSIsInBsdWdpbnMiLCJyZXBhaXIiLCJfdXNlU3RhdGUyIiwiX3NsaWNlZFRvQXJyYXkiLCJkb25lIiwic2V0RG9uZSIsIl91c2VTdGF0ZTMiLCJfdXNlU3RhdGU0Iiwicm91dGUiLCJzZXRSb3V0ZSIsIl91c2VTdGF0ZTUiLCJfdXNlU3RhdGU2IiwibW9kYWwiLCJzZXRNb2RhbCIsIl91c2VTdGF0ZTciLCJnaXZvbmkiLCJyaFByZXNldCIsInJoTG8iLCJyaEhpIiwidExvIiwidEhpIiwidGhlbWUiLCJkYXJrTGV2ZWwiLCJfdXNlU3RhdGU4IiwicHN5Q2ZnIiwic2V0UHN5Q2ZnIiwiX3VzZVN0YXRlOSIsInNpdGVOYW1lIiwiY2l0eSIsImxhdCIsImxvbiIsIl91c2VTdGF0ZTAiLCJsb2NDZmciLCJzZXRMb2NDZmciLCJfdXNlU3RhdGUxIiwidiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJhbGxvd2VkIiwiaW5kZXhPZiIsImxhbmciLCJlIiwiX3VzZVN0YXRlMTAiLCJsYW5nQ2ZnIiwic2V0TGFuZ0NmZyIsIl91c2VTdGF0ZTExIiwiZW5hYmxlZCIsIl91c2VTdGF0ZTEyIiwicGx1Z2luQ2ZnIiwic2V0UGx1Z2luQ2ZnIiwiY29tcGxldGVDb3VudCIsIk9iamVjdCIsInZhbHVlcyIsImZpbHRlciIsIkJvb2xlYW4iLCJsZW5ndGgiLCJmaW5pc2giLCJkIiwiX29iamVjdFNwcmVhZCIsImNyZWF0ZUVsZW1lbnQiLCJQc3lDaGFydFNldHRpbmdQYWdlIiwiY2ZnIiwic2V0Q2ZnIiwib25CYWNrIiwib25TYXZlIiwiY2xhc3NOYW1lIiwib25DbGljayIsInNldEl0ZW0iLCJzdHlsZSIsIndpZHRoIiwiYXNwZWN0UmF0aW8iLCJhbmltYXRpb25EZWxheSIsInNyYyIsImFsdCIsIm9wYWNpdHkiLCJiYWNrZ3JvdW5kIiwibWFwIiwicyIsImkiLCJhbmdsZURlZyIsImFuZ2xlIiwiTWF0aCIsIlBJIiwiciIsIngiLCJjb3MiLCJ5Iiwic2luIiwiQ2lyY2xlVGlsZSIsInN0ZXAiLCJpbmRleCIsImxlZnRQY3QiLCJ0b3BQY3QiLCJ3aW5kb3ciLCJ2aWV3Qm94IiwicHJlc2VydmVBc3BlY3RSYXRpbyIsImlkIiwibWFza1VuaXRzIiwiaGVpZ2h0IiwiZmlsbCIsIl8iLCJhIiwiY3giLCJjeSIsInN0cm9rZSIsInN0cm9rZVdpZHRoIiwibWFzayIsImNvbmNhdCIsInRleHRTaGFkb3ciLCJMb2NhdGlvbk1vZGFsIiwib25DbG9zZSIsIkxhbmd1YWdlTW9kYWwiLCJQbHVnaW5zTW9kYWwiLCJUaWxlIiwiX3JlZiIsImJvcmRlciIsIlRpbGVJY29uIiwiY29sb3IiLCJfcmVmMiIsInJpbmdDb2xvciIsImxlZnQiLCJ0b3AiLCJ0cmFuc2Zvcm0iLCJib3hTaGFkb3ciLCJfcmVmMyIsInN0cm9rZUxpbmVjYXAiLCJzdHJva2VMaW5lam9pbiIsIl9leHRlbmRzIiwiX3JlZjQiLCJ1cGRhdGUiLCJrIiwiYyIsInVzZUVmZmVjdCIsInJhdyIsInByZXNldCIsInBhdGNoIiwicCIsIkpTT04iLCJwYXJzZSIsIk51bWJlciIsImlzRmluaXRlIiwibG8iLCJoaSIsIlJIX1BSRVNFVFMiLCJmaW5kIiwidGgiLCJkbCIsInBhcnNlRmxvYXQiLCJ0clJhdyIsInRyIiwibWluIiwibWF4Iiwia2V5cyIsInBlcnNpc3RBbmRTYXZlIiwic3RyaW5naWZ5IiwiU3RyaW5nIiwiZGlzcGF0Y2hFdmVudCIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwiY29uc29sZSIsImluZm8iLCJ3YXJuIiwiUHN5U2tlbGV0b24iLCJQc3lDb250cm9sUGFuZWwiLCJub3RlIiwiX3JlZjUiLCJXIiwiSCIsInBhZCIsInJpZ2h0IiwiYm90dG9tIiwiZ3JpZFciLCJncmlkSCIsIlRfTUlOIiwiVF9NQVgiLCJXX01JTiIsIldfTUFYIiwidCIsInciLCJfZ2V0VyIsImdldFciLCJyaCIsInNhZmVQdHMiLCJhcnIiLCJ0b0ZpeGVkIiwiam9pbiIsInJoODAiLCJwdXNoIiwicmgxMDAiLCJyaDIwTGluZSIsInJoMjBfQ1oiLCJDWiIsInJoSGlfdG9wIiwidHQiLCJyaExvX2JvdCIsIlNXRUVUIiwiTlYiLCJNYXNzIiwiTUNWIiwiRVZBUCIsIndpbnRlclJIODAiLCJ3aW50ZXJSSDIwIiwiV0lOVEVSIiwiaXNvcGxldGhzIiwiaXNMaWdodCIsInBhbGV0dGUiLCJiZyIsImdyaWQiLCJ0aWNrIiwiYXhpcyIsInBhbmVsQmciLCJwYW5lbEJvcmRlciIsInBpbGxCZyIsInBpbGxGZyIsIm1ldGFGZyIsImRpbUZpbHRlciIsImJvcmRlckNvbG9yIiwiYm9yZGVyUmFkaXVzIiwiQXJyYXkiLCJmcm9tIiwieDEiLCJ5MSIsIngyIiwieTIiLCJmb250U2l6ZSIsInRleHRBbmNob3IiLCJwdHMiLCJ3dyIsInBvaW50cyIsInN0cm9rZURhc2hhcnJheSIsImZsb29yIiwiZm9udFdlaWdodCIsImZpbGxPcGFjaXR5IiwiY2xpcFBhdGhVbml0cyIsImNsaXBQYXRoIiwibGV0dGVyU3BhY2luZyIsInBhaW50T3JkZXIiLCJfcmVmNiIsInJvdW5kIiwidHlwZSIsInZhbHVlIiwib25DaGFuZ2UiLCJ0YXJnZXQiLCJhY2NlbnRDb2xvciIsIl9ub3JtYWxpemVMb2NzIiwic2VlbiIsIlNldCIsIm91dCIsImwiLCJuYW1lIiwidHJpbSIsImhhcyIsImFkZCIsIl9yZWY3IiwibWFwQm94UmVmIiwidXNlUmVmIiwibWFwUmVmIiwibWFya2VyUmVmIiwiX1JlYWN0JHVzZVN0YXRlIiwiX1JlYWN0JHVzZVN0YXRlMiIsImdlb0J1c3kiLCJzZXRHZW9CdXN5IiwiX1JlYWN0JHVzZVN0YXRlMyIsImlzQXJyYXkiLCJfUmVhY3QkdXNlU3RhdGU0Iiwic2F2ZWRMb2NzIiwic2V0U2F2ZWRMb2NzIiwiY2FuY2VsbGVkIiwiX2FzeW5jVG9HZW5lcmF0b3IiLCJmZXRjaCIsImNyZWRlbnRpYWxzIiwiY2FjaGUiLCJvayIsImoiLCJqc29uIiwic2F2ZWQiLCJfUmVhY3QkdXNlU3RhdGU1IiwiX1JlYWN0JHVzZVN0YXRlNiIsInNhdmVkT3BlbiIsInNldFNhdmVkT3BlbiIsInNhdmVkUmVmIiwib25Eb2NDbGljayIsImN1cnJlbnQiLCJjb250YWlucyIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJvblNpdGVOYW1lQ2hhbmdlIiwibmV3TmFtZSIsImhpdCIsInNldFZpZXciLCJwaWNrU2F2ZWRMb2MiLCJsb2MiLCJyZW1vdmVTYXZlZExvYyIsIm5leHQiLCJtZXRob2QiLCJoZWFkZXJzIiwiYm9keSIsImNhdGNoIiwiX1JlYWN0JHVzZVN0YXRlNyIsIl9SZWFjdCR1c2VTdGF0ZTgiLCJzZWFyY2hRIiwic2V0U2VhcmNoUSIsIl9SZWFjdCR1c2VTdGF0ZTkiLCJfUmVhY3QkdXNlU3RhdGUwIiwic2VhcmNoSGl0cyIsInNldFNlYXJjaEhpdHMiLCJfUmVhY3QkdXNlU3RhdGUxIiwiX1JlYWN0JHVzZVN0YXRlMTAiLCJzZWFyY2hCdXN5Iiwic2V0U2VhcmNoQnVzeSIsIl9SZWFjdCR1c2VTdGF0ZTExIiwiX1JlYWN0JHVzZVN0YXRlMTIiLCJzZWFyY2hPcGVuIiwic2V0U2VhcmNoT3BlbiIsInNlYXJjaERlYm91bmNlUmVmIiwicnVuU2VhcmNoIiwiX3JlZjkiLCJxIiwidXJsIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiX3giLCJhcHBseSIsImFyZ3VtZW50cyIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJwaWNrU2VhcmNoSGl0IiwiZGlzcGxheV9uYW1lIiwicmV2ZXJzZUdlb2NvZGUiLCJfcmVmMCIsImFkZHJlc3MiLCJ0b3duIiwidmlsbGFnZSIsImhhbWxldCIsImNvdW50eSIsInJlZ2lvbiIsInN0YXRlIiwiY291bnRyeSIsIl94MiIsIl94MyIsIkwiLCJ6b29tQ29udHJvbCIsImF0dHJpYnV0aW9uQ29udHJvbCIsInRpbGVMYXllciIsIm1heFpvb20iLCJhdHRyaWJ1dGlvbiIsImFkZFRvIiwibWFya2VyIiwiZHJhZ2dhYmxlIiwiYmluZFRvb2x0aXAiLCJwZXJtYW5lbnQiLCJhcHBseUxhdExvbiIsIm4iLCJvbiIsImxsIiwiZ2V0TGF0TG5nIiwibG5nIiwic2V0TGF0TG5nIiwibGF0bG5nIiwiaW52YWxpZGF0ZVNpemUiLCJyZW1vdmUiLCJwYW5UbyIsIl9SZWFjdCR1c2VTdGF0ZTEzIiwiX1JlYWN0JHVzZVN0YXRlMTQiLCJnZW9TdGF0ZSIsInNldEdlb1N0YXRlIiwidXNlTXlMb2NhdGlvbiIsIm5hdmlnYXRvciIsImdlb2xvY2F0aW9uIiwiZXJyIiwiZ2V0Q3VycmVudFBvc2l0aW9uIiwicG9zIiwiY29vcmRzIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJtc2ciLCJjb2RlIiwibWVzc2FnZSIsImVuYWJsZUhpZ2hBY2N1cmFjeSIsInRpbWVvdXQiLCJtYXhpbXVtQWdlIiwiX1JlYWN0JHVzZVN0YXRlMTUiLCJfUmVhY3QkdXNlU3RhdGUxNiIsInNhdmVNc2ciLCJzZXRTYXZlTXNnIiwiX3JlZjEiLCJkZWR1cGVkIiwibmV4dFNhdmVkIiwic2xpY2UiLCJwZXJzaXN0ZWQiLCJ3YXJuaW5nIiwiYWN0aXZlIiwiZGVmYXVsdCIsIl9sYXN0V2VhdGhlckxvY2F0aW9uU2F2ZSIsIk1vZGFsU2hlbGwiLCJ0aXRsZSIsInN1YnRpdGxlIiwic2l6ZSIsIm1pbkhlaWdodCIsInJlZiIsIm92ZXJmbG93Iiwib25Gb2N1cyIsInBsYWNlaG9sZGVyIiwib3V0bGluZSIsImgiLCJwbGFjZV9pZCIsImNsYXNzIiwidHJhbnNpdGlvbiIsImlzQWN0aXZlIiwiYWJzIiwicm93S2V5Iiwicm9sZSIsInRhYkluZGV4Iiwib25LZXlEb3duIiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJ0eXBlZCIsImN1ciIsImNvbmZsaWN0IiwiZGlzYWJsZWQiLCJwcm90b2NvbCIsInoiLCJfcmVmMTAiLCJsYW5ncyIsIm5hdGl2ZSIsIkV2ZW50IiwiUExVR0lOX0NPTkZJR19GSUVMRFMiLCJ3ZWF0aGVyIiwib3B0aW9ucyIsImRlZiIsInN3ZWV0X3Nwb3QiLCJnMzYiLCJkaWJ0IiwibGlnaHRpbmciLCJfcmVmMTEiLCJBTEwiLCJkZXNjIiwidmVyIiwidG9nZ2xlIiwiaW5jbHVkZXMiLCJfUmVhY3QkdXNlU3RhdGUxNyIsIl9SZWFjdCR1c2VTdGF0ZTE4IiwiZXhwYW5kZWRJZCIsInNldEV4cGFuZGVkSWQiLCJ1cGRhdGVGaWVsZCIsInBsdWdpbklkIiwiZmllbGRLZXkiLCJmaWVsZHMiLCJmaWVsZFZhbCIsImZpZWxkIiwic3RvcmVkIiwidW5kZWZpbmVkIiwiZXhwYW5kZWQiLCJmIiwibyIsIl9yZWYxMiIsIl9yZWYxMiRhY2NlbnQiLCJfcmVmMTIkc2l6ZSIsImNoaWxkcmVuIiwiY29sb3JNYXAiLCJpbmRpZ28iLCJhbWJlciIsImVtZXJhbGQiLCJwaW5rIiwic2l6ZU1hcCIsIndpZGUiLCJtYXhIZWlnaHQiLCJSZWFjdERPTSIsImNyZWF0ZVJvb3QiLCJnZXRFbGVtZW50QnlJZCIsInJlbmRlciJdLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXR1cC13YWxrL3NldHVwX3dhbGsuanN4Il0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHsgdXNlU3RhdGUsIHVzZU1lbW8gfSA9IFJlYWN0O1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBTVEVQIERFRklOSVRJT05TIOKAlCB0aGUgNCB3YWxrIHBhdGhzIHRoZSB1c2VyIGRlc2NyaWJlZFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuY29uc3QgU1RFUFMgPSBbXG4gICAgLyogV2FsayBvcmRlciBpcyB0aGUgcGVudGFnb24gdHJhdmVyc2FsOiB0b3Ag4oaSIHVwcGVyLXJpZ2h0IOKGkiBsb3dlci1yaWdodCDihpIgbG93ZXItbGVmdCDihpIgdXBwZXItbGVmdC5cbiAgICAgICBMYWJlbHMgaW50ZW50aW9uYWxseSBkcm9wIHRoZSByZWR1bmRhbnQgXCJTZXR0aW5nXCIgc3VmZml4IHNvIHRoZVxuICAgICAgIG1haW4gaGVhZGluZyBpbnNpZGUgZWFjaCBjaXJjbGUgY2FuIHJlbmRlciBpbiBvbmUgbGluZSBhdCBhIGxhcmdlclxuICAgICAgIGZvbnQgd2VpZ2h0LiAqL1xuICAgIHsga2V5Oidwc3knLCAgICAgIGxhYmVsOidQc3kgQ2hhcnQnLCAgICAgICBzdWI6J0dpdm9uaSDCtyBSSCByYW5nZSDCtyBheGlzJywgICAgICAga2luZDoncGFnZScsICBpY29uQ29sb3I6JyM4MThjZjgnLCBhY2NlbnQ6J2luZGlnbycgfSxcbiAgICB7IGtleTonbG9jYXRpb24nLCBsYWJlbDonTG9jYXRpb24nLCAgICAgICAgc3ViOidDaXR5IMK3IGxhdCAvIGxvbmcnLCAgICAgICAgICAgICAga2luZDonbW9kYWwnLCBpY29uQ29sb3I6JyNmYmJmMjQnLCBhY2NlbnQ6J2FtYmVyJyAgfSxcbiAgICB7IGtleTonbGFuZ3VhZ2UnLCBsYWJlbDonTGFuZ3VhZ2UnLCAgICAgICAgc3ViOidFTiDCtyBDUyDCtyBDVCDCtyBKUCDCtyBLTyDCtyDigKYnLCAgICAga2luZDonbW9kYWwnLCBpY29uQ29sb3I6JyMzNGQzOTknLCBhY2NlbnQ6J2VtZXJhbGQnfSxcbiAgICB7IGtleToncGx1Z2lucycsICBsYWJlbDonUGx1Zy1pbicsICAgICAgICAgc3ViOidMaXN0IMK3IHVwbG9hZCDCtyBtb2RpZnknLCAgICAgICAgIGtpbmQ6J21vZGFsJywgaWNvbkNvbG9yOicjZjQ3MmI2JywgYWNjZW50OidwaW5rJyAgIH0sXG4gICAgeyBrZXk6J3JlcGFpcicsICAgbGFiZWw6J1VwZGF0ZSAmIFJlcGFpcicsIHN1YjonUGx1Zy1pbiBmbGFzaCDCtyBjb250cm9sbGVyIE9UQScsIGtpbmQ6J2xpbmsnLCBpY29uQ29sb3I6JyNmYjcxODUnLCBhY2NlbnQ6J3Jvc2UnLCBocmVmOicvdXBkYXRlLmh0bWw/ZnJvbT1zZXR1cCcgfSxcbl07XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFJPT1QgQVBQXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5mdW5jdGlvbiBBcHAoKSB7XG4gICAgLyogY29tcGxldGlvbiArIHBlci1zdGVwIGNvbmZpZyAtLSBtb2NrdXAgc3RhdGUsIG5ldmVyIHBlcnNpc3RlZCAqL1xuICAgIGNvbnN0IFtkb25lLCBzZXREb25lXSA9IHVzZVN0YXRlKHsgcHN5OmZhbHNlLCBsb2NhdGlvbjpmYWxzZSwgbGFuZ3VhZ2U6ZmFsc2UsIHBsdWdpbnM6ZmFsc2UsIHJlcGFpcjpmYWxzZSB9KTtcbiAgICBjb25zdCBbcm91dGUsIHNldFJvdXRlXSA9IHVzZVN0YXRlKCdodWInKTsgICAvLyAnaHViJyB8ICdwc3knXG4gICAgY29uc3QgW21vZGFsLCBzZXRNb2RhbF0gPSB1c2VTdGF0ZShudWxsKTsgICAgIC8vICdsb2NhdGlvbicgfCAnbGFuZ3VhZ2UnIHwgJ3BsdWdpbnMnIHwgbnVsbFxuXG4gICAgY29uc3QgW3BzeUNmZywgc2V0UHN5Q2ZnXSAgICAgICAgID0gdXNlU3RhdGUoeyBnaXZvbmk6dHJ1ZSwgcmhQcmVzZXQ6J29mZmljZScsIHJoTG86MzAsIHJoSGk6NjAsIHRMbzotMTUsIHRIaTo1MCwgdGhlbWU6J2RhcmsnLCBkYXJrTGV2ZWw6Mi4wIH0pO1xuICAgIGNvbnN0IFtsb2NDZmcsIHNldExvY0NmZ10gICAgICAgICA9IHVzZVN0YXRlKHsgc2l0ZU5hbWU6J015IEJ1aWxkaW5nJywgY2l0eTonVG9yb250bywgT04nLCBsYXQ6NDMuNjUzMiwgbG9uOi03OS4zODMyIH0pO1xuICAgIGNvbnN0IFtsYW5nQ2ZnLCBzZXRMYW5nQ2ZnXSAgICAgICA9IHVzZVN0YXRlKCgpID0+IHtcbiAgICAgICAgLyogTGF6eSBpbml0IGZyb20gdGhlIHNhbWUgbG9jYWxTdG9yYWdlIGtleSB0aGUgZGFzaGJvYXJkIHJlYWRzLCBzb1xuICAgICAgICAgKiByZW9wZW5pbmcgdGhlIHNldHVwIHdhbGsgc2hvd3MgdGhlIGN1cnJlbnRseS1hY3RpdmUgbGFuZ3VhZ2VcbiAgICAgICAgICogcmF0aGVyIHRoYW4gYWx3YXlzIGRlZmF1bHRpbmcgdG8gRW5nbGlzaC4gKi9cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHYgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnaTE4bl9sYW5nJyk7XG4gICAgICAgICAgICBjb25zdCBhbGxvd2VkID0gWydlbicsJ3poLUNOJywnemgtVFcnLCdqYScsJ2tvJ107XG4gICAgICAgICAgICBpZiAodiAmJiBhbGxvd2VkLmluZGV4T2YodikgIT09IC0xKSByZXR1cm4geyBsYW5nOiB2IH07XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogcHJpdmF0ZSBtb2RlIC0+IGZhbGwgdGhyb3VnaCAqLyB9XG4gICAgICAgIHJldHVybiB7IGxhbmc6J2VuJyB9O1xuICAgIH0pO1xuICAgIGNvbnN0IFtwbHVnaW5DZmcsIHNldFBsdWdpbkNmZ10gICA9IHVzZVN0YXRlKHsgZW5hYmxlZDpbJ3dlYXRoZXInLCdnaXZvbmknLCdzd2VldF9zcG90J10gfSk7XG5cbiAgICBjb25zdCBjb21wbGV0ZUNvdW50ID0gT2JqZWN0LnZhbHVlcyhkb25lKS5maWx0ZXIoQm9vbGVhbikubGVuZ3RoO1xuXG4gICAgY29uc3QgZmluaXNoID0gKGtleSkgPT4ge1xuICAgICAgICBzZXREb25lKGQgPT4gKHsuLi5kLCBba2V5XTp0cnVlfSkpO1xuICAgICAgICBzZXRSb3V0ZSgnaHViJyk7XG4gICAgICAgIHNldE1vZGFsKG51bGwpO1xuICAgIH07XG5cbiAgICAvKiBmdWxsLXBhZ2UgUHN5IENoYXJ0IGVkaXRvciAqL1xuICAgIGlmIChyb3V0ZSA9PT0gJ3BzeScpIHtcbiAgICAgICAgcmV0dXJuIDxQc3lDaGFydFNldHRpbmdQYWdlIGNmZz17cHN5Q2ZnfSBzZXRDZmc9e3NldFBzeUNmZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQmFjaz17KCkgPT4gc2V0Um91dGUoJ2h1YicpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXsoKSA9PiBmaW5pc2goJ3BzeScpfSAvPjtcbiAgICB9XG5cbiAgICAvKiBkZWZhdWx0OiBIVUIgc2NyZWVuICovXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtaW4taC1zY3JlZW4gcHgtNiBweS04XCI+XG4gICAgICAgICAgICB7LyogLS0tLS0tLS0tLS0tLSBoZWFkZXIgLS0tLS0tLS0tLS0tLSAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctNXhsIG14LWF1dG8gZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIG1iLTEwIGZhZGUtdXBcIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwidGV4dC0yeGwgc206dGV4dC0zeGwgZm9udC1ibGFjayBpdGFsaWMgdXBwZXJjYXNlIHRyYWNraW5nLXRpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXJlZC01MDBcIj5SZWQ1PC9zcGFuPiA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlXCI+U3R1ZGlvPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgZm9udC1ub3JtYWwgaXRhbGljXCI+ICZuYnNwOy8mbmJzcDsgc2V0dXAgd2Fsazwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9oMT5cbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgdGV4dC14cyBtdC0xIGZvbnQtbW9ubyB0cmFja2luZy13aWRlXCI+Q29uZmlndXJlIG9uY2UuIFNraXAgYW55IHN0ZXAgeW91IGRvbid0IG5lZWQuPC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIi9kYXNoYm9hcmQuaHRtbFwiXG4gICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHsgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDUuc2V0dXAuZG9uZScsJzEnKTsgfSBjYXRjaChlKXt9IH19XG4gICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS01MDAgaG92ZXI6dGV4dC1zbGF0ZS0zMDAgdW5kZXJsaW5lIHVuZGVybGluZS1vZmZzZXQtNFwiPlNraXAgYWxsIOKGkjwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogLS0tLS0tLS0tLS0tLSBwZW50YWdvbiBsYXlvdXQgLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgIDUgY2lyY3VsYXIgdGlsZXMgYXJyYW5nZWQgYXQgdGhlIGNvcm5lcnMgb2YgYSByZWd1bGFyXG4gICAgICAgICAgICAgICAgcGVudGFnb24uICBQb2xhciBtYXRoczogYW5nbGUgc3RhcnRzIGF0IC05MGRlZyAodG9wKSBhbmRcbiAgICAgICAgICAgICAgICBzdGVwcyBieSArNzJkZWcgY2xvY2t3aXNlLiAgVGhlIGNvbnRhaW5lciBpcyBoZWlnaHQtbG9ja2VkXG4gICAgICAgICAgICAgICAgdmlhIGFzcGVjdCByYXRpbyBzbyB0aGUgcGVudGFnb24gc3RheXMgY2lyY3VsYXIgb24gZXZlcnlcbiAgICAgICAgICAgICAgICB2aWV3cG9ydC4gIFJhZGl1cyBpcyA0MCAlIG9mIHRoZSBjb250YWluZXIgaGFsZi1zaWRlLCBjaXJjbGVcbiAgICAgICAgICAgICAgICBkaWFtZXRlciB+MjcgJSBvZiB0aGUgY29udGFpbmVyIHdpZHRoIC0tIGdpdmVzIGEgY2xlYXJseVxuICAgICAgICAgICAgICAgIHZpc2libGUgZ2FwICh+MjggJSBvZiBjb250YWluZXIgd2lkdGgpIGJldHdlZW4gYWRqYWNlbnRcbiAgICAgICAgICAgICAgICBjaXJjbGVzIHJlZ2FyZGxlc3Mgb2Ygc2NyZWVuIHNpemUuICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBteC1hdXRvIGZhZGUtdXBcIlxuICAgICAgICAgICAgICAgICBzdHlsZT17eyB3aWR0aDonbWluKDc2MHB4LCA5MnZ3KScsIGFzcGVjdFJhdGlvOicxIC8gMScsIGFuaW1hdGlvbkRlbGF5OicuMDhzJyB9fT5cblxuICAgICAgICAgICAgICAgIHsvKiBCYWNrZ3JvdW5kIHBzeS1jaGFydCBsYXllciAtLSBzaXplZCB0byBmaWxsIHRoZSBjb25zdGVsbGF0aW9uXG4gICAgICAgICAgICAgICAgICAgIGNpcmNsZSAofjc4ICUgb2YgY29udGFpbmVyID0ganVzdCBpbnNpZGUgdGhlIGNvbnN0ZWxsYXRpb25cbiAgICAgICAgICAgICAgICAgICAgYXJjIHRoYXQgam9pbnMgdGhlIDUgdGlsZSBjZW50cmVzKS4gIFJlbmRlcmVkIEZJUlNUIHNvIHRoZVxuICAgICAgICAgICAgICAgICAgICA1IHRpbGUgY2lyY2xlcyAobmV4dCBpbiBET00pIHNpdCBvbiB0b3AgYW5kIG9ic2N1cmUgdGhlXG4gICAgICAgICAgICAgICAgICAgIHBvcnRpb24gb2YgdGhlIGNoYXJ0IHRoYXQgb3ZlcmxhcHMgdGhlbS4gIFRoYXQgZ2l2ZXMgdGhlXG4gICAgICAgICAgICAgICAgICAgIFwiaW1hZ2UgcmVjZWRlcyBiZWhpbmQgdGhlIDUgY2lyY2xlc1wiIGVmZmVjdC4gKi99XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBsZWZ0LTEvMiB0b3AtMS8yIC10cmFuc2xhdGUteC0xLzIgLXRyYW5zbGF0ZS15LTEvMiBwb2ludGVyLWV2ZW50cy1ub25lIG92ZXJmbG93LWhpZGRlbiByb3VuZGVkLWZ1bGxcIlxuICAgICAgICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7d2lkdGg6Jzc4JScsIGFzcGVjdFJhdGlvOicxLzEnfX0+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiL2FwaS9hc3NldHMvaW1nL3BzeV9zaWxob3VldHRlLmpwZ1wiIGFsdD1cIlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMCB3LWZ1bGwgaC1mdWxsIG9iamVjdC1jb3ZlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tvcGFjaXR5OjAuNzh9fSAvPlxuICAgICAgICAgICAgICAgICAgICB7LyogRGFyayB2aWduZXR0ZSAvIGxlbnMgLS0gcHVsbHMgdGhlIGNlbnRyZSBkb3duIHNvIHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgTi81IERPTkUgY291bnRlciB0aGF0IGxpdmVzIE9OIFRPUCBzdGF5cyByZWFkYWJsZS4gKi99XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOidyYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IGNlbnRlciwgcmdiYSgyLDYsMjMsMC42MCkgMCUsIHJnYmEoMiw2LDIzLDAuMzUpIDU1JSwgcmdiYSgyLDYsMjMsMC4xMCkgMTAwJSknfX0vPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAge1NURVBTLm1hcCgocywgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmdsZURlZyA9IC05MCArIGkgKiA3MjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5nbGUgPSBhbmdsZURlZyAqIE1hdGguUEkgLyAxODA7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHIgPSA0MDsgICAgICAgICAgICAgICAgICAgICAgICAvLyAlIG9mIGNvbnRhaW5lciBoYWxmLXNpZGVcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeCA9IDUwICsgciAqIE1hdGguY29zKGFuZ2xlKTsgIC8vICVcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeSA9IDUwICsgciAqIE1hdGguc2luKGFuZ2xlKTsgIC8vICVcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDaXJjbGVUaWxlIGtleT17cy5rZXl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGVwPXtzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZT17ZG9uZVtzLmtleV19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleD17aSsxfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdFBjdD17eH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcFBjdD17eX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocy5raW5kID09PSAncGFnZScpICAgICAgc2V0Um91dGUocy5rZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHMua2luZCA9PT0gJ2xpbmsnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNhbWUtdGFiIG5hdiBzbyB0aGUgcmV0dXJuIGJhZGdlIG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZS5odG1sIGNhbiBzaW1wbHkgd2luZG93LmxvY2F0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2sgaGVyZSB3aGVuIHRoZSBvcGVyYXRvciBpcyBkb25lLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHMuaHJlZjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgICAgICAgICAgICAgICAgICAgICAgc2V0TW9kYWwocy5rZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICB7LyogRGVjb3JhdGl2ZSByaW5nOiBhIHNpbmdsZSBjaXJjbGUgd2hvc2UgY2VudHJlIGNvaW5jaWRlc1xuICAgICAgICAgICAgICAgICAgICB3aXRoIHRoZSBjZW50cmUgb2YgdGhlIHBlbnRhZ29uIGFuZCB3aG9zZSByYWRpdXMgZXF1YWxzXG4gICAgICAgICAgICAgICAgICAgIHRoZSBwZW50YWdvbiB2ZXJ0ZXggcmFkaXVzIC0tIGl0cyBib3VuZGFyeSBwYXNzZXNcbiAgICAgICAgICAgICAgICAgICAgY2xlYW5seSB0aHJvdWdoIHRoZSBjZW50cmUgb2YgZWFjaCB0aWxlLiAgVGhlIG1hc2tcbiAgICAgICAgICAgICAgICAgICAgY3V0cyBvdXQgdGhlIGRpc2sgb2YgZXZlcnkgdGlsZSBjaXJjbGUgc28gdGhlIHJpbmcgaXNcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJsZSBPTkxZIGluIHRoZSBnYXBzIGJldHdlZW4gdGlsZXMsIG5ldmVyIGNyb3NzaW5nXG4gICAgICAgICAgICAgICAgICAgIGEgdGlsZSBpbnRlcmlvci4gKi99XG4gICAgICAgICAgICAgICAgPHN2ZyBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC0wIHctZnVsbCBoLWZ1bGwgcG9pbnRlci1ldmVudHMtbm9uZVwiXG4gICAgICAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDEwMCAxMDBcIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPVwibm9uZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGVmcz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxtYXNrIGlkPVwicGVudGFnb24tcmluZy1tYXNrXCIgbWFza1VuaXRzPVwidXNlclNwYWNlT25Vc2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeD1cIjBcIiB5PVwiMFwiIHdpZHRoPVwiMTAwXCIgaGVpZ2h0PVwiMTAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3QgeD1cIjBcIiB5PVwiMFwiIHdpZHRoPVwiMTAwXCIgaGVpZ2h0PVwiMTAwXCIgZmlsbD1cIndoaXRlXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7U1RFUFMubWFwKChfLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGEgPSAoLTkwICsgaSAqIDcyKSAqIE1hdGguUEkgLyAxODA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGN4ID0gNTAgKyA0MCAqIE1hdGguY29zKGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjeSA9IDUwICsgNDAgKiBNYXRoLnNpbihhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogMTcuNSAlIHJhZGl1cyA9IHNhbWUgYXMgdGhlIHRpbGUgY2lyY2xlJ3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFsZi13aWR0aCAoMzUgJSBkaWFtZXRlcik7ICswLjUgJSBudWRnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZWVwcyB0aGUgbWFzayBlZGdlIGluc2lkZSB0aGUgY29sb3VyZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmluZyBzbyB0aGUgd2hpdGUgYXJjIGRvZXNuJ3QgQUxNT1NULXRvdWNoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSByaW5nIGJvcmRlciB3aXRoIGFudGktYWxpYXNlZCBmcmluZ2UuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiA8Y2lyY2xlIGtleT17aX0gY3g9e2N4fSBjeT17Y3l9IHI9XCIxOFwiIGZpbGw9XCJibGFja1wiIC8+O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9tYXNrPlxuICAgICAgICAgICAgICAgICAgICA8L2RlZnM+XG4gICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgY3g9XCI1MFwiIGN5PVwiNTBcIiByPVwiNDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCJyZ2JhKDI1NSwyNTUsMjU1LDAuODUpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2VXaWR0aD1cIjAuNTZcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hc2s9XCJ1cmwoI3BlbnRhZ29uLXJpbmctbWFzaylcIiAvPlxuICAgICAgICAgICAgICAgIDwvc3ZnPlxuXG4gICAgICAgICAgICAgICAgey8qIENlbnRyZWQgY29tcGxldGlvbiBjb3VudGVyIC0tIHNpdHMgYXQgdGhlIGNlbnRyb2lkIG9mIHRoZVxuICAgICAgICAgICAgICAgICAgICBwZW50YWdvbiwgZm9udCB3ZWlnaHQgbWF0Y2hlZCB0byB0aGUgcGVyLXRpbGUgaGVhZGluZyBzbyB0aGVcbiAgICAgICAgICAgICAgICAgICAgZXllIHJlYWRzIGl0IGFzIHRoZSBkb21pbmFudCBzdGF0dXMuICBSZW5kZXJlZCBMQVNUIHNvIGl0XG4gICAgICAgICAgICAgICAgICAgIHNpdHMgb24gdG9wIG9mIGJvdGggdGhlIHBzeS1jaGFydCBzaWxob3VldHRlIGFuZCB0aGUgdGlsZVxuICAgICAgICAgICAgICAgICAgICBjaXJjbGVzLiAqL31cbiAgICAgICAgICAgICAgICB7LyogTi81IERPTkUgdGV4dCAtLSBvd24gYWJzb2x1dGUgbGF5ZXIgcmVuZGVyZWQgQUZURVIgdGhlXG4gICAgICAgICAgICAgICAgICAgIHRpbGUgY2lyY2xlcyBzbyBpdCBhbHdheXMgc2l0cyBvbiB0b3AuICovfVxuICAgICAgICAgICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJzZXR1cC1wcm9ncmVzcy1jZW50ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgbGVmdC0xLzIgdG9wLTEvMiAtdHJhbnNsYXRlLXgtMS8yIC10cmFuc2xhdGUteS0xLzIgdGV4dC1jZW50ZXIgcG9pbnRlci1ldmVudHMtbm9uZSBzZWxlY3Qtbm9uZVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YHRleHQtWzIycHhdIHNtOnRleHQtWzI2cHhdIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXRpZ2h0IHdoaXRlc3BhY2Utbm93cmFwIGxlYWRpbmctbm9uZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Y29tcGxldGVDb3VudCA9PT0gNSA/ICd0ZXh0LWVtZXJhbGQtNDAwJyA6ICd0ZXh0LXdoaXRlJ31gfVxuICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7dGV4dFNoYWRvdzonMCAycHggMTJweCByZ2JhKDIsNiwyMywwLjg1KSwgMCAwIDRweCByZ2JhKDIsNiwyMywwLjg1KSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZUNvdW50fS81XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHNtOnRleHQtWzExcHhdIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLVswLjNlbV0gdGV4dC1zbGF0ZS0zMDAgbXQtMlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3t0ZXh0U2hhZG93OicwIDFweCA2cHggcmdiYSgyLDYsMjMsMC44NSknfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICBEb25lXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiAtLS0tLS0tLS0tLS0tIGZvb3RlciBDVEEgLS0tLS0tLS0tLS0tLSAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctNXhsIG14LWF1dG8gbXQtMTAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIGZhZGUtdXBcIiBzdHlsZT17e2FuaW1hdGlvbkRlbGF5OicuMThzJ319PlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNTAwIHRleHQteHMgZm9udC1tb25vXCI+XG4gICAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZUNvdW50ID09PSAwICYmICfihpEgUGljayBhIHNldHRpbmcgdG8gc3RhcnQsIG9yIHNraXAgYWxsIGFuZCBnbyBzdHJhaWdodCB0byB0aGUgZGFzaGJvYXJkLid9XG4gICAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZUNvdW50ID4gMCAmJiBjb21wbGV0ZUNvdW50IDwgNSAmJiBg4oaRICR7NSAtIGNvbXBsZXRlQ291bnR9IHN0ZXAkezUgLSBjb21wbGV0ZUNvdW50ID09PSAxID8gJycgOiAncyd9IHJlbWFpbmluZyAob3B0aW9uYWwpLmB9XG4gICAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZUNvdW50ID09PSA1ICYmICfinJMgQWxsIHN0ZXBzIGNvbmZpZ3VyZWQuICBSZWFkeSB3aGVuIHlvdSBhcmUuJ31cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cIi9kYXNoYm9hcmQuaHRtbFwiXG4gICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4geyB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS5zZXR1cC5kb25lJywnMScpOyB9IGNhdGNoKGUpe30gfX1cbiAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweC03IHB5LTMgcm91bmRlZC14bCB0ZXh0LXNtIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjb21wbGV0ZUNvdW50ID09PSA1XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctZW1lcmFsZC02MDAgaG92ZXI6YmctZW1lcmFsZC01MDAgdGV4dC13aGl0ZSBzaGFkb3ctbGcgc2hhZG93LWVtZXJhbGQtNTAwLzMwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLWluZGlnby02MDAgaG92ZXI6YmctaW5kaWdvLTUwMCB0ZXh0LXdoaXRlIHNoYWRvdy1sZyBzaGFkb3ctaW5kaWdvLTUwMC8yMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgIE9wZW4gRGFzaGJvYXJkIOKGklxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogLS0tLS0tLS0tLS0tLSBtb2RhbHMgLS0tLS0tLS0tLS0tLSAqL31cbiAgICAgICAgICAgIHttb2RhbCA9PT0gJ2xvY2F0aW9uJyAmJiA8TG9jYXRpb25Nb2RhbCBjZmc9e2xvY0NmZ30gc2V0Q2ZnPXtzZXRMb2NDZmd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRNb2RhbChudWxsKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2F2ZT17KCkgPT4gZmluaXNoKCdsb2NhdGlvbicpfSAvPn1cbiAgICAgICAgICAgIHttb2RhbCA9PT0gJ2xhbmd1YWdlJyAmJiA8TGFuZ3VhZ2VNb2RhbCBjZmc9e2xhbmdDZmd9IHNldENmZz17c2V0TGFuZ0NmZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldE1vZGFsKG51bGwpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXsoKSA9PiBmaW5pc2goJ2xhbmd1YWdlJyl9IC8+fVxuICAgICAgICAgICAge21vZGFsID09PSAncGx1Z2lucycgICYmIDxQbHVnaW5zTW9kYWwgIGNmZz17cGx1Z2luQ2ZnfSBzZXRDZmc9e3NldFBsdWdpbkNmZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldE1vZGFsKG51bGwpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXsoKSA9PiBmaW5pc2goJ3BsdWdpbnMnKX0gLz59XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFRpbGUgKGxhcmdlIGVhc3ktb24tZXllcyBidXR0b24pIC0tIGtlcHQgZm9yIGJhY2stY29tcGF0LCBubyBsb25nZXIgdXNlZFxuICogYnkgdGhlIHBlbnRhZ29uIGh1Yi5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIFRpbGUoeyBzdGVwLCBkb25lLCBpbmRleCwgb25DbGljayB9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgc2V0dXAtdGlsZS0ke3N0ZXAua2V5fWB9XG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17YE9wZW4gJHtzdGVwLmxhYmVsfWB9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdGlsZS1idG4gcmVsYXRpdmUgdGV4dC1sZWZ0IGJnLXNsYXRlLTkwMC83MCBib3JkZXItMiBib3JkZXItc2xhdGUtNzAwLzcwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91bmRlZC0yeGwgcC02IHNtOnAtNyAke2RvbmUgPyAnZG9uZScgOiAnJ31gfT5cbiAgICAgICAgICAgIHtkb25lICYmIDxzcGFuIGNsYXNzTmFtZT1cImNoZWNrXCIgZGF0YS10ZXN0aWQ9e2BzZXR1cC10aWxlLSR7c3RlcC5rZXl9LWRvbmVgfT7inJM8L3NwYW4+fVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtNCBtYi0zXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTEyIGgtMTIgcm91bmRlZC14bCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiXG4gICAgICAgICAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6YCR7c3RlcC5pY29uQ29sb3J9MjJgLCBib3JkZXI6YDFweCBzb2xpZCAke3N0ZXAuaWNvbkNvbG9yfTU1YH19PlxuICAgICAgICAgICAgICAgICAgICA8VGlsZUljb24ga2luZD17c3RlcC5rZXl9IGNvbG9yPXtzdGVwLmljb25Db2xvcn0gLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtM3hsIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS03MDBcIj4we2luZGV4fTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1sZyBzbTp0ZXh0LXhsIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVyIG1iLTFcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7Y29sb3I6c3RlcC5pY29uQ29sb3J9fT57c3RlcC5sYWJlbH08L2gzPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS00MDAgdGV4dC1zbSBsZWFkaW5nLXNudWdcIj57c3RlcC5zdWJ9PC9wPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC00IGZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicGlsbCBiZy1zbGF0ZS04MDAgdGV4dC1zbGF0ZS00MDBcIj57c3RlcC5raW5kID09PSAncGFnZScgPyAnRnVsbCBwYWdlJyA6ICdQb3B1cCd9PC9zcGFuPlxuICAgICAgICAgICAgICAgIHtkb25lICYmIDxzcGFuIGNsYXNzTmFtZT1cInBpbGwgYmctZW1lcmFsZC05MDAvNDAgdGV4dC1lbWVyYWxkLTQwMFwiPkNvbmZpZ3VyZWQ8L3NwYW4+fVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENpcmNsZVRpbGUgLS0gcGVudGFnb24tY29ybmVyIHJvdW5kIGJ1dHRvbi4gIFNpemVkIGluICUgb2YgaXRzIGNvbnRhaW5lclxuICogc28gdGhlIHdob2xlIGxheW91dCBzY2FsZXMgd2l0aCB2aWV3cG9ydC4gIEVhY2ggY2lyY2xlIGlzIGFuY2hvcmVkIGJ5IGl0c1xuICogY2VudHJlICh0cmFuc2xhdGUgLTUwJS8tNTAlKSBvbiB0aGUgcG9sYXItY29tcHV0ZWQgKGxlZnQlLCB0b3AlKS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIENpcmNsZVRpbGUoeyBzdGVwLCBkb25lLCBpbmRleCwgbGVmdFBjdCwgdG9wUGN0LCBvbkNsaWNrIH0pIHtcbiAgICAvKiBUaGljayBjb2xvdXJlZCByaW5nIHBlciB0aWxlIC0tIGVhY2ggc3RlcCBrZWVwcyBpdHMgYWNjZW50IGNvbG91clxuICAgICAqIChpbmRpZ28vYW1iZXIvZW1lcmFsZC9waW5rL3Jvc2UpLCByZWluZm9yY2luZyB0aGUgY29sb3VyLWNvZGVkIFNWR1xuICAgICAqIGljb24gYW5kIHRoZSBoZWFkaW5nIHRleHQuICovXG4gICAgY29uc3QgcmluZ0NvbG9yID0gc3RlcC5pY29uQ29sb3I7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgc2V0dXAtdGlsZS0ke3N0ZXAua2V5fWB9XG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17YE9wZW4gJHtzdGVwLmxhYmVsfWB9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgY2lyY2xlLXRpbGUgZ3JvdXAgYWJzb2x1dGUgcm91bmRlZC1mdWxsIHRleHQtY2VudGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi0yMDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2RvbmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctc2xhdGUtOTAwIHNoYWRvdy1bMF8wXzMwcHhfLTZweF9yZ2JhKDE2LDE4NSwxMjksMC41NSldJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1zbGF0ZS05MDAgaG92ZXI6Ymctc2xhdGUtODAwJ31gfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6YCR7bGVmdFBjdH0lYCwgdG9wOmAke3RvcFBjdH0lYCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6J21pbigzNSUsIDI2MHB4KScsIGFzcGVjdFJhdGlvOicxLzEnLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06J3RyYW5zbGF0ZSgtNTAlLCAtNTAlKScsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlcjpgMTBweCBzb2xpZCAke3JpbmdDb2xvcn1gLFxuICAgICAgICAgICAgICAgICAgICBib3hTaGFkb3c6YDAgMCAwIDFweCAke3JpbmdDb2xvcn0zMywgMCA4cHggMjhweCAtOHB4ICR7cmluZ0NvbG9yfTU1YCxcbiAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHtkb25lICYmIChcbiAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLXRlc3RpZD17YHNldHVwLXRpbGUtJHtzdGVwLmtleX0tZG9uZWB9XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgLXRvcC0xIC1yaWdodC0xIHctNiBoLTYgcm91bmRlZC1mdWxsIGJnLWVtZXJhbGQtNTAwIHRleHQtd2hpdGUgdGV4dC14cyBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBmb250LWJvbGQgc2hhZG93XCI+XG4gICAgICAgICAgICAgICAgICAgIOKck1xuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdW5kZWQteGwgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgbWItMVwiXG4gICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiczNCUnLCBhc3BlY3RSYXRpbzonMS8xJyxcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDpgJHtzdGVwLmljb25Db2xvcn0yMmAsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlcjpgMXB4IHNvbGlkICR7c3RlcC5pY29uQ29sb3J9NTVgLFxuICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICA8VGlsZUljb24ga2luZD17c3RlcC5rZXl9IGNvbG9yPXtzdGVwLmljb25Db2xvcn0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSBmb250LWJsYWNrIHRleHQtc2xhdGUtNjAwIHRyYWNraW5nLXdpZGVyXCI+MHtpbmRleH08L2Rpdj5cbiAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LVsyMnB4XSBzbTp0ZXh0LVsyNnB4XSBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy10aWdodCB3aGl0ZXNwYWNlLW5vd3JhcCBsZWFkaW5nLW5vbmUgbXQtMS41XCJcbiAgICAgICAgICAgICAgICBzdHlsZT17e2NvbG9yOnN0ZXAuaWNvbkNvbG9yfX0+XG4gICAgICAgICAgICAgICAge3N0ZXAubGFiZWx9XG4gICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgdGV4dC1bMTBweF0gc206dGV4dC1bMTFweF0gbGVhZGluZy1zbnVnIHB4LTMgbXQtMSBsaW5lLWNsYW1wLTJcIj5cbiAgICAgICAgICAgICAgICB7c3RlcC5zdWJ9XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICk7XG59XG5cbmZ1bmN0aW9uIFRpbGVJY29uKHsga2luZCwgY29sb3IgfSkge1xuICAgIC8qIHNpbXBsZSBpbmxpbmUgU1ZHcyBzbyB3ZSBrZWVwIHRoZSBmaWxlIHNlbGYtY29udGFpbmVkICovXG4gICAgY29uc3Qgc3Ryb2tlID0geyBzdHJva2U6Y29sb3IsIGZpbGw6J25vbmUnLCBzdHJva2VXaWR0aDoyLCBzdHJva2VMaW5lY2FwOidyb3VuZCcsIHN0cm9rZUxpbmVqb2luOidyb3VuZCcgfTtcbiAgICBpZiAoa2luZCA9PT0gJ3BzeScpICAgICAgcmV0dXJuIDxzdmcgd2lkdGg9XCIyMlwiIGhlaWdodD1cIjIyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHsuLi5zdHJva2V9PjxwYXRoIGQ9XCJNMyAzdjE4aDE4XCIvPjxwYXRoIGQ9XCJNMyAxN2M0LTEgNy02IDktOXM1LTMgOS0yXCIvPjwvc3ZnPjtcbiAgICBpZiAoa2luZCA9PT0gJ2xvY2F0aW9uJykgcmV0dXJuIDxzdmcgd2lkdGg9XCIyMlwiIGhlaWdodD1cIjIyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHsuLi5zdHJva2V9PjxwYXRoIGQ9XCJNMTIgMjJzLTctNi40LTctMTJhNyA3IDAgMSAxIDE0IDBjMCA1LjYtNyAxMi03IDEyelwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEwXCIgcj1cIjIuNVwiLz48L3N2Zz47XG4gICAgaWYgKGtpbmQgPT09ICdsYW5ndWFnZScpIHJldHVybiA8c3ZnIHdpZHRoPVwiMjJcIiBoZWlnaHQ9XCIyMlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB7Li4uc3Ryb2tlfT48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjlcIi8+PHBhdGggZD1cIk0zIDEyaDE4TTEyIDNhMTQgMTQgMCAwIDEgMCAxOE0xMiAzYTE0IDE0IDAgMCAwIDAgMThcIi8+PC9zdmc+O1xuICAgIGlmIChraW5kID09PSAncGx1Z2lucycpICByZXR1cm4gPHN2ZyB3aWR0aD1cIjIyXCIgaGVpZ2h0PVwiMjJcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgey4uLnN0cm9rZX0+PHBhdGggZD1cIk05IDN2Nk0xNSAzdjZcIi8+PHBhdGggZD1cIk01IDloMTR2NmE0IDQgMCAwIDEtNCA0aC0xdjNNOSAxOXYzXCIvPjwvc3ZnPjtcbiAgICAvKiBVcGRhdGUgJiBSZXBhaXIgLS0gd3JlbmNoICsgdGlueSBnZWFyIGJ1bXAsIHNpZ25hbGxpbmcgXCJ0b29sc1wiICovXG4gICAgaWYgKGtpbmQgPT09ICdyZXBhaXInKSAgIHJldHVybiA8c3ZnIHdpZHRoPVwiMjJcIiBoZWlnaHQ9XCIyMlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB7Li4uc3Ryb2tlfT48cGF0aCBkPVwiTTE0LjcgNi4zYTQgNCAwIDAgMC01LjQgNS40TDMgMThsMyAzIDYuMy02LjNhNCA0IDAgMCAwIDUuNC01LjRsLTIuOCAyLjhMMTMgMTFsLTEuMS0xLjkgMi44LTIuOHpcIi8+PC9zdmc+O1xuICAgIHJldHVybiBudWxsO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBQc3kgQ2hhcnQgU2V0dGluZyAtLSBGVUxMIFBBR0UsIGxpdmUgc2tlbGV0b24gcmVzcG9uZHMgdG8gY29udHJvbHNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIFBzeUNoYXJ0U2V0dGluZ1BhZ2UoeyBjZmcsIHNldENmZywgb25CYWNrLCBvblNhdmUgfSkge1xuICAgIGNvbnN0IHVwZGF0ZSA9IChrLCB2KSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIFtrXTp2fSkpO1xuXG4gICAgLyogT24gbW91bnQ6IGh5ZHJhdGUgZnJvbSB0aGUgU0FNRSBsb2NhbFN0b3JhZ2Uga2V5IHRoZSBkYXNoYm9hcmQgcmVhZHNcbiAgICAgKiAoYHJlZDVfc3dlZXRfc3BvdF9yYW5nZWApIHBsdXMgdGhlIHByZXNldCBpZCAoYHJlZDVfcmhfcHJlc2V0YCkgc29cbiAgICAgKiB0aGUgZHJvcGRvd24gbGFiZWwgc3RheXMgY29uc2lzdGVudCB3aXRoIHRoZSBzbGlkZXIgdmFsdWVzIGFjcm9zc1xuICAgICAqIHJlbG9hZHMuICBJZiB0aGUgb3BlcmF0b3IgaGFzIGFscmVhZHkgdHVuZWQgdGhlIFJIIGJhbmQgb24gdGhlXG4gICAgICogZGFzaGJvYXJkLCB0aGUgc2V0dXAgd2FsayBzdGFydHMgZnJvbSB0aG9zZSB2YWx1ZXMuICovXG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJhdyAgICA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWQ1X3N3ZWV0X3Nwb3RfcmFuZ2UnKTtcbiAgICAgICAgICAgIGNvbnN0IHByZXNldCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWQ1X3JoX3ByZXNldCcpO1xuICAgICAgICAgICAgY29uc3QgcGF0Y2ggID0ge307XG4gICAgICAgICAgICBpZiAocmF3KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcCA9IEpTT04ucGFyc2UocmF3KTtcbiAgICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHAubG8pICYmIE51bWJlci5pc0Zpbml0ZShwLmhpKSAmJiBwLmxvIDwgcC5oaSkge1xuICAgICAgICAgICAgICAgICAgICBwYXRjaC5yaExvID0gcC5sbztcbiAgICAgICAgICAgICAgICAgICAgcGF0Y2gucmhIaSA9IHAuaGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByZXNldCAmJiBSSF9QUkVTRVRTLmZpbmQoeCA9PiB4LmlkID09PSBwcmVzZXQpKSB7XG4gICAgICAgICAgICAgICAgcGF0Y2gucmhQcmVzZXQgPSBwcmVzZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBUaGVtZSArIGJyaWdodG5lc3Mg4oCUIHNhbWUga2V5cyBhcHAuanMgKGRhc2hib2FyZCkgcmVhZHMuICovXG4gICAgICAgICAgICBjb25zdCB0aCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWQ1LnRoZW1lJyk7XG4gICAgICAgICAgICBpZiAodGggPT09ICdsaWdodCcgfHwgdGggPT09ICdkYXJrJykgcGF0Y2gudGhlbWUgPSB0aDtcbiAgICAgICAgICAgIGNvbnN0IGRsID0gcGFyc2VGbG9hdChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVkNS5kYXJrTGV2ZWwnKSk7XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGRsKSAmJiBkbCA+PSAxLjUgJiYgZGwgPD0gMy4wKSBwYXRjaC5kYXJrTGV2ZWwgPSBkbDtcbiAgICAgICAgICAgIC8qIFRlbXBlcmF0dXJlIGF4aXMgcmFuZ2Ug4oCUIHdyaXR0ZW4gYnkgdGhpcyBzYW1lIHBhZ2UncyBzYXZlXG4gICAgICAgICAgICAgKiBoYW5kbGVyOyBsb2FkIGl0IGhlcmUgc28gcmVvcGVuaW5nIHRoZSBzZXR1cCB3YWxrIHNob3dzIHRoZVxuICAgICAgICAgICAgICogY3VycmVudCBkYXNoYm9hcmQgYXhpcyBpbnN0ZWFkIG9mIGFsd2F5cyBkZWZhdWx0aW5nIHRvIC0xNS4uNTAuICovXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRyUmF3ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlZDVfdGVtcF9yYW5nZScpO1xuICAgICAgICAgICAgICAgIGlmICh0clJhdykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ciA9IEpTT04ucGFyc2UodHJSYXcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHRyLm1pbikgJiYgTnVtYmVyLmlzRmluaXRlKHRyLm1heCkgJiYgdHIubWluIDwgdHIubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRjaC50TG8gPSB0ci5taW47XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRjaC50SGkgPSB0ci5tYXg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7IC8qIGlnbm9yZSAqLyB9XG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMocGF0Y2gpLmxlbmd0aCkgc2V0Q2ZnKGMgPT4gKHsuLi5jLCAuLi5wYXRjaH0pKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBpZ25vcmUgKi8gfVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgICB9LCBbXSk7XG5cbiAgICAvKiBPbiBzYXZlOiBwZXJzaXN0IHRoZSBSSCBiYW5kIHRvIGxvY2FsU3RvcmFnZSBzbyB0aGUgZGFzaGJvYXJkJ3NcbiAgICAgKiBzd2VldC1zcG90IHBvbHlnb24gcGlja3MgaXQgdXAgb24gbmV4dCBsb2FkLiAgQWxzbyBwZXJzaXN0IHRoZSB2ZW51ZVxuICAgICAqIHByZXNldCBpZCAoZm9yIGZ1dHVyZSBcInNob3cgcHJlc2V0IG5hbWUgb24gZGFzaGJvYXJkXCIgZmVhdHVyZXMpLiAqL1xuICAgIGNvbnN0IHBlcnNpc3RBbmRTYXZlID0gKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDVfc3dlZXRfc3BvdF9yYW5nZScsXG4gICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoeyBsbzogY2ZnLnJoTG8sIGhpOiBjZmcucmhIaSB9KSk7XG4gICAgICAgICAgICBpZiAoY2ZnLnJoUHJlc2V0KSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDVfcmhfcHJlc2V0JywgY2ZnLnJoUHJlc2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIFRoZW1lICsgYnJpZ2h0bmVzcyDigJQgd3JpdHRlbiB0byB0aGUgU0FNRSBrZXlzIHRoZSBkYXNoYm9hcmRcbiAgICAgICAgICAgICAqIChhcHAuanMgbGluZXMgNTctNTggYW5kIDg0LTk3KSByZWFkcyBhcyBpdHMgdXNlU3RhdGUgbGF6eVxuICAgICAgICAgICAgICogaW5pdGlhbGlzZXIsIHNvIHRoZSBjaG9zZW4gdGhlbWUgdGFrZXMgZWZmZWN0IG9uIG5leHQgZGFzaGJvYXJkXG4gICAgICAgICAgICAgKiBsb2FkLiAgYXBwLmpzIHRyZWF0cyBkYXJrTGV2ZWwgPj0gMy4wIGFzIGxpZ2h0LW1vZGUgdHJpZ2dlci4gKi9cbiAgICAgICAgICAgIGlmIChjZmcudGhlbWUgPT09ICdsaWdodCcgfHwgY2ZnLnRoZW1lID09PSAnZGFyaycpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS50aGVtZScsIGNmZy50aGVtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGNmZy5kYXJrTGV2ZWwpKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDUuZGFya0xldmVsJywgU3RyaW5nKGNmZy5kYXJrTGV2ZWwpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIFRlbXBlcmF0dXJlIGF4aXMgcmFuZ2Ug4oCUIGRyaXZlcyB0aGUgZGFzaGJvYXJkJ3MgcHN5IGNoYXJ0XG4gICAgICAgICAgICAgKiBYIGF4aXMgKGB0ZW1wUmFuZ2UubWluL21heGAgaW4gYXBwLmpzKS4gIFdlIHdyaXRlIHRoZSBzYW1lXG4gICAgICAgICAgICAgKiBzaGFwZSBhcHAuanMgcmVhZHMgKGB7bWluLCBtYXh9YCkgc28gaXRzIGxhenkgdXNlU3RhdGUgaW5pdFxuICAgICAgICAgICAgICogcGlja3MgaXQgdXAgb24gbmV4dCBsb2FkLCBBTkQgZGlzcGF0Y2ggYSBjdXN0b20gZXZlbnQgc29cbiAgICAgICAgICAgICAqIGFueSBvcGVuIGRhc2hib2FyZCB0YWIgdXBkYXRlcyBsaXZlIHdpdGhvdXQgYSByZWZyZXNoLiAqL1xuICAgICAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShjZmcudExvKSAmJiBOdW1iZXIuaXNGaW5pdGUoY2ZnLnRIaSkgJiYgY2ZnLnRMbyA8IGNmZy50SGkpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNV90ZW1wX3JhbmdlJyxcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoeyBtaW46IGNmZy50TG8sIG1heDogY2ZnLnRIaSB9KSk7XG4gICAgICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdyNS10ZW1wLXJhbmdlLWNoYW5nZScsIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7IG1pbjogY2ZnLnRMbywgbWF4OiBjZmcudEhpIH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3I1LXJoLWJhbmQtY2hhbmdlJywge1xuICAgICAgICAgICAgICAgIGRldGFpbDogeyBsbzogY2ZnLnJoTG8sIGhpOiBjZmcucmhIaSB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ1tzZXR1cCB3YWxrXSBwc3kgY2hhcnQgc2F2ZWQgLT4gUkgnLCBjZmcucmhMbywgJy0nLCBjZmcucmhIaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAnJSBULWF4aXMnLCBjZmcudExvLCAnLi4nLCBjZmcudEhpLCAnwrBDIHByZXNldD0nLCBjZmcucmhQcmVzZXQpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1tzZXR1cCB3YWxrXSBjb3VsZCBub3QgcGVyc2lzdCBwc3kgc2V0dGluZ3M6JywgZSk7XG4gICAgICAgIH1cbiAgICAgICAgb25TYXZlKCk7XG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWluLWgtc2NyZWVuIGZsZXggZmxleC1jb2xcIj5cbiAgICAgICAgICAgIHsvKiBoZWFkZXIgKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBweC02IHB5LTQgYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTgwMFwiPlxuICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17b25CYWNrfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS00MDAgaG92ZXI6dGV4dC13aGl0ZSB0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFja1wiPlxuICAgICAgICAgICAgICAgICAgICDihpAgQmFjayB0byBzZXR1cFxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJ0ZXh0LXNtIHVwcGVyY2FzZSB0cmFja2luZy1bMC4zZW1dIGZvbnQtYmxhY2sgdGV4dC1pbmRpZ28tNDAwXCI+UHN5IENoYXJ0IFNldHRpbmc8L2gxPlxuICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17cGVyc2lzdEFuZFNhdmV9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC01IHB5LTIgcm91bmRlZC1sZyBiZy1pbmRpZ28tNjAwIGhvdmVyOmJnLWluZGlnby01MDAgdGV4dC13aGl0ZSB0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFja1wiPlxuICAgICAgICAgICAgICAgICAgICBTYXZlICYgcmV0dXJuIOKck1xuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBib2R5IOKAlCBjaGFydCBsZWZ0LCBjb250cm9scyByaWdodCAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xIGdyaWQgZ3JpZC1jb2xzLTEgbGc6Z3JpZC1jb2xzLVsxZnJfMzYwcHhdIGdhcC00IHAtNiBtYXgtdy03eGwgbXgtYXV0byB3LWZ1bGxcIj5cbiAgICAgICAgICAgICAgICA8UHN5U2tlbGV0b24gY2ZnPXtjZmd9IC8+XG4gICAgICAgICAgICAgICAgPFBzeUNvbnRyb2xQYW5lbCBjZmc9e2NmZ30gdXBkYXRlPXt1cGRhdGV9IHNldENmZz17c2V0Q2ZnfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbi8qIFJIIGJhbmQgcHJlc2V0cyDigJQgcmVjb2duaXNlZCBpbmR1c3RyeSBzdGFuZGFyZHMgZm9yIGVhY2ggdmVudWUgdHlwZS5cbiAqIFNvdXJjZXM6IEFTSFJBRSA1NSAoY29tZm9ydCksIEFTSFJBRSAxNzAgKGhlYWx0aGNhcmUpLFxuICogQUFNL05QUy9TbWl0aHNvbmlhbiBndWlkYW5jZSAoY29sbGVjdGlvbnMpLCBDSUJTRSBUTTQwIChsaWJyYXJpZXMpLiAqL1xuY29uc3QgUkhfUFJFU0VUUyA9IFtcbiAgICB7IGlkOidjdXN0b20nLCAgICAgICAgICBsYWJlbDonQ3VzdG9tIChtYW51YWwpJywgICAgICAgICAgICAgICAgIGxvOm51bGwsIGhpOm51bGwsIG5vdGU6JycgfSxcbiAgICB7IGlkOidvZmZpY2UnLCAgICAgICAgICBsYWJlbDonT2ZmaWNlJywgICAgICAgICAgICAgICAgICAgICAgICAgIGxvOjMwLCAgIGhpOjYwLCAgIG5vdGU6J0FTSFJBRSA1NSBjb21mb3J0JyAgICAgICAgICAgICAgICAgIH0sXG4gICAgeyBpZDonbXVzZXVtJywgICAgICAgICAgbGFiZWw6J011c2V1bScsICAgICAgICAgICAgICAgICAgICAgICAgICBsbzo0MCwgICBoaTo1NSwgICBub3RlOidBQU0gY29sbGVjdGlvbiBwcmVzZXJ2YXRpb24nICAgICAgICB9LFxuICAgIHsgaWQ6J2hvdGVsJywgICAgICAgICAgIGxhYmVsOidIb3RlbCBndWVzdCByb29tJywgICAgICAgICAgICAgICAgbG86MzAsICAgaGk6NjAsICAgbm90ZTonZ2VuZXJhbCBvY2N1cGFudCBjb21mb3J0JyAgICAgICAgICAgfSxcbiAgICB7IGlkOidsaWJyYXJ5JywgICAgICAgICBsYWJlbDonTGlicmFyeSAvIEFyY2hpdmUnLCAgICAgICAgICAgICAgIGxvOjQwLCAgIGhpOjU1LCAgIG5vdGU6J3BhcGVyICYgYmluZGluZyBwcmVzZXJ2YXRpb24nICAgICAgIH0sXG4gICAgeyBpZDonaG9zcGl0YWwnLCAgICAgICAgbGFiZWw6J0hvc3BpdGFsIChnZW5lcmFsKScsICAgICAgICAgICAgICBsbzozMCwgICBoaTo2MCwgICBub3RlOidBU0hSQUUgMTcwIHBhdGllbnQgYXJlYXMnICAgICAgICAgICB9LFxuICAgIHsgaWQ6J2xlY3R1cmUnLCAgICAgICAgIGxhYmVsOidMZWN0dXJlIGhhbGwnLCAgICAgICAgICAgICAgICAgICAgbG86MzAsICAgaGk6NjAsICAgbm90ZTonaGlnaCBvY2N1cGFuY3kgY29tZm9ydCcgICAgICAgICAgICAgfSxcbiAgICB7IGlkOidjb25jZXJ0JywgICAgICAgICBsYWJlbDonQ29uY2VydCBoYWxsJywgICAgICAgICAgICAgICAgICAgIGxvOjQwLCAgIGhpOjU1LCAgIG5vdGU6J2luc3RydW1lbnQgdHVuaW5nIHN0YWJpbGl0eScgICAgICAgIH0sXG4gICAgeyBpZDonbWVldGluZycsICAgICAgICAgbGFiZWw6J01lZXRpbmcgcm9vbScsICAgICAgICAgICAgICAgICAgICBsbzozMCwgICBoaTo2MCwgICBub3RlOidzbWFsbCBncm91cCBjb21mb3J0JyAgICAgICAgICAgICAgICB9LFxuICAgIHsgaWQ6J2V4aGliaXRpb24nLCAgICAgIGxhYmVsOidFeGhpYml0aW9uIGhhbGwnLCAgICAgICAgICAgICAgICAgbG86NDAsICAgaGk6NTUsICAgbm90ZTonbWl4ZWQgYXJ0IC8gYXJ0aWZhY3QgZGlzcGxheScgICAgICAgfSxcbl07XG5cbi8qIFJlYWwgcHN5IGNoYXJ0IOKAlCB1c2VzIHRoZSBTQU1FIGdldFcgKyBHSVZPTklfQ09MT1JTICsgcG9seWdvbiBtYXRoIGFzIHRoZVxuICogcHJvZHVjdGlvbiBkYXNoYm9hcmQuICBTb3VyY2Ugb2YgdHJ1dGg6ICBqcy9wc3ljaHJvbWV0cmljLmpzICBhbmQgdGhlXG4gKiByZW5kZXJHaXZvbmlPdmVybGF5KCkgYmxvY2sgYXQgYXBwLmpzOjE2NDEtMTcyMi5cbiAqIEFueXRoaW5nIHlvdSBjaGFuZ2UgaW4gdGhvc2UgZmlsZXMgTVVTVCBiZSBtaXJyb3JlZCBoZXJlLiAqL1xuZnVuY3Rpb24gUHN5U2tlbGV0b24oeyBjZmcgfSkge1xuICAgIC8qIENhbnZhcyArIHBhZGRpbmcgKi9cbiAgICBjb25zdCBXID0gNzYwLCBIID0gNDgwO1xuICAgIGNvbnN0IHBhZCA9IHsgbGVmdDogNTYsIHJpZ2h0OiA0MCwgdG9wOiAyOCwgYm90dG9tOiA1NiB9O1xuICAgIGNvbnN0IGdyaWRXID0gVyAtIHBhZC5sZWZ0IC0gcGFkLnJpZ2h0O1xuICAgIGNvbnN0IGdyaWRIID0gSCAtIHBhZC50b3AgIC0gcGFkLmJvdHRvbTtcblxuICAgIGNvbnN0IFRfTUlOID0gY2ZnLnRMbywgVF9NQVggPSBjZmcudEhpO1xuICAgIGNvbnN0IFdfTUlOID0gMCwgICAgICAgV19NQVggPSAwLjAzMDsgICAgICAgICAgLy8ga2cva2dcblxuICAgIC8qIGF4aXMgc2NhbGVzIC0tIG1hdGNoIHRoZSBsaXZlIGRhc2hib2FyZCAqL1xuICAgIGNvbnN0IHggID0gKHQpID0+IHBhZC5sZWZ0ICsgKCh0IC0gVF9NSU4pIC8gKFRfTUFYIC0gVF9NSU4pKSAqIGdyaWRXO1xuICAgIGNvbnN0IHkgID0gKHcpID0+IHBhZC50b3AgICsgKDEgLSAodyAtIFdfTUlOKSAvIChXX01BWCAtIFdfTUlOKSkgKiBncmlkSDtcbiAgICBjb25zdCBfZ2V0VyA9ICh0eXBlb2YgZ2V0VyA9PT0gJ2Z1bmN0aW9uJykgPyBnZXRXIDogKCh0LCByaCkgPT4gMCk7XG5cbiAgICBjb25zdCBzYWZlUHRzID0gKGFycikgPT4gYXJyLm1hcChwID0+IGAkeyh4KHBbMF0pfHwwKS50b0ZpeGVkKDIpfSwkeyh5KHBbMV0pfHwwKS50b0ZpeGVkKDIpfWApLmpvaW4oJyAnKTtcblxuICAgIC8qIC0tLS0gR2l2b25pIHBvbHlnb25zIC0tIENPUElFRCBWRVJCQVRJTSBmcm9tIGFwcC5qczoxNjQzLTE2NjkgLS0tLSAqL1xuICAgIGNvbnN0IHJoODAgPSBbXTsgZm9yIChsZXQgdD0yMDsgdDw9MjU7IHQrPTAuNSkgcmg4MC5wdXNoKFt0LCBfZ2V0Vyh0LCA4MCldKTtcbiAgICBjb25zdCByaDEwMD0gW107IGZvciAobGV0IHQ9MjA7IHQ8PTI3OyB0Kz0wLjUpIHJoMTAwLnB1c2goW3QsIF9nZXRXKHQsIDEwMCldKTtcbiAgICBjb25zdCByaDIwTGluZSA9IFtdOyBmb3IgKGxldCB0PTMyOyB0Pj0yMDsgdC09MC41KSByaDIwTGluZS5wdXNoKFt0LCBfZ2V0Vyh0LCAyMCldKTtcbiAgICBjb25zdCByaDIwX0NaICA9IFtdOyBmb3IgKGxldCB0PTI3OyB0Pj0yMDsgdC09MC41KSByaDIwX0NaLnB1c2goW3QsIF9nZXRXKHQsIDIwKV0pO1xuICAgIGNvbnN0IENaICAgPSBbLi4ucmg4MCwgWzI3LCBfZ2V0VygyNywgNTApXSwgWzI3LCBfZ2V0VygyNywgMjApXSwgLi4ucmgyMF9DWl07XG5cbiAgICBjb25zdCByaEhpX3RvcCA9IFtdOyBmb3IgKGxldCB0dD0yMDsgdHQ8PTI3OyB0dCs9MC41KSByaEhpX3RvcC5wdXNoKFt0dCwgX2dldFcodHQsIGNmZy5yaEhpKV0pO1xuICAgIGNvbnN0IHJoTG9fYm90ID0gW107IGZvciAobGV0IHR0PTI3OyB0dD49MjA7IHR0LT0wLjUpIHJoTG9fYm90LnB1c2goW3R0LCBfZ2V0Vyh0dCwgY2ZnLnJoTG8pXSk7XG4gICAgY29uc3QgU1dFRVQgPSBbLi4ucmhIaV90b3AsIC4uLnJoTG9fYm90XTtcblxuICAgIGNvbnN0IE5WICAgPSBbLi4ucmgxMDAsIFszMiwgMTUuNC8xMDAwXSwgWzMyLCA2LjIvMTAwMF0sIC4uLnJoMjBMaW5lXTtcbiAgICBjb25zdCBNYXNzID0gWy4uLnJoODAsIFszMywgMTYvMTAwMF0sIFszNywgX2dldFcoMzcsIDMwKV0sIFszNywgMy8xMDAwXSwgWzIwLCBfZ2V0VygyMCwgMjApXV07XG4gICAgY29uc3QgTUNWICA9IFsuLi5yaDgwLCBbNDAsIDE2LzEwMDBdLCBbNDQsIF9nZXRXKDQ0LCAyMCldLCBbNDQsIDMvMTAwMF0sIFsyMCwgX2dldFcoMjAsIDIwKV1dO1xuICAgIGNvbnN0IEVWQVAgPSBbLi4ucmg4MCwgWzI1LCAxNi8xMDAwXSwgWzM2LCBfZ2V0VygzNiwgMzApXSwgWzM5LCBfZ2V0VygzOSwgMjApXSxcbiAgICAgICAgICAgICAgICAgIFs0MSwgX2dldFcoNDEsIDEwKV0sIFs0MSwgMF0sIFsyNy4yLCAwXSwgWzIwLCBfZ2V0VygyMCwgMjApXV07XG5cbiAgICBjb25zdCB3aW50ZXJSSDgwID0gW107IGZvciAobGV0IHQ9MTg7IHQ8PTE5LjU7IHQrPTAuNSkgd2ludGVyUkg4MC5wdXNoKFt0LCBfZ2V0Vyh0LCA4MCldKTtcbiAgICBjb25zdCB3aW50ZXJSSDIwID0gW107IGZvciAobGV0IHQ9MTkuNTsgdD49MTg7IHQtPTAuNSkgd2ludGVyUkgyMC5wdXNoKFt0LCBfZ2V0Vyh0LCAyMCldKTtcbiAgICBjb25zdCBXSU5URVIgPSBbLi4ud2ludGVyUkg4MCwgLi4ud2ludGVyUkgyMF07XG5cbiAgICAvKiBSSCBpc29wbGV0aCBjdXJ2ZXMgZm9yIHRoZSBjaGFydCBncmlkICovXG4gICAgY29uc3QgaXNvcGxldGhzID0gWzIwLCA0MCwgNjAsIDgwLCAxMDBdO1xuXG4gICAgLyogVGhlbWUgcGFsZXR0ZSDigJQgZHJpdmVzIHRoZSBsaXZlIHByZXZpZXcgc28gdGhlIGRpbS9saWdodCBjb250cm9sc1xuICAgICAqIGhhdmUgdmlzaWJsZSBmZWVkYmFjayByaWdodCBvbiB0aGUgY2hhcnQuICBJbiBkaW0vZGFyayBtb2RlIHdlIGFsc29cbiAgICAgKiBhcHBseSBhIENTUyBicmlnaHRuZXNzIGZpbHRlciBtYXBwZWQgZnJvbSBjZmcuZGFya0xldmVsICgxLjUgLi4gMi44XG4gICAgICog4oaSIDAuNiAuLiAxLjQpIHNvIHRoZSB1c2VyIGNhbiBTRUUgdGhlIGJyaWdodG5lc3Mgc2xpZGVyIHdvcmtpbmcuICovXG4gICAgY29uc3QgaXNMaWdodCA9IGNmZy50aGVtZSA9PT0gJ2xpZ2h0JztcbiAgICBjb25zdCBwYWxldHRlID0gaXNMaWdodFxuICAgICAgICA/IHsgYmc6JyNmOGZhZmMnLCBncmlkOicjY2JkNWUxJywgdGljazonIzQ3NTU2OScsIGF4aXM6JyMxZTI5M2InLFxuICAgICAgICAgICAgcGFuZWxCZzoncmdiYSgyNDgsMjUwLDI1MiwwLjg1KScsIHBhbmVsQm9yZGVyOicjY2JkNWUxJyxcbiAgICAgICAgICAgIHBpbGxCZzonI2UyZThmMCcsIHBpbGxGZzonIzQ3NTU2OScsIG1ldGFGZzonIzY0NzQ4YicgfVxuICAgICAgICA6IHsgYmc6JyMwYjEyMjAnLCBncmlkOicjMWUyOTNiJywgdGljazonIzk0YTNiOCcsIGF4aXM6JyNjYmQ1ZTEnLFxuICAgICAgICAgICAgcGFuZWxCZzoncmdiYSgxNSwyMyw0MiwwLjYpJywgcGFuZWxCb3JkZXI6JyMxZTI5M2InLFxuICAgICAgICAgICAgcGlsbEJnOicjMWUyOTNiJywgcGlsbEZnOicjOTRhM2I4JywgbWV0YUZnOicjNjQ3NDhiJyB9O1xuICAgIGNvbnN0IGRpbUZpbHRlciA9IGlzTGlnaHRcbiAgICAgICAgPyAnbm9uZSdcbiAgICAgICAgOiBgYnJpZ2h0bmVzcygkeyhNYXRoLm1heCgxLjUsIE1hdGgubWluKDIuOCwgY2ZnLmRhcmtMZXZlbCB8fCAyLjApKSAvIDIuMCkudG9GaXhlZCgyKX0pYDtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm91bmRlZC0yeGwgcC00IGJvcmRlciB0cmFuc2l0aW9uLWNvbG9ycyBkdXJhdGlvbi0zMDBcIlxuICAgICAgICAgICAgIHN0eWxlPXt7YmFja2dyb3VuZDogcGFsZXR0ZS5wYW5lbEJnLCBib3JkZXJDb2xvcjogcGFsZXR0ZS5wYW5lbEJvcmRlcn19PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gbWItM1wiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInBpbGxcIiBzdHlsZT17e2JhY2tncm91bmQ6cGFsZXR0ZS5waWxsQmcsIGNvbG9yOnBhbGV0dGUucGlsbEZnfX0+UFNZQ0hST01FVFJJQyBDSEFSVCDCtyBsaXZlIHByZXZpZXc8L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1tb25vXCIgc3R5bGU9e3tjb2xvcjpwYWxldHRlLm1ldGFGZ319PntUX01JTn3CsEMg4oaSIHtUX01BWH3CsEMgIMK3ICB7Y2ZnLnJoTG994oCTe2NmZy5yaEhpfSUgUkg8L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxzdmcgdmlld0JveD17YDAgMCAke1d9ICR7SH1gfSBjbGFzc05hbWU9XCJ3LWZ1bGwgaC1hdXRvIHRyYW5zaXRpb24tW2ZpbHRlcl0gZHVyYXRpb24tMzAwXCJcbiAgICAgICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOiBwYWxldHRlLmJnLCBib3JkZXJSYWRpdXM6OCwgZmlsdGVyOiBkaW1GaWx0ZXJ9fT5cbiAgICAgICAgICAgICAgICB7LyogLS0tLSBncmlkOiB2ZXJ0aWNhbCBUIGxpbmVzLCBob3Jpem9udGFsIFcgbGluZXMgLS0tLSAqL31cbiAgICAgICAgICAgICAgICB7QXJyYXkuZnJvbSh7bGVuZ3RoOjExfSkubWFwKChfLGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdCA9IFRfTUlOICsgKGkvMTApICogKFRfTUFYIC0gVF9NSU4pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGcga2V5PXsndnQnK2l9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXt4KHQpfSB5MT17cGFkLnRvcH0geDI9e3godCl9IHkyPXtwYWQudG9wK2dyaWRIfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT17cGFsZXR0ZS5ncmlkfSBzdHJva2VXaWR0aD1cIjAuNlwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KHQpfSB5PXtwYWQudG9wK2dyaWRIKzE2fSBmb250U2l6ZT1cIjkuNVwiIGZpbGw9e3BhbGV0dGUudGlja31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCI+e3QudG9GaXhlZCgwKX08L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAge0FycmF5LmZyb20oe2xlbmd0aDo3fSkubWFwKChfLGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdyA9IFdfTUlOICsgKGkvNikgKiAoV19NQVggLSBXX01JTik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZyBrZXk9eydodycraX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3BhZC5sZWZ0fSB5MT17eSh3KX0geDI9e3BhZC5sZWZ0K2dyaWRXfSB5Mj17eSh3KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9e3BhbGV0dGUuZ3JpZH0gc3Ryb2tlV2lkdGg9XCIwLjZcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17cGFkLmxlZnQtOH0geT17eSh3KSszfSBmb250U2l6ZT1cIjkuNVwiIGZpbGw9e3BhbGV0dGUudGlja31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwiZW5kXCI+eyh3KjEwMDApLnRvRml4ZWQoMCl9PC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIHsvKiAtLS0tIFJIIGlzb3BsZXRocyAoY3VydmVzKSAtLS0tICovfVxuICAgICAgICAgICAgICAgIHtpc29wbGV0aHMubWFwKHJoID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHRzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHQgPSBUX01JTjsgdCA8PSBUX01BWDsgdCArPSAwLjUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHd3ID0gX2dldFcodCwgcmgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHd3ID49IFdfTUlOICYmIHd3IDw9IFdfTUFYKSBwdHMucHVzaChbdCwgd3ddKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGcga2V5PXsnaXNvJytyaH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlsaW5lIHBvaW50cz17c2FmZVB0cyhwdHMpfSBmaWxsPVwibm9uZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT17cmggPT09IDEwMCA/ICcjNjM2NmYxJyA6ICcjZWM0ODk5NTUnfSBzdHJva2VXaWR0aD1cIjAuOFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZURhc2hhcnJheT17cmggPT09IDEwMCA/ICcnIDogJzMsMyd9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cHRzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KHB0c1tNYXRoLmZsb29yKHB0cy5sZW5ndGgqMC42NSldWzBdKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeT17eShwdHNbTWF0aC5mbG9vcihwdHMubGVuZ3RoKjAuNjUpXVsxXSkgLSA0fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZT1cIjlcIiBmaWxsPVwiI2VjNDg5OTk5XCIgZm9udFdlaWdodD1cIjcwMFwiPntyaH0lPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG5cbiAgICAgICAgICAgICAgICB7LyogLS0tLSBHaXZvbmkgb3ZlcmxheSAoY29waWVkIHZlcmJhdGltIGZyb20gYXBwLmpzIHJlbmRlciBvcmRlcikgLS0tLSAqL31cbiAgICAgICAgICAgICAgICB7Y2ZnLmdpdm9uaSAmJiAoXG4gICAgICAgICAgICAgICAgICAgIDxnIGNsYXNzTmFtZT1cInBvaW50ZXItZXZlbnRzLW5vbmVcIiBvcGFjaXR5PVwiMC45XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17eCg0MCl9IHkxPXt5KDE2LzEwMDApfSB4Mj17eCg1MCl9IHkyPXt5KDE2LzEwMDApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiIzYzNjZmMVwiIHN0cm9rZVdpZHRoPVwiMS41XCIgc3Ryb2tlRGFzaGFycmF5PVwiNCw0XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3goNTApfSB5MT17eSgxNi8xMDAwKX0geDI9e3goNTApfSB5Mj17eSgwKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cIiM2MzY2ZjFcIiBzdHJva2VXaWR0aD1cIjEuNVwiIHN0cm9rZURhc2hhcnJheT1cIjQsNFwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXt4KDQxKX0geTE9e3koMCl9IHgyPXt4KDUwKX0geTI9e3koMCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCIjNjM2NmYxXCIgc3Ryb2tlV2lkdGg9XCIxLjVcIiBzdHJva2VEYXNoYXJyYXk9XCI0LDRcIi8+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhNQ1YpfSAgZmlsbD1cIiNlYzQ4OTlcIiBmaWxsT3BhY2l0eT1cIjAuMDVcIiBzdHJva2U9XCIjZWM0ODk5XCIgc3Ryb2tlV2lkdGg9XCIxXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKE1hc3MpfSBmaWxsPVwiIzhiNWNmNlwiIGZpbGxPcGFjaXR5PVwiMC4wNVwiIHN0cm9rZT1cIiM4YjVjZjZcIiBzdHJva2VXaWR0aD1cIjFcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoRVZBUCl9IGZpbGw9XCIjMDZiNmQ0XCIgZmlsbE9wYWNpdHk9XCIwLjA4XCIgc3Ryb2tlPVwiIzA2YjZkNFwiIHN0cm9rZVdpZHRoPVwiMVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhOVil9ICAgZmlsbD1cIiNmNTllMGJcIiBmaWxsT3BhY2l0eT1cIjAuMDVcIiBzdHJva2U9XCIjZjU5ZTBiXCIgc3Ryb2tlV2lkdGg9XCIxXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKENaKX0gICBmaWxsPVwiIzEwYjk4MVwiIGZpbGxPcGFjaXR5PVwiMC4xNVwiIHN0cm9rZT1cIiMxMGI5ODFcIiBzdHJva2VXaWR0aD1cIjEuMlwiLz5cblxuICAgICAgICAgICAgICAgICAgICAgICAgey8qIFN3ZWV0LXNwb3QgYmFuZCwgY2xpcHBlZCB0byBDWiAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkZWZzPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjbGlwUGF0aCBpZD1cImN6LWNsaXAtd2Fsa1wiIGNsaXBQYXRoVW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoQ1opfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9jbGlwUGF0aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGVmcz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhTV0VFVCl9IGNsaXBQYXRoPVwidXJsKCNjei1jbGlwLXdhbGspXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw9XCIjMDU5NjY5XCIgZmlsbE9wYWNpdHk9XCIwLjMyXCIgc3Ryb2tlPVwiIzA0Nzg1N1wiIHN0cm9rZVdpZHRoPVwiMC44XCIgc3Ryb2tlRGFzaGFycmF5PVwiMywyXCIvPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoV0lOVEVSKX0gZmlsbD1cIiMzYjgyZjZcIiBmaWxsT3BhY2l0eT1cIjAuMTVcIiBzdHJva2U9XCJub25lXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3goMTkpfSB5MT17cGFkLnRvcCsxOH0geDI9e3goMTkpfSB5Mj17cGFkLnRvcCtncmlkSH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cIiMzYjgyZjZcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VEYXNoYXJyYXk9XCI2LDRcIiBvcGFjaXR5PVwiMC44XCIvPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICB7LyogUmVnaW9uIGxhYmVscyDigJQgc2FtZSBjb2xvcnMgJiBzcGlyaXQgYXMgbGl2ZSBjaGFydCAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goNTApLTEwfSB5PXt5KDgvMTAwMCl9IGZpbGw9XCIjNjM2NmYxXCIgZm9udFNpemU9XCIxMFwiIGZvbnRXZWlnaHQ9XCI5MDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIHRyYW5zZm9ybT17YHJvdGF0ZSgtOTAsICR7eCg1MCktMTB9LCAke3koOC8xMDAwKX0pYH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc9XCIyXCI+TUVDSEFOSUNBTCBDT09MSU5HPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCg0NCktMn0geT17eSg4LzEwMDApfSBmaWxsPVwiI2VjNDg5OVwiIGZvbnRTaXplPVwiOVwiIGZvbnRXZWlnaHQ9XCI5MDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIHRyYW5zZm9ybT17YHJvdGF0ZSgtOTAsICR7eCg0NCktMn0sICR7eSg4LzEwMDApfSlgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZz1cIjEuNVwiPk1BU1MgQ09PTElORzwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goMzcpLTEwfSB5PXt5KDgvMTAwMCl9IGZpbGw9XCIjOGI1Y2Y2XCIgZm9udFNpemU9XCI5XCIgZm9udFdlaWdodD1cIjkwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgdHJhbnNmb3JtPXtgcm90YXRlKC05MCwgJHt4KDM3KS0xMH0sICR7eSg4LzEwMDApfSlgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZz1cIjEuNVwiPk1BU1MgQ09PTElORzwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goMzQpfSB5PXt5KDAuNS8xMDAwKS04fSBmaWxsPVwiIzA2YjZkNFwiIGZvbnRTaXplPVwiOVwiIGZvbnRXZWlnaHQ9XCI5MDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGxldHRlclNwYWNpbmc9XCIyXCI+RVZBUE9SQVRJVkU8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDIzLjUpfSB5PXt5KF9nZXRXKDIzLjUsIDQ1KSl9IGZpbGw9XCIjMTBiOTgxXCIgZm9udFNpemU9XCIxMVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0PVwiOTAwXCIgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGxldHRlclNwYWNpbmc9XCIxLjVcIj5DT01GT1JUPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCgxOC43NSl9IHk9e3koX2dldFcoMTguNzUsIDQ1KSl9IGZpbGw9XCIjM2I4MmY2XCIgZm9udFNpemU9XCIxMVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0PVwiOTAwXCIgdGV4dEFuY2hvcj1cIm1pZGRsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm09e2Byb3RhdGUoLTkwLCAke3goMTguNzUpfSwgJHt5KF9nZXRXKDE4Ljc1LCA0NSkpfSlgfT5XSU5URVI8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDIzLjUpfSB5PXt5KF9nZXRXKDIzLjUsIChjZmcucmhMbytjZmcucmhIaSkvMikpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbD1cIiMwMjJjMjJcIiBmb250U2l6ZT1cIjhcIiBmb250V2VpZ2h0PVwiOTAwXCIgdGV4dEFuY2hvcj1cIm1pZGRsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e3BhaW50T3JkZXI6J3N0cm9rZScsIHN0cm9rZTonI2E3ZjNkMCcsIHN0cm9rZVdpZHRoOicyLjVweCcsIHN0cm9rZUxpbmVqb2luOidyb3VuZCd9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZz1cIjEuNVwiPntjZmcucmhMb30te2NmZy5yaEhpfSUgUkg8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICApfVxuXG4gICAgICAgICAgICAgICAgey8qIGF4aXMgbGFiZWxzICovfVxuICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3BhZC5sZWZ0ICsgZ3JpZFcvMn0geT17SC0xMn0gZm9udFNpemU9XCIxMVwiIGZpbGw9e3BhbGV0dGUuYXhpc31cbiAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgZm9udFdlaWdodD1cIjgwMFwiIGxldHRlclNwYWNpbmc9XCIyXCI+RFJZIEJVTEIgVEVNUCAowrBDKTwvdGV4dD5cbiAgICAgICAgICAgICAgICA8dGV4dCB4PXsxNn0geT17cGFkLnRvcCArIGdyaWRILzJ9IGZvbnRTaXplPVwiMTFcIiBmaWxsPXtwYWxldHRlLmF4aXN9XG4gICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGZvbnRXZWlnaHQ9XCI4MDBcIiBsZXR0ZXJTcGFjaW5nPVwiMlwiXG4gICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtPXtgcm90YXRlKC05MCAxNiAke3BhZC50b3AgKyBncmlkSC8yfSlgfT5IVU1JRElUWSBSQVRJTyAoZy9rZyk8L3RleHQ+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuZnVuY3Rpb24gUHN5Q29udHJvbFBhbmVsKHsgY2ZnLCB1cGRhdGUsIHNldENmZyB9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1zbGF0ZS05MDAvNjAgYm9yZGVyIGJvcmRlci1zbGF0ZS04MDAgcm91bmRlZC0yeGwgcC01IHNwYWNlLXktNlwiPlxuICAgICAgICAgICAgey8qIFRoZW1lICsgYnJpZ2h0bmVzcyAgLS0gcmVsb2NhdGVkIGZyb20gdGhlIGRhc2hib2FyZCBzaWRlYmFyIDIwMjYtMDYtMjUuXG4gICAgICAgICAgICAgICAgVHdvIGNvbnRyb2xzOiBEYXJrL0xpZ2h0IG1vZGUgdG9nZ2xlLCBhbmQgQnJpZ2h0bmVzcyBzbGlkZXIgKG9ubHlcbiAgICAgICAgICAgICAgICBtZWFuaW5nZnVsIGluIGRhcmsgbW9kZSkuICBMaXZlIHByZXZpZXcgYXBwbGllcyB0byB0aGUgc3Vycm91bmRpbmdcbiAgICAgICAgICAgICAgICBjb250cm9sIHBhbmVsIHNvIHRoZSBvcGVyYXRvciBjYW4gRkVFTCB0aGUgY2hhbmdlIGJlZm9yZSBzYXZpbmcuICovfVxuICAgICAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cInBzeS1jZmctdGhlbWUtYmxvY2tcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj5EaXNwbGF5IE1vZGU8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTIgbWItM1wiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwicHN5LWNmZy10aGVtZS1kYXJrXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIHRoZW1lOidkYXJrJywgZGFya0xldmVsOk1hdGgubWluKGMuZGFya0xldmVsIHx8IDIuMCwgMi42KX0pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweS0yLjUgcm91bmRlZC1sZyB0ZXh0LXhzIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBib3JkZXIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjZmcudGhlbWUgPT09ICdkYXJrJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctc2xhdGUtODAwIGJvcmRlci15ZWxsb3ctNTAwLzcwIHRleHQteWVsbG93LTMwMCBzaGFkb3ctbGcgc2hhZG93LXllbGxvdy01MDAvMTAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1zbGF0ZS05MDAvMzAgYm9yZGVyLXNsYXRlLTcwMCB0ZXh0LXNsYXRlLTUwMCBob3ZlcjpiZy1zbGF0ZS04MDAvNjAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAg8J+MmSAgRGltIC8gRGFya1xuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cInBzeS1jZmctdGhlbWUtbGlnaHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldENmZyhjID0+ICh7Li4uYywgdGhlbWU6J2xpZ2h0JywgZGFya0xldmVsOjMuMH0pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweS0yLjUgcm91bmRlZC1sZyB0ZXh0LXhzIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBib3JkZXIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjZmcudGhlbWUgPT09ICdsaWdodCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLXNsYXRlLTEwMCBib3JkZXItc2t5LTUwMC83MCB0ZXh0LXNreS03MDAgc2hhZG93LWxnIHNoYWRvdy1za3ktNTAwLzEwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctc2xhdGUtOTAwLzMwIGJvcmRlci1zbGF0ZS03MDAgdGV4dC1zbGF0ZS01MDAgaG92ZXI6Ymctc2xhdGUtODAwLzYwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIOKYgCAgTGlnaHRcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgey8qIEJyaWdodG5lc3Mgc2xpZGVyIOKAlCBvbmx5IG1lYW5pbmdmdWwgd2hlbiB0aGVtZSA9PT0gJ2RhcmsnICovfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjZmcudGhlbWUgPT09ICdsaWdodCcgPyAnb3BhY2l0eS00MCBwb2ludGVyLWV2ZW50cy1ub25lJyA6ICcnfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gbWItMVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwXCI+RGltIGJyaWdodG5lc3M8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1tb25vIHRleHQteWVsbG93LTMwMCB0YWJ1bGFyLW51bXNcIj57TWF0aC5yb3VuZCgoY2ZnLmRhcmtMZXZlbCB8fCAyLjApICogMTAwKX0lPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cInBzeS1jZmctZGFyay1sZXZlbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBtaW49XCIxLjVcIiBtYXg9XCIyLjhcIiBzdGVwPVwiMC4wMlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Y2ZnLnRoZW1lID09PSAnbGlnaHQnID8gMi4wIDogKGNmZy5kYXJrTGV2ZWwgfHwgMi4wKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0Q2ZnKGMgPT4gKHsuLi5jLCBkYXJrTGV2ZWw6IHBhcnNlRmxvYXQoZS50YXJnZXQudmFsdWUpLCB0aGVtZTonZGFyayd9KSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyYW5nZS1pbnB1dCB3LWZ1bGxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgYWNjZW50Q29sb3I6JyNmYWNjMTUnIH19Lz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0yIGl0YWxpY1wiPlxuICAgICAgICAgICAgICAgICAgICBBcHBsaWVkIHRvIHRoZSB3aG9sZSBkYXNoYm9hcmQuICBEaW0gaXMgcmVjb21tZW5kZWQgZm9yIGNvbnRyb2wgcm9vbXM7IExpZ2h0IGZvciBkYXl0aW1lIHdhbGstdGhyb3VnaHMuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBHaXZvbmkgdG9nZ2xlICovfVxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj5HaXZvbmkgRW5naW5lPC9kaXY+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB1cGRhdGUoJ2dpdm9uaScsICFjZmcuZ2l2b25pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHctZnVsbCBweS0zIHJvdW5kZWQteGwgdGV4dC1zbSBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Y2ZnLmdpdm9uaVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLWluZGlnby02MDAgdGV4dC13aGl0ZSBzaGFkb3ctbGcgc2hhZG93LWluZGlnby01MDAvMzAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctc2xhdGUtODAwIHRleHQtc2xhdGUtNDAwIGJvcmRlciBib3JkZXItc2xhdGUtNzAwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAge2NmZy5naXZvbmkgPyAnR2l2b25pIE9OJyA6ICdHaXZvbmkgT0ZGJ31cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0yIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgICAgICBPdmVybGF5cyB0aGUgNCBjbGltYXRlLXN0cmF0ZWd5IHJlZ2lvbnMgKENvbWZvcnQsIE5hdCBWZW50LCBFdmFwLCBNZWNoIENvb2wpLlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogUkggcmFuZ2UgKi99XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMlwiPlJIIFN3ZWV0LVNwb3QgUmFuZ2U8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwIG1iLTEgYmxvY2tcIj5WZW51ZSBwcmVzZXQ8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0IGN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Y2ZnLnJoUHJlc2V0IHx8ICdjdXN0b20nfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwID0gUkhfUFJFU0VUUy5maW5kKHAgPT4gcC5pZCA9PT0gZS50YXJnZXQudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXApIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHAuaWQgPT09ICdjdXN0b20nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGUoJ3JoUHJlc2V0JywgJ2N1c3RvbScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCByaFByZXNldDpwLmlkLCByaExvOnAubG8sIHJoSGk6cC5oaX0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAge1JIX1BSRVNFVFMubWFwKHAgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtwLmlkfSB2YWx1ZT17cC5pZH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtwLmxhYmVsfXtwLmxvICE9IG51bGwgPyBgICDCtyAgJHtwLmxvfS0ke3AuaGl9JSBSSGAgOiAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgeygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwID0gUkhfUFJFU0VUUy5maW5kKHggPT4geC5pZCA9PT0gKGNmZy5yaFByZXNldCB8fCAnY3VzdG9tJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHAgJiYgcC5ub3RlID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTEuNSBpdGFsaWNcIj57cC5ub3RlfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICkgOiBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9KSgpfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTMgbWItMlwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtbW9ubyB0ZXh0LXNsYXRlLTQwMCB3LTEwXCI+e2NmZy5yaExvfSU8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49XCIyMFwiIG1heD17Y2ZnLnJoSGktNX0gdmFsdWU9e2NmZy5yaExvfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIHJoTG86K2UudGFyZ2V0LnZhbHVlLCByaFByZXNldDonY3VzdG9tJ30pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLWlucHV0IGZsZXgtMVwiLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1tb25vIHRleHQtc2xhdGUtNDAwIHctMTBcIj57Y2ZnLnJoSGl9JTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj17Y2ZnLnJoTG8rNX0gbWF4PVwiOTBcIiB2YWx1ZT17Y2ZnLnJoSGl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldENmZyhjID0+ICh7Li4uYywgcmhIaTorZS50YXJnZXQudmFsdWUsIHJoUHJlc2V0OidjdXN0b20nfSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2UtaW5wdXQgZmxleC0xXCIvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBBeGlzIHJhbmdlICovfVxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj5UZW1wZXJhdHVyZSBBeGlzIFJhbmdlPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMyBtYi0yXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1tb25vIHRleHQtc2xhdGUtNDAwIHctMTBcIj57Y2ZnLnRMb33CsDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj1cIi00MFwiIG1heD17Y2ZnLnRIaS0xMH0gdmFsdWU9e2NmZy50TG99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZSgndExvJywgK2UudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLWlucHV0IGZsZXgtMVwiLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1tb25vIHRleHQtc2xhdGUtNDAwIHctMTBcIj57Y2ZnLnRIaX3CsDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj17Y2ZnLnRMbysxMH0gbWF4PVwiNjBcIiB2YWx1ZT17Y2ZnLnRIaX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlKCd0SGknLCArZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2UtaW5wdXQgZmxleC0xXCIvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTIgbGVhZGluZy1yZWxheGVkXCI+XG4gICAgICAgICAgICAgICAgICAgIENoYXJ0IHdpbGwgYmUgcmVkcmF3biB3aXRoIHRoaXMgZHJ5LWJ1bGIgdGVtcGVyYXR1cmUgd2luZG93LlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvcmRlci10IGJvcmRlci1zbGF0ZS04MDAgcHQtNFwiPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgICAgICBDaGFuZ2VzIHByZXZpZXcgbGl2ZSBpbiB0aGUgc2tlbGV0b24gY2hhcnQgb24gdGhlIGxlZnQuICBIaXRcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1pbmRpZ28tNDAwIGZvbnQtYmxhY2tcIj4gU2F2ZSAmIHJldHVybiA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIGluIHRoZSBoZWFkZXIgd2hlbiB5b3UncmUgaGFwcHkuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIExvY2F0aW9uIFNldHRpbmcgLS0gbW9kYWwgdy8gaW50ZXJhY3RpdmUgTGVhZmxldCBtYXAgKyByZXZlcnNlIGdlb2NvZGluZ1xuICogQ2xpY2sgYW55d2hlcmUgb24gdGhlIG1hcCAob3IgZHJhZyB0aGUgbWFya2VyKSB0byBzZXQgbGF0L2xvbi5cbiAqIE1hbnVhbCBsYXQvbG9uIGVkaXRzIHJlLWNlbnRyZSB0aGUgbWFya2VyLiAgQ2l0eSBuYW1lIGlzIGF1dG8tcG9wdWxhdGVkXG4gKiB2aWEgT3BlblN0cmVldE1hcCBOb21pbmF0aW0gKG5vIGtleSByZXF1aXJlZCwgcmF0ZS1saW1pdGVkIHRvIH4xIHJlcS9zKS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyogRGUtZHVwICsgc2FuaXR5LWNoZWNrIGEgcmF3IHNhdmVkLWxvY2F0aW9ucyBhcnJheSAoZnJvbSBzZXJ2ZXIgb3JcbiAqIGxvY2FsU3RvcmFnZSkuICBEZWR1cCBrZXkgaXMgYGxhdC50b0ZpeGVkKDQpLGxvbi50b0ZpeGVkKDQpYCAtLSB0aGVcbiAqIFNBTUUga2V5IHRoZSBkYXNoYm9hcmQncyB3ZWF0aGVyLXNldHRpbmdzLW1vZGFsLmpzIHVzZXMgLS0gc28gdGhlXG4gKiBTZXR1cCBXYWxrIGRyb3Bkb3duIHNob3dzIHRoZSBleGFjdCBzYW1lIHNldCB0aGUgb3BlcmF0b3Igc2VlcyBpblxuICogdGhlIGRhc2hib2FyZCdzIDNELVd4IFdlYXRoZXIgYnV0dG9uLiAgVHdvIGVudHJpZXMgdGhhdCBzaGFyZSBhIG5hbWVcbiAqIChlLmcuIFwiSE9NRVwiIGF0IHRoZSBvZmZpY2UgYW5kIFwiSE9NRVwiIGF0IHRoZSBhcGFydG1lbnQpIGJ1dCBoYXZlXG4gKiBkaWZmZXJlbnQgY29vcmRpbmF0ZXMgYXJlIEJPVEgga2VwdDsgb25seSB0cnVlIGNvb3JkIGR1cGxpY2F0ZXMgYXJlXG4gKiBjb2xsYXBzZWQuICBEcm9wcyBlbnRyaWVzIG1pc3NpbmcgYSBuYW1lIG9yIHdpdGggbm9uLWZpbml0ZSBsYXQvbG9uLiAqL1xuZnVuY3Rpb24gX25vcm1hbGl6ZUxvY3MoYXJyKSB7XG4gICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQoKTtcbiAgICBjb25zdCBvdXQgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGwgb2YgKGFyciB8fCBbXSkpIHtcbiAgICAgICAgaWYgKCFsIHx8IHR5cGVvZiBsLm5hbWUgIT09ICdzdHJpbmcnKSBjb250aW51ZTtcbiAgICAgICAgY29uc3QgbGF0ID0gK2wubGF0LCBsb24gPSArbC5sb247XG4gICAgICAgIGlmICghTnVtYmVyLmlzRmluaXRlKGxhdCkgfHwgIU51bWJlci5pc0Zpbml0ZShsb24pKSBjb250aW51ZTtcbiAgICAgICAgY29uc3QgbmFtZSA9IGwubmFtZS50cmltKCk7XG4gICAgICAgIGlmICghbmFtZSkgY29udGludWU7XG4gICAgICAgIGNvbnN0IGtleSA9IGxhdC50b0ZpeGVkKDQpICsgJywnICsgbG9uLnRvRml4ZWQoNCk7XG4gICAgICAgIGlmIChzZWVuLmhhcyhrZXkpKSBjb250aW51ZTtcbiAgICAgICAgc2Vlbi5hZGQoa2V5KTtcbiAgICAgICAgb3V0LnB1c2goeyBuYW1lLCBsYXQsIGxvbiB9KTtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gTG9jYXRpb25Nb2RhbCh7IGNmZywgc2V0Q2ZnLCBvbkNsb3NlLCBvblNhdmUgfSkge1xuICAgIGNvbnN0IG1hcEJveFJlZiA9IFJlYWN0LnVzZVJlZihudWxsKTtcbiAgICBjb25zdCBtYXBSZWYgICAgPSBSZWFjdC51c2VSZWYobnVsbCk7XG4gICAgY29uc3QgbWFya2VyUmVmID0gUmVhY3QudXNlUmVmKG51bGwpO1xuICAgIGNvbnN0IFtnZW9CdXN5LCBzZXRHZW9CdXN5XSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcblxuICAgIC8qIC0tLS0tIHNhdmVkIGxvY2F0aW9ucyAtLSBtaXJyb3Igd2hhdCB0aGUgRGFzaGJvYXJkJ3MgV2VhdGhlciBidXR0b24gc2hvd3MuXG4gICAgICpcbiAgICAgKiBUaGUgZGFzaGJvYXJkIHJlYWRzIHRoZW0gZnJvbSBgJHtBUElfVVJMfS9hcGkvd2VhdGhlci1sb2NhdGlvbmAnc1xuICAgICAqIGBzYXZlZGAgYXJyYXkgYW5kIG1pcnJvcnMgdGhhdCBpbnRvIGxvY2FsU3RvcmFnZVsnc2F2ZWRXZWF0aGVyTG9jYXRpb25zJ11cbiAgICAgKiBvbiBtb3VudCAoc2VlIHB1YmxpYy9qcy9kYXNoYm9hcmQvYXBwLmpzI2h5ZHJhdGVXZWF0aGVyU3RhdGUpLiAgV2UgZG9cbiAgICAgKiB0aGUgU0FNRSB0aGluZyBoZXJlIHNvIHRoZSBTZXR1cCBXYWxrJ3MgU2l0ZS1uYW1lIGRyb3Bkb3duIHN0YXlzXG4gICAgICogYnl0ZS1pZGVudGljYWwgd2l0aCB0aGUgZGFzaGJvYXJkJ3MgbG9jYXRpb24gbGlzdCAtLSBpbmNsdWRpbmcgd2hlbiB0aGVcbiAgICAgKiBvcGVyYXRvciB2aXNpdHMgU2V0dXAgV2FsayBCRUZPUkUgZXZlciBvcGVuaW5nIHRoZSBkYXNoYm9hcmQgKGZyZXNoXG4gICAgICogZGV2aWNlIGNhc2Ugd2hlcmUgbG9jYWxTdG9yYWdlIGlzIGVtcHR5KS5cbiAgICAgKlxuICAgICAqIFN0cmF0ZWd5OlxuICAgICAqICAgMSkgUmVhZCBsb2NhbFN0b3JhZ2UgZmlyc3QgKGluc3RhbnQsIG5vIGZsaWNrZXIgaWYgYWxyZWFkeSBoeWRyYXRlZCkuXG4gICAgICogICAyKSBUaGVuIEdFVCAvYXBpL3dlYXRoZXItbG9jYXRpb24gKGNhbm9uaWNhbCwgY3Jvc3MtZGV2aWNlIHNvdXJjZSkuXG4gICAgICogICAzKSBXaGljaGV2ZXIgaXMgbm9uLWVtcHR5IHdpbnM7IHNlcnZlciB3aW5zIHRpZXMuXG4gICAgICpcbiAgICAgKiBGcmVlLWZvcm0gdHlwaW5nIGluIHRoZSBpbnB1dCBzdGlsbCB3b3JrcyAtLSB0aGUgZGF0YWxpc3QgaXMgc3VnZ2VzdGlvblxuICAgICAqIG9ubHksIHRoZSBpbnB1dCBuZXZlciByZXN0cmljdHMgdGhlIHZhbHVlLiAqL1xuICAgIGNvbnN0IFtzYXZlZExvY3MsIHNldFNhdmVkTG9jc10gPSBSZWFjdC51c2VTdGF0ZSgoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByYXcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2F2ZWRXZWF0aGVyTG9jYXRpb25zJyk7XG4gICAgICAgICAgICBpZiAoIXJhdykgcmV0dXJuIFtdO1xuICAgICAgICAgICAgY29uc3QgYXJyID0gSlNPTi5wYXJzZShyYXcpO1xuICAgICAgICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXJyKSA/IF9ub3JtYWxpemVMb2NzKGFycikgOiBbXTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyByZXR1cm4gW107IH1cbiAgICB9KTtcbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBsZXQgY2FuY2VsbGVkID0gZmFsc2U7XG4gICAgICAgIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCgnL2FwaS93ZWF0aGVyLWxvY2F0aW9uJywgeyBjcmVkZW50aWFsczonaW5jbHVkZScsIGNhY2hlOiduby1zdG9yZScgfSk7XG4gICAgICAgICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm47XG4gICAgICAgICAgICAgICAgY29uc3QgaiA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNhdmVkID0gX25vcm1hbGl6ZUxvY3MoQXJyYXkuaXNBcnJheShqLnNhdmVkKSA/IGouc2F2ZWQgOiBbXSk7XG4gICAgICAgICAgICAgICAgaWYgKGNhbmNlbGxlZCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGlmIChzYXZlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFNhdmVkTG9jcyhzYXZlZCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIE1pcnJvciB0byBsb2NhbFN0b3JhZ2Ugc28gdGhlIGRhc2hib2FyZCBzZWVzIHRoZSBzYW1lIGxpc3RcbiAgICAgICAgICAgICAgICAgICAgLy8gZXZlbiBpZiBpdHMgb3duIGh5ZHJhdGUgaGFzbid0IHJ1biB5ZXQgdGhpcyBzZXNzaW9uLlxuICAgICAgICAgICAgICAgICAgICB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc2F2ZWRXZWF0aGVyTG9jYXRpb25zJywgSlNPTi5zdHJpbmdpZnkoc2F2ZWQpKTsgfSBjYXRjaCAoZSkge31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7IC8qIG9mZmxpbmUgLT4gbG9jYWxTdG9yYWdlIHZhbHVlIGFscmVhZHkgaW4gc3RhdGUgKi8gfVxuICAgICAgICB9KSgpO1xuICAgICAgICByZXR1cm4gKCkgPT4geyBjYW5jZWxsZWQgPSB0cnVlOyB9O1xuICAgIH0sIFtdKTtcblxuICAgIC8qIC0tLS0tIHNhdmVkLWxvY2F0aW9ucyBkcm9wZG93biBvcGVuL2Nsb3NlIHN0YXRlLlxuICAgICAqIE5hdGl2ZSA8ZGF0YWxpc3Q+IGhpZGVzIGl0cyBjaGV2cm9uIGluIG1vc3QgYnJvd3NlcnMgKGVzcGVjaWFsbHkgaW5cbiAgICAgKiBhIGRhcmsgdGhlbWUpLCB3aGljaCBtYWRlIHRoZSBcImRyb3AgZG93blwiIGludmlzaWJsZSB0byBvcGVyYXRvcnNcbiAgICAgKiB3aG8gY2xlYXJseSBoYWQgbXVsdGlwbGUgc2F2ZWQgbG9jYXRpb25zLiAgUmVwbGFjZWQgd2l0aCBhIGN1c3RvbVxuICAgICAqIHBvcGRvd24gcGFuZWwgdGhhdCBoYXMgYW4gQUxXQVlTLVZJU0lCTEUgY2hldnJvbiBidXR0b24gLS0gY2xpY2sgaXRcbiAgICAgKiB0byB0b2dnbGUsIGNsaWNrIG91dHNpZGUgdG8gZGlzbWlzcy4gKi9cbiAgICBjb25zdCBbc2F2ZWRPcGVuLCBzZXRTYXZlZE9wZW5dID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IHNhdmVkUmVmID0gUmVhY3QudXNlUmVmKG51bGwpO1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmICghc2F2ZWRPcGVuKSByZXR1cm47XG4gICAgICAgIGNvbnN0IG9uRG9jQ2xpY2sgPSAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHNhdmVkUmVmLmN1cnJlbnQgJiYgIXNhdmVkUmVmLmN1cnJlbnQuY29udGFpbnMoZS50YXJnZXQpKSBzZXRTYXZlZE9wZW4oZmFsc2UpO1xuICAgICAgICB9O1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKTtcbiAgICAgICAgcmV0dXJuICgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spO1xuICAgIH0sIFtzYXZlZE9wZW5dKTtcblxuICAgIC8qIFdoZW4gdGhlIHVzZXIgcGlja3MgYSBuYW1lIGZyb20gdGhlIGRyb3Bkb3duIE9SIHR5cGVzIG9uZSB0aGF0XG4gICAgICogZXhhY3RseSBtYXRjaGVzIGEgc2F2ZWQgZW50cnksIHB1bGwgaXRzIGxhdC9sb24gYW5kIHJlY2VudHJlIHRoZVxuICAgICAqIG1hcC4gIEZyZWUtZm9ybSB0eXBpbmcgc3RpbGwgd29ya3MgLS0gdGhlIG5hbWUgaXMganVzdCBrZXB0IGFzIHRoZVxuICAgICAqIHNpdGUgbGFiZWwuICBBdm9pZHMgc3VycHJpc2luZyB0aGUgb3BlcmF0b3Igd2hvIHR5cGVzIFwiUGF2aWxpb24gQlwiXG4gICAgICogKGEgbGFiZWwgdGhleSBpbnZlbnRlZCkgYW5kIGV4cGVjdHMgdGhlIG1hcCBOT1QgdG8ganVtcC4gKi9cbiAgICBjb25zdCBvblNpdGVOYW1lQ2hhbmdlID0gKG5ld05hbWUpID0+IHtcbiAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBzaXRlTmFtZTpuZXdOYW1lfSkpO1xuICAgICAgICBjb25zdCBoaXQgPSBzYXZlZExvY3MuZmluZChzID0+IHMubmFtZSA9PT0gbmV3TmFtZSk7XG4gICAgICAgIGlmIChoaXQpIHtcbiAgICAgICAgICAgIGNvbnN0IGxhdCA9IE1hdGgucm91bmQoaGl0LmxhdCAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICAgICAgY29uc3QgbG9uID0gTWF0aC5yb3VuZChoaXQubG9uICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIHNpdGVOYW1lOm5ld05hbWUsIGxhdCwgbG9uLCBjaXR5Om5ld05hbWV9KSk7XG4gICAgICAgICAgICBpZiAobWFwUmVmLmN1cnJlbnQpIG1hcFJlZi5jdXJyZW50LnNldFZpZXcoW2xhdCwgbG9uXSwgMTEpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBwaWNrU2F2ZWRMb2MgPSAobG9jKSA9PiB7XG4gICAgICAgIHNldFNhdmVkT3BlbihmYWxzZSk7XG4gICAgICAgIG9uU2l0ZU5hbWVDaGFuZ2UobG9jLm5hbWUpO1xuICAgIH07XG5cbiAgICAvKiBSZW1vdmUgYSBzYXZlZCBsb2NhdGlvbiBmcm9tIHRoZSBsaXN0LiAgRGVkdXAta2V5ZWQgYnkgbGF0L2xvbiBzbyB0d29cbiAgICAgKiBlbnRyaWVzIHRoYXQgc2hhcmUgYSBuYW1lIChlLmcuIFwiSE9NRVwiIGF0IHRoZSBvZmZpY2UgdnMgdGhlIGFwYXJ0bWVudClcbiAgICAgKiBhcmUgYWRkcmVzc2VkIGluZGl2aWR1YWxseSAtLSByZW1vdmluZyBvbmUga2VlcHMgdGhlIG90aGVyLiAgTWlycm9yc1xuICAgICAqIHRoZSBjaGFuZ2UgdG8gbG9jYWxTdG9yYWdlIEFORCB0aGUgc2VydmVyIHNvIHRoZSBkYXNoYm9hcmQncyBXZWF0aGVyXG4gICAgICogYnV0dG9uIHNlZXMgdGhlIGRlbGV0aW9uIG9uIGl0cyBuZXh0IHJlYWQuICovXG4gICAgY29uc3QgcmVtb3ZlU2F2ZWRMb2MgPSAobG9jKSA9PiB7XG4gICAgICAgIGNvbnN0IGtleSA9IGxvYy5sYXQudG9GaXhlZCg0KSArICcsJyArIGxvYy5sb24udG9GaXhlZCg0KTtcbiAgICAgICAgY29uc3QgbmV4dCA9IHNhdmVkTG9jcy5maWx0ZXIocyA9PiAocy5sYXQudG9GaXhlZCg0KSArICcsJyArIHMubG9uLnRvRml4ZWQoNCkpICE9PSBrZXkpO1xuICAgICAgICBzZXRTYXZlZExvY3MobmV4dCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc2F2ZWRXZWF0aGVyTG9jYXRpb25zJywgSlNPTi5zdHJpbmdpZnkobmV4dCkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IC8qIHByaXZhdGUgbW9kZSAqLyB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3JlZDU6d2VhdGhlckxvY2F0aW9uQ2hhbmdlZCcsXG4gICAgICAgICAgICAgICAgeyBkZXRhaWw6IHsgc2F2ZWQ6IG5leHQgfSB9KSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgIC8qIEJlc3QtZWZmb3J0IHNlcnZlciBzeW5jLiAgQW5vbnltb3VzIHVzZXJzIGdldCBwZXJzaXN0ZWQ6ZmFsc2UgYmFjayxcbiAgICAgICAgICogd2hpY2ggaXMgZmluZSAtLSB0aGUgbG9jYWwgY29weSBhbHJlYWR5IHJlZmxlY3RzIHRoZSByZW1vdmFsLiAqL1xuICAgICAgICBmZXRjaCgnL2FwaS93ZWF0aGVyLWxvY2F0aW9uJywge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBjcmVkZW50aWFsczogJ2luY2x1ZGUnLFxuICAgICAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzonYXBwbGljYXRpb24vanNvbicgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgc2F2ZWQ6IG5leHQgfSksXG4gICAgICAgIH0pLmNhdGNoKCgpID0+IHsgLyogb2ZmbGluZSAtLSBsb2NhbFN0b3JhZ2UgYWxyZWFkeSB1cGRhdGVkICovIH0pO1xuICAgICAgICAvKiBJZiB0aGUgb3BlcmF0b3IganVzdCBkZWxldGVkIHRoZSBlbnRyeSBjdXJyZW50bHkgaW4gdGhlIGlucHV0LFxuICAgICAgICAgKiBibGFuayB0aGUgaW5wdXQgc28gYSBzdGFsZSBzZWxlY3Rpb24gaXNuJ3QgYWNjaWRlbnRhbGx5IHNhdmVkLiAqL1xuICAgICAgICBpZiAoKGNmZy5zaXRlTmFtZSB8fCAnJykudHJpbSgpID09PSBsb2MubmFtZSkge1xuICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBzaXRlTmFtZTonJ30pKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmV4dC5sZW5ndGggPT09IDApIHNldFNhdmVkT3BlbihmYWxzZSk7XG4gICAgfTtcblxuICAgIC8qIC0tLS0tIHNlYXJjaCBzdGF0ZSAtLS0tLSAqL1xuICAgIGNvbnN0IFtzZWFyY2hRLCBzZXRTZWFyY2hRXSAgICAgICAgID0gUmVhY3QudXNlU3RhdGUoJycpO1xuICAgIGNvbnN0IFtzZWFyY2hIaXRzLCBzZXRTZWFyY2hIaXRzXSAgID0gUmVhY3QudXNlU3RhdGUoW10pO1xuICAgIGNvbnN0IFtzZWFyY2hCdXN5LCBzZXRTZWFyY2hCdXN5XSAgID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IFtzZWFyY2hPcGVuLCBzZXRTZWFyY2hPcGVuXSAgID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IHNlYXJjaERlYm91bmNlUmVmICAgICAgICAgICAgID0gUmVhY3QudXNlUmVmKG51bGwpO1xuXG4gICAgLyogRm9yd2FyZC1nZW9jb2RlOiBxdWVyeSAtPiBbe2xhdCwgbG9uLCBkaXNwbGF5X25hbWUsIHR5cGUsIC4uLn1dICovXG4gICAgY29uc3QgcnVuU2VhcmNoID0gYXN5bmMgKHEpID0+IHtcbiAgICAgICAgaWYgKCFxIHx8IHEudHJpbSgpLmxlbmd0aCA8IDMpIHsgc2V0U2VhcmNoSGl0cyhbXSk7IHJldHVybjsgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2V0U2VhcmNoQnVzeSh0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGBodHRwczovL25vbWluYXRpbS5vcGVuc3RyZWV0bWFwLm9yZy9zZWFyY2g/Zm9ybWF0PWpzb24mbGltaXQ9NiZxPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHEpfWA7XG4gICAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7IGhlYWRlcnM6eyAnQWNjZXB0JzonYXBwbGljYXRpb24vanNvbicgfSB9KTtcbiAgICAgICAgICAgIGNvbnN0IGogPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgICAgIHNldFNlYXJjaEhpdHMoQXJyYXkuaXNBcnJheShqKSA/IGogOiBbXSk7XG4gICAgICAgICAgICBzZXRTZWFyY2hPcGVuKHRydWUpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IHNldFNlYXJjaEhpdHMoW10pOyB9XG4gICAgICAgIGZpbmFsbHkgeyBzZXRTZWFyY2hCdXN5KGZhbHNlKTsgfVxuICAgIH07XG5cbiAgICAvKiBkZWJvdW5jZWQgc2VhcmNoLW9uLXR5cGUgKi9cbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoc2VhcmNoRGVib3VuY2VSZWYuY3VycmVudCkgY2xlYXJUaW1lb3V0KHNlYXJjaERlYm91bmNlUmVmLmN1cnJlbnQpO1xuICAgICAgICBzZWFyY2hEZWJvdW5jZVJlZi5jdXJyZW50ID0gc2V0VGltZW91dCgoKSA9PiBydW5TZWFyY2goc2VhcmNoUSksIDQwMCk7XG4gICAgICAgIHJldHVybiAoKSA9PiBzZWFyY2hEZWJvdW5jZVJlZi5jdXJyZW50ICYmIGNsZWFyVGltZW91dChzZWFyY2hEZWJvdW5jZVJlZi5jdXJyZW50KTtcbiAgICB9LCBbc2VhcmNoUV0pO1xuXG4gICAgY29uc3QgcGlja1NlYXJjaEhpdCA9IChoaXQpID0+IHtcbiAgICAgICAgY29uc3QgbGF0ID0gTWF0aC5yb3VuZCgraGl0LmxhdCAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICBjb25zdCBsb24gPSBNYXRoLnJvdW5kKCtoaXQubG9uICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgbGF0LCBsb24sIGNpdHk6aGl0LmRpc3BsYXlfbmFtZX0pKTtcbiAgICAgICAgaWYgKG1hcFJlZi5jdXJyZW50KSBtYXBSZWYuY3VycmVudC5zZXRWaWV3KFtsYXQsIGxvbl0sIGhpdC50eXBlID09PSAnY2l0eScgPyAxMSA6IDE1KTtcbiAgICAgICAgc2V0U2VhcmNoT3BlbihmYWxzZSk7XG4gICAgICAgIHNldFNlYXJjaFEoJycpO1xuICAgIH07XG5cbiAgICAvKiBSZXZlcnNlLWdlb2NvZGUgbGF0L2xvbiAtPiBjaXR5IC8gY291bnRyeSB2aWEgTm9taW5hdGltLiAgTm8gQVBJIGtleS4gKi9cbiAgICBjb25zdCByZXZlcnNlR2VvY29kZSA9IGFzeW5jIChsYXQsIGxvbikgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2V0R2VvQnVzeSh0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGBodHRwczovL25vbWluYXRpbS5vcGVuc3RyZWV0bWFwLm9yZy9yZXZlcnNlP2Zvcm1hdD1qc29uJmxhdD0ke2xhdH0mbG9uPSR7bG9ufSZ6b29tPTEwYDtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCh1cmwsIHsgaGVhZGVyczogeyAnQWNjZXB0JzonYXBwbGljYXRpb24vanNvbicgfSB9KTtcbiAgICAgICAgICAgIGNvbnN0IGogPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgICAgIGNvbnN0IGEgPSBqLmFkZHJlc3MgfHwge307XG4gICAgICAgICAgICBjb25zdCBjaXR5ID0gYS5jaXR5IHx8IGEudG93biB8fCBhLnZpbGxhZ2UgfHwgYS5oYW1sZXQgfHwgYS5jb3VudHkgfHwgJyc7XG4gICAgICAgICAgICBjb25zdCByZWdpb24gPSBhLnN0YXRlIHx8IGEucmVnaW9uIHx8ICcnO1xuICAgICAgICAgICAgY29uc3QgY291bnRyeSA9IGEuY291bnRyeSB8fCAnJztcbiAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gW2NpdHksIHJlZ2lvbiwgY291bnRyeV0uZmlsdGVyKEJvb2xlYW4pLmpvaW4oJywgJykgfHwgai5kaXNwbGF5X25hbWUgfHwgJyc7XG4gICAgICAgICAgICBpZiAobGFiZWwpIHNldENmZyhjID0+ICh7Li4uYywgY2l0eTpsYWJlbH0pKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBvZmZsaW5lIG9yIHJhdGUtbGltaXRlZCAtPiBrZWVwIHByaW9yIG5hbWUgKi8gfVxuICAgICAgICBmaW5hbGx5IHsgc2V0R2VvQnVzeShmYWxzZSk7IH1cbiAgICB9O1xuXG4gICAgLyogSW5pdCBMZWFmbGV0IG9uIGZpcnN0IHJlbmRlciBvZiB0aGUgbW9kYWwgKi9cbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoIW1hcEJveFJlZi5jdXJyZW50IHx8IG1hcFJlZi5jdXJyZW50KSByZXR1cm47XG4gICAgICAgIGNvbnN0IG1hcCA9IEwubWFwKG1hcEJveFJlZi5jdXJyZW50LCB7IHpvb21Db250cm9sOiB0cnVlLCBhdHRyaWJ1dGlvbkNvbnRyb2w6IHRydWUgfSlcbiAgICAgICAgICAgICAgICAgICAgIC5zZXRWaWV3KFtjZmcubGF0LCBjZmcubG9uXSwgNik7XG4gICAgICAgIEwudGlsZUxheWVyKCdodHRwczovL3tzfS50aWxlLm9wZW5zdHJlZXRtYXAub3JnL3t6fS97eH0ve3l9LnBuZycsIHtcbiAgICAgICAgICAgIG1heFpvb206IDE4LFxuICAgICAgICAgICAgYXR0cmlidXRpb246ICcmY29weTsgT3BlblN0cmVldE1hcCBjb250cmlidXRvcnMnLFxuICAgICAgICB9KS5hZGRUbyhtYXApO1xuXG4gICAgICAgIGNvbnN0IG1hcmtlciA9IEwubWFya2VyKFtjZmcubGF0LCBjZmcubG9uXSwgeyBkcmFnZ2FibGU6IHRydWUgfSkuYWRkVG8obWFwKTtcbiAgICAgICAgbWFya2VyLmJpbmRUb29sdGlwKCdEcmFnIG1lIG9yIGNsaWNrIGFueXdoZXJlIG9uIHRoZSBtYXAnLCB7IHBlcm1hbmVudDogZmFsc2UgfSk7XG5cbiAgICAgICAgY29uc3QgYXBwbHlMYXRMb24gPSAobGF0LCBsb24pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHIgPSAobikgPT4gTWF0aC5yb3VuZChuICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIGxhdDpyKGxhdCksIGxvbjpyKGxvbil9KSk7XG4gICAgICAgICAgICByZXZlcnNlR2VvY29kZShyKGxhdCksIHIobG9uKSk7XG4gICAgICAgIH07XG4gICAgICAgIG1hcmtlci5vbignZHJhZ2VuZCcsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxsID0gbWFya2VyLmdldExhdExuZygpO1xuICAgICAgICAgICAgYXBwbHlMYXRMb24obGwubGF0LCBsbC5sbmcpO1xuICAgICAgICB9KTtcbiAgICAgICAgbWFwLm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICBtYXJrZXIuc2V0TGF0TG5nKGUubGF0bG5nKTtcbiAgICAgICAgICAgIGFwcGx5TGF0TG9uKGUubGF0bG5nLmxhdCwgZS5sYXRsbmcubG5nKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbWFwUmVmLmN1cnJlbnQgPSBtYXA7XG4gICAgICAgIG1hcmtlclJlZi5jdXJyZW50ID0gbWFya2VyO1xuXG4gICAgICAgIC8qIExlYWZsZXQgcmVuZGVycyBibGFuayBpZiBpdCBib290cyBpbnNpZGUgYSBoaWRkZW4gZWxlbWVudCDigJQga2ljayBpdFxuICAgICAgICAgICBvbmNlIHRoZSBtb2RhbCBhbmltYXRpb24gc2V0dGxlcy4gKi9cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiBtYXAuaW52YWxpZGF0ZVNpemUoKSwgMjUwKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHsgbWFwLnJlbW92ZSgpOyBtYXBSZWYuY3VycmVudCA9IG51bGw7IG1hcmtlclJlZi5jdXJyZW50ID0gbnVsbDsgfTtcbiAgICB9LCBbXSk7XG5cbiAgICAvKiBLZWVwIG1hcmtlciBpbiBzeW5jIHdoZW4gdXNlciBlZGl0cyBsYXQvbG9uIGZpZWxkcyBtYW51YWxseSAqL1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmIChtYXBSZWYuY3VycmVudCAmJiBtYXJrZXJSZWYuY3VycmVudCkge1xuICAgICAgICAgICAgbWFya2VyUmVmLmN1cnJlbnQuc2V0TGF0TG5nKFtjZmcubGF0LCBjZmcubG9uXSk7XG4gICAgICAgICAgICBtYXBSZWYuY3VycmVudC5wYW5UbyhbY2ZnLmxhdCwgY2ZnLmxvbl0pO1xuICAgICAgICB9XG4gICAgfSwgW2NmZy5sYXQsIGNmZy5sb25dKTtcblxuICAgIC8qIEdlb2xvY2F0aW9uOiBzaWxlbnRseSBuby1vcCdkIGJlZm9yZSAtLSBpZiB0aGUgYnJvd3NlciBibG9ja2VkIHRoZVxuICAgICAqIHJlcXVlc3QgKEhUVFAgb3JpZ2luID0gbm90IGEgc2VjdXJlIGNvbnRleHQgb24gZmllbGQgY29udHJvbGxlcnMsIG9yXG4gICAgICogdGhlIHVzZXIgZGVuaWVkIHBlcm1pc3Npb24gZWFybGllcikgdGhlIGJ1dHRvbiBqdXN0IHNhdCB0aGVyZS5cbiAgICAgKiBOb3cgd2Ugc3VyZmFjZSBhIHN0YXRlIChidXN5IC8gZXJyKSBzbyB0aGUgb3BlcmF0b3IgY2FuIHNlZSBXSFkgaXRcbiAgICAgKiBmYWlsZWQgYW5kIGFjdCBvbiBpdCAoc3dpdGNoIHRvIEhUVFBTLCByZS1wcm9tcHQsIG9yIHVzZSB0aGUgbWFwKS4gKi9cbiAgICBjb25zdCBbZ2VvU3RhdGUsIHNldEdlb1N0YXRlXSA9IFJlYWN0LnVzZVN0YXRlKG51bGwpOyAgIC8vIG51bGwgfCAnYnVzeScgfCB7ZXJyfVxuICAgIGNvbnN0IHVzZU15TG9jYXRpb24gPSAoKSA9PiB7XG4gICAgICAgIHNldEdlb1N0YXRlKCdidXN5Jyk7XG4gICAgICAgIC8vIG5hdmlnYXRvci5nZW9sb2NhdGlvbiBpcyBgdW5kZWZpbmVkYCBvbiBIVFRQIG9yaWdpbnMgKENocm9tZSA1MCspLlxuICAgICAgICBpZiAoIW5hdmlnYXRvci5nZW9sb2NhdGlvbikge1xuICAgICAgICAgICAgc2V0R2VvU3RhdGUoeyBlcnI6J0Jyb3dzZXIgYmxvY2tlZCBsb2NhdGlvbiBhY2Nlc3Mg4oCUIG9wZW4gdGhpcyBwYWdlIHZpYSBIVFRQUy4nIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oXG4gICAgICAgICAgICAocG9zKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGF0ID0gTWF0aC5yb3VuZChwb3MuY29vcmRzLmxhdGl0dWRlICAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxvbiA9IE1hdGgucm91bmQocG9zLmNvb3Jkcy5sb25naXR1ZGUgKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIGxhdCwgbG9ufSkpO1xuICAgICAgICAgICAgICAgIGlmIChtYXBSZWYuY3VycmVudCkgbWFwUmVmLmN1cnJlbnQuc2V0VmlldyhbbGF0LCBsb25dLCAxMSk7XG4gICAgICAgICAgICAgICAgcmV2ZXJzZUdlb2NvZGUobGF0LCBsb24pO1xuICAgICAgICAgICAgICAgIHNldEdlb1N0YXRlKG51bGwpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBlcnIuY29kZTogMT1QRVJNSVNTSU9OX0RFTklFRCwgMj1QT1NJVElPTl9VTkFWQUlMQUJMRSwgMz1USU1FT1VUXG4gICAgICAgICAgICAgICAgY29uc3QgbXNnID0gZXJyICYmIGVyci5jb2RlID09PSAxXG4gICAgICAgICAgICAgICAgICAgID8gJ0xvY2F0aW9uIHBlcm1pc3Npb24gZGVuaWVkIOKAlCBjbGljayB0aGUgbG9jayBpY29uIGluIHRoZSBhZGRyZXNzIGJhciBhbmQgYWxsb3cgbG9jYXRpb24uJ1xuICAgICAgICAgICAgICAgICAgICA6IGVyciAmJiBlcnIuY29kZSA9PT0gMlxuICAgICAgICAgICAgICAgICAgICAgICAgPyAnTG9jYXRpb24gY3VycmVudGx5IHVuYXZhaWxhYmxlIOKAlCB0aGUgZGV2aWNlIGhhcyBubyBHUFMgLyBXaS1GaSBmaXggeWV0LidcbiAgICAgICAgICAgICAgICAgICAgICAgIDogZXJyICYmIGVyci5jb2RlID09PSAzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnTG9jYXRpb24gcmVxdWVzdCB0aW1lZCBvdXQg4oCUIHRyeSBhZ2Fpbiwgb3IgdXNlIHRoZSBtYXAgLyBzZWFyY2ggYmFyLidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IChlcnIgJiYgZXJyLm1lc3NhZ2UpIHx8ICdDb3VsZCBub3QgcmVhZCBkZXZpY2UgbG9jYXRpb24uJztcbiAgICAgICAgICAgICAgICBzZXRHZW9TdGF0ZSh7IGVycjogbXNnIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgZW5hYmxlSGlnaEFjY3VyYWN5OnRydWUsIHRpbWVvdXQ6MTAwMDAsIG1heGltdW1BZ2U6MCB9XG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIC8qIFdoZW4gdXNlciBjbGlja3MgXCJTYXZlICYgcmV0dXJuXCIsIG1pcnJvciBFWEFDVExZIHdoYXQgdGhlIGRhc2hib2FyZCdzXG4gICAgICogV2VhdGhlciBidXR0b24gZG9lcyBpbiB3ZWF0aGVyLXNldHRpbmdzLW1vZGFsLmpzI3NlbGVjdExvY2F0aW9uOlxuICAgICAqICAgMS4gbG9jYWxTdG9yYWdlWyd3ZWF0aGVyTG9jYXRpb24nXSAgICAgICAgPSBjaG9zZW4gbG9jIChjYW5vbmljYWwga2V5XG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGRhc2hib2FyZCByZWFkcyBvblxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vdW50LCBOT1QgJ3JlZDUud2VhdGhlcl9sb2NhdGlvbicpLlxuICAgICAqICAgMi4gbG9jYWxTdG9yYWdlWydzYXZlZFdlYXRoZXJMb2NhdGlvbnMnXSAgPSBbbG9jLCAuLi5vdGhlcnNdIGRlZHVwZWRcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBieSBsYXQvbG9uLCBjYXBwZWQgYXQgMjAuXG4gICAgICogICAzLiBQT1NUIC9hcGkvd2VhdGhlci1sb2NhdGlvbiB3aXRoIGFjdGl2ZStkZWZhdWx0K3NhdmVkIHNvIHRoZSBzYW1lXG4gICAgICogICAgICBsaXN0IHN1cnZpdmVzIGNyb3NzLWRldmljZSBzZXNzaW9ucyBmb3Igc2lnbmVkLWluIHRlbmFudHMuXG4gICAgICpcbiAgICAgKiBXaXRob3V0IHN0ZXAgMSB0aGUgZGFzaGJvYXJkJ3MgYHdlYXRoZXJMb2NhdGlvbmAgc3RhdGUgc2lsZW50bHkga2VlcHNcbiAgICAgKiBpdHMgb2xkIHZhbHVlIC0tIHdoaWNoIGlzIGV4YWN0bHkgdGhlIGJ1ZyBvcGVyYXRvcnMgcmVwb3J0ZWQgYWZ0ZXJcbiAgICAgKiBwaWNraW5nIGEgbG9jYXRpb24gaW4gU2V0dXAgV2FsayBhbmQgc2VlaW5nIHRoZSBkYXNoYm9hcmQncyB3ZWF0aGVyXG4gICAgICogc3RyaXAgcmVmdXNlIHRvIHVwZGF0ZS4gKi9cbiAgICBjb25zdCBbc2F2ZU1zZywgc2V0U2F2ZU1zZ10gPSBSZWFjdC51c2VTdGF0ZShudWxsKTtcbiAgICBjb25zdCBwZXJzaXN0QW5kU2F2ZSA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgbG9jID0geyBsYXQ6IGNmZy5sYXQsIGxvbjogY2ZnLmxvbiwgbmFtZTogY2ZnLnNpdGVOYW1lIHx8IGNmZy5jaXR5IH07XG5cbiAgICAgICAgLy8gRGUtZHVwIHRoZSBleGlzdGluZyBzYXZlZCBsaXN0IGJ5IGxhdC9sb24gKHNhbWUga2V5IHRoZSBkYXNoYm9hcmRcbiAgICAgICAgLy8gdXNlcykgYW5kIHB1dCB0aGUgbmV3IHBpY2sgYXQgdGhlIHRvcC4gIENhcCBhdCAyMCB0byBtYXRjaCB0aGVcbiAgICAgICAgLy8gZGFzaGJvYXJkJ3MgYmVoYXZpb3VyLlxuICAgICAgICBjb25zdCBrZXkgPSBsb2MubGF0LnRvRml4ZWQoNCkgKyAnLCcgKyBsb2MubG9uLnRvRml4ZWQoNCk7XG4gICAgICAgIGNvbnN0IGRlZHVwZWQgPSBzYXZlZExvY3MuZmlsdGVyKGwgPT4gKGwubGF0LnRvRml4ZWQoNCkgKyAnLCcgKyBsLmxvbi50b0ZpeGVkKDQpKSAhPT0ga2V5KTtcbiAgICAgICAgY29uc3QgbmV4dFNhdmVkID0gW2xvYywgLi4uZGVkdXBlZF0uc2xpY2UoMCwgMjApO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnd2VhdGhlckxvY2F0aW9uJywgSlNPTi5zdHJpbmdpZnkobG9jKSk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc2F2ZWRXZWF0aGVyTG9jYXRpb25zJywgSlNPTi5zdHJpbmdpZnkobmV4dFNhdmVkKSk7XG4gICAgICAgICAgICAvLyBLZWVwIHRoZSBvbGQga2V5IHRvbyAtLSBzb21lIGxlZ2FjeSBwbHVnLWlucyBzdGlsbCBsb29rIGF0IGl0LlxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDUud2VhdGhlcl9sb2NhdGlvbicsIEpTT04uc3RyaW5naWZ5KGxvYykpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IC8qIHByaXZhdGUgbW9kZSAtLSBpZ25vcmUgKi8gfVxuXG4gICAgICAgIGxldCBwZXJzaXN0ZWQgPSBmYWxzZSwgd2FybmluZyA9ICcnO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKCcvYXBpL3dlYXRoZXItbG9jYXRpb24nLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOidhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgYWN0aXZlOiBsb2MsIGRlZmF1bHQ6IGxvYywgc2F2ZWQ6IG5leHRTYXZlZCB9KSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgaiA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgICAgICAgd2luZG93Ll9sYXN0V2VhdGhlckxvY2F0aW9uU2F2ZSA9IGo7XG4gICAgICAgICAgICBwZXJzaXN0ZWQgPSAhIWoucGVyc2lzdGVkO1xuICAgICAgICAgICAgd2FybmluZyAgID0gai53YXJuaW5nIHx8ICcnO1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdbc2V0dXAgd2Fsa10gL2FwaS93ZWF0aGVyLWxvY2F0aW9uIDwtJywgaik7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHdhcm5pbmcgPSAnTmV0d29yayBlcnJvciDigJQgc2F2ZWQgbG9jYWxseSBvbmx5Lic7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1tzZXR1cCB3YWxrXSBjb3VsZCBub3QgcGVyc2lzdCBsb2NhdGlvbjonLCBlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRlbGwgYW55IG9wZW4gZGFzaGJvYXJkIHRhYiB0byByZS1oeWRyYXRlLiAgVGhlIGRhc2hib2FyZFxuICAgICAgICAvLyBhbHJlYWR5IGxpc3RlbnMgZm9yIGBzdG9yYWdlYCBldmVudHMgd2hlbiBhbm90aGVyIHRhYiB3cml0ZXMgdG9cbiAgICAgICAgLy8gbG9jYWxTdG9yYWdlLCBidXQgb24gVjEuOSBzb21lIGJyb3dzZXJzIERPTidUIGZpcmUgYHN0b3JhZ2VgIGZvclxuICAgICAgICAvLyBzYW1lLW9yaWdpbiB3cml0ZXMgZnJvbSB0aGlzIHNhbWUgdGFiLiAgQW4gZXhwbGljaXQgY3VzdG9tIGV2ZW50XG4gICAgICAgIC8vIG1ha2VzIHRoZSBkYXNoYm9hcmQncyBwb2xsaW5nIHBpY2sgdGhlIGNoYW5nZSB1cCBpbW1lZGlhdGVseSBpZlxuICAgICAgICAvLyBpdCdzIGFscmVhZHkgbW91bnRlZCBpbiBhbm90aGVyIHRhYi93aW5kb3cuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3JlZDU6d2VhdGhlckxvY2F0aW9uQ2hhbmdlZCcsXG4gICAgICAgICAgICAgICAgeyBkZXRhaWw6IHsgYWN0aXZlOiBsb2MsIHNhdmVkOiBuZXh0U2F2ZWQgfSB9KSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogSUUtbGVzcyBlbnZpcm9ubWVudHMgLS0gbm8tb3AgKi8gfVxuXG4gICAgICAgIGlmIChwZXJzaXN0ZWQpIHtcbiAgICAgICAgICAgIG9uU2F2ZSgpOyAgICAgICAgICAgLy8gaGFwcHkgcGF0aDogY2xvc2UgKyBtYXJrIHN0ZXAgZG9uZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLyogU3VyZmFjZSB0aGUgd2FybmluZywgaG9sZCB0aGUgbW9kYWwgb3BlbiBmb3IgMS42cyBzbyB0aGVcbiAgICAgICAgICAgICAqIG9wZXJhdG9yIHJlYWRzIGl0LCB0aGVuIGNsb3NlLiAgVGhlIGxvY2FsIGNvcHkgaXMgYWxyZWFkeVxuICAgICAgICAgICAgICogd3JpdHRlbiwgc28gdGhlIGRhc2hib2FyZCB3aWxsIHN0aWxsIHNlZSB0aGUgbmV3IGxvY2F0aW9uXG4gICAgICAgICAgICAgKiBpbiB0aGlzIGJyb3dzZXIgc2Vzc2lvbi4gKi9cbiAgICAgICAgICAgIHNldFNhdmVNc2cod2FybmluZyB8fCAnU2F2ZWQgbG9jYWxseSBvbmx5IOKAlCBzaWduIGluIHRvIHNhdmUgc2VydmVyLXNpZGUuJyk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgc2V0U2F2ZU1zZyhudWxsKTsgb25TYXZlKCk7IH0sIDE2MDApO1xuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPE1vZGFsU2hlbGwgdGl0bGU9XCJMb2NhdGlvbiBTZXR0aW5nXCIgc3VidGl0bGU9XCJDbGljayB0aGUgbWFwLCBkcmFnIHRoZSBwaW4sIG9yIHVzZSB5b3VyIGRldmljZVwiIGFjY2VudD1cImFtYmVyXCIgb25DbG9zZT17b25DbG9zZX0gb25TYXZlPXtwZXJzaXN0QW5kU2F2ZX0gc2l6ZT1cIm1heFwiPlxuICAgICAgICAgICAge3NhdmVNc2cgJiYgKFxuICAgICAgICAgICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJsb2Mtc2F2ZS1tc2dcIlxuICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibWItMyBweC00IHB5LTIuNSByb3VuZGVkLWxnIGJnLWFtYmVyLTkwMC8zMCBib3JkZXIgYm9yZGVyLWFtYmVyLTcwMC81MCB0ZXh0LWFtYmVyLTIwMCB0ZXh0LXhzIGZvbnQtbW9ub1wiPlxuICAgICAgICAgICAgICAgICAgICDimqAgIHtzYXZlTXNnfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBsZzpncmlkLWNvbHMtWzFmcl8zNDBweF0gZ2FwLTQgaC1mdWxsXCIgc3R5bGU9e3ttaW5IZWlnaHQ6JzU2dmgnfX0+XG4gICAgICAgICAgICAgICAgey8qIE1BUCDigJQgZmlsbHMgdGhlIGxlZnQgc2lkZSwgd2l0aCBhIHNlYXJjaCBiYXIgZmxvYXRpbmcgb24gdG9wICovfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmVcIiBzdHlsZT17e21pbkhlaWdodDonNTZ2aCd9fT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiByZWY9e21hcEJveFJlZn1cbiAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBoZWlnaHQ6JzEwMCUnLCBtaW5IZWlnaHQ6JzU2dmgnLCB3aWR0aDonMTAwJScsIGJvcmRlclJhZGl1czonMTJweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6J2hpZGRlbicsIGJvcmRlcjonMXB4IHNvbGlkICMzMzQxNTUnLCBiYWNrZ3JvdW5kOicjMGIxMjIwJyB9fS8+XG5cbiAgICAgICAgICAgICAgICAgICAgey8qIFNlYXJjaCBiYXIgb3ZlcmxheSDigJQgc2l0cyBpbiB0aGUgdG9wLWNlbnRyZSBvZiB0aGUgbWFwICovfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC0zIGxlZnQtMS8yIC10cmFuc2xhdGUteC0xLzIgei1bNTAwXVwiIHN0eWxlPXt7d2lkdGg6J21pbig1NjBweCwgY2FsYygxMDAlIC0gMTEwcHgpKSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17c2VhcmNoUX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRTZWFyY2hRKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Gb2N1cz17KCkgPT4gc2VhcmNoSGl0cy5sZW5ndGggJiYgc2V0U2VhcmNoT3Blbih0cnVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCLwn5SOICBTZWFyY2ggYnkgYWRkcmVzcywgYnVpbGRpbmcsIG9yIHBsYWNlIG5hbWXigKZcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgcHgtNCBweS0yLjUgcm91bmRlZC14bCBiZy1zbGF0ZS05MDAvOTUgYm9yZGVyIGJvcmRlci1zbGF0ZS02MDAgdGV4dC1zbGF0ZS0xMDAgdGV4dC1zbSBwbGFjZWhvbGRlci1zbGF0ZS01MDAgc2hhZG93LTJ4bCBiYWNrZHJvcC1ibHVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tvdXRsaW5lOidub25lJ319Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VhcmNoQnVzeSAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImFic29sdXRlIHJpZ2h0LTMgdG9wLTEvMiAtdHJhbnNsYXRlLXktMS8yIHRleHQtYW1iZXItNDAwIHRleHQteHNcIj7igKY8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VhcmNoT3BlbiAmJiBzZWFyY2hIaXRzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC1mdWxsIGxlZnQtMCByaWdodC0wIG10LTEgYmctc2xhdGUtOTAwLzk3IGJvcmRlciBib3JkZXItc2xhdGUtNzAwIHJvdW5kZWQteGwgc2hhZG93LTJ4bCBvdmVyZmxvdy1oaWRkZW4gbWF4LWgtNzIgb3ZlcmZsb3cteS1hdXRvIGJhY2tkcm9wLWJsdXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWFyY2hIaXRzLm1hcCgoaCwgaSkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PXtoLnBsYWNlX2lkIHx8IGl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBwaWNrU2VhcmNoSGl0KGgpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHRleHQtbGVmdCBweC00IHB5LTIuNSBob3ZlcjpiZy1hbWJlci05MDAvMzAgYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTgwMCBsYXN0OmJvcmRlci1iLTAgdHJhbnNpdGlvbi1hbGxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIHRleHQtc2xhdGUtMjAwIHRydW5jYXRlXCI+e2guZGlzcGxheV9uYW1lfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgbXQtMC41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7aC50eXBlIHx8IGguY2xhc3N9IMK3IHsoK2gubGF0KS50b0ZpeGVkKDMpfSwgeygraC5sb24pLnRvRml4ZWQoMyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlYXJjaE9wZW4gJiYgc2VhcmNoSGl0cy5sZW5ndGggPT09IDAgJiYgc2VhcmNoUS5sZW5ndGggPj0gMyAmJiAhc2VhcmNoQnVzeSAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgdG9wLWZ1bGwgbGVmdC0wIHJpZ2h0LTAgbXQtMSBiZy1zbGF0ZS05MDAvOTcgYm9yZGVyIGJvcmRlci1zbGF0ZS03MDAgcm91bmRlZC14bCBweC00IHB5LTMgdGV4dC14cyB0ZXh0LXNsYXRlLTQwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTm8gcmVzdWx0cyBmb3IgXCJ7c2VhcmNoUX1cIi4gIFRyeSBhIG1vcmUgc3BlY2lmaWMgdGVybS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgIHsvKiBTSURFIFBBTkVMICovfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS00IG92ZXJmbG93LXktYXV0byBwci0xXCI+XG4gICAgICAgICAgICAgICAgICAgIHsvKiBTaXRlIG5hbWUgY29tYm8taW5wdXQuICBGcmVlLWZvcm0gdHlwaW5nIGZvciBmcmVzaFxuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxzOyBhIHZpc2libGUgY2hldnJvbiBidXR0b24gb24gdGhlIHJpZ2h0IG9wZW5zXG4gICAgICAgICAgICAgICAgICAgICAgICBhIGN1c3RvbSBwb3Bkb3duIGxpc3RpbmcgZXZlcnkgc2F2ZWQgbG9jYXRpb24gcHVsbGVkXG4gICAgICAgICAgICAgICAgICAgICAgICBmcm9tIC9hcGkvd2VhdGhlci1sb2NhdGlvbiAoaS5lLiB0aGUgU0FNRSBsaXN0IHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgRGFzaGJvYXJkJ3MgV2VhdGhlciBidXR0b24gc3VyZmFjZXMpLiAgVGhpcyByZXBsYWNlc1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGVhcmxpZXIgbmF0aXZlIDxkYXRhbGlzdD4gd2hpY2ggd2FzIHRvbyBzdWJ0bGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGluIGRhcmsgdGhlbWVzIC0tIG9wZXJhdG9ycyB3aXRoIE4+MCBzYXZlZCBlbnRyaWVzXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VsZCBub3QgdGVsbCBhIGRyb3Bkb3duIGV4aXN0ZWQuICovfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0xLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTaXRlIG5hbWUgKHNhdmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzYXZlZExvY3MubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1sLTIgdGV4dC1hbWJlci00MDAvODAgbm9ybWFsLWNhc2UgdHJhY2tpbmctbm9ybWFsIHRleHQtWzEwcHhdXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJsb2Mtc2F2ZWQtaGludFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg4pa+IHtzYXZlZExvY3MubGVuZ3RofSBzYXZlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZVwiIHJlZj17c2F2ZWRSZWZ9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dCBwci05XCIgdmFsdWU9e2NmZy5zaXRlTmFtZSB8fCAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJsb2Mtc2l0ZS1uYW1lLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3NhdmVkTG9jcy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdQaWNrIGEgc2F2ZWQgbG9jYXRpb24sIG9yIHR5cGUgYSBuZXcgb25l4oCmJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnZS5nLiBIUSBUb3dlciwgTm9ydGggV2luZywgUGF2aWxpb24gQuKApid9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gb25TaXRlTmFtZUNoYW5nZShlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uRm9jdXM9eygpID0+IHNhdmVkTG9jcy5sZW5ndGggPiAwICYmIHNldFNhdmVkT3Blbih0cnVlKX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzYXZlZExvY3MubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJsb2Mtc2F2ZWQtY2hldnJvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0U2F2ZWRPcGVuKHYgPT4gIXYpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJPcGVuIHNhdmVkIGxvY2F0aW9uc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJQaWNrIGZyb20gc2F2ZWQgbG9jYXRpb25zXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSByaWdodC0xIHRvcC0xLzIgLXRyYW5zbGF0ZS15LTEvMiB3LTcgaC03IHJvdW5kZWQtbWQgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgYmctYW1iZXItNzAwLzMwIGhvdmVyOmJnLWFtYmVyLTYwMC81MCBib3JkZXIgYm9yZGVyLWFtYmVyLTUwMC80MCB0ZXh0LWFtYmVyLTIwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjE0XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjIuNFwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIiBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e3RyYW5zZm9ybTogc2F2ZWRPcGVuID8gJ3JvdGF0ZSgxODBkZWcpJyA6ICdub25lJywgdHJhbnNpdGlvbjondHJhbnNmb3JtIC4xNXMnfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlsaW5lIHBvaW50cz1cIjYgOSAxMiAxNSAxOCA5XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NhdmVkT3BlbiAmJiBzYXZlZExvY3MubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJsb2Mtc2F2ZWQtZHJvcGRvd25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIHotWzYwMF0gbGVmdC0wIHJpZ2h0LTAgdG9wLWZ1bGwgbXQtMSBiZy1zbGF0ZS05MDAgYm9yZGVyIGJvcmRlci1zbGF0ZS02MDAgcm91bmRlZC1sZyBzaGFkb3ctMnhsIG1heC1oLTY0IG92ZXJmbG93LXktYXV0b1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3NhdmVkTG9jcy5tYXAobG9jID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0FjdGl2ZSA9IChjZmcuc2l0ZU5hbWUgfHwgJycpLnRyaW0oKSA9PT0gbG9jLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgTWF0aC5hYnMoY2ZnLmxhdCAtIGxvYy5sYXQpIDwgMWUtNFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBNYXRoLmFicyhjZmcubG9uIC0gbG9jLmxvbikgPCAxZS00O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFJvdyBpcyBhIDxkaXYgcm9sZT1cImJ1dHRvblwiPiBpbnN0ZWFkIG9mIDxidXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc28gdGhlIGluLXJvdyB0cmFzaCA8YnV0dG9uPiBpc24ndCBuZXN0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNpZGUgYW5vdGhlciBpbnRlcmFjdGl2ZSBlbGVtZW50LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvd0tleSA9IGAke2xvYy5uYW1lfV9fJHtsb2MubGF0LnRvRml4ZWQoNCl9LCR7bG9jLmxvbi50b0ZpeGVkKDQpfWA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e3Jvd0tleX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb2xlPVwiYnV0dG9uXCIgdGFiSW5kZXg9ezB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gcGlja1NhdmVkTG9jKGxvYyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25LZXlEb3duPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicgfHwgZS5rZXkgPT09ICcgJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlja1NhdmVkTG9jKGxvYyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgbG9jLXNhdmVkLW9wdC0ke2xvYy5uYW1lfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgZ3JvdXAgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgcHgtMyBweS0yIGJvcmRlci1iIGJvcmRlci1zbGF0ZS04MDAgbGFzdDpib3JkZXItYi0wIGhvdmVyOmJnLWFtYmVyLTkwMC8zMCB0cmFuc2l0aW9uLWNvbG9ycyBjdXJzb3ItcG9pbnRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtpc0FjdGl2ZSA/ICdiZy1hbWJlci05MDAvNTAnIDogJyd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMSBtaW4tdy0wXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIHRleHQtc2xhdGUtMTAwIHRydW5jYXRlXCI+e2xvYy5uYW1lfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgZm9udC1tb25vIG10LTAuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bG9jLmxhdC50b0ZpeGVkKDIpfSwge2xvYy5sb24udG9GaXhlZCgyKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qIFRyYXNoIGJ1dHRvbiAtLSBhbHdheXMgcmVuZGVyZWQsIGZhZGVkIHVudGlsIHJvdy1ob3ZlciBzbyBpdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvZXNuJ3QgY2x1dHRlciB0aGUgcmVzdGluZyBzdGF0ZS4gIHN0b3BQcm9wYWdhdGlvbiBwcmV2ZW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSByb3cncyBwaWNrIGhhbmRsZXIgZnJvbSBmaXJpbmcuICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2Bsb2Mtc2F2ZWQtcmVtb3ZlLSR7bG9jLm5hbWV9YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17YFJlbW92ZSAke2xvYy5uYW1lfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPXtgUmVtb3ZlICR7bG9jLm5hbWV9IGZyb20gc2F2ZWQgbG9jYXRpb25zYH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KGUpID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgcmVtb3ZlU2F2ZWRMb2MobG9jKTsgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic2hyaW5rLTAgdy03IGgtNyByb3VuZGVkLW1kIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dC1zbGF0ZS01MDAgaG92ZXI6dGV4dC1yb3NlLTMwMCBob3ZlcjpiZy1yb3NlLTkwMC8zMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHktNDAgZ3JvdXAtaG92ZXI6b3BhY2l0eS0xMDAgdHJhbnNpdGlvbi1vcGFjaXR5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjE0XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjIuMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0zIDZoMThcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNOCA2VjRhMiAyIDAgMCAxIDItMmg0YTIgMiAwIDAgMSAyIDJ2MlwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xOSA2bC0xLjUgMTMuMmEyIDIgMCAwIDEtMiAxLjhIOC41YTIgMiAwIDAgMS0yLTEuOEw1IDZcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTAgMTF2Nk0xNCAxMXY2XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbXQtMSBpdGFsaWNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2F2ZWRMb2NzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnUGljayBhIHByZXZpb3VzbHktc2F2ZWQgbG9jYXRpb24sIG9yIHR5cGUgYSBuZXcgbGFiZWwgZm9yIHRoaXMgcGxhY2UuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdZb3VyIGxhYmVsIGZvciB0aGlzIHBsYWNlIOKAlCBzaG93biBvbiB0aGUgZGFzaGJvYXJkIGhlYWRlci4nfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgey8qIFNvZnQgZHVwbGljYXRlLW5hbWUgd2FybmluZyAtLSBpZiB0aGUgb3BlcmF0b3IgdHlwZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhIG5hbWUgdGhhdCBhbHJlYWR5IGV4aXN0cyBpbiB0aGUgc2F2ZWQgbGlzdCBBVFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERJRkZFUkVOVCBDT09SRElOQVRFUywgc3VyZmFjZSB0aGF0IHNvIHRoZXkgZG9uJ3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaWxlbnRseSBlbmQgdXAgd2l0aCB0d28gXCJIT01FXCJzIHBvaW50aW5nIHRvIHR3b1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpZmZlcmVudCBhZGRyZXNzZXMgKHRoZSBidWcgb3BlcmF0b3ItcmVwb3J0ZWQgb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAyMDI2LTA2LTI4OiBkYXNoYm9hcmQgaGFkIDLDlyBIT01FLCBTZXR1cCBXYWxrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd2VkIG9ubHkgMSkuICBTYW1lIGNvb3JkcyA9IG5vIHdhcm5pbmcsIGl0J3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqdXN0IHJlLXNlbGVjdGluZyBhIGtub3duIHNpdGUuICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgeygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdHlwZWQgPSAoY2ZnLnNpdGVOYW1lIHx8ICcnKS50cmltKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0eXBlZCkgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgcm91bmQgPSAobikgPT4gKE1hdGgucm91bmQobiAqIDEwMDAwKSAvIDEwMDAwKS50b0ZpeGVkKDQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1ciA9IHJvdW5kKGNmZy5sYXQpICsgJywnICsgcm91bmQoY2ZnLmxvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29uZmxpY3QgPSBzYXZlZExvY3MuZmluZChzID0+IHMubmFtZSA9PT0gdHlwZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAocm91bmQocy5sYXQpICsgJywnICsgcm91bmQocy5sb24pKSAhPT0gY3VyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbmZsaWN0KSByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwibG9jLWR1cC1uYW1lLXdhcm5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm10LTIgcHgtMi41IHB5LTIgcm91bmRlZC1tZCBiZy1hbWJlci05NTAvNDAgYm9yZGVyIGJvcmRlci1hbWJlci03MDAvNTAgdGV4dC1bMTAuNXB4XSB0ZXh0LWFtYmVyLTIwMCBsZWFkaW5nLXNudWdcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxiIGNsYXNzTmFtZT1cInRleHQtYW1iZXItMTAwXCI+U2FtZSBuYW1lIGFscmVhZHkgc2F2ZWQ8L2I+IGF0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29kZSBjbGFzc05hbWU9XCJteC0xIGZvbnQtbW9ubyB0ZXh0LWFtYmVyLTEwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtjb25mbGljdC5sYXQudG9GaXhlZCgyKX0sIHtjb25mbGljdC5sb24udG9GaXhlZCgyKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvY29kZT4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTYXZpbmcga2VlcHMgYm90aDsgcGljayBmcm9tIHRoZSBkcm9wZG93biBhYm92ZSB0byBzd2l0Y2ggdG8gdGhlIGV4aXN0aW5nIG9uZSBpbnN0ZWFkLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkoKX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib3JkZXItdCBib3JkZXItc2xhdGUtODAwIHB0LTNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMS41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVzb2x2ZWQgYWRkcmVzcyAvIGNpdHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Z2VvQnVzeSAmJiA8c3BhbiBjbGFzc05hbWU9XCJtbC0yIHRleHQtYW1iZXItNDAwIG5vcm1hbC1jYXNlIHRyYWNraW5nLW5vcm1hbFwiPuKApiByZXNvbHZpbmc8L3NwYW4+fVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIiB2YWx1ZT17Y2ZnLmNpdHl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKT0+c2V0Q2ZnKHsuLi5jZmcsIGNpdHk6ZS50YXJnZXQudmFsdWV9KX0vPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC0zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMS41XCI+TGF0aXR1ZGU8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIiB0eXBlPVwibnVtYmVyXCIgc3RlcD1cIjAuMDAwMVwiIHZhbHVlPXtjZmcubGF0fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpPT5zZXRDZmcoey4uLmNmZywgbGF0OitlLnRhcmdldC52YWx1ZX0pfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0xLjVcIj5Mb25naXR1ZGU8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIiB0eXBlPVwibnVtYmVyXCIgc3RlcD1cIjAuMDAwMVwiIHZhbHVlPXtjZmcubG9ufVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpPT5zZXRDZmcoey4uLmNmZywgbG9uOitlLnRhcmdldC52YWx1ZX0pfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXt1c2VNeUxvY2F0aW9ufVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtnZW9TdGF0ZSA9PT0gJ2J1c3knfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwibG9jLXVzZS1teS1sb2NhdGlvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdy1mdWxsIHB5LTIuNSByb3VuZGVkLWxnIGJvcmRlciB0ZXh0LXhzIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCB0cmFuc2l0aW9uLWNvbG9yc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2dlb1N0YXRlID09PSAnYnVzeSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLWFtYmVyLTkwMC80MCBib3JkZXItYW1iZXItNzAwLzQwIHRleHQtYW1iZXItMjAwIGN1cnNvci13YWl0J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAoZ2VvU3RhdGUgJiYgZ2VvU3RhdGUuZXJyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctcm9zZS05MDAvNDAgYm9yZGVyLXJvc2UtNTAwLzUwIHRleHQtcm9zZS0xMDAgaG92ZXI6Ymctcm9zZS04MDAvNDAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctYW1iZXItNzAwLzcwIGJvcmRlci1hbWJlci01MDAvNDAgdGV4dC1hbWJlci01MCBob3ZlcjpiZy1hbWJlci02MDAvNzAnKX1gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtnZW9TdGF0ZSA9PT0gJ2J1c3knXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAn4o+zICBSZWFkaW5nIGRldmljZSBsb2NhdGlvbuKApidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICfwn5ONICBVc2UgbXkgZGV2aWNlIGxvY2F0aW9uJ31cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIHtnZW9TdGF0ZSAmJiBnZW9TdGF0ZS5lcnIgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cImxvYy1nZW8tZXJyb3JcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCItbXQtMiBweC0zIHB5LTIgcm91bmRlZC1tZCBiZy1yb3NlLTk1MC81MCBib3JkZXIgYm9yZGVyLXJvc2UtNzAwLzQwIHRleHQtWzExcHhdIGxlYWRpbmctc251ZyB0ZXh0LXJvc2UtMjAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGIgY2xhc3NOYW1lPVwidGV4dC1yb3NlLTEwMFwiPkNvdWxkbid0IHJlYWQgbG9jYXRpb24uPC9iPjxici8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1yb3NlLTIwMC85MFwiPntnZW9TdGF0ZS5lcnJ9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBTcGVjaWZpYyBIVFRQLW9yaWdpbiBjYWxsLW91dDogbW9zdCBsaWtlbHkgY2F1c2Ugb24gYSBWMS45IGNvbnRyb2xsZXIuICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cubG9jYXRpb24gJiYgd2luZG93LmxvY2F0aW9uLnByb3RvY29sID09PSAnaHR0cDonICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC0xLjUgdGV4dC1bMTBweF0gdGV4dC1yb3NlLTMwMC84MCBmb250LW1vbm9cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcDogYnJvd3NlcnMgcmVxdWlyZSBIVFRQUyBmb3IgZ2VvbG9jYXRpb24uICBQaWNrIHRoZSBsb2NhdGlvbiBvbiB0aGUgbWFwIG9yIHNlYXJjaCBiYXIgaW5zdGVhZC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICApfVxuXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyLXQgYm9yZGVyLXNsYXRlLTgwMCBwdC0zIG10LTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMlwiPlF1aWNrIGp1bXBzPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonVG9yb250bywgT04nLCAgIGxhdDo0My42NTMyLCBsb246LTc5LjM4MzIsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidOZXcgWW9yaywgTlknLCAgbGF0OjQwLjcxMjgsIGxvbjotNzQuMDA2MCwgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J0xvbmRvbiwgVUsnLCAgICBsYXQ6NTEuNTA3NCwgbG9uOiAtMC4xMjc4LCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonUGFyaXMsIEZSJywgICAgIGxhdDo0OC44NTY2LCBsb246ICAyLjM1MjIsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidUb2t5bywgSlAnLCAgICAgbGF0OjM1LjY3NjIsIGxvbjoxMzkuNjUwMywgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J1N5ZG5leSwgQVUnLCAgICBsYXQ6LTMzLjg2ODgsbG9uOjE1MS4yMDkzLCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXS5tYXAoaiA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PXtqLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIGxhdDpqLmxhdCwgbG9uOmoubG9uLCBjaXR5OmoubmFtZX0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hcFJlZi5jdXJyZW50KSBtYXBSZWYuY3VycmVudC5zZXRWaWV3KFtqLmxhdCwgai5sb25dLCBqLnopO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1sZWZ0IHB4LTIuNSBweS0xLjUgcm91bmRlZC1tZCBiZy1zbGF0ZS04MDAvNzAgYm9yZGVyIGJvcmRlci1zbGF0ZS03MDAgdGV4dC1bMTFweF0gZm9udC1ib2xkIHRleHQtc2xhdGUtMzAwIGhvdmVyOmJnLXNsYXRlLTcwMCBob3Zlcjpib3JkZXItYW1iZXItNTAwLzQwIHRyYW5zaXRpb24tYWxsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ai5uYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBsZWFkaW5nLXJlbGF4ZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIFRpbGVzOiBPcGVuU3RyZWV0TWFwIMK3IEdlb2NvZGU6IE5vbWluYXRpbSAoZnJlZSwgfjEgcmVxL3MpLlxuICAgICAgICAgICAgICAgICAgICAgICAgVXNlZCBmb3IgT3Blbi1NZXRlbyB3ZWF0aGVyIGZlZWQgYW5kIHN1bnJpc2Uvc3Vuc2V0IGVzdGltYXRpb24uXG4gICAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L01vZGFsU2hlbGw+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTGFuZ3VhZ2UgU2V0dGluZyAtLSBtb2RhbFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuZnVuY3Rpb24gTGFuZ3VhZ2VNb2RhbCh7IGNmZywgc2V0Q2ZnLCBvbkNsb3NlLCBvblNhdmUgfSkge1xuICAgIGNvbnN0IGxhbmdzID0gW1xuICAgICAgICB7IGNvZGU6J2VuJywgICAgbGFiZWw6J0VuZ2xpc2gnLCAgICAgICAgICAgICAgICBuYXRpdmU6J0VuZ2xpc2gnICAgIH0sXG4gICAgICAgIHsgY29kZTonemgtQ04nLCBsYWJlbDonQ2hpbmVzZSAoU2ltcGxpZmllZCknLCAgIG5hdGl2ZTon566A5L2T5Lit5paHJyAgICB9LFxuICAgICAgICB7IGNvZGU6J3poLVRXJywgbGFiZWw6J0NoaW5lc2UgKFRyYWRpdGlvbmFsKScsICBuYXRpdmU6J+e5gemrlOS4reaWhycgICAgfSxcbiAgICAgICAgeyBjb2RlOidqYScsICAgIGxhYmVsOidKYXBhbmVzZScsICAgICAgICAgICAgICAgbmF0aXZlOifml6XmnKzoqp4nICAgICAgfSxcbiAgICAgICAgeyBjb2RlOidrbycsICAgIGxhYmVsOidLb3JlYW4nLCAgICAgICAgICAgICAgICAgbmF0aXZlOiftlZzqta3slrQnICAgICAgfSxcbiAgICBdO1xuXG4gICAgLyogT24gU2F2ZSAmIHJldHVybjogd3JpdGUgdGhlIHBpY2tlZCBsYW5ndWFnZSBjb2RlIHRvIHRoZSBzYW1lXG4gICAgICogbG9jYWxTdG9yYWdlIGtleSB0aGUgZGFzaGJvYXJkJ3MgaTE4bi5qcyByZWFkcyAoYGkxOG5fbGFuZ2ApLCBhbmRcbiAgICAgKiBkaXNwYXRjaCB0aGUgYGxhbmdjaGFuZ2VgIGV2ZW50IHNvIGFueSBvcGVuIGRhc2hib2FyZC9jb25maWcgdGFiXG4gICAgICogcGlja3MgaXQgdXAgbGl2ZS4gIFRoaXMgaXMgd2hhdCBtYWtlcyB0aGUgc2V0dXAgd2FsaydzIGxhbmd1YWdlXG4gICAgICogY2hvaWNlIGFjdHVhbGx5IGRyaXZlIHRoZSBkYXNoYm9hcmQgLyBjb25maWcgLyBtYXBwZXIgVUkgLS0gdGhlXG4gICAgICogc2lkZWJhciBzZWxlY3RvciB0aGF0IHVzZWQgdG8gbGl2ZSBpbiB0aGUgZGFzaGJvYXJkIGhlYWRlciBoYXNcbiAgICAgKiBiZWVuIHJlbW92ZWQgKDIwMjYtMDYtMjYpIGFuZCB0aGUgc2V0dXAgd2FsayBpcyBub3cgdGhlIHNpbmdsZVxuICAgICAqIHNvdXJjZSBvZiB0cnV0aCBmb3IgVUkgbGFuZ3VhZ2UuICovXG4gICAgY29uc3QgcGVyc2lzdEFuZFNhdmUgPSAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnaTE4bl9sYW5nJywgY2ZnLmxhbmcpO1xuICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdsYW5nY2hhbmdlJykpO1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdbc2V0dXAgd2Fsa10gaTE4bl9sYW5nIDwtJywgY2ZnLmxhbmcpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1tzZXR1cCB3YWxrXSBjb3VsZCBub3QgcGVyc2lzdCBsYW5ndWFnZTonLCBlKTtcbiAgICAgICAgfVxuICAgICAgICBvblNhdmUoKTtcbiAgICB9O1xuICAgIHJldHVybiAoXG4gICAgICAgIDxNb2RhbFNoZWxsIHRpdGxlPVwiTGFuZ3VhZ2UgU2V0dGluZ1wiIHN1YnRpdGxlPVwiUGljayB5b3VyIGRlZmF1bHQgaW50ZXJmYWNlIGxhbmd1YWdlXCIgYWNjZW50PVwiZW1lcmFsZFwiIG9uQ2xvc2U9e29uQ2xvc2V9IG9uU2F2ZT17cGVyc2lzdEFuZFNhdmV9PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC0zXCI+XG4gICAgICAgICAgICAgICAge2xhbmdzLm1hcChsID0+IChcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e2wuY29kZX0gb25DbGljaz17KCk9PnNldENmZyh7Li4uY2ZnLCBsYW5nOmwuY29kZX0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHRleHQtbGVmdCBwLTMgcm91bmRlZC14bCBib3JkZXItMiB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2NmZy5sYW5nID09PSBsLmNvZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JvcmRlci1lbWVyYWxkLTUwMCBiZy1lbWVyYWxkLTkwMC8yMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JvcmRlci1zbGF0ZS03MDAgYmctc2xhdGUtODAwLzQwIGhvdmVyOmJnLXNsYXRlLTgwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayB0ZXh0LXNsYXRlLTUwMFwiPntsLmNvZGV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1ibGFjayB0ZXh0LXNsYXRlLTIwMFwiPntsLm5hdGl2ZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTFweF0gdGV4dC1zbGF0ZS01MDBcIj57bC5sYWJlbH08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Nb2RhbFNoZWxsPlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFBsdWctaW4gU2V0dGluZyAtLSBtb2RhbCB3LyBsaXN0ICsgdXBsb2FkIHpvbmVcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbi8qIFBlci1wbHVnLWluIG1vY2sgY29uZmlndXJhdGlvbiBmaWVsZHMuICBLZXlzIG1hcCB0byBwbHVnLWluIGBpZGAuICovXG5jb25zdCBQTFVHSU5fQ09ORklHX0ZJRUxEUyA9IHtcbiAgICB3ZWF0aGVyOiAgICBbXG4gICAgICAgIHsga2V5Oidwcm92aWRlcicsICBsYWJlbDonUHJvdmlkZXInLCAgICAgICAgICB0eXBlOidzZWxlY3QnLCAgb3B0aW9uczpbJ09wZW4tTWV0ZW8nLCdOV1MnLCdFQ01XRiddLCBkZWY6J09wZW4tTWV0ZW8nIH0sXG4gICAgICAgIHsga2V5OidyZWZyZXNoJywgICBsYWJlbDonUmVmcmVzaCBpbnRlcnZhbCcsICB0eXBlOidzZWxlY3QnLCAgb3B0aW9uczpbJzEgbWluJywnNSBtaW4nLCcxNSBtaW4nLCczMCBtaW4nLCcxIGgnXSwgZGVmOicxNSBtaW4nIH0sXG4gICAgICAgIHsga2V5OidjYWNoZScsICAgICBsYWJlbDonQ2FjaGUgVFRMIChtaW4pJywgICB0eXBlOidudW1iZXInLCAgZGVmOjMwIH0sXG4gICAgXSxcbiAgICBnaXZvbmk6ICAgICBbXG4gICAgICAgIHsga2V5OidjbGltYXRlJywgICBsYWJlbDonQ2xpbWF0ZSBtb2RlbCcsICAgICB0eXBlOidzZWxlY3QnLCAgb3B0aW9uczpbJ0dpdm9uaSAxOTkyJywnQVNIUkFFIDU1JywnQWRhcHRpdmUnXSwgZGVmOidHaXZvbmkgMTk5MicgfSxcbiAgICAgICAgeyBrZXk6J21hc3NpdmUnLCAgIGxhYmVsOidIZWF2eXdlaWdodCBjb25zdHJ1Y3Rpb24nLCAgdHlwZTondG9nZ2xlJywgZGVmOmZhbHNlIH0sXG4gICAgXSxcbiAgICBzd2VldF9zcG90OiBbXG4gICAgICAgIHsga2V5Oid0cmFja2luZycsICBsYWJlbDonVHJhY2sgb3V0ZG9vciBSSCcsICB0eXBlOid0b2dnbGUnLCBkZWY6dHJ1ZSB9LFxuICAgICAgICB7IGtleTonaHlzdCcsICAgICAgbGFiZWw6J0h5c3RlcmVzaXMgKCUgUkgpJywgdHlwZTonbnVtYmVyJywgZGVmOjIgfSxcbiAgICBdLFxuICAgIGczNjogICAgICAgIFtcbiAgICAgICAgeyBrZXk6J21vZGUnLCAgICAgIGxhYmVsOidTZXF1ZW5jZSBtb2RlJywgICAgIHR5cGU6J3NlbGVjdCcsICBvcHRpb25zOlsnU2luZ2xlLXpvbmUgVkFWJywnTXVsdGktem9uZSBWQVYnLCdET0FTIHcvIEZDVSddLCBkZWY6J011bHRpLXpvbmUgVkFWJyB9LFxuICAgICAgICB7IGtleTondmVyYm9zZScsICAgbGFiZWw6J1ZlcmJvc2UgbG9nZ2luZycsICAgdHlwZTondG9nZ2xlJywgZGVmOmZhbHNlIH0sXG4gICAgXSxcbiAgICBkaWJ0OiAgICAgICBbXG4gICAgICAgIHsga2V5Oidob3N0JywgICAgICBsYWJlbDonQnJpZGdlIGhvc3QnLCAgICAgICB0eXBlOid0ZXh0JywgICBkZWY6JzE5Mi4xNjguMS4xMDAnIH0sXG4gICAgICAgIHsga2V5Oidwb3J0JywgICAgICBsYWJlbDonVGVsZWdyYW0gcG9ydCcsICAgICB0eXBlOidudW1iZXInLCBkZWY6NDc4MDggfSxcbiAgICAgICAgeyBrZXk6J3BvbGxfbXMnLCAgIGxhYmVsOidQb2xsIGludGVydmFsIChtcyknLHR5cGU6J251bWJlcicsIGRlZjoyMDAwIH0sXG4gICAgXSxcbiAgICBsaWdodGluZzogICBbXG4gICAgICAgIHsga2V5OidnYXRld2F5JywgICBsYWJlbDonTW9kYnVzIGdhdGV3YXkgSVAnLCB0eXBlOid0ZXh0JywgICBkZWY6JzEwLjAuMC41MCcgfSxcbiAgICAgICAgeyBrZXk6J3VuaXRfaWQnLCAgIGxhYmVsOidVbml0IElEJywgICAgICAgICAgIHR5cGU6J251bWJlcicsIGRlZjoxIH0sXG4gICAgICAgIHsga2V5Oid0Y3BfcG9ydCcsICBsYWJlbDonVENQIHBvcnQnLCAgICAgICAgICB0eXBlOidudW1iZXInLCBkZWY6NTAyIH0sXG4gICAgXSxcbn07XG5cbmZ1bmN0aW9uIFBsdWdpbnNNb2RhbCh7IGNmZywgc2V0Q2ZnLCBvbkNsb3NlLCBvblNhdmUgfSkge1xuICAgIGNvbnN0IEFMTCA9IFtcbiAgICAgICAgeyBpZDond2VhdGhlcicsICAgICBuYW1lOidXZWF0aGVyJywgICAgICAgICBkZXNjOidPcGVuLU1ldGVvIE9BIGZlZWQnLCAgICAgICAgICB2ZXI6JzIuMS4wJyB9LFxuICAgICAgICB7IGlkOidnaXZvbmknLCAgICAgIG5hbWU6J0dpdm9uaSBFbmdpbmUnLCAgIGRlc2M6J0NsaW1hdGUtc3RyYXRlZ3kgb3ZlcmxheScsICAgIHZlcjonMS4zLjQnIH0sXG4gICAgICAgIHsgaWQ6J3N3ZWV0X3Nwb3QnLCAgbmFtZTonU3dlZXQtU3BvdCBSSCcsICAgZGVzYzonQWRqdXN0YWJsZSBSSCBiYW5kJywgICAgICAgICAgdmVyOicxLjAuMScgfSxcbiAgICAgICAgeyBpZDonZzM2JywgICAgICAgICBuYW1lOidHMzYgU2VxdWVuY2VzJywgICBkZXNjOidBU0hSQUUgR3VpZGVsaW5lIDM2JywgICAgICAgICB2ZXI6JzAuOS4yJyB9LFxuICAgICAgICB7IGlkOidkaWJ0JywgICAgICAgIG5hbWU6J0RJQlQgQnJpZGdlJywgICAgIGRlc2M6J0RlbHRhIENvbnRyb2xzIChESUJUKSBCQUNuZXQgYnJpZGdlJywgICAgICAgICAgIHZlcjonMC40LjAnIH0sXG4gICAgICAgIHsgaWQ6J2xpZ2h0aW5nJywgICAgbmFtZTonTGlnaHRpbmcgKFJlZDUpJywgZGVzYzonVjMuMCBNb2RidXMgVENQIGNsaWVudCcsICAgICAgdmVyOicwLjEuMC1iZXRhJyB9LFxuICAgIF07XG4gICAgY29uc3QgdG9nZ2xlID0gKGlkKSA9PiBzZXRDZmcoYyA9PiAoe1xuICAgICAgICAuLi5jLFxuICAgICAgICBlbmFibGVkOiBjLmVuYWJsZWQuaW5jbHVkZXMoaWQpID8gYy5lbmFibGVkLmZpbHRlcih4ID0+IHggIT09IGlkKSA6IFsuLi5jLmVuYWJsZWQsIGlkXVxuICAgIH0pKTtcblxuICAgIC8qIGV4cGFuc2lvbiBzdGF0ZSDigJQgd2hpY2ggcGx1Zy1pbidzIFwiQ29uZmlndXJlXCIgcGFuZWwgaXMgb3BlbiAqL1xuICAgIGNvbnN0IFtleHBhbmRlZElkLCBzZXRFeHBhbmRlZElkXSA9IFJlYWN0LnVzZVN0YXRlKG51bGwpO1xuXG4gICAgY29uc3QgdXBkYXRlRmllbGQgPSAocGx1Z2luSWQsIGZpZWxkS2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgICBzZXRDZmcoYyA9PiAoe1xuICAgICAgICAgICAgLi4uYyxcbiAgICAgICAgICAgIGZpZWxkczogeyAuLi4oYy5maWVsZHMgfHwge30pLCBbcGx1Z2luSWRdOiB7IC4uLigoYy5maWVsZHMgfHwge30pW3BsdWdpbklkXSB8fCB7fSksIFtmaWVsZEtleV06IHZhbHVlIH0gfVxuICAgICAgICB9KSk7XG4gICAgfTtcblxuICAgIGNvbnN0IGZpZWxkVmFsID0gKHBsdWdpbklkLCBmaWVsZCkgPT4ge1xuICAgICAgICBjb25zdCBzdG9yZWQgPSBjZmcuZmllbGRzICYmIGNmZy5maWVsZHNbcGx1Z2luSWRdICYmIGNmZy5maWVsZHNbcGx1Z2luSWRdW2ZpZWxkLmtleV07XG4gICAgICAgIHJldHVybiBzdG9yZWQgIT09IHVuZGVmaW5lZCA/IHN0b3JlZCA6IGZpZWxkLmRlZjtcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPE1vZGFsU2hlbGwgdGl0bGU9XCJQbHVnLWluIFNldHRpbmdcIiBzdWJ0aXRsZT1cIkVuYWJsZSwgdXBsb2FkIG9yIG1vZGlmeSBwbHVnLWluc1wiIGFjY2VudD1cInBpbmtcIiBvbkNsb3NlPXtvbkNsb3NlfSBvblNhdmU9e29uU2F2ZX0gc2l6ZT1cIndpZGVcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0zIG1heC1oLVs2MHZoXSBvdmVyZmxvdy15LWF1dG8gcHItMVwiPlxuICAgICAgICAgICAgICAgIHtBTEwubWFwKHAgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvbiA9IGNmZy5lbmFibGVkLmluY2x1ZGVzKHAuaWQpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBleHBhbmRlZCA9IGV4cGFuZGVkSWQgPT09IHAuaWQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkcyA9IFBMVUdJTl9DT05GSUdfRklFTERTW3AuaWRdIHx8IFtdO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e3AuaWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHJvdW5kZWQteGwgYm9yZGVyIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7b24gPyAnYm9yZGVyLXBpbmstNTAwLzQwIGJnLXBpbmstOTAwLzEwJyA6ICdib3JkZXItc2xhdGUtNzAwIGJnLXNsYXRlLTgwMC80MCd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7ZXhwYW5kZWQgPyAncmluZy0xIHJpbmctcGluay01MDAvMzAnIDogJyd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcC0zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1ibGFjayB0ZXh0LXNsYXRlLTEwMFwiPntwLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibWwtMiB0ZXh0LVsxMHB4XSBmb250LW1vbm8gdGV4dC1zbGF0ZS01MDBcIj52e3AudmVyfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtc2xhdGUtNDAwXCI+e3AuZGVzY308L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gdG9nZ2xlKHAuaWQpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17YHBsdWdpbi10b2dnbGUtJHtwLmlkfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTMgcHktMSByb3VuZGVkLW1kIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayBib3JkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7b24gPyAnYm9yZGVyLXBpbmstNTAwLzYwIHRleHQtcGluay0zMDAgYmctcGluay05MDAvMzAnIDogJ2JvcmRlci1zbGF0ZS02MDAgdGV4dC1zbGF0ZS00MDAgYmctc2xhdGUtODAwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7b24gPyAnRW5hYmxlZCcgOiAnRGlzYWJsZWQnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHNldEV4cGFuZGVkSWQoZXhwYW5kZWQgPyBudWxsIDogcC5pZCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgcGx1Z2luLWNvbmZpZy0ke3AuaWR9YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHgtMyBweS0xIHJvdW5kZWQtbWQgdGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIGJvcmRlciB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtleHBhbmRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JvcmRlci1waW5rLTUwMCBiZy1waW5rLTkwMC8zMCB0ZXh0LXBpbmstMjAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JvcmRlci1zbGF0ZS02MDAgdGV4dC1zbGF0ZS00MDAgYmctc2xhdGUtODAwIGhvdmVyOmJnLXNsYXRlLTcwMCBob3Zlcjpib3JkZXItcGluay01MDAvNTAgaG92ZXI6dGV4dC1waW5rLTMwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2V4cGFuZGVkID8gJ0Nsb3NlIOKWtCcgOiAnQ29uZmlndXJlIOKWvid9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2V4cGFuZGVkICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJweC00IHBiLTQgYm9yZGVyLXQgYm9yZGVyLXBpbmstNTAwLzIwIGJnLXNsYXRlLTk1MC80MFwiIGRhdGEtdGVzdGlkPXtgcGx1Z2luLWNvbmZpZy1wYW5lbC0ke3AuaWR9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZmllbGRzLmxlbmd0aCA9PT0gMCA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtc2xhdGUtNTAwIGl0YWxpYyBweS0zXCI+Tm8gY29uZmlndXJhYmxlIG9wdGlvbnMgZm9yIHRoaXMgcGx1Zy1pbiB5ZXQuPC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbWQ6Z3JpZC1jb2xzLTIgZ2FwLTMgcHQtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZmllbGRzLm1hcChmID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHYgPSBmaWVsZFZhbChwLmlkLCBmKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e2Yua2V5fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwIGJsb2NrIG1iLTFcIj57Zi5sYWJlbH08L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi50eXBlID09PSAnc2VsZWN0JyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0IGN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3Z9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlRmllbGQocC5pZCwgZi5rZXksIGUudGFyZ2V0LnZhbHVlKX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2Yub3B0aW9ucy5tYXAobyA9PiA8b3B0aW9uIGtleT17b30gdmFsdWU9e299PntvfTwvb3B0aW9uPil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2YudHlwZSA9PT0gJ251bWJlcicgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJudW1iZXJcIiBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3Z9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGVGaWVsZChwLmlkLCBmLmtleSwgK2UudGFyZ2V0LnZhbHVlKX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi50eXBlID09PSAndGV4dCcgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt2fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlRmllbGQocC5pZCwgZi5rZXksIGUudGFyZ2V0LnZhbHVlKX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi50eXBlID09PSAndG9nZ2xlJyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHVwZGF0ZUZpZWxkKHAuaWQsIGYua2V5LCAhdil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHctZnVsbCBweS0yIHJvdW5kZWQtbGcgdGV4dC14cyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgYm9yZGVyIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3ZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1waW5rLTcwMC80MCBib3JkZXItcGluay01MDAvNjAgdGV4dC1waW5rLTIwMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1zbGF0ZS04MDAgYm9yZGVyLXNsYXRlLTYwMCB0ZXh0LXNsYXRlLTQwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3YgPyAnT04nIDogJ09GRid9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1lbmQgZ2FwLTIgbXQtNCBwdC0zIGJvcmRlci10IGJvcmRlci1zbGF0ZS04MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXNldCB0aGlzIHBsdWctaW4ncyBmaWVsZHMgdG8gZGVmYXVsdHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRDZmcoYyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHQgPSB7IC4uLihjLmZpZWxkcyB8fCB7fSkgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG5leHRbcC5pZF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IC4uLmMsIGZpZWxkczogbmV4dCB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTMgcHktMS41IHJvdW5kZWQtbWQgdGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIGJvcmRlciBib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtNDAwIGhvdmVyOmJnLXNsYXRlLTgwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXNldCBkZWZhdWx0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gc2V0RXhwYW5kZWRJZChudWxsKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTMgcHktMS41IHJvdW5kZWQtbWQgdGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIGJnLXBpbmstNjAwIGhvdmVyOmJnLXBpbmstNTAwIHRleHQtd2hpdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRG9uZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTUgcC00IGJvcmRlci0yIGJvcmRlci1kYXNoZWQgYm9yZGVyLXNsYXRlLTcwMCByb3VuZGVkLXhsIHRleHQtY2VudGVyIGhvdmVyOmJvcmRlci1waW5rLTUwMC80MCB0cmFuc2l0aW9uLWFsbCBjdXJzb3ItcG9pbnRlclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC0zeGwgbWItMVwiPuKktDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LWJsYWNrIHRleHQtc2xhdGUtMzAwXCI+RHJvcCBhIC5weSAvIC56aXAgLyAucmVkNSBwbHVnLWluIGhlcmU8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzExcHhdIHRleHQtc2xhdGUtNTAwIG10LTFcIj5vciBjbGljayB0byBjaG9vc2UgYSBmaWxlIChtb2NrIOKAlCBub3Qgd2lyZWQpPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Nb2RhbFNoZWxsPlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE1vZGFsIFNoZWxsIC0tIHNoYXJlZFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuZnVuY3Rpb24gTW9kYWxTaGVsbCh7IHRpdGxlLCBzdWJ0aXRsZSwgYWNjZW50PSdpbmRpZ28nLCBvbkNsb3NlLCBvblNhdmUsIHNpemU9JycsIGNoaWxkcmVuIH0pIHtcbiAgICBjb25zdCBjb2xvck1hcCA9IHtcbiAgICAgICAgaW5kaWdvOicjODE4Y2Y4JywgYW1iZXI6JyNmYmJmMjQnLCBlbWVyYWxkOicjMzRkMzk5JywgcGluazonI2Y0NzJiNidcbiAgICB9O1xuICAgIGNvbnN0IGMgPSBjb2xvck1hcFthY2NlbnRdIHx8ICcjODE4Y2Y4JztcbiAgICBjb25zdCBzaXplTWFwID0ge1xuICAgICAgICB3aWRlOiAnbWF4LXctMnhsJyxcbiAgICAgICAgbWFwOiAgJ21heC13LTN4bCcsXG4gICAgICAgIG1heDogICdtYXgtdy1bOTZ2d10gdy1bOTZ2d10gaC1bOTJ2aF0nLFxuICAgIH07XG4gICAgY29uc3Qgd2lkdGggPSBzaXplTWFwW3NpemVdIHx8ICdtYXgtdy1tZCc7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaXhlZCBpbnNldC0wIHotNTAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgbW9kYWwtYmFja2Ryb3BcIiBvbkNsaWNrPXtvbkNsb3NlfT5cbiAgICAgICAgICAgIHsvKiBGbGV4LWNvbHVtbiBzaGVsbDogaGVhZGVyIChmaXhlZCkgKyBzY3JvbGxhYmxlIGNvbnRlbnQgKyBzdGlja3kgZm9vdGVyLlxuICAgICAgICAgICAgICAgIENyaXRpY2FsIGZvciBzaXplPVwibWF4XCIgd2hlcmUgY2hpbGRyZW4gYWxvbmUgZXhjZWVkIHRoZSBtb2RhbCBoZWlnaHRcbiAgICAgICAgICAgICAgICBhbmQgd291bGQgb3RoZXJ3aXNlIHB1c2ggdGhlIFNhdmUgJiByZXR1cm4gYnV0dG9uIGJlbG93IHRoZSB2aWV3cG9ydC4gKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YGJnLXNsYXRlLTkwMCBib3JkZXItMiByb3VuZGVkLTJ4bCB3LWZ1bGwgJHt3aWR0aH0gbXgtNCBmYWRlLXVwIGZsZXggZmxleC1jb2xgfVxuICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX1cbiAgICAgICAgICAgICAgICAgc3R5bGU9e3tib3JkZXJDb2xvcjpgJHtjfTY2YCwgbWF4SGVpZ2h0OiAnOTJ2aCd9fT5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtc3RhcnQganVzdGlmeS1iZXR3ZWVuIHAtNiBwYi00IGJvcmRlci1iIGJvcmRlci1zbGF0ZS04MDAvNjAgc2hyaW5rLTBcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LWxnIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdFwiIHN0eWxlPXt7Y29sb3I6Y319Pnt0aXRsZX08L2gzPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXNsYXRlLTUwMCBtdC0xXCI+e3N1YnRpdGxlfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJtb2RhbC1jbG9zZVwiIG9uQ2xpY2s9e29uQ2xvc2V9IGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNTAwIGhvdmVyOnRleHQtd2hpdGUgdGV4dC0yeGwgbGVhZGluZy1ub25lXCI+w5c8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMSBtaW4taC0wIG92ZXJmbG93LXktYXV0byBweC02IHB5LTVcIj5cbiAgICAgICAgICAgICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1lbmQgZ2FwLTMgcHgtNiBweS00IGJvcmRlci10IGJvcmRlci1zbGF0ZS04MDAgc2hyaW5rLTAgYmctc2xhdGUtOTAwIHJvdW5kZWQtYi0yeGxcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cIm1vZGFsLWNhbmNlbFwiIG9uQ2xpY2s9e29uQ2xvc2V9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtNCBweS0yIHJvdW5kZWQtbGcgYmctc2xhdGUtODAwIGJvcmRlciBib3JkZXItc2xhdGUtNzAwIHRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIHRleHQtc2xhdGUtNDAwIGhvdmVyOmJnLXNsYXRlLTcwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgQ2FuY2VsXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwibW9kYWwtc2F2ZVwiIG9uQ2xpY2s9e29uU2F2ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC01IHB5LTIgcm91bmRlZC1sZyB0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayB0ZXh0LXdoaXRlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6YywgYm94U2hhZG93OmAwIDAgMTJweCAke2N9NTVgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICBTYXZlICYgcmV0dXJuIOKck1xuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG4vKiBtb3VudCAqL1xuUmVhY3RET00uY3JlYXRlUm9vdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpKS5yZW5kZXIoPEFwcC8+KTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUFBLE1BQUEsR0FBOEJDLEtBQUs7RUFBM0JDLFFBQVEsR0FBQUYsTUFBQSxDQUFSRSxRQUFRO0VBQUVDLE9BQU8sR0FBQUgsTUFBQSxDQUFQRyxPQUFPOztBQUV6QjtBQUNBO0FBQ0E7QUFDQSxJQUFNQyxLQUFLLEdBQUc7QUFDVjtBQUNKO0FBQ0E7QUFDQTtBQUNJO0VBQUVDLEdBQUcsRUFBQyxLQUFLO0VBQU9DLEtBQUssRUFBQyxXQUFXO0VBQVFDLEdBQUcsRUFBQywwQkFBMEI7RUFBUUMsSUFBSSxFQUFDLE1BQU07RUFBR0MsU0FBUyxFQUFDLFNBQVM7RUFBRUMsTUFBTSxFQUFDO0FBQVMsQ0FBQyxFQUNySTtFQUFFTCxHQUFHLEVBQUMsVUFBVTtFQUFFQyxLQUFLLEVBQUMsVUFBVTtFQUFTQyxHQUFHLEVBQUMsbUJBQW1CO0VBQWVDLElBQUksRUFBQyxPQUFPO0VBQUVDLFNBQVMsRUFBQyxTQUFTO0VBQUVDLE1BQU0sRUFBQztBQUFTLENBQUMsRUFDckk7RUFBRUwsR0FBRyxFQUFDLFVBQVU7RUFBRUMsS0FBSyxFQUFDLFVBQVU7RUFBU0MsR0FBRyxFQUFDLDRCQUE0QjtFQUFNQyxJQUFJLEVBQUMsT0FBTztFQUFFQyxTQUFTLEVBQUMsU0FBUztFQUFFQyxNQUFNLEVBQUM7QUFBUyxDQUFDLEVBQ3JJO0VBQUVMLEdBQUcsRUFBQyxTQUFTO0VBQUdDLEtBQUssRUFBQyxTQUFTO0VBQVVDLEdBQUcsRUFBQyx3QkFBd0I7RUFBVUMsSUFBSSxFQUFDLE9BQU87RUFBRUMsU0FBUyxF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SCxPQUFPLEVBQUd6QixDQUFDLElBQUtBLENBQUMsQ0FBQ3NYLGVBQWUsQ0FBQyxDQUFFO0lBQ3BDM1YsS0FBSyxFQUFFO01BQUNvSixXQUFXLEtBQUE3RyxNQUFBLENBQUl3QixDQUFDLE9BQUk7TUFBRStVLFNBQVMsRUFBRTtJQUFNO0VBQUUsZ0JBQ2xEbGUsS0FBQSxDQUFBMkUsYUFBQTtJQUFLTSxTQUFTLEVBQUM7RUFBaUYsZ0JBQzVGakYsS0FBQSxDQUFBMkUsYUFBQSwyQkFDSTNFLEtBQUEsQ0FBQTJFLGFBQUE7SUFBSU0sU0FBUyxFQUFDLDhDQUE4QztJQUFDRyxLQUFLLEVBQUU7TUFBQ2lELEtBQUssRUFBQ2M7SUFBQztFQUFFLEdBQUV3USxLQUFVLENBQUMsZUFDM0YzWixLQUFBLENBQUEyRSxhQUFBO0lBQUdNLFNBQVMsRUFBQztFQUE2QixHQUFFMlUsUUFBWSxDQUN2RCxDQUFDLGVBQ041WixLQUFBLENBQUEyRSxhQUFBO0lBQVEsZUFBWSxhQUFhO0lBQUNPLE9BQU8sRUFBRTRDLE9BQVE7SUFBQzdDLFNBQVMsRUFBQztFQUF1RCxHQUFDLE1BQVMsQ0FDOUgsQ0FBQyxlQUNOakYsS0FBQSxDQUFBMkUsYUFBQTtJQUFLTSxTQUFTLEVBQUM7RUFBMEMsR0FDcER5WSxRQUNBLENBQUMsZUFDTjFkLEtBQUEsQ0FBQTJFLGFBQUE7SUFBS00sU0FBUyxFQUFDO0VBQTZHLGdCQUN4SGpGLEtBQUEsQ0FBQTJFLGFBQUE7SUFBUSxlQUFZLGNBQWM7SUFBQ08sT0FBTyxFQUFFNEMsT0FBUTtJQUM1QzdDLFNBQVMsRUFBQztFQUEwSSxHQUFDLFFBRXJKLENBQUMsZUFDVGpGLEtBQUEsQ0FBQTJFLGFBQUE7SUFBUSxlQUFZLFlBQVk7SUFBQ08sT0FBTyxFQUFFRixNQUFPO0lBQ3pDQyxTQUFTLEVBQUMsOEVBQThFO0lBQ3hGRyxLQUFLLEVBQUU7TUFBQ08sVUFBVSxFQUFDd0QsQ0FBQztNQUFFUixTQUFTLGNBQUFoQixNQUFBLENBQWF3QixDQUFDO0lBQUk7RUFBRSxHQUFDLHNCQUVwRCxDQUNQLENBQ0osQ0FDSixDQUFDO0FBRWQ7O0FBRUE7QUFDQWdWLFFBQVEsQ0FBQ0MsVUFBVSxDQUFDeEwsUUFBUSxDQUFDeUwsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUNDLE1BQU0sY0FBQ3RlLEtBQUEsQ0FBQTJFLGFBQUEsQ0FBQ2hFLEdBQUcsTUFBQyxDQUFDLENBQUMiLCJpZ25vcmVMaXN0IjpbXX0=