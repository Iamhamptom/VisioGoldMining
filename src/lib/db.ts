import { Pool, PoolClient } from 'pg';

const sslConfig = process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost')
  ? { rejectUnauthorized: false }
  : false;

// Application pool — uses the visiogold_app role (RLS enforced)
// Supports DATABASE_URL for managed Postgres (Vercel, Neon, Supabase)
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: sslConfig,
      max: parseInt(process.env.DB_POOL_MAX || '20'),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'visiogold_dev',
      user: process.env.DB_APP_USER || 'visiogold_app',
      password: process.env.DB_APP_PASSWORD || 'app_password',
      max: parseInt(process.env.DB_POOL_MAX || '20'),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

// Admin pool — uses visiogold_admin role (bypasses RLS, for seed/migration only)
// In managed Postgres (DATABASE_URL), this uses the same connection since the
// managed user typically has full privileges.
const adminPool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: sslConfig,
      max: parseInt(process.env.DB_ADMIN_POOL_MAX || '5'),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'visiogold_dev',
      user: process.env.DB_ADMIN_USER || 'visiogold_admin',
      password: process.env.DB_ADMIN_PASSWORD || 'admin_password',
      max: parseInt(process.env.DB_ADMIN_POOL_MAX || '5'),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

/**
 * Execute a callback within an RLS-scoped transaction.
 * Sets `app.current_workspace_id` and `app.current_user_id` as LOCAL variables,
 * which are automatically cleared when the transaction ends.
 */
export async function withRLS<T>(
  workspaceId: string,
  userId: string,
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query("SET LOCAL app.current_workspace_id = $1", [workspaceId]);
    await client.query("SET LOCAL app.current_user_id = $1", [userId]);

    if (process.env.VISIOGOLD_ORG_WORKSPACE_ID) {
      await client.query("SET LOCAL app.visiogold_org_workspace_id = $1", [
        process.env.VISIOGOLD_ORG_WORKSPACE_ID,
      ]);
    }

    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Query without RLS context (using app pool but no workspace scoping).
 * Use only for cross-workspace queries like listing user's workspace memberships.
 */
export async function queryNoRLS<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  const client = await adminPool.connect();
  try {
    const result = await client.query(sql, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
}

/**
 * Get an admin client for operations that must bypass RLS (seed scripts, etc.)
 */
export async function getAdminClient(): Promise<PoolClient> {
  return adminPool.connect();
}

export { pool, adminPool };
