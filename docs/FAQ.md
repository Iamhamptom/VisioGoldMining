# FAQ — VisioGold DRC

## General

### What is VisioGold DRC?

VisioGold DRC is a secure mining intelligence workstation focused on gold opportunities in the Democratic Republic of the Congo. It combines geospatial mapping, version-controlled project management, Monte Carlo simulation, and automated project planning into a single platform.

### Why DRC only?

The DRC gold sector is among the world's most promising but also the most complex — fragmented data, challenging logistics, regulatory complexity, and security risks. By focusing exclusively on the DRC, VisioGold can provide calibrated priors, relevant regulatory references, and region-specific risk models that a generic platform cannot.

Future expansion to other African mining jurisdictions is on the roadmap.

### Who is this for?

- **Investors and operators** evaluating gold opportunities
- **Mining analysts** conducting due diligence and building evidence packages
- **Advisory and consulting firms** producing structured project evaluations
- **Exploration companies** planning DRC field programs

### Is this open source?

The codebase is private. This documentation describes the platform's architecture and capabilities for internal stakeholders and authorized partners.

---

## Technical

### What tech stack does VisioGold use?

- **Frontend**: Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS + shadcn/ui
- **Map**: MapLibre GL + Turf.js
- **Backend**: Next.js API Routes (foundation) + Express 5 (simulation/planning)
- **Database**: PostgreSQL 16 + PostGIS 3.4
- **Auth**: JWT (jose) + bcrypt
- **Testing**: Vitest

### How does multi-tenancy work?

Every workspace is a tenant. PostgreSQL Row-Level Security (RLS) policies on all tenant-scoped tables ensure that queries from one workspace cannot access another's data. This is enforced at the database level, not the application level.

See [SECURITY_PRIVACY.md](SECURITY_PRIVACY.md) for full details.

### Are simulations deterministic?

Yes. Every simulation accepts an optional `seed` parameter. The same inputs + seed always produce the same outputs. This is achieved using seeded RNG (`seedrandom` library) with triangular distribution sampling.

### How accurate are the cost estimates?

Cost estimates are based on DRC-calibrated priors — historical cost ranges for each department and project type. They provide a starting point for analysis but should be replaced with vendor quotes for higher confidence. The confidence level is currently fixed at 0.3 (30%) for all departments, indicating prior-based estimates.

### Can I customize the priors?

Yes, by editing `server/src/config/priors.ts`. All base costs, multipliers, assay priors, drilling priors, schedule phases, and risk baselines are in a single file. No code changes required — just update the numbers.

A UI for editing priors is planned but not yet implemented (🔴).

### What database do I need?

PostgreSQL 16 with PostGIS 3.4. A Docker Compose file is included for development. The `postgis/postgis:16-3.4` image provides both.

### How do migrations work?

Two migration sets:
1. **Foundation** (`migrations/001_*.sql` to `008_*.sql`): Run via `npm run migrate` using the admin database role
2. **Simulation/Planning** (`server/src/migrations/001_*.sql` to `003_*.sql`): Run automatically on Express server startup

---

## Security

### How is data isolated between organizations?

PostgreSQL RLS policies on all tenant-scoped tables. Every application query runs within a transaction that sets `app.current_workspace_id`, and RLS policies filter all rows to match. Even application bugs cannot leak data across workspaces.

### How are passwords stored?

bcrypt hash with 12 salt rounds. Raw passwords are never stored.

### How does authentication work?

JWT tokens signed with HS256. Tokens contain user ID, email, workspace ID, and role. Default expiry is 15 minutes.

Note: Refresh token rotation is planned but not yet implemented (🔴).

### Is data encrypted at rest?

The schema supports artifact-level envelope encryption (AES-256-GCM with DEK/KEK), and the encryption/decryption functions are implemented (`src/lib/crypto.ts`). However, encryption is not yet wired into the upload/download API routes (🟡).

### Can I audit who did what?

Yes. The append-only audit log captures 16 action types with user, IP, user-agent, and timestamp. ADMINs can query the log via the audit viewer or API with filters.

---

## Map & Opportunities

### Where does the map data come from?

Currently from bundled GeoJSON fixtures (`src/data/*.geojson`). These include tenement boundaries, geological units, mineral occurrences, security events, and infrastructure.

Future versions will integrate server-side PostGIS queries and external data sources (🔴).

### How is the opportunity score calculated?

Five dimensions with weighted composite:
- Prospectivity (30%) — nearby mineral occurrences + favorable geology
- Access (20%) — distance to infrastructure
- Security (20%) — proximity to security events
- Legal Complexity (15%) — permit status
- Data Completeness (15%) — available data coverage

See [MAP_OPPORTUNITIES.md](MAP_OPPORTUNITIES.md) for full scoring methodology.

### Can I add my own layers?

Custom user-uploaded GeoJSON layers are planned (🔴). Currently, layers are defined in the registry.

---

## Simulation & Project Builder

### What does the simulation actually model?

Three engines run in sequence:
1. **Cost Engine** — Monte Carlo (1,000 iterations) across 12 departments with DRC-calibrated priors
2. **Schedule Engine** — Monte Carlo across 9 phases with timeline factors
3. **Risk Engine** — Rules-based scoring across 5 dimensions

### Can I compare two scenarios?

Yes. The Scenario Compare feature computes per-department cost deltas, schedule differences, and risk deltas between any two simulations, with a rules-based recommendation.

### What does the Project Builder produce?

- Phased task groups with duration estimates
- Document checklists (regulatory + operational)
- Risk register with 7 pre-built categories
- Budget summary linked to a simulation
- Timeline summary

### Can I export the project plan?

The plan is committed as a PLAN-type artifact on the branch, creating a permanent record with SHA-256 provenance. Direct PDF/Excel export is planned (🔴).

---

## Deployment

### How do I deploy to production?

1. Set up PostgreSQL 16 + PostGIS (managed service recommended)
2. Run foundation migrations and server migrations
3. Build the Next.js app (`npm run build`)
4. Deploy Next.js to your host (Vercel, Docker, EC2, etc.)
5. Deploy the Express server separately (`server/src/index.ts`)
6. Configure environment variables (especially `JWT_SECRET`, `ROOT_ENCRYPTION_KEY`)
7. Replace local file storage with S3/GCS

### What environment variables are required?

See `.env.example`:
- `DB_HOST`, `DB_PORT`, `DB_NAME` — Database connection
- `DB_ADMIN_USER`, `DB_ADMIN_PASSWORD` — Admin role credentials
- `DB_APP_USER`, `DB_APP_PASSWORD` — App role credentials
- `JWT_SECRET` — Must be at least 32 characters
- `ROOT_ENCRYPTION_KEY` — Must be at least 32 characters
- `UPLOAD_DIR` — Artifact storage path
- `VISIOGOLD_ORG_WORKSPACE_ID` — For shared visibility
- `GEMINI_API_KEY` — For AI features
- `APP_URL` — Public URL of the application
