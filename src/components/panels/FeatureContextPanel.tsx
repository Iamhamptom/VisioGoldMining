import { X } from 'lucide-react';
import { useSelection } from '../../hooks/useFeatureSelection';
import PermitCard from './PermitCard';
import LithologyCard from './LithologyCard';
import OccurrenceCard from './OccurrenceCard';
import IncidentCard from './IncidentCard';
import InfrastructureCard from './InfrastructureCard';

export default function FeatureContextPanel() {
  const { selectedFeature, clearSelection } = useSelection();

  if (!selectedFeature) return null;

  const { layerId, properties } = selectedFeature;

  return (
    <div className="p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-light text-white tracking-tight">Feature Details</h2>
        <button
          onClick={clearSelection}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
        >
          <X size={18} strokeWidth={1.5} />
        </button>
      </div>

      {layerId === 'tenements' && <PermitCard properties={properties} />}
      {layerId === 'geology' && <LithologyCard properties={properties} />}
      {layerId === 'occurrences' && <OccurrenceCard properties={properties} />}
      {layerId === 'security-events' && <IncidentCard properties={properties} />}
      {layerId === 'infrastructure' && <InfrastructureCard properties={properties} />}
    </div>
  );
}
