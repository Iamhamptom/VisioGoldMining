# VisioGold DRC

**Secure mining intelligence workstation for gold opportunities in the Democratic Republic of the Congo.**

VisioGold DRC is an enterprise-grade platform that combines geospatial intelligence, version-controlled project management, Monte Carlo simulation, and automated project planning into a single private workstation. It enables investors, operators, and analysts to discover DRC gold opportunities on an interactive map, evaluate them with scored dimensions, run cost/schedule/risk simulations, and generate full project plans — all within a multi-tenant, RLS-enforced security model.

---

## Key Capabilities

- **Interactive Globe & Map** — MapLibre GL globe with DRC tenements, geology, mineral occurrences, security events, and infrastructure layers
- **Opportunity Engine** — Automated scoring across prospectivity, access, security, legal complexity, and data completeness with evidence-based explanations
- **Repo / Branch / Commit OS** — Git-like version control for mining projects: immutable commits, SHA-256 hashed artifacts, three-way merge with conflict detection
- **Monte Carlo Simulation Studio** — Cost, schedule, and risk engines with seeded RNG for deterministic, reproducible outputs across 12 departments
- **Project Builder Wizard** — Multi-step wizard generating task boards, document checklists, risk registers, and timeline summaries
- **Scenario Compare** — Side-by-side comparison of simulations with per-department cost deltas, schedule differences, and risk impact analysis
- **Multi-Tenant Security** — PostgreSQL Row-Level Security (RLS) with workspace isolation, RBAC (VIEWER < ANALYST < ADMIN < OWNER), and append-only audit logging
- **Envelope Encryption** — AES-256-GCM encryption for artifacts with separate DEK/KEK architecture
- **Public Snapshots** — Controlled publishing of branch snapshots with configurable redaction rules

---

## System Map

```
┌──────────────────────────────────────────────────────────────┐
│                        Browser (React)                       │
│  ┌─────────┐ ┌──────────┐ ┌────────────┐ ┌──────────────┐  │
│  │ Globe / │ │Opportunity│ │ Simulation │ │   Project    │  │
│  │   Map   │ │  Explorer │ │   Studio   │ │   Builder    │  │
│  └────┬────┘ └─────┬─────┘ └─────┬──────┘ └──────┬───────┘  │
│       │             │             │               │          │
│       └─────────────┴──────┬──────┴───────────────┘          │
│                            │                                 │
├────────────────────────────┼─────────────────────────────────┤
│           Next.js API      │      Express API (port 3001)    │
│         Route Handlers     │   ┌──────────┐ ┌───────────┐   │
│  ┌──────┐ ┌──────┐ ┌────┐ │   │Simulation│ │  Project   │   │
│  │ Auth │ │Repos │ │Pub │ │   │  Engine   │ │  Builder   │   │
│  │ RBAC │ │Branch│ │Snap│ │   │ (Monte   │ │  Service   │   │
│  │ Audit│ │Commit│ │    │ │   │  Carlo)  │ │            │   │
│  └──┬───┘ └──┬───┘ └──┬─┘ │   └────┬─────┘ └─────┬──────┘   │
│     │        │        │   │        │              │          │
├─────┴────────┴────────┴───┼────────┴──────────────┴──────────┤
│        PostgreSQL 16 + PostGIS   |   Local File Storage      │
│  ┌───────┐ ┌───────────┐ ┌─────────┐ ┌──────────┐           │
│  │  RLS  │ │ Workspaces│ │ Repos / │ │ Artifacts│           │
│  │Policies│ │  Users    │ │Branches │ │  (SHA256)│           │
│  └───────┘ └───────────┘ └─────────┘ └──────────┘           │
└──────────────────────────────────────────────────────────────┘
```

---

## Quickstart (Local Development)

### Prerequisites

- **Node.js** 18+
- **Docker** (for PostgreSQL + PostGIS)
- **npm** (bundled with Node.js)

### Environment Setup

```bash
cp .env.example .env
# Edit .env with your secrets (JWT_SECRET, ROOT_ENCRYPTION_KEY, etc.)
```

### Install & Run

```bash
# Install dependencies
npm install

# Start PostgreSQL with PostGIS
docker compose up -d

# Run foundation database migrations (Next.js API)
npm run migrate

# Seed development data (test users, default workspace)
npm run seed

# Start Next.js dev server (port 3000)
npm run dev

# In a separate terminal — start Express API server (port 3001)
npm run server:dev
```

### Test Credentials

| Role    | Email                  | Password     |
|---------|------------------------|--------------|
| Admin   | admin@visiogold.com    | password123  |
| Analyst | analyst@visiogold.com  | password123  |
| Viewer  | viewer@visiogold.com   | password123  |

### Database Setup Details

The platform uses **two database role layers**:

| Role              | Purpose                      | RLS       |
|-------------------|------------------------------|-----------|
| `visiogold_admin` | Migrations, seeding          | Bypassed  |
| `visiogold_app`   | Application runtime queries  | Enforced  |

Migrations run in order from `migrations/001_*.sql` through `migrations/008_*.sql` (foundation) and `server/src/migrations/001_*.sql` through `003_*.sql` (simulation/project tables).

---

## Mental Model

### Workspace > Repo > Branch > Commit

```
Workspace (tenant boundary)
  └── Repo (a mining project — has PostGIS polygon, commodity, country)
       └── Branch (versioned lane — PRIVATE / SHARED / PUBLIC)
            └── Commit (immutable snapshot)
                 └── Artifacts (SHA-256 hashed files with provenance)
```

Every operation runs inside an **RLS-scoped transaction** (`SET LOCAL app.current_workspace_id`), ensuring complete tenant isolation at the database level.

### Map & Opportunities

The interactive globe renders DRC-focused geospatial layers: tenements, geology, mineral occurrences, security events, and infrastructure. The **Opportunity Engine** (`src/lib/opportunity-engine.ts`) computes composite scores across five dimensions using Turf.js spatial analysis, ranking tenements by investment potential.

### Simulation & Project Builder

The **Simulation Studio** runs Monte Carlo simulations (1,000 iterations by default) across 12 departments using DRC-calibrated priors. Outputs include P10/P50/P90 cost distributions, schedule estimates, and risk impact scores. The **Project Builder** generates phased task boards, document checklists, and risk registers that can be linked to simulation budgets.

---

## Security & Privacy Summary

- **Row-Level Security (RLS)** on all tenant-scoped tables (8 tables, 12+ policies)
- **RBAC hierarchy**: VIEWER < ANALYST < ADMIN < OWNER
- **Append-only audit log** with IP, user-agent, and action tracking
- **Envelope encryption**: AES-256-GCM with workspace-level DEK and root KEK
- **Public snapshots**: Configurable redaction rules for safe external sharing
- **Two DB roles**: Admin (migration-only) and App (RLS-enforced runtime)

See [docs/SECURITY_PRIVACY.md](docs/SECURITY_PRIVACY.md) for the full security architecture.

---

## Folder Structure

```
VisioGoldMining/
├── migrations/                     # PostgreSQL migrations (foundation)
│   ├── 001_extensions_and_roles.sql
│   ├── 002_workspaces_users.sql
│   ├── 003_repos_branches.sql
│   ├── 004_commits_artifacts.sql
│   ├── 005_audit_log.sql
│   ├── 006_encryption_keys.sql
│   ├── 007_public_snapshots.sql
│   └── 008_rls_policies.sql
├── server/                         # Express API server (simulation + project builder)
│   └── src/
│       ├── engine/                 # Monte Carlo engines (cost, schedule, risk, compare)
│       ├── services/               # Business logic (simulation, project builder, foundation)
│       ├── routes/                 # Express route handlers
│       ├── config/                 # DRC-calibrated priors
│       ├── templates/              # Task templates + doc checklists
│       ├── db/                     # Database pool + migration runner
│       ├── migrations/             # Server-side migrations (simulations, project plans)
│       └── __tests__/              # Engine unit tests
├── src/                            # Next.js frontend + API
│   ├── app/
│   │   ├── (app)/                  # Authenticated app routes
│   │   ├── (public)/               # Public snapshot pages
│   │   ├── api/                    # Next.js API route handlers
│   │   └── login/                  # Login page
│   ├── components/
│   │   ├── screens/                # Main app screens (Globe, Explorer, Studio, Builder)
│   │   ├── simulation/             # Simulation UI components
│   │   ├── project-builder/        # Project builder wizard steps
│   │   ├── map/                    # MapLibre components
│   │   ├── panels/                 # Feature context panels (geology, incidents, etc.)
│   │   ├── opportunities/          # Opportunity feed + cards
│   │   ├── repos/                  # Repository map panel
│   │   └── ui/                     # Shared UI components (shadcn)
│   ├── hooks/                      # React hooks (map, layers, opportunities)
│   ├── lib/                        # Core libraries
│   │   ├── middleware/             # Auth, workspace, role, audit middleware
│   │   ├── adapters/              # Data source adapters
│   │   └── types/                 # Layer + opportunity types
│   ├── types/                      # TypeScript type definitions
│   ├── data/                       # GeoJSON fixture data (tenements, geology, etc.)
│   ├── context/                    # React context providers
│   └── api/                        # API client functions
├── tests/                          # Unit tests (auth, RBAC, crypto, validation)
├── scripts/                        # Migration + seed scripts
├── uploads/                        # Local artifact storage
├── docs/                           # Product documentation
├── docker-compose.yml              # PostgreSQL + PostGIS container
├── package.json                    # Dependencies and scripts
└── .env.example                    # Environment variable template
```

---

## Deployment Notes

- **Database**: PostgreSQL 16 with PostGIS 3.4 (Docker Compose provided for development)
- **Frontend**: Next.js 14 App Router — deploy via Vercel, Docker, or any Node.js host
- **Express API**: Runs on port 3001 — deploy alongside or separately
- **File Storage**: Local filesystem (`./uploads`) — replace with S3/GCS for production
- **Secrets**: Use a secrets manager (AWS Secrets Manager, HashiCorp Vault) in production — do not use default fallback values

---

## API Endpoints

### Next.js API (Port 3000)

| Area        | Endpoints |
|-------------|-----------|
| Auth        | `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` |
| Workspaces  | `GET/POST /api/workspaces`, `GET /api/workspaces/:id`, `POST /api/workspaces/:id/members` |
| Repos       | `GET/POST /api/repos`, `GET/PATCH /api/repos/:id`, `GET/POST /api/repos/:id/branches` |
| Commits     | `GET/POST /api/branches/:id/commits`, `GET /api/commits/:id`, `POST /api/commits/diff`, `POST /api/commits/merge` |
| Artifacts   | `GET/POST /api/branches/:id/artifacts`, `GET /api/artifacts/:id` |
| Audit       | `GET /api/audit` |
| Public      | `GET /api/public/:slug`, `GET /api/public/:slug/artifacts` |

### Express API (Port 3001)

| Area             | Endpoints |
|------------------|-----------|
| Simulations      | `POST /api/repos/:id/branches/:id/simulations/run`, `GET /api/branches/:id/simulations`, `GET /api/simulations/:id`, `POST /api/simulations/compare` |
| Project Plans    | `POST /api/repos/:id/branches/:id/project-plan/generate`, `GET /api/branches/:id/project-plan`, `GET /api/project-plans/:id` |
| Foundation       | `GET/POST /api/workspaces`, `GET/POST /api/repos`, `GET/POST /api/repos/:id/branches`, `GET /api/branches/:id/artifacts`, `GET /api/context/default` |

---

## Scripts

```bash
npm run dev           # Start Next.js dev server
npm run build         # Production build
npm run server:dev    # Start Express API server (watch mode)
npm run migrate       # Run database migrations
npm run seed          # Seed development data
npm test              # Run unit tests
npm run test:watch    # Run tests in watch mode
```

---

## Contributing

1. Create a feature branch from `main`
2. Follow existing patterns: use `createHandler()` for new API routes, add Zod validation schemas, include audit logging for write operations
3. Add migrations in numbered sequence (next: `009_*.sql`)
4. Write tests for new engine logic in `server/src/__tests__/`
5. Run `npm test` before submitting a PR
6. Never commit `.env` files or secrets

---

## Documentation

| Document | Description |
|----------|-------------|
| [Product Overview](docs/PRODUCT_OVERVIEW.md) | Product thesis and scope |
| [User Journey](docs/USER_JOURNEY.md) | Step-by-step user journeys |
| [Features](docs/FEATURES.md) | Complete feature catalog with status |
| [Architecture](docs/ARCHITECTURE.md) | Technical architecture and data flows |
| [Security & Privacy](docs/SECURITY_PRIVACY.md) | Security model and threat analysis |
| [Map & Opportunities](docs/MAP_OPPORTUNITIES.md) | Geospatial intelligence system |
| [Simulation & Project Builder](docs/SIMULATION_PROJECT_BUILDER.md) | Monte Carlo engines and planning |
| [How It Works](docs/HOW_IT_WORKS.md) | End-to-end workflow |
| [About](docs/ABOUT.md) | Mission and vision |
| [FAQ](docs/FAQ.md) | Frequently asked questions |
| [Roadmap](docs/ROADMAP.md) | Development roadmap |
