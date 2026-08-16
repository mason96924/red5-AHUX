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
  function clockParts(date) {
    const d = (date instanceof Date) ? date : new Date(date);
    if (Number.isNaN(d.getTime())) {
      const now = new Date();
      return { y: now.getFullYear(), mo: now.getMonth(), da: now.getDate(),
        h: now.getHours(), mi: now.getMinutes(), se: now.getSeconds(), doy: dayOfYear(now) };
    }
    return { y: d.getFullYear(), mo: d.getMonth(), da: d.getDate(),
      h: d.getHours(), mi: d.getMinutes(), se: d.getSeconds(), doy: dayOfYear(d) };
  }

  function solarAltAz(latRad, doy, hour, lonDeg, tzHours) {
    const lon = Number(lonDeg) || 0;
    let tz = tzHours;
    if (tz == null || !Number.isFinite(tz)) tz = -new Date().getTimezoneOffset() / 60;
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

  function ensureEph(latDeg, lonDeg) {
    const key = Number(latDeg).toFixed(4) + '|' + Number(lonDeg).toFixed(4);
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
        const p = solarAltAz(lat, d, h, lonDeg);
        return { s: sph(p.az, p.el > 0 ? p.el : 0), up: p.el > 0 };
      });
    });
    function sampleDay(day, stepMin) {
      const pts = [];
      for (let m = 0; m <= 1440; m += stepMin) pts.push(solarAltAz(lat, day, m / 60, lonDeg));
      return pts;
    }
    const monthDoys = [21, 52, 80, 111, 141, 172, 202, 233, 264, 294, 325, 355];
    const monthSamples = monthDoys.map(function (d) { return { d: d, pts: sampleDay(d, 8) }; });
    const analemmas = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map(function (hr) {
      const pts = [];
      for (let d = 1; d <= 367; d += 2) pts.push(solarAltAz(lat, ((d - 1) % 365) + 1, hr, lonDeg));
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

  function drawYearMesh(ctx, project, skyTo, ground, toCam, eph, cx, cy) {
    ctx.beginPath();
    for (let d = 0; d <= 360; d += 3) {
      const q = ground(d * Math.PI / 180);
      if (d === 0) ctx.moveTo(q.x, q.y); else ctx.lineTo(q.x, q.y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(80, 140, 190, 0.10)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(120, 180, 220, 0.55)';
    ctx.lineWidth = 1.4;
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

    ctx.setLineDash([1.6, 3.4]);
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
      ctx.strokeStyle = (an.hr % 3 === 0) ? 'rgba(200, 55, 48, 0.78)' : 'rgba(200, 55, 48, 0.48)';
      ctx.lineWidth = (an.hr % 3 === 0) ? 1.15 : 0.8;
      ctx.lineJoin = 'round';
      ctx.stroke();
    });
    ctx.setLineDash([]);
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
    const tod = clockParts(clock);
    const doy = (opts.doy != null) ? Number(opts.doy) : tod.doy;
    const hour = (opts.hour != null) ? Number(opts.hour) : (tod.h + tod.mi / 60);

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
    const eCam = lookAt(tiltPt(sph(Math.PI / 2, 0)));
    const pnx = nCam.sx, pny = -nCam.sy;
    const pex = eCam.sx, pey = -eCam.sy;
    const det = pnx * pey - pny * pex;
    let m00, m01, m10, m11;
    if (Math.abs(det) < 1e-8) {
      const angN = Math.atan2(pny, pnx);
      const angFloorN = Math.atan2(ny, nx);
      const rot2 = angFloorN - angN;
      const cr = Math.cos(rot2), sr = Math.sin(rot2);
      m00 = cr * R; m01 = -sr * R;
      m10 = sr * R; m11 = cr * R;
    } else {
      const inv = 1 / det;
      const b00 = R * nx, b01 = R * ex;
      const b10 = R * ny, b11 = R * ey;
      const a00i = pey * inv, a01i = -pex * inv;
      const a10i = -pny * inv, a11i = pnx * inv;
      m00 = b00 * a00i + b01 * a10i;
      m01 = b00 * a01i + b01 * a11i;
      m10 = b10 * a00i + b11 * a10i;
      m11 = b10 * a01i + b11 * a11i;
    }
    function project(p) {
      const c = lookAt(tiltPt(p));
      const vx = c.sx, vy = -c.sy;
      return {
        x: cx + m00 * vx + m01 * vy,
        y: cy + m10 * vx + m11 * vy,
        depth: c.depth
      };
    }
    function skyTo(az, el) { return project(sph(az, el)); }
    function ground(az) { return skyTo(az, 0); }

    const eph = ensureEph(latDeg, lonDeg);
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
    ctx.drawImage(layerCache.canvas, 0, 0, W * dpr, H * dpr, 0, 0, W, H);
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
    if (!eph.today || eph.today.doy !== doy) {
      const pts = [];
      for (let m = 0; m <= 1440; m += 5) pts.push(solarAltAz(eph.lat, doy, m / 60, lonDeg));
      eph.today = { doy: doy, pts: pts };
    }
    strokeDay(eph.today.pts, 'rgba(220, 40, 32, 0.95)', 2.0);

    [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].forEach(function (hr) {
      const p = solarAltAz(lat, doy, hr, lonDeg);
      if (p.el <= 0) return;
      const q = skyTo(p.az, p.el);
      ctx.beginPath(); ctx.arc(q.x, q.y, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(220, 40, 32, 0.95)'; ctx.fill();
      ctx.fillStyle = 'rgba(220, 40, 32, 0.95)';
      ctx.font = 'bold 12px ui-sans-serif, system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(String(hr).padStart(2, '0'), q.x, q.y - 4);
    });

    const live = solarAltAzAt(latDeg, lonDeg, clock);
    const liveEl = (opts.sun && Number.isFinite(opts.sun.elevation))
      ? opts.sun.elevation * Math.PI / 180 : live.el;
    const liveAz = (opts.sun && Number.isFinite(opts.sun.azimuth))
      ? opts.sun.azimuth * Math.PI / 180 : live.az;
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
    const adj = props.adj || { size: 1, rot: 0, look: 0, tilt: 0 };
    const hour = props.hour;
    const doy = props.doy;
    const sun = props.sun;
    const orientation = props.orientation;
    const northOffsetDeg = props.northOffsetDeg;
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
        const date = (hour != null && doy != null)
          ? new Date(Date.UTC(new Date().getFullYear(), 0, doy, Math.floor(hour) - Math.round(lon / 15), Math.round((hour % 1) * 60), 0))
          : new Date();
        paintElcSunPath(ctx, {
          width: W, height: H, dpr: 1,
          lat: lat, lon: lon, date: date, hour: hour, doy: doy,
          sun: sun, adj: adj, orientation: orientation,
          northOffsetDeg: northOffsetDeg
        });
      }
      paint();
      const ro = (typeof ResizeObserver !== 'undefined')
        ? new ResizeObserver(paint) : null;
      if (ro) ro.observe(wrap);
      return function () { if (ro) ro.disconnect(); };
    }, [enabled, lat, lon, adj.size, adj.rot, adj.look, adj.tilt,
        hour, doy, sun && sun.azimuth, sun && sun.elevation,
        orientation, oKey, northOffsetDeg]);

    if (!enabled) return null;
    return React.createElement('div', {
      ref: wrapRef,
      className: 'absolute inset-0 pointer-events-none',
      style: { zIndex: 7 },
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
  };
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
    const [hour, setHour] = React.useState(function () { return new Date().getHours(); });
    const [doy, setDoy] = React.useState(function () { return dayOfYear(new Date()); });
    const lat = props && props.lat;
    const lon = props && props.lon;
    const year = new Date().getFullYear();
    const tzOffsetH = Math.round((Number(lon) || 0) / 15);
    const utcMs = Date.UTC(year, 0, doy) + (hour - tzOffsetH) * 3600000;
    const date = new Date(utcMs);
    const sun = (global.red5SolarPosition && Number.isFinite(lat) && Number.isFinite(lon))
      ? global.red5SolarPosition(lat, lon, date)
      : null;

    React.useEffect(function () {
      try { localStorage.setItem('elc.floor.sunPathOverlay', enabled ? '1' : '0'); } catch (_) {}
      const payload = { enabled: !!enabled, sun: sun, hour: hour, doy: doy };
      if (props && props.onChange) props.onChange(payload);
      try { global.dispatchEvent(new CustomEvent('r5-sun-state', { detail: payload })); } catch (_) {}
    }, [enabled, hour, doy, lat, lon, sun && sun.azimuth, sun && sun.elevation]);

    return React.createElement(React.Fragment, null,
      React.createElement(global.ElcSunPathOnFloor, {
        enabled: enabled, lat: lat, lon: lon, sun: sun, hour: hour, doy: doy,
        adj: adj, orientation: props && props.orientation,
        northOffsetDeg: props && props.northOffsetDeg, date: date,
      }),
      React.createElement(global.ElcSunPathControls, {
        enabled: enabled, hour: hour, doy: doy, adj: adj,
        onToggle: setEnabled, onHour: setHour, onDoy: setDoy,
        onAdjStep: function (kind) { setAdj(applyAdjStep(adj, kind)); },
      })
    );
  };
})(typeof window !== 'undefined' ? window : this);
