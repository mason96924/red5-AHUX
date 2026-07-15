"""V3.0 lighting-controller operator UI configuration.

This subpackage owns the SQLite schema + CRUD for the operator UI's
config: groups (collections of relays), schedules (rule sets, executed
by Phase 4), and the many-to-many assignment between them.

Phase 1 (current):
    * ``store``  -- sqlite3 storage layer, pure stdlib.
    * ``routes`` -- FastAPI router mounted into the existing V3.0 app.

Not yet in scope: aligners, placements, scheduler execution.
"""

from elc.config import routes, store

__all__ = ["routes", "store"]
