import { Loader2 } from 'lucide-react';
import { useOpportunities } from '../../hooks/useOpportunities';
import { useMapContext } from '../../hooks/useMap';
import OpportunityCardItem from './OpportunityCardItem';
import type { Opportunity } from '../../lib/types/opportunities';

interface Props {
  compact?: boolean;
  limit?: number;
  onCreateRepo?: (repoId: string) => void;
}

export default function OpportunityFeed({ compact, limit, onCreateRepo }: Props) {
  const { opportunities, loading } = useOpportunities();
  const { map } = useMapContext();

  const displayed = limit ? opportunities.slice(0, limit) : opportunities;

  const handleFlyTo = (opp: Opportunity) => {
    if (map && opp.centroid) {
      map.flyTo({
        center: opp.centroid,
        zoom: 8,
        speed: 1.2,
        essential: true,
      });
    }
  };

  const handleCreateRepo = (opp: Opportunity) => {
    const repoId = `repo-${opp.permit_id.toLowerCase()}`;
    onCreateRepo?.(repoId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={24} className="animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {displayed.map((opp) => (
        <OpportunityCardItem
          key={opp.id}
          opportunity={opp}
          onFlyTo={handleFlyTo}
          onCreateRepo={handleCreateRepo}
          compact={!!compact}
        />
      ))}
    </div>
  );
}
