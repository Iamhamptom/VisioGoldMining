import { describe, it, expect } from 'vitest';
import { buildProposal } from '@/lib/sales/proposal-engine';

describe('proposal engine', () => {
  it('builds a package with positive range', () => {
    const result = buildProposal({
      site_type: 'greenfield',
      remoteness: 'high',
      mine_stage: 'phase_2',
      data_maturity: 'medium',
      desired_bundle: 'Geo-to-Drill Pack',
      desired_phase: 'Phase 2',
    });

    expect(result.recommendedPackage).toBe('Geo-to-Drill Pack');
    expect(result.priceMax).toBeGreaterThan(result.priceMin);
    expect(result.milestones.length).toBeGreaterThan(0);
    expect(result.lineItems.length).toBe(3);
  });
});
