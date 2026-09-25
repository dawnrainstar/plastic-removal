import React from 'react';
import { Sliders, Radio, Magnet, Filter, Plus, RefreshCw } from 'lucide-react';
import { ApheresisTelemetry, PolymerType } from '../types/apheresis';
import { POLYMER_REGISTRY } from '../data/polymers';

interface ControlsColumnProps {
  telemetry: ApheresisTelemetry;
  onChangeTelemetry: (updated: Partial<ApheresisTelemetry>) => void;
  activePolymers: Record<PolymerType, boolean>;
  onTogglePolymer: (polymer: PolymerType) => void;
  onAddContaminationBolus: (amountUgMl: number) => void;
  onResetCircuit: () => void;
}

export const ControlsColumn: React.FC<ControlsColumnProps> = ({
  telemetry,
  onChangeTelemetry,
  activePolymers,
  onTogglePolymer,
  onAddContaminationBolus,
  onResetCircuit,
}) => {
  return (
    <aside className="w-full lg:w-80 shrink-0 bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-100 font-display uppercase tracking-wide">
            Instrument Parameters
          </h3>
        </div>
        <button
          onClick={onResetCircuit}
          className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
          title="Reset Parameters to Calibration Default"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 1. Hemodynamic Flow Rate Control */}
      <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-mono text-slate-300">Blood Flow (Qb)</span>
          <span className="font-mono font-semibold text-cyan-300 tabular-nums">
            {telemetry.bloodFlowRateMlMin} mL/min
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="280"
          step="10"
          value={telemetry.bloodFlowRateMlMin}
          onChange={(e) => onChangeTelemetry({ bloodFlowRateMlMin: Number(e.target.value) })}
          className="w-full accent-cyan-400 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          <span>100 mL/min (Gentle)</span>
          <span>180 (Standard)</span>
          <span>280 (High)</span>
        </div>
      </div>

      {/* 2. Stage 1: Acoustophoretic Transducer Tuning */}
      <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
          <Radio className="w-3.5 h-3.5 text-cyan-400" />
          <span>Stage 1: Ultrasound Standing Wave</span>
        </div>

        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-[11px] font-mono text-slate-400">Piezo Acoustic Power</span>
            <span className="font-mono text-slate-200 tabular-nums">{telemetry.ultrasonicPowerW} W</span>
          </div>
          <input
            type="range"
            min="0"
            max="25"
            step="1"
            value={telemetry.ultrasonicPowerW}
            onChange={(e) => onChangeTelemetry({ ultrasonicPowerW: Number(e.target.value) })}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Frequency: 2.45 MHz · Cell focus threshold: &gt; 8 W
          </span>
        </div>
      </div>

      {/* 3. Stage 2: High-Gradient Magnetic Field */}
      <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
          <Magnet className="w-3.5 h-3.5 text-rose-400" />
          <span>Stage 2: HGMS Magnetic Trap</span>
        </div>

        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-[11px] font-mono text-slate-400">Magnetic Field Gradient</span>
            <span className="font-mono text-slate-200 tabular-nums">
              {telemetry.magneticFieldTesla.toFixed(1)} Tesla
            </span>
          </div>
          <input
            type="range"
            min="0.2"
            max="3.0"
            step="0.1"
            value={telemetry.magneticFieldTesla}
            onChange={(e) => onChangeTelemetry({ magneticFieldTesla: parseFloat(e.target.value) })}
            className="w-full accent-rose-500 cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Halbach Permanent NdFeB Array · SPION affinity: 99.2%
          </span>
        </div>
      </div>

      {/* 4. Target Polymer Selectivity Filter */}
      <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Target Polymer Selectivity</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">MIP Cavity</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 pt-1">
          {(Object.keys(POLYMER_REGISTRY) as PolymerType[]).map((polyKey) => {
            const poly = POLYMER_REGISTRY[polyKey];
            const isTargeted = activePolymers[polyKey];

            return (
              <button
                key={polyKey}
                onClick={() => onTogglePolymer(polyKey)}
                className={`px-2 py-1.5 rounded border text-left flex items-center justify-between text-xs transition-colors ${
                  isTargeted
                    ? 'bg-slate-800 border-slate-700 text-slate-200'
                    : 'bg-slate-950/60 border-slate-900 text-slate-500'
                }`}
              >
                <span className="font-mono font-medium">{polyKey}</span>
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: isTargeted ? poly.colorHex : '#475569' }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Contamination Challenge Bolus Test */}
      <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
          In-Vitro Stress Simulation
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => onAddContaminationBolus(2.0)}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded font-mono text-slate-300 flex items-center justify-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3 text-cyan-400" />
            +2 µg/mL PET
          </button>
          <button
            onClick={() => onAddContaminationBolus(5.0)}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded font-mono text-slate-300 flex items-center justify-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3 text-amber-400" />
            +5 µg/mL Bolus
          </button>
        </div>
      </div>
    </aside>
  );
};
