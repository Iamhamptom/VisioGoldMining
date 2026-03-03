import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain, Crosshair, Eye, Radio, FileCheck, Plane, Languages,
  ChevronRight, Circle, Clock, CheckCircle2, AlertCircle,
  Send, Activity, Zap,
} from 'lucide-react';
import { usePursuit } from '../../hooks/usePursuitContext';
import { DRC_PROJECTS } from '../../data/drc-projects';
import { getProjectPursuitResponse } from '../../lib/agents/project-pursuit-agent';
import { getLocalIntelResponse } from '../../lib/agents/local-intel-agent';
import { getResearchDispatchResponse } from '../../lib/agents/research-dispatch-agent';
import { getPaperworkResponse } from '../../lib/agents/paperwork-agent';
import { getTripPlanningResponse } from '../../lib/agents/trip-planning-agent';
import { getLanguageResponse } from '../../lib/agents/language-agent';
import { extractContext } from '../../lib/agents/agent-framework';

type AgentId = 'pursuit' | 'local-intel' | 'research' | 'paperwork' | 'trip' | 'language';

interface AgentDef {
  id: AgentId;
  name: string;
  role: string;
  icon: React.ElementType;
  color: string;
  capabilities: string[];
  sampleQueries: string[];
}

interface Task {
  id: string;
  agentId: AgentId;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
}

const AGENT_DEFS: AgentDef[] = [
  {
    id: 'pursuit',
    name: 'Project Pursuit',
    role: 'Mining lifecycle guidance & project simulation',
    icon: Crosshair,
    color: '#D4AF37',
    capabilities: ['Phase-by-phase guidance', 'Cost estimation', 'Timeline planning', 'Risk assessment', 'Milestone tracking'],
    sampleQueries: ['What phase should I start with?', 'Estimate costs for Phase 3', 'What are the key risks?'],
  },
  {
    id: 'local-intel',
    name: 'Local Intelligence',
    role: 'Regional intelligence & data enrichment',
    icon: Eye,
    color: '#4488FF',
    capabilities: ['Security assessment', 'Cultural intelligence', 'Infrastructure analysis', 'Company identification', 'Artisanal mining'],
    sampleQueries: ['Security situation in Ituri?', 'Hotels near Mongbwalu?', 'Artisanal mining in South Kivu?'],
  },
  {
    id: 'research',
    name: 'Research Dispatch',
    role: 'Deploy & manage local research operatives',
    icon: Radio,
    color: '#00FF88',
    capabilities: ['Dispatch researchers', 'Manage field tasks', 'Collect ground data', 'Hire translators', 'Commission samples'],
    sampleQueries: ['Dispatch team to survey Kamituga', 'Hire local geologist in Bukavu', 'Collect water samples near Twangiza'],
  },
  {
    id: 'paperwork',
    name: 'Regulatory Agent',
    role: 'DRC Mining Code compliance & permits',
    icon: FileCheck,
    color: '#FF8800',
    capabilities: ['CAMI permits', 'Mining Code compliance', 'ESIA requirements', 'Tax obligations', 'Document prep'],
    sampleQueries: ['How to apply for PR?', 'What are gold royalty rates?', 'ESIA requirements for exploration?'],
  },
  {
    id: 'trip',
    name: 'Trip Planner',
    role: 'Travel logistics & meeting coordination',
    icon: Plane,
    color: '#A78BFA',
    capabilities: ['Flight routing', 'Ground transport', 'Accommodation', 'Meeting scheduling', 'Security arrangements'],
    sampleQueries: ['Plan trip to Kibali from Kinshasa', 'Hotels in Bunia?', 'How to reach Namoya site?'],
  },
  {
    id: 'language',
    name: 'Language Agent',
    role: 'Translation & cultural communication',
    icon: Languages,
    color: '#FF6B9D',
    capabilities: ['French/Swahili/Lingala', 'Cultural etiquette', 'Community scripts', 'Hiring templates', 'Negotiation'],
    sampleQueries: ['Translate greeting to Swahili', 'Community meeting script', 'How to address a village chief?'],
  },
];

export default function AgentCommandCenter() {
  const { pursuit } = usePursuit();
  const [selectedAgent, setSelectedAgent] = useState<AgentId | null>(null);
  const [tasks] = useState<Task[]>([
    { id: '1', agentId: 'research', description: 'Survey artisanal sites near Kamituga', status: 'in_progress', createdAt: '2024-12-15' },
    { id: '2', agentId: 'local-intel', description: 'Security assessment for Ituri province', status: 'completed', createdAt: '2024-12-14' },
    { id: '3', agentId: 'paperwork', description: 'PR application document review', status: 'pending', createdAt: '2024-12-16' },
  ]);

  const pursuitProject = pursuit.pursuitActive && pursuit.activeProjectId
    ? DRC_PROJECTS.find(p => p.projectId === pursuit.activeProjectId)
    : null;

  const agent = AGENT_DEFS.find(a => a.id === selectedAgent);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-white/5 bg-black/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
            <Brain size={20} className="text-purple-400 icon-shine" />
          </div>
          <div>
            <h2 className="font-semibold text-sm text-white">Agent Command Center</h2>
            <p className="text-[10px] text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              {AGENT_DEFS.length} agents online
            </p>
          </div>
        </div>

        {/* Pursuit Context */}
        {pursuitProject && (
          <div className="mt-3 px-3 py-2 rounded-lg bg-gold/5 border border-gold/20 flex items-center gap-2">
            <Crosshair size={10} className="text-gold" />
            <span className="text-[10px] text-gold font-medium truncate">Pursuit: {pursuitProject.name}</span>
            <span className="text-[9px] text-gray-500 ml-auto">Phase {pursuit.activePhase + 1}</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {!agent ? (
          <div className="p-4 space-y-4">
            {/* Agent System Status */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-gold/5 border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Activity size={14} className="text-purple-400" />
                <span className="text-xs text-gray-300 font-medium">System Status</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <span className="text-lg font-bold text-white">{AGENT_DEFS.length}</span>
                  <p className="text-[10px] text-gray-500">Active Agents</p>
                </div>
                <div className="text-center">
                  <span className="text-lg font-bold text-gold">{tasks.filter(t => t.status === 'in_progress').length}</span>
                  <p className="text-[10px] text-gray-500">Running Tasks</p>
                </div>
                <div className="text-center">
                  <span className="text-lg font-bold text-green-400">{tasks.filter(t => t.status === 'completed').length}</span>
                  <p className="text-[10px] text-gray-500">Completed</p>
                </div>
              </div>
            </div>

            {/* Agent Grid */}
            <div className="space-y-2">
              <h3 className="text-xs text-gray-400 uppercase tracking-wider px-1">Available Agents</h3>
              {AGENT_DEFS.map((agentDef) => {
                const Icon = agentDef.icon;
                const agentTasks = tasks.filter(t => t.agentId === agentDef.id);
                const activeTasks = agentTasks.filter(t => t.status === 'in_progress').length;
                return (
                  <motion.button
                    key={agentDef.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedAgent(agentDef.id)}
                    className="w-full text-left p-4 rounded-xl bg-black/40 border border-white/5 hover:border-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${agentDef.color}15`, borderColor: `${agentDef.color}30`, borderWidth: 1 }}
                      >
                        <Icon size={18} style={{ color: agentDef.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-white group-hover:text-gold transition-colors">{agentDef.name}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-0.5 truncate">{agentDef.role}</p>
                        {activeTasks > 0 && (
                          <p className="text-[10px] mt-1 flex items-center gap-1" style={{ color: agentDef.color }}>
                            <Zap size={10} />{activeTasks} active task{activeTasks > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                      <ChevronRight size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Recent Tasks */}
            {tasks.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs text-gray-400 uppercase tracking-wider px-1">Recent Tasks</h3>
                {tasks.map((task) => {
                  const agentDef = AGENT_DEFS.find(a => a.id === task.agentId);
                  return (
                    <div key={task.id} className="p-3 rounded-lg bg-black/30 border border-white/5">
                      <div className="flex items-center gap-2">
                        {task.status === 'completed' ? (
                          <CheckCircle2 size={12} className="text-green-400" />
                        ) : task.status === 'in_progress' ? (
                          <Clock size={12} className="text-gold animate-spin" />
                        ) : (
                          <Circle size={12} className="text-gray-500" />
                        )}
                        <span className="text-xs text-gray-300 flex-1">{task.description}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 ml-5">
                        <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: `${agentDef?.color}15`, color: agentDef?.color }}>
                          {agentDef?.name}
                        </span>
                        <span className="text-[9px] text-gray-600">{task.createdAt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <AgentDetail agent={agent} onBack={() => setSelectedAgent(null)} tasks={tasks.filter(t => t.agentId === agent.id)} projectId={pursuit.activeProjectId} phase={pursuit.activePhase} />
        )}
      </div>
    </div>
  );
}

function AgentDetail({ agent, onBack, tasks, projectId, phase }: { agent: AgentDef; onBack: () => void; tasks: Task[]; projectId?: string | null; phase?: number }) {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'agent'; text: string }[]>([
    { role: 'agent', text: `I'm the ${agent.name} agent. ${agent.role}. How can I assist you today?` },
  ]);

  const Icon = agent.icon;

  const handleSend = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      const ctx = extractContext(userMsg);
      if (projectId) ctx.projectId = projectId;
      if (phase !== undefined) ctx.currentPhase = phase;

      if (ctx.projectId) {
        const proj = DRC_PROJECTS.find(p => p.projectId === ctx.projectId);
        if (proj && !ctx.province) ctx.province = proj.location.province;
      }

      let response: string;
      switch (agent.id) {
        case 'pursuit':
          response = getProjectPursuitResponse(userMsg, { projectId: ctx.projectId, currentPhase: ctx.currentPhase }).content;
          break;
        case 'local-intel':
          response = getLocalIntelResponse(userMsg, { province: ctx.province, territory: ctx.province }).content;
          break;
        case 'research':
          response = getResearchDispatchResponse(userMsg, { activeTaskCount: ctx.activeTaskCount }).content;
          break;
        case 'paperwork':
          response = getPaperworkResponse(userMsg, { permitType: ctx.permitType, currentStep: ctx.currentStep }).content;
          break;
        case 'trip':
          response = getTripPlanningResponse(userMsg, { destination: ctx.destination || ctx.province, teamSize: ctx.teamSize }).content;
          break;
        case 'language':
          response = getLanguageResponse(userMsg, { targetLanguage: ctx.targetLanguage }).content;
          break;
        default:
          response = 'Processing your request...';
      }

      setMessages(prev => [...prev, { role: 'agent', text: response }]);
    }, 400 + Math.random() * 600);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Agent Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-gray-500 hover:text-white transition-colors text-xs">&larr; Back</button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${agent.color}15` }}>
              <Icon size={16} style={{ color: agent.color }} />
            </div>
            <div>
              <span className="text-xs font-medium text-white">{agent.name}</span>
              <p className="text-[10px] text-gray-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Online
              </p>
            </div>
          </div>
        </div>

        {/* Capabilities */}
        <div className="flex flex-wrap gap-1 mt-3">
          {agent.capabilities.map((cap, i) => (
            <span key={i} className="text-[9px] px-2 py-0.5 rounded-full border border-white/10 text-gray-400">{cap}</span>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed whitespace-pre-line ${
                msg.role === 'user'
                  ? 'bg-white/10 text-white rounded-tr-sm'
                  : 'bg-black/60 border border-white/5 text-gray-300 rounded-tl-sm'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Sample Queries */}
        {messages.length <= 1 && (
          <div className="mt-4 space-y-2">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Try asking:</p>
            {agent.sampleQueries.map((q, i) => (
              <button
                key={i}
                onClick={() => { setChatInput(q); }}
                className="block w-full text-left text-xs text-gray-400 hover:text-gold p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                &ldquo;{q}&rdquo;
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Active Tasks */}
      {tasks.length > 0 && (
        <div className="border-t border-white/5 p-3">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Active Tasks</p>
          {tasks.map(task => (
            <div key={task.id} className="flex items-center gap-2 text-xs text-gray-400 py-1">
              {task.status === 'completed' ? <CheckCircle2 size={10} className="text-green-400" /> :
               task.status === 'in_progress' ? <Clock size={10} className="text-gold" /> :
               <AlertCircle size={10} className="text-gray-500" />}
              <span className="truncate">{task.description}</span>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={`Ask ${agent.name}...`}
            className="flex-1 bg-black/50 border border-white/10 rounded-full py-2.5 px-4 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold/50"
          />
          <button
            onClick={handleSend}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: agent.color }}
          >
            <Send size={14} className="text-black ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
