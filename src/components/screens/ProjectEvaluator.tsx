import React, { useState, useMemo } from 'react';
import { FileText, Calendar, DollarSign, CheckCircle2, Download, ChevronDown, MapPin, Shield, Pickaxe, FlaskConical, ScrollText, AlertTriangle } from 'lucide-react';
import { DRC_PROJECTS, type DRCProject } from '../../data/drc-projects';

function computeScore(project: DRCProject): number {
  let score = 50;
  if (project.totalResourceMoz && project.totalResourceMoz > 0) score += Math.min(20, project.totalResourceMoz * 4);
  if (project.averageGrade && project.averageGrade > 2) score += 10;
  if (project.status === 'producing') score += 15;
  else if (project.status === 'development') score += 10;
  else if (project.status === 'advanced_exploration') score += 5;
  if (project.riskProfile.securityScore && project.riskProfile.securityScore < 30) score -= 10;
  if (project.permits.length > 0) score += 5;
  return Math.min(99, Math.max(10, Math.round(score)));
}

function statusLabel(status: string): string {
  return status.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}

export default function ProjectEvaluator() {
  const [selectedId, setSelectedId] = useState<string>(DRC_PROJECTS[0]?.projectId || '');
  const [activeTab, setActiveTab] = useState('legal');
  const [selectorOpen, setSelectorOpen] = useState(false);

  const project = useMemo(() => DRC_PROJECTS.find(p => p.projectId === selectedId) || DRC_PROJECTS[0], [selectedId]);
  const score = useMemo(() => project ? computeScore(project) : 0, [project]);

  const tabs = [
    { id: 'legal', label: 'Legal/Tenure', icon: ScrollText },
    { id: 'exploration', label: 'Exploration', icon: FlaskConical },
    { id: 'permitting', label: 'Permitting+ESG', icon: Shield },
    { id: 'operations', label: 'Operations', icon: Pickaxe },
  ];

  if (!project) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 pb-0">
        {/* Project Selector */}
        <div className="relative mb-4">
          <button
            onClick={() => setSelectorOpen(!selectorOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="text-left">
              <div className="text-xs text-gold-400 font-mono tracking-widest">{project.projectId}</div>
              <div className="text-lg font-light text-white">{project.name}</div>
              <div className="text-xs text-text-muted">{project.location.province} &bull; {statusLabel(project.status)}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-gold-400/30 flex items-center justify-center text-gold-400 font-mono text-lg gold-glow bg-gold-400/5">
                {score}
              </div>
              <ChevronDown size={16} className={`text-gray-400 transition-transform ${selectorOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {selectorOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 z-50 max-h-64 overflow-y-auto glass-panel rounded-xl border border-white/10 bg-bg-surface/95 backdrop-blur-xl shadow-xl">
              {DRC_PROJECTS.map((p) => (
                <button
                  key={p.projectId}
                  onClick={() => { setSelectedId(p.projectId); setSelectorOpen(false); }}
                  className={`w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center justify-between ${
                    p.projectId === selectedId ? 'bg-gold-400/10' : ''
                  }`}
                >
                  <div>
                    <div className="text-sm text-white">{p.name}</div>
                    <div className="text-[10px] text-gray-400">{p.location.province} &bull; {p.operator}</div>
                  </div>
                  <span className="text-xs font-mono text-gray-500">{p.projectId}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 border-b border-white/5 pb-4 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 relative overflow-hidden flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gold-400/10 text-gold-400 border border-gold-400/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                    : 'bg-white/5 text-text-muted hover:text-white border border-white/5 hover:bg-white/10'
                }`}
              >
                {activeTab === tab.id && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent synthetic-energy" />}
                <Icon size={14} strokeWidth={1} className="relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'legal' && (
          <div className="flex flex-col gap-6">
            <div className="glass-panel synthetic-energy p-5 rounded-xl">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Calendar size={16} strokeWidth={1} className="text-gold-400 icon-shine" /> Compliance Cockpit
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} strokeWidth={1} className="text-green-400 icon-shine" />
                    <div>
                      <div className="text-sm text-white">Surface Rights Fee</div>
                      <div className="text-xs text-text-muted">Paid for 2025</div>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-gray-400">Mar 15, 2025</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gold-400/10 rounded-lg border border-gold-400/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent synthetic-energy" />
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-4 h-4 rounded-full border-2 border-gold-400 border-t-transparent animate-spin" />
                    <div>
                      <div className="text-sm text-gold-400">Environmental Audit</div>
                      <div className="text-xs text-gold-400/70">Due in 45 days</div>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-gold-400 relative z-10">May 01, 2026</div>
                </div>
              </div>
            </div>

            <div className="glass-panel synthetic-energy p-5 rounded-xl">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <FileText size={16} strokeWidth={1} className="text-gold-400 icon-shine" /> Permit Registry
              </h3>
              {project.permits.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {project.permits.map((permit, i) => (
                    <div key={i} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10">
                      <div className="flex items-center gap-3">
                        <FileText size={14} strokeWidth={1} className="text-text-muted icon-shine" />
                        <div className="text-sm text-gray-200">{permit}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No permits on file for this project.</p>
              )}
            </div>

            <div className="glass-panel synthetic-energy p-5 rounded-xl">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <DollarSign size={16} strokeWidth={1} className="text-gold-400 icon-shine" /> Cost Simulation (Legal)
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Renewal Fees</span>
                    <span className="text-white font-mono">$45,000</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gold-400 h-full rounded-full w-[60%] relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent synthetic-energy" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Local Counsel Retainer</span>
                    <span className="text-white font-mono">$12,000/mo</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-white h-full rounded-full w-[30%] relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent synthetic-energy" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'exploration' && (
          <div className="flex flex-col gap-6">
            <div className="glass-panel synthetic-energy p-5 rounded-xl">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <FlaskConical size={16} strokeWidth={1} className="text-gold-400 icon-shine" /> Resource Summary
              </h3>
              {project.resources.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {project.resources.map((res, i) => (
                    <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gold-400 font-mono uppercase">{res.standard} &bull; {res.category}</span>
                        <span className="text-xs text-gray-400">{res.asOf}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <div className="text-[10px] text-gray-500 uppercase">Tonnes</div>
                          <div className="text-sm text-white font-mono">{res.tonnes ? `${(res.tonnes / 1e6).toFixed(1)}Mt` : 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-500 uppercase">Grade (g/t Au)</div>
                          <div className="text-sm text-white font-mono">{res.gradeGptAu?.toFixed(2) || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-500 uppercase">Contained</div>
                          <div className="text-sm text-white font-mono">{res.containedOz ? `${(res.containedOz / 1e6).toFixed(2)}Moz` : 'N/A'}</div>
                        </div>
                      </div>
                      {res.notes && <p className="text-[10px] text-gray-400 mt-2">{res.notes}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No resource estimates available for this project.</p>
              )}
            </div>

            <div className="glass-panel synthetic-energy p-5 rounded-xl">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Geology & Deposit</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] text-gray-500 uppercase mb-1">Deposit Type</div>
                  <div className="text-sm text-white">{project.depositType || 'Not specified'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase mb-1">Mining Method</div>
                  <div className="text-sm text-white">{project.miningMethod || 'Not specified'}</div>
                </div>
              </div>
              {project.geology && (
                <div className="mt-3">
                  <div className="text-[10px] text-gray-500 uppercase mb-1">Geological Summary</div>
                  <p className="text-xs text-gray-300 leading-relaxed">{project.geology}</p>
                </div>
              )}
            </div>

            {project.recentActivity.filter(a => a.type === 'drilling').length > 0 && (
              <div className="glass-panel synthetic-energy p-5 rounded-xl">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Recent Drilling Activity</h3>
                <div className="flex flex-col gap-2">
                  {project.recentActivity.filter(a => a.type === 'drilling').map((act, i) => (
                    <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex justify-between">
                        <span className="text-xs text-white">{act.summary}</span>
                        <span className="text-[10px] text-gray-500 font-mono">{act.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'permitting' && (
          <div className="flex flex-col gap-6">
            <div className="glass-panel synthetic-energy p-5 rounded-xl">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Shield size={16} strokeWidth={1} className="text-gold-400 icon-shine" /> Risk Profile
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Security', value: project.riskProfile.securityScore, max: 100 },
                  { label: 'Logistics', value: project.riskProfile.logisticsScore, max: 100 },
                  { label: 'ESG', value: project.riskProfile.esgScore, max: 100 },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3 bg-white/5 rounded-lg border border-white/10 text-center">
                    <div className="text-lg font-mono text-white">{value ?? 'N/A'}</div>
                    <div className="text-[10px] text-gray-500 uppercase">{label}</div>
                  </div>
                ))}
              </div>
              {project.riskProfile.notes && (
                <p className="text-xs text-gray-400 mt-3">{project.riskProfile.notes}</p>
              )}
            </div>

            <div className="glass-panel synthetic-energy p-5 rounded-xl">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <AlertTriangle size={16} strokeWidth={1} className="text-gold-400 icon-shine" /> Artisanal Mining Overlay
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-[10px] text-gray-500 uppercase mb-1">ASM Present</div>
                  <div className="text-sm text-white">{project.artisanalOverlay.present ? 'Yes' : 'No'}</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-[10px] text-gray-500 uppercase mb-1">Scale</div>
                  <div className="text-sm text-white capitalize">{project.artisanalOverlay.scale}</div>
                </div>
              </div>
              {project.artisanalOverlay.estimatedMiners && (
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 mb-3">
                  <div className="text-[10px] text-gray-500 uppercase mb-1">Estimated Miners</div>
                  <div className="text-sm text-white font-mono">{project.artisanalOverlay.estimatedMiners.toLocaleString()}</div>
                </div>
              )}
              {project.artisanalOverlay.notes && (
                <p className="text-xs text-gray-400">{project.artisanalOverlay.notes}</p>
              )}
            </div>

            <div className="glass-panel synthetic-energy p-5 rounded-xl">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Local Context</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-[10px] text-gray-500 uppercase mb-1">Security Level</div>
                  <div className={`text-sm font-medium capitalize ${
                    project.localContext.securityLevel === 'critical' ? 'text-red-400' :
                    project.localContext.securityLevel === 'high' ? 'text-orange-400' :
                    project.localContext.securityLevel === 'medium' ? 'text-yellow-400' : 'text-green-400'
                  }`}>{project.localContext.securityLevel}</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-[10px] text-gray-500 uppercase mb-1">Languages</div>
                  <div className="text-xs text-white">{project.localContext.languages.join(', ')}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'operations' && (
          <div className="flex flex-col gap-6">
            <div className="glass-panel synthetic-energy p-5 rounded-xl">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <MapPin size={16} strokeWidth={1} className="text-gold-400 icon-shine" /> Access & Logistics
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-[10px] text-gray-500 uppercase mb-1">Nearest City</div>
                  <div className="text-sm text-white">{project.accessInfo.nearestCity}</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-[10px] text-gray-500 uppercase mb-1">Distance</div>
                  <div className="text-sm text-white font-mono">{project.accessInfo.distanceKm ? `${project.accessInfo.distanceKm} km` : 'N/A'}</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-[10px] text-gray-500 uppercase mb-1">Airstrip</div>
                  <div className="text-sm text-white">{project.accessInfo.airstrip ? 'Available' : 'None'}</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-[10px] text-gray-500 uppercase mb-1">Road Condition</div>
                  <div className="text-sm text-white capitalize">{project.accessInfo.roadCondition || 'Unknown'}</div>
                </div>
              </div>
              {project.accessInfo.logisticsNotes && (
                <p className="text-xs text-gray-400">{project.accessInfo.logisticsNotes}</p>
              )}
            </div>

            <div className="glass-panel synthetic-energy p-5 rounded-xl">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Pickaxe size={16} strokeWidth={1} className="text-gold-400 icon-shine" /> Production Data
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-[10px] text-gray-500 uppercase mb-1">Status</div>
                  <div className="text-sm text-white">{statusLabel(project.status)}</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-[10px] text-gray-500 uppercase mb-1">Annual Production</div>
                  <div className="text-sm text-white font-mono">{project.annualProductionKoz ? `${project.annualProductionKoz} koz` : 'N/A'}</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-[10px] text-gray-500 uppercase mb-1">Total Resource</div>
                  <div className="text-sm text-white font-mono">{project.totalResourceMoz ? `${project.totalResourceMoz} Moz` : 'N/A'}</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-[10px] text-gray-500 uppercase mb-1">Avg Grade</div>
                  <div className="text-sm text-white font-mono">{project.averageGrade ? `${project.averageGrade} g/t` : 'N/A'}</div>
                </div>
              </div>
            </div>

            {project.recentActivity.length > 0 && (
              <div className="glass-panel synthetic-energy p-5 rounded-xl">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Recent Activity</h3>
                <div className="flex flex-col gap-2">
                  {project.recentActivity.slice(0, 5).map((act, i) => (
                    <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <span className="text-[10px] text-gold-400 font-mono uppercase">{act.type}</span>
                          <p className="text-xs text-gray-300 mt-0.5">{act.summary}</p>
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono ml-3 shrink-0">{act.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
