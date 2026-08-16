// =====================================================================
// ELC Sun Path on floor image  (ported from red5-elc floor.html)
// =====================================================================
// Draws the Marsh-style sky-dome (year mesh + analemmas + live sun)
// ON the floor-plan image — not a floating compass dial.
// Exposed as window.ElcSunPathOnFloor (React) and window.red5PaintElcSunPath.
// =====================================================================
(function (global) {
  'use strict';

  function dayOfYearYmd(y, mo, da) {
    return Math.round((Date.UTC(y, mo, da) - Date.UTC(y, 0, 1)) / 86400000) + 1;
  }
  function dayOfYear(d) {
    return dayOfYearYmd(d.getFullYear(), d.getMonth(), d.getDate());
  }
  function ianaClockParts(date, tz) {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: tz,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hourCycle: 'h23',
    });
    const parts = fmt.formatToParts(date);
    const get = function (t) {
      const p = parts.find(function (x) { return x.type === t; });
      return p ? Number(p.value) : 0;
    };
    const y = get('year'), mo = get('month') - 1, da = get('day');
    const h = get('hour'), mi = get('minute'), se = get('second');
    return { y: y, mo: mo, da: da, h: h, mi: mi, se: se, doy: dayOfYearYmd(y, mo, da) };
  }

  function clockParts(date, timezone) {
    const d = (date instanceof Date) ? date : new Date(date);
    if (Number.isNaN(d.getTime())) {
      const now = new Date();
      return { y: now.getFullYear(), mo: now.getMonth(), da: now.getDate(),
        h: now.getHours(), mi: now.getMinutes(), se: now.getSeconds(), doy: dayOfYear(now) };
    }
    const tz = timezone && String(timezone).trim();
    if (tz && tz !== 'auto') {
      try { return ianaClockParts(d, tz); } catch (_) {}
    }
    return { y: d.getFullYear(), mo: d.getMonth(), da: d.getDate(),
      h: d.getHours(), mi: d.getMinutes(), se: d.getSeconds(), doy: dayOfYear(d) };
  }

  function siteTzOffsetHours(date, timezone, lonDeg) {
    const d = (date instanceof Date) ? date : new Date();
    const tz = timezone && String(timezone).trim();
    if (tz && tz !== 'auto') {
      try {
        const p = ianaClockParts(d, tz);
        return (Date.UTC(p.y, p.mo, p.da, p.h, p.mi, p.se) - d.getTime()) / 3600000;
      } catch (_) {}
    }
    const lon = Number(lonDeg);
    if (Number.isFinite(lon) && lon !== 0) return lon / 15;
    return -d.getTimezoneOffset() / 60;
  }

  function solarAltAz(latRad, doy, hour, lonDeg, tzHours) {
    const lon = Number(lonDeg) || 0;
    let tz = tzHours;
    if (tz == null || !Number.isFinite(tz)) tz = siteTzOffsetHours(new Date(), null, lon);
    const gamma = (2 * Math.PI / 365) * (doy - 1 + (hour - 12) / 24);
    const eqtime = 229.18 * (
      0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma)
      - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma)
    );
    const dec = (
      0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma)
      - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma)
      - 0.002697 * Math.cos(3 * gamma) + 0.00148 * Math.sin(3 * gamma)
    );
    const offMin = lon !== 0 ? eqtime + 4 * lon - 60 * tz : eqtime;
    const ha = ((hour * 60 + offMin) / 4 - 180) * Math.PI / 180;
    const sinEl = Math.sin(latRad) * Math.sin(dec)
      + Math.cos(latRad) * Math.cos(dec) * Math.cos(ha);
    const el = Math.asin(Math.max(-1, Math.min(1, sinEl)));
    const y = Math.sin(dec) * Math.cos(latRad)
      - Math.cos(dec) * Math.sin(latRad) * Math.cos(ha);
    const x = -Math.cos(dec) * Math.sin(ha);
    let az = Math.atan2(x, y);
    if (az < 0) az += 2 * Math.PI;
    return { el, az };
  }

  function horizonDipDeg(elevationM) {
    const h = Number(elevationM);
    if (!Number.isFinite(h) || h <= 0) return 0;
    const clamped = Math.min(h, 9000);
    const R = 6371000;
    return Math.acos(R / (R + clamped)) * 180 / Math.PI;
  }

  function civilHourNow(date, timezone, lonDeg) {
    const d = (date instanceof Date) ? date : new Date();
    const tz = timezone && String(timezone).trim();
    if (tz && tz !== 'auto') {
      try {
        const p = ianaClockParts(d, tz);
        return p.h + p.mi / 60 + p.se / 3600;
      } catch (_) {}
    }
    const off = siteTzOffsetHours(d, timezone, lonDeg);
    if (Number.isFinite(Number(lonDeg)) && Number(lonDeg) !== 0) {
      const u = new Date(d.getTime() + off * 3600000);
      return u.getUTCHours() + u.getUTCMinutes() / 60 + u.getUTCSeconds() / 3600;
    }
    return d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600;
  }

  function civilDoyNow(date, timezone, lonDeg) {
    const d = (date instanceof Date) ? date : new Date();
    const tz = timezone && String(timezone).trim();
    if (tz && tz !== 'auto') {
      try { return ianaClockParts(d, tz).doy; } catch (_) {}
    }
    const off = siteTzOffsetHours(d, timezone, lonDeg);
    if (Number.isFinite(Number(lonDeg)) && Number(lonDeg) !== 0) {
      const u = new Date(d.getTime() + off * 3600000);
      return dayOfYearYmd(u.getUTCFullYear(), u.getUTCMonth(), u.getUTCDate());
    }
    return dayOfYear(d);
  }

  function sunAtCivilTod(latDeg, lonDeg, doy, hour, elevationM, timezone) {
    const tzHours = siteTzOffsetHours(new Date(), timezone, lonDeg);
    const p = solarAltAz((Number(latDeg) || 0) * Math.PI / 180, Number(doy) || 1, Number(hour) || 0, lonDeg, tzHours);
    const elDeg = (p.el * 180 / Math.PI) + horizonDipDeg(elevationM);
    return {
      azimuth: p.az * 180 / Math.PI,
      elevation: elDeg,
      is_day: elDeg > 0
    };
  }

  function solarAltAzAt(latDeg, lonDeg, date) {
    const jd = date.getTime() / 86400000 + 2440587.5;
    const n = jd - 2451545.0;
    let L = (280.460 + 0.9856474 * n) % 360;
    if (L < 0) L += 360;
    const g = ((357.528 + 0.9856003 * n) % 360) * Math.PI / 180;
    const lam = (L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * Math.PI / 180;
    const eps = (23.439 - 0.0000004 * n) * Math.PI / 180;
    const ra = Math.atan2(Math.cos(eps) * Math.sin(lam), Math.cos(lam));
    const dec = Math.asin(Math.sin(eps) * Math.sin(lam));
    let gmst = (18.697374558 + 24.06570982441908 * n) % 24;
    if (gmst < 0) gmst += 24;
    let lst = (gmst + lonDeg / 15) % 24;
    if (lst < 0) lst += 24;
    const ha = lst * 15 * Math.PI / 180 - ra;
    const lat = latDeg * Math.PI / 180;
    const sinEl = Math.sin(lat) * Math.sin(dec)
      + Math.cos(lat) * Math.cos(dec) * Math.cos(ha);
    const el = Math.asin(Math.max(-1, Math.min(1, sinEl)));
    const y = Math.sin(dec) * Math.cos(lat)
      - Math.cos(dec) * Math.sin(lat) * Math.cos(ha);
    const x = -Math.cos(dec) * Math.sin(ha);
    let az = Math.atan2(x, y);
    if (az < 0) az += 2 * Math.PI;
    return { el, az };
  }

  function markerXY(p) {
    if (!p || typeof p !== 'object') return null;
    const x = (p.x != null && p.x !== '') ? Number(p.x)
      : (p.x_m != null ? Number(p.x_m) : NaN);
    const y = (p.y != null && p.y !== '') ? Number(p.y)
      : (p.y_m != null ? Number(p.y_m) : NaN);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
    return { x: x, y: y };
  }

  function orientationUnit(a, b, W, H) {
    const pa = markerXY(a), pb = markerXY(b);
    if (!pa || !pb) return null;
    const w = (W > 0) ? W : 100;
    const h = (H > 0) ? H : 100;
    const dx = (pb.x - pa.x) / 100 * w;
    const dy = (pb.y - pa.y) / 100 * h;
    const len = Math.hypot(dx, dy);
    if (len < 1e-6) return null;
    return [dx / len, dy / len];
  }

  function planRoseAxes(orientation, northOffsetDeg, W, H) {
    const o = orientation || {};
    let ns = orientationUnit(o.south, o.north, W, H);
    let we = orientationUnit(o.west, o.east, W, H);
    if (ns || we) {
      if (!ns && we) ns = [we[1], -we[0]];
      if (!we && ns) we = [-ns[1], ns[0]];
      return { nx: ns[0], ny: ns[1], ex: we[0], ey: we[1] };
    }
    const rad = (Number(northOffsetDeg) || 0) * Math.PI / 180;
    const nx = Math.sin(rad);
    const ny = -Math.cos(rad);
    return { nx: nx, ny: ny, ex: -ny, ey: nx };
  }

  function lineIntersect(a, b, c, d) {
    const pa = markerXY(a), pb = markerXY(b), pc = markerXY(c), pd = markerXY(d);
    if (!pa || !pb || !pc || !pd) return null;
    const rx = pb.x - pa.x;
    const ry = pb.y - pa.y;
    const sx = pd.x - pc.x;
    const sy = pd.y - pc.y;
    const den = rx * sy - ry * sx;
    if (Math.abs(den) < 1e-9) return null;
    const t = ((pc.x - pa.x) * sy - (pc.y - pa.y) * sx) / den;
    return { x: pa.x + t * rx, y: pa.y + t * ry };
  }

  const ephCache = { key: '', data: null };
  const layerCache = { key: '', canvas: null };

  function ensureEph(latDeg, lonDeg, tzHours) {
    const tzKey = Number.isFinite(tzHours) ? tzHours.toFixed(4) : 'auto';
    const key = Number(latDeg).toFixed(4) + '|' + Number(lonDeg).toFixed(4) + '|' + tzKey;
    if (ephCache.data && ephCache.key === key) return ephCache.data;
    const lat = latDeg * Math.PI / 180;
    const sph = function (az, el) {
      const ce = Math.cos(el), se = Math.sin(el);
      return { e: Math.sin(az) * ce, n: Math.cos(az) * ce, u: se };
    };
    const days = [];
    for (let d = 1; d <= 365; d += 5) days.push(d);
    const hours = [];
    for (let h = 4; h <= 21.001; h += 0.2) hours.push(h);
    const grid = days.map(function (d) {
      return hours.map(function (h) {
        const p = solarAltAz(lat, d, h, lonDeg, tzHours);
        return { s: sph(p.az, p.el > 0 ? p.el : 0), up: p.el > 0 };
      });
    });
    function sampleDay(day, stepMin) {
      const pts = [];
      for (let m = 0; m <= 1440; m += stepMin) pts.push(solarAltAz(lat, day, m / 60, lonDeg, tzHours));
      return pts;
    }
    const monthDoys = [21, 52, 80, 111, 141, 172, 202, 233, 264, 294, 325, 355];
    const monthSamples = monthDoys.map(function (d) { return { d: d, pts: sampleDay(d, 8) }; });
    const analemmas = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map(function (hr) {
      const pts = [];
      for (let d = 1; d <= 367; d += 2) pts.push(solarAltAz(lat, ((d - 1) % 365) + 1, hr, lonDeg, tzHours));
      return { hr: hr, pts: pts };
    });
    ephCache.key = key;
    ephCache.data = {
      key: key, lat: lat, latDeg: latDeg, lonDeg: lonDeg,
      days: days, hours: hours, grid: grid, monthSamples: monthSamples, analemmas: analemmas,
      summerDoy: latDeg >= 0 ? 172 : 355,
      winterDoy: latDeg >= 0 ? 355 : 172,
      today: null
    };
    return ephCache.data;
  }

  function withCardinalFrame(ctx, x, y, nUx, nUy, eUx, eUy, paintFn) {
    let nx = Number.isFinite(nUx) ? nUx : 0;
    let ny = Number.isFinite(nUy) ? nUy : -1;
    let ex = Number.isFinite(eUx) ? eUx : 1;
    let ey = Number.isFinite(eUy) ? eUy : 0;
    const nl = Math.hypot(nx, ny) || 1;
    const el = Math.hypot(ex, ey) || 1;
    nx /= nl; ny /= nl; ex /= el; ey /= el;
    ctx.save();
    ctx.translate(x, y);
    ctx.transform(ex, ey, -nx, -ny, 0, 0);
    paintFn(ctx);
    ctx.restore();
  }

  function strokeRaisedGlyph(ctx, sz, color, strokeFn) {
    const lw = Math.max(2.6, sz * 0.118);
    const steps = 3;
    const ox = sz * 0.038;
    const oy = sz * 0.048;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';
    ctx.miterLimit = 2.5;
    for (let i = steps; i >= 1; i--) {
      const u = i / steps;
      ctx.save();
      ctx.translate(ox * u, oy * u);
      ctx.strokeStyle = 'rgba(11,18,32,' + (0.28 + 0.22 * u).toFixed(3) + ')';
      ctx.lineWidth = lw;
      strokeFn(ctx);
      ctx.restore();
    }
    ctx.strokeStyle = '#0b1220';
    ctx.lineWidth = lw + 2.4;
    strokeFn(ctx);
    ctx.strokeStyle = color;
    ctx.lineWidth = lw;
    strokeFn(ctx);
  }

  function pathCardinalS(ctx, sz) {
    const h = sz * 0.78;
    ctx.beginPath();
    ctx.moveTo(0.40 * h, -0.72 * h);
    ctx.bezierCurveTo(-0.55 * h, -0.98 * h, -0.58 * h, -0.08 * h, 0.02 * h, 0.02 * h);
    ctx.bezierCurveTo(0.58 * h, 0.12 * h, 0.55 * h, 0.98 * h, -0.40 * h, 0.72 * h);
    ctx.stroke();
  }
  function pathCardinalW(ctx, sz) {
    const h = sz * 0.78;
    ctx.beginPath();
    ctx.moveTo(-0.58 * h, -0.72 * h);
    ctx.lineTo(-0.30 * h, 0.72 * h);
    ctx.lineTo(0.00 * h, -0.22 * h);
    ctx.lineTo(0.30 * h, 0.72 * h);
    ctx.lineTo(0.58 * h, -0.72 * h);
    ctx.stroke();
  }
  function pathCardinalE(ctx, sz) {
    const h = sz * 0.78;
    ctx.beginPath();
    ctx.moveTo(0.42 * h, -0.72 * h);
    ctx.lineTo(-0.42 * h, -0.72 * h);
    ctx.lineTo(-0.42 * h, 0.72 * h);
    ctx.lineTo(0.42 * h, 0.72 * h);
    ctx.moveTo(-0.42 * h, 0.00 * h);
    ctx.lineTo(0.30 * h, 0.00 * h);
    ctx.stroke();
  }
  function strokeNorthFour(ctx, sz) {
    const h = sz;
    ctx.beginPath();
    ctx.moveTo(0, -0.86 * h);
    ctx.lineTo(0, 0.78 * h);
    ctx.moveTo(-0.58 * h, -0.02 * h);
    ctx.lineTo(0.42 * h, -0.02 * h);
    ctx.moveTo(0, -0.86 * h);
    ctx.lineTo(-0.58 * h, -0.02 * h);
    ctx.lineTo(0, -0.02 * h);
    ctx.closePath();
    ctx.stroke();
  }

  function paintCardinalLetter(ctx, x, y, letter, nUx, nUy, eUx, eUy, size, color) {
    const sz = size || 28;
    const strokeFn = letter === 'S' ? pathCardinalS
      : letter === 'W' ? pathCardinalW
      : letter === 'E' ? pathCardinalE
      : null;
    if (!strokeFn) return;
    withCardinalFrame(ctx, x, y, nUx, nUy, eUx, eUy, function (c) {
      strokeRaisedGlyph(c, sz, color, function (cc) { strokeFn(cc, sz); });
    });
  }

  function paintNorthArrow(ctx, x, y, nUx, nUy, eUx, eUy, size) {
    const sz = size || 32;
    withCardinalFrame(ctx, x, y, nUx, nUy, eUx, eUy, function (c) {
      strokeRaisedGlyph(c, sz, '#38bdf8', function (cc) { strokeNorthFour(cc, sz); });
    });
  }

  function drawYearMesh(ctx, project, skyTo, ground, toCam, eph, cx, cy) {
    ctx.beginPath();
    for (let d = 0; d <= 360; d += 3) {
      const q = ground(d * Math.PI / 180);
      if (d === 0) ctx.moveTo(q.x, q.y); else ctx.lineTo(q.x, q.y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(70, 150, 210, 0.16)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(96, 185, 240, 0.82)';
    ctx.lineWidth = 2.0;
    ctx.stroke();

    ctx.setLineDash([3, 4]);
    [30, 60].forEach(function (elDeg) {
      ctx.beginPath();
      for (let d = 0; d <= 360; d += 4) {
        const q = skyTo(d * Math.PI / 180, elDeg * Math.PI / 180);
        if (d === 0) ctx.moveTo(q.x, q.y); else ctx.lineTo(q.x, q.y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(150,200,230,0.28)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    ctx.setLineDash([]);

    const nEnd = ground(0);
    const sEnd = ground(Math.PI);
    const eEnd = ground(Math.PI / 2);
    const wEnd = ground(3 * Math.PI / 2);
    ctx.setLineDash([5, 6]);
    ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.moveTo(nEnd.x, nEnd.y); ctx.lineTo(sEnd.x, sEnd.y);
    ctx.strokeStyle = 'rgba(125,211,252,0.55)'; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(wEnd.x, wEnd.y); ctx.lineTo(eEnd.x, eEnd.y);
    ctx.strokeStyle = 'rgba(245,162,91,0.55)'; ctx.stroke();
    ctx.setLineDash([]);
    function rimTick(outer, color) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(outer.x, outer.y);
      ctx.lineTo(cx + (outer.x - cx) * 0.86, cy + (outer.y - cy) * 0.86);
      ctx.stroke();
    }
    rimTick(nEnd, 'rgba(125,211,252,0.85)');
    rimTick(sEnd, 'rgba(125,211,252,0.85)');
    rimTick(eEnd, 'rgba(245,162,91,0.85)');
    rimTick(wEnd, 'rgba(245,162,91,0.85)');

    const days = eph.days, hours = eph.hours, grid = eph.grid;
    const patches = [];
    const nD = days.length, nH = hours.length;
    for (let di = 0; di < nD; di++) {
      const dj = (di + 1) % nD;
      for (let hi = 0; hi < nH - 1; hi++) {
        const a = grid[di][hi], b = grid[di][hi + 1];
        const c = grid[dj][hi + 1], d = grid[dj][hi];
        if (!a.up && !b.up && !c.up && !d.up) continue;
        const sa = a.s, sb = b.s, sc = c.s, sd = d.s;
        const me = (sa.e + sb.e + sc.e + sd.e) / 4;
        const mn = (sa.n + sb.n + sc.n + sd.n) / 4;
        const mu = (sa.u + sb.u + sc.u + sd.u) / 4;
        patches.push({
          pts: [sa, sb, sc, sd],
          ndot: me * toCam.e + mn * toCam.n + mu * toCam.u,
          depth: me * toCam.e + mn * toCam.n + mu * toCam.u
        });
      }
    }
    patches.sort(function (p, q) { return p.depth - q.depth; });
    patches.forEach(function (p) {
      const q = p.pts.map(project);
      const back = p.ndot < 0;
      const a = back ? 0.05 + 0.08 * Math.min(1, -p.ndot) : 0.13 + 0.26 * Math.min(1, p.ndot);
      ctx.beginPath();
      ctx.moveTo(q[0].x, q[0].y);
      ctx.lineTo(q[1].x, q[1].y);
      ctx.lineTo(q[2].x, q[2].y);
      ctx.lineTo(q[3].x, q[3].y);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 214, 90, ' + a.toFixed(3) + ')';
      ctx.fill();
    });

    function strokeDay(pts, color, width) {
      ctx.beginPath();
      let started = false;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        if (p.el <= 0) { started = false; continue; }
        const q = skyTo(p.az, p.el);
        if (!started) { ctx.moveTo(q.x, q.y); started = true; }
        else ctx.lineTo(q.x, q.y);
      }
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineJoin = 'round';
      ctx.stroke();
    }
    eph.monthSamples.forEach(function (ms) {
      const isEdge = (ms.d === eph.summerDoy || ms.d === eph.winterDoy);
      strokeDay(ms.pts,
        isEdge ? 'rgba(255,176,32,0.95)' : 'rgba(255,196,80,0.40)',
        isEdge ? 2.0 : 0.85);
    });

    ctx.save();
    ctx.setLineDash([1.4, 4.2]);
    ctx.lineCap = 'round';
    eph.analemmas.forEach(function (an) {
      ctx.beginPath();
      let started = false;
      for (let i = 0; i < an.pts.length; i++) {
        const p = an.pts[i];
        if (p.el <= 0) { started = false; continue; }
        const q = skyTo(p.az, p.el);
        if (!started) { ctx.moveTo(q.x, q.y); started = true; }
        else ctx.lineTo(q.x, q.y);
      }
      ctx.strokeStyle = (an.hr % 3 === 0) ? 'rgba(200, 55, 48, 0.88)' : 'rgba(200, 55, 48, 0.58)';
      ctx.lineWidth = (an.hr % 3 === 0) ? 1.45 : 1.05;
      ctx.lineJoin = 'round';
      ctx.stroke();
    });
    ctx.restore();
  }

  function paintElcSunPath(ctx, opts) {
    if (!ctx || !opts) return null;
    const W = opts.width, H = opts.height;
    if (!(W > 8 && H > 8)) return null;
    const latDeg = Number(opts.lat);
    const lonDeg = Number(opts.lon);
    if (!Number.isFinite(latDeg) || !Number.isFinite(lonDeg)) return null;
    const rose = planRoseAxes(opts.orientation, opts.northOffsetDeg, W, H);
    const nx = rose.nx, ny = rose.ny, ex = rose.ex, ey = rose.ey;
    let cx = W / 2, cy = H / 2;
    const o = opts.orientation || {};
    if (o.north && o.south && o.west && o.east) {
      const hit = lineIntersect(o.south, o.north, o.west, o.east);
      if (hit) {
        cx = (hit.x / 100) * W;
        cy = (hit.y / 100) * H;
      }
    }
    const adj = opts.adj || { size: 1, rot: 0, look: 0, tilt: 0 };
    const R = Math.min(W, H) * 0.32 * (adj.size || 1);
    if (!(R > 8)) return null;

    const clock = opts.date instanceof Date ? opts.date : new Date();
    const tzHours = siteTzOffsetHours(clock, opts.timezone, lonDeg);
    const doy = (opts.doy != null) ? Number(opts.doy) : civilDoyNow(clock, opts.timezone, lonDeg);
    const hour = (opts.hour != null) ? Number(opts.hour) : civilHourNow(clock, opts.timezone, lonDeg);

    const lat = latDeg * Math.PI / 180;
    function sph(az, el) {
      const ce = Math.cos(el), se = Math.sin(el);
      return { e: Math.sin(az) * ce, n: Math.cos(az) * ce, u: se };
    }
    const tiltRad = (-5 + (adj.tilt || 0)) * Math.PI / 180;
    const ct = Math.cos(tiltRad), st = Math.sin(tiltRad);
    function tiltPt(p) {
      return { e: p.e * ct - p.u * st, n: p.n, u: p.e * st + p.u * ct };
    }
    const camEl = (35 + (adj.look || 0)) * Math.PI / 180;
    const camAz = (137 + (adj.rot || 0)) * Math.PI / 180;
    const eyeE = Math.sin(camAz) * Math.cos(camEl);
    const eyeN = Math.cos(camAz) * Math.cos(camEl);
    const eyeU = Math.sin(camEl);
    const zlen = Math.hypot(eyeE, eyeN, eyeU) || 1;
    const ze = eyeE / zlen, zn = eyeN / zlen, zu = eyeU / zlen;
    let xe = -zn, xn = ze, xu = 0;
    const xlen = Math.hypot(xe, xn) || 1;
    xe /= xlen; xn /= xlen;
    const ye = zn * xu - zu * xn;
    const yn = zu * xe - ze * xu;
    const yu = ze * xn - zn * xe;
    const toCam = { e: ze, n: zn, u: zu };
    function lookAt(p) {
      return {
        sx: p.e * xe + p.n * xn + p.u * xu,
        sy: p.e * ye + p.n * yn + p.u * yu,
        depth: p.e * ze + p.n * zn + p.u * zu
      };
    }
    const nCam = lookAt(tiltPt(sph(0, 0)));
    const angN = Math.atan2(-nCam.sy, nCam.sx);
    const angFloorN = Math.atan2(ny, nx);
    const rot2 = angFloorN - angN;
    const cr = Math.cos(rot2), sr = Math.sin(rot2);
    function project(p) {
      const c = lookAt(tiltPt(p));
      const vx = c.sx, vy = -c.sy;
      return {
        x: cx + (vx * cr - vy * sr) * R,
        y: cy + (vx * sr + vy * cr) * R,
        depth: c.depth
      };
    }
    function skyTo(az, el) { return project(sph(az, el)); }
    function ground(az) { return skyTo(az, 0); }

    const eph = ensureEph(latDeg, lonDeg, tzHours);
    const dpr = opts.dpr || 1;
    const layerKey = [
      eph.key,
      (adj.size || 1).toFixed(3), (adj.rot || 0).toFixed(2),
      (adj.look || 0).toFixed(2), (adj.tilt || 0).toFixed(2),
      R.toFixed(2), cx.toFixed(1), cy.toFixed(1),
      nx.toFixed(4), ny.toFixed(4), ex.toFixed(4), ey.toFixed(4),
      Math.round(W), Math.round(H), Number(dpr).toFixed(2)
    ].join('|');
    if (!layerCache.canvas || layerCache.key !== layerKey) {
      const off = layerCache.canvas || document.createElement('canvas');
      const wPx = Math.max(1, Math.floor(W * dpr));
      const hPx = Math.max(1, Math.floor(H * dpr));
      if (off.width !== wPx) off.width = wPx;
      if (off.height !== hPx) off.height = hPx;
      const octx = off.getContext('2d');
      octx.setTransform(dpr, 0, 0, dpr, 0, 0);
      octx.clearRect(0, 0, W, H);
      drawYearMesh(octx, project, skyTo, ground, toCam, eph, cx, cy);
      layerCache.key = layerKey;
      layerCache.canvas = off;
    }
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(layerCache.canvas, 0, 0);
    ctx.restore();

    function strokeDay(pts, color, width) {
      ctx.beginPath();
      let started = false;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        if (p.el <= 0) { started = false; continue; }
        const q = skyTo(p.az, p.el);
        if (!started) { ctx.moveTo(q.x, q.y); started = true; }
        else ctx.lineTo(q.x, q.y);
      }
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineJoin = 'round';
      ctx.stroke();
    }
    if (!eph.today || eph.today.doy !== doy || eph.today.tz !== tzHours) {
      const pts = [];
      for (let m = 0; m <= 1440; m += 5) pts.push(solarAltAz(eph.lat, doy, m / 60, lonDeg, tzHours));
      eph.today = { doy: doy, tz: tzHours, pts: pts };
    }
    strokeDay(eph.today.pts, 'rgba(220, 40, 32, 0.95)', 2.0);

    [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].forEach(function (hr) {
      const p = solarAltAz(lat, doy, hr, lonDeg, tzHours);
      if (p.el <= 0) return;
      const q = skyTo(p.az, p.el);
      ctx.beginPath(); ctx.arc(q.x, q.y, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(220, 40, 32, 0.95)'; ctx.fill();
      ctx.font = 'bold 12px ui-sans-serif, system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.strokeText(String(hr).padStart(2, '0'), q.x, q.y - 4);
      ctx.fillStyle = 'rgba(220, 40, 32, 0.95)';
      ctx.fillText(String(hr).padStart(2, '0'), q.x, q.y - 4);
    });

    if (opts.showCardinals !== false) {
      const nP = markerXY(o.north);
      const sP = markerXY(o.south);
      const wP = markerXY(o.west);
      const eP = markerXY(o.east);
      const glyph = Math.max(22, Math.min(40, R * 0.12));
      if (sP) paintCardinalLetter(ctx, (sP.x / 100) * W, (sP.y / 100) * H, 'S', nx, ny, ex, ey, glyph, '#f472b6');
      if (wP) paintCardinalLetter(ctx, (wP.x / 100) * W, (wP.y / 100) * H, 'W', nx, ny, ex, ey, glyph, '#fbbf24');
      if (eP) paintCardinalLetter(ctx, (eP.x / 100) * W, (eP.y / 100) * H, 'E', nx, ny, ex, ey, glyph, '#34d399');
      if (nP) paintNorthArrow(ctx, (nP.x / 100) * W, (nP.y / 100) * H, nx, ny, ex, ey, glyph * (32 / 28));
    }

    const todSun = sunAtCivilTod(latDeg, lonDeg, doy, hour, opts.elevation_m, opts.timezone);
    const liveEl = (opts.sun && Number.isFinite(opts.sun.elevation))
      ? opts.sun.elevation * Math.PI / 180 : (todSun.elevation * Math.PI / 180);
    const liveAz = (opts.sun && Number.isFinite(opts.sun.azimuth))
      ? opts.sun.azimuth * Math.PI / 180 : (todSun.azimuth * Math.PI / 180);
    if (liveEl > 0) {
      const sun = skyTo(liveAz, liveEl);
      const g = ctx.createRadialGradient(sun.x, sun.y, 0, sun.x, sun.y, 18);
      g.addColorStop(0, 'rgba(255,230,120,0.95)');
      g.addColorStop(1, 'rgba(255,200,60,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(sun.x, sun.y, 18, 0, Math.PI * 2); ctx.fill();
      const adx = sun.x - cx, ady = sun.y - cy;
      const alen = Math.hypot(adx, ady);
      if (alen > 6) {
        const ux = adx / alen, uy = ady / alen;
        const headLen = Math.min(13, alen * 0.16);
        const headW = headLen * 0.42;
        const bx = sun.x - ux * headLen, by = sun.y - uy * headLen;
        const px = -uy, py = ux;
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(bx, by);
        ctx.strokeStyle = 'rgba(72, 32, 6, 0.88)';
        ctx.lineWidth = 3.6;
        ctx.stroke();
        ctx.strokeStyle = '#ff9a1a';
        ctx.lineWidth = 2.1;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(sun.x, sun.y);
        ctx.lineTo(bx + px * headW, by + py * headW);
        ctx.lineTo(bx - px * headW, by - py * headW);
        ctx.closePath();
        ctx.fillStyle = '#ff9a1a';
        ctx.strokeStyle = 'rgba(72, 32, 6, 0.88)';
        ctx.lineWidth = 1.15;
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
      ctx.beginPath(); ctx.arc(sun.x, sun.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ffe08a'; ctx.fill();
      ctx.beginPath(); ctx.arc(sun.x, sun.y, 2.6, 0, Math.PI * 2);
      ctx.fillStyle = '#e04030'; ctx.fill();
    }
    ctx.fillStyle = '#96d2ff';
    ctx.beginPath(); ctx.arc(cx, cy, 2.1, 0, Math.PI * 2); ctx.fill();
    return { cx: cx, cy: cy, R: R };
  }

  global.red5PaintElcSunPath = paintElcSunPath;
  global.red5ElcSolarAltAz = solarAltAz;
  global.red5ElcDayOfYear = dayOfYear;

  global.ElcSunPathOnFloor = function ElcSunPathOnFloor(props) {
    const React = global.React;
    const canvasRef = React.useRef(null);
    const wrapRef = React.useRef(null);
    const enabled = !!props.enabled;
    const lat = typeof props.lat === 'number' ? props.lat : 40.7128;
    const lon = typeof props.lon === 'number' ? props.lon : -74.0060;
    const elevationM = Number(props.elevation_m) || 0;
    const timezone = props.timezone || '';
    const adj = props.adj || { size: 1, rot: 0, look: 0, tilt: 0 };
    const hour = props.hour;
    const doy = props.doy;
    const sun = props.sun;
    const orientation = props.orientation;
    const northOffsetDeg = props.northOffsetDeg;
    const showCardinals = props.showCardinals !== false;
    const oKey = orientation
      ? ['north', 'south', 'west', 'east'].map(function (k) {
          const p = orientation[k];
          return p ? (k + ':' + p.x + ',' + p.y) : (k + ':');
        }).join('|')
      : '';

    React.useEffect(function () {
      const canvas = canvasRef.current;
      const wrap = wrapRef.current;
      if (!canvas || !wrap || !enabled) return undefined;
      function paint() {
        const r = wrap.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const W = Math.max(1, r.width);
        const H = Math.max(1, r.height);
        canvas.width = Math.floor(W * dpr);
        canvas.height = Math.floor(H * dpr);
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        const ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);
        paintElcSunPath(ctx, {
          width: W, height: H, dpr: dpr,
          lat: lat, lon: lon, hour: hour, doy: doy,
          sun: sun, adj: adj, orientation: orientation,
          northOffsetDeg: northOffsetDeg, elevation_m: elevationM,
          timezone: timezone,
          showCardinals: showCardinals
        });
      }
      paint();
      const ro = (typeof ResizeObserver !== 'undefined')
        ? new ResizeObserver(paint) : null;
      if (ro) ro.observe(wrap);
      return function () { if (ro) ro.disconnect(); };
    }, [enabled, lat, lon, adj.size, adj.rot, adj.look, adj.tilt,
        hour, doy, sun && sun.azimuth, sun && sun.elevation,
        orientation, oKey, northOffsetDeg, elevationM, timezone, showCardinals]);

    if (!enabled) return null;
    return React.createElement('div', {
      ref: wrapRef,
      className: 'absolute inset-0 pointer-events-none',
      style: { zIndex: 38 },
      'data-testid': 'elc-sun-path-overlay'
    }, React.createElement('canvas', {
      ref: canvasRef,
      style: { position: 'absolute', inset: 0, width: '100%', height: '100%' }
    }));
  };

  global.ElcSunPathControls = function ElcSunPathControls(props) {
    const React = global.React;
    const enabled = !!props.enabled;
    const adj = props.adj || { size: 1, rot: 0, look: 0, tilt: 0 };
    const hour = (props.hour != null) ? props.hour : new Date().getHours();
    const doy = (props.doy != null) ? props.doy : dayOfYear(new Date());
    const year = new Date().getFullYear();
    const mdLabel = new Date(year, 0, doy).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const hhLabel = String(Math.floor(hour)).padStart(2, '0') + ':' + String(Math.round((hour % 1) * 60)).padStart(2, '0');
    const step = props.onAdjStep;
    const btn = function (kind, label, title) {
      return React.createElement('button', {
        type: 'button',
        title: title,
        'data-sp': kind,
        onClick: function () { if (step) step(kind); },
        className: 'px-1.5 py-0.5 rounded border text-[9px] font-black uppercase tracking-wider bg-slate-900/80 border-slate-600 text-sky-200 hover:border-amber-400'
      }, label);
    };
    return React.createElement('div', {
      className: props.compact
        ? 'relative z-10 pointer-events-auto'
        : 'absolute z-40 left-2 bottom-2 pointer-events-auto',
      'data-testid': 'elc-sun-path-controls',
      style: { maxWidth: 420 }
    },
      React.createElement('div', {
        className: 'rounded-md border shadow-2xl backdrop-blur-md px-2 py-1.5 space-y-1',
        style: { background: 'rgba(16,20,26,0.92)', borderColor: '#334155' }
      },
        React.createElement('div', { className: 'flex items-center gap-2 flex-wrap' },
          React.createElement('button', {
            type: 'button',
            'data-testid': 'floor-sunpath-toggle',
            onClick: function () { if (props.onToggle) props.onToggle(!enabled); },
            className: 'px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ' +
              (enabled ? 'bg-amber-500 text-slate-900 border-amber-300' : 'bg-slate-800 text-slate-300 border-slate-600')
          }, enabled ? 'Sun path: On' : 'Sun path: Off'),
          enabled && React.createElement('span', { className: 'inline-flex gap-1 flex-wrap items-center' },
            btn('size-', '−', 'Smaller'),
            btn('size+', '+', 'Bigger'),
            btn('rotL', '↺', 'Rotate left'),
            btn('rotR', '↻', 'Rotate right'),
            btn('lookU', '↑', 'Look up'),
            btn('lookD', '↓', 'Look down'),
            btn('tiltW', 'W↓', 'West down'),
            btn('tiltE', 'E↓', 'East down'),
            btn('reset', 'Reset', 'Reset view')
          )
        ),
        enabled && React.createElement('div', { className: 'flex items-center gap-2' },
          React.createElement('span', { className: 'text-[8px] text-slate-400 font-black uppercase w-10' }, hhLabel),
          React.createElement('button', {
            type: 'button',
            title: 'Follow wall-clock time of day',
            'data-testid': 'elc-sunpath-now',
            onClick: function () { if (props.onNow) props.onNow(); },
            className: 'px-1.5 py-0.5 rounded border text-[8px] font-black uppercase tracking-wider ' +
              (props.followClock
                ? 'bg-amber-500 text-slate-900 border-amber-300'
                : 'bg-slate-800 text-slate-300 border-slate-600 hover:border-amber-400')
          }, props.followClock ? 'TOD' : 'Now'),
          React.createElement('input', {
            type: 'range', min: 0, max: 23.75, step: 0.25, value: hour,
            'data-testid': 'elc-sunpath-hour',
            className: 'flex-1 accent-amber-400',
            onChange: function (e) { if (props.onHour) props.onHour(+e.target.value); }
          }),
          React.createElement('span', { className: 'text-[8px] text-slate-400 font-black uppercase w-12 text-right' }, mdLabel),
          React.createElement('input', {
            type: 'range', min: 1, max: 365, step: 1, value: doy,
            'data-testid': 'elc-sunpath-doy',
            className: 'flex-1 accent-amber-400',
            onChange: function (e) { if (props.onDoy) props.onDoy(+e.target.value); }
          })
        )
      )
    );
  };

  function loadAdj() {
    try {
      const j = JSON.parse(localStorage.getItem('elc.floor.sunPathAdj') || 'null');
      if (j && typeof j === 'object') {
        return {
          size: Number(j.size) || 1,
          rot: Number(j.rot) || 0,
          look: Number(j.look) || 0,
          tilt: Number(j.tilt) || 0,
        };
      }
    } catch (_) {}
    return { size: 1, rot: 0, look: 0, tilt: 0 };
  }
  function saveAdj(a) {
    try { localStorage.setItem('elc.floor.sunPathAdj', JSON.stringify(a)); } catch (_) {}
  }
  function applyAdjStep(adj, kind) {
    const a = Object.assign({ size: 1, rot: 0, look: 0, tilt: 0 }, adj);
    if (kind === 'size-') a.size = Math.max(0.45, +(a.size - 0.04).toFixed(3));
    if (kind === 'size+') a.size = Math.min(2.2, +(a.size + 0.04).toFixed(3));
    if (kind === 'rotL') a.rot += 2;
    if (kind === 'rotR') a.rot -= 2;
    if (kind === 'lookU') a.look = Math.min(40, a.look + 1.2);
    if (kind === 'lookD') a.look = Math.max(-25, a.look - 1.2);
    if (kind === 'tiltW') a.tilt = Math.min(50, a.tilt + 1);
    if (kind === 'tiltE') a.tilt = Math.max(-40, a.tilt - 1);
    if (kind === 'reset') { a.size = 1; a.rot = 0; a.look = 0; a.tilt = 0; }
    saveAdj(a);
    return a;
  }

  global.red5ElcSunPath = {
    paint: global.red5PaintElcSunPath,
    loadAdj: loadAdj,
    saveAdj: saveAdj,
    applyAdjStep: applyAdjStep,
    dayOfYear: dayOfYear,
    civilHourNow: civilHourNow,
    civilDoyNow: civilDoyNow,
    siteTzOffsetHours: siteTzOffsetHours,
    sunAtCivilTod: sunAtCivilTod,
    horizonDipDeg: horizonDipDeg,
  };
  global.red5ElcSunAtTod = sunAtCivilTod;
  global.ElcSunPathOverlay = global.ElcSunPathOnFloor;
  global.ElcSunPathToolbar = function ElcSunPathToolbar(props) {
    const p = Object.assign({}, props, {
      onAdjStep: function (kind) {
        const next = applyAdjStep(props.adj || loadAdj(), kind);
        if (props.onAdj) props.onAdj(next);
      },
    });
    if (props.compact) {
      p.className = 'relative z-10';
    }
    return global.ElcSunPathControls(p);
  };

  global.ElcSunPathLive = function ElcSunPathLive(props) {
    const React = global.React;
    const [enabled, setEnabled] = React.useState(function () {
      try { return localStorage.getItem('elc.floor.sunPathOverlay') !== '0'; } catch (_) { return true; }
    });
    const [adj, setAdj] = React.useState(function () { return loadAdj(); });
    const [followClock, setFollowClock] = React.useState(true);
    const [hour, setHour] = React.useState(function () { return civilHourNow(new Date()); });
    const [doy, setDoy] = React.useState(function () { return dayOfYear(new Date()); });
    const lat = props && props.lat;
    const lon = props && props.lon;
    const elevationM = Number(props && props.elevation_m) || 0;
    const timezone = (props && props.timezone) || '';

    React.useEffect(function () {
      if (!followClock) return undefined;
      function tick() {
        const n = new Date();
        setHour(civilHourNow(n, timezone, lon));
        setDoy(civilDoyNow(n, timezone, lon));
      }
      tick();
      const id = setInterval(tick, 15000);
      return function () { clearInterval(id); };
    }, [followClock, timezone, lon]);

    const sun = (Number.isFinite(lat) && Number.isFinite(lon))
      ? sunAtCivilTod(lat, lon, doy, hour, elevationM, timezone)
      : null;

    React.useEffect(function () {
      try { localStorage.setItem('elc.floor.sunPathOverlay', enabled ? '1' : '0'); } catch (_) {}
      const payload = { enabled: !!enabled, sun: sun, hour: hour, doy: doy };
      if (props && props.onChange) props.onChange(payload);
      try { global.dispatchEvent(new CustomEvent('r5-sun-state', { detail: payload })); } catch (_) {}
    }, [enabled, hour, doy, lat, lon, elevationM, timezone, sun && sun.azimuth, sun && sun.elevation]);

    return React.createElement(React.Fragment, null,
      React.createElement(global.ElcSunPathOnFloor, {
        enabled: enabled, lat: lat, lon: lon, elevation_m: elevationM,
        timezone: timezone,
        sun: sun, hour: hour, doy: doy, adj: adj,
        orientation: props && props.orientation,
        northOffsetDeg: props && props.northOffsetDeg,
        showCardinals: props && props.showCardinals,
      }),
      React.createElement(global.ElcSunPathControls, {
        enabled: enabled, hour: hour, doy: doy, adj: adj, followClock: followClock,
        onToggle: setEnabled,
        onHour: function (h) { setFollowClock(false); setHour(h); },
        onDoy: function (d) { setFollowClock(false); setDoy(d); },
        onNow: function () { setFollowClock(true); },
        onAdjStep: function (kind) { setAdj(applyAdjStep(adj, kind)); },
      })
    );
  };
})(typeof window !== 'undefined' ? window : this);
