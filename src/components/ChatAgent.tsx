import React, { useState } from 'react';
import { Send, Bot, User, Paperclip, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ChatAgent() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Welcome to VisioGold DRC. I am your mining intelligence agent. How can I assist you with your Kivu exploration or operations today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: 'Analyzing recent geological surveys and permit statuses in the requested region. Updating map layers now.' 
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="p-5 border-b border-white/5 flex items-center gap-4 bg-black/40">
        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center border border-gold/30 gold-glow">
          <Bot size={20} strokeWidth={1} className="text-gold icon-shine" />
        </div>
        <div>
          <h2 className="font-medium text-sm tracking-wide text-white">VisioGold Agent</h2>
          <p className="text-[10px] text-gold flex items-center gap-1.5 uppercase tracking-widest mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
            Online
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-white/5 border border-white/10' : 'bg-gold/10 border border-gold/30 gold-glow'
              }`} >
                {msg.role === 'user' ? <User size={14} strokeWidth={1} className="text-gray-400 icon-shine" /> : <Sparkles size={14} strokeWidth={1} className="text-gold icon-shine" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed max-w-[85%] shadow-lg ${
                msg.role === 'user' 
                  ? 'bg-white/10 text-white rounded-tr-sm border border-white/5' 
                  : 'bg-black/80 border border-white/10 text-gray-300 rounded-tl-sm'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-5 border-t border-white/5 bg-black/60 backdrop-blur-md">
        <div className="relative flex items-center">
          <button className="absolute left-4 text-gray-500 hover:text-gold transition-colors">
            <Paperclip size={18} strokeWidth={1} className="icon-shine" />
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about DRC permits..."
            className="w-full bg-black/50 border border-white/10 rounded-full py-3 pl-12 pr-14 text-sm focus:outline-none focus:border-gold/50 text-white placeholder-gray-600 transition-colors shadow-inner"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 w-9 h-9 bg-gold text-black rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors shadow-[0_0_10px_rgba(212,175,55,0.4)]"
          >
            <Send size={16} strokeWidth={1} className="ml-0.5 icon-shine" />
          </button>
        </div>
      </div>
    </div>
  );
}
