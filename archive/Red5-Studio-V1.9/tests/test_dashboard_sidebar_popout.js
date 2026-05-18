/* Regression test for the dashboard left-sidebar in-page floating mode.
 *
 * History: previously this was a cross-window window.open + createPortal popup.
 * That had two latent bugs:
 *   1) Range-slider drags inside the popup did not work because their
 *      onMouseDown attached mousemove/mouseup to `window` (the PARENT),
 *      not the popup window -- events fired in the popup never reached
 *      the listener (psychart temp slider was the visible symptom).
 *   2) On re-attach, queued slider mousemove events fired in a rush because
 *      portal teardown moved the slider DOM node back under the parent
 *      window's listener mid-drag.
 *
 * Both bugs are eliminated by switching to an in-page absolutely-positioned
 * floating panel inside the same document.  These assertions guard that
 * regression: no window.open, no cross-window createPortal, every drag
 * listener stays inside one document.
 *
 * Run from /app/archive/Red5-Studio-V1.9:
 *   node tests/test_dashboard_sidebar_popout.js
 */
const fs = require('fs');
const path = require('path');

const dashPath = path.join(__dirname, '..', 'dashboard.html');
const dash = fs.readFileSync(dashPath, 'utf8');

let pass = 0, fail = 0;
const fails = [];
function check(name, ok, info) {
    if (ok) { pass++; }
    else    { fail++; fails.push(name + (info ? '  ' + info : '')); }
}

// ---------- 1. State + persistence ----------
check('state: sidebarFloating bool declared',
      /const\s*\[\s*sidebarFloating\s*,\s*setSidebarFloating\s*\]\s*=\s*useState\(false\)/.test(dash));
check('state: sidebarFloatPos hydrated from localStorage',
      /const\s*\[\s*sidebarFloatPos\s*,\s*setSidebarFloatPos\s*\]\s*=\s*useState\([\s\S]{0,200}red5\.sidebarFloatPos/.test(dash));
check('state: sidebarFloatSize hydrated from localStorage',
      /const\s*\[\s*sidebarFloatSize\s*,\s*setSidebarFloatSize\s*\]\s*=\s*useState\([\s\S]{0,200}red5\.sidebarFloatSize/.test(dash));

// ---------- 2. NO cross-window window.open anywhere on the sidebar path ----------
check('regression: no window.open for the sidebar',
      dash.indexOf("'red5_dashboard_sidebar'") === -1 && dash.indexOf('"red5_dashboard_sidebar"') === -1);
check('regression: no sidebarPopupWin state remains',
      dash.indexOf('sidebarPopupWin')  === -1);
check('regression: no sidebarPopupHost state remains',
      dash.indexOf('sidebarPopupHost') === -1);
check('regression: no popOutSidebar useCallback remains',
      !/const\s+popOutSidebar\s*=\s*useCallback/.test(dash));
check('regression: no ReactDOM.createPortal for the sidebar tree remains',
      dash.indexOf('createPortal(sidebarTree') === -1);

// ---------- 3. Drag handlers use window-level listeners (same-document) ----------
check('drag: onSidebarTitleMouseDown declared',
      /const\s+onSidebarTitleMouseDown\s*=\s*useCallback\(/.test(dash));
check('drag: title mousedown attaches mousemove to window',
      /onSidebarTitleMouseDown[\s\S]{0,1500}window\.addEventListener\(['"]mousemove['"]/.test(dash));
check('drag: title mouseup removes both listeners',
      /onSidebarTitleMouseDown[\s\S]{0,1500}removeEventListener\(['"]mousemove['"][\s\S]{0,200}removeEventListener\(['"]mouseup['"]/.test(dash));
check('drag: position persisted to localStorage on mouseup',
      /onSidebarTitleMouseDown[\s\S]{0,1700}localStorage\.setItem\(['"]red5\.sidebarFloatPos['"]/.test(dash));

// ---------- 4. Resize handlers ----------
check('resize: onSidebarResizeMouseDown declared',
      /const\s+onSidebarResizeMouseDown\s*=\s*useCallback\(/.test(dash));
check('resize: minimum size enforced (280 wide, 360 tall)',
      /onSidebarResizeMouseDown[\s\S]{0,800}Math\.max\(280[\s\S]{0,400}Math\.max\(360/.test(dash));
check('resize: size persisted to localStorage on mouseup',
      /onSidebarResizeMouseDown[\s\S]{0,1500}localStorage\.setItem\(['"]red5\.sidebarFloatSize['"]/.test(dash));

// ---------- 5. Floating shell rendering ----------
check('shell: data-testid sidebar-floating-shell',
      /data-testid="sidebar-floating-shell"/.test(dash));
check('shell: fixed positioning with operator-controlled left/top/w/h',
      /className=\{`fixed z-\[80\][\s\S]{0,400}left:\s*sidebarFloatPos\.x[\s\S]{0,200}top:\s*sidebarFloatPos\.y[\s\S]{0,200}width:\s*sidebarFloatSize\.w[\s\S]{0,200}height:\s*sidebarFloatSize\.h/.test(dash));
check('shell: titlebar testid + attach button testid',
      /data-testid="sidebar-floating-titlebar"/.test(dash) && /data-testid="sidebar-floating-attach"/.test(dash));
check('shell: resize grip testid',
      /data-testid="sidebar-floating-resize"/.test(dash));
check('shell: data-no-drag on the attach button to prevent drag-jacking',
      /data-no-drag[\s\S]{0,400}sidebar-floating-attach/.test(dash));
check('shell: attach button flips state to false',
      /sidebar-floating-attach[\s\S]{0,400}setSidebarFloating\(false\)/.test(dash));

// ---------- 6. Pop-out button wiring ----------
check('button: data-testid popout-sidebar-btn present',
      /data-testid="popout-sidebar-btn"/.test(dash));
check('button: toggles sidebarFloating',
      /onClick=\{\(\)\s*=>\s*setSidebarFloating\(v\s*=>\s*!v\)/.test(dash));
check('button: ATTACH vs POP label',
      /sidebarFloating\s*\?\s*'\\u21A9 ATTACH'\s*:\s*'\\u2197 POP'/.test(dash));

// ---------- 7. Docked sidebar IIFE still works (no isPopped branch deletion) ----------
check('iife: const isPopped = sidebarFloating',
      /const\s+isPopped\s*=\s*sidebarFloating/.test(dash));
check('iife: returns sidebarTree when not popped',
      /\}\s*return\s+sidebarTree;\s*\}\)\(\)\}/.test(dash));
check('iife: resize handle gated behind !isPopped',
      /\{\s*!isPopped\s*&&\s*\([\s\S]{0,400}data-testid="sidebar-resize-handle"/.test(dash));

// ---------- 8. JSX parses cleanly ----------
let babelParser;
try { babelParser = require('/tmp/node_modules/@babel/parser'); }
catch (e) {
    console.log('NOTE: @babel/parser not installed at /tmp/node_modules; strict parse-check skipped.');
}
if (babelParser) {
    const m = dash.match(/<script type="text\/plain" id="main-source">([\s\S]*?)<\/script>/);
    let parseOk = false;
    try {
        babelParser.parse(m[1], { sourceType: 'module', plugins: ['jsx'] });
        parseOk = true;
    } catch (e) {
        check('jsx parse: full main-source parses via @babel/parser', false, e.message.split('\n')[0]);
    }
    if (parseOk) check('jsx parse: full main-source parses via @babel/parser', true);
}

// ---- Summary ----
console.log('Dashboard left-sidebar in-page floating mode: ' + pass + ' pass, ' + fail + ' fail.');
if (fail > 0) {
    console.log('FAILURES:');
    fails.forEach(f => console.log('  - ' + f));
    process.exit(1);
}
process.exit(0);
