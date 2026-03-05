-- Migration 023: Exploration KPI aggregate materialized view

CREATE MATERIALIZED VIEW exploration_kpi_summary AS
SELECT
  t.workspace_id,
  t.repo_id,
  t.branch_id,
  COUNT(*)::INTEGER AS targets_count,
  COALESCE(AVG(t.confidence_score), 0)::NUMERIC(5,2) AS avg_confidence,
  COALESCE(
    SUM(CASE WHEN t.confidence_score >= 70 THEN 1 ELSE 0 END)::NUMERIC / NULLIF(COUNT(*), 0),
    0
  )::NUMERIC(6,4) AS hit_rate,
  COALESCE(SUM(COALESCE((t.metadata->>'planned_meters')::NUMERIC, 0)), 0)::NUMERIC(14,2) AS meters_drilled,
  COALESCE(SUM(COALESCE((t.metadata->>'estimated_cost')::NUMERIC, 0)), 0)::NUMERIC(14,2) AS total_target_cost,
  NOW() AS refreshed_at
FROM drill_targets t
GROUP BY t.workspace_id, t.repo_id, t.branch_id;

CREATE UNIQUE INDEX idx_exploration_kpi_summary_pk
  ON exploration_kpi_summary(workspace_id, repo_id, branch_id);

CREATE INDEX idx_exploration_kpi_summary_repo
  ON exploration_kpi_summary(repo_id, branch_id);
