/* ------------------------------------------------------------------
 * heat-auto.js — ELC heatmap Auto for AHU/AHUX floor windows.
 * Glass takes part unless heat_auto is explicitly false: open until the
 * room reaches the floor of its comfort band, trim when it goes over the
 * ceiling, close at night. Same bands / dwell / slew rules as ELC.
 * ------------------------------------------------------------------ */
(function (root) {
  'use strict';

  var HEAT_MAX_STEP_PCT = 12;
  var HEAT_DEADBAND_PCT = 5;
  var HEAT_DAY_MIN = 8;
  var HEAT_WANT = 1.12;  /* too dark  → open until ~12% above the floor */
  var HEAT_TRIM = 0.92;  /* too bright→ trim until ~8% below the ceiling */
  var HEAT_PERIOD_MS = 8000;
  var HEAT_DWELL_MS = 40000;
  var HEAT_OPEN_DWELL_MS = 4000;
  var HEAT_HOLD_MS = 60000;
  var HEAT_REVERSE_MS = 120000;
  var HEAT_REF_DEPTH = 4;
  /* Room-type comfort bands, mirroring red5-elc's tables. A room sits in
     its band or Auto moves it back; the old single "min lux, ceiling at
     2x min" rule gave every room a 300/600 band because the mapper never
     saved a room type. */
  var ROOM_MIN_LUX = {
    office: 500, corridor: 100, meeting: 300,
    warehouse: 200, kitchen: 300, bathroom: 200,
    storage: 100, workspace: 300, other: 200,
    screen_work: 300, reception: 200, cad: 750, filing: 200
  };
  var ROOM_MAX_LUX = {
    office: 750, corridor: 200, meeting: 500,
    warehouse: 400, kitchen: 500, bathroom: 300,
    storage: 200, workspace: 500, other: 500,
    screen_work: 500, reception: 300, cad: 1000, filing: 300
  };
  var ROOM_BAND_MIN_RATIO = 1.5;

  var ctx = {
    getFloors: function () { return []; },
    getSunState: function () { return null; },
    getLatLon: function () { return null; },
    getNorthOffset: function () { return 0; },
    patch: function () {}
  };
  var timer = 0;
  var busy = false;
  var nightLatch = false;
  var winMem = new Map();
  var roomMem = new Map();

  function floorKey(f) {
    return (f && (f.id || f.name)) || 'floor';
  }

  function winMemOf(w) {
    var k = (w && w.id != null && String(w.id) !== '')
      ? String(w.id)
      : ('xy:' + (Number(w && w.x) || 0).toFixed(2) + ',' + (Number(w && w.y) || 0).toFixed(2));
    var s = winMem.get(k);
    if (!s) { s = {}; winMem.set(k, s); }
    return s;
  }

  function roomMemOf(room) {
    var v = (room && room.vertices && room.vertices[0]) || [0, 0];
    var k = String((room && (room.name || room.type || room.id)) || '') + '|'
      + Number(v[0]).toFixed(2) + '|' + Number(v[1]).toFixed(2) + '|'
      + ((room && room.vertices) || []).length;
    var s = roomMem.get(k);
    if (!s) { s = {}; roomMem.set(k, s); }
    return s;
  }

  /* Comfort band in lux. The category default is authoritative; a stored
     min_lux/max_lux only wins when lux_override says an operator pinned
     it by hand. */
  function roomLuxBand(room) {
    var t = String((room && room.type) || 'other').toLowerCase();
    var min = ROOM_MIN_LUX[t] || 300;
    var max = ROOM_MAX_LUX[t] || Math.round(min * ROOM_BAND_MIN_RATIO);
    if (room && room.lux_override) {
      var mn = Number(room.min_lux);
      var mx = Number(room.max_lux);
      if (Number.isFinite(mn) && mn > 0) min = mn;
      if (Number.isFinite(mx) && mx > 0) max = mx;
    }
    /* Auto needs somewhere to settle; a zero-width band would hunt. */
    if (max <= min) max = Math.round(min * ROOM_BAND_MIN_RATIO);
    return { min: min, max: max };
  }

  function roomMinLux(room) { return roomLuxBand(room).min; }
  function roomMaxLux(room) { return roomLuxBand(room).max; }

  function polyArea(verts) {
    if (root.red5PolygonArea) return root.red5PolygonArea(verts);
    if (!verts || verts.length < 3) return 0;
    var a = 0, i, j;
    for (i = 0, j = verts.length - 1; i < verts.length; j = i++) {
      a += (Number(verts[j][0]) || 0) * (Number(verts[i][1]) || 0);
      a -= (Number(verts[i][0]) || 0) * (Number(verts[j][1]) || 0);
    }
    return Math.abs(a) * 0.5;
  }

  function winCentroid(w) {
    if (w && Array.isArray(w.vertices) && w.vertices.length >= 3) {
      var cx = 0, cy = 0, i;
      for (i = 0; i < w.vertices.length; i++) {
        cx += Number(w.vertices[i][0]) || 0;
        cy += Number(w.vertices[i][1]) || 0;
      }
      return { x: cx / w.vertices.length, y: cy / w.vertices.length };
    }
    return { x: Number(w && w.x) || 0, y: Number(w && w.y) || 0 };
  }

  function winLength(w) {
    if (w && Array.isArray(w.vertices) && w.vertices.length >= 3) {
      var best = 0, k;
      for (k = 0; k < w.vertices.length; k++) {
        var a = w.vertices[k], b = w.vertices[(k + 1) % w.vertices.length];
        var elen = Math.hypot(
          (Number(b[0]) || 0) - (Number(a[0]) || 0),
          (Number(b[1]) || 0) - (Number(a[1]) || 0)
        );
        if (elen > best) best = elen;
      }
      return Math.max(0.2, best);
    }
    return Math.max(0.2, Number(w && w.length) || 8);
  }

  function winAperture(w) {
    if (w && Array.isArray(w.vertices) && w.vertices.length >= 3) {
      return Math.max(0.05, polyArea(w.vertices));
    }
    var h = Number(w && w.head_height_m) || 2.2;
    var s = Number(w && w.sill_height_m) || 1.0;
    var gh = Math.max(0.3, h - s);
    /* Plan-% bars: treat glass height as ~1.2 % of the plate, like ELC 1.2 m. */
    if (!(gh > 0.3 && gh < 8)) gh = 1.2;
    return Math.max(0.05, winLength(w) * gh);
  }

  /* Which room this glass lights. Ownership decides whether Auto can act
     on a window at all, so it lives in one place (sun-path.js) and both
     the lux attribution and the control loop ask the same question. */
  function ownerRoom(w, rooms) {
    if (!w || !rooms || !rooms.length) return null;
    return root.red5RoomForWindow ? root.red5RoomForWindow(w, rooms) : null;
  }

  function winInwardNormal(w, rooms) {
    var g = winCentroid(w);
    var len = winLength(w);
    var tx, ty;
    if (w && Array.isArray(w.vertices) && w.vertices.length >= 3) {
      var best = 0, x1 = g.x, y1 = g.y, x2 = g.x + 1, y2 = g.y, k;
      for (k = 0; k < w.vertices.length; k++) {
        var a = w.vertices[k], b = w.vertices[(k + 1) % w.vertices.length];
        var ax = Number(a[0]), ay = Number(a[1]), bx = Number(b[0]), by = Number(b[1]);
        var elen = Math.hypot(bx - ax, by - ay);
        if (elen > best) { best = elen; x1 = ax; y1 = ay; x2 = bx; y2 = by; }
      }
      var hl = Math.hypot(x2 - x1, y2 - y1) || 1;
      tx = (x2 - x1) / hl; ty = (y2 - y1) / hl;
    } else {
      var ang = (Number(w && w.angle_deg) || 0) * Math.PI / 180;
      tx = Math.cos(ang); ty = Math.sin(ang);
    }
    var nx = -ty, ny = tx;
    var ix = 50 - g.x, iy = 50 - g.y;
    if (ix * ix + iy * iy < 1e-6) { ix = 0; iy = 1; }
    if (nx * ix + ny * iy < 0) { nx = -nx; ny = -ny; }
    return { nx: nx, ny: ny, cx: g.x, cy: g.y, length: len, room: ownerRoom(w, rooms) };
  }

  function sameRoom(a, b) {
    if (!a || !b) return false;
    if (a === b) return true;
    if (a.id != null && b.id != null && String(a.id) !== '' && String(a.id) === String(b.id)) return true;
    if (a.name && b.name && a.name === b.name) return true;
    return false;
  }

  function clearSkyBright(altDeg) {
    if (!(altDeg > 0)) return 0;
    return Math.pow(Math.sin(Math.min(90, altDeg) * Math.PI / 180), 1.15);
  }

  function sunAlt(sunState) {
    var alt = NaN;
    if (sunState && sunState.sun) {
      alt = Number(sunState.sun.elevation);
      if (!Number.isFinite(alt)) alt = Number(sunState.sun.altitude_deg);
    }
    if (!Number.isFinite(alt) && root.red5SolarPosition) {
      var ll = ctx.getLatLon && ctx.getLatLon();
      if (ll && Number.isFinite(Number(ll.lat))) {
        var pos = root.red5SolarPosition(Number(ll.lat), Number(ll.lon) || 0, new Date());
        if (pos && Number.isFinite(Number(pos.elevation))) alt = Number(pos.elevation);
      }
    }
    return alt;
  }

  var eventSun = null;
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('r5-sun-state', function (e) {
      if (e && e.detail) eventSun = e.detail;
    });
  }
  function currentSun() {
    var s = ctx.getSunState && ctx.getSunState();
    return s || eventSun;
  }

  function outdoorLux(sunState) {
    var alt = sunAlt(sunState);
    var cc = 0;
    var precip = 0;
    if (!Number.isFinite(alt)) return 0;
    if (sunState) {
      if (typeof sunState.cloudCover === 'number') cc = sunState.cloudCover / 100;
      var wx = sunState.weatherNow || {};
      if (!(cc > 0) && typeof wx.cloud_cover === 'number') cc = wx.cloud_cover > 1 ? wx.cloud_cover / 100 : wx.cloud_cover;
      precip = Number(wx.precipitation_mm) || Number(wx.precip_mm_h) || 0;
    }
    if (alt < -12) return 0.05;
    if (alt < 0) return Math.min(600, Math.max(0.05, Math.pow(10, (alt + 12) / 3)));
    var clear = 128000 * clearSkyBright(alt);
    var rain = Math.min(1, Math.max(0.7, 1 - 0.03 * precip));
    return Math.max(clear * (1 - 0.85 * Math.min(1, Math.max(0, cc))) * rain, 0.5);
  }

  function sunFrame(sunState, floor) {
    var sun = (sunState && sunState.sun) || null;
    var alt = sunAlt(sunState);
    var az = sun ? Number(sun.azimuth) : NaN;
    if (!Number.isFinite(az) && root.red5SolarPosition) {
      var ll = ctx.getLatLon && ctx.getLatLon();
      if (ll && Number.isFinite(Number(ll.lat))) {
        var pos = root.red5SolarPosition(Number(ll.lat), Number(ll.lon) || 0, new Date());
        if (pos && Number.isFinite(Number(pos.azimuth))) az = Number(pos.azimuth);
      }
    }
    var travel = (root.red5PlanSunVectors && Number.isFinite(az))
      ? root.red5PlanSunVectors(az, floor && floor.orientation, ctx.getNorthOffset())
      : null;
    var altRad = Math.max(0, Number.isFinite(alt) ? alt : 0) * Math.PI / 180;
    return {
      alt: Number.isFinite(alt) ? alt : -90,
      sx: travel ? travel.sx : 0,
      sy: travel ? travel.sy : -1,
      altFactor: Math.sin(altRad),
      twilightBoost: (Number.isFinite(alt) && alt >= 0) ? 1 : Math.max(0, ((alt || -90) + 6) / 6),
      isLit: Number.isFinite(alt) && alt > -6
    };
  }

  function isNight(sunState) {
    var alt = sunAlt(sunState);
    if (Number.isFinite(alt)) {
      if (alt <= -8) nightLatch = true;
      else if (alt >= -4) nightLatch = false;
      return nightLatch;
    }
    if (sunState && sunState.sun && sunState.sun.is_day === false) {
      nightLatch = true;
      return true;
    }
    return nightLatch;
  }

  function openPct(w) {
    return Math.round((1 - Math.min(1, Math.max(0, Number(w && w.blind_level) || 0))) * 100);
  }

  function windowDaylightLux(w, room, floor, rooms, eOut, sun) {
    if (!(eOut > 1) || !w || !room) return 0;
    var geomN = winInwardNormal(w, rooms);
    if (rooms && rooms.length && !sameRoom(geomN.room, room)) return 0;
    var cover = Math.min(1, Math.max(0, Number(w.blind_level) || 0));
    var open = 1 - cover;
    if (open < 0.01) return 0;
    var spec = root.red5BlindSpec ? root.red5BlindSpec(w.blind_type) : { motion: 'drop' };
    var tau = open * 0.75;
    if (spec.motion === 'tilt') tau *= 0.88;
    var into = 0;
    if (sun && sun.isLit) {
      into = (-(sun.sx || 0)) * geomN.nx + (-(sun.sy || 0)) * geomN.ny;
    }
    /* Shade-side glass keeps a small sky residual. Do not let noon
       outdoor lux paint sun-glow into rooms whose windows do not face the sun. */
    var geom = 0.04;
    if (sun && sun.isLit && into > 0.05) {
      geom += 0.88 * into * Math.max(0.15, sun.altFactor || 0) * (sun.twilightBoost == null ? 1 : sun.twilightBoost);
    }
    geom = Math.min(1.15, geom);
    var aWin = winAperture(w);
    var aRef = Math.max(0.5, winLength(w) * HEAT_REF_DEPTH);
    var aperture = Math.min(0.40, 0.55 * (aWin / aRef));
    return Math.min(eOut * 0.45, Math.max(0, eOut * tau * geom * aperture));
  }

  function roomDaylightLux(room, floor, rooms) {
    var verts = room && (room.vertices || room.points);
    if (!verts || verts.length < 3) return 0;
    var eOut = outdoorLux(currentSun());
    if (!(eOut > 1) || !floor || !Array.isArray(floor.windows) || !floor.windows.length) return 0;
    var sun = sunFrame(currentSun(), floor);
    var day = 0, i;
    for (i = 0; i < floor.windows.length; i++) {
      day += windowDaylightLux(floor.windows[i], room, floor, rooms, eOut, sun);
    }
    return Math.min(eOut * 0.55, day);
  }

  /* Daylight a room receives through glass Auto has no authority over. */
  function manualGlassLux(room, floor, rooms) {
    var eOut = outdoorLux(currentSun());
    if (!(eOut > 1) || !floor || !Array.isArray(floor.windows)) return 0;
    var sun = sunFrame(currentSun(), floor);
    var lux = 0, i;
    for (i = 0; i < floor.windows.length; i++) {
      var w = floor.windows[i];
      if (inAuto(w)) continue;
      lux += windowDaylightLux(w, room, floor, rooms, eOut, sun);
    }
    return lux;
  }

  function daylightAtOpen(room, floor, rooms, autoWins, pct) {
    var saved = autoWins.map(function (w) { return w.blind_level; });
    var closed = (100 - Math.min(100, Math.max(0, pct))) / 100;
    autoWins.forEach(function (w) { w.blind_level = closed; });
    var next = roomDaylightLux(room, floor, rooms);
    autoWins.forEach(function (w, i) { w.blind_level = saved[i]; });
    return next;
  }

  function sunWins(room, floor, rooms, wins) {
    var eOut = outdoorLux(currentSun());
    if (!(eOut > 1)) return [];
    var sun = sunFrame(currentSun(), floor);
    return (wins || []).filter(function (w) {
      var saved = w.blind_level;
      w.blind_level = 0;
      var e = windowDaylightLux(w, room, floor, rooms, eOut, sun);
      w.blind_level = saved;
      return e > 1;
    });
  }

  /* Least-open blind position that still reaches wantLux. Callers pass the
     aim point for the edge they crossed — the bottom of the band when the
     room is dark, the top when it is bright — so a bright room trims to
     its ceiling instead of collapsing to the floor of the band. */
  function targetOpen(room, floor, rooms, autoWins, wantLux, dir) {
    var band = roomLuxBand(room);
    var asked = Number(wantLux);
    var want = Number.isFinite(asked) ? asked : band.min * HEAT_WANT;
    var luxShut = daylightAtOpen(room, floor, rooms, autoWins, 0);
    var luxFull = daylightAtOpen(room, floor, rooms, autoWins, 100);
    /* Opening this glass cannot admit more daylight (interior, or none of
       it reaches the room) — leave it rather than hunting 0 to 100. */
    if (luxFull <= luxShut + 4) return null;
    var lo = 0, hi = 100, best = 100, i;
    for (i = 0; i < 14; i++) {
      var mid = (lo + hi) / 2;
      var lux = daylightAtOpen(room, floor, rooms, autoWins, mid);
      if (lux < want) lo = mid;
      else { best = mid; hi = mid; }
    }
    best = Math.min(100, Math.max(0, best));
    /* Round onto the safe side of the band: a percent too far open when
       trimming leaves the room over its ceiling, a percent short when
       opening leaves it under its floor. */
    return dir < 0 ? Math.floor(best) : Math.ceil(best);
  }

  function applyLevel(floor, w, closed) {
    var wins = floor.windows || [];
    var wi = wins.indexOf(w);
    var patchOne = function (wid, fields) {
      ctx.patch(floorKey(floor), wid != null ? wid : w.id, fields, wi);
    };
    patchOne(w.id, { blind_level: closed });
    if (typeof root._smiGotoClosed === 'function') {
      root._smiGotoClosed([w], closed, patchOne);
    }
  }

  function slew(floor, wins, targetOpenPct, opts) {
    if (!wins || !wins.length) return false;
    var night = !!(opts && opts.night);
    var tgt = Math.min(100, Math.max(0, Number(targetOpenPct)));
    var now = Date.now();
    var moved = [];
    wins.forEach(function (w) {
      var cur = openPct(w);
      var delta = tgt - cur;
      var dir = delta > 0 ? 1 : (delta < 0 ? -1 : 0);
      if (!dir) return;
      /* Opening toward green: 1% band so we actually reach fully open.
         Closing: 5% mid-travel so we do not hunt, but the band has to
         shrink near the shut end. Glass 5% open can hold a room at 1300 lx
         under a 500 lx ceiling, and every correction left is a 1-4% move —
         a flat 5% band rejects all of them and Auto stalls for good. */
      var closeBand = Math.max(1, Math.min(HEAT_DEADBAND_PCT, Math.round(cur / 2)));
      var band = (dir > 0 && !night) ? 1 : closeBand;
      if (Math.abs(delta) < band) return;
      var mem = winMemOf(w);
      if (dir < 0 && mem.dir === 1 && (now - (mem.dirAt || 0)) < HEAT_REVERSE_MS) return;
      var step = Math.max(-HEAT_MAX_STEP_PCT, Math.min(HEAT_MAX_STEP_PCT, delta));
      /* HEAT_DAY_MIN stops daytime trims slamming shut for no reason, but
         it must not cap a close the room's ceiling genuinely demands. */
      var floorPct = night ? 0 : (dir > 0 ? 0 : Math.min(HEAT_DAY_MIN, tgt));
      var next = Math.min(100, Math.max(floorPct, cur + step));
      if (next === cur) return;
      mem.dir = dir;
      mem.dirAt = now;
      moved.push(w);
      applyLevel(floor, w, (100 - next) / 100);
    });
    return moved.length > 0;
  }

  /* Auto is opt-out: only an explicit false keeps glass out of the loop.
     Reading an absent flag as "excluded" left every window a mapper trace
     or import created outside daylight control, with nothing on screen to
     say so. */
  function inAuto(w) { return !!w && w.heat_auto !== false; }

  function autoWins(wins) {
    var now = Date.now();
    return (wins || []).filter(function (w) {
      return inAuto(w) && !(winMemOf(w).holdUntil > now);
    });
  }

  function tickFloor(floor) {
    var rooms = Array.isArray(floor.rooms) ? floor.rooms : [];
    var auto = autoWins(floor.windows || []);
    if (!auto.length) return;
    var now = Date.now();
    var sunState = currentSun();
    if (isNight(sunState)) {
      var need = auto.filter(function (w) { return openPct(w) > HEAT_DEADBAND_PCT; });
      if (need.length) slew(floor, need, 0, { night: true });
      return;
    }
    if (!rooms.length) {
      var dayOpen = auto.filter(function (w) { return openPct(w) < 100; });
      if (dayOpen.length) slew(floor, dayOpen, 100);
      return;
    }
    var byRoom = new Map();
    var orphans = [];
    auto.forEach(function (w) {
      var room = ownerRoom(w, rooms);
      if (!room) { orphans.push(w); return; }
      if (!byRoom.has(room)) byRoom.set(room, []);
      byRoom.get(room).push(w);
    });
    var floorNeedsLight = false;
    var floorNeedsShade = false;
    byRoom.forEach(function (wins, room) {
      var rm = roomMemOf(room);
      if (rm.quietUntil > now) return;
      var band = roomLuxBand(room);
      var lux = roomDaylightLux(room, floor, rooms);
      /* Inside the band: hold. The gap is the hysteresis — a room has to
         leave it entirely before Auto touches the blinds again. */
      if (lux >= band.min && lux <= band.max) return;
      /* Aim points sit inside the band so a corrected room does not land
         back on the threshold it just crossed. */
      var aimOpen = Math.min(band.min * HEAT_WANT, band.max * HEAT_TRIM);
      var aimTrim = Math.max(band.max * HEAT_TRIM, band.min * HEAT_WANT);
      if (lux < band.min) {
        floorNeedsLight = true;
        var movers = wins.filter(function (w) { return openPct(w) < 100; });
        if (!movers.length) return;
        var tgt = targetOpen(room, floor, rooms, movers, aimOpen, 1);
        var did = slew(floor, movers, tgt == null ? 100 : tgt);
        if (did) rm.quietUntil = Date.now() + HEAT_OPEN_DWELL_MS;
        return;
      }
      floorNeedsShade = true;
      var lit = sunWins(room, floor, rooms, wins);
      var closeMovers = lit.length ? lit : wins;
      var closeTgt = targetOpen(room, floor, rooms, closeMovers, aimTrim, -1);
      if (closeTgt == null) return;
      var didClose = slew(floor, closeMovers, closeTgt);
      if (didClose) rm.quietUntil = Date.now() + HEAT_DWELL_MS;
    });
    /* Glass too far from any outline to own follows the floor. It used to
       be openable but never closeable, so an unowned window could be
       driven wide open by one dark room and sit there through the
       brightest part of the day. When the floor wants both, leave it. */
    if (orphans.length && (!byRoom.size || floorNeedsLight !== floorNeedsShade)) {
      var want = (byRoom.size && floorNeedsShade) ? HEAT_DAY_MIN : 100;
      var need = orphans.filter(function (w) { return openPct(w) !== want; });
      if (need.length) slew(floor, need, want);
    }
  }

  function tick() {
    if (busy) return;
    var floors = ctx.getFloors() || [];
    var any = floors.some(function (f) {
      return (f.windows || []).some(inAuto);
    });
    if (!any) return;
    busy = true;
    try {
      floors.forEach(tickFloor);
    } finally {
      busy = false;
    }
  }

  function kick() {
    if (kick._t) clearTimeout(kick._t);
    kick._t = setTimeout(function () { try { tick(); } catch (e) {} }, 80);
  }

  function start() {
    if (timer) return;
    timer = setInterval(function () { try { tick(); } catch (e) {} }, HEAT_PERIOD_MS);
    kick();
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = 0; }
    if (kick._t) { clearTimeout(kick._t); kick._t = 0; }
  }

  function hold(wins, ms) {
    var until = Date.now() + (ms || HEAT_HOLD_MS);
    (wins || []).forEach(function (w) { winMemOf(w).holdUntil = until; });
  }

  function clearHold(wins) {
    (wins || []).forEach(function (w) { winMemOf(w).holdUntil = 0; });
  }

  function floorHasRooms(key) {
    var floors = ctx.getFloors() || [];
    var f = floors.find(function (x) {
      return floorKey(x) === key || x.id === key || x.name === key;
    });
    if (f && Array.isArray(f.rooms) && f.rooms.length) return true;
    return floors.some(function (x) { return Array.isArray(x.rooms) && x.rooms.length; });
  }

  root.red5HeatAuto = {
    bind: function (next) {
      if (!next) return;
      if (next.getFloors) ctx.getFloors = next.getFloors;
      if (next.getSunState) ctx.getSunState = next.getSunState;
      if (next.getLatLon) ctx.getLatLon = next.getLatLon;
      if (next.getNorthOffset) ctx.getNorthOffset = next.getNorthOffset;
      if (next.patch) ctx.patch = next.patch;
    },
    start: start,
    stop: stop,
    kick: kick,
    hold: hold,
    clearHold: clearHold,
    tick: tick,
    floorHasRooms: floorHasRooms,
    roomMinLux: roomMinLux,
    roomMaxLux: roomMaxLux,
    roomLuxBand: roomLuxBand,
    roomForWindow: ownerRoom,
    inAuto: inAuto,
    roomDaylightLux: roomDaylightLux,
    scoreRooms: function (floor) {
      var rooms = (floor && floor.rooms) || [];
      var wins = (floor && floor.windows) || [];
      var out = [];
      rooms.forEach(function (room) {
        var verts = room && (room.vertices || room.points);
        if (!verts || verts.length < 3) return;
        var avgLux = roomDaylightLux(room, floor, rooms);
        var band = roomLuxBand(room);
        var minLx = band.min;
        var roomWins = wins.filter(function (w) {
          return sameRoom(ownerRoom(w, rooms), room);
        });
        var hasGlass = roomWins.length > 0;
        var fill;
        /* Over the ceiling is blue, not red: on this overlay red already
           reads as "far too dark". */
        if (!hasGlass) fill = 'rgba(148,156,168,0.16)';
        else if (avgLux > band.max) fill = 'rgba(122,150,255,0.34)';
        else if (avgLux >= band.min) fill = 'rgba(78,203,113,0.28)';
        else if (avgLux >= band.min * 0.9) fill = 'rgba(227,179,65,0.32)';
        else fill = 'rgba(236,91,86,0.32)';
        var cx = 0, cy = 0, i;
        for (i = 0; i < verts.length; i++) {
          cx += Number(verts[i][0]) || 0;
          cy += Number(verts[i][1]) || 0;
        }
        cx /= verts.length;
        cy /= verts.length;
        var name = (room && (room.name || room.type)) || 'Room';
        /* A room over its ceiling whose own Auto blinds are already shut
           is usually being flooded through glass Auto may not touch. Name
           that on the label rather than leaving it to be guessed at. */
        var manualLux = 0;
        if (avgLux > band.max) {
          manualLux = manualGlassLux(room, floor, rooms);
        }
        var label = name + ' · ' + Math.round(avgLux) + '/'
          + band.min + '-' + band.max + ' lx';
        if (!hasGlass) label = name + ' · no glass';
        else if (manualLux > (avgLux - band.max) * 0.5 && manualLux >= 1) {
          label += ' · ' + Math.round(manualLux) + ' lx from non-Auto glass';
        }
        out.push({
          id: room && room.id,
          verts: verts,
          fill: fill,
          cx: cx,
          cy: cy,
          avgLux: avgLux,
          minLx: minLx,
          maxLx: band.max,
          hasGlass: hasGlass,
          manualLux: manualLux,
          label: label
        });
      });
      out.sort(function (a, b) { return a.avgLux - b.avgLux; });
      return out;
    }
  };
}(typeof window !== 'undefined' ? window : this));
