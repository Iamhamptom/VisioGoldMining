-- Migration 017: Extend artifact types + sales leads capture

ALTER TABLE artifacts DROP CONSTRAINT IF EXISTS artifacts_type_check;
ALTER TABLE artifacts
  ADD CONSTRAINT artifacts_type_check CHECK (type IN (
    'DOCUMENT', 'DATASET', 'PLAN', 'SIMULATION',
    'TASKS', 'NOTE', 'RISK_REGISTER', 'VENDOR_REPORT',
    'REPORT', 'INVESTOR_DECK', 'GOV_BRIEF'
  ));

CREATE TABLE sales_leads (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id     UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  source_page      VARCHAR(255) NOT NULL,
  interest_area    VARCHAR(255) NOT NULL,
  company_name     VARCHAR(255),
  contact_name     VARCHAR(255),
  email            VARCHAR(255) NOT NULL,
  phone            VARCHAR(50),
  company_size     VARCHAR(100),
  country          VARCHAR(100),
  stage            VARCHAR(50) NOT NULL DEFAULT 'new' CHECK (stage IN ('new', 'qualified', 'proposal', 'won', 'lost', 'waitlist')),
  estimated_acv    NUMERIC(14, 2),
  notes            TEXT,
  intent_tags      TEXT[] NOT NULL DEFAULT '{}',
  metadata         JSONB NOT NULL DEFAULT '{}',
  created_by       UUID REFERENCES users(id),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sales_leads_workspace ON sales_leads(workspace_id);
CREATE INDEX idx_sales_leads_stage ON sales_leads(stage);
CREATE INDEX idx_sales_leads_country ON sales_leads(country);
CREATE INDEX idx_sales_leads_created ON sales_leads(created_at DESC);

GRANT SELECT, INSERT, UPDATE ON sales_leads TO visiogold_app;
