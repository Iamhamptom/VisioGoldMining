import React from 'react';
import { Shield } from 'lucide-react';
import type { RiskImpact } from '../../types/simulation';

interface Props {
  risks: RiskImpact;
}

function RiskCard({ name, score, evidence, mitigations }: {
  name: string; score: number; evidence: string; mitigations: string[];
}) {
  const color = score < 35 ? 'text-green-400' : score < 60 ? 'text-gold' : 'text-red-400';
  const bgColor = score < 35 ? 'bg-green-400/10' : score < 60 ? 'bg-gold/10' : 'bg-red-400/10';
  const borderColor = score < 35 ? 'border-green-400/20' : score < 60 ? 'border-gold/20' : 'border-red-400/20';
  const level = score < 35 ? 'LOW' : score < 60 ? 'MEDIUM' : 'HIGH';

  return (
    <div className={`p-3 rounded-lg ${bgColor} border ${borderColor}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-white uppercase tracking-wider font-medium">{name}</span>
        <span className={`text-lg font-mono font-bold ${color}`}>{score}</span>
      </div>
      <div className={`text-[9px] uppercase tracking-wider mb-2 ${color}`}>{level}</div>
      <p className="text-[10px] text-gray-400 mb-2 leading-relaxed">{evidence}</p>
      {mitigations.length > 0 && (
        <div className="text-[10px] text-gray-500">
          {mitigations.slice(0, 2).map((m, i) => (
            <div key={i} className="flex gap-1"><span className="text-gold">+</span> {m}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RiskScoreCards({ risks }: Props) {
  const riskList = [
    risks.security_risk_score,
    risks.legal_complexity_score,
    risks.esg_risk_score,
    risks.access_risk_score,
    risks.data_completeness_score,
  ];

  return (
    <div className="glass-panel synthetic-energy p-5 rounded-xl border-white/10">
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
        <Shield size={16} strokeWidth={1} className="text-gold icon-shine" /> Risk Impact Assessment
      </h3>
      <div className="flex flex-col gap-3 relative z-10">
        {riskList.map((risk) => (
          <RiskCard key={risk.name} {...risk} />
        ))}
      </div>
    </div>
  );
}
