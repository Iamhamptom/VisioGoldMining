import express from 'express';
import cors from 'cors';
import simulationRoutes from './routes/simulations.js';
import projectPlanRoutes from './routes/projectPlans.js';
import foundationRoutes from './routes/foundation.js';

const app = express();

const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',');
app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Simple in-memory rate limiter (100 requests per minute per IP)
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = parseInt(process.env.RATE_LIMIT_MAX || '100');
const hits = new Map<string, { count: number; resetAt: number }>();

app.use((req, res, next) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return next();
  }

  entry.count++;
  if (entry.count > RATE_MAX) {
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
    return;
  }

  next();
});

// Periodically clean up expired entries
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of hits) {
    if (now > entry.resetAt) hits.delete(ip);
  }
}, RATE_WINDOW_MS);

app.use('/api', foundationRoutes);
app.use('/api', simulationRoutes);
app.use('/api', projectPlanRoutes);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

export default app;
