/* Red5 Studio — Audit Log popup (Phase 2 Piece G UI).
 *
 * Self-contained IIFE that:
 *   1. Subscribes to the `red5-auth-resolved` window event,
 *   2. Renders a 📋 AUDIT button next to the Standards button when the
 *      signed-in user is admin (else stays hidden),
 *   3. Opens a draggable popup listing the most recent /api/audit-log
 *      events with action filter + summary chip.
 *
 * Mirrors the chrome of the docs / band-insight popups so the operator
 * gets a consistent draggable / closeable experience across every help
 * panel.  No external deps -- this file only assumes window.fetch,
 * window.localStorage, and the existing apiUrl convention from the
 * dashboard.
 *
 * Storage:
 *   - red5AuditPopupState  {pos:{x,y}, closed:true|false}  -- popup pos
 */
(function () {
  'use strict';

  /* Resolve API base the same way the rest of the dashboard does. */
  var API_BASE = (function () {
    try {
      if (window.REACT_APP_BACKEND_URL) return window.REACT_APP_BACKEND_URL;
      if (window.API_BASE_URL)          return window.API_BASE_URL;
    } catch (_) {}
    return window.location.origin;
  })();

  /* Render the small AUDIT button into the toolbar (next to STANDARDS). */
  function _mountButton() {
    /* Idempotent: bail if already mounted. */
    if (document.getElementById('audit-log-btn')) return;
    var anchor = document.querySelector('[data-testid="standards-btn"]');
    if (!anchor) return;
    var btn = document.createElement('button');
    btn.id          = 'audit-log-btn';
    btn.setAttribute('data-testid', 'audit-log-btn');
    btn.title       = 'Open the admin audit log (setpoint changes + write-point overrides).';
    btn.textContent = '📋 Audit';
    /* Match the STANDARDS button styling 1:1 by cloning its className. */
    btn.className = anchor.className.replace(/text-violet-[0-9]+/g, 'text-emerald-400')
                                    .replace(/hover:border-violet-[0-9]+/g, 'hover:border-emerald-400')
                                    .replace(/hover:bg-violet-[0-9]+/g, 'hover:bg-emerald-50');
    btn.style.marginLeft = '4px';
    btn.addEventListener('click', _openPopup);
    anchor.parentNode.insertBefore(btn, anchor.nextSibling);
  }

  function _unmountButton() {
    var btn = document.getElementById('audit-log-btn');
    if (btn && btn.parentNode) btn.parentNode.removeChild(btn);
  }

  /* Auth-driven mount/unmount.  Wait for /api/auth/me to resolve so we
   * don't flash the chip for non-admin users. */
  window.addEventListener('red5-auth-resolved', function (ev) {
    var d = (ev && ev.detail) || {};
    if (d.isAdmin) {
      /* defer one tick so React-rendered toolbar is in DOM */
      setTimeout(_mountButton, 0);
      setTimeout(_mountButton, 600);     /* React re-render safety net */
      setTimeout(_mountButton, 1500);
    } else {
      _unmountButton();
    }
  });

  /* ---------------- popup ----------------------------------------- */
  var _popup = null;
  var _pos   = null;
  var _filter = '';

  function _savePos() {
    try {
      localStorage.setItem('red5AuditPopupState',
        JSON.stringify({ pos: _pos, closed: false }));
    } catch (_) {}
  }
  try {
    var _s = JSON.parse(localStorage.getItem('red5AuditPopupState') || '{}');
    if (_s && _s.pos && typeof _s.pos.x === 'number') _pos = _s.pos;
  } catch (_) {}

  function _openPopup() {
    if (_popup) {
      _popup.style.display = 'flex';
      _refresh();
      return;
    }
    _popup = document.createElement('div');
    _popup.id = 'audit-log-popup';
    _popup.setAttribute('data-testid', 'audit-log-popup');
    _popup.style.cssText =
      'position:fixed;left:' + (_pos ? _pos.x : 120) + 'px;top:' + (_pos ? _pos.y : 80) + 'px;' +
      'width:720px;height:560px;z-index:9999;display:flex;flex-direction:column;' +
      'background:rgba(15,23,42,.97);border:1px solid #34d399;border-radius:8px;' +
      'box-shadow:0 16px 48px rgba(0,0,0,.55);backdrop-filter:blur(16px);' +
      "font-family:'Courier New',monospace;color:#cbd5e1;overflow:hidden";

    _popup.innerHTML =
      '<div data-hdr="1" style="display:flex;justify-content:space-between;align-items:center;gap:8px;' +
                                'padding:10px 14px;background:rgba(52,211,153,.10);' +
                                'border-bottom:1px solid #14532d;cursor:move;flex-shrink:0">' +
        '<div style="display:flex;align-items:center;gap:10px">' +
          '<div style="color:#34d399;font-weight:900;font-size:11px;letter-spacing:.08em;text-transform:uppercase">' +
            '📋 Audit Log' +
          '</div>' +
          '<select data-action-filter="1" title="Filter by action" ' +
                  'style="background:#0f172a;border:1px solid #334155;border-radius:3px;color:#cbd5e1;' +
                         'font:900 9px Courier New;letter-spacing:.05em;padding:3px 5px;cursor:pointer">' +
            '<option value="">All actions</option>' +
            '<option value="write-point">write-point</option>' +
            '<option value="sa-rh-clamp">sa-rh-clamp</option>' +
            '<option value="g36-setpoint">g36-setpoint</option>' +
          '</select>' +
          '<button data-refresh="1" title="Refresh" ' +
                  'style="background:transparent;border:1px solid #475569;color:#cbd5e1;' +
                         'padding:2px 8px;font:900 9px Courier New;cursor:pointer;border-radius:3px">' +
            '⟳ refresh' +
          '</button>' +
        '</div>' +
        '<button data-close="1" title="Close" ' +
                'style="background:transparent;border:1px solid #475569;color:#fb7185;padding:0 8px;' +
                       'font:900 12px Courier New;cursor:pointer;border-radius:2px">✕</button>' +
      '</div>' +
      '<div data-summary="1" style="padding:8px 14px;font-size:9px;color:#94a3b8;' +
                                    'border-bottom:1px dashed #1e3a8a;flex-shrink:0">' +
        '(loading summary…)' +
      '</div>' +
      '<div data-body="1" style="flex:1;overflow-y:auto;padding:6px 0">' +
        '<div style="color:#94a3b8;padding:14px;font-size:10px">Loading…</div>' +
      '</div>';

    document.body.appendChild(_popup);
    _wireHeader();
    _popup.querySelector('[data-close]').addEventListener('click', function () {
      _popup.style.display = 'none';
    });
    _popup.querySelector('[data-refresh]').addEventListener('click', _refresh);
    _popup.querySelector('[data-action-filter]').addEventListener('change', function (e) {
      _filter = e.target.value || '';
      _refresh();
    });

    _refresh();
  }

  function _wireHeader() {
    var hdr = _popup.querySelector('[data-hdr]');
    hdr.addEventListener('mousedown', function (e) {
      if (e.target.closest('button, select')) return;
      e.preventDefault();
      var startX = e.clientX, startY = e.clientY;
      var rect = _popup.getBoundingClientRect();
      var origX = rect.left, origY = rect.top;
      function onMove(ev) {
        var nx = Math.max(0, Math.min(window.innerWidth  - 120, origX + (ev.clientX - startX)));
        var ny = Math.max(0, Math.min(window.innerHeight - 40,  origY + (ev.clientY - startY)));
        _pos = { x: nx, y: ny };
        _popup.style.left = nx + 'px';
        _popup.style.top  = ny + 'px';
      }
      function onUp() {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup',   onUp);
        _savePos();
      }
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup',   onUp);
    });
  }

  function _esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function _fmtTs(iso) {
    if (!iso) return '?';
    try { return new Date(iso).toLocaleString(); } catch (_) { return iso; }
  }
  function _fmtDiff(before, after) {
    /* Best-effort compact JSON for the diff column. */
    try {
      var b = before == null ? '' : JSON.stringify(before);
      var a = after  == null ? '' : JSON.stringify(after);
      if (b.length > 220) b = b.slice(0, 220) + '…';
      if (a.length > 220) a = a.slice(0, 220) + '…';
      return '<div style="color:#fb7185">' + _esc(b) + '</div>' +
             '<div style="color:#34d399">' + _esc(a) + '</div>';
    } catch (_) {
      return '<i style="color:#64748b">no diff</i>';
    }
  }
  function _renderRows(events) {
    if (!events.length) {
      return '<div style="color:#94a3b8;padding:14px;font-size:10px">No audit events yet.</div>';
    }
    var rows = events.map(function (e) {
      return (
        '<tr style="border-bottom:1px solid #1e293b">' +
          '<td style="padding:6px 10px;color:#94a3b8;white-space:nowrap;vertical-align:top">' +
            _esc(_fmtTs(e.ts)) +
          '</td>' +
          '<td style="padding:6px 10px;color:#a3e635;white-space:nowrap;vertical-align:top">' +
            _esc(e.action || '?') +
          '</td>' +
          '<td style="padding:6px 10px;color:#cbd5e1;vertical-align:top">' +
            _esc(e.resource || '?') +
          '</td>' +
          '<td style="padding:6px 10px;color:#94a3b8;white-space:nowrap;vertical-align:top">' +
            _esc(e.user_email || '<anon>') +
          '</td>' +
          '<td style="padding:6px 10px;font-size:8.5px;vertical-align:top">' +
            _fmtDiff(e.before, e.after) +
          '</td>' +
        '</tr>'
      );
    }).join('');
    return (
      '<table style="width:100%;border-collapse:collapse;font-size:9px">' +
        '<thead style="background:rgba(52,211,153,.06)">' +
          '<tr>' +
            '<th style="padding:6px 10px;text-align:left;color:#94a3b8;font-size:8px;letter-spacing:.06em;text-transform:uppercase">Time (local)</th>' +
            '<th style="padding:6px 10px;text-align:left;color:#94a3b8;font-size:8px;letter-spacing:.06em;text-transform:uppercase">Action</th>' +
            '<th style="padding:6px 10px;text-align:left;color:#94a3b8;font-size:8px;letter-spacing:.06em;text-transform:uppercase">Resource</th>' +
            '<th style="padding:6px 10px;text-align:left;color:#94a3b8;font-size:8px;letter-spacing:.06em;text-transform:uppercase">User</th>' +
            '<th style="padding:6px 10px;text-align:left;color:#94a3b8;font-size:8px;letter-spacing:.06em;text-transform:uppercase">Before / After</th>' +
          '</tr>' +
        '</thead>' +
        '<tbody>' + rows + '</tbody>' +
      '</table>'
    );
  }
  function _renderSummary(s) {
    if (!s || !s.window_24h) return '(no summary)';
    function bag(o) {
      var parts = [];
      Object.keys(o).sort().forEach(function (k) { parts.push(k + ':' + o[k]); });
      return parts.length ? parts.join('  ') : '(none)';
    }
    return (
      '<span style="color:#34d399">24h</span> ' + _esc(bag(s.window_24h)) +
      '  ·  <span style="color:#22d3ee">7d</span> ' + _esc(bag(s.window_7d)) +
      '  ·  <span style="color:#94a3b8">total</span> ' + (s.total || 0) +
      '  ·  <span style="color:#64748b">TTL ' + (s.ttl_days || '?') + 'd</span>'
    );
  }

  function _refresh() {
    if (!_popup) return;
    var body = _popup.querySelector('[data-body]');
    var sum  = _popup.querySelector('[data-summary]');
    body.innerHTML = '<div style="color:#94a3b8;padding:14px;font-size:10px">Loading…</div>';
    sum.textContent = '(loading summary…)';

    var qs = _filter ? ('?action=' + encodeURIComponent(_filter) + '&limit=100') : '?limit=100';
    fetch(API_BASE + '/api/audit-log' + qs, { credentials: 'include' })
      .then(function (r) {
        if (r.status === 401 || r.status === 403) {
          body.innerHTML = '<div style="color:#fb7185;padding:14px;font-size:10px">Admin only — sign in as an admin to view audit log.</div>';
          return null;
        }
        if (!r.ok) {
          body.innerHTML = '<div style="color:#fb7185;padding:14px;font-size:10px">Audit fetch failed: HTTP ' + r.status + '</div>';
          return null;
        }
        return r.json();
      })
      .then(function (d) {
        if (!d) return;
        body.innerHTML = _renderRows(d.events || []);
      })
      .catch(function (e) {
        body.innerHTML = '<div style="color:#fb7185;padding:14px;font-size:10px">Audit fetch failed: ' + _esc(e && e.message || e) + '</div>';
      });

    fetch(API_BASE + '/api/audit-log/summary', { credentials: 'include' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (s) { sum.innerHTML = _renderSummary(s); })
      .catch(function () { sum.textContent = '(summary unavailable)'; });
  }

  /* Expose for keyboard shortcut / programmatic open if needed later. */
  window.red5AuditLog = { open: _openPopup };
})();
