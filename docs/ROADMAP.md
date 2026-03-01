# Roadmap — VisioGold DRC

This roadmap reflects the current state of the codebase as of March 2026. Items are grouped by timeline and clearly marked with implementation status.

---

## Current State (Shipped)

### Foundation OS ✅
- Multi-tenant workspace management
- JWT authentication with bcrypt password hashing
- RBAC hierarchy (VIEWER < ANALYST < ADMIN < OWNER) with 13 permissions
- PostgreSQL Row-Level Security on all 8 tenant-scoped tables
- Repo / Branch / Commit version control with immutable history
- Artifact upload with SHA-256 content-addressable hashing
- Three-way merge with conflict detection
- Append-only audit logging (16 action types)
- Public snapshot publishing with configurable redaction
- Envelope encryption schema (AES-256-GCM)

### Map & Opportunities ✅
- Interactive DRC globe and MapLibre GL map
- 5 data layers (tenements, geology, occurrences, security events, infrastructure)
- Layer toggle panel with per-layer visibility controls
- Opportunity Engine with 5-dimension composite scoring
- Evidence-based explanations and recommended next actions
- Feature context panels (lithology, occurrences, incidents, infrastructure, permits)
- Fly-to presets for 7 DRC regions

### Simulation Studio ✅
- Monte Carlo cost engine (12 departments, 1,000 iterations)
- Schedule engine with critical path analysis
- Risk impact engine (5 dimensions)
- Scenario comparison with rules-based recommendations
- DRC-calibrated priors in editable config file
- Simulation persistence with JSONB storage
- Artifact creation for provenance

### Project Builder ✅
- Multi-step wizard (goal, area, assumptions, generate)
- Task template engine with phased task groups
- Document checklists (regulatory + operational)
- Risk register with 7 pre-built categories
- Budget linkage to simulations
- Plan persistence with PLAN artifact creation

---

## Next 30 Days — Hardening & Critical Gaps

### Security Hardening

| Item | Status | Priority |
|------|--------|----------|
| Wire artifact encryption into upload/download routes | 🟡 Schema + functions exist | P0 |
| Remove default fallback values for encryption keys and JWT secret | 🔴 Not started | P0 |
| Add UUID validation in workspace middleware | 🔴 Not started | P0 |
| Fix unsafe type casting in auth routes | 🟡 Works but fragile | P1 |
| Add rate limiting (express-rate-limit) | 🔴 Not started | P1 |
| Add request body size limits | 🔴 Not started | P1 |
| Configure CORS origin whitelist | 🟡 Currently permissive | P1 |

### Missing API Completeness

| Item | Status | Priority |
|------|--------|----------|
| Implement refresh token endpoint | 🔴 Not started | P0 |
| Add missing database indexes (users.email, commits.created_at) | 🔴 Not started | P1 |
| Add artifact type validation in upload handler | 🔴 Not started | P1 |

### Testing

| Item | Status | Priority |
|------|--------|----------|
| API integration tests for all Next.js routes | 🔴 Not started | P1 |
| RLS policy isolation tests | 🔴 Not started | P1 |
| React component tests for critical UI paths | 🔴 Not started | P2 |

---

## Next 60 Days — Feature Completion

### Merge Conflict Resolution UI

| Item | Status | Priority |
|------|--------|----------|
| Build conflict resolution UI for three-way merge | 🔴 Not started | P1 |
| Display conflicting paths with diff view | 🔴 Not started | P1 |
| Allow per-path resolution (keep A / keep B / manual) | 🔴 Not started | P1 |

### Enhanced Simulation

| Item | Status | Priority |
|------|--------|----------|
| Sensitivity analysis (tornado diagrams) | 🔴 Not started | P2 |
| Configurable iteration count per simulation | 🔴 Not started | P2 |
| Dynamic confidence calculation based on data quality | 🔴 Not started | P2 |
| Gold price sensitivity on project economics | 🔴 Not started | P2 |

### Project Builder Enhancements

| Item | Status | Priority |
|------|--------|----------|
| Gantt chart visualization for task timelines | 🔴 Not started | P2 |
| Task dependency modeling (predecessor/successor) | 🔴 Not started | P2 |
| PDF/Excel export for project plans | 🔴 Not started | P2 |

### Map Enhancements

| Item | Status | Priority |
|------|--------|----------|
| Server-side PostGIS spatial queries (replace client GeoJSON) | 🔴 Not started | P2 |
| Custom user-uploaded GeoJSON layers | 🔴 Not started | P2 |
| Heatmap visualization mode for opportunity density | 🔴 Not started | P3 |

---

## Next 90 Days — New Modules

### Agent Manager

An AI-assisted evaluation agent that can:
- Summarize geological reports and extract key findings
- Cross-reference permit data with CAMI records
- Generate natural-language opportunity briefs
- Answer questions about specific tenements or regions

**Status**: 🔴 Not in repo. The `@google/genai` dependency is present and `GEMINI_API_KEY` is in `.env.example`, suggesting the foundation for AI integration exists. A `ChatAgent` component (`src/components/ChatAgent.tsx`) provides the UI shell.

### Pursue-Data Workflow

A structured workflow for moving from opportunity identification to active data collection:
- Request for Proposal (RFP) generation for service providers
- Sample chain-of-custody tracking
- Field program planning and logistics coordination
- Progress tracking against planned activities

**Status**: 🔴 Not in repo.

### Explore Feed Publishing

A curated public feed of opportunity summaries that can be:
- Published from the internal opportunity engine
- Filtered by province, commodity, or score range
- Shared as read-only links for marketing or investor relations

**Status**: 🔴 Not in repo.

### Vendor Directory

A searchable directory of DRC-relevant service providers:
- Drilling companies
- Environmental consultants
- Legal firms (Kinshasa-based mining counsel)
- Security providers
- Logistics operators
- Laboratories (local, regional, international)

**Status**: 🔴 Not in repo.

### Deeper Geology Models

Enhanced geological analysis capabilities:
- Cross-section generation from borehole data
- Grade interpolation and block modeling
- Integration with geological modeling software outputs
- Mineral resource estimation workflows

**Status**: 🔴 Not in repo.

---

## Beyond 90 Days — Platform Scale

### Infrastructure & Operations

| Item | Timeline | Status |
|------|----------|--------|
| S3/GCS artifact storage adapter | Q2 2026 | 🔴 Planned |
| CDN for static assets and map tiles | Q2 2026 | 🔴 Planned |
| Database connection pooling optimization (PgBouncer) | Q2 2026 | 🔴 Planned |
| APM and observability (DataDog / New Relic) | Q2 2026 | 🔴 Planned |
| Log aggregation and alerting | Q2 2026 | 🔴 Planned |
| Database backup and disaster recovery | Q2 2026 | 🔴 Planned |
| Secrets management (AWS Secrets Manager / Vault) | Q2 2026 | 🔴 Planned |

### Advanced Features

| Item | Timeline | Status |
|------|----------|--------|
| Real-time collaboration (presence, live editing) | Q3 2026 | 🔴 Planned |
| Notification system (email, in-app) | Q3 2026 | 🔴 Planned |
| API key management for external integrations | Q3 2026 | 🔴 Planned |
| Webhook support for event-driven workflows | Q3 2026 | 🔴 Planned |
| Multi-jurisdiction expansion (beyond DRC) | Q4 2026 | 🔴 Planned |
| Mobile-responsive map and opportunity viewer | Q3 2026 | 🔴 Planned |

### Data & Intelligence

| Item | Timeline | Status |
|------|----------|--------|
| WMS/WMTS external data source adapters | Q2 2026 | 🔴 Planned |
| CAMI API integration for live permit data | Q3 2026 | 🔴 Planned |
| Historical security event trend analysis | Q3 2026 | 🔴 Planned |
| Satellite imagery layer integration | Q3 2026 | 🔴 Planned |
| Elevation and terrain modeling | Q4 2026 | 🔴 Planned |

---

## What's NOT in the Repo Yet

The following items are referenced in the product vision but have zero implementation:

- Agent Manager / AI-assisted evaluation (beyond ChatAgent shell)
- Pursue-Data workflow
- Explore feed publishing
- Vendor directory
- Deeper geology models (cross-sections, block models)
- Real-time collaboration
- Notification system
- Mobile-responsive layout
- PDF/Excel export
- S3/GCS storage
- External data source adapters (WMS, CAMI API)
- Rate limiting
- Refresh tokens
- Merge conflict resolution UI
- Sensitivity analysis
- Custom prior editing UI
