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
    var _useState9 = useState(() => {
        var facing = 'auto';
        try {
          var v = localStorage.getItem('red5.building_facing');
          if (v && ['auto', 'N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'].indexOf(v) >= 0) facing = v;
        } catch (e) {}
        return {
          siteName: 'My Building',
          city: 'Toronto, ON',
          lat: 43.6532,
          lon: -79.3832,
          buildingFacing: facing
        };
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
          var facing = j.building_facing;
          if (facing && ['auto', 'N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'].indexOf(facing) >= 0) {
            setCfg(c => _objectSpread(_objectSpread({}, c), {}, {
              buildingFacing: facing
            }));
            try {
              localStorage.setItem('red5.building_facing', facing);
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
          var facing = cfg.buildingFacing || 'auto';
          localStorage.setItem('red5.building_facing', facing);
        } catch (e) {/* private mode -- ignore */}
        var persisted = false,
          warning = '';
        try {
          var _facing = cfg.buildingFacing || 'auto';
          var r = yield fetch('/api/weather-location', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              active: loc,
              default: loc,
              saved: nextSaved,
              building_facing: _facing
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
              saved: nextSaved,
              building_facing: cfg.buildingFacing || 'auto'
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
    }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "field-label mb-1.5"
    }, "ASPECT \u2014 Building facing"), /*#__PURE__*/React.createElement("select", {
      className: "field-input",
      "data-testid": "loc-building-facing",
      value: cfg.buildingFacing || 'auto',
      onChange: e => setCfg(_objectSpread(_objectSpread({}, cfg), {}, {
        buildingFacing: e.target.value
      })),
      title: "Compass direction the main fa\xE7ade faces outward"
    }, /*#__PURE__*/React.createElement("option", {
      value: "auto"
    }, "Auto (by hemisphere)"), /*#__PURE__*/React.createElement("option", {
      value: "N"
    }, "N \u2014 North"), /*#__PURE__*/React.createElement("option", {
      value: "NE"
    }, "NE \u2014 Northeast"), /*#__PURE__*/React.createElement("option", {
      value: "E"
    }, "E \u2014 East"), /*#__PURE__*/React.createElement("option", {
      value: "SE"
    }, "SE \u2014 Southeast"), /*#__PURE__*/React.createElement("option", {
      value: "S"
    }, "S \u2014 South"), /*#__PURE__*/React.createElement("option", {
      value: "SW"
    }, "SW \u2014 Southwest"), /*#__PURE__*/React.createElement("option", {
      value: "W"
    }, "W \u2014 West"), /*#__PURE__*/React.createElement("option", {
      value: "NW"
    }, "NW \u2014 Northwest")), /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] text-slate-500 mt-1.5 leading-snug"
    }, "NH default \u2192 South \xB7 SH default \u2192 North. Used for sun-path / window glow orientation.")), /*#__PURE__*/React.createElement("button", {
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBfd2Fsay5jb21waWxlZC5qcyIsIm5hbWVzIjpbIl9SZWFjdCIsIlJlYWN0IiwidXNlU3RhdGUiLCJ1c2VNZW1vIiwidCIsImsiLCJ3aW5kb3ciLCJ1c2VMYW5nIiwiU1RFUFMiLCJrZXkiLCJsYWJlbEtleSIsInN1YktleSIsImtpbmQiLCJpY29uQ29sb3IiLCJhY2NlbnQiLCJocmVmIiwiQXBwIiwiX3VzZVN0YXRlIiwicHN5IiwibG9jYXRpb24iLCJsYW5ndWFnZSIsInBsdWdpbnMiLCJyZXBhaXIiLCJfdXNlU3RhdGUyIiwiX3NsaWNlZFRvQXJyYXkiLCJkb25lIiwic2V0RG9uZSIsIl91c2VTdGF0ZTMiLCJfdXNlU3RhdGU0Iiwicm91dGUiLCJzZXRSb3V0ZSIsIl91c2VTdGF0ZTUiLCJfdXNlU3RhdGU2IiwibW9kYWwiLCJzZXRNb2RhbCIsIl91c2VTdGF0ZTciLCJnaXZvbmkiLCJyaFByZXNldCIsInJoTG8iLCJyaEhpIiwidExvIiwidEhpIiwidGhlbWUiLCJkYXJrTGV2ZWwiLCJfdXNlU3RhdGU4IiwicHN5Q2ZnIiwic2V0UHN5Q2ZnIiwiX3VzZVN0YXRlOSIsImZhY2luZyIsInYiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiaW5kZXhPZiIsImUiLCJzaXRlTmFtZSIsImNpdHkiLCJsYXQiLCJsb24iLCJidWlsZGluZ0ZhY2luZyIsIl91c2VTdGF0ZTAiLCJsb2NDZmciLCJzZXRMb2NDZmciLCJfdXNlU3RhdGUxIiwiYWxsb3dlZCIsImxhbmciLCJfdXNlU3RhdGUxMCIsImxhbmdDZmciLCJzZXRMYW5nQ2ZnIiwiX3VzZVN0YXRlMTEiLCJlbmFibGVkIiwiX3VzZVN0YXRlMTIiLCJwbHVnaW5DZmciLCJzZXRQbHVnaW5DZmciLCJjb21wbGV0ZUNvdW50IiwiT2JqZWN0IiwidmFsdWVzIiwiZmlsdGVyIiwiQm9vbGVhbiIsImxlbmd0aCIsImZpbmlzaCIsImQiLCJfb2JqZWN0U3ByZWFkIiwiY3JlYXRlRWxlbWVudCIsIlBzeUNoYXJ0U2V0dGluZ1BhZ2UiLCJjZmciLCJzZXRDZmciLCJvbkJhY2siLCJvblNhdmUiLCJjbGFzc05hbWUiLCJvbkNsaWNrIiwic2V0SXRlbSIsInN0eWxlIiwid2lkdGgiLCJhc3BlY3RSYXRpbyIsImFuaW1hdGlvbkRlbGF5Iiwic3JjIiwiYWx0Iiwib3BhY2l0eSIsImJhY2tncm91bmQiLCJtYXAiLCJzIiwiaSIsImFuZ2xlRGVnIiwiYW5nbGUiLCJNYXRoIiwiUEkiLCJyIiwieCIsImNvcyIsInkiLCJzaW4iLCJDaXJjbGVUaWxlIiwic3RlcCIsImluZGV4IiwibGVmdFBjdCIsInRvcFBjdCIsInZpZXdCb3giLCJwcmVzZXJ2ZUFzcGVjdFJhdGlvIiwiaWQiLCJtYXNrVW5pdHMiLCJoZWlnaHQiLCJmaWxsIiwiXyIsImEiLCJjeCIsImN5Iiwic3Ryb2tlIiwic3Ryb2tlV2lkdGgiLCJtYXNrIiwiY29uY2F0IiwidGV4dFNoYWRvdyIsIkxvY2F0aW9uTW9kYWwiLCJvbkNsb3NlIiwiTGFuZ3VhZ2VNb2RhbCIsIlBsdWdpbnNNb2RhbCIsIlRpbGUiLCJfcmVmIiwiYm9yZGVyIiwiVGlsZUljb24iLCJjb2xvciIsIl9yZWYyIiwicmluZ0NvbG9yIiwibGVmdCIsInRvcCIsInRyYW5zZm9ybSIsImJveFNoYWRvdyIsInNpemUiLCJfcmVmMyIsIl9yZWYzJHNpemUiLCJzdHJva2VMaW5lY2FwIiwic3Ryb2tlTGluZWpvaW4iLCJfZXh0ZW5kcyIsIl9yZWY0IiwidXBkYXRlIiwiYyIsInVzZUVmZmVjdCIsInJhdyIsInByZXNldCIsInBhdGNoIiwicCIsIkpTT04iLCJwYXJzZSIsIk51bWJlciIsImlzRmluaXRlIiwibG8iLCJoaSIsIlJIX1BSRVNFVFMiLCJmaW5kIiwidGgiLCJkbCIsInBhcnNlRmxvYXQiLCJ0clJhdyIsInRyIiwibWluIiwibWF4Iiwia2V5cyIsInBlcnNpc3RBbmRTYXZlIiwic3RyaW5naWZ5IiwiU3RyaW5nIiwiZGlzcGF0Y2hFdmVudCIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwiYXBwbHlUb0FsbEFodXMiLCJjb25zb2xlIiwiaW5mbyIsIndhcm4iLCJQc3lTa2VsZXRvbiIsIlBzeUNvbnRyb2xQYW5lbCIsImxhYmVsIiwibm90ZSIsIl9yZWY1IiwiVyIsIkgiLCJwYWQiLCJyaWdodCIsImJvdHRvbSIsImdyaWRXIiwiZ3JpZEgiLCJUX01JTiIsIlRfTUFYIiwiV19NSU4iLCJXX01BWCIsInciLCJfZ2V0VyIsImdldFciLCJyaCIsInNhZmVQdHMiLCJhcnIiLCJ0b0ZpeGVkIiwiam9pbiIsInJoODAiLCJwdXNoIiwicmgxMDAiLCJyaDIwTGluZSIsInJoMjBfQ1oiLCJDWiIsInJoSGlfdG9wIiwidHQiLCJyaExvX2JvdCIsIlNXRUVUIiwiTlYiLCJNYXNzIiwiTUNWIiwiRVZBUCIsIndpbnRlclJIODAiLCJ3aW50ZXJSSDIwIiwiV0lOVEVSIiwiaXNvcGxldGhzIiwiaXNMaWdodCIsInBhbGV0dGUiLCJiZyIsImdyaWQiLCJ0aWNrIiwiYXhpcyIsInBhbmVsQmciLCJwYW5lbEJvcmRlciIsInBpbGxCZyIsInBpbGxGZyIsIm1ldGFGZyIsImRpbUZpbHRlciIsImJvcmRlckNvbG9yIiwiYm9yZGVyUmFkaXVzIiwiQXJyYXkiLCJmcm9tIiwieDEiLCJ5MSIsIngyIiwieTIiLCJmb250U2l6ZSIsInRleHRBbmNob3IiLCJwdHMiLCJ3dyIsInBvaW50cyIsInN0cm9rZURhc2hhcnJheSIsImZsb29yIiwiZm9udFdlaWdodCIsImZpbGxPcGFjaXR5IiwiY2xpcFBhdGhVbml0cyIsImNsaXBQYXRoIiwibGV0dGVyU3BhY2luZyIsInBhaW50T3JkZXIiLCJfcmVmNiIsInJvdW5kIiwidHlwZSIsInZhbHVlIiwib25DaGFuZ2UiLCJ0YXJnZXQiLCJhY2NlbnRDb2xvciIsIl9ub3JtYWxpemVMb2NzIiwic2VlbiIsIlNldCIsIm91dCIsImwiLCJuYW1lIiwidHJpbSIsImhhcyIsImFkZCIsIl9yZWY3IiwibWFwQm94UmVmIiwidXNlUmVmIiwibWFwUmVmIiwibWFya2VyUmVmIiwiX1JlYWN0JHVzZVN0YXRlIiwiX1JlYWN0JHVzZVN0YXRlMiIsImdlb0J1c3kiLCJzZXRHZW9CdXN5IiwiX1JlYWN0JHVzZVN0YXRlMyIsImlzQXJyYXkiLCJfUmVhY3QkdXNlU3RhdGU0Iiwic2F2ZWRMb2NzIiwic2V0U2F2ZWRMb2NzIiwiY2FuY2VsbGVkIiwiX2FzeW5jVG9HZW5lcmF0b3IiLCJmZXRjaCIsImNyZWRlbnRpYWxzIiwiY2FjaGUiLCJvayIsImoiLCJqc29uIiwic2F2ZWQiLCJidWlsZGluZ19mYWNpbmciLCJfUmVhY3QkdXNlU3RhdGU1IiwiX1JlYWN0JHVzZVN0YXRlNiIsInNhdmVkT3BlbiIsInNldFNhdmVkT3BlbiIsInNhdmVkUmVmIiwib25Eb2NDbGljayIsImN1cnJlbnQiLCJjb250YWlucyIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJvblNpdGVOYW1lQ2hhbmdlIiwibmV3TmFtZSIsImhpdCIsInNldFZpZXciLCJwaWNrU2F2ZWRMb2MiLCJsb2MiLCJyZW1vdmVTYXZlZExvYyIsIm5leHQiLCJtZXRob2QiLCJoZWFkZXJzIiwiYm9keSIsImNhdGNoIiwicmVuYW1lU2F2ZWRMb2MiLCJvcmlnTG9jIiwicHJldiIsInN0aWxsU2VsZWN0ZWQiLCJhYnMiLCJfUmVhY3QkdXNlU3RhdGU3IiwiX1JlYWN0JHVzZVN0YXRlOCIsInNlYXJjaFEiLCJzZXRTZWFyY2hRIiwiX1JlYWN0JHVzZVN0YXRlOSIsIl9SZWFjdCR1c2VTdGF0ZTAiLCJzZWFyY2hIaXRzIiwic2V0U2VhcmNoSGl0cyIsIl9SZWFjdCR1c2VTdGF0ZTEiLCJfUmVhY3QkdXNlU3RhdGUxMCIsInNlYXJjaEJ1c3kiLCJzZXRTZWFyY2hCdXN5IiwiX1JlYWN0JHVzZVN0YXRlMTEiLCJfUmVhY3QkdXNlU3RhdGUxMiIsInNlYXJjaE9wZW4iLCJzZXRTZWFyY2hPcGVuIiwic2VhcmNoRGVib3VuY2VSZWYiLCJydW5TZWFyY2giLCJfcmVmOSIsInEiLCJ1cmwiLCJlbmNvZGVVUklDb21wb25lbnQiLCJfeCIsImFwcGx5IiwiYXJndW1lbnRzIiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsInBpY2tTZWFyY2hIaXQiLCJkaXNwbGF5X25hbWUiLCJyZXZlcnNlR2VvY29kZSIsIl9yZWYwIiwiYWRkcmVzcyIsInRvd24iLCJ2aWxsYWdlIiwiaGFtbGV0IiwiY291bnR5IiwicmVnaW9uIiwic3RhdGUiLCJjb3VudHJ5IiwiX3gyIiwiX3gzIiwiTCIsInpvb21Db250cm9sIiwiYXR0cmlidXRpb25Db250cm9sIiwidGlsZUxheWVyIiwibWF4Wm9vbSIsImF0dHJpYnV0aW9uIiwiYWRkVG8iLCJtYXJrZXIiLCJkcmFnZ2FibGUiLCJiaW5kVG9vbHRpcCIsInBlcm1hbmVudCIsImFwcGx5TGF0TG9uIiwibiIsIm9uIiwibGwiLCJnZXRMYXRMbmciLCJsbmciLCJzZXRMYXRMbmciLCJsYXRsbmciLCJpbnZhbGlkYXRlU2l6ZSIsInJlbW92ZSIsInBhblRvIiwiX1JlYWN0JHVzZVN0YXRlMTMiLCJfUmVhY3QkdXNlU3RhdGUxNCIsImdlb1N0YXRlIiwic2V0R2VvU3RhdGUiLCJ1c2VNeUxvY2F0aW9uIiwibmF2aWdhdG9yIiwiZ2VvbG9jYXRpb24iLCJlcnIiLCJnZXRDdXJyZW50UG9zaXRpb24iLCJwb3MiLCJjb29yZHMiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsIm1zZyIsImNvZGUiLCJtZXNzYWdlIiwiZW5hYmxlSGlnaEFjY3VyYWN5IiwidGltZW91dCIsIm1heGltdW1BZ2UiLCJfUmVhY3QkdXNlU3RhdGUxNSIsIl9SZWFjdCR1c2VTdGF0ZTE2Iiwic2F2ZU1zZyIsInNldFNhdmVNc2ciLCJfcmVmMSIsImRlZHVwZWQiLCJuZXh0U2F2ZWQiLCJzbGljZSIsInBlcnNpc3RlZCIsIndhcm5pbmciLCJhY3RpdmUiLCJkZWZhdWx0IiwiX2xhc3RXZWF0aGVyTG9jYXRpb25TYXZlIiwiTW9kYWxTaGVsbCIsInRpdGxlIiwic3VidGl0bGUiLCJtaW5IZWlnaHQiLCJyZWYiLCJvdmVyZmxvdyIsIm9uRm9jdXMiLCJwbGFjZWhvbGRlciIsIm91dGxpbmUiLCJoIiwicGxhY2VfaWQiLCJjbGFzcyIsInRyYW5zaXRpb24iLCJpc0FjdGl2ZSIsInJvd0tleSIsInJvbGUiLCJ0YWJJbmRleCIsIm9uS2V5RG93biIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwidHlwZWQiLCJjdXIiLCJjb25mbGljdCIsImRpc2FibGVkIiwicHJvdG9jb2wiLCJ6IiwiX3JlZjEwIiwibGFuZ3MiLCJuYXRpdmUiLCJFdmVudCIsIlBMVUdJTl9DT05GSUdfRklFTERTIiwid2VhdGhlciIsIm9wdGlvbnMiLCJkZWYiLCJzd2VldF9zcG90IiwiZzM2IiwiZGlidCIsImxpZ2h0aW5nIiwiX3JlZjExIiwiQUxMIiwiZGVzYyIsInZlciIsInRvZ2dsZSIsImluY2x1ZGVzIiwiX1JlYWN0JHVzZVN0YXRlMTciLCJfUmVhY3QkdXNlU3RhdGUxOCIsImV4cGFuZGVkSWQiLCJzZXRFeHBhbmRlZElkIiwidXBkYXRlRmllbGQiLCJwbHVnaW5JZCIsImZpZWxkS2V5IiwiZmllbGRzIiwiZmllbGRWYWwiLCJmaWVsZCIsInN0b3JlZCIsInVuZGVmaW5lZCIsImV4cGFuZGVkIiwiZiIsIm8iLCJfcmVmMTIiLCJfcmVmMTIkYWNjZW50IiwiX3JlZjEyJHNpemUiLCJjaGlsZHJlbiIsImNvbG9yTWFwIiwiaW5kaWdvIiwiYW1iZXIiLCJlbWVyYWxkIiwicGluayIsInNpemVNYXAiLCJ3aWRlIiwibWF4SGVpZ2h0IiwiUmVhY3RET00iLCJjcmVhdGVSb290IiwiZ2V0RWxlbWVudEJ5SWQiLCJyZW5kZXIiXSwic291cmNlcyI6WyIuLi9zcmMvc2V0dXAtd2Fsay9zZXR1cF93YWxrLmpzeCJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBXcmFwcGVkIGluIGFuIElJRkUgc28gdG9wLWxldmVsIGRlY2xhcmF0aW9ucyBzdGF5IGZ1bmN0aW9uLXNjb3BlZCBhbmQgZG9cbiAgIE5PVCBsZWFrIG9udG8gYHdpbmRvd2AuICBUaGlzIGJ1bmRsZSBpcyBsb2FkZWQgYXMgYSBDTEFTU0lDIDxzY3JpcHQ+LCB3aGVyZVxuICAgYSB0b3AtbGV2ZWwgYHZhciBmb29gICh3aGF0IEJhYmVsIGNvbXBpbGVzIGBjb25zdCBmb29gIGRvd24gdG8pIHdvdWxkIGJlY29tZVxuICAgYHdpbmRvdy5mb29gLiAgV2l0aG91dCB0aGlzIHdyYXBwZXIsIHRoZSBsb2NhbCBgdGAvYHVzZUxhbmdgIGhlbHBlcnMgYmVsb3dcbiAgIG92ZXJ3cml0ZSB0aGUgcmVhbCBgd2luZG93LnRgL2B3aW5kb3cudXNlTGFuZ2AgZnJvbSBqcy9pMThuLmpzIGFuZCB0aGVuIGNhbGxcbiAgIHRoZW1zZWx2ZXMg4oaSIFwiTWF4aW11bSBjYWxsIHN0YWNrIHNpemUgZXhjZWVkZWRcIiAoYmxhbmsgc2NyZWVuKS4gKi9cbihmdW5jdGlvbiAoKSB7XG5jb25zdCB7IHVzZVN0YXRlLCB1c2VNZW1vIH0gPSBSZWFjdDtcblxuLyogaTE4biBoZWxwZXJzIOKAlCByZXNvbHZlIGFnYWluc3QgdGhlIHNoYXJlZCBkaWN0aW9uYXJ5IGluIGpzL2kxOG4uanNcbiAgIChsb2FkZWQgYnkgc2V0dXAuaHRtbCBiZWZvcmUgdGhpcyBidW5kbGUpLiAgdCgpIGZhbGxzIGJhY2sgdG8gdGhlIGtleVxuICAgaWYgaTE4bi5qcyBpcyBzb21laG93IGFic2VudDsgdXNlTGFuZygpIHN1YnNjcmliZXMgYSBjb21wb25lbnQgdG8gdGhlXG4gICBgbGFuZ2NoYW5nZWAgZXZlbnQgc28gdGhlIHdob2xlIHdpemFyZCByZS1yZW5kZXJzIChhbmQgcmUtdHJhbnNsYXRlcylcbiAgIHRoZSBpbnN0YW50IHRoZSBsYW5ndWFnZSBpcyBzd2l0Y2hlZC4gKi9cbmNvbnN0IHQgPSAoaykgPT4gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy50ID8gd2luZG93LnQoaykgOiBrKTtcbmNvbnN0IHVzZUxhbmcgPSAoKSA9PiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LnVzZUxhbmcgPyB3aW5kb3cudXNlTGFuZygpIDogbnVsbCk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFNURVAgREVGSU5JVElPTlMg4oCUIHRoZSA0IHdhbGsgcGF0aHMgdGhlIHVzZXIgZGVzY3JpYmVkXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5jb25zdCBTVEVQUyA9IFtcbiAgICAvKiBXYWxrIG9yZGVyIGlzIHRoZSBwZW50YWdvbiB0cmF2ZXJzYWw6IHRvcCDihpIgdXBwZXItcmlnaHQg4oaSIGxvd2VyLXJpZ2h0IOKGkiBsb3dlci1sZWZ0IOKGkiB1cHBlci1sZWZ0LlxuICAgICAgIExhYmVscyBpbnRlbnRpb25hbGx5IGRyb3AgdGhlIHJlZHVuZGFudCBcIlNldHRpbmdcIiBzdWZmaXggc28gdGhlXG4gICAgICAgbWFpbiBoZWFkaW5nIGluc2lkZSBlYWNoIGNpcmNsZSBjYW4gcmVuZGVyIGluIG9uZSBsaW5lIGF0IGEgbGFyZ2VyXG4gICAgICAgZm9udCB3ZWlnaHQuICBsYWJlbEtleS9zdWJLZXkgcmVzb2x2ZSB2aWEgdCgpIGF0IHJlbmRlciB0aW1lIHNvIHRoZXlcbiAgICAgICB0cmFjayB0aGUgYWN0aXZlIGxhbmd1YWdlLiAqL1xuICAgIHsga2V5Oidwc3knLCAgICAgIGxhYmVsS2V5Oidzd19zdGVwX3BzeScsICAgICAgc3ViS2V5Oidzd19zdGVwX3BzeV9zdWInLCAgICAgIGtpbmQ6J3BhZ2UnLCAgaWNvbkNvbG9yOicjODE4Y2Y4JywgYWNjZW50OidpbmRpZ28nIH0sXG4gICAgeyBrZXk6J2xvY2F0aW9uJywgbGFiZWxLZXk6J3N3X3N0ZXBfbG9jYXRpb24nLCBzdWJLZXk6J3N3X3N0ZXBfbG9jYXRpb25fc3ViJywga2luZDonbW9kYWwnLCBpY29uQ29sb3I6JyNmYmJmMjQnLCBhY2NlbnQ6J2FtYmVyJyAgfSxcbiAgICB7IGtleTonbGFuZ3VhZ2UnLCBsYWJlbEtleTonc3dfc3RlcF9sYW5ndWFnZScsIHN1YktleTonc3dfc3RlcF9sYW5ndWFnZV9zdWInLCBraW5kOidtb2RhbCcsIGljb25Db2xvcjonIzM0ZDM5OScsIGFjY2VudDonZW1lcmFsZCd9LFxuICAgIHsga2V5OidwbHVnaW5zJywgIGxhYmVsS2V5Oidzd19zdGVwX3BsdWdpbicsICAgc3ViS2V5Oidzd19zdGVwX3BsdWdpbl9zdWInLCAgIGtpbmQ6J21vZGFsJywgaWNvbkNvbG9yOicjZjQ3MmI2JywgYWNjZW50OidwaW5rJyAgIH0sXG4gICAgeyBrZXk6J3JlcGFpcicsICAgbGFiZWxLZXk6J3N3X3N0ZXBfcmVwYWlyJywgICBzdWJLZXk6J3N3X3N0ZXBfcmVwYWlyX3N1YicsICAga2luZDonbGluaycsICBpY29uQ29sb3I6JyNmYjcxODUnLCBhY2NlbnQ6J3Jvc2UnLCBocmVmOicvdXBkYXRlLmh0bWw/ZnJvbT1zZXR1cCcgfSxcbl07XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIFJPT1QgQVBQXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5mdW5jdGlvbiBBcHAoKSB7XG4gICAgdXNlTGFuZygpOyAgIC8vIHJlLXJlbmRlciB3aG9sZSB3aXphcmQgKGFuZCBhbGwgZGVzY2VuZGFudHMpIG9uIGxhbmd1YWdlIGNoYW5nZVxuICAgIC8qIGNvbXBsZXRpb24gKyBwZXItc3RlcCBjb25maWcgLS0gbW9ja3VwIHN0YXRlLCBuZXZlciBwZXJzaXN0ZWQgKi9cbiAgICBjb25zdCBbZG9uZSwgc2V0RG9uZV0gPSB1c2VTdGF0ZSh7IHBzeTpmYWxzZSwgbG9jYXRpb246ZmFsc2UsIGxhbmd1YWdlOmZhbHNlLCBwbHVnaW5zOmZhbHNlLCByZXBhaXI6ZmFsc2UgfSk7XG4gICAgY29uc3QgW3JvdXRlLCBzZXRSb3V0ZV0gPSB1c2VTdGF0ZSgnaHViJyk7ICAgLy8gJ2h1YicgfCAncHN5J1xuICAgIGNvbnN0IFttb2RhbCwgc2V0TW9kYWxdID0gdXNlU3RhdGUobnVsbCk7ICAgICAvLyAnbG9jYXRpb24nIHwgJ2xhbmd1YWdlJyB8ICdwbHVnaW5zJyB8IG51bGxcblxuICAgIGNvbnN0IFtwc3lDZmcsIHNldFBzeUNmZ10gICAgICAgICA9IHVzZVN0YXRlKHsgZ2l2b25pOnRydWUsIHJoUHJlc2V0OidvZmZpY2UnLCByaExvOjMwLCByaEhpOjYwLCB0TG86LTE1LCB0SGk6NTAsIHRoZW1lOidkYXJrJywgZGFya0xldmVsOjIuMCB9KTtcbiAgICBjb25zdCBbbG9jQ2ZnLCBzZXRMb2NDZmddICAgICAgICAgPSB1c2VTdGF0ZSgoKSA9PiB7XG4gICAgICAgIGxldCBmYWNpbmcgPSAnYXV0byc7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB2ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlZDUuYnVpbGRpbmdfZmFjaW5nJyk7XG4gICAgICAgICAgICBpZiAodiAmJiBbJ2F1dG8nLCdOJywnTkUnLCdFJywnU0UnLCdTJywnU1cnLCdXJywnTlcnXS5pbmRleE9mKHYpID49IDApIGZhY2luZyA9IHY7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgIHJldHVybiB7IHNpdGVOYW1lOidNeSBCdWlsZGluZycsIGNpdHk6J1Rvcm9udG8sIE9OJywgbGF0OjQzLjY1MzIsIGxvbjotNzkuMzgzMiwgYnVpbGRpbmdGYWNpbmc6IGZhY2luZyB9O1xuICAgIH0pO1xuICAgIGNvbnN0IFtsYW5nQ2ZnLCBzZXRMYW5nQ2ZnXSAgICAgICA9IHVzZVN0YXRlKCgpID0+IHtcbiAgICAgICAgLyogTGF6eSBpbml0IGZyb20gdGhlIHNhbWUgbG9jYWxTdG9yYWdlIGtleSB0aGUgZGFzaGJvYXJkIHJlYWRzLCBzb1xuICAgICAgICAgKiByZW9wZW5pbmcgdGhlIHNldHVwIHdhbGsgc2hvd3MgdGhlIGN1cnJlbnRseS1hY3RpdmUgbGFuZ3VhZ2VcbiAgICAgICAgICogcmF0aGVyIHRoYW4gYWx3YXlzIGRlZmF1bHRpbmcgdG8gRW5nbGlzaC4gKi9cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHYgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnaTE4bl9sYW5nJyk7XG4gICAgICAgICAgICBjb25zdCBhbGxvd2VkID0gWydlbicsJ3poLUNOJywnemgtVFcnLCdqYScsJ2tvJ107XG4gICAgICAgICAgICBpZiAodiAmJiBhbGxvd2VkLmluZGV4T2YodikgIT09IC0xKSByZXR1cm4geyBsYW5nOiB2IH07XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogcHJpdmF0ZSBtb2RlIC0+IGZhbGwgdGhyb3VnaCAqLyB9XG4gICAgICAgIHJldHVybiB7IGxhbmc6J2VuJyB9O1xuICAgIH0pO1xuICAgIGNvbnN0IFtwbHVnaW5DZmcsIHNldFBsdWdpbkNmZ10gICA9IHVzZVN0YXRlKHsgZW5hYmxlZDpbJ3dlYXRoZXInLCdnaXZvbmknLCdzd2VldF9zcG90J10gfSk7XG5cbiAgICBjb25zdCBjb21wbGV0ZUNvdW50ID0gT2JqZWN0LnZhbHVlcyhkb25lKS5maWx0ZXIoQm9vbGVhbikubGVuZ3RoO1xuXG4gICAgY29uc3QgZmluaXNoID0gKGtleSkgPT4ge1xuICAgICAgICBzZXREb25lKGQgPT4gKHsuLi5kLCBba2V5XTp0cnVlfSkpO1xuICAgICAgICBzZXRSb3V0ZSgnaHViJyk7XG4gICAgICAgIHNldE1vZGFsKG51bGwpO1xuICAgIH07XG5cbiAgICAvKiBmdWxsLXBhZ2UgUHN5IENoYXJ0IGVkaXRvciAqL1xuICAgIGlmIChyb3V0ZSA9PT0gJ3BzeScpIHtcbiAgICAgICAgcmV0dXJuIDxQc3lDaGFydFNldHRpbmdQYWdlIGNmZz17cHN5Q2ZnfSBzZXRDZmc9e3NldFBzeUNmZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQmFjaz17KCkgPT4gc2V0Um91dGUoJ2h1YicpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXsoKSA9PiBmaW5pc2goJ3BzeScpfSAvPjtcbiAgICB9XG5cbiAgICAvKiBkZWZhdWx0OiBIVUIgc2NyZWVuICovXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtaW4taC1zY3JlZW4gcHgtNiBweS04XCI+XG4gICAgICAgICAgICB7LyogLS0tLS0tLS0tLS0tLSBoZWFkZXIgLS0tLS0tLS0tLS0tLSAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctNXhsIG14LWF1dG8gZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIG1iLTEwIGZhZGUtdXBcIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwidGV4dC0yeGwgc206dGV4dC0zeGwgZm9udC1ibGFjayBpdGFsaWMgdXBwZXJjYXNlIHRyYWNraW5nLXRpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXJlZC01MDBcIj5SZWQ1PC9zcGFuPiA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlXCI+U3R1ZGlvPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgZm9udC1ub3JtYWwgaXRhbGljXCI+ICZuYnNwOy8mbmJzcDsgc2V0dXAgd2Fsazwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9oMT5cbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgdGV4dC14cyBtdC0xIGZvbnQtbW9ubyB0cmFja2luZy13aWRlXCI+e3QoJ3N3X3N1YnRpdGxlJyl9PC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIi9kYXNoYm9hcmQuaHRtbFwiXG4gICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHsgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDUuc2V0dXAuZG9uZScsJzEnKTsgfSBjYXRjaChlKXt9IH19XG4gICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS01MDAgaG92ZXI6dGV4dC1zbGF0ZS0zMDAgdW5kZXJsaW5lIHVuZGVybGluZS1vZmZzZXQtNFwiPnt0KCdzd19za2lwX2FsbCcpfTwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogLS0tLS0tLS0tLS0tLSBwZW50YWdvbiBsYXlvdXQgLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgIDUgY2lyY3VsYXIgdGlsZXMgYXJyYW5nZWQgYXQgdGhlIGNvcm5lcnMgb2YgYSByZWd1bGFyXG4gICAgICAgICAgICAgICAgcGVudGFnb24uICBQb2xhciBtYXRoczogYW5nbGUgc3RhcnRzIGF0IC05MGRlZyAodG9wKSBhbmRcbiAgICAgICAgICAgICAgICBzdGVwcyBieSArNzJkZWcgY2xvY2t3aXNlLiAgVGhlIGNvbnRhaW5lciBpcyBoZWlnaHQtbG9ja2VkXG4gICAgICAgICAgICAgICAgdmlhIGFzcGVjdCByYXRpbyBzbyB0aGUgcGVudGFnb24gc3RheXMgY2lyY3VsYXIgb24gZXZlcnlcbiAgICAgICAgICAgICAgICB2aWV3cG9ydC4gIFJhZGl1cyBpcyA0MCAlIG9mIHRoZSBjb250YWluZXIgaGFsZi1zaWRlLCBjaXJjbGVcbiAgICAgICAgICAgICAgICBkaWFtZXRlciB+MjcgJSBvZiB0aGUgY29udGFpbmVyIHdpZHRoIC0tIGdpdmVzIGEgY2xlYXJseVxuICAgICAgICAgICAgICAgIHZpc2libGUgZ2FwICh+MjggJSBvZiBjb250YWluZXIgd2lkdGgpIGJldHdlZW4gYWRqYWNlbnRcbiAgICAgICAgICAgICAgICBjaXJjbGVzIHJlZ2FyZGxlc3Mgb2Ygc2NyZWVuIHNpemUuICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBteC1hdXRvIGZhZGUtdXBcIlxuICAgICAgICAgICAgICAgICBzdHlsZT17eyB3aWR0aDonbWluKDc2MHB4LCA5MnZ3KScsIGFzcGVjdFJhdGlvOicxIC8gMScsIGFuaW1hdGlvbkRlbGF5OicuMDhzJyB9fT5cblxuICAgICAgICAgICAgICAgIHsvKiBCYWNrZ3JvdW5kIHBzeS1jaGFydCBsYXllciAtLSBzaXplZCB0byBmaWxsIHRoZSBjb25zdGVsbGF0aW9uXG4gICAgICAgICAgICAgICAgICAgIGNpcmNsZSAofjc4ICUgb2YgY29udGFpbmVyID0ganVzdCBpbnNpZGUgdGhlIGNvbnN0ZWxsYXRpb25cbiAgICAgICAgICAgICAgICAgICAgYXJjIHRoYXQgam9pbnMgdGhlIDUgdGlsZSBjZW50cmVzKS4gIFJlbmRlcmVkIEZJUlNUIHNvIHRoZVxuICAgICAgICAgICAgICAgICAgICA1IHRpbGUgY2lyY2xlcyAobmV4dCBpbiBET00pIHNpdCBvbiB0b3AgYW5kIG9ic2N1cmUgdGhlXG4gICAgICAgICAgICAgICAgICAgIHBvcnRpb24gb2YgdGhlIGNoYXJ0IHRoYXQgb3ZlcmxhcHMgdGhlbS4gIFRoYXQgZ2l2ZXMgdGhlXG4gICAgICAgICAgICAgICAgICAgIFwiaW1hZ2UgcmVjZWRlcyBiZWhpbmQgdGhlIDUgY2lyY2xlc1wiIGVmZmVjdC4gKi99XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBsZWZ0LTEvMiB0b3AtMS8yIC10cmFuc2xhdGUteC0xLzIgLXRyYW5zbGF0ZS15LTEvMiBwb2ludGVyLWV2ZW50cy1ub25lIG92ZXJmbG93LWhpZGRlbiByb3VuZGVkLWZ1bGxcIlxuICAgICAgICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7d2lkdGg6Jzc4JScsIGFzcGVjdFJhdGlvOicxLzEnfX0+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiL2FwaS9hc3NldHMvaW1nL3BzeV9zaWxob3VldHRlLmpwZ1wiIGFsdD1cIlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMCB3LWZ1bGwgaC1mdWxsIG9iamVjdC1jb3ZlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tvcGFjaXR5OjAuNzh9fSAvPlxuICAgICAgICAgICAgICAgICAgICB7LyogRGFyayB2aWduZXR0ZSAvIGxlbnMgLS0gcHVsbHMgdGhlIGNlbnRyZSBkb3duIHNvIHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgTi81IERPTkUgY291bnRlciB0aGF0IGxpdmVzIE9OIFRPUCBzdGF5cyByZWFkYWJsZS4gKi99XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOidyYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IGNlbnRlciwgcmdiYSgyLDYsMjMsMC42MCkgMCUsIHJnYmEoMiw2LDIzLDAuMzUpIDU1JSwgcmdiYSgyLDYsMjMsMC4xMCkgMTAwJSknfX0vPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAge1NURVBTLm1hcCgocywgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmdsZURlZyA9IC05MCArIGkgKiA3MjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5nbGUgPSBhbmdsZURlZyAqIE1hdGguUEkgLyAxODA7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHIgPSA0MDsgICAgICAgICAgICAgICAgICAgICAgICAvLyAlIG9mIGNvbnRhaW5lciBoYWxmLXNpZGVcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeCA9IDUwICsgciAqIE1hdGguY29zKGFuZ2xlKTsgIC8vICVcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeSA9IDUwICsgciAqIE1hdGguc2luKGFuZ2xlKTsgIC8vICVcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDaXJjbGVUaWxlIGtleT17cy5rZXl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGVwPXtzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZT17ZG9uZVtzLmtleV19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleD17aSsxfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdFBjdD17eH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcFBjdD17eX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocy5raW5kID09PSAncGFnZScpICAgICAgc2V0Um91dGUocy5rZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHMua2luZCA9PT0gJ2xpbmsnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNhbWUtdGFiIG5hdiBzbyB0aGUgcmV0dXJuIGJhZGdlIG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZS5odG1sIGNhbiBzaW1wbHkgd2luZG93LmxvY2F0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2sgaGVyZSB3aGVuIHRoZSBvcGVyYXRvciBpcyBkb25lLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHMuaHJlZjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgICAgICAgICAgICAgICAgICAgICAgc2V0TW9kYWwocy5rZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICB7LyogRGVjb3JhdGl2ZSByaW5nOiBhIHNpbmdsZSBjaXJjbGUgd2hvc2UgY2VudHJlIGNvaW5jaWRlc1xuICAgICAgICAgICAgICAgICAgICB3aXRoIHRoZSBjZW50cmUgb2YgdGhlIHBlbnRhZ29uIGFuZCB3aG9zZSByYWRpdXMgZXF1YWxzXG4gICAgICAgICAgICAgICAgICAgIHRoZSBwZW50YWdvbiB2ZXJ0ZXggcmFkaXVzIC0tIGl0cyBib3VuZGFyeSBwYXNzZXNcbiAgICAgICAgICAgICAgICAgICAgY2xlYW5seSB0aHJvdWdoIHRoZSBjZW50cmUgb2YgZWFjaCB0aWxlLiAgVGhlIG1hc2tcbiAgICAgICAgICAgICAgICAgICAgY3V0cyBvdXQgdGhlIGRpc2sgb2YgZXZlcnkgdGlsZSBjaXJjbGUgc28gdGhlIHJpbmcgaXNcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJsZSBPTkxZIGluIHRoZSBnYXBzIGJldHdlZW4gdGlsZXMsIG5ldmVyIGNyb3NzaW5nXG4gICAgICAgICAgICAgICAgICAgIGEgdGlsZSBpbnRlcmlvci4gKi99XG4gICAgICAgICAgICAgICAgPHN2ZyBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC0wIHctZnVsbCBoLWZ1bGwgcG9pbnRlci1ldmVudHMtbm9uZVwiXG4gICAgICAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDEwMCAxMDBcIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPVwibm9uZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGVmcz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxtYXNrIGlkPVwicGVudGFnb24tcmluZy1tYXNrXCIgbWFza1VuaXRzPVwidXNlclNwYWNlT25Vc2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeD1cIjBcIiB5PVwiMFwiIHdpZHRoPVwiMTAwXCIgaGVpZ2h0PVwiMTAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3QgeD1cIjBcIiB5PVwiMFwiIHdpZHRoPVwiMTAwXCIgaGVpZ2h0PVwiMTAwXCIgZmlsbD1cIndoaXRlXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7U1RFUFMubWFwKChfLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGEgPSAoLTkwICsgaSAqIDcyKSAqIE1hdGguUEkgLyAxODA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGN4ID0gNTAgKyA0MCAqIE1hdGguY29zKGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjeSA9IDUwICsgNDAgKiBNYXRoLnNpbihhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogMTcuNSAlIHJhZGl1cyA9IHNhbWUgYXMgdGhlIHRpbGUgY2lyY2xlJ3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFsZi13aWR0aCAoMzUgJSBkaWFtZXRlcik7ICswLjUgJSBudWRnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZWVwcyB0aGUgbWFzayBlZGdlIGluc2lkZSB0aGUgY29sb3VyZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmluZyBzbyB0aGUgd2hpdGUgYXJjIGRvZXNuJ3QgQUxNT1NULXRvdWNoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSByaW5nIGJvcmRlciB3aXRoIGFudGktYWxpYXNlZCBmcmluZ2UuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiA8Y2lyY2xlIGtleT17aX0gY3g9e2N4fSBjeT17Y3l9IHI9XCIxOFwiIGZpbGw9XCJibGFja1wiIC8+O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9tYXNrPlxuICAgICAgICAgICAgICAgICAgICA8L2RlZnM+XG4gICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgY3g9XCI1MFwiIGN5PVwiNTBcIiByPVwiNDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCJyZ2JhKDI1NSwyNTUsMjU1LDAuODUpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2VXaWR0aD1cIjAuNTZcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hc2s9XCJ1cmwoI3BlbnRhZ29uLXJpbmctbWFzaylcIiAvPlxuICAgICAgICAgICAgICAgIDwvc3ZnPlxuXG4gICAgICAgICAgICAgICAgey8qIENlbnRyZWQgY29tcGxldGlvbiBjb3VudGVyIC0tIHNpdHMgYXQgdGhlIGNlbnRyb2lkIG9mIHRoZVxuICAgICAgICAgICAgICAgICAgICBwZW50YWdvbiwgZm9udCB3ZWlnaHQgbWF0Y2hlZCB0byB0aGUgcGVyLXRpbGUgaGVhZGluZyBzbyB0aGVcbiAgICAgICAgICAgICAgICAgICAgZXllIHJlYWRzIGl0IGFzIHRoZSBkb21pbmFudCBzdGF0dXMuICBSZW5kZXJlZCBMQVNUIHNvIGl0XG4gICAgICAgICAgICAgICAgICAgIHNpdHMgb24gdG9wIG9mIGJvdGggdGhlIHBzeS1jaGFydCBzaWxob3VldHRlIGFuZCB0aGUgdGlsZVxuICAgICAgICAgICAgICAgICAgICBjaXJjbGVzLiAqL31cbiAgICAgICAgICAgICAgICB7LyogTi81IERPTkUgdGV4dCAtLSBvd24gYWJzb2x1dGUgbGF5ZXIgcmVuZGVyZWQgQUZURVIgdGhlXG4gICAgICAgICAgICAgICAgICAgIHRpbGUgY2lyY2xlcyBzbyBpdCBhbHdheXMgc2l0cyBvbiB0b3AuICovfVxuICAgICAgICAgICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJzZXR1cC1wcm9ncmVzcy1jZW50ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgbGVmdC0xLzIgdG9wLTEvMiAtdHJhbnNsYXRlLXgtMS8yIC10cmFuc2xhdGUteS0xLzIgdGV4dC1jZW50ZXIgcG9pbnRlci1ldmVudHMtbm9uZSBzZWxlY3Qtbm9uZVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YHRleHQtWzY2cHhdIHNtOnRleHQtWzc4cHhdIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXRpZ2h0IHdoaXRlc3BhY2Utbm93cmFwIGxlYWRpbmctbm9uZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Y29tcGxldGVDb3VudCA9PT0gNSA/ICd0ZXh0LWVtZXJhbGQtNDAwJyA6ICd0ZXh0LXdoaXRlJ31gfVxuICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7dGV4dFNoYWRvdzonMCA0cHggMjRweCByZ2JhKDIsNiwyMywwLjk1KSwgMCAwIDhweCByZ2JhKDIsNiwyMywwLjk1KSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZUNvdW50fS81XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzMwcHhdIHNtOnRleHQtWzMzcHhdIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLVswLjNlbV0gdGV4dC1zbGF0ZS0zMDAgbXQtM1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3t0ZXh0U2hhZG93OicwIDJweCAxMnB4IHJnYmEoMiw2LDIzLDAuOSknfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dCgnc3dfZG9uZScpfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogLS0tLS0tLS0tLS0tLSBmb290ZXIgQ1RBIC0tLS0tLS0tLS0tLS0gKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1heC13LTV4bCBteC1hdXRvIG10LTEwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBmYWRlLXVwXCIgc3R5bGU9e3thbmltYXRpb25EZWxheTonLjE4cyd9fT5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCB0ZXh0LXhzIGZvbnQtbW9ub1wiPlxuICAgICAgICAgICAgICAgICAgICB7Y29tcGxldGVDb3VudCA9PT0gMCAmJiB0KCdzd19mb290X3N0YXJ0Jyl9XG4gICAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZUNvdW50ID4gMCAmJiBjb21wbGV0ZUNvdW50IDwgNSAmJiBg4oaRICR7NSAtIGNvbXBsZXRlQ291bnR9ICR7dCgnc3dfc3RlcHNfcmVtYWluaW5nJyl9YH1cbiAgICAgICAgICAgICAgICAgICAge2NvbXBsZXRlQ291bnQgPT09IDUgJiYgdCgnc3dfZm9vdF9hbGxfZG9uZScpfVxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiL2Rhc2hib2FyZC5odG1sXCJcbiAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7IHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1LnNldHVwLmRvbmUnLCcxJyk7IH0gY2F0Y2goZSl7fSB9fVxuICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTcgcHktMyByb3VuZGVkLXhsIHRleHQtc20gZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2NvbXBsZXRlQ291bnQgPT09IDVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1lbWVyYWxkLTYwMCBob3ZlcjpiZy1lbWVyYWxkLTUwMCB0ZXh0LXdoaXRlIHNoYWRvdy1sZyBzaGFkb3ctZW1lcmFsZC01MDAvMzAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctaW5kaWdvLTYwMCBob3ZlcjpiZy1pbmRpZ28tNTAwIHRleHQtd2hpdGUgc2hhZG93LWxnIHNoYWRvdy1pbmRpZ28tNTAwLzIwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAge3QoJ3N3X29wZW5fZGFzaGJvYXJkJyl9XG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiAtLS0tLS0tLS0tLS0tIG1vZGFscyAtLS0tLS0tLS0tLS0tICovfVxuICAgICAgICAgICAge21vZGFsID09PSAnbG9jYXRpb24nICYmIDxMb2NhdGlvbk1vZGFsIGNmZz17bG9jQ2ZnfSBzZXRDZmc9e3NldExvY0NmZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldE1vZGFsKG51bGwpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXsoKSA9PiBmaW5pc2goJ2xvY2F0aW9uJyl9IC8+fVxuICAgICAgICAgICAge21vZGFsID09PSAnbGFuZ3VhZ2UnICYmIDxMYW5ndWFnZU1vZGFsIGNmZz17bGFuZ0NmZ30gc2V0Q2ZnPXtzZXRMYW5nQ2ZnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0TW9kYWwobnVsbCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNhdmU9eygpID0+IGZpbmlzaCgnbGFuZ3VhZ2UnKX0gLz59XG4gICAgICAgICAgICB7bW9kYWwgPT09ICdwbHVnaW5zJyAgJiYgPFBsdWdpbnNNb2RhbCAgY2ZnPXtwbHVnaW5DZmd9IHNldENmZz17c2V0UGx1Z2luQ2ZnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0TW9kYWwobnVsbCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNhdmU9eygpID0+IGZpbmlzaCgncGx1Z2lucycpfSAvPn1cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogVGlsZSAobGFyZ2UgZWFzeS1vbi1leWVzIGJ1dHRvbikgLS0ga2VwdCBmb3IgYmFjay1jb21wYXQsIG5vIGxvbmdlciB1c2VkXG4gKiBieSB0aGUgcGVudGFnb24gaHViLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuZnVuY3Rpb24gVGlsZSh7IHN0ZXAsIGRvbmUsIGluZGV4LCBvbkNsaWNrIH0pIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BzZXR1cC10aWxlLSR7c3RlcC5rZXl9YH1cbiAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXt0KHN0ZXAubGFiZWxLZXkpfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHRpbGUtYnRuIHJlbGF0aXZlIHRleHQtbGVmdCBiZy1zbGF0ZS05MDAvNzAgYm9yZGVyLTIgYm9yZGVyLXNsYXRlLTcwMC83MFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdW5kZWQtMnhsIHAtNiBzbTpwLTcgJHtkb25lID8gJ2RvbmUnIDogJyd9YH0+XG4gICAgICAgICAgICB7ZG9uZSAmJiA8c3BhbiBjbGFzc05hbWU9XCJjaGVja1wiIGRhdGEtdGVzdGlkPXtgc2V0dXAtdGlsZS0ke3N0ZXAua2V5fS1kb25lYH0+4pyTPC9zcGFuPn1cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTQgbWItM1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy0xMiBoLTEyIHJvdW5kZWQteGwgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOmAke3N0ZXAuaWNvbkNvbG9yfTIyYCwgYm9yZGVyOmAxcHggc29saWQgJHtzdGVwLmljb25Db2xvcn01NWB9fT5cbiAgICAgICAgICAgICAgICAgICAgPFRpbGVJY29uIGtpbmQ9e3N0ZXAua2V5fSBjb2xvcj17c3RlcC5pY29uQ29sb3J9IC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LTN4bCBmb250LWJsYWNrIHRleHQtc2xhdGUtNzAwXCI+MHtpbmRleH08L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtbGcgc206dGV4dC14bCBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlciBtYi0xXCJcbiAgICAgICAgICAgICAgICBzdHlsZT17e2NvbG9yOnN0ZXAuaWNvbkNvbG9yfX0+e3Qoc3RlcC5sYWJlbEtleSl9PC9oMz5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNDAwIHRleHQtc20gbGVhZGluZy1zbnVnXCI+e3Qoc3RlcC5zdWJLZXkpfTwvcD5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNCBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiB0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTUwMFwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInBpbGwgYmctc2xhdGUtODAwIHRleHQtc2xhdGUtNDAwXCI+e3N0ZXAua2luZCA9PT0gJ3BhZ2UnID8gdCgnc3dfZnVsbF9wYWdlJykgOiB0KCdzd19wb3B1cCcpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICB7ZG9uZSAmJiA8c3BhbiBjbGFzc05hbWU9XCJwaWxsIGJnLWVtZXJhbGQtOTAwLzQwIHRleHQtZW1lcmFsZC00MDBcIj57dCgnc3dfY29uZmlndXJlZCcpfTwvc3Bhbj59XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ2lyY2xlVGlsZSAtLSBwZW50YWdvbi1jb3JuZXIgcm91bmQgYnV0dG9uLiAgU2l6ZWQgaW4gJSBvZiBpdHMgY29udGFpbmVyXG4gKiBzbyB0aGUgd2hvbGUgbGF5b3V0IHNjYWxlcyB3aXRoIHZpZXdwb3J0LiAgRWFjaCBjaXJjbGUgaXMgYW5jaG9yZWQgYnkgaXRzXG4gKiBjZW50cmUgKHRyYW5zbGF0ZSAtNTAlLy01MCUpIG9uIHRoZSBwb2xhci1jb21wdXRlZCAobGVmdCUsIHRvcCUpLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuZnVuY3Rpb24gQ2lyY2xlVGlsZSh7IHN0ZXAsIGRvbmUsIGluZGV4LCBsZWZ0UGN0LCB0b3BQY3QsIG9uQ2xpY2sgfSkge1xuICAgIC8qIFRoaWNrIGNvbG91cmVkIHJpbmcgcGVyIHRpbGUgLS0gZWFjaCBzdGVwIGtlZXBzIGl0cyBhY2NlbnQgY29sb3VyXG4gICAgICogKGluZGlnby9hbWJlci9lbWVyYWxkL3Bpbmsvcm9zZSksIHJlaW5mb3JjaW5nIHRoZSBjb2xvdXItY29kZWQgU1ZHXG4gICAgICogaWNvbiBhbmQgdGhlIGhlYWRpbmcgdGV4dC4gKi9cbiAgICBjb25zdCByaW5nQ29sb3IgPSBzdGVwLmljb25Db2xvcjtcbiAgICByZXR1cm4gKFxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BzZXR1cC10aWxlLSR7c3RlcC5rZXl9YH1cbiAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXt0KHN0ZXAubGFiZWxLZXkpfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YGNpcmNsZS10aWxlIGdyb3VwIGFic29sdXRlIHJvdW5kZWQtZnVsbCB0ZXh0LWNlbnRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tMjAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtkb25lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLXNsYXRlLTkwMCBzaGFkb3ctWzBfMF8zMHB4Xy02cHhfcmdiYSgxNiwxODUsMTI5LDAuNTUpXSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctc2xhdGUtOTAwIGhvdmVyOmJnLXNsYXRlLTgwMCd9YH1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBsZWZ0OmAke2xlZnRQY3R9JWAsIHRvcDpgJHt0b3BQY3R9JWAsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOidtaW4oMzUlLCAyNjBweCknLCBhc3BlY3RSYXRpbzonMS8xJyxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOid0cmFuc2xhdGUoLTUwJSwgLTUwJSknLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6YDEwcHggc29saWQgJHtyaW5nQ29sb3J9YCxcbiAgICAgICAgICAgICAgICAgICAgYm94U2hhZG93OmAwIDAgMCAxcHggJHtyaW5nQ29sb3J9MzMsIDAgOHB4IDI4cHggLThweCAke3JpbmdDb2xvcn01NWAsXG4gICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICB7ZG9uZSAmJiAoXG4gICAgICAgICAgICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9e2BzZXR1cC10aWxlLSR7c3RlcC5rZXl9LWRvbmVgfVxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIC10b3AtMSAtcmlnaHQtMSB3LTYgaC02IHJvdW5kZWQtZnVsbCBiZy1lbWVyYWxkLTUwMCB0ZXh0LXdoaXRlIHRleHQteHMgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgZm9udC1ib2xkIHNoYWRvd1wiPlxuICAgICAgICAgICAgICAgICAgICDinJNcbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3VuZGVkLXhsIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIG1iLTFcIlxuICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDonMzQlJywgYXNwZWN0UmF0aW86JzEvMScsXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6YCR7c3RlcC5pY29uQ29sb3J9MjJgLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6YDFweCBzb2xpZCAke3N0ZXAuaWNvbkNvbG9yfTU1YCxcbiAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgPFRpbGVJY29uIGtpbmQ9e3N0ZXAua2V5fSBjb2xvcj17c3RlcC5pY29uQ29sb3J9IHNpemU9ezQ0fSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS02MDAgdHJhY2tpbmctd2lkZXJcIj4we2luZGV4fTwvZGl2PlxuICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtWzIycHhdIHNtOnRleHQtWzI2cHhdIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXRpZ2h0IHdoaXRlc3BhY2Utbm93cmFwIGxlYWRpbmctbm9uZSBtdC0xLjVcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7Y29sb3I6c3RlcC5pY29uQ29sb3J9fT5cbiAgICAgICAgICAgICAgICB7dChzdGVwLmxhYmVsS2V5KX1cbiAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCB0ZXh0LVsxMHB4XSBzbTp0ZXh0LVsxMXB4XSBsZWFkaW5nLXNudWcgcHgtMyBtdC0xIGxpbmUtY2xhbXAtMlwiPlxuICAgICAgICAgICAgICAgIHt0KHN0ZXAuc3ViS2V5KX1cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9idXR0b24+XG4gICAgKTtcbn1cblxuZnVuY3Rpb24gVGlsZUljb24oeyBraW5kLCBjb2xvciwgc2l6ZSA9IDIyIH0pIHtcbiAgICAvKiBzaW1wbGUgaW5saW5lIFNWR3Mgc28gd2Uga2VlcCB0aGUgZmlsZSBzZWxmLWNvbnRhaW5lZC4gIGBzaXplYFxuICAgICAgIHByb3AgbGV0cyB0aGUgcGVudGFnb24gQ2lyY2xlVGlsZSByZXF1ZXN0IGEgMsOXIGljb24gKDQ0IHB4KSB3aGlsZVxuICAgICAgIGtlZXBpbmcgdGhlIG9sZGVyIGdyaWQgVGlsZSBhdCB0aGUgb3JpZ2luYWwgMjIgcHguICovXG4gICAgY29uc3Qgc3Ryb2tlID0geyBzdHJva2U6Y29sb3IsIGZpbGw6J25vbmUnLCBzdHJva2VXaWR0aDoyLCBzdHJva2VMaW5lY2FwOidyb3VuZCcsIHN0cm9rZUxpbmVqb2luOidyb3VuZCcgfTtcbiAgICBpZiAoa2luZCA9PT0gJ3BzeScpICAgICAgcmV0dXJuIDxzdmcgd2lkdGg9e3NpemV9IGhlaWdodD17c2l6ZX0gdmlld0JveD1cIjAgMCAyNCAyNFwiIHsuLi5zdHJva2V9PjxwYXRoIGQ9XCJNMyAzdjE4aDE4XCIvPjxwYXRoIGQ9XCJNMyAxN2M0LTEgNy02IDktOXM1LTMgOS0yXCIvPjwvc3ZnPjtcbiAgICBpZiAoa2luZCA9PT0gJ2xvY2F0aW9uJykgcmV0dXJuIDxzdmcgd2lkdGg9e3NpemV9IGhlaWdodD17c2l6ZX0gdmlld0JveD1cIjAgMCAyNCAyNFwiIHsuLi5zdHJva2V9PjxwYXRoIGQ9XCJNMTIgMjJzLTctNi40LTctMTJhNyA3IDAgMSAxIDE0IDBjMCA1LjYtNyAxMi03IDEyelwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEwXCIgcj1cIjIuNVwiLz48L3N2Zz47XG4gICAgaWYgKGtpbmQgPT09ICdsYW5ndWFnZScpIHJldHVybiA8c3ZnIHdpZHRoPXtzaXplfSBoZWlnaHQ9e3NpemV9IHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB7Li4uc3Ryb2tlfT48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjlcIi8+PHBhdGggZD1cIk0zIDEyaDE4TTEyIDNhMTQgMTQgMCAwIDEgMCAxOE0xMiAzYTE0IDE0IDAgMCAwIDAgMThcIi8+PC9zdmc+O1xuICAgIGlmIChraW5kID09PSAncGx1Z2lucycpICByZXR1cm4gPHN2ZyB3aWR0aD17c2l6ZX0gaGVpZ2h0PXtzaXplfSB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgey4uLnN0cm9rZX0+PHBhdGggZD1cIk05IDN2Nk0xNSAzdjZcIi8+PHBhdGggZD1cIk01IDloMTR2NmE0IDQgMCAwIDEtNCA0aC0xdjNNOSAxOXYzXCIvPjwvc3ZnPjtcbiAgICAvKiBVcGRhdGUgJiBSZXBhaXIgLS0gd3JlbmNoICsgdGlueSBnZWFyIGJ1bXAsIHNpZ25hbGxpbmcgXCJ0b29sc1wiICovXG4gICAgaWYgKGtpbmQgPT09ICdyZXBhaXInKSAgIHJldHVybiA8c3ZnIHdpZHRoPXtzaXplfSBoZWlnaHQ9e3NpemV9IHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB7Li4uc3Ryb2tlfT48cGF0aCBkPVwiTTE0LjcgNi4zYTQgNCAwIDAgMC01LjQgNS40TDMgMThsMyAzIDYuMy02LjNhNCA0IDAgMCAwIDUuNC01LjRsLTIuOCAyLjhMMTMgMTFsLTEuMS0xLjkgMi44LTIuOHpcIi8+PC9zdmc+O1xuICAgIHJldHVybiBudWxsO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBQc3kgQ2hhcnQgU2V0dGluZyAtLSBGVUxMIFBBR0UsIGxpdmUgc2tlbGV0b24gcmVzcG9uZHMgdG8gY29udHJvbHNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIFBzeUNoYXJ0U2V0dGluZ1BhZ2UoeyBjZmcsIHNldENmZywgb25CYWNrLCBvblNhdmUgfSkge1xuICAgIGNvbnN0IHVwZGF0ZSA9IChrLCB2KSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIFtrXTp2fSkpO1xuXG4gICAgLyogT24gbW91bnQ6IGh5ZHJhdGUgZnJvbSB0aGUgU0FNRSBsb2NhbFN0b3JhZ2Uga2V5IHRoZSBkYXNoYm9hcmQgcmVhZHNcbiAgICAgKiAoYHJlZDVfc3dlZXRfc3BvdF9yYW5nZWApIHBsdXMgdGhlIHByZXNldCBpZCAoYHJlZDVfcmhfcHJlc2V0YCkgc29cbiAgICAgKiB0aGUgZHJvcGRvd24gbGFiZWwgc3RheXMgY29uc2lzdGVudCB3aXRoIHRoZSBzbGlkZXIgdmFsdWVzIGFjcm9zc1xuICAgICAqIHJlbG9hZHMuICBJZiB0aGUgb3BlcmF0b3IgaGFzIGFscmVhZHkgdHVuZWQgdGhlIFJIIGJhbmQgb24gdGhlXG4gICAgICogZGFzaGJvYXJkLCB0aGUgc2V0dXAgd2FsayBzdGFydHMgZnJvbSB0aG9zZSB2YWx1ZXMuICovXG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJhdyAgICA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWQ1X3N3ZWV0X3Nwb3RfcmFuZ2UnKTtcbiAgICAgICAgICAgIGNvbnN0IHByZXNldCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWQ1X3JoX3ByZXNldCcpO1xuICAgICAgICAgICAgY29uc3QgcGF0Y2ggID0ge307XG4gICAgICAgICAgICBpZiAocmF3KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcCA9IEpTT04ucGFyc2UocmF3KTtcbiAgICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHAubG8pICYmIE51bWJlci5pc0Zpbml0ZShwLmhpKSAmJiBwLmxvIDwgcC5oaSkge1xuICAgICAgICAgICAgICAgICAgICBwYXRjaC5yaExvID0gcC5sbztcbiAgICAgICAgICAgICAgICAgICAgcGF0Y2gucmhIaSA9IHAuaGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByZXNldCAmJiBSSF9QUkVTRVRTLmZpbmQoeCA9PiB4LmlkID09PSBwcmVzZXQpKSB7XG4gICAgICAgICAgICAgICAgcGF0Y2gucmhQcmVzZXQgPSBwcmVzZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBUaGVtZSArIGJyaWdodG5lc3Mg4oCUIHNhbWUga2V5cyBhcHAuanMgKGRhc2hib2FyZCkgcmVhZHMuICovXG4gICAgICAgICAgICBjb25zdCB0aCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWQ1LnRoZW1lJyk7XG4gICAgICAgICAgICBpZiAodGggPT09ICdsaWdodCcgfHwgdGggPT09ICdkYXJrJykgcGF0Y2gudGhlbWUgPSB0aDtcbiAgICAgICAgICAgIGNvbnN0IGRsID0gcGFyc2VGbG9hdChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVkNS5kYXJrTGV2ZWwnKSk7XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGRsKSAmJiBkbCA+PSAxLjUgJiYgZGwgPD0gMy4wKSBwYXRjaC5kYXJrTGV2ZWwgPSBkbDtcbiAgICAgICAgICAgIC8qIFRlbXBlcmF0dXJlIGF4aXMgcmFuZ2Ug4oCUIHdyaXR0ZW4gYnkgdGhpcyBzYW1lIHBhZ2UncyBzYXZlXG4gICAgICAgICAgICAgKiBoYW5kbGVyOyBsb2FkIGl0IGhlcmUgc28gcmVvcGVuaW5nIHRoZSBzZXR1cCB3YWxrIHNob3dzIHRoZVxuICAgICAgICAgICAgICogY3VycmVudCBkYXNoYm9hcmQgYXhpcyBpbnN0ZWFkIG9mIGFsd2F5cyBkZWZhdWx0aW5nIHRvIC0xNS4uNTAuICovXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRyUmF3ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlZDVfdGVtcF9yYW5nZScpO1xuICAgICAgICAgICAgICAgIGlmICh0clJhdykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ciA9IEpTT04ucGFyc2UodHJSYXcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHRyLm1pbikgJiYgTnVtYmVyLmlzRmluaXRlKHRyLm1heCkgJiYgdHIubWluIDwgdHIubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRjaC50TG8gPSB0ci5taW47XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRjaC50SGkgPSB0ci5tYXg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7IC8qIGlnbm9yZSAqLyB9XG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMocGF0Y2gpLmxlbmd0aCkgc2V0Q2ZnKGMgPT4gKHsuLi5jLCAuLi5wYXRjaH0pKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBpZ25vcmUgKi8gfVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgICB9LCBbXSk7XG5cbiAgICAvKiBPbiBzYXZlOiBwZXJzaXN0IHRoZSBSSCBiYW5kIHRvIGxvY2FsU3RvcmFnZSBzbyB0aGUgZGFzaGJvYXJkJ3NcbiAgICAgKiBzd2VldC1zcG90IHBvbHlnb24gcGlja3MgaXQgdXAgb24gbmV4dCBsb2FkLiAgQWxzbyBwZXJzaXN0IHRoZSB2ZW51ZVxuICAgICAqIHByZXNldCBpZCAoZm9yIGZ1dHVyZSBcInNob3cgcHJlc2V0IG5hbWUgb24gZGFzaGJvYXJkXCIgZmVhdHVyZXMpLiAqL1xuICAgIGNvbnN0IHBlcnNpc3RBbmRTYXZlID0gKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDVfc3dlZXRfc3BvdF9yYW5nZScsXG4gICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoeyBsbzogY2ZnLnJoTG8sIGhpOiBjZmcucmhIaSB9KSk7XG4gICAgICAgICAgICBpZiAoY2ZnLnJoUHJlc2V0KSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDVfcmhfcHJlc2V0JywgY2ZnLnJoUHJlc2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIFRoZW1lICsgYnJpZ2h0bmVzcyDigJQgd3JpdHRlbiB0byB0aGUgU0FNRSBrZXlzIHRoZSBkYXNoYm9hcmRcbiAgICAgICAgICAgICAqIChhcHAuanMgbGluZXMgNTctNTggYW5kIDg0LTk3KSByZWFkcyBhcyBpdHMgdXNlU3RhdGUgbGF6eVxuICAgICAgICAgICAgICogaW5pdGlhbGlzZXIsIHNvIHRoZSBjaG9zZW4gdGhlbWUgdGFrZXMgZWZmZWN0IG9uIG5leHQgZGFzaGJvYXJkXG4gICAgICAgICAgICAgKiBsb2FkLiAgYXBwLmpzIHRyZWF0cyBkYXJrTGV2ZWwgPj0gMy4wIGFzIGxpZ2h0LW1vZGUgdHJpZ2dlci4gKi9cbiAgICAgICAgICAgIGlmIChjZmcudGhlbWUgPT09ICdsaWdodCcgfHwgY2ZnLnRoZW1lID09PSAnZGFyaycpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS50aGVtZScsIGNmZy50aGVtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGNmZy5kYXJrTGV2ZWwpKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDUuZGFya0xldmVsJywgU3RyaW5nKGNmZy5kYXJrTGV2ZWwpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIFRlbXBlcmF0dXJlIGF4aXMgcmFuZ2Ug4oCUIGRyaXZlcyB0aGUgZGFzaGJvYXJkJ3MgcHN5IGNoYXJ0XG4gICAgICAgICAgICAgKiBYIGF4aXMgKGB0ZW1wUmFuZ2UubWluL21heGAgaW4gYXBwLmpzKS4gIFdlIHdyaXRlIHRoZSBzYW1lXG4gICAgICAgICAgICAgKiBzaGFwZSBhcHAuanMgcmVhZHMgKGB7bWluLCBtYXh9YCkgc28gaXRzIGxhenkgdXNlU3RhdGUgaW5pdFxuICAgICAgICAgICAgICogcGlja3MgaXQgdXAgb24gbmV4dCBsb2FkLCBBTkQgZGlzcGF0Y2ggYSBjdXN0b20gZXZlbnQgc29cbiAgICAgICAgICAgICAqIGFueSBvcGVuIGRhc2hib2FyZCB0YWIgdXBkYXRlcyBsaXZlIHdpdGhvdXQgYSByZWZyZXNoLiAqL1xuICAgICAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShjZmcudExvKSAmJiBOdW1iZXIuaXNGaW5pdGUoY2ZnLnRIaSkgJiYgY2ZnLnRMbyA8IGNmZy50SGkpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNV90ZW1wX3JhbmdlJyxcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoeyBtaW46IGNmZy50TG8sIG1heDogY2ZnLnRIaSB9KSk7XG4gICAgICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdyNS10ZW1wLXJhbmdlLWNoYW5nZScsIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7IG1pbjogY2ZnLnRMbywgbWF4OiBjZmcudEhpIH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3I1LXJoLWJhbmQtY2hhbmdlJywge1xuICAgICAgICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgICAgICAgICBsbzogY2ZnLnJoTG8sXG4gICAgICAgICAgICAgICAgICAgIGhpOiBjZmcucmhIaSxcbiAgICAgICAgICAgICAgICAgICAgcHJlc2V0OiBjZmcucmhQcmVzZXQgfHwgJ2N1c3RvbScsXG4gICAgICAgICAgICAgICAgICAgIGFwcGx5VG9BbGxBaHVzOiB0cnVlLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnW3NldHVwIHdhbGtdIHBzeSBjaGFydCBzYXZlZCAtPiBSSCcsIGNmZy5yaExvLCAnLScsIGNmZy5yaEhpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICclIFQtYXhpcycsIGNmZy50TG8sICcuLicsIGNmZy50SGksICfCsEMgcHJlc2V0PScsIGNmZy5yaFByZXNldCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignW3NldHVwIHdhbGtdIGNvdWxkIG5vdCBwZXJzaXN0IHBzeSBzZXR0aW5nczonLCBlKTtcbiAgICAgICAgfVxuICAgICAgICBvblNhdmUoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtaW4taC1zY3JlZW4gZmxleCBmbGV4LWNvbFwiPlxuICAgICAgICAgICAgey8qIGhlYWRlciAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHB4LTYgcHktNCBib3JkZXItYiBib3JkZXItc2xhdGUtODAwXCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkJhY2t9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTQwMCBob3Zlcjp0ZXh0LXdoaXRlIHRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrXCI+XG4gICAgICAgICAgICAgICAgICAgIHt0KCdzd19iYWNrX3RvX3NldHVwJyl9XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cInRleHQtc20gdXBwZXJjYXNlIHRyYWNraW5nLVswLjNlbV0gZm9udC1ibGFjayB0ZXh0LWluZGlnby00MDBcIj57dCgnc3dfcHN5X2NoYXJ0X3NldHRpbmcnKX08L2gxPlxuICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17cGVyc2lzdEFuZFNhdmV9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC01IHB5LTIgcm91bmRlZC1sZyBiZy1pbmRpZ28tNjAwIGhvdmVyOmJnLWluZGlnby01MDAgdGV4dC13aGl0ZSB0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFja1wiPlxuICAgICAgICAgICAgICAgICAgICB7dCgnc3dfc2F2ZV9yZXR1cm4nKX1cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogYm9keSDigJQgY2hhcnQgbGVmdCwgY29udHJvbHMgcmlnaHQgKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMSBncmlkIGdyaWQtY29scy0xIGxnOmdyaWQtY29scy1bMWZyXzM2MHB4XSBnYXAtNCBwLTYgbWF4LXctN3hsIG14LWF1dG8gdy1mdWxsXCI+XG4gICAgICAgICAgICAgICAgPFBzeVNrZWxldG9uIGNmZz17Y2ZnfSAvPlxuICAgICAgICAgICAgICAgIDxQc3lDb250cm9sUGFuZWwgY2ZnPXtjZmd9IHVwZGF0ZT17dXBkYXRlfSBzZXRDZmc9e3NldENmZ30gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG4vKiBSSCBiYW5kIHByZXNldHMg4oCUIHJlY29nbmlzZWQgaW5kdXN0cnkgc3RhbmRhcmRzIGZvciBlYWNoIHZlbnVlIHR5cGUuXG4gKiBTb3VyY2VzOiBBU0hSQUUgNTUgKGNvbWZvcnQpLCBBU0hSQUUgMTcwIChoZWFsdGhjYXJlKSxcbiAqIEFBTS9OUFMvU21pdGhzb25pYW4gZ3VpZGFuY2UgKGNvbGxlY3Rpb25zKSwgQ0lCU0UgVE00MCAobGlicmFyaWVzKS4gKi9cbmNvbnN0IFJIX1BSRVNFVFMgPSBbXG4gICAgeyBpZDonY3VzdG9tJywgICAgICAgICAgbGFiZWw6J0N1c3RvbSAobWFudWFsKScsICAgICAgICAgICAgICAgICBsbzpudWxsLCBoaTpudWxsLCBub3RlOicnIH0sXG4gICAgeyBpZDonb2ZmaWNlJywgICAgICAgICAgbGFiZWw6J09mZmljZScsICAgICAgICAgICAgICAgICAgICAgICAgICBsbzozMCwgICBoaTo2MCwgICBub3RlOidBU0hSQUUgNTUgY29tZm9ydCcgICAgICAgICAgICAgICAgICB9LFxuICAgIHsgaWQ6J211c2V1bScsICAgICAgICAgIGxhYmVsOidNdXNldW0nLCAgICAgICAgICAgICAgICAgICAgICAgICAgbG86NDAsICAgaGk6NTUsICAgbm90ZTonQUFNIGNvbGxlY3Rpb24gcHJlc2VydmF0aW9uJyAgICAgICAgfSxcbiAgICB7IGlkOidob3RlbCcsICAgICAgICAgICBsYWJlbDonSG90ZWwgZ3Vlc3Qgcm9vbScsICAgICAgICAgICAgICAgIGxvOjMwLCAgIGhpOjYwLCAgIG5vdGU6J2dlbmVyYWwgb2NjdXBhbnQgY29tZm9ydCcgICAgICAgICAgIH0sXG4gICAgeyBpZDonbGlicmFyeScsICAgICAgICAgbGFiZWw6J0xpYnJhcnkgLyBBcmNoaXZlJywgICAgICAgICAgICAgICBsbzo0MCwgICBoaTo1NSwgICBub3RlOidwYXBlciAmIGJpbmRpbmcgcHJlc2VydmF0aW9uJyAgICAgICB9LFxuICAgIHsgaWQ6J2hvc3BpdGFsJywgICAgICAgIGxhYmVsOidIb3NwaXRhbCAoZ2VuZXJhbCknLCAgICAgICAgICAgICAgbG86MzAsICAgaGk6NjAsICAgbm90ZTonQVNIUkFFIDE3MCBwYXRpZW50IGFyZWFzJyAgICAgICAgICAgfSxcbiAgICB7IGlkOidsZWN0dXJlJywgICAgICAgICBsYWJlbDonTGVjdHVyZSBoYWxsJywgICAgICAgICAgICAgICAgICAgIGxvOjMwLCAgIGhpOjYwLCAgIG5vdGU6J2hpZ2ggb2NjdXBhbmN5IGNvbWZvcnQnICAgICAgICAgICAgIH0sXG4gICAgeyBpZDonY29uY2VydCcsICAgICAgICAgbGFiZWw6J0NvbmNlcnQgaGFsbCcsICAgICAgICAgICAgICAgICAgICBsbzo0MCwgICBoaTo1NSwgICBub3RlOidpbnN0cnVtZW50IHR1bmluZyBzdGFiaWxpdHknICAgICAgICB9LFxuICAgIHsgaWQ6J21lZXRpbmcnLCAgICAgICAgIGxhYmVsOidNZWV0aW5nIHJvb20nLCAgICAgICAgICAgICAgICAgICAgbG86MzAsICAgaGk6NjAsICAgbm90ZTonc21hbGwgZ3JvdXAgY29tZm9ydCcgICAgICAgICAgICAgICAgfSxcbiAgICB7IGlkOidleGhpYml0aW9uJywgICAgICBsYWJlbDonRXhoaWJpdGlvbiBoYWxsJywgICAgICAgICAgICAgICAgIGxvOjQwLCAgIGhpOjU1LCAgIG5vdGU6J21peGVkIGFydCAvIGFydGlmYWN0IGRpc3BsYXknICAgICAgIH0sXG5dO1xuXG4vKiBSZWFsIHBzeSBjaGFydCDigJQgdXNlcyB0aGUgU0FNRSBnZXRXICsgR0lWT05JX0NPTE9SUyArIHBvbHlnb24gbWF0aCBhcyB0aGVcbiAqIHByb2R1Y3Rpb24gZGFzaGJvYXJkLiAgU291cmNlIG9mIHRydXRoOiAganMvcHN5Y2hyb21ldHJpYy5qcyAgYW5kIHRoZVxuICogcmVuZGVyR2l2b25pT3ZlcmxheSgpIGJsb2NrIGF0IGFwcC5qczoxNjQxLTE3MjIuXG4gKiBBbnl0aGluZyB5b3UgY2hhbmdlIGluIHRob3NlIGZpbGVzIE1VU1QgYmUgbWlycm9yZWQgaGVyZS4gKi9cbmZ1bmN0aW9uIFBzeVNrZWxldG9uKHsgY2ZnIH0pIHtcbiAgICAvKiBDYW52YXMgKyBwYWRkaW5nICovXG4gICAgY29uc3QgVyA9IDc2MCwgSCA9IDQ4MDtcbiAgICBjb25zdCBwYWQgPSB7IGxlZnQ6IDU2LCByaWdodDogNDAsIHRvcDogMjgsIGJvdHRvbTogNTYgfTtcbiAgICBjb25zdCBncmlkVyA9IFcgLSBwYWQubGVmdCAtIHBhZC5yaWdodDtcbiAgICBjb25zdCBncmlkSCA9IEggLSBwYWQudG9wICAtIHBhZC5ib3R0b207XG5cbiAgICBjb25zdCBUX01JTiA9IGNmZy50TG8sIFRfTUFYID0gY2ZnLnRIaTtcbiAgICBjb25zdCBXX01JTiA9IDAsICAgICAgIFdfTUFYID0gMC4wMzA7ICAgICAgICAgIC8vIGtnL2tnXG5cbiAgICAvKiBheGlzIHNjYWxlcyAtLSBtYXRjaCB0aGUgbGl2ZSBkYXNoYm9hcmQgKi9cbiAgICBjb25zdCB4ICA9ICh0KSA9PiBwYWQubGVmdCArICgodCAtIFRfTUlOKSAvIChUX01BWCAtIFRfTUlOKSkgKiBncmlkVztcbiAgICBjb25zdCB5ICA9ICh3KSA9PiBwYWQudG9wICArICgxIC0gKHcgLSBXX01JTikgLyAoV19NQVggLSBXX01JTikpICogZ3JpZEg7XG4gICAgY29uc3QgX2dldFcgPSAodHlwZW9mIGdldFcgPT09ICdmdW5jdGlvbicpID8gZ2V0VyA6ICgodCwgcmgpID0+IDApO1xuXG4gICAgY29uc3Qgc2FmZVB0cyA9IChhcnIpID0+IGFyci5tYXAocCA9PiBgJHsoeChwWzBdKXx8MCkudG9GaXhlZCgyKX0sJHsoeShwWzFdKXx8MCkudG9GaXhlZCgyKX1gKS5qb2luKCcgJyk7XG5cbiAgICAvKiAtLS0tIEdpdm9uaSBwb2x5Z29ucyAtLSBDT1BJRUQgVkVSQkFUSU0gZnJvbSBhcHAuanM6MTY0My0xNjY5IC0tLS0gKi9cbiAgICBjb25zdCByaDgwID0gW107IGZvciAobGV0IHQ9MjA7IHQ8PTI1OyB0Kz0wLjUpIHJoODAucHVzaChbdCwgX2dldFcodCwgODApXSk7XG4gICAgY29uc3QgcmgxMDA9IFtdOyBmb3IgKGxldCB0PTIwOyB0PD0yNzsgdCs9MC41KSByaDEwMC5wdXNoKFt0LCBfZ2V0Vyh0LCAxMDApXSk7XG4gICAgY29uc3QgcmgyMExpbmUgPSBbXTsgZm9yIChsZXQgdD0zMjsgdD49MjA7IHQtPTAuNSkgcmgyMExpbmUucHVzaChbdCwgX2dldFcodCwgMjApXSk7XG4gICAgY29uc3QgcmgyMF9DWiAgPSBbXTsgZm9yIChsZXQgdD0yNzsgdD49MjA7IHQtPTAuNSkgcmgyMF9DWi5wdXNoKFt0LCBfZ2V0Vyh0LCAyMCldKTtcbiAgICBjb25zdCBDWiAgID0gWy4uLnJoODAsIFsyNywgX2dldFcoMjcsIDUwKV0sIFsyNywgX2dldFcoMjcsIDIwKV0sIC4uLnJoMjBfQ1pdO1xuXG4gICAgY29uc3QgcmhIaV90b3AgPSBbXTsgZm9yIChsZXQgdHQ9MjA7IHR0PD0yNzsgdHQrPTAuNSkgcmhIaV90b3AucHVzaChbdHQsIF9nZXRXKHR0LCBjZmcucmhIaSldKTtcbiAgICBjb25zdCByaExvX2JvdCA9IFtdOyBmb3IgKGxldCB0dD0yNzsgdHQ+PTIwOyB0dC09MC41KSByaExvX2JvdC5wdXNoKFt0dCwgX2dldFcodHQsIGNmZy5yaExvKV0pO1xuICAgIGNvbnN0IFNXRUVUID0gWy4uLnJoSGlfdG9wLCAuLi5yaExvX2JvdF07XG5cbiAgICBjb25zdCBOViAgID0gWy4uLnJoMTAwLCBbMzIsIDE1LjQvMTAwMF0sIFszMiwgNi4yLzEwMDBdLCAuLi5yaDIwTGluZV07XG4gICAgY29uc3QgTWFzcyA9IFsuLi5yaDgwLCBbMzMsIDE2LzEwMDBdLCBbMzcsIF9nZXRXKDM3LCAzMCldLCBbMzcsIDMvMTAwMF0sIFsyMCwgX2dldFcoMjAsIDIwKV1dO1xuICAgIGNvbnN0IE1DViAgPSBbLi4ucmg4MCwgWzQwLCAxNi8xMDAwXSwgWzQ0LCBfZ2V0Vyg0NCwgMjApXSwgWzQ0LCAzLzEwMDBdLCBbMjAsIF9nZXRXKDIwLCAyMCldXTtcbiAgICBjb25zdCBFVkFQID0gWy4uLnJoODAsIFsyNSwgMTYvMTAwMF0sIFszNiwgX2dldFcoMzYsIDMwKV0sIFszOSwgX2dldFcoMzksIDIwKV0sXG4gICAgICAgICAgICAgICAgICBbNDEsIF9nZXRXKDQxLCAxMCldLCBbNDEsIDBdLCBbMjcuMiwgMF0sIFsyMCwgX2dldFcoMjAsIDIwKV1dO1xuXG4gICAgY29uc3Qgd2ludGVyUkg4MCA9IFtdOyBmb3IgKGxldCB0PTE4OyB0PD0xOS41OyB0Kz0wLjUpIHdpbnRlclJIODAucHVzaChbdCwgX2dldFcodCwgODApXSk7XG4gICAgY29uc3Qgd2ludGVyUkgyMCA9IFtdOyBmb3IgKGxldCB0PTE5LjU7IHQ+PTE4OyB0LT0wLjUpIHdpbnRlclJIMjAucHVzaChbdCwgX2dldFcodCwgMjApXSk7XG4gICAgY29uc3QgV0lOVEVSID0gWy4uLndpbnRlclJIODAsIC4uLndpbnRlclJIMjBdO1xuXG4gICAgLyogUkggaXNvcGxldGggY3VydmVzIGZvciB0aGUgY2hhcnQgZ3JpZCAqL1xuICAgIGNvbnN0IGlzb3BsZXRocyA9IFsyMCwgNDAsIDYwLCA4MCwgMTAwXTtcblxuICAgIC8qIFRoZW1lIHBhbGV0dGUg4oCUIGRyaXZlcyB0aGUgbGl2ZSBwcmV2aWV3IHNvIHRoZSBkaW0vbGlnaHQgY29udHJvbHNcbiAgICAgKiBoYXZlIHZpc2libGUgZmVlZGJhY2sgcmlnaHQgb24gdGhlIGNoYXJ0LiAgSW4gZGltL2RhcmsgbW9kZSB3ZSBhbHNvXG4gICAgICogYXBwbHkgYSBDU1MgYnJpZ2h0bmVzcyBmaWx0ZXIgbWFwcGVkIGZyb20gY2ZnLmRhcmtMZXZlbCAoMS41IC4uIDIuOFxuICAgICAqIOKGkiAwLjYgLi4gMS40KSBzbyB0aGUgdXNlciBjYW4gU0VFIHRoZSBicmlnaHRuZXNzIHNsaWRlciB3b3JraW5nLiAqL1xuICAgIGNvbnN0IGlzTGlnaHQgPSBjZmcudGhlbWUgPT09ICdsaWdodCc7XG4gICAgY29uc3QgcGFsZXR0ZSA9IGlzTGlnaHRcbiAgICAgICAgPyB7IGJnOicjZjhmYWZjJywgZ3JpZDonI2NiZDVlMScsIHRpY2s6JyM0NzU1NjknLCBheGlzOicjMWUyOTNiJyxcbiAgICAgICAgICAgIHBhbmVsQmc6J3JnYmEoMjQ4LDI1MCwyNTIsMC44NSknLCBwYW5lbEJvcmRlcjonI2NiZDVlMScsXG4gICAgICAgICAgICBwaWxsQmc6JyNlMmU4ZjAnLCBwaWxsRmc6JyM0NzU1NjknLCBtZXRhRmc6JyM2NDc0OGInIH1cbiAgICAgICAgOiB7IGJnOicjMGIxMjIwJywgZ3JpZDonIzFlMjkzYicsIHRpY2s6JyM5NGEzYjgnLCBheGlzOicjY2JkNWUxJyxcbiAgICAgICAgICAgIHBhbmVsQmc6J3JnYmEoMTUsMjMsNDIsMC42KScsIHBhbmVsQm9yZGVyOicjMWUyOTNiJyxcbiAgICAgICAgICAgIHBpbGxCZzonIzFlMjkzYicsIHBpbGxGZzonIzk0YTNiOCcsIG1ldGFGZzonIzY0NzQ4YicgfTtcbiAgICBjb25zdCBkaW1GaWx0ZXIgPSBpc0xpZ2h0XG4gICAgICAgID8gJ25vbmUnXG4gICAgICAgIDogYGJyaWdodG5lc3MoJHsoTWF0aC5tYXgoMS41LCBNYXRoLm1pbigyLjgsIGNmZy5kYXJrTGV2ZWwgfHwgMi4wKSkgLyAyLjApLnRvRml4ZWQoMil9KWA7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdW5kZWQtMnhsIHAtNCBib3JkZXIgdHJhbnNpdGlvbi1jb2xvcnMgZHVyYXRpb24tMzAwXCJcbiAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6IHBhbGV0dGUucGFuZWxCZywgYm9yZGVyQ29sb3I6IHBhbGV0dGUucGFuZWxCb3JkZXJ9fT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIG1iLTNcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJwaWxsXCIgc3R5bGU9e3tiYWNrZ3JvdW5kOnBhbGV0dGUucGlsbEJnLCBjb2xvcjpwYWxldHRlLnBpbGxGZ319PlBTWUNIUk9NRVRSSUMgQ0hBUlQgwrcgbGl2ZSBwcmV2aWV3PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIGZvbnQtbW9ub1wiIHN0eWxlPXt7Y29sb3I6cGFsZXR0ZS5tZXRhRmd9fT57VF9NSU59wrBDIOKGkiB7VF9NQVh9wrBDICDCtyAge2NmZy5yaExvfeKAk3tjZmcucmhIaX0lIFJIPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8c3ZnIHZpZXdCb3g9e2AwIDAgJHtXfSAke0h9YH0gY2xhc3NOYW1lPVwidy1mdWxsIGgtYXV0byB0cmFuc2l0aW9uLVtmaWx0ZXJdIGR1cmF0aW9uLTMwMFwiXG4gICAgICAgICAgICAgICAgIHN0eWxlPXt7YmFja2dyb3VuZDogcGFsZXR0ZS5iZywgYm9yZGVyUmFkaXVzOjgsIGZpbHRlcjogZGltRmlsdGVyfX0+XG4gICAgICAgICAgICAgICAgey8qIC0tLS0gZ3JpZDogdmVydGljYWwgVCBsaW5lcywgaG9yaXpvbnRhbCBXIGxpbmVzIC0tLS0gKi99XG4gICAgICAgICAgICAgICAge0FycmF5LmZyb20oe2xlbmd0aDoxMX0pLm1hcCgoXyxpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBUX01JTiArIChpLzEwKSAqIChUX01BWCAtIFRfTUlOKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxnIGtleT17J3Z0JytpfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17eCh0KX0geTE9e3BhZC50b3B9IHgyPXt4KHQpfSB5Mj17cGFkLnRvcCtncmlkSH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9e3BhbGV0dGUuZ3JpZH0gc3Ryb2tlV2lkdGg9XCIwLjZcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCh0KX0geT17cGFkLnRvcCtncmlkSCsxNn0gZm9udFNpemU9XCI5LjVcIiBmaWxsPXtwYWxldHRlLnRpY2t9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiPnt0LnRvRml4ZWQoMCl9PC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIHtBcnJheS5mcm9tKHtsZW5ndGg6N30pLm1hcCgoXyxpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHcgPSBXX01JTiArIChpLzYpICogKFdfTUFYIC0gV19NSU4pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGcga2V5PXsnaHcnK2l9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXtwYWQubGVmdH0geTE9e3kodyl9IHgyPXtwYWQubGVmdCtncmlkV30geTI9e3kodyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPXtwYWxldHRlLmdyaWR9IHN0cm9rZVdpZHRoPVwiMC42XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3BhZC5sZWZ0LTh9IHk9e3kodykrM30gZm9udFNpemU9XCI5LjVcIiBmaWxsPXtwYWxldHRlLnRpY2t9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cImVuZFwiPnsodyoxMDAwKS50b0ZpeGVkKDApfTwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICB7LyogLS0tLSBSSCBpc29wbGV0aHMgKGN1cnZlcykgLS0tLSAqL31cbiAgICAgICAgICAgICAgICB7aXNvcGxldGhzLm1hcChyaCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHB0cyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB0ID0gVF9NSU47IHQgPD0gVF9NQVg7IHQgKz0gMC41KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB3dyA9IF9nZXRXKHQsIHJoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3dyA+PSBXX01JTiAmJiB3dyA8PSBXX01BWCkgcHRzLnB1c2goW3QsIHd3XSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxnIGtleT17J2lzbycrcmh9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5bGluZSBwb2ludHM9e3NhZmVQdHMocHRzKX0gZmlsbD1cIm5vbmVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9e3JoID09PSAxMDAgPyAnIzYzNjZmMScgOiAnI2VjNDg5OTU1J30gc3Ryb2tlV2lkdGg9XCIwLjhcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2VEYXNoYXJyYXk9e3JoID09PSAxMDAgPyAnJyA6ICczLDMnfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3B0cy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eChwdHNbTWF0aC5mbG9vcihwdHMubGVuZ3RoKjAuNjUpXVswXSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk9e3kocHRzW01hdGguZmxvb3IocHRzLmxlbmd0aCowLjY1KV1bMV0pIC0gNH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU9XCI5XCIgZmlsbD1cIiNlYzQ4OTk5OVwiIGZvbnRXZWlnaHQ9XCI3MDBcIj57cmh9JTwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pfVxuXG4gICAgICAgICAgICAgICAgey8qIC0tLS0gR2l2b25pIG92ZXJsYXkgKGNvcGllZCB2ZXJiYXRpbSBmcm9tIGFwcC5qcyByZW5kZXIgb3JkZXIpIC0tLS0gKi99XG4gICAgICAgICAgICAgICAge2NmZy5naXZvbmkgJiYgKFxuICAgICAgICAgICAgICAgICAgICA8ZyBjbGFzc05hbWU9XCJwb2ludGVyLWV2ZW50cy1ub25lXCIgb3BhY2l0eT1cIjAuOVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3goNDApfSB5MT17eSgxNi8xMDAwKX0geDI9e3goNTApfSB5Mj17eSgxNi8xMDAwKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cIiM2MzY2ZjFcIiBzdHJva2VXaWR0aD1cIjEuNVwiIHN0cm9rZURhc2hhcnJheT1cIjQsNFwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXt4KDUwKX0geTE9e3koMTYvMTAwMCl9IHgyPXt4KDUwKX0geTI9e3koMCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCIjNjM2NmYxXCIgc3Ryb2tlV2lkdGg9XCIxLjVcIiBzdHJva2VEYXNoYXJyYXk9XCI0LDRcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17eCg0MSl9IHkxPXt5KDApfSB4Mj17eCg1MCl9IHkyPXt5KDApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiIzYzNjZmMVwiIHN0cm9rZVdpZHRoPVwiMS41XCIgc3Ryb2tlRGFzaGFycmF5PVwiNCw0XCIvPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoTUNWKX0gIGZpbGw9XCIjZWM0ODk5XCIgZmlsbE9wYWNpdHk9XCIwLjA1XCIgc3Ryb2tlPVwiI2VjNDg5OVwiIHN0cm9rZVdpZHRoPVwiMVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhNYXNzKX0gZmlsbD1cIiM4YjVjZjZcIiBmaWxsT3BhY2l0eT1cIjAuMDVcIiBzdHJva2U9XCIjOGI1Y2Y2XCIgc3Ryb2tlV2lkdGg9XCIxXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKEVWQVApfSBmaWxsPVwiIzA2YjZkNFwiIGZpbGxPcGFjaXR5PVwiMC4wOFwiIHN0cm9rZT1cIiMwNmI2ZDRcIiBzdHJva2VXaWR0aD1cIjFcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoTlYpfSAgIGZpbGw9XCIjZjU5ZTBiXCIgZmlsbE9wYWNpdHk9XCIwLjA1XCIgc3Ryb2tlPVwiI2Y1OWUwYlwiIHN0cm9rZVdpZHRoPVwiMVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhDWil9ICAgZmlsbD1cIiMxMGI5ODFcIiBmaWxsT3BhY2l0eT1cIjAuMTVcIiBzdHJva2U9XCIjMTBiOTgxXCIgc3Ryb2tlV2lkdGg9XCIxLjJcIi8+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBTd2VldC1zcG90IGJhbmQsIGNsaXBwZWQgdG8gQ1ogKi99XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGVmcz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y2xpcFBhdGggaWQ9XCJjei1jbGlwLXdhbGtcIiBjbGlwUGF0aFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKENaKX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvY2xpcFBhdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2RlZnM+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoU1dFRVQpfSBjbGlwUGF0aD1cInVybCgjY3otY2xpcC13YWxrKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxsPVwiIzA1OTY2OVwiIGZpbGxPcGFjaXR5PVwiMC4zMlwiIHN0cm9rZT1cIiMwNDc4NTdcIiBzdHJva2VXaWR0aD1cIjAuOFwiIHN0cm9rZURhc2hhcnJheT1cIjMsMlwiLz5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKFdJTlRFUil9IGZpbGw9XCIjM2I4MmY2XCIgZmlsbE9wYWNpdHk9XCIwLjE1XCIgc3Ryb2tlPVwibm9uZVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXt4KDE5KX0geTE9e3BhZC50b3ArMTh9IHgyPXt4KDE5KX0geTI9e3BhZC50b3ArZ3JpZEh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCIjM2I4MmY2XCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlRGFzaGFycmF5PVwiNiw0XCIgb3BhY2l0eT1cIjAuOFwiLz5cblxuICAgICAgICAgICAgICAgICAgICAgICAgey8qIFJlZ2lvbiBsYWJlbHMg4oCUIHNhbWUgY29sb3JzICYgc3Bpcml0IGFzIGxpdmUgY2hhcnQgKi99XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDUwKS0xMH0geT17eSg4LzEwMDApfSBmaWxsPVwiIzYzNjZmMVwiIGZvbnRTaXplPVwiMTBcIiBmb250V2VpZ2h0PVwiOTAwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiB0cmFuc2Zvcm09e2Byb3RhdGUoLTkwLCAke3goNTApLTEwfSwgJHt5KDgvMTAwMCl9KWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nPVwiMlwiPk1FQ0hBTklDQUwgQ09PTElORzwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goNDQpLTJ9IHk9e3koOC8xMDAwKX0gZmlsbD1cIiNlYzQ4OTlcIiBmb250U2l6ZT1cIjlcIiBmb250V2VpZ2h0PVwiOTAwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiB0cmFuc2Zvcm09e2Byb3RhdGUoLTkwLCAke3goNDQpLTJ9LCAke3koOC8xMDAwKX0pYH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc9XCIxLjVcIj5NQVNTIENPT0xJTkc8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDM3KS0xMH0geT17eSg4LzEwMDApfSBmaWxsPVwiIzhiNWNmNlwiIGZvbnRTaXplPVwiOVwiIGZvbnRXZWlnaHQ9XCI5MDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIHRyYW5zZm9ybT17YHJvdGF0ZSgtOTAsICR7eCgzNyktMTB9LCAke3koOC8xMDAwKX0pYH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc9XCIxLjVcIj5NQVNTIENPT0xJTkc8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDM0KX0geT17eSgwLjUvMTAwMCktOH0gZmlsbD1cIiMwNmI2ZDRcIiBmb250U2l6ZT1cIjlcIiBmb250V2VpZ2h0PVwiOTAwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiBsZXR0ZXJTcGFjaW5nPVwiMlwiPkVWQVBPUkFUSVZFPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCgyMy41KX0geT17eShfZ2V0VygyMy41LCA0NSkpfSBmaWxsPVwiIzEwYjk4MVwiIGZvbnRTaXplPVwiMTFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodD1cIjkwMFwiIHRleHRBbmNob3I9XCJtaWRkbGVcIiBsZXR0ZXJTcGFjaW5nPVwiMS41XCI+Q09NRk9SVDwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goMTguNzUpfSB5PXt5KF9nZXRXKDE4Ljc1LCA0NSkpfSBmaWxsPVwiIzNiODJmNlwiIGZvbnRTaXplPVwiMTFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodD1cIjkwMFwiIHRleHRBbmNob3I9XCJtaWRkbGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtPXtgcm90YXRlKC05MCwgJHt4KDE4Ljc1KX0sICR7eShfZ2V0VygxOC43NSwgNDUpKX0pYH0+V0lOVEVSPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCgyMy41KX0geT17eShfZ2V0VygyMy41LCAoY2ZnLnJoTG8rY2ZnLnJoSGkpLzIpKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw9XCIjMDIyYzIyXCIgZm9udFNpemU9XCI4XCIgZm9udFdlaWdodD1cIjkwMFwiIHRleHRBbmNob3I9XCJtaWRkbGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3twYWludE9yZGVyOidzdHJva2UnLCBzdHJva2U6JyNhN2YzZDAnLCBzdHJva2VXaWR0aDonMi41cHgnLCBzdHJva2VMaW5lam9pbjoncm91bmQnfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc9XCIxLjVcIj57Y2ZnLnJoTG99LXtjZmcucmhIaX0lIFJIPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAgICAgIHsvKiBheGlzIGxhYmVscyAqL31cbiAgICAgICAgICAgICAgICA8dGV4dCB4PXtwYWQubGVmdCArIGdyaWRXLzJ9IHk9e0gtMTJ9IGZvbnRTaXplPVwiMTFcIiBmaWxsPXtwYWxldHRlLmF4aXN9XG4gICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGZvbnRXZWlnaHQ9XCI4MDBcIiBsZXR0ZXJTcGFjaW5nPVwiMlwiPkRSWSBCVUxCIFRFTVAgKMKwQyk8L3RleHQ+XG4gICAgICAgICAgICAgICAgPHRleHQgeD17MTZ9IHk9e3BhZC50b3AgKyBncmlkSC8yfSBmb250U2l6ZT1cIjExXCIgZmlsbD17cGFsZXR0ZS5heGlzfVxuICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiBmb250V2VpZ2h0PVwiODAwXCIgbGV0dGVyU3BhY2luZz1cIjJcIlxuICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybT17YHJvdGF0ZSgtOTAgMTYgJHtwYWQudG9wICsgZ3JpZEgvMn0pYH0+SFVNSURJVFkgUkFUSU8gKGcva2cpPC90ZXh0PlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbmZ1bmN0aW9uIFBzeUNvbnRyb2xQYW5lbCh7IGNmZywgdXBkYXRlLCBzZXRDZmcgfSkge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctc2xhdGUtOTAwLzYwIGJvcmRlciBib3JkZXItc2xhdGUtODAwIHJvdW5kZWQtMnhsIHAtNSBzcGFjZS15LTZcIj5cbiAgICAgICAgICAgIHsvKiBUaGVtZSArIGJyaWdodG5lc3MgIC0tIHJlbG9jYXRlZCBmcm9tIHRoZSBkYXNoYm9hcmQgc2lkZWJhciAyMDI2LTA2LTI1LlxuICAgICAgICAgICAgICAgIFR3byBjb250cm9sczogRGFyay9MaWdodCBtb2RlIHRvZ2dsZSwgYW5kIEJyaWdodG5lc3Mgc2xpZGVyIChvbmx5XG4gICAgICAgICAgICAgICAgbWVhbmluZ2Z1bCBpbiBkYXJrIG1vZGUpLiAgTGl2ZSBwcmV2aWV3IGFwcGxpZXMgdG8gdGhlIHN1cnJvdW5kaW5nXG4gICAgICAgICAgICAgICAgY29udHJvbCBwYW5lbCBzbyB0aGUgb3BlcmF0b3IgY2FuIEZFRUwgdGhlIGNoYW5nZSBiZWZvcmUgc2F2aW5nLiAqL31cbiAgICAgICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJwc3ktY2ZnLXRoZW1lLWJsb2NrXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0yXCI+e3QoJ3N3X2Rpc3BsYXlfbW9kZScpfTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtMiBtYi0zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJwc3ktY2ZnLXRoZW1lLWRhcmtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldENmZyhjID0+ICh7Li4uYywgdGhlbWU6J2RhcmsnLCBkYXJrTGV2ZWw6TWF0aC5taW4oYy5kYXJrTGV2ZWwgfHwgMi4wLCAyLjYpfSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB5LTIuNSByb3VuZGVkLWxnIHRleHQteHMgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGJvcmRlciB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2NmZy50aGVtZSA9PT0gJ2RhcmsnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1zbGF0ZS04MDAgYm9yZGVyLXllbGxvdy01MDAvNzAgdGV4dC15ZWxsb3ctMzAwIHNoYWRvdy1sZyBzaGFkb3cteWVsbG93LTUwMC8xMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLXNsYXRlLTkwMC8zMCBib3JkZXItc2xhdGUtNzAwIHRleHQtc2xhdGUtNTAwIGhvdmVyOmJnLXNsYXRlLTgwMC82MCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dCgnc3dfZGltX2RhcmsnKX1cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJwc3ktY2ZnLXRoZW1lLWxpZ2h0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIHRoZW1lOidsaWdodCcsIGRhcmtMZXZlbDozLjB9KSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHktMi41IHJvdW5kZWQtbGcgdGV4dC14cyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgYm9yZGVyIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Y2ZnLnRoZW1lID09PSAnbGlnaHQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1zbGF0ZS0xMDAgYm9yZGVyLXNreS01MDAvNzAgdGV4dC1za3ktNzAwIHNoYWRvdy1sZyBzaGFkb3ctc2t5LTUwMC8xMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLXNsYXRlLTkwMC8zMCBib3JkZXItc2xhdGUtNzAwIHRleHQtc2xhdGUtNTAwIGhvdmVyOmJnLXNsYXRlLTgwMC82MCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dCgnc3dfbGlnaHRfbW9kZScpfVxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICB7LyogQnJpZ2h0bmVzcyBzbGlkZXIg4oCUIG9ubHkgbWVhbmluZ2Z1bCB3aGVuIHRoZW1lID09PSAnZGFyaycgKi99XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NmZy50aGVtZSA9PT0gJ2xpZ2h0JyA/ICdvcGFjaXR5LTQwIHBvaW50ZXItZXZlbnRzLW5vbmUnIDogJyd9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBtYi0xXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJvbGQgdGV4dC1zbGF0ZS01MDBcIj57dCgnc3dfZGltX2JyaWdodG5lc3MnKX08L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1tb25vIHRleHQteWVsbG93LTMwMCB0YWJ1bGFyLW51bXNcIj57TWF0aC5yb3VuZCgoY2ZnLmRhcmtMZXZlbCB8fCAyLjApICogMTAwKX0lPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cInBzeS1jZmctZGFyay1sZXZlbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBtaW49XCIxLjVcIiBtYXg9XCIyLjhcIiBzdGVwPVwiMC4wMlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Y2ZnLnRoZW1lID09PSAnbGlnaHQnID8gMi4wIDogKGNmZy5kYXJrTGV2ZWwgfHwgMi4wKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0Q2ZnKGMgPT4gKHsuLi5jLCBkYXJrTGV2ZWw6IHBhcnNlRmxvYXQoZS50YXJnZXQudmFsdWUpLCB0aGVtZTonZGFyayd9KSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyYW5nZS1pbnB1dCB3LWZ1bGxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgYWNjZW50Q29sb3I6JyNmYWNjMTUnIH19Lz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0yIGl0YWxpY1wiPlxuICAgICAgICAgICAgICAgICAgICBBcHBsaWVkIHRvIHRoZSB3aG9sZSBkYXNoYm9hcmQuICBEaW0gaXMgcmVjb21tZW5kZWQgZm9yIGNvbnRyb2wgcm9vbXM7IExpZ2h0IGZvciBkYXl0aW1lIHdhbGstdGhyb3VnaHMuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBHaXZvbmkgdG9nZ2xlICovfVxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj57dCgnc3dfZ2l2b25pX2VuZ2luZScpfTwvZGl2PlxuICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gdXBkYXRlKCdnaXZvbmknLCAhY2ZnLmdpdm9uaSl9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B3LWZ1bGwgcHktMyByb3VuZGVkLXhsIHRleHQtc20gZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2NmZy5naXZvbmlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1pbmRpZ28tNjAwIHRleHQtd2hpdGUgc2hhZG93LWxnIHNoYWRvdy1pbmRpZ28tNTAwLzMwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLXNsYXRlLTgwMCB0ZXh0LXNsYXRlLTQwMCBib3JkZXIgYm9yZGVyLXNsYXRlLTcwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgIHtjZmcuZ2l2b25pID8gdCgnc3dfZ2l2b25pX29uJykgOiB0KCdzd19naXZvbmlfb2ZmJyl9XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbXQtMiBsZWFkaW5nLXJlbGF4ZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgT3ZlcmxheXMgdGhlIDQgY2xpbWF0ZS1zdHJhdGVneSByZWdpb25zIChDb21mb3J0LCBOYXQgVmVudCwgRXZhcCwgTWVjaCBDb29sKS5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIFJIIHJhbmdlICovfVxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj57dCgnc3dfcmhfc3dlZXRfc3BvdCcpfTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItM1wiPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJvbGQgdGV4dC1zbGF0ZS01MDAgbWItMSBibG9ja1wiPnt0KCdzd192ZW51ZV9wcmVzZXQnKX08L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0IGN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Y2ZnLnJoUHJlc2V0IHx8ICdjdXN0b20nfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwID0gUkhfUFJFU0VUUy5maW5kKHAgPT4gcC5pZCA9PT0gZS50YXJnZXQudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXApIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHAuaWQgPT09ICdjdXN0b20nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGUoJ3JoUHJlc2V0JywgJ2N1c3RvbScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCByaFByZXNldDpwLmlkLCByaExvOnAubG8sIHJoSGk6cC5oaX0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAge1JIX1BSRVNFVFMubWFwKHAgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtwLmlkfSB2YWx1ZT17cC5pZH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtwLmxhYmVsfXtwLmxvICE9IG51bGwgPyBgICDCtyAgJHtwLmxvfS0ke3AuaGl9JSBSSGAgOiAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgeygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwID0gUkhfUFJFU0VUUy5maW5kKHggPT4geC5pZCA9PT0gKGNmZy5yaFByZXNldCB8fCAnY3VzdG9tJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHAgJiYgcC5ub3RlID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTEuNSBpdGFsaWNcIj57cC5ub3RlfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICkgOiBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9KSgpfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTMgbWItMlwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtbW9ubyB0ZXh0LXNsYXRlLTQwMCB3LTEwXCI+e2NmZy5yaExvfSU8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49XCIyMFwiIG1heD17Y2ZnLnJoSGktNX0gdmFsdWU9e2NmZy5yaExvfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIHJoTG86K2UudGFyZ2V0LnZhbHVlLCByaFByZXNldDonY3VzdG9tJ30pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLWlucHV0IGZsZXgtMVwiLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1tb25vIHRleHQtc2xhdGUtNDAwIHctMTBcIj57Y2ZnLnJoSGl9JTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj17Y2ZnLnJoTG8rNX0gbWF4PVwiOTBcIiB2YWx1ZT17Y2ZnLnJoSGl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldENmZyhjID0+ICh7Li4uYywgcmhIaTorZS50YXJnZXQudmFsdWUsIHJoUHJlc2V0OidjdXN0b20nfSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2UtaW5wdXQgZmxleC0xXCIvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBBeGlzIHJhbmdlICovfVxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj57dCgnc3dfdGVtcF9heGlzX3JhbmdlJyl9PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMyBtYi0yXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1tb25vIHRleHQtc2xhdGUtNDAwIHctMTBcIj57Y2ZnLnRMb33CsDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj1cIi00MFwiIG1heD17Y2ZnLnRIaS0xMH0gdmFsdWU9e2NmZy50TG99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZSgndExvJywgK2UudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLWlucHV0IGZsZXgtMVwiLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1tb25vIHRleHQtc2xhdGUtNDAwIHctMTBcIj57Y2ZnLnRIaX3CsDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj17Y2ZnLnRMbysxMH0gbWF4PVwiNjBcIiB2YWx1ZT17Y2ZnLnRIaX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlKCd0SGknLCArZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2UtaW5wdXQgZmxleC0xXCIvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTIgbGVhZGluZy1yZWxheGVkXCI+XG4gICAgICAgICAgICAgICAgICAgIENoYXJ0IHdpbGwgYmUgcmVkcmF3biB3aXRoIHRoaXMgZHJ5LWJ1bGIgdGVtcGVyYXR1cmUgd2luZG93LlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvcmRlci10IGJvcmRlci1zbGF0ZS04MDAgcHQtNFwiPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgICAgICBDaGFuZ2VzIHByZXZpZXcgbGl2ZSBpbiB0aGUgc2tlbGV0b24gY2hhcnQgb24gdGhlIGxlZnQuICBIaXRcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1pbmRpZ28tNDAwIGZvbnQtYmxhY2tcIj4gU2F2ZSAmIHJldHVybiA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIGluIHRoZSBoZWFkZXIgd2hlbiB5b3UncmUgaGFwcHkuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIExvY2F0aW9uIFNldHRpbmcgLS0gbW9kYWwgdy8gaW50ZXJhY3RpdmUgTGVhZmxldCBtYXAgKyByZXZlcnNlIGdlb2NvZGluZ1xuICogQ2xpY2sgYW55d2hlcmUgb24gdGhlIG1hcCAob3IgZHJhZyB0aGUgbWFya2VyKSB0byBzZXQgbGF0L2xvbi5cbiAqIE1hbnVhbCBsYXQvbG9uIGVkaXRzIHJlLWNlbnRyZSB0aGUgbWFya2VyLiAgQ2l0eSBuYW1lIGlzIGF1dG8tcG9wdWxhdGVkXG4gKiB2aWEgT3BlblN0cmVldE1hcCBOb21pbmF0aW0gKG5vIGtleSByZXF1aXJlZCwgcmF0ZS1saW1pdGVkIHRvIH4xIHJlcS9zKS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyogRGUtZHVwICsgc2FuaXR5LWNoZWNrIGEgcmF3IHNhdmVkLWxvY2F0aW9ucyBhcnJheSAoZnJvbSBzZXJ2ZXIgb3JcbiAqIGxvY2FsU3RvcmFnZSkuICBEZWR1cCBrZXkgaXMgYGxhdC50b0ZpeGVkKDQpLGxvbi50b0ZpeGVkKDQpYCAtLSB0aGVcbiAqIFNBTUUga2V5IHRoZSBkYXNoYm9hcmQncyB3ZWF0aGVyLXNldHRpbmdzLW1vZGFsLmpzIHVzZXMgLS0gc28gdGhlXG4gKiBTZXR1cCBXYWxrIGRyb3Bkb3duIHNob3dzIHRoZSBleGFjdCBzYW1lIHNldCB0aGUgb3BlcmF0b3Igc2VlcyBpblxuICogdGhlIGRhc2hib2FyZCdzIDNELVd4IFdlYXRoZXIgYnV0dG9uLiAgVHdvIGVudHJpZXMgdGhhdCBzaGFyZSBhIG5hbWVcbiAqIChlLmcuIFwiSE9NRVwiIGF0IHRoZSBvZmZpY2UgYW5kIFwiSE9NRVwiIGF0IHRoZSBhcGFydG1lbnQpIGJ1dCBoYXZlXG4gKiBkaWZmZXJlbnQgY29vcmRpbmF0ZXMgYXJlIEJPVEgga2VwdDsgb25seSB0cnVlIGNvb3JkIGR1cGxpY2F0ZXMgYXJlXG4gKiBjb2xsYXBzZWQuICBEcm9wcyBlbnRyaWVzIG1pc3NpbmcgYSBuYW1lIG9yIHdpdGggbm9uLWZpbml0ZSBsYXQvbG9uLiAqL1xuZnVuY3Rpb24gX25vcm1hbGl6ZUxvY3MoYXJyKSB7XG4gICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQoKTtcbiAgICBjb25zdCBvdXQgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGwgb2YgKGFyciB8fCBbXSkpIHtcbiAgICAgICAgaWYgKCFsIHx8IHR5cGVvZiBsLm5hbWUgIT09ICdzdHJpbmcnKSBjb250aW51ZTtcbiAgICAgICAgY29uc3QgbGF0ID0gK2wubGF0LCBsb24gPSArbC5sb247XG4gICAgICAgIGlmICghTnVtYmVyLmlzRmluaXRlKGxhdCkgfHwgIU51bWJlci5pc0Zpbml0ZShsb24pKSBjb250aW51ZTtcbiAgICAgICAgY29uc3QgbmFtZSA9IGwubmFtZS50cmltKCk7XG4gICAgICAgIGlmICghbmFtZSkgY29udGludWU7XG4gICAgICAgIGNvbnN0IGtleSA9IGxhdC50b0ZpeGVkKDQpICsgJywnICsgbG9uLnRvRml4ZWQoNCk7XG4gICAgICAgIGlmIChzZWVuLmhhcyhrZXkpKSBjb250aW51ZTtcbiAgICAgICAgc2Vlbi5hZGQoa2V5KTtcbiAgICAgICAgb3V0LnB1c2goeyBuYW1lLCBsYXQsIGxvbiB9KTtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gTG9jYXRpb25Nb2RhbCh7IGNmZywgc2V0Q2ZnLCBvbkNsb3NlLCBvblNhdmUgfSkge1xuICAgIGNvbnN0IG1hcEJveFJlZiA9IFJlYWN0LnVzZVJlZihudWxsKTtcbiAgICBjb25zdCBtYXBSZWYgICAgPSBSZWFjdC51c2VSZWYobnVsbCk7XG4gICAgY29uc3QgbWFya2VyUmVmID0gUmVhY3QudXNlUmVmKG51bGwpO1xuICAgIGNvbnN0IFtnZW9CdXN5LCBzZXRHZW9CdXN5XSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcblxuICAgIC8qIC0tLS0tIHNhdmVkIGxvY2F0aW9ucyAtLSBtaXJyb3Igd2hhdCB0aGUgRGFzaGJvYXJkJ3MgV2VhdGhlciBidXR0b24gc2hvd3MuXG4gICAgICpcbiAgICAgKiBUaGUgZGFzaGJvYXJkIHJlYWRzIHRoZW0gZnJvbSBgJHtBUElfVVJMfS9hcGkvd2VhdGhlci1sb2NhdGlvbmAnc1xuICAgICAqIGBzYXZlZGAgYXJyYXkgYW5kIG1pcnJvcnMgdGhhdCBpbnRvIGxvY2FsU3RvcmFnZVsnc2F2ZWRXZWF0aGVyTG9jYXRpb25zJ11cbiAgICAgKiBvbiBtb3VudCAoc2VlIHB1YmxpYy9qcy9kYXNoYm9hcmQvYXBwLmpzI2h5ZHJhdGVXZWF0aGVyU3RhdGUpLiAgV2UgZG9cbiAgICAgKiB0aGUgU0FNRSB0aGluZyBoZXJlIHNvIHRoZSBTZXR1cCBXYWxrJ3MgU2l0ZS1uYW1lIGRyb3Bkb3duIHN0YXlzXG4gICAgICogYnl0ZS1pZGVudGljYWwgd2l0aCB0aGUgZGFzaGJvYXJkJ3MgbG9jYXRpb24gbGlzdCAtLSBpbmNsdWRpbmcgd2hlbiB0aGVcbiAgICAgKiBvcGVyYXRvciB2aXNpdHMgU2V0dXAgV2FsayBCRUZPUkUgZXZlciBvcGVuaW5nIHRoZSBkYXNoYm9hcmQgKGZyZXNoXG4gICAgICogZGV2aWNlIGNhc2Ugd2hlcmUgbG9jYWxTdG9yYWdlIGlzIGVtcHR5KS5cbiAgICAgKlxuICAgICAqIFN0cmF0ZWd5OlxuICAgICAqICAgMSkgUmVhZCBsb2NhbFN0b3JhZ2UgZmlyc3QgKGluc3RhbnQsIG5vIGZsaWNrZXIgaWYgYWxyZWFkeSBoeWRyYXRlZCkuXG4gICAgICogICAyKSBUaGVuIEdFVCAvYXBpL3dlYXRoZXItbG9jYXRpb24gKGNhbm9uaWNhbCwgY3Jvc3MtZGV2aWNlIHNvdXJjZSkuXG4gICAgICogICAzKSBXaGljaGV2ZXIgaXMgbm9uLWVtcHR5IHdpbnM7IHNlcnZlciB3aW5zIHRpZXMuXG4gICAgICpcbiAgICAgKiBGcmVlLWZvcm0gdHlwaW5nIGluIHRoZSBpbnB1dCBzdGlsbCB3b3JrcyAtLSB0aGUgZGF0YWxpc3QgaXMgc3VnZ2VzdGlvblxuICAgICAqIG9ubHksIHRoZSBpbnB1dCBuZXZlciByZXN0cmljdHMgdGhlIHZhbHVlLiAqL1xuICAgIGNvbnN0IFtzYXZlZExvY3MsIHNldFNhdmVkTG9jc10gPSBSZWFjdC51c2VTdGF0ZSgoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByYXcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2F2ZWRXZWF0aGVyTG9jYXRpb25zJyk7XG4gICAgICAgICAgICBpZiAoIXJhdykgcmV0dXJuIFtdO1xuICAgICAgICAgICAgY29uc3QgYXJyID0gSlNPTi5wYXJzZShyYXcpO1xuICAgICAgICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXJyKSA/IF9ub3JtYWxpemVMb2NzKGFycikgOiBbXTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyByZXR1cm4gW107IH1cbiAgICB9KTtcbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBsZXQgY2FuY2VsbGVkID0gZmFsc2U7XG4gICAgICAgIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCgnL2FwaS93ZWF0aGVyLWxvY2F0aW9uJywgeyBjcmVkZW50aWFsczonaW5jbHVkZScsIGNhY2hlOiduby1zdG9yZScgfSk7XG4gICAgICAgICAgICAgICAgaWYgKCFyLm9rKSByZXR1cm47XG4gICAgICAgICAgICAgICAgY29uc3QgaiA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNhdmVkID0gX25vcm1hbGl6ZUxvY3MoQXJyYXkuaXNBcnJheShqLnNhdmVkKSA/IGouc2F2ZWQgOiBbXSk7XG4gICAgICAgICAgICAgICAgaWYgKGNhbmNlbGxlZCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGlmIChzYXZlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFNhdmVkTG9jcyhzYXZlZCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIE1pcnJvciB0byBsb2NhbFN0b3JhZ2Ugc28gdGhlIGRhc2hib2FyZCBzZWVzIHRoZSBzYW1lIGxpc3RcbiAgICAgICAgICAgICAgICAgICAgLy8gZXZlbiBpZiBpdHMgb3duIGh5ZHJhdGUgaGFzbid0IHJ1biB5ZXQgdGhpcyBzZXNzaW9uLlxuICAgICAgICAgICAgICAgICAgICB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc2F2ZWRXZWF0aGVyTG9jYXRpb25zJywgSlNPTi5zdHJpbmdpZnkoc2F2ZWQpKTsgfSBjYXRjaCAoZSkge31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgZmFjaW5nID0gai5idWlsZGluZ19mYWNpbmc7XG4gICAgICAgICAgICAgICAgaWYgKGZhY2luZyAmJiBbJ2F1dG8nLCdOJywnTkUnLCdFJywnU0UnLCdTJywnU1cnLCdXJywnTlcnXS5pbmRleE9mKGZhY2luZykgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICBzZXRDZmcoYyA9PiAoeyAuLi5jLCBidWlsZGluZ0ZhY2luZzogZmFjaW5nIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDUuYnVpbGRpbmdfZmFjaW5nJywgZmFjaW5nKTsgfSBjYXRjaCAoZSkge31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7IC8qIG9mZmxpbmUgLT4gbG9jYWxTdG9yYWdlIHZhbHVlIGFscmVhZHkgaW4gc3RhdGUgKi8gfVxuICAgICAgICB9KSgpO1xuICAgICAgICByZXR1cm4gKCkgPT4geyBjYW5jZWxsZWQgPSB0cnVlOyB9O1xuICAgIH0sIFtdKTtcblxuICAgIC8qIC0tLS0tIHNhdmVkLWxvY2F0aW9ucyBkcm9wZG93biBvcGVuL2Nsb3NlIHN0YXRlLlxuICAgICAqIE5hdGl2ZSA8ZGF0YWxpc3Q+IGhpZGVzIGl0cyBjaGV2cm9uIGluIG1vc3QgYnJvd3NlcnMgKGVzcGVjaWFsbHkgaW5cbiAgICAgKiBhIGRhcmsgdGhlbWUpLCB3aGljaCBtYWRlIHRoZSBcImRyb3AgZG93blwiIGludmlzaWJsZSB0byBvcGVyYXRvcnNcbiAgICAgKiB3aG8gY2xlYXJseSBoYWQgbXVsdGlwbGUgc2F2ZWQgbG9jYXRpb25zLiAgUmVwbGFjZWQgd2l0aCBhIGN1c3RvbVxuICAgICAqIHBvcGRvd24gcGFuZWwgdGhhdCBoYXMgYW4gQUxXQVlTLVZJU0lCTEUgY2hldnJvbiBidXR0b24gLS0gY2xpY2sgaXRcbiAgICAgKiB0byB0b2dnbGUsIGNsaWNrIG91dHNpZGUgdG8gZGlzbWlzcy4gKi9cbiAgICBjb25zdCBbc2F2ZWRPcGVuLCBzZXRTYXZlZE9wZW5dID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IHNhdmVkUmVmID0gUmVhY3QudXNlUmVmKG51bGwpO1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmICghc2F2ZWRPcGVuKSByZXR1cm47XG4gICAgICAgIGNvbnN0IG9uRG9jQ2xpY2sgPSAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHNhdmVkUmVmLmN1cnJlbnQgJiYgIXNhdmVkUmVmLmN1cnJlbnQuY29udGFpbnMoZS50YXJnZXQpKSBzZXRTYXZlZE9wZW4oZmFsc2UpO1xuICAgICAgICB9O1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbkRvY0NsaWNrKTtcbiAgICAgICAgcmV0dXJuICgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spO1xuICAgIH0sIFtzYXZlZE9wZW5dKTtcblxuICAgIC8qIFdoZW4gdGhlIHVzZXIgcGlja3MgYSBuYW1lIGZyb20gdGhlIGRyb3Bkb3duIE9SIHR5cGVzIG9uZSB0aGF0XG4gICAgICogZXhhY3RseSBtYXRjaGVzIGEgc2F2ZWQgZW50cnksIHB1bGwgaXRzIGxhdC9sb24gYW5kIHJlY2VudHJlIHRoZVxuICAgICAqIG1hcC4gIEZyZWUtZm9ybSB0eXBpbmcgc3RpbGwgd29ya3MgLS0gdGhlIG5hbWUgaXMganVzdCBrZXB0IGFzIHRoZVxuICAgICAqIHNpdGUgbGFiZWwuICBBdm9pZHMgc3VycHJpc2luZyB0aGUgb3BlcmF0b3Igd2hvIHR5cGVzIFwiUGF2aWxpb24gQlwiXG4gICAgICogKGEgbGFiZWwgdGhleSBpbnZlbnRlZCkgYW5kIGV4cGVjdHMgdGhlIG1hcCBOT1QgdG8ganVtcC4gKi9cbiAgICBjb25zdCBvblNpdGVOYW1lQ2hhbmdlID0gKG5ld05hbWUpID0+IHtcbiAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBzaXRlTmFtZTpuZXdOYW1lfSkpO1xuICAgICAgICBjb25zdCBoaXQgPSBzYXZlZExvY3MuZmluZChzID0+IHMubmFtZSA9PT0gbmV3TmFtZSk7XG4gICAgICAgIGlmIChoaXQpIHtcbiAgICAgICAgICAgIGNvbnN0IGxhdCA9IE1hdGgucm91bmQoaGl0LmxhdCAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICAgICAgY29uc3QgbG9uID0gTWF0aC5yb3VuZChoaXQubG9uICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIHNpdGVOYW1lOm5ld05hbWUsIGxhdCwgbG9uLCBjaXR5Om5ld05hbWV9KSk7XG4gICAgICAgICAgICBpZiAobWFwUmVmLmN1cnJlbnQpIG1hcFJlZi5jdXJyZW50LnNldFZpZXcoW2xhdCwgbG9uXSwgMTEpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBwaWNrU2F2ZWRMb2MgPSAobG9jKSA9PiB7XG4gICAgICAgIHNldFNhdmVkT3BlbihmYWxzZSk7XG4gICAgICAgIG9uU2l0ZU5hbWVDaGFuZ2UobG9jLm5hbWUpO1xuICAgIH07XG5cbiAgICAvKiBSZW1vdmUgYSBzYXZlZCBsb2NhdGlvbiBmcm9tIHRoZSBsaXN0LiAgRGVkdXAta2V5ZWQgYnkgbGF0L2xvbiBzbyB0d29cbiAgICAgKiBlbnRyaWVzIHRoYXQgc2hhcmUgYSBuYW1lIChlLmcuIFwiSE9NRVwiIGF0IHRoZSBvZmZpY2UgdnMgdGhlIGFwYXJ0bWVudClcbiAgICAgKiBhcmUgYWRkcmVzc2VkIGluZGl2aWR1YWxseSAtLSByZW1vdmluZyBvbmUga2VlcHMgdGhlIG90aGVyLiAgTWlycm9yc1xuICAgICAqIHRoZSBjaGFuZ2UgdG8gbG9jYWxTdG9yYWdlIEFORCB0aGUgc2VydmVyIHNvIHRoZSBkYXNoYm9hcmQncyBXZWF0aGVyXG4gICAgICogYnV0dG9uIHNlZXMgdGhlIGRlbGV0aW9uIG9uIGl0cyBuZXh0IHJlYWQuICovXG4gICAgY29uc3QgcmVtb3ZlU2F2ZWRMb2MgPSAobG9jKSA9PiB7XG4gICAgICAgIGNvbnN0IGtleSA9IGxvYy5sYXQudG9GaXhlZCg0KSArICcsJyArIGxvYy5sb24udG9GaXhlZCg0KTtcbiAgICAgICAgY29uc3QgbmV4dCA9IHNhdmVkTG9jcy5maWx0ZXIocyA9PiAocy5sYXQudG9GaXhlZCg0KSArICcsJyArIHMubG9uLnRvRml4ZWQoNCkpICE9PSBrZXkpO1xuICAgICAgICBzZXRTYXZlZExvY3MobmV4dCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc2F2ZWRXZWF0aGVyTG9jYXRpb25zJywgSlNPTi5zdHJpbmdpZnkobmV4dCkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IC8qIHByaXZhdGUgbW9kZSAqLyB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3JlZDU6d2VhdGhlckxvY2F0aW9uQ2hhbmdlZCcsXG4gICAgICAgICAgICAgICAgeyBkZXRhaWw6IHsgc2F2ZWQ6IG5leHQgfSB9KSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgIC8qIEJlc3QtZWZmb3J0IHNlcnZlciBzeW5jLiAgQW5vbnltb3VzIHVzZXJzIGdldCBwZXJzaXN0ZWQ6ZmFsc2UgYmFjayxcbiAgICAgICAgICogd2hpY2ggaXMgZmluZSAtLSB0aGUgbG9jYWwgY29weSBhbHJlYWR5IHJlZmxlY3RzIHRoZSByZW1vdmFsLiAqL1xuICAgICAgICBmZXRjaCgnL2FwaS93ZWF0aGVyLWxvY2F0aW9uJywge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBjcmVkZW50aWFsczogJ2luY2x1ZGUnLFxuICAgICAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzonYXBwbGljYXRpb24vanNvbicgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgc2F2ZWQ6IG5leHQgfSksXG4gICAgICAgIH0pLmNhdGNoKCgpID0+IHsgLyogb2ZmbGluZSAtLSBsb2NhbFN0b3JhZ2UgYWxyZWFkeSB1cGRhdGVkICovIH0pO1xuICAgICAgICAvKiBJZiB0aGUgb3BlcmF0b3IganVzdCBkZWxldGVkIHRoZSBlbnRyeSBjdXJyZW50bHkgaW4gdGhlIGlucHV0LFxuICAgICAgICAgKiBibGFuayB0aGUgaW5wdXQgc28gYSBzdGFsZSBzZWxlY3Rpb24gaXNuJ3QgYWNjaWRlbnRhbGx5IHNhdmVkLiAqL1xuICAgICAgICBpZiAoKGNmZy5zaXRlTmFtZSB8fCAnJykudHJpbSgpID09PSBsb2MubmFtZSkge1xuICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBzaXRlTmFtZTonJ30pKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmV4dC5sZW5ndGggPT09IDApIHNldFNhdmVkT3BlbihmYWxzZSk7XG4gICAgfTtcblxuICAgIC8qIElubGluZSByZW5hbWU6IHR5cGluZyBpbnRvIGEgcm93J3MgbmFtZSBpbnB1dCB1cGRhdGVzIHRoZSBpbi1tZW1vcnlcbiAgICAgKiBgc2F2ZWRMb2NzYCBsaXN0IChOT1QgcGVyc2lzdGVkIHVudGlsIFwiU2F2ZSAmIFJldHVyblwiKS4gIEtleWVkIGJ5IHRoZVxuICAgICAqIHJvdydzIGxhdC9sb24gc28gdHdvIHNhbWUtbmFtZWQgZW50cmllcyBhdCBkaWZmZXJlbnQgY29vcmRpbmF0ZXMgY2FuXG4gICAgICogYmUgcmVuYW1lZCBpbmRlcGVuZGVudGx5LiAgVHJpbSBpcyBkZWxheWVkIHVudGlsIHBlcnNpc3Qgc28gdGhlXG4gICAgICogb3BlcmF0b3IgY2FuIGtlZXAgdHlwaW5nIHdpdGhvdXQgdGhlIGZpZWxkIFwic25hcHBpbmdcIiBtaWQtZWRpdC4gKi9cbiAgICBjb25zdCByZW5hbWVTYXZlZExvYyA9IChvcmlnTG9jLCBuZXdOYW1lKSA9PiB7XG4gICAgICAgIGNvbnN0IGtleSA9IG9yaWdMb2MubGF0LnRvRml4ZWQoNCkgKyAnLCcgKyBvcmlnTG9jLmxvbi50b0ZpeGVkKDQpO1xuICAgICAgICBzZXRTYXZlZExvY3MocHJldiA9PiBwcmV2Lm1hcChzID0+XG4gICAgICAgICAgICAocy5sYXQudG9GaXhlZCg0KSArICcsJyArIHMubG9uLnRvRml4ZWQoNCkpID09PSBrZXlcbiAgICAgICAgICAgICAgICA/IHsgLi4ucywgbmFtZTogbmV3TmFtZSB9XG4gICAgICAgICAgICAgICAgOiBzXG4gICAgICAgICkpO1xuICAgICAgICAvKiBJZiB0aGUgb3BlcmF0b3IgaXMgcmVuYW1pbmcgdGhlIGVudHJ5IHRoYXQgaXMgY3VycmVudGx5IHRoZVxuICAgICAgICAgKiBcImFjdGl2ZVwiIHBpY2sgKHNpdGVOYW1lIG1hdGNoZXMpLCBrZWVwIHRoZSBwaWNrZXIgaW4gc3luYy4gKi9cbiAgICAgICAgY29uc3Qgc3RpbGxTZWxlY3RlZCA9IChjZmcuc2l0ZU5hbWUgfHwgJycpLnRyaW0oKSA9PT0gb3JpZ0xvYy5uYW1lXG4gICAgICAgICAgICAmJiBNYXRoLmFicyhjZmcubGF0IC0gb3JpZ0xvYy5sYXQpIDwgMWUtNFxuICAgICAgICAgICAgJiYgTWF0aC5hYnMoY2ZnLmxvbiAtIG9yaWdMb2MubG9uKSA8IDFlLTQ7XG4gICAgICAgIGlmIChzdGlsbFNlbGVjdGVkKSB7XG4gICAgICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIHNpdGVOYW1lOm5ld05hbWUsIGNpdHk6bmV3TmFtZX0pKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKiAtLS0tLSBzZWFyY2ggc3RhdGUgLS0tLS0gKi9cbiAgICBjb25zdCBbc2VhcmNoUSwgc2V0U2VhcmNoUV0gICAgICAgICA9IFJlYWN0LnVzZVN0YXRlKCcnKTtcbiAgICBjb25zdCBbc2VhcmNoSGl0cywgc2V0U2VhcmNoSGl0c10gICA9IFJlYWN0LnVzZVN0YXRlKFtdKTtcbiAgICBjb25zdCBbc2VhcmNoQnVzeSwgc2V0U2VhcmNoQnVzeV0gICA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBbc2VhcmNoT3Blbiwgc2V0U2VhcmNoT3Blbl0gICA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBzZWFyY2hEZWJvdW5jZVJlZiAgICAgICAgICAgICA9IFJlYWN0LnVzZVJlZihudWxsKTtcblxuICAgIC8qIEZvcndhcmQtZ2VvY29kZTogcXVlcnkgLT4gW3tsYXQsIGxvbiwgZGlzcGxheV9uYW1lLCB0eXBlLCAuLi59XSAqL1xuICAgIGNvbnN0IHJ1blNlYXJjaCA9IGFzeW5jIChxKSA9PiB7XG4gICAgICAgIGlmICghcSB8fCBxLnRyaW0oKS5sZW5ndGggPCAzKSB7IHNldFNlYXJjaEhpdHMoW10pOyByZXR1cm47IH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNldFNlYXJjaEJ1c3kodHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBgaHR0cHM6Ly9ub21pbmF0aW0ub3BlbnN0cmVldG1hcC5vcmcvc2VhcmNoP2Zvcm1hdD1qc29uJmxpbWl0PTYmcT0ke2VuY29kZVVSSUNvbXBvbmVudChxKX1gO1xuICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwgeyBoZWFkZXJzOnsgJ0FjY2VwdCc6J2FwcGxpY2F0aW9uL2pzb24nIH0gfSk7XG4gICAgICAgICAgICBjb25zdCBqID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgICBzZXRTZWFyY2hIaXRzKEFycmF5LmlzQXJyYXkoaikgPyBqIDogW10pO1xuICAgICAgICAgICAgc2V0U2VhcmNoT3Blbih0cnVlKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBzZXRTZWFyY2hIaXRzKFtdKTsgfVxuICAgICAgICBmaW5hbGx5IHsgc2V0U2VhcmNoQnVzeShmYWxzZSk7IH1cbiAgICB9O1xuXG4gICAgLyogZGVib3VuY2VkIHNlYXJjaC1vbi10eXBlICovXG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKHNlYXJjaERlYm91bmNlUmVmLmN1cnJlbnQpIGNsZWFyVGltZW91dChzZWFyY2hEZWJvdW5jZVJlZi5jdXJyZW50KTtcbiAgICAgICAgc2VhcmNoRGVib3VuY2VSZWYuY3VycmVudCA9IHNldFRpbWVvdXQoKCkgPT4gcnVuU2VhcmNoKHNlYXJjaFEpLCA0MDApO1xuICAgICAgICByZXR1cm4gKCkgPT4gc2VhcmNoRGVib3VuY2VSZWYuY3VycmVudCAmJiBjbGVhclRpbWVvdXQoc2VhcmNoRGVib3VuY2VSZWYuY3VycmVudCk7XG4gICAgfSwgW3NlYXJjaFFdKTtcblxuICAgIGNvbnN0IHBpY2tTZWFyY2hIaXQgPSAoaGl0KSA9PiB7XG4gICAgICAgIGNvbnN0IGxhdCA9IE1hdGgucm91bmQoK2hpdC5sYXQgKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgY29uc3QgbG9uID0gTWF0aC5yb3VuZCgraGl0LmxvbiAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIGxhdCwgbG9uLCBjaXR5OmhpdC5kaXNwbGF5X25hbWV9KSk7XG4gICAgICAgIGlmIChtYXBSZWYuY3VycmVudCkgbWFwUmVmLmN1cnJlbnQuc2V0VmlldyhbbGF0LCBsb25dLCBoaXQudHlwZSA9PT0gJ2NpdHknID8gMTEgOiAxNSk7XG4gICAgICAgIHNldFNlYXJjaE9wZW4oZmFsc2UpO1xuICAgICAgICBzZXRTZWFyY2hRKCcnKTtcbiAgICB9O1xuXG4gICAgLyogUmV2ZXJzZS1nZW9jb2RlIGxhdC9sb24gLT4gY2l0eSAvIGNvdW50cnkgdmlhIE5vbWluYXRpbS4gIE5vIEFQSSBrZXkuICovXG4gICAgY29uc3QgcmV2ZXJzZUdlb2NvZGUgPSBhc3luYyAobGF0LCBsb24pID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNldEdlb0J1c3kodHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBgaHR0cHM6Ly9ub21pbmF0aW0ub3BlbnN0cmVldG1hcC5vcmcvcmV2ZXJzZT9mb3JtYXQ9anNvbiZsYXQ9JHtsYXR9Jmxvbj0ke2xvbn0mem9vbT0xMGA7XG4gICAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7IGhlYWRlcnM6IHsgJ0FjY2VwdCc6J2FwcGxpY2F0aW9uL2pzb24nIH0gfSk7XG4gICAgICAgICAgICBjb25zdCBqID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgICBjb25zdCBhID0gai5hZGRyZXNzIHx8IHt9O1xuICAgICAgICAgICAgY29uc3QgY2l0eSA9IGEuY2l0eSB8fCBhLnRvd24gfHwgYS52aWxsYWdlIHx8IGEuaGFtbGV0IHx8IGEuY291bnR5IHx8ICcnO1xuICAgICAgICAgICAgY29uc3QgcmVnaW9uID0gYS5zdGF0ZSB8fCBhLnJlZ2lvbiB8fCAnJztcbiAgICAgICAgICAgIGNvbnN0IGNvdW50cnkgPSBhLmNvdW50cnkgfHwgJyc7XG4gICAgICAgICAgICBjb25zdCBsYWJlbCA9IFtjaXR5LCByZWdpb24sIGNvdW50cnldLmZpbHRlcihCb29sZWFuKS5qb2luKCcsICcpIHx8IGouZGlzcGxheV9uYW1lIHx8ICcnO1xuICAgICAgICAgICAgaWYgKGxhYmVsKSBzZXRDZmcoYyA9PiAoey4uLmMsIGNpdHk6bGFiZWx9KSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogb2ZmbGluZSBvciByYXRlLWxpbWl0ZWQgLT4ga2VlcCBwcmlvciBuYW1lICovIH1cbiAgICAgICAgZmluYWxseSB7IHNldEdlb0J1c3koZmFsc2UpOyB9XG4gICAgfTtcblxuICAgIC8qIEluaXQgTGVhZmxldCBvbiBmaXJzdCByZW5kZXIgb2YgdGhlIG1vZGFsICovXG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKCFtYXBCb3hSZWYuY3VycmVudCB8fCBtYXBSZWYuY3VycmVudCkgcmV0dXJuO1xuICAgICAgICBjb25zdCBtYXAgPSBMLm1hcChtYXBCb3hSZWYuY3VycmVudCwgeyB6b29tQ29udHJvbDogdHJ1ZSwgYXR0cmlidXRpb25Db250cm9sOiB0cnVlIH0pXG4gICAgICAgICAgICAgICAgICAgICAuc2V0VmlldyhbY2ZnLmxhdCwgY2ZnLmxvbl0sIDYpO1xuICAgICAgICBMLnRpbGVMYXllcignaHR0cHM6Ly97c30udGlsZS5vcGVuc3RyZWV0bWFwLm9yZy97en0ve3h9L3t5fS5wbmcnLCB7XG4gICAgICAgICAgICBtYXhab29tOiAxOCxcbiAgICAgICAgICAgIGF0dHJpYnV0aW9uOiAnJmNvcHk7IE9wZW5TdHJlZXRNYXAgY29udHJpYnV0b3JzJyxcbiAgICAgICAgfSkuYWRkVG8obWFwKTtcblxuICAgICAgICBjb25zdCBtYXJrZXIgPSBMLm1hcmtlcihbY2ZnLmxhdCwgY2ZnLmxvbl0sIHsgZHJhZ2dhYmxlOiB0cnVlIH0pLmFkZFRvKG1hcCk7XG4gICAgICAgIG1hcmtlci5iaW5kVG9vbHRpcCgnRHJhZyBtZSBvciBjbGljayBhbnl3aGVyZSBvbiB0aGUgbWFwJywgeyBwZXJtYW5lbnQ6IGZhbHNlIH0pO1xuXG4gICAgICAgIGNvbnN0IGFwcGx5TGF0TG9uID0gKGxhdCwgbG9uKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByID0gKG4pID0+IE1hdGgucm91bmQobiAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBsYXQ6cihsYXQpLCBsb246cihsb24pfSkpO1xuICAgICAgICAgICAgcmV2ZXJzZUdlb2NvZGUocihsYXQpLCByKGxvbikpO1xuICAgICAgICB9O1xuICAgICAgICBtYXJrZXIub24oJ2RyYWdlbmQnLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsbCA9IG1hcmtlci5nZXRMYXRMbmcoKTtcbiAgICAgICAgICAgIGFwcGx5TGF0TG9uKGxsLmxhdCwgbGwubG5nKTtcbiAgICAgICAgfSk7XG4gICAgICAgIG1hcC5vbignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgbWFya2VyLnNldExhdExuZyhlLmxhdGxuZyk7XG4gICAgICAgICAgICBhcHBseUxhdExvbihlLmxhdGxuZy5sYXQsIGUubGF0bG5nLmxuZyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1hcFJlZi5jdXJyZW50ID0gbWFwO1xuICAgICAgICBtYXJrZXJSZWYuY3VycmVudCA9IG1hcmtlcjtcblxuICAgICAgICAvKiBMZWFmbGV0IHJlbmRlcnMgYmxhbmsgaWYgaXQgYm9vdHMgaW5zaWRlIGEgaGlkZGVuIGVsZW1lbnQg4oCUIGtpY2sgaXRcbiAgICAgICAgICAgb25jZSB0aGUgbW9kYWwgYW5pbWF0aW9uIHNldHRsZXMuICovXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gbWFwLmludmFsaWRhdGVTaXplKCksIDI1MCk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7IG1hcC5yZW1vdmUoKTsgbWFwUmVmLmN1cnJlbnQgPSBudWxsOyBtYXJrZXJSZWYuY3VycmVudCA9IG51bGw7IH07XG4gICAgfSwgW10pO1xuXG4gICAgLyogS2VlcCBtYXJrZXIgaW4gc3luYyB3aGVuIHVzZXIgZWRpdHMgbGF0L2xvbiBmaWVsZHMgbWFudWFsbHkgKi9cbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAobWFwUmVmLmN1cnJlbnQgJiYgbWFya2VyUmVmLmN1cnJlbnQpIHtcbiAgICAgICAgICAgIG1hcmtlclJlZi5jdXJyZW50LnNldExhdExuZyhbY2ZnLmxhdCwgY2ZnLmxvbl0pO1xuICAgICAgICAgICAgbWFwUmVmLmN1cnJlbnQucGFuVG8oW2NmZy5sYXQsIGNmZy5sb25dKTtcbiAgICAgICAgfVxuICAgIH0sIFtjZmcubGF0LCBjZmcubG9uXSk7XG5cbiAgICAvKiBHZW9sb2NhdGlvbjogc2lsZW50bHkgbm8tb3AnZCBiZWZvcmUgLS0gaWYgdGhlIGJyb3dzZXIgYmxvY2tlZCB0aGVcbiAgICAgKiByZXF1ZXN0IChIVFRQIG9yaWdpbiA9IG5vdCBhIHNlY3VyZSBjb250ZXh0IG9uIGZpZWxkIGNvbnRyb2xsZXJzLCBvclxuICAgICAqIHRoZSB1c2VyIGRlbmllZCBwZXJtaXNzaW9uIGVhcmxpZXIpIHRoZSBidXR0b24ganVzdCBzYXQgdGhlcmUuXG4gICAgICogTm93IHdlIHN1cmZhY2UgYSBzdGF0ZSAoYnVzeSAvIGVycikgc28gdGhlIG9wZXJhdG9yIGNhbiBzZWUgV0hZIGl0XG4gICAgICogZmFpbGVkIGFuZCBhY3Qgb24gaXQgKHN3aXRjaCB0byBIVFRQUywgcmUtcHJvbXB0LCBvciB1c2UgdGhlIG1hcCkuICovXG4gICAgY29uc3QgW2dlb1N0YXRlLCBzZXRHZW9TdGF0ZV0gPSBSZWFjdC51c2VTdGF0ZShudWxsKTsgICAvLyBudWxsIHwgJ2J1c3knIHwge2Vycn1cbiAgICBjb25zdCB1c2VNeUxvY2F0aW9uID0gKCkgPT4ge1xuICAgICAgICBzZXRHZW9TdGF0ZSgnYnVzeScpO1xuICAgICAgICAvLyBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24gaXMgYHVuZGVmaW5lZGAgb24gSFRUUCBvcmlnaW5zIChDaHJvbWUgNTArKS5cbiAgICAgICAgaWYgKCFuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pIHtcbiAgICAgICAgICAgIHNldEdlb1N0YXRlKHsgZXJyOidCcm93c2VyIGJsb2NrZWQgbG9jYXRpb24gYWNjZXNzIOKAlCBvcGVuIHRoaXMgcGFnZSB2aWEgSFRUUFMuJyB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKFxuICAgICAgICAgICAgKHBvcykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhdCA9IE1hdGgucm91bmQocG9zLmNvb3Jkcy5sYXRpdHVkZSAgKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgICAgICAgICBjb25zdCBsb24gPSBNYXRoLnJvdW5kKHBvcy5jb29yZHMubG9uZ2l0dWRlICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBsYXQsIGxvbn0pKTtcbiAgICAgICAgICAgICAgICBpZiAobWFwUmVmLmN1cnJlbnQpIG1hcFJlZi5jdXJyZW50LnNldFZpZXcoW2xhdCwgbG9uXSwgMTEpO1xuICAgICAgICAgICAgICAgIHJldmVyc2VHZW9jb2RlKGxhdCwgbG9uKTtcbiAgICAgICAgICAgICAgICBzZXRHZW9TdGF0ZShudWxsKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gZXJyLmNvZGU6IDE9UEVSTUlTU0lPTl9ERU5JRUQsIDI9UE9TSVRJT05fVU5BVkFJTEFCTEUsIDM9VElNRU9VVFxuICAgICAgICAgICAgICAgIGNvbnN0IG1zZyA9IGVyciAmJiBlcnIuY29kZSA9PT0gMVxuICAgICAgICAgICAgICAgICAgICA/ICdMb2NhdGlvbiBwZXJtaXNzaW9uIGRlbmllZCDigJQgY2xpY2sgdGhlIGxvY2sgaWNvbiBpbiB0aGUgYWRkcmVzcyBiYXIgYW5kIGFsbG93IGxvY2F0aW9uLidcbiAgICAgICAgICAgICAgICAgICAgOiBlcnIgJiYgZXJyLmNvZGUgPT09IDJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gJ0xvY2F0aW9uIGN1cnJlbnRseSB1bmF2YWlsYWJsZSDigJQgdGhlIGRldmljZSBoYXMgbm8gR1BTIC8gV2ktRmkgZml4IHlldC4nXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGVyciAmJiBlcnIuY29kZSA9PT0gM1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ0xvY2F0aW9uIHJlcXVlc3QgdGltZWQgb3V0IOKAlCB0cnkgYWdhaW4sIG9yIHVzZSB0aGUgbWFwIC8gc2VhcmNoIGJhci4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAoZXJyICYmIGVyci5tZXNzYWdlKSB8fCAnQ291bGQgbm90IHJlYWQgZGV2aWNlIGxvY2F0aW9uLic7XG4gICAgICAgICAgICAgICAgc2V0R2VvU3RhdGUoeyBlcnI6IG1zZyB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7IGVuYWJsZUhpZ2hBY2N1cmFjeTp0cnVlLCB0aW1lb3V0OjEwMDAwLCBtYXhpbXVtQWdlOjAgfVxuICAgICAgICApO1xuICAgIH07XG5cbiAgICAvKiBXaGVuIHVzZXIgY2xpY2tzIFwiU2F2ZSAmIHJldHVyblwiLCBtaXJyb3IgRVhBQ1RMWSB3aGF0IHRoZSBkYXNoYm9hcmQnc1xuICAgICAqIFdlYXRoZXIgYnV0dG9uIGRvZXMgaW4gd2VhdGhlci1zZXR0aW5ncy1tb2RhbC5qcyNzZWxlY3RMb2NhdGlvbjpcbiAgICAgKiAgIDEuIGxvY2FsU3RvcmFnZVsnd2VhdGhlckxvY2F0aW9uJ10gICAgICAgID0gY2hvc2VuIGxvYyAoY2Fub25pY2FsIGtleVxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBkYXNoYm9hcmQgcmVhZHMgb25cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3VudCwgTk9UICdyZWQ1LndlYXRoZXJfbG9jYXRpb24nKS5cbiAgICAgKiAgIDIuIGxvY2FsU3RvcmFnZVsnc2F2ZWRXZWF0aGVyTG9jYXRpb25zJ10gID0gW2xvYywgLi4ub3RoZXJzXSBkZWR1cGVkXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnkgbGF0L2xvbiwgY2FwcGVkIGF0IDIwLlxuICAgICAqICAgMy4gUE9TVCAvYXBpL3dlYXRoZXItbG9jYXRpb24gd2l0aCBhY3RpdmUrZGVmYXVsdCtzYXZlZCBzbyB0aGUgc2FtZVxuICAgICAqICAgICAgbGlzdCBzdXJ2aXZlcyBjcm9zcy1kZXZpY2Ugc2Vzc2lvbnMgZm9yIHNpZ25lZC1pbiB0ZW5hbnRzLlxuICAgICAqXG4gICAgICogV2l0aG91dCBzdGVwIDEgdGhlIGRhc2hib2FyZCdzIGB3ZWF0aGVyTG9jYXRpb25gIHN0YXRlIHNpbGVudGx5IGtlZXBzXG4gICAgICogaXRzIG9sZCB2YWx1ZSAtLSB3aGljaCBpcyBleGFjdGx5IHRoZSBidWcgb3BlcmF0b3JzIHJlcG9ydGVkIGFmdGVyXG4gICAgICogcGlja2luZyBhIGxvY2F0aW9uIGluIFNldHVwIFdhbGsgYW5kIHNlZWluZyB0aGUgZGFzaGJvYXJkJ3Mgd2VhdGhlclxuICAgICAqIHN0cmlwIHJlZnVzZSB0byB1cGRhdGUuICovXG4gICAgY29uc3QgW3NhdmVNc2csIHNldFNhdmVNc2ddID0gUmVhY3QudXNlU3RhdGUobnVsbCk7XG4gICAgY29uc3QgcGVyc2lzdEFuZFNhdmUgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGxvYyA9IHsgbGF0OiBjZmcubGF0LCBsb246IGNmZy5sb24sIG5hbWU6IGNmZy5zaXRlTmFtZSB8fCBjZmcuY2l0eSB9O1xuXG4gICAgICAgIC8vIERlLWR1cCB0aGUgZXhpc3Rpbmcgc2F2ZWQgbGlzdCBieSBsYXQvbG9uIChzYW1lIGtleSB0aGUgZGFzaGJvYXJkXG4gICAgICAgIC8vIHVzZXMpIGFuZCBwdXQgdGhlIG5ldyBwaWNrIGF0IHRoZSB0b3AuICBDYXAgYXQgMjAgdG8gbWF0Y2ggdGhlXG4gICAgICAgIC8vIGRhc2hib2FyZCdzIGJlaGF2aW91ci5cbiAgICAgICAgY29uc3Qga2V5ID0gbG9jLmxhdC50b0ZpeGVkKDQpICsgJywnICsgbG9jLmxvbi50b0ZpeGVkKDQpO1xuICAgICAgICBjb25zdCBkZWR1cGVkID0gc2F2ZWRMb2NzLmZpbHRlcihsID0+IChsLmxhdC50b0ZpeGVkKDQpICsgJywnICsgbC5sb24udG9GaXhlZCg0KSkgIT09IGtleSk7XG4gICAgICAgIGNvbnN0IG5leHRTYXZlZCA9IFtsb2MsIC4uLmRlZHVwZWRdLnNsaWNlKDAsIDIwKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3dlYXRoZXJMb2NhdGlvbicsIEpTT04uc3RyaW5naWZ5KGxvYykpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3NhdmVkV2VhdGhlckxvY2F0aW9ucycsIEpTT04uc3RyaW5naWZ5KG5leHRTYXZlZCkpO1xuICAgICAgICAgICAgLy8gS2VlcCB0aGUgb2xkIGtleSB0b28gLS0gc29tZSBsZWdhY3kgcGx1Zy1pbnMgc3RpbGwgbG9vayBhdCBpdC5cbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1LndlYXRoZXJfbG9jYXRpb24nLCBKU09OLnN0cmluZ2lmeShsb2MpKTtcbiAgICAgICAgICAgIGNvbnN0IGZhY2luZyA9IGNmZy5idWlsZGluZ0ZhY2luZyB8fCAnYXV0byc7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS5idWlsZGluZ19mYWNpbmcnLCBmYWNpbmcpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IC8qIHByaXZhdGUgbW9kZSAtLSBpZ25vcmUgKi8gfVxuXG4gICAgICAgIGxldCBwZXJzaXN0ZWQgPSBmYWxzZSwgd2FybmluZyA9ICcnO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgZmFjaW5nID0gY2ZnLmJ1aWxkaW5nRmFjaW5nIHx8ICdhdXRvJztcbiAgICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCBmZXRjaCgnL2FwaS93ZWF0aGVyLWxvY2F0aW9uJywge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzonYXBwbGljYXRpb24vanNvbicgfSxcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGFjdGl2ZTogbG9jLCBkZWZhdWx0OiBsb2MsIHNhdmVkOiBuZXh0U2F2ZWQsIGJ1aWxkaW5nX2ZhY2luZzogZmFjaW5nIH0pLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBqID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgICB3aW5kb3cuX2xhc3RXZWF0aGVyTG9jYXRpb25TYXZlID0gajtcbiAgICAgICAgICAgIHBlcnNpc3RlZCA9ICEhai5wZXJzaXN0ZWQ7XG4gICAgICAgICAgICB3YXJuaW5nICAgPSBqLndhcm5pbmcgfHwgJyc7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ1tzZXR1cCB3YWxrXSAvYXBpL3dlYXRoZXItbG9jYXRpb24gPC0nLCBqKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgd2FybmluZyA9ICdOZXR3b3JrIGVycm9yIOKAlCBzYXZlZCBsb2NhbGx5IG9ubHkuJztcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignW3NldHVwIHdhbGtdIGNvdWxkIG5vdCBwZXJzaXN0IGxvY2F0aW9uOicsIGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGVsbCBhbnkgb3BlbiBkYXNoYm9hcmQgdGFiIHRvIHJlLWh5ZHJhdGUuICBUaGUgZGFzaGJvYXJkXG4gICAgICAgIC8vIGFscmVhZHkgbGlzdGVucyBmb3IgYHN0b3JhZ2VgIGV2ZW50cyB3aGVuIGFub3RoZXIgdGFiIHdyaXRlcyB0b1xuICAgICAgICAvLyBsb2NhbFN0b3JhZ2UsIGJ1dCBvbiBWMS45IHNvbWUgYnJvd3NlcnMgRE9OJ1QgZmlyZSBgc3RvcmFnZWAgZm9yXG4gICAgICAgIC8vIHNhbWUtb3JpZ2luIHdyaXRlcyBmcm9tIHRoaXMgc2FtZSB0YWIuICBBbiBleHBsaWNpdCBjdXN0b20gZXZlbnRcbiAgICAgICAgLy8gbWFrZXMgdGhlIGRhc2hib2FyZCdzIHBvbGxpbmcgcGljayB0aGUgY2hhbmdlIHVwIGltbWVkaWF0ZWx5IGlmXG4gICAgICAgIC8vIGl0J3MgYWxyZWFkeSBtb3VudGVkIGluIGFub3RoZXIgdGFiL3dpbmRvdy5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncmVkNTp3ZWF0aGVyTG9jYXRpb25DaGFuZ2VkJyxcbiAgICAgICAgICAgICAgICB7IGRldGFpbDogeyBhY3RpdmU6IGxvYywgc2F2ZWQ6IG5leHRTYXZlZCwgYnVpbGRpbmdfZmFjaW5nOiBjZmcuYnVpbGRpbmdGYWNpbmcgfHwgJ2F1dG8nIH0gfSkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IC8qIElFLWxlc3MgZW52aXJvbm1lbnRzIC0tIG5vLW9wICovIH1cblxuICAgICAgICBpZiAocGVyc2lzdGVkKSB7XG4gICAgICAgICAgICBvblNhdmUoKTsgICAgICAgICAgIC8vIGhhcHB5IHBhdGg6IGNsb3NlICsgbWFyayBzdGVwIGRvbmVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8qIFN1cmZhY2UgdGhlIHdhcm5pbmcsIGhvbGQgdGhlIG1vZGFsIG9wZW4gZm9yIDEuNnMgc28gdGhlXG4gICAgICAgICAgICAgKiBvcGVyYXRvciByZWFkcyBpdCwgdGhlbiBjbG9zZS4gIFRoZSBsb2NhbCBjb3B5IGlzIGFscmVhZHlcbiAgICAgICAgICAgICAqIHdyaXR0ZW4sIHNvIHRoZSBkYXNoYm9hcmQgd2lsbCBzdGlsbCBzZWUgdGhlIG5ldyBsb2NhdGlvblxuICAgICAgICAgICAgICogaW4gdGhpcyBicm93c2VyIHNlc3Npb24uICovXG4gICAgICAgICAgICBzZXRTYXZlTXNnKHdhcm5pbmcgfHwgJ1NhdmVkIGxvY2FsbHkgb25seSDigJQgc2lnbiBpbiB0byBzYXZlIHNlcnZlci1zaWRlLicpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHNldFNhdmVNc2cobnVsbCk7IG9uU2F2ZSgpOyB9LCAxNjAwKTtcbiAgICAgICAgfVxuICAgIH07XG5cblxuICAgIHJldHVybiAoXG4gICAgICAgIDxNb2RhbFNoZWxsIHRpdGxlPXt0KCdzd19sb2NhdGlvbl9zZXR0aW5nJyl9IHN1YnRpdGxlPXt0KCdzd19sb2NhdGlvbl9zdWInKX0gYWNjZW50PVwiYW1iZXJcIiBvbkNsb3NlPXtvbkNsb3NlfSBvblNhdmU9e3BlcnNpc3RBbmRTYXZlfSBzaXplPVwibWF4XCI+XG4gICAgICAgICAgICB7c2F2ZU1zZyAmJiAoXG4gICAgICAgICAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cImxvYy1zYXZlLW1zZ1wiXG4gICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtYi0zIHB4LTQgcHktMi41IHJvdW5kZWQtbGcgYmctYW1iZXItOTAwLzMwIGJvcmRlciBib3JkZXItYW1iZXItNzAwLzUwIHRleHQtYW1iZXItMjAwIHRleHQteHMgZm9udC1tb25vXCI+XG4gICAgICAgICAgICAgICAgICAgIOKaoCAge3NhdmVNc2d9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIGxnOmdyaWQtY29scy1bMWZyXzM0MHB4XSBnYXAtNCBoLWZ1bGxcIiBzdHlsZT17e21pbkhlaWdodDonNTZ2aCd9fT5cbiAgICAgICAgICAgICAgICB7LyogTUFQIOKAlCBmaWxscyB0aGUgbGVmdCBzaWRlLCB3aXRoIGEgc2VhcmNoIGJhciBmbG9hdGluZyBvbiB0b3AgKi99XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZVwiIHN0eWxlPXt7bWluSGVpZ2h0Oic1NnZoJ319PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHJlZj17bWFwQm94UmVmfVxuICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGhlaWdodDonMTAwJScsIG1pbkhlaWdodDonNTZ2aCcsIHdpZHRoOicxMDAlJywgYm9yZGVyUmFkaXVzOicxMnB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzonaGlkZGVuJywgYm9yZGVyOicxcHggc29saWQgIzMzNDE1NScsIGJhY2tncm91bmQ6JyMwYjEyMjAnIH19Lz5cblxuICAgICAgICAgICAgICAgICAgICB7LyogU2VhcmNoIGJhciBvdmVybGF5IOKAlCBzaXRzIGluIHRoZSB0b3AtY2VudHJlIG9mIHRoZSBtYXAgKi99XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgdG9wLTMgbGVmdC0xLzIgLXRyYW5zbGF0ZS14LTEvMiB6LVs1MDBdXCIgc3R5bGU9e3t3aWR0aDonbWluKDU2MHB4LCBjYWxjKDEwMCUgLSAxMTBweCkpJ319PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtzZWFyY2hRfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldFNlYXJjaFEoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkZvY3VzPXsoKSA9PiBzZWFyY2hIaXRzLmxlbmd0aCAmJiBzZXRTZWFyY2hPcGVuKHRydWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIvCflI4gIFNlYXJjaCBieSBhZGRyZXNzLCBidWlsZGluZywgb3IgcGxhY2UgbmFtZeKAplwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBweC00IHB5LTIuNSByb3VuZGVkLXhsIGJnLXNsYXRlLTkwMC85NSBib3JkZXIgYm9yZGVyLXNsYXRlLTYwMCB0ZXh0LXNsYXRlLTEwMCB0ZXh0LXNtIHBsYWNlaG9sZGVyLXNsYXRlLTUwMCBzaGFkb3ctMnhsIGJhY2tkcm9wLWJsdXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e291dGxpbmU6J25vbmUnfX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWFyY2hCdXN5ICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYWJzb2x1dGUgcmlnaHQtMyB0b3AtMS8yIC10cmFuc2xhdGUteS0xLzIgdGV4dC1hbWJlci00MDAgdGV4dC14c1wiPuKApjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWFyY2hPcGVuICYmIHNlYXJjaEhpdHMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgdG9wLWZ1bGwgbGVmdC0wIHJpZ2h0LTAgbXQtMSBiZy1zbGF0ZS05MDAvOTcgYm9yZGVyIGJvcmRlci1zbGF0ZS03MDAgcm91bmRlZC14bCBzaGFkb3ctMnhsIG92ZXJmbG93LWhpZGRlbiBtYXgtaC03MiBvdmVyZmxvdy15LWF1dG8gYmFja2Ryb3AtYmx1clwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlYXJjaEhpdHMubWFwKChoLCBpKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e2gucGxhY2VfaWQgfHwgaX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHBpY2tTZWFyY2hIaXQoaCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgdGV4dC1sZWZ0IHB4LTQgcHktMi41IGhvdmVyOmJnLWFtYmVyLTkwMC8zMCBib3JkZXItYiBib3JkZXItc2xhdGUtODAwIGxhc3Q6Ym9yZGVyLWItMCB0cmFuc2l0aW9uLWFsbFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC1zbGF0ZS0yMDAgdHJ1bmNhdGVcIj57aC5kaXNwbGF5X25hbWV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBtdC0wLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtoLnR5cGUgfHwgaC5jbGFzc30gwrcgeygraC5sYXQpLnRvRml4ZWQoMyl9LCB7KCtoLmxvbikudG9GaXhlZCgzKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VhcmNoT3BlbiAmJiBzZWFyY2hIaXRzLmxlbmd0aCA9PT0gMCAmJiBzZWFyY2hRLmxlbmd0aCA+PSAzICYmICFzZWFyY2hCdXN5ICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSB0b3AtZnVsbCBsZWZ0LTAgcmlnaHQtMCBtdC0xIGJnLXNsYXRlLTkwMC85NyBib3JkZXIgYm9yZGVyLXNsYXRlLTcwMCByb3VuZGVkLXhsIHB4LTQgcHktMyB0ZXh0LXhzIHRleHQtc2xhdGUtNDAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBObyByZXN1bHRzIGZvciBcIntzZWFyY2hRfVwiLiAgVHJ5IGEgbW9yZSBzcGVjaWZpYyB0ZXJtLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgey8qIFNJREUgUEFORUwgKi99XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTQgb3ZlcmZsb3cteS1hdXRvIHByLTFcIj5cbiAgICAgICAgICAgICAgICAgICAgey8qIFNpdGUgbmFtZSBjb21iby1pbnB1dC4gIEZyZWUtZm9ybSB0eXBpbmcgZm9yIGZyZXNoXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbHM7IGEgdmlzaWJsZSBjaGV2cm9uIGJ1dHRvbiBvbiB0aGUgcmlnaHQgb3BlbnNcbiAgICAgICAgICAgICAgICAgICAgICAgIGEgY3VzdG9tIHBvcGRvd24gbGlzdGluZyBldmVyeSBzYXZlZCBsb2NhdGlvbiBwdWxsZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gL2FwaS93ZWF0aGVyLWxvY2F0aW9uIChpLmUuIHRoZSBTQU1FIGxpc3QgdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICBEYXNoYm9hcmQncyBXZWF0aGVyIGJ1dHRvbiBzdXJmYWNlcykuICBUaGlzIHJlcGxhY2VzXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGUgZWFybGllciBuYXRpdmUgPGRhdGFsaXN0PiB3aGljaCB3YXMgdG9vIHN1YnRsZVxuICAgICAgICAgICAgICAgICAgICAgICAgaW4gZGFyayB0aGVtZXMgLS0gb3BlcmF0b3JzIHdpdGggTj4wIHNhdmVkIGVudHJpZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdWxkIG5vdCB0ZWxsIGEgZHJvcGRvd24gZXhpc3RlZC4gKi99XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNpdGUgbmFtZSAoc2F2ZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NhdmVkTG9jcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibWwtMiB0ZXh0LWFtYmVyLTQwMC84MCBub3JtYWwtY2FzZSB0cmFja2luZy1ub3JtYWwgdGV4dC1bMTBweF1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImxvYy1zYXZlZC1oaW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICDilr4ge3NhdmVkTG9jcy5sZW5ndGh9IHNhdmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlXCIgcmVmPXtzYXZlZFJlZn0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0IHByLTlcIiB2YWx1ZT17Y2ZnLnNpdGVOYW1lIHx8ICcnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImxvYy1zaXRlLW5hbWUtaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17c2F2ZWRMb2NzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ1BpY2sgYSBzYXZlZCBsb2NhdGlvbiwgb3IgdHlwZSBhIG5ldyBvbmXigKYnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdlLmcuIEhRIFRvd2VyLCBOb3J0aCBXaW5nLCBQYXZpbGlvbiBC4oCmJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBvblNpdGVOYW1lQ2hhbmdlKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Gb2N1cz17KCkgPT4gc2F2ZWRMb2NzLmxlbmd0aCA+IDAgJiYgc2V0U2F2ZWRPcGVuKHRydWUpfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NhdmVkTG9jcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImxvYy1zYXZlZC1jaGV2cm9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRTYXZlZE9wZW4odiA9PiAhdil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIk9wZW4gc2F2ZWQgbG9jYXRpb25zXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIlBpY2sgZnJvbSBzYXZlZCBsb2NhdGlvbnNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIHJpZ2h0LTEgdG9wLTEvMiAtdHJhbnNsYXRlLXktMS8yIHctNyBoLTcgcm91bmRlZC1tZCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBiZy1hbWJlci03MDAvMzAgaG92ZXI6YmctYW1iZXItNjAwLzUwIGJvcmRlciBib3JkZXItYW1iZXItNTAwLzQwIHRleHQtYW1iZXItMjAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiMTRcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMi40XCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7dHJhbnNmb3JtOiBzYXZlZE9wZW4gPyAncm90YXRlKDE4MGRlZyknIDogJ25vbmUnLCB0cmFuc2l0aW9uOid0cmFuc2Zvcm0gLjE1cyd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cG9seWxpbmUgcG9pbnRzPVwiNiA5IDEyIDE1IDE4IDlcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2F2ZWRPcGVuICYmIHNhdmVkTG9jcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cImxvYy1zYXZlZC1kcm9wZG93blwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgei1bNjAwXSBsZWZ0LTAgcmlnaHQtMCB0b3AtZnVsbCBtdC0xIGJnLXNsYXRlLTkwMCBib3JkZXIgYm9yZGVyLXNsYXRlLTYwMCByb3VuZGVkLWxnIHNoYWRvdy0yeGwgbWF4LWgtNjQgb3ZlcmZsb3cteS1hdXRvXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2F2ZWRMb2NzLm1hcChsb2MgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzQWN0aXZlID0gKGNmZy5zaXRlTmFtZSB8fCAnJykudHJpbSgpID09PSBsb2MubmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBNYXRoLmFicyhjZmcubGF0IC0gbG9jLmxhdCkgPCAxZS00XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIE1hdGguYWJzKGNmZy5sb24gLSBsb2MubG9uKSA8IDFlLTQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogUm93IGlzIGEgPGRpdiByb2xlPVwiYnV0dG9uXCI+IGluc3RlYWQgb2YgPGJ1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbyB0aGUgaW4tcm93IHRyYXNoIDxidXR0b24+IGlzbid0IG5lc3RlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2lkZSBhbm90aGVyIGludGVyYWN0aXZlIGVsZW1lbnQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgcm93S2V5ID0gYCR7bG9jLmxhdC50b0ZpeGVkKDQpfSwke2xvYy5sb24udG9GaXhlZCg0KX1gO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e3Jvd0tleX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb2xlPVwiYnV0dG9uXCIgdGFiSW5kZXg9ezB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogUGljayB0aGUgcm93IG9ubHkgd2hlbiB0aGUgb3BlcmF0b3IgY2xpY2tzIHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb29yZC93aGl0ZXNwYWNlIGFyZWEsIG5vdCB0aGUgcmVuYW1lIGlucHV0IG9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSB0cmFzaCBidXR0b24gKHRob3NlIHN0b3BQcm9wYWdhdGlvbikuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpY2tTYXZlZExvYyhsb2MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25LZXlEb3duPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicgfHwgZS5rZXkgPT09ICcgJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlja1NhdmVkTG9jKGxvYyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgbG9jLXNhdmVkLW9wdC0ke2xvYy5uYW1lfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgZ3JvdXAgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgcHgtMyBweS0yIGJvcmRlci1iIGJvcmRlci1zbGF0ZS04MDAgbGFzdDpib3JkZXItYi0wIGhvdmVyOmJnLWFtYmVyLTkwMC8zMCB0cmFuc2l0aW9uLWNvbG9ycyBjdXJzb3ItcG9pbnRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtpc0FjdGl2ZSA/ICdiZy1hbWJlci05MDAvNTAnIDogJyd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMSBtaW4tdy0wXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qIElubGluZSByZW5hbWUgaW5wdXQgLS0gdHlwaW5nIGhlcmUgdXBkYXRlcyB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW4tbWVtb3J5IHNhdmVkTG9jcyBlbnRyeTsgY2xpY2tpbmcgU2F2ZSAmIFJldHVyblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJzaXN0cyB0aGUgd2hvbGUgbGlzdCB0byBsb2NhbFN0b3JhZ2UgQU5EIHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXIuICBzdG9wUHJvcGFnYXRpb24ga2VlcHMgYSBjbGljayBvbiB0aGUgaW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSB0cmlnZ2VyaW5nIHRoZSByb3cncyBwaWNrIGhhbmRsZXIuICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgbG9jLXNhdmVkLXJlbmFtZS0ke3Jvd0tleX1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17bG9jLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gcmVuYW1lU2F2ZWRMb2MobG9jLCBlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbktleURvd249eyhlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBFbnRlciB3aGlsZSBlZGl0aW5nIGtlZXBzIHRoZSBkcm9wZG93blxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlbiAtLSBmaW5hbGlzaW5nIHJlbmFtZSBoYXBwZW5zIGF0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTYXZlICYgUmV0dXJuLCBub3Qgb24gRW50ZXIuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17YFJlbmFtZSBzYXZlZCBsb2NhdGlvbiAke2xvYy5uYW1lfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBiZy10cmFuc3BhcmVudCBib3JkZXItMCBvdXRsaW5lLW5vbmUgdGV4dC1zbSB0ZXh0LXNsYXRlLTEwMCBmb250LW1lZGl1bSBweC0wIHB5LTBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb2N1czpiZy1zbGF0ZS04MDAvNjAgZm9jdXM6cHgtMSBmb2N1czpyb3VuZGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaG92ZXI6Ymctc2xhdGUtODAwLzQwIGhvdmVyOnB4LTEgaG92ZXI6cm91bmRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb24tYWxsXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgZm9udC1tb25vIG10LTAuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bG9jLmxhdC50b0ZpeGVkKDIpfSwge2xvYy5sb24udG9GaXhlZCgyKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qIFRyYXNoIGJ1dHRvbiAtLSBhbHdheXMgcmVuZGVyZWQsIGZhZGVkIHVudGlsIHJvdy1ob3ZlciBzbyBpdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvZXNuJ3QgY2x1dHRlciB0aGUgcmVzdGluZyBzdGF0ZS4gIHN0b3BQcm9wYWdhdGlvbiBwcmV2ZW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSByb3cncyBwaWNrIGhhbmRsZXIgZnJvbSBmaXJpbmcuICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2Bsb2Mtc2F2ZWQtcmVtb3ZlLSR7bG9jLm5hbWV9YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17YFJlbW92ZSAke2xvYy5uYW1lfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPXtgUmVtb3ZlICR7bG9jLm5hbWV9IGZyb20gc2F2ZWQgbG9jYXRpb25zYH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KGUpID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgcmVtb3ZlU2F2ZWRMb2MobG9jKTsgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic2hyaW5rLTAgdy03IGgtNyByb3VuZGVkLW1kIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dC1zbGF0ZS01MDAgaG92ZXI6dGV4dC1yb3NlLTMwMCBob3ZlcjpiZy1yb3NlLTkwMC8zMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHktNDAgZ3JvdXAtaG92ZXI6b3BhY2l0eS0xMDAgdHJhbnNpdGlvbi1vcGFjaXR5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjE0XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjIuMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0zIDZoMThcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNOCA2VjRhMiAyIDAgMCAxIDItMmg0YTIgMiAwIDAgMSAyIDJ2MlwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xOSA2bC0xLjUgMTMuMmEyIDIgMCAwIDEtMiAxLjhIOC41YTIgMiAwIDAgMS0yLTEuOEw1IDZcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTAgMTF2Nk0xNCAxMXY2XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbXQtMSBpdGFsaWNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2F2ZWRMb2NzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnUGljayBhIHByZXZpb3VzbHktc2F2ZWQgbG9jYXRpb24sIG9yIHR5cGUgYSBuZXcgbGFiZWwgZm9yIHRoaXMgcGxhY2UuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdZb3VyIGxhYmVsIGZvciB0aGlzIHBsYWNlIOKAlCBzaG93biBvbiB0aGUgZGFzaGJvYXJkIGhlYWRlci4nfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgey8qIFNvZnQgZHVwbGljYXRlLW5hbWUgd2FybmluZyAtLSBpZiB0aGUgb3BlcmF0b3IgdHlwZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhIG5hbWUgdGhhdCBhbHJlYWR5IGV4aXN0cyBpbiB0aGUgc2F2ZWQgbGlzdCBBVFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERJRkZFUkVOVCBDT09SRElOQVRFUywgc3VyZmFjZSB0aGF0IHNvIHRoZXkgZG9uJ3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaWxlbnRseSBlbmQgdXAgd2l0aCB0d28gXCJIT01FXCJzIHBvaW50aW5nIHRvIHR3b1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpZmZlcmVudCBhZGRyZXNzZXMgKHRoZSBidWcgb3BlcmF0b3ItcmVwb3J0ZWQgb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAyMDI2LTA2LTI4OiBkYXNoYm9hcmQgaGFkIDLDlyBIT01FLCBTZXR1cCBXYWxrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd2VkIG9ubHkgMSkuICBTYW1lIGNvb3JkcyA9IG5vIHdhcm5pbmcsIGl0J3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqdXN0IHJlLXNlbGVjdGluZyBhIGtub3duIHNpdGUuICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgeygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdHlwZWQgPSAoY2ZnLnNpdGVOYW1lIHx8ICcnKS50cmltKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0eXBlZCkgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgcm91bmQgPSAobikgPT4gKE1hdGgucm91bmQobiAqIDEwMDAwKSAvIDEwMDAwKS50b0ZpeGVkKDQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1ciA9IHJvdW5kKGNmZy5sYXQpICsgJywnICsgcm91bmQoY2ZnLmxvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29uZmxpY3QgPSBzYXZlZExvY3MuZmluZChzID0+IHMubmFtZSA9PT0gdHlwZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAocm91bmQocy5sYXQpICsgJywnICsgcm91bmQocy5sb24pKSAhPT0gY3VyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbmZsaWN0KSByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwibG9jLWR1cC1uYW1lLXdhcm5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm10LTIgcHgtMi41IHB5LTIgcm91bmRlZC1tZCBiZy1hbWJlci05NTAvNDAgYm9yZGVyIGJvcmRlci1hbWJlci03MDAvNTAgdGV4dC1bMTAuNXB4XSB0ZXh0LWFtYmVyLTIwMCBsZWFkaW5nLXNudWdcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxiIGNsYXNzTmFtZT1cInRleHQtYW1iZXItMTAwXCI+U2FtZSBuYW1lIGFscmVhZHkgc2F2ZWQ8L2I+IGF0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y29kZSBjbGFzc05hbWU9XCJteC0xIGZvbnQtbW9ubyB0ZXh0LWFtYmVyLTEwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtjb25mbGljdC5sYXQudG9GaXhlZCgyKX0sIHtjb25mbGljdC5sb24udG9GaXhlZCgyKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvY29kZT4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTYXZpbmcga2VlcHMgYm90aDsgcGljayBmcm9tIHRoZSBkcm9wZG93biBhYm92ZSB0byBzd2l0Y2ggdG8gdGhlIGV4aXN0aW5nIG9uZSBpbnN0ZWFkLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkoKX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib3JkZXItdCBib3JkZXItc2xhdGUtODAwIHB0LTNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMS41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVzb2x2ZWQgYWRkcmVzcyAvIGNpdHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Z2VvQnVzeSAmJiA8c3BhbiBjbGFzc05hbWU9XCJtbC0yIHRleHQtYW1iZXItNDAwIG5vcm1hbC1jYXNlIHRyYWNraW5nLW5vcm1hbFwiPuKApiByZXNvbHZpbmc8L3NwYW4+fVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIiB2YWx1ZT17Y2ZnLmNpdHl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKT0+c2V0Q2ZnKHsuLi5jZmcsIGNpdHk6ZS50YXJnZXQudmFsdWV9KX0vPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC0zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMS41XCI+e3QoJ3N3X2xhdGl0dWRlJyl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCIgdHlwZT1cIm51bWJlclwiIHN0ZXA9XCIwLjAwMDFcIiB2YWx1ZT17Y2ZnLmxhdH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKT0+c2V0Q2ZnKHsuLi5jZmcsIGxhdDorZS50YXJnZXQudmFsdWV9KX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMS41XCI+e3QoJ3N3X2xvbmdpdHVkZScpfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiIHR5cGU9XCJudW1iZXJcIiBzdGVwPVwiMC4wMDAxXCIgdmFsdWU9e2NmZy5sb259XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSk9PnNldENmZyh7Li4uY2ZnLCBsb246K2UudGFyZ2V0LnZhbHVlfSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0xLjVcIj5BU1BFQ1Qg4oCUIEJ1aWxkaW5nIGZhY2luZzwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiIGRhdGEtdGVzdGlkPVwibG9jLWJ1aWxkaW5nLWZhY2luZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtjZmcuYnVpbGRpbmdGYWNpbmcgfHwgJ2F1dG8nfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpPT5zZXRDZmcoey4uLmNmZywgYnVpbGRpbmdGYWNpbmc6IGUudGFyZ2V0LnZhbHVlfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwiQ29tcGFzcyBkaXJlY3Rpb24gdGhlIG1haW4gZmHDp2FkZSBmYWNlcyBvdXR3YXJkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImF1dG9cIj5BdXRvIChieSBoZW1pc3BoZXJlKTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJOXCI+TiDigJQgTm9ydGg8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiTkVcIj5ORSDigJQgTm9ydGhlYXN0PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkVcIj5FIOKAlCBFYXN0PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlNFXCI+U0Ug4oCUIFNvdXRoZWFzdDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJTXCI+UyDigJQgU291dGg8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiU1dcIj5TVyDigJQgU291dGh3ZXN0PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIldcIj5XIOKAlCBXZXN0PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIk5XXCI+Tlcg4oCUIE5vcnRod2VzdDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0xLjUgbGVhZGluZy1zbnVnXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTkggZGVmYXVsdCDihpIgU291dGggwrcgU0ggZGVmYXVsdCDihpIgTm9ydGguIFVzZWQgZm9yIHN1bi1wYXRoIC8gd2luZG93IGdsb3cgb3JpZW50YXRpb24uXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17dXNlTXlMb2NhdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17Z2VvU3RhdGUgPT09ICdidXN5J31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImxvYy11c2UtbXktbG9jYXRpb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHctZnVsbCBweS0yLjUgcm91bmRlZC1sZyBib3JkZXIgdGV4dC14cyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgdHJhbnNpdGlvbi1jb2xvcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtnZW9TdGF0ZSA9PT0gJ2J1c3knXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1hbWJlci05MDAvNDAgYm9yZGVyLWFtYmVyLTcwMC80MCB0ZXh0LWFtYmVyLTIwMCBjdXJzb3Itd2FpdCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogKGdlb1N0YXRlICYmIGdlb1N0YXRlLmVyclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLXJvc2UtOTAwLzQwIGJvcmRlci1yb3NlLTUwMC81MCB0ZXh0LXJvc2UtMTAwIGhvdmVyOmJnLXJvc2UtODAwLzQwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLWFtYmVyLTcwMC83MCBib3JkZXItYW1iZXItNTAwLzQwIHRleHQtYW1iZXItNTAgaG92ZXI6YmctYW1iZXItNjAwLzcwJyl9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7Z2VvU3RhdGUgPT09ICdidXN5J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ+KPsyAgUmVhZGluZyBkZXZpY2UgbG9jYXRpb27igKYnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAn8J+TjSAgVXNlIG15IGRldmljZSBsb2NhdGlvbid9XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICB7Z2VvU3RhdGUgJiYgZ2VvU3RhdGUuZXJyICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJsb2MtZ2VvLWVycm9yXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiLW10LTIgcHgtMyBweS0yIHJvdW5kZWQtbWQgYmctcm9zZS05NTAvNTAgYm9yZGVyIGJvcmRlci1yb3NlLTcwMC80MCB0ZXh0LVsxMXB4XSBsZWFkaW5nLXNudWcgdGV4dC1yb3NlLTIwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxiIGNsYXNzTmFtZT1cInRleHQtcm9zZS0xMDBcIj5Db3VsZG4ndCByZWFkIGxvY2F0aW9uLjwvYj48YnIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtcm9zZS0yMDAvOTBcIj57Z2VvU3RhdGUuZXJyfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogU3BlY2lmaWMgSFRUUC1vcmlnaW4gY2FsbC1vdXQ6IG1vc3QgbGlrZWx5IGNhdXNlIG9uIGEgVjEuOSBjb250cm9sbGVyLiAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmxvY2F0aW9uICYmIHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2h0dHA6JyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtMS41IHRleHQtWzEwcHhdIHRleHQtcm9zZS0zMDAvODAgZm9udC1tb25vXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXA6IGJyb3dzZXJzIHJlcXVpcmUgSFRUUFMgZm9yIGdlb2xvY2F0aW9uLiAgUGljayB0aGUgbG9jYXRpb24gb24gdGhlIG1hcCBvciBzZWFyY2ggYmFyIGluc3RlYWQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvcmRlci10IGJvcmRlci1zbGF0ZS04MDAgcHQtMyBtdC0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj57dCgnc3dfcXVpY2tfanVtcHMnKX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtMS41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidUb3JvbnRvLCBPTicsICAgbGF0OjQzLjY1MzIsIGxvbjotNzkuMzgzMiwgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J05ldyBZb3JrLCBOWScsICBsYXQ6NDAuNzEyOCwgbG9uOi03NC4wMDYwLCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonTG9uZG9uLCBVSycsICAgIGxhdDo1MS41MDc0LCBsb246IC0wLjEyNzgsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidQYXJpcywgRlInLCAgICAgbGF0OjQ4Ljg1NjYsIGxvbjogIDIuMzUyMiwgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J1Rva3lvLCBKUCcsICAgICBsYXQ6MzUuNjc2MiwgbG9uOjEzOS42NTAzLCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonU3lkbmV5LCBBVScsICAgIGxhdDotMzMuODY4OCxsb246MTUxLjIwOTMsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLm1hcChqID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e2oubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgbGF0OmoubGF0LCBsb246ai5sb24sIGNpdHk6ai5uYW1lfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFwUmVmLmN1cnJlbnQpIG1hcFJlZi5jdXJyZW50LnNldFZpZXcoW2oubGF0LCBqLmxvbl0sIGoueik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LWxlZnQgcHgtMi41IHB5LTEuNSByb3VuZGVkLW1kIGJnLXNsYXRlLTgwMC83MCBib3JkZXIgYm9yZGVyLXNsYXRlLTcwMCB0ZXh0LVsxMXB4XSBmb250LWJvbGQgdGV4dC1zbGF0ZS0zMDAgaG92ZXI6Ymctc2xhdGUtNzAwIGhvdmVyOmJvcmRlci1hbWJlci01MDAvNDAgdHJhbnNpdGlvbi1hbGxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtqLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgVGlsZXM6IE9wZW5TdHJlZXRNYXAgwrcgR2VvY29kZTogTm9taW5hdGltIChmcmVlLCB+MSByZXEvcykuXG4gICAgICAgICAgICAgICAgICAgICAgICBVc2VkIGZvciBPcGVuLU1ldGVvIHdlYXRoZXIgZmVlZCBhbmQgc3VucmlzZS9zdW5zZXQgZXN0aW1hdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvTW9kYWxTaGVsbD5cbiAgICApO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBMYW5ndWFnZSBTZXR0aW5nIC0tIG1vZGFsXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5mdW5jdGlvbiBMYW5ndWFnZU1vZGFsKHsgY2ZnLCBzZXRDZmcsIG9uQ2xvc2UsIG9uU2F2ZSB9KSB7XG4gICAgY29uc3QgbGFuZ3MgPSBbXG4gICAgICAgIHsgY29kZTonZW4nLCAgICBsYWJlbDonRW5nbGlzaCcsICAgICAgICAgICAgICAgIG5hdGl2ZTonRW5nbGlzaCcgICAgfSxcbiAgICAgICAgeyBjb2RlOid6aC1DTicsIGxhYmVsOidDaGluZXNlIChTaW1wbGlmaWVkKScsICAgbmF0aXZlOifnroDkvZPkuK3mlocnICAgIH0sXG4gICAgICAgIHsgY29kZTonemgtVFcnLCBsYWJlbDonQ2hpbmVzZSAoVHJhZGl0aW9uYWwpJywgIG5hdGl2ZTon57mB6auU5Lit5paHJyAgICB9LFxuICAgICAgICB7IGNvZGU6J2phJywgICAgbGFiZWw6J0phcGFuZXNlJywgICAgICAgICAgICAgICBuYXRpdmU6J+aXpeacrOiqnicgICAgICB9LFxuICAgICAgICB7IGNvZGU6J2tvJywgICAgbGFiZWw6J0tvcmVhbicsICAgICAgICAgICAgICAgICBuYXRpdmU6J+2VnOq1reyWtCcgICAgICB9LFxuICAgIF07XG5cbiAgICAvKiBPbiBTYXZlICYgcmV0dXJuOiB3cml0ZSB0aGUgcGlja2VkIGxhbmd1YWdlIGNvZGUgdG8gdGhlIHNhbWVcbiAgICAgKiBsb2NhbFN0b3JhZ2Uga2V5IHRoZSBkYXNoYm9hcmQncyBpMThuLmpzIHJlYWRzIChgaTE4bl9sYW5nYCksIGFuZFxuICAgICAqIGRpc3BhdGNoIHRoZSBgbGFuZ2NoYW5nZWAgZXZlbnQgc28gYW55IG9wZW4gZGFzaGJvYXJkL2NvbmZpZyB0YWJcbiAgICAgKiBwaWNrcyBpdCB1cCBsaXZlLiAgVGhpcyBpcyB3aGF0IG1ha2VzIHRoZSBzZXR1cCB3YWxrJ3MgbGFuZ3VhZ2VcbiAgICAgKiBjaG9pY2UgYWN0dWFsbHkgZHJpdmUgdGhlIGRhc2hib2FyZCAvIGNvbmZpZyAvIG1hcHBlciBVSSAtLSB0aGVcbiAgICAgKiBzaWRlYmFyIHNlbGVjdG9yIHRoYXQgdXNlZCB0byBsaXZlIGluIHRoZSBkYXNoYm9hcmQgaGVhZGVyIGhhc1xuICAgICAqIGJlZW4gcmVtb3ZlZCAoMjAyNi0wNi0yNikgYW5kIHRoZSBzZXR1cCB3YWxrIGlzIG5vdyB0aGUgc2luZ2xlXG4gICAgICogc291cmNlIG9mIHRydXRoIGZvciBVSSBsYW5ndWFnZS4gKi9cbiAgICBjb25zdCBwZXJzaXN0QW5kU2F2ZSA9ICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdpMThuX2xhbmcnLCBjZmcubGFuZyk7XG4gICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2xhbmdjaGFuZ2UnKSk7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ1tzZXR1cCB3YWxrXSBpMThuX2xhbmcgPC0nLCBjZmcubGFuZyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignW3NldHVwIHdhbGtdIGNvdWxkIG5vdCBwZXJzaXN0IGxhbmd1YWdlOicsIGUpO1xuICAgICAgICB9XG4gICAgICAgIG9uU2F2ZSgpO1xuICAgIH07XG4gICAgcmV0dXJuIChcbiAgICAgICAgPE1vZGFsU2hlbGwgdGl0bGU9e3QoJ3N3X2xhbmd1YWdlX3NldHRpbmcnKX0gc3VidGl0bGU9e3QoJ3N3X2xhbmd1YWdlX3N1YicpfSBhY2NlbnQ9XCJlbWVyYWxkXCIgb25DbG9zZT17b25DbG9zZX0gb25TYXZlPXtwZXJzaXN0QW5kU2F2ZX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTNcIj5cbiAgICAgICAgICAgICAgICB7bGFuZ3MubWFwKGwgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGtleT17bC5jb2RlfSBvbkNsaWNrPXsoKT0+c2V0Q2ZnKHsuLi5jZmcsIGxhbmc6bC5jb2RlfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdGV4dC1sZWZ0IHAtMyByb3VuZGVkLXhsIGJvcmRlci0yIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Y2ZnLmxhbmcgPT09IGwuY29kZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYm9yZGVyLWVtZXJhbGQtNTAwIGJnLWVtZXJhbGQtOTAwLzIwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYm9yZGVyLXNsYXRlLTcwMCBiZy1zbGF0ZS04MDAvNDAgaG92ZXI6Ymctc2xhdGUtODAwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIHRleHQtc2xhdGUtNTAwXCI+e2wuY29kZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LWJsYWNrIHRleHQtc2xhdGUtMjAwXCI+e2wubmF0aXZlfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMXB4XSB0ZXh0LXNsYXRlLTUwMFwiPntsLmxhYmVsfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L01vZGFsU2hlbGw+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogUGx1Zy1pbiBTZXR0aW5nIC0tIG1vZGFsIHcvIGxpc3QgKyB1cGxvYWQgem9uZVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLyogUGVyLXBsdWctaW4gbW9jayBjb25maWd1cmF0aW9uIGZpZWxkcy4gIEtleXMgbWFwIHRvIHBsdWctaW4gYGlkYC4gKi9cbmNvbnN0IFBMVUdJTl9DT05GSUdfRklFTERTID0ge1xuICAgIHdlYXRoZXI6ICAgIFtcbiAgICAgICAgeyBrZXk6J3Byb3ZpZGVyJywgIGxhYmVsOidQcm92aWRlcicsICAgICAgICAgIHR5cGU6J3NlbGVjdCcsICBvcHRpb25zOlsnT3Blbi1NZXRlbycsJ05XUycsJ0VDTVdGJ10sIGRlZjonT3Blbi1NZXRlbycgfSxcbiAgICAgICAgeyBrZXk6J3JlZnJlc2gnLCAgIGxhYmVsOidSZWZyZXNoIGludGVydmFsJywgIHR5cGU6J3NlbGVjdCcsICBvcHRpb25zOlsnMSBtaW4nLCc1IG1pbicsJzE1IG1pbicsJzMwIG1pbicsJzEgaCddLCBkZWY6JzE1IG1pbicgfSxcbiAgICAgICAgeyBrZXk6J2NhY2hlJywgICAgIGxhYmVsOidDYWNoZSBUVEwgKG1pbiknLCAgIHR5cGU6J251bWJlcicsICBkZWY6MzAgfSxcbiAgICBdLFxuICAgIGdpdm9uaTogICAgIFtcbiAgICAgICAgeyBrZXk6J2NsaW1hdGUnLCAgIGxhYmVsOidDbGltYXRlIG1vZGVsJywgICAgIHR5cGU6J3NlbGVjdCcsICBvcHRpb25zOlsnR2l2b25pIDE5OTInLCdBU0hSQUUgNTUnLCdBZGFwdGl2ZSddLCBkZWY6J0dpdm9uaSAxOTkyJyB9LFxuICAgICAgICB7IGtleTonbWFzc2l2ZScsICAgbGFiZWw6J0hlYXZ5d2VpZ2h0IGNvbnN0cnVjdGlvbicsICB0eXBlOid0b2dnbGUnLCBkZWY6ZmFsc2UgfSxcbiAgICBdLFxuICAgIHN3ZWV0X3Nwb3Q6IFtcbiAgICAgICAgeyBrZXk6J3RyYWNraW5nJywgIGxhYmVsOidUcmFjayBvdXRkb29yIFJIJywgIHR5cGU6J3RvZ2dsZScsIGRlZjp0cnVlIH0sXG4gICAgICAgIHsga2V5OidoeXN0JywgICAgICBsYWJlbDonSHlzdGVyZXNpcyAoJSBSSCknLCB0eXBlOidudW1iZXInLCBkZWY6MiB9LFxuICAgIF0sXG4gICAgZzM2OiAgICAgICAgW1xuICAgICAgICB7IGtleTonbW9kZScsICAgICAgbGFiZWw6J1NlcXVlbmNlIG1vZGUnLCAgICAgdHlwZTonc2VsZWN0JywgIG9wdGlvbnM6WydTaW5nbGUtem9uZSBWQVYnLCdNdWx0aS16b25lIFZBVicsJ0RPQVMgdy8gRkNVJ10sIGRlZjonTXVsdGktem9uZSBWQVYnIH0sXG4gICAgICAgIHsga2V5Oid2ZXJib3NlJywgICBsYWJlbDonVmVyYm9zZSBsb2dnaW5nJywgICB0eXBlOid0b2dnbGUnLCBkZWY6ZmFsc2UgfSxcbiAgICBdLFxuICAgIGRpYnQ6ICAgICAgIFtcbiAgICAgICAgeyBrZXk6J2hvc3QnLCAgICAgIGxhYmVsOidCcmlkZ2UgaG9zdCcsICAgICAgIHR5cGU6J3RleHQnLCAgIGRlZjonMTkyLjE2OC4xLjEwMCcgfSxcbiAgICAgICAgeyBrZXk6J3BvcnQnLCAgICAgIGxhYmVsOidUZWxlZ3JhbSBwb3J0JywgICAgIHR5cGU6J251bWJlcicsIGRlZjo0NzgwOCB9LFxuICAgICAgICB7IGtleToncG9sbF9tcycsICAgbGFiZWw6J1BvbGwgaW50ZXJ2YWwgKG1zKScsdHlwZTonbnVtYmVyJywgZGVmOjIwMDAgfSxcbiAgICBdLFxuICAgIGxpZ2h0aW5nOiAgIFtcbiAgICAgICAgeyBrZXk6J2dhdGV3YXknLCAgIGxhYmVsOidNb2RidXMgZ2F0ZXdheSBJUCcsIHR5cGU6J3RleHQnLCAgIGRlZjonMTAuMC4wLjUwJyB9LFxuICAgICAgICB7IGtleTondW5pdF9pZCcsICAgbGFiZWw6J1VuaXQgSUQnLCAgICAgICAgICAgdHlwZTonbnVtYmVyJywgZGVmOjEgfSxcbiAgICAgICAgeyBrZXk6J3RjcF9wb3J0JywgIGxhYmVsOidUQ1AgcG9ydCcsICAgICAgICAgIHR5cGU6J251bWJlcicsIGRlZjo1MDIgfSxcbiAgICBdLFxufTtcblxuZnVuY3Rpb24gUGx1Z2luc01vZGFsKHsgY2ZnLCBzZXRDZmcsIG9uQ2xvc2UsIG9uU2F2ZSB9KSB7XG4gICAgY29uc3QgQUxMID0gW1xuICAgICAgICB7IGlkOid3ZWF0aGVyJywgICAgIG5hbWU6J1dlYXRoZXInLCAgICAgICAgIGRlc2M6J09wZW4tTWV0ZW8gT0EgZmVlZCcsICAgICAgICAgIHZlcjonMi4xLjAnIH0sXG4gICAgICAgIHsgaWQ6J2dpdm9uaScsICAgICAgbmFtZTonR2l2b25pIEVuZ2luZScsICAgZGVzYzonQ2xpbWF0ZS1zdHJhdGVneSBvdmVybGF5JywgICAgdmVyOicxLjMuNCcgfSxcbiAgICAgICAgeyBpZDonc3dlZXRfc3BvdCcsICBuYW1lOidTd2VldC1TcG90IFJIJywgICBkZXNjOidBZGp1c3RhYmxlIFJIIGJhbmQnLCAgICAgICAgICB2ZXI6JzEuMC4xJyB9LFxuICAgICAgICB7IGlkOidnMzYnLCAgICAgICAgIG5hbWU6J0czNiBTZXF1ZW5jZXMnLCAgIGRlc2M6J0FTSFJBRSBHdWlkZWxpbmUgMzYnLCAgICAgICAgIHZlcjonMC45LjInIH0sXG4gICAgICAgIHsgaWQ6J2RpYnQnLCAgICAgICAgbmFtZTonRElCVCBCcmlkZ2UnLCAgICAgZGVzYzonRGVsdGEgQ29udHJvbHMgKERJQlQpIEJBQ25ldCBicmlkZ2UnLCAgICAgICAgICAgdmVyOicwLjQuMCcgfSxcbiAgICAgICAgeyBpZDonbGlnaHRpbmcnLCAgICBuYW1lOidMaWdodGluZyAoUmVkNSknLCBkZXNjOidWMy4wIE1vZGJ1cyBUQ1AgY2xpZW50JywgICAgICB2ZXI6JzAuMS4wLWJldGEnIH0sXG4gICAgXTtcbiAgICBjb25zdCB0b2dnbGUgPSAoaWQpID0+IHNldENmZyhjID0+ICh7XG4gICAgICAgIC4uLmMsXG4gICAgICAgIGVuYWJsZWQ6IGMuZW5hYmxlZC5pbmNsdWRlcyhpZCkgPyBjLmVuYWJsZWQuZmlsdGVyKHggPT4geCAhPT0gaWQpIDogWy4uLmMuZW5hYmxlZCwgaWRdXG4gICAgfSkpO1xuXG4gICAgLyogZXhwYW5zaW9uIHN0YXRlIOKAlCB3aGljaCBwbHVnLWluJ3MgXCJDb25maWd1cmVcIiBwYW5lbCBpcyBvcGVuICovXG4gICAgY29uc3QgW2V4cGFuZGVkSWQsIHNldEV4cGFuZGVkSWRdID0gUmVhY3QudXNlU3RhdGUobnVsbCk7XG5cbiAgICBjb25zdCB1cGRhdGVGaWVsZCA9IChwbHVnaW5JZCwgZmllbGRLZXksIHZhbHVlKSA9PiB7XG4gICAgICAgIHNldENmZyhjID0+ICh7XG4gICAgICAgICAgICAuLi5jLFxuICAgICAgICAgICAgZmllbGRzOiB7IC4uLihjLmZpZWxkcyB8fCB7fSksIFtwbHVnaW5JZF06IHsgLi4uKChjLmZpZWxkcyB8fCB7fSlbcGx1Z2luSWRdIHx8IHt9KSwgW2ZpZWxkS2V5XTogdmFsdWUgfSB9XG4gICAgICAgIH0pKTtcbiAgICB9O1xuXG4gICAgY29uc3QgZmllbGRWYWwgPSAocGx1Z2luSWQsIGZpZWxkKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0b3JlZCA9IGNmZy5maWVsZHMgJiYgY2ZnLmZpZWxkc1twbHVnaW5JZF0gJiYgY2ZnLmZpZWxkc1twbHVnaW5JZF1bZmllbGQua2V5XTtcbiAgICAgICAgcmV0dXJuIHN0b3JlZCAhPT0gdW5kZWZpbmVkID8gc3RvcmVkIDogZmllbGQuZGVmO1xuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8TW9kYWxTaGVsbCB0aXRsZT17dCgnc3dfcGx1Z2luX3NldHRpbmcnKX0gc3VidGl0bGU9e3QoJ3N3X3BsdWdpbl9zdWInKX0gYWNjZW50PVwicGlua1wiIG9uQ2xvc2U9e29uQ2xvc2V9IG9uU2F2ZT17b25TYXZlfSBzaXplPVwid2lkZVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTMgbWF4LWgtWzYwdmhdIG92ZXJmbG93LXktYXV0byBwci0xXCI+XG4gICAgICAgICAgICAgICAge0FMTC5tYXAocCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9uID0gY2ZnLmVuYWJsZWQuaW5jbHVkZXMocC5pZCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4cGFuZGVkID0gZXhwYW5kZWRJZCA9PT0gcC5pZDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmllbGRzID0gUExVR0lOX0NPTkZJR19GSUVMRFNbcC5pZF0gfHwgW107XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17cC5pZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcm91bmRlZC14bCBib3JkZXIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtvbiA/ICdib3JkZXItcGluay01MDAvNDAgYmctcGluay05MDAvMTAnIDogJ2JvcmRlci1zbGF0ZS03MDAgYmctc2xhdGUtODAwLzQwJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtleHBhbmRlZCA/ICdyaW5nLTEgcmluZy1waW5rLTUwMC8zMCcgOiAnJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBwLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LWJsYWNrIHRleHQtc2xhdGUtMTAwXCI+e3AubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtbC0yIHRleHQtWzEwcHhdIGZvbnQtbW9ubyB0ZXh0LXNsYXRlLTUwMFwiPnZ7cC52ZXJ9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS00MDBcIj57cC5kZXNjfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB0b2dnbGUocC5pZCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgcGx1Z2luLXRvZ2dsZS0ke3AuaWR9YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHgtMyBweS0xIHJvdW5kZWQtbWQgdGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIGJvcmRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtvbiA/ICdib3JkZXItcGluay01MDAvNjAgdGV4dC1waW5rLTMwMCBiZy1waW5rLTkwMC8zMCcgOiAnYm9yZGVyLXNsYXRlLTYwMCB0ZXh0LXNsYXRlLTQwMCBiZy1zbGF0ZS04MDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtvbiA/IHQoJ3N3X2VuYWJsZWQnKSA6IHQoJ3N3X2Rpc2FibGVkJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gc2V0RXhwYW5kZWRJZChleHBhbmRlZCA/IG51bGwgOiBwLmlkKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BwbHVnaW4tY29uZmlnLSR7cC5pZH1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweC0zIHB5LTEgcm91bmRlZC1tZCB0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgYm9yZGVyIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2V4cGFuZGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYm9yZGVyLXBpbmstNTAwIGJnLXBpbmstOTAwLzMwIHRleHQtcGluay0yMDAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYm9yZGVyLXNsYXRlLTYwMCB0ZXh0LXNsYXRlLTQwMCBiZy1zbGF0ZS04MDAgaG92ZXI6Ymctc2xhdGUtNzAwIGhvdmVyOmJvcmRlci1waW5rLTUwMC81MCBob3Zlcjp0ZXh0LXBpbmstMzAwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZXhwYW5kZWQgPyB0KCdzd19jbG9zZV91cCcpIDogdCgnc3dfY29uZmlndXJlX2RkJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2V4cGFuZGVkICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJweC00IHBiLTQgYm9yZGVyLXQgYm9yZGVyLXBpbmstNTAwLzIwIGJnLXNsYXRlLTk1MC80MFwiIGRhdGEtdGVzdGlkPXtgcGx1Z2luLWNvbmZpZy1wYW5lbC0ke3AuaWR9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZmllbGRzLmxlbmd0aCA9PT0gMCA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtc2xhdGUtNTAwIGl0YWxpYyBweS0zXCI+Tm8gY29uZmlndXJhYmxlIG9wdGlvbnMgZm9yIHRoaXMgcGx1Zy1pbiB5ZXQuPC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbWQ6Z3JpZC1jb2xzLTIgZ2FwLTMgcHQtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZmllbGRzLm1hcChmID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHYgPSBmaWVsZFZhbChwLmlkLCBmKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e2Yua2V5fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ib2xkIHRleHQtc2xhdGUtNTAwIGJsb2NrIG1iLTFcIj57Zi5sYWJlbH08L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi50eXBlID09PSAnc2VsZWN0JyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0IGN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3Z9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlRmllbGQocC5pZCwgZi5rZXksIGUudGFyZ2V0LnZhbHVlKX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2Yub3B0aW9ucy5tYXAobyA9PiA8b3B0aW9uIGtleT17b30gdmFsdWU9e299PntvfTwvb3B0aW9uPil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2YudHlwZSA9PT0gJ251bWJlcicgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJudW1iZXJcIiBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3Z9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGVGaWVsZChwLmlkLCBmLmtleSwgK2UudGFyZ2V0LnZhbHVlKX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi50eXBlID09PSAndGV4dCcgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt2fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlRmllbGQocC5pZCwgZi5rZXksIGUudGFyZ2V0LnZhbHVlKX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi50eXBlID09PSAndG9nZ2xlJyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHVwZGF0ZUZpZWxkKHAuaWQsIGYua2V5LCAhdil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHctZnVsbCBweS0yIHJvdW5kZWQtbGcgdGV4dC14cyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgYm9yZGVyIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3ZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1waW5rLTcwMC80MCBib3JkZXItcGluay01MDAvNjAgdGV4dC1waW5rLTIwMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1zbGF0ZS04MDAgYm9yZGVyLXNsYXRlLTYwMCB0ZXh0LXNsYXRlLTQwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3YgPyAnT04nIDogJ09GRid9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1lbmQgZ2FwLTIgbXQtNCBwdC0zIGJvcmRlci10IGJvcmRlci1zbGF0ZS04MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXNldCB0aGlzIHBsdWctaW4ncyBmaWVsZHMgdG8gZGVmYXVsdHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRDZmcoYyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHQgPSB7IC4uLihjLmZpZWxkcyB8fCB7fSkgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG5leHRbcC5pZF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IC4uLmMsIGZpZWxkczogbmV4dCB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTMgcHktMS41IHJvdW5kZWQtbWQgdGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIGJvcmRlciBib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtNDAwIGhvdmVyOmJnLXNsYXRlLTgwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dCgnc3dfcmVzZXRfZGVmYXVsdHMnKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHNldEV4cGFuZGVkSWQobnVsbCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC0zIHB5LTEuNSByb3VuZGVkLW1kIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayBiZy1waW5rLTYwMCBob3ZlcjpiZy1waW5rLTUwMCB0ZXh0LXdoaXRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0KCdzd19kb25lJyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNSBwLTQgYm9yZGVyLTIgYm9yZGVyLWRhc2hlZCBib3JkZXItc2xhdGUtNzAwIHJvdW5kZWQteGwgdGV4dC1jZW50ZXIgaG92ZXI6Ym9yZGVyLXBpbmstNTAwLzQwIHRyYW5zaXRpb24tYWxsIGN1cnNvci1wb2ludGVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LTN4bCBtYi0xXCI+4qS0PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS0zMDBcIj5Ecm9wIGEgLnB5IC8gLnppcCAvIC5yZWQ1IHBsdWctaW4gaGVyZTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTFweF0gdGV4dC1zbGF0ZS01MDAgbXQtMVwiPm9yIGNsaWNrIHRvIGNob29zZSBhIGZpbGUgKG1vY2sg4oCUIG5vdCB3aXJlZCk8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L01vZGFsU2hlbGw+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogTW9kYWwgU2hlbGwgLS0gc2hhcmVkXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5mdW5jdGlvbiBNb2RhbFNoZWxsKHsgdGl0bGUsIHN1YnRpdGxlLCBhY2NlbnQ9J2luZGlnbycsIG9uQ2xvc2UsIG9uU2F2ZSwgc2l6ZT0nJywgY2hpbGRyZW4gfSkge1xuICAgIGNvbnN0IGNvbG9yTWFwID0ge1xuICAgICAgICBpbmRpZ286JyM4MThjZjgnLCBhbWJlcjonI2ZiYmYyNCcsIGVtZXJhbGQ6JyMzNGQzOTknLCBwaW5rOicjZjQ3MmI2J1xuICAgIH07XG4gICAgY29uc3QgYyA9IGNvbG9yTWFwW2FjY2VudF0gfHwgJyM4MThjZjgnO1xuICAgIGNvbnN0IHNpemVNYXAgPSB7XG4gICAgICAgIHdpZGU6ICdtYXgtdy0yeGwnLFxuICAgICAgICBtYXA6ICAnbWF4LXctM3hsJyxcbiAgICAgICAgbWF4OiAgJ21heC13LVs5NnZ3XSB3LVs5NnZ3XSBoLVs5MnZoXScsXG4gICAgfTtcbiAgICBjb25zdCB3aWR0aCA9IHNpemVNYXBbc2l6ZV0gfHwgJ21heC13LW1kJztcbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpeGVkIGluc2V0LTAgei01MCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBtb2RhbC1iYWNrZHJvcFwiIG9uQ2xpY2s9e29uQ2xvc2V9PlxuICAgICAgICAgICAgey8qIEZsZXgtY29sdW1uIHNoZWxsOiBoZWFkZXIgKGZpeGVkKSArIHNjcm9sbGFibGUgY29udGVudCArIHN0aWNreSBmb290ZXIuXG4gICAgICAgICAgICAgICAgQ3JpdGljYWwgZm9yIHNpemU9XCJtYXhcIiB3aGVyZSBjaGlsZHJlbiBhbG9uZSBleGNlZWQgdGhlIG1vZGFsIGhlaWdodFxuICAgICAgICAgICAgICAgIGFuZCB3b3VsZCBvdGhlcndpc2UgcHVzaCB0aGUgU2F2ZSAmIHJldHVybiBidXR0b24gYmVsb3cgdGhlIHZpZXdwb3J0LiAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgYmctc2xhdGUtOTAwIGJvcmRlci0yIHJvdW5kZWQtMnhsIHctZnVsbCAke3dpZHRofSBteC00IGZhZGUtdXAgZmxleCBmbGV4LWNvbGB9XG4gICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpfVxuICAgICAgICAgICAgICAgICBzdHlsZT17e2JvcmRlckNvbG9yOmAke2N9NjZgLCBtYXhIZWlnaHQ6ICc5MnZoJ319PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1zdGFydCBqdXN0aWZ5LWJldHdlZW4gcC02IHBiLTQgYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTgwMC82MCBzaHJpbmstMFwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtbGcgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0XCIgc3R5bGU9e3tjb2xvcjpjfX0+e3RpdGxlfTwvaDM+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtc2xhdGUtNTAwIG10LTFcIj57c3VidGl0bGV9PC9wPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cIm1vZGFsLWNsb3NlXCIgb25DbGljaz17b25DbG9zZX0gY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgaG92ZXI6dGV4dC13aGl0ZSB0ZXh0LTJ4bCBsZWFkaW5nLW5vbmVcIj7DlzwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xIG1pbi1oLTAgb3ZlcmZsb3cteS1hdXRvIHB4LTYgcHktNVwiPlxuICAgICAgICAgICAgICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWVuZCBnYXAtMyBweC02IHB5LTQgYm9yZGVyLXQgYm9yZGVyLXNsYXRlLTgwMCBzaHJpbmstMCBiZy1zbGF0ZS05MDAgcm91bmRlZC1iLTJ4bFwiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwibW9kYWwtY2FuY2VsXCIgb25DbGljaz17b25DbG9zZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC00IHB5LTIgcm91bmRlZC1sZyBiZy1zbGF0ZS04MDAgYm9yZGVyIGJvcmRlci1zbGF0ZS03MDAgdGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS00MDAgaG92ZXI6Ymctc2xhdGUtNzAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dCgnY2FuY2VsJyl9XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwibW9kYWwtc2F2ZVwiIG9uQ2xpY2s9e29uU2F2ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC01IHB5LTIgcm91bmRlZC1sZyB0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayB0ZXh0LXdoaXRlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6YywgYm94U2hhZG93OmAwIDAgMTJweCAke2N9NTVgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dCgnc3dfc2F2ZV9yZXR1cm4nKX1cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuLyogbW91bnQgKi9cblJlYWN0RE9NLmNyZWF0ZVJvb3QoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKSkucmVuZGVyKDxBcHAvPik7XG59KSgpO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxZQUFZO0VBQ2IsSUFBQUEsTUFBQSxHQUE4QkMsS0FBSztJQUEzQkMsUUFBUSxHQUFBRixNQUFBLENBQVJFLFFBQVE7SUFBRUMsT0FBTyxHQUFBSCxNQUFBLENBQVBHLE9BQU87O0VBRXpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7RUFDQSxJQUFNQyxDQUFDLEdBQUlDLENBQUMsSUFBTSxPQUFPQyxNQUFNLEtBQUssV0FBVyxJQUFJQSxNQUFNLENBQUNGLENBQUMsR0FBR0UsTUFBTSxDQUFDRixDQUFDLENBQUNDLENBQUMsQ0FBQyxHQUFHQSxDQUFFO0VBQzlFLElBQU1FLE9BQU8sR0FBR0EsQ0FBQSxLQUFPLE9BQU9ELE1BQU0sS0FBSyxXQUFXLElBQUlBLE1BQU0sQ0FBQ0MsT0FBTyxHQUFHRCxNQUFNLENBQUNDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSzs7RUFFakc7QUFDQTtBQUNBO0VBQ0EsSUFBTUMsS0FBSyxHQUFHO0VBQ1Y7QUFDSjtBQUNBO0FBQ0E7QUFDQTtFQUNJO0lBQUVDLEdBQUcsRUFBQyxLQUFLO0lBQU9DLFFBQVEsRUFBQyxhQUFhO0lBQU9DLE1BQU0sRUFBQyxpQkFBaUI7SUFBT0MsSUFBSSxFQUFDLE1BQU07SUFBR0MsU0FBUyxFQUFDLFNBQVM7SUFBRUMsTUFBTSxFQUFDO0VBQVMsQ0FBQyxFQUNsSTtJQUFFTCxHQUFHLEVBQUMsVUFBVTtJQUFFQyxRQUFRLEVBQUMsa0JBQWtCO0lBQUVDLE1BQU0sRUFBQyxzQkFBc0I7SUFBRUMsSUFBSSxFQUFDLE9BQU87SUFBRUMsU0FBUyxFQUFDLFNBQVM7SUFBRUMsTUFBTSxFQUFDO0VBQVMsQ0FBQyxFQUNsSTtJQUFFTCxHQUFHLEVBQUMsVUFBVTtJQUFFQyxRQUFRLEVBQUMsa0JBQWtCO0lBQUVDLE1BQU0sRUFBQyxzQkFBc0I7SUFBRUMsSUFBSSxFQUFDLE9BQU87SUFBRUMsU0FBUyxFQUFDLFNBQVM7SUFBRUMsTUFBTSxFQUFDO0VBQVMsQ0FBQyxFQUNsSTtJQUFFTCxHQUFHLEVBQUMsU0FBUztJQUFHQyxRQUFRLEVBQUMsZ0JBQWdCO0lBQUlDLE1BQU0sRUFBQyxvQkFBb0I7SUFBSUMsSUFBSSxFQUFDLE9BQU87SUFBRUMsU0FBUyxFQUFDLFNBQVM7SUFBRUMsTUFBTSxFQUFDO0VBQVMsQ0FBQyxFQUNsSTtJQUFFTCxHQUFHLEVBQUMsUUFBUTtJQUFJQyxRQUFRLEVBQUMsZ0JBQWdCO0lBQUlDLE1BQU0sRUFBQyxvQkFBb0I7SUFBSUMsSUFBSSxFQUFDLE1BQU07SUFBR0MsU0FBUyxFQUFDLFNBQVM7SUFBRUMsTUFBTSxFQUFDLE1BQU07SUFBRUMsSUFBSSxFQUFDO0VBQTBCLENBQUMsQ0FDbks7O0VBRUQ7QUFDQTtBQUNBO0VBQ0EsU0FBU0MsR0FBR0EsQ0FBQSxFQUFHO0lBQ1hULE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBRztJQUNiO0lBQ0EsSUFBQVUsU0FBQSxHQUF3QmYsUUFBUSxDQUFDO1FBQUVnQixHQUFHLEVBQUMsS0FBSztRQUFFQyxRQUFRLEVBQUMsS0FBSztRQUFFQyxRQUFRLEVBQUMsS0FBSztRQUFFQyxPQUFPLEVBQUMsS0FBSztRQUFFQyxNQUFNLEVBQUM7TUFBTSxDQUFDLENBQUM7TUFBQUMsVUFBQSxHQUFBQyxjQUFBLENBQUFQLFNBQUE7TUFBckdRLElBQUksR0FBQUYsVUFBQTtNQUFFRyxPQUFPLEdBQUFILFVBQUE7SUFDcEIsSUFBQUksVUFBQSxHQUEwQnpCLFFBQVEsQ0FBQyxLQUFLLENBQUM7TUFBQTBCLFVBQUEsR0FBQUosY0FBQSxDQUFBRyxVQUFBO01BQWxDRSxLQUFLLEdBQUFELFVBQUE7TUFBRUUsUUFBUSxHQUFBRixVQUFBLElBQW9CLENBQUc7SUFDN0MsSUFBQUcsVUFBQSxHQUEwQjdCLFFBQVEsQ0FBQyxJQUFJLENBQUM7TUFBQThCLFVBQUEsR0FBQVIsY0FBQSxDQUFBTyxVQUFBO01BQWpDRSxLQUFLLEdBQUFELFVBQUE7TUFBRUUsUUFBUSxHQUFBRixVQUFBLElBQW1CLENBQUs7O0lBRTlDLElBQUFHLFVBQUEsR0FBb0NqQyxRQUFRLENBQUM7UUFBRWtDLE1BQU0sRUFBQyxJQUFJO1FBQUVDLFFBQVEsRUFBQyxRQUFRO1FBQUVDLElBQUksRUFBQyxFQUFFO1FBQUVDLElBQUksRUFBQyxFQUFFO1FBQUVDLEdBQUcsRUFBQyxDQUFDLEVBQUU7UUFBRUMsR0FBRyxFQUFDLEVBQUU7UUFBRUMsS0FBSyxFQUFDLE1BQU07UUFBRUMsU0FBUyxFQUFDO01BQUksQ0FBQyxDQUFDO01BQUFDLFVBQUEsR0FBQXBCLGNBQUEsQ0FBQVcsVUFBQTtNQUF6SVUsTUFBTSxHQUFBRCxVQUFBO01BQUVFLFNBQVMsR0FBQUYsVUFBQTtJQUN4QixJQUFBRyxVQUFBLEdBQW9DN0MsUUFBUSxDQUFDLE1BQU07UUFDL0MsSUFBSThDLE1BQU0sR0FBRyxNQUFNO1FBQ25CLElBQUk7VUFDQSxJQUFNQyxDQUFDLEdBQUdDLFlBQVksQ0FBQ0MsT0FBTyxDQUFDLHNCQUFzQixDQUFDO1VBQ3RELElBQUlGLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBQyxHQUFHLEVBQUMsSUFBSSxFQUFDLEdBQUcsRUFBQyxJQUFJLEVBQUMsR0FBRyxFQUFDLElBQUksRUFBQyxHQUFHLEVBQUMsSUFBSSxDQUFDLENBQUNHLE9BQU8sQ0FBQ0gsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFRCxNQUFNLEdBQUdDLENBQUM7UUFDckYsQ0FBQyxDQUFDLE9BQU9JLENBQUMsRUFBRSxDQUFDO1FBQ2IsT0FBTztVQUFFQyxRQUFRLEVBQUMsYUFBYTtVQUFFQyxJQUFJLEVBQUMsYUFBYTtVQUFFQyxHQUFHLEVBQUMsT0FBTztVQUFFQyxHQUFHLEVBQUMsQ0FBQyxPQUFPO1VBQUVDLGNBQWMsRUFBRVY7UUFBTyxDQUFDO01BQzVHLENBQUMsQ0FBQztNQUFBVyxVQUFBLEdBQUFuQyxjQUFBLENBQUF1QixVQUFBO01BUEthLE1BQU0sR0FBQUQsVUFBQTtNQUFFRSxTQUFTLEdBQUFGLFVBQUE7SUFReEIsSUFBQUcsVUFBQSxHQUFvQzVELFFBQVEsQ0FBQyxNQUFNO1FBQy9DO0FBQ1I7QUFDQTtRQUNRLElBQUk7VUFDQSxJQUFNK0MsQ0FBQyxHQUFHQyxZQUFZLENBQUNDLE9BQU8sQ0FBQyxXQUFXLENBQUM7VUFDM0MsSUFBTVksT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFDLE9BQU8sRUFBQyxPQUFPLEVBQUMsSUFBSSxFQUFDLElBQUksQ0FBQztVQUNoRCxJQUFJZCxDQUFDLElBQUljLE9BQU8sQ0FBQ1gsT0FBTyxDQUFDSCxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxPQUFPO1lBQUVlLElBQUksRUFBRWY7VUFBRSxDQUFDO1FBQzFELENBQUMsQ0FBQyxPQUFPSSxDQUFDLEVBQUUsQ0FBRTtRQUNkLE9BQU87VUFBRVcsSUFBSSxFQUFDO1FBQUssQ0FBQztNQUN4QixDQUFDLENBQUM7TUFBQUMsV0FBQSxHQUFBekMsY0FBQSxDQUFBc0MsVUFBQTtNQVZLSSxPQUFPLEdBQUFELFdBQUE7TUFBRUUsVUFBVSxHQUFBRixXQUFBO0lBVzFCLElBQUFHLFdBQUEsR0FBb0NsRSxRQUFRLENBQUM7UUFBRW1FLE9BQU8sRUFBQyxDQUFDLFNBQVMsRUFBQyxRQUFRLEVBQUMsWUFBWTtNQUFFLENBQUMsQ0FBQztNQUFBQyxXQUFBLEdBQUE5QyxjQUFBLENBQUE0QyxXQUFBO01BQXBGRyxTQUFTLEdBQUFELFdBQUE7TUFBRUUsWUFBWSxHQUFBRixXQUFBO0lBRTlCLElBQU1HLGFBQWEsR0FBR0MsTUFBTSxDQUFDQyxNQUFNLENBQUNsRCxJQUFJLENBQUMsQ0FBQ21ELE1BQU0sQ0FBQ0MsT0FBTyxDQUFDLENBQUNDLE1BQU07SUFFaEUsSUFBTUMsTUFBTSxHQUFJdEUsR0FBRyxJQUFLO01BQ3BCaUIsT0FBTyxDQUFDc0QsQ0FBQyxJQUFBQyxhQUFBLENBQUFBLGFBQUEsS0FBU0QsQ0FBQztRQUFFLENBQUN2RSxHQUFHLEdBQUU7TUFBSSxFQUFFLENBQUM7TUFDbENxQixRQUFRLENBQUMsS0FBSyxDQUFDO01BQ2ZJLFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDbEIsQ0FBQzs7SUFFRDtJQUNBLElBQUlMLEtBQUssS0FBSyxLQUFLLEVBQUU7TUFDakIsb0JBQU81QixLQUFBLENBQUFpRixhQUFBLENBQUNDLG1CQUFtQjtRQUFDQyxHQUFHLEVBQUV2QyxNQUFPO1FBQUN3QyxNQUFNLEVBQUV2QyxTQUFVO1FBQy9Cd0MsTUFBTSxFQUFFQSxDQUFBLEtBQU14RCxRQUFRLENBQUMsS0FBSyxDQUFFO1FBQzlCeUQsTUFBTSxFQUFFQSxDQUFBLEtBQU1SLE1BQU0sQ0FBQyxLQUFLO01BQUUsQ0FBRSxDQUFDO0lBQy9EOztJQUVBO0lBQ0Esb0JBQ0k5RSxLQUFBLENBQUFpRixhQUFBO01BQUtNLFNBQVMsRUFBQztJQUF3QixnQkFFbkN2RixLQUFBLENBQUFpRixhQUFBO01BQUtNLFNBQVMsRUFBQztJQUFtRSxnQkFDOUV2RixLQUFBLENBQUFpRixhQUFBLDJCQUNJakYsS0FBQSxDQUFBaUYsYUFBQTtNQUFJTSxTQUFTLEVBQUM7SUFBaUUsZ0JBQzNFdkYsS0FBQSxDQUFBaUYsYUFBQTtNQUFNTSxTQUFTLEVBQUM7SUFBYyxHQUFDLE1BQVUsQ0FBQyxLQUFDLGVBQUF2RixLQUFBLENBQUFpRixhQUFBO01BQU1NLFNBQVMsRUFBQztJQUFZLEdBQUMsUUFBWSxDQUFDLGVBQ3JGdkYsS0FBQSxDQUFBaUYsYUFBQTtNQUFNTSxTQUFTLEVBQUM7SUFBbUMsR0FBQyx1QkFBK0IsQ0FDbkYsQ0FBQyxlQUNMdkYsS0FBQSxDQUFBaUYsYUFBQTtNQUFHTSxTQUFTLEVBQUM7SUFBcUQsR0FBRXBGLENBQUMsQ0FBQyxhQUFhLENBQUssQ0FDdkYsQ0FBQyxlQUNOSCxLQUFBLENBQUFpRixhQUFBO01BQUtNLFNBQVMsRUFBQztJQUF5QixnQkFDcEN2RixLQUFBLENBQUFpRixhQUFBO01BQUduRSxJQUFJLEVBQUMsaUJBQWlCO01BQ3RCMEUsT0FBTyxFQUFFQSxDQUFBLEtBQU07UUFBRSxJQUFJO1VBQUV2QyxZQUFZLENBQUN3QyxPQUFPLENBQUMsaUJBQWlCLEVBQUMsR0FBRyxDQUFDO1FBQUUsQ0FBQyxDQUFDLE9BQU1yQyxDQUFDLEVBQUMsQ0FBQztNQUFFLENBQUU7TUFDbkZtQyxTQUFTLEVBQUM7SUFBMEUsR0FBRXBGLENBQUMsQ0FBQyxhQUFhLENBQUssQ0FDNUcsQ0FDSixDQUFDLGVBV05ILEtBQUEsQ0FBQWlGLGFBQUE7TUFBS00sU0FBUyxFQUFDLDBCQUEwQjtNQUNwQ0csS0FBSyxFQUFFO1FBQUVDLEtBQUssRUFBQyxrQkFBa0I7UUFBRUMsV0FBVyxFQUFDLE9BQU87UUFBRUMsY0FBYyxFQUFDO01BQU87SUFBRSxnQkFRakY3RixLQUFBLENBQUFpRixhQUFBO01BQUtNLFNBQVMsRUFBQyw4R0FBOEc7TUFDeEgsZUFBWSxNQUFNO01BQ2xCRyxLQUFLLEVBQUU7UUFBQ0MsS0FBSyxFQUFDLEtBQUs7UUFBRUMsV0FBVyxFQUFDO01BQUs7SUFBRSxnQkFDekM1RixLQUFBLENBQUFpRixhQUFBO01BQUthLEdBQUcsRUFBQyxvQ0FBb0M7TUFBQ0MsR0FBRyxFQUFDLEVBQUU7TUFDL0NSLFNBQVMsRUFBQyw2Q0FBNkM7TUFDdkRHLEtBQUssRUFBRTtRQUFDTSxPQUFPLEVBQUM7TUFBSTtJQUFFLENBQUUsQ0FBQyxlQUc5QmhHLEtBQUEsQ0FBQWlGLGFBQUE7TUFBS00sU0FBUyxFQUFDLGtCQUFrQjtNQUM1QkcsS0FBSyxFQUFFO1FBQUNPLFVBQVUsRUFBQztNQUF3RztJQUFFLENBQUMsQ0FDbEksQ0FBQyxFQUVMMUYsS0FBSyxDQUFDMkYsR0FBRyxDQUFDLENBQUNDLENBQUMsRUFBRUMsQ0FBQyxLQUFLO01BQ2pCLElBQU1DLFFBQVEsR0FBRyxDQUFDLEVBQUUsR0FBR0QsQ0FBQyxHQUFHLEVBQUU7TUFDN0IsSUFBTUUsS0FBSyxHQUFHRCxRQUFRLEdBQUdFLElBQUksQ0FBQ0MsRUFBRSxHQUFHLEdBQUc7TUFDdEMsSUFBTUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUF3QjtNQUNyQyxJQUFNQyxDQUFDLEdBQUcsRUFBRSxHQUFHRCxDQUFDLEdBQUdGLElBQUksQ0FBQ0ksR0FBRyxDQUFDTCxLQUFLLENBQUMsQ0FBQyxDQUFFO01BQ3JDLElBQU1NLENBQUMsR0FBRyxFQUFFLEdBQUdILENBQUMsR0FBR0YsSUFBSSxDQUFDTSxHQUFHLENBQUNQLEtBQUssQ0FBQyxDQUFDLENBQUU7TUFDckMsb0JBQ0l0RyxLQUFBLENBQUFpRixhQUFBLENBQUM2QixVQUFVO1FBQUN0RyxHQUFHLEVBQUUyRixDQUFDLENBQUMzRixHQUFJO1FBQ1h1RyxJQUFJLEVBQUVaLENBQUU7UUFDUjNFLElBQUksRUFBRUEsSUFBSSxDQUFDMkUsQ0FBQyxDQUFDM0YsR0FBRyxDQUFFO1FBQ2xCd0csS0FBSyxFQUFFWixDQUFDLEdBQUMsQ0FBRTtRQUNYYSxPQUFPLEVBQUVQLENBQUU7UUFDWFEsTUFBTSxFQUFFTixDQUFFO1FBQ1ZwQixPQUFPLEVBQUVBLENBQUEsS0FBTTtVQUNYLElBQUlXLENBQUMsQ0FBQ3hGLElBQUksS0FBSyxNQUFNLEVBQU9rQixRQUFRLENBQUNzRSxDQUFDLENBQUMzRixHQUFHLENBQUMsQ0FBQyxLQUN2QyxJQUFJMkYsQ0FBQyxDQUFDeEYsSUFBSSxLQUFLLE1BQU0sRUFBRTtZQUN4QjtBQUM1QztBQUNBO1lBQzRDTixNQUFNLENBQUNhLFFBQVEsQ0FBQ0osSUFBSSxHQUFHcUYsQ0FBQyxDQUFDckYsSUFBSTtVQUNqQyxDQUFDLE1BQTJCbUIsUUFBUSxDQUFDa0UsQ0FBQyxDQUFDM0YsR0FBRyxDQUFDO1FBQy9DO01BQUUsQ0FBRSxDQUFDO0lBRXpCLENBQUMsQ0FBQyxlQVFGUixLQUFBLENBQUFpRixhQUFBO01BQUtNLFNBQVMsRUFBQyxvREFBb0Q7TUFDOUQ0QixPQUFPLEVBQUMsYUFBYTtNQUFDQyxtQkFBbUIsRUFBQyxNQUFNO01BQUMsZUFBWTtJQUFNLGdCQUNwRXBILEtBQUEsQ0FBQWlGLGFBQUEsNEJBQ0lqRixLQUFBLENBQUFpRixhQUFBO01BQU1vQyxFQUFFLEVBQUMsb0JBQW9CO01BQUNDLFNBQVMsRUFBQyxnQkFBZ0I7TUFDbERaLENBQUMsRUFBQyxHQUFHO01BQUNFLENBQUMsRUFBQyxHQUFHO01BQUNqQixLQUFLLEVBQUMsS0FBSztNQUFDNEIsTUFBTSxFQUFDO0lBQUssZ0JBQ3RDdkgsS0FBQSxDQUFBaUYsYUFBQTtNQUFNeUIsQ0FBQyxFQUFDLEdBQUc7TUFBQ0UsQ0FBQyxFQUFDLEdBQUc7TUFBQ2pCLEtBQUssRUFBQyxLQUFLO01BQUM0QixNQUFNLEVBQUMsS0FBSztNQUFDQyxJQUFJLEVBQUM7SUFBTyxDQUFFLENBQUMsRUFDekRqSCxLQUFLLENBQUMyRixHQUFHLENBQUMsQ0FBQ3VCLENBQUMsRUFBRXJCLENBQUMsS0FBSztNQUNqQixJQUFNc0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUd0QixDQUFDLEdBQUcsRUFBRSxJQUFJRyxJQUFJLENBQUNDLEVBQUUsR0FBRyxHQUFHO01BQ3hDLElBQU1tQixFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBR3BCLElBQUksQ0FBQ0ksR0FBRyxDQUFDZSxDQUFDLENBQUM7TUFDaEMsSUFBTUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUdyQixJQUFJLENBQUNNLEdBQUcsQ0FBQ2EsQ0FBQyxDQUFDO01BQ2hDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO01BQ2dDLG9CQUFPMUgsS0FBQSxDQUFBaUYsYUFBQTtRQUFRekUsR0FBRyxFQUFFNEYsQ0FBRTtRQUFDdUIsRUFBRSxFQUFFQSxFQUFHO1FBQUNDLEVBQUUsRUFBRUEsRUFBRztRQUFDbkIsQ0FBQyxFQUFDLElBQUk7UUFBQ2UsSUFBSSxFQUFDO01BQU8sQ0FBRSxDQUFDO0lBQ2pFLENBQUMsQ0FDQyxDQUNKLENBQUMsZUFDUHhILEtBQUEsQ0FBQWlGLGFBQUE7TUFBUTBDLEVBQUUsRUFBQyxJQUFJO01BQUNDLEVBQUUsRUFBQyxJQUFJO01BQUNuQixDQUFDLEVBQUMsSUFBSTtNQUN0QmUsSUFBSSxFQUFDLE1BQU07TUFDWEssTUFBTSxFQUFDLHdCQUF3QjtNQUMvQkMsV0FBVyxFQUFDLE1BQU07TUFDbEJDLElBQUksRUFBQztJQUEwQixDQUFFLENBQ3hDLENBQUMsZUFTTi9ILEtBQUEsQ0FBQWlGLGFBQUE7TUFBSyxlQUFZLHVCQUF1QjtNQUNuQ00sU0FBUyxFQUFDO0lBQXlHLGdCQUNwSHZGLEtBQUEsQ0FBQWlGLGFBQUE7TUFBS00sU0FBUyx5SUFBQXlDLE1BQUEsQ0FDS3hELGFBQWEsS0FBSyxDQUFDLEdBQUcsa0JBQWtCLEdBQUcsWUFBWSxDQUFHO01BQ3hFa0IsS0FBSyxFQUFFO1FBQUN1QyxVQUFVLEVBQUM7TUFBeUQ7SUFBRSxHQUM5RXpELGFBQWEsRUFBQyxJQUNkLENBQUMsZUFDTnhFLEtBQUEsQ0FBQWlGLGFBQUE7TUFBS00sU0FBUyxFQUFDLHNGQUFzRjtNQUNoR0csS0FBSyxFQUFFO1FBQUN1QyxVQUFVLEVBQUM7TUFBNkI7SUFBRSxHQUNsRDlILENBQUMsQ0FBQyxTQUFTLENBQ1gsQ0FDSixDQUNKLENBQUMsZUFHTkgsS0FBQSxDQUFBaUYsYUFBQTtNQUFLTSxTQUFTLEVBQUMsbUVBQW1FO01BQUNHLEtBQUssRUFBRTtRQUFDRyxjQUFjLEVBQUM7TUFBTTtJQUFFLGdCQUM5RzdGLEtBQUEsQ0FBQWlGLGFBQUE7TUFBR00sU0FBUyxFQUFDO0lBQWtDLEdBQzFDZixhQUFhLEtBQUssQ0FBQyxJQUFJckUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxFQUN6Q3FFLGFBQWEsR0FBRyxDQUFDLElBQUlBLGFBQWEsR0FBRyxDQUFDLGNBQUF3RCxNQUFBLENBQVMsQ0FBQyxHQUFHeEQsYUFBYSxPQUFBd0QsTUFBQSxDQUFJN0gsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUUsRUFDN0ZxRSxhQUFhLEtBQUssQ0FBQyxJQUFJckUsQ0FBQyxDQUFDLGtCQUFrQixDQUM3QyxDQUFDLGVBQ0pILEtBQUEsQ0FBQWlGLGFBQUE7TUFBR25FLElBQUksRUFBQyxpQkFBaUI7TUFDdEIwRSxPQUFPLEVBQUVBLENBQUEsS0FBTTtRQUFFLElBQUk7VUFBRXZDLFlBQVksQ0FBQ3dDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBQyxHQUFHLENBQUM7UUFBRSxDQUFDLENBQUMsT0FBTXJDLENBQUMsRUFBQyxDQUFDO01BQUUsQ0FBRTtNQUNuRm1DLFNBQVMscUhBQUF5QyxNQUFBLENBQ0l4RCxhQUFhLEtBQUssQ0FBQyxHQUNmLGdGQUFnRixHQUNoRiw2RUFBNkU7SUFBRyxHQUMvRnJFLENBQUMsQ0FBQyxtQkFBbUIsQ0FDdkIsQ0FDRixDQUFDLEVBR0w2QixLQUFLLEtBQUssVUFBVSxpQkFBSWhDLEtBQUEsQ0FBQWlGLGFBQUEsQ0FBQ2lELGFBQWE7TUFBQy9DLEdBQUcsRUFBRXhCLE1BQU87TUFBQ3lCLE1BQU0sRUFBRXhCLFNBQVU7TUFDaEN1RSxPQUFPLEVBQUVBLENBQUEsS0FBTWxHLFFBQVEsQ0FBQyxJQUFJLENBQUU7TUFDOUJxRCxNQUFNLEVBQUVBLENBQUEsS0FBTVIsTUFBTSxDQUFDLFVBQVU7SUFBRSxDQUFFLENBQUMsRUFDMUU5QyxLQUFLLEtBQUssVUFBVSxpQkFBSWhDLEtBQUEsQ0FBQWlGLGFBQUEsQ0FBQ21ELGFBQWE7TUFBQ2pELEdBQUcsRUFBRWxCLE9BQVE7TUFBQ21CLE1BQU0sRUFBRWxCLFVBQVc7TUFDbENpRSxPQUFPLEVBQUVBLENBQUEsS0FBTWxHLFFBQVEsQ0FBQyxJQUFJLENBQUU7TUFDOUJxRCxNQUFNLEVBQUVBLENBQUEsS0FBTVIsTUFBTSxDQUFDLFVBQVU7SUFBRSxDQUFFLENBQUMsRUFDMUU5QyxLQUFLLEtBQUssU0FBUyxpQkFBS2hDLEtBQUEsQ0FBQWlGLGFBQUEsQ0FBQ29ELFlBQVk7TUFBRWxELEdBQUcsRUFBRWIsU0FBVTtNQUFDYyxNQUFNLEVBQUViLFlBQWE7TUFDdEM0RCxPQUFPLEVBQUVBLENBQUEsS0FBTWxHLFFBQVEsQ0FBQyxJQUFJLENBQUU7TUFDOUJxRCxNQUFNLEVBQUVBLENBQUEsS0FBTVIsTUFBTSxDQUFDLFNBQVM7SUFBRSxDQUFFLENBQ3hFLENBQUM7RUFFZDs7RUFFQTtBQUNBO0FBQ0E7QUFDQTtFQUNBLFNBQVN3RCxJQUFJQSxDQUFBQyxJQUFBLEVBQWlDO0lBQUEsSUFBOUJ4QixJQUFJLEdBQUF3QixJQUFBLENBQUp4QixJQUFJO01BQUV2RixJQUFJLEdBQUErRyxJQUFBLENBQUovRyxJQUFJO01BQUV3RixLQUFLLEdBQUF1QixJQUFBLENBQUx2QixLQUFLO01BQUV4QixPQUFPLEdBQUErQyxJQUFBLENBQVAvQyxPQUFPO0lBQ3RDLG9CQUNJeEYsS0FBQSxDQUFBaUYsYUFBQTtNQUFRTyxPQUFPLEVBQUVBLE9BQVE7TUFDakIsNkJBQUF3QyxNQUFBLENBQTJCakIsSUFBSSxDQUFDdkcsR0FBRyxDQUFHO01BQ3RDLGNBQVlMLENBQUMsQ0FBQzRHLElBQUksQ0FBQ3RHLFFBQVEsQ0FBRTtNQUM3QjhFLFNBQVMsa0lBQUF5QyxNQUFBLENBQzRCeEcsSUFBSSxHQUFHLE1BQU0sR0FBRyxFQUFFO0lBQUcsR0FDN0RBLElBQUksaUJBQUl4QixLQUFBLENBQUFpRixhQUFBO01BQU1NLFNBQVMsRUFBQyxPQUFPO01BQUMsNkJBQUF5QyxNQUFBLENBQTJCakIsSUFBSSxDQUFDdkcsR0FBRztJQUFRLEdBQUMsUUFBTyxDQUFDLGVBQ3JGUixLQUFBLENBQUFpRixhQUFBO01BQUtNLFNBQVMsRUFBQztJQUE4QixnQkFDekN2RixLQUFBLENBQUFpRixhQUFBO01BQUtNLFNBQVMsRUFBQyx1REFBdUQ7TUFDakVHLEtBQUssRUFBRTtRQUFDTyxVQUFVLEtBQUErQixNQUFBLENBQUlqQixJQUFJLENBQUNuRyxTQUFTLE9BQUk7UUFBRTRILE1BQU0sZUFBQVIsTUFBQSxDQUFjakIsSUFBSSxDQUFDbkcsU0FBUztNQUFJO0lBQUUsZ0JBQ25GWixLQUFBLENBQUFpRixhQUFBLENBQUN3RCxRQUFRO01BQUM5SCxJQUFJLEVBQUVvRyxJQUFJLENBQUN2RyxHQUFJO01BQUNrSSxLQUFLLEVBQUUzQixJQUFJLENBQUNuRztJQUFVLENBQUUsQ0FDakQsQ0FBQyxlQUNOWixLQUFBLENBQUFpRixhQUFBO01BQUtNLFNBQVMsRUFBQztJQUFvQyxHQUFDLEdBQUMsRUFBQ3lCLEtBQVcsQ0FDaEUsQ0FBQyxlQUNOaEgsS0FBQSxDQUFBaUYsYUFBQTtNQUFJTSxTQUFTLEVBQUMsNkRBQTZEO01BQ3ZFRyxLQUFLLEVBQUU7UUFBQ2dELEtBQUssRUFBQzNCLElBQUksQ0FBQ25HO01BQVM7SUFBRSxHQUFFVCxDQUFDLENBQUM0RyxJQUFJLENBQUN0RyxRQUFRLENBQU0sQ0FBQyxlQUMxRFQsS0FBQSxDQUFBaUYsYUFBQTtNQUFHTSxTQUFTLEVBQUM7SUFBcUMsR0FBRXBGLENBQUMsQ0FBQzRHLElBQUksQ0FBQ3JHLE1BQU0sQ0FBSyxDQUFDLGVBQ3ZFVixLQUFBLENBQUFpRixhQUFBO01BQUtNLFNBQVMsRUFBQztJQUE2RixnQkFDeEd2RixLQUFBLENBQUFpRixhQUFBO01BQU1NLFNBQVMsRUFBQztJQUFrQyxHQUFFd0IsSUFBSSxDQUFDcEcsSUFBSSxLQUFLLE1BQU0sR0FBR1IsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxHQUFHQSxDQUFDLENBQUMsVUFBVSxDQUFRLENBQUMsRUFDbkhxQixJQUFJLGlCQUFJeEIsS0FBQSxDQUFBaUYsYUFBQTtNQUFNTSxTQUFTLEVBQUM7SUFBeUMsR0FBRXBGLENBQUMsQ0FBQyxlQUFlLENBQVEsQ0FDNUYsQ0FDRCxDQUFDO0VBRWpCOztFQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7RUFDQSxTQUFTMkcsVUFBVUEsQ0FBQTZCLEtBQUEsRUFBa0Q7SUFBQSxJQUEvQzVCLElBQUksR0FBQTRCLEtBQUEsQ0FBSjVCLElBQUk7TUFBRXZGLElBQUksR0FBQW1ILEtBQUEsQ0FBSm5ILElBQUk7TUFBRXdGLEtBQUssR0FBQTJCLEtBQUEsQ0FBTDNCLEtBQUs7TUFBRUMsT0FBTyxHQUFBMEIsS0FBQSxDQUFQMUIsT0FBTztNQUFFQyxNQUFNLEdBQUF5QixLQUFBLENBQU56QixNQUFNO01BQUUxQixPQUFPLEdBQUFtRCxLQUFBLENBQVBuRCxPQUFPO0lBQzdEO0FBQ0o7QUFDQTtJQUNJLElBQU1vRCxTQUFTLEdBQUc3QixJQUFJLENBQUNuRyxTQUFTO0lBQ2hDLG9CQUNJWixLQUFBLENBQUFpRixhQUFBO01BQVFPLE9BQU8sRUFBRUEsT0FBUTtNQUNqQiw2QkFBQXdDLE1BQUEsQ0FBMkJqQixJQUFJLENBQUN2RyxHQUFHLENBQUc7TUFDdEMsY0FBWUwsQ0FBQyxDQUFDNEcsSUFBSSxDQUFDdEcsUUFBUSxDQUFFO01BQzdCOEUsU0FBUyxzTkFBQXlDLE1BQUEsQ0FHS3hHLElBQUksR0FDQSwyREFBMkQsR0FDM0QsaUNBQWlDLENBQUc7TUFDdERrRSxLQUFLLEVBQUU7UUFDSG1ELElBQUksS0FBQWIsTUFBQSxDQUFJZixPQUFPLE1BQUc7UUFBRTZCLEdBQUcsS0FBQWQsTUFBQSxDQUFJZCxNQUFNLE1BQUc7UUFDcEN2QixLQUFLLEVBQUMsaUJBQWlCO1FBQUVDLFdBQVcsRUFBQyxLQUFLO1FBQzFDbUQsU0FBUyxFQUFDLHVCQUF1QjtRQUNqQ1AsTUFBTSxnQkFBQVIsTUFBQSxDQUFlWSxTQUFTLENBQUU7UUFDaENJLFNBQVMsZUFBQWhCLE1BQUEsQ0FBY1ksU0FBUywwQkFBQVosTUFBQSxDQUF1QlksU0FBUztNQUNwRTtJQUFFLEdBQ0xwSCxJQUFJLGlCQUNEeEIsS0FBQSxDQUFBaUYsYUFBQTtNQUFNLDZCQUFBK0MsTUFBQSxDQUEyQmpCLElBQUksQ0FBQ3ZHLEdBQUcsVUFBUTtNQUMzQytFLFNBQVMsRUFBQztJQUFtSSxHQUFDLFFBRTlJLENBQ1QsZUFDRHZGLEtBQUEsQ0FBQWlGLGFBQUE7TUFBS00sU0FBUyxFQUFDLGtEQUFrRDtNQUM1REcsS0FBSyxFQUFFO1FBQ0pDLEtBQUssRUFBQyxLQUFLO1FBQUVDLFdBQVcsRUFBQyxLQUFLO1FBQzlCSyxVQUFVLEtBQUErQixNQUFBLENBQUlqQixJQUFJLENBQUNuRyxTQUFTLE9BQUk7UUFDaEM0SCxNQUFNLGVBQUFSLE1BQUEsQ0FBY2pCLElBQUksQ0FBQ25HLFNBQVM7TUFDckM7SUFBRSxnQkFDSFosS0FBQSxDQUFBaUYsYUFBQSxDQUFDd0QsUUFBUTtNQUFDOUgsSUFBSSxFQUFFb0csSUFBSSxDQUFDdkcsR0FBSTtNQUFDa0ksS0FBSyxFQUFFM0IsSUFBSSxDQUFDbkcsU0FBVTtNQUFDcUksSUFBSSxFQUFFO0lBQUcsQ0FBRSxDQUMzRCxDQUFDLGVBQ05qSixLQUFBLENBQUFpRixhQUFBO01BQUtNLFNBQVMsRUFBQztJQUFzRCxHQUFDLEdBQUMsRUFBQ3lCLEtBQVcsQ0FBQyxlQUNwRmhILEtBQUEsQ0FBQWlGLGFBQUE7TUFBSU0sU0FBUyxFQUFDLHNHQUFzRztNQUNoSEcsS0FBSyxFQUFFO1FBQUNnRCxLQUFLLEVBQUMzQixJQUFJLENBQUNuRztNQUFTO0lBQUUsR0FDN0JULENBQUMsQ0FBQzRHLElBQUksQ0FBQ3RHLFFBQVEsQ0FDaEIsQ0FBQyxlQUNMVCxLQUFBLENBQUFpRixhQUFBO01BQUdNLFNBQVMsRUFBQztJQUErRSxHQUN2RnBGLENBQUMsQ0FBQzRHLElBQUksQ0FBQ3JHLE1BQU0sQ0FDZixDQUNDLENBQUM7RUFFakI7RUFFQSxTQUFTK0gsUUFBUUEsQ0FBQVMsS0FBQSxFQUE2QjtJQUFBLElBQTFCdkksSUFBSSxHQUFBdUksS0FBQSxDQUFKdkksSUFBSTtNQUFFK0gsS0FBSyxHQUFBUSxLQUFBLENBQUxSLEtBQUs7TUFBQVMsVUFBQSxHQUFBRCxLQUFBLENBQUVELElBQUk7TUFBSkEsSUFBSSxHQUFBRSxVQUFBLGNBQUcsRUFBRSxHQUFBQSxVQUFBO0lBQ3RDO0FBQ0o7QUFDQTtJQUNJLElBQU10QixNQUFNLEdBQUc7TUFBRUEsTUFBTSxFQUFDYSxLQUFLO01BQUVsQixJQUFJLEVBQUMsTUFBTTtNQUFFTSxXQUFXLEVBQUMsQ0FBQztNQUFFc0IsYUFBYSxFQUFDLE9BQU87TUFBRUMsY0FBYyxFQUFDO0lBQVEsQ0FBQztJQUMxRyxJQUFJMUksSUFBSSxLQUFLLEtBQUssRUFBTyxvQkFBT1gsS0FBQSxDQUFBaUYsYUFBQSxRQUFBcUUsUUFBQTtNQUFLM0QsS0FBSyxFQUFFc0QsSUFBSztNQUFDMUIsTUFBTSxFQUFFMEIsSUFBSztNQUFDOUIsT0FBTyxFQUFDO0lBQVcsR0FBS1UsTUFBTSxnQkFBRTdILEtBQUEsQ0FBQWlGLGFBQUE7TUFBTUYsQ0FBQyxFQUFDO0lBQVksQ0FBQyxDQUFDLGVBQUEvRSxLQUFBLENBQUFpRixhQUFBO01BQU1GLENBQUMsRUFBQztJQUEyQixDQUFDLENBQU0sQ0FBQztJQUNqSyxJQUFJcEUsSUFBSSxLQUFLLFVBQVUsRUFBRSxvQkFBT1gsS0FBQSxDQUFBaUYsYUFBQSxRQUFBcUUsUUFBQTtNQUFLM0QsS0FBSyxFQUFFc0QsSUFBSztNQUFDMUIsTUFBTSxFQUFFMEIsSUFBSztNQUFDOUIsT0FBTyxFQUFDO0lBQVcsR0FBS1UsTUFBTSxnQkFBRTdILEtBQUEsQ0FBQWlGLGFBQUE7TUFBTUYsQ0FBQyxFQUFDO0lBQW9ELENBQUMsQ0FBQyxlQUFBL0UsS0FBQSxDQUFBaUYsYUFBQTtNQUFRMEMsRUFBRSxFQUFDLElBQUk7TUFBQ0MsRUFBRSxFQUFDLElBQUk7TUFBQ25CLENBQUMsRUFBQztJQUFLLENBQUMsQ0FBTSxDQUFDO0lBQ3JNLElBQUk5RixJQUFJLEtBQUssVUFBVSxFQUFFLG9CQUFPWCxLQUFBLENBQUFpRixhQUFBLFFBQUFxRSxRQUFBO01BQUszRCxLQUFLLEVBQUVzRCxJQUFLO01BQUMxQixNQUFNLEVBQUUwQixJQUFLO01BQUM5QixPQUFPLEVBQUM7SUFBVyxHQUFLVSxNQUFNLGdCQUFFN0gsS0FBQSxDQUFBaUYsYUFBQTtNQUFRMEMsRUFBRSxFQUFDLElBQUk7TUFBQ0MsRUFBRSxFQUFDLElBQUk7TUFBQ25CLENBQUMsRUFBQztJQUFHLENBQUMsQ0FBQyxlQUFBekcsS0FBQSxDQUFBaUYsYUFBQTtNQUFNRixDQUFDLEVBQUM7SUFBc0QsQ0FBQyxDQUFNLENBQUM7SUFDck0sSUFBSXBFLElBQUksS0FBSyxTQUFTLEVBQUcsb0JBQU9YLEtBQUEsQ0FBQWlGLGFBQUEsUUFBQXFFLFFBQUE7TUFBSzNELEtBQUssRUFBRXNELElBQUs7TUFBQzFCLE1BQU0sRUFBRTBCLElBQUs7TUFBQzlCLE9BQU8sRUFBQztJQUFXLEdBQUtVLE1BQU0sZ0JBQUU3SCxLQUFBLENBQUFpRixhQUFBO01BQU1GLENBQUMsRUFBQztJQUFlLENBQUMsQ0FBQyxlQUFBL0UsS0FBQSxDQUFBaUYsYUFBQTtNQUFNRixDQUFDLEVBQUM7SUFBcUMsQ0FBQyxDQUFNLENBQUM7SUFDOUs7SUFDQSxJQUFJcEUsSUFBSSxLQUFLLFFBQVEsRUFBSSxvQkFBT1gsS0FBQSxDQUFBaUYsYUFBQSxRQUFBcUUsUUFBQTtNQUFLM0QsS0FBSyxFQUFFc0QsSUFBSztNQUFDMUIsTUFBTSxFQUFFMEIsSUFBSztNQUFDOUIsT0FBTyxFQUFDO0lBQVcsR0FBS1UsTUFBTSxnQkFBRTdILEtBQUEsQ0FBQWlGLGFBQUE7TUFBTUYsQ0FBQyxFQUFDO0lBQWlHLENBQUMsQ0FBTSxDQUFDO0lBQ2pOLE9BQU8sSUFBSTtFQUNmOztFQUVBO0FBQ0E7QUFDQTtFQUNBLFNBQVNHLG1CQUFtQkEsQ0FBQXFFLEtBQUEsRUFBa0M7SUFBQSxJQUEvQnBFLEdBQUcsR0FBQW9FLEtBQUEsQ0FBSHBFLEdBQUc7TUFBRUMsTUFBTSxHQUFBbUUsS0FBQSxDQUFObkUsTUFBTTtNQUFFQyxNQUFNLEdBQUFrRSxLQUFBLENBQU5sRSxNQUFNO01BQUVDLE1BQU0sR0FBQWlFLEtBQUEsQ0FBTmpFLE1BQU07SUFDdEQsSUFBTWtFLE1BQU0sR0FBR0EsQ0FBQ3BKLENBQUMsRUFBRTRDLENBQUMsS0FBS29DLE1BQU0sQ0FBQ3FFLENBQUMsSUFBQXpFLGFBQUEsQ0FBQUEsYUFBQSxLQUFTeUUsQ0FBQztNQUFFLENBQUNySixDQUFDLEdBQUU0QztJQUFDLEVBQUUsQ0FBQzs7SUFFckQ7QUFDSjtBQUNBO0FBQ0E7QUFDQTtJQUNJaEQsS0FBSyxDQUFDMEosU0FBUyxDQUFDLE1BQU07TUFDbEIsSUFBSTtRQUNBLElBQU1DLEdBQUcsR0FBTTFHLFlBQVksQ0FBQ0MsT0FBTyxDQUFDLHVCQUF1QixDQUFDO1FBQzVELElBQU0wRyxNQUFNLEdBQUczRyxZQUFZLENBQUNDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztRQUNyRCxJQUFNMkcsS0FBSyxHQUFJLENBQUMsQ0FBQztRQUNqQixJQUFJRixHQUFHLEVBQUU7VUFDTCxJQUFNRyxDQUFDLEdBQUdDLElBQUksQ0FBQ0MsS0FBSyxDQUFDTCxHQUFHLENBQUM7VUFDekIsSUFBSU0sTUFBTSxDQUFDQyxRQUFRLENBQUNKLENBQUMsQ0FBQ0ssRUFBRSxDQUFDLElBQUlGLE1BQU0sQ0FBQ0MsUUFBUSxDQUFDSixDQUFDLENBQUNNLEVBQUUsQ0FBQyxJQUFJTixDQUFDLENBQUNLLEVBQUUsR0FBR0wsQ0FBQyxDQUFDTSxFQUFFLEVBQUU7WUFDL0RQLEtBQUssQ0FBQ3hILElBQUksR0FBR3lILENBQUMsQ0FBQ0ssRUFBRTtZQUNqQk4sS0FBSyxDQUFDdkgsSUFBSSxHQUFHd0gsQ0FBQyxDQUFDTSxFQUFFO1VBQ3JCO1FBQ0o7UUFDQSxJQUFJUixNQUFNLElBQUlTLFVBQVUsQ0FBQ0MsSUFBSSxDQUFDNUQsQ0FBQyxJQUFJQSxDQUFDLENBQUNXLEVBQUUsS0FBS3VDLE1BQU0sQ0FBQyxFQUFFO1VBQ2pEQyxLQUFLLENBQUN6SCxRQUFRLEdBQUd3SCxNQUFNO1FBQzNCO1FBQ0E7UUFDQSxJQUFNVyxFQUFFLEdBQUd0SCxZQUFZLENBQUNDLE9BQU8sQ0FBQyxZQUFZLENBQUM7UUFDN0MsSUFBSXFILEVBQUUsS0FBSyxPQUFPLElBQUlBLEVBQUUsS0FBSyxNQUFNLEVBQUVWLEtBQUssQ0FBQ3BILEtBQUssR0FBRzhILEVBQUU7UUFDckQsSUFBTUMsRUFBRSxHQUFHQyxVQUFVLENBQUN4SCxZQUFZLENBQUNDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzdELElBQUkrRyxNQUFNLENBQUNDLFFBQVEsQ0FBQ00sRUFBRSxDQUFDLElBQUlBLEVBQUUsSUFBSSxHQUFHLElBQUlBLEVBQUUsSUFBSSxHQUFHLEVBQUVYLEtBQUssQ0FBQ25ILFNBQVMsR0FBRzhILEVBQUU7UUFDdkU7QUFDWjtBQUNBO1FBQ1ksSUFBSTtVQUNBLElBQU1FLEtBQUssR0FBR3pILFlBQVksQ0FBQ0MsT0FBTyxDQUFDLGlCQUFpQixDQUFDO1VBQ3JELElBQUl3SCxLQUFLLEVBQUU7WUFDUCxJQUFNQyxFQUFFLEdBQUdaLElBQUksQ0FBQ0MsS0FBSyxDQUFDVSxLQUFLLENBQUM7WUFDNUIsSUFBSVQsTUFBTSxDQUFDQyxRQUFRLENBQUNTLEVBQUUsQ0FBQ0MsR0FBRyxDQUFDLElBQUlYLE1BQU0sQ0FBQ0MsUUFBUSxDQUFDUyxFQUFFLENBQUNFLEdBQUcsQ0FBQyxJQUFJRixFQUFFLENBQUNDLEdBQUcsR0FBR0QsRUFBRSxDQUFDRSxHQUFHLEVBQUU7Y0FDdkVoQixLQUFLLENBQUN0SCxHQUFHLEdBQUdvSSxFQUFFLENBQUNDLEdBQUc7Y0FDbEJmLEtBQUssQ0FBQ3JILEdBQUcsR0FBR21JLEVBQUUsQ0FBQ0UsR0FBRztZQUN0QjtVQUNKO1FBQ0osQ0FBQyxDQUFDLE9BQU96SCxDQUFDLEVBQUUsQ0FBRTtRQUNkLElBQUlxQixNQUFNLENBQUNxRyxJQUFJLENBQUNqQixLQUFLLENBQUMsQ0FBQ2hGLE1BQU0sRUFBRU8sTUFBTSxDQUFDcUUsQ0FBQyxJQUFBekUsYUFBQSxDQUFBQSxhQUFBLEtBQVN5RSxDQUFDLEdBQUtJLEtBQUssQ0FBRSxDQUFDO01BQ2xFLENBQUMsQ0FBQyxPQUFPekcsQ0FBQyxFQUFFLENBQUU7TUFDbEI7SUFDQSxDQUFDLEVBQUUsRUFBRSxDQUFDOztJQUVOO0FBQ0o7QUFDQTtJQUNJLElBQU0ySCxjQUFjLEdBQUdBLENBQUEsS0FBTTtNQUN6QixJQUFJO1FBQ0E5SCxZQUFZLENBQUN3QyxPQUFPLENBQUMsdUJBQXVCLEVBQ3hDc0UsSUFBSSxDQUFDaUIsU0FBUyxDQUFDO1VBQUViLEVBQUUsRUFBRWhGLEdBQUcsQ0FBQzlDLElBQUk7VUFBRStILEVBQUUsRUFBRWpGLEdBQUcsQ0FBQzdDO1FBQUssQ0FBQyxDQUFDLENBQUM7UUFDbkQsSUFBSTZDLEdBQUcsQ0FBQy9DLFFBQVEsRUFBRTtVQUNkYSxZQUFZLENBQUN3QyxPQUFPLENBQUMsZ0JBQWdCLEVBQUVOLEdBQUcsQ0FBQy9DLFFBQVEsQ0FBQztRQUN4RDtRQUNBO0FBQ1o7QUFDQTtBQUNBO1FBQ1ksSUFBSStDLEdBQUcsQ0FBQzFDLEtBQUssS0FBSyxPQUFPLElBQUkwQyxHQUFHLENBQUMxQyxLQUFLLEtBQUssTUFBTSxFQUFFO1VBQy9DUSxZQUFZLENBQUN3QyxPQUFPLENBQUMsWUFBWSxFQUFFTixHQUFHLENBQUMxQyxLQUFLLENBQUM7UUFDakQ7UUFDQSxJQUFJd0gsTUFBTSxDQUFDQyxRQUFRLENBQUMvRSxHQUFHLENBQUN6QyxTQUFTLENBQUMsRUFBRTtVQUNoQ08sWUFBWSxDQUFDd0MsT0FBTyxDQUFDLGdCQUFnQixFQUFFd0YsTUFBTSxDQUFDOUYsR0FBRyxDQUFDekMsU0FBUyxDQUFDLENBQUM7UUFDakU7UUFDQTtBQUNaO0FBQ0E7QUFDQTtBQUNBO1FBQ1ksSUFBSXVILE1BQU0sQ0FBQ0MsUUFBUSxDQUFDL0UsR0FBRyxDQUFDNUMsR0FBRyxDQUFDLElBQUkwSCxNQUFNLENBQUNDLFFBQVEsQ0FBQy9FLEdBQUcsQ0FBQzNDLEdBQUcsQ0FBQyxJQUFJMkMsR0FBRyxDQUFDNUMsR0FBRyxHQUFHNEMsR0FBRyxDQUFDM0MsR0FBRyxFQUFFO1VBQzNFUyxZQUFZLENBQUN3QyxPQUFPLENBQUMsaUJBQWlCLEVBQ2xDc0UsSUFBSSxDQUFDaUIsU0FBUyxDQUFDO1lBQUVKLEdBQUcsRUFBRXpGLEdBQUcsQ0FBQzVDLEdBQUc7WUFBRXNJLEdBQUcsRUFBRTFGLEdBQUcsQ0FBQzNDO1VBQUksQ0FBQyxDQUFDLENBQUM7VUFDbkRuQyxNQUFNLENBQUM2SyxhQUFhLENBQUMsSUFBSUMsV0FBVyxDQUFDLHNCQUFzQixFQUFFO1lBQ3pEQyxNQUFNLEVBQUU7Y0FBRVIsR0FBRyxFQUFFekYsR0FBRyxDQUFDNUMsR0FBRztjQUFFc0ksR0FBRyxFQUFFMUYsR0FBRyxDQUFDM0M7WUFBSTtVQUN6QyxDQUFDLENBQUMsQ0FBQztRQUNQO1FBQ0FuQyxNQUFNLENBQUM2SyxhQUFhLENBQUMsSUFBSUMsV0FBVyxDQUFDLG1CQUFtQixFQUFFO1VBQ3REQyxNQUFNLEVBQUU7WUFDSmpCLEVBQUUsRUFBRWhGLEdBQUcsQ0FBQzlDLElBQUk7WUFDWitILEVBQUUsRUFBRWpGLEdBQUcsQ0FBQzdDLElBQUk7WUFDWnNILE1BQU0sRUFBRXpFLEdBQUcsQ0FBQy9DLFFBQVEsSUFBSSxRQUFRO1lBQ2hDaUosY0FBYyxFQUFFO1VBQ3BCO1FBQ0osQ0FBQyxDQUFDLENBQUM7UUFDSEMsT0FBTyxDQUFDQyxJQUFJLENBQUMsb0NBQW9DLEVBQUVwRyxHQUFHLENBQUM5QyxJQUFJLEVBQUUsR0FBRyxFQUFFOEMsR0FBRyxDQUFDN0MsSUFBSSxFQUM3RCxVQUFVLEVBQUU2QyxHQUFHLENBQUM1QyxHQUFHLEVBQUUsSUFBSSxFQUFFNEMsR0FBRyxDQUFDM0MsR0FBRyxFQUFFLFlBQVksRUFBRTJDLEdBQUcsQ0FBQy9DLFFBQVEsQ0FBQztNQUNoRixDQUFDLENBQUMsT0FBT2dCLENBQUMsRUFBRTtRQUNSa0ksT0FBTyxDQUFDRSxJQUFJLENBQUMsOENBQThDLEVBQUVwSSxDQUFDLENBQUM7TUFDbkU7TUFDQWtDLE1BQU0sQ0FBQyxDQUFDO0lBQ1osQ0FBQztJQUVELG9CQUNJdEYsS0FBQSxDQUFBaUYsYUFBQTtNQUFLTSxTQUFTLEVBQUM7SUFBNEIsZ0JBRXZDdkYsS0FBQSxDQUFBaUYsYUFBQTtNQUFLTSxTQUFTLEVBQUM7SUFBdUUsZ0JBQ2xGdkYsS0FBQSxDQUFBaUYsYUFBQTtNQUFRTyxPQUFPLEVBQUVILE1BQU87TUFDaEJFLFNBQVMsRUFBQztJQUE4RSxHQUMzRnBGLENBQUMsQ0FBQyxrQkFBa0IsQ0FDakIsQ0FBQyxlQUNUSCxLQUFBLENBQUFpRixhQUFBO01BQUlNLFNBQVMsRUFBQztJQUErRCxHQUFFcEYsQ0FBQyxDQUFDLHNCQUFzQixDQUFNLENBQUMsZUFDOUdILEtBQUEsQ0FBQWlGLGFBQUE7TUFBUU8sT0FBTyxFQUFFdUYsY0FBZTtNQUN4QnhGLFNBQVMsRUFBQztJQUFnSCxHQUM3SHBGLENBQUMsQ0FBQyxnQkFBZ0IsQ0FDZixDQUNQLENBQUMsZUFHTkgsS0FBQSxDQUFBaUYsYUFBQTtNQUFLTSxTQUFTLEVBQUM7SUFBcUYsZ0JBQ2hHdkYsS0FBQSxDQUFBaUYsYUFBQSxDQUFDd0csV0FBVztNQUFDdEcsR0FBRyxFQUFFQTtJQUFJLENBQUUsQ0FBQyxlQUN6Qm5GLEtBQUEsQ0FBQWlGLGFBQUEsQ0FBQ3lHLGVBQWU7TUFBQ3ZHLEdBQUcsRUFBRUEsR0FBSTtNQUFDcUUsTUFBTSxFQUFFQSxNQUFPO01BQUNwRSxNQUFNLEVBQUVBO0lBQU8sQ0FBRSxDQUMzRCxDQUNKLENBQUM7RUFFZDs7RUFFQTtBQUNBO0FBQ0E7RUFDQSxJQUFNaUYsVUFBVSxHQUFHLENBQ2Y7SUFBRWhELEVBQUUsRUFBQyxRQUFRO0lBQVdzRSxLQUFLLEVBQUMsaUJBQWlCO0lBQWtCeEIsRUFBRSxFQUFDLElBQUk7SUFBRUMsRUFBRSxFQUFDLElBQUk7SUFBRXdCLElBQUksRUFBQztFQUFHLENBQUMsRUFDNUY7SUFBRXZFLEVBQUUsRUFBQyxRQUFRO0lBQVdzRSxLQUFLLEVBQUMsUUFBUTtJQUEyQnhCLEVBQUUsRUFBQyxFQUFFO0lBQUlDLEVBQUUsRUFBQyxFQUFFO0lBQUl3QixJQUFJLEVBQUM7RUFBcUMsQ0FBQyxFQUM5SDtJQUFFdkUsRUFBRSxFQUFDLFFBQVE7SUFBV3NFLEtBQUssRUFBQyxRQUFRO0lBQTJCeEIsRUFBRSxFQUFDLEVBQUU7SUFBSUMsRUFBRSxFQUFDLEVBQUU7SUFBSXdCLElBQUksRUFBQztFQUFxQyxDQUFDLEVBQzlIO0lBQUV2RSxFQUFFLEVBQUMsT0FBTztJQUFZc0UsS0FBSyxFQUFDLGtCQUFrQjtJQUFpQnhCLEVBQUUsRUFBQyxFQUFFO0lBQUlDLEVBQUUsRUFBQyxFQUFFO0lBQUl3QixJQUFJLEVBQUM7RUFBcUMsQ0FBQyxFQUM5SDtJQUFFdkUsRUFBRSxFQUFDLFNBQVM7SUFBVXNFLEtBQUssRUFBQyxtQkFBbUI7SUFBZ0J4QixFQUFFLEVBQUMsRUFBRTtJQUFJQyxFQUFFLEVBQUMsRUFBRTtJQUFJd0IsSUFBSSxFQUFDO0VBQXFDLENBQUMsRUFDOUg7SUFBRXZFLEVBQUUsRUFBQyxVQUFVO0lBQVNzRSxLQUFLLEVBQUMsb0JBQW9CO0lBQWV4QixFQUFFLEVBQUMsRUFBRTtJQUFJQyxFQUFFLEVBQUMsRUFBRTtJQUFJd0IsSUFBSSxFQUFDO0VBQXFDLENBQUMsRUFDOUg7SUFBRXZFLEVBQUUsRUFBQyxTQUFTO0lBQVVzRSxLQUFLLEVBQUMsY0FBYztJQUFxQnhCLEVBQUUsRUFBQyxFQUFFO0lBQUlDLEVBQUUsRUFBQyxFQUFFO0lBQUl3QixJQUFJLEVBQUM7RUFBcUMsQ0FBQyxFQUM5SDtJQUFFdkUsRUFBRSxFQUFDLFNBQVM7SUFBVXNFLEtBQUssRUFBQyxjQUFjO0lBQXFCeEIsRUFBRSxFQUFDLEVBQUU7SUFBSUMsRUFBRSxFQUFDLEVBQUU7SUFBSXdCLElBQUksRUFBQztFQUFxQyxDQUFDLEVBQzlIO0lBQUV2RSxFQUFFLEVBQUMsU0FBUztJQUFVc0UsS0FBSyxFQUFDLGNBQWM7SUFBcUJ4QixFQUFFLEVBQUMsRUFBRTtJQUFJQyxFQUFFLEVBQUMsRUFBRTtJQUFJd0IsSUFBSSxFQUFDO0VBQXFDLENBQUMsRUFDOUg7SUFBRXZFLEVBQUUsRUFBQyxZQUFZO0lBQU9zRSxLQUFLLEVBQUMsaUJBQWlCO0lBQWtCeEIsRUFBRSxFQUFDLEVBQUU7SUFBSUMsRUFBRSxFQUFDLEVBQUU7SUFBSXdCLElBQUksRUFBQztFQUFxQyxDQUFDLENBQ2pJOztFQUVEO0FBQ0E7QUFDQTtBQUNBO0VBQ0EsU0FBU0gsV0FBV0EsQ0FBQUksS0FBQSxFQUFVO0lBQUEsSUFBUDFHLEdBQUcsR0FBQTBHLEtBQUEsQ0FBSDFHLEdBQUc7SUFDdEI7SUFDQSxJQUFNMkcsQ0FBQyxHQUFHLEdBQUc7TUFBRUMsQ0FBQyxHQUFHLEdBQUc7SUFDdEIsSUFBTUMsR0FBRyxHQUFHO01BQUVuRCxJQUFJLEVBQUUsRUFBRTtNQUFFb0QsS0FBSyxFQUFFLEVBQUU7TUFBRW5ELEdBQUcsRUFBRSxFQUFFO01BQUVvRCxNQUFNLEVBQUU7SUFBRyxDQUFDO0lBQ3hELElBQU1DLEtBQUssR0FBR0wsQ0FBQyxHQUFHRSxHQUFHLENBQUNuRCxJQUFJLEdBQUdtRCxHQUFHLENBQUNDLEtBQUs7SUFDdEMsSUFBTUcsS0FBSyxHQUFHTCxDQUFDLEdBQUdDLEdBQUcsQ0FBQ2xELEdBQUcsR0FBSWtELEdBQUcsQ0FBQ0UsTUFBTTtJQUV2QyxJQUFNRyxLQUFLLEdBQUdsSCxHQUFHLENBQUM1QyxHQUFHO01BQUUrSixLQUFLLEdBQUduSCxHQUFHLENBQUMzQyxHQUFHO0lBQ3RDLElBQU0rSixLQUFLLEdBQUcsQ0FBQztNQUFRQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQVU7O0lBRS9DO0lBQ0EsSUFBTTlGLENBQUMsR0FBS3ZHLENBQUMsSUFBSzZMLEdBQUcsQ0FBQ25ELElBQUksR0FBSSxDQUFDMUksQ0FBQyxHQUFHa00sS0FBSyxLQUFLQyxLQUFLLEdBQUdELEtBQUssQ0FBQyxHQUFJRixLQUFLO0lBQ3BFLElBQU12RixDQUFDLEdBQUs2RixDQUFDLElBQUtULEdBQUcsQ0FBQ2xELEdBQUcsR0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDMkQsQ0FBQyxHQUFHRixLQUFLLEtBQUtDLEtBQUssR0FBR0QsS0FBSyxDQUFDLElBQUlILEtBQUs7SUFDeEUsSUFBTU0sS0FBSyxHQUFJLE9BQU9DLElBQUksS0FBSyxVQUFVLEdBQUlBLElBQUksR0FBSSxDQUFDeE0sQ0FBQyxFQUFFeU0sRUFBRSxLQUFLLENBQUU7SUFFbEUsSUFBTUMsT0FBTyxHQUFJQyxHQUFHLElBQUtBLEdBQUcsQ0FBQzVHLEdBQUcsQ0FBQzRELENBQUMsT0FBQTlCLE1BQUEsQ0FBTyxDQUFDdEIsQ0FBQyxDQUFDb0QsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUUsQ0FBQyxFQUFFaUQsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFBL0UsTUFBQSxDQUFJLENBQUNwQixDQUFDLENBQUNrRCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBRSxDQUFDLEVBQUVpRCxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDQyxJQUFJLENBQUMsR0FBRyxDQUFDOztJQUV4RztJQUNBLElBQU1DLElBQUksR0FBRyxFQUFFO0lBQUUsS0FBSyxJQUFJOU0sRUFBQyxHQUFDLEVBQUUsRUFBRUEsRUFBQyxJQUFFLEVBQUUsRUFBRUEsRUFBQyxJQUFFLEdBQUcsRUFBRThNLElBQUksQ0FBQ0MsSUFBSSxDQUFDLENBQUMvTSxFQUFDLEVBQUV1TSxLQUFLLENBQUN2TSxFQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMzRSxJQUFNZ04sS0FBSyxHQUFFLEVBQUU7SUFBRSxLQUFLLElBQUloTixHQUFDLEdBQUMsRUFBRSxFQUFFQSxHQUFDLElBQUUsRUFBRSxFQUFFQSxHQUFDLElBQUUsR0FBRyxFQUFFZ04sS0FBSyxDQUFDRCxJQUFJLENBQUMsQ0FBQy9NLEdBQUMsRUFBRXVNLEtBQUssQ0FBQ3ZNLEdBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzdFLElBQU1pTixRQUFRLEdBQUcsRUFBRTtJQUFFLEtBQUssSUFBSWpOLEdBQUMsR0FBQyxFQUFFLEVBQUVBLEdBQUMsSUFBRSxFQUFFLEVBQUVBLEdBQUMsSUFBRSxHQUFHLEVBQUVpTixRQUFRLENBQUNGLElBQUksQ0FBQyxDQUFDL00sR0FBQyxFQUFFdU0sS0FBSyxDQUFDdk0sR0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDbkYsSUFBTWtOLE9BQU8sR0FBSSxFQUFFO0lBQUUsS0FBSyxJQUFJbE4sR0FBQyxHQUFDLEVBQUUsRUFBRUEsR0FBQyxJQUFFLEVBQUUsRUFBRUEsR0FBQyxJQUFFLEdBQUcsRUFBRWtOLE9BQU8sQ0FBQ0gsSUFBSSxDQUFDLENBQUMvTSxHQUFDLEVBQUV1TSxLQUFLLENBQUN2TSxHQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNsRixJQUFNbU4sRUFBRSxHQUFLLENBQUMsR0FBR0wsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFUCxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUVBLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHVyxPQUFPLENBQUM7SUFFNUUsSUFBTUUsUUFBUSxHQUFHLEVBQUU7SUFBRSxLQUFLLElBQUlDLEVBQUUsR0FBQyxFQUFFLEVBQUVBLEVBQUUsSUFBRSxFQUFFLEVBQUVBLEVBQUUsSUFBRSxHQUFHLEVBQUVELFFBQVEsQ0FBQ0wsSUFBSSxDQUFDLENBQUNNLEVBQUUsRUFBRWQsS0FBSyxDQUFDYyxFQUFFLEVBQUVySSxHQUFHLENBQUM3QyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzlGLElBQU1tTCxRQUFRLEdBQUcsRUFBRTtJQUFFLEtBQUssSUFBSUQsR0FBRSxHQUFDLEVBQUUsRUFBRUEsR0FBRSxJQUFFLEVBQUUsRUFBRUEsR0FBRSxJQUFFLEdBQUcsRUFBRUMsUUFBUSxDQUFDUCxJQUFJLENBQUMsQ0FBQ00sR0FBRSxFQUFFZCxLQUFLLENBQUNjLEdBQUUsRUFBRXJJLEdBQUcsQ0FBQzlDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDOUYsSUFBTXFMLEtBQUssR0FBRyxDQUFDLEdBQUdILFFBQVEsRUFBRSxHQUFHRSxRQUFRLENBQUM7SUFFeEMsSUFBTUUsRUFBRSxHQUFLLENBQUMsR0FBR1IsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFLElBQUksR0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLEdBQUMsSUFBSSxDQUFDLEVBQUUsR0FBR0MsUUFBUSxDQUFDO0lBQ3JFLElBQU1RLElBQUksR0FBRyxDQUFDLEdBQUdYLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUVQLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUVBLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM3RixJQUFNbUIsR0FBRyxHQUFJLENBQUMsR0FBR1osSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRVAsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRUEsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzdGLElBQU1vQixJQUFJLEdBQUcsQ0FBQyxHQUFHYixJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFUCxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUVBLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFDaEUsQ0FBQyxFQUFFLEVBQUVBLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRUEsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRTNFLElBQU1xQixVQUFVLEdBQUcsRUFBRTtJQUFFLEtBQUssSUFBSTVOLEdBQUMsR0FBQyxFQUFFLEVBQUVBLEdBQUMsSUFBRSxJQUFJLEVBQUVBLEdBQUMsSUFBRSxHQUFHLEVBQUU0TixVQUFVLENBQUNiLElBQUksQ0FBQyxDQUFDL00sR0FBQyxFQUFFdU0sS0FBSyxDQUFDdk0sR0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDekYsSUFBTTZOLFVBQVUsR0FBRyxFQUFFO0lBQUUsS0FBSyxJQUFJN04sR0FBQyxHQUFDLElBQUksRUFBRUEsR0FBQyxJQUFFLEVBQUUsRUFBRUEsR0FBQyxJQUFFLEdBQUcsRUFBRTZOLFVBQVUsQ0FBQ2QsSUFBSSxDQUFDLENBQUMvTSxHQUFDLEVBQUV1TSxLQUFLLENBQUN2TSxHQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN6RixJQUFNOE4sTUFBTSxHQUFHLENBQUMsR0FBR0YsVUFBVSxFQUFFLEdBQUdDLFVBQVUsQ0FBQzs7SUFFN0M7SUFDQSxJQUFNRSxTQUFTLEdBQUcsQ0FBQyxFQUFFLEVBQUUs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