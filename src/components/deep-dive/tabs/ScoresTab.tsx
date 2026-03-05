import { Pickaxe, Route, Shield, FileCheck, Database } from 'lucide-react';
import { useDeepDive } from '@/hooks/useDeepDive';
import ScoreBar from '@/components/opportunities/ScoreBar';

export default function ScoresTab() {
  const { target } = useDeepDive();
  if (!target) return null;

  // Projects don't have opportunity scores
  if (target.type === 'project') {
    const project = target.data;
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
          <p className="text-sm text-gray-400 mb-3">Project metrics for {project.name}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <MetricCard label="Resource" value={project.totalResourceMoz ? `${project.totalResourceMoz} Moz` : 'N/A'} color="#D4AF37" />
            <MetricCard label="Grade" value={project.averageGrade ? `${project.averageGrade} g/t` : 'N/A'} color="#60A5FA" />
            <MetricCard label="Production" value={project.annualProductionKoz ? `${project.annualProductionKoz} koz/yr` : 'N/A'} color="#4ADE80" />
            <MetricCard label="Security" value={project.localContext.securityLevel.toUpperCase()} color={project.localContext.securityLevel === 'low' ? '#4ADE80' : '#FF8800'} />
            <MetricCard label="Permits" value={String(project.permits.length)} color="#A78BFA" />
            <MetricCard label="Mining Method" value={project.miningMethod || 'TBD'} color="#38BDF8" />
          </div>
        </div>
      </div>
    );
  }

  const opp = target.data;
  const { scores, composite_score } = opp;

  const dimensions = [
    { key: 'prospectivity', label: 'Prospectivity', icon: Pickaxe, data: scores.prospectivity },
    { key: 'access', label: 'Access', icon: Route, data: scores.access },
    { key: 'security', label: 'Security', icon: Shield, data: scores.security },
    { key: 'legal', label: 'Legal Complexity', icon: FileCheck, data: scores.legal_complexity },
    { key: 'data', label: 'Data Completeness', icon: Database, data: scores.data_completeness },
  ];

  const scoreColor = composite_score >= 70 ? '#4ADE80' : composite_score >= 50 ? '#FBBF24' : '#F87171';

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Composite Score */}
      <div className="flex items-center justify-center gap-6 p-6 rounded-xl bg-white/5 border border-white/10">
        <div className="text-center">
          <div className="text-5xl font-mono font-bold" style={{ color: scoreColor }}>
            {composite_score}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Composite Score</div>
        </div>
        {/* Radar-style visual — simple bar representation */}
        <div className="flex-1 max-w-sm space-y-3">
          {dimensions.map((dim) => (
            <ScoreBar
              key={dim.key}
              label={dim.label}
              value={dim.data.value}
              icon={<dim.icon size={10} strokeWidth={1} />}
            />
          ))}
        </div>
      </div>

      {/* Detailed Evidence */}
      <div>
        <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-3">Score Evidence</h3>
        <div className="space-y-4">
          {dimensions.map((dim) => {
            const Icon = dim.icon;
            const color = dim.data.value >= 70 ? '#4ADE80' : dim.data.value >= 40 ? '#FBBF24' : '#F87171';
            return (
              <div key={dim.key} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon size={14} style={{ color }} />
                    <span className="text-sm font-medium text-white">{dim.label}</span>
                  </div>
                  <span className="text-lg font-mono font-bold" style={{ color }}>{dim.data.value}</span>
                </div>
                {dim.data.evidence.length > 0 && (
                  <div className="space-y-1.5 mt-2">
                    {dim.data.evidence.map((ev, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-1.5 shrink-0" />
                        <span>{ev.description}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-center">
      <div className="text-xl font-mono font-bold" style={{ color }}>{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">{label}</div>
    </div>
  );
}
