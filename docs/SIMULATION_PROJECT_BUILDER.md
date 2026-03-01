# Simulation & Project Builder — VisioGold DRC

## Overview

The Simulation Studio and Project Builder form the analytical backbone of VisioGold DRC. Together, they answer two critical questions for mining project evaluation:

1. **How much will this project cost, how long will it take, and what are the risks?** (Simulation Studio)
2. **What do we need to do, in what order, with what documentation?** (Project Builder)

Both systems produce deterministic, reproducible outputs and persist results as version-controlled artifacts.

---

## Simulation Studio

### Architecture

```
User Input (ScenarioSliders)
     │
     ▼
POST /api/repos/:id/branches/:id/simulations/run
     │
     ▼
┌─────────────────────────────────┐
│      Simulation Service         │
│  (server/src/services/          │
│   simulation.service.ts)        │
├─────────────────────────────────┤
│                                 │
│  ┌─────────┐ ┌─────────┐       │
│  │  Cost   │ │Schedule │       │
│  │ Engine  │ │ Engine  │       │
│  │ 1000    │ │ 1000    │       │
│  │ iters   │ │ iters   │       │
│  └────┬────┘ └────┬────┘       │
│       │            │            │
│  ┌────┴────┐ ┌────┴──────┐    │
│  │  Risk   │ │  Compare  │    │
│  │ Engine  │ │  Engine   │    │
│  │ (rules) │ │  (delta)  │    │
│  └─────────┘ └───────────┘    │
│                                 │
│  → Persist to simulations table │
│  → Create SIMULATION artifact   │
└─────────────────────────────────┘
```

### Input Parameters

| Parameter | Options | Effect |
|-----------|---------|--------|
| `project_type` | `exploration`, `small_mine`, `industrial` | Selects base cost ranges and schedule phases |
| `logistics_mode` | `road`, `mixed`, `heli` | Multiplier on camp/logistics and sampling costs |
| `security_posture` | `low`, `med`, `high` | Multiplier on security and camp costs |
| `camp_standard` | `basic`, `standard`, `premium` | Multiplier on camp/logistics costs |
| `compliance_rigor` | `minimum`, `standard`, `investor_grade` | Multiplier on ESG, reporting, and licensing costs |
| `samples_count` | Integer | Quantity driver for laboratory assays |
| `assay_package` | `screening`, `standard`, `full_qaqc` | Per-sample cost range |
| `labs` | `local`, `regional`, `international` | Lab location multiplier |
| `drilling_meters` | Integer | Quantity driver for drilling campaign |
| `drilling_type` | `RC`, `diamond`, `mixed` | Per-meter cost range |
| `timeline_aggressiveness` | `fast`, `normal`, `conservative` | Timeline factor (0.7 / 1.0 / 1.4) |
| `gold_price_assumption` | Number (USD/oz) | Recorded in assumptions (does not yet affect cost model) |
| `seed` | Integer (optional) | RNG seed for deterministic output |

### Cost Engine (`server/src/engine/costEngine.ts`)

#### How It Works

1. **Seeded RNG**: Creates a deterministic random number generator using `seedrandom`
2. **12 Departments**: Each department has base cost ranges [min, mode, max] defined per project type in `server/src/config/priors.ts`
3. **Multiplier Stacking**: For each department, multipliers from logistics, security, camp, and compliance are multiplied together
4. **Monte Carlo**: Runs 1,000 iterations. Each iteration samples from a triangular distribution for each department, applies multipliers, and sums to a total
5. **Percentiles**: Sorts results and computes P10, P50, P90

#### Departments

| Department | Type | Notes |
|-----------|------|-------|
| Legal & Tenure | Base + multipliers | DRC Mining Code compliance |
| Licensing & Filing | Base + multipliers | CAMI permits and filings |
| Environmental & ESG | Base + multipliers | ESIA, environmental monitoring |
| Community Engagement | Base + multipliers | Stakeholder relations, cahier des charges |
| Camp & Logistics | Base + multipliers | Most sensitive to logistics/security/camp choices |
| Security | Base + multipliers | Armed escorts, camp hardening, security firms |
| Mapping & Remote Sensing | Base + multipliers | Geophysical surveys, satellite imagery |
| Sampling & Fieldwork | Base + multipliers | Soil sampling, geological mapping |
| Laboratory Assays | Quantity-driven | samples_count × per-sample cost × shipping × lab multiplier |
| Drilling Campaign | Quantity-driven | drilling_meters × per-meter cost + mobilization |
| Technical Studies / PEA | Base + multipliers | Preliminary Economic Assessment |
| Reporting & Disclosure | Base + multipliers | NI 43-101, investor reports |

#### Quantity-Driven Departments

Laboratory assays and drilling campaign use quantity-based models instead of flat ranges:

**Assay costs**: `samples_count × sampleTriangular(per_sample_range) × shipping_multiplier × lab_location_multiplier`

**Drilling costs**: `drilling_meters × sampleTriangular(per_meter_range) + sampleTriangular(mobilization_range)`

If `drilling_meters = 0`, drilling cost is zero (exploration without drilling).

#### Output

```typescript
interface CostEngineOutput {
  department_costs: {
    department: string;    // Internal ID
    label: string;         // Display name
    cost: {
      min: number;         // P10
      p50: number;         // Median
      p90: number;         // 90th percentile
      confidence: number;  // Currently fixed at 0.3
    };
    drivers: string[];     // What's driving this cost
    notes: string;         // Calibration note
  }[];
  total_cost: { min: number; p50: number; p90: number; confidence: number };
}
```

### Schedule Engine (`server/src/engine/scheduleEngine.ts`)

#### How It Works

1. **Seeded RNG**: Uses `seed + 7777` to avoid correlation with cost engine
2. **9 Phases**: Each phase has base day ranges [min, mode, max] per project type
3. **Timeline Factor**: Applied to all phase durations (fast: 0.7, normal: 1.0, conservative: 1.4)
4. **Monte Carlo**: 1,000 iterations summing all phase durations
5. **Critical Path**: Top 4 phases by median duration
6. **Risk Flags**: Rules-based warnings

#### Phases

| Phase | Exploration | Small Mine | Industrial |
|-------|------------|-----------|-----------|
| Targeting + Data Intake | 14–60 days | 14–45 days | 14–60 days |
| Company Setup + Compliance | 30–120 days | 30–120 days | 30–120 days |
| Licensing Workflow | 60–240 days | 60–240 days | 90–365 days |
| Exploration (Mapping/Sampling) | 90–365 days | 60–240 days | 120–480 days |
| Drilling Campaign | 60–240 days | 60–240 days | 120–480 days |
| Feasibility Studies | N/A | 60–240 days | 120–480 days |
| Permitting + ESG | 30–120 days | 60–240 days | 120–480 days |
| Construction + Mobilization | N/A | 90–365 days | 180–730 days |
| Operations Readiness | N/A | 30–120 days | 60–240 days |

#### Risk Flags

| Condition | Flag |
|-----------|------|
| `timeline_aggressiveness = 'fast'` | "Aggressive timeline increases execution risk and cost overruns" |
| P50 > 730 days | "Project timeline exceeds 2 years — consider phased approach" |
| `drilling_meters > 20000` | "Large drilling program may face mobilization delays" |
| Industrial + fast | "Industrial projects rarely meet aggressive timelines in DRC" |

### Risk Impact Engine (`server/src/engine/riskEngine.ts`)

#### How It Works

Starts from DRC-specific baselines and adjusts based on user inputs. No Monte Carlo — deterministic scoring.

#### Baselines

| Dimension | Baseline | Interpretation |
|-----------|----------|---------------|
| Security | 45 | Moderate — reflects DRC reality |
| Legal Complexity | 55 | Above average — DRC Mining Code complexity |
| ESG | 40 | Moderate — standard compliance suffices |
| Access | 50 | Average — depends heavily on logistics mode |
| Data Completeness | 70 | High risk — no site-specific data yet |

#### Adjustments

Each dimension is adjusted by input parameters. For example:

- **Security**: +20 for low posture, -15 for high posture, -5 for helicopter access
- **Legal**: +15 for industrial projects, -10 for exploration, -5 for investor-grade compliance
- **ESG**: +20 for minimum compliance, -15 for investor-grade, +10 for industrial
- **Access**: +15 for helicopter (weather-dependent), -15 for road access
- **Data**: -10 for >500 samples planned, -10 for >5000m drilling

All scores are clamped to [0, 100].

#### Output per Dimension

```typescript
interface RiskScore {
  name: string;          // Display name
  score: number;         // 0–100
  evidence: string;      // Joined evidence statements
  mitigations: string[]; // Recommended mitigations
}
```

### Scenario Comparison (`server/src/engine/compareEngine.ts`)

#### How It Works

Compares two simulations by computing:

1. **Per-department cost deltas**: B.p50 - A.p50 for each department
2. **Total cost delta**: B.total - A.total
3. **Schedule delta**: B.p50_days - A.p50_days
4. **Risk deltas**: B.score - A.score for each dimension
5. **Recommendation**: Rules-based text using cost %, schedule gap, and average risk delta

#### Recommendation Logic

| Condition | Recommendation |
|-----------|---------------|
| Cost delta > 20% | "Scenario X is significantly more expensive" |
| Cost delta 5–20% | "Scenario X is moderately more expensive" |
| Cost delta < 5% | "Both scenarios have similar cost" |
| Schedule delta > 90 days | "Scenario X is Y days faster" |
| Average risk delta > 10 | "Scenario X has materially lower risk" |
| Both similar cost + risk | "Either scenario is viable" |
| A cheaper + lower risk | "Scenario A is preferred" |
| B cheaper + lower risk | "Scenario B is preferred" |
| Trade-off | "Review department-level deltas for decision" |

---

## Project Builder

### Architecture

```
User Input (Wizard Steps)
     │
     ▼
POST /api/repos/:id/branches/:id/project-plan/generate
     │
     ▼
┌─────────────────────────────────┐
│     Project Builder Service     │
│  (server/src/services/          │
│   projectBuilder.service.ts)    │
├─────────────────────────────────┤
│                                 │
│  Task Template Engine           │
│  ├── Phase-grouped tasks        │
│  ├── Duration estimates × TF    │
│  └── Department mapping         │
│                                 │
│  Document Checklists            │
│  ├── Categorized items          │
│  └── Required/optional flags    │
│                                 │
│  Risk Register Builder          │
│  ├── 7 risk categories          │
│  └── Context-sensitive scoring  │
│                                 │
│  Budget Linkage (optional)      │
│  └── Pull P50 from simulation   │
│                                 │
│  → Persist to project_plans     │
│  → Create PLAN artifact         │
└─────────────────────────────────┘
```

### Wizard Steps

#### Step 1: Choose Goal (`src/components/project-builder/ChooseGoalStep.tsx`)
Select project type (exploration / small mine / industrial) and define objectives.

#### Step 2: Select Area (`src/components/project-builder/SelectAreaStep.tsx`)
Define or select the target geographic polygon from the map.

#### Step 3: Assumptions (`src/components/project-builder/AssumptionsStep.tsx`)
Configure operational assumptions: logistics, security, timeline, compliance level.

#### Step 4: Generate Plan (`src/components/project-builder/GeneratePlanStep.tsx`)
Triggers plan generation. Optionally links to an existing simulation for budget data.

### Generated Outputs

#### Task Groups

Tasks are organized into phases with templates from `server/src/templates/taskTemplates.ts`. Each task has:
- Name, department assignment
- Duration estimates (min/P50/max) adjusted by timeline factor
- Required documents
- Status tracking (pending by default)

Phase totals are computed by summing task durations.

#### Document Checklists

Defined in `server/src/templates/docChecklists.ts`. Categories include regulatory filings, environmental documents, community agreements, and technical reports. Each item is marked as required or optional.

#### Risk Register

7 pre-built risk categories with context-sensitive scoring:

| Category | Example Risk | Context Sensitivity |
|----------|-------------|-------------------|
| Security | Armed group activity disrupting operations | Likelihood adjusted by security_posture |
| Regulatory | CAMI permit processing delays | Always high likelihood |
| Logistics | Road access cut during rainy season | Likelihood adjusted by logistics_mode |
| Community | Community opposition to activities | Fixed medium/high |
| Technical | Results don't support economic mineralization | Likelihood adjusted by project_type |
| Financial | Gold price decline impacts economics | Fixed medium/medium |
| Environmental | EIES approval delayed | Fixed medium/medium |

#### Budget Summary (optional)

If a `simulation_id` is provided, the plan pulls the P50 total cost and per-department cost breakdown from the linked simulation.

#### Timeline Summary

Aggregated P50 durations per phase from the task groups.

### Persistence

Plans are stored in `project_plans` table (`server/src/migrations/003_project_plans.sql`) with:
- Full plan as JSONB (`plan_json`)
- Reference to simulation (`simulation_id`, nullable)
- Branch and workspace context
- SHA-256 hashed PLAN artifact on the branch

---

## DRC-Calibrated Priors (`server/src/config/priors.ts`)

All cost, schedule, and risk parameters are centralized in a single configuration file. This design allows:

- Non-developer calibration by editing one file
- Clear separation of domain knowledge from engine logic
- Future migration to a database-backed configuration system

### Prior Categories

| Category | Description |
|----------|-------------|
| `base_costs` | Per-department cost ranges by project type [min, mode, max] |
| `logistics_multiplier` | Cost multipliers by logistics mode per department |
| `security_multiplier` | Cost multipliers by security posture per department |
| `camp_multiplier` | Cost multipliers by camp standard per department |
| `compliance_multiplier` | Cost multipliers by compliance rigor per department |
| `timeline_factor` | Schedule multiplier by aggressiveness (0.7 / 1.0 / 1.4) |
| `assay_cost_priors` | Per-sample cost ranges by assay package + shipping multiplier |
| `lab_location_multiplier` | Cost factor by lab location (local/regional/international) |
| `drilling_cost_priors` | Per-meter cost ranges by drilling type |
| `drilling_mobilization_range` | One-time mobilization cost range |
| `schedule_base_days` | Per-phase day ranges by project type |
| `risk_baselines` | Starting risk scores per dimension |

---

## Testing

| Test | File | Coverage |
|------|------|----------|
| Cost engine determinism | `server/src/__tests__/costEngine.test.ts` | Same seed = same output |
| Cost engine department count | `server/src/__tests__/costEngine.test.ts` | Always 12 departments |
| Cost engine multiplier effects | `server/src/__tests__/costEngine.test.ts` | Higher security → higher cost |
| Cost engine scaling | `server/src/__tests__/costEngine.test.ts` | Industrial > small_mine > exploration |
| Schedule engine phases | `server/src/__tests__/scheduleEngine.test.ts` | Non-zero phases per project type |
| Schedule engine ordering | `server/src/__tests__/scheduleEngine.test.ts` | min < p50 < p90 |
| Risk engine clamping | `server/src/__tests__/riskEngine.test.ts` | All scores in [0, 100] |
| Risk engine dimensions | `server/src/__tests__/riskEngine.test.ts` | All 5 dimensions present |
| Compare engine deltas | `server/src/__tests__/compareEngine.test.ts` | Delta = B - A |
| Compare engine recommendation | `server/src/__tests__/compareEngine.test.ts` | Non-empty recommendation |
