import { useState, useMemo, useRef, useEffect } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import OpportunityFeed from '../opportunities/OpportunityFeed';
import type { Opportunity } from '../../lib/types/opportunities';

interface Props {
  onCreateRepo?: (repoId: string) => void;
  onEvaluate?: () => void;
}

const PROVINCES = [
  'All', 'Haut-Katanga', 'Haut-Uele', 'Ituri', 'Maniema',
  'North Kivu', 'South Kivu', 'Tanganyika', 'Tshopo',
];

const COMMODITIES = ['All', 'Gold', 'Copper', 'Cobalt', 'Tin', 'Coltan'];
const STATUSES = ['All', 'Active', 'Expiring', 'Pending'];

function FilterDropdown({ label, value, options, onChange }: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = value !== 'All';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`glass-panel px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 whitespace-nowrap transition-all ${
          isActive
            ? 'text-white border-gold-400/50 bg-gold-400/10'
            : 'text-gray-300 hover:text-white hover:bg-white/5'
        }`}
      >
        {label}: {value}
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 min-w-[160px] glass-panel rounded-lg border border-white/10 bg-bg-surface/95 backdrop-blur-xl shadow-xl overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-xs transition-colors ${
                value === opt
                  ? 'text-gold-400 bg-gold-400/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OpportunityExplorer({ onCreateRepo, onEvaluate }: Props) {
  const [commodity, setCommodity] = useState('All');
  const [province, setProvince] = useState('All');
  const [status, setStatus] = useState('All');

  const hasFilters = commodity !== 'All' || province !== 'All' || status !== 'All';

  const filterFn = useMemo(() => {
    return (opp: Opportunity) => {
      if (commodity !== 'All' && opp.commodity?.toLowerCase() !== commodity.toLowerCase()) return false;
      if (province !== 'All' && opp.province?.toLowerCase() !== province.toLowerCase()) return false;
      if (status !== 'All') {
        const title = opp.title?.toLowerCase() || '';
        const permitId = opp.permit_id?.toLowerCase() || '';
        if (status === 'Expiring' && !title.includes('expir') && !permitId.includes('exp')) return false;
        if (status === 'Active' && (title.includes('expir') || title.includes('pend'))) return false;
        if (status === 'Pending' && !title.includes('pend')) return false;
      }
      return true;
    };
  }, [commodity, province, status]);

  const clearFilters = () => {
    setCommodity('All');
    setProvince('All');
    setStatus('All');
  };

  return (
    <div className="p-6 flex flex-col h-full">
      <header className="mb-6">
        <h1 className="text-2xl font-light tracking-tight text-white mb-1">Opportunity Explorer</h1>
        <p className="text-sm text-text-muted">Ranked targets based on multi-factor analysis.</p>
      </header>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide items-center">
        <FilterDropdown label="Commodity" value={commodity} options={COMMODITIES} onChange={setCommodity} />
        <FilterDropdown label="Province" value={province} options={PROVINCES} onChange={setProvince} />
        <FilterDropdown label="Status" value={status} options={STATUSES} onChange={setStatus} />

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-2.5 py-1.5 rounded-full text-xs flex items-center gap-1 text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <OpportunityFeed onCreateRepo={onCreateRepo} onEvaluate={onEvaluate} filterFn={filterFn} />
      </div>
    </div>
  );
}
