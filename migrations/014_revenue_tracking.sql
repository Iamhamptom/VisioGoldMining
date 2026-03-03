-- Migration 014: Revenue Tracking
-- Revenue events with auto-computed 80/20 split (government/VisioGold)

CREATE TABLE revenue_events (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id          UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  portal_id             UUID NOT NULL REFERENCES government_portals(id) ON DELETE CASCADE,
  listing_id            UUID REFERENCES opportunity_listings(id),
  investor_id           UUID REFERENCES investor_profiles(id),
  -- Revenue details
  event_type            VARCHAR(30) NOT NULL CHECK (event_type IN (
    'consultation_fee', 'listing_fee', 'success_fee', 'subscription', 'data_license', 'other'
  )),
  description           VARCHAR(500),
  gross_amount          NUMERIC(15,2) NOT NULL,
  currency              VARCHAR(3) NOT NULL DEFAULT 'USD',
  -- Auto-computed split
  platform_rate         NUMERIC(5,4) NOT NULL DEFAULT 0.2000,  -- 20% default
  platform_amount       NUMERIC(15,2) GENERATED ALWAYS AS (gross_amount * platform_rate) STORED,
  government_amount     NUMERIC(15,2) GENERATED ALWAYS AS (gross_amount * (1 - platform_rate)) STORED,
  -- Status
  status                VARCHAR(20) NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'invoiced', 'paid', 'cancelled')),
  paid_at               TIMESTAMPTZ,
  -- Metadata
  reference_id          VARCHAR(255),
  notes                 TEXT,
  metadata              JSONB DEFAULT '{}',
  created_by            UUID REFERENCES users(id),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_revenue_workspace ON revenue_events(workspace_id);
CREATE INDEX idx_revenue_portal ON revenue_events(portal_id);
CREATE INDEX idx_revenue_status ON revenue_events(status);
CREATE INDEX idx_revenue_created ON revenue_events(created_at);

-- Monthly revenue summary view
CREATE VIEW revenue_monthly_summary AS
SELECT
  workspace_id,
  portal_id,
  DATE_TRUNC('month', created_at) AS month,
  COUNT(*) AS event_count,
  SUM(gross_amount) AS total_gross,
  SUM(platform_amount) AS total_platform,
  SUM(government_amount) AS total_government,
  currency
FROM revenue_events
WHERE status != 'cancelled'
GROUP BY workspace_id, portal_id, DATE_TRUNC('month', created_at), currency;

GRANT SELECT, INSERT, UPDATE ON revenue_events TO visiogold_app;
GRANT SELECT ON revenue_monthly_summary TO visiogold_app;
