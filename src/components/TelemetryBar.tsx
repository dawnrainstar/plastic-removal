import React from 'react';
import { Activity, ShieldCheck, HeartPulse, Droplets } from 'lucide-react';
import { ApheresisTelemetry } from '../types/apheresis';

interface TelemetryBarProps {
  telemetry: ApheresisTelemetry;
  isRunning: boolean;
}

export const TelemetryBar: React.FC<TelemetryBarProps> = ({ telemetry, isRunning }) => {
  return (
    <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Core Extraction Progress Block */}
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              Blood Plastic Clearance
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                {telemetry.overallClearancePercent.toFixed(1)}
              </span>
              <span className="text-xs font-mono text-slate-400">%</span>
              <span className="text-[11px] font-mono text-cyan-400 ml-2">
                [ {telemetry.currentPlasticUgMl.toFixed(2)} / {telemetry.baselinePlasticUgMl.toFixed(2)} µg/mL ]
              </span>
            </div>
          </div>

          <div className="hidden sm:block h-8 w-px bg-slate-800" />

          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              Mass Extracted
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-cyan-300 tabular-nums">
                {telemetry.totalPlasticRemovedMg.toFixed(2)}
              </span>
              <span className="text-xs font-mono text-slate-400">mg</span>
            </div>
          </div>

          <div className="hidden sm:block h-8 w-px bg-slate-800" />

          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              Extracorporeal Volume
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-slate-100 tabular-nums">
                {telemetry.totalBloodProcessedL.toFixed(2)}
              </span>
              <span className="text-xs font-mono text-slate-400">L</span>
              <span className="text-[11px] font-mono text-slate-500 ml-1.5">
                ({telemetry.bloodVolumesProcessed.toFixed(2)}x BV)
              </span>
            </div>
          </div>
        </div>

        {/* Vital Safety Sensors Block */}
        <div className="flex items-center gap-5 text-xs font-mono">
          {/* Hemolysis Index (free hemoglobin) */}
          <div className="flex items-center gap-2 p-1.5 px-2.5 bg-slate-950 rounded border border-slate-800">
            <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
            <div>
              <div className="text-[10px] text-slate-500">FREE HEMOGLOBIN</div>
              <div className="text-slate-200 font-semibold tabular-nums">
                {telemetry.freeHemoglobinMgDl.toFixed(1)} <span className="text-slate-500 font-normal">mg/dL</span>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 ml-1" title="Safety: < 20 mg/dL" />
          </div>

          {/* Transmembrane Pressure */}
          <div className="flex items-center gap-2 p-1.5 px-2.5 bg-slate-950 rounded border border-slate-800">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <div>
              <div className="text-[10px] text-slate-500">CIRCUIT TMP</div>
              <div className="text-slate-200 font-semibold tabular-nums">
                {telemetry.transmembranePressureMmHg.toFixed(0)} <span className="text-slate-500 font-normal">mmHg</span>
              </div>
            </div>
          </div>

          {/* Platelet & Cell Integrity */}
          <div className="hidden lg:flex items-center gap-2 p-1.5 px-2.5 bg-slate-950 rounded border border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <div>
              <div className="text-[10px] text-slate-500">PLATELET RECOVERY</div>
              <div className="text-slate-200 font-semibold tabular-nums">
                {telemetry.plateletRecoveryPct.toFixed(1)} <span className="text-slate-500 font-normal">%</span>
              </div>
            </div>
          </div>

          {/* Flow Rate */}
          <div className="hidden sm:flex items-center gap-2 p-1.5 px-2.5 bg-slate-950 rounded border border-slate-800">
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
            <div>
              <div className="text-[10px] text-slate-500">BLOOD FLOW (Qb)</div>
              <div className="text-slate-200 font-semibold tabular-nums">
                {telemetry.bloodFlowRateMlMin} <span className="text-slate-500 font-normal">mL/min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
