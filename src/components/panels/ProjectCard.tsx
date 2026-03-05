import { motion } from 'motion/react';
import {
  Crosshair, MapPin, Pickaxe, Shield, Users, Truck,
  AlertTriangle, Globe, ArrowRight, Mountain, Building, ScanSearch,
} from 'lucide-react';
import { DRC_PROJECTS } from '../../data/drc-projects';
import { usePursuit } from '../../hooks/usePursuitContext';
import { useDeepDive } from '@/hooks/useDeepDive';

interface Props {
  properties: Record<string, unknown>;
}

export default function ProjectCard({ properties }: Props) {
  const { startPursuit } = usePursuit();
  const { openDeepDive } = useDeepDive();

  const projectId = (properties.projectId as string) || (properties.id as string) || (properties.name as string) || '';
  const project = DRC_PROJECTS.find(p =>
    p.projectId === projectId || p.projectId === properties.id || p.name === properties.name
  );

  if (!project) {
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-gold/5 border border-gold/20">
          <h3 className="text-sm font-medium text-gold mb-1">{String(properties.name || 'Mining Project')}</h3>
          <p className="text-xs text-gray-400">{String(properties.operator || 'Unknown operator')}</p>
          {typeof properties.status === 'string' && (
            <StatusBadge status={properties.status} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Project Header */}
      <div className="p-4 rounded-xl bg-gold/5 border border-gold/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
            <Pickaxe size={18} className="text-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white">{project.name}</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">{project.operator}</p>
            <div className="flex items-center gap-2 mt-2">
              <StatusBadge status={project.status} />
              {project.totalResourceMoz && (
                <span className="text-[10px] text-gold font-mono">{project.totalResourceMoz} Moz</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-2">
        <MetricBox icon={Mountain} label="Grade" value={project.averageGrade ? `${project.averageGrade} g/t` : 'N/A'} color="#D4AF37" />
        <MetricBox icon={Pickaxe} label="Method" value={project.miningMethod || 'TBD'} color="#4488FF" />
        <MetricBox icon={MapPin} label="Province" value={project.location.province} color="#A78BFA" />
        <MetricBox icon={Shield} label="Security" value={project.localContext.securityLevel.toUpperCase()} color={project.localContext.securityLevel === 'low' ? '#00FF88' : '#FF8800'} />
      </div>

      {/* Production */}
      {project.annualProductionKoz && (
        <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/20">
          <p className="text-[10px] text-green-400 uppercase tracking-widest mb-1">Annual Production</p>
          <p className="text-lg font-mono text-green-400">{project.annualProductionKoz} koz Au</p>
        </div>
      )}

      {/* Geology */}
      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5">Geology</p>
        <p className="text-xs text-gray-300">{project.depositType} — {project.geology}</p>
      </div>

      {/* Access Info */}
      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Access & Logistics</p>
        <div className="space-y-1.5 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Building size={10} className="text-blue-400 shrink-0" />
            <span>Nearest city: {project.accessInfo.nearestCity} ({project.accessInfo.distanceKm ? `${project.accessInfo.distanceKm} km` : 'N/A'})</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck size={10} className="text-blue-400 shrink-0" />
            <span>Road: {project.accessInfo.roadCondition || 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe size={10} className="text-blue-400 shrink-0" />
            <span>Airstrip: {project.accessInfo.airstrip ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>

      {/* Artisanal Activity */}
      {project.artisanalOverlay.present && (
        <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/20">
          <div className="flex items-center gap-2 mb-1.5">
            <AlertTriangle size={12} className="text-orange-400" />
            <p className="text-[10px] text-orange-400 uppercase tracking-widest">Artisanal Activity</p>
          </div>
          <p className="text-xs text-gray-400">
            Scale: <span className="text-orange-300 capitalize">{project.artisanalOverlay.scale}</span>
            {project.artisanalOverlay.estimatedMiners && (
              <span> — Est. {project.artisanalOverlay.estimatedMiners.toLocaleString()} miners</span>
            )}
          </p>
          {project.artisanalOverlay.notes && (
            <p className="text-[10px] text-gray-500 mt-1">{project.artisanalOverlay.notes}</p>
          )}
        </div>
      )}

      {/* Recent Activity */}
      {project.recentActivity.length > 0 && (
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Recent Activity</p>
          <div className="space-y-2">
            {project.recentActivity.slice(0, 3).map((activity, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-300">{activity.summary}</p>
                  <p className="text-[10px] text-gray-600">{activity.date} — {activity.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deep Dive Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => openDeepDive({ type: 'project', data: project })}
        className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gold/40 transition-all duration-300 group flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
            <ScanSearch size={20} className="text-gold icon-shine" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gold">Deep Dive</p>
            <p className="text-[10px] text-gray-400">Full analysis, scores, AI chat</p>
          </div>
        </div>
        <ArrowRight size={18} className="text-gray-500 group-hover:text-gold group-hover:translate-x-1 transition-all" />
      </motion.button>

      {/* Pursue Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => startPursuit(project.projectId)}
        className="w-full p-4 rounded-xl bg-gradient-to-r from-gold/20 to-gold/10 border border-gold/40 hover:border-gold/60 transition-all duration-300 group flex items-center justify-between gold-glow"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center group-hover:bg-gold/30 transition-colors">
            <Crosshair size={20} className="text-gold icon-shine" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gold">Pursue This Project</p>
            <p className="text-[10px] text-gray-400">Begin 10-phase mining lifecycle</p>
          </div>
        </div>
        <ArrowRight size={18} className="text-gold group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </div>
  );
}

function MetricBox({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
  return (
    <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon size={10} style={{ color }} />
        <span className="text-[9px] text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xs font-medium text-gray-200 truncate">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    producing: 'bg-green-500/20 text-green-400 border-green-500/30',
    producing_disrupted: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    care_and_maintenance: 'bg-red-500/20 text-red-400 border-red-500/30',
    development: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    advanced_exploration: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    early_exploration: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    artisanal_alluvial: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };
  const label = status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return (
    <span className={`text-[9px] px-2 py-0.5 rounded-full border uppercase tracking-wider ${colors[status] || 'bg-white/10 text-gray-400 border-white/10'}`}>
      {label}
    </span>
  );
}
