import { ArrowLeft, X } from 'lucide-react';
import { useSelection } from '../../hooks/useFeatureSelection';
import PermitCard from './PermitCard';
import LithologyCard from './LithologyCard';
import OccurrenceCard from './OccurrenceCard';
import IncidentCard from './IncidentCard';
import InfrastructureCard from './InfrastructureCard';
import OpportunityDetailCard from './OpportunityDetailCard';
import ProjectIntelligenceHub from '../screens/ProjectIntelligenceHub';

export default function FeatureContextPanel() {
  const { selectedFeature, clearSelection } = useSelection();

  if (!selectedFeature) return null;

  const { layerId, properties } = selectedFeature;

  const isProject = layerId === 'drc-projects';
  const isOpportunity = layerId === 'opportunity';

  const heading = isProject
    ? 'Project Intelligence'
    : isOpportunity
      ? 'Opportunity Analysis'
      : 'Feature Details';

  return (
    <div className="p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={clearSelection}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
            title="Back to list"
          >
            <ArrowLeft size={18} strokeWidth={1.5} />
          </button>
          <h2 className="text-lg font-light text-white tracking-tight">
            {heading}
          </h2>
        </div>
        <button
          onClick={clearSelection}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
        >
          <X size={18} strokeWidth={1.5} />
        </button>
      </div>

      {isProject && <ProjectIntelligenceHub properties={properties} />}
      {isOpportunity && <OpportunityDetailCard properties={properties} />}
      {layerId === 'tenements' && <PermitCard properties={properties} />}
      {layerId === 'geology' && <LithologyCard properties={properties} />}
      {layerId === 'occurrences' && <OccurrenceCard properties={properties} />}
      {layerId === 'security-events' && <IncidentCard properties={properties} />}
      {layerId === 'infrastructure' && <InfrastructureCard properties={properties} />}
    </div>
  );
}
