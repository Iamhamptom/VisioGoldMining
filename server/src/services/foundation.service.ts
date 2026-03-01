import crypto from 'crypto';
import pool from '../db/pool.js';

export async function seedDefaults() {
  const { rows } = await pool.query('SELECT id FROM workspaces LIMIT 1');
  if (rows.length > 0) return;

  const wsResult = await pool.query(
    'INSERT INTO workspaces (name) VALUES ($1) RETURNING id',
    ['VisioGold DRC']
  );
  const workspaceId = wsResult.rows[0].id;

  const repoResult = await pool.query(
    'INSERT INTO repos (workspace_id, name) VALUES ($1, $2) RETURNING id',
    [workspaceId, 'DRC Gold Exploration']
  );
  const repoId = repoResult.rows[0].id;

  await pool.query(
    'INSERT INTO branches (repo_id, name) VALUES ($1, $2)',
    [repoId, 'main']
  );

  console.log('Seeded default workspace, repo, and branch.');
}

export async function listWorkspaces() {
  const { rows } = await pool.query('SELECT * FROM workspaces ORDER BY created_at DESC');
  return rows;
}

export async function createWorkspace(name: string) {
  const { rows } = await pool.query(
    'INSERT INTO workspaces (name) VALUES ($1) RETURNING *',
    [name]
  );
  return rows[0];
}

export async function listRepos(workspaceId?: string) {
  if (workspaceId) {
    const { rows } = await pool.query('SELECT * FROM repos WHERE workspace_id = $1 ORDER BY created_at DESC', [workspaceId]);
    return rows;
  }
  const { rows } = await pool.query('SELECT * FROM repos ORDER BY created_at DESC');
  return rows;
}

export async function createRepo(workspaceId: string, name: string) {
  const { rows } = await pool.query(
    'INSERT INTO repos (workspace_id, name) VALUES ($1, $2) RETURNING *',
    [workspaceId, name]
  );
  return rows[0];
}

export async function listBranches(repoId: string) {
  const { rows } = await pool.query('SELECT * FROM branches WHERE repo_id = $1 ORDER BY created_at DESC', [repoId]);
  return rows;
}

export async function createBranch(repoId: string, name: string) {
  const { rows } = await pool.query(
    'INSERT INTO branches (repo_id, name) VALUES ($1, $2) RETURNING *',
    [repoId, name]
  );
  return rows[0];
}

export async function listArtifacts(branchId: string) {
  const { rows } = await pool.query('SELECT * FROM artifacts WHERE branch_id = $1 ORDER BY created_at DESC', [branchId]);
  return rows;
}

export async function createArtifact(branchId: string, entityType: string, entityId: string, content: object) {
  const contentStr = JSON.stringify(content);
  const sha256 = crypto.createHash('sha256').update(contentStr).digest('hex');

  const { rows } = await pool.query(
    'INSERT INTO artifacts (branch_id, entity_type, entity_id, sha256, metadata) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [branchId, entityType, entityId, sha256, { size: contentStr.length }]
  );
  return rows[0];
}

export async function getDefaultContext() {
  const ws = await pool.query('SELECT id FROM workspaces LIMIT 1');
  if (ws.rows.length === 0) return null;
  const workspaceId = ws.rows[0].id;

  const repo = await pool.query('SELECT id FROM repos WHERE workspace_id = $1 LIMIT 1', [workspaceId]);
  if (repo.rows.length === 0) return null;
  const repoId = repo.rows[0].id;

  const branch = await pool.query('SELECT id FROM branches WHERE repo_id = $1 AND name = $2 LIMIT 1', [repoId, 'main']);
  if (branch.rows.length === 0) return null;

  return { workspaceId, repoId, branchId: branch.rows[0].id };
}
