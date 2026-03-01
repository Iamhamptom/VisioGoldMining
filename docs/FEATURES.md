# Feature Catalog — VisioGold DRC

Features are grouped by module and marked with implementation status:

- ✅ **Implemented** — Feature is complete and functional in the codebase
- 🟡 **Partially implemented** — Schema or scaffolding exists but not fully wired
- 🔴 **Planned / Not yet implemented** — On the roadmap but no code present

---

## Foundation OS

### Security & Authentication

| Feature | Status | Description | Code Location |
|---------|--------|-------------|---------------|
| JWT authentication | ✅ Implemented | Stateless auth using HS256-signed JWTs via `jose` library. Token includes user ID, email, workspace ID, and role. | `src/lib/auth.ts` |
| Password hashing | ✅ Implemented | bcrypt with 12 salt rounds via `bcryptjs`. | `src/lib/auth.ts` |
| Login / Logout | ✅ Implemented | Token-based login with cookie support. Logout clears the auth cookie. | `src/app/api/auth/login/route.ts`, `src/app/api/auth/logout/route.ts` |
| Session context (`/me`) | ✅ Implemented | Returns current user profile with workspace memberships. | `src/app/api/auth/me/route.ts` |
| Refresh token rotation | 🔴 Planned | `.env.example` defines `REFRESH_TOKEN_EXPIRY=7d` but no refresh endpoint exists. Tokens expire in 15 minutes with no renewal path. | — |
| Rate limiting | 🔴 Planned | No request throttling implemented. Required before production. | — |
| CORS configuration | 🟡 Partially implemented | Express server uses `cors()` with default (permissive) settings. No origin whitelist. | `server/src/app.ts` |

### Multi-Tenancy & RBAC

| Feature | Status | Description | Code Location |
|---------|--------|-------------|---------------|
| Workspaces (tenants) | ✅ Implemented | Workspace CRUD with slug-based routing. Settings stored as JSONB. | `src/app/api/workspaces/route.ts`, `migrations/002_workspaces_users.sql` |
| Workspace members | ✅ Implemented | Add members by email with role assignment. Unique constraint on (workspace_id, user_id). | `src/app/api/workspaces/[id]/members/route.ts` |
| Role hierarchy | ✅ Implemented | VIEWER (0) < ANALYST (1) < ADMIN (2) < OWNER (3). Numeric comparison with `hasMinimumRole()`. | `src/lib/rbac.ts` |
| Permission mapping | ✅ Implemented | 12 permissions mapped to minimum roles (e.g., `repo:create` requires ADMIN, `artifact:upload` requires ANALYST). | `src/lib/rbac.ts` |
| Row-Level Security (RLS) | ✅ Implemented | RLS enabled and forced on all 8 tenant-scoped tables. Policies use `SET LOCAL app.current_workspace_id`. | `migrations/008_rls_policies.sql` |
| RLS helper functions | ✅ Implemented | `current_workspace_id()` and `current_user_id()` SQL functions for policy evaluation. | `migrations/008_rls_policies.sql` |
| Shared branch visibility | ✅ Implemented | `SHARED_WITH_VISIOGOLD` branches visible to the VisioGold org workspace via additional RLS policy. | `migrations/008_rls_policies.sql` |
| Composable middleware | ✅ Implemented | `createHandler()` chains auth, workspace, role, and audit middleware in a single function call. | `src/lib/handler.ts` |

### Repo / Branch / Commit OS

| Feature | Status | Description | Code Location |
|---------|--------|-------------|---------------|
| Repos with PostGIS | ✅ Implemented | Project containers with `GEOMETRY(Polygon, 4326)` column, GIST index, and metadata JSONB. | `migrations/003_repos_branches.sql`, `src/app/api/repos/route.ts` |
| Branch management | ✅ Implemented | Branches with visibility control (PRIVATE / SHARED_WITH_VISIOGOLD / PUBLIC), parent branch reference, and head commit tracking. | `migrations/003_repos_branches.sql`, `src/app/api/repos/[repoId]/branches/route.ts` |
| Immutable commits | ✅ Implemented | Commits table with INSERT-only grants (no UPDATE/DELETE). Parent commit and merge source tracking. | `migrations/004_commits_artifacts.sql`, `src/app/api/branches/[branchId]/commits/route.ts` |
| Commit-artifact junction | ✅ Implemented | `commit_artifacts` table tracks per-commit changes (ADD/UPDATE/DELETE) with path and previous artifact reference. | `migrations/004_commits_artifacts.sql` |
| Diff (content-addressable) | ✅ Implemented | Tree resolution via recursive CTE. Compares SHA-256 hashes to produce added/modified/deleted entries. | `src/app/api/commits/diff/route.ts` |
| Three-way merge | ✅ Implemented | Merge with conflict detection when both branches modify the same path with different hashes. Provenance tracking via `merge_source_commit_id`. | `src/app/api/commits/merge/route.ts` |
| Merge conflict resolution UI | 🔴 Planned | Merge endpoint returns conflicts (HTTP 409) but no UI for resolution. | — |

### Artifacts & Storage

| Feature | Status | Description | Code Location |
|---------|--------|-------------|---------------|
| Artifact upload | ✅ Implemented | Multipart upload via `POST /api/branches/:id/artifacts`. Files stored on local filesystem with UUID-prefixed names. | `src/app/api/branches/[branchId]/artifacts/route.ts`, `src/lib/storage.ts` |
| SHA-256 hashing | ✅ Implemented | Every artifact hashed at upload time for content-addressable provenance. | `src/lib/hash.ts` |
| Artifact download | ✅ Implemented | `GET /api/artifacts/:id` returns file with proper content-type and disposition headers. | `src/app/api/artifacts/[artifactId]/route.ts` |
| Artifact type enum | ✅ Implemented | 8 types: DOCUMENT, DATASET, PLAN, SIMULATION, TASKS, NOTE, RISK_REGISTER, VENDOR_REPORT. DB constraint enforced. | `migrations/004_commits_artifacts.sql`, `src/types/index.ts` |
| Envelope encryption schema | ✅ Implemented | `encrypted_dek` (BYTEA) and `encryption_key_id` (UUID FK) columns on artifacts table. Encryption keys table with workspace-scoped versioning. | `migrations/004_commits_artifacts.sql`, `migrations/006_encryption_keys.sql` |
| Artifact encryption (runtime) | 🟡 Partially implemented | `src/lib/crypto.ts` has full AES-256-GCM encrypt/decrypt functions and DEK/KEK operations. Not wired into upload/download API routes. | `src/lib/crypto.ts` |
| S3/GCS storage adapter | 🔴 Planned | Currently local filesystem only. Adapter interface exists (`src/lib/adapters/layer-adapter.ts`) for future backends. | — |

### Audit Logging

| Feature | Status | Description | Code Location |
|---------|--------|-------------|---------------|
| Append-only audit log | ✅ Implemented | INSERT-only grants. 16 action types covering auth, repos, branches, commits, artifacts, members, and publishing. | `migrations/005_audit_log.sql` |
| Audit event fields | ✅ Implemented | Captures workspace_id, user_id, action, resource_type, resource_id, details (JSONB), IP address (INET), user_agent, timestamp. | `migrations/005_audit_log.sql`, `src/lib/audit.ts` |
| RLS on audit log | ✅ Implemented | Workspace-scoped SELECT and INSERT policies. | `migrations/008_rls_policies.sql` |
| Audit API with filtering | ✅ Implemented | `GET /api/audit` with query params for action, user_id, resource_type, pagination. | `src/app/api/audit/route.ts` |
| Audit log viewer UI | ✅ Implemented | Table view with filters and pagination. | `src/components/audit-log-viewer.tsx`, `src/app/(app)/audit/page.tsx` |
| Transactional audit | ✅ Implemented | Audit events logged within the same RLS transaction as the action, ensuring consistency. | `src/lib/handler.ts` |
| Tamper detection / signing | 🔴 Planned | No hash chain or event signing. Logs rely on DB-level INSERT-only grants for integrity. | — |

### Public Snapshots

| Feature | Status | Description | Code Location |
|---------|--------|-------------|---------------|
| Snapshot publishing | ✅ Implemented | `POST /api/branches/:id/publish` creates a snapshot with slug, title, description, and redaction rules. | `src/app/api/branches/[branchId]/publish/route.ts` |
| Redaction rules | ✅ Implemented | Three rule types: `exclude_artifact_types`, `exclude_paths` (glob), `exclude_metadata_fields`. Validated with Zod. | `src/lib/validation.ts`, `src/types/index.ts` |
| Public viewer | ✅ Implemented | Read-only page at `/p/:slug` with filtered artifact list. No authentication required. | `src/app/(public)/p/[slug]/page.tsx`, `src/app/api/public/[slug]/route.ts` |
| Publish dialog | ✅ Implemented | UI for configuring slug, title, and redaction rules before publishing. | `src/components/publish-branch-dialog.tsx` |

---

## Map + Opportunities

| Feature | Status | Description | Code Location |
|---------|--------|-------------|---------------|
| 3D animated globe | ✅ Implemented | Landing globe using `cobe` library with auto-rotation and DRC marker. | `src/components/screens/GlobeHome.tsx` |
| MapLibre GL map | ✅ Implemented | Full interactive map with CARTO dark matter basemap, zoom/pan, and programmatic fly-to. | `src/components/map/GlobeMap.tsx`, `src/lib/map-config.ts` |
| DRC boundary layer | ✅ Implemented | GeoJSON outline of DRC national boundary. | `src/data/drc-boundary.geojson` |
| Tenements layer | ✅ Implemented | Mining cadastre polygons with status-based fill color (granted/pending/expired). | `src/data/tenements.geojson`, `src/lib/layers-registry.ts` |
| Geology layer | ✅ Implemented | Lithological units with color-coded fills and dashed outlines. | `src/data/geology.geojson`, `src/lib/layers-registry.ts` |
| Mineral occurrences layer | ✅ Implemented | Point features with commodity-based colors (Gold, Copper, Cobalt, Tin, Coltan). Zoom-interpolated radius. | `src/data/occurrences.geojson`, `src/lib/layers-registry.ts` |
| Security events layer | ✅ Implemented | Point features with severity-based colors (high/medium/low). | `src/data/security-events.geojson`, `src/lib/layers-registry.ts` |
| Infrastructure layer | ✅ Implemented | LineString and Point features for roads, rivers, railways, airports. Type-based styling. | `src/data/infrastructure.geojson`, `src/lib/layers-registry.ts` |
| Layer toggle panel | ✅ Implemented | Sidebar panel with per-layer visibility toggles, descriptions, and legend colors. | `src/components/map/LayerToggle.tsx` |
| Map controls | ✅ Implemented | Zoom, fly-to presets (All DRC, Haut-Katanga, North Kivu, etc.), and navigation controls. | `src/components/map/MapControls.tsx`, `src/lib/map-config.ts` |
| Feature selection | ✅ Implemented | Click-to-select map features with context panel display. | `src/hooks/useFeatureSelection.ts` |
| Feature context panels | ✅ Implemented | Specialized cards for lithology, occurrences, incidents, infrastructure, and permits. | `src/components/panels/` |
| Opportunity Engine | ✅ Implemented | Scores tenements across 5 dimensions: prospectivity, access, security, legal complexity, data completeness. Weighted composite score (30/20/20/15/15). | `src/lib/opportunity-engine.ts`, `src/lib/scoring-rules.ts` |
| Spatial analysis (Turf.js) | ✅ Implemented | Buffer zones (25km, 50km), intersection tests, centroid calculation, area computation, distance measurement. | `src/lib/scoring-rules.ts` |
| Opportunity feed | ✅ Implemented | Ranked list of opportunities sorted by composite score. Score bars with dimension breakdown. | `src/components/opportunities/OpportunityFeed.tsx`, `src/components/opportunities/OpportunityCardItem.tsx` |
| Evidence-based explanations | ✅ Implemented | Natural-language explanation generated from scoring evidence per dimension. | `src/lib/opportunity-engine.ts` |
| Recommended next actions | ✅ Implemented | Rules-based action list (e.g., "Commission geophysical survey", "Verify permit status with CAMI"). | `src/lib/opportunity-engine.ts` |
| Repo creation from opportunity | ✅ Implemented | Create a repo directly from an opportunity context with pre-filled geographic data. | `src/components/repo-create-modal.tsx` |
| PostGIS spatial queries | 🔴 Planned | Currently using client-side GeoJSON fixtures via Vite imports. No server-side PostGIS queries for dynamic data. | `src/lib/adapters/layer-adapter.ts` |
| WMS / external data adapters | 🔴 Planned | Adapter interface defined but no implementations for WMS, CAMI API, or other external sources. | `src/lib/adapters/layer-adapter.ts` |

---

## Simulation + Project Builder

### Simulation Studio

| Feature | Status | Description | Code Location |
|---------|--------|-------------|---------------|
| Monte Carlo cost engine | ✅ Implemented | 1,000 iterations with seeded RNG (deterministic). Triangular distribution sampling. 12 departments with configurable multipliers (logistics, security, camp, compliance). | `server/src/engine/costEngine.ts`, `server/src/engine/distributions.ts` |
| DRC-calibrated priors | ✅ Implemented | Base costs per department per project type. Multiplier tables for logistics/security/camp/compliance. Assay and drilling cost priors. All editable in a single config file. | `server/src/config/priors.ts` |
| Schedule engine | ✅ Implemented | Phase-by-phase timeline estimation with Monte Carlo. Critical path identification (top 4 longest phases). Risk flags for aggressive timelines, long projects, large drilling programs. | `server/src/engine/scheduleEngine.ts` |
| Risk impact engine | ✅ Implemented | Five-dimension scoring: security, legal complexity, ESG, access, data completeness. DRC-specific baselines with input-driven adjustments. Evidence strings and mitigation strategies. | `server/src/engine/riskEngine.ts` |
| Scenario comparison | ✅ Implemented | Per-department cost deltas, schedule difference, per-dimension risk deltas. Rules-based recommendation (cost %, risk average, schedule gap). | `server/src/engine/compareEngine.ts` |
| Simulation persistence | ✅ Implemented | Simulations stored in PostgreSQL with inputs (JSONB), outputs (JSONB), seed, and branch reference. | `server/src/migrations/002_simulations.sql`, `server/src/services/simulation.service.ts` |
| Simulation list / retrieve | ✅ Implemented | `GET /api/branches/:id/simulations` (list) and `GET /api/simulations/:id` (detail). | `server/src/routes/simulations.ts` |
| Simulation artifact creation | ✅ Implemented | Each simulation creates a SIMULATION-type artifact with SHA-256 hash for provenance tracking. | `server/src/services/simulation.service.ts` |
| Scenario sliders UI | ✅ Implemented | Interactive parameter configuration with dropdowns and numeric inputs. | `src/components/simulation/ScenarioSliders.tsx` |
| Cost breakdown table | ✅ Implemented | Department-by-department table with P10/P50/P90 columns and cost drivers. | `src/components/simulation/CostBreakdownTable.tsx` |
| Schedule card | ✅ Implemented | Timeline visualization with critical path and risk flags. | `src/components/simulation/ScheduleCard.tsx` |
| Risk score cards | ✅ Implemented | Five dimension cards with scores, evidence, and mitigations. | `src/components/simulation/RiskScoreCards.tsx` |
| Save to branch button | ✅ Implemented | Persists simulation as branch artifact. | `src/components/simulation/SaveToBranchButton.tsx` |
| Scenario compare UI | ✅ Implemented | Side-by-side delta view with recommendation. | `src/components/simulation/ScenarioCompare.tsx` |
| Sensitivity analysis | 🔴 Planned | No tornado diagrams or parameter sensitivity visualization. | — |
| Custom prior editing | 🔴 Planned | Priors are file-based only. No UI for editing priors or uploading vendor quotes. | — |

### Project Builder

| Feature | Status | Description | Code Location |
|---------|--------|-------------|---------------|
| Multi-step wizard | ✅ Implemented | Four-step flow: Choose Goal, Select Area, Assumptions, Generate Plan. | `src/components/screens/ProjectBuilder.tsx` |
| Task template engine | ✅ Implemented | Pre-built task templates per project type with department mapping and duration estimates. | `server/src/templates/taskTemplates.ts` |
| Document checklists | ✅ Implemented | Regulatory and operational document requirements categorized and marked as required/optional. | `server/src/templates/docChecklists.ts` |
| Risk register generation | ✅ Implemented | 7 pre-built risk categories (Security, Regulatory, Logistics, Community, Technical, Financial, Environmental) with context-sensitive likelihood/impact/mitigation. | `server/src/services/projectBuilder.service.ts` |
| Budget linkage | ✅ Implemented | Plans can reference a simulation_id to pull P50 budget summary per department. | `server/src/services/projectBuilder.service.ts` |
| Timeline summary | ✅ Implemented | Aggregated phase durations from task groups. | `server/src/services/projectBuilder.service.ts` |
| Generated task board | ✅ Implemented | Visual task board with phases, tasks, durations, and status. | `src/components/project-builder/GeneratedTaskBoard.tsx` |
| Docs checklist UI | ✅ Implemented | Checkbox-based document tracking with categories. | `src/components/project-builder/DocsChecklist.tsx` |
| Export / commit step | ✅ Implemented | Commit plan as PLAN-type artifact to branch. | `src/components/project-builder/ExportCommitStep.tsx` |
| Plan persistence | ✅ Implemented | Plans stored in PostgreSQL with plan_json (JSONB) and simulation reference. | `server/src/migrations/003_project_plans.sql` |
| Gantt chart visualization | 🔴 Planned | No visual timeline/Gantt representation. Duration data exists but only in table format. | — |
| Task dependency modeling | 🔴 Planned | Tasks within phases are independent. No predecessor/successor relationships. | — |

---

## Testing

| Feature | Status | Description | Code Location |
|---------|--------|-------------|---------------|
| Auth unit tests | ✅ Implemented | JWT signing/verification, password hashing/comparison. | `tests/auth.test.ts` |
| RBAC unit tests | ✅ Implemented | Role hierarchy, permission checks. | `tests/rbac.test.ts` |
| Crypto unit tests | ✅ Implemented | Encryption/decryption, DEK generation. | `tests/crypto.test.ts` |
| Hash unit tests | ✅ Implemented | SHA-256 computation. | `tests/hash.test.ts` |
| Validation unit tests | ✅ Implemented | Zod schema validation for all API inputs. | `tests/validation.test.ts` |
| Cost engine tests | ✅ Implemented | Determinism, department count, multiplier effects, scaling. | `server/src/__tests__/costEngine.test.ts` |
| Schedule engine tests | ✅ Implemented | Phase generation, ordering, critical path. | `server/src/__tests__/scheduleEngine.test.ts` |
| Risk engine tests | ✅ Implemented | Score clamping, dimension coverage. | `server/src/__tests__/riskEngine.test.ts` |
| Compare engine tests | ✅ Implemented | Delta calculation, recommendation generation. | `server/src/__tests__/compareEngine.test.ts` |
| API integration tests | 🔴 Planned | No end-to-end route testing. | — |
| RLS policy tests | 🔴 Planned | No automated tests verifying tenant isolation. | — |
| React component tests | 🔴 Planned | No UI component testing. | — |
| E2E tests | 🔴 Planned | No browser-level testing. | — |
