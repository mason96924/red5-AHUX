"""models/ — Pydantic + plain-data models shared across the route modules.

Phase L.28 scaffold (2026-06-24).  As more routes get extracted from
the monolithic `server.py` into `routes/`, their request/response
models will land here.  Right now most route handlers in this codebase
take/return plain `dict` -- moving them through Pydantic models is a
follow-on refactor (P3) and is intentionally not done in this phase
to keep the surface stable.

Submodules:
  * `fs.py`     -- filesystem constants + path helpers (DATA_ROOT,
                   SCRIPTS_ROOT, _safe_join, etc.).  Currently still
                   in server.py; future passes will move them here so
                   the route modules can drop the lazy-import dance.
  * `weather.py` -- weather location + cached forecast schemas (TBD).
  * `tenant.py`  -- re-exports from the existing top-level `tenants.py`
                    (TBD; tenants.py already lives at backend root).
"""
