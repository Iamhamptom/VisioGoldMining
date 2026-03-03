import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Send, User, Sparkles, ChevronDown, Crosshair, Eye, Radio, FileCheck, Plane, Languages, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { usePursuit } from '../hooks/usePursuitContext';
import { DRC_PROJECTS } from '../data/drc-projects';
import { useAgentChat, type ChatMessage } from '../hooks/useAgentChat';
import { extractContext } from '../lib/agents/agent-framework';
import { getProjectPursuitResponse } from '../lib/agents/project-pursuit-agent';
import { getLocalIntelResponse } from '../lib/agents/local-intel-agent';
import { getResearchDispatchResponse } from '../lib/agents/research-dispatch-agent';
import { getPaperworkResponse } from '../lib/agents/paperwork-agent';
import { getTripPlanningResponse } from '../lib/agents/trip-planning-agent';
import { getLanguageResponse } from '../lib/agents/language-agent';

type AgentId = 'general' | 'pursuit' | 'local-intel' | 'research' | 'paperwork' | 'trip' | 'language';

interface AgentDef {
  id: AgentId;
  name: string;
  icon: React.ElementType;
  color: string;
  greeting: string;
}

const AGENTS: AgentDef[] = [
  { id: 'general', name: 'VisioGold Agent', icon: Sparkles, color: '#D4AF37', greeting: 'Welcome to VisioGold DRC. I am your AI mining intelligence agent powered by Claude. Ask me anything about DRC gold projects, regulations, logistics, or opportunities.' },
  { id: 'pursuit', name: 'Project Pursuit', icon: Crosshair, color: '#D4AF37', greeting: 'I can guide you through every phase of a mining project lifecycle in the DRC. Which project would you like to pursue?' },
  { id: 'local-intel', name: 'Local Intel', icon: Eye, color: '#4488FF', greeting: 'I have intelligence on every major mining region in the DRC. Ask me about security, culture, infrastructure, or artisanal mining in any province.' },
  { id: 'research', name: 'Research Dispatch', icon: Radio, color: '#00FF88', greeting: 'I can help plan field research campaigns — dispatching teams, collecting samples, and coordinating logistics on the ground. Where should we deploy?' },
  { id: 'paperwork', name: 'Regulatory', icon: FileCheck, color: '#FF8800', greeting: 'I know the DRC Mining Code 2018 and CAMI permit system inside and out. What regulatory question do you have?' },
  { id: 'trip', name: 'Trip Planner', icon: Plane, color: '#A78BFA', greeting: 'Let me plan your trip to any DRC project site. I handle flights, ground transport, accommodation, and security arrangements.' },
  { id: 'language', name: 'Language', icon: Languages, color: '#FF6B9D', greeting: 'I can translate between French, Swahili, Lingala, and English, and provide cultural communication guidance for DRC engagement.' },
];

// Fallback to keyword matching when API is unavailable
function getLocalFallback(agentId: string, message: string): string {
  const ctx = extractContext(message);
  switch (agentId) {
    case 'pursuit':
      return getProjectPursuitResponse(message, { projectId: ctx.projectId, currentPhase: ctx.currentPhase }).content;
    case 'local-intel':
      return getLocalIntelResponse(message, { province: ctx.province, territory: ctx.province }).content;
    case 'research':
      return getResearchDispatchResponse(message, { activeTaskCount: ctx.activeTaskCount }).content;
    case 'paperwork':
      return getPaperworkResponse(message, { permitType: ctx.permitType, currentStep: ctx.currentStep }).content;
    case 'trip':
      return getTripPlanningResponse(message, { destination: ctx.destination || ctx.province, teamSize: ctx.teamSize }).content;
    case 'language':
      return getLanguageResponse(message, { targetLanguage: ctx.targetLanguage }).content;
    default:
      return 'I can help with DRC gold mining intelligence. Try asking about a specific project, region, or topic.';
  }
}

// Markdown components styled for chat
const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => <p className="mb-2 last:mb-0">{children}</p>,
  h1: ({ children }: { children?: React.ReactNode }) => <h1 className="text-sm font-bold text-white mb-2">{children}</h1>,
  h2: ({ children }: { children?: React.ReactNode }) => <h2 className="text-xs font-bold text-white mb-1.5">{children}</h2>,
  h3: ({ children }: { children?: React.ReactNode }) => <h3 className="text-xs font-semibold text-white mb-1">{children}</h3>,
  ul: ({ children }: { children?: React.ReactNode }) => <ul className="list-disc list-inside mb-2 space-y-0.5">{children}</ul>,
  ol: ({ children }: { children?: React.ReactNode }) => <ol className="list-decimal list-inside mb-2 space-y-0.5">{children}</ol>,
  li: ({ children }: { children?: React.ReactNode }) => <li className="text-xs">{children}</li>,
  strong: ({ children }: { children?: React.ReactNode }) => <strong className="text-white font-semibold">{children}</strong>,
  code: ({ children }: { children?: React.ReactNode }) => <code className="bg-white/10 px-1 py-0.5 rounded text-gold-400 text-[10px] font-mono">{children}</code>,
  table: ({ children }: { children?: React.ReactNode }) => <table className="w-full text-xs border-collapse mb-2">{children}</table>,
  th: ({ children }: { children?: React.ReactNode }) => <th className="text-left text-gold-400 border-b border-white/10 pb-1 pr-3 text-[10px] uppercase">{children}</th>,
  td: ({ children }: { children?: React.ReactNode }) => <td className="py-1 pr-3 border-b border-white/5">{children}</td>,
};

export default function ChatAgent() {
  const { pursuit } = usePursuit();
  const [activeAgent, setActiveAgent] = useState<AgentId>('general');
  const [agentMenuOpen, setAgentMenuOpen] = useState(false);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentAgent = AGENTS.find(a => a.id === activeAgent)!;

  const context = useMemo(() => ({
    projectId: pursuit.activeProjectId,
    province: pursuit.pursuitActive && pursuit.activeProjectId
      ? DRC_PROJECTS.find(p => p.projectId === pursuit.activeProjectId)?.location.province
      : null,
    phase: pursuit.activePhase,
  }), [pursuit.activeProjectId, pursuit.pursuitActive, pursuit.activePhase]);

  const fallback = useCallback((id: string, msg: string) => getLocalFallback(id, msg), []);

  const {
    messages,
    setMessages,
    isStreaming,
    sendMessage,
    addSystemMessage,
    stopStreaming,
  } = useAgentChat({
    agentId: activeAgent,
    context,
    initialMessages: [{ role: 'assistant', text: currentAgent.greeting, agentId: activeAgent }],
    fallbackFn: fallback,
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // When pursuit becomes active, inject context
  const prevPursuitRef = useRef(pursuit.pursuitActive);
  useEffect(() => {
    if (pursuit.pursuitActive && !prevPursuitRef.current && pursuit.activeProjectId) {
      const project = DRC_PROJECTS.find(p => p.projectId === pursuit.activeProjectId);
      if (project) {
        addSystemMessage(`Pursuit mode active for **${project.name}** (${project.location.province}). All agents now have context on this project. Phase ${pursuit.activePhase + 1} — ${project.status.replace(/_/g, ' ')}. Ask me anything about this project.`);
      }
    }
    prevPursuitRef.current = pursuit.pursuitActive;
  }, [pursuit.pursuitActive, pursuit.activeProjectId, pursuit.activePhase, addSystemMessage]);

  const switchAgent = (id: AgentId) => {
    setActiveAgent(id);
    setAgentMenuOpen(false);
    const agent = AGENTS.find(a => a.id === id)!;

    let greeting = agent.greeting;
    if (pursuit.pursuitActive && pursuit.activeProjectId) {
      const project = DRC_PROJECTS.find(p => p.projectId === pursuit.activeProjectId);
      if (project) {
        const contextGreetings: Record<string, string> = {
          pursuit: `Active pursuit: ${project.name}. Currently in Phase ${pursuit.activePhase + 1}. I can advise on tasks, costs, risks, and next steps for this phase.`,
          'local-intel': `Intelligence loaded for ${project.location.province}. ${project.name} is located near ${project.accessInfo.nearestCity}. Ask me about security, culture, or infrastructure in this area.`,
          research: `Ready to deploy research teams near ${project.name} in ${project.location.province}. What field data do you need collected?`,
          paperwork: `Regulatory context: ${project.name} has permits: ${project.permits.length > 0 ? project.permits.join(', ') : 'none on file'}. Current status: ${project.status.replace(/_/g, ' ')}. How can I help with regulatory matters?`,
          trip: `Trip planning ready for ${project.name} in ${project.location.province}. Nearest city: ${project.accessInfo.nearestCity}${project.accessInfo.distanceKm ? ` (${project.accessInfo.distanceKm} km)` : ''}. Airstrip: ${project.accessInfo.airstrip ? 'Available' : 'Not available'}.`,
          language: `Languages spoken near ${project.name}: ${project.localContext.languages.join(', ')}. I can help with translations, greetings, and cultural protocols for engagement in this area.`,
        };
        greeting = contextGreetings[id] || greeting;
      }
    }

    setMessages(prev => [...prev, { role: 'assistant', text: greeting, agentId: id }]);
  };

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    sendMessage(input);
    setInput('');
  };

  const pursuitProject = pursuit.pursuitActive && pursuit.activeProjectId
    ? DRC_PROJECTS.find(p => p.projectId === pursuit.activeProjectId)
    : null;

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Header with Agent Selector */}
      <div className="p-4 border-b border-white/5 bg-bg-surface/40 relative">
        <button
          onClick={() => setAgentMenuOpen(!agentMenuOpen)}
          className="flex items-center gap-3 w-full hover:bg-white/5 rounded-xl p-1.5 -m-1.5 transition-colors"
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center border"
            style={{ backgroundColor: `${currentAgent.color}15`, borderColor: `${currentAgent.color}40` }}
          >
            <currentAgent.icon size={20} strokeWidth={1} style={{ color: currentAgent.color }} className="icon-shine" />
          </div>
          <div className="flex-1 text-left">
            <h2 className="font-medium text-sm tracking-wide text-white">{currentAgent.name}</h2>
            <p className="text-[10px] flex items-center gap-1.5 uppercase tracking-widest mt-0.5" style={{ color: currentAgent.color }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: currentAgent.color }} />
              AI-Powered
            </p>
          </div>
          <ChevronDown size={14} className={`text-gray-500 transition-transform ${agentMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {agentMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute left-3 right-3 top-full mt-1 premium-glass border border-white/10 rounded-xl shadow-gold-md z-50 overflow-hidden"
            >
              {AGENTS.map((agent) => {
                const Icon = agent.icon;
                return (
                  <button
                    key={agent.id}
                    onClick={() => switchAgent(agent.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors ${
                      activeAgent === agent.id ? 'bg-white/5' : ''
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${agent.color}15` }}
                    >
                      <Icon size={14} style={{ color: agent.color }} />
                    </div>
                    <span className="text-xs text-gray-300">{agent.name}</span>
                    {activeAgent === agent.id && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: agent.color }} />
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pursuit Context Bar */}
      <AnimatePresence>
        {pursuitProject && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-2 bg-gold-400/5 border-b border-gold-400/20 flex items-center gap-2">
              <Crosshair size={10} className="text-gold-400" />
              <span className="text-[10px] text-gold-400 font-medium truncate">{pursuitProject.name}</span>
              <span className="text-[9px] text-gray-500">Phase {pursuit.activePhase + 1}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        <AnimatePresence initial={false}>
          {messages.map((msg: ChatMessage, idx: number) => {
            const msgAgent = AGENTS.find(a => a.id === msg.agentId) || currentAgent;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-white/5 border border-white/10' : ''
                }`}
                  style={msg.role === 'assistant' ? { backgroundColor: `${msgAgent.color}15`, border: `1px solid ${msgAgent.color}30` } : undefined}
                >
                  {msg.role === 'user' ? (
                    <User size={12} strokeWidth={1} className="text-gray-400" />
                  ) : (
                    <msgAgent.icon size={12} strokeWidth={1} style={{ color: msgAgent.color }} />
                  )}
                </div>
                <div className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[85%] shadow-lg ${
                  msg.role === 'user'
                    ? 'bg-white/10 text-white rounded-tr-sm border border-white/5 whitespace-pre-line'
                    : 'bg-black/80 border border-white/10 text-gray-300 rounded-tl-sm'
                }`}>
                  {msg.role === 'assistant' ? (
                    <div className="prose-chat">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents as never}>
                        {msg.text || ''}
                      </ReactMarkdown>
                      {msg.streaming && (
                        <span className="inline-block w-2 h-3 bg-gold-400 animate-pulse ml-0.5 rounded-sm" />
                      )}
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Streaming indicator */}
        {isStreaming && messages.length > 0 && messages[messages.length - 1]?.text === '' && (
          <div className="flex gap-2.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${currentAgent.color}15`, border: `1px solid ${currentAgent.color}30` }}
            >
              <currentAgent.icon size={12} strokeWidth={1} style={{ color: currentAgent.color }} />
            </div>
            <div className="p-3 rounded-2xl bg-black/80 border border-white/10 rounded-tl-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
                <span className="text-[10px] text-gray-500 ml-1">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/5 bg-bg-surface/60 backdrop-blur-md">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isStreaming ? 'AI is responding...' : `Ask ${currentAgent.name}...`}
            disabled={isStreaming}
            className="w-full bg-black/50 border border-white/10 rounded-full py-3 pl-5 pr-14 text-sm focus:outline-none focus:border-gold-400/50 text-white placeholder-gray-600 transition-colors shadow-inner disabled:opacity-50"
          />
          {isStreaming ? (
            <button
              onClick={stopStreaming}
              className="absolute right-2 w-9 h-9 rounded-full flex items-center justify-center bg-red-500/80 hover:bg-red-500 transition-colors shadow-lg"
              title="Stop generating"
            >
              <Square size={12} className="text-white" fill="white" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              className="absolute right-2 w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity shadow-lg"
              style={{ backgroundColor: currentAgent.color }}
            >
              <Send size={16} strokeWidth={1} className="ml-0.5 text-black icon-shine" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
