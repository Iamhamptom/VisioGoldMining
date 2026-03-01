import { Router } from 'express';
import * as foundation from '../services/foundation.service.js';

const router = Router();

router.get('/workspaces', async (_req, res, next) => {
  try {
    const workspaces = await foundation.listWorkspaces();
    res.json(workspaces);
  } catch (err) { next(err); }
});

router.post('/workspaces', async (req, res, next) => {
  try {
    const ws = await foundation.createWorkspace(req.body.name);
    res.status(201).json(ws);
  } catch (err) { next(err); }
});

router.get('/repos', async (req, res, next) => {
  try {
    const repos = await foundation.listRepos(req.query.workspace_id as string);
    res.json(repos);
  } catch (err) { next(err); }
});

router.post('/repos', async (req, res, next) => {
  try {
    const repo = await foundation.createRepo(req.body.workspace_id, req.body.name);
    res.status(201).json(repo);
  } catch (err) { next(err); }
});

router.get('/repos/:repoId/branches', async (req, res, next) => {
  try {
    const branches = await foundation.listBranches(req.params.repoId);
    res.json(branches);
  } catch (err) { next(err); }
});

router.post('/repos/:repoId/branches', async (req, res, next) => {
  try {
    const branch = await foundation.createBranch(req.params.repoId, req.body.name);
    res.status(201).json(branch);
  } catch (err) { next(err); }
});

router.get('/branches/:branchId/artifacts', async (req, res, next) => {
  try {
    const artifacts = await foundation.listArtifacts(req.params.branchId);
    res.json(artifacts);
  } catch (err) { next(err); }
});

router.get('/context/default', async (_req, res, next) => {
  try {
    const ctx = await foundation.getDefaultContext();
    if (!ctx) return res.status(404).json({ error: 'No default context found' });
    res.json(ctx);
  } catch (err) { next(err); }
});

export default router;
