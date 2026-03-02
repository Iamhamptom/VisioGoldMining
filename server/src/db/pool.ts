import pg from 'pg';

const SCHEMA_SEARCH_PATH = process.env.DB_SCHEMA || 'visiogold';

// Support DATABASE_URL (Vercel Postgres, Neon, Supabase) or individual vars
const pool = process.env.DATABASE_URL
  ? new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false },
      max: 10,
      options: `-c search_path=${SCHEMA_SEARCH_PATH},extensions,public`,
    })
  : new pg.Pool({
      host: process.env.PG_HOST || 'localhost',
      port: Number(process.env.PG_PORT) || 5432,
      database: process.env.PG_DATABASE || 'visiogold',
      user: process.env.PG_USER || 'postgres',
      password: process.env.PG_PASSWORD || 'postgres',
      max: 10,
    });

export default pool;
