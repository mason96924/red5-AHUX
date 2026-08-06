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
/* Wrapped in an IIFE so top-level declarations stay function-scoped and do
   NOT leak onto `window`.  This bundle is loaded as a CLASSIC <script>, where
   a top-level `var foo` (what Babel compiles `const foo` down to) would become
   `window.foo`.  Without this wrapper, the local `t`/`useLang` helpers below
   overwrite the real `window.t`/`window.useLang` from js/i18n.js and then call
   themselves → "Maximum call stack size exceeded" (blank screen). */
(function () {
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
            hi: cfg.rhHi,
            preset: cfg.rhPreset || 'custom',
            applyToAllAhus: true
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
})();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBfd2Fsay5jb21waWxlZC5qcyIsIm5hbWVzIjpbIl9SZWFjdCIsIlJlYWN0IiwidXNlU3RhdGUiLCJ1c2VNZW1vIiwidCIsImsiLCJ3aW5kb3ciLCJ1c2VMYW5nIiwiU1RFUFMiLCJrZXkiLCJsYWJlbEtleSIsInN1YktleSIsImtpbmQiLCJpY29uQ29sb3IiLCJhY2NlbnQiLCJocmVmIiwiQXBwIiwiX3VzZVN0YXRlIiwicHN5IiwibG9jYXRpb24iLCJsYW5ndWFnZSIsInBsdWdpbnMiLCJyZXBhaXIiLCJfdXNlU3RhdGUyIiwiX3NsaWNlZFRvQXJyYXkiLCJkb25lIiwic2V0RG9uZSIsIl91c2VTdGF0ZTMiLCJfdXNlU3RhdGU0Iiwicm91dGUiLCJzZXRSb3V0ZSIsIl91c2VTdGF0ZTUiLCJfdXNlU3RhdGU2IiwibW9kYWwiLCJzZXRNb2RhbCIsIl91c2VTdGF0ZTciLCJnaXZvbmkiLCJyaFByZXNldCIsInJoTG8iLCJyaEhpIiwidExvIiwidEhpIiwidGhlbWUiLCJkYXJrTGV2ZWwiLCJfdXNlU3RhdGU4IiwicHN5Q2ZnIiwic2V0UHN5Q2ZnIiwiX3VzZVN0YXRlOSIsInNpdGVOYW1lIiwiY2l0eSIsImxhdCIsImxvbiIsIl91c2VTdGF0ZTAiLCJsb2NDZmciLCJzZXRMb2NDZmciLCJfdXNlU3RhdGUxIiwidiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJhbGxvd2VkIiwiaW5kZXhPZiIsImxhbmciLCJlIiwiX3VzZVN0YXRlMTAiLCJsYW5nQ2ZnIiwic2V0TGFuZ0NmZyIsIl91c2VTdGF0ZTExIiwiZW5hYmxlZCIsIl91c2VTdGF0ZTEyIiwicGx1Z2luQ2ZnIiwic2V0UGx1Z2luQ2ZnIiwiY29tcGxldGVDb3VudCIsIk9iamVjdCIsInZhbHVlcyIsImZpbHRlciIsIkJvb2xlYW4iLCJsZW5ndGgiLCJmaW5pc2giLCJkIiwiX29iamVjdFNwcmVhZCIsImNyZWF0ZUVsZW1lbnQiLCJQc3lDaGFydFNldHRpbmdQYWdlIiwiY2ZnIiwic2V0Q2ZnIiwib25CYWNrIiwib25TYXZlIiwiY2xhc3NOYW1lIiwib25DbGljayIsInNldEl0ZW0iLCJzdHlsZSIsIndpZHRoIiwiYXNwZWN0UmF0aW8iLCJhbmltYXRpb25EZWxheSIsInNyYyIsImFsdCIsIm9wYWNpdHkiLCJiYWNrZ3JvdW5kIiwibWFwIiwicyIsImkiLCJhbmdsZURlZyIsImFuZ2xlIiwiTWF0aCIsIlBJIiwiciIsIngiLCJjb3MiLCJ5Iiwic2luIiwiQ2lyY2xlVGlsZSIsInN0ZXAiLCJpbmRleCIsImxlZnRQY3QiLCJ0b3BQY3QiLCJ2aWV3Qm94IiwicHJlc2VydmVBc3BlY3RSYXRpbyIsImlkIiwibWFza1VuaXRzIiwiaGVpZ2h0IiwiZmlsbCIsIl8iLCJhIiwiY3giLCJjeSIsInN0cm9rZSIsInN0cm9rZVdpZHRoIiwibWFzayIsImNvbmNhdCIsInRleHRTaGFkb3ciLCJMb2NhdGlvbk1vZGFsIiwib25DbG9zZSIsIkxhbmd1YWdlTW9kYWwiLCJQbHVnaW5zTW9kYWwiLCJUaWxlIiwiX3JlZiIsImJvcmRlciIsIlRpbGVJY29uIiwiY29sb3IiLCJfcmVmMiIsInJpbmdDb2xvciIsImxlZnQiLCJ0b3AiLCJ0cmFuc2Zvcm0iLCJib3hTaGFkb3ciLCJzaXplIiwiX3JlZjMiLCJfcmVmMyRzaXplIiwic3Ryb2tlTGluZWNhcCIsInN0cm9rZUxpbmVqb2luIiwiX2V4dGVuZHMiLCJfcmVmNCIsInVwZGF0ZSIsImMiLCJ1c2VFZmZlY3QiLCJyYXciLCJwcmVzZXQiLCJwYXRjaCIsInAiLCJKU09OIiwicGFyc2UiLCJOdW1iZXIiLCJpc0Zpbml0ZSIsImxvIiwiaGkiLCJSSF9QUkVTRVRTIiwiZmluZCIsInRoIiwiZGwiLCJwYXJzZUZsb2F0IiwidHJSYXciLCJ0ciIsIm1pbiIsIm1heCIsImtleXMiLCJwZXJzaXN0QW5kU2F2ZSIsInN0cmluZ2lmeSIsIlN0cmluZyIsImRpc3BhdGNoRXZlbnQiLCJDdXN0b21FdmVudCIsImRldGFpbCIsImFwcGx5VG9BbGxBaHVzIiwiY29uc29sZSIsImluZm8iLCJ3YXJuIiwiUHN5U2tlbGV0b24iLCJQc3lDb250cm9sUGFuZWwiLCJsYWJlbCIsIm5vdGUiLCJfcmVmNSIsIlciLCJIIiwicGFkIiwicmlnaHQiLCJib3R0b20iLCJncmlkVyIsImdyaWRIIiwiVF9NSU4iLCJUX01BWCIsIldfTUlOIiwiV19NQVgiLCJ3IiwiX2dldFciLCJnZXRXIiwicmgiLCJzYWZlUHRzIiwiYXJyIiwidG9GaXhlZCIsImpvaW4iLCJyaDgwIiwicHVzaCIsInJoMTAwIiwicmgyMExpbmUiLCJyaDIwX0NaIiwiQ1oiLCJyaEhpX3RvcCIsInR0IiwicmhMb19ib3QiLCJTV0VFVCIsIk5WIiwiTWFzcyIsIk1DViIsIkVWQVAiLCJ3aW50ZXJSSDgwIiwid2ludGVyUkgyMCIsIldJTlRFUiIsImlzb3BsZXRocyIsImlzTGlnaHQiLCJwYWxldHRlIiwiYmciLCJncmlkIiwidGljayIsImF4aXMiLCJwYW5lbEJnIiwicGFuZWxCb3JkZXIiLCJwaWxsQmciLCJwaWxsRmciLCJtZXRhRmciLCJkaW1GaWx0ZXIiLCJib3JkZXJDb2xvciIsImJvcmRlclJhZGl1cyIsIkFycmF5IiwiZnJvbSIsIngxIiwieTEiLCJ4MiIsInkyIiwiZm9udFNpemUiLCJ0ZXh0QW5jaG9yIiwicHRzIiwid3ciLCJwb2ludHMiLCJzdHJva2VEYXNoYXJyYXkiLCJmbG9vciIsImZvbnRXZWlnaHQiLCJmaWxsT3BhY2l0eSIsImNsaXBQYXRoVW5pdHMiLCJjbGlwUGF0aCIsImxldHRlclNwYWNpbmciLCJwYWludE9yZGVyIiwiX3JlZjYiLCJyb3VuZCIsInR5cGUiLCJ2YWx1ZSIsIm9uQ2hhbmdlIiwidGFyZ2V0IiwiYWNjZW50Q29sb3IiLCJfbm9ybWFsaXplTG9jcyIsInNlZW4iLCJTZXQiLCJvdXQiLCJsIiwibmFtZSIsInRyaW0iLCJoYXMiLCJhZGQiLCJfcmVmNyIsIm1hcEJveFJlZiIsInVzZVJlZiIsIm1hcFJlZiIsIm1hcmtlclJlZiIsIl9SZWFjdCR1c2VTdGF0ZSIsIl9SZWFjdCR1c2VTdGF0ZTIiLCJnZW9CdXN5Iiwic2V0R2VvQnVzeSIsIl9SZWFjdCR1c2VTdGF0ZTMiLCJpc0FycmF5IiwiX1JlYWN0JHVzZVN0YXRlNCIsInNhdmVkTG9jcyIsInNldFNhdmVkTG9jcyIsImNhbmNlbGxlZCIsIl9hc3luY1RvR2VuZXJhdG9yIiwiZmV0Y2giLCJjcmVkZW50aWFscyIsImNhY2hlIiwib2siLCJqIiwianNvbiIsInNhdmVkIiwiX1JlYWN0JHVzZVN0YXRlNSIsIl9SZWFjdCR1c2VTdGF0ZTYiLCJzYXZlZE9wZW4iLCJzZXRTYXZlZE9wZW4iLCJzYXZlZFJlZiIsIm9uRG9jQ2xpY2siLCJjdXJyZW50IiwiY29udGFpbnMiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwib25TaXRlTmFtZUNoYW5nZSIsIm5ld05hbWUiLCJoaXQiLCJzZXRWaWV3IiwicGlja1NhdmVkTG9jIiwibG9jIiwicmVtb3ZlU2F2ZWRMb2MiLCJuZXh0IiwibWV0aG9kIiwiaGVhZGVycyIsImJvZHkiLCJjYXRjaCIsInJlbmFtZVNhdmVkTG9jIiwib3JpZ0xvYyIsInByZXYiLCJzdGlsbFNlbGVjdGVkIiwiYWJzIiwiX1JlYWN0JHVzZVN0YXRlNyIsIl9SZWFjdCR1c2VTdGF0ZTgiLCJzZWFyY2hRIiwic2V0U2VhcmNoUSIsIl9SZWFjdCR1c2VTdGF0ZTkiLCJfUmVhY3QkdXNlU3RhdGUwIiwic2VhcmNoSGl0cyIsInNldFNlYXJjaEhpdHMiLCJfUmVhY3QkdXNlU3RhdGUxIiwiX1JlYWN0JHVzZVN0YXRlMTAiLCJzZWFyY2hCdXN5Iiwic2V0U2VhcmNoQnVzeSIsIl9SZWFjdCR1c2VTdGF0ZTExIiwiX1JlYWN0JHVzZVN0YXRlMTIiLCJzZWFyY2hPcGVuIiwic2V0U2VhcmNoT3BlbiIsInNlYXJjaERlYm91bmNlUmVmIiwicnVuU2VhcmNoIiwiX3JlZjkiLCJxIiwidXJsIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiX3giLCJhcHBseSIsImFyZ3VtZW50cyIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJwaWNrU2VhcmNoSGl0IiwiZGlzcGxheV9uYW1lIiwicmV2ZXJzZUdlb2NvZGUiLCJfcmVmMCIsImFkZHJlc3MiLCJ0b3duIiwidmlsbGFnZSIsImhhbWxldCIsImNvdW50eSIsInJlZ2lvbiIsInN0YXRlIiwiY291bnRyeSIsIl94MiIsIl94MyIsIkwiLCJ6b29tQ29udHJvbCIsImF0dHJpYnV0aW9uQ29udHJvbCIsInRpbGVMYXllciIsIm1heFpvb20iLCJhdHRyaWJ1dGlvbiIsImFkZFRvIiwibWFya2VyIiwiZHJhZ2dhYmxlIiwiYmluZFRvb2x0aXAiLCJwZXJtYW5lbnQiLCJhcHBseUxhdExvbiIsIm4iLCJvbiIsImxsIiwiZ2V0TGF0TG5nIiwibG5nIiwic2V0TGF0TG5nIiwibGF0bG5nIiwiaW52YWxpZGF0ZVNpemUiLCJyZW1vdmUiLCJwYW5UbyIsIl9SZWFjdCR1c2VTdGF0ZTEzIiwiX1JlYWN0JHVzZVN0YXRlMTQiLCJnZW9TdGF0ZSIsInNldEdlb1N0YXRlIiwidXNlTXlMb2NhdGlvbiIsIm5hdmlnYXRvciIsImdlb2xvY2F0aW9uIiwiZXJyIiwiZ2V0Q3VycmVudFBvc2l0aW9uIiwicG9zIiwiY29vcmRzIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJtc2ciLCJjb2RlIiwibWVzc2FnZSIsImVuYWJsZUhpZ2hBY2N1cmFjeSIsInRpbWVvdXQiLCJtYXhpbXVtQWdlIiwiX1JlYWN0JHVzZVN0YXRlMTUiLCJfUmVhY3QkdXNlU3RhdGUxNiIsInNhdmVNc2ciLCJzZXRTYXZlTXNnIiwiX3JlZjEiLCJkZWR1cGVkIiwibmV4dFNhdmVkIiwic2xpY2UiLCJwZXJzaXN0ZWQiLCJ3YXJuaW5nIiwiYWN0aXZlIiwiZGVmYXVsdCIsIl9sYXN0V2VhdGhlckxvY2F0aW9uU2F2ZSIsIk1vZGFsU2hlbGwiLCJ0aXRsZSIsInN1YnRpdGxlIiwibWluSGVpZ2h0IiwicmVmIiwib3ZlcmZsb3ciLCJvbkZvY3VzIiwicGxhY2Vob2xkZXIiLCJvdXRsaW5lIiwiaCIsInBsYWNlX2lkIiwiY2xhc3MiLCJ0cmFuc2l0aW9uIiwiaXNBY3RpdmUiLCJyb3dLZXkiLCJyb2xlIiwidGFiSW5kZXgiLCJvbktleURvd24iLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsInR5cGVkIiwiY3VyIiwiY29uZmxpY3QiLCJkaXNhYmxlZCIsInByb3RvY29sIiwieiIsIl9yZWYxMCIsImxhbmdzIiwibmF0aXZlIiwiRXZlbnQiLCJQTFVHSU5fQ09ORklHX0ZJRUxEUyIsIndlYXRoZXIiLCJvcHRpb25zIiwiZGVmIiwic3dlZXRfc3BvdCIsImczNiIsImRpYnQiLCJsaWdodGluZyIsIl9yZWYxMSIsIkFMTCIsImRlc2MiLCJ2ZXIiLCJ0b2dnbGUiLCJpbmNsdWRlcyIsIl9SZWFjdCR1c2VTdGF0ZTE3IiwiX1JlYWN0JHVzZVN0YXRlMTgiLCJleHBhbmRlZElkIiwic2V0RXhwYW5kZWRJZCIsInVwZGF0ZUZpZWxkIiwicGx1Z2luSWQiLCJmaWVsZEtleSIsImZpZWxkcyIsImZpZWxkVmFsIiwiZmllbGQiLCJzdG9yZWQiLCJ1bmRlZmluZWQiLCJleHBhbmRlZCIsImYiLCJvIiwiX3JlZjEyIiwiX3JlZjEyJGFjY2VudCIsIl9yZWYxMiRzaXplIiwiY2hpbGRyZW4iLCJjb2xvck1hcCIsImluZGlnbyIsImFtYmVyIiwiZW1lcmFsZCIsInBpbmsiLCJzaXplTWFwIiwid2lkZSIsIm1heEhlaWdodCIsIlJlYWN0RE9NIiwiY3JlYXRlUm9vdCIsImdldEVsZW1lbnRCeUlkIiwicmVuZGVyIl0sInNvdXJjZXMiOlsiLi4vc3JjL3NldHVwLXdhbGsvc2V0dXBfd2Fsay5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiLyogV3JhcHBlZCBpbiBhbiBJSUZFIHNvIHRvcC1sZXZlbCBkZWNsYXJhdGlvbnMgc3RheSBmdW5jdGlvbi1zY29wZWQgYW5kIGRvXG4gICBOT1QgbGVhayBvbnRvIGB3aW5kb3dgLiAgVGhpcyBidW5kbGUgaXMgbG9hZGVkIGFzIGEgQ0xBU1NJQyA8c2NyaXB0Piwgd2hlcmVcbiAgIGEgdG9wLWxldmVsIGB2YXIgZm9vYCAod2hhdCBCYWJlbCBjb21waWxlcyBgY29uc3QgZm9vYCBkb3duIHRvKSB3b3VsZCBiZWNvbWVcbiAgIGB3aW5kb3cuZm9vYC4gIFdpdGhvdXQgdGhpcyB3cmFwcGVyLCB0aGUgbG9jYWwgYHRgL2B1c2VMYW5nYCBoZWxwZXJzIGJlbG93XG4gICBvdmVyd3JpdGUgdGhlIHJlYWwgYHdpbmRvdy50YC9gd2luZG93LnVzZUxhbmdgIGZyb20ganMvaTE4bi5qcyBhbmQgdGhlbiBjYWxsXG4gICB0aGVtc2VsdmVzIOKGkiBcIk1heGltdW0gY2FsbCBzdGFjayBzaXplIGV4Y2VlZGVkXCIgKGJsYW5rIHNjcmVlbikuICovXG4oZnVuY3Rpb24gKCkge1xuY29uc3QgeyB1c2VTdGF0ZSwgdXNlTWVtbyB9ID0gUmVhY3Q7XG5cbi8qIGkxOG4gaGVscGVycyDigJQgcmVzb2x2ZSBhZ2FpbnN0IHRoZSBzaGFyZWQgZGljdGlvbmFyeSBpbiBqcy9pMThuLmpzXG4gICAobG9hZGVkIGJ5IHNldHVwLmh0bWwgYmVmb3JlIHRoaXMgYnVuZGxlKS4gIHQoKSBmYWxscyBiYWNrIHRvIHRoZSBrZXlcbiAgIGlmIGkxOG4uanMgaXMgc29tZWhvdyBhYnNlbnQ7IHVzZUxhbmcoKSBzdWJzY3JpYmVzIGEgY29tcG9uZW50IHRvIHRoZVxuICAgYGxhbmdjaGFuZ2VgIGV2ZW50IHNvIHRoZSB3aG9sZSB3aXphcmQgcmUtcmVuZGVycyAoYW5kIHJlLXRyYW5zbGF0ZXMpXG4gICB0aGUgaW5zdGFudCB0aGUgbGFuZ3VhZ2UgaXMgc3dpdGNoZWQuICovXG5jb25zdCB0ID0gKGspID0+ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cudCA/IHdpbmRvdy50KGspIDogayk7XG5jb25zdCB1c2VMYW5nID0gKCkgPT4gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy51c2VMYW5nID8gd2luZG93LnVzZUxhbmcoKSA6IG51bGwpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBTVEVQIERFRklOSVRJT05TIOKAlCB0aGUgNCB3YWxrIHBhdGhzIHRoZSB1c2VyIGRlc2NyaWJlZFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuY29uc3QgU1RFUFMgPSBbXG4gICAgLyogV2FsayBvcmRlciBpcyB0aGUgcGVudGFnb24gdHJhdmVyc2FsOiB0b3Ag4oaSIHVwcGVyLXJpZ2h0IOKGkiBsb3dlci1yaWdodCDihpIgbG93ZXItbGVmdCDihpIgdXBwZXItbGVmdC5cbiAgICAgICBMYWJlbHMgaW50ZW50aW9uYWxseSBkcm9wIHRoZSByZWR1bmRhbnQgXCJTZXR0aW5nXCIgc3VmZml4IHNvIHRoZVxuICAgICAgIG1haW4gaGVhZGluZyBpbnNpZGUgZWFjaCBjaXJjbGUgY2FuIHJlbmRlciBpbiBvbmUgbGluZSBhdCBhIGxhcmdlclxuICAgICAgIGZvbnQgd2VpZ2h0LiAgbGFiZWxLZXkvc3ViS2V5IHJlc29sdmUgdmlhIHQoKSBhdCByZW5kZXIgdGltZSBzbyB0aGV5XG4gICAgICAgdHJhY2sgdGhlIGFjdGl2ZSBsYW5ndWFnZS4gKi9cbiAgICB7IGtleToncHN5JywgICAgICBsYWJlbEtleTonc3dfc3RlcF9wc3knLCAgICAgIHN1YktleTonc3dfc3RlcF9wc3lfc3ViJywgICAgICBraW5kOidwYWdlJywgIGljb25Db2xvcjonIzgxOGNmOCcsIGFjY2VudDonaW5kaWdvJyB9LFxuICAgIHsga2V5Oidsb2NhdGlvbicsIGxhYmVsS2V5Oidzd19zdGVwX2xvY2F0aW9uJywgc3ViS2V5Oidzd19zdGVwX2xvY2F0aW9uX3N1YicsIGtpbmQ6J21vZGFsJywgaWNvbkNvbG9yOicjZmJiZjI0JywgYWNjZW50OidhbWJlcicgIH0sXG4gICAgeyBrZXk6J2xhbmd1YWdlJywgbGFiZWxLZXk6J3N3X3N0ZXBfbGFuZ3VhZ2UnLCBzdWJLZXk6J3N3X3N0ZXBfbGFuZ3VhZ2Vfc3ViJywga2luZDonbW9kYWwnLCBpY29uQ29sb3I6JyMzNGQzOTknLCBhY2NlbnQ6J2VtZXJhbGQnfSxcbiAgICB7IGtleToncGx1Z2lucycsICBsYWJlbEtleTonc3dfc3RlcF9wbHVnaW4nLCAgIHN1YktleTonc3dfc3RlcF9wbHVnaW5fc3ViJywgICBraW5kOidtb2RhbCcsIGljb25Db2xvcjonI2Y0NzJiNicsIGFjY2VudDoncGluaycgICB9LFxuICAgIHsga2V5OidyZXBhaXInLCAgIGxhYmVsS2V5Oidzd19zdGVwX3JlcGFpcicsICAgc3ViS2V5Oidzd19zdGVwX3JlcGFpcl9zdWInLCAgIGtpbmQ6J2xpbmsnLCAgaWNvbkNvbG9yOicjZmI3MTg1JywgYWNjZW50Oidyb3NlJywgaHJlZjonL3VwZGF0ZS5odG1sP2Zyb209c2V0dXAnIH0sXG5dO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBST09UIEFQUFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuZnVuY3Rpb24gQXBwKCkge1xuICAgIHVzZUxhbmcoKTsgICAvLyByZS1yZW5kZXIgd2hvbGUgd2l6YXJkIChhbmQgYWxsIGRlc2NlbmRhbnRzKSBvbiBsYW5ndWFnZSBjaGFuZ2VcbiAgICAvKiBjb21wbGV0aW9uICsgcGVyLXN0ZXAgY29uZmlnIC0tIG1vY2t1cCBzdGF0ZSwgbmV2ZXIgcGVyc2lzdGVkICovXG4gICAgY29uc3QgW2RvbmUsIHNldERvbmVdID0gdXNlU3RhdGUoeyBwc3k6ZmFsc2UsIGxvY2F0aW9uOmZhbHNlLCBsYW5ndWFnZTpmYWxzZSwgcGx1Z2luczpmYWxzZSwgcmVwYWlyOmZhbHNlIH0pO1xuICAgIGNvbnN0IFtyb3V0ZSwgc2V0Um91dGVdID0gdXNlU3RhdGUoJ2h1YicpOyAgIC8vICdodWInIHwgJ3BzeSdcbiAgICBjb25zdCBbbW9kYWwsIHNldE1vZGFsXSA9IHVzZVN0YXRlKG51bGwpOyAgICAgLy8gJ2xvY2F0aW9uJyB8ICdsYW5ndWFnZScgfCAncGx1Z2lucycgfCBudWxsXG5cbiAgICBjb25zdCBbcHN5Q2ZnLCBzZXRQc3lDZmddICAgICAgICAgPSB1c2VTdGF0ZSh7IGdpdm9uaTp0cnVlLCByaFByZXNldDonb2ZmaWNlJywgcmhMbzozMCwgcmhIaTo2MCwgdExvOi0xNSwgdEhpOjUwLCB0aGVtZTonZGFyaycsIGRhcmtMZXZlbDoyLjAgfSk7XG4gICAgY29uc3QgW2xvY0NmZywgc2V0TG9jQ2ZnXSAgICAgICAgID0gdXNlU3RhdGUoeyBzaXRlTmFtZTonTXkgQnVpbGRpbmcnLCBjaXR5OidUb3JvbnRvLCBPTicsIGxhdDo0My42NTMyLCBsb246LTc5LjM4MzIgfSk7XG4gICAgY29uc3QgW2xhbmdDZmcsIHNldExhbmdDZmddICAgICAgID0gdXNlU3RhdGUoKCkgPT4ge1xuICAgICAgICAvKiBMYXp5IGluaXQgZnJvbSB0aGUgc2FtZSBsb2NhbFN0b3JhZ2Uga2V5IHRoZSBkYXNoYm9hcmQgcmVhZHMsIHNvXG4gICAgICAgICAqIHJlb3BlbmluZyB0aGUgc2V0dXAgd2FsayBzaG93cyB0aGUgY3VycmVudGx5LWFjdGl2ZSBsYW5ndWFnZVxuICAgICAgICAgKiByYXRoZXIgdGhhbiBhbHdheXMgZGVmYXVsdGluZyB0byBFbmdsaXNoLiAqL1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgdiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdpMThuX2xhbmcnKTtcbiAgICAgICAgICAgIGNvbnN0IGFsbG93ZWQgPSBbJ2VuJywnemgtQ04nLCd6aC1UVycsJ2phJywna28nXTtcbiAgICAgICAgICAgIGlmICh2ICYmIGFsbG93ZWQuaW5kZXhPZih2KSAhPT0gLTEpIHJldHVybiB7IGxhbmc6IHYgfTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBwcml2YXRlIG1vZGUgLT4gZmFsbCB0aHJvdWdoICovIH1cbiAgICAgICAgcmV0dXJuIHsgbGFuZzonZW4nIH07XG4gICAgfSk7XG4gICAgY29uc3QgW3BsdWdpbkNmZywgc2V0UGx1Z2luQ2ZnXSAgID0gdXNlU3RhdGUoeyBlbmFibGVkOlsnd2VhdGhlcicsJ2dpdm9uaScsJ3N3ZWV0X3Nwb3QnXSB9KTtcblxuICAgIGNvbnN0IGNvbXBsZXRlQ291bnQgPSBPYmplY3QudmFsdWVzKGRvbmUpLmZpbHRlcihCb29sZWFuKS5sZW5ndGg7XG5cbiAgICBjb25zdCBmaW5pc2ggPSAoa2V5KSA9PiB7XG4gICAgICAgIHNldERvbmUoZCA9PiAoey4uLmQsIFtrZXldOnRydWV9KSk7XG4gICAgICAgIHNldFJvdXRlKCdodWInKTtcbiAgICAgICAgc2V0TW9kYWwobnVsbCk7XG4gICAgfTtcblxuICAgIC8qIGZ1bGwtcGFnZSBQc3kgQ2hhcnQgZWRpdG9yICovXG4gICAgaWYgKHJvdXRlID09PSAncHN5Jykge1xuICAgICAgICByZXR1cm4gPFBzeUNoYXJ0U2V0dGluZ1BhZ2UgY2ZnPXtwc3lDZmd9IHNldENmZz17c2V0UHN5Q2ZnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25CYWNrPXsoKSA9PiBzZXRSb3V0ZSgnaHViJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNhdmU9eygpID0+IGZpbmlzaCgncHN5Jyl9IC8+O1xuICAgIH1cblxuICAgIC8qIGRlZmF1bHQ6IEhVQiBzY3JlZW4gKi9cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1pbi1oLXNjcmVlbiBweC02IHB5LThcIj5cbiAgICAgICAgICAgIHsvKiAtLS0tLS0tLS0tLS0tIGhlYWRlciAtLS0tLS0tLS0tLS0tICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXgtdy01eGwgbXgtYXV0byBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gbWItMTAgZmFkZS11cFwiPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJ0ZXh0LTJ4bCBzbTp0ZXh0LTN4bCBmb250LWJsYWNrIGl0YWxpYyB1cHBlcmNhc2UgdHJhY2tpbmctdGlnaHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtcmVkLTUwMFwiPlJlZDU8L3NwYW4+IDxzcGFuIGNsYXNzTmFtZT1cInRleHQtd2hpdGVcIj5TdHVkaW88L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCBmb250LW5vcm1hbCBpdGFsaWNcIj4gJm5ic3A7LyZuYnNwOyBzZXR1cCB3YWxrPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2gxPlxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCB0ZXh0LXhzIG10LTEgZm9udC1tb25vIHRyYWNraW5nLXdpZGVcIj57dCgnc3dfc3VidGl0bGUnKX08L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtNFwiPlxuICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiL2Rhc2hib2FyZC5odG1sXCJcbiAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4geyB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS5zZXR1cC5kb25lJywnMScpOyB9IGNhdGNoKGUpe30gfX1cbiAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXNsYXRlLTUwMCBob3Zlcjp0ZXh0LXNsYXRlLTMwMCB1bmRlcmxpbmUgdW5kZXJsaW5lLW9mZnNldC00XCI+e3QoJ3N3X3NraXBfYWxsJyl9PC9hPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiAtLS0tLS0tLS0tLS0tIHBlbnRhZ29uIGxheW91dCAtLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgNSBjaXJjdWxhciB0aWxlcyBhcnJhbmdlZCBhdCB0aGUgY29ybmVycyBvZiBhIHJlZ3VsYXJcbiAgICAgICAgICAgICAgICBwZW50YWdvbi4gIFBvbGFyIG1hdGhzOiBhbmdsZSBzdGFydHMgYXQgLTkwZGVnICh0b3ApIGFuZFxuICAgICAgICAgICAgICAgIHN0ZXBzIGJ5ICs3MmRlZyBjbG9ja3dpc2UuICBUaGUgY29udGFpbmVyIGlzIGhlaWdodC1sb2NrZWRcbiAgICAgICAgICAgICAgICB2aWEgYXNwZWN0IHJhdGlvIHNvIHRoZSBwZW50YWdvbiBzdGF5cyBjaXJjdWxhciBvbiBldmVyeVxuICAgICAgICAgICAgICAgIHZpZXdwb3J0LiAgUmFkaXVzIGlzIDQwICUgb2YgdGhlIGNvbnRhaW5lciBoYWxmLXNpZGUsIGNpcmNsZVxuICAgICAgICAgICAgICAgIGRpYW1ldGVyIH4yNyAlIG9mIHRoZSBjb250YWluZXIgd2lkdGggLS0gZ2l2ZXMgYSBjbGVhcmx5XG4gICAgICAgICAgICAgICAgdmlzaWJsZSBnYXAgKH4yOCAlIG9mIGNvbnRhaW5lciB3aWR0aCkgYmV0d2VlbiBhZGphY2VudFxuICAgICAgICAgICAgICAgIGNpcmNsZXMgcmVnYXJkbGVzcyBvZiBzY3JlZW4gc2l6ZS4gKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlIG14LWF1dG8gZmFkZS11cFwiXG4gICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOidtaW4oNzYwcHgsIDkydncpJywgYXNwZWN0UmF0aW86JzEgLyAxJywgYW5pbWF0aW9uRGVsYXk6Jy4wOHMnIH19PlxuXG4gICAgICAgICAgICAgICAgey8qIEJhY2tncm91bmQgcHN5LWNoYXJ0IGxheWVyIC0tIHNpemVkIHRvIGZpbGwgdGhlIGNvbnN0ZWxsYXRpb25cbiAgICAgICAgICAgICAgICAgICAgY2lyY2xlICh+NzggJSBvZiBjb250YWluZXIgPSBqdXN0IGluc2lkZSB0aGUgY29uc3RlbGxhdGlvblxuICAgICAgICAgICAgICAgICAgICBhcmMgdGhhdCBqb2lucyB0aGUgNSB0aWxlIGNlbnRyZXMpLiAgUmVuZGVyZWQgRklSU1Qgc28gdGhlXG4gICAgICAgICAgICAgICAgICAgIDUgdGlsZSBjaXJjbGVzIChuZXh0IGluIERPTSkgc2l0IG9uIHRvcCBhbmQgb2JzY3VyZSB0aGVcbiAgICAgICAgICAgICAgICAgICAgcG9ydGlvbiBvZiB0aGUgY2hhcnQgdGhhdCBvdmVybGFwcyB0aGVtLiAgVGhhdCBnaXZlcyB0aGVcbiAgICAgICAgICAgICAgICAgICAgXCJpbWFnZSByZWNlZGVzIGJlaGluZCB0aGUgNSBjaXJjbGVzXCIgZWZmZWN0LiAqL31cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGxlZnQtMS8yIHRvcC0xLzIgLXRyYW5zbGF0ZS14LTEvMiAtdHJhbnNsYXRlLXktMS8yIHBvaW50ZXItZXZlbnRzLW5vbmUgb3ZlcmZsb3ctaGlkZGVuIHJvdW5kZWQtZnVsbFwiXG4gICAgICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3t3aWR0aDonNzglJywgYXNwZWN0UmF0aW86JzEvMSd9fT5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCIvYXBpL2Fzc2V0cy9pbWcvcHN5X3NpbGhvdWV0dGUuanBnXCIgYWx0PVwiXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC0wIHctZnVsbCBoLWZ1bGwgb2JqZWN0LWNvdmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e29wYWNpdHk6MC43OH19IC8+XG4gICAgICAgICAgICAgICAgICAgIHsvKiBEYXJrIHZpZ25ldHRlIC8gbGVucyAtLSBwdWxscyB0aGUgY2VudHJlIGRvd24gc28gdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICBOLzUgRE9ORSBjb3VudGVyIHRoYXQgbGl2ZXMgT04gVE9QIHN0YXlzIHJlYWRhYmxlLiAqL31cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC0wXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6J3JhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgY2VudGVyLCByZ2JhKDIsNiwyMywwLjYwKSAwJSwgcmdiYSgyLDYsMjMsMC4zNSkgNTUlLCByZ2JhKDIsNiwyMywwLjEwKSAxMDAlKSd9fS8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICB7U1RFUFMubWFwKChzLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFuZ2xlRGVnID0gLTkwICsgaSAqIDcyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmdsZSA9IGFuZ2xlRGVnICogTWF0aC5QSSAvIDE4MDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgciA9IDQwOyAgICAgICAgICAgICAgICAgICAgICAgIC8vICUgb2YgY29udGFpbmVyIGhhbGYtc2lkZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4ID0gNTAgKyByICogTWF0aC5jb3MoYW5nbGUpOyAgLy8gJVxuICAgICAgICAgICAgICAgICAgICBjb25zdCB5ID0gNTAgKyByICogTWF0aC5zaW4oYW5nbGUpOyAgLy8gJVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPENpcmNsZVRpbGUga2V5PXtzLmtleX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXA9e3N9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lPXtkb25lW3Mua2V5XX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4PXtpKzF9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0UGN0PXt4fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wUGN0PXt5fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzLmtpbmQgPT09ICdwYWdlJykgICAgICBzZXRSb3V0ZShzLmtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocy5raW5kID09PSAnbGluaycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU2FtZS10YWIgbmF2IHNvIHRoZSByZXR1cm4gYmFkZ2Ugb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlLmh0bWwgY2FuIHNpbXBseSB3aW5kb3cubG9jYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFjayBoZXJlIHdoZW4gdGhlIG9wZXJhdG9yIGlzIGRvbmUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcy5ocmVmO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSAgICAgICAgICAgICAgICAgICAgICBzZXRNb2RhbChzLmtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fSAvPlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIHsvKiBEZWNvcmF0aXZlIHJpbmc6IGEgc2luZ2xlIGNpcmNsZSB3aG9zZSBjZW50cmUgY29pbmNpZGVzXG4gICAgICAgICAgICAgICAgICAgIHdpdGggdGhlIGNlbnRyZSBvZiB0aGUgcGVudGFnb24gYW5kIHdob3NlIHJhZGl1cyBlcXVhbHNcbiAgICAgICAgICAgICAgICAgICAgdGhlIHBlbnRhZ29uIHZlcnRleCByYWRpdXMgLS0gaXRzIGJvdW5kYXJ5IHBhc3Nlc1xuICAgICAgICAgICAgICAgICAgICBjbGVhbmx5IHRocm91Z2ggdGhlIGNlbnRyZSBvZiBlYWNoIHRpbGUuICBUaGUgbWFza1xuICAgICAgICAgICAgICAgICAgICBjdXRzIG91dCB0aGUgZGlzayBvZiBldmVyeSB0aWxlIGNpcmNsZSBzbyB0aGUgcmluZyBpc1xuICAgICAgICAgICAgICAgICAgICB2aXNpYmxlIE9OTFkgaW4gdGhlIGdhcHMgYmV0d2VlbiB0aWxlcywgbmV2ZXIgY3Jvc3NpbmdcbiAgICAgICAgICAgICAgICAgICAgYSB0aWxlIGludGVyaW9yLiAqL31cbiAgICAgICAgICAgICAgICA8c3ZnIGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgdy1mdWxsIGgtZnVsbCBwb2ludGVyLWV2ZW50cy1ub25lXCJcbiAgICAgICAgICAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMTAwIDEwMFwiIHByZXNlcnZlQXNwZWN0UmF0aW89XCJub25lXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkZWZzPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG1hc2sgaWQ9XCJwZW50YWdvbi1yaW5nLW1hc2tcIiBtYXNrVW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4PVwiMFwiIHk9XCIwXCIgd2lkdGg9XCIxMDBcIiBoZWlnaHQ9XCIxMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCB4PVwiMFwiIHk9XCIwXCIgd2lkdGg9XCIxMDBcIiBoZWlnaHQ9XCIxMDBcIiBmaWxsPVwid2hpdGVcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtTVEVQUy5tYXAoKF8sIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYSA9ICgtOTAgKyBpICogNzIpICogTWF0aC5QSSAvIDE4MDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY3ggPSA1MCArIDQwICogTWF0aC5jb3MoYSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGN5ID0gNTAgKyA0MCAqIE1hdGguc2luKGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiAxNy41ICUgcmFkaXVzID0gc2FtZSBhcyB0aGUgdGlsZSBjaXJjbGUnc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYWxmLXdpZHRoICgzNSAlIGRpYW1ldGVyKTsgKzAuNSAlIG51ZGdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtlZXBzIHRoZSBtYXNrIGVkZ2UgaW5zaWRlIHRoZSBjb2xvdXJlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByaW5nIHNvIHRoZSB3aGl0ZSBhcmMgZG9lc24ndCBBTE1PU1QtdG91Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIHJpbmcgYm9yZGVyIHdpdGggYW50aS1hbGlhc2VkIGZyaW5nZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDxjaXJjbGUga2V5PXtpfSBjeD17Y3h9IGN5PXtjeX0gcj1cIjE4XCIgZmlsbD1cImJsYWNrXCIgLz47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L21hc2s+XG4gICAgICAgICAgICAgICAgICAgIDwvZGVmcz5cbiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBjeD1cIjUwXCIgY3k9XCI1MFwiIHI9XCI0MFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cInJnYmEoMjU1LDI1NSwyNTUsMC44NSlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoPVwiMC41NlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFzaz1cInVybCgjcGVudGFnb24tcmluZy1tYXNrKVwiIC8+XG4gICAgICAgICAgICAgICAgPC9zdmc+XG5cbiAgICAgICAgICAgICAgICB7LyogQ2VudHJlZCBjb21wbGV0aW9uIGNvdW50ZXIgLS0gc2l0cyBhdCB0aGUgY2VudHJvaWQgb2YgdGhlXG4gICAgICAgICAgICAgICAgICAgIHBlbnRhZ29uLCBmb250IHdlaWdodCBtYXRjaGVkIHRvIHRoZSBwZXItdGlsZSBoZWFkaW5nIHNvIHRoZVxuICAgICAgICAgICAgICAgICAgICBleWUgcmVhZHMgaXQgYXMgdGhlIGRvbWluYW50IHN0YXR1cy4gIFJlbmRlcmVkIExBU1Qgc28gaXRcbiAgICAgICAgICAgICAgICAgICAgc2l0cyBvbiB0b3Agb2YgYm90aCB0aGUgcHN5LWNoYXJ0IHNpbGhvdWV0dGUgYW5kIHRoZSB0aWxlXG4gICAgICAgICAgICAgICAgICAgIGNpcmNsZXMuICovfVxuICAgICAgICAgICAgICAgIHsvKiBOLzUgRE9ORSB0ZXh0IC0tIG93biBhYnNvbHV0ZSBsYXllciByZW5kZXJlZCBBRlRFUiB0aGVcbiAgICAgICAgICAgICAgICAgICAgdGlsZSBjaXJjbGVzIHNvIGl0IGFsd2F5cyBzaXRzIG9uIHRvcC4gKi99XG4gICAgICAgICAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cInNldHVwLXByb2dyZXNzLWNlbnRlclwiXG4gICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSBsZWZ0LTEvMiB0b3AtMS8yIC10cmFuc2xhdGUteC0xLzIgLXRyYW5zbGF0ZS15LTEvMiB0ZXh0LWNlbnRlciBwb2ludGVyLWV2ZW50cy1ub25lIHNlbGVjdC1ub25lXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgdGV4dC1bNjZweF0gc206dGV4dC1bNzhweF0gZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctdGlnaHQgd2hpdGVzcGFjZS1ub3dyYXAgbGVhZGluZy1ub25lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjb21wbGV0ZUNvdW50ID09PSA1ID8gJ3RleHQtZW1lcmFsZC00MDAnIDogJ3RleHQtd2hpdGUnfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3t0ZXh0U2hhZG93OicwIDRweCAyNHB4IHJnYmEoMiw2LDIzLDAuOTUpLCAwIDAgOHB4IHJnYmEoMiw2LDIzLDAuOTUpJ319PlxuICAgICAgICAgICAgICAgICAgICAgICAge2NvbXBsZXRlQ291bnR9LzVcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMzBweF0gc206dGV4dC1bMzNweF0gZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctWzAuM2VtXSB0ZXh0LXNsYXRlLTMwMCBtdC0zXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e3RleHRTaGFkb3c6JzAgMnB4IDEycHggcmdiYSgyLDYsMjMsMC45KSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0KCdzd19kb25lJyl9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiAtLS0tLS0tLS0tLS0tIGZvb3RlciBDVEEgLS0tLS0tLS0tLS0tLSAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctNXhsIG14LWF1dG8gbXQtMTAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIGZhZGUtdXBcIiBzdHlsZT17e2FuaW1hdGlvbkRlbGF5OicuMThzJ319PlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNTAwIHRleHQteHMgZm9udC1tb25vXCI+XG4gICAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZUNvdW50ID09PSAwICYmIHQoJ3N3X2Zvb3Rfc3RhcnQnKX1cbiAgICAgICAgICAgICAgICAgICAge2NvbXBsZXRlQ291bnQgPiAwICYmIGNvbXBsZXRlQ291bnQgPCA1ICYmIGDihpEgJHs1IC0gY29tcGxldGVDb3VudH0gJHt0KCdzd19zdGVwc19yZW1haW5pbmcnKX1gfVxuICAgICAgICAgICAgICAgICAgICB7Y29tcGxldGVDb3VudCA9PT0gNSAmJiB0KCdzd19mb290X2FsbF9kb25lJyl9XG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIvZGFzaGJvYXJkLmh0bWxcIlxuICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHsgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDUuc2V0dXAuZG9uZScsJzEnKTsgfSBjYXRjaChlKXt9IH19XG4gICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHgtNyBweS0zIHJvdW5kZWQteGwgdGV4dC1zbSBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Y29tcGxldGVDb3VudCA9PT0gNVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLWVtZXJhbGQtNjAwIGhvdmVyOmJnLWVtZXJhbGQtNTAwIHRleHQtd2hpdGUgc2hhZG93LWxnIHNoYWRvdy1lbWVyYWxkLTUwMC8zMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1pbmRpZ28tNjAwIGhvdmVyOmJnLWluZGlnby01MDAgdGV4dC13aGl0ZSBzaGFkb3ctbGcgc2hhZG93LWluZGlnby01MDAvMjAnfWB9PlxuICAgICAgICAgICAgICAgICAgICB7dCgnc3dfb3Blbl9kYXNoYm9hcmQnKX1cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIC0tLS0tLS0tLS0tLS0gbW9kYWxzIC0tLS0tLS0tLS0tLS0gKi99XG4gICAgICAgICAgICB7bW9kYWwgPT09ICdsb2NhdGlvbicgJiYgPExvY2F0aW9uTW9kYWwgY2ZnPXtsb2NDZmd9IHNldENmZz17c2V0TG9jQ2ZnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0TW9kYWwobnVsbCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNhdmU9eygpID0+IGZpbmlzaCgnbG9jYXRpb24nKX0gLz59XG4gICAgICAgICAgICB7bW9kYWwgPT09ICdsYW5ndWFnZScgJiYgPExhbmd1YWdlTW9kYWwgY2ZnPXtsYW5nQ2ZnfSBzZXRDZmc9e3NldExhbmdDZmd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRNb2RhbChudWxsKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2F2ZT17KCkgPT4gZmluaXNoKCdsYW5ndWFnZScpfSAvPn1cbiAgICAgICAgICAgIHttb2RhbCA9PT0gJ3BsdWdpbnMnICAmJiA8UGx1Z2luc01vZGFsICBjZmc9e3BsdWdpbkNmZ30gc2V0Q2ZnPXtzZXRQbHVnaW5DZmd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRNb2RhbChudWxsKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2F2ZT17KCkgPT4gZmluaXNoKCdwbHVnaW5zJyl9IC8+fVxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBUaWxlIChsYXJnZSBlYXN5LW9uLWV5ZXMgYnV0dG9uKSAtLSBrZXB0IGZvciBiYWNrLWNvbXBhdCwgbm8gbG9uZ2VyIHVzZWRcbiAqIGJ5IHRoZSBwZW50YWdvbiBodWIuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5mdW5jdGlvbiBUaWxlKHsgc3RlcCwgZG9uZSwgaW5kZXgsIG9uQ2xpY2sgfSkge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxidXR0b24gb25DbGljaz17b25DbGlja31cbiAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17YHNldHVwLXRpbGUtJHtzdGVwLmtleX1gfVxuICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e3Qoc3RlcC5sYWJlbEtleSl9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdGlsZS1idG4gcmVsYXRpdmUgdGV4dC1sZWZ0IGJnLXNsYXRlLTkwMC83MCBib3JkZXItMiBib3JkZXItc2xhdGUtNzAwLzcwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91bmRlZC0yeGwgcC02IHNtOnAtNyAke2RvbmUgPyAnZG9uZScgOiAnJ31gfT5cbiAgICAgICAgICAgIHtkb25lICYmIDxzcGFuIGNsYXNzTmFtZT1cImNoZWNrXCIgZGF0YS10ZXN0aWQ9e2BzZXR1cC10aWxlLSR7c3RlcC5rZXl9LWRvbmVgfT7inJM8L3NwYW4+fVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtNCBtYi0zXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTEyIGgtMTIgcm91bmRlZC14bCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiXG4gICAgICAgICAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6YCR7c3RlcC5pY29uQ29sb3J9MjJgLCBib3JkZXI6YDFweCBzb2xpZCAke3N0ZXAuaWNvbkNvbG9yfTU1YH19PlxuICAgICAgICAgICAgICAgICAgICA8VGlsZUljb24ga2luZD17c3RlcC5rZXl9IGNvbG9yPXtzdGVwLmljb25Db2xvcn0gLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtM3hsIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS03MDBcIj4we2luZGV4fTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1sZyBzbTp0ZXh0LXhsIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVyIG1iLTFcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7Y29sb3I6c3RlcC5pY29uQ29sb3J9fT57dChzdGVwLmxhYmVsS2V5KX08L2gzPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS00MDAgdGV4dC1zbSBsZWFkaW5nLXNudWdcIj57dChzdGVwLnN1YktleSl9PC9wPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC00IGZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicGlsbCBiZy1zbGF0ZS04MDAgdGV4dC1zbGF0ZS00MDBcIj57c3RlcC5raW5kID09PSAncGFnZScgPyB0KCdzd19mdWxsX3BhZ2UnKSA6IHQoJ3N3X3BvcHVwJyl9PC9zcGFuPlxuICAgICAgICAgICAgICAgIHtkb25lICYmIDxzcGFuIGNsYXNzTmFtZT1cInBpbGwgYmctZW1lcmFsZC05MDAvNDAgdGV4dC1lbWVyYWxkLTQwMFwiPnt0KCdzd19jb25maWd1cmVkJyl9PC9zcGFuPn1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2J1dHRvbj5cbiAgICApO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDaXJjbGVUaWxlIC0tIHBlbnRhZ29uLWNvcm5lciByb3VuZCBidXR0b24uICBTaXplZCBpbiAlIG9mIGl0cyBjb250YWluZXJcbiAqIHNvIHRoZSB3aG9sZSBsYXlvdXQgc2NhbGVzIHdpdGggdmlld3BvcnQuICBFYWNoIGNpcmNsZSBpcyBhbmNob3JlZCBieSBpdHNcbiAqIGNlbnRyZSAodHJhbnNsYXRlIC01MCUvLTUwJSkgb24gdGhlIHBvbGFyLWNvbXB1dGVkIChsZWZ0JSwgdG9wJSkuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5mdW5jdGlvbiBDaXJjbGVUaWxlKHsgc3RlcCwgZG9uZSwgaW5kZXgsIGxlZnRQY3QsIHRvcFBjdCwgb25DbGljayB9KSB7XG4gICAgLyogVGhpY2sgY29sb3VyZWQgcmluZyBwZXIgdGlsZSAtLSBlYWNoIHN0ZXAga2VlcHMgaXRzIGFjY2VudCBjb2xvdXJcbiAgICAgKiAoaW5kaWdvL2FtYmVyL2VtZXJhbGQvcGluay9yb3NlKSwgcmVpbmZvcmNpbmcgdGhlIGNvbG91ci1jb2RlZCBTVkdcbiAgICAgKiBpY29uIGFuZCB0aGUgaGVhZGluZyB0ZXh0LiAqL1xuICAgIGNvbnN0IHJpbmdDb2xvciA9IHN0ZXAuaWNvbkNvbG9yO1xuICAgIHJldHVybiAoXG4gICAgICAgIDxidXR0b24gb25DbGljaz17b25DbGlja31cbiAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17YHNldHVwLXRpbGUtJHtzdGVwLmtleX1gfVxuICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e3Qoc3RlcC5sYWJlbEtleSl9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgY2lyY2xlLXRpbGUgZ3JvdXAgYWJzb2x1dGUgcm91bmRlZC1mdWxsIHRleHQtY2VudGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi0yMDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2RvbmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctc2xhdGUtOTAwIHNoYWRvdy1bMF8wXzMwcHhfLTZweF9yZ2JhKDE2LDE4NSwxMjksMC41NSldJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1zbGF0ZS05MDAgaG92ZXI6Ymctc2xhdGUtODAwJ31gfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6YCR7bGVmdFBjdH0lYCwgdG9wOmAke3RvcFBjdH0lYCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6J21pbigzNSUsIDI2MHB4KScsIGFzcGVjdFJhdGlvOicxLzEnLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06J3RyYW5zbGF0ZSgtNTAlLCAtNTAlKScsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlcjpgMTBweCBzb2xpZCAke3JpbmdDb2xvcn1gLFxuICAgICAgICAgICAgICAgICAgICBib3hTaGFkb3c6YDAgMCAwIDFweCAke3JpbmdDb2xvcn0zMywgMCA4cHggMjhweCAtOHB4ICR7cmluZ0NvbG9yfTU1YCxcbiAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHtkb25lICYmIChcbiAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLXRlc3RpZD17YHNldHVwLXRpbGUtJHtzdGVwLmtleX0tZG9uZWB9XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgLXRvcC0xIC1yaWdodC0xIHctNiBoLTYgcm91bmRlZC1mdWxsIGJnLWVtZXJhbGQtNTAwIHRleHQtd2hpdGUgdGV4dC14cyBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBmb250LWJvbGQgc2hhZG93XCI+XG4gICAgICAgICAgICAgICAgICAgIOKck1xuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdW5kZWQteGwgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgbWItMVwiXG4gICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiczNCUnLCBhc3BlY3RSYXRpbzonMS8xJyxcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDpgJHtzdGVwLmljb25Db2xvcn0yMmAsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlcjpgMXB4IHNvbGlkICR7c3RlcC5pY29uQ29sb3J9NTVgLFxuICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICA8VGlsZUljb24ga2luZD17c3RlcC5rZXl9IGNvbG9yPXtzdGVwLmljb25Db2xvcn0gc2l6ZT17NDR9IC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1ibGFjayB0ZXh0LXNsYXRlLTYwMCB0cmFja2luZy13aWRlclwiPjB7aW5kZXh9PC9kaXY+XG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1bMjJweF0gc206dGV4dC1bMjZweF0gZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctdGlnaHQgd2hpdGVzcGFjZS1ub3dyYXAgbGVhZGluZy1ub25lIG10LTEuNVwiXG4gICAgICAgICAgICAgICAgc3R5bGU9e3tjb2xvcjpzdGVwLmljb25Db2xvcn19PlxuICAgICAgICAgICAgICAgIHt0KHN0ZXAubGFiZWxLZXkpfVxuICAgICAgICAgICAgPC9oMz5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNTAwIHRleHQtWzEwcHhdIHNtOnRleHQtWzExcHhdIGxlYWRpbmctc251ZyBweC0zIG10LTEgbGluZS1jbGFtcC0yXCI+XG4gICAgICAgICAgICAgICAge3Qoc3RlcC5zdWJLZXkpfVxuICAgICAgICAgICAgPC9wPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICApO1xufVxuXG5mdW5jdGlvbiBUaWxlSWNvbih7IGtpbmQsIGNvbG9yLCBzaXplID0gMjIgfSkge1xuICAgIC8qIHNpbXBsZSBpbmxpbmUgU1ZHcyBzbyB3ZSBrZWVwIHRoZSBmaWxlIHNlbGYtY29udGFpbmVkLiAgYHNpemVgXG4gICAgICAgcHJvcCBsZXRzIHRoZSBwZW50YWdvbiBDaXJjbGVUaWxlIHJlcXVlc3QgYSAyw5cgaWNvbiAoNDQgcHgpIHdoaWxlXG4gICAgICAga2VlcGluZyB0aGUgb2xkZXIgZ3JpZCBUaWxlIGF0IHRoZSBvcmlnaW5hbCAyMiBweC4gKi9cbiAgICBjb25zdCBzdHJva2UgPSB7IHN0cm9rZTpjb2xvciwgZmlsbDonbm9uZScsIHN0cm9rZVdpZHRoOjIsIHN0cm9rZUxpbmVjYXA6J3JvdW5kJywgc3Ryb2tlTGluZWpvaW46J3JvdW5kJyB9O1xuICAgIGlmIChraW5kID09PSAncHN5JykgICAgICByZXR1cm4gPHN2ZyB3aWR0aD17c2l6ZX0gaGVpZ2h0PXtzaXplfSB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgey4uLnN0cm9rZX0+PHBhdGggZD1cIk0zIDN2MThoMThcIi8+PHBhdGggZD1cIk0zIDE3YzQtMSA3LTYgOS05czUtMyA5LTJcIi8+PC9zdmc+O1xuICAgIGlmIChraW5kID09PSAnbG9jYXRpb24nKSByZXR1cm4gPHN2ZyB3aWR0aD17c2l6ZX0gaGVpZ2h0PXtzaXplfSB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgey4uLnN0cm9rZX0+PHBhdGggZD1cIk0xMiAyMnMtNy02LjQtNy0xMmE3IDcgMCAxIDEgMTQgMGMwIDUuNi03IDEyLTcgMTJ6XCIvPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTBcIiByPVwiMi41XCIvPjwvc3ZnPjtcbiAgICBpZiAoa2luZCA9PT0gJ2xhbmd1YWdlJykgcmV0dXJuIDxzdmcgd2lkdGg9e3NpemV9IGhlaWdodD17c2l6ZX0gdmlld0JveD1cIjAgMCAyNCAyNFwiIHsuLi5zdHJva2V9PjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiOVwiLz48cGF0aCBkPVwiTTMgMTJoMThNMTIgM2ExNCAxNCAwIDAgMSAwIDE4TTEyIDNhMTQgMTQgMCAwIDAgMCAxOFwiLz48L3N2Zz47XG4gICAgaWYgKGtpbmQgPT09ICdwbHVnaW5zJykgIHJldHVybiA8c3ZnIHdpZHRoPXtzaXplfSBoZWlnaHQ9e3NpemV9IHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB7Li4uc3Ryb2tlfT48cGF0aCBkPVwiTTkgM3Y2TTE1IDN2NlwiLz48cGF0aCBkPVwiTTUgOWgxNHY2YTQgNCAwIDAgMS00IDRoLTF2M005IDE5djNcIi8+PC9zdmc+O1xuICAgIC8qIFVwZGF0ZSAmIFJlcGFpciAtLSB3cmVuY2ggKyB0aW55IGdlYXIgYnVtcCwgc2lnbmFsbGluZyBcInRvb2xzXCIgKi9cbiAgICBpZiAoa2luZCA9PT0gJ3JlcGFpcicpICAgcmV0dXJuIDxzdmcgd2lkdGg9e3NpemV9IGhlaWdodD17c2l6ZX0gdmlld0JveD1cIjAgMCAyNCAyNFwiIHsuLi5zdHJva2V9PjxwYXRoIGQ9XCJNMTQuNyA2LjNhNCA0IDAgMCAwLTUuNCA1LjRMMyAxOGwzIDMgNi4zLTYuM2E0IDQgMCAwIDAgNS40LTUuNGwtMi44IDIuOEwxMyAxMWwtMS4xLTEuOSAyLjgtMi44elwiLz48L3N2Zz47XG4gICAgcmV0dXJuIG51bGw7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFBzeSBDaGFydCBTZXR0aW5nIC0tIEZVTEwgUEFHRSwgbGl2ZSBza2VsZXRvbiByZXNwb25kcyB0byBjb250cm9sc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuZnVuY3Rpb24gUHN5Q2hhcnRTZXR0aW5nUGFnZSh7IGNmZywgc2V0Q2ZnLCBvbkJhY2ssIG9uU2F2ZSB9KSB7XG4gICAgY29uc3QgdXBkYXRlID0gKGssIHYpID0+IHNldENmZyhjID0+ICh7Li4uYywgW2tdOnZ9KSk7XG5cbiAgICAvKiBPbiBtb3VudDogaHlkcmF0ZSBmcm9tIHRoZSBTQU1FIGxvY2FsU3RvcmFnZSBrZXkgdGhlIGRhc2hib2FyZCByZWFkc1xuICAgICAqIChgcmVkNV9zd2VldF9zcG90X3JhbmdlYCkgcGx1cyB0aGUgcHJlc2V0IGlkIChgcmVkNV9yaF9wcmVzZXRgKSBzb1xuICAgICAqIHRoZSBkcm9wZG93biBsYWJlbCBzdGF5cyBjb25zaXN0ZW50IHdpdGggdGhlIHNsaWRlciB2YWx1ZXMgYWNyb3NzXG4gICAgICogcmVsb2Fkcy4gIElmIHRoZSBvcGVyYXRvciBoYXMgYWxyZWFkeSB0dW5lZCB0aGUgUkggYmFuZCBvbiB0aGVcbiAgICAgKiBkYXNoYm9hcmQsIHRoZSBzZXR1cCB3YWxrIHN0YXJ0cyBmcm9tIHRob3NlIHZhbHVlcy4gKi9cbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmF3ICAgID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlZDVfc3dlZXRfc3BvdF9yYW5nZScpO1xuICAgICAgICAgICAgY29uc3QgcHJlc2V0ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlZDVfcmhfcHJlc2V0Jyk7XG4gICAgICAgICAgICBjb25zdCBwYXRjaCAgPSB7fTtcbiAgICAgICAgICAgIGlmIChyYXcpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwID0gSlNPTi5wYXJzZShyYXcpO1xuICAgICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUocC5sbykgJiYgTnVtYmVyLmlzRmluaXRlKHAuaGkpICYmIHAubG8gPCBwLmhpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhdGNoLnJoTG8gPSBwLmxvO1xuICAgICAgICAgICAgICAgICAgICBwYXRjaC5yaEhpID0gcC5oaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJlc2V0ICYmIFJIX1BSRVNFVFMuZmluZCh4ID0+IHguaWQgPT09IHByZXNldCkpIHtcbiAgICAgICAgICAgICAgICBwYXRjaC5yaFByZXNldCA9IHByZXNldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIFRoZW1lICsgYnJpZ2h0bmVzcyDigJQgc2FtZSBrZXlzIGFwcC5qcyAoZGFzaGJvYXJkKSByZWFkcy4gKi9cbiAgICAgICAgICAgIGNvbnN0IHRoID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlZDUudGhlbWUnKTtcbiAgICAgICAgICAgIGlmICh0aCA9PT0gJ2xpZ2h0JyB8fCB0aCA9PT0gJ2RhcmsnKSBwYXRjaC50aGVtZSA9IHRoO1xuICAgICAgICAgICAgY29uc3QgZGwgPSBwYXJzZUZsb2F0KGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWQ1LmRhcmtMZXZlbCcpKTtcbiAgICAgICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUoZGwpICYmIGRsID49IDEuNSAmJiBkbCA8PSAzLjApIHBhdGNoLmRhcmtMZXZlbCA9IGRsO1xuICAgICAgICAgICAgLyogVGVtcGVyYXR1cmUgYXhpcyByYW5nZSDigJQgd3JpdHRlbiBieSB0aGlzIHNhbWUgcGFnZSdzIHNhdmVcbiAgICAgICAgICAgICAqIGhhbmRsZXI7IGxvYWQgaXQgaGVyZSBzbyByZW9wZW5pbmcgdGhlIHNldHVwIHdhbGsgc2hvd3MgdGhlXG4gICAgICAgICAgICAgKiBjdXJyZW50IGRhc2hib2FyZCBheGlzIGluc3RlYWQgb2YgYWx3YXlzIGRlZmF1bHRpbmcgdG8gLTE1Li41MC4gKi9cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdHJSYXcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVkNV90ZW1wX3JhbmdlJyk7XG4gICAgICAgICAgICAgICAgaWYgKHRyUmF3KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRyID0gSlNPTi5wYXJzZSh0clJhdyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUodHIubWluKSAmJiBOdW1iZXIuaXNGaW5pdGUodHIubWF4KSAmJiB0ci5taW4gPCB0ci5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGNoLnRMbyA9IHRyLm1pbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGNoLnRIaSA9IHRyLm1heDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogaWdub3JlICovIH1cbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhwYXRjaCkubGVuZ3RoKSBzZXRDZmcoYyA9PiAoey4uLmMsIC4uLnBhdGNofSkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IC8qIGlnbm9yZSAqLyB9XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xuICAgIH0sIFtdKTtcblxuICAgIC8qIE9uIHNhdmU6IHBlcnNpc3QgdGhlIFJIIGJhbmQgdG8gbG9jYWxTdG9yYWdlIHNvIHRoZSBkYXNoYm9hcmQnc1xuICAgICAqIHN3ZWV0LXNwb3QgcG9seWdvbiBwaWNrcyBpdCB1cCBvbiBuZXh0IGxvYWQuICBBbHNvIHBlcnNpc3QgdGhlIHZlbnVlXG4gICAgICogcHJlc2V0IGlkIChmb3IgZnV0dXJlIFwic2hvdyBwcmVzZXQgbmFtZSBvbiBkYXNoYm9hcmRcIiBmZWF0dXJlcykuICovXG4gICAgY29uc3QgcGVyc2lzdEFuZFNhdmUgPSAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNV9zd2VldF9zcG90X3JhbmdlJyxcbiAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh7IGxvOiBjZmcucmhMbywgaGk6IGNmZy5yaEhpIH0pKTtcbiAgICAgICAgICAgIGlmIChjZmcucmhQcmVzZXQpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNV9yaF9wcmVzZXQnLCBjZmcucmhQcmVzZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogVGhlbWUgKyBicmlnaHRuZXNzIOKAlCB3cml0dGVuIHRvIHRoZSBTQU1FIGtleXMgdGhlIGRhc2hib2FyZFxuICAgICAgICAgICAgICogKGFwcC5qcyBsaW5lcyA1Ny01OCBhbmQgODQtOTcpIHJlYWRzIGFzIGl0cyB1c2VTdGF0ZSBsYXp5XG4gICAgICAgICAgICAgKiBpbml0aWFsaXNlciwgc28gdGhlIGNob3NlbiB0aGVtZSB0YWtlcyBlZmZlY3Qgb24gbmV4dCBkYXNoYm9hcmRcbiAgICAgICAgICAgICAqIGxvYWQuICBhcHAuanMgdHJlYXRzIGRhcmtMZXZlbCA+PSAzLjAgYXMgbGlnaHQtbW9kZSB0cmlnZ2VyLiAqL1xuICAgICAgICAgICAgaWYgKGNmZy50aGVtZSA9PT0gJ2xpZ2h0JyB8fCBjZmcudGhlbWUgPT09ICdkYXJrJykge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1LnRoZW1lJywgY2ZnLnRoZW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUoY2ZnLmRhcmtMZXZlbCkpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS5kYXJrTGV2ZWwnLCBTdHJpbmcoY2ZnLmRhcmtMZXZlbCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogVGVtcGVyYXR1cmUgYXhpcyByYW5nZSDigJQgZHJpdmVzIHRoZSBkYXNoYm9hcmQncyBwc3kgY2hhcnRcbiAgICAgICAgICAgICAqIFggYXhpcyAoYHRlbXBSYW5nZS5taW4vbWF4YCBpbiBhcHAuanMpLiAgV2Ugd3JpdGUgdGhlIHNhbWVcbiAgICAgICAgICAgICAqIHNoYXBlIGFwcC5qcyByZWFkcyAoYHttaW4sIG1heH1gKSBzbyBpdHMgbGF6eSB1c2VTdGF0ZSBpbml0XG4gICAgICAgICAgICAgKiBwaWNrcyBpdCB1cCBvbiBuZXh0IGxvYWQsIEFORCBkaXNwYXRjaCBhIGN1c3RvbSBldmVudCBzb1xuICAgICAgICAgICAgICogYW55IG9wZW4gZGFzaGJvYXJkIHRhYiB1cGRhdGVzIGxpdmUgd2l0aG91dCBhIHJlZnJlc2guICovXG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGNmZy50TG8pICYmIE51bWJlci5pc0Zpbml0ZShjZmcudEhpKSAmJiBjZmcudExvIDwgY2ZnLnRIaSkge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1X3RlbXBfcmFuZ2UnLFxuICAgICAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh7IG1pbjogY2ZnLnRMbywgbWF4OiBjZmcudEhpIH0pKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3I1LXRlbXAtcmFuZ2UtY2hhbmdlJywge1xuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHsgbWluOiBjZmcudExvLCBtYXg6IGNmZy50SGkgfVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncjUtcmgtYmFuZC1jaGFuZ2UnLCB7XG4gICAgICAgICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICAgICAgICAgIGxvOiBjZmcucmhMbyxcbiAgICAgICAgICAgICAgICAgICAgaGk6IGNmZy5yaEhpLFxuICAgICAgICAgICAgICAgICAgICBwcmVzZXQ6IGNmZy5yaFByZXNldCB8fCAnY3VzdG9tJyxcbiAgICAgICAgICAgICAgICAgICAgYXBwbHlUb0FsbEFodXM6IHRydWUsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdbc2V0dXAgd2Fsa10gcHN5IGNoYXJ0IHNhdmVkIC0+IFJIJywgY2ZnLnJoTG8sICctJywgY2ZnLnJoSGksXG4gICAgICAgICAgICAgICAgICAgICAgICAgJyUgVC1heGlzJywgY2ZnLnRMbywgJy4uJywgY2ZnLnRIaSwgJ8KwQyBwcmVzZXQ9JywgY2ZnLnJoUHJlc2V0KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdbc2V0dXAgd2Fsa10gY291bGQgbm90IHBlcnNpc3QgcHN5IHNldHRpbmdzOicsIGUpO1xuICAgICAgICB9XG4gICAgICAgIG9uU2F2ZSgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1pbi1oLXNjcmVlbiBmbGV4IGZsZXgtY29sXCI+XG4gICAgICAgICAgICB7LyogaGVhZGVyICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcHgtNiBweS00IGJvcmRlci1iIGJvcmRlci1zbGF0ZS04MDBcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQmFja31cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNDAwIGhvdmVyOnRleHQtd2hpdGUgdGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2tcIj5cbiAgICAgICAgICAgICAgICAgICAge3QoJ3N3X2JhY2tfdG9fc2V0dXAnKX1cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwidGV4dC1zbSB1cHBlcmNhc2UgdHJhY2tpbmctWzAuM2VtXSBmb250LWJsYWNrIHRleHQtaW5kaWdvLTQwMFwiPnt0KCdzd19wc3lfY2hhcnRfc2V0dGluZycpfTwvaDE+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtwZXJzaXN0QW5kU2F2ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTUgcHktMiByb3VuZGVkLWxnIGJnLWluZGlnby02MDAgaG92ZXI6YmctaW5kaWdvLTUwMCB0ZXh0LXdoaXRlIHRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrXCI+XG4gICAgICAgICAgICAgICAgICAgIHt0KCdzd19zYXZlX3JldHVybicpfVxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBib2R5IOKAlCBjaGFydCBsZWZ0LCBjb250cm9scyByaWdodCAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xIGdyaWQgZ3JpZC1jb2xzLTEgbGc6Z3JpZC1jb2xzLVsxZnJfMzYwcHhdIGdhcC00IHAtNiBtYXgtdy03eGwgbXgtYXV0byB3LWZ1bGxcIj5cbiAgICAgICAgICAgICAgICA8UHN5U2tlbGV0b24gY2ZnPXtjZmd9IC8+XG4gICAgICAgICAgICAgICAgPFBzeUNvbnRyb2xQYW5lbCBjZmc9e2NmZ30gdXBkYXRlPXt1cGRhdGV9IHNldENmZz17c2V0Q2ZnfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbi8qIFJIIGJhbmQgcHJlc2V0cyDigJQgcmVjb2duaXNlZCBpbmR1c3RyeSBzdGFuZGFyZHMgZm9yIGVhY2ggdmVudWUgdHlwZS5cbiAqIFNvdXJjZXM6IEFTSFJBRSA1NSAoY29tZm9ydCksIEFTSFJBRSAxNzAgKGhlYWx0aGNhcmUpLFxuICogQUFNL05QUy9TbWl0aHNvbmlhbiBndWlkYW5jZSAoY29sbGVjdGlvbnMpLCBDSUJTRSBUTTQwIChsaWJyYXJpZXMpLiAqL1xuY29uc3QgUkhfUFJFU0VUUyA9IFtcbiAgICB7IGlkOidjdXN0b20nLCAgICAgICAgICBsYWJlbDonQ3VzdG9tIChtYW51YWwpJywgICAgICAgICAgICAgICAgIGxvOm51bGwsIGhpOm51bGwsIG5vdGU6JycgfSxcbiAgICB7IGlkOidvZmZpY2UnLCAgICAgICAgICBsYWJlbDonT2ZmaWNlJywgICAgICAgICAgICAgICAgICAgICAgICAgIGxvOjMwLCAgIGhpOjYwLCAgIG5vdGU6J0FTSFJBRSA1NSBjb21mb3J0JyAgICAgICAgICAgICAgICAgIH0sXG4gICAgeyBpZDonbXVzZXVtJywgICAgICAgICAgbGFiZWw6J011c2V1bScsICAgICAgICAgICAgICAgICAgICAgICAgICBsbzo0MCwgICBoaTo1NSwgICBub3RlOidBQU0gY29sbGVjdGlvbiBwcmVzZXJ2YXRpb24nICAgICAgICB9LFxuICAgIHsgaWQ6J2hvdGVsJywgICAgICAgICAgIGxhYmVsOidIb3RlbCBndWVzdCByb29tJywgICAgICAgICAgICAgICAgbG86MzAsICAgaGk6NjAsICAgbm90ZTonZ2VuZXJhbCBvY2N1cGFudCBjb21mb3J0JyAgICAgICAgICAgfSxcbiAgICB7IGlkOidsaWJyYXJ5JywgICAgICAgICBsYWJlbDonTGlicmFyeSAvIEFyY2hpdmUnLCAgICAgICAgICAgICAgIGxvOjQwLCAgIGhpOjU1LCAgIG5vdGU6J3BhcGVyICYgYmluZGluZyBwcmVzZXJ2YXRpb24nICAgICAgIH0sXG4gICAgeyBpZDonaG9zcGl0YWwnLCAgICAgICAgbGFiZWw6J0hvc3BpdGFsIChnZW5lcmFsKScsICAgICAgICAgICAgICBsbzozMCwgICBoaTo2MCwgICBub3RlOidBU0hSQUUgMTcwIHBhdGllbnQgYXJlYXMnICAgICAgICAgICB9LFxuICAgIHsgaWQ6J2xlY3R1cmUnLCAgICAgICAgIGxhYmVsOidMZWN0dXJlIGhhbGwnLCAgICAgICAgICAgICAgICAgICAgbG86MzAsICAgaGk6NjAsICAgbm90ZTonaGlnaCBvY2N1cGFuY3kgY29tZm9ydCcgICAgICAgICAgICAgfSxcbiAgICB7IGlkOidjb25jZXJ0JywgICAgICAgICBsYWJlbDonQ29uY2VydCBoYWxsJywgICAgICAgICAgICAgICAgICAgIGxvOjQwLCAgIGhpOjU1LCAgIG5vdGU6J2luc3RydW1lbnQgdHVuaW5nIHN0YWJpbGl0eScgICAgICAgIH0sXG4gICAgeyBpZDonbWVldGluZycsICAgICAgICAgbGFiZWw6J01lZXRpbmcgcm9vbScsICAgICAgICAgICAgICAgICAgICBsbzozMCwgICBoaTo2MCwgICBub3RlOidzbWFsbCBncm91cCBjb21mb3J0JyAgICAgICAgICAgICAgICB9LFxuICAgIHsgaWQ6J2V4aGliaXRpb24nLCAgICAgIGxhYmVsOidFeGhpYml0aW9uIGhhbGwnLCAgICAgICAgICAgICAgICAgbG86NDAsICAgaGk6NTUsICAgbm90ZTonbWl4ZWQgYXJ0IC8gYXJ0aWZhY3QgZGlzcGxheScgICAgICAgfSxcbl07XG5cbi8qIFJlYWwgcHN5IGNoYXJ0IOKAlCB1c2VzIHRoZSBTQU1FIGdldFcgKyBHSVZPTklfQ09MT1JTICsgcG9seWdvbiBtYXRoIGFzIHRoZVxuICogcHJvZHVjdGlvbiBkYXNoYm9hcmQuICBTb3VyY2Ugb2YgdHJ1dGg6ICBqcy9wc3ljaHJvbWV0cmljLmpzICBhbmQgdGhlXG4gKiByZW5kZXJHaXZvbmlPdmVybGF5KCkgYmxvY2sgYXQgYXBwLmpzOjE2NDEtMTcyMi5cbiAqIEFueXRoaW5nIHlvdSBjaGFuZ2UgaW4gdGhvc2UgZmlsZXMgTVVTVCBiZSBtaXJyb3JlZCBoZXJlLiAqL1xuZnVuY3Rpb24gUHN5U2tlbGV0b24oeyBjZmcgfSkge1xuICAgIC8qIENhbnZhcyArIHBhZGRpbmcgKi9cbiAgICBjb25zdCBXID0gNzYwLCBIID0gNDgwO1xuICAgIGNvbnN0IHBhZCA9IHsgbGVmdDogNTYsIHJpZ2h0OiA0MCwgdG9wOiAyOCwgYm90dG9tOiA1NiB9O1xuICAgIGNvbnN0IGdyaWRXID0gVyAtIHBhZC5sZWZ0IC0gcGFkLnJpZ2h0O1xuICAgIGNvbnN0IGdyaWRIID0gSCAtIHBhZC50b3AgIC0gcGFkLmJvdHRvbTtcblxuICAgIGNvbnN0IFRfTUlOID0gY2ZnLnRMbywgVF9NQVggPSBjZmcudEhpO1xuICAgIGNvbnN0IFdfTUlOID0gMCwgICAgICAgV19NQVggPSAwLjAzMDsgICAgICAgICAgLy8ga2cva2dcblxuICAgIC8qIGF4aXMgc2NhbGVzIC0tIG1hdGNoIHRoZSBsaXZlIGRhc2hib2FyZCAqL1xuICAgIGNvbnN0IHggID0gKHQpID0+IHBhZC5sZWZ0ICsgKCh0IC0gVF9NSU4pIC8gKFRfTUFYIC0gVF9NSU4pKSAqIGdyaWRXO1xuICAgIGNvbnN0IHkgID0gKHcpID0+IHBhZC50b3AgICsgKDEgLSAodyAtIFdfTUlOKSAvIChXX01BWCAtIFdfTUlOKSkgKiBncmlkSDtcbiAgICBjb25zdCBfZ2V0VyA9ICh0eXBlb2YgZ2V0VyA9PT0gJ2Z1bmN0aW9uJykgPyBnZXRXIDogKCh0LCByaCkgPT4gMCk7XG5cbiAgICBjb25zdCBzYWZlUHRzID0gKGFycikgPT4gYXJyLm1hcChwID0+IGAkeyh4KHBbMF0pfHwwKS50b0ZpeGVkKDIpfSwkeyh5KHBbMV0pfHwwKS50b0ZpeGVkKDIpfWApLmpvaW4oJyAnKTtcblxuICAgIC8qIC0tLS0gR2l2b25pIHBvbHlnb25zIC0tIENPUElFRCBWRVJCQVRJTSBmcm9tIGFwcC5qczoxNjQzLTE2NjkgLS0tLSAqL1xuICAgIGNvbnN0IHJoODAgPSBbXTsgZm9yIChsZXQgdD0yMDsgdDw9MjU7IHQrPTAuNSkgcmg4MC5wdXNoKFt0LCBfZ2V0Vyh0LCA4MCldKTtcbiAgICBjb25zdCByaDEwMD0gW107IGZvciAobGV0IHQ9MjA7IHQ8PTI3OyB0Kz0wLjUpIHJoMTAwLnB1c2goW3QsIF9nZXRXKHQsIDEwMCldKTtcbiAgICBjb25zdCByaDIwTGluZSA9IFtdOyBmb3IgKGxldCB0PTMyOyB0Pj0yMDsgdC09MC41KSByaDIwTGluZS5wdXNoKFt0LCBfZ2V0Vyh0LCAyMCldKTtcbiAgICBjb25zdCByaDIwX0NaICA9IFtdOyBmb3IgKGxldCB0PTI3OyB0Pj0yMDsgdC09MC41KSByaDIwX0NaLnB1c2goW3QsIF9nZXRXKHQsIDIwKV0pO1xuICAgIGNvbnN0IENaICAgPSBbLi4ucmg4MCwgWzI3LCBfZ2V0VygyNywgNTApXSwgWzI3LCBfZ2V0VygyNywgMjApXSwgLi4ucmgyMF9DWl07XG5cbiAgICBjb25zdCByaEhpX3RvcCA9IFtdOyBmb3IgKGxldCB0dD0yMDsgdHQ8PTI3OyB0dCs9MC41KSByaEhpX3RvcC5wdXNoKFt0dCwgX2dldFcodHQsIGNmZy5yaEhpKV0pO1xuICAgIGNvbnN0IHJoTG9fYm90ID0gW107IGZvciAobGV0IHR0PTI3OyB0dD49MjA7IHR0LT0wLjUpIHJoTG9fYm90LnB1c2goW3R0LCBfZ2V0Vyh0dCwgY2ZnLnJoTG8pXSk7XG4gICAgY29uc3QgU1dFRVQgPSBbLi4ucmhIaV90b3AsIC4uLnJoTG9fYm90XTtcblxuICAgIGNvbnN0IE5WICAgPSBbLi4ucmgxMDAsIFszMiwgMTUuNC8xMDAwXSwgWzMyLCA2LjIvMTAwMF0sIC4uLnJoMjBMaW5lXTtcbiAgICBjb25zdCBNYXNzID0gWy4uLnJoODAsIFszMywgMTYvMTAwMF0sIFszNywgX2dldFcoMzcsIDMwKV0sIFszNywgMy8xMDAwXSwgWzIwLCBfZ2V0VygyMCwgMjApXV07XG4gICAgY29uc3QgTUNWICA9IFsuLi5yaDgwLCBbNDAsIDE2LzEwMDBdLCBbNDQsIF9nZXRXKDQ0LCAyMCldLCBbNDQsIDMvMTAwMF0sIFsyMCwgX2dldFcoMjAsIDIwKV1dO1xuICAgIGNvbnN0IEVWQVAgPSBbLi4ucmg4MCwgWzI1LCAxNi8xMDAwXSwgWzM2LCBfZ2V0VygzNiwgMzApXSwgWzM5LCBfZ2V0VygzOSwgMjApXSxcbiAgICAgICAgICAgICAgICAgIFs0MSwgX2dldFcoNDEsIDEwKV0sIFs0MSwgMF0sIFsyNy4yLCAwXSwgWzIwLCBfZ2V0VygyMCwgMjApXV07XG5cbiAgICBjb25zdCB3aW50ZXJSSDgwID0gW107IGZvciAobGV0IHQ9MTg7IHQ8PTE5LjU7IHQrPTAuNSkgd2ludGVyUkg4MC5wdXNoKFt0LCBfZ2V0Vyh0LCA4MCldKTtcbiAgICBjb25zdCB3aW50ZXJSSDIwID0gW107IGZvciAobGV0IHQ9MTkuNTsgdD49MTg7IHQtPTAuNSkgd2ludGVyUkgyMC5wdXNoKFt0LCBfZ2V0Vyh0LCAyMCldKTtcbiAgICBjb25zdCBXSU5URVIgPSBbLi4ud2ludGVyUkg4MCwgLi4ud2ludGVyUkgyMF07XG5cbiAgICAvKiBSSCBpc29wbGV0aCBjdXJ2ZXMgZm9yIHRoZSBjaGFydCBncmlkICovXG4gICAgY29uc3QgaXNvcGxldGhzID0gWzIwLCA0MCwgNjAsIDgwLCAxMDBdO1xuXG4gICAgLyogVGhlbWUgcGFsZXR0ZSDigJQgZHJpdmVzIHRoZSBsaXZlIHByZXZpZXcgc28gdGhlIGRpbS9saWdodCBjb250cm9sc1xuICAgICAqIGhhdmUgdmlzaWJsZSBmZWVkYmFjayByaWdodCBvbiB0aGUgY2hhcnQuICBJbiBkaW0vZGFyayBtb2RlIHdlIGFsc29cbiAgICAgKiBhcHBseSBhIENTUyBicmlnaHRuZXNzIGZpbHRlciBtYXBwZWQgZnJvbSBjZmcuZGFya0xldmVsICgxLjUgLi4gMi44XG4gICAgICog4oaSIDAuNiAuLiAxLjQpIHNvIHRoZSB1c2VyIGNhbiBTRUUgdGhlIGJyaWdodG5lc3Mgc2xpZGVyIHdvcmtpbmcuICovXG4gICAgY29uc3QgaXNMaWdodCA9IGNmZy50aGVtZSA9PT0gJ2xpZ2h0JztcbiAgICBjb25zdCBwYWxldHRlID0gaXNMaWdodFxuICAgICAgICA/IHsgYmc6JyNmOGZhZmMnLCBncmlkOicjY2JkNWUxJywgdGljazonIzQ3NTU2OScsIGF4aXM6JyMxZTI5M2InLFxuICAgICAgICAgICAgcGFuZWxCZzoncmdiYSgyNDgsMjUwLDI1MiwwLjg1KScsIHBhbmVsQm9yZGVyOicjY2JkNWUxJyxcbiAgICAgICAgICAgIHBpbGxCZzonI2UyZThmMCcsIHBpbGxGZzonIzQ3NTU2OScsIG1ldGFGZzonIzY0NzQ4YicgfVxuICAgICAgICA6IHsgYmc6JyMwYjEyMjAnLCBncmlkOicjMWUyOTNiJywgdGljazonIzk0YTNiOCcsIGF4aXM6JyNjYmQ1ZTEnLFxuICAgICAgICAgICAgcGFuZWxCZzoncmdiYSgxNSwyMyw0MiwwLjYpJywgcGFuZWxCb3JkZXI6JyMxZTI5M2InLFxuICAgICAgICAgICAgcGlsbEJnOicjMWUyOTNiJywgcGlsbEZnOicjOTRhM2I4JywgbWV0YUZnOicjNjQ3NDhiJyB9O1xuICAgIGNvbnN0IGRpbUZpbHRlciA9IGlzTGlnaHRcbiAgICAgICAgPyAnbm9uZSdcbiAgICAgICAgOiBgYnJpZ2h0bmVzcygkeyhNYXRoLm1heCgxLjUsIE1hdGgubWluKDIuOCwgY2ZnLmRhcmtMZXZlbCB8fCAyLjApKSAvIDIuMCkudG9GaXhlZCgyKX0pYDtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm91bmRlZC0yeGwgcC00IGJvcmRlciB0cmFuc2l0aW9uLWNvbG9ycyBkdXJhdGlvbi0zMDBcIlxuICAgICAgICAgICAgIHN0eWxlPXt7YmFja2dyb3VuZDogcGFsZXR0ZS5wYW5lbEJnLCBib3JkZXJDb2xvcjogcGFsZXR0ZS5wYW5lbEJvcmRlcn19PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gbWItM1wiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInBpbGxcIiBzdHlsZT17e2JhY2tncm91bmQ6cGFsZXR0ZS5waWxsQmcsIGNvbG9yOnBhbGV0dGUucGlsbEZnfX0+UFNZQ0hST01FVFJJQyBDSEFSVCDCtyBsaXZlIHByZXZpZXc8L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1tb25vXCIgc3R5bGU9e3tjb2xvcjpwYWxldHRlLm1ldGFGZ319PntUX01JTn3CsEMg4oaSIHtUX01BWH3CsEMgIMK3ICB7Y2ZnLnJoTG994oCTe2NmZy5yaEhpfSUgUkg8L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxzdmcgdmlld0JveD17YDAgMCAke1d9ICR7SH1gfSBjbGFzc05hbWU9XCJ3LWZ1bGwgaC1hdXRvIHRyYW5zaXRpb24tW2ZpbHRlcl0gZHVyYXRpb24tMzAwXCJcbiAgICAgICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOiBwYWxldHRlLmJnLCBib3JkZXJSYWRpdXM6OCwgZmlsdGVyOiBkaW1GaWx0ZXJ9fT5cbiAgICAgICAgICAgICAgICB7LyogLS0tLSBncmlkOiB2ZXJ0aWNhbCBUIGxpbmVzLCBob3Jpem9udGFsIFcgbGluZXMgLS0tLSAqL31cbiAgICAgICAgICAgICAgICB7QXJyYXkuZnJvbSh7bGVuZ3RoOjExfSkubWFwKChfLGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdCA9IFRfTUlOICsgKGkvMTApICogKFRfTUFYIC0gVF9NSU4pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGcga2V5PXsndnQnK2l9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXt4KHQpfSB5MT17cGFkLnRvcH0geDI9e3godCl9IHkyPXtwYWQudG9wK2dyaWRIfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT17cGFsZXR0ZS5ncmlkfSBzdHJva2VXaWR0aD1cIjAuNlwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KHQpfSB5PXtwYWQudG9wK2dyaWRIKzE2fSBmb250U2l6ZT1cIjkuNVwiIGZpbGw9e3BhbGV0dGUudGlja31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCI+e3QudG9GaXhlZCgwKX08L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAge0FycmF5LmZyb20oe2xlbmd0aDo3fSkubWFwKChfLGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdyA9IFdfTUlOICsgKGkvNikgKiAoV19NQVggLSBXX01JTik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZyBrZXk9eydodycraX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3BhZC5sZWZ0fSB5MT17eSh3KX0geDI9e3BhZC5sZWZ0K2dyaWRXfSB5Mj17eSh3KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9e3BhbGV0dGUuZ3JpZH0gc3Ryb2tlV2lkdGg9XCIwLjZcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17cGFkLmxlZnQtOH0geT17eSh3KSszfSBmb250U2l6ZT1cIjkuNVwiIGZpbGw9e3BhbGV0dGUudGlja31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwiZW5kXCI+eyh3KjEwMDApLnRvRml4ZWQoMCl9PC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIHsvKiAtLS0tIFJIIGlzb3BsZXRocyAoY3VydmVzKSAtLS0tICovfVxuICAgICAgICAgICAgICAgIHtpc29wbGV0aHMubWFwKHJoID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHRzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHQgPSBUX01JTjsgdCA8PSBUX01BWDsgdCArPSAwLjUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHd3ID0gX2dldFcodCwgcmgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHd3ID49IFdfTUlOICYmIHd3IDw9IFdfTUFYKSBwdHMucHVzaChbdCwgd3ddKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGcga2V5PXsnaXNvJytyaH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlsaW5lIHBvaW50cz17c2FmZVB0cyhwdHMpfSBmaWxsPVwibm9uZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT17cmggPT09IDEwMCA/ICcjNjM2NmYxJyA6ICcjZWM0ODk5NTUnfSBzdHJva2VXaWR0aD1cIjAuOFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZURhc2hhcnJheT17cmggPT09IDEwMCA/ICcnIDogJzMsMyd9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cHRzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KHB0c1tNYXRoLmZsb29yKHB0cy5sZW5ndGgqMC42NSldWzBdKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeT17eShwdHNbTWF0aC5mbG9vcihwdHMubGVuZ3RoKjAuNjUpXVsxXSkgLSA0fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZT1cIjlcIiBmaWxsPVwiI2VjNDg5OTk5XCIgZm9udFdlaWdodD1cIjcwMFwiPntyaH0lPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG5cbiAgICAgICAgICAgICAgICB7LyogLS0tLSBHaXZvbmkgb3ZlcmxheSAoY29waWVkIHZlcmJhdGltIGZyb20gYXBwLmpzIHJlbmRlciBvcmRlcikgLS0tLSAqL31cbiAgICAgICAgICAgICAgICB7Y2ZnLmdpdm9uaSAmJiAoXG4gICAgICAgICAgICAgICAgICAgIDxnIGNsYXNzTmFtZT1cInBvaW50ZXItZXZlbnRzLW5vbmVcIiBvcGFjaXR5PVwiMC45XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17eCg0MCl9IHkxPXt5KDE2LzEwMDApfSB4Mj17eCg1MCl9IHkyPXt5KDE2LzEwMDApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiIzYzNjZmMVwiIHN0cm9rZVdpZHRoPVwiMS41XCIgc3Ryb2tlRGFzaGFycmF5PVwiNCw0XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3goNTApfSB5MT17eSgxNi8xMDAwKX0geDI9e3goNTApfSB5Mj17eSgwKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cIiM2MzY2ZjFcIiBzdHJva2VXaWR0aD1cIjEuNVwiIHN0cm9rZURhc2hhcnJheT1cIjQsNFwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXt4KDQxKX0geTE9e3koMCl9IHgyPXt4KDUwKX0geTI9e3koMCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCIjNjM2NmYxXCIgc3Ryb2tlV2lkdGg9XCIxLjVcIiBzdHJva2VEYXNoYXJyYXk9XCI0LDRcIi8+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhNQ1YpfSAgZmlsbD1cIiNlYzQ4OTlcIiBmaWxsT3BhY2l0eT1cIjAuMDVcIiBzdHJva2U9XCIjZWM0ODk5XCIgc3Ryb2tlV2lkdGg9XCIxXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKE1hc3MpfSBmaWxsPVwiIzhiNWNmNlwiIGZpbGxPcGFjaXR5PVwiMC4wNVwiIHN0cm9rZT1cIiM4YjVjZjZcIiBzdHJva2VXaWR0aD1cIjFcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoRVZBUCl9IGZpbGw9XCIjMDZiNmQ0XCIgZmlsbE9wYWNpdHk9XCIwLjA4XCIgc3Ryb2tlPVwiIzA2YjZkNFwiIHN0cm9rZVdpZHRoPVwiMVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhOVil9ICAgZmlsbD1cIiNmNTllMGJcIiBmaWxsT3BhY2l0eT1cIjAuMDVcIiBzdHJva2U9XCIjZjU5ZTBiXCIgc3Ryb2tlV2lkdGg9XCIxXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKENaKX0gICBmaWxsPVwiIzEwYjk4MVwiIGZpbGxPcGFjaXR5PVwiMC4xNVwiIHN0cm9rZT1cIiMxMGI5ODFcIiBzdHJva2VXaWR0aD1cIjEuMlwiLz5cblxuICAgICAgICAgICAgICAgICAgICAgICAgey8qIFN3ZWV0LXNwb3QgYmFuZCwgY2xpcHBlZCB0byBDWiAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkZWZzPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjbGlwUGF0aCBpZD1cImN6LWNsaXAtd2Fsa1wiIGNsaXBQYXRoVW5pdHM9XCJ1c2VyU3BhY2VPblVzZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoQ1opfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9jbGlwUGF0aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGVmcz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhTV0VFVCl9IGNsaXBQYXRoPVwidXJsKCNjei1jbGlwLXdhbGspXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw9XCIjMDU5NjY5XCIgZmlsbE9wYWNpdHk9XCIwLjMyXCIgc3Ryb2tlPVwiIzA0Nzg1N1wiIHN0cm9rZVdpZHRoPVwiMC44XCIgc3Ryb2tlRGFzaGFycmF5PVwiMywyXCIvPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoV0lOVEVSKX0gZmlsbD1cIiMzYjgyZjZcIiBmaWxsT3BhY2l0eT1cIjAuMTVcIiBzdHJva2U9XCJub25lXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3goMTkpfSB5MT17cGFkLnRvcCsxOH0geDI9e3goMTkpfSB5Mj17cGFkLnRvcCtncmlkSH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cIiMzYjgyZjZcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VEYXNoYXJyYXk9XCI2LDRcIiBvcGFjaXR5PVwiMC44XCIvPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICB7LyogUmVnaW9uIGxhYmVscyDigJQgc2FtZSBjb2xvcnMgJiBzcGlyaXQgYXMgbGl2ZSBjaGFydCAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goNTApLTEwfSB5PXt5KDgvMTAwMCl9IGZpbGw9XCIjNjM2NmYxXCIgZm9udFNpemU9XCIxMFwiIGZvbnRXZWlnaHQ9XCI5MDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIHRyYW5zZm9ybT17YHJvdGF0ZSgtOTAsICR7eCg1MCktMTB9LCAke3koOC8xMDAwKX0pYH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc9XCIyXCI+TUVDSEFOSUNBTCBDT09MSU5HPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCg0NCktMn0geT17eSg4LzEwMDApfSBmaWxsPVwiI2VjNDg5OVwiIGZvbnRTaXplPVwiOVwiIGZvbnRXZWlnaHQ9XCI5MDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIHRyYW5zZm9ybT17YHJvdGF0ZSgtOTAsICR7eCg0NCktMn0sICR7eSg4LzEwMDApfSlgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZz1cIjEuNVwiPk1BU1MgQ09PTElORzwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goMzcpLTEwfSB5PXt5KDgvMTAwMCl9IGZpbGw9XCIjOGI1Y2Y2XCIgZm9udFNpemU9XCI5XCIgZm9udFdlaWdodD1cIjkwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgdHJhbnNmb3JtPXtgcm90YXRlKC05MCwgJHt4KDM3KS0xMH0sICR7eSg4LzEwMDApfSlgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZz1cIjEuNVwiPk1BU1MgQ09PTElORzwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goMzQpfSB5PXt5KDAuNS8xMDAwKS04fSBmaWxsPVwiIzA2YjZkNFwiIGZvbnRTaXplPVwiOVwiIGZvbnRXZWlnaHQ9XCI5MDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGxldHRlclNwYWNpbmc9XCIyXCI+RVZBUE9SQVRJVkU8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDIzLjUpfSB5PXt5KF9nZXRXKDIzLjUsIDQ1KSl9IGZpbGw9XCIjMTBiOTgxXCIgZm9udFNpemU9XCIxMVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0PVwiOTAwXCIgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGxldHRlclNwYWNpbmc9XCIxLjVcIj5DT01GT1JUPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCgxOC43NSl9IHk9e3koX2dldFcoMTguNzUsIDQ1KSl9IGZpbGw9XCIjM2I4MmY2XCIgZm9udFNpemU9XCIxMVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0PVwiOTAwXCIgdGV4dEFuY2hvcj1cIm1pZGRsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm09e2Byb3RhdGUoLTkwLCAke3goMTguNzUpfSwgJHt5KF9nZXRXKDE4Ljc1LCA0NSkpfSlgfT5XSU5URVI8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDIzLjUpfSB5PXt5KF9nZXRXKDIzLjUsIChjZmcucmhMbytjZmcucmhIaSkvMikpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbD1cIiMwMjJjMjJcIiBmb250U2l6ZT1cIjhcIiBmb250V2VpZ2h0PVwiOTAwXCIgdGV4dEFuY2hvcj1cIm1pZGRsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e3BhaW50T3JkZXI6J3N0cm9rZScsIHN0cm9rZTonI2E3ZjNkMCcsIHN0cm9rZVdpZHRoOicyLjVweCcsIHN0cm9rZUxpbmVqb2luOidyb3VuZCd9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZz1cIjEuNVwiPntjZmcucmhMb30te2NmZy5yaEhpfSUgUkg8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICApfVxuXG4gICAgICAgICAgICAgICAgey8qIGF4aXMgbGFiZWxzICovfVxuICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3BhZC5sZWZ0ICsgZ3JpZFcvMn0geT17SC0xMn0gZm9udFNpemU9XCIxMVwiIGZpbGw9e3BhbGV0dGUuYXhpc31cbiAgICAgICAgICAgICAgICAgICAgICB0ZXh0QW5jaG9yPVwibWlkZGxlXCIgZm9udFdlaWdodD1cIjgwMFwiIGxldHRlclNwYWNpbmc9XCIyXCI+RFJZIEJVTEIgVEVNUCAowrBDKTwvdGV4dD5cbiAgICAgICAgICAgICAgICA8dGV4dCB4PXsxNn0geT17cGFkLnRvcCArIGdyaWRILzJ9IGZvbnRTaXplPVwiMTFcIiBmaWxsPXtwYWxldHRlLmF4aXN9XG4gICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGZvbnRXZWlnaHQ9XCI4MDBcIiBsZXR0ZXJTcGFjaW5nPVwiMlwiXG4gICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtPXtgcm90YXRlKC05MCAxNiAke3BhZC50b3AgKyBncmlkSC8yfSlgfT5IVU1JRElUWSBSQVRJTyAoZy9rZyk8L3RleHQ+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuZnVuY3Rpb24gUHN5Q29udHJvbFBhbmVsKHsgY2ZnLCB1cGRhdGUsIHNldENmZyB9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1zbGF0ZS05MDAvNjAgYm9yZGVyIGJvcmRlci1zbGF0ZS04MDAgcm91bmRlZC0yeGwgcC01IHNwYWNlLXktNlwiPlxuICAgICAgICAgICAgey8qIFRoZW1lICsgYnJpZ2h0bmVzcyAgLS0gcmVsb2NhdGVkIGZyb20gdGhlIGRhc2hib2FyZCBzaWRlYmFyIDIwMjYtMDYtMjUuXG4gICAgICAgICAgICAgICAgVHdvIGNvbnRyb2xzOiBEYXJrL0xpZ2h0IG1vZGUgdG9nZ2xlLCBhbmQgQnJpZ2h0bmVzcyBzbGlkZXIgKG9ubHlcbiAgICAgICAgICAgICAgICBtZWFuaW5nZnVsIGluIGRhcmsgbW9kZSkuICBMaXZlIHByZXZpZXcgYXBwbGllcyB0byB0aGUgc3Vycm91bmRpbmdcbiAgICAgICAgICAgICAgICBjb250cm9sIHBhbmVsIHNvIHRoZSBvcGVyYXRvciBjYW4gRkVFTCB0aGUgY2hhbmdlIGJlZm9yZSBzYXZpbmcuICovfVxuICAgICAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cInBzeS1jZmctdGhlbWUtYmxvY2tcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj57dCgnc3dfZGlzcGxheV9tb2RlJyl9PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC0yIG1iLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cInBzeS1jZmctdGhlbWUtZGFya1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0Q2ZnKGMgPT4gKHsuLi5jLCB0aGVtZTonZGFyaycsIGRhcmtMZXZlbDpNYXRoLm1pbihjLmRhcmtMZXZlbCB8fCAyLjAsIDIuNil9KSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHktMi41IHJvdW5kZWQtbGcgdGV4dC14cyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgYm9yZGVyIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Y2ZnLnRoZW1lID09PSAnZGFyaydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLXNsYXRlLTgwMCBib3JkZXIteWVsbG93LTUwMC83MCB0ZXh0LXllbGxvdy0zMDAgc2hhZG93LWxnIHNoYWRvdy15ZWxsb3ctNTAwLzEwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctc2xhdGUtOTAwLzMwIGJvcmRlci1zbGF0ZS03MDAgdGV4dC1zbGF0ZS01MDAgaG92ZXI6Ymctc2xhdGUtODAwLzYwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0KCdzd19kaW1fZGFyaycpfVxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cInBzeS1jZmctdGhlbWUtbGlnaHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldENmZyhjID0+ICh7Li4uYywgdGhlbWU6J2xpZ2h0JywgZGFya0xldmVsOjMuMH0pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweS0yLjUgcm91bmRlZC1sZyB0ZXh0LXhzIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBib3JkZXIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjZmcudGhlbWUgPT09ICdsaWdodCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLXNsYXRlLTEwMCBib3JkZXItc2t5LTUwMC83MCB0ZXh0LXNreS03MDAgc2hhZG93LWxnIHNoYWRvdy1za3ktNTAwLzEwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctc2xhdGUtOTAwLzMwIGJvcmRlci1zbGF0ZS03MDAgdGV4dC1zbGF0ZS01MDAgaG92ZXI6Ymctc2xhdGUtODAwLzYwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0KCdzd19saWdodF9tb2RlJyl9XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIHsvKiBCcmlnaHRuZXNzIHNsaWRlciDigJQgb25seSBtZWFuaW5nZnVsIHdoZW4gdGhlbWUgPT09ICdkYXJrJyAqL31cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y2ZnLnRoZW1lID09PSAnbGlnaHQnID8gJ29wYWNpdHktNDAgcG9pbnRlci1ldmVudHMtbm9uZScgOiAnJ30+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIG1iLTFcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTUwMFwiPnt0KCdzd19kaW1fYnJpZ2h0bmVzcycpfTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSBmb250LW1vbm8gdGV4dC15ZWxsb3ctMzAwIHRhYnVsYXItbnVtc1wiPntNYXRoLnJvdW5kKChjZmcuZGFya0xldmVsIHx8IDIuMCkgKiAxMDApfSU8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwicHN5LWNmZy1kYXJrLWxldmVsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbj1cIjEuNVwiIG1heD1cIjIuOFwiIHN0ZXA9XCIwLjAyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtjZmcudGhlbWUgPT09ICdsaWdodCcgPyAyLjAgOiAoY2ZnLmRhcmtMZXZlbCB8fCAyLjApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIGRhcmtMZXZlbDogcGFyc2VGbG9hdChlLnRhcmdldC52YWx1ZSksIHRoZW1lOidkYXJrJ30pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLWlucHV0IHctZnVsbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBhY2NlbnRDb2xvcjonI2ZhY2MxNScgfX0vPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTIgaXRhbGljXCI+XG4gICAgICAgICAgICAgICAgICAgIEFwcGxpZWQgdG8gdGhlIHdob2xlIGRhc2hib2FyZC4gIERpbSBpcyByZWNvbW1lbmRlZCBmb3IgY29udHJvbCByb29tczsgTGlnaHQgZm9yIGRheXRpbWUgd2Fsay10aHJvdWdocy5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIEdpdm9uaSB0b2dnbGUgKi99XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMlwiPnt0KCdzd19naXZvbmlfZW5naW5lJyl9PC9kaXY+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB1cGRhdGUoJ2dpdm9uaScsICFjZmcuZ2l2b25pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHctZnVsbCBweS0zIHJvdW5kZWQteGwgdGV4dC1zbSBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Y2ZnLmdpdm9uaVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLWluZGlnby02MDAgdGV4dC13aGl0ZSBzaGFkb3ctbGcgc2hhZG93LWluZGlnby01MDAvMzAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctc2xhdGUtODAwIHRleHQtc2xhdGUtNDAwIGJvcmRlciBib3JkZXItc2xhdGUtNzAwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAge2NmZy5naXZvbmkgPyB0KCdzd19naXZvbmlfb24nKSA6IHQoJ3N3X2dpdm9uaV9vZmYnKX1cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0yIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgICAgICBPdmVybGF5cyB0aGUgNCBjbGltYXRlLXN0cmF0ZWd5IHJlZ2lvbnMgKENvbWZvcnQsIE5hdCBWZW50LCBFdmFwLCBNZWNoIENvb2wpLlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogUkggcmFuZ2UgKi99XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMlwiPnt0KCdzd19yaF9zd2VldF9zcG90Jyl9PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi0zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTUwMCBtYi0xIGJsb2NrXCI+e3QoJ3N3X3ZlbnVlX3ByZXNldCcpfTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXQgY3Vyc29yLXBvaW50ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtjZmcucmhQcmVzZXQgfHwgJ2N1c3RvbSd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHAgPSBSSF9QUkVTRVRTLmZpbmQocCA9PiBwLmlkID09PSBlLnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocC5pZCA9PT0gJ2N1c3RvbScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZSgncmhQcmVzZXQnLCAnY3VzdG9tJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIHJoUHJlc2V0OnAuaWQsIHJoTG86cC5sbywgcmhIaTpwLmhpfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7UkhfUFJFU0VUUy5tYXAocCA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBrZXk9e3AuaWR9IHZhbHVlPXtwLmlkfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3AubGFiZWx9e3AubG8gIT0gbnVsbCA/IGAgIMK3ICAke3AubG99LSR7cC5oaX0lIFJIYCA6ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgICAgICB7KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHAgPSBSSF9QUkVTRVRTLmZpbmQoeCA9PiB4LmlkID09PSAoY2ZnLnJoUHJlc2V0IHx8ICdjdXN0b20nKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcCAmJiBwLm5vdGUgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbXQtMS41IGl0YWxpY1wiPntwLm5vdGV9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgKSA6IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH0pKCl9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMyBtYi0yXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1tb25vIHRleHQtc2xhdGUtNDAwIHctMTBcIj57Y2ZnLnJoTG99JTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj1cIjIwXCIgbWF4PXtjZmcucmhIaS01fSB2YWx1ZT17Y2ZnLnJoTG99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldENmZyhjID0+ICh7Li4uYywgcmhMbzorZS50YXJnZXQudmFsdWUsIHJoUHJlc2V0OidjdXN0b20nfSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2UtaW5wdXQgZmxleC0xXCIvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyBmb250LW1vbm8gdGV4dC1zbGF0ZS00MDAgdy0xMFwiPntjZmcucmhIaX0lPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPXtjZmcucmhMbys1fSBtYXg9XCI5MFwiIHZhbHVlPXtjZmcucmhIaX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0Q2ZnKGMgPT4gKHsuLi5jLCByaEhpOitlLnRhcmdldC52YWx1ZSwgcmhQcmVzZXQ6J2N1c3RvbSd9KSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyYW5nZS1pbnB1dCBmbGV4LTFcIi8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIEF4aXMgcmFuZ2UgKi99XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMlwiPnt0KCdzd190ZW1wX2F4aXNfcmFuZ2UnKX08L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zIG1iLTJcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyBmb250LW1vbm8gdGV4dC1zbGF0ZS00MDAgdy0xMFwiPntjZmcudExvfcKwPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPVwiLTQwXCIgbWF4PXtjZmcudEhpLTEwfSB2YWx1ZT17Y2ZnLnRMb31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlKCd0TG8nLCArZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2UtaW5wdXQgZmxleC0xXCIvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyBmb250LW1vbm8gdGV4dC1zbGF0ZS00MDAgdy0xMFwiPntjZmcudEhpfcKwPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPXtjZmcudExvKzEwfSBtYXg9XCI2MFwiIHZhbHVlPXtjZmcudEhpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGUoJ3RIaScsICtlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyYW5nZS1pbnB1dCBmbGV4LTFcIi8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbXQtMiBsZWFkaW5nLXJlbGF4ZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgQ2hhcnQgd2lsbCBiZSByZWRyYXduIHdpdGggdGhpcyBkcnktYnVsYiB0ZW1wZXJhdHVyZSB3aW5kb3cuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyLXQgYm9yZGVyLXNsYXRlLTgwMCBwdC00XCI+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbGVhZGluZy1yZWxheGVkXCI+XG4gICAgICAgICAgICAgICAgICAgIENoYW5nZXMgcHJldmlldyBsaXZlIGluIHRoZSBza2VsZXRvbiBjaGFydCBvbiB0aGUgbGVmdC4gIEhpdFxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWluZGlnby00MDAgZm9udC1ibGFja1wiPiBTYXZlICYgcmV0dXJuIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgaW4gdGhlIGhlYWRlciB3aGVuIHlvdSdyZSBoYXBweS5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTG9jYXRpb24gU2V0dGluZyAtLSBtb2RhbCB3LyBpbnRlcmFjdGl2ZSBMZWFmbGV0IG1hcCArIHJldmVyc2UgZ2VvY29kaW5nXG4gKiBDbGljayBhbnl3aGVyZSBvbiB0aGUgbWFwIChvciBkcmFnIHRoZSBtYXJrZXIpIHRvIHNldCBsYXQvbG9uLlxuICogTWFudWFsIGxhdC9sb24gZWRpdHMgcmUtY2VudHJlIHRoZSBtYXJrZXIuICBDaXR5IG5hbWUgaXMgYXV0by1wb3B1bGF0ZWRcbiAqIHZpYSBPcGVuU3RyZWV0TWFwIE5vbWluYXRpbSAobm8ga2V5IHJlcXVpcmVkLCByYXRlLWxpbWl0ZWQgdG8gfjEgcmVxL3MpLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKiBEZS1kdXAgKyBzYW5pdHktY2hlY2sgYSByYXcgc2F2ZWQtbG9jYXRpb25zIGFycmF5IChmcm9tIHNlcnZlciBvclxuICogbG9jYWxTdG9yYWdlKS4gIERlZHVwIGtleSBpcyBgbGF0LnRvRml4ZWQoNCksbG9uLnRvRml4ZWQoNClgIC0tIHRoZVxuICogU0FNRSBrZXkgdGhlIGRhc2hib2FyZCdzIHdlYXRoZXItc2V0dGluZ3MtbW9kYWwuanMgdXNlcyAtLSBzbyB0aGVcbiAqIFNldHVwIFdhbGsgZHJvcGRvd24gc2hvd3MgdGhlIGV4YWN0IHNhbWUgc2V0IHRoZSBvcGVyYXRvciBzZWVzIGluXG4gKiB0aGUgZGFzaGJvYXJkJ3MgM0QtV3ggV2VhdGhlciBidXR0b24uICBUd28gZW50cmllcyB0aGF0IHNoYXJlIGEgbmFtZVxuICogKGUuZy4gXCJIT01FXCIgYXQgdGhlIG9mZmljZSBhbmQgXCJIT01FXCIgYXQgdGhlIGFwYXJ0bWVudCkgYnV0IGhhdmVcbiAqIGRpZmZlcmVudCBjb29yZGluYXRlcyBhcmUgQk9USCBrZXB0OyBvbmx5IHRydWUgY29vcmQgZHVwbGljYXRlcyBhcmVcbiAqIGNvbGxhcHNlZC4gIERyb3BzIGVudHJpZXMgbWlzc2luZyBhIG5hbWUgb3Igd2l0aCBub24tZmluaXRlIGxhdC9sb24uICovXG5mdW5jdGlvbiBfbm9ybWFsaXplTG9jcyhhcnIpIHtcbiAgICBjb25zdCBzZWVuID0gbmV3IFNldCgpO1xuICAgIGNvbnN0IG91dCA9IFtdO1xuICAgIGZvciAoY29uc3QgbCBvZiAoYXJyIHx8IFtdKSkge1xuICAgICAgICBpZiAoIWwgfHwgdHlwZW9mIGwubmFtZSAhPT0gJ3N0cmluZycpIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCBsYXQgPSArbC5sYXQsIGxvbiA9ICtsLmxvbjtcbiAgICAgICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUobGF0KSB8fCAhTnVtYmVyLmlzRmluaXRlKGxvbikpIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCBuYW1lID0gbC5uYW1lLnRyaW0oKTtcbiAgICAgICAgaWYgKCFuYW1lKSBjb250aW51ZTtcbiAgICAgICAgY29uc3Qga2V5ID0gbGF0LnRvRml4ZWQoNCkgKyAnLCcgKyBsb24udG9GaXhlZCg0KTtcbiAgICAgICAgaWYgKHNlZW4uaGFzKGtleSkpIGNvbnRpbnVlO1xuICAgICAgICBzZWVuLmFkZChrZXkpO1xuICAgICAgICBvdXQucHVzaCh7IG5hbWUsIGxhdCwgbG9uIH0pO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xufVxuXG5mdW5jdGlvbiBMb2NhdGlvbk1vZGFsKHsgY2ZnLCBzZXRDZmcsIG9uQ2xvc2UsIG9uU2F2ZSB9KSB7XG4gICAgY29uc3QgbWFwQm94UmVmID0gUmVhY3QudXNlUmVmKG51bGwpO1xuICAgIGNvbnN0IG1hcFJlZiAgICA9IFJlYWN0LnVzZVJlZihudWxsKTtcbiAgICBjb25zdCBtYXJrZXJSZWYgPSBSZWFjdC51c2VSZWYobnVsbCk7XG4gICAgY29uc3QgW2dlb0J1c3ksIHNldEdlb0J1c3ldID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuXG4gICAgLyogLS0tLS0gc2F2ZWQgbG9jYXRpb25zIC0tIG1pcnJvciB3aGF0IHRoZSBEYXNoYm9hcmQncyBXZWF0aGVyIGJ1dHRvbiBzaG93cy5cbiAgICAgKlxuICAgICAqIFRoZSBkYXNoYm9hcmQgcmVhZHMgdGhlbSBmcm9tIGAke0FQSV9VUkx9L2FwaS93ZWF0aGVyLWxvY2F0aW9uYCdzXG4gICAgICogYHNhdmVkYCBhcnJheSBhbmQgbWlycm9ycyB0aGF0IGludG8gbG9jYWxTdG9yYWdlWydzYXZlZFdlYXRoZXJMb2NhdGlvbnMnXVxuICAgICAqIG9uIG1vdW50IChzZWUgcHVibGljL2pzL2Rhc2hib2FyZC9hcHAuanMjaHlkcmF0ZVdlYXRoZXJTdGF0ZSkuICBXZSBkb1xuICAgICAqIHRoZSBTQU1FIHRoaW5nIGhlcmUgc28gdGhlIFNldHVwIFdhbGsncyBTaXRlLW5hbWUgZHJvcGRvd24gc3RheXNcbiAgICAgKiBieXRlLWlkZW50aWNhbCB3aXRoIHRoZSBkYXNoYm9hcmQncyBsb2NhdGlvbiBsaXN0IC0tIGluY2x1ZGluZyB3aGVuIHRoZVxuICAgICAqIG9wZXJhdG9yIHZpc2l0cyBTZXR1cCBXYWxrIEJFRk9SRSBldmVyIG9wZW5pbmcgdGhlIGRhc2hib2FyZCAoZnJlc2hcbiAgICAgKiBkZXZpY2UgY2FzZSB3aGVyZSBsb2NhbFN0b3JhZ2UgaXMgZW1wdHkpLlxuICAgICAqXG4gICAgICogU3RyYXRlZ3k6XG4gICAgICogICAxKSBSZWFkIGxvY2FsU3RvcmFnZSBmaXJzdCAoaW5zdGFudCwgbm8gZmxpY2tlciBpZiBhbHJlYWR5IGh5ZHJhdGVkKS5cbiAgICAgKiAgIDIpIFRoZW4gR0VUIC9hcGkvd2VhdGhlci1sb2NhdGlvbiAoY2Fub25pY2FsLCBjcm9zcy1kZXZpY2Ugc291cmNlKS5cbiAgICAgKiAgIDMpIFdoaWNoZXZlciBpcyBub24tZW1wdHkgd2luczsgc2VydmVyIHdpbnMgdGllcy5cbiAgICAgKlxuICAgICAqIEZyZWUtZm9ybSB0eXBpbmcgaW4gdGhlIGlucHV0IHN0aWxsIHdvcmtzIC0tIHRoZSBkYXRhbGlzdCBpcyBzdWdnZXN0aW9uXG4gICAgICogb25seSwgdGhlIGlucHV0IG5ldmVyIHJlc3RyaWN0cyB0aGUgdmFsdWUuICovXG4gICAgY29uc3QgW3NhdmVkTG9jcywgc2V0U2F2ZWRMb2NzXSA9IFJlYWN0LnVzZVN0YXRlKCgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJhdyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzYXZlZFdlYXRoZXJMb2NhdGlvbnMnKTtcbiAgICAgICAgICAgIGlmICghcmF3KSByZXR1cm4gW107XG4gICAgICAgICAgICBjb25zdCBhcnIgPSBKU09OLnBhcnNlKHJhdyk7XG4gICAgICAgICAgICByZXR1cm4gQXJyYXkuaXNBcnJheShhcnIpID8gX25vcm1hbGl6ZUxvY3MoYXJyKSA6IFtdO1xuICAgICAgICB9IGNhdGNoIChlKSB7IHJldHVybiBbXTsgfVxuICAgIH0pO1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGxldCBjYW5jZWxsZWQgPSBmYWxzZTtcbiAgICAgICAgKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKCcvYXBpL3dlYXRoZXItbG9jYXRpb24nLCB7IGNyZWRlbnRpYWxzOidpbmNsdWRlJywgY2FjaGU6J25vLXN0b3JlJyB9KTtcbiAgICAgICAgICAgICAgICBpZiAoIXIub2spIHJldHVybjtcbiAgICAgICAgICAgICAgICBjb25zdCBqID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2F2ZWQgPSBfbm9ybWFsaXplTG9jcyhBcnJheS5pc0FycmF5KGouc2F2ZWQpID8gai5zYXZlZCA6IFtdKTtcbiAgICAgICAgICAgICAgICBpZiAoY2FuY2VsbGVkKSByZXR1cm47XG4gICAgICAgICAgICAgICAgaWYgKHNhdmVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0U2F2ZWRMb2NzKHNhdmVkKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gTWlycm9yIHRvIGxvY2FsU3RvcmFnZSBzbyB0aGUgZGFzaGJvYXJkIHNlZXMgdGhlIHNhbWUgbGlzdFxuICAgICAgICAgICAgICAgICAgICAvLyBldmVuIGlmIGl0cyBvd24gaHlkcmF0ZSBoYXNuJ3QgcnVuIHlldCB0aGlzIHNlc3Npb24uXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzYXZlZFdlYXRoZXJMb2NhdGlvbnMnLCBKU09OLnN0cmluZ2lmeShzYXZlZCkpOyB9IGNhdGNoIChlKSB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogb2ZmbGluZSAtPiBsb2NhbFN0b3JhZ2UgdmFsdWUgYWxyZWFkeSBpbiBzdGF0ZSAqLyB9XG4gICAgICAgIH0pKCk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7IGNhbmNlbGxlZCA9IHRydWU7IH07XG4gICAgfSwgW10pO1xuXG4gICAgLyogLS0tLS0gc2F2ZWQtbG9jYXRpb25zIGRyb3Bkb3duIG9wZW4vY2xvc2Ugc3RhdGUuXG4gICAgICogTmF0aXZlIDxkYXRhbGlzdD4gaGlkZXMgaXRzIGNoZXZyb24gaW4gbW9zdCBicm93c2VycyAoZXNwZWNpYWxseSBpblxuICAgICAqIGEgZGFyayB0aGVtZSksIHdoaWNoIG1hZGUgdGhlIFwiZHJvcCBkb3duXCIgaW52aXNpYmxlIHRvIG9wZXJhdG9yc1xuICAgICAqIHdobyBjbGVhcmx5IGhhZCBtdWx0aXBsZSBzYXZlZCBsb2NhdGlvbnMuICBSZXBsYWNlZCB3aXRoIGEgY3VzdG9tXG4gICAgICogcG9wZG93biBwYW5lbCB0aGF0IGhhcyBhbiBBTFdBWVMtVklTSUJMRSBjaGV2cm9uIGJ1dHRvbiAtLSBjbGljayBpdFxuICAgICAqIHRvIHRvZ2dsZSwgY2xpY2sgb3V0c2lkZSB0byBkaXNtaXNzLiAqL1xuICAgIGNvbnN0IFtzYXZlZE9wZW4sIHNldFNhdmVkT3Blbl0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3Qgc2F2ZWRSZWYgPSBSZWFjdC51c2VSZWYobnVsbCk7XG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKCFzYXZlZE9wZW4pIHJldHVybjtcbiAgICAgICAgY29uc3Qgb25Eb2NDbGljayA9IChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoc2F2ZWRSZWYuY3VycmVudCAmJiAhc2F2ZWRSZWYuY3VycmVudC5jb250YWlucyhlLnRhcmdldCkpIHNldFNhdmVkT3BlbihmYWxzZSk7XG4gICAgICAgIH07XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spO1xuICAgICAgICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2NDbGljayk7XG4gICAgfSwgW3NhdmVkT3Blbl0pO1xuXG4gICAgLyogV2hlbiB0aGUgdXNlciBwaWNrcyBhIG5hbWUgZnJvbSB0aGUgZHJvcGRvd24gT1IgdHlwZXMgb25lIHRoYXRcbiAgICAgKiBleGFjdGx5IG1hdGNoZXMgYSBzYXZlZCBlbnRyeSwgcHVsbCBpdHMgbGF0L2xvbiBhbmQgcmVjZW50cmUgdGhlXG4gICAgICogbWFwLiAgRnJlZS1mb3JtIHR5cGluZyBzdGlsbCB3b3JrcyAtLSB0aGUgbmFtZSBpcyBqdXN0IGtlcHQgYXMgdGhlXG4gICAgICogc2l0ZSBsYWJlbC4gIEF2b2lkcyBzdXJwcmlzaW5nIHRoZSBvcGVyYXRvciB3aG8gdHlwZXMgXCJQYXZpbGlvbiBCXCJcbiAgICAgKiAoYSBsYWJlbCB0aGV5IGludmVudGVkKSBhbmQgZXhwZWN0cyB0aGUgbWFwIE5PVCB0byBqdW1wLiAqL1xuICAgIGNvbnN0IG9uU2l0ZU5hbWVDaGFuZ2UgPSAobmV3TmFtZSkgPT4ge1xuICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIHNpdGVOYW1lOm5ld05hbWV9KSk7XG4gICAgICAgIGNvbnN0IGhpdCA9IHNhdmVkTG9jcy5maW5kKHMgPT4gcy5uYW1lID09PSBuZXdOYW1lKTtcbiAgICAgICAgaWYgKGhpdCkge1xuICAgICAgICAgICAgY29uc3QgbGF0ID0gTWF0aC5yb3VuZChoaXQubGF0ICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgICAgICBjb25zdCBsb24gPSBNYXRoLnJvdW5kKGhpdC5sb24gKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgc2l0ZU5hbWU6bmV3TmFtZSwgbGF0LCBsb24sIGNpdHk6bmV3TmFtZX0pKTtcbiAgICAgICAgICAgIGlmIChtYXBSZWYuY3VycmVudCkgbWFwUmVmLmN1cnJlbnQuc2V0VmlldyhbbGF0LCBsb25dLCAxMSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IHBpY2tTYXZlZExvYyA9IChsb2MpID0+IHtcbiAgICAgICAgc2V0U2F2ZWRPcGVuKGZhbHNlKTtcbiAgICAgICAgb25TaXRlTmFtZUNoYW5nZShsb2MubmFtZSk7XG4gICAgfTtcblxuICAgIC8qIFJlbW92ZSBhIHNhdmVkIGxvY2F0aW9uIGZyb20gdGhlIGxpc3QuICBEZWR1cC1rZXllZCBieSBsYXQvbG9uIHNvIHR3b1xuICAgICAqIGVudHJpZXMgdGhhdCBzaGFyZSBhIG5hbWUgKGUuZy4gXCJIT01FXCIgYXQgdGhlIG9mZmljZSB2cyB0aGUgYXBhcnRtZW50KVxuICAgICAqIGFyZSBhZGRyZXNzZWQgaW5kaXZpZHVhbGx5IC0tIHJlbW92aW5nIG9uZSBrZWVwcyB0aGUgb3RoZXIuICBNaXJyb3JzXG4gICAgICogdGhlIGNoYW5nZSB0byBsb2NhbFN0b3JhZ2UgQU5EIHRoZSBzZXJ2ZXIgc28gdGhlIGRhc2hib2FyZCdzIFdlYXRoZXJcbiAgICAgKiBidXR0b24gc2VlcyB0aGUgZGVsZXRpb24gb24gaXRzIG5leHQgcmVhZC4gKi9cbiAgICBjb25zdCByZW1vdmVTYXZlZExvYyA9IChsb2MpID0+IHtcbiAgICAgICAgY29uc3Qga2V5ID0gbG9jLmxhdC50b0ZpeGVkKDQpICsgJywnICsgbG9jLmxvbi50b0ZpeGVkKDQpO1xuICAgICAgICBjb25zdCBuZXh0ID0gc2F2ZWRMb2NzLmZpbHRlcihzID0+IChzLmxhdC50b0ZpeGVkKDQpICsgJywnICsgcy5sb24udG9GaXhlZCg0KSkgIT09IGtleSk7XG4gICAgICAgIHNldFNhdmVkTG9jcyhuZXh0KTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzYXZlZFdlYXRoZXJMb2NhdGlvbnMnLCBKU09OLnN0cmluZ2lmeShuZXh0KSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogcHJpdmF0ZSBtb2RlICovIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncmVkNTp3ZWF0aGVyTG9jYXRpb25DaGFuZ2VkJyxcbiAgICAgICAgICAgICAgICB7IGRldGFpbDogeyBzYXZlZDogbmV4dCB9IH0pKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgICAgLyogQmVzdC1lZmZvcnQgc2VydmVyIHN5bmMuICBBbm9ueW1vdXMgdXNlcnMgZ2V0IHBlcnNpc3RlZDpmYWxzZSBiYWNrLFxuICAgICAgICAgKiB3aGljaCBpcyBmaW5lIC0tIHRoZSBsb2NhbCBjb3B5IGFscmVhZHkgcmVmbGVjdHMgdGhlIHJlbW92YWwuICovXG4gICAgICAgIGZldGNoKCcvYXBpL3dlYXRoZXItbG9jYXRpb24nLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXG4gICAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOidhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBzYXZlZDogbmV4dCB9KSxcbiAgICAgICAgfSkuY2F0Y2goKCkgPT4geyAvKiBvZmZsaW5lIC0tIGxvY2FsU3RvcmFnZSBhbHJlYWR5IHVwZGF0ZWQgKi8gfSk7XG4gICAgICAgIC8qIElmIHRoZSBvcGVyYXRvciBqdXN0IGRlbGV0ZWQgdGhlIGVudHJ5IGN1cnJlbnRseSBpbiB0aGUgaW5wdXQsXG4gICAgICAgICAqIGJsYW5rIHRoZSBpbnB1dCBzbyBhIHN0YWxlIHNlbGVjdGlvbiBpc24ndCBhY2NpZGVudGFsbHkgc2F2ZWQuICovXG4gICAgICAgIGlmICgoY2ZnLnNpdGVOYW1lIHx8ICcnKS50cmltKCkgPT09IGxvYy5uYW1lKSB7XG4gICAgICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIHNpdGVOYW1lOicnfSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuZXh0Lmxlbmd0aCA9PT0gMCkgc2V0U2F2ZWRPcGVuKGZhbHNlKTtcbiAgICB9O1xuXG4gICAgLyogSW5saW5lIHJlbmFtZTogdHlwaW5nIGludG8gYSByb3cncyBuYW1lIGlucHV0IHVwZGF0ZXMgdGhlIGluLW1lbW9yeVxuICAgICAqIGBzYXZlZExvY3NgIGxpc3QgKE5PVCBwZXJzaXN0ZWQgdW50aWwgXCJTYXZlICYgUmV0dXJuXCIpLiAgS2V5ZWQgYnkgdGhlXG4gICAgICogcm93J3MgbGF0L2xvbiBzbyB0d28gc2FtZS1uYW1lZCBlbnRyaWVzIGF0IGRpZmZlcmVudCBjb29yZGluYXRlcyBjYW5cbiAgICAgKiBiZSByZW5hbWVkIGluZGVwZW5kZW50bHkuICBUcmltIGlzIGRlbGF5ZWQgdW50aWwgcGVyc2lzdCBzbyB0aGVcbiAgICAgKiBvcGVyYXRvciBjYW4ga2VlcCB0eXBpbmcgd2l0aG91dCB0aGUgZmllbGQgXCJzbmFwcGluZ1wiIG1pZC1lZGl0LiAqL1xuICAgIGNvbnN0IHJlbmFtZVNhdmVkTG9jID0gKG9yaWdMb2MsIG5ld05hbWUpID0+IHtcbiAgICAgICAgY29uc3Qga2V5ID0gb3JpZ0xvYy5sYXQudG9GaXhlZCg0KSArICcsJyArIG9yaWdMb2MubG9uLnRvRml4ZWQoNCk7XG4gICAgICAgIHNldFNhdmVkTG9jcyhwcmV2ID0+IHByZXYubWFwKHMgPT5cbiAgICAgICAgICAgIChzLmxhdC50b0ZpeGVkKDQpICsgJywnICsgcy5sb24udG9GaXhlZCg0KSkgPT09IGtleVxuICAgICAgICAgICAgICAgID8geyAuLi5zLCBuYW1lOiBuZXdOYW1lIH1cbiAgICAgICAgICAgICAgICA6IHNcbiAgICAgICAgKSk7XG4gICAgICAgIC8qIElmIHRoZSBvcGVyYXRvciBpcyByZW5hbWluZyB0aGUgZW50cnkgdGhhdCBpcyBjdXJyZW50bHkgdGhlXG4gICAgICAgICAqIFwiYWN0aXZlXCIgcGljayAoc2l0ZU5hbWUgbWF0Y2hlcyksIGtlZXAgdGhlIHBpY2tlciBpbiBzeW5jLiAqL1xuICAgICAgICBjb25zdCBzdGlsbFNlbGVjdGVkID0gKGNmZy5zaXRlTmFtZSB8fCAnJykudHJpbSgpID09PSBvcmlnTG9jLm5hbWVcbiAgICAgICAgICAgICYmIE1hdGguYWJzKGNmZy5sYXQgLSBvcmlnTG9jLmxhdCkgPCAxZS00XG4gICAgICAgICAgICAmJiBNYXRoLmFicyhjZmcubG9uIC0gb3JpZ0xvYy5sb24pIDwgMWUtNDtcbiAgICAgICAgaWYgKHN0aWxsU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgc2l0ZU5hbWU6bmV3TmFtZSwgY2l0eTpuZXdOYW1lfSkpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qIC0tLS0tIHNlYXJjaCBzdGF0ZSAtLS0tLSAqL1xuICAgIGNvbnN0IFtzZWFyY2hRLCBzZXRTZWFyY2hRXSAgICAgICAgID0gUmVhY3QudXNlU3RhdGUoJycpO1xuICAgIGNvbnN0IFtzZWFyY2hIaXRzLCBzZXRTZWFyY2hIaXRzXSAgID0gUmVhY3QudXNlU3RhdGUoW10pO1xuICAgIGNvbnN0IFtzZWFyY2hCdXN5LCBzZXRTZWFyY2hCdXN5XSAgID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IFtzZWFyY2hPcGVuLCBzZXRTZWFyY2hPcGVuXSAgID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IHNlYXJjaERlYm91bmNlUmVmICAgICAgICAgICAgID0gUmVhY3QudXNlUmVmKG51bGwpO1xuXG4gICAgLyogRm9yd2FyZC1nZW9jb2RlOiBxdWVyeSAtPiBbe2xhdCwgbG9uLCBkaXNwbGF5X25hbWUsIHR5cGUsIC4uLn1dICovXG4gICAgY29uc3QgcnVuU2VhcmNoID0gYXN5bmMgKHEpID0+IHtcbiAgICAgICAgaWYgKCFxIHx8IHEudHJpbSgpLmxlbmd0aCA8IDMpIHsgc2V0U2VhcmNoSGl0cyhbXSk7IHJldHVybjsgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2V0U2VhcmNoQnVzeSh0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGBodHRwczovL25vbWluYXRpbS5vcGVuc3RyZWV0bWFwLm9yZy9zZWFyY2g/Zm9ybWF0PWpzb24mbGltaXQ9NiZxPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHEpfWA7XG4gICAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7IGhlYWRlcnM6eyAnQWNjZXB0JzonYXBwbGljYXRpb24vanNvbicgfSB9KTtcbiAgICAgICAgICAgIGNvbnN0IGogPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgICAgIHNldFNlYXJjaEhpdHMoQXJyYXkuaXNBcnJheShqKSA/IGogOiBbXSk7XG4gICAgICAgICAgICBzZXRTZWFyY2hPcGVuKHRydWUpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IHNldFNlYXJjaEhpdHMoW10pOyB9XG4gICAgICAgIGZpbmFsbHkgeyBzZXRTZWFyY2hCdXN5KGZhbHNlKTsgfVxuICAgIH07XG5cbiAgICAvKiBkZWJvdW5jZWQgc2VhcmNoLW9uLXR5cGUgKi9cbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoc2VhcmNoRGVib3VuY2VSZWYuY3VycmVudCkgY2xlYXJUaW1lb3V0KHNlYXJjaERlYm91bmNlUmVmLmN1cnJlbnQpO1xuICAgICAgICBzZWFyY2hEZWJvdW5jZVJlZi5jdXJyZW50ID0gc2V0VGltZW91dCgoKSA9PiBydW5TZWFyY2goc2VhcmNoUSksIDQwMCk7XG4gICAgICAgIHJldHVybiAoKSA9PiBzZWFyY2hEZWJvdW5jZVJlZi5jdXJyZW50ICYmIGNsZWFyVGltZW91dChzZWFyY2hEZWJvdW5jZVJlZi5jdXJyZW50KTtcbiAgICB9LCBbc2VhcmNoUV0pO1xuXG4gICAgY29uc3QgcGlja1NlYXJjaEhpdCA9IChoaXQpID0+IHtcbiAgICAgICAgY29uc3QgbGF0ID0gTWF0aC5yb3VuZCgraGl0LmxhdCAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICBjb25zdCBsb24gPSBNYXRoLnJvdW5kKCtoaXQubG9uICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgbGF0LCBsb24sIGNpdHk6aGl0LmRpc3BsYXlfbmFtZX0pKTtcbiAgICAgICAgaWYgKG1hcFJlZi5jdXJyZW50KSBtYXBSZWYuY3VycmVudC5zZXRWaWV3KFtsYXQsIGxvbl0sIGhpdC50eXBlID09PSAnY2l0eScgPyAxMSA6IDE1KTtcbiAgICAgICAgc2V0U2VhcmNoT3BlbihmYWxzZSk7XG4gICAgICAgIHNldFNlYXJjaFEoJycpO1xuICAgIH07XG5cbiAgICAvKiBSZXZlcnNlLWdlb2NvZGUgbGF0L2xvbiAtPiBjaXR5IC8gY291bnRyeSB2aWEgTm9taW5hdGltLiAgTm8gQVBJIGtleS4gKi9cbiAgICBjb25zdCByZXZlcnNlR2VvY29kZSA9IGFzeW5jIChsYXQsIGxvbikgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2V0R2VvQnVzeSh0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGBodHRwczovL25vbWluYXRpbS5vcGVuc3RyZWV0bWFwLm9yZy9yZXZlcnNlP2Zvcm1hdD1qc29uJmxhdD0ke2xhdH0mbG9uPSR7bG9ufSZ6b29tPTEwYDtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCh1cmwsIHsgaGVhZGVyczogeyAnQWNjZXB0JzonYXBwbGljYXRpb24vanNvbicgfSB9KTtcbiAgICAgICAgICAgIGNvbnN0IGogPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgICAgIGNvbnN0IGEgPSBqLmFkZHJlc3MgfHwge307XG4gICAgICAgICAgICBjb25zdCBjaXR5ID0gYS5jaXR5IHx8IGEudG93biB8fCBhLnZpbGxhZ2UgfHwgYS5oYW1sZXQgfHwgYS5jb3VudHkgfHwgJyc7XG4gICAgICAgICAgICBjb25zdCByZWdpb24gPSBhLnN0YXRlIHx8IGEucmVnaW9uIHx8ICcnO1xuICAgICAgICAgICAgY29uc3QgY291bnRyeSA9IGEuY291bnRyeSB8fCAnJztcbiAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gW2NpdHksIHJlZ2lvbiwgY291bnRyeV0uZmlsdGVyKEJvb2xlYW4pLmpvaW4oJywgJykgfHwgai5kaXNwbGF5X25hbWUgfHwgJyc7XG4gICAgICAgICAgICBpZiAobGFiZWwpIHNldENmZyhjID0+ICh7Li4uYywgY2l0eTpsYWJlbH0pKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBvZmZsaW5lIG9yIHJhdGUtbGltaXRlZCAtPiBrZWVwIHByaW9yIG5hbWUgKi8gfVxuICAgICAgICBmaW5hbGx5IHsgc2V0R2VvQnVzeShmYWxzZSk7IH1cbiAgICB9O1xuXG4gICAgLyogSW5pdCBMZWFmbGV0IG9uIGZpcnN0IHJlbmRlciBvZiB0aGUgbW9kYWwgKi9cbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoIW1hcEJveFJlZi5jdXJyZW50IHx8IG1hcFJlZi5jdXJyZW50KSByZXR1cm47XG4gICAgICAgIGNvbnN0IG1hcCA9IEwubWFwKG1hcEJveFJlZi5jdXJyZW50LCB7IHpvb21Db250cm9sOiB0cnVlLCBhdHRyaWJ1dGlvbkNvbnRyb2w6IHRydWUgfSlcbiAgICAgICAgICAgICAgICAgICAgIC5zZXRWaWV3KFtjZmcubGF0LCBjZmcubG9uXSwgNik7XG4gICAgICAgIEwudGlsZUxheWVyKCdodHRwczovL3tzfS50aWxlLm9wZW5zdHJlZXRtYXAub3JnL3t6fS97eH0ve3l9LnBuZycsIHtcbiAgICAgICAgICAgIG1heFpvb206IDE4LFxuICAgICAgICAgICAgYXR0cmlidXRpb246ICcmY29weTsgT3BlblN0cmVldE1hcCBjb250cmlidXRvcnMnLFxuICAgICAgICB9KS5hZGRUbyhtYXApO1xuXG4gICAgICAgIGNvbnN0IG1hcmtlciA9IEwubWFya2VyKFtjZmcubGF0LCBjZmcubG9uXSwgeyBkcmFnZ2FibGU6IHRydWUgfSkuYWRkVG8obWFwKTtcbiAgICAgICAgbWFya2VyLmJpbmRUb29sdGlwKCdEcmFnIG1lIG9yIGNsaWNrIGFueXdoZXJlIG9uIHRoZSBtYXAnLCB7IHBlcm1hbmVudDogZmFsc2UgfSk7XG5cbiAgICAgICAgY29uc3QgYXBwbHlMYXRMb24gPSAobGF0LCBsb24pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHIgPSAobikgPT4gTWF0aC5yb3VuZChuICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIGxhdDpyKGxhdCksIGxvbjpyKGxvbil9KSk7XG4gICAgICAgICAgICByZXZlcnNlR2VvY29kZShyKGxhdCksIHIobG9uKSk7XG4gICAgICAgIH07XG4gICAgICAgIG1hcmtlci5vbignZHJhZ2VuZCcsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxsID0gbWFya2VyLmdldExhdExuZygpO1xuICAgICAgICAgICAgYXBwbHlMYXRMb24obGwubGF0LCBsbC5sbmcpO1xuICAgICAgICB9KTtcbiAgICAgICAgbWFwLm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICBtYXJrZXIuc2V0TGF0TG5nKGUubGF0bG5nKTtcbiAgICAgICAgICAgIGFwcGx5TGF0TG9uKGUubGF0bG5nLmxhdCwgZS5sYXRsbmcubG5nKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbWFwUmVmLmN1cnJlbnQgPSBtYXA7XG4gICAgICAgIG1hcmtlclJlZi5jdXJyZW50ID0gbWFya2VyO1xuXG4gICAgICAgIC8qIExlYWZsZXQgcmVuZGVycyBibGFuayBpZiBpdCBib290cyBpbnNpZGUgYSBoaWRkZW4gZWxlbWVudCDigJQga2ljayBpdFxuICAgICAgICAgICBvbmNlIHRoZSBtb2RhbCBhbmltYXRpb24gc2V0dGxlcy4gKi9cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiBtYXAuaW52YWxpZGF0ZVNpemUoKSwgMjUwKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHsgbWFwLnJlbW92ZSgpOyBtYXBSZWYuY3VycmVudCA9IG51bGw7IG1hcmtlclJlZi5jdXJyZW50ID0gbnVsbDsgfTtcbiAgICB9LCBbXSk7XG5cbiAgICAvKiBLZWVwIG1hcmtlciBpbiBzeW5jIHdoZW4gdXNlciBlZGl0cyBsYXQvbG9uIGZpZWxkcyBtYW51YWxseSAqL1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmIChtYXBSZWYuY3VycmVudCAmJiBtYXJrZXJSZWYuY3VycmVudCkge1xuICAgICAgICAgICAgbWFya2VyUmVmLmN1cnJlbnQuc2V0TGF0TG5nKFtjZmcubGF0LCBjZmcubG9uXSk7XG4gICAgICAgICAgICBtYXBSZWYuY3VycmVudC5wYW5UbyhbY2ZnLmxhdCwgY2ZnLmxvbl0pO1xuICAgICAgICB9XG4gICAgfSwgW2NmZy5sYXQsIGNmZy5sb25dKTtcblxuICAgIC8qIEdlb2xvY2F0aW9uOiBzaWxlbnRseSBuby1vcCdkIGJlZm9yZSAtLSBpZiB0aGUgYnJvd3NlciBibG9ja2VkIHRoZVxuICAgICAqIHJlcXVlc3QgKEhUVFAgb3JpZ2luID0gbm90IGEgc2VjdXJlIGNvbnRleHQgb24gZmllbGQgY29udHJvbGxlcnMsIG9yXG4gICAgICogdGhlIHVzZXIgZGVuaWVkIHBlcm1pc3Npb24gZWFybGllcikgdGhlIGJ1dHRvbiBqdXN0IHNhdCB0aGVyZS5cbiAgICAgKiBOb3cgd2Ugc3VyZmFjZSBhIHN0YXRlIChidXN5IC8gZXJyKSBzbyB0aGUgb3BlcmF0b3IgY2FuIHNlZSBXSFkgaXRcbiAgICAgKiBmYWlsZWQgYW5kIGFjdCBvbiBpdCAoc3dpdGNoIHRvIEhUVFBTLCByZS1wcm9tcHQsIG9yIHVzZSB0aGUgbWFwKS4gKi9cbiAgICBjb25zdCBbZ2VvU3RhdGUsIHNldEdlb1N0YXRlXSA9IFJlYWN0LnVzZVN0YXRlKG51bGwpOyAgIC8vIG51bGwgfCAnYnVzeScgfCB7ZXJyfVxuICAgIGNvbnN0IHVzZU15TG9jYXRpb24gPSAoKSA9PiB7XG4gICAgICAgIHNldEdlb1N0YXRlKCdidXN5Jyk7XG4gICAgICAgIC8vIG5hdmlnYXRvci5nZW9sb2NhdGlvbiBpcyBgdW5kZWZpbmVkYCBvbiBIVFRQIG9yaWdpbnMgKENocm9tZSA1MCspLlxuICAgICAgICBpZiAoIW5hdmlnYXRvci5nZW9sb2NhdGlvbikge1xuICAgICAgICAgICAgc2V0R2VvU3RhdGUoeyBlcnI6J0Jyb3dzZXIgYmxvY2tlZCBsb2NhdGlvbiBhY2Nlc3Mg4oCUIG9wZW4gdGhpcyBwYWdlIHZpYSBIVFRQUy4nIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oXG4gICAgICAgICAgICAocG9zKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGF0ID0gTWF0aC5yb3VuZChwb3MuY29vcmRzLmxhdGl0dWRlICAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxvbiA9IE1hdGgucm91bmQocG9zLmNvb3Jkcy5sb25naXR1ZGUgKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIGxhdCwgbG9ufSkpO1xuICAgICAgICAgICAgICAgIGlmIChtYXBSZWYuY3VycmVudCkgbWFwUmVmLmN1cnJlbnQuc2V0VmlldyhbbGF0LCBsb25dLCAxMSk7XG4gICAgICAgICAgICAgICAgcmV2ZXJzZUdlb2NvZGUobGF0LCBsb24pO1xuICAgICAgICAgICAgICAgIHNldEdlb1N0YXRlKG51bGwpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBlcnIuY29kZTogMT1QRVJNSVNTSU9OX0RFTklFRCwgMj1QT1NJVElPTl9VTkFWQUlMQUJMRSwgMz1USU1FT1VUXG4gICAgICAgICAgICAgICAgY29uc3QgbXNnID0gZXJyICYmIGVyci5jb2RlID09PSAxXG4gICAgICAgICAgICAgICAgICAgID8gJ0xvY2F0aW9uIHBlcm1pc3Npb24gZGVuaWVkIOKAlCBjbGljayB0aGUgbG9jayBpY29uIGluIHRoZSBhZGRyZXNzIGJhciBhbmQgYWxsb3cgbG9jYXRpb24uJ1xuICAgICAgICAgICAgICAgICAgICA6IGVyciAmJiBlcnIuY29kZSA9PT0gMlxuICAgICAgICAgICAgICAgICAgICAgICAgPyAnTG9jYXRpb24gY3VycmVudGx5IHVuYXZhaWxhYmxlIOKAlCB0aGUgZGV2aWNlIGhhcyBubyBHUFMgLyBXaS1GaSBmaXggeWV0LidcbiAgICAgICAgICAgICAgICAgICAgICAgIDogZXJyICYmIGVyci5jb2RlID09PSAzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnTG9jYXRpb24gcmVxdWVzdCB0aW1lZCBvdXQg4oCUIHRyeSBhZ2Fpbiwgb3IgdXNlIHRoZSBtYXAgLyBzZWFyY2ggYmFyLidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IChlcnIgJiYgZXJyLm1lc3NhZ2UpIHx8ICdDb3VsZCBub3QgcmVhZCBkZXZpY2UgbG9jYXRpb24uJztcbiAgICAgICAgICAgICAgICBzZXRHZW9TdGF0ZSh7IGVycjogbXNnIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgZW5hYmxlSGlnaEFjY3VyYWN5OnRydWUsIHRpbWVvdXQ6MTAwMDAsIG1heGltdW1BZ2U6MCB9XG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIC8qIFdoZW4gdXNlciBjbGlja3MgXCJTYXZlICYgcmV0dXJuXCIsIG1pcnJvciBFWEFDVExZIHdoYXQgdGhlIGRhc2hib2FyZCdzXG4gICAgICogV2VhdGhlciBidXR0b24gZG9lcyBpbiB3ZWF0aGVyLXNldHRpbmdzLW1vZGFsLmpzI3NlbGVjdExvY2F0aW9uOlxuICAgICAqICAgMS4gbG9jYWxTdG9yYWdlWyd3ZWF0aGVyTG9jYXRpb24nXSAgICAgICAgPSBjaG9zZW4gbG9jIChjYW5vbmljYWwga2V5XG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGRhc2hib2FyZCByZWFkcyBvblxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vdW50LCBOT1QgJ3JlZDUud2VhdGhlcl9sb2NhdGlvbicpLlxuICAgICAqICAgMi4gbG9jYWxTdG9yYWdlWydzYXZlZFdlYXRoZXJMb2NhdGlvbnMnXSAgPSBbbG9jLCAuLi5vdGhlcnNdIGRlZHVwZWRcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBieSBsYXQvbG9uLCBjYXBwZWQgYXQgMjAuXG4gICAgICogICAzLiBQT1NUIC9hcGkvd2VhdGhlci1sb2NhdGlvbiB3aXRoIGFjdGl2ZStkZWZhdWx0K3NhdmVkIHNvIHRoZSBzYW1lXG4gICAgICogICAgICBsaXN0IHN1cnZpdmVzIGNyb3NzLWRldmljZSBzZXNzaW9ucyBmb3Igc2lnbmVkLWluIHRlbmFudHMuXG4gICAgICpcbiAgICAgKiBXaXRob3V0IHN0ZXAgMSB0aGUgZGFzaGJvYXJkJ3MgYHdlYXRoZXJMb2NhdGlvbmAgc3RhdGUgc2lsZW50bHkga2VlcHNcbiAgICAgKiBpdHMgb2xkIHZhbHVlIC0tIHdoaWNoIGlzIGV4YWN0bHkgdGhlIGJ1ZyBvcGVyYXRvcnMgcmVwb3J0ZWQgYWZ0ZXJcbiAgICAgKiBwaWNraW5nIGEgbG9jYXRpb24gaW4gU2V0dXAgV2FsayBhbmQgc2VlaW5nIHRoZSBkYXNoYm9hcmQncyB3ZWF0aGVyXG4gICAgICogc3RyaXAgcmVmdXNlIHRvIHVwZGF0ZS4gKi9cbiAgICBjb25zdCBbc2F2ZU1zZywgc2V0U2F2ZU1zZ10gPSBSZWFjdC51c2VTdGF0ZShudWxsKTtcbiAgICBjb25zdCBwZXJzaXN0QW5kU2F2ZSA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgbG9jID0geyBsYXQ6IGNmZy5sYXQsIGxvbjogY2ZnLmxvbiwgbmFtZTogY2ZnLnNpdGVOYW1lIHx8IGNmZy5jaXR5IH07XG5cbiAgICAgICAgLy8gRGUtZHVwIHRoZSBleGlzdGluZyBzYXZlZCBsaXN0IGJ5IGxhdC9sb24gKHNhbWUga2V5IHRoZSBkYXNoYm9hcmRcbiAgICAgICAgLy8gdXNlcykgYW5kIHB1dCB0aGUgbmV3IHBpY2sgYXQgdGhlIHRvcC4gIENhcCBhdCAyMCB0byBtYXRjaCB0aGVcbiAgICAgICAgLy8gZGFzaGJvYXJkJ3MgYmVoYXZpb3VyLlxuICAgICAgICBjb25zdCBrZXkgPSBsb2MubGF0LnRvRml4ZWQoNCkgKyAnLCcgKyBsb2MubG9uLnRvRml4ZWQoNCk7XG4gICAgICAgIGNvbnN0IGRlZHVwZWQgPSBzYXZlZExvY3MuZmlsdGVyKGwgPT4gKGwubGF0LnRvRml4ZWQoNCkgKyAnLCcgKyBsLmxvbi50b0ZpeGVkKDQpKSAhPT0ga2V5KTtcbiAgICAgICAgY29uc3QgbmV4dFNhdmVkID0gW2xvYywgLi4uZGVkdXBlZF0uc2xpY2UoMCwgMjApO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnd2VhdGhlckxvY2F0aW9uJywgSlNPTi5zdHJpbmdpZnkobG9jKSk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc2F2ZWRXZWF0aGVyTG9jYXRpb25zJywgSlNPTi5zdHJpbmdpZnkobmV4dFNhdmVkKSk7XG4gICAgICAgICAgICAvLyBLZWVwIHRoZSBvbGQga2V5IHRvbyAtLSBzb21lIGxlZ2FjeSBwbHVnLWlucyBzdGlsbCBsb29rIGF0IGl0LlxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDUud2VhdGhlcl9sb2NhdGlvbicsIEpTT04uc3RyaW5naWZ5KGxvYykpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IC8qIHByaXZhdGUgbW9kZSAtLSBpZ25vcmUgKi8gfVxuXG4gICAgICAgIGxldCBwZXJzaXN0ZWQgPSBmYWxzZSwgd2FybmluZyA9ICcnO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKCcvYXBpL3dlYXRoZXItbG9jYXRpb24nLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOidhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgYWN0aXZlOiBsb2MsIGRlZmF1bHQ6IGxvYywgc2F2ZWQ6IG5leHRTYXZlZCB9KSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgaiA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgICAgICAgd2luZG93Ll9sYXN0V2VhdGhlckxvY2F0aW9uU2F2ZSA9IGo7XG4gICAgICAgICAgICBwZXJzaXN0ZWQgPSAhIWoucGVyc2lzdGVkO1xuICAgICAgICAgICAgd2FybmluZyAgID0gai53YXJuaW5nIHx8ICcnO1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdbc2V0dXAgd2Fsa10gL2FwaS93ZWF0aGVyLWxvY2F0aW9uIDwtJywgaik7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHdhcm5pbmcgPSAnTmV0d29yayBlcnJvciDigJQgc2F2ZWQgbG9jYWxseSBvbmx5Lic7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1tzZXR1cCB3YWxrXSBjb3VsZCBub3QgcGVyc2lzdCBsb2NhdGlvbjonLCBlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRlbGwgYW55IG9wZW4gZGFzaGJvYXJkIHRhYiB0byByZS1oeWRyYXRlLiAgVGhlIGRhc2hib2FyZFxuICAgICAgICAvLyBhbHJlYWR5IGxpc3RlbnMgZm9yIGBzdG9yYWdlYCBldmVudHMgd2hlbiBhbm90aGVyIHRhYiB3cml0ZXMgdG9cbiAgICAgICAgLy8gbG9jYWxTdG9yYWdlLCBidXQgb24gVjEuOSBzb21lIGJyb3dzZXJzIERPTidUIGZpcmUgYHN0b3JhZ2VgIGZvclxuICAgICAgICAvLyBzYW1lLW9yaWdpbiB3cml0ZXMgZnJvbSB0aGlzIHNhbWUgdGFiLiAgQW4gZXhwbGljaXQgY3VzdG9tIGV2ZW50XG4gICAgICAgIC8vIG1ha2VzIHRoZSBkYXNoYm9hcmQncyBwb2xsaW5nIHBpY2sgdGhlIGNoYW5nZSB1cCBpbW1lZGlhdGVseSBpZlxuICAgICAgICAvLyBpdCdzIGFscmVhZHkgbW91bnRlZCBpbiBhbm90aGVyIHRhYi93aW5kb3cuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3JlZDU6d2VhdGhlckxvY2F0aW9uQ2hhbmdlZCcsXG4gICAgICAgICAgICAgICAgeyBkZXRhaWw6IHsgYWN0aXZlOiBsb2MsIHNhdmVkOiBuZXh0U2F2ZWQgfSB9KSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogSUUtbGVzcyBlbnZpcm9ubWVudHMgLS0gbm8tb3AgKi8gfVxuXG4gICAgICAgIGlmIChwZXJzaXN0ZWQpIHtcbiAgICAgICAgICAgIG9uU2F2ZSgpOyAgICAgICAgICAgLy8gaGFwcHkgcGF0aDogY2xvc2UgKyBtYXJrIHN0ZXAgZG9uZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLyogU3VyZmFjZSB0aGUgd2FybmluZywgaG9sZCB0aGUgbW9kYWwgb3BlbiBmb3IgMS42cyBzbyB0aGVcbiAgICAgICAgICAgICAqIG9wZXJhdG9yIHJlYWRzIGl0LCB0aGVuIGNsb3NlLiAgVGhlIGxvY2FsIGNvcHkgaXMgYWxyZWFkeVxuICAgICAgICAgICAgICogd3JpdHRlbiwgc28gdGhlIGRhc2hib2FyZCB3aWxsIHN0aWxsIHNlZSB0aGUgbmV3IGxvY2F0aW9uXG4gICAgICAgICAgICAgKiBpbiB0aGlzIGJyb3dzZXIgc2Vzc2lvbi4gKi9cbiAgICAgICAgICAgIHNldFNhdmVNc2cod2FybmluZyB8fCAnU2F2ZWQgbG9jYWxseSBvbmx5IOKAlCBzaWduIGluIHRvIHNhdmUgc2VydmVyLXNpZGUuJyk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgc2V0U2F2ZU1zZyhudWxsKTsgb25TYXZlKCk7IH0sIDE2MDApO1xuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPE1vZGFsU2hlbGwgdGl0bGU9e3QoJ3N3X2xvY2F0aW9uX3NldHRpbmcnKX0gc3VidGl0bGU9e3QoJ3N3X2xvY2F0aW9uX3N1YicpfSBhY2NlbnQ9XCJhbWJlclwiIG9uQ2xvc2U9e29uQ2xvc2V9IG9uU2F2ZT17cGVyc2lzdEFuZFNhdmV9IHNpemU9XCJtYXhcIj5cbiAgICAgICAgICAgIHtzYXZlTXNnICYmIChcbiAgICAgICAgICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwibG9jLXNhdmUtbXNnXCJcbiAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1iLTMgcHgtNCBweS0yLjUgcm91bmRlZC1sZyBiZy1hbWJlci05MDAvMzAgYm9yZGVyIGJvcmRlci1hbWJlci03MDAvNTAgdGV4dC1hbWJlci0yMDAgdGV4dC14cyBmb250LW1vbm9cIj5cbiAgICAgICAgICAgICAgICAgICAg4pqgICB7c2F2ZU1zZ31cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbGc6Z3JpZC1jb2xzLVsxZnJfMzQwcHhdIGdhcC00IGgtZnVsbFwiIHN0eWxlPXt7bWluSGVpZ2h0Oic1NnZoJ319PlxuICAgICAgICAgICAgICAgIHsvKiBNQVAg4oCUIGZpbGxzIHRoZSBsZWZ0IHNpZGUsIHdpdGggYSBzZWFyY2ggYmFyIGZsb2F0aW5nIG9uIHRvcCAqL31cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlXCIgc3R5bGU9e3ttaW5IZWlnaHQ6JzU2dmgnfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgcmVmPXttYXBCb3hSZWZ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgaGVpZ2h0OicxMDAlJywgbWluSGVpZ2h0Oic1NnZoJywgd2lkdGg6JzEwMCUnLCBib3JkZXJSYWRpdXM6JzEycHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OidoaWRkZW4nLCBib3JkZXI6JzFweCBzb2xpZCAjMzM0MTU1JywgYmFja2dyb3VuZDonIzBiMTIyMCcgfX0vPlxuXG4gICAgICAgICAgICAgICAgICAgIHsvKiBTZWFyY2ggYmFyIG92ZXJsYXkg4oCUIHNpdHMgaW4gdGhlIHRvcC1jZW50cmUgb2YgdGhlIG1hcCAqL31cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSB0b3AtMyBsZWZ0LTEvMiAtdHJhbnNsYXRlLXgtMS8yIHotWzUwMF1cIiBzdHlsZT17e3dpZHRoOidtaW4oNTYwcHgsIGNhbGMoMTAwJSAtIDExMHB4KSknfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3NlYXJjaFF9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0U2VhcmNoUShlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uRm9jdXM9eygpID0+IHNlYXJjaEhpdHMubGVuZ3RoICYmIHNldFNlYXJjaE9wZW4odHJ1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwi8J+UjiAgU2VhcmNoIGJ5IGFkZHJlc3MsIGJ1aWxkaW5nLCBvciBwbGFjZSBuYW1l4oCmXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHB4LTQgcHktMi41IHJvdW5kZWQteGwgYmctc2xhdGUtOTAwLzk1IGJvcmRlciBib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtMTAwIHRleHQtc20gcGxhY2Vob2xkZXItc2xhdGUtNTAwIHNoYWRvdy0yeGwgYmFja2Ryb3AtYmx1clwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7b3V0bGluZTonbm9uZSd9fS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlYXJjaEJ1c3kgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJhYnNvbHV0ZSByaWdodC0zIHRvcC0xLzIgLXRyYW5zbGF0ZS15LTEvMiB0ZXh0LWFtYmVyLTQwMCB0ZXh0LXhzXCI+4oCmPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlYXJjaE9wZW4gJiYgc2VhcmNoSGl0cy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSB0b3AtZnVsbCBsZWZ0LTAgcmlnaHQtMCBtdC0xIGJnLXNsYXRlLTkwMC85NyBib3JkZXIgYm9yZGVyLXNsYXRlLTcwMCByb3VuZGVkLXhsIHNoYWRvdy0yeGwgb3ZlcmZsb3ctaGlkZGVuIG1heC1oLTcyIG92ZXJmbG93LXktYXV0byBiYWNrZHJvcC1ibHVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VhcmNoSGl0cy5tYXAoKGgsIGkpID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGtleT17aC5wbGFjZV9pZCB8fCBpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gcGlja1NlYXJjaEhpdChoKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCB0ZXh0LWxlZnQgcHgtNCBweS0yLjUgaG92ZXI6YmctYW1iZXItOTAwLzMwIGJvcmRlci1iIGJvcmRlci1zbGF0ZS04MDAgbGFzdDpib3JkZXItYi0wIHRyYW5zaXRpb24tYWxsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LXNsYXRlLTIwMCB0cnVuY2F0ZVwiPntoLmRpc3BsYXlfbmFtZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IG10LTAuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2gudHlwZSB8fCBoLmNsYXNzfSDCtyB7KCtoLmxhdCkudG9GaXhlZCgzKX0sIHsoK2gubG9uKS50b0ZpeGVkKDMpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWFyY2hPcGVuICYmIHNlYXJjaEhpdHMubGVuZ3RoID09PSAwICYmIHNlYXJjaFEubGVuZ3RoID49IDMgJiYgIXNlYXJjaEJ1c3kgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC1mdWxsIGxlZnQtMCByaWdodC0wIG10LTEgYmctc2xhdGUtOTAwLzk3IGJvcmRlciBib3JkZXItc2xhdGUtNzAwIHJvdW5kZWQteGwgcHgtNCBweS0zIHRleHQteHMgdGV4dC1zbGF0ZS00MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vIHJlc3VsdHMgZm9yIFwie3NlYXJjaFF9XCIuICBUcnkgYSBtb3JlIHNwZWNpZmljIHRlcm0uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICB7LyogU0lERSBQQU5FTCAqL31cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktNCBvdmVyZmxvdy15LWF1dG8gcHItMVwiPlxuICAgICAgICAgICAgICAgICAgICB7LyogU2l0ZSBuYW1lIGNvbWJvLWlucHV0LiAgRnJlZS1mb3JtIHR5cGluZyBmb3IgZnJlc2hcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsczsgYSB2aXNpYmxlIGNoZXZyb24gYnV0dG9uIG9uIHRoZSByaWdodCBvcGVuc1xuICAgICAgICAgICAgICAgICAgICAgICAgYSBjdXN0b20gcG9wZG93biBsaXN0aW5nIGV2ZXJ5IHNhdmVkIGxvY2F0aW9uIHB1bGxlZFxuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSAvYXBpL3dlYXRoZXItbG9jYXRpb24gKGkuZS4gdGhlIFNBTUUgbGlzdCB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAgIERhc2hib2FyZCdzIFdlYXRoZXIgYnV0dG9uIHN1cmZhY2VzKS4gIFRoaXMgcmVwbGFjZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBlYXJsaWVyIG5hdGl2ZSA8ZGF0YWxpc3Q+IHdoaWNoIHdhcyB0b28gc3VidGxlXG4gICAgICAgICAgICAgICAgICAgICAgICBpbiBkYXJrIHRoZW1lcyAtLSBvcGVyYXRvcnMgd2l0aCBOPjAgc2F2ZWQgZW50cmllc1xuICAgICAgICAgICAgICAgICAgICAgICAgY291bGQgbm90IHRlbGwgYSBkcm9wZG93biBleGlzdGVkLiAqL31cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMS41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU2l0ZSBuYW1lIChzYXZlZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2F2ZWRMb2NzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtbC0yIHRleHQtYW1iZXItNDAwLzgwIG5vcm1hbC1jYXNlIHRyYWNraW5nLW5vcm1hbCB0ZXh0LVsxMHB4XVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwibG9jLXNhdmVkLWhpbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIOKWviB7c2F2ZWRMb2NzLmxlbmd0aH0gc2F2ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmVcIiByZWY9e3NhdmVkUmVmfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXQgcHItOVwiIHZhbHVlPXtjZmcuc2l0ZU5hbWUgfHwgJyd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwibG9jLXNpdGUtbmFtZS1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtzYXZlZExvY3MubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnUGljayBhIHNhdmVkIGxvY2F0aW9uLCBvciB0eXBlIGEgbmV3IG9uZeKApidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2UuZy4gSFEgVG93ZXIsIE5vcnRoIFdpbmcsIFBhdmlsaW9uIELigKYnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IG9uU2l0ZU5hbWVDaGFuZ2UoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkZvY3VzPXsoKSA9PiBzYXZlZExvY3MubGVuZ3RoID4gMCAmJiBzZXRTYXZlZE9wZW4odHJ1ZSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2F2ZWRMb2NzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwibG9jLXNhdmVkLWNoZXZyb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFNhdmVkT3Blbih2ID0+ICF2KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiT3BlbiBzYXZlZCBsb2NhdGlvbnNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwiUGljayBmcm9tIHNhdmVkIGxvY2F0aW9uc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgcmlnaHQtMSB0b3AtMS8yIC10cmFuc2xhdGUteS0xLzIgdy03IGgtNyByb3VuZGVkLW1kIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGJnLWFtYmVyLTcwMC8zMCBob3ZlcjpiZy1hbWJlci02MDAvNTAgYm9yZGVyIGJvcmRlci1hbWJlci01MDAvNDAgdGV4dC1hbWJlci0yMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIxNFwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyLjRcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3t0cmFuc2Zvcm06IHNhdmVkT3BlbiA/ICdyb3RhdGUoMTgwZGVnKScgOiAnbm9uZScsIHRyYW5zaXRpb246J3RyYW5zZm9ybSAuMTVzJ319PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5bGluZSBwb2ludHM9XCI2IDkgMTIgMTUgMTggOVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzYXZlZE9wZW4gJiYgc2F2ZWRMb2NzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwibG9jLXNhdmVkLWRyb3Bkb3duXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSB6LVs2MDBdIGxlZnQtMCByaWdodC0wIHRvcC1mdWxsIG10LTEgYmctc2xhdGUtOTAwIGJvcmRlciBib3JkZXItc2xhdGUtNjAwIHJvdW5kZWQtbGcgc2hhZG93LTJ4bCBtYXgtaC02NCBvdmVyZmxvdy15LWF1dG9cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzYXZlZExvY3MubWFwKGxvYyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNBY3RpdmUgPSAoY2ZnLnNpdGVOYW1lIHx8ICcnKS50cmltKCkgPT09IGxvYy5uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIE1hdGguYWJzKGNmZy5sYXQgLSBsb2MubGF0KSA8IDFlLTRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgTWF0aC5hYnMoY2ZnLmxvbiAtIGxvYy5sb24pIDwgMWUtNDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBSb3cgaXMgYSA8ZGl2IHJvbGU9XCJidXR0b25cIj4gaW5zdGVhZCBvZiA8YnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvIHRoZSBpbi1yb3cgdHJhc2ggPGJ1dHRvbj4gaXNuJ3QgbmVzdGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zaWRlIGFub3RoZXIgaW50ZXJhY3RpdmUgZWxlbWVudC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByb3dLZXkgPSBgJHtsb2MubGF0LnRvRml4ZWQoNCl9LCR7bG9jLmxvbi50b0ZpeGVkKDQpfWA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17cm93S2V5fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvbGU9XCJidXR0b25cIiB0YWJJbmRleD17MH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBQaWNrIHRoZSByb3cgb25seSB3aGVuIHRoZSBvcGVyYXRvciBjbGlja3MgdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvb3JkL3doaXRlc3BhY2UgYXJlYSwgbm90IHRoZSByZW5hbWUgaW5wdXQgb3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIHRyYXNoIGJ1dHRvbiAodGhvc2Ugc3RvcFByb3BhZ2F0aW9uKS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlja1NhdmVkTG9jKGxvYyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbktleURvd249eyhlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJyB8fCBlLmtleSA9PT0gJyAnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWNrU2F2ZWRMb2MobG9jKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2Bsb2Mtc2F2ZWQtb3B0LSR7bG9jLm5hbWV9YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2Bncm91cCBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiBweC0zIHB5LTIgYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTgwMCBsYXN0OmJvcmRlci1iLTAgaG92ZXI6YmctYW1iZXItOTAwLzMwIHRyYW5zaXRpb24tY29sb3JzIGN1cnNvci1wb2ludGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2lzQWN0aXZlID8gJ2JnLWFtYmVyLTkwMC81MCcgOiAnJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xIG1pbi13LTBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogSW5saW5lIHJlbmFtZSBpbnB1dCAtLSB0eXBpbmcgaGVyZSB1cGRhdGVzIHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbi1tZW1vcnkgc2F2ZWRMb2NzIGVudHJ5OyBjbGlja2luZyBTYXZlICYgUmV0dXJuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcnNpc3RzIHRoZSB3aG9sZSBsaXN0IHRvIGxvY2FsU3RvcmFnZSBBTkQgdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZlci4gIHN0b3BQcm9wYWdhdGlvbiBrZWVwcyBhIGNsaWNrIG9uIHRoZSBpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tIHRyaWdnZXJpbmcgdGhlIHJvdydzIHBpY2sgaGFuZGxlci4gKi99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2Bsb2Mtc2F2ZWQtcmVuYW1lLSR7cm93S2V5fWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtsb2MubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiByZW5hbWVTYXZlZExvYyhsb2MsIGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uS2V5RG93bj17KGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEVudGVyIHdoaWxlIGVkaXRpbmcga2VlcHMgdGhlIGRyb3Bkb3duXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuIC0tIGZpbmFsaXNpbmcgcmVuYW1lIGhhcHBlbnMgYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNhdmUgJiBSZXR1cm4sIG5vdCBvbiBFbnRlci4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtgUmVuYW1lIHNhdmVkIGxvY2F0aW9uICR7bG9jLm5hbWV9YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGJnLXRyYW5zcGFyZW50IGJvcmRlci0wIG91dGxpbmUtbm9uZSB0ZXh0LXNtIHRleHQtc2xhdGUtMTAwIGZvbnQtbWVkaXVtIHB4LTAgcHktMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvY3VzOmJnLXNsYXRlLTgwMC82MCBmb2N1czpweC0xIGZvY3VzOnJvdW5kZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBob3ZlcjpiZy1zbGF0ZS04MDAvNDAgaG92ZXI6cHgtMSBob3Zlcjpyb3VuZGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbi1hbGxcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBmb250LW1vbm8gbXQtMC41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtsb2MubGF0LnRvRml4ZWQoMil9LCB7bG9jLmxvbi50b0ZpeGVkKDIpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogVHJhc2ggYnV0dG9uIC0tIGFsd2F5cyByZW5kZXJlZCwgZmFkZWQgdW50aWwgcm93LWhvdmVyIHNvIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9lc24ndCBjbHV0dGVyIHRoZSByZXN0aW5nIHN0YXRlLiAgc3RvcFByb3BhZ2F0aW9uIHByZXZlbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIHJvdydzIHBpY2sgaGFuZGxlciBmcm9tIGZpcmluZy4gKi99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17YGxvYy1zYXZlZC1yZW1vdmUtJHtsb2MubmFtZX1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtgUmVtb3ZlICR7bG9jLm5hbWV9YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9e2BSZW1vdmUgJHtsb2MubmFtZX0gZnJvbSBzYXZlZCBsb2NhdGlvbnNgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZSkgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyByZW1vdmVTYXZlZExvYyhsb2MpOyB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJzaHJpbmstMCB3LTcgaC03IHJvdW5kZWQtbWQgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0LXNsYXRlLTUwMCBob3Zlcjp0ZXh0LXJvc2UtMzAwIGhvdmVyOmJnLXJvc2UtOTAwLzMwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eS00MCBncm91cC1ob3ZlcjpvcGFjaXR5LTEwMCB0cmFuc2l0aW9uLW9wYWNpdHlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiMTRcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMi4yXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTMgNmgxOFwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk04IDZWNGEyIDIgMCAwIDEgMi0yaDRhMiAyIDAgMCAxIDIgMnYyXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTE5IDZsLTEuNSAxMy4yYTIgMiAwIDAgMS0yIDEuOEg4LjVhMiAyIDAgMCAxLTItMS44TDUgNlwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xMCAxMXY2TTE0IDExdjZcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0xIGl0YWxpY1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzYXZlZExvY3MubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdQaWNrIGEgcHJldmlvdXNseS1zYXZlZCBsb2NhdGlvbiwgb3IgdHlwZSBhIG5ldyBsYWJlbCBmb3IgdGhpcyBwbGFjZS4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ1lvdXIgbGFiZWwgZm9yIHRoaXMgcGxhY2Ug4oCUIHNob3duIG9uIHRoZSBkYXNoYm9hcmQgaGVhZGVyLid9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICB7LyogU29mdCBkdXBsaWNhdGUtbmFtZSB3YXJuaW5nIC0tIGlmIHRoZSBvcGVyYXRvciB0eXBlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGEgbmFtZSB0aGF0IGFscmVhZHkgZXhpc3RzIGluIHRoZSBzYXZlZCBsaXN0IEFUXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRElGRkVSRU5UIENPT1JESU5BVEVTLCBzdXJmYWNlIHRoYXQgc28gdGhleSBkb24ndFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpbGVudGx5IGVuZCB1cCB3aXRoIHR3byBcIkhPTUVcInMgcG9pbnRpbmcgdG8gdHdvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlmZmVyZW50IGFkZHJlc3NlcyAodGhlIGJ1ZyBvcGVyYXRvci1yZXBvcnRlZCBvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDIwMjYtMDYtMjg6IGRhc2hib2FyZCBoYWQgMsOXIEhPTUUsIFNldHVwIFdhbGtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93ZWQgb25seSAxKS4gIFNhbWUgY29vcmRzID0gbm8gd2FybmluZywgaXQnc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGp1c3QgcmUtc2VsZWN0aW5nIGEga25vd24gc2l0ZS4gKi99XG4gICAgICAgICAgICAgICAgICAgICAgICB7KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0eXBlZCA9IChjZmcuc2l0ZU5hbWUgfHwgJycpLnRyaW0oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXR5cGVkKSByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByb3VuZCA9IChuKSA9PiAoTWF0aC5yb3VuZChuICogMTAwMDApIC8gMTAwMDApLnRvRml4ZWQoNCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VyID0gcm91bmQoY2ZnLmxhdCkgKyAnLCcgKyByb3VuZChjZmcubG9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb25mbGljdCA9IHNhdmVkTG9jcy5maW5kKHMgPT4gcy5uYW1lID09PSB0eXBlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIChyb3VuZChzLmxhdCkgKyAnLCcgKyByb3VuZChzLmxvbikpICE9PSBjdXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY29uZmxpY3QpIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJsb2MtZHVwLW5hbWUtd2FyblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibXQtMiBweC0yLjUgcHktMiByb3VuZGVkLW1kIGJnLWFtYmVyLTk1MC80MCBib3JkZXIgYm9yZGVyLWFtYmVyLTcwMC81MCB0ZXh0LVsxMC41cHhdIHRleHQtYW1iZXItMjAwIGxlYWRpbmctc251Z1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGIgY2xhc3NOYW1lPVwidGV4dC1hbWJlci0xMDBcIj5TYW1lIG5hbWUgYWxyZWFkeSBzYXZlZDwvYj4gYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjb2RlIGNsYXNzTmFtZT1cIm14LTEgZm9udC1tb25vIHRleHQtYW1iZXItMTAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2NvbmZsaWN0LmxhdC50b0ZpeGVkKDIpfSwge2NvbmZsaWN0Lmxvbi50b0ZpeGVkKDIpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9jb2RlPi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNhdmluZyBrZWVwcyBib3RoOyBwaWNrIGZyb20gdGhlIGRyb3Bkb3duIGFib3ZlIHRvIHN3aXRjaCB0byB0aGUgZXhpc3Rpbmcgb25lIGluc3RlYWQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSgpfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvcmRlci10IGJvcmRlci1zbGF0ZS04MDAgcHQtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0xLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXNvbHZlZCBhZGRyZXNzIC8gY2l0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtnZW9CdXN5ICYmIDxzcGFuIGNsYXNzTmFtZT1cIm1sLTIgdGV4dC1hbWJlci00MDAgbm9ybWFsLWNhc2UgdHJhY2tpbmctbm9ybWFsXCI+4oCmIHJlc29sdmluZzwvc3Bhbj59XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiIHZhbHVlPXtjZmcuY2l0eX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpPT5zZXRDZmcoey4uLmNmZywgY2l0eTplLnRhcmdldC52YWx1ZX0pfS8+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0xLjVcIj57dCgnc3dfbGF0aXR1ZGUnKX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIiB0eXBlPVwibnVtYmVyXCIgc3RlcD1cIjAuMDAwMVwiIHZhbHVlPXtjZmcubGF0fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpPT5zZXRDZmcoey4uLmNmZywgbGF0OitlLnRhcmdldC52YWx1ZX0pfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0xLjVcIj57dCgnc3dfbG9uZ2l0dWRlJyl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCIgdHlwZT1cIm51bWJlclwiIHN0ZXA9XCIwLjAwMDFcIiB2YWx1ZT17Y2ZnLmxvbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKT0+c2V0Q2ZnKHsuLi5jZmcsIGxvbjorZS50YXJnZXQudmFsdWV9KX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17dXNlTXlMb2NhdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17Z2VvU3RhdGUgPT09ICdidXN5J31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImxvYy11c2UtbXktbG9jYXRpb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHctZnVsbCBweS0yLjUgcm91bmRlZC1sZyBib3JkZXIgdGV4dC14cyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgdHJhbnNpdGlvbi1jb2xvcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtnZW9TdGF0ZSA9PT0gJ2J1c3knXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1hbWJlci05MDAvNDAgYm9yZGVyLWFtYmVyLTcwMC80MCB0ZXh0LWFtYmVyLTIwMCBjdXJzb3Itd2FpdCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogKGdlb1N0YXRlICYmIGdlb1N0YXRlLmVyclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLXJvc2UtOTAwLzQwIGJvcmRlci1yb3NlLTUwMC81MCB0ZXh0LXJvc2UtMTAwIGhvdmVyOmJnLXJvc2UtODAwLzQwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLWFtYmVyLTcwMC83MCBib3JkZXItYW1iZXItNTAwLzQwIHRleHQtYW1iZXItNTAgaG92ZXI6YmctYW1iZXItNjAwLzcwJyl9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7Z2VvU3RhdGUgPT09ICdidXN5J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ+KPsyAgUmVhZGluZyBkZXZpY2UgbG9jYXRpb27igKYnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAn8J+TjSAgVXNlIG15IGRldmljZSBsb2NhdGlvbid9XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICB7Z2VvU3RhdGUgJiYgZ2VvU3RhdGUuZXJyICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJsb2MtZ2VvLWVycm9yXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiLW10LTIgcHgtMyBweS0yIHJvdW5kZWQtbWQgYmctcm9zZS05NTAvNTAgYm9yZGVyIGJvcmRlci1yb3NlLTcwMC80MCB0ZXh0LVsxMXB4XSBsZWFkaW5nLXNudWcgdGV4dC1yb3NlLTIwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxiIGNsYXNzTmFtZT1cInRleHQtcm9zZS0xMDBcIj5Db3VsZG4ndCByZWFkIGxvY2F0aW9uLjwvYj48YnIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtcm9zZS0yMDAvOTBcIj57Z2VvU3RhdGUuZXJyfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogU3BlY2lmaWMgSFRUUC1vcmlnaW4gY2FsbC1vdXQ6IG1vc3QgbGlrZWx5IGNhdXNlIG9uIGEgVjEuOSBjb250cm9sbGVyLiAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmxvY2F0aW9uICYmIHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2h0dHA6JyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtMS41IHRleHQtWzEwcHhdIHRleHQtcm9zZS0zMDAvODAgZm9udC1tb25vXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXA6IGJyb3dzZXJzIHJlcXVpcmUgSFRUUFMgZm9yIGdlb2xvY2F0aW9uLiAgUGljayB0aGUgbG9jYXRpb24gb24gdGhlIG1hcCBvciBzZWFyY2ggYmFyIGluc3RlYWQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvcmRlci10IGJvcmRlci1zbGF0ZS04MDAgcHQtMyBtdC0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj57dCgnc3dfcXVpY2tfanVtcHMnKX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtMS41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidUb3JvbnRvLCBPTicsICAgbGF0OjQzLjY1MzIsIGxvbjotNzkuMzgzMiwgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J05ldyBZb3JrLCBOWScsICBsYXQ6NDAuNzEyOCwgbG9uOi03NC4wMDYwLCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonTG9uZG9uLCBVSycsICAgIGxhdDo1MS41MDc0LCBsb246IC0wLjEyNzgsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidQYXJpcywgRlInLCAgICAgbGF0OjQ4Ljg1NjYsIGxvbjogIDIuMzUyMiwgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J1Rva3lvLCBKUCcsICAgICBsYXQ6MzUuNjc2MiwgbG9uOjEzOS42NTAzLCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonU3lkbmV5LCBBVScsICAgIGxhdDotMzMuODY4OCxsb246MTUxLjIwOTMsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLm1hcChqID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e2oubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgbGF0OmoubGF0LCBsb246ai5sb24sIGNpdHk6ai5uYW1lfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFwUmVmLmN1cnJlbnQpIG1hcFJlZi5jdXJyZW50LnNldFZpZXcoW2oubGF0LCBqLmxvbl0sIGoueik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LWxlZnQgcHgtMi41IHB5LTEuNSByb3VuZGVkLW1kIGJnLXNsYXRlLTgwMC83MCBib3JkZXIgYm9yZGVyLXNsYXRlLTcwMCB0ZXh0LVsxMXB4XSBmb250LWJvbGQgdGV4dC1zbGF0ZS0zMDAgaG92ZXI6Ymctc2xhdGUtNzAwIGhvdmVyOmJvcmRlci1hbWJlci01MDAvNDAgdHJhbnNpdGlvbi1hbGxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtqLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgVGlsZXM6IE9wZW5TdHJlZXRNYXAgwrcgR2VvY29kZTogTm9taW5hdGltIChmcmVlLCB+MSByZXEvcykuXG4gICAgICAgICAgICAgICAgICAgICAgICBVc2VkIGZvciBPcGVuLU1ldGVvIHdlYXRoZXIgZmVlZCBhbmQgc3VucmlzZS9zdW5zZXQgZXN0aW1hdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvTW9kYWxTaGVsbD5cbiAgICApO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBMYW5ndWFnZSBTZXR0aW5nIC0tIG1vZGFsXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5mdW5jdGlvbiBMYW5ndWFnZU1vZGFsKHsgY2ZnLCBzZXRDZmcsIG9uQ2xvc2UsIG9uU2F2ZSB9KSB7XG4gICAgY29uc3QgbGFuZ3MgPSBbXG4gICAgICAgIHsgY29kZTonZW4nLCAgICBsYWJlbDonRW5nbGlzaCcsICAgICAgICAgICAgICAgIG5hdGl2ZTonRW5nbGlzaCcgICAgfSxcbiAgICAgICAgeyBjb2RlOid6aC1DTicsIGxhYmVsOidDaGluZXNlIChTaW1wbGlmaWVkKScsICAgbmF0aXZlOifnroDkvZPkuK3mlocnICAgIH0sXG4gICAgICAgIHsgY29kZTonemgtVFcnLCBsYWJlbDonQ2hpbmVzZSAoVHJhZGl0aW9uYWwpJywgIG5hdGl2ZTon57mB6auU5Lit5paHJyAgICB9LFxuICAgICAgICB7IGNvZGU6J2phJywgICAgbGFiZWw6J0phcGFuZXNlJywgICAgICAgICAgICAgICBuYXRpdmU6J+aXpeacrOiqnicgICAgICB9LFxuICAgICAgICB7IGNvZGU6J2tvJywgICAgbGFiZWw6J0tvcmVhbicsICAgICAgICAgICAgICAgICBuYXRpdmU6J+2VnOq1reyWtCcgICAgICB9LFxuICAgIF07XG5cbiAgICAvKiBPbiBTYXZlICYgcmV0dXJuOiB3cml0ZSB0aGUgcGlja2VkIGxhbmd1YWdlIGNvZGUgdG8gdGhlIHNhbWVcbiAgICAgKiBsb2NhbFN0b3JhZ2Uga2V5IHRoZSBkYXNoYm9hcmQncyBpMThuLmpzIHJlYWRzIChgaTE4bl9sYW5nYCksIGFuZFxuICAgICAqIGRpc3BhdGNoIHRoZSBgbGFuZ2NoYW5nZWAgZXZlbnQgc28gYW55IG9wZW4gZGFzaGJvYXJkL2NvbmZpZyB0YWJcbiAgICAgKiBwaWNrcyBpdCB1cCBsaXZlLiAgVGhpcyBpcyB3aGF0IG1ha2VzIHRoZSBzZXR1cCB3YWxrJ3MgbGFuZ3VhZ2VcbiAgICAgKiBjaG9pY2UgYWN0dWFsbHkgZHJpdmUgdGhlIGRhc2hib2FyZCAvIGNvbmZpZyAvIG1hcHBlciBVSSAtLSB0aGVcbiAgICAgKiBzaWRlYmFyIHNlbGVjdG9yIHRoYXQgdXNlZCB0byBsaXZlIGluIHRoZSBkYXNoYm9hcmQgaGVhZGVyIGhhc1xuICAgICAqIGJlZW4gcmVtb3ZlZCAoMjAyNi0wNi0yNikgYW5kIHRoZSBzZXR1cCB3YWxrIGlzIG5vdyB0aGUgc2luZ2xlXG4gICAgICogc291cmNlIG9mIHRydXRoIGZvciBVSSBsYW5ndWFnZS4gKi9cbiAgICBjb25zdCBwZXJzaXN0QW5kU2F2ZSA9ICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdpMThuX2xhbmcnLCBjZmcubGFuZyk7XG4gICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2xhbmdjaGFuZ2UnKSk7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ1tzZXR1cCB3YWxrXSBpMThuX2xhbmcgPC0nLCBjZmcubGFuZyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignW3NldHVwIHdhbGtdIGNvdWxkIG5vdCBwZXJzaXN0IGxhbmd1YWdlOicsIGUpO1xuICAgICAgICB9XG4gICAgICAgIG9uU2F2ZSgpO1xuICAgIH07XG4gICAgcmV0dXJuIChcbiAgICAgICAgPE1vZGFsU2hlbGwgdGl0bGU9e3QoJ3N3X2xhbmd1YWdlX3NldHRpbmcnKX0gc3VidGl0bGU9e3QoJ3N3X2xhbmd1YWdlX3N1YicpfSBhY2NlbnQ9XCJlbWVyYWxkXCIgb25DbG9zZT17b25DbG9zZX0gb25TYXZlPXtwZXJzaXN0QW5kU2F2ZX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTNcIj5cbiAgICAgICAgICAgICAgICB7bGFuZ3MubWFwKGwgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGtleT17bC5jb2RlfSBvbkNsaWNrPXsoKT0+c2V0Q2ZnKHsuLi5jZmcsIGxhbmc6bC5jb2RlfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdGV4dC1sZWZ0IHAtMyByb3VuZGVkLXhsIGJvcmRlci0yIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Y2ZnLmxhbmcgPT09IGwuY29kZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYm9yZGVyLWVtZXJhbGQtNTAwIGJnLWVtZXJhbGQtOTAwLzIwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYm9yZGVyLXNsYXRlLTcwMCBiZy1zbGF0ZS04MDAvNDAgaG92ZXI6Ymctc2xhdGUtODAwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIHRleHQtc2xhdGUtNTAwXCI+e2wuY29kZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LWJsYWNrIHRleHQtc2xhdGUtMjAwXCI+e2wubmF0aXZlfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMXB4XSB0ZXh0LXNsYXRlLTUwMFwiPntsLmxhYmVsfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L01vZGFsU2hlbGw+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogUGx1Zy1pbiBTZXR0aW5nIC0tIG1vZGFsIHcvIGxpc3QgKyB1cGxvYWQgem9uZVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLyogUGVyLXBsdWctaW4gbW9jayBjb25maWd1cmF0aW9uIGZpZWxkcy4gIEtleXMgbWFwIHRvIHBsdWctaW4gYGlkYC4gKi9cbmNvbnN0IFBMVUdJTl9DT05GSUdfRklFTERTID0ge1xuICAgIHdlYXRoZXI6ICAgIFtcbiAgICAgICAgeyBrZXk6J3Byb3ZpZGVyJywgIGxhYmVsOidQcm92aWRlcicsICAgICAgICAgIHR5cGU6J3NlbGVjdCcsICBvcHRpb25zOlsnT3Blbi1NZXRlbycsJ05XUycsJ0VDTVdGJ10sIGRlZjonT3Blbi1NZXRlbycgfSxcbiAgICAgICAgeyBrZXk6J3JlZnJlc2gnLCAgIGxhYmVsOidSZWZyZXNoIGludGVydmFsJywgIHR5cGU6J3NlbGVjdCcsICBvcHRpb25zOlsnMSBtaW4nLCc1IG1pbicsJzE1IG1pbicsJzMwIG1pbicsJzEgaCddLCBkZWY6JzE1IG1pbicgfSxcbiAgICAgICAgeyBrZXk6J2NhY2hlJywgICAgIGxhYmVsOidDYWNoZSBUVEwgKG1pbiknLCAgIHR5cGU6J251bWJlcicsICBkZWY6MzAgfSxcbiAgICBdLFxuICAgIGdpdm9uaTogICAgIFtcbiAgICAgICAgeyBrZXk6J2NsaW1hdGUnLCAgIGxhYmVsOidDbGltYXRlIG1vZGVsJywgICAgIHR5cGU6J3NlbGVjdCcsICBvcHRpb25zOlsnR2l2b25pIDE5OTInLCdBU0hSQUUgNTUnLCdBZGFwdGl2ZSddLCBkZWY6J0dpdm9uaSAxOTkyJyB9LFxuICAgICAgICB7IGtleTonbWFzc2l2ZScsICAgbGFiZWw6J0hlYXZ5d2VpZ2h0IGNvbnN0cnVjdGlvbicsICB0eXBlOid0b2dnbGUnLCBkZWY6ZmFsc2UgfSxcbiAgICBdLFxuICAgIHN3ZWV0X3Nwb3Q6IFtcbiAgICAgICAgeyBrZXk6J3RyYWNraW5nJywgIGxhYmVsOidUcmFjayBvdXRkb29yIFJIJywgIHR5cGU6J3RvZ2dsZScsIGRlZjp0cnVlIH0sXG4gICAgICAgIHsga2V5OidoeXN0JywgICAgICBsYWJlbDonSHlzdGVyZXNpcyAoJSBSSCknLCB0eXBlOidudW1iZXInLCBkZWY6MiB9LFxuICAgIF0sXG4gICAgZzM2OiAgICAgICAgW1xuICAgICAgICB7IGtleTonbW9kZScsICAgICAgbGFiZWw6J1NlcXVlbmNlIG1vZGUnLCAgICAgdHlwZTonc2VsZWN0JywgIG9wdGlvbnM6WydTaW5nbGUtem9uZSBWQVYnLCdNdWx0aS16b25lIFZBVicsJ0RPQVMgdy8gRkNVJ10sIGRlZjonTXVsdGktem9uZSBWQVYnIH0sXG4gICAgICAgIHsga2V5Oid2ZXJib3NlJywgICBsYWJlbDonVmVyYm9zZSBsb2dnaW5nJywgICB0eXBlOid0b2dnbGUnLCBkZWY6ZmFsc2UgfSxcbiAgICBdLFxuICAgIGRpYnQ6ICAgICAgIFtcbiAgICAgICAgeyBrZXk6J2hvc3QnLCAgICAgIGxhYmVsOidCcmlkZ2UgaG9zdCcsICAgICAgIHR5cGU6J3RleHQnLCAgIGRlZjonMTkyLjE2OC4xLjEwMCcgfSxcbiAgICAgICAgeyBrZXk6J3BvcnQnLCAgICAgIGxhYmVsOidUZWxlZ3JhbSBwb3J0JywgICAgIHR5cGU6J251bWJlcicsIGRlZjo0NzgwOCB9LFxuICAgICAgICB7IGtleToncG9sbF9tcycsICAgbGFiZWw6J1BvbGwgaW50ZXJ2YWwgKG1zKScsdHlwZTonbnVtYmVyJywgZGVmOjIwMDAgfSxcbiAgICBdLFxuICAgIGxpZ2h0aW5nOiAgIFtcbiAgICAgICAgeyBrZXk6J2dhdGV3YXknLCAgIGxhYmVsOidNb2RidXMgZ2F0ZXdheSBJUCcsIHR5cGU6J3RleHQnLCAgIGRlZjonMTAuMC4wLjUwJyB9LFxuICAgICAgICB7IGtleTondW5pdF9pZCcsICAgbGFiZWw6J1VuaXQgSUQnLCAgICAgICAgICAgdHlwZTonbnVtYmVyJywgZGVmOjEgfSxcbiAgICAgICAgeyBrZXk6J3RjcF9wb3J0JywgIGxhYmVsOidUQ1AgcG9ydCcsICAgICAgICAgIHR5cGU6J251bWJlcicsIGRlZjo1MDIgfSxcbiAgICBdLFxufTtcblxuZnVuY3Rpb24gUGx1Z2luc01vZGFsKHsgY2ZnLCBzZXRDZmcsIG9uQ2xvc2UsIG9uU2F2ZSB9KSB7XG4gICAgY29uc3QgQUxMID0gW1xuICAgICAgICB7IGlkOid3ZWF0aGVyJywgICAgIG5hbWU6J1dlYXRoZXInLCAgICAgICAgIGRlc2M6J09wZW4tTWV0ZW8gT0EgZmVlZCcsICAgICAgICAgIHZlcjonMi4xLjAnIH0sXG4gICAgICAgIHsgaWQ6J2dpdm9uaScsICAgICAgbmFtZTonR2l2b25pIEVuZ2luZScsICAgZGVzYzonQ2xpbWF0ZS1zdHJhdGVneSBvdmVybGF5JywgICAgdmVyOicxLjMuNCcgfSxcbiAgICAgICAgeyBpZDonc3dlZXRfc3BvdCcsICBuYW1lOidTd2VldC1TcG90IFJIJywgICBkZXNjOidBZGp1c3RhYmxlIFJIIGJhbmQnLCAgICAgICAgICB2ZXI6JzEuMC4xJyB9LFxuICAgICAgICB7IGlkOidnMzYnLCAgICAgICAgIG5hbWU6J0czNiBTZXF1ZW5jZXMnLCAgIGRlc2M6J0FTSFJBRSBHdWlkZWxpbmUgMzYnLCAgICAgICAgIHZlcjonMC45LjInIH0sXG4gICAgICAgIHsgaWQ6J2RpYnQnLCAgICAgICAgbmFtZTonRElCVCBCcmlkZ2UnLCAgICAgZGVzYzonRGVsdGEgQ29udHJvbHMgKERJQlQpIEJBQ25ldCBicmlkZ2UnLCAgICAgICAgICAgdmVyOicwLjQuMCcgfSxcbiAgICAgICAgeyBpZDonbGlnaHRpbmcnLCAgICBuYW1lOidMaWdodGluZyAoUmVkNSknLCBkZXNjOidWMy4wIE1vZGJ1cyBUQ1AgY2xpZW50JywgICAgICB2ZXI6JzAuMS4wLWJldGEnIH0sXG4gICAgXTtcbiAgICBjb25zdCB0b2dnbGUgPSAoaWQpID0+IHNldENmZyhjID0+ICh7XG4gICAgICAgIC4uLmMsXG4gICAgICAgIGVuYWJsZWQ6IGMuZW5hYmxlZC5pbmNsdWRlcyhpZCkgPyBjLmVuYWJsZWQuZmlsdGVyKHggPT4geCAhPT0gaWQpIDogWy4uLmMuZW5hYmxlZCwgaWRdXG4gICAgfSkpO1xuXG4gICAgLyogZXhwYW5zaW9uIHN0YXRlIOKAlCB3aGljaCBwbHVnLWluJ3MgXCJDb25maWd1cmVcIiBwYW5lbCBpcyBvcGVuICovXG4gICAgY29uc3QgW2V4cGFuZGVkSWQsIHNldEV4cGFuZGVkSWRdID0gUmVhY3QudXNlU3RhdGUobnVsbCk7XG5cbiAgICBjb25zdCB1cGRhdGVGaWVsZCA9IChwbHVnaW5JZCwgZmllbGRLZXksIHZhbHVlKSA9PiB7XG4gICAgICAgIHNldENmZyhjID0+ICh7XG4gICAgICAgICAgICAuLi5jLFxuICAgICAgICAgICAgZmllbGRzOiB7IC4uLihjLmZpZWxkcyB8fCB7fSksIFtwbHVnaW5JZF06IHsgLi4uKChjLmZpZWxkcyB8fCB7fSlbcGx1Z2luSWRdIHx8IHt9KSwgW2ZpZWxkS2V5XTogdmFsdWUgfSB9XG4gICAgICAgIH0pKTtcbiAgICB9O1xuXG4gICAgY29uc3QgZmllbGRWYWwgPSAocGx1Z2luSWQsIGZpZWxkKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0b3JlZCA9IGNmZy5maWVsZHMgJiYgY2ZnLmZpZWxkc1twbHVnaW5JZF0gJiYgY2ZnLmZpZWxkc1twbHVnaW5JZF1bZmllbGQua2V5XTtcbiAgICAgICAgcmV0dXJuIHN0b3JlZCAhPT0gdW5kZWZpbmVkID8gc3RvcmVkIDogZmllbGQuZGVmO1xuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8TW9kYWxTaGVsbCB0aXRsZT17dCgnc3dfcGx1Z2luX3NldHRpbmcnKX0gc3VidGl0bGU9e3QoJ3N3X3BsdWdpbl9zdWInKX0gYWNjZW50PVwicGlua1wiIG9uQ2xvc2U9e29uQ2xvc2V9IG9uU2F2ZT17b25TYXZlfSBzaXplPVwid2lkZVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTMgbWF4LWgtWzYwdmhdIG92ZXJmbG93LXktYXV0byBwci0xXCI+XG4gICAgICAgICAgICAgICAge0FMTC5tYXAocCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9uID0gY2ZnLmVuYWJsZWQuaW5jbHVkZXMocC5pZCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4cGFuZGVkID0gZXhwYW5kZWRJZCA9PT0gcC5pZDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmllbGRzID0gUExVR0lOX0NPTkZJR19GSUVMRFNbcC5pZF0gfHwgW107XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17cC5pZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcm91bmRlZC14bCBib3JkZXIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtvbiA/ICdib3JkZXItcGluay01MDAvNDAgYmctcGluay05MDAvMTAnIDogJ2JvcmRlci1zbGF0ZS03MDAgYmctc2xhdGUtODAwLzQwJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtleHBhbmRlZCA/ICdyaW5nLTEgcmluZy1waW5rLTUwMC8zMCcgOiAnJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBwLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LWJsYWNrIHRleHQtc2xhdGUtMTAwXCI+e3AubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtbC0yIHRleHQtWzEwcHhdIGZvbnQtbW9ubyB0ZXh0LXNsYXRlLTUwMFwiPnZ7cC52ZXJ9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS00MDBcIj57cC5kZXNjfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB0b2dnbGUocC5pZCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgcGx1Z2luLXRvZ2dsZS0ke3AuaWR9YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHgtMyBweS0xIHJvdW5kZWQtbWQgdGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIGJvcmRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtvbiA/ICdib3JkZXItcGluay01MDAvNjAgdGV4dC1waW5rLTMwMCBiZy1waW5rLTkwMC8zMCcgOiAnYm9yZGVyLXNsYXRlLTYwMCB0ZXh0LXNsYXRlLTQwMCBiZy1zbGF0ZS04MDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtvbiA/IHQoJ3N3X2VuYWJsZWQnKSA6IHQoJ3N3X2Rpc2FibGVkJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gc2V0RXhwYW5kZWRJZChleHBhbmRlZCA/IG51bGwgOiBwLmlkKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BwbHVnaW4tY29uZmlnLSR7cC5pZH1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweC0zIHB5LTEgcm91bmRlZC1tZCB0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgYm9yZGVyIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2V4cGFuZGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYm9yZGVyLXBpbmstNTAwIGJnLXBpbmstOTAwLzMwIHRleHQtcGluay0yMDAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYm9yZGVyLXNsYXRlLTYwMCB0ZXh0LXNsYXRlLTQwMCBiZy1zbGF0ZS04MDAgaG92ZXI6Ymctc2xhdGUtNzAwIGhvdmVyOmJvcmRlci1waW5rLTUwMC81MCBob3Zlcjp0ZXh0LXBpbmstMzAwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZXhwYW5kZWQgPyB0KCdzd19jbG9zZV91cCcpIDogdCgnc3dfY29uZmlndXJlX2RkJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2V4cGFuZGVkICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJweC00IHBiLTQgYm9yZGVyLXQgYm9yZGVyLXBpbmstNTAwLzIwIGJnLXNsYXRlLTk1MC80MFwiIGRhdGEtdGVzdGlkPXtgcGx1Z2luLWNvbmZpZy1wYW5lbC0ke3AuaWR9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZmllbGRzLmxlbmd0aCA9PT0gMCA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtc2xhdGUtNTAwIGl0YWxpYyBweS0zXCI+Tm8gY29uZmlndXJhYmxlIG9wdGlvbnMgZm9yIHRoaXMgcGx1Zy1pbiB5ZXQuPC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbWQ6Z3JpZC1jb2xzLTIgZ2FwLTMgcHQtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZmllbGRzLm1hcChmID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHYgPSBmaWVsZFZhbChwLmlkLCBmKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e2Yua2V5fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwIGJsb2NrIG1iLTFcIj57Zi5sYWJlbH08L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi50eXBlID09PSAnc2VsZWN0JyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0IGN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3Z9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlRmllbGQocC5pZCwgZi5rZXksIGUudGFyZ2V0LnZhbHVlKX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2Yub3B0aW9ucy5tYXAobyA9PiA8b3B0aW9uIGtleT17b30gdmFsdWU9e299PntvfTwvb3B0aW9uPil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2YudHlwZSA9PT0gJ251bWJlcicgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJudW1iZXJcIiBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3Z9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGVGaWVsZChwLmlkLCBmLmtleSwgK2UudGFyZ2V0LnZhbHVlKX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi50eXBlID09PSAndGV4dCcgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt2fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlRmllbGQocC5pZCwgZi5rZXksIGUudGFyZ2V0LnZhbHVlKX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi50eXBlID09PSAndG9nZ2xlJyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHVwZGF0ZUZpZWxkKHAuaWQsIGYua2V5LCAhdil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHctZnVsbCBweS0yIHJvdW5kZWQtbGcgdGV4dC14cyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgYm9yZGVyIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3ZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1waW5rLTcwMC80MCBib3JkZXItcGluay01MDAvNjAgdGV4dC1waW5rLTIwMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1zbGF0ZS04MDAgYm9yZGVyLXNsYXRlLTYwMCB0ZXh0LXNsYXRlLTQwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3YgPyAnT04nIDogJ09GRid9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1lbmQgZ2FwLTIgbXQtNCBwdC0zIGJvcmRlci10IGJvcmRlci1zbGF0ZS04MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXNldCB0aGlzIHBsdWctaW4ncyBmaWVsZHMgdG8gZGVmYXVsdHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRDZmcoYyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHQgPSB7IC4uLihjLmZpZWxkcyB8fCB7fSkgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG5leHRbcC5pZF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IC4uLmMsIGZpZWxkczogbmV4dCB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTMgcHktMS41IHJvdW5kZWQtbWQgdGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIGJvcmRlciBib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtNDAwIGhvdmVyOmJnLXNsYXRlLTgwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dCgnc3dfcmVzZXRfZGVmYXVsdHMnKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHNldEV4cGFuZGVkSWQobnVsbCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC0zIHB5LTEuNSByb3VuZGVkLW1kIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayBiZy1waW5rLTYwMCBob3ZlcjpiZy1waW5rLTUwMCB0ZXh0LXdoaXRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0KCdzd19kb25lJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNSBwLTQgYm9yZGVyLTIgYm9yZGVyLWRhc2hlZCBib3JkZXItc2xhdGUtNzAwIHJvdW5kZWQteGwgdGV4dC1jZW50ZXIgaG92ZXI6Ym9yZGVyLXBpbmstNTAwLzQwIHRyYW5zaXRpb24tYWxsIGN1cnNvci1wb2ludGVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LTN4bCBtYi0xXCI+4qS0PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS0zMDBcIj5Ecm9wIGEgLnB5IC8gLnppcCAvIC5yZWQ1IHBsdWctaW4gaGVyZTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTFweF0gdGV4dC1zbGF0ZS01MDAgbXQtMVwiPm9yIGNsaWNrIHRvIGNob29zZSBhIGZpbGUgKG1vY2sg4oCUIG5vdCB3aXJlZCk8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L01vZGFsU2hlbGw+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTW9kYWwgU2hlbGwgLS0gc2hhcmVkXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5mdW5jdGlvbiBNb2RhbFNoZWxsKHsgdGl0bGUsIHN1YnRpdGxlLCBhY2NlbnQ9J2luZGlnbycsIG9uQ2xvc2UsIG9uU2F2ZSwgc2l6ZT0nJywgY2hpbGRyZW4gfSkge1xuICAgIGNvbnN0IGNvbG9yTWFwID0ge1xuICAgICAgICBpbmRpZ286JyM4MThjZjgnLCBhbWJlcjonI2ZiYmYyNCcsIGVtZXJhbGQ6JyMzNGQzOTknLCBwaW5rOicjZjQ3MmI2J1xuICAgIH07XG4gICAgY29uc3QgYyA9IGNvbG9yTWFwW2FjY2VudF0gfHwgJyM4MThjZjgnO1xuICAgIGNvbnN0IHNpemVNYXAgPSB7XG4gICAgICAgIHdpZGU6ICdtYXgtdy0yeGwnLFxuICAgICAgICBtYXA6ICAnbWF4LXctM3hsJyxcbiAgICAgICAgbWF4OiAgJ21heC13LVs5NnZ3XSB3LVs5NnZ3XSBoLVs5MnZoXScsXG4gICAgfTtcbiAgICBjb25zdCB3aWR0aCA9IHNpemVNYXBbc2l6ZV0gfHwgJ21heC13LW1kJztcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpeGVkIGluc2V0LTAgei01MCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBtb2RhbC1iYWNrZHJvcFwiIG9uQ2xpY2s9e29uQ2xvc2V9PlxuICAgICAgICAgICAgey8qIEZsZXgtY29sdW1uIHNoZWxsOiBoZWFkZXIgKGZpeGVkKSArIHNjcm9sbGFibGUgY29udGVudCArIHN0aWNreSBmb290ZXIuXG4gICAgICAgICAgICAgICAgQ3JpdGljYWwgZm9yIHNpemU9XCJtYXhcIiB3aGVyZSBjaGlsZHJlbiBhbG9uZSBleGNlZWQgdGhlIG1vZGFsIGhlaWdodFxuICAgICAgICAgICAgICAgIGFuZCB3b3VsZCBvdGhlcndpc2UgcHVzaCB0aGUgU2F2ZSAmIHJldHVybiBidXR0b24gYmVsb3cgdGhlIHZpZXdwb3J0LiAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgYmctc2xhdGUtOTAwIGJvcmRlci0yIHJvdW5kZWQtMnhsIHctZnVsbCAke3dpZHRofSBteC00IGZhZGUtdXAgZmxleCBmbGV4LWNvbGB9XG4gICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpfVxuICAgICAgICAgICAgICAgICBzdHlsZT17e2JvcmRlckNvbG9yOmAke2N9NjZgLCBtYXhIZWlnaHQ6ICc5MnZoJ319PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1zdGFydCBqdXN0aWZ5LWJldHdlZW4gcC02IHBiLTQgYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTgwMC82MCBzaHJpbmstMFwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtbGcgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0XCIgc3R5bGU9e3tjb2xvcjpjfX0+e3RpdGxlfTwvaDM+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtc2xhdGUtNTAwIG10LTFcIj57c3VidGl0bGV9PC9wPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cIm1vZGFsLWNsb3NlXCIgb25DbGljaz17b25DbG9zZX0gY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgaG92ZXI6dGV4dC13aGl0ZSB0ZXh0LTJ4bCBsZWFkaW5nLW5vbmVcIj7DlzwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xIG1pbi1oLTAgb3ZlcmZsb3cteS1hdXRvIHB4LTYgcHktNVwiPlxuICAgICAgICAgICAgICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWVuZCBnYXAtMyBweC02IHB5LTQgYm9yZGVyLXQgYm9yZGVyLXNsYXRlLTgwMCBzaHJpbmstMCBiZy1zbGF0ZS05MDAgcm91bmRlZC1iLTJ4bFwiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwibW9kYWwtY2FuY2VsXCIgb25DbGljaz17b25DbG9zZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC00IHB5LTIgcm91bmRlZC1sZyBiZy1zbGF0ZS04MDAgYm9yZGVyIGJvcmRlci1zbGF0ZS03MDAgdGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS00MDAgaG92ZXI6Ymctc2xhdGUtNzAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dCgnY2FuY2VsJyl9XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwibW9kYWwtc2F2ZVwiIG9uQ2xpY2s9e29uU2F2ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC01IHB5LTIgcm91bmRlZC1sZyB0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayB0ZXh0LXdoaXRlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6YywgYm94U2hhZG93OmAwIDAgMTJweCAke2N9NTVgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dCgnc3dfc2F2ZV9yZXR1cm4nKX1cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuLyogbW91bnQgKi9cblJlYWN0RE9NLmNyZWF0ZVJvb3QoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKSkucmVuZGVyKDxBcHAvPik7XG59KSgpO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxZQUFZO0VBQ2IsSUFBQUEsTUFBQSxHQUE4QkMsS0FBSztJQUEzQkMsUUFBUSxHQUFBRixNQUFBLENBQVJFLFFBQVE7SUFBRUMsT0FBTyxHQUFBSCxNQUFBLENBQVBHLE9BQU87O0VBRXpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7RUFDQSxJQUFNQyxDQUFDLEdBQUlDLENBQUMsSUFBTSxPQUFPQyxNQUFNLEtBQUssV0FBVyxJQUFJQSxNQUFNLENBQUNGLENBQUMsR0FBR0UsTUFBTSxDQUFDRixDQUFDLENBQUNDLENBQUMsQ0FBQyxHQUFHQSxDQUFFO0VBQzlFLElBQU1FLE9BQU8sR0FBR0EsQ0FBQSxLQUFPLE9BQU9ELE1BQU0sS0FBSyxXQUFXLElBQUlBLE1BQU0sQ0FBQ0MsT0FBTyxHQUFHRCxNQUFNLENBQUNDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSzs7RUFFakc7QUFDQTtBQUNBO0VBQ0EsSUFBTUMsS0FBSyxHQUFHO0VBQ1Y7QUFDSjtBQUNBO0FBQ0E7QUFDQTtFQUNJO0lBQUVDLEdBQUcsRUFBQyxLQUFLO0lBQU9DLFFBQVEsRUFBQyxhQUFhO0lBQU9DLE1BQU0sRUFBQyxpQkFBaUI7SUFBT0MsSUFBSSxFQUFDLE1BQU07SUFBR0MsU0FBUyxFQUFDLFNBQVM7SUFBRUMsTUFBTSxFQUFDO0VBQVMsQ0FBQyxFQUNsSTtJQUFFTCxHQUFHLEVBQUMsVUFBVTtJQUFFQyxRQUFRLEVBQUMsa0JBQWtCO0lBQUVDLE1BQU0sRUFBQyxzQkFBc0I7SUFBRUMsSUFBSSxFQUFDLE9BQU87SUFBRUMsU0FBUyxFQUFDLFNBQVM7SUFBRUMsTUFBTSxFQUFDO0VBQVMsQ0FBQyxFQUNsSTtJQUFFTCxHQUFHLEVBQUMsVUFBVTtJQUFFQyxRQUFRLEVBQUMsa0JBQWtCO0lBQUVDLE1BQU0sRUFBQyxzQkFBc0I7SUFBRUMsSUFBSSxFQUFDLE9BQU87SUFBRUMsU0FBUyxFQUFDLFNBQVM7SUFBRUMsTUFBTSxFQUFDO0VBQVMsQ0FBQyxFQUNsSTtJQUFFTCxHQUFHLEVBQUMsU0FBUztJQUFHQyxRQUFRLEVBQUMsZ0JBQWdCO0lBQUlDLE1BQU0sRUFBQyxvQkFBb0I7SUFBSUMsSUFBSSxFQUFDLE9BQU87SUFBRUMsU0FBUyxFQUFDLFNBQVM7SUFBRUMsTUFBTSxFQUFDO0VBQVMsQ0FBQyxFQUNsSTtJQUFFTCxHQUFHLEVBQUMsUUFBUTtJQUFJQyxRQUFRLEVBQUMsZ0JBQWdCO0lBQUlDLE1BQU0sRUFBQyxvQkFBb0I7SUFBSUMsSUFBSSxFQUFDLE1BQU07SUFBR0MsU0FBUyxFQUFDLFNBQVM7SUFBRUMsTUFBTSxFQUFDLE1BQU07SUFBRUMsSUFBSSxFQUFDO0VBQTBCLENBQUMsQ0FDbks7O0VBRUQ7QUFDQTtBQUNBO0VBQ0EsU0FBU0MsR0FBR0EsQ0FBQSxFQUFHO0lBQ1hULE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBRztJQUNiO0lBQ0EsSUFBQVUsU0FBQSxHQUF3QmYsUUFBUSxDQUFDO1FBQUVnQixHQUFHLEVBQUMsS0FBSztRQUFFQyxRQUFRLEVBQUMsS0FBSztRQUFFQyxRQUFRLEVBQUMsS0FBSztRQUFFQyxPQUFPLEVBQUMsS0FBSztRQUFFQyxNQUFNLEVBQUM7TUFBTSxDQUFDLENBQUM7TUFBQUMsVUFBQSxHQUFBQyxjQUFBLENBQUFQLFNBQUE7TUFBckdRLElBQUksR0FBQUYsVUFBQTtNQUFFRyxPQUFPLEdBQUFILFVBQUE7SUFDcEIsSUFBQUksVUFBQSxHQUEwQnpCLFFBQVEsQ0FBQyxLQUFLLENBQUM7TUFBQTBCLFVBQUEsR0FBQUosY0FBQSxDQUFBRyxVQUFBO01BQWxDRSxLQUFLLEdBQUFELFVBQUE7TUFBRUUsUUFBUSxHQUFBRixVQUFBLElBQW9CLENBQUc7SUFDN0MsSUFBQUcsVUFBQSxHQUEwQjdCLFFBQVEsQ0FBQyxJQUFJLENBQUM7TUFBQThCLFVBQUEsR0FBQVIsY0FBQSxDQUFBTyxVQUFBO01BQWpDRSxLQUFLLEdBQUFELFVBQUE7TUFBRUUsUUFBUSxHQUFBRixVQUFBLElBQW1CLENBQUs7O0lBRTlDLElBQUFHLFVBQUEsR0FBb0NqQyxRQUFRLENBQUM7UUFBRWtDLE1BQU0sRUFBQyxJQUFJO1FBQUVDLFFBQVEsRUFBQyxRQUFRO1FBQUVDLElBQUksRUFBQyxFQUFFO1FBQUVDLElBQUksRUFBQyxFQUFFO1FBQUVDLEdBQUcsRUFBQyxDQUFDLEVBQUU7UUFBRUMsR0FBRyxFQUFDLEVBQUU7UUFBRUMsS0FBSyxFQUFDLE1BQU07UUFBRUMsU0FBUyxFQUFDO01BQUksQ0FBQyxDQUFDO01BQUFDLFVBQUEsR0FBQXBCLGNBQUEsQ0FBQVcsVUFBQTtNQUF6SVUsTUFBTSxHQUFBRCxVQUFBO01BQUVFLFNBQVMsR0FBQUYsVUFBQTtJQUN4QixJQUFBRyxVQUFBLEdBQW9DN0MsUUFBUSxDQUFDO1FBQUU4QyxRQUFRLEVBQUMsYUFBYTtRQUFFQyxJQUFJLEVBQUMsYUFBYTtRQUFFQyxHQUFHLEVBQUMsT0FBTztRQUFFQyxHQUFHLEVBQUMsQ0FBQztNQUFRLENBQUMsQ0FBQztNQUFBQyxVQUFBLEdBQUE1QixjQUFBLENBQUF1QixVQUFBO01BQWhITSxNQUFNLEdBQUFELFVBQUE7TUFBRUUsU0FBUyxHQUFBRixVQUFBO0lBQ3hCLElBQUFHLFVBQUEsR0FBb0NyRCxRQUFRLENBQUMsTUFBTTtRQUMvQztBQUNSO0FBQ0E7UUFDUSxJQUFJO1VBQ0EsSUFBTXNELENBQUMsR0FBR0MsWUFBWSxDQUFDQyxPQUFPLENBQUMsV0FBVyxDQUFDO1VBQzNDLElBQU1DLE9BQU8sR0FBRyxDQUFDLElBQUksRUFBQyxPQUFPLEVBQUMsT0FBTyxFQUFDLElBQUksRUFBQyxJQUFJLENBQUM7VUFDaEQsSUFBSUgsQ0FBQyxJQUFJRyxPQUFPLENBQUNDLE9BQU8sQ0FBQ0osQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsT0FBTztZQUFFSyxJQUFJLEVBQUVMO1VBQUUsQ0FBQztRQUMxRCxDQUFDLENBQUMsT0FBT00sQ0FBQyxFQUFFLENBQUU7UUFDZCxPQUFPO1VBQUVELElBQUksRUFBQztRQUFLLENBQUM7TUFDeEIsQ0FBQyxDQUFDO01BQUFFLFdBQUEsR0FBQXZDLGNBQUEsQ0FBQStCLFVBQUE7TUFWS1MsT0FBTyxHQUFBRCxXQUFBO01BQUVFLFVBQVUsR0FBQUYsV0FBQTtJQVcxQixJQUFBRyxXQUFBLEdBQW9DaEUsUUFBUSxDQUFDO1FBQUVpRSxPQUFPLEVBQUMsQ0FBQyxTQUFTLEVBQUMsUUFBUSxFQUFDLFlBQVk7TUFBRSxDQUFDLENBQUM7TUFBQUMsV0FBQSxHQUFBNUMsY0FBQSxDQUFBMEMsV0FBQTtNQUFwRkcsU0FBUyxHQUFBRCxXQUFBO01BQUVFLFlBQVksR0FBQUYsV0FBQTtJQUU5QixJQUFNRyxhQUFhLEdBQUdDLE1BQU0sQ0FBQ0MsTUFBTSxDQUFDaEQsSUFBSSxDQUFDLENBQUNpRCxNQUFNLENBQUNDLE9BQU8sQ0FBQyxDQUFDQyxNQUFNO0lBRWhFLElBQU1DLE1BQU0sR0FBSXBFLEdBQUcsSUFBSztNQUNwQmlCLE9BQU8sQ0FBQ29ELENBQUMsSUFBQUMsYUFBQSxDQUFBQSxhQUFBLEtBQVNELENBQUM7UUFBRSxDQUFDckUsR0FBRyxHQUFFO01BQUksRUFBRSxDQUFDO01BQ2xDcUIsUUFBUSxDQUFDLEtBQUssQ0FBQztNQUNmSSxRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ2xCLENBQUM7O0lBRUQ7SUFDQSxJQUFJTCxLQUFLLEtBQUssS0FBSyxFQUFFO01BQ2pCLG9CQUFPNUIsS0FBQSxDQUFBK0UsYUFBQSxDQUFDQyxtQkFBbUI7UUFBQ0MsR0FBRyxFQUFFckMsTUFBTztRQUFDc0MsTUFBTSxFQUFFckMsU0FBVTtRQUMvQnNDLE1BQU0sRUFBRUEsQ0FBQSxLQUFNdEQsUUFBUSxDQUFDLEtBQUssQ0FBRTtRQUM5QnVELE1BQU0sRUFBRUEsQ0FBQSxLQUFNUixNQUFNLENBQUMsS0FBSztNQUFFLENBQUUsQ0FBQztJQUMvRDs7SUFFQTtJQUNBLG9CQUNJNUUsS0FBQSxDQUFBK0UsYUFBQTtNQUFLTSxTQUFTLEVBQUM7SUFBd0IsZ0JBRW5DckYsS0FBQSxDQUFBK0UsYUFBQTtNQUFLTSxTQUFTLEVBQUM7SUFBbUUsZ0JBQzlFckYsS0FBQSxDQUFBK0UsYUFBQSwyQkFDSS9FLEtBQUEsQ0FBQStFLGFBQUE7TUFBSU0sU0FBUyxFQUFDO0lBQWlFLGdCQUMzRXJGLEtBQUEsQ0FBQStFLGFBQUE7TUFBTU0sU0FBUyxFQUFDO0lBQWMsR0FBQyxNQUFVLENBQUMsS0FBQyxlQUFBckYsS0FBQSxDQUFBK0UsYUFBQTtNQUFNTSxTQUFTLEVBQUM7SUFBWSxHQUFDLFFBQVksQ0FBQyxlQUNyRnJGLEtBQUEsQ0FBQStFLGFBQUE7TUFBTU0sU0FBUyxFQUFDO0lBQW1DLEdBQUMsdUJBQStCLENBQ25GLENBQUMsZUFDTHJGLEtBQUEsQ0FBQStFLGFBQUE7TUFBR00sU0FBUyxFQUFDO0lBQXFELEdBQUVsRixDQUFDLENBQUMsYUFBYSxDQUFLLENBQ3ZGLENBQUMsZUFDTkgsS0FBQSxDQUFBK0UsYUFBQTtNQUFLTSxTQUFTLEVBQUM7SUFBeUIsZ0JBQ3BDckYsS0FBQSxDQUFBK0UsYUFBQTtNQUFHakUsSUFBSSxFQUFDLGlCQUFpQjtNQUN0QndFLE9BQU8sRUFBRUEsQ0FBQSxLQUFNO1FBQUUsSUFBSTtVQUFFOUIsWUFBWSxDQUFDK0IsT0FBTyxDQUFDLGlCQUFpQixFQUFDLEdBQUcsQ0FBQztRQUFFLENBQUMsQ0FBQyxPQUFNMUIsQ0FBQyxFQUFDLENBQUM7TUFBRSxDQUFFO01BQ25Gd0IsU0FBUyxFQUFDO0lBQTBFLEdBQUVsRixDQUFDLENBQUMsYUFBYSxDQUFLLENBQzVHLENBQ0osQ0FBQyxlQVdOSCxLQUFBLENBQUErRSxhQUFBO01BQUtNLFNBQVMsRUFBQywwQkFBMEI7TUFDcENHLEtBQUssRUFBRTtRQUFFQyxLQUFLLEVBQUMsa0JBQWtCO1FBQUVDLFdBQVcsRUFBQyxPQUFPO1FBQUVDLGNBQWMsRUFBQztNQUFPO0lBQUUsZ0JBUWpGM0YsS0FBQSxDQUFBK0UsYUFBQTtNQUFLTSxTQUFTLEVBQUMsOEdBQThHO01BQ3hILGVBQVksTUFBTTtNQUNsQkcsS0FBSyxFQUFFO1FBQUNDLEtBQUssRUFBQyxLQUFLO1FBQUVDLFdBQVcsRUFBQztNQUFLO0lBQUUsZ0JBQ3pDMUYsS0FBQSxDQUFBK0UsYUFBQTtNQUFLYSxHQUFHLEVBQUMsb0NBQW9DO01BQUNDLEdBQUcsRUFBQyxFQUFFO01BQy9DUixTQUFTLEVBQUMsNkNBQTZDO01BQ3ZERyxLQUFLLEVBQUU7UUFBQ00sT0FBTyxFQUFDO01BQUk7SUFBRSxDQUFFLENBQUMsZUFHOUI5RixLQUFBLENBQUErRSxhQUFBO01BQUtNLFNBQVMsRUFBQyxrQkFBa0I7TUFDNUJHLEtBQUssRUFBRTtRQUFDTyxVQUFVLEVBQUM7TUFBd0c7SUFBRSxDQUFDLENBQ2xJLENBQUMsRUFFTHhGLEtBQUssQ0FBQ3lGLEdBQUcsQ0FBQyxDQUFDQyxDQUFDLEVBQUVDLENBQUMsS0FBSztNQUNqQixJQUFNQyxRQUFRLEdBQUcsQ0FBQyxFQUFFLEdBQUdELENBQUMsR0FBRyxFQUFFO01BQzdCLElBQU1FLEtBQUssR0FBR0QsUUFBUSxHQUFHRSxJQUFJLENBQUNDLEVBQUUsR0FBRyxHQUFHO01BQ3RDLElBQU1DLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBd0I7TUFDckMsSUFBTUMsQ0FBQyxHQUFHLEVBQUUsR0FBR0QsQ0FBQyxHQUFHRixJQUFJLENBQUNJLEdBQUcsQ0FBQ0wsS0FBSyxDQUFDLENBQUMsQ0FBRTtNQUNyQyxJQUFNTSxDQUFDLEdBQUcsRUFBRSxHQUFHSCxDQUFDLEdBQUdGLElBQUksQ0FBQ00sR0FBRyxDQUFDUCxLQUFLLENBQUMsQ0FBQyxDQUFFO01BQ3JDLG9CQUNJcEcsS0FBQSxDQUFBK0UsYUFBQSxDQUFDNkIsVUFBVTtRQUFDcEcsR0FBRyxFQUFFeUYsQ0FBQyxDQUFDekYsR0FBSTtRQUNYcUcsSUFBSSxFQUFFWixDQUFFO1FBQ1J6RSxJQUFJLEVBQUVBLElBQUksQ0FBQ3lFLENBQUMsQ0FBQ3pGLEdBQUcsQ0FBRTtRQUNsQnNHLEtBQUssRUFBRVosQ0FBQyxHQUFDLENBQUU7UUFDWGEsT0FBTyxFQUFFUCxDQUFFO1FBQ1hRLE1BQU0sRUFBRU4sQ0FBRTtRQUNWcEIsT0FBTyxFQUFFQSxDQUFBLEtBQU07VUFDWCxJQUFJVyxDQUFDLENBQUN0RixJQUFJLEtBQUssTUFBTSxFQUFPa0IsUUFBUSxDQUFDb0UsQ0FBQyxDQUFDekYsR0FBRyxDQUFDLENBQUMsS0FDdkMsSUFBSXlGLENBQUMsQ0FBQ3RGLElBQUksS0FBSyxNQUFNLEVBQUU7WUFDeEI7QUFDNUM7QUFDQTtZQUM0Q04sTUFBTSxDQUFDYSxRQUFRLENBQUNKLElBQUksR0FBR21GLENBQUMsQ0FBQ25GLElBQUk7VUFDakMsQ0FBQyxNQUEyQm1CLFFBQVEsQ0FBQ2dFLENBQUMsQ0FBQ3pGLEdBQUcsQ0FBQztRQUMvQztNQUFFLENBQUUsQ0FBQztJQUV6QixDQUFDLENBQUMsZUFRRlIsS0FBQSxDQUFBK0UsYUFBQTtNQUFLTSxTQUFTLEVBQUMsb0RBQW9EO01BQzlENEIsT0FBTyxFQUFDLGFBQWE7TUFBQ0MsbUJBQW1CLEVBQUMsTUFBTTtNQUFDLGVBQVk7SUFBTSxnQkFDcEVsSCxLQUFBLENBQUErRSxhQUFBLDRCQUNJL0UsS0FBQSxDQUFBK0UsYUFBQTtNQUFNb0MsRUFBRSxFQUFDLG9CQUFvQjtNQUFDQyxTQUFTLEVBQUMsZ0JBQWdCO01BQ2xEWixDQUFDLEVBQUMsR0FBRztNQUFDRSxDQUFDLEVBQUMsR0FBRztNQUFDakIsS0FBSyxFQUFDLEtBQUs7TUFBQzRCLE1BQU0sRUFBQztJQUFLLGdCQUN0Q3JILEtBQUEsQ0FBQStFLGFBQUE7TUFBTXlCLENBQUMsRUFBQyxHQUFHO01BQUNFLENBQUMsRUFBQyxHQUFHO01BQUNqQixLQUFLLEVBQUMsS0FBSztNQUFDNEIsTUFBTSxFQUFDLEtBQUs7TUFBQ0MsSUFBSSxFQUFDO0lBQU8sQ0FBRSxDQUFDLEVBQ3pEL0csS0FBSyxDQUFDeUYsR0FBRyxDQUFDLENBQUN1QixDQUFDLEVBQUVyQixDQUFDLEtBQUs7TUFDakIsSUFBTXNCLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHdEIsQ0FBQyxHQUFHLEVBQUUsSUFBSUcsSUFBSSxDQUFDQyxFQUFFLEdBQUcsR0FBRztNQUN4QyxJQUFNbUIsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUdwQixJQUFJLENBQUNJLEdBQUcsQ0FBQ2UsQ0FBQyxDQUFDO01BQ2hDLElBQU1FLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHckIsSUFBSSxDQUFDTSxHQUFHLENBQUNhLENBQUMsQ0FBQztNQUNoQztBQUNoQztBQUNBO0FBQ0E7QUFDQTtNQUNnQyxvQkFBT3hILEtBQUEsQ0FBQStFLGFBQUE7UUFBUXZFLEdBQUcsRUFBRTBGLENBQUU7UUFBQ3VCLEVBQUUsRUFBRUEsRUFBRztRQUFDQyxFQUFFLEVBQUVBLEVBQUc7UUFBQ25CLENBQUMsRUFBQyxJQUFJO1FBQUNlLElBQUksRUFBQztNQUFPLENBQUUsQ0FBQztJQUNqRSxDQUFDLENBQ0MsQ0FDSixDQUFDLGVBQ1B0SCxLQUFBLENBQUErRSxhQUFBO01BQVEwQyxFQUFFLEVBQUMsSUFBSTtNQUFDQyxFQUFFLEVBQUMsSUFBSTtNQUFDbkIsQ0FBQyxFQUFDLElBQUk7TUFDdEJlLElBQUksRUFBQyxNQUFNO01BQ1hLLE1BQU0sRUFBQyx3QkFBd0I7TUFDL0JDLFdBQVcsRUFBQyxNQUFNO01BQ2xCQyxJQUFJLEVBQUM7SUFBMEIsQ0FBRSxDQUN4QyxDQUFDLGVBU043SCxLQUFBLENBQUErRSxhQUFBO01BQUssZUFBWSx1QkFBdUI7TUFDbkNNLFNBQVMsRUFBQztJQUF5RyxnQkFDcEhyRixLQUFBLENBQUErRSxhQUFBO01BQUtNLFNBQVMseUlBQUF5QyxNQUFBLENBQ0t4RCxhQUFhLEtBQUssQ0FBQyxHQUFHLGtCQUFrQixHQUFHLFlBQVksQ0FBRztNQUN4RWtCLEtBQUssRUFBRTtRQUFDdUMsVUFBVSxFQUFDO01BQXlEO0lBQUUsR0FDOUV6RCxhQUFhLEVBQUMsSUFDZCxDQUFDLGVBQ050RSxLQUFBLENBQUErRSxhQUFBO01BQUtNLFNBQVMsRUFBQyxzRkFBc0Y7TUFDaEdHLEtBQUssRUFBRTtRQUFDdUMsVUFBVSxFQUFDO01BQTZCO0lBQUUsR0FDbEQ1SCxDQUFDLENBQUMsU0FBUyxDQUNYLENBQ0osQ0FDSixDQUFDLGVBR05ILEtBQUEsQ0FBQStFLGFBQUE7TUFBS00sU0FBUyxFQUFDLG1FQUFtRTtNQUFDRyxLQUFLLEVBQUU7UUFBQ0csY0FBYyxFQUFDO01BQU07SUFBRSxnQkFDOUczRixLQUFBLENBQUErRSxhQUFBO01BQUdNLFNBQVMsRUFBQztJQUFrQyxHQUMxQ2YsYUFBYSxLQUFLLENBQUMsSUFBSW5FLENBQUMsQ0FBQyxlQUFlLENBQUMsRUFDekNtRSxhQUFhLEdBQUcsQ0FBQyxJQUFJQSxhQUFhLEdBQUcsQ0FBQyxjQUFBd0QsTUFBQSxDQUFTLENBQUMsR0FBR3hELGFBQWEsT0FBQXdELE1BQUEsQ0FBSTNILENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFFLEVBQzdGbUUsYUFBYSxLQUFLLENBQUMsSUFBSW5FLENBQUMsQ0FBQyxrQkFBa0IsQ0FDN0MsQ0FBQyxlQUNKSCxLQUFBLENBQUErRSxhQUFBO01BQUdqRSxJQUFJLEVBQUMsaUJBQWlCO01BQ3RCd0UsT0FBTyxFQUFFQSxDQUFBLEtBQU07UUFBRSxJQUFJO1VBQUU5QixZQUFZLENBQUMrQixPQUFPLENBQUMsaUJBQWlCLEVBQUMsR0FBRyxDQUFDO1FBQUUsQ0FBQyxDQUFDLE9BQU0xQixDQUFDLEVBQUMsQ0FBQztNQUFFLENBQUU7TUFDbkZ3QixTQUFTLHFIQUFBeUMsTUFBQSxDQUNJeEQsYUFBYSxLQUFLLENBQUMsR0FDZixnRkFBZ0YsR0FDaEYsNkVBQTZFO0lBQUcsR0FDL0ZuRSxDQUFDLENBQUMsbUJBQW1CLENBQ3ZCLENBQ0YsQ0FBQyxFQUdMNkIsS0FBSyxLQUFLLFVBQVUsaUJBQUloQyxLQUFBLENBQUErRSxhQUFBLENBQUNpRCxhQUFhO01BQUMvQyxHQUFHLEVBQUU3QixNQUFPO01BQUM4QixNQUFNLEVBQUU3QixTQUFVO01BQ2hDNEUsT0FBTyxFQUFFQSxDQUFBLEtBQU1oRyxRQUFRLENBQUMsSUFBSSxDQUFFO01BQzlCbUQsTUFBTSxFQUFFQSxDQUFBLEtBQU1SLE1BQU0sQ0FBQyxVQUFVO0lBQUUsQ0FBRSxDQUFDLEVBQzFFNUMsS0FBSyxLQUFLLFVBQVUsaUJBQUloQyxLQUFBLENBQUErRSxhQUFBLENBQUNtRCxhQUFhO01BQUNqRCxHQUFHLEVBQUVsQixPQUFRO01BQUNtQixNQUFNLEVBQUVsQixVQUFXO01BQ2xDaUUsT0FBTyxFQUFFQSxDQUFBLEtBQU1oRyxRQUFRLENBQUMsSUFBSSxDQUFFO01BQzlCbUQsTUFBTSxFQUFFQSxDQUFBLEtBQU1SLE1BQU0sQ0FBQyxVQUFVO0lBQUUsQ0FBRSxDQUFDLEVBQzFFNUMsS0FBSyxLQUFLLFNBQVMsaUJBQUtoQyxLQUFBLENBQUErRSxhQUFBLENBQUNvRCxZQUFZO01BQUVsRCxHQUFHLEVBQUViLFNBQVU7TUFBQ2MsTUFBTSxFQUFFYixZQUFhO01BQ3RDNEQsT0FBTyxFQUFFQSxDQUFBLEtBQU1oRyxRQUFRLENBQUMsSUFBSSxDQUFFO01BQzlCbUQsTUFBTSxFQUFFQSxDQUFBLEtBQU1SLE1BQU0sQ0FBQyxTQUFTO0lBQUUsQ0FBRSxDQUN4RSxDQUFDO0VBRWQ7O0VBRUE7QUFDQTtBQUNBO0FBQ0E7RUFDQSxTQUFTd0QsSUFBSUEsQ0FBQUMsSUFBQSxFQUFpQztJQUFBLElBQTlCeEIsSUFBSSxHQUFBd0IsSUFBQSxDQUFKeEIsSUFBSTtNQUFFckYsSUFBSSxHQUFBNkcsSUFBQSxDQUFKN0csSUFBSTtNQUFFc0YsS0FBSyxHQUFBdUIsSUFBQSxDQUFMdkIsS0FBSztNQUFFeEIsT0FBTyxHQUFBK0MsSUFBQSxDQUFQL0MsT0FBTztJQUN0QyxvQkFDSXRGLEtBQUEsQ0FBQStFLGFBQUE7TUFBUU8sT0FBTyxFQUFFQSxPQUFRO01BQ2pCLDZCQUFBd0MsTUFBQSxDQUEyQmpCLElBQUksQ0FBQ3JHLEdBQUcsQ0FBRztNQUN0QyxjQUFZTCxDQUFDLENBQUMwRyxJQUFJLENBQUNwRyxRQUFRLENBQUU7TUFDN0I0RSxTQUFTLGtJQUFBeUMsTUFBQSxDQUM0QnRHLElBQUksR0FBRyxNQUFNLEdBQUcsRUFBRTtJQUFHLEdBQzdEQSxJQUFJLGlCQUFJeEIsS0FBQSxDQUFBK0UsYUFBQTtNQUFNTSxTQUFTLEVBQUMsT0FBTztNQUFDLDZCQUFBeUMsTUFBQSxDQUEyQmpCLElBQUksQ0FBQ3JHLEdBQUc7SUFBUSxHQUFDLFFBQU8sQ0FBQyxlQUNyRlIsS0FBQSxDQUFBK0UsYUFBQTtNQUFLTSxTQUFTLEVBQUM7SUFBOEIsZ0JBQ3pDckYsS0FBQSxDQUFBK0UsYUFBQTtNQUFLTSxTQUFTLEVBQUMsdURBQXVEO01BQ2pFRyxLQUFLLEVBQUU7UUFBQ08sVUFBVSxLQUFBK0IsTUFBQSxDQUFJakIsSUFBSSxDQUFDakcsU0FBUyxPQUFJO1FBQUUwSCxNQUFNLGVBQUFSLE1BQUEsQ0FBY2pCLElBQUksQ0FBQ2pHLFNBQVM7TUFBSTtJQUFFLGdCQUNuRlosS0FBQSxDQUFBK0UsYUFBQSxDQUFDd0QsUUFBUTtNQUFDNUgsSUFBSSxFQUFFa0csSUFBSSxDQUFDckcsR0FBSTtNQUFDZ0ksS0FBSyxFQUFFM0IsSUFBSSxDQUFDakc7SUFBVSxDQUFFLENBQ2pELENBQUMsZUFDTlosS0FBQSxDQUFBK0UsYUFBQTtNQUFLTSxTQUFTLEVBQUM7SUFBb0MsR0FBQyxHQUFDLEVBQUN5QixLQUFXLENBQ2hFLENBQUMsZUFDTjlHLEtBQUEsQ0FBQStFLGFBQUE7TUFBSU0sU0FBUyxFQUFDLDZEQUE2RDtNQUN2RUcsS0FBSyxFQUFFO1FBQUNnRCxLQUFLLEVBQUMzQixJQUFJLENBQUNqRztNQUFTO0lBQUUsR0FBRVQsQ0FBQyxDQUFDMEcsSUFBSSxDQUFDcEcsUUFBUSxDQUFNLENBQUMsZUFDMURULEtBQUEsQ0FBQStFLGFBQUE7TUFBR00sU0FBUyxFQUFDO0lBQXFDLEdBQUVsRixDQUFDLENBQUMwRyxJQUFJLENBQUNuRyxNQUFNLENBQUssQ0FBQyxlQUN2RVYsS0FBQSxDQUFBK0UsYUFBQTtNQUFLTSxTQUFTLEVBQUM7SUFBNkYsZ0JBQ3hHckYsS0FBQSxDQUFBK0UsYUFBQTtNQUFNTSxTQUFTLEVBQUM7SUFBa0MsR0FBRXdCLElBQUksQ0FBQ2xHLElBQUksS0FBSyxNQUFNLEdBQUdSLENBQUMsQ0FBQyxjQUFjLENBQUMsR0FBR0EsQ0FBQyxDQUFDLFVBQVUsQ0FBUSxDQUFDLEVBQ25IcUIsSUFBSSxpQkFBSXhCLEtBQUEsQ0FBQStFLGFBQUE7TUFBTU0sU0FBUyxFQUFDO0lBQXlDLEdBQUVsRixDQUFDLENBQUMsZUFBZSxDQUFRLENBQzVGLENBQ0QsQ0FBQztFQUVqQjs7RUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBQ0EsU0FBU3lHLFVBQVVBLENBQUE2QixLQUFBLEVBQWtEO0lBQUEsSUFBL0M1QixJQUFJLEdBQUE0QixLQUFBLENBQUo1QixJQUFJO01BQUVyRixJQUFJLEdBQUFpSCxLQUFBLENBQUpqSCxJQUFJO01BQUVzRixLQUFLLEdBQUEyQixLQUFBLENBQUwzQixLQUFLO01BQUVDLE9BQU8sR0FBQTBCLEtBQUEsQ0FBUDFCLE9BQU87TUFBRUMsTUFBTSxHQUFBeUIsS0FBQSxDQUFOekIsTUFBTTtNQUFFMUIsT0FBTyxHQUFBbUQsS0FBQSxDQUFQbkQsT0FBTztJQUM3RDtBQUNKO0FBQ0E7SUFDSSxJQUFNb0QsU0FBUyxHQUFHN0IsSUFBSSxDQUFDakcsU0FBUztJQUNoQyxvQkFDSVosS0FBQSxDQUFBK0UsYUFBQTtNQUFRTyxPQUFPLEVBQUVBLE9BQVE7TUFDakIsNkJBQUF3QyxNQUFBLENBQTJCakIsSUFBSSxDQUFDckcsR0FBRyxDQUFHO01BQ3RDLGNBQVlMLENBQUMsQ0FBQzBHLElBQUksQ0FBQ3BHLFFBQVEsQ0FBRTtNQUM3QjRFLFNBQVMsc05BQUF5QyxNQUFBLENBR0t0RyxJQUFJLEdBQ0EsMkRBQTJELEdBQzNELGlDQUFpQyxDQUFHO01BQ3REZ0UsS0FBSyxFQUFFO1FBQ0htRCxJQUFJLEtBQUFiLE1BQUEsQ0FBSWYsT0FBTyxNQUFHO1FBQUU2QixHQUFHLEtBQUFkLE1BQUEsQ0FBSWQsTUFBTSxNQUFHO1FBQ3BDdkIsS0FBSyxFQUFDLGlCQUFpQjtRQUFFQyxXQUFXLEVBQUMsS0FBSztRQUMxQ21ELFNBQVMsRUFBQyx1QkFBdUI7UUFDakNQLE1BQU0sZ0JBQUFSLE1BQUEsQ0FBZVksU0FBUyxDQUFFO1FBQ2hDSSxTQUFTLGVBQUFoQixNQUFBLENBQWNZLFNBQVMsMEJBQUFaLE1BQUEsQ0FBdUJZLFNBQVM7TUFDcEU7SUFBRSxHQUNMbEgsSUFBSSxpQkFDRHhCLEtBQUEsQ0FBQStFLGFBQUE7TUFBTSw2QkFBQStDLE1BQUEsQ0FBMkJqQixJQUFJLENBQUNyRyxHQUFHLFVBQVE7TUFDM0M2RSxTQUFTLEVBQUM7SUFBbUksR0FBQyxRQUU5SSxDQUNULGVBQ0RyRixLQUFBLENBQUErRSxhQUFBO01BQUtNLFNBQVMsRUFBQyxrREFBa0Q7TUFDNURHLEtBQUssRUFBRTtRQUNKQyxLQUFLLEVBQUMsS0FBSztRQUFFQyxXQUFXLEVBQUMsS0FBSztRQUM5QkssVUFBVSxLQUFBK0IsTUFBQSxDQUFJakIsSUFBSSxDQUFDakcsU0FBUyxPQUFJO1FBQ2hDMEgsTUFBTSxlQUFBUixNQUFBLENBQWNqQixJQUFJLENBQUNqRyxTQUFTO01BQ3JDO0lBQUUsZ0JBQ0haLEtBQUEsQ0FBQStFLGFBQUEsQ0FBQ3dELFFBQVE7TUFBQzVILElBQUksRUFBRWtHLElBQUksQ0FBQ3JHLEdBQUk7TUFBQ2dJLEtBQUssRUFBRTNCLElBQUksQ0FBQ2pHLFNBQVU7TUFBQ21JLElBQUksRUFBRTtJQUFHLENBQUUsQ0FDM0QsQ0FBQyxlQUNOL0ksS0FBQSxDQUFBK0UsYUFBQTtNQUFLTSxTQUFTLEVBQUM7SUFBc0QsR0FBQyxHQUFDLEVBQUN5QixLQUFXLENBQUMsZUFDcEY5RyxLQUFBLENBQUErRSxhQUFBO01BQUlNLFNBQVMsRUFBQyxzR0FBc0c7TUFDaEhHLEtBQUssRUFBRTtRQUFDZ0QsS0FBSyxFQUFDM0IsSUFBSSxDQUFDakc7TUFBUztJQUFFLEdBQzdCVCxDQUFDLENBQUMwRyxJQUFJLENBQUNwRyxRQUFRLENBQ2hCLENBQUMsZUFDTFQsS0FBQSxDQUFBK0UsYUFBQTtNQUFHTSxTQUFTLEVBQUM7SUFBK0UsR0FDdkZsRixDQUFDLENBQUMwRyxJQUFJLENBQUNuRyxNQUFNLENBQ2YsQ0FDQyxDQUFDO0VBRWpCO0VBRUEsU0FBUzZILFFBQVFBLENBQUFTLEtBQUEsRUFBNkI7SUFBQSxJQUExQnJJLElBQUksR0FBQXFJLEtBQUEsQ0FBSnJJLElBQUk7TUFBRTZILEtBQUssR0FBQVEsS0FBQSxDQUFMUixLQUFLO01BQUFTLFVBQUEsR0FBQUQsS0FBQSxDQUFFRCxJQUFJO01BQUpBLElBQUksR0FBQUUsVUFBQSxjQUFHLEVBQUUsR0FBQUEsVUFBQTtJQUN0QztBQUNKO0FBQ0E7SUFDSSxJQUFNdEIsTUFBTSxHQUFHO01BQUVBLE1BQU0sRUFBQ2EsS0FBSztNQUFFbEIsSUFBSSxFQUFDLE1BQU07TUFBRU0sV0FBVyxFQUFDLENBQUM7TUFBRXNCLGFBQWEsRUFBQyxPQUFPO01BQUVDLGNBQWMsRUFBQztJQUFRLENBQUM7SUFDMUcsSUFBSXhJLElBQUksS0FBSyxLQUFLLEVBQU8sb0JBQU9YLEtBQUEsQ0FBQStFLGFBQUEsUUFBQXFFLFFBQUE7TUFBSzNELEtBQUssRUFBRXNELElBQUs7TUFBQzFCLE1BQU0sRUFBRTBCLElBQUs7TUFBQzlCLE9BQU8sRUFBQztJQUFXLEdBQUtVLE1BQU0sZ0JBQUUzSCxLQUFBLENBQUErRSxhQUFBO01BQU1GLENBQUMsRUFBQztJQUFZLENBQUMsQ0FBQyxlQUFBN0UsS0FBQSxDQUFBK0UsYUFBQTtNQUFNRixDQUFDLEVBQUM7SUFBMkIsQ0FBQyxDQUFNLENBQUM7SUFDakssSUFBSWxFLElBQUksS0FBSyxVQUFVLEVBQUUsb0JBQU9YLEtBQUEsQ0FBQStFLGFBQUEsUUFBQXFFLFFBQUE7TUFBSzNELEtBQUssRUFBRXNELElBQUs7TUFBQzFCLE1BQU0sRUFBRTBCLElBQUs7TUFBQzlCLE9BQU8sRUFBQztJQUFXLEdBQUtVLE1BQU0sZ0JBQUUzSCxLQUFBLENBQUErRSxhQUFBO01BQU1GLENBQUMsRUFBQztJQUFvRCxDQUFDLENBQUMsZUFBQTdFLEtBQUEsQ0FBQStFLGFBQUE7TUFBUTBDLEVBQUUsRUFBQyxJQUFJO01BQUNDLEVBQUUsRUFBQyxJQUFJO01BQUNuQixDQUFDLEVBQUM7SUFBSyxDQUFDLENBQU0sQ0FBQztJQUNyTSxJQUFJNUYsSUFBSSxLQUFLLFVBQVUsRUFBRSxvQkFBT1gsS0FBQSxDQUFBK0UsYUFBQSxRQUFBcUUsUUFBQTtNQUFLM0QsS0FBSyxFQUFFc0QsSUFBSztNQUFDMUIsTUFBTSxFQUFFMEIsSUFBSztNQUFDOUIsT0FBTyxFQUFDO0lBQVcsR0FBS1UsTUFBTSxnQkFBRTNILEtBQUEsQ0FBQStFLGFBQUE7TUFBUTBDLEVBQUUsRUFBQyxJQUFJO01BQUNDLEVBQUUsRUFBQyxJQUFJO01BQUNuQixDQUFDLEVBQUM7SUFBRyxDQUFDLENBQUMsZUFBQXZHLEtBQUEsQ0FBQStFLGFBQUE7TUFBTUYsQ0FBQyxFQUFDO0lBQXNELENBQUMsQ0FBTSxDQUFDO0lBQ3JNLElBQUlsRSxJQUFJLEtBQUssU0FBUyxFQUFHLG9CQUFPWCxLQUFBLENBQUErRSxhQUFBLFFBQUFxRSxRQUFBO01BQUszRCxLQUFLLEVBQUVzRCxJQUFLO01BQUMxQixNQUFNLEVBQUUwQixJQUFLO01BQUM5QixPQUFPLEVBQUM7SUFBVyxHQUFLVSxNQUFNLGdCQUFFM0gsS0FBQSxDQUFBK0UsYUFBQTtNQUFNRixDQUFDLEVBQUM7SUFBZSxDQUFDLENBQUMsZUFBQTdFLEtBQUEsQ0FBQStFLGFBQUE7TUFBTUYsQ0FBQyxFQUFDO0lBQXFDLENBQUMsQ0FBTSxDQUFDO0lBQzlLO0lBQ0EsSUFBSWxFLElBQUksS0FBSyxRQUFRLEVBQUksb0JBQU9YLEtBQUEsQ0FBQStFLGFBQUEsUUFBQXFFLFFBQUE7TUFBSzNELEtBQUssRUFBRXNELElBQUs7TUFBQzFCLE1BQU0sRUFBRTBCLElBQUs7TUFBQzlCLE9BQU8sRUFBQztJQUFXLEdBQUtVLE1BQU0sZ0JBQUUzSCxLQUFBLENBQUErRSxhQUFBO01BQU1GLENBQUMsRUFBQztJQUFpRyxDQUFDLENBQU0sQ0FBQztJQUNqTixPQUFPLElBQUk7RUFDZjs7RUFFQTtBQUNBO0FBQ0E7RUFDQSxTQUFTRyxtQkFBbUJBLENBQUFxRSxLQUFBLEVBQWtDO0lBQUEsSUFBL0JwRSxHQUFHLEdBQUFvRSxLQUFBLENBQUhwRSxHQUFHO01BQUVDLE1BQU0sR0FBQW1FLEtBQUEsQ0FBTm5FLE1BQU07TUFBRUMsTUFBTSxHQUFBa0UsS0FBQSxDQUFObEUsTUFBTTtNQUFFQyxNQUFNLEdBQUFpRSxLQUFBLENBQU5qRSxNQUFNO0lBQ3RELElBQU1rRSxNQUFNLEdBQUdBLENBQUNsSixDQUFDLEVBQUVtRCxDQUFDLEtBQUsyQixNQUFNLENBQUNxRSxDQUFDLElBQUF6RSxhQUFBLENBQUFBLGFBQUEsS0FBU3lFLENBQUM7TUFBRSxDQUFDbkosQ0FBQyxHQUFFbUQ7SUFBQyxFQUFFLENBQUM7O0lBRXJEO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7SUFDSXZELEtBQUssQ0FBQ3dKLFNBQVMsQ0FBQyxNQUFNO01BQ2xCLElBQUk7UUFDQSxJQUFNQyxHQUFHLEdBQU1qRyxZQUFZLENBQUNDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQztRQUM1RCxJQUFNaUcsTUFBTSxHQUFHbEcsWUFBWSxDQUFDQyxPQUFPLENBQUMsZ0JBQWdCLENBQUM7UUFDckQsSUFBTWtHLEtBQUssR0FBSSxDQUFDLENBQUM7UUFDakIsSUFBSUYsR0FBRyxFQUFFO1VBQ0wsSUFBTUcsQ0FBQyxHQUFHQyxJQUFJLENBQUNDLEtBQUssQ0FBQ0wsR0FBRyxDQUFDO1VBQ3pCLElBQUlNLE1BQU0sQ0FBQ0MsUUFBUSxDQUFDSixDQUFDLENBQUNLLEVBQUUsQ0FBQyxJQUFJRixNQUFNLENBQUNDLFFBQVEsQ0FBQ0osQ0FBQyxDQUFDTSxFQUFFLENBQUMsSUFBSU4sQ0FBQyxDQUFDSyxFQUFFLEdBQUdMLENBQUMsQ0FBQ00sRUFBRSxFQUFFO1lBQy9EUCxLQUFLLENBQUN0SCxJQUFJLEdBQUd1SCxDQUFDLENBQUNLLEVBQUU7WUFDakJOLEtBQUssQ0FBQ3JILElBQUksR0FBR3NILENBQUMsQ0FBQ00sRUFBRTtVQUNyQjtRQUNKO1FBQ0EsSUFBSVIsTUFBTSxJQUFJUyxVQUFVLENBQUNDLElBQUksQ0FBQzVELENBQUMsSUFBSUEsQ0FBQyxDQUFDVyxFQUFFLEtBQUt1QyxNQUFNLENBQUMsRUFBRTtVQUNqREMsS0FBSyxDQUFDdkgsUUFBUSxHQUFHc0gsTUFBTTtRQUMzQjtRQUNBO1FBQ0EsSUFBTVcsRUFBRSxHQUFHN0csWUFBWSxDQUFDQyxPQUFPLENBQUMsWUFBWSxDQUFDO1FBQzdDLElBQUk0RyxFQUFFLEtBQUssT0FBTyxJQUFJQSxFQUFFLEtBQUssTUFBTSxFQUFFVixLQUFLLENBQUNsSCxLQUFLLEdBQUc0SCxFQUFFO1FBQ3JELElBQU1DLEVBQUUsR0FBR0MsVUFBVSxDQUFDL0csWUFBWSxDQUFDQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUM3RCxJQUFJc0csTUFBTSxDQUFDQyxRQUFRLENBQUNNLEVBQUUsQ0FBQyxJQUFJQSxFQUFFLElBQUksR0FBRyxJQUFJQSxFQUFFLElBQUksR0FBRyxFQUFFWCxLQUFLLENBQUNqSCxTQUFTLEdBQUc0SCxFQUFFO1FBQ3ZFO0FBQ1o7QUFDQTtRQUNZLElBQUk7VUFDQSxJQUFNRSxLQUFLLEdBQUdoSCxZQUFZLENBQUNDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztVQUNyRCxJQUFJK0csS0FBSyxFQUFFO1lBQ1AsSUFBTUMsRUFBRSxHQUFHWixJQUFJLENBQUNDLEtBQUssQ0FBQ1UsS0FBSyxDQUFDO1lBQzVCLElBQUlULE1BQU0sQ0FBQ0MsUUFBUSxDQUFDUyxFQUFFLENBQUNDLEdBQUcsQ0FBQyxJQUFJWCxNQUFNLENBQUNDLFFBQVEsQ0FBQ1MsRUFBRSxDQUFDRSxHQUFHLENBQUMsSUFBSUYsRUFBRSxDQUFDQyxHQUFHLEdBQUdELEVBQUUsQ0FBQ0UsR0FBRyxFQUFFO2NBQ3ZFaEIsS0FBSyxDQUFDcEgsR0FBRyxHQUFHa0ksRUFBRSxDQUFDQyxHQUFHO2NBQ2xCZixLQUFLLENBQUNuSCxHQUFHLEdBQUdpSSxFQUFFLENBQUNFLEdBQUc7WUFDdEI7VUFDSjtRQUNKLENBQUMsQ0FBQyxPQUFPOUcsQ0FBQyxFQUFFLENBQUU7UUFDZCxJQUFJVSxNQUFNLENBQUNxRyxJQUFJLENBQUNqQixLQUFLLENBQUMsQ0FBQ2hGLE1BQU0sRUFBRU8sTUFBTSxDQUFDcUUsQ0FBQyxJQUFBekUsYUFBQSxDQUFBQSxhQUFBLEtBQVN5RSxDQUFDLEdBQUtJLEtBQUssQ0FBRSxDQUFDO01BQ2xFLENBQUMsQ0FBQyxPQUFPOUYsQ0FBQyxFQUFFLENBQUU7TUFDbEI7SUFDQSxDQUFDLEVBQUUsRUFBRSxDQUFDOztJQUVOO0FBQ0o7QUFDQTtJQUNJLElBQU1nSCxjQUFjLEdBQUdBLENBQUEsS0FBTTtNQUN6QixJQUFJO1FBQ0FySCxZQUFZLENBQUMrQixPQUFPLENBQUMsdUJBQXVCLEVBQ3hDc0UsSUFBSSxDQUFDaUIsU0FBUyxDQUFDO1VBQUViLEVBQUUsRUFBRWhGLEdBQUcsQ0FBQzVDLElBQUk7VUFBRTZILEVBQUUsRUFBRWpGLEdBQUcsQ0FBQzNDO1FBQUssQ0FBQyxDQUFDLENBQUM7UUFDbkQsSUFBSTJDLEdBQUcsQ0FBQzdDLFFBQVEsRUFBRTtVQUNkb0IsWUFBWSxDQUFDK0IsT0FBTyxDQUFDLGdCQUFnQixFQUFFTixHQUFHLENBQUM3QyxRQUFRLENBQUM7UUFDeEQ7UUFDQTtBQUNaO0FBQ0E7QUFDQTtRQUNZLElBQUk2QyxHQUFHLENBQUN4QyxLQUFLLEtBQUssT0FBTyxJQUFJd0MsR0FBRyxDQUFDeEMsS0FBSyxLQUFLLE1BQU0sRUFBRTtVQUMvQ2UsWUFBWSxDQUFDK0IsT0FBTyxDQUFDLFlBQVksRUFBRU4sR0FBRyxDQUFDeEMsS0FBSyxDQUFDO1FBQ2pEO1FBQ0EsSUFBSXNILE1BQU0sQ0FBQ0MsUUFBUSxDQUFDL0UsR0FBRyxDQUFDdkMsU0FBUyxDQUFDLEVBQUU7VUFDaENjLFlBQVksQ0FBQytCLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRXdGLE1BQU0sQ0FBQzlGLEdBQUcsQ0FBQ3ZDLFNBQVMsQ0FBQyxDQUFDO1FBQ2pFO1FBQ0E7QUFDWjtBQUNBO0FBQ0E7QUFDQTtRQUNZLElBQUlxSCxNQUFNLENBQUNDLFFBQVEsQ0FBQy9FLEdBQUcsQ0FBQzFDLEdBQUcsQ0FBQyxJQUFJd0gsTUFBTSxDQUFDQyxRQUFRLENBQUMvRSxHQUFHLENBQUN6QyxHQUFHLENBQUMsSUFBSXlDLEdBQUcsQ0FBQzFDLEdBQUcsR0FBRzBDLEdBQUcsQ0FBQ3pDLEdBQUcsRUFBRTtVQUMzRWdCLFlBQVksQ0FBQytCLE9BQU8sQ0FBQyxpQkFBaUIsRUFDbENzRSxJQUFJLENBQUNpQixTQUFTLENBQUM7WUFBRUosR0FBRyxFQUFFekYsR0FBRyxDQUFDMUMsR0FBRztZQUFFb0ksR0FBRyxFQUFFMUYsR0FBRyxDQUFDekM7VUFBSSxDQUFDLENBQUMsQ0FBQztVQUNuRG5DLE1BQU0sQ0FBQzJLLGFBQWEsQ0FBQyxJQUFJQyxXQUFXLENBQUMsc0JBQXNCLEVBQUU7WUFDekRDLE1BQU0sRUFBRTtjQUFFUixHQUFHLEVBQUV6RixHQUFHLENBQUMxQyxHQUFHO2NBQUVvSSxHQUFHLEVBQUUxRixHQUFHLENBQUN6QztZQUFJO1VBQ3pDLENBQUMsQ0FBQyxDQUFDO1FBQ1A7UUFDQW5DLE1BQU0sQ0FBQzJLLGFBQWEsQ0FBQyxJQUFJQyxXQUFXLENBQUMsbUJBQW1CLEVBQUU7VUFDdERDLE1BQU0sRUFBRTtZQUNKakIsRUFBRSxFQUFFaEYsR0FBRyxDQUFDNUMsSUFBSTtZQUNaNkgsRUFBRSxFQUFFakYsR0FBRyxDQUFDM0MsSUFBSTtZQUNab0gsTUFBTSxFQUFFekUsR0FBRyxDQUFDN0MsUUFBUSxJQUFJLFFBQVE7WUFDaEMrSSxjQUFjLEVBQUU7VUFDcEI7UUFDSixDQUFDLENBQUMsQ0FBQztRQUNIQyxPQUFPLENBQUNDLElBQUksQ0FBQyxvQ0FBb0MsRUFBRXBHLEdBQUcsQ0FBQzVDLElBQUksRUFBRSxHQUFHLEVBQUU0QyxHQUFHLENBQUMzQyxJQUFJLEVBQzdELFVBQVUsRUFBRTJDLEdBQUcsQ0FBQzFDLEdBQUcsRUFBRSxJQUFJLEVBQUUwQyxHQUFHLENBQUN6QyxHQUFHLEVBQUUsWUFBWSxFQUFFeUMsR0FBRyxDQUFDN0MsUUFBUSxDQUFDO01BQ2hGLENBQUMsQ0FBQyxPQUFPeUIsQ0FBQyxFQUFFO1FBQ1J1SCxPQUFPLENBQUNFLElBQUksQ0FBQyw4Q0FBOEMsRUFBRXpILENBQUMsQ0FBQztNQUNuRTtNQUNBdUIsTUFBTSxDQUFDLENBQUM7SUFDWixDQUFDO0lBRUQsb0JBQ0lwRixLQUFBLENBQUErRSxhQUFBO01BQUtNLFNBQVMsRUFBQztJQUE0QixnQkFFdkNyRixLQUFBLENBQUErRSxhQUFBO01BQUtNLFNBQVMsRUFBQztJQUF1RSxnQkFDbEZyRixLQUFBLENBQUErRSxhQUFBO01BQVFPLE9BQU8sRUFBRUgsTUFBTztNQUNoQkUsU0FBUyxFQUFDO0lBQThFLEdBQzNGbEYsQ0FBQyxDQUFDLGtCQUFrQixDQUNqQixDQUFDLGVBQ1RILEtBQUEsQ0FBQStFLGFBQUE7TUFBSU0sU0FBUyxFQUFDO0lBQStELEdBQUVsRixDQUFDLENBQUMsc0JBQXNCLENBQU0sQ0FBQyxlQUM5R0gsS0FBQSxDQUFBK0UsYUFBQTtNQUFRTyxPQUFPLEVBQUV1RixjQUFlO01BQ3hCeEYsU0FBUyxFQUFDO0lBQWdILEdBQzdIbEYsQ0FBQyxDQUFDLGdCQUFnQixDQUNmLENBQ1AsQ0FBQyxlQUdOSCxLQUFBLENBQUErRSxhQUFBO01BQUtNLFNBQVMsRUFBQztJQUFxRixnQkFDaEdyRixLQUFBLENBQUErRSxhQUFBLENBQUN3RyxXQUFXO01BQUN0RyxHQUFHLEVBQUVBO0lBQUksQ0FBRSxDQUFDLGVBQ3pCakYsS0FBQSxDQUFBK0UsYUFBQSxDQUFDeUcsZUFBZTtNQUFDdkcsR0FBRyxFQUFFQSxHQUFJO01BQUNxRSxNQUFNLEVBQUVBLE1BQU87TUFBQ3BFLE1BQU0sRUFBRUE7SUFBTyxDQUFFLENBQzNELENBQ0osQ0FBQztFQUVkOztFQUVBO0FBQ0E7QUFDQTtFQUNBLElBQU1pRixVQUFVLEdBQUcsQ0FDZjtJQUFFaEQsRUFBRSxFQUFDLFFBQVE7SUFBV3NFLEtBQUssRUFBQyxpQkFBaUI7SUFBa0J4QixFQUFFLEVBQUMsSUFBSTtJQUFFQyxFQUFFLEVBQUMsSUFBSTtJQUFFd0IsSUFBSSxFQUFDO0VBQUcsQ0FBQyxFQUM1RjtJQUFFdkUsRUFBRSxFQUFDLFFBQVE7SUFBV3NFLEtBQUssRUFBQyxRQUFRO0lBQTJCeEIsRUFBRSxFQUFDLEVBQUU7SUFBSUMsRUFBRSxFQUFDLEVBQUU7SUFBSXdCLElBQUksRUFBQztFQUFxQyxDQUFDLEVBQzlIO0lBQUV2RSxFQUFFLEVBQUMsUUFBUTtJQUFXc0UsS0FBSyxFQUFDLFFBQVE7SUFBMkJ4QixFQUFFLEVBQUMsRUFBRTtJQUFJQyxFQUFFLEVBQUMsRUFBRTtJQUFJd0IsSUFBSSxFQUFDO0VBQXFDLENBQUMsRUFDOUg7SUFBRXZFLEVBQUUsRUFBQyxPQUFPO0lBQVlzRSxLQUFLLEVBQUMsa0JBQWtCO0lBQWlCeEIsRUFBRSxFQUFDLEVBQUU7SUFBSUMsRUFBRSxFQUFDLEVBQUU7SUFBSXdCLElBQUksRUFBQztFQUFxQyxDQUFDLEVBQzlIO0lBQUV2RSxFQUFFLEVBQUMsU0FBUztJQUFVc0UsS0FBSyxFQUFDLG1CQUFtQjtJQUFnQnhCLEVBQUUsRUFBQyxFQUFFO0lBQUlDLEVBQUUsRUFBQyxFQUFFO0lBQUl3QixJQUFJLEVBQUM7RUFBcUMsQ0FBQyxFQUM5SDtJQUFFdkUsRUFBRSxFQUFDLFVBQVU7SUFBU3NFLEtBQUssRUFBQyxvQkFBb0I7SUFBZXhCLEVBQUUsRUFBQyxFQUFFO0lBQUlDLEVBQUUsRUFBQyxFQUFFO0lBQUl3QixJQUFJLEVBQUM7RUFBcUMsQ0FBQyxFQUM5SDtJQUFFdkUsRUFBRSxFQUFDLFNBQVM7SUFBVXNFLEtBQUssRUFBQyxjQUFjO0lBQXFCeEIsRUFBRSxFQUFDLEVBQUU7SUFBSUMsRUFBRSxFQUFDLEVBQUU7SUFBSXdCLElBQUksRUFBQztFQUFxQyxDQUFDLEVBQzlIO0lBQUV2RSxFQUFFLEVBQUMsU0FBUztJQUFVc0UsS0FBSyxFQUFDLGNBQWM7SUFBcUJ4QixFQUFFLEVBQUMsRUFBRTtJQUFJQyxFQUFFLEVBQUMsRUFBRTtJQUFJd0IsSUFBSSxFQUFDO0VBQXFDLENBQUMsRUFDOUg7SUFBRXZFLEVBQUUsRUFBQyxTQUFTO0lBQVVzRSxLQUFLLEVBQUMsY0FBYztJQUFxQnhCLEVBQUUsRUFBQyxFQUFFO0lBQUlDLEVBQUUsRUFBQyxFQUFFO0lBQUl3QixJQUFJLEVBQUM7RUFBcUMsQ0FBQyxFQUM5SDtJQUFFdkUsRUFBRSxFQUFDLFlBQVk7SUFBT3NFLEtBQUssRUFBQyxpQkFBaUI7SUFBa0J4QixFQUFFLEVBQUMsRUFBRTtJQUFJQyxFQUFFLEVBQUMsRUFBRTtJQUFJd0IsSUFBSSxFQUFDO0VBQXFDLENBQUMsQ0FDakk7O0VBRUQ7QUFDQTtBQUNBO0FBQ0E7RUFDQSxTQUFTSCxXQUFXQSxDQUFBSSxLQUFBLEVBQVU7SUFBQSxJQUFQMUcsR0FBRyxHQUFBMEcsS0FBQSxDQUFIMUcsR0FBRztJQUN0QjtJQUNBLElBQU0yRyxDQUFDLEdBQUcsR0FBRztNQUFFQyxDQUFDLEdBQUcsR0FBRztJQUN0QixJQUFNQyxHQUFHLEdBQUc7TUFBRW5ELElBQUksRUFBRSxFQUFFO01BQUVvRCxLQUFLLEVBQUUsRUFBRTtNQUFFbkQsR0FBRyxFQUFFLEVBQUU7TUFBRW9ELE1BQU0sRUFBRTtJQUFHLENBQUM7SUFDeEQsSUFBTUMsS0FBSyxHQUFHTCxDQUFDLEdBQUdFLEdBQUcsQ0FBQ25ELElBQUksR0FBR21ELEdBQUcsQ0FBQ0MsS0FBSztJQUN0QyxJQUFNRyxLQUFLLEdBQUdMLENBQUMsR0FBR0MsR0FBRyxDQUFDbEQsR0FBRyxHQUFJa0QsR0FBRyxDQUFDRSxNQUFNO0lBRXZDLElBQU1HLEtBQUssR0FBR2xILEdBQUcsQ0FBQzFDLEdBQUc7TUFBRTZKLEtBQUssR0FBR25ILEdBQUcsQ0FBQ3pDLEdBQUc7SUFDdEMsSUFBTTZKLEtBQUssR0FBRyxDQUFDO01BQVFDLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBVTs7SUFFL0M7SUFDQSxJQUFNOUYsQ0FBQyxHQUFLckcsQ0FBQyxJQUFLMkwsR0FBRyxDQUFDbkQsSUFBSSxHQUFJLENBQUN4SSxDQUFDLEdBQUdnTSxLQUFLLEtBQUtDLEtBQUssR0FBR0QsS0FBSyxDQUFDLEdBQUlGLEtBQUs7SUFDcEUsSUFBTXZGLENBQUMsR0FBSzZGLENBQUMsSUFBS1QsR0FBRyxDQUFDbEQsR0FBRyxHQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMyRCxDQUFDLEdBQUdGLEtBQUssS0FBS0MsS0FBSyxHQUFHRCxLQUFLLENBQUMsSUFBSUgsS0FBSztJQUN4RSxJQUFNTSxLQUFLLEdBQUksT0FBT0MsSUFBSSxLQUFLLFVBQVUsR0FBSUEsSUFBSSxHQUFJLENBQUN0TSxDQUFDLEVBQUV1TSxFQUFFLEtBQUssQ0FBRTtJQUVsRSxJQUFNQyxPQUFPLEdBQUlDLEdBQUcsSUFBS0EsR0FBRyxDQUFDNUcsR0FBRyxDQUFDNEQsQ0FBQyxPQUFBOUIsTUFBQSxDQUFPLENBQUN0QixDQUFDLENBQUNvRCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBRSxDQUFDLEVBQUVpRCxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQUEvRSxNQUFBLENBQUksQ0FBQ3BCLENBQUMsQ0FBQ2tELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFFLENBQUMsRUFBRWlELE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUNDLElBQUksQ0FBQyxHQUFHLENBQUM7O0lBRXhHO0lBQ0EsSUFBTUMsSUFBSSxHQUFHLEVBQUU7SUFBRSxLQUFLLElBQUk1TSxFQUFDLEdBQUMsRUFBRSxFQUFFQSxFQUFDLElBQUUsRUFBRSxFQUFFQSxFQUFDLElBQUUsR0FBRyxFQUFFNE0sSUFBSSxDQUFDQyxJQUFJLENBQUMsQ0FBQzdNLEVBQUMsRUFBRXFNLEtBQUssQ0FBQ3JNLEVBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzNFLElBQU04TSxLQUFLLEdBQUUsRUFBRTtJQUFFLEtBQUssSUFBSTlNLEdBQUMsR0FBQyxFQUFFLEVBQUVBLEdBQUMsSUFBRSxFQUFFLEVBQUVBLEdBQUMsSUFBRSxHQUFHLEVBQUU4TSxLQUFLLENBQUNELElBQUksQ0FBQyxDQUFDN00sR0FBQyxFQUFFcU0sS0FBSyxDQUFDck0sR0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDN0UsSUFBTStNLFFBQVEsR0FBRyxFQUFFO0lBQUUsS0FBSyxJQUFJL00sR0FBQyxHQUFDLEVBQUUsRUFBRUEsR0FBQyxJQUFFLEVBQUUsRUFBRUEsR0FBQyxJQUFFLEdBQUcsRUFBRStNLFFBQVEsQ0FBQ0YsSUFBSSxDQUFDLENBQUM3TSxHQUFDLEVBQUVxTSxLQUFLLENBQUNyTSxHQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNuRixJQUFNZ04sT0FBTyxHQUFJLEVBQUU7SUFBRSxLQUFLLElBQUloTixHQUFDLEdBQUMsRUFBRSxFQUFFQSxHQUFDLElBQUUsRUFBRSxFQUFFQSxHQUFDLElBQUUsR0FBRyxFQUFFZ04sT0FBTyxDQUFDSCxJQUFJLENBQUMsQ0FBQzdNLEdBQUMsRUFBRXFNLEtBQUssQ0FBQ3JNLEdBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2xGLElBQU1pTixFQUFFLEdBQUssQ0FBQyxHQUFHTCxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUVQLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRUEsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUdXLE9BQU8sQ0FBQztJQUU1RSxJQUFNRSxRQUFRLEdBQUcsRUFBRTtJQUFFLEtBQUssSUFBSUMsRUFBRSxHQUFDLEVBQUUsRUFBRUEsRUFBRSxJQUFFLEVBQUUsRUFBRUEsRUFBRSxJQUFFLEdBQUcsRUFBRUQsUUFBUSxDQUFDTCxJQUFJLENBQUMsQ0FBQ00sRUFBRSxFQUFFZCxLQUFLLENBQUNjLEVBQUUsRUFBRXJJLEdBQUcsQ0FBQzNDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDOUYsSUFBTWlMLFFBQVEsR0FBRyxFQUFFO0lBQUUsS0FBSyxJQUFJRCxHQUFFLEdBQUMsRUFBRSxFQUFFQSxHQUFFLElBQUUsRUFBRSxFQUFFQSxHQUFFLElBQUUsR0FBRyxFQUFFQyxRQUFRLENBQUNQLElBQUksQ0FBQyxDQUFDTSxHQUFFLEVBQUVkLEtBQUssQ0FBQ2MsR0FBRSxFQUFFckksR0FBRyxDQUFDNUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM5RixJQUFNbUwsS0FBSyxHQUFHLENBQUMsR0FBR0gsUUFBUSxFQUFFLEdBQUdFLFFBQVEsQ0FBQztJQUV4QyxJQUFNRSxFQUFFLEdBQUssQ0FBQyxHQUFHUixLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxHQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsR0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHQyxRQUFRLENBQUM7SUFDckUsSUFBTVEsSUFBSSxHQUFHLENBQUMsR0FBR1gsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRVAsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRUEsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzdGLElBQU1tQixHQUFHLEdBQUksQ0FBQyxHQUFHWixJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFUCxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFQSxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDN0YsSUFBTW9CLElBQUksR0FBRyxDQUFDLEdBQUdiLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUVQLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRUEsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUNoRSxDQUFDLEVBQUUsRUFBRUEsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFQSxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFM0UsSUFBTXFCLFVBQVUsR0FBRyxFQUFFO0lBQUUsS0FBSyxJQUFJMU4sR0FBQyxHQUFDLEVBQUUsRUFBRUEsR0FBQyxJQUFFLElBQUksRUFBRUEsR0FBQyxJQUFFLEdBQUcsRUFBRTBOLFVBQVUsQ0FBQ2IsSUFBSSxDQUFDLENBQUM3TSxHQUFDLEVBQUVxTSxLQUFLLENBQUNyTSxHQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN6RixJQUFNMk4sVUFBVSxHQUFHLEVBQUU7SUFBRSxLQUFLLElBQUkzTixHQUFDLEdBQUMsSUFBSSxFQUFFQSxHQUFDLElBQUUsRUFBRSxFQUFFQSxHQUFDLElBQUUsR0FBRyxFQUFFMk4sVUFBVSxDQUFDZCxJQUFJLENBQUMsQ0FBQzdNLEdBQUMsRUFBRXFNLEtBQUssQ0FBQ3JNLEdBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3pGLElBQU00TixNQUFNLEdBQUcsQ0FBQyxHQUFHRixVQUFVLEVBQUUsR0FBR0MsVUFBVSxDQUFDOztJQUU3QztJQUNBLElBQU1FLFNBQVMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUM7O0lBRXZDO0FBQ0o7QUFDQTtBQUNBO0lBQ0ksSUFBTUMsT0FBTyxHQUFHaEosR0FBRyxDQUFDeEMsS0FBSyxLQUFLLE9BQU87SUFDckMsSUFBTXlMLE9BQU8sR0FBR0QsT0FBTyxHQUNqQjtNQUFFRSxFQUFFLEVBQUMsU0FBUztNQUFFQyxJQUFJLEVBQUMsU0FBUztNQUFFQyxJQUFJLEVBQUMsU0FBUztNQUFFQyxJQUFJLEVBQUMsU0FBUztNQUM1REMsT0FBTyxFQUFDLHdCQUF3QjtNQUFFQyxXQUFXLEVBQUMsU0FBUztNQUN2REMsTUFBTSxFQUFDLFNBQVM7TUFBRUMsTUFBTSxFQUFDLFNBQVM7TUFBRUMsTUFBTSxFQUFDO0lBQVUsQ0FBQyxHQUN4RDtNQUFFUixFQUFFLEVBQUMsU0FBUztNQUFFQyxJQUFJLEVBQUMsU0FBUztNQUFFQyxJQUFJLEVBQUMsU0FBUztNQUFFQyxJQUFJLEVBQUMsU0FBUztNQUM1REMsT0FBTyxFQUFDLG9CQUFvQjtNQUFFQyxXQUFXLEVBQUMsU0FBUztNQUNuREMsTUFBTSxFQUFDLFNBQVM7TUFBRUMsTUFBTSxFQUFDLFNBQVM7TUFBRUMsTUFBTSxFQUFDO0lBQVUsQ0FBQztJQUM5RCxJQUFNQyxTQUFTLEdBQUdYLE9BQU8sR0FDbkIsTUFBTSxpQkFBQW5HLE1BQUEsQ0FDUSxDQUFDekIsSUFBSSxDQUFDc0UsR0FBRyxDQUFDLEdBQUcsRUFBRXRFLElBQUksQ0FBQ3FFLEdBQUcsQ0FBQyxHQUFHLEVBQUV6RixHQUFHLENBQUN2QyxTQUFTLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUVtSyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQUc7SUFFNUYsb0JBQ0k3TSxLQUFBLENBQUErRSxhQUFBO01BQUtNLFNBQVMsRUFBQyx1REFBdUQ7TUFDakVHLEtBQUssRUFBRTtRQUFDTyxVQUFVLEVBQUVtSSxPQUFPLENBQUNLLE9BQU87UUFBRU0sV0FBVyxFQUFFWCxPQUFPLENBQUNNO01BQVc7SUFBRSxnQkFDeEV4TyxLQUFBLENBQUErRSxhQUFBO01BQUtNLFNBQVMsRUFBQztJQUF3QyxnQkFDbkRyRixLQUFBLENBQUErRSxhQUFBO01BQU1NLFNBQVMsRUFBQyxNQUFNO01BQUNHLEtBQUssRUFBRTtRQUFDTyxVQUFVLEVBQUNtSSxPQUFPLENBQUNPLE1BQU07UUFBRWpHLEtBQUssRUFBQzBGLE9BQU8sQ0FBQ1E7TUFBTTtJQUFFLEdBQUMsdUNBQXdDLENBQUMsZUFDMUgxTyxLQUFBLENBQUErRSxhQUFBO01BQU1NLFNBQVMsRUFBQyx1QkFBdUI7TUFBQ0csS0FBSyxFQUFFO1FBQUNnRCxLQUFLLEVBQUMwRixPQUFPLENBQUNTO01BQU07SUFBRSxHQUFFeEMsS0FBSyxFQUFDLGVBQUssRUFBQ0MsS0FBSyxFQUFDLGVBQU8sRUFBQ25ILEdBQUcsQ0FBQzVDLElBQUksRUFBQyxRQUFDLEVBQUM0QyxHQUFHLENBQUMzQyxJQUFJLEVBQUMsTUFBVSxDQUMvSCxDQUFDLGVBQ050QyxLQUFBLENBQUErRSxhQUFBO01BQUtrQyxPQUFPLFNBQUFhLE1BQUEsQ0FBUzhELENBQUMsT0FBQTlELE1BQUEsQ0FBSStELENBQUMsQ0FBRztNQUFDeEcsU0FBUyxFQUFDLGdEQUFnRDtNQUNwRkcsS0FBSyxFQUFFO1FBQUNPLFVBQVUsRUFBRW1JLE9BQU8sQ0FBQ0MsRUFBRTtRQUFFVyxZQUFZLEVBQUMsQ0FBQztRQUFFckssTUFBTSxFQUFFbUs7TUFBUztJQUFFLEdBRW5FRyxLQUFLLENBQUNDLElBQUksQ0FBQztNQUFDckssTUFBTSxFQUFDO0lBQUUsQ0FBQyxDQUFDLENBQUNxQixHQUFHLENBQUMsQ0FBQ3VCLENBQUMsRUFBQ3JCLENBQUMsS0FBSztNQUNsQyxJQUFNL0YsQ0FBQyxHQUFHZ00sS0FBSyxHQUFJakcsQ0FBQyxHQUFDLEVBQUUsSUFBS2tHLEtBQUssR0FBR0QsS0FBSyxDQUFDO01BQzFDLG9CQUNJbk0sS0FBQSxDQUFBK0UsYUFBQTtRQUFHdkUsR0FBRyxFQUFFLElBQUksR0FBQzBGO01BQUUsZ0JBQ1hsRyxLQUFBLENBQUErRSxhQUFBO1FBQU1rSyxFQUFFLEVBQUV6SSxDQUFDLENBQUNyRyxDQUFDLENBQUU7UUFBQytPLEVBQUUsRUFBRXBELEdBQUcsQ0FBQ2xELEdBQUk7UUFBQ3VHLEVBQUUsRUFBRTNJLENBQUMsQ0FBQ3JHLENBQUMsQ0FBRTtRQUFDaVAsRUFBRSxFQUFFdEQsR0FBRyxDQUFDbEQsR0FBRyxHQUFDc0QsS0FBTTtRQUNuRHZFLE1BQU0sRUFBRXVHLE9BQU8sQ0FBQ0UsSUFBSztRQUFDeEcsV0FBVyxFQUFDO01BQUssQ0FBQyxDQUFDLGVBQy9DNUgsS0FBQSxDQUFBK0UsYUFBQTtRQUFNeUIsQ0FBQyxFQUFFQSxDQUFDLENBQUNyRyxDQUFDLENBQUU7UUFBQ3VHLENBQUMsRUFBRW9GLEdBQUcsQ0FBQ2xELEdBQUcsR0FBQ3NELEtBQUssR0FBQyxFQUFHO1FBQUNtRCxRQUFRLEVBQUMsS0FBSztRQUFDL0gsSUFBSSxFQUFFNEcsT0FBTyxDQUFDRyxJQUFLO1FBQ2hFaUIsVUFBVSxFQUFDO01BQVEsR0FBRW5QLENBQUMsQ0FBQzBNLE9BQU8sQ0FBQyxDQUFDLENBQVEsQ0FDL0MsQ0FBQztJQUVaLENBQUMsQ0FBQyxFQUNEa0MsS0FBSyxDQUFDQyxJQUFJLENBQUM7TUFBQ3JLLE1BQU0sRUFBQztJQUFDLENBQUMsQ0FBQyxDQUFDcUIsR0FBRyxDQUFDLENBQUN1QixDQUFDLEVBQUNyQixDQUFDLEtBQUs7TUFDakMsSUFBTXFHLENBQUMsR0FBR0YsS0FBSyxHQUFJbkcsQ0FBQyxHQUFDLENBQUMsSUFBS29HLEtBQUssR0FBR0QsS0FBSyxDQUFDO01BQ3pDLG9CQUNJck0sS0FBQSxDQUFBK0UsYUFBQTtRQUFHdkUsR0FBRyxFQUFFLElBQUksR0FBQzBGO01BQUUsZ0JBQ1hsRyxLQUFBLENBQUErRSxhQUFBO1FBQU1rSyxFQUFFLEVBQUVuRCxHQUFHLENBQUNuRCxJQUFLO1FBQUN1RyxFQUFFLEVBQUV4SSxDQUFDLENBQUM2RixDQUFDLENBQUU7UUFBQzRDLEVBQUUsRUFBRXJELEdBQUcsQ0FBQ25ELElBQUksR0FBQ3NELEtBQU07UUFBQ21ELEVBQUUsRUFBRTFJLENBQUMsQ0FBQzZGLENBQUMsQ0FBRTtRQUNyRDVFLE1BQU0sRUFBRXVHLE9BQU8sQ0FBQ0UsSUFBSztRQUFDeEcsV0FBVyxFQUFDO01BQUssQ0FBQyxDQUFDLGVBQy9DNUgsS0FBQSxDQUFBK0UsYUFBQTtRQUFNeUIsQ0FBQyxFQUFFc0YsR0FBRyxDQUFDbkQsSUFBSSxHQUFDLENBQUU7UUFBQ2pDLENBQUMsRUFBRUEsQ0FBQyxDQUFDNkYsQ0FBQyxDQUFDLEdBQUMsQ0FBRTtRQUFDOEMsUUFBUSxFQUFDLEtBQUs7UUFBQy9ILElBQUksRUFBRTRHLE9BQU8sQ0FBQ0csSUFBSztRQUM1RGlCLFVBQVUsRUFBQztNQUFLLEdBQUUsQ0FBQy9DLENBQUMsR0FBQyxJQUFJLEVBQUVNLE9BQU8sQ0FBQyxDQUFDLENBQVEsQ0FDbkQsQ0FBQztJQUVaLENBQUMsQ0FBQyxFQUVEbUIsU0FBUyxDQUFDaEksR0FBRyxDQUFDMEcsRUFBRSxJQUFJO01BQ2pCLElBQU02QyxHQUFHLEdBQUcsRUFBRTtNQUNkLEtBQUssSUFBSXBQLEdBQUMsR0FBR2dNLEtBQUssRUFBRWhNLEdBQUMsSUFBSWlNLEtBQUssRUFBRWpNLEdBQUMsSUFBSSxHQUFHLEVBQUU7UUFDdEMsSUFBTXFQLEVBQUUsR0FBR2hELEtBQUssQ0FBQ3JNLEdBQUMsRUFBRXVNLEVBQUUsQ0FBQztRQUN2QixJQUFJOEMsRUFBRSxJQUFJbkQsS0FBSyxJQUFJbUQsRUFBRSxJQUFJbEQsS0FBSyxFQUFFaUQsR0FBRyxDQUFDdkMsSUFBSSxDQUFDLENBQUM3TSxHQUFDLEVBQUVxUCxFQUFFLENBQUMsQ0FBQztNQUNyRDtNQUNBLG9CQUNJeFAsS0FBQSxDQUFBK0UsYUFBQTtRQUFHdkUsR0FBRyxFQUFFLEtBQUssR0FBQ2tNO01BQUcsZ0JBQ2IxTSxLQUFBLENBQUErRSxhQUFBO1FBQVUwSyxNQUFNLEVBQUU5QyxPQUFPLENBQUM0QyxHQUFHLENBQUU7UUFBQ2pJLElBQUksRUFBQyxNQUFNO1FBQ2pDSyxNQUFNLEVBQUUrRSxFQUFFLEtBQUssR0FBRyxHQUFHLFNBQVMsR0FBRyxXQUFZO1FBQUM5RSxXQUFXLEVBQUMsS0FBSztRQUMvRDhILGVBQWUsRUFBRWhELEVBQUUsS0FBSyxHQUFHLEdBQUcsRUFBRSxHQUFHO01BQU0sQ0FBQyxDQUFDLEVBQ3BENkMsR0FBRyxDQUFDNUssTUFBTSxHQUFHLENBQUMsaUJBQ1gzRSxLQUFBLENBQUErRSxhQUFBO1FBQU15QixDQUFDLEVBQUVBLENBQUMsQ0FBQytJLEdBQUcsQ0FBQ2xKLElBQUksQ0FBQ3NKLEtBQUssQ0FBQ0osR0FBRyxDQUFDNUssTUFBTSxHQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUU7UUFDMUMrQixDQUFDLEVBQUVBLENBQUMsQ0FBQzZJLEdBQUcsQ0FBQ2xKLElBQUksQ0FBQ3NKLEtBQUssQ0FBQ0osR0FBRyxDQUFDNUssTUFBTSxHQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFFO1FBQzlDMEssUUFBUSxFQUFDLEdBQUc7UUFBQy9ILElBQUksRUFBQyxXQUFXO1FBQUNzSSxVQUFVLEVBQUM7TUFBSyxHQUFFbEQsRUFBRSxFQUFDLEdBQU8sQ0FFckUsQ0FBQztJQUVaLENBQUMsQ0FBQyxFQUdEekgsR0FBRyxDQUFDOUMsTUFBTSxpQkFDUG5DLEtBQUEsQ0FBQStFLGFBQUE7TUFBR00sU0FBUyxFQUFDLHFCQUFxQjtNQUFDUyxPQUFPLEVBQUM7SUFBSyxnQkFDNUM5RixLQUFBLENBQUErRSxhQUFBO01BQU1rSyxFQUFFLEVBQUV6SSxDQUFDLENBQUMsRUFBRSxDQUFFO01BQUMwSSxFQUFFLEVBQUV4SSxDQUFDLENBQUMsRUFBRSxHQUFDLElBQUksQ0FBRTtNQUFDeUksRUFBRSxFQUFFM0ksQ0FBQyxDQUFDLEVBQUUsQ0FBRTtNQUFDNEksRUFBRSxFQUFFMUksQ0FBQyxDQUFDLEVBQUUsR0FBQyxJQUFJLENBQUU7TUFDckRpQixNQUFNLEVBQUMsU0FBUztNQUFDQyxXQUFXLEVBQUMsS0FBSztNQUFDOEgsZUFBZSxFQUFDO0lBQUssQ0FBQyxDQUFDLGVBQ2hFMVAsS0FBQSxDQUFBK0UsYUFBQTtNQUFNa0ssRUFBRSxFQUFFekksQ0FBQyxDQUFDLEVBQUUsQ0FBRTtNQUFDMEksRUFBRSxFQUFFeEksQ0FBQyxDQUFDLEVBQUUsR0FBQyxJQUFJLENBQUU7TUFBQ3lJLEVBQUUsRUFBRTNJLENBQUMsQ0FBQyxFQUFFLENBQUU7TUFBQzRJLEVBQUUsRUFBRTFJLENBQUMsQ0FBQyxDQUFDLENBQUU7TUFDL0NpQixNQUFNLEVBQUMsU0FBUztNQUFDQyxXQUFXLEVBQUMsS0FBSztNQUFDOEgsZUFBZSxFQUFDO0lBQUssQ0FBQyxDQUFDLGVBQ2hFMVAsS0FBQSxDQUFBK0UsYUFBQTtNQUFNa0ssRUFBRSxFQUFFekksQ0FBQyxDQUFDLEVBQUUsQ0FBRTtNQUFDMEksRUFBRSxFQUFFeEksQ0FBQyxDQUFDLENBQUMsQ0FBRTtNQUFDeUksRUFBRSxFQUFFM0ksQ0FBQyxDQUFDLEVBQUUsQ0FBRTtNQUFDNEksRUFBRSxFQUFFMUksQ0FBQyxDQUFDLENBQUMsQ0FBRTtNQUN6Q2lCLE1BQU0sRUFBQyxTQUFTO01BQUNDLFdBQVcsRUFBQyxLQUFLO01BQUM4SCxlQUFlLEVBQUM7SUFBSyxDQUFDLENBQUMsZUFFaEUxUCxLQUFBLENBQUErRSxhQUFBO01BQVMwSyxNQUFNLEVBQUU5QyxPQUFPLENBQUNnQixHQUFHLENBQUU7TUFBRXJHLElBQUksRUFBQyxTQUFTO01BQUN1SSxXQUFXLEVBQUMsTUFBTTtNQUFDbEksTUFBTSxFQUFDLFNBQVM7TUFBQ0MsV0FBVyxFQUFDO0lBQUcsQ0FBQyxDQUFDLGVBQ3BHNUgsS0FBQSxDQUFBK0UsYUFBQTtNQUFTMEssTUFBTSxFQUFFOUMsT0FBTyxDQUFDZSxJQUFJLENBQUU7TUFBQ3BHLElBQUksRUFBQyxTQUFTO01BQUN1SSxXQUFXLEVBQUMsTUFBTTtNQUFDbEksTUFBTSxFQUFDLFNBQVM7TUFBQ0MsV0FBVyxFQUFDO0lBQUcsQ0FBQyxDQUFDLGVBQ3BHNUgsS0FBQSxDQUFBK0UsYUFBQTtNQUFTMEssTUFBTSxFQUFFOUMsT0FBTyxDQUFDaUIsSUFBSSxDQUFFO01BQUN0RyxJQUFJLEVBQUMsU0FBUztNQUFDdUksV0FBVyxFQUFDLE1BQU07TUFBQ2xJLE1BQU0sRUFBQyxTQUFTO01BQUNDLFdBQVcsRUFBQztJQUFHLENBQUMsQ0FBQyxlQUNwRzVILEtBQUEsQ0FBQStFLGFBQUE7TUFBUzBLLE1BQU0sRUFBRTlDLE9BQU8sQ0FBQ2MsRUFBRSxDQUFFO01BQUduRyxJQUFJLEVBQUMsU0FBUztNQUFDdUksV0FBVyxFQUFDLE1BQU07TUFBQ2xJLE1BQU0sRUFBQyxTQUFTO01BQUNDLFdBQVcsRUFBQztJQUFHLENBQUMsQ0FBQyxlQUNwRzVILEtBQUEsQ0FBQStFLGFBQUE7TUFBUzBLLE1BQU0sRUFBRTlDLE9BQU8sQ0FBQ1MsRUFBRSxDQUFFO01BQUc5RixJQUFJLEVBQUMsU0FBUztNQUFDdUksV0FBVyxFQUFDLE1BQU07TUFBQ2xJLE1BQU0sRUFBQyxTQUFTO01BQUNDLFdBQVcsRUFBQztJQUFLLENBQUMsQ0FBQyxlQUd0RzVILEtBQUEsQ0FBQStFLGFBQUEsNEJBQ0kvRSxLQUFBLENBQUErRSxhQUFBO01BQVVvQyxFQUFFLEVBQUMsY0FBYztNQUFDMkksYUFBYSxFQUFDO0lBQWdCLGdCQUN0RDlQLEtBQUEsQ0FBQStFLGFBQUE7TUFBUzBLLE1BQU0sRUFBRTlDLE9BQU8sQ0FBQ1MsRUFBRTtJQUFFLENBQUMsQ0FDeEIsQ0FDUixDQUFDLGVBQ1BwTixLQUFBLENBQUErRSxhQUFBO01BQVMwSyxNQUFNLEVBQUU5QyxPQUFPLENBQUNhLEtBQUssQ0FBRTtNQUFDdUMsUUFBUSxFQUFDLG9CQUFvQjtNQUNyRHpJLElBQUksRUFBQyxTQUFTO01BQUN1SSxXQUFXLEVBQUMsTUFBTTtNQUFDbEksTUFBTSxFQUFDLFNBQVM7TUFBQ0MsV0FBVyxFQUFDLEtBQUs7TUFBQzhILGVBQWUsRUFBQztJQUFLLENBQUMsQ0FBQyxlQUVyRzFQLEtBQUEsQ0FBQStFLGFBQUE7TUFBUzBLLE1BQU0sRUFBRTlDLE9BQU8sQ0FBQ29CLE1BQU0sQ0FBRTtNQUFDekcsSUFBSSxFQUFDLFNBQVM7TUFBQ3VJLFdBQVcsRUFBQyxNQUFNO01BQUNsSSxNQUFNLEVBQUM7SUFBTSxDQUFDLENBQUMsZUFDbkYzSCxLQUFBLENBQUErRSxhQUFBO01BQU1rSyxFQUFFLEVBQUV6SSxDQUFDLENBQUMsRUFBRSxDQUFFO01BQUMwSSxFQUFFLEVBQUVwRCxHQUFHLENBQUNsRCxHQUFHLEdBQUMsRUFBRztNQUFDdUcsRUFBRSxFQUFFM0ksQ0FBQyxDQUFDLEVBQUUsQ0FBRTtNQUFDNEksRUFBRSxFQUFFdEQsR0FBRyxDQUFDbEQsR0FBRyxHQUFDc0QsS0FBTTtNQUN4RHZFLE1BQU0sRUFBQyxTQUFTO01BQUNDLFdBQVcsRUFBQyxHQUFHO01BQUM4SCxlQUFlLEVBQUMsS0FBSztNQUFDNUosT0FBTyxFQUFDO0lBQUssQ0FBQyxDQUFDLGVBRzVFOUYsS0FBQSxDQUFBK0UsYUFBQTtNQUFNeUIsQ0FBQyxFQUFFQSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsRUFBRztNQUFDRSxDQUFDLEVBQUVBLENBQUMsQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFFO01BQUNZLElBQUksRUFBQyxTQUFTO01BQUMrSCxRQUFRLEVBQUMsSUFBSTtNQUFDTyxVQUFVLEVBQUMsS0FBSztNQUN4RU4sVUFBVSxFQUFDLFFBQVE7TUFBQ3pHLFNBQVMsaUJBQUFmLE1BQUEsQ0FBaUJ0QixDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsRUFBRSxRQUFBc0IsTUFBQSxDQUFLcEIsQ0FBQyxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsTUFBSTtNQUN4RXNKLGFBQWEsRUFBQztJQUFHLEdBQUMsb0JBQXdCLENBQUMsZUFDakRoUSxLQUFBLENBQUErRSxhQUFBO01BQU15QixDQUFDLEVBQUVBLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxDQUFFO01BQUNFLENBQUMsRUFBRUEsQ0FBQyxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUU7TUFBQ1ksSUFBSSxFQUFDLFNBQVM7TUFBQytILFFBQVEsRUFBQyxHQUFHO01BQUNPLFVBQVUsRUFBQyxLQUFLO01BQ3RFTixVQUFVLEVBQUMsUUFBUTtNQUFDekcsU0FBUyxpQkFBQWYsTUFBQSxDQUFpQnRCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLFFBQUFzQixNQUFBLENBQUtwQixDQUFDLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxNQUFJO01BQ3ZFc0osYUFBYSxFQUFDO0lBQUssR0FBQyxjQUFrQixDQUFDLGVBQzdDaFEsS0FBQSxDQUFBK0UsYUFBQTtNQUFNeUIsQ0FBQyxFQUFFQSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsRUFBRztNQUFDRSxDQUFDLEVBQUVBLENBQUMsQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFFO01BQUNZLElBQUksRUFBQyxTQUFTO01BQUMrSCxRQUFRLEVBQUMsR0FBRztNQUFDTyxVQUFVLEVBQUMsS0FBSztNQUN2RU4sVUFBVSxFQUFDLFFBQVE7TUFBQ3pHLFNBQVMsaUJBQUFmLE1BQUEsQ0FBaUJ0QixDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsRUFBRSxRQUFBc0IsTUFBQSxDQUFLcEIsQ0FBQyxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsTUFBSTtNQUN4RXNKLGFBQWEsRUFBQztJQUFLLEdBQUMsY0FBa0IsQ0FBQyxlQUM3Q2hRLEtBQUEsQ0FBQStFLGFBQUE7TUFBTXlCLENBQUMsRUFBRUEsQ0FBQyxDQUFDLEVBQUUsQ0FBRTtNQUFDRSxDQUFDLEVBQUVBLENBQUMsQ0FBQyxHQUFHLEdBQUMsSUFBSSxDQUFDLEdBQUMsQ0FBRTtNQUFDWSxJQUFJLEVBQUMsU0FBUztNQUFDK0gsUUFBUSxFQUFDLEdBQUc7TUFBQ08sVUFBVSxFQUFDLEtBQUs7TUFDeEVOLFVBQVUsRUFBQyxRQUFRO01BQUNVLGFBQWEsRUFBQztJQUFHLEdBQUMsYUFBaUIsQ0FBQyxlQUM5RGhRLEtBQUEsQ0FBQStFLGFBQUE7TUFBTXlCLENBQUMsRUFBRUEsQ0FBQyxDQUFDLElBQUksQ0FBRTtNQUFDRSxDQUFDLEVBQUVBLENBQUMsQ0FBQzhGLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUU7TUFBQ2xGLElBQUksRUFBQyxTQUFTO01BQUMrSCxRQUFRLEVBQUMsSUFBSTtNQUMvRE8sVUFBVSxFQUFDLEtBQUs7TUFBQ04sVUFBVSxFQUFDLFFBQVE7TUFBQ1UsYUFBYSxFQUFDO0lBQUssR0FBQyxTQUFhLENBQUMsZUFDN0VoUSxLQUFBLENBQUErRSxhQUFBO01BQU15QixDQUFDLEVBQUVBLENBQUMsQ0FBQyxLQUFLLENBQUU7TUFBQ0UsQ0FBQyxFQUFFQSxDQUFDLENBQUM4RixLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFFO01BQUNsRixJQUFJLEVBQUMsU0FBUztNQUFDK0gsUUFBUSxFQUFDLElBQUk7TUFDakVPLFVBQVUsRUFBQyxLQUFLO01BQUNOLFVBQVUsRUFBQyxRQUFRO01BQ3BDekcsU0FBUyxpQkFBQWYsTUFBQSxDQUFpQnRCLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBQXNCLE1BQUEsQ0FBS3BCLENBQUMsQ0FBQzhGLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFBSSxHQUFDLFFBQVksQ0FBQyxlQUNsRnhNLEtBQUEsQ0FBQStFLGFBQUE7TUFBTXlCLENBQUMsRUFBRUEsQ0FBQyxDQUFDLElBQUksQ0FBRTtNQUFDRSxDQUFDLEVBQUVBLENBQUMsQ0FBQzhGLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQ3ZILEdBQUcsQ0FBQzVDLElBQUksR0FBQzRDLEdBQUcsQ0FBQzNDLElBQUksSUFBRSxDQUFDLENBQUMsQ0FBRTtNQUNyRGdGLElBQUksRUFBQyxTQUFTO01BQUMrSCxRQUFRLEVBQUMsR0FBRztNQUFDTyxVQUFVLEVBQUMsS0FBSztNQUFDTixVQUFVLEVBQUMsUUFBUTtNQUNoRTlKLEtBQUssRUFBRTtRQUFDeUssVUFBVSxFQUFDLFFBQVE7UUFBRXRJLE1BQU0sRUFBQyxTQUFTO1FBQUVDLFdBQVcsRUFBQyxPQUFPO1FBQUV1QixjQUFjLEVBQUM7TUFBTyxDQUFFO01BQzVGNkcsYUFBYSxFQUFDO0lBQUssR0FBRS9LLEdBQUcsQ0FBQzVDLElBQUksRUFBQyxHQUFDLEVBQUM0QyxHQUFHLENBQUMzQyxJQUFJLEVBQUMsTUFBVSxDQUMxRCxDQUNOLGVBR0R0QyxLQUFBLENBQUErRSxhQUFBO01BQU15QixDQUFDLEVBQUVzRixHQUFHLENBQUNuRCxJQUFJLEdBQUdzRCxLQUFLLEdBQUMsQ0FBRTtNQUFDdkYsQ0FBQyxFQUFFbUYsQ0FBQyxHQUFDLEVBQUc7TUFBQ3dELFFBQVEsRUFBQyxJQUFJO01BQUMvSCxJQUFJLEVBQUU0RyxPQUFPLENBQUNJLElBQUs7TUFDakVnQixVQUFVLEVBQUMsUUFBUTtNQUFDTSxVQUFVLEVBQUMsS0FBSztNQUFDSSxhQUFhLEVBQUM7SUFBRyxHQUFDLHVCQUF3QixDQUFDLGVBQ3RGaFEsS0FBQSxDQUFBK0UsYUFBQTtNQUFNeUIsQ0FBQyxFQUFFLEVBQUc7TUFBQ0UsQ0FBQyxFQUFFb0YsR0FBRyxDQUFDbEQsR0FBRyxHQUFHc0QsS0FBSyxHQUFDLENBQUU7TUFBQ21ELFFBQVEsRUFBQyxJQUFJO01BQUMvSCxJQUFJLEVBQUU0RyxPQUFPLENBQUNJLElBQUs7TUFDOURnQixVQUFVLEVBQUMsUUFBUTtNQUFDTSxVQUFVLEVBQUMsS0FBSztNQUFDSSxhQUFhLEVBQUMsR0FBRztNQUN0RG5ILFNBQVMsbUJBQUFmLE1BQUEsQ0FBbUJnRSxHQUFHLENBQUNsRCxHQUFHLEdBQUdzRCxLQUFLLEdBQUMsQ0FBQztJQUFJLEdBQUMsdUJBQTJCLENBQ2xGLENBQ0osQ0FBQztFQUVkO0VBRUEsU0FBU1YsZUFBZUEsQ0FBQTBFLEtBQUEsRUFBMEI7SUFBQSxJQUF2QmpMLEdBQUcsR0FBQWlMLEtBQUEsQ0FBSGpMLEdBQUc7TUFBRXFFLE1BQU0sR0FBQTRHLEtBQUEsQ0FBTjVHLE1BQU07TUFBRXBFLE1BQU0sR0FBQWdMLEtBQUEsQ0FBTmhMLE1BQU07SUFDMUMsb0JBQ0lsRixLQUFBLENBQUErRSxhQUFBO01BQUtNLFNBQVMsRUFBQztJQUFtRSxnQkFLOUVyRixLQUFBLENBQUErRSxhQUFBO01BQUssZUFBWTtJQUFxQixnQkFDbEMvRSxLQUFBLENBQUErRSxhQUFBO01BQUtNLFNBQVMsRUFBQztJQUFrQixHQUFFbEYsQ0FBQyxDQUFDLGlCQUFpQixDQUFPLENBQUMsZUFDOURILEtBQUEsQ0FBQStFLGFBQUE7TUFBS00sU0FBUyxFQUFDO0lBQTZCLGdCQUN4Q3JGLEtBQUEsQ0FBQStFLGFBQUE7TUFBUSxlQUFZLG9CQUFvQjtNQUNoQ08sT0FBTyxFQUFFQSxDQUFBLEtBQU1KLE1BQU0sQ0FBQ3FFLENBQUMsSUFBQXpFLGFBQUEsQ0FBQUEsYUFBQSxLQUFTeUUsQ0FBQztRQUFFOUcsS0FBSyxFQUFDLE1BQU07UUFBRUMsU0FBUyxFQUFDMkQsSUFBSSxDQUFDcUUsR0FBRyxDQUFDbkIsQ0FBQyxDQUFDN0csU0FBUyxJQUFJLEdBQUcsRUFBRSxHQUFHO01BQUMsRUFBRSxDQUFFO01BQ2hHMkMsU0FBUywySEFBQXlDLE1BQUEsQ0FDSDdDLEdBQUcsQ0FBQ3hDLEtBQUssS0FBSyxNQUFNLEdBQ2hCLGtGQUFrRixHQUNsRix1RUFBdUU7SUFBRyxHQUN2RnRDLENBQUMsQ0FBQyxhQUFhLENBQ1osQ0FBQyxlQUNUSCxLQUFBLENBQUErRSxhQUFBO01BQVEsZUFBWSxxQkFBcUI7TUFDakNPLE9BQU8sRUFBRUEsQ0FBQSxLQUFNSixNQUFNLENBQUNxRSxDQUFDLElBQUF6RSxhQUFBLENBQUFBLGFBQUEsS0FBU3lFLENBQUM7UUFBRTlHLEtBQUssRUFBQyxPQUFPO1FBQUVDLFNBQVMsRUFBQztNQUFHLEVBQUUsQ0FBRTtNQUNuRTJDLFNBQVMsMkhBQUF5QyxNQUFBLENBQ0g3QyxHQUFHLENBQUN4QyxLQUFLLEtBQUssT0FBTyxHQUNqQix5RUFBeUUsR0FDekUsdUVBQXVFO0lBQUcsR0FDdkZ0QyxDQUFDLENBQUMsZUFBZSxDQUNkLENBQ1AsQ0FBQyxlQUVOSCxLQUFBLENBQUErRSxhQUFBO01BQUtNLFNBQVMsRUFBRUosR0FBRyxDQUFDeEMsS0FBSyxLQUFLLE9BQU8sR0FBRyxnQ0FBZ0MsR0FBRztJQUFHLGdCQUMxRXpDLEtBQUEsQ0FBQStFLGFBQUE7TUFBS00sU0FBUyxFQUFDO0lBQXdDLGdCQUNuRHJGLEtBQUEsQ0FBQStFLGFBQUE7TUFBT00sU0FBUyxFQUFDO0lBQWdFLEdBQUVsRixDQUFDLENBQUMsbUJBQW1CLENBQVMsQ0FBQyxlQUNsSEgsS0FBQSxDQUFBK0UsYUFBQTtNQUFNTSxTQUFTLEVBQUM7SUFBb0QsR0FBRWdCLElBQUksQ0FBQzhKLEtBQUssQ0FBQyxDQUFDbEwsR0FBRyxDQUFDdkMsU0FBUyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsRUFBQyxHQUFPLENBQ3JILENBQUMsZUFDTjFDLEtBQUEsQ0FBQStFLGFBQUE7TUFBT3FMLElBQUksRUFBQyxPQUFPO01BQ1osZUFBWSxvQkFBb0I7TUFDaEMxRixHQUFHLEVBQUMsS0FBSztNQUFDQyxHQUFHLEVBQUMsS0FBSztNQUFDOUQsSUFBSSxFQUFDLE1BQU07TUFDL0J3SixLQUFLLEVBQUVwTCxHQUFHLENBQUN4QyxLQUFLLEtBQUssT0FBTyxHQUFHLEdBQUcsR0FBSXdDLEdBQUcsQ0FBQ3ZDLFNBQVMsSUFBSSxHQUFLO01BQzVENE4sUUFBUSxFQUFHek0sQ0FBQyxJQUFLcUIsTUFBTSxDQUFDcUUsQ0FBQyxJQUFBekUsYUFBQSxDQUFBQSxhQUFBLEtBQVN5RSxDQUFDO1FBQUU3RyxTQUFTLEVBQUU2SCxVQUFVLENBQUMxRyxDQUFDLENBQUMwTSxNQUFNLENBQUNGLEtBQUssQ0FBQztRQUFFNU4sS0FBSyxFQUFDO01BQU0sRUFBRSxDQUFFO01BQzVGNEMsU0FBUyxFQUFDLG9CQUFvQjtNQUM5QkcsS0FBSyxFQUFFO1FBQUVnTCxXQUFXLEVBQUM7TUFBVTtJQUFFLENBQUMsQ0FDeEMsQ0FBQyxlQUNOeFEsS0FBQSxDQUFBK0UsYUFBQTtNQUFHTSxTQUFTLEVBQUM7SUFBd0MsR0FBQyx5R0FFbkQsQ0FDRixDQUFDLGVBR05yRixLQUFBLENBQUErRSxhQUFBLDJCQUNJL0UsS0FBQSxDQUFBK0UsYUFBQTtNQUFLTSxTQUFTLEVBQUM7SUFBa0IsR0FBRWxGLENBQUMsQ0FBQyxrQkFBa0IsQ0FBTyxDQUFDLGVBQy9ESCxLQUFBLENBQUErRSxhQUFBO01BQVFPLE9BQU8sRUFBRUEsQ0FBQSxLQUFNZ0UsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDckUsR0FBRyxDQUFDOUMsTUFBTSxDQUFFO01BQzdDa0QsU0FBUyw2SEFBQXlDLE1BQUEsQ0FDSzdDLEdBQUcsQ0FBQzlDLE1BQU0sR0FDTix5REFBeUQsR0FDekQscURBQXFEO0lBQUcsR0FDN0U4QyxHQUFHLENBQUM5QyxNQUFNLEdBQUdoQyxDQUFDLENBQUMsY0FBYyxDQUFDLEdBQUdBLENBQUMsQ0FBQyxlQUFlLENBQy9DLENBQUMsZUFDVEgsS0FBQSxDQUFBK0UsYUFBQTtNQUFHTSxTQUFTLEVBQUM7SUFBaUQsR0FBQywrRUFFNUQsQ0FDRixDQUFDLGVBR05yRixLQUFBLENBQUErRSxhQUFBLDJCQUNJL0UsS0FBQSxDQUFBK0UsYUFBQTtNQUFLTSxTQUFTLEVBQUM7SUFBa0IsR0FBRWxGLENBQUMsQ0FBQyxrQkFBa0IsQ0FBTyxDQUFDLGVBQy9ESCxLQUFBLENBQUErRSxhQUFBO01BQUtNLFNBQVMsRUFBQztJQUFNLGdCQUNqQnJGLEtBQUEsQ0FBQStFLGFBQUE7TUFBT00sU0FBUyxFQUFDO0lBQTJFLEdBQUVsRixDQUFDLENBQUMsaUJBQWlCLENBQVMsQ0FBQyxlQUMzSEgsS0FBQSxDQUFBK0UsYUFBQTtNQUFRTSxTQUFTLEVBQUMsNEJBQTRCO01BQ3RDZ0wsS0FBSyxFQUFFcEwsR0FBRyxDQUFDN0MsUUFBUSxJQUFJLFFBQVM7TUFDaENrTyxRQUFRLEVBQUd6TSxDQUFDLElBQUs7UUFDYixJQUFNK0YsQ0FBQyxHQUFHTyxVQUFVLENBQUNDLElBQUksQ0FBQ1IsQ0FBQyxJQUFJQSxDQUFDLENBQUN6QyxFQUFFLEtBQUt0RCxDQUFDLENBQUMwTSxNQUFNLENBQUNGLEtBQUssQ0FBQztRQUN2RCxJQUFJLENBQUN6RyxDQUFDLEVBQUU7UUFDUixJQUFJQSxDQUFDLENBQUN6QyxFQUFFLEtBQUssUUFBUSxFQUFFO1VBQ25CbUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUM7UUFDaEMsQ0FBQyxNQUFNO1VBQ0hwRSxNQUFNLENBQUNxRSxDQUFDLElBQUF6RSxhQUFBLENBQUFBLGFBQUEsS0FBU3lFLENBQUM7WUFBRW5ILFFBQVEsRUFBQ3dILENBQUMsQ0FBQ3pDLEVBQUU7WUFBRTlFLElBQUksRUFBQ3VILENBQUMsQ0FBQ0ssRUFBRTtZQUFFM0gsSUFBSSxFQUFDc0gsQ0FBQyxDQUFDTTtVQUFFLEVBQUUsQ0FBQztRQUM5RDtNQUNKO0lBQUUsR0FDTEMsVUFBVSxDQUFDbkUsR0FBRyxDQUFDNEQsQ0FBQyxpQkFDYjVKLEtBQUEsQ0FBQStFLGFBQUE7TUFBUXZFLEdBQUcsRUFBRW9KLENBQUMsQ0FBQ3pDLEVBQUc7TUFBQ2tKLEtBQUssRUFBRXpHLENBQUMsQ0FBQ3pDO0lBQUcsR0FDMUJ5QyxDQUFDLENBQUM2QixLQUFLLEVBQUU3QixDQUFDLENBQUNLLEVBQUUsSUFBSSxJQUFJLGNBQUFuQyxNQUFBLENBQVc4QixDQUFDLENBQUNLLEVBQUUsT0FBQW5DLE1BQUEsQ0FBSThCLENBQUMsQ0FBQ00sRUFBRSxZQUFTLEVBQ2xELENBQ1gsQ0FDRyxDQUFDLEVBQ1IsQ0FBQyxNQUFNO01BQ0osSUFBTU4sQ0FBQyxHQUFHTyxVQUFVLENBQUNDLElBQUksQ0FBQzVELENBQUMsSUFBSUEsQ0FBQyxDQUFDVyxFQUFFLE1BQU1sQyxHQUFHLENBQUM3QyxRQUFRLElBQUksUUFBUSxDQUFDLENBQUM7TUFDbkUsT0FBT3dILENBQUMsSUFBSUEsQ0FBQyxDQUFDOEIsSUFBSSxnQkFDZDFMLEtBQUEsQ0FBQStFLGFBQUE7UUFBR00sU0FBUyxFQUFDO01BQTBDLEdBQUV1RSxDQUFDLENBQUM4QixJQUFRLENBQUMsR0FDcEUsSUFBSTtJQUNaLENBQUMsRUFBRSxDQUNGLENBQUMsZUFDTjFMLEtBQUEsQ0FBQStFLGFBQUE7TUFBS00sU0FBUyxFQUFDO0lBQThCLGdCQUN6Q3JGLEtBQUEsQ0FBQStFLGFBQUE7TUFBTU0sU0FBUyxFQUFDO0lBQXVDLEdBQUVKLEdBQUcsQ0FBQzVDLElBQUksRUFBQyxHQUFPLENBQUMsZUFDMUVyQyxLQUFBLENBQUErRSxhQUFBO01BQU9xTCxJQUFJLEVBQUMsT0FBTztNQUFDMUYsR0FBRyxFQUFDLElBQUk7TUFBQ0MsR0FBRyxFQUFFMUYsR0FBRyxDQUFDM0MsSUFBSSxHQUFDLENBQUU7TUFBQytOLEtBQUssRUFBRXBMLEdBQUcsQ0FBQzVDLElBQUs7TUFDdkRpTyxRQUFRLEVBQUd6TSxDQUFDLElBQUtxQixNQUFNLENBQUNxRSxDQUFDLElBQUF6RSxhQUFBLENBQUFBLGFBQUEsS0FBU3lFLENBQUM7UUFBRWxILElBQUksRUFBQyxDQUFDd0IsQ0FBQyxDQUFDME0sTUFBTSxDQUFDRixLQUFLO1FBQUVqTyxRQUFRLEVBQUM7TUFBUSxFQUFFLENBQUU7TUFDaEZpRCxTQUFTLEVBQUM7SUFBb0IsQ0FBQyxDQUNyQyxDQUFDLGVBQ05yRixLQUFBLENBQUErRSxhQUFBO01BQUtNLFNBQVMsRUFBQztJQUF5QixnQkFDcENyRixLQUFBLENBQUErRSxhQUFBO01BQU1NLFNBQVMsRUFBQztJQUF1QyxHQUFFSixHQUFHLENBQUMzQyxJQUFJLEVBQUMsR0FBTyxDQUFDLGVBQzFFdEMsS0FBQSxDQUFBK0UsYUFBQTtNQUFPcUwsSUFBSSxFQUFDLE9BQU87TUFBQzFGLEdBQUcsRUFBRXpGLEdBQUcsQ0FBQzVDLElBQUksR0FBQyxDQUFFO01BQUNzSSxHQUFHLEVBQUMsSUFBSTtNQUFDMEYsS0FBSyxFQUFFcEwsR0FBRyxDQUFDM0MsSUFBSztNQUN2RGdPLFFBQVEsRUFBR3pNLENBQUMsSUFBS3FCLE1BQU0sQ0FBQ3FFLENBQUMsSUFBQXpFLGFBQUEsQ0FBQUEsYUFBQSxLQUFTeUUsQ0FBQztRQUFFakgsSUFBSSxFQUFDLENBQUN1QixDQUFDLENBQUMwTSxNQUFNLENBQUNGLEtBQUs7UUFBRWpPLFFBQVEsRUFBQztNQUFRLEVBQUUsQ0FBRTtNQUNoRmlELFNBQVMsRUFBQztJQUFvQixDQUFDLENBQ3JDLENBQ0osQ0FBQyxlQUdOckYsS0FBQSxDQUFBK0UsYUFBQSwyQkFDSS9FLEtBQUEsQ0FBQStFLGFBQUE7TUFBS00sU0FBUyxFQUFDO0lBQWtCLEdBQUVsRixDQUFDLENBQUMsb0JBQW9CLENBQU8sQ0FBQyxlQUNqRUgsS0FBQSxDQUFBK0UsYUFBQTtNQUFLTSxTQUFTLEVBQUM7SUFBOEIsZ0JBQ3pDckYsS0FBQSxDQUFBK0UsYUFBQTtNQUFNTSxTQUFTLEVBQUM7SUFBdUMsR0FBRUosR0FBRyxDQUFDMUMsR0FBRyxFQUFDLE1BQU8sQ0FBQyxlQUN6RXZDLEtBQUEsQ0FBQStFLGFBQUE7TUFBT3FMLElBQUksRUFBQyxPQUFPO01BQUMxRixHQUFHLEVBQUMsS0FBSztNQUFDQyxHQUFHLEVBQUUxRixHQUFHLENBQUN6QyxHQUFHLEdBQUMsRUFBRztNQUFDNk4sS0FBSyxFQUFFcEwsR0FBRyxDQUFDMUMsR0FBSTtNQUN2RCtOLFFBQVEsRUFBR3pNLENBQUMsSUFBS3lGLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQ3pGLENBQUMsQ0FBQzBNLE1BQU0sQ0FBQ0YsS0FBSyxDQUFFO01BQ2hEaEwsU0FBUyxFQUFDO0lBQW9CLENBQUMsQ0FDckMsQ0FBQyxlQUNOckYsS0FBQSxDQUFBK0UsYUFBQTtNQUFLTSxTQUFTLEVBQUM7SUFBeUIsZ0JBQ3BDckYsS0FBQSxDQUFBK0UsYUFBQTtNQUFNTSxTQUFTLEVBQUM7SUFBdUMsR0FBRUosR0FBRyxDQUFDekMsR0FBRyxFQUFDLE1BQU8sQ0FBQyxlQUN6RXhDLEtBQUEsQ0FBQStFLGFBQUE7TUFBT3FMLElBQUksRUFBQyxPQUFPO01BQUMxRixHQUFHLEVBQUV6RixHQUFHLENBQUMxQyxHQUFHLEdBQUMsRUFBRztNQUFDb0ksR0FBRyxFQUFDLElBQUk7TUFBQzBGLEtBQUssRUFBRXBMLEdBQUcsQ0FBQ3pDLEdBQUk7TUFDdEQ4TixRQUFRLEVBQUd6TSxDQUFDLElBQUt5RixNQUFNLENBQUMsS0FBSyxFQUFFLENBQUN6RixDQUFDLENBQUMwTSxNQUFNLENBQUNGLEtBQUssQ0FBRTtNQUNoRGhMLFNBQVMsRUFBQztJQUFvQixDQUFDLENBQ3JDLENBQUMsZUFDTnJGLEtBQUEsQ0FBQStFLGFBQUE7TUFBR00sU0FBUyxFQUFDO0lBQWlELEdBQUMsOERBRTVELENBQ0YsQ0FBQyxlQUVOckYsS0FBQSxDQUFBK0UsYUFBQTtNQUFLTSxTQUFTLEVBQUM7SUFBZ0MsZ0JBQzNDckYsS0FBQSxDQUFBK0UsYUFBQTtNQUFHTSxTQUFTLEVBQUM7SUFBNEMsR0FBQyw4REFFdEQsZUFBQXJGLEtBQUEsQ0FBQStFLGFBQUE7TUFBTU0sU0FBUyxFQUFDO0lBQTRCLEdBQUMsaUJBQXFCLENBQUMsb0NBRXBFLENBQ0YsQ0FDSixDQUFDO0VBRWQ7O0VBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztFQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7RUFDQSxTQUFTb0wsY0FBY0EsQ0FBQzdELEdBQUcsRUFBRTtJQUN6QixJQUFNOEQsSUFBSSxHQUFHLElBQUlDLEdBQUcsQ0FBQyxDQUFDO0lBQ3RCLElBQU1DLEdBQUcsR0FBRyxFQUFFO0lBQ2QsS0FBSyxJQUFNQyxDQUFDLElBQUtqRSxHQUFHLElBQUksRUFBRSxFQUFHO01BQ3pCLElBQUksQ0FBQ2lFLENBQUMsSUFBSSxPQUFPQSxDQUFDLENBQUNDLElBQUksS0FBSyxRQUFRLEVBQUU7TUFDdEMsSUFBTTdOLEdBQUcsR0FBRyxDQUFDNE4sQ0FBQyxDQUFDNU4sR0FBRztRQUFFQyxHQUFHLEdBQUcsQ0FBQzJOLENBQUMsQ0FBQzNOLEdBQUc7TUFDaEMsSUFBSSxDQUFDNkcsTUFBTSxDQUFDQyxRQUFRLENBQUMvRyxHQUFHLENBQUMsSUFBSSxDQUFDOEcsTUFBTSxDQUFDQyxRQUFRLENBQUM5RyxHQUFHLENBQUMsRUFBRTtNQUNwRCxJQUFNNE4sSUFBSSxHQUFHRCxDQUFDLENBQUNDLElBQUksQ0FBQ0MsSUFBSSxDQUFDLENBQUM7TUFDMUIsSUFBSSxDQUFDRCxJQUFJLEVBQUU7TUFDWCxJQUFNdFEsR0FBRyxHQUFHeUMsR0FBRyxDQUFDNEosT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRzNKLEdBQUcsQ0FBQzJKLE9BQU8sQ0FBQyxDQUFDLENBQUM7TUFDakQsSUFBSTZELElBQUksQ0FBQ00sR0FBRyxDQUFDeFEsR0FBRyxDQUFDLEVBQUU7TUFDbkJrUSxJQUFJLENBQUNPLEdBQUcsQ0FBQ3pRLEdBQUcsQ0FBQztNQUNib1EsR0FBRyxDQUFDNUQsSUFBSSxDQUFDO1FBQUU4RCxJQUFJO1FBQUU3TixHQUFHO1FBQUVDO01BQUksQ0FBQyxDQUFDO0lBQ2hDO0lBQ0EsT0FBTzBOLEdBQUc7RUFDZDtFQUVBLFNBQVM1SSxhQUFhQSxDQUFBa0osS0FBQSxFQUFtQztJQUFBLElBQWhDak0sR0FBRyxHQUFBaU0sS0FBQSxDQUFIak0sR0FBRztNQUFFQyxNQUFNLEdBQUFnTSxLQUFBLENBQU5oTSxNQUFNO01BQUUrQyxPQUFPLEdBQUFpSixLQUFBLENBQVBqSixPQUFPO01BQUU3QyxNQUFNLEdBQUE4TCxLQUFBLENBQU45TCxNQUFNO0lBQ2pELElBQU0rTCxTQUFTLEdBQUduUixLQUFLLENBQUNvUixNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ3BDLElBQU1DLE1BQU0sR0FBTXJSLEtBQUssQ0FBQ29SLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDcEMsSUFBTUUsU0FBUyxHQUFHdFIsS0FBSyxDQUFDb1IsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNwQyxJQUFBRyxlQUFBLEdBQThCdlIsS0FBSyxDQUFDQyxRQUFRLENBQUMsS0FBSyxDQUFDO01BQUF1UixnQkFBQSxHQUFBalEsY0FBQSxDQUFBZ1EsZUFBQTtNQUE1Q0UsT0FBTyxHQUFBRCxnQkFBQTtNQUFFRSxVQUFVLEdBQUFGLGdCQUFBOztJQUUxQjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0lBQ0ksSUFBQUcsZ0JBQUEsR0FBa0MzUixLQUFLLENBQUNDLFFBQVEsQ0FBQyxNQUFNO1FBQ25ELElBQUk7VUFDQSxJQUFNd0osR0FBRyxHQUFHakcsWUFBWSxDQUFDQyxPQUFPLENBQUMsdUJBQXVCLENBQUM7VUFDekQsSUFBSSxDQUFDZ0csR0FBRyxFQUFFLE9BQU8sRUFBRTtVQUNuQixJQUFNbUQsR0FBRyxHQUFHL0MsSUFBSSxDQUFDQyxLQUFLLENBQUNMLEdBQUcsQ0FBQztVQUMzQixPQUFPc0YsS0FBSyxDQUFDNkMsT0FBTyxDQUFDaEYsR0FBRyxDQUFDLEdBQUc2RCxjQUFjLENBQUM3RCxHQUFHLENBQUMsR0FBRyxFQUFFO1FBQ3hELENBQUMsQ0FBQyxPQUFPL0ksQ0FBQyxFQUFFO1VBQUUsT0FBTyxFQUFFO1FBQUU7TUFDN0IsQ0FBQyxDQUFDO01BQUFnTyxnQkFBQSxHQUFBdFEsY0FBQSxDQUFBb1EsZ0JBQUE7TUFQS0csU0FBUyxHQUFBRCxnQkFBQTtNQUFFRSxZQUFZLEdBQUFGLGdCQUFBO0lBUTlCN1IsS0FBSyxDQUFDd0osU0FBUyxDQUFDLE1BQU07TUFDbEIsSUFBSXdJLFNBQVMsR0FBRyxLQUFLO01BQ3JCQyxpQkFBQSxDQUFDLGFBQVk7UUFDVCxJQUFJO1VBQ0EsSUFBTTFMLENBQUMsU0FBUzJMLEtBQUssQ0FBQyx1QkFBdUIsRUFBRTtZQUFFQyxXQUFXLEVBQUMsU0FBUztZQUFFQyxLQUFLLEVBQUM7VUFBVyxDQUFDLENBQUM7VUFDM0YsSUFBSSxDQUFDN0wsQ0FBQyxDQUFDOEwsRUFBRSxFQUFFO1VBQ1gsSUFBTUMsQ0FBQyxTQUFTL0wsQ0FBQyxDQUFDZ00sSUFBSSxDQUFDLENBQUM7VUFDeEIsSUFBTUMsS0FBSyxHQUFHL0IsY0FBYyxDQUFDMUIsS0FBSyxDQUFDNkMsT0FBTyxDQUFDVSxDQUFDLENBQUNFLEtBQUssQ0FBQyxHQUFHRixDQUFDLENBQUNFLEtBQUssR0FBRyxFQUFFLENBQUM7VUFDbkUsSUFBSVIsU0FBUyxFQUFFO1VBQ2YsSUFBSVEsS0FBSyxDQUFDN04sTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNsQm9OLFlBQVksQ0FBQ1MsS0FBSyxDQUFDO1lBQ25CO1lBQ0E7WUFDQSxJQUFJO2NBQUVoUCxZQUFZLENBQUMrQixPQUFPLENBQUMsdUJBQXVCLEVBQUVzRSxJQUFJLENBQUNpQixTQUFTLENBQUMwSCxLQUFLLENBQUMsQ0FBQztZQUFFLENBQUMsQ0FBQyxPQUFPM08sQ0FBQyxFQUFFLENBQUM7VUFDN0Y7UUFDSixDQUFDLENBQUMsT0FBT0EsQ0FBQyxFQUFFLENBQUU7TUFDbEIsQ0FBQyxFQUFFLENBQUM7TUFDSixPQUFPLE1BQU07UUFBRW1PLFNBQVMsR0FBRyxJQUFJO01BQUUsQ0FBQztJQUN0QyxDQUFDLEVBQUUsRUFBRSxDQUFDOztJQUVOO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQUNJLElBQUFTLGdCQUFBLEdBQWtDelMsS0FBSyxDQUFDQyxRQUFRLENBQUMsS0FBSyxDQUFDO01BQUF5UyxnQkFBQSxHQUFBblIsY0FBQSxDQUFBa1IsZ0JBQUE7TUFBaERFLFNBQVMsR0FBQUQsZ0JBQUE7TUFBRUUsWUFBWSxHQUFBRixnQkFBQTtJQUM5QixJQUFNRyxRQUFRLEdBQUc3UyxLQUFLLENBQUNvUixNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ25DcFIsS0FBSyxDQUFDd0osU0FBUyxDQUFDLE1BQU07TUFDbEIsSUFBSSxDQUFDbUosU0FBUyxFQUFFO01BQ2hCLElBQU1HLFVBQVUsR0FBSWpQLENBQUMsSUFBSztRQUN0QixJQUFJZ1AsUUFBUSxDQUFDRSxPQUFPLElBQUksQ0FBQ0YsUUFBUSxDQUFDRSxPQUFPLENBQUNDLFFBQVEsQ0FBQ25QLENBQUMsQ0FBQzBNLE1BQU0sQ0FBQyxFQUFFcUMsWUFBWSxDQUFDLEtBQUssQ0FBQztNQUNyRixDQUFDO01BQ0RLLFFBQVEsQ0FBQ0MsZ0JBQWdCLENBQUMsV0FBVyxFQUFFSixVQUFVLENBQUM7TUFDbEQsT0FBTyxNQUFNRyxRQUFRLENBQUNFLG1CQUFtQixDQUFDLFdBQVcsRUFBRUwsVUFBVSxDQUFDO0lBQ3RFLENBQUMsRUFBRSxDQUFDSCxTQUFTLENBQUMsQ0FBQzs7SUFFZjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0lBQ0ksSUFBTVMsZ0JBQWdCLEdBQUlDLE9BQU8sSUFBSztNQUNsQ25PLE1BQU0sQ0FBQ3FFLENBQUMsSUFBQXpFLGFBQUEsQ0FBQUEsYUFBQSxLQUFTeUUsQ0FBQztRQUFFeEcsUUFBUSxFQUFDc1E7TUFBTyxFQUFFLENBQUM7TUFDdkMsSUFBTUMsR0FBRyxHQUFHeEIsU0FBUyxDQUFDMUgsSUFBSSxDQUFDbkUsQ0FBQyxJQUFJQSxDQUFDLENBQUM2SyxJQUFJLEtBQUt1QyxPQUFPLENBQUM7TUFDbkQsSUFBSUMsR0FBRyxFQUFFO1FBQ0wsSUFBTXJRLEdBQUcsR0FBR29ELElBQUksQ0FBQzhKLEtBQUssQ0FBQ21ELEdBQUcsQ0FBQ3JRLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxLQUFLO1FBQy9DLElBQU1DLEdBQUcsR0FBR21ELElBQUksQ0FBQzhKLEtBQUssQ0FBQ21ELEdBQUcsQ0FBQ3BRLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxLQUFLO1FBQy9DZ0MsTUFBTSxDQUFDcUUsQ0FBQyxJQUFBekUsYUFBQSxDQUFBQSxhQUFBLEtBQVN5RSxDQUFDO1VBQUV4RyxRQUFRLEVBQUNzUSxPQUFPO1VBQUVwUSxHQUFHO1VBQUVDLEdBQUc7VUFBRUYsSUFBSSxFQUFDcVE7UUFBTyxFQUFFLENBQUM7UUFDL0QsSUFBSWhDLE1BQU0sQ0FBQzBCLE9BQU8sRUFBRTFCLE1BQU0sQ0FBQzBCLE9BQU8sQ0FBQ1EsT0FBTyxDQUFDLENBQUN0USxHQUFHLEVBQUVDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQztNQUM5RDtJQUNKLENBQUM7SUFDRCxJQUFNc1EsWUFBWSxHQUFJQyxHQUFHLElBQUs7TUFDMUJiLFlBQVksQ0FBQyxLQUFLLENBQUM7TUFDbkJRLGdCQUFnQixDQUFDSyxHQUFHLENBQUMzQyxJQUFJLENBQUM7SUFDOUIsQ0FBQzs7SUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0lBQ0ksSUFBTTRDLGNBQWMsR0FBSUQsR0FBRyxJQUFLO01BQzVCLElBQU1qVCxHQUFHLEdBQUdpVCxHQUFHLENBQUN4USxHQUFHLENBQUM0SixPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHNEcsR0FBRyxDQUFDdlEsR0FBRyxDQUFDMkosT0FBTyxDQUFDLENBQUMsQ0FBQztNQUN6RCxJQUFNOEcsSUFBSSxHQUFHN0IsU0FBUyxDQUFDck4sTUFBTSxDQUFDd0IsQ0FBQyxJQUFLQSxDQUFDLENBQUNoRCxHQUFHLENBQUM0SixPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHNUcsQ0FBQyxDQUFDL0MsR0FBRyxDQUFDMkosT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFNck0sR0FBRyxDQUFDO01BQ3ZGdVIsWUFBWSxDQUFDNEIsSUFBSSxDQUFDO01BQ2xCLElBQUk7UUFDQW5RLFlBQVksQ0FBQytCLE9BQU8sQ0FBQyx1QkFBdUIsRUFBRXNFLElBQUksQ0FBQ2lCLFNBQVMsQ0FBQzZJLElBQUksQ0FBQyxDQUFDO01BQ3ZFLENBQUMsQ0FBQyxPQUFPOVAsQ0FBQyxFQUFFLENBQUU7TUFDZCxJQUFJO1FBQ0F4RCxNQUFNLENBQUMySyxhQUFhLENBQUMsSUFBSUMsV0FBVyxDQUFDLDZCQUE2QixFQUM5RDtVQUFFQyxNQUFNLEVBQUU7WUFBRXNILEtBQUssRUFBRW1CO1VBQUs7UUFBRSxDQUFDLENBQUMsQ0FBQztNQUNyQyxDQUFDLENBQUMsT0FBTzlQLENBQUMsRUFBRSxDQUFDO01BQ2I7QUFDUjtNQUNRcU8sS0FBSyxDQUFDLHVCQUF1QixFQUFFO1FBQzNCMEIsTUFBTSxFQUFFLE1BQU07UUFDZHpCLFdBQVcsRUFBRSxTQUFTO1FBQ3RCMEIsT0FBTyxFQUFFO1VBQUUsY0FBYyxFQUFDO1FBQW1CLENBQUM7UUFDOUNDLElBQUksRUFBRWpLLElBQUksQ0FBQ2lCLFNBQVMsQ0FBQztVQUFFMEgsS0FBSyxFQUFFbUI7UUFBSyxDQUFDO01BQ3hDLENBQUMsQ0FBQyxDQUFDSSxLQUFLLENBQUMsTUFBTSxDQUFFLDhDQUErQyxDQUFDO01BQ2pFO0FBQ1I7TUFDUSxJQUFJLENBQUM5TyxHQUFHLENBQUNsQyxRQUFRLElBQUksRUFBRSxFQUFFZ08sSUFBSSxDQUFDLENBQUMsS0FBSzBDLEdBQUcsQ0FBQzNDLElBQUksRUFBRTtRQUMxQzVMLE1BQU0sQ0FBQ3FFLENBQUMsSUFBQXpFLGFBQUEsQ0FBQUEsYUFBQSxLQUFTeUUsQ0FBQztVQUFFeEcsUUFBUSxFQUFDO1FBQUUsRUFBRSxDQUFDO01BQ3RDO01BQ0EsSUFBSTRRLElBQUksQ0FBQ2hQLE1BQU0sS0FBSyxDQUFDLEVBQUVpTyxZQUFZLENBQUMsS0FBSyxDQUFDO0lBQzlDLENBQUM7O0lBRUQ7QUFDSjtBQUNBO0FBQ0E7QUFDQTtJQUNJLElBQU1vQixjQUFjLEdBQUdBLENBQUNDLE9BQU8sRUFBRVosT0FBTyxLQUFLO01BQ3pDLElBQU03UyxHQUFHLEdBQUd5VCxPQUFPLENBQUNoUixHQUFHLENBQUM0SixPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHb0gsT0FBTyxDQUFDL1EsR0FBRyxDQUFDMkosT0FBTyxDQUFDLENBQUMsQ0FBQztNQUNqRWtGLFlBQVksQ0FBQ21DLElBQUksSUFBSUEsSUFBSSxDQUFDbE8sR0FBRyxDQUFDQyxDQUFDLElBQzFCQSxDQUFDLENBQUNoRCxHQUFHLENBQUM0SixPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHNUcsQ0FBQyxDQUFDL0MsR0FBRyxDQUFDMkosT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFNck0sR0FBRyxHQUFBc0UsYUFBQSxDQUFBQSxhQUFBLEtBQ3hDbUIsQ0FBQztRQUFFNkssSUFBSSxFQUFFdUM7TUFBTyxLQUNyQnBOLENBQ1YsQ0FBQyxDQUFDO01BQ0Y7QUFDUjtNQUNRLElBQU1rTyxhQUFhLEdBQUcsQ0FBQ2xQLEdBQUcsQ0FBQ2xDLFFBQVEsSUFBSSxFQUFFLEVBQUVnTyxJQUFJLENBQUMsQ0FBQyxLQUFLa0QsT0FBTyxDQUFDbkQsSUFBSSxJQUMzRHpLLElBQUksQ0FBQytOLEdBQUcsQ0FBQ25QLEdBQUcsQ0FBQ2hDLEdBQUcsR0FBR2dSLE9BQU8sQ0FBQ2hSLEdBQUcsQ0FBQyxHQUFHLElBQUksSUFDdENvRCxJQUFJLENBQUMrTixHQUFHLENBQUNuUCxHQUFHLENBQUMvQixHQUFHLEdBQUcrUSxPQUFPLENBQUMvUSxHQUFHLENBQUMsR0FBRyxJQUFJO01BQzdDLElBQUlpUixhQUFhLEVBQUU7UUFDZmpQLE1BQU0sQ0FBQ3FFLENBQUMsSUFBQXpFLGFBQUEsQ0FBQUEsYUFBQSxLQUFTeUUsQ0FBQztVQUFFeEcsUUFBUSxFQUFDc1EsT0FBTztVQUFFclEsSUFBSSxFQUFDcVE7UUFBTyxFQUFFLENBQUM7TUFDekQ7SUFDSixDQUFDOztJQUVEO0lBQ0EsSUFBQWdCLGdCQUFBLEdBQXNDclUsS0FBSyxDQUFDQyxRQUFRLENBQUMsRUFBRSxDQUFDO01BQUFxVSxnQkFBQSxHQUFBL1MsY0FBQSxDQUFBOFMsZ0JBQUE7TUFBakRFLE9BQU8sR0FBQUQsZ0JBQUE7TUFBRUUsVUFBVSxHQUFBRixnQkFBQTtJQUMxQixJQUFBRyxnQkFBQSxHQUFzQ3pVLEtBQUssQ0FBQ0MsUUFBUSxDQUFDLEVBQUUsQ0FBQztNQUFBeVUsZ0JBQUEsR0FBQW5ULGNBQUEsQ0FBQWtULGdCQUFBO01BQWpERSxVQUFVLEdBQUFELGdCQUFBO01BQUVFLGFBQWEsR0FBQUYsZ0JBQUE7SUFDaEMsSUFBQUcsZ0JBQUEsR0FBc0M3VSxLQUFLLENBQUNDLFFBQVEsQ0FBQyxLQUFLLENBQUM7TUFBQTZVLGlCQUFBLEdBQUF2VCxjQUFBLENBQUFzVCxnQkFBQTtNQUFwREUsVUFBVSxHQUFBRCxpQkFBQTtNQUFFRSxhQUFhLEdBQUFGLGlCQUFBO0lBQ2hDLElBQUFHLGlCQUFBLEdBQXNDalYsS0FBSyxDQUFDQyxRQUFRLENBQUMsS0FBSyxDQUFDO01BQUFpVixpQkFBQSxHQUFBM1QsY0FBQSxDQUFBMFQsaUJBQUE7TUFBcERFLFVBQVUsR0FBQUQsaUJBQUE7TUFBRUUsYUFBYSxHQUFBRixpQkFBQTtJQUNoQyxJQUFNRyxpQkFBaUIsR0FBZXJWLEtBQUssQ0FBQ29SLE1BQU0sQ0FBQyxJQUFJLENBQUM7O0lBRXhEO0lBQ0EsSUFBTWtFLFNBQVM7TUFBQSxJQUFBQyxLQUFBLEdBQUF0RCxpQkFBQSxDQUFHLFdBQU91RCxDQUFDLEVBQUs7UUFDM0IsSUFBSSxDQUFDQSxDQUFDLElBQUlBLENBQUMsQ0FBQ3pFLElBQUksQ0FBQyxDQUFDLENBQUNwTSxNQUFNLEdBQUcsQ0FBQyxFQUFFO1VBQUVpUSxhQUFhLENBQUMsRUFBRSxDQUFDO1VBQUU7UUFBUTtRQUM1RCxJQUFJO1VBQ0FJLGFBQWEsQ0FBQyxJQUFJLENBQUM7VUFDbkIsSUFBTVMsR0FBRyx1RUFBQTNOLE1BQUEsQ0FBdUU0TixrQkFBa0IsQ0FBQ0YsQ0FBQyxDQUFDLENBQUU7VUFDdkcsSUFBTWpQLENBQUMsU0FBUzJMLEtBQUssQ0FBQ3VELEdBQUcsRUFBRTtZQUFFNUIsT0FBTyxFQUFDO2NBQUUsUUFBUSxFQUFDO1lBQW1CO1VBQUUsQ0FBQyxDQUFDO1VBQ3ZFLElBQU12QixDQUFDLFNBQVMvTCxDQUFDLENBQUNnTSxJQUFJLENBQUMsQ0FBQztVQUN4QnFDLGFBQWEsQ0FBQzdGLEtBQUssQ0FBQzZDLE9BQU8sQ0FBQ1UsQ0FBQyxDQUFDLEdBQUdBLENBQUMsR0FBRyxFQUFFLENBQUM7VUFDeEM4QyxhQUFhLENBQUMsSUFBSSxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxPQUFPdlIsQ0FBQyxFQUFFO1VBQUUrUSxhQUFhLENBQUMsRUFBRSxDQUFDO1FBQUUsQ0FBQyxTQUMxQjtVQUFFSSxhQUFhLENBQUMsS0FBSyxDQUFDO1FBQUU7TUFDcEMsQ0FBQztNQUFBLGdCQVhLTSxTQUFTQSxDQUFBSyxFQUFBO1FBQUEsT0FBQUosS0FBQSxDQUFBSyxLQUFBLE9BQUFDLFNBQUE7TUFBQTtJQUFBLEdBV2Q7O0lBRUQ7SUFDQTdWLEtBQUssQ0FBQ3dKLFNBQVMsQ0FBQyxNQUFNO01BQ2xCLElBQUk2TCxpQkFBaUIsQ0FBQ3RDLE9BQU8sRUFBRStDLFlBQVksQ0FBQ1QsaUJBQWlCLENBQUN0QyxPQUFPLENBQUM7TUFDdEVzQyxpQkFBaUIsQ0FBQ3RDLE9BQU8sR0FBR2dELFVBQVUsQ0FBQyxNQUFNVCxTQUFTLENBQUNmLE9BQU8sQ0FBQyxFQUFFLEdBQUcsQ0FBQztNQUNyRSxPQUFPLE1BQU1jLGlCQUFpQixDQUFDdEMsT0FBTyxJQUFJK0MsWUFBWSxDQUFDVCxpQkFBaUIsQ0FBQ3RDLE9BQU8sQ0FBQztJQUNyRixDQUFDLEVBQUUsQ0FBQ3dCLE9BQU8sQ0FBQyxDQUFDO0lBRWIsSUFBTXlCLGFBQWEsR0FBSTFDLEdBQUcsSUFBSztNQUMzQixJQUFNclEsR0FBRyxHQUFHb0QsSUFBSSxDQUFDOEosS0FBSyxDQUFDLENBQUNtRCxHQUFHLENBQUNyUSxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsS0FBSztNQUNoRCxJQUFNQyxHQUFHLEdBQUdtRCxJQUFJLENBQUM4SixLQUFLLENBQUMsQ0FBQ21ELEdBQUcsQ0FBQ3BRLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxLQUFLO01BQ2hEZ0MsTUFBTSxDQUFDcUUsQ0FBQyxJQUFBekUsYUFBQSxDQUFBQSxhQUFBLEtBQVN5RSxDQUFDO1FBQUV0RyxHQUFHO1FBQUVDLEdBQUc7UUFBRUYsSUFBSSxFQUFDc1EsR0FBRyxDQUFDMkM7TUFBWSxFQUFFLENBQUM7TUFDdEQsSUFBSTVFLE1BQU0sQ0FBQzBCLE9BQU8sRUFBRTFCLE1BQU0sQ0FBQzBCLE9BQU8sQ0FBQ1EsT0FBTyxDQUFDLENBQUN0USxHQUFHLEVBQUVDLEdBQUcsQ0FBQyxFQUFFb1EsR0FBRyxDQUFDbEQsSUFBSSxLQUFLLE1BQU0sR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO01BQ3JGZ0YsYUFBYSxDQUFDLEtBQUssQ0FBQztNQUNwQlosVUFBVSxDQUFDLEVBQUUsQ0FBQztJQUNsQixDQUFDOztJQUVEO0lBQ0EsSUFBTTBCLGNBQWM7TUFBQSxJQUFBQyxLQUFBLEdBQUFsRSxpQkFBQSxDQUFHLFdBQU9oUCxHQUFHLEVBQUVDLEdBQUcsRUFBSztRQUN2QyxJQUFJO1VBQ0F3TyxVQUFVLENBQUMsSUFBSSxDQUFDO1VBQ2hCLElBQU0rRCxHQUFHLGtFQUFBM04sTUFBQSxDQUFrRTdFLEdBQUcsV0FBQTZFLE1BQUEsQ0FBUTVFLEdBQUcsYUFBVTtVQUNuRyxJQUFNcUQsQ0FBQyxTQUFTMkwsS0FBSyxDQUFDdUQsR0FBRyxFQUFFO1lBQUU1QixPQUFPLEVBQUU7Y0FBRSxRQUFRLEVBQUM7WUFBbUI7VUFBRSxDQUFDLENBQUM7VUFDeEUsSUFBTXZCLENBQUMsU0FBUy9MLENBQUMsQ0FBQ2dNLElBQUksQ0FBQyxDQUFDO1VBQ3hCLElBQU0vSyxDQUFDLEdBQUc4SyxDQUFDLENBQUM4RCxPQUFPLElBQUksQ0FBQyxDQUFDO1VBQ3pCLElBQU1wVCxJQUFJLEdBQUd3RSxDQUFDLENBQUN4RSxJQUFJLElBQUl3RSxDQUFDLENBQUM2TyxJQUFJLElBQUk3TyxDQUFDLENBQUM4TyxPQUFPLElBQUk5TyxDQUFDLENBQUMrTyxNQUFNLElBQUkvTyxDQUFDLENBQUNnUCxNQUFNLElBQUksRUFBRTtVQUN4RSxJQUFNQyxNQUFNLEdBQUdqUCxDQUFDLENBQUNrUCxLQUFLLElBQUlsUCxDQUFDLENBQUNpUCxNQUFNLElBQUksRUFBRTtVQUN4QyxJQUFNRSxPQUFPLEdBQUduUCxDQUFDLENBQUNtUCxPQUFPLElBQUksRUFBRTtVQUMvQixJQUFNbEwsS0FBSyxHQUFHLENBQUN6SSxJQUFJLEVBQUV5VCxNQUFNLEVBQUVFLE9BQU8sQ0FBQyxDQUFDbFMsTUFBTSxDQUFDQyxPQUFPLENBQUMsQ0FBQ29JLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSXdGLENBQUMsQ0FBQzJELFlBQVksSUFBSSxFQUFFO1VBQ3hGLElBQUl4SyxLQUFLLEVBQUV2RyxNQUFNLENBQUNxRSxDQUFDLElBQUF6RSxhQUFBLENBQUFBLGFBQUEsS0FBU3lFLENBQUM7WUFBRXZHLElBQUksRUFBQ3lJO1VBQUssRUFBRSxDQUFDO1FBQ2hELENBQUMsQ0FBQyxPQUFPNUgsQ0FBQyxFQUFFLENBQUUsaURBQWtELFNBQ3hEO1VBQUU2TixVQUFVLENBQUMsS0FBSyxDQUFDO1FBQUU7TUFDakMsQ0FBQztNQUFBLGdCQWRLd0UsY0FBY0EsQ0FBQVUsR0FBQSxFQUFBQyxHQUFBO1FBQUEsT0FBQVYsS0FBQSxDQUFBUCxLQUFBLE9BQUFDLFNBQUE7TUFBQTtJQUFBLEdBY25COztJQUVEO0lBQ0E3VixLQUFLLENBQUN3SixTQUFTLENBQUMsTUFBTTtNQUNsQixJQUFJLENBQUMySCxTQUFTLENBQUM0QixPQUFPLElBQUkxQixNQUFNLENBQUMwQixPQUFPLEVBQUU7TUFDMUMsSUFBTS9NLEdBQUcsR0FBRzhRLENBQUMsQ0FBQzlRLEdBQUcsQ0FBQ21MLFNBQVMsQ0FBQzRCLE9BQU8sRUFBRTtRQUFFZ0UsV0FBVyxFQUFFLElBQUk7UUFBRUMsa0JBQWtCLEVBQUU7TUFBSyxDQUFDLENBQUMsQ0FDdkV6RCxPQUFPLENBQUMsQ0FBQ3RPLEdBQUcsQ0FBQ2hDLEdBQUcsRUFBRWdDLEdBQUcsQ0FBQy9CLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztNQUM1QzRULENBQUMsQ0FBQ0csU0FBUyxDQUFDLG9EQUFvRCxFQUFFO1FBQzlEQyxPQUFPLEVBQUUsRUFBRTtRQUNYQyxXQUFXLEVBQUU7TUFDakIsQ0FBQyxDQUFDLENBQUNDLEtBQUssQ0FBQ3BSLEdBQUcsQ0FBQztNQUViLElBQU1xUixNQUFNLEdBQUdQLENBQUMsQ0FBQ08sTUFBTSxDQUFDLENBQUNwUyxHQUFHLENBQUNoQyxHQUFHLEVBQUVnQyxHQUFHLENBQUMvQixHQUFHLENBQUMsRUFBRTtRQUFFb1UsU0FBUyxFQUFFO01BQUssQ0FBQyxDQUFDLENBQUNGLEtBQUssQ0FBQ3BSLEdBQUcsQ0FBQztNQUMzRXFSLE1BQU0sQ0FBQ0UsV0FBVyxDQUFDLHNDQUFzQyxFQUFFO1FBQUVDLFNBQVMsRUFBRTtNQUFNLENBQUMsQ0FBQztNQUVoRixJQUFNQyxXQUFXLEdBQUdBLENBQUN4VSxHQUFHLEVBQUVDLEdBQUcsS0FBSztRQUM5QixJQUFNcUQsQ0FBQyxHQUFJbVIsQ0FBQyxJQUFLclIsSUFBSSxDQUFDOEosS0FBSyxDQUFDdUgsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLEtBQUs7UUFDOUN4UyxNQUFNLENBQUNxRSxDQUFDLElBQUF6RSxhQUFBLENBQUFBLGFBQUEsS0FBU3lFLENBQUM7VUFBRXRHLEdBQUcsRUFBQ3NELENBQUMsQ0FBQ3RELEdBQUcsQ0FBQztVQUFFQyxHQUFHLEVBQUNxRCxDQUFDLENBQUNyRCxHQUFHO1FBQUMsRUFBRSxDQUFDO1FBQzdDZ1QsY0FBYyxDQUFDM1AsQ0FBQyxDQUFDdEQsR0FBRyxDQUFDLEVBQUVzRCxDQUFDLENBQUNyRCxHQUFHLENBQUMsQ0FBQztNQUNsQyxDQUFDO01BQ0RtVSxNQUFNLENBQUNNLEVBQUUsQ0FBQyxTQUFTLEVBQUUsTUFBTTtRQUN2QixJQUFNQyxFQUFFLEdBQUdQLE1BQU0sQ0FBQ1EsU0FBUyxDQUFDLENBQUM7UUFDN0JKLFdBQVcsQ0FBQ0csRUFBRSxDQUFDM1UsR0FBRyxFQUFFMlUsRUFBRSxDQUFDRSxHQUFHLENBQUM7TUFDL0IsQ0FBQyxDQUFDO01BQ0Y5UixHQUFHLENBQUMyUixFQUFFLENBQUMsT0FBTyxFQUFHOVQsQ0FBQyxJQUFLO1FBQ25Cd1QsTUFBTSxDQUFDVSxTQUFTLENBQUNsVSxDQUFDLENBQUNtVSxNQUFNLENBQUM7UUFDMUJQLFdBQVcsQ0FBQzVULENBQUMsQ0FBQ21VLE1BQU0sQ0FBQy9VLEdBQUcsRUFBRVksQ0FBQyxDQUFDbVUsTUFBTSxDQUFDRixHQUFHLENBQUM7TUFDM0MsQ0FBQyxDQUFDO01BRUZ6RyxNQUFNLENBQUMwQixPQUFPLEdBQUcvTSxHQUFHO01BQ3BCc0wsU0FBUyxDQUFDeUIsT0FBTyxHQUFHc0UsTUFBTTs7TUFFMUI7QUFDUjtNQUNRdEIsVUFBVSxDQUFDLE1BQU0vUCxHQUFHLENBQUNpUyxjQUFjLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQztNQUMzQyxPQUFPLE1BQU07UUFBRWpTLEdBQUcsQ0FBQ2tTLE1BQU0sQ0FBQyxDQUFDO1FBQUU3RyxNQUFNLENBQUMwQixPQUFPLEdBQUcsSUFBSTtRQUFFekIsU0FBUyxDQUFDeUIsT0FBTyxHQUFHLElBQUk7TUFBRSxDQUFDO0lBQ25GLENBQUMsRUFBRSxFQUFFLENBQUM7O0lBRU47SUFDQS9TLEtBQUssQ0FBQ3dKLFNBQVMsQ0FBQyxNQUFNO01BQ2xCLElBQUk2SCxNQUFNLENBQUMwQixPQUFPLElBQUl6QixTQUFTLENBQUN5QixPQUFPLEVBQUU7UUFDckN6QixTQUFTLENBQUN5QixPQUFPLENBQUNnRixTQUFTLENBQUMsQ0FBQzlTLEdBQUcsQ0FBQ2hDLEdBQUcsRUFBRWdDLEdBQUcsQ0FBQy9CLEdBQUcsQ0FBQyxDQUFDO1FBQy9DbU8sTUFBTSxDQUFDMEIsT0FBTyxDQUFDb0YsS0FBSyxDQUFDLENBQUNsVCxHQUFHLENBQUNoQyxHQUFHLEVBQUVnQyxHQUFHLENBQUMvQixHQUFHLENBQUMsQ0FBQztNQUM1QztJQUNKLENBQUMsRUFBRSxDQUFDK0IsR0FBRyxDQUFDaEMsR0FBRyxFQUFFZ0MsR0FBRyxDQUFDL0IsR0FBRyxDQUFDLENBQUM7O0lBRXRCO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7SUFDSSxJQUFBa1YsaUJBQUEsR0FBZ0NwWSxLQUFLLENBQUNDLFFBQVEsQ0FBQyxJQUFJLENBQUM7TUFBQW9ZLGlCQUFBLEdBQUE5VyxjQUFBLENBQUE2VyxpQkFBQTtNQUE3Q0UsUUFBUSxHQUFBRCxpQkFBQTtNQUFFRSxXQUFXLEdBQUFGLGlCQUFBLElBQXlCLENBQUc7SUFDeEQsSUFBTUcsYUFBYSxHQUFHQSxDQUFBLEtBQU07TUFDeEJELFdBQVcsQ0FBQyxNQUFNLENBQUM7TUFDbkI7TUFDQSxJQUFJLENBQUNFLFNBQVMsQ0FBQ0MsV0FBVyxFQUFFO1FBQ3hCSCxXQUFXLENBQUM7VUFBRUksR0FBRyxFQUFDO1FBQThELENBQUMsQ0FBQztRQUNsRjtNQUNKO01BQ0FGLFNBQVMsQ0FBQ0MsV0FBVyxDQUFDRSxrQkFBa0IsQ0FDbkNDLEdBQUcsSUFBSztRQUNMLElBQU01VixHQUFHLEdBQUdvRCxJQUFJLENBQUM4SixLQUFLLENBQUMwSSxHQUFHLENBQUNDLE1BQU0sQ0FBQ0MsUUFBUSxHQUFJLEtBQUssQ0FBQyxHQUFHLEtBQUs7UUFDNUQsSUFBTTdWLEdBQUcsR0FBR21ELElBQUksQ0FBQzhKLEtBQUssQ0FBQzBJLEdBQUcsQ0FBQ0MsTUFBTSxDQUFDRSxTQUFTLEdBQUcsS0FBSyxDQUFDLEdBQUcsS0FBSztRQUM1RDlULE1BQU0sQ0FBQ3FFLENBQUMsSUFBQXpFLGFBQUEsQ0FBQUEsYUFBQSxLQUFTeUUsQ0FBQztVQUFFdEcsR0FBRztVQUFFQztRQUFHLEVBQUUsQ0FBQztRQUMvQixJQUFJbU8sTUFBTSxDQUFDMEIsT0FBTyxFQUFFMUIsTUFBTSxDQUFDMEIsT0FBTyxDQUFDUSxPQUFPLENBQUMsQ0FBQ3RRLEdBQUcsRUFBRUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQzFEZ1QsY0FBYyxDQUFDalQsR0FBRyxFQUFFQyxHQUFHLENBQUM7UUFDeEJxVixXQUFXLENBQUMsSUFBSSxDQUFDO01BQ3JCLENBQUMsRUFDQUksR0FBRyxJQUFLO1FBQ0w7UUFDQSxJQUFNTSxHQUFHLEdBQUdOLEdBQUcsSUFBSUEsR0FBRyxDQUFDTyxJQUFJLEtBQUssQ0FBQyxHQUMzQix5RkFBeUYsR0FDekZQLEdBQUcsSUFBSUEsR0FBRyxDQUFDTyxJQUFJLEtBQUssQ0FBQyxHQUNqQix5RUFBeUUsR0FDekVQLEdBQUcsSUFBSUEsR0FBRyxDQUFDTyxJQUFJLEtBQUssQ0FBQyxHQUNqQixzRUFBc0UsR0FDckVQLEdBQUcsSUFBSUEsR0FBRyxDQUFDUSxPQUFPLElBQUssaUNBQWlDO1FBQ3ZFWixXQUFXLENBQUM7VUFBRUksR0FBRyxFQUFFTTtRQUFJLENBQUMsQ0FBQztNQUM3QixDQUFDLEVBQ0Q7UUFBRUcsa0JBQWtCLEVBQUMsSUFBSTtRQUFFQyxPQUFPLEVBQUMsS0FBSztRQUFFQyxVQUFVLEVBQUM7TUFBRSxDQUMzRCxDQUFDO0lBQ0wsQ0FBQzs7SUFFRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0lBQ0ksSUFBQUMsaUJBQUEsR0FBOEJ2WixLQUFLLENBQUNDLFFBQVEsQ0FBQyxJQUFJLENBQUM7TUFBQXVaLGlCQUFBLEdBQUFqWSxjQUFBLENBQUFnWSxpQkFBQTtNQUEzQ0UsT0FBTyxHQUFBRCxpQkFBQTtNQUFFRSxVQUFVLEdBQUFGLGlCQUFBO0lBQzFCLElBQU0zTyxjQUFjO01BQUEsSUFBQThPLEtBQUEsR0FBQTFILGlCQUFBLENBQUcsYUFBWTtRQUMvQixJQUFNd0IsR0FBRyxHQUFHO1VBQUV4USxHQUFHLEVBQUVnQyxHQUFHLENBQUNoQyxHQUFHO1VBQUVDLEdBQUcsRUFBRStCLEdBQUcsQ0FBQy9CLEdBQUc7VUFBRTROLElBQUksRUFBRTdMLEdBQUcsQ0FBQ2xDLFFBQVEsSUFBSWtDLEdBQUcsQ0FBQ2pDO1FBQUssQ0FBQzs7UUFFMUU7UUFDQTtRQUNBO1FBQ0EsSUFBTXhDLEdBQUcsR0FBR2lULEdBQUcsQ0FBQ3hRLEdBQUcsQ0FBQzRKLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUc0RyxHQUFHLENBQUN2USxHQUFHLENBQUMySixPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3pELElBQU0rTSxPQUFPLEdBQUc5SCxTQUFTLENBQUNyTixNQUFNLENBQUNvTSxDQUFDLElBQUtBLENBQUMsQ0FBQzVOLEdBQUcsQ0FBQzRKLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUdnRSxDQUFDLENBQUMzTixHQUFHLENBQUMySixPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQU1yTSxHQUFHLENBQUM7UUFDMUYsSUFBTXFaLFNBQVMsR0FBRyxDQUFDcEcsR0FBRyxFQUFFLEdBQUdtRyxPQUFPLENBQUMsQ0FBQ0UsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7UUFFaEQsSUFBSTtVQUNBdFcsWUFBWSxDQUFDK0IsT0FBTyxDQUFDLGlCQUFpQixFQUFFc0UsSUFBSSxDQUFDaUIsU0FBUyxDQUFDMkksR0FBRyxDQUFDLENBQUM7VUFDNURqUSxZQUFZLENBQUMrQixPQUFPLENBQUMsdUJBQXVCLEVBQUVzRSxJQUFJLENBQUNpQixTQUFTLENBQUMrTyxTQUFTLENBQUMsQ0FBQztVQUN4RTtVQUNBclcsWUFBWSxDQUFDK0IsT0FBTyxDQUFDLHVCQUF1QixFQUFFc0UsSUFBSSxDQUFDaUIsU0FBUyxDQUFDMkksR0FBRyxDQUFDLENBQUM7UUFDdEUsQ0FBQyxDQUFDLE9BQU81UCxDQUFDLEVBQUUsQ0FBRTtRQUVkLElBQUlrVyxTQUFTLEdBQUcsS0FBSztVQUFFQyxPQUFPLEdBQUcsRUFBRTtRQUNuQyxJQUFJO1VBQ0EsSUFBTXpULENBQUMsU0FBUzJMLEtBQUssQ0FBQyx1QkFBdUIsRUFBRTtZQUMzQzBCLE1BQU0sRUFBRSxNQUFNO1lBQ2R6QixXQUFXLEVBQUUsU0FBUztZQUN0QjBCLE9BQU8sRUFBRTtjQUFFLGNBQWMsRUFBQztZQUFtQixDQUFDO1lBQzlDQyxJQUFJLEVBQUVqSyxJQUFJLENBQUNpQixTQUFTLENBQUM7Y0FBRW1QLE1BQU0sRUFBRXhHLEdBQUc7Y0FBRXlHLE9BQU8sRUFBRXpHLEdBQUc7Y0FBRWpCLEtBQUssRUFBRXFIO1lBQVUsQ0FBQztVQUN4RSxDQUFDLENBQUM7VUFDRixJQUFNdkgsQ0FBQyxTQUFTL0wsQ0FBQyxDQUFDZ00sSUFBSSxDQUFDLENBQUM7VUFDeEJsUyxNQUFNLENBQUM4Wix3QkFBd0IsR0FBRzdILENBQUM7VUFDbkN5SCxTQUFTLEdBQUcsQ0FBQyxDQUFDekgsQ0FBQyxDQUFDeUgsU0FBUztVQUN6QkMsT0FBTyxHQUFLMUgsQ0FBQyxDQUFDMEgsT0FBTyxJQUFJLEVBQUU7VUFDM0I1TyxPQUFPLENBQUNDLElBQUksQ0FBQyx1Q0FBdUMsRUFBRWlILENBQUMsQ0FBQztRQUM1RCxDQUFDLENBQUMsT0FBT3pPLENBQUMsRUFBRTtVQUNSbVcsT0FBTyxHQUFHLHFDQUFxQztVQUMvQzVPLE9BQU8sQ0FBQ0UsSUFBSSxDQUFDLDBDQUEwQyxFQUFFekgsQ0FBQyxDQUFDO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLElBQUk7VUFDQXhELE1BQU0sQ0FBQzJLLGFBQWEsQ0FBQyxJQUFJQyxXQUFXLENBQUMsNkJBQTZCLEVBQzlEO1lBQUVDLE1BQU0sRUFBRTtjQUFFK08sTUFBTSxFQUFFeEcsR0FBRztjQUFFakIsS0FBSyxFQUFFcUg7WUFBVTtVQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxPQUFPaFcsQ0FBQyxFQUFFLENBQUU7UUFFZCxJQUFJa1csU0FBUyxFQUFFO1VBQ1gzVSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQVc7UUFDeEIsQ0FBQyxNQUFNO1VBQ0g7QUFDWjtBQUNBO0FBQ0E7VUFDWXNVLFVBQVUsQ0FBQ00sT0FBTyxJQUFJLG1EQUFtRCxDQUFDO1VBQzFFakUsVUFBVSxDQUFDLE1BQU07WUFBRTJELFVBQVUsQ0FBQyxJQUFJLENBQUM7WUFBRXRVLE1BQU0sQ0FBQyxDQUFDO1VBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQztRQUMzRDtNQUNKLENBQUM7TUFBQSxnQkF4REt5RixjQUFjQSxDQUFBO1FBQUEsT0FBQThPLEtBQUEsQ0FBQS9ELEtBQUEsT0FBQUMsU0FBQTtNQUFBO0lBQUEsR0F3RG5CO0lBR0Qsb0JBQ0k3VixLQUFBLENBQUErRSxhQUFBLENBQUNxVixVQUFVO01BQUNDLEtBQUssRUFBRWxhLENBQUMsQ0FBQyxxQkFBcUIsQ0FBRTtNQUFDbWEsUUFBUSxFQUFFbmEsQ0FBQyxDQUFDLGlCQUFpQixDQUFFO01BQUNVLE1BQU0sRUFBQyxPQUFPO01BQUNvSCxPQUFPLEVBQUVBLE9BQVE7TUFBQzdDLE1BQU0sRUFBRXlGLGNBQWU7TUFBQzlCLElBQUksRUFBQztJQUFLLEdBQzNJMFEsT0FBTyxpQkFDSnpaLEtBQUEsQ0FBQStFLGFBQUE7TUFBSyxlQUFZLGNBQWM7TUFDMUJNLFNBQVMsRUFBQztJQUF5RyxHQUFDLFVBQ2xILEVBQUNvVSxPQUNILENBQ1IsZUFDRHpaLEtBQUEsQ0FBQStFLGFBQUE7TUFBS00sU0FBUyxFQUFDLHdEQUF3RDtNQUFDRyxLQUFLLEVBQUU7UUFBQytVLFNBQVMsRUFBQztNQUFNO0lBQUUsZ0JBRTlGdmEsS0FBQSxDQUFBK0UsYUFBQTtNQUFLTSxTQUFTLEVBQUMsVUFBVTtNQUFDRyxLQUFLLEVBQUU7UUFBQytVLFNBQVMsRUFBQztNQUFNO0lBQUUsZ0JBQ2hEdmEsS0FBQSxDQUFBK0UsYUFBQTtNQUFLeVYsR0FBRyxFQUFFckosU0FBVTtNQUNmM0wsS0FBSyxFQUFFO1FBQUU2QixNQUFNLEVBQUMsTUFBTTtRQUFFa1QsU0FBUyxFQUFDLE1BQU07UUFBRTlVLEtBQUssRUFBQyxNQUFNO1FBQUVxSixZQUFZLEVBQUMsTUFBTTtRQUNsRTJMLFFBQVEsRUFBQyxRQUFRO1FBQUVuUyxNQUFNLEVBQUMsbUJBQW1CO1FBQUV2QyxVQUFVLEVBQUM7TUFBVTtJQUFFLENBQUMsQ0FBQyxlQUd0Ri9GLEtBQUEsQ0FBQStFLGFBQUE7TUFBS00sU0FBUyxFQUFDLGtEQUFrRDtNQUFDRyxLQUFLLEVBQUU7UUFBQ0MsS0FBSyxFQUFDO01BQWdDO0lBQUUsZ0JBQzlHekYsS0FBQSxDQUFBK0UsYUFBQTtNQUFLTSxTQUFTLEVBQUM7SUFBVSxnQkFDckJyRixLQUFBLENBQUErRSxhQUFBO01BQU9xTCxJQUFJLEVBQUMsTUFBTTtNQUNYQyxLQUFLLEVBQUVrRSxPQUFRO01BQ2ZqRSxRQUFRLEVBQUd6TSxDQUFDLElBQUsyUSxVQUFVLENBQUMzUSxDQUFDLENBQUMwTSxNQUFNLENBQUNGLEtBQUssQ0FBRTtNQUM1Q3FLLE9BQU8sRUFBRUEsQ0FBQSxLQUFNL0YsVUFBVSxDQUFDaFEsTUFBTSxJQUFJeVEsYUFBYSxDQUFDLElBQUksQ0FBRTtNQUN4RHVGLFdBQVcsRUFBQyxnRUFBaUQ7TUFDN0R0VixTQUFTLEVBQUMsNklBQTZJO01BQ3ZKRyxLQUFLLEVBQUU7UUFBQ29WLE9BQU8sRUFBQztNQUFNO0lBQUUsQ0FBQyxDQUFDLEVBQ2hDN0YsVUFBVSxpQkFDUC9VLEtBQUEsQ0FBQStFLGFBQUE7TUFBTU0sU0FBUyxFQUFDO0lBQWtFLEdBQUMsUUFBTyxDQUM3RixFQUNBOFAsVUFBVSxJQUFJUixVQUFVLENBQUNoUSxNQUFNLEdBQUcsQ0FBQyxpQkFDaEMzRSxLQUFBLENBQUErRSxhQUFBO01BQUtNLFNBQVMsRUFBQztJQUE0SixHQUN0S3NQLFVBQVUsQ0FBQzNPLEdBQUcsQ0FBQyxDQUFDNlUsQ0FBQyxFQUFFM1UsQ0FBQyxrQkFDakJsRyxLQUFBLENBQUErRSxhQUFBO01BQVF2RSxHQUFHLEVBQUVxYSxDQUFDLENBQUNDLFFBQVEsSUFBSTVVLENBQUU7TUFDckJaLE9BQU8sRUFBRUEsQ0FBQSxLQUFNMFEsYUFBYSxDQUFDNkUsQ0FBQyxDQUFFO01BQ2hDeFYsU0FBUyxFQUFDO0lBQTZHLGdCQUMzSHJGLEtBQUEsQ0FBQStFLGFBQUE7TUFBS00sU0FBUyxFQUFDO0lBQWlDLEdBQUV3VixDQUFDLENBQUM1RSxZQUFrQixDQUFDLGVBQ3ZFalcsS0FBQSxDQUFBK0UsYUFBQTtNQUFLTSxTQUFTLEVBQUM7SUFBNkQsR0FDdkV3VixDQUFDLENBQUN6SyxJQUFJLElBQUl5SyxDQUFDLENBQUNFLEtBQUssRUFBQyxRQUFHLEVBQUMsQ0FBQyxDQUFDRixDQUFDLENBQUM1WCxHQUFHLEVBQUU0SixPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBRSxFQUFDLENBQUMsQ0FBQ2dPLENBQUMsQ0FBQzNYLEdBQUcsRUFBRTJKLE9BQU8sQ0FBQyxDQUFDLENBQy9ELENBQ0QsQ0FDWCxDQUNBLENBQ1IsRUFDQXNJLFVBQVUsSUFBSVIsVUFBVSxDQUFDaFEsTUFBTSxLQUFLLENBQUMsSUFBSTRQLE9BQU8sQ0FBQzVQLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQ29RLFVBQVUsaUJBQ3hFL1UsS0FBQSxDQUFBK0UsYUFBQTtNQUFLTSxTQUFTLEVBQUM7SUFBMkgsR0FBQyxtQkFDdkgsRUFBQ2tQLE9BQU8sRUFBQyxnQ0FDeEIsQ0FFUixDQUNKLENBQ0osQ0FBQyxlQUdOdlUsS0FBQSxDQUFBK0UsYUFBQTtNQUFLTSxTQUFTLEVBQUM7SUFBZ0MsZ0JBUzNDckYsS0FBQSxDQUFBK0UsYUFBQSwyQkFDSS9FLEtBQUEsQ0FBQStFLGFBQUE7TUFBS00sU0FBUyxFQUFDO0lBQW9CLEdBQUMsbUJBRWhDLEVBQUN5TSxTQUFTLENBQUNuTixNQUFNLEdBQUcsQ0FBQyxpQkFDakIzRSxLQUFBLENBQUErRSxhQUFBO01BQU1NLFNBQVMsRUFBQyxnRUFBZ0U7TUFDMUUsZUFBWTtJQUFnQixHQUFDLFNBQzdCLEVBQUN5TSxTQUFTLENBQUNuTixNQUFNLEVBQUMsUUFDbEIsQ0FFVCxDQUFDLGVBQ04zRSxLQUFBLENBQUErRSxhQUFBO01BQUtNLFNBQVMsRUFBQyxVQUFVO01BQUNtVixHQUFHLEVBQUUzSDtJQUFTLGdCQUNwQzdTLEtBQUEsQ0FBQStFLGFBQUE7TUFBT00sU0FBUyxFQUFDLGtCQUFrQjtNQUFDZ0wsS0FBSyxFQUFFcEwsR0FBRyxDQUFDbEMsUUFBUSxJQUFJLEVBQUc7TUFDdkQsZUFBWSxxQkFBcUI7TUFDakM0WCxXQUFXLEVBQUU3SSxTQUFTLENBQUNuTixNQUFNLEdBQUcsQ0FBQyxHQUMzQiwyQ0FBMkMsR0FDM0Msd0NBQXlDO01BQy9DMkwsUUFBUSxFQUFHek0sQ0FBQyxJQUFLdVAsZ0JBQWdCLENBQUN2UCxDQUFDLENBQUMwTSxNQUFNLENBQUNGLEtBQUssQ0FBRTtNQUNsRHFLLE9BQU8sRUFBRUEsQ0FBQSxLQUFNNUksU0FBUyxDQUFDbk4sTUFBTSxHQUFHLENBQUMsSUFBSWlPLFlBQVksQ0FBQyxJQUFJO0lBQUUsQ0FBQyxDQUFDLEVBQ2xFZCxTQUFTLENBQUNuTixNQUFNLEdBQUcsQ0FBQyxpQkFDakIzRSxLQUFBLENBQUErRSxhQUFBO01BQVFxTCxJQUFJLEVBQUMsUUFBUTtNQUNiLGVBQVksbUJBQW1CO01BQy9COUssT0FBTyxFQUFFQSxDQUFBLEtBQU1zTixZQUFZLENBQUNyUCxDQUFDLElBQUksQ0FBQ0EsQ0FBQyxDQUFFO01BQ3JDLGNBQVcsc0JBQXNCO01BQ2pDOFcsS0FBSyxFQUFDLDJCQUEyQjtNQUNqQ2hWLFNBQVMsRUFBQztJQUErSyxnQkFDN0xyRixLQUFBLENBQUErRSxhQUFBO01BQUtVLEtBQUssRUFBQyxJQUFJO01BQUM0QixNQUFNLEVBQUMsSUFBSTtNQUFDSixPQUFPLEVBQUMsV0FBVztNQUFDSyxJQUFJLEVBQUMsTUFBTTtNQUFDSyxNQUFNLEVBQUMsY0FBYztNQUFDQyxXQUFXLEVBQUMsS0FBSztNQUFDc0IsYUFBYSxFQUFDLE9BQU87TUFBQ0MsY0FBYyxFQUFDLE9BQU87TUFBQyxlQUFZLE1BQU07TUFDOUozRCxLQUFLLEVBQUU7UUFBQ3FELFNBQVMsRUFBRThKLFNBQVMsR0FBRyxnQkFBZ0IsR0FBRyxNQUFNO1FBQUVxSSxVQUFVLEVBQUM7TUFBZ0I7SUFBRSxnQkFDeEZoYixLQUFBLENBQUErRSxhQUFBO01BQVUwSyxNQUFNLEVBQUM7SUFBZ0IsQ0FBQyxDQUNqQyxDQUNELENBQ1gsRUFDQWtELFNBQVMsSUFBSWIsU0FBUyxDQUFDbk4sTUFBTSxHQUFHLENBQUMsaUJBQzlCM0UsS0FBQSxDQUFBK0UsYUFBQTtNQUFLLGVBQVksb0JBQW9CO01BQ2hDTSxTQUFTLEVBQUM7SUFBbUksR0FDN0l5TSxTQUFTLENBQUM5TCxHQUFHLENBQUN5TixHQUFHLElBQUk7TUFDbEIsSUFBTXdILFFBQVEsR0FBRyxDQUFDaFcsR0FBRyxDQUFDbEMsUUFBUSxJQUFJLEVBQUUsRUFBRWdPLElBQUksQ0FBQyxDQUFDLEtBQUswQyxHQUFHLENBQUMzQyxJQUFJLElBQ2xEekssSUFBSSxDQUFDK04sR0FBRyxDQUFDblAsR0FBRyxDQUFDaEMsR0FBRyxHQUFHd1EsR0FBRyxDQUFDeFEsR0FBRyxDQUFDLEdBQUcsSUFBSSxJQUNsQ29ELElBQUksQ0FBQytOLEdBQUcsQ0FBQ25QLEdBQUcsQ0FBQy9CLEdBQUcsR0FBR3VRLEdBQUcsQ0FBQ3ZRLEdBQUcsQ0FBQyxHQUFHLElBQUk7TUFDekM7QUFDeEM7QUFDQTtNQUN3QyxJQUFNZ1ksTUFBTSxNQUFBcFQsTUFBQSxDQUFNMkwsR0FBRyxDQUFDeFEsR0FBRyxDQUFDNEosT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFBL0UsTUFBQSxDQUFJMkwsR0FBRyxDQUFDdlEsR0FBRyxDQUFDMkosT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFFO01BQzVELG9CQUNaN00sS0FBQSxDQUFBK0UsYUFBQTtRQUFLdkUsR0FBRyxFQUFFMGEsTUFBTztRQUNJQyxJQUFJLEVBQUMsUUFBUTtRQUFDQyxRQUFRLEVBQUUsQ0FBRTtRQUMxQjlWLE9BQU8sRUFBR3pCLENBQUMsSUFBSztVQUNaO0FBQ3JEO0FBQ0E7VUFDcUQyUCxZQUFZLENBQUNDLEdBQUcsQ0FBQztRQUNyQixDQUFFO1FBQ0Y0SCxTQUFTLEVBQUd4WCxDQUFDLElBQUs7VUFDZCxJQUFJQSxDQUFDLENBQUNyRCxHQUFHLEtBQUssT0FBTyxJQUFJcUQsQ0FBQyxDQUFDckQsR0FBRyxLQUFLLEdBQUcsRUFBRTtZQUNwQ3FELENBQUMsQ0FBQ3lYLGNBQWMsQ0FBQyxDQUFDO1lBQ2xCOUgsWUFBWSxDQUFDQyxHQUFHLENBQUM7VUFDckI7UUFDSixDQUFFO1FBQ0YsZ0NBQUEzTCxNQUFBLENBQThCMkwsR0FBRyxDQUFDM0MsSUFBSSxDQUFHO1FBQ3pDekwsU0FBUywyTUFBQXlDLE1BQUEsQ0FDSW1ULFFBQVEsR0FBRyxpQkFBaUIsR0FBRyxFQUFFO01BQUcsZ0JBQ2xEamIsS0FBQSxDQUFBK0UsYUFBQTtRQUFLTSxTQUFTLEVBQUM7TUFBZ0IsZ0JBTTNCckYsS0FBQSxDQUFBK0UsYUFBQTtRQUFPcUwsSUFBSSxFQUFDLE1BQU07UUFDWCxtQ0FBQXRJLE1BQUEsQ0FBaUNvVCxNQUFNLENBQUc7UUFDMUM3SyxLQUFLLEVBQUVvRCxHQUFHLENBQUMzQyxJQUFLO1FBQ2hCUixRQUFRLEVBQUd6TSxDQUFDLElBQUttUSxjQUFjLENBQUNQLEdBQUcsRUFBRTVQLENBQUMsQ0FBQzBNLE1BQU0sQ0FBQ0YsS0FBSyxDQUFFO1FBQ3JEL0ssT0FBTyxFQUFHekIsQ0FBQyxJQUFLQSxDQUFDLENBQUMwWCxlQUFlLENBQUMsQ0FBRTtRQUNwQ0YsU0FBUyxFQUFHeFgsQ0FBQyxJQUFLO1VBQ2Q7QUFDL0Q7QUFDQTtVQUMrRCxJQUFJQSxDQUFDLENBQUNyRCxHQUFHLEtBQUssT0FBTyxFQUFFO1lBQ25CcUQsQ0FBQyxDQUFDeVgsY0FBYyxDQUFDLENBQUM7WUFDbEJ6WCxDQUFDLENBQUMwWCxlQUFlLENBQUMsQ0FBQztVQUN2QjtRQUNKLENBQUU7UUFDRix1Q0FBQXpULE1BQUEsQ0FBcUMyTCxHQUFHLENBQUMzQyxJQUFJLENBQUc7UUFDaER6TCxTQUFTLEVBQUM7TUFHZ0IsQ0FBQyxDQUFDLGVBQ25DckYsS0FBQSxDQUFBK0UsYUFBQTtRQUFLTSxTQUFTLEVBQUM7TUFBNkMsR0FDdkRvTyxHQUFHLENBQUN4USxHQUFHLENBQUM0SixPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBRSxFQUFDNEcsR0FBRyxDQUFDdlEsR0FBRyxDQUFDMkosT0FBTyxDQUFDLENBQUMsQ0FDdkMsQ0FDSixDQUFDLGVBSU43TSxLQUFBLENBQUErRSxhQUFBO1FBQVFxTCxJQUFJLEVBQUMsUUFBUTtRQUNiLG1DQUFBdEksTUFBQSxDQUFpQzJMLEdBQUcsQ0FBQzNDLElBQUksQ0FBRztRQUM1Qyx3QkFBQWhKLE1BQUEsQ0FBc0IyTCxHQUFHLENBQUMzQyxJQUFJLENBQUc7UUFDakN1SixLQUFLLFlBQUF2UyxNQUFBLENBQVkyTCxHQUFHLENBQUMzQyxJQUFJLDBCQUF3QjtRQUNqRHhMLE9BQU8sRUFBR3pCLENBQUMsSUFBSztVQUFFQSxDQUFDLENBQUMwWCxlQUFlLENBQUMsQ0FBQztVQUFFN0gsY0FBYyxDQUFDRCxHQUFHLENBQUM7UUFBRSxDQUFFO1FBQzlEcE8sU0FBUyxFQUFDO01BRXVELGdCQUNyRXJGLEtBQUEsQ0FBQStFLGFBQUE7UUFBS1UsS0FBSyxFQUFDLElBQUk7UUFBQzRCLE1BQU0sRUFBQyxJQUFJO1FBQUNKLE9BQU8sRUFBQyxXQUFXO1FBQUNLLElBQUksRUFBQyxNQUFNO1FBQUNLLE1BQU0sRUFBQyxjQUFjO1FBQUNDLFdBQVcsRUFBQyxLQUFLO1FBQUNzQixhQUFhLEVBQUMsT0FBTztRQUFDQyxjQUFjLEVBQUMsT0FBTztRQUFDLGVBQVk7TUFBTSxnQkFDL0puSixLQUFBLENBQUErRSxhQUFBO1FBQU1GLENBQUMsRUFBQztNQUFTLENBQUMsQ0FBQyxlQUNuQjdFLEtBQUEsQ0FBQStFLGFBQUE7UUFBTUYsQ0FBQyxFQUFDO01BQXdDLENBQUMsQ0FBQyxlQUNsRDdFLEtBQUEsQ0FBQStFLGFBQUE7UUFBTUYsQ0FBQyxFQUFDO01BQXlELENBQUMsQ0FBQyxlQUNuRTdFLEtBQUEsQ0FBQStFLGFBQUE7UUFBTUYsQ0FBQyxFQUFDO01BQWtCLENBQUMsQ0FDMUIsQ0FDRCxDQUNQLENBQUM7SUFFZCxDQUFDLENBQ0EsQ0FFUixDQUFDLGVBQ043RSxLQUFBLENBQUErRSxhQUFBO01BQUdNLFNBQVMsRUFBQztJQUF3QyxHQUNoRHlNLFNBQVMsQ0FBQ25OLE1BQU0sR0FBRyxDQUFDLEdBQ2YsdUVBQXVFLEdBQ3ZFLDREQUNQLENBQUMsRUFTSCxDQUFDLE1BQU07TUFDSixJQUFNNlcsS0FBSyxHQUFHLENBQUN2VyxHQUFHLENBQUNsQyxRQUFRLElBQUksRUFBRSxFQUFFZ08sSUFBSSxDQUFDLENBQUM7TUFDekMsSUFBSSxDQUFDeUssS0FBSyxFQUFFLE9BQU8sSUFBSTtNQUN2QixJQUFNckwsS0FBSyxHQUFJdUgsQ0FBQyxJQUFLLENBQUNyUixJQUFJLENBQUM4SixLQUFLLENBQUN1SCxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsS0FBSyxFQUFFN0ssT0FBTyxDQUFDLENBQUMsQ0FBQztNQUMvRCxJQUFNNE8sR0FBRyxHQUFHdEwsS0FBSyxDQUFDbEwsR0FBRyxDQUFDaEMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHa04sS0FBSyxDQUFDbEwsR0FBRyxDQUFDL0IsR0FBRyxDQUFDO01BQ2pELElBQU13WSxRQUFRLEdBQUc1SixTQUFTLENBQUMxSCxJQUFJLENBQUNuRSxDQUFDLElBQUlBLENBQUMsQ0FBQzZLLElBQUksS0FBSzBLLEtBQUssSUFDYnJMLEtBQUssQ0FBQ2xLLENBQUMsQ0FBQ2hELEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBR2tOLEtBQUssQ0FBQ2xLLENBQUMsQ0FBQy9DLEdBQUcsQ0FBQyxLQUFNdVksR0FBRyxDQUFDO01BQ25GLElBQUksQ0FBQ0MsUUFBUSxFQUFFLE9BQU8sSUFBSTtNQUMxQixvQkFDSTFiLEtBQUEsQ0FBQStFLGFBQUE7UUFBSyxlQUFZLG1CQUFtQjtRQUMvQk0sU0FBUyxFQUFDO01BQWtILGdCQUM3SHJGLEtBQUEsQ0FBQStFLGFBQUE7UUFBR00sU0FBUyxFQUFDO01BQWdCLEdBQUMseUJBQTBCLENBQUMsT0FDekQsZUFBQXJGLEtBQUEsQ0FBQStFLGFBQUE7UUFBTU0sU0FBUyxFQUFDO01BQStCLEdBQzFDcVcsUUFBUSxDQUFDelksR0FBRyxDQUFDNEosT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFDLElBQUUsRUFBQzZPLFFBQVEsQ0FBQ3hZLEdBQUcsQ0FBQzJKLE9BQU8sQ0FBQyxDQUFDLENBQ2hELENBQUMsNEZBRU4sQ0FBQztJQUVkLENBQUMsRUFBRSxDQUNGLENBQUMsZUFFTjdNLEtBQUEsQ0FBQStFLGFBQUE7TUFBS00sU0FBUyxFQUFDO0lBQWdDLGdCQUMzQ3JGLEtBQUEsQ0FBQStFLGFBQUE7TUFBS00sU0FBUyxFQUFDO0lBQW9CLEdBQUMseUJBRWhDLEVBQUNvTSxPQUFPLGlCQUFJelIsS0FBQSxDQUFBK0UsYUFBQTtNQUFNTSxTQUFTLEVBQUM7SUFBaUQsR0FBQyxrQkFBaUIsQ0FDOUYsQ0FBQyxlQUNOckYsS0FBQSxDQUFBK0UsYUFBQTtNQUFPTSxTQUFTLEVBQUMsYUFBYTtNQUFDZ0wsS0FBSyxFQUFFcEwsR0FBRyxDQUFDakMsSUFBSztNQUN4Q3NOLFFBQVEsRUFBR3pNLENBQUMsSUFBR3FCLE1BQU0sQ0FBQUosYUFBQSxDQUFBQSxhQUFBLEtBQUtHLEdBQUc7UUFBRWpDLElBQUksRUFBQ2EsQ0FBQyxDQUFDME0sTUFBTSxDQUFDRjtNQUFLLEVBQUM7SUFBRSxDQUFDLENBQzVELENBQUMsZUFDTnJRLEtBQUEsQ0FBQStFLGFBQUE7TUFBS00sU0FBUyxFQUFDO0lBQXdCLGdCQUNuQ3JGLEtBQUEsQ0FBQStFLGFBQUEsMkJBQ0kvRSxLQUFBLENBQUErRSxhQUFBO01BQUtNLFNBQVMsRUFBQztJQUFvQixHQUFFbEYsQ0FBQyxDQUFDLGFBQWEsQ0FBTyxDQUFDLGVBQzVESCxLQUFBLENBQUErRSxhQUFBO01BQU9NLFNBQVMsRUFBQyxhQUFhO01BQUMrSyxJQUFJLEVBQUMsUUFBUTtNQUFDdkosSUFBSSxFQUFDLFFBQVE7TUFBQ3dKLEtBQUssRUFBRXBMLEdBQUcsQ0FBQ2hDLEdBQUk7TUFDbkVxTixRQUFRLEVBQUd6TSxDQUFDLElBQUdxQixNQUFNLENBQUFKLGFBQUEsQ0FBQUEsYUFBQSxLQUFLRyxHQUFHO1FBQUVoQyxHQUFHLEVBQUMsQ0FBQ1ksQ0FBQyxDQUFDME0sTUFBTSxDQUFDRjtNQUFLLEVBQUM7SUFBRSxDQUFDLENBQzVELENBQUMsZUFDTnJRLEtBQUEsQ0FBQStFLGFBQUEsMkJBQ0kvRSxLQUFBLENBQUErRSxhQUFBO01BQUtNLFNBQVMsRUFBQztJQUFvQixHQUFFbEYsQ0FBQyxDQUFDLGNBQWMsQ0FBTyxDQUFDLGVBQzdESCxLQUFBLENBQUErRSxhQUFBO01BQU9NLFNBQVMsRUFBQyxhQUFhO01BQUMrSyxJQUFJLEVBQUMsUUFBUTtNQUFDdkosSUFBSSxFQUFDLFFBQVE7TUFBQ3dKLEtBQUssRUFBRXBMLEdBQUcsQ0FBQy9CLEdBQUk7TUFDbkVvTixRQUFRLEVBQUd6TSxDQUFDLElBQUdxQixNQUFNLENBQUFKLGFBQUEsQ0FBQUEsYUFBQSxLQUFLRyxHQUFHO1FBQUUvQixHQUFHLEVBQUMsQ0FBQ1csQ0FBQyxDQUFDME0sTUFBTSxDQUFDRjtNQUFLLEVBQUM7SUFBRSxDQUFDLENBQzVELENBQ0osQ0FBQyxlQUVOclEsS0FBQSxDQUFBK0UsYUFBQTtNQUFRTyxPQUFPLEVBQUVrVCxhQUFjO01BQ3ZCbUQsUUFBUSxFQUFFckQsUUFBUSxLQUFLLE1BQU87TUFDOUIsZUFBWSxxQkFBcUI7TUFDakNqVCxTQUFTLHFJQUFBeUMsTUFBQSxDQUNId1EsUUFBUSxLQUFLLE1BQU0sR0FDZixnRUFBZ0UsR0FDL0RBLFFBQVEsSUFBSUEsUUFBUSxDQUFDSyxHQUFHLEdBQ3JCLHNFQUFzRSxHQUN0RSx5RUFBMEU7SUFBRyxHQUM5RkwsUUFBUSxLQUFLLE1BQU0sR0FDZCw2QkFBNkIsR0FDN0IsNEJBQ0YsQ0FBQyxFQUNSQSxRQUFRLElBQUlBLFFBQVEsQ0FBQ0ssR0FBRyxpQkFDckIzWSxLQUFBLENBQUErRSxhQUFBO01BQUssZUFBWSxlQUFlO01BQzNCTSxTQUFTLEVBQUM7SUFBNEcsZ0JBQ3ZIckYsS0FBQSxDQUFBK0UsYUFBQTtNQUFHTSxTQUFTLEVBQUM7SUFBZSxHQUFDLHlCQUEwQixDQUFDLGVBQUFyRixLQUFBLENBQUErRSxhQUFBLFdBQUksQ0FBQyxlQUM3RC9FLEtBQUEsQ0FBQStFLGFBQUE7TUFBTU0sU0FBUyxFQUFDO0lBQWtCLEdBQUVpVCxRQUFRLENBQUNLLEdBQVUsQ0FBQyxFQUV2RCxPQUFPdFksTUFBTSxLQUFLLFdBQVcsSUFBSUEsTUFBTSxDQUFDYSxRQUFRLElBQUliLE1BQU0sQ0FBQ2EsUUFBUSxDQUFDMGEsUUFBUSxLQUFLLE9BQU8saUJBQ3JGNWIsS0FBQSxDQUFBK0UsYUFBQTtNQUFLTSxTQUFTLEVBQUM7SUFBK0MsR0FBQyxtR0FFMUQsQ0FFUixDQUNSLGVBRURyRixLQUFBLENBQUErRSxhQUFBO01BQUtNLFNBQVMsRUFBQztJQUFxQyxnQkFDaERyRixLQUFBLENBQUErRSxhQUFBO01BQUtNLFNBQVMsRUFBQztJQUFrQixHQUFFbEYsQ0FBQyxDQUFDLGdCQUFnQixDQUFPLENBQUMsZUFDN0RILEtBQUEsQ0FBQStFLGFBQUE7TUFBS00sU0FBUyxFQUFDO0lBQTBCLEdBQ3BDLENBQ0c7TUFBRXlMLElBQUksRUFBQyxhQUFhO01BQUk3TixHQUFHLEVBQUMsT0FBTztNQUFFQyxHQUFHLEVBQUMsQ0FBQyxPQUFPO01BQUUyWSxDQUFDLEVBQUM7SUFBRyxDQUFDLEVBQ3pEO01BQUUvSyxJQUFJLEVBQUMsY0FBYztNQUFHN04sR0FBRyxFQUFDLE9BQU87TUFBRUMsR0FBRyxFQUFDLENBQUMsT0FBTztNQUFFMlksQ0FBQyxFQUFDO0lBQUcsQ0FBQyxFQUN6RDtNQUFFL0ssSUFBSSxFQUFDLFlBQVk7TUFBSzdOLEdBQUcsRUFBQyxPQUFPO01BQUVDLEdBQUcsRUFBRSxDQUFDLE1BQU07TUFBRTJZLENBQUMsRUFBQztJQUFHLENBQUMsRUFDekQ7TUFBRS9LLElBQUksRUFBQyxXQUFXO01BQU03TixHQUFHLEVBQUMsT0FBTztNQUFFQyxHQUFHLEVBQUcsTUFBTTtNQUFFMlksQ0FBQyxFQUFDO0lBQUcsQ0FBQyxFQUN6RDtNQUFFL0ssSUFBSSxFQUFDLFdBQVc7TUFBTTdOLEdBQUcsRUFBQyxPQUFPO01BQUVDLEdBQUcsRUFBQyxRQUFRO01BQUUyWSxDQUFDLEVBQUM7SUFBRyxDQUFDLEVBQ3pEO01BQUUvSyxJQUFJLEVBQUMsWUFBWTtNQUFLN04sR0FBRyxFQUFDLENBQUMsT0FBTztNQUFDQyxHQUFHLEVBQUMsUUFBUTtNQUFFMlksQ0FBQyxFQUFDO0lBQUcsQ0FBQyxDQUM1RCxDQUFDN1YsR0FBRyxDQUFDc00sQ0FBQyxpQkFDSHRTLEtBQUEsQ0FBQStFLGFBQUE7TUFBUXZFLEdBQUcsRUFBRThSLENBQUMsQ0FBQ3hCLElBQUs7TUFDWnhMLE9BQU8sRUFBRUEsQ0FBQSxLQUFNO1FBQ1hKLE1BQU0sQ0FBQ3FFLENBQUMsSUFBQXpFLGFBQUEsQ0FBQUEsYUFBQSxLQUFTeUUsQ0FBQztVQUFFdEcsR0FBRyxFQUFDcVAsQ0FBQyxDQUFDclAsR0FBRztVQUFFQyxHQUFHLEVBQUNvUCxDQUFDLENBQUNwUCxHQUFHO1VBQUVGLElBQUksRUFBQ3NQLENBQUMsQ0FBQ3hCO1FBQUksRUFBRSxDQUFDO1FBQ3hELElBQUlPLE1BQU0sQ0FBQzBCLE9BQU8sRUFBRTFCLE1BQU0sQ0FBQzBCLE9BQU8sQ0FBQ1EsT0FBTyxDQUFDLENBQUNqQixDQUFDLENBQUNyUCxHQUFHLEVBQUVxUCxDQUFDLENBQUNwUCxHQUFHLENBQUMsRUFBRW9QLENBQUMsQ0FBQ3VKLENBQUMsQ0FBQztNQUNuRSxDQUFFO01BQ0Z4VyxTQUFTLEVBQUM7SUFBNkssR0FDMUxpTixDQUFDLENBQUN4QixJQUNDLENBQ1gsQ0FDQSxDQUNKLENBQUMsZUFFTjlRLEtBQUEsQ0FBQStFLGFBQUE7TUFBR00sU0FBUyxFQUFDO0lBQTRDLEdBQUMsZ0lBR3ZELENBQ0YsQ0FDSixDQUNHLENBQUM7RUFFckI7O0VBRUE7QUFDQTtBQUNBO0VBQ0EsU0FBUzZDLGFBQWFBLENBQUE0VCxNQUFBLEVBQW1DO0lBQUEsSUFBaEM3VyxHQUFHLEdBQUE2VyxNQUFBLENBQUg3VyxHQUFHO01BQUVDLE1BQU0sR0FBQTRXLE1BQUEsQ0FBTjVXLE1BQU07TUFBRStDLE9BQU8sR0FBQTZULE1BQUEsQ0FBUDdULE9BQU87TUFBRTdDLE1BQU0sR0FBQTBXLE1BQUEsQ0FBTjFXLE1BQU07SUFDakQsSUFBTTJXLEtBQUssR0FBRyxDQUNWO01BQUU3QyxJQUFJLEVBQUMsSUFBSTtNQUFLek4sS0FBSyxFQUFDLFNBQVM7TUFBaUJ1USxNQUFNLEVBQUM7SUFBYSxDQUFDLEVBQ3JFO01BQUU5QyxJQUFJLEVBQUMsT0FBTztNQUFFek4sS0FBSyxFQUFDLHNCQUFzQjtNQUFJdVEsTUFBTSxFQUFDO0lBQVUsQ0FBQyxFQUNsRTtNQUFFOUMsSUFBSSxFQUFDLE9BQU87TUFBRXpOLEtBQUssRUFBQyx1QkFBdUI7TUFBR3VRLE1BQU0sRUFBQztJQUFVLENBQUMsRUFDbEU7TUFBRTlDLElBQUksRUFBQyxJQUFJO01BQUt6TixLQUFLLEVBQUMsVUFBVTtNQUFnQnVRLE1BQU0sRUFBQztJQUFXLENBQUMsRUFDbkU7TUFBRTlDLElBQUksRUFBQyxJQUFJO01BQUt6TixLQUFLLEVBQUMsUUFBUTtNQUFrQnVRLE1BQU0sRUFBQztJQUFXLENBQUMsQ0FDdEU7O0lBRUQ7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQUNJLElBQU1uUixjQUFjLEdBQUdBLENBQUEsS0FBTTtNQUN6QixJQUFJO1FBQ0FySCxZQUFZLENBQUMrQixPQUFPLENBQUMsV0FBVyxFQUFFTixHQUFHLENBQUNyQixJQUFJLENBQUM7UUFDM0N2RCxNQUFNLENBQUMySyxhQUFhLENBQUMsSUFBSWlSLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM3QzdRLE9BQU8sQ0FBQ0MsSUFBSSxDQUFDLDJCQUEyQixFQUFFcEcsR0FBRyxDQUFDckIsSUFBSSxDQUFDO01BQ3ZELENBQUMsQ0FBQyxPQUFPQyxDQUFDLEVBQUU7UUFDUnVILE9BQU8sQ0FBQ0UsSUFBSSxDQUFDLDBDQUEwQyxFQUFFekgsQ0FBQyxDQUFDO01BQy9EO01BQ0F1QixNQUFNLENBQUMsQ0FBQztJQUNaLENBQUM7SUFDRCxvQkFDSXBGLEtBQUEsQ0FBQStFLGFBQUEsQ0FBQ3FWLFVBQVU7TUFBQ0MsS0FBSyxFQUFFbGEsQ0FBQyxDQUFDLHFCQUFxQixDQUFFO01BQUNtYSxRQUFRLEVBQUVuYSxDQUFDLENBQUMsaUJBQWlCLENBQUU7TUFBQ1UsTUFBTSxFQUFDLFNBQVM7TUFBQ29ILE9BQU8sRUFBRUEsT0FBUTtNQUFDN0MsTUFBTSxFQUFFeUY7SUFBZSxnQkFDbkk3SyxLQUFBLENBQUErRSxhQUFBO01BQUtNLFNBQVMsRUFBQztJQUF3QixHQUNsQzBXLEtBQUssQ0FBQy9WLEdBQUcsQ0FBQzZLLENBQUMsaUJBQ1I3USxLQUFBLENBQUErRSxhQUFBO01BQVF2RSxHQUFHLEVBQUVxUSxDQUFDLENBQUNxSSxJQUFLO01BQUM1VCxPQUFPLEVBQUVBLENBQUEsS0FBSUosTUFBTSxDQUFBSixhQUFBLENBQUFBLGFBQUEsS0FBS0csR0FBRztRQUFFckIsSUFBSSxFQUFDaU4sQ0FBQyxDQUFDcUk7TUFBSSxFQUFDLENBQUU7TUFDeEQ3VCxTQUFTLHVGQUFBeUMsTUFBQSxDQUNIN0MsR0FBRyxDQUFDckIsSUFBSSxLQUFLaU4sQ0FBQyxDQUFDcUksSUFBSSxHQUNmLHNDQUFzQyxHQUN0QyxxREFBcUQ7SUFBRyxnQkFDdEVsWixLQUFBLENBQUErRSxhQUFBO01BQUtNLFNBQVMsRUFBQztJQUFpRSxHQUFFd0wsQ0FBQyxDQUFDcUksSUFBVSxDQUFDLGVBQy9GbFosS0FBQSxDQUFBK0UsYUFBQTtNQUFLTSxTQUFTLEVBQUM7SUFBbUMsR0FBRXdMLENBQUMsQ0FBQ21MLE1BQVksQ0FBQyxlQUNuRWhjLEtBQUEsQ0FBQStFLGFBQUE7TUFBS00sU0FBUyxFQUFDO0lBQTRCLEdBQUV3TCxDQUFDLENBQUNwRixLQUFXLENBQ3RELENBQ1gsQ0FDQSxDQUNHLENBQUM7RUFFckI7O0VBRUE7QUFDQTtBQUNBO0VBQ0E7RUFDQSxJQUFNeVEsb0JBQW9CLEdBQUc7SUFDekJDLE9BQU8sRUFBSyxDQUNSO01BQUUzYixHQUFHLEVBQUMsVUFBVTtNQUFHaUwsS0FBSyxFQUFDLFVBQVU7TUFBVzJFLElBQUksRUFBQyxRQUFRO01BQUdnTSxPQUFPLEVBQUMsQ0FBQyxZQUFZLEVBQUMsS0FBSyxFQUFDLE9BQU8sQ0FBQztNQUFFQyxHQUFHLEVBQUM7SUFBYSxDQUFDLEVBQ3RIO01BQUU3YixHQUFHLEVBQUMsU0FBUztNQUFJaUwsS0FBSyxFQUFDLGtCQUFrQjtNQUFHMkUsSUFBSSxFQUFDLFFBQVE7TUFBR2dNLE9BQU8sRUFBQyxDQUFDLE9BQU8sRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLFFBQVEsRUFBQyxLQUFLLENBQUM7TUFBRUMsR0FBRyxFQUFDO0lBQVMsQ0FBQyxFQUMvSDtNQUFFN2IsR0FBRyxFQUFDLE9BQU87TUFBTWlMLEtBQUssRUFBQyxpQkFBaUI7TUFBSTJFLElBQUksRUFBQyxRQUFRO01BQUdpTSxHQUFHLEVBQUM7SUFBRyxDQUFDLENBQ3pFO0lBQ0RsYSxNQUFNLEVBQU0sQ0FDUjtNQUFFM0IsR0FBRyxFQUFDLFNBQVM7TUFBSWlMLEtBQUssRUFBQyxlQUFlO01BQU0yRSxJQUFJLEVBQUMsUUFBUTtNQUFHZ00sT0FBTyxFQUFDLENBQUMsYUFBYSxFQUFDLFdBQVcsRUFBQyxVQUFVLENBQUM7TUFBRUMsR0FBRyxFQUFDO0lBQWMsQ0FBQyxFQUNqSTtNQUFFN2IsR0FBRyxFQUFDLFNBQVM7TUFBSWlMLEtBQUssRUFBQywwQkFBMEI7TUFBRzJFLElBQUksRUFBQyxRQUFRO01BQUVpTSxHQUFHLEVBQUM7SUFBTSxDQUFDLENBQ25GO0lBQ0RDLFVBQVUsRUFBRSxDQUNSO01BQUU5YixHQUFHLEVBQUMsVUFBVTtNQUFHaUwsS0FBSyxFQUFDLGtCQUFrQjtNQUFHMkUsSUFBSSxFQUFDLFFBQVE7TUFBRWlNLEdBQUcsRUFBQztJQUFLLENBQUMsRUFDdkU7TUFBRTdiLEdBQUcsRUFBQyxNQUFNO01BQU9pTCxLQUFLLEVBQUMsbUJBQW1CO01BQUUyRSxJQUFJLEVBQUMsUUFBUTtNQUFFaU0sR0FBRyxFQUFDO0lBQUUsQ0FBQyxDQUN2RTtJQUNERSxHQUFHLEVBQVMsQ0FDUjtNQUFFL2IsR0FBRyxFQUFDLE1BQU07TUFBT2lMLEtBQUssRUFBQyxlQUFlO01BQU0yRSxJQUFJLEVBQUMsUUFBUTtNQUFHZ00sT0FBTyxFQUFDLENBQUMsaUJBQWlCLEVBQUMsZ0JBQWdCLEVBQUMsYUFBYSxDQUFDO01BQUVDLEdBQUcsRUFBQztJQUFpQixDQUFDLEVBQ2hKO01BQUU3YixHQUFHLEVBQUMsU0FBUztNQUFJaUwsS0FBSyxFQUFDLGlCQUFpQjtNQUFJMkUsSUFBSSxFQUFDLFFBQVE7TUFBRWlNLEdBQUcsRUFBQztJQUFNLENBQUMsQ0FDM0U7SUFDREcsSUFBSSxFQUFRLENBQ1I7TUFBRWhjLEdBQUcsRUFBQyxNQUFNO01BQU9pTCxLQUFLLEVBQUMsYUFBYTtNQUFRMkUsSUFBSSxFQUFDLE1BQU07TUFBSWlNLEdBQUcsRUFBQztJQUFnQixDQUFDLEVBQ2xGO01BQUU3YixHQUFHLEVBQUMsTUFBTTtNQUFPaUwsS0FBSyxFQUFDLGVBQWU7TUFBTTJFLElBQUksRUFBQyxRQUFRO01BQUVpTSxHQUFHLEVBQUM7SUFBTSxDQUFDLEVBQ3hFO01BQUU3YixHQUFHLEVBQUMsU0FBUztNQUFJaUwsS0FBSyxFQUFDLG9CQUFvQjtNQUFDMkUsSUFBSSxFQUFDLFFBQVE7TUFBRWlNLEdBQUcsRUFBQztJQUFLLENBQUMsQ0FDMUU7SUFDREksUUFBUSxFQUFJLENBQ1I7TUFBRWpjLEdBQUcsRUFBQyxTQUFTO01BQUlpTCxLQUFLLEVBQUMsbUJBQW1CO01BQUUyRSxJQUFJLEVBQUMsTUFBTTtNQUFJaU0sR0FBRyxFQUFDO0lBQVksQ0FBQyxFQUM5RTtNQUFFN2IsR0FBRyxFQUFDLFNBQVM7TUFBSWlMLEtBQUssRUFBQyxTQUFTO01BQVkyRSxJQUFJLEVBQUMsUUFBUTtNQUFFaU0sR0FBRyxFQUFDO0lBQUUsQ0FBQyxFQUNwRTtNQUFFN2IsR0FBRyxFQUFDLFVBQVU7TUFBR2lMLEtBQUssRUFBQyxVQUFVO01BQVcyRSxJQUFJLEVBQUMsUUFBUTtNQUFFaU0sR0FBRyxFQUFDO0lBQUksQ0FBQztFQUU5RSxDQUFDO0VBRUQsU0FBU2xVLFlBQVlBLENBQUF1VSxNQUFBLEVBQW1DO0lBQUEsSUFBaEN6WCxHQUFHLEdBQUF5WCxNQUFBLENBQUh6WCxHQUFHO01BQUVDLE1BQU0sR0FBQXdYLE1BQUEsQ0FBTnhYLE1BQU07TUFBRStDLE9BQU8sR0FBQXlVLE1BQUEsQ0FBUHpVLE9BQU87TUFBRTdDLE1BQU0sR0FBQXNYLE1BQUEsQ0FBTnRYLE1BQU07SUFDaEQsSUFBTXVYLEdBQUcsR0FBRyxDQUNSO01BQUV4VixFQUFFLEVBQUMsU0FBUztNQUFNMkosSUFBSSxFQUFDLFNBQVM7TUFBVThMLElBQUksRUFBQyxvQkFBb0I7TUFBV0MsR0FBRyxFQUFDO0lBQVEsQ0FBQyxFQUM3RjtNQUFFMVYsRUFBRSxFQUFDLFFBQVE7TUFBTzJKLElBQUksRUFBQyxlQUFlO01BQUk4TCxJQUFJLEVBQUMsMEJBQTBCO01BQUtDLEdBQUcsRUFBQztJQUFRLENBQUMsRUFDN0Y7TUFBRTFWLEVBQUUsRUFBQyxZQUFZO01BQUcySixJQUFJLEVBQUMsZUFBZTtNQUFJOEwsSUFBSSxFQUFDLG9CQUFvQjtNQUFXQyxHQUFHLEVBQUM7SUFBUSxDQUFDLEVBQzdGO01BQUUxVixFQUFFLEVBQUMsS0FBSztNQUFVMkosSUFBSSxFQUFDLGVBQWU7TUFBSThMLElBQUksRUFBQyxxQkFBcUI7TUFBVUMsR0FBRyxFQUFDO0lBQVEsQ0FBQyxFQUM3RjtNQUFFMVYsRUFBRSxFQUFDLE1BQU07TUFBUzJKLElBQUksRUFBQyxhQUFhO01BQU04TCxJQUFJLEVBQUMscUNBQXFDO01BQVlDLEdBQUcsRUFBQztJQUFRLENBQUMsRUFDL0c7TUFBRTFWLEVBQUUsRUFBQyxVQUFVO01BQUsySixJQUFJLEVBQUMsaUJBQWlCO01BQUU4TCxJQUFJLEVBQUMsd0JBQXdCO01BQU9DLEdBQUcsRUFBQztJQUFhLENBQUMsQ0FDckc7SUFDRCxJQUFNQyxNQUFNLEdBQUkzVixFQUFFLElBQUtqQyxNQUFNLENBQUNxRSxDQUFDLElBQUF6RSxhQUFBLENBQUFBLGFBQUEsS0FDeEJ5RSxDQUFDO01BQ0pyRixPQUFPLEVBQUVxRixDQUFDLENBQUNyRixPQUFPLENBQUM2WSxRQUFRLENBQUM1VixFQUFFLENBQUMsR0FBR29DLENBQUMsQ0FBQ3JGLE9BQU8sQ0FBQ08sTUFBTSxDQUFDK0IsQ0FBQyxJQUFJQSxDQUFDLEtBQUtXLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBR29DLENBQUMsQ0FBQ3JGLE9BQU8sRUFBRWlELEVBQUU7SUFBQyxFQUN4RixDQUFDOztJQUVIO0lBQ0EsSUFBQTZWLGlCQUFBLEdBQW9DaGQsS0FBSyxDQUFDQyxRQUFRLENBQUMsSUFBSSxDQUFDO01BQUFnZCxpQkFBQSxHQUFBMWIsY0FBQSxDQUFBeWIsaUJBQUE7TUFBakRFLFVBQVUsR0FBQUQsaUJBQUE7TUFBRUUsYUFBYSxHQUFBRixpQkFBQTtJQUVoQyxJQUFNRyxXQUFXLEdBQUdBLENBQUNDLFFBQVEsRUFBRUMsUUFBUSxFQUFFak4sS0FBSyxLQUFLO01BQy9DbkwsTUFBTSxDQUFDcUUsQ0FBQyxJQUFBekUsYUFBQSxDQUFBQSxhQUFBLEtBQ0R5RSxDQUFDO1FBQ0pnVSxNQUFNLEVBQUF6WSxhQUFBLENBQUFBLGFBQUEsS0FBUXlFLENBQUMsQ0FBQ2dVLE1BQU0sSUFBSSxDQUFDLENBQUM7VUFBRyxDQUFDRixRQUFRLEdBQUF2WSxhQUFBLENBQUFBLGFBQUEsS0FBUyxDQUFDeUUsQ0FBQyxDQUFDZ1UsTUFBTSxJQUFJLENBQUMsQ0FBQyxFQUFFRixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFBRyxDQUFDQyxRQUFRLEdBQUdqTjtVQUFLO1FBQUU7TUFBRSxFQUMzRyxDQUFDO0lBQ1AsQ0FBQztJQUVELElBQU1tTixRQUFRLEdBQUdBLENBQUNILFFBQVEsRUFBRUksS0FBSyxLQUFLO01BQ2xDLElBQU1DLE1BQU0sR0FBR3pZLEdBQUcsQ0FBQ3NZLE1BQU0sSUFBSXRZLEdBQUcsQ0FBQ3NZLE1BQU0sQ0FBQ0YsUUFBUSxDQUFDLElBQUlwWSxHQUFHLENBQUNzWSxNQUFNLENBQUNGLFFBQVEsQ0FBQyxDQUFDSSxLQUFLLENBQUNqZCxHQUFHLENBQUM7TUFDcEYsT0FBT2tkLE1BQU0sS0FBS0MsU0FBUyxHQUFHRCxNQUFNLEdBQUdELEtBQUssQ0FBQ3BCLEdBQUc7SUFDcEQsQ0FBQztJQUVELG9CQUNJcmMsS0FBQSxDQUFBK0UsYUFBQSxDQUFDcVYsVUFBVTtNQUFDQyxLQUFLLEVBQUVsYSxDQUFDLENBQUMsbUJBQW1CLENBQUU7TUFBQ21hLFFBQVEsRUFBRW5hLENBQUMsQ0FBQyxlQUFlLENBQUU7TUFBQ1UsTUFBTSxFQUFDLE1BQU07TUFBQ29ILE9BQU8sRUFBRUEsT0FBUTtNQUFDN0MsTUFBTSxFQUFFQSxNQUFPO01BQUMyRCxJQUFJLEVBQUM7SUFBTSxnQkFDaEkvSSxLQUFBLENBQUErRSxhQUFBO01BQUtNLFNBQVMsRUFBQztJQUE2QyxHQUN2RHNYLEdBQUcsQ0FBQzNXLEdBQUcsQ0FBQzRELENBQUMsSUFBSTtNQUNWLElBQU0rTixFQUFFLEdBQUcxUyxHQUFHLENBQUNmLE9BQU8sQ0FBQzZZLFFBQVEsQ0FBQ25ULENBQUMsQ0FBQ3pDLEVBQUUsQ0FBQztNQUNyQyxJQUFNeVcsUUFBUSxHQUFHVixVQUFVLEtBQUt0VCxDQUFDLENBQUN6QyxFQUFFO01BQ3BDLElBQU1vVyxNQUFNLEdBQUdyQixvQkFBb0IsQ0FBQ3RTLENBQUMsQ0FBQ3pDLEVBQUUsQ0FBQyxJQUFJLEVBQUU7TUFDL0Msb0JBQ0luSCxLQUFBLENBQUErRSxhQUFBO1FBQUt2RSxHQUFHLEVBQUVvSixDQUFDLENBQUN6QyxFQUFHO1FBQ1Y5QixTQUFTLHVFQUFBeUMsTUFBQSxDQUNKNlAsRUFBRSxHQUFHLG1DQUFtQyxHQUFHLGtDQUFrQyx3Q0FBQTdQLE1BQUEsQ0FDN0U4VixRQUFRLEdBQUcseUJBQXlCLEdBQUcsRUFBRTtNQUFHLGdCQUNsRDVkLEtBQUEsQ0FBQStFLGFBQUE7UUFBS00sU0FBUyxFQUFDO01BQXVDLGdCQUNsRHJGLEtBQUEsQ0FBQStFLGFBQUEsMkJBQ0kvRSxLQUFBLENBQUErRSxhQUFBO1FBQUtNLFNBQVMsRUFBQztNQUFtQyxHQUFFdUUsQ0FBQyxDQUFDa0gsSUFBSSxlQUN0RDlRLEtBQUEsQ0FBQStFLGFBQUE7UUFBTU0sU0FBUyxFQUFDO01BQTJDLEdBQUMsR0FBQyxFQUFDdUUsQ0FBQyxDQUFDaVQsR0FBVSxDQUN6RSxDQUFDLGVBQ043YyxLQUFBLENBQUErRSxhQUFBO1FBQUtNLFNBQVMsRUFBQztNQUF3QixHQUFFdUUsQ0FBQyxDQUFDZ1QsSUFBVSxDQUNwRCxDQUFDLGVBQ041YyxLQUFBLENBQUErRSxhQUFBO1FBQUtNLFNBQVMsRUFBQztNQUF5QixnQkFDcENyRixLQUFBLENBQUErRSxhQUFBO1FBQVFPLE9BQU8sRUFBRUEsQ0FBQSxLQUFNd1gsTUFBTSxDQUFDbFQsQ0FBQyxDQUFDekMsRUFBRSxDQUFFO1FBQzVCLGdDQUFBVyxNQUFBLENBQThCOEIsQ0FBQyxDQUFDekMsRUFBRSxDQUFHO1FBQ3JDOUIsU0FBUyxtSUFBQXlDLE1BQUEsQ0FDSDZQLEVBQUUsR0FBRyxpREFBaUQsR0FBRyw4Q0FBOEM7TUFBRyxHQUNuSEEsRUFBRSxHQUFHeFgsQ0FBQyxDQUFDLFlBQVksQ0FBQyxHQUFHQSxDQUFDLENBQUMsYUFBYSxDQUNuQyxDQUFDLGVBQ1RILEtBQUEsQ0FBQStFLGFBQUE7UUFBUU8sT0FBTyxFQUFFQSxDQUFBLEtBQU02WCxhQUFhLENBQUNTLFFBQVEsR0FBRyxJQUFJLEdBQUdoVSxDQUFDLENBQUN6QyxFQUFFLENBQUU7UUFDckQsZ0NBQUFXLE1BQUEsQ0FBOEI4QixDQUFDLENBQUN6QyxFQUFFLENBQUc7UUFDckM5QixTQUFTLGtKQUFBeUMsTUFBQSxDQUNIOFYsUUFBUSxHQUNKLDhDQUE4QyxHQUM5Qyw4R0FBOEc7TUFBRyxHQUM5SEEsUUFBUSxHQUFHemQsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxHQUFHQSxDQUFDLENBQUMsaUJBQWlCLENBQzlDLENBQ1AsQ0FDSixDQUFDLEVBQ0x5ZCxRQUFRLGlCQUNMNWQsS0FBQSxDQUFBK0UsYUFBQTtRQUFLTSxTQUFTLEVBQUMsdURBQXVEO1FBQUMsc0NBQUF5QyxNQUFBLENBQW9DOEIsQ0FBQyxDQUFDekMsRUFBRTtNQUFHLEdBQzdHb1csTUFBTSxDQUFDNVksTUFBTSxLQUFLLENBQUMsZ0JBQ2hCM0UsS0FBQSxDQUFBK0UsYUFBQTtRQUFHTSxTQUFTLEVBQUM7TUFBb0MsR0FBQywrQ0FBZ0QsQ0FBQyxnQkFFbkdyRixLQUFBLENBQUErRSxhQUFBO1FBQUtNLFNBQVMsRUFBQztNQUE0QyxHQUN0RGtZLE1BQU0sQ0FBQ3ZYLEdBQUcsQ0FBQzZYLENBQUMsSUFBSTtRQUNiLElBQU10YSxDQUFDLEdBQUdpYSxRQUFRLENBQUM1VCxDQUFDLENBQUN6QyxFQUFFLEVBQUUwVyxDQUFDLENBQUM7UUFDM0Isb0JBQ0k3ZCxLQUFBLENBQUErRSxhQUFBO1VBQUt2RSxHQUFHLEVBQUVxZCxDQUFDLENBQUNyZDtRQUFJLGdCQUNaUixLQUFBLENBQUErRSxhQUFBO1VBQU9NLFNBQVMsRUFBQztRQUEyRSxHQUFFd1ksQ0FBQyxDQUFDcFMsS0FBYSxDQUFDLEVBQzdHb1MsQ0FBQyxDQUFDek4sSUFBSSxLQUFLLFFBQVEsaUJBQ2hCcFEsS0FBQSxDQUFBK0UsYUFBQTtVQUFRTSxTQUFTLEVBQUMsNEJBQTRCO1VBQ3RDZ0wsS0FBSyxFQUFFOU0sQ0FBRTtVQUNUK00sUUFBUSxFQUFHek0sQ0FBQyxJQUFLdVosV0FBVyxDQUFDeFQsQ0FBQyxDQUFDekMsRUFBRSxFQUFFMFcsQ0FBQyxDQUFDcmQsR0FBRyxFQUFFcUQsQ0FBQyxDQUFDME0sTUFBTSxDQUFDRixLQUFLO1FBQUUsR0FDN0R3TixDQUFDLENBQUN6QixPQUFPLENBQUNwVyxHQUFHLENBQUM4WCxDQUFDLGlCQUFJOWQsS0FBQSxDQUFBK0UsYUFBQTtVQUFRdkUsR0FBRyxFQUFFc2QsQ0FBRTtVQUFDek4sS0FBSyxFQUFFeU47UUFBRSxHQUFFQSxDQUFVLENBQUMsQ0FDdEQsQ0FDWCxFQUNBRCxDQUFDLENBQUN6TixJQUFJLEtBQUssUUFBUSxpQkFDaEJwUSxLQUFBLENBQUErRSxhQUFBO1VBQU9xTCxJQUFJLEVBQUMsUUFBUTtVQUFDL0ssU0FBUyxFQUFDLGFBQWE7VUFDckNnTCxLQUFLLEVBQUU5TSxDQUFFO1VBQ1QrTSxRQUFRLEVBQUd6TSxDQUFDLElBQUt1WixXQUFXLENBQUN4VCxDQUFDLENBQUN6QyxFQUFFLEVBQUUwVyxDQUFDLENBQUNyZCxHQUFHLEVBQUUsQ0FBQ3FELENBQUMsQ0FBQzBNLE1BQU0sQ0FBQ0YsS0FBSztRQUFFLENBQUMsQ0FDdEUsRUFDQXdOLENBQUMsQ0FBQ3pOLElBQUksS0FBSyxNQUFNLGlCQUNkcFEsS0FBQSxDQUFBK0UsYUFBQTtVQUFPcUwsSUFBSSxFQUFDLE1BQU07VUFBQy9LLFNBQVMsRUFBQyxhQUFhO1VBQ25DZ0wsS0FBSyxFQUFFOU0sQ0FBRTtVQUNUK00sUUFBUSxFQUFHek0sQ0FBQyxJQUFLdVosV0FBVyxDQUFDeFQsQ0FBQyxDQUFDekMsRUFBRSxFQUFFMFcsQ0FBQyxDQUFDcmQsR0FBRyxFQUFFcUQsQ0FBQyxDQUFDME0sTUFBTSxDQUFDRixLQUFLO1FBQUUsQ0FBQyxDQUNyRSxFQUNBd04sQ0FBQyxDQUFDek4sSUFBSSxLQUFLLFFBQVEsaUJBQ2hCcFEsS0FBQSxDQUFBK0UsYUFBQTtVQUFRTyxPQUFPLEVBQUVBLENBQUEsS0FBTThYLFdBQVcsQ0FBQ3hULENBQUMsQ0FBQ3pDLEVBQUUsRUFBRTBXLENBQUMsQ0FBQ3JkLEdBQUcsRUFBRSxDQUFDK0MsQ0FBQyxDQUFFO1VBQzVDOEIsU0FBUyx3S0FBQXlDLE1BQUEsQ0FDSHZFLENBQUMsR0FDRyxpREFBaUQsR0FDakQsOENBQThDO1FBQUcsR0FDOURBLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FDUixDQUVYLENBQUM7TUFFZCxDQUFDLENBQ0EsQ0FDUixlQUNEdkQsS0FBQSxDQUFBK0UsYUFBQTtRQUFLTSxTQUFTLEVBQUM7TUFBeUUsZ0JBQ3BGckYsS0FBQSxDQUFBK0UsYUFBQTtRQUFRTyxPQUFPLEVBQUVBLENBQUEsS0FBTTtVQUNYO1VBQ0FKLE1BQU0sQ0FBQ3FFLENBQUMsSUFBSTtZQUNSLElBQU1vSyxJQUFJLEdBQUE3TyxhQUFBLEtBQVN5RSxDQUFDLENBQUNnVSxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUc7WUFDcEMsT0FBTzVKLElBQUksQ0FBQy9KLENBQUMsQ0FBQ3pDLEVBQUUsQ0FBQztZQUNqQixPQUFBckMsYUFBQSxDQUFBQSxhQUFBLEtBQVl5RSxDQUFDO2NBQUVnVSxNQUFNLEVBQUU1SjtZQUFJO1VBQy9CLENBQUMsQ0FBQztRQUNOLENBQUU7UUFDRnRPLFNBQVMsRUFBQztNQUFtSSxHQUNoSmxGLENBQUMsQ0FBQyxtQkFBbUIsQ0FDbEIsQ0FBQyxlQUNUSCxLQUFBLENBQUErRSxhQUFBO1FBQVFPLE9BQU8sRUFBRUEsQ0FBQSxLQUFNNlgsYUFBYSxDQUFDLElBQUksQ0FBRTtRQUNuQzlYLFNBQVMsRUFBQztNQUFrSCxHQUMvSGxGLENBQUMsQ0FBQyxTQUFTLENBQ1IsQ0FDUCxDQUNKLENBRVIsQ0FBQztJQUVkLENBQUMsQ0FDQSxDQUFDLGVBRU5ILEtBQUEsQ0FBQStFLGFBQUE7TUFBS00sU0FBUyxFQUFDO0lBQWdJLGdCQUMzSXJGLEtBQUEsQ0FBQStFLGFBQUE7TUFBS00sU0FBUyxFQUFDO0lBQWUsR0FBQyxRQUFNLENBQUMsZUFDdENyRixLQUFBLENBQUErRSxhQUFBO01BQUtNLFNBQVMsRUFBQztJQUFtQyxHQUFDLHdDQUEyQyxDQUFDLGVBQy9GckYsS0FBQSxDQUFBK0UsYUFBQTtNQUFLTSxTQUFTLEVBQUM7SUFBaUMsR0FBQyxtREFBaUQsQ0FDakcsQ0FDRyxDQUFDO0VBRXJCOztFQUVBO0FBQ0E7QUFDQTtFQUNBLFNBQVMrVSxVQUFVQSxDQUFBMkQsTUFBQSxFQUEyRTtJQUFBLElBQXhFMUQsS0FBSyxHQUFBMEQsTUFBQSxDQUFMMUQsS0FBSztNQUFFQyxRQUFRLEdBQUF5RCxNQUFBLENBQVJ6RCxRQUFRO01BQUEwRCxhQUFBLEdBQUFELE1BQUEsQ0FBRWxkLE1BQU07TUFBTkEsTUFBTSxHQUFBbWQsYUFBQSxjQUFDLFFBQVEsR0FBQUEsYUFBQTtNQUFFL1YsT0FBTyxHQUFBOFYsTUFBQSxDQUFQOVYsT0FBTztNQUFFN0MsTUFBTSxHQUFBMlksTUFBQSxDQUFOM1ksTUFBTTtNQUFBNlksV0FBQSxHQUFBRixNQUFBLENBQUVoVixJQUFJO01BQUpBLElBQUksR0FBQWtWLFdBQUEsY0FBQyxFQUFFLEdBQUFBLFdBQUE7TUFBRUMsUUFBUSxHQUFBSCxNQUFBLENBQVJHLFFBQVE7SUFDdEYsSUFBTUMsUUFBUSxHQUFHO01BQ2JDLE1BQU0sRUFBQyxTQUFTO01BQUVDLEtBQUssRUFBQyxTQUFTO01BQUVDLE9BQU8sRUFBQyxTQUFTO01BQUVDLElBQUksRUFBQztJQUMvRCxDQUFDO0lBQ0QsSUFBTWhWLENBQUMsR0FBRzRVLFFBQVEsQ0FBQ3RkLE1BQU0sQ0FBQyxJQUFJLFNBQVM7SUFDdkMsSUFBTTJkLE9BQU8sR0FBRztNQUNaQyxJQUFJLEVBQUUsV0FBVztNQUNqQnpZLEdBQUcsRUFBRyxXQUFXO01BQ2pCMkUsR0FBRyxFQUFHO0lBQ1YsQ0FBQztJQUNELElBQU1sRixLQUFLLEdBQUcrWSxPQUFPLENBQUN6VixJQUFJLENBQUMsSUFBSSxVQUFVO0lBQ3pDLG9CQUNJL0ksS0FBQSxDQUFBK0UsYUFBQTtNQUFLTSxTQUFTLEVBQUMsb0VBQW9FO01BQUNDLE9BQU8sRUFBRTJDO0lBQVEsZ0JBSWpHakksS0FBQSxDQUFBK0UsYUFBQTtNQUFLTSxTQUFTLDhDQUFBeUMsTUFBQSxDQUE4Q3JDLEtBQUssZ0NBQThCO01BQzFGSCxPQUFPLEVBQUd6QixDQUFDLElBQUtBLENBQUMsQ0FBQzBYLGVBQWUsQ0FBQyxDQUFFO01BQ3BDL1YsS0FBSyxFQUFFO1FBQUNxSixXQUFXLEtBQUEvRyxNQUFBLENBQUl5QixDQUFDLE9BQUk7UUFBRW1WLFNBQVMsRUFBRTtNQUFNO0lBQUUsZ0JBQ2xEMWUsS0FBQSxDQUFBK0UsYUFBQTtNQUFLTSxTQUFTLEVBQUM7SUFBaUYsZ0JBQzVGckYsS0FBQSxDQUFBK0UsYUFBQSwyQkFDSS9FLEtBQUEsQ0FBQStFLGFBQUE7TUFBSU0sU0FBUyxFQUFDLDhDQUE4QztNQUFDRyxLQUFLLEVBQUU7UUFBQ2dELEtBQUssRUFBQ2U7TUFBQztJQUFFLEdBQUU4USxLQUFVLENBQUMsZUFDM0ZyYSxLQUFBLENBQUErRSxhQUFBO01BQUdNLFNBQVMsRUFBQztJQUE2QixHQUFFaVYsUUFBWSxDQUN2RCxDQUFDLGVBQ050YSxLQUFBLENBQUErRSxhQUFBO01BQVEsZUFBWSxhQUFhO01BQUNPLE9BQU8sRUFBRTJDLE9BQVE7TUFBQzVDLFNBQVMsRUFBQztJQUF1RCxHQUFDLE1BQVMsQ0FDOUgsQ0FBQyxlQUNOckYsS0FBQSxDQUFBK0UsYUFBQTtNQUFLTSxTQUFTLEVBQUM7SUFBMEMsR0FDcEQ2WSxRQUNBLENBQUMsZUFDTmxlLEtBQUEsQ0FBQStFLGFBQUE7TUFBS00sU0FBUyxFQUFDO0lBQTZHLGdCQUN4SHJGLEtBQUEsQ0FBQStFLGFBQUE7TUFBUSxlQUFZLGNBQWM7TUFBQ08sT0FBTyxFQUFFMkMsT0FBUTtNQUM1QzVDLFNBQVMsRUFBQztJQUEwSSxHQUN2SmxGLENBQUMsQ0FBQyxRQUFRLENBQ1AsQ0FBQyxlQUNUSCxLQUFBLENBQUErRSxhQUFBO01BQVEsZUFBWSxZQUFZO01BQUNPLE9BQU8sRUFBRUYsTUFBTztNQUN6Q0MsU0FBUyxFQUFDLDhFQUE4RTtNQUN4RkcsS0FBSyxFQUFFO1FBQUNPLFVBQVUsRUFBQ3dELENBQUM7UUFBRVQsU0FBUyxjQUFBaEIsTUFBQSxDQUFheUIsQ0FBQztNQUFJO0lBQUUsR0FDdERwSixDQUFDLENBQUMsZ0JBQWdCLENBQ2YsQ0FDUCxDQUNKLENBQ0osQ0FBQztFQUVkOztFQUVBO0VBQ0F3ZSxRQUFRLENBQUNDLFVBQVUsQ0FBQzNMLFFBQVEsQ0FBQzRMLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDQyxNQUFNLGNBQUM5ZSxLQUFBLENBQUErRSxhQUFBLENBQUNoRSxHQUFHLE1BQUMsQ0FBQyxDQUFDO0FBQ25FLENBQUMsRUFBRSxDQUFDIiwiaWdub3JlTGlzdCI6W119