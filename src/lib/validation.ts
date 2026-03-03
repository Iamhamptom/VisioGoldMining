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

// ============================================================
// Government Portal Schemas
// ============================================================

const slugPattern = /^[a-z0-9-]+$/;
const sectorEnum = z.enum(['mining', 'agriculture', 'infrastructure', 'energy', 'tourism', 'urban', 'forestry', 'fisheries']);

// Government Entities
export const createEntitySchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(slugPattern),
  entity_type: z.enum(['province', 'municipality', 'territory', 'sector', 'chiefdom']),
  parent_id: z.string().uuid().optional(),
  province: z.string().max(255).optional(),
  country: z.string().max(100).optional().default('DRC'),
  location: z.object({ lat: z.number(), lon: z.number(), bbox: z.array(z.number()).optional() }).optional(),
  population: z.number().int().positive().optional(),
  area_km2: z.number().positive().optional(),
});

// Government Portals
export const createPortalSchema = z.object({
  entity_id: z.string().uuid(),
  slug: z.string().min(1).max(255).regex(slugPattern),
  title: z.string().min(1).max(500),
  subtitle: z.string().max(500).optional(),
  description: z.string().optional(),
  logo_url: z.string().url().optional(),
  banner_url: z.string().url().optional(),
  primary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().default('#1E40AF'),
  secondary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().default('#F59E0B'),
  accent_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().default('#10B981'),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().max(50).optional(),
  website_url: z.string().url().optional(),
  featured_sectors: z.array(sectorEnum).optional().default([]),
  hero_text: z.string().optional(),
  about_text: z.string().optional(),
});

export const updatePortalSchema = createPortalSchema.partial().omit({ entity_id: true, slug: true });

// Opportunity Listings
export const createListingSchema = z.object({
  portal_id: z.string().uuid(),
  entity_id: z.string().uuid(),
  title: z.string().min(1).max(500),
  slug: z.string().min(1).max(255).regex(slugPattern),
  summary: z.string().optional(),
  description: z.string().optional(),
  sector_id: sectorEnum,
  province: z.string().max(255).optional(),
  location: z.object({ lat: z.number(), lon: z.number() }).optional(),
  area_hectares: z.number().positive().optional(),
  investment_min: z.number().positive().optional(),
  investment_max: z.number().positive().optional(),
  currency: z.string().length(3).optional().default('USD'),
  expected_roi: z.string().max(100).optional(),
  timeline_months: z.number().int().positive().optional(),
  key_facts: z.array(z.object({
    label: z.string(),
    value: z.string(),
    tooltip: z.string().optional(),
  })).optional().default([]),
  documents: z.array(z.object({
    title: z.string(),
    url: z.string(),
    type: z.string(),
  })).optional().default([]),
  images: z.array(z.object({
    url: z.string(),
    caption: z.string().optional(),
  })).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
});

export const updateListingSchema = createListingSchema.partial().omit({ portal_id: true, entity_id: true, slug: true });

export const updateListingScoresSchema = z.object({
  score_geological: z.number().min(0).max(10).optional(),
  score_infrastructure: z.number().min(0).max(10).optional(),
  score_legal: z.number().min(0).max(10).optional(),
  score_environmental: z.number().min(0).max(10).optional(),
  score_social: z.number().min(0).max(10).optional(),
});

export const listingWorkflowSchema = z.object({
  action: z.enum(['submit', 'start_review', 'approve', 'publish', 'archive', 'revert_to_draft']),
});

// Investor Registration
export const investorRegistrationSchema = z.object({
  email: z.string().email(),
  first_name: z.string().min(1).max(255),
  last_name: z.string().min(1).max(255),
  phone: z.string().max(50).optional(),
  company: z.string().max(255).optional(),
  job_title: z.string().max(255).optional(),
  country: z.string().max(100).optional(),
  investment_min: z.number().positive().optional(),
  investment_max: z.number().positive().optional(),
  sectors_of_interest: z.array(sectorEnum).optional().default([]),
  experience_level: z.enum(['novice', 'intermediate', 'experienced', 'institutional']).optional(),
});

// Consultation Requests
export const consultationRequestSchema = z.object({
  listing_id: z.string().uuid().optional(),
  request_type: z.enum(['meeting', 'information', 'site_visit', 'partnership', 'other']),
  subject: z.string().min(1).max(500),
  message: z.string().min(1),
  contact_name: z.string().min(1).max(255),
  contact_email: z.string().email(),
  contact_phone: z.string().max(50).optional(),
  contact_company: z.string().max(255).optional(),
});

export const updateConsultationSchema = z.object({
  status: z.enum(['pending', 'acknowledged', 'scheduled', 'completed', 'declined', 'cancelled']).optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
  assigned_to: z.string().uuid().optional(),
  response_notes: z.string().optional(),
  scheduled_date: z.string().datetime().optional(),
});

// Revenue Events
export const createRevenueEventSchema = z.object({
  portal_id: z.string().uuid(),
  listing_id: z.string().uuid().optional(),
  investor_id: z.string().uuid().optional(),
  event_type: z.enum(['consultation_fee', 'listing_fee', 'success_fee', 'subscription', 'data_license', 'other']),
  description: z.string().max(500).optional(),
  gross_amount: z.number().positive(),
  currency: z.string().length(3).optional().default('USD'),
  platform_rate: z.number().min(0).max(1).optional().default(0.20),
  reference_id: z.string().max(255).optional(),
  notes: z.string().optional(),
});

// Analytics Events
export const trackAnalyticsSchema = z.object({
  event_type: z.enum([
    'portal_view', 'listing_view', 'listing_click', 'catalog_search',
    'investor_register', 'consultation_submit', 'document_download',
    'map_interact', 'share', 'contact_click',
  ]),
  listing_id: z.string().uuid().optional(),
  session_id: z.string().max(100).optional(),
  metadata: z.record(z.unknown()).optional(),
});
