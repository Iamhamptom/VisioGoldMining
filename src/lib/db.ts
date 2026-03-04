import { Pool, PoolClient } from 'pg';
import { AppError } from '@/lib/errors';

export const MOCK_MODE = !process.env.DATABASE_URL && !process.env.DB_APP_PASSWORD;

const sslConfig =
  process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost')
    ? { rejectUnauthorized: false }
    : false;

// When using a managed DB (Supabase), route all queries to the visiogold schema
// so tables are isolated from other apps sharing the same database.
const SCHEMA_SEARCH_PATH = process.env.DB_SCHEMA || 'visiogold';
const searchPathOption = process.env.DATABASE_URL
  ? { options: `-c search_path=${SCHEMA_SEARCH_PATH},extensions,public` }
  : {};

function databaseUnavailableError() {
  return new AppError(
    503,
    'Database not configured. Set DATABASE_URL or DB_APP_PASSWORD to enable database-backed routes.'
  );
}

type PoolMode = 'app' | 'admin';

function buildPool(mode: PoolMode): Pool {
  if (process.env.DATABASE_URL) {
    return new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: sslConfig,
      max: parseInt(
        process.env[mode === 'admin' ? 'DB_ADMIN_POOL_MAX' : 'DB_POOL_MAX'] || (mode === 'admin' ? '5' : '20'),
        10
      ),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      ...searchPathOption,
    });
  }

  if (mode === 'admin' && !process.env.DB_ADMIN_PASSWORD) {
    console.warn('DB_ADMIN_PASSWORD is not set. Admin database connections will fail outside mock mode.');
  }

  if (mode === 'app' && !process.env.DB_APP_PASSWORD) {
    console.warn('DB_APP_PASSWORD is not set. Application database connections will fail outside mock mode.');
  }

  return new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'visiogold_dev',
    user: process.env[mode === 'admin' ? 'DB_ADMIN_USER' : 'DB_APP_USER'] || (mode === 'admin' ? 'visiogold_admin' : 'visiogold_app'),
    password: process.env[mode === 'admin' ? 'DB_ADMIN_PASSWORD' : 'DB_APP_PASSWORD'],
    max: parseInt(
      process.env[mode === 'admin' ? 'DB_ADMIN_POOL_MAX' : 'DB_POOL_MAX'] || (mode === 'admin' ? '5' : '20'),
      10
    ),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });
}

function createLazyPool(mode: PoolMode): Pool {
  let instance: Pool | null = null;

  return new Proxy({} as Pool, {
    get(_target, property) {
      if (!instance) {
        instance = buildPool(mode);
      }
      const value = instance[property as keyof Pool];
      return typeof value === 'function' ? value.bind(instance) : value;
    },
  });
}

const mockDbClient = {
  async query() {
    throw databaseUnavailableError();
  },
  release() {},
} as unknown as PoolClient;

const poolInstance = MOCK_MODE ? null : createLazyPool('app');
const adminPoolInstance = MOCK_MODE ? null : createLazyPool('admin');

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
  if (!poolInstance) {
    throw databaseUnavailableError();
  }

  const client = await poolInstance.connect();
  try {
    await client.query('BEGIN');
    await client.query('SET LOCAL app.current_workspace_id = $1', [workspaceId]);
    await client.query('SET LOCAL app.current_user_id = $1', [userId]);

    if (process.env.VISIOGOLD_ORG_WORKSPACE_ID) {
      await client.query('SET LOCAL app.visiogold_org_workspace_id = $1', [
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
  if (!adminPoolInstance) {
    throw databaseUnavailableError();
  }

  const client = await adminPoolInstance.connect();
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
  if (!adminPoolInstance) {
    throw databaseUnavailableError();
  }
  return adminPoolInstance.connect();
}

export function getMockDbClient(): PoolClient {
  return mockDbClient;
}

export const pool = poolInstance;
export const adminPool = adminPoolInstance;
