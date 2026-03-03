import React, { useState } from 'react';
import { FileText, Calendar, DollarSign, CheckCircle2, Download, ExternalLink } from 'lucide-react';

export default function ProjectEvaluator() {
  const [activeTab, setActiveTab] = useState('legal');
  const tabs = [
    { id: 'legal', label: 'Legal/Tenure' },
    { id: 'exploration', label: 'Exploration' },
    { id: 'permitting', label: 'Permitting+ESG' },
    { id: 'operations', label: 'Operations' }
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 pb-0">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-xs text-gold-400 font-mono mb-1 tracking-widest">PE-4102</div>
            <h1 className="text-3xl font-light tracking-tight text-white mb-1">Twangiza Deep</h1>
            <p className="text-sm text-text-muted">South Kivu • Advanced Exploration</p>
          </div>
          <div className="w-12 h-12 rounded-full border border-gold-400/30 flex items-center justify-center text-gold-400 font-mono text-lg gold-glow bg-gold-400/5">
            85
          </div>
        </div>

        <div className="flex gap-3 border-b border-white/5 pb-4 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 relative overflow-hidden ${
                activeTab === tab.id 
                  ? 'bg-gold-400/10 text-gold-400 border border-gold-400/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' 
                  : 'bg-white/5 text-text-muted hover:text-white border border-white/5 hover:bg-white/10'
              }`}
            >
              {activeTab === tab.id && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent synthetic-energy" />}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
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
                    <div className="w-4 h-4 rounded-full border-2 border-gold-400 border-t-transparent animate-spin"></div>
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
                <FileText size={16} strokeWidth={1} className="text-gold-400 icon-shine" /> Document Vault
              </h3>
              <div className="flex flex-col gap-2">
                {[
                  { name: 'CAMI Extract 2025.pdf', type: 'Official', date: 'Jan 12, 2026' },
                  { name: 'JV Agreement_Draft.docx', type: 'Legal', date: 'Feb 04, 2026' },
                  { name: 'Historical_Drill_Logs.zip', type: 'Data', date: 'Nov 20, 2025' }
                ].map((doc, i) => (
                  <div key={i} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition-colors group cursor-pointer border border-transparent hover:border-white/10">
                    <div className="flex items-center gap-3">
                      <FileText size={14} strokeWidth={1} className="text-text-muted group-hover:text-gold-400 transition-colors icon-shine" />
                      <div>
                        <div className="text-sm text-gray-200">{doc.name}</div>
                        <div className="text-[10px] text-text-muted font-mono">{doc.type} • {doc.date}</div>
                      </div>
                    </div>
                    <Download size={14} strokeWidth={1} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity icon-shine" />
                  </div>
                ))}
              </div>
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
                    <div className="bg-gold-400 h-full rounded-full relative">
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
        
        {activeTab !== 'legal' && (
          <div className="flex flex-col items-center justify-center h-64 text-text-muted">
            <ExternalLink size={32} strokeWidth={1} className="mb-4 opacity-50 icon-shine" />
            <p className="font-light">Select a specific project module to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
}
