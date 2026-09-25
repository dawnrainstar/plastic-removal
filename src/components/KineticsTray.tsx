import React from 'react';
import { Activity, ShieldCheck, HeartPulse, Clock } from 'lucide-react';
import { ApheresisTelemetry, ClinicalLogEntry, PolymerType } from '../types/apheresis';
import { POLYMER_REGISTRY } from '../data/polymers';

interface KineticsTrayProps {
  telemetry: ApheresisTelemetry;
  clearedByPolymer: Record<string, number>;
  clinicalLogs: ClinicalLogEntry[];
}

export const KineticsTray: React.FC<KineticsTrayProps> = ({
  telemetry,
  clearedByPolymer,
  clinicalLogs,
}) => {
  const totalClearedParticles = Object.values(clearedByPolymer).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-100 font-display uppercase tracking-wide">
            Real-Time Kinetic Telemetry & Effluent Inspection
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              Elapsed: {Math.floor(telemetry.sessionTimeSec / 60)}m {telemetry.sessionTimeSec % 60}s
            </span>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Extraction Rate: {(telemetry.overallClearancePercent / Math.max(1, telemetry.sessionTimeSec / 60)).toFixed(2)} %/min
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Column 1: Polymer Extraction Breakdown Bar */}
        <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono text-slate-300">Extracted Polymer Fractions</span>
            <span className="font-mono text-cyan-300 font-semibold tabular-nums">
              {totalClearedParticles} particles
            </span>
          </div>

          {/* Stacked Percentage Bar */}
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex">
            {Object.entries(clearedByPolymer).map(([polyKey, count]) => {
              const reg = POLYMER_REGISTRY[polyKey as PolymerType];
              const pct = totalClearedParticles > 0 ? (count / totalClearedParticles) * 100 : 0;
              if (pct === 0) return null;
              return (
                <div
                  key={polyKey}
                  style={{
                    width: `${pct}%`,
                    backgroundColor: reg?.colorHex || '#38bdf8',
                  }}
                  title={`${polyKey}: ${count} (${pct.toFixed(1)}%)`}
                />
              );
            })}
          </div>

          {/* Micro legend */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] font-mono">
            {Object.keys(POLYMER_REGISTRY).map((key) => {
              const count = clearedByPolymer[key] || 0;
              const reg = POLYMER_REGISTRY[key as PolymerType];
              return (
                <div key={key} className="flex items-center gap-1.5 text-slate-400">
                  <span
                    className="w-2 h-2 rounded-sm shrink-0"
                    style={{ backgroundColor: reg?.colorHex }}
                  />
                  <span className="truncate">
                    {key}: <strong className="text-slate-200 tabular-nums">{count}</strong>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Safety Thresholds */}
        <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Cellular Safety & Shear Stress Guard
          </span>

          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between items-center text-[11px] font-mono mb-1">
                <span className="text-slate-400 flex items-center gap-1">
                  <HeartPulse className="w-3 h-3 text-rose-400" /> Free Hemoglobin (Hemolysis)
                </span>
                <span className="text-emerald-400 font-semibold tabular-nums">
                  {telemetry.freeHemoglobinMgDl.toFixed(1)} mg/dL
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all"
                  style={{ width: `${Math.min(100, (telemetry.freeHemoglobinMgDl / 20) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-0.5">
                <span>0 mg/dL</span>
                <span>Threshold: &lt; 20 mg/dL (Safe)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-[11px] font-mono mb-1">
                <span className="text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" /> Platelet Viability
                </span>
                <span className="text-cyan-300 font-semibold tabular-nums">
                  {telemetry.plateletRecoveryPct.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 transition-all"
                  style={{ width: `${telemetry.plateletRecoveryPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Live Clinical Log Tape */}
        <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1.5">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Extracorporeal Session Event Tape
          </span>

          <div className="h-24 overflow-y-auto space-y-1 font-mono text-[10px] text-slate-400 pr-1">
            {clinicalLogs.length === 0 ? (
              <div className="text-slate-600 italic py-4 text-center">
                Awaiting circuit perfusion start...
              </div>
            ) : (
              clinicalLogs
                .slice(-6)
                .reverse()
                .map((log, idx) => (
                  <div key={idx} className="flex items-start justify-between border-b border-slate-900 pb-1">
                    <div>
                      <span className="text-cyan-400">{log.timestamp}</span>
                      <span className="text-slate-300 ml-1.5">{log.note}</span>
                    </div>
                    <span className="text-slate-500 tabular-nums">
                      {log.plasticConcentrationUgMl.toFixed(2)} µg/mL
                    </span>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
