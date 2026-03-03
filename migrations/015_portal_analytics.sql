-- Migration 015: Portal Analytics
-- Event tracking + daily aggregates for portal performance

CREATE TABLE portal_analytics_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_id     UUID NOT NULL REFERENCES government_portals(id) ON DELETE CASCADE,
  listing_id    UUID REFERENCES opportunity_listings(id),
  investor_id   UUID REFERENCES investor_profiles(id),
  -- Event
  event_type    VARCHAR(30) NOT NULL CHECK (event_type IN (
    'portal_view', 'listing_view', 'listing_click', 'catalog_search',
    'investor_register', 'consultation_submit', 'document_download',
    'map_interact', 'share', 'contact_click'
  )),
  -- Context
  referrer      VARCHAR(1000),
  user_agent    VARCHAR(500),
  ip_country    VARCHAR(100),
  session_id    VARCHAR(100),
  -- Metadata
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_portal ON portal_analytics_events(portal_id);
CREATE INDEX idx_analytics_events_listing ON portal_analytics_events(listing_id);
CREATE INDEX idx_analytics_events_type ON portal_analytics_events(event_type);
CREATE INDEX idx_analytics_events_created ON portal_analytics_events(created_at);

-- Daily aggregates (materialized for performance)
CREATE TABLE portal_analytics_daily (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_id     UUID NOT NULL REFERENCES government_portals(id) ON DELETE CASCADE,
  listing_id    UUID REFERENCES opportunity_listings(id),
  date          DATE NOT NULL,
  -- Counts
  portal_views      INTEGER NOT NULL DEFAULT 0,
  listing_views     INTEGER NOT NULL DEFAULT 0,
  listing_clicks    INTEGER NOT NULL DEFAULT 0,
  registrations     INTEGER NOT NULL DEFAULT 0,
  consultations     INTEGER NOT NULL DEFAULT 0,
  document_downloads INTEGER NOT NULL DEFAULT 0,
  unique_visitors   INTEGER NOT NULL DEFAULT 0,
  -- Computed
  conversion_rate   NUMERIC(5,4) GENERATED ALWAYS AS (
    CASE WHEN portal_views > 0
      THEN registrations::NUMERIC / portal_views
      ELSE 0
    END
  ) STORED,
  UNIQUE(portal_id, listing_id, date)
);

CREATE INDEX idx_analytics_daily_portal ON portal_analytics_daily(portal_id, date);
CREATE INDEX idx_analytics_daily_listing ON portal_analytics_daily(listing_id, date);

GRANT SELECT, INSERT ON portal_analytics_events TO visiogold_app;
GRANT SELECT, INSERT, UPDATE ON portal_analytics_daily TO visiogold_app;
