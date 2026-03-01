import { z } from 'zod';

// Auth
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Workspaces
export const createWorkspaceSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
});

export const addMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(['OWNER', 'ADMIN', 'ANALYST', 'VIEWER']),
});

// Repos
export const createRepoSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  country: z.string().optional().default('DRC'),
  commodity: z.string().optional().default('Gold'),
});

export const updateRepoSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  country: z.string().optional(),
  commodity: z.string().optional(),
});

// Branches
export const createBranchSchema = z.object({
  name: z.string().min(1).max(255),
  visibility: z.enum(['PRIVATE', 'SHARED_WITH_VISIOGOLD', 'PUBLIC']).optional().default('PRIVATE'),
  fromBranchId: z.string().uuid().optional(),
});

// Commits
export const createCommitSchema = z.object({
  message: z.string().min(1),
  artifacts: z.array(z.object({
    artifactId: z.string().uuid(),
    path: z.string().min(1),
    changeType: z.enum(['ADD', 'UPDATE', 'DELETE']),
    previousArtifactId: z.string().uuid().optional(),
  })),
});

// Diff
export const diffSchema = z.object({
  fromCommitId: z.string().uuid(),
  toCommitId: z.string().uuid(),
});

// Merge
export const mergeSchema = z.object({
  sourceBranchId: z.string().uuid(),
  targetBranchId: z.string().uuid(),
  message: z.string().min(1).optional(),
});

// Publish
export const publishSchema = z.object({
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(500),
  description: z.string().optional(),
  redactionRules: z.array(z.object({
    type: z.enum(['exclude_artifact_types', 'exclude_paths', 'exclude_metadata_fields']),
    types: z.array(z.string()).optional(),
    patterns: z.array(z.string()).optional(),
    fields: z.array(z.string()).optional(),
  })).optional().default([]),
});
