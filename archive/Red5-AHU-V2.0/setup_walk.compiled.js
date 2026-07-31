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

/* i18n helpers — resolve against the shared dictionary in js/i18n.js
   (loaded by setup.html before this bundle).  t() falls back to the key
   if i18n.js is somehow absent; useLang() subscribes a component to the
   `langchange` event so the whole wizard re-renders (and re-translates)
   the instant the language is switched. */
var t = k => typeof window !== 'undefined' && window.t ? window.t(k) : k;
var useLang = () => typeof window !== 'undefined' && window.useLang ? window.useLang() : null;

/* =========================================================================
 * STEP DEFINITIONS — the 4 walk paths the user described
 * ========================================================================= */
var STEPS = [
/* Walk order is the pentagon traversal: top → upper-right → lower-right → lower-left → upper-left.
   Labels intentionally drop the redundant "Setting" suffix so the
   main heading inside each circle can render in one line at a larger
   font weight.  labelKey/subKey resolve via t() at render time so they
   track the active language. */
{
  key: 'psy',
  labelKey: 'sw_step_psy',
  subKey: 'sw_step_psy_sub',
  kind: 'page',
  iconColor: '#818cf8',
  accent: 'indigo'
}, {
  key: 'location',
  labelKey: 'sw_step_location',
  subKey: 'sw_step_location_sub',
  kind: 'modal',
  iconColor: '#fbbf24',
  accent: 'amber'
}, {
  key: 'language',
  labelKey: 'sw_step_language',
  subKey: 'sw_step_language_sub',
  kind: 'modal',
  iconColor: '#34d399',
  accent: 'emerald'
}, {
  key: 'plugins',
  labelKey: 'sw_step_plugin',
  subKey: 'sw_step_plugin_sub',
  kind: 'modal',
  iconColor: '#f472b6',
  accent: 'pink'
}, {
  key: 'repair',
  labelKey: 'sw_step_repair',
  subKey: 'sw_step_repair_sub',
  kind: 'link',
  iconColor: '#fb7185',
  accent: 'rose',
  href: '/update.html?from=setup'
}];

/* =========================================================================
 * ROOT APP
 * ========================================================================= */
function App() {
  useLang(); // re-render whole wizard (and all descendants) on language change
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
  }, t('sw_subtitle'))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4"
  }, /*#__PURE__*/React.createElement("a", {
    href: "/dashboard.html",
    onClick: () => {
      try {
        localStorage.setItem('red5.setup.done', '1');
      } catch (e) {}
    },
    className: "text-xs text-slate-500 hover:text-slate-300 underline underline-offset-4"
  }, t('sw_skip_all')))), /*#__PURE__*/React.createElement("div", {
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
    className: "text-[66px] sm:text-[78px] font-black uppercase tracking-tight whitespace-nowrap leading-none\n                                     ".concat(completeCount === 5 ? 'text-emerald-400' : 'text-white'),
    style: {
      textShadow: '0 4px 24px rgba(2,6,23,0.95), 0 0 8px rgba(2,6,23,0.95)'
    }
  }, completeCount, "/5"), /*#__PURE__*/React.createElement("div", {
    className: "text-[30px] sm:text-[33px] font-black uppercase tracking-[0.3em] text-slate-300 mt-3",
    style: {
      textShadow: '0 2px 12px rgba(2,6,23,0.9)'
    }
  }, t('sw_done')))), /*#__PURE__*/React.createElement("div", {
    className: "max-w-5xl mx-auto mt-10 flex items-center justify-between fade-up",
    style: {
      animationDelay: '.18s'
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500 text-xs font-mono"
  }, completeCount === 0 && t('sw_foot_start'), completeCount > 0 && completeCount < 5 && "\u2191 ".concat(5 - completeCount, " ").concat(t('sw_steps_remaining')), completeCount === 5 && t('sw_foot_all_done')), /*#__PURE__*/React.createElement("a", {
    href: "/dashboard.html",
    onClick: () => {
      try {
        localStorage.setItem('red5.setup.done', '1');
      } catch (e) {}
    },
    className: "px-7 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all\n                              ".concat(completeCount === 5 ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20')
  }, t('sw_open_dashboard'))), modal === 'location' && /*#__PURE__*/React.createElement(LocationModal, {
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
    "aria-label": t(step.labelKey),
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
  }, t(step.labelKey)), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-400 text-sm leading-snug"
  }, t(step.subKey)), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-slate-500"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pill bg-slate-800 text-slate-400"
  }, step.kind === 'page' ? t('sw_full_page') : t('sw_popup')), done && /*#__PURE__*/React.createElement("span", {
    className: "pill bg-emerald-900/40 text-emerald-400"
  }, t('sw_configured'))));
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
    "aria-label": t(step.labelKey),
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
    color: step.iconColor,
    size: 44
  })), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] font-black text-slate-600 tracking-wider"
  }, "0", index), /*#__PURE__*/React.createElement("h3", {
    className: "text-[22px] sm:text-[26px] font-black uppercase tracking-tight whitespace-nowrap leading-none mt-1.5",
    style: {
      color: step.iconColor
    }
  }, t(step.labelKey)), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500 text-[10px] sm:text-[11px] leading-snug px-3 mt-1 line-clamp-2"
  }, t(step.subKey)));
}
function TileIcon(_ref3) {
  var kind = _ref3.kind,
    color = _ref3.color,
    _ref3$size = _ref3.size,
    size = _ref3$size === void 0 ? 22 : _ref3$size;
  /* simple inline SVGs so we keep the file self-contained.  `size`
     prop lets the pentagon CircleTile request a 2× icon (44 px) while
     keeping the older grid Tile at the original 22 px. */
  var stroke = {
    stroke: color,
    fill: 'none',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };
  if (kind === 'psy') return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24"
  }, stroke), /*#__PURE__*/React.createElement("path", {
    d: "M3 3v18h18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 17c4-1 7-6 9-9s5-3 9-2"
  }));
  if (kind === 'location') return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24"
  }, stroke), /*#__PURE__*/React.createElement("path", {
    d: "M12 22s-7-6.4-7-12a7 7 0 1 1 14 0c0 5.6-7 12-7 12z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "10",
    r: "2.5"
  }));
  if (kind === 'language') return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24"
  }, stroke), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"
  }));
  if (kind === 'plugins') return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24"
  }, stroke), /*#__PURE__*/React.createElement("path", {
    d: "M9 3v6M15 3v6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 9h14v6a4 4 0 0 1-4 4h-1v3M9 19v3"
  }));
  /* Update & Repair -- wrench + tiny gear bump, signalling "tools" */
  if (kind === 'repair') return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
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
  }, t('sw_back_to_setup')), /*#__PURE__*/React.createElement("h1", {
    className: "text-sm uppercase tracking-[0.3em] font-black text-indigo-400"
  }, t('sw_psy_chart_setting')), /*#__PURE__*/React.createElement("button", {
    onClick: persistAndSave,
    className: "px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs uppercase tracking-widest font-black"
  }, t('sw_save_return'))), /*#__PURE__*/React.createElement("div", {
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
  for (var _t = 20; _t <= 25; _t += 0.5) rh80.push([_t, _getW(_t, 80)]);
  var rh100 = [];
  for (var _t2 = 20; _t2 <= 27; _t2 += 0.5) rh100.push([_t2, _getW(_t2, 100)]);
  var rh20Line = [];
  for (var _t3 = 32; _t3 >= 20; _t3 -= 0.5) rh20Line.push([_t3, _getW(_t3, 20)]);
  var rh20_CZ = [];
  for (var _t4 = 27; _t4 >= 20; _t4 -= 0.5) rh20_CZ.push([_t4, _getW(_t4, 20)]);
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
  for (var _t5 = 18; _t5 <= 19.5; _t5 += 0.5) winterRH80.push([_t5, _getW(_t5, 80)]);
  var winterRH20 = [];
  for (var _t6 = 19.5; _t6 >= 18; _t6 -= 0.5) winterRH20.push([_t6, _getW(_t6, 20)]);
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
    for (var _t7 = T_MIN; _t7 <= T_MAX; _t7 += 0.5) {
      var ww = _getW(_t7, rh);
      if (ww >= W_MIN && ww <= W_MAX) pts.push([_t7, ww]);
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
  }, t('sw_display_mode')), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2 mb-3"
  }, /*#__PURE__*/React.createElement("button", {
    "data-testid": "psy-cfg-theme-dark",
    onClick: () => setCfg(c => _objectSpread(_objectSpread({}, c), {}, {
      theme: 'dark',
      darkLevel: Math.min(c.darkLevel || 2.0, 2.6)
    })),
    className: "py-2.5 rounded-lg text-xs font-black uppercase tracking-widest border transition-all\n                                ".concat(cfg.theme === 'dark' ? 'bg-slate-800 border-yellow-500/70 text-yellow-300 shadow-lg shadow-yellow-500/10' : 'bg-slate-900/30 border-slate-700 text-slate-500 hover:bg-slate-800/60')
  }, t('sw_dim_dark')), /*#__PURE__*/React.createElement("button", {
    "data-testid": "psy-cfg-theme-light",
    onClick: () => setCfg(c => _objectSpread(_objectSpread({}, c), {}, {
      theme: 'light',
      darkLevel: 3.0
    })),
    className: "py-2.5 rounded-lg text-xs font-black uppercase tracking-widest border transition-all\n                                ".concat(cfg.theme === 'light' ? 'bg-slate-100 border-sky-500/70 text-sky-700 shadow-lg shadow-sky-500/10' : 'bg-slate-900/30 border-slate-700 text-slate-500 hover:bg-slate-800/60')
  }, t('sw_light_mode'))), /*#__PURE__*/React.createElement("div", {
    className: cfg.theme === 'light' ? 'opacity-40 pointer-events-none' : ''
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-[10px] uppercase tracking-widest font-bold text-slate-500"
  }, t('sw_dim_brightness')), /*#__PURE__*/React.createElement("span", {
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
  }, t('sw_givoni_engine')), /*#__PURE__*/React.createElement("button", {
    onClick: () => update('givoni', !cfg.givoni),
    className: "w-full py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all\n                                    ".concat(cfg.givoni ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700')
  }, cfg.givoni ? t('sw_givoni_on') : t('sw_givoni_off')), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-500 mt-2 leading-relaxed"
  }, "Overlays the 4 climate-strategy regions (Comfort, Nat Vent, Evap, Mech Cool).")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "field-label mb-2"
  }, t('sw_rh_sweet_spot')), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1 block"
  }, t('sw_venue_preset')), /*#__PURE__*/React.createElement("select", {
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
  }, t('sw_temp_axis_range')), /*#__PURE__*/React.createElement("div", {
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
    title: t('sw_location_setting'),
    subtitle: t('sw_location_sub'),
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
  }, t('sw_latitude')), /*#__PURE__*/React.createElement("input", {
    className: "field-input",
    type: "number",
    step: "0.0001",
    value: cfg.lat,
    onChange: e => setCfg(_objectSpread(_objectSpread({}, cfg), {}, {
      lat: +e.target.value
    }))
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "field-label mb-1.5"
  }, t('sw_longitude')), /*#__PURE__*/React.createElement("input", {
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
  }, t('sw_quick_jumps')), /*#__PURE__*/React.createElement("div", {
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
    title: t('sw_language_setting'),
    subtitle: t('sw_language_sub'),
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
    title: t('sw_plugin_setting'),
    subtitle: t('sw_plugin_sub'),
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
    }, on ? t('sw_enabled') : t('sw_disabled')), /*#__PURE__*/React.createElement("button", {
      onClick: () => setExpandedId(expanded ? null : p.id),
      "data-testid": "plugin-config-".concat(p.id),
      className: "px-3 py-1 rounded-md text-[10px] uppercase tracking-widest font-black border transition-all\n                                                ".concat(expanded ? 'border-pink-500 bg-pink-900/30 text-pink-200' : 'border-slate-600 text-slate-400 bg-slate-800 hover:bg-slate-700 hover:border-pink-500/50 hover:text-pink-300')
    }, expanded ? t('sw_close_up') : t('sw_configure_dd')))), expanded && /*#__PURE__*/React.createElement("div", {
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
    }, t('sw_reset_defaults')), /*#__PURE__*/React.createElement("button", {
      onClick: () => setExpandedId(null),
      className: "px-3 py-1.5 rounded-md text-[10px] uppercase tracking-widest font-black bg-pink-600 hover:bg-pink-500 text-white"
    }, t('sw_done')))));
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
  }, t('cancel')), /*#__PURE__*/React.createElement("button", {
    "data-testid": "modal-save",
    onClick: onSave,
    className: "px-5 py-2 rounded-lg text-xs uppercase tracking-widest font-black text-white",
    style: {
      background: c,
      boxShadow: "0 0 12px ".concat(c, "55")
    }
  }, t('sw_save_return')))));
}

/* mount */
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBfd2Fsay5jb21waWxlZC5qcyIsIm5hbWVzIjpbIl9SZWFjdCIsIlJlYWN0IiwidXNlU3RhdGUiLCJ1c2VNZW1vIiwidCIsImsiLCJ3aW5kb3ciLCJ1c2VMYW5nIiwiU1RFUFMiLCJrZXkiLCJsYWJlbEtleSIsInN1YktleSIsImtpbmQiLCJpY29uQ29sb3IiLCJhY2NlbnQiLCJocmVmIiwiQXBwIiwiX3VzZVN0YXRlIiwicHN5IiwibG9jYXRpb24iLCJsYW5ndWFnZSIsInBsdWdpbnMiLCJyZXBhaXIiLCJfdXNlU3RhdGUyIiwiX3NsaWNlZFRvQXJyYXkiLCJkb25lIiwic2V0RG9uZSIsIl91c2VTdGF0ZTMiLCJfdXNlU3RhdGU0Iiwicm91dGUiLCJzZXRSb3V0ZSIsIl91c2VTdGF0ZTUiLCJfdXNlU3RhdGU2IiwibW9kYWwiLCJzZXRNb2RhbCIsIl91c2VTdGF0ZTciLCJnaXZvbmkiLCJyaFByZXNldCIsInJoTG8iLCJyaEhpIiwidExvIiwidEhpIiwidGhlbWUiLCJkYXJrTGV2ZWwiLCJfdXNlU3RhdGU4IiwicHN5Q2ZnIiwic2V0UHN5Q2ZnIiwiX3VzZVN0YXRlOSIsInNpdGVOYW1lIiwiY2l0eSIsImxhdCIsImxvbiIsIl91c2VTdGF0ZTAiLCJsb2NDZmciLCJzZXRMb2NDZmciLCJfdXNlU3RhdGUxIiwidiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJhbGxvd2VkIiwiaW5kZXhPZiIsImxhbmciLCJlIiwiX3VzZVN0YXRlMTAiLCJsYW5nQ2ZnIiwic2V0TGFuZ0NmZyIsIl91c2VTdGF0ZTExIiwiZW5hYmxlZCIsIl91c2VTdGF0ZTEyIiwicGx1Z2luQ2ZnIiwic2V0UGx1Z2luQ2ZnIiwiY29tcGxldGVDb3VudCIsIk9iamVjdCIsInZhbHVlcyIsImZpbHRlciIsIkJvb2xlYW4iLCJsZW5ndGgiLCJmaW5pc2giLCJkIiwiX29iamVjdFNwcmVhZCIsImNyZWF0ZUVsZW1lbnQiLCJQc3lDaGFydFNldHRpbmdQYWdlIiwiY2ZnIiwic2V0Q2ZnIiwib25CYWNrIiwib25TYXZlIiwiY2xhc3NOYW1lIiwib25DbGljayIsInNldEl0ZW0iLCJzdHlsZSIsIndpZHRoIiwiYXNwZWN0UmF0aW8iLCJhbmltYXRpb25EZWxheSIsInNyYyIsImFsdCIsIm9wYWNpdHkiLCJiYWNrZ3JvdW5kIiwibWFwIiwicyIsImkiLCJhbmdsZURlZyIsImFuZ2xlIiwiTWF0aCIsIlBJIiwiciIsIngiLCJjb3MiLCJ5Iiwic2luIiwiQ2lyY2xlVGlsZSIsInN0ZXAiLCJpbmRleCIsImxlZnRQY3QiLCJ0b3BQY3QiLCJ2aWV3Qm94IiwicHJlc2VydmVBc3BlY3RSYXRpbyIsImlkIiwibWFza1VuaXRzIiwiaGVpZ2h0IiwiZmlsbCIsIl8iLCJhIiwiY3giLCJjeSIsInN0cm9rZSIsInN0cm9rZVdpZHRoIiwibWFzayIsImNvbmNhdCIsInRleHRTaGFkb3ciLCJMb2NhdGlvbk1vZGFsIiwib25DbG9zZSIsIkxhbmd1YWdlTW9kYWwiLCJQbHVnaW5zTW9kYWwiLCJUaWxlIiwiX3JlZiIsImJvcmRlciIsIlRpbGVJY29uIiwiY29sb3IiLCJfcmVmMiIsInJpbmdDb2xvciIsImxlZnQiLCJ0b3AiLCJ0cmFuc2Zvcm0iLCJib3hTaGFkb3ciLCJzaXplIiwiX3JlZjMiLCJfcmVmMyRzaXplIiwic3Ryb2tlTGluZWNhcCIsInN0cm9rZUxpbmVqb2luIiwiX2V4dGVuZHMiLCJfcmVmNCIsInVwZGF0ZSIsImMiLCJ1c2VFZmZlY3QiLCJyYXciLCJwcmVzZXQiLCJwYXRjaCIsInAiLCJKU09OIiwicGFyc2UiLCJOdW1iZXIiLCJpc0Zpbml0ZSIsImxvIiwiaGkiLCJSSF9QUkVTRVRTIiwiZmluZCIsInRoIiwiZGwiLCJwYXJzZUZsb2F0IiwidHJSYXciLCJ0ciIsIm1pbiIsIm1heCIsImtleXMiLCJwZXJzaXN0QW5kU2F2ZSIsInN0cmluZ2lmeSIsIlN0cmluZyIsImRpc3BhdGNoRXZlbnQiLCJDdXN0b21FdmVudCIsImRldGFpbCIsImNvbnNvbGUiLCJpbmZvIiwid2FybiIsIlBzeVNrZWxldG9uIiwiUHN5Q29udHJvbFBhbmVsIiwibGFiZWwiLCJub3RlIiwiX3JlZjUiLCJXIiwiSCIsInBhZCIsInJpZ2h0IiwiYm90dG9tIiwiZ3JpZFciLCJncmlkSCIsIlRfTUlOIiwiVF9NQVgiLCJXX01JTiIsIldfTUFYIiwidyIsIl9nZXRXIiwiZ2V0VyIsInJoIiwic2FmZVB0cyIsImFyciIsInRvRml4ZWQiLCJqb2luIiwicmg4MCIsInB1c2giLCJyaDEwMCIsInJoMjBMaW5lIiwicmgyMF9DWiIsIkNaIiwicmhIaV90b3AiLCJ0dCIsInJoTG9fYm90IiwiU1dFRVQiLCJOViIsIk1hc3MiLCJNQ1YiLCJFVkFQIiwid2ludGVyUkg4MCIsIndpbnRlclJIMjAiLCJXSU5URVIiLCJpc29wbGV0aHMiLCJpc0xpZ2h0IiwicGFsZXR0ZSIsImJnIiwiZ3JpZCIsInRpY2siLCJheGlzIiwicGFuZWxCZyIsInBhbmVsQm9yZGVyIiwicGlsbEJnIiwicGlsbEZnIiwibWV0YUZnIiwiZGltRmlsdGVyIiwiYm9yZGVyQ29sb3IiLCJib3JkZXJSYWRpdXMiLCJBcnJheSIsImZyb20iLCJ4MSIsInkxIiwieDIiLCJ5MiIsImZvbnRTaXplIiwidGV4dEFuY2hvciIsInB0cyIsInd3IiwicG9pbnRzIiwic3Ryb2tlRGFzaGFycmF5IiwiZmxvb3IiLCJmb250V2VpZ2h0IiwiZmlsbE9wYWNpdHkiLCJjbGlwUGF0aFVuaXRzIiwiY2xpcFBhdGgiLCJsZXR0ZXJTcGFjaW5nIiwicGFpbnRPcmRlciIsIl9yZWY2Iiwicm91bmQiLCJ0eXBlIiwidmFsdWUiLCJvbkNoYW5nZSIsInRhcmdldCIsImFjY2VudENvbG9yIiwiX25vcm1hbGl6ZUxvY3MiLCJzZWVuIiwiU2V0Iiwib3V0IiwibCIsIm5hbWUiLCJ0cmltIiwiaGFzIiwiYWRkIiwiX3JlZjciLCJtYXBCb3hSZWYiLCJ1c2VSZWYiLCJtYXBSZWYiLCJtYXJrZXJSZWYiLCJfUmVhY3QkdXNlU3RhdGUiLCJfUmVhY3QkdXNlU3RhdGUyIiwiZ2VvQnVzeSIsInNldEdlb0J1c3kiLCJfUmVhY3QkdXNlU3RhdGUzIiwiaXNBcnJheSIsIl9SZWFjdCR1c2VTdGF0ZTQiLCJzYXZlZExvY3MiLCJzZXRTYXZlZExvY3MiLCJjYW5jZWxsZWQiLCJfYXN5bmNUb0dlbmVyYXRvciIsImZldGNoIiwiY3JlZGVudGlhbHMiLCJjYWNoZSIsIm9rIiwiaiIsImpzb24iLCJzYXZlZCIsIl9SZWFjdCR1c2VTdGF0ZTUiLCJfUmVhY3QkdXNlU3RhdGU2Iiwic2F2ZWRPcGVuIiwic2V0U2F2ZWRPcGVuIiwic2F2ZWRSZWYiLCJvbkRvY0NsaWNrIiwiY3VycmVudCIsImNvbnRhaW5zIiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm9uU2l0ZU5hbWVDaGFuZ2UiLCJuZXdOYW1lIiwiaGl0Iiwic2V0VmlldyIsInBpY2tTYXZlZExvYyIsImxvYyIsInJlbW92ZVNhdmVkTG9jIiwibmV4dCIsIm1ldGhvZCIsImhlYWRlcnMiLCJib2R5IiwiY2F0Y2giLCJyZW5hbWVTYXZlZExvYyIsIm9yaWdMb2MiLCJwcmV2Iiwic3RpbGxTZWxlY3RlZCIsImFicyIsIl9SZWFjdCR1c2VTdGF0ZTciLCJfUmVhY3QkdXNlU3RhdGU4Iiwic2VhcmNoUSIsInNldFNlYXJjaFEiLCJfUmVhY3QkdXNlU3RhdGU5IiwiX1JlYWN0JHVzZVN0YXRlMCIsInNlYXJjaEhpdHMiLCJzZXRTZWFyY2hIaXRzIiwiX1JlYWN0JHVzZVN0YXRlMSIsIl9SZWFjdCR1c2VTdGF0ZTEwIiwic2VhcmNoQnVzeSIsInNldFNlYXJjaEJ1c3kiLCJfUmVhY3QkdXNlU3RhdGUxMSIsIl9SZWFjdCR1c2VTdGF0ZTEyIiwic2VhcmNoT3BlbiIsInNldFNlYXJjaE9wZW4iLCJzZWFyY2hEZWJvdW5jZVJlZiIsInJ1blNlYXJjaCIsIl9yZWY5IiwicSIsInVybCIsImVuY29kZVVSSUNvbXBvbmVudCIsIl94IiwiYXBwbHkiLCJhcmd1bWVudHMiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwicGlja1NlYXJjaEhpdCIsImRpc3BsYXlfbmFtZSIsInJldmVyc2VHZW9jb2RlIiwiX3JlZjAiLCJhZGRyZXNzIiwidG93biIsInZpbGxhZ2UiLCJoYW1sZXQiLCJjb3VudHkiLCJyZWdpb24iLCJzdGF0ZSIsImNvdW50cnkiLCJfeDIiLCJfeDMiLCJMIiwiem9vbUNvbnRyb2wiLCJhdHRyaWJ1dGlvbkNvbnRyb2wiLCJ0aWxlTGF5ZXIiLCJtYXhab29tIiwiYXR0cmlidXRpb24iLCJhZGRUbyIsIm1hcmtlciIsImRyYWdnYWJsZSIsImJpbmRUb29sdGlwIiwicGVybWFuZW50IiwiYXBwbHlMYXRMb24iLCJuIiwib24iLCJsbCIsImdldExhdExuZyIsImxuZyIsInNldExhdExuZyIsImxhdGxuZyIsImludmFsaWRhdGVTaXplIiwicmVtb3ZlIiwicGFuVG8iLCJfUmVhY3QkdXNlU3RhdGUxMyIsIl9SZWFjdCR1c2VTdGF0ZTE0IiwiZ2VvU3RhdGUiLCJzZXRHZW9TdGF0ZSIsInVzZU15TG9jYXRpb24iLCJuYXZpZ2F0b3IiLCJnZW9sb2NhdGlvbiIsImVyciIsImdldEN1cnJlbnRQb3NpdGlvbiIsInBvcyIsImNvb3JkcyIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwibXNnIiwiY29kZSIsIm1lc3NhZ2UiLCJlbmFibGVIaWdoQWNjdXJhY3kiLCJ0aW1lb3V0IiwibWF4aW11bUFnZSIsIl9SZWFjdCR1c2VTdGF0ZTE1IiwiX1JlYWN0JHVzZVN0YXRlMTYiLCJzYXZlTXNnIiwic2V0U2F2ZU1zZyIsIl9yZWYxIiwiZGVkdXBlZCIsIm5leHRTYXZlZCIsInNsaWNlIiwicGVyc2lzdGVkIiwid2FybmluZyIsImFjdGl2ZSIsImRlZmF1bHQiLCJfbGFzdFdlYXRoZXJMb2NhdGlvblNhdmUiLCJNb2RhbFNoZWxsIiwidGl0bGUiLCJzdWJ0aXRsZSIsIm1pbkhlaWdodCIsInJlZiIsIm92ZXJmbG93Iiwib25Gb2N1cyIsInBsYWNlaG9sZGVyIiwib3V0bGluZSIsImgiLCJwbGFjZV9pZCIsImNsYXNzIiwidHJhbnNpdGlvbiIsImlzQWN0aXZlIiwicm93S2V5Iiwicm9sZSIsInRhYkluZGV4Iiwib25LZXlEb3duIiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJ0eXBlZCIsImN1ciIsImNvbmZsaWN0IiwiZGlzYWJsZWQiLCJwcm90b2NvbCIsInoiLCJfcmVmMTAiLCJsYW5ncyIsIm5hdGl2ZSIsIkV2ZW50IiwiUExVR0lOX0NPTkZJR19GSUVMRFMiLCJ3ZWF0aGVyIiwib3B0aW9ucyIsImRlZiIsInN3ZWV0X3Nwb3QiLCJnMzYiLCJkaWJ0IiwibGlnaHRpbmciLCJfcmVmMTEiLCJBTEwiLCJkZXNjIiwidmVyIiwidG9nZ2xlIiwiaW5jbHVkZXMiLCJfUmVhY3QkdXNlU3RhdGUxNyIsIl9SZWFjdCR1c2VTdGF0ZTE4IiwiZXhwYW5kZWRJZCIsInNldEV4cGFuZGVkSWQiLCJ1cGRhdGVGaWVsZCIsInBsdWdpbklkIiwiZmllbGRLZXkiLCJmaWVsZHMiLCJmaWVsZFZhbCIsImZpZWxkIiwic3RvcmVkIiwidW5kZWZpbmVkIiwiZXhwYW5kZWQiLCJmIiwibyIsIl9yZWYxMiIsIl9yZWYxMiRhY2NlbnQiLCJfcmVmMTIkc2l6ZSIsImNoaWxkcmVuIiwiY29sb3JNYXAiLCJpbmRpZ28iLCJhbWJlciIsImVtZXJhbGQiLCJwaW5rIiwic2l6ZU1hcCIsIndpZGUiLCJtYXhIZWlnaHQiLCJSZWFjdERPTSIsImNyZWF0ZVJvb3QiLCJnZXRFbGVtZW50QnlJZCIsInJlbmRlciJdLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXR1cC13YWxrL3NldHVwX3dhbGsuanN4Il0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHsgdXNlU3RhdGUsIHVzZU1lbW8gfSA9IFJlYWN0O1xuXG4vKiBpMThuIGhlbHBlcnMg4oCUIHJlc29sdmUgYWdhaW5zdCB0aGUgc2hhcmVkIGRpY3Rpb25hcnkgaW4ganMvaTE4bi5qc1xuICAgKGxvYWRlZCBieSBzZXR1cC5odG1sIGJlZm9yZSB0aGlzIGJ1bmRsZSkuICB0KCkgZmFsbHMgYmFjayB0byB0aGUga2V5XG4gICBpZiBpMThuLmpzIGlzIHNvbWVob3cgYWJzZW50OyB1c2VMYW5nKCkgc3Vic2NyaWJlcyBhIGNvbXBvbmVudCB0byB0aGVcbiAgIGBsYW5nY2hhbmdlYCBldmVudCBzbyB0aGUgd2hvbGUgd2l6YXJkIHJlLXJlbmRlcnMgKGFuZCByZS10cmFuc2xhdGVzKVxuICAgdGhlIGluc3RhbnQgdGhlIGxhbmd1YWdlIGlzIHN3aXRjaGVkLiAqL1xuY29uc3QgdCA9IChrKSA9PiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LnQgPyB3aW5kb3cudChrKSA6IGspO1xuY29uc3QgdXNlTGFuZyA9ICgpID0+ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cudXNlTGFuZyA/IHdpbmRvdy51c2VMYW5nKCkgOiBudWxsKTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogU1RFUCBERUZJTklUSU9OUyDigJQgdGhlIDQgd2FsayBwYXRocyB0aGUgdXNlciBkZXNjcmliZWRcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmNvbnN0IFNURVBTID0gW1xuICAgIC8qIFdhbGsgb3JkZXIgaXMgdGhlIHBlbnRhZ29uIHRyYXZlcnNhbDogdG9wIOKGkiB1cHBlci1yaWdodCDihpIgbG93ZXItcmlnaHQg4oaSIGxvd2VyLWxlZnQg4oaSIHVwcGVyLWxlZnQuXG4gICAgICAgTGFiZWxzIGludGVudGlvbmFsbHkgZHJvcCB0aGUgcmVkdW5kYW50IFwiU2V0dGluZ1wiIHN1ZmZpeCBzbyB0aGVcbiAgICAgICBtYWluIGhlYWRpbmcgaW5zaWRlIGVhY2ggY2lyY2xlIGNhbiByZW5kZXIgaW4gb25lIGxpbmUgYXQgYSBsYXJnZXJcbiAgICAgICBmb250IHdlaWdodC4gIGxhYmVsS2V5L3N1YktleSByZXNvbHZlIHZpYSB0KCkgYXQgcmVuZGVyIHRpbWUgc28gdGhleVxuICAgICAgIHRyYWNrIHRoZSBhY3RpdmUgbGFuZ3VhZ2UuICovXG4gICAgeyBrZXk6J3BzeScsICAgICAgbGFiZWxLZXk6J3N3X3N0ZXBfcHN5JywgICAgICBzdWJLZXk6J3N3X3N0ZXBfcHN5X3N1YicsICAgICAga2luZDoncGFnZScsICBpY29uQ29sb3I6JyM4MThjZjgnLCBhY2NlbnQ6J2luZGlnbycgfSxcbiAgICB7IGtleTonbG9jYXRpb24nLCBsYWJlbEtleTonc3dfc3RlcF9sb2NhdGlvbicsIHN1YktleTonc3dfc3RlcF9sb2NhdGlvbl9zdWInLCBraW5kOidtb2RhbCcsIGljb25Db2xvcjonI2ZiYmYyNCcsIGFjY2VudDonYW1iZXInICB9LFxuICAgIHsga2V5OidsYW5ndWFnZScsIGxhYmVsS2V5Oidzd19zdGVwX2xhbmd1YWdlJywgc3ViS2V5Oidzd19zdGVwX2xhbmd1YWdlX3N1YicsIGtpbmQ6J21vZGFsJywgaWNvbkNvbG9yOicjMzRkMzk5JywgYWNjZW50OidlbWVyYWxkJ30sXG4gICAgeyBrZXk6J3BsdWdpbnMnLCAgbGFiZWxLZXk6J3N3X3N0ZXBfcGx1Z2luJywgICBzdWJLZXk6J3N3X3N0ZXBfcGx1Z2luX3N1YicsICAga2luZDonbW9kYWwnLCBpY29uQ29sb3I6JyNmNDcyYjYnLCBhY2NlbnQ6J3BpbmsnICAgfSxcbiAgICB7IGtleToncmVwYWlyJywgICBsYWJlbEtleTonc3dfc3RlcF9yZXBhaXInLCAgIHN1YktleTonc3dfc3RlcF9yZXBhaXJfc3ViJywgICBraW5kOidsaW5rJywgIGljb25Db2xvcjonI2ZiNzE4NScsIGFjY2VudDoncm9zZScsIGhyZWY6Jy91cGRhdGUuaHRtbD9mcm9tPXNldHVwJyB9LFxuXTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogUk9PVCBBUFBcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIEFwcCgpIHtcbiAgICB1c2VMYW5nKCk7ICAgLy8gcmUtcmVuZGVyIHdob2xlIHdpemFyZCAoYW5kIGFsbCBkZXNjZW5kYW50cykgb24gbGFuZ3VhZ2UgY2hhbmdlXG4gICAgLyogY29tcGxldGlvbiArIHBlci1zdGVwIGNvbmZpZyAtLSBtb2NrdXAgc3RhdGUsIG5ldmVyIHBlcnNpc3RlZCAqL1xuICAgIGNvbnN0IFtkb25lLCBzZXREb25lXSA9IHVzZVN0YXRlKHsgcHN5OmZhbHNlLCBsb2NhdGlvbjpmYWxzZSwgbGFuZ3VhZ2U6ZmFsc2UsIHBsdWdpbnM6ZmFsc2UsIHJlcGFpcjpmYWxzZSB9KTtcbiAgICBjb25zdCBbcm91dGUsIHNldFJvdXRlXSA9IHVzZVN0YXRlKCdodWInKTsgICAvLyAnaHViJyB8ICdwc3knXG4gICAgY29uc3QgW21vZGFsLCBzZXRNb2RhbF0gPSB1c2VTdGF0ZShudWxsKTsgICAgIC8vICdsb2NhdGlvbicgfCAnbGFuZ3VhZ2UnIHwgJ3BsdWdpbnMnIHwgbnVsbFxuXG4gICAgY29uc3QgW3BzeUNmZywgc2V0UHN5Q2ZnXSAgICAgICAgID0gdXNlU3RhdGUoeyBnaXZvbmk6dHJ1ZSwgcmhQcmVzZXQ6J29mZmljZScsIHJoTG86MzAsIHJoSGk6NjAsIHRMbzotMTUsIHRIaTo1MCwgdGhlbWU6J2RhcmsnLCBkYXJrTGV2ZWw6Mi4wIH0pO1xuICAgIGNvbnN0IFtsb2NDZmcsIHNldExvY0NmZ10gICAgICAgICA9IHVzZVN0YXRlKHsgc2l0ZU5hbWU6J015IEJ1aWxkaW5nJywgY2l0eTonVG9yb250bywgT04nLCBsYXQ6NDMuNjUzMiwgbG9uOi03OS4zODMyIH0pO1xuICAgIGNvbnN0IFtsYW5nQ2ZnLCBzZXRMYW5nQ2ZnXSAgICAgICA9IHVzZVN0YXRlKCgpID0+IHtcbiAgICAgICAgLyogTGF6eSBpbml0IGZyb20gdGhlIHNhbWUgbG9jYWxTdG9yYWdlIGtleSB0aGUgZGFzaGJvYXJkIHJlYWRzLCBzb1xuICAgICAgICAgKiByZW9wZW5pbmcgdGhlIHNldHVwIHdhbGsgc2hvd3MgdGhlIGN1cnJlbnRseS1hY3RpdmUgbGFuZ3VhZ2VcbiAgICAgICAgICogcmF0aGVyIHRoYW4gYWx3YXlzIGRlZmF1bHRpbmcgdG8gRW5nbGlzaC4gKi9cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHYgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnaTE4bl9sYW5nJyk7XG4gICAgICAgICAgICBjb25zdCBhbGxvd2VkID0gWydlbicsJ3poLUNOJywnemgtVFcnLCdqYScsJ2tvJ107XG4gICAgICAgICAgICBpZiAodiAmJiBhbGxvd2VkLmluZGV4T2YodikgIT09IC0xKSByZXR1cm4geyBsYW5nOiB2IH07XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogcHJpdmF0ZSBtb2RlIC0+IGZhbGwgdGhyb3VnaCAqLyB9XG4gICAgICAgIHJldHVybiB7IGxhbmc6J2VuJyB9O1xuICAgIH0pO1xuICAgIGNvbnN0IFtwbHVnaW5DZmcsIHNldFBsdWdpbkNmZ10gICA9IHVzZVN0YXRlKHsgZW5hYmxlZDpbJ3dlYXRoZXInLCdnaXZvbmknLCdzd2VldF9zcG90J10gfSk7XG5cbiAgICBjb25zdCBjb21wbGV0ZUNvdW50ID0gT2JqZWN0LnZhbHVlcyhkb25lKS5maWx0ZXIoQm9vbGVhbikubGVuZ3RoO1xuXG4gICAgY29uc3QgZmluaXNoID0gKGtleSkgPT4ge1xuICAgICAgICBzZXREb25lKGQgPT4gKHsuLi5kLCBba2V5XTp0cnVlfSkpO1xuICAgICAgICBzZXRSb3V0ZSgnaHViJyk7XG4gICAgICAgIHNldE1vZGFsKG51bGwpO1xuICAgIH07XG5cbiAgICAvKiBmdWxsLXBhZ2UgUHN5IENoYXJ0IGVkaXRvciAqL1xuICAgIGlmIChyb3V0ZSA9PT0gJ3BzeScpIHtcbiAgICAgICAgcmV0dXJuIDxQc3lDaGFydFNldHRpbmdQYWdlIGNmZz17cHN5Q2ZnfSBzZXRDZmc9e3NldFBzeUNmZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQmFjaz17KCkgPT4gc2V0Um91dGUoJ2h1YicpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXsoKSA9PiBmaW5pc2goJ3BzeScpfSAvPjtcbiAgICB9XG5cbiAgICAvKiBkZWZhdWx0OiBIVUIgc2NyZWVuICovXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtaW4taC1zY3JlZW4gcHgtNiBweS04XCI+XG4gICAgICAgICAgICB7LyogLS0tLS0tLS0tLS0tLSBoZWFkZXIgLS0tLS0tLS0tLS0tLSAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctNXhsIG14LWF1dG8gZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIG1iLTEwIGZhZGUtdXBcIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwidGV4dC0yeGwgc206dGV4dC0zeGwgZm9udC1ibGFjayBpdGFsaWMgdXBwZXJjYXNlIHRyYWNraW5nLXRpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXJlZC01MDBcIj5SZWQ1PC9zcGFuPiA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlXCI+U3R1ZGlvPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgZm9udC1ub3JtYWwgaXRhbGljXCI+ICZuYnNwOy8mbmJzcDsgc2V0dXAgd2Fsazwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9oMT5cbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgdGV4dC14cyBtdC0xIGZvbnQtbW9ubyB0cmFja2luZy13aWRlXCI+e3QoJ3N3X3N1YnRpdGxlJyl9PC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIi9kYXNoYm9hcmQuaHRtbFwiXG4gICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHsgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDUuc2V0dXAuZG9uZScsJzEnKTsgfSBjYXRjaChlKXt9IH19XG4gICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS01MDAgaG92ZXI6dGV4dC1zbGF0ZS0zMDAgdW5kZXJsaW5lIHVuZGVybGluZS1vZmZzZXQtNFwiPnt0KCdzd19za2lwX2FsbCcpfTwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogLS0tLS0tLS0tLS0tLSBwZW50YWdvbiBsYXlvdXQgLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgIDUgY2lyY3VsYXIgdGlsZXMgYXJyYW5nZWQgYXQgdGhlIGNvcm5lcnMgb2YgYSByZWd1bGFyXG4gICAgICAgICAgICAgICAgcGVudGFnb24uICBQb2xhciBtYXRoczogYW5nbGUgc3RhcnRzIGF0IC05MGRlZyAodG9wKSBhbmRcbiAgICAgICAgICAgICAgICBzdGVwcyBieSArNzJkZWcgY2xvY2t3aXNlLiAgVGhlIGNvbnRhaW5lciBpcyBoZWlnaHQtbG9ja2VkXG4gICAgICAgICAgICAgICAgdmlhIGFzcGVjdCByYXRpbyBzbyB0aGUgcGVudGFnb24gc3RheXMgY2lyY3VsYXIgb24gZXZlcnlcbiAgICAgICAgICAgICAgICB2aWV3cG9ydC4gIFJhZGl1cyBpcyA0MCAlIG9mIHRoZSBjb250YWluZXIgaGFsZi1zaWRlLCBjaXJjbGVcbiAgICAgICAgICAgICAgICBkaWFtZXRlciB+MjcgJSBvZiB0aGUgY29udGFpbmVyIHdpZHRoIC0tIGdpdmVzIGEgY2xlYXJseVxuICAgICAgICAgICAgICAgIHZpc2libGUgZ2FwICh+MjggJSBvZiBjb250YWluZXIgd2lkdGgpIGJldHdlZW4gYWRqYWNlbnRcbiAgICAgICAgICAgICAgICBjaXJjbGVzIHJlZ2FyZGxlc3Mgb2Ygc2NyZWVuIHNpemUuICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBteC1hdXRvIGZhZGUtdXBcIlxuICAgICAgICAgICAgICAgICBzdHlsZT17eyB3aWR0aDonbWluKDc2MHB4LCA5MnZ3KScsIGFzcGVjdFJhdGlvOicxIC8gMScsIGFuaW1hdGlvbkRlbGF5OicuMDhzJyB9fT5cblxuICAgICAgICAgICAgICAgIHsvKiBCYWNrZ3JvdW5kIHBzeS1jaGFydCBsYXllciAtLSBzaXplZCB0byBmaWxsIHRoZSBjb25zdGVsbGF0aW9uXG4gICAgICAgICAgICAgICAgICAgIGNpcmNsZSAofjc4ICUgb2YgY29udGFpbmVyID0ganVzdCBpbnNpZGUgdGhlIGNvbnN0ZWxsYXRpb25cbiAgICAgICAgICAgICAgICAgICAgYXJjIHRoYXQgam9pbnMgdGhlIDUgdGlsZSBjZW50cmVzKS4gIFJlbmRlcmVkIEZJUlNUIHNvIHRoZVxuICAgICAgICAgICAgICAgICAgICA1IHRpbGUgY2lyY2xlcyAobmV4dCBpbiBET00pIHNpdCBvbiB0b3AgYW5kIG9ic2N1cmUgdGhlXG4gICAgICAgICAgICAgICAgICAgIHBvcnRpb24gb2YgdGhlIGNoYXJ0IHRoYXQgb3ZlcmxhcHMgdGhlbS4gIFRoYXQgZ2l2ZXMgdGhlXG4gICAgICAgICAgICAgICAgICAgIFwiaW1hZ2UgcmVjZWRlcyBiZWhpbmQgdGhlIDUgY2lyY2xlc1wiIGVmZmVjdC4gKi99XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBsZWZ0LTEvMiB0b3AtMS8yIC10cmFuc2xhdGUteC0xLzIgLXRyYW5zbGF0ZS15LTEvMiBwb2ludGVyLWV2ZW50cy1ub25lIG92ZXJmbG93LWhpZGRlbiByb3VuZGVkLWZ1bGxcIlxuICAgICAgICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7d2lkdGg6Jzc4JScsIGFzcGVjdFJhdGlvOicxLzEnfX0+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiL2FwaS9hc3NldHMvaW1nL3BzeV9zaWxob3VldHRlLmpwZ1wiIGFsdD1cIlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMCB3LWZ1bGwgaC1mdWxsIG9iamVjdC1jb3ZlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tvcGFjaXR5OjAuNzh9fSAvPlxuICAgICAgICAgICAgICAgICAgICB7LyogRGFyayB2aWduZXR0ZSAvIGxlbnMgLS0gcHVsbHMgdGhlIGNlbnRyZSBkb3duIHNvIHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgTi81IERPTkUgY291bnRlciB0aGF0IGxpdmVzIE9OIFRPUCBzdGF5cyByZWFkYWJsZS4gKi99XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOidyYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IGNlbnRlciwgcmdiYSgyLDYsMjMsMC42MCkgMCUsIHJnYmEoMiw2LDIzLDAuMzUpIDU1JSwgcmdiYSgyLDYsMjMsMC4xMCkgMTAwJSknfX0vPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAge1NURVBTLm1hcCgocywgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmdsZURlZyA9IC05MCArIGkgKiA3MjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5nbGUgPSBhbmdsZURlZyAqIE1hdGguUEkgLyAxODA7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHIgPSA0MDsgICAgICAgICAgICAgICAgICAgICAgICAvLyAlIG9mIGNvbnRhaW5lciBoYWxmLXNpZGVcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeCA9IDUwICsgciAqIE1hdGguY29zKGFuZ2xlKTsgIC8vICVcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeSA9IDUwICsgciAqIE1hdGguc2luKGFuZ2xlKTsgIC8vICVcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDaXJjbGVUaWxlIGtleT17cy5rZXl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGVwPXtzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZT17ZG9uZVtzLmtleV19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleD17aSsxfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdFBjdD17eH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcFBjdD17eX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocy5raW5kID09PSAncGFnZScpICAgICAgc2V0Um91dGUocy5rZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHMua2luZCA9PT0gJ2xpbmsnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNhbWUtdGFiIG5hdiBzbyB0aGUgcmV0dXJuIGJhZGdlIG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZS5odG1sIGNhbiBzaW1wbHkgd2luZG93LmxvY2F0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2sgaGVyZSB3aGVuIHRoZSBvcGVyYXRvciBpcyBkb25lLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHMuaHJlZjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgICAgICAgICAgICAgICAgICAgICAgc2V0TW9kYWwocy5rZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICB7LyogRGVjb3JhdGl2ZSByaW5nOiBhIHNpbmdsZSBjaXJjbGUgd2hvc2UgY2VudHJlIGNvaW5jaWRlc1xuICAgICAgICAgICAgICAgICAgICB3aXRoIHRoZSBjZW50cmUgb2YgdGhlIHBlbnRhZ29uIGFuZCB3aG9zZSByYWRpdXMgZXF1YWxzXG4gICAgICAgICAgICAgICAgICAgIHRoZSBwZW50YWdvbiB2ZXJ0ZXggcmFkaXVzIC0tIGl0cyBib3VuZGFyeSBwYXNzZXNcbiAgICAgICAgICAgICAgICAgICAgY2xlYW5seSB0aHJvdWdoIHRoZSBjZW50cmUgb2YgZWFjaCB0aWxlLiAgVGhlIG1hc2tcbiAgICAgICAgICAgICAgICAgICAgY3V0cyBvdXQgdGhlIGRpc2sgb2YgZXZlcnkgdGlsZSBjaXJjbGUgc28gdGhlIHJpbmcgaXNcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJsZSBPTkxZIGluIHRoZSBnYXBzIGJldHdlZW4gdGlsZXMsIG5ldmVyIGNyb3NzaW5nXG4gICAgICAgICAgICAgICAgICAgIGEgdGlsZSBpbnRlcmlvci4gKi99XG4gICAgICAgICAgICAgICAgPHN2ZyBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC0wIHctZnVsbCBoLWZ1bGwgcG9pbnRlci1ldmVudHMtbm9uZVwiXG4gICAgICAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDEwMCAxMDBcIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPVwibm9uZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGVmcz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxtYXNrIGlkPVwicGVudGFnb24tcmluZy1tYXNrXCIgbWFza1VuaXRzPVwidXNlclNwYWNlT25Vc2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeD1cIjBcIiB5PVwiMFwiIHdpZHRoPVwiMTAwXCIgaGVpZ2h0PVwiMTAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3QgeD1cIjBcIiB5PVwiMFwiIHdpZHRoPVwiMTAwXCIgaGVpZ2h0PVwiMTAwXCIgZmlsbD1cIndoaXRlXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7U1RFUFMubWFwKChfLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGEgPSAoLTkwICsgaSAqIDcyKSAqIE1hdGguUEkgLyAxODA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGN4ID0gNTAgKyA0MCAqIE1hdGguY29zKGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjeSA9IDUwICsgNDAgKiBNYXRoLnNpbihhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogMTcuNSAlIHJhZGl1cyA9IHNhbWUgYXMgdGhlIHRpbGUgY2lyY2xlJ3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFsZi13aWR0aCAoMzUgJSBkaWFtZXRlcik7ICswLjUgJSBudWRnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZWVwcyB0aGUgbWFzayBlZGdlIGluc2lkZSB0aGUgY29sb3VyZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmluZyBzbyB0aGUgd2hpdGUgYXJjIGRvZXNuJ3QgQUxNT1NULXRvdWNoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSByaW5nIGJvcmRlciB3aXRoIGFudGktYWxpYXNlZCBmcmluZ2UuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiA8Y2lyY2xlIGtleT17aX0gY3g9e2N4fSBjeT17Y3l9IHI9XCIxOFwiIGZpbGw9XCJibGFja1wiIC8+O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9tYXNrPlxuICAgICAgICAgICAgICAgICAgICA8L2RlZnM+XG4gICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgY3g9XCI1MFwiIGN5PVwiNTBcIiByPVwiNDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCJyZ2JhKDI1NSwyNTUsMjU1LDAuODUpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2VXaWR0aD1cIjAuNTZcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hc2s9XCJ1cmwoI3BlbnRhZ29uLXJpbmctbWFzaylcIiAvPlxuICAgICAgICAgICAgICAgIDwvc3ZnPlxuXG4gICAgICAgICAgICAgICAgey8qIENlbnRyZWQgY29tcGxldGlvbiBjb3VudGVyIC0tIHNpdHMgYXQgdGhlIGNlbnRyb2lkIG9mIHRoZVxuICAgICAgICAgICAgICAgICAgICBwZW50YWdvbiwgZm9udCB3ZWlnaHQgbWF0Y2hlZCB0byB0aGUgcGVyLXRpbGUgaGVhZGluZyBzbyB0aGVcbiAgICAgICAgICAgICAgICAgICAgZXllIHJlYWRzIGl0IGFzIHRoZSBkb21pbmFudCBzdGF0dXMuICBSZW5kZXJlZCBMQVNUIHNvIGl0XG4gICAgICAgICAgICAgICAgICAgIHNpdHMgb24gdG9wIG9mIGJvdGggdGhlIHBzeS1jaGFydCBzaWxob3VldHRlIGFuZCB0aGUgdGlsZVxuICAgICAgICAgICAgICAgICAgICBjaXJjbGVzLiAqL31cbiAgICAgICAgICAgICAgICB7LyogTi81IERPTkUgdGV4dCAtLSBvd24gYWJzb2x1dGUgbGF5ZXIgcmVuZGVyZWQgQUZURVIgdGhlXG4gICAgICAgICAgICAgICAgICAgIHRpbGUgY2lyY2xlcyBzbyBpdCBhbHdheXMgc2l0cyBvbiB0b3AuICovfVxuICAgICAgICAgICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJzZXR1cC1wcm9ncmVzcy1jZW50ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgbGVmdC0xLzIgdG9wLTEvMiAtdHJhbnNsYXRlLXgtMS8yIC10cmFuc2xhdGUteS0xLzIgdGV4dC1jZW50ZXIgcG9pbnRlci1ldmVudHMtbm9uZSBzZWxlY3Qtbm9uZVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YHRleHQtWzY2cHhdIHNtOnRleHQtWzc4cHhdIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXRpZ2h0IHdoaXRlc3BhY2Utbm93cmFwIGxlYWRpbmctbm9uZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Y29tcGxldGVDb3VudCA9PT0gNSA/ICd0ZXh0LWVtZXJhbGQtNDAwJyA6ICd0ZXh0LXdoaXRlJ31gfVxuICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7dGV4dFNoYWRvdzonMCA0cHggMjRweCByZ2JhKDIsNiwyMywwLjk1KSwgMCAwIDhweCByZ2JhKDIsNiwyMywwLjk1KSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZUNvdW50fS81XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzMwcHhdIHNtOnRleHQtWzMzcHhdIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLVswLjNlbV0gdGV4dC1zbGF0ZS0zMDAgbXQtM1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3t0ZXh0U2hhZG93OicwIDJweCAxMnB4IHJnYmEoMiw2LDIzLDAuOSknfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dCgnc3dfZG9uZScpfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogLS0tLS0tLS0tLS0tLSBmb290ZXIgQ1RBIC0tLS0tLS0tLS0tLS0gKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1heC13LTV4bCBteC1hdXRvIG10LTEwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBmYWRlLXVwXCIgc3R5bGU9e3thbmltYXRpb25EZWxheTonLjE4cyd9fT5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCB0ZXh0LXhzIGZvbnQtbW9ub1wiPlxuICAgICAgICAgICAgICAgICAgICB7Y29tcGxldGVDb3VudCA9PT0gMCAmJiB0KCdzd19mb290X3N0YXJ0Jyl9XG4gICAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZUNvdW50ID4gMCAmJiBjb21wbGV0ZUNvdW50IDwgNSAmJiBg4oaRICR7NSAtIGNvbXBsZXRlQ291bnR9ICR7dCgnc3dfc3RlcHNfcmVtYWluaW5nJyl9YH1cbiAgICAgICAgICAgICAgICAgICAge2NvbXBsZXRlQ291bnQgPT09IDUgJiYgdCgnc3dfZm9vdF9hbGxfZG9uZScpfVxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiL2Rhc2hib2FyZC5odG1sXCJcbiAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7IHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1LnNldHVwLmRvbmUnLCcxJyk7IH0gY2F0Y2goZSl7fSB9fVxuICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTcgcHktMyByb3VuZGVkLXhsIHRleHQtc20gZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2NvbXBsZXRlQ291bnQgPT09IDVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1lbWVyYWxkLTYwMCBob3ZlcjpiZy1lbWVyYWxkLTUwMCB0ZXh0LXdoaXRlIHNoYWRvdy1sZyBzaGFkb3ctZW1lcmFsZC01MDAvMzAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctaW5kaWdvLTYwMCBob3ZlcjpiZy1pbmRpZ28tNTAwIHRleHQtd2hpdGUgc2hhZG93LWxnIHNoYWRvdy1pbmRpZ28tNTAwLzIwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAge3QoJ3N3X29wZW5fZGFzaGJvYXJkJyl9XG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiAtLS0tLS0tLS0tLS0tIG1vZGFscyAtLS0tLS0tLS0tLS0tICovfVxuICAgICAgICAgICAge21vZGFsID09PSAnbG9jYXRpb24nICYmIDxMb2NhdGlvbk1vZGFsIGNmZz17bG9jQ2ZnfSBzZXRDZmc9e3NldExvY0NmZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldE1vZGFsKG51bGwpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXsoKSA9PiBmaW5pc2goJ2xvY2F0aW9uJyl9IC8+fVxuICAgICAgICAgICAge21vZGFsID09PSAnbGFuZ3VhZ2UnICYmIDxMYW5ndWFnZU1vZGFsIGNmZz17bGFuZ0NmZ30gc2V0Q2ZnPXtzZXRMYW5nQ2ZnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0TW9kYWwobnVsbCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNhdmU9eygpID0+IGZpbmlzaCgnbGFuZ3VhZ2UnKX0gLz59XG4gICAgICAgICAgICB7bW9kYWwgPT09ICdwbHVnaW5zJyAgJiYgPFBsdWdpbnNNb2RhbCAgY2ZnPXtwbHVnaW5DZmd9IHNldENmZz17c2V0UGx1Z2luQ2ZnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0TW9kYWwobnVsbCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNhdmU9eygpID0+IGZpbmlzaCgncGx1Z2lucycpfSAvPn1cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogVGlsZSAobGFyZ2UgZWFzeS1vbi1leWVzIGJ1dHRvbikgLS0ga2VwdCBmb3IgYmFjay1jb21wYXQsIG5vIGxvbmdlciB1c2VkXG4gKiBieSB0aGUgcGVudGFnb24gaHViLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuZnVuY3Rpb24gVGlsZSh7IHN0ZXAsIGRvbmUsIGluZGV4LCBvbkNsaWNrIH0pIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BzZXR1cC10aWxlLSR7c3RlcC5rZXl9YH1cbiAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXt0KHN0ZXAubGFiZWxLZXkpfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHRpbGUtYnRuIHJlbGF0aXZlIHRleHQtbGVmdCBiZy1zbGF0ZS05MDAvNzAgYm9yZGVyLTIgYm9yZGVyLXNsYXRlLTcwMC83MFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdW5kZWQtMnhsIHAtNiBzbTpwLTcgJHtkb25lID8gJ2RvbmUnIDogJyd9YH0+XG4gICAgICAgICAgICB7ZG9uZSAmJiA8c3BhbiBjbGFzc05hbWU9XCJjaGVja1wiIGRhdGEtdGVzdGlkPXtgc2V0dXAtdGlsZS0ke3N0ZXAua2V5fS1kb25lYH0+4pyTPC9zcGFuPn1cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTQgbWItM1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy0xMiBoLTEyIHJvdW5kZWQteGwgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOmAke3N0ZXAuaWNvbkNvbG9yfTIyYCwgYm9yZGVyOmAxcHggc29saWQgJHtzdGVwLmljb25Db2xvcn01NWB9fT5cbiAgICAgICAgICAgICAgICAgICAgPFRpbGVJY29uIGtpbmQ9e3N0ZXAua2V5fSBjb2xvcj17c3RlcC5pY29uQ29sb3J9IC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LTN4bCBmb250LWJsYWNrIHRleHQtc2xhdGUtNzAwXCI+MHtpbmRleH08L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtbGcgc206dGV4dC14bCBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlciBtYi0xXCJcbiAgICAgICAgICAgICAgICBzdHlsZT17e2NvbG9yOnN0ZXAuaWNvbkNvbG9yfX0+e3Qoc3RlcC5sYWJlbEtleSl9PC9oMz5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNDAwIHRleHQtc20gbGVhZGluZy1zbnVnXCI+e3Qoc3RlcC5zdWJLZXkpfTwvcD5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNCBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiB0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTUwMFwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInBpbGwgYmctc2xhdGUtODAwIHRleHQtc2xhdGUtNDAwXCI+e3N0ZXAua2luZCA9PT0gJ3BhZ2UnID8gdCgnc3dfZnVsbF9wYWdlJykgOiB0KCdzd19wb3B1cCcpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICB7ZG9uZSAmJiA8c3BhbiBjbGFzc05hbWU9XCJwaWxsIGJnLWVtZXJhbGQtOTAwLzQwIHRleHQtZW1lcmFsZC00MDBcIj57dCgnc3dfY29uZmlndXJlZCcpfTwvc3Bhbj59XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ2lyY2xlVGlsZSAtLSBwZW50YWdvbi1jb3JuZXIgcm91bmQgYnV0dG9uLiAgU2l6ZWQgaW4gJSBvZiBpdHMgY29udGFpbmVyXG4gKiBzbyB0aGUgd2hvbGUgbGF5b3V0IHNjYWxlcyB3aXRoIHZpZXdwb3J0LiAgRWFjaCBjaXJjbGUgaXMgYW5jaG9yZWQgYnkgaXRzXG4gKiBjZW50cmUgKHRyYW5zbGF0ZSAtNTAlLy01MCUpIG9uIHRoZSBwb2xhci1jb21wdXRlZCAobGVmdCUsIHRvcCUpLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuZnVuY3Rpb24gQ2lyY2xlVGlsZSh7IHN0ZXAsIGRvbmUsIGluZGV4LCBsZWZ0UGN0LCB0b3BQY3QsIG9uQ2xpY2sgfSkge1xuICAgIC8qIFRoaWNrIGNvbG91cmVkIHJpbmcgcGVyIHRpbGUgLS0gZWFjaCBzdGVwIGtlZXBzIGl0cyBhY2NlbnQgY29sb3VyXG4gICAgICogKGluZGlnby9hbWJlci9lbWVyYWxkL3Bpbmsvcm9zZSksIHJlaW5mb3JjaW5nIHRoZSBjb2xvdXItY29kZWQgU1ZHXG4gICAgICogaWNvbiBhbmQgdGhlIGhlYWRpbmcgdGV4dC4gKi9cbiAgICBjb25zdCByaW5nQ29sb3IgPSBzdGVwLmljb25Db2xvcjtcbiAgICByZXR1cm4gKFxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BzZXR1cC10aWxlLSR7c3RlcC5rZXl9YH1cbiAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXt0KHN0ZXAubGFiZWxLZXkpfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YGNpcmNsZS10aWxlIGdyb3VwIGFic29sdXRlIHJvdW5kZWQtZnVsbCB0ZXh0LWNlbnRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tMjAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtkb25lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLXNsYXRlLTkwMCBzaGFkb3ctWzBfMF8zMHB4Xy02cHhfcmdiYSgxNiwxODUsMTI5LDAuNTUpXSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctc2xhdGUtOTAwIGhvdmVyOmJnLXNsYXRlLTgwMCd9YH1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBsZWZ0OmAke2xlZnRQY3R9JWAsIHRvcDpgJHt0b3BQY3R9JWAsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOidtaW4oMzUlLCAyNjBweCknLCBhc3BlY3RSYXRpbzonMS8xJyxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOid0cmFuc2xhdGUoLTUwJSwgLTUwJSknLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6YDEwcHggc29saWQgJHtyaW5nQ29sb3J9YCxcbiAgICAgICAgICAgICAgICAgICAgYm94U2hhZG93OmAwIDAgMCAxcHggJHtyaW5nQ29sb3J9MzMsIDAgOHB4IDI4cHggLThweCAke3JpbmdDb2xvcn01NWAsXG4gICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICB7ZG9uZSAmJiAoXG4gICAgICAgICAgICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9e2BzZXR1cC10aWxlLSR7c3RlcC5rZXl9LWRvbmVgfVxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIC10b3AtMSAtcmlnaHQtMSB3LTYgaC02IHJvdW5kZWQtZnVsbCBiZy1lbWVyYWxkLTUwMCB0ZXh0LXdoaXRlIHRleHQteHMgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgZm9udC1ib2xkIHNoYWRvd1wiPlxuICAgICAgICAgICAgICAgICAgICDinJNcbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3VuZGVkLXhsIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIG1iLTFcIlxuICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDonMzQlJywgYXNwZWN0UmF0aW86JzEvMScsXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6YCR7c3RlcC5pY29uQ29sb3J9MjJgLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6YDFweCBzb2xpZCAke3N0ZXAuaWNvbkNvbG9yfTU1YCxcbiAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgPFRpbGVJY29uIGtpbmQ9e3N0ZXAua2V5fSBjb2xvcj17c3RlcC5pY29uQ29sb3J9IHNpemU9ezQ0fSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS02MDAgdHJhY2tpbmctd2lkZXJcIj4we2luZGV4fTwvZGl2PlxuICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtWzIycHhdIHNtOnRleHQtWzI2cHhdIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXRpZ2h0IHdoaXRlc3BhY2Utbm93cmFwIGxlYWRpbmctbm9uZSBtdC0xLjVcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7Y29sb3I6c3RlcC5pY29uQ29sb3J9fT5cbiAgICAgICAgICAgICAgICB7dChzdGVwLmxhYmVsS2V5KX1cbiAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCB0ZXh0LVsxMHB4XSBzbTp0ZXh0LVsxMXB4XSBsZWFkaW5nLXNudWcgcHgtMyBtdC0xIGxpbmUtY2xhbXAtMlwiPlxuICAgICAgICAgICAgICAgIHt0KHN0ZXAuc3ViS2V5KX1cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9idXR0b24+XG4gICAgKTtcbn1cblxuZnVuY3Rpb24gVGlsZUljb24oeyBraW5kLCBjb2xvciwgc2l6ZSA9IDIyIH0pIHtcbiAgICAvKiBzaW1wbGUgaW5saW5lIFNWR3Mgc28gd2Uga2VlcCB0aGUgZmlsZSBzZWxmLWNvbnRhaW5lZC4gIGBzaXplYFxuICAgICAgIHByb3AgbGV0cyB0aGUgcGVudGFnb24gQ2lyY2xlVGlsZSByZXF1ZXN0IGEgMsOXIGljb24gKDQ0IHB4KSB3aGlsZVxuICAgICAgIGtlZXBpbmcgdGhlIG9sZGVyIGdyaWQgVGlsZSBhdCB0aGUgb3JpZ2luYWwgMjIgcHguICovXG4gICAgY29uc3Qgc3Ryb2tlID0geyBzdHJva2U6Y29sb3IsIGZpbGw6J25vbmUnLCBzdHJva2VXaWR0aDoyLCBzdHJva2VMaW5lY2FwOidyb3VuZCcsIHN0cm9rZUxpbmVqb2luOidyb3VuZCcgfTtcbiAgICBpZiAoa2luZCA9PT0gJ3BzeScpICAgICAgcmV0dXJuIDxzdmcgd2lkdGg9e3NpemV9IGhlaWdodD17c2l6ZX0gdmlld0JveD1cIjAgMCAyNCAyNFwiIHsuLi5zdHJva2V9PjxwYXRoIGQ9XCJNMyAzdjE4aDE4XCIvPjxwYXRoIGQ9XCJNMyAxN2M0LTEgNy02IDktOXM1LTMgOS0yXCIvPjwvc3ZnPjtcbiAgICBpZiAoa2luZCA9PT0gJ2xvY2F0aW9uJykgcmV0dXJuIDxzdmcgd2lkdGg9e3NpemV9IGhlaWdodD17c2l6ZX0gdmlld0JveD1cIjAgMCAyNCAyNFwiIHsuLi5zdHJva2V9PjxwYXRoIGQ9XCJNMTIgMjJzLTctNi40LTctMTJhNyA3IDAgMSAxIDE0IDBjMCA1LjYtNyAxMi03IDEyelwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEwXCIgcj1cIjIuNVwiLz48L3N2Zz47XG4gICAgaWYgKGtpbmQgPT09ICdsYW5ndWFnZScpIHJldHVybiA8c3ZnIHdpZHRoPXtzaXplfSBoZWlnaHQ9e3NpemV9IHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB7Li4uc3Ryb2tlfT48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjlcIi8+PHBhdGggZD1cIk0zIDEyaDE4TTEyIDNhMTQgMTQgMCAwIDEgMCAxOE0xMiAzYTE0IDE0IDAgMCAwIDAgMThcIi8+PC9zdmc+O1xuICAgIGlmIChraW5kID09PSAncGx1Z2lucycpICByZXR1cm4gPHN2ZyB3aWR0aD17c2l6ZX0gaGVpZ2h0PXtzaXplfSB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgey4uLnN0cm9rZX0+PHBhdGggZD1cIk05IDN2Nk0xNSAzdjZcIi8+PHBhdGggZD1cIk01IDloMTR2NmE0IDQgMCAwIDEtNCA0aC0xdjNNOSAxOXYzXCIvPjwvc3ZnPjtcbiAgICAvKiBVcGRhdGUgJiBSZXBhaXIgLS0gd3JlbmNoICsgdGlueSBnZWFyIGJ1bXAsIHNpZ25hbGxpbmcgXCJ0b29sc1wiICovXG4gICAgaWYgKGtpbmQgPT09ICdyZXBhaXInKSAgIHJldHVybiA8c3ZnIHdpZHRoPXtzaXplfSBoZWlnaHQ9e3NpemV9IHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB7Li4uc3Ryb2tlfT48cGF0aCBkPVwiTTE0LjcgNi4zYTQgNCAwIDAgMC01LjQgNS40TDMgMThsMyAzIDYuMy02LjNhNCA0IDAgMCAwIDUuNC01LjRsLTIuOCAyLjhMMTMgMTFsLTEuMS0xLjkgMi44LTIuOHpcIi8+PC9zdmc+O1xuICAgIHJldHVybiBudWxsO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBQc3kgQ2hhcnQgU2V0dGluZyAtLSBGVUxMIFBBR0UsIGxpdmUgc2tlbGV0b24gcmVzcG9uZHMgdG8gY29udHJvbHNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIFBzeUNoYXJ0U2V0dGluZ1BhZ2UoeyBjZmcsIHNldENmZywgb25CYWNrLCBvblNhdmUgfSkge1xuICAgIGNvbnN0IHVwZGF0ZSA9IChrLCB2KSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIFtrXTp2fSkpO1xuXG4gICAgLyogT24gbW91bnQ6IGh5ZHJhdGUgZnJvbSB0aGUgU0FNRSBsb2NhbFN0b3JhZ2Uga2V5IHRoZSBkYXNoYm9hcmQgcmVhZHNcbiAgICAgKiAoYHJlZDVfc3dlZXRfc3BvdF9yYW5nZWApIHBsdXMgdGhlIHByZXNldCBpZCAoYHJlZDVfcmhfcHJlc2V0YCkgc29cbiAgICAgKiB0aGUgZHJvcGRvd24gbGFiZWwgc3RheXMgY29uc2lzdGVudCB3aXRoIHRoZSBzbGlkZXIgdmFsdWVzIGFjcm9zc1xuICAgICAqIHJlbG9hZHMuICBJZiB0aGUgb3BlcmF0b3IgaGFzIGFscmVhZHkgdHVuZWQgdGhlIFJIIGJhbmQgb24gdGhlXG4gICAgICogZGFzaGJvYXJkLCB0aGUgc2V0dXAgd2FsayBzdGFydHMgZnJvbSB0aG9zZSB2YWx1ZXMuICovXG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJhdyAgICA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWQ1X3N3ZWV0X3Nwb3RfcmFuZ2UnKTtcbiAgICAgICAgICAgIGNvbnN0IHByZXNldCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWQ1X3JoX3ByZXNldCcpO1xuICAgICAgICAgICAgY29uc3QgcGF0Y2ggID0ge307XG4gICAgICAgICAgICBpZiAocmF3KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcCA9IEpTT04ucGFyc2UocmF3KTtcbiAgICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHAubG8pICYmIE51bWJlci5pc0Zpbml0ZShwLmhpKSAmJiBwLmxvIDwgcC5oaSkge1xuICAgICAgICAgICAgICAgICAgICBwYXRjaC5yaExvID0gcC5sbztcbiAgICAgICAgICAgICAgICAgICAgcGF0Y2gucmhIaSA9IHAuaGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByZXNldCAmJiBSSF9QUkVTRVRTLmZpbmQoeCA9PiB4LmlkID09PSBwcmVzZXQpKSB7XG4gICAgICAgICAgICAgICAgcGF0Y2gucmhQcmVzZXQgPSBwcmVzZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBUaGVtZSArIGJyaWdodG5lc3Mg4oCUIHNhbWUga2V5cyBhcHAuanMgKGRhc2hib2FyZCkgcmVhZHMuICovXG4gICAgICAgICAgICBjb25zdCB0aCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWQ1LnRoZW1lJyk7XG4gICAgICAgICAgICBpZiAodGggPT09ICdsaWdodCcgfHwgdGggPT09ICdkYXJrJykgcGF0Y2gudGhlbWUgPSB0aDtcbiAgICAgICAgICAgIGNvbnN0IGRsID0gcGFyc2VGbG9hdChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVkNS5kYXJrTGV2ZWwnKSk7XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGRsKSAmJiBkbCA+PSAxLjUgJiYgZGwgPD0gMy4wKSBwYXRjaC5kYXJrTGV2ZWwgPSBkbDtcbiAgICAgICAgICAgIC8qIFRlbXBlcmF0dXJlIGF4aXMgcmFuZ2Ug4oCUIHdyaXR0ZW4gYnkgdGhpcyBzYW1lIHBhZ2UncyBzYXZlXG4gICAgICAgICAgICAgKiBoYW5kbGVyOyBsb2FkIGl0IGhlcmUgc28gcmVvcGVuaW5nIHRoZSBzZXR1cCB3YWxrIHNob3dzIHRoZVxuICAgICAgICAgICAgICogY3VycmVudCBkYXNoYm9hcmQgYXhpcyBpbnN0ZWFkIG9mIGFsd2F5cyBkZWZhdWx0aW5nIHRvIC0xNS4uNTAuICovXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRyUmF3ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlZDVfdGVtcF9yYW5nZScpO1xuICAgICAgICAgICAgICAgIGlmICh0clJhdykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ciA9IEpTT04ucGFyc2UodHJSYXcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHRyLm1pbikgJiYgTnVtYmVyLmlzRmluaXRlKHRyLm1heCkgJiYgdHIubWluIDwgdHIubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRjaC50TG8gPSB0ci5taW47XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRjaC50SGkgPSB0ci5tYXg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7IC8qIGlnbm9yZSAqLyB9XG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMocGF0Y2gpLmxlbmd0aCkgc2V0Q2ZnKGMgPT4gKHsuLi5jLCAuLi5wYXRjaH0pKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBpZ25vcmUgKi8gfVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgICB9LCBbXSk7XG5cbiAgICAvKiBPbiBzYXZlOiBwZXJzaXN0IHRoZSBSSCBiYW5kIHRvIGxvY2FsU3RvcmFnZSBzbyB0aGUgZGFzaGJvYXJkJ3NcbiAgICAgKiBzd2VldC1zcG90IHBvbHlnb24gcGlja3MgaXQgdXAgb24gbmV4dCBsb2FkLiAgQWxzbyBwZXJzaXN0IHRoZSB2ZW51ZVxuICAgICAqIHByZXNldCBpZCAoZm9yIGZ1dHVyZSBcInNob3cgcHJlc2V0IG5hbWUgb24gZGFzaGJvYXJkXCIgZmVhdHVyZXMpLiAqL1xuICAgIGNvbnN0IHBlcnNpc3RBbmRTYXZlID0gKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDVfc3dlZXRfc3BvdF9yYW5nZScsXG4gICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoeyBsbzogY2ZnLnJoTG8sIGhpOiBjZmcucmhIaSB9KSk7XG4gICAgICAgICAgICBpZiAoY2ZnLnJoUHJlc2V0KSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDVfcmhfcHJlc2V0JywgY2ZnLnJoUHJlc2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIFRoZW1lICsgYnJpZ2h0bmVzcyDigJQgd3JpdHRlbiB0byB0aGUgU0FNRSBrZXlzIHRoZSBkYXNoYm9hcmRcbiAgICAgICAgICAgICAqIChhcHAuanMgbGluZXMgNTctNTggYW5kIDg0LTk3KSByZWFkcyBhcyBpdHMgdXNlU3RhdGUgbGF6eVxuICAgICAgICAgICAgICogaW5pdGlhbGlzZXIsIHNvIHRoZSBjaG9zZW4gdGhlbWUgdGFrZXMgZWZmZWN0IG9uIG5leHQgZGFzaGJvYXJkXG4gICAgICAgICAgICAgKiBsb2FkLiAgYXBwLmpzIHRyZWF0cyBkYXJrTGV2ZWwgPj0gMy4wIGFzIGxpZ2h0LW1vZGUgdHJpZ2dlci4gKi9cbiAgICAgICAgICAgIGlmIChjZmcudGhlbWUgPT09ICdsaWdodCcgfHwgY2ZnLnRoZW1lID09PSAnZGFyaycpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS50aGVtZScsIGNmZy50aGVtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGNmZy5kYXJrTGV2ZWwpKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDUuZGFya0xldmVsJywgU3RyaW5nKGNmZy5kYXJrTGV2ZWwpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIFRlbXBlcmF0dXJlIGF4aXMgcmFuZ2Ug4oCUIGRyaXZlcyB0aGUgZGFzaGJvYXJkJ3MgcHN5IGNoYXJ0XG4gICAgICAgICAgICAgKiBYIGF4aXMgKGB0ZW1wUmFuZ2UubWluL21heGAgaW4gYXBwLmpzKS4gIFdlIHdyaXRlIHRoZSBzYW1lXG4gICAgICAgICAgICAgKiBzaGFwZSBhcHAuanMgcmVhZHMgKGB7bWluLCBtYXh9YCkgc28gaXRzIGxhenkgdXNlU3RhdGUgaW5pdFxuICAgICAgICAgICAgICogcGlja3MgaXQgdXAgb24gbmV4dCBsb2FkLCBBTkQgZGlzcGF0Y2ggYSBjdXN0b20gZXZlbnQgc29cbiAgICAgICAgICAgICAqIGFueSBvcGVuIGRhc2hib2FyZCB0YWIgdXBkYXRlcyBsaXZlIHdpdGhvdXQgYSByZWZyZXNoLiAqL1xuICAgICAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShjZmcudExvKSAmJiBOdW1iZXIuaXNGaW5pdGUoY2ZnLnRIaSkgJiYgY2ZnLnRMbyA8IGNmZy50SGkpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNV90ZW1wX3JhbmdlJyxcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoeyBtaW46IGNmZy50TG8sIG1heDogY2ZnLnRIaSB9KSk7XG4gICAgICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdyNS10ZW1wLXJhbmdlLWNoYW5nZScsIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7IG1pbjogY2ZnLnRMbywgbWF4OiBjZmcudEhpIH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3I1LXJoLWJhbmQtY2hhbmdlJywge1xuICAgICAgICAgICAgICAgIGRldGFpbDogeyBsbzogY2ZnLnJoTG8sIGhpOiBjZmcucmhIaSB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ1tzZXR1cCB3YWxrXSBwc3kgY2hhcnQgc2F2ZWQgLT4gUkgnLCBjZmcucmhMbywgJy0nLCBjZmcucmhIaSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAnJSBULWF4aXMnLCBjZmcudExvLCAnLi4nLCBjZmcudEhpLCAnwrBDIHByZXNldD0nLCBjZmcucmhQcmVzZXQpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1tzZXR1cCB3YWxrXSBjb3VsZCBub3QgcGVyc2lzdCBwc3kgc2V0dGluZ3M6JywgZSk7XG4gICAgICAgIH1cbiAgICAgICAgb25TYXZlKCk7XG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWluLWgtc2NyZWVuIGZsZXggZmxleC1jb2xcIj5cbiAgICAgICAgICAgIHsvKiBoZWFkZXIgKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBweC02IHB5LTQgYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTgwMFwiPlxuICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17b25CYWNrfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS00MDAgaG92ZXI6dGV4dC13aGl0ZSB0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFja1wiPlxuICAgICAgICAgICAgICAgICAgICB7dCgnc3dfYmFja190b19zZXR1cCcpfVxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJ0ZXh0LXNtIHVwcGVyY2FzZSB0cmFja2luZy1bMC4zZW1dIGZvbnQtYmxhY2sgdGV4dC1pbmRpZ28tNDAwXCI+e3QoJ3N3X3BzeV9jaGFydF9zZXR0aW5nJyl9PC9oMT5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3BlcnNpc3RBbmRTYXZlfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtNSBweS0yIHJvdW5kZWQtbGcgYmctaW5kaWdvLTYwMCBob3ZlcjpiZy1pbmRpZ28tNTAwIHRleHQtd2hpdGUgdGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2tcIj5cbiAgICAgICAgICAgICAgICAgICAge3QoJ3N3X3NhdmVfcmV0dXJuJyl9XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIGJvZHkg4oCUIGNoYXJ0IGxlZnQsIGNvbnRyb2xzIHJpZ2h0ICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTEgZ3JpZCBncmlkLWNvbHMtMSBsZzpncmlkLWNvbHMtWzFmcl8zNjBweF0gZ2FwLTQgcC02IG1heC13LTd4bCBteC1hdXRvIHctZnVsbFwiPlxuICAgICAgICAgICAgICAgIDxQc3lTa2VsZXRvbiBjZmc9e2NmZ30gLz5cbiAgICAgICAgICAgICAgICA8UHN5Q29udHJvbFBhbmVsIGNmZz17Y2ZnfSB1cGRhdGU9e3VwZGF0ZX0gc2V0Q2ZnPXtzZXRDZmd9IC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuLyogUkggYmFuZCBwcmVzZXRzIOKAlCByZWNvZ25pc2VkIGluZHVzdHJ5IHN0YW5kYXJkcyBmb3IgZWFjaCB2ZW51ZSB0eXBlLlxuICogU291cmNlczogQVNIUkFFIDU1IChjb21mb3J0KSwgQVNIUkFFIDE3MCAoaGVhbHRoY2FyZSksXG4gKiBBQU0vTlBTL1NtaXRoc29uaWFuIGd1aWRhbmNlIChjb2xsZWN0aW9ucyksIENJQlNFIFRNNDAgKGxpYnJhcmllcykuICovXG5jb25zdCBSSF9QUkVTRVRTID0gW1xuICAgIHsgaWQ6J2N1c3RvbScsICAgICAgICAgIGxhYmVsOidDdXN0b20gKG1hbnVhbCknLCAgICAgICAgICAgICAgICAgbG86bnVsbCwgaGk6bnVsbCwgbm90ZTonJyB9LFxuICAgIHsgaWQ6J29mZmljZScsICAgICAgICAgIGxhYmVsOidPZmZpY2UnLCAgICAgICAgICAgICAgICAgICAgICAgICAgbG86MzAsICAgaGk6NjAsICAgbm90ZTonQVNIUkFFIDU1IGNvbWZvcnQnICAgICAgICAgICAgICAgICAgfSxcbiAgICB7IGlkOidtdXNldW0nLCAgICAgICAgICBsYWJlbDonTXVzZXVtJywgICAgICAgICAgICAgICAgICAgICAgICAgIGxvOjQwLCAgIGhpOjU1LCAgIG5vdGU6J0FBTSBjb2xsZWN0aW9uIHByZXNlcnZhdGlvbicgICAgICAgIH0sXG4gICAgeyBpZDonaG90ZWwnLCAgICAgICAgICAgbGFiZWw6J0hvdGVsIGd1ZXN0IHJvb20nLCAgICAgICAgICAgICAgICBsbzozMCwgICBoaTo2MCwgICBub3RlOidnZW5lcmFsIG9jY3VwYW50IGNvbWZvcnQnICAgICAgICAgICB9LFxuICAgIHsgaWQ6J2xpYnJhcnknLCAgICAgICAgIGxhYmVsOidMaWJyYXJ5IC8gQXJjaGl2ZScsICAgICAgICAgICAgICAgbG86NDAsICAgaGk6NTUsICAgbm90ZToncGFwZXIgJiBiaW5kaW5nIHByZXNlcnZhdGlvbicgICAgICAgfSxcbiAgICB7IGlkOidob3NwaXRhbCcsICAgICAgICBsYWJlbDonSG9zcGl0YWwgKGdlbmVyYWwpJywgICAgICAgICAgICAgIGxvOjMwLCAgIGhpOjYwLCAgIG5vdGU6J0FTSFJBRSAxNzAgcGF0aWVudCBhcmVhcycgICAgICAgICAgIH0sXG4gICAgeyBpZDonbGVjdHVyZScsICAgICAgICAgbGFiZWw6J0xlY3R1cmUgaGFsbCcsICAgICAgICAgICAgICAgICAgICBsbzozMCwgICBoaTo2MCwgICBub3RlOidoaWdoIG9jY3VwYW5jeSBjb21mb3J0JyAgICAgICAgICAgICB9LFxuICAgIHsgaWQ6J2NvbmNlcnQnLCAgICAgICAgIGxhYmVsOidDb25jZXJ0IGhhbGwnLCAgICAgICAgICAgICAgICAgICAgbG86NDAsICAgaGk6NTUsICAgbm90ZTonaW5zdHJ1bWVudCB0dW5pbmcgc3RhYmlsaXR5JyAgICAgICAgfSxcbiAgICB7IGlkOidtZWV0aW5nJywgICAgICAgICBsYWJlbDonTWVldGluZyByb29tJywgICAgICAgICAgICAgICAgICAgIGxvOjMwLCAgIGhpOjYwLCAgIG5vdGU6J3NtYWxsIGdyb3VwIGNvbWZvcnQnICAgICAgICAgICAgICAgIH0sXG4gICAgeyBpZDonZXhoaWJpdGlvbicsICAgICAgbGFiZWw6J0V4aGliaXRpb24gaGFsbCcsICAgICAgICAgICAgICAgICBsbzo0MCwgICBoaTo1NSwgICBub3RlOidtaXhlZCBhcnQgLyBhcnRpZmFjdCBkaXNwbGF5JyAgICAgICB9LFxuXTtcblxuLyogUmVhbCBwc3kgY2hhcnQg4oCUIHVzZXMgdGhlIFNBTUUgZ2V0VyArIEdJVk9OSV9DT0xPUlMgKyBwb2x5Z29uIG1hdGggYXMgdGhlXG4gKiBwcm9kdWN0aW9uIGRhc2hib2FyZC4gIFNvdXJjZSBvZiB0cnV0aDogIGpzL3BzeWNocm9tZXRyaWMuanMgIGFuZCB0aGVcbiAqIHJlbmRlckdpdm9uaU92ZXJsYXkoKSBibG9jayBhdCBhcHAuanM6MTY0MS0xNzIyLlxuICogQW55dGhpbmcgeW91IGNoYW5nZSBpbiB0aG9zZSBmaWxlcyBNVVNUIGJlIG1pcnJvcmVkIGhlcmUuICovXG5mdW5jdGlvbiBQc3lTa2VsZXRvbih7IGNmZyB9KSB7XG4gICAgLyogQ2FudmFzICsgcGFkZGluZyAqL1xuICAgIGNvbnN0IFcgPSA3NjAsIEggPSA0ODA7XG4gICAgY29uc3QgcGFkID0geyBsZWZ0OiA1NiwgcmlnaHQ6IDQwLCB0b3A6IDI4LCBib3R0b206IDU2IH07XG4gICAgY29uc3QgZ3JpZFcgPSBXIC0gcGFkLmxlZnQgLSBwYWQucmlnaHQ7XG4gICAgY29uc3QgZ3JpZEggPSBIIC0gcGFkLnRvcCAgLSBwYWQuYm90dG9tO1xuXG4gICAgY29uc3QgVF9NSU4gPSBjZmcudExvLCBUX01BWCA9IGNmZy50SGk7XG4gICAgY29uc3QgV19NSU4gPSAwLCAgICAgICBXX01BWCA9IDAuMDMwOyAgICAgICAgICAvLyBrZy9rZ1xuXG4gICAgLyogYXhpcyBzY2FsZXMgLS0gbWF0Y2ggdGhlIGxpdmUgZGFzaGJvYXJkICovXG4gICAgY29uc3QgeCAgPSAodCkgPT4gcGFkLmxlZnQgKyAoKHQgLSBUX01JTikgLyAoVF9NQVggLSBUX01JTikpICogZ3JpZFc7XG4gICAgY29uc3QgeSAgPSAodykgPT4gcGFkLnRvcCAgKyAoMSAtICh3IC0gV19NSU4pIC8gKFdfTUFYIC0gV19NSU4pKSAqIGdyaWRIO1xuICAgIGNvbnN0IF9nZXRXID0gKHR5cGVvZiBnZXRXID09PSAnZnVuY3Rpb24nKSA/IGdldFcgOiAoKHQsIHJoKSA9PiAwKTtcblxuICAgIGNvbnN0IHNhZmVQdHMgPSAoYXJyKSA9PiBhcnIubWFwKHAgPT4gYCR7KHgocFswXSl8fDApLnRvRml4ZWQoMil9LCR7KHkocFsxXSl8fDApLnRvRml4ZWQoMil9YCkuam9pbignICcpO1xuXG4gICAgLyogLS0tLSBHaXZvbmkgcG9seWdvbnMgLS0gQ09QSUVEIFZFUkJBVElNIGZyb20gYXBwLmpzOjE2NDMtMTY2OSAtLS0tICovXG4gICAgY29uc3Qgcmg4MCA9IFtdOyBmb3IgKGxldCB0PTIwOyB0PD0yNTsgdCs9MC41KSByaDgwLnB1c2goW3QsIF9nZXRXKHQsIDgwKV0pO1xuICAgIGNvbnN0IHJoMTAwPSBbXTsgZm9yIChsZXQgdD0yMDsgdDw9Mjc7IHQrPTAuNSkgcmgxMDAucHVzaChbdCwgX2dldFcodCwgMTAwKV0pO1xuICAgIGNvbnN0IHJoMjBMaW5lID0gW107IGZvciAobGV0IHQ9MzI7IHQ+PTIwOyB0LT0wLjUpIHJoMjBMaW5lLnB1c2goW3QsIF9nZXRXKHQsIDIwKV0pO1xuICAgIGNvbnN0IHJoMjBfQ1ogID0gW107IGZvciAobGV0IHQ9Mjc7IHQ+PTIwOyB0LT0wLjUpIHJoMjBfQ1oucHVzaChbdCwgX2dldFcodCwgMjApXSk7XG4gICAgY29uc3QgQ1ogICA9IFsuLi5yaDgwLCBbMjcsIF9nZXRXKDI3LCA1MCldLCBbMjcsIF9nZXRXKDI3LCAyMCldLCAuLi5yaDIwX0NaXTtcblxuICAgIGNvbnN0IHJoSGlfdG9wID0gW107IGZvciAobGV0IHR0PTIwOyB0dDw9Mjc7IHR0Kz0wLjUpIHJoSGlfdG9wLnB1c2goW3R0LCBfZ2V0Vyh0dCwgY2ZnLnJoSGkpXSk7XG4gICAgY29uc3QgcmhMb19ib3QgPSBbXTsgZm9yIChsZXQgdHQ9Mjc7IHR0Pj0yMDsgdHQtPTAuNSkgcmhMb19ib3QucHVzaChbdHQsIF9nZXRXKHR0LCBjZmcucmhMbyldKTtcbiAgICBjb25zdCBTV0VFVCA9IFsuLi5yaEhpX3RvcCwgLi4ucmhMb19ib3RdO1xuXG4gICAgY29uc3QgTlYgICA9IFsuLi5yaDEwMCwgWzMyLCAxNS40LzEwMDBdLCBbMzIsIDYuMi8xMDAwXSwgLi4ucmgyMExpbmVdO1xuICAgIGNvbnN0IE1hc3MgPSBbLi4ucmg4MCwgWzMzLCAxNi8xMDAwXSwgWzM3LCBfZ2V0VygzNywgMzApXSwgWzM3LCAzLzEwMDBdLCBbMjAsIF9nZXRXKDIwLCAyMCldXTtcbiAgICBjb25zdCBNQ1YgID0gWy4uLnJoODAsIFs0MCwgMTYvMTAwMF0sIFs0NCwgX2dldFcoNDQsIDIwKV0sIFs0NCwgMy8xMDAwXSwgWzIwLCBfZ2V0VygyMCwgMjApXV07XG4gICAgY29uc3QgRVZBUCA9IFsuLi5yaDgwLCBbMjUsIDE2LzEwMDBdLCBbMzYsIF9nZXRXKDM2LCAzMCldLCBbMzksIF9nZXRXKDM5LCAyMCldLFxuICAgICAgICAgICAgICAgICAgWzQxLCBfZ2V0Vyg0MSwgMTApXSwgWzQxLCAwXSwgWzI3LjIsIDBdLCBbMjAsIF9nZXRXKDIwLCAyMCldXTtcblxuICAgIGNvbnN0IHdpbnRlclJIODAgPSBbXTsgZm9yIChsZXQgdD0xODsgdDw9MTkuNTsgdCs9MC41KSB3aW50ZXJSSDgwLnB1c2goW3QsIF9nZXRXKHQsIDgwKV0pO1xuICAgIGNvbnN0IHdpbnRlclJIMjAgPSBbXTsgZm9yIChsZXQgdD0xOS41OyB0Pj0xODsgdC09MC41KSB3aW50ZXJSSDIwLnB1c2goW3QsIF9nZXRXKHQsIDIwKV0pO1xuICAgIGNvbnN0IFdJTlRFUiA9IFsuLi53aW50ZXJSSDgwLCAuLi53aW50ZXJSSDIwXTtcblxuICAgIC8qIFJIIGlzb3BsZXRoIGN1cnZlcyBmb3IgdGhlIGNoYXJ0IGdyaWQgKi9cbiAgICBjb25zdCBpc29wbGV0aHMgPSBbMjAsIDQwLCA2MCwgODAsIDEwMF07XG5cbiAgICAvKiBUaGVtZSBwYWxldHRlIOKAlCBkcml2ZXMgdGhlIGxpdmUgcHJldmlldyBzbyB0aGUgZGltL2xpZ2h0IGNvbnRyb2xzXG4gICAgICogaGF2ZSB2aXNpYmxlIGZlZWRiYWNrIHJpZ2h0IG9uIHRoZSBjaGFydC4gIEluIGRpbS9kYXJrIG1vZGUgd2UgYWxzb1xuICAgICAqIGFwcGx5IGEgQ1NTIGJyaWdodG5lc3MgZmlsdGVyIG1hcHBlZCBmcm9tIGNmZy5kYXJrTGV2ZWwgKDEuNSAuLiAyLjhcbiAgICAgKiDihpIgMC42IC4uIDEuNCkgc28gdGhlIHVzZXIgY2FuIFNFRSB0aGUgYnJpZ2h0bmVzcyBzbGlkZXIgd29ya2luZy4gKi9cbiAgICBjb25zdCBpc0xpZ2h0ID0gY2ZnLnRoZW1lID09PSAnbGlnaHQnO1xuICAgIGNvbnN0IHBhbGV0dGUgPSBpc0xpZ2h0XG4gICAgICAgID8geyBiZzonI2Y4ZmFmYycsIGdyaWQ6JyNjYmQ1ZTEnLCB0aWNrOicjNDc1NTY5JywgYXhpczonIzFlMjkzYicsXG4gICAgICAgICAgICBwYW5lbEJnOidyZ2JhKDI0OCwyNTAsMjUyLDAuODUpJywgcGFuZWxCb3JkZXI6JyNjYmQ1ZTEnLFxuICAgICAgICAgICAgcGlsbEJnOicjZTJlOGYwJywgcGlsbEZnOicjNDc1NTY5JywgbWV0YUZnOicjNjQ3NDhiJyB9XG4gICAgICAgIDogeyBiZzonIzBiMTIyMCcsIGdyaWQ6JyMxZTI5M2InLCB0aWNrOicjOTRhM2I4JywgYXhpczonI2NiZDVlMScsXG4gICAgICAgICAgICBwYW5lbEJnOidyZ2JhKDE1LDIzLDQyLDAuNiknLCBwYW5lbEJvcmRlcjonIzFlMjkzYicsXG4gICAgICAgICAgICBwaWxsQmc6JyMxZTI5M2InLCBwaWxsRmc6JyM5NGEzYjgnLCBtZXRhRmc6JyM2NDc0OGInIH07XG4gICAgY29uc3QgZGltRmlsdGVyID0gaXNMaWdodFxuICAgICAgICA/ICdub25lJ1xuICAgICAgICA6IGBicmlnaHRuZXNzKCR7KE1hdGgubWF4KDEuNSwgTWF0aC5taW4oMi44LCBjZmcuZGFya0xldmVsIHx8IDIuMCkpIC8gMi4wKS50b0ZpeGVkKDIpfSlgO1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3VuZGVkLTJ4bCBwLTQgYm9yZGVyIHRyYW5zaXRpb24tY29sb3JzIGR1cmF0aW9uLTMwMFwiXG4gICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOiBwYWxldHRlLnBhbmVsQmcsIGJvcmRlckNvbG9yOiBwYWxldHRlLnBhbmVsQm9yZGVyfX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBtYi0zXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicGlsbFwiIHN0eWxlPXt7YmFja2dyb3VuZDpwYWxldHRlLnBpbGxCZywgY29sb3I6cGFsZXR0ZS5waWxsRmd9fT5QU1lDSFJPTUVUUklDIENIQVJUIMK3IGxpdmUgcHJldmlldzwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSBmb250LW1vbm9cIiBzdHlsZT17e2NvbG9yOnBhbGV0dGUubWV0YUZnfX0+e1RfTUlOfcKwQyDihpIge1RfTUFYfcKwQyAgwrcgIHtjZmcucmhMb33igJN7Y2ZnLnJoSGl9JSBSSDwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHN2ZyB2aWV3Qm94PXtgMCAwICR7V30gJHtIfWB9IGNsYXNzTmFtZT1cInctZnVsbCBoLWF1dG8gdHJhbnNpdGlvbi1bZmlsdGVyXSBkdXJhdGlvbi0zMDBcIlxuICAgICAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6IHBhbGV0dGUuYmcsIGJvcmRlclJhZGl1czo4LCBmaWx0ZXI6IGRpbUZpbHRlcn19PlxuICAgICAgICAgICAgICAgIHsvKiAtLS0tIGdyaWQ6IHZlcnRpY2FsIFQgbGluZXMsIGhvcml6b250YWwgVyBsaW5lcyAtLS0tICovfVxuICAgICAgICAgICAgICAgIHtBcnJheS5mcm9tKHtsZW5ndGg6MTF9KS5tYXAoKF8saSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ID0gVF9NSU4gKyAoaS8xMCkgKiAoVF9NQVggLSBUX01JTik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZyBrZXk9eyd2dCcraX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3godCl9IHkxPXtwYWQudG9wfSB4Mj17eCh0KX0geTI9e3BhZC50b3ArZ3JpZEh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPXtwYWxldHRlLmdyaWR9IHN0cm9rZVdpZHRoPVwiMC42XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3godCl9IHk9e3BhZC50b3ArZ3JpZEgrMTZ9IGZvbnRTaXplPVwiOS41XCIgZmlsbD17cGFsZXR0ZS50aWNrfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIj57dC50b0ZpeGVkKDApfTwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICB7QXJyYXkuZnJvbSh7bGVuZ3RoOjd9KS5tYXAoKF8saSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB3ID0gV19NSU4gKyAoaS82KSAqIChXX01BWCAtIFdfTUlOKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxnIGtleT17J2h3JytpfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17cGFkLmxlZnR9IHkxPXt5KHcpfSB4Mj17cGFkLmxlZnQrZ3JpZFd9IHkyPXt5KHcpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT17cGFsZXR0ZS5ncmlkfSBzdHJva2VXaWR0aD1cIjAuNlwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXtwYWQubGVmdC04fSB5PXt5KHcpKzN9IGZvbnRTaXplPVwiOS41XCIgZmlsbD17cGFsZXR0ZS50aWNrfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJlbmRcIj57KHcqMTAwMCkudG9GaXhlZCgwKX08L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgey8qIC0tLS0gUkggaXNvcGxldGhzIChjdXJ2ZXMpIC0tLS0gKi99XG4gICAgICAgICAgICAgICAge2lzb3BsZXRocy5tYXAocmggPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwdHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdCA9IFRfTUlOOyB0IDw9IFRfTUFYOyB0ICs9IDAuNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgd3cgPSBfZ2V0Vyh0LCByaCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod3cgPj0gV19NSU4gJiYgd3cgPD0gV19NQVgpIHB0cy5wdXNoKFt0LCB3d10pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZyBrZXk9eydpc28nK3JofT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cG9seWxpbmUgcG9pbnRzPXtzYWZlUHRzKHB0cyl9IGZpbGw9XCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPXtyaCA9PT0gMTAwID8gJyM2MzY2ZjEnIDogJyNlYzQ4OTk1NSd9IHN0cm9rZVdpZHRoPVwiMC44XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlRGFzaGFycmF5PXtyaCA9PT0gMTAwID8gJycgOiAnMywzJ30vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtwdHMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3gocHRzW01hdGguZmxvb3IocHRzLmxlbmd0aCowLjY1KV1bMF0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5PXt5KHB0c1tNYXRoLmZsb29yKHB0cy5sZW5ndGgqMC42NSldWzFdKSAtIDR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplPVwiOVwiIGZpbGw9XCIjZWM0ODk5OTlcIiBmb250V2VpZ2h0PVwiNzAwXCI+e3JofSU8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cblxuICAgICAgICAgICAgICAgIHsvKiAtLS0tIEdpdm9uaSBvdmVybGF5IChjb3BpZWQgdmVyYmF0aW0gZnJvbSBhcHAuanMgcmVuZGVyIG9yZGVyKSAtLS0tICovfVxuICAgICAgICAgICAgICAgIHtjZmcuZ2l2b25pICYmIChcbiAgICAgICAgICAgICAgICAgICAgPGcgY2xhc3NOYW1lPVwicG9pbnRlci1ldmVudHMtbm9uZVwiIG9wYWNpdHk9XCIwLjlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXt4KDQwKX0geTE9e3koMTYvMTAwMCl9IHgyPXt4KDUwKX0geTI9e3koMTYvMTAwMCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCIjNjM2NmYxXCIgc3Ryb2tlV2lkdGg9XCIxLjVcIiBzdHJva2VEYXNoYXJyYXk9XCI0LDRcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17eCg1MCl9IHkxPXt5KDE2LzEwMDApfSB4Mj17eCg1MCl9IHkyPXt5KDApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiIzYzNjZmMVwiIHN0cm9rZVdpZHRoPVwiMS41XCIgc3Ryb2tlRGFzaGFycmF5PVwiNCw0XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3goNDEpfSB5MT17eSgwKX0geDI9e3goNTApfSB5Mj17eSgwKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cIiM2MzY2ZjFcIiBzdHJva2VXaWR0aD1cIjEuNVwiIHN0cm9rZURhc2hhcnJheT1cIjQsNFwiLz5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKE1DVil9ICBmaWxsPVwiI2VjNDg5OVwiIGZpbGxPcGFjaXR5PVwiMC4wNVwiIHN0cm9rZT1cIiNlYzQ4OTlcIiBzdHJva2VXaWR0aD1cIjFcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoTWFzcyl9IGZpbGw9XCIjOGI1Y2Y2XCIgZmlsbE9wYWNpdHk9XCIwLjA1XCIgc3Ryb2tlPVwiIzhiNWNmNlwiIHN0cm9rZVdpZHRoPVwiMVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhFVkFQKX0gZmlsbD1cIiMwNmI2ZDRcIiBmaWxsT3BhY2l0eT1cIjAuMDhcIiBzdHJva2U9XCIjMDZiNmQ0XCIgc3Ryb2tlV2lkdGg9XCIxXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKE5WKX0gICBmaWxsPVwiI2Y1OWUwYlwiIGZpbGxPcGFjaXR5PVwiMC4wNVwiIHN0cm9rZT1cIiNmNTllMGJcIiBzdHJva2VXaWR0aD1cIjFcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoQ1opfSAgIGZpbGw9XCIjMTBiOTgxXCIgZmlsbE9wYWNpdHk9XCIwLjE1XCIgc3Ryb2tlPVwiIzEwYjk4MVwiIHN0cm9rZVdpZHRoPVwiMS4yXCIvPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICB7LyogU3dlZXQtc3BvdCBiYW5kLCBjbGlwcGVkIHRvIENaICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgPGRlZnM+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNsaXBQYXRoIGlkPVwiY3otY2xpcC13YWxrXCIgY2xpcFBhdGhVbml0cz1cInVzZXJTcGFjZU9uVXNlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhDWil9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2NsaXBQYXRoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kZWZzPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKFNXRUVUKX0gY2xpcFBhdGg9XCJ1cmwoI2N6LWNsaXAtd2FsaylcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbD1cIiMwNTk2NjlcIiBmaWxsT3BhY2l0eT1cIjAuMzJcIiBzdHJva2U9XCIjMDQ3ODU3XCIgc3Ryb2tlV2lkdGg9XCIwLjhcIiBzdHJva2VEYXNoYXJyYXk9XCIzLDJcIi8+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhXSU5URVIpfSBmaWxsPVwiIzNiODJmNlwiIGZpbGxPcGFjaXR5PVwiMC4xNVwiIHN0cm9rZT1cIm5vbmVcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17eCgxOSl9IHkxPXtwYWQudG9wKzE4fSB4Mj17eCgxOSl9IHkyPXtwYWQudG9wK2dyaWRIfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiIzNiODJmNlwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZURhc2hhcnJheT1cIjYsNFwiIG9wYWNpdHk9XCIwLjhcIi8+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBSZWdpb24gbGFiZWxzIOKAlCBzYW1lIGNvbG9ycyAmIHNwaXJpdCBhcyBsaXZlIGNoYXJ0ICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCg1MCktMTB9IHk9e3koOC8xMDAwKX0gZmlsbD1cIiM2MzY2ZjFcIiBmb250U2l6ZT1cIjEwXCIgZm9udFdlaWdodD1cIjkwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgdHJhbnNmb3JtPXtgcm90YXRlKC05MCwgJHt4KDUwKS0xMH0sICR7eSg4LzEwMDApfSlgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZz1cIjJcIj5NRUNIQU5JQ0FMIENPT0xJTkc8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDQ0KS0yfSB5PXt5KDgvMTAwMCl9IGZpbGw9XCIjZWM0ODk5XCIgZm9udFNpemU9XCI5XCIgZm9udFdlaWdodD1cIjkwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgdHJhbnNmb3JtPXtgcm90YXRlKC05MCwgJHt4KDQ0KS0yfSwgJHt5KDgvMTAwMCl9KWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nPVwiMS41XCI+TUFTUyBDT09MSU5HPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCgzNyktMTB9IHk9e3koOC8xMDAwKX0gZmlsbD1cIiM4YjVjZjZcIiBmb250U2l6ZT1cIjlcIiBmb250V2VpZ2h0PVwiOTAwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiB0cmFuc2Zvcm09e2Byb3RhdGUoLTkwLCAke3goMzcpLTEwfSwgJHt5KDgvMTAwMCl9KWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nPVwiMS41XCI+TUFTUyBDT09MSU5HPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCgzNCl9IHk9e3koMC41LzEwMDApLTh9IGZpbGw9XCIjMDZiNmQ0XCIgZm9udFNpemU9XCI5XCIgZm9udFdlaWdodD1cIjkwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgbGV0dGVyU3BhY2luZz1cIjJcIj5FVkFQT1JBVElWRTwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goMjMuNSl9IHk9e3koX2dldFcoMjMuNSwgNDUpKX0gZmlsbD1cIiMxMGI5ODFcIiBmb250U2l6ZT1cIjExXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ9XCI5MDBcIiB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgbGV0dGVyU3BhY2luZz1cIjEuNVwiPkNPTUZPUlQ8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDE4Ljc1KX0geT17eShfZ2V0VygxOC43NSwgNDUpKX0gZmlsbD1cIiMzYjgyZjZcIiBmb250U2l6ZT1cIjExXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ9XCI5MDBcIiB0ZXh0QW5jaG9yPVwibWlkZGxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybT17YHJvdGF0ZSgtOTAsICR7eCgxOC43NSl9LCAke3koX2dldFcoMTguNzUsIDQ1KSl9KWB9PldJTlRFUjwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goMjMuNSl9IHk9e3koX2dldFcoMjMuNSwgKGNmZy5yaExvK2NmZy5yaEhpKS8yKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxsPVwiIzAyMmMyMlwiIGZvbnRTaXplPVwiOFwiIGZvbnRXZWlnaHQ9XCI5MDBcIiB0ZXh0QW5jaG9yPVwibWlkZGxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7cGFpbnRPcmRlcjonc3Ryb2tlJywgc3Ryb2tlOicjYTdmM2QwJywgc3Ryb2tlV2lkdGg6JzIuNXB4Jywgc3Ryb2tlTGluZWpvaW46J3JvdW5kJ319XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nPVwiMS41XCI+e2NmZy5yaExvfS17Y2ZnLnJoSGl9JSBSSDwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgICAgICB7LyogYXhpcyBsYWJlbHMgKi99XG4gICAgICAgICAgICAgICAgPHRleHQgeD17cGFkLmxlZnQgKyBncmlkVy8yfSB5PXtILTEyfSBmb250U2l6ZT1cIjExXCIgZmlsbD17cGFsZXR0ZS5heGlzfVxuICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiBmb250V2VpZ2h0PVwiODAwXCIgbGV0dGVyU3BhY2luZz1cIjJcIj5EUlkgQlVMQiBURU1QICjCsEMpPC90ZXh0PlxuICAgICAgICAgICAgICAgIDx0ZXh0IHg9ezE2fSB5PXtwYWQudG9wICsgZ3JpZEgvMn0gZm9udFNpemU9XCIxMVwiIGZpbGw9e3BhbGV0dGUuYXhpc31cbiAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgZm9udFdlaWdodD1cIjgwMFwiIGxldHRlclNwYWNpbmc9XCIyXCJcbiAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm09e2Byb3RhdGUoLTkwIDE2ICR7cGFkLnRvcCArIGdyaWRILzJ9KWB9PkhVTUlESVRZIFJBVElPIChnL2tnKTwvdGV4dD5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG5mdW5jdGlvbiBQc3lDb250cm9sUGFuZWwoeyBjZmcsIHVwZGF0ZSwgc2V0Q2ZnIH0pIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXNsYXRlLTkwMC82MCBib3JkZXIgYm9yZGVyLXNsYXRlLTgwMCByb3VuZGVkLTJ4bCBwLTUgc3BhY2UteS02XCI+XG4gICAgICAgICAgICB7LyogVGhlbWUgKyBicmlnaHRuZXNzICAtLSByZWxvY2F0ZWQgZnJvbSB0aGUgZGFzaGJvYXJkIHNpZGViYXIgMjAyNi0wNi0yNS5cbiAgICAgICAgICAgICAgICBUd28gY29udHJvbHM6IERhcmsvTGlnaHQgbW9kZSB0b2dnbGUsIGFuZCBCcmlnaHRuZXNzIHNsaWRlciAob25seVxuICAgICAgICAgICAgICAgIG1lYW5pbmdmdWwgaW4gZGFyayBtb2RlKS4gIExpdmUgcHJldmlldyBhcHBsaWVzIHRvIHRoZSBzdXJyb3VuZGluZ1xuICAgICAgICAgICAgICAgIGNvbnRyb2wgcGFuZWwgc28gdGhlIG9wZXJhdG9yIGNhbiBGRUVMIHRoZSBjaGFuZ2UgYmVmb3JlIHNhdmluZy4gKi99XG4gICAgICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwicHN5LWNmZy10aGVtZS1ibG9ja1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMlwiPnt0KCdzd19kaXNwbGF5X21vZGUnKX08L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTIgbWItM1wiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwicHN5LWNmZy10aGVtZS1kYXJrXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIHRoZW1lOidkYXJrJywgZGFya0xldmVsOk1hdGgubWluKGMuZGFya0xldmVsIHx8IDIuMCwgMi42KX0pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweS0yLjUgcm91bmRlZC1sZyB0ZXh0LXhzIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBib3JkZXIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjZmcudGhlbWUgPT09ICdkYXJrJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctc2xhdGUtODAwIGJvcmRlci15ZWxsb3ctNTAwLzcwIHRleHQteWVsbG93LTMwMCBzaGFkb3ctbGcgc2hhZG93LXllbGxvdy01MDAvMTAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1zbGF0ZS05MDAvMzAgYm9yZGVyLXNsYXRlLTcwMCB0ZXh0LXNsYXRlLTUwMCBob3ZlcjpiZy1zbGF0ZS04MDAvNjAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAge3QoJ3N3X2RpbV9kYXJrJyl9XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwicHN5LWNmZy10aGVtZS1saWdodFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0Q2ZnKGMgPT4gKHsuLi5jLCB0aGVtZTonbGlnaHQnLCBkYXJrTGV2ZWw6My4wfSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB5LTIuNSByb3VuZGVkLWxnIHRleHQteHMgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGJvcmRlciB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2NmZy50aGVtZSA9PT0gJ2xpZ2h0J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctc2xhdGUtMTAwIGJvcmRlci1za3ktNTAwLzcwIHRleHQtc2t5LTcwMCBzaGFkb3ctbGcgc2hhZG93LXNreS01MDAvMTAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1zbGF0ZS05MDAvMzAgYm9yZGVyLXNsYXRlLTcwMCB0ZXh0LXNsYXRlLTUwMCBob3ZlcjpiZy1zbGF0ZS04MDAvNjAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAge3QoJ3N3X2xpZ2h0X21vZGUnKX1cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgey8qIEJyaWdodG5lc3Mgc2xpZGVyIOKAlCBvbmx5IG1lYW5pbmdmdWwgd2hlbiB0aGVtZSA9PT0gJ2RhcmsnICovfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjZmcudGhlbWUgPT09ICdsaWdodCcgPyAnb3BhY2l0eS00MCBwb2ludGVyLWV2ZW50cy1ub25lJyA6ICcnfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gbWItMVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwXCI+e3QoJ3N3X2RpbV9icmlnaHRuZXNzJyl9PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIGZvbnQtbW9ubyB0ZXh0LXllbGxvdy0zMDAgdGFidWxhci1udW1zXCI+e01hdGgucm91bmQoKGNmZy5kYXJrTGV2ZWwgfHwgMi4wKSAqIDEwMCl9JTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJwc3ktY2ZnLWRhcmstbGV2ZWxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluPVwiMS41XCIgbWF4PVwiMi44XCIgc3RlcD1cIjAuMDJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2NmZy50aGVtZSA9PT0gJ2xpZ2h0JyA/IDIuMCA6IChjZmcuZGFya0xldmVsIHx8IDIuMCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldENmZyhjID0+ICh7Li4uYywgZGFya0xldmVsOiBwYXJzZUZsb2F0KGUudGFyZ2V0LnZhbHVlKSwgdGhlbWU6J2RhcmsnfSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2UtaW5wdXQgdy1mdWxsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGFjY2VudENvbG9yOicjZmFjYzE1JyB9fS8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbXQtMiBpdGFsaWNcIj5cbiAgICAgICAgICAgICAgICAgICAgQXBwbGllZCB0byB0aGUgd2hvbGUgZGFzaGJvYXJkLiAgRGltIGlzIHJlY29tbWVuZGVkIGZvciBjb250cm9sIHJvb21zOyBMaWdodCBmb3IgZGF5dGltZSB3YWxrLXRocm91Z2hzLlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogR2l2b25pIHRvZ2dsZSAqL31cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0yXCI+e3QoJ3N3X2dpdm9uaV9lbmdpbmUnKX08L2Rpdj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHVwZGF0ZSgnZ2l2b25pJywgIWNmZy5naXZvbmkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdy1mdWxsIHB5LTMgcm91bmRlZC14bCB0ZXh0LXNtIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjZmcuZ2l2b25pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctaW5kaWdvLTYwMCB0ZXh0LXdoaXRlIHNoYWRvdy1sZyBzaGFkb3ctaW5kaWdvLTUwMC8zMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1zbGF0ZS04MDAgdGV4dC1zbGF0ZS00MDAgYm9yZGVyIGJvcmRlci1zbGF0ZS03MDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICB7Y2ZnLmdpdm9uaSA/IHQoJ3N3X2dpdm9uaV9vbicpIDogdCgnc3dfZ2l2b25pX29mZicpfVxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTIgbGVhZGluZy1yZWxheGVkXCI+XG4gICAgICAgICAgICAgICAgICAgIE92ZXJsYXlzIHRoZSA0IGNsaW1hdGUtc3RyYXRlZ3kgcmVnaW9ucyAoQ29tZm9ydCwgTmF0IFZlbnQsIEV2YXAsIE1lY2ggQ29vbCkuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBSSCByYW5nZSAqL31cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0yXCI+e3QoJ3N3X3JoX3N3ZWV0X3Nwb3QnKX08L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwIG1iLTEgYmxvY2tcIj57dCgnc3dfdmVudWVfcHJlc2V0Jyl9PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dCBjdXJzb3ItcG9pbnRlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2NmZy5yaFByZXNldCB8fCAnY3VzdG9tJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcCA9IFJIX1BSRVNFVFMuZmluZChwID0+IHAuaWQgPT09IGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFwKSByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwLmlkID09PSAnY3VzdG9tJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlKCdyaFByZXNldCcsICdjdXN0b20nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgcmhQcmVzZXQ6cC5pZCwgcmhMbzpwLmxvLCByaEhpOnAuaGl9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtSSF9QUkVTRVRTLm1hcChwID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIGtleT17cC5pZH0gdmFsdWU9e3AuaWR9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cC5sYWJlbH17cC5sbyAhPSBudWxsID8gYCAgwrcgICR7cC5sb30tJHtwLmhpfSUgUkhgIDogJyd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgICAgIHsoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcCA9IFJIX1BSRVNFVFMuZmluZCh4ID0+IHguaWQgPT09IChjZmcucmhQcmVzZXQgfHwgJ2N1c3RvbScpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwICYmIHAubm90ZSA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0xLjUgaXRhbGljXCI+e3Aubm90ZX08L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICApIDogbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfSkoKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zIG1iLTJcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyBmb250LW1vbm8gdGV4dC1zbGF0ZS00MDAgdy0xMFwiPntjZmcucmhMb30lPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPVwiMjBcIiBtYXg9e2NmZy5yaEhpLTV9IHZhbHVlPXtjZmcucmhMb31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0Q2ZnKGMgPT4gKHsuLi5jLCByaExvOitlLnRhcmdldC52YWx1ZSwgcmhQcmVzZXQ6J2N1c3RvbSd9KSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyYW5nZS1pbnB1dCBmbGV4LTFcIi8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtM1wiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtbW9ubyB0ZXh0LXNsYXRlLTQwMCB3LTEwXCI+e2NmZy5yaEhpfSU8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49e2NmZy5yaExvKzV9IG1heD1cIjkwXCIgdmFsdWU9e2NmZy5yaEhpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIHJoSGk6K2UudGFyZ2V0LnZhbHVlLCByaFByZXNldDonY3VzdG9tJ30pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLWlucHV0IGZsZXgtMVwiLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogQXhpcyByYW5nZSAqL31cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0yXCI+e3QoJ3N3X3RlbXBfYXhpc19yYW5nZScpfTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTMgbWItMlwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtbW9ubyB0ZXh0LXNsYXRlLTQwMCB3LTEwXCI+e2NmZy50TG99wrA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49XCItNDBcIiBtYXg9e2NmZy50SGktMTB9IHZhbHVlPXtjZmcudExvfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGUoJ3RMbycsICtlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyYW5nZS1pbnB1dCBmbGV4LTFcIi8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtM1wiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtbW9ubyB0ZXh0LXNsYXRlLTQwMCB3LTEwXCI+e2NmZy50SGl9wrA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49e2NmZy50TG8rMTB9IG1heD1cIjYwXCIgdmFsdWU9e2NmZy50SGl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZSgndEhpJywgK2UudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLWlucHV0IGZsZXgtMVwiLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0yIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgICAgICBDaGFydCB3aWxsIGJlIHJlZHJhd24gd2l0aCB0aGlzIGRyeS1idWxiIHRlbXBlcmF0dXJlIHdpbmRvdy5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib3JkZXItdCBib3JkZXItc2xhdGUtODAwIHB0LTRcIj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBsZWFkaW5nLXJlbGF4ZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgQ2hhbmdlcyBwcmV2aWV3IGxpdmUgaW4gdGhlIHNrZWxldG9uIGNoYXJ0IG9uIHRoZSBsZWZ0LiAgSGl0XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtaW5kaWdvLTQwMCBmb250LWJsYWNrXCI+IFNhdmUgJiByZXR1cm4gPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICBpbiB0aGUgaGVhZGVyIHdoZW4geW91J3JlIGhhcHB5LlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBMb2NhdGlvbiBTZXR0aW5nIC0tIG1vZGFsIHcvIGludGVyYWN0aXZlIExlYWZsZXQgbWFwICsgcmV2ZXJzZSBnZW9jb2RpbmdcbiAqIENsaWNrIGFueXdoZXJlIG9uIHRoZSBtYXAgKG9yIGRyYWcgdGhlIG1hcmtlcikgdG8gc2V0IGxhdC9sb24uXG4gKiBNYW51YWwgbGF0L2xvbiBlZGl0cyByZS1jZW50cmUgdGhlIG1hcmtlci4gIENpdHkgbmFtZSBpcyBhdXRvLXBvcHVsYXRlZFxuICogdmlhIE9wZW5TdHJlZXRNYXAgTm9taW5hdGltIChubyBrZXkgcmVxdWlyZWQsIHJhdGUtbGltaXRlZCB0byB+MSByZXEvcykuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qIERlLWR1cCArIHNhbml0eS1jaGVjayBhIHJhdyBzYXZlZC1sb2NhdGlvbnMgYXJyYXkgKGZyb20gc2VydmVyIG9yXG4gKiBsb2NhbFN0b3JhZ2UpLiAgRGVkdXAga2V5IGlzIGBsYXQudG9GaXhlZCg0KSxsb24udG9GaXhlZCg0KWAgLS0gdGhlXG4gKiBTQU1FIGtleSB0aGUgZGFzaGJvYXJkJ3Mgd2VhdGhlci1zZXR0aW5ncy1tb2RhbC5qcyB1c2VzIC0tIHNvIHRoZVxuICogU2V0dXAgV2FsayBkcm9wZG93biBzaG93cyB0aGUgZXhhY3Qgc2FtZSBzZXQgdGhlIG9wZXJhdG9yIHNlZXMgaW5cbiAqIHRoZSBkYXNoYm9hcmQncyAzRC1XeCBXZWF0aGVyIGJ1dHRvbi4gIFR3byBlbnRyaWVzIHRoYXQgc2hhcmUgYSBuYW1lXG4gKiAoZS5nLiBcIkhPTUVcIiBhdCB0aGUgb2ZmaWNlIGFuZCBcIkhPTUVcIiBhdCB0aGUgYXBhcnRtZW50KSBidXQgaGF2ZVxuICogZGlmZmVyZW50IGNvb3JkaW5hdGVzIGFyZSBCT1RIIGtlcHQ7IG9ubHkgdHJ1ZSBjb29yZCBkdXBsaWNhdGVzIGFyZVxuICogY29sbGFwc2VkLiAgRHJvcHMgZW50cmllcyBtaXNzaW5nIGEgbmFtZSBvciB3aXRoIG5vbi1maW5pdGUgbGF0L2xvbi4gKi9cbmZ1bmN0aW9uIF9ub3JtYWxpemVMb2NzKGFycikge1xuICAgIGNvbnN0IHNlZW4gPSBuZXcgU2V0KCk7XG4gICAgY29uc3Qgb3V0ID0gW107XG4gICAgZm9yIChjb25zdCBsIG9mIChhcnIgfHwgW10pKSB7XG4gICAgICAgIGlmICghbCB8fCB0eXBlb2YgbC5uYW1lICE9PSAnc3RyaW5nJykgY29udGludWU7XG4gICAgICAgIGNvbnN0IGxhdCA9ICtsLmxhdCwgbG9uID0gK2wubG9uO1xuICAgICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShsYXQpIHx8ICFOdW1iZXIuaXNGaW5pdGUobG9uKSkgY29udGludWU7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBsLm5hbWUudHJpbSgpO1xuICAgICAgICBpZiAoIW5hbWUpIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCBrZXkgPSBsYXQudG9GaXhlZCg0KSArICcsJyArIGxvbi50b0ZpeGVkKDQpO1xuICAgICAgICBpZiAoc2Vlbi5oYXMoa2V5KSkgY29udGludWU7XG4gICAgICAgIHNlZW4uYWRkKGtleSk7XG4gICAgICAgIG91dC5wdXNoKHsgbmFtZSwgbGF0LCBsb24gfSk7XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG59XG5cbmZ1bmN0aW9uIExvY2F0aW9uTW9kYWwoeyBjZmcsIHNldENmZywgb25DbG9zZSwgb25TYXZlIH0pIHtcbiAgICBjb25zdCBtYXBCb3hSZWYgPSBSZWFjdC51c2VSZWYobnVsbCk7XG4gICAgY29uc3QgbWFwUmVmICAgID0gUmVhY3QudXNlUmVmKG51bGwpO1xuICAgIGNvbnN0IG1hcmtlclJlZiA9IFJlYWN0LnVzZVJlZihudWxsKTtcbiAgICBjb25zdCBbZ2VvQnVzeSwgc2V0R2VvQnVzeV0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG5cbiAgICAvKiAtLS0tLSBzYXZlZCBsb2NhdGlvbnMgLS0gbWlycm9yIHdoYXQgdGhlIERhc2hib2FyZCdzIFdlYXRoZXIgYnV0dG9uIHNob3dzLlxuICAgICAqXG4gICAgICogVGhlIGRhc2hib2FyZCByZWFkcyB0aGVtIGZyb20gYCR7QVBJX1VSTH0vYXBpL3dlYXRoZXItbG9jYXRpb25gJ3NcbiAgICAgKiBgc2F2ZWRgIGFycmF5IGFuZCBtaXJyb3JzIHRoYXQgaW50byBsb2NhbFN0b3JhZ2VbJ3NhdmVkV2VhdGhlckxvY2F0aW9ucyddXG4gICAgICogb24gbW91bnQgKHNlZSBwdWJsaWMvanMvZGFzaGJvYXJkL2FwcC5qcyNoeWRyYXRlV2VhdGhlclN0YXRlKS4gIFdlIGRvXG4gICAgICogdGhlIFNBTUUgdGhpbmcgaGVyZSBzbyB0aGUgU2V0dXAgV2FsaydzIFNpdGUtbmFtZSBkcm9wZG93biBzdGF5c1xuICAgICAqIGJ5dGUtaWRlbnRpY2FsIHdpdGggdGhlIGRhc2hib2FyZCdzIGxvY2F0aW9uIGxpc3QgLS0gaW5jbHVkaW5nIHdoZW4gdGhlXG4gICAgICogb3BlcmF0b3IgdmlzaXRzIFNldHVwIFdhbGsgQkVGT1JFIGV2ZXIgb3BlbmluZyB0aGUgZGFzaGJvYXJkIChmcmVzaFxuICAgICAqIGRldmljZSBjYXNlIHdoZXJlIGxvY2FsU3RvcmFnZSBpcyBlbXB0eSkuXG4gICAgICpcbiAgICAgKiBTdHJhdGVneTpcbiAgICAgKiAgIDEpIFJlYWQgbG9jYWxTdG9yYWdlIGZpcnN0IChpbnN0YW50LCBubyBmbGlja2VyIGlmIGFscmVhZHkgaHlkcmF0ZWQpLlxuICAgICAqICAgMikgVGhlbiBHRVQgL2FwaS93ZWF0aGVyLWxvY2F0aW9uIChjYW5vbmljYWwsIGNyb3NzLWRldmljZSBzb3VyY2UpLlxuICAgICAqICAgMykgV2hpY2hldmVyIGlzIG5vbi1lbXB0eSB3aW5zOyBzZXJ2ZXIgd2lucyB0aWVzLlxuICAgICAqXG4gICAgICogRnJlZS1mb3JtIHR5cGluZyBpbiB0aGUgaW5wdXQgc3RpbGwgd29ya3MgLS0gdGhlIGRhdGFsaXN0IGlzIHN1Z2dlc3Rpb25cbiAgICAgKiBvbmx5LCB0aGUgaW5wdXQgbmV2ZXIgcmVzdHJpY3RzIHRoZSB2YWx1ZS4gKi9cbiAgICBjb25zdCBbc2F2ZWRMb2NzLCBzZXRTYXZlZExvY3NdID0gUmVhY3QudXNlU3RhdGUoKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmF3ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NhdmVkV2VhdGhlckxvY2F0aW9ucycpO1xuICAgICAgICAgICAgaWYgKCFyYXcpIHJldHVybiBbXTtcbiAgICAgICAgICAgIGNvbnN0IGFyciA9IEpTT04ucGFyc2UocmF3KTtcbiAgICAgICAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KGFycikgPyBfbm9ybWFsaXplTG9jcyhhcnIpIDogW107XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgcmV0dXJuIFtdOyB9XG4gICAgfSk7XG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgbGV0IGNhbmNlbGxlZCA9IGZhbHNlO1xuICAgICAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goJy9hcGkvd2VhdGhlci1sb2NhdGlvbicsIHsgY3JlZGVudGlhbHM6J2luY2x1ZGUnLCBjYWNoZTonbm8tc3RvcmUnIH0pO1xuICAgICAgICAgICAgICAgIGlmICghci5vaykgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGNvbnN0IGogPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzYXZlZCA9IF9ub3JtYWxpemVMb2NzKEFycmF5LmlzQXJyYXkoai5zYXZlZCkgPyBqLnNhdmVkIDogW10pO1xuICAgICAgICAgICAgICAgIGlmIChjYW5jZWxsZWQpIHJldHVybjtcbiAgICAgICAgICAgICAgICBpZiAoc2F2ZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBzZXRTYXZlZExvY3Moc2F2ZWQpO1xuICAgICAgICAgICAgICAgICAgICAvLyBNaXJyb3IgdG8gbG9jYWxTdG9yYWdlIHNvIHRoZSBkYXNoYm9hcmQgc2VlcyB0aGUgc2FtZSBsaXN0XG4gICAgICAgICAgICAgICAgICAgIC8vIGV2ZW4gaWYgaXRzIG93biBoeWRyYXRlIGhhc24ndCBydW4geWV0IHRoaXMgc2Vzc2lvbi5cbiAgICAgICAgICAgICAgICAgICAgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3NhdmVkV2VhdGhlckxvY2F0aW9ucycsIEpTT04uc3RyaW5naWZ5KHNhdmVkKSk7IH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBvZmZsaW5lIC0+IGxvY2FsU3RvcmFnZSB2YWx1ZSBhbHJlYWR5IGluIHN0YXRlICovIH1cbiAgICAgICAgfSkoKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHsgY2FuY2VsbGVkID0gdHJ1ZTsgfTtcbiAgICB9LCBbXSk7XG5cbiAgICAvKiAtLS0tLSBzYXZlZC1sb2NhdGlvbnMgZHJvcGRvd24gb3Blbi9jbG9zZSBzdGF0ZS5cbiAgICAgKiBOYXRpdmUgPGRhdGFsaXN0PiBoaWRlcyBpdHMgY2hldnJvbiBpbiBtb3N0IGJyb3dzZXJzIChlc3BlY2lhbGx5IGluXG4gICAgICogYSBkYXJrIHRoZW1lKSwgd2hpY2ggbWFkZSB0aGUgXCJkcm9wIGRvd25cIiBpbnZpc2libGUgdG8gb3BlcmF0b3JzXG4gICAgICogd2hvIGNsZWFybHkgaGFkIG11bHRpcGxlIHNhdmVkIGxvY2F0aW9ucy4gIFJlcGxhY2VkIHdpdGggYSBjdXN0b21cbiAgICAgKiBwb3Bkb3duIHBhbmVsIHRoYXQgaGFzIGFuIEFMV0FZUy1WSVNJQkxFIGNoZXZyb24gYnV0dG9uIC0tIGNsaWNrIGl0XG4gICAgICogdG8gdG9nZ2xlLCBjbGljayBvdXRzaWRlIHRvIGRpc21pc3MuICovXG4gICAgY29uc3QgW3NhdmVkT3Blbiwgc2V0U2F2ZWRPcGVuXSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBzYXZlZFJlZiA9IFJlYWN0LnVzZVJlZihudWxsKTtcbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoIXNhdmVkT3BlbikgcmV0dXJuO1xuICAgICAgICBjb25zdCBvbkRvY0NsaWNrID0gKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChzYXZlZFJlZi5jdXJyZW50ICYmICFzYXZlZFJlZi5jdXJyZW50LmNvbnRhaW5zKGUudGFyZ2V0KSkgc2V0U2F2ZWRPcGVuKGZhbHNlKTtcbiAgICAgICAgfTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2NDbGljayk7XG4gICAgICAgIHJldHVybiAoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKTtcbiAgICB9LCBbc2F2ZWRPcGVuXSk7XG5cbiAgICAvKiBXaGVuIHRoZSB1c2VyIHBpY2tzIGEgbmFtZSBmcm9tIHRoZSBkcm9wZG93biBPUiB0eXBlcyBvbmUgdGhhdFxuICAgICAqIGV4YWN0bHkgbWF0Y2hlcyBhIHNhdmVkIGVudHJ5LCBwdWxsIGl0cyBsYXQvbG9uIGFuZCByZWNlbnRyZSB0aGVcbiAgICAgKiBtYXAuICBGcmVlLWZvcm0gdHlwaW5nIHN0aWxsIHdvcmtzIC0tIHRoZSBuYW1lIGlzIGp1c3Qga2VwdCBhcyB0aGVcbiAgICAgKiBzaXRlIGxhYmVsLiAgQXZvaWRzIHN1cnByaXNpbmcgdGhlIG9wZXJhdG9yIHdobyB0eXBlcyBcIlBhdmlsaW9uIEJcIlxuICAgICAqIChhIGxhYmVsIHRoZXkgaW52ZW50ZWQpIGFuZCBleHBlY3RzIHRoZSBtYXAgTk9UIHRvIGp1bXAuICovXG4gICAgY29uc3Qgb25TaXRlTmFtZUNoYW5nZSA9IChuZXdOYW1lKSA9PiB7XG4gICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgc2l0ZU5hbWU6bmV3TmFtZX0pKTtcbiAgICAgICAgY29uc3QgaGl0ID0gc2F2ZWRMb2NzLmZpbmQocyA9PiBzLm5hbWUgPT09IG5ld05hbWUpO1xuICAgICAgICBpZiAoaGl0KSB7XG4gICAgICAgICAgICBjb25zdCBsYXQgPSBNYXRoLnJvdW5kKGhpdC5sYXQgKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgICAgIGNvbnN0IGxvbiA9IE1hdGgucm91bmQoaGl0LmxvbiAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBzaXRlTmFtZTpuZXdOYW1lLCBsYXQsIGxvbiwgY2l0eTpuZXdOYW1lfSkpO1xuICAgICAgICAgICAgaWYgKG1hcFJlZi5jdXJyZW50KSBtYXBSZWYuY3VycmVudC5zZXRWaWV3KFtsYXQsIGxvbl0sIDExKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgcGlja1NhdmVkTG9jID0gKGxvYykgPT4ge1xuICAgICAgICBzZXRTYXZlZE9wZW4oZmFsc2UpO1xuICAgICAgICBvblNpdGVOYW1lQ2hhbmdlKGxvYy5uYW1lKTtcbiAgICB9O1xuXG4gICAgLyogUmVtb3ZlIGEgc2F2ZWQgbG9jYXRpb24gZnJvbSB0aGUgbGlzdC4gIERlZHVwLWtleWVkIGJ5IGxhdC9sb24gc28gdHdvXG4gICAgICogZW50cmllcyB0aGF0IHNoYXJlIGEgbmFtZSAoZS5nLiBcIkhPTUVcIiBhdCB0aGUgb2ZmaWNlIHZzIHRoZSBhcGFydG1lbnQpXG4gICAgICogYXJlIGFkZHJlc3NlZCBpbmRpdmlkdWFsbHkgLS0gcmVtb3Zpbmcgb25lIGtlZXBzIHRoZSBvdGhlci4gIE1pcnJvcnNcbiAgICAgKiB0aGUgY2hhbmdlIHRvIGxvY2FsU3RvcmFnZSBBTkQgdGhlIHNlcnZlciBzbyB0aGUgZGFzaGJvYXJkJ3MgV2VhdGhlclxuICAgICAqIGJ1dHRvbiBzZWVzIHRoZSBkZWxldGlvbiBvbiBpdHMgbmV4dCByZWFkLiAqL1xuICAgIGNvbnN0IHJlbW92ZVNhdmVkTG9jID0gKGxvYykgPT4ge1xuICAgICAgICBjb25zdCBrZXkgPSBsb2MubGF0LnRvRml4ZWQoNCkgKyAnLCcgKyBsb2MubG9uLnRvRml4ZWQoNCk7XG4gICAgICAgIGNvbnN0IG5leHQgPSBzYXZlZExvY3MuZmlsdGVyKHMgPT4gKHMubGF0LnRvRml4ZWQoNCkgKyAnLCcgKyBzLmxvbi50b0ZpeGVkKDQpKSAhPT0ga2V5KTtcbiAgICAgICAgc2V0U2F2ZWRMb2NzKG5leHQpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3NhdmVkV2VhdGhlckxvY2F0aW9ucycsIEpTT04uc3RyaW5naWZ5KG5leHQpKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBwcml2YXRlIG1vZGUgKi8gfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdyZWQ1OndlYXRoZXJMb2NhdGlvbkNoYW5nZWQnLFxuICAgICAgICAgICAgICAgIHsgZGV0YWlsOiB7IHNhdmVkOiBuZXh0IH0gfSkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgICAvKiBCZXN0LWVmZm9ydCBzZXJ2ZXIgc3luYy4gIEFub255bW91cyB1c2VycyBnZXQgcGVyc2lzdGVkOmZhbHNlIGJhY2ssXG4gICAgICAgICAqIHdoaWNoIGlzIGZpbmUgLS0gdGhlIGxvY2FsIGNvcHkgYWxyZWFkeSByZWZsZWN0cyB0aGUgcmVtb3ZhbC4gKi9cbiAgICAgICAgZmV0Y2goJy9hcGkvd2VhdGhlci1sb2NhdGlvbicsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6J2FwcGxpY2F0aW9uL2pzb24nIH0sXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHNhdmVkOiBuZXh0IH0pLFxuICAgICAgICB9KS5jYXRjaCgoKSA9PiB7IC8qIG9mZmxpbmUgLS0gbG9jYWxTdG9yYWdlIGFscmVhZHkgdXBkYXRlZCAqLyB9KTtcbiAgICAgICAgLyogSWYgdGhlIG9wZXJhdG9yIGp1c3QgZGVsZXRlZCB0aGUgZW50cnkgY3VycmVudGx5IGluIHRoZSBpbnB1dCxcbiAgICAgICAgICogYmxhbmsgdGhlIGlucHV0IHNvIGEgc3RhbGUgc2VsZWN0aW9uIGlzbid0IGFjY2lkZW50YWxseSBzYXZlZC4gKi9cbiAgICAgICAgaWYgKChjZmcuc2l0ZU5hbWUgfHwgJycpLnRyaW0oKSA9PT0gbG9jLm5hbWUpIHtcbiAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgc2l0ZU5hbWU6Jyd9KSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5leHQubGVuZ3RoID09PSAwKSBzZXRTYXZlZE9wZW4oZmFsc2UpO1xuICAgIH07XG5cbiAgICAvKiBJbmxpbmUgcmVuYW1lOiB0eXBpbmcgaW50byBhIHJvdydzIG5hbWUgaW5wdXQgdXBkYXRlcyB0aGUgaW4tbWVtb3J5XG4gICAgICogYHNhdmVkTG9jc2AgbGlzdCAoTk9UIHBlcnNpc3RlZCB1bnRpbCBcIlNhdmUgJiBSZXR1cm5cIikuICBLZXllZCBieSB0aGVcbiAgICAgKiByb3cncyBsYXQvbG9uIHNvIHR3byBzYW1lLW5hbWVkIGVudHJpZXMgYXQgZGlmZmVyZW50IGNvb3JkaW5hdGVzIGNhblxuICAgICAqIGJlIHJlbmFtZWQgaW5kZXBlbmRlbnRseS4gIFRyaW0gaXMgZGVsYXllZCB1bnRpbCBwZXJzaXN0IHNvIHRoZVxuICAgICAqIG9wZXJhdG9yIGNhbiBrZWVwIHR5cGluZyB3aXRob3V0IHRoZSBmaWVsZCBcInNuYXBwaW5nXCIgbWlkLWVkaXQuICovXG4gICAgY29uc3QgcmVuYW1lU2F2ZWRMb2MgPSAob3JpZ0xvYywgbmV3TmFtZSkgPT4ge1xuICAgICAgICBjb25zdCBrZXkgPSBvcmlnTG9jLmxhdC50b0ZpeGVkKDQpICsgJywnICsgb3JpZ0xvYy5sb24udG9GaXhlZCg0KTtcbiAgICAgICAgc2V0U2F2ZWRMb2NzKHByZXYgPT4gcHJldi5tYXAocyA9PlxuICAgICAgICAgICAgKHMubGF0LnRvRml4ZWQoNCkgKyAnLCcgKyBzLmxvbi50b0ZpeGVkKDQpKSA9PT0ga2V5XG4gICAgICAgICAgICAgICAgPyB7IC4uLnMsIG5hbWU6IG5ld05hbWUgfVxuICAgICAgICAgICAgICAgIDogc1xuICAgICAgICApKTtcbiAgICAgICAgLyogSWYgdGhlIG9wZXJhdG9yIGlzIHJlbmFtaW5nIHRoZSBlbnRyeSB0aGF0IGlzIGN1cnJlbnRseSB0aGVcbiAgICAgICAgICogXCJhY3RpdmVcIiBwaWNrIChzaXRlTmFtZSBtYXRjaGVzKSwga2VlcCB0aGUgcGlja2VyIGluIHN5bmMuICovXG4gICAgICAgIGNvbnN0IHN0aWxsU2VsZWN0ZWQgPSAoY2ZnLnNpdGVOYW1lIHx8ICcnKS50cmltKCkgPT09IG9yaWdMb2MubmFtZVxuICAgICAgICAgICAgJiYgTWF0aC5hYnMoY2ZnLmxhdCAtIG9yaWdMb2MubGF0KSA8IDFlLTRcbiAgICAgICAgICAgICYmIE1hdGguYWJzKGNmZy5sb24gLSBvcmlnTG9jLmxvbikgPCAxZS00O1xuICAgICAgICBpZiAoc3RpbGxTZWxlY3RlZCkge1xuICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBzaXRlTmFtZTpuZXdOYW1lLCBjaXR5Om5ld05hbWV9KSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyogLS0tLS0gc2VhcmNoIHN0YXRlIC0tLS0tICovXG4gICAgY29uc3QgW3NlYXJjaFEsIHNldFNlYXJjaFFdICAgICAgICAgPSBSZWFjdC51c2VTdGF0ZSgnJyk7XG4gICAgY29uc3QgW3NlYXJjaEhpdHMsIHNldFNlYXJjaEhpdHNdICAgPSBSZWFjdC51c2VTdGF0ZShbXSk7XG4gICAgY29uc3QgW3NlYXJjaEJ1c3ksIHNldFNlYXJjaEJ1c3ldICAgPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3QgW3NlYXJjaE9wZW4sIHNldFNlYXJjaE9wZW5dICAgPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3Qgc2VhcmNoRGVib3VuY2VSZWYgICAgICAgICAgICAgPSBSZWFjdC51c2VSZWYobnVsbCk7XG5cbiAgICAvKiBGb3J3YXJkLWdlb2NvZGU6IHF1ZXJ5IC0+IFt7bGF0LCBsb24sIGRpc3BsYXlfbmFtZSwgdHlwZSwgLi4ufV0gKi9cbiAgICBjb25zdCBydW5TZWFyY2ggPSBhc3luYyAocSkgPT4ge1xuICAgICAgICBpZiAoIXEgfHwgcS50cmltKCkubGVuZ3RoIDwgMykgeyBzZXRTZWFyY2hIaXRzKFtdKTsgcmV0dXJuOyB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzZXRTZWFyY2hCdXN5KHRydWUpO1xuICAgICAgICAgICAgY29uc3QgdXJsID0gYGh0dHBzOi8vbm9taW5hdGltLm9wZW5zdHJlZXRtYXAub3JnL3NlYXJjaD9mb3JtYXQ9anNvbiZsaW1pdD02JnE9JHtlbmNvZGVVUklDb21wb25lbnQocSl9YDtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCh1cmwsIHsgaGVhZGVyczp7ICdBY2NlcHQnOidhcHBsaWNhdGlvbi9qc29uJyB9IH0pO1xuICAgICAgICAgICAgY29uc3QgaiA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgICAgICAgc2V0U2VhcmNoSGl0cyhBcnJheS5pc0FycmF5KGopID8gaiA6IFtdKTtcbiAgICAgICAgICAgIHNldFNlYXJjaE9wZW4odHJ1ZSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgc2V0U2VhcmNoSGl0cyhbXSk7IH1cbiAgICAgICAgZmluYWxseSB7IHNldFNlYXJjaEJ1c3koZmFsc2UpOyB9XG4gICAgfTtcblxuICAgIC8qIGRlYm91bmNlZCBzZWFyY2gtb24tdHlwZSAqL1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmIChzZWFyY2hEZWJvdW5jZVJlZi5jdXJyZW50KSBjbGVhclRpbWVvdXQoc2VhcmNoRGVib3VuY2VSZWYuY3VycmVudCk7XG4gICAgICAgIHNlYXJjaERlYm91bmNlUmVmLmN1cnJlbnQgPSBzZXRUaW1lb3V0KCgpID0+IHJ1blNlYXJjaChzZWFyY2hRKSwgNDAwKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHNlYXJjaERlYm91bmNlUmVmLmN1cnJlbnQgJiYgY2xlYXJUaW1lb3V0KHNlYXJjaERlYm91bmNlUmVmLmN1cnJlbnQpO1xuICAgIH0sIFtzZWFyY2hRXSk7XG5cbiAgICBjb25zdCBwaWNrU2VhcmNoSGl0ID0gKGhpdCkgPT4ge1xuICAgICAgICBjb25zdCBsYXQgPSBNYXRoLnJvdW5kKCtoaXQubGF0ICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgIGNvbnN0IGxvbiA9IE1hdGgucm91bmQoK2hpdC5sb24gKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBsYXQsIGxvbiwgY2l0eTpoaXQuZGlzcGxheV9uYW1lfSkpO1xuICAgICAgICBpZiAobWFwUmVmLmN1cnJlbnQpIG1hcFJlZi5jdXJyZW50LnNldFZpZXcoW2xhdCwgbG9uXSwgaGl0LnR5cGUgPT09ICdjaXR5JyA/IDExIDogMTUpO1xuICAgICAgICBzZXRTZWFyY2hPcGVuKGZhbHNlKTtcbiAgICAgICAgc2V0U2VhcmNoUSgnJyk7XG4gICAgfTtcblxuICAgIC8qIFJldmVyc2UtZ2VvY29kZSBsYXQvbG9uIC0+IGNpdHkgLyBjb3VudHJ5IHZpYSBOb21pbmF0aW0uICBObyBBUEkga2V5LiAqL1xuICAgIGNvbnN0IHJldmVyc2VHZW9jb2RlID0gYXN5bmMgKGxhdCwgbG9uKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzZXRHZW9CdXN5KHRydWUpO1xuICAgICAgICAgICAgY29uc3QgdXJsID0gYGh0dHBzOi8vbm9taW5hdGltLm9wZW5zdHJlZXRtYXAub3JnL3JldmVyc2U/Zm9ybWF0PWpzb24mbGF0PSR7bGF0fSZsb249JHtsb259Jnpvb209MTBgO1xuICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwgeyBoZWFkZXJzOiB7ICdBY2NlcHQnOidhcHBsaWNhdGlvbi9qc29uJyB9IH0pO1xuICAgICAgICAgICAgY29uc3QgaiA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgICAgICAgY29uc3QgYSA9IGouYWRkcmVzcyB8fCB7fTtcbiAgICAgICAgICAgIGNvbnN0IGNpdHkgPSBhLmNpdHkgfHwgYS50b3duIHx8IGEudmlsbGFnZSB8fCBhLmhhbWxldCB8fCBhLmNvdW50eSB8fCAnJztcbiAgICAgICAgICAgIGNvbnN0IHJlZ2lvbiA9IGEuc3RhdGUgfHwgYS5yZWdpb24gfHwgJyc7XG4gICAgICAgICAgICBjb25zdCBjb3VudHJ5ID0gYS5jb3VudHJ5IHx8ICcnO1xuICAgICAgICAgICAgY29uc3QgbGFiZWwgPSBbY2l0eSwgcmVnaW9uLCBjb3VudHJ5XS5maWx0ZXIoQm9vbGVhbikuam9pbignLCAnKSB8fCBqLmRpc3BsYXlfbmFtZSB8fCAnJztcbiAgICAgICAgICAgIGlmIChsYWJlbCkgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBjaXR5OmxhYmVsfSkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IC8qIG9mZmxpbmUgb3IgcmF0ZS1saW1pdGVkIC0+IGtlZXAgcHJpb3IgbmFtZSAqLyB9XG4gICAgICAgIGZpbmFsbHkgeyBzZXRHZW9CdXN5KGZhbHNlKTsgfVxuICAgIH07XG5cbiAgICAvKiBJbml0IExlYWZsZXQgb24gZmlyc3QgcmVuZGVyIG9mIHRoZSBtb2RhbCAqL1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmICghbWFwQm94UmVmLmN1cnJlbnQgfHwgbWFwUmVmLmN1cnJlbnQpIHJldHVybjtcbiAgICAgICAgY29uc3QgbWFwID0gTC5tYXAobWFwQm94UmVmLmN1cnJlbnQsIHsgem9vbUNvbnRyb2w6IHRydWUsIGF0dHJpYnV0aW9uQ29udHJvbDogdHJ1ZSB9KVxuICAgICAgICAgICAgICAgICAgICAgLnNldFZpZXcoW2NmZy5sYXQsIGNmZy5sb25dLCA2KTtcbiAgICAgICAgTC50aWxlTGF5ZXIoJ2h0dHBzOi8ve3N9LnRpbGUub3BlbnN0cmVldG1hcC5vcmcve3p9L3t4fS97eX0ucG5nJywge1xuICAgICAgICAgICAgbWF4Wm9vbTogMTgsXG4gICAgICAgICAgICBhdHRyaWJ1dGlvbjogJyZjb3B5OyBPcGVuU3RyZWV0TWFwIGNvbnRyaWJ1dG9ycycsXG4gICAgICAgIH0pLmFkZFRvKG1hcCk7XG5cbiAgICAgICAgY29uc3QgbWFya2VyID0gTC5tYXJrZXIoW2NmZy5sYXQsIGNmZy5sb25dLCB7IGRyYWdnYWJsZTogdHJ1ZSB9KS5hZGRUbyhtYXApO1xuICAgICAgICBtYXJrZXIuYmluZFRvb2x0aXAoJ0RyYWcgbWUgb3IgY2xpY2sgYW55d2hlcmUgb24gdGhlIG1hcCcsIHsgcGVybWFuZW50OiBmYWxzZSB9KTtcblxuICAgICAgICBjb25zdCBhcHBseUxhdExvbiA9IChsYXQsIGxvbikgPT4ge1xuICAgICAgICAgICAgY29uc3QgciA9IChuKSA9PiBNYXRoLnJvdW5kKG4gKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgbGF0OnIobGF0KSwgbG9uOnIobG9uKX0pKTtcbiAgICAgICAgICAgIHJldmVyc2VHZW9jb2RlKHIobGF0KSwgcihsb24pKTtcbiAgICAgICAgfTtcbiAgICAgICAgbWFya2VyLm9uKCdkcmFnZW5kJywgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGwgPSBtYXJrZXIuZ2V0TGF0TG5nKCk7XG4gICAgICAgICAgICBhcHBseUxhdExvbihsbC5sYXQsIGxsLmxuZyk7XG4gICAgICAgIH0pO1xuICAgICAgICBtYXAub24oJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgIG1hcmtlci5zZXRMYXRMbmcoZS5sYXRsbmcpO1xuICAgICAgICAgICAgYXBwbHlMYXRMb24oZS5sYXRsbmcubGF0LCBlLmxhdGxuZy5sbmcpO1xuICAgICAgICB9KTtcblxuICAgICAgICBtYXBSZWYuY3VycmVudCA9IG1hcDtcbiAgICAgICAgbWFya2VyUmVmLmN1cnJlbnQgPSBtYXJrZXI7XG5cbiAgICAgICAgLyogTGVhZmxldCByZW5kZXJzIGJsYW5rIGlmIGl0IGJvb3RzIGluc2lkZSBhIGhpZGRlbiBlbGVtZW50IOKAlCBraWNrIGl0XG4gICAgICAgICAgIG9uY2UgdGhlIG1vZGFsIGFuaW1hdGlvbiBzZXR0bGVzLiAqL1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IG1hcC5pbnZhbGlkYXRlU2l6ZSgpLCAyNTApO1xuICAgICAgICByZXR1cm4gKCkgPT4geyBtYXAucmVtb3ZlKCk7IG1hcFJlZi5jdXJyZW50ID0gbnVsbDsgbWFya2VyUmVmLmN1cnJlbnQgPSBudWxsOyB9O1xuICAgIH0sIFtdKTtcblxuICAgIC8qIEtlZXAgbWFya2VyIGluIHN5bmMgd2hlbiB1c2VyIGVkaXRzIGxhdC9sb24gZmllbGRzIG1hbnVhbGx5ICovXG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKG1hcFJlZi5jdXJyZW50ICYmIG1hcmtlclJlZi5jdXJyZW50KSB7XG4gICAgICAgICAgICBtYXJrZXJSZWYuY3VycmVudC5zZXRMYXRMbmcoW2NmZy5sYXQsIGNmZy5sb25dKTtcbiAgICAgICAgICAgIG1hcFJlZi5jdXJyZW50LnBhblRvKFtjZmcubGF0LCBjZmcubG9uXSk7XG4gICAgICAgIH1cbiAgICB9LCBbY2ZnLmxhdCwgY2ZnLmxvbl0pO1xuXG4gICAgLyogR2VvbG9jYXRpb246IHNpbGVudGx5IG5vLW9wJ2QgYmVmb3JlIC0tIGlmIHRoZSBicm93c2VyIGJsb2NrZWQgdGhlXG4gICAgICogcmVxdWVzdCAoSFRUUCBvcmlnaW4gPSBub3QgYSBzZWN1cmUgY29udGV4dCBvbiBmaWVsZCBjb250cm9sbGVycywgb3JcbiAgICAgKiB0aGUgdXNlciBkZW5pZWQgcGVybWlzc2lvbiBlYXJsaWVyKSB0aGUgYnV0dG9uIGp1c3Qgc2F0IHRoZXJlLlxuICAgICAqIE5vdyB3ZSBzdXJmYWNlIGEgc3RhdGUgKGJ1c3kgLyBlcnIpIHNvIHRoZSBvcGVyYXRvciBjYW4gc2VlIFdIWSBpdFxuICAgICAqIGZhaWxlZCBhbmQgYWN0IG9uIGl0IChzd2l0Y2ggdG8gSFRUUFMsIHJlLXByb21wdCwgb3IgdXNlIHRoZSBtYXApLiAqL1xuICAgIGNvbnN0IFtnZW9TdGF0ZSwgc2V0R2VvU3RhdGVdID0gUmVhY3QudXNlU3RhdGUobnVsbCk7ICAgLy8gbnVsbCB8ICdidXN5JyB8IHtlcnJ9XG4gICAgY29uc3QgdXNlTXlMb2NhdGlvbiA9ICgpID0+IHtcbiAgICAgICAgc2V0R2VvU3RhdGUoJ2J1c3knKTtcbiAgICAgICAgLy8gbmF2aWdhdG9yLmdlb2xvY2F0aW9uIGlzIGB1bmRlZmluZWRgIG9uIEhUVFAgb3JpZ2lucyAoQ2hyb21lIDUwKykuXG4gICAgICAgIGlmICghbmF2aWdhdG9yLmdlb2xvY2F0aW9uKSB7XG4gICAgICAgICAgICBzZXRHZW9TdGF0ZSh7IGVycjonQnJvd3NlciBibG9ja2VkIGxvY2F0aW9uIGFjY2VzcyDigJQgb3BlbiB0aGlzIHBhZ2UgdmlhIEhUVFBTLicgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihcbiAgICAgICAgICAgIChwb3MpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBsYXQgPSBNYXRoLnJvdW5kKHBvcy5jb29yZHMubGF0aXR1ZGUgICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgICAgICAgICAgY29uc3QgbG9uID0gTWF0aC5yb3VuZChwb3MuY29vcmRzLmxvbmdpdHVkZSAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgbGF0LCBsb259KSk7XG4gICAgICAgICAgICAgICAgaWYgKG1hcFJlZi5jdXJyZW50KSBtYXBSZWYuY3VycmVudC5zZXRWaWV3KFtsYXQsIGxvbl0sIDExKTtcbiAgICAgICAgICAgICAgICByZXZlcnNlR2VvY29kZShsYXQsIGxvbik7XG4gICAgICAgICAgICAgICAgc2V0R2VvU3RhdGUobnVsbCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGVyci5jb2RlOiAxPVBFUk1JU1NJT05fREVOSUVELCAyPVBPU0lUSU9OX1VOQVZBSUxBQkxFLCAzPVRJTUVPVVRcbiAgICAgICAgICAgICAgICBjb25zdCBtc2cgPSBlcnIgJiYgZXJyLmNvZGUgPT09IDFcbiAgICAgICAgICAgICAgICAgICAgPyAnTG9jYXRpb24gcGVybWlzc2lvbiBkZW5pZWQg4oCUIGNsaWNrIHRoZSBsb2NrIGljb24gaW4gdGhlIGFkZHJlc3MgYmFyIGFuZCBhbGxvdyBsb2NhdGlvbi4nXG4gICAgICAgICAgICAgICAgICAgIDogZXJyICYmIGVyci5jb2RlID09PSAyXG4gICAgICAgICAgICAgICAgICAgICAgICA/ICdMb2NhdGlvbiBjdXJyZW50bHkgdW5hdmFpbGFibGUg4oCUIHRoZSBkZXZpY2UgaGFzIG5vIEdQUyAvIFdpLUZpIGZpeCB5ZXQuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgOiBlcnIgJiYgZXJyLmNvZGUgPT09IDNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdMb2NhdGlvbiByZXF1ZXN0IHRpbWVkIG91dCDigJQgdHJ5IGFnYWluLCBvciB1c2UgdGhlIG1hcCAvIHNlYXJjaCBiYXIuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogKGVyciAmJiBlcnIubWVzc2FnZSkgfHwgJ0NvdWxkIG5vdCByZWFkIGRldmljZSBsb2NhdGlvbi4nO1xuICAgICAgICAgICAgICAgIHNldEdlb1N0YXRlKHsgZXJyOiBtc2cgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeyBlbmFibGVIaWdoQWNjdXJhY3k6dHJ1ZSwgdGltZW91dDoxMDAwMCwgbWF4aW11bUFnZTowIH1cbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgLyogV2hlbiB1c2VyIGNsaWNrcyBcIlNhdmUgJiByZXR1cm5cIiwgbWlycm9yIEVYQUNUTFkgd2hhdCB0aGUgZGFzaGJvYXJkJ3NcbiAgICAgKiBXZWF0aGVyIGJ1dHRvbiBkb2VzIGluIHdlYXRoZXItc2V0dGluZ3MtbW9kYWwuanMjc2VsZWN0TG9jYXRpb246XG4gICAgICogICAxLiBsb2NhbFN0b3JhZ2VbJ3dlYXRoZXJMb2NhdGlvbiddICAgICAgICA9IGNob3NlbiBsb2MgKGNhbm9uaWNhbCBrZXlcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgZGFzaGJvYXJkIHJlYWRzIG9uXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW91bnQsIE5PVCAncmVkNS53ZWF0aGVyX2xvY2F0aW9uJykuXG4gICAgICogICAyLiBsb2NhbFN0b3JhZ2VbJ3NhdmVkV2VhdGhlckxvY2F0aW9ucyddICA9IFtsb2MsIC4uLm90aGVyc10gZGVkdXBlZFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ5IGxhdC9sb24sIGNhcHBlZCBhdCAyMC5cbiAgICAgKiAgIDMuIFBPU1QgL2FwaS93ZWF0aGVyLWxvY2F0aW9uIHdpdGggYWN0aXZlK2RlZmF1bHQrc2F2ZWQgc28gdGhlIHNhbWVcbiAgICAgKiAgICAgIGxpc3Qgc3Vydml2ZXMgY3Jvc3MtZGV2aWNlIHNlc3Npb25zIGZvciBzaWduZWQtaW4gdGVuYW50cy5cbiAgICAgKlxuICAgICAqIFdpdGhvdXQgc3RlcCAxIHRoZSBkYXNoYm9hcmQncyBgd2VhdGhlckxvY2F0aW9uYCBzdGF0ZSBzaWxlbnRseSBrZWVwc1xuICAgICAqIGl0cyBvbGQgdmFsdWUgLS0gd2hpY2ggaXMgZXhhY3RseSB0aGUgYnVnIG9wZXJhdG9ycyByZXBvcnRlZCBhZnRlclxuICAgICAqIHBpY2tpbmcgYSBsb2NhdGlvbiBpbiBTZXR1cCBXYWxrIGFuZCBzZWVpbmcgdGhlIGRhc2hib2FyZCdzIHdlYXRoZXJcbiAgICAgKiBzdHJpcCByZWZ1c2UgdG8gdXBkYXRlLiAqL1xuICAgIGNvbnN0IFtzYXZlTXNnLCBzZXRTYXZlTXNnXSA9IFJlYWN0LnVzZVN0YXRlKG51bGwpO1xuICAgIGNvbnN0IHBlcnNpc3RBbmRTYXZlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zdCBsb2MgPSB7IGxhdDogY2ZnLmxhdCwgbG9uOiBjZmcubG9uLCBuYW1lOiBjZmcuc2l0ZU5hbWUgfHwgY2ZnLmNpdHkgfTtcblxuICAgICAgICAvLyBEZS1kdXAgdGhlIGV4aXN0aW5nIHNhdmVkIGxpc3QgYnkgbGF0L2xvbiAoc2FtZSBrZXkgdGhlIGRhc2hib2FyZFxuICAgICAgICAvLyB1c2VzKSBhbmQgcHV0IHRoZSBuZXcgcGljayBhdCB0aGUgdG9wLiAgQ2FwIGF0IDIwIHRvIG1hdGNoIHRoZVxuICAgICAgICAvLyBkYXNoYm9hcmQncyBiZWhhdmlvdXIuXG4gICAgICAgIGNvbnN0IGtleSA9IGxvYy5sYXQudG9GaXhlZCg0KSArICcsJyArIGxvYy5sb24udG9GaXhlZCg0KTtcbiAgICAgICAgY29uc3QgZGVkdXBlZCA9IHNhdmVkTG9jcy5maWx0ZXIobCA9PiAobC5sYXQudG9GaXhlZCg0KSArICcsJyArIGwubG9uLnRvRml4ZWQoNCkpICE9PSBrZXkpO1xuICAgICAgICBjb25zdCBuZXh0U2F2ZWQgPSBbbG9jLCAuLi5kZWR1cGVkXS5zbGljZSgwLCAyMCk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd3ZWF0aGVyTG9jYXRpb24nLCBKU09OLnN0cmluZ2lmeShsb2MpKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzYXZlZFdlYXRoZXJMb2NhdGlvbnMnLCBKU09OLnN0cmluZ2lmeShuZXh0U2F2ZWQpKTtcbiAgICAgICAgICAgIC8vIEtlZXAgdGhlIG9sZCBrZXkgdG9vIC0tIHNvbWUgbGVnYWN5IHBsdWctaW5zIHN0aWxsIGxvb2sgYXQgaXQuXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS53ZWF0aGVyX2xvY2F0aW9uJywgSlNPTi5zdHJpbmdpZnkobG9jKSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogcHJpdmF0ZSBtb2RlIC0tIGlnbm9yZSAqLyB9XG5cbiAgICAgICAgbGV0IHBlcnNpc3RlZCA9IGZhbHNlLCB3YXJuaW5nID0gJyc7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goJy9hcGkvd2VhdGhlci1sb2NhdGlvbicsIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICBjcmVkZW50aWFsczogJ2luY2x1ZGUnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6J2FwcGxpY2F0aW9uL2pzb24nIH0sXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBhY3RpdmU6IGxvYywgZGVmYXVsdDogbG9jLCBzYXZlZDogbmV4dFNhdmVkIH0pLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBqID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgICB3aW5kb3cuX2xhc3RXZWF0aGVyTG9jYXRpb25TYXZlID0gajtcbiAgICAgICAgICAgIHBlcnNpc3RlZCA9ICEhai5wZXJzaXN0ZWQ7XG4gICAgICAgICAgICB3YXJuaW5nICAgPSBqLndhcm5pbmcgfHwgJyc7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ1tzZXR1cCB3YWxrXSAvYXBpL3dlYXRoZXItbG9jYXRpb24gPC0nLCBqKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgd2FybmluZyA9ICdOZXR3b3JrIGVycm9yIOKAlCBzYXZlZCBsb2NhbGx5IG9ubHkuJztcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignW3NldHVwIHdhbGtdIGNvdWxkIG5vdCBwZXJzaXN0IGxvY2F0aW9uOicsIGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGVsbCBhbnkgb3BlbiBkYXNoYm9hcmQgdGFiIHRvIHJlLWh5ZHJhdGUuICBUaGUgZGFzaGJvYXJkXG4gICAgICAgIC8vIGFscmVhZHkgbGlzdGVucyBmb3IgYHN0b3JhZ2VgIGV2ZW50cyB3aGVuIGFub3RoZXIgdGFiIHdyaXRlcyB0b1xuICAgICAgICAvLyBsb2NhbFN0b3JhZ2UsIGJ1dCBvbiBWMS45IHNvbWUgYnJvd3NlcnMgRE9OJ1QgZmlyZSBgc3RvcmFnZWAgZm9yXG4gICAgICAgIC8vIHNhbWUtb3JpZ2luIHdyaXRlcyBmcm9tIHRoaXMgc2FtZSB0YWIuICBBbiBleHBsaWNpdCBjdXN0b20gZXZlbnRcbiAgICAgICAgLy8gbWFrZXMgdGhlIGRhc2hib2FyZCdzIHBvbGxpbmcgcGljayB0aGUgY2hhbmdlIHVwIGltbWVkaWF0ZWx5IGlmXG4gICAgICAgIC8vIGl0J3MgYWxyZWFkeSBtb3VudGVkIGluIGFub3RoZXIgdGFiL3dpbmRvdy5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncmVkNTp3ZWF0aGVyTG9jYXRpb25DaGFuZ2VkJyxcbiAgICAgICAgICAgICAgICB7IGRldGFpbDogeyBhY3RpdmU6IGxvYywgc2F2ZWQ6IG5leHRTYXZlZCB9IH0pKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBJRS1sZXNzIGVudmlyb25tZW50cyAtLSBuby1vcCAqLyB9XG5cbiAgICAgICAgaWYgKHBlcnNpc3RlZCkge1xuICAgICAgICAgICAgb25TYXZlKCk7ICAgICAgICAgICAvLyBoYXBweSBwYXRoOiBjbG9zZSArIG1hcmsgc3RlcCBkb25lXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvKiBTdXJmYWNlIHRoZSB3YXJuaW5nLCBob2xkIHRoZSBtb2RhbCBvcGVuIGZvciAxLjZzIHNvIHRoZVxuICAgICAgICAgICAgICogb3BlcmF0b3IgcmVhZHMgaXQsIHRoZW4gY2xvc2UuICBUaGUgbG9jYWwgY29weSBpcyBhbHJlYWR5XG4gICAgICAgICAgICAgKiB3cml0dGVuLCBzbyB0aGUgZGFzaGJvYXJkIHdpbGwgc3RpbGwgc2VlIHRoZSBuZXcgbG9jYXRpb25cbiAgICAgICAgICAgICAqIGluIHRoaXMgYnJvd3NlciBzZXNzaW9uLiAqL1xuICAgICAgICAgICAgc2V0U2F2ZU1zZyh3YXJuaW5nIHx8ICdTYXZlZCBsb2NhbGx5IG9ubHkg4oCUIHNpZ24gaW4gdG8gc2F2ZSBzZXJ2ZXItc2lkZS4nKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyBzZXRTYXZlTXNnKG51bGwpOyBvblNhdmUoKTsgfSwgMTYwMCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8TW9kYWxTaGVsbCB0aXRsZT17dCgnc3dfbG9jYXRpb25fc2V0dGluZycpfSBzdWJ0aXRsZT17dCgnc3dfbG9jYXRpb25fc3ViJyl9IGFjY2VudD1cImFtYmVyXCIgb25DbG9zZT17b25DbG9zZX0gb25TYXZlPXtwZXJzaXN0QW5kU2F2ZX0gc2l6ZT1cIm1heFwiPlxuICAgICAgICAgICAge3NhdmVNc2cgJiYgKFxuICAgICAgICAgICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJsb2Mtc2F2ZS1tc2dcIlxuICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibWItMyBweC00IHB5LTIuNSByb3VuZGVkLWxnIGJnLWFtYmVyLTkwMC8zMCBib3JkZXIgYm9yZGVyLWFtYmVyLTcwMC81MCB0ZXh0LWFtYmVyLTIwMCB0ZXh0LXhzIGZvbnQtbW9ub1wiPlxuICAgICAgICAgICAgICAgICAgICDimqAgIHtzYXZlTXNnfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBsZzpncmlkLWNvbHMtWzFmcl8zNDBweF0gZ2FwLTQgaC1mdWxsXCIgc3R5bGU9e3ttaW5IZWlnaHQ6JzU2dmgnfX0+XG4gICAgICAgICAgICAgICAgey8qIE1BUCDigJQgZmlsbHMgdGhlIGxlZnQgc2lkZSwgd2l0aCBhIHNlYXJjaCBiYXIgZmxvYXRpbmcgb24gdG9wICovfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmVcIiBzdHlsZT17e21pbkhlaWdodDonNTZ2aCd9fT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiByZWY9e21hcEJveFJlZn1cbiAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBoZWlnaHQ6JzEwMCUnLCBtaW5IZWlnaHQ6JzU2dmgnLCB3aWR0aDonMTAwJScsIGJvcmRlclJhZGl1czonMTJweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6J2hpZGRlbicsIGJvcmRlcjonMXB4IHNvbGlkICMzMzQxNTUnLCBiYWNrZ3JvdW5kOicjMGIxMjIwJyB9fS8+XG5cbiAgICAgICAgICAgICAgICAgICAgey8qIFNlYXJjaCBiYXIgb3ZlcmxheSDigJQgc2l0cyBpbiB0aGUgdG9wLWNlbnRyZSBvZiB0aGUgbWFwICovfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC0zIGxlZnQtMS8yIC10cmFuc2xhdGUteC0xLzIgei1bNTAwXVwiIHN0eWxlPXt7d2lkdGg6J21pbig1NjBweCwgY2FsYygxMDAlIC0gMTEwcHgpKSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17c2VhcmNoUX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRTZWFyY2hRKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Gb2N1cz17KCkgPT4gc2VhcmNoSGl0cy5sZW5ndGggJiYgc2V0U2VhcmNoT3Blbih0cnVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCLwn5SOICBTZWFyY2ggYnkgYWRkcmVzcywgYnVpbGRpbmcsIG9yIHBsYWNlIG5hbWXigKZcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgcHgtNCBweS0yLjUgcm91bmRlZC14bCBiZy1zbGF0ZS05MDAvOTUgYm9yZGVyIGJvcmRlci1zbGF0ZS02MDAgdGV4dC1zbGF0ZS0xMDAgdGV4dC1zbSBwbGFjZWhvbGRlci1zbGF0ZS01MDAgc2hhZG93LTJ4bCBiYWNrZHJvcC1ibHVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tvdXRsaW5lOidub25lJ319Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VhcmNoQnVzeSAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImFic29sdXRlIHJpZ2h0LTMgdG9wLTEvMiAtdHJhbnNsYXRlLXktMS8yIHRleHQtYW1iZXItNDAwIHRleHQteHNcIj7igKY8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VhcmNoT3BlbiAmJiBzZWFyY2hIaXRzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC1mdWxsIGxlZnQtMCByaWdodC0wIG10LTEgYmctc2xhdGUtOTAwLzk3IGJvcmRlciBib3JkZXItc2xhdGUtNzAwIHJvdW5kZWQteGwgc2hhZG93LTJ4bCBvdmVyZmxvdy1oaWRkZW4gbWF4LWgtNzIgb3ZlcmZsb3cteS1hdXRvIGJhY2tkcm9wLWJsdXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWFyY2hIaXRzLm1hcCgoaCwgaSkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PXtoLnBsYWNlX2lkIHx8IGl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBwaWNrU2VhcmNoSGl0KGgpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHRleHQtbGVmdCBweC00IHB5LTIuNSBob3ZlcjpiZy1hbWJlci05MDAvMzAgYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTgwMCBsYXN0OmJvcmRlci1iLTAgdHJhbnNpdGlvbi1hbGxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIHRleHQtc2xhdGUtMjAwIHRydW5jYXRlXCI+e2guZGlzcGxheV9uYW1lfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgbXQtMC41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7aC50eXBlIHx8IGguY2xhc3N9IMK3IHsoK2gubGF0KS50b0ZpeGVkKDMpfSwgeygraC5sb24pLnRvRml4ZWQoMyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlYXJjaE9wZW4gJiYgc2VhcmNoSGl0cy5sZW5ndGggPT09IDAgJiYgc2VhcmNoUS5sZW5ndGggPj0gMyAmJiAhc2VhcmNoQnVzeSAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgdG9wLWZ1bGwgbGVmdC0wIHJpZ2h0LTAgbXQtMSBiZy1zbGF0ZS05MDAvOTcgYm9yZGVyIGJvcmRlci1zbGF0ZS03MDAgcm91bmRlZC14bCBweC00IHB5LTMgdGV4dC14cyB0ZXh0LXNsYXRlLTQwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTm8gcmVzdWx0cyBmb3IgXCJ7c2VhcmNoUX1cIi4gIFRyeSBhIG1vcmUgc3BlY2lmaWMgdGVybS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgIHsvKiBTSURFIFBBTkVMICovfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS00IG92ZXJmbG93LXktYXV0byBwci0xXCI+XG4gICAgICAgICAgICAgICAgICAgIHsvKiBTaXRlIG5hbWUgY29tYm8taW5wdXQuICBGcmVlLWZvcm0gdHlwaW5nIGZvciBmcmVzaFxuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxzOyBhIHZpc2libGUgY2hldnJvbiBidXR0b24gb24gdGhlIHJpZ2h0IG9wZW5zXG4gICAgICAgICAgICAgICAgICAgICAgICBhIGN1c3RvbSBwb3Bkb3duIGxpc3RpbmcgZXZlcnkgc2F2ZWQgbG9jYXRpb24gcHVsbGVkXG4gICAgICAgICAgICAgICAgICAgICAgICBmcm9tIC9hcGkvd2VhdGhlci1sb2NhdGlvbiAoaS5lLiB0aGUgU0FNRSBsaXN0IHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgRGFzaGJvYXJkJ3MgV2VhdGhlciBidXR0b24gc3VyZmFjZXMpLiAgVGhpcyByZXBsYWNlc1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGVhcmxpZXIgbmF0aXZlIDxkYXRhbGlzdD4gd2hpY2ggd2FzIHRvbyBzdWJ0bGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGluIGRhcmsgdGhlbWVzIC0tIG9wZXJhdG9ycyB3aXRoIE4+MCBzYXZlZCBlbnRyaWVzXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VsZCBub3QgdGVsbCBhIGRyb3Bkb3duIGV4aXN0ZWQuICovfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0xLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTaXRlIG5hbWUgKHNhdmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzYXZlZExvY3MubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1sLTIgdGV4dC1hbWJlci00MDAvODAgbm9ybWFsLWNhc2UgdHJhY2tpbmctbm9ybWFsIHRleHQtWzEwcHhdXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJsb2Mtc2F2ZWQtaGludFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg4pa+IHtzYXZlZExvY3MubGVuZ3RofSBzYXZlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZVwiIHJlZj17c2F2ZWRSZWZ9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dCBwci05XCIgdmFsdWU9e2NmZy5zaXRlTmFtZSB8fCAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJsb2Mtc2l0ZS1uYW1lLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3NhdmVkTG9jcy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdQaWNrIGEgc2F2ZWQgbG9jYXRpb24sIG9yIHR5cGUgYSBuZXcgb25l4oCmJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnZS5nLiBIUSBUb3dlciwgTm9ydGggV2luZywgUGF2aWxpb24gQuKApid9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gb25TaXRlTmFtZUNoYW5nZShlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uRm9jdXM9eygpID0+IHNhdmVkTG9jcy5sZW5ndGggPiAwICYmIHNldFNhdmVkT3Blbih0cnVlKX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzYXZlZExvY3MubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJsb2Mtc2F2ZWQtY2hldnJvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0U2F2ZWRPcGVuKHYgPT4gIXYpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJPcGVuIHNhdmVkIGxvY2F0aW9uc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJQaWNrIGZyb20gc2F2ZWQgbG9jYXRpb25zXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSByaWdodC0xIHRvcC0xLzIgLXRyYW5zbGF0ZS15LTEvMiB3LTcgaC03IHJvdW5kZWQtbWQgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgYmctYW1iZXItNzAwLzMwIGhvdmVyOmJnLWFtYmVyLTYwMC81MCBib3JkZXIgYm9yZGVyLWFtYmVyLTUwMC80MCB0ZXh0LWFtYmVyLTIwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjE0XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjIuNFwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIiBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e3RyYW5zZm9ybTogc2F2ZWRPcGVuID8gJ3JvdGF0ZSgxODBkZWcpJyA6ICdub25lJywgdHJhbnNpdGlvbjondHJhbnNmb3JtIC4xNXMnfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlsaW5lIHBvaW50cz1cIjYgOSAxMiAxNSAxOCA5XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NhdmVkT3BlbiAmJiBzYXZlZExvY3MubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJsb2Mtc2F2ZWQtZHJvcGRvd25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIHotWzYwMF0gbGVmdC0wIHJpZ2h0LTAgdG9wLWZ1bGwgbXQtMSBiZy1zbGF0ZS05MDAgYm9yZGVyIGJvcmRlci1zbGF0ZS02MDAgcm91bmRlZC1sZyBzaGFkb3ctMnhsIG1heC1oLTY0IG92ZXJmbG93LXktYXV0b1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3NhdmVkTG9jcy5tYXAobG9jID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0FjdGl2ZSA9IChjZmcuc2l0ZU5hbWUgfHwgJycpLnRyaW0oKSA9PT0gbG9jLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgTWF0aC5hYnMoY2ZnLmxhdCAtIGxvYy5sYXQpIDwgMWUtNFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBNYXRoLmFicyhjZmcubG9uIC0gbG9jLmxvbikgPCAxZS00O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFJvdyBpcyBhIDxkaXYgcm9sZT1cImJ1dHRvblwiPiBpbnN0ZWFkIG9mIDxidXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc28gdGhlIGluLXJvdyB0cmFzaCA8YnV0dG9uPiBpc24ndCBuZXN0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNpZGUgYW5vdGhlciBpbnRlcmFjdGl2ZSBlbGVtZW50LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvd0tleSA9IGAke2xvYy5sYXQudG9GaXhlZCg0KX0sJHtsb2MubG9uLnRvRml4ZWQoNCl9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtyb3dLZXl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9sZT1cImJ1dHRvblwiIHRhYkluZGV4PXswfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFBpY2sgdGhlIHJvdyBvbmx5IHdoZW4gdGhlIG9wZXJhdG9yIGNsaWNrcyB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29vcmQvd2hpdGVzcGFjZSBhcmVhLCBub3QgdGhlIHJlbmFtZSBpbnB1dCBvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgdHJhc2ggYnV0dG9uICh0aG9zZSBzdG9wUHJvcGFnYXRpb24pLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWNrU2F2ZWRMb2MobG9jKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uS2V5RG93bj17KGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnICcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpY2tTYXZlZExvYyhsb2MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17YGxvYy1zYXZlZC1vcHQtJHtsb2MubmFtZX1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YGdyb3VwIGZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHB4LTMgcHktMiBib3JkZXItYiBib3JkZXItc2xhdGUtODAwIGxhc3Q6Ym9yZGVyLWItMCBob3ZlcjpiZy1hbWJlci05MDAvMzAgdHJhbnNpdGlvbi1jb2xvcnMgY3Vyc29yLXBvaW50ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7aXNBY3RpdmUgPyAnYmctYW1iZXItOTAwLzUwJyA6ICcnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTEgbWluLXctMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBJbmxpbmUgcmVuYW1lIGlucHV0IC0tIHR5cGluZyBoZXJlIHVwZGF0ZXMgdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluLW1lbW9yeSBzYXZlZExvY3MgZW50cnk7IGNsaWNraW5nIFNhdmUgJiBSZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVyc2lzdHMgdGhlIHdob2xlIGxpc3QgdG8gbG9jYWxTdG9yYWdlIEFORCB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmVyLiAgc3RvcFByb3BhZ2F0aW9uIGtlZXBzIGEgY2xpY2sgb24gdGhlIGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gdHJpZ2dlcmluZyB0aGUgcm93J3MgcGljayBoYW5kbGVyLiAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17YGxvYy1zYXZlZC1yZW5hbWUtJHtyb3dLZXl9YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2xvYy5uYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHJlbmFtZVNhdmVkTG9jKGxvYywgZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25LZXlEb3duPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRW50ZXIgd2hpbGUgZWRpdGluZyBrZWVwcyB0aGUgZHJvcGRvd25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW4gLS0gZmluYWxpc2luZyByZW5hbWUgaGFwcGVucyBhdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2F2ZSAmIFJldHVybiwgbm90IG9uIEVudGVyLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUua2V5ID09PSAnRW50ZXInKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2BSZW5hbWUgc2F2ZWQgbG9jYXRpb24gJHtsb2MubmFtZX1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYmctdHJhbnNwYXJlbnQgYm9yZGVyLTAgb3V0bGluZS1ub25lIHRleHQtc20gdGV4dC1zbGF0ZS0xMDAgZm9udC1tZWRpdW0gcHgtMCBweS0wXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9jdXM6Ymctc2xhdGUtODAwLzYwIGZvY3VzOnB4LTEgZm9jdXM6cm91bmRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvdmVyOmJnLXNsYXRlLTgwMC80MCBob3ZlcjpweC0xIGhvdmVyOnJvdW5kZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uLWFsbFwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIGZvbnQtbW9ubyBtdC0wLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2xvYy5sYXQudG9GaXhlZCgyKX0sIHtsb2MubG9uLnRvRml4ZWQoMil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBUcmFzaCBidXR0b24gLS0gYWx3YXlzIHJlbmRlcmVkLCBmYWRlZCB1bnRpbCByb3ctaG92ZXIgc28gaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2Vzbid0IGNsdXR0ZXIgdGhlIHJlc3Rpbmcgc3RhdGUuICBzdG9wUHJvcGFnYXRpb24gcHJldmVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgcm93J3MgcGljayBoYW5kbGVyIGZyb20gZmlyaW5nLiAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgbG9jLXNhdmVkLXJlbW92ZS0ke2xvYy5uYW1lfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2BSZW1vdmUgJHtsb2MubmFtZX1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT17YFJlbW92ZSAke2xvYy5uYW1lfSBmcm9tIHNhdmVkIGxvY2F0aW9uc2B9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHJlbW92ZVNhdmVkTG9jKGxvYyk7IH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInNocmluay0wIHctNyBoLTcgcm91bmRlZC1tZCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQtc2xhdGUtNTAwIGhvdmVyOnRleHQtcm9zZS0zMDAgaG92ZXI6Ymctcm9zZS05MDAvMzBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5LTQwIGdyb3VwLWhvdmVyOm9wYWNpdHktMTAwIHRyYW5zaXRpb24tb3BhY2l0eVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIxNFwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyLjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMyA2aDE4XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTggNlY0YTIgMiAwIDAgMSAyLTJoNGEyIDIgMCAwIDEgMiAydjJcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTkgNmwtMS41IDEzLjJhMiAyIDAgMCAxLTIgMS44SDguNWEyIDIgMCAwIDEtMi0xLjhMNSA2XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTEwIDExdjZNMTQgMTF2NlwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTEgaXRhbGljXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NhdmVkTG9jcy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ1BpY2sgYSBwcmV2aW91c2x5LXNhdmVkIGxvY2F0aW9uLCBvciB0eXBlIGEgbmV3IGxhYmVsIGZvciB0aGlzIHBsYWNlLidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnWW91ciBsYWJlbCBmb3IgdGhpcyBwbGFjZSDigJQgc2hvd24gb24gdGhlIGRhc2hib2FyZCBoZWFkZXIuJ31cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBTb2Z0IGR1cGxpY2F0ZS1uYW1lIHdhcm5pbmcgLS0gaWYgdGhlIG9wZXJhdG9yIHR5cGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYSBuYW1lIHRoYXQgYWxyZWFkeSBleGlzdHMgaW4gdGhlIHNhdmVkIGxpc3QgQVRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBESUZGRVJFTlQgQ09PUkRJTkFURVMsIHN1cmZhY2UgdGhhdCBzbyB0aGV5IGRvbid0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2lsZW50bHkgZW5kIHVwIHdpdGggdHdvIFwiSE9NRVwicyBwb2ludGluZyB0byB0d29cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWZmZXJlbnQgYWRkcmVzc2VzICh0aGUgYnVnIG9wZXJhdG9yLXJlcG9ydGVkIG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMjAyNi0wNi0yODogZGFzaGJvYXJkIGhhZCAyw5cgSE9NRSwgU2V0dXAgV2Fsa1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dlZCBvbmx5IDEpLiAgU2FtZSBjb29yZHMgPSBubyB3YXJuaW5nLCBpdCdzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganVzdCByZS1zZWxlY3RpbmcgYSBrbm93biBzaXRlLiAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgIHsoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHR5cGVkID0gKGNmZy5zaXRlTmFtZSB8fCAnJykudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdHlwZWQpIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvdW5kID0gKG4pID0+IChNYXRoLnJvdW5kKG4gKiAxMDAwMCkgLyAxMDAwMCkudG9GaXhlZCg0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXIgPSByb3VuZChjZmcubGF0KSArICcsJyArIHJvdW5kKGNmZy5sb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbmZsaWN0ID0gc2F2ZWRMb2NzLmZpbmQocyA9PiBzLm5hbWUgPT09IHR5cGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgKHJvdW5kKHMubGF0KSArICcsJyArIHJvdW5kKHMubG9uKSkgIT09IGN1cik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjb25mbGljdCkgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cImxvYy1kdXAtbmFtZS13YXJuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtdC0yIHB4LTIuNSBweS0yIHJvdW5kZWQtbWQgYmctYW1iZXItOTUwLzQwIGJvcmRlciBib3JkZXItYW1iZXItNzAwLzUwIHRleHQtWzEwLjVweF0gdGV4dC1hbWJlci0yMDAgbGVhZGluZy1zbnVnXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YiBjbGFzc05hbWU9XCJ0ZXh0LWFtYmVyLTEwMFwiPlNhbWUgbmFtZSBhbHJlYWR5IHNhdmVkPC9iPiBhdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvZGUgY2xhc3NOYW1lPVwibXgtMSBmb250LW1vbm8gdGV4dC1hbWJlci0xMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Y29uZmxpY3QubGF0LnRvRml4ZWQoMil9LCB7Y29uZmxpY3QubG9uLnRvRml4ZWQoMil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2NvZGU+LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2F2aW5nIGtlZXBzIGJvdGg7IHBpY2sgZnJvbSB0aGUgZHJvcGRvd24gYWJvdmUgdG8gc3dpdGNoIHRvIHRoZSBleGlzdGluZyBvbmUgaW5zdGVhZC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKCl9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyLXQgYm9yZGVyLXNsYXRlLTgwMCBwdC0zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlc29sdmVkIGFkZHJlc3MgLyBjaXR5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2dlb0J1c3kgJiYgPHNwYW4gY2xhc3NOYW1lPVwibWwtMiB0ZXh0LWFtYmVyLTQwMCBub3JtYWwtY2FzZSB0cmFja2luZy1ub3JtYWxcIj7igKYgcmVzb2x2aW5nPC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCIgdmFsdWU9e2NmZy5jaXR5fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSk9PnNldENmZyh7Li4uY2ZnLCBjaXR5OmUudGFyZ2V0LnZhbHVlfSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTEuNVwiPnt0KCdzd19sYXRpdHVkZScpfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiIHR5cGU9XCJudW1iZXJcIiBzdGVwPVwiMC4wMDAxXCIgdmFsdWU9e2NmZy5sYXR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSk9PnNldENmZyh7Li4uY2ZnLCBsYXQ6K2UudGFyZ2V0LnZhbHVlfSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTEuNVwiPnt0KCdzd19sb25naXR1ZGUnKX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIiB0eXBlPVwibnVtYmVyXCIgc3RlcD1cIjAuMDAwMVwiIHZhbHVlPXtjZmcubG9ufVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpPT5zZXRDZmcoey4uLmNmZywgbG9uOitlLnRhcmdldC52YWx1ZX0pfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXt1c2VNeUxvY2F0aW9ufVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtnZW9TdGF0ZSA9PT0gJ2J1c3knfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwibG9jLXVzZS1teS1sb2NhdGlvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdy1mdWxsIHB5LTIuNSByb3VuZGVkLWxnIGJvcmRlciB0ZXh0LXhzIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCB0cmFuc2l0aW9uLWNvbG9yc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2dlb1N0YXRlID09PSAnYnVzeSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLWFtYmVyLTkwMC80MCBib3JkZXItYW1iZXItNzAwLzQwIHRleHQtYW1iZXItMjAwIGN1cnNvci13YWl0J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAoZ2VvU3RhdGUgJiYgZ2VvU3RhdGUuZXJyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctcm9zZS05MDAvNDAgYm9yZGVyLXJvc2UtNTAwLzUwIHRleHQtcm9zZS0xMDAgaG92ZXI6Ymctcm9zZS04MDAvNDAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctYW1iZXItNzAwLzcwIGJvcmRlci1hbWJlci01MDAvNDAgdGV4dC1hbWJlci01MCBob3ZlcjpiZy1hbWJlci02MDAvNzAnKX1gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtnZW9TdGF0ZSA9PT0gJ2J1c3knXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAn4o+zICBSZWFkaW5nIGRldmljZSBsb2NhdGlvbuKApidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICfwn5ONICBVc2UgbXkgZGV2aWNlIGxvY2F0aW9uJ31cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIHtnZW9TdGF0ZSAmJiBnZW9TdGF0ZS5lcnIgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cImxvYy1nZW8tZXJyb3JcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCItbXQtMiBweC0zIHB5LTIgcm91bmRlZC1tZCBiZy1yb3NlLTk1MC81MCBib3JkZXIgYm9yZGVyLXJvc2UtNzAwLzQwIHRleHQtWzExcHhdIGxlYWRpbmctc251ZyB0ZXh0LXJvc2UtMjAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGIgY2xhc3NOYW1lPVwidGV4dC1yb3NlLTEwMFwiPkNvdWxkbid0IHJlYWQgbG9jYXRpb24uPC9iPjxici8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1yb3NlLTIwMC85MFwiPntnZW9TdGF0ZS5lcnJ9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBTcGVjaWZpYyBIVFRQLW9yaWdpbiBjYWxsLW91dDogbW9zdCBsaWtlbHkgY2F1c2Ugb24gYSBWMS45IGNvbnRyb2xsZXIuICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cubG9jYXRpb24gJiYgd2luZG93LmxvY2F0aW9uLnByb3RvY29sID09PSAnaHR0cDonICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC0xLjUgdGV4dC1bMTBweF0gdGV4dC1yb3NlLTMwMC84MCBmb250LW1vbm9cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpcDogYnJvd3NlcnMgcmVxdWlyZSBIVFRQUyBmb3IgZ2VvbG9jYXRpb24uICBQaWNrIHRoZSBsb2NhdGlvbiBvbiB0aGUgbWFwIG9yIHNlYXJjaCBiYXIgaW5zdGVhZC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICApfVxuXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyLXQgYm9yZGVyLXNsYXRlLTgwMCBwdC0zIG10LTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMlwiPnt0KCdzd19xdWlja19qdW1wcycpfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC0xLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7W1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J1Rvcm9udG8sIE9OJywgICBsYXQ6NDMuNjUzMiwgbG9uOi03OS4zODMyLCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonTmV3IFlvcmssIE5ZJywgIGxhdDo0MC43MTI4LCBsb246LTc0LjAwNjAsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidMb25kb24sIFVLJywgICAgbGF0OjUxLjUwNzQsIGxvbjogLTAuMTI3OCwgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J1BhcmlzLCBGUicsICAgICBsYXQ6NDguODU2NiwgbG9uOiAgMi4zNTIyLCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonVG9reW8sIEpQJywgICAgIGxhdDozNS42NzYyLCBsb246MTM5LjY1MDMsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidTeWRuZXksIEFVJywgICAgbGF0Oi0zMy44Njg4LGxvbjoxNTEuMjA5MywgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0ubWFwKGogPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGtleT17ai5uYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBsYXQ6ai5sYXQsIGxvbjpqLmxvbiwgY2l0eTpqLm5hbWV9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXBSZWYuY3VycmVudCkgbWFwUmVmLmN1cnJlbnQuc2V0Vmlldyhbai5sYXQsIGoubG9uXSwgai56KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtbGVmdCBweC0yLjUgcHktMS41IHJvdW5kZWQtbWQgYmctc2xhdGUtODAwLzcwIGJvcmRlciBib3JkZXItc2xhdGUtNzAwIHRleHQtWzExcHhdIGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTMwMCBob3ZlcjpiZy1zbGF0ZS03MDAgaG92ZXI6Ym9yZGVyLWFtYmVyLTUwMC80MCB0cmFuc2l0aW9uLWFsbFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2oubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbGVhZGluZy1yZWxheGVkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICBUaWxlczogT3BlblN0cmVldE1hcCDCtyBHZW9jb2RlOiBOb21pbmF0aW0gKGZyZWUsIH4xIHJlcS9zKS5cbiAgICAgICAgICAgICAgICAgICAgICAgIFVzZWQgZm9yIE9wZW4tTWV0ZW8gd2VhdGhlciBmZWVkIGFuZCBzdW5yaXNlL3N1bnNldCBlc3RpbWF0aW9uLlxuICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Nb2RhbFNoZWxsPlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIExhbmd1YWdlIFNldHRpbmcgLS0gbW9kYWxcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIExhbmd1YWdlTW9kYWwoeyBjZmcsIHNldENmZywgb25DbG9zZSwgb25TYXZlIH0pIHtcbiAgICBjb25zdCBsYW5ncyA9IFtcbiAgICAgICAgeyBjb2RlOidlbicsICAgIGxhYmVsOidFbmdsaXNoJywgICAgICAgICAgICAgICAgbmF0aXZlOidFbmdsaXNoJyAgICB9LFxuICAgICAgICB7IGNvZGU6J3poLUNOJywgbGFiZWw6J0NoaW5lc2UgKFNpbXBsaWZpZWQpJywgICBuYXRpdmU6J+eugOS9k+S4reaWhycgICAgfSxcbiAgICAgICAgeyBjb2RlOid6aC1UVycsIGxhYmVsOidDaGluZXNlIChUcmFkaXRpb25hbCknLCAgbmF0aXZlOifnuYHpq5TkuK3mlocnICAgIH0sXG4gICAgICAgIHsgY29kZTonamEnLCAgICBsYWJlbDonSmFwYW5lc2UnLCAgICAgICAgICAgICAgIG5hdGl2ZTon5pel5pys6KqeJyAgICAgIH0sXG4gICAgICAgIHsgY29kZTona28nLCAgICBsYWJlbDonS29yZWFuJywgICAgICAgICAgICAgICAgIG5hdGl2ZTon7ZWc6rWt7Ja0JyAgICAgIH0sXG4gICAgXTtcblxuICAgIC8qIE9uIFNhdmUgJiByZXR1cm46IHdyaXRlIHRoZSBwaWNrZWQgbGFuZ3VhZ2UgY29kZSB0byB0aGUgc2FtZVxuICAgICAqIGxvY2FsU3RvcmFnZSBrZXkgdGhlIGRhc2hib2FyZCdzIGkxOG4uanMgcmVhZHMgKGBpMThuX2xhbmdgKSwgYW5kXG4gICAgICogZGlzcGF0Y2ggdGhlIGBsYW5nY2hhbmdlYCBldmVudCBzbyBhbnkgb3BlbiBkYXNoYm9hcmQvY29uZmlnIHRhYlxuICAgICAqIHBpY2tzIGl0IHVwIGxpdmUuICBUaGlzIGlzIHdoYXQgbWFrZXMgdGhlIHNldHVwIHdhbGsncyBsYW5ndWFnZVxuICAgICAqIGNob2ljZSBhY3R1YWxseSBkcml2ZSB0aGUgZGFzaGJvYXJkIC8gY29uZmlnIC8gbWFwcGVyIFVJIC0tIHRoZVxuICAgICAqIHNpZGViYXIgc2VsZWN0b3IgdGhhdCB1c2VkIHRvIGxpdmUgaW4gdGhlIGRhc2hib2FyZCBoZWFkZXIgaGFzXG4gICAgICogYmVlbiByZW1vdmVkICgyMDI2LTA2LTI2KSBhbmQgdGhlIHNldHVwIHdhbGsgaXMgbm93IHRoZSBzaW5nbGVcbiAgICAgKiBzb3VyY2Ugb2YgdHJ1dGggZm9yIFVJIGxhbmd1YWdlLiAqL1xuICAgIGNvbnN0IHBlcnNpc3RBbmRTYXZlID0gKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2kxOG5fbGFuZycsIGNmZy5sYW5nKTtcbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnbGFuZ2NoYW5nZScpKTtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnW3NldHVwIHdhbGtdIGkxOG5fbGFuZyA8LScsIGNmZy5sYW5nKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdbc2V0dXAgd2Fsa10gY291bGQgbm90IHBlcnNpc3QgbGFuZ3VhZ2U6JywgZSk7XG4gICAgICAgIH1cbiAgICAgICAgb25TYXZlKCk7XG4gICAgfTtcbiAgICByZXR1cm4gKFxuICAgICAgICA8TW9kYWxTaGVsbCB0aXRsZT17dCgnc3dfbGFuZ3VhZ2Vfc2V0dGluZycpfSBzdWJ0aXRsZT17dCgnc3dfbGFuZ3VhZ2Vfc3ViJyl9IGFjY2VudD1cImVtZXJhbGRcIiBvbkNsb3NlPXtvbkNsb3NlfSBvblNhdmU9e3BlcnNpc3RBbmRTYXZlfT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtM1wiPlxuICAgICAgICAgICAgICAgIHtsYW5ncy5tYXAobCA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PXtsLmNvZGV9IG9uQ2xpY2s9eygpPT5zZXRDZmcoey4uLmNmZywgbGFuZzpsLmNvZGV9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B0ZXh0LWxlZnQgcC0zIHJvdW5kZWQteGwgYm9yZGVyLTIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjZmcubGFuZyA9PT0gbC5jb2RlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdib3JkZXItZW1lcmFsZC01MDAgYmctZW1lcmFsZC05MDAvMjAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdib3JkZXItc2xhdGUtNzAwIGJnLXNsYXRlLTgwMC80MCBob3ZlcjpiZy1zbGF0ZS04MDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS01MDBcIj57bC5jb2RlfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS0yMDBcIj57bC5uYXRpdmV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzExcHhdIHRleHQtc2xhdGUtNTAwXCI+e2wubGFiZWx9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvTW9kYWxTaGVsbD5cbiAgICApO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBQbHVnLWluIFNldHRpbmcgLS0gbW9kYWwgdy8gbGlzdCArIHVwbG9hZCB6b25lXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4vKiBQZXItcGx1Zy1pbiBtb2NrIGNvbmZpZ3VyYXRpb24gZmllbGRzLiAgS2V5cyBtYXAgdG8gcGx1Zy1pbiBgaWRgLiAqL1xuY29uc3QgUExVR0lOX0NPTkZJR19GSUVMRFMgPSB7XG4gICAgd2VhdGhlcjogICAgW1xuICAgICAgICB7IGtleToncHJvdmlkZXInLCAgbGFiZWw6J1Byb3ZpZGVyJywgICAgICAgICAgdHlwZTonc2VsZWN0JywgIG9wdGlvbnM6WydPcGVuLU1ldGVvJywnTldTJywnRUNNV0YnXSwgZGVmOidPcGVuLU1ldGVvJyB9LFxuICAgICAgICB7IGtleToncmVmcmVzaCcsICAgbGFiZWw6J1JlZnJlc2ggaW50ZXJ2YWwnLCAgdHlwZTonc2VsZWN0JywgIG9wdGlvbnM6WycxIG1pbicsJzUgbWluJywnMTUgbWluJywnMzAgbWluJywnMSBoJ10sIGRlZjonMTUgbWluJyB9LFxuICAgICAgICB7IGtleTonY2FjaGUnLCAgICAgbGFiZWw6J0NhY2hlIFRUTCAobWluKScsICAgdHlwZTonbnVtYmVyJywgIGRlZjozMCB9LFxuICAgIF0sXG4gICAgZ2l2b25pOiAgICAgW1xuICAgICAgICB7IGtleTonY2xpbWF0ZScsICAgbGFiZWw6J0NsaW1hdGUgbW9kZWwnLCAgICAgdHlwZTonc2VsZWN0JywgIG9wdGlvbnM6WydHaXZvbmkgMTk5MicsJ0FTSFJBRSA1NScsJ0FkYXB0aXZlJ10sIGRlZjonR2l2b25pIDE5OTInIH0sXG4gICAgICAgIHsga2V5OidtYXNzaXZlJywgICBsYWJlbDonSGVhdnl3ZWlnaHQgY29uc3RydWN0aW9uJywgIHR5cGU6J3RvZ2dsZScsIGRlZjpmYWxzZSB9LFxuICAgIF0sXG4gICAgc3dlZXRfc3BvdDogW1xuICAgICAgICB7IGtleTondHJhY2tpbmcnLCAgbGFiZWw6J1RyYWNrIG91dGRvb3IgUkgnLCAgdHlwZTondG9nZ2xlJywgZGVmOnRydWUgfSxcbiAgICAgICAgeyBrZXk6J2h5c3QnLCAgICAgIGxhYmVsOidIeXN0ZXJlc2lzICglIFJIKScsIHR5cGU6J251bWJlcicsIGRlZjoyIH0sXG4gICAgXSxcbiAgICBnMzY6ICAgICAgICBbXG4gICAgICAgIHsga2V5Oidtb2RlJywgICAgICBsYWJlbDonU2VxdWVuY2UgbW9kZScsICAgICB0eXBlOidzZWxlY3QnLCAgb3B0aW9uczpbJ1NpbmdsZS16b25lIFZBVicsJ011bHRpLXpvbmUgVkFWJywnRE9BUyB3LyBGQ1UnXSwgZGVmOidNdWx0aS16b25lIFZBVicgfSxcbiAgICAgICAgeyBrZXk6J3ZlcmJvc2UnLCAgIGxhYmVsOidWZXJib3NlIGxvZ2dpbmcnLCAgIHR5cGU6J3RvZ2dsZScsIGRlZjpmYWxzZSB9LFxuICAgIF0sXG4gICAgZGlidDogICAgICAgW1xuICAgICAgICB7IGtleTonaG9zdCcsICAgICAgbGFiZWw6J0JyaWRnZSBob3N0JywgICAgICAgdHlwZTondGV4dCcsICAgZGVmOicxOTIuMTY4LjEuMTAwJyB9LFxuICAgICAgICB7IGtleToncG9ydCcsICAgICAgbGFiZWw6J1RlbGVncmFtIHBvcnQnLCAgICAgdHlwZTonbnVtYmVyJywgZGVmOjQ3ODA4IH0sXG4gICAgICAgIHsga2V5Oidwb2xsX21zJywgICBsYWJlbDonUG9sbCBpbnRlcnZhbCAobXMpJyx0eXBlOidudW1iZXInLCBkZWY6MjAwMCB9LFxuICAgIF0sXG4gICAgbGlnaHRpbmc6ICAgW1xuICAgICAgICB7IGtleTonZ2F0ZXdheScsICAgbGFiZWw6J01vZGJ1cyBnYXRld2F5IElQJywgdHlwZTondGV4dCcsICAgZGVmOicxMC4wLjAuNTAnIH0sXG4gICAgICAgIHsga2V5Oid1bml0X2lkJywgICBsYWJlbDonVW5pdCBJRCcsICAgICAgICAgICB0eXBlOidudW1iZXInLCBkZWY6MSB9LFxuICAgICAgICB7IGtleTondGNwX3BvcnQnLCAgbGFiZWw6J1RDUCBwb3J0JywgICAgICAgICAgdHlwZTonbnVtYmVyJywgZGVmOjUwMiB9LFxuICAgIF0sXG59O1xuXG5mdW5jdGlvbiBQbHVnaW5zTW9kYWwoeyBjZmcsIHNldENmZywgb25DbG9zZSwgb25TYXZlIH0pIHtcbiAgICBjb25zdCBBTEwgPSBbXG4gICAgICAgIHsgaWQ6J3dlYXRoZXInLCAgICAgbmFtZTonV2VhdGhlcicsICAgICAgICAgZGVzYzonT3Blbi1NZXRlbyBPQSBmZWVkJywgICAgICAgICAgdmVyOicyLjEuMCcgfSxcbiAgICAgICAgeyBpZDonZ2l2b25pJywgICAgICBuYW1lOidHaXZvbmkgRW5naW5lJywgICBkZXNjOidDbGltYXRlLXN0cmF0ZWd5IG92ZXJsYXknLCAgICB2ZXI6JzEuMy40JyB9LFxuICAgICAgICB7IGlkOidzd2VldF9zcG90JywgIG5hbWU6J1N3ZWV0LVNwb3QgUkgnLCAgIGRlc2M6J0FkanVzdGFibGUgUkggYmFuZCcsICAgICAgICAgIHZlcjonMS4wLjEnIH0sXG4gICAgICAgIHsgaWQ6J2czNicsICAgICAgICAgbmFtZTonRzM2IFNlcXVlbmNlcycsICAgZGVzYzonQVNIUkFFIEd1aWRlbGluZSAzNicsICAgICAgICAgdmVyOicwLjkuMicgfSxcbiAgICAgICAgeyBpZDonZGlidCcsICAgICAgICBuYW1lOidESUJUIEJyaWRnZScsICAgICBkZXNjOidEZWx0YSBDb250cm9scyAoRElCVCkgQkFDbmV0IGJyaWRnZScsICAgICAgICAgICB2ZXI6JzAuNC4wJyB9LFxuICAgICAgICB7IGlkOidsaWdodGluZycsICAgIG5hbWU6J0xpZ2h0aW5nIChSZWQ1KScsIGRlc2M6J1YzLjAgTW9kYnVzIFRDUCBjbGllbnQnLCAgICAgIHZlcjonMC4xLjAtYmV0YScgfSxcbiAgICBdO1xuICAgIGNvbnN0IHRvZ2dsZSA9IChpZCkgPT4gc2V0Q2ZnKGMgPT4gKHtcbiAgICAgICAgLi4uYyxcbiAgICAgICAgZW5hYmxlZDogYy5lbmFibGVkLmluY2x1ZGVzKGlkKSA/IGMuZW5hYmxlZC5maWx0ZXIoeCA9PiB4ICE9PSBpZCkgOiBbLi4uYy5lbmFibGVkLCBpZF1cbiAgICB9KSk7XG5cbiAgICAvKiBleHBhbnNpb24gc3RhdGUg4oCUIHdoaWNoIHBsdWctaW4ncyBcIkNvbmZpZ3VyZVwiIHBhbmVsIGlzIG9wZW4gKi9cbiAgICBjb25zdCBbZXhwYW5kZWRJZCwgc2V0RXhwYW5kZWRJZF0gPSBSZWFjdC51c2VTdGF0ZShudWxsKTtcblxuICAgIGNvbnN0IHVwZGF0ZUZpZWxkID0gKHBsdWdpbklkLCBmaWVsZEtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgc2V0Q2ZnKGMgPT4gKHtcbiAgICAgICAgICAgIC4uLmMsXG4gICAgICAgICAgICBmaWVsZHM6IHsgLi4uKGMuZmllbGRzIHx8IHt9KSwgW3BsdWdpbklkXTogeyAuLi4oKGMuZmllbGRzIHx8IHt9KVtwbHVnaW5JZF0gfHwge30pLCBbZmllbGRLZXldOiB2YWx1ZSB9IH1cbiAgICAgICAgfSkpO1xuICAgIH07XG5cbiAgICBjb25zdCBmaWVsZFZhbCA9IChwbHVnaW5JZCwgZmllbGQpID0+IHtcbiAgICAgICAgY29uc3Qgc3RvcmVkID0gY2ZnLmZpZWxkcyAmJiBjZmcuZmllbGRzW3BsdWdpbklkXSAmJiBjZmcuZmllbGRzW3BsdWdpbklkXVtmaWVsZC5rZXldO1xuICAgICAgICByZXR1cm4gc3RvcmVkICE9PSB1bmRlZmluZWQgPyBzdG9yZWQgOiBmaWVsZC5kZWY7XG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxNb2RhbFNoZWxsIHRpdGxlPXt0KCdzd19wbHVnaW5fc2V0dGluZycpfSBzdWJ0aXRsZT17dCgnc3dfcGx1Z2luX3N1YicpfSBhY2NlbnQ9XCJwaW5rXCIgb25DbG9zZT17b25DbG9zZX0gb25TYXZlPXtvblNhdmV9IHNpemU9XCJ3aWRlXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMyBtYXgtaC1bNjB2aF0gb3ZlcmZsb3cteS1hdXRvIHByLTFcIj5cbiAgICAgICAgICAgICAgICB7QUxMLm1hcChwID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb24gPSBjZmcuZW5hYmxlZC5pbmNsdWRlcyhwLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhwYW5kZWQgPSBleHBhbmRlZElkID09PSBwLmlkO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWVsZHMgPSBQTFVHSU5fQ09ORklHX0ZJRUxEU1twLmlkXSB8fCBbXTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtwLmlkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2Byb3VuZGVkLXhsIGJvcmRlciB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke29uID8gJ2JvcmRlci1waW5rLTUwMC80MCBiZy1waW5rLTkwMC8xMCcgOiAnYm9yZGVyLXNsYXRlLTcwMCBiZy1zbGF0ZS04MDAvNDAnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2V4cGFuZGVkID8gJ3JpbmctMSByaW5nLXBpbmstNTAwLzMwJyA6ICcnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHAtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS0xMDBcIj57cC5uYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1sLTIgdGV4dC1bMTBweF0gZm9udC1tb25vIHRleHQtc2xhdGUtNTAwXCI+dntwLnZlcn08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXNsYXRlLTQwMFwiPntwLmRlc2N9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHRvZ2dsZShwLmlkKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BwbHVnaW4tdG9nZ2xlLSR7cC5pZH1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweC0zIHB5LTEgcm91bmRlZC1tZCB0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgYm9yZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke29uID8gJ2JvcmRlci1waW5rLTUwMC82MCB0ZXh0LXBpbmstMzAwIGJnLXBpbmstOTAwLzMwJyA6ICdib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtNDAwIGJnLXNsYXRlLTgwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge29uID8gdCgnc3dfZW5hYmxlZCcpIDogdCgnc3dfZGlzYWJsZWQnKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBzZXRFeHBhbmRlZElkKGV4cGFuZGVkID8gbnVsbCA6IHAuaWQpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17YHBsdWdpbi1jb25maWctJHtwLmlkfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTMgcHktMSByb3VuZGVkLW1kIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayBib3JkZXIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7ZXhwYW5kZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdib3JkZXItcGluay01MDAgYmctcGluay05MDAvMzAgdGV4dC1waW5rLTIwMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtNDAwIGJnLXNsYXRlLTgwMCBob3ZlcjpiZy1zbGF0ZS03MDAgaG92ZXI6Ym9yZGVyLXBpbmstNTAwLzUwIGhvdmVyOnRleHQtcGluay0zMDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtleHBhbmRlZCA/IHQoJ3N3X2Nsb3NlX3VwJykgOiB0KCdzd19jb25maWd1cmVfZGQnKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZXhwYW5kZWQgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB4LTQgcGItNCBib3JkZXItdCBib3JkZXItcGluay01MDAvMjAgYmctc2xhdGUtOTUwLzQwXCIgZGF0YS10ZXN0aWQ9e2BwbHVnaW4tY29uZmlnLXBhbmVsLSR7cC5pZH1gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmaWVsZHMubGVuZ3RoID09PSAwID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS01MDAgaXRhbGljIHB5LTNcIj5ObyBjb25maWd1cmFibGUgb3B0aW9ucyBmb3IgdGhpcyBwbHVnLWluIHlldC48L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBtZDpncmlkLWNvbHMtMiBnYXAtMyBwdC0zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmaWVsZHMubWFwKGYgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdiA9IGZpZWxkVmFsKHAuaWQsIGYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17Zi5rZXl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJvbGQgdGV4dC1zbGF0ZS01MDAgYmxvY2sgbWItMVwiPntmLmxhYmVsfTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmLnR5cGUgPT09ICdzZWxlY3QnICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXQgY3Vyc29yLXBvaW50ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGVGaWVsZChwLmlkLCBmLmtleSwgZS50YXJnZXQudmFsdWUpfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi5vcHRpb25zLm1hcChvID0+IDxvcHRpb24ga2V5PXtvfSB2YWx1ZT17b30+e299PC9vcHRpb24+KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi50eXBlID09PSAnbnVtYmVyJyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cIm51bWJlclwiIGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZUZpZWxkKHAuaWQsIGYua2V5LCArZS50YXJnZXQudmFsdWUpfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmLnR5cGUgPT09ICd0ZXh0JyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3Z9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGVGaWVsZChwLmlkLCBmLmtleSwgZS50YXJnZXQudmFsdWUpfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmLnR5cGUgPT09ICd0b2dnbGUnICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gdXBkYXRlRmllbGQocC5pZCwgZi5rZXksICF2KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdy1mdWxsIHB5LTIgcm91bmRlZC1sZyB0ZXh0LXhzIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBib3JkZXIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7dlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLXBpbmstNzAwLzQwIGJvcmRlci1waW5rLTUwMC82MCB0ZXh0LXBpbmstMjAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLXNsYXRlLTgwMCBib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtNDAwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7diA/ICdPTicgOiAnT0ZGJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWVuZCBnYXAtMiBtdC00IHB0LTMgYm9yZGVyLXQgYm9yZGVyLXNsYXRlLTgwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlc2V0IHRoaXMgcGx1Zy1pbidzIGZpZWxkcyB0byBkZWZhdWx0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldENmZyhjID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV4dCA9IHsgLi4uKGMuZmllbGRzIHx8IHt9KSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgbmV4dFtwLmlkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgLi4uYywgZmllbGRzOiBuZXh0IH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtMyBweS0xLjUgcm91bmRlZC1tZCB0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgYm9yZGVyIGJvcmRlci1zbGF0ZS02MDAgdGV4dC1zbGF0ZS00MDAgaG92ZXI6Ymctc2xhdGUtODAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0KCdzd19yZXNldF9kZWZhdWx0cycpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gc2V0RXhwYW5kZWRJZChudWxsKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTMgcHktMS41IHJvdW5kZWQtbWQgdGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIGJnLXBpbmstNjAwIGhvdmVyOmJnLXBpbmstNTAwIHRleHQtd2hpdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3QoJ3N3X2RvbmUnKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC01IHAtNCBib3JkZXItMiBib3JkZXItZGFzaGVkIGJvcmRlci1zbGF0ZS03MDAgcm91bmRlZC14bCB0ZXh0LWNlbnRlciBob3Zlcjpib3JkZXItcGluay01MDAvNDAgdHJhbnNpdGlvbi1hbGwgY3Vyc29yLXBvaW50ZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtM3hsIG1iLTFcIj7ipLQ8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1ibGFjayB0ZXh0LXNsYXRlLTMwMFwiPkRyb3AgYSAucHkgLyAuemlwIC8gLnJlZDUgcGx1Zy1pbiBoZXJlPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMXB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0xXCI+b3IgY2xpY2sgdG8gY2hvb3NlIGEgZmlsZSAobW9jayDigJQgbm90IHdpcmVkKTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvTW9kYWxTaGVsbD5cbiAgICApO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBNb2RhbCBTaGVsbCAtLSBzaGFyZWRcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIE1vZGFsU2hlbGwoeyB0aXRsZSwgc3VidGl0bGUsIGFjY2VudD0naW5kaWdvJywgb25DbG9zZSwgb25TYXZlLCBzaXplPScnLCBjaGlsZHJlbiB9KSB7XG4gICAgY29uc3QgY29sb3JNYXAgPSB7XG4gICAgICAgIGluZGlnbzonIzgxOGNmOCcsIGFtYmVyOicjZmJiZjI0JywgZW1lcmFsZDonIzM0ZDM5OScsIHBpbms6JyNmNDcyYjYnXG4gICAgfTtcbiAgICBjb25zdCBjID0gY29sb3JNYXBbYWNjZW50XSB8fCAnIzgxOGNmOCc7XG4gICAgY29uc3Qgc2l6ZU1hcCA9IHtcbiAgICAgICAgd2lkZTogJ21heC13LTJ4bCcsXG4gICAgICAgIG1hcDogICdtYXgtdy0zeGwnLFxuICAgICAgICBtYXg6ICAnbWF4LXctWzk2dnddIHctWzk2dnddIGgtWzkydmhdJyxcbiAgICB9O1xuICAgIGNvbnN0IHdpZHRoID0gc2l6ZU1hcFtzaXplXSB8fCAnbWF4LXctbWQnO1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZml4ZWQgaW5zZXQtMCB6LTUwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIG1vZGFsLWJhY2tkcm9wXCIgb25DbGljaz17b25DbG9zZX0+XG4gICAgICAgICAgICB7LyogRmxleC1jb2x1bW4gc2hlbGw6IGhlYWRlciAoZml4ZWQpICsgc2Nyb2xsYWJsZSBjb250ZW50ICsgc3RpY2t5IGZvb3Rlci5cbiAgICAgICAgICAgICAgICBDcml0aWNhbCBmb3Igc2l6ZT1cIm1heFwiIHdoZXJlIGNoaWxkcmVuIGFsb25lIGV4Y2VlZCB0aGUgbW9kYWwgaGVpZ2h0XG4gICAgICAgICAgICAgICAgYW5kIHdvdWxkIG90aGVyd2lzZSBwdXNoIHRoZSBTYXZlICYgcmV0dXJuIGJ1dHRvbiBiZWxvdyB0aGUgdmlld3BvcnQuICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BiZy1zbGF0ZS05MDAgYm9yZGVyLTIgcm91bmRlZC0yeGwgdy1mdWxsICR7d2lkdGh9IG14LTQgZmFkZS11cCBmbGV4IGZsZXgtY29sYH1cbiAgICAgICAgICAgICAgICAgb25DbGljaz17KGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCl9XG4gICAgICAgICAgICAgICAgIHN0eWxlPXt7Ym9yZGVyQ29sb3I6YCR7Y302NmAsIG1heEhlaWdodDogJzkydmgnfX0+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLXN0YXJ0IGp1c3RpZnktYmV0d2VlbiBwLTYgcGItNCBib3JkZXItYiBib3JkZXItc2xhdGUtODAwLzYwIHNocmluay0wXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1sZyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3RcIiBzdHlsZT17e2NvbG9yOmN9fT57dGl0bGV9PC9oMz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS01MDAgbXQtMVwiPntzdWJ0aXRsZX08L3A+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwibW9kYWwtY2xvc2VcIiBvbkNsaWNrPXtvbkNsb3NlfSBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCBob3Zlcjp0ZXh0LXdoaXRlIHRleHQtMnhsIGxlYWRpbmctbm9uZVwiPsOXPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTEgbWluLWgtMCBvdmVyZmxvdy15LWF1dG8gcHgtNiBweS01XCI+XG4gICAgICAgICAgICAgICAgICAgIHtjaGlsZHJlbn1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktZW5kIGdhcC0zIHB4LTYgcHktNCBib3JkZXItdCBib3JkZXItc2xhdGUtODAwIHNocmluay0wIGJnLXNsYXRlLTkwMCByb3VuZGVkLWItMnhsXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJtb2RhbC1jYW5jZWxcIiBvbkNsaWNrPXtvbkNsb3NlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTQgcHktMiByb3VuZGVkLWxnIGJnLXNsYXRlLTgwMCBib3JkZXIgYm9yZGVyLXNsYXRlLTcwMCB0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayB0ZXh0LXNsYXRlLTQwMCBob3ZlcjpiZy1zbGF0ZS03MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0KCdjYW5jZWwnKX1cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJtb2RhbC1zYXZlXCIgb25DbGljaz17b25TYXZlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTUgcHktMiByb3VuZGVkLWxnIHRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIHRleHQtd2hpdGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7YmFja2dyb3VuZDpjLCBib3hTaGFkb3c6YDAgMCAxMnB4ICR7Y301NWB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0KCdzd19zYXZlX3JldHVybicpfVxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG4vKiBtb3VudCAqL1xuUmVhY3RET00uY3JlYXRlUm9vdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpKS5yZW5kZXIoPEFwcC8+KTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUFBLE1BQUEsR0FBOEJDLEtBQUs7RUFBM0JDLFFBQVEsR0FBQUYsTUFBQSxDQUFSRSxRQUFRO0VBQUVDLE9BQU8sR0FBQUgsTUFBQSxDQUFQRyxPQUFPOztBQUV6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTUMsQ0FBQyxHQUFJQyxDQUFDLElBQU0sT0FBT0MsTUFBTSxLQUFLLFdBQVcsSUFBSUEsTUFBTSxDQUFDRixDQUFDLEdBQUdFLE1BQU0sQ0FBQ0YsQ0FBQyxDQUFDQyxDQUFDLENBQUMsR0FBR0EsQ0FBRTtBQUM5RSxJQUFNRSxPQUFPLEdBQUdBLENBQUEsS0FBTyxPQUFPRCxNQUFNLEtBQUssV0FBVyxJQUFJQSxNQUFNLENBQUNDLE9BQU8sR0FBR0QsTUFBTSxDQUFDQyxPQUFPLENBQUMsQ0FBQyxHQUFHLElBQUs7O0FBRWpHO0FBQ0E7QUFDQTtBQUNBLElBQU1DLEtBQUssR0FBRztBQUNWO0FBQ0o7QUFDQTtBQUNB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