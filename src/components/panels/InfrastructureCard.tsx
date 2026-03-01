import { Route, MapPin, Wrench } from 'lucide-react';

interface Props {
  properties: Record<string, unknown>;
}

const TYPE_COLORS: Record<string, string> = {
  road: '#888888',
  river: '#4488FF',
  railway: '#CC8800',
  airport: '#4488FF',
  town: '#FFFFFF',
};

export default function InfrastructureCard({ properties }: Props) {
  const type = String(properties.type || 'unknown');
  const color = TYPE_COLORS[type] || '#666666';

  const conditionBadge = properties.condition ? {
    good: 'text-green-400 border-green-400/30 bg-green-400/10',
    fair: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
    poor: 'text-red-400 border-red-400/30 bg-red-400/10',
  }[String(properties.condition)] : null;

  return (
    <div className="glass-panel synthetic-energy rounded-xl p-5 border-l-2" style={{ borderLeftColor: color }}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-xs font-mono mb-1" style={{ color }}>{String(properties.id)}</div>
          <h3 className="text-lg font-semibold text-white">{String(properties.name || 'Unknown')}</h3>
          <div className="text-xs text-text-muted capitalize mt-0.5">{type}</div>
        </div>
        {conditionBadge && (
          <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border font-semibold ${conditionBadge}`}>
            {String(properties.condition)}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 text-sm">
        <div className="flex items-center gap-2 text-gray-300">
          <Route size={14} strokeWidth={1} style={{ color }} className="icon-shine" />
          <span className="text-text-muted text-xs w-16">Type</span>
          <span className="text-white capitalize">{type}</span>
        </div>
        {!!properties.surface && (
          <div className="flex items-center gap-2 text-gray-300">
            <Wrench size={14} strokeWidth={1} style={{ color }} className="icon-shine" />
            <span className="text-text-muted text-xs w-16">Surface</span>
            <span className="text-white capitalize">{String(properties.surface)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
