# VisioGold DRC — Foundation Module

Secure multi-tenant platform for managing gold mining project data in the DRC.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + shadcn/ui + Tailwind CSS
- **Backend**: Next.js API Route Handlers
- **Database**: PostgreSQL 16 + PostGIS
- **Auth**: Custom JWT (jose + bcryptjs)
- **Security**: Postgres Row-Level Security (RLS) for tenant isolation

## Quick Start

### Prerequisites

- Node.js 18+
- Docker (for PostgreSQL)

### Setup

```bash
# Install dependencies
npm install

# Start PostgreSQL with PostGIS
docker compose up -d

# Run database migrations
npm run migrate

# Seed development data
npm run seed

# Start development server
npm run dev
```

### Test Credentials

| Role    | Email                    | Password    |
|---------|--------------------------|-------------|
| Admin   | admin@visiogold.com      | password123 |
| Analyst | analyst@visiogold.com    | password123 |
| Viewer  | viewer@visiogold.com     | password123 |

## Architecture

### Security

- **Multi-tenant isolation** via Postgres RLS (`SET LOCAL app.current_workspace_id` per transaction)
- **Two DB roles**: `visiogold_admin` (migrations, bypasses RLS) and `visiogold_app` (application, RLS enforced)
- **RBAC**: VIEWER < ANALYST < ADMIN < OWNER role hierarchy
- **Audit log**: Append-only (INSERT only, no UPDATE/DELETE at DB level)
- **Envelope encryption**: AES-256-GCM for artifact encryption

### Repo/Branch/Commit OS

- **Repos**: Project containers with PostGIS polygon support
- **Branches**: Versioned lanes with visibility (PRIVATE / SHARED_WITH_VISIOGOLD / PUBLIC)
- **Commits**: Immutable snapshots referencing artifact changes
- **Artifacts**: SHA-256 hashed files with full provenance
- **Diff**: Content-addressable tree resolution via recursive CTE
- **Merge**: Three-way merge with conflict detection and provenance tracking

### API Endpoints

| Area        | Endpoints |
|-------------|-----------|
| Auth        | POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me |
| Workspaces  | GET/POST /api/workspaces, GET /api/workspaces/:id, POST /api/workspaces/:id/members |
| Repos       | GET/POST /api/repos, GET/PATCH /api/repos/:id, GET/POST /api/repos/:id/branches |
| Commits     | GET/POST /api/branches/:id/commits, GET /api/commits/:id, POST /api/commits/diff, POST /api/commits/merge |
| Artifacts   | GET/POST /api/branches/:id/artifacts, GET /api/artifacts/:id |
| Audit       | GET /api/audit |
| Public      | GET /api/public/:slug, GET /api/public/:slug/artifacts |

## Scripts

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run migrate    # Run database migrations
npm run seed       # Seed development data
npm test           # Run tests
npm run test:watch # Run tests in watch mode
```
