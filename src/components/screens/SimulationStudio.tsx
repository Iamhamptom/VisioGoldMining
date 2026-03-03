import React, { useState, useEffect } from 'react';
import { Download, Layers } from 'lucide-react';
import ScenarioSliders from '../simulation/ScenarioSliders';
import CostBreakdownTable from '../simulation/CostBreakdownTable';
import ScheduleCard from '../simulation/ScheduleCard';
import RiskScoreCards from '../simulation/RiskScoreCards';
import ScenarioCompare from '../simulation/ScenarioCompare';
import SaveToBranchButton from '../simulation/SaveToBranchButton';
import { runSimulation, listSimulations, compareSimulations, getDefaultContext } from '../../api/simulations';
import type { SimulationInput, SimulationOutput, ScenarioComparison } from '../../types/simulation';

const DEFAULT_INPUTS: SimulationInput = {
  name: 'New Scenario',
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

export default function SimulationStudio() {
  const [inputs, setInputs] = useState<SimulationInput>(DEFAULT_INPUTS);
  const [outputs, setOutputs] = useState<SimulationOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'simulate' | 'compare'>('simulate');
  const [savedSims, setSavedSims] = useState<{ id: string; name: string }[]>([]);
  const [comparison, setComparison] = useState<ScenarioComparison | null>(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [ctx, setCtx] = useState<{ repoId: string; branchId: string } | null>(null);

  useEffect(() => {
    getDefaultContext().then(c => {
      setCtx({ repoId: c.repoId, branchId: c.branchId });
      listSimulations(c.branchId).then(sims => setSavedSims(sims.map(s => ({ id: s.id, name: s.name }))));
    }).catch(() => {});
  }, []);

  const handleRun = async () => {
    if (!ctx) return;
    setLoading(true);
    setError(null);
    try {
      const result = await runSimulation(ctx.repoId, ctx.branchId, inputs);
      setOutputs(result.outputs);
      setSavedSims(prev => [{ id: result.id, name: result.name }, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async (idA: string, idB: string) => {
    setCompareLoading(true);
    try {
      const result = await compareSimulations(idA, idB);
      setComparison(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Comparison failed');
    } finally {
      setCompareLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col h-full">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-light tracking-tight text-white mb-1">Simulation Studio</h1>
          <p className="text-sm text-text-muted">Cost-per-department, schedule, risk impacts, scenario compare.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setMode(mode === 'simulate' ? 'compare' : 'simulate')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              mode === 'compare' ? 'bg-gold-400/20 text-gold-400 border-gold-400/30' : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
            }`}>
            <Layers size={14} strokeWidth={1} className="icon-shine" />
            {mode === 'compare' ? 'Compare Mode' : 'Compare'}
          </button>
          <button className="p-2 bg-white/5 hover:bg-gold-400/20 text-gold-400 rounded-lg transition-colors border border-gold-400/30">
            <Download size={18} strokeWidth={1} className="icon-shine" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto flex flex-col gap-6 pr-2">
        {mode === 'simulate' ? (
          <>
            {/* Cost Hero */}
            {outputs && (
              <div className="glass-panel synthetic-energy p-6 rounded-xl border-gold-400/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/10 rounded-full blur-3xl"></div>
                <h3 className="text-xs font-semibold text-gold-400 uppercase tracking-wider mb-2 relative z-10">Estimated Total Project Cost</h3>
                <div className="text-4xl font-mono text-white gold-text-glow mb-1 gold-text-alive relative z-10">
                  ${(outputs.total_cost.p50 / 1_000_000).toFixed(2)}M
                </div>
                <p className="text-xs text-gray-400 relative z-10">
                  Range: ${(outputs.total_cost.min / 1_000_000).toFixed(2)}M — ${(outputs.total_cost.p90 / 1_000_000).toFixed(2)}M (P10–P90) | Confidence: {(outputs.total_cost.confidence * 100).toFixed(0)}%
                </p>
              </div>
            )}

            {/* Scenario Name + Save */}
            <SaveToBranchButton
              hasResults={!!outputs}
              scenarioName={inputs.name}
              onNameChange={(name) => setInputs({ ...inputs, name })}
            />

            {/* Sliders */}
            <ScenarioSliders inputs={inputs} onChange={setInputs} onRun={handleRun} loading={loading} />

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">{error}</div>
            )}

            {/* Results */}
            {outputs && (
              <>
                <CostBreakdownTable departments={outputs.department_costs} totalCost={outputs.total_cost} />
                <ScheduleCard schedule={outputs.schedule} />
                <RiskScoreCards risks={outputs.risk_impact} />

                {/* Assumptions */}
                <div className="glass-panel p-4 rounded-xl border-white/10">
                  <h3 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">Assumptions</h3>
                  <ul className="text-xs text-gray-400 space-y-1 relative z-10">
                    {outputs.assumptions.map((a, i) => <li key={i}>• {a}</li>)}
                  </ul>
                </div>
              </>
            )}
          </>
        ) : (
          <ScenarioCompare
            savedSimulations={savedSims}
            onCompare={handleCompare}
            comparison={comparison}
            loading={compareLoading}
          />
        )}
      </div>
    </div>
  );
}
