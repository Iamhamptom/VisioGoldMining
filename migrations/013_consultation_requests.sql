-- Migration 013: Consultation Requests
-- Investors request meetings, info, or site visits from government portals

CREATE TABLE consultation_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  portal_id       UUID NOT NULL REFERENCES government_portals(id) ON DELETE CASCADE,
  listing_id      UUID REFERENCES opportunity_listings(id),
  investor_id     UUID REFERENCES investor_profiles(id),
  -- Request details
  request_type    VARCHAR(20) NOT NULL CHECK (request_type IN ('meeting', 'information', 'site_visit', 'partnership', 'other')),
  subject         VARCHAR(500) NOT NULL,
  message         TEXT NOT NULL,
  -- Contact (for non-registered investors)
  contact_name    VARCHAR(255) NOT NULL,
  contact_email   VARCHAR(255) NOT NULL,
  contact_phone   VARCHAR(50),
  contact_company VARCHAR(255),
  -- Workflow
  status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'acknowledged', 'scheduled', 'completed', 'declined', 'cancelled')),
  priority        VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  assigned_to     UUID REFERENCES users(id),
  -- Response
  response_notes  TEXT,
  scheduled_date  TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  -- Metadata
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_consultations_workspace ON consultation_requests(workspace_id);
CREATE INDEX idx_consultations_portal ON consultation_requests(portal_id);
CREATE INDEX idx_consultations_status ON consultation_requests(status);
CREATE INDEX idx_consultations_investor ON consultation_requests(investor_id);
CREATE INDEX idx_consultations_listing ON consultation_requests(listing_id);

GRANT SELECT, INSERT, UPDATE ON consultation_requests TO visiogold_app;
