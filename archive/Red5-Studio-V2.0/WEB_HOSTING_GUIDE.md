# Red5 Studio V2.0 — Web Hosting Migration Guide

> **Origin**: this guide was written 2026-02-13 as a porting plan from
> the controller-bound V1.9 codebase (`/root/scripts` + `/root/data` on
> Delta Controls enteliWEB hardware) to a hosted multi-tenant web app
> (Emergent platform / Vercel / Railway / Fly.io etc).
>
> **Read this first** before doing any web-hosted work. It explains
> what stays the same, what gets rewritten, and what's deliberately left
> behind from the controller version.

---

## 🏗️ Architecture Decision First

Your current stack works because it's **co-located** with one controller. For multi-tenant hosting, you need to decide:

| Choice | Best for |
|---|---|
| **a. Single-instance Demo Mode** — exact same app, no auth, demo data baked in | Showcasing capability, lead generation, owner walkthroughs |
| **b. Multi-tenant SaaS** — each customer = one virtual "controller" with their own BACnet config | Charging per-building, real production deployments |
| **c. Hybrid** — public marketing/demo + private behind-login analytics | Most realistic for a real product |

The work split below assumes **(c) hybrid** since it's the most flexible and covers the other two as subsets.

---

## 📁 Layer 1 — Frontend (the easy 90%)

Everything you've built is **already a static React-via-Babel SPA** — no `npm` build steps. To ship it:

```
red5_bundle/
├── dashboard.html              # Already SPA
├── equipment_mapper.html
├── update.html
├── js/
│   ├── psy-3d-engine.js
│   ├── docs_index.js
│   ├── i18n.js
│   └── ...all the rest
├── assets/
│   ├── erv_band_shift_insight.md      # 4 docs (EN/KO each)
│   ├── erv_band_shift_insight.ko.md
│   ├── psychrometric_design_workflow.md
│   └── psychrometric_design_workflow.ko.md
└── (any static images)
```

**Host options for the static SPA**:
- **Vercel / Netlify / Cloudflare Pages** — drag-and-drop, free tier, instant.
- **GitHub Pages** — push to a `gh-pages` branch.
- **Emergent platform** — copy into `/app/frontend/public/` and it serves automatically.

The frontend only needs to know **`REACT_APP_BACKEND_URL`** to point at your hosted backend.

---

## 🔌 Layer 2 — Backend API (the real porting work)

Your V1.9 `app.py` is one big Flask file (~1,300 lines) with auto-discovery plugins. To host this:

### Option A — Lift-and-shift (1 day)

Pick any container host that runs Python:
- **Railway** — `railway up` from the repo, auto-detects Flask.
- **Render** — connect GitHub, free tier sleeps but works.
- **Fly.io** — Dockerfile-based, generous free tier.

Steps:
1. **Add a `requirements.txt`** for Flask + `flask-cors` + plugin deps.
2. **Add a `Procfile`** or `Dockerfile`:
   ```
   web: gunicorn -w 4 -b 0.0.0.0:$PORT app:app
   ```
3. **Strip the BACnet `collector.py` + `dibt` deps** — those only work on the physical controller. Replace with a "demo telemetry" module that synthesizes data from Open-Meteo + canned `telemetry.json`.
4. **Replace `/root/data/` with `./data/`** — make the data root configurable via env var.

### Option B — Rewrite to FastAPI on Emergent (recommended)

Since the Emergent platform is the deployment target, the cleanest map is:

| V1.9 (controller)                   | V2.0 (hosted)                       |
|-------------------------------------|-------------------------------------|
| `app.py` (Flask)                    | `/app/backend/server.py` (FastAPI)  |
| `*_service.py` plugins              | `/app/backend/routes/*.py`          |
| `/root/data/configs/*.json`         | MongoDB collections, keyed by `tenant_id` |
| `/root/data/js/*.js`, `*.html`, `*.md` | `/app/frontend/public/`            |
| `collector.py` (live BACnet)        | Demo simulator OR optional edge agent |
| `/api/repair/reload-module`         | Removed (just redeploy)             |
| Master encryption password gates    | Emergent Google Auth or JWT         |

Emergent's infra gives you free hot-reload, supervisor management, and a public URL out of the box (`REACT_APP_BACKEND_URL`).

---

## 💾 Layer 3 — Data & State

Your controller stores JSON files in `/root/data/configs/`:
- `equipment_schema.json`
- `bridges.json`
- `collector_config.json`
- `telemetry.json` (live state)
- `write_queue.json`

For hosted multi-tenant:
- **Replace JSON files with MongoDB collections** — one document per equipment/bridge/config keyed by `tenant_id`.
- **Telemetry state** — same idea, but Mongo with TTL indexes for time-series rollups.
- **Live BACnet feed** — won't work in the cloud. Replace with:
  - Open-Meteo (already integrated) for weather/OA data
  - A **demo telemetry simulator** that fakes AHU/VAV readings from the loaded weather year
  - OR a customer-installed lightweight **edge agent** that POSTs telemetry to your hosted API

---

## 🔐 Layer 4 — What Stays Behind

These pieces **only work on the physical controller** and can't be ported. Either remove from V2.0 or rebuild as an optional edge component:

| Component                          | Why it stays behind                           |
|------------------------------------|-----------------------------------------------|
| `dibt` BACnet library              | Native ARM/MIPS library tied to enteliWEB     |
| `collector.py` (live BACnet polling) | Requires hardware bus access                  |
| Hot-reload + atomic rollback       | Built for tight disk constraints; cloud just redeploys |
| `/api/repair/reload-module`        | Same reason                                   |
| Master encryption password gates   | Replace with proper auth (JWT or OAuth)       |
| MQTT/Modbus/WS bridges             | Keep as **optional edge plugins** customers self-host |

---

## 🚀 Migration Phases

### Phase 1 — Demo Mode on Emergent (1-2 days)
- Copy `/app/archive/Red5-Studio-V2.0/dashboard.html`, `equipment_mapper.html`, all `js/*`, all `*.md` docs into Emergent's `/app/frontend/public/`.
- Rewrite `app.py` into a thin FastAPI shell with 5-6 read-only endpoints serving canned demo data + Open-Meteo passthrough.
- Add `/api/health`, `/api/weather`, `/api/equipment/schema`, `/api/telemetry/snapshot`, `/api/strategy/bands`, `/api/erv/snapshot`.
- Deploy via Emergent's built-in deployment.
- **Result**: publicly shareable demo URL — owners can play with the full Designer Mode + ERV rollout on their phone.

### Phase 2 — Multi-tenant + Auth (1 week)
- Add Emergent Google Auth (or JWT) for per-customer accounts.
- Move JSON configs into MongoDB, keyed by `tenant_id`.
- Build a "Building Setup Wizard" so customers can create their virtual controller (location, AHU list, VAV mapping, ERV ε, design CFM).
- Tenant isolation at every API endpoint via middleware.

### Phase 3 — Real Telemetry Bridge (2-3 weeks)
- Ship a tiny edge agent (`red5-edge.py`, ~200 lines) that customers install on their controller to POST live BACnet readings to your hosted API on a 60-second cadence.
- Replace demo telemetry simulator with the edge feed.
- Edge agent reuses V1.9's `collector.py` for BACnet reads but with a `requests.post(...)` sink instead of the JSON-file sink.

### Phase 4 — Production hardening
- Stripe billing (per-building monthly plan).
- Email alerts (SendGrid or Resend) when AHU drops out of comfort zone for > 1h.
- Audit log per tenant.
- Hourly bin storage (Mongo + S3 cold archive after 90 days).

---

## 📋 Concrete File Inventory for V2.0

### Carries forward from V1.9 (frontend, ~100% reusable)
- `dashboard.html` ✓
- `equipment_mapper.html` ✓
- `update.html` ✓ (but rebrand "Hot-Reload" to "Edge Agent Status")
- `landing.html` ✓
- `js/psy-3d-engine.js` ✓ (the whole ERV + B-shift + insight system)
- `js/docs_index.js` ✓
- `js/i18n.js` ✓
- All four `*.md` insight docs ✓

### Rewrites required
- `app.py` (Flask) → `backend/server.py` (FastAPI)
- All `*_service.py` plugins → FastAPI router modules
- `collector.py` → demo simulator + (Phase 3) edge agent thin client
- `/root/data/configs/*.json` → MongoDB models

### Strip (controller-only)
- `_bridges_lib.py`, `mqtt_bridge_service.py`, `modbus_bridge_service.py`, `ws_bridge_service.py` (keep as opt-in edge plugins later)
- `upload_service.py` (hot-reload endpoint)
- `build_bundle.py`, `deploy_all.sh` (replaced by Emergent's deploy pipeline)
- `simulator.py` (re-architect as the demo telemetry generator inside the backend)

### Add new (V2.0 only)
- `auth/google_oauth.py` (Phase 2)
- `models/tenant.py`, `models/building.py`, `models/equipment.py`
- `services/demo_telemetry.py` (synthesizes AHU/VAV state from weather + ε)
- `routes/billing.py` (Phase 4 — Stripe)

---

## 🤔 Where to start

I recommend kicking off **Phase 1** first since:
1. The existing V1.9 frontend is already 90% there (static SPA + Flask backend).
2. The Emergent platform is the target you're already on.
3. You'd have a public demo URL within hours, which unblocks owner walkthroughs.

When you're ready, just say *"start Phase 1"* and I'll begin the FastAPI rewrite + frontend copy into `/app/frontend/public/`.

---

*Document created 2026-02-13. Lives at `/app/archive/Red5-Studio-V2.0/WEB_HOSTING_GUIDE.md`. Companion to `VERSION.md` (version split rationale) and the V1.9 `psychrometric_design_workflow.md` (workflow context).*
