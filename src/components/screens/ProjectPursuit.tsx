import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Crosshair, ChevronRight, ChevronDown, Clock, DollarSign,
  Users, AlertTriangle, FileText, MapPin, CheckCircle2,
  Circle, ArrowRight, Building, Pickaxe, Mountain, Shield,
  Landmark, Banknote, HardHat, Leaf, Target, Search as SearchIcon,
  Eye, Globe,
} from 'lucide-react';
import { DRC_PROJECTS, type DRCProject } from '../../data/drc-projects';
import { usePursuit } from '../../hooks/usePursuitContext';
import { type RegionIntelligence, getIntelByProvince } from '../../data/drc-local-intel';

const phaseIcons = [SearchIcon, Target, Mountain, FileText, Landmark, Shield, Banknote, HardHat, Pickaxe, Leaf];
const phaseColors = ['#4488FF', '#A78BFA', '#00FF88', '#FFD700', '#FF8800', '#FF4444', '#D4AF37', '#4488FF', '#00FF88', '#8B7355'];

const PHASE_SUMMARIES = [
  { name: 'Reconnaissance & Desktop Study', duration: '1-3 months', cost: '$50K-$200K' },
  { name: 'Prospecting & Early Exploration', duration: '3-12 months', cost: '$500K-$3M' },
  { name: 'Advanced Exploration & Resource Definition', duration: '1-3 years', cost: '$5M-$30M' },
  { name: 'Pre-Feasibility Study', duration: '6-12 months', cost: '$2M-$8M' },
  { name: 'Definitive Feasibility Study', duration: '12-18 months', cost: '$10M-$30M' },
  { name: 'Permitting & Regulatory Approvals', duration: '12-36 months', cost: '$2M-$10M' },
  { name: 'Financing & Deal Structuring', duration: '6-18 months', cost: '$1M-$5M' },
  { name: 'Construction & Development', duration: '18-36 months', cost: '$100M-$1B+' },
  { name: 'Production & Operations', duration: '10-30+ years', cost: '$800-$1200/oz' },
  { name: 'Closure & Rehabilitation', duration: '3-10 years', cost: '$10M-$100M+' },
];

interface PursuitState {
  projectId: string;
  currentPhase: number;
  started: boolean;
}

export default function ProjectPursuit() {
  const { pursuit: sharedPursuit, endPursuit: endSharedPursuit, setPhase: setSharedPhase } = usePursuit();
  const [pursuit, setPursuit] = useState<PursuitState | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<number>(0);
  const [expandedSection, setExpandedSection] = useState<string | null>('overview');
  const [showIntel, setShowIntel] = useState(false);
  const projectsWithCoords = DRC_PROJECTS.filter(p => p.location.lat !== null);

  // Sync from shared pursuit context (e.g. when "Pursue" is clicked from the map)
  useEffect(() => {
    if (sharedPursuit.pursuitActive && sharedPursuit.activeProjectId) {
      setPursuit({
        projectId: sharedPursuit.activeProjectId,
        currentPhase: sharedPursuit.activePhase,
        started: true,
      });
    }
  }, [sharedPursuit.pursuitActive, sharedPursuit.activeProjectId, sharedPursuit.activePhase]);

  if (!pursuit) {
    return <ProjectSelector projects={projectsWithCoords} onSelect={(id) => {
      setPursuit({ projectId: id, currentPhase: 0, started: true });
      setSharedPhase(0);
    }} />;
  }

  const project = DRC_PROJECTS.find(p => p.projectId === pursuit.projectId);
  if (!project) return null;

  const regionIntelArr = getIntelByProvince(project.location.province);
  const regionIntel = regionIntelArr.length > 0 ? regionIntelArr[0] : null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-white/5 bg-black/40">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center gold-glow">
            <Crosshair size={20} className="text-gold icon-shine" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-white">{project.name}</h2>
            <p className="text-[10px] text-gold uppercase tracking-widest">Project Pursuit Active</p>
          </div>
          <div className="flex items-center gap-2">
            {regionIntel && (
              <button
                onClick={() => setShowIntel(!showIntel)}
                className={`text-[10px] px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${
                  showIntel ? 'text-blue-400 border-blue-400/30 bg-blue-500/10' : 'text-gray-500 border-white/10 hover:text-blue-400 hover:border-blue-400/30'
                }`}
              >
                <Eye size={10} />
                Intel
              </button>
            )}
            <button
              onClick={() => { setPursuit(null); endSharedPursuit(); }}
              className="text-[10px] text-gray-500 hover:text-red-400 px-3 py-1.5 rounded-lg border border-white/10 hover:border-red-400/30 transition-colors"
            >
              Exit Pursuit
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-1 mt-3">
          {PHASE_SUMMARIES.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-colors cursor-pointer ${
                i < pursuit.currentPhase ? 'bg-gold' :
                i === pursuit.currentPhase ? 'bg-gold/60 animate-pulse' :
                'bg-white/10'
              }`}
              onClick={() => { setSelectedPhase(i); setPursuit(prev => prev ? { ...prev, currentPhase: i } : null); setSharedPhase(i); }}
            />
          ))}
        </div>
        <p className="text-[10px] text-gray-500 mt-2">Phase {pursuit.currentPhase + 1} of 10</p>
      </div>

      {/* Phase Timeline / Intel */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {/* Local Intel Panel */}
          <AnimatePresence>
            {showIntel && regionIntel && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-4"
              >
                <RegionIntelPanel intel={regionIntel} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase Cards */}
          <div className="space-y-2">
            {PHASE_SUMMARIES.map((phase, i) => {
              const Icon = phaseIcons[i];
              const isActive = i === selectedPhase;
              const isCompleted = i < pursuit.currentPhase;
              const isCurrent = i === pursuit.currentPhase;

              return (
                <motion.div key={i} layout>
                  <button
                    onClick={() => setSelectedPhase(isActive ? -1 : i)}
                    className={`w-full text-left rounded-xl border transition-all duration-300 ${
                      isActive ? 'bg-black/60 border-gold/30 shadow-[0_0_20px_rgba(212,175,55,0.1)]' :
                      isCurrent ? 'bg-black/40 border-gold/20' :
                      isCompleted ? 'bg-black/20 border-green-500/20' :
                      'bg-black/20 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 p-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isCompleted ? 'bg-green-500/20' : isCurrent ? 'bg-gold/20' : 'bg-white/5'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 size={16} className="text-green-400" />
                        ) : (
                          <Icon size={16} style={{ color: phaseColors[i] }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-500 font-mono">P{i + 1}</span>
                          <span className={`text-xs font-medium truncate ${
                            isCompleted ? 'text-green-400' : isCurrent ? 'text-gold' : 'text-gray-300'
                          }`}>{phase.name}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-[10px] text-gray-500 flex items-center gap-1">
                            <Clock size={10} />{phase.duration}
                          </span>
                          <span className="text-[10px] text-gray-500 flex items-center gap-1">
                            <DollarSign size={10} />{phase.cost}
                          </span>
                        </div>
                      </div>
                      {isActive ? <ChevronDown size={14} className="text-gray-500" /> : <ChevronRight size={14} className="text-gray-500" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <PhaseDetail
                          phase={phase}
                          phaseIndex={i}
                          project={project}
                          expandedSection={expandedSection}
                          setExpandedSection={setExpandedSection}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectSelector({ projects, onSelect }: { projects: DRCProject[]; onSelect: (id: string) => void }) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-5 border-b border-white/5 bg-black/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center gold-glow">
            <Crosshair size={20} className="text-gold icon-shine" />
          </div>
          <div>
            <h2 className="font-semibold text-sm text-white">Project Pursuit</h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Select a project to pursue</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <p className="text-xs text-gray-400 mb-4">
          Choose a DRC gold project to begin a full lifecycle simulation. You will be guided through all 10 phases of mining project development.
        </p>

        {projects.map((project) => (
          <motion.button
            key={project.projectId}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelect(project.projectId)}
            className="w-full text-left p-4 rounded-xl bg-black/40 border border-white/5 hover:border-gold/30 transition-all duration-300 group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                <Pickaxe size={18} className="text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-white group-hover:text-gold transition-colors">{project.name}</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">{project.operator} &mdash; {project.location.province}</p>
                <div className="flex items-center gap-3 mt-2">
                  <StatusBadge status={project.status} />
                  {project.totalResourceMoz && (
                    <span className="text-[10px] text-gold font-mono">{project.totalResourceMoz} Moz</span>
                  )}
                  {project.averageGrade && (
                    <span className="text-[10px] text-gray-400">{project.averageGrade} g/t</span>
                  )}
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-600 group-hover:text-gold mt-1 transition-colors" />
            </div>
          </motion.button>
        ))}
      </div>
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

function PhaseDetail({ phase, phaseIndex, project, expandedSection, setExpandedSection }: {
  phase: { name: string; duration: string; cost: string };
  phaseIndex: number;
  project: DRCProject;
  expandedSection: string | null;
  setExpandedSection: (s: string | null) => void;
}) {
  const sections = [
    {
      id: 'overview',
      icon: Circle,
      label: 'Overview',
      content: getPhaseOverview(phaseIndex, project),
    },
    {
      id: 'tasks',
      icon: CheckCircle2,
      label: 'Key Tasks',
      content: getPhaseTasks(phaseIndex),
    },
    {
      id: 'team',
      icon: Users,
      label: 'Team Required',
      content: getPhaseTeam(phaseIndex),
    },
    {
      id: 'documents',
      icon: FileText,
      label: 'Documents',
      content: getPhaseDocuments(phaseIndex),
    },
    {
      id: 'risks',
      icon: AlertTriangle,
      label: 'Key Risks',
      content: getPhaseRisks(phaseIndex),
    },
    {
      id: 'drc',
      icon: MapPin,
      label: 'DRC-Specific',
      content: getPhaseDRC(phaseIndex),
    },
    {
      id: 'meetings',
      icon: Building,
      label: 'Key Meetings',
      content: getPhaseMeetings(phaseIndex),
    },
  ];

  return (
    <div className="px-3 pb-3 space-y-1 mt-1">
      {sections.map((section) => {
        const Icon = section.icon;
        const isExpanded = expandedSection === section.id;
        return (
          <div key={section.id}>
            <button
              onClick={() => setExpandedSection(isExpanded ? null : section.id)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs hover:bg-white/5 transition-colors"
            >
              <Icon size={12} className="text-gold" />
              <span className="text-gray-300">{section.label}</span>
              <ChevronRight size={12} className={`text-gray-500 ml-auto transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </button>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-3 pb-2 text-xs text-gray-400 leading-relaxed">
                    {section.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function getPhaseOverview(i: number, project: DRCProject): React.ReactNode {
  const overviews = [
    `Desktop analysis of ${project.name} in ${project.location.province}. Review satellite imagery, existing geological data, CAMI cadastre records, and generate exploration targets. Assess security and logistics for field access.`,
    `Field reconnaissance around ${project.name}. Stream sediment sampling, soil geochemistry, geological mapping, and ground geophysics. Assess artisanal mining activity and begin community engagement.`,
    `Drilling campaigns at ${project.name} — RC and diamond drilling to define resource. Core logging, assaying, resource estimation to JORC/NI 43-101 standard. Metallurgical testing and environmental baseline studies.`,
    `Preliminary mine design for ${project.name}. Process plant concept, capital and operating cost estimation, preliminary economic analysis. Environmental baseline completion.`,
    `Definitive engineering and bankable feasibility study for ${project.name}. Detailed mine plan, cost estimates, financial modeling, and complete ESIA.`,
    `Regulatory approvals for ${project.name}. PE application via CAMI, ESIA submission, cahier des charges with local communities, provincial approvals, and artisanal miner transition planning.`,
    `Secure project financing for ${project.name}. Structure JV/offtake, arrange debt and equity, negotiate government mining convention, insurance, and royalty agreements.`,
    `Build the mine at ${project.name}. Processing plant, tailings storage, power/water infrastructure, camp, roads. Equipment procurement and commissioning.`,
    `Full production operations at ${project.name}. Mining, processing, gold recovery. Ongoing brownfield exploration, community development, environmental monitoring, and continuous optimization.`,
    `Mine closure and land rehabilitation at ${project.name}. Progressive rehabilitation, decommissioning, post-closure monitoring, and community transition programs.`,
  ];
  return <p>{overviews[i]}</p>;
}

function getPhaseTasks(i: number): React.ReactNode {
  const tasks = [
    ['Literature & data review', 'Satellite imagery analysis', 'CAMI cadastre search', 'Target generation', 'Initial risk assessment', 'Stakeholder mapping'],
    ['Field geological mapping', 'Stream sediment sampling', 'Soil geochemistry', 'Ground geophysics (Mag/IP)', 'Trenching & pitting', 'Artisanal site survey'],
    ['RC drilling campaign', 'Diamond drilling', 'Core logging & assaying', 'Resource estimation (JORC)', 'Metallurgical testing', 'Bulk sampling', 'Environmental baseline'],
    ['Preliminary mine design', 'Process flow concept', 'CapEx/OpEx estimation', 'Economic analysis', 'Geotechnical investigation', 'Water balance study'],
    ['Definitive mine plan', 'Detailed engineering', 'Financial modeling', 'ESIA finalization', 'Bankable feasibility package', 'Ore reserve declaration'],
    ['PE application (CAMI)', 'ESIA submission & review', 'Cahier des charges signing', 'Provincial approvals', 'Artisanal miner resettlement', 'Water/forestry permits'],
    ['Project finance structuring', 'Offtake agreements', 'JV negotiations', 'Equity/debt raising', 'Mining convention', 'Insurance & hedging'],
    ['Site preparation', 'Process plant construction', 'TSF construction', 'Power infrastructure', 'Road/camp construction', 'Equipment commissioning'],
    ['Mining operations', 'Processing & recovery', 'Brownfield exploration', 'Community programs', 'Environmental monitoring', 'Reserve updates'],
    ['Progressive rehabilitation', 'Plant decommissioning', 'Water treatment', 'Land restoration', 'Community transition', 'Post-closure monitoring'],
  ];
  return (
    <ul className="space-y-1.5 mt-1">
      {tasks[i].map((task, j) => (
        <li key={j} className="flex items-center gap-2">
          <Circle size={6} className="text-gold shrink-0" />
          <span>{task}</span>
        </li>
      ))}
    </ul>
  );
}

function getPhaseTeam(i: number): React.ReactNode {
  const teams = [
    [{ role: 'Exploration Manager', count: 1 }, { role: 'GIS Analyst', count: 1 }, { role: 'Desktop Geologist', count: 1 }],
    [{ role: 'Field Geologists', count: 3 }, { role: 'Samplers/Technicians', count: 4 }, { role: 'Security Team', count: 3 }, { role: 'Community Liaison', count: 1 }],
    [{ role: 'Senior Geologist', count: 2 }, { role: 'Drilling Contractors', count: 10 }, { role: 'Core Loggers', count: 3 }, { role: 'Resource Modeler', count: 1 }, { role: 'Environmental Scientist', count: 1 }],
    [{ role: 'Mining Engineer', count: 2 }, { role: 'Process Engineer', count: 1 }, { role: 'Geotechnical Engineer', count: 1 }, { role: 'Economist', count: 1 }],
    [{ role: 'Full Engineering Team', count: 15 }, { role: 'Environmental Consultants', count: 3 }, { role: 'Financial Advisors', count: 2 }, { role: 'Legal Team', count: 3 }],
    [{ role: 'Legal Advisors', count: 3 }, { role: 'Community Liaison Officers', count: 4 }, { role: 'Environmental Managers', count: 2 }, { role: 'Government Relations', count: 2 }],
    [{ role: 'Investment Bankers', count: 2 }, { role: 'Legal Counsel', count: 3 }, { role: 'Financial Advisors', count: 2 }, { role: 'Corporate Team', count: 3 }],
    [{ role: 'Construction Manager', count: 1 }, { role: 'Civil Engineers', count: 5 }, { role: 'Mechanical/Electrical', count: 8 }, { role: 'HSE Team', count: 4 }, { role: 'Workforce', count: 500 }],
    [{ role: 'Mine Manager', count: 1 }, { role: 'Process Engineers', count: 4 }, { role: 'Geologists', count: 3 }, { role: 'HSE Team', count: 6 }, { role: 'Operations Staff', count: 1000 }],
    [{ role: 'Environmental Engineers', count: 3 }, { role: 'Rehabilitation Specialists', count: 2 }, { role: 'Community Team', count: 3 }],
  ];
  return (
    <div className="space-y-2 mt-1">
      {teams[i].map((member, j) => (
        <div key={j} className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users size={10} className="text-gold" />
            {member.role}
          </span>
          <span className="text-gold font-mono">{member.count >= 100 ? `${member.count}+` : `x${member.count}`}</span>
        </div>
      ))}
    </div>
  );
}

function getPhaseDocuments(i: number): React.ReactNode {
  const docs = [
    ['Desktop Study Report', 'Target Generation Report', 'Initial Risk Assessment'],
    ['PR Application (CAMI)', 'Field Reports', 'Geochemistry Results', 'Geophysical Survey Report'],
    ['NI 43-101 Technical Report', 'Resource Estimate', 'Metallurgical Test Report', 'Environmental Baseline Study'],
    ['PFS Report', 'Preliminary Mine Plan', 'Process Flow Diagrams', 'Economic Model'],
    ['DFS/BFS Report', 'Detailed Mine Plan', 'ESIA Report', 'Financial Model', 'Bankable Package'],
    ['PE Application', 'ESIA Approval', 'Cahier des Charges', 'Provincial Arrêté', 'Environmental Management Plan'],
    ['Term Sheet', 'Offtake Agreement', 'JV Agreement', 'Insurance Policies', 'Mining Convention'],
    ['Construction Permits', 'Building Plans', 'Procurement Contracts', 'Commissioning Reports', 'Safety Plan'],
    ['Quarterly Production Reports', 'Annual Resource Updates', 'Environmental Compliance', 'Community Reports'],
    ['Mine Closure Plan', 'Rehabilitation Bond', 'Post-Closure Monitoring Plan', 'Community Transition Plan'],
  ];
  return (
    <ul className="space-y-1.5 mt-1">
      {docs[i].map((doc, j) => (
        <li key={j} className="flex items-center gap-2">
          <FileText size={10} className="text-gold shrink-0" />
          <span>{doc}</span>
        </li>
      ))}
    </ul>
  );
}

function getPhaseRisks(i: number): React.ReactNode {
  const risks = [
    ['Insufficient data quality', 'Incorrect target prioritization', 'Security concerns in target area'],
    ['Community resistance', 'Artisanal miner conflicts', 'Poor road access', 'Security incidents'],
    ['Drilling below expectations', 'Cost overruns', 'Environmental non-compliance', 'Resource estimate downgrades'],
    ['Unfavorable economics', 'Metallurgical challenges', 'Geotechnical issues', 'Market downturn'],
    ['Engineering design failures', 'Cost escalation', 'Financing uncertainty', 'Regulatory changes'],
    ['CAMI delays', 'Community objections', 'Environmental agency rejections', 'Political interference'],
    ['Financing gap', 'Unfavorable terms', 'Partner withdrawal', 'Currency risk', 'Government renegotiation'],
    ['Construction delays', 'Cost overruns (30-50% typical)', 'Equipment procurement issues', 'Labor shortages'],
    ['Grade reconciliation', 'Equipment failures', 'Security disruptions', 'Gold price volatility'],
    ['Acid mine drainage', 'Inadequate closure bond', 'Community dependency', 'Regulatory enforcement'],
  ];
  return (
    <ul className="space-y-1.5 mt-1">
      {risks[i].map((risk, j) => (
        <li key={j} className="flex items-center gap-2">
          <AlertTriangle size={10} className="text-orange-400 shrink-0" />
          <span>{risk}</span>
        </li>
      ))}
    </ul>
  );
}

function getPhaseDRC(i: number): React.ReactNode {
  const items = [
    ['CAMI cadastre search for open ground', 'Ministry of Mines initial engagement', 'Security assessment for eastern provinces'],
    ['PR (Permis de Recherches) application — max 400 PE', 'Community engagement per Mining Code Art. 477', 'Artisanal miner census required'],
    ['PR renewal/extension at CAMI', 'EIES (Environmental Impact Study)', 'Community development agreement draft'],
    ['Cahier des charges obligation drafting', 'Infrastructure gap analysis for remote sites', 'DRC power supply assessment (SNEL)'],
    ['PE (Permis d\'Exploitation) application prep', 'Complete ESIA per DRC standards', 'Mining convention negotiation with government'],
    ['10% free-carried state interest (GÉCAMINES/SOKIMO)', 'DRC Mining Code 2018 compliance', 'Artisanal miner transition per Art. 109'],
    ['3.5% royalty on gold revenue', 'Super Profit Tax above thresholds', 'Capital repatriation rules per central bank'],
    ['Local content requirements (min 70% DRC staff)', 'Import duty negotiations', 'Infrastructure sharing with provincial government'],
    ['30% corporate income tax', '0.3% community development contribution', 'CEEC export certification for gold'],
    ['Closure bond per 2018 Mining Code', 'Land reversion to State', 'Artisanal mining re-access planning'],
  ];
  return (
    <ul className="space-y-1.5 mt-1">
      {items[i].map((item, j) => (
        <li key={j} className="flex items-center gap-2">
          <MapPin size={10} className="text-blue-400 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function getPhaseMeetings(i: number): React.ReactNode {
  const meetings = [
    ['CAMI Office — cadastre search & availability', 'Provincial Mining Division — regional briefing', 'Security advisors — threat assessment'],
    ['CAMI — PR application submission', 'Provincial Governor — introduction', 'Local Chiefs — land access consent', 'Artisanal cooperatives — census & engagement'],
    ['Ministry of Mines — technical review', 'Environmental agency (ACE) — baseline review', 'Drilling contractors — mobilization', 'Community assemblies — progress update'],
    ['International lenders — initial presentation', 'Equipment suppliers — preliminary quotes', 'Government technical reviewers'],
    ['World Bank / IFC — project presentation', 'Commercial banks — financing discussions', 'CAMI — PE preparation meeting', 'DRC government — convention negotiation'],
    ['CAMI Board — PE decision', 'Ministry of Mines — final approvals', 'Provincial Assembly — arrêté', 'Community assemblies — cahier des charges signing'],
    ['International banks — term sheets', 'Offtake buyers / refiners', 'DRC Central Bank — repatriation', 'Ministry of Finance — tax arrangements'],
    ['Construction contractors — awards', 'Equipment OEMs — procurement', 'Provincial Public Works — permits', 'Workforce recruitment agencies'],
    ['CAMI inspectors — compliance audits', 'DGI — tax filings', 'Community oversight committees', 'Refinery buyers — gold sales'],
    ['Environmental agency — closure review', 'Provincial government — land transfer', 'Affected communities — transition planning'],
  ];
  return (
    <ul className="space-y-1.5 mt-1">
      {meetings[i].map((meeting, j) => (
        <li key={j} className="flex items-center gap-2">
          <Building size={10} className="text-purple-400 shrink-0" />
          <span>{meeting}</span>
        </li>
      ))}
    </ul>
  );
}

function RegionIntelPanel({ intel }: { intel: RegionIntelligence | null }) {
  if (!intel) return null;

  const securityColors: Record<string, string> = {
    low: 'text-green-400 bg-green-500/10 border-green-500/20',
    medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    high: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    critical: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Eye size={14} className="text-blue-400" />
        <h3 className="text-xs font-semibold text-white uppercase tracking-widest">Local Intelligence — {intel.province}</h3>
      </div>

      {/* Security */}
      <div className={`p-3 rounded-xl border ${securityColors[intel.security.level]}`}>
        <div className="flex items-center gap-2 mb-2">
          <Shield size={12} />
          <span className="text-[10px] uppercase tracking-widest font-semibold">Security: {intel.security.level}</span>
        </div>
        {intel.security.armedGroups.length > 0 && (
          <p className="text-[10px] text-gray-400 mb-1.5">Known groups: {intel.security.armedGroups.join(', ')}</p>
        )}
        <ul className="space-y-1">
          {intel.security.recommendations.map((rec, i) => (
            <li key={i} className="text-[10px] text-gray-400 flex items-start gap-1.5">
              <AlertTriangle size={8} className="mt-0.5 shrink-0" />
              {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* Languages */}
      <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20">
        <p className="text-[10px] text-purple-400 uppercase tracking-widest mb-2 font-semibold">Languages</p>
        <div className="flex flex-wrap gap-1.5">
          {intel.languages.map((lang, i) => (
            <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
              {lang.name} ({lang.type})
            </span>
          ))}
        </div>
      </div>

      {/* Infrastructure */}
      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-semibold">Infrastructure</p>
        <div className="space-y-1.5 text-[10px] text-gray-400">
          {intel.infrastructure.airports.length > 0 && (
            <div className="flex items-start gap-1.5">
              <Globe size={9} className="text-blue-400 mt-0.5 shrink-0" />
              <span>{intel.infrastructure.airports.join('; ')}</span>
            </div>
          )}
          <div className="flex items-start gap-1.5">
            <MapPin size={9} className="text-blue-400 mt-0.5 shrink-0" />
            <span>{intel.infrastructure.roads.join('; ')}</span>
          </div>
          <div className="flex items-start gap-1.5">
            <Building size={9} className="text-blue-400 mt-0.5 shrink-0" />
            <span>Power: {intel.infrastructure.power}</span>
          </div>
        </div>
      </div>

      {/* Artisanal Mining */}
      <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/20">
        <p className="text-[10px] text-orange-400 uppercase tracking-widest mb-2 font-semibold">Artisanal Mining</p>
        <div className="space-y-1 text-[10px] text-gray-400">
          <p>Est. miners: <span className="text-orange-300 font-mono">{intel.artisanalMining.estimatedMiners.toLocaleString()}</span></p>
          <p>Minerals: {intel.artisanalMining.minerals.join(', ')}</p>
          <p>Cooperatives: {intel.artisanalMining.cooperatives.join(', ')}</p>
          <p>Conflict risk: <span className="text-orange-300">{intel.artisanalMining.conflictRisk}</span></p>
        </div>
      </div>

      {/* Accommodation */}
      {intel.accommodation.length > 0 && (
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-semibold">Accommodation</p>
          <div className="space-y-1.5">
            {intel.accommodation.map((acc, i) => (
              <div key={i} className="flex items-center justify-between text-[10px]">
                <span className="text-gray-300">{acc.name}</span>
                <span className="text-gold font-mono">{acc.priceRange}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Contacts */}
      {intel.keyContacts.length > 0 && (
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-semibold">Key Contacts</p>
          <div className="space-y-2">
            {intel.keyContacts.map((contact, i) => (
              <div key={i}>
                <p className="text-[10px] text-gold font-medium">{contact.role}</p>
                <p className="text-[10px] text-gray-400">{contact.description} — {contact.location}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
