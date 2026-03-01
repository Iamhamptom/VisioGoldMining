# How It Works — VisioGold DRC

VisioGold guides you from discovery to decision in a structured, auditable workflow. Here's the end-to-end process.

---

## Step 1 — Explore the Map

Start on the interactive DRC globe. Zoom into regions of interest — Haut-Katanga, Ituri, North Kivu, South Kivu. Toggle layers to reveal the full picture:

- **Tenement boundaries** show active, pending, and expired mining permits
- **Geological formations** highlight greenstone belts, granite intrusions, and other favorable lithologies
- **Mineral occurrences** mark known gold, copper, cobalt, tin, and coltan deposits
- **Security events** display recent incidents with severity ratings
- **Infrastructure** shows roads, rivers, railways, and airports

All data is rendered on a dark-matter basemap using MapLibre GL, optimized for analytical clarity.

---

## Step 2 — Discover Opportunities

The Opportunity Engine automatically scores every tenement across five dimensions:

| Dimension | Weight | What It Measures |
|-----------|--------|-----------------|
| Prospectivity | 30% | Nearby mineral occurrences and favorable geology |
| Access | 20% | Distance to roads, airports, and infrastructure |
| Security | 20% | Proximity and severity of security incidents |
| Legal Complexity | 15% | Permit status (granted, pending, expired) |
| Data Completeness | 15% | Available geological and permit data |

Opportunities are ranked by composite score and presented as cards with evidence-based explanations — not black-box ratings, but traceable logic.

---

## Step 3 — Create a Project Repository

When an opportunity warrants deeper evaluation, create a **Repo** — a version-controlled project container. Each repo is:

- Tied to a geographic polygon (the tenement or area of interest)
- Scoped to your workspace (fully isolated from other organizations)
- Initialized with a `main` branch for primary work

Think of it as a private project workspace where every change is tracked.

---

## Step 4 — Attach Evidence

Upload documents, datasets, and reports to your repo branch:

- Geological survey PDFs
- Soil sample data (CSV/Excel)
- Permit verification letters
- Vendor cost estimates
- Environmental assessments

Every file is SHA-256 hashed at upload for content integrity. Files are organized within your workspace and tied to specific branches for version control.

---

## Step 5 — Commit and Version

Create commits to capture the state of your project at key milestones. Each commit is:

- **Immutable** — once committed, it cannot be altered
- **Auditable** — who committed, when, and from where is recorded
- **Referenceable** — future commits point back to their parents, creating a complete history

Branch your work to explore alternative evaluation paths. Merge branches when ready, with automatic conflict detection.

---

## Step 6 — Run Simulations

Open the Simulation Studio and configure your scenario:

- **Project type** (exploration, small mine, industrial)
- **Logistics** (road access, mixed, helicopter-only)
- **Security posture** (low, medium, high)
- **Drilling program** (type, meters, lab package)
- **Timeline** (aggressive, normal, conservative)
- **Compliance level** (minimum, standard, investor-grade)

The Monte Carlo engine runs 1,000 iterations across 12 departments using DRC-calibrated cost priors, producing:

- **P10/P50/P90 cost ranges** per department and total
- **Schedule estimates** with critical path analysis
- **Risk scores** across security, legal, ESG, access, and data completeness
- **Cost drivers** explaining what's behind each number

Every simulation is deterministic — same inputs, same seed, same results. Always.

---

## Step 7 — Compare Scenarios

Run multiple simulations with different configurations and compare them side-by-side:

- Per-department cost deltas
- Schedule differences (days faster or slower)
- Risk impact changes per dimension
- Automated recommendation based on cost-risk trade-offs

This helps you answer questions like: "Is helicopter logistics worth the extra cost for the security benefit?" or "How much does investor-grade compliance add to the budget?"

---

## Step 8 — Generate a Project Plan

The Project Builder wizard produces a structured plan:

- **Task groups** organized by phase (targeting, licensing, exploration, drilling, feasibility, etc.)
- **Duration estimates** (min/P50/max) adjusted for your timeline preference
- **Document checklists** aligned to DRC regulatory requirements
- **Risk register** with 7 pre-built categories, likelihood/impact scoring, and mitigation strategies
- **Budget summary** linked to your simulation results

The plan is committed as an artifact on your branch — a permanent, hashed record of your project strategy.

---

## Step 9 — Share Securely

When you're ready to share findings with external stakeholders:

1. **Publish a snapshot** of your branch at a specific commit
2. **Configure redaction rules** to control what's visible:
   - Exclude sensitive artifact types (e.g., internal vendor reports)
   - Exclude specific file paths
   - Strip metadata fields
3. **Share the link** — the snapshot is accessible at a public URL without authentication

The snapshot is frozen at a specific commit. Future changes to your branch are not exposed. The full audit trail of who published what and when is maintained internally.

---

## The Result

At the end of this workflow, you have:

- A **scored opportunity assessment** backed by spatial analysis
- A **version-controlled evidence repository** with immutable history
- **Reproducible financial simulations** with transparent assumptions
- A **structured project plan** with regulatory checklists and risk register
- A **controlled sharing mechanism** with configurable redaction
- A **complete audit trail** of every action taken

All within a workspace that is cryptographically isolated from other organizations, with every artifact hashed for integrity and every action logged for accountability.

---

## Principles

| Principle | Implementation |
|-----------|---------------|
| **Nothing hidden** | Scoring evidence, cost drivers, and risk factors are always visible |
| **Always reproducible** | Seeded simulations produce identical outputs from identical inputs |
| **Immutable record** | Commits and artifacts cannot be modified after creation |
| **Isolation by default** | RLS ensures workspace boundaries are enforced at the database level |
| **Share with control** | Redacted snapshots let you decide exactly what external parties see |
