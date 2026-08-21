/* ------------------------------------------------------------------
 * blind-types.js — window covering kinds + how Open % maps to glass.
 *
 * Open % is always “how much daylight gets through”, not vane angle:
 *   0%   = sealed
 *   50%  = half the pane is clear (looks half-open)
 *   100% = almost all glass
 *
 * Motion:
 *   drop  — roller fabric lowers from the head
 *   lift  — horizontal slats stack up at the head (opening grows from sill)
 *   tilt  — slats/vanes stay in place and turn; gaps = Open %
 *   stack — vertical vanes draw to one side (curtain / traverse)
 * ------------------------------------------------------------------ */
(function (root) {
  var TYPES = [
    {
      id: 'roller',
      family: 'roller',
      motion: 'drop',
      label: 'Roller',
      short: 'Roller',
      hint: 'Fabric drops from the head. 50% open = top half covered, bottom half clear.'
    },
    {
      id: 'horizontal',
      family: 'horizontal',
      motion: 'lift',
      label: 'Horizontal — lift',
      short: 'H · lift',
      hint: 'Slats stack up at the head. 50% open = top half packed, bottom half clear.'
    },
    {
      id: 'horizontal-tilt',
      family: 'horizontal',
      motion: 'tilt',
      label: 'Horizontal — tilt',
      short: 'H · tilt',
      hint: 'Slats stay put and turn. 50% open = equal slat and gap (not a 45° vane).'
    },
    {
      id: 'vertical',
      family: 'vertical',
      motion: 'tilt',
      label: 'Vertical — tilt',
      short: 'V · tilt',
      hint: 'Vanes stay put and turn. 50% open = equal vane and gap across the whole pane.'
    },
    {
      id: 'vertical-stack',
      family: 'vertical',
      motion: 'stack',
      label: 'Vertical — stack',
      short: 'V · stack',
      hint: 'Vanes draw to one side like a curtain. 50% open = half the pane stacked, half clear.'
    }
  ];
  var BY_ID = {};
  for (var i = 0; i < TYPES.length; i++) BY_ID[TYPES[i].id] = TYPES[i];

  function normalizeBlindType(t) {
    var v = String(t == null ? 'roller' : t).toLowerCase().replace(/_/g, '-');
    if (v === 'horizontal-lift' || v === 'horizontal-stack' || v === 'venetian-lift') return 'horizontal';
    if (v === 'horizontal-tilt' || v === 'venetian' || v === 'venetian-tilt') return 'horizontal-tilt';
    if (v === 'vertical-tilt' || v === 'vertical-rotate' || v === 'vertical-turn') return 'vertical';
    if (v === 'vertical-stack' || v === 'vertical-draw' || v === 'vertical-traverse' || v === 'curtain') return 'vertical-stack';
    if (v === 'roller' || v === 'horizontal' || v === 'vertical') return v;
    return 'roller';
  }

  function blindSpec(t) {
    return BY_ID[normalizeBlindType(t)] || BY_ID.roller;
  }

  function clamp01(n) {
    n = Number(n);
    if (!isFinite(n)) return 0;
    if (n < 0) return 0;
    if (n > 1) return 1;
    return n;
  }

  /* Elevation (looking at the glass). Open % = clear-glass fraction. */
  function elevationRects(type, open, gx, gy, gw, gh) {
    var spec = blindSpec(type);
    var o = clamp01(open);
    var cover = 1 - o;
    var rects = [];
    var n, pitch, i, slat, band, cx, cy;
    if (o < 0.01) {
      rects.push({ x: gx, y: gy, width: gw, height: gh, opacity: 0.90 });
      return rects;
    }
    if (spec.motion === 'drop') {
      var drop = cover * gh;
      if (drop > 0.4) rects.push({ x: gx, y: gy, width: gw, height: drop, opacity: 0.88 });
      return rects;
    }
    if (spec.family === 'horizontal' && spec.motion === 'lift') {
      band = cover * gh;
      if (band < 0.45) return rects;
      n = 10;
      pitch = band / n;
      slat = Math.max(1.05, pitch * 0.78);
      for (i = 0; i < n; i++) {
        cy = gy + (i + 0.5) * pitch;
        rects.push({
          x: gx + 1, y: cy - slat / 2, width: gw - 2, height: slat,
          opacity: 0.52 + cover * 0.32
        });
      }
      return rects;
    }
    if (spec.family === 'horizontal' && spec.motion === 'tilt') {
      n = 10;
      pitch = gh / n;
      slat = Math.max(1.1, pitch * (0.10 + 0.86 * cover));
      for (i = 0; i < n; i++) {
        cy = gy + (i + 0.5) * pitch;
        rects.push({
          x: gx + 1, y: cy - slat / 2, width: gw - 2, height: slat,
          opacity: 0.38 + cover * 0.50
        });
      }
      return rects;
    }
    if (spec.family === 'vertical' && spec.motion === 'tilt') {
      n = Math.max(14, Math.round(gw / 5.5));
      pitch = gw / n;
      slat = Math.max(0.7, pitch * (0.08 + 0.58 * cover));
      for (i = 0; i < n; i++) {
        cx = gx + (i + 0.5) * pitch;
        rects.push({
          x: cx - slat / 2, y: gy + 1, width: slat, height: gh - 2,
          opacity: 0.38 + cover * 0.50
        });
      }
      return rects;
    }
    if (spec.family === 'vertical' && spec.motion === 'stack') {
      band = o > 0.97 ? Math.max(3.2, gw * 0.045) : cover * gw;
      if (band < 0.45) return rects;
      n = Math.max(14, Math.round(band / 4.5));
      pitch = band / n;
      slat = Math.max(0.7, pitch * 0.50);
      for (i = 0; i < n; i++) {
        cx = gx + (i + 0.5) * pitch;
        rects.push({
          x: cx - slat / 2, y: gy + 1, width: slat, height: gh - 2,
          opacity: 0.52 + cover * 0.32
        });
      }
      return rects;
    }
    return rects;
  }

  /* First traced edge is HEAD. Second axis is the JAMB (p0→last, or p1→p2),
     not a Euclidean perpendicular — isometric glass is a parallelogram, so
     vertical vanes must run along the jambs or they look slanted. */
  function headSillAxes(verts) {
    if (!verts || verts.length < 2) return null;
    var pts = [], i;
    for (i = 0; i < verts.length; i++) {
      var px = Number(verts[i][0]), py = Number(verts[i][1]);
      if (!isFinite(px) || !isFinite(py)) continue;
      pts.push([px, py]);
    }
    if (pts.length < 2) return null;
    var p0 = pts[0], p1 = pts[1];
    var headX = p1[0] - p0[0], headY = p1[1] - p0[1];
    var headLen = Math.hypot(headX, headY) || 1;
    var hx = headX / headLen, hy = headY / headLen;
    var jambX = pts[pts.length - 1][0] - p0[0];
    var jambY = pts[pts.length - 1][1] - p0[1];
    var jambLen = Math.hypot(jambX, jambY);
    if (jambLen < 0.4 || Math.abs(jambX * hx + jambY * hy) / (jambLen || 1) > 0.92) {
      if (pts.length >= 3) {
        jambX = pts[2][0] - p1[0];
        jambY = pts[2][1] - p1[1];
        jambLen = Math.hypot(jambX, jambY) || 1;
      }
    }
    if (!(jambLen > 0.2)) {
      jambX = -hy * Math.max(2, headLen * 0.28);
      jambY = hx * Math.max(2, headLen * 0.28);
      jambLen = Math.hypot(jambX, jambY) || 1;
    }
    function uv(x, y) {
      var dx = x - p0[0], dy = y - p0[1];
      var d = headX * jambY - headY * jambX;
      if (Math.abs(d) < 1e-8) return [0, 0];
      return [(dx * jambY - dy * jambX) / d, (headX * dy - headY * dx) / d];
    }
    var cx = 0, cy = 0;
    for (i = 0; i < pts.length; i++) { cx += pts[i][0]; cy += pts[i][1]; }
    cx /= pts.length; cy /= pts.length;
    if (uv(cx, cy)[1] < 0) { jambX = -jambX; jambY = -jambY; }
    var uMin = Infinity, uMax = -Infinity, vMin = Infinity, vMax = -Infinity;
    for (i = 0; i < pts.length; i++) {
      var t = uv(pts[i][0], pts[i][1]);
      if (t[0] < uMin) uMin = t[0]; if (t[0] > uMax) uMax = t[0];
      if (t[1] < vMin) vMin = t[1]; if (t[1] > vMax) vMax = t[1];
    }
    if (!(uMax > uMin)) { uMin = 0; uMax = 1; }
    if (!(vMax > vMin)) { vMin = 0; vMax = 1; }
    var sMin = uMin * headLen, sMax = uMax * headLen;
    var hMax = 0;
    var hMin = -(vMax - vMin) * jambLen;
    var jx = jambX / (jambLen || 1), jy = jambY / (jambLen || 1);
    function atSH(s, h) {
      var u = s / headLen;
      var v = vMin + (hMax - h) / (jambLen || 1);
      return [p0[0] + u * headX + v * jambX, p0[1] + u * headY + v * jambY];
    }
    var xs = pts.map(function (p) { return p[0]; });
    var ys = pts.map(function (p) { return p[1]; });
    return {
      sMin: sMin, sMax: sMax, hMin: hMin, hMax: hMax,
      sSpan: Math.max(0.2, sMax - sMin),
      hSpan: Math.max(0.2, hMax - hMin),
      sx: hx, sy: hy, hx: jx, hy: jy,
      atSH: atSH,
      minX: Math.min.apply(null, xs), maxX: Math.max.apply(null, xs),
      minY: Math.min.apply(null, ys), maxY: Math.max.apply(null, ys)
    };
  }

  /* Shrink a head–sill frame to the still-open glass (plan %). */
  function openGlassFrame(fr, type, open) {
    if (!fr) return null;
    var spec = blindSpec(type);
    var o = clamp01(open);
    if (o < 0.01) return null;
    var out = {
      sx: fr.sx, sy: fr.sy, hx: fr.hx, hy: fr.hy,
      sMin: fr.sMin, sMax: fr.sMax, hMin: fr.hMin, hMax: fr.hMax,
      atSH: fr.atSH
    };
    if (spec.motion === 'tilt') return out;
    var sSpan = Math.max(0.2, fr.sMax - fr.sMin);
    var hSpan = Math.max(0.2, fr.hMax - fr.hMin);
    if (spec.motion === 'drop' || spec.motion === 'lift') {
      out.hMax = fr.hMin + o * hSpan;
    } else if (spec.motion === 'stack') {
      out.sMin = fr.sMax - o * sSpan;
    }
    return out;
  }

  root.RED5_BLIND_TYPES = TYPES;
  root.red5NormalizeBlindType = normalizeBlindType;
  root.red5BlindSpec = blindSpec;
  root.red5BlindElevationRects = elevationRects;
  root.red5HeadSillAxes = headSillAxes;
  root.red5OpenGlassFrame = openGlassFrame;
})(typeof window !== 'undefined' ? window : this);
