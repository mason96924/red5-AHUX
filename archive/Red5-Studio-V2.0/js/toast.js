/**
 * Red5 Studio V2.0 — Vanilla-JS toast queue (Phase 2e).
 *
 * Drop-in replacement for `alert(message)`.  Non-blocking, stacks in the
 * bottom-right, auto-dismisses, supports newlines.  No dependencies.
 *
 * Usage:
 *   window.toast(message)               // info (or auto-classified)
 *   window.toast.success(message)
 *   window.toast.error(message)
 *   window.toast.warning(message)
 *   window.toast.info(message)
 *
 * Heuristic auto-classifier (used when a plain `toast(msg)` is invoked
 * without a level): "saved/loaded/uploaded/added/applied" -> success;
 * "failed/error/cannot/could not" -> error; "preview only / sign in /
 * demo mode / anonymous / warning" -> warning; everything else -> info.
 * Lets us swap `alert(x)` -> `toast(x)` in bulk with sensible defaults.
 */
(function () {
    if (window.toast && window.toast.__r5) return;  // idempotent

    // Tiny pre-init queue.  If a save/alert path fires before DOMContentLoaded
    // we capture (msg, level, opts) tuples and flush them once the host
    // element is in the DOM.  This keeps the public API safe to call
    // synchronously from any code path.
    const preInitQueue = [];
    let initialized = false;
    let _renderImpl = null;

    function preInitToast(message, opts) {
        return push(message, null, opts || {});
    }
    preInitToast.success = (m, o) => push(m, 'success', o || {});
    preInitToast.error   = (m, o) => push(m, 'error',   o || {});
    preInitToast.warning = (m, o) => push(m, 'warning', o || {});
    preInitToast.info    = (m, o) => push(m, 'info',    o || {});
    preInitToast.dismissAll = () => { /* no-op pre-init */ };
    preInitToast.__r5 = true;
    window.toast = preInitToast;

    function push(message, level, opts) {
        if (initialized && _renderImpl) return _renderImpl(message, level, opts);
        preInitQueue.push({ message, level, opts });
        return null;
    }

    function init() {
        if (initialized) return;
        if (!document.body) {
            document.addEventListener('DOMContentLoaded', init, { once: true });
            return;
        }

        const CSS = `
        .r5-toast-host {
            position: fixed; right: 16px; bottom: 16px;
            display: flex; flex-direction: column; gap: 8px;
            z-index: 999999; pointer-events: none;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            max-width: min(420px, 90vw);
        }
        .r5-toast {
            pointer-events: auto;
            padding: 10px 14px; border-radius: 8px;
            font-size: 12px; line-height: 1.45;
            white-space: pre-wrap;
            background: rgba(15,23,42,0.96);
            color: #e2e8f0;
            border: 1px solid #334155;
            border-left-width: 3px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.4);
            transform: translateX(110%); opacity: 0;
            transition: transform .28s ease, opacity .28s ease;
            font-weight: 500;
        }
        .r5-toast.r5-show { transform: translateX(0); opacity: 1; }
        .r5-toast.r5-success { border-left-color: #10b981; }
        .r5-toast.r5-error   { border-left-color: #f43f5e; color: #fecaca; }
        .r5-toast.r5-warning { border-left-color: #f59e0b; color: #fde68a; }
        .r5-toast.r5-info    { border-left-color: #38bdf8; }
        .r5-toast-title {
            font-family: 'JetBrains Mono', ui-monospace, monospace;
            font-size: 9px; font-weight: 900;
            text-transform: uppercase; letter-spacing: 0.12em;
            opacity: 0.65; margin-bottom: 3px;
        }
        .r5-toast-close {
            float: right; margin-left: 8px;
            background: transparent; border: none; color: inherit;
            opacity: 0.5; cursor: pointer; font-size: 14px;
            padding: 0; line-height: 1;
        }
        .r5-toast-close:hover { opacity: 1; }
        `;

        const style = document.createElement('style');
        style.textContent = CSS;
        document.head.appendChild(style);

        const host = document.createElement('div');
        host.className = 'r5-toast-host';
        host.setAttribute('data-testid', 'r5-toast-host');
        document.body.appendChild(host);

        function classify(msg) {
            const m = (msg || '').toLowerCase();
            if (/(\bfail|\berror|\bcannot|\bcould not|invalid|denied|aborted)/.test(m)) return 'error';
            if (/(preview only|sign in|demo mode|anonymous|warning)/.test(m))            return 'warning';
            if (/(\bsaved|\bloaded|\buploaded|\bdeleted|\bapplied|\badded|success)/.test(m)) return 'success';
            return 'info';
        }

        const TITLES = {
            success: 'Saved',
            error:   'Error',
            warning: 'Heads up',
            info:    'Info',
        };

        function render(message, level, opts) {
            const lvl   = level || classify(message);
            const ttl   = (opts && opts.duration) || (lvl === 'error' ? 6500 : 3800);
            const title = (opts && opts.title) || TITLES[lvl] || 'Info';

            const node = document.createElement('div');
            node.className = `r5-toast r5-${lvl}`;
            node.setAttribute('data-testid', `r5-toast-${lvl}`);

            const closeBtn = document.createElement('button');
            closeBtn.className = 'r5-toast-close';
            closeBtn.setAttribute('aria-label', 'Dismiss');
            closeBtn.textContent = '\u2715';
            closeBtn.onclick = () => dismiss(node);
            node.appendChild(closeBtn);

            const t = document.createElement('div');
            t.className = 'r5-toast-title';
            t.textContent = title;
            node.appendChild(t);

            const body = document.createElement('div');
            body.textContent = String(message);
            node.appendChild(body);

            host.appendChild(node);
            // Force reflow so the initial transform sticks before .r5-show.
            // eslint-disable-next-line no-unused-expressions
            node.offsetHeight;
            node.classList.add('r5-show');

            const tid = setTimeout(() => dismiss(node), ttl);
            node.dataset.tid = tid;
            return node;
        }

        function dismiss(node) {
            if (!node || !node.parentNode) return;
            clearTimeout(node.dataset.tid);
            node.classList.remove('r5-show');
            setTimeout(() => { if (node.parentNode) node.parentNode.removeChild(node); }, 320);
        }

        function toast(message, opts) { return render(message, null, opts || {}); }
        toast.__r5    = true;
        toast.success = (m, o) => render(m, 'success', o || {});
        toast.error   = (m, o) => render(m, 'error',   o || {});
        toast.warning = (m, o) => render(m, 'warning', o || {});
        toast.info    = (m, o) => render(m, 'info',    o || {});
        toast.dismissAll = () => host.querySelectorAll('.r5-toast').forEach(dismiss);

        window.toast = toast;
        _renderImpl  = render;
        initialized  = true;

        // Flush anything queued before init.
        while (preInitQueue.length) {
            const { message, level, opts } = preInitQueue.shift();
            render(message, level, opts);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
