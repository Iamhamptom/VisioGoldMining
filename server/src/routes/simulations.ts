import { Router } from 'express';
import * as simService from '../services/simulation.service.js';

const router = Router();

router.post('/repos/:repoId/branches/:branchId/simulations/run', async (req, res, next) => {
  try {
    const { repoId, branchId } = req.params;
    const result = await simService.runSimulation(repoId, branchId, req.body);
    res.status(201).json(result);
  } catch (err) { next(err); }
});

router.get('/branches/:branchId/simulations', async (req, res, next) => {
  try {
    const sims = await simService.listSimulations(req.params.branchId);
    res.json(sims);
  } catch (err) { next(err); }
});

router.get('/simulations/:id', async (req, res, next) => {
  try {
    const sim = await simService.getSimulation(req.params.id);
    if (!sim) return res.status(404).json({ error: 'Simulation not found' });
    res.json(sim);
  } catch (err) { next(err); }
});

router.post('/simulations/compare', async (req, res, next) => {
  try {
    const { simulation_a_id, simulation_b_id } = req.body;
    const comparison = await simService.compareSimulations(simulation_a_id, simulation_b_id);
    res.json(comparison);
  } catch (err) { next(err); }
});

export default router;
