import React from 'react';
import { User, Activity, Sliders, CheckCircle2, AlertCircle } from 'lucide-react';
import { PatientProfile, ApheresisTelemetry } from '../types/apheresis';
import { POLYMER_REGISTRY } from '../data/polymers';

interface PatientProtocolCalculatorProps {
  patient: PatientProfile;
  onChangePatient: (updated: Partial<PatientProfile>) => void;
  telemetry: ApheresisTelemetry;
  onApplyProtocol: () => void;
}

export const PatientProtocolCalculator: React.FC<PatientProtocolCalculatorProps> = ({
  patient,
  onChangePatient,
  telemetry,
  onApplyProtocol,
}) => {
  // Calculate Nadler Estimated Blood Volume
  const hM = patient.heightCm / 100;
  const calculatedEbvL =
    patient.gender === 'Male'
      ? 0.3669 * Math.pow(hM, 3) + 0.03219 * patient.weightKg + 0.6041
      : 0.3561 * Math.pow(hM, 3) + 0.03308 * patient.weightKg + 0.1833;

  const targetVolumeL = calculatedEbvL * patient.targetBloodVolumes;
  const estimatedTimeMin = Math.round((targetVolumeL * 1000) / telemetry.bloodFlowRateMlMin);

  // Clearance kinetic points (Exponential washout curve)
  const kineticPoints: { timeMin: number; concUgMl: number }[] = [];
  const kRate = (0.92 * telemetry.bloodFlowRateMlMin) / (calculatedEbvL * 1000); // clearance constant
  for (let t = 0; t <= Math.max(120, estimatedTimeMin); t += 10) {
    const conc = patient.baselineBurdenUgMl * Math.exp(-kRate * t);
    kineticPoints.push({ timeMin: t, concUgMl: Math.max(0.05, conc) });
  }

  const finalProjectedConc = patient.baselineBurdenUgMl * Math.exp(-kRate * estimatedTimeMin);
  const projectedClearancePct = Math.round(
    ((patient.baselineBurdenUgMl - finalProjectedConc) / patient.baselineBurdenUgMl) * 100
  );
  const totalMassExtractableMg = ((patient.baselineBurdenUgMl - finalProjectedConc) * calculatedEbvL * 1000) / 1000;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 font-display tracking-tight flex items-center gap-2">
            <span>Patient Profile & Clearance Kinetics</span>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              Protocol Optimizer
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Personalized apheresis dosage modeling based on Nadler blood volumetry and single-pass extraction rate.
          </p>
        </div>

        <button
          onClick={onApplyProtocol}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <CheckCircle2 className="w-4 h-4" />
          Apply Dosage to Active Circuit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-5">
        {/* Left Column: Patient Biometrics & Burden Preset */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <User className="w-4 h-4 text-cyan-400" />
            <span>Patient Biometrics</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 font-mono text-[11px] block mb-1">Gender</label>
              <select
                value={patient.gender}
                onChange={(e) => onChangePatient({ gender: e.target.value as 'Male' | 'Female' })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-mono text-[11px] block mb-1">Weight (kg)</label>
              <input
                type="number"
                min="40"
                max="140"
                value={patient.weightKg}
                onChange={(e) => onChangePatient({ weightKg: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 text-xs font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 font-mono text-[11px] block mb-1">Height (cm)</label>
              <input
                type="number"
                min="130"
                max="210"
                value={patient.heightCm}
                onChange={(e) => onChangePatient({ heightCm: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 text-xs font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 font-mono text-[11px] block mb-1">Hematocrit Baseline</label>
              <input
                type="number"
                min="25"
                max="55"
                value={patient.hematocritBaseline}
                onChange={(e) => onChangePatient({ hematocritBaseline: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 text-xs font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800 text-xs">
            <div className="flex justify-between items-center text-slate-400">
              <span>Estimated Blood Volume (Nadler):</span>
              <span className="font-mono text-cyan-300 font-semibold text-sm tabular-nums">
                {calculatedEbvL.toFixed(2)} L
              </span>
            </div>
          </div>

          {/* Baseline Plastic Burden Presets */}
          <div>
            <label className="text-slate-400 font-mono text-[11px] block mb-1.5">
              Blood Plastic Burden: {patient.baselineBurdenUgMl.toFixed(1)} µg/mL
            </label>
            <div className="grid grid-cols-3 gap-1.5 mb-2">
              {[
                { label: 'Normal Env', val: 1.6, ref: 'Leslie 2022 mean' },
                { label: 'High Exposure', val: 4.8, ref: 'Urban/textile workers' },
                { label: 'Atheroma Risk', val: 9.6, ref: 'NEJM 2024 cohort' },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => onChangePatient({ baselineBurdenUgMl: preset.val })}
                  className={`p-1.5 text-left rounded border transition-colors ${
                    Math.abs(patient.baselineBurdenUgMl - preset.val) < 0.1
                      ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-semibold text-[11px]">{preset.label}</div>
                  <div className="text-[9px] font-mono text-slate-500">{preset.val} µg/mL</div>
                </button>
              ))}
            </div>

            <input
              type="range"
              min="0.5"
              max="15.0"
              step="0.1"
              value={patient.baselineBurdenUgMl}
              onChange={(e) => onChangePatient({ baselineBurdenUgMl: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Dominant Polymer */}
          <div>
            <label className="text-slate-400 font-mono text-[11px] block mb-1">
              Dominant Target Polymer
            </label>
            <select
              value={patient.dominantPolymer}
              onChange={(e) => onChangePatient({ dominantPolymer: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
            >
              {Object.values(POLYMER_REGISTRY).map((poly) => (
                <option key={poly.id} value={poly.id}>
                  {poly.name} ({poly.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Middle Column: Target Volume Multiplier & Anticoagulation */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Apheresis Dosage Parameters</span>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Blood Volume Exchange Factor</span>
                <span className="font-mono text-cyan-300 font-semibold">
                  {patient.targetBloodVolumes.toFixed(1)}x ({targetVolumeL.toFixed(1)} L)
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.5"
                step="0.1"
                value={patient.targetBloodVolumes}
                onChange={(e) => onChangePatient({ targetBloodVolumes: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>1.0x (63% clear)</span>
                <span>1.8x (83% clear)</span>
                <span>2.5x (92% clear)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <label className="text-slate-400 font-mono text-[11px] block mb-1">
                Anticoagulation Regimen
              </label>
              <select
                value={patient.anticoagulant}
                onChange={(e) => onChangePatient({ anticoagulant: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
              >
                <option value="ACD-A Citrate">Regional Citrate Anticoagulation (ACD-A)</option>
                <option value="Unfractionated Heparin">Low-Dose Unfractionated Heparin (ACT 180-220s)</option>
                <option value="Bivalirudin">Direct Thrombin Inhibitor (Bivalirudin)</option>
              </select>
              <span className="text-[10px] text-slate-500 mt-1 block">
                {patient.anticoagulant === 'ACD-A Citrate'
                  ? 'Recommended: Zero systemic bleeding risk, neutralized via post-cartridge CaCl2'
                  : 'Systemic heparinization; monitor activated clotting time'}
              </span>
            </div>
          </div>

          {/* Projected Outcomes Summary */}
          <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded space-y-2 text-xs">
            <span className="text-[11px] font-mono uppercase text-cyan-400 tracking-wider font-semibold block">
              Projected Clinical Clearance
            </span>
            <div className="flex justify-between text-slate-300">
              <span>Target Plastic Clearance:</span>
              <span className="font-mono font-bold text-emerald-400 tabular-nums">
                ~{projectedClearancePct}%
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Residual Blood Burden:</span>
              <span className="font-mono text-slate-200 tabular-nums">
                {finalProjectedConc.toFixed(2)} µg/mL
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Total Microplastic Mass Extracted:</span>
              <span className="font-mono font-bold text-cyan-300 tabular-nums">
                {totalMassExtractableMg.toFixed(2)} mg
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Estimated Session Run Time:</span>
              <span className="font-mono text-slate-200 tabular-nums">
                {estimatedTimeMin} min (~{(estimatedTimeMin / 60).toFixed(1)} hrs)
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: First-Order Washout Curve Chart */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Washout Kinetics [C(t) = C₀ · e⁻ᵏᵗ]</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">First-Order Decay</span>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800">
            {/* SVG Decay Curve */}
            <div className="relative w-full h-44">
              <svg className="w-full h-full" viewBox="0 0 300 150">
                {/* Axes and grid */}
                {[30, 60, 90, 120].map((y) => (
                  <line
                    key={y}
                    x1="30"
                    y1={y}
                    x2="290"
                    y2={y}
                    stroke="#1e293b"
                    strokeDasharray="2,4"
                    strokeWidth="1"
                  />
                ))}

                {/* Y-axis labels */}
                <text x="25" y="15" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">
                  {patient.baselineBurdenUgMl.toFixed(0)}
                </text>
                <text x="25" y="75" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">
                  {(patient.baselineBurdenUgMl / 2).toFixed(0)}
                </text>
                <text x="25" y="135" fill="#64748b" fontSize="8" textAnchor="end" fontFamily="monospace">
                  0
                </text>

                {/* Theoretical Curve */}
                <path
                  d={`M ${kineticPoints
                    .map((p) => {
                      const maxT = Math.max(120, estimatedTimeMin);
                      const x = 30 + (p.timeMin / maxT) * 250;
                      const y = 135 - (p.concUgMl / patient.baselineBurdenUgMl) * 120;
                      return `${x},${y}`;
                    })
                    .join(' L ')}`}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                />

                {/* Target endpoint marker */}
                <circle
                  cx={30 + (estimatedTimeMin / Math.max(120, estimatedTimeMin)) * 250}
                  cy={135 - (finalProjectedConc / patient.baselineBurdenUgMl) * 120}
                  r="4"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />

                {/* Live session progress point if session is active */}
                {telemetry.sessionTimeSec > 0 && (
                  <circle
                    cx={
                      30 +
                      Math.min(
                        250,
                        (telemetry.sessionTimeSec / 60 / Math.max(120, estimatedTimeMin)) * 250
                      )
                    }
                    cy={135 - (telemetry.currentPlasticUgMl / patient.baselineBurdenUgMl) * 120}
                    r="4.5"
                    fill="#f43f5e"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                )}
              </svg>
            </div>

            {/* Chart Legend */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-cyan-400" />
                <span>Projected Washout</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Target Dosage Point</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Live State</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800">
            <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
            <p className="text-[11px] leading-relaxed">
              Targeting ~1.8 to 2.2 blood volumes minimizes cellular fatigue while removing &gt;85% of circulating plastic burden.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
