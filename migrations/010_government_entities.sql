-- Migration 010: Government Entities & Portals
-- Government hierarchy (province → municipality → territory) linked to workspaces

CREATE TABLE government_entities (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name          VARCHAR(255) NOT NULL,
  slug          VARCHAR(255) NOT NULL,
  entity_type   VARCHAR(50) NOT NULL CHECK (entity_type IN ('province', 'municipality', 'territory', 'sector', 'chiefdom')),
  parent_id     UUID REFERENCES government_entities(id),
  province      VARCHAR(255),
  country       VARCHAR(100) NOT NULL DEFAULT 'DRC',
  location      JSONB,  -- { lat, lon, bbox }
  population    INTEGER,
  area_km2      NUMERIC(12,2),
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(workspace_id, slug)
);

CREATE INDEX idx_gov_entities_workspace ON government_entities(workspace_id);
CREATE INDEX idx_gov_entities_parent ON government_entities(parent_id);
CREATE INDEX idx_gov_entities_type ON government_entities(entity_type);

CREATE TABLE government_portals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  entity_id       UUID NOT NULL REFERENCES government_entities(id) ON DELETE CASCADE,
  slug            VARCHAR(255) NOT NULL UNIQUE,  -- globally unique for public URLs
  title           VARCHAR(500) NOT NULL,
  subtitle        VARCHAR(500),
  description     TEXT,
  -- Branding
  logo_url        VARCHAR(1000),
  banner_url      VARCHAR(1000),
  primary_color   VARCHAR(7) DEFAULT '#1E40AF',
  secondary_color VARCHAR(7) DEFAULT '#F59E0B',
  accent_color    VARCHAR(7) DEFAULT '#10B981',
  -- Contact
  contact_email   VARCHAR(255),
  contact_phone   VARCHAR(50),
  website_url     VARCHAR(1000),
  -- Configuration
  featured_sectors VARCHAR(50)[] DEFAULT '{}',
  hero_text       TEXT,
  about_text      TEXT,
  -- Status
  published       BOOLEAN NOT NULL DEFAULT false,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_gov_portals_workspace ON government_portals(workspace_id);
CREATE INDEX idx_gov_portals_entity ON government_portals(entity_id);
CREATE INDEX idx_gov_portals_slug ON government_portals(slug);
CREATE INDEX idx_gov_portals_published ON government_portals(published) WHERE published = true;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON government_entities TO visiogold_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON government_portals TO visiogold_app;
