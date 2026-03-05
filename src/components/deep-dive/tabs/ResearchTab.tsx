import { useState, useRef, useEffect } from 'react';
import { Search, Loader2, Bot, Lightbulb, Shield, Mountain, Scale, Database } from 'lucide-react';
import { useDeepDive } from '@/hooks/useDeepDive';
import { useAgentChat } from '@/hooks/useAgentChat';
import { getTargetName, getTargetProvince } from '@/lib/types/deep-dive';

const QUICK_ACTIONS = [
  { icon: Mountain, label: 'Geological Assessment', prompt: (name: string) => `Provide a detailed geological assessment for ${name}. Cover deposit type, mineralization style, regional geology, and analogous deposits.` },
  { icon: Shield, label: 'Risk Analysis', prompt: (name: string) => `Perform a comprehensive risk analysis for ${name}. Cover security, political, environmental, legal, and operational risks. Rate each as Low/Medium/High.` },
  { icon: Scale, label: 'Legal & Regulatory', prompt: (name: string) => `Analyze the legal and regulatory landscape for ${name}. Cover DRC mining code compliance, permit status, and any regulatory risks.` },
  { icon: Database, label: 'Data Gaps', prompt: (name: string) => `Identify all critical data gaps for ${name}. What additional surveys, studies, or data collection is needed before investment?` },
  { icon: Lightbulb, label: 'Investment Thesis', prompt: (name: string) => `Build a concise investment thesis for ${name}. Cover the bull case, bear case, and key catalysts. What would make this a compelling investment?` },
];

export default function ResearchTab() {
  const { target } = useDeepDive();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const name = target ? getTargetName(target) : '';
  const province = target ? getTargetProvince(target) : '';
  const projectId = target?.type === 'project' ? target.data.projectId : target?.data.id ?? null;

  const { messages, isStreaming, sendMessage } = useAgentChat({
    agentId: 'deep-dive-research',
    context: { projectId, province },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleQuickAction = (prompt: string) => {
    if (isStreaming) return;
    sendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      {/* Quick Action Buttons */}
      <div className="border-b border-white/10 p-4 shrink-0 bg-black/20">
        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-3">Quick Research</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => handleQuickAction(action.prompt(name))}
                disabled={isStreaming}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-gold-400 hover:border-gold-400/30 hover:bg-gold-400/5 transition-colors disabled:opacity-30"
              >
                <Icon size={12} strokeWidth={1.5} />
                {action.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Search size={32} className="text-gray-600 mb-3" />
            <p className="text-sm text-gray-400">Click a research topic above to start</p>
            <p className="text-[10px] text-gray-600 mt-1">AI-powered analysis of {name}</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`${msg.role === 'user' ? 'mb-1' : ''}`}>
            {msg.role === 'user' ? (
              <div className="flex items-center gap-2 text-xs text-gold-400 font-medium mb-2">
                <Search size={12} />
                <span>Researching...</span>
              </div>
            ) : (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-gold-400/10 border border-gold-400/30 flex items-center justify-center shrink-0 mt-1">
                  <Bot size={14} className="text-gold-400" />
                </div>
                <div className="flex-1 p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {msg.text || (msg.streaming && (
                    <Loader2 size={14} className="animate-spin text-gold-400" />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
