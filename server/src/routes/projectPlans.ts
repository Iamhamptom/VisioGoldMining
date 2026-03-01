import { Router } from 'express';
import * as pbService from '../services/projectBuilder.service.js';

const router = Router();

router.post('/repos/:repoId/branches/:branchId/project-plan/generate', async (req, res, next) => {
  try {
    const { repoId, branchId } = req.params;
    const plan = await pbService.generatePlan(repoId, branchId, req.body);
    res.status(201).json(plan);
  } catch (err) { next(err); }
});

router.get('/branches/:branchId/project-plan', async (req, res, next) => {
  try {
    const plans = await pbService.listPlans(req.params.branchId);
    res.json(plans);
  } catch (err) { next(err); }
});

router.get('/project-plans/:id', async (req, res, next) => {
  try {
    const plan = await pbService.getPlan(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    res.json(plan);
  } catch (err) { next(err); }
});

export default router;
