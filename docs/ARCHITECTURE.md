# Architecture — VisioGold DRC

## Component Architecture

VisioGold DRC is a dual-server architecture with a shared PostgreSQL database:

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (Browser)                       │
│                                                             │
│   React 18 + Next.js 14 App Router + MapLibre GL           │
│   ┌───────────┐  ┌────────────┐  ┌───────────────────┐    │
│   │  Globe /  │  │ Opportunity│  │  Simulation Studio │    │
│   │   Map     │  │  Explorer  │  │  + Project Builder │    │
│   └─────┬─────┘  └─────┬──────┘  └─────────┬─────────┘    │
│         │               │                   │              │
│         └───────────────┼───────────────────┘              │
│                         │                                  │
├─────────────────────────┼──────────────────────────────────┤
│                         │                                  │
│  ┌──────────────────────┴──────────────────────────┐       │
│  │           Next.js API (Port 3000)               │       │
│  │                                                 │       │
│  │  Middleware Chain:                               │       │
│  │  extractAuth → validateWorkspace → checkRole    │       │
│  │  → handler → auditAction                        │       │
│  │                                                 │       │
│  │  Routes:                                        │       │
│  │  /api/auth/*        (login, logout, me)         │       │
│  │  /api/workspaces/*  (CRUD, members)             │       │
│  │  /api/repos/*       (CRUD, branches)            │       │
│  │  /api/branches/*    (commits, artifacts, publish)│       │
│  │  /api/commits/*     (read, diff, merge)         │       │
│  │  /api/audit         (filtered log viewer)       │       │
│  │  /api/public/:slug  (unauthenticated snapshots) │       │
│  └──────────────────────┬──────────────────────────┘       │
│                         │                                  │
│  ┌──────────────────────┴──────────────────────────┐       │
│  │           Express API (Port 3001)               │       │
│  │                                                 │       │
│  │  Routes:                                        │       │
│  │  /api/repos/:id/branches/:id/simulations/run    │       │
│  │  /api/branches/:id/simulations                  │       │
│  │  /api/simulations/:id                           │       │
│  │  /api/simulations/compare                       │       │
│  │  /api/repos/:id/branches/:id/project-plan/*     │       │
│  │  /api/workspaces, /api/repos, /api/branches     │       │
│  │  /api/context/default                           │       │
│  │                                                 │       │
│  │  Engine Layer:                                  │       │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │       │
│  │  │   Cost   │ │ Schedule │ │   Risk   │        │       │
│  │  │  Engine  │ │  Engine  │ │  Engine  │        │       │
│  │  └──────────┘ └──────────┘ └──────────┘        │       │
│  │  ┌──────────┐ ┌──────────────┐                  │       │
│  │  │ Compare  │ │   Project    │                  │       │
│  │  │  Engine  │ │   Builder    │                  │       │
│  │  └──────────┘ └──────────────┘                  │       │
│  └──────────────────────┬──────────────────────────┘       │
│                         │                                  │
├─────────────────────────┼──────────────────────────────────┤
│                         │                                  │
│  ┌──────────────────────┴──────────────────────────┐       │
│  │        PostgreSQL 16 + PostGIS 3.4              │       │
│  │                                                 │       │
│  │  Tables (Foundation):                           │       │
│  │  workspaces, users, workspace_members           │       │
│  │  repos (+ PostGIS GIST index), branches         │       │
│  │  commits, artifacts, commit_artifacts           │       │
│  │  audit_log, encryption_keys, public_snapshots   │       │
│  │                                                 │       │
│  │  Tables (Simulation):                           │       │
│  │  simulations, project_plans                     │       │
│  │                                                 │       │
│  │  Security:                                      │       │
│  │  ┌───────────────┐  ┌───────────────┐           │       │
│  │  │ visiogold_admin│  │ visiogold_app │           │       │
│  │  │ (bypasses RLS) │  │ (RLS enforced)│           │       │
│  │  └───────────────┘  └───────────────┘           │       │
│  │  12+ RLS policies across 8 tables               │       │
│  └─────────────────────────────────────────────────┘       │
│                                                             │
│  ┌─────────────────────────────────────────────────┐       │
│  │              Local File Storage                  │       │
│  │  ./uploads/{workspace_id}/{repo_id}/{uuid}-file  │       │
│  └─────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow: User Action to Committed Artifact

This is the primary write path for uploading evidence and committing it:

```
1. User uploads file via UI
       │
       ▼
2. POST /api/branches/:branchId/artifacts
       │
       ▼
3. Middleware Chain
   ├── extractAuth()       → Verify JWT, extract user payload
   ├── validateWorkspace() → Check workspace membership + role
   ├── checkRole()         → Verify ANALYST+ permission
   └── withRLS()           → Begin transaction, SET LOCAL workspace/user context
       │
       ▼
4. Handler Logic
   ├── Parse multipart form data
   ├── sha256(fileBuffer)    → Content-addressable hash
   ├── storeFile()           → Write to ./uploads/{ws}/{repo}/{uuid}-filename
   ├── INSERT INTO artifacts → DB record with hash, path, metadata
   ├── auditAction()         → INSERT INTO audit_log (ARTIFACT_UPLOAD)
   └── COMMIT transaction
       │
       ▼
5. User creates commit
       │
       ▼
6. POST /api/branches/:branchId/commits
   ├── References artifact IDs + paths + change types
   ├── INSERT INTO commits → Immutable commit record
   ├── INSERT INTO commit_artifacts → Junction entries
   ├── UPDATE branches SET head_commit_id → Advance branch pointer
   └── COMMIT transaction
```

---

## Mapping Pipeline

The geospatial data pipeline is currently client-side:

```
GeoJSON Fixtures (src/data/)
├── tenements.geojson
├── geology.geojson
├── occurrences.geojson
├── security-events.geojson
├── infrastructure.geojson
└── drc-boundary.geojson
       │
       ▼
Vite Import (build-time bundling)
       │
       ▼
Layer Registry (src/lib/layers-registry.ts)
├── LayerDefinition[] with MapLibre paint/layout specs
├── Per-layer: id, label, icon, visibility default, sublayers
       │
       ▼
useLayers Hook (src/hooks/useLayers.ts)
├── Manages layer visibility state
├── Adds/removes MapLibre sources and layers
├── Syncs with GlobeMap component
       │
       ▼
GlobeMap (src/components/map/GlobeMap.tsx)
├── MapLibre GL instance
├── Layer rendering with style expressions
├── Click handlers → useFeatureSelection
       │
       ▼
Opportunity Engine (src/lib/opportunity-engine.ts)
├── Runs on all tenement features
├── Turf.js: buffer, intersects, centroid, area, distance
├── scoringRules: prospectivity, access, security, legal, data
├── Composite score with weighted blend
└── Ranked OpportunityFeed
```

**Future pipeline**: Replace client-side GeoJSON with PostGIS server queries via the `DataAdapter` interface (`src/lib/adapters/layer-adapter.ts`).

---

## Simulation Pipeline

```
User configures scenario (ScenarioSliders)
       │
       ▼
POST /api/repos/:id/branches/:id/simulations/run
       │
       ▼
SimulationService.runSimulation()
├── Generate or accept seed (for determinism)
├── Compute costs:
│   ├── createSeededRng(seed)
│   ├── For each of 1,000 iterations:
│   │   ├── For each of 12 departments:
│   │   │   ├── Sample from triangular(low, mode, high)
│   │   │   ├── Apply multipliers (logistics × security × camp × compliance)
│   │   │   └── Sum to iteration total
│   │   └── Record iteration totals
│   └── Compute percentiles: P10, P50, P90
│
├── Compute schedule:
│   ├── createSeededRng(seed + 7777)  ← offset to avoid correlation
│   ├── For each of 1,000 iterations:
│   │   ├── For each phase: sample triangular × timeline_factor
│   │   └── Sum phase durations
│   ├── Compute percentiles
│   ├── Critical path: top 4 phases by median duration
│   └── Risk flags: rule-based (timeline, duration, drilling size)
│
├── Compute risk impact:
│   ├── Start from DRC baselines
│   ├── Adjust per dimension based on inputs
│   ├── Clamp to [0, 100]
│   └── Attach evidence + mitigations
│
├── Persist to simulations table (inputs + outputs as JSONB)
├── Create SIMULATION artifact on branch
└── Return complete results
```

---

## Decisions and Tradeoffs

### Why Two Servers?

The Next.js API handles foundation operations (auth, repos, branches, commits, artifacts) where RLS and middleware composition are critical. The Express server handles computation-heavy simulation and project planning where simpler request handling is preferred. Both share the same PostgreSQL database.

**Tradeoff**: Additional operational complexity vs. clean separation of concerns. The Express server can be scaled independently for computation load.

### Why Client-Side GeoJSON Instead of PostGIS Queries?

For the MVP, bundling GeoJSON fixtures via Vite provides zero-latency map rendering without database dependencies on the frontend. The `DataAdapter` interface is defined for future server-side spatial queries.

**Tradeoff**: Dataset size is limited by bundle size. Production deployments with large datasets should use PostGIS.

### Why RLS Over Application-Level Filtering?

Row-Level Security policies are enforced at the database level, meaning tenant isolation cannot be bypassed by application bugs. Every query — including those in future code — automatically respects workspace boundaries.

**Tradeoff**: RLS adds per-query overhead and requires careful transaction management (`SET LOCAL` per request). The `withRLS()` helper centralizes this pattern.

### Why Immutable Commits and Artifacts?

Mining project data has regulatory and legal significance. Immutable commits ensure that once evidence is recorded, it cannot be altered without creating a new version. SHA-256 hashing provides content-addressable verification.

**Tradeoff**: Storage grows monotonically. No garbage collection or pruning of old artifacts.

### Why Seeded Monte Carlo?

Seeded RNG (`seedrandom` library) ensures that the same inputs + seed always produce the same outputs. This enables reproducible scenario analysis and meaningful comparisons between runs with different parameters.

**Tradeoff**: Fixed iteration count (1,000) balances accuracy with performance. Not yet configurable per request.

### Why Express 5?

The project uses Express 5.2.1, which includes native async route handler support and improved error handling.

**Tradeoff**: Express 5 was a long-awaited release. Some middleware compatibility may need verification.
