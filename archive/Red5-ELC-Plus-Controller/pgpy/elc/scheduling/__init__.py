"""
elc.scheduling
==============
Phase 4 scheduling engine.  Three layers:

* :mod:`elc.scheduling.astro`      — sunrise / sunset / civil-twilight
                                     from lat / lon / date, DST-aware
                                     via IANA timezone (astral + zoneinfo).
* :mod:`elc.scheduling.weather`    — Open-Meteo forecast → outdoor lux
                                     estimate cached for 5 min.
* :mod:`elc.scheduling.evaluator`  — pure rule engine:
                                     ``should_fire(rule, now, ctx)`` +
                                     ``next_fire_times(rule, now, ctx, count)``.

The scheduler *engine* (background asyncio task) lands in a separate
module and wires the above into ``build_stack()`` alongside the driver
+ config router.  Everything in this package is UI-free and independent
of FastAPI so it can be unit-tested with frozen clocks.
"""
