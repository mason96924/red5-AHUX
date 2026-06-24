"""routes/__init__.py — modular APIRouter packages.

Each submodule defines its own `APIRouter` and is wired into the main
FastAPI app via `app.include_router(...)` at the bottom of `server.py`.

Phase-L.28 (2026-06-24): began splitting the monolithic 2,430-line
`server.py` into per-domain routers (started with the well-tested
file-management group and standards docs).  See `PRD.md` for the
extraction plan.
"""
