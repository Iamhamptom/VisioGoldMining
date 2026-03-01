import { Filter } from 'lucide-react';
import OpportunityFeed from '../opportunities/OpportunityFeed';

interface Props {
  onCreateRepo?: (repoId: string) => void;
}

export default function OpportunityExplorer({ onCreateRepo }: Props) {
  return (
    <div className="p-6 flex flex-col h-full">
      <header className="mb-6">
        <h1 className="text-2xl font-light tracking-tight text-white mb-1">Opportunity Explorer</h1>
        <p className="text-sm text-text-muted">Ranked targets based on multi-factor analysis.</p>
      </header>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <button className="glass-panel px-3 py-1.5 rounded-full text-xs flex items-center gap-1 text-white border-gold/50 bg-gold/10 whitespace-nowrap">
          Commodity: Gold
        </button>
        <button className="glass-panel px-3 py-1.5 rounded-full text-xs flex items-center gap-1 text-gray-300 hover:text-white whitespace-nowrap">
          Province: All
        </button>
        <button className="glass-panel px-3 py-1.5 rounded-full text-xs flex items-center gap-1 text-gray-300 hover:text-white whitespace-nowrap">
          Status: Open / Expiring
        </button>
        <button className="glass-panel px-3 py-1.5 rounded-full text-xs flex items-center gap-1 text-gray-300 hover:text-white whitespace-nowrap">
          <Filter size={12} strokeWidth={1} className="icon-shine" /> More
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <OpportunityFeed onCreateRepo={onCreateRepo} />
      </div>
    </div>
  );
}
