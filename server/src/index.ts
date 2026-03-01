import app from './app.js';
import { runMigrations } from './db/migrate.js';
import { seedDefaults } from './services/foundation.service.js';

const PORT = Number(process.env.SERVER_PORT) || 3001;

async function start() {
  await runMigrations();
  await seedDefaults();
  app.listen(PORT, () => {
    console.log(`VisioGold API server running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
