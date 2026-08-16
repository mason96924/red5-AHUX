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
        var loc = {
          siteName: 'My Building',
          city: 'Toronto, ON',
          lat: 43.6532,
          lon: -79.3832,
          buildingFacing: facing,
          elevation_m: ''
        };
        try {
          var v = localStorage.getItem('red5.building_facing');
          if (v && ['auto', 'N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'].indexOf(v) >= 0) loc.buildingFacing = v;
          var wl = JSON.parse(localStorage.getItem('weatherLocation'));
          if (wl && typeof wl.lat === 'number' && typeof wl.lon === 'number') {
            loc.lat = wl.lat;
            loc.lon = wl.lon;
            loc.siteName = wl.name || loc.siteName;
            loc.city = wl.name || loc.city;
            var e = wl.elevation_m != null ? wl.elevation_m : wl.asl;
            if (Number.isFinite(Number(e))) loc.elevation_m = Math.round(Number(e));
          }
        } catch (e) {}
        return loc;
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
      var elev = l.elevation_m != null ? l.elevation_m : l.asl;
      var row = {
        name,
        lat,
        lon
      };
      if (Number.isFinite(Number(elev))) row.elevation_m = Number(elev);
      out.push(row);
    }
    return out;
  }
  function lookupElevationM(_x, _x2) {
    return _lookupElevationM.apply(this, arguments);
  }
  function _lookupElevationM() {
    _lookupElevationM = _asyncToGenerator(function* (lat, lng) {
      try {
        var url = 'https://api.open-meteo.com/v1/elevation?latitude=' + encodeURIComponent(lat) + '&longitude=' + encodeURIComponent(lng);
        var r = yield fetch(url, {
          headers: {
            Accept: 'application/json'
          }
        });
        if (!r.ok) return null;
        var j = yield r.json();
        var e = Array.isArray(j.elevation) ? j.elevation[0] : j.elevation;
        return Number.isFinite(Number(e)) ? Number(e) : null;
      } catch (_) {
        return null;
      }
    });
    return _lookupElevationM.apply(this, arguments);
  }
  function locElevationM(loc) {
    if (!loc) return null;
    var e = loc.elevation_m != null ? loc.elevation_m : loc.asl;
    return Number.isFinite(Number(e)) ? Number(e) : null;
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
          var active = j.active && typeof j.active.lat === 'number' ? j.active : j.default && typeof j.default.lat === 'number' ? j.default : null;
          var elev = locElevationM(active);
          if (elev != null) {
            setCfg(c => {
              if (Math.abs(c.lat - active.lat) > 1e-3 || Math.abs(c.lon - active.lon) > 1e-3) return c;
              if (c.elevation_m !== '' && c.elevation_m != null && Number.isFinite(Number(c.elevation_m))) return c;
              return _objectSpread(_objectSpread({}, c), {}, {
                elevation_m: Math.round(elev)
              });
            });
          }
        } catch (e) {/* offline -> localStorage value already in state */}
      })();
      return () => {
        cancelled = true;
      };
    }, []);
    React.useEffect(() => {
      var lat = Number(cfg.lat),
        lon = Number(cfg.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return undefined;
      var missing = cfg.elevation_m === '' || cfg.elevation_m == null || !Number.isFinite(Number(cfg.elevation_m));
      if (!missing) return undefined;
      var cancelled = false;
      var t = setTimeout(/*#__PURE__*/_asyncToGenerator(function* () {
        var elev = yield lookupElevationM(lat, lon);
        if (cancelled || elev == null) return;
        setCfg(c => {
          if (Number(c.lat) !== lat || Number(c.lon) !== lon) return c;
          var stillMissing = c.elevation_m === '' || c.elevation_m == null || !Number.isFinite(Number(c.elevation_m));
          if (!stillMissing) return c;
          return _objectSpread(_objectSpread({}, c), {}, {
            elevation_m: Math.round(elev)
          });
        });
      }), 400);
      return () => {
        cancelled = true;
        clearTimeout(t);
      };
    }, [cfg.lat, cfg.lon]);

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
        var elev = locElevationM(hit);
        setCfg(c => _objectSpread(_objectSpread({}, c), {}, {
          siteName: newName,
          lat,
          lon,
          city: newName,
          elevation_m: elev != null ? Math.round(elev) : ''
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
      var _ref0 = _asyncToGenerator(function* (q) {
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
      return function runSearch(_x3) {
        return _ref0.apply(this, arguments);
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
        city: hit.display_name,
        elevation_m: ''
      }));
      if (mapRef.current) mapRef.current.setView([lat, lon], hit.type === 'city' ? 11 : 15);
      setSearchOpen(false);
      setSearchQ('');
    };

    /* Reverse-geocode lat/lon -> city / country via Nominatim.  No API key. */
    var reverseGeocode = /*#__PURE__*/function () {
      var _ref1 = _asyncToGenerator(function* (lat, lon) {
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
      return function reverseGeocode(_x4, _x5) {
        return _ref1.apply(this, arguments);
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
          lon: r(lon),
          elevation_m: ''
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
          lon,
          elevation_m: ''
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
      var _ref10 = _asyncToGenerator(function* () {
        var loc = {
          lat: cfg.lat,
          lon: cfg.lon,
          name: cfg.siteName || cfg.city
        };
        var elev = Number(cfg.elevation_m);
        if (Number.isFinite(elev)) loc.elevation_m = Math.round(elev);

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
        return _ref10.apply(this, arguments);
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
    }, "Elevation (m ASL)"), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2 items-center"
    }, /*#__PURE__*/React.createElement("input", {
      className: "field-input flex-1 min-w-0",
      type: "number",
      step: "1",
      "data-testid": "loc-elevation-asl",
      value: cfg.elevation_m === '' || cfg.elevation_m == null ? '' : cfg.elevation_m,
      onChange: e => setCfg(_objectSpread(_objectSpread({}, cfg), {}, {
        elevation_m: e.target.value === '' ? '' : +e.target.value
      })),
      title: "Metres above mean sea level from terrain DEM for the site lat/lng (not GPS altitude)"
    }), /*#__PURE__*/React.createElement("button", {
      type: "button",
      "data-testid": "loc-lookup-asl",
      onClick: /*#__PURE__*/_asyncToGenerator(function* () {
        var elev = yield lookupElevationM(cfg.lat, cfg.lon);
        if (elev == null) return;
        setCfg(c => _objectSpread(_objectSpread({}, c), {}, {
          elevation_m: Math.round(elev)
        }));
      }),
      className: "shrink-0 px-2.5 py-2 rounded-lg border border-slate-600 bg-slate-800 text-[10px] font-black uppercase tracking-widest text-amber-200 hover:border-amber-400"
    }, "Lookup ASL")), /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] text-slate-500 mt-1.5 leading-snug"
    }, "ASL comes from a terrain DEM for the lat/lng (not browser GPS). Building aspect (N/S) is set on the floor plan.")), /*#__PURE__*/React.createElement("button", {
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
          city: j.name,
          elevation_m: ''
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
  function LanguageModal(_ref12) {
    var cfg = _ref12.cfg,
      setCfg = _ref12.setCfg,
      onClose = _ref12.onClose,
      onSave = _ref12.onSave;
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
  function PluginsModal(_ref13) {
    var cfg = _ref13.cfg,
      setCfg = _ref13.setCfg,
      onClose = _ref13.onClose,
      onSave = _ref13.onSave;
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
  function ModalShell(_ref14) {
    var title = _ref14.title,
      subtitle = _ref14.subtitle,
      _ref14$accent = _ref14.accent,
      accent = _ref14$accent === void 0 ? 'indigo' : _ref14$accent,
      onClose = _ref14.onClose,
      onSave = _ref14.onSave,
      _ref14$size = _ref14.size,
      size = _ref14$size === void 0 ? '' : _ref14$size,
      children = _ref14.children;
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBfd2Fsay5jb21waWxlZC5qcyIsIm5hbWVzIjpbIl9SZWFjdCIsIlJlYWN0IiwidXNlU3RhdGUiLCJ1c2VNZW1vIiwidCIsImsiLCJ3aW5kb3ciLCJ1c2VMYW5nIiwiU1RFUFMiLCJrZXkiLCJsYWJlbEtleSIsInN1YktleSIsImtpbmQiLCJpY29uQ29sb3IiLCJhY2NlbnQiLCJocmVmIiwiQXBwIiwiX3VzZVN0YXRlIiwicHN5IiwibG9jYXRpb24iLCJsYW5ndWFnZSIsInBsdWdpbnMiLCJyZXBhaXIiLCJfdXNlU3RhdGUyIiwiX3NsaWNlZFRvQXJyYXkiLCJkb25lIiwic2V0RG9uZSIsIl91c2VTdGF0ZTMiLCJfdXNlU3RhdGU0Iiwicm91dGUiLCJzZXRSb3V0ZSIsIl91c2VTdGF0ZTUiLCJfdXNlU3RhdGU2IiwibW9kYWwiLCJzZXRNb2RhbCIsIl91c2VTdGF0ZTciLCJnaXZvbmkiLCJyaFByZXNldCIsInJoTG8iLCJyaEhpIiwidExvIiwidEhpIiwidGhlbWUiLCJkYXJrTGV2ZWwiLCJfdXNlU3RhdGU4IiwicHN5Q2ZnIiwic2V0UHN5Q2ZnIiwiX3VzZVN0YXRlOSIsImZhY2luZyIsImxvYyIsInNpdGVOYW1lIiwiY2l0eSIsImxhdCIsImxvbiIsImJ1aWxkaW5nRmFjaW5nIiwiZWxldmF0aW9uX20iLCJ2IiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsImluZGV4T2YiLCJ3bCIsIkpTT04iLCJwYXJzZSIsIm5hbWUiLCJlIiwiYXNsIiwiTnVtYmVyIiwiaXNGaW5pdGUiLCJNYXRoIiwicm91bmQiLCJfdXNlU3RhdGUwIiwibG9jQ2ZnIiwic2V0TG9jQ2ZnIiwiX3VzZVN0YXRlMSIsImFsbG93ZWQiLCJsYW5nIiwiX3VzZVN0YXRlMTAiLCJsYW5nQ2ZnIiwic2V0TGFuZ0NmZyIsIl91c2VTdGF0ZTExIiwiZW5hYmxlZCIsIl91c2VTdGF0ZTEyIiwicGx1Z2luQ2ZnIiwic2V0UGx1Z2luQ2ZnIiwiY29tcGxldGVDb3VudCIsIk9iamVjdCIsInZhbHVlcyIsImZpbHRlciIsIkJvb2xlYW4iLCJsZW5ndGgiLCJmaW5pc2giLCJkIiwiX29iamVjdFNwcmVhZCIsImNyZWF0ZUVsZW1lbnQiLCJQc3lDaGFydFNldHRpbmdQYWdlIiwiY2ZnIiwic2V0Q2ZnIiwib25CYWNrIiwib25TYXZlIiwiY2xhc3NOYW1lIiwib25DbGljayIsInNldEl0ZW0iLCJzdHlsZSIsIndpZHRoIiwiYXNwZWN0UmF0aW8iLCJhbmltYXRpb25EZWxheSIsInNyYyIsImFsdCIsIm9wYWNpdHkiLCJiYWNrZ3JvdW5kIiwibWFwIiwicyIsImkiLCJhbmdsZURlZyIsImFuZ2xlIiwiUEkiLCJyIiwieCIsImNvcyIsInkiLCJzaW4iLCJDaXJjbGVUaWxlIiwic3RlcCIsImluZGV4IiwibGVmdFBjdCIsInRvcFBjdCIsInZpZXdCb3giLCJwcmVzZXJ2ZUFzcGVjdFJhdGlvIiwiaWQiLCJtYXNrVW5pdHMiLCJoZWlnaHQiLCJmaWxsIiwiXyIsImEiLCJjeCIsImN5Iiwic3Ryb2tlIiwic3Ryb2tlV2lkdGgiLCJtYXNrIiwiY29uY2F0IiwidGV4dFNoYWRvdyIsIkxvY2F0aW9uTW9kYWwiLCJvbkNsb3NlIiwiTGFuZ3VhZ2VNb2RhbCIsIlBsdWdpbnNNb2RhbCIsIlRpbGUiLCJfcmVmIiwiYm9yZGVyIiwiVGlsZUljb24iLCJjb2xvciIsIl9yZWYyIiwicmluZ0NvbG9yIiwibGVmdCIsInRvcCIsInRyYW5zZm9ybSIsImJveFNoYWRvdyIsInNpemUiLCJfcmVmMyIsIl9yZWYzJHNpemUiLCJzdHJva2VMaW5lY2FwIiwic3Ryb2tlTGluZWpvaW4iLCJfZXh0ZW5kcyIsIl9yZWY0IiwidXBkYXRlIiwiYyIsInVzZUVmZmVjdCIsInJhdyIsInByZXNldCIsInBhdGNoIiwicCIsImxvIiwiaGkiLCJSSF9QUkVTRVRTIiwiZmluZCIsInRoIiwiZGwiLCJwYXJzZUZsb2F0IiwidHJSYXciLCJ0ciIsIm1pbiIsIm1heCIsImtleXMiLCJwZXJzaXN0QW5kU2F2ZSIsInN0cmluZ2lmeSIsIlN0cmluZyIsImRpc3BhdGNoRXZlbnQiLCJDdXN0b21FdmVudCIsImRldGFpbCIsImFwcGx5VG9BbGxBaHVzIiwiY29uc29sZSIsImluZm8iLCJ3YXJuIiwiUHN5U2tlbGV0b24iLCJQc3lDb250cm9sUGFuZWwiLCJsYWJlbCIsIm5vdGUiLCJfcmVmNSIsIlciLCJIIiwicGFkIiwicmlnaHQiLCJib3R0b20iLCJncmlkVyIsImdyaWRIIiwiVF9NSU4iLCJUX01BWCIsIldfTUlOIiwiV19NQVgiLCJ3IiwiX2dldFciLCJnZXRXIiwicmgiLCJzYWZlUHRzIiwiYXJyIiwidG9GaXhlZCIsImpvaW4iLCJyaDgwIiwicHVzaCIsInJoMTAwIiwicmgyMExpbmUiLCJyaDIwX0NaIiwiQ1oiLCJyaEhpX3RvcCIsInR0IiwicmhMb19ib3QiLCJTV0VFVCIsIk5WIiwiTWFzcyIsIk1DViIsIkVWQVAiLCJ3aW50ZXJSSDgwIiwid2ludGVyUkgyMCIsIldJTlRFUiIsImlzb3BsZXRocyIsImlzTGlnaHQiLCJwYWxldHRlIiwiYmciLCJncmlkIiwidGljayIsImF4aXMiLCJwYW5lbEJnIiwicGFuZWxCb3JkZXIiLCJwaWxsQmciLCJwaWxsRmciLCJtZXRhRmciLCJkaW1GaWx0ZXIiLCJib3JkZXJDb2xvciIsImJvcmRlclJhZGl1cyIsIkFycmF5IiwiZnJvbSIsIngxIiwieTEiLCJ4MiIsInkyIiwiZm9udFNpemUiLCJ0ZXh0QW5jaG9yIiwicHRzIiwid3ciLCJwb2ludHMiLCJzdHJva2VEYXNoYXJyYXkiLCJmbG9vciIsImZvbnRXZWlnaHQiLCJmaWxsT3BhY2l0eSIsImNsaXBQYXRoVW5pdHMiLCJjbGlwUGF0aCIsImxldHRlclNwYWNpbmciLCJwYWludE9yZGVyIiwiX3JlZjYiLCJ0eXBlIiwidmFsdWUiLCJvbkNoYW5nZSIsInRhcmdldCIsImFjY2VudENvbG9yIiwiX25vcm1hbGl6ZUxvY3MiLCJzZWVuIiwiU2V0Iiwib3V0IiwibCIsInRyaW0iLCJoYXMiLCJhZGQiLCJlbGV2Iiwicm93IiwibG9va3VwRWxldmF0aW9uTSIsIl94IiwiX3gyIiwiX2xvb2t1cEVsZXZhdGlvbk0iLCJhcHBseSIsImFyZ3VtZW50cyIsIl9hc3luY1RvR2VuZXJhdG9yIiwibG5nIiwidXJsIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiZmV0Y2giLCJoZWFkZXJzIiwiQWNjZXB0Iiwib2siLCJqIiwianNvbiIsImlzQXJyYXkiLCJlbGV2YXRpb24iLCJsb2NFbGV2YXRpb25NIiwiX3JlZjciLCJtYXBCb3hSZWYiLCJ1c2VSZWYiLCJtYXBSZWYiLCJtYXJrZXJSZWYiLCJfUmVhY3QkdXNlU3RhdGUiLCJfUmVhY3QkdXNlU3RhdGUyIiwiZ2VvQnVzeSIsInNldEdlb0J1c3kiLCJfUmVhY3QkdXNlU3RhdGUzIiwiX1JlYWN0JHVzZVN0YXRlNCIsInNhdmVkTG9jcyIsInNldFNhdmVkTG9jcyIsImNhbmNlbGxlZCIsImNyZWRlbnRpYWxzIiwiY2FjaGUiLCJzYXZlZCIsImJ1aWxkaW5nX2ZhY2luZyIsImFjdGl2ZSIsImRlZmF1bHQiLCJhYnMiLCJ1bmRlZmluZWQiLCJtaXNzaW5nIiwic2V0VGltZW91dCIsInN0aWxsTWlzc2luZyIsImNsZWFyVGltZW91dCIsIl9SZWFjdCR1c2VTdGF0ZTUiLCJfUmVhY3QkdXNlU3RhdGU2Iiwic2F2ZWRPcGVuIiwic2V0U2F2ZWRPcGVuIiwic2F2ZWRSZWYiLCJvbkRvY0NsaWNrIiwiY3VycmVudCIsImNvbnRhaW5zIiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm9uU2l0ZU5hbWVDaGFuZ2UiLCJuZXdOYW1lIiwiaGl0Iiwic2V0VmlldyIsInBpY2tTYXZlZExvYyIsInJlbW92ZVNhdmVkTG9jIiwibmV4dCIsIm1ldGhvZCIsImJvZHkiLCJjYXRjaCIsInJlbmFtZVNhdmVkTG9jIiwib3JpZ0xvYyIsInByZXYiLCJzdGlsbFNlbGVjdGVkIiwiX1JlYWN0JHVzZVN0YXRlNyIsIl9SZWFjdCR1c2VTdGF0ZTgiLCJzZWFyY2hRIiwic2V0U2VhcmNoUSIsIl9SZWFjdCR1c2VTdGF0ZTkiLCJfUmVhY3QkdXNlU3RhdGUwIiwic2VhcmNoSGl0cyIsInNldFNlYXJjaEhpdHMiLCJfUmVhY3QkdXNlU3RhdGUxIiwiX1JlYWN0JHVzZVN0YXRlMTAiLCJzZWFyY2hCdXN5Iiwic2V0U2VhcmNoQnVzeSIsIl9SZWFjdCR1c2VTdGF0ZTExIiwiX1JlYWN0JHVzZVN0YXRlMTIiLCJzZWFyY2hPcGVuIiwic2V0U2VhcmNoT3BlbiIsInNlYXJjaERlYm91bmNlUmVmIiwicnVuU2VhcmNoIiwiX3JlZjAiLCJxIiwiX3gzIiwicGlja1NlYXJjaEhpdCIsImRpc3BsYXlfbmFtZSIsInJldmVyc2VHZW9jb2RlIiwiX3JlZjEiLCJhZGRyZXNzIiwidG93biIsInZpbGxhZ2UiLCJoYW1sZXQiLCJjb3VudHkiLCJyZWdpb24iLCJzdGF0ZSIsImNvdW50cnkiLCJfeDQiLCJfeDUiLCJMIiwiem9vbUNvbnRyb2wiLCJhdHRyaWJ1dGlvbkNvbnRyb2wiLCJ0aWxlTGF5ZXIiLCJtYXhab29tIiwiYXR0cmlidXRpb24iLCJhZGRUbyIsIm1hcmtlciIsImRyYWdnYWJsZSIsImJpbmRUb29sdGlwIiwicGVybWFuZW50IiwiYXBwbHlMYXRMb24iLCJuIiwib24iLCJsbCIsImdldExhdExuZyIsInNldExhdExuZyIsImxhdGxuZyIsImludmFsaWRhdGVTaXplIiwicmVtb3ZlIiwicGFuVG8iLCJfUmVhY3QkdXNlU3RhdGUxMyIsIl9SZWFjdCR1c2VTdGF0ZTE0IiwiZ2VvU3RhdGUiLCJzZXRHZW9TdGF0ZSIsInVzZU15TG9jYXRpb24iLCJuYXZpZ2F0b3IiLCJnZW9sb2NhdGlvbiIsImVyciIsImdldEN1cnJlbnRQb3NpdGlvbiIsInBvcyIsImNvb3JkcyIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwibXNnIiwiY29kZSIsIm1lc3NhZ2UiLCJlbmFibGVIaWdoQWNjdXJhY3kiLCJ0aW1lb3V0IiwibWF4aW11bUFnZSIsIl9SZWFjdCR1c2VTdGF0ZTE1IiwiX1JlYWN0JHVzZVN0YXRlMTYiLCJzYXZlTXNnIiwic2V0U2F2ZU1zZyIsIl9yZWYxMCIsImRlZHVwZWQiLCJuZXh0U2F2ZWQiLCJzbGljZSIsInBlcnNpc3RlZCIsIndhcm5pbmciLCJfbGFzdFdlYXRoZXJMb2NhdGlvblNhdmUiLCJNb2RhbFNoZWxsIiwidGl0bGUiLCJzdWJ0aXRsZSIsIm1pbkhlaWdodCIsInJlZiIsIm92ZXJmbG93Iiwib25Gb2N1cyIsInBsYWNlaG9sZGVyIiwib3V0bGluZSIsImgiLCJwbGFjZV9pZCIsImNsYXNzIiwidHJhbnNpdGlvbiIsImlzQWN0aXZlIiwicm93S2V5Iiwicm9sZSIsInRhYkluZGV4Iiwib25LZXlEb3duIiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJ0eXBlZCIsImN1ciIsImNvbmZsaWN0IiwiZGlzYWJsZWQiLCJwcm90b2NvbCIsInoiLCJfcmVmMTIiLCJsYW5ncyIsIm5hdGl2ZSIsIkV2ZW50IiwiUExVR0lOX0NPTkZJR19GSUVMRFMiLCJ3ZWF0aGVyIiwib3B0aW9ucyIsImRlZiIsInN3ZWV0X3Nwb3QiLCJnMzYiLCJkaWJ0IiwibGlnaHRpbmciLCJfcmVmMTMiLCJBTEwiLCJkZXNjIiwidmVyIiwidG9nZ2xlIiwiaW5jbHVkZXMiLCJfUmVhY3QkdXNlU3RhdGUxNyIsIl9SZWFjdCR1c2VTdGF0ZTE4IiwiZXhwYW5kZWRJZCIsInNldEV4cGFuZGVkSWQiLCJ1cGRhdGVGaWVsZCIsInBsdWdpbklkIiwiZmllbGRLZXkiLCJmaWVsZHMiLCJmaWVsZFZhbCIsImZpZWxkIiwic3RvcmVkIiwiZXhwYW5kZWQiLCJmIiwibyIsIl9yZWYxNCIsIl9yZWYxNCRhY2NlbnQiLCJfcmVmMTQkc2l6ZSIsImNoaWxkcmVuIiwiY29sb3JNYXAiLCJpbmRpZ28iLCJhbWJlciIsImVtZXJhbGQiLCJwaW5rIiwic2l6ZU1hcCIsIndpZGUiLCJtYXhIZWlnaHQiLCJSZWFjdERPTSIsImNyZWF0ZVJvb3QiLCJnZXRFbGVtZW50QnlJZCIsInJlbmRlciJdLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXR1cC13YWxrL3NldHVwX3dhbGsuanN4Il0sInNvdXJjZXNDb250ZW50IjpbIi8qIFdyYXBwZWQgaW4gYW4gSUlGRSBzbyB0b3AtbGV2ZWwgZGVjbGFyYXRpb25zIHN0YXkgZnVuY3Rpb24tc2NvcGVkIGFuZCBkb1xuICAgTk9UIGxlYWsgb250byBgd2luZG93YC4gIFRoaXMgYnVuZGxlIGlzIGxvYWRlZCBhcyBhIENMQVNTSUMgPHNjcmlwdD4sIHdoZXJlXG4gICBhIHRvcC1sZXZlbCBgdmFyIGZvb2AgKHdoYXQgQmFiZWwgY29tcGlsZXMgYGNvbnN0IGZvb2AgZG93biB0bykgd291bGQgYmVjb21lXG4gICBgd2luZG93LmZvb2AuICBXaXRob3V0IHRoaXMgd3JhcHBlciwgdGhlIGxvY2FsIGB0YC9gdXNlTGFuZ2AgaGVscGVycyBiZWxvd1xuICAgb3ZlcndyaXRlIHRoZSByZWFsIGB3aW5kb3cudGAvYHdpbmRvdy51c2VMYW5nYCBmcm9tIGpzL2kxOG4uanMgYW5kIHRoZW4gY2FsbFxuICAgdGhlbXNlbHZlcyDihpIgXCJNYXhpbXVtIGNhbGwgc3RhY2sgc2l6ZSBleGNlZWRlZFwiIChibGFuayBzY3JlZW4pLiAqL1xuKGZ1bmN0aW9uICgpIHtcbmNvbnN0IHsgdXNlU3RhdGUsIHVzZU1lbW8gfSA9IFJlYWN0O1xuXG4vKiBpMThuIGhlbHBlcnMg4oCUIHJlc29sdmUgYWdhaW5zdCB0aGUgc2hhcmVkIGRpY3Rpb25hcnkgaW4ganMvaTE4bi5qc1xuICAgKGxvYWRlZCBieSBzZXR1cC5odG1sIGJlZm9yZSB0aGlzIGJ1bmRsZSkuICB0KCkgZmFsbHMgYmFjayB0byB0aGUga2V5XG4gICBpZiBpMThuLmpzIGlzIHNvbWVob3cgYWJzZW50OyB1c2VMYW5nKCkgc3Vic2NyaWJlcyBhIGNvbXBvbmVudCB0byB0aGVcbiAgIGBsYW5nY2hhbmdlYCBldmVudCBzbyB0aGUgd2hvbGUgd2l6YXJkIHJlLXJlbmRlcnMgKGFuZCByZS10cmFuc2xhdGVzKVxuICAgdGhlIGluc3RhbnQgdGhlIGxhbmd1YWdlIGlzIHN3aXRjaGVkLiAqL1xuY29uc3QgdCA9IChrKSA9PiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LnQgPyB3aW5kb3cudChrKSA6IGspO1xuY29uc3QgdXNlTGFuZyA9ICgpID0+ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cudXNlTGFuZyA/IHdpbmRvdy51c2VMYW5nKCkgOiBudWxsKTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogU1RFUCBERUZJTklUSU9OUyDigJQgdGhlIDQgd2FsayBwYXRocyB0aGUgdXNlciBkZXNjcmliZWRcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmNvbnN0IFNURVBTID0gW1xuICAgIC8qIFdhbGsgb3JkZXIgaXMgdGhlIHBlbnRhZ29uIHRyYXZlcnNhbDogdG9wIOKGkiB1cHBlci1yaWdodCDihpIgbG93ZXItcmlnaHQg4oaSIGxvd2VyLWxlZnQg4oaSIHVwcGVyLWxlZnQuXG4gICAgICAgTGFiZWxzIGludGVudGlvbmFsbHkgZHJvcCB0aGUgcmVkdW5kYW50IFwiU2V0dGluZ1wiIHN1ZmZpeCBzbyB0aGVcbiAgICAgICBtYWluIGhlYWRpbmcgaW5zaWRlIGVhY2ggY2lyY2xlIGNhbiByZW5kZXIgaW4gb25lIGxpbmUgYXQgYSBsYXJnZXJcbiAgICAgICBmb250IHdlaWdodC4gIGxhYmVsS2V5L3N1YktleSByZXNvbHZlIHZpYSB0KCkgYXQgcmVuZGVyIHRpbWUgc28gdGhleVxuICAgICAgIHRyYWNrIHRoZSBhY3RpdmUgbGFuZ3VhZ2UuICovXG4gICAgeyBrZXk6J3BzeScsICAgICAgbGFiZWxLZXk6J3N3X3N0ZXBfcHN5JywgICAgICBzdWJLZXk6J3N3X3N0ZXBfcHN5X3N1YicsICAgICAga2luZDoncGFnZScsICBpY29uQ29sb3I6JyM4MThjZjgnLCBhY2NlbnQ6J2luZGlnbycgfSxcbiAgICB7IGtleTonbG9jYXRpb24nLCBsYWJlbEtleTonc3dfc3RlcF9sb2NhdGlvbicsIHN1YktleTonc3dfc3RlcF9sb2NhdGlvbl9zdWInLCBraW5kOidtb2RhbCcsIGljb25Db2xvcjonI2ZiYmYyNCcsIGFjY2VudDonYW1iZXInICB9LFxuICAgIHsga2V5OidsYW5ndWFnZScsIGxhYmVsS2V5Oidzd19zdGVwX2xhbmd1YWdlJywgc3ViS2V5Oidzd19zdGVwX2xhbmd1YWdlX3N1YicsIGtpbmQ6J21vZGFsJywgaWNvbkNvbG9yOicjMzRkMzk5JywgYWNjZW50OidlbWVyYWxkJ30sXG4gICAgeyBrZXk6J3BsdWdpbnMnLCAgbGFiZWxLZXk6J3N3X3N0ZXBfcGx1Z2luJywgICBzdWJLZXk6J3N3X3N0ZXBfcGx1Z2luX3N1YicsICAga2luZDonbW9kYWwnLCBpY29uQ29sb3I6JyNmNDcyYjYnLCBhY2NlbnQ6J3BpbmsnICAgfSxcbiAgICB7IGtleToncmVwYWlyJywgICBsYWJlbEtleTonc3dfc3RlcF9yZXBhaXInLCAgIHN1YktleTonc3dfc3RlcF9yZXBhaXJfc3ViJywgICBraW5kOidsaW5rJywgIGljb25Db2xvcjonI2ZiNzE4NScsIGFjY2VudDoncm9zZScsIGhyZWY6Jy91cGRhdGUuaHRtbD9mcm9tPXNldHVwJyB9LFxuXTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogUk9PVCBBUFBcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIEFwcCgpIHtcbiAgICB1c2VMYW5nKCk7ICAgLy8gcmUtcmVuZGVyIHdob2xlIHdpemFyZCAoYW5kIGFsbCBkZXNjZW5kYW50cykgb24gbGFuZ3VhZ2UgY2hhbmdlXG4gICAgLyogY29tcGxldGlvbiArIHBlci1zdGVwIGNvbmZpZyAtLSBtb2NrdXAgc3RhdGUsIG5ldmVyIHBlcnNpc3RlZCAqL1xuICAgIGNvbnN0IFtkb25lLCBzZXREb25lXSA9IHVzZVN0YXRlKHsgcHN5OmZhbHNlLCBsb2NhdGlvbjpmYWxzZSwgbGFuZ3VhZ2U6ZmFsc2UsIHBsdWdpbnM6ZmFsc2UsIHJlcGFpcjpmYWxzZSB9KTtcbiAgICBjb25zdCBbcm91dGUsIHNldFJvdXRlXSA9IHVzZVN0YXRlKCdodWInKTsgICAvLyAnaHViJyB8ICdwc3knXG4gICAgY29uc3QgW21vZGFsLCBzZXRNb2RhbF0gPSB1c2VTdGF0ZShudWxsKTsgICAgIC8vICdsb2NhdGlvbicgfCAnbGFuZ3VhZ2UnIHwgJ3BsdWdpbnMnIHwgbnVsbFxuXG4gICAgY29uc3QgW3BzeUNmZywgc2V0UHN5Q2ZnXSAgICAgICAgID0gdXNlU3RhdGUoeyBnaXZvbmk6dHJ1ZSwgcmhQcmVzZXQ6J29mZmljZScsIHJoTG86MzAsIHJoSGk6NjAsIHRMbzotMTUsIHRIaTo1MCwgdGhlbWU6J2RhcmsnLCBkYXJrTGV2ZWw6Mi4wIH0pO1xuICAgIGNvbnN0IFtsb2NDZmcsIHNldExvY0NmZ10gICAgICAgICA9IHVzZVN0YXRlKCgpID0+IHtcbiAgICAgICAgbGV0IGZhY2luZyA9ICdhdXRvJztcbiAgICAgICAgbGV0IGxvYyA9IHsgc2l0ZU5hbWU6J015IEJ1aWxkaW5nJywgY2l0eTonVG9yb250bywgT04nLCBsYXQ6NDMuNjUzMiwgbG9uOi03OS4zODMyLCBidWlsZGluZ0ZhY2luZzogZmFjaW5nLCBlbGV2YXRpb25fbTogJycgfTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHYgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVkNS5idWlsZGluZ19mYWNpbmcnKTtcbiAgICAgICAgICAgIGlmICh2ICYmIFsnYXV0bycsJ04nLCdORScsJ0UnLCdTRScsJ1MnLCdTVycsJ1cnLCdOVyddLmluZGV4T2YodikgPj0gMCkgbG9jLmJ1aWxkaW5nRmFjaW5nID0gdjtcbiAgICAgICAgICAgIGNvbnN0IHdsID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2VhdGhlckxvY2F0aW9uJykpO1xuICAgICAgICAgICAgaWYgKHdsICYmIHR5cGVvZiB3bC5sYXQgPT09ICdudW1iZXInICYmIHR5cGVvZiB3bC5sb24gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgbG9jLmxhdCA9IHdsLmxhdDtcbiAgICAgICAgICAgICAgICBsb2MubG9uID0gd2wubG9uO1xuICAgICAgICAgICAgICAgIGxvYy5zaXRlTmFtZSA9IHdsLm5hbWUgfHwgbG9jLnNpdGVOYW1lO1xuICAgICAgICAgICAgICAgIGxvYy5jaXR5ID0gd2wubmFtZSB8fCBsb2MuY2l0eTtcbiAgICAgICAgICAgICAgICBjb25zdCBlID0gd2wuZWxldmF0aW9uX20gIT0gbnVsbCA/IHdsLmVsZXZhdGlvbl9tIDogd2wuYXNsO1xuICAgICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUoTnVtYmVyKGUpKSkgbG9jLmVsZXZhdGlvbl9tID0gTWF0aC5yb3VuZChOdW1iZXIoZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgICByZXR1cm4gbG9jO1xuICAgIH0pO1xuICAgIGNvbnN0IFtsYW5nQ2ZnLCBzZXRMYW5nQ2ZnXSAgICAgICA9IHVzZVN0YXRlKCgpID0+IHtcbiAgICAgICAgLyogTGF6eSBpbml0IGZyb20gdGhlIHNhbWUgbG9jYWxTdG9yYWdlIGtleSB0aGUgZGFzaGJvYXJkIHJlYWRzLCBzb1xuICAgICAgICAgKiByZW9wZW5pbmcgdGhlIHNldHVwIHdhbGsgc2hvd3MgdGhlIGN1cnJlbnRseS1hY3RpdmUgbGFuZ3VhZ2VcbiAgICAgICAgICogcmF0aGVyIHRoYW4gYWx3YXlzIGRlZmF1bHRpbmcgdG8gRW5nbGlzaC4gKi9cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHYgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnaTE4bl9sYW5nJyk7XG4gICAgICAgICAgICBjb25zdCBhbGxvd2VkID0gWydlbicsJ3poLUNOJywnemgtVFcnLCdqYScsJ2tvJ107XG4gICAgICAgICAgICBpZiAodiAmJiBhbGxvd2VkLmluZGV4T2YodikgIT09IC0xKSByZXR1cm4geyBsYW5nOiB2IH07XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogcHJpdmF0ZSBtb2RlIC0+IGZhbGwgdGhyb3VnaCAqLyB9XG4gICAgICAgIHJldHVybiB7IGxhbmc6J2VuJyB9O1xuICAgIH0pO1xuICAgIGNvbnN0IFtwbHVnaW5DZmcsIHNldFBsdWdpbkNmZ10gICA9IHVzZVN0YXRlKHsgZW5hYmxlZDpbJ3dlYXRoZXInLCdnaXZvbmknLCdzd2VldF9zcG90J10gfSk7XG5cbiAgICBjb25zdCBjb21wbGV0ZUNvdW50ID0gT2JqZWN0LnZhbHVlcyhkb25lKS5maWx0ZXIoQm9vbGVhbikubGVuZ3RoO1xuXG4gICAgY29uc3QgZmluaXNoID0gKGtleSkgPT4ge1xuICAgICAgICBzZXREb25lKGQgPT4gKHsuLi5kLCBba2V5XTp0cnVlfSkpO1xuICAgICAgICBzZXRSb3V0ZSgnaHViJyk7XG4gICAgICAgIHNldE1vZGFsKG51bGwpO1xuICAgIH07XG5cbiAgICAvKiBmdWxsLXBhZ2UgUHN5IENoYXJ0IGVkaXRvciAqL1xuICAgIGlmIChyb3V0ZSA9PT0gJ3BzeScpIHtcbiAgICAgICAgcmV0dXJuIDxQc3lDaGFydFNldHRpbmdQYWdlIGNmZz17cHN5Q2ZnfSBzZXRDZmc9e3NldFBzeUNmZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQmFjaz17KCkgPT4gc2V0Um91dGUoJ2h1YicpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXsoKSA9PiBmaW5pc2goJ3BzeScpfSAvPjtcbiAgICB9XG5cbiAgICAvKiBkZWZhdWx0OiBIVUIgc2NyZWVuICovXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtaW4taC1zY3JlZW4gcHgtNiBweS04XCI+XG4gICAgICAgICAgICB7LyogLS0tLS0tLS0tLS0tLSBoZWFkZXIgLS0tLS0tLS0tLS0tLSAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctNXhsIG14LWF1dG8gZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIG1iLTEwIGZhZGUtdXBcIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwidGV4dC0yeGwgc206dGV4dC0zeGwgZm9udC1ibGFjayBpdGFsaWMgdXBwZXJjYXNlIHRyYWNraW5nLXRpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXJlZC01MDBcIj5SZWQ1PC9zcGFuPiA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlXCI+U3R1ZGlvPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgZm9udC1ub3JtYWwgaXRhbGljXCI+ICZuYnNwOy8mbmJzcDsgc2V0dXAgd2Fsazwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9oMT5cbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbGF0ZS01MDAgdGV4dC14cyBtdC0xIGZvbnQtbW9ubyB0cmFja2luZy13aWRlXCI+e3QoJ3N3X3N1YnRpdGxlJyl9PC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIi9kYXNoYm9hcmQuaHRtbFwiXG4gICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHsgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDUuc2V0dXAuZG9uZScsJzEnKTsgfSBjYXRjaChlKXt9IH19XG4gICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS01MDAgaG92ZXI6dGV4dC1zbGF0ZS0zMDAgdW5kZXJsaW5lIHVuZGVybGluZS1vZmZzZXQtNFwiPnt0KCdzd19za2lwX2FsbCcpfTwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogLS0tLS0tLS0tLS0tLSBwZW50YWdvbiBsYXlvdXQgLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgIDUgY2lyY3VsYXIgdGlsZXMgYXJyYW5nZWQgYXQgdGhlIGNvcm5lcnMgb2YgYSByZWd1bGFyXG4gICAgICAgICAgICAgICAgcGVudGFnb24uICBQb2xhciBtYXRoczogYW5nbGUgc3RhcnRzIGF0IC05MGRlZyAodG9wKSBhbmRcbiAgICAgICAgICAgICAgICBzdGVwcyBieSArNzJkZWcgY2xvY2t3aXNlLiAgVGhlIGNvbnRhaW5lciBpcyBoZWlnaHQtbG9ja2VkXG4gICAgICAgICAgICAgICAgdmlhIGFzcGVjdCByYXRpbyBzbyB0aGUgcGVudGFnb24gc3RheXMgY2lyY3VsYXIgb24gZXZlcnlcbiAgICAgICAgICAgICAgICB2aWV3cG9ydC4gIFJhZGl1cyBpcyA0MCAlIG9mIHRoZSBjb250YWluZXIgaGFsZi1zaWRlLCBjaXJjbGVcbiAgICAgICAgICAgICAgICBkaWFtZXRlciB+MjcgJSBvZiB0aGUgY29udGFpbmVyIHdpZHRoIC0tIGdpdmVzIGEgY2xlYXJseVxuICAgICAgICAgICAgICAgIHZpc2libGUgZ2FwICh+MjggJSBvZiBjb250YWluZXIgd2lkdGgpIGJldHdlZW4gYWRqYWNlbnRcbiAgICAgICAgICAgICAgICBjaXJjbGVzIHJlZ2FyZGxlc3Mgb2Ygc2NyZWVuIHNpemUuICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBteC1hdXRvIGZhZGUtdXBcIlxuICAgICAgICAgICAgICAgICBzdHlsZT17eyB3aWR0aDonbWluKDc2MHB4LCA5MnZ3KScsIGFzcGVjdFJhdGlvOicxIC8gMScsIGFuaW1hdGlvbkRlbGF5OicuMDhzJyB9fT5cblxuICAgICAgICAgICAgICAgIHsvKiBCYWNrZ3JvdW5kIHBzeS1jaGFydCBsYXllciAtLSBzaXplZCB0byBmaWxsIHRoZSBjb25zdGVsbGF0aW9uXG4gICAgICAgICAgICAgICAgICAgIGNpcmNsZSAofjc4ICUgb2YgY29udGFpbmVyID0ganVzdCBpbnNpZGUgdGhlIGNvbnN0ZWxsYXRpb25cbiAgICAgICAgICAgICAgICAgICAgYXJjIHRoYXQgam9pbnMgdGhlIDUgdGlsZSBjZW50cmVzKS4gIFJlbmRlcmVkIEZJUlNUIHNvIHRoZVxuICAgICAgICAgICAgICAgICAgICA1IHRpbGUgY2lyY2xlcyAobmV4dCBpbiBET00pIHNpdCBvbiB0b3AgYW5kIG9ic2N1cmUgdGhlXG4gICAgICAgICAgICAgICAgICAgIHBvcnRpb24gb2YgdGhlIGNoYXJ0IHRoYXQgb3ZlcmxhcHMgdGhlbS4gIFRoYXQgZ2l2ZXMgdGhlXG4gICAgICAgICAgICAgICAgICAgIFwiaW1hZ2UgcmVjZWRlcyBiZWhpbmQgdGhlIDUgY2lyY2xlc1wiIGVmZmVjdC4gKi99XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBsZWZ0LTEvMiB0b3AtMS8yIC10cmFuc2xhdGUteC0xLzIgLXRyYW5zbGF0ZS15LTEvMiBwb2ludGVyLWV2ZW50cy1ub25lIG92ZXJmbG93LWhpZGRlbiByb3VuZGVkLWZ1bGxcIlxuICAgICAgICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7d2lkdGg6Jzc4JScsIGFzcGVjdFJhdGlvOicxLzEnfX0+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiL2FwaS9hc3NldHMvaW1nL3BzeV9zaWxob3VldHRlLmpwZ1wiIGFsdD1cIlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMCB3LWZ1bGwgaC1mdWxsIG9iamVjdC1jb3ZlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tvcGFjaXR5OjAuNzh9fSAvPlxuICAgICAgICAgICAgICAgICAgICB7LyogRGFyayB2aWduZXR0ZSAvIGxlbnMgLS0gcHVsbHMgdGhlIGNlbnRyZSBkb3duIHNvIHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgTi81IERPTkUgY291bnRlciB0aGF0IGxpdmVzIE9OIFRPUCBzdGF5cyByZWFkYWJsZS4gKi99XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOidyYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IGNlbnRlciwgcmdiYSgyLDYsMjMsMC42MCkgMCUsIHJnYmEoMiw2LDIzLDAuMzUpIDU1JSwgcmdiYSgyLDYsMjMsMC4xMCkgMTAwJSknfX0vPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAge1NURVBTLm1hcCgocywgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmdsZURlZyA9IC05MCArIGkgKiA3MjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5nbGUgPSBhbmdsZURlZyAqIE1hdGguUEkgLyAxODA7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHIgPSA0MDsgICAgICAgICAgICAgICAgICAgICAgICAvLyAlIG9mIGNvbnRhaW5lciBoYWxmLXNpZGVcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeCA9IDUwICsgciAqIE1hdGguY29zKGFuZ2xlKTsgIC8vICVcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeSA9IDUwICsgciAqIE1hdGguc2luKGFuZ2xlKTsgIC8vICVcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDaXJjbGVUaWxlIGtleT17cy5rZXl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGVwPXtzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZT17ZG9uZVtzLmtleV19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleD17aSsxfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdFBjdD17eH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcFBjdD17eX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocy5raW5kID09PSAncGFnZScpICAgICAgc2V0Um91dGUocy5rZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHMua2luZCA9PT0gJ2xpbmsnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNhbWUtdGFiIG5hdiBzbyB0aGUgcmV0dXJuIGJhZGdlIG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZS5odG1sIGNhbiBzaW1wbHkgd2luZG93LmxvY2F0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2sgaGVyZSB3aGVuIHRoZSBvcGVyYXRvciBpcyBkb25lLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHMuaHJlZjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgICAgICAgICAgICAgICAgICAgICAgc2V0TW9kYWwocy5rZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICB7LyogRGVjb3JhdGl2ZSByaW5nOiBhIHNpbmdsZSBjaXJjbGUgd2hvc2UgY2VudHJlIGNvaW5jaWRlc1xuICAgICAgICAgICAgICAgICAgICB3aXRoIHRoZSBjZW50cmUgb2YgdGhlIHBlbnRhZ29uIGFuZCB3aG9zZSByYWRpdXMgZXF1YWxzXG4gICAgICAgICAgICAgICAgICAgIHRoZSBwZW50YWdvbiB2ZXJ0ZXggcmFkaXVzIC0tIGl0cyBib3VuZGFyeSBwYXNzZXNcbiAgICAgICAgICAgICAgICAgICAgY2xlYW5seSB0aHJvdWdoIHRoZSBjZW50cmUgb2YgZWFjaCB0aWxlLiAgVGhlIG1hc2tcbiAgICAgICAgICAgICAgICAgICAgY3V0cyBvdXQgdGhlIGRpc2sgb2YgZXZlcnkgdGlsZSBjaXJjbGUgc28gdGhlIHJpbmcgaXNcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJsZSBPTkxZIGluIHRoZSBnYXBzIGJldHdlZW4gdGlsZXMsIG5ldmVyIGNyb3NzaW5nXG4gICAgICAgICAgICAgICAgICAgIGEgdGlsZSBpbnRlcmlvci4gKi99XG4gICAgICAgICAgICAgICAgPHN2ZyBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC0wIHctZnVsbCBoLWZ1bGwgcG9pbnRlci1ldmVudHMtbm9uZVwiXG4gICAgICAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDEwMCAxMDBcIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPVwibm9uZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGVmcz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxtYXNrIGlkPVwicGVudGFnb24tcmluZy1tYXNrXCIgbWFza1VuaXRzPVwidXNlclNwYWNlT25Vc2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeD1cIjBcIiB5PVwiMFwiIHdpZHRoPVwiMTAwXCIgaGVpZ2h0PVwiMTAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3QgeD1cIjBcIiB5PVwiMFwiIHdpZHRoPVwiMTAwXCIgaGVpZ2h0PVwiMTAwXCIgZmlsbD1cIndoaXRlXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7U1RFUFMubWFwKChfLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGEgPSAoLTkwICsgaSAqIDcyKSAqIE1hdGguUEkgLyAxODA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGN4ID0gNTAgKyA0MCAqIE1hdGguY29zKGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjeSA9IDUwICsgNDAgKiBNYXRoLnNpbihhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogMTcuNSAlIHJhZGl1cyA9IHNhbWUgYXMgdGhlIHRpbGUgY2lyY2xlJ3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFsZi13aWR0aCAoMzUgJSBkaWFtZXRlcik7ICswLjUgJSBudWRnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZWVwcyB0aGUgbWFzayBlZGdlIGluc2lkZSB0aGUgY29sb3VyZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmluZyBzbyB0aGUgd2hpdGUgYXJjIGRvZXNuJ3QgQUxNT1NULXRvdWNoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSByaW5nIGJvcmRlciB3aXRoIGFudGktYWxpYXNlZCBmcmluZ2UuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiA8Y2lyY2xlIGtleT17aX0gY3g9e2N4fSBjeT17Y3l9IHI9XCIxOFwiIGZpbGw9XCJibGFja1wiIC8+O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9tYXNrPlxuICAgICAgICAgICAgICAgICAgICA8L2RlZnM+XG4gICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgY3g9XCI1MFwiIGN5PVwiNTBcIiByPVwiNDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCJyZ2JhKDI1NSwyNTUsMjU1LDAuODUpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2VXaWR0aD1cIjAuNTZcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hc2s9XCJ1cmwoI3BlbnRhZ29uLXJpbmctbWFzaylcIiAvPlxuICAgICAgICAgICAgICAgIDwvc3ZnPlxuXG4gICAgICAgICAgICAgICAgey8qIENlbnRyZWQgY29tcGxldGlvbiBjb3VudGVyIC0tIHNpdHMgYXQgdGhlIGNlbnRyb2lkIG9mIHRoZVxuICAgICAgICAgICAgICAgICAgICBwZW50YWdvbiwgZm9udCB3ZWlnaHQgbWF0Y2hlZCB0byB0aGUgcGVyLXRpbGUgaGVhZGluZyBzbyB0aGVcbiAgICAgICAgICAgICAgICAgICAgZXllIHJlYWRzIGl0IGFzIHRoZSBkb21pbmFudCBzdGF0dXMuICBSZW5kZXJlZCBMQVNUIHNvIGl0XG4gICAgICAgICAgICAgICAgICAgIHNpdHMgb24gdG9wIG9mIGJvdGggdGhlIHBzeS1jaGFydCBzaWxob3VldHRlIGFuZCB0aGUgdGlsZVxuICAgICAgICAgICAgICAgICAgICBjaXJjbGVzLiAqL31cbiAgICAgICAgICAgICAgICB7LyogTi81IERPTkUgdGV4dCAtLSBvd24gYWJzb2x1dGUgbGF5ZXIgcmVuZGVyZWQgQUZURVIgdGhlXG4gICAgICAgICAgICAgICAgICAgIHRpbGUgY2lyY2xlcyBzbyBpdCBhbHdheXMgc2l0cyBvbiB0b3AuICovfVxuICAgICAgICAgICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJzZXR1cC1wcm9ncmVzcy1jZW50ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgbGVmdC0xLzIgdG9wLTEvMiAtdHJhbnNsYXRlLXgtMS8yIC10cmFuc2xhdGUteS0xLzIgdGV4dC1jZW50ZXIgcG9pbnRlci1ldmVudHMtbm9uZSBzZWxlY3Qtbm9uZVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YHRleHQtWzY2cHhdIHNtOnRleHQtWzc4cHhdIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXRpZ2h0IHdoaXRlc3BhY2Utbm93cmFwIGxlYWRpbmctbm9uZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Y29tcGxldGVDb3VudCA9PT0gNSA/ICd0ZXh0LWVtZXJhbGQtNDAwJyA6ICd0ZXh0LXdoaXRlJ31gfVxuICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7dGV4dFNoYWRvdzonMCA0cHggMjRweCByZ2JhKDIsNiwyMywwLjk1KSwgMCAwIDhweCByZ2JhKDIsNiwyMywwLjk1KSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZUNvdW50fS81XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzMwcHhdIHNtOnRleHQtWzMzcHhdIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLVswLjNlbV0gdGV4dC1zbGF0ZS0zMDAgbXQtM1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3t0ZXh0U2hhZG93OicwIDJweCAxMnB4IHJnYmEoMiw2LDIzLDAuOSknfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dCgnc3dfZG9uZScpfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogLS0tLS0tLS0tLS0tLSBmb290ZXIgQ1RBIC0tLS0tLS0tLS0tLS0gKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1heC13LTV4bCBteC1hdXRvIG10LTEwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBmYWRlLXVwXCIgc3R5bGU9e3thbmltYXRpb25EZWxheTonLjE4cyd9fT5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCB0ZXh0LXhzIGZvbnQtbW9ub1wiPlxuICAgICAgICAgICAgICAgICAgICB7Y29tcGxldGVDb3VudCA9PT0gMCAmJiB0KCdzd19mb290X3N0YXJ0Jyl9XG4gICAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZUNvdW50ID4gMCAmJiBjb21wbGV0ZUNvdW50IDwgNSAmJiBg4oaRICR7NSAtIGNvbXBsZXRlQ291bnR9ICR7dCgnc3dfc3RlcHNfcmVtYWluaW5nJyl9YH1cbiAgICAgICAgICAgICAgICAgICAge2NvbXBsZXRlQ291bnQgPT09IDUgJiYgdCgnc3dfZm9vdF9hbGxfZG9uZScpfVxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiL2Rhc2hib2FyZC5odG1sXCJcbiAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7IHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWQ1LnNldHVwLmRvbmUnLCcxJyk7IH0gY2F0Y2goZSl7fSB9fVxuICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTcgcHktMyByb3VuZGVkLXhsIHRleHQtc20gZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2NvbXBsZXRlQ291bnQgPT09IDVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1lbWVyYWxkLTYwMCBob3ZlcjpiZy1lbWVyYWxkLTUwMCB0ZXh0LXdoaXRlIHNoYWRvdy1sZyBzaGFkb3ctZW1lcmFsZC01MDAvMzAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctaW5kaWdvLTYwMCBob3ZlcjpiZy1pbmRpZ28tNTAwIHRleHQtd2hpdGUgc2hhZG93LWxnIHNoYWRvdy1pbmRpZ28tNTAwLzIwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAge3QoJ3N3X29wZW5fZGFzaGJvYXJkJyl9XG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiAtLS0tLS0tLS0tLS0tIG1vZGFscyAtLS0tLS0tLS0tLS0tICovfVxuICAgICAgICAgICAge21vZGFsID09PSAnbG9jYXRpb24nICYmIDxMb2NhdGlvbk1vZGFsIGNmZz17bG9jQ2ZnfSBzZXRDZmc9e3NldExvY0NmZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldE1vZGFsKG51bGwpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlPXsoKSA9PiBmaW5pc2goJ2xvY2F0aW9uJyl9IC8+fVxuICAgICAgICAgICAge21vZGFsID09PSAnbGFuZ3VhZ2UnICYmIDxMYW5ndWFnZU1vZGFsIGNmZz17bGFuZ0NmZ30gc2V0Q2ZnPXtzZXRMYW5nQ2ZnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0TW9kYWwobnVsbCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNhdmU9eygpID0+IGZpbmlzaCgnbGFuZ3VhZ2UnKX0gLz59XG4gICAgICAgICAgICB7bW9kYWwgPT09ICdwbHVnaW5zJyAgJiYgPFBsdWdpbnNNb2RhbCAgY2ZnPXtwbHVnaW5DZmd9IHNldENmZz17c2V0UGx1Z2luQ2ZnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0TW9kYWwobnVsbCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNhdmU9eygpID0+IGZpbmlzaCgncGx1Z2lucycpfSAvPn1cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogVGlsZSAobGFyZ2UgZWFzeS1vbi1leWVzIGJ1dHRvbikgLS0ga2VwdCBmb3IgYmFjay1jb21wYXQsIG5vIGxvbmdlciB1c2VkXG4gKiBieSB0aGUgcGVudGFnb24gaHViLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuZnVuY3Rpb24gVGlsZSh7IHN0ZXAsIGRvbmUsIGluZGV4LCBvbkNsaWNrIH0pIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BzZXR1cC10aWxlLSR7c3RlcC5rZXl9YH1cbiAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXt0KHN0ZXAubGFiZWxLZXkpfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHRpbGUtYnRuIHJlbGF0aXZlIHRleHQtbGVmdCBiZy1zbGF0ZS05MDAvNzAgYm9yZGVyLTIgYm9yZGVyLXNsYXRlLTcwMC83MFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdW5kZWQtMnhsIHAtNiBzbTpwLTcgJHtkb25lID8gJ2RvbmUnIDogJyd9YH0+XG4gICAgICAgICAgICB7ZG9uZSAmJiA8c3BhbiBjbGFzc05hbWU9XCJjaGVja1wiIGRhdGEtdGVzdGlkPXtgc2V0dXAtdGlsZS0ke3N0ZXAua2V5fS1kb25lYH0+4pyTPC9zcGFuPn1cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTQgbWItM1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy0xMiBoLTEyIHJvdW5kZWQteGwgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tiYWNrZ3JvdW5kOmAke3N0ZXAuaWNvbkNvbG9yfTIyYCwgYm9yZGVyOmAxcHggc29saWQgJHtzdGVwLmljb25Db2xvcn01NWB9fT5cbiAgICAgICAgICAgICAgICAgICAgPFRpbGVJY29uIGtpbmQ9e3N0ZXAua2V5fSBjb2xvcj17c3RlcC5pY29uQ29sb3J9IC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LTN4bCBmb250LWJsYWNrIHRleHQtc2xhdGUtNzAwXCI+MHtpbmRleH08L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtbGcgc206dGV4dC14bCBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlciBtYi0xXCJcbiAgICAgICAgICAgICAgICBzdHlsZT17e2NvbG9yOnN0ZXAuaWNvbkNvbG9yfX0+e3Qoc3RlcC5sYWJlbEtleSl9PC9oMz5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc2xhdGUtNDAwIHRleHQtc20gbGVhZGluZy1zbnVnXCI+e3Qoc3RlcC5zdWJLZXkpfTwvcD5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNCBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiB0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTUwMFwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInBpbGwgYmctc2xhdGUtODAwIHRleHQtc2xhdGUtNDAwXCI+e3N0ZXAua2luZCA9PT0gJ3BhZ2UnID8gdCgnc3dfZnVsbF9wYWdlJykgOiB0KCdzd19wb3B1cCcpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICB7ZG9uZSAmJiA8c3BhbiBjbGFzc05hbWU9XCJwaWxsIGJnLWVtZXJhbGQtOTAwLzQwIHRleHQtZW1lcmFsZC00MDBcIj57dCgnc3dfY29uZmlndXJlZCcpfTwvc3Bhbj59XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgKTtcbn1cblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ2lyY2xlVGlsZSAtLSBwZW50YWdvbi1jb3JuZXIgcm91bmQgYnV0dG9uLiAgU2l6ZWQgaW4gJSBvZiBpdHMgY29udGFpbmVyXG4gKiBzbyB0aGUgd2hvbGUgbGF5b3V0IHNjYWxlcyB3aXRoIHZpZXdwb3J0LiAgRWFjaCBjaXJjbGUgaXMgYW5jaG9yZWQgYnkgaXRzXG4gKiBjZW50cmUgKHRyYW5zbGF0ZSAtNTAlLy01MCUpIG9uIHRoZSBwb2xhci1jb21wdXRlZCAobGVmdCUsIHRvcCUpLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuZnVuY3Rpb24gQ2lyY2xlVGlsZSh7IHN0ZXAsIGRvbmUsIGluZGV4LCBsZWZ0UGN0LCB0b3BQY3QsIG9uQ2xpY2sgfSkge1xuICAgIC8qIFRoaWNrIGNvbG91cmVkIHJpbmcgcGVyIHRpbGUgLS0gZWFjaCBzdGVwIGtlZXBzIGl0cyBhY2NlbnQgY29sb3VyXG4gICAgICogKGluZGlnby9hbWJlci9lbWVyYWxkL3Bpbmsvcm9zZSksIHJlaW5mb3JjaW5nIHRoZSBjb2xvdXItY29kZWQgU1ZHXG4gICAgICogaWNvbiBhbmQgdGhlIGhlYWRpbmcgdGV4dC4gKi9cbiAgICBjb25zdCByaW5nQ29sb3IgPSBzdGVwLmljb25Db2xvcjtcbiAgICByZXR1cm4gKFxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BzZXR1cC10aWxlLSR7c3RlcC5rZXl9YH1cbiAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXt0KHN0ZXAubGFiZWxLZXkpfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YGNpcmNsZS10aWxlIGdyb3VwIGFic29sdXRlIHJvdW5kZWQtZnVsbCB0ZXh0LWNlbnRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tMjAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtkb25lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLXNsYXRlLTkwMCBzaGFkb3ctWzBfMF8zMHB4Xy02cHhfcmdiYSgxNiwxODUsMTI5LDAuNTUpXSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctc2xhdGUtOTAwIGhvdmVyOmJnLXNsYXRlLTgwMCd9YH1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBsZWZ0OmAke2xlZnRQY3R9JWAsIHRvcDpgJHt0b3BQY3R9JWAsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOidtaW4oMzUlLCAyNjBweCknLCBhc3BlY3RSYXRpbzonMS8xJyxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOid0cmFuc2xhdGUoLTUwJSwgLTUwJSknLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6YDEwcHggc29saWQgJHtyaW5nQ29sb3J9YCxcbiAgICAgICAgICAgICAgICAgICAgYm94U2hhZG93OmAwIDAgMCAxcHggJHtyaW5nQ29sb3J9MzMsIDAgOHB4IDI4cHggLThweCAke3JpbmdDb2xvcn01NWAsXG4gICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICB7ZG9uZSAmJiAoXG4gICAgICAgICAgICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9e2BzZXR1cC10aWxlLSR7c3RlcC5rZXl9LWRvbmVgfVxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIC10b3AtMSAtcmlnaHQtMSB3LTYgaC02IHJvdW5kZWQtZnVsbCBiZy1lbWVyYWxkLTUwMCB0ZXh0LXdoaXRlIHRleHQteHMgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgZm9udC1ib2xkIHNoYWRvd1wiPlxuICAgICAgICAgICAgICAgICAgICDinJNcbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3VuZGVkLXhsIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIG1iLTFcIlxuICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDonMzQlJywgYXNwZWN0UmF0aW86JzEvMScsXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6YCR7c3RlcC5pY29uQ29sb3J9MjJgLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6YDFweCBzb2xpZCAke3N0ZXAuaWNvbkNvbG9yfTU1YCxcbiAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgPFRpbGVJY29uIGtpbmQ9e3N0ZXAua2V5fSBjb2xvcj17c3RlcC5pY29uQ29sb3J9IHNpemU9ezQ0fSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS02MDAgdHJhY2tpbmctd2lkZXJcIj4we2luZGV4fTwvZGl2PlxuICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtWzIycHhdIHNtOnRleHQtWzI2cHhdIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXRpZ2h0IHdoaXRlc3BhY2Utbm93cmFwIGxlYWRpbmctbm9uZSBtdC0xLjVcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7Y29sb3I6c3RlcC5pY29uQ29sb3J9fT5cbiAgICAgICAgICAgICAgICB7dChzdGVwLmxhYmVsS2V5KX1cbiAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCB0ZXh0LVsxMHB4XSBzbTp0ZXh0LVsxMXB4XSBsZWFkaW5nLXNudWcgcHgtMyBtdC0xIGxpbmUtY2xhbXAtMlwiPlxuICAgICAgICAgICAgICAgIHt0KHN0ZXAuc3ViS2V5KX1cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9idXR0b24+XG4gICAgKTtcbn1cblxuZnVuY3Rpb24gVGlsZUljb24oeyBraW5kLCBjb2xvciwgc2l6ZSA9IDIyIH0pIHtcbiAgICAvKiBzaW1wbGUgaW5saW5lIFNWR3Mgc28gd2Uga2VlcCB0aGUgZmlsZSBzZWxmLWNvbnRhaW5lZC4gIGBzaXplYFxuICAgICAgIHByb3AgbGV0cyB0aGUgcGVudGFnb24gQ2lyY2xlVGlsZSByZXF1ZXN0IGEgMsOXIGljb24gKDQ0IHB4KSB3aGlsZVxuICAgICAgIGtlZXBpbmcgdGhlIG9sZGVyIGdyaWQgVGlsZSBhdCB0aGUgb3JpZ2luYWwgMjIgcHguICovXG4gICAgY29uc3Qgc3Ryb2tlID0geyBzdHJva2U6Y29sb3IsIGZpbGw6J25vbmUnLCBzdHJva2VXaWR0aDoyLCBzdHJva2VMaW5lY2FwOidyb3VuZCcsIHN0cm9rZUxpbmVqb2luOidyb3VuZCcgfTtcbiAgICBpZiAoa2luZCA9PT0gJ3BzeScpICAgICAgcmV0dXJuIDxzdmcgd2lkdGg9e3NpemV9IGhlaWdodD17c2l6ZX0gdmlld0JveD1cIjAgMCAyNCAyNFwiIHsuLi5zdHJva2V9PjxwYXRoIGQ9XCJNMyAzdjE4aDE4XCIvPjxwYXRoIGQ9XCJNMyAxN2M0LTEgNy02IDktOXM1LTMgOS0yXCIvPjwvc3ZnPjtcbiAgICBpZiAoa2luZCA9PT0gJ2xvY2F0aW9uJykgcmV0dXJuIDxzdmcgd2lkdGg9e3NpemV9IGhlaWdodD17c2l6ZX0gdmlld0JveD1cIjAgMCAyNCAyNFwiIHsuLi5zdHJva2V9PjxwYXRoIGQ9XCJNMTIgMjJzLTctNi40LTctMTJhNyA3IDAgMSAxIDE0IDBjMCA1LjYtNyAxMi03IDEyelwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEwXCIgcj1cIjIuNVwiLz48L3N2Zz47XG4gICAgaWYgKGtpbmQgPT09ICdsYW5ndWFnZScpIHJldHVybiA8c3ZnIHdpZHRoPXtzaXplfSBoZWlnaHQ9e3NpemV9IHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB7Li4uc3Ryb2tlfT48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjlcIi8+PHBhdGggZD1cIk0zIDEyaDE4TTEyIDNhMTQgMTQgMCAwIDEgMCAxOE0xMiAzYTE0IDE0IDAgMCAwIDAgMThcIi8+PC9zdmc+O1xuICAgIGlmIChraW5kID09PSAncGx1Z2lucycpICByZXR1cm4gPHN2ZyB3aWR0aD17c2l6ZX0gaGVpZ2h0PXtzaXplfSB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgey4uLnN0cm9rZX0+PHBhdGggZD1cIk05IDN2Nk0xNSAzdjZcIi8+PHBhdGggZD1cIk01IDloMTR2NmE0IDQgMCAwIDEtNCA0aC0xdjNNOSAxOXYzXCIvPjwvc3ZnPjtcbiAgICAvKiBVcGRhdGUgJiBSZXBhaXIgLS0gd3JlbmNoICsgdGlueSBnZWFyIGJ1bXAsIHNpZ25hbGxpbmcgXCJ0b29sc1wiICovXG4gICAgaWYgKGtpbmQgPT09ICdyZXBhaXInKSAgIHJldHVybiA8c3ZnIHdpZHRoPXtzaXplfSBoZWlnaHQ9e3NpemV9IHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB7Li4uc3Ryb2tlfT48cGF0aCBkPVwiTTE0LjcgNi4zYTQgNCAwIDAgMC01LjQgNS40TDMgMThsMyAzIDYuMy02LjNhNCA0IDAgMCAwIDUuNC01LjRsLTIuOCAyLjhMMTMgMTFsLTEuMS0xLjkgMi44LTIuOHpcIi8+PC9zdmc+O1xuICAgIHJldHVybiBudWxsO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBQc3kgQ2hhcnQgU2V0dGluZyAtLSBGVUxMIFBBR0UsIGxpdmUgc2tlbGV0b24gcmVzcG9uZHMgdG8gY29udHJvbHNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIFBzeUNoYXJ0U2V0dGluZ1BhZ2UoeyBjZmcsIHNldENmZywgb25CYWNrLCBvblNhdmUgfSkge1xuICAgIGNvbnN0IHVwZGF0ZSA9IChrLCB2KSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIFtrXTp2fSkpO1xuXG4gICAgLyogT24gbW91bnQ6IGh5ZHJhdGUgZnJvbSB0aGUgU0FNRSBsb2NhbFN0b3JhZ2Uga2V5IHRoZSBkYXNoYm9hcmQgcmVhZHNcbiAgICAgKiAoYHJlZDVfc3dlZXRfc3BvdF9yYW5nZWApIHBsdXMgdGhlIHByZXNldCBpZCAoYHJlZDVfcmhfcHJlc2V0YCkgc29cbiAgICAgKiB0aGUgZHJvcGRvd24gbGFiZWwgc3RheXMgY29uc2lzdGVudCB3aXRoIHRoZSBzbGlkZXIgdmFsdWVzIGFjcm9zc1xuICAgICAqIHJlbG9hZHMuICBJZiB0aGUgb3BlcmF0b3IgaGFzIGFscmVhZHkgdHVuZWQgdGhlIFJIIGJhbmQgb24gdGhlXG4gICAgICogZGFzaGJvYXJkLCB0aGUgc2V0dXAgd2FsayBzdGFydHMgZnJvbSB0aG9zZSB2YWx1ZXMuICovXG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJhdyAgICA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWQ1X3N3ZWV0X3Nwb3RfcmFuZ2UnKTtcbiAgICAgICAgICAgIGNvbnN0IHByZXNldCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWQ1X3JoX3ByZXNldCcpO1xuICAgICAgICAgICAgY29uc3QgcGF0Y2ggID0ge307XG4gICAgICAgICAgICBpZiAocmF3KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcCA9IEpTT04ucGFyc2UocmF3KTtcbiAgICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHAubG8pICYmIE51bWJlci5pc0Zpbml0ZShwLmhpKSAmJiBwLmxvIDwgcC5oaSkge1xuICAgICAgICAgICAgICAgICAgICBwYXRjaC5yaExvID0gcC5sbztcbiAgICAgICAgICAgICAgICAgICAgcGF0Y2gucmhIaSA9IHAuaGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByZXNldCAmJiBSSF9QUkVTRVRTLmZpbmQoeCA9PiB4LmlkID09PSBwcmVzZXQpKSB7XG4gICAgICAgICAgICAgICAgcGF0Y2gucmhQcmVzZXQgPSBwcmVzZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBUaGVtZSArIGJyaWdodG5lc3Mg4oCUIHNhbWUga2V5cyBhcHAuanMgKGRhc2hib2FyZCkgcmVhZHMuICovXG4gICAgICAgICAgICBjb25zdCB0aCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWQ1LnRoZW1lJyk7XG4gICAgICAgICAgICBpZiAodGggPT09ICdsaWdodCcgfHwgdGggPT09ICdkYXJrJykgcGF0Y2gudGhlbWUgPSB0aDtcbiAgICAgICAgICAgIGNvbnN0IGRsID0gcGFyc2VGbG9hdChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVkNS5kYXJrTGV2ZWwnKSk7XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGRsKSAmJiBkbCA+PSAxLjUgJiYgZGwgPD0gMy4wKSBwYXRjaC5kYXJrTGV2ZWwgPSBkbDtcbiAgICAgICAgICAgIC8qIFRlbXBlcmF0dXJlIGF4aXMgcmFuZ2Ug4oCUIHdyaXR0ZW4gYnkgdGhpcyBzYW1lIHBhZ2UncyBzYXZlXG4gICAgICAgICAgICAgKiBoYW5kbGVyOyBsb2FkIGl0IGhlcmUgc28gcmVvcGVuaW5nIHRoZSBzZXR1cCB3YWxrIHNob3dzIHRoZVxuICAgICAgICAgICAgICogY3VycmVudCBkYXNoYm9hcmQgYXhpcyBpbnN0ZWFkIG9mIGFsd2F5cyBkZWZhdWx0aW5nIHRvIC0xNS4uNTAuICovXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRyUmF3ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlZDVfdGVtcF9yYW5nZScpO1xuICAgICAgICAgICAgICAgIGlmICh0clJhdykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ciA9IEpTT04ucGFyc2UodHJSYXcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHRyLm1pbikgJiYgTnVtYmVyLmlzRmluaXRlKHRyLm1heCkgJiYgdHIubWluIDwgdHIubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRjaC50TG8gPSB0ci5taW47XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRjaC50SGkgPSB0ci5tYXg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7IC8qIGlnbm9yZSAqLyB9XG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMocGF0Y2gpLmxlbmd0aCkgc2V0Q2ZnKGMgPT4gKHsuLi5jLCAuLi5wYXRjaH0pKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBpZ25vcmUgKi8gfVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgICB9LCBbXSk7XG5cbiAgICAvKiBPbiBzYXZlOiBwZXJzaXN0IHRoZSBSSCBiYW5kIHRvIGxvY2FsU3RvcmFnZSBzbyB0aGUgZGFzaGJvYXJkJ3NcbiAgICAgKiBzd2VldC1zcG90IHBvbHlnb24gcGlja3MgaXQgdXAgb24gbmV4dCBsb2FkLiAgQWxzbyBwZXJzaXN0IHRoZSB2ZW51ZVxuICAgICAqIHByZXNldCBpZCAoZm9yIGZ1dHVyZSBcInNob3cgcHJlc2V0IG5hbWUgb24gZGFzaGJvYXJkXCIgZmVhdHVyZXMpLiAqL1xuICAgIGNvbnN0IHBlcnNpc3RBbmRTYXZlID0gKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDVfc3dlZXRfc3BvdF9yYW5nZScsXG4gICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoeyBsbzogY2ZnLnJoTG8sIGhpOiBjZmcucmhIaSB9KSk7XG4gICAgICAgICAgICBpZiAoY2ZnLnJoUHJlc2V0KSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDVfcmhfcHJlc2V0JywgY2ZnLnJoUHJlc2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIFRoZW1lICsgYnJpZ2h0bmVzcyDigJQgd3JpdHRlbiB0byB0aGUgU0FNRSBrZXlzIHRoZSBkYXNoYm9hcmRcbiAgICAgICAgICAgICAqIChhcHAuanMgbGluZXMgNTctNTggYW5kIDg0LTk3KSByZWFkcyBhcyBpdHMgdXNlU3RhdGUgbGF6eVxuICAgICAgICAgICAgICogaW5pdGlhbGlzZXIsIHNvIHRoZSBjaG9zZW4gdGhlbWUgdGFrZXMgZWZmZWN0IG9uIG5leHQgZGFzaGJvYXJkXG4gICAgICAgICAgICAgKiBsb2FkLiAgYXBwLmpzIHRyZWF0cyBkYXJrTGV2ZWwgPj0gMy4wIGFzIGxpZ2h0LW1vZGUgdHJpZ2dlci4gKi9cbiAgICAgICAgICAgIGlmIChjZmcudGhlbWUgPT09ICdsaWdodCcgfHwgY2ZnLnRoZW1lID09PSAnZGFyaycpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS50aGVtZScsIGNmZy50aGVtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGNmZy5kYXJrTGV2ZWwpKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDUuZGFya0xldmVsJywgU3RyaW5nKGNmZy5kYXJrTGV2ZWwpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIFRlbXBlcmF0dXJlIGF4aXMgcmFuZ2Ug4oCUIGRyaXZlcyB0aGUgZGFzaGJvYXJkJ3MgcHN5IGNoYXJ0XG4gICAgICAgICAgICAgKiBYIGF4aXMgKGB0ZW1wUmFuZ2UubWluL21heGAgaW4gYXBwLmpzKS4gIFdlIHdyaXRlIHRoZSBzYW1lXG4gICAgICAgICAgICAgKiBzaGFwZSBhcHAuanMgcmVhZHMgKGB7bWluLCBtYXh9YCkgc28gaXRzIGxhenkgdXNlU3RhdGUgaW5pdFxuICAgICAgICAgICAgICogcGlja3MgaXQgdXAgb24gbmV4dCBsb2FkLCBBTkQgZGlzcGF0Y2ggYSBjdXN0b20gZXZlbnQgc29cbiAgICAgICAgICAgICAqIGFueSBvcGVuIGRhc2hib2FyZCB0YWIgdXBkYXRlcyBsaXZlIHdpdGhvdXQgYSByZWZyZXNoLiAqL1xuICAgICAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShjZmcudExvKSAmJiBOdW1iZXIuaXNGaW5pdGUoY2ZnLnRIaSkgJiYgY2ZnLnRMbyA8IGNmZy50SGkpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNV90ZW1wX3JhbmdlJyxcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoeyBtaW46IGNmZy50TG8sIG1heDogY2ZnLnRIaSB9KSk7XG4gICAgICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdyNS10ZW1wLXJhbmdlLWNoYW5nZScsIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7IG1pbjogY2ZnLnRMbywgbWF4OiBjZmcudEhpIH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3I1LXJoLWJhbmQtY2hhbmdlJywge1xuICAgICAgICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgICAgICAgICBsbzogY2ZnLnJoTG8sXG4gICAgICAgICAgICAgICAgICAgIGhpOiBjZmcucmhIaSxcbiAgICAgICAgICAgICAgICAgICAgcHJlc2V0OiBjZmcucmhQcmVzZXQgfHwgJ2N1c3RvbScsXG4gICAgICAgICAgICAgICAgICAgIGFwcGx5VG9BbGxBaHVzOiB0cnVlLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnW3NldHVwIHdhbGtdIHBzeSBjaGFydCBzYXZlZCAtPiBSSCcsIGNmZy5yaExvLCAnLScsIGNmZy5yaEhpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICclIFQtYXhpcycsIGNmZy50TG8sICcuLicsIGNmZy50SGksICfCsEMgcHJlc2V0PScsIGNmZy5yaFByZXNldCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignW3NldHVwIHdhbGtdIGNvdWxkIG5vdCBwZXJzaXN0IHBzeSBzZXR0aW5nczonLCBlKTtcbiAgICAgICAgfVxuICAgICAgICBvblNhdmUoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtaW4taC1zY3JlZW4gZmxleCBmbGV4LWNvbFwiPlxuICAgICAgICAgICAgey8qIGhlYWRlciAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHB4LTYgcHktNCBib3JkZXItYiBib3JkZXItc2xhdGUtODAwXCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkJhY2t9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTQwMCBob3Zlcjp0ZXh0LXdoaXRlIHRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrXCI+XG4gICAgICAgICAgICAgICAgICAgIHt0KCdzd19iYWNrX3RvX3NldHVwJyl9XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cInRleHQtc20gdXBwZXJjYXNlIHRyYWNraW5nLVswLjNlbV0gZm9udC1ibGFjayB0ZXh0LWluZGlnby00MDBcIj57dCgnc3dfcHN5X2NoYXJ0X3NldHRpbmcnKX08L2gxPlxuICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17cGVyc2lzdEFuZFNhdmV9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC01IHB5LTIgcm91bmRlZC1sZyBiZy1pbmRpZ28tNjAwIGhvdmVyOmJnLWluZGlnby01MDAgdGV4dC13aGl0ZSB0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFja1wiPlxuICAgICAgICAgICAgICAgICAgICB7dCgnc3dfc2F2ZV9yZXR1cm4nKX1cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogYm9keSDigJQgY2hhcnQgbGVmdCwgY29udHJvbHMgcmlnaHQgKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMSBncmlkIGdyaWQtY29scy0xIGxnOmdyaWQtY29scy1bMWZyXzM2MHB4XSBnYXAtNCBwLTYgbWF4LXctN3hsIG14LWF1dG8gdy1mdWxsXCI+XG4gICAgICAgICAgICAgICAgPFBzeVNrZWxldG9uIGNmZz17Y2ZnfSAvPlxuICAgICAgICAgICAgICAgIDxQc3lDb250cm9sUGFuZWwgY2ZnPXtjZmd9IHVwZGF0ZT17dXBkYXRlfSBzZXRDZmc9e3NldENmZ30gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG4vKiBSSCBiYW5kIHByZXNldHMg4oCUIHJlY29nbmlzZWQgaW5kdXN0cnkgc3RhbmRhcmRzIGZvciBlYWNoIHZlbnVlIHR5cGUuXG4gKiBTb3VyY2VzOiBBU0hSQUUgNTUgKGNvbWZvcnQpLCBBU0hSQUUgMTcwIChoZWFsdGhjYXJlKSxcbiAqIEFBTS9OUFMvU21pdGhzb25pYW4gZ3VpZGFuY2UgKGNvbGxlY3Rpb25zKSwgQ0lCU0UgVE00MCAobGlicmFyaWVzKS4gKi9cbmNvbnN0IFJIX1BSRVNFVFMgPSBbXG4gICAgeyBpZDonY3VzdG9tJywgICAgICAgICAgbGFiZWw6J0N1c3RvbSAobWFudWFsKScsICAgICAgICAgICAgICAgICBsbzpudWxsLCBoaTpudWxsLCBub3RlOicnIH0sXG4gICAgeyBpZDonb2ZmaWNlJywgICAgICAgICAgbGFiZWw6J09mZmljZScsICAgICAgICAgICAgICAgICAgICAgICAgICBsbzozMCwgICBoaTo2MCwgICBub3RlOidBU0hSQUUgNTUgY29tZm9ydCcgICAgICAgICAgICAgICAgICB9LFxuICAgIHsgaWQ6J211c2V1bScsICAgICAgICAgIGxhYmVsOidNdXNldW0nLCAgICAgICAgICAgICAgICAgICAgICAgICAgbG86NDAsICAgaGk6NTUsICAgbm90ZTonQUFNIGNvbGxlY3Rpb24gcHJlc2VydmF0aW9uJyAgICAgICAgfSxcbiAgICB7IGlkOidob3RlbCcsICAgICAgICAgICBsYWJlbDonSG90ZWwgZ3Vlc3Qgcm9vbScsICAgICAgICAgICAgICAgIGxvOjMwLCAgIGhpOjYwLCAgIG5vdGU6J2dlbmVyYWwgb2NjdXBhbnQgY29tZm9ydCcgICAgICAgICAgIH0sXG4gICAgeyBpZDonbGlicmFyeScsICAgICAgICAgbGFiZWw6J0xpYnJhcnkgLyBBcmNoaXZlJywgICAgICAgICAgICAgICBsbzo0MCwgICBoaTo1NSwgICBub3RlOidwYXBlciAmIGJpbmRpbmcgcHJlc2VydmF0aW9uJyAgICAgICB9LFxuICAgIHsgaWQ6J2hvc3BpdGFsJywgICAgICAgIGxhYmVsOidIb3NwaXRhbCAoZ2VuZXJhbCknLCAgICAgICAgICAgICAgbG86MzAsICAgaGk6NjAsICAgbm90ZTonQVNIUkFFIDE3MCBwYXRpZW50IGFyZWFzJyAgICAgICAgICAgfSxcbiAgICB7IGlkOidsZWN0dXJlJywgICAgICAgICBsYWJlbDonTGVjdHVyZSBoYWxsJywgICAgICAgICAgICAgICAgICAgIGxvOjMwLCAgIGhpOjYwLCAgIG5vdGU6J2hpZ2ggb2NjdXBhbmN5IGNvbWZvcnQnICAgICAgICAgICAgIH0sXG4gICAgeyBpZDonY29uY2VydCcsICAgICAgICAgbGFiZWw6J0NvbmNlcnQgaGFsbCcsICAgICAgICAgICAgICAgICAgICBsbzo0MCwgICBoaTo1NSwgICBub3RlOidpbnN0cnVtZW50IHR1bmluZyBzdGFiaWxpdHknICAgICAgICB9LFxuICAgIHsgaWQ6J21lZXRpbmcnLCAgICAgICAgIGxhYmVsOidNZWV0aW5nIHJvb20nLCAgICAgICAgICAgICAgICAgICAgbG86MzAsICAgaGk6NjAsICAgbm90ZTonc21hbGwgZ3JvdXAgY29tZm9ydCcgICAgICAgICAgICAgICAgfSxcbiAgICB7IGlkOidleGhpYml0aW9uJywgICAgICBsYWJlbDonRXhoaWJpdGlvbiBoYWxsJywgICAgICAgICAgICAgICAgIGxvOjQwLCAgIGhpOjU1LCAgIG5vdGU6J21peGVkIGFydCAvIGFydGlmYWN0IGRpc3BsYXknICAgICAgIH0sXG5dO1xuXG4vKiBSZWFsIHBzeSBjaGFydCDigJQgdXNlcyB0aGUgU0FNRSBnZXRXICsgR0lWT05JX0NPTE9SUyArIHBvbHlnb24gbWF0aCBhcyB0aGVcbiAqIHByb2R1Y3Rpb24gZGFzaGJvYXJkLiAgU291cmNlIG9mIHRydXRoOiAganMvcHN5Y2hyb21ldHJpYy5qcyAgYW5kIHRoZVxuICogcmVuZGVyR2l2b25pT3ZlcmxheSgpIGJsb2NrIGF0IGFwcC5qczoxNjQxLTE3MjIuXG4gKiBBbnl0aGluZyB5b3UgY2hhbmdlIGluIHRob3NlIGZpbGVzIE1VU1QgYmUgbWlycm9yZWQgaGVyZS4gKi9cbmZ1bmN0aW9uIFBzeVNrZWxldG9uKHsgY2ZnIH0pIHtcbiAgICAvKiBDYW52YXMgKyBwYWRkaW5nICovXG4gICAgY29uc3QgVyA9IDc2MCwgSCA9IDQ4MDtcbiAgICBjb25zdCBwYWQgPSB7IGxlZnQ6IDU2LCByaWdodDogNDAsIHRvcDogMjgsIGJvdHRvbTogNTYgfTtcbiAgICBjb25zdCBncmlkVyA9IFcgLSBwYWQubGVmdCAtIHBhZC5yaWdodDtcbiAgICBjb25zdCBncmlkSCA9IEggLSBwYWQudG9wICAtIHBhZC5ib3R0b207XG5cbiAgICBjb25zdCBUX01JTiA9IGNmZy50TG8sIFRfTUFYID0gY2ZnLnRIaTtcbiAgICBjb25zdCBXX01JTiA9IDAsICAgICAgIFdfTUFYID0gMC4wMzA7ICAgICAgICAgIC8vIGtnL2tnXG5cbiAgICAvKiBheGlzIHNjYWxlcyAtLSBtYXRjaCB0aGUgbGl2ZSBkYXNoYm9hcmQgKi9cbiAgICBjb25zdCB4ICA9ICh0KSA9PiBwYWQubGVmdCArICgodCAtIFRfTUlOKSAvIChUX01BWCAtIFRfTUlOKSkgKiBncmlkVztcbiAgICBjb25zdCB5ICA9ICh3KSA9PiBwYWQudG9wICArICgxIC0gKHcgLSBXX01JTikgLyAoV19NQVggLSBXX01JTikpICogZ3JpZEg7XG4gICAgY29uc3QgX2dldFcgPSAodHlwZW9mIGdldFcgPT09ICdmdW5jdGlvbicpID8gZ2V0VyA6ICgodCwgcmgpID0+IDApO1xuXG4gICAgY29uc3Qgc2FmZVB0cyA9IChhcnIpID0+IGFyci5tYXAocCA9PiBgJHsoeChwWzBdKXx8MCkudG9GaXhlZCgyKX0sJHsoeShwWzFdKXx8MCkudG9GaXhlZCgyKX1gKS5qb2luKCcgJyk7XG5cbiAgICAvKiAtLS0tIEdpdm9uaSBwb2x5Z29ucyAtLSBDT1BJRUQgVkVSQkFUSU0gZnJvbSBhcHAuanM6MTY0My0xNjY5IC0tLS0gKi9cbiAgICBjb25zdCByaDgwID0gW107IGZvciAobGV0IHQ9MjA7IHQ8PTI1OyB0Kz0wLjUpIHJoODAucHVzaChbdCwgX2dldFcodCwgODApXSk7XG4gICAgY29uc3QgcmgxMDA9IFtdOyBmb3IgKGxldCB0PTIwOyB0PD0yNzsgdCs9MC41KSByaDEwMC5wdXNoKFt0LCBfZ2V0Vyh0LCAxMDApXSk7XG4gICAgY29uc3QgcmgyMExpbmUgPSBbXTsgZm9yIChsZXQgdD0zMjsgdD49MjA7IHQtPTAuNSkgcmgyMExpbmUucHVzaChbdCwgX2dldFcodCwgMjApXSk7XG4gICAgY29uc3QgcmgyMF9DWiAgPSBbXTsgZm9yIChsZXQgdD0yNzsgdD49MjA7IHQtPTAuNSkgcmgyMF9DWi5wdXNoKFt0LCBfZ2V0Vyh0LCAyMCldKTtcbiAgICBjb25zdCBDWiAgID0gWy4uLnJoODAsIFsyNywgX2dldFcoMjcsIDUwKV0sIFsyNywgX2dldFcoMjcsIDIwKV0sIC4uLnJoMjBfQ1pdO1xuXG4gICAgY29uc3QgcmhIaV90b3AgPSBbXTsgZm9yIChsZXQgdHQ9MjA7IHR0PD0yNzsgdHQrPTAuNSkgcmhIaV90b3AucHVzaChbdHQsIF9nZXRXKHR0LCBjZmcucmhIaSldKTtcbiAgICBjb25zdCByaExvX2JvdCA9IFtdOyBmb3IgKGxldCB0dD0yNzsgdHQ+PTIwOyB0dC09MC41KSByaExvX2JvdC5wdXNoKFt0dCwgX2dldFcodHQsIGNmZy5yaExvKV0pO1xuICAgIGNvbnN0IFNXRUVUID0gWy4uLnJoSGlfdG9wLCAuLi5yaExvX2JvdF07XG5cbiAgICBjb25zdCBOViAgID0gWy4uLnJoMTAwLCBbMzIsIDE1LjQvMTAwMF0sIFszMiwgNi4yLzEwMDBdLCAuLi5yaDIwTGluZV07XG4gICAgY29uc3QgTWFzcyA9IFsuLi5yaDgwLCBbMzMsIDE2LzEwMDBdLCBbMzcsIF9nZXRXKDM3LCAzMCldLCBbMzcsIDMvMTAwMF0sIFsyMCwgX2dldFcoMjAsIDIwKV1dO1xuICAgIGNvbnN0IE1DViAgPSBbLi4ucmg4MCwgWzQwLCAxNi8xMDAwXSwgWzQ0LCBfZ2V0Vyg0NCwgMjApXSwgWzQ0LCAzLzEwMDBdLCBbMjAsIF9nZXRXKDIwLCAyMCldXTtcbiAgICBjb25zdCBFVkFQID0gWy4uLnJoODAsIFsyNSwgMTYvMTAwMF0sIFszNiwgX2dldFcoMzYsIDMwKV0sIFszOSwgX2dldFcoMzksIDIwKV0sXG4gICAgICAgICAgICAgICAgICBbNDEsIF9nZXRXKDQxLCAxMCldLCBbNDEsIDBdLCBbMjcuMiwgMF0sIFsyMCwgX2dldFcoMjAsIDIwKV1dO1xuXG4gICAgY29uc3Qgd2ludGVyUkg4MCA9IFtdOyBmb3IgKGxldCB0PTE4OyB0PD0xOS41OyB0Kz0wLjUpIHdpbnRlclJIODAucHVzaChbdCwgX2dldFcodCwgODApXSk7XG4gICAgY29uc3Qgd2ludGVyUkgyMCA9IFtdOyBmb3IgKGxldCB0PTE5LjU7IHQ+PTE4OyB0LT0wLjUpIHdpbnRlclJIMjAucHVzaChbdCwgX2dldFcodCwgMjApXSk7XG4gICAgY29uc3QgV0lOVEVSID0gWy4uLndpbnRlclJIODAsIC4uLndpbnRlclJIMjBdO1xuXG4gICAgLyogUkggaXNvcGxldGggY3VydmVzIGZvciB0aGUgY2hhcnQgZ3JpZCAqL1xuICAgIGNvbnN0IGlzb3BsZXRocyA9IFsyMCwgNDAsIDYwLCA4MCwgMTAwXTtcblxuICAgIC8qIFRoZW1lIHBhbGV0dGUg4oCUIGRyaXZlcyB0aGUgbGl2ZSBwcmV2aWV3IHNvIHRoZSBkaW0vbGlnaHQgY29udHJvbHNcbiAgICAgKiBoYXZlIHZpc2libGUgZmVlZGJhY2sgcmlnaHQgb24gdGhlIGNoYXJ0LiAgSW4gZGltL2RhcmsgbW9kZSB3ZSBhbHNvXG4gICAgICogYXBwbHkgYSBDU1MgYnJpZ2h0bmVzcyBmaWx0ZXIgbWFwcGVkIGZyb20gY2ZnLmRhcmtMZXZlbCAoMS41IC4uIDIuOFxuICAgICAqIOKGkiAwLjYgLi4gMS40KSBzbyB0aGUgdXNlciBjYW4gU0VFIHRoZSBicmlnaHRuZXNzIHNsaWRlciB3b3JraW5nLiAqL1xuICAgIGNvbnN0IGlzTGlnaHQgPSBjZmcudGhlbWUgPT09ICdsaWdodCc7XG4gICAgY29uc3QgcGFsZXR0ZSA9IGlzTGlnaHRcbiAgICAgICAgPyB7IGJnOicjZjhmYWZjJywgZ3JpZDonI2NiZDVlMScsIHRpY2s6JyM0NzU1NjknLCBheGlzOicjMWUyOTNiJyxcbiAgICAgICAgICAgIHBhbmVsQmc6J3JnYmEoMjQ4LDI1MCwyNTIsMC44NSknLCBwYW5lbEJvcmRlcjonI2NiZDVlMScsXG4gICAgICAgICAgICBwaWxsQmc6JyNlMmU4ZjAnLCBwaWxsRmc6JyM0NzU1NjknLCBtZXRhRmc6JyM2NDc0OGInIH1cbiAgICAgICAgOiB7IGJnOicjMGIxMjIwJywgZ3JpZDonIzFlMjkzYicsIHRpY2s6JyM5NGEzYjgnLCBheGlzOicjY2JkNWUxJyxcbiAgICAgICAgICAgIHBhbmVsQmc6J3JnYmEoMTUsMjMsNDIsMC42KScsIHBhbmVsQm9yZGVyOicjMWUyOTNiJyxcbiAgICAgICAgICAgIHBpbGxCZzonIzFlMjkzYicsIHBpbGxGZzonIzk0YTNiOCcsIG1ldGFGZzonIzY0NzQ4YicgfTtcbiAgICBjb25zdCBkaW1GaWx0ZXIgPSBpc0xpZ2h0XG4gICAgICAgID8gJ25vbmUnXG4gICAgICAgIDogYGJyaWdodG5lc3MoJHsoTWF0aC5tYXgoMS41LCBNYXRoLm1pbigyLjgsIGNmZy5kYXJrTGV2ZWwgfHwgMi4wKSkgLyAyLjApLnRvRml4ZWQoMil9KWA7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdW5kZWQtMnhsIHAtNCBib3JkZXIgdHJhbnNpdGlvbi1jb2xvcnMgZHVyYXRpb24tMzAwXCJcbiAgICAgICAgICAgICBzdHlsZT17e2JhY2tncm91bmQ6IHBhbGV0dGUucGFuZWxCZywgYm9yZGVyQ29sb3I6IHBhbGV0dGUucGFuZWxCb3JkZXJ9fT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIG1iLTNcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJwaWxsXCIgc3R5bGU9e3tiYWNrZ3JvdW5kOnBhbGV0dGUucGlsbEJnLCBjb2xvcjpwYWxldHRlLnBpbGxGZ319PlBTWUNIUk9NRVRSSUMgQ0hBUlQgwrcgbGl2ZSBwcmV2aWV3PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIGZvbnQtbW9ub1wiIHN0eWxlPXt7Y29sb3I6cGFsZXR0ZS5tZXRhRmd9fT57VF9NSU59wrBDIOKGkiB7VF9NQVh9wrBDICDCtyAge2NmZy5yaExvfeKAk3tjZmcucmhIaX0lIFJIPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8c3ZnIHZpZXdCb3g9e2AwIDAgJHtXfSAke0h9YH0gY2xhc3NOYW1lPVwidy1mdWxsIGgtYXV0byB0cmFuc2l0aW9uLVtmaWx0ZXJdIGR1cmF0aW9uLTMwMFwiXG4gICAgICAgICAgICAgICAgIHN0eWxlPXt7YmFja2dyb3VuZDogcGFsZXR0ZS5iZywgYm9yZGVyUmFkaXVzOjgsIGZpbHRlcjogZGltRmlsdGVyfX0+XG4gICAgICAgICAgICAgICAgey8qIC0tLS0gZ3JpZDogdmVydGljYWwgVCBsaW5lcywgaG9yaXpvbnRhbCBXIGxpbmVzIC0tLS0gKi99XG4gICAgICAgICAgICAgICAge0FycmF5LmZyb20oe2xlbmd0aDoxMX0pLm1hcCgoXyxpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBUX01JTiArIChpLzEwKSAqIChUX01BWCAtIFRfTUlOKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxnIGtleT17J3Z0JytpfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17eCh0KX0geTE9e3BhZC50b3B9IHgyPXt4KHQpfSB5Mj17cGFkLnRvcCtncmlkSH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9e3BhbGV0dGUuZ3JpZH0gc3Ryb2tlV2lkdGg9XCIwLjZcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCh0KX0geT17cGFkLnRvcCtncmlkSCsxNn0gZm9udFNpemU9XCI5LjVcIiBmaWxsPXtwYWxldHRlLnRpY2t9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiPnt0LnRvRml4ZWQoMCl9PC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIHtBcnJheS5mcm9tKHtsZW5ndGg6N30pLm1hcCgoXyxpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHcgPSBXX01JTiArIChpLzYpICogKFdfTUFYIC0gV19NSU4pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGcga2V5PXsnaHcnK2l9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXtwYWQubGVmdH0geTE9e3kodyl9IHgyPXtwYWQubGVmdCtncmlkV30geTI9e3kodyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPXtwYWxldHRlLmdyaWR9IHN0cm9rZVdpZHRoPVwiMC42XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3BhZC5sZWZ0LTh9IHk9e3kodykrM30gZm9udFNpemU9XCI5LjVcIiBmaWxsPXtwYWxldHRlLnRpY2t9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cImVuZFwiPnsodyoxMDAwKS50b0ZpeGVkKDApfTwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICB7LyogLS0tLSBSSCBpc29wbGV0aHMgKGN1cnZlcykgLS0tLSAqL31cbiAgICAgICAgICAgICAgICB7aXNvcGxldGhzLm1hcChyaCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHB0cyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB0ID0gVF9NSU47IHQgPD0gVF9NQVg7IHQgKz0gMC41KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB3dyA9IF9nZXRXKHQsIHJoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3dyA+PSBXX01JTiAmJiB3dyA8PSBXX01BWCkgcHRzLnB1c2goW3QsIHd3XSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxnIGtleT17J2lzbycrcmh9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5bGluZSBwb2ludHM9e3NhZmVQdHMocHRzKX0gZmlsbD1cIm5vbmVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9e3JoID09PSAxMDAgPyAnIzYzNjZmMScgOiAnI2VjNDg5OTU1J30gc3Ryb2tlV2lkdGg9XCIwLjhcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2VEYXNoYXJyYXk9e3JoID09PSAxMDAgPyAnJyA6ICczLDMnfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3B0cy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eChwdHNbTWF0aC5mbG9vcihwdHMubGVuZ3RoKjAuNjUpXVswXSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk9e3kocHRzW01hdGguZmxvb3IocHRzLmxlbmd0aCowLjY1KV1bMV0pIC0gNH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU9XCI5XCIgZmlsbD1cIiNlYzQ4OTk5OVwiIGZvbnRXZWlnaHQ9XCI3MDBcIj57cmh9JTwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pfVxuXG4gICAgICAgICAgICAgICAgey8qIC0tLS0gR2l2b25pIG92ZXJsYXkgKGNvcGllZCB2ZXJiYXRpbSBmcm9tIGFwcC5qcyByZW5kZXIgb3JkZXIpIC0tLS0gKi99XG4gICAgICAgICAgICAgICAge2NmZy5naXZvbmkgJiYgKFxuICAgICAgICAgICAgICAgICAgICA8ZyBjbGFzc05hbWU9XCJwb2ludGVyLWV2ZW50cy1ub25lXCIgb3BhY2l0eT1cIjAuOVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9e3goNDApfSB5MT17eSgxNi8xMDAwKX0geDI9e3goNTApfSB5Mj17eSgxNi8xMDAwKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT1cIiM2MzY2ZjFcIiBzdHJva2VXaWR0aD1cIjEuNVwiIHN0cm9rZURhc2hhcnJheT1cIjQsNFwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXt4KDUwKX0geTE9e3koMTYvMTAwMCl9IHgyPXt4KDUwKX0geTI9e3koMCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCIjNjM2NmYxXCIgc3Ryb2tlV2lkdGg9XCIxLjVcIiBzdHJva2VEYXNoYXJyYXk9XCI0LDRcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT17eCg0MSl9IHkxPXt5KDApfSB4Mj17eCg1MCl9IHkyPXt5KDApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiIzYzNjZmMVwiIHN0cm9rZVdpZHRoPVwiMS41XCIgc3Ryb2tlRGFzaGFycmF5PVwiNCw0XCIvPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoTUNWKX0gIGZpbGw9XCIjZWM0ODk5XCIgZmlsbE9wYWNpdHk9XCIwLjA1XCIgc3Ryb2tlPVwiI2VjNDg5OVwiIHN0cm9rZVdpZHRoPVwiMVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhNYXNzKX0gZmlsbD1cIiM4YjVjZjZcIiBmaWxsT3BhY2l0eT1cIjAuMDVcIiBzdHJva2U9XCIjOGI1Y2Y2XCIgc3Ryb2tlV2lkdGg9XCIxXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKEVWQVApfSBmaWxsPVwiIzA2YjZkNFwiIGZpbGxPcGFjaXR5PVwiMC4wOFwiIHN0cm9rZT1cIiMwNmI2ZDRcIiBzdHJva2VXaWR0aD1cIjFcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoTlYpfSAgIGZpbGw9XCIjZjU5ZTBiXCIgZmlsbE9wYWNpdHk9XCIwLjA1XCIgc3Ryb2tlPVwiI2Y1OWUwYlwiIHN0cm9rZVdpZHRoPVwiMVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz17c2FmZVB0cyhDWil9ICAgZmlsbD1cIiMxMGI5ODFcIiBmaWxsT3BhY2l0eT1cIjAuMTVcIiBzdHJva2U9XCIjMTBiOTgxXCIgc3Ryb2tlV2lkdGg9XCIxLjJcIi8+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBTd2VldC1zcG90IGJhbmQsIGNsaXBwZWQgdG8gQ1ogKi99XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGVmcz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y2xpcFBhdGggaWQ9XCJjei1jbGlwLXdhbGtcIiBjbGlwUGF0aFVuaXRzPVwidXNlclNwYWNlT25Vc2VcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKENaKX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvY2xpcFBhdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2RlZnM+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9e3NhZmVQdHMoU1dFRVQpfSBjbGlwUGF0aD1cInVybCgjY3otY2xpcC13YWxrKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxsPVwiIzA1OTY2OVwiIGZpbGxPcGFjaXR5PVwiMC4zMlwiIHN0cm9rZT1cIiMwNDc4NTdcIiBzdHJva2VXaWR0aD1cIjAuOFwiIHN0cm9rZURhc2hhcnJheT1cIjMsMlwiLz5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPXtzYWZlUHRzKFdJTlRFUil9IGZpbGw9XCIjM2I4MmY2XCIgZmlsbE9wYWNpdHk9XCIwLjE1XCIgc3Ryb2tlPVwibm9uZVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPXt4KDE5KX0geTE9e3BhZC50b3ArMTh9IHgyPXt4KDE5KX0geTI9e3BhZC50b3ArZ3JpZEh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U9XCIjM2I4MmY2XCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlRGFzaGFycmF5PVwiNiw0XCIgb3BhY2l0eT1cIjAuOFwiLz5cblxuICAgICAgICAgICAgICAgICAgICAgICAgey8qIFJlZ2lvbiBsYWJlbHMg4oCUIHNhbWUgY29sb3JzICYgc3Bpcml0IGFzIGxpdmUgY2hhcnQgKi99XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDUwKS0xMH0geT17eSg4LzEwMDApfSBmaWxsPVwiIzYzNjZmMVwiIGZvbnRTaXplPVwiMTBcIiBmb250V2VpZ2h0PVwiOTAwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiB0cmFuc2Zvcm09e2Byb3RhdGUoLTkwLCAke3goNTApLTEwfSwgJHt5KDgvMTAwMCl9KWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nPVwiMlwiPk1FQ0hBTklDQUwgQ09PTElORzwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goNDQpLTJ9IHk9e3koOC8xMDAwKX0gZmlsbD1cIiNlYzQ4OTlcIiBmb250U2l6ZT1cIjlcIiBmb250V2VpZ2h0PVwiOTAwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiB0cmFuc2Zvcm09e2Byb3RhdGUoLTkwLCAke3goNDQpLTJ9LCAke3koOC8xMDAwKX0pYH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc9XCIxLjVcIj5NQVNTIENPT0xJTkc8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDM3KS0xMH0geT17eSg4LzEwMDApfSBmaWxsPVwiIzhiNWNmNlwiIGZvbnRTaXplPVwiOVwiIGZvbnRXZWlnaHQ9XCI5MDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIHRyYW5zZm9ybT17YHJvdGF0ZSgtOTAsICR7eCgzNyktMTB9LCAke3koOC8xMDAwKX0pYH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc9XCIxLjVcIj5NQVNTIENPT0xJTkc8L3RleHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dCB4PXt4KDM0KX0geT17eSgwLjUvMTAwMCktOH0gZmlsbD1cIiMwNmI2ZDRcIiBmb250U2l6ZT1cIjlcIiBmb250V2VpZ2h0PVwiOTAwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiBsZXR0ZXJTcGFjaW5nPVwiMlwiPkVWQVBPUkFUSVZFPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCgyMy41KX0geT17eShfZ2V0VygyMy41LCA0NSkpfSBmaWxsPVwiIzEwYjk4MVwiIGZvbnRTaXplPVwiMTFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodD1cIjkwMFwiIHRleHRBbmNob3I9XCJtaWRkbGVcIiBsZXR0ZXJTcGFjaW5nPVwiMS41XCI+Q09NRk9SVDwvdGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0IHg9e3goMTguNzUpfSB5PXt5KF9nZXRXKDE4Ljc1LCA0NSkpfSBmaWxsPVwiIzNiODJmNlwiIGZvbnRTaXplPVwiMTFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodD1cIjkwMFwiIHRleHRBbmNob3I9XCJtaWRkbGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtPXtgcm90YXRlKC05MCwgJHt4KDE4Ljc1KX0sICR7eShfZ2V0VygxOC43NSwgNDUpKX0pYH0+V0lOVEVSPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHQgeD17eCgyMy41KX0geT17eShfZ2V0VygyMy41LCAoY2ZnLnJoTG8rY2ZnLnJoSGkpLzIpKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw9XCIjMDIyYzIyXCIgZm9udFNpemU9XCI4XCIgZm9udFdlaWdodD1cIjkwMFwiIHRleHRBbmNob3I9XCJtaWRkbGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3twYWludE9yZGVyOidzdHJva2UnLCBzdHJva2U6JyNhN2YzZDAnLCBzdHJva2VXaWR0aDonMi41cHgnLCBzdHJva2VMaW5lam9pbjoncm91bmQnfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc9XCIxLjVcIj57Y2ZnLnJoTG99LXtjZmcucmhIaX0lIFJIPC90ZXh0PlxuICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAgICAgIHsvKiBheGlzIGxhYmVscyAqL31cbiAgICAgICAgICAgICAgICA8dGV4dCB4PXtwYWQubGVmdCArIGdyaWRXLzJ9IHk9e0gtMTJ9IGZvbnRTaXplPVwiMTFcIiBmaWxsPXtwYWxldHRlLmF4aXN9XG4gICAgICAgICAgICAgICAgICAgICAgdGV4dEFuY2hvcj1cIm1pZGRsZVwiIGZvbnRXZWlnaHQ9XCI4MDBcIiBsZXR0ZXJTcGFjaW5nPVwiMlwiPkRSWSBCVUxCIFRFTVAgKMKwQyk8L3RleHQ+XG4gICAgICAgICAgICAgICAgPHRleHQgeD17MTZ9IHk9e3BhZC50b3AgKyBncmlkSC8yfSBmb250U2l6ZT1cIjExXCIgZmlsbD17cGFsZXR0ZS5heGlzfVxuICAgICAgICAgICAgICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIiBmb250V2VpZ2h0PVwiODAwXCIgbGV0dGVyU3BhY2luZz1cIjJcIlxuICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybT17YHJvdGF0ZSgtOTAgMTYgJHtwYWQudG9wICsgZ3JpZEgvMn0pYH0+SFVNSURJVFkgUkFUSU8gKGcva2cpPC90ZXh0PlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbmZ1bmN0aW9uIFBzeUNvbnRyb2xQYW5lbCh7IGNmZywgdXBkYXRlLCBzZXRDZmcgfSkge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctc2xhdGUtOTAwLzYwIGJvcmRlciBib3JkZXItc2xhdGUtODAwIHJvdW5kZWQtMnhsIHAtNSBzcGFjZS15LTZcIj5cbiAgICAgICAgICAgIHsvKiBUaGVtZSArIGJyaWdodG5lc3MgIC0tIHJlbG9jYXRlZCBmcm9tIHRoZSBkYXNoYm9hcmQgc2lkZWJhciAyMDI2LTA2LTI1LlxuICAgICAgICAgICAgICAgIFR3byBjb250cm9sczogRGFyay9MaWdodCBtb2RlIHRvZ2dsZSwgYW5kIEJyaWdodG5lc3Mgc2xpZGVyIChvbmx5XG4gICAgICAgICAgICAgICAgbWVhbmluZ2Z1bCBpbiBkYXJrIG1vZGUpLiAgTGl2ZSBwcmV2aWV3IGFwcGxpZXMgdG8gdGhlIHN1cnJvdW5kaW5nXG4gICAgICAgICAgICAgICAgY29udHJvbCBwYW5lbCBzbyB0aGUgb3BlcmF0b3IgY2FuIEZFRUwgdGhlIGNoYW5nZSBiZWZvcmUgc2F2aW5nLiAqL31cbiAgICAgICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJwc3ktY2ZnLXRoZW1lLWJsb2NrXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0yXCI+e3QoJ3N3X2Rpc3BsYXlfbW9kZScpfTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtMiBtYi0zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJwc3ktY2ZnLXRoZW1lLWRhcmtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldENmZyhjID0+ICh7Li4uYywgdGhlbWU6J2RhcmsnLCBkYXJrTGV2ZWw6TWF0aC5taW4oYy5kYXJrTGV2ZWwgfHwgMi4wLCAyLjYpfSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB5LTIuNSByb3VuZGVkLWxnIHRleHQteHMgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGJvcmRlciB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2NmZy50aGVtZSA9PT0gJ2RhcmsnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1zbGF0ZS04MDAgYm9yZGVyLXllbGxvdy01MDAvNzAgdGV4dC15ZWxsb3ctMzAwIHNoYWRvdy1sZyBzaGFkb3cteWVsbG93LTUwMC8xMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLXNsYXRlLTkwMC8zMCBib3JkZXItc2xhdGUtNzAwIHRleHQtc2xhdGUtNTAwIGhvdmVyOmJnLXNsYXRlLTgwMC82MCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dCgnc3dfZGltX2RhcmsnKX1cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJwc3ktY2ZnLXRoZW1lLWxpZ2h0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIHRoZW1lOidsaWdodCcsIGRhcmtMZXZlbDozLjB9KSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHktMi41IHJvdW5kZWQtbGcgdGV4dC14cyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgYm9yZGVyIHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7Y2ZnLnRoZW1lID09PSAnbGlnaHQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1zbGF0ZS0xMDAgYm9yZGVyLXNreS01MDAvNzAgdGV4dC1za3ktNzAwIHNoYWRvdy1sZyBzaGFkb3ctc2t5LTUwMC8xMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLXNsYXRlLTkwMC8zMCBib3JkZXItc2xhdGUtNzAwIHRleHQtc2xhdGUtNTAwIGhvdmVyOmJnLXNsYXRlLTgwMC82MCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dCgnc3dfbGlnaHRfbW9kZScpfVxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICB7LyogQnJpZ2h0bmVzcyBzbGlkZXIg4oCUIG9ubHkgbWVhbmluZ2Z1bCB3aGVuIHRoZW1lID09PSAnZGFyaycgKi99XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NmZy50aGVtZSA9PT0gJ2xpZ2h0JyA/ICdvcGFjaXR5LTQwIHBvaW50ZXItZXZlbnRzLW5vbmUnIDogJyd9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBtYi0xXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJvbGQgdGV4dC1zbGF0ZS01MDBcIj57dCgnc3dfZGltX2JyaWdodG5lc3MnKX08L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1tb25vIHRleHQteWVsbG93LTMwMCB0YWJ1bGFyLW51bXNcIj57TWF0aC5yb3VuZCgoY2ZnLmRhcmtMZXZlbCB8fCAyLjApICogMTAwKX0lPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cInBzeS1jZmctZGFyay1sZXZlbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBtaW49XCIxLjVcIiBtYXg9XCIyLjhcIiBzdGVwPVwiMC4wMlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Y2ZnLnRoZW1lID09PSAnbGlnaHQnID8gMi4wIDogKGNmZy5kYXJrTGV2ZWwgfHwgMi4wKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0Q2ZnKGMgPT4gKHsuLi5jLCBkYXJrTGV2ZWw6IHBhcnNlRmxvYXQoZS50YXJnZXQudmFsdWUpLCB0aGVtZTonZGFyayd9KSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyYW5nZS1pbnB1dCB3LWZ1bGxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgYWNjZW50Q29sb3I6JyNmYWNjMTUnIH19Lz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0yIGl0YWxpY1wiPlxuICAgICAgICAgICAgICAgICAgICBBcHBsaWVkIHRvIHRoZSB3aG9sZSBkYXNoYm9hcmQuICBEaW0gaXMgcmVjb21tZW5kZWQgZm9yIGNvbnRyb2wgcm9vbXM7IExpZ2h0IGZvciBkYXl0aW1lIHdhbGstdGhyb3VnaHMuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBHaXZvbmkgdG9nZ2xlICovfVxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj57dCgnc3dfZ2l2b25pX2VuZ2luZScpfTwvZGl2PlxuICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gdXBkYXRlKCdnaXZvbmknLCAhY2ZnLmdpdm9uaSl9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B3LWZ1bGwgcHktMyByb3VuZGVkLXhsIHRleHQtc20gZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IHRyYW5zaXRpb24tYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2NmZy5naXZvbmlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1pbmRpZ28tNjAwIHRleHQtd2hpdGUgc2hhZG93LWxnIHNoYWRvdy1pbmRpZ28tNTAwLzMwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLXNsYXRlLTgwMCB0ZXh0LXNsYXRlLTQwMCBib3JkZXIgYm9yZGVyLXNsYXRlLTcwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgIHtjZmcuZ2l2b25pID8gdCgnc3dfZ2l2b25pX29uJykgOiB0KCdzd19naXZvbmlfb2ZmJyl9XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbXQtMiBsZWFkaW5nLXJlbGF4ZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgT3ZlcmxheXMgdGhlIDQgY2xpbWF0ZS1zdHJhdGVneSByZWdpb25zIChDb21mb3J0LCBOYXQgVmVudCwgRXZhcCwgTWVjaCBDb29sKS5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIFJIIHJhbmdlICovfVxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj57dCgnc3dfcmhfc3dlZXRfc3BvdCcpfTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItM1wiPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJvbGQgdGV4dC1zbGF0ZS01MDAgbWItMSBibG9ja1wiPnt0KCdzd192ZW51ZV9wcmVzZXQnKX08L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0IGN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Y2ZnLnJoUHJlc2V0IHx8ICdjdXN0b20nfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwID0gUkhfUFJFU0VUUy5maW5kKHAgPT4gcC5pZCA9PT0gZS50YXJnZXQudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXApIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHAuaWQgPT09ICdjdXN0b20nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGUoJ3JoUHJlc2V0JywgJ2N1c3RvbScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCByaFByZXNldDpwLmlkLCByaExvOnAubG8sIHJoSGk6cC5oaX0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAge1JIX1BSRVNFVFMubWFwKHAgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtwLmlkfSB2YWx1ZT17cC5pZH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtwLmxhYmVsfXtwLmxvICE9IG51bGwgPyBgICDCtyAgJHtwLmxvfS0ke3AuaGl9JSBSSGAgOiAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICAgICAgeygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwID0gUkhfUFJFU0VUUy5maW5kKHggPT4geC5pZCA9PT0gKGNmZy5yaFByZXNldCB8fCAnY3VzdG9tJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHAgJiYgcC5ub3RlID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTEuNSBpdGFsaWNcIj57cC5ub3RlfTwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgICkgOiBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9KSgpfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTMgbWItMlwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtbW9ubyB0ZXh0LXNsYXRlLTQwMCB3LTEwXCI+e2NmZy5yaExvfSU8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49XCIyMFwiIG1heD17Y2ZnLnJoSGktNX0gdmFsdWU9e2NmZy5yaExvfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRDZmcoYyA9PiAoey4uLmMsIHJoTG86K2UudGFyZ2V0LnZhbHVlLCByaFByZXNldDonY3VzdG9tJ30pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLWlucHV0IGZsZXgtMVwiLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1tb25vIHRleHQtc2xhdGUtNDAwIHctMTBcIj57Y2ZnLnJoSGl9JTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj17Y2ZnLnJoTG8rNX0gbWF4PVwiOTBcIiB2YWx1ZT17Y2ZnLnJoSGl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldENmZyhjID0+ICh7Li4uYywgcmhIaTorZS50YXJnZXQudmFsdWUsIHJoUHJlc2V0OidjdXN0b20nfSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2UtaW5wdXQgZmxleC0xXCIvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBBeGlzIHJhbmdlICovfVxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj57dCgnc3dfdGVtcF9heGlzX3JhbmdlJyl9PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMyBtYi0yXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1tb25vIHRleHQtc2xhdGUtNDAwIHctMTBcIj57Y2ZnLnRMb33CsDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj1cIi00MFwiIG1heD17Y2ZnLnRIaS0xMH0gdmFsdWU9e2NmZy50TG99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZSgndExvJywgK2UudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJhbmdlLWlucHV0IGZsZXgtMVwiLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1tb25vIHRleHQtc2xhdGUtNDAwIHctMTBcIj57Y2ZnLnRIaX3CsDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj17Y2ZnLnRMbysxMH0gbWF4PVwiNjBcIiB2YWx1ZT17Y2ZnLnRIaX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlKCd0SGknLCArZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmFuZ2UtaW5wdXQgZmxleC0xXCIvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTIgbGVhZGluZy1yZWxheGVkXCI+XG4gICAgICAgICAgICAgICAgICAgIENoYXJ0IHdpbGwgYmUgcmVkcmF3biB3aXRoIHRoaXMgZHJ5LWJ1bGIgdGVtcGVyYXR1cmUgd2luZG93LlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvcmRlci10IGJvcmRlci1zbGF0ZS04MDAgcHQtNFwiPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgICAgICBDaGFuZ2VzIHByZXZpZXcgbGl2ZSBpbiB0aGUgc2tlbGV0b24gY2hhcnQgb24gdGhlIGxlZnQuICBIaXRcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1pbmRpZ28tNDAwIGZvbnQtYmxhY2tcIj4gU2F2ZSAmIHJldHVybiA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIGluIHRoZSBoZWFkZXIgd2hlbiB5b3UncmUgaGFwcHkuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIExvY2F0aW9uIFNldHRpbmcgLS0gbW9kYWwgdy8gaW50ZXJhY3RpdmUgTGVhZmxldCBtYXAgKyByZXZlcnNlIGdlb2NvZGluZ1xuICogQ2xpY2sgYW55d2hlcmUgb24gdGhlIG1hcCAob3IgZHJhZyB0aGUgbWFya2VyKSB0byBzZXQgbGF0L2xvbi5cbiAqIE1hbnVhbCBsYXQvbG9uIGVkaXRzIHJlLWNlbnRyZSB0aGUgbWFya2VyLiAgQ2l0eSBuYW1lIGlzIGF1dG8tcG9wdWxhdGVkXG4gKiB2aWEgT3BlblN0cmVldE1hcCBOb21pbmF0aW0gKG5vIGtleSByZXF1aXJlZCwgcmF0ZS1saW1pdGVkIHRvIH4xIHJlcS9zKS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyogRGUtZHVwICsgc2FuaXR5LWNoZWNrIGEgcmF3IHNhdmVkLWxvY2F0aW9ucyBhcnJheSAoZnJvbSBzZXJ2ZXIgb3JcbiAqIGxvY2FsU3RvcmFnZSkuICBEZWR1cCBrZXkgaXMgYGxhdC50b0ZpeGVkKDQpLGxvbi50b0ZpeGVkKDQpYCAtLSB0aGVcbiAqIFNBTUUga2V5IHRoZSBkYXNoYm9hcmQncyB3ZWF0aGVyLXNldHRpbmdzLW1vZGFsLmpzIHVzZXMgLS0gc28gdGhlXG4gKiBTZXR1cCBXYWxrIGRyb3Bkb3duIHNob3dzIHRoZSBleGFjdCBzYW1lIHNldCB0aGUgb3BlcmF0b3Igc2VlcyBpblxuICogdGhlIGRhc2hib2FyZCdzIDNELVd4IFdlYXRoZXIgYnV0dG9uLiAgVHdvIGVudHJpZXMgdGhhdCBzaGFyZSBhIG5hbWVcbiAqIChlLmcuIFwiSE9NRVwiIGF0IHRoZSBvZmZpY2UgYW5kIFwiSE9NRVwiIGF0IHRoZSBhcGFydG1lbnQpIGJ1dCBoYXZlXG4gKiBkaWZmZXJlbnQgY29vcmRpbmF0ZXMgYXJlIEJPVEgga2VwdDsgb25seSB0cnVlIGNvb3JkIGR1cGxpY2F0ZXMgYXJlXG4gKiBjb2xsYXBzZWQuICBEcm9wcyBlbnRyaWVzIG1pc3NpbmcgYSBuYW1lIG9yIHdpdGggbm9uLWZpbml0ZSBsYXQvbG9uLiAqL1xuZnVuY3Rpb24gX25vcm1hbGl6ZUxvY3MoYXJyKSB7XG4gICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQoKTtcbiAgICBjb25zdCBvdXQgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGwgb2YgKGFyciB8fCBbXSkpIHtcbiAgICAgICAgaWYgKCFsIHx8IHR5cGVvZiBsLm5hbWUgIT09ICdzdHJpbmcnKSBjb250aW51ZTtcbiAgICAgICAgY29uc3QgbGF0ID0gK2wubGF0LCBsb24gPSArbC5sb247XG4gICAgICAgIGlmICghTnVtYmVyLmlzRmluaXRlKGxhdCkgfHwgIU51bWJlci5pc0Zpbml0ZShsb24pKSBjb250aW51ZTtcbiAgICAgICAgY29uc3QgbmFtZSA9IGwubmFtZS50cmltKCk7XG4gICAgICAgIGlmICghbmFtZSkgY29udGludWU7XG4gICAgICAgIGNvbnN0IGtleSA9IGxhdC50b0ZpeGVkKDQpICsgJywnICsgbG9uLnRvRml4ZWQoNCk7XG4gICAgICAgIGlmIChzZWVuLmhhcyhrZXkpKSBjb250aW51ZTtcbiAgICAgICAgc2Vlbi5hZGQoa2V5KTtcbiAgICAgICAgY29uc3QgZWxldiA9IGwuZWxldmF0aW9uX20gIT0gbnVsbCA/IGwuZWxldmF0aW9uX20gOiBsLmFzbDtcbiAgICAgICAgY29uc3Qgcm93ID0geyBuYW1lLCBsYXQsIGxvbiB9O1xuICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKE51bWJlcihlbGV2KSkpIHJvdy5lbGV2YXRpb25fbSA9IE51bWJlcihlbGV2KTtcbiAgICAgICAgb3V0LnB1c2gocm93KTtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gbG9va3VwRWxldmF0aW9uTShsYXQsIGxuZykge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHVybCA9ICdodHRwczovL2FwaS5vcGVuLW1ldGVvLmNvbS92MS9lbGV2YXRpb24/bGF0aXR1ZGU9J1xuICAgICAgICAgICAgKyBlbmNvZGVVUklDb21wb25lbnQobGF0KSArICcmbG9uZ2l0dWRlPScgKyBlbmNvZGVVUklDb21wb25lbnQobG5nKTtcbiAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwgeyBoZWFkZXJzOiB7IEFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24nIH0gfSk7XG4gICAgICAgIGlmICghci5vaykgcmV0dXJuIG51bGw7XG4gICAgICAgIGNvbnN0IGogPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgY29uc3QgZSA9IEFycmF5LmlzQXJyYXkoai5lbGV2YXRpb24pID8gai5lbGV2YXRpb25bMF0gOiBqLmVsZXZhdGlvbjtcbiAgICAgICAgcmV0dXJuIE51bWJlci5pc0Zpbml0ZShOdW1iZXIoZSkpID8gTnVtYmVyKGUpIDogbnVsbDtcbiAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gbG9jRWxldmF0aW9uTShsb2MpIHtcbiAgICBpZiAoIWxvYykgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgZSA9IGxvYy5lbGV2YXRpb25fbSAhPSBudWxsID8gbG9jLmVsZXZhdGlvbl9tIDogbG9jLmFzbDtcbiAgICByZXR1cm4gTnVtYmVyLmlzRmluaXRlKE51bWJlcihlKSkgPyBOdW1iZXIoZSkgOiBudWxsO1xufVxuXG5mdW5jdGlvbiBMb2NhdGlvbk1vZGFsKHsgY2ZnLCBzZXRDZmcsIG9uQ2xvc2UsIG9uU2F2ZSB9KSB7XG4gICAgY29uc3QgbWFwQm94UmVmID0gUmVhY3QudXNlUmVmKG51bGwpO1xuICAgIGNvbnN0IG1hcFJlZiAgICA9IFJlYWN0LnVzZVJlZihudWxsKTtcbiAgICBjb25zdCBtYXJrZXJSZWYgPSBSZWFjdC51c2VSZWYobnVsbCk7XG4gICAgY29uc3QgW2dlb0J1c3ksIHNldEdlb0J1c3ldID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuXG4gICAgLyogLS0tLS0gc2F2ZWQgbG9jYXRpb25zIC0tIG1pcnJvciB3aGF0IHRoZSBEYXNoYm9hcmQncyBXZWF0aGVyIGJ1dHRvbiBzaG93cy5cbiAgICAgKlxuICAgICAqIFRoZSBkYXNoYm9hcmQgcmVhZHMgdGhlbSBmcm9tIGAke0FQSV9VUkx9L2FwaS93ZWF0aGVyLWxvY2F0aW9uYCdzXG4gICAgICogYHNhdmVkYCBhcnJheSBhbmQgbWlycm9ycyB0aGF0IGludG8gbG9jYWxTdG9yYWdlWydzYXZlZFdlYXRoZXJMb2NhdGlvbnMnXVxuICAgICAqIG9uIG1vdW50IChzZWUgcHVibGljL2pzL2Rhc2hib2FyZC9hcHAuanMjaHlkcmF0ZVdlYXRoZXJTdGF0ZSkuICBXZSBkb1xuICAgICAqIHRoZSBTQU1FIHRoaW5nIGhlcmUgc28gdGhlIFNldHVwIFdhbGsncyBTaXRlLW5hbWUgZHJvcGRvd24gc3RheXNcbiAgICAgKiBieXRlLWlkZW50aWNhbCB3aXRoIHRoZSBkYXNoYm9hcmQncyBsb2NhdGlvbiBsaXN0IC0tIGluY2x1ZGluZyB3aGVuIHRoZVxuICAgICAqIG9wZXJhdG9yIHZpc2l0cyBTZXR1cCBXYWxrIEJFRk9SRSBldmVyIG9wZW5pbmcgdGhlIGRhc2hib2FyZCAoZnJlc2hcbiAgICAgKiBkZXZpY2UgY2FzZSB3aGVyZSBsb2NhbFN0b3JhZ2UgaXMgZW1wdHkpLlxuICAgICAqXG4gICAgICogU3RyYXRlZ3k6XG4gICAgICogICAxKSBSZWFkIGxvY2FsU3RvcmFnZSBmaXJzdCAoaW5zdGFudCwgbm8gZmxpY2tlciBpZiBhbHJlYWR5IGh5ZHJhdGVkKS5cbiAgICAgKiAgIDIpIFRoZW4gR0VUIC9hcGkvd2VhdGhlci1sb2NhdGlvbiAoY2Fub25pY2FsLCBjcm9zcy1kZXZpY2Ugc291cmNlKS5cbiAgICAgKiAgIDMpIFdoaWNoZXZlciBpcyBub24tZW1wdHkgd2luczsgc2VydmVyIHdpbnMgdGllcy5cbiAgICAgKlxuICAgICAqIEZyZWUtZm9ybSB0eXBpbmcgaW4gdGhlIGlucHV0IHN0aWxsIHdvcmtzIC0tIHRoZSBkYXRhbGlzdCBpcyBzdWdnZXN0aW9uXG4gICAgICogb25seSwgdGhlIGlucHV0IG5ldmVyIHJlc3RyaWN0cyB0aGUgdmFsdWUuICovXG4gICAgY29uc3QgW3NhdmVkTG9jcywgc2V0U2F2ZWRMb2NzXSA9IFJlYWN0LnVzZVN0YXRlKCgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJhdyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzYXZlZFdlYXRoZXJMb2NhdGlvbnMnKTtcbiAgICAgICAgICAgIGlmICghcmF3KSByZXR1cm4gW107XG4gICAgICAgICAgICBjb25zdCBhcnIgPSBKU09OLnBhcnNlKHJhdyk7XG4gICAgICAgICAgICByZXR1cm4gQXJyYXkuaXNBcnJheShhcnIpID8gX25vcm1hbGl6ZUxvY3MoYXJyKSA6IFtdO1xuICAgICAgICB9IGNhdGNoIChlKSB7IHJldHVybiBbXTsgfVxuICAgIH0pO1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGxldCBjYW5jZWxsZWQgPSBmYWxzZTtcbiAgICAgICAgKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKCcvYXBpL3dlYXRoZXItbG9jYXRpb24nLCB7IGNyZWRlbnRpYWxzOidpbmNsdWRlJywgY2FjaGU6J25vLXN0b3JlJyB9KTtcbiAgICAgICAgICAgICAgICBpZiAoIXIub2spIHJldHVybjtcbiAgICAgICAgICAgICAgICBjb25zdCBqID0gYXdhaXQgci5qc29uKCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2F2ZWQgPSBfbm9ybWFsaXplTG9jcyhBcnJheS5pc0FycmF5KGouc2F2ZWQpID8gai5zYXZlZCA6IFtdKTtcbiAgICAgICAgICAgICAgICBpZiAoY2FuY2VsbGVkKSByZXR1cm47XG4gICAgICAgICAgICAgICAgaWYgKHNhdmVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0U2F2ZWRMb2NzKHNhdmVkKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gTWlycm9yIHRvIGxvY2FsU3RvcmFnZSBzbyB0aGUgZGFzaGJvYXJkIHNlZXMgdGhlIHNhbWUgbGlzdFxuICAgICAgICAgICAgICAgICAgICAvLyBldmVuIGlmIGl0cyBvd24gaHlkcmF0ZSBoYXNuJ3QgcnVuIHlldCB0aGlzIHNlc3Npb24uXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzYXZlZFdlYXRoZXJMb2NhdGlvbnMnLCBKU09OLnN0cmluZ2lmeShzYXZlZCkpOyB9IGNhdGNoIChlKSB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBmYWNpbmcgPSBqLmJ1aWxkaW5nX2ZhY2luZztcbiAgICAgICAgICAgICAgICBpZiAoZmFjaW5nICYmIFsnYXV0bycsJ04nLCdORScsJ0UnLCdTRScsJ1MnLCdTVycsJ1cnLCdOVyddLmluZGV4T2YoZmFjaW5nKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldENmZyhjID0+ICh7IC4uLmMsIGJ1aWxkaW5nRmFjaW5nOiBmYWNpbmcgfSkpO1xuICAgICAgICAgICAgICAgICAgICB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS5idWlsZGluZ19mYWNpbmcnLCBmYWNpbmcpOyB9IGNhdGNoIChlKSB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBhY3RpdmUgPSAoai5hY3RpdmUgJiYgdHlwZW9mIGouYWN0aXZlLmxhdCA9PT0gJ251bWJlcicpID8gai5hY3RpdmVcbiAgICAgICAgICAgICAgICAgICAgOiAoai5kZWZhdWx0ICYmIHR5cGVvZiBqLmRlZmF1bHQubGF0ID09PSAnbnVtYmVyJyA/IGouZGVmYXVsdCA6IG51bGwpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGVsZXYgPSBsb2NFbGV2YXRpb25NKGFjdGl2ZSk7XG4gICAgICAgICAgICAgICAgaWYgKGVsZXYgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBzZXRDZmcoYyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoYy5sYXQgLSBhY3RpdmUubGF0KSA+IDFlLTMgfHwgTWF0aC5hYnMoYy5sb24gLSBhY3RpdmUubG9uKSA+IDFlLTMpIHJldHVybiBjO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGMuZWxldmF0aW9uX20gIT09ICcnICYmIGMuZWxldmF0aW9uX20gIT0gbnVsbCAmJiBOdW1iZXIuaXNGaW5pdGUoTnVtYmVyKGMuZWxldmF0aW9uX20pKSkgcmV0dXJuIGM7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyAuLi5jLCBlbGV2YXRpb25fbTogTWF0aC5yb3VuZChlbGV2KSB9O1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7IC8qIG9mZmxpbmUgLT4gbG9jYWxTdG9yYWdlIHZhbHVlIGFscmVhZHkgaW4gc3RhdGUgKi8gfVxuICAgICAgICB9KSgpO1xuICAgICAgICByZXR1cm4gKCkgPT4geyBjYW5jZWxsZWQgPSB0cnVlOyB9O1xuICAgIH0sIFtdKTtcblxuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGxhdCA9IE51bWJlcihjZmcubGF0KSwgbG9uID0gTnVtYmVyKGNmZy5sb24pO1xuICAgICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShsYXQpIHx8ICFOdW1iZXIuaXNGaW5pdGUobG9uKSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3QgbWlzc2luZyA9IGNmZy5lbGV2YXRpb25fbSA9PT0gJycgfHwgY2ZnLmVsZXZhdGlvbl9tID09IG51bGwgfHwgIU51bWJlci5pc0Zpbml0ZShOdW1iZXIoY2ZnLmVsZXZhdGlvbl9tKSk7XG4gICAgICAgIGlmICghbWlzc2luZykgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgbGV0IGNhbmNlbGxlZCA9IGZhbHNlO1xuICAgICAgICBjb25zdCB0ID0gc2V0VGltZW91dChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbGV2ID0gYXdhaXQgbG9va3VwRWxldmF0aW9uTShsYXQsIGxvbik7XG4gICAgICAgICAgICBpZiAoY2FuY2VsbGVkIHx8IGVsZXYgPT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICAgICAgc2V0Q2ZnKGMgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChOdW1iZXIoYy5sYXQpICE9PSBsYXQgfHwgTnVtYmVyKGMubG9uKSAhPT0gbG9uKSByZXR1cm4gYztcbiAgICAgICAgICAgICAgICBjb25zdCBzdGlsbE1pc3NpbmcgPSBjLmVsZXZhdGlvbl9tID09PSAnJyB8fCBjLmVsZXZhdGlvbl9tID09IG51bGwgfHwgIU51bWJlci5pc0Zpbml0ZShOdW1iZXIoYy5lbGV2YXRpb25fbSkpO1xuICAgICAgICAgICAgICAgIGlmICghc3RpbGxNaXNzaW5nKSByZXR1cm4gYztcbiAgICAgICAgICAgICAgICByZXR1cm4geyAuLi5jLCBlbGV2YXRpb25fbTogTWF0aC5yb3VuZChlbGV2KSB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIDQwMCk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7IGNhbmNlbGxlZCA9IHRydWU7IGNsZWFyVGltZW91dCh0KTsgfTtcbiAgICB9LCBbY2ZnLmxhdCwgY2ZnLmxvbl0pO1xuXG4gICAgLyogLS0tLS0gc2F2ZWQtbG9jYXRpb25zIGRyb3Bkb3duIG9wZW4vY2xvc2Ugc3RhdGUuXG4gICAgICogTmF0aXZlIDxkYXRhbGlzdD4gaGlkZXMgaXRzIGNoZXZyb24gaW4gbW9zdCBicm93c2VycyAoZXNwZWNpYWxseSBpblxuICAgICAqIGEgZGFyayB0aGVtZSksIHdoaWNoIG1hZGUgdGhlIFwiZHJvcCBkb3duXCIgaW52aXNpYmxlIHRvIG9wZXJhdG9yc1xuICAgICAqIHdobyBjbGVhcmx5IGhhZCBtdWx0aXBsZSBzYXZlZCBsb2NhdGlvbnMuICBSZXBsYWNlZCB3aXRoIGEgY3VzdG9tXG4gICAgICogcG9wZG93biBwYW5lbCB0aGF0IGhhcyBhbiBBTFdBWVMtVklTSUJMRSBjaGV2cm9uIGJ1dHRvbiAtLSBjbGljayBpdFxuICAgICAqIHRvIHRvZ2dsZSwgY2xpY2sgb3V0c2lkZSB0byBkaXNtaXNzLiAqL1xuICAgIGNvbnN0IFtzYXZlZE9wZW4sIHNldFNhdmVkT3Blbl0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3Qgc2F2ZWRSZWYgPSBSZWFjdC51c2VSZWYobnVsbCk7XG4gICAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKCFzYXZlZE9wZW4pIHJldHVybjtcbiAgICAgICAgY29uc3Qgb25Eb2NDbGljayA9IChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoc2F2ZWRSZWYuY3VycmVudCAmJiAhc2F2ZWRSZWYuY3VycmVudC5jb250YWlucyhlLnRhcmdldCkpIHNldFNhdmVkT3BlbihmYWxzZSk7XG4gICAgICAgIH07XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uRG9jQ2xpY2spO1xuICAgICAgICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Eb2NDbGljayk7XG4gICAgfSwgW3NhdmVkT3Blbl0pO1xuXG4gICAgLyogV2hlbiB0aGUgdXNlciBwaWNrcyBhIG5hbWUgZnJvbSB0aGUgZHJvcGRvd24gT1IgdHlwZXMgb25lIHRoYXRcbiAgICAgKiBleGFjdGx5IG1hdGNoZXMgYSBzYXZlZCBlbnRyeSwgcHVsbCBpdHMgbGF0L2xvbiBhbmQgcmVjZW50cmUgdGhlXG4gICAgICogbWFwLiAgRnJlZS1mb3JtIHR5cGluZyBzdGlsbCB3b3JrcyAtLSB0aGUgbmFtZSBpcyBqdXN0IGtlcHQgYXMgdGhlXG4gICAgICogc2l0ZSBsYWJlbC4gIEF2b2lkcyBzdXJwcmlzaW5nIHRoZSBvcGVyYXRvciB3aG8gdHlwZXMgXCJQYXZpbGlvbiBCXCJcbiAgICAgKiAoYSBsYWJlbCB0aGV5IGludmVudGVkKSBhbmQgZXhwZWN0cyB0aGUgbWFwIE5PVCB0byBqdW1wLiAqL1xuICAgIGNvbnN0IG9uU2l0ZU5hbWVDaGFuZ2UgPSAobmV3TmFtZSkgPT4ge1xuICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIHNpdGVOYW1lOm5ld05hbWV9KSk7XG4gICAgICAgIGNvbnN0IGhpdCA9IHNhdmVkTG9jcy5maW5kKHMgPT4gcy5uYW1lID09PSBuZXdOYW1lKTtcbiAgICAgICAgaWYgKGhpdCkge1xuICAgICAgICAgICAgY29uc3QgbGF0ID0gTWF0aC5yb3VuZChoaXQubGF0ICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgICAgICBjb25zdCBsb24gPSBNYXRoLnJvdW5kKGhpdC5sb24gKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgICAgIGNvbnN0IGVsZXYgPSBsb2NFbGV2YXRpb25NKGhpdCk7XG4gICAgICAgICAgICBzZXRDZmcoYyA9PiAoe1xuICAgICAgICAgICAgICAgIC4uLmMsIHNpdGVOYW1lOm5ld05hbWUsIGxhdCwgbG9uLCBjaXR5Om5ld05hbWUsXG4gICAgICAgICAgICAgICAgZWxldmF0aW9uX206IGVsZXYgIT0gbnVsbCA/IE1hdGgucm91bmQoZWxldikgOiAnJyxcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIGlmIChtYXBSZWYuY3VycmVudCkgbWFwUmVmLmN1cnJlbnQuc2V0VmlldyhbbGF0LCBsb25dLCAxMSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IHBpY2tTYXZlZExvYyA9IChsb2MpID0+IHtcbiAgICAgICAgc2V0U2F2ZWRPcGVuKGZhbHNlKTtcbiAgICAgICAgb25TaXRlTmFtZUNoYW5nZShsb2MubmFtZSk7XG4gICAgfTtcblxuICAgIC8qIFJlbW92ZSBhIHNhdmVkIGxvY2F0aW9uIGZyb20gdGhlIGxpc3QuICBEZWR1cC1rZXllZCBieSBsYXQvbG9uIHNvIHR3b1xuICAgICAqIGVudHJpZXMgdGhhdCBzaGFyZSBhIG5hbWUgKGUuZy4gXCJIT01FXCIgYXQgdGhlIG9mZmljZSB2cyB0aGUgYXBhcnRtZW50KVxuICAgICAqIGFyZSBhZGRyZXNzZWQgaW5kaXZpZHVhbGx5IC0tIHJlbW92aW5nIG9uZSBrZWVwcyB0aGUgb3RoZXIuICBNaXJyb3JzXG4gICAgICogdGhlIGNoYW5nZSB0byBsb2NhbFN0b3JhZ2UgQU5EIHRoZSBzZXJ2ZXIgc28gdGhlIGRhc2hib2FyZCdzIFdlYXRoZXJcbiAgICAgKiBidXR0b24gc2VlcyB0aGUgZGVsZXRpb24gb24gaXRzIG5leHQgcmVhZC4gKi9cbiAgICBjb25zdCByZW1vdmVTYXZlZExvYyA9IChsb2MpID0+IHtcbiAgICAgICAgY29uc3Qga2V5ID0gbG9jLmxhdC50b0ZpeGVkKDQpICsgJywnICsgbG9jLmxvbi50b0ZpeGVkKDQpO1xuICAgICAgICBjb25zdCBuZXh0ID0gc2F2ZWRMb2NzLmZpbHRlcihzID0+IChzLmxhdC50b0ZpeGVkKDQpICsgJywnICsgcy5sb24udG9GaXhlZCg0KSkgIT09IGtleSk7XG4gICAgICAgIHNldFNhdmVkTG9jcyhuZXh0KTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzYXZlZFdlYXRoZXJMb2NhdGlvbnMnLCBKU09OLnN0cmluZ2lmeShuZXh0KSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgLyogcHJpdmF0ZSBtb2RlICovIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncmVkNTp3ZWF0aGVyTG9jYXRpb25DaGFuZ2VkJyxcbiAgICAgICAgICAgICAgICB7IGRldGFpbDogeyBzYXZlZDogbmV4dCB9IH0pKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgICAgLyogQmVzdC1lZmZvcnQgc2VydmVyIHN5bmMuICBBbm9ueW1vdXMgdXNlcnMgZ2V0IHBlcnNpc3RlZDpmYWxzZSBiYWNrLFxuICAgICAgICAgKiB3aGljaCBpcyBmaW5lIC0tIHRoZSBsb2NhbCBjb3B5IGFscmVhZHkgcmVmbGVjdHMgdGhlIHJlbW92YWwuICovXG4gICAgICAgIGZldGNoKCcvYXBpL3dlYXRoZXItbG9jYXRpb24nLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXG4gICAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOidhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBzYXZlZDogbmV4dCB9KSxcbiAgICAgICAgfSkuY2F0Y2goKCkgPT4geyAvKiBvZmZsaW5lIC0tIGxvY2FsU3RvcmFnZSBhbHJlYWR5IHVwZGF0ZWQgKi8gfSk7XG4gICAgICAgIC8qIElmIHRoZSBvcGVyYXRvciBqdXN0IGRlbGV0ZWQgdGhlIGVudHJ5IGN1cnJlbnRseSBpbiB0aGUgaW5wdXQsXG4gICAgICAgICAqIGJsYW5rIHRoZSBpbnB1dCBzbyBhIHN0YWxlIHNlbGVjdGlvbiBpc24ndCBhY2NpZGVudGFsbHkgc2F2ZWQuICovXG4gICAgICAgIGlmICgoY2ZnLnNpdGVOYW1lIHx8ICcnKS50cmltKCkgPT09IGxvYy5uYW1lKSB7XG4gICAgICAgICAgICBzZXRDZmcoYyA9PiAoey4uLmMsIHNpdGVOYW1lOicnfSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuZXh0Lmxlbmd0aCA9PT0gMCkgc2V0U2F2ZWRPcGVuKGZhbHNlKTtcbiAgICB9O1xuXG4gICAgLyogSW5saW5lIHJlbmFtZTogdHlwaW5nIGludG8gYSByb3cncyBuYW1lIGlucHV0IHVwZGF0ZXMgdGhlIGluLW1lbW9yeVxuICAgICAqIGBzYXZlZExvY3NgIGxpc3QgKE5PVCBwZXJzaXN0ZWQgdW50aWwgXCJTYXZlICYgUmV0dXJuXCIpLiAgS2V5ZWQgYnkgdGhlXG4gICAgICogcm93J3MgbGF0L2xvbiBzbyB0d28gc2FtZS1uYW1lZCBlbnRyaWVzIGF0IGRpZmZlcmVudCBjb29yZGluYXRlcyBjYW5cbiAgICAgKiBiZSByZW5hbWVkIGluZGVwZW5kZW50bHkuICBUcmltIGlzIGRlbGF5ZWQgdW50aWwgcGVyc2lzdCBzbyB0aGVcbiAgICAgKiBvcGVyYXRvciBjYW4ga2VlcCB0eXBpbmcgd2l0aG91dCB0aGUgZmllbGQgXCJzbmFwcGluZ1wiIG1pZC1lZGl0LiAqL1xuICAgIGNvbnN0IHJlbmFtZVNhdmVkTG9jID0gKG9yaWdMb2MsIG5ld05hbWUpID0+IHtcbiAgICAgICAgY29uc3Qga2V5ID0gb3JpZ0xvYy5sYXQudG9GaXhlZCg0KSArICcsJyArIG9yaWdMb2MubG9uLnRvRml4ZWQoNCk7XG4gICAgICAgIHNldFNhdmVkTG9jcyhwcmV2ID0+IHByZXYubWFwKHMgPT5cbiAgICAgICAgICAgIChzLmxhdC50b0ZpeGVkKDQpICsgJywnICsgcy5sb24udG9GaXhlZCg0KSkgPT09IGtleVxuICAgICAgICAgICAgICAgID8geyAuLi5zLCBuYW1lOiBuZXdOYW1lIH1cbiAgICAgICAgICAgICAgICA6IHNcbiAgICAgICAgKSk7XG4gICAgICAgIC8qIElmIHRoZSBvcGVyYXRvciBpcyByZW5hbWluZyB0aGUgZW50cnkgdGhhdCBpcyBjdXJyZW50bHkgdGhlXG4gICAgICAgICAqIFwiYWN0aXZlXCIgcGljayAoc2l0ZU5hbWUgbWF0Y2hlcyksIGtlZXAgdGhlIHBpY2tlciBpbiBzeW5jLiAqL1xuICAgICAgICBjb25zdCBzdGlsbFNlbGVjdGVkID0gKGNmZy5zaXRlTmFtZSB8fCAnJykudHJpbSgpID09PSBvcmlnTG9jLm5hbWVcbiAgICAgICAgICAgICYmIE1hdGguYWJzKGNmZy5sYXQgLSBvcmlnTG9jLmxhdCkgPCAxZS00XG4gICAgICAgICAgICAmJiBNYXRoLmFicyhjZmcubG9uIC0gb3JpZ0xvYy5sb24pIDwgMWUtNDtcbiAgICAgICAgaWYgKHN0aWxsU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgc2l0ZU5hbWU6bmV3TmFtZSwgY2l0eTpuZXdOYW1lfSkpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qIC0tLS0tIHNlYXJjaCBzdGF0ZSAtLS0tLSAqL1xuICAgIGNvbnN0IFtzZWFyY2hRLCBzZXRTZWFyY2hRXSAgICAgICAgID0gUmVhY3QudXNlU3RhdGUoJycpO1xuICAgIGNvbnN0IFtzZWFyY2hIaXRzLCBzZXRTZWFyY2hIaXRzXSAgID0gUmVhY3QudXNlU3RhdGUoW10pO1xuICAgIGNvbnN0IFtzZWFyY2hCdXN5LCBzZXRTZWFyY2hCdXN5XSAgID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IFtzZWFyY2hPcGVuLCBzZXRTZWFyY2hPcGVuXSAgID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IHNlYXJjaERlYm91bmNlUmVmICAgICAgICAgICAgID0gUmVhY3QudXNlUmVmKG51bGwpO1xuXG4gICAgLyogRm9yd2FyZC1nZW9jb2RlOiBxdWVyeSAtPiBbe2xhdCwgbG9uLCBkaXNwbGF5X25hbWUsIHR5cGUsIC4uLn1dICovXG4gICAgY29uc3QgcnVuU2VhcmNoID0gYXN5bmMgKHEpID0+IHtcbiAgICAgICAgaWYgKCFxIHx8IHEudHJpbSgpLmxlbmd0aCA8IDMpIHsgc2V0U2VhcmNoSGl0cyhbXSk7IHJldHVybjsgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2V0U2VhcmNoQnVzeSh0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGBodHRwczovL25vbWluYXRpbS5vcGVuc3RyZWV0bWFwLm9yZy9zZWFyY2g/Zm9ybWF0PWpzb24mbGltaXQ9NiZxPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHEpfWA7XG4gICAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2godXJsLCB7IGhlYWRlcnM6eyAnQWNjZXB0JzonYXBwbGljYXRpb24vanNvbicgfSB9KTtcbiAgICAgICAgICAgIGNvbnN0IGogPSBhd2FpdCByLmpzb24oKTtcbiAgICAgICAgICAgIHNldFNlYXJjaEhpdHMoQXJyYXkuaXNBcnJheShqKSA/IGogOiBbXSk7XG4gICAgICAgICAgICBzZXRTZWFyY2hPcGVuKHRydWUpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IHNldFNlYXJjaEhpdHMoW10pOyB9XG4gICAgICAgIGZpbmFsbHkgeyBzZXRTZWFyY2hCdXN5KGZhbHNlKTsgfVxuICAgIH07XG5cbiAgICAvKiBkZWJvdW5jZWQgc2VhcmNoLW9uLXR5cGUgKi9cbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoc2VhcmNoRGVib3VuY2VSZWYuY3VycmVudCkgY2xlYXJUaW1lb3V0KHNlYXJjaERlYm91bmNlUmVmLmN1cnJlbnQpO1xuICAgICAgICBzZWFyY2hEZWJvdW5jZVJlZi5jdXJyZW50ID0gc2V0VGltZW91dCgoKSA9PiBydW5TZWFyY2goc2VhcmNoUSksIDQwMCk7XG4gICAgICAgIHJldHVybiAoKSA9PiBzZWFyY2hEZWJvdW5jZVJlZi5jdXJyZW50ICYmIGNsZWFyVGltZW91dChzZWFyY2hEZWJvdW5jZVJlZi5jdXJyZW50KTtcbiAgICB9LCBbc2VhcmNoUV0pO1xuXG4gICAgY29uc3QgcGlja1NlYXJjaEhpdCA9IChoaXQpID0+IHtcbiAgICAgICAgY29uc3QgbGF0ID0gTWF0aC5yb3VuZCgraGl0LmxhdCAqIDEwMDAwKSAvIDEwMDAwO1xuICAgICAgICBjb25zdCBsb24gPSBNYXRoLnJvdW5kKCtoaXQubG9uICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgbGF0LCBsb24sIGNpdHk6aGl0LmRpc3BsYXlfbmFtZSwgZWxldmF0aW9uX206ICcnfSkpO1xuICAgICAgICBpZiAobWFwUmVmLmN1cnJlbnQpIG1hcFJlZi5jdXJyZW50LnNldFZpZXcoW2xhdCwgbG9uXSwgaGl0LnR5cGUgPT09ICdjaXR5JyA/IDExIDogMTUpO1xuICAgICAgICBzZXRTZWFyY2hPcGVuKGZhbHNlKTtcbiAgICAgICAgc2V0U2VhcmNoUSgnJyk7XG4gICAgfTtcblxuICAgIC8qIFJldmVyc2UtZ2VvY29kZSBsYXQvbG9uIC0+IGNpdHkgLyBjb3VudHJ5IHZpYSBOb21pbmF0aW0uICBObyBBUEkga2V5LiAqL1xuICAgIGNvbnN0IHJldmVyc2VHZW9jb2RlID0gYXN5bmMgKGxhdCwgbG9uKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzZXRHZW9CdXN5KHRydWUpO1xuICAgICAgICAgICAgY29uc3QgdXJsID0gYGh0dHBzOi8vbm9taW5hdGltLm9wZW5zdHJlZXRtYXAub3JnL3JldmVyc2U/Zm9ybWF0PWpzb24mbGF0PSR7bGF0fSZsb249JHtsb259Jnpvb209MTBgO1xuICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGZldGNoKHVybCwgeyBoZWFkZXJzOiB7ICdBY2NlcHQnOidhcHBsaWNhdGlvbi9qc29uJyB9IH0pO1xuICAgICAgICAgICAgY29uc3QgaiA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgICAgICAgY29uc3QgYSA9IGouYWRkcmVzcyB8fCB7fTtcbiAgICAgICAgICAgIGNvbnN0IGNpdHkgPSBhLmNpdHkgfHwgYS50b3duIHx8IGEudmlsbGFnZSB8fCBhLmhhbWxldCB8fCBhLmNvdW50eSB8fCAnJztcbiAgICAgICAgICAgIGNvbnN0IHJlZ2lvbiA9IGEuc3RhdGUgfHwgYS5yZWdpb24gfHwgJyc7XG4gICAgICAgICAgICBjb25zdCBjb3VudHJ5ID0gYS5jb3VudHJ5IHx8ICcnO1xuICAgICAgICAgICAgY29uc3QgbGFiZWwgPSBbY2l0eSwgcmVnaW9uLCBjb3VudHJ5XS5maWx0ZXIoQm9vbGVhbikuam9pbignLCAnKSB8fCBqLmRpc3BsYXlfbmFtZSB8fCAnJztcbiAgICAgICAgICAgIGlmIChsYWJlbCkgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBjaXR5OmxhYmVsfSkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IC8qIG9mZmxpbmUgb3IgcmF0ZS1saW1pdGVkIC0+IGtlZXAgcHJpb3IgbmFtZSAqLyB9XG4gICAgICAgIGZpbmFsbHkgeyBzZXRHZW9CdXN5KGZhbHNlKTsgfVxuICAgIH07XG5cbiAgICAvKiBJbml0IExlYWZsZXQgb24gZmlyc3QgcmVuZGVyIG9mIHRoZSBtb2RhbCAqL1xuICAgIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmICghbWFwQm94UmVmLmN1cnJlbnQgfHwgbWFwUmVmLmN1cnJlbnQpIHJldHVybjtcbiAgICAgICAgY29uc3QgbWFwID0gTC5tYXAobWFwQm94UmVmLmN1cnJlbnQsIHsgem9vbUNvbnRyb2w6IHRydWUsIGF0dHJpYnV0aW9uQ29udHJvbDogdHJ1ZSB9KVxuICAgICAgICAgICAgICAgICAgICAgLnNldFZpZXcoW2NmZy5sYXQsIGNmZy5sb25dLCA2KTtcbiAgICAgICAgTC50aWxlTGF5ZXIoJ2h0dHBzOi8ve3N9LnRpbGUub3BlbnN0cmVldG1hcC5vcmcve3p9L3t4fS97eX0ucG5nJywge1xuICAgICAgICAgICAgbWF4Wm9vbTogMTgsXG4gICAgICAgICAgICBhdHRyaWJ1dGlvbjogJyZjb3B5OyBPcGVuU3RyZWV0TWFwIGNvbnRyaWJ1dG9ycycsXG4gICAgICAgIH0pLmFkZFRvKG1hcCk7XG5cbiAgICAgICAgY29uc3QgbWFya2VyID0gTC5tYXJrZXIoW2NmZy5sYXQsIGNmZy5sb25dLCB7IGRyYWdnYWJsZTogdHJ1ZSB9KS5hZGRUbyhtYXApO1xuICAgICAgICBtYXJrZXIuYmluZFRvb2x0aXAoJ0RyYWcgbWUgb3IgY2xpY2sgYW55d2hlcmUgb24gdGhlIG1hcCcsIHsgcGVybWFuZW50OiBmYWxzZSB9KTtcblxuICAgICAgICBjb25zdCBhcHBseUxhdExvbiA9IChsYXQsIGxvbikgPT4ge1xuICAgICAgICAgICAgY29uc3QgciA9IChuKSA9PiBNYXRoLnJvdW5kKG4gKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgbGF0OnIobGF0KSwgbG9uOnIobG9uKSwgZWxldmF0aW9uX206ICcnfSkpO1xuICAgICAgICAgICAgcmV2ZXJzZUdlb2NvZGUocihsYXQpLCByKGxvbikpO1xuICAgICAgICB9O1xuICAgICAgICBtYXJrZXIub24oJ2RyYWdlbmQnLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsbCA9IG1hcmtlci5nZXRMYXRMbmcoKTtcbiAgICAgICAgICAgIGFwcGx5TGF0TG9uKGxsLmxhdCwgbGwubG5nKTtcbiAgICAgICAgfSk7XG4gICAgICAgIG1hcC5vbignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgbWFya2VyLnNldExhdExuZyhlLmxhdGxuZyk7XG4gICAgICAgICAgICBhcHBseUxhdExvbihlLmxhdGxuZy5sYXQsIGUubGF0bG5nLmxuZyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1hcFJlZi5jdXJyZW50ID0gbWFwO1xuICAgICAgICBtYXJrZXJSZWYuY3VycmVudCA9IG1hcmtlcjtcblxuICAgICAgICAvKiBMZWFmbGV0IHJlbmRlcnMgYmxhbmsgaWYgaXQgYm9vdHMgaW5zaWRlIGEgaGlkZGVuIGVsZW1lbnQg4oCUIGtpY2sgaXRcbiAgICAgICAgICAgb25jZSB0aGUgbW9kYWwgYW5pbWF0aW9uIHNldHRsZXMuICovXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gbWFwLmludmFsaWRhdGVTaXplKCksIDI1MCk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7IG1hcC5yZW1vdmUoKTsgbWFwUmVmLmN1cnJlbnQgPSBudWxsOyBtYXJrZXJSZWYuY3VycmVudCA9IG51bGw7IH07XG4gICAgfSwgW10pO1xuXG4gICAgLyogS2VlcCBtYXJrZXIgaW4gc3luYyB3aGVuIHVzZXIgZWRpdHMgbGF0L2xvbiBmaWVsZHMgbWFudWFsbHkgKi9cbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAobWFwUmVmLmN1cnJlbnQgJiYgbWFya2VyUmVmLmN1cnJlbnQpIHtcbiAgICAgICAgICAgIG1hcmtlclJlZi5jdXJyZW50LnNldExhdExuZyhbY2ZnLmxhdCwgY2ZnLmxvbl0pO1xuICAgICAgICAgICAgbWFwUmVmLmN1cnJlbnQucGFuVG8oW2NmZy5sYXQsIGNmZy5sb25dKTtcbiAgICAgICAgfVxuICAgIH0sIFtjZmcubGF0LCBjZmcubG9uXSk7XG5cbiAgICAvKiBHZW9sb2NhdGlvbjogc2lsZW50bHkgbm8tb3AnZCBiZWZvcmUgLS0gaWYgdGhlIGJyb3dzZXIgYmxvY2tlZCB0aGVcbiAgICAgKiByZXF1ZXN0IChIVFRQIG9yaWdpbiA9IG5vdCBhIHNlY3VyZSBjb250ZXh0IG9uIGZpZWxkIGNvbnRyb2xsZXJzLCBvclxuICAgICAqIHRoZSB1c2VyIGRlbmllZCBwZXJtaXNzaW9uIGVhcmxpZXIpIHRoZSBidXR0b24ganVzdCBzYXQgdGhlcmUuXG4gICAgICogTm93IHdlIHN1cmZhY2UgYSBzdGF0ZSAoYnVzeSAvIGVycikgc28gdGhlIG9wZXJhdG9yIGNhbiBzZWUgV0hZIGl0XG4gICAgICogZmFpbGVkIGFuZCBhY3Qgb24gaXQgKHN3aXRjaCB0byBIVFRQUywgcmUtcHJvbXB0LCBvciB1c2UgdGhlIG1hcCkuICovXG4gICAgY29uc3QgW2dlb1N0YXRlLCBzZXRHZW9TdGF0ZV0gPSBSZWFjdC51c2VTdGF0ZShudWxsKTsgICAvLyBudWxsIHwgJ2J1c3knIHwge2Vycn1cbiAgICBjb25zdCB1c2VNeUxvY2F0aW9uID0gKCkgPT4ge1xuICAgICAgICBzZXRHZW9TdGF0ZSgnYnVzeScpO1xuICAgICAgICAvLyBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24gaXMgYHVuZGVmaW5lZGAgb24gSFRUUCBvcmlnaW5zIChDaHJvbWUgNTArKS5cbiAgICAgICAgaWYgKCFuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pIHtcbiAgICAgICAgICAgIHNldEdlb1N0YXRlKHsgZXJyOidCcm93c2VyIGJsb2NrZWQgbG9jYXRpb24gYWNjZXNzIOKAlCBvcGVuIHRoaXMgcGFnZSB2aWEgSFRUUFMuJyB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKFxuICAgICAgICAgICAgKHBvcykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhdCA9IE1hdGgucm91bmQocG9zLmNvb3Jkcy5sYXRpdHVkZSAgKiAxMDAwMCkgLyAxMDAwMDtcbiAgICAgICAgICAgICAgICBjb25zdCBsb24gPSBNYXRoLnJvdW5kKHBvcy5jb29yZHMubG9uZ2l0dWRlICogMTAwMDApIC8gMTAwMDA7XG4gICAgICAgICAgICAgICAgc2V0Q2ZnKGMgPT4gKHsuLi5jLCBsYXQsIGxvbiwgZWxldmF0aW9uX206ICcnfSkpO1xuICAgICAgICAgICAgICAgIGlmIChtYXBSZWYuY3VycmVudCkgbWFwUmVmLmN1cnJlbnQuc2V0VmlldyhbbGF0LCBsb25dLCAxMSk7XG4gICAgICAgICAgICAgICAgcmV2ZXJzZUdlb2NvZGUobGF0LCBsb24pO1xuICAgICAgICAgICAgICAgIHNldEdlb1N0YXRlKG51bGwpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBlcnIuY29kZTogMT1QRVJNSVNTSU9OX0RFTklFRCwgMj1QT1NJVElPTl9VTkFWQUlMQUJMRSwgMz1USU1FT1VUXG4gICAgICAgICAgICAgICAgY29uc3QgbXNnID0gZXJyICYmIGVyci5jb2RlID09PSAxXG4gICAgICAgICAgICAgICAgICAgID8gJ0xvY2F0aW9uIHBlcm1pc3Npb24gZGVuaWVkIOKAlCBjbGljayB0aGUgbG9jayBpY29uIGluIHRoZSBhZGRyZXNzIGJhciBhbmQgYWxsb3cgbG9jYXRpb24uJ1xuICAgICAgICAgICAgICAgICAgICA6IGVyciAmJiBlcnIuY29kZSA9PT0gMlxuICAgICAgICAgICAgICAgICAgICAgICAgPyAnTG9jYXRpb24gY3VycmVudGx5IHVuYXZhaWxhYmxlIOKAlCB0aGUgZGV2aWNlIGhhcyBubyBHUFMgLyBXaS1GaSBmaXggeWV0LidcbiAgICAgICAgICAgICAgICAgICAgICAgIDogZXJyICYmIGVyci5jb2RlID09PSAzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnTG9jYXRpb24gcmVxdWVzdCB0aW1lZCBvdXQg4oCUIHRyeSBhZ2Fpbiwgb3IgdXNlIHRoZSBtYXAgLyBzZWFyY2ggYmFyLidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IChlcnIgJiYgZXJyLm1lc3NhZ2UpIHx8ICdDb3VsZCBub3QgcmVhZCBkZXZpY2UgbG9jYXRpb24uJztcbiAgICAgICAgICAgICAgICBzZXRHZW9TdGF0ZSh7IGVycjogbXNnIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgZW5hYmxlSGlnaEFjY3VyYWN5OnRydWUsIHRpbWVvdXQ6MTAwMDAsIG1heGltdW1BZ2U6MCB9XG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIC8qIFdoZW4gdXNlciBjbGlja3MgXCJTYXZlICYgcmV0dXJuXCIsIG1pcnJvciBFWEFDVExZIHdoYXQgdGhlIGRhc2hib2FyZCdzXG4gICAgICogV2VhdGhlciBidXR0b24gZG9lcyBpbiB3ZWF0aGVyLXNldHRpbmdzLW1vZGFsLmpzI3NlbGVjdExvY2F0aW9uOlxuICAgICAqICAgMS4gbG9jYWxTdG9yYWdlWyd3ZWF0aGVyTG9jYXRpb24nXSAgICAgICAgPSBjaG9zZW4gbG9jIChjYW5vbmljYWwga2V5XG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGRhc2hib2FyZCByZWFkcyBvblxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vdW50LCBOT1QgJ3JlZDUud2VhdGhlcl9sb2NhdGlvbicpLlxuICAgICAqICAgMi4gbG9jYWxTdG9yYWdlWydzYXZlZFdlYXRoZXJMb2NhdGlvbnMnXSAgPSBbbG9jLCAuLi5vdGhlcnNdIGRlZHVwZWRcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBieSBsYXQvbG9uLCBjYXBwZWQgYXQgMjAuXG4gICAgICogICAzLiBQT1NUIC9hcGkvd2VhdGhlci1sb2NhdGlvbiB3aXRoIGFjdGl2ZStkZWZhdWx0K3NhdmVkIHNvIHRoZSBzYW1lXG4gICAgICogICAgICBsaXN0IHN1cnZpdmVzIGNyb3NzLWRldmljZSBzZXNzaW9ucyBmb3Igc2lnbmVkLWluIHRlbmFudHMuXG4gICAgICpcbiAgICAgKiBXaXRob3V0IHN0ZXAgMSB0aGUgZGFzaGJvYXJkJ3MgYHdlYXRoZXJMb2NhdGlvbmAgc3RhdGUgc2lsZW50bHkga2VlcHNcbiAgICAgKiBpdHMgb2xkIHZhbHVlIC0tIHdoaWNoIGlzIGV4YWN0bHkgdGhlIGJ1ZyBvcGVyYXRvcnMgcmVwb3J0ZWQgYWZ0ZXJcbiAgICAgKiBwaWNraW5nIGEgbG9jYXRpb24gaW4gU2V0dXAgV2FsayBhbmQgc2VlaW5nIHRoZSBkYXNoYm9hcmQncyB3ZWF0aGVyXG4gICAgICogc3RyaXAgcmVmdXNlIHRvIHVwZGF0ZS4gKi9cbiAgICBjb25zdCBbc2F2ZU1zZywgc2V0U2F2ZU1zZ10gPSBSZWFjdC51c2VTdGF0ZShudWxsKTtcbiAgICBjb25zdCBwZXJzaXN0QW5kU2F2ZSA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgbG9jID0geyBsYXQ6IGNmZy5sYXQsIGxvbjogY2ZnLmxvbiwgbmFtZTogY2ZnLnNpdGVOYW1lIHx8IGNmZy5jaXR5IH07XG4gICAgICAgIGNvbnN0IGVsZXYgPSBOdW1iZXIoY2ZnLmVsZXZhdGlvbl9tKTtcbiAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShlbGV2KSkgbG9jLmVsZXZhdGlvbl9tID0gTWF0aC5yb3VuZChlbGV2KTtcblxuICAgICAgICAvLyBEZS1kdXAgdGhlIGV4aXN0aW5nIHNhdmVkIGxpc3QgYnkgbGF0L2xvbiAoc2FtZSBrZXkgdGhlIGRhc2hib2FyZFxuICAgICAgICAvLyB1c2VzKSBhbmQgcHV0IHRoZSBuZXcgcGljayBhdCB0aGUgdG9wLiAgQ2FwIGF0IDIwIHRvIG1hdGNoIHRoZVxuICAgICAgICAvLyBkYXNoYm9hcmQncyBiZWhhdmlvdXIuXG4gICAgICAgIGNvbnN0IGtleSA9IGxvYy5sYXQudG9GaXhlZCg0KSArICcsJyArIGxvYy5sb24udG9GaXhlZCg0KTtcbiAgICAgICAgY29uc3QgZGVkdXBlZCA9IHNhdmVkTG9jcy5maWx0ZXIobCA9PiAobC5sYXQudG9GaXhlZCg0KSArICcsJyArIGwubG9uLnRvRml4ZWQoNCkpICE9PSBrZXkpO1xuICAgICAgICBjb25zdCBuZXh0U2F2ZWQgPSBbbG9jLCAuLi5kZWR1cGVkXS5zbGljZSgwLCAyMCk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd3ZWF0aGVyTG9jYXRpb24nLCBKU09OLnN0cmluZ2lmeShsb2MpKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzYXZlZFdlYXRoZXJMb2NhdGlvbnMnLCBKU09OLnN0cmluZ2lmeShuZXh0U2F2ZWQpKTtcbiAgICAgICAgICAgIC8vIEtlZXAgdGhlIG9sZCBrZXkgdG9vIC0tIHNvbWUgbGVnYWN5IHBsdWctaW5zIHN0aWxsIGxvb2sgYXQgaXQuXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVkNS53ZWF0aGVyX2xvY2F0aW9uJywgSlNPTi5zdHJpbmdpZnkobG9jKSk7XG4gICAgICAgICAgICBjb25zdCBmYWNpbmcgPSBjZmcuYnVpbGRpbmdGYWNpbmcgfHwgJ2F1dG8nO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlZDUuYnVpbGRpbmdfZmFjaW5nJywgZmFjaW5nKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBwcml2YXRlIG1vZGUgLS0gaWdub3JlICovIH1cblxuICAgICAgICBsZXQgcGVyc2lzdGVkID0gZmFsc2UsIHdhcm5pbmcgPSAnJztcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGZhY2luZyA9IGNmZy5idWlsZGluZ0ZhY2luZyB8fCAnYXV0byc7XG4gICAgICAgICAgICBjb25zdCByID0gYXdhaXQgZmV0Y2goJy9hcGkvd2VhdGhlci1sb2NhdGlvbicsIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICBjcmVkZW50aWFsczogJ2luY2x1ZGUnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6J2FwcGxpY2F0aW9uL2pzb24nIH0sXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBhY3RpdmU6IGxvYywgZGVmYXVsdDogbG9jLCBzYXZlZDogbmV4dFNhdmVkLCBidWlsZGluZ19mYWNpbmc6IGZhY2luZyB9KSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgaiA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgICAgICAgd2luZG93Ll9sYXN0V2VhdGhlckxvY2F0aW9uU2F2ZSA9IGo7XG4gICAgICAgICAgICBwZXJzaXN0ZWQgPSAhIWoucGVyc2lzdGVkO1xuICAgICAgICAgICAgd2FybmluZyAgID0gai53YXJuaW5nIHx8ICcnO1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdbc2V0dXAgd2Fsa10gL2FwaS93ZWF0aGVyLWxvY2F0aW9uIDwtJywgaik7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHdhcm5pbmcgPSAnTmV0d29yayBlcnJvciDigJQgc2F2ZWQgbG9jYWxseSBvbmx5Lic7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1tzZXR1cCB3YWxrXSBjb3VsZCBub3QgcGVyc2lzdCBsb2NhdGlvbjonLCBlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRlbGwgYW55IG9wZW4gZGFzaGJvYXJkIHRhYiB0byByZS1oeWRyYXRlLiAgVGhlIGRhc2hib2FyZFxuICAgICAgICAvLyBhbHJlYWR5IGxpc3RlbnMgZm9yIGBzdG9yYWdlYCBldmVudHMgd2hlbiBhbm90aGVyIHRhYiB3cml0ZXMgdG9cbiAgICAgICAgLy8gbG9jYWxTdG9yYWdlLCBidXQgb24gVjEuOSBzb21lIGJyb3dzZXJzIERPTidUIGZpcmUgYHN0b3JhZ2VgIGZvclxuICAgICAgICAvLyBzYW1lLW9yaWdpbiB3cml0ZXMgZnJvbSB0aGlzIHNhbWUgdGFiLiAgQW4gZXhwbGljaXQgY3VzdG9tIGV2ZW50XG4gICAgICAgIC8vIG1ha2VzIHRoZSBkYXNoYm9hcmQncyBwb2xsaW5nIHBpY2sgdGhlIGNoYW5nZSB1cCBpbW1lZGlhdGVseSBpZlxuICAgICAgICAvLyBpdCdzIGFscmVhZHkgbW91bnRlZCBpbiBhbm90aGVyIHRhYi93aW5kb3cuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3JlZDU6d2VhdGhlckxvY2F0aW9uQ2hhbmdlZCcsXG4gICAgICAgICAgICAgICAgeyBkZXRhaWw6IHsgYWN0aXZlOiBsb2MsIHNhdmVkOiBuZXh0U2F2ZWQsIGJ1aWxkaW5nX2ZhY2luZzogY2ZnLmJ1aWxkaW5nRmFjaW5nIHx8ICdhdXRvJyB9IH0pKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBJRS1sZXNzIGVudmlyb25tZW50cyAtLSBuby1vcCAqLyB9XG5cbiAgICAgICAgaWYgKHBlcnNpc3RlZCkge1xuICAgICAgICAgICAgb25TYXZlKCk7ICAgICAgICAgICAvLyBoYXBweSBwYXRoOiBjbG9zZSArIG1hcmsgc3RlcCBkb25lXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvKiBTdXJmYWNlIHRoZSB3YXJuaW5nLCBob2xkIHRoZSBtb2RhbCBvcGVuIGZvciAxLjZzIHNvIHRoZVxuICAgICAgICAgICAgICogb3BlcmF0b3IgcmVhZHMgaXQsIHRoZW4gY2xvc2UuICBUaGUgbG9jYWwgY29weSBpcyBhbHJlYWR5XG4gICAgICAgICAgICAgKiB3cml0dGVuLCBzbyB0aGUgZGFzaGJvYXJkIHdpbGwgc3RpbGwgc2VlIHRoZSBuZXcgbG9jYXRpb25cbiAgICAgICAgICAgICAqIGluIHRoaXMgYnJvd3NlciBzZXNzaW9uLiAqL1xuICAgICAgICAgICAgc2V0U2F2ZU1zZyh3YXJuaW5nIHx8ICdTYXZlZCBsb2NhbGx5IG9ubHkg4oCUIHNpZ24gaW4gdG8gc2F2ZSBzZXJ2ZXItc2lkZS4nKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyBzZXRTYXZlTXNnKG51bGwpOyBvblNhdmUoKTsgfSwgMTYwMCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8TW9kYWxTaGVsbCB0aXRsZT17dCgnc3dfbG9jYXRpb25fc2V0dGluZycpfSBzdWJ0aXRsZT17dCgnc3dfbG9jYXRpb25fc3ViJyl9IGFjY2VudD1cImFtYmVyXCIgb25DbG9zZT17b25DbG9zZX0gb25TYXZlPXtwZXJzaXN0QW5kU2F2ZX0gc2l6ZT1cIm1heFwiPlxuICAgICAgICAgICAge3NhdmVNc2cgJiYgKFxuICAgICAgICAgICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJsb2Mtc2F2ZS1tc2dcIlxuICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibWItMyBweC00IHB5LTIuNSByb3VuZGVkLWxnIGJnLWFtYmVyLTkwMC8zMCBib3JkZXIgYm9yZGVyLWFtYmVyLTcwMC81MCB0ZXh0LWFtYmVyLTIwMCB0ZXh0LXhzIGZvbnQtbW9ub1wiPlxuICAgICAgICAgICAgICAgICAgICDimqAgIHtzYXZlTXNnfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBsZzpncmlkLWNvbHMtWzFmcl8zNDBweF0gZ2FwLTQgaC1mdWxsXCIgc3R5bGU9e3ttaW5IZWlnaHQ6JzU2dmgnfX0+XG4gICAgICAgICAgICAgICAgey8qIE1BUCDigJQgZmlsbHMgdGhlIGxlZnQgc2lkZSwgd2l0aCBhIHNlYXJjaCBiYXIgZmxvYXRpbmcgb24gdG9wICovfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmVcIiBzdHlsZT17e21pbkhlaWdodDonNTZ2aCd9fT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiByZWY9e21hcEJveFJlZn1cbiAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBoZWlnaHQ6JzEwMCUnLCBtaW5IZWlnaHQ6JzU2dmgnLCB3aWR0aDonMTAwJScsIGJvcmRlclJhZGl1czonMTJweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6J2hpZGRlbicsIGJvcmRlcjonMXB4IHNvbGlkICMzMzQxNTUnLCBiYWNrZ3JvdW5kOicjMGIxMjIwJyB9fS8+XG5cbiAgICAgICAgICAgICAgICAgICAgey8qIFNlYXJjaCBiYXIgb3ZlcmxheSDigJQgc2l0cyBpbiB0aGUgdG9wLWNlbnRyZSBvZiB0aGUgbWFwICovfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC0zIGxlZnQtMS8yIC10cmFuc2xhdGUteC0xLzIgei1bNTAwXVwiIHN0eWxlPXt7d2lkdGg6J21pbig1NjBweCwgY2FsYygxMDAlIC0gMTEwcHgpKSd9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17c2VhcmNoUX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRTZWFyY2hRKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Gb2N1cz17KCkgPT4gc2VhcmNoSGl0cy5sZW5ndGggJiYgc2V0U2VhcmNoT3Blbih0cnVlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCLwn5SOICBTZWFyY2ggYnkgYWRkcmVzcywgYnVpbGRpbmcsIG9yIHBsYWNlIG5hbWXigKZcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgcHgtNCBweS0yLjUgcm91bmRlZC14bCBiZy1zbGF0ZS05MDAvOTUgYm9yZGVyIGJvcmRlci1zbGF0ZS02MDAgdGV4dC1zbGF0ZS0xMDAgdGV4dC1zbSBwbGFjZWhvbGRlci1zbGF0ZS01MDAgc2hhZG93LTJ4bCBiYWNrZHJvcC1ibHVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tvdXRsaW5lOidub25lJ319Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VhcmNoQnVzeSAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImFic29sdXRlIHJpZ2h0LTMgdG9wLTEvMiAtdHJhbnNsYXRlLXktMS8yIHRleHQtYW1iZXItNDAwIHRleHQteHNcIj7igKY8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VhcmNoT3BlbiAmJiBzZWFyY2hIaXRzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC1mdWxsIGxlZnQtMCByaWdodC0wIG10LTEgYmctc2xhdGUtOTAwLzk3IGJvcmRlciBib3JkZXItc2xhdGUtNzAwIHJvdW5kZWQteGwgc2hhZG93LTJ4bCBvdmVyZmxvdy1oaWRkZW4gbWF4LWgtNzIgb3ZlcmZsb3cteS1hdXRvIGJhY2tkcm9wLWJsdXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWFyY2hIaXRzLm1hcCgoaCwgaSkgPT4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PXtoLnBsYWNlX2lkIHx8IGl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBwaWNrU2VhcmNoSGl0KGgpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHRleHQtbGVmdCBweC00IHB5LTIuNSBob3ZlcjpiZy1hbWJlci05MDAvMzAgYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTgwMCBsYXN0OmJvcmRlci1iLTAgdHJhbnNpdGlvbi1hbGxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIHRleHQtc2xhdGUtMjAwIHRydW5jYXRlXCI+e2guZGlzcGxheV9uYW1lfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgbXQtMC41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7aC50eXBlIHx8IGguY2xhc3N9IMK3IHsoK2gubGF0KS50b0ZpeGVkKDMpfSwgeygraC5sb24pLnRvRml4ZWQoMyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlYXJjaE9wZW4gJiYgc2VhcmNoSGl0cy5sZW5ndGggPT09IDAgJiYgc2VhcmNoUS5sZW5ndGggPj0gMyAmJiAhc2VhcmNoQnVzeSAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgdG9wLWZ1bGwgbGVmdC0wIHJpZ2h0LTAgbXQtMSBiZy1zbGF0ZS05MDAvOTcgYm9yZGVyIGJvcmRlci1zbGF0ZS03MDAgcm91bmRlZC14bCBweC00IHB5LTMgdGV4dC14cyB0ZXh0LXNsYXRlLTQwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTm8gcmVzdWx0cyBmb3IgXCJ7c2VhcmNoUX1cIi4gIFRyeSBhIG1vcmUgc3BlY2lmaWMgdGVybS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgIHsvKiBTSURFIFBBTkVMICovfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS00IG92ZXJmbG93LXktYXV0byBwci0xXCI+XG4gICAgICAgICAgICAgICAgICAgIHsvKiBTaXRlIG5hbWUgY29tYm8taW5wdXQuICBGcmVlLWZvcm0gdHlwaW5nIGZvciBmcmVzaFxuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxzOyBhIHZpc2libGUgY2hldnJvbiBidXR0b24gb24gdGhlIHJpZ2h0IG9wZW5zXG4gICAgICAgICAgICAgICAgICAgICAgICBhIGN1c3RvbSBwb3Bkb3duIGxpc3RpbmcgZXZlcnkgc2F2ZWQgbG9jYXRpb24gcHVsbGVkXG4gICAgICAgICAgICAgICAgICAgICAgICBmcm9tIC9hcGkvd2VhdGhlci1sb2NhdGlvbiAoaS5lLiB0aGUgU0FNRSBsaXN0IHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgRGFzaGJvYXJkJ3MgV2VhdGhlciBidXR0b24gc3VyZmFjZXMpLiAgVGhpcyByZXBsYWNlc1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGVhcmxpZXIgbmF0aXZlIDxkYXRhbGlzdD4gd2hpY2ggd2FzIHRvbyBzdWJ0bGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGluIGRhcmsgdGhlbWVzIC0tIG9wZXJhdG9ycyB3aXRoIE4+MCBzYXZlZCBlbnRyaWVzXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VsZCBub3QgdGVsbCBhIGRyb3Bkb3duIGV4aXN0ZWQuICovfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaWVsZC1sYWJlbCBtYi0xLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTaXRlIG5hbWUgKHNhdmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzYXZlZExvY3MubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1sLTIgdGV4dC1hbWJlci00MDAvODAgbm9ybWFsLWNhc2UgdHJhY2tpbmctbm9ybWFsIHRleHQtWzEwcHhdXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJsb2Mtc2F2ZWQtaGludFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg4pa+IHtzYXZlZExvY3MubGVuZ3RofSBzYXZlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZVwiIHJlZj17c2F2ZWRSZWZ9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dCBwci05XCIgdmFsdWU9e2NmZy5zaXRlTmFtZSB8fCAnJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJsb2Mtc2l0ZS1uYW1lLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3NhdmVkTG9jcy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdQaWNrIGEgc2F2ZWQgbG9jYXRpb24sIG9yIHR5cGUgYSBuZXcgb25l4oCmJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnZS5nLiBIUSBUb3dlciwgTm9ydGggV2luZywgUGF2aWxpb24gQuKApid9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gb25TaXRlTmFtZUNoYW5nZShlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uRm9jdXM9eygpID0+IHNhdmVkTG9jcy5sZW5ndGggPiAwICYmIHNldFNhdmVkT3Blbih0cnVlKX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzYXZlZExvY3MubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJsb2Mtc2F2ZWQtY2hldnJvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0U2F2ZWRPcGVuKHYgPT4gIXYpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJPcGVuIHNhdmVkIGxvY2F0aW9uc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJQaWNrIGZyb20gc2F2ZWQgbG9jYXRpb25zXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSByaWdodC0xIHRvcC0xLzIgLXRyYW5zbGF0ZS15LTEvMiB3LTcgaC03IHJvdW5kZWQtbWQgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgYmctYW1iZXItNzAwLzMwIGhvdmVyOmJnLWFtYmVyLTYwMC81MCBib3JkZXIgYm9yZGVyLWFtYmVyLTUwMC80MCB0ZXh0LWFtYmVyLTIwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjE0XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjIuNFwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIiBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e3RyYW5zZm9ybTogc2F2ZWRPcGVuID8gJ3JvdGF0ZSgxODBkZWcpJyA6ICdub25lJywgdHJhbnNpdGlvbjondHJhbnNmb3JtIC4xNXMnfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlsaW5lIHBvaW50cz1cIjYgOSAxMiAxNSAxOCA5XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NhdmVkT3BlbiAmJiBzYXZlZExvY3MubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJsb2Mtc2F2ZWQtZHJvcGRvd25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIHotWzYwMF0gbGVmdC0wIHJpZ2h0LTAgdG9wLWZ1bGwgbXQtMSBiZy1zbGF0ZS05MDAgYm9yZGVyIGJvcmRlci1zbGF0ZS02MDAgcm91bmRlZC1sZyBzaGFkb3ctMnhsIG1heC1oLTY0IG92ZXJmbG93LXktYXV0b1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3NhdmVkTG9jcy5tYXAobG9jID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0FjdGl2ZSA9IChjZmcuc2l0ZU5hbWUgfHwgJycpLnRyaW0oKSA9PT0gbG9jLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgTWF0aC5hYnMoY2ZnLmxhdCAtIGxvYy5sYXQpIDwgMWUtNFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBNYXRoLmFicyhjZmcubG9uIC0gbG9jLmxvbikgPCAxZS00O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFJvdyBpcyBhIDxkaXYgcm9sZT1cImJ1dHRvblwiPiBpbnN0ZWFkIG9mIDxidXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc28gdGhlIGluLXJvdyB0cmFzaCA8YnV0dG9uPiBpc24ndCBuZXN0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNpZGUgYW5vdGhlciBpbnRlcmFjdGl2ZSBlbGVtZW50LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvd0tleSA9IGAke2xvYy5sYXQudG9GaXhlZCg0KX0sJHtsb2MubG9uLnRvRml4ZWQoNCl9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtyb3dLZXl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9sZT1cImJ1dHRvblwiIHRhYkluZGV4PXswfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFBpY2sgdGhlIHJvdyBvbmx5IHdoZW4gdGhlIG9wZXJhdG9yIGNsaWNrcyB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29vcmQvd2hpdGVzcGFjZSBhcmVhLCBub3QgdGhlIHJlbmFtZSBpbnB1dCBvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgdHJhc2ggYnV0dG9uICh0aG9zZSBzdG9wUHJvcGFnYXRpb24pLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWNrU2F2ZWRMb2MobG9jKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uS2V5RG93bj17KGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnICcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpY2tTYXZlZExvYyhsb2MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17YGxvYy1zYXZlZC1vcHQtJHtsb2MubmFtZX1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YGdyb3VwIGZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHB4LTMgcHktMiBib3JkZXItYiBib3JkZXItc2xhdGUtODAwIGxhc3Q6Ym9yZGVyLWItMCBob3ZlcjpiZy1hbWJlci05MDAvMzAgdHJhbnNpdGlvbi1jb2xvcnMgY3Vyc29yLXBvaW50ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7aXNBY3RpdmUgPyAnYmctYW1iZXItOTAwLzUwJyA6ICcnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTEgbWluLXctMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBJbmxpbmUgcmVuYW1lIGlucHV0IC0tIHR5cGluZyBoZXJlIHVwZGF0ZXMgdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluLW1lbW9yeSBzYXZlZExvY3MgZW50cnk7IGNsaWNraW5nIFNhdmUgJiBSZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVyc2lzdHMgdGhlIHdob2xlIGxpc3QgdG8gbG9jYWxTdG9yYWdlIEFORCB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmVyLiAgc3RvcFByb3BhZ2F0aW9uIGtlZXBzIGEgY2xpY2sgb24gdGhlIGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gdHJpZ2dlcmluZyB0aGUgcm93J3MgcGljayBoYW5kbGVyLiAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17YGxvYy1zYXZlZC1yZW5hbWUtJHtyb3dLZXl9YH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2xvYy5uYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHJlbmFtZVNhdmVkTG9jKGxvYywgZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25LZXlEb3duPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRW50ZXIgd2hpbGUgZWRpdGluZyBrZWVwcyB0aGUgZHJvcGRvd25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW4gLS0gZmluYWxpc2luZyByZW5hbWUgaGFwcGVucyBhdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2F2ZSAmIFJldHVybiwgbm90IG9uIEVudGVyLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUua2V5ID09PSAnRW50ZXInKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2BSZW5hbWUgc2F2ZWQgbG9jYXRpb24gJHtsb2MubmFtZX1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYmctdHJhbnNwYXJlbnQgYm9yZGVyLTAgb3V0bGluZS1ub25lIHRleHQtc20gdGV4dC1zbGF0ZS0xMDAgZm9udC1tZWRpdW0gcHgtMCBweS0wXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9jdXM6Ymctc2xhdGUtODAwLzYwIGZvY3VzOnB4LTEgZm9jdXM6cm91bmRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvdmVyOmJnLXNsYXRlLTgwMC80MCBob3ZlcjpweC0xIGhvdmVyOnJvdW5kZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uLWFsbFwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIGZvbnQtbW9ubyBtdC0wLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2xvYy5sYXQudG9GaXhlZCgyKX0sIHtsb2MubG9uLnRvRml4ZWQoMil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBUcmFzaCBidXR0b24gLS0gYWx3YXlzIHJlbmRlcmVkLCBmYWRlZCB1bnRpbCByb3ctaG92ZXIgc28gaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2Vzbid0IGNsdXR0ZXIgdGhlIHJlc3Rpbmcgc3RhdGUuICBzdG9wUHJvcGFnYXRpb24gcHJldmVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgcm93J3MgcGljayBoYW5kbGVyIGZyb20gZmlyaW5nLiAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgbG9jLXNhdmVkLXJlbW92ZS0ke2xvYy5uYW1lfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e2BSZW1vdmUgJHtsb2MubmFtZX1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT17YFJlbW92ZSAke2xvYy5uYW1lfSBmcm9tIHNhdmVkIGxvY2F0aW9uc2B9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IHJlbW92ZVNhdmVkTG9jKGxvYyk7IH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInNocmluay0wIHctNyBoLTcgcm91bmRlZC1tZCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQtc2xhdGUtNTAwIGhvdmVyOnRleHQtcm9zZS0zMDAgaG92ZXI6Ymctcm9zZS05MDAvMzBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5LTQwIGdyb3VwLWhvdmVyOm9wYWNpdHktMTAwIHRyYW5zaXRpb24tb3BhY2l0eVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIxNFwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyLjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMyA2aDE4XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTggNlY0YTIgMiAwIDAgMSAyLTJoNGEyIDIgMCAwIDEgMiAydjJcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTkgNmwtMS41IDEzLjJhMiAyIDAgMCAxLTIgMS44SDguNWEyIDIgMCAwIDEtMi0xLjhMNSA2XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTEwIDExdjZNMTQgMTF2NlwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtc2xhdGUtNTAwIG10LTEgaXRhbGljXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NhdmVkTG9jcy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ1BpY2sgYSBwcmV2aW91c2x5LXNhdmVkIGxvY2F0aW9uLCBvciB0eXBlIGEgbmV3IGxhYmVsIGZvciB0aGlzIHBsYWNlLidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnWW91ciBsYWJlbCBmb3IgdGhpcyBwbGFjZSDigJQgc2hvd24gb24gdGhlIGRhc2hib2FyZCBoZWFkZXIuJ31cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBTb2Z0IGR1cGxpY2F0ZS1uYW1lIHdhcm5pbmcgLS0gaWYgdGhlIG9wZXJhdG9yIHR5cGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYSBuYW1lIHRoYXQgYWxyZWFkeSBleGlzdHMgaW4gdGhlIHNhdmVkIGxpc3QgQVRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBESUZGRVJFTlQgQ09PUkRJTkFURVMsIHN1cmZhY2UgdGhhdCBzbyB0aGV5IGRvbid0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2lsZW50bHkgZW5kIHVwIHdpdGggdHdvIFwiSE9NRVwicyBwb2ludGluZyB0byB0d29cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaWZmZXJlbnQgYWRkcmVzc2VzICh0aGUgYnVnIG9wZXJhdG9yLXJlcG9ydGVkIG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMjAyNi0wNi0yODogZGFzaGJvYXJkIGhhZCAyw5cgSE9NRSwgU2V0dXAgV2Fsa1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dlZCBvbmx5IDEpLiAgU2FtZSBjb29yZHMgPSBubyB3YXJuaW5nLCBpdCdzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganVzdCByZS1zZWxlY3RpbmcgYSBrbm93biBzaXRlLiAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgIHsoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHR5cGVkID0gKGNmZy5zaXRlTmFtZSB8fCAnJykudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdHlwZWQpIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvdW5kID0gKG4pID0+IChNYXRoLnJvdW5kKG4gKiAxMDAwMCkgLyAxMDAwMCkudG9GaXhlZCg0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXIgPSByb3VuZChjZmcubGF0KSArICcsJyArIHJvdW5kKGNmZy5sb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbmZsaWN0ID0gc2F2ZWRMb2NzLmZpbmQocyA9PiBzLm5hbWUgPT09IHR5cGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgKHJvdW5kKHMubGF0KSArICcsJyArIHJvdW5kKHMubG9uKSkgIT09IGN1cik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjb25mbGljdCkgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cImxvYy1kdXAtbmFtZS13YXJuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtdC0yIHB4LTIuNSBweS0yIHJvdW5kZWQtbWQgYmctYW1iZXItOTUwLzQwIGJvcmRlciBib3JkZXItYW1iZXItNzAwLzUwIHRleHQtWzEwLjVweF0gdGV4dC1hbWJlci0yMDAgbGVhZGluZy1zbnVnXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YiBjbGFzc05hbWU9XCJ0ZXh0LWFtYmVyLTEwMFwiPlNhbWUgbmFtZSBhbHJlYWR5IHNhdmVkPC9iPiBhdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNvZGUgY2xhc3NOYW1lPVwibXgtMSBmb250LW1vbm8gdGV4dC1hbWJlci0xMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Y29uZmxpY3QubGF0LnRvRml4ZWQoMil9LCB7Y29uZmxpY3QubG9uLnRvRml4ZWQoMil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2NvZGU+LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2F2aW5nIGtlZXBzIGJvdGg7IHBpY2sgZnJvbSB0aGUgZHJvcGRvd24gYWJvdmUgdG8gc3dpdGNoIHRvIHRoZSBleGlzdGluZyBvbmUgaW5zdGVhZC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKCl9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyLXQgYm9yZGVyLXNsYXRlLTgwMCBwdC0zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlc29sdmVkIGFkZHJlc3MgLyBjaXR5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2dlb0J1c3kgJiYgPHNwYW4gY2xhc3NOYW1lPVwibWwtMiB0ZXh0LWFtYmVyLTQwMCBub3JtYWwtY2FzZSB0cmFja2luZy1ub3JtYWxcIj7igKYgcmVzb2x2aW5nPC9zcGFuPn1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCIgdmFsdWU9e2NmZy5jaXR5fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSk9PnNldENmZyh7Li4uY2ZnLCBjaXR5OmUudGFyZ2V0LnZhbHVlfSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTEuNVwiPnt0KCdzd19sYXRpdHVkZScpfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiIHR5cGU9XCJudW1iZXJcIiBzdGVwPVwiMC4wMDAxXCIgdmFsdWU9e2NmZy5sYXR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSk9PnNldENmZyh7Li4uY2ZnLCBsYXQ6K2UudGFyZ2V0LnZhbHVlfSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTEuNVwiPnt0KCdzd19sb25naXR1ZGUnKX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIiB0eXBlPVwibnVtYmVyXCIgc3RlcD1cIjAuMDAwMVwiIHZhbHVlPXtjZmcubG9ufVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpPT5zZXRDZmcoey4uLmNmZywgbG9uOitlLnRhcmdldC52YWx1ZX0pfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmllbGQtbGFiZWwgbWItMS41XCI+RWxldmF0aW9uIChtIEFTTCk8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBnYXAtMiBpdGVtcy1jZW50ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXQgZmxleC0xIG1pbi13LTBcIiB0eXBlPVwibnVtYmVyXCIgc3RlcD1cIjFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImxvYy1lbGV2YXRpb24tYXNsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2NmZy5lbGV2YXRpb25fbSA9PT0gJycgfHwgY2ZnLmVsZXZhdGlvbl9tID09IG51bGwgPyAnJyA6IGNmZy5lbGV2YXRpb25fbX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKT0+c2V0Q2ZnKHsuLi5jZmcsIGVsZXZhdGlvbl9tOiBlLnRhcmdldC52YWx1ZSA9PT0gJycgPyAnJyA6ICtlLnRhcmdldC52YWx1ZX0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIk1ldHJlcyBhYm92ZSBtZWFuIHNlYSBsZXZlbCBmcm9tIHRlcnJhaW4gREVNIGZvciB0aGUgc2l0ZSBsYXQvbG5nIChub3QgR1BTIGFsdGl0dWRlKVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJsb2MtbG9va3VwLWFzbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXthc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZWxldiA9IGF3YWl0IGxvb2t1cEVsZXZhdGlvbk0oY2ZnLmxhdCwgY2ZnLmxvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsZXYgPT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgZWxldmF0aW9uX206IE1hdGgucm91bmQoZWxldil9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic2hyaW5rLTAgcHgtMi41IHB5LTIgcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLXNsYXRlLTYwMCBiZy1zbGF0ZS04MDAgdGV4dC1bMTBweF0gZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IHRleHQtYW1iZXItMjAwIGhvdmVyOmJvcmRlci1hbWJlci00MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTG9va3VwIEFTTFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0xLjUgbGVhZGluZy1zbnVnXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQVNMIGNvbWVzIGZyb20gYSB0ZXJyYWluIERFTSBmb3IgdGhlIGxhdC9sbmcgKG5vdCBicm93c2VyIEdQUykuIEJ1aWxkaW5nIGFzcGVjdCAoTi9TKSBpcyBzZXQgb24gdGhlIGZsb29yIHBsYW4uXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17dXNlTXlMb2NhdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17Z2VvU3RhdGUgPT09ICdidXN5J31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD1cImxvYy11c2UtbXktbG9jYXRpb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHctZnVsbCBweS0yLjUgcm91bmRlZC1sZyBib3JkZXIgdGV4dC14cyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgdHJhbnNpdGlvbi1jb2xvcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtnZW9TdGF0ZSA9PT0gJ2J1c3knXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1hbWJlci05MDAvNDAgYm9yZGVyLWFtYmVyLTcwMC80MCB0ZXh0LWFtYmVyLTIwMCBjdXJzb3Itd2FpdCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogKGdlb1N0YXRlICYmIGdlb1N0YXRlLmVyclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLXJvc2UtOTAwLzQwIGJvcmRlci1yb3NlLTUwMC81MCB0ZXh0LXJvc2UtMTAwIGhvdmVyOmJnLXJvc2UtODAwLzQwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLWFtYmVyLTcwMC83MCBib3JkZXItYW1iZXItNTAwLzQwIHRleHQtYW1iZXItNTAgaG92ZXI6YmctYW1iZXItNjAwLzcwJyl9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7Z2VvU3RhdGUgPT09ICdidXN5J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ+KPsyAgUmVhZGluZyBkZXZpY2UgbG9jYXRpb27igKYnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAn8J+TjSAgVXNlIG15IGRldmljZSBsb2NhdGlvbid9XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICB7Z2VvU3RhdGUgJiYgZ2VvU3RhdGUuZXJyICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJsb2MtZ2VvLWVycm9yXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiLW10LTIgcHgtMyBweS0yIHJvdW5kZWQtbWQgYmctcm9zZS05NTAvNTAgYm9yZGVyIGJvcmRlci1yb3NlLTcwMC80MCB0ZXh0LVsxMXB4XSBsZWFkaW5nLXNudWcgdGV4dC1yb3NlLTIwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxiIGNsYXNzTmFtZT1cInRleHQtcm9zZS0xMDBcIj5Db3VsZG4ndCByZWFkIGxvY2F0aW9uLjwvYj48YnIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtcm9zZS0yMDAvOTBcIj57Z2VvU3RhdGUuZXJyfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogU3BlY2lmaWMgSFRUUC1vcmlnaW4gY2FsbC1vdXQ6IG1vc3QgbGlrZWx5IGNhdXNlIG9uIGEgVjEuOSBjb250cm9sbGVyLiAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmxvY2F0aW9uICYmIHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2h0dHA6JyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtMS41IHRleHQtWzEwcHhdIHRleHQtcm9zZS0zMDAvODAgZm9udC1tb25vXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXA6IGJyb3dzZXJzIHJlcXVpcmUgSFRUUFMgZm9yIGdlb2xvY2F0aW9uLiAgUGljayB0aGUgbG9jYXRpb24gb24gdGhlIG1hcCBvciBzZWFyY2ggYmFyIGluc3RlYWQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvcmRlci10IGJvcmRlci1zbGF0ZS04MDAgcHQtMyBtdC0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpZWxkLWxhYmVsIG1iLTJcIj57dCgnc3dfcXVpY2tfanVtcHMnKX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtMS41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidUb3JvbnRvLCBPTicsICAgbGF0OjQzLjY1MzIsIGxvbjotNzkuMzgzMiwgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J05ldyBZb3JrLCBOWScsICBsYXQ6NDAuNzEyOCwgbG9uOi03NC4wMDYwLCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonTG9uZG9uLCBVSycsICAgIGxhdDo1MS41MDc0LCBsb246IC0wLjEyNzgsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBuYW1lOidQYXJpcywgRlInLCAgICAgbGF0OjQ4Ljg1NjYsIGxvbjogIDIuMzUyMiwgejoxMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IG5hbWU6J1Rva3lvLCBKUCcsICAgICBsYXQ6MzUuNjc2MiwgbG9uOjEzOS42NTAzLCB6OjExIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgbmFtZTonU3lkbmV5LCBBVScsICAgIGxhdDotMzMuODY4OCxsb246MTUxLjIwOTMsIHo6MTEgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLm1hcChqID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e2oubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldENmZyhjID0+ICh7Li4uYywgbGF0OmoubGF0LCBsb246ai5sb24sIGNpdHk6ai5uYW1lLCBlbGV2YXRpb25fbTogJyd9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXBSZWYuY3VycmVudCkgbWFwUmVmLmN1cnJlbnQuc2V0Vmlldyhbai5sYXQsIGoubG9uXSwgai56KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtbGVmdCBweC0yLjUgcHktMS41IHJvdW5kZWQtbWQgYmctc2xhdGUtODAwLzcwIGJvcmRlciBib3JkZXItc2xhdGUtNzAwIHRleHQtWzExcHhdIGZvbnQtYm9sZCB0ZXh0LXNsYXRlLTMwMCBob3ZlcjpiZy1zbGF0ZS03MDAgaG92ZXI6Ym9yZGVyLWFtYmVyLTUwMC80MCB0cmFuc2l0aW9uLWFsbFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2oubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1zbGF0ZS01MDAgbGVhZGluZy1yZWxheGVkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICBUaWxlczogT3BlblN0cmVldE1hcCDCtyBHZW9jb2RlOiBOb21pbmF0aW0gKGZyZWUsIH4xIHJlcS9zKS5cbiAgICAgICAgICAgICAgICAgICAgICAgIFVzZWQgZm9yIE9wZW4tTWV0ZW8gd2VhdGhlciBmZWVkIGFuZCBzdW5yaXNlL3N1bnNldCBlc3RpbWF0aW9uLlxuICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Nb2RhbFNoZWxsPlxuICAgICk7XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIExhbmd1YWdlIFNldHRpbmcgLS0gbW9kYWxcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIExhbmd1YWdlTW9kYWwoeyBjZmcsIHNldENmZywgb25DbG9zZSwgb25TYXZlIH0pIHtcbiAgICBjb25zdCBsYW5ncyA9IFtcbiAgICAgICAgeyBjb2RlOidlbicsICAgIGxhYmVsOidFbmdsaXNoJywgICAgICAgICAgICAgICAgbmF0aXZlOidFbmdsaXNoJyAgICB9LFxuICAgICAgICB7IGNvZGU6J3poLUNOJywgbGFiZWw6J0NoaW5lc2UgKFNpbXBsaWZpZWQpJywgICBuYXRpdmU6J+eugOS9k+S4reaWhycgICAgfSxcbiAgICAgICAgeyBjb2RlOid6aC1UVycsIGxhYmVsOidDaGluZXNlIChUcmFkaXRpb25hbCknLCAgbmF0aXZlOifnuYHpq5TkuK3mlocnICAgIH0sXG4gICAgICAgIHsgY29kZTonamEnLCAgICBsYWJlbDonSmFwYW5lc2UnLCAgICAgICAgICAgICAgIG5hdGl2ZTon5pel5pys6KqeJyAgICAgIH0sXG4gICAgICAgIHsgY29kZTona28nLCAgICBsYWJlbDonS29yZWFuJywgICAgICAgICAgICAgICAgIG5hdGl2ZTon7ZWc6rWt7Ja0JyAgICAgIH0sXG4gICAgXTtcblxuICAgIC8qIE9uIFNhdmUgJiByZXR1cm46IHdyaXRlIHRoZSBwaWNrZWQgbGFuZ3VhZ2UgY29kZSB0byB0aGUgc2FtZVxuICAgICAqIGxvY2FsU3RvcmFnZSBrZXkgdGhlIGRhc2hib2FyZCdzIGkxOG4uanMgcmVhZHMgKGBpMThuX2xhbmdgKSwgYW5kXG4gICAgICogZGlzcGF0Y2ggdGhlIGBsYW5nY2hhbmdlYCBldmVudCBzbyBhbnkgb3BlbiBkYXNoYm9hcmQvY29uZmlnIHRhYlxuICAgICAqIHBpY2tzIGl0IHVwIGxpdmUuICBUaGlzIGlzIHdoYXQgbWFrZXMgdGhlIHNldHVwIHdhbGsncyBsYW5ndWFnZVxuICAgICAqIGNob2ljZSBhY3R1YWxseSBkcml2ZSB0aGUgZGFzaGJvYXJkIC8gY29uZmlnIC8gbWFwcGVyIFVJIC0tIHRoZVxuICAgICAqIHNpZGViYXIgc2VsZWN0b3IgdGhhdCB1c2VkIHRvIGxpdmUgaW4gdGhlIGRhc2hib2FyZCBoZWFkZXIgaGFzXG4gICAgICogYmVlbiByZW1vdmVkICgyMDI2LTA2LTI2KSBhbmQgdGhlIHNldHVwIHdhbGsgaXMgbm93IHRoZSBzaW5nbGVcbiAgICAgKiBzb3VyY2Ugb2YgdHJ1dGggZm9yIFVJIGxhbmd1YWdlLiAqL1xuICAgIGNvbnN0IHBlcnNpc3RBbmRTYXZlID0gKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2kxOG5fbGFuZycsIGNmZy5sYW5nKTtcbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnbGFuZ2NoYW5nZScpKTtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnW3NldHVwIHdhbGtdIGkxOG5fbGFuZyA8LScsIGNmZy5sYW5nKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdbc2V0dXAgd2Fsa10gY291bGQgbm90IHBlcnNpc3QgbGFuZ3VhZ2U6JywgZSk7XG4gICAgICAgIH1cbiAgICAgICAgb25TYXZlKCk7XG4gICAgfTtcbiAgICByZXR1cm4gKFxuICAgICAgICA8TW9kYWxTaGVsbCB0aXRsZT17dCgnc3dfbGFuZ3VhZ2Vfc2V0dGluZycpfSBzdWJ0aXRsZT17dCgnc3dfbGFuZ3VhZ2Vfc3ViJyl9IGFjY2VudD1cImVtZXJhbGRcIiBvbkNsb3NlPXtvbkNsb3NlfSBvblNhdmU9e3BlcnNpc3RBbmRTYXZlfT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtM1wiPlxuICAgICAgICAgICAgICAgIHtsYW5ncy5tYXAobCA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PXtsLmNvZGV9IG9uQ2xpY2s9eygpPT5zZXRDZmcoey4uLmNmZywgbGFuZzpsLmNvZGV9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B0ZXh0LWxlZnQgcC0zIHJvdW5kZWQteGwgYm9yZGVyLTIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtjZmcubGFuZyA9PT0gbC5jb2RlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdib3JkZXItZW1lcmFsZC01MDAgYmctZW1lcmFsZC05MDAvMjAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdib3JkZXItc2xhdGUtNzAwIGJnLXNsYXRlLTgwMC80MCBob3ZlcjpiZy1zbGF0ZS04MDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS01MDBcIj57bC5jb2RlfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS0yMDBcIj57bC5uYXRpdmV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzExcHhdIHRleHQtc2xhdGUtNTAwXCI+e2wubGFiZWx9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvTW9kYWxTaGVsbD5cbiAgICApO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBQbHVnLWluIFNldHRpbmcgLS0gbW9kYWwgdy8gbGlzdCArIHVwbG9hZCB6b25lXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4vKiBQZXItcGx1Zy1pbiBtb2NrIGNvbmZpZ3VyYXRpb24gZmllbGRzLiAgS2V5cyBtYXAgdG8gcGx1Zy1pbiBgaWRgLiAqL1xuY29uc3QgUExVR0lOX0NPTkZJR19GSUVMRFMgPSB7XG4gICAgd2VhdGhlcjogICAgW1xuICAgICAgICB7IGtleToncHJvdmlkZXInLCAgbGFiZWw6J1Byb3ZpZGVyJywgICAgICAgICAgdHlwZTonc2VsZWN0JywgIG9wdGlvbnM6WydPcGVuLU1ldGVvJywnTldTJywnRUNNV0YnXSwgZGVmOidPcGVuLU1ldGVvJyB9LFxuICAgICAgICB7IGtleToncmVmcmVzaCcsICAgbGFiZWw6J1JlZnJlc2ggaW50ZXJ2YWwnLCAgdHlwZTonc2VsZWN0JywgIG9wdGlvbnM6WycxIG1pbicsJzUgbWluJywnMTUgbWluJywnMzAgbWluJywnMSBoJ10sIGRlZjonMTUgbWluJyB9LFxuICAgICAgICB7IGtleTonY2FjaGUnLCAgICAgbGFiZWw6J0NhY2hlIFRUTCAobWluKScsICAgdHlwZTonbnVtYmVyJywgIGRlZjozMCB9LFxuICAgIF0sXG4gICAgZ2l2b25pOiAgICAgW1xuICAgICAgICB7IGtleTonY2xpbWF0ZScsICAgbGFiZWw6J0NsaW1hdGUgbW9kZWwnLCAgICAgdHlwZTonc2VsZWN0JywgIG9wdGlvbnM6WydHaXZvbmkgMTk5MicsJ0FTSFJBRSA1NScsJ0FkYXB0aXZlJ10sIGRlZjonR2l2b25pIDE5OTInIH0sXG4gICAgICAgIHsga2V5OidtYXNzaXZlJywgICBsYWJlbDonSGVhdnl3ZWlnaHQgY29uc3RydWN0aW9uJywgIHR5cGU6J3RvZ2dsZScsIGRlZjpmYWxzZSB9LFxuICAgIF0sXG4gICAgc3dlZXRfc3BvdDogW1xuICAgICAgICB7IGtleTondHJhY2tpbmcnLCAgbGFiZWw6J1RyYWNrIG91dGRvb3IgUkgnLCAgdHlwZTondG9nZ2xlJywgZGVmOnRydWUgfSxcbiAgICAgICAgeyBrZXk6J2h5c3QnLCAgICAgIGxhYmVsOidIeXN0ZXJlc2lzICglIFJIKScsIHR5cGU6J251bWJlcicsIGRlZjoyIH0sXG4gICAgXSxcbiAgICBnMzY6ICAgICAgICBbXG4gICAgICAgIHsga2V5Oidtb2RlJywgICAgICBsYWJlbDonU2VxdWVuY2UgbW9kZScsICAgICB0eXBlOidzZWxlY3QnLCAgb3B0aW9uczpbJ1NpbmdsZS16b25lIFZBVicsJ011bHRpLXpvbmUgVkFWJywnRE9BUyB3LyBGQ1UnXSwgZGVmOidNdWx0aS16b25lIFZBVicgfSxcbiAgICAgICAgeyBrZXk6J3ZlcmJvc2UnLCAgIGxhYmVsOidWZXJib3NlIGxvZ2dpbmcnLCAgIHR5cGU6J3RvZ2dsZScsIGRlZjpmYWxzZSB9LFxuICAgIF0sXG4gICAgZGlidDogICAgICAgW1xuICAgICAgICB7IGtleTonaG9zdCcsICAgICAgbGFiZWw6J0JyaWRnZSBob3N0JywgICAgICAgdHlwZTondGV4dCcsICAgZGVmOicxOTIuMTY4LjEuMTAwJyB9LFxuICAgICAgICB7IGtleToncG9ydCcsICAgICAgbGFiZWw6J1RlbGVncmFtIHBvcnQnLCAgICAgdHlwZTonbnVtYmVyJywgZGVmOjQ3ODA4IH0sXG4gICAgICAgIHsga2V5Oidwb2xsX21zJywgICBsYWJlbDonUG9sbCBpbnRlcnZhbCAobXMpJyx0eXBlOidudW1iZXInLCBkZWY6MjAwMCB9LFxuICAgIF0sXG4gICAgbGlnaHRpbmc6ICAgW1xuICAgICAgICB7IGtleTonZ2F0ZXdheScsICAgbGFiZWw6J01vZGJ1cyBnYXRld2F5IElQJywgdHlwZTondGV4dCcsICAgZGVmOicxMC4wLjAuNTAnIH0sXG4gICAgICAgIHsga2V5Oid1bml0X2lkJywgICBsYWJlbDonVW5pdCBJRCcsICAgICAgICAgICB0eXBlOidudW1iZXInLCBkZWY6MSB9LFxuICAgICAgICB7IGtleTondGNwX3BvcnQnLCAgbGFiZWw6J1RDUCBwb3J0JywgICAgICAgICAgdHlwZTonbnVtYmVyJywgZGVmOjUwMiB9LFxuICAgIF0sXG59O1xuXG5mdW5jdGlvbiBQbHVnaW5zTW9kYWwoeyBjZmcsIHNldENmZywgb25DbG9zZSwgb25TYXZlIH0pIHtcbiAgICBjb25zdCBBTEwgPSBbXG4gICAgICAgIHsgaWQ6J3dlYXRoZXInLCAgICAgbmFtZTonV2VhdGhlcicsICAgICAgICAgZGVzYzonT3Blbi1NZXRlbyBPQSBmZWVkJywgICAgICAgICAgdmVyOicyLjEuMCcgfSxcbiAgICAgICAgeyBpZDonZ2l2b25pJywgICAgICBuYW1lOidHaXZvbmkgRW5naW5lJywgICBkZXNjOidDbGltYXRlLXN0cmF0ZWd5IG92ZXJsYXknLCAgICB2ZXI6JzEuMy40JyB9LFxuICAgICAgICB7IGlkOidzd2VldF9zcG90JywgIG5hbWU6J1N3ZWV0LVNwb3QgUkgnLCAgIGRlc2M6J0FkanVzdGFibGUgUkggYmFuZCcsICAgICAgICAgIHZlcjonMS4wLjEnIH0sXG4gICAgICAgIHsgaWQ6J2czNicsICAgICAgICAgbmFtZTonRzM2IFNlcXVlbmNlcycsICAgZGVzYzonQVNIUkFFIEd1aWRlbGluZSAzNicsICAgICAgICAgdmVyOicwLjkuMicgfSxcbiAgICAgICAgeyBpZDonZGlidCcsICAgICAgICBuYW1lOidESUJUIEJyaWRnZScsICAgICBkZXNjOidEZWx0YSBDb250cm9scyAoRElCVCkgQkFDbmV0IGJyaWRnZScsICAgICAgICAgICB2ZXI6JzAuNC4wJyB9LFxuICAgICAgICB7IGlkOidsaWdodGluZycsICAgIG5hbWU6J0xpZ2h0aW5nIChSZWQ1KScsIGRlc2M6J1YzLjAgTW9kYnVzIFRDUCBjbGllbnQnLCAgICAgIHZlcjonMC4xLjAtYmV0YScgfSxcbiAgICBdO1xuICAgIGNvbnN0IHRvZ2dsZSA9IChpZCkgPT4gc2V0Q2ZnKGMgPT4gKHtcbiAgICAgICAgLi4uYyxcbiAgICAgICAgZW5hYmxlZDogYy5lbmFibGVkLmluY2x1ZGVzKGlkKSA/IGMuZW5hYmxlZC5maWx0ZXIoeCA9PiB4ICE9PSBpZCkgOiBbLi4uYy5lbmFibGVkLCBpZF1cbiAgICB9KSk7XG5cbiAgICAvKiBleHBhbnNpb24gc3RhdGUg4oCUIHdoaWNoIHBsdWctaW4ncyBcIkNvbmZpZ3VyZVwiIHBhbmVsIGlzIG9wZW4gKi9cbiAgICBjb25zdCBbZXhwYW5kZWRJZCwgc2V0RXhwYW5kZWRJZF0gPSBSZWFjdC51c2VTdGF0ZShudWxsKTtcblxuICAgIGNvbnN0IHVwZGF0ZUZpZWxkID0gKHBsdWdpbklkLCBmaWVsZEtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgc2V0Q2ZnKGMgPT4gKHtcbiAgICAgICAgICAgIC4uLmMsXG4gICAgICAgICAgICBmaWVsZHM6IHsgLi4uKGMuZmllbGRzIHx8IHt9KSwgW3BsdWdpbklkXTogeyAuLi4oKGMuZmllbGRzIHx8IHt9KVtwbHVnaW5JZF0gfHwge30pLCBbZmllbGRLZXldOiB2YWx1ZSB9IH1cbiAgICAgICAgfSkpO1xuICAgIH07XG5cbiAgICBjb25zdCBmaWVsZFZhbCA9IChwbHVnaW5JZCwgZmllbGQpID0+IHtcbiAgICAgICAgY29uc3Qgc3RvcmVkID0gY2ZnLmZpZWxkcyAmJiBjZmcuZmllbGRzW3BsdWdpbklkXSAmJiBjZmcuZmllbGRzW3BsdWdpbklkXVtmaWVsZC5rZXldO1xuICAgICAgICByZXR1cm4gc3RvcmVkICE9PSB1bmRlZmluZWQgPyBzdG9yZWQgOiBmaWVsZC5kZWY7XG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIDxNb2RhbFNoZWxsIHRpdGxlPXt0KCdzd19wbHVnaW5fc2V0dGluZycpfSBzdWJ0aXRsZT17dCgnc3dfcGx1Z2luX3N1YicpfSBhY2NlbnQ9XCJwaW5rXCIgb25DbG9zZT17b25DbG9zZX0gb25TYXZlPXtvblNhdmV9IHNpemU9XCJ3aWRlXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMyBtYXgtaC1bNjB2aF0gb3ZlcmZsb3cteS1hdXRvIHByLTFcIj5cbiAgICAgICAgICAgICAgICB7QUxMLm1hcChwID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb24gPSBjZmcuZW5hYmxlZC5pbmNsdWRlcyhwLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhwYW5kZWQgPSBleHBhbmRlZElkID09PSBwLmlkO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWVsZHMgPSBQTFVHSU5fQ09ORklHX0ZJRUxEU1twLmlkXSB8fCBbXTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtwLmlkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2Byb3VuZGVkLXhsIGJvcmRlciB0cmFuc2l0aW9uLWFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke29uID8gJ2JvcmRlci1waW5rLTUwMC80MCBiZy1waW5rLTkwMC8xMCcgOiAnYm9yZGVyLXNsYXRlLTcwMCBiZy1zbGF0ZS04MDAvNDAnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2V4cGFuZGVkID8gJ3JpbmctMSByaW5nLXBpbmstNTAwLzMwJyA6ICcnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHAtM1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtYmxhY2sgdGV4dC1zbGF0ZS0xMDBcIj57cC5uYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1sLTIgdGV4dC1bMTBweF0gZm9udC1tb25vIHRleHQtc2xhdGUtNTAwXCI+dntwLnZlcn08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXNsYXRlLTQwMFwiPntwLmRlc2N9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHRvZ2dsZShwLmlkKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BwbHVnaW4tdG9nZ2xlLSR7cC5pZH1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweC0zIHB5LTEgcm91bmRlZC1tZCB0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgYm9yZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke29uID8gJ2JvcmRlci1waW5rLTUwMC82MCB0ZXh0LXBpbmstMzAwIGJnLXBpbmstOTAwLzMwJyA6ICdib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtNDAwIGJnLXNsYXRlLTgwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge29uID8gdCgnc3dfZW5hYmxlZCcpIDogdCgnc3dfZGlzYWJsZWQnKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBzZXRFeHBhbmRlZElkKGV4cGFuZGVkID8gbnVsbCA6IHAuaWQpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17YHBsdWdpbi1jb25maWctJHtwLmlkfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTMgcHktMSByb3VuZGVkLW1kIHRleHQtWzEwcHhdIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayBib3JkZXIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7ZXhwYW5kZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdib3JkZXItcGluay01MDAgYmctcGluay05MDAvMzAgdGV4dC1waW5rLTIwMCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtNDAwIGJnLXNsYXRlLTgwMCBob3ZlcjpiZy1zbGF0ZS03MDAgaG92ZXI6Ym9yZGVyLXBpbmstNTAwLzUwIGhvdmVyOnRleHQtcGluay0zMDAnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtleHBhbmRlZCA/IHQoJ3N3X2Nsb3NlX3VwJykgOiB0KCdzd19jb25maWd1cmVfZGQnKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZXhwYW5kZWQgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB4LTQgcGItNCBib3JkZXItdCBib3JkZXItcGluay01MDAvMjAgYmctc2xhdGUtOTUwLzQwXCIgZGF0YS10ZXN0aWQ9e2BwbHVnaW4tY29uZmlnLXBhbmVsLSR7cC5pZH1gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmaWVsZHMubGVuZ3RoID09PSAwID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS01MDAgaXRhbGljIHB5LTNcIj5ObyBjb25maWd1cmFibGUgb3B0aW9ucyBmb3IgdGhpcyBwbHVnLWluIHlldC48L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBtZDpncmlkLWNvbHMtMiBnYXAtMyBwdC0zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmaWVsZHMubWFwKGYgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdiA9IGZpZWxkVmFsKHAuaWQsIGYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17Zi5rZXl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJvbGQgdGV4dC1zbGF0ZS01MDAgYmxvY2sgbWItMVwiPntmLmxhYmVsfTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmLnR5cGUgPT09ICdzZWxlY3QnICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXQgY3Vyc29yLXBvaW50ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGVGaWVsZChwLmlkLCBmLmtleSwgZS50YXJnZXQudmFsdWUpfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi5vcHRpb25zLm1hcChvID0+IDxvcHRpb24ga2V5PXtvfSB2YWx1ZT17b30+e299PC9vcHRpb24+KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zi50eXBlID09PSAnbnVtYmVyJyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cIm51bWJlclwiIGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZUZpZWxkKHAuaWQsIGYua2V5LCArZS50YXJnZXQudmFsdWUpfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmLnR5cGUgPT09ICd0ZXh0JyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3Z9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGVGaWVsZChwLmlkLCBmLmtleSwgZS50YXJnZXQudmFsdWUpfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmLnR5cGUgPT09ICd0b2dnbGUnICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gdXBkYXRlRmllbGQocC5pZCwgZi5rZXksICF2KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdy1mdWxsIHB5LTIgcm91bmRlZC1sZyB0ZXh0LXhzIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBib3JkZXIgdHJhbnNpdGlvbi1hbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7dlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLXBpbmstNzAwLzQwIGJvcmRlci1waW5rLTUwMC82MCB0ZXh0LXBpbmstMjAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJ2JnLXNsYXRlLTgwMCBib3JkZXItc2xhdGUtNjAwIHRleHQtc2xhdGUtNDAwJ31gfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7diA/ICdPTicgOiAnT0ZGJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWVuZCBnYXAtMiBtdC00IHB0LTMgYm9yZGVyLXQgYm9yZGVyLXNsYXRlLTgwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlc2V0IHRoaXMgcGx1Zy1pbidzIGZpZWxkcyB0byBkZWZhdWx0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldENmZyhjID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV4dCA9IHsgLi4uKGMuZmllbGRzIHx8IHt9KSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgbmV4dFtwLmlkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgLi4uYywgZmllbGRzOiBuZXh0IH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtMyBweS0xLjUgcm91bmRlZC1tZCB0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGZvbnQtYmxhY2sgYm9yZGVyIGJvcmRlci1zbGF0ZS02MDAgdGV4dC1zbGF0ZS00MDAgaG92ZXI6Ymctc2xhdGUtODAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0KCdzd19yZXNldF9kZWZhdWx0cycpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gc2V0RXhwYW5kZWRJZChudWxsKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTMgcHktMS41IHJvdW5kZWQtbWQgdGV4dC1bMTBweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIGJnLXBpbmstNjAwIGhvdmVyOmJnLXBpbmstNTAwIHRleHQtd2hpdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3QoJ3N3X2RvbmUnKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC01IHAtNCBib3JkZXItMiBib3JkZXItZGFzaGVkIGJvcmRlci1zbGF0ZS03MDAgcm91bmRlZC14bCB0ZXh0LWNlbnRlciBob3Zlcjpib3JkZXItcGluay01MDAvNDAgdHJhbnNpdGlvbi1hbGwgY3Vyc29yLXBvaW50ZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtM3hsIG1iLTFcIj7ipLQ8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1ibGFjayB0ZXh0LXNsYXRlLTMwMFwiPkRyb3AgYSAucHkgLyAuemlwIC8gLnJlZDUgcGx1Zy1pbiBoZXJlPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMXB4XSB0ZXh0LXNsYXRlLTUwMCBtdC0xXCI+b3IgY2xpY2sgdG8gY2hvb3NlIGEgZmlsZSAobW9jayDigJQgbm90IHdpcmVkKTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvTW9kYWxTaGVsbD5cbiAgICApO1xufVxuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBNb2RhbCBTaGVsbCAtLSBzaGFyZWRcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbmZ1bmN0aW9uIE1vZGFsU2hlbGwoeyB0aXRsZSwgc3VidGl0bGUsIGFjY2VudD0naW5kaWdvJywgb25DbG9zZSwgb25TYXZlLCBzaXplPScnLCBjaGlsZHJlbiB9KSB7XG4gICAgY29uc3QgY29sb3JNYXAgPSB7XG4gICAgICAgIGluZGlnbzonIzgxOGNmOCcsIGFtYmVyOicjZmJiZjI0JywgZW1lcmFsZDonIzM0ZDM5OScsIHBpbms6JyNmNDcyYjYnXG4gICAgfTtcbiAgICBjb25zdCBjID0gY29sb3JNYXBbYWNjZW50XSB8fCAnIzgxOGNmOCc7XG4gICAgY29uc3Qgc2l6ZU1hcCA9IHtcbiAgICAgICAgd2lkZTogJ21heC13LTJ4bCcsXG4gICAgICAgIG1hcDogICdtYXgtdy0zeGwnLFxuICAgICAgICBtYXg6ICAnbWF4LXctWzk2dnddIHctWzk2dnddIGgtWzkydmhdJyxcbiAgICB9O1xuICAgIGNvbnN0IHdpZHRoID0gc2l6ZU1hcFtzaXplXSB8fCAnbWF4LXctbWQnO1xuICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZml4ZWQgaW5zZXQtMCB6LTUwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIG1vZGFsLWJhY2tkcm9wXCIgb25DbGljaz17b25DbG9zZX0+XG4gICAgICAgICAgICB7LyogRmxleC1jb2x1bW4gc2hlbGw6IGhlYWRlciAoZml4ZWQpICsgc2Nyb2xsYWJsZSBjb250ZW50ICsgc3RpY2t5IGZvb3Rlci5cbiAgICAgICAgICAgICAgICBDcml0aWNhbCBmb3Igc2l6ZT1cIm1heFwiIHdoZXJlIGNoaWxkcmVuIGFsb25lIGV4Y2VlZCB0aGUgbW9kYWwgaGVpZ2h0XG4gICAgICAgICAgICAgICAgYW5kIHdvdWxkIG90aGVyd2lzZSBwdXNoIHRoZSBTYXZlICYgcmV0dXJuIGJ1dHRvbiBiZWxvdyB0aGUgdmlld3BvcnQuICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BiZy1zbGF0ZS05MDAgYm9yZGVyLTIgcm91bmRlZC0yeGwgdy1mdWxsICR7d2lkdGh9IG14LTQgZmFkZS11cCBmbGV4IGZsZXgtY29sYH1cbiAgICAgICAgICAgICAgICAgb25DbGljaz17KGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCl9XG4gICAgICAgICAgICAgICAgIHN0eWxlPXt7Ym9yZGVyQ29sb3I6YCR7Y302NmAsIG1heEhlaWdodDogJzkydmgnfX0+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLXN0YXJ0IGp1c3RpZnktYmV0d2VlbiBwLTYgcGItNCBib3JkZXItYiBib3JkZXItc2xhdGUtODAwLzYwIHNocmluay0wXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1sZyBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3RcIiBzdHlsZT17e2NvbG9yOmN9fT57dGl0bGV9PC9oMz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1zbGF0ZS01MDAgbXQtMVwiPntzdWJ0aXRsZX08L3A+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwibW9kYWwtY2xvc2VcIiBvbkNsaWNrPXtvbkNsb3NlfSBjbGFzc05hbWU9XCJ0ZXh0LXNsYXRlLTUwMCBob3Zlcjp0ZXh0LXdoaXRlIHRleHQtMnhsIGxlYWRpbmctbm9uZVwiPsOXPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTEgbWluLWgtMCBvdmVyZmxvdy15LWF1dG8gcHgtNiBweS01XCI+XG4gICAgICAgICAgICAgICAgICAgIHtjaGlsZHJlbn1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktZW5kIGdhcC0zIHB4LTYgcHktNCBib3JkZXItdCBib3JkZXItc2xhdGUtODAwIHNocmluay0wIGJnLXNsYXRlLTkwMCByb3VuZGVkLWItMnhsXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJtb2RhbC1jYW5jZWxcIiBvbkNsaWNrPXtvbkNsb3NlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTQgcHktMiByb3VuZGVkLWxnIGJnLXNsYXRlLTgwMCBib3JkZXIgYm9yZGVyLXNsYXRlLTcwMCB0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgZm9udC1ibGFjayB0ZXh0LXNsYXRlLTQwMCBob3ZlcjpiZy1zbGF0ZS03MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0KCdjYW5jZWwnKX1cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJtb2RhbC1zYXZlXCIgb25DbGljaz17b25TYXZlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTUgcHktMiByb3VuZGVkLWxnIHRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBmb250LWJsYWNrIHRleHQtd2hpdGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7YmFja2dyb3VuZDpjLCBib3hTaGFkb3c6YDAgMCAxMnB4ICR7Y301NWB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0KCdzd19zYXZlX3JldHVybicpfVxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG4vKiBtb3VudCAqL1xuUmVhY3RET00uY3JlYXRlUm9vdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpKS5yZW5kZXIoPEFwcC8+KTtcbn0pKCk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLFlBQVk7RUFDYixJQUFBQSxNQUFBLEdBQThCQyxLQUFLO0lBQTNCQyxRQUFRLEdBQUFGLE1BQUEsQ0FBUkUsUUFBUTtJQUFFQyxPQUFPLEdBQUFILE1BQUEsQ0FBUEcsT0FBTzs7RUFFekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtFQUNBLElBQU1DLENBQUMsR0FBSUMsQ0FBQyxJQUFNLE9BQU9DLE1BQU0sS0FBSyxXQUFXLElBQUlBLE1BQU0sQ0FBQ0YsQ0FBQyxHQUFHRSxNQUFNLENBQUNGLENBQUMsQ0FBQ0MsQ0FBQyxDQUFDLEdBQUdBLENBQUU7RUFDOUUsSUFBTUUsT0FBTyxHQUFHQSxDQUFBLEtBQU8sT0FBT0QsTUFBTSxLQUFLLFdBQVcsSUFBSUEsTUFBTSxDQUFDQyxPQUFPLEdBQUdELE1BQU0sQ0FBQ0MsT0FBTyxDQUFDLENBQUMsR0FBRyxJQUFLOztFQUVqRztBQUNBO0FBQ0E7RUFDQSxJQUFNQyxLQUFLLEdBQUc7RUFDVjtBQUNKO0FBQ0E7QUFDQTtBQUNBO0VBQ0k7SUFBRUMsR0FBRyxFQUFDLEtBQUs7SUFBT0MsUUFBUSxFQUFDLGFBQWE7SUFBT0MsTUFBTSxFQUFDLGlCQUFpQjtJQUFPQyxJQUFJLEVBQUMsTUFBTTtJ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