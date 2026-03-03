-- Migration 012: Investor Profiles & Registrations
-- Cross-workspace investor tracking with portal-specific registrations

CREATE TABLE investor_profiles (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Contact info
  email               VARCHAR(255) NOT NULL UNIQUE,
  first_name          VARCHAR(255) NOT NULL,
  last_name           VARCHAR(255) NOT NULL,
  phone               VARCHAR(50),
  company             VARCHAR(255),
  job_title           VARCHAR(255),
  country             VARCHAR(100),
  -- Investment profile
  investment_min      NUMERIC(15,2),
  investment_max      NUMERIC(15,2),
  sectors_of_interest VARCHAR(50)[] DEFAULT '{}',
  experience_level    VARCHAR(20) CHECK (experience_level IN ('novice', 'intermediate', 'experienced', 'institutional')),
  -- Verification
  is_verified         BOOLEAN NOT NULL DEFAULT false,
  verified_at         TIMESTAMPTZ,
  -- Scoring
  lead_score          INTEGER DEFAULT 0,
  lead_score_details  JSONB DEFAULT '{}',
  -- Metadata
  metadata            JSONB DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- No RLS on investor_profiles — cross-workspace, accessed via getAdminClient()

CREATE TABLE investor_portal_registrations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id     UUID NOT NULL REFERENCES investor_profiles(id) ON DELETE CASCADE,
  portal_id       UUID NOT NULL REFERENCES government_portals(id) ON DELETE CASCADE,
  registered_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source          VARCHAR(50) DEFAULT 'portal',  -- portal, referral, import
  notes           TEXT,
  UNIQUE(investor_id, portal_id)
);

CREATE TABLE investor_saved_opportunities (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id     UUID NOT NULL REFERENCES investor_profiles(id) ON DELETE CASCADE,
  listing_id      UUID NOT NULL REFERENCES opportunity_listings(id) ON DELETE CASCADE,
  saved_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes           TEXT,
  UNIQUE(investor_id, listing_id)
);

CREATE INDEX idx_investor_profiles_email ON investor_profiles(email);
CREATE INDEX idx_investor_profiles_score ON investor_profiles(lead_score DESC);
CREATE INDEX idx_investor_registrations_portal ON investor_portal_registrations(portal_id);
CREATE INDEX idx_investor_registrations_investor ON investor_portal_registrations(investor_id);
CREATE INDEX idx_investor_saved_listing ON investor_saved_opportunities(listing_id);

GRANT SELECT, INSERT, UPDATE ON investor_profiles TO visiogold_app;
GRANT SELECT, INSERT, DELETE ON investor_portal_registrations TO visiogold_app;
GRANT SELECT, INSERT, DELETE ON investor_saved_opportunities TO visiogold_app;
