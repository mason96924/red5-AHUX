/* Regression test for the dashboard left-sidebar pop-out behavior.
 *
 * Three render modes, all guarded:
 *   1) DOCKED        -- original in-flow column.
 *   2) FLOATING      -- in-page absolutely-positioned draggable+resizable
 *                       panel.  Same document, so slider drags etc. work.
 *   3) WINDOW POPOUT -- separate OS-level browser window via
 *                       red5OpenPopupWindow + ReactDOM.createPortal.
 *
 * Both pop-out modes must close automatically when the parent tab unloads.
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

// ====================================================================
// FLOATING MODE (in-page)
// ====================================================================
check('float: sidebarFloating bool declared',
      /const\s*\[\s*sidebarFloating\s*,\s*setSidebarFloating\s*\]\s*=\s*useState\(false\)/.test(dash));
check('float: sidebarFloatPos hydrated from localStorage',
      /useState\([\s\S]{0,200}red5\.sidebarFloatPos/.test(dash));
check('float: sidebarFloatSize hydrated from localStorage',
      /useState\([\s\S]{0,200}red5\.sidebarFloatSize/.test(dash));
check('float: onSidebarTitleMouseDown declared',
      /const\s+onSidebarTitleMouseDown\s*=\s*useCallback\(/.test(dash));
check('float: title mousedown attaches mousemove to window',
      /onSidebarTitleMouseDown[\s\S]{0,1500}window\.addEventListener\(['"]mousemove['"]/.test(dash));
check('float: position persisted to localStorage on mouseup',
      /onSidebarTitleMouseDown[\s\S]{0,1700}localStorage\.setItem\(['"]red5\.sidebarFloatPos['"]/.test(dash));
check('float: onSidebarResizeMouseDown declared',
      /const\s+onSidebarResizeMouseDown\s*=\s*useCallback\(/.test(dash));
check('float: minimum size enforced (280 wide, 360 tall)',
      /onSidebarResizeMouseDown[\s\S]{0,800}Math\.max\(280[\s\S]{0,400}Math\.max\(360/.test(dash));
check('float: shell has data-testid sidebar-floating-shell',
      /data-testid="sidebar-floating-shell"/.test(dash));
check('float: shell titlebar + attach + resize testids present',
      /data-testid="sidebar-floating-titlebar"/.test(dash)
      && /data-testid="sidebar-floating-attach"/.test(dash)
      && /data-testid="sidebar-floating-resize"/.test(dash));
check('float: data-no-drag on attach button (no drag-jacking)',
      /data-no-drag[\s\S]{0,400}sidebar-floating-attach/.test(dash));
check('float: attach button flips state to false',
      /sidebar-floating-attach[\s\S]{0,400}setSidebarFloating\(false\)/.test(dash));
check('float: shell offers "to window" escalation button',
      /data-testid="sidebar-floating-to-window"/.test(dash));

// ====================================================================
// WINDOW POPOUT MODE (cross-window)
// ====================================================================
check('win: sidebarPopoutWin state declared',
      /const\s*\[\s*sidebarPopoutWin\s*,\s*setSidebarPopoutWin\s*\]\s*=\s*useState\(null\)/.test(dash));
check('win: sidebarPopoutHost state declared',
      /const\s*\[\s*sidebarPopoutHost\s*,\s*setSidebarPopoutHost\s*\]\s*=\s*useState\(null\)/.test(dash));
check('win: popOutSidebarToWindow callback declared',
      /const\s+popOutSidebarToWindow\s*=\s*useCallback\(/.test(dash));
check('win: uses shared red5OpenPopupWindow helper (parity with AHU/VAV modal)',
      /red5OpenPopupWindow\(['"]sidebar['"]/.test(dash));
check('win: popup auto-watched for .closed via setInterval (snap back)',
      /setInterval\([\s\S]{0,200}result\.win\.closed[\s\S]{0,400}setSidebarPopoutWin\(null\)/.test(dash));
check('win: opening cross-window auto-disables in-page floating (mutually exclusive)',
      /popOutSidebarToWindow[\s\S]{0,1500}setSidebarFloating\(false\)/.test(dash));
check('win: beforeunload kills the orphan popup when parent navigates away',
      /sidebarPopoutWin\.close\(\)[\s\S]{0,400}addEventListener\(['"]beforeunload['"]/.test(dash));
check('win: WIN header button has data-testid popout-sidebar-window-btn',
      /data-testid="popout-sidebar-window-btn"/.test(dash));
check('win: WIN button only renders when not already popped to window',
      /\{\s*!sidebarPopoutWin\s*&&\s*\([\s\S]{0,1600}data-testid="popout-sidebar-window-btn"/.test(dash));
check('win: docked placeholder testid present',
      /data-testid="sidebar-window-placeholder"/.test(dash));
check('win: "Bring Back" testid present on placeholder',
      /data-testid="sidebar-window-attach"/.test(dash));
check('win: render path uses ReactDOM.createPortal with sidebarPopoutHost',
      /ReactDOM\.createPortal\(sidebarTree,\s*sidebarPopoutHost\)/.test(dash));
check('win: sidebar testid swaps to left-sidebar-popped-window when crossed',
      /isPoppedToWin\s*\?\s*"left-sidebar-popped-window"/.test(dash));

// ====================================================================
// POP BUTTON BEHAVIOUR
// ====================================================================
check('button: data-testid popout-sidebar-btn present',
      /data-testid="popout-sidebar-btn"/.test(dash));
check('button: only renders when docked (gated behind !sidebarFloating)',
      /\{\s*!sidebarFloating\s*&&\s*!sidebarPopoutWin\s*&&\s*\([\s\S]{0,800}data-testid="popout-sidebar-btn"/.test(dash));
check('button: POP click opens floating mode',
      /setSidebarFloating\(true\)[\s\S]{0,800}data-testid="popout-sidebar-btn"/.test(dash));
check('regression: header POP button does NOT render ATTACH label (no duplicate with shell)',
      !/data-testid="popout-sidebar-btn"[\s\S]{0,800}\\u21A9 ATTACH/.test(dash));

// ====================================================================
// IIFE STRUCTURE (3 render branches)
// ====================================================================
check('iife: const isPoppedToWin = !!sidebarPopoutWin',
      /const\s+isPoppedToWin\s*=\s*!!sidebarPopoutWin/.test(dash));
check('iife: const isPoppedFloat = sidebarFloating && !isPoppedToWin',
      /const\s+isPoppedFloat\s*=\s*sidebarFloating\s*&&\s*!isPoppedToWin/.test(dash));
check('iife: returns sidebarTree (docked) when neither mode active',
      /return\s+sidebarTree;\s*\}\)\(\)\}/.test(dash));
check('iife: resize handle gated behind !isPopped',
      /\{\s*!isPopped\s*&&\s*\([\s\S]{0,400}data-testid="sidebar-resize-handle"/.test(dash));

// ====================================================================
// JSX parses
// ====================================================================
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
console.log('Dashboard sidebar pop-out (3 modes): ' + pass + ' pass, ' + fail + ' fail.');
if (fail > 0) {
    console.log('FAILURES:');
    fails.forEach(f => console.log('  - ' + f));
    process.exit(1);
}
process.exit(0);
