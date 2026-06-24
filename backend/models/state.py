"""models/state.py -- process-wide mutable in-memory state.

Phase L.32 (2026-06-24): consolidates the small set of module-level dicts
that the route handlers + simulator mutate at runtime.  Putting them in
one module instead of scattered across `server.py` accomplishes three
things:

  1. `server.py` becomes purely declarative -- imports + app wiring + a
     handful of cached config readers.  The mutating-side-effect surface
     is named and obvious.
  2. Tests can `from models.state import _WEATHER_NOW_CACHE` and clear
     it directly without touching `server` (which sometimes loads slow
     because of the eager `_load_json` for `equipment_types.json`).
  3. Avoids the foot-gun of two different routers each importing their
     own snapshot of a dict via the L.29 shim.  Mutation is shared by
     identity here because every consumer ends up with the SAME dict
     instance.

All entries are intentionally MUTABLE references (dicts, mutable
classes).  Re-binding a module-level int / str via
``models.state.X = ...`` is a bug -- mutate the dict in place instead.
"""
from __future__ import annotations

import time
from typing import Any, Dict, Optional


# ---------------------------------------------------------------------------
# Anonymous-mode override.  Mutated by POST /api/data-mode (the dashboard's
# "Force LIVE / Force SIM" toggle for anonymous users).  Empty dict means
# "use the bundled `collector_config.json` default"; presence of a key
# (currently just ``mock_mode``) overrides it process-wide.  Cleared on a
# backend restart -- this is intentionally NOT persisted because it's a
# demo-time toggle, not an operator setting.
# ---------------------------------------------------------------------------
_ANON_OVERRIDE: Dict[str, Any] = {}


# ---------------------------------------------------------------------------
# Boot timestamp -- used by /api/disk-status and the demo waveform phase
# offsets so each backend restart produces a fresh, deterministic-looking
# beat (instead of starting from t=0 every time which would freeze
# everyone on the same dot).
# ---------------------------------------------------------------------------
_DEMO_START_TS: float = time.time()


# ---------------------------------------------------------------------------
# Most-recent /api/weather-proxy upstream tracker.  Mutated by
# `_mark_weather_source()` (in server.py) on every proxy call so the
# dashboard's auth pill can render a colored dot showing which upstream
# (open-meteo / weatherapi.com / nasa-power) satisfied the last request.
# Exposed read-only via GET /api/weather-health.
# ---------------------------------------------------------------------------
_LAST_WEATHER_SOURCE: Dict[str, Any] = {
    "source":     None,         # "open-meteo" | "weatherapi.com" | "nasa-power" | "error"
    "status":     "unknown",    # "ok" | "error" | "unknown"
    "updated_at": None,         # ISO-8601 UTC timestamp of the last call
    "detail":     None,         # short human-readable note (errors etc.)
}
_LAST_WEATHER_TS: Optional[float] = None


# ---------------------------------------------------------------------------
# 5-minute TTL cache for /api/weather-current.  Reads from open-meteo's
# free /v1/forecast `current` block; rounding (lat, lon) to 2 decimals
# bundles every weather request inside a ~1.1 km grid square, which is
# well below open-meteo's spatial resolution and keeps us under their
# rate limits even when the dashboard auto-refreshes the weather strip
# every 30 s on a busy display.
# ---------------------------------------------------------------------------
# Fixes a latent bug surfaced during Phase L.32: routes/weather.py was
# referencing `_WEATHER_NOW_CACHE` + `_WEATHER_NOW_TTL_S` via the L.29
# shim but the names were never defined on the `server` module, so a
# fresh call to /api/weather-current crashed with NameError.  Defining
# them here makes the cache work as the handler comment promises.
# ---------------------------------------------------------------------------
_WEATHER_NOW_CACHE: Dict[tuple, tuple] = {}
_WEATHER_NOW_TTL_S: int = 5 * 60   # 5 minutes
