# Red5 Studio — Version Split

## V1.9 — Controller Edition (frozen baseline)
**Location**: `/app/archive/Red5-AHU-V1.9/`
**Target hardware**: Delta Controls enteliWEB (embedded Linux, ENOSPC-constrained).
**Status**: ✅ Production-deployed at `219.79.12.63:5001`.
**Maintenance policy**: bug-fix only. No new features. The controller has tight disk + ASCII-only Python constraints that V2.0 deliberately drops.

Key constraints baked into V1.9:
- Single-process Flask (`app.py`) with auto-discovery plugin loader.
- Live BACnet via native `dibt` library (`collector.py`).
- JSON-file state (no database).
- In-browser Babel compilation (no `npm` toolchain).
- Single-file module hot-reloading to work around disk pressure (`/api/repair/reload-module`).
- Master encryption password gates (no real auth).

## V2.0 — Web-Hosted Edition (active development)
**Location**: `/app/archive/Red5-AHU-V2.0/`
**Target platform**: Emergent / Vercel / Railway / Fly.io / any cloud host.
**Status**: 🟡 Greenfield. Forked from V1.9 on **2026-02-13**.
**Migration plan**: see `WEB_HOSTING_GUIDE.md` in this directory.

Key changes from V1.9:
- **Backend**: Flask `app.py` → FastAPI `backend/server.py` with per-route modules.
- **State**: JSON files → MongoDB collections keyed by `tenant_id`.
- **Telemetry**: live BACnet → demo simulator (Phase 1) + optional edge agent (Phase 3).
- **Auth**: master password → Emergent Google Auth or JWT (Phase 2).
- **Frontend**: ~100% reuse from V1.9 — already a static SPA, no compilation step.
- **Disk constraints lifted**: cloud has gigabytes available, drop hot-reload + atomic-rollback.

## Why fork instead of evolve in place

The V1.9 codebase is **live on a customer's controller**. Mixing
multi-tenant SaaS code into the same files risks breaking the
production controller every time we ship a hosted feature. Forking lets:
- V1.9 stay frozen so the controller never breaks.
- V2.0 take liberties (Docker, FastAPI, MongoDB) that V1.9 can't afford.
- Bug fixes can be cherry-picked V1.9 → V2.0 (frontend code) or V2.0 → V1.9 (rarely; UX-only).

## Migration phases (high-level)

| Phase | Scope | Effort | Status |
|---|---|---|---|
| **1 — Demo Mode** | FastAPI thin shell + frontend copy + demo telemetry | 1-2 days | 🟡 Ready to start |
| **2 — Auth + Multi-tenancy** | Google Auth + MongoDB + setup wizard | 1 week | ⬜ Not started |
| **3 — Edge agent** | `red5-edge.py` thin client POSTs live BACnet to API | 2-3 weeks | ⬜ Not started |
| **4 — Production hardening** | Stripe billing, alerting, audit log, time-series archive | 2-3 weeks | ⬜ Not started |

## Cherry-picking between forks

When fixing a bug that affects the frontend (which is shared verbatim):
```bash
# Fix in V2.0 first (it's the active fork)
# Then mirror the change to V1.9:
cp /app/archive/Red5-AHU-V2.0/js/<file> /app/archive/Red5-AHU-V1.9/js/<file>
# Rebuild V1.9 bundle:
cd /app/archive/Red5-AHU-V1.9 && python3 build_bundle.py
# Hot-deploy to live controller (see deploy_all.sh):
```

When fixing a bug in the backend (diverges between forks):
- V1.9 bug → patch `app.py` directly, hot-upload via `/api/upload-file`.
- V2.0 bug → patch the relevant FastAPI route, Emergent auto-reloads.

---

*Document created 2026-02-13. Lives at `/app/archive/Red5-AHU-V2.0/VERSION.md`.*
