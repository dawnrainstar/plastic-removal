import React from 'react';
import { X, Activity, AlertTriangle, ShieldCheck, Zap, Layers } from 'lucide-react';
import { BloodParticle } from '../types/apheresis';
import { POLYMER_REGISTRY } from '../data/polymers';

interface ParticleInspectorProps {
  particle: BloodParticle | null;
  onClose: () => void;
}

export const ParticleInspector: React.FC<ParticleInspectorProps> = ({ particle, onClose }) => {
  if (!particle) return null;

  const isPlastic = particle.type === 'Plastic';
  const polymer = particle.polymer ? POLYMER_REGISTRY[particle.polymer] : null;

  // Synthesize FTIR / Raman spectrum data for the particle
  const generateSpectrumPoints = () => {
    const points: { cm: number; absorbance: number }[] = [];
    const mainPeak = polymer ? polymer.ftirMainPeakCm : isPlastic ? 1720 : 1650;

    for (let cm = 500; cm <= 3500; cm += 40) {
      // Baseline background noise
      let abs = 0.05 + Math.sin(cm * 0.01) * 0.03;

      // Primary characteristic peak
      const dist1 = Math.abs(cm - mainPeak);
      if (dist1 < 120) {
        abs += Math.exp(-Math.pow(dist1 / 35, 2)) * 0.85;
      }

      // Secondary fingerprint peaks
      if (isPlastic) {
        // C-H stretch around 2920 cm-1
        const distCH = Math.abs(cm - 2920);
        if (distCH < 100) {
          abs += Math.exp(-Math.pow(distCH / 30, 2)) * 0.65;
        }
        // Fingerprint region 1100-1450 cm-1
        const distFP = Math.abs(cm - 1240);
        if (distFP < 80) {
          abs += Math.exp(-Math.pow(distFP / 25, 2)) * 0.5;
        }
      } else {
        // Protein Amide I & II peaks for RBCs (1650 & 1540 cm-1)
        const distAmide1 = Math.abs(cm - 1650);
        if (distAmide1 < 90) abs += Math.exp(-Math.pow(distAmide1 / 30, 2)) * 0.8;
        const distAmide2 = Math.abs(cm - 1540);
        if (distAmide2 < 70) abs += Math.exp(-Math.pow(distAmide2 / 25, 2)) * 0.6;
      }

      points.push({ cm, absorbance: Math.min(1.0, Math.max(0.02, abs)) });
    }
    return points;
  };

  const spectrumPoints = generateSpectrumPoints();

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-lg p-4 shadow-xl text-slate-200">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isPlastic ? 'bg-cyan-400 ring-4 ring-cyan-500/20' : 'bg-rose-500 ring-4 ring-rose-500/20'
              }`}
            />
            <h3 className="text-base font-semibold text-slate-100 font-display tracking-tight">
              {isPlastic ? `${polymer?.name || 'Synthetic Polymer'} (${particle.polymer})` : `Autologous ${particle.type}`}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-1">
            <span>ID #{particle.id}</span>
            <span aria-hidden="true">·</span>
            <span>
              {isPlastic
                ? particle.sizeNm < 1000
                  ? 'Submicron Nanoplastic (MNP)'
                  : 'Microplastic Fragment'
                : 'Native Cellular Component'}
            </span>
            <span aria-hidden="true">·</span>
            <span>Morphology: {particle.shape || 'biconcave disc'}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
          title="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Grid: Telemetry & Spectra */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-3">
        {/* Left Column: Physical & Chemical Metrics */}
        <div className="space-y-2.5">
          <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Physical Diameter
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-bold font-mono text-slate-100 tabular-nums">
                {particle.sizeNm < 1000 ? particle.sizeNm : (particle.sizeNm / 1000).toFixed(2)}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {particle.sizeNm < 1000 ? 'nm' : 'µm'}
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              {particle.sizeNm < 100
                ? 'High capillary barrier translocation risk'
                : particle.sizeNm < 1000
                ? 'Nanoscale vascular circulation'
                : 'Acoustophoretic focus size range'}
            </span>
          </div>

          <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Zeta Surface Potential
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-bold font-mono text-cyan-300 tabular-nums">
                {particle.surfaceChargeMv.toFixed(1)}
              </span>
              <span className="text-xs font-mono text-slate-400">mV</span>
            </div>
            <span className="text-[11px] text-slate-500">
              {particle.surfaceChargeMv < -20
                ? 'High electrostatic stability in plasma'
                : 'Prone to protein corona aggregation'}
            </span>
          </div>

          <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Acoustic Contrast Factor (Φ)
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-bold font-mono text-amber-300 tabular-nums">
                {polymer ? polymer.acousticContrastFactor.toFixed(2) : '+0.25'}
              </span>
              <span className="text-xs font-mono text-slate-400">dimensionless</span>
            </div>
            <span className="text-[11px] text-slate-500">
              {polymer && polymer.acousticContrastFactor < 0
                ? 'Anti-nodal migration (pressure antinode)'
                : 'Nodal migration (channel lateral axis)'}
            </span>
          </div>
        </div>

        {/* Center: Real-time FTIR / Raman Spectroscopy Plot */}
        <div className="lg:col-span-2 p-3 bg-slate-950 rounded border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Laser Micro-Raman / FTIR Spectrogram (500 – 3500 cm⁻¹)</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Diagnostic Peak:{' '}
              <strong className="text-cyan-300">
                {polymer?.ftirMainPeakCm || 1650} cm⁻¹
              </strong>
            </span>
          </div>

          {/* SVG Spectrum Line Graph */}
          <div className="relative w-full h-32 bg-slate-900/60 rounded border border-slate-800/80 overflow-hidden p-2">
            <svg className="w-full h-full" viewBox="0 0 600 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="spectrumGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[30, 60, 90].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="600"
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="2,4"
                  strokeWidth="1"
                />
              ))}

              {/* Spectrum Area */}
              <polygon
                points={`0,120 ${spectrumPoints
                  .map((p, idx) => {
                    const x = (idx / (spectrumPoints.length - 1)) * 600;
                    const y = 120 - p.absorbance * 110;
                    return `${x},${y}`;
                  })
                  .join(' ')} 600,120`}
                fill="url(#spectrumGradient)"
              />

              {/* Spectrum Stroke Line */}
              <polyline
                points={spectrumPoints
                  .map((p, idx) => {
                    const x = (idx / (spectrumPoints.length - 1)) * 600;
                    const y = 120 - p.absorbance * 110;
                    return `${x},${y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke={isPlastic ? '#38bdf8' : '#f43f5e'}
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Peak Marker Pin */}
              {polymer && (
                <g>
                  <circle
                    cx={((polymer.ftirMainPeakCm - 500) / 3000) * 600}
                    cy={15}
                    r="3.5"
                    fill="#38bdf8"
                  />
                  <line
                    x1={((polymer.ftirMainPeakCm - 500) / 3000) * 600}
                    y1={15}
                    x2={((polymer.ftirMainPeakCm - 500) / 3000) * 600}
                    y2={110}
                    stroke="#38bdf8"
                    strokeDasharray="2,2"
                    strokeWidth="1"
                  />
                </g>
              )}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1 px-1">
              <span>500 cm⁻¹</span>
              <span>1500 cm⁻¹</span>
              <span>2500 cm⁻¹</span>
              <span>3500 cm⁻¹</span>
            </div>
          </div>

          {/* Molecular & Pathology Impact Note */}
          <div className="mt-2.5 pt-2 border-t border-slate-800 text-xs text-slate-300">
            {isPlastic ? (
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-amber-300">
                    Pathological Vascular Hazard: {polymer?.toxicityRisk} Risk
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {polymer?.pathologyImpact}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-emerald-300">Cellular Integrity Preserved</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Acoustic node focusing avoids membrane shear stress (shear rate &lt; 500 s⁻¹). No osmotic lysis or hemoglobin leakage detected.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Apheresis Protocol for this particle */}
      {isPlastic && polymer && (
        <div className="mt-3 p-2.5 bg-cyan-950/20 border border-cyan-800/40 rounded flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300">Optimal Extraction Pathway:</span>
            <span className="text-cyan-300 font-semibold">
              {particle.sizeNm > 1500
                ? 'Stage 1 Acoustophoresis (Ultrasonic Standing Wave node split)'
                : 'Stage 2 SPION Biofunctionalized HGMS + Stage 3 MIP Cartridge'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>Density: {polymer.densityGcm3} g/cm³</span>
            <span aria-hidden="true">·</span>
            <span>Formula: {polymer.chemicalFormula}</span>
          </div>
        </div>
      )}
    </div>
  );
};
