import { MapPin, Calendar, User, Pickaxe, SquareStack } from 'lucide-react';

interface Props {
  properties: Record<string, unknown>;
}

export default function PermitCard({ properties }: Props) {
  const status = String(properties.status || 'unknown');
  const statusColor = status === 'granted' ? 'text-green-400 border-green-400/30 bg-green-400/10'
    : status === 'pending' ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
    : status === 'expired' ? 'text-red-400 border-red-400/30 bg-red-400/10'
    : 'text-gray-400 border-gray-400/30 bg-gray-400/10';

  return (
    <div className="glass-panel synthetic-energy rounded-xl p-5 border-l-2 border-l-gold">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-xs text-gold font-mono mb-1">{String(properties.permit_number || properties.id)}</div>
          <h3 className="text-lg font-semibold text-white">{String(properties.name || 'Unknown Permit')}</h3>
        </div>
        <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border font-semibold ${statusColor}`}>
          {status}
        </span>
      </div>

      <div className="flex flex-col gap-3 text-sm">
        {!!properties.holder && (
          <div className="flex items-center gap-2 text-gray-300">
            <User size={14} strokeWidth={1} className="text-gold icon-shine" />
            <span className="text-text-muted text-xs w-16">Holder</span>
            <span className="text-white">{String(properties.holder)}</span>
          </div>
        )}
        {!!properties.commodity && (
          <div className="flex items-center gap-2 text-gray-300">
            <Pickaxe size={14} strokeWidth={1} className="text-gold icon-shine" />
            <span className="text-text-muted text-xs w-16">Commodity</span>
            <span className="text-white">{String(properties.commodity)}</span>
          </div>
        )}
        {!!properties.area_km2 && (
          <div className="flex items-center gap-2 text-gray-300">
            <SquareStack size={14} strokeWidth={1} className="text-gold icon-shine" />
            <span className="text-text-muted text-xs w-16">Area</span>
            <span className="text-white">{String(properties.area_km2)} km²</span>
          </div>
        )}
        {!!properties.granted_date && (
          <div className="flex items-center gap-2 text-gray-300">
            <Calendar size={14} strokeWidth={1} className="text-gold icon-shine" />
            <span className="text-text-muted text-xs w-16">Granted</span>
            <span className="text-white">{String(properties.granted_date)}</span>
          </div>
        )}
        {!!properties.expiry_date && (
          <div className="flex items-center gap-2 text-gray-300">
            <Calendar size={14} strokeWidth={1} className="text-gold icon-shine" />
            <span className="text-text-muted text-xs w-16">Expires</span>
            <span className="text-white">{String(properties.expiry_date)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
