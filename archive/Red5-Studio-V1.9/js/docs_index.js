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

  var docs = [
    {
      id:       'band-shift',
      title_en: 'B-Shift Insight',
      title_ko: 'B-\uc2dc\ud504\ud2b8 \ud1b5\ucc30',
      doc_en:   '/assets/erv_band_shift_insight.md',
      doc_ko:   '/assets/erv_band_shift_insight.ko.md',
      color:    '#22d3ee'
    },
    {
      id:       'psych-design',
      title_en: 'Psych Design Workflow',
      title_ko: '\uc2b5\uacf5\uae30\uc120\ub3c4 \uc124\uacc4 \uc6cc\ud06c\ud50c\ub85c',
      doc_en:   '/assets/psychrometric_design_workflow.md',
      doc_ko:   '/assets/psychrometric_design_workflow.ko.md',
      color:    '#f59e0b'
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
        if (s.lang === 'ko' || s.lang === 'en')   _state.lang     = s.lang;
      }
    } else {
      /* First open: inherit current app language. */
      try { var l = window.getLang ? window.getLang() : 'en'; _state.lang = l === 'ko' ? 'ko' : 'en'; } catch(_) {}
    }
  } catch(_) {}
  function _save(){
    try { localStorage.setItem('red5DocsIndexState', JSON.stringify(_state)); } catch(_) {}
  }

  /* Markdown cache: {docId: {en:'', ko:''}} */
  var cache = {};

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

  function _paint(){
    var p = _build();
    var titleLabel = _state.lang === 'ko' ? '\ubb38\uc11c \uc0c9\uc778' : 'Docs Index';
    var loadingLabel = _state.lang === 'ko' ? '\ub85c\ub529 \uc911\u2026' : 'Loading\u2026';
    var active = docs.find(function(d){ return d.id === _state.activeId; }) || docs[0];
    var md = cache[active.id] && cache[active.id][_state.lang];
    var body = md ? _renderMd(md) : '<div style="color:#94a3b8;padding:14px;font-size:10px">'+loadingLabel+'</div>';
    var langChip =
      '<div data-lang-toggle="1" style="display:inline-flex;border:1px solid #475569;border-radius:3px;overflow:hidden;font-size:8px;font-weight:900;letter-spacing:.05em">'+
        '<span data-set-lang="en" style="padding:1px 6px;cursor:pointer;background:'+(_state.lang==='en'?'#60a5fa':'transparent')+';color:'+(_state.lang==='en'?'#0f172a':'#94a3b8')+'">EN</span>'+
        '<span data-set-lang="ko" style="padding:1px 6px;cursor:pointer;background:'+(_state.lang==='ko'?'#60a5fa':'transparent')+';color:'+(_state.lang==='ko'?'#0f172a':'#94a3b8')+'">\ud55c\uad6d\uc5b4</span>'+
      '</div>';
    var tabs = docs.map(function(d){
      var on = d.id === _state.activeId;
      var label = _state.lang === 'ko' ? d.title_ko : d.title_en;
      return '<button data-tab="'+d.id+'" style="background:'+(on?d.color:'transparent')+';border:1px solid '+d.color+';color:'+(on?'#0f172a':d.color)+';padding:4px 10px;font:900 9px Courier New;cursor:pointer;border-radius:4px 4px 0 0;letter-spacing:.05em;text-transform:uppercase;border-bottom:none">'+label+'</button>';
    }).join('');
    popup.innerHTML =
      '<div data-hdr="1" style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 12px;background:rgba(96,165,250,.10);border-bottom:1px solid #1e3a8a;cursor:move;flex-shrink:0">'+
        '<div style="display:flex;align-items:center;gap:10px">'+
          '<div style="color:#60a5fa;font-weight:900;font-size:11px;letter-spacing:.10em;text-transform:uppercase">\ud83d\udcda '+titleLabel+'</div>'+
          langChip+
        '</div>'+
        '<button data-close="1" title="Close" style="background:transparent;border:1px solid #475569;color:#fb7185;padding:0 7px;font:900 12px Courier New;cursor:pointer;border-radius:2px">\u2715</button>'+
      '</div>'+
      '<div data-tabs="1" style="display:flex;gap:2px;padding:6px 10px 0;background:rgba(15,23,42,.4);flex-shrink:0;border-bottom:1px solid #1e3a8a">'+tabs+'</div>'+
      '<div style="flex:1;overflow-y:auto;padding:10px 16px;color:#cbd5e1">'+body+'</div>';
    /* Wire drag (header) */
    var hdr = popup.querySelector('[data-hdr]');
    if (hdr) hdr.addEventListener('mousedown', function(e){
      if (e.target.closest('button, [data-lang-toggle], [data-set-lang]')) return;
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
    /* Tab switching */
    popup.querySelectorAll('[data-tab]').forEach(function(b){
      b.addEventListener('click', function(){
        _state.activeId = b.getAttribute('data-tab');
        _save();
        _ensureLoaded();
      });
    });
    /* Language toggle */
    popup.querySelectorAll('[data-set-lang]').forEach(function(el){
      el.addEventListener('click', function(){
        var newLang = el.getAttribute('data-set-lang');
        if (newLang === _state.lang) return;
        _state.lang = newLang;
        _save();
        _ensureLoaded();
      });
    });
  }

  function _ensureLoaded(){
    var active = docs.find(function(d){ return d.id === _state.activeId; }) || docs[0];
    cache[active.id] = cache[active.id] || {};
    if (cache[active.id][_state.lang]) { _paint(); return; }
    _paint();  /* loading state */
    /* Cache-bust with timestamp so stale browser caches / proxy caches
       (the controller sets Cache-Control: public,max-age=3600 on .md)
       don't serve old 404s.  Trying again with a fresh URL guarantees a
       network hit. */
    var base = _state.lang === 'ko' ? active.doc_ko : active.doc_en;
    var url = base + (base.indexOf('?') >= 0 ? '&' : '?') + 'ts=' + Date.now();
    fetch(url, {cache:'no-store'})
      .then(function(r){ return r.ok ? r.text() : Promise.reject(r.status); })
      .then(function(txt){ cache[active.id][_state.lang] = txt; _paint(); })
      .catch(function(err){
        /* Show a retry-able error.  Do NOT cache the failure -- next
           tab click or popup re-open should try the fetch again. */
        var p = _build();
        var msg_en = '# Unable to load doc\n\nFile fetch failed (' + err + ').\n\n*Click the tab again to retry, or hard-refresh the page (Ctrl+Shift+R) to clear any stale browser cache.*';
        var msg_ko = '# \ubb38\uc11c \ub85c\ub4dc \uc2e4\ud328\n\n\ud30c\uc77c \uac00\uc838\uc624\uae30 \uc2e4\ud328 (' + err + ').\n\n*\ud0ed\uc744 \ub2e4\uc2dc \ud074\ub9ad\ud558\uac70\ub098 \ud558\ub4dc \uc0c8\ub85c\uace0\uce68 (Ctrl+Shift+R) \ud574\uc8fc\uc138\uc694.*';
        var body = _renderMd(_state.lang === 'ko' ? msg_ko : msg_en);
        /* Skip the cache so retry works; just paint the error transient. */
        var bodyEl = p.querySelector('div[style*="overflow-y:auto"]');
        if (bodyEl) bodyEl.innerHTML = body;
      });
  }

  function open(){
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
      newLang = (newLang === 'ko') ? 'ko' : 'en';
      if (newLang === _state.lang) return;
      _state.lang = newLang;
      _save();
      if (popup && popup.style.display !== 'none') _ensureLoaded();
    } catch(_) {}
  });

  window.red5DocsIndex = { open: open, close: close, register: register };
})();
