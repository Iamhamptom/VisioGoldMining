import React, { useState } from 'react';
import { MapPin, Truck, Settings, FileOutput, ArrowRight, Check } from 'lucide-react';

export default function ProjectBuilder() {
  const [step, setStep] = useState(2);

  const steps = [
    { id: 1, title: 'Select Polygon', icon: MapPin },
    { id: 2, title: 'Project Type', icon: Settings },
    { id: 3, title: 'Logistics Mode', icon: Truck },
    { id: 4, title: 'Assumptions', icon: Settings },
    { id: 5, title: 'Generate Plan', icon: FileOutput },
  ];

  return (
    <div className="p-6 flex flex-col h-full">
      <header className="mb-8">
        <h1 className="text-2xl font-light tracking-tight text-white mb-1">Project Builder Wizard</h1>
        <p className="text-sm text-text-muted">Generate a complete DRC mining project plan step-by-step.</p>
      </header>

      {/* Stepper */}
      <div className="flex justify-between items-center mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-white/10 -z-10"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-gold -z-10 transition-all duration-500" style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}></div>
        
        {steps.map((s) => {
          const Icon = s.icon;
          const isActive = s.id === step;
          const isCompleted = s.id < step;
          
          return (
            <div key={s.id} className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                isActive ? 'bg-gold text-black gold-glow' : 
                isCompleted ? 'bg-gold/20 text-gold border border-gold' : 
                'bg-bg-dark border border-border-panel text-gray-500'
              }`}>
                {isCompleted ? <Check size={14} strokeWidth={1} className="icon-shine" /> : <Icon size={14} strokeWidth={1} className="icon-shine" />}
              </div>
              <span className={`text-[10px] uppercase tracking-wider absolute -bottom-5 whitespace-nowrap ${isActive ? 'text-gold' : 'text-gray-500'}`}>
                {isActive ? s.title : ''}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto mt-4">
        {step === 2 && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-lg font-medium text-white mb-2">Choose Project Type</h2>
            
            <div className="grid gap-3">
              <div className="glass-panel p-4 rounded-xl border-gold/50 bg-gold/5 cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gold/10 rounded-bl-full -mr-8 -mt-8"></div>
                <h3 className="text-white font-medium mb-1">Greenfield Exploration</h3>
                <p className="text-xs text-gray-400">Soil sampling, trenching, initial RC drilling. Low initial capex.</p>
              </div>
              
              <div className="glass-panel p-4 rounded-xl border-border-panel hover:border-white/30 cursor-pointer transition-colors">
                <h3 className="text-white font-medium mb-1">Small-Scale Mine (Semi-Industrial)</h3>
                <p className="text-xs text-gray-400">Gravity circuit, minimal footprint, rapid deployment.</p>
              </div>
              
              <div className="glass-panel p-4 rounded-xl border-border-panel hover:border-white/30 cursor-pointer transition-colors">
                <h3 className="text-white font-medium mb-1">Industrial CIL/CIP Plant</h3>
                <p className="text-xs text-gray-400">Full feasibility, large scale earthworks, grid power required.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-border-panel flex justify-between">
        <button 
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          className="px-4 py-2 text-sm text-gray-400 hover:text-white disabled:opacity-50"
        >
          Back
        </button>
        <button 
          onClick={() => setStep(Math.min(5, step + 1))}
          className="px-6 py-2 bg-gold text-black rounded-lg text-sm font-medium hover:bg-yellow-400 transition-colors flex items-center gap-2"
        >
          {step === 5 ? 'Generate' : 'Next'} <ArrowRight size={16} strokeWidth={1} className="icon-shine" />
        </button>
      </div>
    </div>
  );
}
