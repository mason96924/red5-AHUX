# Red5 Studio V2.0 — Web Hosted Edition

> **Forked from**: `Red5-AHU-V1.9` (controller edition) on 2026-02-13.
> **Target**: Multi-tenant SaaS for HVAC operators and MEP designers.
> **Status**: 🟡 Greenfield. Migration plan in `WEB_HOSTING_GUIDE.md`.

## Quick links
- 📘 **Migration plan** → `WEB_HOSTING_GUIDE.md`
- 🌿 **Version-split rationale** → `VERSION.md`
- 💡 **Insight docs** (carried forward from V1.9, frontend reuses them):
  - `erv_band_shift_insight.md` / `.ko.md`
  - `psychrometric_design_workflow.md` / `.ko.md`
  - `control_strategy_insight.md` / `.ko.md`
  - `band_guide.md`, `opt_sa_insight.md`

## What's in here right now (verbatim V1.9 snapshot)

This folder is currently an exact copy of V1.9 as of fork-day. It will
diverge as we work through the migration phases. **Do not modify the
controller-only pieces (`collector.py`, `*_bridge_service.py`,
`upload_service.py`, `build_bundle.py`, `deploy_all.sh`)** — those will
be deleted in Phase 1.

## Migration roadmap

### Phase 1 — Demo Mode (1-2 days)
- [ ] Rewrite `app.py` (Flask) → `backend/server.py` (FastAPI)
- [ ] Move JSON configs into a `data/seed/` directory
- [ ] Create `services/demo_telemetry.py` to synthesize AHU/VAV state from weather
- [ ] Move frontend (`dashboard.html`, `equipment_mapper.html`, `js/`, `*.md`) into Emergent's `/app/frontend/public/` layout
- [ ] Deploy on Emergent — capture public demo URL

### Phase 2 — Auth + Multi-tenancy (1 week)
- [ ] Emergent Google Auth integration
- [ ] MongoDB models: `tenant`, `building`, `equipment`, `bridge`
- [ ] Building Setup Wizard UI
- [ ] Tenant isolation middleware

### Phase 3 — Edge Agent (2-3 weeks)
- [ ] Ship `red5-edge.py` thin client (BACnet → HTTPS POST every 60s)
- [ ] `/api/edge/ingest` endpoint with signed payloads
- [ ] Edge agent installer doc

### Phase 4 — Production Hardening (2-3 weeks)
- [ ] Stripe billing (per-building plan)
- [ ] Email alerts via Resend / SendGrid
- [ ] Audit log per tenant
- [ ] Time-series archive (Mongo → S3 after 90 days)

## How to start work

The user kicks off each phase by saying e.g. **"start Phase 1"**.
Until then, V2.0 is a parking lot — do not begin without an explicit go.

---

*Last updated 2026-02-13.*
