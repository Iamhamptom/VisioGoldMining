import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { useDeepDive } from '@/hooks/useDeepDive';
import { useAgentChat } from '@/hooks/useAgentChat';
import { getTargetName, getTargetProvince } from '@/lib/types/deep-dive';

export default function AskAITab() {
  const { target } = useDeepDive();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const name = target ? getTargetName(target) : '';
  const province = target ? getTargetProvince(target) : '';
  const projectId = target?.type === 'project' ? target.data.projectId : target?.data.id ?? null;

  const { messages, isStreaming, sendMessage } = useAgentChat({
    agentId: 'deep-dive-ai',
    context: { projectId, province },
    initialMessages: [{
      role: 'assistant',
      text: `I'm your AI analyst for **${name}** in ${province}. Ask me anything about this ${target?.type === 'project' ? 'project' : 'opportunity'} — geology, risks, logistics, comparisons, or strategy.`,
      agentId: 'deep-dive-ai',
    }],
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-gold-400/10 border border-gold-400/30 flex items-center justify-center shrink-0 mt-1">
                <Bot size={14} className="text-gold-400" />
              </div>
            )}
            <div className={`max-w-[70%] px-4 py-3 rounded-xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-gold-400/15 border border-gold-400/20 text-white'
                : 'bg-white/5 border border-white/10 text-gray-300'
            }`}>
              {msg.text || (msg.streaming && (
                <Loader2 size={14} className="animate-spin text-gold-400" />
              ))}
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0 mt-1">
                <User size={14} className="text-gray-400" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/10 p-4 shrink-0 bg-black/20">
        <div className="flex items-center gap-3 max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask about ${name}...`}
            disabled={isStreaming}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-gold-400/40 transition-colors disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isStreaming || !input.trim()}
            className="p-3 rounded-xl bg-gold-400/15 border border-gold-400/30 text-gold-400 hover:bg-gold-400/25 transition-colors disabled:opacity-30"
          >
            {isStreaming ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
