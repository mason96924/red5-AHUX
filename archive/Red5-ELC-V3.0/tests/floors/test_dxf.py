"""Phase 6.1 DXF → SVG converter tests.

We build tiny in-memory DXFs with ezdxf itself instead of committing
binary test assets — keeps the repo lean and the test authoritative
(if ezdxf's output format changes, so does the fixture).
"""
from __future__ import annotations

import io

import ezdxf
import pytest

from elc.floors.dxf import DxfImportError, dxf_to_svg


def _dxf_bytes(build_fn) -> bytes:
    doc = ezdxf.new()
    build_fn(doc)
    buf = io.StringIO()
    doc.write(buf)
    return buf.getvalue().encode("utf-8")


def _rect(width: int, height: int, insunits: int = 4):
    """Return a builder that draws an outline rectangle at (0,0) →
    (width, height) with the given DXF $INSUNITS code (4 = mm)."""
    def _build(doc):
        msp = doc.modelspace()
        msp.add_line((0, 0), (width, 0))
        msp.add_line((width, 0), (width, height))
        msp.add_line((width, height), (0, height))
        msp.add_line((0, height), (0, 0))
        doc.header["$INSUNITS"] = insunits
    return _build


class TestHappyPath:
    def test_mm_drawing(self):
        # 5000mm × 3000mm rectangle → 5m × 3m floor.
        r = dxf_to_svg(_dxf_bytes(_rect(5000, 3000, insunits=4)))
        assert r.width_m == pytest.approx(5.0, rel=1e-3)
        assert r.height_m == pytest.approx(3.0, rel=1e-3)
        assert r.svg.startswith("<?xml") or r.svg.startswith("<svg")
        assert "svg" in r.svg[:200]

    def test_metre_drawing(self):
        # 20m × 15m rectangle directly in metre units (INSUNITS=6).
        r = dxf_to_svg(_dxf_bytes(_rect(20, 15, insunits=6)))
        assert r.width_m == pytest.approx(20.0, rel=1e-3)
        assert r.height_m == pytest.approx(15.0, rel=1e-3)

    def test_feet_drawing(self):
        # 30ft × 20ft ≈ 9.144m × 6.096m.
        r = dxf_to_svg(_dxf_bytes(_rect(30, 20, insunits=2)))
        assert r.width_m == pytest.approx(9.144, rel=1e-3)
        assert r.height_m == pytest.approx(6.096, rel=1e-3)

    def test_unknown_units_default_to_mm(self):
        # $INSUNITS = 0 (unspecified) → we assume mm.
        r = dxf_to_svg(_dxf_bytes(_rect(2000, 1000, insunits=0)))
        assert r.width_m == pytest.approx(2.0, rel=1e-3)


class TestFailureModes:
    def test_empty_upload(self):
        with pytest.raises(DxfImportError):
            dxf_to_svg(b"")

    def test_garbage_bytes(self):
        with pytest.raises(DxfImportError):
            dxf_to_svg(b"this is not a DXF at all")

    def test_empty_drawing(self):
        # Valid DXF header, no geometry → converter refuses.
        with pytest.raises(DxfImportError, match="no drawable geometry"):
            dxf_to_svg(_dxf_bytes(lambda doc: None))


class TestRoomExtraction:
    """Phase 6.1c — closed LWPOLYLINEs on layer ``ROOMS`` become
    room polygons on the conversion result."""

    def _build_two_rooms(self, doc):
        msp = doc.modelspace()
        # Outer envelope so the drawing has extents.
        msp.add_lwpolyline(
            [(0, 0), (10_000, 0), (10_000, 6_000), (0, 6_000)],
            close=True,
        )
        doc.layers.add(name="ROOMS", color=3)
        # Two rooms: left half and right half.
        msp.add_lwpolyline(
            [(0, 0), (5_000, 0), (5_000, 6_000), (0, 6_000)],
            close=True, dxfattribs={"layer": "ROOMS"},
        )
        msp.add_lwpolyline(
            [(5_000, 0), (10_000, 0), (10_000, 6_000), (5_000, 6_000)],
            close=True, dxfattribs={"layer": "ROOMS"},
        )
        doc.header["$INSUNITS"] = 4    # mm

    def test_rooms_extracted(self):
        r = dxf_to_svg(_dxf_bytes(self._build_two_rooms))
        assert len(r.rooms) == 2
        for room in r.rooms:
            assert room["id"].startswith("R-")
            assert len(room["vertices"]) == 4
            # Coordinates in metres, top-left origin, y flipped so
            # they match the SVG viewport used by the frontend.
            for (x_m, y_m) in room["vertices"]:
                assert 0 - 1e-6 <= x_m <= 10.0 + 1e-6
                assert 0 - 1e-6 <= y_m <= 6.0 + 1e-6

    def test_no_rooms_layer_returns_empty(self):
        # A drawing with no ROOMS-layer polylines → rooms == [].
        r = dxf_to_svg(_dxf_bytes(_rect(5000, 3000, insunits=4)))
        assert r.rooms == []

    def test_open_polyline_on_rooms_layer_ignored(self):
        def _b(doc):
            msp = doc.modelspace()
            msp.add_line((0, 0), (5000, 0))
            msp.add_line((5000, 0), (5000, 3000))
            msp.add_line((5000, 3000), (0, 3000))
            msp.add_line((0, 3000), (0, 0))
            doc.layers.add(name="ROOMS", color=3)
            # Open (close=False) LWPOLYLINE — not a valid boundary.
            msp.add_lwpolyline(
                [(500, 500), (2000, 500), (2000, 2000)],
                close=False, dxfattribs={"layer": "ROOMS"},
            )
            doc.header["$INSUNITS"] = 4
        r = dxf_to_svg(_dxf_bytes(_b))
        assert r.rooms == []
