import React, { useState, useEffect } from 'react';
import { MapPin, Settings, Sliders, FileOutput, Save, ArrowRight, Check } from 'lucide-react';
import SelectAreaStep from '../project-builder/SelectAreaStep';
import ChooseGoalStep from '../project-builder/ChooseGoalStep';
import AssumptionsStep from '../project-builder/AssumptionsStep';
import GeneratePlanStep from '../project-builder/GeneratePlanStep';
import ExportCommitStep from '../project-builder/ExportCommitStep';
import { generatePlan } from '../../api/projectPlans';
import { getDefaultContext } from '../../api/simulations';
import type { SimulationInput } from '../../types/simulation';
import type { ProjectPlan } from '../../types/projectPlan';

const DEFAULT_INPUTS: SimulationInput = {
  name: 'Project Plan Scenario',
  project_type: 'exploration',
  logistics_mode: 'mixed',
  security_posture: 'med',
  sampling_density_m: 50,
  samples_count: 500,
  drilling_meters: 5000,
  drilling_type: 'RC',
  assay_package: 'standard',
  labs: 'regional',
  timeline_aggressiveness: 'normal',
  camp_standard: 'standard',
  compliance_rigor: 'standard',
  currency: 'USD',
  gold_price_assumption: 2000,
};

export default function ProjectBuilder() {
  const [step, setStep] = useState(1);
  const [polygonName, setPolygonName] = useState('');
  const [projectType, setProjectType] = useState('exploration');
  const [inputs, setInputs] = useState<SimulationInput>(DEFAULT_INPUTS);
  const [plan, setPlan] = useState<ProjectPlan | null>(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const [ctx, setCtx] = useState<{ repoId: string; branchId: string } | null>(null);

  useEffect(() => {
    getDefaultContext().then(c => setCtx({ repoId: c.repoId, branchId: c.branchId })).catch(() => {});
  }, []);

  const steps = [
    { id: 1, title: 'Select Area', icon: MapPin },
    { id: 2, title: 'Choose Goal', icon: Settings },
    { id: 3, title: 'Assumptions', icon: Sliders },
    { id: 4, title: 'Generate Plan', icon: FileOutput },
    { id: 5, title: 'Export + Commit', icon: Save },
  ];

  const handleNext = async () => {
    if (step === 3) {
      // Trigger plan generation when advancing from Assumptions to Generate
      setStep(4);
      if (!ctx) return;
      setPlanLoading(true);
      setPlanError(null);
      try {
        const result = await generatePlan(ctx.repoId, ctx.branchId, {
          name: polygonName || 'DRC Project Plan',
          project_type: projectType,
          target_polygon: polygonName,
          logistics_mode: inputs.logistics_mode,
          security_posture: inputs.security_posture,
          timeline_aggressiveness: inputs.timeline_aggressiveness,
        });
        setPlan(result.plan_json as unknown as ProjectPlan);
      } catch (err) {
        setPlanError(err instanceof Error ? err.message : 'Plan generation failed');
      } finally {
        setPlanLoading(false);
      }
    } else {
      setStep(Math.min(5, step + 1));
    }
  };

  const handleGoalSelect = (type: string) => {
    setProjectType(type);
    setInputs(prev => ({ ...prev, project_type: type as SimulationInput['project_type'] }));
  };

  return (
    <div className="p-6 flex flex-col h-full">
      <header className="mb-8">
        <h1 className="text-2xl font-light tracking-tight text-white mb-1">Project Builder Wizard</h1>
        <p className="text-sm text-text-muted">Generate a complete DRC mining project plan step-by-step.</p>
      </header>

      {/* Stepper */}
      <div className="flex justify-between items-center mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-white/10 -z-10"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-gold-400 -z-10 transition-all duration-500" style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}></div>

        {steps.map((s) => {
          const Icon = s.icon;
          const isActive = s.id === step;
          const isCompleted = s.id < step;

          return (
            <div key={s.id} className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                isActive ? 'bg-gold-400 text-black gold-glow' :
                isCompleted ? 'bg-gold-400/20 text-gold-400 border border-gold' :
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

      <div className="flex-1 overflow-y-auto mt-4 pr-1">
        {step === 1 && <SelectAreaStep polygonName={polygonName} onPolygonNameChange={setPolygonName} />}
        {step === 2 && <ChooseGoalStep selected={projectType} onSelect={handleGoalSelect} />}
        {step === 3 && <AssumptionsStep inputs={inputs} onChange={setInputs} />}
        {step === 4 && <GeneratePlanStep plan={plan} loading={planLoading} error={planError} />}
        {step === 5 && <ExportCommitStep planName={polygonName || 'DRC Project Plan'} hasPlan={!!plan} />}
      </div>

      <div className="mt-6 pt-4 border-t border-border-panel flex justify-between">
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          className="px-4 py-2 text-sm text-gray-400 hover:text-white disabled:opacity-50"
        >
          Back
        </button>
        {step < 5 && (
          <button
            onClick={handleNext}
            disabled={planLoading}
            className="px-6 py-2 bg-gold-400 text-black rounded-lg text-sm font-medium hover:bg-yellow-400 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {step === 3 ? 'Generate Plan' : 'Next'} <ArrowRight size={16} strokeWidth={1} className="icon-shine" />
          </button>
        )}
      </div>
    </div>
  );
}
