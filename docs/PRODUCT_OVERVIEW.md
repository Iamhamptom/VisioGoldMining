# Product Overview — VisioGold DRC

## Product Thesis

VisioGold DRC is a **secure mining opportunity workstation** purpose-built for the Democratic Republic of the Congo gold sector.

The DRC holds some of the world's most promising undeveloped gold deposits, yet the information landscape is fragmented, access is difficult, and operational risks are high. VisioGold addresses this by consolidating geospatial intelligence, project documentation, financial simulation, and risk analysis into a single, private, version-controlled platform that treats mining project data with the same rigor that software teams apply to source code.

The core insight: **mining project evaluation requires the same tooling primitives as software development** — version control, branching, immutable audit trails, and reproducible builds (simulations). VisioGold applies these concepts to the mining domain.

---

## DRC-First Scope

VisioGold is intentionally scoped to the DRC gold sector:

- **Geospatial data** covers DRC boundaries, provinces, and mining cadastre
- **Regulatory references** align with DRC Mining Code 2018 and CAMI (Cadastre Minier)
- **Cost priors** are calibrated to DRC-specific logistics, security, and operational realities
- **Risk models** account for DRC-specific factors: armed group activity, road accessibility by season, CAMI processing timelines, and community engagement requirements
- **Province coverage**: Ituri, South Kivu, North Kivu, Haut-Katanga, Haut-Uele, Tanganyika, Maniema, Kasai

Future releases may extend to other African mining jurisdictions, but the DRC focus ensures depth over breadth.

---

## How Users Discover Opportunities and Build Projects

### 1. Discover (Map & Opportunities)

Users begin on the interactive globe, which provides a satellite-like view of the DRC. Toggling layers reveals tenement boundaries, geological formations, known mineral occurrences, security events, and infrastructure. The **Opportunity Engine** automatically scores every tenement across five dimensions and surfaces ranked opportunity cards with evidence-based explanations.

### 2. Evaluate (Repos & Evidence)

When a user identifies a promising tenement, they create a **Repo** — a project container tied to a geographic polygon. Within the repo, they create branches to explore different evaluation paths. Artifacts (documents, datasets, reports) are uploaded with SHA-256 hashing for provenance. Every change is captured in immutable commits.

### 3. Simulate (Simulation Studio)

Users configure scenario parameters (project type, logistics mode, security posture, drilling program, etc.) and run Monte Carlo simulations. The engine produces P10/P50/P90 cost distributions across 12 departments, schedule estimates with critical path analysis, and risk impact scores across five dimensions. Multiple scenarios can be compared side-by-side.

### 4. Plan (Project Builder)

The Project Builder wizard generates a complete project plan: phased task groups with duration estimates, document checklists aligned to DRC regulatory requirements, risk registers with mitigation strategies, and timeline summaries. Plans can link to simulation budgets for integrated cost-schedule-risk views.

### 5. Share (Public Snapshots)

When ready, users can publish controlled snapshots of their branch with configurable redaction rules — excluding specific artifact types, file paths, or metadata fields. This enables secure sharing with external partners or investors without exposing sensitive internal data.

---

## What's Included vs. What's Coming Next

### Included (Current Release)

| Module | Status |
|--------|--------|
| Multi-tenant workspace management | ✅ Implemented |
| JWT authentication with bcrypt hashing | ✅ Implemented |
| RBAC (VIEWER/ANALYST/ADMIN/OWNER) | ✅ Implemented |
| Row-Level Security (RLS) on all tables | ✅ Implemented |
| Repo / Branch / Commit version control | ✅ Implemented |
| Artifact upload with SHA-256 hashing | ✅ Implemented |
| Three-way merge with conflict detection | ✅ Implemented |
| Append-only audit logging | ✅ Implemented |
| Interactive DRC globe and map | ✅ Implemented |
| Layer toggles (tenements, geology, occurrences, security, infrastructure) | ✅ Implemented |
| Opportunity Engine with composite scoring | ✅ Implemented |
| Monte Carlo cost engine (12 departments) | ✅ Implemented |
| Schedule engine with critical path analysis | ✅ Implemented |
| Risk impact engine (5 dimensions) | ✅ Implemented |
| Scenario comparison engine | ✅ Implemented |
| Project Builder with task templates | ✅ Implemented |
| Document checklists | ✅ Implemented |
| Risk register generation | ✅ Implemented |
| Public snapshot publishing with redaction | ✅ Implemented |
| Envelope encryption (AES-256-GCM) schema | ✅ Implemented |

### Coming Next

| Module | Status |
|--------|--------|
| Artifact encryption at upload/download | 🟡 Schema exists, not wired in API routes |
| Refresh token mechanism | 🔴 Planned |
| Rate limiting | 🔴 Planned |
| Agent Manager (AI-assisted evaluation) | 🔴 Planned |
| Pursue-Data workflow | 🔴 Planned |
| Explore feed publishing | 🔴 Planned |
| Vendor directory | 🔴 Planned |
| Deeper geology models | 🔴 Planned |
| S3/GCS artifact storage | 🔴 Planned |
| Real-time collaboration | 🔴 Planned |

---

## Who It's For

### Investors & Operators

Evaluate DRC gold opportunities with quantified risk-reward profiles. Run multiple scenarios to stress-test project economics before committing capital. Generate investor-grade project plans with regulatory checklists.

### Mining Analysts

Build evidence repositories with version control and provenance tracking. Attach geological data, survey results, and regulatory documents to specific project branches. Compare scenarios across different operational configurations.

### Advisory & Consulting Firms

Produce structured project evaluations backed by Monte Carlo simulations. Share controlled snapshots with clients while retaining full audit trails internally.
