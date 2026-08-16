// =====================================================================
// SUN-PATH / SUN-COMPASS MODULE   (Red5 Studio V1.9, 2026-04)
// =====================================================================
// Phase-A implementation of the "3D View" button promise:
//   - Solar position solver (NOAA / Michalsky low-precision algorithm)
//   - SunCompass floating badge with time slider (hour-of-day, day-of-year)
//   - Sun-exposure scoring for AHU/VAV markers based on their bearing
//     from the floor-plan centroid relative to the sun's azimuth
//
// Phase-B (isometric + shadow raycasting) is deferred — needs room-polygon
// vector geometry which we don't have yet (floor plans are raster PNGs).
//
// All functions exposed on window so equipment_mapper.html's main source
// picks them up after Babel compile concatenation.
// =====================================================================

/* ---------- PURE SOLAR MATH ---------------------------------------- */
/* Compute sun azimuth (deg, 0=N, 90=E, 180=S, 270=W) and elevation
   (deg, + above horizon) for a given (lat, lon, date).  Precision ~0.2°
   — plenty for façade-exposure visualization.  Michalsky 1988 / NOAA
   low-precision algorithm.                                            */
window.red5SolarPosition = function(lat, lon, date){
  var rad = Math.PI / 180;
  // Julian day at UT (use UTC timestamp)
  var ms = date.getTime();
  var jd = ms/86400000 + 2440587.5;
  var n  = jd - 2451545.0;                    // days since J2000.0
  var L  = (280.460 + 0.9856474 * n) % 360;   // mean longitude
  var g  = ((357.528 + 0.9856003 * n) % 360) * rad;  // mean anomaly
  // Ecliptic longitude
  var lam = (L + 1.915*Math.sin(g) + 0.020*Math.sin(2*g)) * rad;
  var eps = (23.439 - 0.0000004 * n) * rad;   // obliquity
  // Right ascension + declination
  var alpha = Math.atan2(Math.cos(eps)*Math.sin(lam), Math.cos(lam));
  var delta = Math.asin(Math.sin(eps)*Math.sin(lam));
  // Greenwich Mean Sidereal Time (hours)
  var utc = date.getUTCHours() + date.getUTCMinutes()/60 + date.getUTCSeconds()/3600;
  var gmst = (6.697375 + 0.0657098242*n + utc) % 24;
  if (gmst < 0) gmst += 24;
  // Local sidereal time (deg)
  var lst = (gmst * 15 + lon) % 360;
  if (lst < 0) lst += 360;
  // Hour angle
  var H = (lst - alpha/rad) * rad;
  // Elevation + azimuth
  var latR = lat * rad;
  var sinE = Math.sin(latR)*Math.sin(delta) + Math.cos(latR)*Math.cos(delta)*Math.cos(H);
  var elev = Math.asin(Math.max(-1, Math.min(1, sinE)));
  var cosE = Math.cos(elev);
  var sinA = -Math.cos(delta)*Math.sin(H)/cosE;
  var cosA = (Math.sin(delta) - Math.sin(elev)*Math.sin(latR)) / (cosE*Math.cos(latR));
  var azim = Math.atan2(sinA, cosA) / rad;
  if (azim < 0) azim += 360;
  return {
    azimuth:   azim,                    // 0..360, compass
    elevation: elev / rad,              // -90..+90
    is_day:    elev > 0
  };
};

/* ---------- EXPOSURE SCORING --------------------------------------- */
/* For a marker at fractional position (mx, my) in 0..1 floor-plan space
   and the floor-plan centroid assumed at (0.5, 0.5), compute how
   sun-exposed that marker is on a 0..1 scale.

     1. marker_bearing = compass heading (0=N clockwise) of the vector
        from centroid → marker.  Assumes floor-plan "up" aligns with
        true North (we provide an orientation offset for future use).
     2. angle_diff    = minimum angular distance between the marker
                        bearing and the sun's azimuth (0..180°).
     3. façade_factor = max(0, cos(angle_diff))  (1 when aligned with
                        sun, 0 when perpendicular, clipped on back side)
     4. altitude_factor = sin(elevation)  (1 at zenith, 0 at horizon)
     5. score = façade_factor * altitude_factor   (0 at night)

   Floor-plan orientation can be passed via `northOffsetDeg` — positive
   rotates the plan clockwise (e.g., a plan drawn with East on top needs
   northOffsetDeg = -90).                                               */
window.red5SunExposureScore = function(markerXFrac, markerYFrac, sun, opts){
  opts = opts || {};
  var northOffsetDeg = opts.northOffsetDeg || 0;
  if (!sun || !sun.is_day) return 0;
  // Sun direction in SCREEN space (x right/east, y down).  az 0=N → up
  // (negative y), az 90=E → right.  Marker on that half of the plan
  // relative to the centroid is "sun-facing".
  var az = ((sun.azimuth || 0) + northOffsetDeg) % 360;
  if (az < 0) az += 360;
  var rad = az * Math.PI / 180;
  var sx = Math.sin(rad);
  var sy = -Math.cos(rad);
  var dx = markerXFrac - 0.5;
  var dy = markerYFrac - 0.5;
  var dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 0.02) return 0; // near centroid → ambiguous
  var align = (dx * sx + dy * sy) / dist; // -1..+1
  var facade = Math.max(0, align);
  var elev = (typeof sun.elevation === 'number') ? sun.elevation : 0;
  var alt = Math.sin(Math.max(0, elev) * Math.PI / 180);
  return Math.max(0, facade * Math.max(alt, 0.15)); // keep daytime ring readable near horizon
};

/* ---------- ROOM POLYGONS (plan % coords, ELC-inspired) ------------- */
window.red5PointInPolygon = function(x, y, verts){
  if (!verts || verts.length < 3) return false;
  var inside = false;
  for (var i = 0, j = verts.length - 1; i < verts.length; j = i++) {
    var xi = Number(verts[i][0]), yi = Number(verts[i][1]);
    var xj = Number(verts[j][0]), yj = Number(verts[j][1]);
    var intersect = ((yi > y) !== (yj > y))
      && (x < (xj - xi) * (y - yi) / ((yj - yi) || 1e-12) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

window.red5PolygonArea = function(verts){
  if (!verts || verts.length < 3) return 0;
  var a = 0;
  for (var i = 0, j = verts.length - 1; i < verts.length; j = i++) {
    a += (Number(verts[j][0]) + Number(verts[i][0]))
       * (Number(verts[j][1]) - Number(verts[i][1]));
  }
  return Math.abs(a) / 2;
};

/* Smallest containing room (plan %), or null. */
window.red5FindContainingRoom = function(x, y, rooms){
  if (!rooms || !rooms.length) return null;
  var best = null, bestArea = Infinity;
  for (var i = 0; i < rooms.length; i++) {
    var r = rooms[i];
    var verts = r && (r.vertices || r.points);
    if (!verts || verts.length < 3) continue;
    if (!window.red5PointInPolygon(x, y, verts)) continue;
    var a = window.red5PolygonArea(verts);
    if (a < bestArea) { bestArea = a; best = r; }
  }
  return best;
};

/* Sample a point just inside the window (toward plan center) to own a room. */
window.red5RoomForWindow = function(w, rooms){
  if (!w || !rooms || !rooms.length) return null;
  var cx = Number(w.x), cy = Number(w.y);
  if (Array.isArray(w.vertices) && w.vertices.length >= 3) {
    cx = 0; cy = 0;
    for (var vi = 0; vi < w.vertices.length; vi++) {
      cx += Number(w.vertices[vi][0]); cy += Number(w.vertices[vi][1]);
    }
    cx /= w.vertices.length; cy /= w.vertices.length;
  }
  if (!Number.isFinite(cx) || !Number.isFinite(cy)) return null;
  var hit = window.red5FindContainingRoom(cx, cy, rooms);
  if (hit) return hit;
  var ang = Number(w.angle_deg) || 0;
  var rad = ang * Math.PI / 180;
  var tx = Math.cos(rad), ty = Math.sin(rad);
  var nx = -ty, ny = tx;
  var ix = 50 - cx, iy = 50 - cy;
  if (ix * ix + iy * iy < 1e-6) { ix = 0; iy = 1; }
  if (nx * ix + ny * iy < 0) { nx = -nx; ny = -ny; }
  var depths = [0.8, 1.5, 3.0, 5.0];
  for (var di = 0; di < depths.length; di++) {
    hit = window.red5FindContainingRoom(cx + nx * depths[di], cy + ny * depths[di], rooms);
    if (hit) return hit;
  }
  for (di = 0; di < depths.length; di++) {
    hit = window.red5FindContainingRoom(cx - nx * depths[di], cy - ny * depths[di], rooms);
    if (hit) return hit;
  }
  return null;
};
/* Blend from soft amber → bright amber as the score rises.
   Returns a CSS color string used as a ring/halo around the marker.
   Score < 0.02 returns null (no overlay applied).        */
window.red5ExposureColor = function(score){
  if (!(score > 0.02)) return null;
  var t = Math.min(1, (score - 0.02) / 0.98);
  var r = Math.round(245 + (239 - 245) * t);
  var g = Math.round(158 + ( 68 - 158) * t);
  var b = Math.round( 11 + ( 68 -  11) * t);
  return 'rgba('+r+','+g+','+b+',0.95)';
};

/* Ring style whose bloom intensity tracks score (blind-open × sun). */
window.red5ExposureRingStyle = function(score){
  if (!(score > 0.02)) return null;
  var t = Math.min(1, Math.max(0, score));
  var col = window.red5ExposureColor(t);
  if (!col) return null;
  var aCore = (0.25 + 0.70 * t).toFixed(2);
  var aMid  = (0.30 + 0.55 * t).toFixed(2);
  var aOut  = (0.15 + 0.40 * t).toFixed(2);
  var b1 = (3 + 10 * t).toFixed(1);
  var s1 = (1 + 2.5 * t).toFixed(1);
  var b2 = (8 + 16 * t).toFixed(1);
  var s2 = (2 + 4 * t).toFixed(1);
  return {
    borderColor: col,
    boxShadow: '0 0 0 1px rgba(251,191,36,'+aCore+'), 0 0 '+b1+'px '+s1+'px rgba(251,191,36,'+aMid+'), 0 0 '+b2+'px '+s2+'px rgba(251,146,60,'+aOut+')'
  };
};

/* Blind open / in-shaft factor (0..1) for a marker at plan % coords.
   Matches the painted WindowsSunshaftOverlay volume: same travel vector,
   same throw, same shaft width.  Closed blinds → 0.  Light does not
   cross into a different traced room.  No window on a façade → no glow
   from that side.  Empty window list → 0 (never fake a full-sun ring). */
window.red5WindowBlindFactor = function(mxPct, myPct, windows, sun, opts){
  opts = opts || {};
  if (!windows || !windows.length) return 0;
  if (!sun || !sun.is_day) return 0;
  var rooms = opts.rooms || null;
  var travel = window.red5PlanSunVectors
    ? window.red5PlanSunVectors(sun.azimuth, opts.orientation, opts.northOffsetDeg)
    : null;
  var lx = travel ? travel.lx : (function () {
    var az = ((sun.azimuth || 0) + (opts.northOffsetDeg || 0)) % 360;
    if (az < 0) az += 360;
    var rad = az * Math.PI / 180;
    return -Math.sin(rad);
  })();
  var ly = travel ? travel.ly : (function () {
    var az = ((sun.azimuth || 0) + (opts.northOffsetDeg || 0)) % 360;
    if (az < 0) az += 360;
    var rad = az * Math.PI / 180;
    return Math.cos(rad);
  })();
  var elev = Math.max(0, sun.elevation || 0);
  var elevF = Math.max(0.15, Math.sin(elev * Math.PI / 180));
  var centerX = 50, centerY = 50;
  var vavRoom = (rooms && rooms.length && window.red5FindContainingRoom)
    ? window.red5FindContainingRoom(mxPct, myPct, rooms) : null;
  function sameRoom(a, b) {
    if (!a || !b) return false;
    if (a === b) return true;
    if (a.id != null && b.id != null && String(a.id) !== '' && String(a.id) === String(b.id)) return true;
    if (a.name && b.name && a.name === b.name) return true;
    return false;
  }
  var best = 0;
  for (var i = 0; i < windows.length; i++) {
    var w = windows[i];
    var verts = (Array.isArray(w.vertices) && w.vertices.length >= 3) ? w.vertices : null;
    var cx, cy, tx, ty, half;
    if (verts) {
      var bestLen = 0, x1 = 0, y1 = 0, x2 = 0, y2 = 0, k;
      for (k = 0; k < verts.length; k++) {
        var a = verts[k], b = verts[(k + 1) % verts.length];
        var ax = Number(a[0]), ay = Number(a[1]), bx = Number(b[0]), by = Number(b[1]);
        if (!Number.isFinite(ax) || !Number.isFinite(ay) || !Number.isFinite(bx) || !Number.isFinite(by)) continue;
        var elen = Math.hypot(bx - ax, by - ay);
        if (elen > bestLen) {
          bestLen = elen; x1 = ax; y1 = ay; x2 = bx; y2 = by;
        }
      }
      if (!(bestLen > 0.5)) continue;
      cx = (x1 + x2) / 2; cy = (y1 + y2) / 2;
      tx = (x2 - x1) / bestLen; ty = (y2 - y1) / bestLen;
      half = bestLen / 2;
    } else {
      cx = Number(w.x); cy = Number(w.y);
      var len = Number(w.length);
      var ang = Number(w.angle_deg) || 0;
      if (!Number.isFinite(cx) || !Number.isFinite(cy) || !(len > 0.5)) continue;
      var wrad = ang * Math.PI / 180;
      tx = Math.cos(wrad); ty = Math.sin(wrad);
      half = len / 2;
    }
    var open = 1 - Math.min(1, Math.max(0, Number(w.blind_level) || 0));
    if (open < 0.01) continue;
    var nx = -ty, ny = tx;
    var ix = centerX - cx, iy = centerY - cy;
    if (ix * ix + iy * iy < 1e-6) { ix = 0; iy = 1; }
    if (nx * ix + ny * iy < 0) { nx = -nx; ny = -ny; }
    var enter = nx * lx + ny * ly;
    if (enter < 0.05) continue;
    var winRoom = (rooms && rooms.length && window.red5RoomForWindow)
      ? window.red5RoomForWindow(w, rooms) : null;
    if (vavRoom) {
      if (winRoom) {
        if (!sameRoom(winRoom, vavRoom)) continue;
      } else {
        var sample = window.red5FindContainingRoom(cx + nx * 1.5, cy + ny * 1.5, rooms);
        if (!sameRoom(sample, vavRoom)) continue;
      }
    } else if (winRoom) {
      continue;
    }
    var openEase = Math.pow(open, 0.7);
    var base = enter * elevF;
    var throwLen = (10 + 24 * base) * (1.0 + 1.0 * openEase);
    var visThrow = throwLen * 0.42;
    var dx = mxPct - cx, dy = myPct - cy;
    var alongDist = dx * lx + dy * ly;
    if (alongDist < 0.4 || alongDist > visThrow) continue;
    var spread = half * (0.18 + 0.28 * openEase);
    var tAlong = Math.min(1, alongDist / throwLen);
    var maxLat = half + tAlong * spread;
    var lat = Math.abs(dx * tx + dy * ty);
    if (lat > maxLat) continue;
    var latF = Math.max(0, 1 - lat / (maxLat || 1e-6));
    var depthF = Math.max(0, 1 - alongDist / visThrow);
    var strength = open * (0.45 + 0.55 * enter) * elevF * latF * (0.35 + 0.65 * depthF);
    if (strength > best) best = strength;
  }
  return Math.min(1, best);
};

/* Combined score for a VAV/AHU marker (plan % coords).
   With mapped windows: amber ring = in-sunshaft × blind open (matches painted shafts).
   With no windows: 0 — do not fake a sun-glow highlight on VAVs. */
window.red5SunBlindScore = function(mxPct, myPct, sun, windows, opts){
  opts = opts || {};
  if (!sun || !sun.is_day) return 0;
  if (!windows || !windows.length) return 0;
  return window.red5WindowBlindFactor(mxPct, myPct, windows, sun, opts);
};

/* ---------- B1-B10 BAND × SUN-EXPOSURE TRIM ----------------------- */
/* Shifts an AHU's active B1-B10 SA-temperature setpoint per individual
   VAV based on that VAV's solar-exposure score.  The band itself stays
   the same (climate driven, AHU-wide) — only the local SA target the
   VAV chases is nudged.

   ONLY VAVs with an amber outer ring (in-shaft × open blinds × in-room,
   score > ring threshold) contribute.  Shaded / closed-blind / out-of-
   room VAVs get sun_trim_c = 0 — no bogus “upward” ΔSA from score=0.

   Amber-ring VAVs: solar heat drives upward zone-temp drift, so the
   local SA target is nudged colder (pre-cool) proportional to score:
       delta_c = -maxTrim * score     // 0 at threshold edge → -maxTrim at 1
   Default maxTrim = 1.5 °C.

   Input:  band, sunScore (0..1), opts.maxTrim_c
   Output: band copy + base_sa_t, sun_score, sun_trim_c                 */
window.red5BandSunTrim = function(band, sunScore, opts){
  if (!band) return null;
  opts = opts || {};
  var maxTrim = (typeof opts.maxTrim_c === 'number') ? opts.maxTrim_c : 1.5;
  var ringMin = (typeof opts.ringMin === 'number') ? opts.ringMin : 0.02;
  var out = {};
  for (var kk in band) out[kk] = band[kk];
  out.base_sa_t = ('sa_t_sp' in band) ? band.sa_t_sp : (('sa_t' in band) ? band.sa_t : null);

  /* No amber ring → no sun contribution to temperature drift / SA trim. */
  if (sunScore == null || isNaN(sunScore) || !(sunScore > ringMin)) {
    out.sun_score = 0;
    out.sun_trim_c = 0;
    return out;
  }

  var t = Math.min(1, Math.max(0, sunScore));
  /* Pre-cool for solar heat gain (upward zone-temp drift on amber VAVs). */
  var delta = -maxTrim * t;
  delta = Math.round(delta * 20) / 20;
  if ('sa_t_sp' in band) {
    out.sa_t_sp = +(band.sa_t_sp + delta).toFixed(2);
  } else if ('sa_t' in band) {
    out.sa_t = +(band.sa_t + delta).toFixed(2);
  }
  out.sun_score  = sunScore;
  out.sun_trim_c = delta;
  return out;
};

/* ---------- PERFORMANCE: memoize sun-exposure trig math ----------- */
/* Sun position changes only minute-by-minute, but red5SunExposureScore
   is called per-VAV per-React-render — i.e., dozens of times per second
   on V1.9 dashboards.  We wrap the raw implementation in a tiny LRU-ish
   cache keyed by (xFrac, yFrac, sun.azimuth, sun.elevation, is_day,
   northOffsetDeg).  Cache hit ≈ free; cache miss runs the real trig and
   stores it.  Cap at 4096 entries to bound memory.                     */
(function(){
  var _scoreCache = new Map();
  var _scoreImpl  = window.red5SunExposureScore;
  window.red5SunExposureScore = function(xFrac, yFrac, sun, opts){
    if (!sun) return 0;
    var nOff = (opts && opts.northOffsetDeg) || 0;
    // Quantize to keep the key space bounded; 0.5° / 0.001 frac is more
    // than enough precision for an SVG overlay.
    var key = (xFrac.toFixed(3)) + '|' + (yFrac.toFixed(3)) + '|'
            + ((sun.azimuth|0)) + '|' + ((sun.elevation*2|0)) + '|'
            + (sun.is_day?1:0) + '|' + nOff;
    if (_scoreCache.has(key)) return _scoreCache.get(key);
    var v = _scoreImpl(xFrac, yFrac, sun, opts);
    if (_scoreCache.size > 4096) _scoreCache.clear();
    _scoreCache.set(key, v);
    return v;
  };
  window.red5SunExposureScore.__clearCache = function(){ _scoreCache.clear(); };
})();

/* ---------- SHADOW GEOMETRY FOR A MARKER ------------------------- */
/* Returns CSS transform + length for an elongated ellipse that simulates
   the marker's shadow on the floor.  The shadow points OPPOSITE to the
   sun's azimuth (180° offset) and grows longer as the sun lowers toward
   the horizon.  No geometry — just visual directionality.

   Inputs: sun (result of red5SolarPosition), northOffsetDeg.
   Output: {length_px, angle_deg, opacity}  or null if no shadow shown. */
window.red5MarkerShadow = function(sun, opts){
  opts = opts || {};
  if (!sun || !sun.is_day || sun.elevation < 3) return null;
  // Shadow direction in plan-space: opposite of sun azimuth + plan's
  // north-offset rotation.  The CSS rotate() spins clockwise from 12 o'clock,
  // so we compute the compass bearing of the shadow relative to plan-up (N)
  // and feed it directly.
  var dir = (sun.azimuth + 180 + (opts.northOffsetDeg || 0)) % 360;
  // Shadow length: 6 px at zenith, 36 px near horizon (cot-like curve).
  // Clamp elevation to ≥ 5° so we don't produce absurdly long shadows
  // when the sun is almost set.
  var elev = Math.max(5, sun.elevation);
  var length = Math.min(40, 6 + 34 * (1 - elev/90));
  // Opacity fades in as sun rises and out again as it nears horizon
  var opacity = Math.min(0.55, 0.15 + 0.40 * Math.sin(sun.elevation * Math.PI/180));
  return {length_px: length, angle_deg: dir, opacity: opacity};
};

/* ---------- PERFORMANCE: memoize marker-shadow geometry ----------- */
/* Same rationale as red5SunExposureScore: per-VAV calls per render,
   but the result depends only on (sun.azimuth, sun.elevation, is_day,
   northOffsetDeg).  Cache the returned object reference so React
   reconciliation also benefits from referential equality.            */
(function(){
  var _shadowCache = new Map();
  var _shadowImpl  = window.red5MarkerShadow;
  window.red5MarkerShadow = function(sun, opts){
    if (!sun) return null;
    var nOff = (opts && opts.northOffsetDeg) || 0;
    var key = ((sun.azimuth|0)) + '|' + ((sun.elevation*2|0)) + '|'
            + (sun.is_day?1:0) + '|' + nOff;
    if (_shadowCache.has(key)) return _shadowCache.get(key);
    var v = _shadowImpl(sun, opts);
    if (_shadowCache.size > 256) _shadowCache.clear();
    _shadowCache.set(key, v);
    return v;
  };
  window.red5MarkerShadow.__clearCache = function(){ _shadowCache.clear(); };
})();

/* ---------- BUILDING-SILHOUETTE SHADOW (Option B) ----------------- */
/* Client-side, zero-AI implementation of dynamic building shadows.
   Takes an existing floor-plan image (shadow-free 3D rendering ideally),
   threshold-extracts a silhouette of anything darker than a configurable
   threshold, caches it as a data-URL PNG, then renders a duplicate of
   that silhouette skewed + translated away from the sun.  Pure CSS
   transform = smooth hourly animation without any runtime AI cost.

   Tunables (via opts):
     threshold      — 0..255 brightness cutoff (default 210).  Pixels
                      with avg(R,G,B) < threshold become silhouette.
     invert         — true to invert (extract LIGHT pixels as silhouette),
                      useful when the 3D render has light walls + dark bg.
*/
window.red5BuildSilhouette = function(imgEl, opts){
  opts = opts || {};
  var threshold = opts.threshold != null ? opts.threshold : 210;
  var invert = !!opts.invert;
  return new Promise(function(resolve, reject){
    try {
      var w = imgEl.naturalWidth || imgEl.width;
      var h = imgEl.naturalHeight || imgEl.height;
      if (!w || !h) { reject('img has no dimensions'); return; }
      var c = document.createElement('canvas');
      c.width = w; c.height = h;
      var ctx = c.getContext('2d');
      ctx.drawImage(imgEl, 0, 0);
      var data = ctx.getImageData(0, 0, w, h);
      var pix = data.data;
      // For each pixel, compute perceived brightness and decide if it's
      // building (→ opaque black) or background (→ transparent).
      for (var i = 0; i < pix.length; i += 4) {
        // Rec. 709 luma
        var lum = 0.2126*pix[i] + 0.7152*pix[i+1] + 0.0722*pix[i+2];
        var isBuilding = invert ? (lum > threshold) : (lum < threshold);
        if (isBuilding) {
          pix[i] = 0; pix[i+1] = 0; pix[i+2] = 0; pix[i+3] = 255;
        } else {
          pix[i+3] = 0;
        }
      }
      ctx.putImageData(data, 0, 0);
      resolve(c.toDataURL('image/png'));
    } catch (e) { reject(e); }
  });
};

/* ---------- BUILDING SHADOW REACT COMPONENT ----------------------- */
/* Mounts invisibly alongside the floor plan <img> and projects a black,
   skewed, translucent silhouette of the same image away from the sun.
   The shadow is positioned BEHIND the original image (z-index: 1) so
   it appears to fall on the floor, and uses mix-blend-mode: multiply
   so only the darker "floor" parts receive the shadow wash.            */
window.BuildingShadow = function BuildingShadow(props){
  var [silUrl, setSilUrl] = React.useState(null);
  var [dim, setDim] = React.useState({w: 100, h: 100});

  /* Rebuild the silhouette whenever the source image URL changes.
     Uses the native Image loader so CORS-clean data URLs / same-origin
     JPGs work transparently.  Silhouette is cached as a data-URL and
     reused for every hour-slider tick.                                  */
  React.useEffect(function(){
    if (!props.imgSrc) return;
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function(){
      setDim({w: img.naturalWidth, h: img.naturalHeight});
      window.red5BuildSilhouette(img, {
        threshold: props.threshold != null ? props.threshold : 210,
        invert:    props.invert || false
      }).then(setSilUrl).catch(function(err){
        console.warn('[sun-path] silhouette build failed:', err);
      });
    };
    img.onerror = function(){ console.warn('[sun-path] image load failed:', props.imgSrc); };
    img.src = props.imgSrc;
  }, [props.imgSrc, props.threshold, props.invert]);

  if (!silUrl || !props.sun || !props.sun.is_day) return null;

  /* Shadow geometry derived from sun angles:
      - direction: opposite of sun azimuth
      - skew amount: grows as sun approaches horizon (sin^-1 like)
      - vertical compression: Y-scale shrinks as sun rises toward zenith
     The combined transform simulates what a flat wall's cast shadow on
     the floor looks like from a top-down view: longer and more skewed
     at sunset/sunrise, short and compact at noon.                      */
  var northOffsetDeg = props.northOffsetDeg || 0;
  var shadowAz = (props.sun.azimuth + 180 + northOffsetDeg) % 360;
  // Elevation → Y-scale:  1.0 at horizon (full extension), 0.05 at zenith
  var elev = Math.max(3, props.sun.elevation);  // clamp
  var yScale = Math.max(0.08, Math.min(0.9, Math.cos(elev * Math.PI/180)));
  // Elevation → translate distance (as % of container).  Low sun pushes
  // shadow further away from the base; high sun pulls it right under.
  var translatePct = 6 + 22 * (1 - elev/90);
  // Direction vector on the plan
  var radR = shadowAz * Math.PI / 180;
  var tx = Math.sin(radR) * translatePct;
  var ty = -Math.cos(radR) * translatePct;
  // Opacity fades near sunset/sunrise and at night
  var opacity = Math.min(0.42, 0.12 + 0.30 * Math.sin(props.sun.elevation * Math.PI/180));

  var style = {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'url(' + silUrl + ')',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    transform: 'translate(' + tx + '%, ' + ty + '%) scaleY(' + yScale + ')',
    transformOrigin: '50% 100%',
    opacity: opacity,
    pointerEvents: 'none',
    // Multiply blend darkens only the floor-plan pixels where the
    // silhouette copy overlaps, producing a visible cast shadow on top
    // of the (opaque) floor-plan image.  z-index must be ABOVE the img
    // but BELOW the markers (markers use z-index 10+).
    mixBlendMode: 'multiply',
    filter: 'blur(2px)',
    zIndex: 6,
    transition: 'transform 300ms ease, opacity 300ms ease'
  };
  return <div style={style} data-testid="building-shadow"/>;
};

/* ---------- DIRECTIONAL RAY OVERLAY -------------------------------- */
/* A full-floor-plan SVG overlay that washes a soft warm gradient across
   the plan from the sun's incoming direction, so the viewer immediately
   sees "light is coming from the NE/SW/..." without reading numbers.
   Pointer events disabled so it never blocks marker clicks.            */
/* ---------- BUILDING FACING (ELC aspect) ----------------------------- */
/* Compass direction the main façade faces.  `auto` → S in northern
   hemisphere, N in southern.  Used by slim window sunshafts and as
   optional northOffsetDeg for plan-aligned solar math.               */
window.red5ResolvedBuildingFacing = function(facing, lat){
  var f = String(facing || 'auto').toUpperCase();
  if (['N','NE','E','SE','S','SW','W','NW'].indexOf(f) >= 0) return f;
  return (Number.isFinite(lat) && lat < 0) ? 'N' : 'S';
};
window.red5BuildingFacingDeg = function(facingLetter){
  return ({N:0, NE:45, E:90, SE:135, S:180, SW:225, W:270, NW:315})[facingLetter] || 180;
};
/* Map facing → floor-plan northOffsetDeg.  Convention: facing S (typical
   NH) means plan north is up → offset 0.  Facing E → rotate plan so
   east façade is "down"/front → northOffsetDeg = -90.                 */
window.red5FacingToNorthOffset = function(facing, lat){
  var letter = window.red5ResolvedBuildingFacing(facing, lat);
  var faceDeg = window.red5BuildingFacingDeg(letter);
  /* Facing S (=180) → offset 0; facing E (=90) → offset -90. */
  return ((180 - faceDeg) + 360) % 360;
  /* Keep in -180..180 for nicer diffs */
};

/* ELC floor.html _planCardinalBasis: S→N and W→E from placed markers.
   Glow travel is NOT “plan-up = north”; it is −towardSun in this frame. */
window.red5PlanCardinalBasis = function(orientation){
  var o = orientation || {};
  function unit(a, b) {
    if (!a || !b) return null;
    var ax = (a.x != null && a.x !== '') ? Number(a.x) : Number(a.x_m);
    var ay = (a.y != null && a.y !== '') ? Number(a.y) : Number(a.y_m);
    var bx = (b.x != null && b.x !== '') ? Number(b.x) : Number(b.x_m);
    var by = (b.y != null && b.y !== '') ? Number(b.y) : Number(b.y_m);
    if (!Number.isFinite(ax) || !Number.isFinite(ay) || !Number.isFinite(bx) || !Number.isFinite(by)) return null;
    var dx = bx - ax, dy = by - ay;
    var len = Math.hypot(dx, dy);
    if (len < 1e-6) return null;
    return [dx / len, dy / len];
  }
  var ns = unit(o.south, o.north);
  var we = unit(o.west, o.east);
  if (!ns && !we) return null;
  if (!ns && we) ns = [we[1], -we[0]];
  if (!we && ns) we = [-ns[1], ns[0]];
  var nx = ns[0], ny = ns[1], ex = we[0], ey = we[1];
  var dot = ex * nx + ey * ny;
  var ex2 = ex - dot * nx, ey2 = ey - dot * ny;
  var el = Math.hypot(ex2, ey2);
  if (el < 0.2) { ex2 = -ny; ey2 = nx; el = 1; }
  else { ex2 /= el; ey2 /= el; }
  if (ex2 * ex + ey2 * ey < 0) { ex2 = -ex2; ey2 = -ey2; }
  return { nx: nx, ny: ny, ex: ex2, ey: ey2 };
};

/* Same mapping as ELC _ambientSunState: toward-sun in the marker frame,
   then light travel = opposite.  azDeg is geographic (0=N, 90=E). */
window.red5PlanSunVectors = function(azDeg, orientation, northOffsetDeg){
  var az = ((Number(azDeg) || 0) % 360 + 360) % 360;
  var basis = window.red5PlanCardinalBasis(orientation);
  var sx, sy;
  if (basis) {
    var ar = az * Math.PI / 180;
    var c = Math.cos(ar), s = Math.sin(ar);
    sx = basis.nx * c + basis.ex * s;
    sy = basis.ny * c + basis.ey * s;
  } else {
    var off = Number(northOffsetDeg) || 0;
    var ar2 = ((az + off) % 360) * Math.PI / 180;
    if (ar2 < 0) ar2 += 2 * Math.PI;
    sx = Math.sin(ar2);
    sy = -Math.cos(ar2);
  }
  var sl = Math.hypot(sx, sy) || 1;
  sx /= sl; sy /= sl;
  return { sx: sx, sy: sy, lx: -sx, ly: -sy, basis: basis };
};

/* ---------- WINDOWS + SUNSHAFT OVERLAY (ELC volumetric) -------------- */
/* Soft air volume + floor wash.  Lateral feathers dissolve the sides so
   the beam reads as volume, not a flat ribbon.  Blinds (0..1 closed)
   attenuate.  Light only enters when sun travel hits the inward face.  */
window.WindowsSunshaftOverlay = function WindowsSunshaftOverlay(props){
  var wins = props.windows || [];
  var rooms = props.rooms || [];
  var sun = props.sun;
  if (!sun || !sun.is_day || !wins.length) return null;
  var travel = window.red5PlanSunVectors
    ? window.red5PlanSunVectors(sun.azimuth, props.orientation, props.northOffsetDeg)
    : null;
  var lx0 = travel ? travel.lx : (function () {
    var northOff = props.northOffsetDeg || 0;
    var az = ((sun.azimuth || 0) + northOff) % 360;
    if (az < 0) az += 360;
    return -Math.sin(az * Math.PI / 180);
  })();
  var ly0 = travel ? travel.ly : (function () {
    var northOff = props.northOffsetDeg || 0;
    var az = ((sun.azimuth || 0) + northOff) % 360;
    if (az < 0) az += 360;
    return Math.cos(az * Math.PI / 180);
  })();
  var elev = Math.max(0, sun.elevation || 0);
  var elevF = Math.max(0.15, Math.sin(elev * Math.PI / 180));
  var cloud = (typeof props.cloudCover === 'number') ? Math.max(0, Math.min(100, props.cloudCover)) : 0;
  var weatherF = Math.max(0.12, 1.0 - (cloud / 100) * 0.85);
  var isLight = props.theme === 'light';
  var centerX = (typeof props.interiorX === 'number') ? props.interiorX : 50;
  var centerY = (typeof props.interiorY === 'number') ? props.interiorY : 50;
  var hot = isLight ? '255,214,120' : '255,224,150';
  var mid = isLight ? '251,191,36' : '251,146,60';
  var FEATHER = [
    { s: 1.72, a: 0.03 },
    { s: 1.48, a: 0.05 },
    { s: 1.30, a: 0.08 },
    { s: 1.16, a: 0.12 },
    { s: 1.06, a: 0.20 },
    { s: 1.00, a: 0.32 },
    { s: 0.88, a: 0.14 }
  ];

  var bars = [];
  var shafts = [];
  var clipDefs = [];
  var unionId = null;
  if (rooms.length) {
    unionId = 'r5-rooms-union';
    clipDefs.push(
      <clipPath key={unionId} id={unionId} clipPathUnits="userSpaceOnUse">
        {rooms.map(function (rr, ri) {
          var rv = rr && (rr.vertices || rr.points);
          if (!rv || rv.length < 3) return null;
          return <polygon key={'ru-'+ri} points={rv.map(function (v) { return Number(v[0]) + ',' + Number(v[1]); }).join(' ')} />;
        })}
      </clipPath>
    );
  }
  function scaleSeg(ax, ay, bx, by, s) {
    var mx = (ax + bx) / 2, my = (ay + by) / 2;
    return [mx + (ax - mx) * s, my + (ay - my) * s, mx + (bx - mx) * s, my + (by - my) * s];
  }
  function expandRing(ring, k) {
    var sx = 0, sy = 0, n = ring.length, j;
    for (j = 0; j < n; j++) { sx += ring[j][0]; sy += ring[j][1]; }
    sx /= n; sy /= n;
    return ring.map(function (p) {
      return [sx + (p[0] - sx) * k, sy + (p[1] - sy) * k];
    });
  }
  function ringPoints(near, far) {
    var pts = near.slice();
    for (var k = far.length - 1; k >= 0; k--) pts.push(far[k]);
    return pts.map(function (p) { return p[0] + ',' + p[1]; }).join(' ');
  }
  function pushVolume(n1x, n1y, n2x, n2y, f1x, f1y, f2x, f2y, aBase, gradId, clipUrl, keyPrefix) {
    if (!(aBase > 0)) return;
    if (Math.hypot(n2x - n1x, n2y - n1y) < 0.04) return;
    for (var li = 0; li < FEATHER.length; li++) {
      var L = FEATHER[li];
      var nSeg = scaleSeg(n1x, n1y, n2x, n2y, L.s);
      var fSeg = scaleSeg(f1x, f1y, f2x, f2y, L.s);
      shafts.push(
        <polygon key={keyPrefix + '-' + li}
                 points={[nSeg[0], nSeg[1], nSeg[2], nSeg[3], fSeg[2], fSeg[3], fSeg[0], fSeg[1]].join(' ')}
                 fill={'url(#' + gradId + ')'}
                 opacity={aBase * L.a}
                 clipPath={clipUrl}
        />
      );
    }
  }
  for (var i = 0; i < wins.length; i++) {
    var w = wins[i];
    var cx = Number(w.x), cy = Number(w.y);
    var len = Number(w.length);
    var ang = Number(w.angle_deg) || 0;
    if (!Number.isFinite(cx) || !Number.isFinite(cy) || !Number.isFinite(len) || len < 0.5) continue;
    var blind = Math.min(1, Math.max(0, Number(w.blind_level) || 0));
    var rad = ang * Math.PI / 180;
    var tx = Math.cos(rad), ty = Math.sin(rad);
    var nx = -ty, ny = tx;
    var ix = centerX - cx, iy = centerY - cy;
    if (ix * ix + iy * iy < 1e-6) { ix = 0; iy = 1; }
    if (nx * ix + ny * iy < 0) { nx = -nx; ny = -ny; }
    var half = len / 2;
    var x1 = cx - tx * half, y1 = cy - ty * half;
    var x2 = cx + tx * half, y2 = cy + ty * half;
    var open = 1 - blind;
    var bx = lx0, by = ly0;
    var enter = nx * bx + ny * by;
    var traced = Array.isArray(w.vertices) && w.vertices.length >= 3;
    if (!traced) {
    bars.push(
      <line key={'wb-'+ (w.id || i)}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={isLight ? '#38bdf8' : '#7dd3fc'}
            strokeWidth={Math.max(0.45, Math.min(1.0, len * 0.03))}
            strokeLinecap="butt"
            opacity={0.55 + 0.35 * open}
      />
    );
    }
    if (enter < 0.05 || open < 0.01) continue;
    if (enter < 0.28) {
      var nk = (0.28 - enter) * 0.18;
      bx += nx * nk; by += ny * nk;
      var bl = Math.hypot(bx, by) || 1;
      bx /= bl; by /= bl;
      enter = nx * bx + ny * by;
    }
    var openEase = Math.pow(open, 0.7);
    var base = enter * elevF * weatherF;
    if (base < 0.03) continue;
    var throwLen = (10 + 24 * base) * (1.0 + 1.0 * openEase);
    var dx = bx * throwLen, dy = by * throwLen;
    var spread = half * (0.18 + 0.28 * openEase);
    var px = -(y2 - y1), py = (x2 - x1);
    var plen = Math.hypot(px, py) || 1;
    px = (px / plen) * spread;
    py = (py / plen) * spread;
    var fx1 = x1 + dx - px, fy1 = y1 + dy - py;
    var fx2 = x2 + dx + px, fy2 = y2 + dy + py;
    var a0 = Math.min(0.22, Math.max(0.06, 0.07 + base * 0.16 + openEase * 0.06));
    var gx0 = (x1 + x2) / 2, gy0 = (y1 + y2) / 2;
    var gx1 = (fx1 + fx2) / 2, gy1 = (fy1 + fy2) / 2;
    var gradId = 'r5-shaft-grad-' + (w.id || i);
    var clipId = unionId;
    var room = (rooms.length && window.red5RoomForWindow) ? window.red5RoomForWindow(w, rooms) : null;
    var rVerts = room && (room.vertices || room.points);
    if (rVerts && rVerts.length >= 3) {
      clipId = 'r5-room-clip-' + (w.id || i);
      var pts = rVerts.map(function(v){ return Number(v[0]) + ',' + Number(v[1]); }).join(' ');
      clipDefs.push(
        <clipPath key={clipId} id={clipId} clipPathUnits="userSpaceOnUse">
          <polygon points={pts} />
        </clipPath>
      );
    }
    clipDefs.push(
      <linearGradient key={gradId} id={gradId}
                      gradientUnits="userSpaceOnUse"
                      x1={gx0} y1={gy0} x2={gx1} y2={gy1}>
        <stop offset="0%"   stopColor={'rgb('+hot+')'} stopOpacity="0.85" />
        <stop offset="28%"  stopColor={'rgb('+hot+')'} stopOpacity="0.62" />
        <stop offset="55%"  stopColor={'rgb('+mid+')'} stopOpacity="0.32" />
        <stop offset="82%"  stopColor={'rgb('+mid+')'} stopOpacity="0.10" />
        <stop offset="100%" stopColor={'rgb('+mid+')'} stopOpacity="0" />
      </linearGradient>
    );
    var clipUrl = clipId ? ('url(#' + clipId + ')') : undefined;
    var wid = w.id || i;
    var bType = String(w.blind_type || w.blindType || 'roller').toLowerCase();
    var cov = blind;
    var openFrac = open;
    var gapStyle = (bType === 'horizontal' || bType === 'vertical')
      && openFrac > 0.01 && openFrac < 0.92;
    function flareFar(n1x, n1y, n2x, n2y) {
      var hh = Math.hypot(n2x - n1x, n2y - n1y) / 2;
      var spr = hh * (0.18 + 0.28 * openEase);
      var qx = -(n2y - n1y), qy = (n2x - n1x);
      var ql = Math.hypot(qx, qy) || 1;
      qx = (qx / ql) * spr; qy = (qy / ql) * spr;
      return [n1x + dx - qx, n1y + dy - qy, n2x + dx + qx, n2y + dy + qy];
    }
    function gapFrameFromVerts(verts) {
      var gp = verts.map(function (v) { return [Number(v[0]), Number(v[1])]; });
      if (gp.length < 3) return null;
      var ssx = gp[1][0] - gp[0][0], ssy = gp[1][1] - gp[0][1];
      var sl = Math.hypot(ssx, ssy) || 1;
      ssx /= sl; ssy /= sl;
      var hhx = -ssy, hhy = ssx;
      var gcx = 0, gcy = 0, gi;
      for (gi = 0; gi < gp.length; gi++) { gcx += gp[gi][0]; gcy += gp[gi][1]; }
      gcx /= gp.length; gcy /= gp.length;
      if (gcx * hhx + gcy * hhy > gp[0][0] * hhx + gp[0][1] * hhy) { hhx = -hhx; hhy = -hhy; }
      var dotsS = gp.map(function (p) { return p[0] * ssx + p[1] * ssy; });
      var dotsH = gp.map(function (p) { return p[0] * hhx + p[1] * hhy; });
      return {
        sx: ssx, sy: ssy, hx: hhx, hy: hhy,
        sMin: Math.min.apply(null, dotsS), sMax: Math.max.apply(null, dotsS),
        hMin: Math.min.apply(null, dotsH), hMax: Math.max.apply(null, dotsH)
      };
    }
    function gapFrameFromBar() {
      var ssx = x2 - x1, ssy = y2 - y1;
      var sl = Math.hypot(ssx, ssy) || 1;
      ssx /= sl; ssy /= sl;
      var hhx = -ssy, hhy = ssx;
      if (hhx * nx + hhy * ny < 0) { hhx = -hhx; hhy = -hhy; }
      var sA = x1 * ssx + y1 * ssy, sB = x2 * ssx + y2 * ssy;
      var h0 = x1 * hhx + y1 * hhy;
      var hLift = Math.max(1.8, Math.min(4.2, half * 0.55));
      return {
        sx: ssx, sy: ssy, hx: hhx, hy: hhy,
        sMin: Math.min(sA, sB), sMax: Math.max(sA, sB),
        hMin: h0, hMax: h0 + hLift
      };
    }
    function paintGapGloss(fr) {
      if (!fr) return;
      var sSpan = Math.max(0.2, fr.sMax - fr.sMin);
      var hSpan = Math.max(0.2, fr.hMax - fr.hMin);
      var stripeA = a0 * (0.55 + 0.45 * openEase);
      function atSH(sv, hv) {
        return [sv * fr.sx + hv * fr.hx, sv * fr.sy + hv * fr.hy];
      }
      var si;
      if (bType === 'horizontal') {
        var hn = Math.max(4, Math.round(5 + openFrac * 10));
        for (si = 0; si < hn; si++) {
          var u0 = cov + openFrac * ((si + 0.18) / hn);
          var u1 = cov + openFrac * ((si + 0.55) / hn);
          if (u1 <= cov + 0.01) continue;
          var hv = ((fr.hMax - u0 * hSpan) + (fr.hMax - u1 * hSpan)) / 2;
          var hn1 = atSH(fr.sMin - 0.2, hv);
          var hn2 = atSH(fr.sMax + 0.2, hv);
          var hf = flareFar(hn1[0], hn1[1], hn2[0], hn2[1]);
          pushVolume(hn1[0], hn1[1], hn2[0], hn2[1], hf[0], hf[1], hf[2], hf[3],
            stripeA * 0.85, gradId, clipUrl, 'wh-' + wid + '-' + si);
        }
        return;
      }
      var vn = Math.max(5, Math.round(6 + openFrac * 10));
      var gapW = (0.18 + 0.42 * openFrac) * (sSpan / vn);
      for (si = 0; si < vn; si++) {
        var vc = fr.sMin + sSpan * ((si + 0.5) / vn);
        var vs0 = vc - gapW * 0.5, vs1 = vc + gapW * 0.5;
        var vn1 = atSH(vs0, fr.hMin);
        var vn2 = atSH(vs1, fr.hMin);
        var vf = flareFar(vn1[0], vn1[1], vn2[0], vn2[1]);
        pushVolume(vn1[0], vn1[1], vn2[0], vn2[1], vf[0], vf[1], vf[2], vf[3],
          stripeA * 0.9, gradId, clipUrl, 'wv-' + wid + '-' + si);
        var va1 = atSH(vs0, fr.hMin + hSpan * 0.55);
        var va2 = atSH(vs1, fr.hMin + hSpan * 0.55);
        pushVolume(va1[0], va1[1], va2[0], va2[1], vf[0], vf[1], vf[2], vf[3],
          stripeA * 0.22, gradId, clipUrl, 'wva-' + wid + '-' + si);
      }
    }
    if (gapStyle) {
      paintGapGloss(traced ? gapFrameFromVerts(w.vertices) : gapFrameFromBar());
      continue;
    }
    if (traced) {
      var near = w.vertices.map(function (v) { return [Number(v[0]), Number(v[1])]; });
      var far = near.map(function (p) { return [p[0] + dx, p[1] + dy]; });
      var tLayers = [
        { k: 1.42, a: a0 * 0.10 },
        { k: 1.24, a: a0 * 0.18 },
        { k: 1.10, a: a0 * 0.36 },
        { k: 1.00, a: a0 * 0.85 }
      ];
      for (var ti = 0; ti < tLayers.length; ti++) {
        var TL = tLayers[ti];
        shafts.push(
          <polygon key={'wt-'+ wid + '-' + ti}
                   points={ringPoints(expandRing(near, TL.k), expandRing(far, TL.k))}
                   fill={'url(#' + gradId + ')'}
                   opacity={TL.a}
                   clipPath={clipUrl}
          />
        );
      }
      continue;
    }
    var lift = Math.max(1.6, Math.min(4.2, half * 0.55));
    var midThrow = 0.92;
    var af1x = x1 + dx * midThrow + (fx1 - (x1 + dx)) * 0.55;
    var af1y = y1 + dy * midThrow + (fy1 - (y1 + dy)) * 0.55;
    var af2x = x2 + dx * midThrow + (fx2 - (x2 + dx)) * 0.55;
    var af2y = y2 + dy * midThrow + (fy2 - (y2 + dy)) * 0.55;
    pushVolume(
      x1 - bx * 0.35, y1 - lift, x2 - bx * 0.35, y2 - lift,
      af1x, af1y, af2x, af2y,
      a0 * 0.28, gradId, clipUrl, 'wa-' + wid);
    pushVolume(
      x1, y1, x2, y2, fx1, fy1, fx2, fy2,
      a0 * 0.72, gradId, clipUrl, 'wf-' + wid);
  }
  var showBars = props.showBars !== false;
  var roomOutlines = [];
  if (props.showRooms === true && rooms.length) {
    for (var ri = 0; ri < rooms.length; ri++) {
      var rr = rooms[ri];
      var rv = rr && (rr.vertices || rr.points);
      if (!rv || rv.length < 3) continue;
      roomOutlines.push(
        <polygon key={'room-'+ (rr.id || ri)}
                 points={rv.map(function(v){ return Number(v[0])+','+Number(v[1]); }).join(' ')}
                 fill="none"
                 stroke={isLight ? 'rgba(56,189,248,0.35)' : 'rgba(125,211,252,0.40)'}
                 strokeWidth="0.35"
                 strokeDasharray="1.2 0.8"
        />
      );
    }
  }
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
      style={{width:'100%', height:'100%', zIndex: 81, mixBlendMode: isLight ? 'multiply' : 'screen'}}
      data-testid="windows-sunshaft-overlay"
    >
      {clipDefs.length ? <defs>{clipDefs}</defs> : null}
      {roomOutlines}
      {shafts}
      {showBars ? bars : null}
    </svg>
  );
};

window.SunRayOverlay = function SunRayOverlay(props){
  if (!props.sun || !props.sun.is_day) return null;
  var travel = window.red5PlanSunVectors
    ? window.red5PlanSunVectors(props.sun.azimuth, props.orientation, props.northOffsetDeg)
    : null;
  var gx = 50 + 60 * (travel ? travel.sx : Math.sin(((props.sun.azimuth + (props.northOffsetDeg || 0)) % 360) * Math.PI / 180));
  var gy = 50 + 60 * (travel ? travel.sy : -Math.cos(((props.sun.azimuth + (props.northOffsetDeg || 0)) % 360) * Math.PI / 180));
  /* Theme-aware ray palette.  Light mode needs MORE saturation and
     greater opacity so the wash reads against near-white floor plans
     (dark mode gets a softer amber that survives on deep backgrounds). */
  var isLight = props.theme === 'light';
  var intensityBase = isLight ? 0.55 : 0.35;
  var intensity = Math.min(intensityBase, 0.18 + (intensityBase - 0.18) * Math.sin(props.sun.elevation * Math.PI / 180));
  /* Cloud-cover modulation (option "A" from 2026-06-12 design).
     Open-Meteo reports cloud_cover 0-100; 100 = full overcast.  An
     opaque sky kills the direct beam, so we damp the ray intensity
     down to ~10% at 100% cloud cover and grey it out (less amber,
     more slate) so the operator can SEE that the sun is up but not
     contributing.  We do NOT hide the ray entirely -- diffuse
     irradiance is still there on cloudy days.  Damp from a separate
     ``ghi_wm2`` reading if provided -- that is a single number that
     already captures clouds + time-of-day + season and is the most
     honest input.  Falls back to cloud-cover-only when GHI is
     unavailable.                                                       */
  var cloud  = (typeof props.cloudCover === 'number') ? Math.max(0, Math.min(100, props.cloudCover)) : null;
  var ghi    = (typeof props.ghiWm2     === 'number') ? Math.max(0, props.ghiWm2) : null;
  var weatherFactor = 1.0;
  if (ghi !== null) {
    /* Reference clear-sky GHI at the sun's current elevation, very
       rough -- ~1100 W/m^2 * sin(elev) is the textbook approximation.
       The ratio of observed:clear-sky is our attenuation factor. */
    var refGhi = 1100 * Math.max(0.05, Math.sin(props.sun.elevation * Math.PI / 180));
    weatherFactor = Math.max(0.10, Math.min(1.0, ghi / refGhi));
  } else if (cloud !== null) {
    /* Empirical: 100% cloud cover attenuates direct beam ~85%.
       Linear ramp is good enough for visualization. */
    weatherFactor = Math.max(0.10, 1.0 - (cloud / 100) * 0.85);
  }
  intensity = intensity * weatherFactor;
  /* Desaturate the palette as it gets cloudier so the wash visibly
     "greys out" and the operator's eye doesn't read sunny conditions
     when it's overcast. */
  var stopInBright  = isLight ? '#fbbf24' : '#fde68a';
  var stopMidBright = isLight ? '#f59e0b' : '#fbbf24';
  var stopInDim     = isLight ? '#cbd5e1' : '#475569';  // slate-300 / slate-600
  var stopMidDim    = isLight ? '#94a3b8' : '#334155';
  function _mix(c1, c2, t){
    /* mix two #rrggbb colours; t=0 -> c1, t=1 -> c2 */
    function _hx(c){ return [parseInt(c.slice(1,3),16), parseInt(c.slice(3,5),16), parseInt(c.slice(5,7),16)]; }
    var a = _hx(c1), b = _hx(c2);
    var m = a.map(function(v, i){ return Math.round(v + (b[i] - v) * t); });
    return '#' + m.map(function(v){ return ('0' + v.toString(16)).slice(-2); }).join('');
  }
  var grey = 1 - weatherFactor;     // 0 = bright clear, 1 = greyed overcast
  var stopIn  = _mix(stopInBright,  stopInDim,  grey);
  var stopMid = _mix(stopMidBright, stopMidDim, grey);
  var stopOut = stopMid;
  var gid = 'sunray-grad-' + Math.round(props.sun.azimuth || 0) + '-' + Math.round(gx) + '-' + Math.round(gy) + '-' + Math.round(weatherFactor*100) + '-' + (isLight ? 'l' : 'd');
  var rooms = props.rooms || [];
  var clipId = null;
  var clipPolys = [];
  for (var ri = 0; ri < rooms.length; ri++) {
    var rv = rooms[ri] && (rooms[ri].vertices || rooms[ri].points);
    if (!rv || rv.length < 3) continue;
    clipPolys.push(
      <polygon key={'sr-'+ri} points={rv.map(function (v) { return Number(v[0]) + ',' + Number(v[1]); }).join(' ')} />
    );
  }
  if (clipPolys.length) clipId = 'sunray-rooms-clip';
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
      style={{width:'100%', height:'100%', zIndex: 5, mixBlendMode: isLight ? 'multiply' : 'screen'}}
      data-testid="sun-ray-overlay"
    >
      <defs>
        {clipId ? <clipPath id={clipId} clipPathUnits="userSpaceOnUse">{clipPolys}</clipPath> : null}
        <radialGradient id={gid} cx={gx+'%'} cy={gy+'%'} r="85%" fx={gx+'%'} fy={gy+'%'}>
          <stop offset="0%"  stopColor={stopIn}  stopOpacity={intensity}/>
          <stop offset="40%" stopColor={stopMid} stopOpacity={intensity*0.5}/>
          <stop offset="100%" stopColor={stopOut} stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill={'url(#' + gid + ')'}
            clipPath={clipId ? ('url(#' + clipId + ')') : undefined}/>
    </svg>
  );
};

/* ---------- SUN COMPASS COMPONENT --------------------------------- */
/* Floating badge overlaying the floor-plan canvas.  Shows the current
   sun azimuth as a rotating arrow + numeric elevation/azimuth readout +
   an "hour of day × day of year" slider pair.  The slider values + lat/lon
   get reported back to the parent via onChange so the parent can style
   markers accordingly.                                                 */
window.SunCompass = function SunCompass(props){
  var stored = (function(){
    try { return JSON.parse(localStorage.getItem('red5SunCompass') || '{}'); }
    catch(e){ return {}; }
  })();
  /* Always initialize sliders to the CURRENT local wall-clock time.  We
     used to persist the user's last slider position, which meant a
     stale hour/date would appear on every page load.  Persist only the
     enabled/expanded UI state; the sliders always snap to "now" on
     mount and on every toggle-on of the overlay.                       */
  function currentDoy(){
    var nn = new Date();
    var start = new Date(nn.getFullYear(), 0, 0);
    return Math.floor((nn - start) / 86400000);
  }
  var [enabled, setEnabled] = React.useState(stored.enabled || false);
  var [expanded, setExpanded] = React.useState(stored.expanded !== false); // default: expanded
  var [hour, setHour] = React.useState(new Date().getHours());
  var [doy,  setDoy]  = React.useState(currentDoy());
  var [playing, setPlaying] = React.useState(false);
  /* Draggable offset so the badge can clear the Window · Open chip (and
     anything else parked in the top-right).  Persisted with UI state. */
  var [pos, setPos] = React.useState(function(){
    var p = stored.pos;
    if (p && typeof p.x === 'number' && typeof p.y === 'number') return { x: p.x, y: p.y };
    return { x: 0, y: 0 };
  });
  var [drag, setDrag] = React.useState(null);
  var dragMovedRef = React.useRef(false);
  var posRef = React.useRef(pos);
  posRef.current = pos;
  /* Live weather payload from /api/weather-current.  Refreshed every
     5 min while the compass is enabled+expanded; the backend cache
     and the window.red5FetchCurrentWeather dedupe layer mean this
     doesn't actually hit the network that often.  Kept in component
     state (not just module cache) so the compass re-renders when a
     fresh fetch lands.                                                */
  var [weatherNow, setWeatherNow] = React.useState(null);
  React.useEffect(function(){
    if (!enabled || !expanded) return undefined;
    var lat = (props.lat != null) ? props.lat : 40.71;
    var lon = (props.lon != null) ? props.lon : -74.01;
    var cancelled = false;
    function _tick(){
      if (typeof window.red5FetchCurrentWeather !== 'function') return;
      window.red5FetchCurrentWeather(lat, lon).then(function(p){
        if (!cancelled) setWeatherNow(p);
      });
    }
    _tick();
    var timer = setInterval(_tick, 5 * 60 * 1000);
    return function(){ cancelled = true; clearInterval(timer); };
  }, [enabled, expanded, props.lat, props.lon]);

  /* Theme: 'light' | 'dark' (default dark).  Controls background, text
     and border contrast so the compass reads on light-mode dashboards. */
  var theme = props.theme || 'dark';
  var isLight = theme === 'light';
  /* Per-theme palette so a single lookup drives every visible surface.
     Light mode uses near-white panel + slate body text so readouts are
     legible against pale hospital/office floor-plan images.            */
  var C = isLight ? {
    panel:   'rgba(255,255,255,0.97)',
    border:  '#cbd5e1',
    titleFg: '#b45309',   // amber-700
    dim:     '#475569',   // slate-600
    text:    '#1e293b',   // slate-800
    chipBg:  '#f1f5f9',   // slate-100
    dial:    '#e2e8f0',   // slate-200
    dialSun: '#d97706',   // amber-600
    compass: '#64748b',   // slate-500 cardinal letters
    sun:     '#f59e0b',   // amber-500
    sunRim:  '#b45309',   // amber-700
    ray:     '#b45309',   // amber-700
    night:   '#94a3b8'
  } : {
    panel:   'rgba(2,6,23,0.92)',
    border:  '#334155',
    titleFg: '#fbbf24',
    dim:     '#94a3b8',
    text:    '#e2e8f0',
    chipBg:  '#0f172a',
    dial:    '#1e293b',
    dialSun: '#f59e0b',
    compass: '#64748b',
    sun:     '#fbbf24',
    sunRim:  '#fde68a',
    ray:     '#fbbf24',
    night:   '#94a3b8'
  };

  /* Listen for an external toggle request (the sidebar "Sun-Path Overlay"
     button dispatches `red5-sun-reload` which re-reads localStorage and
     applies the latest `enabled` flag).  This lets both UIs stay in sync
     without lifting state up through the main App tree.                  */
  React.useEffect(function(){
    function onReload(){
      try {
        var s = JSON.parse(localStorage.getItem('red5SunCompass') || '{}');
        setEnabled(!!s.enabled);
        if (typeof s.expanded === 'boolean') setExpanded(s.expanded);
        if (s.pos && typeof s.pos.x === 'number' && typeof s.pos.y === 'number') {
          setPos({ x: s.pos.x, y: s.pos.y });
        }
      } catch(e){}
    }
    window.addEventListener('red5-sun-reload', onReload);
    return function(){ window.removeEventListener('red5-sun-reload', onReload); };
  }, []);

  React.useEffect(function(){
    if (!drag) return undefined;
    function onMove(e){
      var dx = e.clientX - drag.startX;
      var dy = e.clientY - drag.startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragMovedRef.current = true;
      setPos({ x: drag.baseX + dx, y: drag.baseY + dy });
    }
    function onUp(){
      setDrag(null);
      try {
        var cur = {};
        try { cur = JSON.parse(localStorage.getItem('red5SunCompass') || '{}') || {}; } catch (_e) {}
        cur.enabled = !!enabled;
        cur.expanded = !!expanded;
        cur.pos = { x: posRef.current.x, y: posRef.current.y };
        localStorage.setItem('red5SunCompass', JSON.stringify(cur));
      } catch (_e2) {}
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return function(){
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [drag, enabled, expanded]);

  function startCompassDrag(e){
    if (e.button != null && e.button !== 0) return;
    var t = e.target;
    if (t && t.closest && (t.closest('button') || t.closest('input') || t.closest('select') || t.closest('a'))) return;
    e.preventDefault();
    e.stopPropagation();
    dragMovedRef.current = false;
    setDrag({ startX: e.clientX, startY: e.clientY, baseX: pos.x, baseY: pos.y });
  }

  /* Animate-day: auto-advance `hour` from 5 AM → 8 PM at 350ms/step when
     `playing` is true.  Loops back to 5 AM after reaching 20.          */
  React.useEffect(function(){
    if (!playing) return undefined;
    var id = setInterval(function(){
      setHour(function(h){
        var next = h + 1;
        if (next > 20) next = 5;
        return next;
      });
    }, 350);
    return function(){ clearInterval(id); };
  }, [playing]);

  // Construct a date at `hour` on `doy` of this year, in the lat/lon's
  // local time.  The parent passes lat/lon; we approximate local time by
  // rounding longitude to the nearest hour offset.
  var lat = typeof props.lat === 'number' ? props.lat : 40.7128;
  var lon = typeof props.lon === 'number' ? props.lon : -74.0060;
  var year = new Date().getFullYear();
  var tzOffsetH = Math.round(lon / 15);
  var utcMs = Date.UTC(year, 0, doy) + (hour - tzOffsetH) * 3600000;
  var date = new Date(utcMs);
  var sun = window.red5SolarPosition(lat, lon, date);

  // Report upward so the parent can color markers + dim the ray overlay.
  // Dual path: props.onChange (React) AND window 'r5-sun-state' event.
  // The event exists because V1.9 production builds were observed with the
  // compass UI ON (local state) while parent sunState stayed null — so VAV
  // rings never updated even though the dial/sliders moved.
  function emitSunState(nextSun) {
    var now = new Date();
    var simulating = (hour !== now.getHours()) || (doy !== currentDoy());
    var wxOk = weatherNow && weatherNow.success;
    // DAY play is simulation mode — overlay (ray + VAV rings) must be on.
    // Previously ▶ DAY only advanced the dial while `enabled` stayed false,
    // so operators saw the sun move with zero VAV highlighting.
    var overlayOn = !!(enabled || playing);
    var payload = {
      enabled: overlayOn, sun: nextSun || sun, hour: hour, doy: doy,
      cloudCover: wxOk ? weatherNow.cloud_cover : null,
      ghiWm2:     (!simulating && wxOk) ? weatherNow.ghi_wm2 : null,
      weatherNow: weatherNow || null,
      playing: !!playing
    };
    try { localStorage.setItem('red5SunCompass', JSON.stringify({
      enabled: enabled, expanded: expanded, pos: { x: posRef.current.x, y: posRef.current.y }
    })); } catch (_e) {}
    if (props.onChange) props.onChange(payload);
    try {
      window.dispatchEvent(new CustomEvent('r5-sun-state', { detail: payload }));
    } catch (_e2) {}
  }

  React.useLayoutEffect(function(){
    emitSunState(sun);
  }, [enabled, expanded, hour, doy, lat, lon, weatherNow, playing]);

  // Day-of-year → pretty month/day label
  var d0 = new Date(year, 0, doy);
  var mdLabel = d0.toLocaleDateString(undefined, {month:'short', day:'numeric'});
  var hhLabel = String(hour).padStart(2,'0') + ':00';

  // When collapsed, render a tiny chip-style badge so the compass never
  // obscures the floor plan but still signals its live state + offers a
  // one-click way to re-expand.  VAV/AHU halos remain active regardless.
  var posStyle = {
    top: 12, right: 12,
    transform: 'translate(' + pos.x + 'px,' + pos.y + 'px)',
    cursor: drag ? 'grabbing' : 'grab',
    userSelect: 'none',
    touchAction: 'none'
  };
  if (!expanded) {
    return (
      <div
        className="absolute z-30 rounded-full px-2.5 py-1 flex items-center gap-1.5 backdrop-blur-md shadow-lg"
        style={Object.assign({background: C.panel, border: '1px solid ' + C.border}, posStyle)}
        data-testid="sun-compass"
        onMouseDown={startCompassDrag}
        onClick={function(){ if (!dragMovedRef.current) setExpanded(true); }}
        title="Drag to move · click to expand"
      >
        <span style={{color: C.titleFg, fontWeight:900, fontSize:10, letterSpacing:'.12em'}}>☀</span>
        {enabled ? (
          <span style={{color: C.text, fontFamily:'monospace', fontSize:10}}>
            {hhLabel} · AZ {sun.azimuth.toFixed(0)}° EL {sun.elevation.toFixed(0)}°
          </span>
        ) : (
          <span style={{color: C.dim, fontFamily:'monospace', fontSize:10, textTransform:'uppercase', letterSpacing:'.1em'}}>OFF</span>
        )}
        <span style={{color: C.dim, fontSize:9}}>▸</span>
      </div>
    );
  }

  return (
    <div
      className="absolute z-30 rounded-lg p-3 backdrop-blur-md shadow-2xl"
      style={Object.assign({width: 210, background: C.panel, border: '1px solid ' + C.border}, posStyle)}
      data-testid="sun-compass"
      onMouseDown={startCompassDrag}
      title="Drag header area to move"
    >
      <div className="flex items-center justify-between mb-2" style={{cursor: drag ? 'grabbing' : 'grab'}}>
        <div className="flex items-center gap-1.5">
          <span style={{color: C.titleFg, fontWeight:900, fontSize:9, letterSpacing:'.15em', textTransform:'uppercase'}}>☀ Sun Path</span>
          {enabled && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{background: C.sun}}></span>}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={function(){
              var next = !enabled;
              /* When flipping ON, always snap sliders back to the
                 current wall-clock time so the projection matches
                 reality.  If the user was mid-scrub and toggled OFF/ON,
                 this resets to "now" rather than resuming the stale
                 position.                                               */
              if (next) {
                setHour(new Date().getHours());
                setDoy(currentDoy());
              }
              setEnabled(next);
            }}
            style={{
              background: enabled ? C.sun : C.chipBg,
              color: enabled ? (isLight ? '#78350f' : '#0f172a') : C.dim,
              fontSize:8, fontWeight:900, letterSpacing:'.08em', textTransform:'uppercase',
              padding:'2px 8px', borderRadius:4, cursor:'pointer'
            }}
            data-testid="sun-compass-toggle"
          >
            {enabled ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={function(){ setExpanded(false); }}
            style={{color: C.dim, fontSize:10, padding:'0 4px', background:'transparent'}}
            data-testid="sun-compass-collapse"
            title="Collapse sun compass"
          >
            ◂
          </button>
        </div>
      </div>
      {/* Compass dial */}
      <div className="relative mx-auto mb-2" style={{width: 120, height: 120}}>
        <svg viewBox="-60 -60 120 120" className="w-full h-full">
          {/* Dial ring */}
          <circle cx="0" cy="0" r="54" fill="none" stroke={C.dial} strokeWidth="2"/>
          <circle cx="0" cy="0" r="54" fill="none" stroke={enabled ? C.dialSun : C.dial} strokeWidth="1" strokeDasharray="2 3"/>
          {/* Cardinal labels */}
          <text x="0"  y="-46" textAnchor="middle" fontSize="8" fill={C.compass} fontWeight="900">N</text>
          <text x="46" y="3"   textAnchor="middle" fontSize="8" fill={C.compass} fontWeight="900">E</text>
          <text x="0"  y="52"  textAnchor="middle" fontSize="8" fill={C.compass} fontWeight="900">S</text>
          <text x="-46" y="3"  textAnchor="middle" fontSize="8" fill={C.compass} fontWeight="900">W</text>
          {sun.is_day ? (
            <g transform={'rotate(' + sun.azimuth + ')'}>
              <circle cx="0" cy={-54 + (sun.elevation/90)*46} r={3 + (sun.elevation/90)*4}
                      fill={C.sun} stroke={C.sunRim} strokeWidth="1"/>
              <line x1="0" y1="0" x2="0" y2={-54 + (sun.elevation/90)*46}
                    stroke={C.sun} strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
            </g>
          ) : (
            <g>
              <circle cx="0" cy="0" r="8" fill={C.chipBg} stroke={C.border} strokeWidth="1"/>
              <text x="0" y="3" textAnchor="middle" fontSize="10" fill={C.night}>🌙</text>
            </g>
          )}
          <circle cx="0" cy="0" r="2" fill={C.compass}/>
        </svg>
      </div>
      {/* Readouts */}
      <div className="grid grid-cols-2 gap-1 mb-2" style={{fontFamily:'monospace', fontSize:9}}>
        <div style={{background: C.chipBg, borderRadius:3, padding:'2px 6px'}}>
          <span style={{color: C.dim}}>AZ </span>
          <span style={{color: C.titleFg}}>{sun.azimuth.toFixed(0)}°</span>
        </div>
        <div style={{background: C.chipBg, borderRadius:3, padding:'2px 6px'}}>
          <span style={{color: C.dim}}>EL </span>
          <span style={{color: C.titleFg}}>{sun.elevation.toFixed(0)}°</span>
        </div>
      </div>
      {/* Sliders — now theme-aware so labels and values are legible in both modes */}
      <label style={{display:'block', fontSize:8, color: C.dim, fontWeight:900, textTransform:'uppercase', letterSpacing:'.08em', marginTop:4}}>
        Hour <span style={{float:'right', color: C.titleFg, fontFamily:'monospace'}}>{hhLabel}</span>
        <button
          onClick={function(){
            /* Reset sliders to the current wall-clock time without
               touching the enabled/expanded state.  Handy after a
               user has scrubbed forward/backward and wants to return
               to "right now" projection.                              */
            setHour(new Date().getHours());
            setDoy(currentDoy());
            setPlaying(false);
          }}
          style={{
            marginLeft:8, display:'inline-block', padding:'0 6px', borderRadius:3,
            fontSize:7, fontWeight:900, letterSpacing:'.08em',
            background: C.chipBg, color: C.dim, border: '1px solid ' + C.border
          }}
          data-testid="sun-compass-now"
          title="Snap sliders back to current time"
        >
          NOW
        </button>
        <button
          onClick={function(){
            var next = !playing;
            // Starting DAY simulation always arms the overlay so VAV
            // rings track the moving sun.  Stopping leaves `enabled` as-is.
            if (next) setEnabled(true);
            setPlaying(next);
          }}
          style={{
            marginLeft:4, display:'inline-block', padding:'0 6px', borderRadius:3,
            fontSize:7, fontWeight:900, letterSpacing:'.08em',
            background: playing ? C.sun : C.chipBg,
            color: playing ? (isLight ? '#78350f' : '#0f172a') : C.dim
          }}
          data-testid="sun-compass-play"
          title="Animate sun across the day (also turns overlay ON)"
        >
          {playing ? '⏸' : '▶'} DAY
        </button>
      </label>
      <input type="range" min="0" max="23" step="1" value={hour}
        onChange={function(e){ setHour(+e.target.value); }}
        className="w-full"
        style={{accentColor: C.sun}}
        data-testid="sun-compass-hour"/>
      <label style={{display:'block', fontSize:8, color: C.dim, fontWeight:900, textTransform:'uppercase', letterSpacing:'.08em', marginTop:4}}>
        Date <span style={{float:'right', color: C.titleFg, fontFamily:'monospace'}}>{mdLabel}</span>
      </label>
      <input type="range" min="1" max="365" step="1" value={doy}
        onChange={function(e){ setDoy(+e.target.value); }}
        className="w-full"
        style={{accentColor: C.sun}}
        data-testid="sun-compass-day"/>
      <p style={{fontSize:7, color: C.dim, marginTop:4, lineHeight:1.2}}>
        lat {lat.toFixed(2)}° · lon {lon.toFixed(2)}°
      </p>
      {/* Live weather diagnostic ribbon (option "C" from 2026-06-12
          design).  Renders only when (a) the compass is enabled, and
          (b) we have a live weather payload from /api/weather-current.
          Shows cloud%, wind speed+bearing, GHI, and the WMO icon -- all
          the things that actually modulate solar heating load and that
          the operator otherwise can't see from the geometric sun arc
          alone.  The same payload feeds the SunRayOverlay's cloud
          desaturation, so the visual and the numeric tell one story. */}
      {enabled && weatherNow && weatherNow.success && (
        <div
          data-testid="sun-compass-weather"
          style={{
            marginTop: 6, padding: '4px 6px', borderRadius: 4,
            background: C.chipBg, border: '1px solid ' + C.border,
            fontFamily: 'monospace', fontSize: 8, lineHeight: 1.35,
            color: C.text
          }}
          title={'Source: ' + (weatherNow.source || 'open-meteo') +
                 ' · cached for ' + (weatherNow.ttl_s || 300) + 's'}
        >
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <span>{window.red5WmoIcon ? window.red5WmoIcon(weatherNow.weather_code) : '·'} {weatherNow.weather_code != null ? (window.red5WmoLabel ? window.red5WmoLabel(weatherNow.weather_code) : 'WMO '+weatherNow.weather_code) : '—'}</span>
            <span style={{color: C.dim}}>{weatherNow.temperature_c != null ? weatherNow.temperature_c.toFixed(1) + '°C' : '—'}</span>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', marginTop:2}}>
            <span>☁ <strong style={{color:C.text}}>{weatherNow.cloud_cover != null ? Math.round(weatherNow.cloud_cover) + '%' : '—'}</strong></span>
            <span>💨 <strong style={{color:C.text}}>{weatherNow.wind_speed_kmh != null ? weatherNow.wind_speed_kmh.toFixed(1) : '—'}</strong> {(weatherNow.units && weatherNow.units.wind_speed_kmh) || 'km/h'} {weatherNow.wind_direction_deg != null ? (window.red5DegToCompass ? window.red5DegToCompass(weatherNow.wind_direction_deg) : Math.round(weatherNow.wind_direction_deg)+'°') : ''}</span>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', marginTop:2}}>
            <span>☀ GHI <strong style={{color:C.text}}>{weatherNow.ghi_wm2 != null ? Math.round(weatherNow.ghi_wm2) : '—'}</strong> W/m²</span>
            <span>{weatherNow.precipitation_mm != null && weatherNow.precipitation_mm > 0 ? '🌧 ' + weatherNow.precipitation_mm.toFixed(1) + ' mm' : ''}</span>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------- LIVE WEATHER FETCHER ---------------------------------- */
/* Single-flight, 5-min in-memory cache.  Multiple sun-path consumers
   (dashboard, equipment_mapper, sun_preview) share one fetch per
   (lat,lon).  Returns a Promise<weatherPayload> matching the
   /api/weather-current response contract.  The backend already
   caches 5 min upstream, so this is mainly to dedupe simultaneous
   page-mount fetches.                                                */
window.red5CurrentWeatherCache = window.red5CurrentWeatherCache || {};
window.red5FetchCurrentWeather = function(lat, lon){
  var key = (Math.round(lat*100)/100) + ',' + (Math.round(lon*100)/100);
  var hit = window.red5CurrentWeatherCache[key];
  var now = Date.now();
  if (hit && (now - hit.t) < 5 * 60 * 1000 && hit.p) {
    return Promise.resolve(hit.p);
  }
  if (hit && hit.inflight) return hit.inflight;
  /* Frontend API base may be exposed by the host page as
     window.API_BASE_URL (e.g. set by dashboard.html bootstrap).
     Fall back to same-origin so sun_preview.html (which does not
     bootstrap API_BASE_URL) still resolves to the local Flask. */
  var base = (typeof window !== 'undefined' && window.API_BASE_URL) || '';
  var url = base + '/api/weather-current?lat=' + encodeURIComponent(lat) + '&lon=' + encodeURIComponent(lon);
  var p = fetch(url, { credentials: 'include' })
    .then(function(r){ return r.json(); })
    .then(function(payload){
      window.red5CurrentWeatherCache[key] = { t: Date.now(), p: payload };
      return payload;
    })
    .catch(function(err){
      var fail = { success: false, error: String(err) };
      window.red5CurrentWeatherCache[key] = { t: Date.now(), p: fail };
      return fail;
    });
  window.red5CurrentWeatherCache[key] = { t: now, p: hit && hit.p, inflight: p };
  return p;
};

/* ---------- WMO WEATHER-CODE HELPERS ------------------------------ */
/* Minimal lookup tables -- icons are unicode glyphs so no asset
   loads, and labels are short enough to fit in the diagnostic
   ribbon.  WMO codes per
   https://open-meteo.com/en/docs#weathervariables -- we cluster
   into 9 visual buckets rather than render all 28 codes verbatim. */
window.red5WmoIcon = function(code){
  if (code == null) return '·';
  if (code === 0) return '☀';
  if (code <= 2) return '🌤';
  if (code === 3) return '☁';
  if (code === 45 || code === 48) return '🌫';
  if (code >= 51 && code <= 57) return '🌦';
  if (code >= 61 && code <= 67) return '🌧';
  if (code >= 71 && code <= 77) return '❄';
  if (code >= 80 && code <= 82) return '🌧';
  if (code >= 85 && code <= 86) return '❄';
  if (code >= 95) return '⛈';
  return '·';
};
window.red5WmoLabel = function(code){
  if (code == null) return '—';
  if (code === 0) return 'Clear';
  if (code <= 2) return 'Mostly clear';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Fog';
  if (code >= 51 && code <= 57) return 'Drizzle';
  if (code >= 61 && code <= 67) return 'Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Showers';
  if (code >= 85 && code <= 86) return 'Snow showers';
  if (code >= 95) return 'Thunderstorm';
  return 'WMO ' + code;
};

/* 16-point compass from a 0-360 bearing -- N, NNE, NE, ...  */
window.red5DegToCompass = function(deg){
  if (deg == null || isNaN(deg)) return '';
  var pts = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  var i = Math.round(((deg % 360 + 360) % 360) / 22.5) % 16;
  return pts[i];
};
