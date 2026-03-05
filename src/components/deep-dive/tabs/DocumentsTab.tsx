import { FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useDeepDive } from '@/hooks/useDeepDive';

interface DocItem {
  name: string;
  status: 'available' | 'pending' | 'missing';
  description: string;
}

export default function DocumentsTab() {
  const { target } = useDeepDive();
  if (!target) return null;

  // Generate document list based on target type
  const docs: DocItem[] = target.type === 'opportunity'
    ? [
        { name: 'Permit Documentation', status: 'available', description: `Permit ${target.data.permit_id} — mining exploration license` },
        { name: 'Environmental Impact Assessment', status: 'pending', description: 'Required EIA for exploration activities' },
        { name: 'Resource Estimate Report', status: 'missing', description: 'No JORC/NI 43-101 resource estimate available' },
        { name: 'Geological Survey Data', status: target.data.scores.data_completeness.value > 50 ? 'available' : 'missing', description: 'Regional geological survey coverage' },
        { name: 'Security Assessment', status: target.data.scores.security.value > 60 ? 'available' : 'pending', description: 'Local security conditions report' },
      ]
    : [
        { name: 'Mining License', status: 'available', description: `${target.data.permits.length} permits on file` },
        { name: 'Technical Report', status: target.data.totalResourceMoz ? 'available' : 'missing', description: target.data.totalResourceMoz ? `${target.data.totalResourceMoz} Moz Au resource` : 'No published resource estimate' },
        { name: 'Environmental Compliance', status: 'pending', description: 'Environmental compliance documentation' },
        { name: 'Access Agreement', status: target.data.accessInfo.roadCondition ? 'available' : 'missing', description: 'Land access and logistics agreements' },
        { name: 'Community Relations', status: target.data.artisanalOverlay.present ? 'pending' : 'available', description: target.data.artisanalOverlay.present ? 'Active artisanal mining — engagement required' : 'Community engagement documentation' },
        { name: 'Production Records', status: target.data.annualProductionKoz ? 'available' : 'missing', description: target.data.annualProductionKoz ? `${target.data.annualProductionKoz} koz/yr production` : 'No production data' },
      ];

  const statusIcon = {
    available: <CheckCircle size={14} className="text-green-400" />,
    pending: <Clock size={14} className="text-yellow-400" />,
    missing: <AlertTriangle size={14} className="text-red-400" />,
  };

  const statusLabel = {
    available: 'Available',
    pending: 'Pending',
    missing: 'Missing',
  };

  const statusColor = {
    available: 'border-green-500/20 bg-green-500/5',
    pending: 'border-yellow-500/20 bg-yellow-500/5',
    missing: 'border-red-500/20 bg-red-500/5',
  };

  const available = docs.filter(d => d.status === 'available').length;
  const total = docs.length;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Summary */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
        <FileText size={24} className="text-gold-400" />
        <div>
          <p className="text-sm text-white font-medium">{available} of {total} documents available</p>
          <p className="text-[10px] text-gray-500">Document readiness for due diligence</p>
        </div>
        <div className="ml-auto">
          <div className="w-16 h-16 relative">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#ffffff10" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.5" fill="none"
                stroke="#D4AF37"
                strokeWidth="3"
                strokeDasharray={`${(available / total) * 97.4} 97.4`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-mono text-gold-400">{Math.round((available / total) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Document List */}
      <div className="space-y-2">
        {docs.map((doc, i) => (
          <div key={i} className={`flex items-center gap-3 p-4 rounded-xl border ${statusColor[doc.status]}`}>
            {statusIcon[doc.status]}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium">{doc.name}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{doc.description}</p>
            </div>
            <span className={`text-[10px] uppercase tracking-wider font-medium ${
              doc.status === 'available' ? 'text-green-400' : doc.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {statusLabel[doc.status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
