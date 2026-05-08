// dynamics-animation.js — Control Algorithm Visualizer
// 3 modes: Seasonal (free drift), W Setpoint (g/kg PI), RH Setpoint (%RH PI)
// Usage: initDynamicsAnimation(containerEl, isDark) returns cleanup()

function initDynamicsAnimation(container, isDark, opts) {
    // ===== i18n HELPER =====
    var _t = window.t || function(k){return k;};
    window.addEventListener('langchange',function(){_t=window.t||function(k){return k;};});
    // ===== MATH =====
    var P_ATM = 101.325;
    var safeN = function(v) { return (typeof v === 'number' && Number.isFinite(v)) ? v : 0; };

    var getPsatLocal = function(T) {
        var TK = safeN(T) + 273.15;
        if (TK <= 173.15) return 0.0001;
        var lp;
        if (TK < 273.15) {
            var c = [-5.6745359e3, 6.3925247, -9.677843e-3, 6.2215701e-7, 2.0747825e-9, -9.484024e-13, 4.1635019];
            lp = c[0]/TK + c[1] + c[2]*TK + c[3]*Math.pow(TK,2) + c[4]*Math.pow(TK,3) + c[5]*Math.pow(TK,4) + c[6]*Math.log(TK);
        } else {
            var c2 = [-5.8002206e3, 1.3914993, -4.8640239e-2, 4.1764768e-5, -1.4452093e-8, 6.5459673];
            lp = c2[0]/TK + c2[1] + c2[2]*TK + c2[3]*Math.pow(TK,2) + c2[4]*Math.pow(TK,3) + c2[5]*Math.log(TK);
        }
        return safeN(Math.exp(lp) / 1000);
    };
    var getWLocal = function(T, RH) { var ps = getPsatLocal(T); var pw = (safeN(RH)/100)*ps; return safeN((0.621945*pw)/(P_ATM-pw)); };
    var getRHLocal = function(T, W) { var ps = getPsatLocal(T); if (ps <= 0) return 0; var pw = (safeN(W) * P_ATM) / (0.621945 + safeN(W)); return safeN(Math.min(100, Math.max(0, (pw / ps) * 100))); };
    var getHLocal = function(T, W) { return safeN(1.006 * T + W * (2501 + 1.86 * T)); };

    // ===== GEOMETRY =====
    var SVG_W = 1300, SVG_H = 750;
    var _opts = opts || {};
    var T_MIN = (typeof _opts.tMin === 'number') ? _opts.tMin : -15;
    var T_MAX = (typeof _opts.tMax === 'number') ? _opts.tMax : 50;
    var W_MAX = 30;
    var gridW = 1092, gridH = 540;
    var pad = { left: 90, right: 100, top: 105, bottom: 105 };
    var xC = function(t) { return safeN(pad.left + ((t - T_MIN)/(T_MAX - T_MIN)) * gridW); };
    var yC = function(w) { return safeN((pad.top + gridH) - (w / (W_MAX/1000)) * gridH); };

    // ===== SVG HELPERS =====
    var NS = 'http://www.w3.org/2000/svg';
    var el = function(tag, attrs) { var e = document.createElementNS(NS, tag); for (var k in attrs) { if (attrs.hasOwnProperty(k)) e.setAttribute(k, attrs[k]); } return e; };

    var darkMode = isDark !== false;
    var uiD = { chartBg:'#020617', gridMajor:'#475569', svgText:'#94a3b8', svgAxis:'#475569' };
    var uiL = { chartBg:'#ffffff', gridMajor:'#cbd5e1', svgText:'#475569', svgAxis:'#1e293b' };
    var ui = function() { return darkMode ? uiD : uiL; };

    container.innerHTML = '';
    container.style.cssText = 'position:relative;width:100%;height:100%;overflow:hidden;background:' + (darkMode?'#020617':'#f8fafc') + ';transition:background 0.5s';
    var font = 'SF Mono,Fira Code,Cascadia Code,monospace';
    var fg = darkMode ? '#e2e8f0' : '#1e293b';
    var muted = '#94a3b8';
    var cardBg = darkMode ? 'rgba(2,6,23,0.85)' : 'rgba(255,255,255,0.9)';
    var border = darkMode ? '#1e293b' : '#e2e8f0';

    // ===== HUD =====
    var hud = document.createElement('div');
    hud.style.cssText = 'position:absolute;top:16px;left:20px;z-index:10;font-family:' + font;
    hud.innerHTML = '<div style="font-size:14px;font-weight:900;letter-spacing:0.08em;text-transform:uppercase;color:' + fg + '">Control Algorithm</div>' +
        '<div id="dyn-subtitle" style="font-size:9px;color:' + muted + ';letter-spacing:0.15em;text-transform:uppercase;margin-top:2px">Seasonal Weather Animation</div>' +
        '<div style="margin-top:8px;display:flex;gap:8px">' +
        '<span id="dyn-badge" style="display:inline-flex;align-items:center;padding:5px 12px;border-radius:20px;font-size:10px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;border:1.5px solid #60a5fa;color:#60a5fa;background:rgba(96,165,250,0.1)">WINTER</span>' +
        '<span id="dyn-mode" style="display:inline-flex;align-items:center;padding:5px 12px;border-radius:20px;font-size:10px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;border:1.5px solid #f472b6;color:#f472b6;background:rgba(244,114,182,0.1);opacity:0">HEATING</span>' +
        '</div>';
    container.appendChild(hud);

    // ===== MODE SELECTOR =====
    var modePanel = document.createElement('div');
    modePanel.style.cssText = 'position:absolute;top:80px;left:20px;z-index:10;display:flex;gap:6px;font-family:' + font;
    var modeConfigs = [
        { id: 'seasonal', label: 'SEASONAL', color: '#a78bfa' },
        { id: 't_setpoint', label: 'T SETPOINT', color: '#10b981' },
        { id: 'w_setpoint', label: 'W SETPOINT', color: '#f472b6' },
        { id: 'rh_setpoint', label: 'RH SETPOINT', color: '#22d3ee' }
    ];
    var modeBtns = {};
    modeConfigs.forEach(function(m) {
        var btn = document.createElement('button');
        btn.textContent = m.label;
        btn.dataset.modeColor = m.color;
        btn.style.cssText = 'padding:5px 12px;border-radius:20px;font-family:inherit;font-size:8px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;transition:all 0.3s;border:1.5px solid ' + m.color + ';color:' + m.color + ';background:transparent';
        modeBtns[m.id] = btn;
        modePanel.appendChild(btn);
    });
    container.appendChild(modePanel);

    // ===== OCCUPANT SLIDER (compact, below mode buttons — always visible) =====
    var occBar = document.createElement('div');
    occBar.style.cssText = 'position:absolute;top:108px;left:20px;z-index:10;display:flex;align-items:center;gap:8px;padding:6px 14px;border-radius:10px;background:' + cardBg + ';border:1px solid ' + border + ';backdrop-filter:blur(12px);font-family:' + font;
    occBar.innerHTML =
        '<span style="font-size:8px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;color:#f59e0b;white-space:nowrap">Occupants</span>' +
        '<input type="range" id="dyn-occ" min="0" max="500" step="5" value="100" style="width:100px;accent-color:#f59e0b;cursor:pointer;height:4px">' +
        '<span id="dyn-occ-val" style="font-size:12px;font-weight:900;color:' + fg + ';min-width:30px;text-align:right">100</span>';
    container.appendChild(occBar);

    // ===== CONTROLS (top right) =====
    var ctrls = document.createElement('div');
    ctrls.style.cssText = 'position:absolute;top:16px;right:20px;z-index:10;display:flex;gap:8px;font-family:' + font;
    var btnS = 'padding:6px 14px;border:1.5px solid ' + border + ';border-radius:8px;background:' + cardBg + ';color:' + fg + ';font-family:inherit;font-size:9px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer';
    ctrls.innerHTML = '<button id="dyn-pause" style="' + btnS + '">PAUSE</button><button id="dyn-speed" style="' + btnS + '">1x</button>';
    container.appendChild(ctrls);

    // ===== SETPOINT PANEL (left, below mode selector) =====
    var spPanel = document.createElement('div');
    spPanel.style.cssText = 'position:absolute;top:142px;left:20px;z-index:10;padding:14px 18px;border-radius:12px;background:' + cardBg + ';border:1px solid ' + border + ';backdrop-filter:blur(12px);font-family:' + font + ';width:220px;transition:opacity 0.3s';
    // W setpoint section
    var wSect = document.createElement('div');
    wSect.innerHTML =
        '<div style="font-size:9px;font-weight:900;letter-spacing:0.15em;text-transform:uppercase;color:#f472b6;margin-bottom:10px">W Setpoint</div>' +
        '<div style="display:flex;align-items:center;gap:10px">' +
            '<input type="range" id="dyn-wsp-w" min="3" max="20" step="0.5" value="8" style="flex:1;accent-color:#f472b6;cursor:pointer;height:4px">' +
            '<span id="dyn-wsp-w-val" style="font-size:14px;font-weight:900;color:' + fg + ';min-width:55px;text-align:right">8.0 g/kg</span>' +
        '</div>';
    spPanel.appendChild(wSect);
    // T setpoint section
    var tSect = document.createElement('div');
    tSect.innerHTML =
        '<div style="font-size:9px;font-weight:900;letter-spacing:0.15em;text-transform:uppercase;color:#10b981;margin-bottom:10px">T Setpoint</div>' +
        '<div style="display:flex;align-items:center;gap:10px">' +
            '<input type="range" id="dyn-wsp-t" min="10" max="30" step="0.5" value="22" style="flex:1;accent-color:#10b981;cursor:pointer;height:4px">' +
            '<span id="dyn-wsp-t-val" style="font-size:14px;font-weight:900;color:' + fg + ';min-width:55px;text-align:right">22.0 &deg;C</span>' +
        '</div>';
    spPanel.appendChild(tSect);
    // RH setpoint section
    var rhSect = document.createElement('div');
    rhSect.innerHTML =
        '<div style="font-size:9px;font-weight:900;letter-spacing:0.15em;text-transform:uppercase;color:#22d3ee;margin-bottom:10px">RH Setpoint</div>' +
        '<div style="display:flex;align-items:center;gap:10px">' +
            '<input type="range" id="dyn-wsp-rh" min="20" max="80" step="1" value="50" style="flex:1;accent-color:#22d3ee;cursor:pointer;height:4px">' +
            '<span id="dyn-wsp-rh-val" style="font-size:14px;font-weight:900;color:' + fg + ';min-width:55px;text-align:right">50 %RH</span>' +
        '</div>';
    spPanel.appendChild(rhSect);
    // Controller section
    var ctrlSect = document.createElement('div');
    ctrlSect.style.cssText = 'margin-top:12px;padding-top:10px;border-top:1px solid ' + border;
    ctrlSect.innerHTML =
        '<div style="font-size:9px;font-weight:900;letter-spacing:0.15em;text-transform:uppercase;color:' + muted + ';margin-bottom:6px">Controller</div>' +
        '<div style="display:flex;gap:10px">' +
            '<div><span id="dyn-werr-lbl" style="font-size:8px;color:' + muted + '">W err</span><br><span id="dyn-werr" style="font-size:11px;font-weight:900;color:#f472b6">0.0</span></div>' +
            '<div><span style="font-size:8px;color:' + muted + '">T err</span><br><span id="dyn-terr" style="font-size:11px;font-weight:900;color:#10b981">0.0</span></div>' +
            '<div><span style="font-size:8px;color:' + muted + '">SA cmd</span><br><span id="dyn-sacmd" style="font-size:11px;font-weight:900;color:#6366f1">--</span></div>' +
        '</div>';
    spPanel.appendChild(ctrlSect);

    container.appendChild(spPanel);

    // Tracks the most recent "significant" OA change for the Dry-Bulb timestamp readout
    var _lastOaStamp = { t: null, w: null, txt: '\u2014' };

    // ===== INFO PANEL (right) =====
    var info = document.createElement('div');
    info.style.cssText = 'position:absolute;top:46px;right:20px;z-index:10;padding:10px 16px;border-radius:10px;background:' + cardBg + ';border:1px solid ' + border + ';font-size:9px;color:' + muted + ';line-height:1.6;font-family:' + font;
    info.innerHTML = '<div>OA: <span id="dyn-ioa" style="color:' + fg + ';font-weight:800;font-size:10px">--</span></div>' +
        '<div style="color:' + muted + ';font-size:8px;font-weight:600;letter-spacing:0.05em;margin:-2px 0 4px 12px"><span id="dyn-oa-ts">—</span></div>' +
        '<div>SA: <span id="dyn-isa" style="color:' + fg + ';font-weight:800;font-size:10px">--</span></div>' +
        '<div>VAV avg: <span id="dyn-ivav" style="color:' + fg + ';font-weight:800;font-size:10px">--</span></div>' +
        '<div>SA enthalpy: <span id="dyn-ih" style="color:' + fg + ';font-weight:800;font-size:10px">--</span></div>';
    container.appendChild(info);

    // ===== ANNOTATION =====
    var annot = document.createElement('div');
    annot.style.cssText = 'position:absolute;bottom:50px;left:50%;transform:translateX(-50%);z-index:10;text-align:center;padding:10px 24px;border-radius:12px;background:' + cardBg + ';border:1px solid ' + border + ';font-size:11px;font-weight:600;color:' + fg + ';letter-spacing:0.03em;max-width:650px;transition:opacity 0.8s;opacity:0;font-family:' + font;
    annot.id = 'dyn-annot';
    container.appendChild(annot);

    // ===== LEGEND =====
    var legend = document.createElement('div');
    legend.style.cssText = 'position:absolute;bottom:16px;left:20px;z-index:10;display:flex;gap:16px;align-items:center;font-family:' + font;
    var ldot = function(c,l) { return '<div style="display:flex;align-items:center;gap:5px;font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:' + muted + '"><div style="width:8px;height:8px;border-radius:50%;background:' + c + '"></div>' + l + '</div>'; };
    legend.innerHTML = ldot('#3b82f6',_t('oa')) + ldot('#10b981',_t('sa')) + ldot('#f59e0b','VAV Zones') + '<div id="dyn-legend-sp" style="display:none;align-items:center;gap:5px;font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:' + muted + '"><div style="width:20px;height:2px;border-top:2px dashed #f472b6"></div><span id="dyn-legend-sp-text">' + _t('w_setpoint') + '</span></div>';
    // Process lines legend (bottom right)
    var procLegend = document.createElement('div');
    procLegend.style.cssText = 'position:absolute;bottom:16px;right:20px;z-index:10;display:flex;align-items:center;gap:12px;font-size:9px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;font-family:monospace';
    function pldot(c,t){ return '<div style="display:flex;align-items:center;gap:4px"><div style="width:20px;height:0;border-top:2px dashed '+c+'"></div><span style="color:'+c+'">'+t+'</span></div>'; }
    procLegend.innerHTML = pldot('#f472b6',_t('enthalpy')) + pldot('#fbbf24',_t('latent')) + pldot('#60a5fa',_t('sensible')) + pldot('#10b981',_t('diagnostic'));
    container.appendChild(procLegend);
    container.appendChild(legend);

    // ===== SVG =====
    var svg = el('svg', { viewBox: '0 0 ' + SVG_W + ' ' + SVG_H, preserveAspectRatio: 'xMidYMid meet', style: 'position:absolute;top:0;left:0;width:100%;height:100%' });
    container.appendChild(svg);
    var gStatic = el('g', {}); svg.appendChild(gStatic);
    var gSetpoint = el('g', {}); svg.appendChild(gSetpoint);
    var gSeason = el('g', {}); svg.appendChild(gSeason);
    var gProc = el('g', {}); svg.appendChild(gProc);
    var gDyn = el('g', {}); svg.appendChild(gDyn);

    // ===== BUILD STATIC CHART =====
    function buildChart() {
        var u = ui();
        gStatic.innerHTML = '';
        gStatic.appendChild(el('rect', { x: pad.left, y: pad.top, width: gridW, height: gridH, fill: u.chartBg }));
        for (var t = Math.floor(T_MIN); t <= T_MAX; t++) {
            var maj = t % 5 === 0;
            var wSat = getWLocal(t, 100);
            var ySat = Math.max(pad.top, yC(wSat));
            gStatic.appendChild(el('line', { x1: xC(t), y1: ySat, x2: xC(t), y2: pad.top+gridH, stroke: u.gridMajor, 'stroke-width': maj?1.5:0.8, opacity: maj?0.6:0.2 }));
            if (maj) { var tx = el('text', { x: xC(t), y: pad.top+gridH+25, 'text-anchor':'middle', fill: u.svgText, 'font-size':'12', 'font-weight':'900', 'font-family':'monospace' }); tx.textContent = t; gStatic.appendChild(tx); }
        }
        for (var w = 0; w <= W_MAX; w += 5) {
            gStatic.appendChild(el('line', { x1: pad.left, y1: yC(w/1000), x2: pad.left+gridW, y2: yC(w/1000), stroke: u.gridMajor, 'stroke-width':'0.8', opacity:'0.4' }));
            var wl = el('text', { x: pad.left+gridW+10, y: yC(w/1000)+4, fill: u.svgText, 'font-size':'10', 'font-weight':'900', 'font-family':'monospace' }); wl.textContent = w; gStatic.appendChild(wl);
        }
        [10,20,30,40,50,60,70,80,90,100].forEach(function(rh) {
            var pts = [];
            for (var t2 = T_MIN; t2 <= T_MAX; t2 += 0.5) { var w2 = getWLocal(t2, rh); if (w2 <= W_MAX/1000+0.005) pts.push(xC(t2)+','+yC(w2)); }
            if (pts.length > 0) {
                gStatic.appendChild(el('path', { d: 'M '+pts.join(' L '), fill:'none', stroke: rh===100?'#4f46e5':u.gridMajor, 'stroke-width': rh===100?2:1, opacity:'0.4' }));
                if (rh !== 100) { var lt = T_MAX-1.5; while (getWLocal(lt,rh)>(W_MAX/1000-0.001) && lt>T_MIN) lt-=0.5; if (lt>T_MIN) { var lb = el('text', { x: xC(lt), y: yC(getWLocal(lt,rh))-5, fill: u.svgText, 'font-size':'9', 'font-weight':'900', 'text-anchor':'middle', opacity:'0.7', 'font-family':'monospace' }); lb.textContent = rh+'%'; gStatic.appendChild(lb); } }
            }
        });
        var satW = getWLocal(25,100), xS = xC(25), yS = yC(satW), xN = xC(25.5), yN = yC(getWLocal(25.5,100));
        var ang = safeN(Math.atan2(yN-yS, xN-xS)*(180/Math.PI));
        var sl = el('text', { x: xS, y: yS-12, fill:'#cc00ff', 'font-size':'10', 'font-weight':'900', 'text-anchor':'middle', transform:'rotate('+ang+' '+xS+' '+(yS-12)+')', 'font-family':'monospace', 'letter-spacing':'0.15em' }); sl.textContent = _t('saturation_line'); gStatic.appendChild(sl);
        for (var h = -20; h <= 120; h += 10) {
            var ep = [];
            for (var et = T_MIN; et <= T_MAX; et++) { var ew = (h - 1.006*et)/(2501+1.86*et); if (ew>=0 && ew<=W_MAX/1000+0.002) ep.push(xC(et)+','+yC(ew)); }
            if (ep.length > 1) { gStatic.appendChild(el('path', { d:'M '+ep.join(' L '), fill:'none', stroke:'#f472b6', 'stroke-width':'0.6', 'stroke-dasharray':'6,4', opacity:'0.4' })); var lp=ep[0].split(','); var hl=el('text', { x:safeN(parseFloat(lp[0])-8), y:safeN(parseFloat(lp[1])-8), fill:'#f472b6', 'font-size':'9', 'font-weight':'900', 'text-anchor':'end', opacity:'0.8' }); hl.textContent=h; gStatic.appendChild(hl); }
        }
        var tH85=(85-2501*0.031)/(1.006+1.86*0.031);
        var ht=el('text',{x:xC(tH85),y:pad.top-8,fill:'#f472b6','font-size':'10','font-weight':'900',opacity:'0.8','text-anchor':'middle','font-family':'monospace','letter-spacing':'0.15em'}); ht.textContent=_t('enthalpy').toUpperCase()+' (kJ/kg)'; gStatic.appendChild(ht);
        // GIVONI
        var gG = el('g', { opacity:'0.8' }); gStatic.appendChild(gG);
        var rh80=[]; for(var gt=20;gt<=25;gt+=0.5) rh80.push([gt,getWLocal(gt,80)]);
        var rh20c=[]; for(var gt2=27;gt2>=20;gt2-=0.5) rh20c.push([gt2,getWLocal(gt2,20)]);
        var CZ=[].concat(rh80,[[27,getWLocal(27,50)],[27,getWLocal(27,20)]],rh20c);
        var rh100g=[]; for(var gt3=20;gt3<=27;gt3+=0.5) rh100g.push([gt3,getWLocal(gt3,100)]);
        var rh20g=[]; for(var gt4=32;gt4>=20;gt4-=0.5) rh20g.push([gt4,getWLocal(gt4,20)]);
        var NV=[].concat(rh100g,[[32,15.4/1000],[32,6.2/1000]],rh20g);
        var Mass=[].concat(rh80,[[33,16/1000],[37,getWLocal(37,30)],[37,3/1000],[20,getWLocal(20,20)]]);
        var MCV=[].concat(rh80,[[40,16/1000],[44,getWLocal(44,20)],[44,3/1000],[20,getWLocal(20,20)]]);
        var EVAP=[].concat(rh80,[[25,16/1000],[36,getWLocal(36,30)],[39,getWLocal(39,20)],[41,getWLocal(41,10)],[41,0],[27.2,0],[20,getWLocal(20,20)]]);
        var wRH80=[]; for(var gt5=18;gt5<=19.5;gt5+=0.5) wRH80.push([gt5,getWLocal(gt5,80)]);
        var wRH20=[]; for(var gt6=19.5;gt6>=18;gt6-=0.5) wRH20.push([gt6,getWLocal(gt6,20)]);
        var WINT=[].concat(wRH80,wRH20);
        var sP=function(arr){return arr.map(function(p){return xC(p[0])+','+yC(p[1])}).join(' ')};
        gG.appendChild(el('line',{x1:xC(40),y1:yC(16/1000),x2:xC(50),y2:yC(16/1000),stroke:'#6366f1','stroke-width':'1.5','stroke-dasharray':'4,4'}));
        gG.appendChild(el('line',{x1:xC(50),y1:yC(16/1000),x2:xC(50),y2:yC(0),stroke:'#6366f1','stroke-width':'1.5','stroke-dasharray':'4,4'}));
        gG.appendChild(el('line',{x1:xC(41),y1:yC(0),x2:xC(50),y2:yC(0),stroke:'#6366f1','stroke-width':'1.5','stroke-dasharray':'4,4'}));
        gG.appendChild(el('polygon',{points:sP(MCV),fill:'#ec4899','fill-opacity':'0.05',stroke:'#ec4899','stroke-width':'1'}));
        gG.appendChild(el('polygon',{points:sP(Mass),fill:'#8b5cf6','fill-opacity':'0.05',stroke:'#8b5cf6','stroke-width':'1'}));
        gG.appendChild(el('polygon',{points:sP(EVAP),fill:'#06b6d4','fill-opacity':'0.08',stroke:'#06b6d4','stroke-width':'1'}));
        gG.appendChild(el('polygon',{points:sP(NV),fill:'#f59e0b','fill-opacity':'0.05',stroke:'#f59e0b','stroke-width':'1'}));
        gG.appendChild(el('polygon',{points:sP(CZ),fill:'#10b981','fill-opacity':'0.15',stroke:'#10b981','stroke-width':'1.2'}));
        gG.appendChild(el('polygon',{points:sP(WINT),fill:'#3b82f6','fill-opacity':'0.15',stroke:'none'}));
        var wS19=getWLocal(19,100), yS19=yC(wS19), yT19=yS19-85;
        gG.appendChild(el('line',{x1:xC(19),y1:yT19,x2:xC(19),y2:pad.top+gridH,stroke:'#3b82f6','stroke-width':'2','stroke-dasharray':'6,4',opacity:'0.8'}));
        function addLbl(text,cx,cy,fill,fs,angle){var a={x:cx,y:cy,fill:fill,'font-size':fs||'9','font-weight':'900','text-anchor':'middle','font-family':'monospace','letter-spacing':'0.08em'};if(angle!=null)a.transform='rotate('+angle+','+cx+','+cy+')';var t2=el('text',a);t2.textContent=text;gG.appendChild(t2);}
        addLbl('19\u00B0C Boundary',xC(19)-5,yT19+5,'#3b82f6','10',-90);
        addLbl('Mechanical Cooling',xC(50)-10,yC(8/1000),'#6366f1','10',-90);
        addLbl('Mass Cooling',xC(44)-18,yC(8/1000),'#ec4899','9',-90);
        addLbl('& Natural Vent.',xC(44)-2,yC(8/1000),'#ec4899','9',-90);
        addLbl('Mass Cooling',xC(37)-10,yC(8/1000),'#8b5cf6','9',-90);
        addLbl('Evaporative',xC(34),yC(0.5/1000)-8,'#06b6d4','9',null);
        addLbl('Comfort',xC(23.5),yC(getWLocal(23.5,45)),'#10b981','11',null);
        addLbl('Winter',xC(18.75),yC(getWLocal(18.75,45)),'#3b82f6','11',-90);
        var xAL=el('text',{x:pad.left+gridW/2,y:pad.top+gridH+70,'text-anchor':'middle',fill:ui().svgAxis,'font-size':'14','font-weight':'900','font-family':'monospace','font-style':'italic','letter-spacing':'0.3em'});xAL.textContent=_t('dry_bulb_temp')+' (\u00B0C)';gStatic.appendChild(xAL);
        var yAL=el('text',{x:pad.left+gridW+65,y:pad.top+gridH/2,'text-anchor':'middle',fill:ui().svgAxis,'font-size':'14','font-weight':'900','font-family':'monospace','font-style':'italic','letter-spacing':'0.3em',transform:'rotate(-90,'+(pad.left+gridW+65)+','+(pad.top+gridH/2)+')'});yAL.textContent=_t('humidity_ratio')+' (g/kg)';gStatic.appendChild(yAL);
    }
    buildChart();

    // ===== SETPOINT REFERENCE ELEMENTS (SVG) =====
    // W mode: horizontal line | RH mode: curve path | Both share a label
    var spWLine = el('line', { x1: pad.left, y1: 0, x2: pad.left+gridW, y2: 0, stroke: '#f472b6', 'stroke-width': '2', 'stroke-dasharray': '10,6', opacity: '0' });
    var spRHPath = el('path', { d: '', fill: 'none', stroke: '#22d3ee', 'stroke-width': '2', 'stroke-dasharray': '10,6', opacity: '0' });
    var spTLine = el('line', { x1: 0, y1: pad.top, x2: 0, y2: pad.top+gridH, stroke: '#10b981', 'stroke-width': '2', 'stroke-dasharray': '10,6', opacity: '0' });
    var spLabel = el('text', { x: pad.left + 5, y: 0, fill: '#f472b6', 'font-size': '10', 'font-weight': '900', 'font-family': 'monospace', opacity: '0' });
    gSetpoint.appendChild(spWLine); gSetpoint.appendChild(spRHPath); gSetpoint.appendChild(spTLine); gSetpoint.appendChild(spLabel);

    // ===== PROCESS LINES (matching dashboard psychrometric tab style) =====
    var PROC_DLEN = 12; // temperature degrees for process line arm length
    // Dew point inverse: find T where W_sat(T) = W (binary search)
    var getDewPointT = function(W) {
        var lo = -20, hi = 60;
        for (var it = 0; it < 40; it++) {
            var mid = (lo + hi) / 2;
            if (getWLocal(mid, 100) < W) lo = mid; else hi = mid;
        }
        return (lo + hi) / 2;
    };
    // Arrow markers matching dashboard: triangle M0,0 L0,6 L6,3 Z
    var procDefs = el('defs', {});
    var arrowColors = { pink: '#f472b6', yellow: '#fbbf24', blue: '#60a5fa', emerald: '#10b981' };
    Object.keys(arrowColors).forEach(function(k) {
        var mk = el('marker', { id: 'arrow-' + k, markerWidth: '6', markerHeight: '6', refX: '6', refY: '3', orient: 'auto' });
        mk.appendChild(el('path', { d: 'M0,0 L0,6 L6,3 Z', fill: arrowColors[k] }));
        procDefs.appendChild(mk);
    });
    svg.insertBefore(procDefs, svg.firstChild);

    // 1. Enthalpy — pink, two lines from SA along constant h (NW to saturation, SE to lower h)
    var enthLineNW = el('line', { stroke: '#f472b6', 'stroke-width': '1.5', 'stroke-dasharray': '8,4', 'marker-end': 'url(#arrow-pink)' });
    var enthLineSE = el('line', { stroke: '#f472b6', 'stroke-width': '1.5', 'stroke-dasharray': '8,4', 'marker-end': 'url(#arrow-pink)' });
    gProc.appendChild(enthLineNW); gProc.appendChild(enthLineSE);

    // 2. Latent — yellow, path from SA up to saturation then bends right along curve + line down
    var latentUpPath = el('path', { fill: 'none', stroke: '#fbbf24', 'stroke-width': '2', 'stroke-dasharray': '8,4', 'marker-end': 'url(#arrow-yellow)' });
    var latentDownLine = el('line', { stroke: '#fbbf24', 'stroke-width': '2', 'stroke-dasharray': '8,4', 'marker-end': 'url(#arrow-yellow)' });
    gProc.appendChild(latentUpPath); gProc.appendChild(latentDownLine);
    // Saturation Point label with pointer
    var satPointerPath = el('path', { fill: 'none', stroke: '#fbbf24', 'stroke-width': '1.2', 'marker-end': 'url(#arrow-yellow)' });
    var satLabel = el('text', { fill: '#fbbf24', 'font-size': '9', 'font-weight': '900', 'font-family': 'monospace', 'font-style': 'italic' });
    satLabel.textContent = _t('saturation_point');
    gProc.appendChild(satPointerPath); gProc.appendChild(satLabel);

    // 3. Sensible — blue, path from SA left to dew point bending along saturation curve + line right
    var sensLeftPath = el('path', { fill: 'none', stroke: '#60a5fa', 'stroke-width': '2', 'stroke-dasharray': '8,4', 'marker-end': 'url(#arrow-blue)' });
    var sensRightLine = el('line', { stroke: '#60a5fa', 'stroke-width': '1.5', 'stroke-dasharray': '8,4', 'marker-end': 'url(#arrow-blue)' });
    gProc.appendChild(sensLeftPath); gProc.appendChild(sensRightLine);
    // Dew Point label with pointer
    var dpPointerPath = el('path', { fill: 'none', stroke: '#60a5fa', 'stroke-width': '1.2', 'marker-end': 'url(#arrow-blue)' });
    var dpLabel = el('text', { fill: '#60a5fa', 'font-size': '9', 'font-weight': '900', 'font-family': 'monospace', 'font-style': 'italic' });
    gProc.appendChild(dpPointerPath); gProc.appendChild(dpLabel);

    // 4. Diagnostic — emerald, two lines from SA along OA→SA slope in both directions
    var diagLine1 = el('line', { stroke: '#10b981', 'stroke-width': '2', 'stroke-dasharray': '6,3', 'marker-end': 'url(#arrow-emerald)' });
    var diagLine2 = el('line', { stroke: '#10b981', 'stroke-width': '2', 'stroke-dasharray': '6,3', 'marker-end': 'url(#arrow-emerald)' });
    gProc.appendChild(diagLine1); gProc.appendChild(diagLine2);

    // ===== SEASONAL ART =====
    var CX=340, CY=235;
    var gWin=el('g',{opacity:'0'}); gSeason.appendChild(gWin);
    var gSum=el('g',{opacity:'0'}); gSeason.appendChild(gSum);
    var gSpr=el('g',{opacity:'0'}); gSeason.appendChild(gSpr);
    function mkSnow(r,color){var g2=el('g',{});for(var a=0;a<6;a++){var ag=a*60*Math.PI/180;g2.appendChild(el('line',{x1:0,y1:0,x2:Math.cos(ag)*r,y2:Math.sin(ag)*r,stroke:color,'stroke-width':r>10?'2':'1.2','stroke-linecap':'round'}));var bx=Math.cos(ag)*r*0.55,by=Math.sin(ag)*r*0.55,br=r*0.35;g2.appendChild(el('line',{x1:bx,y1:by,x2:bx+Math.cos(ag+Math.PI/4)*br,y2:by+Math.sin(ag+Math.PI/4)*br,stroke:color,'stroke-width':'1','stroke-linecap':'round'}));g2.appendChild(el('line',{x1:bx,y1:by,x2:bx+Math.cos(ag-Math.PI/4)*br,y2:by+Math.sin(ag-Math.PI/4)*br,stroke:color,'stroke-width':'1','stroke-linecap':'round'}));}g2.appendChild(el('circle',{cx:0,cy:0,r:r*0.15,fill:color,opacity:'0.8'}));return g2;}
    var snowArr=[],snowSpecs=[{dx:-70,r:16,spd:18},{dx:-20,r:13,spd:22},{dx:40,r:11,spd:15},{dx:80,r:14,spd:20},{dx:-100,r:10,spd:25},{dx:10,r:17,spd:17},{dx:60,r:9,spd:28},{dx:-50,r:12,spd:19},{dx:100,r:8,spd:24},{dx:-30,r:15,spd:16}];
    snowSpecs.forEach(function(s){var sh=mkSnow(s.r,'#93c5fd');gWin.appendChild(sh);snowArr.push({el:sh,x0:CX+s.dx,yMin:CY-100,yMax:CY+80,speed:s.spd,phase:Math.random()*100,rot:0,rotSpeed:(Math.random()-0.5)*40});});
    var snowDots=[];for(var di=0;di<20;di++){var dot=el('circle',{r:2+Math.random()*2,fill:'#bfdbfe',opacity:'0.5'});gWin.appendChild(dot);snowDots.push({el:dot,x0:CX+(Math.random()-0.5)*240,yMin:CY-100,yMax:CY+80,speed:12+Math.random()*20,phase:Math.random()*100});}
    var wTxt=el('text',{x:CX,y:CY+100,fill:'#93c5fd','font-size':'32','font-weight':'900','text-anchor':'middle','font-family':'monospace','letter-spacing':'0.4em',opacity:'0.45'});wTxt.textContent='WINTER';gWin.appendChild(wTxt);
    var sunDefs=el('defs',{});var rg=el('radialGradient',{id:'dyn-sun-glow',cx:'50%',cy:'50%',r:'50%'});rg.appendChild(el('stop',{offset:'0%','stop-color':'#fbbf24','stop-opacity':'1'}));rg.appendChild(el('stop',{offset:'40%','stop-color':'#f97316','stop-opacity':'0.5'}));rg.appendChild(el('stop',{offset:'100%','stop-color':'#ef4444','stop-opacity':'0'}));sunDefs.appendChild(rg);gSum.appendChild(sunDefs);
    gSum.appendChild(el('circle',{cx:CX,cy:CY-10,r:'75',fill:'url(#dyn-sun-glow)',opacity:'0.35'}));gSum.appendChild(el('circle',{cx:CX,cy:CY-10,r:'35',fill:'#fbbf24',opacity:'0.9'}));gSum.appendChild(el('circle',{cx:CX,cy:CY-10,r:'24',fill:'#fde68a',opacity:'0.8'}));
    var gRays=el('g',{});gSum.appendChild(gRays);for(var ri=0;ri<12;ri++){var ra=ri*30*Math.PI/180;gRays.appendChild(el('line',{x1:CX+Math.cos(ra)*40,y1:(CY-10)+Math.sin(ra)*40,x2:CX+Math.cos(ra)*(62+(ri%2)*12),y2:(CY-10)+Math.sin(ra)*(62+(ri%2)*12),stroke:'#fbbf24','stroke-width':ri%2===0?'3':'1.8','stroke-linecap':'round',opacity:'0.7'}));}
    var sunRayAng=0;
    var heatW=[];for(var hi=0;hi<4;hi++){var hw=el('path',{fill:'none',stroke:'#f97316','stroke-width':'1.5','stroke-linecap':'round'});gSum.appendChild(hw);heatW.push({el:hw,baseY:CY+50+hi*14,phase:hi*1.2});}
    var sTxt=el('text',{x:CX,y:CY+110,fill:'#f97316','font-size':'32','font-weight':'900','text-anchor':'middle','font-family':'monospace','letter-spacing':'0.4em',opacity:'0.45'});sTxt.textContent='SUMMER';gSum.appendChild(sTxt);
    var peekR=el('g',{});gSpr.appendChild(peekR);for(var si=0;si<8;si++){var sa2=si*45*Math.PI/180;peekR.appendChild(el('line',{x1:(CX+50)+Math.cos(sa2)*22,y1:(CY-30)+Math.sin(sa2)*22,x2:(CX+50)+Math.cos(sa2)*35,y2:(CY-30)+Math.sin(sa2)*35,stroke:'#fcd34d','stroke-width':'2','stroke-linecap':'round',opacity:'0.45'}));}gSpr.appendChild(el('circle',{cx:CX+50,cy:CY-30,r:'18',fill:'#fcd34d',opacity:'0.65'}));var sprPeekAng=0;
    var gCM=el('g',{});gSpr.appendChild(gCM);gCM.appendChild(el('ellipse',{cx:CX-20,cy:CY-5,rx:'50',ry:'28',fill:'#94a3b8',opacity:'0.35'}));gCM.appendChild(el('ellipse',{cx:CX+25,cy:CY-12,rx:'45',ry:'30',fill:'#94a3b8',opacity:'0.35'}));gCM.appendChild(el('ellipse',{cx:CX-5,cy:CY-22,rx:'38',ry:'22',fill:'#94a3b8',opacity:'0.35'}));gCM.appendChild(el('ellipse',{cx:CX+45,cy:CY+2,rx:'32',ry:'20',fill:'#94a3b8',opacity:'0.35'}));
    var gCS=el('g',{});gSpr.appendChild(gCS);gCS.appendChild(el('ellipse',{cx:CX-85,cy:CY+35,rx:'35',ry:'18',fill:'#94a3b8',opacity:'0.2'}));gCS.appendChild(el('ellipse',{cx:CX-58,cy:CY+28,rx:'28',ry:'19',fill:'#94a3b8',opacity:'0.2'}));
    var bLines=[];for(var bi=0;bi<5;bi++){var bY=CY+48+bi*11,bX=CX-70+bi*18;var bL=el('line',{x1:bX,y1:bY,x2:bX+65+bi*10,y2:bY-1,stroke:'#a78bfa','stroke-width':'1.5','stroke-dasharray':'10,8',opacity:'0.4','stroke-linecap':'round'});gSpr.appendChild(bL);bLines.push({el:bL,offset:0,speed:15+bi*3});}
    var leafEls=[];[[-55,55,'#86efac'],[35,65,'#fcd34d'],[75,50,'#86efac'],[-25,72,'#fcd34d'],[95,60,'#a7f3d0']].forEach(function(ls,i){var lx=CX+ls[0],ly=CY+ls[1];var lf=el('path',{d:'M '+lx+','+ly+' Q '+(lx+5)+','+(ly-7)+' '+(lx+10)+','+ly+' Q '+(lx+5)+','+(ly+4)+' '+lx+','+ly+' Z',fill:ls[2],opacity:'0.5'});gSpr.appendChild(lf);leafEls.push({el:lf,baseX:lx,baseY:ly,phase:i*1.3});});
    var spTxt=el('text',{x:CX,y:CY+110,fill:'#a78bfa','font-size':'28','font-weight':'900','text-anchor':'middle','font-family':'monospace','letter-spacing':'0.3em',opacity:'0.45'});spTxt.textContent='SPRING';gSpr.appendChild(spTxt);

    // ===== AUTUMN ART =====
    var gAut=el('g',{opacity:0});gSeason.appendChild(gAut);
    // Setting sun (low on horizon, warm orange tones)
    var autSunDefs=el('defs',{});var autRg=el('radialGradient',{id:'dyn-aut-sun',cx:'50%',cy:'50%',r:'50%'});
    autRg.appendChild(el('stop',{offset:'0%','stop-color':'#fb923c','stop-opacity':'0.9'}));
    autRg.appendChild(el('stop',{offset:'60%','stop-color':'#ea580c','stop-opacity':'0.3'}));
    autRg.appendChild(el('stop',{offset:'100%','stop-color':'#dc2626','stop-opacity':'0'}));
    autSunDefs.appendChild(autRg);gAut.appendChild(autSunDefs);
    gAut.appendChild(el('circle',{cx:CX+70,cy:CY+60,r:'45',fill:'url(#dyn-aut-sun)',opacity:'0.4'}));
    gAut.appendChild(el('circle',{cx:CX+70,cy:CY+60,r:'18',fill:'#fb923c',opacity:'0.7'}));
    // Falling leaves
    var autLeaves=[];
    var autLeafColors=['#dc2626','#ea580c','#f59e0b','#b45309','#d97706'];
    for(var ai=0;ai<12;ai++){
        var alx=CX+(Math.random()-0.5)*240, aly=CY-80+Math.random()*160;
        var lSize=4+Math.random()*5;
        var lPath='M 0,0 Q '+lSize+','+-lSize+' '+(lSize*2)+',0 Q '+lSize+','+lSize+' 0,0 Z';
        var autL=el('path',{d:lPath,fill:autLeafColors[ai%5],opacity:0.5+Math.random()*0.3});
        gAut.appendChild(autL);
        autLeaves.push({el:autL,baseX:alx,baseY:aly,phase:ai*0.8,speed:8+Math.random()*12,drift:(Math.random()-0.5)*30,rot:0,rotSpd:(Math.random()-0.5)*60});
    }
    // Wispy clouds
    gAut.appendChild(el('ellipse',{cx:CX-40,cy:CY-20,rx:'45',ry:'18',fill:'#9ca3af',opacity:'0.2'}));
    gAut.appendChild(el('ellipse',{cx:CX+20,cy:CY-30,rx:'35',ry:'15',fill:'#9ca3af',opacity:'0.2'}));
    var autTxt=el('text',{x:CX,y:CY+110,fill:'#f59e0b','font-size':'28','font-weight':'900','text-anchor':'middle','font-family':'monospace','letter-spacing':'0.3em',opacity:'0.45'});autTxt.textContent='AUTUMN';gAut.appendChild(autTxt);

    var seasonArtMap={winter:gWin,summer:gSum,spring:gSpr,autumn:gAut};
    var artTarget={winter:0,summer:0,spring:0,autumn:0}, artCur={winter:0,summer:0,spring:0,autumn:0}, artTime=0;

    // ===== DYNAMIC POINT ELEMENTS =====
    var connOASA=el('line',{stroke:'#6366f1','stroke-width':'1',opacity:'0.15','stroke-dasharray':'4,4'});gDyn.appendChild(connOASA);
    var connSAV=[],vavTrailP=[],vavCircles=[];
    var OA={t:2,w:0.003}, SA={t:16,w:0.005}, VAVs=[];
    for(var vi=0;vi<6;vi++){VAVs.push({t:19+(vi-2.5)*0.7,w:0.007+(vi-2.5)*0.0003,trail:[]});var cl=el('line',{stroke:'#f59e0b','stroke-width':'1',opacity:'0.15','stroke-dasharray':'4,4'});gDyn.appendChild(cl);connSAV.push(cl);var tp=el('path',{fill:'none',stroke:'#f59e0b','stroke-width':'1.5',opacity:'0.25'});gDyn.appendChild(tp);vavTrailP.push(tp);}
    var saTrailP=el('path',{fill:'none',stroke:'#10b981','stroke-width':'1.5',opacity:'0.25'});gDyn.appendChild(saTrailP);
    var saTrail=[];
    var oaGlow=el('circle',{r:'14',fill:'#3b82f6',opacity:'0.15'});gDyn.appendChild(oaGlow);
    var oaCirc=el('circle',{r:'7',fill:'#3b82f6',stroke:darkMode?'#fff':'#000','stroke-width':'1.5'});gDyn.appendChild(oaCirc);
    var oaLbl=el('text',{fill:'#3b82f6','font-size':'10','font-weight':'900','font-family':'monospace'});oaLbl.textContent=_t('oa');gDyn.appendChild(oaLbl);
    var saGlow=el('circle',{r:'16',fill:'#10b981',opacity:'0.15'});gDyn.appendChild(saGlow);
    var saCirc=el('circle',{r:'7',fill:'#10b981',stroke:darkMode?'#fff':'#000','stroke-width':'1.5'});gDyn.appendChild(saCirc);
    var saLbl=el('text',{fill:'#10b981','font-size':'10','font-weight':'900','font-family':'monospace'});saLbl.textContent=_t('sa');gDyn.appendChild(saLbl);
    for(var vi2=0;vi2<6;vi2++){var vc=el('circle',{r:'5',fill:'#f59e0b',stroke:darkMode?'#fff':'#312e81','stroke-width':'1'});gDyn.appendChild(vc);vavCircles.push(vc);}
    var vavLbl=el('text',{fill:'#f59e0b','font-size':'10','font-weight':'900','font-family':'monospace'});vavLbl.textContent='VAV';gDyn.appendChild(vavLbl);

    // ===== OCCUPANT LOAD ANNOTATION (SA → VAV vector) =====
    var occArrow = el('line', { stroke: '#fb923c', 'stroke-width': '1.5', 'stroke-dasharray': '6,3', opacity: '0', 'marker-end': 'url(#dyn-arrowhead)' });
    gDyn.appendChild(occArrow);
    // Arrowhead marker
    var occDefs = el('defs', {});
    var occMarker = el('marker', { id: 'dyn-arrowhead', markerWidth: '8', markerHeight: '6', refX: '8', refY: '3', orient: 'auto' });
    var occArrowPath = el('path', { d: 'M0,0 L8,3 L0,6 Z', fill: '#fb923c' });
    occMarker.appendChild(occArrowPath);
    occDefs.appendChild(occMarker);
    svg.insertBefore(occDefs, svg.firstChild);
    // Label background and text
    var occLblBg = el('rect', { rx: '4', ry: '4', fill: darkMode ? '#1e293bdd' : '#ffffffdd', stroke: '#fb923c', 'stroke-width': '0.8', opacity: '0' });
    gDyn.appendChild(occLblBg);
    var occLbl1 = el('text', { fill: '#fb923c', 'font-size': '9', 'font-weight': '900', 'font-family': 'monospace', 'text-anchor': 'middle', opacity: '0' });
    gDyn.appendChild(occLbl1);
    var occLbl2 = el('text', { fill: '#94a3b8', 'font-size': '8', 'font-weight': '700', 'font-family': 'monospace', 'text-anchor': 'middle', opacity: '0' });
    gDyn.appendChild(occLbl2);

    // ===== DELTA H MINI BAR CHART (compares all 3 modes) =====
    var dhG = el('g', {});
    gDyn.appendChild(dhG);
    // Chart position and size
    var chX = xC(20) - 80, chY = pad.top + gridH * 0.04;
    var chW = 160, chH = 80, barW = 22, barGap = 10;
    var barColors = ['#a78bfa', '#10b981', '#f472b6', '#22d3ee']; // S, T, W, RH
    var barLabels = ['S', 'T', 'W', 'RH'];
    // Background
    dhG.appendChild(el('rect', { x: chX - 10, y: chY - 16, width: chW + 20, height: chH + 36, rx: 5, ry: 5, fill: darkMode ? '#0f172aee' : '#ffffffdd', stroke: '#6366f1', 'stroke-width': '0.8' }));
    // Title
    var dhTitle = el('text', { x: chX + chW / 2, y: chY - 4, fill: '#a78bfa', 'font-size': '9', 'font-weight': '900', 'font-family': 'monospace', 'text-anchor': 'middle', 'letter-spacing': '0.06em' });
    dhTitle.textContent = '\u0394h SA\u2013OA (kJ/kg)';
    dhG.appendChild(dhTitle);
    // Y-axis line
    dhG.appendChild(el('line', { x1: chX, y1: chY, x2: chX, y2: chY + chH, stroke: '#475569', 'stroke-width': '0.8' }));
    // Baseline
    dhG.appendChild(el('line', { x1: chX, y1: chY + chH, x2: chX + chW, y2: chY + chH, stroke: '#475569', 'stroke-width': '0.8' }));
    // Y-axis scale label (updated per frame)
    var yScaleLbl = el('text', { x: chX - 4, y: chY + 4, fill: '#94a3b8', 'font-size': '8', 'font-family': 'monospace', 'text-anchor': 'end' });
    dhG.appendChild(yScaleLbl);
    // 3 bars + value labels + axis labels
    var dhBars = [], dhVals = [], dhXLabels = [];
    for (var bi = 0; bi < 4; bi++) {
        var bx = chX + 12 + bi * (barW + barGap);
        var bar = el('rect', { x: bx, width: barW, rx: 3, ry: 3, fill: barColors[bi], opacity: '0.85' });
        dhG.appendChild(bar);
        dhBars.push(bar);
        var valTxt = el('text', { x: bx + barW / 2, fill: barColors[bi], 'font-size': '9', 'font-weight': '900', 'font-family': 'monospace', 'text-anchor': 'middle' });
        dhG.appendChild(valTxt);
        dhVals.push(valTxt);
        var xlbl = el('text', { x: bx + barW / 2, y: chY + chH + 12, fill: '#94a3b8', 'font-size': '8', 'font-weight': '700', 'font-family': 'monospace', 'text-anchor': 'middle' });
        xlbl.textContent = barLabels[bi];
        dhG.appendChild(xlbl);
        dhXLabels.push(xlbl);
    }
    // Active mode indicator (small triangle under the active bar)
    var dhArrow = el('polygon', { fill: '#ffffff', opacity: '0.9' });
    dhG.appendChild(dhArrow);

    // ===== CONTROL STATE =====
    var animMode = 'seasonal';
    var W_sp = 0.008;    // W setpoint mode (kg/kg = 8 g/kg)
    var RH_sp = 50;      // RH setpoint mode (%)
    var T_sp_user = 22;  // T setpoint mode (°C)
    var T_sp = 22;       // will be overridden dynamically per frame
    var occCount = 100;  // occupant count (0-500)
    var integral_w = 0, integral_rh = 0, integral_t = 0;
    var avgT = 22, avgW = 0.008, avgRH = 50;
    var Kp_w = 3.5, Ki_w = 0.8;
    var Kp_rh = 1.5, Ki_rh = 0.3;
    var Kp_t = 2.5, Ki_t = 0.6;
    var INT_CLAMP_W = 0.008, INT_CLAMP_RH = 30, INT_CLAMP_T = 12;
    var ctrlMode = 'HEATING';

    // OA seasonal disturbance — 4 seasons (natural annual cycle)
    var oaTargets = {
        winter: { t: 2, w: 0.0028, label: 'WINTER', color: '#60a5fa' },
        spring: { t: 18, w: 0.0088, label: 'SPRING', color: '#a78bfa' },
        summer: { t: 36, w: 0.020, label: 'SUMMER', color: '#f97316' },
        autumn: { t: 14, w: 0.006, label: 'AUTUMN', color: '#f59e0b' }
    };
    var seasonOrder = ['winter','spring','summer','autumn'];
    var curIdx = 0, elapsed = 0, SDUR = 14, TDUR = 4, CYCLE = SDUR + TDUR;
    var paused = false, speedMult = 1, TMAX2 = 80;

    // === WEATHER STRIP DATA (drives OA from real Open-Meteo data) ===
    var wsData = [], wsElapsed = 0, wsCurSeason = 'winter', wsDateLabel = '';
    function monthToSeason(m) {
        if (m === 11 || m === 0 || m === 1) return 'winter';
        if (m >= 2 && m <= 4) return 'spring';
        if (m >= 5 && m <= 7) return 'summer';
        return 'autumn';
    }
    function fetchWeatherStrip() {
        try {
            var stored = JSON.parse(localStorage.getItem('weatherLocation'));
            if (!stored || !stored.lat || !stored.lon) return;
            var now = new Date();
            var toDate = new Date(now); toDate.setDate(toDate.getDate() - 2);
            var fromDate = new Date(toDate); fromDate.setFullYear(fromDate.getFullYear() - 1);
            var fromStr = fromDate.toISOString().slice(0, 10);
            var toStr = toDate.toISOString().slice(0, 10);
            fetch('https://archive-api.open-meteo.com/v1/archive?latitude=' + stored.lat + '&longitude=' + stored.lon +
                '&start_date=' + fromStr + '&end_date=' + toStr + '&hourly=temperature_2m,relative_humidity_2m&timezone=auto')
            .then(function(r) { return r.json(); })
            .then(function(json) {
                if (json.error || !json.hourly) return;
                var times = json.hourly.time, temps = json.hourly.temperature_2m;
                var rhs = json.hourly.relative_humidity_2m || json.hourly.relativehumidity_2m;
                if (!times || !temps || !rhs) return;
                var raw = [];
                for (var i = 0; i < times.length; i++) {
                    if (temps[i] === null || rhs[i] === null) continue;
                    var d = new Date(times[i]);
                    raw.push({ t: temps[i], rh: rhs[i], w: getWLocal(temps[i], rhs[i]), ts: times[i], month: d.getMonth() });
                }
                // Downsample to ~2000 points for smooth playback
                if (raw.length > 2000) {
                    var step = Math.ceil(raw.length / 2000);
                    wsData = []; for (var i = 0; i < raw.length; i += step) wsData.push(raw[i]);
                } else { wsData = raw; }
            }).catch(function() {});
        } catch(e) {}
    }

    // ===== MODE SWITCH =====
    function switchMode(mode) {
        animMode = mode;
        integral_w = 0; integral_rh = 0; integral_t = 0;
        // Button highlight
        modeConfigs.forEach(function(m) {
            var b = modeBtns[m.id];
            if (m.id === mode) {
                b.style.background = m.color + '30';
                b.style.color = m.color;
                b.style.borderColor = m.color;
            } else {
                b.style.background = 'transparent';
                b.style.color = m.color;
                b.style.borderColor = m.color;
            }
        });
        var subtitleEl = container.querySelector('#dyn-subtitle');
        var modeEl2 = container.querySelector('#dyn-mode');
        var legendSpEl = container.querySelector('#dyn-legend-sp');
        var legendSpText = container.querySelector('#dyn-legend-sp-text');
        var werrLbl = container.querySelector('#dyn-werr-lbl');
        if (mode === 'seasonal') {
            if (subtitleEl) subtitleEl.textContent = 'Seasonal Weather Animation';
            if (modeEl2) modeEl2.style.opacity = '0';
            spPanel.style.display = 'none';
            if (legendSpEl) legendSpEl.style.display = 'none';
        } else if (mode === 't_setpoint') {
            if (subtitleEl) subtitleEl.textContent = 'T-Guided AHU Control';
            if (modeEl2) modeEl2.style.opacity = '1';
            spPanel.style.display = 'block';
            tSect.style.display = 'block';
            wSect.style.display = 'none';
            rhSect.style.display = 'none';
            ctrlSect.style.display = 'block';
            if (werrLbl) werrLbl.textContent = 'T err';
            if (legendSpEl) { legendSpEl.style.display = 'flex'; }
            if (legendSpText) legendSpText.textContent = _t('t_setpoint');
            spLabel.setAttribute('fill', '#10b981');
        } else if (mode === 'w_setpoint') {
            if (subtitleEl) subtitleEl.textContent = 'W-Guided AHU Control';
            if (modeEl2) modeEl2.style.opacity = '1';
            spPanel.style.display = 'block';
            wSect.style.display = 'block';
            tSect.style.display = 'none';
            rhSect.style.display = 'none';
            ctrlSect.style.display = 'block';
            if (werrLbl) werrLbl.textContent = 'W err';
            if (legendSpEl) { legendSpEl.style.display = 'flex'; }
            if (legendSpText) legendSpText.textContent = _t('w_setpoint');
            spLabel.setAttribute('fill', '#f472b6');
        } else {
            if (subtitleEl) subtitleEl.textContent = 'RH-Guided AHU Control';
            if (modeEl2) modeEl2.style.opacity = '1';
            spPanel.style.display = 'block';
            wSect.style.display = 'none';
            tSect.style.display = 'none';
            rhSect.style.display = 'block';
            ctrlSect.style.display = 'block';
            if (werrLbl) werrLbl.textContent = 'RH err';
            if (legendSpEl) { legendSpEl.style.display = 'flex'; }
            if (legendSpText) legendSpText.textContent = _t('rh_setpoint');
            spLabel.setAttribute('fill', '#22d3ee');
        }
    }

    // ===== UI BINDINGS =====
    var pauseBtn = container.querySelector('#dyn-pause');
    var speedBtn = container.querySelector('#dyn-speed');
    if (pauseBtn) pauseBtn.onclick = function(){ paused=!paused; pauseBtn.textContent=paused?'PLAY':'PAUSE'; };
    if (speedBtn) speedBtn.onclick = function(){ speedMult=speedMult===1?2:speedMult===2?0.5:1; speedBtn.textContent=speedMult+'x'; };

    // Mode buttons
    modeConfigs.forEach(function(m) {
        modeBtns[m.id].onclick = function() { switchMode(m.id); };
    });

    // Slider bindings (found after DOM is built)
    var wSlider = container.querySelector('#dyn-wsp-w');
    var wSliderVal = container.querySelector('#dyn-wsp-w-val');
    var rhSlider = container.querySelector('#dyn-wsp-rh');
    var rhSliderVal = container.querySelector('#dyn-wsp-rh-val');
    if (wSlider) wSlider.oninput = function() {
        W_sp = parseFloat(wSlider.value) / 1000;
        if (wSliderVal) wSliderVal.textContent = parseFloat(wSlider.value).toFixed(1) + ' g/kg';
        integral_w = 0;
    };
    if (rhSlider) rhSlider.oninput = function() {
        RH_sp = parseFloat(rhSlider.value);
        if (rhSliderVal) rhSliderVal.textContent = RH_sp.toFixed(0) + ' %RH';
        integral_rh = 0;
    };
    var tSlider = container.querySelector('#dyn-wsp-t');
    var tSliderVal = container.querySelector('#dyn-wsp-t-val');
    if (tSlider) tSlider.oninput = function() {
        T_sp_user = parseFloat(tSlider.value);
        if (tSliderVal) tSliderVal.textContent = T_sp_user.toFixed(1) + ' \u00B0C';
        integral_t = 0; integral_w = 0;
    };
    var occSlider = container.querySelector('#dyn-occ');
    var occSliderVal = container.querySelector('#dyn-occ-val');
    if (occSlider) occSlider.oninput = function() {
        occCount = parseInt(occSlider.value, 10);
        if (occSliderVal) occSliderVal.textContent = occCount;
    };

    // Initialize to seasonal mode
    switchMode('seasonal');

    // Fetch weather strip data for data-driven OA
    fetchWeatherStrip();

    function lerp(a,b,t2){return a+(b-a)*t2;}
    function smooth(t2){return t2*t2*(3-2*t2);}
    function clamp(v,lo,hi){return Math.max(lo,Math.min(hi,v));}

    var badgeEl = container.querySelector('#dyn-badge');
    var modeEl = container.querySelector('#dyn-mode');
    var annotEl = container.querySelector('#dyn-annot');
    var curAnnot = '';
    function setAnnot(text){if(text!==curAnnot){curAnnot=text;if(annotEl){annotEl.style.opacity='0';setTimeout(function(){annotEl.textContent=text;annotEl.style.opacity='1';},400);}}}
    function setBadge(label,color){if(badgeEl){badgeEl.textContent=label;badgeEl.style.color=color;badgeEl.style.borderColor=color;badgeEl.style.backgroundColor=color+'18';}}
    function setMode(mode, color){if(modeEl){modeEl.textContent=_t(mode.toLowerCase().replace(/ \+ /g,'_').replace(/ /g,'_'))||mode;modeEl.style.color=color;modeEl.style.borderColor=color;modeEl.style.backgroundColor=color+'18';}}
    function trailD(trail){if(trail.length<2)return '';return 'M '+trail.map(function(p){return xC(p.t)+','+yC(p.w)}).join(' L ');}

    // ===== MAIN UPDATE =====
    var running = true, lastT = 0;
    // Shared variables for display (set in update, read in render)
    var cur_err_w = 0, cur_err_rh = 0, cur_err_t = 0;
    var cur_SA_t_cmd = 22, cur_SA_w_cmd = 0.008, cur_SA_rh_cmd = 50;
    var cur_avgT = 22, cur_avgW = 0.008, cur_avgRH = 50;

    function update(dt) {
        // === OA source: weather strip data or fixed seasonal cycle ===
        var season, nextS, inTrans = false, tp2 = 0, tgtOA;

        if (wsData.length > 0) {
            // Data-driven OA from weather strip
            wsElapsed += dt;
            var ptsPerSec = wsData.length / 72; // full loop in ~72s (matches 4-season cycle)
            var idx = Math.floor(wsElapsed * ptsPerSec) % wsData.length;
            var wp = wsData[idx];
            var nextIdx = (idx + Math.max(1, Math.floor(ptsPerSec * 0.5))) % wsData.length;
            var wpNext = wsData[nextIdx];

            tgtOA = { t: wp.t, w: wp.w };
            season = monthToSeason(wp.month);
            nextS = monthToSeason(wpNext.month);
            wsCurSeason = season;

            // Format date label
            var d = new Date(wp.ts);
            var mNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            wsDateLabel = mNames[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear() + '  ' +
                d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');

            // Smooth season transition at boundaries
            if (season !== nextS) { inTrans = true; tp2 = 0.5; }
        } else {
            // Fallback: fixed seasonal cycle
            elapsed += dt;
            if (elapsed >= CYCLE) { elapsed -= CYCLE; curIdx = (curIdx+1)%4; }
            season = seasonOrder[curIdx]; nextS = seasonOrder[(curIdx+1)%4];
            var oaTgt = oaTargets[season], oaNext = oaTargets[nextS];
            inTrans = elapsed >= SDUR;
            tp2 = inTrans ? smooth((elapsed - SDUR) / TDUR) : 0;
            if (inTrans) { tgtOA = { t: lerp(oaTgt.t, oaNext.t, tp2), w: lerp(oaTgt.w, oaNext.w, tp2) }; }
            else { tgtOA = oaTgt; }
            wsDateLabel = '';
        }

        OA.t += (tgtOA.t - OA.t) * 0.06 + (Math.random()-0.5) * 0.08;
        OA.w += (tgtOA.w - OA.w) * 0.06 + (Math.random()-0.5) * 0.00008;

        // === Measure zone conditions ===
        avgT = VAVs.reduce(function(s,v){return s+v.t;},0) / VAVs.length;
        avgW = VAVs.reduce(function(s,v){return s+v.w;},0) / VAVs.length;
        avgRH = getRHLocal(avgT, avgW);
        cur_avgT = avgT; cur_avgW = avgW; cur_avgRH = avgRH;

        // === CONTROLLER per mode ===
        var SA_w_cmd, SA_t_cmd;

        // CZ temperature boundaries
        var CZ_T_LO = 20, CZ_T_HI = 27;
        // VAV gain extremes (i=0..5): heatGain 1.5..3.5, moistGain 0.0006..0.001
        var SA_T_LO = CZ_T_LO - 1.5;   // 18.5
        var SA_T_HI = CZ_T_HI - 3.5;   // 23.5
        // Zone avg target: account for ±1°C spread around avg
        T_sp = clamp(OA.t, CZ_T_LO + 1, CZ_T_HI - 1); // 21..26
        // CZ humidity from 40-60% RH at zone temperature
        var CZ_W_LO = getWLocal(T_sp, 40);
        var CZ_W_HI = getWLocal(T_sp, 60);
        // SA feasible W range to keep ALL VAVs within 40-60% RH
        var SA_W_LO = CZ_W_LO - 0.0006;
        var SA_W_HI = CZ_W_HI - 0.001;

        if (animMode === 'seasonal') {
            // Pure nature — no humidity control, no setpoints
            // AHU heats/cools for CZ temp, humidity follows OA freely
            SA_t_cmd = clamp(OA.t, SA_T_LO, SA_T_HI);
            SA_w_cmd = clamp(OA.w, 0.001, getWLocal(SA_t_cmd, 98));
            SA.t += (SA_t_cmd - SA.t) * 0.04 + (Math.random()-0.5) * 0.04;
            SA.w += (SA_w_cmd - SA.w) * 0.04 + (Math.random()-0.5) * 0.00004;
            SA.w = clamp(SA.w, 0.001, getWLocal(SA.t, 98));
        } else if (animMode === 't_setpoint') {
            // SA setpoint: user sets T for SA. Auto humidity for SA.
            // Zones float at SA + occupant loads, targeting 45-55% RH in zones.
            T_sp = T_sp_user;
            var W_target = clamp(OA.w, getWLocal(T_sp, 40), getWLocal(T_sp, 60));
            var err_t = T_sp - SA.t;
            var err_w = W_target - SA.w;
            cur_err_t = err_t; cur_err_w = err_w;
            integral_t = clamp(integral_t + err_t * dt, -INT_CLAMP_T, INT_CLAMP_T);
            integral_w = clamp(integral_w + err_w * dt, -INT_CLAMP_W, INT_CLAMP_W);
            SA_t_cmd = T_sp + Kp_t * err_t + Ki_t * integral_t;
            SA_w_cmd = W_target + Kp_w * err_w + Ki_w * integral_w;
            SA_t_cmd = clamp(SA_t_cmd, SA_T_LO, SA_T_HI);
            SA_w_cmd = clamp(SA_w_cmd, 0.001, 0.025);
            SA_w_cmd = Math.min(SA_w_cmd, getWLocal(SA_t_cmd, 98));
            var mix = 0.12;
            var mixT = SA_t_cmd * (1 - mix) + OA.t * mix;
            var mixW = SA_w_cmd * (1 - mix) + OA.w * mix;
            SA.t += (mixT - SA.t) * 0.05 + (Math.random()-0.5) * 0.04;
            SA.w += (mixW - SA.w) * 0.05 + (Math.random()-0.5) * 0.00004;
            SA.t = clamp(SA.t, SA_T_LO, SA_T_HI);
            SA.w = clamp(SA.w, 0.001, getWLocal(SA.t, 98));
        } else if (animMode === 'w_setpoint') {
            // SA setpoint: user sets W for SA. PI targets SA directly.
            var err_w = W_sp - SA.w;
            var err_t = T_sp - SA.t;
            cur_err_w = err_w; cur_err_t = err_t;
            integral_w = clamp(integral_w + err_w * dt, -INT_CLAMP_W, INT_CLAMP_W);
            integral_t = clamp(integral_t + err_t * dt, -INT_CLAMP_T, INT_CLAMP_T);
            SA_w_cmd = W_sp + Kp_w * err_w + Ki_w * integral_w;
            SA_t_cmd = T_sp + Kp_t * err_t + Ki_t * integral_t;
            SA_w_cmd = clamp(SA_w_cmd, 0.001, 0.025);
            SA_t_cmd = clamp(SA_t_cmd, SA_T_LO, SA_T_HI);
            var maxW = getWLocal(SA_t_cmd, 98);
            SA_w_cmd = Math.min(SA_w_cmd, maxW);
            // OA mixing effect — SA is partly influenced by outdoor air intake
            var mix = 0.12;
            var mixT = SA_t_cmd * (1 - mix) + OA.t * mix;
            var mixW = SA_w_cmd * (1 - mix) + OA.w * mix;
            SA.t += (mixT - SA.t) * 0.05 + (Math.random()-0.5) * 0.04;
            SA.w += (mixW - SA.w) * 0.05 + (Math.random()-0.5) * 0.00004;
            SA.t = clamp(SA.t, SA_T_LO, SA_T_HI);
            SA.w = clamp(SA.w, 0.001, getWLocal(SA.t, 98));
        } else {
            // SA setpoint: user sets RH for SA. PI targets SA RH directly.
            var SA_rh_actual = getRHLocal(SA.t, SA.w);
            var err_rh = RH_sp - SA_rh_actual;
            var err_t2 = T_sp - SA.t;
            cur_err_rh = err_rh; cur_err_t = err_t2;
            integral_rh = clamp(integral_rh + err_rh * dt, -INT_CLAMP_RH, INT_CLAMP_RH);
            integral_t = clamp(integral_t + err_t2 * dt, -INT_CLAMP_T, INT_CLAMP_T);
            var SA_rh_cmd = RH_sp + Kp_rh * err_rh + Ki_rh * integral_rh;
            SA_t_cmd = T_sp + Kp_t * err_t2 + Ki_t * integral_t;
            SA_rh_cmd = clamp(SA_rh_cmd, 5, 98);
            SA_t_cmd = clamp(SA_t_cmd, SA_T_LO, SA_T_HI);
            SA_w_cmd = getWLocal(SA_t_cmd, SA_rh_cmd);
            SA_w_cmd = clamp(SA_w_cmd, 0.001, 0.025);
            cur_SA_rh_cmd = SA_rh_cmd;
            // OA mixing effect
            var mix2 = 0.12;
            var mixT2 = SA_t_cmd * (1 - mix2) + OA.t * mix2;
            var mixW2 = SA_w_cmd * (1 - mix2) + OA.w * mix2;
            SA.t += (mixT2 - SA.t) * 0.05 + (Math.random()-0.5) * 0.04;
            SA.w += (mixW2 - SA.w) * 0.05 + (Math.random()-0.5) * 0.00004;
            SA.t = clamp(SA.t, SA_T_LO, SA_T_HI);
            SA.w = clamp(SA.w, 0.001, getWLocal(SA.t, 98));
        }
        cur_SA_t_cmd = SA_t_cmd || 22; cur_SA_w_cmd = SA_w_cmd || 0.008;

        // === VAV zones respond to SA + occupant loads ===
        var occScale = occCount / 100; // scale relative to baseline 100 people
        VAVs.forEach(function(v, i) {
            var heatGain = (2.5 + (i - 2.5) * 0.4) * occScale;        // sensible scales with occupants
            var perspirationW = (0.0015 + (i - 2.5) * 0.0002) * occScale; // latent scales with occupants
            var zoneTarget_t = SA.t + heatGain;
            var zoneTarget_w = SA.w + perspirationW;
            var lag = 0.025 + i * 0.004;
            v.t += (zoneTarget_t - v.t) * lag + (Math.random()-0.5) * 0.04;
            v.w += (zoneTarget_w - v.w) * lag + (Math.random()-0.5) * 0.00004;
            v.w = clamp(v.w, 0.001, getWLocal(v.t, 95));
            v.trail.push({t:v.t, w:v.w});
            if (v.trail.length > TMAX2) v.trail.shift();
        });

        saTrail.push({t:SA.t, w:SA.w});
        if (saTrail.length > TMAX2) saTrail.shift();

        // === Control mode detection (for controller modes) ===
        var heating = SA.t > OA.t + 2;
        var cooling = SA.t < OA.t - 2;
        var humidifying = SA.w > OA.w + 0.001;
        var dehumidifying = SA.w < OA.w - 0.001;
        var economizerRange = Math.abs(SA.t - OA.t) < 3 && Math.abs(SA.w - OA.w) < 0.002;

        if (animMode !== 'seasonal') {
            if (economizerRange) { ctrlMode = 'ECONOMIZER'; setMode('ECONOMIZER', '#a78bfa'); }
            else if (cooling && dehumidifying) { ctrlMode = 'COOL + DEHUMID'; setMode('COOL + DEHUMID', '#06b6d4'); }
            else if (heating && humidifying) { ctrlMode = 'HEAT + HUMID'; setMode('HEAT + HUMID', '#f97316'); }
            else if (cooling) { ctrlMode = 'COOLING'; setMode('COOLING', '#3b82f6'); }
            else if (heating) { ctrlMode = 'HEATING'; setMode('HEATING', '#ef4444'); }
            else if (dehumidifying) { ctrlMode = 'DEHUMID'; setMode('DEHUMID', '#06b6d4'); }
            else if (humidifying) { ctrlMode = 'HUMIDIFY'; setMode('HUMIDIFY', '#f59e0b'); }
            else { ctrlMode = 'STEADY'; setMode('STEADY', '#10b981'); }
        }

        // Badge (season label + weather date)
        var dispSeason = inTrans && tp2 > 0.5 ? nextS : season;
        var badgeLbl = oaTargets[dispSeason].label;
        if (wsData.length > 0 && wsDateLabel) badgeLbl = oaTargets[dispSeason].label + ' \u2022 ' + wsDateLabel;
        setBadge(badgeLbl, oaTargets[dispSeason].color);

        // === Annotation ===
        var annText;
        if (animMode === 'seasonal') {
            var seasonName = oaTargets[dispSeason].label;
            var srcTag = wsData.length > 0 ? ' [Weather Strip]' : '';
            annText = seasonName + ' conditions \u2014 OA ' + OA.t.toFixed(0) + '\u00B0C, ' + (OA.w*1000).toFixed(0) + ' g/kg \u2014 AHU conditioning toward comfort' + srcTag;
        } else if (animMode === 't_setpoint') {
            var tSpStr = T_sp_user.toFixed(1);
            var errTstr = Math.abs(cur_err_t).toFixed(1);
            if (economizerRange) { annText = 'Economizer mode \u2014 OA near T setpoint (' + tSpStr + '\u00B0C), minimal processing'; }
            else if (Math.abs(cur_err_t) < 0.5) { annText = 'T at setpoint (' + tSpStr + '\u00B0C) \u2014 controller maintaining steady state with auto humidity'; }
            else if (cur_err_t > 0) { annText = 'Zones below T setpoint (' + tSpStr + '\u00B0C) by ' + errTstr + '\u00B0 \u2014 heating + auto humidity'; }
            else { annText = 'Zones above T setpoint (' + tSpStr + '\u00B0C) by ' + errTstr + '\u00B0 \u2014 cooling + auto humidity'; }
        } else if (animMode === 'w_setpoint') {
            var wSpGkg = (W_sp * 1000).toFixed(1);
            var errWgkg = (cur_err_w * 1000).toFixed(2);
            if (economizerRange) { annText = 'Economizer mode \u2014 OA near setpoint (' + wSpGkg + ' g/kg), minimal processing'; }
            else if (Math.abs(cur_err_w) < 0.0005) { annText = 'W at setpoint (' + wSpGkg + ' g/kg) \u2014 controller maintaining steady state'; }
            else if (cur_err_w > 0) { annText = 'Zones below W setpoint (' + wSpGkg + ' g/kg) by ' + errWgkg + ' g/kg \u2014 increasing SA moisture'; }
            else { annText = 'Zones above W setpoint (' + wSpGkg + ' g/kg) by ' + (-parseFloat(errWgkg)).toFixed(2) + ' g/kg \u2014 dehumidifying SA'; }
        } else {
            var rhSpStr = RH_sp.toFixed(0);
            var errRhStr = Math.abs(cur_err_rh).toFixed(1);
            if (economizerRange) { annText = 'Economizer mode \u2014 OA near setpoint (' + rhSpStr + ' %RH), minimal processing'; }
            else if (Math.abs(cur_err_rh) < 0.5) { annText = 'RH at setpoint (' + rhSpStr + ' %RH) \u2014 controller maintaining steady state'; }
            else if (cur_err_rh > 0) { annText = 'Zones below RH setpoint (' + rhSpStr + ' %RH) by ' + errRhStr + '% \u2014 increasing SA moisture'; }
            else { annText = 'Zones above RH setpoint (' + rhSpStr + ' %RH) by ' + errRhStr + '% \u2014 dehumidifying SA'; }
        }
        setAnnot(annText);

        // === Info panel ===
        var ioaE=container.querySelector('#dyn-ioa'), isaE=container.querySelector('#dyn-isa'), ivavE=container.querySelector('#dyn-ivav'), ihE=container.querySelector('#dyn-ih');

        // === OA timestamp — stamped whenever OA.t or OA.w changes meaningfully ===
        // For weather-strip playback: show the HISTORICAL date/time of the current data point.
        // For the fallback seasonal cycle (no weather strip): show wall-clock time.
        if (_lastOaStamp.t === null || Math.abs(OA.t - _lastOaStamp.t) > 0.1 || Math.abs((OA.w - _lastOaStamp.w) * 1000) > 0.05) {
            _lastOaStamp.t = OA.t;
            _lastOaStamp.w = OA.w;
            var _histTs = (wsData.length > 0 && typeof wp !== 'undefined' && wp && wp.ts) ? wp.ts : null;
            var _n = _histTs ? new Date(_histTs) : new Date();
            var _y = _n.getFullYear();
            var _mo = String(_n.getMonth() + 1).padStart(2, '0');
            var _d = String(_n.getDate()).padStart(2, '0');
            var _hh = String(_n.getHours()).padStart(2, '0');
            var _mm = String(_n.getMinutes()).padStart(2, '0');
            _lastOaStamp.txt = _y + '-' + _mo + '-' + _d + ' ' + _hh + ':' + _mm + (_histTs ? '' : ':' + String(_n.getSeconds()).padStart(2, '0'));
            _lastOaStamp.source = _histTs ? 'historical' : 'live';
        }
        var oaTsE = container.querySelector('#dyn-oa-ts');
        if (oaTsE) oaTsE.textContent = '\u22B3 ' + _lastOaStamp.txt + (_lastOaStamp.source === 'historical' ? '' : ' (live)');
        if (animMode === 'rh_setpoint') {
            if(ioaE) ioaE.textContent = OA.t.toFixed(1)+'\u00B0C / '+getRHLocal(OA.t,OA.w).toFixed(0)+' %RH';
            if(isaE) isaE.textContent = SA.t.toFixed(1)+'\u00B0C / '+getRHLocal(SA.t,SA.w).toFixed(0)+' %RH';
            if(ivavE) ivavE.textContent = avgT.toFixed(1)+'\u00B0C / '+avgRH.toFixed(0)+' %RH';
        } else if (animMode === 't_setpoint') {
            if(ioaE) ioaE.textContent = OA.t.toFixed(1)+'\u00B0C / '+(OA.w*1000).toFixed(1)+' g/kg / '+getRHLocal(OA.t,OA.w).toFixed(0)+'%';
            if(isaE) isaE.textContent = SA.t.toFixed(1)+'\u00B0C / '+(SA.w*1000).toFixed(1)+' g/kg / '+getRHLocal(SA.t,SA.w).toFixed(0)+'%';
            if(ivavE) ivavE.textContent = avgT.toFixed(1)+'\u00B0C / '+(avgW*1000).toFixed(1)+' g/kg / '+avgRH.toFixed(0)+'%';
        } else {
            if(ioaE) ioaE.textContent = OA.t.toFixed(1)+'\u00B0C / '+(OA.w*1000).toFixed(1)+' g/kg';
            if(isaE) isaE.textContent = SA.t.toFixed(1)+'\u00B0C / '+(SA.w*1000).toFixed(1)+' g/kg';
            if(ivavE) ivavE.textContent = avgT.toFixed(1)+'\u00B0C / '+(avgW*1000).toFixed(1)+' g/kg';
        }
        if(ihE) ihE.textContent = getHLocal(SA.t, SA.w).toFixed(1) + ' kJ/kg';

        // === Controller panel (only in setpoint modes) ===
        if (animMode !== 'seasonal') {
            var werrE=container.querySelector('#dyn-werr'), terrE=container.querySelector('#dyn-terr'), sacmdE=container.querySelector('#dyn-sacmd');
            if (animMode === 'w_setpoint') {
                if(werrE) werrE.textContent = (cur_err_w > 0 ? '+' : '') + (cur_err_w*1000).toFixed(2) + ' g/kg';
                if(terrE) terrE.textContent = (cur_err_t > 0 ? '+' : '') + cur_err_t.toFixed(2) + '\u00B0C';
                if(sacmdE) sacmdE.textContent = cur_SA_t_cmd.toFixed(1) + '\u00B0/' + (cur_SA_w_cmd*1000).toFixed(1);
            } else {
                if(werrE) werrE.textContent = (cur_err_rh > 0 ? '+' : '') + cur_err_rh.toFixed(1) + ' %RH';
                if(terrE) terrE.textContent = (cur_err_t > 0 ? '+' : '') + cur_err_t.toFixed(2) + '\u00B0C';
                if(sacmdE) sacmdE.textContent = cur_SA_t_cmd.toFixed(1) + '\u00B0/' + cur_SA_rh_cmd.toFixed(0) + '%';
            }
        }

        // Art opacity
        seasonOrder.forEach(function(s){artTarget[s]=0;});
        if(inTrans){artTarget[season]=1-tp2;artTarget[nextS]=tp2;}else{artTarget[season]=1;}
    }

    function animateArt(dt) {
        artTime += dt;
        snowArr.forEach(function(sf){sf.phase+=dt*sf.speed;sf.rot+=dt*sf.rotSpeed;var yR=sf.yMax-sf.yMin;var yP=sf.yMin+(sf.phase%yR);var wb=Math.sin(sf.phase*0.05)*8;sf.el.setAttribute('transform','translate('+(sf.x0+wb)+','+yP+') rotate('+sf.rot+')');});
        snowDots.forEach(function(sd){sd.phase+=dt*sd.speed;var yR=sd.yMax-sd.yMin;var yP=sd.yMin+(sd.phase%yR);var wb=Math.sin(sd.phase*0.08)*5;sd.el.setAttribute('cx',sd.x0+wb);sd.el.setAttribute('cy',yP);});
        sunRayAng+=dt*18;gRays.setAttribute('transform','rotate('+sunRayAng+' '+CX+' '+(CY-10)+')');
        heatW.forEach(function(hw2){hw2.phase+=dt;var sh=Math.sin(hw2.phase*2)*6;var op2=0.2+Math.sin(hw2.phase*1.5)*0.15;var y2=hw2.baseY+sh;hw2.el.setAttribute('d','M '+(CX-60)+','+y2+' Q '+(CX-30)+','+(y2-6)+' '+CX+','+y2+' Q '+(CX+30)+','+(y2+6)+' '+(CX+60)+','+y2);hw2.el.setAttribute('opacity',op2.toFixed(2));});
        var cdx=Math.sin(artTime*0.4)*20;gCM.setAttribute('transform','translate('+cdx.toFixed(1)+' 0)');
        var cdx2=Math.sin(artTime*0.3+1)*-14;gCS.setAttribute('transform','translate('+cdx2.toFixed(1)+' 0)');
        sprPeekAng+=dt*10;peekR.setAttribute('transform','rotate('+sprPeekAng+' '+(CX+50)+' '+(CY-30)+')');
        bLines.forEach(function(bl){bl.offset-=dt*bl.speed;bl.el.setAttribute('stroke-dashoffset',bl.offset.toFixed(1));});
        leafEls.forEach(function(lf){lf.phase+=dt;var dx=Math.sin(lf.phase*1.2)*10;var dy=Math.sin(lf.phase*0.8+0.5)*5;lf.el.setAttribute('transform','translate('+dx.toFixed(1)+' '+dy.toFixed(1)+')');});
        // Autumn falling leaves animation
        autLeaves.forEach(function(al){
            al.phase+=dt*al.speed; al.rot+=dt*al.rotSpd;
            var yRange=180; var yP=al.baseY+(al.phase%yRange)-40;
            if(yP>CY+100) al.phase=0;
            var wx=Math.sin(al.phase*0.06+al.drift)*al.drift;
            al.el.setAttribute('transform','translate('+(al.baseX+wx).toFixed(1)+','+yP.toFixed(1)+') rotate('+al.rot.toFixed(0)+')');
        });
        seasonOrder.forEach(function(s){artCur[s]+=(artTarget[s]-artCur[s])*0.08;seasonArtMap[s].setAttribute('opacity',artCur[s].toFixed(3));});
    }

    function render() {
        var pulse = Math.sin(Date.now()/300)*2;

        // === Setpoint visualization per mode ===
        if (animMode === 'seasonal') {
            spWLine.setAttribute('opacity', '0');
            spRHPath.setAttribute('opacity', '0');
            spTLine.setAttribute('opacity', '0');
            spLabel.setAttribute('opacity', '0');
        } else if (animMode === 't_setpoint') {
            spWLine.setAttribute('opacity', '0');
            spRHPath.setAttribute('opacity', '0');
            var tX = xC(T_sp_user);
            spTLine.setAttribute('x1', tX); spTLine.setAttribute('x2', tX);
            spTLine.setAttribute('opacity', '0.6');
            spLabel.setAttribute('x', tX + 6); spLabel.setAttribute('y', pad.top + 18);
            spLabel.textContent = 'T SP: ' + T_sp_user.toFixed(1) + '\u00B0C';
            spLabel.setAttribute('opacity', '1');
        } else if (animMode === 'w_setpoint') {
            var spY = yC(W_sp);
            spWLine.setAttribute('y1', spY); spWLine.setAttribute('y2', spY);
            spWLine.setAttribute('opacity', '0.6');
            spRHPath.setAttribute('opacity', '0');
            spTLine.setAttribute('opacity', '0');
            spLabel.setAttribute('x', pad.left + 5); spLabel.setAttribute('y', spY - 5);
            spLabel.textContent = 'W SP: ' + (W_sp*1000).toFixed(1) + ' g/kg';
            spLabel.setAttribute('opacity', '1');
        } else {
            spWLine.setAttribute('opacity', '0');
            spTLine.setAttribute('opacity', '0');
            var rhPts = [];
            for (var rhT = T_MIN; rhT <= T_MAX; rhT += 1) { var rhW = getWLocal(rhT, RH_sp); if (rhW <= W_MAX/1000 + 0.005) rhPts.push(xC(rhT) + ',' + yC(rhW)); }
            spRHPath.setAttribute('d', rhPts.length > 1 ? 'M ' + rhPts.join(' L ') : '');
            spRHPath.setAttribute('opacity', '0.6');
            var spLabelW = getWLocal(22, RH_sp);
            spLabel.setAttribute('x', xC(22) + 8); spLabel.setAttribute('y', yC(spLabelW) - 8);
            spLabel.textContent = 'RH SP: ' + RH_sp.toFixed(0) + '%';
            spLabel.setAttribute('opacity', '1');
        }

        // === Process lines locked to SA (dashboard-matching style) ===
        var sxI = xC(SA.t), syI = yC(SA.w);
        var yAxis = pad.top + gridH; // bottom of chart (W=0)
        var hI = getHLocal(SA.t, SA.w);
        var dpT = getDewPointT(SA.w);
        var xDp = xC(Math.max(T_MIN, dpT));
        var satW = getWLocal(SA.t, 100);
        var ySat = yC(satW);
        // Enthalpy line: NW toward saturation, SE toward lower h
        var highT = SA.t; // walk NW along constant h until saturation
        for (var eh = SA.t; eh >= T_MIN; eh -= 0.5) { var ew = (hI - 1.006*eh)/(2501+1.86*eh); if (ew >= getWLocal(eh,100) || ew < 0) break; highT = eh; }
        var xNW = xC(highT), yNW = yC(getWLocal(highT, 100));
        var tSE = Math.min(SA.t + PROC_DLEN, T_MAX);
        var wSE = (hI - 1.006*tSE)/(2501+1.86*tSE); if(wSE<0){wSE=0;tSE=hI/1.006;}
        var xSE = xC(tSE), ySE = yC(wSE);
        enthLineNW.setAttribute('x1',sxI);enthLineNW.setAttribute('y1',syI);enthLineNW.setAttribute('x2',xNW);enthLineNW.setAttribute('y2',yNW);
        enthLineSE.setAttribute('x1',sxI);enthLineSE.setAttribute('y1',syI);enthLineSE.setAttribute('x2',xSE);enthLineSE.setAttribute('y2',ySE);

        // Latent: up to saturation curve, bends right along it + line down
        var latPts = [sxI+','+syI, sxI+','+ySat];
        var tBendEnd = Math.min(T_MAX, SA.t + 4);
        for (var lt = SA.t + 0.1; lt <= tBendEnd; lt += 0.1) { latPts.push(xC(lt)+','+yC(getWLocal(lt,100))); }
        latentUpPath.setAttribute('d', 'M ' + latPts.join(' L '));
        latentDownLine.setAttribute('x1',sxI);latentDownLine.setAttribute('y1',syI);latentDownLine.setAttribute('x2',sxI);latentDownLine.setAttribute('y2',yAxis);
        // Saturation Point pointer label
        var satPtrD = 'M '+(sxI-75)+','+(ySat-25)+' L '+(sxI-15)+','+(ySat-25)+' L '+sxI+','+ySat;
        satPointerPath.setAttribute('d', satPtrD);
        satLabel.setAttribute('x', sxI-80); satLabel.setAttribute('y', ySat-25);
        satLabel.setAttribute('text-anchor', 'end');

        // Sensible: left to dew point, bends along saturation + line right
        var sensPts = [sxI+','+syI, xDp+','+syI];
        if (dpT >= T_MIN) {
            for (var st = dpT - 0.1; st >= Math.max(T_MIN, dpT - 5); st -= 0.1) {
                sensPts.push(xC(st)+','+yC(getWLocal(st,100)));
            }
        }
        sensLeftPath.setAttribute('d', 'M ' + sensPts.join(' L '));
        var sensRightT = Math.min(SA.t + 10, T_MAX);
        sensRightLine.setAttribute('x1',sxI);sensRightLine.setAttribute('y1',syI);sensRightLine.setAttribute('x2',xC(sensRightT));sensRightLine.setAttribute('y2',syI);
        // Dew Point pointer label
        var dpPtrD = 'M '+(xDp-75)+','+(syI-25)+' L '+(xDp-15)+','+(syI-25)+' L '+xDp+','+syI;
        dpPointerPath.setAttribute('d', dpPtrD);
        dpLabel.textContent = 'Dew Point (' + dpT.toFixed(1) + '\u00B0)';
        dpLabel.setAttribute('x', xDp-80); dpLabel.setAttribute('y', syI-25);
        dpLabel.setAttribute('text-anchor', 'end');

        // Diagnostic: from SA along enthalpy-slope direction in both directions
        var dx = xSE - sxI;
        var diagSlope = (Math.abs(dx) < 0.5) ? 0 : (ySE - syI) / dx * -1.5;
        var tNE = Math.min(SA.t + PROC_DLEN, T_MAX), xNE = xC(tNE), yNE = syI + diagSlope * (xNE - sxI);
        var tSW = Math.max(SA.t - PROC_DLEN, T_MIN), xSW = xC(tSW), ySW = syI + diagSlope * (xSW - sxI);
        if (ySW > yAxis) { ySW = yAxis; if (diagSlope !== 0) xSW = sxI + (yAxis - syI) / diagSlope; }
        // Saturation clipping — see dashboard.html for rationale. The diagnostic
        // line is a straight line in (t,w) space whose slope can be gentler than
        // dw_sat/dt at low temps, so without clipping the SW path crosses the
        // saturation curve (a physical impossibility).
        var invYscreen = function(yScreen) { return (pad.top + gridH - yScreen) * (W_MAX / 1000) / gridH; };
        var clipDiagToSat = function(t0, w0, t1, w1) {
            if (!Number.isFinite(t0) || !Number.isFinite(w0) || !Number.isFinite(t1) || !Number.isFinite(w1)) return [t1, w1];
            if (w0 >= getWLocal(t0, 100)) return [t0, w0];
            var pT = t0, pW = w0;
            for (var i = 1; i <= 80; i++) {
                var f = i / 80;
                var t = t0 + f * (t1 - t0);
                var w = w0 + f * (w1 - w0);
                if (w >= getWLocal(t, 100)) {
                    var lo = 0, hi = 1;
                    for (var k = 0; k < 24; k++) {
                        var m = (lo + hi) / 2;
                        var tm = pT + m * (t - pT);
                        var wm = pW + m * (w - pW);
                        if (wm >= getWLocal(tm, 100)) hi = m; else lo = m;
                    }
                    var f2 = (lo + hi) / 2;
                    return [pT + f2 * (t - pT), pW + f2 * (w - pW)];
                }
                pT = t; pW = w;
            }
            return [t1, w1];
        };
        var neClip = clipDiagToSat(SA.t, SA.w, tNE, invYscreen(yNE));
        var xNEc = xC(neClip[0]), yNEc = yC(neClip[1]);
        var swClip = clipDiagToSat(SA.t, SA.w, tSW, invYscreen(ySW));
        var xSWc = xC(swClip[0]), ySWc = yC(swClip[1]);
        diagLine1.setAttribute('x1',sxI);diagLine1.setAttribute('y1',syI);diagLine1.setAttribute('x2',xNEc);diagLine1.setAttribute('y2',yNEc);
        diagLine2.setAttribute('x1',sxI);diagLine2.setAttribute('y1',syI);diagLine2.setAttribute('x2',xSWc);diagLine2.setAttribute('y2',ySWc);

        connOASA.setAttribute('x1',xC(OA.t));connOASA.setAttribute('y1',yC(OA.w));connOASA.setAttribute('x2',xC(SA.t));connOASA.setAttribute('y2',yC(SA.w));
        VAVs.forEach(function(v,i){connSAV[i].setAttribute('x1',xC(SA.t));connSAV[i].setAttribute('y1',yC(SA.w));connSAV[i].setAttribute('x2',xC(v.t));connSAV[i].setAttribute('y2',yC(v.w));vavTrailP[i].setAttribute('d',trailD(v.trail));});
        saTrailP.setAttribute('d',trailD(saTrail));
        var ox=xC(OA.t),oy=yC(OA.w);oaGlow.setAttribute('cx',ox);oaGlow.setAttribute('cy',oy);oaCirc.setAttribute('cx',ox);oaCirc.setAttribute('cy',oy);oaLbl.setAttribute('x',ox+12);oaLbl.setAttribute('y',oy+4);
        var sx=xC(SA.t),sy=yC(SA.w);saGlow.setAttribute('cx',sx);saGlow.setAttribute('cy',sy);saGlow.setAttribute('r',16+pulse);saCirc.setAttribute('cx',sx);saCirc.setAttribute('cy',sy);saCirc.setAttribute('r',7+pulse*0.5);saLbl.setAttribute('x',sx+12);saLbl.setAttribute('y',sy+4);
        VAVs.forEach(function(v,i){var vx=xC(v.t),vy=yC(v.w);vavCircles[i].setAttribute('cx',vx);vavCircles[i].setAttribute('cy',vy);if(i===0){vavLbl.setAttribute('x',vx+10);vavLbl.setAttribute('y',vy+4);}});

        // === Occupant load annotation (SA → VAV centroid) ===
        var vavCentT = VAVs.reduce(function(s,v){return s+v.t;},0)/VAVs.length;
        var vavCentW = VAVs.reduce(function(s,v){return s+v.w;},0)/VAVs.length;
        var deltaT_occ = (vavCentT - SA.t);
        var deltaW_occ = (vavCentW - SA.w) * 1000; // g/kg
        var showOcc = (deltaT_occ > 0.3 || deltaW_occ > 0.2); // only show when visible offset
        var occOp = showOcc ? '0.85' : '0';
        // Arrow from SA to VAV centroid
        occArrow.setAttribute('x1', sx); occArrow.setAttribute('y1', sy);
        occArrow.setAttribute('x2', xC(vavCentT)); occArrow.setAttribute('y2', yC(vavCentW));
        occArrow.setAttribute('opacity', showOcc ? '0.6' : '0');
        // Label positioned at midpoint, offset slightly
        var midX = (sx + xC(vavCentT)) / 2;
        var midY = (sy + yC(vavCentW)) / 2 - 18;
        var lblText = occCount + ' ppl: +' + deltaT_occ.toFixed(1) + '\u00B0C / +' + deltaW_occ.toFixed(1) + ' g/kg';
        occLbl1.textContent = lblText;
        occLbl1.setAttribute('x', midX); occLbl1.setAttribute('y', midY);
        occLbl1.setAttribute('opacity', occOp);
        var vavRH = getRHLocal(vavCentT, vavCentW);
        occLbl2.textContent = 'VAV zone: ' + vavCentT.toFixed(1) + '\u00B0C / ' + vavRH.toFixed(0) + '% RH';
        occLbl2.setAttribute('x', midX); occLbl2.setAttribute('y', midY + 12);
        occLbl2.setAttribute('opacity', occOp);
        // Label background
        var lblW2 = Math.max(lblText.length * 5.5, 180);
        occLblBg.setAttribute('x', midX - lblW2/2 - 4); occLblBg.setAttribute('y', midY - 11);
        occLblBg.setAttribute('width', lblW2 + 8); occLblBg.setAttribute('height', 28);
        occLblBg.setAttribute('opacity', showOcc ? '0.9' : '0');

        // === Delta H bar chart — compute steady-state ΔH for all 4 modes ===
        var hOA = getHLocal(OA.t, OA.w);
        var sa_t_base = clamp(OA.t, 18.5, 23.5);
        // Mode 1: Seasonal — SA follows OA humidity freely
        var h_s = getHLocal(sa_t_base, clamp(OA.w, 0.001, getWLocal(sa_t_base, 98)));
        // Mode 2: T SP — user T target, auto humidity (40-60% RH at T_sp_user)
        var sa_t_tsp = clamp(T_sp_user - 2.5, 18.5, 23.5);
        var w_tsp = clamp(OA.w, getWLocal(T_sp_user, 40), getWLocal(T_sp_user, 60)) - 0.0008;
        w_tsp = Math.max(0.001, Math.min(w_tsp, getWLocal(sa_t_tsp, 98)));
        var h_t = getHLocal(sa_t_tsp, w_tsp);
        // Mode 3: W SP — SA delivers W_sp to zones
        var saw2 = Math.max(0.001, Math.min(W_sp - 0.0008, getWLocal(sa_t_base, 98)));
        var h_w = getHLocal(sa_t_base, saw2);
        // Mode 4: RH SP — SA delivers RH_sp to zones
        var zoneT_sp = clamp(OA.t, 21, 26);
        var zoneW_rh = getWLocal(zoneT_sp, RH_sp);
        var saw3 = Math.max(0.001, Math.min(zoneW_rh - 0.0008, getWLocal(sa_t_base, 98)));
        var h_r = getHLocal(sa_t_base, saw3);
        var dhs = [Math.abs(h_s - hOA), Math.abs(h_t - hOA), Math.abs(h_w - hOA), Math.abs(h_r - hOA)];
        var dhMax = 60; // Fixed 60 kJ/kg scale
        yScaleLbl.textContent = dhMax.toFixed(0);
        var activeIdx = animMode === 'seasonal' ? 0 : animMode === 't_setpoint' ? 1 : animMode === 'w_setpoint' ? 2 : 3;
        for (var bi = 0; bi < 4; bi++) {
            var barH = (dhs[bi] / dhMax) * (chH - 4);
            var bx = chX + 12 + bi * (barW + barGap);
            dhBars[bi].setAttribute('y', chY + chH - barH);
            dhBars[bi].setAttribute('height', Math.max(barH, 2));
            dhBars[bi].setAttribute('opacity', bi === activeIdx ? '1' : '0.4');
            dhVals[bi].setAttribute('x', bx + barW / 2);
            dhVals[bi].setAttribute('y', chY + chH - barH - 4);
            dhVals[bi].textContent = dhs[bi].toFixed(1);
            dhXLabels[bi].setAttribute('font-weight', bi === activeIdx ? '900' : '400');
        }
        // Arrow under active bar
        var ax = chX + 12 + activeIdx * (barW + barGap) + barW / 2;
        var ay = chY + chH + 16;
        dhArrow.setAttribute('points', (ax - 4) + ',' + (ay + 6) + ' ' + ax + ',' + ay + ' ' + (ax + 4) + ',' + (ay + 6));
    }

    function frame(ts) {
        if (!running) return;
        if (lastT === 0) lastT = ts;
        var rawDt = Math.min((ts - lastT) / 1000, 0.1);
        lastT = ts;
        var dt = paused ? 0 : rawDt * speedMult;
        if (!paused) update(dt);
        animateArt(dt);
        render();
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    return function() { running = false; container.innerHTML = ''; };
}
