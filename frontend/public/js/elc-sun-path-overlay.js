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

  function solarNoonHour(latDeg, lonDeg, doy, timezone) {
    const tzHours = siteTzOffsetHours(new Date(), timezone, lonDeg);
    const lat = (Number(latDeg) || 0) * Math.PI / 180;
    let bestHour = 12, bestEl = -Infinity;
    for (let h = 5; h <= 19; h += 0.1) {
      const p = solarAltAz(lat, Number(doy) || 1, h, lonDeg, tzHours);
      if (p.el > bestEl) { bestEl = p.el; bestHour = h; }
    }
    return bestHour;
  }

  // Same sun the floor pointer uses: live TOD when the sun is up,
  // solar noon when site clock is night so shafts/rays still match the disc.
  function sunAtCivilTodForFloor(latDeg, lonDeg, doy, hour, elevationM, timezone) {
    const primary = sunAtCivilTod(latDeg, lonDeg, doy, hour, elevationM, timezone);
    if (primary.is_day && primary.elevation > 0) return primary;
    return sunAtCivilTod(latDeg, lonDeg, doy, solarNoonHour(latDeg, lonDeg, doy, timezone), elevationM, timezone);
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
      ctx.beginPath(); ctx.arc(q.x, q.y, 1.35, 0, Math.PI * 2);
      ctx.fillStyle = '#c41e1e'; ctx.fill();
      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineWidth = 1;
      ctx.font = '10px Arial, Helvetica, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = '#c41e1e';
      ctx.fillText(String(hr).padStart(2, '0'), q.x, q.y - 2.5);
      ctx.restore();
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

    // Same paint as red5-elc floor.html _paintSunPathOverlay: orange
    // shaft from horizon-center through the live sun on today's red path.
    // Night TOD uses solar noon so the disc (and window glow) still match.
    const floorSun = sunAtCivilTodForFloor(latDeg, lonDeg, doy, hour, opts.elevation_m, opts.timezone);
    const liveEl = floorSun.elevation * Math.PI / 180;
    const liveAz = floorSun.azimuth * Math.PI / 180;
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
        ctx.setLineDash([]);
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
      style: { zIndex: 80 },
      'data-testid': 'elc-sun-path-overlay'
    }, React.createElement('canvas', {
      ref: canvasRef,
      style: { position: 'absolute', inset: 0, width: '100%', height: '100%' }
    }));
  };

  /* ---------- ELC day-selector (shared civil clock) ---------------- */
  const CLOCK_EVT = 'r5-elc-sun-clock';
  const LINE = '#2a3340';
  const MUTED = '#6b7684';
  const TEXT = '#d8dde4';
  const MONO = 'ui-monospace, "SF Mono", Consolas, monospace';

  function loadDayLenStep() {
    try {
      const s = localStorage.getItem('elc.floor.dayLenStep');
      if (s === 'week' || s === 'month' || s === 'day') return s;
    } catch (_) {}
    return 'day';
  }
  function saveDayLenStep(s) {
    try { localStorage.setItem('elc.floor.dayLenStep', s); } catch (_) {}
  }
  function daysInMonth(y, mo) {
    return new Date(y, mo + 1, 0).getDate();
  }
  function civilPartsNow(timezone, lonDeg) {
    return clockParts(new Date(), timezone);
  }
  function hourFromParts(p) {
    if (!p) return 0;
    return (Number(p.h) || 0) + (Number(p.mi) || 0) / 60 + (Number(p.se) || 0) / 3600;
  }
  function fmtDayLengthWhen(p) {
    if (!p) return '—';
    const mo = String((p.mo || 0) + 1).padStart(2, '0');
    const da = String(p.da || 1).padStart(2, '0');
    const hh = String(p.h || 0).padStart(2, '0');
    const mm = String(p.mi || 0).padStart(2, '0');
    return p.y + '-' + mo + '-' + da + '  ' + hh + ':' + mm;
  }
  function stepCivilDate(p, step, dir) {
    let y = p.y, mo = p.mo, da = p.da;
    if (step === 'month') {
      const t = mo + dir;
      y += Math.floor(t / 12);
      mo = ((t % 12) + 12) % 12;
      da = Math.min(da, daysInMonth(y, mo));
    } else {
      const add = (step === 'week' ? 7 : 1) * dir;
      const shifted = new Date(y, mo, da + add);
      y = shifted.getFullYear();
      mo = shifted.getMonth();
      da = shifted.getDate();
    }
    return {
      y: y, mo: mo, da: da, h: p.h, mi: p.mi, se: p.se || 0,
      doy: dayOfYearYmd(y, mo, da)
    };
  }
  function stepCivilHour(p, dir) {
    const h = (((Number(p.h) || 0) + dir) % 24 + 24) % 24;
    return Object.assign({}, p, { h: h, doy: dayOfYearYmd(p.y, p.mo, p.da) });
  }

  let _clockFollow = true;
  let _clockParts = null;
  let _clockStep = loadDayLenStep();
  let _tickTz = '';
  let _tickLon = 0;
  let _tickTimer = 0;
  const _clockSubs = new Set();

  function clockSnapshot() {
    return {
      followClock: _clockFollow,
      parts: _clockParts,
      step: _clockStep,
      hour: hourFromParts(_clockParts),
      doy: _clockParts ? _clockParts.doy : 1,
    };
  }
  function publishClock() {
    const snap = clockSnapshot();
    _clockSubs.forEach(function (fn) { try { fn(snap); } catch (_) {} });
    try { global.dispatchEvent(new CustomEvent(CLOCK_EVT, { detail: snap })); } catch (_) {}
  }
  function ensureClockParts(timezone, lonDeg) {
    if (!_clockParts) _clockParts = civilPartsNow(timezone, lonDeg);
    return _clockParts;
  }
  function setClockFollow(on, timezone, lonDeg) {
    _clockFollow = !!on;
    if (_clockFollow) _clockParts = civilPartsNow(timezone, lonDeg);
    publishClock();
  }
  function setClockParts(parts) {
    _clockFollow = false;
    _clockParts = parts;
    publishClock();
  }
  function setClockStep(step) {
    _clockStep = (step === 'week' || step === 'month') ? step : 'day';
    saveDayLenStep(_clockStep);
    publishClock();
  }
  function armClockTick(timezone, lonDeg) {
    _tickTz = timezone || '';
    _tickLon = lonDeg;
    if (_tickTimer) return;
    function tick() {
      if (!_clockFollow) return;
      _clockParts = civilPartsNow(_tickTz, _tickLon);
      publishClock();
    }
    tick();
    _tickTimer = setInterval(tick, 15000);
  }
  function useElcSunClock(timezone, lonDeg) {
    const React = global.React;
    const [, setRev] = React.useState(0);
    React.useEffect(function () {
      armClockTick(timezone, lonDeg);
      if (!_clockParts) _clockParts = civilPartsNow(timezone, lonDeg);
      const sub = function () { setRev(function (n) { return n + 1; }); };
      _clockSubs.add(sub);
      return function () { _clockSubs.delete(sub); };
    }, [timezone, lonDeg]);
    armClockTick(timezone, lonDeg);
    ensureClockParts(timezone, lonDeg);
    return clockSnapshot();
  }

  /* ELC day-length infographic (year plot + twilight bands). */
  const DL = { W: 220, H: 152, L: 17, R: 4, T: 4, B: 14 };
  const DAYLEN_CACHE_MAX = 5;
  const DAYLEN_CHUNK_DAYS = 14;
  const _dayLenCaches = new Map();
  let _dayLenBuild = null;
  const _dlReady = new Set();

  function daysInYear(y) {
    return ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) ? 366 : 365;
  }
  function dlX(doy, days) {
    return DL.L + ((doy - 1) / Math.max(1, days - 1)) * (DL.W - DL.L - DL.R);
  }
  function dlY(hour) {
    return DL.T + (Math.max(0, Math.min(24, hour)) / 24) * (DL.H - DL.T - DL.B);
  }
  function solarElDeg(latRad, doy, hour, lonDeg, tzHours) {
    return solarAltAz(latRad, doy, hour, lonDeg, tzHours).el * 180 / Math.PI;
  }
  function crossingHour(latRad, doy, target, rising, lonDeg, tzHours) {
    let prevH = 0;
    let prevEl = solarElDeg(latRad, doy, 0, lonDeg, tzHours);
    let h0 = null, h1 = null;
    for (let h = 0.5; h <= 24.001; h += 0.5) {
      const hh = Math.min(h, 24);
      const el = solarElDeg(latRad, doy, hh, lonDeg, tzHours);
      const crossed = rising
        ? (prevEl < target && el >= target)
        : (prevEl > target && el <= target);
      if (crossed) { h0 = prevH; h1 = hh; break; }
      prevH = hh; prevEl = el;
    }
    if (h0 == null) return null;
    for (let i = 0; i < 14; i++) {
      const mid = (h0 + h1) / 2;
      const el = solarElDeg(latRad, doy, mid, lonDeg, tzHours);
      if (rising ? (el < target) : (el > target)) h0 = mid;
      else h1 = mid;
    }
    return (h0 + h1) / 2;
  }
  function bandHours(latRad, doy, target, lonDeg, tzHours) {
    const rise = crossingHour(latRad, doy, target, true, lonDeg, tzHours);
    const set = crossingHour(latRad, doy, target, false, lonDeg, tzHours);
    if (rise != null && set != null) {
      if (set >= rise) return [[rise, set]];
      return [[0, set], [rise, 24]];
    }
    const noon = solarElDeg(latRad, doy, 12, lonDeg, tzHours);
    const midn = solarElDeg(latRad, doy, 0, lonDeg, tzHours);
    if (noon >= target || midn >= target) return [[0, 24]];
    return [];
  }
  function dayLenThresholds() {
    return [
      { name: 'astro', el: -18 },
      { name: 'naut', el: -12 },
      { name: 'civil', el: -6 },
      { name: 'day', el: 0 },
    ];
  }
  function dayLenCacheKey(year, latDeg, lonDeg, timezone) {
    return year + '|' + (Number(latDeg) || 0).toFixed(4) + '|' + (Number(lonDeg) || 0).toFixed(4) +
      '|' + String(timezone || '') + '|' + DL.W + 'x' + DL.H;
  }
  function getDayLenCache(key) {
    return _dayLenCaches.get(key) || null;
  }
  function putDayLenCache(cache) {
    _dayLenCaches.delete(cache.key);
    _dayLenCaches.set(cache.key, cache);
    while (_dayLenCaches.size > DAYLEN_CACHE_MAX) {
      const oldest = _dayLenCaches.keys().next().value;
      if (oldest === cache.key) break;
      _dayLenCaches.delete(oldest);
    }
    _dlReady.forEach(function (fn) { try { fn(cache); } catch (_) {} });
  }
  function appendDayLenDay(acc, latRad, days, doy, lonDeg, tzHours) {
    const x0 = dlX(doy, days);
    const x1 = dlX(Math.min(days, doy + 1), days);
    const row = { doy: doy, rise: null, set: null };
    dayLenThresholds().forEach(function (th) {
      const segs = bandHours(latRad, doy, th.el, lonDeg, tzHours);
      if (th.name === 'day' && segs.length === 1) {
        row.rise = segs[0][0];
        row.set = segs[0][1];
      } else if (th.name === 'day' && segs.length === 2) {
        row.rise = segs[1][0];
        row.set = segs[0][1];
      }
      segs.forEach(function (seg) {
        const y0 = dlY(seg[0]).toFixed(2);
        const y1 = dlY(seg[1]).toFixed(2);
        acc.paths[th.name].push(
          'M' + x0.toFixed(2) + ',' + y0 + 'L' + x1.toFixed(2) + ',' + y0 +
          'L' + x1.toFixed(2) + ',' + y1 + 'L' + x0.toFixed(2) + ',' + y1 + 'Z');
      });
    });
    acc.perDay.push(row);
  }
  function dayLenDayRow(latRad, doy, lonDeg, tzHours) {
    const segs = bandHours(latRad, doy, 0, lonDeg, tzHours);
    const row = { doy: doy, rise: null, set: null };
    if (segs.length === 1) {
      row.rise = segs[0][0];
      row.set = segs[0][1];
    } else if (segs.length === 2) {
      row.rise = segs[1][0];
      row.set = segs[0][1];
    }
    return row;
  }
  let _dayLenDisplay = null;
  let _dayLenPrefetchTimer = 0;
  let _dlPrefetchYear = 0;
  let _dlPrefetchLat = 0;
  let _dlPrefetchLon = 0;
  let _dlPrefetchTz = '';

  function finalizeDayLenCache(year, key, days, acc) {
    const cache = {
      key: key, year: year, days: days, perDay: acc.perDay,
      astro: acc.paths.astro.join(''),
      naut: acc.paths.naut.join(''),
      civil: acc.paths.civil.join(''),
      day: acc.paths.day.join(''),
    };
    putDayLenCache(cache);
    _dayLenDisplay = cache;
    return cache;
  }
  function buildDayLenYearNow(year, latDeg, lonDeg, timezone) {
    const key = dayLenCacheKey(year, latDeg, lonDeg, timezone);
    const existing = getDayLenCache(key);
    if (existing) return existing;
    if (_dayLenBuild && _dayLenBuild.key !== key) {
      _dayLenBuild.cancelled = true;
      _dayLenBuild = null;
    }
    const latRad = (Number(latDeg) || 0) * Math.PI / 180;
    const days = daysInYear(year);
    const tzHours = siteTzOffsetHours(new Date(), timezone, lonDeg);
    const acc = { perDay: [], paths: { astro: [], naut: [], civil: [], day: [] } };
    for (let d = 1; d <= days; d++) appendDayLenDay(acc, latRad, days, d, lonDeg, tzHours);
    return finalizeDayLenCache(year, key, days, acc);
  }
  function kickDayLenPrefetch(year, latDeg, lonDeg, timezone) {
    _dlPrefetchYear = year;
    _dlPrefetchLat = latDeg;
    _dlPrefetchLon = lonDeg;
    _dlPrefetchTz = timezone || '';
    if (_dayLenPrefetchTimer) return;
    const start = (typeof requestIdleCallback === 'function')
      ? requestIdleCallback
      : function (cb) { return setTimeout(cb, 80); };
    _dayLenPrefetchTimer = start(function () {
      _dayLenPrefetchTimer = 0;
      if (_dayLenBuild) return;
      const y = _dlPrefetchYear;
      const lat = _dlPrefetchLat;
      const lon = _dlPrefetchLon;
      const tz = _dlPrefetchTz;
      if (!getDayLenCache(dayLenCacheKey(y, lat, lon, tz))) {
        scheduleDayLenBuild(y, lat, lon, tz, true);
        return;
      }
      if (!getDayLenCache(dayLenCacheKey(y + 1, lat, lon, tz))) {
        scheduleDayLenBuild(y + 1, lat, lon, tz, false);
        return;
      }
      if (!getDayLenCache(dayLenCacheKey(y - 1, lat, lon, tz))) {
        scheduleDayLenBuild(y - 1, lat, lon, tz, false);
      }
    });
  }
  function scheduleDayLenBuild(year, latDeg, lonDeg, timezone, priority) {
    const key = dayLenCacheKey(year, latDeg, lonDeg, timezone);
    if (_dayLenCaches.has(key)) return;
    if (_dayLenBuild) {
      if (_dayLenBuild.key === key) {
        if (priority) _dayLenBuild.priority = true;
        return;
      }
      if (!priority) return;
      _dayLenBuild.cancelled = true;
    }
    const latRad = (Number(latDeg) || 0) * Math.PI / 180;
    const days = daysInYear(year);
    const tzHours = siteTzOffsetHours(new Date(), timezone, lonDeg);
    const acc = { perDay: [], paths: { astro: [], naut: [], civil: [], day: [] } };
    const job = { key: key, year: year, priority: !!priority, cancelled: false };
    _dayLenBuild = job;
    let doy = 1;
    const chunk = function () {
      if (job.cancelled) {
        if (_dayLenBuild === job) _dayLenBuild = null;
        return;
      }
      const end = Math.min(days, doy + DAYLEN_CHUNK_DAYS - 1);
      for (let d = doy; d <= end; d++) appendDayLenDay(acc, latRad, days, d, lonDeg, tzHours);
      doy = end + 1;
      if (doy <= days) {
        (typeof requestAnimationFrame === 'function' ? requestAnimationFrame : setTimeout)(chunk);
        return;
      }
      finalizeDayLenCache(year, key, days, acc);
      if (_dayLenBuild === job) _dayLenBuild = null;
      kickDayLenPrefetch(_dlPrefetchYear || year, latDeg, lonDeg, timezone);
    };
    (typeof requestAnimationFrame === 'function' ? requestAnimationFrame : setTimeout)(chunk);
  }
  function ensureDayLenCache(year, latDeg, lonDeg, timezone) {
    const key = dayLenCacheKey(year, latDeg, lonDeg, timezone);
    const ready = getDayLenCache(key);
    if (ready) {
      _dayLenDisplay = ready;
      kickDayLenPrefetch(year, latDeg, lonDeg, timezone);
      return ready;
    }
    /* Build this year on-thread so a year step never blanks the plot.
       Neighbors prefetch in idle chunks so the next year is already warm. */
    const built = buildDayLenYearNow(year, latDeg, lonDeg, timezone);
    kickDayLenPrefetch(year, latDeg, lonDeg, timezone);
    return built || _dayLenDisplay;
  }
  function fmtHM(hour) {
    if (hour == null || !Number.isFinite(hour)) return '';
    const m = Math.round(hour * 60);
    const wrap = ((m % 1440) + 1440) % 1440;
    const hh = String(Math.floor(wrap / 60)).padStart(2, '0');
    const mm = String(wrap % 60).padStart(2, '0');
    return hh + ':' + mm;
  }
  function dayLengthHours(row) {
    if (!row || row.rise == null || row.set == null) return null;
    const rise = Number(row.rise), set = Number(row.set);
    if (!Number.isFinite(rise) || !Number.isFinite(set)) return 0;
    if (set >= rise) return set - rise;
    return (24 - rise) + set;
  }
  function fmtDayLengthDur(hours) {
    if (hours == null || !Number.isFinite(hours)) return '—';
    const mins = Math.round(Math.max(0, Math.min(24, hours)) * 60);
    if (mins <= 0) return '0h';
    if (mins >= 1440) return '24h';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m ? (h + 'h ' + String(m).padStart(2, '0') + 'm') : (h + 'h');
  }
  function monthStartDoy(year, monthIndex) {
    return Math.round((Date.UTC(year, monthIndex, 1) - Date.UTC(year, 0, 1)) / 86400000) + 1;
  }
  function partsFromPlotFrac(year, nx, ny) {
    const days = daysInYear(year);
    const doy = Math.max(1, Math.min(days, Math.round(nx * (days - 1) + 1)));
    const minutes = Math.max(0, Math.min(1439, Math.round(ny * 1440)));
    const d = new Date(year, 0, doy);
    return {
      y: d.getFullYear(), mo: d.getMonth(), da: d.getDate(),
      h: Math.floor(minutes / 60), mi: minutes % 60, se: 0,
      doy: dayOfYearYmd(d.getFullYear(), d.getMonth(), d.getDate())
    };
  }
  function plotEventToParts(svg, clientX, clientY, year) {
    if (!svg || typeof svg.getScreenCTM !== 'function') return null;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    const loc = pt.matrixTransform(ctm.inverse());
    const plotW = DL.W - DL.L - DL.R;
    const plotH = DL.H - DL.T - DL.B;
    const nx = (loc.x - DL.L) / plotW;
    const ny = (loc.y - DL.T) / plotH;
    if (!Number.isFinite(nx) || !Number.isFinite(ny)) return null;
    return partsFromPlotFrac(year, nx, ny);
  }

  function daySelBtnStyle(extra) {
    return Object.assign({
      background: '#1a2028',
      border: '1px solid ' + LINE,
      color: MUTED,
      fontFamily: MONO,
      fontSize: 8,
      padding: '1px 5px',
      borderRadius: 3,
      lineHeight: 1.25,
      letterSpacing: '.04em',
      textTransform: 'uppercase',
      cursor: 'pointer',
    }, extra || {});
  }

  global.ElcDaySelector = function ElcDaySelector(props) {
    const React = global.React;
    const follow = !!props.followClock;
    const parts = props.parts || civilPartsNow(props.timezone, props.lon);
    const step = props.step || 'day';
    const lat = Number(props.lat) || 0;
    const lon = Number(props.lon) || 0;
    const timezone = props.timezone || '';
    const year = parts.y || new Date().getFullYear();
    const days = daysInYear(year);
    const doy = Math.max(1, Math.min(days, parts.doy || 1));
    const hour = hourFromParts(parts);
    const cache = ensureDayLenCache(year, lat, lon, timezone);
    const [, setRev] = React.useState(0);
    React.useEffect(function () {
      const sub = function () { setRev(function (n) { return n + 1; }); };
      _dlReady.add(sub);
      return function () { _dlReady.delete(sub); };
    }, []);
    const latRad = lat * Math.PI / 180;
    const tzHours = siteTzOffsetHours(new Date(), timezone, lon);
    let row = (cache && cache.year === year && cache.perDay[doy - 1]) || null;
    if (!row) row = dayLenDayRow(latRad, doy, lon, tzHours);
    const xNow = dlX(doy, days);
    const yNow = dlY(hour);
    const labelRight = xNow < (DL.W - DL.R) * 0.72;
    const lx = labelRight ? xNow + 6 : xNow - 6;
    const anchor = labelRight ? 'start' : 'end';
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthMarks = [];
    for (let m = 1; m < 12; m++) {
      const md = monthStartDoy(year, m);
      const mx = dlX(md, days);
      monthMarks.push(React.createElement('line', {
        key: 'ml' + m, x1: mx, y1: DL.T, x2: mx, y2: DL.H - DL.B,
        stroke: 'rgba(160,180,200,0.10)', strokeWidth: 0.6
      }));
      monthMarks.push(React.createElement('text', {
        key: 'mt' + m, x: mx, y: DL.H - 3, textAnchor: 'middle',
        fill: '#7a8592', fontSize: 6.5, fontFamily: 'ui-sans-serif,system-ui'
      }, MONTHS[m]));
    }
    const hourLabs = [0, 6, 12, 18, 23].map(function (h) {
      return React.createElement('text', {
        key: 'hl' + h, x: DL.L - 2, y: dlY(h) + 2.4, textAnchor: 'end',
        fill: '#7a8592', fontSize: 6.5, fontFamily: MONO
      }, String(h).padStart(2, '0'));
    });
    const hGrid = [0, 3, 6, 9, 12, 15, 18, 21, 24].map(function (h) {
      const y = dlY(h);
      const dash = h === 12 ? '1.4 2.2' : '0';
      const op = h === 12 ? '0.42' : (h % 6 === 0 ? '0.16' : '0.08');
      return React.createElement('line', {
        key: 'hg' + h, x1: DL.L, y1: y, x2: DL.W - DL.R, y2: y,
        stroke: 'rgba(170,190,210,' + op + ')', strokeWidth: 0.65,
        strokeDasharray: dash
      });
    });
    const riseH = row && row.rise;
    const setH = row && row.set;
    const hairKids = [
      React.createElement('line', {
        key: 'vx', x1: xNow, y1: DL.T, x2: xNow, y2: DL.H - DL.B,
        stroke: '#e23b32', strokeWidth: 0.85, strokeDasharray: '2.4 2.2'
      }),
      React.createElement('line', {
        key: 'hy', x1: DL.L, y1: yNow, x2: DL.W - DL.R, y2: yNow,
        stroke: '#e23b32', strokeWidth: 0.85, strokeDasharray: '2.4 2.2'
      }),
    ];
    if (riseH != null && riseH > 0 && riseH < 24) {
      const y = dlY(riseH);
      hairKids.push(React.createElement('circle', {
        key: 'rc', cx: xNow, cy: y, r: 2.6, fill: 'none',
        stroke: '#e23b32', strokeWidth: 1.15
      }));
      hairKids.push(React.createElement('text', {
        key: 'rt', x: lx, y: y - 3, textAnchor: anchor,
        fill: '#f06a60', fontSize: 7, fontFamily: MONO
      }, fmtHM(riseH)));
    }
    if (setH != null && setH > 0 && setH < 24) {
      const y = dlY(setH);
      hairKids.push(React.createElement('circle', {
        key: 'sc', cx: xNow, cy: y, r: 2.6, fill: 'none',
        stroke: '#e23b32', strokeWidth: 1.15
      }));
      hairKids.push(React.createElement('text', {
        key: 'st', x: lx, y: y + 8, textAnchor: anchor,
        fill: '#f06a60', fontSize: 7, fontFamily: MONO
      }, fmtHM(setH)));
    }
    hairKids.push(React.createElement('circle', {
      key: 'now', cx: xNow, cy: yNow, r: 2.8, fill: '#e23b32'
    }));
    const nowStyle = daySelBtnStyle(follow ? { borderColor: '#ffb020', color: '#ffb020' } : null);
    const plotRef = React.useRef(null);
    const dragRef = React.useRef(false);
    const scrub = function (ev) {
      const svg = plotRef.current;
      const next = plotEventToParts(svg, ev.clientX, ev.clientY, year);
      if (next && props.onScrub) props.onScrub(next);
    };
    return React.createElement('div', {
      className: 'pointer-events-auto',
      'data-testid': 'elc-day-selector',
      onMouseDown: function (e) { e.stopPropagation(); },
      style: Object.assign({
        position: 'absolute',
        right: 8,
        bottom: 8,
        zIndex: 50,
        width: 248,
        padding: '4px 4px 3px',
        background: 'rgba(16,20,26,0.88)',
        border: '1px solid ' + LINE,
        borderRadius: 5,
        backdropFilter: 'blur(4px)',
        userSelect: 'none',
      }, props.style || {})
    },
      React.createElement('div', {
        style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4, marginBottom: 2 }
      },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 } },
          React.createElement('button', {
            type: 'button', 'data-testid': 'elc-day-prev', title: 'Previous',
            style: daySelBtnStyle(),
            onClick: function () { if (props.onPrev) props.onPrev(); }
          }, '◀'),
          React.createElement('select', {
            'data-testid': 'elc-day-step', title: 'Date step',
            value: step,
            onChange: function (e) { if (props.onStep) props.onStep(e.target.value); },
            style: daySelBtnStyle({ padding: '1px 2px', maxWidth: 58, color: MUTED })
          },
            React.createElement('option', { value: 'day' }, 'Day'),
            React.createElement('option', { value: 'week' }, 'Week'),
            React.createElement('option', { value: 'month' }, 'Month')
          ),
          React.createElement('button', {
            type: 'button', 'data-testid': 'elc-day-next', title: 'Next',
            style: daySelBtnStyle(),
            onClick: function () { if (props.onNext) props.onNext(); }
          }, '▶'),
          React.createElement('button', {
            type: 'button', 'data-testid': 'elc-day-now',
            title: follow ? 'Following site time of day' : 'Return to now',
            style: nowStyle,
            onClick: function () { if (props.onNow) props.onNow(); }
          }, 'Now')
        ),
        React.createElement('div', {
          style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, flex: '0 0 auto', pointerEvents: 'none' }
        },
          React.createElement('span', {
            style: {
              background: '#c5cad2', color: '#2a3038', fontSize: 8, fontWeight: 700,
              letterSpacing: '.07em', padding: '2px 6px 2px 7px', borderRadius: 2,
              textTransform: 'uppercase', lineHeight: 1.2
            }
          }, 'Day-length ▾'),
          React.createElement('span', {
            'data-testid': 'elc-day-hours',
            style: { fontFamily: MONO, fontSize: 9, fontWeight: 600, color: '#c8d0d8', letterSpacing: '0.03em', whiteSpace: 'nowrap' }
          }, fmtDayLengthDur(dayLengthHours(row)))
        )
      ),
      React.createElement('div', { style: { display: 'flex', alignItems: 'stretch', gap: 1 } },
        React.createElement('div', { style: { position: 'relative', flex: 1, minWidth: 0 } },
          React.createElement('svg', {
            ref: plotRef,
            viewBox: '0 0 ' + DL.W + ' ' + DL.H,
            preserveAspectRatio: 'none',
            'data-testid': 'elc-day-plot',
            style: { display: 'block', width: '100%', height: 152, cursor: 'crosshair' },
            onPointerDown: function (ev) {
              if (ev.button != null && ev.button !== 0) return;
              dragRef.current = true;
              try { ev.currentTarget.setPointerCapture(ev.pointerId); } catch (_) {}
              scrub(ev);
              ev.preventDefault();
            },
            onPointerMove: function (ev) { if (dragRef.current) scrub(ev); },
            onPointerUp: function () { dragRef.current = false; },
            onPointerCancel: function () { dragRef.current = false; }
          },
            React.createElement('rect', { x: 0, y: 0, width: DL.W, height: DL.H, fill: '#0a101c' }),
            React.createElement('rect', {
              x: DL.L, y: DL.T, width: DL.W - DL.L - DL.R, height: DL.H - DL.T - DL.B, fill: '#0b1220'
            }),
            cache && React.createElement('path', { d: cache.astro, fill: '#152238' }),
            cache && React.createElement('path', { d: cache.naut, fill: '#1c3a5c' }),
            cache && React.createElement('path', { d: cache.civil, fill: '#2d5a8a' }),
            cache && React.createElement('path', { d: cache.day, fill: '#8ec8e8' }),
            hGrid, monthMarks, hourLabs
          ),
          React.createElement('div', {
            style: {
              position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
              pointerEvents: 'none', zIndex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 2, padding: '5px 10px', borderRadius: 8,
              background: 'rgba(8, 12, 20, 0.68)', boxShadow: '0 1px 8px rgba(0,0,0,0.4)', maxWidth: '86%'
            }
          },
            React.createElement('span', {
              'data-testid': 'elc-day-when',
              style: {
                fontFamily: MONO, fontSize: 9, fontWeight: 600, color: '#e8edf3',
                letterSpacing: '0.02em', whiteSpace: 'nowrap', textShadow: '0 1px 2px rgba(0,0,0,0.55)'
              }
            }, fmtDayLengthWhen(parts)),
            React.createElement('span', {
              'data-testid': 'elc-day-mode',
              style: {
                fontFamily: MONO, fontSize: 8, letterSpacing: '.08em', textTransform: 'uppercase',
                color: follow ? '#ffb020' : '#c5cad2'
              }
            }, follow ? 'LIVE' : 'SELECTED')
          ),
          React.createElement('svg', {
            viewBox: '0 0 ' + DL.W + ' ' + DL.H,
            preserveAspectRatio: 'none',
            'data-testid': 'elc-day-hair',
            style: { position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }
          }, hairKids)
        ),
        React.createElement('div', {
          style: {
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            width: 14, flex: '0 0 14px', padding: '4px 0 14px'
          }
        },
          React.createElement('button', {
            type: 'button', 'data-testid': 'elc-hour-up', title: 'Earlier (−1 h)',
            style: daySelBtnStyle({ padding: '2px 0', width: 14 }),
            onClick: function () { if (props.onHourUp) props.onHourUp(); }
          }, '▲'),
          React.createElement('button', {
            type: 'button', 'data-testid': 'elc-hour-down', title: 'Later (+1 h)',
            style: daySelBtnStyle({ padding: '2px 0', width: 14 }),
            onClick: function () { if (props.onHourDown) props.onHourDown(); }
          }, '▼')
        )
      )
    );
  };

  global.ElcDaySelectorLive = function ElcDaySelectorLive(props) {
    const timezone = (props && props.timezone) || '';
    const lon = props && props.lon;
    const lat = props && props.lat;
    const snap = useElcSunClock(timezone, lon);
    const parts = snap.parts || civilPartsNow(timezone, lon);
    return global.ElcDaySelector({
      timezone: timezone, lat: lat, lon: lon, style: props && props.style,
      followClock: snap.followClock, parts: parts, step: snap.step,
      onStep: setClockStep,
      onPrev: function () { setClockParts(stepCivilDate(ensureClockParts(timezone, lon), _clockStep, -1)); },
      onNext: function () { setClockParts(stepCivilDate(ensureClockParts(timezone, lon), _clockStep, 1)); },
      onNow: function () { setClockFollow(true, timezone, lon); },
      onHourUp: function () { setClockParts(stepCivilHour(ensureClockParts(timezone, lon), -1)); },
      onHourDown: function () { setClockParts(stepCivilHour(ensureClockParts(timezone, lon), 1)); },
      onScrub: function (next) { setClockParts(next); },
    });
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
        : (props.hostPinned
          ? 'absolute z-50 left-2 bottom-2 pointer-events-auto'
          : 'absolute z-40 left-2 bottom-2 pointer-events-auto'),
      'data-testid': 'elc-sun-path-controls',
      onMouseDown: function (e) { e.stopPropagation(); },
      style: Object.assign({ maxWidth: 420 }, props.style || {})
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
            !props.operatorAdj && btn('rotL', '↺', 'Rotate left'),
            !props.operatorAdj && btn('rotR', '↻', 'Rotate right'),
            !props.operatorAdj && btn('lookU', '↑', 'Look up'),
            !props.operatorAdj && btn('lookD', '↓', 'Look down'),
            !props.operatorAdj && btn('tiltW', 'W↓', 'West down'),
            !props.operatorAdj && btn('tiltE', 'E↓', 'East down'),
            btn('reset', 'Reset', 'Reset view')
          )
        ),
        enabled && !props.hideScrubbers && React.createElement('div', { className: 'flex items-center gap-2' },
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

  const SUN_UI_EVT = 'r5-elc-sun-ui';
  const _sunUiSubs = new Set();
  let _sunEnabled = (function () {
    try { return localStorage.getItem('elc.floor.sunPathOverlay') !== '0'; } catch (_) { return true; }
  })();
  let _sunAdjLive = null;
  function getSunAdjLive() {
    if (!_sunAdjLive) _sunAdjLive = loadAdj();
    return _sunAdjLive;
  }
  function sunUiSnapshot() {
    return { enabled: _sunEnabled, adj: getSunAdjLive() };
  }
  function publishSunUi() {
    const snap = sunUiSnapshot();
    _sunUiSubs.forEach(function (fn) { try { fn(snap); } catch (_) {} });
    try { global.dispatchEvent(new CustomEvent(SUN_UI_EVT, { detail: snap })); } catch (_) {}
  }
  function setSunPathEnabledShared(on) {
    _sunEnabled = !!on;
    try { localStorage.setItem('elc.floor.sunPathOverlay', _sunEnabled ? '1' : '0'); } catch (_) {}
    publishSunUi();
  }
  function applySunAdjShared(kind) {
    _sunAdjLive = applyAdjStep(getSunAdjLive(), kind);
    publishSunUi();
    return _sunAdjLive;
  }
  function useElcSunUi() {
    const React = global.React;
    const [, setRev] = React.useState(0);
    React.useEffect(function () {
      const sub = function () { setRev(function (n) { return n + 1; }); };
      _sunUiSubs.add(sub);
      return function () { _sunUiSubs.delete(sub); };
    }, []);
    return sunUiSnapshot();
  }

  /* ---- Floor host: outdoor weather + lux (TOD) + Darken Auto/On/Off ----
     Host chrome only — not painted into the graphic. AHU modal does not mount this. */
  const WX_MOOD = {
    bright: { icon: '\u2600', label: 'Bright' },
    'light-cloud': { icon: '\u26C5', label: 'Light cloud' },
    'heavy-cloud': { icon: '\u2601', label: 'Heavy cloud' },
    'light-rain': { icon: '\uD83C\uDF26', label: 'Light rain' },
    rain: { icon: '\uD83C\uDF27', label: 'Rain' },
    storm: { icon: '\u26C8', label: 'Storm' },
    snow: { icon: '\u2744', label: 'Snow' },
    twilight: { icon: '\uD83C\uDF05', label: 'Twilight' },
    night: { icon: '\uD83C\uDF19', label: 'Night' },
    none: { icon: '\u2014', label: '\u2014' },
  };
  const AHU_DARKEN_EVT = 'r5-ahu-darken';
  const _ahuDarkenSubs = new Set();
  let _ahuDarkenMode = (function () {
    try {
      const v = localStorage.getItem('ahux.floor.darkenBg');
      if (v === 'on' || v === 'off' || v === 'auto') return v;
    } catch (_) {}
    return 'auto';
  })();
  let _ahuDarkenPctMode = (function () {
    try {
      const m = localStorage.getItem('ahux.floor.darkenPctMode');
      if (m === 'manual' || m === 'tod') return m;
    } catch (_) {}
    return 'tod';
  })();
  let _ahuDarkenPct = (function () {
    try {
      const n = Number(localStorage.getItem('ahux.floor.darkenPct'));
      if (Number.isFinite(n)) return Math.min(90, Math.max(30, Math.round(n)));
    } catch (_) {}
    return 90;
  })();

  function ahuDarkenSnapshot() {
    return { mode: _ahuDarkenMode, pctMode: _ahuDarkenPctMode, pct: _ahuDarkenPct };
  }
  function publishAhuDarken() {
    const snap = ahuDarkenSnapshot();
    _ahuDarkenSubs.forEach(function (fn) { try { fn(snap); } catch (_) {} });
    try { global.dispatchEvent(new CustomEvent(AHU_DARKEN_EVT, { detail: snap })); } catch (_) {}
  }
  function setAhuDarkenMode(mode) {
    const next = (mode === 'on' || mode === 'off') ? mode : 'auto';
    _ahuDarkenMode = next;
    if (next === 'auto') _ahuDarkenPctMode = 'tod';
    try {
      localStorage.setItem('ahux.floor.darkenBg', _ahuDarkenMode);
      localStorage.setItem('ahux.floor.darkenPctMode', _ahuDarkenPctMode);
    } catch (_) {}
    publishAhuDarken();
  }
  function cycleAhuDarkenMode() {
    const order = ['auto', 'on', 'off'];
    const i = order.indexOf(_ahuDarkenMode);
    setAhuDarkenMode(order[(i + 1) % order.length]);
  }
  function setAhuDarkenPctManual(pct) {
    if (_ahuDarkenMode === 'auto') setAhuDarkenMode('on');
    const n = Math.min(90, Math.max(30, Math.round(Number(pct))));
    if (!Number.isFinite(n)) return;
    _ahuDarkenPctMode = 'manual';
    _ahuDarkenPct = n;
    try {
      localStorage.setItem('ahux.floor.darkenPctMode', 'manual');
      localStorage.setItem('ahux.floor.darkenPct', String(n));
    } catch (_) {}
    publishAhuDarken();
  }
  function setAhuDarkenPctTod() {
    _ahuDarkenPctMode = 'tod';
    try { localStorage.setItem('ahux.floor.darkenPctMode', 'tod'); } catch (_) {}
    publishAhuDarken();
  }
  function useElcAhuDarken() {
    const React = global.React;
    const [, setRev] = React.useState(0);
    React.useEffect(function () {
      const sub = function () { setRev(function (n) { return n + 1; }); };
      _ahuDarkenSubs.add(sub);
      return function () { _ahuDarkenSubs.delete(sub); };
    }, []);
    return ahuDarkenSnapshot();
  }

  function clamp01(x) { return Math.max(0, Math.min(1, x)); }
  function clearSkyBrightFactor(altDeg) {
    if (!(altDeg > 0)) return 0;
    return Math.pow(Math.sin(Math.min(90, altDeg) * Math.PI / 180), 1.15);
  }
  function todDarkenPct(sunEl, lat, lon, doy, timezone, elevationM) {
    if (!Number.isFinite(sunEl) || sunEl <= 0) return 90;
    const noonH = solarNoonHour(lat, lon, doy, timezone);
    const noon = sunAtCivilTod(lat, lon, doy, noonH, elevationM, timezone);
    let altNoon = noon && noon.elevation;
    if (!(altNoon > 0.5)) return 90;
    altNoon = Math.min(90, altNoon);
    const bright = clearSkyBrightFactor(sunEl);
    const brightNoon = clearSkyBrightFactor(altNoon);
    if (brightNoon <= 1e-8) return 90;
    return Math.round(90 - 60 * Math.min(1, bright / brightNoon));
  }
  function effectiveAhuDarkenPct(sunEl, lat, lon, doy, timezone, elevationM) {
    if (_ahuDarkenMode === 'auto' || _ahuDarkenPctMode !== 'manual') {
      return todDarkenPct(sunEl, lat, lon, doy, timezone, elevationM);
    }
    return _ahuDarkenPct;
  }
  function horizontalIlluminanceLux(alt, cloudCover, precipMmH) {
    if (alt < -12) return 0.05;
    if (alt < 0) {
      const tw = Math.pow(10, (alt + 12) / 3);
      return Math.max(0.05, Math.min(600, tw));
    }
    const clear = 128000 * Math.pow(Math.sin(Math.min(90, alt) * Math.PI / 180), 1.15);
    const cc = clamp01(cloudCover);
    const rain = Math.max(0.7, Math.min(1, 1 - 0.03 * (precipMmH || 0)));
    return Math.max(clear * (1 - 0.85 * cc) * rain, 0.5);
  }
  function ambientRgb(illum, alt, cloudCover, precipMmH) {
    const cc = clamp01(cloudCover);
    const rain = Math.max(0.7, Math.min(1, 1 - 0.03 * (precipMmH || 0)));
    if (alt < -6) {
      const v = Math.log10(Math.max(illum, 0.5) + 1) / Math.log10(100001);
      return [
        Math.round(Math.max(0, Math.min(40, 6 + 20 * v))),
        Math.round(Math.max(0, Math.min(50, 9 + 25 * v))),
        Math.round(Math.max(0, Math.min(90, 18 + 40 * v))),
      ];
    }
    const anchors = [
      [-6, 40, 30, 70], [-3, 110, 60, 75], [0, 200, 95, 55], [3, 255, 140, 60],
      [10, 255, 180, 80], [30, 255, 220, 150], [60, 255, 245, 210], [90, 255, 252, 235],
    ];
    const a = Math.max(-6, Math.min(90, alt));
    let lo = anchors[0], hi = anchors[anchors.length - 1];
    for (let i = 1; i < anchors.length; i++) {
      if (anchors[i][0] >= a) { lo = anchors[i - 1]; hi = anchors[i]; break; }
    }
    const span = hi[0] - lo[0];
    const t = span <= 0 ? 0 : (a - lo[0]) / span;
    let r = lo[1] + t * (hi[1] - lo[1]);
    let g = lo[2] + t * (hi[2] - lo[2]);
    let b = lo[3] + t * (hi[3] - lo[3]);
    r = r + (200 - r) * (0.55 * cc);
    g = g + (200 - g) * (0.55 * cc);
    b = b + (210 - b) * (0.55 * cc);
    const dim = (1 - 0.40 * cc) * rain;
    r *= dim; g *= dim; b *= dim;
    return [
      Math.round(Math.max(0, Math.min(255, r))),
      Math.round(Math.max(0, Math.min(255, g))),
      Math.round(Math.max(0, Math.min(255, b))),
    ];
  }
  function rgbToHex(rgb) {
    return '#' + rgb.map(function (n) {
      return ('0' + n.toString(16)).slice(-2);
    }).join('');
  }
  function ambientLabel(alt, cc, precip, tempC) {
    if (alt < -6) return 'night';
    if (alt < 0) return 'twilight';
    if (precip > 0.1 && tempC != null && tempC < 1.5) return 'snow';
    if (precip > 6) return 'storm';
    if (precip > 2) return 'rain';
    if (precip > 0.3) return 'light-rain';
    if (cc > 0.85) return 'overcast';
    if (cc > 0.4) return 'partly-cloudy';
    return 'clear-sunny';
  }
  function weatherMood(alt, cc, precip, tempC, label) {
    if (alt < -6) return 'night';
    if (alt < 0) return 'twilight';
    if (label === 'snow' || (precip > 0.1 && tempC != null && tempC < 1.5)) return 'snow';
    if (label === 'storm' || precip > 6 || (precip > 3 && cc > 0.7)) return 'storm';
    if (label === 'rain' || precip > 1.5) return 'rain';
    if (label === 'light-rain' || precip > 0.2) return 'light-rain';
    if (label === 'overcast' || cc > 0.8) return 'heavy-cloud';
    if (label === 'partly-cloudy' || cc > 0.35) return 'light-cloud';
    return 'bright';
  }
  function cloudCover01(wx) {
    if (!wx || !wx.success) return 0;
    const n = Number(wx.cloud_cover);
    if (!Number.isFinite(n)) return 0;
    return n > 1 ? clamp01(n / 100) : clamp01(n);
  }
  function precipMmH(wx) {
    if (!wx || !wx.success) return 0;
    const n = Number(wx.precipitation_mm);
    return Number.isFinite(n) ? Math.max(0, n) : 0;
  }
  function fmtLux(lux) {
    if (!(lux >= 0)) return '\u2014 lx';
    if (lux >= 1000) return Math.round(lux).toLocaleString() + ' lx';
    if (lux >= 10) return Math.round(lux) + ' lx';
    if (lux >= 1) return lux.toFixed(1) + ' lx';
    return lux.toFixed(2) + ' lx';
  }
  function useElcOutdoorWeather(lat, lon) {
    const React = global.React;
    const [wx, setWx] = React.useState(null);
    React.useEffect(function () {
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return undefined;
      let cancelled = false;
      const pull = function () {
        if (typeof global.red5FetchCurrentWeather !== 'function') return;
        global.red5FetchCurrentWeather(lat, lon).then(function (p) {
          if (!cancelled) setWx(p);
        });
      };
      pull();
      const id = setInterval(pull, 5 * 60 * 1000);
      return function () { cancelled = true; clearInterval(id); };
    }, [lat, lon]);
    return wx;
  }

  global.ElcAhuAmbientChrome = function ElcAhuAmbientChrome(props) {
    const React = global.React;
    const mode = (props && props.darkenMode) || 'auto';
    const pctMode = (props && props.darkenPctMode) || 'tod';
    const sunEl = Number(props && props.sunEl);
    const lux = Number(props && props.lux);
    const hex = (props && props.colorHex) || '#333';
    const label = (props && props.label) || '\u2014';
    const moodKey = (props && props.mood) || 'none';
    const mood = WX_MOOD[moodKey] || WX_MOOD.none;
    const tempC = props && props.tempC;
    const cc = Number(props && props.cloudCover) || 0;
    const tintOn = mode !== 'off';
    const autoTod = mode === 'auto';
    const tod = autoTod || pctMode !== 'manual';
    const pct = Number(props && props.darkenPct);
    const pctTxt = Number.isFinite(pct) ? String(pct) : '\u2014';
    const darkenLabel = mode === 'auto' ? 'Darken: Auto' : (mode === 'on' ? 'Darken: On' : 'Darken: Off');
    const tempTxt = Number.isFinite(tempC) ? (Math.round(tempC * 10) / 10) + '\u00B0C' : null;
    const ccTxt = Math.round(cc * 100) + '% cloud';
    return React.createElement('div', {
      className: 'pointer-events-auto',
      'data-testid': 'elc-floor-ambient-chrome',
      onMouseDown: function (e) { e.stopPropagation(); },
      style: { width: 248 },
    },
      React.createElement('div', {
        className: 'rounded-md border shadow-2xl backdrop-blur-md px-2 py-1.5 space-y-1',
        style: { background: 'rgba(16,20,26,0.92)', borderColor: '#334155' },
      },
        React.createElement('div', { className: 'flex items-center gap-1.5' },
          React.createElement('span', {
            'data-testid': 'elc-floor-ambient-swatch',
            style: {
              display: 'inline-block', width: 12, height: 12, borderRadius: 2,
              border: '1px solid #475569', background: hex, flexShrink: 0,
            },
          }),
          React.createElement('span', {
            className: 'text-[11px] leading-none',
            style: { color: '#e2e8f0' },
          }, mood.icon + ' ' + mood.label),
          React.createElement('span', {
            className: 'ml-auto font-mono text-[11px] font-black tabular-nums',
            'data-testid': 'elc-floor-ambient-lux',
            style: { color: '#fbbf24' },
          }, fmtLux(lux))
        ),
        React.createElement('div', {
          className: 'text-[9px] font-mono truncate',
          style: { color: '#94a3b8' },
          title: 'Outside weather + horizontal lux from site TOD (sun altitude) and live cloud/precip',
        }, label + (tempTxt ? ' \u00b7 ' + tempTxt : '') + ' \u00b7 ' + ccTxt),
        React.createElement('div', { className: 'flex items-center gap-1.5 flex-wrap' },
          React.createElement('button', {
            type: 'button',
            'data-testid': 'elc-floor-darken-toggle',
            title: 'Tint overlay: Auto follows TOD (90%\u219230%\u219290% sunrise\u2013noon\u2013sunset). On locks a level; Off disables.',
            onClick: function () { if (props.onCycleDarken) props.onCycleDarken(); },
            className: 'px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ' +
              (tintOn ? 'bg-emerald-900/50 text-emerald-300 border-emerald-500/60' : 'bg-slate-800 text-slate-300 border-slate-600'),
          }, darkenLabel),
          React.createElement('button', {
            type: 'button',
            'data-testid': 'elc-floor-darken-level-pct',
            disabled: autoTod || !tintOn,
            title: autoTod
              ? 'Darken Auto tracks sunrise\u2192noon\u2192sunset (90%\u219230%\u219290%). Switch to Darken: On to lock a level.'
              : (tod
                ? 'Following sunrise\u2192noon\u2192sunset. Drag slider to lock.'
                : 'Locked level. Click to follow time of day again.'),
            onClick: function () { if (!autoTod && tintOn && props.onDarkenTod) props.onDarkenTod(); },
            className: 'px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ' +
              (!tod && tintOn ? 'bg-emerald-900/40 text-emerald-200 border-emerald-500/50' : 'bg-slate-800 text-slate-400 border-slate-600'),
            style: { opacity: tintOn ? 1 : 0.45, minWidth: '4.5em' },
          }, tod ? (pctTxt + '% \u00b7 TOD') : (pctTxt + '%'))
        ),
        tintOn && !autoTod && React.createElement('input', {
          type: 'range', min: 30, max: 90, step: 1,
          value: Number.isFinite(pct) ? pct : 90,
          'data-testid': 'elc-floor-darken-level',
          className: 'w-full accent-emerald-400',
          style: { height: 12 },
          'aria-label': 'Background darkness percent',
          onChange: function (e) {
            if (props.onDarkenPct) props.onDarkenPct(+e.target.value);
          },
        })
      )
    );
  };

  global.ElcAhuAmbientChromeLive = function ElcAhuAmbientChromeLive(props) {
    const React = global.React;
    const lat = Number(props && props.lat);
    const lon = Number(props && props.lon);
    const elevationM = Number(props && props.elevation_m) || 0;
    const timezone = (props && props.timezone) || '';
    const clock = useElcSunClock(timezone, lon);
    const dark = useElcAhuDarken();
    const wx = useElcOutdoorWeather(lat, lon);
    const sun = (Number.isFinite(lat) && Number.isFinite(lon))
      ? sunAtCivilTod(lat, lon, clock.doy, clock.hour, elevationM, timezone)
      : null;
    const sunEl = sun ? sun.elevation : NaN;
    const cc = cloudCover01(wx);
    const precip = precipMmH(wx);
    const tempC = wx && wx.success ? Number(wx.temperature_c) : NaN;
    const lux = Number.isFinite(sunEl) ? horizontalIlluminanceLux(sunEl, cc, precip) : NaN;
    const rgb = Number.isFinite(sunEl) ? ambientRgb(lux, sunEl, cc, precip) : [51, 51, 51];
    const label = Number.isFinite(sunEl)
      ? ambientLabel(sunEl, cc, precip, Number.isFinite(tempC) ? tempC : null)
      : '\u2014';
    const mood = Number.isFinite(sunEl)
      ? weatherMood(sunEl, cc, precip, Number.isFinite(tempC) ? tempC : null, label)
      : 'none';
    const pct = effectiveAhuDarkenPct(sunEl, lat, lon, clock.doy, timezone, elevationM);
    return global.ElcAhuAmbientChrome({
      sunEl: sunEl, lux: lux, colorHex: rgbToHex(rgb), label: label, mood: mood,
      tempC: Number.isFinite(tempC) ? tempC : null, cloudCover: cc,
      darkenMode: dark.mode, darkenPctMode: dark.pctMode, darkenPct: pct,
      onCycleDarken: cycleAhuDarkenMode,
      onDarkenPct: setAhuDarkenPctManual,
      onDarkenTod: setAhuDarkenPctTod,
    });
  };

  global.ElcAhuDarkenVeil = function ElcAhuDarkenVeil(props) {
    const React = global.React;
    const lat = Number(props && props.lat);
    const lon = Number(props && props.lon);
    const elevationM = Number(props && props.elevation_m) || 0;
    const timezone = (props && props.timezone) || '';
    const clock = useElcSunClock(timezone, lon);
    const dark = useElcAhuDarken();
    if (dark.mode === 'off') return null;
    const sun = (Number.isFinite(lat) && Number.isFinite(lon))
      ? sunAtCivilTod(lat, lon, clock.doy, clock.hour, elevationM, timezone)
      : null;
    const sunEl = sun ? sun.elevation : 0;
    const pct = effectiveAhuDarkenPct(sunEl, lat, lon, clock.doy, timezone, elevationM);
    return React.createElement('div', {
      'data-testid': 'elc-floor-darken-veil',
      className: 'pointer-events-none',
      style: {
        position: 'absolute',
        left: 0, top: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,' + (pct / 100) + ')',
        zIndex: 2,
      },
    });
  };

  global.ElcFloorAmbientChromeLive = global.ElcAhuAmbientChromeLive;
  global.ElcFloorDarkenVeil = global.ElcAhuDarkenVeil;

  global.ElcSunPathHostChrome = function ElcSunPathHostChrome(props) {
    return global.ElcSunPathControls(Object.assign({}, props, {
      hostPinned: true,
      operatorAdj: props.operatorAdj !== false,
      hideScrubbers: true,
    }));
  };

  global.ElcSunPathHostChromeLive = function ElcSunPathHostChromeLive(props) {
    const ui = useElcSunUi();
    return global.ElcSunPathHostChrome({
      enabled: ui.enabled,
      adj: ui.adj,
      operatorAdj: props && props.operatorAdj,
      style: props && props.style,
      onToggle: setSunPathEnabledShared,
      onAdjStep: applySunAdjShared,
    });
  };

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
    sunAtCivilTodForFloor: sunAtCivilTodForFloor,
    horizonDipDeg: horizonDipDeg,
    clockEvent: CLOCK_EVT,
    clockSnapshot: clockSnapshot,
    setClockFollow: setClockFollow,
    setClockParts: setClockParts,
    setClockStep: setClockStep,
    setEnabled: setSunPathEnabledShared,
    applyAdj: applySunAdjShared,
    sunUiEvent: SUN_UI_EVT,
    ahuDarkenEvent: AHU_DARKEN_EVT,
    ahuDarkenSnapshot: ahuDarkenSnapshot,
    setAhuDarkenMode: setAhuDarkenMode,
    cycleAhuDarkenMode: cycleAhuDarkenMode,
  };
  global.red5ElcSunAtTod = sunAtCivilTod;
  global.red5ElcSunAtTodForFloor = sunAtCivilTodForFloor;
  global.ElcSunPathOverlay = global.ElcSunPathOnFloor;
  global.ElcSunPathToolbar = function ElcSunPathToolbar(props) {
    const p = Object.assign({}, props, {
      onAdjStep: function (kind) {
        const next = applySunAdjShared(kind);
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
    const ui = useElcSunUi();
    const enabled = ui.enabled;
    const adj = ui.adj;
    const lat = props && props.lat;
    const lon = props && props.lon;
    const elevationM = Number(props && props.elevation_m) || 0;
    const timezone = (props && props.timezone) || '';
    const clock = useElcSunClock(timezone, lon);
    const hour = clock.hour;
    const doy = clock.doy;
    const hostProbeRef = React.useRef(null);
    const [hostEl, setHostEl] = React.useState(null);

    const sun = (Number.isFinite(lat) && Number.isFinite(lon))
      ? sunAtCivilTodForFloor(lat, lon, doy, hour, elevationM, timezone)
      : null;

    React.useEffect(function () {
      const payload = { enabled: !!enabled, sun: sun, hour: hour, doy: doy };
      if (props && props.onChange) props.onChange(payload);
      try { global.dispatchEvent(new CustomEvent('r5-sun-state', { detail: payload })); } catch (_) {}
    }, [enabled, hour, doy, lat, lon, elevationM, timezone, sun && sun.azimuth, sun && sun.elevation]);

    React.useLayoutEffect(function () {
      const n = hostProbeRef.current;
      const zone = n && n.closest ? n.closest('.red5-graphic-zone') : null;
      setHostEl(zone || null);
    }, []);

    const controls = React.createElement(global.ElcSunPathControls, {
      key: 'ctrl',
      enabled: enabled, adj: adj,
      hostPinned: true,
      operatorAdj: true,
      hideScrubbers: true,
      onToggle: setSunPathEnabledShared,
      onAdjStep: applySunAdjShared,
    });
    const RD = global.ReactDOM;
    const hostChrome = (hostEl && RD && typeof RD.createPortal === 'function')
      ? RD.createPortal(controls, hostEl)
      : controls;

    return React.createElement(React.Fragment, null,
      React.createElement('span', { ref: hostProbeRef, style: { display: 'none' } }),
      React.createElement(global.ElcSunPathOnFloor, {
        enabled: enabled, lat: lat, lon: lon, elevation_m: elevationM,
        timezone: timezone,
        sun: sun, hour: hour, doy: doy, adj: adj,
        orientation: props && props.orientation,
        northOffsetDeg: props && props.northOffsetDeg,
        showCardinals: props && props.showCardinals,
      }),
      hostChrome
    );
  };
})(typeof window !== 'undefined' ? window : this);
