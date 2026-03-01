-- Migration 001: Extensions and Roles
-- Enable required PostgreSQL extensions and create application role

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Application role: used by the app at runtime. Does NOT own tables, so RLS applies.
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'visiogold_app') THEN
    CREATE ROLE visiogold_app LOGIN PASSWORD 'app_password';
  END IF;
END $$;
