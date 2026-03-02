import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, ChevronDown, Crosshair, Eye, Radio, FileCheck, Plane, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type AgentId = 'general' | 'pursuit' | 'local-intel' | 'research' | 'paperwork' | 'trip' | 'language';

interface AgentDef {
  id: AgentId;
  name: string;
  icon: React.ElementType;
  color: string;
  greeting: string;
}

const AGENTS: AgentDef[] = [
  { id: 'general', name: 'VisioGold Agent', icon: Sparkles, color: '#D4AF37', greeting: 'Welcome to VisioGold DRC. I am your mining intelligence agent. How can I assist you with your Kivu exploration or operations today?' },
  { id: 'pursuit', name: 'Project Pursuit', icon: Crosshair, color: '#D4AF37', greeting: 'I can guide you through every phase of a mining project lifecycle in the DRC. Which project would you like to pursue?' },
  { id: 'local-intel', name: 'Local Intel', icon: Eye, color: '#4488FF', greeting: 'I have intelligence on every major mining region in the DRC. Ask me about security, culture, infrastructure, or artisanal mining in any province.' },
  { id: 'research', name: 'Research Dispatch', icon: Radio, color: '#00FF88', greeting: 'I can dispatch local research teams to collect ground data, hire translators, and commission field work. Where should I deploy?' },
  { id: 'paperwork', name: 'Regulatory', icon: FileCheck, color: '#FF8800', greeting: 'I can navigate the DRC Mining Code 2018 and CAMI permit system for you. What regulatory question do you have?' },
  { id: 'trip', name: 'Trip Planner', icon: Plane, color: '#A78BFA', greeting: 'Let me plan your trip to any DRC project site. I handle flights, ground transport, accommodation, and security arrangements.' },
  { id: 'language', name: 'Language', icon: Languages, color: '#FF6B9D', greeting: 'I can translate between French, Swahili, Lingala, and English. I also provide cultural communication guidance for DRC engagement.' },
];

interface Message {
  role: 'user' | 'assistant';
  text: string;
  agentId: AgentId;
}

const AGENT_RESPONSES: Record<AgentId, string[]> = {
  general: [
    'Analyzing regional geological surveys and permit data for the requested area. I can see several active exploration permits in this zone.',
    'Based on current market intelligence, the DRC gold sector shows strong growth potential. Shall I pull up specific project data?',
    'I can see multiple layers of data for this region. Would you like me to focus on tenements, geology, or security events?',
  ],
  pursuit: [
    'For this project, I recommend starting with Phase 1: Reconnaissance & Desktop Study. This involves a CAMI cadastre search, satellite imagery analysis, and initial security assessment. Budget: $50K-$200K over 1-3 months.',
    'Based on the project\'s current status, the next critical milestone is completing the NI 43-101 resource estimate. This typically requires 6-12 months of drilling and costs $5-15M.',
    'Key risk for this phase: Community engagement must begin early. The DRC Mining Code requires a cahier des charges before exploitation permits can be granted.',
  ],
  'local-intel': [
    'Intelligence report for this region: Security level is MEDIUM. Primary languages: French (official), Swahili (widely spoken), plus local Nande/Lendu dialects. Infrastructure: Limited road access, nearest airstrip 45km away.',
    'Artisanal mining assessment: Approximately 12,000-18,000 artisanal miners operate in this area, organized into 5-7 cooperatives. Primary minerals: alluvial gold, some coltan. Conflict risk: MEDIUM-HIGH.',
    'Key companies operating nearby: Three drilling contractors, two environmental consultancies, and several logistics firms. I can provide contact details and service reviews.',
  ],
  research: [
    'Research dispatch order created: 3-person field team deployed. Team includes local geologist (Swahili/French bilingual), community liaison officer, and security escort. ETA: 48 hours. Budget: $8,500 for 2-week deployment.',
    'Field research update: Team has collected 45 soil samples, photographed 12 artisanal sites, and interviewed 23 local miners. Preliminary results show anomalous gold values in stream sediments. Full report in 5 days.',
    'I can commission additional ground work: options include detailed geological mapping ($5,000/week), geochemical sampling ($3,000/campaign), or community census ($2,500/territory).',
  ],
  paperwork: [
    'PR (Permis de Recherches) application via CAMI: Required documents include technical exploration program, financial capability proof, environmental commitment letter, and company registration (DRC entity required). Processing time: 60-90 days. Total fees: ~$15,000-$30,000.',
    'DRC Mining Code 2018 key obligations: 3.5% royalty on gold (paid quarterly), 30% corporate income tax, 10% free-carried State interest, 0.3% turnover to community development fund, ESIA required before exploitation.',
    'For PE conversion, you need: completed ESIA, bankable feasibility study, proof of financial capacity, cahier des charges signed with local communities, and endorsement from provincial mining division.',
  ],
  trip: [
    'Trip itinerary planned: Day 1: Kinshasa → Bunia (CAA/Congo Airways, departs 06:00, arrives 09:30). Day 2: Bunia → project site (4x4 convoy, 4-5 hours). Accommodation: Hotel Ituri in Bunia ($85/night). Security escort arranged through local provider.',
    'Alternative route via Goma: Kinshasa → Goma (daily flights), then Goma → Bunia overland (8 hours, security escort mandatory). This route gives option to visit South Kivu projects en route. Total trip cost estimate: $15,000-$22,000 for 5-person team, 7 days.',
    'Travel advisory: Carry copies of mining permits at all times. Register with MONUSCO if entering high-security zones. Satellite phone recommended. Malaria prophylaxis essential. Yellow fever certificate required.',
  ],
  language: [
    'Community greeting in Swahili: "Habari za asubuhi, wazee na viongozi wetu. Tunashukuru kwa nafasi ya kuongea nanyi leo." (Good morning, elders and leaders. We are grateful for the opportunity to speak with you today.)',
    'Cultural protocol: When addressing the chef de localité, use "Bwana Mkubwa" (respected chief). Present a small gift (locally sourced). Allow elders to speak first. Never rush to business — the greeting ceremony is essential for building trust.',
    'Employment announcement template in French: "Avis de recrutement — La société [Company] recherche des travailleurs qualifiés pour son projet minier situé à [Location]. Postes disponibles: [roles]. Candidatures ouvertes du [date] au [date]."',
  ],
};

export default function ChatAgent() {
  const [activeAgent, setActiveAgent] = useState<AgentId>('general');
  const [agentMenuOpen, setAgentMenuOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: AGENTS[0].greeting, agentId: 'general' },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const currentAgent = AGENTS.find(a => a.id === activeAgent)!;

  const switchAgent = (id: AgentId) => {
    setActiveAgent(id);
    setAgentMenuOpen(false);
    const agent = AGENTS.find(a => a.id === id)!;
    setMessages(prev => [...prev, { role: 'assistant', text: agent.greeting, agentId: id }]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input, agentId: activeAgent }]);
    setInput('');

    setTimeout(() => {
      const responses = AGENT_RESPONSES[activeAgent];
      const response = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { role: 'assistant', text: response, agentId: activeAgent }]);
    }, 600 + Math.random() * 800);
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Header with Agent Selector */}
      <div className="p-4 border-b border-white/5 bg-black/40 relative">
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
              Online
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
              className="absolute left-3 right-3 top-full mt-1 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
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

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => {
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
                <div className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[85%] shadow-lg whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-white/10 text-white rounded-tr-sm border border-white/5'
                    : 'bg-black/80 border border-white/10 text-gray-300 rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/5 bg-black/60 backdrop-blur-md">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask ${currentAgent.name}...`}
            className="w-full bg-black/50 border border-white/10 rounded-full py-3 pl-5 pr-14 text-sm focus:outline-none focus:border-gold/50 text-white placeholder-gray-600 transition-colors shadow-inner"
          />
          <button
            onClick={handleSend}
            className="absolute right-2 w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity shadow-lg"
            style={{ backgroundColor: currentAgent.color }}
          >
            <Send size={16} strokeWidth={1} className="ml-0.5 text-black icon-shine" />
          </button>
        </div>
      </div>
    </div>
  );
}
