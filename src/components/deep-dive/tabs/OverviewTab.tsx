import { MapPin, Pickaxe, Ruler, Mountain, Shield, Truck, Building, Globe, ChevronRight } from 'lucide-react';
import { useDeepDive } from '@/hooks/useDeepDive';
import { getTargetName, getTargetProvince } from '@/lib/types/deep-dive';

export default function OverviewTab() {
  const { target } = useDeepDive();
  if (!target) return null;

  if (target.type === 'opportunity') return <OpportunityOverview />;
  return <ProjectOverview />;
}

function OpportunityOverview() {
  const { target } = useDeepDive();
  if (!target || target.type !== 'opportunity') return null;

  const opp = target.data;
  const actions = opp.recommended_next_actions || [];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Key Facts Grid */}
      <div>
        <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-3">Key Facts</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <FactCard icon={MapPin} label="Province" value={opp.province} color="#60A5FA" />
          <FactCard icon={Pickaxe} label="Commodity" value={opp.commodity || 'Gold'} color="#D4AF37" />
          <FactCard icon={Ruler} label="Area" value={opp.area_km2 > 0 ? `${opp.area_km2} km²` : 'N/A'} color="#A78BFA" />
          <FactCard icon={Shield} label="Permit" value={opp.permit_id} color="#4ADE80" />
        </div>
      </div>

      {/* Analysis */}
      {opp.why_explained && (
        <div>
          <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-3">Analysis</h3>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-sm text-gray-300 leading-relaxed">{opp.why_explained}</p>
          </div>
        </div>
      )}

      {/* Recommended Actions */}
      {actions.length > 0 && (
        <div>
          <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-3">Recommended Next Steps</h3>
          <div className="space-y-2">
            {actions.map((action, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="w-6 h-6 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] text-gold-400 font-bold">{i + 1}</span>
                </div>
                <p className="text-sm text-gray-300">{action}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectOverview() {
  const { target } = useDeepDive();
  if (!target || target.type !== 'project') return null;

  const project = target.data;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Key Facts Grid */}
      <div>
        <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-3">Key Facts</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <FactCard icon={MapPin} label="Province" value={project.location.province} color="#60A5FA" />
          <FactCard icon={Mountain} label="Grade" value={project.averageGrade ? `${project.averageGrade} g/t` : 'N/A'} color="#D4AF37" />
          <FactCard icon={Pickaxe} label="Method" value={project.miningMethod || 'TBD'} color="#4488FF" />
          <FactCard icon={Shield} label="Security" value={project.localContext.securityLevel.toUpperCase()} color={project.localContext.securityLevel === 'low' ? '#4ADE80' : '#FF8800'} />
        </div>
      </div>

      {/* Production */}
      {project.annualProductionKoz && (
        <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
          <p className="text-[10px] text-green-400 uppercase tracking-widest mb-1">Annual Production</p>
          <p className="text-2xl font-mono text-green-400">{project.annualProductionKoz} koz Au</p>
          {project.totalResourceMoz && (
            <p className="text-xs text-gray-400 mt-1">Total Resource: {project.totalResourceMoz} Moz</p>
          )}
        </div>
      )}

      {/* Geology */}
      <div>
        <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-3">Geology</h3>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-sm text-gray-300">{project.depositType} — {project.geology}</p>
        </div>
      </div>

      {/* Access & Logistics */}
      <div>
        <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-3">Access & Logistics</h3>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Building size={14} className="text-blue-400 shrink-0" />
            <span>Nearest city: {project.accessInfo.nearestCity} ({project.accessInfo.distanceKm ? `${project.accessInfo.distanceKm} km` : 'N/A'})</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck size={14} className="text-blue-400 shrink-0" />
            <span>Road: {project.accessInfo.roadCondition || 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-blue-400 shrink-0" />
            <span>Airstrip: {project.accessInfo.airstrip ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {project.recentActivity.length > 0 && (
        <div>
          <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-3">Recent Activity</h3>
          <div className="space-y-2">
            {project.recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <ChevronRight size={14} className="text-gold-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-300">{activity.summary}</p>
                  <p className="text-[10px] text-gray-600 mt-0.5">{activity.date} — {activity.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FactCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
  return (
    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
      <Icon size={16} style={{ color }} className="mx-auto mb-1.5" />
      <div className="text-xs text-white font-medium truncate">{value}</div>
      <div className="text-[9px] text-gray-500 uppercase tracking-wider mt-0.5">{label}</div>
    </div>
  );
}
