"""
elc.floors
==========
Phase 6.1 — floor plans + fixture placements for the operator's
top-down lighting view.

A "floor" is:

  * a background SVG (converted from an uploaded DXF, or authored
    directly),
  * a physical size (metres — used to translate fixture positions to
    pixel coordinates at render time),
  * a list of fixture placements, each tied to a device_id in the
    replica.  The floor page subscribes to the shared SSE event stream
    (Phase 3) and repaints when the fixture's relay flips.

Public surface:
    * :func:`floors.store.list_floors` / `create_floor` / `get_floor` /
      `update_floor` / `delete_floor`
    * :func:`floors.dxf.dxf_to_svg` — pure DXF→SVG converter
    * :func:`floors.routes.build_floors_router` — FastAPI router
"""
