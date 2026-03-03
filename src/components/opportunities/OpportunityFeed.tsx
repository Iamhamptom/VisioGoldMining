import { Loader2 } from 'lucide-react';
import { useOpportunities } from '../../hooks/useOpportunities';
import { useMapContext } from '../../hooks/useMap';
import { useSelection } from '../../hooks/useFeatureSelection';
import OpportunityCardItem from './OpportunityCardItem';
import type { Opportunity } from '../../lib/types/opportunities';

interface Props {
  compact?: boolean;
  limit?: number;
  onCreateRepo?: (repoId: string) => void;
  onEvaluate?: () => void;
  filterFn?: (opp: Opportunity) => boolean;
}

export default function OpportunityFeed({ compact, limit, onCreateRepo, onEvaluate, filterFn }: Props) {
  const { opportunities, loading } = useOpportunities();
  const { map } = useMapContext();
  const { setSelectedFeature } = useSelection();

  const filtered = filterFn ? opportunities.filter(filterFn) : opportunities;
  const displayed = limit ? filtered.slice(0, limit) : filtered;

  const handleSelect = (opp: Opportunity) => {
    // Fly to the opportunity location
    if (map && opp.centroid && (opp.centroid[0] !== 0 || opp.centroid[1] !== 0)) {
      map.flyTo({
        center: opp.centroid,
        zoom: 9,
        pitch: 45,
        speed: 1.2,
        essential: true,
      });
    }

    // Set selected feature — triggers right panel to show detail view
    setSelectedFeature({
      layerId: 'opportunity',
      properties: {
        id: opp.id,
        title: opp.title,
        permit_id: opp.permit_id,
        province: opp.province,
        commodity: opp.commodity,
        area_km2: opp.area_km2,
        composite_score: opp.composite_score,
        scores: opp.scores,
        why_explained: opp.why_explained,
        recommended_next_actions: opp.recommended_next_actions,
      },
      geometry: opp.geom,
    });
  };

  const handleCreateRepo = (opp: Opportunity) => {
    const repoId = `repo-${opp.permit_id.toLowerCase()}`;
    onCreateRepo?.(repoId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={24} className="animate-spin text-gold-400" />
      </div>
    );
  }

  if (displayed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-gray-400 mb-1">No opportunities match your filters.</p>
        <p className="text-xs text-gray-500">Try adjusting your filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {displayed.map((opp) => (
        <OpportunityCardItem
          key={opp.id}
          opportunity={opp}
          onSelect={handleSelect}
          onEvaluate={onEvaluate ? () => { handleSelect(opp); onEvaluate(); } : undefined}
          onCreateRepo={handleCreateRepo}
          compact={!!compact}
        />
      ))}
    </div>
  );
}
