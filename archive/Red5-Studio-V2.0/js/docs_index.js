/* docs_index.js — standalone draggable tabbed docs popup.
 *
 * Public API:
 *   window.red5DocsIndex.open()  -- opens the popup, focuses last-active tab
 *   window.red5DocsIndex.close() -- hides the popup
 *   window.red5DocsIndex.register({id, title_en, title_ko, doc_en, doc_ko}) -- add a doc
 *
 * The default docs registry includes the band-shift insight and the
 * psych-design workflow.  Other pages/modules can call register() to
 * add their own docs (e.g., bridge_service docs, repair-mode runbook).
 *
 * Persists position + active tab + language under
 * `localStorage.red5DocsIndexState`.  No external dependencies; mounts
 * to document.body so it survives tab changes in the parent React app.
 */
(function(){
  if (window.red5DocsIndex) return;  /* prevent double-mount on hot reload */

  /* ----------------------------------------------------------------------
     Supported languages.  Order = display order in the dropdown.
     The 'code' field is what gets persisted in state.lang and used as
     the suffix in doc filenames:  <base>.<code>.md   (e.g. g36_reset.ko.md).
     English is the special case: the filename is just <base>.md  (no suffix)
     because that's how the originals already live on disk.
     ---------------------------------------------------------------------- */
  var LANGS = [
    { code: 'en',    native: 'English',           short: 'EN' },
    { code: 'ko',    native: '\ud55c\uad6d\uc5b4', short: 'KO' },
    { code: 'ja',    native: '\u65e5\u672c\u8a9e', short: 'JA' },
    { code: 'zh-CN', native: '\u7b80\u4f53\u4e2d\u6587', short: 'ZH-CN' },
    { code: 'zh-TW', native: '\u7e41\u9ad4\u4e2d\u6587', short: 'ZH-TW' },
  ];
  function _isValidLang(c){ return LANGS.some(function(L){ return L.code === c; }); }

  /* ----------------------------------------------------------------------
     Docs registry.  Each doc now carries:
       - `titles`:  {code -> string}.  Missing language keys fall back to
                    titles.en, so partial translations don't break the UI.
       - `doc_base`: path prefix without extension.  Resolution rule below.
     Filename resolution for a given lang `L`:
       1) try   <doc_base>.<L>.md
       2) on 404, fall back to <doc_base>.md   (English original)
       3) on 404 again, show the existing error block.
     ---------------------------------------------------------------------- */
  var docs = [
    {
      id:       'band-shift',
      titles: {
        'en':    'B-Shift Insight',
        'ko':    'B-\uc2dc\ud504\ud2b8 \ud1b5\ucc30',
      },
      doc_base: '/assets/erv_band_shift_insight',
      color:    '#22d3ee'
    },
    {
      id:       'psych-design',
      titles: {
        'en':    'Psych Design Workflow',
        'ko':    '\uc2b5\uacf5\uae30\uc120\ub3c4 \uc124\uacc4 \uc6cc\ud06c\ud50c\ub85c',
      },
      doc_base: '/assets/psychrometric_design_workflow',
      color:    '#f59e0b'
    },
    /* --- Engineer-credibility / standards docs (added Phase L.7). --- */
    {
      id:       'g36-reset',
      titles: {
        'en':    '\ud83d\udcd8 G36 Cross-Walk',
        'ko':    '\ud83d\udcd8 G36 \ub300\uc870\ud45c',
        'ja':    '\ud83d\udcd8 G36 \u30af\u30ed\u30b9\u30a6\u30a9\u30fc\u30af',
        'zh-CN': '\ud83d\udcd8 G36 \u4ea4\u53c9\u5bf9\u7167\u8868',
        'zh-TW': '\ud83d\udcd8 G36 \u4ea4\u53c9\u5c0d\u7167\u8868',
      },
      doc_base: '/assets/g36_reset',
      color:    '#a78bfa'
    },
    {
      id:       'band-guide',
      titles: {
        'en':    'Band Guide',
        'ko':    '\ubc34\ub4dc \uac00\uc774\ub4dc',
        'ja':    '\u30d0\u30f3\u30c9\u30ac\u30a4\u30c9',
        'zh-CN': '\u533a\u95f4\u6307\u5357',
        'zh-TW': '\u5340\u9593\u6307\u5357',
      },
      doc_base: '/assets/band_guide',
      color:    '#34d399'
    },
    {
      id:       'ctrl-algorithms',
      titles: {
        'en':    'Control Algorithms',
        'ko':    '\uc81c\uc5b4 \uc54c\uace0\ub9ac\uc998',
        'ja':    '\u5236\u5fa1\u30a2\u30eb\u30b4\u30ea\u30ba\u30e0',
        'zh-CN': '\u63a7\u5236\u7b97\u6cd5',
        'zh-TW': '\u63a7\u5236\u6f14\u7b97\u6cd5',
      },
      doc_base: '/assets/control_algorithms',
      color:    '#34d399'
    },
    /* ASHRAE Standard 55 reference — the authoritative source for the
       21..27 °C T·CLIP and 40..60 % RH band defaults used throughout
       the dashboard.  Added 2026-06-20 alongside the T·CLIP slider so
       operators can click straight from the slider's context into the
       standard's reasoning. */
    {
      id:       'ashrae-55',
      titles: {
        'en':    '\ud83d\udcd8 ASHRAE 55 Reference',
      },
      doc_base: '/assets/ashrae_55_reference',
      color:    '#ec4899'
    }
  ];

  /* Persisted state */
  var _state = { pos: null, activeId: 'band-shift', lang: 'en' };
  try {
    var raw = localStorage.getItem('red5DocsIndexState');
    if (raw) {
      var s = JSON.parse(raw);
      if (s && typeof s === 'object') {
        if (s.pos && typeof s.pos.x === 'number') _state.pos = s.pos;
        if (typeof s.activeId === 'string')       _state.activeId = s.activeId;
        if (typeof s.lang === 'string' && _isValidLang(s.lang)) _state.lang = s.lang;
      }
    } else {
      /* First open: inherit current app language if it's one we support. */
      try {
        var l = window.getLang ? window.getLang() : 'en';
        if (_isValidLang(l)) _state.lang = l;
      } catch(_) {}
    }
  } catch(_) {}
  function _save(){
    try { localStorage.setItem('red5DocsIndexState', JSON.stringify(_state)); } catch(_) {}
  }

  /* ----------------------------------------------------------------------
     Title + URL resolvers.  Centralized so every render path uses the
     same fall-back rule:  requested-lang -> en.  Doc URLs append a
     timestamp cache-buster only at fetch time (see _ensureLoaded). */
  function _docTitle(doc, lang){
    if (doc.titles && doc.titles[lang]) return doc.titles[lang];
    if (doc.titles && doc.titles.en)    return doc.titles.en;
    /* Legacy compat with the old title_en/title_ko shape, just in case
       a third-party caller still uses register({title_en, …}). */
    if (doc['title_' + lang]) return doc['title_' + lang];
    return doc.title_en || doc.id;
  }
  function _docUrl(doc, lang){
    /* New shape: doc_base + lang suffix.  English uses no suffix because
       all originals on disk are named <base>.md without an ".en". */
    if (doc.doc_base) {
      return (lang === 'en') ? (doc.doc_base + '.md')
                             : (doc.doc_base + '.' + lang + '.md');
    }
    /* Legacy compat with doc_en / doc_ko. */
    return doc['doc_' + lang] || doc.doc_en;
  }
  function _docFallbackUrl(doc){
    if (doc.doc_base) return doc.doc_base + '.md';
    return doc.doc_en;
  }

  /* Markdown cache: {docId: {en:'', ko:''}} */
  var cache = {};

  /* Inject the @media print stylesheet once.  Kept lazy so a page that
     never opens the docs popup pays zero cost.  The stylesheet does
     three things:
       1. Hide everything in the document that ISN'T inside the popup so
          the dashboard chrome, charts, sidebar, etc. don't get printed.
       2. Reset the popup's fixed positioning + glass-morphism so it
          flows naturally down printable pages without scrollbars.
       3. Restyle the body content into a print-friendly serif typography
          with a small Red5 footer caption on every page.
     `data-printing="1"` on the popup acts as the activation switch so
     the print rules don't apply when window.print() is triggered by
     anything else (e.g., browser Ctrl+P on the dashboard itself). */
  function _ensurePrintCss(){
    if (document.getElementById('red5-docs-print-css')) return;
    var css = ''
      + '@media print {\n'
      + '  /* Hide ALL siblings of the popup but keep ancestors visible. */\n'
      + '  body * { visibility: hidden !important; }\n'
      + '  #red5-docs-index[data-printing="1"],\n'
      + '  #red5-docs-index[data-printing="1"] * { visibility: visible !important; }\n'
      + '  /* Un-position so it flows down full printable width. */\n'
      + '  #red5-docs-index[data-printing="1"] {\n'
      + '    position: absolute !important;\n'
      + '    left: 0 !important; top: 0 !important;\n'
      + '    width: 100% !important; height: auto !important;\n'
      + '    background: #ffffff !important; color: #0f172a !important;\n'
      + '    border: none !important; box-shadow: none !important;\n'
      + '    backdrop-filter: none !important; overflow: visible !important;\n'
      + '    font-family: Georgia, "Times New Roman", serif !important;\n'
      + '  }\n'
      + '  /* Hide the header + tab bar — engineers don\'t want the chrome\n'
      + '     in their printed copy, just the body content. */\n'
      + '  #red5-docs-index[data-printing="1"] [data-hdr],\n'
      + '  #red5-docs-index[data-printing="1"] [data-tabs] { display: none !important; }\n'
      + '  /* Body styling — print-friendly typography. */\n'
      + '  #red5-docs-index[data-printing="1"] > div:last-child {\n'
      + '    overflow: visible !important;\n'
      + '    color: #0f172a !important;\n'
      + '    padding: 0 !important;\n'
      + '    font-size: 11pt !important;\n'
      + '    line-height: 1.55 !important;\n'
      + '  }\n'
      + '  #red5-docs-index[data-printing="1"] h1,\n'
      + '  #red5-docs-index[data-printing="1"] h2,\n'
      + '  #red5-docs-index[data-printing="1"] h3,\n'
      + '  #red5-docs-index[data-printing="1"] b,\n'
      + '  #red5-docs-index[data-printing="1"] strong { color: #0f172a !important; }\n'
      + '  #red5-docs-index[data-printing="1"] code,\n'
      + '  #red5-docs-index[data-printing="1"] pre {\n'
      + '    background: #f1f5f9 !important;\n'
      + '    color: #0f172a !important;\n'
      + '    border-color: #cbd5e1 !important;\n'
      + '    page-break-inside: avoid;\n'
      + '  }\n'
      + '  #red5-docs-index[data-printing="1"] table {\n'
      + '    page-break-inside: avoid;\n'
      + '    border-collapse: collapse;\n'
      + '  }\n'
      + '  /* Red5 footer on every printed page. */\n'
      + '  @page {\n'
      + '    margin: 20mm 15mm 18mm 15mm;\n'
      + '    size: A4 portrait;\n'
      + '  }\n'
      + '  @page :first { margin-top: 22mm; }\n'
      + '  /* "Red5 Studio" caption rendered at the top of every page via\n'
      + '     a fixed-position div the browser places under @page margin.\n'
      + '     Works in Chrome/Edge; Firefox falls back to its own header. */\n'
      + '  #red5-print-caption {\n'
      + '    position: fixed; top: 0; left: 0; right: 0;\n'
      + '    font: 700 9pt Georgia, serif; color: #64748b;\n'
      + '    border-bottom: 1px solid #cbd5e1;\n'
      + '    padding: 4mm 0 2mm; text-align: center;\n'
      + '    visibility: visible !important;\n'
      + '  }\n'
      + '}\n'
      + '@media screen { #red5-print-caption { display: none; } }\n';
    var style = document.createElement('style');
    style.id = 'red5-docs-print-css';
    style.textContent = css;
    document.head.appendChild(style);
    /* Add a tiny caption element to body so the @page header is consistent
       across browsers.  Browsers that ignore fixed-position-in-print fall
       back to their own URL/timestamp header — still readable. */
    if (!document.getElementById('red5-print-caption')) {
      var cap = document.createElement('div');
      cap.id = 'red5-print-caption';
      cap.textContent = 'Red5 Studio \u2014 AHU Diagnostic Hub \u2014 Standards Reference';
      document.body.appendChild(cap);
    }
  }

  /* Tiny markdown -> HTML renderer (mirrors the one in psy-3d-engine.js;
     kept inline to keep this file standalone and loadable from any page). */
  function _renderMd(md){
    function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
    function inline(s){
      s = esc(s);
      s = s.replace(/`([^`]+)`/g, '<code style="background:#020617;border:1px solid #334155;border-radius:2px;padding:0 3px;font-size:9px;color:#fbbf24">$1</code>');
      s = s.replace(/\*\*([^*]+)\*\*/g, '<b style="color:#e2e8f0">$1</b>');
      s = s.replace(/\*([^*]+)\*/g, '<i>$1</i>');
      return s;
    }
    var lines = md.split('\n'), out = [], i = 0;
    while (i < lines.length) {
      var L = lines[i];
      if (/^```/.test(L)) {
        var code = []; i++;
        while (i < lines.length && !/^```/.test(lines[i])) { code.push(esc(lines[i])); i++; }
        out.push('<pre style="background:#020617;border:1px solid #334155;border-radius:4px;padding:8px;overflow-x:auto;font-size:9px;line-height:1.5;color:#94a3b8">'+code.join('\n')+'</pre>');
        i++; continue;
      }
      if (/^\s*\|.*\|\s*$/.test(L) && i+1<lines.length && /^\s*\|[\s\-:|]+\|\s*$/.test(lines[i+1])) {
        var rows = [L]; i += 2;
        while (i<lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) { rows.push(lines[i]); i++; }
        var parsed = rows.map(function(r){ return r.replace(/^\s*\|/,'').replace(/\|\s*$/,'').split('|').map(function(c){return c.trim();}); });
        var head = parsed.shift();
        out.push('<table style="border-collapse:collapse;width:100%;font-size:9px;margin:6px 0"><thead><tr>'+
          head.map(function(h){return '<th style="border:1px solid #334155;padding:4px 6px;text-align:left;background:#1e293b;color:#e2e8f0">'+inline(h)+'</th>';}).join('')+
          '</tr></thead><tbody>'+
          parsed.map(function(r){return '<tr>'+r.map(function(c){return '<td style="border:1px solid #334155;padding:4px 6px">'+inline(c)+'</td>';}).join('')+'</tr>';}).join('')+
          '</tbody></table>');
        continue;
      }
      if (/^# /.test(L))      { out.push('<h2 style="color:#60a5fa;font-size:13px;font-weight:900;margin:8px 0 4px;border-bottom:1px solid #1e293b;padding-bottom:3px">'+inline(L.slice(2))+'</h2>'); i++; continue; }
      if (/^## /.test(L))     { out.push('<h3 style="color:#22d3ee;font-size:11px;font-weight:900;margin:8px 0 3px;letter-spacing:.05em;text-transform:uppercase">'+inline(L.slice(3))+'</h3>'); i++; continue; }
      if (/^### /.test(L))    { out.push('<h4 style="color:#fbbf24;font-size:10px;font-weight:900;margin:6px 0 2px">'+inline(L.slice(4))+'</h4>'); i++; continue; }
      if (/^> /.test(L))      { out.push('<blockquote style="border-left:3px solid #60a5fa;padding:2px 8px;margin:4px 0;background:rgba(96,165,250,.05);color:#cbd5e1;font-style:italic;font-size:10px">'+inline(L.slice(2))+'</blockquote>'); i++; continue; }
      if (/^---+$/.test(L))   { out.push('<hr style="border:none;border-top:1px dashed #334155;margin:8px 0"/>'); i++; continue; }
      if (/^\s*-\s+/.test(L)) {
        var items = [];
        while (i<lines.length && /^\s*-\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*-\s+/,'')); i++; }
        out.push('<ul style="margin:4px 0 4px 14px;padding:0;font-size:10px;line-height:1.55">'+items.map(function(it){return '<li style="margin:2px 0">'+inline(it)+'</li>';}).join('')+'</ul>');
        continue;
      }
      if (/^\s*\d+\.\s+/.test(L)) {
        var items2 = [];
        while (i<lines.length && /^\s*\d+\.\s+/.test(lines[i])) { items2.push(lines[i].replace(/^\s*\d+\.\s+/,'')); i++; }
        out.push('<ol style="margin:4px 0 4px 16px;padding:0;font-size:10px;line-height:1.55">'+items2.map(function(it){return '<li style="margin:2px 0">'+inline(it)+'</li>';}).join('')+'</ol>');
        continue;
      }
      if (/^\s*$/.test(L)) { out.push(''); i++; continue; }
      out.push('<p style="margin:3px 0;font-size:10px;line-height:1.55">'+inline(L)+'</p>');
      i++;
    }
    return out.join('\n');
  }

  /* Build (or rebuild) the popup DOM. */
  var popup = null;
  function _build(){
    if (popup) return popup;
    popup = document.createElement('div');
    popup.id = 'red5-docs-index';
    popup.style.cssText =
      'position:fixed;width:640px;height:520px;z-index:9999;display:none;'+
      'background:rgba(15,23,42,.96);border:1px solid #60a5fa;border-radius:8px;'+
      'box-shadow:0 12px 40px rgba(0,0,0,.6);backdrop-filter:blur(16px);'+
      'font-family:\'Courier New\',monospace;color:#cbd5e1;overflow:hidden;'+
      'flex-direction:column';
    document.body.appendChild(popup);
    return popup;
  }

  /* Locale-aware UI strings for the popup chrome.  Only the labels the
     operator actually sees — body text comes from the .md files.
     Languages without an entry fall back to English. */
  var UI_STRINGS = {
    title:   { en: 'Docs Index',   ko: '\ubb38\uc11c \uc0c9\uc778', ja: '\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8',     'zh-CN': '\u6587\u6863\u7d22\u5f15',     'zh-TW': '\u6587\u4ef6\u7d22\u5f15' },
    loading: { en: 'Loading\u2026', ko: '\ub85c\ub529 \uc911\u2026', ja: '\u8aad\u307f\u8fbc\u307f\u4e2d\u2026', 'zh-CN': '\u52a0\u8f7d\u4e2d\u2026',     'zh-TW': '\u8f09\u5165\u4e2d\u2026' },
    fallback:{ en: '(English fallback \u2014 translation pending)', ko: '(\uc601\uc5b4\ub85c \ud45c\uc2dc \u2014 \ubc88\uc5ed \uc900\ube44 \uc911)', ja: '(\u82f1\u8a9e\u3067\u8868\u793a\u2014\u7ffb\u8a33\u6e96\u5099\u4e2d)', 'zh-CN': '(\u663e\u793a\u82f1\u6587\u2014\u7ffb\u8bd1\u51c6\u5907\u4e2d)', 'zh-TW': '(\u986f\u793a\u82f1\u6587\u2014\u7ffb\u8b6f\u6e96\u5099\u4e2d)' },
  };
  function _ui(key){
    var bag = UI_STRINGS[key] || {};
    return bag[_state.lang] || bag.en || '';
  }

  function _paint(){
    var p = _build();
    var titleLabel = _ui('title');
    var loadingLabel = _ui('loading');
    var active = docs.find(function(d){ return d.id === _state.activeId; }) || docs[0];
    var md = cache[active.id] && cache[active.id][_state.lang];
    var fellBack = cache[active.id] && cache[active.id][_state.lang + '__fallback'];
    var fallbackBanner = fellBack
      ? '<div style="background:rgba(251,191,36,.10);border:1px dashed #fbbf24;color:#fbbf24;padding:6px 10px;margin:0 0 8px;font-size:9px;border-radius:3px">\u26a0\ufe0f '+_ui('fallback')+'</div>'
      : '';
    var body = md
      ? (fallbackBanner + _renderMd(md))
      : '<div style="color:#94a3b8;padding:14px;font-size:10px">'+loadingLabel+'</div>';
    /* Language dropdown — single <select> with native language names so
       the operator picks a language that reads naturally in their tongue,
       not via a guess-the-flag.  Wider than the old 2-button chip but
       still compact at ~110-130 px depending on the chosen language. */
    var langOpts = LANGS.map(function(L){
      var sel = (L.code === _state.lang) ? ' selected' : '';
      return '<option value="'+L.code+'"'+sel+'>'+L.native+'</option>';
    }).join('');
    var langChip =
      '<select data-lang-select="1" title="Document language" '+
              'style="background:#1e293b;border:1px solid #475569;border-radius:3px;'+
                     'color:#cbd5e1;font:900 9px Courier New;letter-spacing:.05em;'+
                     'padding:2px 4px;cursor:pointer;outline:none">'+langOpts+'</select>';
    var tabs = docs.map(function(d){
      var on = d.id === _state.activeId;
      var label = _docTitle(d, _state.lang);
      return '<button data-tab="'+d.id+'" style="background:'+(on?d.color:'transparent')+';border:1px solid '+d.color+';color:'+(on?'#0f172a':d.color)+';padding:4px 10px;font:900 9px Courier New;cursor:pointer;border-radius:4px 4px 0 0;letter-spacing:.05em;text-transform:uppercase;border-bottom:none">'+label+'</button>';
    }).join('');
    var hdrHTML =
      '<div data-hdr="1" style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 12px;background:rgba(96,165,250,.10);border-bottom:1px solid #1e3a8a;cursor:move;flex-shrink:0">'+
        '<div style="display:flex;align-items:center;gap:10px">'+
          '<div style="color:#60a5fa;font-weight:900;font-size:11px;letter-spacing:.10em;text-transform:uppercase">\ud83d\udcda '+titleLabel+'</div>'+
          langChip+
        '</div>'+
        '<div style="display:flex;align-items:center;gap:6px">'+
          /* Print button — uses the @media print stylesheet injected below
             so engineers can save / pin a clean copy of any standards doc.
             window.print() is safer than a manual PDF render because it
             respects the operator's browser printer settings (paper size,
             margins, headers/footers) and offers "Save as PDF" on every
             modern browser without any extra deps. */
          '<button data-print="1" title="Print or Save as PDF" style="background:transparent;border:1px solid #475569;color:#cbd5e1;padding:0 7px;font:900 11px Courier New;cursor:pointer;border-radius:2px;line-height:1.6">\ud83d\udda8\ufe0f Print</button>'+
          '<button data-close="1" title="Close" style="background:transparent;border:1px solid #475569;color:#fb7185;padding:0 7px;font:900 12px Courier New;cursor:pointer;border-radius:2px">\u2715</button>'+
        '</div>'+
      '</div>';
    popup.innerHTML =
      hdrHTML+
      '<div data-tabs="1" style="display:flex;flex-wrap:wrap;gap:2px;padding:6px 10px 0;background:rgba(15,23,42,.4);flex-shrink:0;border-bottom:1px solid #1e3a8a">'+tabs+'</div>'+
      '<div style="flex:1;overflow-y:auto;padding:10px 16px;color:#cbd5e1">'+body+'</div>';
    /* Wire drag (header) */
    var hdr = popup.querySelector('[data-hdr]');
    if (hdr) hdr.addEventListener('mousedown', function(e){
      if (e.target.closest('button, select, [data-lang-select]')) return;
      e.preventDefault();
      var sx = e.clientX, sy = e.clientY;
      var r = popup.getBoundingClientRect();
      var origX = r.left, origY = r.top;
      function mv(ev){
        var nx = Math.max(0, Math.min(window.innerWidth - 80,  origX + (ev.clientX - sx)));
        var ny = Math.max(0, Math.min(window.innerHeight - 40, origY + (ev.clientY - sy)));
        _state.pos = {x:nx, y:ny};
        popup.style.left = nx+'px';
        popup.style.top  = ny+'px';
      }
      function up(){
        window.removeEventListener('mousemove', mv);
        window.removeEventListener('mouseup', up);
        _save();
      }
      window.addEventListener('mousemove', mv);
      window.addEventListener('mouseup', up);
    });
    /* Close */
    var closeBtn = popup.querySelector('[data-close]');
    if (closeBtn) closeBtn.addEventListener('click', function(){ popup.style.display = 'none'; });
    /* Print / Save as PDF.  We mark the popup so the @media print
       stylesheet (_ensurePrintCss) knows to (a) hide everything else on
       the page, (b) un-position the popup so it flows down a full page,
       (c) restyle into a print-friendly serif typography with a Red5
       footer.  The marker is removed in the afterprint event so the
       on-screen layout snaps right back. */
    var printBtn = popup.querySelector('[data-print]');
    if (printBtn) printBtn.addEventListener('click', function(){
      _ensurePrintCss();
      var docTitle = _docTitle(active, _state.lang) || 'Red5 Standards';
      var originalTitle = document.title;
      document.title = 'Red5 \u2014 ' + docTitle;   /* shows up in PDF header */
      popup.setAttribute('data-printing', '1');
      function afterPrint(){
        popup.removeAttribute('data-printing');
        document.title = originalTitle;
        window.removeEventListener('afterprint', afterPrint);
      }
      window.addEventListener('afterprint', afterPrint);
      window.print();
    });
    /* Tab switching */
    popup.querySelectorAll('[data-tab]').forEach(function(b){
      b.addEventListener('click', function(){
        _state.activeId = b.getAttribute('data-tab');
        _save();
        _ensureLoaded();
      });
    });
    /* Language dropdown — change handler routes through _ensureLoaded()
       so the active doc auto-refetches in the new language (with EN
       fallback if the translated file is missing). */
    var langSel = popup.querySelector('[data-lang-select]');
    if (langSel) langSel.addEventListener('change', function(){
      var newLang = langSel.value;
      if (!_isValidLang(newLang) || newLang === _state.lang) return;
      _state.lang = newLang;
      _save();
      _ensureLoaded();
    });
  }

  function _ensureLoaded(){
    var active = docs.find(function(d){ return d.id === _state.activeId; }) || docs[0];
    cache[active.id] = cache[active.id] || {};
    if (cache[active.id][_state.lang]) { _paint(); return; }
    _paint();  /* loading state */
    /* Resolution chain: try the requested lang first; on 404 fall back
       silently to English so partial translations don't strand the
       operator on an error block.  The `__fallback` marker tells _paint
       to show a small "(English fallback — translation pending)" banner
       above the body so the operator knows they're not actually seeing
       a translation. */
    var primaryUrl = _docUrl(active, _state.lang);
    var enUrl      = _docFallbackUrl(active);
    var cb         = (primaryUrl.indexOf('?') >= 0 ? '&' : '?') + 'ts=' + Date.now();
    fetch(primaryUrl + cb, {cache:'no-store'})
      .then(function(r){
        if (r.ok) return r.text().then(function(txt){
          cache[active.id][_state.lang] = txt;
          /* Clear any fallback marker -- we got the real translation. */
          delete cache[active.id][_state.lang + '__fallback'];
          _paint();
        });
        /* If same URL as the EN fallback, skip the retry (real 404). */
        if (primaryUrl === enUrl) return Promise.reject(r.status);
        /* Try English fallback. */
        return fetch(enUrl + (enUrl.indexOf('?') >= 0 ? '&' : '?') + 'ts=' + Date.now(), {cache:'no-store'})
          .then(function(r2){
            if (!r2.ok) return Promise.reject(r2.status);
            return r2.text();
          })
          .then(function(txt){
            cache[active.id][_state.lang] = txt;
            cache[active.id][_state.lang + '__fallback'] = true;
            _paint();
          });
      })
      .catch(function(err){
        var p = _build();
        var msg = '# Unable to load doc\n\nFile fetch failed (' + err + ').\n\n*Click the tab again to retry, or hard-refresh the page (Ctrl+Shift+R) to clear any stale browser cache.*';
        var body = _renderMd(msg);
        var bodyEl = p.querySelector('div[style*="overflow-y:auto"]');
        if (bodyEl) bodyEl.innerHTML = body;
      });
  }

  function open(opts){
    /* `opts` may be:
         - undefined / null       -> open with last-active tab
         - a string id            -> open and focus that tab (e.g. 'g36-reset')
         - {id:'…'} object        -> same as string form (lets callers stay future-proof)
       Unknown ids silently fall back to the last-active tab so a typo never
       lands the user on an error popup. */
    var wantId = (typeof opts === 'string') ? opts : (opts && opts.id);
    if (wantId && docs.some(function(d){ return d.id === wantId; })) {
      _state.activeId = wantId;
      _save();
    }
    var p = _build();
    p.style.display = 'flex';
    if (_state.pos) {
      p.style.left = _state.pos.x+'px';
      p.style.top  = _state.pos.y+'px';
    } else {
      /* Default to centered. */
      p.style.left = Math.max(0, (window.innerWidth  - 640) / 2) + 'px';
      p.style.top  = Math.max(0, (window.innerHeight - 520) / 2) + 'px';
    }
    _ensureLoaded();
  }
  function close(){ if (popup) popup.style.display = 'none'; }
  function register(opts){
    if (!opts || !opts.id) return;
    /* Replace existing or append */
    var idx = docs.findIndex(function(d){ return d.id === opts.id; });
    if (idx >= 0) docs[idx] = opts; else docs.push(opts);
    if (popup && popup.style.display !== 'none') _paint();
  }
  /* Listen for app-wide language changes; refresh only when open. */
  window.addEventListener('langchange', function(){
    try {
      var newLang = window.getLang ? window.getLang() : 'en';
      if (!_isValidLang(newLang)) newLang = 'en';
      if (newLang === _state.lang) return;
      _state.lang = newLang;
      _save();
      if (popup && popup.style.display !== 'none') _ensureLoaded();
    } catch(_) {}
  });

  window.red5DocsIndex = { open: open, close: close, register: register };
})();
