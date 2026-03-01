import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'visiogold_dev',
  user: process.env.DB_ADMIN_USER || 'visiogold_admin',
  password: process.env.DB_ADMIN_PASSWORD || 'admin_password',
});

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log('Seeding workspaces...');
    const { rows: [workspace1] } = await client.query(
      `INSERT INTO workspaces (name, slug) VALUES ('VisioGold Operations', 'visiogold-ops')
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
       RETURNING *`
    );
    const { rows: [workspace2] } = await client.query(
      `INSERT INTO workspaces (name, slug) VALUES ('Partner Mining Co', 'partner-mining')
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
       RETURNING *`
    );

    console.log('Seeding users...');
    const passwordHash = await bcrypt.hash('password123', 12);

    const { rows: [admin] } = await client.query(
      `INSERT INTO users (email, password_hash, display_name)
       VALUES ('admin@visiogold.com', $1, 'Admin User')
       ON CONFLICT (email) DO UPDATE SET password_hash = $1
       RETURNING *`,
      [passwordHash]
    );
    const { rows: [analyst] } = await client.query(
      `INSERT INTO users (email, password_hash, display_name)
       VALUES ('analyst@visiogold.com', $1, 'Analyst User')
       ON CONFLICT (email) DO UPDATE SET password_hash = $1
       RETURNING *`,
      [passwordHash]
    );
    const { rows: [viewer] } = await client.query(
      `INSERT INTO users (email, password_hash, display_name)
       VALUES ('viewer@visiogold.com', $1, 'Viewer User')
       ON CONFLICT (email) DO UPDATE SET password_hash = $1
       RETURNING *`,
      [passwordHash]
    );

    console.log('Seeding workspace memberships...');
    await client.query(
      `INSERT INTO workspace_members (workspace_id, user_id, role) VALUES
       ($1, $2, 'OWNER'),
       ($1, $3, 'ANALYST'),
       ($1, $4, 'VIEWER'),
       ($5, $2, 'ADMIN')
       ON CONFLICT (workspace_id, user_id) DO UPDATE SET role = EXCLUDED.role`,
      [workspace1.id, admin.id, analyst.id, viewer.id, workspace2.id]
    );

    console.log('Seeding repos...');
    const { rows: [repo] } = await client.query(
      `INSERT INTO repos (workspace_id, name, slug, description, country, commodity, created_by)
       VALUES ($1, 'Kibali Gold Mine', 'kibali-gold', 'Primary gold mining project in Kibali region', 'DRC', 'Gold', $2)
       ON CONFLICT (workspace_id, slug) DO UPDATE SET name = EXCLUDED.name
       RETURNING *`,
      [workspace1.id, admin.id]
    );

    console.log('Seeding branches...');
    const { rows: [mainBranch] } = await client.query(
      `INSERT INTO branches (workspace_id, repo_id, name, visibility, created_by)
       VALUES ($1, $2, 'main', 'PRIVATE', $3)
       ON CONFLICT (repo_id, name) DO UPDATE SET visibility = EXCLUDED.visibility
       RETURNING *`,
      [workspace1.id, repo.id, admin.id]
    );

    await client.query(
      'UPDATE repos SET default_branch_id = $1 WHERE id = $2',
      [mainBranch.id, repo.id]
    );

    console.log('Seeding sample commit...');
    const { rows: [commit] } = await client.query(
      `INSERT INTO commits (workspace_id, branch_id, message, committed_by)
       VALUES ($1, $2, 'Initial project setup with baseline data', $3) RETURNING *`,
      [workspace1.id, mainBranch.id, admin.id]
    );

    await client.query(
      'UPDATE branches SET head_commit_id = $1 WHERE id = $2',
      [commit.id, mainBranch.id]
    );

    await client.query('COMMIT');

    console.log('\nSeed completed successfully!');
    console.log(`\nTest credentials:`);
    console.log(`  Admin:   admin@visiogold.com / password123`);
    console.log(`  Analyst: analyst@visiogold.com / password123`);
    console.log(`  Viewer:  viewer@visiogold.com / password123`);
    console.log(`\nWorkspaces: ${workspace1.name} (${workspace1.id}), ${workspace2.name} (${workspace2.id})`);
    console.log(`Repo: ${repo.name} (${repo.id})`);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
