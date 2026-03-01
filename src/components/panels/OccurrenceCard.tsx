import { Gem, Activity, Database, Calendar } from 'lucide-react';

interface Props {
  properties: Record<string, unknown>;
}

const COMMODITY_COLORS: Record<string, string> = {
  Gold: '#FFD700',
  Copper: '#B87333',
  Cobalt: '#0047AB',
  Tin: '#C0C0C0',
  Coltan: '#8B4513',
};

export default function OccurrenceCard({ properties }: Props) {
  const commodity = String(properties.commodity || 'Unknown');
  const color = COMMODITY_COLORS[commodity] || '#D4AF37';

  return (
    <div className="glass-panel synthetic-energy rounded-xl p-5 border-l-2" style={{ borderLeftColor: color }}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-xs font-mono mb-1" style={{ color }}>{String(properties.id)}</div>
          <h3 className="text-lg font-semibold text-white">{commodity} Occurrence</h3>
        </div>
        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}60` }} />
      </div>

      <div className="flex flex-col gap-3 text-sm">
        <div className="flex items-center gap-2 text-gray-300">
          <Gem size={14} strokeWidth={1} style={{ color }} className="icon-shine" />
          <span className="text-text-muted text-xs w-20">Deposit Type</span>
          <span className="text-white">{String(properties.deposit_type || 'unknown')}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Activity size={14} strokeWidth={1} style={{ color }} className="icon-shine" />
          <span className="text-text-muted text-xs w-20">Grade</span>
          <span className="text-white font-mono">{String(properties.grade || 'N/A')}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Database size={14} strokeWidth={1} style={{ color }} className="icon-shine" />
          <span className="text-text-muted text-xs w-20">Status</span>
          <span className="text-white capitalize">{String(properties.status || 'unknown')}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Database size={14} strokeWidth={1} style={{ color }} className="icon-shine" />
          <span className="text-text-muted text-xs w-20">Source</span>
          <span className="text-white">{String(properties.source || 'unknown')}</span>
        </div>
        {!!properties.last_sampled && (
          <div className="flex items-center gap-2 text-gray-300">
            <Calendar size={14} strokeWidth={1} style={{ color }} className="icon-shine" />
            <span className="text-text-muted text-xs w-20">Sampled</span>
            <span className="text-white">{String(properties.last_sampled)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
