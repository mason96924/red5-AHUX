/* Red5 Studio — G36 Mode Timeline Strip (Phase 3a UI).
 *
 * Renders a thin color-coded ribbon at the bottom of the PSYCH tab
 * showing how each AHU's ASHRAE 36 operating mode has rotated through
 * the last 60 minutes.  One row per AHU, segmented and colored by mode:
 *
 *   green   = occupied
 *   amber   = warm_up
 *   cyan    = cool_down / pre_cooling
 *   slate   = setback / setup / unoccupied
 *   red     = freeze_protection
 *
 * Hover any segment to see the mode + start ts + duration.  The strip
 * polls `/api/g36/history/{ahu_id}` for each AHU once per 30s and only
 * mounts when the PSYCH tab is visible (so the DIAG / DYNAM / 3D WX
 * tabs stay uncluttered).
 *
 * Self-contained IIFE.  Listens for /api/data poll completions (via the
 * existing `__v2_ahuData` reflection) so the strip rows match whatever
 * AHU list the dashboard is showing.
 */
(function () {
  'use strict';

  var API_BASE = (function () {
    try {
      if (window.REACT_APP_BACKEND_URL) return window.REACT_APP_BACKEND_URL;
      if (window.API_BASE_URL)          return window.API_BASE_URL;
    } catch (_) {}
    return window.location.origin;
  })();

  var WINDOW_MIN = 60;
  var REFRESH_MS = 30 * 1000;

  var MODE_COLORS = {
    occupied:          '#10b981',
    warm_up:           '#f59e0b',
    cool_down:         '#22d3ee',
    setback:           '#64748b',
    setup:             '#94a3b8',
    freeze_protection: '#ef4444',
    unoccupied:        '#475569',
    pre_cooling:       '#06b6d4',
  };

  var _container = null;
  var _timer     = null;
  var _ahuIds    = [];
  var _historyByAhu = {};

  function _ensureContainer() {
    if (_container && document.body.contains(_container)) return _container;
    _container = document.createElement('div');
    _container.id = 'g36-timeline-strip';
    _container.setAttribute('data-testid', 'g36-timeline-strip');
    _container.style.cssText =
      'position:fixed;left:50%;bottom:14px;transform:translateX(-50%);' +
      'z-index:42;width:min(880px, 70vw);padding:8px 12px;' +
      'background:rgba(15,23,42,.92);border:1px solid #1e293b;border-radius:8px;' +
      "font-family:'Courier New',monospace;color:#cbd5e1;" +
      'box-shadow:0 6px 24px rgba(0,0,0,.45);backdrop-filter:blur(10px);' +
      'display:none';
    document.body.appendChild(_container);
    return _container;
  }

  function _isPsychTabActive() {
    /* PSYCH tab's content panel is the first .view-tab; detect via the
     * existing PSYCH-only marker on the chart container. */
    var view = document.querySelector('[data-testid="view-tabs"]');
    if (!view) return false;
    var active = view.querySelector('button[data-active="true"], button[class*="border-indigo"]');
    if (!active) {
      /* Fall back: PSYCH button label match (English / 한국어 / 日本語 / 中文). */
      var btns = Array.from(view.querySelectorAll('button'));
      var hit = btns.find(function (b) {
        var t = (b.textContent || '').toUpperCase();
        return /PSYCH/.test(t) && (b.getAttribute('aria-selected') === 'true'
                                   || /border-indigo|border-b/.test(b.className));
      });
      active = hit || null;
    }
    if (!active) return false;
    var label = (active.textContent || '').toUpperCase();
    return /PSYCH/.test(label) || /습공기/.test(active.textContent || '')
        || /湿り/.test(active.textContent || '') || /焓湿/.test(active.textContent || '');
  }

  function _refreshAhuList() {
    /* Scrape AHU IDs from the rendered sidebar -- simplest stable source. */
    var ids = Array.from(document.querySelectorAll('[data-testid^="g36-chip-"]'))
                   .map(function (el) {
                     var t = el.getAttribute('data-testid') || '';
                     return t.slice('g36-chip-'.length);
                   })
                   .filter(Boolean);
    /* De-dupe preserving order. */
    var seen = {};
    _ahuIds = ids.filter(function (id) {
      if (seen[id]) return false;
      seen[id] = 1;
      return true;
    });
  }

  function _fetchHistoryAll() {
    if (!_ahuIds.length) return Promise.resolve();
    return Promise.all(_ahuIds.map(function (id) {
      return fetch(API_BASE + '/api/g36/history/' + encodeURIComponent(id) +
                   '?minutes=' + WINDOW_MIN, { credentials: 'include' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) { if (d && d.ahu_id) _historyByAhu[d.ahu_id] = d; })
        .catch(function () {});
    }));
  }

  function _esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function _fmtDur(ms) {
    if (ms < 60000) return Math.round(ms / 1000) + 's';
    var m = Math.round(ms / 60000);
    if (m < 60) return m + 'm';
    return Math.floor(m / 60) + 'h' + (m % 60) + 'm';
  }
  function _renderRow(d) {
    var now      = new Date(d.now).getTime();
    var winStart = now - WINDOW_MIN * 60 * 1000;
    var trans    = d.transitions || [];
    if (!trans.length) {
      return (
        '<div style="display:flex;align-items:center;gap:10px;padding:3px 0">' +
          '<div style="width:78px;font-size:9px;color:#94a3b8;font-weight:900;text-align:right">' + _esc(d.ahu_id) + '</div>' +
          '<div style="flex:1;height:16px;background:#0f172a;border:1px solid #1e293b;border-radius:3px;' +
                      'display:flex;align-items:center;justify-content:center;font-size:8.5px;color:#475569">' +
            'no transitions in last ' + WINDOW_MIN + 'm' +
          '</div>' +
        '</div>'
      );
    }
    /* Build segments by zipping the transition list with the right edge
     * (now).  Each segment = [start_ts, end_ts, mode].  Clamp start to
     * the window-start so the leading row never overflows. */
    var segs = [];
    for (var i = 0; i < trans.length; i++) {
      var s = new Date(trans[i].ts).getTime();
      var e = (i + 1 < trans.length) ? new Date(trans[i + 1].ts).getTime() : now;
      if (e <= winStart) continue;
      segs.push({ start: Math.max(s, winStart), end: e, mode: trans[i].mode });
    }
    if (!segs.length) {
      /* Shouldn't happen given the leading-transition guarantee from the
       * backend, but render the current mode as a flat ribbon just in
       * case. */
      segs.push({ start: winStart, end: now, mode: d.current_mode });
    }
    var totalMs = now - winStart;
    var segHtml = segs.map(function (s) {
      var pct  = ((s.end - s.start) / totalMs) * 100;
      var c    = MODE_COLORS[s.mode] || '#94a3b8';
      var dur  = _fmtDur(s.end - s.start);
      var startStr = new Date(s.start).toLocaleTimeString();
      var title = (s.mode || '?') + ' · ' + dur + ' · started ' + startStr;
      return (
        '<div title="' + _esc(title) + '" ' +
             'style="height:100%;width:' + pct.toFixed(3) + '%;' +
                    'background:' + c + ';' +
                    'border-right:1px solid rgba(15,23,42,.7);' +
                    'transition:opacity .15s" ' +
             'onmouseenter="this.style.opacity=.75" onmouseleave="this.style.opacity=1"></div>'
      );
    }).join('');

    var cur   = d.current_mode || '?';
    var curC  = MODE_COLORS[cur] || '#94a3b8';

    return (
      '<div style="display:flex;align-items:center;gap:10px;padding:3px 0">' +
        '<div style="width:78px;font-size:9px;color:#94a3b8;font-weight:900;text-align:right">' +
          _esc(d.ahu_id) +
        '</div>' +
        '<div style="flex:1;height:16px;background:#0f172a;border:1px solid #1e293b;border-radius:3px;' +
                    'display:flex;overflow:hidden">' +
          segHtml +
        '</div>' +
        '<div style="width:88px;font-size:8.5px;display:flex;align-items:center;gap:4px">' +
          '<span style="background:' + curC + ';box-shadow:0 0 5px ' + curC + ';' +
                       'width:7px;height:7px;border-radius:50%;display:inline-block"></span>' +
          '<span style="color:#cbd5e1;letter-spacing:.04em;text-transform:uppercase;font-weight:900">' + _esc(cur) + '</span>' +
        '</div>' +
      '</div>'
    );
  }

  function _renderLegend() {
    var keys = ['occupied','warm_up','cool_down','pre_cooling',
                'setback','setup','unoccupied','freeze_protection'];
    return keys.map(function (k) {
      var c = MODE_COLORS[k];
      return (
        '<span style="display:inline-flex;align-items:center;gap:3px;margin-right:8px">' +
          '<span style="width:8px;height:8px;background:' + c + ';border-radius:1px;display:inline-block"></span>' +
          '<span style="color:#94a3b8">' + k + '</span>' +
        '</span>'
      );
    }).join('');
  }

  function _render() {
    var box = _ensureContainer();
    if (!_isPsychTabActive() || !_ahuIds.length) {
      box.style.display = 'none';
      return;
    }
    var rows = _ahuIds.map(function (id) {
      var d = _historyByAhu[id];
      return d ? _renderRow(d) : '';
    }).join('');
    if (!rows) {
      box.style.display = 'none';
      return;
    }
    box.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">' +
        '<div style="font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:#10b981;font-weight:900">' +
          '◷ G36 Mode Timeline · last ' + WINDOW_MIN + ' min' +
        '</div>' +
        '<div style="font-size:8px;letter-spacing:.04em">' + _renderLegend() + '</div>' +
      '</div>' +
      '<div style="display:flex;flex-direction:column;gap:1px">' + rows + '</div>';
    box.style.display = 'block';
  }

  function _tick() {
    _refreshAhuList();
    _fetchHistoryAll().then(_render);
  }

  function _start() {
    if (_timer) return;
    _tick();
    _timer = setInterval(_tick, REFRESH_MS);
    /* React-driven tab switches don't fire popstate; piggyback on
     * MutationObserver to re-render visibility checks. */
    var mo = new MutationObserver(function () { _render(); });
    var root = document.querySelector('[data-testid="view-tabs"]');
    if (root) mo.observe(root, { attributes: true, subtree: true,
                                  attributeFilter: ['class','aria-selected'] });
  }

  /* Wait until the dashboard has rendered the AHU sidebar at least once
   * so the AHU-id scraping has something to read. */
  function _maybeStart() {
    if (document.querySelectorAll('[data-testid^="g36-chip-"]').length === 0) {
      setTimeout(_maybeStart, 800);
      return;
    }
    _start();
  }
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(_maybeStart, 1500);
  } else {
    window.addEventListener('DOMContentLoaded', function () { setTimeout(_maybeStart, 1500); });
  }

  window.red5G36Timeline = { refresh: _tick };
})();
