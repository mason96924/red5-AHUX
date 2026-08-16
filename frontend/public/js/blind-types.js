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
      n = 10;
      pitch = gw / n;
      slat = Math.max(1.1, pitch * (0.10 + 0.86 * cover));
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
      n = 10;
      pitch = band / n;
      slat = Math.max(1.05, pitch * 0.72);
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

  /* Shrink a head–sill frame to the still-open glass (plan %). */
  function openGlassFrame(fr, type, open) {
    if (!fr) return null;
    var spec = blindSpec(type);
    var o = clamp01(open);
    if (o < 0.01) return null;
    var out = {
      sx: fr.sx, sy: fr.sy, hx: fr.hx, hy: fr.hy,
      sMin: fr.sMin, sMax: fr.sMax, hMin: fr.hMin, hMax: fr.hMax
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
  root.red5OpenGlassFrame = openGlassFrame;
})(typeof window !== 'undefined' ? window : this);
