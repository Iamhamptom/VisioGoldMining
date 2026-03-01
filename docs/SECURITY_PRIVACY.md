# Security & Privacy — VisioGold DRC

## Threat Model Summary

VisioGold DRC processes sensitive mining project data — geological surveys, financial models, permit documentation, and strategic assessments. The threat model addresses:

| Threat | Risk Level | Mitigation |
|--------|-----------|------------|
| Unauthorized cross-tenant data access | Critical | PostgreSQL RLS enforced at DB level on all tenant-scoped tables |
| Credential theft / session hijacking | High | Short-lived JWTs (15min), bcrypt password hashing (12 rounds) |
| Data tampering / evidence fraud | High | Immutable commits, SHA-256 artifact hashing, append-only audit log |
| Insider threat (over-privileged access) | Medium | RBAC hierarchy with minimum-privilege permission mapping |
| Data exposure through public snapshots | Medium | Configurable redaction rules, separate public read path |
| Storage-level data breach | Medium | Envelope encryption schema (AES-256-GCM with DEK/KEK) |
| SQL injection | Medium | Parameterized queries throughout, Zod input validation |
| Unintended data retention | Low | All artifacts tied to workspace scope, cascading deletes |

---

## Tenancy Isolation Approach

VisioGold uses a **shared database, shared schema** multi-tenant model with **PostgreSQL Row-Level Security (RLS)** for isolation.

### How It Works

1. Every tenant-scoped table has a `workspace_id` column
2. RLS is enabled and **forced** on all 8 tenant tables (even table owners cannot bypass)
3. Every application query runs within an RLS-scoped transaction:

```sql
BEGIN;
SET LOCAL app.current_workspace_id = '<workspace-uuid>';
SET LOCAL app.current_user_id = '<user-uuid>';
-- All queries in this transaction only see rows matching the workspace
COMMIT;
```

4. This is managed by the `withRLS()` helper (`src/lib/db.ts`), which wraps every handler's database operations

### RLS Policy Map

| Table | Policy | Type | Condition |
|-------|--------|------|-----------|
| `workspaces` | `workspaces_isolation` | ALL | `id = current_workspace_id()` |
| `workspace_members` | `workspace_members_isolation` | ALL | `workspace_id = current_workspace_id()` |
| `repos` | `repos_isolation` | ALL | `workspace_id = current_workspace_id()` |
| `branches` | `branches_isolation` | ALL | `workspace_id = current_workspace_id()` |
| `branches` | `branches_shared_read` | SELECT | `visibility = 'SHARED_WITH_VISIOGOLD' AND workspace = org_workspace` |
| `commits` | `commits_isolation` | ALL | `workspace_id = current_workspace_id()` |
| `artifacts` | `artifacts_isolation` | ALL | `workspace_id = current_workspace_id()` |
| `commit_artifacts` | `commit_artifacts_isolation` | ALL | `workspace_id = current_workspace_id()` |
| `audit_log` | `audit_log_select` | SELECT | `workspace_id = current_workspace_id()` |
| `audit_log` | `audit_log_insert` | INSERT | `workspace_id = current_workspace_id()` |
| `encryption_keys` | `encryption_keys_isolation` | ALL | `workspace_id = current_workspace_id()` |
| `public_snapshots` | `public_snapshots_isolation` | ALL | `workspace_id = current_workspace_id()` |
| `public_snapshots` | `public_snapshots_public_read` | SELECT | `published = true` |

All policies are defined in `migrations/008_rls_policies.sql`.

---

## RLS and Authorization Strategy

### Two Database Roles

| Role | Purpose | RLS | Usage |
|------|---------|-----|-------|
| `visiogold_admin` | Migrations, seeding, admin operations | Bypassed (table owner) | `scripts/migrate.ts`, `scripts/seed.ts` |
| `visiogold_app` | Application runtime queries | Enforced | All API handlers via `withRLS()` |

### RBAC Hierarchy

```
OWNER (3)  → Full workspace control, delete repos, manage billing
  ↑
ADMIN (2)  → Create repos, manage members, publish, merge, read audit
  ↑
ANALYST (1) → Create branches, upload artifacts, create commits
  ↑
VIEWER (0)  → Read repos, read artifacts, view map
```

### Permission Matrix

| Permission | Minimum Role | Code Reference |
|-----------|-------------|----------------|
| `repo:read` | VIEWER | `src/lib/rbac.ts` |
| `repo:create` | ADMIN | `src/lib/rbac.ts` |
| `repo:update` | ANALYST | `src/lib/rbac.ts` |
| `repo:delete` | OWNER | `src/lib/rbac.ts` |
| `branch:create` | ANALYST | `src/lib/rbac.ts` |
| `branch:publish` | ADMIN | `src/lib/rbac.ts` |
| `commit:create` | ANALYST | `src/lib/rbac.ts` |
| `commit:merge` | ADMIN | `src/lib/rbac.ts` |
| `artifact:upload` | ANALYST | `src/lib/rbac.ts` |
| `artifact:read` | VIEWER | `src/lib/rbac.ts` |
| `member:manage` | ADMIN | `src/lib/rbac.ts` |
| `workspace:update` | OWNER | `src/lib/rbac.ts` |
| `audit:read` | ADMIN | `src/lib/rbac.ts` |

### Middleware Composition

Every API route uses `createHandler()` (`src/lib/handler.ts`) which chains:

1. **extractAuth** — Verify JWT from `Authorization: Bearer` header
2. **validateWorkspaceAccess** — Confirm user is a member of the target workspace
3. **checkRole** — Verify user's role meets the route's minimum requirement
4. **withRLS** — Execute handler within RLS-scoped transaction
5. **auditAction** — Log the action on successful completion (within the same transaction)

---

## Audit Log Strategy

### Design Principles

- **Append-only**: The `audit_log` table has INSERT and SELECT grants only. No UPDATE or DELETE is possible for the application role.
- **Transactional**: Audit events are written within the same transaction as the action they record. If the action rolls back, the audit entry rolls back too — no phantom entries.
- **Comprehensive**: 16 action types cover all significant operations.

### Captured Fields

| Field | Type | Description |
|-------|------|-------------|
| `workspace_id` | UUID | Tenant context |
| `user_id` | UUID | Acting user (nullable for system events) |
| `action` | VARCHAR(50) | One of 16 enumerated actions |
| `resource_type` | VARCHAR(50) | Type of affected resource (repo, branch, artifact, etc.) |
| `resource_id` | UUID | ID of affected resource |
| `details` | JSONB | Additional context (e.g., changed fields, merge sources) |
| `ip_address` | INET | Client IP from `x-forwarded-for` or `x-real-ip` header |
| `user_agent` | TEXT | Client user-agent string |
| `created_at` | TIMESTAMPTZ | Server-side timestamp |

### Audit Actions

`LOGIN`, `LOGOUT`, `REPO_READ`, `REPO_CREATE`, `REPO_UPDATE`, `BRANCH_CREATE`, `COMMIT_CREATE`, `COMMIT_MERGE`, `ARTIFACT_UPLOAD`, `ARTIFACT_DOWNLOAD`, `PUBLISH`, `MEMBER_ADD`, `MEMBER_REMOVE`, `MEMBER_ROLE_CHANGE`, `WORKSPACE_CREATE`

### Querying

The `GET /api/audit` endpoint (`src/app/api/audit/route.ts`) supports filtering by:
- `action` — Filter by action type
- `user_id` — Filter by acting user
- `resource_type` — Filter by resource category
- `page` / `limit` — Pagination (default 50 per page, max 100)

### Known Limitations

- 🔴 No hash-chain or event signing for tamper detection
- 🔴 No log retention policy or archival
- 🟡 Transactional audit means rollbacks also lose the audit entry

---

## Data Ownership and Sharing Controls

### Visibility Model

| Level | Who Can See | Use Case |
|-------|-----------|----------|
| **PRIVATE** | Workspace members only | Default. Internal project work. |
| **SHARED_WITH_VISIOGOLD** | Workspace members + VisioGold org workspace | Sharing with VisioGold platform operators for review. |
| **PUBLIC** | Anyone with the snapshot slug | Published snapshots for external stakeholders. |

### Branch-Level Visibility

Branches carry a `visibility` field that controls access:
- `PRIVATE` branches are only visible within the owning workspace (standard RLS)
- `SHARED_WITH_VISIOGOLD` branches have an additional RLS policy allowing the VisioGold org workspace to read them
- `PUBLIC` branches can be published as snapshots with controlled redaction

### Redaction Rules for Public Snapshots

When publishing a branch as a public snapshot, users can configure redaction rules:

1. **exclude_artifact_types** — Exclude entire artifact types (e.g., hide all VENDOR_REPORT artifacts)
2. **exclude_paths** — Exclude artifacts matching glob patterns (e.g., `internal/*`)
3. **exclude_metadata_fields** — Strip specific metadata fields from exposed artifacts

Redaction is applied at query time by the public API handler (`src/app/api/public/[slug]/artifacts/route.ts`).

---

## What Gets Stored, What Doesn't

### Stored (Persistent)

| Data | Location | Encrypted |
|------|----------|-----------|
| User credentials (password hash) | `users.password_hash` | bcrypt hashed (12 rounds) |
| JWT tokens | Client-side cookie | Signed (HS256), not encrypted at rest |
| Workspace / repo / branch metadata | PostgreSQL tables | No (RLS-protected) |
| Commit history | `commits` table | No (immutable, RLS-protected) |
| Artifact files | `./uploads/` filesystem | 🟡 Schema supports encryption, not yet active |
| Artifact metadata | `artifacts` table | No (RLS-protected) |
| Audit log entries | `audit_log` table | No (append-only, RLS-protected) |
| Simulation inputs/outputs | `simulations` table (JSONB) | No (RLS-protected) |
| Project plans | `project_plans` table (JSONB) | No (RLS-protected) |
| Encryption keys | `encryption_keys` table | Root-key encrypted (AES-256-GCM) |

### Not Stored

- Raw passwords (only bcrypt hashes)
- Session state (stateless JWT)
- Client-side map tiles (served from CARTO CDN)
- GeoJSON fixture data modifications (read-only at runtime)

---

## How to Handle "Public Snapshot" Redaction Safely

### Publication Flow

1. ADMIN selects a branch to publish
2. Configures redaction rules via the Publish Branch Dialog
3. System creates a `public_snapshots` record with:
   - Reference to the specific `commit_id` (not live branch — snapshot is frozen)
   - Redaction rules stored as JSONB
4. System sets `published = true` and records `published_at` timestamp
5. Public API serves the snapshot at `/api/public/:slug`

### Redaction Application

The public artifacts endpoint applies redaction before returning data:

```
1. Load snapshot → get commit_id + redaction_rules
2. Load commit tree → get all artifact entries
3. For each redaction rule:
   ├── exclude_artifact_types: filter out matching types
   ├── exclude_paths: filter out matching glob patterns
   └── exclude_metadata_fields: strip fields from metadata_json
4. Return filtered artifact list
```

### Safety Considerations

- Snapshots reference a **specific commit**, not the live branch head. Publishing does not expose future changes.
- Redaction is applied at **query time**, meaning the underlying data is never modified. Changing redaction rules affects what's visible, not what's stored.
- The public API handler uses `createPublicHandler()` which bypasses authentication but uses the admin database connection to read only published snapshots.
- The `public_snapshots_public_read` RLS policy allows unauthenticated reads only when `published = true`.

### Recommendations for Production

- 🔴 Implement pre-publication review (require a second ADMIN to approve)
- 🔴 Add a "preview" mode that shows what the public would see before publishing
- 🔴 Add snapshot expiration dates for time-limited sharing
- 🔴 Add download logging for published artifacts (currently not audited for unauthenticated access)
