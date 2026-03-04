import { DRC_PROJECTS } from '@/data/drc-projects';
import { MOCK_REPOS } from '@/data/repos-mock';
import { MOCK_MODE } from '@/lib/db';
import type { MemberRole } from '@/types';

const MOCK_TIMESTAMP = '2026-03-03T00:00:00.000Z';

export const DEFAULT_WORKSPACE = {
  id: '00000000-0000-4000-8000-000000000001',
  name: 'VisioGold DRC Command',
  slug: 'visiogold-drc-command',
  created_at: MOCK_TIMESTAMP,
} as const;

interface DemoUser {
  id: string;
  email: string;
  displayName: string;
  role: MemberRole;
}

const DEMO_USERS: DemoUser[] = [
  {
    id: '00000000-0000-4000-8000-000000000101',
    email: 'admin@visiogold.com',
    displayName: 'VisioGold Admin',
    role: 'ADMIN',
  },
  {
    id: '00000000-0000-4000-8000-000000000102',
    email: 'analyst@visiogold.com',
    displayName: 'VisioGold Analyst',
    role: 'ANALYST',
  },
  {
    id: '00000000-0000-4000-8000-000000000103',
    email: 'viewer@visiogold.com',
    displayName: 'VisioGold Viewer',
    role: 'VIEWER',
  },
];

export function isPlaceholderSupabaseValue(value?: string | null): boolean {
  if (!value) return true;
  return /your-project|your-supabase|placeholder|example|demo/i.test(value);
}

export const MOCK_AUTH_MODE =
  MOCK_MODE ||
  isPlaceholderSupabaseValue(process.env.NEXT_PUBLIC_SUPABASE_URL) ||
  isPlaceholderSupabaseValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export function getDemoUserByEmail(email: string): DemoUser | null {
  return DEMO_USERS.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
}

export function getDemoUserById(id: string): DemoUser | null {
  return DEMO_USERS.find((user) => user.id === id) || null;
}

export function getDemoWorkspaceMemberships(role: MemberRole) {
  return [
    {
      workspace_id: DEFAULT_WORKSPACE.id,
      workspace_name: DEFAULT_WORKSPACE.name,
      workspace_slug: DEFAULT_WORKSPACE.slug,
      role,
    },
  ];
}

export function getMockWorkspaces(role: MemberRole) {
  return [
    {
      id: DEFAULT_WORKSPACE.id,
      name: DEFAULT_WORKSPACE.name,
      slug: DEFAULT_WORKSPACE.slug,
      created_at: DEFAULT_WORKSPACE.created_at,
      role,
    },
  ];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildProjectRepo(projectIndex: number) {
  const project = DRC_PROJECTS[projectIndex];
  const repoId = `repo-${project.projectId}`;

  return {
    repo: {
      id: repoId,
      workspace_id: DEFAULT_WORKSPACE.id,
      name: `${project.name} Intelligence Repo`,
      slug: slugify(project.name),
      description: `${project.operator} in ${project.location.province} (${project.status.replace(/_/g, ' ')})`,
      country: project.location.country,
      commodity: project.primaryCommodity,
      status: 'ACTIVE',
      default_branch_id: `${repoId}-main`,
      default_branch_name: 'main',
      created_by: DEMO_USERS[0].id,
      created_at: project.lastUpdated || MOCK_TIMESTAMP,
      metadata: {
        projectId: project.projectId,
        belt: project.location.belt,
        province: project.location.province,
      },
    },
    branches: [
      {
        id: `${repoId}-main`,
        name: 'main',
        visibility: 'PRIVATE',
        repo_id: repoId,
        created_at: project.lastUpdated || MOCK_TIMESTAMP,
        created_by_name: DEMO_USERS[0].displayName,
      },
      {
        id: `${repoId}-field-intel`,
        name: 'field-intel',
        visibility: 'SHARED_WITH_VISIOGOLD',
        repo_id: repoId,
        created_at: project.lastUpdated || MOCK_TIMESTAMP,
        created_by_name: DEMO_USERS[1].displayName,
      },
    ],
  };
}

function buildFixtureRepo(index: number) {
  const fixture = MOCK_REPOS[index];
  const repoId = fixture.id;

  return {
    repo: {
      id: repoId,
      workspace_id: DEFAULT_WORKSPACE.id,
      name: fixture.name,
      slug: slugify(fixture.name),
      description: fixture.description,
      country: 'DRC',
      commodity: fixture.name.toLowerCase().includes('copper') ? 'Copper' : 'Gold',
      status: fixture.status.toUpperCase(),
      default_branch_id: fixture.branches[0]?.id || `${repoId}-main`,
      default_branch_name: fixture.branches[0]?.name || 'main',
      created_by: DEMO_USERS[0].id,
      created_at: fixture.created_at,
      metadata: {
        centroid: fixture.centroid,
      },
    },
    branches: fixture.branches.map((branch) => ({
      id: branch.id,
      name: branch.name,
      visibility: branch.id === 'main' ? 'PRIVATE' : 'SHARED_WITH_VISIOGOLD',
      repo_id: repoId,
      created_at: fixture.created_at,
      created_by_name: DEMO_USERS[0].displayName,
    })),
  };
}

function buildAllMockRepoEntries() {
  const fixtureEntries = MOCK_REPOS.map((_, index) => buildFixtureRepo(index));
  const projectEntries = DRC_PROJECTS.map((_, index) => buildProjectRepo(index));
  return [...fixtureEntries, ...projectEntries];
}

export function getMockRepos() {
  return buildAllMockRepoEntries().map((entry) => entry.repo);
}

export function getMockRepo(repoId: string) {
  return buildAllMockRepoEntries().find((entry) => entry.repo.id === repoId) || null;
}

export function getMockRepoBranches(repoId: string) {
  return getMockRepo(repoId)?.branches || [];
}

export function getMockAuditEntries() {
  return [
    {
      id: 'audit-001',
      workspace_id: DEFAULT_WORKSPACE.id,
      user_id: DEMO_USERS[0].id,
      action: 'LOGIN',
      resource_type: 'auth',
      resource_id: DEMO_USERS[0].id,
      details: { mode: 'mock-auth', source: 'demo-user' },
      email: DEMO_USERS[0].email,
      display_name: DEMO_USERS[0].displayName,
      created_at: '2026-03-03T08:15:00.000Z',
    },
    {
      id: 'audit-002',
      workspace_id: DEFAULT_WORKSPACE.id,
      user_id: DEMO_USERS[1].id,
      action: 'REPO_READ',
      resource_type: 'repo',
      resource_id: 'repo-drc_kibali_001',
      details: { route: '/api/repos', source: 'mock-mode' },
      email: DEMO_USERS[1].email,
      display_name: DEMO_USERS[1].displayName,
      created_at: '2026-03-03T08:20:00.000Z',
    },
    {
      id: 'audit-003',
      workspace_id: DEFAULT_WORKSPACE.id,
      user_id: DEMO_USERS[0].id,
      action: 'BRANCH_CREATE',
      resource_type: 'branch',
      resource_id: 'repo-drc_adumbi_005-field-intel',
      details: { branch: 'field-intel', reason: 'Intel briefing workspace' },
      email: DEMO_USERS[0].email,
      display_name: DEMO_USERS[0].displayName,
      created_at: '2026-03-03T08:35:00.000Z',
    },
    {
      id: 'audit-004',
      workspace_id: DEFAULT_WORKSPACE.id,
      user_id: DEMO_USERS[1].id,
      action: 'PUBLISH',
      resource_type: 'branch',
      resource_id: 'repo-pr-8832',
      details: { branch: 'main', visibility: 'SHARED_WITH_VISIOGOLD' },
      email: DEMO_USERS[1].email,
      display_name: DEMO_USERS[1].displayName,
      created_at: '2026-03-03T09:00:00.000Z',
    },
  ];
}
