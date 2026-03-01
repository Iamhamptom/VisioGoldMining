import { ShieldAlert, Calendar, AlertTriangle, Skull } from 'lucide-react';

interface Props {
  properties: Record<string, unknown>;
}

export default function IncidentCard({ properties }: Props) {
  const severity = String(properties.severity || 'unknown');
  const severityConfig = {
    high: { color: '#FF4444', bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
    medium: { color: '#FF8800', bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' },
    low: { color: '#FFCC00', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' },
  }[severity] || { color: '#FF6666', bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' };

  const eventTypeLabel = String(properties.event_type || 'unknown').replace(/_/g, ' ');

  return (
    <div className="glass-panel synthetic-energy rounded-xl p-5 border-l-2 border-l-red-500">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-xs font-mono text-red-400 mb-1">{String(properties.id)}</div>
          <h3 className="text-lg font-semibold text-white capitalize">{eventTypeLabel}</h3>
        </div>
        <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border font-semibold ${severityConfig.text} ${severityConfig.border} ${severityConfig.bg}`}>
          {severity}
        </span>
      </div>

      <div className="flex flex-col gap-3 text-sm">
        <div className="flex items-center gap-2 text-gray-300">
          <Calendar size={14} strokeWidth={1} className="text-red-400 icon-shine" />
          <span className="text-text-muted text-xs w-16">Date</span>
          <span className="text-white">{String(properties.date || 'unknown')}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Skull size={14} strokeWidth={1} className="text-red-400 icon-shine" />
          <span className="text-text-muted text-xs w-16">Fatalities</span>
          <span className="text-white">{String(properties.fatalities ?? 'unknown')}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <ShieldAlert size={14} strokeWidth={1} className="text-red-400 icon-shine" />
          <span className="text-text-muted text-xs w-16">Source</span>
          <span className="text-white">{String(properties.source || 'unknown')}</span>
        </div>
        {properties.description && (
          <div className="mt-2 text-xs text-gray-400 leading-relaxed">
            <AlertTriangle size={12} strokeWidth={1} className="inline mr-1 text-red-400" />
            {String(properties.description)}
          </div>
        )}
      </div>
    </div>
  );
}
