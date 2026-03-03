-- Migration 016: RLS Policies for Government Portal Tables
-- Workspace-scoped management, public read for published content

-- ============================================================
-- GOVERNMENT_ENTITIES (workspace-scoped)
-- ============================================================
ALTER TABLE government_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE government_entities FORCE ROW LEVEL SECURITY;

CREATE POLICY gov_entities_isolation ON government_entities
  FOR ALL TO visiogold_app
  USING (workspace_id = current_workspace_id());

-- ============================================================
-- GOVERNMENT_PORTALS (workspace-scoped + public read for published)
-- ============================================================
ALTER TABLE government_portals ENABLE ROW LEVEL SECURITY;
ALTER TABLE government_portals FORCE ROW LEVEL SECURITY;

CREATE POLICY gov_portals_isolation ON government_portals
  FOR ALL TO visiogold_app
  USING (workspace_id = current_workspace_id());

CREATE POLICY gov_portals_public_read ON government_portals
  FOR SELECT TO visiogold_app
  USING (published = true);

-- ============================================================
-- OPPORTUNITY_LISTINGS (workspace-scoped + public read for published)
-- ============================================================
ALTER TABLE opportunity_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_listings FORCE ROW LEVEL SECURITY;

CREATE POLICY listings_isolation ON opportunity_listings
  FOR ALL TO visiogold_app
  USING (workspace_id = current_workspace_id());

CREATE POLICY listings_public_read ON opportunity_listings
  FOR SELECT TO visiogold_app
  USING (status = 'published');

-- ============================================================
-- CONSULTATION_REQUESTS (workspace-scoped)
-- ============================================================
ALTER TABLE consultation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_requests FORCE ROW LEVEL SECURITY;

CREATE POLICY consultations_isolation ON consultation_requests
  FOR ALL TO visiogold_app
  USING (workspace_id = current_workspace_id());

-- Public insert for consultation submissions
CREATE POLICY consultations_public_insert ON consultation_requests
  FOR INSERT TO visiogold_app
  WITH CHECK (true);

-- ============================================================
-- REVENUE_EVENTS (workspace-scoped, admin only)
-- ============================================================
ALTER TABLE revenue_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_events FORCE ROW LEVEL SECURITY;

CREATE POLICY revenue_isolation ON revenue_events
  FOR ALL TO visiogold_app
  USING (workspace_id = current_workspace_id());

-- ============================================================
-- PORTAL_ANALYTICS_EVENTS (public insert, portal-owner read)
-- ============================================================
ALTER TABLE portal_analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_analytics_events FORCE ROW LEVEL SECURITY;

-- Anyone can insert analytics events
CREATE POLICY analytics_events_public_insert ON portal_analytics_events
  FOR INSERT TO visiogold_app
  WITH CHECK (true);

-- Portal owners read their own analytics
CREATE POLICY analytics_events_owner_read ON portal_analytics_events
  FOR SELECT TO visiogold_app
  USING (
    portal_id IN (
      SELECT id FROM government_portals WHERE workspace_id = current_workspace_id()
    )
  );

-- ============================================================
-- PORTAL_ANALYTICS_DAILY (workspace-scoped via portal)
-- ============================================================
ALTER TABLE portal_analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_analytics_daily FORCE ROW LEVEL SECURITY;

CREATE POLICY analytics_daily_owner ON portal_analytics_daily
  FOR ALL TO visiogold_app
  USING (
    portal_id IN (
      SELECT id FROM government_portals WHERE workspace_id = current_workspace_id()
    )
  );

-- ============================================================
-- NOTE: investor_profiles, investor_portal_registrations, and
-- investor_saved_opportunities do NOT have RLS. They are
-- cross-workspace and accessed via getAdminClient().
-- ============================================================
