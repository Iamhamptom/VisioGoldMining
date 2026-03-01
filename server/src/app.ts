import express from 'express';
import cors from 'cors';
import simulationRoutes from './routes/simulations.js';
import projectPlanRoutes from './routes/projectPlans.js';
import foundationRoutes from './routes/foundation.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', foundationRoutes);
app.use('/api', simulationRoutes);
app.use('/api', projectPlanRoutes);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

export default app;
