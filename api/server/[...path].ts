import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../../server/src/app.js';

// Run migrations + seed once on cold start
let initialized = false;

async function ensureInit() {
  if (initialized) return;
  initialized = true; // Set early to prevent concurrent attempts
  try {
    const { runMigrations } = await import('../../server/src/db/migrate.js');
    const { seedDefaults } = await import('../../server/src/services/foundation.service.js');
    await runMigrations();
    await seedDefaults();
  } catch (err) {
    // Migrations may already be applied or filesystem may be unavailable
    // on serverless — this is expected. Log and continue.
    console.warn('Init warning (non-fatal):', (err as Error).message);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ensureInit();

  // Rewrite URL: /api/server/x/y → /api/x/y (what Express expects)
  const originalUrl = req.url || '';
  req.url = originalUrl.replace(/^\/api\/server/, '/api');

  // Forward to Express app
  return new Promise<void>((resolve) => {
    app(req as any, res as any, () => {
      resolve();
    });
  });
}
