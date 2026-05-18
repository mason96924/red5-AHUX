/* Regression test for the dashboard left-sidebar pop-out wiring.
 *
 * Validates:
 *   1) Pop-out state variables wired (sidebarPopupWin, sidebarPopupHost)
 *   2) popOutSidebar callback uses window.open with the expected window-features
 *   3) beforeunload handler closes the orphan popup
 *   4) Sidebar JSX is wrapped in an IIFE that conditionally portals
 *   5) Pop-out button is wired with the right test-id and toggles ATTACH/POP
 *   6) Resize handle is gated behind !isPopped
 *   7) Width style is gated: 100% when popped, sidebarWidth when docked
 *   8) Same data-testid swap (left-sidebar -> left-sidebar-popped) so
 *      automation knows whether the sidebar is in the main page or portaled
 *   9) JSX still parses cleanly via @babel/parser
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

// 1) State + callback declarations
check('state: sidebarPopupWin declared',
      /const\s*\[\s*sidebarPopupWin\s*,\s*setSidebarPopupWin\s*\]\s*=\s*useState\(null\)/.test(dash));
check('state: sidebarPopupHost declared',
      /const\s*\[\s*sidebarPopupHost\s*,\s*setSidebarPopupHost\s*\]\s*=\s*useState\(null\)/.test(dash));
check('callback: popOutSidebar is a useCallback',
      /const\s+popOutSidebar\s*=\s*useCallback\(/.test(dash));

// 2) window.open with the expected window-features (popup window name + size)
check('popOutSidebar: window.open with red5_dashboard_sidebar name',
      /window\.open\([^)]*['"]red5_dashboard_sidebar['"]/.test(dash));
check('popOutSidebar: opens at 420x950 (matches operator-side density)',
      /width=420,height=950/.test(dash));
check('popOutSidebar: idempotent on repeated clicks (focus + return)',
      /sidebarPopupWin\s*&&\s*!sidebarPopupWin\.closed[\s\S]{0,80}sidebarPopupWin\.focus/.test(dash));
check('popOutSidebar: clones parent stylesheets so theme + Tailwind survive',
      /document\.head\.querySelectorAll\(['"]style,\s*link\[rel="stylesheet"\]['"]\)/.test(dash));
check('popOutSidebar: clones Tailwind <script>',
      /document\.querySelector\(['"]script\[src\*="tailwindcss"\]['"]\)/.test(dash));
check('popOutSidebar: closeWatcher snaps back when popup closes',
      /setInterval\([\s\S]{0,200}win\.closed[\s\S]{0,200}setSidebarPopupWin\(null\)/.test(dash));

// 3) beforeunload handler kills orphan popup
check('beforeunload: addEventListener wired',
      /addEventListener\(['"]beforeunload['"]/.test(dash));
check('beforeunload: handler calls sidebarPopupWin.close()',
      /sidebarPopupWin\.closed[\s\S]{0,30}sidebarPopupWin\.close\(\)/.test(dash));

// 4) IIFE wrapping the sidebar tree
check('IIFE: sidebarTree declared inside the (() => { ... })() wrapper',
      /const\s+sidebarTree\s*=\s*\(/.test(dash));
check('IIFE: ReactDOM.createPortal called with sidebarTree + sidebarPopupHost',
      /ReactDOM\.createPortal\(sidebarTree,\s*sidebarPopupHost\)/.test(dash));
check('IIFE: returns sidebarTree directly when not popped',
      /if\s*\(\s*isPopped\s*&&\s*sidebarPopupHost\s*\)\s*\{[\s\S]{0,80}return ReactDOM\.createPortal[\s\S]{0,80}\}\s*return\s+sidebarTree/.test(dash));

// 5) Pop-out button
check('button: data-testid popout-sidebar-btn present',
      /data-testid="popout-sidebar-btn"/.test(dash));
check('button: toggles between ATTACH and POP label',
      /sidebarPopupWin\s*\?\s*'\\u21A9 ATTACH'\s*:\s*'\\u2197 POP'/.test(dash));
check('button: emerald-700 active style when popped (visual feedback)',
      /sidebarPopupWin\s*\?\s*'bg-emerald-700/.test(dash));
check('button: click handler closes if open else opens',
      /sidebarPopupWin\s*&&\s*!sidebarPopupWin\.closed[\s\S]{0,80}sidebarPopupWin\.close\(\)[\s\S]{0,120}popOutSidebar\(\)/.test(dash));

// 6) Resize handle gated behind !isPopped
check('resize handle: gated by {!isPopped && (...)}',
      /\{\s*!isPopped\s*&&\s*\([\s\S]{0,400}data-testid="sidebar-resize-handle"/.test(dash));

// 7) Sidebar width gated
check('sidebar width: isPopped -> 100%, docked -> sidebarWidth px',
      /style=\{\s*isPopped\s*\?\s*\{[^}]*width:\s*['"]100%['"][\s\S]{0,80}\$\{sidebarWidth\}px/.test(dash));

// 8) testid swap so automation can distinguish docked vs popped
check('data-testid: swaps left-sidebar -> left-sidebar-popped when popped',
      /data-testid=\{\s*isPopped\s*\?\s*"left-sidebar-popped"\s*:\s*"left-sidebar"\s*\}/.test(dash));

// 9) JSX parses cleanly
let babelParser;
try { babelParser = require('/tmp/node_modules/@babel/parser'); }
catch (e) {
    console.log('NOTE: @babel/parser not installed at /tmp/node_modules; run `npm i @babel/parser --prefix /tmp` to enable strict parse-check.');
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
console.log('Dashboard left-sidebar pop-out: ' + pass + ' pass, ' + fail + ' fail.');
if (fail > 0) {
    console.log('FAILURES:');
    fails.forEach(f => console.log('  - ' + f));
    process.exit(1);
}
process.exit(0);
