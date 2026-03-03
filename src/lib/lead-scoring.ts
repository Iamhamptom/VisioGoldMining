import type { InvestorProfile } from '@/types';

export interface LeadScoreBreakdown {
  profile_completeness: number;  // max 25
  investment_capacity: number;   // max 25
  engagement: number;            // max 25
  verification: number;          // max 15
  sector_alignment: number;      // max 10
  total: number;                 // max 100
}

interface EngagementData {
  listing_views: number;
  saved_opportunities: number;
  consultation_requests: number;
  portal_registrations: number;
}

/**
 * Compute a lead score (0-100) for an investor based on profile completeness,
 * investment capacity, engagement signals, verification, and sector alignment.
 */
export function computeLeadScore(
  investor: InvestorProfile,
  engagement: EngagementData,
  portalSectors: string[] = []
): LeadScoreBreakdown {
  // 1. Profile completeness (25 pts)
  let profile = 0;
  if (investor.first_name && investor.last_name) profile += 5;
  if (investor.email) profile += 5;
  if (investor.company) profile += 4;
  if (investor.job_title) profile += 3;
  if (investor.phone) profile += 3;
  if (investor.country) profile += 3;
  if (investor.experience_level) profile += 2;

  // 2. Investment capacity (25 pts)
  let capacity = 0;
  const maxInv = investor.investment_max || 0;
  if (maxInv >= 10_000_000) capacity = 25;
  else if (maxInv >= 1_000_000) capacity = 20;
  else if (maxInv >= 500_000) capacity = 15;
  else if (maxInv >= 100_000) capacity = 10;
  else if (maxInv > 0) capacity = 5;

  // Bonus for institutional investors
  if (investor.experience_level === 'institutional') {
    capacity = Math.min(25, capacity + 5);
  }

  // 3. Engagement signals (25 pts)
  let engagementScore = 0;
  engagementScore += Math.min(5, engagement.listing_views);
  engagementScore += Math.min(8, engagement.saved_opportunities * 4);
  engagementScore += Math.min(10, engagement.consultation_requests * 5);
  engagementScore += Math.min(2, engagement.portal_registrations);
  engagementScore = Math.min(25, engagementScore);

  // 4. Verification status (15 pts)
  const verification = investor.is_verified ? 15 : 0;

  // 5. Sector alignment (10 pts)
  let sectorScore = 0;
  if (portalSectors.length > 0 && investor.sectors_of_interest.length > 0) {
    const overlap = investor.sectors_of_interest.filter(s => portalSectors.includes(s)).length;
    sectorScore = Math.min(10, Math.round((overlap / portalSectors.length) * 10));
  } else if (investor.sectors_of_interest.length > 0) {
    sectorScore = 5; // Has some interest
  }

  const total = profile + capacity + engagementScore + verification + sectorScore;

  return {
    profile_completeness: profile,
    investment_capacity: capacity,
    engagement: engagementScore,
    verification,
    sector_alignment: sectorScore,
    total,
  };
}

/**
 * Return a human-readable lead quality label based on score.
 */
export function getLeadQuality(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Hot', color: '#EF4444' };
  if (score >= 60) return { label: 'Warm', color: '#F59E0B' };
  if (score >= 40) return { label: 'Interested', color: '#3B82F6' };
  if (score >= 20) return { label: 'Cold', color: '#6B7280' };
  return { label: 'New', color: '#9CA3AF' };
}
