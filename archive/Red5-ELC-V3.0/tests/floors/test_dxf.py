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



class TestWindowExtraction:
    """2026-02-12aj — auto-extract windows from DXF LINEs on any
    layer whose name contains 'WIN' (case-insensitive)."""

    def test_lines_on_windows_layer_become_windows(self):
        def _b(doc):
            msp = doc.modelspace()
            # 10 m × 6 m floor rectangle drawn as 4 walls on layer 0.
            msp.add_line((0, 0), (10000, 0))
            msp.add_line((10000, 0), (10000, 6000))
            msp.add_line((10000, 6000), (0, 6000))
            msp.add_line((0, 6000), (0, 0))
            doc.layers.add(name="WINDOWS", color=5)
            # One N-wall window (horizontal), one E-wall (vertical),
            # one S-wall (horizontal), one W-wall (vertical).
            # Coordinates in mm.
            msp.add_line((2000, 6000), (3200, 6000),  # N wall, top of drawing
                         dxfattribs={"layer": "WINDOWS"})
            msp.add_line((10000, 4000), (10000, 5000),  # E wall
                         dxfattribs={"layer": "WINDOWS"})
            msp.add_line((5000, 0),    (6500, 0),  # S wall
                         dxfattribs={"layer": "WINDOWS"})
            msp.add_line((0, 2000),    (0, 3000),  # W wall
                         dxfattribs={"layer": "WINDOWS"})
            doc.header["$INSUNITS"] = 4
        r = dxf_to_svg(_dxf_bytes(_b))
        assert len(r.windows) == 4
        # Every window has the full schema populated.
        for w in r.windows:
            for k in ("id", "x_m", "y_m", "length_m", "angle_deg",
                      "blind_level", "sill_height_m", "head_height_m", "name"):
                assert k in w, f"missing {k}"
        # Sorted top-to-bottom, then left-to-right.  DXF y flipped so
        # the (2000..3200, 6000) window ends up near y_m ≈ 0 (top).
        assert r.windows[0]["y_m"] < r.windows[-1]["y_m"]
        # Every name matches the {DIR}_W{n} pattern.
        names = [w["name"] for w in r.windows]
        for n in names:
            assert n[:2] in ("N_", "E_", "S_", "W_"), n
        # Exactly one N, one E, one S, one W in this fixture.
        dirs = sorted(n[:1] for n in names)
        assert dirs == ["E", "N", "S", "W"]

    def test_case_insensitive_layer_and_alternate_names(self):
        def _b(doc):
            msp = doc.modelspace()
            msp.add_line((0, 0), (5000, 0))
            msp.add_line((5000, 0), (5000, 3000))
            msp.add_line((5000, 3000), (0, 3000))
            msp.add_line((0, 3000), (0, 0))
            for lname in ("Windows", "win", "A-GLAZ-WIN"):
                doc.layers.add(name=lname, color=5)
            msp.add_line((1000, 3000), (2000, 3000),
                         dxfattribs={"layer": "Windows"})
            msp.add_line((3000, 3000), (4000, 3000),
                         dxfattribs={"layer": "win"})
            msp.add_line((4500, 3000), (4900, 3000),
                         dxfattribs={"layer": "A-GLAZ-WIN"})
            doc.header["$INSUNITS"] = 4
        r = dxf_to_svg(_dxf_bytes(_b))
        assert len(r.windows) == 3

    def test_non_window_layers_ignored(self):
        def _b(doc):
            msp = doc.modelspace()
            msp.add_line((0, 0), (5000, 0))
            msp.add_line((5000, 0), (5000, 3000))
            msp.add_line((5000, 3000), (0, 3000))
            msp.add_line((0, 3000), (0, 0))
            doc.layers.add(name="DOORS", color=6)
            doc.layers.add(name="FURNITURE", color=7)
            msp.add_line((1000, 0), (2000, 0),
                         dxfattribs={"layer": "DOORS"})
            msp.add_line((3000, 1000), (4000, 1000),
                         dxfattribs={"layer": "FURNITURE"})
            doc.header["$INSUNITS"] = 4
        r = dxf_to_svg(_dxf_bytes(_b))
        assert r.windows == []

    def test_degenerate_sub_20cm_segments_dropped(self):
        def _b(doc):
            msp = doc.modelspace()
            msp.add_line((0, 0), (5000, 0))
            msp.add_line((5000, 0), (5000, 3000))
            msp.add_line((5000, 3000), (0, 3000))
            msp.add_line((0, 3000), (0, 0))
            doc.layers.add(name="WINDOWS", color=5)
            # 100 mm = 0.1 m — under the 0.2 m guard.
            msp.add_line((1000, 3000), (1100, 3000),
                         dxfattribs={"layer": "WINDOWS"})
            # 800 mm = 0.8 m — kept.
            msp.add_line((2000, 3000), (2800, 3000),
                         dxfattribs={"layer": "WINDOWS"})
            doc.header["$INSUNITS"] = 4
        r = dxf_to_svg(_dxf_bytes(_b))
        assert len(r.windows) == 1
        assert r.windows[0]["length_m"] == pytest.approx(0.8, rel=1e-3)



class TestSlabExtraction:
    """2026-02-13 — auto-trace slab footprint from DXF."""

    def test_no_polylines_returns_none(self):
        r = dxf_to_svg(_dxf_bytes(_rect(5000, 3000)))
        assert r.slab is None

    def test_slab_layer_wins(self):
        """A polyline on SLAB / OUTLINE layer takes precedence."""
        def _b(doc):
            msp = doc.modelspace()
            doc.layers.add(name="SLAB", color=1)
            # Large L-shape on SLAB
            msp.add_lwpolyline(
                [(0, 0), (5000, 0), (5000, 3000), (2000, 3000),
                 (2000, 5000), (0, 5000)],
                close=True,
                dxfattribs={"layer": "SLAB"},
            )
            # Larger dummy polygon on a random layer — should be ignored.
            msp.add_lwpolyline(
                [(0, 0), (9000, 0), (9000, 6000), (0, 6000)],
                close=True,
                dxfattribs={"layer": "0"},
            )
            doc.header["$INSUNITS"] = 4
        r = dxf_to_svg(_dxf_bytes(_b))
        assert r.slab is not None
        assert r.slab["type"] == "polyline"
        assert len(r.slab["vertices"]) == 6      # L-shape has 6 corners

    def test_outline_layer_keyword(self):
        def _b(doc):
            msp = doc.modelspace()
            doc.layers.add(name="A-OUTLINE-BUILDING", color=1)
            msp.add_lwpolyline(
                [(0, 0), (4000, 0), (4000, 3000), (0, 3000)],
                close=True,
                dxfattribs={"layer": "A-OUTLINE-BUILDING"},
            )
            doc.header["$INSUNITS"] = 4
        r = dxf_to_svg(_dxf_bytes(_b))
        assert r.slab is not None
        assert len(r.slab["vertices"]) == 4

    def test_largest_polyline_fallback(self):
        """No SLAB layer -> largest closed LWPOLYLINE wins."""
        def _b(doc):
            msp = doc.modelspace()
            # Small square (300k mm^2)
            msp.add_lwpolyline(
                [(0, 0), (300, 0), (300, 1000), (0, 1000)],
                close=True,
            )
            # Big rectangle (~10M mm^2) — should win.
            msp.add_lwpolyline(
                [(0, 0), (5000, 0), (5000, 2000), (0, 2000)],
                close=True,
            )
            doc.header["$INSUNITS"] = 4
        r = dxf_to_svg(_dxf_bytes(_b))
        assert r.slab is not None
        # 5m x 2m rectangle
        xs = [v[0] for v in r.slab["vertices"]]
        ys = [v[1] for v in r.slab["vertices"]]
        assert max(xs) - min(xs) == pytest.approx(5.0, rel=1e-3)
        assert max(ys) - min(ys) == pytest.approx(2.0, rel=1e-3)

    def test_rooms_layer_skipped_from_fallback(self):
        """ROOMS-layer polylines must never be used as slab outline."""
        def _b(doc):
            msp = doc.modelspace()
            doc.layers.add(name="ROOMS", color=2)
            # HUGE room polygon on ROOMS layer.
            msp.add_lwpolyline(
                [(0, 0), (9000, 0), (9000, 8000), (0, 8000)],
                close=True,
                dxfattribs={"layer": "ROOMS"},
            )
            # Tiny generic polyline.
            msp.add_lwpolyline(
                [(0, 0), (100, 0), (100, 100), (0, 100)],
                close=True,
            )
            doc.header["$INSUNITS"] = 4
        r = dxf_to_svg(_dxf_bytes(_b))
        # The ROOMS polygon is excluded → the tiny one wins.
        assert r.slab is not None
        xs = [v[0] for v in r.slab["vertices"]]
        assert max(xs) - min(xs) == pytest.approx(0.1, rel=1e-3)


class TestImageSlabTracer:
    """2026-02-13 — image_to_slab() OpenCV contour tracer."""

    def _rect_png(self, w=200, h=100, margin=20) -> bytes:
        """Return a PNG with a filled dark rectangle on a white bg."""
        import io as _io
        import numpy as np
        from PIL import Image
        arr = np.full((h, w), 255, dtype=np.uint8)
        arr[margin:h - margin, margin:w - margin] = 0
        img = Image.fromarray(arr, mode="L")
        buf = _io.BytesIO()
        img.save(buf, format="PNG")
        return buf.getvalue()

    def test_traces_rectangle(self):
        from elc.floors.dxf import image_to_slab
        png = self._rect_png(w=200, h=100, margin=20)
        slab = image_to_slab(png, physical_width_m=10.0, physical_height_m=5.0)
        assert slab["type"] == "polyline"
        # A clean rectangle should approximate to 4 vertices.
        assert len(slab["vertices"]) == 4
        xs = [v[0] for v in slab["vertices"]]
        ys = [v[1] for v in slab["vertices"]]
        # Interior dark rect covers pixels 20..180 wide -> 8 m in real world.
        assert max(xs) - min(xs) == pytest.approx(8.0, abs=0.3)
        # 20..80 tall -> 3 m real.
        assert max(ys) - min(ys) == pytest.approx(3.0, abs=0.3)

    def test_empty_image_rejected(self):
        from elc.floors.dxf import image_to_slab
        with pytest.raises(DxfImportError):
            image_to_slab(b"")

    def test_garbage_rejected(self):
        from elc.floors.dxf import image_to_slab
        with pytest.raises(DxfImportError):
            image_to_slab(b"not-an-image-at-all")

    def test_pixel_coords_when_no_scale(self):
        from elc.floors.dxf import image_to_slab
        png = self._rect_png(w=200, h=100, margin=20)
        slab = image_to_slab(png)   # no physical dims -> pixel space
        xs = [v[0] for v in slab["vertices"]]
        # Should be around 160 px wide (200 - 40 margins).
        assert max(xs) - min(xs) == pytest.approx(160, abs=6)
