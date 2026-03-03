-- Migration 011: Opportunity Sectors & Listings
-- Multi-sector opportunity listings with scoring and workflow status

CREATE TABLE opportunity_sectors (
  id          VARCHAR(50) PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  icon        VARCHAR(50),
  description TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

-- Seed the 8 sectors
INSERT INTO opportunity_sectors (id, name, icon, sort_order) VALUES
  ('mining',         'Mining & Minerals',    'pickaxe',      1),
  ('agriculture',    'Agriculture',          'wheat',        2),
  ('infrastructure', 'Infrastructure',       'building',     3),
  ('energy',         'Energy & Power',       'zap',          4),
  ('tourism',        'Tourism & Hospitality','map-pin',      5),
  ('urban',          'Urban Development',    'building-2',   6),
  ('forestry',       'Forestry & Timber',    'trees',        7),
  ('fisheries',      'Fisheries & Aquaculture','fish',       8);

CREATE TABLE opportunity_listings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  portal_id       UUID NOT NULL REFERENCES government_portals(id) ON DELETE CASCADE,
  entity_id       UUID NOT NULL REFERENCES government_entities(id),
  -- Content
  title           VARCHAR(500) NOT NULL,
  slug            VARCHAR(255) NOT NULL,
  summary         TEXT,
  description     TEXT,
  sector_id       VARCHAR(50) NOT NULL REFERENCES opportunity_sectors(id),
  -- Location
  province        VARCHAR(255),
  location        JSONB,  -- { lat, lon }
  area_hectares   NUMERIC(12,2),
  -- Investment details
  investment_min  NUMERIC(15,2),
  investment_max  NUMERIC(15,2),
  currency        VARCHAR(3) DEFAULT 'USD',
  expected_roi    VARCHAR(100),
  timeline_months INTEGER,
  -- Scoring (stored, not computed client-side)
  score_geological    NUMERIC(3,1) CHECK (score_geological BETWEEN 0 AND 10),
  score_infrastructure NUMERIC(3,1) CHECK (score_infrastructure BETWEEN 0 AND 10),
  score_legal         NUMERIC(3,1) CHECK (score_legal BETWEEN 0 AND 10),
  score_environmental NUMERIC(3,1) CHECK (score_environmental BETWEEN 0 AND 10),
  score_social        NUMERIC(3,1) CHECK (score_social BETWEEN 0 AND 10),
  score_overall       NUMERIC(3,1) GENERATED ALWAYS AS (
    COALESCE(score_geological, 0) * 0.25 +
    COALESCE(score_infrastructure, 0) * 0.20 +
    COALESCE(score_legal, 0) * 0.20 +
    COALESCE(score_environmental, 0) * 0.20 +
    COALESCE(score_social, 0) * 0.15
  ) STORED,
  -- Key facts (flexible structured data)
  key_facts       JSONB DEFAULT '[]',  -- [{ label, value, tooltip }]
  -- Documents
  documents       JSONB DEFAULT '[]',  -- [{ title, url, type }]
  images          JSONB DEFAULT '[]',  -- [{ url, caption }]
  -- Workflow
  status          VARCHAR(20) NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft', 'submitted', 'in_review', 'approved', 'published', 'archived')),
  submitted_at    TIMESTAMPTZ,
  approved_at     TIMESTAMPTZ,
  published_at    TIMESTAMPTZ,
  approved_by     UUID REFERENCES users(id),
  -- Metadata
  tags            VARCHAR(100)[] DEFAULT '{}',
  metadata        JSONB DEFAULT '{}',
  created_by      UUID NOT NULL REFERENCES users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(portal_id, slug)
);

CREATE INDEX idx_listings_workspace ON opportunity_listings(workspace_id);
CREATE INDEX idx_listings_portal ON opportunity_listings(portal_id);
CREATE INDEX idx_listings_sector ON opportunity_listings(sector_id);
CREATE INDEX idx_listings_status ON opportunity_listings(status);
CREATE INDEX idx_listings_published ON opportunity_listings(status, published_at) WHERE status = 'published';
CREATE INDEX idx_listings_score ON opportunity_listings(score_overall DESC NULLS LAST);
CREATE INDEX idx_listings_investment ON opportunity_listings(investment_min, investment_max);

GRANT SELECT, INSERT, UPDATE, DELETE ON opportunity_listings TO visiogold_app;
GRANT SELECT ON opportunity_sectors TO visiogold_app;
