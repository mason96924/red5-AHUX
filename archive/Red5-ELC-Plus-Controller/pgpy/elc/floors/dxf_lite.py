"""
elc.floors.dxf_lite — stdlib-only DXF → SVG for embedded controllers.

Parses ASCII DXF group codes directly (no ezdxf / numpy / Pillow).
Handles LINE + LWPOLYLINE in ENTITIES — enough for typical floor plans.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Any

from elc.floors.dxf import (
    DxfConversion,
    DxfImportError,
    _INSUNITS_TO_M,
    _DEFAULT_UNIT_M,
    _SLAB_LAYER_KEYWORDS,
    _polygon_area_m2,
    _theme_svg_for_dark_canvas,
)

_WIN_LAYER_RE = re.compile(r'WIN|GLAZ|GLASS', re.I)


@dataclass
class _Entity:
    kind: str
    layer: str = '0'
    x1: float = 0.0
    y1: float = 0.0
    x2: float = 0.0
    y2: float = 0.0
    closed: bool = False
    points: list[tuple[float, float]] = field(default_factory=list)


def _iter_groups(text: str):
    lines = text.splitlines()
    i = 0
    n = len(lines)
    while i + 1 < n:
        raw = lines[i].strip()
        if not raw.lstrip('-').isdigit():
            i += 1
            continue
        code = int(raw)
        value = lines[i + 1].strip()
        i += 2
        yield code, value


def _parse_insunits(text: str) -> int:
    in_header = False
    pending_var = ''
    for code, value in _iter_groups(text):
        if code == 2 and value == 'HEADER':
            in_header = True
            continue
        if code == 0 and in_header and value == 'ENDSEC':
            break
        if not in_header:
            continue
        if code == 9:
            pending_var = value
        elif pending_var == '$INSUNITS' and code == 70:
            try:
                return int(value)
            except ValueError:
                return 0
    return 0


def _parse_entities(text: str) -> list[_Entity]:
    entities: list[_Entity] = []
    in_entities = False
    cur: _Entity | None = None

    def _flush():
        nonlocal cur
        if cur is None:
            return
        if cur.kind == 'LINE' and not cur.points:
            cur.points = [(cur.x1, cur.y1), (cur.x2, cur.y2)]
        if cur.points or cur.kind == 'LINE':
            entities.append(cur)
        cur = None

    pending_x: float | None = None
    for code, value in _iter_groups(text):
        if code == 2 and value == 'ENTITIES':
            in_entities = True
            continue
        if code == 0 and in_entities and value == 'ENDSEC':
            _flush()
            break
        if not in_entities:
            continue
        if code == 0:
            _flush()
            if value in ('LINE', 'LWPOLYLINE', 'POLYLINE'):
                cur = _Entity(kind=value)
                pending_x = None
            else:
                cur = None
            continue
        if cur is None:
            continue
        if code == 8:
            cur.layer = value
        elif code == 70 and cur.kind in ('LWPOLYLINE', 'POLYLINE'):
            cur.closed = bool(int(value) & 1)
        elif code == 10:
            pending_x = float(value)
            if cur.kind == 'LINE':
                cur.x1 = float(value)
        elif code == 20:
            if cur.kind == 'LINE' and pending_x is not None:
                cur.y1 = float(value)
                cur.points = [(cur.x1, cur.y1), (cur.x2, cur.y2)]
            elif pending_x is not None:
                cur.points.append((pending_x, float(value)))
            pending_x = None
        elif code == 11:
            cur.x2 = float(value)
            if cur.kind == 'LINE':
                if cur.points:
                    cur.points[1] = (cur.x2, cur.points[1][1])
        elif code == 21:
            cur.y2 = float(value)
            if cur.kind == 'LINE':
                if len(cur.points) >= 2:
                    cur.points[1] = (cur.x2, cur.y2)
                elif cur.x2 or cur.y2:
                    cur.points = [(cur.x1, cur.y1), (cur.x2, cur.y2)]
    _flush()
    return entities


def _bbox(entities: list[_Entity]) -> tuple[float, float, float, float]:
    xs: list[float] = []
    ys: list[float] = []
    for ent in entities:
        for x, y in ent.points:
            xs.append(x)
            ys.append(y)
        if ent.kind == 'LINE':
            xs.extend([ent.x1, ent.x2])
            ys.extend([ent.y1, ent.y2])
    if not xs:
        raise DxfImportError('DXF contains no drawable geometry')
    return min(xs), min(ys), max(xs), max(ys)


def _to_m(x: float, y: float, *, unit_m: float, ox: float, oy: float, h_m: float):
    x_m = (x - ox) * unit_m
    y_m = h_m - (y - oy) * unit_m
    return x_m, y_m


def _svg_path(entities: list[_Entity], *, ox: float, oy: float,
              w_dxf: float, h_dxf: float, unit_m: float) -> str:
    """Minimal SVG: model coords in mm (1 SVG unit = 1 mm at drawing scale)."""
    scale_mm = unit_m * 1000.0
    lines: list[str] = []
    lines.append(
        f'<svg xmlns="http://www.w3.org/2000/svg" '
        f'viewBox="0 0 {w_dxf * scale_mm:.2f} {h_dxf * scale_mm:.2f}">'
    )
    stroke = 'stroke="#c8c8c8" stroke-width="1500" fill="none"'
    for ent in entities:
        if ent.kind == 'LINE' and ent.x1 == ent.x2 and ent.y1 == ent.y2:
            continue
        if ent.kind == 'LINE':
            x1 = (ent.x1 - ox) * scale_mm
            y1 = (h_dxf - (ent.y1 - oy)) * scale_mm
            x2 = (ent.x2 - ox) * scale_mm
            y2 = (h_dxf - (ent.y2 - oy)) * scale_mm
            lines.append(
                f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" {stroke}/>',
            )
        elif ent.points:
            pts = []
            for x, y in ent.points:
                px = (x - ox) * scale_mm
                py = (h_dxf - (y - oy)) * scale_mm
                pts.append(f'{px:.2f},{py:.2f}')
            tag = 'polygon' if ent.closed and len(ent.points) >= 3 else 'polyline'
            lines.append(f'<{tag} points="{" ".join(pts)}" {stroke}/>')
    lines.append('</svg>')
    return _theme_svg_for_dark_canvas('\n'.join(lines))


def _extract_rooms_lite(entities: list[_Entity], *, unit_m: float, ox: float,
                        oy: float, h_m: float) -> list[dict]:
    out: list[dict] = []
    idx = 0
    for ent in entities:
        if ent.kind not in ('LWPOLYLINE', 'POLYLINE') or not ent.closed:
            continue
        if ent.layer.upper() != 'ROOMS' or len(ent.points) < 3:
            continue
        verts = [_to_m(x, y, unit_m=unit_m, ox=ox, oy=oy, h_m=h_m) for x, y in ent.points]
        idx += 1
        out.append({'id': f'R-{idx}', 'name': f'Room {idx}', 'vertices': verts})
    return out


def _extract_slab_lite(entities: list[_Entity], *, unit_m: float, ox: float,
                       oy: float, h_m: float) -> dict | None:
    def _verts(ent: _Entity) -> list[list[float]]:
        return [_to_m(x, y, unit_m=unit_m, ox=ox, oy=oy, h_m=h_m) for x, y in ent.points]

    for ent in entities:
        if ent.kind not in ('LWPOLYLINE', 'POLYLINE') or not ent.closed:
            continue
        lyr = ent.layer.upper()
        if any(kw in lyr for kw in _SLAB_LAYER_KEYWORDS) and len(ent.points) >= 3:
            return {'type': 'polyline', 'vertices': _verts(ent), 'rotation_deg': 0.0}
    best: tuple[float, list[list[float]]] | None = None
    for ent in entities:
        if ent.kind not in ('LWPOLYLINE', 'POLYLINE') or not ent.closed:
            continue
        if ent.layer == 'ROOMS' or len(ent.points) < 3:
            continue
        verts = _verts(ent)
        area = _polygon_area_m2(verts)
        if best is None or area > best[0]:
            best = (area, verts)
    if best:
        return {'type': 'polyline', 'vertices': best[1], 'rotation_deg': 0.0}
    return None


def _extract_windows_lite(entities: list[_Entity], *, unit_m: float, ox: float,
                          oy: float, draw_h_m: float, w_m: float) -> list[dict]:
    import math
    import uuid
    raw: list[dict] = []
    for ent in entities:
        if not _WIN_LAYER_RE.search(ent.layer):
            continue
        if ent.kind == 'LINE':
            pts = [(ent.x1, ent.y1), (ent.x2, ent.y2)]
        elif len(ent.points) == 2:
            pts = ent.points
        else:
            continue
        (x1, y1), (x2, y2) = pts
        xm1, ym1 = _to_m(x1, y1, unit_m=unit_m, ox=ox, oy=oy, h_m=draw_h_m)
        xm2, ym2 = _to_m(x2, y2, unit_m=unit_m, ox=ox, oy=oy, h_m=draw_h_m)
        length = math.hypot(xm2 - xm1, ym2 - ym1)
        if length < 0.05:
            continue
        angle = math.degrees(math.atan2(ym2 - ym1, xm2 - xm1))
        raw.append({
            'id': uuid.uuid4().hex,
            'x_m': (xm1 + xm2) / 2.0,
            'y_m': (ym1 + ym2) / 2.0,
            'length_m': length,
            'angle_deg': angle,
            'blind_level': 0.0,
            'sill_height_m': 1.0,
            'head_height_m': 2.2,
            'name': '',
        })
    raw.sort(key=lambda w: (w['y_m'], w['x_m']))
    cx, cy = w_m / 2.0, draw_h_m / 2.0
    counters = {'N': 0, 'E': 0, 'S': 0, 'W': 0}
    for w in raw:
        dx, dy = w['x_m'] - cx, w['y_m'] - cy
        ang = ((w['angle_deg'] % 180) + 180) % 180
        dH, dV = min(ang, 180 - ang), abs(ang - 90)
        if dH <= 5:
            c = 'S' if dy >= 0 else 'N'
        elif dV <= 5:
            c = 'E' if dx >= 0 else 'W'
        elif abs(dx) > abs(dy):
            c = 'E' if dx >= 0 else 'W'
        else:
            c = 'S' if dy >= 0 else 'N'
        counters[c] += 1
        w['name'] = f'{c}_W{counters[c]}'
    return raw


def dxf_to_svg_lite(dxf_bytes: bytes) -> DxfConversion:
    """Convert DXF bytes using stdlib only."""
    if not dxf_bytes:
        raise DxfImportError('empty upload')
    text = dxf_bytes.decode('utf-8', errors='ignore')
    if 'SECTION' not in text and 'ENTITIES' not in text:
        raise DxfImportError('could not parse DXF: not a DXF file')
    entities = _parse_entities(text)
    if not entities:
        raise DxfImportError('DXF contains no drawable geometry')
    min_x, min_y, max_x, max_y = _bbox(entities)
    insunits = _parse_insunits(text)
    unit_m = _INSUNITS_TO_M.get(int(insunits), _DEFAULT_UNIT_M)
    w_dxf = max(max_x - min_x, 0.1)
    h_dxf = max(max_y - min_y, 0.1)
    width_m = max(w_dxf * unit_m, 0.1)
    height_m = max(h_dxf * unit_m, 0.1)
    svg = _svg_path(entities, ox=min_x, oy=min_y, w_dxf=w_dxf, h_dxf=h_dxf, unit_m=unit_m)
    rooms = _extract_rooms_lite(
        entities, unit_m=unit_m, ox=min_x, oy=min_y, h_m=height_m,
    )
    slab = _extract_slab_lite(
        entities, unit_m=unit_m, ox=min_x, oy=min_y, h_m=height_m,
    )
    windows = _extract_windows_lite(
        entities, unit_m=unit_m, ox=min_x, oy=min_y,
        draw_h_m=height_m, w_m=width_m,
    )
    return DxfConversion(
        svg=svg, width_m=width_m, height_m=height_m,
        rooms=rooms, windows=windows, slab=slab,
    )
