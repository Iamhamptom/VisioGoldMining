import { Mountain, Clock, FileText } from 'lucide-react';

interface Props {
  properties: Record<string, unknown>;
}

export default function LithologyCard({ properties }: Props) {
  return (
    <div className="glass-panel synthetic-energy rounded-xl p-5 border-l-2 border-l-[#8B7355]">
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-4 h-4 rounded-sm mt-1 flex-shrink-0"
          style={{ backgroundColor: String(properties.color || '#8B7355') }}
        />
        <div>
          <h3 className="text-lg font-semibold text-white">{String(properties.unit_name || 'Unknown Unit')}</h3>
          <div className="text-xs text-text-muted">{String(properties.rock_type || '')} &middot; {String(properties.age || '')}</div>
        </div>
      </div>

      <div className="flex flex-col gap-3 text-sm">
        <div className="flex items-center gap-2 text-gray-300">
          <Mountain size={14} strokeWidth={1} className="text-[#8B7355] icon-shine" />
          <span className="text-text-muted text-xs w-16">Lithology</span>
          <span className="text-white capitalize">{String(properties.lithology || 'unknown')}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Clock size={14} strokeWidth={1} className="text-[#8B7355] icon-shine" />
          <span className="text-text-muted text-xs w-16">Age</span>
          <span className="text-white">{String(properties.age || 'unknown')}</span>
        </div>
        {!!properties.description && (
          <div className="mt-2 text-xs text-gray-400 leading-relaxed">
            <FileText size={12} strokeWidth={1} className="inline mr-1 text-[#8B7355]" />
            {String(properties.description)}
          </div>
        )}
      </div>
    </div>
  );
}
