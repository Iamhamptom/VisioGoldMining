import { useState, useEffect } from 'react';
import type { Opportunity } from '../lib/types/opportunities';
import { computeOpportunities } from '../lib/opportunity-engine';

export function useOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const results = computeOpportunities();
      setOpportunities(results);
    } catch (err) {
      console.error('Failed to compute opportunities:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { opportunities, loading };
}
