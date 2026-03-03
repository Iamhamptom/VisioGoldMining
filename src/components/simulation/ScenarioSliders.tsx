import React from 'react';
import { Sliders } from 'lucide-react';
import type { SimulationInput } from '../../types/simulation';

interface Props {
  inputs: SimulationInput;
  onChange: (inputs: SimulationInput) => void;
  onRun: () => void;
  loading?: boolean;
}

function SliderControl({ label, value, min, max, step, unit, onChange }: {
  label: string; value: number; min: number; max: number; step: number; unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-gray-300">{label}</span>
        <span className="text-gold-400 font-mono">{value.toLocaleString()}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-gold h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
    </div>
  );
}

function SelectControl({ label, value, options, onChange }: {
  label: string; value: string; options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-gray-300">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white appearance-none cursor-pointer focus:border-gold-400/50 focus:outline-none">
        {options.map(o => <option key={o.value} value={o.value} className="bg-black">{o.label}</option>)}
      </select>
    </div>
  );
}

export default function ScenarioSliders({ inputs, onChange, onRun, loading }: Props) {
  const set = <K extends keyof SimulationInput>(key: K, value: SimulationInput[K]) =>
    onChange({ ...inputs, [key]: value });

  return (
    <div className="glass-panel synthetic-energy p-5 rounded-xl border-white/10 flex flex-col gap-5">
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
        <Sliders size={16} strokeWidth={1} className="text-gold-400 icon-shine" /> Scenario Inputs
      </h3>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <SelectControl label="Project Type" value={inputs.project_type}
          options={[
            { value: 'exploration', label: 'Exploration' },
            { value: 'small_mine', label: 'Small Mine' },
            { value: 'industrial', label: 'Industrial' },
          ]}
          onChange={(v) => set('project_type', v as SimulationInput['project_type'])} />
        <SelectControl label="Logistics Mode" value={inputs.logistics_mode}
          options={[
            { value: 'road', label: 'Road' },
            { value: 'mixed', label: 'Mixed' },
            { value: 'heli', label: 'Helicopter' },
          ]}
          onChange={(v) => set('logistics_mode', v as SimulationInput['logistics_mode'])} />
        <SelectControl label="Security Posture" value={inputs.security_posture}
          options={[
            { value: 'low', label: 'Low' },
            { value: 'med', label: 'Medium' },
            { value: 'high', label: 'High' },
          ]}
          onChange={(v) => set('security_posture', v as SimulationInput['security_posture'])} />
        <SelectControl label="Drilling Type" value={inputs.drilling_type}
          options={[
            { value: 'RC', label: 'RC' },
            { value: 'diamond', label: 'Diamond' },
            { value: 'mixed', label: 'Mixed' },
          ]}
          onChange={(v) => set('drilling_type', v as SimulationInput['drilling_type'])} />
        <SelectControl label="Assay Package" value={inputs.assay_package}
          options={[
            { value: 'screening', label: 'Screening' },
            { value: 'standard', label: 'Standard' },
            { value: 'full_qaqc', label: 'Full QA/QC' },
          ]}
          onChange={(v) => set('assay_package', v as SimulationInput['assay_package'])} />
        <SelectControl label="Lab Location" value={inputs.labs}
          options={[
            { value: 'local', label: 'Local (DRC)' },
            { value: 'regional', label: 'Regional (SA)' },
            { value: 'international', label: 'International' },
          ]}
          onChange={(v) => set('labs', v as SimulationInput['labs'])} />
        <SelectControl label="Timeline" value={inputs.timeline_aggressiveness}
          options={[
            { value: 'fast', label: 'Fast' },
            { value: 'normal', label: 'Normal' },
            { value: 'conservative', label: 'Conservative' },
          ]}
          onChange={(v) => set('timeline_aggressiveness', v as SimulationInput['timeline_aggressiveness'])} />
        <SelectControl label="Camp Standard" value={inputs.camp_standard}
          options={[
            { value: 'basic', label: 'Basic' },
            { value: 'standard', label: 'Standard' },
            { value: 'premium', label: 'Premium' },
          ]}
          onChange={(v) => set('camp_standard', v as SimulationInput['camp_standard'])} />
        <SelectControl label="Compliance Rigor" value={inputs.compliance_rigor}
          options={[
            { value: 'minimum', label: 'Minimum' },
            { value: 'standard', label: 'Standard' },
            { value: 'investor_grade', label: 'Investor Grade' },
          ]}
          onChange={(v) => set('compliance_rigor', v as SimulationInput['compliance_rigor'])} />
        <SelectControl label="Currency" value={inputs.currency}
          options={[
            { value: 'USD', label: 'USD' },
            { value: 'CDF', label: 'CDF' },
            { value: 'ZAR', label: 'ZAR' },
          ]}
          onChange={(v) => set('currency', v as SimulationInput['currency'])} />
      </div>

      <div className="flex flex-col gap-4 relative z-10">
        <SliderControl label="Drilling Meters" value={inputs.drilling_meters} min={0} max={50000} step={500} unit="m" onChange={(v) => set('drilling_meters', v)} />
        <SliderControl label="Samples Count" value={inputs.samples_count} min={50} max={10000} step={50} unit="" onChange={(v) => set('samples_count', v)} />
        <SliderControl label="Sampling Density" value={inputs.sampling_density_m} min={10} max={100} step={5} unit="m" onChange={(v) => set('sampling_density_m', v)} />
        <SliderControl label="Gold Price Assumption" value={inputs.gold_price_assumption} min={1000} max={3500} step={50} unit=" $/oz" onChange={(v) => set('gold_price_assumption', v)} />
      </div>

      <button onClick={onRun} disabled={loading}
        className="w-full py-3 bg-gold-400 text-black rounded-lg font-semibold text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Running Simulation...</>
        ) : 'Run Simulation'}
      </button>
    </div>
  );
}
