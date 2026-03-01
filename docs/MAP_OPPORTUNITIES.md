# Map & Opportunities — VisioGold DRC

## Overview

The geospatial intelligence system is the primary discovery surface of VisioGold DRC. It provides an interactive map centered on the Democratic Republic of the Congo, overlaying multiple data layers to help users identify and evaluate gold mining opportunities.

---

## Globe Entry Point

The platform opens with a 3D animated globe (`src/components/screens/GlobeHome.tsx`) rendered using the `cobe` library. The globe provides a cinematic entry experience with:

- Auto-rotation with DRC highlighted
- Smooth transition to the full map view on user interaction
- Globe center coordinates: [0, 20] with zoom level 1.5

---

## Interactive Map

### Technology

- **MapLibre GL** (`maplibre-gl` v5.19) — Open-source vector tile map renderer
- **Basemap**: CARTO Dark Matter (`https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json`)
- **Spatial Analysis**: Turf.js (`@turf/turf` v7.3)

### Map Configuration (`src/lib/map-config.ts`)

| Setting | Value |
|---------|-------|
| DRC Center | [23.66, -2.88] |
| DRC Zoom | 5 |
| DRC Bounding Box | [12.20, -13.46, 31.28, 5.39] |

### Fly-To Presets

| Region | Center | Zoom |
|--------|--------|------|
| All DRC | [23.66, -2.88] | 5 |
| Haut-Katanga | [27.8, -11.0] | 7 |
| North Kivu | [29.2, -1.5] | 7 |
| South Kivu | [28.8, -3.0] | 7 |
| Ituri | [30.0, 1.5] | 8 |
| Maniema | [26.0, -3.5] | 7 |
| Haut-Uele | [28.5, 3.5] | 7 |

---

## Data Layers

All layers are defined in `src/lib/layers-registry.ts` with corresponding GeoJSON fixtures in `src/data/`.

### Tenements Layer

- **Source**: `src/data/tenements.geojson`
- **Geometry**: Polygon
- **Styling**: Fill color by status (granted: gold, pending: semi-transparent gold, expired: red). Gold outline at 1.5px width.
- **Default visibility**: On
- **Properties**: permit_number, name, holder, status, commodity, area_km2, granted_date

### Geology Layer

- **Source**: `src/data/geology.geojson`
- **Geometry**: Polygon
- **Styling**: Fill color from feature `color` property at 25% opacity. Dashed brown outline.
- **Default visibility**: Off
- **Properties**: lithology, age, color

### Mineral Occurrences Layer

- **Source**: `src/data/occurrences.geojson`
- **Geometry**: Point
- **Styling**: Circle with commodity-based color (Gold: #FFD700, Copper: #B87333, Cobalt: #0047AB, Tin: #C0C0C0, Coltan: #8B4513). Zoom-interpolated radius (3px at z4, 6px at z8, 10px at z12).
- **Default visibility**: Off
- **Properties**: commodity, deposit_type, grade

### Security Events Layer

- **Source**: `src/data/security-events.geojson`
- **Geometry**: Point
- **Styling**: Circle with severity-based color (high: #FF4444, medium: #FF8800, low: #FFCC00). 60% opacity.
- **Default visibility**: Off
- **Properties**: event_type, severity, date, description

### Infrastructure Layer

- **Source**: `src/data/infrastructure.geojson`
- **Geometry**: LineString + Point
- **Styling**: Lines color-coded by type (road: gray, river: blue, railway: orange). Points rendered as blue circles.
- **Default visibility**: Off
- **Properties**: type, name

---

## Layer Toggle Panel

The **Layer Toggle** component (`src/components/map/LayerToggle.tsx`) provides:

- Per-layer visibility toggles with on/off state
- Layer descriptions
- Legend color indicators
- Icon indicators (Map, Mountain, Gem, ShieldAlert, Route)

Layer state is managed by the `useLayers` hook (`src/hooks/useLayers.ts`), which handles MapLibre source and layer lifecycle.

---

## Feature Selection & Context Panels

### Selection Flow

1. User clicks on a map feature
2. `useFeatureSelection` hook (`src/hooks/useFeatureSelection.ts`) captures the feature and its layer
3. **FeatureContextPanel** (`src/components/panels/FeatureContextPanel.tsx`) renders the appropriate card:

| Layer | Card Component | Content |
|-------|----------------|---------|
| Geology | `LithologyCard` | Lithology type, age, formation details |
| Occurrences | `OccurrenceCard` | Commodity, deposit type, grade information |
| Security Events | `IncidentCard` | Event type, severity, date, description |
| Infrastructure | `InfrastructureCard` | Infrastructure type, name, location |
| Tenements | `PermitCard` | Permit number, holder, status, area, granted date |

---

## Opportunity Engine

### Architecture

The Opportunity Engine (`src/lib/opportunity-engine.ts`) is a client-side scoring system that evaluates every tenement in the dataset.

### Input Data

The engine loads all five GeoJSON datasets at startup:
- Tenements (evaluation targets)
- Geology (prospectivity factor)
- Occurrences (prospectivity factor)
- Security events (risk factor)
- Infrastructure (access factor)

### Scoring Dimensions

Each tenement is scored across five dimensions using spatial analysis:

#### 1. Prospectivity Score (Weight: 30%)

**Code**: `src/lib/scoring-rules.ts` → `scoreProspectivity()`

- Base score: 20
- Counts mineral occurrences within 25km buffer (+10 per occurrence, max +40)
- Checks for favorable geology within 25km (greenstone, granite, schist: +15 per unit, max +30)
- Capped at 100

#### 2. Access Score (Weight: 20%)

**Code**: `src/lib/scoring-rules.ts` → `scoreAccess()`

- Base score: 30
- Measures distance from tenement centroid to infrastructure features
- +15 for each infrastructure feature within 50km
- Capped at 100

#### 3. Security Score (Weight: 20%)

**Code**: `src/lib/scoring-rules.ts` → `scoreSecurity()`

- Base score: 100 (starts high = safe)
- Counts security events within 50km buffer
- -15 per event, max -80
- Floored at 0

#### 4. Legal Complexity Score (Weight: 15%)

**Code**: `src/lib/scoring-rules.ts` → `scoreLegalComplexity()`

- Based on permit status:
  - `granted` → 85
  - `pending` → 60
  - `expired` → 30
  - Other → 50

#### 5. Data Completeness Score (Weight: 15%)

**Code**: `src/lib/scoring-rules.ts` → `scoreDataCompleteness()`

- +35 if mineral occurrences exist within 25km
- +35 if geology data exists within 25km
- +6 for each populated property field (name, holder, status, area_km2, granted_date)
- Capped at 100

### Composite Score

```
composite = prospectivity × 0.30
          + access × 0.20
          + security × 0.20
          + legal_complexity × 0.15
          + data_completeness × 0.15
```

### Labels

| Score Range | Label |
|-------------|-------|
| 70–100 | High |
| 40–69 | Medium |
| 0–39 | Low |

### Output

Each opportunity includes:

- **Composite score** — Weighted aggregate
- **Per-dimension scores** — With label and evidence array
- **Explanation** — Natural-language description generated from score levels
- **Recommended next actions** — Rules-based action items (e.g., "Commission geophysical survey", "Verify permit status with CAMI")
- **Geographic data** — Centroid coordinates, area in km², permit ID, province mapping

### Province Mapping

The engine maps permit IDs to DRC provinces via a static lookup table in `src/lib/opportunity-engine.ts`:

| Province | Coverage |
|----------|----------|
| Ituri | PR-8832, PR-10492, PE-4921 |
| South Kivu | PE-4102, PE-5510 |
| Haut-Uele | PR-9921 |
| Haut-Katanga | PE-6230, PR-7744, PR-1188, PE-9100 |
| Tanganyika | PE-8855 |
| North Kivu | PR-3321, PR-5555 |
| Maniema | PE-2299 |
| Kasai | PR-6677 |

---

## Opportunity Feed

The **OpportunityFeed** component (`src/components/opportunities/OpportunityFeed.tsx`) renders:

- Sorted list of opportunities by composite score (descending)
- Each **OpportunityCardItem** (`src/components/opportunities/OpportunityCardItem.tsx`) shows:
  - Title, permit ID, province
  - Composite score with color indicator
  - **ScoreBar** (`src/components/opportunities/ScoreBar.tsx`) for each dimension
  - Explanation text
  - Action button to create a repo from the opportunity

---

## Future Enhancements

| Enhancement | Status |
|-------------|--------|
| PostGIS server-side spatial queries | 🔴 Planned |
| WMS/WMTS external data adapters | 🔴 Planned |
| CAMI API integration for live permit data | 🔴 Planned |
| Historical security event trends | 🔴 Planned |
| Elevation/terrain layer | 🔴 Planned |
| Satellite imagery layer | 🔴 Planned |
| Custom user-uploaded GeoJSON layers | 🔴 Planned |
| Heatmap visualization mode | 🔴 Planned |
