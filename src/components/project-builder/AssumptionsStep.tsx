import React from 'react';
import ScenarioSliders from '../simulation/ScenarioSliders';
import type { SimulationInput } from '../../types/simulation';

interface Props {
  inputs: SimulationInput;
  onChange: (inputs: SimulationInput) => void;
}

export default function AssumptionsStep({ inputs, onChange }: Props) {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-lg font-medium text-white mb-2">Set Assumptions</h2>
      <p className="text-xs text-text-muted mb-2">Configure project parameters. These will drive the budget simulation and task timeline.</p>
      <ScenarioSliders inputs={inputs} onChange={onChange} onRun={() => {}} loading={false} />
    </div>
  );
}
